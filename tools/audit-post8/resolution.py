"""Final audit after Stage 8: the auditor's resolution of the adversarial verification (read by register.py).

OVERRIDE: id -> fields replacing the area's (title, severity, priority, category, origin, observed, remedy ...), each change taken from a
verifier's 'corrected' or 'notes' (docs/audit-post8-evidence/verification/<label>.json), or the auditor's own judgement where the lenses
disagree (then said in VERDICT's note).
VERDICT: id -> {"verdict": ..., "note": ...}: the auditor's verdict where the lenses' most adverse one is not the right summary.
NOTES: id -> text appended to the entry's note (verifiers' extra issues folded into the finding they belong to).
"""

OVERRIDE = {
    # history
    "CL-HIS-06": {
        "title": "Four events whose hours the sources dispute are not labelled disputed: three whose own texts say so, and the Pratzen climb, shown as Fact at 08:45-09:15 while the accounts read put it from about 08:00 to about 09:00",
    },
    "CL-UX-03": {
        "title": "Event markers' hit areas take presses meant for the time rail: on a phone about two thirds of the rail, so a finger's drag there does nothing and a tap jumps to an event; on a desktop the playhead itself at an event start",
    },
    "CL-SIM-04": {
        "title": "The overlays' fade draws the outgoing phase's arrows when it should not: with the Movement layer off every phase change flashes them at about 0.87 opacity, and a phase change that interrupts a fade pops them back to 0.9 (stepping through phases quickly flashes each skipped phase's arrows)",
    },
    "CL-HIS-01": {
        "title": "The face-about event contradicts itself and the sources: its pill says Fact ('Attested in the standard accounts'), its own text calls the order 'this map's reading' because 'no account read gives the order', yet the project's own reading of Schonhals p. 162 gives Kutuzov's order, and Stutterheim pp. 63-64 a competing account of who gave it",
        "remedy": "A data task (analysis.js EVENTS, narrative.js): label the event disputed with both sides, as CLAUDE.md requires where sources disagree (Schonhals p. 162: Kutuzov's order to the 4th Column; Stutterheim pp. 63-64: the Emperor's order to the Russian battalions and an unnamed order to Kollowrath); remove 'no account read gives the order'; re-measure the 09:15 views' drop limits, since the label's words change.",
    },
    "CL-HIS-02": {
        "title": "44 of 88 A position grades are carried forward unreviewed from an earlier anchor: on moved anchors with no act (Caffarelli @6-@9 among them) a visitor reads 'Position documented in the sources' with nothing in the data placing the formation there, where 8K graded the adjacent Suchet pursuit C",
        "category": "probable-problem", "priority": "P3",
    },
    "CL-HIS-03": {
        "title": "The Russian Guard's plotted approach takes one side of a divided register without saying so: its morning positions are graded A though the project's readings contest them (the disposition and Stutterheim against the official report's 'ordered height of Krzenowitz'); the plan text misstates the disposition; nobody is drawn at Blasowitz when it falls 'from the Russian Guard'",
    },
    # sources
    "CL-SRC-01": {"priority": "P1"},
    "CL-SRC-02": {
        "title": "The III Corps detachment and the IV Column are drawn below every figure in the sources read; the notes of the detachment, Friant, Bourcier and the IV Column omit Sokolov's and Schonhals's figures (Miloradovich's note gives Schonhals's 6,965)",
        "priority": "P3",
    },
    "CL-SRC-04": {
        "title": "SOURCE_NOTE illustrates disagreement among 'reputable orders of battle' with an I Column range whose low end (7,750) no source read gives (the three read give 12,730-14,000); the figure's origin is not established",
    },
    "CL-SRC-08": {
        "title": "Stronger or earlier sources uncredited, and two locator slips (Kamensky's 'about 2,000 each' is printed by Schonhals p. 177, which also braces Kursk into the brigade, not by Sokolov p. 195, which gives battalions only)",
    },
    # geography
    "CL-GEO-06": {
        "title": "The Goldbach bottom's marshiness, an open question, is drawn and told as settled, the opening's first step included; the movement audit never tests stream crossings and exempts marsh within 695 m of any village",
    },
    # rendered picture
    "CL-VIS-02": {"severity": "S3", "priority": "P3", "observed": "6 objects visibly rise out of the Satschan ice (4 village trees, 2 bush tops); 14 more bank bushes are planted on the bed under the ice, hidden (world.js: neither the village trees nor the bank scrub test for water)."},
    "CL-VIS-05": {"severity": "S4", "priority": "P4", "category": "probable-problem", "origin": "new-regression",
                  "observed": "Toward-sun low views show a white glint on the brooks (218 px at 245 or brighter, 250 at most, in the area's box); STREAM.sky is not the cause (setting it to 0 removes 3 of 218 px); likely the sun's direct specular on 8F's sharper surface plus bloom (inferred, not toggled).",
                  "remedy": "Establish the cause first (toggle the stream's roughness and the bloom in the toward-sun views), then tune the material; lowering STREAM.sky would not cure it."},
    "CL-MAP-12": {"category": "confirmed-defect"},
    "CL-MAP-20": {"severity": "S4", "priority": "P4", "category": "optional-improvement",
                  "title": "The map's place names mix German period forms with Czech forms (Stare Vinohrady, Zuran, Litava) under no stated convention",
                  "observed": "German period forms (Sokolnitz, Telnitz, Augezd, Satschan) beside Czech ones (Stare Vinohrady, Zuran, Litava); no single 1805 German convention exists to break; only the records' 'Littawa' differs from the screen name."},
    "CL-MAP-01": {
        "title": "Landscape with counters: during Play five to eight formations' counters are hidden most of the time, up to 28 s (about 100 clock minutes) at a stretch; the cavalry's starvation is inherited, Stage 8 lowered the share drawn (78% to 68% over the morning) and lengthened the gaps; the benchmark's 4,033 ms is only its window",
        "origin": "inherited, aggravated in Stage 8 (8C's hold through Play and the later data and layout)",
        "observed": "Reproduced by the verifier: 67.5% (08:30-11:30) and 72.3% (12:00-15:00) of in-view formation-frames drawn, against 78.4% and 85.6% on the pre-Stage-8 build; d'Hautpoul 9.8% (pre-Stage-8 5.4%), the Russian Guard cavalry 15.7% (8.1%), the French Guard cavalry 16.2% (23.8%), Walther 15.9% (39.0%); Miloradovich's longest gap 27.7 s, about three times the pre-Stage-8 build's; every number within 0.4 points or 70 ms of the area's but one (12:00-15:00's longest gap is the French Guard cavalry's 18.0 s, not d'Hautpoul's 15.3 s).",
    },
    "CL-VIS-01": {
        "title": "Figure blocks are drawn sunk into the frozen Satschan mere: in the ponds phase, and wherever a leg's path crosses the drawn disc (at 06:30, 136 of Kienmayer's 222 instances on his phase-1 via are below the ice)",
    },
    "CL-SIM-02": {
        "observed": "Under a headquarters' reading the movement arrows and their labels of formations it does not know are drawn (at 09:30 the Suchet and Caffarelli arrows, faint, with their labels), and the plateau count leaks: under the Allied reading 31,500 against 25,800 known (11:30-12:30); under Napoleon's 38,700 against 17,900 (04:30-07:00); the Now tab's and the caption's 'on the heights' reading leaks the same way.",
    },
    "CL-UX-13": {
        "title": "The time rail seeks on any mouse button and has no cancel path: a right or middle press on the rail moves the clock and stops Play; where a context menu swallows the release (platform-dependent, unverified), hovering the rail then scrubs until the next click",
        "severity": "S4", "priority": "P4",
    },
    "CL-SIM-05": {"category": "confirmed-defect"},
    "CL-ROB-10": {"origin": "new-regression"},
    "CL-ROB-12": {"origin": "inherited"},
    "CL-MAP-07": {"origin": "mixed: inherited crowding (a fresh layout draws 60.1%, Liechtenstein 0.15%) plus new-regression (8C's stabiliser, -8.4 points)"},
    "CL-MAP-14": {"severity": "S4", "priority": "P4",
                  "observed": "After Play, 0-3 more formations hidden at rest than a fresh view of the same moment would hide (net -1 to +3; the fresh view would hide others instead); persists until the next discontinuity, by decision 240 (a)'s no-reshuffle rule."},
    # interaction, accessibility
    "CL-UX-08": {"title": "On the main screen the derived readings' qualifiers, the Zuran and Allied vantages' 'not what he saw' and the relief's and key's disabled reasons are given only in hover tooltips; the derived caveats are also in the sources sheet, the vantages' caveat nowhere else"},
    "CL-UX-06": {"title": "The map's two-finger pinch has never been driven by browser-level touch input (the self-test's pinch is synthetic); the audit's emulated pinches landed on the open event dossier and the timeline, not the map, so they show no fault",
                 "severity": "S4", "priority": "P3", "category": "untested"},
    "CL-UX-18": {"title": "Polish: the phone caption shows two orphan separators when the act and phase shrink to 0 px; at 800 x 450 with the Panels open the vantage row overlaps the dispatch card's top edge by about 10 px; the dispatch sheet's grip looks like a drag handle but only a tap works"},
    # confirmed with a corrected statement
    'CL-UX-02': {"title": "On the landscape, a pan, zoom or keyboard pan during a camera glide is undone: the glide carries the camera on to its destination (the paper map's MAPCAM already stops its glide)"},
    'CL-REC-03': {"observed": "Wider than stated in CHANGELOG: four older heads are also unrevised: :1698 (PR #58, 'for review'; merged 7437dcc), :1650 (#59 draft; a107472), :1574 (#60 draft; a8afeec), :1339 (#64 draft; d86835e). Narrower in ROADMAP: :548 does record #74's merge into main (72c7e1b) and #75/#76 into their stacked branches; it lacks #73, #77, #78 and #79."},
    'CL-UX-03': {"observed": "On a phone (390 x 844): markers take 64.2% of the rail's middle line (the area measured 65.8%) and 4.5% 4 px above its foot (9.4%); a finger's drag that starts on a marker does not scrub, and a tap jumps to the event; a real touch drag from (121.5, 840), where elementFromPoint returns the rail, did not scrub either (run twice), so the rail's bottom 4 px is no reliable escape. On a desktop, at an event start the marker's hit area covers the playhead: a drag that starts there goes to the marker and the rail never sees it; markers take 24-34% of the desktop rail."},
    'CL-TEST-13': {"observed": "41 inventoried statements (31 own-claim, 10 unchecked) carry 59 word-form hours timesIn does not read; the 45/33/12 count includes 4 statements whose only matches are 'half past N' or quantities."},
    'CL-HIS-04': {"observed": "Legrand's marker crosses the III Column at the castle 08:40-09:00 (37 m at 08:51) and stands 0.4-0.77 km beyond it at 09:15-09:30 with phase 2's act; contact at the castle wall is recorded by both acts, the pass-through is not. Whether the opening's 08:45 frame shows it is not established (history/README.md:112; castle about 30 degrees off the stop's camera axis)."},
    "CL-PERF-12": {
        "title": "Decision 268 (a)'s desktop script excess: the +30% GL calls a frame are 8D's and 8E's three kit attributes re-bound on every instanced kit draw (3 x 430 = 1,290 a frame, measured), but that re-binding is about 13-21% of the profiled script rise; Stage 8's own per-frame app work about 20-32%; about a third (three.js JavaScript) unattributed",
        "observed": "Per frame in Play at half speed: 430 instanced kit draws (215 main, 215 shadow) x 3 attributes = 1,290 of the +1,353 vertexAttribPointer and +1,332 bindBuffer calls; their functions +1.53-1.72 ms of the +9.69 ms profiled rise (Play), +1.18-1.51 of +8.74 (drag); reproduced on one fixed browser (Chromium 141 for both builds) at the device's ratio (+22-23% here, +25% on the desktop), so the Chrome 155 to 156 update is not needed to explain it; located between step 6's L3 build and 8E.",
    },
    "CL-PERF-14": {
        "title": "three r128 re-derives every lit material's program each frame (getParameters, getProgramCacheKey, uniform wiring) because the label pass sees no lights and bumps the lights' state version (313 a frame in L3, 318 now; 0 with the lights also on the label layer)",
        "category": "optional-improvement", "priority": "P3",
        "observed": "318 getProgram calls a frame (every MeshStandardMaterial of the world pass), 0 with the lights also enabling the label layer; the desktop cost bounded at about 0.7-0.8 ms a frame by the effects-off orbit.",
    },
    "CL-HIS-14": {
        "title": "Bellowitz is drawn at its legacy place with the open question only in SOURCE_NOTE, and the Russian Guard cavalry's commander is shown without a claim tag (Krug's place, drawn the same way, is CL-GEO-07; the note behind the commander is CL-SRC-03)",
        "severity": "S4", "priority": "P4",
    },
    # the report reviewer's register corrections (docs/audit-post8-evidence/verification/report-review.json)
    "CL-MAP-03": {
        "title": "No symbol key at all between 720 and 1079 px wide or on a phone held upright, so the integrity encodings (the B and C grades, '?', the dashed intended routes) go unexplained there; Watch, Clean and a phone held landscape hide it by recorded design or decision",
        "user_impact": "On phones held upright, small tablets and 1024 px laptops (below 1080 px wide, over 430 px tall) a visitor has no way to learn what the B/C/? badges, status icons, echelon marks, dashed arrows, outlines, grade extents, event glyphs or the eye level's blue sheets mean; only the first-run card's two colours remain. In Watch and Clean the key is two presses away (1, then Key) by 2D's recorded choice; at 430 px tall or less it is hidden under decision 226 (a).",
    },
    "CL-REC-04": {"severity": "S4", "priority": "P4",
        "title": "The carried checklist misstates two of its own items: kienmayer@7's contradiction of its own act since Stage 0 filed as an 8J offset, and Caffarelli's separation given as 2.5-2.9 km where the build draws 2.13-2.64 km",
        "user_impact": "A reader of the checklist takes Kienmayer's error for 8J's small offset and Caffarelli's separation as larger than drawn; the 4,033 ms item is stated with its limit.",
        "observed": "Two of three items misstated: kienmayer@7's contradiction of its own act since Stage 0 filed as an 8J offset (understated); Caffarelli's separation given as 2.5-2.9 km where the build draws 2.13-2.64 km (overstated). The 4,033 ms item is stated with its limit. The substance is carried by CL-HIS-08, CL-HIS-09, CL-MAP-01 and CL-TEST-02."},
    "CL-ROB-13": {"title": "The terms of use of about 460 third-party archive images that Pages publishes (the Moravian Land Archive's cadastre tiles and 8G's cadastre sheets) were not checked; before this entry the gap was recorded only in the robustness README"},
    "CL-REC-02": {"origin": "mixed: inherited (step 6 item 3 made the states and views stale) and new-regression (Stage 8 PRs 8A-8K moved the reference, the counts and the times)"},
    "CL-PERF-05": {"origin": "mixed: inherited (median counts since step 6) and new-regression (the census maxima used as Stage 8's 'settled baseline')"},
    "CL-PERF-07": {"origin": "mixed: inherited (step 6) with Stage 8 additions (the brackets)"},
    # map layer and furniture
    "CL-MAP-02": {"severity": "S3", "priority": "P3", "category": "probable-problem"},
    "CL-MAP-03": {
        "title": "No symbol key at all between 720 and 1079 px wide or on a phone held upright, so the integrity encodings (the B and C grades, '?', the dashed intended routes) go unexplained there; Watch, Clean and a phone held landscape hide it by recorded design or decision",
    },
    "CL-MAP-04": {
        "severity": "S3", "priority": "P3", "category": "probable-problem",
        "observed": "North is shown only in Study at 1080 px or wider and more than 700 px tall (style.css hides the rose at 700 px or less), so a 1366 x 768 laptop's browser viewport (about 650 px tall) shows none even in Study; the Field vantage faces 63 degrees from north, the Zuran 135, the Allied 85, the default 09:30 view about 87 (east up); the paper map is north-up by construction.",
    },
    "CL-MAP-05": {"severity": "S3", "priority": "P3", "category": "optional-improvement"},
    # tests
    "CL-TEST-01": {
        "title": "Only the node job is a required check on main: the browser checks run on every push but gate no merge, and check:visual runs only on dispatch (the one red merge, #77, was the owner's knowing merge over question 267's line)",
        "severity": "S3", "priority": "P3", "category": "probable-problem",
    },
    "CL-TEST-03": {"priority": "P3"},
    "CL-TEST-07": {"severity": "S4", "priority": "P4", "category": "optional-improvement"},
    "CL-TEST-08": {"origin": "new-regression (animAt and animGLSL came with 8D and 8E)"},
    "CL-TEST-09": {"severity": "S4", "priority": "P4"},
    "CL-TEST-12": {"observed": "10 plan labels drawn on the map (8 staging, 2 objectives) are narrative statements outside the inventory and its exclusion note; 12 column names are arguable (names, a few interpretive); the 19 timing bases are a two-valued enum the note's 'enums' plausibly covers. No completeness check exists."},
    "CL-TEST-15": {"severity": "S4", "priority": "P4", "category": "optional-improvement", "origin": "new-regression (8C's second derivedTag in marchRow opened the pin's blind spot)"},
    "CL-TEST-17": {"origin": "inherited"},
    # records
    "CL-REC-01": {"severity": "S4", "priority": "P3", "category": "optional-improvement", "origin": "inherited (Pages enabled for decision 217's device runs, roadmap step 6)"},
    "CL-REC-03": {"origin": "mixed: inherited (R-2 recurred from PR #58) and new-regression (#64, #73-#79)"},
    "CL-REC-04": {"severity": "S4", "priority": "P4"},
    "CL-REC-05": {"severity": "S3", "priority": "P3", "category": "untested",
                  "observed": "Both attestations are labelled as such (CLAUDE.md, docs/ROADMAP.md, docs/step3-evidence/sr-session.md). Untested: any screen reader on the current build, including 8H's A-6 changes; one stale line in docs/stage6-evidence/second-reading.md."},
    "CL-ROB-09": {"priority": "P4"},
}

