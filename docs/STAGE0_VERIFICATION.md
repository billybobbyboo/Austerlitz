# Stage 0 verification report

Build verified: `austerlitz-command-map.html`, 1097610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`.
Compared with: the verified correction-pass build, md5 `672aff9f0d1b1673d079903185d39351`.
Environment: headless Chromium (Playwright 1.56) with SwiftShader WebGL, three.js r128, one CPU.

## Verdict
Stage 0 fixes verified by the checks below. The correction-pass suite (`tools/run-all.sh`) was not run: the
source tree and its tools were not available. This is not a certification of the whole project.

## Self-test (13 of 13 pass)
- pass: ground: groundY() returns the drawn terrain at its vertices — largest |groundY - height| at mesh vertices 4.9e-6
- pass: camera: every fixed and computed view is above the ground — 35 fixed views (vantages, phases, chapters, tour stops, staff map), lowest 21.1 units at vantage zuran; 473 centring views, lowest 38.7 at centring on constantine at 07:30
- pass: camera: glides between tour stops, phases, chapters and vantages stay above the ground — 1150 positions sampled; lowest clearance 18.67 units; the floor lifted 0 of them
- pass: camera: orbiting at the lowest pitch and closest zoom never enters the ground — 840 orbit positions around 35 targets; lowest clearance 1.80 units
- pass: camera: no path placed the eye below the floor before a frame — render-time guard count 0
- pass: figures: every visible man, horse and standard stands on the drawn ground — 78 states (10 phases and 3 marching moments; terrain and hybrid; no highlight and two highlight families), 474180 figure placements; worst 0.0006 units (dok at 15:45, terrain)
- pass: first run: the colour key agrees with the legend, and the legend with what is drawn — "Blue is the French army. The Allies are green for Russia and white for Austria, and their movement arrows are drawn in amber. The high ground in the c..."
- pass: dossiers: elevations are metres through GEOREF, never model units — 24 place dossiers and 9 terrain-study dossiers
- pass: watch mode: a selection is always shown, and clearing it clears the dimming — Watch, formation selected: chip shown, dossier hidden, family highlighted; chip opens the dossier in Study, selection kept; entering Watch clears selection, chip and dimming; Watch, event selected: chip shown; chip clears the selection; clean map view, selection: chip shown; nothing selected: no chip, no dimming; Study, selection: dossier shown, no chip
- pass: sprites: smoke and dust fade to nothing at every edge — largest edge alpha: smoke 0, dust 0 of 255
- pass: mist: no sheet shows where the ground rises through it — 14053 sheet vertices at or below the ground, 0 with any alpha
- pass: derived readings unchanged: the plateau at 04:00, both army totals, the movement audit — Allied on the plateau at 04:00 = 38,700 (changelog 38,700); totals within 85,400 and 73,000 at 57 moments; movement audit 0 findings
- pass: render on demand: a view at rest draws nothing; slow drift alone draws at the ambient rate — paper map at rest: idle; landscape at 04:10 with mist: idle (drift is off in harness or reduced-motion mode)

## Visual thresholds, delivered build
```
report app.html  md5 c09c4b23d9e245ff9d693960cf9496b9  cases 11
PASS first-run             figures 0.0002  camera 275.201  overlaps 0  solid-black 0  near-black 0
PASS overview-field        figures 0.0003  camera 95.367  overlaps 0  solid-black 0  near-black 0.0026
PASS overview-plan         figures 0.0003  camera 275.201  overlaps 0  solid-black 0  near-black 0.0033
PASS close-sokolnitz       figures 0.0002  camera 23.475  overlaps 0  solid-black 0  near-black 0.0004
PASS staff-paper           figures 0  camera 275.201  overlaps 0  solid-black 0  near-black 0
PASS pratzen-low           figures 0.0002  camera 21.785  overlaps 0  solid-black 1  near-black 0.025
PASS selected-formation    figures 0.0002  camera 68.812  overlaps 0  solid-black 0  near-black 0.0067
PASS watch-selected        figures 0.0002  camera 65.841  overlaps 0  solid-black 1  near-black 0.0256
KNOWN hybrid-dimmed         residual carried to Stage 2: counter:nansouty / counter:walther
PASS hybrid-dimmed         figures 0.0001  camera 57.448  overlaps 1 (known)  solid-black 0  near-black 0.0145
PASS pratzen-orbit-min     figures 0.0003  camera 1.807  overlaps 0  solid-black 0  near-black 0.0001
PASS first-run-laptop      figures 0.0002  camera 275.201  overlaps 0  solid-black 0  near-black 0
in-app self-test (61906 ms):
  PASS ground: groundY() returns the drawn terrain at its vertices
  PASS camera: every fixed and computed view is above the ground
  PASS camera: glides between tour stops, phases, chapters and vantages stay above the ground
  PASS camera: orbiting at the lowest pitch and closest zoom never enters the ground
  PASS camera: no path placed the eye below the floor before a frame
  PASS figures: every visible man, horse and standard stands on the drawn ground
  PASS first run: the colour key agrees with the legend, and the legend with what is drawn
  PASS dossiers: elevations are metres through GEOREF, never model units
  PASS watch mode: a selection is always shown, and clearing it clears the dimming
  PASS sprites: smoke and dust fade to nothing at every edge
  PASS mist: no sheet shows where the ground rises through it
  PASS derived readings unchanged: the plateau at 04:00, both army totals, the movement audit
  PASS render on demand: a view at rest draws nothing; slow drift alone draws at the ambient rate
