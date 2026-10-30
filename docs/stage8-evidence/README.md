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
| `toast/<case>.jpg`, `toast.json` | `toast.js` | section 9.6: the phase's toast against the view switch after a real PageDown on the time rail, in Study and Watch at 1600 x 900, 1366 x 768 and 1280 x 720 |
| `pixdiff.json` | `pixdiff.py` | sections 4-6: how much of each frame each prototype changes (pixels whose grey level differs by more than 40 of 255), with their bounding box |
| `label-far.json` | `label-far.js` | section 7.2: each view's drawn map items by their anchor's distance against the eye's distance to its target |
| `stream-vis.json` | `stream-vis.js` | section 9.5: how much of the streams, their banks and the roads the build draws in eleven landscape views and two of the paper map, as built, drawn double-sided, and with nothing hiding them |
| `clips/paper-play-f4-f5.jpg` | `clip-motion.py` | section 3: two frames of the paper map's Play (09:02 and 09:02:30), the build above and `l-fade` below, taken from `clips/paper-play.mp4` |
| `clip-motion.json` | `clip-motion.py` | sections 3 and 5.3: in each stacked clip, every frame's change since the clip's first frame in each variant, and the variants against each other (pixels over 8 and over 40 of 255; the caption boxes left out); in `paper-play` also each frame against the one before over the map's area |
| `sheets/<name>.jpg` | `sheets.py` | the comparison sheets: the build and its prototypes in one view side by side, each tile captioned with its file |
| `leads.md` | a research reader for this session | sections 4.4, 5.2, 6.2: the sources read on the artillery, the villages, the water and the weather |

Not kept: the sun-lit ice pair (its frame showed no sun on the ice at the hour and was dropped), and the `g-selonly` images that equal
`g-none`'s.

