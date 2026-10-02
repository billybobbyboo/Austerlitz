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
| `world.js` | ground: relief model, land cover, water, roads, woods, settlements, mist, `groundY`; the paper map's flat symbology (village footprints, woods) and its own hillshade (since 2E); the ground shader, which draws the land cover per point, and `COVER_ML`/`drawnCover` (since 2F) |
| `symbols.js` | the map layer's counters and names (HTML/SVG builders, accessible names), event and objective glyphs |
| `app.js` | scene, overlays (`OVERLAYS` is historical interpretation data), formations, clock and movement model, derived readings, line of sight, command knowledge, post-processing, the map layer, the paper map's plan camera (`MAPCAM`) and the projection helper `worldPerPx` (since 2E), interface (since 3E the label table `LABELS` and the key table `KEYS`; since 3B the docked layout: `syncDock`, `selectTab`; since 3C the one timeline: `buildTimeline`, `tlPc`, the spine index `SPINE`; since 3D the landscape camera: `LANDCAM`, `bindCanvas`, the view offset `syncViewOffset`, `presetFrame`/`fitOverview`, Follow `syncFollow`, the tween slots `setTween`), runtime checks |
| `build.py` | joins the scripts in load order; writes `austerlitz-command-map.html` (the product, committed) and `bundle.js` (for the tests, not committed) |
| `*test.js`, `audit.js`, `redteam.js` | the regression suite (`binding-test.js`: every arrow bound to the tracks, and the dash rule, since 2C); `tools/run-all.sh` runs it |
| `tools/` | `run-all.sh`, the test-module generators (`mk-helpers.js`, `mk-world-mod.js`), the Stage 0 harness (`visual/`), the Stage 2 and Stage 3 measurement scripts (`stage2/`, `stage3/`, not bundled), and history (see `docs/SUITE_RECOVERY.md`) |
| `archive/` | frozen reference builds: `correction-pass-672aff9f.html`, `stage0-c09c4b23.html`, `stage2c-68ac7721.html` (the `check:data` reference) |
| `docs/` | `VISUAL_AUDIT.md` (the roadmap), `VISUAL_SPEC.md` (Stage 1), `STAGE2_SPEC.md` (Stage 2, with `stage2-evidence/`), `STAGE3_SPEC.md` (Stage 3, with `stage3-evidence/`), `STAGE0_VERIFICATION.md`, `SUITE_RECOVERY.md`, `HANDOFF.md` |

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
  the failed suites, if any suite exits non-zero or prints an error summary. It also runs the Stage 2B height guard
  (`tools/stage2/height-sites.js --check`): no presentation code may read `height()`/`hAt()`; draw on `displayHeight()`
  or `groundY()`, and classify any new call site.
- `npm run check:data`: must pass unless the task changes data on purpose. It compares against `archive/stage2c-68ac7721.html`
  (the Stage 2C build); a data task that changes it lists every changed declaration in `CHANGELOG.md` and moves the reference.
- `npm run check:chronology`: no move with a timed statement is early or late except the unresolved conflicts it names; every
  explicit anchor time carries evidence found in the sources, a grade and a basis; a derived arrival at the march-rate ceiling
  only for the legs it names (`CEILING_FLAGGED`), every other at the tactical rate (a design value, unsourced).
- `npm run check:contrast`: every visible text element in 28 interface states (the map layer's plates and the legend among them, map text also
  over black and white ground, the paper map as entered and close since 2E; Study as it opens and the Now tab on the paper map since 3B;
  Watch on the paper map and on the landscape since 3C; the "?" overlay over both since 3E)
  meets WCAG AA and the 10.5 px floor.
