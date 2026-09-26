# CLAUDE.md: Austerlitz command map

A historically grounded, interactive reconstruction of the Battle of Austerlitz (2 December 1805).
The product is one self-contained HTML (three.js r128 from cdnjs), built from the source files here.
The goal is a historically defensible, geographically coherent, technically robust reconstruction,
not merely an impressive-looking map.

## Priorities, in order
1 historical integrity, 2 data integrity, 3 geographic integrity, 4 simulation integrity,
5 software correctness, 6 visual/UX quality, 7 performance, 8 polish. Never trade a higher one for a
lower one without saying so explicitly.

## Layout
| file | contents |
|---|---|
| `shell.html`, `style.css` | page markup and stylesheet; `build.py` puts the CSS at `/*CSS*/` and the bundle at `/*JS*/` |
| `assets.js` | embedded CC0 ground textures |
| `tokens.js` | `TOKENS`: the only source of interface and symbology colours and type (`docs/VISUAL_SPEC.md`); `python3 build.py --tokens` writes its copy into `style.css`, and the build fails if that copy drifts. Nation colours stay in `NATION` |
| `geo.js` | `GEOREF`: the only geographic and scale authority (transform, horizontal and vertical scale, ground truth) |
| `data.js` | historical dataset: phases, order of battle and tracks, features, sources note |
| `analysis.js` | analysis chapters, command knowledge, the two plans, acts, events, guided tour |
| `world.js` | ground: relief model, land cover, water, roads, woods, settlements, mist, `groundY` |
| `symbols.js` | canvas counters and labels |
| `app.js` | scene, overlays (`OVERLAYS` is historical interpretation data), formations, clock and movement model, derived readings, line of sight, command knowledge, post-processing, interface, runtime checks |
| `build.py` | joins the scripts in load order; writes `austerlitz-command-map.html` (the product, committed) and `bundle.js` (for the tests, not committed) |
| `*test.js`, `audit.js`, `redteam.js` | the regression suite; `tools/run-all.sh` runs it |
| `tools/` | `run-all.sh`, the test-module generators (`mk-helpers.js`, `mk-world-mod.js`), the Stage 0 harness (`visual/`), the Stage 2 measurement scripts (`stage2/`, not bundled), and history (see `docs/SUITE_RECOVERY.md`) |
| `archive/` | frozen reference builds: `correction-pass-672aff9f.html`, `stage0-c09c4b23.html`, `chronology-e76222b3.html` (the `check:data` reference) |
| `docs/` | `VISUAL_AUDIT.md` (the roadmap), `VISUAL_SPEC.md` (Stage 1), `STAGE2_SPEC.md` (Stage 2, with `stage2-evidence/`), `STAGE0_VERIFICATION.md`, `SUITE_RECOVERY.md`, `HANDOFF.md` |

The one-off correction-pass tools (`geo-migrate.js`, `geo-anchor.js`, `patch-app.py`, `patch-history.py`, and the
others listed in `docs/SUITE_RECOVERY.md`) are history: never run them again; their results are already in the data.

## Before changing anything
- Read `CHANGELOG.md` (current state), the relevant part of `docs/VISUAL_AUDIT.md`, and the code you
  will touch. The current code is the source of truth, not old notes or earlier conversations.
- Do only the task given. Do not begin a new stage, redesign, or "improve" beyond it unless asked.
- For anything substantial: establish the current state, identify constraints and dependencies,
  propose the approach, implement conservatively, test, then report.

## Rules
- Never invent historical facts, coordinates, strengths, movements, timings, terrain, uniforms, flags,
  commanders or sources. Label claims as fact, disputed, derived, inference, uncertain, or design
  decision. Where sources disagree, keep the disagreement. Prefer primary and specialist sources.
- `geo.js`, `data.js`, `analysis.js` and the model declarations guarded by
  `tools/visual/data-invariance.js` change only when the task is explicitly about historical or
  geographic data. Then: cite the evidence, record what was, what is, and why, in `CHANGELOG.md`.
- Do not overwrite an established project decision because another assumption seems plausible. If
  evidence contradicts it: state the contradiction and what would need to change; do not change it silently.
- Keep data, simulation and presentation separate. Never fix a data problem by changing only the display.
- `GEOREF` is the only scale authority; never add a second scale constant. Do not move individual
  geographic features in a way that breaks the transform.
- Conservative software changes: no frameworks, no rewrites of working systems, keep the single
  self-contained HTML, keep three.js r128 unless a change is agreed.
- Visual plausibility never substitutes for evidence. Where evidence is uncertain, prefer a defensible
  representation and label the uncertainty.
- Be critical and direct. If the task's premise is wrong, say so and explain why.

## Checks: run them; never claim a result you did not run
- First time: `npm install`, then `npx playwright install chromium` (for the visual harness).
- `npm run build`; `npm test` runs the whole regression suite and prints each suite's result: it exits non-zero, naming
  the failed suites, if any suite exits non-zero or prints an error summary.
- `npm run check:data`: must pass unless the task changes data on purpose. It compares against `archive/chronology-e76222b3.html`
  (the chronology data task's build); a data task that changes it lists every changed declaration in `CHANGELOG.md` and moves the reference.
- `npm run check:chronology`: no move with a timed statement is early or late except the unresolved conflicts it names; every
  explicit anchor time carries evidence found in the sources, a grade and a basis.
- `npm run check:contrast`: every visible text element in 16 interface states meets WCAG AA and the 10.5 px floor.
- `npm run check:visual`: 11 fixed views, Stage 0 thresholds and the in-app `AUSTERLITZ_DEBUG.selfTest()`.
  No known residual is allowed (the Walther/Nansouty overlap was fixed in the chronology data task).
- `npm run check:baseline` passes only on the unmodified chronology-data-task build (md5 `e76222b3...`, 1,121,991 bytes;
  re-baselined from the Stage 1B build `5bf48b75...`). A task that changes the build moves it on and says so in `CHANGELOG.md`.
- All eight suites pass on Stage 0 (`runtime-test.js` since `docs/HANDOFF.md` task 2). Never loosen or remove an
  assertion to make a suite pass.
- If a check cannot run (for example a blocked download), say exactly what failed.

## Finishing a task
- Update `CHANGELOG.md`: what changed and why, what was verified (numbers), what remains uncertain,
  and the new size and md5 of `austerlitz-command-map.html`. Keep historical uncertainty
  separate from implementation choices.
- Commit `austerlitz-command-map.html` with the sources (CI fails if it differs from a fresh build). Report files changed, checks run with results, and anything not verified.

## Current state (September 2026)
Stage 0 (trust and baseline) is complete; the source tree and the regression suite are recovered and
synchronised with it (CHANGELOG.md). Stage 1 (visual language): the specification (`docs/VISUAL_SPEC.md`) and
its implementation (Part B) are done; colours and type come only from `tokens.js`. Stage 2 Part A (the specification,
`docs/STAGE2_SPEC.md`) is reviewed; the chronology data task after it (owner decisions 40-46, §M.7-§M.12: explicit anchor
times with evidence, the phase-start rule documented as the default) is done and awaits review; 2B-2F have not started. The shadow toe
and the narrowed landscape hillshade are a temporary lighting correction, to be replaced in Stage 4.
