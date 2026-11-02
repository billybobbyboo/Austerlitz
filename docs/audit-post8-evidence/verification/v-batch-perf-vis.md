# Verifier v-batch-perf-vis: performance and visibility findings (minor and polish)

Build audited: `austerlitz-command-map.html`, md5 `f10fe585...` (the md5 in every raw visibility run read here; the device reports name
SHA-256 `bf27887c...db07`, the same build).

**Method.** I ran no browser. For each finding I read the code cited, at HEAD. I re-read the evidence with two scripts of my own, written
without the area's analysers:
- `tools/audit-post8/verification/v-batch-perf-vis/vis-check.py` re-analyses the visibility area's raw driver runs
  (`docs/audit-post8-evidence/visibility/runs/raw-*.json`, all 21). It writes per-formation shares, hidden episodes, the fresh layout's
  share and the state at rest. Output: `docs/audit-post8-evidence/verification/v-batch-perf-vis/vis-check-out.json`.
- `tools/audit-post8/verification/v-batch-perf-vis/perf-check.py` re-reads every device report's segments and adds the missed-refresh share
  1 - fps x R. Output: `.../v-batch-perf-vis/perf-check-out.txt`.

Commands:
- `python3 tools/audit-post8/verification/v-batch-perf-vis/vis-check.py <runs...>`
- `python3 tools/audit-post8/verification/v-batch-perf-vis/perf-check.py <report.json...>`

