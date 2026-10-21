# Austerlitz command map

A historically grounded, interactive reconstruction of the Battle of Austerlitz (2 December 1805), delivered as
one self-contained HTML file: open `austerlitz-command-map.html` in a browser.

## Working on it
Edit the sources, then `npm run build` (or `python3 build.py`; on Windows `py build.py`). Never edit the built HTML by hand.
- Presentation and software: `app.js`, `world.js`, `symbols.js`, `shell.html`, `style.css`, and `tokens.js` (the one source of interface and
  symbology colours and type; `python3 build.py --tokens` writes its copy into `style.css`).
- Historical and geographic data, guarded by `npm run check:data` and changed only by a data task, with its evidence recorded in
  `CHANGELOG.md`: `geo.js`, `data.js`, `appearance.js`, `analysis.js`, `narrative.js` (and seven declarations in `app.js`, listed in `CLAUDE.md`).
- Generated, never edited by hand: `assets.js` (the embedded ground textures) and `fonts.css` (the embedded type, from
  `tools/fonts/build-fonts.py`).

Rules for Claude Code: `CLAUDE.md`. State and history: `CHANGELOG.md`. The plan: `docs/ROADMAP.md` (after the final audit,
`docs/FINAL_AUDIT.md`; the original roadmap was `docs/VISUAL_AUDIT.md`). Completed set-up tasks: `docs/HANDOFF.md`. The visual harness:
`tools/visual/README.md`.

## Checks
The scripts are in `package.json`; `CLAUDE.md`'s "Checks" section says, stage by stage, what each one holds the build to. Never run two
browser checks at once, or a page probe beside `check:visual`: their timing limits assume the machine is not shared.

| command | what it proves |
|---|---|
| `npm install`, then `npx playwright install chromium` | one-time setup |
| `npm run build` | `python3 build.py`: joins the sources into `austerlitz-command-map.html` (committed; CI fails if it differs from a fresh build) and `bundle.js` (for the tests, not committed) |
| `npm test` | the regression suite (`tools/run-all.sh`): nine suites (`css-test.js` the stylesheet, the type and the colour literals; `test.js` data, order of battle, appearance and the per-statement claims; `geo-test.js` geography; `terrain-test.js` the ground and the meres; `audit.js` the tracks against the ground (continuity and coverage are printed only); `sim-test.js` the whole day run: continuity, activation, events against positions; `redteam.js` the overclaim scan and the retired claims; `runtime-test.js` the runtime against real three.js r128 materials; `binding-test.js` the arrows bound to the tracks) and the height guard; any error, any warning not acknowledged by its exact text or any runtime warning fails it |
| `npm run check:data` | the historical, geographic and model declarations are byte-identical to the reference build (`archive/step5c-45f8f662.html`, since PR #58, decision 213 (b)); a data task that changes one lists it in `CHANGELOG.md` and moves the reference |
| `npm run check:chronology` | every live timed statement cited or allowed by name (four classes excluded by path, each with its reason), no move early or late but the named conflicts, the explicit times' evidence, the arrival rules, the movement audit |
| `npm run check:contrast` | every visible text in 35 interface states meets WCAG AA and the 10.5 px floor, drawn in the embedded faces; and the six start-up cases (`tools/visual/boot-check.js`) |
| `npm run check:selftest` | the in-app self-test (242 checks, held to `tools/visual/selftest-manifest.json`) on one page, with the slider, key and live checks (about 15 minutes; CI runs it) |
| `npm run check:visual` | 30 fixed views held to their thresholds, every page's console, the live checks and the self-test (about 100 minutes; on demand) |
| `npm run check:report` | a finished `check:visual` report judged again without rendering |
| `npm run check:remeasure` | decision 141's one re-measure tool (`tools/visual/remeasure.js`); it never edits a limit |
| `npm run check:baseline` | the build is exactly the last recorded one (`CHANGELOG.md` names it); a task that changes the build moves it |

Line endings are LF (`.gitattributes`); `build.py` writes LF on every platform.
