# UI/UX roadmap step 3: the owner's device runs of the two builds

The owner's reports, pasted from `tools/step6/perf-run.html` on GitHub Pages (`main` after #113's merge, the two pinned copies in `builds/` named by
`?src=`) and kept verbatim; nothing here was measured in this container. Each `.txt` is the report as pasted (the owner's own words around it removed:
"First desktop step 2 report:", "First desktop step 3 run:", "Second desktop step 2 run:", "Second desktop step 3 run:"); each `.json` is that
report's `AUS_PERF_JSON` line, parsed and indented. Each `.txt` is, character for character, the route's own `format()` of its `.json`, and each `.json`
passes `tools/final-stage7/route-check.js`. `tools/ux-step3/device-runs.js` reads them by the rules `PROTOCOL.md` stated before the runs: its output is
`reading.txt` and `reading.json`.

| file | run | build measured | started (UTC) | fetched |
|---|---|---|---|---|
| `desk-S2-1.txt`, `.json` | the desktop, run 1 | Step 2: 3,071,014 bytes, SHA-256 `06842ca4...f186` (`builds/austerlitz-07cbcaf3-step2.html`) | 2026-11-16 08:51:50 | 1,300,599 bytes |
| `desk-S3-1.txt`, `.json` | the desktop, run 2 | Step 3: 3,085,998 bytes, SHA-256 `48f5d631...9b34` (`builds/austerlitz-fd7b8b72-step3.html`) | 2026-11-16 08:55:40 | 1,306,181 bytes |
| `desk-S2-2.txt`, `.json` | the desktop, run 3 | Step 2, the same | 2026-11-16 08:58:45 | from the cache |
| `desk-S3-2.txt`, `.json` | the desktop, run 4 | Step 3, the same | 2026-11-16 09:01:39 | from the cache |

**The desktop**: the same machine as Stage 7's `desk-S7-*`, step 6's L3 and Stage 8's D1 and D2: Chrome 157 on Windows (the user agent's; Stage 7's
runs were Chrome 156), NVIDIA GeForce RTX 4070 (ANGLE, Direct3D 11), 32 cores, 32 GB, 2,560 x 1,440 at 144 Hz (refresh 6.9 ms at the start and the end
of every run), the page 2,560 x 1,305 at density 1, effects on at scale 1.3, not `lowTier`, in the wrapper page; the wake lock held. The runs alternate
Step 2, Step 3, Step 2, Step 3, each about 2.5 minutes, with 77 s, 33 s and 22 s between them (the protocol asked for about two minutes). Outside
the played segments no measured interval of any run exceeds 7.6 ms; each played segment has at most two intervals of 13.8-14 ms (one refresh missed),
1, 2 or none on both builds alike (Step 2: 2 and 1, then 1 and 0; Step 3: 1 and 1, then 2 and 0), so nothing here reads as the device warming.

**The phone**: not yet run (`phone-S2-*`, `phone-S3-*` to come).

## What they say (`reading.txt`)

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
