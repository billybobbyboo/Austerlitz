#!/usr/bin/env python3
"""The closing re-verification pass: each of the 158 findings' verdict on the final roadmap's build (md5 8c0d383e), with its evidence.
Verdicts (docs/ROADMAP_FINAL_AUDIT.md, "Closing"):
  fixed    re-verified on this build: the audit's probe (or the remedy's own measure) no longer shows the defect; "held" names the check that
           fails without the fix (from the work package's negative controls), or "no check" where nothing holds it
  kept     left as it is by an owner decision or as an accepted compromise, re-measured where a measure exists
  carried  open: not done, done in part, or needing the owner's run; it goes forward
Each entry: verdict, evidence (files under docs/closing-evidence/, or a check and its log), held (the check that holds a fix), note.
python3 tools/closing/verdicts.py [--json out.json] [--md out.md]   Reads only."""
import csv, json, sys
sys.path.insert(0, __file__.rsplit("/", 1)[0])
from claimed import C as CLAIMED
V = {}
def v(ids, verdict, evidence, held="", note=""):
    for i in ids.split():
        assert i not in V, i
        assert verdict in ("fixed", "kept", "carried"), verdict
        V[i] = {"verdict": verdict, "evidence": evidence, "held": held, "note": note}
E = "docs/closing-evidence/"
# ---------------------------------------------------------------- history (Claude's history probes, re-run on the isolated copy)
v("CL-HIS-01", "fixed", E+"history/event-claims.txt (face-about: pill recon, why disputed; the audit's flag gone)",
  "test.js (the event's claims, their readings and hashes)", "labelled a reconstruction with five sides, as WP-01 chose")
v("CL-HIS-06", "fixed", E+"history/event-claims.txt (decision, soult, guard-attack, ice: pill disputed with their disputes)", "test.js (claims)")
v("CL-HIS-02", "fixed", E+"history/grades.txt (A carried forward 44 -> 0; graded A 88 -> 37)", "test.js, the grading rule (WP-03's negative controls)")
v("CL-HIS-03", "fixed", E+"history: rg_inf@5's act 'Where it stood is divided ...', grade C", "test.js (claims)")
v("CL-HIS-04", "fixed", E+"history/legrand-through-castle.txt (closest to the castle 720 m at 08:00, moving away; the audit 25 m)",
  "sim-test.js's fight register and the Sokolnitz rule (WP-03 M4)")
v("CL-HIS-05", "fixed", E+"history/motion-vs-status.txt (no Guard, Liechtenstein or Miloradovich leg away from the enemy; the audit 80-85 min each)",
  "sim-test.js rule 285 (a) (legs from an offensive status into a retreat held; 0 minutes moving into a retreat under an offensive status)",
  "nine short cases of 5-20 minutes remain of a formation moving away from its nearest enemy under an offensive status (kollo, legrand, c_gren and "
  "the two retreats toward an enemy as at the audit; caffarelli, suchet, nansouty, vandamme new or shifted); rule 285 (a) tests legs into a "
  "retreat, not these, so no check holds them")
v("CL-HIS-07", "fixed", E+"history/plateau-day.txt (Kamensky holds at [259,316] through 08:45, heading none; the audit turned from 08:10)",
  "check:chronology (WP-03 M2)")
v("CL-HIS-08", "fixed", E+"history: kienmayer@7's act names both, the cavalry west of the brook and the point drawn this map's, grade C",
  "test.js (claims)", "the point is not moved (handed on by WP-03)")
v("CL-HIS-09", "fixed", E+"history/caffarelli-bagration.txt (the objective 'Attack Bagration's left at Krug and Holubitz', where it is drawn)",
  "test.js (claims)")
v("CL-HIS-10", "fixed", E+"history/closest-approach.txt (opposing centres: 13 m only in the recorded fight Saint-Hilaire/Kamensky; the audit 12-37 m in four "
  "pairs); history/legs-water.txt (Litava crossings 5 -> 2, both at Augezd)", "sim-test.js's fight register (MELEE)")
v("CL-HIS-11", "fixed", E+"history/sokolnitz-defence.txt (Legrand within 0.51 km to 10:00, Friant on the village from 10:30; the audit empty 09:00-13:15)",
  "sim-test.js's Sokolnitz rule (WP-03)")
v("CL-HIS-13", "fixed", "runtime-test.js 'derived tags: 699 march rows tagged derived (438 drifts under 1 km/h named \"Plotted march\", none \"Marching\")' "
  "(npm test, "+E+"checks/suite-out/out_runtime-test.js.txt)",
  "runtime-test.js (WP-03 M3)", "the audit's drift-legs.txt reads marchRate().moving, a model value the fix leaves as it is (56 drifts, 63 at the audit)")
