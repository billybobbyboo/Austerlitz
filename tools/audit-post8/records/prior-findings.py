#!/usr/bin/env python3
"""Records audit (final audit after Stage 8): the current status of every finding of docs/FINAL_AUDIT.md (the audit after Stage 7).
Usage: python3 -I prior-findings.py <repo> <evidence-dir>
Reads <evidence-dir>/id-mentions.json (made by id-mentions.py: each id's heading line and its mentions in CHANGELOG.md, docs/ROADMAP.md and
docs/STAGE8_SPEC.md) and the judgements below (one row per finding: the step that took it, the status, the records that say so, the code
read for it in this audit, and the later audit areas' findings that bear on it). Writes prior-findings.json and prior-findings.md.
Statuses: resolved / partly / open / superseded / accepted-by-decision. 'verified' names the file:line read in this audit on the audited
tree (origin/main 43e3e5b, build f10fe585); a row without it rests on the records alone."""
import json, sys, re
repo, ev = sys.argv[1], sys.argv[2]
ids = json.load(open(f'{ev}/id-mentions.json', encoding='utf-8'))
fa = open(f'{repo}/docs/FINAL_AUDIT.md', encoding='utf-8').read().split('\n')

# step -> CHANGELOG.md section range (the section heads: 4780 step 1, 4405 step 2, 4160 step 3, 2934 step 4, 2335/2178/2103 step 4b,
# 1841 step 5, 1755 PR #57, 1412-1696 step 6, 457 8H, 896 8E, 1204 8B)
J = {
 # id: (step, decisions, status, records, verified, related, note)
 'H-1': ('2, 4, 4b', '125 (a), (b)', 'resolved', 'CHANGELOG.md:4433 (step 2, C3, C5, C6); CHANGELOG.md:2934 ff. (step 4, decision 125 (b)); docs/ROADMAP.md:13',
         'analysis.js:248-252 (columns-move), :295-299 (kamensky), :317-321 (guard-broken): each claim "disputed", cf B, with a dispute naming both hours; tools/stage2/chronology.js:446 CONFLICTS (bag@6, guard_cav@6, kamensky@3, kamensky@4)',
         'history finding 6 (three other events whose why says the hour is disputed are not labelled disputed); history finding 7 (kamensky drawn from 08:00)',
         'The three hours are shown disputed with both readings; four named conflicts stay disputed by design (keep the disagreement). The class (hours disputed in a text but not labelled) recurs elsewhere: history 6.'),
 'H-2': ('2', '129', 'resolved', 'CHANGELOG.md:4454 (C7)', 'data.js:393 drouet@3 tm dep 525 (08:45), grade C, basis "app narrative, unsourced", the division held at its dawn position until Soult\'s advance',
         '', 'The fix labels the timing as the app\'s own (grade C, unsourced) rather than sourcing it.'),
 'H-3': ('2', '126', 'resolved', 'CHANGELOG.md:4405 ff. (step 2); CHANGELOG.md:3017 (step 4 hand-on)', 'app.js:3935 PLATEAU_LAST=6; app.js:5178 the label\'s spoken name "The Pratzen plateau, a derived reading"',
         'docs/ROADMAP.md:243 (TOUR[6].x "With the plateau gone" beside the label\'s 17,050 at 11:00, handed on by step 2 and step 4, not taken up)', ''),
 'H-4': ('2', '127 (b)', 'resolved', 'CHANGELOG.md:4548 (C15); docs/ROADMAP.md:57', 'shell.html:370 and app.js:7170: "...the Pratzen plateau, which this map reads as deciding the battle."',
         'a11y A11Y-08 (accepted-compromise: first use does not say the map is a reconstruction or what A/B/C mean)', ''),
 'H-5': ('2, 4', '128 (a), (b)', 'resolved', 'CHANGELOG.md:4405 ff. (step 2, 128 (a)); CHANGELOG.md:3012 (step 4, "Position: interpolated")', 'app.js:8092 POS_CLAIM {fact:"Position: documented", est:"Position: estimated", recon:"Position: reconstructed", interp:"Position: interpolated"}; app.js:8094-8102',
         'history finding 5 (44 of 88 A grades carried forward from earlier anchors)', 'The pill is the position\'s; per-statement claims are H-6.'),
 'H-6': ('4, 4b', '128 (b), 130, 187', 'partly', 'CHANGELOG.md:2934 (step 4); CHANGELOG.md:204 (8K: 704 statements, 481 unchecked, 148 with a claim of their own, 75 by class); docs/ROADMAP.md:227-231',
         'narrative.js STATEMENT_CLAIMS: 148 entries (attributed 63, disputed 65, interpretation 12, uncertain 6, derived 2), 0 stale; CLAIM_BY_CLASS 3 classes; tools/step4/statements.js: 704 statements, 75 by class, 481 unchecked (counted in this audit)',
         'history finding 12 (Command tab DOCUMENTED on 31 rows the register calls "Not yet checked"); tests TS-12 (the inventory a whitelist with no completeness check)',
         'Decision 130\'s sourcing stage is done as scoped; 481 of 704 visitor statements still carry no claim ("Not yet checked" on screen).'),
 'H-7': ('2', '129', 'resolved', 'CHANGELOG.md:4459 (C8)', 'data.js:71 ("Twenty minutes at most, Soult answers in Thiébault\'s memoirs (ten in Ségur\'s)"); analysis.js:282 ("Soult is reported to have answered ...")', '', ''),
 'H-8': ('1', '131', 'resolved', 'CHANGELOG.md:4866 (commit 5)', 'redteam.js:193 (section 6a, every visitor string, tools/lang-scan.js); redteam.js:228-240 LANG_ALLOW, 2 entries, both permanent', '', ''),
 'H-9': ('2', '(step 2)', 'resolved', 'CHANGELOG.md:4557 (C22)', '', '', 'Records only.'),
 'H-10': ('2', '135', 'resolved', 'CHANGELOG.md:4619 ("135, C21"; the id itself is never written in the records)', 'tokens.js:96 "vineyards (presumed)"; shell.html:250 the legend row "presumed (whether vines stood there in 1805 is not established)"', '', ''),
 'H-11': ('2, 4', '129', 'resolved', 'CHANGELOG.md:4465, :4571 (step 2); CHANGELOG.md:3021 (step 4, the 6B questions)', '', '', 'Records only.'),
 'H-12': ('2', '129', 'resolved', 'CHANGELOG.md:4505 (C10)', '', 'history finding 15 (smaller internal inconsistencies in texts and fields: new instances of the class)', 'Records only for the listed items.'),
 'H-13': ('2', '129', 'resolved', 'CHANGELOG.md:4529 (C11)', '', '', 'Records only.'),
 'H-14': ('2, 4', '129, 130', 'resolved', 'CHANGELOG.md:4535 (step 2); CHANGELOG.md:3126 (step 4 K3: the seven superlatives attributed or dropped)', 'redteam.js:228-240 (the superlative entries removed; 2 permanent entries left)', '', ''),
 'H-15': ('2', '(step 2)', 'resolved', 'CHANGELOG.md:4623 (C23: evNote)', '', '', 'Records only.'),
 'H-16': ('2', '(step 2)', 'resolved', 'CHANGELOG.md:4616 (C20: the vantages retitled)', '', '', 'Records only.'),
 'H-17': ('4', '136, 189', 'accepted-by-decision', 'CHANGELOG.md:2934 ff.; docs/stage6-evidence/second-reading.md:6-7 ("Both readers were machine readers ... not the human second reading ... decision 136 asks for"); docs/ROADMAP.md:196 (189 "recorded complete on the owner\'s word ... no item results given, none recorded")',
         'docs/stage6-evidence/second-reading.md:6-7', '', 'The second reading was made by machine readers; decision 136\'s human reading of the 15 A-graded quotes is recorded complete on the owner\'s word with no results. The evidence behind the A grades is one machine pair of readings.'),
 'H-18': ('5', '(step 5 group 4)', 'resolved', 'CHANGELOG.md:1995 (group 4)', '', '', 'Records only.'),
 'H-19': ('5, PR #57', '209 (a)', 'partly', 'CHANGELOG.md:1995, :2028 (step 5); docs/ROADMAP.md:290-293 (spellings outside decision 209\'s six handed on)', '',
         'history result (d)-(e): unaccented "Chasseurs a Pied/a Cheval", "Garde Imperiale", "Reserve de Cavalerie", "emigre", "Frederic Walther" outside decision 209\'s six names',
         'Decision 209 (a) took six names; the rest are handed on to a later data task (docs/ROADMAP.md:290-293), not done.'),
 'D-1': ('1', '131', 'resolved', 'CHANGELOG.md:4857 (commit 6)', 'tools/stage2/chronology.js:64 (acorn), :293 REVIEW_CITES, :382 ALLOW_TIMED, :426 EXCLUDED_PATHS', 'tests TS-13 (clock-shaped hours only; 45 statements give hours in words)', ''),
 'D-2': ('1', '131', 'resolved', 'CHANGELOG.md:4864 (commit 2)', 'test.js:51-57 and redteam.js:335-341 (every tracked formation\'s first positioned anchor declares its grade)', '', ''),
 'D-3': ('2', '129', 'resolved', 'CHANGELOG.md:4541 (C13)', '', '', 'Records only.'),
 'D-4': ('2', '129', 'resolved', 'CHANGELOG.md:4545 (C14)', 'data.js:179-181 heightguns@8: one cf ("B") and claim "est" in the object', '', ''),
 'D-5': ('2', '(D-5 (b))', 'resolved', 'CHANGELOG.md:4629, :4680, :4706 (step 2: seven app.js declarations in check:data\'s group "data in app.js")', '', 'tests TS-3 (presentation code can rewrite a guarded datum at run time and every check passes)', ''),
 'D-6': ('2', '(step 2)', 'resolved', 'CHANGELOG.md:4637, :4674, :4676 (step 2)', '', 'history finding 13 ("Marching" beside "In reserve"/"Concealed" on 63 slow drift legs); tests TS-7 (the march row\'s pin passed a row stripped of its "derived" tag)', ''),
 'G-1': ('5', '(step 5)', 'resolved', 'CHANGELOG.md:1841 ff. (step 5)', '', 'geography finding 9 (the sources sheet reads "exaggerated about 1 times" at 1x)', 'Records only.'),
 'G-2': ('8H', '(8H section 20.7)', 'resolved', 'CHANGELOG.md:597-605 (8H maintenance)', 'geo.js:38-41 MAP_PER_WORLD, WORLD_ORIGIN; geo.js:122 exported', '', ''),
 'G-3': ('none', '-', 'open', 'never named after docs/FINAL_AUDIT.md:348 (id-mentions.json: 0 mentions in CHANGELOG.md, docs/ROADMAP.md, docs/STAGE8_SPEC.md)',
         'data.js:561 milo@0 p [325,230] cf "A", act "Formed on the plateau near Pratzen village"; world.js:143 Pratzen at [276,243] (about 50 map units, about 1.6 km, away)', 'history result (d): "G-3 still open"',
         'A source check (a data task) the audit asked for; never scheduled.'),
 'S-1': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4209, :4258 (step 3)', 'app.js:4296-4310 aggReading (a corps counter is its known formations\' reading; none known, not drawn)',
         'visual-maps V-M4 ("Whose eyes?" still draws the arrows, arrow labels and plateau count of unknown formations); interaction finding 5 (a card\'s "Doing now" under a reading)', 'The counters are fixed; other channels of the same leak are open (V-M4).'),
 'S-2': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4212 (C1)', 'app.js:8836 dwellReset, :8839 dwellSet', '', ''),
 'S-3': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4213, :4312-4314', 'app.js:3465 ("a phase\'s camera leaves the eye level"); the self-test\'s eye-level way-out check app.js:10647-10666', '', ''),
 'S-4': ('5', '170 (c)', 'resolved', 'CHANGELOG.md:1922 (question 170 (c))', '', 'interaction finding 5', 'Records only.'),
 'S-5': ('8E', '(8E S-5)', 'resolved', 'CHANGELOG.md:974 (faceClock); docs/STAGE8_SPEC.md:1332', 'app.js:5740 faceClock', 'visual-landscape finding 3 (blocks face along slow drifts and keep stale facings)', 'Path dependence removed; facing quality is a new finding.'),
 'S-6': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4216, :4324', 'app.js:592 rmChange; style.css:700 @media (prefers-reduced-motion:reduce)', 'a11y carried S-6: fixed', ''),
 'S-7': ('8H', '(8H section 20.4)', 'resolved', 'CHANGELOG.md:492-509 (two seams fixed, the third measured 0 of 242 minutes and kept under decision 92)', '', '', 'The knowledge rule against the eased fog is kept by decision 92 (explained, not changed).'),
 'SW-1': ('3', '133 (a)', 'resolved', 'CHANGELOG.md:4181', 'shell.html:23-28 (#boot-fail alertdialog), :388-393 (AUS_BOOT), :437 (three.js r128 from cdnjs with integrity sha512 and crossorigin)', 'docs/audit-post8-evidence/checks/check-contrast.txt (8 of 8 start-up cases)', ''),
 'SW-2': ('3', '164, 165', 'resolved', 'CHANGELOG.md:4189 (C11, C12)', 'style.css:575 @media (max-width:1079.98px), :663 #panelsbtn', 'visual-maps V-M13 (720-1079 px: a 209 px strip between the card and the dossier)', ''),
 'SW-3': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4189, :4323', 'app.js:6780 syncInert', 'a11y carried SW-3: fixed (47 stops, none in the closed dossier)', ''),
 'SW-4': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4194 (C9)', 'app.js:6752 SHEETS', 'a11y carried SW-4: fixed', ''),
 'SW-5': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4197', '', 'interaction finding 8 (focus falls to the page when a resize hides the focused control)', 'Records only.'),
 'SW-6': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4194, :4196', '', 'a11y carried SW-6: fixed (verified)', ''),
 'SW-7': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4201 (C2)', 'app.js:3545, :3683 FX.built', '', ''),
 'SW-8': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4203 (C3)', '', '', 'Records only.'),
 'SW-9': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4197, :4199', '', '', 'Records only.'),
 'SW-10': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4204 (C13)', 'style.css:575 (max-width:1079.98px, the complement of DOCK_MIN)', '', ''),
 'SW-11': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4207 (C21)', '', '', 'Records only.'),
 'SW-12': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4197, :4200', '', '', 'Records only.'),
 'SW-13': ('5', '(step 5)', 'resolved', 'CHANGELOG.md:1879 (step 5)', '', '', 'Records only.'),
 'T-0': ('1', '141 (a)', 'resolved', 'CHANGELOG.md:4803 (commit 1)', 'fonts.css (96,643 bytes); build.py:17-19, :50 (/*FONTS*/)', '', ''),
 'T-1': ('1', '131', 'resolved', 'CHANGELOG.md:4814 (commits 3, 8, 9)', 'tools/visual/thresholds.js:604 CONSOLE_ALLOW=[] (empty), :607 judgeConsole', '', ''),
 'T-2': ('1', '131', 'resolved', 'CHANGELOG.md:4821 (commits 7, 8)', 'terrain-test.js:95-143 (live ground, 12 surfaces, lifted 0.05 more, at least one must float)', '', ''),
 'T-3': ('1', '131', 'resolved', 'CHANGELOG.md:4825 (commit 2)', '', '', 'Records only.'),
 'T-4': ('1', '131', 'resolved', 'CHANGELOG.md:4828 (commit 9)', '', 'tests TS-16 (the manifest holds names and a count, not conditions)', 'Records only.'),
 'T-5': ('1', '131', 'resolved', 'CHANGELOG.md:4832 (commit 9)', '', 'tests TS-5 (figure-on-ground and standard-foot checks pass when nothing is measured)', 'Records only.'),
 'T-6': ('1', '131', 'resolved', 'CHANGELOG.md:4836', '', 'tests TS-8 (checks take their bounds from the code under test)', 'Records only.'),
 'T-7': ('8H', '(8H section 20.7)', 'partly', 'CHANGELOG.md:619-621 (the pan budget at the median; the 20 s waits kept as timeouts)', '', 'tests TS-18 (wall-clock limits make the suites load-sensitive: a 30 s font watchdog fired under load)',
         'The thresholds remain wall-clock (medians now); load sensitivity remains (TS-18).'),
 'T-8': ('1', '132', 'resolved', 'decision 132 (docs/FINAL_AUDIT.md:834); CHANGELOG.md:4780 ff. (commit 11 fd6e537); the id itself is never written in the records',
         '.github/workflows/checks.yml:4-6, :45-47 (browser job: check:contrast and check:selftest on every push), :75-78, :92 (check:visual on dispatch)', 'tests TS-1 (only the node job is a required check)', ''),
 'T-9': ('1, 5', '(steps 1 and 5)', 'resolved', 'CHANGELOG.md:4817, :4855-4856 (step 1: a, f, g); CHANGELOG.md:1936-1941 (step 5: b, d, e)', '', 'README.md:27 still says audit.js\'s continuity and coverage "are printed only"', 'Records only.'),
 'A-1': ('3', '134 (a)', 'resolved', 'CHANGELOG.md:4218', 'app.js:6719 SHORTCUTS={on:true}; :6720 charKey', 'a11y carried A-1: fixed', ''),
 'A-2': ('3', '(step 3)', 'resolved', 'CHANGELOG.md:4221 (C19)', 'app.js:5096, :5315, :5453 (focus takes no part in the layout; a focused item drawn; focus handed on)', 'a11y carried A-2: fixed (18 map stops at opacity 1 after frames)', ''),
 'A-3': ('3', '166 (a), 167', 'resolved', 'CHANGELOG.md:4225, :4254', 'style.css:263, :344 (.timerail 24 px); app.js:12146-12187 (the self-test\'s target-size check)', 'a11y carried A-3: fixed / accepted; visual-maps V-M1 and a11y A11Y-04 (on a phone the event markers cover most of the rail)',
         'The event markers are 2.5.8\'s essential exception (decision 167).'),
 'A-4': ('6', '137; 223-229, 231-234', 'superseded', 'docs/ROADMAP.md:17 (step 6); CHANGELOG.md:1572 (the phone layout)', '', 'a11y carried A-4: superseded (the phone layout)', 'Replaced by the phone layout below 720 px.'),
 'A-5': ('8B, 8E, 8F', '241 (a), 242 (a), 247 (a)', 'partly', 'docs/STAGE8_SPEC.md:1331 (9.4: routed to 8B and 8E); CHANGELOG.md:1229 (8B: the arrows hidden by the ground at eye level)', '',
         'visual-landscape finding 8 (deciduous crowns near the eye show large faceted shards); docs/STAGE8_SPEC.md:4698 (20.13: crowns within a few units of the eye)', 'The arrows through the hills are fixed; the close views\' faceting of crowns is recorded open.'),
 'A-6': ('8H', '(8H section 20.5)', 'resolved', 'CHANGELOG.md:515-530', 'shell.html:384 <main id="map-main">; style.css:12 :focus-visible outline 2px', 'a11y carried A-6: fixed', ''),
 'P-1': ('6', '138, 230, 235', 'superseded', 'CHANGELOG.md:1535 (decision 230\'s records-only note: 49.7%, not about 91%); CHANGELOG.md:1521 (decision 235: question 138 retired)', '', '',
         'The premise was corrected (about half, not 91%); the level of detail retired by decision 235 was then built in 8E under decision 242 (a) (two kit levels).'),
 'P-2': ('none', '140', 'accepted-by-decision', 'docs/FINAL_AUDIT.md:842 (decision 140: the self-test kept in the file); docs/STAGE8_SPEC.md:1336 ("present, larger": 15.0%)',
         'docs/audit-post8-evidence/records/size.json (tools/audit/size.js on f10fe585): AUSTERLITZ_DEBUG 611,113 bytes, 21.7% of the 2,810,630-byte file (12.8% at the audit, 15.0% at Stage 8 Part A); comments 437,848 bytes, 15.6% (10.1%, 11.1%)', '',
         'Accepted by decision 140 on a premise of 12.8%; the share has grown to 21.7% (the self-test) and 15.6% (comments, overlapping it). The decision stands; its premise has moved.'),
 'P-3': ('8H', '(8H section 20.7)', 'resolved', 'CHANGELOG.md:611-613', '', '', 'Records only.'),
 'P-4': ('8H', '(8H section 20.7)', 'resolved', 'CHANGELOG.md:614-618 (measured; nothing cut on software timings)', '', '', 'Measured, not changed.'),
 'R-1': ('5', '(step 5)', 'partly', 'CHANGELOG.md:1849 (step 5 fixed it)', 'README.md:27, :28, :30, :31, :32 (stale again: see docs/audit-post8-evidence/records/README.md, doc consistency)', '', 'Recurred: README.md describes the checks wrongly again (check:data\'s reference, the states, the start-up cases, the self-test\'s count and time, the views\' count and time).'),
 'R-2': ('5', '(step 5)', 'partly', 'CHANGELOG.md:1854 (step 5 fixed it)', 'CHANGELOG.md:5, :18, :39, :58, :86 ("not merged"); docs/ROADMAP.md:547-548 ("draft PR #77 ... not merged"); CLAUDE.md:744 ("Draft PR #79 holds both records"); git log: 141f890 (#77), c2adefe (#78), 43e3e5b (#79) merged', '',
         'Recurred: five CHANGELOG heads, a ROADMAP paragraph and CLAUDE.md\'s last line call merged pull requests drafts.'),
 'R-3': ('5', '205', 'resolved', 'CHANGELOG.md:1892', '', '', 'Records only.'),
 'R-4': ('5', '(step 5)', 'resolved', 'CHANGELOG.md:1868, :1898', '', 'a11y A11Y-09 (the Now tab\'s hint names a key that does nothing)', 'Records only.'),
 'R-5': ('5', '(step 5)', 'resolved', 'CHANGELOG.md:1902', '', '', 'Records only.'),
 'R-6': ('5', '206', 'resolved', 'CHANGELOG.md:1904, :1978', '', '', 'Records only.'),
 'R-7': ('5', '(step 5)', 'resolved', 'CHANGELOG.md:1863, :1889, :1958', '', '', 'Records only.'),
}
rows = []
for f in ids['findings']:
    i = f['id']
    if i not in J:
        raise SystemExit('no judgement for ' + i)
    step, dec, st, rec, ver, rel, note = J[i]
    rows.append({'id': i, 'severity_2026_10': f['severity'], 'title': f['title'] or fa[f['line']-1][:120], 'final_audit_line': f['line'],
                 'step': step, 'decisions': dec, 'status': st, 'records': rec, 'verified_in_code': ver or None,
                 'related_current_findings': rel or None, 'note': note or None,
                 'mentions': {k: len(v) for k, v in f['mentions'].items()}})
