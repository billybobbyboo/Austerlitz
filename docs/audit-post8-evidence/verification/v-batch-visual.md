# Verification v-batch-visual: 20 minor and polish findings (visual-landscape #1-#7, visual-maps #5-#17)

Adversarial verification of the audited build (`austerlitz-command-map.html`, 2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83`).
Nothing of the application, data, tests, thresholds, archive or build was changed. Scripts: `tools/audit-post8/verification/v-batch-visual/`
(`ice-tops.js`, `pan-and-stream.js`); outputs: `docs/audit-post8-evidence/verification/v-batch-visual/`. Browser: the audit's pinned
Chromium 141 headless shell on SwiftShader (`tools/audit-post8/lib.js`), the harness page; the machine's load was 33-43 (other agents),
so no timing here means anything. Line numbers are at HEAD (application files identical to `origin/main` 43e3e5b).

Summary: 17 CONFIRMED, 3 WEAKENED (visual-landscape #1, visual-landscape #4, visual-maps #17), none refuted. Corrections of rating: visual-landscape #4 to
S4 P4 (its stated cause refuted, its remedy ineffective); visual-maps #11 to confirmed-defect (its cause now measured).

---

## visual-landscape #1: trees and bushes on the frozen Satschan mere: WEAKENED

**Method.** Code read; a new in-page measure of every tree and bush inside a mere's drawn ice disc, with its geometry's top against the ice's level
(`ice-tops.js`, output `v-batch-visual/ice-tops.json`); the area's crop viewed.

- Code: the village trees go on a ring round each village with no water test (`world.js:2119-2127`); the bank scrub along `GOLDBACH` and `LITAVA`
  tests only `covVill` and `nearBuilding` (`world.js:2212-2223`). Both loops are older than Stage 8 (`git log -S`: present at `0a19964`, step 4).
- Positions: the area's count is reproduced exactly: 21 instances inside the Satschan disc (4 village trees, 17 stream scrub), none in Menitz.
- **But 14 of the 21 cannot be seen.** The 14 bank bushes rooted on the carved bed (base -5.014, the ice at -4.140) have their geometry's top
  0.14-0.50 units *below* the ice (`kit.scrub`'s shell tops at 1.1 x scale x 0.8, `world.js:2286-2287`), under ice drawn at opacity 0.94 on the
  page (`world.js:1454`). One more bush (x -26.05, r 0.987) stands on ground 0.27 units *above* the ice level, i.e. on the shore.
- What stands out of the ice: **4 village trees** (tops 1.4-2.5 units above it; 3 on the water class, Satschan 2 and the one at (-52.9, 80.3)
  that `village-trees.json` assigns to Telnitz; one in the shore band, rooted 0.30 below) and **2 bush tops** (0.37 and 0.09 units above the ice).
  The crop `visual-landscape/crops/satschan-1200-0-0.jpg` shows the two Satschan trees plainly in the mere.

**Corrected statement.** Six objects visibly rise out of the Satschan ice (4 village trees, 2 bush tops, one of them barely); 14 further bank bushes
are planted on the bed under the ice and hidden by it (an invisible waste, no visual effect). The defect (no water test in either planner) stands;
the "21 appear to grow out of the ice" does not. Severity S3 P3 kept (the trees are glaring in close views of the ponds' finale); category
confirmed-defect; origin inherited. Remedy feasible as written (skip without changing the draws consumed, to keep the `WOODS_RS` hold).

## visual-landscape #2: blocks face along slow drifts and keep stale facings: CONFIRMED

**Method.** Code read at HEAD; the area's read-backs and summary re-checked line by line.

- `app.js:6001-6002`: `want=headingAt(id,clock)`, else `enemyFacing(id)`. `headingAt` (`app.js:3336-3345`) returns the heading of any leg in
  progress whatever its rate (no floor); the gait's floor is 1 km/h (decision 244 (a)). `enemyFacing` (`app.js:5755-5774`) faces the nearest
  enemy's place at `faceClock` (`app.js:5740-5744`: the phase start or the leg's arrival), cached by that clock.
- Read-backs (`visual-landscape/shots/x-face-*.json`, `afterResult`): Kamensky at 10:10 yaw = heading 129.8 deg, 0.49 km/h, Saint-Hilaire 0.06 km
  at bearing -45 deg: 174.8 deg off; Saint-Hilaire at 09:50 -142.7 deg off Kamensky 0.043 km; Przybyszewski at 09:10 halted, 152 deg off Legrand
  0.322 km; Dokhturov at 13:50 127.1 deg off Bourcier 0.235 km. `facings-summary.json`: 1,146 of 1,440 moving rows under 1 km/h (79.6%); 37 contact
  rows, 17 with engaged/attacking/counterattack (10+4+3); Kamensky's six rows 10:00-11:00 at 129.8 to 180 deg, 0.02-0.42 km. All as stated.
- Origin: inherited. Before 8E `enemyFacing` cached per phase at whatever clock first asked (`git show 62f5cd2^:app.js`, line 5376): stale too.
- Caveats for the report: the bearing is centre to centre; at 20-110 m the two blocks overlap (finding #3), so "facing away" there is a judgement
  on centres. 3 of the 37 rows are "retreating" (facing away is right) and 9 "pursuing". Related to, not a duplicate of, history #0 (another
  cause: undated legs starting a retreat at the attack's arrival).

## visual-landscape #3: blocks interpenetrate buildings and each other: CONFIRMED

**Method.** Code search; crop viewed.

- No placement rule in `app.js` reads the buildings: `BLDG`/`nearBuilding` appear only in the dossiers, notes and self-test
  (`app.js:8168-8484`, `10797`, `14070`). `docs/STAGE8_SPEC.md:4982-4986` records "figures are drawn over buildings everywhere" (8J), not decided.
- `visual-landscape/crops/cav-close-1055-250-150.jpg`: Nansouty's horses and riders stand inside Blasowitz's houses.
- Origin: inherited mechanism (houses were drawn before 8G: `git show dddd4e4^:world.js`, `houses.push`), aggravated in degree by 8G's
  plot-scale farmsteads. The castle case is decision 266 (a). Severity S3 P3 kept; the remedy needs an owner decision first, as the finding says.

## visual-landscape #4: streams saturate to white in grazing and low-sun views: **Method.** A bounded in-page toggle (`pan-and-stream.js` part B, output `v-batch-visual/pan-and-stream.json`, captures `stream-asbuilt.png`,
`stream-sky0.png`, `stream-back.png`): the area's own view (`t:990`, Watch, landscape, `aim:{map:[285,289],dir:[-1,0.13,0.18],r:70}`, 1600 x 900, the
harness page), its region box (1000,350)-(1300,480); the stream material recompiled with `STREAM.sky` 0 (its program cache key changed so that three
compiles the hook again: 1 material recompiled), then put back; near-white pixels (every channel >= 245) counted in each frame.

- Code: `STREAM.sky` 2.0 (`world.js:1409`) is baked into the fragment source by `streamHook` (`world.js:1446`: `radiance*=1.0+2.0*sG*sG*sG`), and
  `radiance` there is the environment's specular radiance only (it is multiplied after `lights_fragment_maps`, before the indirect specular), not
  the sun's direct light.
- Numbers: as built **218** px >= 245 (max channel 250) of 39,000; with `STREAM.sky` 0 **215** px (max 250); restored 218. The two captures are
  indistinguishable: the white streak along the brook toward Augezd is there in both. **The grazing term is not the cause.**
- The view looks west (`dir` x -1) at 16:30, toward the low sun; the other cases the area names are toward-sun views too (east at 09:00, 15:00 by
  the castle). What 8F did change: the streams' roughness 0.48 to **0.30** and their environment weight 0.18 to **0.40** (`git show
  94d6e46:world.js` line 1225 against `world.js:1474`, `STREAM.rough`, `STREAM.env`). The likely cause is the sun's direct specular glint on the
  sharper 8F surface, clipped by the bloom: an inference; roughness and bloom were not toggled.

**Corrected statement.** In views toward a low sun the brooks show a white glint (218 px at >= 245 in the area's box of v-low-1630, max 250, not
255 in this frame). It is not caused by `STREAM.sky` (setting it to 0 removes 3 of 218 px), so the remedy as written (lower `STREAM.sky`) would not
cure it; a sun glint on still water toward a low sun is physically plausible, and whether it is too strong is an aesthetic call. If wanted, the
candidates are the stream's roughness (8F's 0.30) or a clamp of its specular, measured across the low views. Rating S4 **P4** (was P3),
probable-problem, origin new-regression (8F's material), cause unestablished beyond the refutation.

## visual-landscape #5: the headquarters drawn as a pitched camp at every status: CONFIRMED

**Method.** Code read. `GEO.tent` is `ConeGeometry(1.75,2.3,4)` (`app.js:811`); the HQ block adds the marquee and four tents unconditionally
(`app.js:1542-1552`); nothing in `app.js` hides them by status or movement (`marq` appears only at 1544-1545). Optional improvement, S4 P4,
inherited: as stated.

## visual-landscape #6: omitted chapels invite a misreading: CONFIRMED

**Method.** Code and data read; distances computed with `GEOREF.KM_PER_MAP` (0.031599); crops viewed.

- `appearance.js:1065-1067` (`notDrawn`: stAnthony, santon, granary, each with alternatives put to the owner: `docs/STAGE8_SPEC.md:4319`, open).
- Bosenitz [236,69] is 0.721 km from the Santon (`world.js:249`, [222,87]); Bosenitz has a church (`world.js:152`). The chapel's place [291,354]
  (`data.js:778`) is 0.60 km from Augezd's centre [297,372] (`world.js:142`), whose church is drawn. Both crops show the reading described.
- Addition: the sources sheet does say what is not drawn ("Not drawn: ...", `app.js:8505`), but the chapel's and the Santon's own place
  dossiers do not (`buildingsSection` returns null for a landmark, `app.js:8180`), so the remedy's "dossier line" is the cheap part.
- Origin inherited: Bosenitz's church was drawn before Stage 8 (`archive/step5c-45f8f662.html`: `CHURCHES=[..., "Bosenitz", ...]`).

## visual-landscape #7: deciduous crowns near the eye show faceted shards: CONFIRMED

**Method.** The project's own record read: `docs/STAGE8_SPEC.md:4547-4549` and `4699-4700` (8H: "a crown within a few units of the eye still
shows its facets as large planes ... recorded, not built"); crops viewed (the shard look is visible even at mid range in
`crops/santon-1000-200-50.jpg`). S4 P4, new-regression (8F's perforated shells; 8H's near hook did not cure it): as stated.

---

## visual-maps #5 (V-M6): the caption's act and phase shrink to a letter or nothing with orphan separators; Watch at 1280 hides the readings: CONFIRMED

**Method.** Code and CSS read; the area's read-backs and `crops/caption-rows.jpg` re-read.

- `style.css:361-363`: `.tb-cap>span{flex:none}`; `.cap-ph{flex:0 1000 auto;min-width:0}`, `.act{flex:0 100 auto;min-width:0}`: the act and phase
  shrink to zero width but stay displayed, and the separators (`flex:none`, `padding:0 7px`) keep their room. `fitCaption` (`app.js:7395-7413`)
  gives way only the readings and the event (`fit-off`), never the act or phase.
- Read-backs: `visitor-1280x720/first-screen.json` act 98 px ellipsized, phase 13 px; `next-event-1.json` act and phase 0 px wide, both separators
  17 px each, shown. `d1280/watch-1200.json`: box 270 px, both readings and the event `fit-off`, only act and phase shown; `d1280/watch-1420.json`
  one reading shown, the event off; `d1600/watch-1200.json` the second reading off. The image shows "THE DECEPT... · D. ·", "· · hour disputed",
  "T. · · derived ...", "· · derived on the heights".
- Every desktop Watch case in `tools/visual/cases.js` is 1600 x 900 (lines 56-108): the 1280 Watch caption is unmeasured by the harness.
- Judgement: decision 159 (`docs/ROADMAP.md:69`, "the derived reading put before the event names in Watch", never cut) is met to the letter
  (given way whole), but in Watch at 1280 its purpose is lost: the readings are only in the caption's title. S3 P2 kept; inherited.

## visual-maps #6 (V-M7): on a phone a "Whose eyes?" reading leaves no sign on screen once the Panels close: CONFIRMED

**Method.** CSS and code read; the area's tap-driven capture viewed.

- `#eyesbtn` is `display:none` in both phone queries (`style.css:772`, `851`); the reading's "derived" tag lives in the Command tab
  (`shell.html:87`, `eyesSync` `app.js:4352-4363`). `phone-390x844/eyes-al-route.jpg` (Menu, Panels, Command, "Allied headquarters", rail
  closed, all real taps; `rail-probe.json` commandView "al"): no reading indicator anywhere on screen.
- Context the finding omits: decision 225 (a) took the Eyes button off the phone's timeline (`docs/STEP6_SPEC.md:123`) and 234 (a) accepted
  "Whose eyes?" three presses away (`:943-947`); neither record discusses the loss of the on-map label (searched: no "model reading" in
  `STEP6_SPEC.md`). So the finding stands as a consequence those decisions did not weigh, not against them; a remedy should be a non-interactive
  tag (so as not to reverse 225 (a)'s removal of the control), on the owner's word. S3 P2 kept; inherited (step 6, pre-Stage 8).

## visual-maps #7 (V-M8): the legend omits several encodings it draws: CONFIRMED

**Method.** `shell.html:219-269` and `paintLegend` (`app.js:5579-5608`) read; `buildArrow` and `eventGlyph` read.

- No row for: the dashed axis arrows (`app.js:3034` `dashRuns` for kind "axis"; four in phase 0, `app.js:30-33`, all Allied; `side()` shows the
  solid "Allied movement" sample for them), the five event glyph kinds (`app.js:3914-3927`), the objective marker (`app.js:3084-3097`), the place
  diamond, the counters' status icons, echelon marks and arm glyphs, the arrow widths by kind (`app.js:3032`). `shell.html` has no text for any of
  them (grep: no "glyph", "objective", "echelon", "diamond"). Against "one row per encoding actually on screen" (`docs/STAGE2_SPEC.md:522`,
  `app.js:5577`). S3 P3, inherited. The look-alike sentence overlaps visual-maps #14.

## visual-maps #8 (V-M9): arrow labels repeat formation names in the same plate style: CONFIRMED

**Method.** Code read; `d1600/land-field.json` items re-read.

- `app.js:3040` adds each arrow's `a.label` as an overlay label; `app.js:67-69` (OVERLAYS phase 5) label the arrows "Caffarelli", "Suchet",
  "Bagration". In `land-field.json` (09:30, Study, landscape): `n:suchet` "Suchet B" and `o:Suchet`, `n:caffarelli` and `o:Caffarelli`,
  `n:bag` "Advance Guard of the Right B" and `o:Bagration`, all on the same plate `rgba(10,14,18,0.88)`.
- Addition: "Bagration" beside "Advance Guard of the Right" is also two names for one formation on screen, the subject of decision 205's rule
  ("one name per thing", `docs/step5-evidence/questions.md:12`). OVERLAYS is guarded interpretation data: dropping or restyling a label at
  render time is presentation; renaming it is a data task. S3 P3, inherited.

## visual-maps #9 (V-M10): on the landscape the selection is barely distinguished: CONFIRMED

**Method.** Code read; the area's 1280 and 1024 read-backs; the 1280 capture viewed.

- `selRing`: a `THREE.Line` (1 px) in the theme accent `#EFE4C8` at opacity 0.62 (`app.js:3960-3988`, `tokens.js:30`); the plateau ring a
  `THREE.Line` in the annotation `#E3D9BE` (`app.js:3946`, `tokens.js:69`); the selection's outline 2.2 px against 1.7 (`OUTLINE.SEL_LINE`,
  `app.js:2147`). In `d1280/selected-sthilaire.json` and `d1024/...` the selected name `n:sthilaire` has the same plate as its neighbours
  (`rgba(10,14,18,0.88)`, only `keep` differs). In the capture the selection ellipse and the plateau octagon read alike.
- The dossier names the selection, which limits the cost; S3 P3 kept. Origin inherited (the ring and plate); the outline's accent is decision 239's.

## visual-maps #10 (V-M11): the Plans view mixes about 40 serif labels: CONFIRMED (one detail added)

**Method.** Code read; `d1600/plans-overview.json` and `d1280/plans-overview.json` tabulated.

- `app.js:5157` and `5159`: overlay and plan labels both `mlt-serif`, the annotation colour, the same plate, no side mark.
- 1600: 44 drawn (29 plan, 8 overlay, 7 others), 13 dropped; 1280: 40 drawn (27 plan, 7 overlay), 17 dropped, among them `pl:Soult concealed in
  the Goldbach valley`, `pl:The second axis`, `pl:Stare Vinohrady`. As stated, but "about 40 serif labels" is 37 (1600) and 34 (1280), and at 1600
  one plan label is dropped too (`pl:The concealed centre`, also dropped on 8J's build: `docs/STAGE8_SPEC.md:5326-5327`). S3 P3, inherited.

## visual-maps #11 (V-M12): the Field vantage sits 3% inside the corps threshold: **Method.** A bounded re-make of the area's clip with the distances logged (`pan-and-stream.js` part A, output `v-batch-visual/pan-and-stream.json`):
the harness page at 1600 x 900, Landscape with counters, Study, 09:30, the Field vantage's camera (`VANTAGE.field`, `app.js:6334`), a left-button
drag of 6 px a frame for 45 frames then 15 at rest, through the motion driver (`tools/visual/motion.js`); each frame `viewDist()`, `MLS.bandD`,
the orbit target and the counters drawn. Code read: `app.js:6092-6093` (`dist=mlBand(viewDist())`, `wantCorps=dist>250`), `app.js:6481-6482`
(`anchor`), `app.js:6498` (`panEnd` calls `anchor`).

- The Field vantage measures **243.67** units here (the area's 242.8: 2.5% inside 250, not 3%).
- During the drag the distance does **not** change: 243.67 in frames 0-45 (the pan moves eye and target together on the grab's plane; the target's
  y stays 3.72). At release (frame 46) `panEnd` calls `anchor()`, which slides the target along its own view ray onto the drawn ground (y 3.72 to
  0.04): the picture does not move, but the eye-target distance becomes **253.6**, past 250. `MLS.bandD` holds 243.67 until rest; at frame 59 the
  band is released and the level flips: corps and army counters drawn 4 to **12** (8 corps counters added: c_cav, c_gd, c_i, c_iv, c_v, col4,
  constantine, buxhowden), other counters 14 to **1**. The area's swap (8 corps in, the divisions out, at its frame 59) is reproduced frame for frame.
- Origin: `wantCorps = dist>250` and `panEnd`'s `anchor()` both present at `0a19964` (step 4; `git log -S`); 8C's band (decision 240 (a)) only defers
  the flip to rest. Inherited.

**Judgement.** CONFIRMED, with the cause now measured and refined: not the pan's travel but the target's re-seat onto lower ground at the pan's end,
which adds about 10 units to the distance without moving the picture; any pan from the Field vantage that ends where the ground under the centre
lies about 3 units or more below the preset's target can flip the level. Category probable-problem to **confirmed-defect**; S3 P3 kept. The remedy
(hysteresis on `wantCorps`, or the preset moved clear of 250) is feasible; keying the level on a distance the re-seat does not change is a third
option; any of them would move the motion block's counts, which are owner-held (decision 257 (b), 267 (a)): to be re-measured on the owner's word.

## visual-maps #12 (V-M13): between 720 and 1079 px a selection leaves a 209 px strip: CONFIRMED

**Method.** CSS read; capture viewed. `style.css:575-582`: below 1080 px the dispatch card is `left:16px; width:min(420px,...)` and gives way to an
open dossier only when the rail is shown (`body.drawer-open:not(.rail-hidden):not(.docked) .dispatch{display:none}`); the drawer is
`--draw:min(360px,90vw)`. `d1024/selected-sthilaire.jpg`: card to x about 456, dossier from about 665: a strip of about 209 px. Not covered by
decision 165 (the dossier's height) or SW-2 (the rail case). S3 P3, inherited.

## visual-maps #13 (V-M14): the low views' wall of formation names: CONFIRMED (accepted-compromise)

**Method.** Decision record and read-back. Decision 255 (a) (`docs/STAGE8_SPEC.md:2509-2513`): "Do not mark the low-view wall of formation names
fully resolved", option (d) a separate prototype. `d1280/wall-1200.json`: 31 items drawn (19 names, 4 places, 4 overlay labels of which one an
objective, 3 events, the plateau reading), tops y 41-340 (boxes to 357), label area 8.51%. One number corrected: the 16 far plates measure
7.06-12.39:1 (11 of them 7.06-7.30), the 3 full plates 12.51-13.09:1. Category accepted-compromise, S3 P3, as stated.

## visual-maps #14 (V-M15): the default event glyph reads as a north arrow; capture as the objective marker: CONFIRMED

**Method.** Code read; crop of `d1600/paper-pratzen.jpg` (500-1300, 0-420) viewed.

- `eventGlyph` (`app.js:3913-3927`): the default kind a ring (r 38) with a vertical shaft and an up-pointing head, on a screen-aligned sprite;
  "capture" a ring (r 38, width 5) with a full cross (16-112, width 3.5). `buildObjective` (`app.js:3084-3090`): a ring (r 40, width 7) with a
  full cross (14-114): the same figure, differing in colour and stroke. The paper map has no north arrow of its own (grep: none), and the crop shows
  the pale ring and up-arrow at the top of the north-up plan exactly where one would stand. S4 P3, inherited. Overlaps visual-maps #7's look-alike
  sentence (not a duplicate: #7 is the legend).

## visual-maps #15 (V-M16): the Littawa's name dropped in the Plans view, and at 1280: CONFIRMED (accepted-compromise)

**Method.** `docs/STAGE8_SPEC.md:5317-5330` (section 22.4: the case's limit 13 on the owner's word, the Littawa named as the 13th) and both
read-backs (`t:litava` dropped at 1600 and at 1280). S4 P4, accepted-compromise. Its fix follows visual-maps #10 if adopted.

## visual-maps #16 (V-M17): paper-map arrows grow without a cap: CONFIRMED (accepted-compromise)

**Method.** Decision record: 241 (a) "Keep paper-map arrow widths unchanged" (`docs/STAGE8_SPEC.md:170-175`; 0.3.1 item 4, `:252-255`; as built
`:1883`, `app.js:2835`). The crop above shows arrows tens of px wide over the formations' marks. S4 P4, accepted-compromise.

## visual-maps #17 (V-M18): "Litava river" among the 1805 German forms: WEAKENED

**Method.** Data and code read.

- On screen the river has one name, "Litava river", with "Also Littawa" as its sub (`data.js:692-693`): decision 205's rule, one name per thing
  (`docs/step5-evidence/questions.md:12`), is met; 205 is not a rule about which language a name takes.
- `world.js:1622` "Littawa" is the building planner's internal label for a clearance line (`VILL8G.clear.stream`), never shown to a visitor.
- The map has no single 1805-German convention for "Litava" to break: "Stare Vinohrady" and "Zuran mound" are Czech forms too, beside
  "Pratzeberg", "Telnitz" and "Augezd" (FEATURES names, `data.js`).

**Corrected statement.** The map's place names mix German period forms with Czech forms (Stare Vinohrady, Zuran, Litava), following no stated
toponymy convention; a convention, if wanted, is an owner choice and a data task. Only the project's own records (section 22.4's "Littawa")
differ from the screen's name. S4 P4, optional-improvement.

---

## Extra issue

**The map layer's distance-keyed levels can flip at rest after any landscape pan** (S3; inherited, `0a19964`). `panEnd` (`app.js:6498`) calls
`anchor()` (`app.js:6481-6482`), which slides the orbit target along its own view ray onto the drawn ground: the picture does not move, but `viewDist()`
changes (measured +9.9 units, 243.67 to 253.6, after the 270 px pan above). `viewDist` keys `wantCorps` (>250) and `showBde` (<165, `app.js:6094`),
so the brigade level can flip the same way (inferred from the code, not measured). This generalises visual-maps #11 beyond the Field preset.

## What was not checked

- Visual-landscape #4: the stream's roughness and the bloom were not toggled, so the glint's cause is inferred; only the sky term is refuted.
- Visual-landscape #2's yaw numbers were re-read from the area's read-backs, not re-measured in a page; the mechanism was established from code.
- No capture was retaken for the visual-maps findings: their read-backs and images were re-read and the code behind each was read at HEAD.
- Origins were checked by `git log -S`/`git show` and the archived builds where named; the 1280 Watch caption on a pre-Stage 8 build was not run.