v("CL-REC-06", "fixed", E+"history: milo@0 B, its act 'In two lines behind the III Column ...'", "test.js (claims)")
v("CL-HIS-16 CL-HIS-17", "kept", "CHANGELOG (WP-03: kept as they are)", "", "accepted compromises")
# ---------------------------------------------------------------- state (props-helpers, props-bundle, props-bundle2, props-bundle3)
v("CL-SIM-01", "fixed", E+"state/props-bundle2.txt (C1-C3: the card and the dossier repainted 3 times within a leg, at the clock's place; place lists 0 of 240 "
  "differ, the audit 86)", "the self-test 'dossiers (WP-05, CL-SIM-01)'; runtime-test.js",
  "the fix has a side effect found by this pass: a press in the open dossier during Play is lost when the repaint falls between the press and its release "
  "(7 of 16 at 100 ms, interaction/dossier-click-driven-05.json); carried as a new finding in the report")
v("CL-SIM-03", "fixed", E+"state/props-bundle.txt (a theme chosen while playing: playing after false, the clock held at 240; the audit ran on to 250)",
  "runtime-test.js (WP-05)")
v("CL-SIM-04", "fixed", E+"state/props-bundle.txt (B-series fades: 0 outgoing pops, the reached opacity carried; the audit 5)", "runtime-test.js (WP-05)")
v("CL-SIM-06", "fixed", E+"state/props-bundle.txt (0 formation-minutes whose reading depends on the path; the audit 29 and 38)", "runtime-test.js (WP-05)")
v("CL-UX-14", "fixed", "app.js jumpEvent (t+1e-6, forward); runtime-test.js 'the event keys' margin (CL-UX-14)' (npm test)", "runtime-test.js",
  "the audit's props-helpers P4 copies the old rule (t+1.5) and so still prints 20 of 21: it cannot see the fix")
# ---------------------------------------------------------------- Stage 1: WP-00, WP-04a, WP-13
v("CL-ROB-01", "fixed", E+"robustness/perfrun-src-after.json (the audit's own probe on a local copy, 127.0.0.1; never the live site)",
  "no suite (the probe is the audit's; WP-00 verified with it)", "javascript: and data: run no script; same-origin paths still load")
v("CL-ROB-06", "kept", "decision 270 (b): the archived builds' pages left as they are", "", "the frozen archives still load three.js without integrity")
v("CL-PERF-16", "fixed", E+"chatgpt/phone-rule.txt (two empty reports refused, exit 1; the audit exit 0 'stands'); "+E+"chatgpt/phone-rule-negatives.txt (8 of 8 refused; R1/R2 rule 4)",
  "tools/step6/phone-rule-negatives.js")
v("CL-REC-09", "fixed", "build.py prints bytes and characters (npm run build)", "no check")
v("CL-REC-10 CL-REC-04", "fixed", "docs/STAGE8_SPEC.md section 26 (the glare figure with its build and browser; the carried checklist's two items)", "no check")
v("CL-REC-01", "fixed", "README.md: 'Open the map', what is reconstruction and what is evidence, the network at start-up", "no check")
v("CL-REC-03", "fixed", E+"records/doc-consistency.log (the stale status lines no longer on their lines)", "no check")
v("CL-ROB-03", "carried", "deferred by WP-13: splitting CLAUDE.md needs the owner's word", "", "CLAUDE.md has grown since (the owner's instruction file)")
v("CL-ROB-08", "carried", "deferred by WP-13: the licence, owner question 279", "", "no licence file")
v("CL-ROB-13", "carried", "deferred by WP-13: the archive images' terms not read", "")
v("CL-ROB-09", "kept", "question 283 (a): the self-test kept shipped", "", "its share is larger now (the self-test IIFE 621,686 bytes of app.js's 1,461,616, "
  +E+"robustness/static-scan.json)")
# ---------------------------------------------------------------- WP-04a, WP-04b
v("CL-GEO-01", "fixed", "terrain-test.js's tolerance lines (tools/relief-tolerance.js on tools/relief-dem.json) pass in npm test; the disclosure in SOURCE_NOTE",
  "terrain-test.js (WP-04b N1)", "the relief beyond the battle's centre was not fitted (handed on by WP-04b)")
v("CL-GEO-03 CL-GEO-04", "carried", "the streams labelled schematic in the key (css-test.js, the self-test's legend check); the re-tracing not done",
  "css-test.js (the legend row)", "the quick remedy holds; re-tracing the brooks from the 1825 sketches is handed on (2-5 days each)")
