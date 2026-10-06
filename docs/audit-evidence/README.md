# Final audit: evidence

Every file here was written by a command run against the unchanged Stage 7D build (`austerlitz-command-map.html`, 1,764,002 bytes, md5
`46773462faa1e1b9f4a4010e450e110a`) for `docs/FINAL_AUDIT.md`. The audit's own scripts are in `tools/audit/` (not bundled); the page probes
open the build as the Stage 0 harness does (`tools/stage7/lib.js`: headless Chromium, software WebGL through SwiftShader, `?harness=1`
unless stated, `tools/visual/measure.js` injected, CSS transitions off). No source file is written by any of them. Frame times are software
WebGL on one 4-core machine, comparable only within one run. No page probe ran beside `npm run check:visual`.

| file | what it is | written by |
|---|---|---|
| `npm-test.txt` | the whole regression suite's summary (all nine suites and the height guard) | `npm test` |
| `suite-*.txt` | each suite's full output from that run (`suite-height-guard.txt` is the Stage 2B height guard) | `tools/run-all.sh` (copied from `/tmp/out_*.txt`) |
| `check-data.txt` | the guarded declarations against `archive/stage6b-7fc0f6c3.html` | `npm run check:data` |
| `check-chronology.txt` | the chronology regression | `npm run check:chronology` |
| `check-contrast.txt` | map and interface text in 35 states | `npm run check:contrast` |
| `check-visual.txt` | the 30 views and the self-test (one failure: `narrow-390`, §2.6 T-0) | `npm run check:visual` |
| `check-visual-report.json` | that run's `report.json` (every case's measures, the self-test's 212 checks) | `npm run check:visual` (copied from `tools/visual/out/`) |
| `check-visual-cases.txt` | one line per view from that report: unobstructed share, drops, the map layer's pass, the timeline, map text, darkness, smoke, confidence marks | a `node -e` one-liner over `check-visual-report.json` (in the commit that added it) |
| `harness-sheet.jpg` | the 30 views as `check:visual` drew them | `python3 tools/audit/sheet.py` |
| `check-baseline.txt` | the baseline at the end of the audit | `npm run check:baseline` |
| `size.txt`, `size.json` | what makes up the built file: each source, its comments, the textures, the largest declarations, the self-test | `node tools/audit/size.js --json docs/audit-evidence/size.json` |
| `quote-check.md` | every quote of `appearance.js` searched for in its source's text (network) | `node tools/stage6/verify-quotes.js --md docs/audit-evidence/quote-check.md` |
| `scan-gaps.txt`, `scan-gaps.json` | `redteam.js`'s certainty and causal patterns over every string of the guarded data; what its scan reads | `node tools/audit/scan-gaps.js --json docs/audit-evidence/scan-gaps.json` |
| `font-probe.json` | the fonts Chromium draws the page with on this machine, and `narrow-390`'s timeline and unobstructed share with three sans faces | `node tools/audit/font-probe.js --json docs/audit-evidence/font-probe.json` |
| `boot-probe.json`, `boot-no-three.png`, `boot-no-webgl.png` | a visitor's page with three.js blocked, and without WebGL | `node tools/audit/boot-probe.js --json docs/audit-evidence/boot-probe.json --shots docs/audit-evidence` |
| `state-probe.json` | __STATEFILES__ | `node tools/audit/state-probe.js --json docs/audit-evidence/state-probe.json` |
| `a11y-probe.json`, `a11y-sheet.jpg` | the first screen at 1600 x 900, 1366 x 768, 1280 x 720, 1024 x 768 and 390 x 844: panels, targets and their sizes, names, structure, live regions, the card's Tab cycle, the page's Tab order after Esc | `node tools/audit/a11y-probe.js --json docs/audit-evidence/a11y-probe.json --sheet docs/audit-evidence/a11y-sheet.jpg` |
| `perf-probe.json` | load times (with and without `?harness=1`), and per harness view the draw calls, triangles, world pass, map layer, memory counts and heap | `node tools/audit/perf-probe.js --json docs/audit-evidence/perf-probe.json --loads 2` |
