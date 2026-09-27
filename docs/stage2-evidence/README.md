# Stage 2 Part A: evidence

Produced by the scripts in `tools/stage2/` against the Stage 1B build (md5 `5bf48b75373fe0cf9fc8a32cbeae918c`) in headless
Chromium 141 with software WebGL, 1600 x 900. Cited from `docs/STAGE2_SPEC.md`. Probe images show measurement probes
injected into the running page, not the 2B-2F implementation.

| file | section | script |
|---|---|---|
| `height-sites.md` | A | `height-sites.js --md` |
| `exag-<view>.jpg` | B.2 | `exag-renders.js` (1x, 3x, 4x, 5x, 10.33x per view) |
| `exag-1x-options.jpg` | B.6 | `exag-1x-options.js` |
| `arrow-binding.md` | C.1 | `arrow-binding.js --md` |
| `heads-<mode>-<phase>-<view>.jpg`, `heads-crops-*.png` | D | `arrowheads.js` (normal, greyscale, protanopia, deuteranopia, tritanopia; crops at 2x) |
| `map-text.json` | E, H | `map-text.js` (every text run: size, contrast; unobstructed fraction) |
| `dom-layer.jpg` | F.2 | `dom-layer.js` |
| `paper-map.jpg` | G | `paper-map.js` |
| `chronology.md` | M | `chronology.js --md` (every move: engine window, act, text time, verdict, evidence) |