v("CL-GEO-05", "fixed", "terrain-test.js 'no village's centre and no building on the drawn marsh class' (npm test)", "terrain-test.js (WP-04b)")
v("CL-GEO-07", "fixed", "geo-test.js holds Krug as a surveyed village (npm test)", "geo-test.js (WP-04b)")
v("CL-GEO-11", "fixed", E+"records/castle-site.json (the site on the village class in every ring to 75 m; the audit the track class)", "terrain-test.js (WP-04b)")
# ---------------------------------------------------------------- Stage 2: WP-01, WP-02 (data tasks; claims held by test.js, the data by check:data)
v("CL-HIS-12", "fixed", E+"page/page-probe.txt (every Command row of both headquarters at every phase: DOCUMENTED only on a read claim)",
  "no check (the closing probe tools/closing/page-probe.js, with its negative control)", "the probe's count of 'doc' labels in the data (32 unchecked) "
  "is the source label, which the presentation now overrides")
v("CL-HIS-14 CL-HIS-15 CL-SRC-03 CL-SRC-09 CL-GEO-02 CL-GEO-06 CL-GEO-10", "fixed",
  "the reworded statements and their claims in narrative.js (test.js holds each claim's hash and readings; npm test)", "test.js (claims, hashes, readings)")
v("CL-GEO-08", "fixed", "the Pratzen church at LANDMARK_SITES.church (WP-01); the self-test's landmarks check", "the self-test's landmarks check")
v("CL-GEO-09", "fixed", "the sources sheet at 1x reads 'drawn at true scale (1x)'", "the self-test's 1x relief check (strict on the old words)")
v("CL-SRC-01 CL-SRC-02 CL-SRC-04 CL-SRC-05 CL-SRC-07", "fixed", "the strengths and notes of WP-02 (test.js's order-of-battle values, each was and is; "
  "redteam.js's acknowledged gaps; npm test)", "test.js (the OOB values), check:data")
v("CL-SRC-06", "fixed", E+"page/page-probe.txt (every strength row in the cards and dossiers tagged 'this map's working figure' or 'derived: the sum of its formations')",
  "no check (the closing probe, with its negative control)")
v("CL-SRC-08", "carried", "WP-02 credited most; three credits left to later passes (the 30th Bulletin for decision 202 (b), Fieffe's locator, Viskovatov pp. 229-230)",
  "", "not taken up by a later pass by name")
# ---------------------------------------------------------------- Stage 5: WP-08 (WP-07 below, with the visibility probes)
v("CL-MAP-03 CL-MAP-04 CL-MAP-08 CL-MAP-10 CL-MAP-16", "fixed", "the self-test's WP-08 block (wp08Checks: the event glyphs, the key's rows, the key in the '?' overlay, "
  "the rose on true north, the selection's edge); check:selftest and check:visual on this build", "the self-test (wp08Checks; WP-08's 10 negative controls)")
v("CL-MAP-06 CL-MAP-13", "fixed", "the narrow live block (the caption at three widths, two presentations and four clocks; no card beside an open dossier)",
  "check:visual's and check:selftest's narrow block (checkLive)")
v("CL-MAP-09 CL-MAP-11 CL-VIS-11", "fixed", "the self-test's WP-08 lettering block (wp08cChecks: the arrows' name-only labels, the Plans view, the landmarks' outlines)",
  "the self-test (wp08cChecks; 11 negative controls)")
v("CL-MAP-05", "kept", "decision 302 (b): the paper map's lettering as it is (the names appear on zoom)", "")
v("CL-MAP-15", "kept", "decision 284 (b): the low views' wall of names as decided, re-measured by WP-08", "")
v("CL-MAP-18", "kept", "the Littawa dropped at 1280 px in the Plans view, kept as accepted (STAGE8_SPEC section 22.4); plans-overview's drop limit 13", "")
v("CL-MAP-19 CL-MAP-20", "kept", "decision 298: the paper map's arrows uncapped; no single 1805 naming convention", "")
# ---------------------------------------------------------------- Stage 6: WP-09
v("CL-UX-01", "fixed", "check:contrast's 320 x 256 page (12 states with forced colours: all reached, no horizontal scroll, AA) and check:visual's zoom cases",
  "check:contrast (REFLOW_STATES) and check:visual (zoom-320x256-explore, zoom-400x225-explore)")
v("CL-UX-09", "fixed", "check:contrast's forced-colours page (FC_STATES: all reached, the pressed states in Highlight)", "check:contrast (FC_STATES)")
v("CL-UX-18", "fixed", "the narrow block at 800 x 450 (the tools and the card not overlapping); the caption's separators (WP-08); the grip's drag",
  "check:visual's and check:selftest's narrow block")
v("CL-UX-08 CL-UX-10 CL-UX-11 CL-UX-12 CL-UX-15", "fixed", "the self-test's wp09Checks (names and structure, the phase text's hint, the focus by keyboard, "
  "the caveats as text, the first card)", "the self-test (wp09Checks; 9 negative controls)")
v("CL-UX-21", "fixed", "the sources sheet's last row 'Not yet checked: ... (463 statements)'; runtime-test.js 'the claims on screen': every one of 726 statements "
  "placed in the index's words (npm test, "+E+"checks/suite-out/out_runtime-test.js.txt)", "runtime-test.js (narrativeRefs ref for ref against tools/step4/statements.js, and the count)")