- `npm run check:visual`: 20 fixed views (11 at the 4x default, the low Pratzen view at 1x and 10.33x, since 2E four paper-map views, since 3B
  `narrow-1024`, the undocked layout, and since 3C the phase-8 Overview in Study and in Watch), Stage 0
  thresholds and the in-app `AUSTERLITZ_DEBUG.selfTest()` (its ground, camera, figure, mist, overlay-draping and arrowhead
  checks at 1x, 4x and 10.33x, and since 2D its map-layer checks: no overlap, nothing over a panel or an arrow head, the
  never-dropped items drawn, every dropped formation reachable by hover and keyboard, the legend never over the dispatch).
  Per view since 2D: map-layer drops within `DROP_LIMIT` (what the 2C canvas pass hid there), pass time under 8 ms, every
  map text at its floor and at AA as rendered, the unobstructed fraction at both viewports not below the 2C baseline.
  Since 2E, every paper-map view: north within 0.5 degrees of up, one scale across the view and the scale bar to 1%, nothing
  at figure or landscape scale drawn, its symbology drawn, and the entered views framed inside the unobstructed area; the
  self-test's paper-map checks (flat ground, its own hillshade, the controls, identical at every relief setting).
  Since 2F, the self-test's ground checks: every cover class's drawn edge within 20 m of the model's (`coverClass` on
  `localHeight`), rendered at 1x, 4x, 10.33x and on the paper map; the drawn classes identical at every setting; every tree
  and scrub of a wood inside the drawn wood class; roads and streams at their lift above `groundY`, no edge under it.
  Since 3B: the unobstructed baselines are the 3B build's (raised; never lowered); from 1080 px wide the dispatch is the rail's
  Now tab and Study shows it, below 1080 px a card; the legend opens closed and is never over the rail, the dossier or the
  timebar; the self-test's docked layout, tab keys, phase announcement, dossier-in-the-rail and fit-framing checks.
  Since 3C: the unobstructed baselines are the 3C build's (raised again); the paper map as entered at least 28 px per true km at
  1600 x 900 and 21 at 1280 x 720 (25 and 19 in 3B); the timeline at most 92 px in every view; in Watch the presentation switch in
  the timeline's control row at full opacity and the caption's derived reading shown; at 1280 x 720 the current phase's label never
  cut; the slider (arrows, Shift, Home, End, PageUp, PageDown, its ARIA value) and an event marker's Enter by real key presses; the
  self-test's timeline, hour-numeral, keyboard-group, Watch-switch and spine checks.
  Since 3D: the harness's orbit case drives the right button and aims its wheel at the target; in every landscape view the orbit
  target at the free rectangle's centre within 1 px, also after the resize to 1280 x 720; in the phase-8 Overview views no arrow
  head more than a quarter hidden; the self-test's landscape controls at 1x, 4x and 10.33x from every vantage (a left-drag pans
  within 1 px, the wheel zooms toward the cursor within 1 px, a double-click centres within 2 px, a right-drag orbits, the keys and
  touch, the floor after every step), the offset after each panel change, picking through it, Follow after 14 paths, every
  vantage's target centred and the Overview's battle inside the free rectangle naming its corps and armies, and one tween chain.
  The drop limits of selected-formation (4) and narrow-1024 (6) are the 3C layer's in the 3D framing (owner decision 62).
  Since 3E: by real key presses, Space and Enter on a focused button press it, Ctrl+C does nothing, "?" opens the overlay and
  focus returns when Esc closes it; the self-test's key-table dry run, the overlay, the names and the symbols' largest size;
  `css-test.js` checks the names (no presentation "Map", no ground "Staff map").
  No known residual is allowed (the Walther/Nansouty overlap was fixed in the chronology data task).
- `npm run check:baseline` passes only on the unmodified Stage 3E build (md5 `eb18a8ea...`, 1,342,333 bytes;
  re-baselined from the Stage 3D build `732e04c0...`). A task that changes the build moves it on and says so in `CHANGELOG.md`.
- All nine suites pass (eight on Stage 0, `runtime-test.js` since `docs/HANDOFF.md` task 2; `binding-test.js` since 2C). Never loosen or remove an
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
`docs/STAGE2_SPEC.md`) is reviewed; the chronology data task after it (owner decisions 40-46, §M.7-§M.13) is merged. Stage 2B
(display height and the relief control, 1x / 4x / 10.33x, default 4x; footprints at 1x; standards at the provisional ratio;
the going classes from the model slope) is merged. Stage 2C (the §M.13 precondition, decided: derived arrivals at a tactical
rate where they fit, else the ceiling, flagged; then the movement arrows: derived from the executed leg or marked interpretive,
draped, the Allied chevron, solid boundaries, the halt bar, `binding-test.js`) is merged (#15). Stage 2D (one DOM/SVG
layer, `#maplayer`, for counters and all map text, replacing the canvas sprite pass; compact counters on plates; the
contextual legend) is merged (#17). Stage 2E (the true north-up paper map: an orthographic plan over flat ground with its own
hillshade, pan and zoom-to-cursor in `MAPCAM`, one projection helper, flat village footprints and woods symbology) is merged
(#18). Stage 2F (the ground surface: land cover drawn per point by the ground shader from the model's own classes and a
local-relief grid, `COVER_ML`; the woods' trees inside the drawn wood class; roads and streams draped; the meres' legend row) is
merged (#19); Stage 2 is complete. Stage 3 Part A (the specification, `docs/STAGE3_SPEC.md`) is merged (#21); the owner accepted every
recommendation (decisions 47-60, §0.3). Stage 3B (docked panels: the dispatch as the rail's Now tab from 1080 px, the dossier in
the rail's column, the legend closed by default, the paper map framed to fit, the tablist and the phase live region) is
merged (#22). Stage 3C (one timeline of about 90 px on one time axis: act bands, phase ticks, the rail as the slider, the event
markers; the situation's readings at the top of the Now tab; Watch's switch in the control row; the spine index, built from the
data) is merged (#23). Stage 3D (the camera: pan, orbit, zoom toward the cursor, double-click focus, keys and touch on the
landscape; the focus at the free rectangle's centre by the view offset; Follow; one tween chain; the Overview fitted to the day's
battle with the fog receding and corps and army names drawn far, owner decisions 61-63) is merged (#24). Stage 3E (names:
Study / Watch / Clean, Landscape / Paper map / Landscape with counters, Layers, from `LABELS`; one key table `KEYS` and the "?"
overlay; the key fixes; event glyphs and objective markers capped on screen) is implemented, for review; Stage 3 is then
complete. The spine data task has not started. The shadow toe
and the narrowed landscape hillshade are a temporary lighting correction, to be replaced in Stage 4.
