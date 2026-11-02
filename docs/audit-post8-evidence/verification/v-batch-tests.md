# Verification v-batch-tests: the tests area's minor and polish findings (TS-2 to TS-18)

Adversarial check of `docs/audit-post8-evidence/tests/result.json` findings[1..17]. Audited build `austerlitz-command-map.html`,
2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83`; tree at HEAD, its application files identical to `origin/main` 43e3e5b.

Method. Code read at HEAD for every finding. Cheap negative controls re-run, with the area's own edits (`tools/audit-post8/tests/mutations-list.js`),
on an isolated copy (`/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad/v-batch-tests-iso`, made from
`iso-template`; files restored byte for byte, the build's md5 checked after the build ran) by
`tools/audit-post8/verification/v-batch-tests/rerun.js`. Record: `v-batch-tests/rerun.json`. Command:

    node tools/audit-post8/verification/v-batch-tests/rerun.js <iso> <out.json> M25:audit,sim,chron,redteam M31:test,binding M27:geo \
      M29:data M13:css M08:css M17:test,redteam,sim

| control | suites re-run | result here |
|---|---|---|
| M25 SPEED_CEIL.inf 5.0 to 6.0 | audit, sim, chron, redteam | audit 0 violations; sim 0 disagreements; chron exit 0; redteam fails only on the acknowledged warning's text (1.35 to 1.36) |
| M31 objective y 608 | test, binding | both exit 0 |
| M27 Kobelnitz +9 units | geo | exit 0 (unmodified worst: Blasowitz 20 m) |
| M29 init() rewrites sthilaire@5 | check:data | exit 0: "Rendering and interface declarations changed (1): init"; "All 139 DATA declarations are byte-identical"; build after restore f10fe585 |
| M13 `#sc-clear:hover{color:#ff00aa}` | css | exit 0 |
| M08 march row untagged | css | exit 0 |
| M17 sthilaire 8,600, note "about 6,600" | test, redteam, sim | all exit 0 |

Not re-run: runtime-test.js (700-1,500 s per run on this shared machine; the area's records read instead), anything in a browser.

## Per finding

**#1 TS-2 (S3 P2): CONFIRMED; priority corrected to P3.** test.js:51-57 holds D-2 on the first positioned anchor only; test.js:67-74 errs only when
children exceed the parent; test.js:495-503 pins 13 strengths (Saint-Hilaire not among them); test.js:438-446 checks a reading's register entry,
source and page-image status, not its bearing; data-invariance.js:69-86 is identity. M17 re-run passed test, redteam and sim. Remedy: (1) is
feasible (24 of 30 formations with a strength and a note carry the figure; dok, lang, kamensky, prz, bag and constantine give a range or a sum
containing it, so the rule must accept ranges); (2) is a sourcing task (90 declared grades on 180 positioned anchors, 44 A and 34 B), not a test;
(3) is another change detector a data task regenerates. Days of work with an owner agreement is not P2's "quick fix".

**#2 TS-3 (S3 P3): CONFIRMED.** data-invariance.js:79 lists, :86 exits on DATA only; M29's check:data re-run exits 0. No freeze or hash of guarded
data in runtime-test.js or the self-test (grep). Remedy caveat: a deep-freeze breaks the app, which caches onto FORMATIONS entries (`f._anchors`,
app.js:3276; `f._gaitCum`, app.js:5830); hash the declared keys, skipping `_` caches.

**#3 TS-4 (S3 P3): CONFIRMED** by reading. app.js:7975-7976 and 7811-7813 render the strength; "Approximate strength" is in no test; runtime-test.js's
strength references are the claims (:642), the plateau (:353, :553, :789) and battalions (:1500); the self-test's name pattern takes any "about N"
(app.js:9634-9637). M30 not re-run (its recorded pass is consistent). Extra: the order-of-battle tab's strengths (app.js:7276-7296) are equally unchecked.

**#4 TS-5 (S3 P3): WEAKENED to S4 P4, optional-improvement.** The harness gate (thresholds.js:429-430) is skipped at count 0 and requirements()
does not require a count, but the self-test, judged check by check in check:selftest and inside check:visual, requires placements:
app.js:11350 `fig1?(fw.n===0&&fw.worst===0):(fw.n>0&&fw.worst<=0.02)` over 78 states (13 clocks x 2 presentations x 3 highlights) at each of 4x and 10.33x, with the same `kitGeos()` (figureError,
app.js:9503-9523), and app.js:12473-12474 requires `nStd>0`. The finding's scenario (kitGeos or kitWrap listing nothing) fails both runs; the
harness gate is a redundant second check. Residual: one case drawing no figures would not fail.

**#5 TS-6 (S3 P3): CONFIRMED; origin corrected to new-regression.** Every gait check places vertices with `animAt` (app.js:1017-1020;
runtime-test.js:1418-1448; the envelope via animPoses, app.js:12846-12850). 8D's controlled deformation (app.js:12819-12846) reads the GPU frame and
shadow map but asserts only that they change (`dF2>0`, `dS>0`). No test evaluates `animGLSL`; css-test.js:484, 587 are text pins. `animAt` and
`animGLSL` came with 8D (4cb72b1, `git log -S`), the gait with 8E: Stage 8's gap.