v("CL-UX-05", "fixed", "runtime-test.js: 133 drawn views hold no roadmap step, decision number, register entry, path or code name (npm test)",
  "runtime-test.js (internal references; negative controls on main's narrative.js and data.js)")
v("CL-UX-16", "fixed", "decision 310's words (a data task); runtime-test.js's position pills", "runtime-test.js (the pills)")
v("CL-UX-17", "kept", "decision 311 (a): t-small kept at 11.5 px; check:contrast: 0 texts under 10.5 px", "")
v("CL-REC-05", "carried", "the second reading's wording corrected (Stage 6 records); the screen-reader session's results are the owner's to record "
  "(docs/final-stage6-evidence/sr-session.md: nothing recorded)", "", "the owner's session")
v("CL-UX-06 CL-UX-22", "carried", "the owner's device script, docs/final-stage6-evidence/sr-session.md (D1-D4 the pinch, S1-S3 Safari's faces): nothing recorded",
  "", "only a real phone and Safari can settle them")
# ---------------------------------------------------------------- Stage 6: WP-10
v("CL-VIS-01 CL-VIS-02", "fixed", "the self-test's wp10Checks (every instance in a mere's disc on its ice; no tree or bush in a disc)",
  "the self-test (wp10Checks; 5 negative controls)")
v("CL-VIS-03 CL-VIS-05 CL-VIS-07 CL-VIS-09", "fixed", "the self-test's wp10pChecks (the facings, the camp, the streams' glint, the tier on a resize); "
  +E+"history/facing.txt (the audit's facing probe, adapted)", "the self-test (wp10pChecks; 6 negative controls)")
v("CL-VIS-08", "fixed", "the self-test's wp10gChecks (the crowns near the eye)", "the self-test (wp10gChecks)")
v("CL-VIS-04", "kept", "decision 307 (c): measured (every clock has a block on a building), the sources sheet says the blocks are drawn at their frontage",
  "the self-test (wp10gChecks: the sentence)")
v("CL-VIS-06", "fixed", "the chapels' marks (WP-08 lettering, decision 282 (a)); the self-test's wp08cChecks (the chapels)", "the self-test (wp08cChecks)")
v("CL-VIS-10", "kept", "decision 309 (a): decision 265 (a)'s bounded convention; "+E+"chatgpt/contact.log (ChatGPT's T18, contact-8f.js on the same build "
  "both sides, adapted to WP-16's aSl as tools/closing/contact.js: 17-58 instances an arm beyond the tolerance, ChatGPT 5-13 on the audited build); "
  +E+"chatgpt/contact-stage6.log (Stage 6's data build: 7-22) and contact-wp16a.log (WP-16's first PR, read by the original code path: identical "
  "instance by instance)", "the self-test's gait-on-the-ground check (h), its kept-open counts (H_CASES)", "worse since the audit, twice on the owner's "
  "word: the relief's refit (decision 293 (a)) and the facings turning halted blocks across other creases of the ground (decision 316)")
# ---------------------------------------------------------------- Stage 7: WP-14, WP-16, WP-12
v("CL-ROB-02", "fixed", "check:contrast's context-play start-up case (no page error while lost during Play)", "check:contrast (context-play)")
v("CL-ROB-04", "fixed", "check:contrast's context-heap case (at most 0.5 MB a restore after the first, one dispose listener an object)", "check:contrast (context-heap)")
v("CL-ROB-10", "fixed", E+"robustness/static-scan.json (no dead top-level function; the audit gaitDist); tools/final-stage7/dead-code.js in npm test",
  "tools/final-stage7/dead-code.js (npm test)")
v("CL-ROB-11", "fixed", "app.js esc() escapes both quotes; runtime-test.js's esc() check (npm test)", "runtime-test.js")
v("CL-ROB-05", "kept", "README.md states the network at start-up (decision 133 (a) keeps three.js on the CDN)", "")
v("CL-ROB-12", "kept", "decision 318 (b): the loop keeps requesting frames while idle (0.86% of a core measured)", "")
v("CL-PERF-12 CL-PERF-13 CL-PERF-14", "fixed", "the self-test's wp16Checks (the beat in aSl, the free rectangle kept, the label pass's lights); the owner's desktop runs "
  "(docs/STAGE8_SPEC.md section 27.1: the CPU line met in every segment)", "the self-test (wp16Checks), css-test.js")
v("CL-PERF-15", "kept", "decisions 322 (b) and 324 (a): the phone accepted as measured (section 27.2: 53 and 47-48 frames a second, as P5)", "",
  "section 8.5's long-frame clause fails in phase 8's Overview orbiting (2.7% to 8.9% and 15.6%), carried here by decision 324 (a)")
