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
  decision 267 (a), the repository's ruleset on `main`, and the check runs of PRs #70-#79 and of main's last three merges.
- The limits' history (`tools/visual/thresholds.js`, `tools/visual/boot-check.js` `CTX_DELETES`) and the self-test's literal tolerances
  across Stage 8.

## 2. How (commands)

| what | command | result |
|---|---|---|
| baseline, isolated copy | `AUSTERLITZ_SUITE_OUT=… nice -n 19 sh tools/run-all.sh`; `node tools/visual/data-invariance.js archive/stage8k-f10fe585.html austerlitz-command-map.html`; `node tools/stage2/chronology.js --check` | ALL 9 SUITES PASSED (and the height guard); 139 DATA declarations identical; chronology 0 errors (the same as the audit's own run in the working tree, `../checks/`) |
| negative controls | `node tools/audit-post8/tests/mutate.js <isolated copy> <out.json> [ids]` over `tools/audit-post8/tests/mutations-list.js` (33 controls: M01 and M24 by the area's first session, the rest on 2 November 2026 in nine batches, one isolated copy each, `MUTATE_TIMEOUT_S` 1800 or 3600); merged by `node tools/audit-post8/tests/mutations-table.js mutations.json <records>` | `mutations.json` (each mutation's diff, suites, exit codes, the failing lines, the mechanism of each catch) and section 3 |
| threshold history | `HISTORY_GIT_DIR=<full clone> node tools/audit-post8/tests/threshold-history.js thresholds-history-generated.json thresholds-history-generated.md` | `thresholds-history.md` (curated) and the generated tables |
| self-test tolerances before and after Stage 8 | `node tools/audit-post8/tests/selftest-diff.js archive/step5c-45f8f662.html app.js` and a comparison-literal scan of both `AUSTERLITZ_DEBUG` sources | 253 distinct comparisons with a literal before Stage 8, all still present; 218 added; no kept check's condition changed |
| the narrative inventory's reach | `node tools/audit-post8/tests/inventory-reach.js . inventory-reach.json` | 704 statements; 115 prose strings of `data.js`/`analysis.js` match no class: most of the kinds `statements.js`'s note excludes (names, `tm.ev` quotations, `tolWhy`, `CLAIM`'s apparatus), but 19 timing bases and 22 plan labels shown to visitors are named nowhere (TS-12) |
| CI evidence | GitHub API: run 41259079904 (workflow_dispatch on `d3f7026`) and its jobs | all four jobs succeeded: `visual` (check:visual, 2 h 02 min), `browser (selftest)` (38 min of the job's 60), `browser (contrast)`, `checks` |
| CI enforcement | GitHub API: `repos/billybobbyboo/Austerlitz/rules/branches/main`, `.../rulesets`; the check runs of PRs #70-#79's heads and of main's merges `141f890`, `c2adefe`, `43e3e5b`; the dispatched runs | one required status check, `checks`; `browser (selftest)` failed on PR #77's head and on its merge `141f890` (green again on `c2adefe`); `visual` skipped on most PR heads (TS-1) |

The working clone is shallow (`git rev-parse --is-shallow-repository`: true; 472 of `origin/main`'s 644 commits), so `git log` there
attributes changes to boundary commits; the history in this folder was read from a full clone of `origin/main`
(`git clone --bare --filter=blob:limit=200k`).

## 3. Negative controls

33 negative controls, each one small change to the application's behaviour or data, written with the check that claims to guard the
property and the auditor's prediction before the run (`tools/audit-post8/tests/mutations-list.js`), applied to an isolated copy of the
audited tree and run against the suites named (`mutate.js`). A suite is judged as `tools/run-all.sh` judges it (a non-zero exit, or a line
matching its `FAILS` pattern); `check:data` and `check:chronology` by their exit codes; a suite killed by its timeout would be inconclusive,
never caught (none was: `runtime-test.js`'s runs took 693 to 1,545 s under the load, within the 1,800 s timeout of the first
batches and the 3,600 s of those restarted for it). M01 and
M24 were run by the area's first session; the rest on 2 November 2026 between 05:41 and 06:41 UTC in nine batches, each on its own copy, at
load averages of 7 to 38 on 4 cores beside other areas' browsers. Every copy was restored byte for byte (sha256) and every rebuild gave the
audited md5. M33 was added after M07's result (below) and M32 for the chronology's word-form hours (TS-13).

"Mechanism" is read from each failing suite's recorded lines by `mutations-table.js`: **semantic** (a check of the property itself),
**claim hash** and **text hash** (review triggers: narrative.js's drift key, check:chronology's L9), **inventory** and **known-warning text**
(change detectors that regenerating the inventory or rewording an acknowledgement clears), **data identity** (`check:data`, whose reference
every data task moves). The columns: the outcome with every check, without `check:data`, and by a semantic check alone.

| id | mutation | claimed guard | suites run | caught by (mechanism) | outcome | without check:data | by a semantic check | predicted |
|---|---|---|---|---|---|---|---|---|
| M01 | a march rate over the ceiling: Saint-Hilaire's wheel (sthilaire@7) given 10 minutes instead of 60 | audit.js MARCH RATE VIOLATIONS (auditMovement: a leg over its arm's ceiling); check:chronology M1 (the movement audit); sim-test.js continuity | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | redteam (known-warning text), sim (semantic), audit (semantic), chron (semantic), data (data identity) | **caught** | caught | caught | caught |
| M02 | a formation's parent changed (Saint-Hilaire's division under V Corps), the children lists left as they were | redteam.js section 4 (COMMAND: parent and children agree); test.js checks only that the parent exists | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data, runtime | redteam (semantic), data (data identity) | **caught** | caught | caught | caught |
| M03 | a formation moved to another corps consistently (parent and both children lists), historically wrong | no suite claims the order of battle's hierarchy beyond consistency; test.js's strength sums (D-3) and KNOWN_WARN; check:data (FORMATIONS guarded) | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data, runtime | test (semantic), redteam (semantic), data (data identity) | **caught** | caught | caught | caught |
| M04 | a narrative statement with its own claim reworded without its hash (bourcier@3 act) | test.js STATEMENT_CLAIMS: h is the hash of the statement's label and text; a reword fails until the claim is reviewed | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | test (claim hash+inventory), data (data identity) | **caught** | caught | missed | caught |
| M05 | an unchecked narrative statement given a factual change (Saint-Hilaire's role: right-hand becomes left-hand assault division) | none in the node suites (a statement without a claim is unchecked by design, decision 130); check:data (FORMATIONS guarded) | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | test (inventory), data (data identity) | **caught** | caught | missed | missed |
| M06 | a claim's reading id pointing to a reading of another source (bourcier@3 act rests on a Davout reading under Mikhailovsky's name) | test.js: every reading id a heading of a register whose source is the one named | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | test (semantic), data (data identity) | **caught** | caught | caught | caught |
| M07 | a claim's reading id pointing to another reading of the same source, on another matter (Kamensky's turn, not Davout at Telnitz) | test.js checks the reading's register entry, source and image status, not that the reading bears on the statement | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | test (semantic), data (data identity) | **caught** | caught | caught | missed |
| M08 | the "derived" tag removed from a formation's march row (the dossier's Marching / Next move reading) | runtime-test.js D-6 (every march row tagged); css-test.js posRow/marchRow pin; the self-test's derivedTagChecks (browser) | css, runtime, test, redteam | runtime (semantic) | **caught** | caught | caught | caught |
| M09 | an event's time moved: the French wheel 13:00-14:00 becomes 13:20-14:20 | check:chronology L3 (a cite of a retimed statement fails); redteam.js PREREQ; sim-test.js event agreement; test.js event validation | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | chron (semantic), data (data identity) | **caught** | caught | caught | caught |
| M10 | a statement's own claim deleted (bourcier@3 act: attributed becomes unchecked) | test.js: the inventory (docs/step4-evidence/inventory.json and .md) current; check:data (STATEMENT_CLAIMS guarded) | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | test (inventory), data (data identity) | **caught** | caught | missed | caught |
| M11 | a banned superlative in a visitor string (LABELS.layers.shows: "What is drawn, the fiercest ground first") | redteam.js section 6a (SUPERLATIVE over every visitor string, tools/lang-scan.js) | redteam, css, test | redteam (semantic) | **caught** | caught | caught | caught |
| M12 | a colour literal outside the palette tables in presentation code (app.js legendHint) | css-test.js Stage 4E palette: every colour literal in app.js in LIGHT, LIGHT_RIG, SPRITE_COL or KIT | css, redteam | css (semantic) | **caught** | caught | caught | caught |
| M13 | an interface colour typed into style.css outside the tokens (#sc-clear:hover color:#ff00aa) | CLAUDE.md: tokens.js "the only source of interface and symbology colours"; css-test.js reads JS colour literals and the day-track inset's rules only | css, build, redteam | nothing | **missed** | missed | missed | missed |
| M14 | a dashed line added to a non-route drawer: the boundaries drawn with dashRuns | binding-test.js section 2 (dashes only in the allowed drawers; buildBoundary solid) | binding, css | binding (semantic), css (semantic) | **caught** | caught | caught | caught |
| M15 | a formation's first positioned anchor without its grade (sthilaire@0 cf removed) | test.js and redteam.js D-2 (the first positioned anchor declares its grade) | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | test (semantic), redteam (semantic), data (data identity) | **caught** | caught | caught | caught |
| M16 | a later anchor's position grade raised without evidence (sthilaire@8 B becomes A) | none in the node suites (grades checked for form, A/B/C, and D-2 on the first anchor only); check:data (FORMATIONS guarded) | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | data (data identity) | **caught** | missed | missed | missed |
| M17 | a strength changed without its note (Saint-Hilaire 6,600 becomes 8,600; the note still says about 6,600) | test.js D-3 strength sums and the OOB pins (Saint-Hilaire not pinned); sim-test.js side totals; check:data | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data, runtime | data (data identity) | **caught** | missed | missed | missed |
| M18 | an anchor's position moved about 0.4 km (sthilaire@5 on the Pratzeberg, 13 map units south) | none in the node suites beyond rates, crossings and named places; check:data | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | redteam (known-warning text), data (data identity) | **caught** | caught | missed | missed |
| M19 | a timed statement retimed: "c. 12:00 Napoleon moves forward from the Zuran" becomes c. 12:30 | check:chronology L3 (a cite that no longer resolves to a live statement carrying its time) | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | test (inventory), chron (semantic), data (data identity) | **caught** | caught | caught | caught |
| M20 | a timed statement reworded, its time kept: "the causeway comes under fire" becomes "under heavy fire" | check:chronology L9 (the cited statement's text hash) and --times (an explicit time's quoted evidence must be in the sources) | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | test (inventory), chron (semantic), data (data identity) | **caught** | caught | caught | caught |
| M21 | an explicit anchor time's quoted evidence altered (sthilaire@7: "Napoleon swung his centre" for "turned") | check:chronology times rule (--times: every explicit time's evidence quote found in the sources) | chron, test, data | chron (semantic), data (data identity) | **caught** | caught | caught | caught |
| M22 | a tour stop's quoted derived figure changed ("about 39,000" becomes "about 45,000") | sim-test.js 2b (the tour quotes the live plateau figures within 600) | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | test (claim hash+inventory), sim (semantic), chron (text hash), data (data identity) | **caught** | caught | caught | caught |
| M23 | the plateau reading kept one phase longer (PLATEAU_LAST 6 becomes 7) | runtime-test.js (the derived readings shown exactly where the Allied hold the heights up to phase 6, the rule written in the test); the self-test's plateauDayChecks | runtime, css, test, sim, data | runtime (semantic) | **caught** | caught | caught | caught |
| M24 | a presentation site reads the model height: buildBoundary's label placed with height() instead of groundY() | the height guard (tools/stage2/height-sites.js --check): no presentation site calls height()/hAt() | height, css, binding | height (semantic) | **caught** | caught | caught | caught |
| M25 | the model's march-rate ceiling for infantry loosened (SPEED_CEIL.inf 5.0 becomes 6.0) | check:chronology F2 (legs at 80% of the ceiling named exactly); check:data (SPEED_CEIL guarded) | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | redteam (known-warning text), data (data identity) | **caught** | caught | missed | caught |
| M26 | a disputed event's hour graded A (Kienmayer's attack on Telnitz) | test.js T-6 (a disputed hour graded A fails, question 143) | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | test (semantic), data (data identity) | **caught** | caught | caught | caught |
| M27 | a village moved about 0.28 km (Kobelnitz, 9 map units east) | geo-test.js (every surveyed village within 0.5 km of ground truth); check:data (VILLAGES guarded) | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | data (data identity) | **caught** | missed | missed | missed |
| M28 | an event naming only a formation that is not yet on the field (Kienmayer's attack on Telnitz at 07:00 names the guns on the heights, which arrive at 12:45) | redteam.js section 1 (every event's named formations on the field at its mid-window); sim-test.js reports an event naming no plotted formation as not tested | test, redteam, sim, audit, binding, geo, terrain, css, height, chron, data | redteam (semantic), data (data identity) | **caught** | caught | caught | caught |
| M29 | presentation code overrides a guarded datum at start-up (init() moves sthilaire@5 0.4 km), the data file unchanged | check:data (DATA byte-identical: it compares declarations, and lists a changed interface declaration without failing); CLAUDE.md: never fix or alter data through the display | runtime, css, test, redteam, sim, audit, chron, data | nothing | **missed** | missed | missed | missed |
| M30 | the formation dossier shows a strength 25% above the data's (dossierFormation's Approximate strength) | none found: no suite reads the dossier's strength row against FORMATIONS (runtime-test.js and the self-test check other dossier rows) | runtime, css, test, redteam, data | nothing | **missed** | missed | missed | missed |
| M31 | an overlay objective placed off the map in y (phase 0's Telnitz objective at y 608; the frame is 500 deep) | test.js overlays: "objective off map" (test.js:96 reads the objective's x only) | test, redteam, binding, sim, data | data (data identity) | **caught** | missed | missed | missed |
| M32 | a word-form hour retimed in an unchecked timing note (dok@1: "the departure at seven" becomes "at nine"; the anchor's dep stays 07:00) | check:chronology: "every timed statement in data.js and analysis.js is cited by a REVIEW row or allowed by name" (its extractor reads clock-shaped hours only, CLAUDE.md: handed on); test.js: the inventory current (a change detector: the statement is unchecked, no claim hash). Predicted: check:chronology misses, test.js fails on the stale inventory only | chron, test, redteam, sim, data | test (inventory), data (data identity) | **caught** | caught | missed | caught |
| M33 | a claim's reading swapped for a page-image reading of the same source on another matter (bourcier@3 act: Davout at Telnitz becomes Bagration, p. 198) | test.js checks a reading's register entry, its source and its page-image status (test.js:438-446), not that it bears on the statement or that its pages agree with the claim's locator; the inventory carries each claim's readings (a change detector) | test, redteam, chron, data | test (inventory), data (data identity) | **caught** | caught | missed | caught |

**Reading.**

- **Caught**: 30 of 33 failed some check; 26 failed a check other than `check:data`; 19 failed a semantic check.
- **Missed by everything**: M13 (an interface colour typed into style.css outside the tokens); M29 (presentation code overrides a guarded datum at start-up); M30 (the formation dossier shows a strength 25% above the data's).
- **Missed by every check but `check:data`**: M16 (a later anchor's position grade raised without evidence); M17 (a strength changed without its note); M27 (a village moved about 0.28 km); M31 (an overlay objective placed off the map in y). Inside a data task `check:data`'s reference is the task's own build, so these
  are guarded by no automated check at the moment they change (TS-2, TS-10, TS-11).
- **Caught only by change detectors or review triggers** (`check:data`, the inventory's freshness, an acknowledged warning's text, the
  claim hash): M04 (test: claim hash+inventory, data: data identity); M05 (test: inventory, data: data identity); M10 (test: inventory, data: data identity); M16 (data: data identity); M17 (data: data identity); M18 (redteam: known-warning text, data: data identity); M25 (redteam: known-warning text, data: data identity); M27 (data: data identity); M31 (data: data identity); M32 (test: inventory, data: data identity); M33 (test: inventory, data: data identity). Of these only M04's claim hash is the guard the property was given (a reworded claimed statement must be
  reviewed); every other is cleared by regenerating what changed.
- **Claimed and missed** (a check whose own words cover the property passed): M08 (css-test.js:380's march-row pin; runtime-test.js held
  the behaviour, TS-7); M13 (CLAUDE.md's rule that tokens.js is the only source of interface colours, which no check reads in style.css,
  TS-9); M25 (audit.js, sim-test.js and check:chronology's ceiling rules, whose bound is the mutated constant, TS-8); M31 (test.js:96,
  'objective off map', TS-10); M32 (check:chronology's 'every timed statement', TS-13); M29 (check:data's purpose as CLAUDE.md states it,
  that data is not altered through the display, TS-3).
- **Surprises** (the prediction was wrong, or right for the wrong reason): M05, predicted missed, failed test.js, but only on the inventory's freshness: `docs/step4-evidence/inventory.json` carries every
  statement's text, so a reword of any of the 704 statements fails test.js until the inventory is regenerated (`node
  tools/step4/inventory.js`), which asks for no review; the same mechanism alone caught M10, M32 and M33. M07, predicted missed, failed
  test.js's page-image rule because the reading swapped in (`md1844.p186-187.kamensky~C1.10`) is "page image, part on the text layer";
  M33 swaps in a page-image reading of the same source on another matter (`md1844.p198.bagration`, the claim's locator left at
  "pp. 178-179") and fails the inventory's freshness only: neither the reading's relevance nor its pages against the locator are checked.
  M25, predicted caught by check:chronology's F2, passed check:chronology (its shares are taken against the raised ceiling), audit.js and
  sim-test.js (which read the same constant); only redteam.js's acknowledged warning, whose text carries the infantry mean rate (1.35
  became 1.36), and check:data failed (TS-8). M18, predicted missed, failed redteam.js through the same acknowledged warning (the moved anchor
  lengthens Saint-Hilaire's two legs; the infantry mean rate became 1.36): a tripwire on the second decimal of an average, not a check of
  the position; a move that left the mean's second decimal as it was would pass it. M02's runtime-test.js: the first session's log (`tests-work/mutate.log`) recorded it
  "FAILED (caught)" at 900 s, then mutate.js's timeout misread as a failure; re-run with the corrected runner it passed (1,545 s):
  runtime-test.js's parent/child dry run renders commands and detachments but does not compare a parent with its children's lists;
  redteam.js section 4 caught the inconsistency. M03 was caught only because Saint-Hilaire's 6,600 men do not fit under V Corps' declared
  12,700 (test.js D-3 and the 30% warnings in test.js and redteam.js); a formation small enough to fit would pass (test.js:72-74, read, not run). M23: check:data
  passed, since `PLATEAU_LAST` (when the derived plateau reading is shown) is not a guarded declaration; runtime-test.js's rule written in
  the test caught it, and its run also printed a spurious watchdog line under the load (TS-18).
- **What held**: the movement audit and continuity (M01: audit.js, sim-test.js, check:chronology); command consistency (M02: redteam.js
  section 4); the D-3 sums (M03, incidentally); the claim hash as the review trigger it is meant to be (M04, M22) and the reading's source
  and page-image rules (M06, M07); D-6's derived tag
  (M08: runtime-test.js, not css-test.js); check:chronology's cites, text hashes and evidence quotes (M09, M19, M20, M21); the overclaim scan
  (M11); the palette rule over JavaScript (M12); the dash rule (M14); D-2 (M15); the tour's live figures (M22: sim-test.js); the plateau rule
  written in the test (M23: runtime-test.js); the height guard (M24); the disputed-hour rule T-6 (M26); the events' temporal rule (M28:
  redteam.js section 1).

## 4. Findings

Eighteen findings, numbered TS-1 to TS-18 (this area's numbers; docs/FINAL_AUDIT.md's T-n are cited as such). Severity: S1 critical;
S2 major (a check that passes whatever happens to the property it claims to guard, on a primary path); S3 minor (a weaker check than
claimed, or a property with no check); S4 polish. Status: confirmed (shown here by a run, by the code or by the GitHub API), inferred (read
from the code, not run), unverified. Mutation ids refer to section 3 and `mutations.json`.

| id | finding | severity | priority | category | origin | status |
|---|---|---|---|---|---|---|
| TS-1 | The merge gate requires only the node job: check:selftest and check:contrast are not required checks, check:visual gates nothing, and main carried a failing self-test for a day | S2 | P2 | probable-problem | inherited | confirmed |
| TS-2 | Historical values a data task may change are held only by change detectors that the task itself resets: a strength, a later anchor's grade, a position, a village, the order of battle's hierarchy and a claim's reading fail no check of the property | S3 | P2 | untested | inherited | confirmed |
| TS-3 | Presentation code can rewrite a guarded datum at run time and every check passes, check:data included | S3 | P3 | confirmed-defect | inherited | confirmed |
| TS-4 | No check reads the formation dossier's strength against the data | S3 | P3 | confirmed-defect | inherited | confirmed |
| TS-5 | The harness's figure-on-ground and standard-foot checks pass when nothing is measured | S3 | P3 | confirmed-defect | inherited | confirmed |
| TS-6 | The gait's drawn shader and its JavaScript mirror are never compared: the feet-on-ground, contact and culling-envelope checks verify the mirror | S3 | P3 | untested | inherited | inferred |
| TS-7 | css-test.js holds source text, not behaviour: its march-row pin passed a march row stripped of its 'derived' tag | S3 | P4 | confirmed-defect | inherited | confirmed |
| TS-8 | Checks take their bounds from the code under test: a 20% looser infantry march-rate ceiling passes every movement check, and the self-test checks decided values against the code's own constants | S3 | P3 | confirmed-defect | inherited | confirmed |
| TS-9 | Interface colours typed into style.css are read by no check | S3 | P3 | untested | inherited | confirmed |
| TS-10 | test.js's 'objective off map' reads the objective's x only | S3 | P4 | confirmed-defect | inherited | confirmed |
| TS-11 | geo-test.js holds the surveyed villages to 0.5 km of ground truth while the worst is 20 m | S3 | P3 | optional-improvement | inherited | confirmed |
| TS-12 | The statement inventory is a whitelist with no completeness check: timing bases and plan labels a visitor reads are outside it and outside its own exclusion note | S3 | P3 | probable-problem | inherited | confirmed |
| TS-13 | check:chronology judges clock-shaped hours only; 45 inventoried statements give hours in words it does not read | S3 | P3 | probable-problem | inherited | confirmed |
| TS-14 | The motion benchmark's ceilings and visibility baselines equal the build's own counts: they detect change, not quality; Play now accepts a formation hidden for 4,033 ms | S3 | P3 | accepted-compromise | accepted-compromise | confirmed |
| TS-15 | CTX_DELETES allows 248 context warnings where the case has measured 193 since 8C | S4 | P4 | optional-improvement | accepted-compromise | confirmed |
| TS-16 | The self-test manifest holds names and a count, not conditions | S4 | P4 | optional-improvement | inherited | confirmed |
| TS-17 | Several 'caught' results come from change detectors that a mechanical regeneration clears: the suites' semantic coverage is narrower than their failure count | S4 | P4 | optional-improvement | inherited | confirmed |
| TS-18 | Wall-clock limits make the suites load-sensitive: runtime-test.js's 30 s font watchdog fired under load in this audit, and run-all.sh kills a suite at 600 s | S4 | P4 | probable-problem | inherited | confirmed |

### TS-1. The merge gate requires only the node job: check:selftest and check:contrast are not required checks, check:visual gates nothing, and main carried a failing self-test for a day

Severity **S2**, priority P2; probable-problem; origin inherited; status confirmed. Subsystem: CI (.github/workflows/checks.yml; the repository ruleset on main).

- Evidence: The repository's only ruleset on main ('protect main.', id 24036909, created 2026-09-26 09:06 UTC, enforcement active) requires a pull request and one status check, context 'checks' (the node job: build, the committed HTML against a fresh build, npm test, check:data, check:chronology; checks.yml:22-40). The browser jobs 'browser (contrast)' and 'browser (selftest)' were added on 2026-10-07 (fd6e537, decision 132) and were never added to the required checks; the job 'visual' runs only on a dispatch with 'visual' ticked (checks.yml:75-76). Check runs read through the GitHub API: PR #77's head ec911c9 has 'browser (selftest)' failure; its merge 141f890 (2026-10-31 07:55 UTC) has 'browser (selftest)' failure (completed 08:44:41) and the Pages jobs 'build' and 'deploy' success; main's next merge c2adefe (2026-11-01 06:55, decision 267 (a)) has it success. 'visual' was skipped on the heads of PRs #71, #73 and #76-#79, passed on #70, #72 and #74, and failed on #75 (8J, merged into its stacked branch, not main); the last dispatched run before the audit (41259079904 on d3f7026, 2026-11-01) passed all four jobs.
- Expected: Decision 132 put check:contrast and the self-test on every push; a merge into main (and the deployment that follows) waits for them, or a merge over a red browser check is an owner decision recorded as one.
- Observed: Neither browser check gates a merge. The one merge over a red self-test (#77) was made knowingly (CLAUDE.md: 'every required check passes but that one line in check:selftest and check:visual') and was held by the owner's judgement, not by the gate. check:visual's 39 cases (drop limits, unobstructed shares, map text at AA as rendered, census and culling equivalence, the cull motion block, far plates, light, fog, horizon, the phone cases) are required for no merge.
- User impact: A build whose in-app self-test (317 checks of what a visitor is shown) or contrast states fail can be merged into main and deployed. It happened once in Stage 8: 141f890 (PR #77) was merged and deployed with its self-test failing (the known one-line benchmark excess of question 267), and main stayed red until c2adefe the next day.
- Remedy: Add 'browser (contrast)' and 'browser (selftest)' to the ruleset's required status checks (a settings change; no code). Keep check:visual on demand (decision 132's cost: two to six hours a run), but record in CHANGELOG.md the dispatched run that measured each merged build, or require it on pull requests that touch app.js, world.js, style.css, tokens.js or tools/visual/. Validation: a draft PR with one self-test check made to fail shows the merge blocked.

### TS-2. Historical values a data task may change are held only by change detectors that the task itself resets: a strength, a later anchor's grade, a position, a village, the order of battle's hierarchy and a claim's reading fail no check of the property

Severity **S3**, priority P2; untested; origin inherited; status confirmed. Subsystem: node suites (test.js, geo-test.js, sim-test.js, audit.js, redteam.js); check:data.

- Evidence: M16: failed data (data identity); M17: failed data (data identity); M18: failed redteam (known-warning text), data (data identity); M27: failed data (data identity); M33: failed test (inventory), data (data identity); M03: failed test, redteam, data (data identity). (M07, which swapped in a reading made partly on the text layer, failed test.js's page-image rule, not a relevance check; M33 swaps in a page-image reading of the same source on another matter and fails only the inventory's freshness.) check:data (data-invariance.js:69-86) fails on any byte of a guarded declaration, and CLAUDE.md requires a data task to move its reference to the task's own build. test.js's strength checks are sums against the parent (test.js:72-74: an error only when the children exceed the parent, a warning beyond 30%) and 13 pinned strengths (test.js:495-505; Saint-Hilaire's is not among them, nor are the other leaf formations'); the grade rule D-2 covers the first positioned anchor only; the claim check verifies that a reading id is registered, of the source named and read on page images, not that it bears on the statement.
- Expected: The properties the project ranks first (historical and data integrity) have checks that fail on a plausible slip inside a data task: a strength that disagrees with its own note, a grade raised without a reading, a place moved off its sourced site.
- Observed: None failed a check of the property itself: M16, M17 and M27 failed check:data alone; M18 failed redteam.js only through an acknowledged warning's text (the infantry mean rate's second decimal moved); M33 failed test.js only on the inventory's freshness; M03 failed the strength sums only because the moved division does not fit under its new corps' declared strength. Within a data task check:data's reference is the task's own build and the inventory and the acknowledgements are regenerated by the task, so none of these would fail anywhere.
- User impact: A wrong figure, grade or place entered during a data task (the only time such values change) reaches the visitor with every automated check green; only the reviewer's reading of the CHANGELOG's list of changed declarations stands between it and the map.
- Remedy: Add data-integrity checks that hold between data tasks and within them: (1) every strength's note carries the number shown or names it as this map's working figure (M17: note 'about 6,600', value 8,600); (2) every anchor grade A or B names its reading (a reading id per graded anchor, checked like STATEMENT_CLAIMS); (3) pin every leaf formation's strength and every village and anchor position to its CHANGELOG-recorded value with a tolerance of tens of metres, regenerated only by the data task's own command, so that a data task's diff of the pins is the review list; (4) for a claim's reading, keep the human check but list the readings each claim's statement cites in the sources sheet's index (already shown) and in the data task's CHANGELOG entry.

### TS-3. Presentation code can rewrite a guarded datum at run time and every check passes, check:data included

Severity **S3**, priority P3; confirmed-defect; origin inherited; status confirmed. Subsystem: check:data (tools/visual/data-invariance.js); runtime-test.js; the self-test.

- Evidence: M29: every suite run passed (runtime, css, test, redteam, sim, audit, chron, data). The mutation sets FORMATIONS.sthilaire.track[5].p to a point 0.4 km south as init()'s first statement. data-invariance.js compares the declarations' source text: a changed rendering or interface declaration is listed ('Rendering and interface declarations changed', :79) and the exit code counts DATA declarations only (:86).
- Expected: A check that the guarded declarations are not written after load: the data the visitor is shown is the data declared.
- Observed: check:data printed 'Rendering and interface declarations changed (1): init' and 'All 139 DATA declarations are byte-identical to the original build' and exited 0 (docs/audit-post8-evidence/tests/m29-check-data.txt); runtime-test.js, css-test.js, test.js, redteam.js, sim-test.js, audit.js and check:chronology passed (sim-test.js, audit.js and check:chronology read the declarations through their own module, not the running app).
- User impact: A display-side override (CLAUDE.md: 'Never fix a data problem by changing only the display') would move a formation on screen away from its declared, sourced anchor with no failing check; the dossier, the map and the day-track would all show the overridden value.
- Remedy: In runtime-test.js (and the self-test), deep-freeze or hash every guarded declaration of check:data's DATA list before init() and compare after init and after the dry runs; fail on any difference. Validation: M29 fails runtime-test.js.

### TS-4. No check reads the formation dossier's strength against the data

Severity **S3**, priority P3; confirmed-defect; origin inherited; status confirmed. Subsystem: runtime-test.js; the self-test; app.js dossierFormation.

- Evidence: M30: every suite run passed (runtime, css, test, redteam, data). The mutation multiplies the full dossier's strength (app.js:7975) by 1.25; the compact card's row (app.js:7809) is left as it was. runtime-test.js opens 40 formation dossiers and checks their other rows (the position pill, the claims' tags, the derived tags), not the strength. In the self-test (read, not run: no browser in this phase) the map layer's naming check accepts any 'about N' in a formation's accessible name by its pattern (app.js:9634-9637), and no check reads the dossier's strength row (no match for 'Approximate strength' or a strength comparison in AUSTERLITZ_DEBUG).
- Expected: Every figure the dossier shows (strength, guns, the army total) equals the data's, or its derived value (aggStrength) for an aggregate.
- Observed: Every suite run passed.
- User impact: The full dossier's 'Approximate strength' is the figure a visitor reads; a display error there (here 25% too high) is materially misleading and passes every check.
- Remedy: In runtime-test.js, for every formation, parse the dossier's and the compact card's strength and guns and compare them with FORMATIONS (or aggStrength for an aggregate). Validation: M30 fails runtime-test.js.

### TS-5. The harness's figure-on-ground and standard-foot checks pass when nothing is measured

Severity **S3**, priority P3; confirmed-defect; origin inherited; status confirmed. Subsystem: check:visual (tools/visual/thresholds.js check(), requirements(); measure.js figures()).

- Evidence: thresholds.js:429 tests 'm.figures.count&&m.figures.maxErr>0.02' and :430 'm.standards.count&&...'; requirements() (thresholds.js:663-695), written under decision 131 (T-5: 'every measure the case's kind calls for is required: a build or a report without it fails, where before step 1 a missing measure skipped its check without a word'), requires the layer, the docking, the timeline, the smoke, the census and the ground reader's self-check, but no figure or standard count. measure.js:430-445 counts only instanced meshes whose geometry is in the app's kitGeos(). The gate is in the restored Stage 0 file (4156ee7); on this build the counts are about 6,000 per landscape case (docs/stage8-evidence/8l/report-two-cases.json), so the gap is latent.
- Expected: A landscape case in which figures are drawn requires figures.count > 0 (and standards.count > 0 where standards are drawn), as T-5 requires every other measure.
- Observed: The check is skipped when the count is 0.
- User impact: If a refactor stopped listing the kit's geometries (kitGeos) or the poles, every case would report no figure and no standard and the 'a figure is N units off the drawn ground' check would pass silently in all 39 cases.
- Remedy: In requirements(), for a landscape case, need(m.figures.count>0) and need(m.standards.count>0) where the case shows figures; keep the 0.02 bound. Validation: the browser candidate in docs/audit-post8-evidence/tests/browser-candidates.json (kitWrap without its push) then fails the case.

### TS-6. The gait's drawn shader and its JavaScript mirror are never compared: the feet-on-ground, contact and culling-envelope checks verify the mirror

Severity **S3**, priority P3; untested; origin inherited; status inferred. Subsystem: the in-app self-test (8E/8F gait checks); runtime-test.js; css-test.js.

- Evidence: The self-test's 'the gait on the ground' check (app.js:13430-13501) and the culling envelope check (app.js:12905) place vertices with animAt, 'the hook's arithmetic in JavaScript' (app.js:1017-1020); runtime-test.js's contact check (runtime-test.js:1418-1448) does the same. No check reads a posed vertex back from the GPU (or evaluates animGLSL) and compares it with animAt; css-test.js pins the hook's table and parts by source text (css-test.js:484, 587). The browser candidate (docs/audit-post8-evidence/tests/browser-candidates.json: the thigh swing scaled in the GLSL only) was not run: no browser in this phase.
- Expected: At least one check compares the drawn pose (a rendered silhouette or a transform-feedback-free readback of a posed instance) with animAt, so that the mirror is held to the shader.
- Observed: The gait checks are internally consistent with the mirror only.
- User impact: A change to the vertex hook's arithmetic (animGLSL) that is not made in animAt would leave every gait check green while the figures drawn float, sink or swing differently from what the checks measure; the culling envelope computed from the mirror could then also be too small.
- Remedy: Add a self-test check that renders one posed instance at two phases into a small target and compares its lowest drawn pixel row and silhouette with animAt's projection (within a pixel), at both levels of detail. Validation: the GLSL-only swing change then fails it.

### TS-7. css-test.js holds source text, not behaviour: its march-row pin passed a march row stripped of its 'derived' tag

Severity **S3**, priority P4; confirmed-defect; origin inherited; status confirmed. Subsystem: css-test.js.

- Evidence: M08: failed runtime. css-test.js:380 fails only when 'derivedTag()' is absent from marchRow's whole source; the mutation removed it from the visitor's path (the 'Marching' / 'Next move' return) and left it on the readHidden path, so the pin held. runtime-test.js:756-783 renders every march row at every half hour and caught it ('the march row untagged', 720 rows). css-test.js has 434 '.test(' calls, most over app.js's or style.css's text, against 9 behaviour checks (css-test.js:197). In M14 css-test.js's failure came from a pin on the boundary's drawn options ('the bounds are not tested against the ground'), binding-test.js's from the dash rule itself.
- Expected: A check named for a behaviour (the march row tagged) tests the behaviour, or says that it pins text.
- Observed: The pin passes any refactor that keeps one occurrence of the token, and fails refactors that keep the behaviour.
- User impact: None on this build: runtime-test.js caught the stripped tag. The weakness is that css-test.js's 434 regular expressions over the source are counted as guards of behaviours they only partly see.
- Remedy: Where a behavioural check exists (runtime-test.js D-6 here), drop or relabel the source pin as a text pin; where it does not, write the behaviour check in runtime-test.js.

### TS-8. Checks take their bounds from the code under test: a 20% looser infantry march-rate ceiling passes every movement check, and the self-test checks decided values against the code's own constants

Severity **S3**, priority P3; confirmed-defect; origin inherited; status confirmed. Subsystem: audit.js, sim-test.js, check:chronology, redteam.js; the in-app self-test.

- Evidence: M25: failed redteam (known-warning text), data (data identity). audit.js:45, sim-test.js:40 and chronology.js:627 read SPEED_CEIL from the code under test, so raising it raises their bound; redteam.js failed only because an acknowledged warning's text carries the infantry mean rate (redteam.js:108, acknowledged at :348 as 1.35; it became 1.36). In the browser layer the arrow check's condition is 'S.maxPx<=ARROW_CAP.PX+0.5' with ARROW_CAP.PX in its name (app.js:10915-10916); the decided 16 px is held by css-test.js's source pin (css-test.js:391) and by the manifest, whose names (288 of 317 carry digits) change when an interpolated constant changes.
- Expected: The decided or sourced value is written in the test (as runtime-test.js:545 writes the plateau rule, 'not read from PLATEAU_LAST') or pinned by a check that names the decision.
- Observed: For SPEED_CEIL no check outside check:data holds the value; for the browser constants the value is held by text pins and names, and the self-test verifies only that the code does what its constant says.
- User impact: A model limit that keeps the march believable (SPEED_CEIL) or a decided presentation value (the arrow cap of decision 241) can change with the code that it is meant to restrain, and the behavioural checks follow it.
- Remedy: Write the ceilings into audit.js (or a test-owned table checked against SPEED_CEIL with its decision reference) and fail on a difference; list the decided constants the self-test reads in one test-owned table with their decision numbers, checked by css-test.js against the code.

### TS-9. Interface colours typed into style.css are read by no check

Severity **S3**, priority P3; untested; origin inherited; status confirmed. Subsystem: css-test.js (palette); check:contrast.

- Evidence: M13: every suite run passed (css, build, redteam). The palette rule reads world.js, app.js and symbols.js (css-test.js:275); in style.css only the day-track inset's rules are scanned for a colour (css-test.js:858). Today style.css carries 14 colour literals outside its generated tokens block: black or near-black shadows and a vignette (for example style.css:573), and the developer readout's (style.css:757-758); none is a visitor's interface colour, so the rule CLAUDE.md states for tokens.js holds today by review, not by a check.
- Expected: CLAUDE.md: tokens.js is 'the only source of interface and symbology colours'; a colour literal in style.css outside the tokens block fails unless it is a shadow or the developer readout, named.
- Observed: M13's #ff00aa hover colour passed css-test.js, the build and redteam.js.
- User impact: A colour outside the tokens (for example a low-contrast hover colour) can enter style.css with every check green; check:contrast reads visible text in its 45 states, not :hover, :focus or :active rules.
- Remedy: Extend the palette rule to style.css after the tokens block, with a short named allow-list (the shadows' black alphas, the vignette, #devstats). Validation: M13 then fails css-test.js.

### TS-10. test.js's 'objective off map' reads the objective's x only

Severity **S3**, priority P4; confirmed-defect; origin inherited; status confirmed. Subsystem: test.js (overlays).

- Evidence: M31: failed data (data identity). test.js:96: '(o.obj||[]).forEach(p=>{ if(p[0]<0||p[0]>MAPF.w) errs.push("phase "+i+": objective off map"); })': y is not tested, while the arrows', lines' and bounds' points use offMap(p) on both axes (test.js:93).
- Expected: The objective's point tested with offMap(p), as the other overlay points are.
- Observed: Phase 0's Telnitz objective at y 608 (the frame is 500 deep) passed.
- User impact: An overlay objective placed off the field's depth (y beyond the frame) would draw off the map or at its edge with the check green.
- Remedy: Use offMap([p[0],p[1]]) at test.js:96. Validation: M31 then fails test.js.

### TS-11. geo-test.js holds the surveyed villages to 0.5 km of ground truth while the worst is 20 m

Severity **S3**, priority P3; optional-improvement; origin inherited; status confirmed. Subsystem: geo-test.js.

- Evidence: M27: failed data (data identity). geo-test.js:83 'every surveyed village within 0.5 km of ground truth' (worst on this build Blasowitz, 20 m; the feature markers likewise 0.5 km, worst 20 m, geo-test.js:89).
- Expected: After the correction passes, a tolerance near the measured worst (for example 0.1 km), loosened only by a data task with its reason.
- Observed: Kobelnitz moved 0.28 km east passed geo-test.js.
- User impact: A village can be moved up to about 480 m (24 times today's worst error) by a slip in a data task with geo-test.js green; the geographic corrections of 8J and 8K are protected only by check:data.
- Remedy: Tighten both to 0.1 km (or to each place's own recorded tolerance) and record the change in CHANGELOG.md.

### TS-12. The statement inventory is a whitelist with no completeness check: timing bases and plan labels a visitor reads are outside it and outside its own exclusion note

Severity **S3**, priority P3; probable-problem; origin inherited; status confirmed. Subsystem: tools/step4/statements.js; test.js (claims); narrative.js.

- Evidence: inventory-reach.js: 704 inventoried statements; 765 prose-like guarded strings in data.js and analysis.js, 115 of them matching no class. Most are what statements.js's note excludes (names, tm.ev quotations, tolWhy, CLAIM's apparatus), but 19 FORMATIONS.*.track[n].tm.basis strings (rendered in the dossier's Timing row, app.js:7989), 8 PLANS.*.staging[n].n and 2 PLANS.*.objectives[n].n labels (drawn as map labels by planLabel, app.js:4521, 4536) and 12 PLANS.*.cols[n].n (the Plans tab's row labels, app.js:4625) are statements or labels with a claim in them and are not named in the exclusion note. No check asserts that every guarded prose path matches a class or an exclusion.
- Expected: Every visitor-facing narrative string is inventoried or excluded by a named rule, and a test fails on a guarded prose path that is neither.
- Observed: The inventory's reach is whatever its 24 patterns (21 classes) match.
- User impact: 19 timing bases shown in every timed dossier ('grade B · app narrative, unsourced') and 22 plan labels drawn on the map or listed in the Plans tab ('Soult concealed in the Goldbach valley', 'The bait - Legrand, then Davout') carry no claim and are not counted as unchecked; a new narrative field added to the data would be outside the inventory silently.
- Remedy: Add an exclusion table to statements.js (pattern, reason) and a test.js check that every guarded prose record of data.js and analysis.js matches a class or an exclusion; decide whether tm.basis and the plan labels are statements (then inventory them) or apparatus (then exclude them by name).

### TS-13. check:chronology judges clock-shaped hours only; 45 inventoried statements give hours in words it does not read

Severity **S3**, priority P3; probable-problem; origin inherited; status confirmed. Subsystem: check:chronology (tools/stage2/chronology.js timesIn).

- Evidence: M32: failed test (inventory), data (data identity). timesIn (chronology.js:98-109) reads 'HH:MM', ranges, 'after HH:MM', 'a quarter to/past', 'half past', 'N o'clock' and 'noon'/'midday'; it does not read 'at seven', 'about nine', 'past two', 'after three', 'toward eight'. tools/audit-post8/tests/word-hours.js over tools/step4/statements.js's 704 statements finds 45 with such a word-form hour (13 with no clock-shaped hour besides); 33 have a claim of their own (hashed), 12 are unchecked (timing notes, SOURCE_NOTE.body).
- Expected: Every timed statement judged, as check:chronology's L-rules claim, or the word forms listed as unjudged by name.
- Observed: Recorded in CLAUDE.md as handed on (its check:chronology paragraph since roadmap step 4); still open. M32 retimed an unchecked timing note from seven to nine and check:chronology passed.
- User impact: A retimed 'about nine' or 'at seven' is not compared with the movement model; for 33 statements the claim's hash forces a review of the reword, for 12 unchecked ones only the inventory's freshness fails, which regenerating the inventory clears.
- Remedy: Extend timesIn to 'at|about|by|before|after|past|toward|near <number word>' (the day runs 04:00-18:00, so the hour maps as hr() already does) and review the new cites; or list the word-form statements in ALLOW_TIMED with reasons.

### TS-14. The motion benchmark's ceilings and visibility baselines equal the build's own counts: they detect change, not quality; Play now accepts a formation hidden for 4,033 ms

Severity **S3**, priority P3; accepted-compromise; origin accepted-compromise; status confirmed. Subsystem: check:selftest and check:visual (thresholds.js MOTION).

- Evidence: MOTION={JUMPS:248, POPS:998, FLICKER:10, LOD:130, ...} (thresholds.js:270): JUMPS and POPS are 8K's build's own totals (decision 267 (a)), LOD 130 its own, FLICKER 10 against 9 measured; decision 257 (b) calls them 'ceilings of this benchmark, not a guarantee of what a device shows'. The VIS floors were re-baselined in 8J and 8K under the owner's brief of 30 October 2026 (thresholds.js:274-296), hybrid-play's longest-hidden ceiling 3,100 to 4,033 ms (+30%, thresholds.js:289, 308), and kept by decision 267 (a), which names Play's 4,033 ms as a final-audit item. The audit's own check:selftest run measured, over the 16, jumps 248, pops 998, level-of-detail switches 130 and flickers 9 (docs/audit-post8-evidence/checks/check-selftest.txt:324-339): three of the four totals exactly at their ceilings, one more jump or pop fails.
- Expected: Accepted by the owner as benchmark pins; the final audit to judge the 4,033 ms on screen.
- Observed: As accepted; no absolute level of label stability is asserted anywhere.
- User impact: The label layer's stability in motion is held to 'no worse than the build of 8K', not to a stated level; in the Play run a formation's name may stay hidden for four seconds (was 3,100 ms before 8K).
- Remedy: Keep the pins; add one absolute bar the owner can accept (for example: no formation hidden by the layout for more than 2 s in any driven run, protected items never), and judge Play's 4,033 ms case on screen in the final report.

### TS-15. CTX_DELETES allows 248 context warnings where the case has measured 193 since 8C

Severity **S4**, priority P4; optional-improvement; origin accepted-compromise; status confirmed. Subsystem: check:contrast (tools/visual/boot-check.js).

- Evidence: boot-check.js:30 CTX_DELETES=248 (decision 212 (b), the count measured then); since 8C waits for the step's first frame the case gives 193 (CLAUDE.md; this audit's check:contrast: '193 “does not belong to this context” warnings (at most 248)').
- Expected: A regression bound near the measured count once the measure changed.
- Observed: The bound kept at the older, higher count.
- User impact: None directly; 55 more 'does not belong to this context' warnings (geometries disposed across a context loss) would pass unseen.
- Remedy: Re-baseline to 193 (or a small margin) with an owner decision, as decision 212 (b) set it.

### TS-16. The self-test manifest holds names and a count, not conditions

Severity **S4**, priority P4; optional-improvement; origin inherited; status confirmed. Subsystem: check:selftest (thresholds.js checkSelfTest; selftest-manifest.json).

- Evidence: checkSelfTest fails a missing, added, renamed or duplicated check and any failing one (thresholds.js:976-988); the manifest (317 names) is written by check-report.js --write-manifest from a passing run. selftest-diff.js over the last pre-Stage-8 build (step5c-45f8f662) and today's app.js: 131 checks with a literal name in both, none with a changed condition; 253 literal comparisons before Stage 8, all still present. So no literal tolerance of a kept check was loosened in Stage 8; a weakening by logic would not show in that comparison.
- Expected: The manifest, or a companion, records each check's condition (or a hash of its source) so that a changed condition is listed for review.
- Observed: Names only.
- User impact: A self-test check weakened under an unchanged name (a tolerance widened, a branch skipped) passes the manifest; only review would see it.
- Remedy: Write a hash of each ck() call's condition source into the manifest beside its name (check-report.js --write-manifest), and list changed hashes in the harness's report.

### TS-17. Several 'caught' results come from change detectors that a mechanical regeneration clears: the suites' semantic coverage is narrower than their failure count

Severity **S4**, priority P4; optional-improvement; origin inherited; status confirmed. Subsystem: test.js (inventory freshness), redteam.js and test.js (KNOWN_WARN exact texts), check:chronology L9, check:data.

- Evidence: Of 33 negative controls, 30 failed some check, 26 some check other than check:data, and 19 a semantic check (mutations-table.js's reading of each failing suite's lines). Caught only by change detectors or review triggers: M04 (test: claim hash+inventory, data: data identity); M05 (test: inventory, data: data identity); M10 (test: inventory, data: data identity); M16 (data: data identity); M17 (data: data identity); M18 (redteam: known-warning text, data: data identity); M25 (redteam: known-warning text, data: data identity); M27 (data: data identity); M31 (data: data identity); M32 (test: inventory, data: data identity); M33 (test: inventory, data: data identity). M01's, M18's and M25's redteam.js failures came from the acknowledged warning 'cavalry mean rate 0.83 is not above infantry 1.35' (redteam.js:348), whose text carries a number every timing change moves.
- Expected: Each control's catch attributed to the check that holds the property.
- Observed: See section 3's mechanism column.
- User impact: None directly; a reader counting failing suites overstates what is checked. Regenerating the inventory (node tools/step4/inventory.js), rewriting an acknowledged warning's text or --rehash --write clears these failures without any statement of truth being checked.
- Remedy: Report change-detector failures separately in tools/run-all.sh's summary ('changed: the inventory', 'changed: an acknowledged warning') from property failures, so that a reviewer sees which kind failed.

### TS-18. Wall-clock limits make the suites load-sensitive: runtime-test.js's 30 s font watchdog fired under load in this audit, and run-all.sh kills a suite at 600 s

Severity **S4**, priority P4; probable-problem; origin inherited; status confirmed. Subsystem: runtime-test.js (the font dry runs' watchdog); tools/run-all.sh (per-suite timeout); the in-app self-test (the pan move's median); check:visual (LAYER_MS).

- Evidence: runtime-test.js:1652 fails the suite if its asynchronous font dry runs have not finished 30 s (wall clock) after the watchdog is set; in this audit's M23 run (runtime-test.js at nice 19 beside other areas' browsers, 1,403 s for the whole suite) it fired ('E FONTS: the dry runs did not finish within 30 s') beside the mutation's genuine failure; in the other six runtime-test.js runs (693-1,545 s) it did not. tools/run-all.sh:35 kills each suite at 600 s: runtime-test.js took 693-1,545 s in this audit's loaded runs, so npm test on such a machine would fail without a defect (CI's runners are not shared; the audit's own npm test took 402 s in all, checks/summary.txt). The self-test's landscape-controls check requires a pan move's median at most 2 ms (app.js:11322) and check:visual each case's layer pass under 8 ms (thresholds.js:155, 482); the audit's own check:selftest passed on this shared machine (5,422 s, checks/summary.txt).
- Expected: Timing budgets measured as CPU time or guarded against load, or reported as such.
- Observed: One spurious failure line seen (the font watchdog, M23's run); the browser budgets held under load; not exercised further.
- User impact: A loaded runner can fail a correct build (a flake), or a slow regression can hide on a fast one.
- Remedy: Measure the font dry runs' watchdog in the dry runs' own steps (or raise it with a reason) and let run-all.sh's timeout be set by an environment variable for loaded machines; report the browser budgets' margins in the harness's report and run the browser candidate (the same build with and without a CPU load) once.

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

Decision 132 chose this split; a pull request can merge without `check:visual`. The repository's ruleset ("protect main.", id 24036909) requires one status check, `checks`; the two browser jobs are not required, so a pull request can also merge with `check:contrast` or `check:selftest` failing: PR #77 did (its merge `141f890` red on `browser (selftest)` until `c2adefe`), knowingly (TS-1).

## 6. What could not be checked, and why

- The browser checks were not run by this area (no browser in this phase): `check:contrast`, `check:selftest`, `check:visual`, `check:report`
  and the six (eight) start-up cases were reviewed statically; their candidate mutations are listed for the browser phase in
  `browser-candidates.json`. The audit's own
  runner ran `check:contrast` on the audited build (passed: 6,926 text elements in 45 states, 0 below AA, 8 of 8 start-up cases,
  `../checks/check-contrast.txt`) and `check:selftest` (317 of 317 checks and every live block, 5,422 s, `../checks/check-selftest.txt`); `check:visual` was not run by this audit's runner while this area was written.
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
- CI: the check runs of PRs #70-#79 and of main's last three merges were read (TS-1); runs before PR #70 were not inspected, and the 27 most recent dispatched `check:visual` runs were listed (9 passed, 13 failed, 5 cancelled, most during development), not read; the claims of earlier runs rest on `CHANGELOG.md`.
- Whether the owner means the browser checks to be optional for a merge (TS-1) was not asked; the finding rests on the ruleset and the check runs.
- Seven controls ran `runtime-test.js` (M02, M03, M08, M17, M23, M29, M30) beside other areas' browsers, 693-1,545 s a run; one of the seven runs (M23's) printed a spurious line from a wall-clock watchdog (TS-18), beside that mutation's genuine failure.

## 7. Files

- `mutations.json`: every negative control (unified diff, suites, exit codes, verdicts, failing lines, the mechanism of each catch, restore checks).
- `result.json`: this area's structured result (scope, coverage, findings TS-1 to TS-18, experiments, what was not checked).
- `ci-gate.json`: the GitHub API's answers behind TS-1 (the rules on `main`, the rulesets, the check runs of PRs #70-#79's heads and of main's last three merges), read on 2 November 2026.
- `m29-check-data.txt`: `check:data`'s output under M29 (init() moving a guarded anchor; exit 0), behind TS-3.
- `browser-candidates.json`: the eleven browser mutations written for a browser phase, not run.
- `selftest-diff.json`: the self-test's literal-named checks before Stage 8 (step5c-45f8f662) and now, compared by `selftest-diff.js`.
- `thresholds-history.md`, `thresholds-history-generated.md`, `thresholds-history-generated.json`.
- `inventory-reach.json`.
- Scripts: `tools/audit-post8/tests/mutate.js`, `mutations-list.js`, `mutations-table.js`, `threshold-history.js`, `selftest-diff.js`,
  `inventory-reach.js`, `word-hours.js`.
