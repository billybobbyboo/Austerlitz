#!/usr/bin/env python3
"""The closing re-verification pass: every CL- finding's mentions in the final roadmap's CHANGELOG entries (Stage 1 to Stage 7, lines up to
the Stage 1 entry's end), with the short forms expanded ("CL-ROB-02, -04" and "CL-PERF-01 to -11"). Reads only.
python3 tools/closing/mentions.py [--json out.json]"""
import csv, json, re, sys
ROOT = __file__.rsplit("/tools/", 1)[0]
reg = list(csv.DictReader(open(ROOT + "/docs/audit-post8-evidence/register-export.csv")))
ids = [r["CL"] for r in reg]
lines = open(ROOT + "/CHANGELOG.md").read().split("\n")
end = next(i for i, l in enumerate(lines) if l.startswith("## ") and "Stage 8, device acceptance: decision 269" in l)
sect = None; hits = {i: [] for i in ids}
tok = re.compile(r"CL-([A-Z]+)-(\d+)((?:(?:,| and| or| to|,? and)\s*-\d+)*)")
for n, l in enumerate(lines[:end], 1):
    if l.startswith("## "): sect = l[3:].strip()
    for m in tok.finditer(l):
        g, a, rest = m.group(1), int(m.group(2)), m.group(3)
        nums = {a}; prev = a
        for mm in re.finditer(r"(,| and| or| to)\s*-(\d+)", rest):
            b = int(mm.group(2))
            if mm.group(1).strip() == "to": nums.update(range(prev, b + 1))
            else: nums.add(b)
            prev = b
        for k in sorted(nums):
            cid = "CL-%s-%02d" % (g, k)
            if cid in hits: hits[cid].append({"line": n, "section": sect, "text": l.strip()[:400]})
out = []
for r in reg:
    h = hits[r["CL"]]
    out.append({"id": r["CL"], "wp": r["work_package"], "sev": r["severity_CL"], "kind": r["kind"], "title": r["title"],
                "mentions": len(h), "sections": sorted({x["section"] for x in h}), "hits": h})
if "--json" in sys.argv: json.dump(out, open(sys.argv[sys.argv.index("--json") + 1], "w"), indent=1)
none = [o for o in out if not o["mentions"]]
print("findings %d; mentioned %d; never mentioned %d" % (len(out), len(out) - len(none), len(none)))
for o in none: print("  not mentioned:", o["id"], o["wp"], o["sev"], o["title"][:110])
