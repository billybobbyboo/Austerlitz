# Verification: v-repro-srcgeo-sim (reproduction lens, five major findings)

Audited build `austerlitz-command-map.html`, 2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83` (checked: `md5sum`, `stat`), sources at
HEAD (application files identical to `origin/main` `43e3e5b`). Nothing of the application, data, tests, thresholds, archive or build was changed;
no `npm test`, `build.py`, harness or `contrast.js` was run. My scripts: `tools/audit-post8/verification/v-repro-srcgeo-sim/`
(`relief-probe.js`, `schlap.js`, `browser-probe.js`, `state-probe.js`, `state-probe2.js`); raw outputs in the scratchpad folder
`/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad/v-repro-srcgeo-sim/` (`fts-repro.txt`, `fts-mine.txt`,
`model-pts.json`, `dem-mine.json`, `relief-compare.txt`, `selftest-141f890.log`, `browser-probe-run1.json`, `state-probe.json`, `state-probe2.json`); copies of the small ones are in
`docs/audit-post8-evidence/verification/v-repro-srcgeo-sim/`; the numbers that matter are copied below.

| finding | verdict | severity / priority (mine) |
|---|---|---|
| sources-oob #0 Duffy figures | CONFIRMED | S2 / P1 (the finding: P2) |
| geography #0 relief model | CONFIRMED | S2 / P1 |
| state #0 stale dossier | CONFIRMED | S2 / P2 |
| interaction #0 glide undoes input | CONFIRMED (scope: the landscape; the remedy corrected) | S2 / P2 |
| tests #0 TS-1 merge gate | WEAKENED (facts confirmed, severity overstated) | S3 / P2 |

## 1. sources-oob #0: order-of-battle figures attributed to Duffy (1977) that Duffy does not print: CONFIRMED

Method: re-ran the finding's repro command myself and read its raw output; ran my own further queries (OCR variants and controls) with the same
public full-text search; read every cited line at HEAD; checked the archived builds for the origin.

- `python3 -I tools/audit-post8/sources-oob/ia-fts.py austerlitz18050000duff '3,800 and 9 guns' '2,500 and 3 guns' '4,300' '830' '3,470' '6,780' '3,440' '13,650' '13,240' 'Miloradovich and Kollowrath' '13,900'`
  (2 November 2026, about 10:43 UTC; output `fts-repro.txt`): hits for "3,800 and 9 guns" ("Ill Corps, MARSHAL DAVOUT 2nd Div. (3,800 and 9 guns)
  Gen. Friant"), "2,500 and 3 guns" (Bourcier), "6,780" (Kienmayer's advance guard, "6,780 men— this figure, like the following figures ..."; the
  table row "(6,780 and 12 light pieces)"), "13,650" (Dokhturov, "13,650, 40 light and 24 heavy pieces"), "Miloradovich and Kollowrath" (the 4th
  Column "(23,900, 52 light and 24 heavy"); 0 hits for 4,300, 830, 3,470, 3,440, 13,240 and 13,900. The finding's evidence reproduces word for word.
- My own queries (`fts-mine.txt`): controls "10,530" (S5.7's Guard heading, read on the owner's photograph) found, both the narrative and the table
  row, so this OCR layer carries the appendix's figures; "23,900" found twice ("an Austro-Russian fourth column of 23,900 infantry" and the table
  row); "Friant" found with "(3,800 men and 9 guns)" in the narrative. Zero hits for "4,800", "9,100", "6,880", "830 cavalry" and for OCR variants
  "4 300", "4.300", "3 470", "3.470", "13 900", "13.900" ("12 700" also 0 while "12,700" hits: the phrase search keeps the comma, so the variants
  had to be searched separately; they were).
- Cited lines read at HEAD: `data.js:240` c_iii "Duffy and Smith give 4,300 men present, including 830 cavalry, with 12 guns" (strength 4300);
  `data.js:248` friant "about 3,470 in Duffy and Smith" (3470); `data.js:470` kienmayer "Duffy and Smith (cited, not read), as transcribed here,
  give 3,440 foot and 3,440 horse, which make 6,880"; `data.js:485` dok "13,240 infantry and 250 cavalry with 64 guns (Duffy/Smith)" (13490);
  `data.js:550-551` col4 strength 13900, "13,900 infantry with 52 light and 24 heavy guns (Duffy 1977; Smith 1998) ... 23,900 (Chandler, and an
  older revision of the same order of battle)"; `data.js:558-559` milo 4800, "Duffy and Smith imply about 4,800 (13,900 less the Austrian
  brigades' 9,100)"; `analysis.js:25` theme weakness "some 4,300 men by Duffy's and Smith's count"; `appearance.js:547` "about 3,470 present
  (Duffy, Smith)"; `narrative.js:537-539` kienmayer's claim (disputed) whose note says the replaced 6,800 "came from a transcription of Duffy and
  Smith that sums to 6,880". Duffy's printed 6,780 rounds to that 6,800.
- Shown to visitors: the strength notes in every formation dossier's "On the figures" row (`app.js:7978`); the theme in Study. In `narrative.js`
  only kienmayer's note has a claim; the other five notes and the theme carry none (shown "Not yet checked").
- Origin inherited: every one of the strings is in `archive/stage0-c09c4b23.html`, `archive/correction-pass-672aff9f.html` and
  `archive/step4-833743c6.html` (grep counts 1 each).
- Limits: the evidence is the OCR text layer (the project's standard for "fact" is the page image); a negative search cannot exclude a figure the
  OCR misread, but for each formation Duffy prints a different figure in the same row (3,800; 6,780; 13,650; 23,900), so the attributions fail on
  the positive evidence alone. Not re-derived: the finding's "Duffy's IV Column rows add to about 16,065" (snippets do not give every row). Smith
  (1998) is unread (S5.8): whether Smith prints these figures is open, and the finding's remedy keeps that open.
- Judgement: S2 agreed (a visitor-facing false source attribution, CLAUDE.md's first rule, "never invent ... strengths ... or sources", on the
  dossier and a Study theme). Priority: P1 rather than P2: historical integrity is the project's first priority, the rewording is cheap (2-4 h)
  and needs no new reading; the settling of the working figures can follow as the data task the remedy names. The rewording itself touches
  `data.js`, `analysis.js`, `appearance.js` and `narrative.js`, so it is a data task under CLAUDE.md (check:data reference, claim hashes,
  CHANGELOG): feasible, no decision conflicts.

## 2. geography #0: the relief model 30-80 m low over the southern Pratzen plateau and the chapel knoll, about 45-50 m high at Slapanice: CONFIRMED

Method: my own probe (`relief-probe.js`) loads `geo.js`, `data.js`, `analysis.js`, `appearance.js`, `tokens.js` and `world.js` read-only in a vm on
three r128 and evaluates `GEOREF.elevM(hAt(map))` (the model the finding names, `world.js:273-323`, `geo.js:44-50`) at 60 points of my own choosing:
every on-map GT point, a 4 x 4 grid (not the area's 6 x 6) over the finding's box (map x 270-330, y 295-350), the finding's two proposed anchors,
and two 9-point profiles. The DEM is my own query of three datasets other than the area's GLO-90: ASTER GDEM 30 m (optical stereo, independent of
SRTM), EU-DEM 25 m and SRTM 30 m (`api.opentopodata.org/v1/{aster30m,eudem25m,srtm30m}`, 2 November 2026 about 10:46 UTC; `dem-mine.json`).

| measure | model | EU-DEM | SRTM | ASTER |
|---|---|---|---|---|
| controls: the 9 GT points with a sourced elevation, mean abs. difference to GT | 0-5 m (fitted there) | 4.0 m | 4.6 m | |
| southern box, 16 cells, mean | 223.8 m | 269.3 m | 266.9 m | 260.1 m |
| southern box, cells above the fog's top 238.2 m | 4 / 16 | 13 / 16 | 13 / 16 | 13 / 16 |
| map (288,311) | 255.3 m | 308.7 m | 307 m | 304 m |
| map (297,328) | 218.8 m | 296.0 m | 289 m | 285 m |
| GT.chapel (approx. point) | 200.5 m | 242.7 m | 242 m | 235 m |
| GT.schlapanitz | 273.0 m | 224.2 m | 222 m | 224 m |

Profiles (model minus EU-DEM): Pratzeberg to Augezd mean -34.4 m, worst -78.3 m (1.0 km south of the summit: model 233.5 m, EU-DEM 311.8 m);
Sokolnitz to Hostieradek mean -23.4 m, worst -77.5 m (model about 207-221 m along the ridge where EU-DEM gives 256-292 m). Against SRTM the same
within 2 m. My numbers match the finding's in sign and size (its box mean 228.1 against 273.4 on a 6 x 6 grid; profiles -39/-82 and -25/-82;
chapel 198 against 240 at OSM's point; Slapanice 273 against 225).

- Code read at HEAD: `tools/relief-fit.js:4-9` has 12 anchors (pratzeberg, vinohrady, santon, zuran, bosenitz, kobelnitz, sokolnitz, pratzen,
  vinocol, augezd, krzenowitz, austerlitz), none in the box, at the chapel or at Slapanice; `world.js:289` adds a bump `SCHLAP=W(163,177)`
  (`world.js:250`) of amplitude 3.0 units that `relief-fit.js` does not fit (no `schlap` term). The fog's coverage reads the model's height
  (`app.js:373`, `4368`, `10741`: fogged below `hAt` -0.8, 238.2 m), so the misdrawn ground propagates to the fog and the Command view's readings.
- Visitor text read: `data.js:797` "heights follow a separate vertical scale fitted to surveyed elevations"; `data.js:799` names only the stream
  beds' reverse gradients and the chapel's sight line as the model's known limits; `data.js:653` "Extent: Runs north-south between Blasowitz and the
  Litava" (my profile: the model's high ground ends about 1 km south of the Pratzeberg, where every DEM stays above 305 m).
- No owner decision covers the departures: the project compared summits only (CHANGELOG.md:9237, 9277); no DEM between anchors before this audit.
- Origin inherited: `tools/relief-fit.js` dates from 2026-10-02 (`18e014b`), before Stage 8.
- Not re-done: the area's 300 m core grid (rms 20.1 m) and 600 m frame grid; the area's occupancy counts (who stands in the box) and its fog-area
  sums; the OSM chapel point.
- Judgement: S2 / P1 agreed (the disclosure is the P1 part; the refit is a geographic data task with consequences for fog, knowledge, viewsheds,
  going and baselines, as the finding says).

## 3. state #0: the open dossier goes stale while the clock moves within a phase: CONFIRMED

Method: two browser runs of my own on a visitor's page at 1280 x 720 (the audited build; the same virtual-clock stepping as section 4, the
draw skipped): `browser-probe.js` run 1 and `state-probe.js` (`state-probe.json`), then `state-probe2.js` (`state-probe2.json`). Every move of
the clock inside the phase is real input (a mouse click on the time rail at the minute's x, or ArrowRight on the focused rail, ten minutes a
press). The selection was made through the app's own handlers (the order-of-battle row's and the "Full dossier" button's `element.click()`,
`select("t","pratzen")`), because under this machine's load the docked panels' slide never settled and a real click there hit the canvas (said so in
the records). The dossier's text is `#drawer-body`'s `innerText`; the model's place is `nearestFeature(posNow(id))`, its list `placeNearby`, read
in the page at the same clock.

