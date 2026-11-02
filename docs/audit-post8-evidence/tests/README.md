# Area "tests": the tests, benchmarks and evidence quality (final audit after Stage 8)

Audited: `main` at `43e3e5b` (PR #79's merge), build `austerlitz-command-map.html` md5 `f10fe585c46aea576f436ed51ac46f83`, 2,810,630 bytes.
Nothing in the application, its data, thresholds, tests, archive or build was changed. Every experiment ran in an isolated copy (the
repository's tracked files at HEAD, `docs/` and `node_modules/` symlinked and only read); the history was read from a separate clone. This
folder and `tools/audit-post8/tests/` are the area's only writes.

## 1. What was examined

- The regression suite as `npm test` runs it (`tools/run-all.sh`): the build, `node --check bundle.js`, the height guard
  (`tools/stage2/height-sites.js --check`) and the nine suites `css-test.js`, `test.js`, `geo-test.js`, `terrain-test.js`, `audit.js`,
  `sim-test.js`, `redteam.js`, `runtime-test.js`, `binding-test.js`; how a suite is judged (its exit code, and run-all's `FAILS` pattern);
  how each regenerates what it reads (`tools/fresh.js`, `tools/mk-helpers.js`, `tools/mk-world-mod.js`).
- `check:data` (`tools/visual/data-invariance.js`), `check:chronology` (`tools/stage2/chronology.js --check`), `check:contrast`
  (`tools/visual/contrast.js`, `boot-check.js`): statically, and the first two by mutation.
- The harness, statically (no browser in this phase): `harness.js`, `measure.js`, `thresholds.js` (`check`, `requirements`, `expectState`,
  `checkLive`, `checkSelfTest`, `judgeReport`), `cases.js` (39 cases), `motion.js`, `cullmotion.js`, `selftest-manifest.json` (317 names),
  `check-report.js`, `remeasure.js`; the in-app self-test (`app.js` `AUSTERLITZ_DEBUG.selfTest`, lines 9154-14250).
- CI (`.github/workflows/checks.yml`) and, through the GitHub API, the dispatched run that carried `check:visual` on the thresholds of
  decision 267 (a).
- The limits' history (`tools/visual/thresholds.js`, `tools/visual/boot-check.js` `CTX_DELETES`) and the self-test's literal tolerances
  across Stage 8.

## 2. How (commands)

| what | command | result |
|---|---|---|
| baseline, isolated copy | `AUSTERLITZ_SUITE_OUT=… nice -n 19 sh tools/run-all.sh`; `node tools/visual/data-invariance.js archive/stage8k-f10fe585.html austerlitz-command-map.html`; `node tools/stage2/chronology.js --check` | ALL 9 SUITES PASSED (and the height guard); 139 DATA declarations identical; chronology 0 errors (the same as the audit's own run in the working tree, `../checks/`) |
| negative controls | `node tools/audit-post8/tests/mutate.js <isolated copy> <out.json> [ids]` over `tools/audit-post8/tests/mutations-list.js`; merged by `mutations-table.js` | `mutations.json` (each mutation's diff, suites, exit codes, the failing lines) and section 3 |
| threshold history | `HISTORY_GIT_DIR=<full clone> node tools/audit-post8/tests/threshold-history.js thresholds-history-generated.json thresholds-history-generated.md` | `thresholds-history.md` (curated) and the generated tables |
| self-test tolerances before and after Stage 8 | `node tools/audit-post8/tests/selftest-diff.js archive/step5c-45f8f662.html app.js` and a comparison-literal scan of both `AUSTERLITZ_DEBUG` sources | 253 distinct comparisons with a literal before Stage 8, all still present; 218 added; no kept check's condition changed |
| the narrative inventory's reach | `node tools/audit-post8/tests/inventory-reach.js . inventory-reach.json` | 704 statements; 115 prose strings of `data.js`/`analysis.js` match no class (all of kinds `statements.js` excludes by name) |
| CI evidence | GitHub API: run 41259079904 (workflow_dispatch on `d3f7026`) and its jobs | all four jobs succeeded: `visual` (check:visual, 2 h 02 min), `browser (selftest)` (38 min of the job's 60), `browser (contrast)`, `checks` |

The working clone is shallow (`git rev-parse --is-shallow-repository`: true; 472 of `origin/main`'s 644 commits), so `git log` there
attributes changes to boundary commits; the history in this folder was read from a full clone of `origin/main`
(`git clone --bare --filter=blob:limit=200k`).

## 3. Negative controls

RESULTS_TABLE

## 4. Findings

FINDINGS

## 5. CI: what runs when

| check | on every push and pull request | on demand (Actions, "Run workflow", visual ticked) | never in CI |
|---|---|---|---|
| build; the committed HTML equals a fresh build (`git diff --exit-code`) | yes (all jobs) | yes | |
| `npm test` (nine suites, height guard) | yes (`checks`) | yes | |
| `check:data`, `check:chronology` | yes (`checks`) | yes | |
| `check:contrast` (45 states, 8 start-up cases) | yes (`browser`) | yes | |
| `check:selftest` (317 self-test checks; slider, Play, 3E keys, shortcuts, narrow, rmLive, tips, motion on its page, toast, ring, toastLayout) | yes (`browser`) | yes | |
| `check:visual` (39 cases: drop limits, unobstructed shares, map text as rendered, census and culling equivalence, cull motion block, far plates, light, fog, horizon) | no | yes (`visual`, 350 min limit) | |
| `check:baseline` (the md5 pin) | | | yes (the `git diff` step makes it redundant in CI) |
| `check:report`, `check:remeasure` | | | tools for re-judging and re-measuring |

Decision 132 chose this split; a pull request can merge without `check:visual`.

## 6. What could not be checked, and why

- The browser checks were not run by this area (no browser in this phase): `check:contrast`, `check:selftest`, `check:visual`, `check:report`
  and the six (eight) start-up cases were reviewed statically; their candidate mutations are listed for the browser phase. The audit's own
  runner ran `check:contrast` on the audited build (passed: 6,926 text elements in 45 states, 0 below AA, 8 of 8 start-up cases,
  `../checks/check-contrast.txt`); `check:selftest` and `check:visual` were still running there when this area finished.
- The in-app self-test's 317 checks were not read one by one: the review sampled the frame (`ck`, the per-block try/catch, the manifest),
  the derived-tag, arrow, symbol, culling and gait checks, and compared every literal tolerance before and after Stage 8 by script. A
  self-test check whose logic was weakened under an unchanged name would not be found by that comparison unless a literal moved.
- Named constants the self-test reads from `app.js` (for example `CAM_CLEAR`, `ARROW_CAP`, `MLS`, `KLOD`, `GAIT`) were not traced through history;
  `css-test.js` pins most of them by source text, and a name that interpolates one pins it in the manifest.
- Mutations of the test tooling itself (for example `tools/step4/statements.js` dropping a class, or `tools/lang-scan.js` skipping a file) were
  not run: the task asked for mutations of application behaviour or data; their consequences are reasoned from the code (findings on the
  inventory's reach) and the suites' own canaries (redteam.js 6a's reach canaries).
- Timing-sensitive checks were not exercised under controlled load; this audit's machine ran at load averages of 20 to 37 on 4 cores while
  the area's suites ran (they were run at nice 19 where the command allowed; a suite killed by its timeout is recorded as inconclusive).
- CI runs before PR #79 other than 41259079904 were not inspected; the claims of earlier runs rest on `CHANGELOG.md`.

## 7. Files

- `mutations.json`: every negative control (unified diff, suites, exit codes, verdicts, failing lines, restore checks).
- `thresholds-history.md`, `thresholds-history-generated.md`, `thresholds-history-generated.json`.
- `inventory-reach.json`.
- Scripts: `tools/audit-post8/tests/mutate.js`, `mutations-list.js`, `mutations-table.js`, `threshold-history.js`, `selftest-diff.js`,
  `inventory-reach.js`.
