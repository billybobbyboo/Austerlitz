# Austerlitz command map

A historically grounded, interactive reconstruction of the Battle of Austerlitz (2 December 1805), delivered as
one HTML file that loads three.js r128 from cdnjs at start-up (everything else, the type and the textures, is embedded): open
`austerlitz-command-map.html` in a browser.

**[Open the map](austerlitz-command-map.html).** It is a reconstruction, not a record: positions, hours and strengths come from the sources
where they can, and every statement says how far it is sourced (its claim word, and a position grade A, B or C). The dossiers'
"How this is sourced" and the sheet "Accuracy and sources" show what rests on which reading, where the sources disagree, and what is this
map's own reading.

**It needs the network once, at start-up** (the final audits' Stage 7, CL-ROB-05; decision 133 (a)): three.js r128 comes from
`cdnjs.cloudflare.com`, checked against its integrity hash. Offline, or where that address is blocked, the page cannot start and says so
(its start-up dialog: "could not be loaded from cdnjs.cloudflare.com ... The map needs a network connection that can reach that address").
A saved copy of the file has the same dependence. Embedding three.js (about 600 KB) would remove the
dependence; decision 133 (a) keeps it on the CDN.

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
| `npm test` | the regression suite (`tools/run-all.sh`): nine suites (`css-test.js` the stylesheet, the type and the colour literals; `test.js` data, order of battle, appearance and the per-statement claims; `geo-test.js` geography; `terrain-test.js` the ground and the meres; `audit.js` the tracks against the ground (it asserts their continuity and coverage); `sim-test.js` the whole day run: continuity, activation, events against positions; `redteam.js` the overclaim scan and the retired claims; `runtime-test.js` the runtime against real three.js r128 materials; `binding-test.js` the arrows bound to the tracks) and the height guard; any error, any warning not acknowledged by its exact text or any runtime warning fails it |
| `npm run check:data` | the historical, geographic and model declarations are byte-identical to the reference build (`archive/postaudit1-a3cb40f8.html`, since the final audit's stage 1); a data task that changes one lists it in `CHANGELOG.md` and moves the reference |
| `npm run check:chronology` | every live timed statement cited or allowed by name (four classes excluded by path, each with its reason), no move early or late but the named conflicts, the explicit times' evidence, the arrival rules, the movement audit |
| `npm run check:contrast` | every visible text in 45 interface states (10 of them as a phone) meets WCAG AA and the 10.5 px floor, drawn in the embedded faces; and the eight start-up cases (`tools/visual/boot-check.js`) |
| `npm run check:selftest` | the in-app self-test (325 checks, held to `tools/visual/selftest-manifest.json`) on one page, with the slider, key, motion and live checks (about 20-45 minutes on CI; CI runs it on every push) |
| `npm run check:visual` | 39 fixed views held to their thresholds, every page's console, the live checks and the self-test (about two to four hours; on demand) |
| `npm run check:report` | a finished `check:visual` report judged again without rendering |
| `npm run check:remeasure` | decision 141's one re-measure tool (`tools/visual/remeasure.js`); it never edits a limit |
| `npm run check:baseline` | the build is exactly the last recorded one (`CHANGELOG.md` names it); a task that changes the build moves it |

Line endings are LF (`.gitattributes`); `build.py` writes LF on every platform.