v("CL-PERF-01 CL-PERF-03 CL-PERF-04 CL-PERF-05 CL-PERF-07 CL-PERF-08 CL-PERF-09", "fixed", "docs/STAGE8_SPEC.md section 27; the route's version 4 "
  "(raw intervals, missedPct, maxima); route-check.js on the owner's four reports", "tools/final-stage7/route-check.js (5 negative controls)")
v("CL-PERF-06", "fixed", "the ordinary route on the phone, 13 November 2026 (section 27.2): like for like with P5", "", "decided by 324 (a)")
v("CL-PERF-10", "kept", "decision 323 (b): recorded (the first effects-off switch compiles 22 programs)", "")
v("CL-PERF-11", "kept", "section 8.5's rule unchanged; the missed-refresh share reported beside it", "")
v("CL-PERF-02", "carried", "the integrated-GPU run (decision 278): not run; the owner's desktop is an RTX 4070", "", "the owner's run")
# ---------------------------------------------------------------- WP-15
v("CL-SRC-10", "carried", E+"records/claims-count.json (726 statements: 187 with a claim of their own, 76 by class, 463 unchecked; the audit 704, 148, 75, 481)",
  "test.js (every claim's readings and hash)", "WP-15's first batch only; tier 1 still had 40 unchecked statements after it; later batches handed on")
# ---------------------------------------------------------------- WP-11 (alongside every stage; none taken up by name)
v("CL-TEST-01", "carried", ".github/workflows/checks.yml unchanged in this respect; which checks gate a merge is the repository's branch protection, "
  "the owner's setting, not readable here", "", "not changed by any pass")
v("CL-TEST-03 CL-TEST-19", "carried", E+"mutations/mutations-table.md (the 33 controls: 9 caught only by change detectors, the audit 11; M17, M27 and M31 by check:data "
  "alone, as M16, M17, M27 and M31 at the audit)", "",
  "no property check replaced the change detectors; M16 and M18 are now caught by a semantic check incidentally: test.js's carried-grade rule of decision 272 (a) "
  "(the next anchor carries the raised A) and sim-test.js's fight register (a MELEE entry left unused once Saint-Hilaire moves), not by a check of the "
  "grade's evidence or the position")
v("CL-TEST-04", "carried", "partly covered since: sim-test.js's WP-03 rules (opposing centres within 0.5 km only in a recorded fight, the Litava's crossings, "
  "no move into a retreat under an offensive status); no check of blocks against buildings, act sides of the stream, or an event's pill against its "
  "statements' claims", "sim-test.js (WP-03, in part)")
v("CL-TEST-05", "carried", E+"mutations/mutations-2.json (M29: init() moves sthilaire@5 0.4 km; every suite and check:data pass: missed, as at the audit)", "")
v("CL-TEST-06", "carried", E+"mutations/mutations-2.json (M30: the full dossier's strength 25% above the data's; missed by every suite, as at the audit)", "")
v("CL-TEST-07", "carried", "not changed by any pass (tools/visual's figure-on-ground and standard-foot checks)", "")
v("CL-TEST-08", "carried", "no suite compares animGLSL with animAt (css-test.js reads their text only); "+E+"robustness/mirror-check-adapted.json (the audit's probe, adapted to WP-16's packed aSl: 25,600 samples, the largest difference 0.0007729, the audit's numbers exactly)", "", "the two agree today; the audit's probe as written no longer runs on this build (robustness/mirror-check-as-written.json: GL_INVALID_VALUE, differences to 1.5), a rot only a person reading its output would see")
v("CL-TEST-09", "carried", E+"mutations/mutations.json (M25: the infantry ceiling 20% looser; caught only by redteam.js's known-warning text and check:data, as at the audit)", "")
v("CL-TEST-10", "carried", "not changed by any pass (style.css's typed interface colours)", "")
v("CL-TEST-11", "carried", "geo-test.js still holds the surveyed villages to 0.5 km; "+E+"mutations/mutations.json (M27: Kobelnitz 0.28 km east caught by check:data alone, as at the audit)", "")
v("CL-TEST-12", "carried", E+"tests/inventory-reach.json (726 statements; 115 prose strings matching no class, as at the audit; no completeness check)", "")
v("CL-TEST-13", "carried", E+"tests/word-hours.txt (44 statements with a word-form hour check:chronology does not read; the audit 45)", "")
v("CL-TEST-15", "carried", E+"mutations/mutations.json (M08, re-targeted to today's march row: caught by runtime-test.js; css-test.js's pin still passes it, as at the audit)", "")
v("CL-TEST-16", "carried", "test.js still reads the objective's x only; "+E+"mutations/mutations-2.json (M31: an objective at y 608 caught by check:data alone, as at the audit)", "")
v("CL-TEST-17", "carried", "tools/visual/boot-check.js: the context-loss case now requires 0 warnings (decision 320 (a)); two other cases keep the bound CTX_DELETES 248 "
  "where 0 is measured", "boot-check.js (context-loss)", "in part")