VERDICT = {
    "CL-PERF-12": {"verdict": "WEAKENED", "note": "The mechanism holds; its share of the time was overstated ('mostly'): corrected to the measured shares."},
    "CL-UX-06": {"verdict": "WEAKENED", "note": "Verifier: the emulation honours touch-action:none for a CDP pinch and no element of the map layer takes pointer events, so the area's runs show no fault in the map's pinch; what remains is untested: a real device's pinch on the map."},
    "CL-UX-18": {"verdict": "WEAKENED", "note": "Verifier: the speed-group item (1/2x shown pressed during the opening's 4x) is contradicted by the code and dropped; the other three stand as polish."},
    "CL-UX-03": {"verdict": "CONFIRMED", "note": "Reproduction lens: confirmed (markers take 64.2% of the rail's middle line; a real touch drag at the rail's foot did not scrub either). The premise lens's 'duplicate' referred to this merge itself; it asked that the merged entry keep S2/P2, as it does."},
    "CL-VIS-05": {"verdict": "WEAKENED", "note": "The glint is real in toward-sun views; the stated cause (STREAM.sky) is refuted by toggling it, and its remedy would not cure it: the cause and remedy rewritten."},
    "CL-HIS-02": {"verdict": "WEAKENED", "note": "Both lenses: the premise holds through CONF_TEXT.A, not through 8K's rule; 44 counts unreviewed carried grades, not wrong ones (21 are 1-5.6 km from the anchor that declared the A, 29 have no act). Applied: probable problem, P3."},
    "CL-HIS-03": {"verdict": "WEAKENED", "note": "Both lenses: the register is divided (the disposition and Stutterheim against the official report), so the defect is taking one side without saying so; title corrected; S2 kept."},
    "CL-TEST-01": {"verdict": "WEAKENED", "note": "Both lenses: the facts hold; no rule requires the browser checks to gate (decision 132 asked that they run); S3. The lenses differ on P2 or P3 and on probable problem or optional improvement: the auditor takes P3, probable problem (a process risk the project's reliance on the self-test makes real)."},
    "CL-MAP-01": {"verdict": "WEAKENED", "note": "Both lenses: real and reproduced in Landscape with counters; the origin as stated was wrong (the cavalry's starvation is inherited, worse before Stage 8 for d'Hautpoul and the Russian Guard cavalry; Stage 8 lowered the totals and lengthened the gaps): corrected. Not an accepted compromise: section 23.2 leaves longer playback to this audit. S2 kept."},
    "CL-MAP-02": {"verdict": "WEAKENED", "note": "Premise lens: protecting event-named formations extends decision 39's never-dropped list, so it needs an owner decision; S3, probable problem."},
    "CL-MAP-04": {"verdict": "WEAKENED", "note": "Premise lens: the premise is cartographic convention, not a project rule; the absence of an orientation aid, S3."},
    "CL-MAP-05": {"verdict": "WEAKENED", "note": "Premise lens: within decisions 24 and 39 and their limits; missing reference lettering, an optional improvement."},
}

