# UI/UX roadmap step 3: the owner's device runs of the two builds

The owner's reports, pasted from `tools/step6/perf-run.html` on GitHub Pages (`main` after #113's merge, the two pinned copies in `builds/` named by
`?src=`) and kept verbatim; nothing here was measured in this container. Each `.txt` is the report as pasted (the owner's own words around it removed:
"First desktop step 2 report:", "First desktop step 3 run:", "Second desktop step 2 run:", "Second desktop step 3 run:"; for the phone four labels
before the four reports, "Phone step 2 run 1:", "Phone step 3 run 1:", "Phone step 2 run 2:", "Phone step 3 run 2:"); each `.json` is that
report's `AUS_PERF_JSON` line, parsed and indented. Each `.txt` is, character for character, the route's own `format()` of its `.json`, and each `.json`
passes `tools/final-stage7/route-check.js`. `tools/ux-step3/device-runs.js` reads them by the rules `PROTOCOL.md` stated before the runs: its output is
`reading.txt` and `reading.json`.

| file | run | build measured | started (UTC) | fetched |
|---|---|---|---|---|
| `desk-S2-1.txt`, `.json` | the desktop, run 1 | Step 2: 3,071,014 bytes, SHA-256 `06842ca4...f186` (`builds/austerlitz-07cbcaf3-step2.html`) | 2026-11-16 08:51:50 | 1,300,599 bytes |
| `desk-S3-1.txt`, `.json` | the desktop, run 2 | Step 3: 3,085,998 bytes, SHA-256 `48f5d631...9b34` (`builds/austerlitz-fd7b8b72-step3.html`) | 2026-11-16 08:55:40 | 1,306,181 bytes |
| `desk-S2-2.txt`, `.json` | the desktop, run 3 | Step 2, the same | 2026-11-16 08:58:45 | from the cache |
| `desk-S3-2.txt`, `.json` | the desktop, run 4 | Step 3, the same | 2026-11-16 09:01:39 | from the cache |
| `phone-S2-1.txt`, `.json` | the iPhone, run 1 | Step 2, the same | 2026-11-16 23:23:11 | 1,301,319 bytes |
| `phone-S3-1.txt`, `.json` | the iPhone, run 2 | Step 3, the same | 2026-11-16 23:26:12 | 1,306,901 bytes |
| `phone-S2-2.txt`, `.json` | the iPhone, run 3 | Step 2, the same | 2026-11-16 23:29:18 | from the cache |
| `phone-S3-2.txt`, `.json` | the iPhone, run 4 | Step 3, the same | 2026-11-16 23:32:21 | from the cache |

**The desktop**: the same machine as Stage 7's `desk-S7-*`, step 6's L3 and Stage 8's D1 and D2: Chrome 157 on Windows (the user agent's; Stage 7's
runs were Chrome 156), NVIDIA GeForce RTX 4070 (ANGLE, Direct3D 11), 32 cores, 32 GB, 2,560 x 1,440 at 144 Hz (refresh 6.9 ms at the start and the end
of every run), the page 2,560 x 1,305 at density 1, effects on at scale 1.3, not `lowTier`, in the wrapper page; the wake lock held. The runs alternate
Step 2, Step 3, Step 2, Step 3, each about 2.5 minutes, with 77 s, 33 s and 22 s between them (the protocol asked for about two minutes). Outside
the played segments no measured interval of any run exceeds 7.6 ms; each played segment has at most two intervals of 13.8-14 ms (one refresh missed),
1, 2 or none on both builds alike (Step 2: 2 and 1, then 1 and 0; Step 3: 1 and 1, then 2 and 0), so nothing here reads as the device warming.

**The phone**: the owner's iPhone 17 Pro of Stage 7's `phone-S7-*` and step 6's P1-P5, iOS 18.7 and Safari 26.6.1 by the user agent (as on 13
November), the viewport 402 x 714 at density 3, drawn at density 1 (`lowTier`, no shadow), effects on, in the wrapper page; the refresh 17 ms at the
start and the end of every run; the wake lock held; no GPU timer (Safari offers none). The owner's message labelled the four reports in order (Step 2
run 1, Step 3 run 1, Step 2 run 2, Step 3 run 2) and each names that build by its hash. The runs were 29-34 s apart, not the two minutes asked. Run 1's
header gives `bodyBytes` 4,119,590, Safari's `decodedBodySize` of the frame's first load and neither build's size (Stage 7's `phone-S7-1` gave
4,086,424 for a 3,037,848-byte build); the build is named by the hash of the bytes the route fetched, which is the Step 2 copy's.

## What the desktop's runs say (`reading.txt`)

- **Section 8.3's budget**: within on every run. The heaviest frame of Step 3 draws **829 calls and 2,300,331 triangles** (play-4x); Step 2's 843 and
  2,317,629, the same frame as Stage 7's `desk-S7-*` (843; 2,317,629 and 2,317,741). Limits 900 and 2.8 million.
- **Section 8.5's rule** (each Step 3 run against each Step 2 run, every segment): **holds**. Every median interval 6.9 ms on both builds, the
  long-frame share 0% in every segment of every run.
