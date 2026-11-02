#!/usr/bin/env python3
"""Records audit (final audit after Stage 8): documentation consistency. Each row is a statement in a record (file, line, the words quoted)
and what the code, the git history or a check's log says instead. The script re-reads every cited line and fails unless the quoted words are
on it, and checks the facts it can (git merges, counts in code), so the list stays true to the tree it was made on.
Usage: python3 -I doc-consistency.py <repo> <evidence-dir> -> doc-consistency.json, doc-consistency.md. Reads only."""
import json, sys, subprocess, re
repo, ev = sys.argv[1], sys.argv[2]
def line(f, n): return open(f'{repo}/{f}', encoding='utf-8').read().split('\n')[n-1]
def git(*a): return subprocess.run(['git', '-C', repo] + list(a), capture_output=True, text=True).stdout
merges = git('log', '--merges', '--format=%h %ad %s', '--date=short', 'origin/main')
facts = {
 'pr77': '141f890' in merges and '#77' in merges, 'pr78': 'c2adefe' in merges and '#78' in merges, 'pr79': '43e3e5b' in merges and '#79' in merges,
 'pr73': 'b7fb67a' in merges and '#73' in merges, 'pr74': '72c7e1b' in merges and '#74' in merges,
 'manifest': json.load(open(f'{repo}/tools/visual/selftest-manifest.json'))['count'],
 'cases': len(__import__('subprocess').run(['node', '-e', 'const c=require(process.argv[1]); const a=c.CASES||c.cases||c; console.log(JSON.stringify(Array.isArray(a)?a.map(x=>x.name||x.id):Object.keys(a)))', f'{repo}/tools/visual/cases.js'], capture_output=True, text=True).stdout and json.loads(subprocess.run(['node', '-e', 'const c=require(process.argv[1]); const a=c.CASES||c.cases||c; console.log(JSON.stringify(Array.isArray(a)?a.map(x=>x.name||x.id):Object.keys(a)))', f'{repo}/tools/visual/cases.js'], capture_output=True, text=True).stdout)),
 'checkdata_ref': re.search(r'"check:data": "node tools/visual/data-invariance.js (\S+)', open(f'{repo}/package.json').read()).group(1),
 'contrast_log': [l for l in open(f'{repo}/docs/audit-post8-evidence/checks/check-contrast.txt', encoding='utf-8', errors='replace') if l.startswith('states ') or l.startswith('boot cases')],
}
rows = [
 # (file, line, quoted words, what is true instead, evidence, kind)
 ('README.md', 4, 'one self-contained HTML file', 'three.js r128 loads from cdnjs.cloudflare.com at start-up; without that host the map shows its failure dialog ("The map needs a network connection ...")', 'shell.html:437 (the script tag, integrity sha512, crossorigin); shell.html:28; CLAUDE.md:3 states it with the qualification ("three.js r128 from cdnjs")', 'stale / overclaim'),
 ('README.md', 27, 'continuity and coverage are printed only', 'audit.js asserts both since roadmap step 5 (T-9 (b))', 'CHANGELOG.md:1936; CLAUDE.md (Checks: "since roadmap step 5 audit.js asserts its continuity ... and coverage")', 'stale'),
 ('README.md', 28, 'archive/step5c-45f8f662.html', 'check:data compares against ' + facts['checkdata_ref'] + ' (moved in 8E, 8G, 8H, 8J and 8K)', 'package.json:9', 'stale'),
 ('README.md', 30, '35 interface states', '45 states (10 at 390 x 844 as a phone)', 'docs/audit-post8-evidence/checks/check-contrast.txt: ' + ' / '.join(s.strip() for s in facts['contrast_log']), 'stale'),
 ('README.md', 30, 'the six start-up cases', 'eight start-up cases (context-depth since 8C, context-gait since 8E)', 'docs/audit-post8-evidence/checks/check-contrast.txt ("boot cases: 8 of 8 pass"); tools/visual/boot-check.js', 'stale'),
 ('README.md', 31, '242 checks', f'{facts["manifest"]} checks', 'tools/visual/selftest-manifest.json (count)', 'stale'),
 ('README.md', 31, 'about 15 minutes', 'about 21-43 minutes on CI since 8C-8G (CLAUDE.md); 5,422 s on this audit\'s shared machine', 'CLAUDE.md (check:selftest); docs/audit-post8-evidence/checks/summary.txt', 'stale'),
 ('README.md', 32, '30 fixed views', f'{facts["cases"]} fixed views', 'tools/visual/cases.js', 'stale'),
 ('README.md', 32, 'about 100 minutes', 'two to four hours (CI run 41394859313: 2 h 1 min; 169-250 minutes on 8E and 8F)', '.github/workflows/checks.yml:6 ("about three to four hours"); CLAUDE.md (check:visual)', 'stale'),
 ('README.md', 3, 'A historically grounded, interactive reconstruction', 'The README is the page GitHub Pages serves at the site\'s root, and it says nothing to a visitor of what is evidence and what is reconstruction, and does not link the map (the file is named in code formatting; the page\'s only link is to itself)', 'docs/audit-post8-evidence/records/pages-root.html and pages-root-headers.txt (fetched 2 Nov 2026 01:41 GMT, last-modified 1 Nov 10:57:40 GMT)', 'missing (visitor)'),
 ('CLAUDE.md', 744, 'Draft PR #79 holds both records', 'PR #79 was merged into main on 1 November 2026 (43e3e5b)' if facts['pr79'] else '?', 'git log --merges origin/main', 'stale status'),
 ('CLAUDE.md', 497, '## Current state (October 2026)', 'the section runs to 1 November 2026 (decisions 267-269)', 'CLAUDE.md:734-745', 'stale heading'),
 ('CLAUDE.md', 24, '484 after decision 210 (c), 145', 'since 8K: 704 statements, 481 unchecked, 148 with a claim of their own, 75 by class', 'CHANGELOG.md:204; counted in this audit (narrative.js, tools/step4/statements.js)', 'stale count'),
 ('CHANGELOG.md', 5, 'draft PR #79 into `main`', 'merged (43e3e5b)', 'git log --merges origin/main', 'stale status'),
 ('CHANGELOG.md', 18, 'draft PR #79 into `main`', 'merged (43e3e5b)', 'git log --merges origin/main', 'stale status'),
 ('CHANGELOG.md', 40, 'not merged', 'merged (43e3e5b, PR #79)', 'git log --merges origin/main', 'stale status'),
 ('CHANGELOG.md', 58, 'a draft pull request into `main`, for review; not merged', 'merged (c2adefe, PR #78)' if facts['pr78'] else '?', 'git log --merges origin/main; CLAUDE.md:738 says merged', 'stale status (contradicts CLAUDE.md)'),
 ('CHANGELOG.md', 86, 'a draft pull request into `main`, for review; not merged', 'merged (141f890, PR #77)' if facts['pr77'] else '?', 'git log --merges origin/main; CLAUDE.md:734 says merged', 'stale status (contradicts CLAUDE.md)'),
 ('docs/ROADMAP.md', 510, 'pull request for review, not merged', 'PR #73 merged (b7fb67a)' if facts['pr73'] else '?', 'git log --merges origin/main', 'stale status'),
 ('docs/ROADMAP.md', 535, 'review, not merged', 'PR #74 merged into main (72c7e1b); #75 and #76 merged into their stacked branches and brought into main by 8L' if facts['pr74'] else '?', 'git log --merges origin/main', 'stale status'),
 ('docs/ROADMAP.md', 548, 'not merged', 'PR #77 merged (141f890)' if facts['pr77'] else '?', 'git log --merges origin/main; CLAUDE.md:734 says merged', 'stale status (contradicts CLAUDE.md)'),
 ('.github/workflows/checks.yml', 5, 'each about 8-15 minutes', 'the self-test alone takes 21-43 minutes on CI since 8C-8G', 'CLAUDE.md (check:selftest)', 'stale comment'),
]
out = []; bad = []
for f, n, q, truth, evid, kind in rows:
    try: ok = q in line(f, n)
    except Exception: ok = False
    if not ok: bad.append((f, n, q))
    out.append({'file': f, 'line': n, 'says': q, 'instead': truth, 'evidence': evid, 'kind': kind, 'quote_found': ok})