v("CL-TEST-18", "carried", "the manifest still holds names and a count (tools/visual/selftest-manifest.json)", "")
v("CL-TEST-20", "carried", "runtime-test.js's 30 s font watchdog (runtime-test.js:1819) unchanged; it passed here at a load of 3-6", "")
v("CL-TEST-21", "carried", "not examined by any pass: smoke, the opening's played stretches in real time, reduced motion and the rest the finding names", "")
v("CL-ROB-07", "carried", E+"robustness/mutate-rot.json (Stage 8's mutations that no longer apply: 11 of 189, the audit 5); "+E+"robustness/tools-rot.json", "",
  "worse: later passes changed the text those scripts edit; the audit's own probes rot too (mirror-check.js, props-helpers P4, props-bundle B9, facing.js: each adapted or explained here)")
# ---------------------------------------------------------------- recurrences corrected in this pass (records)
v("CL-REC-02", "fixed", E+"records/doc-consistency.log (WP-13's rows gone); README.md's checks table corrected again here: 57 contrast states and ten start-up cases "
  "(were 45 and eight), 351 self-test checks (325), 41 views (39), check:data's reference archive/stage6wp09w-45d29cc5.html (postaudit1)", "no check",
  "recurred after WP-13: later stages changed the counts and the reference without the README (the prior audit's R-1, again)")
v("CL-REC-08", "fixed", "CLAUDE.md's narrative.js row: today's counts added here (463 of 726 unchecked, 187 own claims, 76 by class; it ended at 8K's 481, 148, 75)",
  "no check", "recurred after WP-13 (records/doc-consistency.log: 'CLAUDE.md 24' still on its line)")
v("CL-SIM-07", "fixed", "runtime-test.js 'the first Play frame (CL-SIM-07)' (npm test): after idle frames the first drawn frame advances one 60 Hz frame's worth",
  "runtime-test.js (WP-05)", "the audit's props-bundle B9 sets lastFrame 30 s back without running the idle frames, the state the fix prevents, so it "
  "still prints 0.600 clock minutes")
# ---------------------------------------------------------------- Stage 3: WP-05, WP-06 (the audit's interaction scenarios re-run; interaction/*.json)
v("CL-SIM-02", "fixed", "the self-test 'Whose eyes? (WP-05, CL-SIM-02)' on this build (CI run 43524457649: 56 arrow-clocks withheld with their labels, 409 drawn, "
  "159 plateau labels counting only the known); "+E+"interaction/s3-selection-reading.json (11 of 11)", "the self-test (wp56Checks); runtime-test.js (the bound arrows "
  "and the plateau reading under every reading every 15 minutes)", "the plans', objectives' and groups' arrows are drawn under a reading, labelled interpretation "
  "(decision 312 (a))")
v("CL-SIM-05", "fixed", E+"interaction/s3-selection-reading.json (Saint-Hilaire's card under the Allied reading at 07:30: 'Doing now: Not known to Allied "
  "headquarters at 07:30'; the audit's card named 'Standing in fog behind Puntowitz')", "runtime-test.js 'Doing now under a reading (CL-SIM-05)', extended by decision 312 (a)",
  "the audit's s12-act-leak.js counts the data's act texts (stateAt(...).act), not the card as painted, so it cannot see the fix: 342 and 319 such texts "
  "name a place under the two readings (the audit 320 and 304, WP-01's and WP-03's rewording); interaction/s12-act-leak.json")
v("CL-SIM-08", "fixed", E+"interaction/s5-revisit-determinism.json (07:00 paused in the dwell against sought: the caption the same; the audit's differed); "
  "what still differs is the blocks' pose (8H's hold at a pause, by design, as the audit said)", "runtime-test.js (the caption paused in seven dwells' holds against a seek)")
v("CL-UX-02", "fixed", E+"interaction/s14-glide-input.json (a drag, a wheel, the map's arrow keys and a centring's drag during a glide: the eye stays where the input "
  "left it, 4 of 4; the audit moved 185-525 units after the input; the fifth case, a phase glide by PageDown, had ended before the input and exercised nothing); "
  +E+"interaction/s10-phone.json (a finger's pan during Play: Follow off, the eye kept; the audit failed)", "the self-test 'camera (WP-06, CL-UX-02)' (12 cases)")