all Stage 0 checks pass for this report
```

## Same thresholds, original build (expected to fail)
```
report orig.html  md5 672aff9f0d1b1673d079903185d39351  cases 11
FAIL first-run             a figure is 5.0241 units off the drawn ground (prz floats 5.02) | a standard's foot is 9.49 units off the ground | smoke sprites have a visible edge (alpha 71/255) | dust sprites have a visible edge (alpha 35/255) | mist visible where the ground rises through it (alpha 0.447) | first-run card stacked on the dispatch card
FAIL overview-field        a figure is 15.9459 units off the drawn ground (sthilaire floats 15.95) | a standard's foot is 7.348 units off the ground | smoke sprites have a visible edge (alpha 71/255) | dust sprites have a visible edge (alpha 35/255) | mist visible where the ground rises through it (alpha 0.447) | solid near-black regions cover 0.515% of the map (41 blocks of 8x8; limit 0.05%)
FAIL overview-plan         a figure is 13.9212 units off the drawn ground (sthilaire floats 13.92) | a standard's foot is 8.207 units off the ground | 1 overlapping labels or counters {"namexplateau":1}: name:rg_cav / plateau:plateau | smoke sprites have a visible edge (alpha 71/255) | dust sprites have a visible edge (alpha 35/255) | mist visible where the ground rises through it (alpha 0.447)
FAIL close-sokolnitz       a figure is 3.7157 units off the drawn ground (dok sinks 3.72) | a standard's foot is 5.751 units off the ground | 1 overlapping labels or counters {"eventxname":1}: name:kienmayer / event:davout | smoke sprites have a visible edge (alpha 71/255) | dust sprites have a visible edge (alpha 35/255) | mist visible where the ground rises through it (alpha 0.447) | solid near-black regions cover 5.238% of the map (958 blocks of 8x8; limit 0.05%)
FAIL staff-paper           13 overlapping labels or counters {"counterxcounter":10,"counterxplateau":3}: counter:gqg / counter:c_gren; counter:gqg / counter:c_gd; counter:c_gren / counter:c_gd; counter:ahq / counter:c_iv | smoke sprites have a visible edge (alpha 71/255) | dust sprites have a visible edge (alpha 35/255)
FAIL pratzen-low           a figure is 5.7624 units off the drawn ground (kamensky sinks 5.76) | a standard's foot is 6.96 units off the ground | smoke sprites have a visible edge (alpha 71/255) | dust sprites have a visible edge (alpha 35/255) | mist visible where the ground rises through it (alpha 0.022) | solid near-black regions cover 17.173% of the map (3141 blocks of 8x8; limit 0.05%)
FAIL selected-formation    a figure is 15.7315 units off the drawn ground (sthilaire floats 15.73) | a standard's foot is 7.77 units off the ground | smoke sprites have a visible edge (alpha 71/255) | dust sprites have a visible edge (alpha 35/255) | mist visible where the ground rises through it (alpha 0.022) | solid near-black regions cover 73.910% of the map (3034 blocks of 8x8; limit 0.05%)
FAIL watch-selected        a figure is 5.496 units off the drawn ground (kamensky sinks 5.50) | a standard's foot is 7.75 units off the ground | smoke sprites have a visible edge (alpha 71/255) | dust sprites have a visible edge (alpha 35/255) | mist visible where the ground rises through it (alpha 0.022) | solid near-black regions cover 73.619% of the map (13465 blocks of 8x8; limit 0.05%) | selection f:kamensky is shown nowhere
KNOWN hybrid-dimmed         residual carried to Stage 2: counter:nansouty / counter:walther
FAIL hybrid-dimmed         a figure is 6.4471 units off the drawn ground (kamensky floats 6.45) | a standard's foot is 4.611 units off the ground | 30 overlapping labels or counters {"counterxcounter":27,"counterxplateau":3}: counter:sthilaire / counter:ahq; counter:sthilaire / counter:kamensky; counter:sthilaire / counter:milo; counter:sthilaire / counter:kollo | smoke sprites have a visible edge (alpha 71/255) | dust sprites have a visible edge (alpha 35/255) | mist visible where the ground rises through it (alpha 0.022) | solid near-black regions cover 50.399% of the map (9218 blocks of 8x8; limit 0.05%) | selection f:c_iv is shown nowhere
FAIL pratzen-orbit-min     camera only -12.275 units above the drawn ground (floor 1.8) | a figure is 5.3318 units off the drawn ground (sthilaire sinks 5.33) | a standard's foot is 7.632 units off the ground | 1 overlapping labels or counters {"overlayxplateau":1}: plateau:plateau / overlay:2 | smoke sprites have a visible edge (alpha 71/255) | dust sprites have a visible edge (alpha 35/255) | mist visible where the ground rises through it (alpha 0.447) | solid near-black regions cover 15.347% of the map (2807 blocks of 8x8; limit 0.05%)
FAIL first-run-laptop      a figure is 5.0241 units off the drawn ground (prz floats 5.02) | a standard's foot is 9.49 units off the ground | smoke sprites have a visible edge (alpha 71/255) | dust sprites have a visible edge (alpha 35/255) | mist visible where the ground rises through it (alpha 0.447) | first-run card stacked on the dispatch card
FAILURES: 69
```

## Data invariance
```
original orig.html: 395 top-level statements;  patched app.html: 439

