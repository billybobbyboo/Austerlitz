# The final audits' Stage 7: the device runs the records lack (WP-12; decision 278)

Two measurements the records lack, prepared for the owner's runs. Decision 278 (a): at the owner's convenience. Decision 278 (b): until they
are run, their absence stands as a limit, and no device result is filled in. The route was checked end to end in this container on software WebGL;
its times there decide nothing (`wp12/route-local-*.json`). The runs the owner has made are in "Runs received" below; nothing else here has been run on
a device.

1. **An integrated-GPU desktop** (`CL-PERF-02`). Section 8.3 of `docs/STAGE8_SPEC.md` and decision 138 name this machine, and no run of one exists.
2. **The phone, by the ordinary route, on Stage 7's build** (`CL-PERF-06`; decision 269's option (b)). Section 8.5's before-and-after on the phone
   was never evaluable like for like: P5 measured Stage 8's starting build by the ordinary route, and Stage 8's build was measured only by the
   phone route. Two ordinary-route runs settle it, and give Stage 7's build its first phone reading.

## The route (version 4, WP-12)

`tools/step6/perf-route.js` with its wrapper `tools/step6/perf-run.html`, as in step 6 and Stage 8. New in version 4 (`step6-perf-route 4`,
`step6-phone-route 2`, the brackets' `2`), every earlier field kept as it was:
- the frame intervals themselves (`iv`, in 0.1 ms, after each segment's warm-up) and a 1 ms histogram (`hist`);
- the share of refreshes that brought no new frame (`missedPct`), and the shares of intervals over 1.2 and 1.5 refreshes with no floor
  (`over12R`, `over15R`), beside the long-frame share (`longPct`, unchanged: frames over max(1.5 refreshes, 25 ms));
- each segment's largest calls and triangles of any frame (`callsMax`, `trisMax`) beside the medians (`calls`, `tris`);
- what each block ran with (`fx`, `cull`, `sunShadow`), and the battle clock it covered (`clockFrom`, `clockTo`);
- the refresh measured again at the end (`refreshEndMs`), and the wake lock's result (`wakeLock`).

The printed table gains a `miss%` column. The report's JSON line (`AUS_PERF_JSON`) is larger than before, because it holds the raw intervals; it
still pastes as one block.

## The builds

Pages publishes `main`. The default build of `perf-run.html` is `main`'s `austerlitz-command-map.html`. The others are in
`docs/final-stage7-evidence/device/builds/`, named on the page by `?src=` (a same-origin path, WP-00):

| file | md5 | bytes | what it is |
|---|---|---|---|
| `austerlitz-8c0d383e-stage7.html` | `8c0d383eb45a6f2a5522d04863824b7b` | 3,037,848 | Stage 7's build (`main` after #107; the default build while `main` stays at it) |
| `austerlitz-dcc65319-stage6.html` | `dcc65319b445c119b005f7e5c25a29fc` | 3,025,956 | Stage 6's final build, before WP-14 and WP-16 |
| `austerlitz-c4793156-stage8-start.html` | `c4793156103b60bb74151c7d13dbdd9d` | 2,220,714 | Stage 8's starting build, the one P5 measured (`b04e150`) |

From the page `tools/step6/perf-run.html`, a build in that folder is `?src=../../docs/final-stage7-evidence/device/builds/<file>`. Every report
names the build it measured by its bytes and SHA-256, so a report can be matched to its file afterwards.

## What to run

As step 6 and Stage 8 asked: the window maximised at 100% zoom, plugged in, other tabs closed; on the phone Low Power Mode off, Reduce Motion
off, Auto-Lock "Never" for the runs and set back after, held upright and untouched.

**1. The integrated-GPU desktop or laptop** (Chrome or Edge; `chrome://gpu` saying "WebGL: Hardware accelerated"; the GPU named in the report's
header):
- `tools/step6/perf-run.html` (Stage 7's build): Start, then Copy. Run it twice, two minutes apart.
- The same with `?src=` naming `austerlitz-dcc65319-stage6.html`, twice. This is the before and after of Stage 7's performance work on the same machine.
- Optional: `?route=phone` once on Stage 7's build, if the machine falls to its low tier (a window under 900 x 700).

**2. The iPhone** (Safari):
- `tools/step6/perf-run.html` with no `?route=` (the ordinary route), on Stage 7's build, twice, two minutes apart: decision 269 (b).
- The same with `?src=` naming `austerlitz-c4793156-stage8-start.html`, twice: P5's build on the same route, the same day and the same phone. This makes
  the like-for-like comparison P5 lacked, rather than one taken across months and a Safari update.
- Optional: `?route=phone` once on Stage 7's build, for its steady state after the 45 s warm-up.

**What to send back:** each report as pasted text (each begins "Austerlitz step 6 frame-time route"), the device's model, and anything that
happened during a run (a notification, the screen dimming, a fan). They are filed verbatim beside Stage 8's, in a folder of their own, and read by
the rules already stated: section 8.3's budgets, and section 8.5's rule (each heavy segment's long-frame share and median), with the missed-refresh
share reported beside it. Section 8.5's rule is not changed; that is the owner's call (`CL-PERF-11`).

## Runs received

- **13 November 2026, the owner's desktop** (the RTX 4070 of L3, D1 and D2, not an integrated GPU): the ordinary route twice on Stage 7's build
  (`device/desk-S7-1`, `-2`; SHA-256 `22756380...a547d`). Stage 6's build was not available to the owner and was not run. Read in
  `docs/STAGE8_SPEC.md` section 27.1: section 8.3's budget within (843 calls, 2,317,741 triangles at most), section 8.5's rule holds, section 8.3's CPU line
  met in every segment (decision 268 (a)'s excess gone on this desktop: Play at half speed 7.6 to 4.9/5.1 ms against L3's 6.1), Play's missed refreshes
  0.1-0.2% (D1/D2 about 14-17%).
- **13 November 2026, the owner's iPhone 17 Pro**: the ordinary route twice on Stage 7's build (`device/phone-S7-1`, `-2`; decision 269 (b)). P5's build
  was not run again; P5 (23 October 2026, the same phone, iOS and Safari) is the comparison. Read in `docs/STAGE8_SPEC.md` section 27.2: section 8.3's
  phone budget within (1,395,047 triangles at most); Play at half speed 53.1/52.9 frames a second against P5's 53, phase 8's Overview orbiting 48/47
  against 47; section 8.5's rule fails in one segment's long-frame clause (phase 8's Overview orbiting, 2.7% to 8.9%/15.6%), put to the owner as
  question 324 and decided (a): accepted as measured, carried into the closing re-verification pass.

## Until then

The records state the limit: the integrated GPU is unmeasured, the phone's like-for-like comparison is Stage 7's build against P5's, not Stage 8's own build (never run on the ordinary route), and
Stage 7's work has no before-and-after of its own on a device (Stage 6's build not run; `docs/STAGE8_SPEC.md` section 27; `CHANGELOG.md`). Stage 7's performance changes are shown on matched protocols in this container only, as
CPU-side measures on software WebGL (WP-16, `wp16/`, `wp16b/`).
