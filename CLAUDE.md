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
| `shell.html` | CSS, markup, three.js tag; the bundle replaces `/*@@BUNDLE@@*/` |
| `assets.js` | embedded CC0 ground textures |
| `geo.js` | `GEOREF`: the only geographic and scale authority (transform, horizontal and vertical scale, ground truth) |
| `data.js` | historical dataset: phases, order of battle and tracks, features, sources note |
| `analysis.js` | analysis chapters, command knowledge, the two plans, acts, events, guided tour |
| `world.js` | ground: relief model, land cover, water, roads, woods, settlements, mist, `groundY` |
| `symbols.js` | canvas counters and labels |
| `app.js` | scene, overlays (`OVERLAYS` is historical interpretation data), formations, clock and movement model, derived readings, line of sight, command knowledge, post-processing, interface, runtime checks |
| `build.py` | concatenates in load order into `dist/austerlitz-command-map.html` |
| `archive/` | frozen reference builds: `correction-pass-672aff9f.html`, `stage0-c09c4b23.html` |
| `docs/` | `VISUAL_AUDIT.md` (the working roadmap), `STAGE0_VERIFICATION.md`, `SUITE_RECOVERY.md` |
| `tools/visual/` | Stage 0 visual harness, report checker, data-invariance proof, darkness study |

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
- `npm run build`, then `npm run check:data`: must pass unless the task changes data on purpose.
- `npm run check:visual`: 11 fixed views, Stage 0 thresholds and the in-app `AUSTERLITZ_DEBUG.selfTest()`.
  One known residual is allowed by name (hybrid-dimmed Walther/Nansouty counter overlap, Stage 2).
- `npm run check:baseline` passes only on the unmodified Stage 0 build (md5 `c09c4b23...`).
- The correction-pass regression suite is not in the repository yet (`docs/SUITE_RECOVERY.md`). Do not
  describe anything as fully regression-tested, and do not write replacement suites and call them the originals.
- If a check cannot run (for example a blocked download), say exactly what failed.

## Finishing a task
- Update `CHANGELOG.md`: what changed and why, what was verified (numbers), what remains uncertain,
  and the new size and md5 of `dist/austerlitz-command-map.html`. Keep historical uncertainty
  separate from implementation choices.
- Commit `dist/` with the sources. Report files changed, checks run with results, and anything not verified.

## Current state (September 2026)
Stage 0 (trust and baseline) is complete. Stage 1 (visual language) has not started. The shadow toe
and the narrowed landscape hillshade are a temporary lighting correction, to be replaced in Stage 4.
