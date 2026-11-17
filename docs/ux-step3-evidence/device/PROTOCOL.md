# UI/UX roadmap step 3: the matched hardware runs (both devices received)

Two builds, one route, the same devices, the same day. The desktop's four runs and the phone's four are filed here (16 November 2026, "Runs
received" below). The phone's leave one comparison unsettled, half-speed Play; a short re-run that would settle it was offered below ("A targeted
re-run"). The owner chose instead to accept the phone as measured (decision (a), 17 November 2026), so that re-run was not made.

## The two builds

Both are pinned copies in `builds/`, so both links below keep working after `main` moves on (the route page's default build is whatever `main`
holds, so it is not used here).

| build | file | bytes | md5 | SHA-256 |
|---|---|---|---|---|
| **Step 2** (`main` at `9d6b374`, the base) | `builds/austerlitz-07cbcaf3-step2.html` | 3,071,014 | `07cbcaf32808c430198d55b1b7ed78b7` | `06842ca46dfbdaf6c892de2393b83b5e28c6fe211a180c53244688bfbedaf186` |
| **Step 3** (this pull request's build, byte for byte its `austerlitz-command-map.html`) | `builds/austerlitz-fd7b8b72-step3.html` | 3,085,998 | `fd7b8b72c6315d1bb5bf0b8fa45cf263` | `48f5d6314e2b8b336d17d3be6caad94c5c4254471da6095605fd013d644c9b34` |

Every report names the build it measured on its sixth line (`build: <bytes> bytes, sha256 <hash>`). A report whose hash is neither of these is
not filed as either build's. Both links were opened through the route page here before the pull request was finished (a local server, the same
paths; the page loaded each copy and named it by the hash above).

## The steps (the owner's)

**Before you start (once):** merge pull request #113, wait a few minutes for GitHub Pages to publish `main` (the repository's Actions tab shows a
green "pages build and deployment" run), then open the Step 3 link below once. If its panel says "The build did not start within 120 s", Pages has
not published yet: wait a few minutes and reload.

**The two links** (the same on both devices):

- **Step 2:** <https://billybobbyboo.github.io/Austerlitz/tools/step6/perf-run.html?src=../../docs/ux-step3-evidence/device/builds/austerlitz-07cbcaf3-step2.html>
- **Step 3:** <https://billybobbyboo.github.io/Austerlitz/tools/step6/perf-run.html?src=../../docs/ux-step3-evidence/device/builds/austerlitz-fd7b8b72-step3.html>

**One run** (about 3 minutes):

1. Open the link.
2. Wait until the panel says "The build has started ... Press Start".
3. Press **Start (about 3 minutes)**. Do not touch the mouse, keyboard or screen until the panel comes back.
4. Press **Copy the report** (on the iPhone, **Share…** to Notes works too).
5. Paste it somewhere with its name (below). Its first line begins "Austerlitz step 6 frame-time route".

**The order on each device:** four runs, alternating builds, about two minutes apart, so that neither the order nor the device's warming is read as
the build:

| run | link | name it |
|---|---|---|
| 1 | Step 2 | `desk-S2-1` (`phone-S2-1`) |
| 2 | Step 3 | `desk-S3-1` (`phone-S3-1`) |
| 3 | Step 2 | `desk-S2-2` (`phone-S2-2`) |
| 4 | Step 3 | `desk-S3-2` (`phone-S3-2`) |

**The desktop** (the RTX 4070, Chrome, as for `desk-S7-*` on 13 November 2026): plugged in, the 2,560 x 1,440 monitor at 144 Hz, other tabs and
heavy programs closed, the window maximised, zoom 100% (Ctrl+0).

**The iPhone** (the iPhone 17 Pro, Safari, as for `phone-S7-*`): charging, Low Power Mode off, Settings → Accessibility → Motion → Reduce Motion
off, Settings → Display & Brightness → Auto-Lock → Never (set it back after the runs), other Safari tabs closed, held upright and untouched while
it runs.

