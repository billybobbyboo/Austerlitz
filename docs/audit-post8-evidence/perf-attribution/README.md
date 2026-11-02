# Final audit after Stage 8: perf-attribution

Where the main thread's script time goes, on the audited build (`f10fe585...`, 2,810,630 B) against step 6's L3 build (`c9d29c14...`,
2,218,404 B: `git show a8afeec:austerlitz-command-map.html | md5sum` gives `c9d29c149b613bff059598e4fe8c8d03`, verified here) and 8E's build
(`d73d0115...`, 2,537,677 B), on the device route's own motions. Purpose: attribute decision 268 (a)'s accepted desktop excess
(`docs/STAGE8_SPEC.md:5558-5563`: Play at half speed `js50` 6.1 to 7.6 ms, +1.5; the Overview's orbit 4.8 to 5.8/5.9 ms, +1.0/+1.1), which
section 24.1 says "these runs cannot say which part of Stage 8 added". Nothing here changes the application, its data, tests or build.

## How (the scripts, all in `tools/audit-post8/perf-attribution/`)

- `pa-lib.js` (header lines 1-21): a visitor's page (no `?harness=1`), the first-run card closed by a real Escape; the start-up timed by an
  init script (pa-lib.js:42-52: `firstFrame` the first animation frame after `AUS_BOOT.done`; `bootGone` the boot overlay removed with the
  document parsed and `camera` defined; long tasks; `lastLongEnd` the main thread quiet). After the first drawn frame the WebGL context's
  draw and clear calls (`drawElements`, `drawArrays`, both instanced forms, `drawRangeElements`, `clear`, `blitFramebuffer`) are no-ops
  for the page's life, so three.js's whole render path and every other GL call run while SwiftShader rasterises nothing (without this a
  frame took 4-5 s of raster and GL calls blocked on it: pilots). Each motion from the device route's own set-up
  (`tools/step6/perf-route.js`), run by the motion driver (`tools/visual/motion.js` inPage: the app's `loop()` one frame at a time on the
  driver's clock, 1000/144 ms a frame), `loop()` timed, its named steps wrapped, the style/layout flush and a GL round trip outside the
  timed span; the renderer main thread's CPU and wait from `/proc/<pid>/schedstat`; optionally a CDP Profiler profile at 200 us over the
  same frames, aggregated by self time per function and per subsystem (`analyse.js`).
- `measure.js`: per page, start-up, then per motion a timing pass and a profile pass. Pages in the order L3, now, now, L3 (rounds 1, 2),
  each on a fresh browser; frames per pass as the device route's segments less its 0.5 s warm-up: Play 1,656, orbits 792, held 504, warm-up 72.
- `paired.js`: one page per build kept open, motions run in palindrome order (L3, 8E, now, now, 8E, L3), the idle pages held by the driver;
  552 / 264 / 168 frames a block; then one count block per build and motion (every GL call by method and the listed app functions per frame,
  144 frames: load-independent).
- `analyse.js` -> `summary.md`, `pages/summary.json`; `analyse-paired.js` -> `paired.md`.

Commands (as run, recorded in `logs/run-main.log`, `logs/run-paired.log`; `<S>` = the scratchpad's `perf-attribution/`):
`node tools/audit-post8/perf-attribution/measure.js docs/audit-post8-evidence/perf-attribution/pages <S>/raw L3=<S>/build-c9d29c14.html now=<S>/build-f10fe585.html`
(two rounds, the second in reverse order), `node tools/audit-post8/perf-attribution/analyse.js ...` (summary.md),
`node tools/audit-post8/perf-attribution/paired.js docs/audit-post8-evidence/perf-attribution/paired.json <S>/raw-paired L3=... 8E=<S>/build-d73d0115.html now=...`,
`node tools/audit-post8/perf-attribution/analyse-paired.js docs/audit-post8-evidence/perf-attribution/paired.json L3 > paired.md`.
Environment: Chromium 141.0.7390.37 (both builds, every page), SwiftShader, viewport 2560 x 1305 (the device page), density 1, effects on,
shadow on, factor 4, culling on (`setup` in `pages/page-*.json`). Load average 30-38 during `measure.js` (11:02-11:29) and 43 falling to 12
during `paired.js` (11:29-11:45), on 4 cores shared with other audit agents.

Motions (the device route's): **play-half** Play at half speed under Follow from 08:30, Watch, the Field vantage (perf-route.js:263-265; the
clock covered 513.1-550.6, i.e. 08:33-09:10, the device's 08:30-09:11 segment; the brief said "from 09:00, the phase's view": the device
segment was chosen so that the comparison is decision 268's own); **overview-route** the Overview, 09:30, Watch, orbit by the route's camera
writes (perf-route.js:166-170, decision 268's orbit segment); **overview-drag** the same orbit by a right-button drag through the app's own
handler; **ph8-drag** phase 8, 14:40, the Overview, right-drag; **overview-held** the Overview held and drawn every frame.

## Results

### Script CPU per frame (renderer main thread, schedstat, unprofiled; ms; container numbers, not device numbers)

| motion | session 1 (`summary.md`) L3 -> now | session 2 (`paired.md`) L3 / 8E / now | now vs L3, adjacent blocks (range) | device (sect. 24.1) |
|---|---|---|---|---|
| play-half | 19.06 -> 23.28 (+22%) | 19.55 / 23.88 / 24.03 | **+22.9%** (+22.8, +22.9); 8E +22.1% | 6.1 -> 7.6 (+25%) |
| overview-route | 15.60 -> 20.12 (+29%) | 15.71 / 19.70 / 20.90 | +33.3% (+25.3, +41.2); 8E +25.5% | 4.8 -> 5.8/5.9 (+21/23%) |
| overview-drag | 15.91 -> 18.37 (+15%) | 17.34 / 20.10 / 21.52 | +24.4% (+20.3, +28.4); 8E +16.4% | (same segment) |
| ph8-drag | 17.29 -> 18.62 (+8%) | 17.66 / 21.60 / 20.43 | +16.4% (+7.0, +25.8); 8E +23.4% | +0.4 to +0.6 ms |
| overview-held | 14.04 -> 15.34 (+9%) | 14.37 / 16.77 / 16.99 | +18.1% (+5.9, +30.4); 8E +16.8% | +0.8 to +1.1 ms (09:30 Overview segments) |

Play's rise is reproduced tightly (+22-23% in both sessions, the adjacent pairs within 0.1 point), on ONE browser for both builds, at the
ratio the desktop measured (+25%): the Chrome 155 -> 156 update is not needed to explain it. The orbit and held motions rise +8% to +33%
with wide spreads under the load: direction certain, size inconclusive. 8E already carries the rise in every motion; 8E -> now lies within
the spread (-5% to +7%) and the GL counts move +1% to +2%: the step lies between L3 and 8E (8A-8E; decision 236's `c4793156` changes only
`lowTier`, off here and on the desktop). 8D's build was not measured.

### Load-independent counts per frame (`paired.md`, count blocks, 144 frames)

| | L3 | 8E | now |
|---|---|---|---|
| GL calls, play-half / overview-route | 10,327 / 10,290 | 13,227 / 13,358 | 13,502 / 13,526 |
| draw calls, play-half / overview-route | 791 / 832 | 789 / 830 | 802 / 839 |
| vertexAttribPointer, play-half / route | 3,493 / 3,668 | 4,750 / 5,009 | 4,846 / 5,068 |
| bindBuffer, play-half / route | 2,099 / 2,001 | 3,369 / 3,348 | 3,429 / 3,386 |
| useProgram, play-half / route | 283 / 294 | 491 / 514 | 501 / 520 |
| groundY, play-half / route | 7,066 / 444 | 11,908 / 1,999 | 11,658 / 2,059 |
| worldPerPx, play-half / route | 96 / 59 | 252 / 214 | 252 / 214 |
| cullTest + cullStale, play-half | 0 | 1,094 | 1,102 |
| mlFree, play-half (8C replaced most of it) | 475 | 60 | 60 |

+30% GL calls at equal draw calls. The +1,341 to +1,400 `vertexAttribPointer` and `bindBuffer` a frame (every motion) match three r128
re-setting every vertex attribute of an `InstancedMesh` at every draw (`node_modules/three/build/three.js:10682-10691`:
`if (object.isInstancedMesh === true) updateBuffers = true;` then `setupVertexAttributes`) after Stage 8 gave every kit mesh three more
attributes: `aPart` (8D, `4cb72b1`; app.js:1108, 12866) and `aPh`, `aSl` (8E, `62f5cd2`; `kitWrap`, app.js:1243-1249). Three attributes
times about 450 instanced kit draws a frame (shadow and main passes) is about 1,350 (inference from the counts and code; no build with the
attributes removed was measured). `useProgram` +220 a frame arrives in the same span (more programs interleaved; cause not isolated).

### Profiles: where the growth goes (`summary.md`; profiled ms a frame, median of 2 rounds; profiled ms are about 1.6x the unprofiled CPU)

| motion | profiled total L3 -> now | three.js JS + WebGL native | Stage 8's app work (render path/gdepth, map layer, culling, outlines, ground queries, updateVisibility, arrows, confidence, gait, kitLod) | panels/free rectangle |
|---|---|---|---|---|
| play-half | 28.31 -> 38.01 (+9.69) | +5.54 (57% of the rise) | about +3.1 (32%): render path +0.69, map layer +0.51, culling +0.47, outlines +0.36, updateVisibility +0.33, ground +0.23, confidence +0.18, arrows +0.17, gait +0.08, kitLod +0.04 | +0.68 |
| overview-drag | 24.89 -> 33.64 (+8.74) | +6.06 (69%) | about +1.7 (20%) | +0.76 |
| overview-route | 31.55 -> 35.87 (+4.32) | +4.56 (all of it) | about +1.4 | -1.77 |

Within three.js the grown functions are its attribute set-up and state: `setup` 0.68 -> 1.17, `bindBuffer` 0.68 -> 1.25, `vertexAttribPointer`
0.75 -> 1.22, `bindVertexArray` 0.40 -> 0.59, `renderBufferDirect` 0.90 -> 1.11, `updateMatrixWorld` 0.55 -> 0.75 (play-half, ms a frame);
`getProgramCacheKey` is flat (2.28 -> 2.23). The shares of three.js (JS) in a build's profile are 49.6% -> 48.1% (play-half), 54.8% ->
54.8% (drag): the renderer's work grew with the frame rather than as a new block. The map layer's own step (`mlLayout`) moved +0.1 to +0.3 ms
in this container (section 8.3's map-layer line: within). The gait (0.08-0.16 ms profiled) and kitLod (0.03-0.04) are negligible, as
section 24.1's bracket found on the desktop. On the Overview culling costs 0.10-0.19 ms profiled and saves no draw (everything in view: 832
-> 837-839 calls), consistent with the device's saving only in the low views.

**Inherited, the largest app function in every profile, both builds:** `freeRect` (app.js:4925-4943), 3.8-6.5 ms profiled self a frame now
(2.5-8.0 in L3, where a function named `viewport` takes another 2.5-4.4 ms in the drag motions, plausibly the same work under inlining;
unverified): 12.8-17.7% of the profiled script now, 15.7-25.3% in L3. `landFreeRect` (app.js:6359) is called 3 times a frame
(`paired.md`): `shadowReceivers` (app.js:321), `placeLights`' SHADOW_FIT key (app.js:347), `smokePlace` (app.js:6075). Each call scans an
8 px grid of the whole viewport (320 x 163 = 52,160 cells at 2560 x 1305) against every panel and allocates one small array per cell
(`S.push([s0,hh])`), although its inputs (the viewport and the panels) do not change in Play or an orbit.

### Start-up (ms from navigation; software WebGL: shader compilation and raster dominate; not device numbers)

| | round 1 L3 / now | round 2 now / L3 | paired session (serial) L3 / 8E / now |
|---|---|---|---|
| first frame after AUS_BOOT ok | 21,586 / 21,060 | 23,046 / 20,241 | 29,705 / 31,830 / 22,280 |
| boot overlay gone (interactive) | 91,770 / 91,583 | 69,209 / 67,519 | 120,861 / 112,448 / 94,945 |
| main thread quiet | 92,655 / 94,347 | 74,726 / 68,331 | 121,540 / 124,801 / 100,527 |

Within a round the builds are equal to 2.5% (-0.2% and +2.5% overlay gone); across rounds the load moves them by 25%. No start-up
difference is detectable at this resolution; the longest task is 55-56 s on both (`summary.md`). `BOOTMS.init` (8H's own timer) 14,867 ms.

## Caveats

- Software WebGL (SwiftShader) with the native draws stubbed: GPU-side time is absent; the GL client calls (command encoding on the
  renderer thread) are real, but their per-call cost on the desktop's Chrome/ANGLE/driver differs. Ratios here are not device numbers;
  this container is about 3.2x slower than the desktop on the same frames (19.55 against 6.1 ms in Play).
- Contention: 4 cores shared, load 30-43; schedstat CPU (not wall time) is the measure, palindrome order cancels a linear drift, counts
  are load-independent. Two rounds per build per session, two sessions. Play's comparison is conclusive; the orbit and held sizes are not.
- The CPU profile's self time moves between a function and what is inlined into it; profiled time is inflated by the profiler.
- The desktop's L3 run also used Chrome 155 against 156 (`docs/audit-post8-evidence/perf/README.md:95-98`); here one browser for both.

## Not checked

8D's build (`ae7f16b8`), so 8D's and 8E's shares are separated only by code reading; a build with the kit attributes removed or packed; the
low views and Play at 4x (+0.9-1.0 ms on the desktop); the phone; GPU time; garbage collection per frame; why three r128 recomputes
`getProgramCacheKey` (2.1-2.8 ms profiled self a frame, both builds) every frame.

## Evidence index

- `summary.md`, `pages/summary.json`, `pages/page-{1,2}-{L3,now}.json`: session 1 (start-up, timing and profile passes, named steps,
  subsystems, top functions).
- `paired.json`, `paired.md`: session 2 (L3, 8E, now; palindrome blocks; counts per frame by GL method and app function).
- `raw/` (frames, profiles, boot profiles, gzipped), `raw-paired/`, `logs/run-main.log`, `logs/run-paired.log`.
- `result.json`: the structured result.