| case | painted | shown after the clock moved (same phase) | the model at that clock | `drawerKey` painted / now |
|---|---|---|---|---|
| C1 Napoleon's headquarters, card ("Where"), marching 12:00-12:40 | 12:00 "Zuran mound" (key `6s\|none`); repainted once when the key turned to moving, at the first ArrowRight, 12:10 (inferred from the key; the 12:10 text not read) | at 12:30 "0.8 km north-west of Girzikowitz"; at 12:37 the same | 12:30 "1.3 km north-west of Stare Vinohrady"; 12:37 "Stare Vinohrady" | `6m\|none` / `6m\|none` |
| C2 the same, full dossier, standing 04:05-04:45 | "Position at 04:05 · Zuran mound", day-track "at 04:05" | at 04:45 (4 x ArrowRight) "Position at 04:05", day-track "at 04:05" | Zuran mound (the place right, the time stale) | `0s\|none` / `0s\|none` |
| C3 Pratzen Heights, everyone's reading, phase 6 | 11:15 "Formations nearby now: Saint-Hilaire's Division, Kamensky's Brigade" | at 12:44 the same two | Imperial Headquarters, Saint-Hilaire's Division, Drouet d'Erlon's Division, Guard Cavalry | `""` / `""` |

C3 is the area's own example (pratzen 11:16 to 12:44) reproduced to the name. Not reproduced: C4 (aggregates' midpoints) and the counts (86 of
240 place-phases, 49 aggregate-phases); not run: Play (code: `tickClock` advances through `setClock(nt,{play:true})`, `app.js` tickClock, so the
same gate applies).

