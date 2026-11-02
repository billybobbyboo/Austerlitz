# v-premise-b: premise verification of eleven major findings (final audit after Stage 8)

Verifier `v-premise-b` (premise lens). Build audited: `austerlitz-command-map.html`, 2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83`
(sources at `43e3e5b`). Nothing in the application, data, thresholds, tests, archive or build was changed. No browser was run: the measurements
are the areas' and were not repeated; what was checked is whether each finding's *expected* behaviour is required, decided or accepted, and
whether its grade, origin and remedy hold. Scripts: `tools/audit-post8/verification/v-premise-b/` (`extract.js` prints the eleven records,
`checks.py` the static checks below, `mk-json.py` writes `v-premise-b.json`).

| finding | verdict | grade after verification | origin |
|---|---|---|---|
| state #0, the open dossier goes stale inside a phase | CONFIRMED | S2 P2 | inherited |
| interaction #0, input during a glide is undone | CONFIRMED (scope: the landscape) | S2 P2 (borderline S3) | inherited |
| visibility #0, counters hidden in Play, Landscape with counters | WEAKENED (origin, scope) | S2 P2 | mixed: 8C/8K gaps on an inherited share |
| visibility #1, event-named formations hidden | WEAKENED | S3 P3, probable problem | inherited (8C for some) |
| visual-landscape #0, figures sunk into the ice | CONFIRMED | S2 P2 (borderline S3 by reach) | inherited |
| a11y #0, 400% zoom / 320 px reflow | CONFIRMED | S2 P2 | inherited |
| visual-maps #0 (V-M1), phone rail markers | DUPLICATE of a11y #3 (keep S2) | S2 P2 | inherited |
| visual-maps #1 (V-M2), no key | WEAKENED (scope) | S2 P2 below 1080 px, 431 px tall or more | inherited |
| visual-maps #2 (V-M3), no compass | WEAKENED | S3 P3, probable problem | inherited |
| visual-maps #3 (V-M4), arrows under "Whose eyes?" | CONFIRMED | S2 P2 | inherited |
| visual-maps #4 (V-M5), no place names on the paper map | WEAKENED | S3 P3, optional improvement | inherited (2E) |

## The static checks (`python3 tools/audit-post8/verification/v-premise-b/checks.py`)

- **Before Stage 8** (`archive/step5c-45f8f662.html`, PR #58): `drawerKey` holds only text phase and moving flag per leaf; `setClock` repaints
  inside a phase only when that key changes. `LANDCAM`'s `free()` stops no tween in `stage4d` and `step5c`. Stage 0's `(max-height:430px)` block
  hides `.dispatch` and `.legend` and gives `#firstrun` no max-height. The legend is hidden in Watch and below 1080 px, with the rose inside it, in
  `stage0`, `stage2c`, `spine` and `stage4d`. `buildArrow`, `rebuildOverlays` and `plateauStrength` read no reading in `step5c`.
- **Audited sources:** `drawerKey` follows places only under a reading (`app.js:7721`) and holds no place for formations; `free()` unchanged
  (`app.js:6479`); `stopTweens` is called only by `redrawGround` (`app.js:2548`); the rose is hidden at 700 px or less (`style.css:637-641`); the
  phone's first-run max-height applies only at 431 px tall or more (`style.css:769`, `829`); `mereLevel` is read in `app.js` only by the 8G
  self-test (`app.js:14096`); the ice is `transparent`, opacity 0.96, `depthWrite:false` (`world.js:1453-1454`).
- **Paper map place names:** 2E's `paper-north-up` dropped 11 of 12 (`docs/stage2-evidence/paper-2e.json`). CI run 41394859313 on this build:
  `staff-paper` 5 of 12, `paper-north-up` 12, `paper-laptop` 12, `paper-close` 1, `paper-drawer` 1, `phone-390-paper` 12; `DROP_LIMIT` 20, 21, 13.
