"""Final audit after Stage 8: the auditor's resolution of the adversarial verification (read by register.py).

OVERRIDE: id -> fields replacing the area's (title, severity, priority, category, origin, observed, remedy ...), each change taken from a
verifier's 'corrected' or 'notes' (docs/audit-post8-evidence/verification/<label>.json), or the auditor's own judgement where the lenses
disagree (then said in VERDICT's note).
VERDICT: id -> {"verdict": ..., "note": ...}: the auditor's verdict where the lenses' most adverse one is not the right summary.
NOTES: id -> text appended to the entry's note (verifiers' extra issues folded into the finding they belong to).
"""

OVERRIDE = {
    # history
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
    "CL-HIS-14": {
        "title": "Krug and Bellowitz are drawn at their legacy places with the open question only in SOURCE_NOTE (Krug's place is CL-GEO-07), and the Russian Guard cavalry's commander is shown without a claim tag (the note behind it is CL-SRC-03)",
        "severity": "S4", "priority": "P4",
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
    # map layer and furniture
    "CL-MAP-01": {"origin": "mixed: new-regression for the long gaps (8C's hold of the map layer through Play, lengthened by decision 260 (a)'s places) on an inherited starvation share (2D's priority order under decision 24)"},
    "CL-MAP-02": {"severity": "S3", "priority": "P3", "category": "probable-problem"},
    "CL-MAP-03": {
        "title": "No symbol key at all between 720 and 1079 px wide or on a phone held upright, so the integrity encodings (the B and C grades, '?', the dashed intended routes) go unexplained there; Watch, Clean and a phone held landscape hide it by recorded design or decision",
    },
    "CL-MAP-04": {
        "severity": "S3", "priority": "P3", "category": "probable-problem",
        "observed": "North is shown only in Study at 1080 px or wider and more than 700 px tall (style.css hides the rose at 700 px or less); the Field vantage faces 63 degrees from north, the Zuran 135, the Allied 85; the paper map is north-up by construction.",
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
    "CL-HIS-02": {"verdict": "WEAKENED", "note": "Both lenses: the premise holds through CONF_TEXT.A, not through 8K's rule; 44 counts unreviewed carried grades, not wrong ones (21 are 1-5.6 km from the anchor that declared the A, 29 have no act). Applied: probable problem, P3."},
    "CL-HIS-03": {"verdict": "WEAKENED", "note": "Both lenses: the register is divided (the disposition and Stutterheim against the official report), so the defect is taking one side without saying so; title corrected; S2 kept."},
    "CL-TEST-01": {"verdict": "WEAKENED", "note": "Both lenses: the facts hold; no rule requires the browser checks to gate (decision 132 asked that they run); S3. The lenses differ on P2 or P3 and on probable problem or optional improvement: the auditor takes P3, probable problem (a process risk the project's reliance on the self-test makes real)."},
    "CL-MAP-01": {"verdict": "WEAKENED", "note": "Premise lens: real for Landscape with counters; the origin is mixed (corrected). Severity S2 kept."},
    "CL-MAP-02": {"verdict": "WEAKENED", "note": "Premise lens: protecting event-named formations extends decision 39's never-dropped list, so it needs an owner decision; S3, probable problem."},
    "CL-MAP-04": {"verdict": "WEAKENED", "note": "Premise lens: the premise is cartographic convention, not a project rule; the absence of an orientation aid, S3."},
    "CL-MAP-05": {"verdict": "WEAKENED", "note": "Premise lens: within decisions 24 and 39 and their limits; missing reference lettering, an optional improvement."},
}

NOTES = {
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
