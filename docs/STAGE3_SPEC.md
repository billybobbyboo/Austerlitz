# Navigation and structure specification (Stage 3, Part A)

**Status: Part A, for the owner's review. No change to the build.** Written against `main` at `0f2b17e` (Stage 2F merged,
#19, and recorded as merged, #20), whose build `austerlitz-command-map.html` is 1,253,655 bytes, md5
`ee4390a2585f3df170fba82eb1994112`. Before any work: `npm test` (all nine suites and the height guard), `check:data`
(all 113 declarations byte-identical to `archive/stage2c-68ac7721.html`), `check:chronology` (0 errors) and
`check:baseline` passed. Line numbers refer to that commit; the code is the source of truth, not the documents.

Scope: the Stage 3 line of `docs/VISUAL_AUDIT.md` ("camera controls, follow toggle, docked panels, one time spine, one
timeline, mode names, help overlay"), which answers high-impact problems 3 (the first screen, in part), 6 (five parallel
structures, and "Map" meaning several things) and 7 (exploration is orbit-only), and the medium-impact items "dock the
dispatch narrative in the rail as a first Now tab" and "a ? overlay". Parts 3B onward implement it; this part measures,
prototypes and specifies. Nothing from Stage 4 (sun, light, fog, pacing) or later is specified here; where a Stage 3
design meets a later stage, the boundary is stated.

**How this was established.** Every number below was produced by a script in `tools/stage3/` (committed; not bundled),
run against the build above. The model script reads the live sources in node through `tools/stage2/model.js`. The page
scripts drive the built page in headless Chromium with software WebGL, as the Stage 0 harness does
(`tools/stage2/page.js`, which injects `tools/visual/measure.js`). Where a design had to be tried, the script injects a
**probe** into the running page: measurement code, not the Stage 3 implementation. No source file changes. Evidence is in
`docs/stage3-evidence/`.

Labels, as in the earlier specifications: **fact** (read from the code or data, or measured), **derived** (computed from
facts), **recommendation** (a proposal for 3B onward), **open** (needs the owner). Owner decisions are cited by number
(1-17 in `docs/VISUAL_SPEC.md`, 18-46 in `docs/STAGE2_SPEC.md`).

| script | section | what it produces |
|---|---|---|
| `spine.js [--md f] [--json f]` | C | the ten phases, five acts, 25 events, ten chapters and nine tour stops against one another: each phase's events, timeline lines, chapters and stops; every clock, camera and stated time that does not line up |
| `dock-probe.js [--json f] [--shots dir] [--levels ..] [--cases ..]` | B, D, G | the docked layout, tried in five levels (today; the dispatch as a Now tab; one timeline of about 90 px; the legend closed by default; the dossier in the rail), per harness view at the case's viewport and at 1280 x 720: the unobstructed fraction, the panels, the timebar's rows, the largest free rectangle, the paper map's scale as framed, the arrow heads hidden, the orbit target against the free centre, with and without `setViewOffset` |
| `nav-probe.js [--json f]` | A, F, G | map-style landscape navigation tried at 1x, 4x and 10.33x from four views (pan under three rules, zoom toward the cursor, the floor); `setViewOffset` against the picking and projection helpers; the Watch view-mode control's rendered contrast; the arrow heads' boxes against their triangles; the mode switch during playback; two key bindings driven by real key presses |
| `report-3a.js [json] [--md f]` | B, G | the tables of `docs/stage3-evidence/dock-report.md`, from `dock-probe.json` |

## 0. The decisions and the roadmap against the evidence

### 0.1 Decisions that bind Stage 3

| # | decision (summary) | what it means for Stage 3 |
|---|---|---|
| 25 | The paper map: north up, orthographic, pan and zoom only; drag-to-pan and zoom-to-cursor "brought forward"; framing inside the unobstructed area. | `MAPCAM` (2E) is the paper map's camera. Stage 3 reuses its interface, its free rectangle and its scheduler for the landscape; its orthographic arithmetic does not carry over to a perspective eye (§A.3). The small framed map in Study (2E finding 1) is Stage 3's to remedy (§B, §G.5). |
| 29 | Legend: contextual, compact, collapsible, never over the dispatch. | Holds in every docked level (the dispatch leaves the map). Closing it by default in Study is a new choice (question 3). |
| 30 | Scope guard for Stage 2: "no other Stage 3 item". | Kept in reverse: this part changes no build, and nothing of Stage 4 is specified. |
| 39 | Drops per view no more than today's; never the selection, the highlighted family or live events; dropped formations reachable; "§H's numbers are the input to Stage 3, where docking the dispatch comes first". | Docking the dispatch is 3B, the first implementation part (§I). The drop limits only tighten (§H). |
| 19, 35 | The display factor is presentation; 1x, 4x (default), 10.33x. | Every camera check runs at all three (§A.4). The nav probe measures each rule at each. |
| 16 | Type floors: 10.5 px for tertiary metadata only; anything needed to follow the battle at least 12 px. | The 90 px timeline must carry phase and act labels at 12 px or more (§D.2); the probe's first try at 10.5 px was wrong and was redone at 12.5 px. |

"Things that should not change" (`docs/VISUAL_AUDIT.md`) that Stage 3 touches: the keyboard time slider, ARIA states and
reduced-motion support (kept and extended, §D.3, §A.3); the dossier structure and its progressive disclosure (the
dossier moves into the rail's column, its structure unchanged, §B.2); the restrained dark UI with serif narrative (the
Now tab keeps the dispatch's type); the Command view, Plans, plateau and centre-separation readings (they stay in the rail,
and the two derived readings move from the timebar into the Now tab, §B.2, §D.2).

### 0.2 Where the evidence contradicts the roadmap or the brief (fact)

Each is stated, not worked around.