if bad: raise SystemExit('quotes not found on their lines: %r' % bad)
checks = {
 'CLAUDE.md numbers held against the code': [
  ('self-test manifest', 317, facts['manifest'], 'tools/visual/selftest-manifest.json'),
  ('check:visual cases', 39, facts['cases'], 'tools/visual/cases.js'),
  ('MOTION.JUMPS / POPS', '248 / 998', re.search(r'JUMPS:(\d+), POPS:(\d+)', open(f'{repo}/tools/visual/thresholds.js').read()).group(0), 'tools/visual/thresholds.js:270'),
  ('CTX_DELETES', 248, int(re.search(r'const CTX_DELETES=(\d+)', open(f'{repo}/tools/visual/boot-check.js').read()).group(1)), 'tools/visual/boot-check.js:30'),
  ('LANG_ALLOW entries', 2, open(f'{repo}/redteam.js').read().split('const LANG_ALLOW=[')[1].split('\n];')[0].count('{where:'), 'redteam.js:228-240'),
  ('CONF_SHARE.land', 0.07, float(re.search(r'CONF_SHARE=\{land:([0-9.]+)', open(f'{repo}/tools/visual/thresholds.js').read()).group(1)), 'tools/visual/thresholds.js:238'),
  ('plans-overview drop limit', 13, int(re.findall(r'DROP_LIMIT\["plans-overview"\]=(\d+)', open(f'{repo}/tools/visual/thresholds.js').read())[-1]), 'tools/visual/thresholds.js:117'),
  ('check:baseline md5', 'f10fe585c46aea576f436ed51ac46f83', re.search(r"h==='([0-9a-f]{32})'", open(f'{repo}/package.json').read()).group(1), 'package.json:8'),
 ]}
held = [{'what': w, 'claude_md': a, 'code': b, 'where': c, 'agree': str(a) == str(b) or (isinstance(b, str) and str(a).replace(' ', '') in b.replace(' ', '').replace('JUMPS:', '').replace('POPS:', '').replace(',', '/'))} for w, a, b, c in checks['CLAUDE.md numbers held against the code']]
json.dump({'stale': out, 'numbers': held, 'facts': {k: v for k, v in facts.items() if k != 'contrast_log'}}, open(f'{ev}/doc-consistency.json', 'w'), indent=1, ensure_ascii=False)
md = ['# Documentation consistency (final audit after Stage 8)', '', 'Made by `tools/audit-post8/records/doc-consistency.py` (each quoted phrase re-read on its line).', '',
      '## Statements that no longer hold', '', '| file:line | says | instead | evidence | kind |', '|---|---|---|---|---|']
md += [f"| {r['file']}:{r['line']} | \"{r['says']}\" | {r['instead']} | {r['evidence']} | {r['kind']} |" for r in out]
md += ['', '## Numbers CLAUDE.md states, held against the code', '', '| what | CLAUDE.md | code | where | agree |', '|---|---|---|---|---|']
md += [f"| {h['what']} | {h['claude_md']} | {h['code']} | {h['where']} | {h['agree']} |" for h in held]
open(f'{ev}/doc-consistency.md', 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print(len(out), 'stale statements;', sum(1 for h in held if h['agree']), 'of', len(held), 'numbers agree')