- Code at HEAD: `setClock` repaints the dossier at a phase change (`app.js:3495`) and inside a phase only `if(selection&&(selection.kind==="f"||
  selection.kind==="t")&&drawerKey()!==_drawerKey)` (`app.js:3498`); `drawerKey` (`app.js:7720-7728`) is, for a formation, each leaf's
  `textPhase` plus moving or standing plus hidden, the reading and the eye, and for a place under everyone's reading `""`, so a place's dossier
  never repaints inside a phase; the rows read the clock (`posRow`, `app.js:7908-7913`: "Where", "Position at "+fmtClock(clock)); the place's list
  is `placeNearby` at the clock (`app.js:8235`, `8266-8273`). The other call (`app.js:4266`) uses the same key.
- Origin inherited: `archive/step5c-45f8f662.html` has the same gate (`selection.kind==="f"&&drawerKey()!==_drawerKey`) with a key of
  `textPhase` and moving or standing only; 8A added the reading's parts.
- Judgement: S2 / P2 agreed: "Where" and "Formations nearby now" are stated as current and contradict the map beside them (C1 by about 3-3.5 km at
  12:37, derived from the two named places' GT points); "Position at 04:05" at 04:45 names its own clock, a smaller cost. Remedy feasible; a repaint each clock minute must keep the dossier's
  focus and scroll (the finding's risk).

## 4. interaction #0: a pan, zoom or keyboard pan during a camera glide is undone: CONFIRMED

Method: `browser-probe.js` (run 1, `browser-probe-run1.json`), a visitor's page (no `?harness=1`, CSS transitions kept) at 1280 x 720 on the
audited build (md5 checked in the record), first-run card closed by a real Escape. The machine stood at a load of 28-35 on 4 cores (a first attempt
in real time measured 22.0 s for 4 frames, 5.5 s a frame, so a 1.5 s glide ends inside one frame), so the app's own `loop()` was stepped on a
virtual clock of my own (`performance.now` answering it, 30 steps a second, the WebGL draw skipped), as `tools/visual/motion.js` does; this is my
own code, not the area's `ilib.js` driver, but the same kind of method. Input is real: Playwright mouse clicks at hit-tested button centres, a
6-step mouse drag at the free rectangle's centre (788, 336), three wheel notches (-240). Destinations: each vantage's glide run to its end with no
input. Distances: target plus eye displacement in world units, as the finding measures.

| case (10 steps, 333 ms, into the glide; then the input) | glide slot at release | pan moves handled | release to the destination | end (after 90 steps) to the destination | freeCam at end |
|---|---|---|---|---|---|
| control: a drag with no glide running | none | 6 | (moved 106.5 by the drag) | moved 0.000 after release: it holds | true |
| Zuran vantage + drag | running | 6 | 251.5 | 0.000 | true |
| Pratzen vantage + 3 wheel notches | running | (wheel) | 246.9 | 0.000 | true |
| Allied vantage + drag | running | 6 | 371.5 | 0.000 | true |
| phase arc (PageDown on the rail, 04:00 to 07:00, Follow on) + drag | running | 6 | 116.7 from the end | 0.000 from phase 1's preset (`presetFrame(PHASES[1].cam)`) | true |

The camera after the Zuran drag, every 10 steps: 126.2, 19.4, 0.09, then 0 from the destination: the glide carried it on. Follow is `!freeCam`
(Stage 3 spec), so it shows off while the camera lands on the preset. My numbers differ from the area's (525.5, 185.7, 185.9, 335.4: other
inputs and timings), the behaviour is the same. Not run: the map's arrow keys during a glide and the phone's finger pan (code below covers the
keys: `LANDCAM.key`, `app.js:6524-6532`, pans through `panStart`/`panTo`).

- Code at HEAD: `glide` (`app.js:6309-6322`) puts an absolute `applyArc` in the camera slot every frame until k reaches 1 (time from
  `performance.now`); `free()` (`app.js:6479`) sets `freeCam` and `curVantage` only; `panTo` (`6489-6497`) moves the camera then calls `free()`;
  the loop runs `if(tween) tween(now)` unconditionally (`app.js:9132`); `bindCanvas` (`6854-`) calls `LANDCAM.panStart/panTo/panEnd/zoomAt/orbit/
  focusAt` and sets `freeCam=true`, never `setTween`/`stopTweens`; `startPhaseTransition` sets the same slot (`3460`, `3472`); only `redrawGround`
  stops it (`2548`). The Stage 3 rule it breaks: `docs/STAGE3_SPEC.md:249-252` ("off, the eye stays where the visitor put it").
- Origin inherited: the same `glide` and `free()` are in `archive/step5c-45f8f662.html` (before Stage 8).
- Scope: the landscape's camera only. The paper map already stops its own glide on the visitor's input: `MAPCAM`'s `stop()` (`app.js:4915`)
  advances its generation, `pan` and `zoomAt` call it (`4917`, `4919`), and its scheduled glide step ends when the generation has moved
  (`4952-4953`); not run in a browser here. The remedy's "(and the paper map's MAPCAM moves)" is not needed.
