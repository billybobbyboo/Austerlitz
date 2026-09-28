# Stage 2 Part A: evidence

Produced by the scripts in `tools/stage2/` against the Stage 1B build (md5 `5bf48b75373fe0cf9fc8a32cbeae918c`) in headless
Chromium 141 with software WebGL, 1600 x 900. Cited from `docs/STAGE2_SPEC.md`. Probe images show measurement probes
injected into the running page, not the 2B-2F implementation.

| file | section | script |
|---|---|---|
| `height-sites.md` | A | `height-sites.js --md` |
| `exag-<view>.jpg` | B.2 | `exag-renders.js` (1x, 3x, 4x, 5x, 10.33x per view) |
| `exag-1x-options.jpg` | B.6 | `exag-1x-options.js` |
| `arrow-binding.md` | C.1 | `arrow-binding.js --md` on the Stage 2C build: each arrow's marker (derived leg or interpretive kind) and its verdicts |
| `arrow-binding-before-2c.md` | C.1 | the same on the chronology data task's build (md5 `e76222b3…`), before 2C (kept) |
| `arrow-binding-before-chronology.md` | C.4 | the same, on the Stage 1B build (kept, dated) |
| `heads-<mode>-<phase>-<view>.jpg`, `heads-crops-*.png` | D | `arrowheads.js` (normal, greyscale, protanopia, deuteranopia, tritanopia; crops at 2x) |
| `map-text.json` | E, H | `map-text.js` (every text run: size, contrast; unobstructed fraction) |
| `dom-layer.jpg` | F.2 | `dom-layer.js` |
| `paper-map.jpg` | G | `paper-map.js` |
| `chronology.md` | M | `chronology.js --md` (every move: engine window, explicit time, act, text time, what it dates, verdict now and in §M, evidence); re-run on the chronology data task's build |
| `delayed-moves.md`, `delayed-gqg-waiting.jpg`, `delayed-ph7-start.jpg` | M.11 | `delayed-moves.js` on the Stage 1B build and the chronology data task's build |
| `derived-legs.md` | M.13 | `derived-legs.js --md` (the derived arrivals and their rule since the 2C precondition; the options simulated) |
| `2b-<view>.jpg`, `exag-2b.json` | K (2B) | `renders-2b.js --sheets` on the Stage 2B build: 1x, 4x, 10.33x from the five vantages and the low Pratzen view; the factor-change time |
| `2c-heads.jpg`, `2c-drape.jpg`, `arrows-2c.json` | D, K (2C) | `arrows-2c.js --sheets` on the Stage 2C build: the heads as built on the landscape and the paper map, colour and greyscale, with every head's size in pixels; the arrows draped at 1x, 4x, 10.33x |
| `2d-layer.md` | F, H, J, K (2D) | `report-2d.js`: per harness view, before (the Stage 0 canvas pass on the Stage 2C build) and after (the map layer): overlaps, drops against the re-measured limit, leaders, pass time, DOM nodes, text below its floor and below AA, the unobstructed fraction at both viewports, the legend over the dispatch |
| `2d-parity-1.jpg`, `2d-parity-2.jpg`, `2d-legend.jpg` | F, K (2D) | `parity-2d.js --sheets`: every harness view from one build, the canvas path (`?labels=canvas`) left and the map layer right, before the canvas path was removed; the contextual legend in its states |
| `occlusion-2d.json` | F.3, K (2D) | `occlusion-2d.js --json`: the layer's occlusion (the segment marched over the drawn ground) against section F.3's rays, per view: agreement and time |
| `2e-report.md` | G, J, K (2E) | `report-2e.js`: per harness view, before (the Stage 2D build) and after: the paper map's north, px per true km at four places, scale bar, framing, drawn and hidden; every view's map-layer measures |
| `2e-paper.jpg`, `2e-legend.jpg`, `2e-hillshade.jpg`, `2e-sawtooth.jpg` | G, K (2E), L1 | `renders-2e.js`: each paper view before and after; the legend on the paper map; the hillshade at ×2, ×4, ×6, ×10.33; the triangle land-cover edges close up, paper map and landscape |
| `paper-limits.json` | J, K (2E) | `paper-limits.js`: the new paper views reproduced on the Stage 2C build (straight down, north up, the 2E view's centre and scale): what the 2C canvas pass hides, with its own panels and with them at the 2E rectangles; the unobstructed baselines |
| `paper-2e.json` | G, K (2E) | `paper-2e.js`: §G.1's measures for the 2E paper map as entered; the switch time into and out of it at 1x, 4x, 10.33x; drops with and without the symbol obstacles (the head-obstacle question) |