In all, 198 files (this README and the clips' `.gitignore` among them), 52.7 MB: 161 JPEG captures, sheets and stills (39.9 MB), 9 clips
(12.5 MB), 24 JSON files (0.2 MB), this README, `leads.md` and `clips/record-log.txt`.

## Implementation PR 8A (24 October 2026; `docs/STAGE8_SPEC.md` section 13)

Made after the owner's decisions 239-253, from implementation PR 8A's build (md5 `870caf24e7465206d1a0a994e38265eb`, 2,247,866 bytes), against
the unchanged build of Part A (`c4793156...`); the width sheets on two development builds of 8A (`9e2af4e4...` and `f19f5f38...`, each JSON's
`build`), on which the probe draws the ribbons at each factor itself; the dossier shots on 8A's build before its last fix (`9fa6998c...`), which
changes only where a full dossier opened from a card scrolled down, with the focus inside it, begins (the shots open each dossier by the app's
own `select`, at its head on both). Here in Chromium 153 (`AUSTERLITZ_CHROME=/opt/pw-browsers/chromium`),
software WebGL, 1600 x 900 unless named; the harness's captures on CI (Chromium 141). The scripts are in `tools/stage8/` (not bundled).

| path | made by | what |
|---|---|---|
| `8a/ribbons/<view>-sheet.jpg`, `8a/ribbons/ribbon-widths-close.json`, `-far.json` | `ribbon-widths.js` (two runs: the five close views, then the Overview, the paper map whole and close and the low Pratzen view at 1x) | section 13.2: the roads' and streams' ribbons culled as before 8A ("off") and drawn at ×1, ×0.7, ×0.5 and ×0.35 of the widths they were built with, each sheet the five frames of one view; each frame's ribbon pixels by kind, draw calls, triangles and time (one frame each: the times are this machine's noise, not a cost) |
| `8a/compare/<view>-a.jpg`, `-b.jpg`, `-sheet.jpg`, `8a/compare/compare.json` | `compare-8.js --a <Part A's build> --b <8A>` | section 13.2: the ribbons as chosen against the build before 8A, in matching views, with each frame's draw calls, triangles and time |
| `8a/<state>-a.jpg`, `-b.jpg`, `8a/dossier-shots.json` | `dossier-shots.js --a <Part A's build> --b <8A>` | section 13.1: under Napoleon's headquarters at 08:30 an unknown formation's card and full dossier (`reading-card`, `reading-full`), the same dossier under "everyone" (`everyone-full`), the sources sheet from a disputed event (`claims`), the timeline's tip on hover and after a press (`tip-hover`, `tip-click`), before 8A (`a`) and with it (`b`) |
| `8a/carried-after.json` | `carried.js` on 8A | section 13.1: Part A's three carried findings measured again on 8A's build by real clicks, keys and taps (`carried.json`, above, is the same script on Part A's build) |
| `8a/harness/<case>.jpg` | `pair-sheets.py`, from two CI runs' captures | section 13.3: every `check:visual` case, `main`'s build (run 40075295260) beside 8A's (run 40075243524 on `7507e92`, this build), at half size |

## Implementation PR 8B (24 October 2026; `docs/STAGE8_SPEC.md` section 14)

Made from implementation PR 8B's build (md5 `9b20dc4ca251e17ddb2468f98f920f38`, 2,317,927 bytes) against 8A's (`870caf24...`), here in Chromium
153, software WebGL, 1600 x 900 (three earlier runs of the comparison on 8B's build before its last two changes, `c260697e...`, gave the same
draw calls, triangles, widths, sizes and cues; their times are in section 14.2); the harness's captures on CI (Chromium 141). The scripts are in
`tools/stage8/` (not bundled).

| path | made by | what |
|---|---|---|
| `8b/compare/<view>-a.jpg`, `-b.jpg`, `-b-conf-on.jpg`, `-sheet.jpg`, `8b/compare/compare.json` | `compare-8.js --a <8A> --b <8B> --b-variants conf-on` | section 14.2: the ground cues, the arrows and the glyphs in nine matching views, 8A beside 8B and 8B with Position confidence on, with each frame's widest casing by role, the glyphs' and the markers' largest size, the cues drawn, draw calls, triangles, time and the ground's depth pass |
| `8b/harness/<case>.jpg` | `pair-sheets.py`, from two CI runs' captures | section 14.5: every `check:visual` case (the phone cases among them), 8A's build (run 40075243524) beside 8B's (run 40086612769 on `b42e500`, this build), at half size |

## Implementation PR 8C (25 October 2026; `docs/STAGE8_SPEC.md` section 15)

Made from implementation PR 8C's build against 8B's (md5 `9b20dc4ca251e17ddb2468f98f920f38`, 2,317,927 bytes), in Chromium 141.0.7390.37, the
headless shell Playwright 1.56 pins and CI runs (`AUSTERLITZ_CHROME`), software WebGL, 1600 x 900 unless named; one file in Chromium 153
(`panels-153-8c.json`). `fresh-8c.json` was measured on 8C's build before its last app commit (md5 `0d987a7f...`), which changed only two of the
self-test's checks (section 15.4): the app's layout, motion and drawing code is the same in both; every other 8C file on the final build
(`04547a28...`), `mutate-checks.json` on both (its note). The files made through the motion driver (`label-motion-*.json`, `mutate-motion.json`,
`rest-8c.json`, the clips) were made again with the driver as committed after its fix (section 15.4: each run from the state an idle page
reaches): every count of the first files the same but 8C's held frames (17,970 to 17,953) and two tracking cells (21,984 drawn
formation-frames to 21,987, 7,307 hidden to 7,304), all from the two glides. `layer-cost.json` was measured with the driver before its fix:
it times each pass, which the fix does not change (it changes the state a run starts from). Each JSON names its build. The scripts are in
`tools/stage8/` and `tools/visual/motion.js` (not bundled).