NOTES = {
    "CL-PERF-12": "Verifier: the mechanism and counts confirmed exactly (430 kit draws, not about 450); 'mostly' holds for the GL-call growth (81% of +3,175 calls), not for the time. Remedy: packing aPh into aSl (both per instance) is feasible (-860 calls a frame); aPart has no spare component.",
    "CL-PERF-13": "Verifier: 2 calls a frame while the eye is still; by uniform scaling about 1.0-1.3 ms a frame on the desktop, comparable to decision 268's +1.1/+1.5 ms (inference); the memo key should use exact rectangles (syncViewOffset's VOFF.key already forms it).",
    "CL-GEO-07": "Krug's place is also named in CL-HIS-14, which defers to this entry for it.",
    "CL-UX-17": "Verifier: the share is 42-50% over the desktop states and 33% on the phone; nothing under the 10.5 px floor.",
    "CL-UX-11": "Verifier: accepted compromise is right (decisions 114, 49 and 108 chose the stops, the closed key and the card's words); the finding brings a comprehension argument, not new evidence against their premises: owner question 276.",
    "CL-TEST-02": "Verifier: wider than stated: the hybrid-glide (2,533 ms, 76 frames) and hybrid-orbit with a selection (3,033 ms, 91 frames) baselines are also at their windows, so three of MOTION.VIS's 'longest' baselines cannot fail.",
    "CL-PERF-03": "Verifier: STAGE8_SPEC.md:1259 states the threshold max(1.5 R, 25 ms); STEP6_SPEC.md:179 and the perf-route.js:157 comment call it 'a missed refresh', which is wrong at 144 Hz.",
    "CL-UX-01": "Reproduction lens: confirmed; the 844 x 390 part (no dispatch) is today's layout kept by decision 226 (a), accepted; no decision record mentions browser zoom or reflow, so the 400% and 320 px parts stand.",
    "CL-SIM-04": "Verifier: one fix covers both scenarios: start the outgoing group from the opacity it had reached, the layer's factor included (app.js:3185).",
    "CL-SIM-05": "Verifier: 8A's review kept act texts as 'orders, not places', but several are positions and the row is labelled 'Doing now', so the implementation contradicts decision 251's stated scope ('hidden from every place a visitor could read its position from'); the replacement row's wording is the owner's.",
    "CL-ROB-07": "Verifier: publishing only the product must keep tools/step6/perf-run.html (the owner's device route on Pages), with CL-ROB-01's fix.",
    "CL-PERF-04": "The perf-attribution area (CL-PERF-12) reproduced the excess on one fixed browser (Chromium 141 for both builds) at the device's ratio and located it between step 6's build and 8E: the unrecorded browser update remains a records defect, but it is not needed to explain the excess.",
    "CL-MAP-12": "Verifier: the cause is not the pan's travel but the target re-seated at the pan's end (about +10 units, the picture unchanged), so distance-keyed map-layer levels can flip at rest after any landscape pan; the remedy moves owner-held motion counts (decisions 257 (b), 267 (a)).",
    "CL-MAP-06": "Verifier: decision 159 is met to the letter but its purpose is lost at 1280 px in Watch; every desktop Watch case of the harness is 1600 x 900, so 1280 is unmeasured.",
    "CL-MAP-09": "Verifier: also two names on screen for one formation (Bagration / Advance Guard of the Right), against decision 205's one-name rule.",
    "CL-VIS-03": "Verifier: inherited (enemyFacing cached per phase before 8E); the bearing is centre to centre and blocks overlap at 20-110 m (CL-VIS-04).",
    "CL-VIS-06": "Verifier: the sources sheet says 'Not drawn', but the Santon's and the chapel's place dossiers do not (buildingsSection returns nothing for a landmark): the dossier line is the cheap remedy.",
    "CL-HIS-05": "Verifiers: the scope is wider than the title (12 formation-intervals, French ones among them: Legrand, Bourcier, the grenadiers, Suchet); the II Column, 'Storms Sokolnitz' (A, attacking), is drawn receding from the village 08:00-10:30. moveMin holds on the four named legs would only shorten the mismatch.",
    "CL-HIS-04": "Verifier's corrections: the minimum to the castle is 4 m at 08:44; before 8J the leg passed 0.62 km from the III Column; in the opening's own 08:45 frame the overlap sits under the time bar, but the phase-2 camera and Play show it.",
    "CL-SRC-01": "Verifiers: the attributions fail on positive evidence (in each case Duffy prints a different figure in the same row of his text layer); Duffy's page images (a lending item) and Smith (1998) remain unread, so the page reading is the remedy's first step, before the data task.",
    "CL-GEO-01": "Verifiers: an unfitted Slapanice bump gives 22 of the +49 m there; P1 holds for the disclosure, the refit itself is a P2 data task.",
    "CL-GEO-10": "Verifier: docs/STAGE8_SPEC.md 21.9 says its unresolved questions are kept open in the sources sheet; four are not in SOURCE_NOTE.body[5].",
    "CL-SIM-01": "Verifiers: the stamped rows ('Position at 12:03') are honest but stale; the unstamped card rows and the place list are the misleading part.",
    "CL-UX-02": "Verifiers: the landscape only; the paper map's MAPCAM already ends its glide on input (app.js:4915-4953). Remedy caveat: clearing the tween inside free() would cancel the double-click focus glide; clear it in the pan, zoom and key handlers instead.",
    "CL-MAP-04": "Verifier: the rose is also hidden in Study whenever the window is 700 px tall or less.",
    "CL-TEST-01": "Verifier: the Pages deployment of main waits for no check.",
    "CL-TEST-05": "Verifier's remedy caveat: a deep freeze would break the app, which writes caches onto guarded FORMATIONS entries (f._anchors, f._gaitCum): hash the declared keys only.",
    "CL-TEST-06": "Verifier: the order-of-battle tab's strengths and the compact card's Strength row are, like the full dossier's, read by no check against the data.",
    "CL-REC-03": "Verifier: four more CHANGELOG status heads record merged PRs as drafts or for review (#58, #59, #60, #64).",
    "CL-REC-05": "Verifier: docs/stage6-evidence/second-reading.md still says the human second reading 'stays open for the owner' after decision 189.",
    "CL-ROB-01": "Verifiers (both lenses): reproduced on a local copy only; the live site was compared by a plain GET. S1 kept by the audit's rubric (a real, reachable security exposure); for calibration a conventional score is medium (CVSS 3.1 about 6.1: one click on a crafted link, no session or credentials on the origin, the product stores nothing).",
}