- **Preset cameras near the Satschan mere** (centre world (-36, 85.5)): nearest preset eye 117 units (`data.js:72`), others 120-187.
- **Vantage headings from north** (`GEOREF` ROT 17.42 degrees, `geo.js:26`, `54`): Field 63, Zuran 135, Plateau 21, Allied 85, Overview 17.
- **Motion benchmark window:** `MOTION.VIS` `hybrid-play` [2033, 3388, 4033] (`thresholds.js:308`): 3,388 / 28 = 121 frames = 4,033 ms at 30 fps.

## state #0: the open dossier goes stale inside a phase — CONFIRMED, S2 P2, inherited

- **Mechanism (code, audited commit).** `setClock` repaints only on a phase change or when `drawerKey()` changes (`app.js:3488-3498`). `drawerKey`
  is per leaf `textPhase` plus a moving flag and `readHidden`, plus the reading and the eye (`app.js:7720-7728`). For a place it follows
  `placeNearby` only when `commandView!=="none"` (`app.js:7721`), so under everyone's reading a place's list never repaints inside a phase. No
  timer or frame path repaints the drawer (every `paintDrawer()` site checked). `posRow` writes the card's "Where" and "Midpoint" without a time,
  and the full dossier's "Position at "+`fmtClock(clock)` at painting time (`app.js:7902-7913`). The day-track writes its dot and "the dot where it
  is at HH:MM" the same way (`app.js:2488`, `2498`).
- **Premise.** Required in substance:
  - The card's "Where" and the list headed "Formations nearby now" claim the present without a time.
  - Decision 95 puts the day-track's dot at "the position at the clock" (`docs/STAGE5_SPEC.md:182`, `682`).
  - Decision 251 (8A) already made the drawer follow the reading inside a phase (`app.js:4266`, `7721`). Following the clock is therefore the
    project's own intent, applied only halfway.
  - No decision makes the dossier a snapshot.
- **Origin.** Inherited: PR #58's build has the same key with no place term.
- **Grade.** S2 P2 right: a selection plus Play inside a phase is a common path, and the unstamped rows are wrong for up to a phase's length.
  The stamped rows are honest but stale.
- **Remedy.** Sound. Its focus risk is already guarded: the self-test holds focus across a repaint as the clock moves (`app.js:12015-12020`).
- **Not re-measured:** the counts (86 of 240 place-phases, 49 aggregate-phases).

## interaction #0: input during a glide is undone — CONFIRMED (the landscape), S2 P2, inherited

- **Mechanism.**
  - `glide` sets `applyArc` in the camera slot every frame until it ends (`app.js:6309-6322`).
  - `LANDCAM.free()` sets only `freeCam` and `curVantage` (`app.js:6479`). The pans call it without clearing the slot (`app.js:6483-6498`).
  - Only `redrawGround`'s `stopTweens` (`app.js:2548`) and `eyeEnter` (`app.js:4407`) clear the slot.
- **Premise.** Required:
  - Decision 47: a pan, orbit or zoom turns Follow off (`docs/STAGE3_SPEC.md:105`).
  - §A.3: "off, the eye stays where the visitor put it" (`docs/STAGE3_SPEC.md:249-251`).
  - 7C: "the visitor has taken the camera ... with the visitor's camera kept" (`docs/STAGE7_SPEC.md:640-641`).
- **Scope correction.** The paper map already behaves as required. `MAPCAM.pan`, `zoomAt` and `set` call `stop()`, which bumps `gid` and ends
  the running glide (`app.js:4915-4919`, `4950`, `4953`). The defect is the landscape's (with Landscape with counters and the phone's
  landscape). The remedy's "(and the paper map's MAPCAM moves)" is unnecessary.
- **Origin.** Inherited (`free()` is the same in `stage4d` and `step5c`).
- **Grade.** S2 P2 acceptable: an owner decision is broken on the camera's primary path. It is borderline S3, because it occurs only inside the
  1.5-2.6 s glide window.

## visibility #0: counters hidden during Play in Landscape with counters — WEAKENED (origin and scope), S2 P2

