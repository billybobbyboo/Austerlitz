#!/usr/bin/env python3
"""The closing re-verification pass: what the final roadmap's records claim for each of the 158 findings, before re-verification.
Each entry: the claimed outcome and its basis in the records (CHANGELOG.md's entries since Stage 1 of docs/ROADMAP_FINAL_AUDIT.md, the
stages' questions files). The outcomes:
  fixed    the work package says it changed what the finding names (to be re-verified by the audits' probes or the check it added)
  partly   part of the remedy done, the rest stated as handed on
  kept     left as it is by an owner decision or as an accepted compromise (to be re-measured, not fixed)
  deferred deferred with reasons by its work package
  owner    needs a run only the owner can make (a device, an assistive-technology session)
  open     never taken up by name in the records (WP-11's findings, the pass "alongside every stage")
python3 tools/closing/claimed.py [--json out.json]   Reads only."""
import csv, json, sys
C = {}
def put(ids, outcome, basis):
    for i in ids.split():
        assert i not in C, i
        C[i] = (outcome, basis)
# Stage 1 (CHANGELOG "Stage 1: WP-00, WP-04a, WP-13")
put("CL-ROB-01", "fixed", "WP-00: ?src= accepted only as a same-origin http(s) path")
put("CL-ROB-06", "kept", "WP-00: the page frozen inside the archives left as it is, decision 270 (b)")
put("CL-PERF-16", "fixed", "WP-13: phone-rule.js refuses an incomplete report")
put("CL-REC-01 CL-REC-02", "fixed", "WP-13: README.md links the map, states reconstruction and evidence, cdnjs")
put("CL-REC-03 CL-REC-04 CL-REC-08", "fixed", "WP-13: stale status lines, the carried checklist, CLAUDE.md's table and heading")
put("CL-REC-09", "fixed", "WP-13: build.py prints bytes, characters beside them")
put("CL-REC-10", "fixed", "WP-13: the glare figure annotated (STAGE8_SPEC section 26)")
put("CL-ROB-03", "deferred", "WP-13: splitting CLAUDE.md needs the owner's word")
put("CL-ROB-08", "deferred", "WP-13: the licence, owner question 279")
put("CL-ROB-13", "deferred", "WP-13: the archive images' terms")
put("CL-ROB-09", "kept", "WP-13: the shipped self-test kept, question 283 (a)")
# WP-04a, WP-04b (Stage 1, Stage 4)
put("CL-GEO-01", "fixed", "WP-04a disclosure; WP-04b refit between anchors (decision 273 (a)), within terrain-test's tolerance lines")
put("CL-GEO-03 CL-GEO-04", "partly", "WP-04b: labelled schematic (the quick remedy); re-tracing the streams handed on")
put("CL-GEO-05", "fixed", "WP-04b: the villages on their own ground, no marsh at their centres")
put("CL-GEO-07", "fixed", "WP-04b: Krug at the Kruh tract")
put("CL-GEO-11", "fixed", "WP-04b: the castle's own ground (CASTLE_GROUND)")
# Stage 2: WP-01, WP-02
put("CL-HIS-01 CL-HIS-06 CL-HIS-12 CL-HIS-14 CL-HIS-15 CL-SRC-03 CL-SRC-09 CL-GEO-02 CL-GEO-06 CL-GEO-08 CL-GEO-09 CL-GEO-10",
    "fixed", "WP-01: a data task (claims, disputed hours, the Command tab, open questions told as open, smaller fixes)")
put("CL-SRC-01 CL-SRC-02 CL-SRC-04 CL-SRC-05 CL-SRC-06 CL-SRC-07", "fixed", "WP-02: each figure attributed or labelled a derivation; headline strengths tagged")
put("CL-SRC-08", "partly", "WP-02: most credits; three left to later passes (the 30th Bulletin, Fieffe's locator, Viskovatov pp. 229-230)")
# Stage 3: WP-05, WP-06
put("CL-SIM-01 CL-SIM-02 CL-SIM-03 CL-SIM-04 CL-SIM-05 CL-SIM-06 CL-SIM-07 CL-SIM-08 CL-UX-07 CL-UX-14", "fixed", "WP-05 (CL-SIM-05 extended by decision 312 (a))")
put("CL-UX-02 CL-UX-03 CL-UX-04 CL-UX-13 CL-UX-19 CL-UX-20", "fixed", "WP-06 (CL-UX-04 by precedence: the tip yields to a control under the pointer)")
# Stage 4: WP-03, WP-15
put("CL-HIS-02 CL-HIS-03 CL-HIS-04 CL-HIS-05 CL-HIS-07 CL-HIS-08 CL-HIS-09 CL-HIS-10 CL-HIS-11 CL-HIS-13 CL-REC-06", "fixed",
    "WP-03: a data task (decisions 272 (a), 285 (a)-288 (a), 290 (a))")
