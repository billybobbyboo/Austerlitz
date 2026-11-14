#!/usr/bin/env python3
"""The closing re-verification pass: the audit's interaction scenarios re-run on the final build, compared check by check with the audit's own
records (the committed docs/audit-post8-evidence/interaction/<name>.json at git HEAD, against the new run's file). Reads only.
python3 tools/closing/interaction-compare.py <new-dir> [name ...]"""
import json, subprocess, sys, os
ROOT = __file__.rsplit("/tools/", 1)[0]
newdir = sys.argv[1]; names = sys.argv[2:]
for n in names:
    try: old = json.loads(subprocess.run(["git", "-C", ROOT, "show", "HEAD:docs/audit-post8-evidence/interaction/%s.json" % n], capture_output=True, text=True).stdout)
    except Exception: old = None
    f = os.path.join(newdir, n + ".json")
    if not os.path.exists(f): print("== %s: no new record" % n); continue
    new = json.load(open(f))
    oc = {c["id"]: c for c in (old or {}).get("checks", [])}; nc = {c["id"]: c for c in new.get("checks", [])}
    print("== %s: md5 %s; checks audit %d ok %d | now %d ok %d; console %s" % (n, new.get("md5", "?")[:8], len(oc), sum(1 for c in oc.values() if c["ok"]),
          len(nc), sum(1 for c in nc.values() if c["ok"]), len(new.get("console", []) or [])))
    for k in sorted(set(oc) | set(nc)):
        a, b = oc.get(k), nc.get(k)
        if a and b and a["ok"] == b["ok"] and a["ok"]: continue
        sa = "ok" if a and a["ok"] else ("FAIL" if a else "-"); sb = "ok" if b and b["ok"] else ("FAIL" if b else "-")
        if sa != sb or sb == "FAIL":
            print("   %-34s audit %-4s now %-4s | %s" % (k, sa, sb, str((b or a).get("expected",""))[:110]))
            if sb == "FAIL": ob=b.get("observed"); print("      observed now: %s" % ((ob if isinstance(ob,str) else json.dumps(ob))[:400]))