DATA (must be byte-identical):
  identical historical datasets: 18 declarations, 770,653 bytes
  identical geography and relief model: 43 declarations, 14,260 bytes
  identical movement, strength and confidence model: 34 declarations, 7,993 bytes
  identical derived readings, sight and knowledge: 17 declarations, 5,056 bytes

Rendering and interface declarations changed (31): buildWorld, makePalette, photoAtlas, photoNormal, buildMist, drawSymbol, makeFeatureGlyph, makePlainLabel, init, makeBlock, placeStandards, smokeTexture, dustTexture, applyArc, initFX, renderFX, renderFrame, updatePlateauRing, updateSelRing, startTour, declutter, settleBlock, poseBlock, updateVisibility, bindCanvas, buildUI, paintDrawer, dossierFeature, dossierAnalysis, setPresentation, loop
Added (44): GROUND_W,GROUND_D,GROUND_NX,GROUND_NZ, groundY, MIST_DRIFT, mistSheet, HARNESS, _stQ,_stZ,_stP,_stO,_stS,_stM,_stAx,_stG, softWindow, _sfR, spriteFloor, DEV, devMark, devOn,_devT,_devSeat, kfmt, paintDevStats, LABEL_STATS, _cR,_cU,_lv,_lw, ECH_RANK, labelRect, _panelSel, panelCovers, SEAT_STATS, CAM_CLEAR,CAM_R,CAM, camGround, camFloor, clampCamera, _ov, orbitPlace, hexOf, COLOUR_KEY, paintKey, firstRunOpen, openFirstRun, closeFirst, drawerShown, syncSelChip, paintDrawerBody, FEATURE_GT, needFrames,lastInput,lastAmbient,settling,FK, AMBIENT_MS,INPUT_HOLD_MS, requestRender, ease, ambientNow, frameState, AUSTERLITZ_DEBUG
Removed (0): none

Outside the script: CSS changed (+2428 bytes; the original rules are kept verbatim, additions appended); markup changed; closing identical

