# UI/UX roadmap step 3: how Follow's framing and the camera's continuity were measured

Every number in `README.md` comes from one of the tools below, run with the same arguments on the Step 2 build (the base) and on this build, or
from the project's own checks. Nothing here is a frame rate or a GPU's cost: the frame times are the owner's devices' to give (section 6 of
`README.md`).

## A run

- **Builds.** The base is `main` at `9d6b37451419721c759cca473da20bf8384f9247` (the Step 2 merge, verified): `austerlitz-command-map.html`, 3,071,014
  bytes, md5 `07cbcaf32808c430198d55b1b7ed78b7`, SHA-256 `06842ca46dfbdaf6c892de2393b83b5e28c6fe211a180c53244688bfbedaf186` (a copy:
  `device/builds/austerlitz-07cbcaf3-step2.html`). The candidate is this branch's build (its fingerprint in `README.md`). Each opened from disk with
  `?harness=1` (deterministic frames), three.js r128 served from `node_modules` and checked against the page's integrity hash
  (`tools/visual/three-route.js`).
- **Browser and renderer.** Chromium 141.0.7390.37 (the build Playwright 1.56.0 pins), headless, software WebGL (ANGLE on SwiftShader), Linux, 4 CPU
  cores. The phone is **Chromium's emulation** (390 x 844, density 3, touch, an iPhone's user agent), not a physical device.
- **The clock.** Every Play runs on the motion driver's clock (`tools/visual/motion.js`): the app's own loop stepped at 30 frames a second whatever
  the machine's speed, the WebGL draw skipped except where a frame is captured or counted. So a run's frames are the same on any machine, and the
  two builds are compared frame for frame.
- **The start.** The card closed by a real click or tap, the pointer parked off the map (2, 2), the ground and presentation asked, the clock set to
  the run's start, and **the eye put at that phase's authored view** (`presetFrame(PHASES[ph].cam)`), Follow on, half speed, Play. The start is
  set explicitly, not left to each build's own seek, because this step changes what a seek does to the camera.

## The framing (`tools/ux-step3/framing.js`; the sweeps `tools/ux-step3/sweep.js`; the tables `table.js`, `compete.js`)

Every frame, in the page:

- **The live events with a weight above 0.3** (UA-02's rule, `liveEvents`' own weight): each one's place projected on the drawn ground and classed:
  inside the free map (the largest rectangle no panel covers, `landFreeRect`, the rectangle Follow frames into), on the screen but outside it ("the
  margin"), under a panel, off the screen or behind the eye. **Only "inside the free map" counts as framed**; off-screen and panel-obscured events
  are misses, and so are events in the margin.
- **Per event, by minutes:** a minute counts for an event when it qualifies in at least half the minute's frames, and it is inside when it is inside
  in at least half of those. **Per minute:** a live minute (one with a qualifying event) has all its events inside when, in at least half its
  frames, every qualifying event is inside.
- **The composition:** the formations on the field projected by their place on the drawn ground, those inside the free map, and their bounding box's
  share of the free map (Step 2's `comp()`, the audit's measure). The goal lines are UA-02's: 50% on a desktop, 40% on a phone.
- **The eye:** its distance to its target, its elevation and azimuth, its clearance above the floor (`camFloor`).
- **The projected movement:** the ground under a 5 x 5 grid of the free map (`groundAt`) and the qualifying events' places, taken in one frame and
  projected again in the next; a point counts while it is on the screen in both. The largest move in CSS px a second is "the ground's move"; the
  target's own point, so taken, is "the target's move" (the 150 px/s cap's measure). On the phone the view offset itself eases when a panel changes
  size (the dispatch sheet as the phase's text changes length), moving every point on the screen whatever Follow does: those frames are counted
  apart (on both builds, 186 of a full day's frames on the phone).
- **The rich kit** (`KLOD`): the blocks drawn rich in the frame. **The labels:** drawn, formation names in the layer and drawn, dropped.
- **The census** (`--census N`): every Nth frame drawn by the app's own WebGL frame and its `renderer.info` read (draw calls and triangles, every pass).

The full day is 04:00 to 18:00 at half speed: 6,240 frames, 683 live minutes, 1,500 event-minutes.

## The camera's continuity (`tools/visual/ux3.js`, alone by `tools/ux-step3/continuity.js`; judged by `tools/visual/thresholds.js` `checkUx3`)

Each case starts from a view reached without motion (the clock set and the eye at that phase's authored view, Follow on), then a visitor's input
(Playwright's real mouse, keyboard or touch: the browser's own events reaching the app's own handlers), then 100 of the app's frames on the
driver's clock, and the eye read as they leave it (its position and target; "moved" is the larger of the two displacements, in world units). In
every frame: the clearance above the floor, the ground's move under a 5 x 5 grid of the free map and the orbit target's own move. The cases are
listed in `ux3.js`'s head. A rail drag is one press, one move to the drag's end and the release: a drag of several moves lost the rail's pointer
capture after its first move in some runs (the browser's `lostpointercapture` with no release by the app; on the Step 2 build too, on the
Landscape with counters and under reduced motion). That is a lead for a later step, not investigated here; with one move every case crosses the
phase it must cross on both builds.

## Step 2's measures again (`tools/ux-step2/probe.js`, unchanged; the table `tools/ux-step3/ux2-table.js`; the captures `tools/ux-step3/sheet.py`)

Step 2's tool with Step 2's arguments: 08:30 to 09:30 (548 frames, a drawn frame every 15th and at 08:44.7, 08:57, 09:00 and 09:15) and 11:30 to
13:00 (728 frames, every 30th and at 12:15 and 12:30), at 1440 x 900 and 390 x 844, Study and Watch, the Landscape; and 08:30 to 09:30 on the
Landscape with counters, the paper map, the Allied reading in Study and Napoleon's in Watch. Its start is the build's own seek
(`setClock(from,{instant:true,force:true})`, which both builds still answer with the phase's authored view: only a visitor's seeks changed), so the
Step 2 build's records in `docs/ux-step2-evidence/runs/` are that build's runs of this tool and are the "before" here.

## The phone turned (`tools/ux-step3/rotate.js`)

A phone's page in Study, Play from 08:48 with Follow; after 150 frames the page turned to 844 x 390 (held landscape: the desktop's layout and Follow's
desktop profile), after 150 more turned back, then 150 more. The frame after each turn (the projection's own change) is not counted in the moves.

## The motion block (`tools/stage8/motion-8h.js`, judged by `tools/ux-step3/motion-judge.js`)

The harness's motion block on a page of its own (both the self-test's set and `check:visual`'s), judged by `thresholds.js` `checkLive`'s motion
part alone, on both builds.

## The device route (`tools/step6/perf-route.js`, version 4, unchanged)

`tools/step6/perf-local.js` runs it here on both builds (software WebGL: it shows that the route runs, the segments it records and the builds' own
draw calls and triangles; its frame times decide nothing). The owner's runs are the measurement (`device/PROTOCOL.md`).
