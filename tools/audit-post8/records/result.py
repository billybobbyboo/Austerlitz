#!/usr/bin/env python3
"""Records audit: assembles docs/audit-post8-evidence/records/result.json (the area's structured result) from prior-findings.json, carried.json,
doc-consistency.json and the findings written below. Usage: python3 -I result.py <evidence-dir>. Reads and writes only that directory."""
import json, sys
ev = sys.argv[1]
P = json.load(open(f'{ev}/prior-findings.json', encoding='utf-8'))
C = json.load(open(f'{ev}/carried.json', encoding='utf-8'))
D = json.load(open(f'{ev}/doc-consistency.json', encoding='utf-8'))
cnt = P['counts']; v = P['verified_in_this_audit']
E = 'docs/audit-post8-evidence/records/'
findings = [
 {'title': 'README.md describes the checks wrongly again and calls the file self-contained (the prior audit\'s R-1 recurred)',
  'category': 'confirmed-defect', 'severity': 'S3', 'priority': 'P2', 'subsystem': 'records: README.md, .github/workflows/checks.yml',
  'user_impact': 'A contributor or reviewer reading README.md is told check:data compares against step 5c\'s build, check:contrast reads 35 states and six start-up cases, the self-test has 242 checks in about 15 minutes, check:visual 30 views in about 100 minutes, audit.js only prints, and that the HTML is self-contained although three.js comes from cdnjs.',
  'status': 'open', 'origin': 'inherited (step 6 item 3 made the states and views stale) / new-regression (Stage 8 PRs 8A-8K moved the reference, the counts and the times)',
  'refs': ['README.md:4', 'README.md:27', 'README.md:28', 'README.md:30', 'README.md:31', 'README.md:32', '.github/workflows/checks.yml:5', 'package.json:9', 'shell.html:437', 'tools/visual/selftest-manifest.json', 'tools/visual/cases.js'],
  'evidence': E + 'doc-consistency.md (every quoted phrase re-read on its line by doc-consistency.py); docs/audit-post8-evidence/checks/check-contrast.txt ("states 45 (10 at 390 x 844 as a phone)", "boot cases: 8 of 8 pass"); CHANGELOG.md:1936 (audit.js asserts since step 5)',
  'expected': 'README\'s table matches package.json and the checks as they run (archive/stage8k-f10fe585.html; 45 states; 8 start-up cases; 317 checks; 39 views), and says three.js loads from cdnjs.',
  'observed': '9 stale statements in README.md (lines 4, 27, 28, 30 twice, 31 twice, 32 twice) and one in checks.yml:5 ("each about 8-15 minutes"; the self-test alone takes 21-43 minutes on CI). README.md last changed at 15b2dcc (decision 214).',
  'remedy': 'A records-only commit: point README\'s table at CLAUDE.md\'s Checks section instead of copying counts and times, or update them; write "one HTML file; three.js r128 is loaded from cdnjs with its integrity hash".',
  'validation': 'python3 -I tools/audit-post8/records/doc-consistency.py then reads the corrected lines (its quotes would no longer be found).'},
 {'title': 'The published site\'s root page is the developer README: no link to the map and nothing for a visitor on evidence and reconstruction',
  'category': 'confirmed-defect', 'severity': 'S3', 'priority': 'P2', 'subsystem': 'publishing (GitHub Pages root)',
  'user_impact': 'A visitor who opens https://billybobbyboo.github.io/Austerlitz/ reads build instructions and suite descriptions; the map file is named twice in code formatting and is not linked; nothing says what the map documents and what it reconstructs.',
  'status': 'open', 'origin': 'inherited',
  'refs': ['README.md:1-37', E + 'pages-root.html', E + 'pages-root-headers.txt'],
  'evidence': 'pages-root.html (fetched 2 November 2026 01:41 GMT; last-modified 1 November 10:57:40 GMT): the rendered README; its only <a href> is to the site itself.',
  'expected': 'A visitor arriving at the site root finds a link to austerlitz-command-map.html and one paragraph on the reconstruction (claims, grades, design conventions).',
  'observed': 'Developer documentation only; the stale statements of the README finding repeated to the public.',
  'remedy': 'Records/publishing only: a short visitor paragraph and a link at the top of README.md, or a small index.html; no application change.',
  'validation': 'curl the Pages root after deployment and check for the link.'},
 {'title': 'Merged pull requests are recorded as drafts in CHANGELOG.md, docs/ROADMAP.md and CLAUDE.md, which contradict one another for #77 and #78 (the prior audit\'s R-2 recurred)',
  'category': 'confirmed-defect', 'severity': 'S3', 'priority': 'P2', 'subsystem': 'records: CHANGELOG.md, docs/ROADMAP.md, CLAUDE.md',
  'user_impact': 'The next agent or the owner reading the status lines is told 8H, 8I-8K, 8L, decision 267 (a) and the device records are unmerged drafts; CLAUDE.md:744 says "Draft PR #79 holds both records".',
  'status': 'open', 'origin': 'new-regression (Stage 8 records: 8H to the device acceptance)',
  'refs': ['CHANGELOG.md:5', 'CHANGELOG.md:18', 'CHANGELOG.md:40', 'CHANGELOG.md:58', 'CHANGELOG.md:86', 'docs/ROADMAP.md:510', 'docs/ROADMAP.md:535', 'docs/ROADMAP.md:548', 'CLAUDE.md:744', 'CLAUDE.md:734', 'CLAUDE.md:738'],
  'evidence': 'git log --merges origin/main: b7fb67a #73 (30 Oct), 72c7e1b #74, c706c96 #76, c7de7a2 #75 (31 Oct), 141f890 #77 (31 Oct), c2adefe #78 and 43e3e5b #79 (1 Nov); ' + E + 'doc-consistency.json',
  'expected': 'Each merged part\'s status line says "merged (#n, commit)", as step 5 made them (CHANGELOG.md:1854).',
  'observed': 'Five CHANGELOG heads say "not merged" or "draft"; three ROADMAP paragraphs say "not merged"; CLAUDE.md:744 says draft while CLAUDE.md:734 and :738 record #77 and #78 merged; ROADMAP records none of PRs #73-#79\'s merges.',
  'remedy': 'A records-only commit updating the nine status lines with their merge commits.',
  'validation': 'grep -n "not merged" CHANGELOG.md docs/ROADMAP.md against git log --merges.'},
 {'title': 'CLAUDE.md\'s file table and heading lag the tree: the claims\' counts before 8K and "Current state (October 2026)"',
  'category': 'confirmed-defect', 'severity': 'S4', 'priority': 'P4', 'subsystem': 'records: CLAUDE.md',
  'user_impact': 'An agent reading CLAUDE.md is given 484 unchecked statements and 145 own claims (now 481 and 148) and an October heading over November state.',
  'status': 'open', 'origin': 'new-regression (8K; 1 November records)',
  'refs': ['CLAUDE.md:24', 'CLAUDE.md:497', 'CHANGELOG.md:204'],
  'evidence': E + 'claims-count.json (704 statements, 148 own, 75 by class, 481 unchecked, 0 stale entries); CHANGELOG.md:204 records the same',
  'expected': 'CLAUDE.md states the current counts (it is the agents\' map).', 'observed': '"484 after decision 210 (c), 145"; "## Current state (October 2026)".',
  'remedy': 'Two words in a records-only commit.', 'validation': 'node tools/audit-post8/records/claims-count.js'},
 {'title': 'G-3 (Miloradovich at dawn) is the one finding of the prior audit never taken up: no step, no decision, no record since',
  'category': 'unresolved-historical', 'severity': 'S4', 'priority': 'P3', 'subsystem': 'data (FORMATIONS.milo track 0)',
  'user_impact': 'milo@0 is graded A ("Position documented in the sources") with the act "Formed on the plateau near Pratzen village" while plotted about 1.6 km from the village; a visitor reads the strongest grade on an unchecked placement.',
  'status': 'open', 'origin': 'inherited',
  'refs': ['docs/FINAL_AUDIT.md:348', 'data.js:561', 'world.js:143', E + 'id-mentions.json'],
  'evidence': 'id-mentions.json: G-3 has 0 mentions in CHANGELOG.md, docs/ROADMAP.md and docs/STAGE8_SPEC.md (with H-10 and T-8, the only ids never written; those two were done under decisions 135 and 132); docs/audit-post8-evidence/history/result.json: "(d) G-3 still open"',
  'expected': 'Every prior finding assigned to a step, decided, or recorded as left.', 'observed': 'Neither ROADMAP\'s step table nor Stage 8\'s list of unassigned findings (docs/STAGE8_SPEC.md:1327-1339) names G-3.',
  'remedy': 'Put it in the next data task: a source check of the IV Column\'s place at dawn, or the grade lowered with the act qualified; record it in docs/ROADMAP.md.',
  'validation': 'check:data on the data task; the history area\'s grade probe.'},
 {'title': 'The carried checklist misstates three of its own items (the records\' view of other areas\' findings)',
  'category': 'confirmed-defect', 'severity': 'S3', 'priority': 'P3', 'subsystem': 'records: docs/STAGE8_SPEC.md 21.9, 22.6, 23.4',
  'user_impact': 'The checklist the final audit was to start from understates three items: a reader would take them as small offsets and a 4-second gap.',
  'status': 'open', 'origin': 'new-regression (Stage 8 records, 8J-8L)',
  'refs': ['docs/STAGE8_SPEC.md:5108', 'docs/STAGE8_SPEC.md:5111-5112', 'docs/STAGE8_SPEC.md:5400-5401', 'docs/STAGE8_SPEC.md:5513-5516', 'data.js:476', 'data.js:508'],
  'evidence': 'history finding 8 (kienmayer@7 "Holding west of the Goldbach" drawn 901 m east of the brook since Stage 0, filed by 8J as an offset from the corrected brook); history finding 9 (Caffarelli 1.61-2.64 km from Bagration, the records say 2.5-2.9 km); visibility carried and findings 1, 3 (the 4,033 ms is the benchmark\'s whole 121-frame window; over 08:30-11:30 counters hidden 12-28 s); ' + E + 'carried.md C-06, C-40, C-41',
  'expected': 'The checklist states each item as measured.', 'observed': 'An offset since Stage 0 filed as 8J\'s; a separation overstated; a saturated measure read as a duration.',
  'remedy': 'Let this register (carried.md) supersede section 22.6\'s wording; correct the three lines when the records are next touched.',
  'validation': 'The history and visibility areas\' probes.'},
 {'title': 'Two items "recorded complete on the owner\'s word" carry no results: the screen-reader session (decision 175) and the human second reading (decision 189)',
  'category': 'accepted-compromise', 'severity': 'S3', 'priority': 'P3', 'subsystem': 'records / accessibility and sources evidence',
  'user_impact': 'No screen-reader result exists for any build, Stage 8\'s landmark and heading changes (8H, A-6) included; the A grades of the drawn coats rest on machine readings only. The records otherwise read as if both were done.',
  'status': 'accepted by decisions 175 and 189', 'origin': 'accepted-compromise',
  'refs': ['docs/ROADMAP.md:156-159', 'docs/ROADMAP.md:196', 'docs/step3-evidence/sr-session.md', 'docs/stage6-evidence/second-reading.md:6-7'],
  'evidence': 'ROADMAP:156-159 ("no item results ... none of its 24 items is recorded here as passed or failed"); ROADMAP:196 ("no item results given, none recorded"); second-reading.md:6-7 ("Both readers were machine readers")',
  'expected': 'An owner attestation is labelled as one wherever the work is counted as done.', 'observed': 'Counted as done (CLAUDE.md: "step 3 is done"; decision 189 "complete").',
  'remedy': 'Either run the 24-item script once on the final build and read the 15 quotes once, or label both as attestations without results in CLAUDE.md and ROADMAP (no app change).',
  'validation': 'The script\'s result column filled, or the label present.'},
 {'title': 'Decision 140\'s premise has moved: the self-test is 21.7% of the file (12.8% when decided), +277,502 bytes in Stage 8',
  'category': 'accepted-compromise', 'severity': 'S4', 'priority': 'P3', 'subsystem': 'build size',
  'user_impact': 'Every visitor downloads 611,113 bytes of self-test and debug API (and 437,848 bytes of comments, partly inside it) that no visitor runs; the desktop report transferred 1,219,603 bytes compressed for the page.',
  'status': 'accepted by decision 140 on a premise of 12.8%', 'origin': 'new-regression (Stage 8 growth of an accepted compromise)',
  'refs': [E + 'size.json', 'docs/FINAL_AUDIT.md:842', 'docs/STAGE8_SPEC.md:1336', 'docs/STAGE8_SPEC.md:5577'],
  'evidence': 'size.json (tools/audit/size.js on f10fe585): AUSTERLITZ_DEBUG 611,113 bytes, shareOfHtml 0.217; comments 437,848 bytes (15.6%); 225,445 bytes (12.8%) at the audit, 333,611 (15.0%) at Stage 8 Part A by the same tool',
  'expected': 'An accepted trade-off re-put when its measure changes materially.', 'observed': 'Not re-put since Stage 8 Part A recorded "present, larger".',
  'remedy': 'Put decision 140 to the owner again with these numbers; no change without the owner (the harness testing the shipped file is the reason it stands).',
  'validation': 'node tools/audit/size.js --json'},
]
coverage = [
 {'item': 'docs/FINAL_AUDIT.md\'s 75 findings: status', 'method': 'tools/audit-post8/records/id-mentions.py (every id\'s mentions in CHANGELOG.md, ROADMAP.md, STAGE8_SPEC.md) + the step sections read + code read', 'result': ', '.join(f'{k} {n}' for k, n in sorted(cnt.items())), 'evidence': E + 'prior-findings.md, prior-findings.json'},
 {'item': 'prior findings verified against the code', 'method': 'grep and read at file:line on origin/main 43e3e5b', 'result': f'{v["n"]} read in this audit ({v["n"] - 4} in code, among them H-1 to H-8, D-1, D-2, S-1, S-2, SW-1 to SW-4, T-0 to T-2, A-1 to A-3; H-17, P-2, R-1, R-2 in records or measures)', 'evidence': E + 'prior-findings.json (verified_in_code per row)'},
 {'item': 'the carried-issue register', 'method': 'STAGE8_SPEC 20.13, 20.14, 21.9, 22.6, 23.4, 24.1-24.3, 25.2-25.4 and ROADMAP\'s hand-ons and L1-L5 read; each item\'s status from the records, code read here and the other areas\' result.json', 'result': f'{C["n"]} items: ' + ', '.join(f'{k} {n}' for k, n in C['by_class'].items()), 'evidence': E + 'carried.md, carried.json'},
 {'item': 'README.md against the code and the checks', 'method': 'doc-consistency.py (quotes re-read on their lines; counts from package.json, the manifest, cases.js and the contrast log)', 'result': '9 stale statements in README.md, 1 in checks.yml; the Pages root is the README with no link to the map', 'evidence': E + 'doc-consistency.md, pages-root.html'},
 {'item': 'CLAUDE.md\'s numbers', 'method': 'doc-consistency.py against thresholds.js, boot-check.js, redteam.js, the manifest, cases.js, package.json', 'result': '8 of 8 agree (317, 39, 248/998, CTX_DELETES 248, LANG_ALLOW 2, CONF_SHARE.land 0.07, plans-overview 13, f10fe585)', 'evidence': E + 'doc-consistency.json (numbers)'},
 {'item': 'CLAUDE.md\'s Current state and the merge records against git', 'method': 'git log --merges origin/main', 'result': '9 status lines stale (CHANGELOG 5, ROADMAP 3, CLAUDE.md 1); ROADMAP and two CHANGELOG heads contradict CLAUDE.md for #77 and #78', 'evidence': E + 'doc-consistency.md'},
 {'item': 'decisions 255-269 across CLAUDE.md, ROADMAP.md, STAGE8_SPEC.md, CHANGELOG.md', 'method': 'tools/audit-post8/records/decision-letters.py (every "2xx (x)" citation tallied by letter and record) + the decision paragraphs read', 'result': 'no contradiction in letter or content; 255 and 258 carry two letters each by their own terms ((a) and (d); (a) and (b))', 'evidence': E + 'decision-letters.json'},
]
experiments = [
 {'command': 'python3 -I tools/audit-post8/records/id-mentions.py /home/user/Austerlitz docs/audit-post8-evidence/records/id-mentions.json', 'outcome': '75 ids; H-10, G-3, T-8 never mentioned by id', 'environment': 'node/python on the audited tree', 'evidence_path': E + 'id-mentions.json'},
 {'command': 'python3 -I tools/audit-post8/records/prior-findings.py /home/user/Austerlitz docs/audit-post8-evidence/records', 'outcome': json.dumps(cnt), 'evidence_path': E + 'prior-findings.json'},
 {'command': 'python3 -I tools/audit-post8/records/carried.py /home/user/Austerlitz docs/audit-post8-evidence/records', 'outcome': f'{C["n"]} items; every cited area finding exists', 'evidence_path': E + 'carried.json'},
 {'command': 'python3 -I tools/audit-post8/records/doc-consistency.py /home/user/Austerlitz docs/audit-post8-evidence/records', 'outcome': f'{len(D["stale"])} stale statements (all quotes found on their lines); 8 of 8 numbers agree', 'evidence_path': E + 'doc-consistency.json'},
 {'command': 'python3 -I tools/audit-post8/records/decision-letters.py /home/user/Austerlitz docs/audit-post8-evidence/records/decision-letters.json', 'outcome': 'no letter contradiction for 255-269', 'evidence_path': E + 'decision-letters.json'},
 {'command': 'node tools/audit-post8/records/castle-site.js /home/user/Austerlitz', 'outcome': 'the castle\'s site on the drawn "track" class (13 of 16 points at 25 m)', 'environment': 'node, the geography area\'s loader, no page', 'evidence_path': E + 'castle-site.json', 'limitations': 'the nearest road vertex (672 m) is not the nearest segment; not used'},
 {'command': 'node tools/audit-post8/records/claims-count.js /home/user/Austerlitz', 'outcome': '704 statements, 148 own, 75 by class, 481 unchecked, 0 stale', 'evidence_path': E + 'claims-count.json'},
 {'command': 'node tools/audit/size.js --json (an earlier attempt of this area; reused)', 'outcome': 'self-test 611,113 bytes (21.7%); comments 437,848 bytes', 'evidence_path': E + 'size.json'},
 {'command': 'curl the GitHub Pages root (an earlier attempt of this area; reused)', 'outcome': 'the README rendered; one link, to itself', 'evidence_path': E + 'pages-root.html'},
]
not_checked = [
 'No browser run in this area: on-screen wording of the stale records was not rendered (the visual and accessibility areas did that).',
 f'{75 - v["n"]} prior findings rest on the records alone (not re-read in code); their status follows the step sections of CHANGELOG.md.',
 'Steps 1-3\'s hand-ons were followed only as far as later steps\' lists carry them; each was not re-verified on its own.',
 'C-05 (whether the Layers panel says anything about the effects on a phone), C-42 (the woods redrawn where a wood changed) and most of C-51 (step 4\'s review records) not re-examined.',
 'The perf-attribution, robustness and sources-chronology areas had left no result.json when this was written; their items cite the perf area or nothing.',
 'Pull-request states read from merge commits on origin/main, not from the GitHub API.',
 'STAGE8_SPEC.md\'s sections other than 20.13-25.4 and 9.4 not audited for internal consistency.',
]
carried_status = [{'item': f"{r['id']} {r['item'][:150]}", 'status': f"{r['status_class']}: {r['status']}", 'evidence': (r['current_evidence'][:170] + (' ...' if len(r['current_evidence']) > 170 else '')) + f" [carried.md {r['id']}; source {r['source'][:70]}]"} for r in C['register']]
strengths = [
 'Every decision 255-269 carries the same letter in CLAUDE.md, ROADMAP.md, STAGE8_SPEC.md and CHANGELOG.md (decision-letters.json).',
 'Every suite number CLAUDE.md states matches the code (8 of 8).',
 'The prior audit\'s blocker and every major are fixed in the code as recorded (22 read at file:line).',
 'The Stage 8 records carry their open items explicitly and mark none passed; each carried item has a source line, so the register could be built.',
]
ledger = [
 {'claim': 'CLAUDE.md: self-test 317 checks', 'verification': 'confirmed', 'method': 'selftest-manifest.json count', 'where_shown': 'CLAUDE.md (check:selftest)'},
 {'claim': 'CLAUDE.md: check:visual 39 views', 'verification': 'confirmed', 'method': 'tools/visual/cases.js', 'where_shown': 'CLAUDE.md (check:visual)'},
 {'claim': 'README: check:data against archive/step5c-45f8f662.html', 'verification': 'refuted', 'method': 'package.json:9 (archive/stage8k-f10fe585.html)', 'where_shown': 'README.md:28'},
 {'claim': 'CLAUDE.md: Draft PR #79 holds both records', 'verification': 'refuted', 'method': 'git log --merges (43e3e5b)', 'where_shown': 'CLAUDE.md:744'},
 {'claim': 'H-1 fixed: the three hours shown disputed', 'verification': 'confirmed', 'method': 'analysis.js:248-321', 'where_shown': 'events, dossiers'},
 {'claim': 'H-17 / decision 136: a human second reading', 'verification': 'refuted (machine readers; decision 189 records it complete without results)', 'method': 'docs/stage6-evidence/second-reading.md:6-7', 'where_shown': 'ROADMAP.md:196'},
]
out = {'area': 'records', 'scope_summary': (
  'Records area of the final audit after Stage 8 (third attempt; reused size.json, pages-root.html and id-mentions.py from the earlier ones). '
  f'(1) The 75 findings of docs/FINAL_AUDIT.md: {", ".join(f"{k} {n}" for k, n in sorted(cnt.items()))}; {v["n"]} read in this audit ({v["n"]-4} in code, including the blocker and every major). '
  f'(2) The carried-issue register: {C["n"]} items from STAGE8_SPEC 20.13-25.4 and ROADMAP, each with source lines, decision, status and the other areas\' evidence ({", ".join(f"{k} {n}" for k, n in C["by_class"].items())}). '
  f'(3) Documentation: {len(D["stale"])} stale statements (README 10 incl. the Pages root, CHANGELOG 5, ROADMAP 3, CLAUDE.md 3, checks.yml 1); CLAUDE.md\'s suite numbers 8 of 8 correct; no contradiction on decisions 255-269 but merge status. '
  'No application source, data, threshold, test, archive or build changed.'),
  'coverage': coverage, 'findings': findings, 'experiments': experiments, 'not_checked': not_checked, 'carried_status': carried_status,
  'strengths': strengths, 'ledger': ledger}
json.dump(out, open(f'{ev}/result.json', 'w'), indent=1, ensure_ascii=False)
print('findings', len(findings), 'carried', len(carried_status), 'bytes', len(json.dumps(out, ensure_ascii=False)))