v("CL-UX-03", "carried", E+"interaction/marker-drag.json (the playhead under the 04:15 marker, a real mouse dragged 200 px: in moves of 2 and 8 px it scrubs, in "
  "moves of 16 and 33 px it does not); "+E+"interaction/s1b-recheck.json (the audit's own drag from the playhead in 25-33 px moves: still not scrubbed); "
  +E+"interaction/s10b-phone-drag.json (a finger: as the audit's, passing)", "the self-test 'timeline (WP-06, CL-UX-03)' (its drags move in small steps)",
  "in part: a finger and a slow mouse drag are handed to the rail; a mouse whose first move after the press leaves the 12 px marker is not, because the "
  "marker's host sees a mouse's moves only while the pointer is over it (a mouse has no implicit capture) and so never sees the move past RAIL_SLOP. "
  "The audit's probe of the finding still fails")
v("CL-UX-04", "fixed", E+"interaction/s13-tip-covers.json (a press on Play reached from a hovered marker toggles Play at 1280 and 1600 px; the audit failed both)",
  "the self-test 'timeline tips (WP-06, CL-UX-04)'")
v("CL-UX-07", "fixed", "the timeline's 'Eyes' button kept on the phone layouts while a reading is on (body.reading-on); runtime-test.js (both phone layouts' rule)",
  "runtime-test.js (WP-05/06 block)", "no audit scenario reads it on a phone page; held by the dry run only")
v("CL-UX-13", "fixed", E+"interaction/s11-state-hypotheses.json (rail-right-button: a right press does not seek; touch-cancel-no-hover-scrub; the audit failed both)",
  "the self-test 'timeline (WP-06, CL-UX-13)'")
v("CL-UX-19", "fixed", E+"interaction/s6-panels-while-dragging.json (with '?' opened mid-drag the eye stays at [-60.83, 490.47, 61.98]; the audit's check still "
  "reads 'moved' because the orbit target's height is re-seated on the ground (y 0.52 to -1.13), no pan; after release nothing moves)",
  "the self-test 'map input (WP-06, CL-UX-19)'")
v("CL-UX-20", "fixed", "the self-test 'focus (WP-06, CL-UX-20)' (Layers hidden at a resize, focused and blurred: Play focused); "+E+"interaction/s7-resize-rotate.json "
  "(19 of 20 as at the audit: the one failure the rail and the dossier overlapping at 1600 px, unchanged)", "the self-test (wp56Checks)")
# ---------------------------------------------------------------- Stage 5: WP-07 (the audit's visibility runs made again; visibility/compare.txt)
VC = E+"visibility/compare.txt (tools/audit-post8/visibility/long-play.js and analyse.js on this build against the audit's tables)"
v("CL-MAP-01", "carried", VC+": Landscape with counters 08:30-11:30, the longest hidden by the layout 99.8 battle minutes (27.7 s) to 18.3 (5.7 s), 12:00-15:00 "
  "60 to 18.3, the day at 4x 119.8 to 30.0; share drawn 67.6% to 69.2%; the motion block's long runs on CI (run 43524457649: hybrid-long and hybrid-3600 "
  "18.33 battle minutes at worst); "+E+"chatgpt/extended-playback.log (ChatGPT's 3,600-frame protocol)", "thresholds.js MOTION.LONG (every formation in view "
  "hidden at most 30 battle minutes, in check:selftest and check:visual)", "in part: the gaps are bounded, the roadmap's other done-when, no formation under 50% "
  "over the long runs, is not met (08:30-11:30: 6 formations under half drawn, d'Hautpoul 41.5%, Walther 37.8%, the Imperial Guard cavalry 39.9%; the audit 7), as WP-07 "
  "recorded")
v("CL-MAP-02", "carried", VC+": the formations a live event names drawn while their event is live 59.0% to 76.4% (08:30-11:30), 66.2% to 77.0% (12:00-15:00), "
  "53.8% to 72.5% (the day at 4x)", "thresholds.js MOTION.LONG (EV_SHARE 0.70 in the desktop's two long runs)", "in part: the finding's own instance remains, the "
  "Russian Guard cavalry drawn 12.7% while 'Rapp's counter-charge breaks the Chevalier Guard' is live (the audit 0-16%); at the face-about Miloradovich 54.9% "
  "(the audit 0-40%) and the IV Column's Austrian wing 28.0%; on the phone the share fell, "
  "40.2% to 24.9%, accepted as measured by decision 304 (a)")
v("CL-MAP-07", "carried", VC+": the phone with counters 09:00-12:00, drawn 51.7% to 46.2%; Liechtenstein never drawn to 32.5%, its longest gap 90 to 23.3 battle "
  "minutes; 8 formations under half drawn (the audit 6)", "thresholds.js MOTION.LONG (phone-long: the 30-minute bar; its event-named share reported, not judged)",
  "in part: the gap is bounded; half the formation-frames are still not drawn on a phone")
v("CL-MAP-12", "fixed", "the self-test 'the corps and divisions (WP-07, CL-MAP-12)' on this build (CI run 43524457649: after motion from the divisions at 255 units "
  "the divisions kept; afresh at 255 the corps)", "the self-test (wp07Checks)")
