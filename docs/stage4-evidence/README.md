# Stage 4 Part A: evidence

Produced by the scripts in `tools/stage4/` against the build of the spine data task (md5 `6b2cccd44138e95e6082c82b8b2d2f8a`,
1,348,542 bytes) in headless Chromium with software WebGL; `sun.js` runs in node on the live sources. Cited from
`docs/STAGE4_SPEC.md`. The page scripts inject **probes** into the running page: measurement code, not the Stage 4
implementation; they changed no source file. Frame times are software WebGL on one machine: comparable with one another only.

| file | section | script |
|---|---|---|
| `sun.md`, `sun.json` | A.2, A.3, 0.3 | `sun.js --md --json`: the computed sun of 2 December 1805 at 49.14 N 16.76 E every 10 minutes, in local apparent and local mean time; sunrise, sunset, twilight; each phase's `LIGHT` preset as an azimuth and altitude against the computed sun; the altitude of a sun corrected to the display factor; the modelled ground facing away from the sun and in the terrain's cast shadow at 1x, 4x and 10.33x under the true and the corrected sun, and under the presets; the model's slopes |
| `light-probe.json` | A.4 | `light-probe.js --json`: seven variants of the light (A today; B no toe; C the computed sun's direction; D C without the toe; E the computed sun corrected to the factor, no toe; F E with the full baked hillshade; G E with none) in every landscape harness view at its clock, four of them at 1x, 4x and 10.33x; per variant the solid near-black share, the near-black share, luminance percentiles, every map text's contrast as rendered, drops, the layer's pass and the frame's times; the sweep (`sweep`): the Field vantage and the low Pratzen view at 4x every hour 08:00-16:00, variants A, D and E |
| `light-sheet.jpg` | A.4 | `light-probe.js --sheet`: the low Pratzen view at 10.33x and the Sokolnitz close view at 4x in variants A, B, D and E; the Field vantage at 4x in A, E, F and G |
| `dark-probe.json` | A.4b | `dark-probe.js --json`: in four views, what the solid near-black blocks are (a ray through each block's centre names the ground, a formation's figures, trees, houses or other) in variants A, B and E, and in two remedies (H: the fill light turned opposite the sun; J: the sky fill raised) |
| `fog-probe.json` | B, C | `fog-probe.js --json`: `today`, the fog as drawn in every landscape harness view, with and without Stage 3D's recession; `model`, every formation's and place's model elevation (metres) at 05:00, 07:00, 08:00, 08:30 and 08:45; `render`, candidate atmospheres rendered through replaced fog chunks (H0 today; H1 a true-space exponential haze, 10 km visibility at 200 m, scale height 400 m; H2 the same at 20 km; V238 and V260 H1 with a valley fog below 238.2 m or 260 m) with darkness, contrast, drops, the haze over the ground, the figures under the fog; `focus`, H3 (H1 counted beyond the orbit target) in five views and V55 (the valley fog at 238.2 m, 55% opaque) in two; `cost`, the world pass's time once compiled, each candidate on a fresh page (not usable as absolute times: §B.2) |
| `fog-sheet.jpg` | B, C | `fog-probe.js --sheet`: the fitted Overview at 1x, 4x and 10.33x, today (H0) and with the true-space haze (H1); the Field vantage at 08:00 and the low Pratzen view at 08:30 at 4x: today, the valley fog at 238.2 m, at 260 m |
| `pace-probe.json` | D | `pace-probe.js --json`: the clock's durations at each speed, each phase against the camera glide, the events starting inside it; two camera rules over the whole day at 1x and 0.5x (today's phase-boundary rule and a continuous follow): live events inside the free rectangle, the floor, the ground's speed across the screen, the map layer's drops every 10 minutes |
| `extras-probe.json` | E, F | `extras-probe.js --json`: per landscape view, smoke and dust sprites and their share of the free rectangle, the cost of a depth pre-pass (soft particles), the meres on screen, the horizon (the gap between the true horizon and the apron's far edge, the edge's distance and fog); over the day, the formations that smoke against those a live event names |