put("CL-HIS-16 CL-HIS-17", "kept", "WP-03: the accepted compromises kept as they are")
put("CL-SRC-10", "partly", "WP-15: the first batch only (the prominent claims); later batches handed on")
# Stage 5: WP-07, WP-08
put("CL-MAP-01 CL-MAP-02 CL-MAP-07 CL-MAP-12 CL-TEST-02", "fixed", "WP-07: aging and the event-named rise, the band, the long-gap measures")
put("CL-TEST-14", "partly", "WP-07: an absolute long-gap bar (MOTION.LONG, decision 299 (D)); the 16 motions' ceilings still the build's counts")
put("CL-MAP-14 CL-MAP-17", "kept", "WP-07: measured and kept as accepted")
put("CL-MAP-03 CL-MAP-04 CL-MAP-06 CL-MAP-08 CL-MAP-10 CL-MAP-13 CL-MAP-16", "fixed", "WP-08's furniture (decisions 296-298)")
put("CL-MAP-09 CL-MAP-11 CL-VIS-11", "fixed", "WP-08's lettering and landmarks")
put("CL-MAP-05", "kept", "WP-08: the paper map's lettering as it is, decision 302 (b)")
put("CL-MAP-15", "kept", "WP-08: the wall of names as decided, decision 284 (b), re-measured")
put("CL-MAP-18", "kept", "WP-08: the Littawa dropped at 1280 px, kept as accepted (section 22.4)")
put("CL-MAP-19 CL-MAP-20", "kept", "WP-08: decision 298 (the paper map's arrows uncapped; no single 1805 naming convention)")
# Stage 6: WP-09, WP-10
put("CL-UX-01 CL-UX-09 CL-UX-18", "fixed", "WP-09 (1 of 3): reflow, short screens, forced colours, the grip's drag")
put("CL-UX-08 CL-UX-10 CL-UX-11 CL-UX-12 CL-UX-15 CL-UX-21", "fixed", "WP-09 (2 of 3): names, focus, caveats, the first card")
put("CL-UX-05 CL-UX-16", "fixed", "WP-09 (3 of 3): the words a visitor is told (decision 310)")
put("CL-UX-17", "kept", "decision 311 (a): t-small kept at 11.5 px")
put("CL-REC-05", "partly", "Stage 6 records: the second reading's wording corrected; the screen-reader session's results are the owner's (sr-session.md)")
put("CL-UX-06 CL-UX-22", "owner", "the owner's device script (docs/final-stage6-evidence/sr-session.md, D1-D4, S1-S3)")
put("CL-VIS-01 CL-VIS-02", "fixed", "WP-10 (part 1): figures on the mere's ice, no trees on it")
put("CL-VIS-03 CL-VIS-05 CL-VIS-07 CL-VIS-09", "fixed", "WP-10 (part 2): facings, streams' glint, the camp, the tier on a resize")
put("CL-VIS-08", "fixed", "WP-10 (part 3): the crowns near the eye (decision 308)")
put("CL-VIS-04", "kept", "WP-10 (part 3): decision 307 (c), measured; the sources sheet says the blocks are drawn at their frontage")
put("CL-VIS-06", "fixed", "WP-08's lettering (decision 282 (a)), re-verified by WP-10 part 1")
put("CL-VIS-10", "kept", "decision 309 (a): decision 265 (a)'s bounded convention kept")
# Stage 7: WP-14, WP-16, WP-12
put("CL-ROB-02 CL-ROB-04 CL-ROB-10 CL-ROB-11", "fixed", "WP-14 (decisions 317 (a), 320 (a))")
put("CL-ROB-05", "kept", "WP-14: the offline dependence stated in README.md (an accepted compromise)")
put("CL-ROB-12", "kept", "decision 318 (b): recorded, not changed")
put("CL-PERF-12 CL-PERF-13 CL-PERF-14", "fixed", "WP-16 (decision 321 (a)), pixel- and shadow-identical")
put("CL-PERF-15", "kept", "decisions 322 (b), 324 (a): accepted as measured")
put("CL-PERF-01 CL-PERF-03 CL-PERF-04 CL-PERF-05 CL-PERF-07 CL-PERF-08 CL-PERF-09", "fixed", "WP-12: STAGE8_SPEC section 27; the route's version 4")
put("CL-PERF-06", "fixed", "WP-12: the ordinary route on the phone, 13 November 2026 (section 27.2, decision 324 (a))")
put("CL-PERF-10", "kept", "decision 323 (b): recorded")
put("CL-PERF-11", "kept", "WP-12: section 8.5's rule unchanged, the missed-refresh share reported beside it")
put("CL-PERF-02", "owner", "the integrated-GPU run: decision 278, at the owner's convenience")
# WP-11 (alongside): never taken up by name
put("CL-TEST-01 CL-TEST-03 CL-TEST-04 CL-TEST-05 CL-TEST-06 CL-TEST-07 CL-TEST-08 CL-TEST-09 CL-TEST-10 CL-TEST-11 CL-TEST-12 CL-TEST-13 "
    "CL-TEST-15 CL-TEST-16 CL-TEST-17 CL-TEST-18 CL-TEST-19 CL-TEST-20 CL-TEST-21 CL-ROB-07", "open", "WP-11: not taken up by name in the records")
ROOT = __file__.rsplit("/tools/", 1)[0]
reg = list(csv.DictReader(open(ROOT + "/docs/audit-post8-evidence/register-export.csv")))
ids = [r["CL"] for r in reg]
missing = [i for i in ids if i not in C]; extra = [i for i in C if i not in ids]
assert not missing and not extra, (missing, extra)
if __name__ == "__main__":
    out = [{"id": r["CL"], "wp": r["work_package"], "sev": r["severity_CL"], "kind": r["kind"], "title": r["title"], "claimed": C[r["CL"]][0],
            "basis": C[r["CL"]][1]} for r in reg]
    if "--json" in sys.argv: json.dump(out, open(sys.argv[sys.argv.index("--json") + 1], "w"), indent=1)
    from collections import Counter
    print("158 findings:", dict(Counter(o["claimed"] for o in out)))
    for k in ("S1", "S2"):
        print(k, dict(Counter(o["claimed"] for o in out if o["sev"] == k)))