All 112 DATA declarations are byte-identical to the original build.
```

## Edit list
```
73 edits applied; result md5 c09c4b23d9e245ff9d693960cf9496b9 MATCHES the delivered Stage 0 build
```

## Measurements
| Case | Largest figure error (units) | Standards | Solid black 8x8 blocks | Near-black pixels | Overlapping labels/counters | Eye above ground | Selection shown |
|---|---|---|---|---|---|---|---|
| first-run | 5.0241 → 0.0002 | 9.49 → 0.00 | 0 → 0 | 0.48% → 0.00% | 0 → 0 | 136.39 → 275.20 | - |
| first-run-laptop | 5.0241 → 0.0002 | 9.49 → 0.00 | 0 → 0 | 0.52% → 0.00% | 0 → 0 | 136.39 → 275.20 | - |
| overview-field | 15.9459 → 0.0003 | 7.35 → 0.00 | 41 → 0 | 1.70% → 0.26% | 0 → 0 | 95.37 → 95.37 | - |
| overview-plan | 13.9212 → 0.0003 | 8.21 → 0.00 | 0 → 0 | 0.00% → 0.33% | 1 → 0 | 275.20 → 275.20 | - |
| close-sokolnitz | 3.7157 → 0.0002 | 5.75 → 0.00 | 958 → 0 | 12.82% → 0.04% | 1 → 0 | 23.48 → 23.48 | - |
| staff-paper | 0.0000 → 0.0000 | 0.00 → 0.00 | 0 → 0 | 0.00% → 0.00% | 13 → 0 | 275.20 → 275.20 | - |
| pratzen-low | 5.7624 → 0.0002 | 6.96 → 0.00 | 3141 → 1 | 24.07% → 2.50% | 0 → 0 | 21.79 → 21.79 | - |
| pratzen-orbit-min | 5.3318 → 0.0003 | 7.63 → 0.00 | 2807 → 0 | 19.44% → 0.01% | 1 → 0 | -12.28 → 1.81 | - |
| selected-formation | 15.7315 → 0.0002 | 7.77 → 0.00 | 3034 → 0 | 84.61% → 0.67% | 0 → 0 | 68.81 → 68.81 | dossier → dossier |
| watch-selected | 5.4960 → 0.0002 | 7.75 → 0.00 | 13465 → 1 | 83.92% → 2.56% | 0 → 0 | 65.84 → 65.84 | nowhere → chip |
| hybrid-dimmed | 6.4471 → 0.0001 | 4.61 → 0.00 | 9218 → 0 | 65.86% → 1.45% | 30 → 1 | 57.45 → 57.45 | nowhere → chip |

In every case: smoke and dust texture edge alpha 71/35 → 0/0 (of 255); mist alpha where the ground crosses a sheet 0.447 → at most 0.007.
Figures and standards: distance from the drawn ground, world units (about 6 m of vertical scale each). Near-black: pixels whose brightest channel is below 16/255, outside the interface panels; it includes legitimately black details, so the black-slope test is the solid-block column. Eye above ground: world units.

**Orbit into the hill (`pratzen-orbit-min`).** Centred on place pratzenv, zoomed fully in, dragged to the lowest pitch and turned toward the rising ground, the orbit asks for an eye 12.28 units below the drawn ground. The original build puts it there: 12.28 units below the ground, the black silhouette with men apparently floating above it. The Stage 0 floor holds it 1.81 units above.

## Darkness study
| Build | Near-black pixels | Solid black 8x8 blocks | Mean luminance |
|---|---|---|---|
| A original build | 13.63% | 1028 | 57.1 |
| B original grade+palette, Stage 0 seating | 21.96% | 2875 | 91.2 |
| C + contrast in perceptual space (clamped) | 7.02% | 579 | 101 |
| D + narrower landscape hillshade  (the 7.4% state) | 7.44% | 627 | 101 |
| E + pinned contrast and shadow toe  (final) | 2.50% | 1 | 103.1 |
| E final, no labels | 2.48% | 1 | 103.3 |
| E final, no formations | 1.86% | 0 | 100.8 |
| E final, no woods | 2.50% | 1 | 103.1 |
| E final, none of these | 1.79% | 0 | 100.8 |

**What the 7.4% was.** Row D, the intermediate build in which it was first measured, reproduces it (7.44%). It is the share of map pixels in this view whose brightest channel is below 16/255. It was a real defect: the Pratzeberg west face, in the hill's own shadow, sat on the filmic curve's toe at a few code values and read as black (627 solid black blocks in D). The pinned contrast and shadow toe (D to E) removed it.

**What remains in the final build (2.50%)**, found by hiding each family and re-rendering the same frame: formations 0.64 points (shakos, the dark pads under blocks; the one solid block is here), labels 0.02, woods 0.00, and 1.79 points of scattered dark ground texels and the vignetted lower edge, with no solid region. Expected detail, not a clipped slope, which is why the black-slope test counts solid 8x8 regions.

**Two findings recorded, not acted on.** (1) Narrowing the landscape hillshade (C to D) did not help this view (7.02% to 7.44%); the pinned contrast and shadow toe did the work. The palette change is kept as accepted, but its benefit is not demonstrated and it should be re-assessed in the lighting pass. (2) The original build's result depends on what came before: 13.63% on a fresh page (row A) but 24.07% after the preceding cases in one page (the before/after table). The Stage 0 build gives the same figure both ways (2.50% and 2.50%). The cause in the original build was not investigated further. Row B is darker than A because the Stage 0 mist fade no longer veils the slopes the original grade clips.

## Reproduce
```
node tools/visual/harness.js austerlitz-command-map.html out --test      # cases + self-test
node tools/visual/check-report.js out
node tools/visual/data-invariance.js austerlitz-command-map__7_.html austerlitz-command-map.html
node tools/visual/darkness-study.js austerlitz-command-map.html austerlitz-command-map__7_.html dark
python3 tools/stage0/apply-stage0.py --html austerlitz-command-map__7_.html rebuilt.html
```
