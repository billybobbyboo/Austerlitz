# Records: the final audit after Stage 8

Area "records" of the final audit after Stage 8, on `origin/main` `43e3e5b` (PR #79's merge), build `austerlitz-command-map.html`
2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83`. Third attempt: usage limits stopped the first two, which left `size.json`,
`pages-root.html` (with its headers) and `tools/audit-post8/records/id-mentions.py`; all three are reused here, not redone. No application
source, data, threshold, test, archive or build was changed; scripts are in `tools/audit-post8/records/`, evidence here.

## What was examined, and how

1. **The prior audit's 75 findings** (`docs/FINAL_AUDIT.md`). `id-mentions.py` lists every id's mentions in `CHANGELOG.md`,
   `docs/ROADMAP.md` and `docs/STAGE8_SPEC.md`; the step sections those mentions sit in (steps 1-6, 8B, 8E, 8H) were read, and the status of
   each finding judged from them and from the code. 38 findings were read again in this audit, 34 of them at file:line in the code (the blocker
   H-1 and every major: H-2 to H-8, D-1, D-2, S-1, S-2, SW-1 to SW-4, T-0 to T-2, A-1 to A-3; with H-10, H-14, D-4, G-2, G-3, S-3, S-5, S-6,
   SW-7, SW-10, T-8, A-6), four in records or measures (H-17, P-2, R-1, R-2). `prior-findings.py` writes the table.
   **Result:** resolved 64, partly 6 (H-6, H-19, T-7, A-5, R-1, R-2), accepted by decision 2 (H-17 by 189, P-2 by 140), superseded 2 (A-4,
   P-1), open 1 (G-3, never taken up). R-1 and R-2 were fixed in step 5 and have recurred (README.md; the merge status lines).
2. **The carried-issue register** (the audit's spine): every item `docs/STAGE8_SPEC.md` carries to the final audit (sections 20.13, 20.14,
   21.9, 22.6, 23.4, 24.1-24.3, 25.2-25.4) and `docs/ROADMAP.md`'s hand-ons (steps 1, 3, 4, 5, PR #57, step 6 Part A, "Still open in Stage 8",
   the follow-ups commissioned with 8D) and the owner's notes L1-L5, deduplicated into 57 items, C-01 to C-57. Each row: the item, its source
   lines, its governing decision, the evidence the records hold, and its status now, from the records, code read in this audit and the other
   areas' `result.json` (their `carried_status` and findings, cited as "area finding n"; `carried.py` fails if a cited finding does not exist).
   **Result:** accepted 13, provisional 2, open 29, done with residuals 8, not measured 2, recorded 3. Three items are larger than the records
   state (C-06 the hidden counters, C-40 kienmayer@7, C-41 Caffarelli), from the visibility and history areas.
3. **Documentation consistency.** `doc-consistency.py` re-reads every cited line (it fails if a quoted phrase is not on its line) and checks
   what it can (merge commits from `git log --merges`, counts from `package.json`, the self-test manifest, `tools/visual/cases.js` and the
   contrast log). `decision-letters.py` tallies every citation of decisions 255-269 by letter and record.
   **Result:** 22 statements that no longer hold: README.md 10 (its check table: the `check:data` reference, 35 states, six start-up cases,
   242 checks in about 15 minutes, 30 views in about 100 minutes, audit.js "printed only"; "self-contained"; and, served as the Pages root,
   no link to the map and nothing for a visitor on evidence and reconstruction), CHANGELOG.md 5 and docs/ROADMAP.md 3 (merged PRs recorded as
   drafts; ROADMAP and two CHANGELOG heads contradict CLAUDE.md for #77 and #78), CLAUDE.md 3 ("Draft PR #79 holds both records"; the October
   heading; the claims' counts before 8K), checks.yml 1 (the jobs' time). CLAUDE.md's suite numbers are right: 8 of 8 (317, 39, 248/998,
   `CTX_DELETES` 248, `LANG_ALLOW` 2, `CONF_SHARE.land` 0.07, `plans-overview` 13, `f10fe585`). No contradiction between the four records on
   decisions 255-269 but the merge status.

The lead's established facts were not redone (every required check passed on the audited build; `check:visual` on CI run 41394859313).

## Commands (each reads only; outputs here)

```
python3 -I tools/audit-post8/records/id-mentions.py /home/user/Austerlitz docs/audit-post8-evidence/records/id-mentions.json
python3 -I tools/audit-post8/records/prior-findings.py /home/user/Austerlitz docs/audit-post8-evidence/records
python3 -I tools/audit-post8/records/carried.py /home/user/Austerlitz docs/audit-post8-evidence/records
python3 -I tools/audit-post8/records/doc-consistency.py /home/user/Austerlitz docs/audit-post8-evidence/records
python3 -I tools/audit-post8/records/decision-letters.py /home/user/Austerlitz docs/audit-post8-evidence/records/decision-letters.json
node tools/audit-post8/records/castle-site.js /home/user/Austerlitz > docs/audit-post8-evidence/records/castle-site.json
node tools/audit-post8/records/claims-count.js /home/user/Austerlitz > docs/audit-post8-evidence/records/claims-count.json
python3 -I tools/audit-post8/records/result.py docs/audit-post8-evidence/records
```

`size.json` is `node tools/audit/size.js --json` on the audited tree (an earlier attempt); `pages-root.html` the GitHub Pages root fetched on
2 November 2026 at 01:41 GMT (its `last-modified` 1 November 10:57:40 GMT).

## Findings (in `result.json`)

| # | finding | sev / pri | category |
|---|---|---|---|
| 1 | README.md describes the checks wrongly again and calls the file self-contained (R-1 recurred) | S3 / P2 | confirmed-defect |
| 2 | The site's root page is the developer README: no link to the map, nothing for a visitor on evidence and reconstruction | S3 / P2 | confirmed-defect |
| 3 | Merged PRs recorded as drafts in CHANGELOG, ROADMAP and CLAUDE.md, contradicting one another (R-2 recurred) | S3 / P2 | confirmed-defect |
| 4 | CLAUDE.md's file table and heading lag the tree (481/148 claims; "October") | S4 / P4 | confirmed-defect |
| 5 | G-3 never taken up (milo@0 graded A, 1.6 km from "near Pratzen village") | S4 / P3 | unresolved-historical |
| 6 | The carried checklist misstates three of its own items (kienmayer@7, Caffarelli, the 4,033 ms) | S3 / P3 | confirmed-defect |
| 7 | The screen-reader session (175) and the human second reading (189) recorded complete with no results | S3 / P3 | accepted-compromise |
| 8 | Decision 140's premise moved: the self-test 21.7% of the file (12.8% when decided) | S4 / P3 | accepted-compromise |

## Not checked

- No browser run in this area; the on-screen wording the records describe was not rendered here (the visual and accessibility areas did).
- 37 prior findings rest on the records alone; steps 1-3's hand-ons were followed only as far as the later lists carry them.
- C-05's interface text, C-42 (woods redrawn where a wood changed) and most of C-51 (step 4's review records) were not re-examined.
- The perf-attribution, robustness and sources-chronology areas had left no `result.json` when this was written.
- Pull-request states were read from merge commits on `origin/main`, not from the GitHub API.
- `docs/STAGE8_SPEC.md` outside sections 9.4 and 20.13-25.4 was not audited for internal consistency.

## Evidence index

| file | what |
|---|---|
| `result.json` | the area's structured result (findings, coverage, experiments, the register as `carried_status`) |
| `prior-findings.md`, `prior-findings.json` | the 75 findings: step, decisions, status, records, code read, what bears on each now |
| `carried.md`, `carried.json` | the carried-issue register, C-01 to C-57 |
| `doc-consistency.md`, `doc-consistency.json` | the 22 stale statements with file:line, and CLAUDE.md's numbers against the code |
| `decision-letters.json` | every citation of decisions 255-269 by letter and record |
| `id-mentions.json` | each prior finding id's mentions in CHANGELOG, ROADMAP and STAGE8_SPEC |
| `claims-count.json` | the narrative statements' claims counted (704, 148 own, 75 by class, 481 unchecked) |
| `castle-site.json` | the drawn class at the Sokolnitz castle's site ("track") |
| `size.json` | the build's parts (tools/audit/size.js; earlier attempt) |
| `pages-root.html`, `pages-root-headers.txt` | the GitHub Pages root as served (earlier attempt) |
