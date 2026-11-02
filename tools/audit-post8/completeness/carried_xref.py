#!/usr/bin/env python3
"""Completeness critic: map each carried item's references to area findings onto the register's CL ids (reads only).
Writes docs/audit-post8-evidence/completeness/carried-xref.json."""
import json, os, re
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
EV = os.path.join(ROOT, "docs", "audit-post8-evidence")
areas = {d: json.load(open(os.path.join(EV, d, "result.json"))) for d in sorted(os.listdir(EV))
         if os.path.isfile(os.path.join(EV, d, "result.json")) and d != "completeness"}
reg = json.load(open(os.path.join(EV, "register.json")))
m = {}
for e in reg["findings"]:
    for a, i in e.get("from", []) + e.get("also", []):
        m.setdefault((a, i), []).append(e["id"])
lab = {}  # TS-n, A11Y-n, V-Mn -> (area, idx)
for a, r in areas.items():
    for i, f in enumerate(r.get("findings", [])):
        t = f.get("title", "")
        mm = re.match(r"^(V-M\d+|TS-\d+|A11Y-\d+|IA-\d+|V-\d+): ", t)
        if mm:
            lab[mm.group(1)] = (a, i)
        if f.get("id"):
            lab[f["id"]] = (a, i)
c = json.load(open(os.path.join(EV, "records", "carried.json")))
AREAS = "|".join(sorted(areas, key=len, reverse=True))
pat = re.compile(r"\b(%s)(?: carried and)? findings? ([0-9][0-9 ,\-and]*)" % AREAS)
out = []
for x in c["register"]:
    txt = " ".join(str(x.get(k, "")) for k in ("current_evidence", "status", "item"))
    refs = set()
    for a, nums in pat.findall(txt):
        for part in re.split(r",|and", nums):
            part = part.strip()
            if not part:
                continue
            if "-" in part:
                lo, hi = part.split("-")[:2]
                if lo.strip().isdigit() and hi.strip().isdigit():
                    for n in range(int(lo), int(hi) + 1):
                        refs.add((a, n - 1))
            elif part.isdigit():
                refs.add((a, int(part) - 1))
    for L in re.findall(r"\b(V-M\d+|TS-\d+|A11Y-\d+)\b", txt):
        if L in lab:
            refs.add(lab[L])
    cl = sorted(set(sum((m.get(r, ["?%s#%d" % (r[0], r[1] + 1)]) for r in refs), [])))
    out.append({"id": x["id"], "status_class": x["status_class"], "status": x["status"], "item": x["item"][:160],
                "area_refs": ["%s #%d" % (a, i + 1) for a, i in sorted(refs)], "cl": cl,
                "cl_in_record": re.findall(r"CL-[A-Z]+-\d+", json.dumps(x))})
json.dump(out, open(os.path.join(EV, "completeness", "carried-xref.json"), "w"), indent=1, ensure_ascii=False)
for o in out:
    print(o["id"], o["status_class"], o["cl"] or "-", o["area_refs"])
