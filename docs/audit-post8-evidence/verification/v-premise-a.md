# Verification v-premise-a (premise lens, eight major findings)

Audited build `austerlitz-command-map.html` md5 `f10fe585c46aea576f436ed51ac46f83` (checked), sources of `43e3e5b`. Nothing in the
application, data, tests, thresholds, archive or build was changed; no `npm test`, `build.py`, harness or `contrast.js` was run. No
browser was used. Scripts: `tools/audit-post8/verification/v-premise-a/` (`grades-recount.js`, `relief-points.js`, `legrand-prz.js`).
Raw outputs: `docs/audit-post8-evidence/verification/v-premise-a/`. Model heights were computed in a fresh isolated copy
(`scratchpad/v-premise-a-iso`, `world.js` and `geo.js` md5-identical to the repository's; `node tools/mk-world-mod.js` there) and on the
pre-Stage 8 sources (`git show 9eb7abb:{world,geo,tokens}.js`).

| finding | verdict | severity / priority | category | origin |
|---|---|---|---|---|
| history #0 Guard etc. walk away while "Counter-attacking" | CONFIRMED | S2 / P2 (kept) | confirmed-defect | inherited |
| history #1 Legrand through the castle and the III Column | CONFIRMED (one user-impact clause unverified) | S2 / P2 (kept) | confirmed-defect | new-regression (8J) |
| history #2 face-about "Fact" | CONFIRMED | S2 / P2 (kept) | confirmed-defect | inherited |
| history #3 Russian Guard's A grades vs readings; Blasowitz | WEAKENED | S2 / P2 (kept) | confirmed-defect | inherited |
| history #4 44 carried A grades | WEAKENED (premise reframed) | S2 / P2 (kept) | confirmed-defect | inherited |
| sources-oob #0 figures attributed to Duffy | CONFIRMED | S2 / P2 (kept) | confirmed-defect | inherited |
| geography #0 relief 30-80 m off | CONFIRMED | S2 / P1 (kept; P1 for the disclosure) | confirmed-defect | inherited |
| tests #0 TS-1 merge gate | WEAKENED | **S3 / P3** (was S2 / P2) | **optional-improvement** | inherited |

## history #0: CONFIRMED

*Premise.* No rule or decision states "an offensive status is not drawn moving away". The timing is accepted: decision 40 (the phase-start
rule, `docs/STAGE2_SPEC.md:1112`), decision 45 (undated moves keep "today's behaviour", `:1243-1253`, `:1116`) and decision 125 (b)
(guard_cav@6 a named conflict, the map's 11:15 kept; `analysis.js:318-320` "the map draws it from 11:15, a timing it has kept"). What no
decision covers is the status and facing shown during such a leg: decision 46 requires the interface to "read coherently" only for
delayed (dated) moves (`docs/STAGE2_SPEC.md:1117`; `waitingFor`, `app.js:7689-7694`, returns null for undated legs). So the finding is a
coherence defect outside every accepted decision, not a re-litigation of 45.

*Checked.* `anchorList`/`legWindow` (`app.js:3235-3304`): an undated anchor is reached at its phase's start and the next leg spans the
whole next phase; `liveStatus` (`app.js:7696-7700`) shows `stateAt(textPhase)`; the poser faces `headingAt` before `enemyFacing`
(`app.js:6001-6003`). Data (`data.js:631-644`): rg_inf@6 [327,194] "counterattack" reached 11:15, @7 [397,196] "repulsed" 12:45, so at
12:00 the block is at [362,195] (my arithmetic, matching `history/guard-attack-motion.txt`), walking east with "Counter-attacking". Both
Guard events span exactly that walk: guard-attack 11:00-13:00 and guard-broken 11:15-13:15 (`analysis.js:314-320`). Liechtenstein
@5 [298,156] "charging" 10:30 to @6 [341,152] 11:15 (`data.js:593-594`). Anchors identical in `archive/stage0-c09c4b23.html`,
`stage2c`, `step5c`, `stage8h` (awk extraction); `headingAt` already in the Stage 0 build, so 8E added only the visible gait (1.48 and
1.79 km/h are above decision 244's 1 km/h floor).

*Notes.* Scope is wider than the title: `history/motion-vs-status.txt` lists 12 formation-intervals, French ones included (legrand,
bourcier, c_gren, suchet). Remedy: the presentation-only option risks CLAUDE.md "Never fix a data problem by changing only the display"
where the cause is the anchor's 11:15 arrival; decision 46 is the precedent for presentation coherence when the model is accepted. A data
option inside the rules exists: date rg_inf@7/rg_cav@7's departure from the map's own event windows (decision 43's method, decision 41's
grade and basis).

## history #1: CONFIRMED

*Premise.* No rule names interpenetration; CLAUDE.md's "Walther/Nansouty overlap" precedent is about map-label overlap
(`CHANGELOG.md:8484-8529`), not formations. The expectation rests on simulation and geographic integrity (CLAUDE.md priorities 3-4) and
on the finding's own exception for a recorded melee. Both acts do record a fight at the castle wall (legrand@2 "Fights for Sokolnitz village
and the castle wall", prz@2 "Storms the walled castle grounds", `data.js:227`, `:536`), so contact at the castle is recorded. What is not
recorded is the pass-through: Legrand's marker crosses the III Column and stands 0.4-0.77 km beyond it (on its approach side) at 09:15-09:30,
still showing phase 2's act (no @3, carried by `stateAt`).

*Checked.* `legrand-prz.js` (data.js anchors, `legWindow`'s linear rule, `LANDMARK_SITES.castle` from `world.js:162`): 08:45 [213.0,343.5]
25 m from the castle; closest to prz 37 m at 08:51; 651 m at 09:30 (`v-premise-a/legrand-prz.txt`), as the finding says. Block size: a
battalion 2.7 world units (`app.js:1625-1636`), 63.2 m per world unit (`geo.js:37-42`), so a division's front exceeds 1 km: the blocks
overlap fully, not just at their centres. Origin: prz@2/@4/@7 [238,332]/[233,344]/[227,338] in `archive/stage8h-24e29da7.html`,
[215,341] in `stage8j` and `stage8k`; Legrand unchanged. 8J's consequences (`docs/STAGE8_SPEC.md` §21.7) checked knowledge, chronology,
the movement audit and narrative; its castle captures were at 10:00 and 15:00, outside 08:30-09:30.

*Correction.* "at the opening's 08:45 moment" is not established: the area's own README (`history/README.md:112`) lists the opening's
08:45 camera as not checked; the castle lies about 30 degrees off the camera's axis (cam `[-136,46,31,-6,8,-3]`, castle at world
(-63.6,47.2)); I did not render it.

## history #2: CONFIRMED

*Premise.* Required by CLAUDE.md ("Label claims as fact, disputed, derived, inference, uncertain, or design decision") and by the project's
own application of decision 201 (b): the step 4b review labelled this very order "this map's reading" in the why, both phase lines, the
act and the Command row (now INFERRED) (`CHANGELOG.md:2583-2597`; `docs/step4-evidence/questions.md:240-252`), but not the event's pill.
Decision 201 (b) made seven other events "disputed"; it did not decide face-about's pill, so no owner decision covers it.

*Checked.* `analysis.js:292-294` claim "fact" and the why "That he ordered the column to face about is this map's reading";
`narrative.js:42-45` claim "interpretation", note "No account read has Kutuzov order the 4th Column to face about"; `data.js:16-17`
CLAIM.fact "Attested in the standard accounts of the battle."; `dossierEvent` renders `claimPill(e.claim)` and `CLAIM[e.claim].note`
(`app.js:8297-8300`, `:8328`); `evNoteParts`/`evMapText` add nothing for "fact" (`app.js:3886-3893`). claim "fact" in
`archive/stage0-c09c4b23.html`, `step4b-02a46c50.html` and `stage8k`. The area's scan (`history/event-claims.txt`) flags one other event,
pratzen-village (est vs uncertain), whose uncertainty is its hour (timing C): not a contradiction.

## history #3: WEAKENED

*What holds.* PLANS.al's order "The Imperial Guard to remain behind Krzenowitz, in hand." (`analysis.js:186`), its zone "Reserve behind
Krzenowitz" (`:165`) and the plan theme's "stands in reserve behind Krzenowitz" (`:15`) misstate the disposition read on its page image,
"besetzt bei Tages-Anbruche die Position hinter Blasowitz und Kruh" (C6.21, A, `docs/step4-evidence/readings.md:3103-3110`); step 4's
proposal changed the role only ("Text only", `docs/step4-evidence/proposals.md:831-840`). Decision 158 (`docs/ROADMAP.md:68`) accepts the
Russian Guard as Blasowitz's defenders, yet no Guard element is drawn within 1.78 km at 11:15; the event's tolerance reason covers
Caffarelli only (`analysis.js:310-311`). All inherited (plan text and anchors in `archive/stage0-c09c4b23.html`).

*What is overstated.* "Contradicts the project's own A-graded readings" omits the register's counter-readings: the official report
(Materialien Zusatz 13) has the Guards deploy "auf der anbefohlnen Anhöhe von Krzenowitz" (C1.3 B fact, `readings.md:100-110`; C6.22 B
fact, `:3113-3125`; C2.29 B disputed, `:925-935`). C6.21 is a reading of an order; C6.c6 (Stutterheim, A) is labelled "disputed" in the
register and has the Guard leave "the heights in front of Austerlitz" at the appointed hour, so rg_inf@0 at 04:00 near Krzenowitz is not
contradicted by either (before daybreak). What fails is that A ("Position documented in the sources") is given to positions the readings
contest (rg_inf@0, rg_cav@0, and rg_inf@5 carried), and that the plan text attributes to the disposition what it does not say.
Decision 45 (the Russian Guard cavalry's creep kept because "its start is not dated", `STAGE2_SPEC.md:1248-1250`) predates these step-4
readings, which now name a departure and a destination: new evidence that changes 45's premise for the Guard.

*Remedy.* Regrade with the disagreement kept (CLAUDE.md "Where sources disagree, keep the disagreement"); re-plotting onto the
Blasowitz-Krug heights would pick Stutterheim's side unless the source agents settle it. Reword PLANS.al and ANALYSIS[#plan] to the
disposition, the report's "ordered height of Krzenowitz" attributed beside it.

## history #4: WEAKENED

*Count reproduced.* `grades-recount.js` (my own vm loader of `geo.js`/`data.js`): 180 positioned anchors, 88 graded A, 90 grades carried,
44 carried A (`v-premise-a/grades-recount.txt`); 29 of the 44 anchors carry no act; 19 moved at least 1 km from the previous anchor.

*Premise reframed.* 8K's rule is not a dataset rule: its register scopes it "The rule applied here, anchor by anchor"
(`docs/stage8-evidence/8k/register.md:8-11`). Carrying is the documented design ("values carry forward until changed", `data.js:135`;
`docs/STAGE5_SPEC.md:188`), used deliberately (drouet@7 inheriting drouet@6's B, `docs/step4-evidence/questions.md:86`). The expectation
holds through CONF_TEXT.A, which the visitor reads: "Position documented in the sources." (`app.js:7731`, a guarded declaration) and the
grade definitions (`data.js:3-4`). Where nothing in the data places a moved anchor (Caffarelli @6-@9 at `data.js:288-291`: no act, no note,
0.8-1.5 km legs; kellermann, nansouty, lich, rg_inf@8-9, rg_cav@7-9 likewise), that sentence is unsupported, as 8K's own assessment of the
adjacent Suchet pursuit found (`register.md:100-112`, "no reading places Suchet at these hours", B to C). The 15 carried A anchors with an act
may be documented: the 44 is an upper bound of unreviewed grades, not of wrong ones. No owner decision accepts carried grades.

## sources-oob #0: CONFIRMED

*Reproduced* (2 Nov, `python3 -I tools/audit-post8/sources-oob/ia-fts.py austerlitz18050000duff ...`; `v-premise-a/duffy-fts-repro.txt`):
"Ill Corps, MARSHAL DAVOUT 2nd Div. (3,800 and 9 guns) Gen. Friant"; "4th Column, Lt.-Gens. Miloradovich and Kollowrath (23,900, 52 light
and 24 heavy pieces)" and, separately in the narrative, "an Austro-Russian fourth column of 23,900 infantry"; 0 hits for 4,300, 3,470,
13,900 and 6,880. The item is the cited edition (archive.org metadata: Duffy, *Austerlitz 1805*, London, Seeley Service, 1977, ISBN
085422128X; `appearance.js:96` cites this item). The notes read as quoted (`data.js:240`, `:248`, `:470`, `:485`, `:551`, `:559`;
`analysis.js:25`); only Kienmayer's carries "(cited, not read), as transcribed here". *Premise:* CLAUDE.md "Never invent ... strengths
... or sources"; `docs/ROADMAP.md:236` records Duffy and Smith as not read, so the notes' "Duffy and Smith give" is unsupported, and
the positive text-layer rows contradict it. No owner decision accepts it. Caveat: a text layer, not page images (the project's standard
for "fact"); the remedy's step 1 (a page reading) is needed before the data task, not before rewording.

## geography #0: CONFIRMED

*Reproduced* with a DEM product independent of the area's GLO-90 and SRTM (EU-DEM 25 m, OpenTopoData, 2 Nov; Open-Meteo refused:
"Daily API request limit exceeded", an environment limit) and my own model computation (`relief-points.js`, validated at the fit's anchors:
Pratzeberg 323.9 vs 324, Vinohrady 294.4 vs 294, Augezd 189.9 vs 195, Sokolnitz 210.4 vs 207). Model minus EU-DEM at the area's six
southern-plateau points: -54, -70, -81, -50, -79, -54 m; St Anthony's chapel -37 m (201 vs 238); Schlapanitz +49 m (273 vs 224)
(`v-premise-a/relief-vs-eudem.txt`). Identical model values on `9eb7abb` (pre-Stage 8): inherited. Forest or buildings in a surface
model cannot explain 50-80 m on farmland, nor the Schlapanitz excess (a town lowers nothing).

*Premise.* The visitor's only description of the relief: "heights follow a separate vertical scale fitted to surveyed elevations"
(`data.js:797`); the dossiers quote model and surveyed heights at GT places only (`app.js:8212-8216`) and say sightlines use "this
model's elevations, not the real survey" (`app.js:8259`). The meres are declared schematic (decision 27), the relief is not; no decision or
earlier review covers its departures between the 12 fit anchors (`tools/relief-fit.js:5-8`; 8H's geography review has no relief item).
CLAUDE.md "Never invent ... terrain" and "label the uncertainty". P1 is defensible for the disclosure (0.5 day); the refit is a P2 data task.

## tests #0 (TS-1): WEAKENED to S3 / P3, optional-improvement

*Fact confirmed* (`gh api repos/billybobbyboo/Austerlitz/rules/branches/main`): ruleset 24036909 requires the one status check "checks";
141f890's check runs: "browser (selftest)" failure 08:44:41, "deploy" success (`gh api .../commits/141f890/check-runs`).

*Premise fails as an S2.* Decision 132 reads "add check:contrast and a one-page self-test run to .github/workflows/checks.yml; keep the full
check:visual (about 100 minutes) on demand" (`docs/FINAL_AUDIT.md:834`, `:877-879`): it asks CI to run them, not to gate merges, and
"check:visual gates nothing" is that decision's own choice. The one red merge (#77) was made over a failing line that the 8L readiness
verdict recorded before the merge ("every required check passes but that one line in check:selftest and check:visual",
`docs/STAGE8_SPEC.md` §22.7; CLAUDE.md) and that decision 267 (a) settled the next day; the finding's own alternative expectation ("or a
merge over a red browser check is an owner decision recorded as one") was met. No visitor-facing behaviour, WCAG criterion or CLAUDE.md
rule is involved; the rubric's S2 does not apply. The remedy (two required checks in the ruleset) is sound, minutes of work and the
owner's call; it would hold every merge 20-45 minutes for the self-test.

## Not checked

The opening's 08:45 frame (history #1) and the rendered overlap of the blocks; the on-screen gait and facing for history #0 (from code
and the area's numbers); Duffy's page images and Smith (1998); the GLO-90 grid, profiles and fog-cell counts of geography #0 (only 8
EU-DEM points); each of the 44 carried A anchors against the readings (counted; Caffarelli read); the page images behind C1.3, C2.29,
C6.21, C6.22 and C6.c6 (the register's entries were read); repository settings beyond the branch rules and rulesets (bypass actors).