**Send back:** the eight reports (pasted, or as text files named as above), and anything that happened during a run (a notification, the screen
dimming, a fan, a run restarted). They are filed verbatim here as `desk-S2-1.txt` and so on, each beside its JSON line.

## What will be checked, and against what

1. **The build and the route** (`tools/final-stage7/route-check.js` on each report, unchanged): the header's SHA-256 one of the two above; version
   `step6-perf-route 4`; every segment with frames carrying its intervals, histogram, missed-refresh share and maxima; the two played segments
   `play-4x` and `play-half` present, `follow: true`, their clock covered (`clockFrom` 510, `clockTo` after it). A report missing a segment of the
   ordinary route (idle; overview held, orbit, orbit -figures, orbit -effects; pratzen-low-4x the same four; pratzen-low-1x and -10x held and orbit;
   ph8-overview the four; paper held and pan; eye held and look; play-4x; play-half) is re-run, not read.
2. **What step 3 changes is the played segments.** Both builds see the same route, the same viewport, the same clock and the same settings: the route
   sets every view's clock, presentation, ground and camera itself, and its two played segments start each build at 08:30 in Watch from the same
   view, Follow pressed, then Play at 4x and at half speed for 12 s each. Every other segment sets its own camera and should measure the same on both
   builds within the run-to-run spread; a difference there is the device's, and says how far the played segments' differences can be read.
3. **Per segment, Step 3 against Step 2 on the same device and day:** the median and 95th-percentile frame interval, frames a second, the
   long-frame share (frames over max(1.5 refreshes, 25 ms)), the missed-refresh share (`missedPct`), the script's median (`js50`), and the median and
   largest draw calls and triangles (`calls`, `callsMax`, `tris`, `trisMax`).
