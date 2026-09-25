# Austerlitz command map

A historically grounded, interactive reconstruction of the Battle of Austerlitz (2 December 1805),
delivered as one self-contained HTML file. Open `dist/austerlitz-command-map.html` in a browser.

## Working on it
- Edit the source files (`geo.js`, `data.js`, `analysis.js`, `world.js`, `symbols.js`, `app.js`,
  `shell.html`), then `npm run build` (or `python3 build.py`; on Windows `py build.py`). Never edit `dist/` by hand.
- Project rules for Claude Code: `CLAUDE.md`. Current state and history: `CHANGELOG.md`.
  Roadmap and design assessment: `docs/VISUAL_AUDIT.md`.

## Checks
| command | what it proves |
|---|---|
| `npm install` then `npx playwright install chromium` | one-time setup for the checks |
| `npm run check:data` | historical, geographic and model declarations are byte-identical to the Stage 0 reference |
| `npm run check:visual` | 11 fixed views pass the Stage 0 thresholds, plus the in-app self-test |
| `npm run check:baseline` | the build is exactly the verified Stage 0 file (only true before further changes) |

The correction-pass regression suite is still to be recovered: `docs/SUITE_RECOVERY.md`.

## Layout
Source files at the top level (load order in `build.py`); `dist/` the built file; `archive/` frozen
reference builds; `docs/` audit, verification and recovery notes; `tools/visual/` the Stage 0 harness;
`tools/stage0/` the historical Stage 0 patch; `tools/split-from-html.py` how this tree was re-created.
Line endings are LF (`.gitattributes`); `build.py` normalises CRLF anyway.
