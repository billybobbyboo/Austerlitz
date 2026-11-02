#!/usr/bin/env python3
"""Completeness critic: compact dumps of the register and the areas' results (audit tooling; reads only)."""
import json, os, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
EV = os.path.join(ROOT, "docs", "audit-post8-evidence")
areas = {}
for d in sorted(os.listdir(EV)):
    f = os.path.join(EV, d, "result.json")
    if os.path.isfile(f) and d != "completeness":
        areas[d] = json.load(open(f))
reg = json.load(open(os.path.join(EV, "register.json")))
what = sys.argv[1] if len(sys.argv) > 1 else "reg"
if what == "reg":
    for e in reg["findings"]:
        b = {}
        if e.get("from"):
            a, i = e["from"][0]; b = dict(areas[a]["findings"][i])
        b.update(e.get("own") or {}); b.update(e.get("override") or {})
        print("%s|%s|%s|%s|%s|%s|%s|from=%s also=%s|%s" % (e["id"], b.get("severity"), b.get("priority"), b.get("category"), b.get("origin"),
              b.get("work_package", ""), (e.get("verify") or {}).get("verdict", ""), e.get("from"), e.get("also"), (b.get("title") or "")[:150]))
    print("set_aside", reg.get("set_aside"))
elif what == "areas":
    for a, r in areas.items():
        print(a, "findings", len(r.get("findings", [])), "coverage", len(r.get("coverage", [])), "exp", len(r.get("experiments", [])),
              "nc", len(r.get("not_checked", [])), "ledger", len(r.get("ledger", []) or []), "carried", len(r.get("carried_status", []) or []))
elif what == "nc":
    for a, r in areas.items():
        for x in r.get("not_checked", []):
            print(a, "|", str(x)[:260])
elif what == "cov":
    for a, r in areas.items():
        for c in r.get("coverage", []):
            print(a, "|", (c.get("item") if isinstance(c, dict) else str(c))[:140], "|", (c.get("result", "") if isinstance(c, dict) else "")[:100])
elif what == "carried":
    for a, r in areas.items():
        for c in r.get("carried_status", []) or []:
            print(a, "|", c.get("item", "")[:120], "|", c.get("status", "")[:60], "|", (c.get("evidence") or "")[:150])