# the roadmap's work packages (section G): id -> package; every finding in exactly one
WP = {
    "WP-00": ["CL-ROB-01", "CL-ROB-06"],
    "WP-01": ["CL-HIS-01", "CL-HIS-06", "CL-HIS-12", "CL-HIS-14", "CL-HIS-15", "CL-GEO-02", "CL-GEO-06", "CL-GEO-08", "CL-GEO-09", "CL-GEO-10", "CL-SRC-03", "CL-SRC-09"],
    "WP-02": ["CL-SRC-01", "CL-SRC-02", "CL-SRC-04", "CL-SRC-05", "CL-SRC-06", "CL-SRC-07", "CL-SRC-08"],
    "WP-03": ["CL-HIS-02", "CL-HIS-03", "CL-HIS-04", "CL-HIS-05", "CL-HIS-07", "CL-HIS-08", "CL-HIS-09", "CL-HIS-10", "CL-HIS-11", "CL-HIS-13", "CL-REC-06", "CL-HIS-16", "CL-HIS-17"],
    "WP-04": ["CL-GEO-01", "CL-GEO-03", "CL-GEO-04", "CL-GEO-05", "CL-GEO-07", "CL-GEO-11"],
    "WP-05": ["CL-SIM-01", "CL-SIM-02", "CL-SIM-05", "CL-UX-07", "CL-SIM-03", "CL-SIM-04", "CL-SIM-06", "CL-SIM-07", "CL-SIM-08", "CL-UX-14"],
    "WP-06": ["CL-UX-02", "CL-UX-03", "CL-UX-04", "CL-UX-13", "CL-UX-19", "CL-UX-20"],
    "WP-07": ["CL-MAP-01", "CL-MAP-02", "CL-MAP-07", "CL-MAP-12", "CL-MAP-14", "CL-MAP-17", "CL-TEST-02", "CL-TEST-14"],
    "WP-08": ["CL-MAP-03", "CL-MAP-04", "CL-MAP-05", "CL-MAP-06", "CL-MAP-08", "CL-MAP-09", "CL-MAP-10", "CL-MAP-11", "CL-MAP-13", "CL-MAP-15", "CL-MAP-16", "CL-MAP-18", "CL-MAP-19", "CL-MAP-20"],
    "WP-09": ["CL-UX-01", "CL-UX-05", "CL-UX-06", "CL-UX-08", "CL-UX-09", "CL-UX-10", "CL-UX-11", "CL-UX-12", "CL-UX-15", "CL-UX-16", "CL-UX-17", "CL-UX-18", "CL-REC-05", "CL-UX-21", "CL-UX-22"],
    "WP-10": ["CL-VIS-01", "CL-VIS-02", "CL-VIS-03", "CL-VIS-04", "CL-VIS-05", "CL-VIS-06", "CL-VIS-07", "CL-VIS-08", "CL-VIS-09"],
    "WP-11": ["CL-TEST-01", "CL-TEST-03", "CL-TEST-04", "CL-TEST-05", "CL-TEST-06", "CL-TEST-07", "CL-TEST-08", "CL-TEST-09", "CL-TEST-10", "CL-TEST-11", "CL-TEST-12", "CL-TEST-13", "CL-TEST-15", "CL-TEST-16", "CL-TEST-17", "CL-TEST-18", "CL-TEST-19", "CL-TEST-20", "CL-ROB-07", "CL-TEST-21"],
    "WP-12": ["CL-PERF-01", "CL-PERF-02", "CL-PERF-03", "CL-PERF-04", "CL-PERF-05", "CL-PERF-06", "CL-PERF-07", "CL-PERF-08", "CL-PERF-09", "CL-PERF-10", "CL-PERF-11", "CL-PERF-12", "CL-PERF-13", "CL-PERF-14"],
    "WP-13": ["CL-REC-01", "CL-REC-02", "CL-REC-03", "CL-REC-04", "CL-REC-08", "CL-ROB-03", "CL-ROB-08", "CL-ROB-09", "CL-ROB-13"],
    "WP-14": ["CL-ROB-02", "CL-ROB-04", "CL-ROB-05", "CL-ROB-10", "CL-ROB-11", "CL-ROB-12"],
}