- **The CPU line** (`js50` not above Step 2's by more than 1 ms): **holds**; the largest excess +0.1 ms (overview, orbit with effects off). In the
  played segments Step 3's `js50` is 4.3/4.3 ms at 4x (Step 2 4.3/4.3) and 4.9/4.9 at half speed (5.0/5.0).
- **The played segments** (Play under Follow from 08:30 in Watch, 12 s at 4x and 12 s at half speed; the segments step 3 changes): at the refresh on
  both builds, 143.8-144 frames a second, the missed-refresh share 0-0.1% (at most two missed refreshes in a segment, on both builds; Stage 7's
  0.1-0.2%).
  Step 3's closer view draws calls median 794 at 4x (Step 2 823) and 781 at half speed (789); triangles at most 2,300,331 (2,317,629) and 2,289,379
  (2,273,009, +0.7%); the GPU timer's median 2.8/3.0 ms at 4x (2.8/2.7) and 4.0/4.0 at half speed (3.9/3.9), inside the timer's own spread between
  one build's two runs in the held views (up to 3.3 ms: overview held 3.2/6.5 on Step 2).
- **Every other segment** sets its own camera and draws the same frames on both builds: calls, triangles and their maxima identical run for run, the
  medians identical, `js50` within 0.2 ms. The two builds differ only where step 3 changed them.
- **Warm-up**: the second run of each build, loaded from the cache, has one long interval in the overview's warm-up (Step 2 20.8 ms, Step 3 48.7 ms),
  before the segment's measured frames (the route discards its warm-up; `warm` in the table); every run's play-4x warm-up has one of 13.9-14 ms.

**Verdict for the desktop**: Step 3 holds section 8.3's budget and CPU line and section 8.5's rule against Step 2 on the same machine and morning; no
difference between the builds shows at 144 Hz. What this desktop cannot show: whether a slower GPU would feel the played segments' +0.7% triangles at
half speed or the GPU timer's +0.1 ms; the phone's runs and an integrated GPU are the remaining evidence.

## What the phone's runs say (`reading.txt`)

| | Step 2 (runs 1 and 3) | Step 3 (runs 2 and 4) | rule |
|---|---|---|---|
| heaviest frame (any segment) | 1,394,981 triangles (play-half); 542 calls | **1,311,877 triangles** (overview orbit, as on Step 2); 550 calls (play-half) | section 8.3: at most 1.62 million triangles: **within** |
| segment medians of calls against Step 2's | | at most +6.0% (play-half 481 to 510) | section 8.3: at most +10%: **within** |
| play-4x: fps, long-frame share, `js50` | 60/60, 0%/0%, 5/5 ms | 60/59.7, 0%/0.3%, 5/6 ms | |
| play-4x: calls median (max), triangles max | 430 (525), 1,367,081 | 425 (539), 1,301,681 | |
| play-half: fps, long-frame share, `js50` | 53.4/53.7, 1.1%/1.1%, 6/6 ms | **60/50.8, 0%/11.7%**, 6/7 ms | section 8.5: fails in run 4 |
| play-half: calls median (max), triangles max | 481 (528), 1,394,981 | 510 (550), 1,308,005 | |

**Section 8.5's rule** (each Step 3 run against each Step 2 run) **fails in three segments**, all in Step 3's runs:

1. **ph8-overview, orbit with effects off**: 0.3% and 0% long on Step 2, 42.9% and 76% on Step 3. **Both builds draw the same frames there** (calls
   517 in every run; the route sets the camera). On Stage 7's runs of the same phone the same segment ran at 30-34 frames a second with 80-89% long
   (P5's 100%): Step 3's numbers are inside that history, Step 2's today are its best.
2. **ph8-overview, orbit**: 0% and 0% on Step 2, 0% and 23.7% on Step 3 (50.9 and 45 frames a second against 60 and 60). **The same frames on both
   builds** (calls 524). Stage 7's runs: 47-48 frames a second, 8.9% and 15.6% long (decision 324 (a) accepted them as measured); P5's 2.7%.
3. **play-half** (Play under Follow at half speed from 08:30 in Watch, 12 s): 1.1% and 1.1% on Step 2, **0% and 11.7%** on Step 3. Here the builds
   draw different frames (Follow's closer view). Step 2's frames slow at the same moment in every run on this phone, today's and Stage 7's (which
   draw them: calls 481): 6.4-6.7 s into the 12 s (about 08:50 on the clock), to 47.3-48.5 frames a second in the segment's second half. Step 3's
   two runs draw identical frames to each other (calls 510 in both), and one never slows (60 frames a second, 0% long, better than any Step 2 or
   Stage 7 run), the other slows from 6.3 s to 44.5 frames a second with 23.1% long in its second half (worse than any).

**The phone's own state** moved between runs more than the builds did. In the segments that draw the same frames on both builds, the runs had 2, 3,
1 and 5 segments under 59 frames a second (in the order run: Step 2, Step 3, Step 2, Step 3); the last run, Step 3's second, was the slowest in
every sense (overview, orbit with effects off, 38.6; the low Pratzen view with effects off, 46.6; the ph8 overview's three orbits 45, 47.4 and 37.1),
and it is the run whose half-speed Play failed. Overview's orbit with effects off ran at 38.6-38.7 frames a second in three of today's four runs, on
both builds, where it held 60 on 13 November and in P5: today's session as a whole sat lower than Stage 7's.

**Verdict for the phone**: section 8.3's budget holds on both builds (Step 3's heaviest frame 1,311,877 triangles; its half-speed Play 6.0% more
calls and 6.2% fewer triangles at most than Step 2's). Section 8.5's rule fails in three segments of Step 3's runs: two of them draw the same frames
on both builds, so the phone's run-to-run spread, not the build, is what they measure; the third, half-speed Play, is the one where the build can
matter, and its two Step 3 runs are this phone's best and worst on record for the segment. Two runs a build cannot tell Step 3's half-speed Play
from the phone's spread. Put to the owner (`../README.md` section 10): accept as measured, or settle it with a short targeted re-run
(`PROTOCOL.md`, "A targeted re-run").