- **Premise.** In scope by the owner's own record:
  - Decision 267 (a) "does not demonstrate that every label-visibility issue in motion is resolved".
  - "still open for the audit: the counters' visibility during extended playback" (`docs/STAGE8_SPEC.md:5483-5488`, `5512-5516`;
    `tools/visual/thresholds.js:261-269`).
  - The benchmark's 4,033 ms is its window (121 frames at 30 fps), as the finding says.
- **But the expected behaviour ("each formation labelled most of the time") conflicts in part with accepted design.**
  - The counter priority is 3 + echelon x 0.1 - strength / 1e7, with no other term (`app.js:5114`, `5126`). This is 2D's order, "counters by
    echelon ... larger strength first" (`docs/STAGE2_SPEC.md:491-493`), accepted under decision 24 (`:58`).
  - Decision 39 accepts drops, with reach by hover and keyboard (`:73`).
  - The area's own counterfactual: a fresh layout starves d'Hautpoul (3.8%), the Russian Guard cavalry (10.4%), the French (20.8%) and Walther
    (26.1%) nearly as much. That share is the inherited priority, which only a priority change with an owner decision could alter.
  - The Stage 8 part is the hold, which turns intermittent visibility into 12-28 s gaps: Miloradovich 47.9% fresh against 17.5%, gap 27.7 s;
    Kellermann 42.1% against 36.6%. 8K's corrected places lengthen it (§22.3: 3,100 to 4,033 ms).