assert len(rows) == 75, len(rows)
cnt = {}
for r in rows: cnt[r['status']] = cnt.get(r['status'], 0) + 1
ver = [r['id'] for r in rows if r['verified_in_code']]
out = {'source': 'docs/FINAL_AUDIT.md (75 findings)', 'audited_tree': 'origin/main 43e3e5b, build f10fe585c46aea576f436ed51ac46f83',
       'counts': cnt, 'verified_in_this_audit': {'n': len(ver), 'ids': ver, 'of_which_records_or_measures_not_code': ['H-17','P-2','R-1','R-2']}, 'findings': rows}
json.dump(out, open(f'{ev}/prior-findings.json', 'w'), indent=1, ensure_ascii=False)
md = ['# The final audit\'s 75 findings: their status after Stage 8', '',
      'Made by `tools/audit-post8/records/prior-findings.py` from `id-mentions.json` and the judgements in the script. "Verified" names the code read',
      'in this audit on the audited tree (`origin/main` `43e3e5b`, build `f10fe585...`); a row without it rests on the records. Statuses: ' +
      ', '.join(f'{k} {v}' for k, v in sorted(cnt.items())) + f'. Read in this audit: {len(ver)} ({", ".join(ver)}); of them H-17, P-2, R-1 and R-2 in records or measures, the other {len(ver)-4} in the code.', '',
      '| id | was | step (decisions) | status | records | verified in code | bears on it now |', '|---|---|---|---|---|---|---|']
for r in rows:
    esc = lambda s: (s or '').replace('|', '\\|')
    md.append(f"| {r['id']} (`FINAL_AUDIT.md:{r['final_audit_line']}`) | {r['severity_2026_10']} | {r['step']} ({esc(r['decisions'])}) | **{r['status']}** | {esc(r['records'])} | {esc(r['verified_in_code'])} | {esc(r['related_current_findings'])}{(' ' + esc(r['note'])) if r['note'] else ''} |")
open(f'{ev}/prior-findings.md', 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print(json.dumps(cnt), 'verified', len(ver))
