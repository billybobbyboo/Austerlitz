# Area "state": simulation, state and application correctness

The final audit after Stage 8. Audited build `austerlitz-command-map.html`: md5 `f10fe585c46aea576f436ed51ac46f83` (2,810,630 bytes),
`origin/main` = `43e3e5b`. No application source, data, threshold, test, archive or build file was changed. Every experiment ran in an
isolated copy (`scratchpad/state-iso`, the tracked files at HEAD; `python3 build.py` there reproduced md5 `f10fe585…`).

## What was examined, and how

Static review of `app.js` (read by ranges; line numbers below are `app.js` at `43e3e5b`):

| subject | where |
|---|---|
| start-up | `boot` 608, `init` 613-688, `openFirstRun`/`closeFirst` 7206-7240, `fontsReady`/`relayoutAfterFonts` 530-552 |
| the clock | `setClock` 3482-3502, `setPhase` 3503, `stopPlay` 8781, `togglePlay` 8788, `setSpeed`/`speedNext` 8797-8813, `tickClock` 8814-8820, the dwell `DWELL`/`dwellAdvance` 8829-8875, `clockRate` 5820, `GAIT.seek` 5812, `loop` 9117-9146 |
| phases, ends | `phaseAt`, `clampT`, `PLATEAU_LAST` 3935, `plateauDay`/`plateauFlatFor` 7336-7346, `paintSituation` 7352 |
| seeking | the rail 7526-7542, `jumpEvent`/`eventTimes` 7577-7605, the tour `applyTour` 4671-4692, the opening 4710-4826, the day-track's anchors 2500-2504, themes `setChapter` 4193-4207 |
| selection, focus, Follow | `select` 6252-6264, `pickAt` 6228, `PANEL.opener` 6251, `shown`/`focusTo` 7189-7203, `syncFollow` 6447, `followStep`/`followActive` 8896-8930, `glide` 6309, `centreOnMap`, `drawerKey` 7720, `paintDrawerBody` 7737 |
| panels, resize | `syncInert` 6780, `SHEETS` 6752, `setDSheet`/`setMenu`/`syncPhone` 9018-9060, `syncDock` 8971, `onResize` 7104-7118, `MAPCAM.syncPanels` 4972, `toastRelayout` 8763 |
| the reading | `knowledgeOf` 4134, `knowAtClock` 4288, `drawnKnow`, `aggReading`, `readPos`, `readHidden`/`readUnknown` 4325-4330, `eyesViewshed` 4371 |
| derived readings | `plateauStrength` 4061, `centreSeparation` 4092, `routeDeviation` 2402, `hasLOS` 4120 |
| timers and listeners | every `setTimeout`/`setInterval`/`requestAnimationFrame` and every `addEventListener` with its enclosing function and that function's callers (`tools/audit-post8/state/listeners.js` → `listeners.txt`) |
| shared data, units, determinism | in-place `sort`/`splice`/`reverse` and assignments on the data arrays; `GEOREF` use; `Math.random`, `Date.now`, `performance.now` |

Node property checks (no browser), all in the isolated copy:

| script (`tools/audit-post8/state/`) | output (`docs/audit-post8-evidence/state/`) | what it drives |
|---|---|---|
| `props-helpers.js` | `props-helpers.txt` | the generated helper modules (`_clock.js`, `_derived.js`, `_events.js`, `_state.js`, as `sim-test.js` loads them): continuity at every critical time, a 1/8-minute sweep, the derived readings, the event-jump rule, `confAt`, aggregates |
| `props-bundle.js` (+ `load-bundle.js`) | `props-bundle.txt` | the built `bundle.js` itself in `runtime-test.js`'s own stubbed THREE + DOM (its prelude, read verbatim), driven through the app's functions with a fake clock at 60 frames a second: B1-B14 |
| `props-bundle2.js` | `props-bundle2.txt` | the same: the open dossier against the clock, C1-C4 |
| `props-bundle3.js` | `props-bundle3.txt` | the same: D1 (phases stepped quickly), D2 (a theme chosen while playing, with Follow) |
| `plateau-changes.js`, `late-formations.js` | `plateau-changes.txt`, `late-formations.txt` | two data questions behind latent items |

