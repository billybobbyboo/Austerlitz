# Final audit after Stage 8: the visual landscape

Area `visual-landscape`: the rendered 3D landscape of the audited build (`austerlitz-command-map.html`, 2,810,630 bytes, md5
`f10fe585c46aea576f436ed51ac46f83`). Measurement only: no source, data, test, threshold, archive or build was changed. The full structured
result is `result.json`; this file says what was examined, how, and what it found.

A first attempt captured 92 shots and computed the facings table, then stopped at a usage limit before writing anything else. This pass reused
both (`shots/`, `facings.json`), built the contact sheets, recorded one glide, added in-page numbers (`probe.json`, `village-trees.json`), added 8
captures with read-backs (`shots/x-*`), and wrote the analysis.

## Environment

- Chromium 141.0.7390.37 headless shell (CI's pin), ANGLE on SwiftShader (software WebGL). These are not device timings or device colours.
- The harness page (`?harness=1`): drift and smoke motion off, CSS transitions off. A visitor's page differs in those respects only.
- 1600 x 900 (and four shots at 1280 x 720), Watch, the default 4x relief unless stated. Every view is set through the harness's own entry point
  (`window.__aus.apply`), with the app's animation loop held so that the screenshot shows the frame `settle()` drew (`tools/audit-post8/visual-landscape/capture.js`).
- All 100 captures: 0 console warnings or errors, the desktop tier (`lowTier` false) (`shots/*.json`).

## How each item was judged

Each item is judged three ways where they apply: technical correctness (is it drawn as built and specified), historical correctness (does it say
anything the evidence does not), and aesthetics (does it read well). Owner decisions are treated as accepted trade-offs unless the build
contradicts them.

| item | method | evidence |
|---|---|---|
| composition, terrain, light, atmosphere | six vantages at eight clocks, three factors, contact sheets | `sheets/sheet-vantage-*.jpg`, `sheet-factor-*.jpg`, `shots/v-*.json` (the sun read back) |
| water, ice, the low-sun glare | eight ice views 09:00-16:30, crops, the ground under each disc, saturated pixels | `sheets/sheet-ice-*.jpg`, `probe.json`, `whites.json` |
| troops, contact, standards, artillery | twelve close views (4x r 10, 10.33x r 8 and r 16 among them), crops | `sheets/sheet-troops-*.jpg`, `crops/` |
| orientation and uniform facings | `facings.json` summarised, six captures with the drawn yaw read back | `facings-summary.json`, `shots/x-face-*.json` |
| buildings and landmarks | nineteen landmark views, the planner's building records | `sheets/sheet-landmarks-*.jpg`, `probe.json` (`buildings`) |
| clipping, depth artefacts, culling pops | one recorded glide, frame-to-frame differences | `sequence/` |

## Findings (most severe first; details, refs and remedies in `result.json`)

1. **S2 P2, confirmed defect: figures on the frozen Satschan mere are drawn sunk into the ice.** In phase 9 (16:00-17:00) the data puts
   Dokhturov's column, Kienmayer's advance guard and Buxhowden's headquarters on the ice (`data.js:465, 480, 495`, `ice:true`). The blocks are
   seated on the carved bed under the ice, which lies below the ice on 69% of the Satschan disc (mean 0.266, max 0.874 units; Menitz 78%, max
   1.142). A man's head top is at 1.415 units, so a figure can be up to 62% under the ice. The ice is transparent at 0.96 and depth-tested, so it
   covers the sunk parts: horses look legless and men are cut at the thigh (`shots/x-ice-dok-1640.jpg`; a rider at 12:00 in
   `crops/satschan-1200-0-0.jpg`). 8F assumed "nothing visible lies under the ice" (`world.js:1454`). The self-test's contact check judges the
   ground under the ice, so it passes. The narrative keeps the mass drowning disputed (`data.js:119, 749`, `analysis.js:60`), and this picture
   suggests it anyway. The effect shows only close up (about r 20 units or nearer), not at the Overview.
2. **S3 P3, confirmed defect: trees and bushes stand on the frozen Satschan mere.** 21 instances sit inside the drawn disc and 17 on its water
   class: 4 village trees and 17 bank bushes along the Litava, whose line crosses the mere. The village trees go on a ring round each village
   with no water test (`world.js:2119-2127`). The bank scrub tests only village cover and buildings (`world.js:2212-2223`). Telnitz and
   Satschan are affected; the Menitz mere is clear. Evidence: `probe.json`, `village-trees.json`, `crops/satschan-1200-0-0.jpg`.
3. **S3 P3, probable problem: blocks face along slow drifts and keep stale facings.** A block takes the heading of any leg in progress,
   however slow (`app.js:6001-6002`, `headingAt` at `app.js:3336`). The gait has a 1 km/h floor (decision 244 (a)); the facing has none.
   - 79.6% of moving rows are drifts under 1 km/h.
   - In 37 of 2,051 rows (17 with a fighting status) a block faces more than 120 degrees away from an enemy within 500 m.
   - Kamensky's brigade, marked "counterattack" and then "engaged", faces 130-180 degrees away from Saint-Hilaire at 10:00-11:00, 20-420 m off (within 110 m at 10:00-10:20). Read back at
     10:10: 174.8 degrees, with the enemy 60 m away, while the caption reads "Kamensky turns his brigade about".
   - Halted blocks keep the facing taken at the phase start or on arrival (flag D, 17 rows). Przybyszewski is 152 degrees off Legrand 322 m away at 09:10.
   - The rule works for halted blocks whose enemy has not moved: 84.5% of halted blocks within 1.5 km of an enemy face it within 45 degrees.
   - The nearest-enemy reference and these thresholds are this audit's design values.
4. **S3 P3, confirmed defect: formation blocks interpenetrate buildings and each other.** Horses and men stand inside houses: Blasowitz at
   10:55 (`crops/cav-close-1055-250-150.jpg`), Telnitz at 08:00, the post house at 15:00. Opposing blocks share ground (Kamensky and
   Saint-Hilaire at 10:10). 8J recorded this (`docs/STAGE8_SPEC.md:4982-4986`) and the owner has not decided it. The plot-scale farmsteads
   (a long range up to 176 x 71 m) enlarge the overlap. The castle case is covered by decision 266 (a).
5. **S4 P3, probable problem: streams saturate to white in grazing and low-sun views.** `STREAM.sky` 2.0 multiplies the reflected radiance up
   to 3x at a grazing view (`world.js:1409, 1446`), and with the bloom the stream ribbons clip to 255. Examples: the brook toward Augezd at
   16:30 (236 px at 255), the Goldbach by Puntowitz at 09:00, behind the castle at 15:00 (`whites.json`, crops). Toward the sun at 15:00 the
   Litava's channel reads as a pale wall, up to 236 (`crops/ice-mid-1500-250-80.jpg`). Decision 246 (a) asked for streams "still, darker and
   less blue". This was introduced in 8F.
6. **S4 P4, optional improvement: the headquarters is drawn as a pitched camp at every status.** A white marquee 2.3 units high (1.6 times a
   man) appears among moving guns and on the ice during the rout (`app.js:811, 1542-1546`; `crops/bat-limbered-1410-800-150.jpg`).
7. **S4 P4, unresolved historical: the omitted chapels invite a misreading.** Seen from the south-west, Bosenitz's church, about 720 m beyond
   the Santon, appears to crown the hill beside the label "The Santon". The name "Chapel of St Anthony" stands over an empty patch next to
   Augezd's drawn church (`crops/santon-1000-200-50.jpg`, `crops/stanthony-1300-250-200.jpg`; `appearance.js:1065-1068`).
8. **S4 P4, confirmed defect, recorded open by 8H: deciduous crowns near the eye break into large faceted shards** in the closest figure views
   next to woods (`sheets/sheet-troops-2.jpg`; `docs/STAGE8_SPEC.md:4547-4549`).

## Carried items

| item | status |
|---|---|
| low-sun ice glare (264 (a)) | Unchanged and accepted. At 15:00 the low view shows a broad white sheen with the sun in frame; 09:00 and 12:00 show a mild sheen; 16:30 shows none (the sun is at -2.9 degrees). Not re-measured. The streams have a related problem (finding 5). |
| ground contact (265 (a)) | Unchanged and provisional; the original criterion is still not met; not re-measured. No gross floating is visible at capture resolution. A larger failure, the figures sunk in the ice, lies outside the check (finding 1). |
| troop facings | **Uniform facings** (245 (a), with decision 104): still not drawn, as decided. They would not show at the default distances, where a man is under 17.6 px. In the closest views they are visibly absent: the French infantry wear plain blue, with no white lapels. The reconsideration is open for the owner. **Orientation:** see finding 3. |
| artillery drivers and moving gunners | Unchanged. Each team on the guns on the heights has a driver, an inference from IV Corps' letter. The limbered battery has no gunners. At 14:10 it overlaps an infantry block and an HQ camp. The owner has not decided this. |
| castle prominence, scale, III Column (266 (a)) | Confirmed and accepted. In 11 of Sokolnitz's 13 farmsteads the long range alone (up to 2.8 x 1.1 units, 176 x 71 m) covers more ground than the whole quadrangle (1.52 x 1.15 units, 96 x 73 m). The castle's ranges are only 0.24-0.46 units deep. Close up the castle reads smaller than the farmhouses. At 10:00 the III Column's figures hide it entirely. |
| Austerlitz garden | Unchanged; recorded in 8J, not decided. At r 30 it shows as a few scattered trees on plain field ground; at the Overview it cannot be made out. |
| Satschan's farmsteads (261 (a)) | Confirmed and accepted: the church and 5 farmsteads of 7. 21 trees and bushes stand on the mere beside it (finding 2). |
| omitted landmark symbols (`BUILDINGS.notDrawn`) | Unchanged; the owner has not chosen among the alternatives. St Anthony's chapel is a name only; the Santon's chapel and the granary are absent. Finding 7 adds a misreading risk. |

## Strengths

- **Light:** computed and coherent through the day. Pre-dawn at 06:00 (sun -16.4 degrees), the valley fog at 08:00 (mist 0.98) lifting by
  10:00 (0.05), a noon sun at 19.0 degrees, evening mist at 15:00 (0.22) and twilight at 16:30.
- **Palette:** a restrained December palette. Bare grey-brown woods stand with green conifers; the meres read as frozen water from above and
  obliquely.
- **Villages:** they read as villages on the 1825 street-and-yard pattern, with a landmark hierarchy of spires, the château and the castle's
  quadrangle form close up.
- **Troops:** side and nation are clear at a glance: French blue with the 1804 lozenge, Russian green, Austrian white with the yellow
  ordinary colour. Formations are legible. The rich kit and the artillery (spoked wheels, trails, limbers, teams) convince close up.
- **The glide:**
  - Culling rises from 0 to 76 blocks with no visible pop.
  - At rest the frame's triangles fall from 1,151,029 to 1,003,941 and not a single 3D pixel changes. Only the labels fade, 2,830 px
    (`crops/glide-15-16.jpg`).

## Commands (scripts in `tools/audit-post8/visual-landscape/`; outputs here)

```
node shots.js > shots.json; node capture.js shots.json <evidence>/shots           # first attempt: 92 captures, 2,308 s
node facings.js <isolated-copy> <evidence>/facings.json                            # first attempt: 2,051 rows (818 s load)
python3 sheets.py <evidence>/shots <evidence>/sheets 480 800 6                     # contact sheets
node sequence.js <scratch>/seq --only glide --vp 960x540                           # one glide, 26 frames, 10 fps virtual clock
python3 seqsheet.py <scratch>/seq glide <evidence>/sequence/glide-sheet.jpg 0 17 3 533
node village-trees.js /home/user/Austerlitz <evidence>/village-trees.json          # the planner's arithmetic in node
node probe.js <evidence>/probe.json                                                # in-page numbers (meres, trees, formations, buildings)
node shots-extra.js > shots-extra.json; node capture.js shots-extra.json <evidence>/shots   # 8 captures with read-backs, 788 s
python3 facings-analysis.py <evidence>/facings.json <evidence>/facings-summary.json
python3 whites.py <evidence>/shots <evidence>/whites.json
python3 crop.py <id> x0 y0 x1 y1 [scale] [out-dir]                                 # the crops
```

## Not checked

- Device GPUs, Safari and the phone. Everything here is software WebGL.
- A visitor's page. Drift and smoke motion, and CSS transitions, were off in every capture.
- Ground contact on dry ground (8H's `contact-8f.js` was not re-run) and the ice glare share (`ice-8h.js` was not re-run). The build's ice is
  unchanged since 8H.
- The Play, dolly and orbit sequences. They are defined in `sequence.js` but were not run; only one glide was recorded.
- Other areas' ground: the eye-level views, the paper map, the phone layouts and the label hierarchy.
- The historical claims behind uniforms, standards and ordnance. 6D's flag-ratio checks were not re-run.
- Bank scrub inside drawn stream ribbons elsewhere. One bush was seen in the Satschan outflow; none were counted.

## Evidence index

| path | contents |
|---|---|
| `shots/` | 100 captures (`<id>.jpg`) with their records (`<id>.json`: the spec, the state read back, timings, errors, and for `x-*` the in-page read-back) |
| `shots.json`, `shots-extra.json` | the two shot lists (id, group, clock, camera, note) |
| `sheets/` | 18 contact sheets by group and by vantage |
| `crops/` | 14 full-resolution crops cited above |
| `sequence/` | the glide: `glide.mp4`, `glide.json` (per-frame clock, eye, culled blocks, calls, triangles), `glide-sheet.jpg` |
| `facings.json`, `facings-summary.json` | every block's drawn yaw every 10 minutes 05:00-17:00, and its summary |
| `probe.json` | the meres' discs, trees on the ice, the ground under the ice, formations inside the discs, Satschan's and Sokolnitz's building records |
| `village-trees.json` | the villages' trees on the meres' water class, by the planner's own arithmetic |
| `whites.json` | saturated pixels in the stream regions and per capture |
| `result.json` | the full structured result |
