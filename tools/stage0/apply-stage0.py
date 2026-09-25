#!/usr/bin/env python3
"""Apply the Stage 0 edits (stage0-edits.json, alongside this script).

  Rebuild and verify the built HTML:
      python3 apply-stage0.py --html austerlitz-command-map__7_.html out.html
  Port the same edits to the source tree (dry run unless --write):
      python3 apply-stage0.py --tree path/to/tree [--write] [--exclude PATTERN ...]

In --tree mode every .js/.html/.htm/.css/.py file under the tree is searched for each edit's `old`
text, which is unique in the original build. An edit is applied only where that text occurs exactly
once across the searched files; anything else is reported and left alone. Built artefacts (a
bundle.js, or an .html carrying the embedded ground textures) are skipped so that source and build
do not both match. Files are rewritten only with --write, and a .pre-stage0 copy of each is kept.
"""
import sys, os, json, hashlib, fnmatch, argparse
here = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser(); ap.add_argument('--html', nargs=2); ap.add_argument('--tree')
ap.add_argument('--write', action='store_true'); ap.add_argument('--exclude', action='append', default=[])
ap.add_argument('--edits', default=os.path.join(here, 'stage0-edits.json'))
args = ap.parse_args()
doc = json.load(open(args.edits, encoding='utf-8')); edits = doc['edits']
md5 = lambda s: hashlib.md5(s.encode('utf-8')).hexdigest()
if args.html:
    src, dst = args.html; T = open(src, encoding='utf-8').read()
    if md5(T) != doc['original_md5']: print('warning: input md5 %s is not the verified original %s' % (md5(T), doc['original_md5']))
    for e in edits:
        n = T.count(e['old'])
        if n != 1: sys.exit('edit %d (%s): found %d times, expected once; stopping' % (e['n'], e['where'], n))
        T = T.replace(e['old'], e['new'])
    open(dst, 'w', encoding='utf-8').write(T)
    ok = md5(T) == doc['patched_md5']
    print('%d edits applied; result md5 %s %s the delivered Stage 0 build' % (len(edits), md5(T), 'MATCHES' if ok else 'DOES NOT MATCH'))
    sys.exit(0 if ok else 1)
if not args.tree: ap.error('give --html or --tree')
files = {}
for root, dirs, names in os.walk(args.tree):
    dirs[:] = [d for d in dirs if d not in ('node_modules', '.git', 'dist', 'build', 'out')]
    for nm in names:
        p = os.path.join(root, nm)
        if not nm.lower().endswith(('.js', '.html', '.htm', '.css', '.py')) or nm == 'bundle.js': continue
        if any(fnmatch.fnmatch(p, pat) or fnmatch.fnmatch(nm, pat) for pat in args.exclude): continue
        if os.path.abspath(p).startswith(here): continue
        t = open(p, encoding='utf-8', errors='replace').read()
        if nm.lower().endswith(('.html', '.htm')) and '<script>/* Embedded ground textures' in t: continue
        files[p] = t
print('searching %d source files under %s' % (len(files), args.tree))
applied, problems, touched = [], [], set()
for e in edits:
    for old, new in ((e['old'], e['new']), (e['old'].replace('\n', '\r\n'), e['new'].replace('\n', '\r\n'))):
        hits = [(p, t.count(old)) for p, t in files.items() if old in t]
        if hits: break
    if len(hits) == 1 and hits[0][1] == 1:
        p = hits[0][0]; files[p] = files[p].replace(old, new); touched.add(p)
        applied.append((e['n'], e['where'], os.path.relpath(p, args.tree)))
    else:
        problems.append((e['n'], e['where'], 'not found' if not hits else 'ambiguous: ' + ', '.join('%s x%d' % (os.path.relpath(p, args.tree), c) for p, c in hits)))
for n, w, p in applied: print('  applied  #%-3d %-28s -> %s' % (n, w[:28], p))
for n, w, why in problems: print('  PROBLEM  #%-3d %-28s %s' % (n, w[:28], why))
print('%d of %d edits placed, %d need attention' % (len(applied), len(edits), len(problems)))
if args.write:
    for p in touched:
        open(p + '.pre-stage0', 'w', encoding='utf-8').write(open(p, encoding='utf-8', errors='replace').read())
        open(p, 'w', encoding='utf-8').write(files[p])
    print('written: ' + ', '.join(os.path.relpath(p, args.tree) for p in sorted(touched)) + ' (originals kept as *.pre-stage0)')
else:
    print('dry run: nothing written (add --write)')
sys.exit(1 if problems else 0)
