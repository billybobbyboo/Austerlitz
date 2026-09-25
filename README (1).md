# Visual regression harness (Stage 0)

Fixed, reproducible views of the Austerlitz command map, with measurements that catch the faults
Stage 0 fixed. The same harness runs against the pre-Stage-0 build and later builds, so any later
visual change can be compared with the Stage 0 baseline.

## Requirements
Node 18+ and Playwright with Chromium (`npm i playwright acorn && npx playwright install chromium`).
Rendering is forced to software WebGL (SwiftShader) so frames are reproducible on one machine. three.js
is fetched from cdnjs as in production; if `three.min.js` sits in this folder (or `AUSTERLITZ_THREE`
points at one) the CDN request is answered locally.

## Scripts
| script | what it does |
|---|---|
| `harness.js <build.html> <outdir> [--test] [--only a,b] [--compare <dir>]` | loads `build.html?harness=1`, drives it into each case in `cases.js`, writes `<case>.png` and `report.json`; `--test` also runs the in-app self-test and applies `thresholds.js` (exit 1 on failure); `--compare` reports per-case pixel differences against another run |
| `check-report.js <outdir>` | re-applies `thresholds.js` and the stored self-test to a finished `report.json` without rendering |
| `data-invariance.js <original.html> <patched.html>` | parses both builds (acorn) and compares every top-level declaration; the historical, geographic and model declarations (DATA) must be byte-identical (exit 1 otherwise) |
| `darkness-study.js <patched.html> <original.html> <outdir>` | the low Pratzen view in five builds that add the Stage 0 grade changes one at a time, then attributes the remaining dark pixels to labels, formations and woods |
| `measure.js` | the in-page driver and measurements, injected by the scripts above |

## Cases (`cases.js`)
first-run, first-run-laptop (1366x768), overview-field, overview-plan, close-sokolnitz, staff-paper,
pratzen-low, pratzen-orbit-min (zoom fully in and drag to the lowest pitch through the real wheel and
pointer handlers), selected-formation, watch-selected, hybrid-dimmed. Each fixes clock, presentation,
ground style, camera and selection.

## Measurements (per case, `report.json`)
- `figures.maxErr`: largest distance, in world units, between any visible man or horse and the drawn
  terrain under him (read from the ground mesh's own vertex buffer, independent of the app's helpers).
- `standards.maxErr`: the same for the foot of every standard.
- `camera.clearance`: eye height above the highest drawn ground within 1.6 units.
- `labels.pairs`: overlapping labels and counters on screen, by category, using each sprite's inked
  extent; overlaps wholly under an opaque interface panel are not counted.
- `smokeEdgeAlpha`, `dustEdgeAlpha`: largest alpha on the border of the sprite textures (0 = no card edge).
- `mist.maxAlphaAtCrossing`: largest visible mist alpha where the ground is within 0.45 units of the sheet.
- `pixels.nearBlack`: share of map pixels (outside panels, every second pixel) whose brightest channel
  is below 16/255. Includes legitimately black details (shakos, text halos, poles, dark conifers).
- `pixels.solidBlocks` / `solidBlack`: 8x8 blocks at least 90% near-black: how a slope clipped to black
  shows. This, not `nearBlack`, is the black-slope test.

## Timing
On one CPU with software rendering a page load is about 45 s and a case about 25 s; the pre-Stage-0
build is slower because it draws every frame. Run long sets in batches with `--only`; reports merge
while the build's md5 is unchanged. A GPU-backed browser is much faster but frames then depend on the GPU:
keep one machine and one browser for any baseline you compare against.
