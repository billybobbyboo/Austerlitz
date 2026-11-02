#!/usr/bin/env python3
"""Records audit: where each docs/FINAL_AUDIT.md finding id is mentioned in CHANGELOG.md, docs/ROADMAP.md and docs/STAGE8_SPEC.md.
Usage: python3 -I id-mentions.py <repo> <out.json>
Reads only; writes the out file. Ids are taken from FINAL_AUDIT.md's bold finding heads (**X-n · severity · title**)."""
import re, sys, json
repo, out = sys.argv[1], sys.argv[2]
fa = open(f'{repo}/docs/FINAL_AUDIT.md', encoding='utf-8').read().split('\n')
heads = []
for i, l in enumerate(fa, 1):
    m = re.match(r'^\*\*((?:H|D|G|S|SW|T|A|P|R)-\d+) · ([^·*]+?)(?: · (.*?))?\.?\*\*', l)
    if m:
        heads.append({'id': m.group(1), 'severity': m.group(2).strip(), 'title': (m.group(3) or '').strip(), 'line': i})
docs = {'CHANGELOG.md': f'{repo}/CHANGELOG.md', 'docs/ROADMAP.md': f'{repo}/docs/ROADMAP.md', 'docs/STAGE8_SPEC.md': f'{repo}/docs/STAGE8_SPEC.md'}
res = {'count': len(heads), 'findings': []}
texts = {k: open(v, encoding='utf-8').read().split('\n') for k, v in docs.items()}
for h in heads:
    pat = re.compile(r'(?<![A-Za-z0-9-])' + re.escape(h['id']) + r'(?![0-9])')
    entry = dict(h)
    entry['mentions'] = {}
    for k, lines in texts.items():
        sec = None; hits = []
        for i, l in enumerate(lines, 1):
            if l.startswith('## ') or l.startswith('### '):
                sec = l.strip('# ').strip()[:110]
            for m in pat.finditer(l):
                s = max(0, m.start() - 160); e = min(len(l), m.end() + 200)
                hits.append({'line': i, 'section': sec, 'ctx': l[s:e]})
        entry['mentions'][k] = hits
    res['findings'].append(entry)
json.dump(res, open(out, 'w'), indent=1, ensure_ascii=False)
print(len(heads), 'ids;', sum(1 for f in res['findings'] if not any(f['mentions'].values())), 'never mentioned')
for f in res['findings']:
    print(f["id"], f["severity"], {k: len(v) for k, v in f['mentions'].items()})
