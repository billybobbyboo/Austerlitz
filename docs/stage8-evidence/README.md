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