v("CL-MAP-14", "kept", VC+": at rest after Play, formations hidden that a fresh view would draw: 08:30-11:30 Vandamme and Walther, 12:00-15:00 the Imperial "
  "headquarters and Saint-Hilaire, the phone the Allied headquarters (the audit: up to three)", "", "decisions 240 (a), 267 (a): kept as accepted")
v("CL-MAP-17", "kept", VC+": the Landscape 09:00-12:00, names drawn 89.4% to 88.4% of in-view frames, 230 to 260 hidden episodes, the longest 1.7 to 1.3 s",
  "", "kept as accepted by WP-07; the blinking is slightly more frequent than at the audit")
v("CL-TEST-02", "fixed", "the motion block's three long Play runs (tools/visual/motion.js LONG, judged by thresholds.js MOTION.LONG) in check:selftest and "
  "check:visual on this build (CI run 43524457649: hybrid-long 1,560 frames, hybrid-3600 3,600 frames, phone-long 1,508 frames, each with its longest gap "
  "in battle minutes); "+VC+" (the 90-frame benchmark still saturates at 4,033 ms; the long runs carry the measure)", "thresholds.js MOTION.LONG")
v("CL-TEST-14", "carried", "thresholds.js: the 16 motions' ceilings and MOTION.VIS still the builds' own counts (decisions 257 (b), 267 (a), 291 (a), 303 (a)); "
  "MOTION.LONG's 30-minute bar and EV_SHARE 0.70 the one absolute bar", "", "in part, as WP-07 recorded")
# ---------------------------------------------------------------- the tables
ROOT = __file__.rsplit("/tools/", 1)[0]
REG = list(csv.DictReader(open(ROOT + "/docs/audit-post8-evidence/register-export.csv")))
def rows():
    out = []
    for r in REG:
        i = r["CL"]; x = V.get(i)
        out.append({"id": i, "wp": r["work_package"], "sev": r["severity_CL"], "pri": r["priority_CL"], "kind": r["kind"], "chatgpt": r["chatgpt"],
                    "title": r["title"], "claimed": CLAIMED[i][0], "claimedBasis": CLAIMED[i][1],
                    "verdict": x["verdict"] if x else None, "evidence": x["evidence"] if x else "", "held": x["held"] if x else "", "note": x["note"] if x else ""})
    return out
def md(R):
    from collections import Counter
    L = []
    c = Counter(r["verdict"] for r in R)
    L.append("| verdict | findings | S1 | S2 | S3 | S4 |"); L.append("|---|---|---|---|---|---|")
    for vv in ("fixed", "kept", "carried"):
        L.append("| %s | %d | %s |" % (vv, c[vv], " | ".join(str(sum(1 for r in R if r["verdict"] == vv and r["sev"] == s)) for s in ("S1", "S2", "S3", "S4"))))
    L.append("| all | %d | %s |" % (len(R), " | ".join(str(sum(1 for r in R if r["sev"] == s)) for s in ("S1", "S2", "S3", "S4"))))
    L.append("")
    claimedVsVerdict = Counter((r["claimed"], r["verdict"]) for r in R)
    L.append("| claimed by the records | fixed | kept | carried |"); L.append("|---|---|---|---|")
    for cl in ("fixed", "partly", "kept", "deferred", "owner", "open"):
        L.append("| %s | %s |" % (cl, " | ".join(str(claimedVsVerdict[(cl, vv)]) for vv in ("fixed", "kept", "carried"))))
    L.append("")
    for vv in ("carried", "kept", "fixed"):
        L.append("### %s (%d)" % ({"fixed": "Fixed", "kept": "Kept", "carried": "Carried"}[vv], c[vv])); L.append("")
        L.append("| finding | sev | WP | title | evidence | held by | note |"); L.append("|---|---|---|---|---|---|---|")
        for r in sorted((r for r in R if r["verdict"] == vv), key=lambda r: (r["sev"], r["id"])):
            esc = lambda s: s.replace("|", "\\|")
            L.append("| %s | %s | %s | %s | %s | %s | %s |" % (r["id"] + (" (" + r["chatgpt"] + ")" if r["chatgpt"] else ""), r["sev"], r["wp"], esc(r["title"][:140]),
                                                       esc(r["evidence"]), esc(r["held"]), esc(r["note"])))
        L.append("")
    return "\n".join(L)
if __name__ == "__main__":
    R = rows()
    missing = [r["id"] for r in R if not r["verdict"]]
    if missing: print("no verdict yet:", len(missing), " ".join(missing))
    if "--json" in sys.argv: json.dump(R, open(sys.argv[sys.argv.index("--json") + 1], "w"), indent=1)
    if "--md" in sys.argv: open(sys.argv[sys.argv.index("--md") + 1], "w").write(md(R) + "\n")
    from collections import Counter
    print("verdicts:", dict(Counter(r["verdict"] for r in R if r["verdict"])))
