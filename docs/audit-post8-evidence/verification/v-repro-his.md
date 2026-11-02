# Verification 'v-repro-his': the history area's findings #0-#4 reproduced

Build: `austerlitz-command-map.html`, 2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83`; the application files of this branch identical to
`origin/main` `43e3e5b` (`git diff --stat origin/main -- data.js analysis.js narrative.js app.js world.js geo.js appearance.js ...`: empty).
Nothing in the application, data, tests, thresholds, archive or build was changed.

## Method

- **My own probes, not the area's.** A loader of my own (`tools/audit-post8/verification/v-repro-his/load.js`) follows `sim-test.js`'s loading
  order in an isolated copy made from the audit's template (`scratchpad/v-repro-his-iso`, its application files checked md5-identical to HEAD;
  `tools/mk-world-mod.js` and `tools/mk-helpers.js` run there only); `waitingFor` and `textPhase` (the card's status rule) are taken from the live
  `app.js` by name. The probes compute positions with the model's own `posAtClock` and everything else (velocity, distances, angles, overlaps)
  themselves: `f0-motion.js`, `f0-guards.js`, `f1-f3.js f1|f3`, `f4-grades.js`. Outputs: `docs/audit-post8-evidence/verification/v-repro-his/*.txt`.
- **The page.** `browser.js`: one harness page at 1600 x 900 (Chromium 141, SwiftShader). Real input where a visitor's path is the claim: the
  first-run card's primary action and the opening bar's Next by real clicks (as `tools/visual/harness.js` reaches `opening-2`), Esc by a real key,
  the face-about marker by a real mouse press at its box. Other states set through the harness's own case driver (`window.__aus.apply` ->
  `AUSTERLITZ_DEBUG.applyCase`: clock, selection, camera), stated here as set-up, not as input. Read from the page: the drawer's DOM text and
  pills, the blocks' instance matrices (each figure's world position), the block quaternion, `BLDG`'s castle parts, the map layer's texts.
  Output: `v-repro-his/browser.json` and the JPEGs beside it.
- **Sources.** For #3 I re-read the three page images the register cites (downloaded fresh from archive.org into their own directories and
  read as images): Materialien 1806 p. 106 (n115), p. 118 (n127), Stutterheim 1806 p. 56 (n59).

BROWSER_SECTION

## history #0: offensive status while walking away (verdict below)

**Code read at HEAD.** `anchorList` (app.js:3235-3277): an undated leg's window is `[previous anchor's arrival, this anchor's arrival]`, so the
leg out of an anchor begins the minute it is reached; `stateAt` (app.js:691-704) carries the phase's status; the card and dossier show
`liveStatus` -> `stateAt(id,textPhase(id,clock))` (app.js:7696-7700, 7793, 7935); `waitingFor` (app.js:7689-7694) only applies to a leg into the
current phase's anchor whose departure falls after the phase opens; `poseBlock` faces a moving block along `headingAt` (app.js:6001-6002:
`var want=headingAt(id,clock); if(want===null) want=enemyFacing(id);`). Data: rg_inf@6 [327,194] counterattack, @7 [397,196] repulsed
(data.js:633-634); rg_cav@6 [321,189] charging, @7 [406,188] (data.js:643-644); lich@5 [298,156] charging, @6 [341,152] (data.js:593-594); milo@4
[315,237] counterattack, @6 [392,232] (data.js:564-565). OVERLAYS[6]'s "Russian Imperial Guard" attack arrow `[[413,202],[359,187],[330,192]]`
(app.js:79) points west. The gait plays for any leg at or above `GAIT.KMH` = 1 km/h while the clock plays (app.js:5812, 5863).

**My numbers** (`f0-motion.txt`, 5-minute samples, velocity from `posAtClock` +/-2.5 min, map north up):
- rg_inf: 11:20-12:40 shown "Counter-attacking", moving 1.48 km/h toward 92 deg (east), its distance to Vandamme growing 1.16 -> 3.09 km at
  1.38-1.46 km/h, 160-172 deg off the bearing to him; 17 of 18 moving samples > 120 deg off.
- rg_cav: 11:15-12:40 "Charging", 1.79 km/h toward 88-89 deg, Vandamme 0.96 -> 3.37 km; 18 of 18.
- lich: 10:35-11:10 "Charging", 1.82 km/h toward 85 deg; 120-137 deg off Kellermann, 151-158 off Nansouty; 8 of 9.
- milo: 09:30-11:10 "Counter-attacking" (phases 4 and 5: its phase-4 act "Rallied by Kutuzov for a counterattack up the southern slope"),
  1.22-1.39 km/h toward 86-88 deg, Saint-Hilaire 1.88 -> 3.43 km; 21 of 21 (> 120 deg off Vandamme, the nearest, from 09:50).
- kollo: 10:15-10:25 "Counter-attacking" at 4.86 km/h away (decision 181 (a)'s forced leg: accepted, as the finding says).
- The two Guards never close (`f0-guards.txt`): rg_cav's nearest approach to the French Guard cavalry 1.19 km, rg_inf's 1.29 km, both at 11:15.

These match the finding's numbers (1.48, 1.79, 1.82, 1.39 km/h; 160 deg; the windows). Origin: the tracks (archive/stage0-c09c4b23.html:1551-1556),
Stage 0's `legWindow` (from the previous phase's start to the next's, archive/stage0:4962-4966) and the facing rule (archive/stage0:6402) are all
pre-Stage 8: inherited; 8E's gait animates the walk. Decision 45 (docs/STAGE2_SPEC.md:1117, M.10) keeps undated legs' timing and lists the
creeping approaches; it says nothing of the status or facing shown on a leg that moves away, and decision 46 covers only dated departures: no
owner decision covers the mismatch. Remedy note: `moveMin` holds on rg_inf@7, rg_cav@7, lich@6, milo@6 shorten the mismatch but cannot remove
it (the hold ends inside the same phase, so the walk east still shows the phase's offensive status); a `tm` arrival after the phase start is
barred without a dated statement (data.js:140-142). Only the presentation rule (or new intermediate anchors, a data task) meets the finding's
own validation ("zero offensive-status samples moving away"). Related, not a duplicate: visual-landscape #2 (the same facing rule, for drifts
under 1 km/h and stale facings).

F0_BROWSER

## history #1: Legrand through the castle and the III Column

**Data at HEAD.** legrand@2 [206,366] engaged "Fights for Sokolnitz village and the castle wall", @4 [220,321] supporting, no @3
(data.js:227-228); prz@2/@4/@7 [215,341] (data.js:536-538); `LANDMARK_SITES.castle` [212.9,344.3] (world.js:162).

**My numbers** (`f1.txt`, 0.25-minute samples): closest legrand-prz 37 m at 08:51 (530.75 min); closest legrand-castle site 4 m at 08:44 (523.5
min; the finding's 25 m is the 08:45 value); at 08:45 the centres 101 m apart; statuses engaged / attacking. Archives: Legrand's anchors 0, 1, 2, 4
identical in archive/stage8h-24e29da7.html:2146-2149, archive/stage8j-7d5594ba.html:2149-2152 and the build; prz@2/@4/@7 were [238,332]/[233,344]/
[227,338] in 8H (stage8h:2448-2450) and are [215,341] since 8J. With 8H's prz anchors the closest approach is 620 m at 09:04 (the finding says
"about 0.67 km": 0.62 km here). 8H drew the castle at W(226,355) (stage8h:6547-6548), 0.50 km from Legrand's leg. New in 8J: confirmed.
The phase-2 camera (data.js PHASES[2].cam target world (-56,4,46) = map [228,342]) frames this ground, so the walk-through is on Play's path.
Context the finding leaves out: both acts put the two formations in contact at the castle (legrand@2 "the castle wall", prz@2 "Storms the walled
castle grounds"), so proximity there is not itself wrong; what is wrong is the leg carrying Legrand through the column and out 0.65 km beyond it
(north, behind the Allied attackers) by 09:30 while "engaged".

F1_BROWSER

## history #2: the face-about event's "Fact"

**Data and code at HEAD.** EVENTS face-about `cf:"C", claim:"fact"` (analysis.js:292-293), its why "That he ordered the column to face about is this
map's reading" (analysis.js:294); narrative.js:42-45 claims the why "interpretation", note "No account read has Kutuzov order the 4th Column to
face about; the order is this map's reading". `dossierEvent` renders `claimPill(e.claim)` (app.js:8299-8300) and the footer `CLAIM[e.claim].note`
(app.js:8328) = "Attested in the standard accounts of the battle." (data.js:16); the why is followed by `claimTag("EVENTS[#face-about].why")`
(app.js:8305) = CLAIM_WORDS.interpretation "This map's reading" (narrative.js:24). `evNoteParts` (app.js:3886-3888) adds nothing for a point event
claimed "fact", so the marker's name, the map label (`evMapText`) and the caption tag carry no qualifier. The phase line does carry one: data.js:80
(not :79, which the finding cites) "Kutuzov orders the 4th Column to face about, in this map's reading, which no account read gives, nor its hour".
Origin: claim "fact" since Stage 0 (archive/stage0: `cf:"A", claim:"fact"`), cf lowered to C in step 4b (decision 193 (b)); the why's "this map's
reading" added with decision 201 (b) (archive/step4b-e257d09b.html), which labelled the why and the phase line but left the pill
(docs/step4-evidence/questions.md:240-255): inherited, and not an owner decision to keep "Fact".

F2_BROWSER

## history #3: the Russian Guard's approach and Blasowitz

**My numbers** (`f3.txt`): at 11:15 (the event's minute) the nearest non-hq Allied formations to Blasowitz [296,147]: lich 1.43 km, rg_cav 1.54,
rg_inf 1.78, kollo 2.01, bag 2.72; at 10:30 lich 0.29 km. Over the whole day rg_inf comes no nearer Blasowitz than 1.78 km (11:15) and Krug [339,139]
than 1.75 km (11:28); rg_cav 1.54 km and 1.57 km. rg_inf@0 [413,202] and rg_cav@0 [423,193] stand 0.20 and 0.27 km from Krzenowitz [415,196],
both cf A; rg_inf@5 [378,196] at 10:30 carries the A, 3.02 km from Blasowitz. The event names caffarelli (1.16 km), rivaud (1.20 km) and rg_inf (1.78
km) with tolKm 1.3 and a tolWhy written for Caffarelli (analysis.js:310-311). PLANS.al.cols[7].ord "The Imperial Guard to remain behind
Krzenowitz, in hand." (analysis.js:186) and ANALYSIS[#plan].text "the Russian Guard stands in reserve behind Krzenowitz" (analysis.js:15) are
"unchecked" (no STATEMENT_CLAIMS entry, no class), while FORMATIONS.constantine.role (data.js:624), claimed "attributed" on Stutterheim p. 56
and the disposition p. 106 (narrative.js:113-115), says the disposition posts the Guard "at daybreak behind Blasowitz and Kruh".

**The sources, re-read on the page images.**
- Materialien 1806 p. 106 (the disposition): "Das Corps des Großfürsten Constantin Pawlowitz, kais. Hoh. besetzt bei Tages-Anbruche die Position
  hinter Blasowitz und Kruh und dient zur Verstärkung der Cavallerie des Fürsten Liechtenstein und des linken Flügels der Avantgarde des Fürsten
  Bagration." As C6.21 quotes it (readings.md:3103-3112). It is an order.
- Stutterheim 1806 p. 56: the Grand Duke "verließ zur bestimmten Stunde die Anhöhen vor Austerlitz, um auf die Anhöhen bey Blasowitz und Krug
  vorzurücken ... Der Großfürst ließ eilig das Dorf Blasowitz durch das Jäger-Bataillon der Garde besetzen." As C6.c6 quotes it; the register
  grades it A but labels it **disputed** (readings.md:3260-3265), which the finding does not say.
- Materialien 1806 p. 118 (an official Allied report the editor prints): "Kaum waren die Garden auf der anbefohlnen Anhöhe von Krzenowitz
  aufmarschirt, als der Feind mit dreifacher Uebermacht gegen die Fronte und beide Flanken anrückte ... sich auf die Anhöhen hinter Krzenowitz
  und Birnbaum zurückzuziehen"; the attackers came "aus dem Dorfe Pratzen". The register holds this twice, C1.3 and C6.22 (grade B, label fact;
  readings.md:102-110, 3114-3123). The finding does not cite it.

So the register is divided: the disposition and Stutterheim put the Guard on the Blasowitz-Krug heights with its jägers in Blasowitz; the
official report puts it on "the ordered height of Krzenowitz", attacked from Pratzen. The map's geography (dawn by Krzenowitz, the fight
between Pratzen and Krzenowitz) follows the report, while its event "The French take Blasowitz from the Russian Guard" follows Stutterheim, and
its plan text (Krzenowitz) contradicts its own attributed role text (Blasowitz and Kruh) on the same disposition. The 04:00 anchors precede the
disposition's daybreak and agree with Stutterheim's starting point ("die Anhöhen vor Austerlitz"), so they do not contradict either A reading;
the A grades are questionable because the Guard's place 07:00-11:00 is disputed in the register and no anchor or note says which side the map
takes. Origin: rg_inf's track is unchanged since Stage 0 (archive/stage0:1551-1556): inherited. rg_cav's undated creep to phase 6 is listed under
decision 45 (docs/STAGE2_SPEC.md:1249-1250), its timing accepted; its route is not.

F3_BROWSER

## history #4: carried-forward A grades

**My numbers** (`f4-grades.txt`): 180 positioned anchors; 88 graded A, 44 declared on their own entry and 44 carried; 90 grades carried in all
(none the default B): the finding's counts exactly. Of the 44 carried As, 21 stand 1 km or more from the anchor that declared the A (up to 5.60 km:
lich@9; rg_cav@9 5.37, rg_inf@9 4.94, caffarelli@9 4.10) and 29 have no act of their own. Caffarelli @6-@9 legs 0.79, 0.84, 1.45, 1.02 km, no act
(the finding's "0.79-1.45 km each"). Suchet's re-plotted anchors: @5 C, @6-@8 carried C, @9 B (8K, docs/stage8-evidence/8k/register.md:103-112).

**What a visitor is shown** (code: `posClaimOf` app.js:8098-8103, the card's ghost pill app.js:7805 `'Position '+cf+(interp?' · interpolated':'')`,
`CONF_TEXT` app.js:7731-7733, the day-track's anchor grade `stateAt(k,a.ph).cf` app.js:2444-2445). While a formation moves between two A anchors
the pill reads "Position: interpolated", the grade text is replaced by `CONF_INTERP`, and the ghost pill reads "Position A · interpolated";
"Position: documented" with "Position documented in the sources." appears only while it stands at an anchor: per day, at a carried-A anchor,
caffarelli 64 minutes, kellermann 63, nansouty 63, lich 65, rg_inf 64, rg_cav 63 (the arrival minutes and 17:00-18:00 at @9); Caffarelli's 11:15-17:00
pursuit is "interpolated" throughout but for its arrival minutes. The day-track and the evidence skeleton draw every carried-A anchor as an A
mark. So the finding's user impact ("show 'Position: documented' / 'Position documented in the sources' (e.g. Caffarelli 11:15-17:00 ...)") is
overstated in its words; the A itself is shown throughout.

**The rule.** data.js:136 states the convention: "track keys are phase ids; values carry forward until changed"; "cf = confidence for that
position" (data.js:138). A carried grade is therefore not by itself an unassessed one. The 8K register's rule (register.md:10-12) is stated for its
own anchors ("The rule applied here, anchor by anchor"); decision 260 (a) scoped the review to the affected anchors. What is established: the
dataset applies two practices side by side (Suchet's unsourced pursuit anchors C since 8K, Caffarelli's parallel ones A carried, which the 8K
register itself notes as "not re-plotted", register.md:235), and 21 carried As stand 1-5.6 km from any declared grade. Whether each carried A lacks
a reading is not established (no per-anchor source check here or in the finding): a probable problem, not a confirmed defect per anchor.
Origin: inherited (caffarelli @5-@9 unchanged since archive/stage0:1245-1250).

F4_BROWSER

## Verdicts (summary)

VERDICT_TABLE

## Not done

NOT_DONE
