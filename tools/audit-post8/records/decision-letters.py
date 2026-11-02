#!/usr/bin/env python3
"""Records audit: the letters each record gives decisions 255-269 ("decision 262 (a)", "262 (a)", "decided (a)").
Usage: python3 -I decision-letters.py <repo> <out.json>. Reads only. A decision cited with more than one letter in the records is listed
with every line, so a contradiction can be told from a decision that took two letters (255 (a) and (d); 258 (a) and (b))."""
import re, sys, json
repo, out = sys.argv[1], sys.argv[2]
docs = ['CLAUDE.md', 'CHANGELOG.md', 'docs/ROADMAP.md', 'docs/STAGE8_SPEC.md']
pat = re.compile(r'(?:[Dd]ecisions? |[Qq]uestions? |\b)(25[5-9]|26[0-9])(?:,? )\(([a-d])\)')
res = {}
for d in docs:
    for i, l in enumerate(open(f'{repo}/{d}', encoding='utf-8'), 1):
        for m in pat.finditer(l):
            n, let = m.group(1), m.group(2)
            pre = l[max(0, m.start()-12):m.start()]
            kind = 'question' if re.search(r'[Qq]uestions? $', pre + m.group(0)[:m.group(0).find(n)]) else 'decision'
            res.setdefault(n, {}).setdefault(let, []).append({'doc': d, 'line': i, 'ctx': l[max(0, m.start()-90):m.end()+110].strip()})
summary = {n: {let: len(v) for let, v in lets.items()} for n, lets in sorted(res.items())}
json.dump({'summary': summary, 'hits': res}, open(out, 'w'), indent=1, ensure_ascii=False)
for n, lets in sorted(res.items()):
    print(n, {let: sorted(set(h['doc'] for h in v)) for let, v in lets.items()})
