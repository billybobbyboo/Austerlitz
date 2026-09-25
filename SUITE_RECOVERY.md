# The correction-pass regression suite: status and recovery plan

**Status: not in this repository.** The suites were written in the first project chat ("Napoleon's
Austerlitz battle progression map"), inside that chat's temporary sandbox (`/home/claude/aus2`), and
were never downloaded. Their recorded results stand for the correction-pass build
(`archive/correction-pass-672aff9f.html`), and the data they checked is byte-identical in the current
build (`npm run check:data`). They cannot be re-run until recovered.

## What they were, and what each must reproduce
| file | guarded | recorded result on the correction-pass build |
|---|---|---|
| `css-test.js` | stylesheet validity and interface behaviour | 0 CSS errors, 9/9 behaviour checks |
| `test.js` | historical data integrity, order of battle | 0 errors, 0 warnings, order of battle 41/41 |
| `geo-test.js` | transform and inverse, scale, rotation, anchors, villages | 54 passed, 0 failed |
| `terrain-test.js` | 13 elevation anchors, ordering, downstream fall, pond edges, land-cover guard, tour stop 5 | all pass |
| `audit.js` | movement model: march rates, terrain crossings | 0 march-rate and 0 terrain violations |
| `sim-test.js` | events against plotted positions (1.0 km true), tour stop 4 | 25 events, 0 disagreements |
| `redteam.js` | retired claims stay absent | 0 findings; 37 retired claims, none present |
| `runtime-test.js` | the page in a headless browser, parent/child rendering | 36 checks OK, 0 errors |

Also lost: `tools/run-all.sh` (runner), `tools/mk-helpers.js` and `tools/mk-world-mod.js` (regenerated
test modules from `app.js` and `world.js`), and one-off geography tools (`warp.js`, `geo-migrate.js`,
`geo-anchor.js`, `geo-dump.js`, `relief-fit.js`, `stale-compare.js`), whose results are already in the data.

## How they will be recovered
Recovery happens in a claude.ai chat in the Austerlitz project, because cloud sessions cannot read chats.
1. Rebuild each file from its creation in the first chat plus every later edit, in order.
2. Prove it: split `archive/correction-pass-672aff9f.html` with `tools/split-from-html.py`, run the
   recovered suite, and require the recorded result above exactly. (The old runner read `bundle.js` and
   the HTML from the tree root; paths are adapted to `dist/`, nothing else.)
3. Then adapt `css-test.js` and `runtime-test.js` to the intentional Stage 0 interface changes (first-run
   buttons `fr-watch`, `fr-close` now meaning Explore; legend swatches filled from `COLOUR_KEY`;
   `#selchip`; `#devstats`) and run everything on the current build.
4. A file that cannot be recovered exactly is rebuilt from the recorded expectations and labelled as
   rebuilt, never presented as the original.

Order: `test.js`, `sim-test.js`, `audit.js`, `geo-test.js`, `terrain-test.js`, `redteam.js`, then
`runtime-test.js` and `css-test.js`; the one-off tools last. Keep the first project chat: it is the only copy.