# the carried issues (docs/audit-post8-evidence/records/carried.json) cross-referenced to this audit's findings and questions (section C.4)
CARRIED_REFS = {
    "C-01": "CL-PERF-12, CL-PERF-04", "C-02": "CL-PERF-06, CL-PERF-01, CL-PERF-03", "C-03": "CL-PERF-02; question 278",
    "C-04": "CL-PERF-07, CL-PERF-11", "C-05": "CL-PERF-10", "C-06": "CL-MAP-01, CL-MAP-02, CL-TEST-02; question 274",
    "C-07": "CL-MAP-01, CL-MAP-07, CL-MAP-17", "C-08": "CL-TEST-14 (decision 267 (a), not re-required)", "C-09": "CL-VIS-01 (outside the check's scope)",
    "C-10": "none (accepted, confirmed visually)", "C-11": "question 280", "C-12": "question 281", "C-13": "CL-HIS-04 (the III Column's neighbour); accepted",
    "C-14": "none", "C-15": "question 282", "C-16": "CL-VIS-02 (trees on the mere beside it); accepted", "C-17": "CL-VIS-06; question 282",
    "C-18": "CL-MAP-18", "C-19": "CL-MAP-15", "C-20": "none (kept by decision 92)", "C-21": "CL-VIS-08", "C-22": "CL-GEO-05",
    "C-23": "none (below the map's unit)", "C-24": "none", "C-25": "CL-PERF-02", "C-26": "CL-HIS-04, CL-GEO-08, CL-GEO-10", "C-27": "CL-GEO-10",
    "C-28": "none (settled, not adopted)", "C-29": "none", "C-30": "none", "C-31": "CL-GEO-10", "C-32": "CL-GEO-10, CL-GEO-04", "C-33": "CL-GEO-02",
    "C-34": "CL-GEO-06", "C-35": "question 282", "C-36": "CL-HIS-17", "C-37": "none (moot in the drawing)", "C-38": "CL-GEO-07, CL-HIS-14",
    "C-39": "CL-SRC-03, CL-SRC-04", "C-40": "CL-HIS-08", "C-41": "CL-HIS-09", "C-42": "none", "C-43": "none (done)", "C-44": "CL-MAP-01, CL-MAP-17",
    "C-45": "CL-VIS-03, CL-VIS-04; questions 280, 281", "C-46": "CL-VIS-01, CL-VIS-02, CL-VIS-05", "C-47": "CL-VIS-04, CL-VIS-06", "C-48": "CL-TEST-12",
    "C-49": "CL-TEST-13", "C-50": "CL-SRC-01; question 271", "C-51": "CL-HIS-15", "C-52": "CL-UX-05", "C-53": "CL-HIS-16", "C-54": "CL-REC-05",
    "C-55": "CL-REC-05", "C-56": "none (unchanged)", "C-57": "CL-UX-06",
}