- Remedy, a correction: stopping the slot inside `free()` as proposed would cancel the double-click's own focus glide, because `focusAt` calls
  `glide(...)` and then `free()` (`app.js:6517-6520`). Stop the slot at the input entry points (`panStart`, `zoomAt`, `orbit`, `key`, the touch
  handlers) before they move the camera, or have `focusAt` call `free()` before its glide and keep `freeCam` true after it.
- Judgement: S2 / P2 agreed (the visitor's own navigation input discarded after every preset, centring, phase, theme or tour click, for 1.5-2.6 s;
  reproduced here on the desktop, the phone's case is the area's `s10b-phone-drag.json`, not re-run).

## 5. tests #0 (TS-1): the merge gate requires only the node job: WEAKENED (every fact confirmed; S2 overstated, S3)

Method: read `.github/workflows/checks.yml` at HEAD; read the ruleset, the branch and every check run through the GitHub API myself (`gh api`,
public endpoints, 2 November 2026); downloaded the failing job's log.

- `GET repos/billybobbyboo/Austerlitz/rulesets`: one ruleset, "protect main.", id 24036909, enforcement active, created 2026-09-26T09:06:15Z,
  updated 09:07:18Z, target `~DEFAULT_BRANCH`, `bypass_actors` [] (as returned to this token). `GET .../rules/branches/main`: deletion,
  non_fast_forward, pull_request (0 approvals), required_status_checks `[{"context":"checks","integration_id":15368}]`, strict. Classic branch
  protection: `"enabled": false` (`GET .../branches/main`; the protection endpoint answers 403 to this token).