4. **The rules already stated** (`docs/STAGE8_SPEC.md` sections 8.3 and 8.5, unchanged): the desktop's frame at most 2.8 million triangles and 900
   draw calls; the phone's heavy views at most 1.62 million triangles; section 8.5's rule (no heavy segment's long-frame share rising above 5% where
   it was under, no median moving by more than one refresh), read Step 3 against Step 2 of the same session; and the CPU line (`js50` not above the
   reference's by more than 1 ms).
5. **Against the Stage 7 evidence** (`docs/final-stage7-evidence/device/desk-S7-*`, `phone-S7-*`, 13 November 2026, the same desktop and phone on
   Stage 7's build): for the record, not as the comparison: Stage 7 to Step 2 is steps 1 and 2's work, which no device has measured.

## Runs received

- **16 November 2026, the owner's desktop** (the RTX 4070 of Stage 7's `desk-S7-*`; Chrome 157, 2,560 x 1,440 at 144 Hz, the page 2,560 x 1,305 at
  density 1): the ordinary route four times, Step 2, Step 3, Step 2, Step 3, 08:51 to 09:04 UTC (`desk-S2-1`, `desk-S3-1`, `desk-S2-2`, `desk-S3-2`,
  each `.txt` beside its `.json`; `README.md` in this folder). Each report is the route's own `format()` of its JSON, names the pinned copy its name
  says by bytes and SHA-256, holds the whole ordinary route with both played segments under Follow from 08:30, and passes `route-check.js`. Read by
  `tools/ux-step3/device-runs.js` (`reading.txt`, `reading.json`): section 8.3's budget within on every run (Step 3's heaviest frame 829 calls and
  2,300,331 triangles; Step 2's 843 and 2,317,629); section 8.5's rule holds in every segment, each Step 3 run against each Step 2 run (every median
  6.9 ms, every long-frame share 0%); the CPU line holds (the largest `js50` excess +0.1 ms). The played segments at the refresh on both builds
  (143.8-144 frames a second, at most two missed refreshes a segment on either); every other segment draws the same frames on both builds.
- **16 November 2026, the owner's iPhone 17 Pro** (Safari 26.6.1 on iOS 18.7, 402 x 714 at density 3, drawn at 1, `lowTier`): the ordinary route four
  times in the same order, 23:23 to 23:34 UTC, 29-34 s apart (`phone-S2-1`, `phone-S3-1`, `phone-S2-2`, `phone-S3-2`; `README.md`). Each report
  verbatim, its build the pinned copy its label names, the route whole, `route-check.js` passing. Read by `device-runs.js`: section 8.3's phone
  budget within on both builds (Step 3's heaviest frame 1,311,877 triangles; its segment medians of calls at most 6.0% above Step 2's, half-speed
  Play 481 to 510); section 8.5's rule fails in three segments of Step 3's runs: the ph8 overview's orbit and its orbit with effects off, where both
  builds draw the same frames and Step 3's numbers sit inside what Stage 7's runs of the same phone measured there; and half-speed Play, 0% and
  11.7% long on Step 3 against 1.1% and 1.1% on Step 2, the two Step 3 runs drawing identical frames, the second in the run where the phone was
  slowest in the segments both builds draw alike. Not settled by two runs a build.

## A targeted re-run (offered; not chosen: the owner accepted the phone as measured, 17 November 2026)

Kept as written, for a later step that wants to settle half-speed Play on the phone.

To settle half-speed Play on the phone, the two segments step 3 changes and the ph8 overview's orbits, nothing else (about a minute a run, the
route's own `?only=`):

- **Step 3:** <https://billybobbyboo.github.io/Austerlitz/tools/step6/perf-run.html?src=../../docs/ux-step3-evidence/device/builds/austerlitz-fd7b8b72-step3.html&only=ph8-overview,play-4x,play-half>
- **Step 2:** <https://billybobbyboo.github.io/Austerlitz/tools/step6/perf-run.html?src=../../docs/ux-step3-evidence/device/builds/austerlitz-07cbcaf3-step2.html&only=ph8-overview,play-4x,play-half>

1. Set the iPhone up as before (charging, Low Power Mode off, Reduce Motion off, Auto-Lock Never, other tabs closed), then lock it and leave it
   five minutes.
2. Six runs, starting with **Step 3** this time (the reverse of the first set, so that the order is not read as the build): Step 3, Step 2, Step 3,
   Step 2, Step 3, Step 2. **Lock the phone and wait three minutes between runs.**
3. Each run: open the link, wait for "Press Start", press Start, hold the phone still until the panel returns, then Copy the report (or Share it to
   Notes) and label it ("Step 3 short run 1", and so on).
4. Send the six reports. Set Auto-Lock back afterwards.

**How they will be read, stated before the runs**: each Step 3 run against the Step 2 run after it (three pairs). Step 3's half-speed Play counts as
**costing the phone** if, in at least two of the three pairs, its long-frame share is above 5% where its pair's is under; as **not costing it** if,
in at least two of the three pairs, its long-frame share is at most its pair's plus one point; otherwise it stays unsettled and is accepted as
measured. The ph8 overview's orbits (the same frames on both builds) are read only as the phone's state in each run. The reader is
`tools/ux-step3/device-runs.js`, extended then for the short route's three segments.

Checked here before it was offered (`tools/step6/perf-local.js --way frame --src <the Step 3 copy> --only ph8-overview,play-4x,play-half`, the
phone's page size, software WebGL): the wrapper page with `&only=` runs exactly the ph8 overview's four segments, play-4x and play-half, on the pinned
Step 3 copy, its report naming it by 3,085,998 bytes and `48f5d631...`; its frame counts there mean nothing.

## Here, before the devices (software WebGL; its frame times decide nothing)

`tools/step6/perf-local.js` ran the ordinary route on both builds at the desktop's page size and at the phone's (section 6 of `README.md`;
`local/`): every segment recorded, the builds named by their hashes, and the draw calls and triangles each build draws in the route's own views.
Those counts are the builds' own; whether the device holds them is what the runs above decide.
