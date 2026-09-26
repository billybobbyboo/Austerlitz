# Austerlitz command map

A historically grounded, interactive reconstruction of the Battle of Austerlitz (2 December 1805), delivered as
one self-contained HTML file: open `austerlitz-command-map.html` in a browser.

## Working on it
Edit the sources (`geo.js`, `data.js`, `analysis.js`, `world.js`, `symbols.js`, `app.js`, `shell.html`, `style.css`),
then `npm run build` (or `python3 build.py`; on Windows `py build.py`). Never edit the built HTML by hand.
Rules for Claude Code: `CLAUDE.md`. State and history: `CHANGELOG.md`. Roadmap: `docs/VISUAL_AUDIT.md`.
Completed set-up tasks: `docs/HANDOFF.md`.

## Checks
| command | what it proves |
|---|---|
| `npm install`, then `npx playwright install chromium` | one-time setup |
| `npm test` | the regression suite: data, order of battle, geography, terrain, movement, events, retired claims, CSS, runtime |
| `npm run check:data` | historical, geographic and model declarations are byte-identical to the Stage 0 reference |
| `npm run check:visual` | 11 fixed views pass the Stage 0 thresholds, plus the in-app self-test |
| `npm run check:baseline` | the build is exactly the verified Stage 0 file (only before further changes) |

Line endings are LF (`.gitattributes`); `build.py` writes LF on every platform.
