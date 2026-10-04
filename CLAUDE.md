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
| `tokens.js` | `TOKENS`: the only source of interface and symbology colours and type (`docs/VISUAL_SPEC.md`; since 4E also the paper map's ground, contours and marsh lines, `sym.paperMap`); `python3 build.py --tokens` writes its copy into `style.css`, and the build fails if that copy drifts. Nation colours stay in `NATION` |
| `geo.js` | `GEOREF`: the only geographic and scale authority (transform, horizontal and vertical scale, ground truth) |
| `data.js` | historical dataset: phases, order of battle and tracks, features, sources note |
| `analysis.js` | analysis chapters (themes: each names its moments, `at` and `moments`, since the spine data task), command knowledge, the two plans, acts, events, guided tour (each stop names a moment) |
| `world.js` | ground: relief model, land cover, water, roads, woods, settlements, `groundY` (since 4C no mist sheets: the fog is the atmosphere's, in `app.js`; since 4E the landscape's colours in `COVER_COL`, `LAND_COL` and `WATER_COL`, the meres' ice and shore ice); the paper map's flat symbology (village footprints, woods) and its own hillshade (since 2E); the ground shader, which draws the land cover per point, and `COVER_ML`/`drawnCover` (since 2F) |
| `symbols.js` | the map layer's counters and names (HTML/SVG builders, accessible names), event and objective glyphs |
| `app.js` | scene, the light (since 4B: the computed sun `SUN_DAY`, the light table `LIGHT_BY_ALT`, `applyLight`, `placeLights` and the fitted shadow box `SHADOW_FIT`), the atmosphere (since 4C: `ATMO`, the fog chunks, `applyAtmo`, `atmoAt`: the haze beyond the focus and the valley fog), pacing (since 4D: the dwell `DWELL`/`dwellAdvance`, Follow while playing `FOLLOW`/`followStep`, the derived arrows' draw-on `DRAWON`/`drawOnArrows`), smoke and the sky (since 4E: `SMOKE`, `smokeAmount`, `smokePlace` with its cap; the dome on the eye, `domeFollow`; the light's fixed colours `LIGHT_RIG` and the sprite palette `SPRITE_COL`), spatial confidence (since 5B: `CONF`, `confPlace`: each formation's position grade drawn on the ground as a patch of the ground's own cells, A crisp, B soft, C diffuse; the landscape's names carry the grade's badge), the event clock (since 5C: `evClock`, an event's start, decision 89, and `evTimeText`), the evidence skeleton (since 5D: `SKEL`,
`skelScope`, `skelDrape`, `skelUpdate`: the plotted anchors by grade and the interpolated legs, split on the ground's triangles; the
ground-cell patch `groundPatch`, shared with 5B), "Whose eyes?" (since 5E: `EYES`, `knowAtClock` (the guarded `knowledgeOf`'s cache
cleared at each minute, decision 92), `drawnKnow`, `knowReason`, `eyesViewshed`; the eye-level vantage `EYE`, `eyeEnter`/`eyeLeave`, the
one camera path below the floor), the ordered routes (since 5F: `ROUTES`, `routeScope`, `routeBuild`, `routeDrapePoly`: each plan
column's route dashed and faint, clipped to the ground's triangles; `routeAxis0`, the phase-0 rule; `routeDeviation`, derived), overlays (`OVERLAYS` is historical interpretation data), formations, clock and movement model, derived readings, line of sight, command knowledge, post-processing, the map layer, the paper map's plan camera (`MAPCAM`) and the projection helper `worldPerPx` (since 2E), interface (since 3E the label table `LABELS` and the key table `KEYS`; since 3B the docked layout: `syncDock`, `selectTab`; since 3C the one timeline: `buildTimeline`, `tlPc`, the spine index `SPINE`; since 5C its interval bars, `EV_BAR`; since 3D the landscape camera: `LANDCAM`, `bindCanvas`, the view offset `syncViewOffset`, `presetFrame`/`fitOverview`, Follow `syncFollow`, the tween slots `setTween`), runtime checks |
| `build.py` | joins the scripts in load order; writes `austerlitz-command-map.html` (the product, committed) and `bundle.js` (for the tests, not committed) |
| `*test.js`, `audit.js`, `redteam.js` | the regression suite (`binding-test.js`: every arrow bound to the tracks, and the dash rule, since 2C); `tools/run-all.sh` runs it |
| `tools/` | `run-all.sh`, the test-module generators (`mk-helpers.js`, `mk-world-mod.js`), the Stage 0 harness (`visual/`), the Stage 2, Stage 3, Stage 4 and Stage 5 measurement scripts (`stage2/`, `stage3/`, `stage4/`, `stage5/`, not bundled), and history (see `docs/SUITE_RECOVERY.md`) |
| `archive/` | frozen reference builds: `correction-pass-672aff9f.html`, `stage0-c09c4b23.html`, `stage2c-68ac7721.html` (the 2C build, on which the drop limits are derived), `spine-6b2cccd4.html` (the spine data task's build), `stage4d-9b13adbf.html` (the `check:data` reference, since 4D's one-word data change) |
| `docs/` | `VISUAL_AUDIT.md` (the roadmap), `VISUAL_SPEC.md` (Stage 1), `STAGE2_SPEC.md` (Stage 2, with `stage2-evidence/`), `STAGE3_SPEC.md` (Stage 3, with `stage3-evidence/`), `STAGE4_SPEC.md` (Stage 4, with `stage4-evidence/`), `STAGE5_SPEC.md` (Stage 5, with `stage5-evidence/`), `STAGE0_VERIFICATION.md`, `SUITE_RECOVERY.md`, `HANDOFF.md` |

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
- `npm run check:data`: must pass unless the task changes data on purpose. It compares against `archive/stage4d-9b13adbf.html`
  (the 4D build, whose `SOURCE_NOTE` says "1×" for "normal speed", decision 76; before it, `archive/spine-6b2cccd4.html`); a data task that changes it lists every changed declaration in `CHANGELOG.md` and moves the reference.
- `npm run check:chronology`: no move with a timed statement is early or late except the unresolved conflicts it names; every
  explicit anchor time carries evidence found in the sources, a grade and a basis; a derived arrival at the march-rate ceiling
  only for the legs it names (`CEILING_FLAGGED`), every other at the tactical rate (a design value, unsourced).
- `npm run check:contrast`: every visible text element in 31 interface states (the map layer's plates and the legend among them, map text also
  over black and white ground, the paper map as entered and close since 2E; Study as it opens and the Now tab on the paper map since 3B;
  Watch on the paper map and on the landscape since 3C; the "?" overlay over both since 3E; since 5E the dossier's knowledge reason, the eye-level
  caption, the paper map with a headquarters' reading)
  meets WCAG AA and the 10.5 px floor.
- `npm run check:visual`: 23 fixed views (11 at the 4x default, the low Pratzen view at 1x and 10.33x, since 2E four paper-map views, since 3B
  `narrow-1024`, the undocked layout, since 3C the phase-8 Overview in Study and in Watch, since 5E the eye level at the Zuran at 4x
  and 1x, and since 5F the Plans tab at the Overview, `plans-overview`), Stage 0
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
  Since the spine data task: the self-test's spine check (every theme and stop resolves to its moments; a theme opens on its
  principal moment and marks the others; stop 7 follows its theme); by real key presses, ← → on a focused button leave the clock.
  Since 4B: the light without the shadow toe through the day (the Field vantage and the low Pratzen view at 4x every hour
  08:00-16:00, three views at 1x and 10.33x) within the Stage 0 darkness limit; the self-test's light checks (the drawn sun against
  the computed one at each factor, the shadow box covering the free rectangle's ground from every vantage, the disc only while the
  sun is up, the light continuous in the clock, no toe and no baked hillshade on the landscape); `css-test.js` checks the toe and
  the hillshade stay out.
  Since 4C: the valley fog's hours (the Field vantage at 08:00, the low Pratzen view at 08:30, at 4x) within the darkness limit,
  map text at AA, drops within the case's limit, formations drawn under the fog, the fog at most its cap; the self-test's
  atmosphere checks (the fog's top at the knowledge model's 238.2 m at each factor, the Command view's "uncertain" exactly the enemy
  in sight under it, the fog's amount continuous and whole while the mist exceeds 0.5, no haze at the orbit target, the fitted
  Overview lightly hazed, none on the paper map, no `fogShift`); `css-test.js` checks the recession and the mist sheets stay out.
  Since 4D: by real key presses, Play runs at ½× with its button pressed; the low Pratzen case in Watch held in the dwell at 09:00 within
  the darkness limit, map text at AA, drops within its limit, its event lit and named; the self-test's pacing checks (the day played
  under Follow at 1x, 4x and 10.33x: never under the floor, every live event in the free rectangle in at least 80% of its minutes,
  the screen speed within 150 px/s, drops never above 19; each derived arrow's marched part ending on its formation's path within
  0.5 units at 20 clocks, over the whole arrow drawn faint, full once complete, decision 83; the day's length at every speed, one
  dwell at each event start; no dwell on scrubbing; reduced motion); `binding-test.js` checks only derived arrows draw on;
  `runtime-test.js` dry-runs the dwell; `css-test.js` checks the default speed and the dwell's toggle.
  Since 4E: in every landscape view the smoke covers at most a quarter of the free rectangle (measure.js `smokeShare`); in the low
  Pratzen view at 1x, 4x and 10.33x any gap between the apron's far edge and the true horizon drawn in the sky's colour above it (within
  10 of 255, the map text hidden); the self-test's smoke and ice checks (a formation smokes only with a fighting status, at full only in
  a naming event's window, decision 77; every puff's lower edge above the drawn ground; the meres and the shore ice under their own
  edge at each factor); `css-test.js` checks the landscape's colours are in their tables and the paper map's ground in the tokens
  (decision 79).
  Since 5B: in every view the position-confidence marks' share of the free rectangle as rendered (`measure.js` `confShare`, the view
  drawn once more without them) at most `CONF_SHARE` (landscape and paper map); the self-test's confidence checks (every formation on the
  field drawn at its `confAt` grade, size and side colour at 20 clocks; every mark's triangles sampled every 0.5 units, none under the
  drawn ground, at 1x, 4x and 10.33x; every landscape name carrying its grade's badge; on the paper map B and C capped at a quarter of the
  free rectangle, never below the footprint; the legend's grade rows what is drawn); `css-test.js` checks the marks have no dash, the side's
  token colour and are on by default (decision 85); `runtime-test.js` dry-runs them.
  Since 5C: the self-test's interval-bar checks (one bar per interval and none for an instant, its edges within 1 px of `tlPc` of its window,
  at most four lanes, none overlapping in a lane, none over an hour numeral, the timebar's height unchanged; the bars at 3:1 against the
  timebar in the dark and the paper themes) and its one-event-clock check (every marker, the event keys' stops, `momentOf`, the dwell and the
  dossier's "Go to this moment" at the event's start, decision 89); the harness's marker Enter at the marker's minute, the start;
  `runtime-test.js`'s forward event jumps stop at every distinct start, then the end.
  Since 5D: in every view, with the evidence skeleton on for the whole day, the map layer's items and drops unchanged and its text at AA
  as rendered; the self-test's skeleton checks (at 1x, 4x and 10.33x every leg piece inside one ground triangle at its lift, sampled every
  0.5 units, and every anchor mark's triangles, none under the drawn ground; the scope, decision 90, phase by phase, a family and the
  whole day; every mark a plotted anchor at its position, graded by `stateAt` with its grade's mask, every leg on `legPath` through its
  anchors and vias; the grade by shape and one undashed line; about 9 px on screen; no map-layer item; the hover; the legend's row; the
  paper map's colour; none in Clean); `css-test.js` checks it draws no dash, the annotation token's colour, off by default with its whole
  day off; `runtime-test.js` dry-runs it.
  Since 5E: the eye-level views (`eye-zuran`, `eye-zuran-1x`): the eye exactly 3 m (scaled) above the drawn ground at the headquarters in
  place of the camera floor (the one exception, decision 91), drops within the limits measured on the 5E build, map text at AA; no
  skeleton measure there (not drawn at the eye); the self-test starts from the omniscient view and restores the reading after; its 5E
  checks (at 1x, 4x and 10.33x the eye at the headquarters, nothing the reading does not know drawn, no enemy figures the model hides, the
  caption, an orbit back to the floor; the reading at the clock every 10 minutes for both headquarters, decision 92; reported only drawn
  as the C zone without figures and marked "?" in the landscape, with counters and on the paper map; the viewshed's fogged cells exactly
  those below the rule's threshold; the dossier's reason; the control); `css-test.js` checks the one control, its model-reading label, the
  eye's vantage hidden until a headquarters is chosen; `runtime-test.js` dry-runs the reading at the clock and the reasons.
  Since 5F: in every view but the eye level, with the ordered routes on, the map layer's items and drops unchanged and its text at AA as
  rendered; `plans-overview` (the Plans tab, both plans, at the Overview: decision 94) within its drop limit, measured on the 5F build; the
  self-test starts without the Plans overlay and restores it after; its 5F checks (at 1x, 4x and 10.33x every dash's triangles sampled every
  0.5 units, none under the drawn ground, every point at its lift; each route on its column's `PLANS` route, dashed at its duty,
  depth-tested, nothing dimmed; the scope phase by phase, a family, the phase-0 rule against the axis arrows; the dossier's derived
  distance, the legend's row, the paper map, none in Clean); `binding-test.js` allows `routeBuild`, the one new dashed drawer, and checks
  it dashes only a plan column's route; `css-test.js` checks it is off by default, named, the side's token colour, the legend's dash
  sample; `runtime-test.js` dry-runs it.
  No known residual is allowed (the Walther/Nansouty overlap was fixed in the chronology data task).
- `npm run check:baseline` passes only on the unmodified Stage 5F build (md5 `4c7bb9e4...`, 1,510,672 bytes;
  re-baselined from the Stage 5E build `b50a087c...`). A task that changes the build moves it on and says so in `CHANGELOG.md`.
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
overlay; the key fixes; event glyphs and objective markers capped on screen) is merged (#25); Stage 3 is complete. The spine data
task (themes and tour stops name their moments, `ANALYSIS.at`/`moments` and `TOUR.at`; owner decisions 52, 59, 64-67; one timeline
line moved; decision 56's sentence in `SOURCE_NOTE`; ← → on a focused button no longer step the clock) is merged
(#26). Stage 4 Part A (the specification, `docs/STAGE4_SPEC.md`: the computed sun and continuous light, the atmosphere and the
valley fog, pacing, smoke, ice, the horizon and the 3D palette; probes in `tools/stage4/`) is merged (#27); the owner accepted
every recommendation (decisions 68-82, §0.4). Stage 4B (the light: the computed sun, its altitude corrected to the display factor,
one light table keyed by the sun's altitude, a fill opposite the sun in place of Stage 0's shadow toe, no baked hillshade on the
landscape, the shadow box fitted to the view) is merged (#28). Stage 4C (the atmosphere: one haze and valley fog in the fog chunks,
the haze counted beyond the focus, the fog's top the Command view's 238.2 m and its amount `PHASES[].mist` eased in the clock, drawn
at most 55% opaque; `fogShift` and the mist sheets gone) is merged (#29). Stage 4D (pacing: Play at ½×, a dwell at each event start
with its toggle, Follow continuous while playing at 230-300 units, derived arrows drawn whole and faint with the part marched at full
strength, owner decision 83; decision 76's one-word data change, the `check:data` reference moved) is merged (#30). Stage 4E (smoke in
puffs along the front, its amount by the naming events and capped on screen; the meres' ice and shore ice; the sky dome on the eye, the
horizon the haze's colour; the 3D colours in named tables, the paper map's ground in the tokens) is merged (#31); Stage 4 is complete. Stage 5 Part A (the specification, `docs/STAGE5_SPEC.md`: spatial
confidence, the evidence skeleton, interval bars on the timeline, "Whose eyes?" with eye-level views, plan ghosts, day-tracks; probes in
`tools/stage5/`; no source file changed) is merged (#32); the owner accepted questions 1-4 (decisions 85-88, §0.4). Stage 5B (spatial
confidence: each formation's position grade drawn on the ground at every factor and on the paper map, A its crisp footprint, B a soft
frontage, C a diffuse zone of its frontage's radius, a patch of the ground's own cells; the landscape's names carry the grade's badge; a
"Position confidence" toggle, on) is merged (#33). Stage 5C (interval events as bars on the timeline, in up to four lanes inside the event
row; owner decision 89: one event clock, an event's start, for the marker, its keys, the themes, the tour, the dwell and the dossier) is
merged (#34). Stage 5D (the evidence skeleton: a layer, off by default, drawing each formation's plotted anchors by grade, filled A, ring
B, small open ring C, a tick for an explicit time, and the legs the clock interpolates between them as thin solid lines on the drawn
ground; owner decision 90: the selected formation's family, else the legs meeting the current phase, or the whole day) is
merged (#35). Stage 5E ("Whose eyes?": one control, everyone / Napoleon's headquarters / the Allied headquarters, in the Command tab and
the timeline, labelled a model reading; the reading at the clock, decision 92; reported only drawn as the C zone without figures; the
headquarters' viewshed with its fogged ground; the dossier's reasons; the eye-level vantage at the headquarters, decision 91) is
merged (#36). Stage 5F (the ordered routes: a layer, off by default, drawing each plan column's route faint and dashed under the figures,
owner decision 93; the Plans tab's harness case at the Overview, decision 94; the Plans tab itself unchanged) is implemented, for review.