1. **The guided tour has nine stops, not eight.** `TOUR` has 9 entries (`analysis.js:341-360`); the page counts them
   ("1 OF 9", `app.js:2586`) and `runtime-test.js` walks "9 tour stops forward and back". The roadmap (problem 6: "8 tour
   stops"), the code comments (`analysis.js:337`, "eight stops"; `app.js:2548`, "eight stops") and this task's brief say
   eight. §C counts nine.
2. **The timebar is 170 px, not "~145 px"** (problem 3). Measured at 1600 x 900: 170.1 px in four rows (§D.1). The audit's
   figures date from the pre-Stage-0 build (its header says so); what changed since is not traced here.
   At 1366 x 768 it is 139 px: below 820 px of height the act row is hidden (`style.css:523-532`).
3. **"Map" is not four meanings but three controls under four labels, plus a generic sense** (§E.1). The presentation
   "Map" (key 3) and the layers popover "Map…" are as the audit says; the paper ground style is labelled "Staff map", not
   "Map"; the M key ("map mode") is a shortcut to that ground control, not a fourth referent. "The map" is also used
   generically for the whole display (`#maplayer`, "Centre the map here", the sources text).
4. **"Both", the audit's proposed name for the hybrid ground style, is already a label**: the Plans tab's "Both" (both
   armies' plans, `shell.html:55`). It also misdescribes the style: hybrid draws the landscape with counters, not both
   drawings (`app.js:3364`, §E.2).
5. **The first screen is no longer as the audit describes it.** Stage 0 hid the dispatch and legend while the first-run
   card is open (`style.css:550-551`). Unobstructed at first run: 54.4% (1600 x 900), 48.3% (1366 x 768). Stage 7 owns the
   first run; §B leaves it as it is.
6. **Analysis: "ten moments" is ten chapters, and they are not one per phase.** Their clocks fall in phases 0, 0, 1, 1, 3,
   4, 5, 6, 7, 8: none in phases 2 and 9 (§C.1). The block comment says "the nine things that decided Austerlitz"
   (`analysis.js:2`); the rail says "The battle in ten moments" (`shell.html:36`).
7. **Interval events drawn as bars on the timeline are Stage 5** (opportunity 1, "Needs Stages 1-2"; the staged plan puts
   "interval events" in Stage 5). The one timeline of Stage 3 keeps today's marker at an interval's midpoint (§D.2).
8. **"A follow camera" appears twice in the roadmap**: Stage 3's "Follow the action" toggle (problem 7) and Stage 4's
   pacing ("slower default, automatic dwell at each event, a follow camera", opportunity 4). §A.3 reads Stage 3's toggle as
   making today's rule visible and controllable (the eye moves to each phase's view at the phase boundary). A camera that
   follows the action continuously is pacing, Stage 4.
9. **The free-camera rule is invisible** (problem 7): confirmed. No element, class or attribute reads `freeCam`; the
   vantage buttons' `aria-pressed` is not cleared when the visitor orbits (§A.1).
10. **The recorded cause of "pratzen-orbit-min draws no map text" (2D, 2E) is not the cause.** It was put down to three
   arrow heads' bounding boxes. Replayed with the harness's own interaction, the layer's obstacles cover the whole screen even
   with every head and objective marker removed: a live event glyph stands 1.8 units from the eye and its obstacle disc is
   about 2,370 px in radius; the heads' boxes cover 12.3% (§G.3). The question the owner was asked (boxes or triangles) does
   not decide this view.
11. **The phase-8 Overview's hidden Allied heads are not remedied by the panels.** 2C recorded them "under the timebar: the
   framing matter §D already recorded (§H, Stage 3)". With the timebar at 91.6 px two arrows' heads are still wholly under it,
   with or without the view offset (§B.3): the fixed Overview preset puts them in the bottom 92 px. The remedy is the
   preset's framing (§B.4), which §I puts in 3D.

## A. Camera controls on the landscape

### A.1 Every camera path today (fact; read from the code)

Two cameras since 2E: `landCam` (perspective, the landscape and hybrid styles) and `paperCam` (orthographic, driven only by
`MAPCAM`); `camera` is whichever is drawn. The landscape eye is placed by `orbitTarget` and `sph` (a spherical offset).
None of `world.js`, `symbols.js`, `data.js` or `analysis.js` moves a camera; the presets are data: 10 `PHASES[].cam`,
10 `ANALYSIS[].cam`, 9 `TOUR[].cam`, and the five `VANTAGE`s in `app.js:3519-3525`.

| path | trigger | landscape | paper map | floor | re-framed (2B) |
|---|---|---|---|---|---|
| drag (`bindCanvas`, `app.js:3528-3545`) | any button (no button test) | orbits: `sph.theta`, `sph.phi` (0.10 to π/2-0.03), `orbitPlace`; `freeCam=true` past 4 px | `MAPCAM.pan` | yes | no |
| wheel (`3554-3560`) | wheel | radius ×1.09 per step about `orbitTarget`, 24-620; **not toward the cursor**; `freeCam=true` | `MAPCAM.zoomAt`, toward the cursor | yes | no |
| click (`3547-3553`) | pointer up under 5 px of movement | `select(pickAt())`; the camera does not move | same | - | - |
| `glide` (`3497-3511`) | every move the app asks for | an arc (`setupArc`/`applyArc`) chained over a running tween; `freeCam=false` | `MAPCAM.glideTo` | yes, per frame | callers' points |
| `flyTo` (`3512-3518`) | vantages, chapters, tour, plans, leaving the paper map | `reframe(preset)`, then `glide` (1600 ms) | the Overview frames the field; others `glideTo` | yes | yes |
| phase transition (`startPhaseTransition`, `1626-1682`) | `setClock` on a phase change: playback, scrubbing, arrow keys, ±10 min, event ticks, phase and act buttons | if `!freeCam`: arc to `reframe(PHASES[ph].cam)` over 2600 ms. **It assigns `tween=` directly, so it drops a glide already running** | never moves the plan | yes | yes |
| `setPhase`, `setChapter`, `applyTour`, `setPlan` | buttons, the tour | `freeCam=false`, then a phase change and/or `flyTo` | as `flyTo` | yes | yes |
| `centreOnMap` / `focusOn` (`3923-3932`) | order-of-battle rows, dossier links, "Centre the map here", "Go to this moment", prev/next event when off screen | `glide` to a fixed direction (-0.55, 0.62, 0.56) at radius 82-112 | `glideTo` at `mapWppAt(radius)` | yes | no (display height) |
| first view (`openFirstRun`, `3826-3837`) | start-up | the Overview, re-framed, placed at once | - | yes | yes |
| `setMode` (`2598-2645`) | the ground buttons, the M key | leaving the paper map: `flyTo(PHASES[curPhase].cam)` if `!freeCam` | entering: `MAPCAM.frameField` unless moved by hand | yes | yes |
| resize (`3776-3784`) | window | aspect only; the landscape is not re-framed | frames the field again if it was framed | - | - |
| factor change (`redrawGround`, `991-1021`) | the relief control (disabled during playback) | eye and target kept at their height above the ground; **cancels any tween** (`tween=null; camArc=null`) | - | yes | - |
| render guard (`1969-1974`) | every drawn frame | counts and corrects an eye below the floor (`CAM.violations`) | exempt | enforces | - |
| paper-map keys (`2801-2809`) | arrows, + and -, when `#maplayer` itself has focus | - | pan 12% of the shorter side; zoom ×1.25 | - | - |
| harness and self-test (`placeCamera`, `applyCase`, `4766-4791`) | tools | re-framed preset or aim, clamped; `freeCam=true` | `MAPCAM.centreOn` / `frameField` | yes | yes |

- **Not bound anywhere** (fact): `dblclick`, `contextmenu`, `event.button`, pinch or two-finger gestures; the canvas has no
  `touch-action` (only `.timerail` has one, `style.css:263`). There is no landscape pan: `orbitTarget` moves only by glides,
  arcs, presets and the tools. There are no landscape camera keys; the window's arrows step the clock.
- **The floor** (`3457-3486`): `camFloor` is the highest drawn ground within 1.6 units of the eye, or the top of the figures
  of a drawn formation there (2B), plus 1.8. `clampCamera` lifts `landCam` to it. Every path above that places the landscape
  eye goes through it; the render guard counts any that did not.
- **`freeCam`** (fact). Set true by a drag past 4 px, the wheel, the paper map's keys and the tools. Set false by the phase
  and act buttons, a chapter, a tour stop, every `glide` (so every vantage and centring) and the paper map's `flyTo`. It is
  read in three places only: the phase transition moves the eye when it is false (`1635`), `setPlan` flies to the Overview
  when it is false (`2517`), and `setMode` returns to the phase's view when it is false (`2643`). **So "follow" today is: while
  the visitor has not dragged or zoomed since the last preset, each phase boundary glides the eye to that phase's authored
  view.** Nothing follows formations continuously. Nothing on screen shows the state.
- **Reduced motion** (`RM`, `app.js:4`): glides and phase arcs take 1 ms (they still run once through `applyArc`, so the
  floor applies); `MAPCAM`'s eased moves are instant.

### A.2 Map-style navigation tried (fact; `node tools/stage3/nav-probe.js`, `docs/stage3-evidence/nav-probe.json`)

The probe adds the operations to the running page, built only from the app's own `groundAt`, `groundY`, `clampCamera` and
`camFloor`, and drives them from four views (the Field, Pratzen and Overview vantages, and the harness's low Pratzen aim) at
1x, 4x and 10.33x. Drags are 300 px in 12 steps in each of four directions; zooms are six 9% steps in and six out at five
cursor positions.

| factor, view | pan, "release": during / after (px) | pan, "step" | pan, "anchor" | drags lost above the horizon (of 4) | zoom: worst drift (px); steps the floor cut | floor violations | offset: round trip (px); worldPerPx at the target without / with |
|---|---|---|---|---|---|---|---|
| 1x field | 0 / 25.75 | 18.19 / 0.48 | 0 / 0 | 0 | 0; 0 | 0 (guard 0) | 0.001; 0.1815 / 0.1815 |
| 1x pratzen | 0 / 169.15 | 94.1 / 0.55 | 0 / 0 | 1 | 0; 0 | 0 (guard 0) | 2.154; 0.06609 / 0.06609 |
| 1x overview | 0 / 3.87 | 2.5 / 0.16 | 0 / 0 | 0 | 0; 0 | 0 (guard 0) | 0.001; 0.208 / 0.208 |
| 1x pratzen-low | 0 / 47.66 | 14.41 / 1.34 | 0 / 0 | 0 | 0; 0 | 0 (guard 0) | 0.001; 0.05384 / 0.05384 |
| 4x field | 0 / 32.17 | 18.13 / 2.68 | 0 / 0 | 0 | 0; 0 | 0 (guard 0) | 0.001; 0.18118 / 0.18118 |
| 4x pratzen | 0 / 167.44 | 92.2 / 2.69 | 0 / 0 | 1 | 0; 0 | 0 (guard 0) | 0.001; 0.06594 / 0.06594 |
| 4x overview | 0 / 2.7 | 3.9 / 0.51 | 0 / 0 | 0 | 0; 0 | 0 (guard 0) | 0.001; 0.2066 / 0.2066 |
| 4x pratzen-low | 0 / 204.53 | 59.51 / 5.57 | 0 / 0 | 0 | 0; 0 | 0 (guard 0) | 0.001; 0.05312 / 0.05312 |
| 10.33x field | 0 / 67.27 | 43.94 / 9.42 | 0 / 0 | 0 | 0; 0 | 0 (guard 0) | 0.002; 0.18053 / 0.18053 |
| 10.33x pratzen | 0 / 171.88 | 95.82 / 38.35 | 0 / 0 | 1 | 0; 0 | 0 (guard 0) | 0.006; 0.06565 / 0.06565 |
| 10.33x overview | 0 / 14.79 | 6.79 / 0.5 | 0 / 0 | 0 | 0; 0 | 0 (guard 0) | 0.001; 0.20364 / 0.20364 |
| 10.33x pratzen-low | 0 / 288.27 | 235.21 / 2.22 | 0 / 0 | 1 | 89.33; 1 | 0 (guard 0) | 0.003; 0.05205 / 0.05205 |

Reading (derived):
- **Zoom toward the cursor is exact** when the whole eye-target pair is scaled about the ground point under the cursor: the
  point stays under the cursor to the pixel (the view's orientation does not change, so the point's projection cannot).
  The only drift is where the floor lifts the eye (one step in 60 at 10.33x in the low Pratzen view: 89 px). So the rule is: scale about the cursor's ground point,
  and when the floor would lift the eye, shorten that step to stop at the floor (§A.3).
- **Pan: moving the eye and target in the horizontal plane of the grabbed point keeps that point under the pointer exactly
  during the drag.** What differs is where the orbit target ends:
  - "release" (lift the target, and the eye with it, onto the ground on release): the picture jumps when the button is let
    go, by 3-67 px from the Overview and the Field, and 48-288 px in the low views;
  - "step" (the same at every step): the grabbed point slides off the pointer during the drag, up to 235 px (the low Pratzen view at 10.33x), 3-44 px from the Overview and the Field;
  - "anchor" (move the target along its own view ray to the drawn ground; the eye stays): **0 px during and after, in every
    view at every factor.** Nothing on screen
    moves, and the orbit centre is again a point of the drawn ground.
- **In the low views a drag toward the horizon runs out**: the pointer passes above the horizon of the grabbed point's plane
  (one drag of four, upward, from the Pratzen vantage at every factor and from the low Pratzen view at 10.33x). A pan needs a limit there (the pointer's ray is clamped to a minimum depression, as map controls do).
- **The floor held in every step of every rule at every factor** (0 violations; the render guard 0).
- **`setViewOffset` changes nothing the helpers compute**: `groundAt(project(p))` returns `p` to 0.001-0.006 px in the
  views above the plateau, and `worldPerPx` at the target is identical with and without the offset (it reads the field of
  view and the depth, which an offset of the same full size does not change). The Pratzen vantage at 1x has one
  grazing ray (2.2 px), the ground-march's precision at a grazing angle, not the offset.

### A.3 Design (recommendation)

**Input mapping, landscape** (the paper map keeps §G.2 of Stage 2 unchanged):

| input | action | notes |
|---|---|---|
| left-drag | pan: the grabbed ground point stays under the pointer (the "anchor" rule) | the target is kept on the modelled ground (\|x\| ≤ 180, \|z\| ≤ 155, the field); the pointer ray is clamped to a minimum depression of about 3° so a drag toward the horizon slows instead of running out |
| right-drag, or Shift/Ctrl + left-drag | orbit about the target (today's drag) | `contextmenu` suppressed on the canvas only |
| wheel | zoom toward the cursor (scale about its ground point), radius 24-620 as today | a step the floor would cut is shortened to stop at the floor, so the cursor's point never drifts |
| double-click | focus: glide the ground point under the pointer to the centre of the free rectangle at the current radius, or 86 units if farther (the dossier's centring distance) | through `glide`, so the floor applies and `freeCam` is set |
| touch | one finger pans, two fingers pinch-zoom and twist-orbit | `touch-action:none` on the canvas; tested by synthetic pointer events only (no device in the harness) |
| keys, with `#maplayer` focused (as the paper map since 2E) | arrows pan 12% of the shorter side; + and - zoom about the centre; Shift + arrows orbit 15° and tilt 5° | the window's arrows keep stepping the clock elsewhere (§F) |

The first-run hint ("Drag to turn the view, scroll to zoom") and the legend's control line change with it (§E.3).

**One camera module for each view, one interface.** `MAPCAM` knows only its camera, the viewport, the panels and a
scheduler (2E). A `LANDCAM` with the same interface (`pan(dx,dy)`, `zoomAt(sx,sy,k)`, `centreOn`, `glideTo`, `state`,
`restore`, `moved`, `freeRect` shared) takes the landscape; `bindCanvas` dispatches to the one drawn. The perspective
arithmetic is new; the free rectangle, the scheduler (`mapSchedule`, which chains a running transition) and the key handling
are reused. Every write to `landCam` stays behind `clampCamera`.

**One tween chain.** The phase transition assigns `tween=` directly and drops a glide in progress; `redrawGround` sets
`tween=null`. With pan and focus added, a visitor's double-click during playback would be dropped at the next phase
boundary. Stage 3 routes the phase transition through the same chaining as `glide` and `mapSchedule` (fact: those two
already chain).

**"Follow the action"** (a visible toggle; problem 7):
- It shows and sets the rule of §A.1: on, the eye goes to each phase's view at the phase boundary; off, the eye stays where
  the visitor put it. It is `!freeCam` made visible, not a new behaviour. Continuous following is Stage 4 (§0.2, item 8).
- Any pan, orbit, zoom or double-click turns it off, as a drag does today, and the toggle shows it. Turning it on glides to
  the current phase's view at once.
- A preset (vantage, chapter, tour stop, centring) keeps today's rule (it sets follow on). Question 1 asks whether a
  centring should leave follow off instead.
- Placement: in the timeline's control row beside Play (it concerns what playback does), as a toggle button
  (`aria-pressed`), labelled "Follow", with the title "Follow the action: move to each phase's view as the clock reaches it".
  In Watch it is on screen (the timebar is); in Clean (key 3) it is not, and follow keeps its state.
- The vantage buttons' `aria-pressed` is cleared when the eye leaves the vantage (fact today: it is not).

**The focus in the unobstructed area** (`camera.setViewOffset`):
- The landscape's principal point is moved to the centre of `MAPCAM.freeRect()` (the rectangle the paper map already frames
  in): `landCam.setViewOffset(W, H, W/2 - cx, H/2 - cy, W, H)`. The orbit target, every preset's target and every centring
  then land in the middle of the free map, not the middle of the window.
- Measured today (§B.3, the last table): the target is 150-280 px from the free centre in the Study views, and under a panel
  in some; with the offset, 0 px by construction.
- It must be reapplied wherever the free rectangle changes: a resize (today the handler sets only the aspect, which leaves a
  stale offset), a panel opening or closing (the dossier, the legend, the tour bar), a presentation change. The change is
  eased over the panel's slide (the app already draws frames while a panel slides, since 2D), so the picture does not jump.
- It is off on the paper map (`MAPCAM` centres its own frame) and in Clean (no panels: the offset is zero).
- Nothing else changes: picking, hover, the map layer, occlusion and the scale bar all project through the camera's own
  matrices (§A.2: round trip unchanged).

### A.4 What must hold (the self-test's camera checks, and new ones)

Today, at 1x, 4x and 10.33x (`selfTest`, `app.js:5198-5261`; fact):
1. every fixed view (the vantages, 10 phase, 10 chapter and 9 tour cameras, the staff preset) and every computed view
   (formations at each phase midpoint, events, features, terrain lines, at their centring distances) at least 1.8 above
   the drawn ground (`camGround`);
2. glides between consecutive tour stops, phases and chapters and every vantage pair stay above it (24 samples each);
3. orbiting at the lowest pitch and closest zoom (24 azimuths) never enters it;
4. no path placed the eye below the floor before a frame (`CAM.violations === 0`);
5. on the paper map, the controls through real events (a drag leaves the ground point under the pointer to 1 px, the wheel
   keeps the cursor's point to 1 px, a key pans with the clock unchanged, north stays up, the landscape eye does not move).

All five stay, unchanged. Stage 3 adds, at each factor (§H): pan, zoom, double-click and key paths from every fixed view
above the floor; the pan and zoom invariants on the landscape through real pointer and wheel events; the offset centred in
the free rectangle after each panel change and resize; the follow toggle's state equal to `!freeCam` after every path.

**What a change touches** (fact, from the inventory): `bindCanvas`; `orbitPlace`, `clampCamera`, `camFloor`; `glide`,
`flyTo`, `setupArc`/`applyArc` (which does not update `sph`); `startPhaseTransition`'s tween; `redrawGround`'s tween reset;
the resize handler; `setMode`'s leave rule; `worldPerPx`, `distAtWpp`, `mapWppAt`, `viewDist` (unchanged in value, §A.2);
`onScreen`, `pickAt`, `mlHoverAt`, `mlOccluded` (unchanged, through the camera); `MAPCAM.freeRect`, `mlPanels`; the harness's
`placeCamera` and `applyCase` and the self-test's save and restore (they must reset the offset and the follow state).

## B. Docked panels

### B.1 The panels today (fact; `dock-probe.js` level 0, and the code)

At 1600 x 900 in Study, with the first-run card dismissed (boxes as x, y, width x height):

| panel | box | shown | notes |
|---|---|---|---|
| rail (`.rail`) | 0, 0, 300 x 730 | Study (hidden in Watch and Clean; at start-up hidden below 1080 px of width, and never again on resize) | four tabs: Order of battle (the default), Analysis, Command, Plans; the sources link at its foot |
| dispatch (`.dispatch`) | 314, 136, 440 x 580 | Study, unless D, the tour or the first-run card hides it | the phase's clock, title, lede, timeline lines, "what changed"; `aria-live="polite"`; scrolls (734 px of content in 578) |
| legend (`.legend`) | 1286, 374, 296 x 342 | Study, open by default | contextual (2D); closes itself where it would lie over the dispatch |
| tools (`.tools`) | 1258, 20, 320 x 86 | Study | Guided tour, "Map…", the five vantages |
| presentation switch (`#viewmode`) | 712, 14, 175 x 34 | always; 24% opacity in Watch and Clean | |
| timebar (`.timebar`) | 0, 730, 1600 x 170 | Study and Watch | four rows (§D.1) |
| dossier (`.drawer`) | 1224, 0, 376 x 900 | Study, while something is selected | full height, over the timebar's right end (z-index 30 over 24); the tools and the legend slide left by its width |
| first-run card (`#firstrun`) | 680, 471, 540 x 241 | at start-up | hides the dispatch and the legend while open |
| tour bar, selection chip, sightline badge, layers popover | bottom centre / bottom centre / bottom centre / top right | while the tour runs; with a selection in Watch or Clean; with a sightline origin; while open | |

The unobstructed fraction (§H of Stage 2: the share of the viewport outside these panels, on a 4 px grid) is 38.6% in Study
at 1600 x 900 and 25.0% at 1280 x 720; with a formation selected, 19.6% and 12.5%; in Watch 80.5% and 79.9%.

### B.2 The docked layout (recommendation)

- **The dispatch is the rail's first tab, "Now"**, and Study opens on it (question 9). It holds the phase's clock, title,
  lede, timeline lines and "what changed", as the card does, and at its top the two derived readings and the live event's
  `why` from today's situation row (§D.2), each with its "derived" tag as now. It keeps the card's type (serif lede at
  `t-prose`, title at `t-h2` in the narrower column). D hides and shows the Now text as it hides the card today.
- **The dossier opens in the rail's column** (question 8): a selection shows the dossier where the tabs' content is, with
  "Back to Now" (or to the tab it came from) at its head; Esc and × close it as today. The dossier's structure and its
  progressive disclosure do not change. The tools and the legend no longer slide, and the timebar is never covered.
- **The legend closes to its "Key" head by default in Study** (question 3); it opens on a click and stays as the visitor
  leaves it while the page is open. Its rules of 2D are unchanged; "never over the dispatch" becomes "never over the rail,
  the dossier or the timebar" (§H).
- **Unchanged:** the tools, the presentation switch in Study, the tour bar, the chip, the badge, the layers popover and the
  first-run card (Stage 7). Watch changes only by the timeline (§D) and G.2.
- **Below 1080 px of width** the rail starts hidden; there the dispatch stays a card, as today (question 12).
- **Accessibility:** the tabs become a `tablist` with `role="tab"` and `tabpanel`, arrow keys between tabs; the phase
  change is announced by one polite live region whether or not the Now tab is shown (a hidden tab's live region would not
  be read).

### B.3 The prototype's numbers (fact; `dock-probe.js`, tables by `report-3a.js` in `docs/stage3-evidence/dock-report.md`)

Levels (each includes the ones before it): 0 today; 1 the dispatch as the Now tab; 2 one timeline of about 90 px; 3 the
legend closed by default; 4 the dossier in the rail's column. Screens: `docs/stage3-evidence/dock-probe.jpg`.

**The unobstructed fraction, per view, at the case's viewport / 1280 x 720 (per cent).** The 2C baseline is today's
threshold (`thresholds.js`); "today" is this build.

| view | viewport | 2C baseline (thresholds.js) | today | now-tab | timeline | legend-closed | dossier-in-rail |
|---|---|---|---|---|---|---|---|
| first-run | 1600 x 900 | 54.4 / 43.9 | 54.4 / 43.9 | 54.4 / 43.9 | 61.6 / 49.3 | 61.6 / 49.3 | 61.6 / 49.3 |
| first-run-laptop | 1366 x 768 | 48.3 / 43.9 | 48.3 / 43.9 | 48.3 / 43.9 | 53.4 / 49.3 | 53.4 / 49.3 | 53.4 / 49.3 |
| paper-laptop | 1280 x 720 | 15.1 / 15.1 | 21.5 / 21.5 | 43.7 / 43.7 | 48.9 / 48.9 | 62.9 / 62.9 | 62.9 / 62.9 |
| paper-1366 | 1366 x 768 | - | 26.7 / 21.5 | 48.1 / 43.7 | 53.1 / 48.9 | 65.4 / 62.9 | 65.4 / 62.9 |
| overview-field | 1600 x 900 | 30.3 / 15.1 | 38.6 / 25.0 | 56.3 / 47.2 | 63.6 / 52.4 | 70.4 / 62.9 | 70.4 / 62.9 |
| overview-plan | 1600 x 900 | 80.5 / 79.9 | 80.5 / 79.9 | 80.5 / 79.9 | 89.3 / 86.5 | 89.3 / 86.5 | 89.3 / 86.5 |
| close-sokolnitz | 1600 x 900 | 80.5 / 79.9 | 80.5 / 79.9 | 80.5 / 79.9 | 89.3 / 86.5 | 89.3 / 86.5 | 89.3 / 86.5 |
| staff-paper | 1600 x 900 | 30.3 / 15.1 | 36.5 / 21.5 | 54.2 / 43.7 | 61.4 / 48.9 | 70.4 / 62.9 | 70.4 / 62.9 |
| pratzen-low | 1600 x 900 | 80.5 / 77.1 | 80.5 / 77.1 | 80.5 / 77.1 | 89.3 / 86.5 | 89.3 / 86.5 | 89.3 / 86.5 |
| pratzen-orbit-min | 1600 x 900 | 80.5 / 77.1 | 80.5 / 77.1 | 80.5 / 77.1 | 89.3 / 86.5 | 89.3 / 86.5 | 89.3 / 86.5 |
| selected-formation | 1600 x 900 | 14.8 / 7.0 | 19.6 / 12.5 | 37.4 / 24.0 | 42.6 / 27.3 | 49.3 / 37.8 | 70.4 / 62.9 |
| watch-selected | 1600 x 900 | 78.4 / 73.2 | 78.4 / 73.2 | 78.4 / 73.2 | 87.5 / 82.7 | 87.5 / 82.7 | 87.5 / 82.7 |
| hybrid-dimmed | 1600 x 900 | 78.7 / 74.3 | 78.7 / 74.3 | 78.7 / 74.3 | 87.7 / 84.0 | 87.7 / 84.0 | 87.7 / 84.0 |
| pratzen-low-1x | 1600 x 900 | 80.5 / 77.1 | 80.5 / 77.1 | 80.5 / 77.1 | 89.3 / 86.5 | 89.3 / 86.5 | 89.3 / 86.5 |
| pratzen-low-10x | 1600 x 900 | 80.5 / 77.1 | 80.5 / 77.1 | 80.5 / 77.1 | 89.3 / 86.5 | 89.3 / 86.5 | 89.3 / 86.5 |
| paper-north-up | 1600 x 900 | 30.3 / 15.1 | 36.5 / 21.5 | 54.2 / 43.7 | 61.4 / 48.9 | 70.4 / 62.9 | 70.4 / 62.9 |
| paper-close | 1600 x 900 | 30.3 / 16.3 | 35.7 / 22.2 | 53.5 / 43.2 | 60.7 / 47.8 | 70.4 / 62.9 | 70.4 / 62.9 |
| paper-drawer | 1600 x 900 | 14.8 / 7.0 | 17.5 / 12.5 | 35.2 / 20.5 | 40.4 / 23.8 | 49.3 / 37.8 | 70.4 / 62.9 |
| ph8-overview-study | 1600 x 900 | - | 38.6 / 25.0 | 56.3 / 47.2 | 63.6 / 52.4 | 70.4 / 62.9 | 70.4 / 62.9 |
| ph8-overview-watch | 1600 x 900 | - | 80.5 / 79.9 | 80.5 / 79.9 | 89.3 / 86.5 | 89.3 / 86.5 | 89.3 / 86.5 |

**The largest free rectangle** (`MAPCAM.freeRect`, where the paper map frames and where §A.3 centres the landscape), at
1600 x 900: overview-field 472 x 648 px today → 928 x 648 (Now tab) → 928 x 728 (timeline) → 1272 x 616 (legend closed);
selected-formation 440 x 240 → 552 x 648 → 552 x 728 → 896 x 616 → 1272 x 616 (dossier in the rail); the Watch views 1568 x
648 → 1568 x 728. The timebar: 170.1 px → 91.6 px at 1600 x 900; 139.1 → 91.6 at 1366 x 768 and 1280 x 720.

**The paper map as entered, px per true km** (the page's own framing; and, derived from the measured panels, the framing in
the free rectangle that fits the field best instead of the largest one; `dock-report.md`, last table):

| viewport | today | Now tab | + timeline | + legend closed | + dossier in the rail | + legend closed, framed to fit (derived) |
|---|---:|---:|---:|---:|---:|---:|
| 1600 x 900 (paper-north-up) | 17.1 | 25.4 | 28.5 | 24.2 | 24.2 | 28.5 |
| 1366 x 768 (paper-1366) | 9.9 | 21.6 | 23.5 | 19.5 | 19.5 | 23.5 |
| 1280 x 720 (paper-laptop) | 5.5 | 19.8 | 21.6 | 17.6 | 17.6 | 21.6 |

**Arrow heads more than a quarter hidden** (each arrow's head is two meshes, its casing and its fill, so the counts are in
arrows): in the phase-8 Overview (14:40, the Overview vantage), today 4 of 5 arrows in Study and in Watch; with the 90 px
timeline 2 of 5, **both wholly under the timebar**, and the same with `setViewOffset`. In overview-field 3 of 6 today, none
once the dispatch is docked. With the offset in Watch, one arrow's head goes partly off the screen's edge in overview-plan
(0 → 1) and in watch-selected (1 → 2): the offset moves the picture, and the presets were framed without it.

**The orbit target**: today 213-282 px from the free rectangle's centre in the Study landscape views (under the first-run
card in first-run-laptop), 62-86 px in Watch; with the offset, 0 px.

**The map layer's drops** stay within every limit at every level. Some views drop one to three more as the panels shrink
(watch-selected 2 → 4, ph8-overview-watch 2 → 5, first-run 7 → 9): items whose anchors were under a panel, and so not
counted, come on screen and are counted. selected-formation drops 2 at every level (limit 3).

Note on pratzen-orbit-min: `dock-probe.js` applies the case's camera without the harness's pointer interaction, so its
numbers for that view (7 drops) are not the harness view's (18; §G.3 replays the interaction).

### B.4 Reading (derived)

- **Docking the dispatch is the largest single gain**, as decision 39 foresaw: in the Study views +17.7 points at 1600 x 900
  (overview-field 38.6 → 56.3%) and +22.2 at 1280 x 720 (25.0 → 47.2%); on the paper map at 1280 x 720 the framed scale goes
  from 5.5 to 19.8 px per km.
- **The 90 px timeline** adds 7.3 points in Study and 8.8 in Watch at 1600 x 900 (Watch 80.5 → 89.3%), and 6.6 in Watch at
  1280 x 720; it is the only change that reaches the Watch views and the first-run screen (54.4 → 61.6%).
- **The legend closed by default** adds 6.8 points at 1600 x 900 and 10.5 at 1280 x 720 in Study, but under `MAPCAM`'s
  largest-area rule it makes the paper map *smaller* (28.5 → 24.2 px per km; 21.6 → 17.6): the largest free rectangle becomes
  wide and short (1272 x 616, 952 x 448), and the field's outline is about square (436 x 404 world units). Framed in the
  rectangle that fits the field, the scale stays 28.5 and 21.6. **Recommendation:** `MAPCAM` frames in the free rectangle
  where the content is drawn largest, not the one of largest area (3B; it changes framing only).
- **The dossier in the rail** removes the cost of a selection: selected-formation 49.3 → 70.4% at 1600 x 900 and 37.8 → 62.9%
  at 1280 x 720, the same as with nothing selected.
- **All four together**, against today: the Study landscape 38.6 → 70.4% (1600 x 900) and 25.0 → 62.9% (1280 x 720); a
  formation selected 19.6 → 70.4% and 12.5 → 62.9%; the paper map 36.5 → 70.4% and 21.5 → 62.9%, framed at 28.5 and 21.6 px
  per km instead of 17.1 and 5.5; Watch 80.5 → 89.3% and 79.9 → 86.5%. Every view rises above its 2C baseline and above
  today at both viewports; none falls.
- **The phase-8 Overview's hidden heads are a framing problem, not a panel problem**: two Allied arrows' heads lie in the
  bottom 92 px of the window from the fixed Overview preset, so neither the thin timeline nor the offset uncovers them.
  **Recommendation (3D):** on the landscape the Overview vantage fits the modelled ground into the free rectangle, as the
  paper map's Overview already does (`MAPCAM.frameField`), and the other presets are re-framed into it at use (2B already
  re-frames them in height). The ponds lie inside the modelled ground, so their heads would be inside the free area
  (derived; §H makes it a test).
- **The offset and the presets go together**: centring the target moves the picture, and in two Watch views it pushes an
  arrow's head partly off the edge. The presets' framing at use (above) is what keeps what they were chosen to show on screen.

## C. One time spine

### C.1 How the structures relate today (fact; `node tools/stage3/spine.js`, `docs/stage3-evidence/spine.md`)

| structure | count | its time | where it is shown |
|---|---:|---|---|
| `ACTS` | 5 | none of its own: a list of consecutive phases | the timebar's act row (`buildActs`, one button per act, opening its first phase); the situation line's first words |
| `PHASES` | 10 | `t0`-`t1`, contiguous from 04:00 to 18:00 | the timebar's phase row; the dispatch (title, lede, its timeline lines); each phase's camera, light and mist |
| `PHASES[].events` (the phase's timeline lines) | 32 | a label ("c. 09:45", "after 11:00", "2 Dec") | the dispatch's list |
| `EVENTS` | 25 (13 at an instant, 12 intervals) | `t`, a minute or an interval | a diamond on the time rail at the midpoint; a glyph and a label on the map while live (14 min before to 26 min after); the situation line's top live event; ←│ │→ and `,` `.` jump between the midpoints; a dossier |
| `ANALYSIS` (chapters) | 10 | `t`, one clock each | the rail's Analysis tab, "The battle in ten moments"; choosing one sets its clock (no camera arc), highlights its formations and flies to its own camera |
| `TOUR` | 9 | `t`, one clock each | the tour bar; a stop applies its chapter, plan or feature, then its own clock and its own camera, which override the chapter's (`applyTour`, `app.js:2576-2583`) |

The acts and phases are nested already: the five acts cover the ten phases once each, in order. Nothing in the data places an
event, a chapter or a tour stop in a phase; the page does it by time. Per phase (events placed by the start of their
window):

| phase | act | window | label / title | EVENTS starting in it | running into it | its timeline lines | chapters | tour stops |
|---|---|---|---|---|---|---|---|---|
| 0 | deception | 04:00-07:00 | Deployment / Dispositions in the dark | columns-move 04:00-07:00; counter-march 04:15-08:00; raigern 04:00-04:45 | - | c. 01:00; c. 04:00; c. 06:00 | plan 04:10; deception 04:10 | 1 04:10; 2 04:10; 3 04:10 |
| 1 | advance | 07:00-08:00 | Telnitz / The Allied left opens the battle | telnitz 07:00; davout 07:45-08:15 | counter-march | c. 07:00; c. 07:30; c. 08:00 | weakness 07:00; commitment 07:10 | 4 07:25 |
| 2 | advance | 08:00-08:45 | Sokolnitz / Sokolnitz, the castle and the pheasantry | sokolnitz 08:00; telnitz-retaken 08:30; decision 08:25-08:45 | davout | c. 08:00; c. 08:30; c. 08:30 | - | 5 08:20 |
| 3 | strike | 08:45-09:30 | The Pratzen / Soult storms the heights | soult 08:45-09:15; pratzen-village 09:00; face-about 09:15 | - | c. 08:45; c. 09:00; c. 09:15 | pratzen 08:47 | 6 08:50 |
| 4 | strike | 09:30-10:30 | Pratzeberg / The crisis on the Pratzeberg | kamensky 09:45 | - | c. 09:30; c. 09:45; c. 10:15; c. 10:30 | cut 10:00 | - |
| 5 | divided | 10:30-11:15 | Olmutz road / The northern battle decided | kursk 10:30; pratzeberg 11:00; guard-attack 11:00-13:00 | - | c. 10:40; c. 11:00; c. 11:15 | north 10:40 | - |
| 6 | divided | 11:15-12:45 | The Guard / The Russian Guard at Stare Vinohrady | blasowitz 11:15; guard-broken 11:15-13:15; hq-forward 12:00-12:40; buxhowden-blind 11:40-12:40; davout-resumes 12:30 | guard-attack | after 11:00; c. 11:45; c. 12:00; c. 12:00 | guard 11:20 | 7 11:20 |
| 7 | collapse | 12:45-14:30 | The wheel / The centre turns south | wheel 13:00-14:00; sokolnitz-falls 14:00 | guard-attack, guard-broken | c. 12:30; c. 13:00-14:00; c. 14:00 | wheel 12:50 | - |
| 8 | collapse | 14:30-17:00 | The ponds / Augezd, the ponds and the ice | augezd 14:30; ice 15:00; end 16:30 | - | c. 14:30; c. 15:00; c. 16:30 | collapse 14:40 | 8 14:40; 9 16:40 |
| 9 | collapse | 17:00-18:00 | Reckoning / The reckoning | - | - | 2 Dec; 26 Dec; 6 Aug 1806 | - | - |

**Where they do not line up** (derived by `spine.js`, then reviewed by hand; each item is fact about the data):

1. **The same moment at two clocks.**
   - Tour stop 7, "The army divided", sets **11:20** (phase 6, act "The Army Divided"). Its chapter, "cut" ("The cutting of
     the Allied army"), sets **10:00** (phase 4, act "The Pratzen Strike"). The chapter's text begins "With the plateau
     taken"; the Pratzeberg is "firmly in French hands" at 11:00 (event `pratzeberg`); the chapter "pratzen" says the fight
     for the summits "lasted until about 11:00", and phase 3's lede that the plateau "will not be firmly French until about
     11:00". So the chapter's clock is an hour before the moment its first
     sentence presupposes, and in the act before the one its subject names.
   - Tour stop 4 sets 07:25, its chapter "commitment" 07:10; stop 6 sets 08:50, its chapter "pratzen" 08:47. Same phase,
     minutes apart. Stop 4's clock carries a test: `sim-test.js` checks its quoted "about 19,000 by 07:15" against the live
     reading (19,300 "before the attack").
   - The chapter "wheel" sets 12:50; its text and the event `wheel` give 13:00-14:00.
2. **Chapters whose text spans more than the phase their clock sets**: "commitment" (07:10; "between 07:00 and 09:00",
   phases 1-3), "pratzen" (08:47; to "about 11:00", phase 5), "cut" (10:00; "until about noon", phase 6), "north" (10:40;
   "Blasowitz fell about 11:15", phase 6). A chapter is a theme over a span, shown at one minute of it.
3. **Cameras borrowed from another phase.** Tour stops 5 (08:20, phase 2), 7 (11:20, phase 6) and 9 (16:40, phase 8) use the
   cameras of phases 3, 4 and 9. Seven chapters copy a phase's camera exactly (commitment: phase 1; pratzen: 3; cut: 4;
   north: 5; guard: 6; wheel: 7; collapse: 8); plan, deception and weakness have their own.
4. **No chapter in phases 2 and 9; two each in phases 0 and 1.** Tour stops fall in phases 0 (three), 1, 2, 3, 6 and 8
   (two); none in 4, 5, 7 or 9.
5. **Events that cross a boundary**: `counter-march` 04:15-08:00 (phases 0-1, acts one and two), `guard-attack` 11:00-13:00
   (phases 5-7, acts four and five), `guard-broken` 11:15-13:15 (phases 6-7, acts four and five), `davout` 07:45-08:15
   (phases 1-2).
6. **Timeline lines outside their phase**: phase 0's "c. 01:00" (Weyrother's reading, before the clock starts at 04:00);
   phase 6's "after 11:00" (the Guard's attack; phase 6 starts at 11:15, and the event `guard-attack` starts at 11:00, in
   phase 5); phase 7's "c. 12:30" (Davout attacks; phase 7 starts at 12:45, and the event `davout-resumes` at 12:30 is in
   phase 6). Phase 9's three lines are dates after the battle (2 Dec, 26 Dec, 6 Aug 1806).
7. **Two texts for one moment.** 23 of the 25 events have a timeline line naming the same people or places: 21 matched by
   the script (20 at the same minute; `counter-march`, 04:15-08:00, against "c. 04:00"), and `soult` (phase 3, "c. 08:45
   Soult's divisions advance") and `wheel` (phase 7, "c. 13:00-14:00 Soult and Davout launch the converging assault") by
   hand. The line and the event are worded separately.
   Two events have no line: `columns-move` (its matter is phase 0's lede and its "c. 04:00" line) and `raigern` (Friant at
   Raigern since the night). Nine lines have no event: "c. 01:00" Weyrother; "c. 06:00" Napoleon on the Zuran; "c. 07:30"
   Dokhturov's column descends; "c. 09:30" Lannes and Bagration; "c. 10:15" Jurczek's Austrians on the Pratzeberg; "c.
   10:40" the cavalry collision west of Blasowitz; and phase 9's three dates.
8. **Not touched here**: the three disagreeing texts of Stage 2 §M.9 and the four unresolved conflicts that
   `check:chronology` names (dok@1, guard_cav@6, kamensky@3, kamensky@4) are movement timings, not spine structure.

### C.2 One spine (recommendation)

- **Acts > phases > events.** Acts and phases stay as they are. Each event belongs to the phase that contains the start of
  its window (the rail draws its marker at the window's midpoint today, and the map shows it from 14 minutes before), and an event that runs on past its phase is shown running on
  (a marker at its midpoint in Stage 3; bars are Stage 5). By that rule the 25 events fall 3, 2, 3, 3, 1, 3, 5, 2, 3 and 0
  per phase.
- **A moment is a phase or an event.** Everything else points at moments instead of carrying its own clock and camera.
- **Analysis becomes themes.** A chapter keeps its title, text, formations and places, and names the moments it concerns and
  one principal moment where it opens. Choosing a theme goes to the principal moment (its clock and camera) and marks the
  theme's other moments on the timeline. A theme may keep its own camera when no phase's view shows its subject (plan,
  deception, weakness today).
- **The tour is a path through the same moments.** A stop names one moment (and, as today, a theme, plan or feature) and
  takes that moment's clock and camera; its text stays. A stop keeps its own clock only where its text quotes a reading at
  that clock (stop 4), recorded as an exception.
- **One text per moment.** Where a phase's timeline line and an event are the same moment, the dispatch lists the event
  (with its grade and claim, as the dossier does); lines with no event stay as the phase's notes.

**What Stage 3 can do without a data change** (3C): build the spine index at load from the data as it is (events placed by
start; chapters and tour stops placed by their clocks), draw it on the one timeline (§D), and show a theme's or stop's place
on it. The alignment itself (moving clocks, cameras and texts) is data.

### C.3 The data changes it would need (a data task; none is made here)

Every structure below is guarded by `check:data` (`PHASES`, `ANALYSIS`, `ACTS`, `EVENTS`, `TOUR`). A data task that makes any
of them lists each change with its evidence in `CHANGELOG.md` and moves the reference.

| structure | entry | today | proposed | evidence (the app's own texts; no new source is needed or claimed) |
|---|---|---|---|---|
| `ANALYSIS` | every chapter | `t`, `cam` | a new field `moments` (phase or event ids) and a principal moment; `t` retired (the clock is the moment's); `cam` kept only where no phase's view shows the subject | the chapter's text and `forms` |
| `ANALYSIS` | plan / deception | 04:10 | phase 0 (04:00); own cameras kept | "Weyrother's dispositions…"; "abandoned the Pratzen plateau on 1 December" |
| `ANALYSIS` | weakness | 07:00 | principal: `telnitz` (07:00); moments `raigern`, `davout`, `telnitz`; own camera kept | "Legrand's single division held roughly five kilometres… reached Raigern only on the night of 1 December" |
| `ANALYSIS` | commitment | 07:10 | principal: phase 1 (07:00); moments `telnitz`, `sokolnitz`, `telnitz-retaken` | "Between 07:00 and 09:00…" |
| `ANALYSIS` | pratzen | 08:47 | principal: `soult` (08:45); moments `decision`, `soult`, `pratzen-village`, `face-about`, `kamensky`, `pratzeberg` | "At about 08:45… until about 11:00" |
| `ANALYSIS` | cut | 10:00 | **open (question 6)**: principal `pratzeberg` (11:00, phase 5) or phase 4 as today; moments `pratzeberg`, `buxhowden-blind` | "With the plateau taken… did not learn… until about noon"; event `pratzeberg` 11:00 |
| `ANALYSIS` | north | 10:40 | principal: phase 5 (10:30); moment `blasowitz` (and phase 5's "c. 10:40" cavalry line, which has no event) | "Blasowitz fell about 11:15" |
| `ANALYSIS` | guard | 11:20 | principal: `guard-attack` (11:00, phase 5) or phase 6 (11:15); moments `guard-attack`, `guard-broken`, `hq-forward` | the Guard's attack and Rapp's charge (events) |
| `ANALYSIS` | wheel | 12:50 | principal: `wheel` (13:00); moments `davout-resumes`, `wheel`, `sokolnitz-falls` | "Between about 13:00 and 14:00…"; event `wheel` 13:00-14:00 |
| `ANALYSIS` | collapse | 14:40 | principal: `augezd` (14:30); moments `augezd`, `ice`, `end` | "the neck of dry ground at Augezd… the frozen water" |
| `TOUR` | every stop | `t`, `cam` | a new field `moment`; `t` and `cam` retired except where noted | the stop's own text |
| `TOUR` | 1-3 | 04:10 | phase 0 / themes plan, deception (04:00); cameras as today (they are phase 0's and the themes') | - |
| `TOUR` | 4 "The Allied advance" | 07:25 | theme commitment, **own clock 07:25 kept** (its text quotes the plateau reading "about 19,000 by 07:15", which `sim-test.js` checks) | the stop's text |
| `TOUR` | 5 "Why the Pratzen matters" | 08:20, phase 3's camera | phase 2 with the feature `pratzen`; the feature's own view | "the fog that hid Soult's divisions forming at the foot of the slope" (before 08:45) |
| `TOUR` | 6 "The French strike" | 08:50 | theme pratzen, moment `soult` (08:45) | "At about a quarter to nine…" |
| `TOUR` | 7 "The army divided" | 11:20, phase 4's camera | theme cut; its moment follows question 6 | "With the plateau gone…"; act "The Army Divided" (10:30-12:45) |
| `TOUR` | 8 "The collapse" | 14:40 | theme collapse, moment `augezd` (14:30) | - |
| `TOUR` | 9 "What it cost" | 16:40, phase 9's camera | phase 9 (17:00) or `end` (16:30); phase 9's camera | losses and the reckoning (phase 9's title) |
| `PHASES` | the 23 timeline lines that duplicate an event | their own wording | the dispatch shows the event's text; the line is retired or kept as a note (one wording per moment) | the pairs in `spine.md` |
| `PHASES` | phase 6 "after 11:00", phase 7 "c. 12:30" | in the phase after their time | move to the phase their time falls in (5 and 6), or state why they stay | their own labels; events `guard-attack`, `davout-resumes` |
| `EVENTS` | the nine lines with no event | phase notes only | optional: some become events, each with its place, grade and claim | needs its own evidence; not proposed here |
| `ACTS` | - | - | no change | the acts already group the phases once each |

Two of these change what a test checks: tour stop 4 (kept, above) and any chapter clock a suite quotes (`terrain-test.js`
checks tour stop 5's 73% and under 3%, which are viewshed readings and do not depend on the clock).

## D. One timeline of about 90 px

### D.1 Today's timebar (fact; measured by `dock-probe.js` at level 0, and read from the code)

| row | element | height at 1600 x 900 | what it carries | scale |
|---|---|---:|---|---|
| progress | `#prog` | 2 (absolute, not a row) | playback progress: `scaleX(fraction)` with no `transform-origin`, so it grows from the middle outwards | - |
| 1 | `.tb-top` | 48.6 | ◄│ ◄ Play ► │► (previous event, −10 min, play, +10 min, next event); the clock (21 px) and "2 Dec 1805"; the time rail (`role="slider"`) with hour ticks, the even hours' numerals (10.5 px), 25 event diamonds at their midpoints, the playhead; the four speeds; the scale bar | the rail is proportional to time, 04:00-18:00 |
| 2 | `#situation` | 47.5 | the act (capitals), the phase title, the top live event, "derived: on the heights: Allied ≈ N" (phases 0-6), "derived: centre separation detected", then a second line: the live event's `why` (or the act's line); a × that hides the row until the page is reloaded | - |
| 3 | `#acts` | 25.0 | five act buttons, each opening its first phase; `title` = the act's line | equal widths, not time |
| 4 | `#phases` | 48.0 | ten phase buttons (clock span and label), scrolling sideways, the current one scrolled into view | equal widths, not time |
| total | `.timebar` | 170.1 | | |

- **Three rows with two scales** (fact): the rail is proportional to time; the act and phase rows give every act and phase
  the same width. Phase 0 (three hours) and phase 3 (45 minutes) are the same width in row 4, and 3.9 times apart on the rail.
- At 1366 x 768 the act row is hidden (below 820 px of height, `style.css:523-532`): 139.1 px (control row 44.6, situation 45.5, phases 48, and the 1 px top border; at 1600 x 900 the rows add to 169.1 with the
  border 170.1). At 1280 x 720 the same.
  Below 720 px of width the rail takes its own line (223 px measured at 600 x 900 by the inventory).
- **Keyboard and screen reader** (fact):
  - the rail is focusable (`tabindex="0"`, `role="slider"`, `aria-label="Battle clock"`, `aria-valuemin="240"`,
    `aria-valuemax="1080"`) but **never sets `aria-valuenow` or `aria-valuetext`**, so a screen reader hears no value;
  - its ← and → step ±15 and the window adds ±10 (measured: +25 min; Shift +75); Home, End, PageUp, PageDown do nothing;
  - the 25 event diamonds are `<s>` elements with a `title` and a `pointerdown` handler: no `tabindex`, no role, so the
    keyboard cannot reach them (their `:focus-visible` rule never applies); `,` and `.` reach the events instead;
  - Play has no `aria-pressed` (it swaps its text); the speed buttons do; the act and phase buttons carry `aria-current`;
  - no live region covers the clock or the situation line; a phase change is announced by the dispatch (`aria-live="polite"`);
  - Tab order from Play: next, next event, the rail, four speeds, the situation's ×, five acts, ten phases.
- An open dossier (the drawer, z-index 30, full height) covers the right 376 px of the timebar (z-index 24): the speeds and
  the scale bar at 1600 x 900.

### D.2 One timeline (recommendation; prototyped at level 2 of `dock-probe.js`)

Two rows, 91.6 px measured at 1600 x 900, 1366 x 768 and 1280 x 720 (the probe's CSS; 3C sets the final numbers):
- **Control row (about 36 px):** ◄│ ◄ Play ► │► and Follow (§A.3); the clock; one caption line (the act, the phase title, the
  live event: the situation's first line, ellipsised); the speeds; the scale bar; "?" (§F).
- **Track (about 50 px), one time axis:** act bands (16 px, the act names at 12.5 px, a band edge at each act's start); phase
  ticks with their labels (16 px, 12.5 px; the current phase whole, never ellipsised); the rail (18 px: hour ticks, event
  markers at their midpoints, the playhead). Every mark is on the same axis as the playhead. The even hours' numerals go
  under the rail or into the tick row where they fit (the probe left them out; 3C places them and measures their overlap).
- **Where the rest goes:** the situation's derived readings (the plateau figure and the centre separation) and the live
  event's `why` go to the top of the Now tab in Study (§B.2); in Watch the caption carries the act, phase and live event, and
  the plateau figure stays where it already is on the map (the map layer's plateau reading, drawn in Watch). The × on the
  situation row goes (nothing to hide); D keeps hiding the Now tab's text.
- **Found while prototyping** (fact): at 1280 px the track is 1,252 px for 840 minutes, so a 45-minute phase has 67 px;
  "The Pratzen" and "Olmutz road" at 12.5 px do not fit and were ellipsised by the probe. At 1600 px (84 px) every label fits.
  Either the narrow phases' labels shorten below about 1,400 px (the current phase is always whole), or the axis gives each
  phase a minimum width (question 7).
- **Heights, against today:** 170.1 → 91.6 px at 1600 x 900 (78.5 px, 8.7% of the screen's height, given back to the map);
  139.1 → 91.6 px at 1366 x 768 and 1280 x 720, where today's act row is already hidden and the new timeline shows the acts.

### D.3 Keyboard and screen reader (recommendation)

- The rail stays the one slider: ← → ±10 min, Shift ±60 (one step: the double step goes), Home and End 04:00 and 18:00,
  PageUp and PageDown the previous and next phase start; `aria-valuenow` (minutes) and `aria-valuetext` ("09:30, The Pratzen,
  The Pratzen Strike") kept current.
- Acts and phases: one tab stop each group, arrow keys within it (a roving `tabindex`), Enter opens the act's first phase or
  the phase; `aria-current` as today.
- Events: one tab stop for the markers, arrow keys between them in time order, Enter selects the event (as a click does) and
  opens its dossier; each marker's accessible name is its clock and title ("12:00, The Russian Guard takes the eagle of the
  4th Line"). `,` and `.` stay.
- Play gets `aria-pressed`; the speeds keep theirs; Follow has `aria-pressed`.
- One polite live region announces a phase change ("09:30. The Pratzen Strike: Soult storms the heights") once, from the
  Now tab's content, whether or not the tab is shown; the clock is not announced every minute.
- `#prog` gets `transform-origin:left` (it grows from the left, as a progress bar does).
- Reduced motion: the phase-label scrolling of today's row goes; nothing in the track animates.

## E. Mode names

### E.1 Every place the names appear (fact)

The state has three axes, with these identifiers and these labels:

| axis | identifier (values) | user-facing labels today | keys |
|---|---|---|---|
| presentation | `presentation`: `study`, `watch`, `map` (`PRESENT`, `app.js:4642-4647`; body `pm-*`) | "Study", "Watch", "Map" (`#viewmode`, `shell.html:14-16`); titles "Everything: panels, dossiers, sources (1)", "Battlefield and timeline only (2)", "Clean battlefield (3)"; legend "1 study 2 watch 3 map only" | 1, 2, 3; H (map ↔ study), U (study ↔ watch) |
| ground | `mode`: `terrain`, `staff`, `hybrid` (`setMode`; body `mode-staff`) | "Terrain", "Staff map", "Hybrid" under "How the ground is drawn" (`shell.html:93-97`; aria-label "Map mode"); "paper map" in the relief row, the legend and the layer's aria-label (`app.js:1047`, `1051`, `2631`) | M cycles terrain → staff → hybrid ("M map mode") |
| layers | `layerOn`, `.layer-btn` | button "Map…", heading "Map", aria-label "Map settings" (`shell.html:77`, `89`, `90`); "What the map shows" (`101`) | C (contours), T (terrain study), F (FX) |

"Map" as a word: the presentation "Map" and its key line "map only"; the popover "Map…"/"Map"/"Map settings"; "M map mode" for
the ground control, whose paper style is labelled "Staff map"; and the generic "the map" (`#maplayer` "The map: formations,
events and places", "Centre the map here" ×3, "Tab to the map", the sources sheet's "one map unit", "How this map represents
the record", "the edge of the map"). "Landscape", "Clean" (except inside a title), "Layers" and "Paper" do not appear as
labels. "Both" is the Plans tab's third button (`shell.html:55`). The tour and chapter texts name no mode.

Code and tests that carry the identifiers (fact): `setPresentation`, `setMode`, `cleanView`, `LIGHT.staff`, body classes
`pm-study/pm-watch/pm-map` and `mode-staff` (the latter generated by `build.py` from `TOKENS.theme.paper`), `.vm-btn[data-vm]`,
`.mode-btn[data-m]`; `css-test.js:22-24, 57-65`; `runtime-test.js` (setMode/setPresentation, `LIGHT.staff`); the self-test's
state names; `tools/visual/cases.js` (case names `staff-paper`, `hybrid-dimmed`, `watch-selected`), `thresholds.js` (keyed by
those names), `contrast.js` (state names; `startsWith("staff")` picks the paper backdrops), `measure.js` (drives any build,
the archived ones included, through `setPresentation` and `setMode` with these values); fourteen `tools/stage2` scripts;
`docs/VISUAL_SPEC.md:1304-1306` quotes the key line.

### E.2 Proposed names (recommendation; question 4)

| axis | today | proposed | why |
|---|---|---|---|
| presentation | Study / Watch / Map | **Study / Watch / Clean** | "Map" is the one clash that names a different thing than the other "Map"s; "Clean battlefield" is already its title |
| ground | Terrain / Staff map / Hybrid | **Landscape / Paper map / Landscape with counters** | "paper map" is already the legend's and the relief row's word; "Terrain" collides with "Terrain study"; hybrid is the landscape with the paper map's counters, not both drawings, and "Both" is taken by the Plans tab |
| layers | Map… / Map / Map settings | **Layers… / Layers / Layers and ground** | the popover holds the layers and the ground control |
| generic | "the map" | unchanged | it names the whole display, as a reader expects |

**Identifiers stay** (recommendation): `terrain`, `staff`, `hybrid`, `map` and the case names are internal. `measure.js`
drives the archived builds through them, and the harness's limits are keyed by case names; renaming them would break the
comparisons with `archive/*.html` for no visible gain. One label table in `app.js` maps each identifier to its label, and the
buttons, the legend's key line, the help overlay (§F) and the aria-labels read it.

### E.3 The text that would change (recommendation)

`shell.html`: the `#viewmode` third button and its title (16); the other two titles, to name the key only (14, 15); the
layers button, heading and aria-label (77, 89, 90); "What the map shows" → "What is drawn" (101); the ground group's
aria-label "Map mode" → "Ground" (94) and its three buttons (95-97); the legend's key line (175-176) is replaced by one
line, "? all keys" (§F); the first-run hint (239) follows the new controls (§A.3). `app.js`: the landscape control line of the
legend (3127, "drag to orbit · scroll to zoom") follows the new controls; the paper map's (3128) is unchanged; the map layer's
aria-label on the landscape (2632) gains its keys once the landscape takes keyboard focus (§A.3). Not changed: "paper map" in
the relief row and the legend (already the proposed name); `SOURCE_NOTE` and every other guarded text (they use "map" only
generically). Tests: only message strings in `css-test.js` ("map mode must hide…") and the self-test's state names change;
no selector, case name or assertion changes.

## F. A "?" help overlay

### F.1 Every shortcut as the code binds it (fact)

Four `keydown` listeners in the product (`app.js:2801`, `2826`, `3654`, `3738`); no `keyup`, `accesskey` or
`aria-keyshortcuts`; no text input anywhere, so the window's handler has no input guard. It does not look at Ctrl, Meta or
Alt, so a modified key does what the bare key does where the browser delivers it (for example Ctrl+C toggles the contours;
derived from the code, not driven).

| key | action | where | documented |
|---|---|---|---|
| any key but Esc, Tab, Shift, \` | closes the first-run card, then does its own action | window (`3739`) | no |
| ← / → | clock −/+10 min; with Shift ±60; stops playback | window (`3740-3741`) | no |
| ← / → on the time rail | clock ±15, **and** the window's ±10 (no `stopPropagation`): measured +25 min, Shift +75 (§G.6) | `#timerail` (`3654-3657`) | no |
| Home, End, PageUp, PageDown, ↑, ↓ on the time rail | nothing | - | - |
| `.` / `,` | next / previous event (by midpoint) | window | no |
| Space | play or pause; `preventDefault` on every target | window (`3760`) | legend: "space play" |
| 1 / 2 / 3 | Study / Watch / Map | window | legend and titles |
| H | Map ↔ Study | window | no |
| U | Study ↔ Watch | window | no |
| M | ground: terrain → staff → hybrid | window | legend: "M map mode" |
| D | the dispatch shown or hidden | window | legend: "D text" |
| C | the contours layer | window | no |
| T | the terrain-study layer | window | no |
| F | post-processing on or off | window | legend: "F FX on/off" |
| Esc | the first of: close the first-run card; close the layers popover; leave the tour; else back to Study with the dispatch, and clear the chapter, the selection and the sources sheet | window (`3745-3754`) | legend "Esc back"; titles on `#sc-clear`, `#restore` |
| \` | developer readout | window | no |
| ← → ↑ ↓, + (=), − (_) | pan and zoom the paper map; no clock change | `#maplayer` itself focused, paper map only (`2801-2809`) | the legend's paper line; the layer's aria-label |
| Enter / Space | select the focused counter or name | a map-layer item (`2826-2828`) | "click or Tab to a counter or a name" |

The legend's key line (`shell.html:175-176`) is the only list, and it is hidden in Watch and Map, below 1080 px of width, below
430 px of height, and while the first-run card is open (`style.css:279`, `286`, `457`, `514`, `550`).

Measured with real key presses (§G.6): Space on the focused "Guided tour" button; ArrowRight on the focused Play button
(+10 min: the window's handler reacts wherever focus is).

### F.2 Design (recommendation)

- **One key table** in `app.js` (key, modifiers, when it applies, action, label, group), read by the one window handler and by
  the overlay, as `COLOUR_KEY` serves the legend and the first-run card: the overlay cannot disagree with the bindings, and a
  self-test checks that every binding has a row and every row a binding.
- **"?"** (`e.key === "?"`) opens it, and so does a "?" button in the tools group (Study) and in the timeline's control row
  (Watch). A dialog: `role="dialog"`, `aria-modal="true"`, focus moved in and kept there, Esc or "?" closes it and returns
  focus. Groups: Time, View and ground, Layers and panels, The map (when it has focus), Pointer (drag, right-drag, wheel,
  double-click, touch), and the developer readout last. The keys are shown with the labels of §E.
- The legend's key line becomes one line: "? all keys".
- **Fixes that belong with it** (each small, each a fact above): the time rail's double step (the rail's handler stops the
  event, and its step becomes the window's ±10 / ±60); Home and End (04:00, 18:00) and PageUp and PageDown (previous and next
  phase start) on the rail, with `aria-valuenow` and `aria-valuetext` (§D.3); the window's handler ignores keys with Ctrl,
  Meta or Alt, and Space and Enter on a focused button or tab (so Space activates the button, as the platform does);
  H and U either documented or retired (question 5); the tablist gets `role="tab"`/`tabpanel` and arrow keys.

## G. The open items carried from Stage 2 (decide or schedule each)

| # | item (where it was recorded) | measured now (fact) | recommendation | when |
|---|---|---|---|---|
| G.1 | **The mode switch is not disabled during playback** (2E, 2F "not done") | A switch into the paper map took 106-195 ms and back 90-187 ms on the 2F build (`perf-2f.json`); switched while playing in this probe (another probe running on the machine), 134-234 ms into it and 119-120 ms back. The frame step of the clock is capped at 120 ms (`app.js:4731`), so a slow frame advances the battle clock by at most 1.2 min at 1x (4.8 min at 4x): playback does not jump. The relief control, 85-169 ms, is disabled while playing (`EXAG_SLOW_MS` 100). | **Keep it enabled.** Changing the view while the battle plays is what a watcher wants, it is paid once per switch, and the clock cannot jump. State the difference from the relief control in the sources sheet's section on the setting. Question 10. | decided in review; no code unless the owner prefers consistency (then 3E disables it as the relief control is disabled) |
| G.2 | **The Watch `#viewmode` at 24% opacity** (2D, 2E) | Its words' rendered contrast over the map in five Watch views: **1.27-2.66:1** (overview-plan 1.43 / 1.61 / 1.43 for Study / Watch / Map; pratzen-low 1.28 / 1.44 / 1.27; close-sokolnitz 2.07 / 2.13 / 3.69). The same method gives 3.19-5.38:1 for the same buttons at full opacity in Study, where `check:contrast`'s composited measure finds them at AA, so the rendered method reads low by up to about 1.4 times; corrected by that, 24% is still below AA in every Watch view (`nav-probe.json`, method in the script). `check:contrast` measures it only in Study, so it has never been held to AA in Watch. | **Move the presentation switch into the timeline's control row in Watch** (the timebar is the one panel Watch keeps), at full opacity and AA, and drop the floating control there; in Study it stays where it is. The Watch views' unobstructed fraction rises by the control's box (175 x 34 px). Add Watch to `check:contrast`'s states for it. | 3C (it lands in the new control row) |
| G.3 | **pratzen-orbit-min draws no map text** (2D, 2E: recorded as the head-obstacle question: "three arrow heads fill most of the view, and labels keep clear of each head's bounding box") | **The recorded cause is not the cause** (the harness's own interaction replayed; `nav-probe.json`, `orbit-min.jpg`). The layer's six obstacles there cover 100% of the screen, and **without the arrow heads and objective markers they still cover 100%**: the live event glyph (`kamensky`) stands 1.8 world units from the eye, and its obstacle disc (the glyph's 2.1-unit radius at that depth) is about 2,370 px in radius; an objective marker's disc is about 3,000 px across. The four heads in front of the eye have boxes of 769 x 212, 159 x 18, 132 x 46 and 124 x 6 px: 12.3% of the screen (their triangles 4.9%); four more are behind the eye and not counted. The screenshot shows the glyph drawn as a huge ring across the view: the event glyph (a 5.4-unit sprite, size-attenuated, `app.js:2134`) and the objective marker are world-scaled symbols, and at the orbit minimum the eye is among them. In the other views the heads' boxes are 0.7-10% of the screen and their triangles about a third of that. | **Give the event glyphs and objective markers a largest size on screen** (and fade them within a few units of the eye), as the counters and labels already keep one size; the layer's discs then shrink with them and labels return. Testing labels against the heads' triangles instead of their boxes (the question as recorded) would not change this view; it would give back the one label each the paper views lose (2E) and stays the owner's choice. Question 11. | 3E, if decided |
| G.4 | **selected-formation's drop limit of 3** (2D: the at-rest count; two place names dropped, two counted off screen at the top edge) | Drops: 2 at every level of the probe (limit 3). With the dispatch docked and the dossier in the rail, the view's unobstructed fraction goes from 19.6% to 70.4% at 1600 x 900 and from 12.5% to 62.9% at 1280 x 720 (§B.3). | **The limit stays 3** (limits are never raised). 3B re-measures it on the docked layout and reports the drops; the "off screen within 7 px of an edge" definition is unchanged. | 3B |
| G.5 | **The paper map's framing in Study** (2E finding 1: 472 x 648 px at 1600 x 900, 17.1 px per km; 152 x 552 px, 5.5 px per km, at 1280 x 720) | Framed scale (px per true km, 1600 x 900 / 1280 x 720): today 17.1 / 5.5; Now tab 25.4 / 19.8; + timeline 28.5 / 21.6; + legend closed 24.2 / 17.6 under the largest-area rule, 28.5 / 21.6 framed to fit the field (§B.3, §B.4). | The docked layout is the remedy (§B), with `MAPCAM` framing in the rectangle that fits the field (§B.4). A new threshold holds the gain (§H). | 3B |
| G.6 | **Keys** (found here; §F.1) | Real key presses: Space with the "Guided tour" button focused starts playback and does not start the tour; ArrowRight with the Play button focused moves the clock +10 min; with the time rail focused ArrowRight +25 min and Shift+ArrowRight +75 min; `aria-valuenow` absent. | The fixes of §F.2. | 3C (the rail), 3E (the rest) |

## H. Test plan

Every threshold below is new or stricter; none is loosened. A threshold that replaces a weaker one says so. Each part keeps
every existing check passing, including `check:data` byte-identical to `archive/stage2c-68ac7721.html` and
`check:chronology` with 0 errors (Stage 3 changes no data); a data task for §C.3 is separate and moves the reference
openly.

**The unobstructed fraction must rise where the docking claims it will** (`thresholds.js` `UNOBSTRUCTED`): after 3B and
again after 3C, each view's baseline at both viewports is raised to the value that part measures (rounded down to 0.1
point), so no later part can give it back. The claims are the probe's values, per view and at both viewports (§B.3; `dock-report.md`): 3B must reach level 1's
values (the Now tab), and in the views with a selection the value of the dossier in the rail (derived: the dossier then
covers only the rail's column, so selected-formation reaches overview-field's level-1 value, 56.3 / 47.2%, and paper-drawer
staff-paper's, 54.2 / 43.7%); 3C must reach level 2's (the timeline: overview-field 63.6 / 52.4%, the paper views 60.7-61.4 /
47.8-48.9%, the Watch views 87.5-89.3 / 82.7-86.5%, first-run 61.6 / 49.3%, first-run-laptop 53.4 / 49.3%), or level 4's if
the legend closes by default (the Study views 70.4 / 62.9%). A part whose measured value falls
short of the probe's by more than 1 point in any listed view explains why in its report.

**3B, docked panels**
- The new baselines above; the dispatch is not a separate panel in Study (its box lies inside the rail's).
- The paper map as entered, Study: at least 25 px per true km at 1600 x 900 and 19 at 1280 x 720 after 3B, and 28 and 21
  after 3C (today 17.1 and 5.5; the probe 25.4 / 19.8 and 28.5 / 21.6, framed to fit the field); the whole field inside the
  free area (unchanged rule, `FRAMED`).
- Drops within `DROP_LIMIT` in every view (unchanged limits); nothing never-dropped missing.
- The legend never over the rail's content, the dossier or the timebar (replaces "never over the dispatch", which becomes
  vacuous once the dispatch is in the rail: stricter, since it covers more panels).
- A phase change is announced once by a polite live region while the Now tab is hidden (self-test).
- `check:contrast`: the Now tab (its derived readings, their tags, the phase text) and the dossier in the rail, in both
  themes; 0 below AA, 0 below the floors.

**3C, one timeline**
- The timebar at most 92 px at 1600 x 900, 1366 x 768 and 1280 x 720 (today 170, 139, 139).
- Every act and phase label at 12 px or more and at AA (decision 16); the current phase's label never ellipsised (self-test,
  every phase at 1280 x 720).
- The slider by real key presses: ← → ±10, Shift ±60, Home, End, PageUp, PageDown; `aria-valuenow` and `aria-valuetext`
  current after each.
- Every event marker reachable by keyboard, its accessible name its clock and title; Enter selects it.
- Two new harness views, the phase-8 Overview in Study and in Watch (as `dock-probe.js` defines them), with every threshold of
  the other views; their unobstructed baselines are 3C's measured values.
- In Watch the plateau reading stays on screen in phases 0-6 (the map layer's), since the timebar no longer carries it.

**3D, the camera**
- At 1x, 4x and 10.33x, through real pointer and wheel events from every vantage: a pan leaves the grabbed ground point
  within 1 px of the pointer during and after the drag; a wheel step leaves the cursor's ground point within 1 px (a step the
  floor shortens included); a double-click centres the ground point in the free rectangle within 2 px; right-drag orbits as
  today. The eye at or above the floor after every step (`CAM.violations` 0), as today's four camera checks, which all stay.
- With `setViewOffset`, the orbit target at the free rectangle's centre within 1 px after a resize and after each panel
  change; picking and hover through the offset (a click on a counter's box selects it; `groundAt` round trip within 1 px).
- The Follow toggle equals `!freeCam` after every camera path of §A.1 (self-test walks them).
- The phase-8 Overview, Study and Watch: no arrow head more than a quarter hidden by a panel or the screen's edge (today 4 of
  5 arrows; with the 90 px timeline and the offset still 2 of 5, wholly under the timebar): the Overview fits the modelled
  ground into the free rectangle (§B.4). Every other preset: its target inside the free rectangle after re-framing.
- `pratzen-orbit-min` still reaches the orbit minimum: its `interact` drives the orbit input (the right button), since a
  left-drag pans after 3D; its "intended depth" measure unchanged.
- The paper map's control checks unchanged (a left-drag still pans there).

**3E, names, help, keys**
- Every key binding has a row in the key table and every row a binding (self-test); the overlay lists every row; opening and
  closing return focus.
- Space and Enter on a focused button activate the button and do not toggle play; keys with Ctrl, Meta or Alt do nothing.
- No user-facing label "Map" for a presentation or "Staff map" for the ground (a static test over `shell.html` and the label
  table); the identifiers unchanged (`css-test.js`, `runtime-test.js`, the harness cases pass as they are).
- `check:contrast`: the overlay; Watch's presentation control at AA wherever it is drawn.

## I. Pull-request plan for 3B onward

| part | files touched | depends on | regression risks | its report must show |
|---|---|---|---|---|
| **3B** docked panels: the Now tab (first, the default tab in Study), the dossier in the rail's column, the legend's default (question 3), tab roles and arrow keys, the phase live region; below 1080 px the dispatch stays a card, as today (question 12) | `shell.html`, `style.css`, `app.js` (`buildUI` tabs, `syncVis`/`no-dispatch`, `paintDrawerBody` and the drawer rules, `mlLegendFit`'s squeeze rule, `ML_PANELS`), `tools/visual/thresholds.js` (the new baselines), `contrast.js` (states) | Part A | the dispatch's text in a 300 px column (the dossier's too, from 376 px); the first-run card and the tour bar, positioned from the rail and `--tb`; the D key and the tour's `hideDispatch`; the 1080 px breakpoint; drops near the old dispatch; `legendOverDispatch` becomes vacuous (replaced, §H) | per view at both viewports: unobstructed before and after; the free rectangle; the paper map's scale as entered at 1600, 1366, 1280; drops; contrast; screenshots of the Now tab and the dossier in the rail |
| **3C** one timeline, and the spine index (no data change) | `shell.html`, `style.css`, `app.js` (the timebar's build and paint, `paintSituation` into the Now tab, `buildActs`, the rail's keys and ARIA, the spine index, the theme and tour marks, `#prog`), `css-test.js` and `runtime-test.js` where they name the rows, `contrast.js` | 3B (the Now tab receives the situation's readings) | every consumer of `--tb` (rail, dispatch card below 1080 px, legend, tour bar, chip, badge, first-run card); the ResizeObserver; the ≤720 px layout; the phase labels at narrow widths; screen-reader announcements; every harness view's unobstructed fraction rises (baselines raised) | heights at 1600 x 900, 1366 x 768, 1280 x 720; the key table verified by real presses; label sizes and contrast; the phase-8 heads; screenshots |
| **3D** the camera: `LANDCAM` (pan by the anchor rule, right-drag orbit, zoom to the cursor, double-click focus, touch, keys on the focused layer), `setViewOffset` centring, the Follow toggle, one tween chain, the vantages' `aria-pressed` | `app.js` (`bindCanvas`, the camera section, `glide`, `startPhaseTransition`, `redrawGround`'s tween reset, the resize handler, the self-test), `shell.html` (Follow), `style.css` (`touch-action`), `tools/visual/harness.js` (`interact`: orbit by the right button), `runtime-test.js` (its THREE stub: `setViewOffset`, `clearViewOffset`) | 3B (the free rectangle it centres in), 3C (Follow sits in the control row) | the drag threshold between a click and a pan; glides that start while the offset eases; reduced motion; the render guard; the harness case that relies on a left-drag orbit; `groundAt` per pointer move (its cost, budget 2 ms a move on the harness machine) | the invariants of §H at 1x, 4x, 10.33x (drift in px per view), the floor, the offset per view, the Follow table, the harness's orbit-minimum case, move timings |
| **3E** names, the "?" overlay, the key table and its fixes; G.3 if decided | `shell.html`, `app.js` (the label table, the key table, the overlay), `style.css`, `css-test.js` (messages only), `contrast.js` (the overlay), `docs/VISUAL_SPEC.md` (the quoted key line, as a dated note) | 3C (the control row holds "?"), 3D (the pointer keys it documents) | habits (Map → Clean, M's labels); any test that matches a label string; the archived builds (identifiers unchanged) | every string changed (was, is); the binding-row self-test; the overlay's contrast and focus handling |
| **data task** the spine alignment (§C.3), only if the owner asks for it | `analysis.js` (`ANALYSIS`, `TOUR`), `data.js` (`PHASES` timeline lines), `app.js` where chapters and stops are applied, `CHANGELOG.md`, the `check:data` reference | 3C (the spine index and its marks make the review concrete) | `sim-test.js`'s tour stop 4 reading; every chapter's clock moves a derived reading shown with it; the tour's camera checks | each change: was, is, the text it follows, why; the suites' recorded values re-derived, never loosened |

Order: 3B, 3C, 3D, 3E, each passing every check on its own. The data task may follow 3C at any time. G.1 needs no code if
the owner agrees; G.2 lands in 3C, G.4 and G.5 in 3B, G.6 in 3C and 3E, G.3 in 3E if decided.

## J. Questions for the owner

Each with the recommendation and what it trades.

1. **What turns "Follow the action" off and on?** Recommendation: a pan, orbit, zoom or double-click turns it off; a vantage,
   a chapter (theme), a tour stop or a phase or act button turns it on, as today; a centring from the dossier or the order of
   battle ("Centre the map here") turns it **off**, which differs from today (a centring clears `freeCam`, so the next phase
   boundary takes the eye away from the formation just chosen). Trade: a visitor who centres on a formation and presses Play
   keeps that view instead of being taken round the battle; they must press Follow to be taken again.
2. **Left-drag pans the landscape; right-drag orbits.** Recommendation: yes, the map convention, and the paper map already
   pans on a left-drag. Trade: today's visitors orbit with a left-drag, and the first-run card says "Drag to turn the view";
   the harness case `pratzen-orbit-min` must switch to the right button. Alternative: keep left-drag orbiting and pan with
   right-drag or Shift-drag (no change of habit, but the landscape and the paper map then disagree).
3. **The legend closed to its "Key" head by default in Study?** Recommendation: yes, remembered while the page is open. Gain:
   6.8 points of unobstructed fraction at 1600 x 900 and 10.5 at 1280 x 720 in Study (§B.3, level 2 → 3), provided `MAPCAM`
   frames to fit (§B.4), else the paper map shrinks by 15-19%. Trade: a new encoding appearing on screen (a plan's dashes, the going classes) is not
   explained until the visitor opens the key; the first-run card and the "?" overlay point to it.
4. **The names of §E.2**: Study / Watch / Clean; Landscape / Paper map / Landscape with counters; Layers. Recommendation: as
   proposed, labels only, identifiers unchanged. Trade: "Clean" is a less familiar word than "Map" for the third
   presentation; "Landscape with counters" is long for a button (alternative: "Counters", or "Landscape +").
5. **The H and U keys** (map ↔ study, study ↔ watch) duplicate 1, 2 and 3 and are documented nowhere. Recommendation: keep
   them and list them in the overlay. Trade: two more keys to learn and to test, against breaking any visitor who found them.
6. **The "cut" chapter's clock** (10:00, phase 4) against its text ("With the plateau taken") and the event `pratzeberg`
   (11:00), and tour stop 7 at 11:20. Recommendation (for the data task): principal moment `pratzeberg`, 11:00, with the stop
   following it. Trade: the chapter no longer opens on the crisis on the Pratzeberg (phase 4's view, the fight still going),
   which is the view it borrows today; it opens when the plateau is taken, as its first sentence says.
7. **The timeline's axis.** Recommendation: proportional to time (the playhead, events, phases and acts on one scale); below
   about 1,400 px the narrow phases' labels shorten and the current phase is always whole. Trade: the busiest hours
   (08:45-12:45, five phases) get 29% of the width and the quiet night 21%; the alternative (each phase a minimum width, the
   axis piecewise linear) reads better but no longer shows how long anything took.
8. **The dossier in the rail's column** (300 px, from 376 px), and the rail's width. Recommendation: the dossier in the rail,
   the rail at 300 px (3B may try 340 px and report). Trade: the dossier's text and tables wrap more; each 40 px of rail costs
   about 2.2 points of unobstructed fraction at 1600 x 900 (derived: 40 x 808 / (1600 x 900)).
9. **The Now tab as Study's default tab** (today: Order of battle). Recommendation: yes; the problem-3 finding ("the default
   rail tab is the order of battle, reference, not story"). Trade: the order of battle is one click further.
10. **The mode switch during playback (G.1).** Recommendation: keep it enabled and say so. Trade: it differs from the relief
    control, which is disabled while playing.
11. **pratzen-orbit-min (G.3): the cause is an event glyph and an objective marker drawn around the eye, not the arrow
    heads.** Recommendation: give event glyphs and objective markers a largest size on screen and fade them near the eye, so
    the layer's obstacles shrink with what is drawn; keep the heads' box test. Trade: a symbol no longer grows without limit
    as the eye nears it (a change to how two symbols are drawn close up, where today they fill the view). Separately, heads
    tested by their triangles would give back one label in each of three paper views, at the cost of the box test the owner
    kept in 2D.
12. **Below 1080 px of width** (the rail starts hidden): Recommendation: the dispatch stays a card there, as today, and
    3B adds a 1024 x 768 view to the harness. Trade: two layouts to keep; the alternative, a Now panel that slides in with
    the rail, hides the narrative on small screens until asked for.
13. **The spine data task (§C.3).** Recommendation: after 3C, themes and tour only (moments and principal moments; the two
    misplaced timeline lines); the one-wording-per-moment change to the phase lines later, if at all. Trade: until then the
    dispatch and the event dossier keep two wordings of 23 moments.
14. **The Watch presentation control (G.2).** Recommendation: in the timeline's control row in Watch, at full opacity. Trade:
    one more control in that row at 1280 px (the caption shortens).
