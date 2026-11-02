#!/usr/bin/env python3
"""Completeness critic: the curated crosswalk of the 57 carried items (records/carried.json) to the register's CL ids and owner questions,
with each item's verdict on its current status. The CL ids were derived by carried_xref.py from the items' own area references, then
corrected by hand where its parser missed a bare "finding N" or a TS-/A11Y-/V-M label (noted). Reads only; writes
docs/audit-post8-evidence/completeness/carried-crosswalk.json."""
import json, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
EV = os.path.join(ROOT, "docs", "audit-post8-evidence")
c = json.load(open(os.path.join(EV, "records", "carried.json")))
OK = "supported"
X = {  # id: (CL ids that apply, owner question, verdict, note)
 "C-01": ("CL-PERF-04 CL-PERF-05 CL-PERF-08 CL-PERF-09 CL-PERF-11 CL-PERF-12", "", "stale",
          "says 'perf-attribution area has left no result (... is empty)' and 'not attributed'; perf-attribution/result.json now exists and CL-PERF-12 attributes the excess (A-verdict.md, F-quality.md F.1). Status should read: accepted (268 (a)); attributed by this audit (CL-PERF-12)"),
 "C-02": ("CL-PERF-01 CL-PERF-03 CL-PERF-06", "Q278", OK, ""),
 "C-03": ("CL-PERF-02", "Q278", OK, ""),
 "C-04": ("CL-PERF-07 CL-PERF-10", "", OK, ""),
 "C-05": ("", "", "gap closed by this audit (code read)",
          "the record says the Layers panel was not checked; app.js:6684 (KEYS row 'f') is the only visitor path to the effects (setFXEnabled, app.js:3772); no Layers row, no text claims effects off is faster; a phone visitor without a keyboard cannot switch them. No defect; still undecided by the owner, with no question in section I"),
 "C-06": ("CL-MAP-01 CL-MAP-14 CL-TEST-02", "Q274", OK, ""),
 "C-07": ("CL-MAP-01 CL-MAP-02 CL-MAP-07", "Q274", OK, ""),
 "C-08": ("CL-TEST-14", "", OK, ""),
 "C-09": ("CL-VIS-01 CL-TEST-08", "", OK, ""),
 "C-10": ("CL-VIS-05", "", "supported; severity text stale", "cites visual-landscape finding 5 as S4/P3; the register now has CL-VIS-05 at S4/P4"),
 "C-11": ("", "Q280", OK, "uniform facings (colour); CL-VIS-03 is the blocks' orientation, a different sense of \"facing\" (corrected after comparing with resolution.py CARRIED_REFS)"),
 "C-12": ("", "Q281", "supported; no cross-reference", "no CL entry (none needed); the record should cite question 281"),
 "C-13": ("CL-HIS-04 CL-VIS-04", "", OK, "the castle's size itself is the set-aside geography #11 (decision 266 (a))"),
 "C-14": ("", "", "miss: no register entry",
          "status 'present' rests on records/castle-site.json (class 'track' at the site, 13 of 16 points at 25 m); no CL finding, no owner question, not in section G: register it (S4) or record why it needs none"),
 "C-15": ("", "Q282", "supported; no cross-reference", "the record should cite question 282 (its option (b) for the garden)"),
 "C-16": ("CL-VIS-02", "", OK, ""),
 "C-17": ("CL-VIS-06 CL-GEO-01", "Q282", OK, ""),
 "C-18": ("CL-MAP-18 CL-MAP-11", "", OK, ""),
 "C-19": ("CL-MAP-15", "", "supported; no owner question", "status 'open' (decision 255 left it open) but section I puts no question; WP-08 says 'reconsidered where decisions left them open'"),
 "C-20": ("CL-SIM-06", "", OK, ""),
 "C-21": ("CL-VIS-08", "", OK, ""),
 "C-22": ("CL-GEO-05", "", OK, ""),
 "C-23": ("", "", OK, "no CL needed (recorded, no action)"),
 "C-24": ("", "", OK, "records only; not recoverable"),
 "C-25": ("CL-PERF-02", "Q278", "supported; partly untested", "memory on a device and the crowns' hook's own cost have no CL or untested entry"),
 "C-26": ("CL-GEO-08 CL-HIS-04", "", OK, ""),
 "C-27": ("CL-GEO-10", "", OK, ""),
 "C-28": ("CL-MAP-01 CL-MAP-14 CL-TEST-02", "Q274", OK, ""),
 "C-29": ("CL-UX-08", "", OK, ""),
 "C-30": ("CL-GEO-10", "", OK, ""),
 "C-31": ("CL-GEO-10", "", OK, "parser missed the bare '(finding 10)'"),
 "C-32": ("CL-GEO-10", "", OK, ""),
 "C-33": ("CL-GEO-02", "", OK, ""),
 "C-34": ("CL-GEO-06 CL-HIS-10 CL-TEST-04", "", OK, ""),
 "C-35": ("", "", OK, "open and visible; no CL needed"),
 "C-36": ("CL-HIS-17", "", OK, ""),
 "C-37": ("", "", OK, "moot in the drawing; no CL needed"),
 "C-38": ("CL-GEO-07 CL-HIS-14", "", OK, ""),
 "C-39": ("CL-SRC-03 CL-SRC-01 CL-HIS-14 CL-GEO-06 CL-GEO-10", "Q271", OK, ""),
 "C-40": ("CL-HIS-08 CL-HIS-11", "", OK, ""),
 "C-41": ("CL-HIS-09", "", OK, ""),
 "C-42": ("", "", "unsupported: not examined",
          "the record's own evidence is 'Not re-examined in this audit'; no area examined the woods' re-plan where a wood changed (8J): report it as untested or check it"),
 "C-43": ("CL-MAP-08 CL-MAP-10", "", OK, ""),
 "C-44": ("CL-MAP-01 CL-MAP-02 CL-MAP-07 CL-MAP-14 CL-MAP-17 CL-TEST-02", "Q274", OK, ""),
 "C-45": ("CL-HIS-05 CL-VIS-01 CL-VIS-03 CL-VIS-04", "Q280 Q281", OK, ""),
 "C-46": ("CL-VIS-01 CL-VIS-05", "", OK, "parser missed the bare 'finding 5'"),
 "C-47": ("CL-VIS-04 CL-GEO-05 CL-GEO-08", "Q282", OK, ""),
 "C-48": ("CL-HIS-12 CL-TEST-12", "", OK, ""),
 "C-49": ("CL-TEST-13", "", OK, ""),
 "C-50": ("CL-SRC-01", "Q271", OK, ""),
 "C-51": ("CL-HIS-06", "", OK, ""),
 "C-52": ("CL-UX-05", "", OK, ""),
 "C-53": ("CL-HIS-16 CL-HIS-15", "", OK, "the unaccented forms are in CL-HIS-15"),
 "C-54": ("CL-REC-05", "", "miss: CL not cited", "the record cites a11y findings 1-13 but not CL-REC-05, the register's entry for this very item"),
 "C-55": ("CL-REC-05", "", "miss: CL not cited", "CL-REC-05 is the register's entry for decision 189's missing results; the record cites none"),
 "C-56": ("", "", "miss: no register entry",
          "italics synthesized (fonts.css: three faces, font-style normal) and Safari's metric overrides untested; no CL, no untested entry, not in C.3"),
 "C-57": ("CL-UX-06", "", OK, ""),
}
out = []
for x in c["register"]:
    cl, q, v, n = X[x["id"]]
    out.append({"id": x["id"], "status_class": x["status_class"], "status": x["status"], "cl": cl.split(), "question": q, "verdict": v,
                "note": n, "cl_in_record": []})
assert len(out) == 57
json.dump(out, open(os.path.join(EV, "completeness", "carried-crosswalk.json"), "w"), indent=1, ensure_ascii=False)
from collections import Counter
print(Counter(o["verdict"] for o in out))

# the comparison with the auditor's C.4 (tools/audit-post8/resolution.py CARRIED_REFS, read by report.py's C.4), when present
try:
    import re, sys
    sys.path.insert(0, os.path.join(ROOT, "tools", "audit-post8"))
    from resolution import CARRIED_REFS
    cmp = []
    for o in out:
        ref = CARRIED_REFS.get(o["id"], "")
        have = set(re.findall(r"CL-[A-Z]+-\d+", ref))
        cmp.append({"id": o["id"], "c4_refs": ref, "missing_in_c4": sorted(set(o["cl"]) - have), "extra_in_c4": sorted(have - set(o["cl"]))})
    json.dump(cmp, open(os.path.join(EV, "completeness", "c4-compare.json"), "w"), indent=1, ensure_ascii=False)
    print("c4-compare.json:", sum(1 for x in cmp if x["missing_in_c4"]), "items with a CL the crosswalk has and C.4 lacks")
except ImportError:
    pass