- **Corrected origin.** Mixed: new-regression for the long gaps (8C's MLS hold through Play, lengthened by decision 260 (a)) on an inherited
  starvation share. The scope is Landscape with counters only: the Landscape is drawn 89.4%, its longest gap 1.7 s.
- **Grade.** S2 kept for the owner-listed open item.

## visibility #1: event-named formations hidden — WEAKENED, S3 P3, probable problem

- **Premise.** Not required. Decision 39's never-dropped list is "the selection, the highlighted family and labels of live events"
  (`docs/STAGE2_SPEC.md:73`); formations an event names are not on it. Event labels are `keep:true` (`app.js:5141-5144`); counters carry no event
  term (`app.js:5126`). The expectation extends decision 39, so it needs an owner decision (it would also move `DROP_LIMIT` and `MOTION.VIS`).
- **Scope.** From table C (`visibility/README.md:157-163`):
  - The default Landscape draws the named formations 75.2-80.2% overall, and 60-91% in the worst events. The paper map draws them 96.7%.
  - The shortfall is in Landscape with counters (53.8-66.2%) and on the phone with counters (40.2%).
  - For the Guard cavalries even a fresh layout fails (0-16%): the static priority, inherited.
- **Overlap.** It overlaps visibility #0: the same mechanism, the same formations, and the same family of remedies. #0's remedy cites this
  finding's priority change.
- **Corrected grade.** S3 P3, probable problem; reach by hover and keyboard is kept.

## visual-landscape #0: figures sunk into the frozen Satschan mere — CONFIRMED, S2 P2, inherited

- **Mechanism.**
  - The ice is a flat disc at min(legacy level, lowest shore ground - 0.05) (`world.js:1380-1385`), transparent at 0.96 with `depthWrite:false`
    (`world.js:1453-1454`).
  - `groundY` reads the drawn mesh, with no ice term (`world.js:500-507`).
  - `app.js` reads `mereLevel` only in the 8G self-test. That self-test forbids buildings "on the ice" by exactly the test the figures fail:
    inside the disc and `groundY` below the ice level (`app.js:14096`, `14111`).
  - The phase-9 legs carry `ice:true` (`data.js:465`, `480`, `495`).
  - `probe.json` puts 69% of the Satschan disc's ground below the ice, at most 0.874 units against a 1.415 head top. `shots/x-ice-dok-1640.jpg`
    (viewed) shows the men cut at the waist and thigh.
- **Premise.** Supported:
  - Decision 246 (a) and its acceptance criteria: "no cracking, breaking, open water, snow or figure on the ice", the levels preserved
    (`docs/STAGE8_SPEC.md:194-196`, `1500-1501`).
  - The narrative keeps the mass drowning disputed (`data.js:119`, `749`; `analysis.js:60`). The picture suggests it.
- **Reach.** No preset frames it: the nearest preset's eye is 117 units from the disc's centre. It shows only on a manual zoom to about r 20.
  S2 is kept on historical-integrity grounds, but it is borderline S3 by reach.
- **Remedy.** Seat the blocks at max(`groundY`, the ice level) inside a disc. That is presentation only and keeps the levels decision 246 (a)
  requires. Reuse the 8G "on the ice" test for the blocks. Prefer this to flattening the bed.

## a11y #0: 400% zoom and 320 px reflow — CONFIRMED, S2 P2, inherited

- **Mechanism.**
  - `(max-height:430px)` hides `.dispatch` and `.legend` (`style.css:619-625`).
  - `#firstrun` is anchored to the timeline's top with no max-height or overflow (`style.css:645-648`). The phone's cap applies only at 431 px
    tall or more (`style.css:769`, `829`).
  - The page cannot scroll (`style.css:7`), and below 1080 px the Now tab is hidden (`app.js:8971-8984`).
  - `zoom-320x256-at4-1-first.jpg` (viewed) shows the card's heading and first lines off screen.
  - The Stage 0 build has the same block: inherited.
- **Premise.** WCAG 2.2 SC 1.4.10 (AA). Its exception covers "parts of the content which require two-dimensional layout": maps, and interfaces
  that keep toolbars in view while the content is manipulated. So the caption's width and the timeline's share are arguably exempt. The card's
  text, the phase narrative, the key, Panels and "Accuracy and sources" are lost information or functions, and the failure stands. No owner
  decision covers reflow or zoom.
- **Held landscape.** The finding's remark falls under decision 226 (a), "today's layout kept there" (`docs/STEP6_SPEC.md:124`). But the
  question put to the owner (`:735-741`) never said that layout shows no phase text. Stage 0's reason for it, "the situation strip keeps the
  narrative" (`style.css:615-618`), has been void since 3C: new evidence on that decision's premise.

## visual-maps #0 (V-M1): event markers over the phone's rail — DUPLICATE of a11y #3; keep S2 P2

- **Same defect.** It is the same as a11y #3 (A11Y-04, S3 P3). interaction #2 is its desktop face (the playhead on a marker). The draft report
  already merges them as CL-UX-03.
- **Mechanism read.**
  - Each marker is an 8 px diamond whose `::after` extends 6 px on every side (`style.css:379-382`), with `pointer-events:auto`, in the rail's
    band (`style.css:344`, `794`).
  - The rail scrubs only from its own `pointerdown` (`app.js:7529-7531`).
  - On the centre line each marker is about 16 px wide; there are 25 markers on 374 px.
- **Grade.** The merged item should keep S2 P2:
  - Decision 224 (a): "the axis keeps their ticks and stays a slider" (`docs/STEP6_SPEC.md:122`).
  - Decision 225 (a) took the ten-minute steps off the phone's timeline.
  - Decisions 167 and 228 (a) exempt the markers only from target size.

## visual-maps #1 (V-M2): no symbol key — WEAKENED (scope), S2 P2 where it remains, inherited

- **Facts.** The key is hidden in Watch and Clean (`style.css:414-427`), below 1080 px (`:584`) and at 430 px tall or less (`:624`), all since
  Stage 0.
- **Covered by recorded design or decision:**
  - **Watch:** 2D did not adopt a Key button there, because it would be a new panel in the Watch views, whose unobstructed fraction may not fall
    (`docs/STAGE2_SPEC.md:866-867`).
  - **Watch and Clean** are "Battlefield and timeline only" and "Clean battlefield" (`docs/STAGE3_SPEC.md:620`). Study, with the key, is one
    press away.
  - **430 px tall or less:** decision 226 (a).
  - The cited rule, "one row per encoding on screen" (`docs/STAGE2_SPEC.md:522`), governs the legend's content, not where it is offered.
- **Remaining defect.** Phones held upright, tablets and 1024 px laptops have no key at all, under no decision; the phone reach features omit it
  (`tools/visual/phone-measure.js:85-87`). That leaves the integrity encodings unexplained (the B and C grades, "?", the dashed intended routes).
  S2 P2 there.

## visual-maps #2 (V-M3): no north indicator — WEAKENED, S3 P3, probable problem, inherited

- **No rule requires it.** No CLAUDE.md rule, owner decision or WCAG criterion requires a north indicator. `docs/VISUAL_AUDIT.md:135` only noted
  the rose's opacity, and the paper map is north-up by construction (2E; `thresholds.js:161`).
- **Wider than stated.**
  - The rose is also hidden in Study at 700 px tall or less (`style.css:637-641`), which covers a 1366 x 768 laptop's browser.
  - The default Field vantage faces 63 degrees from north (Zuran 135, Allied 85).
- **Narrower for Clean,** which is chrome-free by definition.
- **Grade.** The finding describes a missing orientation aid, not wrong behaviour: S3. The root is the same as V-M2's (the rose lives in the
  legend's toggle, `shell.html:209-217`), so fix them together.

## visual-maps #3 (V-M4): arrows under "Whose eyes?" — CONFIRMED, S2 P2, inherited

- **Mechanism.**
  - `buildArrow` and `rebuildOverlays` draw every arrow and label of the phase with no reading test (`app.js:3027-3041`, `3101-3116`).
  - `OVERLAYS[4]` binds arrows to the legs of Caffarelli and Suchet (`app.js:67-68`).
  - `plateauStrength` sums every formation on the plateau (`app.js:4061-4071`).
  - The same holds in PR #58's build.
  - The capture (viewed) shows the counters removed under the Allied reading, with the arrows and their labels still drawn.
- **Premise.** Required:
  - D.5 item 1, "not known ... (not drawn)" (`docs/STAGE5_SPEC.md:526-528`), accepted as decision 91 (`:178`).
  - Decisions 170 (b) and 251 (a) closed the same class of leak for the plan links, the selection ring and the centring
    (`docs/ROADMAP.md:147`; `docs/STAGE8_SPEC.md:1550`).
  - The first audit graded the corps counters' leak major (`docs/FINAL_AUDIT.md:364`).
- **Remedy.** The plateau count is a labelled derived map reading, so marking it as everyone's under a reading is enough.

## visual-maps #4 (V-M5): no place names on the paper map as entered — WEAKENED, S3 P3, optional improvement, inherited (2E)

- **The measurement holds:** 12 of 12 names are dropped at 1600 and 1280 px and on the phone (CI run 41394859313).
- **It has been the case since 2E,** when 11 of 12 were dropped.
- **It is within accepted design.** Place labels come near the bottom of 2D's priority order (`docs/STAGE2_SPEC.md:491-493`; `app.js:4998-5001`),
  adopted under decision 24. The drops fall within decision 39's per-view limits of 20 and 21 (`thresholds.js:14-22`).
- **The Overview vantage's paper framing (`staff-paper`) draws 7 of 12.**
- **Grade.** The expectation is a cartographic judgement, as the finding itself says. The owner was never shown the zero-names consequence. The
  finding describes missing reference lettering, not wrong or misleading behaviour, and the names appear on zoom. A change of lettering needs the
  owner and re-baselining.

## Extra issue

- **The compass rose is hidden in Study at 700 px tall or less** (`style.css:637-641`). A 1366 x 768 laptop in Study shows no north indicator.
  This is folded into V-M3's correction and listed so that it is not lost (S3).

## Not done

- No browser run. The areas' numbers were not re-measured:
  - the counts from `state`'s C1-C4;
  - the s14 displacements;
  - the visibility shares and gaps;
  - V-M1's 65.8%;
  - the a11y boxes;
  - the probe's depths.
- Real browser zoom (rather than the emulated viewport and density) and real devices were not tried.
- The text of WCAG 2.2 SC 1.4.10 was applied as known, not fetched again.
