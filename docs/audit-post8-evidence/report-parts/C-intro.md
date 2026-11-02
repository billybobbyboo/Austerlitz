### C.0 The subsystems audited

The product is one HTML file built by `build.py` from the sources below, with three.js r128 loaded from cdnjs under SRI. Line counts are for
`43e3e5b`.

| subsystem | where (lines) | what it holds | changed in Stage 8 | held by | audited by area |
|---|---|---|---|---|---|
| page shell, start-up, type, tokens | `shell.html` (440), `style.css` (884), `fonts.css` (352), `tokens.js` (113), `build.py` (53) | the markup, the start-up guard `AUS_BOOT`, the embedded type and its licences, the only colour and type source | 8A-8I: the tips, the toast, the far plate's token | `css-test.js`, the 8 start-up cases, `check:baseline` | robustness, a11y, records |
| geographic authority and ground | `geo.js` (128), `world.js` (2,636) | `GEOREF`, relief, land cover, water, roads, woods, villages, buildings, landmarks, garden | 8A ribbons; 8F water, woods, near ground; 8G-8K buildings, landmarks, the castle, the highway | `geo-test.js`, `terrain-test.js`, the self-test | geography, visual-landscape |
| historical dataset | `data.js` (811), `appearance.js` (1,086), `analysis.js` (388), `narrative.js` (637) | phases, order of battle and tracks, features, the appearance and ordnance claims, themes, plans, events, the per-statement claims | 8E `ORDNANCE`; 8G `BUILDINGS`/`CHAPELS`; 8J and 8K re-plots (decisions 259 (a), 260 (a)) | `check:data` (139 declarations), `test.js`, `sim-test.js`, `redteam.js`, `check:chronology` | history, sources-oob, sources-chronology, geography |
| simulation and state | `app.js` (14,255 in all): the clock, tracks and `stateAt`, the dwell, Follow, the readings ("Whose eyes?"), derived readings, selection and dossiers | positions, statuses, grades, readings and every view's state | 8A the readings' reach; 8H the pose at a pause or seek | `sim-test.js`, `runtime-test.js`, `audit.js`, the self-test | state, interaction |
| the 3D picture | `app.js`: scene, light, atmosphere, smoke, the ground shader, the kit, artillery, gait, culling, level of detail | the landscape as drawn | 8B outlines and arrows; 8D culling; 8E kit, gait, artillery; 8F; 8G | the self-test, `runtime-test.js`, `check:visual` | visual-landscape, perf, perf-attribution |
| the map layer | `app.js` `ml*`, `MLS`; `symbols.js` (90) | counters, names, events, places, their priority and their stabiliser in motion | 8C `MLS`; 8I the far plate | the self-test's motion block, `check:visual` | visibility, visual-maps |
| the paper map | `app.js` `MAPCAM`, `world.js` paper symbology | the north-up plan | 8E's water on it, 8I | `check:visual`'s paper cases | visual-maps |
| the interface | `app.js` and `shell.html`: docked layout, timeline, dossiers, sheets, opening and tour, the phone layout, the toast | every panel, control and text a visitor reads | 8A the sources at each dossier's head and the tips; 8H, 8I the toast | the self-test, `check:contrast`, `check:visual`'s phone and live blocks | interaction, a11y |
| tests, benchmarks, CI | 9 suites (`test.js` 533, `runtime-test.js` 1,662, `css-test.js` 1,182 and others), `tools/visual/` (the harness, thresholds, motion driver), `.github/workflows/checks.yml` | the regression suite, the browser checks, the benchmark ceilings, the gate | 8C-8L: the motion block, the census, the cull block, the ceilings (decision 267 (a)) | itself | tests, visibility |
| device evidence | `tools/step6/perf-route.js`, `perf-run.html`, `docs/stage8-evidence/device/` | the frame-time route and its 10 Stage 8 reports | 8D-8F brackets; the reports of 1 Nov 2026 | `phone-rule.js` | perf, perf-attribution |
| records | `CHANGELOG.md`, `CLAUDE.md`, `README.md`, `docs/*.md` | the project's memory of decisions and evidence | every PR | `test.js`'s and `check:chronology`'s text checks, in part | records |