_CARRIED_MORE = {'C-01': ['CL-PERF-05', 'CL-PERF-08', 'CL-PERF-09', 'CL-PERF-11'], 'C-04': ['CL-PERF-10'], 'C-06': ['CL-MAP-14'], 'C-07': ['CL-MAP-02'], 'C-09': ['CL-TEST-08'], 'C-10': ['CL-VIS-05'], 'C-13': ['CL-VIS-04'], 'C-17': ['CL-GEO-01'], 'C-18': ['CL-MAP-11'], 'C-20': ['CL-SIM-06'], 'C-28': ['CL-MAP-01', 'CL-MAP-14', 'CL-TEST-02'], 'C-29': ['CL-UX-08'], 'C-30': ['CL-GEO-10'], 'C-34': ['CL-HIS-10', 'CL-TEST-04'], 'C-39': ['CL-GEO-06', 'CL-GEO-10', 'CL-HIS-14', 'CL-SRC-01'], 'C-40': ['CL-HIS-11'], 'C-43': ['CL-MAP-08', 'CL-MAP-10'], 'C-44': ['CL-MAP-02', 'CL-MAP-07', 'CL-MAP-14', 'CL-TEST-02'], 'C-45': ['CL-HIS-05', 'CL-VIS-01'], 'C-47': ['CL-GEO-05', 'CL-GEO-08'], 'C-48': ['CL-HIS-12'], 'C-51': ['CL-HIS-06'], 'C-53': ['CL-HIS-15'], 'C-14': ['CL-GEO-11'], 'C-56': ['CL-UX-22'], 'C-42': ['CL-TEST-21 (not examined)'], 'C-19': ['question 284']}
for _k, _v in _CARRIED_MORE.items():
    _cur = CARRIED_REFS.get(_k, "")
    _cur = "" if _cur.startswith("none") else _cur
    CARRIED_REFS[_k] = ", ".join(x for x in ([_cur] if _cur else []) + _v)
# the status shown where this audit's evidence supersedes the records' (section C.4)
CARRIED_STATUS = {"C-01": "accepted as measured (decision 268 (a)); attributed by this audit (CL-PERF-12)",
                  "C-05": "open; the F key is the only visitor path to effects off and nothing claims it is faster (completeness critic, code read)"}

