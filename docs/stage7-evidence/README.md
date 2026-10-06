# Stage 7 Part A: evidence

Every file here was written by a script in `tools/stage7/` (not bundled), run against the unchanged Stage 6D build
(`austerlitz-command-map.html`, 1,720,613 bytes, md5 `3dd7ca41f73d0e5ffcfe5fa64adc5f51`). The page probes open the build as the Stage 0
harness does (`tools/stage2/page.js`'s method: headless Chromium, software WebGL, `?harness=1`, `tools/visual/measure.js` injected, CSS
transitions off), with the Stage 5 helpers (`tools/stage5/lib.js`); `tools/stage7/lib.js` adds reduced motion before load and a page without
`?harness=1`. No source file is written by any of them; the prototypes are the app's own calls and edits of the probe page's DOM.

| file | section of `docs/STAGE7_SPEC.md` | script |
|---|---|---|
| `text-inventory.md`, `text-inventory.json` | §2 (the strings an opening could use: file, line, words, reading times, what each states, which suite reads it) | `node tools/stage7/text-inventory.js --json docs/stage7-evidence/text-inventory.json --md docs/stage7-evidence/text-inventory.md` |
| `firstrun-probe.json` | §1 (the first screen at 1600 x 900, 1366 x 768, 1280 x 720, 1024 x 768, 390 x 844, under reduced motion and on a visitor's page; each way out of the card; reload; the ways into the day counted; with `--only narrow`, the dispatch card's box below 1080 px and what each first screen names on the map) | `node tools/stage7/firstrun-probe.js`, then `node tools/stage7/firstrun-probe.js --only narrow` |
| `firstrun-sheet.jpg` | §1.1 (the five first screens) | `node tools/stage7/firstrun-probe.js` (the `screens` part) |
| `opening-probe.json` | §3, §5 (the nine tour stops as stills and every glide; the subsets' glides; the stops at 1280 x 720, 1024 x 768 and 390 x 844; the played opening's lengths and frames; the card's prototypes; the end states; what stops 1, 6, 7 and 8 name on the map) | `node tools/stage7/opening-probe.js`, then `--only card,played,ends` (below) and `--only names` |
| `opening-sheet-tour-glides-small-played-card-ends.jpg` | §3 (the tour's stops at 1600 x 900 and the smaller sizes) | `node tools/stage7/opening-probe.js` (the sheet is named after the parts run). Its played and end tiles are from the first run, without the caption bar and at 1600 x 900 only: superseded by the next sheet |
| `opening-sheet-card-played-ends.jpg` | §3.5, §5 (the played holds with the stop's text in the bar; the end states) | `node tools/stage7/opening-probe.js --only card,played,ends` (the played frames and the end states re-taken; the card's existing entries kept, the Now-tab-with-dispatch variant added) |

Measures and their limits are the harness's (`tools/visual/thresholds.js`): solid near-black at most 0.05% (`SOLID_BLACK`), the smoke's share at
most 25% (`SMOKE_SHARE`), the confidence marks' share at most 20% on the landscape (`CONF_SHARE`), map text at AA as rendered, drops against a
stated limit (the first-run cases' 12 and 16: no opening case exists yet). Frame times are software WebGL on one machine, comparable only with
one another; draw calls are counted for one whole frame as `tools/stage6/compare-6d.js` counts them. Reading rates (160, 200, 238 words a
minute) are design values for the measurement.
The second `opening-probe.js` run and `firstrun-probe.js --only narrow` ran while `npm run check:visual` ran on the same machine: their
world-pass times are not comparable with the first run's (no other measure depends on time).

**Stage 7B** (on the 7B build, md5 `82337dd4…`, 1,729,495 bytes; the "before" is Part A's `firstrun-probe.json`, the 6D build):

| file | what | script |
|---|---|---|
| `7b-firstrun-probe.json` | the first screen at the same five sizes, under reduced motion and on a visitor's page; each way out (the absent "Watch the battle" recorded as absent); reload; the counts; the dispatch card's box below 1080 px and what each first screen names (`CHANGELOG.md`, Stage 7B) | `node tools/stage7/firstrun-probe.js --json docs/stage7-evidence/7b-firstrun-probe.json --sheet docs/stage7-evidence/7b-firstrun-sheet.jpg --title "Stage 7B: the first screen (fresh pages)"`, then `--only narrow` with the same `--json` |
| `7b-firstrun-sheet.jpg` | the seven first screens on the 7B build | the same run (the `screens` part) |
