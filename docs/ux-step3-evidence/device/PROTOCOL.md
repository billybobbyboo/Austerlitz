# UI/UX roadmap step 3: the matched hardware runs (pending: the owner's devices)

Two builds, one route, the same devices, the same day. **Nothing in this folder has been run on a device yet**; the draft pull request keeps
physical-device verification pending until the owner's logs are filed here.

## The two builds

| on the page | file | bytes | md5 | SHA-256 |
|---|---|---|---|---|
| **Step 3** (this branch; the default build of `perf-run.html`) | `austerlitz-command-map.html` | see `README.md` section 0 | see `README.md` | see `README.md` |
| **Step 2** (`main` at `9d6b374`, the base) | `docs/ux-step3-evidence/device/builds/austerlitz-07cbcaf3-step2.html` | 3,071,014 | `07cbcaf32808c430198d55b1b7ed78b7` | `06842ca46dfbdaf6c892de2393b83b5e28c6fe211a180c53244688bfbedaf186` |

Every report names the build it measured by its bytes and SHA-256 in its header (`build:`). A report whose hash is neither of these is not
filed as either build's.

## Hosting

The route page reads the build in a same-origin frame, so the pages must be served, not opened from disk.

- **GitHub Pages from this branch** (the simplest for the iPhone): Settings, Pages, "Deploy from a branch", this pull request's branch, root; after
  the runs, set it back to `main`. The pages are then:
  - Step 3: `https://billybobbyboo.github.io/Austerlitz/tools/step6/perf-run.html`
  - Step 2: `https://billybobbyboo.github.io/Austerlitz/tools/step6/perf-run.html?src=../../docs/ux-step3-evidence/device/builds/austerlitz-07cbcaf3-step2.html`
- **Or, on the desktop only, a local server** in a clone of this branch: `python -m http.server 8000`, then the same two paths under
  `http://localhost:8000/`.

## What to run

As before (`docs/final-stage7-evidence/device-protocol.md`): the window maximised at 100% zoom, plugged in, other tabs closed, nothing touched
during a run; on the phone Low Power Mode off, Reduce Motion off, Auto-Lock "Never" for the runs and set back after, held upright.

**The ordinary route** (no `?route=`), each build twice, alternating, about two minutes apart, so that neither the order nor the device's state
is read as the build:

1. Step 2, Start, wait for the report, Copy.
2. Step 3, Start, Copy.
3. Step 2 again.
4. Step 3 again.

**On the RTX 4070 desktop** (Chrome or Edge, as for `desk-S7-*`: 2,560 x 1,440 at 144 Hz, the page about 2,560 x 1,305 at density 1) and **on the
iPhone 17 Pro** (Safari, as for `phone-S7-*`: 402 x 714, drawn at density 1 by the build's low tier). Both builds see the same route, the same
viewport, the same clock and the same settings: the route sets every view's clock, presentation, ground and camera itself, and its two played
segments start each build at 08:30 in Watch from the same view, Follow pressed, then Play at 4x and at half speed for 12 s each.

**What to send back:** the eight reports as pasted text (each begins "Austerlitz step 6 frame-time route"), and anything that happened during a run
(a notification, the screen dimming, a fan). They will be filed verbatim here as `desk-S2-1`, `desk-S3-1`, `desk-S2-2`, `desk-S3-2`, `phone-S2-1`,
and so on, each `.txt` beside its JSON line.

## What will be checked, and against what

1. **The build and the route** (`tools/final-stage7/route-check.js` on each report, unchanged): the header's SHA-256 one of the two above; version
   `step6-perf-route 4`; every segment with frames carrying its intervals, histogram, missed-refresh share and maxima; the two played segments
   `play-4x` and `play-half` present, `follow: true`, their clock covered (`clockFrom` 510, `clockTo` after it). A report missing a segment of the
   ordinary route (idle; overview held, orbit, orbit -figures, orbit -effects; pratzen-low-4x the same four; pratzen-low-1x and -10x held and orbit;
   ph8-overview the four; paper held and pan; eye held and look; play-4x; play-half) is re-run, not read.
2. **What step 3 changes is the played segments.** Every other segment sets its own camera and should measure the same on both builds within the
   run-to-run spread; a difference there is the device's, and says how far the played segments' differences can be read.
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

`tools/step6/perf-local.js` ran the ordinary route on both builds at the desktop's page size and at the phone's (section 6 of `README.md`): every
segment recorded, the builds named by their hashes, and the draw calls and triangles each build draws in the route's own views. Those counts are
the builds' own; whether the device holds them is what the runs above decide.