# entries registered from evidence that no area made a finding of (section B intro says so)
OWN = [
    ("CL-GEO-11", {"title": "The Sokolnitz castle's site falls on the drawn track class: the quadrangle stands on a track's surface (13 of 16 points within 25 m are 'track')",
        "category": "confirmed-defect", "severity": "S4", "priority": "P4", "subsystem": "landmarks against the land cover (world.js LANDMARK_SITES, drawnCover)",
        "user_impact": "Close up, the castle and its farm stand on a track's colour and texture rather than on ground of their own.",
        "status": "confirmed (records area's script)", "origin": "new-regression (8J's site)",
        "refs": ["world.js:162", "docs/STAGE8_SPEC.md:5109"], "evidence": "docs/audit-post8-evidence/records/castle-site.json (tools/audit-post8/records/castle-site.js): drawnCover at LANDMARK_SITES.castle is 'track'; at 25 m 13 of 16 points 'track', 3 'meadow'; carried item C-14",
        "expected": "A landmark's footprint on ground the cover classes give to buildings or open ground, not a road surface.", "observed": "The site and most of its 25 m ring are classed 'track'.",
        "remedy": "Give the castle's footprint its own cover (or route the track round it) in the land-cover data, a data task with the drawing re-measured.", "effort": "hours"}),
    ("CL-UX-22", {"title": "Safari's handling of the embedded faces' metric overrides is untested, and every italic is synthesized (no italic face is embedded)",
        "category": "untested", "severity": "S4", "priority": "P4", "subsystem": "type (fonts.css, tokens.js)",
        "user_impact": "On Safari, line heights and text widths may differ from the measured layouts; italics are the browser's slanted roman.",
        "status": "untested", "origin": "inherited (roadmap step 1)", "refs": ["fonts.css", "docs/ROADMAP.md:41-43"],
        "evidence": "docs/audit-post8-evidence/records/carried.md C-56: fonts.css holds three faces, all font-style normal; the Safari inference untested (the iPhone runs measured frames, not text metrics)",
        "expected": "Text measured on the browsers visitors use, or the limit stated.", "observed": "No Safari text measurement exists.",
        "remedy": "Measure the layouts' text boxes on Safari once (the owner's iPhone), or embed an italic face if italics matter.", "effort": "hours"}),
]

# --- the report reviewer's corrections, applied last so they take precedence ---
OVERRIDE.setdefault("CL-UX-02", {})["remedy"] = "Stop the camera slot when the visitor takes the camera: in the landscape's pan, zoom and key handlers (not inside LANDCAM.free(), which the double-click focus glide also calls) call setTween('cam',null) and clear camArc, as redrawGround does since 8H; the paper map's MAPCAM already ends its glide on input. Add a self-test check (drag, wheel and keys during each kind of glide leave the camera where the input left it)."
OVERRIDE.setdefault("CL-HIS-14", {})["remedy"] = "Data task: tag rg_cav.commander 'attributed' to the sources that give it (Sokolov; Schonhals p. 178; Duffy p. 184) and correct SOURCE_NOTE's 'rests on Sokolov alone' (CL-SRC-03); a qualifier on Bellowitz's label, or a Bellowitz data task (Krug: CL-GEO-07)."
OVERRIDE.setdefault("CL-REC-05", {}).update({"user_impact": "No screen-reader result exists for any build, Stage 8's landmark and heading changes (8H, A-6) included, and the A grades of the drawn coats rest on machine readings only; the records label both as attestations without results.", "remedy": "Run the 24-item screen-reader script once on the final build and read the 15 quotes once; meanwhile correct docs/stage6-evidence/second-reading.md's stale 'stays open for the owner' (no application change)."})
OVERRIDE.setdefault("CL-UX-08", {})["user_impact"] = "On the screen where the figure is shown, keyboard and touch visitors do not see that the 'derived' figures are spatial readings, not casualty figures (the sources sheet says so, one press away), and nowhere that the Zuran and Allied vantages are not what the commanders saw; screen-reader users get both as descriptions, mouse users only by resting the pointer."
OVERRIDE.setdefault("CL-TEST-07", {}).update({"observed": "The harness's per-case figure and standard measures are skipped at count 0 (a redundant second check); the named regression (kitGeos or kitWrap listing nothing, no standards) fails the self-test's 'figures: every visible man, horse and standard stands on the drawn ground' (n>0 required) and its standards count (nStd>0) in check:selftest and check:visual. Residual: a view-specific absence (one case drawing no figures) would not fail.", "user_impact": "Small: a case that drew no figures in one view would not fail the harness's own measure; a regression that drops every figure fails the self-test."})
OVERRIDE.setdefault("CL-SRC-04", {})["user_impact"] = "The method statement says reputable orders of battle give the I Column anything from 7,750 to 14,200 men. The sources read here agree within about 10% (12,730-14,000). The statement overstates the uncertainty and gives a figure of unestablished origin the authority of 'reputable' and 'returns'."
NOTES["CL-UX-10"] = (NOTES.get("CL-UX-10", "") + " Verifier: no owner decision keeps focus on the opener; WCAG 2.4.3 is arguable for non-modal content (the order follows the DOM), so it is not counted as an A failure: S3/P3 agreed. Origin inherited (step 3).").strip()
NOTES["CL-UX-01"] = (NOTES.get("CL-UX-01", "") + " Premise lens: the 844 x 390 layout's lack of phase text was not stated to the owner when decision 226 (a) kept today's layout there, and its Stage 0 premise has been void since 3C: new evidence on that decision's premise, for the owner (with question 276).").strip()
_WEAK_NOTES = {
    "CL-HIS-14": "Verifier: the Krug part is geography #6 (CL-GEO-07); the Kologrivov premise fails (three sources give the command): title, severity S4 and remedy corrected.",
    "CL-SRC-02": "Verifier: Friant's 3,470 is 30 under Sokolov's lower bound; the gap is Bourcier's (830 against 1,200-1,500) and the detachment's; title corrected, P3.",
    "CL-SRC-04": "Verifier: 'only on a popular website' not established (Smith, Goetz, Castle, Bowden and Chandler not searched); title and user impact corrected; S3/P3 kept.",
    "CL-SRC-08": "Verifier: locator corrected (Schonhals p. 177, not Sokolov p. 195); Duffy's working figures and Viskovatov not re-checked.",
    "CL-GEO-06": "Verifier: the movement audit can fail a marsh crossing away from villages, so 'no check can fail' was overstated; title corrected.",
    "CL-UX-08": "Verifier: the derived caveats are visible in the sources sheet (SOURCE_NOTE.body[6]); what stands is the main screen's title-only qualifiers and the vantages' caveat; S3/P3; origin inherited.",
    "CL-UX-13": "Verifier: the certain part is a right or middle press seeking and stopping Play; the context-menu release unverified; S4/P4.",
    "CL-MAP-03": "Premise lens: Watch and Clean hide the key by 2D's recorded choice (STAGE2_SPEC.md:866-867) and 430 px or less by decision 226 (a); the gap below 1080 px wide and over 430 px tall stands at S2/P2. Reproduction lens: confirmed; from Watch or Clean the key is two presses away.",
    "CL-MAP-07": "Verifier: origin corrected (inherited crowding plus 8C's stabiliser); S3/P3 kept, a secondary path.",
    "CL-MAP-14": "Verifier: net -1 to +3 against a fresh view; accepted under decision 240 (a); S4/P4.",
    "CL-MAP-20": "Verifier: no single 1805 German convention to break; a toponymy convention would be an owner choice; optional, S4/P4.",
    "CL-VIS-02": "Verifier: 6 objects visible above the ice, 14 hidden under it; S3/P3.",
    "CL-TEST-07": "Verifier: the self-test catches the named regression; the harness check is a redundant second one; optional, S4/P4.",
    "CL-TEST-09": "Verifier: SPEED_CEIL is guarded by check:data, ARROW_CAP by a source pin naming decision 241; overlaps CL-TEST-03; S4/P4.",
    "CL-TEST-12": "Verifier: the 19 timing bases are a two-valued enum the note's 'enums' plausibly covers; 10 plan labels remain outside the inventory.",
    "CL-TEST-15": "Verifier: the behaviour check holds the property, so the pin is redundant; its blind spot opened by 8C; optional, S4/P4.",
    "CL-REC-01": "Verifier: a missed convenience, not a defect against a stated requirement; optional, S4/P3.",
    "CL-REC-04": "Verifier: two of three items misstated; the substance is carried by CL-HIS-08, CL-HIS-09, CL-MAP-01 and CL-TEST-02; S4/P4.",
    "CL-REC-05": "Verifier: both attestations are labelled; what is untested is any screen reader on the current build; S3/P3.",
}
for _k, _v in _WEAK_NOTES.items():
    if _k not in VERDICT:
        VERDICT[_k] = {"verdict": "WEAKENED", "note": _v}

