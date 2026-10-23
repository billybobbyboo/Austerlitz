# Stage 8 Part A: the evidence (`docs/STAGE8_SPEC.md`)

Every file here was made by a script in `tools/stage8/` (committed, not bundled) from the build `austerlitz-command-map.html` at md5
`c4793156103b60bb74151c7d13dbdd9d` (2,220,714 bytes, `main` at `9eb7abb`), in headless Chromium with software WebGL (SwiftShader), 1600 x 900
unless named. The prototypes are in-page modules (`tools/stage8/protos/`), put into the live page after it started and removed after their
frame; none is in the source. Captures are JPEG (quality 82-86) to keep the folder small; every pixel measure in the specification was taken
on the frame the probe held in memory, or on these files where said. Each JSON names the build it was measured on (`build`, its md5) where
its probe records one. The leads register (`leads.md`) is a research reader's; its provenance is at its head.

| path | made by | what |
|---|---|---|
| `views/<view>-base.jpg`, `views-base.json` | `stills.js --views` | the build in 30 views of `views.js`, with each frame's draw calls, triangles and map-layer counts (since the arrows' re-run each `stills.js` JSON also records the frame after a prototype's removal, `after`) |
| `ground/<view>-<id>.jpg`, `ground/ground-stills.json` | `stills.js --protos ground:...` | section 2: seven views, the build and the five ground cues (`g-none`, `g-marker`, `g-outline`, `g-selonly`, `g-confline`), each prototype's frame and its removal checked; `g-selonly` draws only the selected formation's mark, so with nothing selected its frame is `g-none`'s: its image is kept only in `selected-formation`, its numbers in every view |
| `label-motion.json` | `label-motion.js` (stabilisers `none`, `persist`, `persist+hold`, `freeze`) | section 3: 16 motions on both map types, 30 frames a second, every item's place after every frame |
| `label-motion-anchor.json` | `label-motion.js --stab anchor` | section 3: the first anchored stabiliser |
| `label-motion-final.json` | `label-motion.js --stab anchor2,anchor2+band` | section 3: the anchored stabiliser and its band, the band then held at rest too (superseded for `anchor2+band` by the next file) |
| `label-motion-rest.json` | `label-motion.js --stab persist+hold,anchor2+band` | section 3: the recommended `anchor2+band` with its band released at rest, beside `persist+hold` in the same run |
| `figures/<view>-<id>.jpg`, `figures/figure-stills.json`, `figures/figure-facings.json` | `stills.js --protos figures:...` | section 4: Saint-Hilaire, Nansouty and the guns on the heights at the views' distances, the build and `f-kit`; `f-facings` in `inf-front` |
| `figures-close/<view>-<id>.jpg`, `figures-close/figure-close-stills.json` | `stills.js --protos figures:f-kit` | section 4: closer views of the same, the build and `f-kit` |
| `gait-check.json` | `gait-check.js` | section 4.3: the gait's rule checked on the three representatives (a clock reached from three earlier clocks, paused, halted, reduced motion, the play speeds) |
| `legs.json` | `legs.js` | section 4.3: every leg of the model with its duration, distance and speed; the 92 of 147 under 1 km/h |
| `kit-census.json` | `kit-census.js` | sections 4 and 8: triangles per man, rider, gun, limber and house, the build's and the prototypes'; the low Pratzen frame by kind |
| `water/<view>-<id>.jpg`, `water/water-ice.json`, `water/water-stream.json` | `stills.js --protos water:...` | section 5: the meres (`w-ice`) and the streams (`w-stream`, `w-streamice`) beside the build |
| `buildings/<view>-<id>.jpg`, `buildings/building-stills.json` | `stills.js --protos buildings:...` | section 6: the villages and the landmarks, the build and `b-village`, `b-landmarks`; in this JSON `b-village`'s `landmarks` field, from the second view on, repeats the `b-landmarks` run of the view before (a stale field, reset in the prototype since; `b-village` draws no landmark, and its draw calls and triangles are its own) |
| `arrows/<view>-<id>.jpg`, `arrows/arrow-stills.json` | `stills.js --protos arrows:...` | section 7.1: the arrows capped (`a-cap`), softened (`a-soft`) and calmed (`a-calm`); close on Sokolnitz also `a-rebuild`, the build's own rebuild of its overlays with no change, to compare the frames after the removals with |
| `density.json`, `density-low.json` | `density.js` | sections 1, 2 and 7: each class's share of the free rectangle and its contrast, the arrows' widths on screen, the map layer's census; `density-low.json` the two low views toward the horizon |
| `carried.json` | `carried.js` | section 9: the three carried findings by real clicks, keys and taps (centring re-measured with each name read in the current frame) |
| `clips/<clip>.mp4` | `record.js --clip` | sections 3-5: frame-stepped recordings at 10 frames a second, the clock set as Play sets it, the variants stacked (the build above, the prototype below; in `stream-flow`, `w-stream` above `w-flow`) over the same frames; `clips/inf-march-4x-figures_f-gait.mp4` one variant (the gait at 4x); the per-variant files and the GIFs `record.js` also writes are not kept (size) |
| `clips/record-log.txt` | `record.js` (its report after each variant, gathered) | sections 4.3, 5.3: each kept clip's variants with their frames, the clock at the last frame and, for a gait variant, the cycles a second the gait drew there |
| `toast/<case>.jpg`, `toast.json` | `toast.js` | section 9.4: the phase's toast against the view switch after a real PageDown on the time rail, in Study and Watch at 1600 x 900, 1366 x 768 and 1280 x 720 |
| `pixdiff.json` | `pixdiff.py` | sections 4-6: how much of each frame each prototype changes (pixels whose grey level differs by more than 40 of 255), with their bounding box |
| `label-far.json` | `label-far.js` | section 7.2: each view's drawn map items by their anchor's distance against the eye's distance to its target |
| `stream-vis.json` | `stream-vis.js` | section 9.5: how much of the streams, their banks and the roads the build draws in eleven landscape views and two of the paper map, as built, drawn double-sided, and with nothing hiding them |
| `clips/paper-play-f4-f5.jpg` | `clip-motion.py` | section 3: two frames of the paper map's Play (09:02 and 09:02:30), the build above and `l-fade` below, taken from `clips/paper-play.mp4` |
| `clip-motion.json` | `clip-motion.py` | sections 3, 4.3 and 5.3: in each stacked clip, every frame's change since the clip's first frame in each variant, and the variants against each other (pixels over 8 and over 40 of 255; the caption boxes left out); in `paper-play` also each frame against the one before over the map's area |
| `sheets/<name>.jpg` | `sheets.py` | the comparison sheets: the build and its prototypes in one view side by side, each tile captioned with its file |
| `leads.md` | a research reader for this session | sections 4.4, 5.2, 6.2: the sources read on the artillery, the villages, the water and the weather |

Not kept: the sun-lit ice pair (its frame showed no sun on the ice at the hour and was dropped), and the `g-selonly` images that equal
`g-none`'s.

In all, 198 files (this README and the clips' `.gitignore` among them), 52.7 MB: 161 JPEG captures, sheets and stills (39.9 MB), 9 clips
(12.5 MB), 24 JSON files (0.2 MB), this README, `leads.md` and `clips/record-log.txt`.