- `checks.yml`: the node job `checks` (lines 22-40: build, the committed HTML against it, `npm test`, `check:data`, `check:chronology`); the
  browser matrix `contrast`/`selftest` (lines 45-65) on every push and pull request; `visual` only `if: github.event_name == 'workflow_dispatch' &&
  inputs.visual` (lines 75-76). Decision 132's job-adding commit is `fd6e537` (2026-10-07), eleven days after the ruleset.
- Check runs: PR #77's head `ec911c9`: `browser (selftest)` failure (both the push and the pull_request runs, completed 07:05:10 and 07:05:30 UTC),
  `checks` success. Its merge `141f890` (2026-10-31 07:55 UTC): `browser (selftest)` failure (completed 08:44:41), `checks` success (08:01:18),
  Pages `build` and `deploy` success (deploy completed 07:57:18, before either browser job or even the node job had finished). The only failure in
  that job's log (`selftest-141f890.log`, line 721): "FAIL the map layer in motion (decision 240 (a)): jumps 248 over the 16 motions (limit 245);
  pops 998 (limit 985)", "STAGE0 FAILURES: 1": the known question-267 line. `c2adefe` (2026-11-01 06:55 UTC): all success. Main's first-parent
  history has no commit between them, so main stood red 23 hours. Every other Stage 8 merge into main (`0ca1414`, `8eb3ef4`, `2f41819`, `94d6e46`,
  `51d4a15`, `636cc5d`, `b7fb67a`, `72c7e1b`, `43e3e5b`): both browser checks success. Dispatch run 41259079904 on `d3f7026`: all four jobs success.