**Summary.** Of the 15 findings, 13 are CONFIRMED and 2 WEAKENED (visibility #3 and #4). Two CONFIRMED findings carry corrections: perf #2
has one evidence number off, and visibility #2's scope is wider than stated.

## perf #0: the long-frame share is not a dropped-frame measure. CONFIRMED
- The definition is at `tools/step6/perf-route.js:157-170`: a frame is long when its interval exceeds max(1.5 R, 25 ms), counted over the rows
  after the first 0.5 s.
- Phone, R1 and R2: the 24 Play A blocks run at 42.8-43.8 fps with p50 23 ms (one block 22). Their long share ranges 5.3-14.2% at that
  constant rate (R2 "A 1" 5.3% at 43.5 fps; R1 "A 1" 14.2% at 42.8 fps).
- Missed refreshes (1 - fps/60): Play 27.8%, Overview 32%.
- Desktop, D1 and D2: Play runs at 120.2-124.3 fps with 0% long, yet 13.7-16.5% of the 144 Hz refreshes bring no new frame.
- Note: `docs/STAGE8_SPEC.md:1259` does state the threshold, max(1.5 R, 25 ms). `docs/STEP6_SPEC.md:179` and the comment at
  `perf-route.js:157` call a long frame "a missed refresh" and leave out the floor. That is wrong at 144 Hz, where 25 ms is 3.6 refreshes.
- S3/P3 and the inherited origin are agreed.

## perf #1: "after the phone warms" is asserted without evidence. CONFIRMED
- Play is flat: every A block runs at 42.8-43.8 fps in both runs.
- The faster warm-up drew different content. In the phone route, `KINDS.played.start` applies t 510 at every block, so the 45 s warm-up
  plays on to lighter content: a median 428 calls and 1,203,643 triangles, against 517 calls and about 1,364,000 triangles in the As.
- The Overview's warm-up is one continuous `sample(PHONE.warm, MOVE.orbit())`. Each block instead applies the view again and restarts the
  orbit.
- The wording "after warming" or "after the phone warms" appears unmarked at `docs/STAGE8_SPEC.md:5657, 5672, 5679`, `CHANGELOG.md:11, 25`
  and `docs/ROADMAP.md:575`. At 5609 it is marked as inference.
- No report carries temperature or throttling data.

## perf #2: the browser update, Chrome 155 to 156. CONFIRMED (one evidence number corrected)
- The user agents: L3 reports `Chrome/155.0.0.0`; D1 and D2 report `Chrome/156.0.0.0`.
- Section 24 (`docs/STAGE8_SPEC.md:5527`) says "the same desktop as step 6's L1-L3: Chrome 156" and nowhere records L3's 155.
- The js50 rises are as stated (Overview orbit 4.8 to 5.8/5.9; Play at half speed 6.1 to 7.6), with the light views +0.1 to +0.3.
- Correction: with the figures hidden, js50 rose +0.5/+0.6 at the Overview and the low Pratzen view at 4x, but only +0.1/+0.2 at phase 8's
  Overview (3.4 to 3.5/3.6). The range should read +0.1 to +0.6.

## perf #3: "heaviest frame" figures are segment medians. CONFIRMED
- `perf-route.js:170` records calls and triangles as `pct(...,0.5)`, the median.
- The census (`docs/stage8-evidence/8l/census/census-8l.json`, `after.maxima`) gives the desktop's complete-frame maximum as 2,151,193
  triangles (23.2% headroom) and the phone's as 1,288,561 (20.5%).
- The route's medians are higher:
  - desktop Play at 4x: 2,289,649 triangles, so 18.2% headroom;
  - phone Play: up to 1,364,249 in the build's own blocks, so 15.8%;
  - phone, phase 8's Overview: 1,309,505.

## perf #4: the two phone readings are not equally strong. CONFIRMED
- P5's build is 2,220,714 bytes, which is md5 c4793156, Stage 8's starting build. P5's Play at half speed: 53 fps, 508 calls, 1,464,345
  triangles. This build's As: 43.35 fps at the median.
- **New, independent support for the proxy point:**
  - P5's phase-8 Overview orbit drew 525 calls and 1,469,185 triangles at 47.0 fps.
  - P3 and P4's `density1Pass` Overview blocks drew 525 calls and 1,469,185-1,469,257 triangles at 25.5-33.6 fps.
  - The same drawing therefore ran at 54-72% of P5's frame rate. The proxy measures the phone's or the route's state, not the drawing.
- Accepted under decision 269 (a). The slowdown itself remains an inference from one session.

## perf #5: no integrated-GPU run. CONFIRMED
- I listed `glRenderer` in every report:
  - `desk-*` and perf-L1 to L3: RTX 4070;
  - `phone-*` and P1 to P5b: Apple GPU;
  - `perf-local-*`: SwiftShader.
- No integrated-GPU report exists.
- Category untested; origin accepted-compromise (decision 235). Section 8.3's integrated-GPU condition (`docs/STAGE8_SPEC.md:1236`) was not
  triggered: the largest 4x rise is +1.4% in calls.

## perf #6: over-readings in the records. CONFIRMED (S4/P4)
- `figuresHidden` sets `material.visible=false` on every kit mesh. That removes draw calls, vertex work and render-list work together:
  - phone Play: 517 to 229 calls, 1.36 to 0.74 M triangles, js50 7-8 to 5-6 ms, 43 to 58.5-59.6 fps;
  - phone Overview: 47.4-54.4 fps, still up to 11.1% long.
- Desktop gait bracket: js50 7.2-7.4 ms with the gait (A) and 7.2-7.3 at rest (B); gpu50 4.5-4.6 on both sides.
- Section 24.1's own bullet already says the gait's cost is "not measurable"; "the gait adds none" (`docs/STAGE8_SPEC.md:5562`) is the CPU
  line's shorthand.

## perf #7: small numeric and wording inaccuracies. CONFIRMED
1. The largest rise in calls is +1.36% (phase 8's Overview orbit, 809 to 820) and +1.39% (Play at half speed, 794 to 805), not +0.8%.
2. Nine long frames are counted, the longest 41.6 ms. The uncounted first 0.5 s of four segments holds longer frames: 34.9, 76.5, 34.7 and
   41.7 ms.
3. The phone's 1,364,901 triangles is the median of `phone-gait` "gait B BA 1.0", an at-rest block. The build's own maximum is 1,364,249.
4. This item is rounding at the row's precision, not an error.
5. Neither device commit (`b2e7149`, `e29be9a`) adds a file under `tools/`.

## perf #8: instrument limits of the route. CONFIRMED
- `summarise` keeps statistics only, and calls and triangles are medians.
- `drawing()` reads `SM.autoUpdate`, not `sun.castShadow`.
- The phone and bracket blocks carry no `clockFrom` or `clockTo`.
- Not checked by me: the once-only refresh measurement and the wake-lock result.

## perf #9: a 329 ms frame in the phone's first effects-off block. CONFIRMED
- `phone-fx.json`, block "fx B AB 1.1": 318 frames, 56.7 fps, max 329 ms, warmMax 24 ms. Later B blocks have maxima of 17-36 ms.
- `bracketRoute` sets the block, waits 300 ms, then samples, and `summarise` drops the first 0.5 s. The stall therefore fell at least 0.8 s
  after the toggle.
- It is absent from section 25.2. Its cause is unverified.

## perf #10: section 8.5's rule is weak. CONFIRMED (accepted under decisions 250 (b), 268 (a) and 269 (a))
- Desktop: Play fell from 139.0/139.7 to 120.2-124.3 fps, yet the rule holds (medians 6.9 to 7.0 ms; long frames at most 0.2%).
- Phone, across routes: Play's p50 rose 17 to 23 ms (+35%), yet the median clause holds, because the rise is under one 17 ms refresh.

## visibility #2: no check can see long gaps. CONFIRMED (wider scope)
- `tools/visual/thresholds.js` VIS `hybrid-play` [2033, 3388, 4033]:
  - 3388 = 28 x 121 formation-frames;
  - 4033 ms = 121 frames, the whole window (90 motion frames, 30 rest frames from `motion.js` `rest:30`, and 1).
- In `raw-bench-hybrid.json`, Nansouty, Walther and Miloradovich are hidden in 90 of 90 play frames and at rest.
- **Also saturated:** `hybrid-glide` 2,533 ms = 76 frames (45 + 30 + 1) and `hybrid-orbit+sel` 3,033 ms = 91 frames (60 + 30 + 1). Three
  "longest" baselines cannot fail.
- The self-test's day check (`app.js:10045`) samples `mlLayout` every ten clock minutes and judges only the largest `ML.stats.dropped` (at most
  19).

## visibility #3: the phone with counters. WEAKENED
- Reproduced exactly:
  - 7,046 of 13,635 formation-frames drawn (51.7%); a fresh layout draws 60.1%;
  - Liechtenstein (`lich`) drawn in 0 of 1,365 frames, its longest gap 752 frames = 25,067 ms (09:00-10:30);
  - the phone's default Landscape draws 79.6%.
- **Correction:** Liechtenstein's fresh-layout share is 0.15% (2 of 1,365). A fresh layout of the same frames also never draws it, so its
  absence is crowding under the priority rule at the phone's framing, not Stage 8's stabiliser. The stabiliser's own share of the loss is 8.4
  points (60.1% to 51.7%).
- Origin: mixed. The crowding is inherited (not traced build by build); the 8.4-point loss is a new regression from 8C.
- The run is a desktop context at 390 x 844. It still gets the phone layout, because `PHONE_Q` tests width and height only (`app.js:9017`).
- S3/P3 kept.

## visibility #4: at rest after Play the kept places leave formations hidden. WEAKENED (S4/P4)
- The code works as described:
  - the persist strategy runs while `MLS.fromMotion` is set, and that flag stays set until a discontinuity (`app.js:5374-5389`);
  - the kept places come first and "nothing drawn moves to make room" (`app.js:5485-5489`).
- `persistOnly` reproduces in every run. The finding's "0-1 in the others" omits `hybrid-sel-0900`'s three: Suchet, the French Guard infantry
  and Miloradovich.
- **Correction:** the comparison is two-sided. In seven runs the fresh view hides formations that the kept places draw. Net (hidden at rest
  minus hidden in a fresh view):

  | net | runs |
  |---|---|
  | +3 | `fr-0900` |
  | +2 | `fixed-0830` |
  | +1 | `bench`, `0830`, `phone`, `al` |
  | 0 | four runs |
  | -1 | `1200`, `4x-day`, `sel-0900`, `157` |

- This is decision 240 (a)'s explicit no-reshuffle trade.

## visibility #5: the Landscape's names blink during Play. CONFIRMED
- `land-0900` reproduces exactly:
  - 34,330 of 38,417 name-frames drawn (89.4%); a fresh layout draws 99.9%;
  - 4,087 hidden name-frames in 230 episodes over 26 names in 50.3 s, one per name every 5.7 s;
  - mean episode 592 ms; 98.9% of hidden frames had room.
- Worst gaps: 1,667 ms in `land-0900`; 2,533 ms (Miloradovich) in `land-4x-day`.
- The cause is the two-pass re-admission: `MLS.EVERY` 333 ms and `PASSES` 2 (`app.js:5339, 5477-5482`).
- The decision that covers the two-pass rule is 240 (a); 267 (a) covers the benchmark's totals.
- The 50.3 s is the driver's 30 fps clock including the dwells (`MIN_PER_SEC` 10, `app.js:3197`), not a device timing.

## Not done
- No browser run.
- visibility #3: the crowding's origin is not traced across the archive builds, and no real phone context (density 3, touch) was run.
- perf #8: the refresh re-measure and the wake lock were not checked.
- perf #1: the block clock times were not checked.