# --- duplicate keys in the OVERRIDE literal merged (earlier fields kept, later ones win) ---
OVERRIDE['CL-UX-03'] = dict({"title": "Event markers' hit areas take presses meant for the time rail: on a phone about two thirds of the rail, so a finger's drag there does nothing and a tap jumps to an event; on a desktop the playhead itself at an event start", "observed": "On a phone (390 x 844): markers take 64.2% of the rail's middle line (the area measured 65.8%) and 4.5% 4 px above its foot (9.4%); a finger's drag that starts on a marker does not scrub, and a tap jumps to the event; a real touch drag from (121.5, 840), where elementFromPoint returns the rail, did not scrub either (run twice), so the rail's bottom 4 px is no reliable escape. On a desktop, at an event start the marker's hit area covers the playhead: a drag that starts there goes to the marker and the rail never sees it; markers take 24-34% of the desktop rail."}, **OVERRIDE.get('CL-UX-03', {}))
OVERRIDE['CL-REC-03'] = dict({"observed": "Wider than stated in CHANGELOG: four older heads are also unrevised: :1698 (PR #58, 'for review'; merged 7437dcc), :1650 (#59 draft; a107472), :1574 (#60 draft; a8afeec), :1339 (#64 draft; d86835e). Narrower in ROADMAP: :548 does record #74's merge into main (72c7e1b) and #75/#76 into their stacked branches; it lacks #73, #77, #78 and #79.", "origin": "mixed: inherited (R-2 recurred from PR #58) and new-regression (#64, #73-#79)"}, **OVERRIDE.get('CL-REC-03', {}))
OVERRIDE['CL-MAP-03'] = dict({"title": "No symbol key at all between 720 and 1079 px wide or on a phone held upright, so the integrity encodings (the B and C grades, '?', the dashed intended routes) go unexplained there; Watch, Clean and a phone held landscape hide it by recorded design or decision", "user_impact": "On phones held upright, small tablets and 1024 px laptops (below 1080 px wide, over 430 px tall) a visitor has no way to learn what the B/C/? badges, status icons, echelon marks, dashed arrows, outlines, grade extents, event glyphs or the eye level's blue sheets mean; only the first-run card's two colours remain. In Watch and Clean the key is two presses away (1, then Key) by 2D's recorded choice; at 430 px tall or less it is hidden under decision 226 (a)."}, **OVERRIDE.get('CL-MAP-03', {}))
OVERRIDE['CL-REC-04'] = dict({"severity": "S4", "priority": "P4", "title": "The carried checklist misstates two of its own items: kienmayer@7's contradiction of its own act since Stage 0 filed as an 8J offset, and Caffarelli's separation given as 2.5-2.9 km where the build draws 2.13-2.64 km", "user_impact": "A reader of the checklist takes Kienmayer's error for 8J's small offset and Caffarelli's separation as larger than drawn; the 4,033 ms item is stated with its limit.", "observed": "Two of three items misstated: kienmayer@7's contradiction of its own act since Stage 0 filed as an 8J offset (understated); Caffarelli's separation given as 2.5-2.9 km where the build draws 2.13-2.64 km (overstated). The 4,033 ms item is stated with its limit. The substance is carried by CL-HIS-08, CL-HIS-09, CL-MAP-01 and CL-TEST-02."}, **OVERRIDE.get('CL-REC-04', {}))