| path | made by | what |
|---|---|---|
| `8c/label-motion-8b.json`, `8c/label-motion-8c.json` | `label-motion.js --app` (AUSTERLITZ_HTML 8B's build, then 8C's) | section 15.6: the 16 motions through the app's own input and frame (30 frames a second on the driver's clock, the WebGL draw skipped), the four that real input can drive again by real input, three under a headquarters' reading, a finger's pan at 390 px and four with Saint-Hilaire's division selected; for each Part A's measures, the held frames, the never-dropped items hidden, the remnants out of rule, the items drawn though the reading does not know them, the end state, the layer's pass time, and the formations followed (each formation's frames drawn, off the screen, behind the ground, out of the layer, hidden by the layout; the longest disappearance; the delay after the layout has room again; jumps, side changes and swaps) |
| `8c/tables-8c.md` | `tables-8c.js` from the two files above | section 15.6's tables |
| `8c/layer-cost.json` | `layer-cost.js --ref <8B> --cand <8C> --rounds 3` | section 15.7: the layer's pass time per pass in the 16 motions, the builds interleaved round by round on the idle machine; per motion and over all, the median and the 95th percentile and 8C's excess |
| `8c/fresh-8c.json` | `fresh-8c.js --ref <8B> --cand <8C>` | section 15.5: every `check:visual` case applied by its spec, each map-layer item's state, box and leader, the drops and their ids, on both builds |
| `8c/mutate-checks.json`, `8c/mutate-motion.json` | `mutate-8c.js` (`--motion` for the second) | section 15.4: the self-test's 8C block on copies of the build with one rule broken, and the motion block's judgement of the 16 motions on the copies that change the layout |
| `8c/context-8b.json`, `8c/context-8c.json` | `ctx-8c.js --cases context-depth,context-loss` | section 15.1, finding A: the two context cases on 8B's build and on 8C's |
| `8c/march-8b.json`, `8c/march-8c.json` | `march-8c.js` | section 15.1, finding B: every hidden formation's march row under both readings at every minute, and the dossiers read by real clicks in the live page, on 8B's build and on 8C's |
| `8c/unobstructed/panels-141-history.json`, `panels-141-8c.json`, `panels-153-8c.json` | `panels-8c.js` | section 15.1, finding C: the unobstructed share and the panels it subtracts in the five failing cases, on the committed build of every merge from roadmap step 1 (PR #49) to 8B (`95fa28a`) in Chromium 141, and on 8C's in Chromium 141 and 153 |
| `8c/rest-8c.json` | `rest-8c.js` (AUSTERLITZ_HTML 8C's build) | section 15.2: at rest after each of the 16 motions, the items placed and the dropped ids, against the same view laid out afresh |
| `8c/label-far-8c.json` | `label-far.js` (AUSTERLITZ_HTML 8C's build) | section 15.3: in Part A's views each drawn item's distance against the eye's distance to its target, and the items drawn at the far step, by kind |
| `8c/clips/<clip>.mp4` | `record.js --app --clip <clip> --builds 8B=...,8C=... --rm-last` | section 15.8: the motion recorded through the same driver with the WebGL draw kept, every third frame of 30 a second, top to bottom 8B, 8C and 8C under reduced motion (the per-build files and the GIFs it also writes are not kept) |
| `8c/clips/record-log.txt` | `record.js --app` (its report after each build, gathered) | section 15.8: each clip's frames and the clock at its end |

## Implementation PR 8D (26 October 2026; `docs/STAGE8_SPEC.md` section 16)

Made from implementation PR 8D's build against the prerequisite's (`87578ebce0e414a4c8b308d88f7abc03`, 2,362,317 bytes: 8C's build with the
protected items' fade fixed, its WebGL frame 8C's) and 8C's own (`04547a28419b2d86aec824931c735e0f`, 2,357,922 bytes), in Chromium
141.0.7390.37, the headless shell Playwright 1.56 pins and CI runs, software WebGL, 1600 x 900 unless named. 8D's build is the committed one (`ae7f16b8cd2960c8813ff4155263830f`, 2,403,007 bytes) but for the census and the first mutation runs, made on `f79f56ab99965526ec4b6d94d74e3cd8` (2,402,661 bytes), which differs from it in three comments and in the self-test's check (f) alone (the figures' movement read with the shadow held at rest, a strengthening found by those runs): the same drawing code; the hooks' mutations were run again on the committed build. CI's runs are named
by their ids. Each JSON names its build (`build`, `md5`). The scripts are in `tools/stage8/` and `tools/visual/` (not bundled).

| path | made by | what |
|---|---|---|
| `8d/protect.json` | `protect-8d.js <8C> <prerequisite>` | section 16.2: a map item held hidden by the stabiliser given the keyboard's focus (a real Tab) or the selection (a real click on its order-of-battle row) while the view moves, at 30 and 60 frames a second: its state, alpha and opacity in the frames after, before and after the fix |
| `8d/vis-257.json` | `vis-257.js <report> --app <prerequisite>` | section 16.3: the motion block's judgement of twelve deliberately worsened copies of a recorded report, and of the block run on a copy of the app whose hold hides formations instead of placing them close |
| `8d/motion-<build>-<n>.json` | `motion-8d.js <build>` | sections 16.3 and 16.10: the harness's motion block on a page of its own (check:visual's set, 26 runs): each run's counts, invariants and formations' visibility |
| `8d/remeasure-256.txt`, `8d/unobstructed-256.json` | `remeasure.js <CI run 1> <CI run 2> --accept-loosening 256 --emit`; the two reports' shares | section 16.4: decision 256's re-measure on CI's browser: every case's drop limit, unobstructed share and px per km in both runs, the proposals, the block pasted into `thresholds.js` |
| `8d/census.json`, `8d/census.md` | `census-8d.js <prerequisite> <8D> --phone` (each build in a run of its own, joined with `--from`) | sections 16.8 and 16.11: one whole frame per view and pass, culled and not, the depth for the overlays reused and drawn, reconciled with `renderer.info`; step 6's estimate of the figure meshes off the view, on each build; the phone's three heavy views |
| `8d/census-fresh.json` | `tools/visual/harness.js <8D> --only first-run,...` (without `--test`), taken from its report | section 16.11: the census of the nine `check:visual` cases `census-8d.js` does not open (fresh pages reached by real clicks), each case's four frames and its frame with and without culling |
| `8d/cull-motion.json` | `cull-8d.js --seq` in three parts on the committed build, joined by `cull-8d.js --join` | section 16.9: the harness's culling-in-motion block on the committed build, fourteen sequences and a phone's: frames judged and compared, pixels differing, meshes culled, casting from out of view, the boundaries crossed |
| `8d/cull-motion-half.json`, `8d/cull-motion-camonly.json` | `cull-8d.js --mutate half --seq Saint-Hilaire,"pan from the Field"`, `--mutate camonly --seq "a low sun"` | section 16.9: the same block on two copies with one rule broken, on the sequences that cross the rule's boundary, judged as `check:visual` judges the block (what the sequences not run would give it left out) |
| `8d/mutate-8d.json` | `mutate-8d.js` (and `--only none,nodepthhook,novishook` again on the committed build) | section 16.9: the self-test's 8D block on the build and on eight copies with one rule broken (r128's own test; the bounds halved; no envelope; never refreshed; camera-only shadows; either material without the hook; the prerequisite undone, by the 8C block) |
| `8d/mutate-css-8d.json` | `mutate-css-8d.js` (on the committed source) | section 16.9: `css-test.js`'s 8D block on the source and on eight copies of `app.js` with one rule broken |
| `8d/xbuild.json` | `xbuild-8d.js <8C> <8D> --pages 5` | section 16.9: the WebGL frame of 8C's build and 8D's in six views on five fresh pages each, one eye: the pixels that differ between pages of one build, and between the builds outside them (with where any consistent change lies) |
| `8d/xbuild-sokolnitz-2.json` | `xbuild-8d.js <8C> <8D> --pages 6 --views close-sokolnitz`, in a session of its own | section 16.9: the close view of Sokolnitz again, six fresh pages a build: the 47 pixels the first session found do not reproduce |
| `8d/cost.json` | `cost-8d.js` | section 16.11: culling's own work per frame, each frame drawn as the app's loop draws one (tests, culled, bounds refreshed with their instances and milliseconds) still, panning, as the clock plays and at a factor change; the tests' own cost timed apart; the time a frame takes to return, culled and not (software WebGL's drawing in it); the heap; what the hooks add |
| `8d/fresh-8d.json` | `fresh-8c.js --ref <prerequisite> --cand <8D>` | section 16.10: every `check:visual` case applied by its spec, each map-layer item's state, box and leader on both builds |
| `8d/label-motion-8d.json` | `label-motion.js --app` (AUSTERLITZ_HTML 8D's build) | section 16.10: 8C's motions through the app's own input, the formations followed, beside `8c/label-motion-8c.json` |
| `8d/route-cull-local.json`, `8d/route-fx-local.json` | `tools/step6/perf-local.js --cull --quick`, `--fx --quick` | section 16.12: the device route's two bracketed routes run end to end here (software WebGL: their times decide nothing; they show the routes run and report) |

## Implementation PR 8E (27 October 2026; `docs/STAGE8_SPEC.md` section 17)

Made from implementation PR 8E's build against 8D's as merged (`ae7f16b8cd2960c8813ff4155263830f`, 2,403,007 bytes,
`git show 2f41819:austerlitz-command-map.html`), in Chromium 141.0.7390.37, the headless shell Playwright 1.56 pins and CI runs, software WebGL,
1600 x 900 unless named. 8E's build is `27a3d2f`'s (`d73d01154b8f6e2552fe04bfb24d05e5`, 2,537,677 bytes). The census was made on the troops'
commit `62f5cd2` (`ff3149adcee37a8846c7b4565caa7b2c`, 2,535,729 bytes); the kit census, the allocation, the costs, the route, the stills
and the clips on `a99eb7b` (`e80577e2e2ac815205bf8b1572e767bd`, 2,537,038 bytes); the mutations on `27a3d2f`. The three draw the same:
they differ in the self-test's checks (c) and (e) and a counter it reads (section 17.12). The prerequisites' evidence was made on their own commits' builds (`2af8ed9`,
`1c6b54e`), named in each file. Each JSON names its build (`build`, `md5`). The scripts are in `tools/stage8/`, `tools/step6/` and
`tools/visual/` (not bundled).

| path | made by | what |
|---|---|---|
| `8e/envelope.json` | `envelope-8e.js --rev 2f41819` (on the prerequisite's working tree; reproduced since by `--revs 2f41819,2af8ed9`) | section 17.1: the audit's case, a mesh's envelope across a geometry swapped and back and a changed definition, on 8D as merged and as corrected |
| `8e/mutate-pre1.json` | `mutate-8e.js --only none,envonce,stale8d,envcache8d` (on the prerequisite's build) | section 17.1: the self-test's 8D block with each of 8D's three rules put back |
| `8e/equiv.json` | `equiv-8e.js` (on the prerequisite's build) | section 17.2: the old and the new static rule on records and on the build, with a mesh wrongly culled and noise elsewhere |
| `8e/artillery-readings.md` | read on the page images (the data task, `d95bfe0`) | section 17.3: the artillery's 15 readings, each passage as printed, its grade, its scope, what is drawn |
| `8e/kit-census.json` | `kit-census-8e.js <8D> <8E>` | section 17.4: triangles per figure by class, 8D's kit and 8E's two levels, and per drawn gun the vehicles, the team and the drivers |
| `8e/census.json`, `8e/census.md` | `census-8e.js <8D> <8E> --phone` | section 17.13: one whole frame per view after the eye moved, by pass, reconciled with `renderer.info`, 8D's against 8E's; on 8E the frame with every amplitude 0 beside it |
| `8e/cost-0845.json`, `8e/cost-0845-fast.json`, `8e/cost-1040.json` | `cost-8e.js <8E> --t0 525` (½x and 1x), `--t0 525 --speeds 2,4` and `--t0 640 --speeds 0.5` | section 17.13: the gait's and the level of detail's CPU per step of a played stretch (the dwell off) in four views, the slopes counted, benched and timed, the slope attributes uploaded |
| `8e/alloc.json` | `alloc-8e.js <8D> <8E> --steps 600 --warm 600` | section 17.13: the bytes allocated under 8E's per-frame functions while only the eye moves, after a warm-up (Chrome's sampling heap profiler) |
| `8e/mutate-8e.json` | `mutate-8e.js` (on 8E's build) | section 17.12: the self-test's 8D and 8E blocks on the build and on copies with one rule broken |
| `8e/mutate-css-8e.json`, `8e/mutate-css-8d.json` | `mutate-css-8e.js`, `mutate-css-8d.js` (on 8E's source) | section 17.12: `css-test.js`'s 8E and 8D blocks on the source and on copies of `app.js` with one rule broken |
| `8e/route-gait-local.json` | `tools/step6/perf-local.js --gait --quick` | section 17.13: the device route's gait bracket run end to end here, every block in its order (software WebGL draws 0 to 2 frames in a block's seconds, as in 8D's local runs: its times and verdict decide nothing) |
| `8e/stills/<id>.jpg` | `clips-8e.js --before <8D> --after <8E>` (its PNGs converted to JPEG, `ffmpeg -q:v 3`, to keep the folder small, as Part A's captures) | section 17.14: the troops at a paused clock, 8D above 8E where both draw the view; the level of detail by distance; the slope at 10.33x; a phone's page |
| `8e/clips/<id>.mp4`, `8e/clips/record-log.txt` | `clips-8e.js` | section 17.14: Play's own stepping at 10 frames a second of the clip: infantry (8D above 8E), cavalry, the limbered guns, the fade with the speed, a pause, the slope at 10.33x, a phone |

## Implementation PR 8F (28 October 2026; `docs/STAGE8_SPEC.md` section 18)

Made in Chromium 153.0.8010.12, the browser this session's container provides (`AUSTERLITZ_CHROME`; CI runs 141.0.7390.37, the headless
shell Playwright 1.56 pins, which this container does not have), software WebGL, 1600 x 900 unless named. The builds: 8E's as merged
(`d73d01154b8f6e2552fe04bfb24d05e5`, 2,537,677 bytes, `git show 94d6e46:austerlitz-command-map.html`), the "before" of every 8F comparison;
prerequisite 1's (`7a37ab066c86779b5944406ffbd806e8`, 2,555,560 bytes, `5f59c10`), the "before" of prerequisite 2's; prerequisite 2's
(`7dd102275472f8fa61464465fd99b593`, 2,569,416 bytes, `0c4ce62`; `3a074c5`'s `32b7b234e0ac92b4ddb07bd9d73920a6`, 2,571,096 bytes, differs in
the self-test's check (h) alone); 8F's (`6ba949da17229530324add3c54dd94ff`, 2,607,535 bytes, `e618e5e`). Each JSON names its build (`file`
or `build`, `md5`) and its browser. The scripts are in `tools/stage8/` (not bundled). The captures are JPEG (as 8E's), the clips H.264.

| path | made by | what |
|---|---|---|
| `8f/pause.json`, `8f/clips/pause-8e-8f.mp4` | `pause-8f.js --before <8E> --after <prerequisite 1>` | section 18.1: the gait paused, resumed and sought by real clicks through the app's own loop, 8E above the fix |
| `8f/mutate-pre1.json` | `mutate-8e.js --only none8e,gaitcrew,gaitrmease,gaitnoease,slopestale,pauseease,seekease,playseek` (on prerequisite 1's build) | section 18.1: the self-test's 8E block with the pause's rules broken (8E's ease at a pause, a seek eased, Play's advance counted as a seek) and four of 8E's own |
| `8f/contact.json`, `8f/contact/c_gren-4x-*.jpg`, `8f/contact/dok-10.33x-*.jpg` | `contact-8f.js --before <prerequisite 1> --after <prerequisite 2>` | section 18.2: every pose against its instance's rest, both kits, both factors, the cases beyond the tolerance; each instance on the two builds against itself; the worst cases close on both builds |
| `8f/contact/contact-ways.json` | `contact-8f.js` on the profile option's build | section 18.2: the chords and each foot's own profile, the same sample |
| `8f/contact/profile-option.patch` | `git diff` of the option against prerequisite 2's first draft | section 18.2: each foot's and each hoof's own profile, measured, not drawn |
| `8f/contact/cost-8e.json`, `8f/contact/cost-profile-every-block.json`, `cost-profile-rich-kit.json`, `cost-profile-48px.json` | `cost-8e.js [--views ...]` (on prerequisite 1's build and on the option's three builds, each named in its file) | section 18.2: the gait's CPU a frame with 8E's chords, with the profile on every block, on the rich kit's blocks, and where a man is drawn 48 px or more |
| `8f/contact/cost-chords-before.json`, `8f/contact/cost-chords-after.json` | `cost-8e.js` on prerequisite 1's build and on 8F's, back to back, alone | sections 18.2 and 18.7: the gait's CPU a frame with 8E's chords and with prerequisite 2's |
| `8f/mutate-pre2.json`, `8f/mutate-pre2-count.json` | `mutate-8e.js --only none8e,contact,contactsole,contactdir,contactlookup,contactbound` (on `0c4ce62`'s build), `--only none8e,contactsole` (on `3a074c5`'s) | section 18.2: the self-test's 8E block with each rule of check (h) broken; `contactsole` passed the first (the bound alone admitted 8E's soles back) and fails the second (the count) |
| `8f/ice-margin.json` | `ice-8f.js --before <8E> --after <8F>` | section 18.3: the meres' light against the field beside them, three views, three clocks; the first draft taken apart |
| `8f/woods-8f-8e.json`, `8f/woods/<view>-<variant>.jpg`, `8f/sheets/<view>-woods.jpg` | `woods-8f.js --tag 8e` (on 8E's build, the prototypes in its live scene), `sheets-8f.py` | section 18.4: the three prototypes against 8E's woods in six views |
| `8f/woods-8f-8f.json`, `8f/woods/<view>-8f.jpg` | `woods-8f.js --protos "" --tag 8f` (on 8F's build) | section 18.4: 8F's woods as built, the same measures |
| `8f/atlas-8f.json`, `8f/atlas-8f.jpg` | `atlas-8f.js` (on 8F's build) | section 18.5: the ground's atlas cells as the shader samples them, correlated with the canvas's own cell and the flipped one |
| `8f/mutate-8f.json` | `mutate-8f.js` (on 8F's build) | section 18.6: the self-test's 8F block on the build and on copies with one rule broken |
| `8f/mutate-css-8f.json`, `8f/mutate-css-8e.json` | `mutate-css-8f.js`, `mutate-css-8e.js` (on 8F's source) | section 18.6: `css-test.js`'s 8F and 8E blocks on the source and on copies with one rule broken |
| `8f/selftest-local.json` | `npm run check:selftest` (on 8F's build, here) | section 18.9: the harness's report: the self-test 301 of 301 and every live block, the motion block failing here as on 8E's build in this browser (its counts pinned to CI's) |
| `8f/motion-8e-chromium153.json` | `label-motion.js --app` (on 8E's build, here) | section 18.9: the motion block's 24 runs on 8E's build in this browser: its counts and visibility 8F's in 23 of them |
| `8f/census.json`, `8f/census.md` | `census-8e.js <8E> <8F> --phone` | section 18.7: one whole frame per view after the eye moved, by pass, reconciled with `renderer.info`, 8E's against 8F's |
| `8f/cost-8f.json` | `cost-8f.js --before <8E> --after <8F>` | section 18.7: the frame's calls, triangles and time as the app draws it, the near detail on and off (software WebGL: where the work went, not a device's time) |
| `8f/stills-8f.json`, `8f/pairs/<view>.jpg` | `stills-8f.js --before <8E> --after <8F>` | section 18.8: each view on both builds, side by side (8E left), the state each reached |
| `8f/clips/<clip>-8e-8f.mp4` | `stills-8f.js` | section 18.8: an orbit at the pheasantry's edge, a dolly toward the Satschan mere's ice, a slow pan low over the fields (8E above, 8F below) |

## Implementation PR 8G (29 October 2026; `docs/STAGE8_SPEC.md` section 19, written in 8H)

8G's own index is `8g/README.md`: the readings of the texts and the stable cadastre (`readings-texts.md`, `readings-cadastre.md`, `cadastre/`,
`negatives.md`, `sources.md`, `quote-check.md`), the places note (`places.md`) and the prerequisites' measures, each as 8G committed them. What
8G cited and did not commit is said there, with what 8H added from 8G's own CI runs and what it reconstructed:

| path | made by | what |
|---|---|---|
| `8g/selftest-ci-dddd4e4.json` | CI's `check:selftest` artifact, run 40870570661 on `dddd4e4` (downloaded in 8H) | section 19.6: the self-test 313 of 313 on CI's browser, every live block passing |
| `8g/census-ci.json`, `8g/census-ci.md` | `census-8g.js --before <8F's report> --after <8G's report>` (CI's `check:visual` reports, runs 40665840278 and 40870570661) | section 19.6: one frame by pass in each of the 39 cases, the buildings' calls and triangles, 8F's against 8G's |
| `8g/ci-pairs/<case>.jpg` | CI's own captures of the two runs above, side by side (8F left) | section 19.7: seven cases as CI drew them |
| `8g/stills-pre1.json`, `8g/stills-pre2.json`, `8g/stills-8g.json`, `8g/pairs/<set>-<view>.jpg` | `stills-8g.js --set pre1|pre2|8g` (8G's tool, unchanged), run in 8H on the exact builds (md5 in each file), Chromium 153 | section 19.7: **reconstructed**: the prerequisites' and the buildings' matched captures |

## Implementation PR 8H (30 October 2026; `docs/STAGE8_SPEC.md` section 20)

Made in Chromium 153.0.8010.12 here unless named; the motion block's runs in Chromium 141.0.7390.37 (Playwright 1.56's headless shell, the
browser CI runs and decision 257 (b) pins), installed in this session's scratch space. Software WebGL, 1600 x 900 unless named. The builds: 8G's
as merged (`508927e6f72e1b6f2f9186e954d61b59`, 2,740,873 bytes, `git show 636cc5d:austerlitz-command-map.html`), the "before" of every
comparison; 8H's commits' builds, each named by its md5 in its file. The scripts are in `tools/stage8/` (not bundled).

| path | made by | what |
|---|---|---|
| `8h/checklist.md` | by hand, from the measures below | section 20.1: every requirement, exception and finding with its status |
| `8h/motion/motion-8g.json`, `motion-2f10a1f.json`, `motion-8h-driver.json` | `motion-8h.js <build> --json` on Chromium 141 | section 20.4: the motion block on 8G's build, on `2f10a1f`'s (the Play runs changed by the pose held at a seek) and with the driver's fix (every run 8G's) |
| `8h/motion/frames-8g.log`, `frames-8h.log` | the block through a copy of `motion.js` counting the frames drawn (what `motion-8h.js --frames` makes; run before the driver's fix) | section 20.4: the eight pre frames drawn on 8G's build in the paper map's Play, two on 8H's |
| `8h/motion/motion-258b-c4.json`, `motion-258b-c8.json` | `motion-8h.js --proto counters:c4|c8` on Chromium 141 | section 20.8: decision 258 (b)'s two prototypes on the motion block |
| `8h/far/far-8h.json`, `8h/far/<view>-<variant>.jpg`, `<view>-sheet.jpg` | `far-8h.js` | section 20.9: decision 255 (d)'s prototype, the far names' contrast as rendered and every map text at AA |
| `8h/woods-8f-8h.json`, `8h/woods/<view>-<variant>.jpg` | `woods-8f.js --module woods8h --protos t-vol,t-vol50` | section 20.10: the crowns shaded as one volume |
| `8h/near/` | `woods-8f.js --module woods8h --protos t-near,t-nearvol` | section 20.10: the crowns closing near the eye |
| `8h/mutate-css-8h.json` | `mutate-css-8h.js` | section 20.11: `css-test.js`'s and `geo-test.js`'s 8H rules on copies with one broken |
| `8h/mutate-8h.json` | `mutate-8h.js` | section 20.11: the self-test's 8H checks on copies with one rule broken |
| `8h/selftest-chromium141.json` | `check:selftest` on the final build here, in Chromium 141 (`AUSTERLITZ_CHROME`), before the manifest was written | section 20.11: 316 of 316 checks and every live block passing; its six failures the old manifest's (313 checks: three new, one renamed), from which the manifest was written |
| `8h/geo/` | `fetch-places.js`, `period-trace.py`, `compute-places.js`, `period-figures.py`, `consequences.js` (its `README.md`) | section 20.6: the landmarks' research made again (every response kept, `raw/manifest.json`), the frame checked, the period maps read; `proposal.md` and `consequences.json` |
| `8h/near/near-frame-e8fed44b.log`, `8h/near/near-frame-final.json` | `near-8h.js` (the prototypes on `e8fed44b`'s build; `--uniform` on the final build, the hook on and off) | section 20.10: the shimmer over the whole frame, the measure the tree check is built on |
| `8h/ice/ice-8h-clear.json`, `ice-8h-sky.json`, `8h/ice/ice-<view>-1500-<variant>.jpg`, `<view>-1500-<clear|sky>-sheet.jpg` | `ice-8h.js --clear 0.20,0.26,0.32,0.40`, `ice-8h.js --sky 1.4,0.7,0` | section 20.10: the ice under a low sun, the ice rules' ratios and the glare by variant |
| `8h/contact-8g-8h/contact.json`, `contact/*.jpg` | `contact-8f.js --before <8G> --after <8H>` | section 20.10: the troops on the ground against the original criterion, 8G's build and 8H's |
| `8h/contact-profile/contact.json`, `contact/*.jpg` | `contact-8f.js --before <8H> --after <8H with 8F's profile option>` (the option's patch applied to 8H's sources but for its self-test hunk) | section 20.10: the profile option's contact on 8H's build |
| `8h/contact/cost-*.json` | `cost-8e.js` on 8H's build, with the profile option on every block and where a man is drawn 48 px or more, on an idle machine | section 20.10: the profile option's cost a frame against the chords' |
| `8h/buildings-8h.json`, `8h/plans/` | `buildings-8h.js --builds 8g=<8G>,8h=<final>`, `plan-8h.js` | section 20.3: the buildings per village, 8G's build and the final, and Austerlitz's and Satschan's plans drawn |
| `8h/s7-8g.json`, `8h/s7-8h.json` | `s7-8h.js` on 8G's build and the final | section 20.4: S-7's three seams |
| `8h/pose-8h.json` | `pose-8h.js --builds 8g=<8G>,8h=<final>` | section 20.4: a block at a pause, a seek and a resume |
| `8h/clips/pause-8g-8h.mp4`, `pause-8g-8h.json` | `pause-clip-8h.js` | section 20.4: the clip, 8G's above, 8H's below |
| `8h/toast/8g.json`, `8h/toast/8h.json`, `8h/toast/8g/<size>-<presentation>.jpg`, `8h/toast/8h/...` | `toast-8h.js --shots` on 8G's build and the final | section 20.5: the phase's message against the controls at the nine sizes, Study and Watch, each case's capture |
| `8h/toast/toast-8g-8h.jpg` | `toast-sheet-8h.py` (Pillow, from the captures) | section 20.5: four sizes in Study, 8G's capture beside 8H's |
| `8h/g2-8h.json` | `g2-8h.js` | section 20.7: the geography of `636cc5d` and of the final sources compared number by number |
| `8h/startup-8h.json` | `startup-8h.js --builds 8g=<8G>,8h=<final> --loads 7` (an idle machine) | section 20.7: the start's cost over repeated loads, medians and 95th percentiles |
| `8h/stills-8h.json`, `8h/pairs/8h-<view>.jpg` | `stills-8h.js --before <8G> --after <final>` | section 20: the matched captures of what 8H changes on screen, and of views where it changes nothing |
| `8h/mutate-8h-final.json` | `mutate-8h.js --only ...` on the final build (the planner's equivalent mutations reported as such; the crowns' check) | section 20.11 |
| `8h/route-phone-local.json`, `route-fx-local.json`, `route-desktop-local.json` | `tools/step6/perf-local.js` (the phone route, the effects bracket, the desktop route) on the final build, software WebGL | section 20.12: the device routes run end to end here (their times decide nothing) |
