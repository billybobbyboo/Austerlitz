# UI/UX roadmap step 3: the matched hardware runs (pending: the owner's devices)

Two builds, one route, the same devices, the same day. **Nothing in this folder has been run on a device yet**; physical-device verification stays
pending until the owner's reports are filed here (by a follow-up pull request, since the runs are made after #113 is merged).

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

## Here, before the devices (software WebGL; its frame times decide nothing)

`tools/step6/perf-local.js` ran the ordinary route on both builds at the desktop's page size and at the phone's (section 6 of `README.md`;
`local/`): every segment recorded, the builds named by their hashes, and the draw calls and triangles each build draws in the route's own views.
Those counts are the builds' own; whether the device holds them is what the runs above decide.
