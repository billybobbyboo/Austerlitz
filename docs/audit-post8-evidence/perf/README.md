# Area perf: the device evidence reconciled (post-Stage-8 final audit)

No browser, no device and no build were used. Everything here reads the committed reports and the route's code; nothing in the
application, its data, thresholds, tests, archive or build was touched.

## What was examined

- The ten Stage 8 device reports, `docs/stage8-evidence/device/` (`desk-D1`, `desk-D2`, `desk-fx`, `desk-cull`, `desk-gait`, `phone-R1`,
  `phone-R2`, `phone-fx`, `phone-cull`, `phone-gait`; each `.txt` as pasted and `.json` its `AUS_PERF_JSON` line) and their README.
- The earlier device runs, `docs/step6-evidence/perf-L1/L2/L3-desktop.*`, `perf-P1/P2/P3/P4/P5/P5a/P5b-iphone.*`.
- The route: `tools/step6/perf-route.js` (ordinary route, phone route, the three brackets), `tools/step6/perf-run.html`,
  `tools/step6/phone-rule.js`, and the route's git history (which code measured which run).
- The records: `docs/STAGE8_SPEC.md` sections 8.3, 8.5, 20.12, 21.9, 22.5, 24, 25; `docs/STEP6_SPEC.md` sections 2-3, 11-16;
  `CHANGELOG.md` (the two device entries); `docs/ROADMAP.md` (the device paragraph).
