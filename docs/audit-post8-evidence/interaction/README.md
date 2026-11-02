# Area "interaction": application state under real interaction sequences

The final audit after Stage 8. Audited build `austerlitz-command-map.html`, md5 `f10fe585c46aea576f436ed51ac46f83`, 2,810,630 bytes (every
record here carries the md5 it ran on). No application source, data, threshold, test, archive or build file was changed. Browser: the pinned
Chromium 141.0.7390.37 headless shell (CI's), ANGLE on SwiftShader (software WebGL); the machine was shared (load average 15-28 on 4 cores),
so no wall-clock figure here is a device's.

The structured result is `result.json` (written by `tools/audit-post8/interaction/result.js`); the checks of every run are tabulated in
`summary.json` (`tools/audit-post8/interaction/summarise.js`).

## How

- **Pages.** A visitor's page (no `?harness=1`, CSS transitions kept, the first-run card closed by Esc or its own button) at 1600 x 900,
  1280 x 720, 880 x 660 at density 2 (a retina laptop in a small window) and 1280 x 720 with touch (a touchscreen laptop); phone pages at
  390 x 844 (density 3, touch, an iPhone's user agent). Each page is instrumented before its scripts run (`ilib.js` INSTR: listeners, timeouts,
  intervals, animation frames, observers).
- **Input.** Real input throughout: `page.mouse` (presses, drags with the button held, the wheel, right button), `page.keyboard`, taps
  (`page.touchscreen`), one-finger pans and cancelled touches (CDP `Input.dispatchTouchEvent`), resizes by `page.setViewportSize`. Where a key
  needs a focused control, the focus is put there by script (as a visitor's Tab would leave it) and the step says "set up".
- **Frames.** The frame driver (`ilib.js` DRV, after `tools/visual/motion.js`): the app's own `loop()` called one frame at a time on a 30 fps
  clock of its own (`performance.now` answers the driver's time), the WebGL draw skipped unless a screenshot is asked for. Every rule that reads
  the clock (Play, the dwell, Follow, the tweens and glides) runs as at 30 frames a second. `setTimeout` timers (the phase's 3.4 s message, the
  tip's 150 ms) still run in wall-clock time: compressed against the driver's clock (see "Environment").
- **Observation.** After each step a snapshot of the state a visitor sees and the state behind it (`ilib.js` SNAP); for paths to the same
  clock a fingerprint of what the frame draws (`ilib.js` FP: blocks, overlays and their draw-on, the map layer's placed items, captions,
  dispatch, light, fog, camera). App globals are read, never written, except where a step says "set up".

## Scripts changed in this session (the first attempt's scripts were kept; fixed only where broken)

| file | change | why |
|---|---|---|
| `ilib.js` `clickEl` | the target scrolled into view in its own panel; its box read until it holds still; a running CSS transition finished when the target is not yet hit | the Layers panel's last row ("Pause briefly at events") lay below the window; a dossier sliding in had no settled box (s1 run 1's six step errors) |
| `ilib.js` `finishTransitions`, `domSettle`; `openV` `o.dpr`, `o.touch` | new helpers | see "Environment"; a retina and a touchscreen laptop |
| `irun.js` `dragRail`/`railStart`, `setPlay`, `KEEP` | a rail drag starts where the rail itself takes the press; Play pressed by state; `dwellBtn` kept | s1's drag fell on an event marker (itself a finding, IA-3); s2 run 1 pressed Play blindly after a state change; s1b's `dwell-off` lost the attribute |
| `s2-modes-during-play.js` | the steps after Clean rewritten with Play set by state; Space in Clean recorded as what it is | run 1 (kept as `.run1.json`): Space pressed the focused Restore button, every later check read a paused clock |
| `s3-selection-reading.js` | the eye level reached by the Eyes button and the vantage bar's "Eye level" | the docked dossier covers the Command tab (by design) |
| `s5-revisit-determinism.js` | path F moves the pointer off the timeline before Play; hidden blocks, the camera and the camera-following fog compared apart | run 1 (`.run1.json`): Play covered by the timeline's tip (itself a finding, IA-2); differences in invisible blocks' stale transforms |
| `s7-resize-rotate.js` | waits for the app's own resize handler (its camera aspect) with real frames; a panel counts as shown when it intersects the window; screenshot names unique | run 1 (`.run1.json`) read the page before `onResize` had run |
| new | `s1b-recheck.js`, `s10b-phone-drag.js`, `s11-state-hypotheses.js`, `s11b-arrows-tier.js`, `s12-act-leak.js`, `s13-tip-covers.js`, `s14-glide-input.js`, `summarise.js`, `result.js` | re-checks of broken parts; the state area's hypotheses; the scope of findings found on the way |

## Commands

```
cd /home/user/Austerlitz
node tools/audit-post8/interaction/<script>.js        # each writes docs/audit-post8-evidence/interaction/<name>.json (+ screenshots)
node tools/audit-post8/interaction/summarise.js        # summary.json and a table
node tools/audit-post8/interaction/result.js           # result.json
```
Each scenario ran once here, in pairs, 1.5-6.5 minutes each (page boot 20-130 s); `s1`'s first run is the first attempt's.

## Results by scenario

| scenario | checks | result |
|---|---|---|
| s1 seek, dwell, speed (1600x900; first attempt) | 20 | 12 valid and as expected (PageDown in a hold, Play after it, Home, End, End then Play, an event marker's Enter during Play, 1/2x in an ease in, the speed standing). **A theme chosen during Play does not stop it** (state finding 1). The other 6 failures were script faults, re-measured in s1b |
| s1b re-check (1600x900) | 10 | rail drag during Play, a day-track anchor during Play, the dwell off/on/off in a hold, 4x in a hold, 2x in an ease out: as expected. **The playhead under an event marker** (IA-3) |
| s2 modes during Play (1280x720) | 16 | all as expected (Watch, Clean, Space in Clean, Study, paper map, counters, landscape, relief disabled with its reason, 1x paused, Follow at 1x, a relief change mid-glide, Follow after it, ten rapid switches) |
| s3 selection and reading (1600x900) | 11 | all as expected; the card's text under the reading led to IA-5 |
| s4 tour, opening, reset (1600x900) | 18 | 15 as expected; 3 mis-specified checks (the first step's clock not recorded; the dispatch hidden because the visitor left the rail on the Plans tab): in substance as expected |
| s5 revisit, determinism (1280x720) | 7 | 6 as expected: 07:00 by four seek paths and 09:20 from both sides identical. 07:00 paused in the dwell vs sought: **the caption** (IA-6) and the blocks' facing (8H's pose hold, by design: Legrand 0.92 vs 0.13 rad) |
| s6 panels while dragging (1600x900) | 11 | 10 as expected; **the map pans under the "?" sheet while the button is held** (IA-7) |
| s7 resize and rotate | 22 | 20 as expected; 2 = the docked dossier over the rail (by design). **Focus left on the body** when the resize hides Layers (IA-8) |
| s8 rapid input, day's end (1280x720) | 7 | 6 as expected; the seventh differs only in a hidden block's stale transform and the toast's real-time timer (driver artefact) |
| s9 leaks (1280x720) | 2 | no growth in round 2 (table below); the script's own growth check compared the wrong pair (round 2's block with round 1's same block) |
| s10 phone (390x844) | 7 | 6 as expected (speed button, a tap in a hold, a phase tapped during Play, the toast, Watch from the Menu); **the camera moved on after a finger's pan** |
| s10b phone drag | 3 | with no glide running a finger's pan holds (paused, playing, playing in Watch): s10's movement was a phase glide (IA-1) |
| s11, s11b state hypotheses | 13 | state findings 2, 3, 4 (Space), 6, 7, 8 confirmed; the dwell's aria-pressed as expected; **arrows flash with the Movement layer off** (IA-4) |
| s12 act texts under a reading | - | scope of IA-5 |
| s13 tip over the controls | 4 | **Play's press swallowed by the tip** at both sizes (IA-2); the controls as expected |
| s14 input during a glide (1280x720) | 5 | **the glide undoes the drag, the wheel and the map's keys** in 4 of 4 exercised cases (IA-1); the phase-glide case not exercised |

No console warning, error or page error in any of the 20 recorded runs (summary.json).

### s9: listeners, timers and objects (two identical rounds of 8 cycle blocks; `s9-leaks.json` `rec`)

| point | live listeners | timeouts | intervals | rAF | observers | geometries | textures | programs | DOM | map items | scene |
|---|---|---|---|---|---|---|---|---|---|---|---|
| base | 380 | 0 | 0 | 1 | 1 | 379 | 30 | 35 | 822 | 31 | 266 |
| end of round 1 | 688 | 0 | 0 | 0 | 1 | 290 | 27 | 31 | 1,979 | 108 | 268 |
| every block of round 2 | 688 | 0 | 0 | 0 | 1 | 290 | 27 | 31 | 1,965-1,979 | 108 | 268 |

Round 1's +308 listeners are exactly 77 new map-layer items x 4 (focus, blur, keydown, click), each created once per key (`mlItem`) as the tour
and the opening reach places and events not shown at 04:00; the DOM's rise is the sources sheet and the keys sheet built once. Round 2 adds 0.

## Findings (detail in `result.json`)

| id | severity / priority | finding | evidence |
|---|---|---|---|
| IA-1 | S2 / P2 | A pan, zoom or keyboard pan during a camera glide (a vantage, a dossier's centring, a phase, a theme, a tour stop) is undone: Follow turns off but the glide's camera slot keeps writing the camera to its destination (`LANDCAM.free` sets `freeCam` only; only `redrawGround` stops the slot, 8H). Contradicts `docs/STAGE3_SPEC.md` A.3 ("the eye stays where the visitor put it") | `s14-glide-input.json` (moved 525.5, 185.7, 185.9, 335.4 after the input), `s10-phone.json`, `s10b-phone-drag.json` |
| IA-2 | S3 / P2 | The timeline's tip covers the control row (Play, Next, Next event, Follow); hoverable (WCAG 1.4.13), it takes a press aimed at Play from the timeline | `s13-tip-covers.json`, `s5-revisit-determinism.run1.json` |
| IA-3 | S3 / P3 | At an event start the marker's enlarged hit area covers the playhead: a drag from the playhead does not scrub; 22.7% of the rail's centre line at 1600 px is marker | `s1b-recheck.json` |
| IA-4 | S3 / P2 | With the Movement layer off every phase change flashes the outgoing phase's arrows at 0.87, fading over about 1.1 s (`applyOverlayOpacity` omits the layer factor for the outgoing group) | `s11b-arrows-tier.json` and its two drawn frames |
| IA-5 | S3 / P3 | Under a reading that does not know a formation its card's "Doing now" still names the place (320 of 480 hidden formation-clocks under Napoleon's reading, 304 of 798 under the Allied; 35 distinct texts), against 8A's premise "orders, not places" | `s3-selection-reading.json`, `s12-act-leak.json`, `s11-state-hypotheses-card-under-allied-reading-0730-dom.jpg` |
| IA-6 | S4 / P4 | Pausing in a dwell's hold leaves the caption naming the dwell's events; repainted only at the next clock change | `s5-revisit-determinism.json` |
| IA-7 | S4 / P4 | A modal sheet opened mid-drag does not end the drag | `s6-panels-while-dragging.json` |
| IA-8 | S4 / P4 | Focus falls to the body when a resize hides the focused control | `s7-resize-rotate.json` |

## The area "state" hypotheses in the browser

| state finding | status here | evidence |
|---|---|---|
| 1 a theme does not stop Play | confirmed (real click: 07:00 set, Play on, 07:14 three seconds later) | `s1-seek-dwell-speed.json` |
| 2 the open dossier goes stale | confirmed: the card at 12:37 still "Where: Zuran mound"; the app paints "Stare Vinohrady" | `s11-state-hypotheses.json`, `-stale-card-1237-dom.jpg` |
| 3 an interrupted fade pops the arrows | confirmed: 0 to 0.873 when 08:00 is stepped to 0.5 s after 07:00 | `s11-state-hypotheses.json`, `-pop-*.jpg` |
| 4 the first frame after idle advances 120 ms | confirmed for Space with nothing focused (0.6 then 0.167 clock min); not for Enter on a focused Play button | `s11-state-hypotheses.json` |
| 5 the reading cached per minute | not re-tested | |
| 6 the event jumps skip a near start | confirmed: paused at 04:14.39 in the ease in, "." went to 07:00 | `s11-state-hypotheses.json` |
| 7 the rail drag: any button, no cancel | confirmed (was inferred): a right click seeks, contextmenu not prevented on the rail; after a cancelled touch a buttonless mouse scrubs (06:30 to 10:00) | `s11-state-hypotheses.json` |
| 8 the low tier decided once | confirmed: enlarged to 1600x900 at density 2, pixel ratio 1 and no shadow (a page opened at that size: 2 and shadow) | `s11b-arrows-tier.json` |

## Observed and by design (not findings)

- In Clean the focus moves from the hidden Play button to Restore (SW-5), so Space presses Restore; the key table says so ("on a focused
  button, Space presses the button"). With nothing focused Space pauses (`s2`).
- At a paused clock the blocks' facing is the pose last drawn (8H, `app.js` 5953-5964), so 07:00 paused in the dwell and 07:00 sought differ in
  facing (Legrand by 0.79 rad): 8H's chosen rule, path-dependent by construction.
- A guided tour stays open while the visitor plays the clock (the bar still "Stop 2 of 9", its stop 04:00, while the clock plays at 04:15):
  the tour ends only by its own buttons, Esc or the tour button (`s4`). A possible improvement, not a defect.
- The relief buttons are disabled during Play (Stage 2B: a change measured at 215 ms on software rendering).
- A map drag closes the Layers panel (the drag's click is outside it).

## Environment (not application failures)

- **CSS transitions wait for a composite.** In these pages a composited transition (the dossier's 0.32 s slide) stayed pending, its
  `currentTime` 0, for 16-29 s of the document timeline, with or without the driver; the first composite (a 10 x 10 screenshot) took 23.7 s at
  1280 x 720, after which it had ended; the same transition on a blank page ended within 0.8 s (scratchpad `probe-close.js`, `probe-css.js`).
  The panels' `backdrop-filter` blur over the canvas, composited in software on a loaded machine, is the likely cost. The scripts finish CSS
  transitions as a set-up before clicking inside a sliding panel (`finishTransitions`), which a visitor's 0.32 s gives.
- **The resize event needs a rendering step.** With the app's loop stopped by the driver, `onResize` ran only once real frames were asked for;
  s7's first run and s11's first tier read were taken before it. Re-measured with the handler waited for.
- **Wall-clock timers against the driver's clock.** A day played at 4x in a few seconds of wall clock keeps the 08:45 message's class on at
  18:00 (`s8`); not an application issue.

## Not checked

Real hardware and real time; the native context menu (headless shows none: that it swallows the release is inferred); state finding 5 in the
browser; a drag during a phase glide on the desktop (the phone's equivalent is confirmed); paper-map glides with input; reduced motion during
these sequences; Firefox and WebKit; screen readers; pinch during a glide; sessions longer than two rounds of cycles; CSS-transition timing as a
visitor sees it.

## Evidence index

- Records: `s1-seek-dwell-speed.json`, `s1b-recheck.json`, `s2-modes-during-play.json` (`.run1.json`), `s3-selection-reading.json`
  (`.run1.json`), `s4-tour-opening-reset.json`, `s5-revisit-determinism.json` (`.run1.json`), `s6-panels-while-dragging.json`,
  `s7-resize-rotate.json` (`.run1.json`), `s8-rapid-dayend.json`, `s9-leaks.json`, `s10-phone.json`, `s10b-phone-drag.json`,
  `s11-state-hypotheses.json`, `s11b-arrows-tier.json`, `s12-act-leak.json`, `s13-tip-covers.json`, `s14-glide-input.json`; `summary.json`;
  `result.json`.
- Screenshots (`-dom` = the page's DOM with the canvas hidden; others a frame drawn by the app): `s1-*` (first attempt), `s1b-recheck-end`,
  `s2-modes-during-play-*` (watch-playing, paper-playing, 1x-playing, after-rapid-switches), `s3-selection-reading-*` (selected-playing-ph2,
  gone-formation-selected, eye-level-selected), `s7-resize-rotate-*` (dossier-1-1600, dossier-2-1024, dossier-4-390, dossier-5-1024,
  dossier-6-1600, sources-390, layers-700, phone-turned-menu, phone-dossier-back), `s8-rapid-dayend-day-end`, `s10-phone-phone-phase-list`,
  `s11-state-hypotheses-*` (stale-card-1237, pop-before/after-second-pagedown, card-under-allied-reading-0730), `s11b-arrows-tier-*`
  (arrows-off-0800, arrows-off-pagedown-0845), `s4-tour-opening-reset-*` (tour-in-watch, tour-playing, complex-paper), `s5-revisit-determinism-*`
  (A-0700, B-0700); s11's own arrows-off step pressed PageDown with the focus off the rail (no phase change): its check is superseded by
  s11b and its two screenshots were removed; the first attempt's `drawtest-*`, `drvtest`, `smoke-playing`.
- Scripts: `tools/audit-post8/interaction/` (`ilib.js`, `irun.js`, `s1`-`s14`, `summarise.js`, `result.js`; the first attempt's `drawtest*.js`,
  `drvtest.js`, `framecost.js`, `smoke.js`). Logs: scratchpad `interaction/*.log`.
