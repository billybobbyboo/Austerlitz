# The checks' limits through history (final audit after Stage 8, area "tests")

Generated tables: `thresholds-history-generated.md` and `.json` (this folder), by
`HISTORY_GIT_DIR=<full clone> node tools/audit-post8/tests/threshold-history.js <out.json> <out.md>`.
The working clone at `/home/user/Austerlitz` is **shallow** (`git rev-parse --is-shallow-repository`: true; 472 commits visible of
`origin/main`'s 644), so its boundary commits hide their parents. The history was therefore read from a partial bare clone of
`origin/main` made for this audit in the scratchpad (`git clone --bare --filter=blob:limit=200k`, HEAD `43e3e5b`, 644 commits): every
non-merge commit that touched `tools/visual/thresholds.js` (68) or `tools/visual/boot-check.js` (10), each revision evaluated on its own
and compared with its own parent's, key by key. Direction rules are in the generated file's header.

Totals for `thresholds.js`: 467 limit paths added (each new case's first limits, set from the build of the day by the file's own rule),
48 tightened, 36 loosened, 30 removed, 17 changed (words or lists), 1 mixed. `boot-check.js` (`CTX_DELETES`): 1 added, 1 tightened, 1
loosened.

## Every loosening, and what approved it

| commit | date | limit | was | is | approval (where recorded) |
|---|---|---|---|---|---|
| `7b3222e` | 2026-10-01 | `DROP_LIMIT.selected-formation` | 3 | 4 | owner decision 62 ("the tight count, the previous build's in the same framing"; `thresholds.js:29-35`) |
| `7b3222e` | 2026-10-01 | `DROP_LIMIT.narrow-1024` | 5 | 6 | owner decision 62 (same) |
| `9e56e1d` | 2026-10-07 | `DROP_LIMIT.eye-zuran` | 5 | 6 | decision 141 (a), the one re-measure after the embedded fonts (`thresholds.js:99-106`) |
| `9e56e1d` | 2026-10-07 | `DROP_LIMIT.plans-overview` | 11 | 12 | decision 141 (a) |
| `9e56e1d` | 2026-10-07 | `DROP_LIMIT.narrow-390` | 6 | 7 | decision 141 (a) (the case retired since, decision 233 (a)) |
| `9e56e1d` | 2026-10-07 | `UNOBSTRUCTED.first-run` | [0.634, 0.52] | [0.626, 0.507] | decision 141 (a) |
| `9e56e1d` | 2026-10-07 | `UNOBSTRUCTED.first-run-laptop` | [0.558, 0.52] | [0.546, 0.507] | decision 141 (a) |
| `9e56e1d` | 2026-10-07 | `UNOBSTRUCTED.narrow-390` | [0.468, 0.52] | [0.46, 0.507] | decision 141 (a) |
| `83a7e45` | 2026-10-08 | `UNOBSTRUCTED.narrow-390` | [0.46, 0.507] | [0.438, 0.507] | decision 146 (`thresholds.js:125`) |
| `3be0491` | 2026-10-11 | `UNOBSTRUCTED.narrow-1024` | [0.535, 0.628] | [0.533, 0.628] | decision 164 (`thresholds.js:126`) |
| `3d2d133` | 2026-10-17 | `DROP_LIMIT.narrow-1024` | 6 | 7 | decision 199 (b) (`thresholds.js:36-40`) |
| `8140533` | 2026-10-20 | `CTX_DELETES` (boot-check.js) | 40 | 248 | decision 212 (b) (`boot-check.js:30-31`) |
| `15b2dcc` | 2026-10-21 | `DROP_LIMIT.narrow-1024` | 7 | 8 | decision 214 (`thresholds.js:41-47`) |
| `1b5a5e4` | 2026-10-22 | `PHONE.reachAllow.*.eyes.depth` (7 phone cases) | 2 (watch 3) | 3 (watch 4) | Part B's review fixes; accepted with every phone limit "as measured" by decision 232 (a) (`thresholds.js:180-188`) |
| `e008825` | 2026-10-26 | `UNOBSTRUCTED.first-run`, `first-run-laptop`, `narrow-1024`, `phone-844x390-explore` | [0.626, 0.507], [0.546, 0.507], [0.533, 0.628], 0.690 | [0.625, 0.506], [0.546, 0.506], [0.532, 0.628], 0.687 | decision 256 (a), re-measured on CI's browser by `remeasure.js --accept-loosening 256`, which refuses any other loosening (`thresholds.js:147-154`) |
| `0ed98b9` | 2026-10-30 | `MOTION.VIS` drawn floors of 7 runs (hybrid-pan, hybrid-zoom, hybrid-orbit, land-zoom, low-orbit, hybrid-orbit+sel, hybrid-pan+al) lowered by 2-40 formation-frames; 6 others raised | see generated file | | the owner's brief of 30 October 2026 for the follow-up 8J ("geographic baselines updated only where the authorized data change justifies it, with the reason recorded"; `thresholds.js:274-283`) under decision 259 (a); not a numbered decision of its own |
| `5efb458` | 2026-10-30 | `MOTION.VIS`: drawn floors of 10 runs lowered (by 9 to 120 formation-frames, hybrid-play 2,153 to 2,033), 9 raised; longest-hidden ceilings raised in 4: hybrid-play 3,100 to **4,033 ms** (+30%), hybrid-orbit+sel 2,000 to 3,033 ms, hybrid-zoom 1,533 to 2,133 ms, phone-pan+touch 1,367 to 1,467 ms; denominators moved in 8 | see generated file | | the same brief, under decision 260 (a) (`thresholds.js:284-296`); "kept" by decision 267 (a) ("every VIS baseline unchanged"), which names Play's 4,033 ms as a final-audit item |
| `0b7b77c` | 2026-10-31 | `DROP_LIMIT.plans-overview` | 12 | 13 | the owner's conditional authorisation of 31 October 2026 on question 267's Plans line ("a case-specific limit of 13 only if the corrected geography explains it and essential information remains readable and accessible"; `thresholds.js:107-117`) |
| `d3f7026` | 2026-11-01 | `MOTION.JUMPS`, `MOTION.POPS` | 245, 985 | 248, 998 | decision 267 (a) (`thresholds.js:255-269`) |

Every loosening traces to an owner decision or an owner brief recorded in the file beside the value and in `CHANGELOG.md`. No limit was
loosened silently. Two caveats for the final report:

1. The 8J and 8K visibility re-baselines (`MOTION.VIS`) were made under a general rule in the owner's brief, by the implementer applying
   it, not by a decision naming the values; decision 267 (a) later kept them all. The largest is the longest hidden formation in Play
   (hybrid-play), raised from 3,100 to 4,033 ms: a test of "fewer jumps must not be bought by hiding formations" now accepts a formation
   hidden for four seconds in that run.
2. Removals are not loosenings in the table above but deserve a line each: `KNOWN.hybrid-dimmed` (a known overlap, removed when fixed,
   2026-09-26: a tightening); `DROP_LIMIT` and `UNOBSTRUCTED` of `narrow-390` (the case retired by decision 233 (a), its screen measured
   by `phone-390-first`); `MOTION.LOD_8B` (replaced by `MOTION.LOD` 130 under decision 257 (b)); `CONSOLE_ALLOW`'s one entry (emptied by
   the app fix of roadmap step 3); seven `PHONE.cutAllow` entries (the caption's phase title, no longer cut: tightenings).

## The tightenings, in brief

`DROP_LIMIT.selected-formation` 5 to 3 (2D); Stage 3B's and 3C's raised unobstructed baselines (every 2C baseline replaced by the
build's own, rounded down to 0.1 point); `PAPER_MIN_PXKM` 25 to 28 and 19 to 21 (3C); 7B's first-run baselines; `CONF_SHARE.land`
0.20 to 0.07 (8B, decision 254 (a)); `MOTION` 300/1,300/200 to 245/985/10 (decision 257 (b), the benchmark's own counts);
`CTX_DELETES` 60 to 40 (step 3); and 8J's and 8K's raised drawn floors (`MOTION.VIS`, 6 and 9 runs; 8K also lowered two longest-hidden ceilings, hybrid-orbit and paper-pan).

## What the limits now measure

- **Regression baselines, not absolute bars.** Each `DROP_LIMIT` and `UNOBSTRUCTED` value is what a named earlier build measured in that
  view (the 2C canvas pass, or the build that added the case, "never raised"): they detect a change, not a quality level. Absolute bars
  do exist beside them: overlap (none), map text at AA as rendered, the 10.5 px floor, the layer pass under 8 ms, solid black under 0.05%,
  the smoke's quarter, the census budgets (2.8 million triangles, 900 calls on a desktop case).
- **The motion block's ceilings equal the build's own counts.** `JUMPS` 248 and `POPS` 998 are exactly what 8K's build gives (`check:selftest`
  and `check:visual` on CI and here); `FLICKER` 10 against 9 measured, `LOD` 130 against 130. They are deterministic benchmark pins
  (decision 257 (b): "ceilings of this benchmark, not a guarantee of what a device shows"): one more jump fails, but no level of label
  stability is asserted.
- **Slack left after a measure improved.** `CTX_DELETES` is 248 (decision 212 (b), the count then); since 8C's wait for the step's first frame
  the case measures 193 (this audit's `check:contrast`, `docs/audit-post8-evidence/checks/check-contrast.txt`), so up to 55 more warnings
  of that kind would pass. The phone's triangle budget (`CENSUS.PHONE` 1.62 million) is reported, never failed, by design (section 8.3's
  device alternative; decision 269 (a)).

## The in-app self-test's own limits

They are `app.js` constants and literals, outside `thresholds.js`. `node tools/audit-post8/tests/selftest-diff.js archive/step5c-45f8f662.html
app.js` (the last build before Stage 8 against today's source) and a scan of both `AUSTERLITZ_DEBUG` sources for comparisons of a value
with a literal find 253 distinct such comparisons before Stage 8, every one still present today (none removed or altered), and 218 new ones; of the 131 checks with a literal name
in both, none changed its condition text. So no pre-existing self-test tolerance written as a literal was loosened during Stage 8. Limits held
in named constants that the self-test reads from the code under test (for example `ARROW_CAP.PX`, `SYM_MAX_PX`, `CAM_CLEAR`) are pinned only by
`css-test.js`'s source-text checks, not by the self-test (see `README.md`, finding T-8).