- The census: `docs/stage8-evidence/8l/census/census-8l.json` and `8k/census/census-8i/8j/8k.json`.
- The app code the controls act on: `app.js:602` (`pxRatio`), `:621-625` (`lowTier`, `shadowMap.enabled`), `:646` (`sun.castShadow=!lowTier`),
  `:1849-1853` (the gait's vertex hook, branch on `uAnimAmp>0.0`), `:5812-5878` (`GAIT`, `gaitStep`).

## What was run

```
node tools/audit-post8/perf/reconcile.js          # writes reconcile.json, reconcile.md, rows.csv here (console: reconcile-console.txt)
node tools/audit-post8/perf/ledger.js             # writes ledger.json here (from reconcile.json plus the census and record claims)
bash tools/audit-post8/perf/route-history.sh      # writes route-history.txt here (git only)
node tools/step6/phone-rule.js docs/stage8-evidence/device/phone-R1.json docs/stage8-evidence/device/phone-R2.json   # run by reconcile.js; reads only
```

`reconcile.js` loads `tools/step6/perf-route.js` unchanged and uses its own `format()` (to regenerate each report's whole text from its JSON) and
`bracketVerdict()` (to recompute the bracket verdicts), then checks every row and every numeric claim of sections 24-25.

## Results

### 1. Identity, settings, visible-page status

- **All ten reports name the audited build**: 2,810,630 bytes, SHA-256 `bf27887c...db07` (= `c2adefe` and the working tree, md5 `f10fe585`;
  `route-history.txt`). The historical builds are confirmed by hash against git: L3 `a8afeec` (md5 `c9d29c14`, 2,218,404 B), P3/P4 `f8d0949`
  (`fffc4fda`), P5 `b04e150` (`c4793156`, which is **Stage 8's own starting build**).
- Desktop (all five): Chrome 156 / Windows, RTX 4070 (ANGLE D3D11), 32 cores, 32 GB, screen 2560x1440, page 2560x1305, density 1, effects on at
  1.3, not `lowTier`, shadow map on, reduced motion off, GPU timer offered, in the wrapper frame; R 6.9 ms, long > 25 ms. Phone (all five):
  Safari 26.6.1 (UA "iPhone OS 18_7"), "Apple GPU", viewport 402x714, dpr 3 drawn at 1, `lowTier`, effects on at 1.0, no GPU timer, in the
  frame; R 17 ms, long > 25.5 ms. The model ("iPhone 17 Pro") is the owner's word; the report cannot show it.
- **Per-block switches** (284 blocks): every phone-route block's `set` and every bracket block's `setOn` is the one its candidate asks for.
  The ordinary route (D1/D2) records neither culling nor the gait per segment (defaults assumed; culling on is inferable from the low views'
  592-600 calls = the cull bracket's A side). Effects are recorded once (`device.fx`) and per bracket block only.
- **Visibility**: the route does record it: `device.visibility` once (perf-route.js:204), a note if hidden at the start (:226), a per-segment
  `hidden` flag set at the sample's start or by any `visibilitychange` during it (:144-153), printed as a NOTE (:355) and treated as missing by
  the bracket rule (:335) and as "does not stand" by `phone-rule.js`. **All 349 rows: hidden false; no report carries a note.** Not recorded:
  throttling after the start (only a 30 Hz idle refresh is flagged, :232), the refresh after the start, thermal state, battery or charging,
  whether the wake lock was granted (perf-run.html:55 requests it, records nothing), and when within a segment a stall happened (only `max`
  and the first 0.5 s's `warm`). The owner's words around each paste were removed, so any event the owner reported is not in the record.

### 2. Every row re-derived from the JSON

- Row counts: desktop 23+23+30+59+30 = **165**, phone 47+47+30+30+30 = **184**, **349** in all, as claimed.
- **Each `.txt` is reproduced byte for byte by the route's own `format()` from its `.json`** (all ten; the JSON line in each `.txt` equals the
  `.json`). The records' "checked by script" is thereby verified; the original checking script was not committed (`route-history.txt`).
- What can be recomputed was: `longPct = r1(100*long/frames)` matches in 349 of 349; percentiles are ordered in every row; the long count is
  consistent with the percentiles under the route's nearest-rank rule in every row; the span each fps implies (frames/fps) exceeds the
  sampling window (secs - 0.5 s) by 0.045-0.202 s in every row, as the route's timeout (+100 ms) and timer latency predict; `drawn = frames`
  in every row but the ten idle rows (the app drew every counted animation frame, the route's premise).
- **Not recomputable**: fps, the percentiles, `max` and the long count themselves. The JSON keeps each segment's summary only
  (perf-route.js:160-171), not its intervals, so no independent recomputation from raw frame times is possible; only consistency.
- The bracket verdicts recompute identically (desktop fx, cull 4x, cull 10.33x, gait: 0/0/12; phone fx 4/0/8, cull 7/0/5, gait 0/0/12, all
  "not shown"). Section 14.1's rule on R1/R2 (`phone-rule.js`): both stand, both test both kinds, no cure, **rule 4**; the reference cures Play
  in both runs (gain 1.353) and not the Overview (1.375, 1.431).

### 3. The route's definitions, exactly (tools/step6/perf-route.js)

- **Interval**: the difference of consecutive `requestAnimationFrame` timestamps of the route's own chain on the build's window (:133-143), one
  chain per segment. **Counted**: intervals at t >= 0.5 s from the segment's first frame (`SECS.warm`, :46, :161); the first 0.5 s gives only
  `warm`, its longest interval.
- **R** (refresh): the Overview applied, 0.8 s, the app's loop paused (:115), 1.5 s, a 3 s sample; R = the nearest-rank median of *all* its
  intervals (:228-230); under 20 intervals, 16.7 ms is assumed with a note (:231). Measured **once per run**.
- **Long frame**: an interval `> max(1.5*R, 25)` ms (:157-159, strict): relative to the measured refresh with a **fixed 25 ms floor**. Desktop
  R 6.94 -> **25 ms (the floor, 3.6 refreshes)**; phone R 17 (Safari's whole milliseconds) -> **25.5 ms (1.5 refreshes)**.
  `longPct = r1(100*long/frames)` (:163, :167): **per interval, per segment, as a share of delivered frames**.
- **fps** = `frames / (sum(dt)/1000)` = 1000/mean interval (:164-165). **p50/p95** = `pct(dt,q)` = `sorted[min(n-1, floor(q*(n-1)+0.5))]`
  (:86): nearest rank, no interpolation (for even n the upper middle value), rounded to 0.1 ms.
- `js50/js95`: nearest-rank percentiles of `loop()`'s wall time on drawn frames (:115) - the app's JavaScript including three.js's render
  submission and anything blocking inside it. `calls/tris`: **the median** drawn frame's `renderer.info` (:170), **not a maximum**.
  `gpu50/95`: a TIME_ELAPSED query round `renderFrame()` where offered (desktop; Safari offers none).

**Why a long-frame share is not a dropped-frame percentage.** (1) Its unit is a delivered frame, not a refresh or time: a 329 ms stall counts
once though it spans about 20 refreshes at 60 Hz, and the denominator shrinks as frames are lost. (2) Its threshold is not "one missed refresh": at
144 Hz the 25 ms floor is 3.6 refreshes, so intervals of 2-3 refreshes (13.9, 20.8 ms) never count - desktop Play reads 0% long while 13.7-16.5%
of the 144 Hz refreshes bring no new frame (1 - fps x R); on the phone, intervals between 17 and 25.5 ms never count. (3) The phone's
intervals are not 60 Hz-quantized when it is slow (p50 23-24 ms, p95 26-27, max 27-31), so the 25.5 ms threshold cuts the tail of one
distribution: the 24 Play A blocks run at **42.8-43.8 fps** (+-1%) while their long share ranges **5.3-14.2%**. "8.6% long" there sits beside
**28% of 60 Hz refreshes without a new frame** and a median interval (23 ms) above one refresh: more than half the frames missed 16.7 ms. The
Overview's "18.1%" sits beside 32%. (4) It excludes each segment's first 0.5 s (on the desktop up to 76.5 ms there).

### 4. The known results

- **Desktop Play**: D1 124.3 (4x) / 120.8 (half), D2 123.0 / 120.2 against L3 139.0 / 139.7 (and L1 138.9 / 139.3, L2 139.6 / 141.2):
  -10.6% to -14.0%. **Like for like**: the ordinary route's measurement code is identical between L3's run (`a8afeec`, route at `bb6bbb4`) and
  D1/D2's (`route-history.txt`); the played segments covered the same clock (08:30 to about 10:22 at 4x, to 09:11 at half speed); the same GPU,
  screen, page, density, effects scale and wrapper. **Not like for like**: the browser (L3 **Chrome 155**, D1/D2 **Chrome 156**, not stated in
  section 24), the build (L3's is step 6 item 3 Part B, `c9d29c14`, not Stage 8's starting `c4793156`, as section 24 says), ten days apart.
  `js50` in Play 6.0-6.1 -> 6.9-7.6 ms, at or above the 6.94 ms frame: frames start doubling (p90 13.9). Segment by segment `js50` rose +0.8 to
  +1.1 ms in the 09:30 Overview, +0.4 to +0.6 in phase 8's, +0.9 to +1.5 in Play, +0.5 to +0.6 in the 4x views with the figures hidden, -0.2 to
  +0.2 in the culled low views (culling saves about 0.9 ms there, its bracket) and +0.1 to +0.3 in the light views (1x, the eye, the paper map):
  consistent with per-frame work added in the 4x landscape (inference); a browser update between the runs cannot be excluded by these data.
- **Phone medians** - over exactly: the **24 A blocks per kind** (R1 and R2, 2 rounds x 6 As each; candidates and the 45 s warm-up excluded), each
  block's own fps (its 5.5 s after 0.5 s), standard median (mean of the 12th and 13th): **Overview 40.8** (nearest-rank 40.9; pooled frames/time
  39.4), **Play 43.35** (printed 43.3; nearest-rank 43.4; pooled 43.3). Long shares over the same blocks: **18.15%** (printed 18.1; nearest-rank
  19.6) and **8.6%**. 24 of 24 As over 5% in both kinds.

### 5. Historical comparisons and the "warming" claims

- **L3**: see above (browser change unrecorded).
- **P5** is Stage 8's starting build on the same phone and settings, by the ordinary route (12 s of Play from 08:30 to 09:10.6, the run's last
  segment, about 2 min into a 2.5 min run begun 2.5 min after P5b), so different route, session and clock window (the phone route records no clock for its played blocks). Its
  Play at half speed 53 fps (p50 17, 1.6% long) against this build's 43.35 (p50 23): -18%, ten times the A blocks' within-session spread, at
  similar counts (508 vs 517 calls; 1.46 vs 1.36 M triangles); the Overview's orbit 47 -> 40.8 (-13%). The desktop shows the same direction.
  But P5 is one session, and on the earlier build the same phone's Play at half speed varied from 27.6 to 40.2 fps across four sessions (P1, P2,
  P5a, P5b, density 1.5 with shadows): the P5 reading indicates a slowdown across Stage 8; it does not establish it.
- **P3/P4** (same phone route, the build before decision 236): their As ran at medians of 21.0 (Overview) and 27.1 fps (Play), every one 100%
  long (a far slower state of the phone or drawing), and their `density1Pass` blocks approximate the built configuration (the stale shadow map
  still sampled). The Overview's 29.4 -> 40.8 (+39%) cannot come from culling (everything is in view there: 532 vs about 525 calls) nor from 11%
  fewer triangles alone: device state dominates this reading. Decision 269 (a) recorded both readings without taking either as the verdict; on
  the evidence they are not equally strong.
- **Thermal and "warming" claims without temperature or throttling evidence**: STAGE8_SPEC.md:5609 ("the phone's own state as it warms",
  marked inference), :5657 and :5672 (decision 269 (a)'s text, "after warming"), :5679 ("after the phone warms"), :1263 ("the phone's heating");
  CHANGELOG.md:11 and :25 ("After the phone warms", as fact); ROADMAP.md:575. No report records temperature or throttling (a page cannot read
  them). **The data do not show a warming trend**: Play's 24 A blocks hold 42.8-43.8 fps in both runs (R1's Play blocks about 07:54-07:57, R2's
  about 08:04-08:06, from the reports' start and finish times and the blocks' lengths); Play's faster warm-up (45.2/45.7) drew lighter content
  (median 428 calls and 1.20 M triangles against the As' 517 and 1.36 M: 45 s of Play from 08:30 against 6 s blocks from 08:30); the Overview's
  warm-up (49.5/49.9, the same counts) is one continuous 45 s orbit of 2.5 turns, each block the first 120 degrees after the view is applied
  again; and the Overview's slowest blocks (27.2-32.0 fps) coincide with `js50` trebling (17-18 ms against 6-7) and recover within one or two
  6 s blocks: transient events, not a monotonic warming. Whether the phone throttled is unknown.

### 6. Controls: no-ops and effective interventions

- Phone route on this build: `figShadow`, `shadowPass`, `density1`, `density1Pass` are **no-ops** (`lowTier`: `pxRatio()` 1, app.js:602; the sun casts
  no shadow, app.js:646, so no shadow map is drawn whatever `shadowMap.autoUpdate` or a mesh's `castShadow` say; `density1` sets 1 on a buffer at
  1). Their calls and triangles equal the As'. The report's `set` column reads the flags, not their effect ("shadow pass off", "figures casting
  0/342"), so it looks like an intervention where none happens; section 25 says so correctly. **Effective**: `figures` (Overview 532 -> 231 calls,
  1.31 -> 0.68 M triangles; Play 517 -> 229, 1.36 -> 0.74 M; `js50` 6-8 -> 4-6).
- Brackets: **culling** effective (phone 211 vs 446-448 calls, -35% triangles; desktop -24%/-15% at 4x); **effects** effective (the render path
  switched; 4-9 calls fewer on the phone, 5-10 on the desktop); **gait**: block B sets every amplitude to 0 (`GAIT.KMH=1e9`) but keeps `gaitStep`'s per-frame checks and the vertex
  hook (its branch not taken, its attributes still read): it isolates the marginal cost of a non-zero amplitude, not the animation system. On the
  desktop every block's median interval is the vsync's 7.0 ms and `js50` differs by <= 0.1-0.2 ms (median 7.2 both); on the phone 43.05 vs 43.3
  fps, p50 23 everywhere. **Inconclusive at the route's resolution, not zero cost.**
- **Figures hidden** removes the figures' draw calls (-56%), triangles (-45%), script and animation at once: it bounds their total cost (phone
  Play 43 -> 59 fps) and does not show which resource (submission, vertices, fragments, animation) the frame waits on; in the Overview the frame
  still drops without them (47.4-54.4 fps, up to 11.1% long).

### 7. The census

- Sections 21.9 and 22.5's maxima equal `census-8l.json` (identical case for case to `census-8k.json`): desktop complete frame 864 calls
  (plans-overview), 2,151,193 triangles (narrow-1024); still eye 862 / 2,004,105; phone 1,288,561 (phone-390-first), still 1,141,473; headroom
  36 calls (4%), 648,807 (23.2%), phone 331,439 (20.5%). The 8I and 8J rows equal `census-8i/8j.json`. The culling figure "1,798,057 of 2,188,177"
  (22.5): the first number is in the census; **2,188,177 is in no committed evidence file** (unverified).
- The route's frames reconcile with the census where the views coincide (the Overview: held = still eye within 0.14%, moving = complete within
  0.12%; the low views 2.5-4.3% more at the wider 2,560 x 1,305 page). But **the census's maxima are not the heaviest frames the build draws**:
  the route drew more at the median in Play (desktop 2,289,649; phone 1,364,249) and in phase 8's Overview on the phone (1,309,505), views the
  census does not hold. Headroom at those medians: 18.2% and 15.8% (the per-frame maximum is recorded nowhere).

### 8. What would resolve the consequential uncertainties (none a prerequisite)

1. **An integrated-GPU laptop** (the machine section 8.3's condition and decision 138 name): the ordinary route twice. Play is script-bound on the
   RTX desktop (`js50` 7.6 ms at the median, 8.4-9.0 at the 95th percentile); on a CPU half as fast its 95th percentile would approach the
   16.7 ms of a 60 Hz frame (inference).
2. **A CPU profile of Play** (Chrome's Performance panel, Play at half speed, L3's build and this one on one browser version): attributes the
   +1.0-1.5 ms and removes the Chrome 155/156 confound (decision 268 (a)'s accepted excess, attributed rather than re-decided).
3. **The phone**: the ordinary route twice would make section 8.5's rule evaluable (decision 269 (b), declined: listed, not asked); a Safari
   Web Inspector Timelines session from a Mac would split the 23 ms Play frame between script, layout/compositing and GPU; a continuous 5-minute
   Play run in 10 s summaries from a rested, unplugged phone would test the "warming" hypothesis.
4. **The route** (for any future run): keep a 1 ms histogram of intervals and the per-frame maximum calls/triangles in the JSON; record the
   played blocks' clock windows, `FX.on`, `CULL.on` and `sun.castShadow` per block, the wake lock's result and the refresh again at the end; report
   the missed-refresh share (1 - fps x R) and the share above R beside `longPct`.

## Findings (detail in the structured result)

1. S3 - the long-frame share, the device acceptance metric (sections 8.5, 14.1), is not a dropped-frame measure and is unstable at the phone's operating point; the
   records' "8.6%/18.1% long" understate how many frames missed the refresh (28%/32% of refreshes without a new frame).
2. S3 - "after the phone warms" is stated without evidence and is contradicted for Play by the flat 24 A blocks; the warm-up contrasts are
   confounded by content and view.
3. S3 - the desktop before/after spans Chrome 155 -> 156 (unrecorded); the accepted CPU excess cannot be attributed to Stage 8 alone.
4. S3 - "the heaviest frame" figures are segment medians; the census maxima are below what the route drew in Play and phase 8's Overview.
5. S3 (accepted, decision 269 (a)) - on the evidence the P5 reading (Stage 8's own starting build: Play 53 -> 43 fps, one session) is the
   stronger of the two; the P3/P4 proxy reading is dominated by device state. Not re-litigated: recorded for the final audit's weighing.
6. S4 - over-readings: "the figures ... are what a phone's frame waits on"; "the gait adds none".
7. S4 - small record inaccuracies: the largest 4x call rise is +1.4% (not +0.8%); "nine frames over 25 ms in all" excludes each segment's first
   0.5 s (76.5 ms there); the phone's "heaviest frame" comes from a gait-at-rest block; rounding (43.35 -> 43.3, 18.15 -> 18.1, 59.9 -> 60).
8. S4 - instrument limits (no raw intervals, medians for counts, flags not effects, no clock for the phone's played blocks, one refresh
   measure, the checking script not committed).
9. S4 - a 329 ms frame in the phone's first effects-off block (counted, unexplained, not in section 25.2).
10. Accepted compromises recorded: the integrated GPU unmeasured (decisions 235, 250 (b); untested), the per-PR before/after replaced by one
    end-of-stage run (section 20.12's 8G/8H pair not run), section 8.5's rule weak at both refresh rates (decision 250 (b)).

## Not checked, and why

- Any measurement on a device or in a browser (this phase has none); GPU times on the phone (Safari has no timer query).
- The raw frame intervals behind any percentile, fps or long count: not kept by the route.
- Temperature, throttling, background load, charging, the wake lock: not recorded by the route and not readable by a page.
- What the owner observed during the runs: removed from the pasted reports.
- Chrome 155 vs 156 differences; the GPU driver version (not in the reports).
- The 2,188,177-triangle culling figure of section 22.5 (no committed evidence file holds it).
- Whether the phone's 23 ms frame is GPU-, compositor- or script-bound (no timer; `js50` 7-8 ms is a minority of it).

## Files

- `README.md` (this file); `reconcile.md` (the generated report: identity, timeline, text checks, row checks, the claims ledger, the long frames,
  L3 against D1/D2 segment by segment, the phone's blocks in order, the earlier phone runs, the census against the route, the rule's output);
  `reconcile.json` (every result); `rows.csv` (all 349 rows with their checks); `route-history.txt` (code and build identities from git);
  `reconcile-console.txt` (the run's console); `ledger.json` (51 numeric claims checked: 41 verified, 10 partly, 0 contradicted).
- Scripts: `tools/audit-post8/perf/reconcile.js`, `tools/audit-post8/perf/route-history.sh`, `tools/audit-post8/perf/ledger.js`.
