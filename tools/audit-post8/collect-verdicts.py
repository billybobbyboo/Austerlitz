#!/usr/bin/env python3
"""Final audit after Stage 8: copy each verifier's returned object from the workflow journals into
docs/audit-post8-evidence/verification/<label>.json where the agent did not write it itself (audit tooling only)."""
import json, glob, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "docs", "audit-post8-evidence", "verification")
J = "/root/.claude/projects/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/subagents/workflows/*/journal.jsonl"
n = 0
for f in glob.glob(J):
    for line in open(f, encoding="utf-8"):
        d = json.loads(line)
        r = d.get("result")
        if d.get("type") != "result" or not isinstance(r, dict) or "verdicts" not in r or not r.get("label"):
            continue
        p = os.path.join(OUT, r["label"] + ".json")
        if not os.path.exists(p):
            json.dump(dict(r, _source="workflow journal " + os.path.basename(os.path.dirname(f))), open(p, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
            n += 1
            print("wrote", os.path.relpath(p, ROOT))
print(n, "written")