**#6 TS-7 (S3 P4): WEAKENED to S4 P4, optional-improvement; origin of the cited instance new-regression.** M08 re-run: css-test.js passes.
css-test.js:380 needs one `derivedTag()` anywhere in marchRow. marchRow has two at HEAD (app.js:7926 readHidden, 7929 the visitor's path), one in
`archive/step5c-45f8f662.html`: 8C's readHidden path (6fd80ea) made the pin blind to M08; before Stage 8 it would have failed. runtime-test.js D-6
(756-783) holds the behaviour, so the pin is redundant, not a missing guard. 434 `.test(` occurrences confirmed; css-test.js also executes data and
LABELS in vm (309-331, 909-912).

**#7 TS-8 (S3 P3): WEAKENED to S4 P4; its SPEED_CEIL half overlaps tests #1.** M25 re-run: audit, sim and chron pass, redteam fails only on the
warning text. audit.js:45, sim-test.js:40, chronology.js:627 read SPEED_CEIL from the code: true, but SPEED_CEIL is a guarded model declaration
(M25 fails check:data, which CI runs: checks.yml:37), the tests #1 mechanism. The browser example is held as the finding's own expectation asks:
css-test.js:391 pins `ARROW_CAP={PX:16, Q:1.1, OP:0.62, M:0.97}` in a block naming decision 241 (css-test.js:386-406), and three manifest names carry
"16 px". 288 of 317 names carry digits: confirmed. No decided constant without such a pin was shown.

**#8 TS-9 (S3 P3): CONFIRMED.** M13 re-run passes css-test.js. css-test.js:275 scans world.js, app.js, symbols.js; :858 scans style.css only after
"/* Stage 5G" (style.css:876-884). After the tokens block (style.css:1-4): 15 literals on 14 lines (73, 120, 252, 496, 534, 573 x2, 577, 647, 651,
757, 758 x2, 800, 821), black shadows, the vignette and #devstats; no visitor colour today. contrast.js forces no :hover. (14 is the line count.)

**#9 TS-10 (S3 P4): CONFIRMED.** test.js:96 tests `p[0]` only; :93 uses `offMap` on both axes. M31 re-run passes test.js and binding-test.js.

**#10 TS-11 (S3 P3): CONFIRMED.** geo-test.js:83 and :89 at 0.5 km; worst 20 m (Blasowitz) for both; M27 re-run passes. geo-test.js:85 already holds
the post house to 0.05 km. Partly overlaps tests #1's village case and is its cheap property remedy.

**#11 TS-12 (S3 P3): WEAKENED (scope).** No completeness check (grep) and none of tm.basis, PLANS.*.cols[n].n, staging[n].n, objectives[n].n
matches a class (statements.js:15-40): true. But tm.basis has two values in data.js ("app narrative, unsourced" 19, "source" 6), a method
enum the note's "enums and keys" covers in substance; the 12 column names are the note's "names" (one or two interpretive, "The bait - Legrand,
then Davout"). Clearly outside both: the 10 plan labels drawn by planLabel (app.js:4521, 4536), 8 staging and 2 objectives.

**#12 TS-13 (S3 P3): CONFIRMED; numbers corrected.** chronology.js:98-109 reads clock forms only. word-hours.js reproduces 45 (33 own, 12
unchecked), but 21 of its 80 matches are no unread hour: "past N" in "half past N" (read by timesIn) or quantities ("about two hours", "about eleven
thousand", "near nine thousand", "at four times speed", "at nine to nine and a half thousand"). Refined: 59 unread hours in 41 statements, 31 with
their own hashed claim, 10 unchecked (`v-batch-tests/word-hours-context.txt`, made by `word-hours-context.js`). CLAUDE.md records it as handed on.

**#13 TS-14 (S3 P3, accepted-compromise): CONFIRMED.** Summed from check-selftest.txt:324-339: jumps 248, pops 998, LOD 130, flicker 9 over the 16;
thresholds.js:270 `{JUMPS:248, POPS:998, FLICKER:10, LOD:130}`; hybrid-play `[2033,3388,4033]` (thresholds.js:308; 3,100 before, :289).
STAGE8_SPEC.md:5515 keeps the 4,033 ms open for this audit. Decisions 257 (b) and 267 (a) stand; the finding re-requires neither.

**#14 TS-15 (S4 P4): CONFIRMED; origin better "inherited".** boot-check.js:30 248 (decision 212 (b)); check-contrast.txt:13 193. STAGE8_SPEC.md:1929-1932:
the bound caught 8B's first build (256), the fix gave 199 here and 195 on CI, "The bound is unchanged"; :2114, 193 after 8C. The count varies by
2-6 between machines, so a re-baseline needs a margin; decision 212 (b)'s premise (the count measured) changed without an owner decision on the slack.

**#15 TS-16 (S4 P4): CONFIRMED.** thresholds.js:976-988 compare names, count and `ok`; selftest-diff.json: 131 kept, 0 conditions or numbers changed.

**#16 TS-17 (S4 P4): CONFIRMED.** mutations.json summary 33 / 30 / 26 / 19 and the 11 change-detector catches as listed; redteam.js:348's text
moves under M18 and M25 (M25 re-run: the same two lines).

**#17 TS-18 (S4 P4): CONFIRMED.** runtime-test.js:1652 (30 s), run-all.sh:35 (600 s); M23 printed the watchdog line; the seven runtime runs took
693-1,545 s, all over 600 s on this shared machine (an environment condition, not an application failure); app.js:11322, thresholds.js:155, 482.

## Extra issues
- The order-of-battle tab's strengths (app.js:7276-7296) and the compact card's Strength row (app.js:7811-7813) are read by no check: S4, an
  extension of TS-4's scope, inherited.
- TS-3's deep-freeze remedy would break the app's caches on FORMATIONS (app.js:3276, 5830): a remedy caveat.
