#!/usr/bin/env python3
"""Completeness critic: writes docs/audit-post8-evidence/completeness/result.json (the area's structured result). Reads only, but for that file."""
import json, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
OUT = os.path.join(ROOT, "docs", "audit-post8-evidence", "completeness", "result.json")
E = "docs/audit-post8-evidence/completeness/README.md"
def cov(item, method, result, evidence=E):
    return {"item": item, "method": method, "result": result, "evidence": evidence}
R = {
 "area": "completeness",
 "scope_summary": "The audit's completeness critic (not a re-audit): the owner's twelve requirements against the report's parts and generator, the 57 carried items' statuses and their CL cross-references (the records area's register and the report's C.4), parts of the application no area examined (checked by code reading; no browser run), report-part statements against their evidence, and register.json's internal consistency. Read 15:20-16:10 UTC on 2 November 2026 while the auditor was still editing the register and the parts; each result names the state read.",
 "coverage": [
  cov("req (1) baseline and subsystem inventory", "read 00-head.md, C-intro.md C.0; wc -l of the 16 files at 43e3e5b", "holds (C.0's line counts all exact); gap: the records read are listed only in records/README.md and baseline/README.md, not in the report"),
  cov("req (2) whole application, kinds apart, 'owner acceptance is not a technical pass'", "read 00-head.md, B-intro.md", "holds; gap: the parts of section (c) appear nowhere as untested"),
  cov("req (3) historical and geographic integrity, ledgers", "E.1 counts recomputed from the four ledgers' verdicts; claims-count.json", "holds exactly (42: 14/17/7/2/2; 26: 10/4/12; 29: 17/5/3/4; 20: 14/5/1; claims 148/75/481 of 704)"),
  cov("req (4) simulation and state", "state/README.md:49, interaction/README.md s1-s14", "holds (766 checks, 215,072 samples, 14 scenarios)"),
  cov("req (5) visual quality from rendered output and motion", "visual-landscape, visual-maps, visibility READMEs", "holds for stills and label motion; gap: smoke judged by no area (all captures with smoke motion off, visual-landscape/README.md:14,121)"),
  cov("req (6) interaction, accessibility, first use, emulation distinguished", "00-head.md, D.2, a11y and interaction READMEs", "holds; gaps: reduced motion's camera inconclusive (a11y/README.md:106-107); the opening's played stretches cut short (interaction/README.md:216)"),
  cov("req (7) performance", "F.1 against perf/README.md; tools/step6/perf-route.js:159", "holds (120-124 vs 139-140; 40.8/43.35; 18.15%/8.6%; long frame max(1.5R, 25 ms); like-for-like stated; no thermal claim; no generalisation)"),
  cov("req (8) every carried issue given a status", "records/carried.json; report.py:180-193 C.4 and resolution.py:189 CARRIED_REFS (added about 15:50 UTC)", "holds since C.4 was added, with gaps: C-01's printed status stale ('not attributed' beside CL-PERF-12); 23 rows lack a CL their own evidence names (c4-compare.json); C-14, C-56 no register entry; C-42 not examined; carried.json cites no CL (57 of 57)", "docs/audit-post8-evidence/completeness/c4-compare.json"),
  cov("req (9) tests and evidence quality", "D.1 rows against checks/*.txt; D.4 against tests/mutations.json", "holds (chronology 70/66/4, 155, 118 by 73 of 75, 37; contrast 8 start-up cases, 193 of 248; selftest 317/317; report pass; mutations 33/30/3, 11 change-detector-only)"),
  cov("req (10) robustness, security, dependencies, maintainability", "robustness/result.json and README.md", "findings present; gap: robustness/result.json has empty coverage, experiments and not_checked, so L.1, L.2 and C.3 have no robustness row and its README's 'Not checked' (the archive tiles' terms, README.md:53-54) reaches no section"),
  cov("req (11) deliverables A-J", "report-parts sizes; report.py:46 placeholders", "holds (A and J filled during the session)"),
  cov("req (12) every conclusion connected to evidence", "the statements below", "mostly; the corrections below"),
  cov("report claim: C-intro.md:35 '(C.4)'", "checked against report.py", "holds since about 15:50 UTC (report.py:180-193); C.4 is printed before C.2, so the order reads C.0, C.1, C.4, C.2, C.3"),
  cov("report claim: C-intro.md C.1 counts (766, 215,072, 14 scenarios, 100 + 74 captures, 21 runs, 349 rows, 42/29/26 claims, 33/30/3)", "checked against the areas' READMEs and results", "holds"),
  cov("report claim: C.1 visual row's 'what remains outside'", "checked against visual-landscape/README.md:14,121, interaction/README.md:216", "correction: add smoke not judged, the opening's played stretches not run in real time, the claims index and the Dress and village dossier sections examined by no area"),
  cov("report claim: D-intro.md D.1 rows", "checked against checks/check-*.txt", "holds"),
  cov("report claim: D.2, A-verdict.md, J-response.md 'every finding went to a skeptic' / 'each verified adversarially'", "checked against register.json at 15:58 UTC", "correction: CL-PERF-12, -13, -14 have no verdict (146 entries: 114 CONFIRMED, 29 WEAKENED, 3 none)"),
  cov("report claim: E-ledger.md E.1 counts and the claims' 148/75/481", "checked against the ledgers and records/claims-count.json", "holds"),
  cov("report claim: E-ledger.md:41 'the earlier fix G-3 ... does not hold'", "checked against records/README.md:16,61, history/result.json:62, CL-REC-06", "correction: G-3 was never taken up (an open prior finding, not a failed fix); history also found H-7 and H-19 partial, which E.2 omits"),
  cov("report claim: E.2 geography 'the 8J and 8K corrections where their sources put them'; F row 1 'the 8J and 8K re-plots sit where their sources put them'", "checked against CL-GEO-08, CL-HIS-04", "correction: the data do; the drawn Pratzen church stands 161 m from its read site (CL-GEO-08) and Legrand's re-plotted leg crosses the castle (CL-HIS-04)"),
  cov("report claim: F row 2 'Every change since the last audit is recorded'", "checked against CL-REC-03, CL-PERF-04, CL-REC-04", "correction: not established; supported narrower: every data change is listed in CHANGELOG.md with check:data's reference moved (139/139)"),
  cov("report claim: F row 4 'Seeks by four paths give identical states'", "checked against CL-SIM-06", "correction: identical positions and statuses; the reading depends on the path (CL-SIM-06)"),
  cov("report claim: F rows 5 and robustness, A-verdict 'Prolonged use grows nothing' / 'No growth in prolonged use'", "checked against CL-ROB-04", "correction: except across context restores (2.6-4 MB of heap and a dispose listener per geometry and texture kept each time)"),
  cov("report claim: F cartographic row and A-verdict.md:37 'No key below 1080 px'", "checked against register.json CL-MAP-03 (WEAKENED title)", "correction: no key between 720 and 1079 px or on a phone held upright; Watch, Clean and a phone held landscape hide it by decision"),
  cov("report claim: F records row 'The carried register is complete enough to answer every item (57 items, C.4)'", "checked against carried.json, C.4", "correction: it answers every item, but C-01's status is stale, C-14 and C-56 have no register entry, C-42 rests on no examination, 23 rows lack a CL their own evidence names"),
  cov("report claim: F-quality.md:26 and A-verdict 'decisions 239-269 ... verified as implemented' / 'implemented as the owner decided'", "grep of the areas' READMEs and results for each decision 239-266", "correction: no per-decision ledger; most decisions are examined by content, 252-254, 256 and 258 only through the passing checks and the records; say so or add a ledger"),
  cov("report claim: G-roadmap.md WP-12 'CL-PERF-01 to -11'", "checked against register.json work_package", "correction: the register puts CL-PERF-12, -13, -14 in WP-12 too (G.2 and the generated G.3 disagree)"),
  cov("report claim: G 'before calling the map finished' contains every P1", "checked against register.json", "holds (CL-ROB-01, CL-SRC-01, CL-GEO-01 are the only P1); WP-00 to WP-14's lists match the register's work_package except WP-12"),
  cov("report claim: H-merge.md H.4 what is handed to the merge", "checked against records/", "correction: add the carried register (57, with CL ids) and the prior audit's 75 findings' status (records/prior-findings.json), neither handed over nor summarised in the report"),
  cov("report claim: I-owner.md Q272 'where nothing in the data places the formation'", "checked against CL-HIS-02's verification (WEAKENED)", "correction: the data place it; what is missing is a reading of its own for that place (44 unreviewed carried grades, not wrong ones)"),
  cov("report claim: I-owner.md Q271 'Six figures'", "checked against sources-oob finding 1's evidence", "holds counted by figure (seven statements; 4,300 in c_iii and the theme)"),
  cov("report claim: I-owner.md Q274 'Decision 267 (a) accepted ... its 4,033 ms'", "checked against docs/STAGE8_SPEC.md:5037,5307", "holds in substance: 267 (a) kept the 4,033 ms baseline set in 8K; 'kept' is exact"),
  cov("report claim: I-owner.md Q280-Q283", "checked against C-11, C-12, C-15, C-17, CL-ROB-09", "holds"),
  cov("report claim: B-intro.md:4 set-aside results 'reported in section C'", "checked against C-intro.md and report.py", "correction: no section C row reports geography #11 or sources-oob #9; B names them itself"),
  cov("register: CL-REC-07", "id sequence of register.json", "missing from the numbering with no record of withdrawal; no entry carries REFUTED or DUPLICATE though B describes both"),
  cov("register: Krug's place", "CL-GEO-07 vs CL-HIS-14", "graded twice: S3/P3 WP-04 and S4/P4 WP-01; CL-HIS-14 cross-references, CL-GEO-07 has no note back; one severity for Krug, or drop Krug from CL-HIS-14"),
  cov("register: other overlaps (CL-HIS-04/-10/CL-VIS-04, CL-HIS-10/CL-TEST-04, CL-SRC-03/CL-HIS-14, CL-UX-03's merge)", "notes and from/also lists", "consistent: each cross-referenced or its merge noted"),
  cov("unexamined parts: tour, Plans, Clean, day-track, eye level, Command, Order of battle, Watch caption, phone Layers and Menu", "grep of every area's README and result", "covered (sampled to measured)"),
  cov("unexamined parts: reduced motion across sequences", "code read app.js:556, 592-596, 5869, 9102, 9139", "partial in a11y; no defect found by code: ambient frames, fades, the gait and tweens stop under RM; smoke's sway uses the wall clock but draws only with another frame"),
  cov("unexamined parts: claims index, smoke, the opening's played stretches, the Dress and village dossier sections, the woods' re-plan", "grep of every area's README and result", "no area: findings 1 and 2"),
  cov("carried C-05 (effects off on the phone; what the Layers panel says)", "code read app.js:6684, 3772", "closed: the F key is the only visitor path; no Layers row and no claim of speed; no defect"),
 ],
 "findings": [
  {"title": "Parts of the application no area examined: smoke, the opening's played stretches in real time, reduced motion across sequences with frames drawn, the sources sheet's claims index, the dossier's Dress section and the village dossiers, and the woods' re-plan where a wood changed",
   "category": "untested", "severity": "S4", "priority": "P3", "subsystem": "the 3D picture (smoke, woods), the opening, reduced motion, the sources sheet, the dossiers",
   "user_impact": "None known; these paths are held only by the required checks (the self-test's smoke, played-stretch, reduced-motion, 6C and 8G dossier checks; check:visual's smoke share), so a fault a check cannot see there would be outside the audit",
   "status": "confirmed by search (grep of every area's README and result.json); not probed", "origin": "inherited (smoke 4E, the opening 7C-7D, reduced motion step 3, the index 4b) and new-regression (the village dossiers 8G, the woods' re-plan 8J)",
   "refs": ["visual-landscape/README.md:14,121", "interaction/README.md:216", "a11y/README.md:106-107", "app.js:8648-8673", "records/carried.json C-42", "tools/visual/thresholds.js:226"],
   "evidence": "No area's README or result names the claims index, the Dress section or the village dossiers; every landscape capture had smoke motion off; the played stretches were cut short by 'Next again'; reduced motion's camera samples were inconclusive (no frame drawn in 3 s); C-42's status says 'Not re-examined in this audit'.",
   "expected": "Each part examined by at least one area, or listed in C.3 as not checked.",
   "observed": "Examined by none; listed in no C.3 line.",
   "remedy": "List them in C.3 as not checked (cheapest), or run one bounded probe each on a visitor's page: the smoke at 09:00-10:00 in Play, one played stretch, reduced motion through the opening and a tour stop, the sources sheet's index read against narrative.js, a village dossier."},
  {"title": "The claims index counts every claimed kind but not the unchecked: 481 of 704 statements are 'Every other statement', with no number",
   "category": "optional-improvement", "severity": "S4", "priority": "P4", "subsystem": "the sources sheet's index of claims (claimsIndex)",
   "user_impact": "A reader sees each kind with its count (63 attributed, 65 disputed, 12 interpretation, 6 uncertain, 2 derived) and the classes' counts, but not that about two thirds of the narrative statements are not yet checked",
   "status": "confirmed by code reading (not rendered)", "origin": "inherited (roadmap step 4b part B, decision 187, as built)",
   "refs": ["app.js:8664", "app.js:8665", "app.js:8671", "app.js:8596-8599", "docs/audit-post8-evidence/records/claims-count.json"],
   "evidence": "app.js:8664 appends '(N statements)' to each claimed kind; :8665 counts each class; :8671 writes 'Not yet checked: ... Every other statement.' with no count; the design comment (:8598) says '\"Not yet checked\" said of the rest'. claims-count.json: 704 statements, 148 own claims, 75 by class, 481 unchecked.",
   "expected": "The index gives the unchecked count beside the others, so the share of unchecked statements is as visible as the checked ones (CLAUDE.md priority 1).",
   "observed": "No count for the largest group.",
   "remedy": "Append the count ('481 statements') to the unchecked line from the same tally (presentation only; runtime-test.js's index counts extended)."},
  {"title": "The terms of use of about 460 third-party archive images that Pages publishes (the Moravian Land Archive's cadastre tiles and 8G's cadastre sheets) were not checked, and the gap reaches no section of the report",
   "category": "untested", "severity": "S4", "priority": "P3", "subsystem": "the published repository (GitHub Pages), docs/stage8-evidence/",
   "user_impact": "Unknown: if the archive's terms forbid republication, the public site redistributes its images",
   "status": "confirmed by search (git ls-files docs | grep -iE 'mza|cadast|tile': 463 files); terms not read", "origin": "new-regression (evidence committed in Stage 8, 8G and 8H)",
   "refs": ["docs/audit-post8-evidence/robustness/README.md:53-54", "docs/stage8-evidence/8h/geo/raw/mza/", "docs/stage8-evidence/8g/cadastre/", "CL-REC-01 (Pages serves the repository; its root page is README.md)"],
   "evidence": "robustness/README.md:53-54: 'Not checked: the terms of use of the ~450 Moravian Land Archive (MZA) cadastre tiles and other third-party material under docs/ that Pages publishes; no terms are recorded beside them'. robustness/result.json's not_checked is empty, so C.3 omits it; no CL entry names it.",
   "expected": "The archive's terms read and recorded beside the files, or the files kept out of the published site.",
   "observed": "No terms recorded; the gap is in one area README only.",
   "remedy": "Read the archive's terms (the owner's question 270 on what Pages publishes covers the remedy: publish only the product, or exclude the raw archive images)."}
 ],
 "experiments": [
  {"command": "python3 tools/audit-post8/completeness/dump.py reg|areas|map|cov|nc", "environment": "the container, python 3.13, reads only", "outcome": "146 register entries; every area finding placed (0 UNPLACED); robustness/result.json has 0 coverage, 0 experiments, 0 not_checked rows", "evidence_path": "tools/audit-post8/completeness/dump.py", "limitations": "register.json was being regenerated during the session; dumps are of 15:20-15:58 UTC"},
  {"command": "python3 tools/audit-post8/completeness/carried_xref.py", "environment": "same", "outcome": "the carried items' own area references mapped to CL ids; cl_in_record empty for 57 of 57", "evidence_path": "docs/audit-post8-evidence/completeness/carried-xref.json", "limitations": "regex parse; two bare 'finding N' references missed and corrected by hand in the crosswalk; C-25's 'findings 1-8' over-read"},
  {"command": "python3 tools/audit-post8/completeness/carried_crosswalk.py", "environment": "same; imports tools/audit-post8/resolution.py CARRIED_REFS", "outcome": "45 supported, 12 with a gap or miss; 23 C.4 rows lack a CL the item's own evidence names", "evidence_path": "docs/audit-post8-evidence/completeness/carried-crosswalk.json, c4-compare.json", "limitations": "the curated CL lists are this critic's judgement of 'applies'; C.4 was being written at the time"},
  {"command": "for f in shell.html ... app.js; git show 43e3e5b:$f | wc -l", "environment": "git", "outcome": "C.0's 16 line counts all exact", "evidence_path": "README.md (a)", "limitations": "none"},
  {"command": "grep of every area's README.md and result.json for the candidate parts and for decisions 239-266", "environment": "ripgrep/grep", "outcome": "claims index, smoke, played stretches, Dress and village dossiers: no area; decisions 252-254, 256, 258 named by no area's examination", "evidence_path": "README.md (c), (d)", "limitations": "a part examined without its name would be missed by a keyword search"}
 ],
 "carried_status": [
  {"item": "all 57 (records/carried.json)", "status": "statuses present; C.4 (report.py:180-193) places them since about 15:50 UTC; carried.json cites no CL", "evidence": "carried-xref.json"},
  {"item": "C-01 desktop CPU excess (268 (a))", "status": "stale: 'not attributed' and 'perf-attribution has left no result'; CL-PERF-12 attributes it", "evidence": "perf-attribution/result.json; A-verdict.md; F.1"},
  {"item": "C-05 effects off on the phone", "status": "closed by code read: the F key (app.js:6684) is the only path; no Layers text; no defect; owner matter, no question", "evidence": "app.js:6684, 3772"},
  {"item": "C-06, C-07, C-09, C-39, C-40, C-44, C-45, C-47, C-48, C-51, C-53", "status": "C.4 omits a CL the item's own evidence names (MAP-14; MAP-02; TEST-08; GEO-06, GEO-10, HIS-14, SRC-01; HIS-11; MAP-02, -07, -14, TEST-02; HIS-05, VIS-01; GEO-08, GEO-05; HIS-12; HIS-06; HIS-15)", "evidence": "c4-compare.json"},
  {"item": "C-10 the ice under a low sun", "status": "severity text stale (CL-VIS-05 S4/P4, not S4/P3)", "evidence": "register.json"},
  {"item": "C-14 the castle's site on the track class", "status": "miss: no register entry, no question, not in G", "evidence": "records/castle-site.json"},
  {"item": "C-19 the low views' wall of names", "status": "open (decision 255) with no owner question", "evidence": "I-owner.md"},
  {"item": "C-42 the woods re-planned where a wood changed", "status": "unsupported: not examined", "evidence": "carried.json C-42; finding 1"},
  {"item": "C-54, C-55 the owner's-word completions", "status": "C.4 cites CL-REC-05 (holds); carried.json does not", "evidence": "resolution.py CARRIED_REFS"},
  {"item": "C-56 Safari metrics, synthesized italics", "status": "miss: no register or untested entry", "evidence": "fonts.css (three faces, normal)"}
 ],
 "not_checked": [
  "No browser was run: the unexamined parts were found by search and code reading, not probed",
  "D.2a's threshold history and the verifiers' reports were not re-read",
  "Whether each owner decision 239-269 is implemented (only that no ledger shows it)",
  "The parts and register were changing during the session; statements were judged as read 15:20-16:10 UTC",
  "The generated report itself was read only where a part's claim needed it"
 ],
 "strengths": [
  "The report's numbers recompute exactly from the areas' evidence wherever checked (C.0, C.1, D.1, E.1, F.1, D.4)",
  "Every area finding is placed in the register; every P1 is in the 'before finished' packages",
  "C.4 was added during this session and answers all 57 carried items"
 ]
}
json.dump(R, open(OUT, "w"), indent=1, ensure_ascii=False)
print("wrote", OUT, len(json.dumps(R)), "bytes;", len(R["coverage"]), "coverage rows,", len(R["findings"]), "findings")