Commands (from the isolated copy's root):

```
python3 build.py && node tools/mk-world-mod.js && node tools/mk-helpers.js     # md5 f10fe585... reproduced
node /home/user/Austerlitz/tools/audit-post8/state/props-helpers.js $PWD          # 3 s
node /home/user/Austerlitz/tools/audit-post8/state/props-bundle.js  $PWD          # 400-600 s to load the bundle under the machine's load, then ~190 s
node /home/user/Austerlitz/tools/audit-post8/state/props-bundle2.js $PWD
node /home/user/Austerlitz/tools/audit-post8/state/props-bundle3.js $PWD
node /home/user/Austerlitz/tools/audit-post8/state/listeners.js /home/user/Austerlitz/app.js   # read-only, on the repository's file
```

## What holds (measured)

- **Positions** (`props-helpers.txt`): 32 tracked formations, 148 legs; arrivals non-decreasing and every leg's window ordered; at every critical
  time (each anchor's arrival, each leg's departure and arrival, each phase boundary, 04:00 and 18:00) the position at t-eps, t and t+eps
  (eps 1e-6 and 1e-3 min) finite and continuous: 766 checks, 0 discontinuities; a 1/8-minute sweep (215,072 samples): no NaN, none outside the
  680 x 500 map frame (`tools/map-frame.js`); 30 formations on the field at 04:00, 31 at 18:00 (kamensky from phase 2, heightguns from phase 7,
  prz removed). A formation appears 0.001 min before its first phase opens (`notYetAt`'s epsilon) and `legAt` agrees there.
- **Phases**: contiguous, `phaseAt` exact at every boundary +-1e-9.
- **Derived readings**: the plateau holding changes 10 times (Allied) and 11 (French), the centre separation switches twice (on 09:03:07, off
  14:26:07), no flicker (no change undone within 5 minutes). Every change of the Allied holding crosses a rounded thousand, so
  `paintSituation`'s key (`Math.round(onH/1000)`, 7364) never leaves a stale exact figure with today's data (`plateau-changes.txt`; latent only).
- **Grades**: `confAt` gives A, B or C at every quarter minute for every formation on the field (104,251 samples).
- **Event jumps**: the 21 distinct starts each visited once forward from 04:00 and back from 18:00.
- **Play** (B1): at 1/2x, 1x, 2x and 4x the clock never goes back, never NaN, holds 1.500 s at each of the 20 starts after 04:00 (none missed or
  repeated; the 04:00 start does not dwell, as designed), stops at exactly 18:00 with Play off; real time equals `dwellDayLength` within one
  frame (208.02 s against 208.00 at 1/2x); the clock's rate changes by at most 0.033-0.044 of the speed between frames (continuous).
- **A change of speed inside a dwell** (B2, 8H's fix): in the ease in, the hold and the ease out, 1/2x↔4x and 1x↔4x: no jump (the largest step
  after the change is one frame at the faster speed), the hold its full 1.500 s, the rate after the dwell exactly the new speed's.
- **Pause and resume inside a dwell** (B3): paused in the ease in, it eases in again and holds 1.500 s; paused in the hold or the ease out, Play
  goes on at speed (the start it stands on does not dwell: by design).
- **The end of the day** (B7): Play stops at 18:00; Play again starts at 04:00 (phase 0) and plays; within half a minute of 18:00 Play restarts the
  day, outside it plays the remainder.
- **The phone's speed button** (B8) cycles 1/2x, 1x, 2x, 4x, 1/2x. **Seeks** (B12): `GAIT.seek` counts a seek and an event jump, not Play's advance.
- **The opening's stretches** (B13): each arrives exactly at its stop (08:45, 11:00, 14:30) and puts the visitor's speed back; Skip returns to
  04:00 with the opening off.
- **Overlay groups** (B10): at most 2 during 300 random seeks, 1 after the tweens end (no growth).
- **Timers and listeners** (`listeners.txt`): outside the self-test, 8 timers: the fonts' timeout and the boot fade (once), the tip's hide
  (cleared before it is set), the dossier's clear (cleared), the toast's (cleared), its relayout (guarded by `TOAST.raf`), the Menu's focus hand-on
  (0 ms), and the loop (started once, from `init`; `glRestored` does not restart it). Every listener added inside a function that runs more than
  once is on an element that function has just created (`mlItem` only for a new key; the day-track, dossiers and source buttons rebuild their
  elements). No duplicate listener found.
- **Shared data**: no in-place sort, splice, reverse or assignment on `FORMATIONS`, `PHASES`, `EVENTS` or the other data arrays at run time. Three
  caches are written onto data objects (`f._anchors` 3276, the anchors' `_path` 3286, `f._gaitCum` 5830): derived, never invalidated, harmless
  while the data is immutable at run time.
- **Units**: one scale (`KM_PER_MAP=GEOREF.KM_PER_MAP`, 3198; `world.js`'s `UNITS_PER_KM` from `GEOREF`); seconds, milliseconds and clock minutes
  consistent in the dwell, Follow, the tweens, the gait's rate.
- **Determinism**: no `Math.random` in `app.js` or `world.js` outside the self-test; `Date.now` only for the tip's press timing; `performance.now`
  only for presentation (tweens, the map layer's passes, the viewshed's throttle, timings). Positions, grades and derived readings are functions
  of the clock alone, with one exception (finding 5).
- **Edges** (B11): `setClock(±Infinity)` and out-of-day clocks clamp to the day; `setClock(NaN)` would propagate NaN, but no input reaches it
  (the rail's `toClock` is clamped and finite even at zero width; the keys add finite steps; the day-track's anchors carry finite arrivals).

## Findings

1. **A theme chosen while the clock plays does not stop it** (confirmed; S3, P2; inherited). `setChapter` (4193-4207, called by the theme button,
   6944) sets the clock (4204) and glides (4205) but never calls `stopPlay`, unlike the tour (`applyTour` 4674) and the phase and act buttons
   (7487, 7554); app.js's own description of the dwell says "the tour and the themes stop the clock" (8827). B4: playing at 05:00, the theme
   "plan" put the clock at 04:00 and Play went on (04:10 two seconds later). `setChapter` and `glide` set `freeCam=false` (4203, 6311), so once
   the 1.6 s glide ends Follow takes the camera (`followActive`, 8906). D2 (`props-bundle3.txt`), with the frame's own order (tween, tickClock,
   followStep): 1.7 s after the theme was chosen the camera's target is 7 units from the theme's authored target, at 3.7 s 63 units and at 7.7 s
   76 units, the clock at 04:28 and still playing: the theme's view is held only while its glide runs.
2. **The open dossier goes stale while the clock moves within a phase** (confirmed; S2, P2; inherited). `setClock` repaints the dossier within
   a phase only when `drawerKey` changes (3498); the key (7720-7728) holds each formation's text phase, moving or standing, and hidden by the
   reading; for a place under everyone's reading it is "" (7721). Rows that state the clock or "now" are not in it: the card's "Where"
   (`nearestFeature`, 7908), the full dossier's "Position at HH:MM" and "Midpoint at HH:MM" (7909, 7913), the day-track's dot and "the dot where
   it is at HH:MM" (2488, 2498), a place's "Formations nearby now" (8232-8243). C1: Napoleon's headquarters on its 12:00-12:40 leg, the card
   painted at 12:03 ("Zuran mound") is not repainted by 12:37, when the model has it at "Stare Vinohrady", 4.8 km on; the full dossier still says
   "Position at 12:03" (the same for the Guard cavalry, Vandamme, Bagration). C2: a standing formation's dossier says "Position at 04:05" at 04:45.
   C3: under everyone's reading 86 of 240 place-phases end with a "Formations nearby now" list the model no longer has (Pratzen 12:46-14:29 shows
   Napoleon's headquarters, Saint-Hilaire, Drouet and the Guard cavalry; the model has the Guard infantry and cavalry); under Napoleon's
   headquarters 0 (8A's key). C4: 49 aggregate-phases keep a midpoint the model has left. The suite builds dossiers fresh at each clock
   (`runtime-test.js` 1058-1110), so an open dossier's repaint is never tested.
3. **A phase change that interrupts the overlays' fade makes the outgoing phase's arrows pop back to 0.9** (confirmed; S3, P2; inherited).
   `rebuildOverlays` resets `ovFadeIn=0, ovFadeOut=1` (3114) and `applyOverlayOpacity` draws the outgoing group at `0.9*ovFadeOut` (3185),
   whatever opacity it had reached; the fade takes `TRANS_MS` 2,600 ms (3194, 3473-3478). B5: at 4x with the dwell off, 5 of 9 boundaries pop
   (the 08:00 phase's 41 materials from 0.13 to 0.90 as 08:45 begins); with the dwell on, 0 (every phase lasts 3.5 s or more). B13: in the
   opening, Next pressed at once after a step: 1 pop (11:00 to 14:30). D1 (`props-bundle3.txt`), the clock stopped, a phase step (PageDown's
   own call) and another 0.5 s later: the incoming group only starts to fade in at 0.34 x 2.6 s = 0.88 s, so the stepped-through phase's arrows,
   never yet visible (opacity 0.00), are drawn at 0.90 as the next phase begins and fade out over 1.09 s (07:00, 08:00, 08:45 and 09:30 alike):
   stepping through phases quickly by key or button flashes each skipped phase's arrows as it is left.
4. **The first Play frame after the page went idle advances 120 ms of play** (confirmed; S4, P4; inherited). `loop` returns on idle frames before
   `lastFrame=now` (9126-9130), so the next active frame's `dt` is the 120 ms cap: B9, 0.600 clock min at 1/2x (a 60 Hz frame is 0.083), 3.648
   at 4x (0.667). Reached when Play starts on a keydown, before any frame has run: Space with no button focused (the window's "play" row) or
   Enter on the focused Play button; a mouse press (pointerdown) or Space on a button (its click comes on keyup) wakes the loop first.
5. **The reading is cached for the clock's minute at the first instant asked, so it depends on the path** (confirmed; S4, P3; inherited).
   `knowAtClock` (4288) clears `knowledgeOf`'s cache (4133-4152) at each new minute; the cache then keeps the reading computed at whatever clock
   first asked in that minute. B6: the reading at m+0.9 reached through m+0.1 differs from the same clock sought directly in 29
   formation-minutes under Napoleon's headquarters and 38 under the Allied (Liechtenstein's cavalry at 08:07:54: "unknown" one way, "seen" the
   other). A clock paused within such a minute keeps the first reading for as long as it stands. Decision 92 asks for the reading at the clock's
   minute; the self-test reads whole minutes only.
6. **The event jumps' 1.5-minute margin skips a start the clock stands just before** (confirmed; S4, P4; inherited). `jumpEvent` (7596-7605)
   takes the first start more than 1.5 min ahead (and the last more than 1.5 min behind): from one minute before a start, "next event" skips it
   for 20 of the 21 starts (`props-helpers.txt` P4). The slider leaves fractional clocks, and a pause in a dwell's ease in stops the clock less than
   1.25 min (1/2x) before the start.
7. **The time rail's drag has no button test and no cancel** (inferred; S4, P3; inherited). The rail's `pointerdown` seeks with any button,
   `pointermove` seeks while `dragging` without reading `e.buttons`, and only a window `pointerup` clears it (7527-7531): no `pointercancel` or
   `lostpointercapture`. A pointerup that never arrives (a context menu opened by a right press on the rail, a cancelled touch) would leave a
   hover scrubbing the clock. Not reproducible without a real browser.
8. **The low tier is decided once, at start** (confirmed by reading; S4, P4; optional improvement). `lowTier` (621-622: the window's area under
   900 x 700 or a mobile user agent) is never evaluated again; `onResize` (7104-7118) does not, and the near ground's detail is chosen once
   (`groundDetail(!lowTier)`, 661). A desktop page opened in a small window and then enlarged keeps density 1, no shadow map and no near detail
   until reloaded.

Latent, no effect with today's data (not findings): `routeDeviation` (2402) reads `posAtClock`, which has no presence test, so a formation with a
later first anchor would count it before it appears (no plan column names one: `late-formations.txt`); `paintSituation`'s rounded key (above);
`plateauFlatFor` (7342) can return a negative look-back at a fractional clock just after a change (29 such clocks, B14), harmless because only
`flatFor>=60` is used.

## What could not be checked here

- Nothing in a real browser (this phase has none): layout, focus, real pointer and key events, the context-menu case (7), what a visitor sees
  of the pop (3) and of the stale dossier (2); the browser phase's notes are in the structured result.
- The stubbed DOM answers `querySelectorAll` with nothing, so the speed buttons were faked for B8 and no check here reads the DOM's state
  (`inert`, focus); the dossier's staleness was read from what each repaint was built from (`paintDrawerBody` wrapped), not from its HTML.
- Real-time behaviour under a slow frame rate (the stubs run frames as fast as the CPU allows; the fake clock gives each frame 16.7 ms).
- Phone resizing and orientation (`syncPhone`, `PORTRAIT_FIT`, `MAPCAM.syncPanels`) were reviewed by reading only.