- Not checked: the finding's list of `visual` outcomes on PRs #70-#79 (only 41259079904 read).
- Origin inherited (ruleset 2026-09-26, browser jobs 2026-10-07; Stage 8 began 23 October).
- Why WEAKENED: decision 132 (`docs/FINAL_AUDIT.md:834`, `877-879`) asked for the two checks to be added to `checks.yml` and `check:visual` kept
  on demand; it says nothing of required checks, so the implementation does not contradict it, and no CLAUDE.md rule requires a gate. The one red
  merge was the owner's, knowingly, over a line the integration pass had put to the owner (question 267, CLAUDE.md "every required check passes but
  that one line"), settled as decision 267 (a) the next day; nothing a visitor sees was wrong in those 23 hours. That is a process risk, not
  "wrong or misleading behaviour on a reachable common path": S3, P2 (the remedy is a ruleset setting, minutes). Adding the two browser checks to
  the required checks gates merges only: the Pages deployment of `main` waits for no check at all (deploy 07:57:18 against the node job's 08:01:18
  on `141f890`), which the remedy should say.

## 6. Related issues no finding covers (extra_issues)

1. **The Slapanice bump is not fitted** (S4, part of geography #0's cause): `world.js:289` adds `bump(x,z,SCHLAP,15,9,3.0,0.36)` centred on
   `SCHLAP=W(163,177)` (`world.js:250`), GT.schlapanitz's own point (map 163.21, 177.22), worth about 3.6 units after the x1.2 (about 22 m);
   `tools/relief-fit.js` has no term for it and no anchor there, and no record gives a reason (CHANGELOG, docs searched). It accounts for about 22
   of the model's +49 m at the village (model 273.0 m against EU-DEM 224.2, SRTM 222, ASTER 224). A refit should drop or fit it.
2. **The Pages deployment of `main` waits for no check** (S4, process; beside tests #0): on `141f890` the Pages `deploy` completed 07:57:18 UTC,
   before the required node job `checks` (08:01:18) and both browser jobs (08:04:28, 08:44:41). Required status checks gate a pull request's
   merge, not the deployment of what lands on `main`.