**Stage 4B** (the light, implemented): `report-4b.js` on the build before 4B (`archive/spine-6b2cccd4.html`) and on the 4B build.

| file | section | script |
|---|---|---|
| `4b-before.json`, `4b-after.json` | I (4B) | `report-4b.js --json`: per landscape view at its factor, four at 1x and 10.33x, and the day at 4x: solid near-black, luminance p5 and mean, map text contrast as rendered, drops and pass time; on the 4B build the sun's true and drawn altitude, the fill and the shadow box |
| `4b-report.md` | I (4B) | the two side by side |
| `4b-sheet-before.jpg`, `4b-sheet.jpg` | I (4B) | `report-4b.js --sheet`: six views before 4B and with it |

The 4B run measured a build that differs from the committed one only in the sources sheet's text (`lightNotes`, added after the run
started) and in two comments; the light's code is the same.

**Stage 4C** (the atmosphere, implemented): `report-4b.js`, extended for 4C (on a build with the atmosphere it reads the haze and the
valley fog over the ground under the free rectangle by the page's own `atmoAt`, and measures three views in the valley fog's hours;
`--from` writes the table from a measurement already made), on the 4B build as merged (#28, md5 `3d6d2295…`) and on the 4C build.

| file | section | script |
|---|---|---|
| `4c-before.json`, `4c-after.json` | I (4C) | `report-4b.js --json`: as 4B's, and on the 4C build the atmosphere per view (the mean haze and valley fog over the free rectangle's ground, the haze at the orbit target, the fog's top and cap, the haze's visibility); the Field vantage at 08:00, the Sokolnitz close view at 08:20 and the low Pratzen view at 08:30 at 4x |
| `4c-report.md` | I (4C) | `report-4b.js --from 4c-after.json --before 4c-before.json --md`: the two side by side, the atmosphere per view, the fog's hours |
| `4c-sheet-before.jpg`, `4c-sheet.jpg` | I (4C) | `report-4b.js --sheet`: six views on the 4B build and on the 4C build (the Sokolnitz close view at 08:20 is in the fog) |

**Stage 4D** (pacing, implemented): `report-4d.js` on the 4C build as merged (#29, md5 `622634ef…`) and on the 4D build. It drives the
clock and the camera through the page's own functions; on the 4C build the phase glide runs on a simulated clock.

| file | section | script |
|---|---|---|
| `4d-before.json`, `4d-after.json` | I (4D) | `report-4d.js --json`: per harness view the derived arrows drawn whole, in part and not yet, and the drops; the day's length at each speed; section D.2's table on the build (the phase glide before 4D, the continuous follow and the dwells with it) at ½× and 1×; the draw-on's largest distance from the formation per derived arrow |
| `4d-report.md` | I (4D) | `report-4d.js --from 4d-after.json --before 4d-before.json --md`: the two side by side |

**Stage 4E** (smoke, ice, the horizon and the palette, implemented): `report-4e.js` on the 4D build as merged (#30, md5 `9b13adbf…`) and on
the 4E build.

| file | section | script |
|---|---|---|
| `4e-before.json`, `4e-after.json` | I (4E) | `report-4e.js --json`: per landscape view at its factor and four at 1x and 10.33x, the smoke's sprites and their share of the free rectangle (`measure.js` `smokeShare`), solid near-black, mean luminance, map-text contrast as rendered, drops; in the low Pratzen view at 1x, 4x and 10.33x the horizon (the gap under it and its colour against the sky above) |
| `4e-report.md` | I (4E) | `report-4e.js --from 4e-after.json --before 4e-before.json --md`: the two side by side |
| `4e-sheet-before.jpg`, `4e-sheet.jpg` | I (4E) | `report-4e.js --sheet`: six views on the 4D build and on the 4E build (the smoke in the close and low views; the meres in the phase-8 Overview) |
