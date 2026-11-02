# Documentation consistency (final audit after Stage 8)

Made by `tools/audit-post8/records/doc-consistency.py` (each quoted phrase re-read on its line).

## Statements that no longer hold

| file:line | says | instead | evidence | kind |
|---|---|---|---|---|
| README.md:4 | "one self-contained HTML file" | three.js r128 loads from cdnjs.cloudflare.com at start-up; without that host the map shows its failure dialog ("The map needs a network connection ...") | shell.html:437 (the script tag, integrity sha512, crossorigin); shell.html:28; CLAUDE.md:3 states it with the qualification ("three.js r128 from cdnjs") | stale / overclaim |
| README.md:27 | "continuity and coverage are printed only" | audit.js asserts both since roadmap step 5 (T-9 (b)) | CHANGELOG.md:1936; CLAUDE.md (Checks: "since roadmap step 5 audit.js asserts its continuity ... and coverage") | stale |
| README.md:28 | "archive/step5c-45f8f662.html" | check:data compares against archive/stage8k-f10fe585.html (moved in 8E, 8G, 8H, 8J and 8K) | package.json:9 | stale |
| README.md:30 | "35 interface states" | 45 states (10 at 390 x 844 as a phone) | docs/audit-post8-evidence/checks/check-contrast.txt: states 45 (10 at 390 x 844 as a phone): 45 reached; console messages 0, failing 0 / boot cases: 8 of 8 pass | stale |
| README.md:30 | "the six start-up cases" | eight start-up cases (context-depth since 8C, context-gait since 8E) | docs/audit-post8-evidence/checks/check-contrast.txt ("boot cases: 8 of 8 pass"); tools/visual/boot-check.js | stale |
| README.md:31 | "242 checks" | 317 checks | tools/visual/selftest-manifest.json (count) | stale |
| README.md:31 | "about 15 minutes" | about 21-43 minutes on CI since 8C-8G (CLAUDE.md); 5,422 s on this audit's shared machine | CLAUDE.md (check:selftest); docs/audit-post8-evidence/checks/summary.txt | stale |
| README.md:32 | "30 fixed views" | 39 fixed views | tools/visual/cases.js | stale |
| README.md:32 | "about 100 minutes" | two to four hours (CI run 41394859313: 2 h 1 min; 169-250 minutes on 8E and 8F) | .github/workflows/checks.yml:6 ("about three to four hours"); CLAUDE.md (check:visual) | stale |
| README.md:3 | "A historically grounded, interactive reconstruction" | The README is the page GitHub Pages serves at the site's root, and it says nothing to a visitor of what is evidence and what is reconstruction, and does not link the map (the file is named in code formatting; the page's only link is to itself) | docs/audit-post8-evidence/records/pages-root.html and pages-root-headers.txt (fetched 2 Nov 2026 01:41 GMT, last-modified 1 Nov 10:57:40 GMT) | missing (visitor) |
| CLAUDE.md:744 | "Draft PR #79 holds both records" | PR #79 was merged into main on 1 November 2026 (43e3e5b) | git log --merges origin/main | stale status |
| CLAUDE.md:497 | "## Current state (October 2026)" | the section runs to 1 November 2026 (decisions 267-269) | CLAUDE.md:734-745 | stale heading |
| CLAUDE.md:24 | "484 after decision 210 (c), 145" | since 8K: 704 statements, 481 unchecked, 148 with a claim of their own, 75 by class | CHANGELOG.md:204; counted in this audit (narrative.js, tools/step4/statements.js) | stale count |
| CHANGELOG.md:5 | "draft PR #79 into `main`" | merged (43e3e5b) | git log --merges origin/main | stale status |
| CHANGELOG.md:18 | "draft PR #79 into `main`" | merged (43e3e5b) | git log --merges origin/main | stale status |
| CHANGELOG.md:40 | "not merged" | merged (43e3e5b, PR #79) | git log --merges origin/main | stale status |
| CHANGELOG.md:58 | "a draft pull request into `main`, for review; not merged" | merged (c2adefe, PR #78) | git log --merges origin/main; CLAUDE.md:738 says merged | stale status (contradicts CLAUDE.md) |
| CHANGELOG.md:86 | "a draft pull request into `main`, for review; not merged" | merged (141f890, PR #77) | git log --merges origin/main; CLAUDE.md:734 says merged | stale status (contradicts CLAUDE.md) |
| docs/ROADMAP.md:510 | "pull request for review, not merged" | PR #73 merged (b7fb67a) | git log --merges origin/main | stale status |
| docs/ROADMAP.md:535 | "review, not merged" | PR #74 merged into main (72c7e1b); #75 and #76 merged into their stacked branches and brought into main by 8L | git log --merges origin/main | stale status |
| docs/ROADMAP.md:548 | "not merged" | PR #77 merged (141f890) | git log --merges origin/main; CLAUDE.md:734 says merged | stale status (contradicts CLAUDE.md) |
| .github/workflows/checks.yml:5 | "each about 8-15 minutes" | the self-test alone takes 21-43 minutes on CI since 8C-8G | CLAUDE.md (check:selftest) | stale comment |

## Numbers CLAUDE.md states, held against the code

| what | CLAUDE.md | code | where | agree |
|---|---|---|---|---|
| self-test manifest | 317 | 317 | tools/visual/selftest-manifest.json | True |
| check:visual cases | 39 | 39 | tools/visual/cases.js | True |
| MOTION.JUMPS / POPS | 248 / 998 | JUMPS:248, POPS:998 | tools/visual/thresholds.js:270 | True |
| CTX_DELETES | 248 | 248 | tools/visual/boot-check.js:30 | True |
| LANG_ALLOW entries | 2 | 2 | redteam.js:228-240 | True |
| CONF_SHARE.land | 0.07 | 0.07 | tools/visual/thresholds.js:238 | True |
| plans-overview drop limit | 13 | 13 | tools/visual/thresholds.js:117 | True |
| check:baseline md5 | f10fe585c46aea576f436ed51ac46f83 | f10fe585c46aea576f436ed51ac46f83 | package.json:8 | True |
