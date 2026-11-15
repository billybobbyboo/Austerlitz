# UI/UX roadmap step 2: how the label tiers were measured

Every number in `README.md` comes from `tools/ux-step2/probe.js` (the acceptance runs), `tools/ux-step2/block.js` (the regression block `ux2`) or the
project's own harness. The same tool, with the same arguments, was run on the Step 1 build (the base) and on this build.

## A run

- **Build.** The committed HTML, opened from disk with `?harness=1` (deterministic frames: no drift, no grain animation), three.js r128 served from
  `node_modules` and checked against the page's integrity hash.
- **Browser and renderer.** Chromium 141.0.7390.37, the build Playwright 1.56.0 pins (the project's `package.json`), headless, software WebGL
  (ANGLE on SwiftShader), as `check:visual` launches it. **No number here is a frame rate or a GPU cost.** The label pass's time is JavaScript time
  on this machine's CPU (4 cores, shared with other runs).
- **Viewports.** 1440 x 900 at density 1 (a mouse); 390 x 844 at density 3 with touch and an iPhone's user agent. The phone is **Chromium's
  emulation, not a physical device**: the layout, the label layer and the type are the phone's; Safari's text rendering and compositing are not.
- **The clock and the camera.** The card closed by a real click or tap; the Landscape in the presentation asked; the clock set to the run's start
  (the phase's view, as a visitor's seek gives it); then Play at half speed with Follow, on the motion driver's clock
  (`tools/visual/motion.js`: the app's own loop stepped at 30 frames a second, whatever the machine's speed). 08:30 to 09:30 is 548 frames;
  11:30 to 13:00 is 728. Two runs of one build give the same frames (the draw is skipped between the sampled frames; the layout reads nothing drawn).
- **Sampling.** Every frame: the layer's items and the composition. Every 15th frame (30th in the later window), and the frames at the clocks named
  (08:44.7 in the valley fog, 09:00, 09:15; 12:15, 12:30), are drawn by the app's own WebGL frame and captured three times.

## The measures

**Filled plates over the formations' box** (criterion 1; the audit's `comp()` measure, `docs/ux-art-audit/evidence/probes/metrics.js`, kept): the
formations on the field are projected by their place on the drawn ground; those inside the free rectangle of the map give a bounding box; the share
of that box under a filled plate is counted on a 1 px raster (the audit's was 4 px). A plate is filled if the label's own computed background has
any alpha: the same question is asked of both builds. Not counted as plates: a name's 8 px side square and its 15 px grade badge (reported apart,
"with marks and badges"), a casing, a leader line. Two differences from the audit's figures, which is why the base was measured again rather than
quoted: the free rectangle is the Landscape's own (the audit asked the paper map's of both), and every frame is read, not one in 210.

**Contrast as rendered** (criterion 2). A drawn frame is captured as rendered (A), with the layer's ink made transparent (B: plates and casings
stay) and with the layer hidden (C). A text's ink is the pixels the ink changed by half or more (A against B). Each measure is the 10th percentile
of the contrast between the ink's colour and a set of pixels (the worst decile, as the harness's `textContrast` has always taken it), the ink's
1 px anti-aliased fringe left out:

| Measure | Pixels | What it says |
|---|---|---|
| against the casing ("ring") | the first whole pixel round the ink beyond its fringe, on B | what each letter stands against |
| the words' whole box ("box") | every pixel of the words' line box, on B | for a plated label, its plate; for a cased label, the casing and the ground between and round the words |
| the bare ground ("bare") | the same box on C | what the ground alone would give, with neither plate nor casing |

Labels fading in or out (the stabiliser's 180 ms fades) are counted apart and not judged: their opacity is under 1 for a few frames.

**The formations a live event names** (criterion 3; the roadmap's measure, `tools/visual/motion.js` `LONG`'s, here on the Landscape). Over the
frames the clock played with an event's label drawn, each formation the event names (`EVENTS[].forms`) that has a name in the layer and stands
neither off the screen nor under a panel is "in view" (the denominator); it is "drawn" if its name is. A formation in view and not drawn is
classed: behind the ground, no room (dropped or held by the stabiliser), Watch's set. A formation outside the denominator is classed too: off the
screen, under a panel, not known to the active reading, not on the field at that clock, no name at that distance (the level of detail), or a corps
(which has no name of its own on the Landscape).

**The label pass** (criterion 2): the wall-clock time of each `mlLayout()` call during the run, its median and 95th percentile. The harness's own
limit (8 ms, the median of five passes over a settled view) is `check:visual`'s, case by case.
