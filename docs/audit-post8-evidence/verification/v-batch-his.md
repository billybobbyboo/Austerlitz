# Verification 'v-batch-his': the history area's findings #5-#17 (mixed lens, minor and polish)

Build audited: `austerlitz-command-map.html`, 2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83`. Nothing was changed in the application,
the data, the tests, the thresholds, the archive or the build.

## Method

- **Probes are mine, not the area's.** They live in `tools/audit-post8/verification/v-batch-his/`: `probe.js <name>` (names: kamensky,
  kienmayer, caffarelli, bourcier, milo, sokolnitz, drift), `command.js`, `anchor-pairs.js` and `rgcav-plateau.js`.
  - They run on my isolated copy, `scratchpad/v-batch-his-iso`. That copy was made from the audit's template, its application files checked
    md5-identical to HEAD, with `tools/mk-world-mod.js` and `tools/mk-helpers.js` run inside it.
  - Loading reuses `verification/v-repro-his/load.js`, which follows sim-test.js's order.
  - Positions come from the model's own `posNow`/`posAtClock`. Distances use `GEOREF.kmBetween`, bearings `GEOREF.bearingDeg` (true north).
  - The Goldbach and Litava polylines are parsed from world.js; the roads come from the world module's `ROADS`.
- **Outputs:** `docs/audit-post8-evidence/verification/v-batch-his/*.txt`.
- **No browser runs.** Each finding here can be settled by its code, data or records. One existing capture was re-read:
  `visual-landscape/shots/sok-village-1200-west.jpg`.

## Verdicts

| # | finding | verdict | severity / priority |
|---|---|---|---|
| 5 | three events whose texts dispute the hour are not 'disputed' | CONFIRMED | S3 / P2-P3 |
| 6 | Kamensky's turn drawn from 08:00, disclosed as the 08:45 phase | CONFIRMED | S3 / P3 |
| 7 | Kienmayer 'west of the Goldbach' drawn east | CONFIRMED | S3 / P3 |
| 8 | Caffarelli's objective vs route; separation misstated | CONFIRMED | S3 / P3 |
| 9 | legs through enemies and across the Litava | CONFIRMED | S3 / P3 |
| 10 | Sokolnitz village drawn empty 09:00-13:15 | CONFIRMED (nuance) | S3 / P3 |
| 11 | Command tab DOCUMENTED vs unchecked; early Blasowitz row; 'Could see' dispute | CONFIRMED | S3 / P3 |
| 12 | 'Marching' on drift legs | CONFIRMED | S3 / P3 |
| 13 | Krug, Bellowitz, Kologrivov unqualified | **WEAKENED** (Krug = geography #6; the Kologrivov premise fails) | S3 / S4 |
| 14 | smaller inconsistencies (a)-(h) | CONFIRMED | S4 / P4 |
| 15 | no checks for these classes | CONFIRMED | S3 / P3 |
| 16 | accepted: Russian Guard 10,500 vs 7,330 drawn | CONFIRMED (decision 213 (b)) | S4 / P4 |
| 17 | accepted: Bagration toward Rausnitz | CONFIRMED (decision 180 (c)) | S4 / P4 |

## Per finding

### #5: CONFIRMED (code and data reading; git log -S)

**The events' texts.**
- `decision` (analysis.js:280-282) has claim `est`, and its why says "The hour is disputed: about eight in Ségur, ... half past eight in
  Thiébault, ... about nine in the Austrian accounts".
- `guard-attack` (analysis.js:314-316) has claim `est`, and its why says "The hour is disputed: Rapp and Ségur ... about 13:00, Schönhals ...
  by about noon".
- `ice` (analysis.js:350-352) has claim `fact`. Its why speaks of the drowned, not the hour, but its phase line (data.js:122) says "The
  accounts differ on the hour: Schönhals ... half past two; Thiébault ... last half hour of the firing".

**What the visitor sees.**
- `CLAIM.disputed` (data.js:20) fits all three events.
- `evNoteParts` (app.js:3886-3888) adds "hour disputed" only for claim `disputed`. So `decision` and `guard-attack` are labelled
  "(interval)", and `ice` gets no note at all.
- The event dossier prints `CLAIM[e.claim].note` (app.js:8328), so the visitor reads, for example, "the figure or frontage shown is an
  estimate".

**Origin.** Decision 201 (b) (docs/step4-evidence/questions.md:240-252) made the seven events from question 193 'disputed'. These texts came
in step 4 (aa561af, 69031df, 14 October), before decision 201 was taken. Inherited.

**Remedy.** A guarded data task, as 201 (b) did: claim 'disputed', with a `dispute` naming both hours (test.js:194 requires the hours to be
in it).

### #6: CONFIRMED (own probe; records reading)

**Numbers** (`kamensky.txt`).
- Kamensky moves from [259,316] at 08:00 to [268.78,298.4] at 08:44: true bearing 46.5 deg (NE), 0.636 km. His distance to the Pratzeberg
  falls from 1.19 km to 0.60 km.
- Langeron's own column moves only 0.171 km in the same time.
- Kamensky enters `PLATEAU_POLY` at 08:29. The Allied plateau reading rises from 19,300 to 23,550; the French reading stays 0 until 09:15.
- Saint-Hilaire stays at [206,231] until 08:45.
- `anchorList`: phase 2 arrives at 480, phase 3 at 525, so the leg runs 08:00-08:45.

**The disclosures** name the 08:45 arrival, not the walk drawn from 08:00:
- data.js:799: "in the 08:45 phase in his brigade's record"
- analysis.js:299: "turns it in the 08:45 phase"
- app.js:64: "his own record and the track in phase 3"
- tools/stage2/chronology.js:259: "the engine arrives 08:45"

docs/STAGE2_SPEC.md:1172 does record the leg itself as 08:00-08:45.

**Judgement.** The leg's timing is decision 42's "today's behaviour" for the named conflict (`CONFLICTS`, chronology.js:446), and is
accepted as such. What is wrong is the disclosure, and the 4,250 it adds to the derived plateau reading before any French formation stands on
the plateau. The record fix is consistent with decision 42. A `moveMin` hold would set a timing that no source dates, so it is the owner's
choice. The area's "heading 151 deg" is not a compass bearing; its "north-east" is right. Inherited (56501de).

### #7: CONFIRMED (own probe; Stage 0 archive)

**Numbers** (`kienmayer.txt`).
- @7 [242,400] stands 0.901 km east of the Goldbach's N-S reach (x 213.50 at y 400).
- The nearest brook point is 0.474 km to its south, on the reach that runs east to the meres. On neither reach is the block west of the
  brook.
- @1 stands 0.714 km east, @2 0.265 km east. Of 146 five-minute samples, none stands west of the N-S reach.

**Origin.** Stage 0's build has the same anchor and act. Its brook lies at x 212.24 at y 400, so @7 stood 0.941 km east then.

**A small correction to the area.** 8J moved that segment's north vertex from [208,376] to [212.4,377.9], which shifts the brook about 40 m
east at y 400. The offset is still Stage 0's, not 8J's. STAGE8_SPEC.md:4982/5108 and CHANGELOG.md:379 therefore misfile it. This record part
overlaps records #5.

### #8: CONFIRMED (own probe; archive anchors)

**Numbers** (`caffarelli.txt`), 12:45-17:00.
- Distance to the highway: 1.54 -> 2.15 km.
- Distance to Bagration: 1.61 -> 2.64 km (northing 1.57 -> 2.59).
- Nearest enemy: Liechtenstein, 1.52-1.61 km.
- The objective "Push Bagration off the highway" is carried from @7 (`stateAt`); the A grade is carried from @5.

**The records** say 2.5-2.9 km. Measured at the same clock it is 2.13 km at 14:30 and 2.64 km at 17:00. The pre-8K anchors (archive/stage8j:
bag@8 [337,29], bag@9 [366,14]) give 2.96/3.16 km true and 2.81/3.01 km by northing (`anchor-pairs.txt`). So the figure was not re-measured
after 8K re-plotted Bagration.

**Nuance.** Between anchors the pill reads "Position: interpolated" (app.js:8098-8103). "Documented" shows only at the anchor minutes.

**Origin.** The drawn separation is inherited, and was larger before 8K. The misstated record is 8K's; it overlaps records #5.

### #9: CONFIRMED (own probe)

**Bourcier** (`bourcier.txt`). He comes within 26 m of Kienmayer at 14:38 and 12 m of Dokhturov at 14:54. All three run on the same vias,
[247,397] and [272,378].

**Miloradovich** (`milo.txt`).
- milo@8 [446,210] stands 19 m from `LITAVA_M`, on ground with covWater 0.96.
- The track crosses the river line at 14:26 [444.7,210.5] and again at 14:47 [449.2,205.6], 1.04 and 1.12 km from the nearest `ROADS` line.

**The movement audit.** `crossingProblem` and `wetAt` (app.js:3378-3400) test ponds and marsh only.

**Origin.** The anchors are the same in archive/stage0, step2 and step5c: inherited.

**Relations.** This is the same class as history #1 and visual-landscape #3, but a different case with a data-track cause. The river-check
part overlaps geography #4 and history #15.

### #10: CONFIRMED with a nuance (own probe; code; one capture)

**Numbers** (`sokolnitz.txt`), 09:00-13:15.
- Nearest French centre: Legrand at 0.95-1.19 km, then Friant at 0.80-1.21 km. Friant's closest approach all day is 0.80 km, at 12:45.
- Nearest Allied centre: Przybyszewski at 0.79 km throughout.
- lang@2 [235,350] (graded A, act "Storms Sokolnitz") stands 0.976 km from the village and 0.452 km east of the brook.

**Texts that disagree with the drawing.** `FEATURES` says "Defended by: Legrand, then Friant" (data.js:707). The arrow note says "the model
has the column at the village from 08:00" (app.js:47).

**Nuance.** Blocks have width: up to 7 subunits, an infantry front of up to about 1.1 km (app.js:833-838, 1630-1636). In
`sok-village-1200-west.jpg` the III Column's block abuts the castle group's farmsteads at 12:00. So no block occupies the village, but
figures stand beside it. Inherited.

### #11: CONFIRMED (own script; code)

**Counts** (`command.txt`). 35 rows are labelled DOCUMENTED; 31 of them have no claim. The sources sheet's index puts every such statement
under "Not yet checked ... Every other statement." (app.js:8648-8673).

**The Blasowitz row.** `paintCommand` (app.js:4237-4256) shows one book for the whole phase. So al@5[0] "Blasowitz had fallen" is shown from
10:30, while the event is at 11:15. Phase 5's own line puts the fall at the phase's end, so the row runs up to 45 minutes early.

**The 'Could see' row.** al@4[0] is of kind `saw`, so it renders "Could see: The accounts differ on who turned Kamensky's brigade about".

**Decisions.** Decision 187 (i) asked for one vocabulary, but only `SRC_LABEL.inf` changed; no decision covers DOCUMENTED beside
'unchecked'. Inherited.

### #12: CONFIRMED (code; own probe)

**Code.** `marchRow` (app.js:7917-7930) writes "Marching" whenever `marchRate.moving`, that is, whenever u is between 0 and 1, at any rate
(app.js:3347-3354). The gait's `KMH` of 1 (app.js:5812) treats a leg slower than that as a drift.

**Numbers** (`drift.txt`).
- rg_cav at 07:37: 3.23 km in 435 min, 0.44 km/h, status "In reserve".
- Over the day, 14,021 formation-minutes show "Marching" under 1 km/h; 5,443 of them have status reserve, concealed, holding or forming.

**The plateau reading** (`rgcav-plateau.txt`). It rises from 18,150 to 21,050 at 10:05, when rg_cav drifts into the plateau outline.

**Origin and relations.** Inherited (0a19964). Related: visual-landscape #2 and tests #6.

### #13: WEAKENED

**Krug and Bellowitz: confirmed.**
- Drawn Krug [339,139] and Holubitz [340,89] lie 1.58 km apart (world.js:142-143), while the acts pair them as "Krug and Holubitz".
- The Second Survey's "Kruch" is at 8k/register.md:36. The cited :43-45 is the post-house entry.
- The open question is disclosed only in `SOURCE_NOTE`.

This part is substantively **geography #6**.

**Kologrivov: the premise fails.**
- The project's own 6B reading (docs/stage6-evidence/readings-composition.md:540-548) reads "GL. Kollowrizow" in Schönhals 1873 p. 178's
  order of battle, "a second source for that name".
- So the error is in the note (data.js:640, "in Sokolov alone") and in `SOURCE_NOTE` (sources-oob #4), not an unqualified name on screen.
- The proposed remedy, putting "Sokolov alone" in the field, would entrench that error.

**Corrected.** The commander's claim should be tagged 'attributed' (Sokolov; Schönhals p. 178; Duffy p. 184) and the note fixed. S4 for that
part.

### #14: CONFIRMED (data, code, GEOREF)

- **(a)** Saint-Hilaire stands 0.146 km and Vandamme 0.265 km west of the drawn brook while their act reads "Crosses the Goldbach".
  Saint-Hilaire holds [206,231] until 08:45.
- **(b)** ahq@4 (data.js:450) has Kutuzov order Kamensky to retire in phase 4, yet kamensky@5 still fights on the crest and kamensky@6 is
  "ordered to retire by Kutuzov" at 11:15 (data.js:523-524).
- **(c)** Arm `guard` reads "Guard infantry" (app.js:7970) for both Guard corps, c_gd and constantine, though both include cavalry.
- **(d)** milo@0 stands 1.60 km from Pratzen while its act says "near Pratzen village": FINAL_AUDIT G-3, also records #4.
- **(e)** Unaccented names at data.js:323, 360, 399, 406, 418 and 500; `guard_inf.commander` holds a composition, not a commander.
- **(f)** The header comment (data.js:3) gives the frame as ~13 x ~10 km; 680 x 500 map units x 0.0316 km = 21.5 x 15.8 km.
- **(g)** Langeron's note (data.js:501) does not say that its 11,700 includes Kamensky's 4,250. Buxhowden's note gives 33,000-40,000
  (data.js:457); the card's "≈ 40,000" was not rendered here.
- **(h)** rg_cav@0 is graded A from 04:00 (data.js:642), while its note has the Chevalier Guard come up later in a separate column.

### #15: CONFIRMED (code reading)

- `crossingProblem` (app.js:3391-3400) tests ponds and marsh only.
- sim-test.js (lines 30-162) checks continuity, the rate ceiling, the event markers' distance, the counts, the plateau rules and decision 196.
- test.js:191-194 checks an event's claim class and its dispute's hours. It does not hold an event's claim against its why's statement claim.

None of these has a proximity, river, side-of-stream or motion-against-status rule. The river part overlaps geography #4.

### #16: CONFIRMED, accepted (decision 213 (b))

data.js:621-626 shows the corps at 10,500. Its note lists Duffy's rows and says what is drawn (4,430 infantry and 2,900 horse), so the 3,170
not drawn can be worked out but is never named. test.js:477-478 acknowledges the gap in `KNOWN_WARN`.

### #17: CONFIRMED, accepted (decision 180 (c), "not now")

The role (data.js:602) has Bagration withdraw toward Austerlitz in the evening. The drawn bag@9 [414,13] lies north-east, and the arrow says
"withdraws on Rausnitz" (app.js:100). 8K re-plotted bag@9 but kept its direction.

## Extra issue

The II Column (act "Storms Sokolnitz", graded A, status attacking) is drawn **receding** from the village between 08:00 and 10:30: its
distance grows from 0.98 to 1.54 km (`sokolnitz.txt`), at a bearing of 58 deg from 08:00 to 08:44 and 0.23 km/h (drift-legs.txt:44).
- History #0's list of formations moving against their status misses it, because its samples are at or above walking pace.
- #10 and #12 name it only in part.
- Severity S4, inherited.

## Not done

- No browser reproduction. The label and dossier strings in #5, #11 and #12 were established from code, not read off a page.
- Buxhowden's card text in #14 (g) was not rendered.
- The historical correctness of the acts was not judged: Kienmayer's side of the brook, Caffarelli's route, who held Sokolnitz.
- #15's "carried-forward grades" was not enumerated independently.
- The figures' extent around Sokolnitz village (#10) was not measured in a browser.