### C.1 Coverage by audit dimension

Depth: **measured** means reproduced by probes or real input on the audited build. **Read** means established from the code, data or records
without running them. **Sampled** means part of the space measured. **Not covered** means no area did it.

| dimension (brief section) | what was examined | depth | what remains outside it |
|---|---|---|---|
| baseline and identity (1) | source, generated, deployed, tested and device-measured builds; the merged PRs; the hashes | measured (hashes, fresh build, Pages fetch) | none |
| historical integrity (3) | every track's anchors and legs against its acts, statuses, grades and claims; the events' claims; the Command tab; the open questions; 26 consistency claims | read and measured (node probes over the data) | the sources themselves for most statements (see E) |
| data integrity (3) | `check:data` 139/139; the forces' figures against the cited sources (42 claims); the strength notes | measured; read against sources | the appearance claims (`appearance.js`) were not re-read against their sources; 6B and the quote check did that |
| geographic integrity (3) | scale, orientation, relief against elevation data, waterways, roads, settlements, landmarks, the garden, the crossings (29 claims) | measured (open data: OSM, Wikidata, terrain models), read | no survey on the ground; 1805 conditions are reconstructions |
| simulation and state (4) | continuity at every critical time (766 checks, a 215,072-sample sweep), Play, the dwell, speed changes, seeks, readings, timers and listeners; 14 interaction scenarios by real input | measured | real-time behaviour on slow devices; Firefox and WebKit |
| visual quality (5) | 100 landscape captures over six vantages and the day, 74 paper-map and layout captures, the label hierarchy, the legend and furniture, long Play runs for visibility (21 runs) | measured (rendered output, SwiftShader) | GPU colour and shimmer on hardware; video of long play (stills and per-frame records only); the smoke (every capture had its motion off); the opening's played stretches in real time; the sources sheet's claims index and the Dress and village dossier sections (`CL-TEST-21`) |
| interaction, accessibility, first use (6) | real mouse, wheel, keys, taps and CDP touch; 400% zoom and 320 px reflow; forced colours (emulated); the accessibility tree; the first-run card and the opening | measured (Chromium; emulated phone) | no screen reader session; no real phone; no Safari or Firefox |
| performance (7) | the 10 device reports and their 349 rows recomputed; the route's definitions; the historical comparisons; CPU attribution against the L3 build (perf-attribution) | measured (recomputation); attribution under software WebGL | no device here; no integrated-GPU run exists |
| carried issues (8) | every item of `docs/STAGE8_SPEC.md` 20.13, 20.14, 21.9, 22.6, 23.4, 24.3, 25.4 and the roadmap's notes (C.4) | per item | as each item says |
| the prior audit's 75 findings | each one's status now, 38 re-read against the code (`docs/audit-post8-evidence/records/prior-findings.md`) | read | 64 resolved, 6 partly, 2 accepted by decision, 2 superseded, 1 open (G-3, `CL-REC-06`) |
| the owner's decisions 239-269 | implemented as decided: examined by content for most (the areas' carried status and findings); 252-254, 256 and 258 only through the passing checks and the records | read and measured, per decision | no per-decision ledger |
| tests and evidence (9) | the required checks run; the gate; threshold history; 33 mutations as negative controls (30 caught, 3 missed); the self-test manifest; the benchmark's meaning | measured | the 317 self-test checks were not read one by one |
| robustness, security, maintainability (10) | HTML sinks, URL parameters, advisories, licences, offline dependence, context loss cycles, resize storms, prolonged use, idle behaviour, dead code, the tools never run by CI | measured and read | penetration testing beyond the page's own inputs; the terms of use of about 460 third-party archive images Pages publishes (`CL-ROB-13`) |

### C.1a Set aside: decisions verified as implemented

Two area results confirm that a decision is implemented as decided. They are not findings:
- the meres' schematic outlines (decision 27) and the castle at about 20% of 8G's size at its site (decision 266 (a)), from geography #11;
- the owner-decided force claims (decisions 184, 202 (b), 210 (c), 213 (b), 243 (a)), consistent with their decisions, from sources-oob #9.
