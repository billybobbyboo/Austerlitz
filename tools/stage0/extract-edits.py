#!/usr/bin/env python3
"""Derive the Stage 0 edit list from the original and patched builds.
python3 extract-edits.py original.html patched.html stage0-edits.json
Each edit is (old -> new) where `old` is a run of whole lines from the original, widened with
context until it occurs exactly once in the original file. Applying every edit to the original
must reproduce the patched build byte for byte; this script checks that before writing."""
import sys, json, hashlib, difflib, re
orig_p, pat_p, out_p = sys.argv[1:4]
A = open(orig_p, encoding='utf-8').read(); B = open(pat_p, encoding='utf-8').read()
a = A.splitlines(keepends=True); b = B.splitlines(keepends=True)
ops = [o for o in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes() if o[0] != 'equal']
# merge changes that sit within 4 lines of each other
merged = []
for t, i1, i2, j1, j2 in ops:
    if merged and i1 - merged[-1][1] <= 4:
        merged[-1] = [merged[-1][0], i2, merged[-1][2], j2]
    else:
        merged.append([i1, i2, j1, j2])
def where(i):
    # the enclosing top-level declaration or section, for the reader
    for k in range(i, -1, -1):
        m = re.match(r'(?:function\s+(\w+)|var\s+([\w,\s]+?)\s*=|/\* -{3,} (.+?) -{3,})', a[k])
        if m: return (m.group(1) or m.group(2) or m.group(3)).strip()
        if a[k].startswith('<style>'): return 'CSS'
        if a[k].startswith('<body'): return 'markup'
    return 'top of file'
edits = []
for i1, i2, j1, j2 in merged:
    c = 0 if i2 > i1 else 1
    while True:
        lo, hi = max(0, i1 - c), min(len(a), i2 + c)
        old = ''.join(a[lo:hi])
        if old and A.count(old) == 1 and len(old) < 400000: break
        c += 1
    new = ''.join(a[lo:i1]) + ''.join(b[j1:j2]) + ''.join(a[i2:hi])
    edits.append({'n': len(edits) + 1, 'original_lines': [lo + 1, hi], 'where': where(lo), 'old': old, 'new': new})
# check: non-overlapping, and applying all of them reproduces the patched build exactly
spans = sorted((A.index(e['old']), A.index(e['old']) + len(e['old'])) for e in edits)
assert all(spans[k][1] <= spans[k + 1][0] for k in range(len(spans) - 1)), 'overlapping edits'
T = A
for e in edits:
    assert T.count(e['old']) == 1, 'edit %d not unique while applying' % e['n']
    T = T.replace(e['old'], e['new'])
assert T == B, 'the edits do not reproduce the patched build'
doc = {'description': 'Stage 0 (visual/UX baseline and trust) edits to the Austerlitz command map. Each edit replaces `old` '
                      '(unique in the original build) with `new`. Data sections are untouched; see tools/visual/data-invariance.js.',
       'original_md5': hashlib.md5(A.encode('utf-8')).hexdigest(), 'patched_md5': hashlib.md5(B.encode('utf-8')).hexdigest(),
       'edits': edits}
json.dump(doc, open(out_p, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('%d edits, reproduce the patched build exactly (md5 %s)' % (len(edits), doc['patched_md5']))
from collections import Counter
print('by location:', ', '.join('%s x%d' % (k, v) for k, v in Counter(e['where'] for e in edits).items()))
