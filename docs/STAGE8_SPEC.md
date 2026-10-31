# Appearance and motion: specification (Stage 8, Part A)

**Status: Part A, the specification, is complete and merged (PR #64, `main` at `d86835e`). The owner decided its questions 239-253 on
24 October 2026 (section 0.3, the decisions with their qualifications, and the points they settle in this text); the implementation follows
the plan of section 10 in eight implementation PRs, 8A to 8H, of which 8A (section 13) and 8B (section 14, added by its own PR, stacked on
8A's) are built in the session that recorded the decisions, both now in `main` (#65; #66 into 8A's branch, brought into `main` by #67), and 8C (section 15; merged into `main`, #68) in its own session, after the owner decided question 254, and 8D (section 16; merged into `main`, #69) in its own, after the owner decided questions 255-258, and 8E (section 17; merged into `main`, #70) in its own, and 8F (section 18; merged into `main`, #71) in its own, and 8G (section 19, written
in 8H; merged into `main`, #72, at `636cc5d`) in its own, and 8H (section 20; the final integration, polish and verification, built on
`claude/sharp-faraday-g2uy8o`, draft PR #73, for review, not merged) in its own. Names (section 0.4): "Stage 8 Part A" is this specification only;
"implementation PR 8A" is the first of the implementation PRs. Nothing below section 12 was written in Part A, and the decisions for 8C-8H
set their direction and constraints only: none of them is implemented or verified until its own PR says so.**

*Part A's own status line, as merged:* written for review on `claude/festive-wozniak-vsbtqr` (draft PR #64). No source file, no data file and
no build changed: `check:baseline` passes on the unchanged build (`austerlitz-command-map.html`, 2,220,714 bytes, md5
`c4793156103b60bb74151c7d13dbdd9d`) and `check:data` finds 131 of 131 declarations identical to `archive/step5c-45f8f662.html`. Written against
`main` at `9eb7abb` (PR #63 merged); line numbers in sections 1-12 refer to that commit; the code is the source of truth. The owner's
questions begin at 239 (section 11); nothing in sections 1-12 is decided by them.

Scope: the owner's notes for later, L1-L5 (`docs/ROADMAP.md`, "Later: the owner's notes of 7 October 2026"), which the roadmap said "would make
a Stage 8, appearance and motion", and the brief of 23 October 2026 that opened it: (1) the glow or filled bases under the troops; (2) counters
and labels that move with the camera; (3) infantry, cavalry and above all artillery, and movement that is not a slide; (4) the ice, the
shorelines and the streams; (5) buildings and structures; and five further opportunities (arrows; label density and hierarchy; woodland;
terrain texture and the horizon; consistency across the three map presentations), with performance as part of the design and the findings
carried from earlier reviews.

**Scope guard (kept).** Nothing is implemented. No source, data or build file changed; no limit of `tools/visual/thresholds.js` moved
(`DROP_LIMIT`, `UNOBSTRUCTED`, `PAPER_MIN_PXKM`, `CTX_DELETES`, `CONF_SHARE` untouched); three.js stays r128 and the product one
self-contained HTML. Every prototype is JavaScript a probe puts into a live page after it has started, undone after its frame (the frame after
it compared with the first in draw calls and triangles: 69 of 72 equal, the other three explained in section 7.1), or dying with its page; none is in the source. No GPU frame time could be
measured here (the container has none): every timing in this document is the layout's CPU time or software WebGL and is said to be.

**How this was established.** Every number comes from a script in `tools/stage8/` (committed; not bundled), run against the build above in
headless Chromium with software WebGL (SwiftShader), as the Stage 0 harness and step 6's probes run it:

| script | section | what it does |
|---|---|---|
| `lib.js`, `views.js` | all | the shared page helpers (tools/stage7's, with JPEG captures, contact sheets and an encoder); the views the evidence is taken in: 12 harness cases by name and 25 views fixed by clock, presentation and camera, each chosen from the data |
| `stills.js [--views] [--protos file:id]` | 1-6 | direct captures of the build in each view, and of the same view with a prototype put into the live scene; each frame's draw calls, triangles and map-layer counts beside it; the prototype undone and the frame after it checked |
| `density.js` | 1, 7 | what each view is made of: the share of the free rectangle each class of drawing covers (each hidden in turn and the frames compared), the arrows' widths in pixels, a census of the map layer's labels |
| `label-motion.js [--stab]` | 3 | the map layer driven through pans, zooms, orbits, glides and Play on both map types, 30 frames a second, every item's place read after every frame; jumps, pops, level-of-detail switches, flicker, overlaps and the pass's time; six stabilisers prototyped in the page |
| `record.js --clip` | 3-5 | frame-stepped recordings: the clock advanced by the play speed's share of a second per frame and set as Play sets it, each frame drawn by the app and captured, encoded at 10 frames a second (MP4 and a small GIF) |
| `kit-census.js` | 4, 8 | triangles per man, horse, gun and house in the build's kit and the prototypes', and the frame with each prototype in place |
| `carried.js` | 9 | the three carried findings, by real clicks, keys and taps |
| `gait-check.js`, `legs.js` | 4.3 | the gait's rule checked in the page; every leg of the movement model with its duration and speed (no page) |
| `sheets.py` | all | the comparison sheets: the build and its prototypes side by side, from the captures |
| `pixdiff.py` | 4-6 | how much of a frame each prototype changes: the pixels of the kept captures whose grey level differs by more than 40 of 255 |
| `label-far.js` | 7.2 | which drawn items of the map layer stand beyond 1.5 times the eye's distance to its target (the hierarchy by distance's reach) |
| `stream-vis.js` | 5, 9.5 | how much of the streams, their banks and the roads the build draws: the ribbons painted and their pixels counted, as built, double-sided, and with no depth test |
| `toast.js` | 9.6 | the phase's toast against the view switch, after a real key on the time rail, in Study and Watch at three sizes |
| `clip-motion.py` | 3, 5.3 | what moves in the kept recordings: each frame against its clip's first and the variants against each other, counted on the committed clips (no page) |
| `protos/ground.js`, `labels.js`, `figures.js`, `water.js`, `buildings.js`, `arrows.js` | 2-7 | the prototypes, each an in-page module registering `window.__p8[id]` with `install` and `uninstall` |

Their outputs, screenshots and recordings are in `docs/stage8-evidence/` (its `README.md` lists every file).

**The photographs.** The brief names nine photographs of the current map as references for this session. They did not reach the session (no
attachment, nothing in its uploads folder); this document therefore rests on direct captures of the build instead, which the brief asked for
anyway "for exact comparisons", and makes no statement about what the photographs show. If the owner sends them again, section 1's
assessment can be checked against them (section 12.2).

## In short

- **What the build draws (section 1).** At a distance the battle reads as washes of blue and amber, not troops: the confidence marks are
  what is seen of a formation there. Close up, symbology outweighs the troops: arrow ribbons of fixed world width drawn over everything,
  glyph rings well over 100 px across (the cap is 192), the C marks spread over slopes, large plain standards. The guns are the weakest
  drawing (tubes on solid discs, brown
  cubes on the march, switched in one frame). Nothing moves within a formation: blocks slide. The meres are flat plates; the streams'
  and the roads' ribbons are not drawn at all (culled); every house is the same box turned at random; of the landmarks the narrative names,
  only the
  Sokolnitz castle is drawn. The light, the
  fog, the ground's cover, the readings, the interface and the paper map hold up and are kept.
- **L1, the glow (section 2; question 239).** Five alternatives in seven views: recommended, a thin cased outline of each formation's
  footprint in its side's colour, the selection in the accent, and "Position confidence" an optional outline layer, off by default on the
  landscape (supersedes decision 85 there; restyles 87 and 107; keeps 86, 88 and 91: a reported-only formation's C zone and the
  eye level's own side stay as they are; 1x unchanged).
- **L2, labels in motion (section 3; question 240).** Measured over 16 motions and 40,715 item-frames: the build makes 4,003 jumps (an item
  taking another place: 1,549 of them counters) and 165 level-of-detail switches, one pan from the Field vantage swaps 23 counters at once (its
  distance 3% inside the corps switch). Six stabilisers prototyped; recommended, a held layout while the view moves (beside its own anchor or
  faded out), a level-of-detail band released at rest, and fades: 249 jumps (counters 19), no overlap among live items; a view reached
  without motion laid out exactly as today (by construction; 8C's checks would hold it).
- **L3, troops and motion (section 4; questions 242-245).** A richer kit prototyped on three formations: the guns change most and read as
  field pieces (spoked wheels, trails, their limbers and teams behind them); infantry and cavalry change little at the visitor's distances;
  on every formation the prototype's kit would add an estimated 34-52% to the frame, so it is proposed only with culling and a lighter kit
  drawn near the eye. A gait locked to the clock (its phase a function of the modelled track: still when paused, the same when scrubbed;
  faded out between 3.2 and 4.8 cycles a second, a formation's parts together; none under reduced motion, and built, none below 1 km/h), and
  why: at ½x a drawn formation already moves 2.6-5 times as fast for its size as a man walks, at 4x 20-40 times. Part of the floating is the
  model's: 52 of its 147 legs drift at under 1 km/h for two hours or more, because a move no source dates is spread over its interval
  (decision 45); built, the gait leaves them still (the prototype does not yet: it swings Nansouty's drift). The artillery's sources
  (Gassendi 1809, IV Corps' order of 25 October 1805, Teuber, Nilus) give the wheels' proportion, the coffret, one driver a vehicle (as an
  authorisation) and the limbers' place, and no time for limbering. Facings: kept out (decision 104), since only the French classes have
  them sourced.
- **L4, water (section 5; questions 246, 253).** The streams are not drawn at all today (their ribbons, and the roads', face away from the
  eye and are culled: section 9.5); drawn, they should be darker and still. The meres stay ice, varied in material and light. The day was
  mild in Prague (4.9-10.6 °C; the Klementinum series), the sources disagree on the ice's strength, and nothing read says the streams
  were iced: no stream ice, and no flow, which would also keep an idle page drawing about 11 frames a second.
- **L5, buildings (section 6; question 248).** The villages re-laid on the 1825-1826 cadastre's pattern (dwellings end-on to the street,
  barns across the yards); the landmarks the sources support (Sokolnitz castle's quadrangle, the fences of Telnitz and Sokolnitz) after an
  evidence
  step, and the two chapels once their state on the day is read (St Anthony's roof is not found; the Santon's was destroyed during the
  battle); the pheasantry's wall, dated later, is not proposed.
- **Further (section 7; questions 241, 247).** The arrows capped at 16 px on screen and hidden by the ground alone; the glyphs at 64 px;
  airier woods; a detail layer near the eye.
- **Performance (section 8; questions 249, 250).** Budgets stated before anything is built (the phone's heavy views at most 1.62 million
  triangles; an integrated-GPU run before any PR adds more than 10%); block culling first; the gait free of calls and triangles; the
  effects-off question as a bracketed run.
- **Carried findings, and two found here (section 9; questions 251, 253).** All three carried findings are still present: under a reading,
  "Centre the map here" goes to the true position of a formation the reading does not know; the dossier's sources are at its end (6,000 px
  down); a timeline tip stays after its element is activated (an extra Esc; on a phone it stays on the screen). Of the audit's unassigned
  findings, A-5, S-5, S-7, A-6, G-2, P-2 and T-7 are still present and P-3 partly. Found here (9.5): the landscape draws none of its road
  or stream ribbons, and the self-test's checks of them, being geometric, cannot see it; and (9.6) in Study the one phase message's first
  words stand under the view switch.
- **The plan (section 10; question 252):** PRs 8A-8H; nothing implemented here.

## 0. What binds Stage 8

### 0.1 The decisions Stage 8 touches (quoted from their records)

Each proposal below names the decisions it keeps, extends or would supersede; a supersession is never made by this document, only put to the
owner (section 11).

| # | decision (where recorded) | what it means for Stage 8 |
|---|---|---|
| 1, 4, 15 | side symbology "French blue; Allied amber"; counters' confidence "no dashed or dotted frames"; "Dashes mean 'planned or intended' only" (`docs/VISUAL_SPEC.md`) | a new ground cue or confidence drawing may not be dashed and may not add a hue; the side's two tokens stay the side's only colours |
| 6, 14, 26, 36, 106 | the miniature scale "deliberate"; named symbol scales (figures and standards about 45-70 times life, buildings and trees about 10-15 times); the standard's ratio 1.6, provisional, else sourced per nation (`docs/VISUAL_SPEC.md`; `docs/STAGE2_SPEC.md`; `docs/STAGE6_SPEC.md` §0.4) | every proposal keeps the scales; a richer figure keeps its height to the hat's top (the ratio's measure, `figureTop`); motion must be explained against this scale (section 4.3) |
| 9 | "In the landscape view, which draws no counters, a small side-coloured mark (blue or amber) sits beside each name" (`docs/VISUAL_SPEC.md`) | the names already carry side and the grade's badge where they are drawn; a ground cue is for where names are not (distance ranges, Clean, the eye level) |
| 24, 38, 39 | one DOM/SVG map layer, priority placement, panels as obstacles, leader lines, occlusion; "per view, drops may not exceed the number of labels today's canvas pass hides in that view; never dropped: the selection, the highlighted family and labels of live events; a dropped formation stays reachable by hovering its position and from the keyboard" (39, `docs/STAGE2_SPEC.md`) | a stabilised layout keeps every one of these; the drop limits are measured at rest and keep holding there (section 3.5) |
| 34 | "at 1x formations are drawn as their modelled footprints (W0, D0) in the side colour" (`docs/STAGE2_SPEC.md`) | at 1x the footprint is the formation: no L1 alternative touches it |
| 47 | Follow: a pan, orbit, zoom or double-click turns it off (`docs/STAGE3_SPEC.md`) | a stabilised layout reads the motion from the same state |
| 62, 199, 214 | drop limits moved only on the owner's word: 62 raised two by one when the view offset needed it (selected-formation 3 to 4, narrow-1024 5 to 6), 199 and 214 narrow-1024's again (`docs/STAGE3_SPEC.md` §0.3; Stage 3's own reading of 39: "the drop limits only tighten") | no Stage 8 PR moves a limit without the owner's word; a new motion measure is added beside them, not instead |
| 57 | "Event glyphs and objective markers get a largest size on screen and fade near the eye" (3E; `SYM_MAX_PX` 192, `app.js:3193`) | the cap's value is a design value; section 7.6 proposes a smaller one |
| 74, 75, 83 | Play at ½x by default; the dwell; the draw-on of derived arrows (`docs/STAGE4_SPEC.md`) | the gait (section 4.3) is set against ½x, the speed a visitor meets; it never animates during a dwell's hold (the clock stands) |
| 77, 79, 84 | smoke by phase status and naming events; "the landscape's [colours] in four named tables"; the figures' black floor `#2E2B27`; the meres ice with shore ice: "No cracking, breaking or figures in the water ... no snow" (`docs/STAGE4_SPEC.md` §F.1, as 4E built it) | the water prototypes stay ice, change material and light only; every new colour lands in a named table; no figure colour below the floor |
| 27 | "Meres: no outline change without a georeferenced source" (`docs/STAGE2_SPEC.md`) | the ice's outline, the shore's line and the banks stay where they are |
| 85, 86, 87, 88 | spatial confidence "on by default, at every factor and on the paper map"; the C zone's radius the frontage; "grade A ... drawn as the crisp footprint (every formation on the field has a ground mark)"; between anchors the weaker grade (`docs/STAGE5_SPEC.md` §0.4) | L1's recommended option would supersede 85 on the landscape (the layer on by default) and restyle 87 (a mark under every formation kept, drawn as its edge); 86 and 88 stay (the extents and the grade wherever the layer is shown) |
| 91 | "Whose eyes?": "reported only" drawn "at the C encoding of §A (a diffuse zone, no figures)"; at the eye level the observer's own side as its ground marks (`docs/STAGE5_SPEC.md` §D.5 item 1; `app.js:4888`, `4897-4905`) | these marks are the knowledge reading's drawing, not the confidence layer: the toggle never turned them off (`graded` holds them), and L1's options must say what draws them (question 239) |
| 97, 100, 102, 103, 104, 109 | identity by symbology, not coats ("the ground marks" named among the side's carriers); each drawn unit a class by its sourced share; drawn colours from `KIT`; "one low-poly shape per sourced class" for headgear; "No regimental facings or lace drawn; class-level features only where sourced and large (a cuirass)"; "Horses one brown ... gun carriages one colour unless each army's is sourced" (`docs/STAGE6_SPEC.md` §0.4) | a richer kit keeps every claim as drawn; facings (section 4.6) would extend 104; a gun model may not colour an army's carriage the table does not settle |
| 107 | "With 'Position confidence' off, a plain crisp footprint in the side's colour stays under every formation drawn as figures, in Study, Watch and Clean" (`docs/STAGE6_SPEC.md` §0.4) | L1's recommended outline (question 239 (b)) restyles 107's footprint as its edge; the chevron (c) would supersede it |
| 133, 140 | three.js r128 from cdnjs with its integrity; the self-test kept in the file (`docs/FINAL_AUDIT.md` §6.0) | no new library; any new check is a self-test or harness check of the shipped file |
| 138, 219-221, 235, 236 | figure level of detail retired (decision 235: "Decide 138 from these", a desktop with an RTX 4070); culling "only as part of a built 138" (221); under `lowTier` density 1.0 and no shadow (decision 236's verdict, `docs/STEP6_SPEC.md` §15) | a richer kit is a new workload: section 8 reopens level of detail and culling as questions for it, keeps `lowTier`'s gains, and states budgets before anything is built |

### 0.2 What must not change

`docs/VISUAL_AUDIT.md`'s list holds: GEOREF the only scale authority; the leaf rule; the claim, grade and layer taxonomy and "derived"
labelling; the dossier's structure; the narrative voice; "formation modelling (battalions, column-to-line, skirmishers, limbering, dipping
standards)"; continuous clock-driven positions and the march-rate audit; the Command view, Plans, plateau and centre-separation readings; the
restrained dark interface with serif narrative; reduced-motion support, ARIA states, the keyboard time slider; the single-file build on three.js
r128; "bare winter trees, frost on north-facing slopes, crop strips". Every proposal below was checked against it; none moves a formation,
an anchor, a time, a strength, a village or a mere.

### 0.3 Owner decisions 239-253 (24 October 2026)

After Part A was merged (PR #64) the owner decided every question of section 11, on 24 October 2026, each with qualifications that are part of
the decision. They are recorded here in the owner's words. Where a decision settles, extends or corrects something this specification says,
the point is listed after them (0.3.1) and the section concerned carries a note. Decisions 239, 241, 251 and 253 are applied in implementation
PRs 8A and 8B (sections 13 and 14); 252 governs both. The others set the direction and the constraints of implementation PRs 8C-8H: **none of
those is implemented or verified by 8A or 8B.**

- **239, the ground under the troops: option (b).** "Use thin, cased, side-coloured footprint outlines under formations drawn as figures,
  with the selected formation distinguished by the selection accent. Remove the broad filled side-coloured ground washes from the default
  perspective views. Position confidence becomes optional and off by default in both perspective presentations, using the specified grade
  extents as outlines when enabled. Preserve the specified exceptions: reported-only formations' C zones under the headquarters readings, the
  eye-level observer's own-side marks, and the 1x footprint treatment. Resolve the paper-map inconsistency in the specification explicitly:
  retain the paper map's existing confidence treatment, including its filled areas and default-on setting. Section 7.5 must not silently
  authorise converting those areas to outlines. Keep side identity, confidence grades, selection and reported positions distinguishable.
  Prevent outlines from disappearing beneath slopes or appearing unintentionally dashed." *Applied in 8B.*
- **240, label stability and hierarchy: option (a).** "For implementation PR 8C, use anchor2 with the distance band and fades, plus the
  proposed smaller step for distant labels. Preserve the specified priority, focus, keyboard access, never-dropped items and reduced-motion
  behaviour. I accept the measured trade-off of fewer jumps and more temporary disappearances as the starting design. Acceptance must also
  include whether a visitor can follow a formation through camera movement and playback. Report jumps, appearances/disappearances, flicker and
  visibility separately. A lower jump count alone does not establish a better result. Do not implement 8C during this session." *Applied in
  8C (section 15).*
- **241, arrows and event glyphs: option (a).** "Cap movement-arrow casing width at 16 screen pixels in the perspective presentations, reduce
  the fill to 0.62 of its existing opacity, and cap event glyphs at 64 pixels. Test arrows against the drawn terrain alone, preserving their
  annotation role over buildings and vegetation. Keep lines of battle, boundaries and halt bars at their existing widths and opacity, with the
  specified terrain occlusion. Preserve paths, head forms, side colours, planned-versus-executed distinctions, labels and clock-driven draw-on.
  Keep paper-map arrow widths unchanged. The width cap must respond correctly as the camera moves. Measure the cost of any extra terrain depth
  pass." *Applied in 8B.*
- **242, troop models: option (a), subject to the specified budgets.** "For 8E, improve infantry, horses and riders using the prototype
  direction and existing appearance claims. Preserve miniature scale and sourced colours, headgear and equipment. Complete rendering
  preparation first. Optimise the models and use richer detail only where it is visible. Do not apply the expensive prototype unchanged across
  the entire battlefield." *Applied in 8E (section 17); merged.*
- **243, artillery: option (a), with explicit source boundaries.** "Use the generic field-piece improvements: spoked wheels, a recognisable
  trail and carriage, improved limbers, appropriate ammunition boxes, and teams behind deployed guns. Retain the single carriage colour and
  current instantaneous deployed/limbered switch. Register and grade each historical claim before using it. Do not generalise IV Corps'
  October authorisation for driver numbers into a demonstrated rule for the Guard, Austrian or Russian artillery. Specify where each source
  applies. Elsewhere use an explicitly identified generic or inferred convention pending stronger evidence." *Applied in 8E with its data
  task (section 17); merged. Unchanged in 8F.*
- **244, gait: option (a).** "Use a gait whose phase follows the modelled track and clock, with amplitude controlled by the specified
  playback-speed thresholds. No swing when halted, below the proposed 1 km/h cutoff, or under reduced motion. A paused clock must hold the
  pose still. Fade a formation's parts together and ease speed-related amplitude changes. Verify reproducibility when scrubbing, terrain
  contact, moving bounds and shadow behaviour. Describe the animation honestly as a visual convention for symbolic figures under compressed
  time; do not claim physically matched footsteps." *The hooks in 8D (section 16); applied in 8E (section 17); merged; the pause and the
  contact corrected in 8F's prerequisites (sections 18.1, 18.2), for review.*
- **245, uniform facings: option (a).** "Keep decision 104. Do not add facings in this implementation. Reconsider them after the main
  troop-model work can be judged." *Nothing built in 8E (section 17.4) or 8F; to be reconsidered now that the troops can be judged (section 17.16).*
- **246, water: option (a).** "For 8F, improve the meres' ice through material, lighting and restrained tonal variation, with softer shore
  transitions. Keep streams still, darker and less blue. No added stream ice, animated flow, cracks, holes, snow or figures on the ice.
  Preserve geographic outlines and levels. Tune the bright ice margins so they integrate with the surrounding terrain." *Applied in 8F
  (section 18.3), for review.*
- **247, woodland and near terrain: option (a).** "For 8F, use airier deciduous silhouettes, restrained variation and a finer near-ground
  detail layer. Preserve woodland boundaries, tree counts, the existing conifer shares pending evidence, land-cover classes, frost and crop
  strips. Hold tree geometry within the specified budget and measure transparency costs if introduced." *Applied in 8F (sections 18.4
  and 18.5), for review; no transparency introduced (the alpha-tested prototype measured, not built).*
- **248, buildings and landmarks: option (a), with the evidence step first.** "For 8G, develop the villages around the cadastral
  street-and-yard pattern and add supported landmarks after research and a documented data task. Keep later maps' relevance to 1805
  explicitly qualified. Unestablished roofing and other forms must remain labelled design conventions. Preserve village locations, footprints
  and symbolic scale. Do not replace the existing church silhouettes with the prototype's weaker generic towers without adequate evidence and
  a convincing visual result. Any proposed geographic correction must be identified and reviewed as such." *Applied in 8G (section 19,
  written in 8H; merged, #72); its acceptance discrepancies corrected or put to the owner in 8H (section 20.3), its proposed geographic
  corrections reviewed in 8H (section 20.6), none made.*
- **249, culling: option (a).** "For 8D, cull figure blocks using correct per-block bounds before adding richer models. Account for changing
  formation shape, terrain seating, animation and shadow visibility. Verify that visible figures and their shadows do not disappear
  incorrectly." *Applied in 8D (section 16).*
- **250, performance budgets and device runs: option (b).** "Adopt §8.3's budgets and the bracketed effects-on/effects-off diagnostic.
  Preserve decision 236's lowTier density and shadow settings. Treat geometry counts as budgets, not proof of frame-rate performance. Retain
  the integrated-GPU measurement condition before a qualifying increase. Use repeated, comparable device runs and identify the exact build
  tested. Correct the bracket protocol if necessary so every evaluated sample actually has the neighbouring comparison samples required by its
  rule. If my hardware measurements are unavailable, complete the code, reproducible evidence and automated checks, then clearly identify
  device acceptance as pending." *Every Stage 8 PR's records; the bracket protocol corrected in section 8.5 (0.3.1, item 10).*
- **251, carried findings: option (a), expanded to cover the audit gaps.** "Fix the camera-centering, source-access and timeline-tooltip
  issues, with these additional requirements: Under a headquarters reading, unknown enemy formations must not reveal their true current
  location through camera centring, compact-card position text, full-dossier position text or aggregate midpoints. Apply the reading
  consistently to those outputs, using readPos/aggReading or the appropriate equivalent. General historical reference content can remain
  available. Check related location-derived rows for the same class of disclosure. Bring source access into the initially visible dossier
  area. Display the existing claim qualifications and source-specific positions in disputes, including the relevant claim note and by.side
  information currently omitted by dossierClaims/claimsIndex. Use the recorded content; do not invent explanations or alter historical claims
  merely to simplify the interface. Dismiss timeline tooltips on activation, prevent touch tooltips from lingering over the timeline, and
  preserve keyboard and hover accessibility. Test mixed pointer/focus interactions as well as Enter, Escape and touch. Add meaningful
  regression checks for each corrected behaviour." *Applied in 8A.*
- **252, implementation order: option (a).** "Keep the planned order of implementation PRs 8A–8H. Clearly distinguish the completed
  specification from implementation PR 8A. This session covers implementation PRs 8A and 8B only. Keep them separately reviewable. If
  prerequisites have not been merged, a clearly documented stacked draft PR is acceptable. Do not merge either PR automatically."
- **253, road and stream visibility: option (b).** "Correct ribbon winding so roads, streams and banks render from above. Review and set their
  symbolic widths before accepting the visual result. Do not simply expose the existing wide ribbons and declare the work finished. Compare
  narrower alternatives in matching landscape and paper-map views, including close views through settlements and distant overviews. Keep
  centre lines and geography unchanged. Widths chosen for readability must be documented as display conventions, not claimed as measured
  historical widths. Add a rendered-visibility check capable of failing when a ribbon is submitted but invisible. Retain the terrain-draping
  checks. Measure the added pixel-rendering cost as well as draw calls and triangles." *Applied in 8A.*

#### 0.3.1 What the decisions settle in this text (reconciled)

1. **The paper map's confidence marks (239 against section 7.5).** Section 7.5 recommended "the same outline language for the side cue and the
   grade's extents in all three" presentations. Decision 239 keeps the paper map's treatment as it is: its marks filled, B and C capped on
   screen, "Position confidence" on by default there. The outline language applies to the two perspective presentations only; section 7.5
   carries a note saying so, and it authorises nothing on the paper map.
2. **Which presentations the default covers (239 against section 2.4).** Section 2.4 said "off by default on the landscape". The owner names
   both perspective presentations, Landscape and Landscape with counters. The layer's setting is therefore kept apart for the perspective
   presentations (off at first) and the paper map (on at first); the one "Position confidence" control acts on the presentation shown.
3. **The decisions 239 touches.** Decision 85 ("on by default") is superseded in the two perspective presentations and kept on the paper map;
   87 and 107 are restyled (every formation drawn as figures keeps a ground cue: its footprint drawn as its cased outline); 86 and 88 are kept
   (the extents and the weaker grade between anchors, drawn as outlines when the layer is on); 91 is kept (a reported-only formation's C zone
   and the eye level's own side as filled marks, as today, whatever the layer); 34 is kept (at 1x the footprint by its grade whatever the
   layer, as it is drawn today with the layer on).
4. **What 241's cap and opacity act on.** Part A's prototypes (section 7.1) wrapped every draped ribbon; decision 241 limits the cap and the
   opacity to the movement arrows (the derived arrows' drawn-on parts among them, which are movement arrows), and keeps the lines of battle,
   the boundaries and the halt bars at their widths and opacity; all of them take the ground-only occlusion. On the paper map nothing changes
   (no cap; a plan over flat ground, where the ground hides nothing).
5. **241's "fill".** Question 241 (a) and the decision speak of the fill's opacity; the prototype `a-soft` multiplied fills and casings alike.
   8B applies 0.62 to the fill as decided and states, with its measures, how the casing is drawn so that the side's colour is preserved
   (section 14).
6. **241 and decision 57.** Decision 57's largest size on screen, 192 px, is superseded by 64 px. Decision 57 gave the event glyphs and the
   objective markers one cap, and Part A's `a-calm` capped both; 8B keeps them together at 64 px (the markers' hit areas and the timeline's
   markers, decision 167, unchanged).
7. **243's drivers.** Section 4.7 (a) proposed "one driver a vehicle (two for a six-horse team: IV Corps' order, an authorisation)" for every
   battery. Decision 243 limits the order to where it is shown to apply (IV Corps' own batteries, as an authorisation of 25 October); for the
   Guard's, the Austrian and the Russian artillery 8E draws an explicitly identified generic or inferred convention, each registered with its
   grade and scope before it is drawn.
8. **244's honesty clause.** Section 4.3 already describes the stride as a design value that "says 'marching', it does not measure the ground";
   decision 244 makes that the description every record and the legend use: a visual convention for symbolic figures under compressed time,
   never physically matched footsteps.
9. **248's churches.** Section 6.4 proposed "the churches turned east-west (generic)" with the villages. Decision 248 keeps the existing church
   silhouettes unless adequate evidence and a convincing visual result justify replacing them; the Pratzen church's place on its hill (section
   6.2) is a geographic correction and is identified and reviewed as such if proposed.
10. **250's bracket protocol (section 8.5), corrected.** In the second order, B A B A B A B, the first and last B have one neighbouring A each,
    so section 8.5's rule ("every B's median interval exceeds both its neighbouring As'") cannot be evaluated for them. Corrected: in each
    order only the blocks with a block of the other kind on both sides are evaluated: in A B A B A B A the three Bs, each of which must be
    slower than both neighbouring As; in B A B A B A B the three As, each of which must be faster than both neighbouring Bs. Effects off is
    slower only if every evaluated comparison says so in both runs and both orders. Section 8.5 carries the corrected rule.
11. **251's scope.** Section 9.1 proposed the centring and the order of battle's rows; decision 251 extends the reading to the compact card's
    and the full dossier's position text, the aggregates' midpoints and every related location-derived row (8A reviews each and lists them,
    section 13). Section 9.2 proposed a line at the dossier's head with a link; the decision asks for source access in the initially visible
    area. Showing the claims' notes and the disputes' sides in the sources sheet is new: Part A did not propose it.
12. **253's widths.** Decision 253 chooses (b) over the recommended (a): the widths are reviewed and set before the result is accepted,
    against narrower alternatives in matching views, and documented as display conventions.
13. **240's acceptance (for 8C).** Section 3.5's limits stand as the starting design; 8C adds a measure of whether a visitor can follow a
    formation through camera movement and playback, and reports jumps, appearances and disappearances, flicker and visibility separately.
14. **252, the PRs of this session.** 8A is a draft PR on `main`; 8B is a draft PR stacked on 8A's branch until 8A is merged; neither is
    merged by the session that builds it.

**Decision 254 (25 October 2026, with the brief for 8C):** "My answer to question 254 is option (a): retain CONF_SHARE.land at 7%. Record that
decision and the metric's changed meaning. Keep the paper-map limit unchanged." *Recorded in `tools/visual/thresholds.js` (section 15.1).* The
same brief asked 8C to treat section 3.5's limits as "the specified starting targets, not permission to change limits automatically" (section
15.4; question 257).

### 0.4 The names: Stage 8 Part A, and the implementation PRs

- **Stage 8 Part A** is this specification: the measurements, prototypes, plan and questions of sections 1-12, merged as PR #64 on 23 October
  2026. It is complete, and it implemented nothing.
- **Implementation PRs 8A to 8H** are the eight pull requests of section 10's plan. They are always written "implementation PR 8A" (or "8A"
  under a heading that says so), never "Part 8A"; Part A is never abbreviated "8A". Implementation PR 8A is the first of them (section 13),
  not Part A.

## 1. What the build draws today, and what a visitor sees

### 1.1 The captures

30 views were captured from the unchanged build at 1600 x 900 (`tools/stage8/stills.js`; `docs/stage8-evidence/views/<view>-base.jpg`, the
counts beside each in `views-base.json`): the harness's own cases by name (the Field vantage, the Overview, the low Pratzen view at 1x, 4x
and 10.33x, close on Sokolnitz, Landscape with counters, the paper map as entered and close, phase 8's Overview, the eye level, a selection)
and close views chosen from the data: Saint-Hilaire's division climbing at 09:20, Nansouty's cuirassiers at 10:55, the guns on the heights
unlimbered at 13:20 and hitched up at 14:10, the Satschan mere at 15:00, the Goldbach at 08:20, Telnitz, Sokolnitz, Pratzen, the pheasantry
wood, the wood above the Satschan mere at 14:00 (`ice-sun`) and a low view east at noon. Every 4x landscape view here is 2.47-2.52 million triangles in 701-832 draw calls (step 6's census found 2.48-2.53
million and 740-857 in its own views, `docs/STEP6_SPEC.md` §3.1: nothing is culled); 1x 0.23 million, the paper map 0.20-0.24, the eye level 0.49.

### 1.2 What each picture is made of

`tools/stage8/density.js` hides one class of drawing at a time and counts the pixels of the free rectangle (outside every panel) that change by
more than 8 of 255, a class's share of the picture as drawn (overlaps counted for each class), and the median contrast of the changed pixels
against what lies under them (the WCAG luminance ratio; 3:1 is the floor for a non-text symbol). `density.json`, `density-low.json`:

| view | figures | ground marks | arrows and the overlays' lines | standards | event glyphs, plateau outline | map text and counters |
|---|---|---|---|---|---|---|
| phase 8's Overview (`ph8-overview-watch`) | 0.8% | 3.7% | 2.5% | 0.1% | 0.0% | 4.2% |
| the Field vantage (`overview-field`) | 3.6% | 4.1% | 6.9% | 0.9% | 0.2% | 11.6% |
| the low Pratzen view (`pratzen-low`) | 9.4% | 8.8% | 5.3% | 3.7% | 0.6% | 4.8% |
| Saint-Hilaire's climb (`inf-mid`) | 11.1% | 10.2% | 5.2% | 2.4% | 1.0% | 3.3% |
| close on Sokolnitz (`close-sokolnitz`) | 6.3% | 5.3% | 4.5% | 3.0% | 0.2% | 2.9% |
| the Goldbach at 08:20 (`stream-low`) | 2.9% | 1.1% | 3.5% | 21.7% | 0.6% | 3.7% |
| low, east at noon (`horizon-east`) | 2.4% | 1.2% | 3.9% | 0.7% | 0.5% | 6.5% |
| low over the Satschan mere at 15:00 (`ice-low`) | 3.7% | 0.9% | 5.0% | 1.1% | 0.3% | 6.7% |

In the Overview the marks cover more than four times what the figures do, and at the Field vantage the marks, the arrows and the map
layer each cover more than the figures: at the distances a visitor starts from, the battle is drawn by its symbology. In the low Pratzen
view, `inf-mid` and close on Sokolnitz the figures are the largest class, but the marks come close (8.8% against 9.4% in the low Pratzen
view, 10.2% against 11.1% in `inf-mid`); in the views toward the horizon the map layer and the arrows cover more than the figures, and in the Goldbach view one French standard near the eye covers a fifth of the free area. The marks' pixels differ little from
the ground under them (median contrast 1.0-2.2; 0-24% of them at 3:1 or more): a wash, not an edge. The arrows' are 1.4-2.9, the
map layer's (its plates against the scene) 1.4-6.3.

### 1.3 The assessment, view by view (direct captures; the photographs did not arrive, see the head of this document)

- **The battle at a distance reads as patches of colour, not as troops** (`overview-field-base.jpg`, `overview-plan-base.jpg`,
  `ph8-overview-watch-base.jpg`). From the Overview a man is about 7 px across and from the Field vantage 9-18 px (`docs/STEP6_SPEC.md` §3.1, a man's
  sphere); what carries each formation there is its confidence mark, and the B and C marks are twice its frontage across, feathered, in
  saturated blue and amber at about half opacity. The plateau at 09:30 is an amber wash with blue islands; where the sides meet the washes mix to violet. The
  owner's "clunky glow" is exactly this, and it is the strongest colour on the screen after the arrows.
- **Close up, symbology outweighs the troops** (`pratzen-low-base.jpg`, `inf-close-base.jpg`, `village-pratzen-base.jpg`, `stream-low-base.jpg`).
  In the low and close views the movement arrows are ribbons tens of pixels wide drawn over everything (depthTest false), their heads larger
  than a battalion; the event glyphs are ringed crosshairs up to 192 px across floating over the ground (decision 57's cap); the C marks
  spread amber or blue across whole slopes; the Russian and Austrian standards (decision 106's sourced ratio, at the figure scale) are the
  largest objects in the frame, and in the Goldbach view a single French standard close to the eye fills the lower foreground. This is the
  audit's A-5 ("close views read as a toy"), still present.
- **The troops themselves** (`inf-close-base.jpg`, `cav-close-base.jpg`, `bat-deployed-base.jpg`, `bat-limbered-base.jpg`). The men are boxes and
  cylinders with an icosahedron for a head and an extruded bicorne or a hemispherical helmet, flat-shaded, one colour a coat (with a 14%
  jitter); readable as soldiers by their hats and muskets. The horses
  are boxes. **The artillery is the weakest drawing in the build**: a gun is a dark cylinder on two solid brown discs with a box trail, the
  limbered battery a brown box on two discs, its barrel on its own pair of discs behind, four box-horses ahead, and it switches between the two in one frame when its leg
  starts. Nothing moves within a formation: a march is a block sliding over the ground.
- **Water** (`ph8-overview-watch-base.jpg`, `ice-high-base.jpg`, `water/ice-mid-base.jpg`, `water/goldbach-top-base.jpg`). The meres are flat
  ellipses of one grey-blue with a lighter ring at the shore: from above they read as plates laid on the field, with a hard edge where the
  ground meets them; the computed sun's sheen is the only variation. **The streams are not drawn at all** (section 9.5): their ribbons, and
  the roads', face away from the eye and the renderer culls them. What a visitor sees along the Goldbach is the ground's own damp and water
  cover, a darker band (`water/goldbach-top-base.jpg`), and in the morning Legrand's line of battle drawn along it: the bright blue line in
  `stream-low-base.jpg` is that line (with the overlays off it goes), not the stream.
- **Buildings** (`village-telnitz-base.jpg`, `village-pratzen-base.jpg`, `village-sokolnitz-base.jpg`, `close-sokolnitz-base.jpg`). Every house is a box
  with the same painted windows and door on all four sides (four wall tints) under a gable roof (five roof colours); 22% are barns; houses stand at
  random along the village's lane, turned at random by 0 or 90 degrees; churches are a box nave with a box tower and a six-sided spire; the
  Sokolnitz castle three wings and a corner block. At the building scale (10-15 times life) a village reads as a cluster of toy houses; no
  landmark the narrative names (the St Anthony chapel, the pheasantry's wall, the Posoritz post house) is drawn as a building.
- **Woods and ground** (`woods-pheasantry-base.jpg`, `horizon-east-base.jpg`, `overview-field-base.jpg`). The woods are dense clumps of large
  bare-crowned and conifer trees, dark grey-brown and green, drawn about 10-15 times life, so a wood reads as a dark mass with a spiky
  silhouette; the conifers' share is the build's own per wood (`WOODS[].conifer`, 0.12-0.55), not a sourced value. The ground's cover (fields,
  meadow, marsh, crop strips, frost on north slopes) holds up at the Field vantage; in a low view the foreground is a uniform brown smear and
  the horizon a grey band with the haze.
- **Labels** (`horizon-east-base.jpg`, `ice-low-base.jpg`, `pratzen-low-base.jpg`). In the low views the names stack into a wall above the
  horizon (about 30 in `horizon-east`), every one at the same weight: formation names with their side mark and grade badge, places with
  their diamond, events in serif; in motion they jump between candidate places (section 3).
- **The paper map** (`paper-north-up-base.jpg`, `paper-close-base.jpg`) is the clearest presentation: north up, counters on plates with
  leaders, the woods and villages as cartographic fills; its confidence marks are capped on screen. Its weakness is motion (section 3).

What holds up, and should be kept: the light (the computed sun, the fill, the valley fog), the ground's cover and relief, the derived
readings and their tags, the restrained interface, the paper map's cartography, the figures' sourced colours and headgear.

## 2. The ground under the troops (the owner's note L1; the brief's priority 1)

### 2.1 What is drawn today (fact, `app.js` at `9eb7abb`)

Three things lie on the ground under a formation drawn as figures, each a patch of the drawn ground's own cells (`groundPatch`) or a sprite:

| layer | where | what | its numbers |
|---|---|---|---|
| **the confidence mark** (Stage 5B, decisions 85-88; `CONF`, `confPlace`, `app.js:1516-1564`) | every formation on the field, at 4x and 10.33x and on the paper map, while "Position confidence" is on (on by default) | the grade's mask in the side's base colour (`TOKENS.sym.side.fr.base` `#4C86D8`, `.al.base` `#D4703A`): A the footprint, a crisp rectangle (frontage `W0 sw` by depth `D0 sd`); B the frontage doubled, its outer halves feathered to nothing; C a disc of radius the frontage, its alpha falling from the centre | opacity A 0.62, B 0.55, C 0.45 (`CONF.OP`); dimmed formations 0.45 of that; lifted 0.25 units; no depth write |
| **the side footprint** (Stage 6C, decision 107; `side7`, `app.js:4906-4917`) | with "Position confidence" off, under every formation drawn as figures, in Study, Watch and Clean | grade A's crisp footprint in the side's colour, whatever the grade | as A |
| **the pad** ("the ground under the formation: trodden, occluded, in contact", `app.js:2034-2039`) | under every block drawn as figures | a radial blob in a dark earth (`SPRITE_COL.pad` `#2A2620`), the block's extent plus 4.5 units | opacity 0.66 times a mask whose alpha is 0.55 at the centre (about 0.36), 0.30 halfway, 0 at the edge (`app.js:1972-1980`) |

What the owner calls "the coloured glow" is the B and C marks: a B mark is twice the formation's frontage and fades over its outer halves, a C
mark a disc as wide as two frontages; both are saturated side colours at about half opacity over a dark ground, and where blue and amber
overlap they mix to violet (`pratzen-low-base.jpg`, `ground/bat-front-base.jpg`). The A mark is a filled rectangle of the same colours under the men.
At the Overview's and the Field vantage's distances the marks are what is seen of a formation: its men are about 7 px and 9-18 px across
(`docs/STEP6_SPEC.md` §3.1, a man's sphere), its mark several times larger (`overview-field-base.jpg`: the formations read as blue and amber patches).

**Two drawings that are not the layer's, and 1x** (`app.js:4886-4920`). The toggle has never turned off every mark: under "Whose eyes?" a
formation the reading has only as reported is drawn as its C zone with no figures (decision 91: "the C encoding of §A (a diffuse zone, no
figures)"), and at the eye level the observer's own side is drawn as its ground marks, not figures; both stay whatever "Position confidence"
says (`graded` holds them). At 1x the footprint (decision 34) is drawn by the formation's grade while the layer is on and crisp when it is
off. So a change of the layer's default changes the 1x footprint's drawing too, and an alternative that removes the marks must say what
draws those two.

**Measured** (`density.js`, section 1.2). The marks cover 3.7% of the free rectangle in phase 8's Overview, where the figures cover
0.8%, and 4.1% at the Field vantage against the figures' 3.6%; in the low Pratzen view, `inf-mid` and close on Sokolnitz 5.3-10.2%, nearly as
much as the figures there (6.3-11.1%), and 0.9-1.2% in the views toward the horizon. Their pixels differ little from the ground under them
(median contrast 1.0-2.2, 0-24% of them at 3:1 or more): a wash, not an
edge.

### 2.2 The alternatives, prototyped in the same views (`tools/stage8/protos/ground.js`; `docs/stage8-evidence/ground/`)

Each alternative switches the build's marks off (`CONF.none`, the measurement switch) and draws its own from the same blocks, yaws and
footprints; 1x is untouched (decision 34: there the footprint is the formation); the pads stay in every alternative.

| id | what is drawn | side | grade A/B/C |
|---|---|---|---|
| `g-none` | nothing (the roadmap's option (a)) | coats (no longer the side's carrier since decision 97), the names' side marks where names are drawn, the counters in the two counter presentations | the names' badges, the dossier |
| `g-marker` | a cased chevron on the ground just ahead of the front, about 15 px across at its distance, in the side's base colour, pointing the way the block faces | the chevron | as `g-none` |
| `g-outline` | a thin cased outline (about 1.7 px, the side's edge colour under it) of the footprint the A mark fills; no fill, no glow (the roadmap's option (b) without the grade) | the outline | as `g-none` |
| `g-selonly` | nothing under an unselected formation; the selected one and its highlighted family outlined in the interface's accent (the build's selection ellipse hidden meanwhile) | as `g-none` | as `g-none` |
| `g-confline` | the confidence layer as outlines: each formation's grade extent (decision 86's: A the footprint, B the frontage doubled, C a disc of the frontage's radius) as a crisp outline, thinner as the grade weakens (A 2.0 px, B 1.5, C 1.1) | the outline | the extent's shape and size |

### 2.3 What the alternatives look like, and what they cost (`docs/stage8-evidence/ground/<view>-<id>.jpg`, `ground-stills.json`)

Seven views, each with the build and the five alternatives in the same camera and clock: the low Pratzen view, the Field vantage, Saint-
Hilaire's climb at 09:20 at a middle distance (`inf-mid`), the guns on the heights at 13:20 (`bat-front`), the Overview, Landscape with
counters in the low view, and a selection (`selected-formation`).

- **`g-none`** is the cleanest picture in every view, and in the close views the troops read better than with any mark (their coats and
  standards are there). Decision 97 left side and nation to symbology alone ("the counters' bands and fills, the nation tag, the name's side
  mark, the ground marks, the arrows, the dossier"), and the ground marks are the one carrier drawn where names and counters are not. It loses the formations at a distance: from the
  Field vantage and the Overview a division is a dozen 8-16 px figures among others, and without its mark only its name says where it is; where
  names are dropped, nothing does.
- **`g-marker`**'s chevron, at about 15 px, is lost in the figures in the close views and too small to find a formation by in the far ones; it
  adds a symbol to a picture that has too many.
- **`g-outline`** keeps every formation locatable at every distance by a line about 2 px wide around its footprint, in the side's colour over
  its dark edge: at the Field vantage the formations read as outlined blocks, not as washes; close up the line sits at the troops' feet and
  does not compete with them (`inf-mid-g-outline.jpg`, `bat-front-g-outline.jpg`). Its weakness: on a steep slope seen low, a footprint's
  outline is long and thin, and on the prototype's straight strips it can read as a selection box; built, it would be drawn on the ground's
  triangles (as the skeleton's legs are), and the selection keeps the accent colour, which no side cue uses.
- **`g-selonly`** is `g-none` with the selection outlined: as clean, and the selected formation is unmistakable; for everything else it has
  `g-none`'s weakness at a distance.
- **`g-confline`** draws what the confidence layer means without a fill: in the close views it is quiet; but a C extent is a disc of the
  frontage's radius, so its outline is a long arc crossing the foreground (`inf-mid-g-confline.jpg`, the Russian line's C disc): an optional
  layer, not a default.
- **None of the seven views uses a reading**, so the two drawings of section 2.1 that are not the layer's were not seen: the prototypes
  set `CONF.none`, under which a reported-only formation would draw nothing at all. Built, (b) keeps both as they are (section 2.4).
- **The map layer is identical in all six** (the same items, placed and dropped in every view): the ground cue does not touch the layout.
- **Cost** (each frame's draw calls and triangles against the same view with `g-none`, both passes; `ground-stills.json`, seven views): the
  build's marks are 31-32 draw calls and 12,500-14,600 triangles; `g-outline` 62-64 calls (two meshes a formation: the casing and the line)
  and 8,300-8,700 triangles, `g-confline` 62-64 calls and 12,100-12,800, `g-marker` 31-32 calls and 170-1,800, `g-selonly` one call. Against
  the build, the outline adds 31-32 calls (about 4% of an 832-call frame: inside section 8.3's +5%, built as one merged mesh it would add
  none) and removes 4,000-6,000 triangles.

**The Overview, Landscape with counters, a selection** (`overview-plan-*.jpg`, `hybrid-low-*.jpg`, `selected-formation-*.jpg`). In the Overview
the build's marks are the battle's strongest shapes, a band of blue and amber washes along the Goldbach and over the plateau; with `g-none`
the formations all but vanish there and only the arrows and names place them; `g-outline` draws each as a small outlined block, and the
order of battle can be read off the field again. In Landscape with counters the counters already carry the side and the grade, and every
ground cue is redundant there: the build's C marks spread amber across the foreground (`hybrid-low-base.jpg`), the outline is quiet. With a
selection, `g-selonly`'s accent outline makes the selected division unmistakable and draws nothing else; the build's ellipse sits inside a
wash. **`g-confline`'s C discs show the prototype's limit**: draped as straight strips across a slope, a long arc breaks into dashes
(`hybrid-low-g-confline.jpg`), which decisions 4 and 15 forbid; built, the outlines must be split on the ground's triangles, as the skeleton's legs
are (section 2.5). The six views without a selection draw nothing different for `g-selonly` and `g-none` (identical frames, checked pixel
by pixel); their `g-selonly` captures are not kept (`ground-stills.json` records every one).

### 2.4 Recommended (question 239)

**(b): a thin cased outline under every formation drawn as figures, the selection in the accent, and "Position confidence" an optional layer
off by default on the landscape, drawing the grade's extents as outlines.** It is the one option that removes what the owner calls the
glow, keeps every formation findable at the distances where its figures are not, and keeps decision 86's extents and 88's grade available
where a visitor asks for them. On the paper map, where the marks are capped on screen and the counters carry the grade, the layer stays on by
default (decision 85 there unchanged). Two drawings stay exactly as they are, because they are the knowledge reading's, not the layer's: a
reported-only formation's C zone under "Whose eyes?" and the eye level's own side as its marks (decision 91; restyling them as outlines is
possible, but would change 91's "diffuse zone", so it is left out of (b)). At 1x the footprint keeps its grade's drawing whatever the
layer (as it is drawn today with the layer on), so 1x does not change with the default (decision 34). The pads stay.

*Decided (239, section 0.3): option (b), off by default in both perspective presentations (Landscape and Landscape with counters), the paper
map's treatment kept as it is (section 0.3.1, items 1-3); built in implementation PR 8B (section 14).*

### 2.5 Acceptance criteria (8B)

In every check:visual view and at 1x, 4x and 10.33x: no fill in a side's colour under any formation drawn as figures with the layer off
(measured as `confShare` is, the view drawn with and without the cue); the outline's line about 1.7 px on a casing twice as wide (the prototype's), never dashed and never under
the drawn ground (the self-test sampling every 0.5 units, as for the skeleton's legs); every formation on the field locatable at the Field
vantage and the Overview by its outline or its name (the self-test at 20 clocks); with the layer on, each formation's extent decision 86's at
its `confAt` grade; under each reading every reported-only formation drawn as its C zone and, at the eye level, the observer's own side as
its marks, as today (the 5E self-test checks unchanged); at 1x every footprint drawn by its grade whatever the layer; the legend's rows what
is drawn; the map layer's items and drops unchanged in every view.

## 3. Counters and labels in motion (the owner's note L2; the brief's priority 2)

### 3.1 What the map layer does today (fact, `app.js` `mlLayout`, `mlPlaceItem`, `mlCollect`, `updateVisibility`)

- **Every drawn frame solves the layout from nothing.** `mlLayout` collects the items (counters, names, events, the plateau reading, arrow and
  plan labels, place and terrain names), projects their anchors, drops what is off the screen, under a panel or behind the drawn ground, sorts
  the rest by priority (what is never dropped first: the selection, the hovered, the highlighted family, live events; decision 39) and places
  each greedily: the anchor's own place, then eight places around it, then rings of 28-148 px with a leader line (to 380 px for what is
  never dropped, and for every label on the paper map), against the panels, the arrows' heads, the event glyphs and every box already placed.
  Nothing of the last frame's placement is kept but each item's content. So when the anchors move against one another (a zoom, an orbit, a
  glide, the clock moving the formations, the perspective's parallax in a pan), an item whose place is taken by a higher-priority one jumps
  to the next free candidate, possibly across its anchor, and a lower one is pushed in turn; an item with no room is dropped, and comes back
  in the next frame that has room.
- **Level-of-detail switches flip whole sets at fixed distances, with no band.** `updateVisibility` reads one distance, `viewDist()` (the eye
  to the orbit target; on the paper map the distance its zoom stands for): beyond 250 units corps and army counters replace the divisions'
  (`wantCorps`); within 165 brigades are added (`showBde`); names are drawn within 300 units (170 for brigades, 220 for artillery and
  headquarters); places other than the major ones within 210; a counter nearer than 70 units is drawn in its full form (`ML_FULL_DIST`, read
  per item through `viewDistTo`). **The Field vantage stands 243 units from its target** (`VANTAGE.field`, re-framed: computed 242.8), 3% inside
  the corps switch: the first pan of a few pixels that changes that distance by 3% swaps the division counters for their corps' (23 counters
  entering or leaving the layer in one frame in `hybrid-pan`).

### 3.2 Measured (`tools/stage8/label-motion.js`; `docs/stage8-evidence/label-motion*.json`)

The probe drives the app's own camera functions one 30 fps frame at a time (a pan of 8 px a frame, a zoom of 3% a frame in and then out, an
orbit of
6 px a frame, a glide by the app's own arc, Play at ½x with Follow from 09:00) in four views at 1600 x 900 in Study (Landscape with counters
and the
landscape from the Field vantage at 09:30, the low Pratzen view at 09:50, the paper map as entered at 09:30), runs the frame's state pass
and the map layer's pass as a
drawn frame does, and reads every item's state and box after each frame: 16 motions, 40,715 item-frames (an item in view in two successive
frames). A **jump** is an item drawn in both frames whose box moved more than 3 px against its own anchor (it took another place); a **pop**
an item in view in both frames that went from drawn to dropped or hidden, or back; a **level-of-detail switch** an item entering or leaving
the layer's list in view; a **flicker** an item drawn, gone and drawn again within 10 frames (leaving the screen or passing under a panel
counts here too, though not as a pop); an **overlap** two drawn boxes overlapping (the
layer's rule is none).

**The build (stabiliser "none").** 4,003 jumps in 40,715 item-frames (9.8 per 100; in the zooms of Landscape with
counters and the paper map, 8 or 9 of the 26-36 items in view change place in every frame), 791 pops (1.9 per 100), 165 level-of-detail
switches, 232 flickers, no overlap. The worst
motions are the zooms and orbits: the paper map's zoom 572 jumps (27 per 100 item-frames), Landscape with counters' zoom 519 and orbit 490,
the landscape's orbit 438, the glides 283-372; Play is quieter but not still (Landscape with counters 245, the landscape 205, the paper map
117). By kind: counters 1,549 jumps, the arrows' labels 1,013, the landscape's names 965, the objective markers 223, places 156, the plateau
reading 80, events 17; the places pop most (468: the major/minor range at 210 units and the ground's occlusion). One pan from the Field
vantage swaps the division counters for their corps' (23 counters entering or leaving at once, `hybrid-pan`; the 250-unit switch 3% away).
The layer's pass took a median
1.1-3.0 ms per frame and a 95th percentile 1.8-12.3 ms (CPU in this page; a single frame's maximum, up to 313 ms, varies between runs of the
same motion without pattern, 123.9 ms in one run of the orbit with anchor2+band and 2.6 ms in the next, and is read as the page's own
pauses, not the layout).

| stabiliser (section 3.3) | jumps | pops | level-of-detail switches | flickers | overlap frames | items drawn while moving (median, summed over the motions) | jumps or pops at rest after the motion |
|---|---|---|---|---|---|---|---|
| none (the build) | 4,003 | 791 | 165 | 232 | 0 | 471 | 15 / 5 |
| persist | 1,726 | 620 | 165 | 156 | 0 | 470 | 10 / 5 |
| persist+hold | 1,611 | 487 | 165 | 74 | 0 | 453 | 0 / 5 |
| freeze | 307 | 153 | 165 | 27 | **506** | 452 | 123 / 68 |
| anchor | 47 | 1,799 | 165 | 493 | 0 | 380 | 36 / 39 |
| anchor2 | 247 | 1,143 | 165 | 162 | 0 | 365 | 44 / 84 |
| **anchor2+band** | **249** | **1,156** | **165** | **171** | **0** | **366** | 45 / 76 |

The two banded stabilisers as proposed, the band released at rest (`label-motion-rest.json`). Measured first with the band held at rest
too (`label-motion.json`, `label-motion-final.json`), they made 105 switches: the band defers 60 of the 165 to the moment the view stops,
`hybrid-pan`'s 23-counter swap among them; it does not remove them. Per motion (jumps / pops / level-of-detail switches / flickers / overlap
frames; a motion's counts include its frame at rest, so the switches a band defers are counted in the motion that deferred them; the two
banded columns are `label-motion-rest.json`'s):

| motion | none | persist | persist+hold | freeze | anchor | anchor2 | anchor2+band |
|---|---|---|---|---|---|---|---|
| `hybrid-pan` | 128 / 39 / 23 / 9 / 0 | 74 / 34 / 23 / 7 / 0 | 69 / 27 / 23 / 6 / 0 | 6 / 7 / 23 / 0 / 48 | 4 / 90 / 23 / 20 / 0 | 8 / 62 / 23 / 9 / 0 | 8 / 62 / 23 / 9 / 0 |
| `hybrid-zoom` | 519 / 198 / 56 / 67 / 0 | 206 / 123 / 56 / 36 / 0 | 206 / 87 / 56 / 13 / 0 | 7 / 13 / 56 / 3 / 47 | 7 / 202 / 56 / 49 / 0 | 26 / 147 / 56 / 16 / 0 | 26 / 158 / 56 / 25 / 0 |
| `hybrid-orbit` | 490 / 125 / 0 / 33 / 0 | 200 / 90 / 0 / 21 / 0 | 187 / 48 / 0 / 8 / 0 | 24 / 5 / 0 / 0 / 58 | 3 / 231 / 0 / 73 / 0 | 14 / 171 / 0 / 38 / 0 | 14 / 171 / 0 / 38 / 0 |
| `hybrid-glide` | 372 / 119 / 12 / 37 / 0 | 175 / 107 / 12 / 29 / 0 | 158 / 64 / 12 / 14 / 0 | 19 / 6 / 12 / 0 / 36 | 3 / 138 / 12 / 42 / 0 | 18 / 79 / 12 / 9 / 0 | 18 / 79 / 12 / 9 / 0 |
| `hybrid-play` | 245 / 71 / 2 / 16 / 0 | 87 / 63 / 2 / 10 / 0 | 86 / 55 / 2 / 8 / 0 | 87 / 63 / 2 / 10 / 0 | 2 / 160 / 2 / 31 / 0 | 15 / 120 / 2 / 8 / 0 | 15 / 120 / 2 / 8 / 0 |
| `paper-pan` | 13 / 3 / 0 / 1 / 0 | 12 / 3 / 0 / 1 / 0 | 12 / 2 / 0 / 1 / 0 | 6 / 1 / 0 / 0 / 0 | 2 / 11 / 0 / 5 / 0 | 4 / 5 / 0 / 2 / 0 | 4 / 5 / 0 / 2 / 0 |
| `paper-zoom` | 572 / 38 / 0 / 14 / 0 | 285 / 37 / 0 / 11 / 0 | 254 / 25 / 0 / 7 / 0 | 0 / 0 / 0 / 5 / 57 | 7 / 157 / 0 / 50 / 0 | 17 / 125 / 0 / 29 / 0 | 17 / 125 / 0 / 29 / 0 |
| `paper-glide` | 283 / 21 / 27 / 7 / 0 | 112 / 12 / 27 / 4 / 0 | 86 / 22 / 27 / 0 / 0 | 1 / 12 / 27 / 1 / 23 | 0 / 85 / 27 / 24 / 0 | 7 / 45 / 27 / 2 / 0 | 7 / 45 / 27 / 2 / 0 |
| `paper-play` | 117 / 6 / 2 / 0 / 0 | 20 / 4 / 2 / 0 / 0 | 20 / 4 / 2 / 0 / 0 | 20 / 4 / 2 / 0 / 0 | 1 / 45 / 2 / 7 / 0 | 4 / 29 / 2 / 2 / 0 | 4 / 29 / 2 / 2 / 0 |
| `land-pan` | 108 / 5 / 2 / 1 / 0 | 67 / 3 / 2 / 0 / 0 | 59 / 3 / 2 / 0 / 0 | 18 / 2 / 2 / 0 / 52 | 9 / 55 / 2 / 15 / 0 | 18 / 31 / 2 / 3 / 0 | 18 / 31 / 2 / 3 / 0 |
| `land-zoom` | 347 / 50 / 33 / 22 / 0 | 144 / 39 / 33 / 17 / 0 | 134 / 52 / 33 / 6 / 0 | 5 / 3 / 33 / 8 / 51 | 5 / 167 / 33 / 46 / 0 | 32 / 92 / 33 / 14 / 0 | 34 / 94 / 33 / 14 / 0 |
| `land-orbit` | 438 / 52 / 0 / 15 / 0 | 167 / 42 / 0 / 12 / 0 | 165 / 27 / 0 / 5 / 0 | 27 / 3 / 0 / 0 / 59 | 0 / 178 / 0 / 62 / 0 | 37 / 81 / 0 / 13 / 0 | 37 / 81 / 0 / 13 / 0 |
| `land-play` | 205 / 19 / 2 / 2 / 0 | 77 / 18 / 2 / 0 / 0 | 77 / 14 / 2 / 0 / 0 | 77 / 18 / 2 / 0 / 0 | 2 / 121 / 2 / 30 / 0 | 20 / 77 / 2 / 12 / 0 | 20 / 77 / 2 / 12 / 0 |
| `low-pan` | 24 / 4 / 0 / 0 / 0 | 17 / 4 / 0 / 0 / 0 | 17 / 6 / 0 / 0 / 0 | 5 / 6 / 0 / 0 / 0 | 1 / 24 / 0 / 5 / 0 | 5 / 12 / 0 / 0 / 0 | 5 / 12 / 0 / 0 / 0 |
| `low-orbit` | 84 / 15 / 0 / 3 / 0 | 45 / 19 / 0 / 4 / 0 | 45 / 24 / 0 / 2 / 0 | 5 / 10 / 0 / 0 / 33 | 1 / 74 / 0 / 20 / 0 | 11 / 36 / 0 / 2 / 0 | 11 / 36 / 0 / 2 / 0 |
| `low-zoom` | 58 / 26 / 6 / 5 / 0 | 38 / 22 / 6 / 4 / 0 | 36 / 27 / 6 / 4 / 0 | 0 / 0 / 6 / 0 / 42 | 0 / 61 / 6 / 14 / 0 | 11 / 31 / 6 / 3 / 0 | 11 / 31 / 6 / 3 / 0 |

### 3.3 The stabilisers

The six stabilisers (with the build, seven variants) keep the layer's rules as they stand at rest (priority order, the never-dropped items,
panels and arrow heads as obstacles, leader
lines, occlusion, the full solve when the view stops); they differ only in what a frame of motion may do:

- **persist**: each item first tries the place it held in the last frame (its box against its anchor), then the build's own search. It halves
  the jumps but cannot stop an item being pushed when a higher one takes its place.
- **persist+hold**: persist; an item that was not drawn in the last frame is drawn only after four frames with room (entering items too);
  and, while the view moves, the distance the level-of-detail switches read is held until it has moved 8% (a band, `viewDist`), released
  at rest. The band moves the switches a motion would make near a threshold to the moment the view stops (`hybrid-pan`'s 23-counter swap
  happens once, as the pan ends); the hold takes two thirds of the flicker and 38% of the pops, and draws a few items fewer while the view
  moves (453 against 471); the jumps stay (1,611).
- **freeze**: while the view moves no item is placed anew; each keeps its box against its anchor. Few jumps, but boxes run into one another
  (506 frames with an overlap, against the layer's rule) and the solve at the end of the motion moves everything at once (123 jumps at rest).
  Rejected.
- **anchor** (the rule tiled-map engines use for their labels): while the view moves (the camera, a glide or the clock playing) a drawn item
  keeps its place against its anchor while that place is free, else it is hidden, never moved; collisions are tested every frame in
  priority order, so nothing overlaps; an item not drawn is looked for only every 333 ms of motion; at rest the full solve with persist.
  Jumps fall from 4,003 to 47, but what was a jump becomes a pop (1,799, more than twice the build's), the flicker doubles, and a fifth fewer
  items are drawn while the view moves.
- **anchor2**: anchor, but an item whose held place is taken first tries the eight places hugging its own anchor (the build's first
  candidates, no rings, so it never leaves its anchor's side), and a hidden item comes back only after two re-placement passes with room.
  The jumps fall to 247 (94% fewer; while the view moves, an item that is not one of the never-dropped ones moves only to a place beside
  its own anchor, by the rule (the probe does not record how far an item moved), and the solve at rest after each motion makes the rest:
  counters 19 against the build's 1,549), the pops to 1,143 (45% more than the build's, 36% fewer than anchor's), the flicker below the
  build's (162).
- **anchor2+band**: anchor2 with persist+hold's level-of-detail band. The band moves the level-of-detail switches to the moment the view
  stops; the rest as anchor2: 249 jumps (counters 19), 1,156 pops,
  171 flickers, no overlap. About a fifth fewer items are drawn while the view moves (366 against 471, the medians summed); at rest they
  come back (76 items appear or leave in the frame after the motion, and 45 take a new place there), which the fades below soften.

**Fades.** A pop is a placement event whatever the rule; what the eye minds is its suddenness. `protos/labels.js` adds `l-fade`: an item
appearing or leaving fades over 180 ms of real time (a leaving item drawn at its last place, under the others, taking no pointer); none
under reduced motion. It changes no placement, so the probe's counts are those of anchor2+band; the recordings show it
(`clips/paper-zoom.mp4`, `clips/hybrid-orbit.mp4`, `clips/hybrid-zoom.mp4`, `clips/paper-play.mp4`: the build above, `l-fade` below,
the same frames at 10 a second). In the paper map's zoom the build's counters and names change places from one frame to the next; with
the prototype they hold their places, and those whose place is taken fade out and come back a few frames later, so that fewer are drawn
while the zoom runs (the table's "items drawn while moving"). In the paper map's Play (`paper-play.mp4`: 09:00 to 09:20 at ½x, 41 frames,
the camera still), the build reshuffles the layer five times in those twenty clock minutes (`clip-motion.json`: the frames in which more
than 30,000 pixels of the map change by more than 40 of 255 from the frame before, the largest 49,000): at 09:02, from one frame to the
next, seven counters change places across the map, V Corps, the Imperial Guard, the Grenadier Division, the Cavalry Reserve, the Russian
Imperial Guard, the Fifth Column and the Advance Guard of the Right (`clips/paper-play-f4-f5.jpg`, the build above, the prototype below,
whose counters all hold). With the prototype no frame changes as much (the largest 21,500 pixels by the same measure; over the clip 189,000
against the build's 335,000), but its layer does not hold throughout: where a live event's label appears (09:07:30, "Kutuzov orders the 4th
Column to face about", placed first as today, decision 39), seven counters leave their places over the next five frames, two or three at a
time, each fading out and back in elsewhere, and at 09:17 three more (V Corps, the Fifth Column, the Russian Imperial Guard). The build
reshuffles at those moments too (frames 15, 20 and 34), each time in a single frame. That is the price section 3.4 states: where the
layer must change, it changes by fades spread over a few frames rather than in one, here at two moments of the build's five. Orbiting the
Field vantage in Landscape with counters (`hybrid-orbit.mp4`), the build's layout reshuffles in every frame,
counters trading places across the field; the prototype's hold theirs, a few fading where another takes their room. Zooming in on the same
view (`hybrid-zoom.mp4`), the build's labels slide and swap as the
anchors spread; the prototype's keep their places against their anchors, and the few that lose their room fade.

### 3.4 Recommended (question 240): anchor2 with the band, and fades

**anchor2+band with `l-fade`'s fades**: while the view moves, every counter and name keeps its place beside its own anchor; one whose place is
taken moves only to a place hugging its anchor, else fades out; what has no room is looked for again every 333 ms and fades in after two passes
with room; the level-of-detail switches act on a distance held inside an 8% band. **At rest** the band is released (the switches read the true
distance, so a view's corps or divisions never depend on how it was reached) and each item first tries the place it held, then the build's own
search (persist). It removes the darting the owner describes (counters' jumps from 1,549 to 19, all jumps from 4,003 to 249; while the view
moves, an item other than a never-dropped one moves only beside its own anchor) without breaking the layer's rules (no overlap among live
items in any frame), with a third of anchor's flicker and two thirds of its pops (anchor, at 47 jumps, is the one other stabiliser that
does as much for the jumps); its price is a fifth
fewer items while the view moves and more items fading than popping today, which the fades make gentle. **persist+hold** is the
lighter alternative (question 240 (c)): it holds a returning item four frames before drawing it, cuts the pops by 38% and the flicker by two
thirds and takes the corps flip out of the pans, but leaves 1,611 jumps (40% of today's). **freeze** breaks the no-overlap rule (decision 24)
and is not offered.

**What it keeps (each an invariant 8C's checks hold):**
- priority order and the never-dropped items (decision 39: the selection, the hovered, the highlighted family, live events): never hidden or
  held while moving, placed by the full search every frame as today;
- the panels, arrow heads and event glyphs as obstacles; no overlap among live items (decision 24); an item fading out (for at most 180 ms) is
  drawn under them and takes no pointer;
- every view reached without motion (every check:visual case, the self-test's pages) laid out exactly as today: the same items drawn, the same
  drops and dropped ids (the stabiliser has no memory in a view's first frame). A view reached through motion keeps its items' places where
  they still fit, so its layout can differ from the same view reached directly (the label layers of tiled maps behave so); its level of
  detail does not;
- a dropped or faded formation reachable by hover and keyboard (decision 39); a focused map item always drawn: the build already draws a
  dropped focused item over the others after the placement (`app.js:4484-4497`), and it does so for a held one too; 8C exempts it from the
  hold outright;
- the leader lines as today (an item held in a ring place keeps its leader);
- reduced motion: no fades (the items appear and leave at once, as today), the hold and the band kept (they reduce motion);
- the counters' content changes (strength, status, reading) at once, never faded.

**Motion is read from the app's own state**: a tween or glide in flight, Play, the input hold (`INPUT_HOLD_MS`), the paper map's eased
moves; at the end of each, one pass at rest.

### 3.5 Acceptance criteria (8C)

Measured by a motion block in `check:visual` (the 16 motions of `label-motion.js`, driven through the app's own camera functions as here, and
the four that real input can drive, by real input), against limits set at the 8C build's measure and put to the owner then (decisions 141 and
232's practice): jumps at most 300 (249 measured here), pops at most 1,300 (1,156), level-of-detail switches not more than the build's (165),
flickers at most 200 (171), no overlap among live items in any frame; the layer's pass not above the build's in the same motions on the same idle machine
by more than 0.5 ms at the median and 2 ms at the 95th percentile (the build: 1.1-3.0 ms and 1.8-12.3 ms, `label-motion.json`; the
anchor2 runs here shared the machine with other browser jobs, so their times are not comparable; their counts are deterministic and are);
in every check:visual view the drops and dropped ids identical to today's; the self-test's map-layer checks unchanged.

## 4. The troops: detail and motion (the owner's note L3; the brief's priority 3)

### 4.1 What is drawn today (fact, `app.js` `figKit`, `kitGeo`, `makeBlock`, `KIT`)

A battalion is a block of 8 files by 3 ranks (24 men), a squadron 5 by 2 (10 riders), each man an instance of two merged geometries, his coat
(instance-coloured by his class's cloth, decision 102) and his fixed parts (legwear, head, the class's headgear from `kitHat`, decision 103;
the musket, pack and bayonet, or a gunner's figure without them); a rider sits on a horse of one brown (decision 109); a cuirass where the table
records one (decision 104). The parts are boxes and cylinders, an icosahedron for the head, an extruded bicorne or a hemispherical
helmet, flat-shaded; a man 204 triangles, a rider and his horse 288 (`kit-census.json`). The drawn man is 1.88 world units, about
118 m of ground, 70 times life (decision 14's named scale; `docs/STEP6_SPEC.md` §3.1). A man is about 7 px across in the Overview, 9-18 px from the Field vantage,
19-77 px in the low Pratzen view and 14-128 px close on Sokolnitz (`docs/STEP6_SPEC.md` §3.1, a man's sphere).

**The artillery** (`app.js:1187-1245`): a battery of `guns` pieces is drawn as `round(guns/2)` guns, 3 to 8 (each drawn gun stands for two). The
deployed group: per gun a cylinder barrel (8 sides), two solid discs for wheels (14 sides), a box trail, five crew in the gunner's figure. The
limbered group: per gun a brown box (the limber) on two discs, the barrel on its own pair of discs behind it, and four horses in a block ahead,
without harness or driver.
The deployed group is shown while the battery stands, the limbered group while its leg is in progress (`marchRate(id).moving`): switched in one
frame when the leg starts or ends. What the visitor sees (`bat-front-base.jpg`, `bat-march-base.jpg`): dark tubes on brown discs; on the march
brown cubes trailed by loose barrels and box horses.

### 4.2 The prototypes, on three representative formations (`protos/figures.js`; `docs/stage8-evidence/figures/`)

Saint-Hilaire's division (French line and light infantry), Nansouty's division (cuirassiers and carabiniers) and the guns on the heights
(IV Corps' foot artillery, `heightguns`); every colour is the build's own, read from the meshes it replaces (the class's cloth, legwear,
headgear, cuirass), so no colour the appearance table does not settle at A or B is drawn on a part the build draws, with one exception the table
settles and the build does not draw: the French cuirassiers' dark blue saddle-cloth (`DRESS.fr_cuirassier.furniture`, grade B). The new
parts take `KIT`'s generic materials: black shoes on every man, the riders' black boots, black hooves, a leather pouch on the gunners. The
shoes are a sliver at the foot, not gaiters (`DRESS.fr_line.legwear` is generic because the gaiters' colour, black on duty or grey linen on
the march, is not settled); built, they would take the legwear's generic value unless a source settles them. The figure's height to its hat's top is
kept within 2% of the build's, so the standards' ratio (decision 106) is unchanged.

| id | what changes | label |
|---|---|---|
| `f-kit` | **the man**: a coat cut as a torso wider at the shoulders with skirts behind, arms as tapered limbs (the left free, the right at the musket), legs in two tapered segments with shoes, the pack and its rolled cover, the musket and bayonet slanted at the shoulder. **The horse**: a barrel body with chest and quarters, the neck raised forward, the head angled down, ears, the tail, each leg in two segments with a hoof. **The rider**: seated with thighs along the horse and shins down, the saddle and the saddle-cloth, the sabre at the shoulder, the cuirass where recorded. **The gun**: a turned barrel (a lathe profile: breech, reinforce, chase, muzzle), a bracket trail of two cheeks to the ground, an axle, wheels with a rim, a hub and twelve spokes. **The limber**: an axle, two smaller wheels, a frame and the pole forward. **The battery**: five gunners about each gun, as the build has them; behind each deployed gun its limber, the coffret on it, and its team of four horses with one driver on the near wheeler, turned to the rear (equipment the build does not draw); hitched up, each gun's trail lifted onto its limber with the coffret between its cheeks, behind the team | DESIGN (shapes and proportions; the gunners' posts); GENERIC (the gun and limber: a field piece of the period, not a sourced model of any army's system); the battery's arrangement, the coffret and the one driver from the leads of section 4.4, to be registered before anything is built |
| `f-facings` | `f-kit`, and on the French line infantry only the lapels and the turnbacks in white and the collar in red | the table's claim (`DRESS.fr_line.facings`, Fieffé, grade B) carries no colour class; drawing it would extend decision 104 (section 4.6) |
| `f-gait` | `f-kit`, and the legs, the free arm and the horses' legs swing by the rule of section 4.3 | DESIGN (the rule, the stride, the thresholds) |
| `f-gait-gc` | `f-gait` with the Guard cavalry in Nansouty's place, for the cavalry's recording: its march of 10:30-11:15 (4.85 km/h) is the one cavalry leg of the model fast enough to step (`legs.js`; Nansouty's are drifts under 1 km/h) | as `f-gait`; the Guard's horse colour as the table has it (decision 109) |

**What they show** (`docs/stage8-evidence/figures/` at the views' distances; `figures-close/` closer, with the build beside each):
- **The guns are where the kit changes most**, partly because the prototype also draws what the build does not (the limbers and teams
  behind the deployed guns, the coffret): the frame rises by 93,800 triangles and four draw calls in `bat-front` (`figure-stills.json`), all three formations' kits together, against
  50,300 and none in `inf-front` and `cav-front`, where the guns are not yet on the field (their first anchor is in phase 7). The build's battery is a row of dark tubes on solid brown discs as large as a man
  (`bat-front-base.jpg`); with `f-kit` each gun stands on spoked wheels with its trail to the ground and its crew about it, and reads as a field
  piece in the views 20-24 units out (`bat-front-f-kit.jpg`; close up, `figures-close/bat-deployed-*.jpg`: the build's gun is a dark tube laid between two solid
  discs larger than a man, which read as plates; the prototype's stands on two spoked wheels with its trail down, its crew about it, and its
  limber and team, with a driver, behind it). Hitched up, the build shows brown cubes trailed
  by loose barrels; the prototype shows each gun's trail lifted onto its limber behind the team (`bat-march-*.jpg`, and close up
  `figures-close/bat-limbered-*.jpg`). The guns' pairs change the most pixels of any: 114,800 of 1.44 million in `bat-march`, 72,600 and
  77,000 in the two close views (`pixdiff.py`, `pixdiff.json`: grey level changed by more than 40 of 255, on the kept JPEGs).
- **Infantry and cavalry change less than the eye expects at the distances visitors use.** At 40 px a man (`inf-front`), the coat cut, the
  arms, the pack and the slanted musket make the files read as men rather than posts, and the horse's raised neck and legs read as a horse;
  the difference is real but small (18,500 pixels of 1.44 million change in `inf-front`, 3,600 in `cav-front`, where Nansouty's men stand behind
  another formation). Closer, it stays small (`figures-close/inf-close-*.jpg`, `cav-close-*.jpg`: the coat's cut, the slimmer arms and the pack read on
  the nearest files, 7,800 pixels change in `inf-close` and 2,600 in `cav-close`, where Nansouty's cuirassiers stand behind Blasowitz's
  houses and under an Allied arrow): those frames are the arrows', the standards' and a glyph ring's (section 4.5). The kit is what the
  guns need in the close views (no gun was captured from the Field vantage); for infantry and cavalry it is a refinement of the close views, and not what the distant views need (their
  problem is section 2's and section 7's).
- **A fault found on the way, recorded.** The kit's first captures drew the horse's barrel white on the cavalry's and the officers' horses
  (the part was left uncoloured) and the teams' brown twice, too dark; fixed in the prototype (the barrel takes the class's horse colour,
  decision 109's one brown) and every figure capture retaken with the fix (`figure-stills.json`, `figure-facings.json`; the close views were
  taken after it).
- **The facings** (`inf-front-f-facings.jpg`) are the most legible single change for the French line infantry (section 4.6).
- **What dominates the close views is still not the troops**: in `bat-front` a movement arrow's ribbon, drawn over everything at its fixed
  width, covers a third of the frame and every formation under it, in both captures (section 7.1).

### 4.3 Motion: the compressed time and the figure scale

**What moves today (fact, `app.js`).** A formation's place is a continuous function of the clock (`posAtClock`: piecewise along its legs at
the leg's constant rate, `legWindow`); every drawn frame sets its block there (`updateVisibility`), turns it toward its heading at its arm's
wheeling rate (`poseBlock`, `WHEEL`), eases its frontage and depth between column and line (`SHAPE`, `u.sw`, `u.sd`) and re-seats every man on
the drawn ground when anything moved (`settleBlock`, `layoutFigs`). The men themselves never move: no leg, arm or horse's leg changes, so a
block on the march slides over the ground as one piece. A battery shows its deployed group while it stands and its limbered group while its
leg is in progress (`u.deployed.visible=!moving`), switched in the frame the leg begins or ends. Skirmishers are shown while advancing; a
broken formation's yaw sways (ambient, `LOOSE`).

**The two scales a gait must answer to (computed from `GEOREF` and the kit; `tools/stage8` notes).** A drawn man is the kit's 1.5 units
times the block's 1.25: 1.88 world units, about 118 m of ground, about 70 times life (the legend's 45-70 times). The clock runs at
`MIN_PER_SEC` x speed: 5 clock minutes a second at the default ½x, 40 at 4x. So a formation's speed on screen, in its own body heights a
second, and the steps a second a gait would need for its feet not to slide on the ground at the drawn size:

| play speed | infantry, 3 km/h (the tactical rate) | infantry, 5 km/h (the ceiling) | cavalry walk, 6 km/h | teams, 4.5 km/h (the ceiling) |
|---|---|---|---|---|
| ½x (default) | 4.0 units/s, 2.1 body heights/s; 5.0 steps/s | 6.6 units/s; 8.4 steps/s | 7.9 units/s; 10.0 steps/s | 5.9 units/s; 7.5 steps/s |
| 1x | 7.9; 10.0 steps/s | 13.2; 16.7 | 15.8; 20.1 | 11.9; 15.1 |
| 2x | 15.8; 20.1 | 26.4; 33.5 | 31.6; 40.2 | 23.7; 30.1 |
| 4x | 31.6; 40.2 | 52.7; 67.0 | 63.3; 80.4 | 47.5; 60.3 |

(A man walking at 1.4 m/s moves about 0.8 of his height a second at about 1.8 steps a second: inference, a common figure, not from a source.)
So at the default ½x a drawn formation already moves about 2.6 to 5 times as fast, for its size, as a man walks (2.1 to 4.2 body heights
a second against 0.8), and at 4x 20 to 40 times.
Feet that never slide would need 5-10 steps a second at ½x, which reads as a scurry, and 40-80 at 4x, which no screen can show (at 60
frames a second anything above about 15 cycles a second aliases). A gait cannot be both true to the ground and readable; one of the two has to
give, and which, is a design choice.

**The rule prototyped (`protos/figures.js`, "f-gait"), stated so it can be judged:**
- **the swing's phase is a function of the clock alone**: the distance the formation's modelled track has covered since its first anchor
  (every leg reached in full, the current one to the clock's fraction) divided by a stride. So a paused clock shows a still pose, a halted
  formation does not step, scrubbing to a clock always shows the same phase, and a jump in the clock (an event, a phase) jumps the pose with
  it, as it jumps the place;
- **the swing's amplitude is the play speed's**: full while the clock stands or plays slowly enough, faded to none above the limit below;
  so a formation paused mid-march stands mid-stride, and pausing a 4x play turns a glide into a stride. Built, the amplitude eases over
  about 0.2 s of real time when the speed changes (the prototype switches it at once);
- **the stride is a design value scaled to the compressed time**, not to the ground: 6.6 map units (208 m of modelled track) a cycle of two
  steps for infantry, 16 for cavalry, 12 for teams, so that at ½x a formation at a typical rate makes about one cycle a second (infantry at
  3 km/h 1.2, at 5 km/h 2.0; cavalry at a walk 1.0; teams 1.0). The feet slide by the ratio of the two scales (about 2 to 4 at ½x): the
  gait says "marching", it does not measure the ground;
- **the swing fades out where it would be a blur**: full up to 3.2 cycles a second on screen, nothing above 4.8 (between, in proportion). At
  ½x and 1x the march is seen; at 4x the formations glide as today, which is honest about a clock running 2,400 times faster than the day.
  The prototype fades each part by its own cycle, so on a slow leg a formation's mounted officers, whose stride is longer, can still step at
  4x while its infantry glide (the 4x recording below); built, a formation's parts fade together, by its fastest-cycling part;
- **a formed body steps together** (infantry in cadence: a design choice), horses each on their own beat (a fixed phase per horse, set once;
  a rider's and a driver's their horse's); the
  walk's four beats (left hind, left fore, right hind, right fore) and a trot (diagonal pairs) above 8 km/h of modelled speed (a design
  threshold); a rider bobs with his horse, a driver with his;
- **under reduced motion nothing swings** (the place still follows the clock, as now); the dwell's hold, a stopped clock, stands still;
- **the shadow is not animated** in the prototype (the shadow pass draws the rest pose); built, the depth material takes the same vertex rule
  (a custom depth material per kit material, section 8.4).

**Measured** (`tools/stage8/gait-check.js`, `gait-check.json`; the three formations at the middle of a moving leg): the phase identical
when the clock is reached from three earlier clocks (all three formations); unchanged while the clock stands and frames are drawn; no swing
on a halted formation or under reduced motion. Saint-Hilaire's climb (08:45-09:15) runs at about 5 km/h: 2.0 cycles a second at ½x, full
swing; 4.0 at 1x, half faded; none at 2x and 4x (the cycles a second `gait-check.json` records for Saint-Hilaire, 0.82 at ½x, are
its mounted officers', whose stride is longer; the infantry's follow from the amplitude it records). The guns on the heights (13:45-14:30):
0.7 cycles a second at ½x, 1.4 at 1x and 2.8 at 2x, full swing; none at 4x.

**Recorded** (`docs/stage8-evidence/clips/`; the build above and the prototype below over the same frames, at ½x and 10 frames a
second, the camera tracking the formation 24-26 units out; the clock set each frame as Play sets it):
- `inf-march.mp4`, Saint-Hilaire's climb (the clock 08:47 to 09:05, 37 frames): it opens in the thinning valley fog as the division closes
  from line into column and turns to its heading (the build's own easing, `SHAPE` and `WHEEL`); then, in the build's half, the battalions
  and their mounted officers slide up the slope, no man or horse moving; in `f-gait`'s the men's legs swing in cadence (at about 5 km/h
  modelled, 2.0 cycles a second: five frames a cycle), the officers' horses walk, each on its own beat, the riders bobbing with them, and
  the column reads as on the march, its feet still sliding over the ground (the ratio above). A movement arrow's ribbon lies across the
  battalions in every frame (section 7.1).
- `bat-limber.mp4`, the guns on the heights limbering up and moving off toward Augezd (13:42 to 13:58, 33 frames): in the build's half the
  deployed battery is replaced, in the first frame after its leg begins (13:45:30), by its limbered group, block horses drawing brown boxes and barrels on
  solid discs, which then slides away; in the prototype's the same switch shows the teams harnessed, a driver on each near wheeler, the guns
  on spoked wheels behind their limbers, and the teams walk (0.7 cycles a second at ½x), the drivers bobbing; the wheels do not turn (not
  prototyped; built, they would follow the track's distance as the gait does). The switch in one frame is the build's and is kept: no source
  read gives the time limbering took (section 4.4). In both halves the arrows of the wheel south ("Saint-Hilaire wheels south", "Vandamme
  wheels south", "The French centre turns south") lie across much of the frame, and the battery is seen through them (section 7.1).
- `inf-march-4x-figures_f-gait.mp4`, the same climb at 4x, the prototype alone (08:47 to 09:27 in eleven frames, 1.1 seconds; the recorder
  steps the clock itself, so the speed buttons still show ½x): the infantry glide as the build's blocks do, their cycle far above the limit
  (16 a second on the climb at 5 km/h) and faded out. Their mounted officers, whose horses' stride is longer, are faded out on the climb
  (6.6 cycles a second) but not after it: at the clip's end the division is on a slower leg (about 2.5 km/h; the gait reports 3.3 cycles a
  second for the officers at 09:27, `clips/record-log.txt`), and their horses step at 92% of the swing, three frames a cycle, a flicker
  beside a gliding column. 8E should fade a formation's swing as one, by its fastest-cycling part, so that a block never half-steps.
- `cav-move.mp4`, the Guard cavalry's march (10:29 to 10:47, 37 frames; 4.85 km/h modelled, 0.8 cycles a second at ½x; `f-gait-gc`, the same
  kit and gait put on the Guard cavalry): in the build's half the squadrons slide past Girzikowitz, every horse's four straight legs still;
  in the prototype's each horse walks on its own beat, its legs at another point of the stride than its neighbours', its rider bobbing with
  it: horses walking, their hooves still sliding. About 10:40 the march runs through Girzikowitz, its houses standing among the squadrons:
  the build has no rule for a formation in a village, and its men and the houses are drawn through each other.

**The drift the gait must not animate** (`tools/stage8/legs.js`, `legs.json`, the model's own legs): of the 147 legs the clock moves, 92 run
at under 1 km/h, 52 of them for two hours or more: Nansouty's division covers 1.85 km between 04:00 and 10:30 (0.28 km/h), Saint-Hilaire's
0.35 km between 04:00 and 08:00. A leg with no dated departure is spread over its whole interval: decision 45 ("Creeping moves ... otherwise
nothing is invented, today's behaviour stays, and while the formation is between anchors the dossier shows the existing 'interpolated'
marker"). So part of what the owner saw as floating is the model saying it does not know when a formation moved; a block drifting its own
width in an hour of the clock is that statement, not a march. **Built, the gait draws no swing below 1 km/h** (DESIGN: a drift between
anchors, not a march), so it never animates a move the sources do not date. The prototype does not yet apply this floor: `gait-check.json`
records Nansouty's drift of 04:00-10:30 (0.28 km/h) at full swing at every speed, at 0.05 cycles a second at ½x, a stride every 20 seconds. A dated departure, where a text gives one, remains a data task under
decisions 40-45.

What it does not do: no figure turns, kneels, fires, falls or runs; no casualty is drawn and no formation thins with losses
(`docs/VISUAL_AUDIT.md`
opportunity 4: "Do not animate losses"); the smoke, dust and sway are as before.

### 4.4 What the sources say of the artillery (leads, `docs/stage8-evidence/leads.md` topic 1; none yet entered in `appearance.js`)

Read for this session by a machine reader (page images where marked, else the text layer), graded by the brief's scale; each is a lead for
8E's evidence step, to be read again and registered before anything is drawn from it. What bears on the drawing:

| question | what was read | grade | what it means for the drawing |
|---|---|---|---|
| which pieces | the Grande Armée took the field with Gribeauval 12-, 8- and 4-pounders and 6-inch howitzers; the an XI 6-pounder and 24-pounder howitzer were to replace them, but "la fabrication était peu avancée" (Alombert I, pp. 228-230, text); the Guard's 24 pieces 8- and 4-pounders and howitzers (Napoleon to Mortier, 29 August 1805, image) | B; A | a French piece is a Gribeauval field piece; which calibres stood on the heights is not read (the data's `strengthNote` already says so): a generic field piece |
| the carriage's shape | French and Russian pieces both on a bracket trail of two cheeks (Gassendi 1809; Nilus 1904, p. 20 on the text layer, p. 21 on the image); the Austrian Liechtenstein matériel in use "mit geringer Aenderung bis zum Jahre 1809" (Teuber 1895, p. 185, image) | B | the prototype's bracket trail is the sourced form for two of the three armies, and a fair generic for the third |
| wheels | Gribeauval: the field gun's wheel 4 pieds 6 pouces (about 1.46 m), the limber's 3 pieds 6 pouces (about 1.14 m), 6 and 5 felloes (Gassendi 1809, t. I p. 110, image); Russian 1402 and 1219 mm (Shirokorad, popular, no source) | B; C | the gun's and the limber's wheels in their sourced proportion (1.14 : 1.46, 0.78) at the figure's scale; the prototype's 1.31 m is 10% short and its ratio 0.86: 8E sets both from the readings |
| the ammunition chest | Gribeauval: the coffret travels between the trail's cheeks on the march and is set on the limber in action (Gassendi t. II pp. 869-870, text; t. I p. 174); Russian and Austrian limbers carry a box over the axle (Nilus; Teuber p. 185, a box "zugleich als Sitz für 3 Mann") | B | the prototype draws the French coffret between the cheeks on the march and on the limber in action; the Allied limbers would carry a box over the axle (not prototyped) |
| teams | French ordinary practice: 12-pounder 6 horses; 8-pounder 4 (the figure under a reader's pen stroke in the copy read: uncertain); 4-pounder and howitzer 4 (Gassendi t. I p. 440, image); the Guard's order gives 44 horses for 4 eight-pounders, 2 four-pounders and 2 howitzers (A as a document): the reader's split (6, 4 and 6) is an inference, and another fits (4, 6 and 8); Austrian 2, 4 and 6 by calibre, with disagreements kept (Teuber pp. 320, 444); Russian only in a popular book (C) | B; A, the split an inference; B; C | the build's four horses a drawn gun match Gassendi's 8-pounder, as far as that figure can be read; a drawn gun stands for two pieces, so the count is a symbol either way: kept, labelled |
| drivers | IV Corps' chief of staff on 25 October 1805 authorised its divisions to reduce their teams to "un soldat du train par voiture ou au plus à deux pour les voitures à 6 chevaux" (Salligny, Alombert IV pp. 183-184, image): a dated authorisation, A as a document; whether it held on 2 December is not shown, and the Guard's pieces, which the data puts on the heights with IV Corps' (`COMPOSITION.heightguns`, Thiébault, B), were not under it; the French harness's saddles on the porteurs (Gassendi t. II p. 829, text: 2 saddles for a team of 4), "near" an inference; Austrian drivers of the Fuhrwesen in the saddle; Russian drivers the company's own men (Viskovatov, 1806) | A, as an authorisation; B; B; B | one driver a vehicle (two for a six-horse team) is the practice IV Corps' order allowed for its own guns: the prototype draws one; on which horse is an inference |
| limbering | the French drill: the limber drawn 3 paces off, then led 20 paces to the rear (about 13 m); the caissons 16-20 toises (31-39 m) behind; a piece's frontage 4 toises; foot artillery keeps its pieces on the limber in all its movements (Gassendi t. II pp. 869-874, text; "not fixed by a regulation") | B | a deployed battery has its limbers and teams behind the guns, which the build does not draw and the prototype does (at the symbol scale, the distance DESIGN); **no source read gives the time limbering took**, so the switch between the two groups has no sourced duration |
| colours | French carriages olive with black ironwork (already in the table, `DRESS.fr_foot_art.head.note`, Gassendi t. I p. 247, B); Austrian woodwork ochre yellow, ironwork black (Teuber p. 185, image); Russian not found (a hobby table only, C) | B; B; C | decision 109 keeps one carriage colour "unless each army's is sourced": two of three now are, the Russian is not, so the one colour stays (question 243 (b) asks whether to draw each army's where sourced) |

### 4.5 The close views: standards and symbology over the troops

The close views' strongest shapes are not the troops: the Russian standards (decision 106's sourced ratio, plain cloths in the nation's
colour, decision 98) stand above every battalion as large flat green panels (`inf-front-base.jpg`), the arrows' ribbons and heads cover
whole formations and houses (`cav-close-base.jpg`), and the glyphs' rings float over them. The audit's A-5 named the standards and the arrows;
both remain. Section 7.1 proposes the arrows' cap and depth test, and the glyphs' smaller cap (question 241); for the standards, the measures and
the ratio are sourced and stay. What can change without touching a claim is how the cloth is drawn: today a flat, unlit-looking plane; a cloth
with a little drape (two or three folds in its geometry, no animation) and the nation's colour at the table's value reads as cloth, not as a
board (8E; DESIGN). A standard's cloth near the eye could fade like the glyphs (decision 57's "fade near the eye"); not recommended without the
owner's eye on it, since it would hide a carried colour.

### 4.6 Facings and decision 104

`f-facings` draws the French line infantry's lapels and turnbacks in white and the collar in red: the table records them for the class
(`DRESS.fr_line.facings`, Fieffé 1854, grade B: "white lapels, turnbacks and cuff flaps; red collar and piping"), without a colour class the
kit can draw; the Guard's foot grenadiers' are recorded too (`DRESS.fr_guard_gren.facings`, Perrot 1821, B, an inference for 1805). In the close views they are the most legible single change of the prototypes (`inf-front-f-facings.jpg`): the French line reads
as French line infantry at a glance. Against it: decision 104 ("No regimental facings or lace drawn; class-level features only where sourced
and large (a cuirass)"), which these would extend (they are class-level, sourced, but small); and **the asymmetry it would draw**: the Austrian
and Russian infantry's facings are regimental or by inspection in the table (`DRESS.at_line`: "the white coat; facings by regiment";
`DRESS.ru_musk`: "collar and cuffs in the inspection's colour, shoulder straps by regiment"), so under the same rule only the French would gain them, and the map would show one army in more detail than the
others for a reason that is about the sources, not the armies. **Recommended (question 245): keep decision 104**; reconsider after 8E, when the
kit is built and the owner can judge the close views with it.

### 4.7 Recommended (questions 242-244), and the acceptance criteria

- **The kit (242):** `f-kit`'s man, horse and rider for every class, built from each class's existing claims (no new colour, headgear or
  equipment beyond what the table settles; the cuirassiers' saddle-cloth, settled at B, drawn); the figure's height to its hat's top within
  2% of today's (decision 106's ratio unchanged).
- **The artillery (243):** (a) the generic field piece with spoked wheels and a bracket trail, its wheels in Gassendi's proportion; the
  French coffret between the cheeks when limbered and on the limber in action; the Allied limbers with a box over the axle (Nilus, Teuber);
  one driver a vehicle, two for a six-horse team (IV Corps' order, an authorisation), on a near horse (an inference); the deployed battery
  with its limbers and teams behind the guns (Gassendi's drill, B) at the symbol scale, as prototyped;
  four horses a drawn gun kept; the switch between the groups kept as it is (no sourced duration; a drawn transition would be a DESIGN value
  shown as if it were a measured one); the carriage one colour (decision 109); each reading registered in `appearance.js` first (a data task
  inside 8E). (b) as (a), with each army's carriage colour where sourced (French olive, Austrian ochre; the Russian generic), extending 109.
  **Recommended: (a).**
- **The gait (244):** the rule of section 4.3 as prototyped, but for its fade, which acts on a formation's parts together (the 4x
  recording). (b) no gait; (c) a gait in real time, independent of the clock (rejected here:
  it would step while the clock stands and differ when scrubbed). **Recommended: (a).**
- **Acceptance (8E):** every 6C and 6D self-test check passing with its meaning unchanged (each figure's class colours, headgear, legwear and
  cuirass; the standards' carriers, counts, cloths, proportions, finials, the ratio at 1x, 4x and 10.33x); the gait's rule held by the
  self-test (`tools/stage8/gait-check.js`'s cases made checks: the pose identical from three paths to a clock, still while paused, none on a
  halted formation, below 1 km/h or under reduced motion, the fade above 3.2 cycles a second, a formation's parts together); the figures seated on the drawn ground in every pose within
  the existing tolerance; the battery's driver count, wheel ratio and coffret as their registered readings; section 8.3's budgets.

## 5. Ice, shorelines and streams (the owner's note L4; the brief's priority 4)

### 5.1 What is drawn today (fact, `world.js` `buildWater`, `WATER_COL`, `ICE`; Stage 4E)

The two meres are ellipses (`CircleGeometry`, 48 segments) of one ice material (`WATER_COL.ice` `#4E5C66`, roughness 0.32, the environment's
weight 0.42, 96% opaque), each with a ring of shore ice over its outer 14% (`#75838B`, rougher), at a level kept under the drawn ground's edge
at every factor; their outlines are schematic (decision 27: no outline changes without a georeferenced source). The streams are ribbons of
one width each (the Goldbach 2.8 units, the Littawa 3.2, the brooks 1.4) in one blue-grey (`#587A8E`) on a darker bank ribbon, draped on
the ground, and **none of them is drawn** (section 9.5: the ribbons face down and are culled). Stage
4E's rule for the meres (`docs/STAGE4_SPEC.md` §F.1, as built): ice, "No cracking, breaking or figures in the water ... no snow", nothing
that suggests mass drowning (`docs/VISUAL_AUDIT.md` opportunity 4). (`docs/ROADMAP.md`'s note L4 words it "no cracks, holes, snow or figures
in the water" and attributes it to decision 79, which is the colours' tables; the rule is §F.1's recommendation as 4E built it. A records
slip, noted here, not changed.)

What a visitor sees (`ice-high-base.jpg`, `water/ice-mid-base.jpg`, `ph8-overview-watch-base.jpg`): from above, two flat plates of
one grey-blue laid on the field, the shore ring a second flat tone, a hard edge where the ground meets them; the computed sun's sheen the only
variation. The streams: nothing of their own (section 9.5); along their course the ground's damp and water cover, a darker band
(`water/goldbach-top-base.jpg`, straight above the Goldbach at noon), and in the morning phases Legrand's line of battle drawn along the
Goldbach, the bright blue line of `stream-low-base.jpg`.

### 5.2 What is known of the water on the day (evidence; `docs/stage8-evidence/leads.md`)

| what | read | grade (the reader's proposal) | bearing |
|---|---|---|---|
| the meres were frozen; how strongly, disputed | "zwar gefroren war, aber nicht so stark, daß nicht einige darin umkamen" (Stutterheim 1806, p. 75, image; the Materialien of 1806 the same); "im Ganzen aber waren die Teiche sehr fest gefroren", the guns' fire making "mehrere Öffnungen im Eise" (Schönhals 1873, p. 169, image); the 31st Bulletin: the columns on the lakes "favorisées par la glace; mais la canonnade la rompit" (text, A as a dated claim); Mikhailovsky-Danilevsky: the ice "pas assez forte" (text) | A for the Bulletin's claim; B and C for the others | ice, as the build draws it; neither its thickness nor a breaking is drawn (no holes, §F.1); the dispute belongs in the data's texts, not the drawing |
| the ice's look | "ce miroir, blanchi par les frimas" (Ségur 1877, t. II p. 473, text); "il n'y avait point de neige" the night before (Marbot, text); the next day "l'ancienne et forte glace avait presque entièrement disparu" with new ice "de l'épaisseur de quelques lignes" (Marbot p. 267) | C (memoirs) | a rimed, whitened surface is the one description read: `w-ice`'s frosted margin is consistent with it; no snow, as the build has none |
| the weather | the Prague-Klementinum daily series (ČHMÚ open data): 30 November to 2 December mild, on the 2nd 5.3 °C at 06:00, 10.6 °C at 13:00, 7.2 °C at 20:00, the minimum 4.9 °C, a deep low (973 hPa), wind from the west-south-west; frost on 29 November (−2.1 °C) and again on the 3rd (−0.1 °C); November's mean +1.0 °C, the daily mean below freezing on 11 days | A for Prague; C for Austerlitz, 190 km away (valley inversions can be much colder) | mild days before the battle thinning ice formed in November's cold spells (inference): consistent with Stutterheim, not with Schönhals's "very firmly"; the conflict is kept, and an eyewitness's "nuit claire et extrêmement froide" (Thiébault) stands against it |
| the morning | fog in the valleys at dawn, lifting from about 7-8 on the heights, then sun (Savary, Ségur, Lejeune, the 30th Bulletin; Stutterheim has a dense fog over the valley at Telnitz at about 9); evening snow (Lejeune) or freezing rain (Ségur), disputed | B/C; the Bulletin A as a claim | the build's valley fog (4C) already draws the morning; nothing changes |
| the streams | the Goldbach's "sumpfige Wiesen" (Schönhals p. 155, image), "ruisseau encaissé et marécageux" (Ségur), its banks "escarpés et marécageux" (Mikhailovsky-Danilevsky); the roads "kothig" (muddy) in the afternoon (Schönhals p. 169, image); **no source read says whether the Goldbach or the Littawa was frozen, open or in flood on the 2nd** | B | marshy banks, sourced (they can replace the build's own terrain study as the basis, a data task); the streams' surface not known |
| ponds not drawn | the Kobelnitz pond (Schönhals, Marbot, Wolny; in grass at the 1825 survey), the Wazan pond (drained 1827), the Sokolnitz estate's three ponds (Wolny 1837); the Menitz pond's four hay islands (Schwoy 1793) | B | outline and presence changes: decision 27's rule (a georeferenced source first); handed on as a geographic data task, not Stage 8's |

### 5.3 The prototypes (`protos/water.js`; `docs/stage8-evidence/water/`)

| id | what changes | label |
|---|---|---|
| `w-ice` | the meres' ice: a frosted margin (lighter, rougher) easing into clearer, darker, glossier ice toward the middle; a broad low-contrast tonal variation (no lines, no cracks); a stronger reflection of the sky at grazing angles; the shore ring's hard edge feathered on both sides | DESIGN; outlines, level and colours' tables kept |
| `w-stream` | the stream and bank ribbons drawn (double-sided: section 9.5), the streams darker and less blue, reflecting the sky at grazing angles; the banks a little darker at the water | DESIGN |
| `w-streamice` | `w-stream` with a thin pale rim of ice along both banks | shown for assessment only: not supported by section 5.2 |
| `w-flow` | `w-stream` with its ripple drifting downstream in real time (the clip `clips/stream-flow.mp4`) | shown for assessment only |

**What they show** (`docs/stage8-evidence/water/`, the build beside each; `water-ice.json`, `water-stream.json`):
- **The meres read as ice** (`ice-high-w-ice.jpg`, `water/ice-mid-w-ice.jpg`, `ph8-overview-watch-w-ice.jpg`): a rimed, whitened margin
  easing into darker, glossier ice toward the middle with broad soft patches, against the build's two flat tones; the shore reads as shore
  ice rather than as a plate's edge. No line, crack or hole is drawn; the outlines, the level and the ring are the build's. The margin is
  bright at these distances, the one value to tune in 8F (its colour sits in `WATER_COL`). The prototype costs nothing in the frame (the same
  draw calls and triangles; a few instructions per fragment over the meres) and was removed cleanly in every view.
- **A fault found on the way, recorded**: the prototype's first version replaced the materials' shader hook instead of chaining the app's
  own (`atmoUniforms`, `app.js:389-391`, which feeds every material the haze's and the fog's uniforms), and the ice drew black; any Stage 8
  shader change must call it, as the ground's and the atlas's already do.
- **The streams** (`goldbach-top-*.jpg`, `goldbach-noon-*.jpg`, the Goldbach below Sokolnitz at noon; `water-stream.json`): the build shows
  no stream (the frame `*-base.jpg`); `w-stream`, drawing the ribbons, shows the Goldbach as a grey-blue channel between paler banks,
  crossing under the village's houses (`goldbach-top-w-stream.jpg`: 94,300 pixels change, `pixdiff.json`); from the west bank, 30 units out,
  a pale band running away toward Sokolnitz behind the troops, the sky reflected at a grazing angle (`goldbach-noon-w-stream.jpg`: 9,600
  pixels). `w-streamice`'s pale rim reads as ice along both banks from above (`goldbach-top-w-streamice.jpg`: 32,600 pixels whose colour
  differs from `w-stream`'s by more than 40 of 255 in a channel) and barely from the bank (900), which is as well, since nothing read supports it. A fault of the prototype's, recorded: its
  first captures of `w-streamice` were `w-stream`'s (the variant installed second reused the first's compiled program, which drew no rim);
  each variant now has its own, and both views were taken again. The same draw calls
  and triangles: the ribbons are already submitted to the renderer today and culled there, so drawing them costs only the pixels they cover.
  The ribbons' widths are the build's (the Goldbach 2.8 units, about 177 m, on banks 4.6 wide): symbol widths, never yet seen.
- **The flow** (`clips/stream-flow.mp4`: straight above the Goldbach below Sokolnitz at noon, 31 frames at 10 a second, the clock and the
  camera held; `w-stream` above, `w-flow` below; `clip-motion.json`): `w-stream`'s part does not change (47 to 62 pixels differ from its first
  frame by more than 8 of 255, the encoder's noise); in `w-flow`'s the ripple drifts downstream, 284 pixels differing by more than 8 after a
  tenth of a second and 1,416 after three, none by more than 40: a faint shimmer on the water when watched for, not a current. Its speed
  and strength are design values; the case against it is section 5.4's, not its look.

### 5.4 Stream movement, assessed on its own

- **Known:** the Goldbach ran between marshy meadows with steep banks in places (Schönhals, Ségur, Mikhailovsky-Danilevsky); the roads
  were muddy by the afternoon (Schönhals); the days before were mild in Prague (the Klementinum series).
- **Uncertain:** whether the streams carried ice on the day; how fast they ran. No source read describes their surface on 2 December.
- **The cost of moving water.** The build draws on demand: with the clock stopped and nothing in motion it draws no frame at all, and its
  ambient frames (about 11 a second, `AMBIENT_MS` 90) run only while smoke, dust or a broken formation is in view, never under reduced motion
  (`ambientNow`, `app.js:7584`). Once the streams are drawn, one is in view in most landscape frames, so a flowing one would turn an idle page into one drawing
  about 11 frames a second for as long as it is open, on a phone too; and a flow in real time while the clock stands is the one motion on the
  map that would not be the clock's.
- **Recommendation:** no flow; the streams still, darker and less blue (`w-stream`); no stream ice. The flow stays a documented option
  (question 246 (c)), with its cost.

### 5.5 Recommended (question 246)

**(a): the streams drawn first (question 253, in 8A), then `w-ice` and `w-stream`, still, no stream ice**: the meres' material varied (a frosted margin as Ségur's "blanchi par les frimas" has
it, clearer and glossier toward the middle, a broad low-contrast variation, the shore ring feathered), their outlines, level and the 4E rule
unchanged; the streams darker and less blue, their banks a little darker; nothing moves. (b) edge ice on the streams is not supported by
anything read; (c) a flow is a design choice with its idle cost. The ponds the sources name and the build lacks are a geographic data task
(decision 27), handed on.

## 6. Buildings and structures (the owner's note L5; the brief's priority 5)

### 6.1 What is drawn today (fact, `world.js` `VILLAGES`, `CHURCHES`, `buildSettlements`, `world.js:103-118`, `1259-1330`)

Twenty villages, each a place and a number of houses (5 to 24; the Posoritz post house 3), drawn at the building scale (about 10-15 times
life, decision 14's named scale). Each house is a box (its walls one painted texture on all four faces: the same two windows and a door) under a
gable roof (an extruded triangle, one red-brown tile texture), set along the village's lane (the nearest road within 14 units, else a seeded
direction) at a random distance along and across it, turned at random by 0 or 90 degrees (and up to 6 degrees more); 22% of them are barns (longer,
lower); 60% of the dwellings (not the barns) carry a chimney. Twelve villages have a church: a box nave, a box tower and a six-sided spire, at the village's centre,
all turned the same way (0.1 rad). The Sokolnitz castle is three wings round a court and a taller corner block, inside a ring of sixteen low
blocks. The paper map draws the villages as flat footprints (Stage 2E); the landscape's ground draws them as the village cover class (2F).

What a visitor sees (`village-telnitz-base.jpg`, `village-pratzen-base.jpg`, `village-sokolnitz-base.jpg`, `close-sokolnitz-base.jpg`): a scatter of
identical white boxes with red roofs, some turned across the lane and some along it, so a village has no street; churches alike; no landmark the
narrative names is a building: the chapel of St Anthony, the Sokolnitz pheasantry's wall and the Posoritz post house are names on the ground.

### 6.2 What is known of the buildings (evidence; `docs/stage8-evidence/leads.md`)

| what | read | grade (the reader's proposal) | bearing |
|---|---|---|---|
| the villages' plan | the stable cadastre's indication sketches of 1825-1826 (the Moravian Land Archive, fund D9; read on the image): Sokolnitz a long spindle-shaped green with narrow, deep plots on both sides, the buildings at the street end, many L-shaped; Telnitz a straight broad street-green, the houses L-shaped at the street front, orchards behind; Pratzen (1826) the dwellings long blocks set end-on to the street, several L-shaped, **timber barns (drawn yellow) across the back of the yards**, orchards behind | B for 1825-1826; C applied to 1805 | `b-village`'s composition (dwellings gable-end to the lane, a barn across the yard's end) is the cadastre's pattern; a regional ethnographic text has the long side to the green (C), against the dated sketches: kept |
| walls and roofs | the cadastre colours dwellings pink (masonry, fireproof) and timber buildings yellow (the legend read only in secondary pages, C; the 1824 Instruction not reached); unfired clay brick spread in the 18th and 19th centuries (Frolec and Vařeka 1983, via a web reproduction); **roofing and roof form in 1805: not found**; the fire record (Augezd burnt "ganz bis auf die Kirche" in 1794, Telnitz 22 houses in 1808, Pratzen in 1805, 1814, 1818 and 1829, Wolny) suggests combustible roofs (inference) | B/C; not found; inference | whitewashed walls defensible; the thatch share stays a placeholder, labelled DESIGN, until the roofing is read |
| the villages' size | houses: Sokolnitz 75 (Schwoy 1793, image) and 73 with 17 manorial buildings (Wolny 1837); Telnitz 51 and 58; Augezd 92 and 129; Pratzen about 80 and 77; Satschan 38 and 50; Menitz 80 and 103; Kobelnitz 41 and 48; and others | B | the build draws 5-24 houses a village, a tenth to a third of these (Menitz 7 of 80, Puntowitz 8 of 28), at the building scale: a symbol count, kept (more would overflow the footprints at 10-15 times life) |
| edges | Telnitz and Sokolnitz "mit Zäunen und Gräben umgeben" (Schönhals 1873 p. 155, image) | B | the fences (and ditches) drawable as each village's edge |
| landmarks | the Sokolnitz castle in 1793 "ein gutes Schloß und Garten", with a chapel (Schwoy); in 1837 a regular quadrangle, its east front two storeys and the other three one, the chapel consecrated 1750, a walled orchard to the west running north into a pheasant garden of 90-100 Joch, the four-storey granary south of it where over 3,000 Russians were taken between 3 and 4 pm (Wolny, image); the 1825 sketch: a closed square block round a court; the pheasantry's wall dated to the second half of the 19th century by a regional site (C), Wolny naming only the orchard as walled; Telnitz church rebuilt 1726-1740 (in the village) and Pratzen church built 1728-1730 **on the hill outside its village** (Wolny; Schwoy: "eine außer dem Orte stehende Kirche"); the Santon's chapel standing from 1700, out of use from 1784, destroyed by the French "während der Schlacht" (at an hour not given), rebuilt 1832 (Wolny II/2 p. 130, image); the chapel above Augezd named by an eyewitness (Stutterheim 1806 p. 75, image), its roof and state on the day not found (the data's "lost its roof about the time of the battle" is a modern town text, C); the Posoritz post house named in 1806 (A/B), its building's identity with today's Stará pošta, about 1.4 km from the map's point, modern tradition only (C); Austerlitz's church (1786-1789) and château (three storeys, wings, its front to the south-west) and the Blaziowitz castle (Wolny) | B, C where said | the castle as a quadrangle (`b-landmarks`); the fences; the chapels' existence, but not their state on the day (St Anthony's roof not found; the Santon's destroyed during the battle): drawn only once 8G's evidence step settles it, or with the state put to the owner; the pheasantry's wall **not** drawn; the Pratzen church's place on the hill is a geographic data question (the build sets every church at its village's centre) |

### 6.3 The prototypes (`protos/buildings.js`; `docs/stage8-evidence/buildings/`)

The villages are rebuilt from the build's own data (each village's place and number of houses, `CHURCHES`, the lane); the build's houses, roofs,
chimneys and spires are hidden while a prototype stands. No village's place, extent or number of houses changes.

| id | what changes | label |
|---|---|---|
| `b-village` | houses gable-end to the lane on both sides, spaced along it, each with a yard behind and a barn across the yard's end on about half the plots; steep gable roofs in two materials, thatch and tile, in a placeholder share (40% tile); whitewashed walls over a darker plinth, the gable to the lane with two small windows, the door to the yard; a chimney on the ridge; churches turned east-west, a nave, a polygonal east end and a west tower with a plain pyramidal helm | the composition the 1825-1826 cadastre's pattern (B for 1826, C applied to 1805, section 6.2); the roof share a placeholder (DESIGN: roofing not found); the churches generic (no church's own form claimed) |
| `b-landmarks` | `b-village`, and: the Sokolnitz castle as the regular quadrangle round a court that Wolny (1837) and the 1825 indication sketch give, its east front two storeys and the others one, at the build's own place, in place of the build's three wings and corner block; a small chapel with its roof at the chapel of St Anthony's approximate place (`FEATURES` `chapel`); the fences round Telnitz and Sokolnitz as a low fence along each village's drawn cover edge | the castle's plan B (1825, 1837); the chapel's form GENERIC and its roof one possible state, not a claim (its state on the day is not found, section 6.2); the fences B (Schönhals 1873), their line the drawn edge, an assumption; no pheasantry wall (its date disputed) |

**What they show** (`docs/stage8-evidence/buildings/`; the build's houses hidden while a prototype stands, its castle kept in `b-village`):
- **The villages read as villages.** Pratzen at 09:00 (`village-pratzen-b-village.jpg`): two rows of houses gable-end to the lane, barns
  across the yards, straw and tile roofs mixed, against the build's few scattered houses turned at random; Telnitz and Sokolnitz the same in
  the morning fog. The number of buildings rises by about half (the barns), every house placed about its village's point and along its lane
  as the build's own are (the share whose centre lies in the drawn village cover: 59.2% against the build's 57.0%; neither is 100%: the cover polygons are the 2E data
  question's, and the build's own houses already stand partly outside them).
- **The churches are the weak part.** The generic west tower reads as a tall white block, its small pyramidal helm lost at these distances
  (`village-sokolnitz-b-village.jpg`), where the build's dark six-sided spire at least read as a church. The towers' forms are not read
  (Telnitz church 1726-1740 and Pratzen church 1728-1730 stood, Wolny; their towers are not described), so 8G should draw them only after its
  evidence step, keeping the build's spire meanwhile.
- **The Sokolnitz castle as Wolny's quadrangle** (`village-sokolnitz-b-landmarks.jpg`): four wings round a court, the east front higher,
  reads as a manor where the build's three wings and corner block read as a group of houses.
- **The landmarks at the battle's distances.** The chapel of St Anthony, drawn small and roofed at its approximate place, is lost among the
  guns and the Guard at 15:00 (`bat-chapel-b-landmarks.jpg`): at the building scale a chapel is a house, and its weight in the picture comes
  from its name in the map layer and its place on the height, not from its size. The fences round Telnitz and Sokolnitz (135 segments along
  the drawn village edges, about 0.3 units high: the building scale's 1.5 m fence) vanish in the morning fog at 08:20
  (`woods-pheasantry-b-landmarks.jpg`) and are a thin line at the Field vantage; they would carry in the low views and as a village-edge
  symbol on the paper map.
- **Cost.** The frame 6,800 triangles and 10 draw calls more with the villages, 8,100 and 15 with the landmarks (the build's houses hidden,
  `building-stills.json`); every prototype removed cleanly (the frame after it equal to the build's). One reporting slip, recorded: the JSON's
  `b-village` rows repeat the previous `b-landmarks` install's landmark counts (the prototype did not clear them; fixed after the run); the
  triangles show what each drew.

### 6.4 Recommended (question 248)

**(a): the villages re-laid on the cadastre's pattern in 8G, and the landmarks after the evidence step**: the dwellings end-on or L-shaped to
the lane with a barn across each yard's end on about half the plots (the build's number of houses kept as the dwellings, the barns added:
about one and a half times as many buildings, all inside the village's place as today), whitewashed walls, the roofs a placeholder mix until
the roofing is read, the churches east-west (generic); then, each with its claim and grade in a data task: the Sokolnitz castle as Wolny's
quadrangle, the fences round Telnitz and Sokolnitz, the two chapels once their state on the day is settled (St Anthony's roof is not found;
the Santon's chapel was destroyed during the battle, at an hour no source read gives), and, where the sources place them, Austerlitz's
château and the Pratzen church on its hill. Not proposed: the roofless chapel (a modern text
only) and the pheasantry's wall (dated later). (b) the villages only; (c) as today.

## 7. Further opportunities (assessed; recommendations, not approved work)

### 7.1 Arrows: width, opacity and hierarchy

**Today (fact, `app.js` `buildArrow`, `drapedRibbon`, `applyOverlayOpacity`).** Every arrow is a ribbon draped on the drawn ground, of fixed width
in world units (attack 2.0-2.6, counter 1.8-2.3, move 1.3-1.6; the casing 1.34 times that), its head 7.5 wide and 6.5 long, lifted 2.4 units,
drawn over everything (depthTest false, "an annotation on the map, not an object in the landscape") at 95% opacity. The hierarchy the
symbology settled is kept by form, not weight: side by colour (decision 1), the Allied chevron head (20), intended routes broken (15, the one
dashed kind), derived arrows drawn on with the clock (83), interpretive ones flagged. What does not hold up is the weight: a width fixed in
the world is 6-10 px across in phase 8's Overview, 12-16 px at the Field vantage and a band up to 50-68 px across in the low and close
views (`density.js`, each live arrow's casing at its middle: the low Pratzen view 50-58, close on Sokolnitz 49-55, the Goldbach view 20-68,
low toward the east 25-50, low over the Satschan mere 11-63), where the heads cover battalions and, at the eye
level, the arrows show through the hills (the audit's A-5, recorded in 5E and still present).

**Prototyped (`protos/arrows.js`; `docs/stage8-evidence/arrows/`).** The prototypes wrap the build's `drapedRibbon`, so they act on every draped
ribbon of the overlays: the movement arrows, and also the lines of battle, the boundaries and the halt bars. `a-cap`: each ribbon's width
capped so its casing is at most 16 px across at its middle (the head scaled with it; never widened; a ribbon whose middle lies
behind the eye left as it is: the prototype's first run failed on one, in `inf-mid`, and was run again with this rule). `a-soft`: `a-cap`, every ribbon's
opacity multiplied by 0.62 (fills and casings), and the ribbons depth-tested: the arrows, lifted 2.4 units, pass above the men's 1.88 units, but the
lines of battle (lifted 1.9) and the boundaries (1.6) do not, so in these captures the figures cut them. `a-calm`: `a-soft` with the event
glyphs capped at 64 px instead of 192.

**What they show** (`docs/stage8-evidence/arrows/`, three views with the build; `arrow-stills.json`, `pixdiff.json`):
- **`a-cap` turns the bands into lines.** In the low Pratzen view Levasseur's arrow up the Goldbach and Kamensky's counter-attack on the crest
  (`pratzen-low-base.jpg`), in `inf-mid` Saint-Hilaire's and Vandamme's arrows, close on Sokolnitz the Allied II and III Columns' arrows and
  Legrand's line along the stream become lines of 16 px with heads in proportion (`*-a-cap.jpg`), every path, head form, colour, label and the
  draw-on as before (the prototype passes the build's own ribbon a narrower width, nothing else). The frame loses 180-550 triangles (and three
  draw calls close on Sokolnitz); 0.9-1.6% of its pixels change.
- **`a-soft`** lightens them further. Its depth test against everything drawn shows why the recommendation below tests against the ground
  alone: close on Sokolnitz the village's houses and the trees cut the II and III Columns' arrows, which all but vanish behind the castle
  (`close-sokolnitz-a-soft.jpg`), and Legrand's line along the stream passes behind the houses of Telnitz.
- **The frames after them.** Each prototype was removed and the frame after it compared with the first: equal in every view but close on
  Sokolnitz, where it held 10 triangles fewer (`arrow-stills.json`, each entry's `after`: 2,478,149 against the first frame's 2,478,159),
  which is exactly the frame the build gives when it rebuilds its overlays with no prototype at all (`a-rebuild`, 2,478,149): there the
  page's first build of the overlays draws 10 triangles more than any rebuild of them, so the difference is the build's, not a remnant (in an
  earlier run of the same view the first frame drew 20 more).

**Recommended (question 241):** `a-calm` in 8B for the movement arrows, with one change from the prototype: the depth test against **the
drawn ground alone**; the lines of battle, the boundaries and the halt bars keep their widths and opacity, and take the same ground-only
test (so the figures never cut them). The
prototype depth-tests the ribbons against everything drawn, so a wood or a village in front cuts an arrow as a hill does; 2C drew the arrows
over everything on purpose ("over woods and buildings, as the plan ribbons are: an annotation on the map, not an object in the landscape",
`app.js:2131`), and that intent is kept if only the ground hides them: after the frame, the depth buffer cleared, the ground drawn into it
alone (no colour), then the arrows depth-tested against it (one more draw call of the ground's 5% of the frame's triangles). The cap and the
depth test change no arrow's path, derivation, head form, colour, label or draw-on (`binding-test.js` holds those and is unchanged), and the
eye level's arrows stop showing through the hills (A-5). The cap must follow the camera: a width uniform per ribbon, the half-width scaled
in the vertex shader about its centre line and its height re-read from the drape, or the ribbon re-draped when its scale has changed by more
than 10%; the paper map keeps its widths (one scale across the plan).

### 7.2 Label density and hierarchy in the low views

**Today (fact, `app.js` `mlCollect`, `updateVisibility`).** Every item of the map layer is drawn at one of a few type sizes by its kind
(counters, names with their side mark and grade badge, places with their diamond, events in serif), with no hierarchy by distance. Whether a
formation's name is collected depends on one distance for the whole view, the eye's to the orbit target (`viewDist`, `app.js:4927-4929`):
names while it is under 300 units (170 for brigades, 220 for artillery and headquarters), corps and army names at any distance beyond 250;
places other than the major ones under 210. In a view held low toward the horizon the target is near, so everything on the plateau and beyond
is collected: in `horizon-east` 30 items are drawn (65 collected, 7 dropped), in `ice-low` 36 (12 dropped), stacked in a band above the
horizon at one weight (`horizon-east-base.jpg`), where the views from above spread 15-42 over the field.

**Measured** (`tools/stage8/label-far.js`, `label-far.json`: the build's own layout, each drawn item's anchor against the eye's distance to
its target). Beyond 1.5 times that distance stand 23 of the 30 items drawn in `horizon-east` (16 of them formation names; 15 on leader
lines), 26 of 36 in `ice-low` and 19 of 23 in `stream-low`: the band above the horizon is these items. In the close views 7 and 9 of 18 and
19 (places and names behind the troops), in the low Pratzen view 3 of 24, and none of the 42 at the Field vantage or the 22 of phase 8's
Overview, whose targets stand 244 and 425 units out.

**Recommended (question 240 (a), in 8C):** a hierarchy by distance in the perspective presentations: an item whose anchor stands farther
from the eye than 1.5 times the eye's distance to the orbit target is drawn a step smaller (a scale-free rule: at the Field vantage, its target
243 units out, only what lies beyond 365 units, the far edge of the field; in a low view with its target 60 units out, the wall beyond 90).
Nothing is removed and no drop changes. **An option to measure, not recommended without the owner's word (240 (b))**: the far items yield
first in the layout (dropped before the near ones of the same priority, still reachable by hover and keyboard as every drop is, decision 39):
it would thin the wall, but add drops in the low views, whose limits (`pratzen-low`, `eye-zuran` and others) only the owner moves;
not measured here. Acceptance for (a): in the low views the far items at the smaller step, the drops and dropped ids unchanged; for (b), the
drops counted and put to the owner.

### 7.3 Woodland

**Today (fact, `world.js` `buildWoods`, `treeKit`).** 1,194 trees in six instanced meshes (four bare deciduous habits, two conifers) and 556
scrub, at the building scale (10-15 times life), inside the drawn wood cover since Stage 2F; deciduous crowns "bare wood: a dense mass of twig,
grey-brown ... never green", conifers green; each wood's conifer share is a value of the build (`WOODS[].conifer`, 0.12-0.55: no source is named
for it). In the close views the woods are dark, spiky masses (`woods-pheasantry-base.jpg`); in the Overview dark clumps. Seen from inside a
wood's edge, a bare deciduous crown is a faceted grey mass that reads as a boulder, the conifers as dark cones (`views/ice-sun-base.jpg`, whose
camera stands behind the wood above the Satschan mere: kept for this, not for the ice). Seasonal plausibility:
bare broadleaves in December are right; the dense opaque crowns read as evergreen masses more than as bare trees.

**Recommended (question 247), a design pass, no data:** airier deciduous crowns (an open silhouette of a few main limbs and a
lighter, semi-transparent twig mass, so the ground and the troops read through a wood's edge), a little more variation in size; the conifer
shares kept as they are until a source on the woods' composition is read (the Second Military Survey's and the cadastre's legends name woods,
not species: inference, to be confirmed in 8G's evidence step). The tree count and the wood cover are unchanged (2F's checks hold).

### 7.4 Terrain texture, transitions and the horizon

**Today (fact).** The ground shader draws each point's land cover from the model's own classes (Stage 2F, `COVER_ML`) with CC0 photo textures
(`assets.js`), frost on north-facing slopes and crop strips; the field beyond the modelled ground is an apron the haze takes (4C, 4E: the dome
on the eye, the horizon the haze's colour). At the Field vantage the cover reads well (`overview-field-base.jpg`); in the low views the
foreground is a uniform brown blur (`horizon-east-base.jpg`, `ice-low-base.jpg`): one texture scale for every distance, magnified near the eye;
the transitions between classes are soft but the classes carry little texture of their own close up; the horizon is a flat grey band.

**Recommended (question 247):** a detail layer near the eye (a second, finer sample of the same texture, or a small noise, faded in within
about 60 units: no new class, no new colour outside `LAND_COL`), which keeps the frost and the strips; the horizon left to the haze (a true
skyline beyond the modelled ground would need terrain data outside `GEOREF`'s field: a geographic data task, not proposed).

### 7.5 One language across Landscape, Landscape with counters and the paper map

The three presentations share the map layer, the arrows and the side's two colours; they differ where Stage 8 touches: the ground cue (a
filled mark on the landscape, capped marks on the paper map), the grade (a badge on the landscape's names, on the counters elsewhere), the
selection (an ellipse on the landscape, the counter's state on the paper map). **Recommended:** the same outline language for the side cue and
the grade's extents in all three (the paper map keeping its layer on by default, question 239 (b)'s note), the same stabilised layout in all
three (section 3), the arrows' cap in the two perspective presentations only.

*Decision 239 (section 0.3.1, item 1):* the outline language is for the two perspective presentations only. The paper map keeps its
confidence treatment as it is (its marks filled, B and C capped on screen, the layer on by default); this section authorises no change there.

### 7.6 The event glyphs

**Today (fact).** Event glyphs (a ringed cross, a circled arrow) and objective markers are sprites, capped at `SYM_MAX_PX` 192 px on screen
and faded near the eye (decision 57, `app.js:3193`). In the close views a glyph is the largest single shape after the arrows: rings well
over 100 px across over the troops (`inf-front-base.jpg`, `cav-close-base.jpg`), in the eye-level views over the horizon. `a-calm` caps them at 64 px (the
event's map label and its tag unchanged, the glyph's hit area unchanged, decision 167's exception for the markers on the timeline untouched).
In the captures (`*-a-calm.jpg` against `*-a-soft.jpg`) the rings that stood over the troops become small marks: in `inf-mid` the crosshair
over the Russian line and the circled arrow over Saint-Hilaire's column, close on Sokolnitz the ring over the village; the glyphs' cap alone
changes 3,500-9,200 more pixels than `a-soft` (`pixdiff.json`). The event stays findable by its map label (which keeps its size) and by its
marker on the timeline.

## 8. Performance as part of the design

### 8.1 What step 6 measured and decided, and what it did not

Fact, from `docs/STEP6_SPEC.md` §3, §11-§16:
- **The workload.** A 4x landscape frame draws 2.48-2.53 million triangles in 740-857 draw calls from the Overview to the close views, nearly
  the same in every view, because no figure block, tree or scrub mesh is ever culled (three r128's `InstancedMesh` sets `frustumCulled` false).
  In the low Pratzen view the men and horses are 49.3% of the frame (both passes), the trees 32.6%, the scrub 8.1%, the ground 5.4%, the
  buildings 0.4%, the standards 0.3%, the guns and gear 0.1%; the shadow pass is 41% of the frame. The audit's P-1 ("about 91%") is about half.
- **The desktop.** On the owner's Windows desktop (an RTX 4070, 144 Hz) no segment of L1-L3 had a long frame in the decisive views; the GPU
  took 1.7-5.0 ms a frame at the median, the app's JavaScript 1.9-6.1 ms. Question 138 (figure level of detail) was retired on these runs
  (decision 235), with the departure recorded: they say nothing of an integrated GPU.
- **The phone.** On the owner's iPhone 17 Pro the heavy views dropped to 20-35 frames a second once the phone had drawn them a while; density
  1.0 with no shadow under `lowTier` (decision 236's verdict, built) took the heavy views to 47-60 (P5: one heavy segment of 13 dropping,
  the effects-off one). The phone's heavy frame is now about 1.47 million triangles (the shadow pass gone).
- **Not measured:** any integrated-GPU laptop (the protocol's own L1-L3 machine); any run since #62 on a desktop; and whether Visual effects
  off is slower on a phone (observed in four pairs, but its segment always ran last of its view: handed on, not decided).

### 8.2 What Stage 8's prototypes would add (counted; `tools/stage8/kit-census.js`)

**Counted** (`tools/stage8/kit-census.js`, `kit-census.json`; the low Pratzen view, 758 draw calls and 2.48 million triangles, both passes):

| piece | the build | the prototype | factor |
|---|---|---|---|
| a man (coat and fixed parts) | 204 triangles | 344 | 1.69 |
| a rider and his horse | 288 | 592 | 2.06 |
| a gun deployed (the piece alone) | 156 | 728 | 4.7 |
| a gun hitched up (the limber, the gun, four horses; the prototype's driver not counted) | 700 | 740 + 556 + 4 x 308 | 3.6 |
| a house (walls and roof) | 20 | about 30 (with the barns, the villages 8,736 in all) | |

The prototype's deployed battery also draws, behind each gun, its limber, four horses and a driver (the build draws none of them).

In that view the world pass draws 612,600 triangles of figures, 404,000 of trees, 200,200 of scrub, 134,400 of ground, 4,300 of standards and
5,300 of buildings (step 6's census, reproduced). `f-kit` on the three representative formations adds 50,300 triangles and no draw call (the guns are not yet on the field at
that clock; with them deployed, in `bat-front`, 93,800 and four calls);
the villages 6,800 and 10 calls; the outline cue removes 4,000 triangles and adds 31 calls.

**What the kit would cost on every formation (an estimate from the factors, not a measurement):** the figures' triangles would rise by
69-106% (all men to all riders), the 4x frame from 2.48 to 3.3-3.8 million triangles (+34-52%, both passes), the phone's heavy frame (one
pass, `lowTier`) from about 1.47 to 1.9-2.1 million (+29-44%). That is outside both budgets of section 8.3 by a wide margin. Three levers
bring it back: block culling (measured in step 6: 13.7% of the low view's frame, nothing in the Overview); a lighter kit (a target, not a
measurement: the prototype was shaped for the picture, not for its count, its man 140 triangles above the build's, and 8E's target is at most
1.3 times the build's per man); and the rich kit only where it is seen (a man 16 px or more: the low and close views), the build's kit beyond,
which is a level of detail by size on screen. Decision 235 retired level of detail for today's workload; a richer kit is a new one, so
question 249 asks for culling and question 242 for the kit with these limits.

### 8.3 Budgets, stated before anything is built

The budgets below are the acceptance conditions a Stage 8 PR is held to before it is merged; each is measured the way step 6 measured the
build (the census in this container; frame times only on the owner's devices). They are design values chosen here, put to the owner as
question 250.

| | budget | why this number |
|---|---|---|
| **phone (`lowTier`: density 1.0, no shadow)** | the heavy views' triangles at most 1.62 million (P5's 1.47 + 10%) and draw calls at most 10% above today's; else a phone run of the route of §2 in `docs/STEP6_SPEC.md` (P-run) holding the heavy segments' long frames at or under 5% in two runs | P5 is one run on one phone that held 47-60 frames a second at 1.47 million; 10% is the margin inside which a change is not expected to undo it (inference) |
| **desktop, discrete GPU** | the 4x frame at most 2.8 million triangles (+12%) and 900 draw calls (+5% over the heaviest view, 857) | the RTX 4070 runs had a margin of about 1.1-4x (medians of 1.7-6.1 ms against a 6.9 ms refresh); the binding device is not this one |
| **integrated GPU (not measured)** | no PR that raises the 4x frame's triangles or calls by more than 10% is merged before one run of the route of §2 on an integrated-GPU laptop (the protocol's L1, which was never run) | decision 138's "ordinary integrated GPU" (139's integrated-GPU laptop) is the machine the budget protects, and nothing is known of it |
| **CPU, the map layer** | the pass not above the build's in the same motions on the same idle machine by more than 0.5 ms at the median and 2 ms at the 95th percentile (the build: 1.1-3.0 ms and 1.8-12.3 ms, `label-motion.json`); on the desktop's own run, `js50` not above today's by more than 1 ms | the layout runs in every drawn frame; a stabiliser that costs more than the frame it saves is no gain; the build itself passes 8 ms at the 95th percentile in one motion, so the budget is relative |
| **animation** | the gait adds no draw call and no triangle; its CPU cost at most 0.2 ms a frame (uniforms per mesh); its vertex cost not measurable on the desktop route; the shadow pass, where drawn, takes the same rule or casts the rest pose (stated) | the swing is a few multiplies per vertex |

### 8.4 Batching, culling, level of detail and the animation's cost, reassessed against the new workload

- **Culling first, as step 6 found it would be.** In the low and close views about half the figures' world pass is off the screen (339 k and
  293 k triangles, `docs/STEP6_SPEC.md` §3.2) and is drawn anyway. Culling each block by its own bounds changes nothing on screen and nothing
  the self-test reads (§3.3). With a richer kit the saving grows in proportion: it is the lever that pays for detail where detail is seen.
  Decision 221 tied culling to a built 138; Stage 8 reopens it as its own question (249).
- **Level of detail by a man's size on screen.** A richer kit in the low and close views (a man 16 px or more) and today's kit, or less, in
  the Overview (4-8 px): the census's split (§3.1) is unchanged, so a two-form kit costs the low views its full increase and the Overview
  nothing. Step 6's far forms (a box per unit, thinning) remain measured options (§3.2) if a budget above is exceeded.
- **Batching (instancing across blocks).** It cut draw calls by 60-64% with the picture unchanged (§3.2), but rewrites every 6C and 6D check's
  reading (§3.3). It helps the CPU side only; the desktop's JavaScript was not the limit. Not proposed unless a device run shows calls are.
- **The animation.** The gait is in the vertex shader: a part attribute on the kit's geometry (one float per vertex) and two uniforms per mesh;
  no draw call, no triangle, no texture. The shadow pass would need a custom depth material per animated kit material to cast the moving
  pose, a second program per material kind (state the cost on the desktop route before choosing it); under `lowTier` there is no shadow pass.

### 8.5 The device route before and after, and the effects-off question

- **Before and after each PR that changes what is drawn**, the route of `docs/STEP6_SPEC.md` §2 (`tools/step6/perf-route.js`, unchanged)
  on the owner's desktop and phone (and an integrated-GPU laptop where one is available), reporting per segment the median, 95th and 99th
  percentile frame intervals, the long-frame share (above max(1.5 R, 25 ms)), frames a second, `js50` and, where offered, `gpu50`. A PR
  "holds" when no heavy segment's long-frame share rises above 5% where it was under, and no median moves by more than one refresh interval.
- **The effects-off diagnostic** (handed on by step 6): a bracketed run, the phone route's own form (`perf-run.html?route=phone`): after a 45 s
  warm-up, the blocks A (effects on) and B (effects off) in the order A B A B A B A in one view, each 6 s, twice, then again after a 3-minute
  rest with the order B A B A B A B, so that neither run order nor the phone's heating can be mistaken for the toggle; the rule stated before
  the run: effects off is slower if every B's median interval exceeds both its neighbouring As' in both runs and both orders. The route's
  change is a small one (`tools/step6/perf-route.js` takes a candidate list already); proposed as question 250 (b).
  **Corrected under decision 250** (section 0.3.1, item 10): in B A B A B A B the first and last B have one neighbouring A, so the rule above
  cannot be evaluated for them. In each order only the blocks with a block of the other kind on both sides are evaluated: in A B A B A B A the
  three Bs, each of which must have a median interval above both neighbouring As'; in B A B A B A B the three As, each of which must have a
  median below both neighbouring Bs'. Effects off is slower only if every evaluated comparison says so, in both runs and both orders; each run
  names the build it tested by its hash (the route reads and hashes it), and the runs compared are of the same build on the same device.

## 9. Findings carried from earlier reviews (checked on the build, not assumed)

The brief names three; each was checked on the unchanged build by real clicks, keys and taps (`tools/stage8/carried.js`;
`docs/stage8-evidence/carried.json`). The audit findings no roadmap step took up are checked after them, each against the current code,
and two faults this Part found in the build are recorded with them (9.5, 9.6). None is fixed here; each fix is proposed in PR 8A (section
10) or where it belongs.

### 9.1 The headquarters view: the dossier and the centring

**Measured (1600 x 900, Napoleon's headquarters' reading, 08:30; by real clicks).** Of the 13 Allied formations on the field the reading knows
6 not at all and 2 only as reported. For the four of the six probed (Buxhowden's command of the left wing, Kienmayer, Dokhturov,
Langeron), the full dossier's "Centre the map here" glides the camera to the formation's **true** position, every time to within 0.001
units (`targetToTrue` 0), where the reading draws nothing (no figures, no name: re-measured with each item
laid out in the current frame; the first run read one item's stale state). So the centring shows the visitor where a formation is that the
reading says the headquarters cannot see: the same class of leak decision 170 (b) closed for the plan links and the selection ring in step
5 (`readPos`), still open in `focusOn` (`posOf`, `app.js:6053-6056`). For the two reported only (the Russian Guard's infantry and cavalry,
`rg_inf`, `rg_cav`), the reading itself draws them at their true positions, as their C zones (`readPos` returns `posNow` for a tracked
formation the reading knows at all, `app.js:3480-3485`), so the centring there agrees with the drawing: no leak. The dossier itself opens
for an unknown formation, with its pill saying it is not known (decision 170 (c)); that is the reading's own answer. At the eye level,
centring on a known formation leaves the eye level (the camera glides to the formation, `EYE.on` false after) with the target at the free
rectangle's centre (0 px) and the reading kept: correct (S-3's fix, step 3).

**Proposed (8A, question 251):** under a reading, "Centre the map here" and the order of battle's rows centre on `readPos` (for a corps, its
known formations' mean, `aggReading`), and for a formation the reading does not know the button is replaced by the reading's sentence ("Not
known to Napoleon's headquarters at 08:30") and centres nothing; runtime-test holds it every 30 minutes for both readings, as it holds 170 (b).

### 9.2 The source notes' visibility

**Measured (Saint-Hilaire's dossier, opened by a click on the formation, 09:30; `sources`).** The compact card shows three claim tags and
"Accuracy and sources" is on the screen in the desktop layouts; but "How this is sourced" stands below the card's visible part at every size
(1600 x 900: its top 16 px above the box's foot and its bottom 12 px below it; 1366 x 768: 116 px below; 390 x 844 as a phone: 101 px below).
In the full dossier the sourcing is at its very end: the position's grade note 5,898 px and "How this is sourced" 5,965 px down a dossier
6,021 px tall, read in a box 774 px high at 1600 x 900 (7.8 boxes of scrolling); 5,726 and 5,793 px at 1366 x 768 (box 642 px); 3,737 and
3,805 px of 4,019 on the phone (box 428 px); on the phone "Accuracy and sources" is behind the Menu. A visitor reading the dossier as it opens
meets its sources only by scrolling to its end.

**Proposed (8A):** the dossier's head carries one line naming its sources' state (the position's grade and claim in words, as the pill does)
with a link to "How this is sourced" (a jump within the dossier, focus moved there); the compact card's button raised above the fold at every
size (the card's buttons in one row); the order of the full dossier otherwise unchanged (decision 203's structure). The self-test holds that
the link is inside the visible box at 1366 x 768 and on the phone.

### 9.3 The timeline's tip and the keyboard focus

**Measured (`tips`).** By the keyboard (1600 x 900): Tab to an event marker shows its tip (below the marker, not over it); Enter opens the
event's dossier and **the tip stays shown, with the focus still on the marker**; the first Esc hides only the tip, a second Esc closes the
dossier (the focus back on the marker, no tip shown on the focus's return: correct). By the mouse: the tip shows on hover, stays after a
click, and hides 400 ms after the pointer leaves, though the focus stays on the clicked phase: correct. On a phone, a tap on an event marker
opens the dossier and **the tip stays on the screen over the timeline** (still there 3 s after the tap): on touch nothing hides it. WCAG 1.4.13
is met (it is dismissible, hoverable, persistent); the faults are that it outstays its use once the element is activated, costs a keyboard
user an extra Esc, and on touch covers the timeline.

**Proposed (8A):** the tip hidden when its element is activated (Enter, Space, a click, a tap), shown again only by a new hover or focus; on
touch, never shown by a tap (a tap activates; the tip is the hover's); Esc then closes the dossier at the first press. The self-test's
event-marker check extended to Enter and Esc by real keys, and the phone case to a tap.

### 9.4 The audit's findings no step took up (`docs/FINAL_AUDIT.md`; status at `9eb7abb`)

| finding | what it said | today | where it goes |
|---|---|---|---|
| **A-5** (minor) close views read as a toy | the closest views filled by standards and arrow ribbons; at the eye level the arrows show through the hills | **present** (`pratzen-low-base.jpg`, `inf-front-base.jpg`, `eye-zuran` views; the arrows still `depthTest` false) | 8B (the arrows' cap and depth test, the glyph cap), 8E (the kit, the standards' cloth) |
| **S-5** (minor) state that depends on the path to the clock | a stationary formation's facing is cached per phase (`faceCache`), so it is the facing at the first clock visited in the phase | **present** (`app.js:4686-4707`, unchanged: the key is `curPhase+"|"+id`) | 8E: with the gait the pose is the clock's; the facing should be too (per leg, or per clock minute); presentation |
| **S-7** (polish) smaller timing seams | a speed change inside a dwell's ease keeps the old ease; a relief change during a glide leaves Follow idle (`_tw.cam` kept); the knowledge rule steps with the phase's mist while the fog eases | **present** by the code (`dwellAdvance` fixes `te` on entry and `setSpeed` does not reset it, `app.js:7293`, `7338-7362`; `redrawGround` sets `tween=null` and leaves `_tw.cam`, which `followActive` reads, `app.js:1920`, `7395`); not re-measured | 8H (two small fixes; the third has no visible effect, the reviewer's sampling) |
| **A-6** (polish) | the focus ring 1 px; no `main` landmark; "What changed" an `h4` under an `h2` | **present** (`style.css:12`, `shell.html` has no `main`, `app.js:6372`) | 8H (outside Stage 8's subject; listed so it is not lost) |
| **G-2** (polish) | the map-to-world factor typed outside `geo.js` | **present** (`app.js:6986` types `len*0.5/UNITS_PER_KM`; `world.js:36`'s `W` types 0.5, guarded) | a records-and-polish commit; `KM_PER_MAP` at `app.js:6986` |
| **P-2** (minor) about a quarter of the file never run by a visitor | the self-test 12.8%, comments 10.1% | **present, larger**: the self-test 15.0% (333,611 bytes), comments 11.1% (`tools/audit/size.js`, re-run) | question 140 stands (decided "keep the self-test in the file"); Stage 8 adds to the self-test |
| **P-3** (polish) idle work per animation frame | `loop()` runs `syncFollow`'s `querySelectorAll`, `openingWatch`, `paintDevStats` every frame | **partly fixed**: step 5 (SW-13) finds the buttons once; the three calls still run before the idle test (`app.js:7600-7608`) | 8H: the gait's per-frame uniform update must run after the idle test, or the page would wake to animate nothing |
| **P-4** (polish) start-up cost of the relief grid | +0.45 s, recorded in 2E, not re-measured | not re-measured here | 8H, with the device route's load time |
| **T-7** (minor) wall-clock thresholds | the map layer's 8 ms, the self-test's 2 ms pan budget, the harness's 20 s wait | **present** (`app.js:9409-9414`, `tools/visual/thresholds.js`) | Stage 8's own timing measures (section 8.3) are medians and 95th percentiles over runs, never a single frame |

### 9.5 Found in this Part: the roads and the streams are never drawn

**Measured** (`tools/stage8/stream-vis.js`, `stream-vis.json`): in each view the streams' material painted magenta, the banks' cyan and the
roads' yellow, and the pixels the paint changes counted, as built, then drawn double-sided, then with no depth test as well. As built they cover
nothing, or almost nothing, in all eleven views probed (the Goldbach from straight above at noon at 1x, 4x and 10.33x and from its west bank
at 1x and 4x, the Field vantage, the low Pratzen view, Telnitz, Sokolnitz, close on Sokolnitz and the Goldbach at 08:20): the streams
**0 pixels** in ten of them (82 in the eleventh, of 17,036), the banks and the roads at most 5% of what they would cover, and that only where
the ground rises above the eye and a ribbon is seen from below (the roads in `stream-low`, 2,924 of 56,656 pixels). Drawn double-sided they
cover 851-56,106 pixels of streams, 1,628-70,400 of banks and 8,809-147,446 of roads in a view (in Telnitz the roads alone a tenth of the
frame); after each view's paint was undone, no pixel of the frame differed from the first by more than 40 of 255. **Why (fact,
`world.js:1144`):** `ribbon()` lays each ribbon's rows across the course and indexes its triangles `(o, p, o+1)`, which winds every one of them
facing down whatever the course's direction; the stream, bank and road materials keep three.js's default front side, so seen from above,
as every view of the map sees them, the renderer culls them all. What a visitor sees of a road or a stream is the ground shader's own cover
classes under it (Stage 2F: the road class where the road raster says so, the water and damp classes along the streams). The paper map
drapes the same ribbons flat and looks at them from straight above (its own 2F check, `app.js:8234`, is geometric too), and draws none of
them either: in its two views (as entered, `paper-north-up`, and close, `paper-close`) 0 pixels as built, and double-sided 2,294 and 36,935
pixels of streams, 1,146 and 29,108 of banks, 6,329 and 36,086 of roads; there too the roads and streams are only the ground's cover classes. The same winding and front-side materials stand in every archived build from Stage 0 on (inference from the code,
`archive/`; not measured on the archives). **Why no check saw it:** the self-test's 2F check (`roadDrape`, `app.js:8377`) holds every ribbon
vertex at its lift above the drawn ground and every edge above it, and a paper-map check of the self-test (`app.js:8229`) reads the water's `visible` flags:
both are true of ribbons the renderer never draws. It is the kind of check roadmap step 1 made strict elsewhere (decision 131: a check that
cannot fail).

**Proposed (8A, question 253):** the ribbons wound facing up (the index order reversed in `ribbon()`; the materials, widths, lifts and colours
as they are), so that the roads, the streams and their banks are drawn as 2F meant, on the landscape and on the paper map (the same ribbons
draw there: the paper map changes too, and its captures go with the landscape's in the before and after); the self-test's 2F check extended to
count each ribbon class's drawn pixels where it lies, as `stream-vis.js` does, so that it fails on an undrawn ribbon; the captures before and
after put to the owner in 8A, since the widths are symbol widths no one has yet seen drawn (the Goldbach 2.8 units, about 177 m, the Littawa 3.2,
the brooks 1.4, on banks of 4.6, 5.0 and 2.4; the roads 1.2-2.9 on edges 1.1 wider, 2.3-4.0). It adds no draw call and no triangle (the ribbons are submitted to the renderer today and culled there), only the pixels they
cover. The streams' look (`w-stream`, question 246) is 8F's, on ribbons that are drawn.

### 9.6 Found in this Part: the phase's message under the view switch

**Measured** (`tools/stage8/toast.js`, `toast.json`, `toast/`): one phase carries a message (`PHASES[3].flash`, "The sun of Austerlitz, as
memoirs call it", at 08:45), which `flash()` shows for 3.4 s whenever `setClock` brings the clock into the phase other than instantly
(Play; the time rail's keys and pointer; the step buttons and the arrow keys; an event's marker, "Go to this moment" and a day-track's
anchor; a phase's or an act's button), and again whenever a phase's button, a chapter or a tour stop sets the clock inside the phase
(each sets it with `force`: `setPhase`, `setChapter`, `applyTour`). In Study the toast is centred on the free area beside the docked rail
(`#toast`: `left: calc(50% + var(--rail)/2)`, `top: 26px`, z-index 40) and the view switch on the window (`#viewmode`: `left: 50%`,
`top: 14px`, z-index 42). After a real PageDown on the time rail from 08:40, at 1600 x 900, 1366 x 768 and 1280 x 720 alike, the two boxes
overlap by 77 x 22 px, 17.6% of the toast's, and the switch is drawn over it: the message reads "...f Austerlitz, as memoirs call it", its
first words hidden (`toast/*-study.jpg`). In Watch the switch stands in the timeline's control row and nothing overlaps. The probe clears
the toast's timer before its capture (a software-rendered capture outlasts the 3.4 s), and its page, as every probe's here, has the CSS
transitions off (`tools/stage7/lib.js`); the boxes depend on neither. **Proposed
(8H):** the toast placed clear of the switch (below it, or the switch's box taken as its obstacle), and `toast.js`'s overlap made a check
in Study and Watch at each size the harness measures.

## 10. The implementation plan: PRs in order

The brief's provisional order (presentation, ground cues, arrows and label stability; rendering preparation; troop detail and motion;
buildings, vegetation and ice; integration) is kept, with three changes the findings justify: the carried findings first, in a small PR of
their own (they are correctness, not appearance, and two of them sit in code the later PRs touch); the presentation work split in two
(what is drawn on the ground and over it, then the map layer's algorithm, whose checks differ); and water and woods separated from the
buildings, which need an evidence step that water does not. Each PR is a draft for review, measured before and after, recorded in
`CHANGELOG.md`; each changes the build (`check:baseline` moved); none changes data unless named as a data task, and then `check:data`'s
reference moves with every changed declaration listed. No limit of `tools/visual/thresholds.js` is loosened; a measure that a PR replaces
(`CONF_SHARE` in 8B) or adds (the motion measure in 8C) gets its limit as that PR's build measures it, put to the owner in that PR, as
decisions 141, 199, 214 and 232 were.

| PR | what | answers | needs |
|---|---|---|---|
| **8A** | the carried findings (section 9.1-9.3); the roads and streams drawn (9.5) | the brief's carried findings; 9.5 | questions 251, 253 |
| **8B** | the ground under the troops; the arrows and the event glyphs calmed | L1; A-5; 7.1, 7.6 | questions 239, 241 |
| **8C** | the map layer in motion; the hierarchy by distance in the low views | L2; 7.2 | question 240 |
| **8D** | rendering preparation: the blocks culled by their bounds; the kit's part attribute and the gait's shader hooks; the census held by a check; the device runs before | section 8 | questions 249, 250 |
| **8E** | the troops: the kit for every class, the artillery, the gait; the facing per leg (S-5) | L3; S-5 | questions 242-245; 8D |
| **8F** | the water; the woods and the near ground | L4; 7.3, 7.4 | questions 246, 247 |
| **8G** | buildings: the evidence step, then the villages, then the landmarks (a data task) | L5 | question 248 |
| **8H** | integration: accessibility, the device runs after, the effects-off bracket, S-7, the open polish findings | all; 8.5; 9.4; 9.6 | everything above |

### 8A: the carried findings, and the roads and streams drawn
- **Benefit:** the knowledge rule holds for the camera too (no centring on what the reading cannot see); a dossier's sources are one
  link from its head; the timeline's tips stop outstaying their use; the roads and the streams drawn on the landscape and the paper map, as 2F meant (9.5).
- **Systems:** `app.js` (the dossier's centring under a reading; the dossier's source block; `bindTimeTips`; the self-test's `roadDrape`
  check extended to the ribbons' drawn pixels); `world.js` (`ribbon()`'s index order); the self-test, runtime-test, `terrain-test.js`.
- **Evidence:** none (presentation); `carried.js` and `stream-vis.js` re-run as the before and after.
- **Performance:** none for the three carried findings; the ribbons add no draw call or triangle, only the pixels they cover.
- **Acceptance:** under each reading, every 30 minutes, "Centre the map here" and the order of battle's rows centre on `readPos` within
  0.5 units, and nothing for a formation the reading does not know (runtime-test, as for 170 (b)); the dossier's source link inside the
  visible box at 1366 x 768 and on the phone (the self-test); Enter, then one Esc closes an event's dossier with no tip left shown (real keys),
  and a tap on a phone shows no tip (the phone case); `carried.js` re-run showing each fixed; every stream, bank and road ribbon drawn where
  it lies (`stream-vis.js`: drawn as built within 5% of drawn double-sided in the Goldbach views at 1x, 4x and 10.33x; the self-test's ribbon
  count at each factor), its lift and edges as 2F's check holds them, and every check:visual limit held with the ribbons drawn (map text at
  AA over them, the drops unchanged).

### 8B: the ground under the troops; the arrows and the glyphs
- **Benefit:** the owner's L1 removed: no coloured wash under the troops by default; side and position still readable at every distance;
  the arrows read as annotations at every distance and stop showing through the hills; the close views lose their largest symbology.
- **Systems:** `app.js` (`CONF`, `confPlace`, `groundPatch`, decision 107's `side7`, the selection ring; `drapedRibbon`'s width and depth;
  `SYM_MAX_PX`; the legend's rows; the Layers panel's default); `tokens.js` only if a new outline casing colour is needed (the side's `edge`
  tokens exist); `style.css`; the self-test (5B's confidence checks, 6C's side cue, the legend), `css-test.js` (decision 85's default),
  `runtime-test.js`, `binding-test.js` (unchanged: paths and kinds), the harness (`CONF_SHARE` replaced by the ground cue's share).
- **Evidence:** none; it is presentation. Decisions superseded or restyled: 85 (on the landscape), 87, 107 (question 239); 57's value (241).
- **Performance:** the outline is two meshes a formation (its casing and its line): 62-64 draw calls and 8,300-8,700 triangles in the seven
  views measured, against the marks' 31-32 calls and 12,500-14,600 (section 2.3, `ground-stills.json`): about 31 calls more than today
  unless the outlines are merged into one mesh, and 4,000-6,000 triangles fewer; the arrows unchanged in count; the glyphs smaller.
- **Acceptance:** in every check:visual view: no filled side-coloured area under a formation drawn as figures (the share of the free
  rectangle within 6 px of a formation's footprint whose colour is within 10 of a side token, measured as `confShare` is, 0 for fills); every
  formation on the field locatable at the Field vantage and the Overview (its outline or its name drawn, by the self-test at 20 clocks); the
  outline never under the drawn ground and never dashed (sampled every 0.5 units, as the skeleton's legs); with "Position confidence" on, its
  extents decision 86's at each factor (the self-test's 5B checks, rewritten to the outline); every arrow's casing at most 16 px across at its
  middle in every perspective view, its path, kind, head form, colour, label and draw-on as `binding-test.js` holds them; at the eye level no
  arrow fragment drawn where the ground hides it (the eye-zuran cases, read against a depth-only frame); every glyph at most 64 px; no limit loosened (no drop
  limit raised, no unobstructed baseline lowered; where a view measures better, a limit tightens only on the owner's word).

### 8C: the map layer in motion
- **Benefit:** the owner's L2: the counters and names stay where they are, beside their own anchors, while the view moves; what has no room
  fades out and back, rather than jumping across the screen; in the low views the far items drawn a step smaller (section 7.2).
- **Systems:** `app.js` (`mlLayout`, `mlPlaceItem`, a `prev` box per item, the motion state read from the tween, the input hold and Play;
  `updateVisibility`'s level-of-detail band; the fades in `style.css`, none under reduced motion); the self-test's map-layer checks; the
  harness: a motion block (`label-motion.js`'s motions, by real input where the harness has it) added to `check:visual`.
- **Evidence:** none.
- **Performance:** the pass's CPU time held to section 8.3's budget (not above the build's in the same motions by more than 0.5 ms at the
  median and 2 ms at the 95th percentile, on an idle machine).
- **Acceptance:** over the 16 motions of `label-motion.js`: jumps at most 300 (the prototype's 249, against the build's 4,003), pops at most
  1,300, level-of-detail switches not more than the build's 165, no overlap among live items in any frame, flickers at most 200; at rest every view's drops and
  dropped ids identical to the build's in every view reached without motion, the never-dropped items never hidden while moving, every dropped item
  reachable by hover and keyboard (decision 39), a focused item never hidden (step 3's A-2); the limits put to the owner as measured on the 8C
  build.

### 8D: rendering preparation
- **Benefit:** headroom for 8E where it is spent: the figures off the screen no longer drawn; the gait's hooks in the kit; the census as a check.
- **Systems:** `app.js` (each block's bounds and `frustumCulled` on its meshes, the kit's part attribute, the gait material's
  `onBeforeCompile` and its depth material); `tools/step6/census.js` made a harness measure; the self-test's figure checks read through culling
  (a culled block's meshes are still its own).
- **Evidence:** the device route of `docs/STEP6_SPEC.md` §2 on the owner's desktop and phone before (and, if one can be had, an
  integrated-GPU laptop: L1, never run).
- **Performance:** expected about 339,000 (the low Pratzen view) and 293,000 (close on Sokolnitz) fewer
  triangles in the low and close views (`docs/STEP6_SPEC.md` §3.2) (step 6's measure of what is off the screen), none in the
  Overview; no change on screen.
- **Acceptance:** the frame identical in every check:visual view (the image differences within the harness's noise, the self-test's figure,
  standards and seating checks unchanged); the census per view recorded; the triangles in the low Pratzen view down by at least 10% (step 6
  measured 339,000 of the world pass's figure triangles off the screen there, 13.7% of the frame; the shadow pass, culled by the light's
  frustum, saves less).

### 8E: the troops
- **Benefit:** the owner's L3: men, horses and above all guns that read as such in the close views; batteries that hitch up and move off as
  a battery does; marching that is seen as marching at the speeds a visitor plays.
- **Systems:** `app.js` (`figKit`, `kitGeo`, `GEO`, the battery's groups in `makeBlock`, the standards' cloth; the gait's uniforms per block;
  `enemyFacing` per leg, S-5); the self-test's 6C, 6D and seating checks (shapes change, colours and claims do not), `css-test.js`;
  `appearance.js` only through a data task if question 243's team sizes are recorded.
- **Evidence:** section 4.4: the team sizes, drivers and wheel sizes read (Gassendi, Alombert, Viskovatov and the Austrian sources), each
  graded and labelled in `appearance.js` before it is drawn, or the generic value labelled GENERIC.
- **Performance:** on every formation the prototype's kit would add 34-52% to the 4x frame (section 8.2): built only with 8D's culling, a kit
  of at most 1.3 times the build's triangles per man, and the rich kit only where a man is 16 px or more on screen (today's kit beyond),
  within section 8.3's budgets.
- **Acceptance:** every 6C and 6D check passes unchanged in meaning (class colours, headgear, cuirasses, standards' measures, the ratio of
  decision 106 within 2%); the gait's rule held by the self-test at 1x, 4x and 10.33x: the pose identical at a clock reached from three earlier
  clocks, still with the clock stopped, no swing on a halted formation, below 1 km/h or under reduced motion, the fade above 3.2 cycles a second, a formation's parts faded together (by its fastest-cycling part); figures
  seated on the drawn ground within the existing tolerance in every pose; the budgets of section 8.3.

### 8F: water, woods and the near ground
- **Benefit:** the owner's L4: the meres read as ice on a field, not as plates; the streams as winter brooks, not bright ribbons; the woods
  less like solid masses; the foreground of a low view less smeared.
- **Systems:** `world.js` (the meres' material and shore ring, `WATER_COL` (the colours, `world.js:1188`) and `ICE` (the material's values,
  `world.js:1189`), the streams' ribbons, `treeKit`, the ground shader's near detail); the self-test's ice checks (4E: under their own edge at each factor, one disc and one ring per
  mere), `terrain-test.js`, `css-test.js` (the colours in their tables).
- **Evidence:** section 5.2 (the weather on the day; the meres' ice); the conifer shares stay unsourced design values until read.
- **Performance:** the ice and stream shaders a few more instructions per fragment over a small area; the trees' triangles held at or under today's per tree (the trees are
  32.6% of the low Pratzen view's frame); not prototyped in Part A: 8F begins with a prototype measured against 2F's checks.
- **Acceptance:** the meres' outlines, the shore ring and the streams' lines exactly where they are (decision 27; terrain-test's edges at 1x,
  4x and 10.33x); no cracking, breaking, open water, snow or figure on the ice (`docs/STAGE4_SPEC.md` §F.1's rule as 4E built it; the self-test's ice checks); every new colour in
  `WATER_COL`, `LAND_COL` or `COVER_COL`; no animated water unless question 246 (c) is chosen, and then none under reduced motion or with
  the clock stopped.

### 8G: buildings and structures
- **Benefit:** the owner's L5: villages that read as Moravian villages of the period, and the landmarks the narrative names drawn where they
  stood.
- **Systems:** `world.js` (`VILLAGES`' houses laid along their lanes, the roofs, the churches, the castle), a data task for the landmarks
  (`data.js` `FEATURES` or `world.js`'s structures, each with its source and grade); `css-test.js`, `terrain-test.js` (the village
  footprints unchanged), the self-test's settlement checks.
- **Evidence:** first, a reading step (section 6.2's leads: Wolny 1836-1837, Schwoy 1793, the stable cadastre's maps of the 1820s, the
  Second Military Survey), each landmark graded; the roof mix and the building types per village from the cadastre where it can be read,
  else labelled DESIGN.
- **Performance:** the prototype's villages 8,736 triangles a pass (with the landmarks 10,184) against the build's buildings' 5,340 in the
  low Pratzen view (`kit-census.json`); the frame, both passes, 6,800 triangles and 10 draw calls more with the villages, 8,100 and 15 with
  the landmarks (`building-stills.json`).
- **Acceptance:** every village's footprint and every house inside it as before (2E's paper-map test, 2F's cover test: the share of houses whose centre lies in the drawn
  village cover class not below today's: 57.0% of the build's, 59.2% of the prototype's); every landmark at its sourced position within its grade's tolerance, with its claim in the dossier.

### 8H: integration
- **Benefit:** the whole measured together, on the owner's devices; the open polish findings closed (section 9.4's, and the phase's
  message whose first words stand under the view switch in Study, section 9.6).
- **Systems:** all; `style.css` (`#toast`); `check:visual`, `check:contrast`, `check:selftest`.
- **Evidence:** the device route after (desktop, phone, and an integrated-GPU laptop if one can be had); the effects-off bracket (section 8.5).
- **Acceptance:** section 8.3's budgets on every device run; every check passing; the phase's message clear of the view switch in Study and
  Watch at every size the harness measures (`toast.js`'s overlap 0, made a check); the records.

## 11. Questions for the owner (239-253)

**Decided on 24 October 2026: section 0.3, with the owner's qualifications and the points they settle (0.3.1).** The table below is Part A's
text as the owner read it.

Each question names its options, a recommendation, what it would supersede or extend, and its cost. Nothing is decided by this document; the
build stays as it is until the answers. A limit of `tools/visual/thresholds.js` moves only on the owner's word, in the PR that measures it.

| # | question | options | recommended | supersedes or extends | cost |
|---|---|---|---|---|---|
| **239** | The ground under the troops (L1; section 2) | (a) remove the marks and decision 107's footprint from the landscape (`g-none`); (b) **a thin cased outline** of the footprint in the side's colour under every formation drawn as figures, the selection outlined in the accent, "Position confidence" an optional layer **off by default on the landscape** drawing the grade's extents as outlines (`g-outline`, `g-confline`), the paper map as today; a reported-only formation's C zone and the eye level's own side kept as they are (decision 91), and at 1x the footprint drawn by its grade whatever the layer; (c) a small cased chevron ahead of each formation (`g-marker`) with the same optional layer; (d) as today | **(b)** | supersedes 85 on the landscape (on by default); restyles 87 and 107 (a footprint under every formation, drawn as its edge); keeps 86, 88, 91, 1, 4, 15 (one hue a side, no dash: each outline split on the drawn ground's triangles), 34 (1x drawn as today), the pads | PR 8B; the 5B and 6C self-test checks rewritten to the outline; `CONF_SHARE` replaced by the outline's share, its limit as 8B measures it; `css-test.js`'s default; the legend; about 31 draw calls more unless the outlines are merged into one mesh |
| **240** | The map layer in motion (L2; section 3) and its hierarchy in the low views (section 7.2) | (a) **anchor2 with the band, and fades**: held beside its anchor while the view moves, else faded out; looked for again every 333 ms; the level-of-detail switches banded 8% while moving, released at rest; at rest each item first tries its last place; **and the far items a step smaller**; (b) as (a), and the far items yielding first in the low views (more drops there: their limits only on the owner's word); (c) persist+hold: the last place first, a returning item after four frames with room, the band, without the fades; (d) as today | **(a)** | none; decisions 24, 38, 39 and 47 kept as invariants (section 3.4) | PR 8C; a motion block added to `check:visual`, its limits as 8C measures them |
| **241** | The arrows and the event glyphs (section 7.1, 7.6; A-5) | (a) **each arrow's width capped at 16 px on screen in the two perspective presentations, the arrows depth-tested against the drawn ground alone, their fill at 0.62 of today's opacity, the glyphs capped at 64 px** (`a-calm` with section 7.1's two changes: the ground-only depth test, and the lines of battle, boundaries and halt bars keeping their widths and opacity); (b) the cap only (`a-cap`); (c) as today | **(a)** | decision 57's value (192 px) and 2C's "over everything" (the depth test); keeps 1, 15, 20, 21, 83 (form, dash, chevron, boundaries, draw-on) | PR 8B; `binding-test.js` unchanged; the eye-level cases read against a depth-only frame |
| **242** | The figures' kit (L3; section 4) | (a) **`f-kit` for every class**: the man, the horse and the rider redrawn in more parts, every colour, headgear and cuirass from the existing claims; (b) the artillery only; (c) as today | **(a)** | extends 6C's shapes (DESIGN); keeps 97, 100, 102, 103, 104, 106, 109 | PR 8E; on every formation the prototype's kit would add 34-52% to the 4x frame: only with culling (249), a kit of at most 1.3 times the build's per man, and the rich kit where a man is 16 px or more on screen, within section 8.3's budgets |
| **243** | The artillery (L3; section 4.4) | (a) **the generic field piece**: spoked wheels in Gassendi's proportion, a bracket trail, the French coffret between the cheeks when limbered, the Allied limbers' box, one driver a vehicle (two for six horses: IV Corps' order, an authorisation), the limbers and teams behind the deployed guns, four horses a drawn gun, one carriage colour, the switch between the groups as today; each reading registered in `appearance.js` first; (b) as (a), with each army's carriage colour where sourced (French olive, Austrian ochre, the Russian generic); (c) as today | **(a)** | (b) would extend 109 ("one colour unless each army's is sourced": two of three are) | PR 8E with its data task (the readings of `leads.md` topic 1, graded and registered) |
| **244** | The gait (L3; section 4.3) | (a) **the clock's gait**: the swing's phase a function of the clock alone (the modelled track's distance over a design stride), its amplitude the play speed's (full up to 3.2 cycles a second on screen, none above 4.8, a formation's parts together, eased when the speed changes), none under reduced motion, when halted, or below 1 km/h (the drift of an undated leg, decision 45); (b) no gait; (c) a gait in real time | **(a)** | none (VISUAL_AUDIT's "do not animate losses" kept: no figure falls) | PR 8D (the shader hooks), 8E; no draw call, no triangle |
| **245** | Facings (decision 104; section 4.6) | (a) **keep decision 104**: no facings; (b) class-level facings where the table settles them at A or B, after a data task gives them colour classes (today the French line and the Guard's foot grenadiers; the Allied classes' facings are regimental) | **(a)**, reconsidered after 8E | (b) extends 104 | none for (a) |
| **246** | Water (L4; section 5) | (a) **the meres' ice varied in material and light** (`w-ice`: a frosted margin easing into clearer, glossier ice; a broad tonal variation; a stronger reflection at grazing angles; the shore ring feathered), **the streams darker and less blue** (`w-stream`), **still, no stream ice**; (b) as (a) with edge ice on the streams; (c) as (a) with the streams flowing; (d) as today | **(a)** | keeps 27 (outlines), §F.1's rule (no crack, hole, snow or figure), 79 (the colours' tables) | PR 8F; (c) would make an idle page draw about 11 frames a second whenever a stream is in view |
| **247** | Woods and the near ground (section 7.3, 7.4) | (a) **airier deciduous crowns** and a little more variation, the conifer shares kept until sourced; **a detail layer near the eye** on the ground (no new class or colour); (b) the woods only; (c) as today | **(a)** | keeps 2F's cover checks and "bare winter trees, frost on north-facing slopes, crop strips" | PR 8F; the trees' triangles per tree held at or under today's |
| **248** | Buildings and landmarks (L5; section 6) | (a) **the villages re-laid on the cadastre's pattern** (dwellings end-on or L-shaped to the street, barns across the yards' ends; the roofing a placeholder until read), the churches turned east-west, **then, after an evidence step and a data task, the landmarks the sources support**: the Sokolnitz castle as Wolny's quadrangle, the fences round Telnitz and Sokolnitz; the two chapels once their state on the day is settled (St Anthony's roof not found; the Santon's destroyed during the battle); (b) the villages only; (c) as today | **(a)** | keeps 14 (the building scale), 2E's village footprints, the villages' places and counts; the landmarks are a data task (`data.js` or `world.js`, with their claims) | PR 8G; the villages about 8,700 triangles, 10,200 with the landmarks |
| **249** | Culling the figure blocks (section 8.4) | (a) **each block culled by its own bounds** (decision 221 tied culling to a built 138, which decision 235 retired), in 8D, before the kit; (b) not | **(a)** | reopens 221's condition | PR 8D; nothing on screen changes; the self-test's figure checks read through it |
| **250** | Budgets and device runs (section 8.3, 8.5) | (a) **the budgets of section 8.3** (the phone's heavy views at most 1.62 million triangles, the desktop's 4x frame at most 2.8 million and 900 calls, the map layer's pass not above the build's in the same motions by more than 0.5 ms at the median and 2 ms at the 95th percentile, the gait free of calls and triangles), **an integrated-GPU run before any PR adding more than 10%**, the device route before and after the PRs that change the drawing; (b) as (a), and **the bracketed effects-off run** on the phone (section 8.5) | **(b)** | keeps 236's `lowTier` | the owner's runs: about 15 minutes each |
| **251** | The carried findings (section 9.1-9.3) | (a) **fix all three in 8A** as section 9 proposes: the centring on a formation the reading does not know withheld, the dossier's sources one link from its head, the timeline's tip hidden once its element is activated; (b) fix 9.1 only (it is the knowledge rule's); (c) record them | **(a)** | extends 170 (b)'s rule to the centring | PR 8A, small |
| **252** | The plan (section 10) | (a) **PRs 8A-8H in that order**, each a draft for review with its measures; (b) another order | **(a)** | none | as section 10 |
| **253** | The roads and streams drawn (section 9.5) | (a) **the ribbons wound facing up in 8A**, with their materials, widths and colours as they are, on the landscape and the paper map alike, a self-test check that counts them drawn, and the captures of both before and after put to the owner; (b) as (a), and the widths set again first (the streams 1.4-3.2 units on banks of 2.4-5.0, the Goldbach's 2.8 about 177 m; the roads 1.2-2.9 on edges of 2.3-4.0); (c) left undrawn (the ground's cover classes carry the roads and streams, as today) | **(a)** | none: 2F meant them drawn; keeps 27 (the streams' lines where they are) | PR 8A; no draw call or triangle, the pixels they cover; the self-test's 2F check made able to fail |

## 12. Verification, and what remains to be measured

### 12.1 What was run, with its result

| check | result |
|---|---|
| `npm test` on `main` at `9eb7abb` (before any Stage 8 file existed) | all nine suites and the height guard pass (5 min 47 s) |
| `npm test` on the final tree (every probe, prototype, capture and record of this Part in place), after the last recordings | all nine suites and the height guard pass (5 min 23 s): no warning unacknowledged, "console.warn unique" 0 |
| `npm run check:data` on the final tree | 131 of 131 declarations byte-identical to `archive/step5c-45f8f662.html` |
| `npm run check:chronology` on the final tree | 0 errors; the movement audit 0 findings |
| `npm run check:baseline` on the final tree | passes: `austerlitz-command-map.html` 2,220,714 bytes, md5 `c4793156103b60bb74151c7d13dbdd9d`, unchanged by this document |
| every probe of `tools/stage8/` | run to its end on the build above; outputs in `docs/stage8-evidence/` (the README lists each) |
| each prototype undone | the frame after each prototype's removal compared with the frame before it in draw calls and triangles: 72 removals checked by `stills.js`, 69 equal; the three close on Sokolnitz (the arrows) 10 triangles fewer, exactly the frame of the build's own rebuild of its overlays with no prototype (`a-rebuild`, section 7.1); the ribbon probe's paint undone in its 13 views with no pixel changed by more than 40 of 255 |

Not run here, because nothing in the build changed: `check:visual` (passed on this build: its 39 cases, the self-test's 242 checks and the
live blocks, `CHANGELOG.md`'s entry for decision 236's verdict); `check:contrast` and `check:selftest`, which CI runs on every push and pull
request (decision 132), this branch's included. The probes' prototypes never enter the build; no limit moved.

### 12.2 What was not measured, and why

- **Frame times.** The container has no GPU; every timing here is the layout's CPU time or software WebGL's, said to be. The budgets of section
  8.3 are counts (triangles, draw calls) here and frame times only on the owner's devices.
- **The photographs.** The nine photographs the brief names did not reach the session; section 1 rests on direct captures. If they are sent
  again, section 1.3's assessment can be checked against them.
- **An integrated GPU.** Never measured (step 6's L1 was not run); section 8.3 makes it a condition before a PR that adds more than 10%.
- **The effects-off question.** Handed on by step 6; the bracketed protocol of section 8.5 is ready, not run.
- **The archived builds' ribbons (section 9.5).** That the roads and streams were never drawn in earlier builds is read from their code (the
  same winding and front-side materials from Stage 0 on), not measured by drawing them.
- **The sources of section 4.4, 5.2 and 6.2.** Read by machine readers in this session (page images where the README says so, else the text
  layer); none by a person; none entered into `appearance.js`, `data.js` or the registers: they are leads for the evidence steps of 8E, 8F
  and 8G, each to be graded there.

### 12.3 Device measurements the owner is asked for (with the PRs, not now)

| when | device | route | why |
|---|---|---|---|
| before 8D | desktop (the RTX 4070) and the iPhone 17 Pro | `docs/STEP6_SPEC.md` §2 (desktop), `perf-run.html?route=phone` (phone) | the reference the Stage 8 PRs are compared with (P5 and L1-L3 were on earlier builds) |
| before 8E is merged | an integrated-GPU laptop, if one can be had | §2, L1 | section 8.3's condition for any PR adding more than 10% to the frame |
| after 8E and after 8H | desktop and phone | as before | the budgets of section 8.3 |
| once, any time | the phone | section 8.5's bracket | the effects-off question |

### 12.4 The independent review

An independent reviewer (read-only, on the draft of 23 October, with the code, the decision records, the evidence and the leads register)
reported 23 findings: 3 blocking, 11 medium, 9 low. Each was checked against the code and fixed here, or is recorded:
- **Blocking, fixed.** (1) The ground cue: under "Whose eyes?" a reported-only formation is drawn as its C zone whatever the toggle, and the
  eye level's own side as its marks (decision 91), and at 1x the footprint follows the layer: (b) now keeps both drawings and draws 1x by
  its grade whatever the layer (sections 2.1, 2.4, 2.5, question 239; decision 91 added to section 0.1). (2) Section 6.3's `b-landmarks` row
  described the prototype as it was before the leads were read (a roofless chapel, a pheasantry wall): rewritten to what it draws. (3) The
  chapels "with their roofs" were called supported: St Anthony's roof on the day is not found and the Santon's chapel was destroyed during
  the battle; both are now left to 8G's evidence step (sections 6.2, 6.4, question 248, the summary).
- **Medium, fixed.** Carried finding 9.1 named the two reported formations wrongly (they are the Russian Guard's infantry and cavalry) and
  claimed a leak for them that the code does not have (`readPos` is their true position): the finding is the four unknown formations'; the
  probe's name check read stale states and was re-run with the current frame. The stabilisers' rest rule was persist, not the build's
  solve, and the band never released: the band now releases at rest (`label-motion-rest.json` re-measures the two banded stabilisers) and
  section 3.4 states that a view reached through motion keeps its items' places. The outline costs 62-64 draw calls, not 31 (two meshes a
  formation). The battery prototype had been revised (five gunners, one driver, the limbers behind the guns, the coffret) and section 4.2 is
  now its description, with the added equipment named. The kit's new generic parts (shoes, boots, hooves, a pouch) are listed. The horses'
  gait phase was a hash of each instance's place, which changes as the block settles: it is now a fixed number per instance, and the
  amplitude's dependence on the play speed is stated as such. The artillery's sources are graded as read (an authorisation, an inference, a
  pen-struck figure, two ways to split the Guard's 44 horses). Decision 62 was misquoted: section 0.1 now gives 62, 199 and 214 as drop limits
  moved on the owner's word. Section 7.2's "within 300 units of the eye" was wrong (one distance, the eye's to the target): its proposal is
  now scale-free and removes nothing. The CPU budget was below what the build already takes (12.3 ms at the 95th percentile): it is now
  relative to the build's. 8D's 20% culling target exceeded step 6's measure: now 10%.
- **Low, fixed.** Quotations now from their records (27, 39, §F.1, 221, 138); the stabilisers' count; the pan's 23 counters; "halves" to
  38%; the clocks of the motions; the flicker's definition; a man's size on screen by step 6's sphere measure; teams 1.0 cycles a second;
  the wheels' 10% and ratio; 11 days below freezing; the village counts' ratio; the desktop's margin; the house colours, the chimneys, the
  pad's opacity, the Littawa's width, the parts of the kit, the limbered barrel; the arrows prototype's reach (it also caps the lines of
  battle, the boundaries and the halt bars); the Guard grenadiers' facings; Nilus's page; the an XI paraphrase; Telnitz church's place; the
  `ice-sun` view kept for the woods only.
- **Recorded.** The evidence the reviewer found absent (the README, the recordings, the arrows, the closer figures, the water's JSON) was
  still being made; section 12.1 lists what exists at the end.

**A second reading.** A second independent reader (read-only, on the text of 23 October as it stood after the first review's fixes and the
work since: the summary, 1.2-1.3, 2.1, 3.2-3.3, 4.2-4.3, 5.1-5.5, 7.1-7.6, 8.2, 9.5, 8A, 8H, question 253, 12.1) checked them against the
evidence files, the probes and the code. Every cell of the 1.2 and 3.2 tables and every number of 4.2, 5.3, 7.2, 7.6, 8.2 and 9.5 matched its
file, and 9.5's reading of `ribbon()` and of the archives' ribbons was confirmed. It reported 15 findings (5 medium, 10 low), each fixed here
or recorded:
- **Medium, fixed.** (1) The recordings had set the clock with `force` every frame, which rebuilt the overlays (their fade restarted), reset
  the facings and showed the phase's toast again: the five clips the clock drives were recorded again as Play sets it, and the paper map's
  Play, described from three frames as steady, is described from the new recording (the probe counts 117 jumps there in the build). (2) The
  stabiliser's "never across the screen" and "the only stabiliser" were not measured: they are now its rule while the view moves and a
  comparison with anchor. (3) The guns' reading "at the Field vantage's distances" had no capture there: limited to the views taken. (4) The
  ribbons' fix draws them on the paper map too: said in 9.5, 8A and question 253, with the banks' and the road edges' widths. (5) The files
  found missing (the README, two clips) were still being made: section 12.1 lists what exists at the end.
- **Low, fixed.** The marks' contrast (1.0-2.2) and their share by named views; which views the figures lead; the zooms' items in view; a
  pass-time example from one stabiliser; "76 items appear or leave"; the stream-ice counts' method; the glyphs' size (well over 100 px, the
  cap 192); the Sokolnitz castle among the landmarks; "the sources disagree" on the ice; the self-test's paper-map check (`app.js:8229`); one
  Allied arrow over Nansouty's men; "both captures" in `bat-front`; the frames after the arrows' removals now recorded in the JSON (`after`)
  and compared with the build's own rebuild (`a-rebuild`); "opacity multiplied by 0.62"; the arrows' widths by view; question 241 (a) with
  7.1's two changes; 8.2's lighter kit a target, not a measurement, and its head example withdrawn (the build's head is the same
  icosahedron); 8H's reference to section 3.3; the widths "at 1x" (the factor is vertical only).

**A third reading.** A third independent reader (read-only, on the text written after the second reading: the recordings' descriptions in
sections 3, 4.3 and 5.3, the fade rule's change, section 9.6, the evidence README and the `CHANGELOG.md` entry) checked them against the clips,
`clip-motion.json`, `record-log.txt`, `toast.json`, the probes and the code; every number of the clip descriptions, the gait arithmetic,
section 5.3's flow and section 9.6's boxes matched. It reported 7 findings (1 blocking, 3 medium, 3 low), each fixed here:
- **Blocking, fixed.** The paper map's Play with the prototype was described as holding but at 09:17: from 09:07:30, where an event's
  label appears, seven counters leave their places over five frames, two or three at a time; section 3 and `CHANGELOG.md` now give both
  moments.
- **Medium, fixed.** The toast probe was filed under section 9.4 (it is 9.6) in the tools table, the README and the probe's header; section
  9.6 named only some of the inputs that show the toast (every `setClock` without `instant` does, and a phase's button, a chapter and a tour
  stop with `force`); "the gait draws no swing below 1 km/h" was stated as the prototype's rule, which does not apply it (`gait-check.json`:
  Nansouty's 0.28 km/h drift at full swing): it is now proposed, and in 4.7's and 8E's acceptance.
- **Low, fixed.** Section 3's threshold (more than 40 of 255) stated; the battery's switch in the first frame after its leg begins
  (13:45:30); `clip-motion.py`'s sections (3 and 5.3); the fade's wording in the summary and question 244 (full up to 3.2 cycles a second,
  none above 4.8).

## 13. Implementation PR 8A as built (24 October 2026)

**Status.** Merged into `main` on 24 October 2026 (PR #65, `3010fc7`). Built on `claude/blissful-clarke-9axnzp` (PR #65), from `main` at `d86835e` (PR #64, Stage 8 Part A, merged; nothing
merged since, checked). It applies decisions 251 (a) and 253 (b) as section 0.3 records them, with the points 0.3.1 settles; nothing of 8B-8H.
No data file, no geography, no simulation and no renderer changed (`check:data`: all 131 declarations byte-identical to its reference; `check:chronology`: 0 errors). The build:
2,247,866 bytes, md5 `870caf24e7465206d1a0a994e38265eb` (`check:baseline` moved to it).

### 13.1 The carried findings (decision 251 (a), expanded; section 9.1-9.3)

**What a reading may disclose (fact, `app.js`).** Under "Whose eyes?" (Napoleon's or the Allied headquarters) a formation the reading does not
know (`drawnKnow` "unknown") is now hidden from every place a visitor could read its position from, not only from the map:
- *Centring.* `focusOn` centres on the reading's position (`readPos`), so neither the order of battle's rows nor a dossier centres on an unknown
  formation; the full dossier offers no "Centre the map here" for it and says why instead (`LABELS.reading.noCentre`: "Not known to Napoleon's
  headquarters at 08:30 (a model reading): the map does not centre on it.").
- *The dossiers' place rows.* The compact card's and the full dossier's position row (`posRow`) give "Not known to … at …" for an unknown
  formation, without the derived tag; an aggregate's midpoint is the mean of the formations of it the reading knows (`aggReading`, as its
  counter is placed since roadmap step 3), said so in the row (`LABELS.reading.known`, `known1`), and none where it knows none.
- *The day-track.* An unknown formation's inset draws no position dot and no current leg, and its caption says why (`noDot`, `noDots` for an
  aggregate's hidden formations).
- *Related rows.* A place's "Formations nearby now" (`placeNearby`) leaves out the formations the reading does not know.
- *Following the reading.* An open dossier is painted again when the reading or the clock changes what it would show (`drawerKey`: the
  hidden formations and the reading are part of its key), so a dossier opened under one reading never keeps another's places.
Reviewed and kept, because they disclose no position the reading does not have: an act's and an objective's text (orders, not places), the march
row (a leg's length and duration), the Timing row, the ordered route's distance, the plotted positions list of the full dossier (the record of
the plotted anchors, a sourcing view of the data, as in every reading since 5D), the events. Observed and unchanged: the plateau's derived
reading is the plateau's, not a formation's.

**The sources at the head.** Every drawer dossier (the compact card, a formation's full dossier, an event's, a place's, an analysis chapter's and
a terrain line's) begins with "How this is sourced" under its head, in the part shown without scrolling; the button at the end stays (the review
of decision 203). Both open the sources sheet with that dossier's statements at its head (`srcButton`, `dossierClaims`). A dossier opens at its
head: the full dossier reached by the card's own "Full dossier" button kept, until 8A, the place the card was scrolled to (a rebuild with the
focus inside restored the old offset), so at 1366 x 768 and on a phone its "How this is sourced" stood above the visible part; a rebuild of the
same dossier keeps its place, another opens at its head (`paintDrawerBody`). Found when Part A's `carried.js` was run again on 8A (section
13.4).

**What a claim rests on.** The sources sheet's head list and its index of claims give, for each claimed statement, the works it rests on with
their locators; where the claim is "disputed", each work's side (`claimWorks`, `claimDetail`); and the claim's note where it has one. Until 8A
the note and the sides were recorded in `narrative.js` and shown nowhere.

**The timeline's tips.** A tip is the hover's (a mouse or a pen over its element) or the keyboard focus's, never a touch's; activating the element
(a press, a click, a tap, Enter or Space) dismisses it, and it comes back only with a new hover or a new focus; Esc hides a shown tip and does
nothing else (`TIP`, `tipSync`, `bindTimeTips`). Keyboard focus and hover keep their tips, as WCAG 1.4.13 asks.

**Checks that can fail.** `runtime-test.js`: two new blocks (every reading at every half hour: no unknown formation centred, placed in a row, in
a midpoint, a day-track or a nearby list; the dossier follows the reading; every claim's note and side in the index and the head list).
The self-test: "timeline tips (decision 251)" (synthetic pointer, focus and key events: hover, focus, activation, Esc, touch) and "dossiers: in
every kind of drawer dossier the sources are one press from where it opens" (six dossiers, and the full dossier also by the card's own button
from the card scrolled to it with the focus inside, as a visitor reaches it; the button inside the visible part, the sheet opened with its
statements). The harness: the live block `tips` (real mouse, keys and, on a phone page, real taps: Tab to a marker shows its tip, Enter opens
its dossier and hides the tip, Esc closes the dossier with no tip shown, a new focus (the next marker) shows its tip and Esc hides it and closes nothing; a hover shows its tip,
a click hides it, the pointer away and back shows it again; with the focus on one marker and the pointer over another the hover's tip shows,
leaving it shows the focus's again, Enter hides it and opens the focused marker's dossier; on a 390 x 844 touch page a tap opens the event's
dossier and shows no tip), and the phone dossier's
measure (`phone-measure.js` `srcHead`: the head button inside the visible sheet). Each was made to fail by putting its fix back
(section 13.4).

### 13.2 The roads and the streams (decision 253 (b); section 9.5)

**Wound facing up, drawn on both faces (fact, `world.js` `ribbon`, `buildWater`, `buildRoads`).** Each ribbon's triangles are now indexed (o,
o+1, p), (o+1, p+1, p): counter-clockwise seen from above, their normals (and so their light) up; and the six ribbon materials (the bank, the
stream, the three roads and the road edge) draw both faces, since a sliver lifted over a crest at 10.33x can face away from the eye (wound up and
front-sided, 7.4% of the road edges' pixels in one view were still culled). They are drawn on the landscape and on the paper map. Their centre
lines, lifts and colours are unchanged; the geography is not touched (the ribbons follow `RIVERS` and `ROADS` as before).

**The widths, a display convention (`RIBBON_W`).** A ribbon's drawn width is the width it was built with until 8A (its base) times its group's
factor for the presentation shown: the streams with their banks, the roads with their edges, on the landscape (both perspective presentations)
and on the paper map. One mesh serves both: `drape` lays it again when the display changes. The factors were chosen by comparing the build's
widths with narrower ones in matching views (`tools/stage8/ribbon-widths.js`: the frame with the ribbons culled as before 8A, then at ×1, ×0.7,
×0.5 and ×0.35, each with its pixels per kind, draw calls and triangles; 1600 x 900, Chromium 153, software WebGL; the frames are in
`docs/stage8-evidence/8a/ribbons/`):

| view | x1: stream / bank / road px | x0.7 | x0.5 (chosen) | x0.35 | calls, triangles (culled as before and every width) |
|---|---|---|---|---|---|
| `village-telnitz` (4x) | 6,117 / 4,608 / 147,448 | 5,272 / 1,922 / 105,118 | 4,060 / 1,519 / 75,657 | 2,862 / 1,151 / 52,682 | 741, 2,483,571 |
| `village-sokolnitz` (4x) | 32,062 / 4,277 / 12,325 | 21,360 / 3,537 / 9,123 | 14,163 / 3,840 / 7,050 | 9,555 / 2,710 / 5,651 | 747, 2,474,215 |
| `close-sokolnitz` (4x) | 11,245 / 7,941 / 20,715 | 8,897 / 5,570 / 15,048 | 6,636 / 4,041 / 10,935 | 4,714 / 2,449 / 7,724 | 781, 2,478,149 |
| `goldbach-top` (4x) | 27,702 / 41,020 / 64,955 | 19,799 / 33,833 / 46,983 | 14,472 / 28,089 / 34,375 | 11,144 / 19,526 / 25,608 | 681, 2,477,921 |
| `goldbach-noon` (4x) | 3,707 / 6,379 / 8,751 | 3,309 / 5,034 / 6,314 | 2,547 / 3,919 / 4,810 | 1,873 / 3,262 / 3,584 | 823, 2,509,849 |
| `overview-field` (4x) | 5,236 / 9,747 / 27,504 | 3,667 / 6,991 / 21,915 | 2,674 / 4,887 / 18,045 | 2,041 / 2,973 / 14,395 | 832, 2,523,605 |
| `paper-north-up` (paper map) | 2,294 / 1,225 / 6,602 | 1,629 / 761 / 4,800 | 1,180 / 451 / 3,577 | 744 / 239 / 2,668 | 156, 240,915 |
| `paper-close` (paper map) | 36,936 / 29,215 / 36,285 | 28,021 / 21,701 / 22,484 | 19,946 / 15,513 / 14,626 | 13,658 / 9,870 / 9,315 | 103, 203,455 |
| `pratzen-low-1x` (1x) | 31,840 / 33,166 / 67,663 | 22,819 / 23,058 / 53,600 | 16,780 / 18,117 / 44,441 | 12,145 / 14,179 / 37,314 | 160, 227,787 |

The factor chosen is **0.5, for both groups and both presentations** (`RIBBON_W`), and `css-test.js` holds it. At ×1 the roads were wider than
the houses beside them in the close views at 4x (the road through Telnitz 147,448 px, ten times the village's stream and bank together) and
the Goldbach's banks a dark band wider than the villages' footprints across the paper map's close view; at ×0.7 the paper map's close view
still read as bands. At ×0.35 the streams became threads at the Overview (2,041 px against 5,236 at ×1) and on the whole paper map (744
against 2,294), the banks under a pixel there. At ×0.5 each kind stays visible at the Overview and on the whole paper map, and the close views
read as lanes and brooks beside the houses. The drawn widths remain symbols, not the streams' or the roads' widths: the Goldbach is drawn 1.4
units wide (88 m at `GEOREF`'s 63.2 m a unit), the Littawa 1.6, the brooks 0.7, their banks 2.3, 2.5 and 1.2, the roads 0.6 to 1.45 and
their edges 1.15 to 2.0 (the widths `world.js` builds them with, halved). One factor for both presentations keeps one convention; `RIBBON_W` keeps them apart so
a later pass can tune one without the other.

**The check that can fail.** The self-test's "roads and streams: each kind (stream, bank, road, road edge) is drawn from above where it lies,
as rendered" renders the ribbons alone, each kind in a flag colour, in three views at each factor (straight above the Goldbach, from its west
bank, through Telnitz) and on the paper map, as built and double-sided: each kind must cover at least 60 px and as built at least 95% of what it
covers double-sided. With the winding put back it fails (section 13.4). The geometric checks (every vertex at its lift, no edge under the
ground) are kept.

**What it costs.** No draw call and no triangle (the ribbons were submitted and culled before 8A): the same calls and triangles in all six
views compared (`tools/stage8/compare-8.js`, `docs/stage8-evidence/8a/compare/compare.json`: the Overview 832 calls and 2,523,605 triangles, the
whole paper map 156 and 240,915). What they add is the pixels they cover: at ×0.5, 25,606 px at the Overview (1.8% of the 1600 x 900 frame) and
81,236 px through Telnitz (5.6%). The frame's time on this machine's CPU (software WebGL, the median of five frames; comparable between the two
builds, not a GPU's) moved within its noise: the Overview 10.5, 12.1 and 11.7 ms before 8A in three runs and 17.1, 11.2 and 11.2 with it; the
other five views from -4.7 to +0.3 ms.

### 13.3 What was run

On the final build (md5 `870caf24...`; commit `7507e92`), here (Chromium 153 through `AUSTERLITZ_CHROME`, Playwright 1.56, software WebGL)
and on CI (Chromium 141, the runner's):
- `npm test`: all nine suites and the height guard pass, here and on CI. `check:data`: all 131 declarations byte-identical to its reference.
  `check:chronology`: 0 errors, its movement audit 0 findings. `check:baseline`: passes on this build.
- `check:contrast` (every interface state, the phone's among them, and the six start-up cases): passes on CI.
- `check:selftest`: passes on CI, every one of its 250 checks by name against the manifest. The manifest was regenerated from this PR's passing
  run (`32a9921`), from 242 to 250 checks: the ribbons at 1x, 4x and 10.33x and on the paper map (six), the tips, the dossiers' sources.
- `check:visual` (39 cases and its sweeps and live blocks). The unchanged build first, here, as the baseline the comparisons read: its 39 cases
  measured without a failure and its self-test's 242 checks passing; the run then stopped in the light sweep (the browser closed, here; the
  full runs are CI's). On CI the unchanged build (`main` at `d86835e`, run 40075295260) fails five unobstructed-share baselines by 0.01 to 0.21
  points: first-run 0.6256 against 0.626, and at 1280 x 720 0.5069 against 0.507; first-run-laptop at 1280 x 720 0.5069 against 0.507;
  narrow-1024 0.5321 against 0.533; phone-844x390-explore 0.6879 against 0.69. They are the runner's measure, not this PR's. 8A's build on the
  same runner gives the same five values to four places (run 40075243524 on `7507e92`, this build; and run 40071349079 on `32a9921`, build
  `9fa6998c`), and its report differs from `main`'s in no drop, dropped item, unobstructed fraction or timeline height
  (`tools/step3/report-diff.js`). No limit was moved: the baselines are never lowered (Stage 3B's rule), and the five failures stand on `main`
  until they are re-measured on the owner's word.
- The carried findings measured again on this build (`tools/stage8/carried.js`, real clicks, keys and taps; `8a/carried-after.json`): under
  Napoleon's headquarters' reading at 08:30 the dossiers of the four formations it does not know offer no "Centre the map here" (on Part A's
  build each did, and centred on the true position), and the two it knows only as reported centre on their C zone, where the map draws them; at
  the eye level a known formation's centring leaves the eye level and puts it at the free rectangle's centre (0 px). "How this is sourced" stands
  inside the visible part of the card and of the full dossier at 1600 x 900, 1366 x 768 and on a 390 x 844 phone (at 202-230 px and 443-471 px;
  on Part A's build below it, at 793-852 px in the card and 4,100-6,028 px in the full dossier). By real keys, Tab to an event marker shows its
  tip, Enter opens its dossier and hides the tip, Esc closes the dossier with no tip shown; a hover shows a phase's tip, a click hides it and it
  stays hidden with the pointer away; on a phone a tap opens the event's dossier and shows no tip, after one second and after three.

### 13.4 Each check made to fail

Every check 8A adds was run once against a copy of the build with its fix put back (the copies in the session's scratch space, not
committed), and failed:
- `runtime-test.js`, the readings: `focusOn` centring on the true position (`posOf`) fails it ("fr 04:00: ahq centred, which the reading does
  not know", and five more at the first clock alone); the claims: `claimDetail` without the claim's note fails it ("EVENTS[#counter-march].dispute:
  its note is not in the index", and others), and without the dispute's sides ("... p. 109's side is not beside it in the index").
- The self-test, on one copy of the final build with the ribbons wound facing down and their six materials front-sided as before 8A, the
  tips' rules for a click and a touch removed and every dossier's head button removed (md5 `2c5d304d...`): the ribbon checks fail at 1x, 4x
  and 10.33x and on the paper map (as built against double-sided, at 1x stream 0 of 32,111 px, bank 32 of 22,699, road 0 of 33,325, road edge
  1 of 21,612; at 10.33x 40 of 27,796, 84 of 19,355, 148 of 43,483 and 575 of 29,639; on the paper map 0 of 579, 376, 647 and 378 px at each
  factor); the tips check fails (the tip kept after Enter on its marker, Esc on a shown tip doing something else, a touch showing the tip); the
  dossiers check fails (no "How this is sourced" at the head of any of the six); the other 242 checks pass, as on 8A (250). The harness's live block `tips`
  on the same copy fails too ("Enter on it: the dossier not opened, or its tip kept; one Esc after it: the dossier not closed, or a tip shown;
  Esc on a shown tip did more than hide it; Enter on the focused marker kept the tip or opened no dossier"): the copy's run ends with nine
  failures, these eight and the live block. The block's phone taps showed no tip on the copy either; the touch rule is held by the
  self-test's synthetic touch, which fails on it.

- The full dossier's head (found after the copies above were made): on the final build with its one line put back (the rebuild restoring the
  old offset whatever the dossier), a probe taking the self-test's path (the card scrolled to its "Full dossier" button, pressed with the focus
  inside) opened the full dossier at the card's offset, 212 px at 1366 x 768 and 198 px on a 390 x 844 phone, its "How this is sourced" at -10
  to 18 px and 245-273 px against the visible parts 35-677 and 295-723; on the final build at 0, the button at 202-230 and 443-471 px.
  `carried.js` had measured the same on the build before the fix (`8a/carried-after.json` is its run on the final build).

### 13.5 What remains (handed on)

- *The widths.* `RIBBON_W`'s 0.5 is this PR's judgement on the probe's frames (decision 253 (b) asked for the widths reviewed and set); it is a
  display convention, put to the owner's review with the frames in `8a/ribbons/`, not a question asked.
- *A phone's tap shows no tip,* by decision 251's rule; on a phone an event's name and hour reach a visitor through its dossier and the phase
  list.
- *Reviewed and kept under a reading* (section 13.1): the full dossier's Timing row with its dated quotations and its plotted positions' clocks
  and grades, the record of the sources and the anchors rather than the reading's places.
- *Not this PR's:* 9.4 and 9.6 (the open polish findings; in Study the phase's one message under the view switch) belong to 8H by section 10's
  plan; the ribbons' cost on a device's GPU to the device runs of 8D and 8H.
- *CI's five unobstructed shortfalls (section 13.3)* are `main`'s: CI's runner measures Part A's unchanged build 0.01 to 0.21 points under five
  unobstructed baselines, and 8A's build the same. Whether to re-measure them on CI's runner is the owner's to decide, as decisions 146, 199
  and 214 decided theirs; no baseline is lowered here.

## 14. Implementation PR 8B as built (24 October 2026)

**Status.** Merged on 24 October 2026 into its base, 8A's branch (PR #66, `95fa28a`), fifteen seconds after 8A was merged into `main`, so not
into `main`; the integration PR #67 brought it there (`0ca1414`, the same day; `main`'s tree then `95fa28a`'s). Built on
`claude/blissful-clarke-9axnzp-8b`, **stacked on implementation PR 8A's branch**: its base was `claude/blissful-clarke-9axnzp`, so its diff was 8B's alone. It
applies decisions 239 (b) and 241 (a) as section 0.3 records them, with the points 0.3.1 settles (items 1-6); nothing of 8C-8H. No data file,
geography, simulation or renderer changed (`check:data`: all 131 declarations byte-identical to its reference). The build: 2,317,927 bytes, md5 `9b20dc4ca251e17ddb2468f98f920f38`.

### 14.1 The ground under the troops (decision 239 (b); sections 2.4, 2.5)

**What is drawn (fact, `app.js` `OUTLINE`, `makeOutline`, `outlinePlace`, `outlineReach`, `updateVisibility`).**
- *On the landscape (both perspective presentations), by default:* every formation drawn as figures (4x and 10.33x) has a thin cased outline of
  its footprint (the extent grade A fills, W0 sw x D0 sd) in its side's colour (`TOKENS.sym.side[side].base`) on the side's edge colour, the
  line 1.7 px and its casing 3.4 px (CSS pixels at every density and under the effects' supersampling, `OUTLINE.px`), and **no filled
  mark**: the broad washes are gone from the default perspective views. The selected formation (and the formations of a selected corps)
  are outlined in the selection accent (`TOKENS.theme.dark.accent`) on the keyline, 2.2 px on 4.4.
- *"Position confidence" (the Layers panel), optional, off at first in the two perspective presentations:* switched on there, each outline is
  drawn round its grade's extent (decisions 86 and 88 kept: A its footprint, B its frontage doubled, C a disc of its frontage's radius; between
  anchors the weaker grade), its line thinner as the grade weakens (A 1.7, B 1.4, C 1.1 px, the casing twice the line), never dashed. The
  setting is kept for each presentation (`CONF_ON`): the landscape's and the paper map's.
- *Kept as they were (decision 239's exceptions):* a formation reported only, under a headquarters reading, drawn as its C zone filled and
  without figures (decision 91); at the eye level, the observer's own side as its filled marks (91); at 1x, every formation's footprint by its
  grade, filled, whatever the layer (decision 34, as drawn until 8B with the layer on, the default then).
- *The paper map (0.3.1 item 1):* unchanged: the grade's filled marks under the counters, the layer on at first there (decision 85 kept on the
  paper map); section 7.5 does not convert them.
- *Never lost under a slope, never dashed (decision 239's last sentence).* Each outline is a patch of the ground's own cells at a lift of
  0.25 units, the band drawn by its signed distance from the extent's edge in screen pixels (the fragment's derivatives), so it is one
  continuous band at every distance. The band is centred on the extent's edge: its line lies on the edge, inside the patch whatever the
  slope; the patch reaches beyond the extent by the casing's reach on the ground there (`outlineReach`: the eye's world units per pixel over
  the sine of the angle its ray meets the drawn ground, the largest over the extent's centre and corners, a margin of 2), so the casing's
  outer half is cut only where the ground is seen within a few degrees of edge-on (the far side of a hilltop at its horizon), and the line
  never. Where the drawn ground itself is seen edge-on, a mark on it has no area on the screen: there, as every ground mark since 5B, the
  outline thins to nothing over a few pixels.
- *The legend:* rows for the French, the Allied and the selected outline; with the layer on, the grades' outlines; the filled rows where filled
  marks are drawn (the paper map, 1x, a reported zone, the eye level's own side). The first-run key's words (decision 108) are unchanged and
  still true: the sides are marked "on the ground beneath them".

**Decisions touched (0.3.1 item 3):** 85 superseded on the landscape, kept on the paper map; 87 and 107 restyled (every formation drawn as
figures keeps a ground cue, its outline, which is also decision 107's side cue); 86, 88, 91 and 34 kept.

### 14.2 The arrows and the glyphs (decision 241 (a); section 7.1)

- *The cap (`ARROW_CAP`, `capPts`, `capFactors`, `ribbonRelayout`, `arrowCap`).* In the two perspective presentations every movement arrow,
  and the part of a derived arrow drawn on with the clock, is laid at every drawn frame whose eye has moved so that its casing is at most
  16 px across on screen: along the arrow, every unit of its length, the casing's two edges are draped on the drawn ground at its lift and
  projected through the eye, and the factor is brought down until their distance on screen is under 16 px (aimed at 15.5, `ARROW_CAP.M`
  0.97, for a row between two points read): from 1, by the ratio, again at most twice, since a casing across a break of slope does not
  narrow in proportion on screen (the ground's height across it changes as it narrows; at 10.33x one drawn-on row measured 17.25 px when
  the factor was read from the full width alone); then quantised down in steps of 1.1; a factor never above 1 (never widened); the head
  scaled with its shaft at its base (its form, the Allied chevron's notch, kept). Every point of the path, the colours, the label and the draw-on are as before: the
  centre line is the curve's, only the width changes. On the paper map nothing is capped.
- *The fill (0.3.1 item 5).* A movement arrow's fill, and its drawn-on part's, at 0.62 of its opacity in the two perspective presentations.
  The casing keeps its own opacity and is there a **border**: it leaves out what the fill covers, less a tuck of 2% (`BORDER`,
  `borderShaftHook`, `borderHeadHook`, `headInside`), so the fill is seen over the ground, edged by its casing, and the side's colour is not
  darkened by the casing under it (until 8B the casing lay under the whole fill, hidden by its 95%). On the paper map nothing changes (0.3.1
  item 4): the fill at its opacity as before (`paperK`) and the casing under the whole of it (`BORDER.U`, switched with the opacities by
  `applyOverlayOpacity`).
- *Hidden by the drawn ground alone (`GDEPTH`, `gdepthPass`, `groundDepthHook`).* In every drawn frame of the perspective presentations whose eye,
  size or ground has changed, the field and its apron are drawn once more, alone, into a depth texture of the frame's size, before the world;
  every overlay ribbon (the movement arrows and their drawn-on parts, the lines of battle and their ticks, the boundaries, the halt bars)
  leaves out a fragment the ground stands in front of, beyond the depth's precision (0.2% of the distance and a quarter unit). The figures,
  the woods and the buildings do not hide them: an annotation over the landscape, as 2C drew it. At the eye level the arrows no longer show
  through the hills (the audit's A-5). The lines of battle, the boundaries and the halt bars keep their widths and opacity.
- *The glyphs.* The event glyphs and the objective markers at most 64 px on screen (`SYM_MAX_PX`; decision 57's 192 superseded, 0.3.1 item 6);
  on the paper map at their authored size, as before.

**What it costs (measured, software WebGL on this machine's CPU: comparable between the two builds, not a GPU's time; `tools/stage8/compare-8.js`,
`docs/stage8-evidence/8b/compare/compare.json`, on this build; three earlier runs on 8B's build before its last two changes gave the same calls,
triangles, widths and cues).** In the eight landscape views compared, 147,088 more
triangles in a frame whose eye has moved, and 2 more draw calls in seven of them (close on Sokolnitz 781 on both): the ground's depth pass,
the field and the apron drawn once more (its own JavaScript 0.1-0.6 ms). The outlines' patches against 8A's filled marks: from 1,934 fewer
triangles to 20,942 more (each patch covers its footprint and the band's reach, where a filled mark covered its grade's extent); with
Position confidence on, 670-9,956 more than with it off. On the paper map nothing (156 calls, 240,915 triangles, as on 8A).
The frame's time on this CPU moves by several milliseconds from run to run of the same builds. With the eye moving (the pass drawn in every
frame), the median of five frames: in the low Pratzen view 9.2-10.2 ms on 8A and 10.1-12.9 ms on 8B over four runs (2.7-3.0 ms more in the
three on 8B's earlier build, 0.1 ms less in the one on this build); at the Overview 11.7-15.7 ms against 12.3-22.6; close on Sokolnitz and in
the low view with counters from 6.1 ms less to 5.1 ms more; in the other four views, measured in two runs, 0.4-2.2 ms more in both. With the eye
still (the pass kept) no consistent difference. The depth pass and the outlines may cost this CPU a millisecond or two, which these runs do
not resolve. The cap's relayout runs only in a frame whose eye has moved. What they cost a GPU is for the device runs (section 8: 8D before,
8H after).

**The ground's patches (found by the context-loss case, section 14.3).** A patch now keeps its geometry and grows it only when it needs more
room (`groundPatch`); until 8B a patch whose cells changed in number was disposed and built again, which a moving formation does while the clock
plays.

### 14.3 Found and fixed on the way

- *The lines' ticks drawn black.* Given the ground's hook, the tick lines (fogged `LineBasicMaterial`s) lost the atmosphere's uniforms, which
  every material receives through the prototype's `onBeforeCompile` (`atmoUniforms`): their fog divided by zero, and the bloom spread the
  undefined values into black blocks (the low Pratzen view, the eye level). The hook now gives the atmosphere's uniforms first; `css-test.js`
  holds it. (Part A's ice prototype met the same fault, its section 12.)
- *The outlines' widths in the target's pixels.* The outline shader measured its band in the render target's pixels, so under the effects'
  1.3 supersampling it was drawn a quarter thinner than designed, and on a phone at density 3 a third as wide; the widths are now CSS pixels
  (`OUTLINE.px`, set by the frame).
- *The context-loss case past its bound.* `check:contrast`'s context-loss case (decision 212 (b): after a lost and restored context, a step of
  the clock disposes geometries made before the loss, and three r128 warns once for each of their buffers and vertex arrays; at most
  `CTX_DELETES`, 248) reached Chromium's own cap on 8B's first build (256 warnings and "too many errors", on CI and here; 8A's build 244 here):
  its arrows' casings carry three more attributes, and the outlines' patches, placed for every formation drawn as figures, were rebuilt whenever
  their cells changed in number. The patches now grow and are never rebuilt (`groundPatch`): at the case's clock step 404 buffers and vertex
  arrays are deleted, against 884, and the case gives 199 warnings here and 195 on CI. The bound is unchanged.
- *The self-test's own renders drew the last frame's geometry.* three r128 uploads a changed geometry once a frame, and the app turns the
  renderer's automatic count reset off (since roadmap step 3: the frame resets it, so the developer readout can split the passes). A check that
  changes a geometry (the outlines laid again by `updateVisibility`, the arrows by the cap, the ribbons draped again for the paper map) and
  renders before the next frame drew the geometry the last frame drew: the outline check found bands 2-3 px from their edges where the
  formation had turned since. Each such render of the self-test's now begins a frame of its own (`renderer.info.reset()`); the app's own
  frames were never affected (each resets it before it draws, after the cap and the outlines are laid).

### 14.4 The checks, and each made to fail

**The self-test** (its manifest from 250 checks on 8A to 261: eleven added, seven renamed because the decisions change what they assert; all
261 pass on this build, 1366 x 768):
- *Added, at 1x, 4x and 10.33x:* "arrows (decision 241): ... at most 16 px across on screen at every drawn row" (18 views: the four vantages,
  the low Pratzen view and Napoleon's eye level at 08:30, 09:50 and 12:00; the widest casing 15.51, 15.48 and 15.72 px, of 1,467, 1,464 and
  1,456 drawn rows, 902, 943 and 984 of them capped; none wider than built, off its curve or off its lift; the heads in proportion; the frame
  lays them; on the paper map every row as built, and each movement arrow's casing, drawn alone, under the whole fill at every point of its
  centre line, at each factor 103 of 103 points of three arrows' centre lines); "a movement arrow's fill ... at 0.62 of its opacity" (36 arrows, 19 drawn-on parts, 8 lines,
  2 boundaries and a halt bar over the ten phases, and 32 fill-and-casing pairs as drawn on both maps); "every overlay ribbon ... hidden by the
  drawn ground alone" (judged at the canvas's size wherever a strip is 5 px across on screen: at 4x 9 points hidden, none drawn, and 79 in
  sight, all drawn, 14 of them behind a figure, a wood or a building; at 10.33x 47 hidden and 112 in sight, 30 behind; at 1x, where the ribbons
  stand over the true relief, 33 in sight; the movement arrows' casings drawn alone a border at every point judged).
- *Added, once:* "outlines (decision 239): never broken on steep ground" (12 renderings, 3 views at 4x and 10.33x with the layer off and on:
  8,875 of 8,879 points of the bands drawn; 729 more where the eye's ray meets the drawn ground within 3 degrees, not judged); "outlines
  (decision 239): ... every formation on the field in the free rectangle findable by its outline or its name" (the Field vantage and the
  Overview at 20 clocks, 1,209 formation-views).
- *Renamed:* Stage 5B's "every grade's mark is draped" (at each factor) now "every grade's mark and every outline is draped"; 5B's "every
  formation on the field is drawn at its position grade" now "on the landscape every formation drawn as figures is outlined, round its
  footprint with Position confidence off and round its grade's extent with it on", the paper map's marks as before (1,240 formation-samples at
  20 clocks; with the layer on A 258, B 281, C 81); 6C's identity check (decision 107) now its outline in its side's colour with no filled mark
  under it (decisions 107, 239; 158 formation-views in Study, Watch and Clean, the layer on and off); the legend's rows now the outline rows
  under the outlines; 3E's symbols check now at 64 px, not 192 (the largest symbol drawn 64.0 px with the eye 1.8 units from a live glyph).
- *Its own renders:* each render the self-test makes of its own begins a frame (`renderer.info.reset()`, section 14.3), 8A's ribbon check too.

**`css-test.js`:** decision 241's values (the cap 16 px with its margin, the fill 0.62 and the bordered casing on the movement arrows and their
drawn-on parts only, the glyphs 64 px, every overlay ribbon and the lines' ticks tested against the ground, the hook keeping the atmosphere's
uniforms); decision 239's first settings and outlines (off at first on the landscape and on on the paper map, no dash, the side's tokens and
the selection's accent). **`runtime-test.js`:** decision 239's cues (each formation drawn as figures outlined and none filled, the layer off
and on, the grade's outline with it on, the paper map's filled marks) and the render's pass order with the ground's depth pass first.
**The harness:** the position-confidence share now measures the ground cues as each case shows them (section 14.5), and its state check the
layer's first setting by presentation.

**Each made to fail.** Copies of the final build with a change put back (in the session's scratch space, not committed):
- with (1) the cap a no-op, (2) the fill at its old opacity, (3) the ground's test never discarding, (4) the casing under the whole fill
  again, (5) the outlines drawn in dashes and (6) the glyphs at 192 px (md5 `84085d40...`): the self-test fails ten checks, the others (251)
  passing: the cap at 1x, 4x and 10.33x (no row capped, the widest casing 211-218 px), the opacities at each factor (91 fills at their old
  opacity; as drawn, fill against casing 2.0 where 1.24 is wanted), the ground's hiding at each factor (at 4x 44 points the ground hides drawn,
  at 10.33x 49; at 1x, as at each factor, no casing drawn as a border to judge, which the check requires) and the steep outlines (7,298 of 8,879 points of the bands drawn); the
  glyphs' 192 px is caught by the manifest, since the check's name carries the cap ("check missing: ... at most 64 px", "not in the manifest:
  ... at most 192 px"); `css-test.js` fails "the glyphs' cap is not 64
  px", "the cap, the fill and the bordered casing on 0 drawers, not the arrows' and their drawn-on parts'" and "the outline's fragment shader
  is missing or draws a dash";
- with Position confidence on at first on the landscape: `runtime-test.js` fails "position confidence is on at first on the landscape
  (decision 239)" and `css-test.js` "position confidence is not off at first on the landscape and on at first on the paper map (decisions 85,
  239)";
- with the filled marks back under the figures while the layer is on: `runtime-test.js` fails "spatial confidence on: a filled mark on the
  landscape: gqg, sthilaire, vandamme, legrand";
- with the casing a border on the paper map too (`BORDER.U` never switched off; the self-test's arrow checks run alone on a copy, and on the
  build as it is beside it, 103 of 103 points under the fill at each factor): the cap check fails at 1x, 4x and 10.33x, the casings under the
  fill at 3 of 103 points of their centre lines; `css-test.js` fails "the casing's border is not switched off on the paper map".

### 14.5 What it replaces in the measures, and the new baselines

Measured on CI (Chromium 141, the runner's; `check:visual`'s 39 cases), 8A's build (run 40075243524) against this build (run 40086612769 on
`b42e500`) and against 8B's build before its last two changes (run 40075245190, `c260697e`), and compared case by case
(`tools/step3/report-diff.js`). The two 8B builds' reports differ in nothing but the paper map's shares below:

- *The position-confidence share (`CONF_SHARE`, the harness's `confShare`; Stage 5B, section A.5): its meaning replaced.* Until 8B it measured
  the filled marks the layer drew at first: each case's frame against the same frame with the layer off and no ground cue. Decision 239 takes
  those marks out of the landscape's default views, so on the landscape that measure would now read nearly nothing. The harness now measures the
  ground cues as each case shows them: the frame against the same frame with no ground cue at all (`CONF.none`), the layer left as the case has
  it (its setting recorded beside the share; the state check requires the layer's first setting for each presentation). On the landscape that
  is the outlines, with a reported formation's C zone and the eye level's own side where they are drawn (decision 91). At 1x it is nothing,
  since the footprints by grade are the formations themselves there and stay. On the paper map it is the filled marks, as before.

  | case (landscape) | 8A, the old measure | 8B, the new |
  |---|---|---|
  | `pratzen-low-1x` | 18.42% | 0 (1x: no outline; the footprints stay) |
  | `watch-selected` | 14.44% | 1.00% |
  | `hybrid-dimmed` | 13.90% | 1.04% |
  | `selected-formation` | 13.75% | 1.07% |
  | `narrow-1024` | 8.82% | 1.89% |
  | `phone-390-watch` | 9.76% | 0.76% |
  | `pratzen-low` | 8.45% | 0.52% |
  | `phone-390-explore` | 8.34% | 1.05% |
  | `phone-360-explore` | 8.26% | 1.35% |
  | `eye-zuran` | 6.42% | 6.42% (the eye level's own side, decision 91: unchanged) |
  | `overview-field` | 4.07% | 0.81% |
  | the other 19 landscape cases | 0-7.74% | 0-1.22% |

  The landscape's largest is now the eye level's own side, 6.42% at `eye-zuran` on both builds; without it at most 1.89% (`narrow-1024`).
  Here (Chromium 153) the 8B build measures `eye-zuran` at 6.42% as well (`narrow-1024` 1.94%). **The landscape's limit lowered from 20% to
  7%**: the largest measured, rounded up as 5B rounded its limits (its rule, never raised, kept). A return of the filled washes would fail it in
  the ten cases at 4x or 10.33x where 8A measured them above 7%. This is put to the owner as question 254 (section 14.6). The paper map's
  limit (16%) is unchanged: its marks and its arrows are drawn as on 8A, and the new measure gives 8A's shares to four places in all six of its
  cases. (On 8B's build before the casing's border was switched off on the paper map, `paper-close` measured 14.32% against 13.68%, the
  others within 0.01 points: that view's movement arrows cross the marks, and with the casing a border their fill showed the marks through.)
- *The map layer's drops: fewer.* 8B places more of the map layer where the narrower arrows' heads and the smaller glyphs leave it room:
  `overview-field` drops 6 to 5 (the Santon's name placed), `opening-3` 3 to 2 (the Pratzeberg's), `opening-4` 4 to 3 (the chapel's); in
  `hybrid-dimmed` ten dropped as before, but Kamensky's and Kollowrat's counters and Pratzen's name are placed and Kellermann's and the Russian
  Guard infantry's counters and the annotation "Bagration" dropped instead (each reachable by hover and keyboard, as the self-test holds). Every
  case within its drop limit; no limit moved.
- *Unchanged:* every unobstructed share and the timeline's height in every case (no difference to four places), the map text's contrast at AA
  and the pass times within 8 ms. The five unobstructed shortfalls on CI are `main`'s (section 13.3), the same values on 8A and on 8B.
- *Not harness measures:* the arrows' widths on screen, their opacities, the ground's hiding and the glyphs' size are held by the self-test's
  checks (section 14.4), and measured in nine matching views by `compare-8.js` (section 14.2).

### 14.6 What remains (handed on)

- **Question 254 (for the owner): the landscape's limit for the position-confidence share** (`CONF_SHARE.land`; section 14.5), now the
  measure of the ground cues as each case shows them. (a) **7%**, the largest measured (6.42%, the same in both browsers) rounded up, as set here: it
  holds the eye level's own side (decision 91) and fails a return of the filled washes in the ten cases where 8A measured them above 7%;
  (b) 20%, 5B's value, kept: it would fail only a wash larger than 5B's largest; (c) a tighter limit for the outlines alone (2%) and the eye
  level's cases judged apart: one more limit to keep. **Recommended: (a)**, set as measured, as decisions 141, 199, 214 and 232 set limits;
  the owner decides whether it stands.
- *A ground mark seen edge-on.* Where the drawn ground meets the eye's ray within a few degrees (the far side of a hilltop at its horizon from a
  low eye), an outline, as every mark drawn on the ground since 5B, has no area on the screen and thins to nothing over a few pixels; the
  steep-outline check counts these points and passes over them (729 of 9,608 in its twelve renderings). Drawing the outline there as a line on
  the screen (a silhouette) would be a different technique, not taken here.
- *The ribbons at the eye level.* The overlay ribbons are lifted 1.6-2.4 units over the ground at 4x, above an eye 3 m (scaled) over it, so
  near the eye a ribbon is seen from below, edge-on, as a thread; at 4x from Napoleon's eye at 08:30 no strip is 5 px across on the screen, and
  the occlusion check judges none there (it does at 10.33x, and from the low Pratzen view and Puntowitz). Unchanged from before 8B; a lift tied
  to the eye's height would belong to 8C's work on the low views.
- *The cost on a device.* The cap's per-frame relayout while the eye moves and the ground's depth pass were measured here on the CPU (software
  WebGL; section 14.2); their cost on the owner's laptop and phone is for the device runs of 8D (before) and 8H (after), as section 8 plans.
- *What 8B did not touch:* the map layer in motion and the low views' hierarchy (8C), the troops' kit and gait (8E), the water, woods and near
  ground (8F), the buildings (8G); 7.5's one language across the presentations (the paper map unchanged, as 0.3.1 item 1 settles).

### 14.7 What was run

On the final build (md5 `9b20dc4c...`), here (Chromium 153 through `AUSTERLITZ_CHROME`, software WebGL) and on CI (Chromium 141):
- `npm test`: all nine suites and the height guard pass here. `check:data`: all 131 declarations byte-identical to its reference.
  `check:chronology`: 0 errors. `check:baseline`: passes on this build.
- `check:selftest` here: every one of its 261 checks passes (the manifest regenerated from this run: one check renamed at each factor, the
  arrows' cap, which now also holds the paper map's casing under the fill).
- On CI on `b42e500` (this build; the later commits change records and evidence only): the checks job (`npm test`, `check:data`,
  `check:chronology`), `check:contrast` (45 states, none below AA; the six start-up cases, the context-loss case with 195 warnings, at most
  248) and `check:selftest` (261 of 261 by name) pass.
- `check:visual` on CI (run 40086612769 on `b42e500`): its 39 cases, sweeps and live blocks with five failures, the five of `main`'s build on the
  same runner with the same values to four places (section 13.3: the unobstructed shares of first-run, first-run-laptop, narrow-1024 and
  phone-844x390-explore). Against 8A's report: the map layer's drops as section 14.5 gives them, every unobstructed share and timeline height the
  same; judged again against this tree's limits and manifest (`check-report.js`): those five only, 261 of 261 self-test checks. No limit was
  raised or loosened; the landscape's confidence share lowered (question 254).
- The comparison (`compare-8.js`) run again on this build: the calls, triangles, widths, sizes and cues of its three earlier runs (section 14.2).
- Each new check made to fail (section 14.4).

## 15. Implementation PR 8C as built (25 October 2026)

**Status.** Built on `claude/focused-faraday-76jwny`; merged into `main` by the owner (PR #68, `8eb3ef4`). **Where it starts:** implementation PR 8A is in
`main` (PR #65, `3010fc7`); implementation PR 8B (PR #66) was merged into 8A's branch, `claude/blissful-clarke-9axnzp`, at `95fa28a`, not into
`main`. The integration PR #67 (head `claude/blissful-clarke-9axnzp`, base `main`, no commit of its own) brought 8B into `main` with nothing lost
or duplicated: the owner merged it on 24 October 2026 (`0ca1414`), without conflict, and `main`'s tree after it is `95fa28a`'s. 8C is built from
`95fa28a`; its PR was opened with the integration branch as its base and, #67 found merged, now targets `main`, whose tree is that base's, so its
diff is 8C's alone. It applies decision 240 (a) as
section 0.3 records it and decision 254 (a) (the owner's answer with 8C's brief, section 0.3); before them, three corrections the audit of 8A
and 8B found (A, B, C), in a commit of their own. Nothing of 8D-8H. No data file, geography, simulation or renderer changed (`check:data`: all
131 declarations byte-identical to its reference); `lowTier` untouched. The build: 2,357,922 bytes, md5 `04547a28419b2d86aec824931c735e0f`.

### 15.1 The audit's findings A, B and C (the prerequisite commit, `6fd80ea`)

**A. The overlays after a restored context.** Reproduced with a real loss and restore (`WEBGL_lose_context`) on 8B's build, the eye and the
window still, in a view where the drawn ground hides part of the overlays (10.33x at 11:30, low south of Telnitz; 3,741 pixels of overlay hidden
there): after the restore the ground's depth for the overlays (`GDEPTH`, 8B) was not drawn again, because it is redrawn only when its key (the
eye, the size, the ground) changes; its 49 sampled texels read zero, and the overlays were tested against an empty target until the camera moved.
A second cache had the same fault: the environment map (`refreshEnvironment`, a PMREM pass) is made again only when the sky's colours move, so
the restored scene was lit without it. The frame after the restore against the frame before the loss (the figures hidden: after a restore three
r128 compiles its programs again in a new order, so coplanar parts of the figures trade places in the opaque sort, about 1,600-1,800 pixels,
reported and not judged): 238,863 pixels differ on 8B; with the depth's key cleared but the environment not made again, 237,923-237,935 (three
variants: the depth's key alone, with the environment's key, with the light's); with the depth drawn again and the environment made again, 21-24 (27 in CI's run of the case below).
**Fixed** by `glRestored` (the restore handler): the depth's key cleared; the environment's key and the light's cleared together, so that the next
frame's light makes the environment again (either alone does not: the light's key alone reaches `refreshEnvironment`, which finds its own key
unchanged; the environment's alone is not reached until the light changes); the old environment target dropped, not disposed
(its dispose would delete objects of the lost context). **Held** by a seventh start-up case in `check:contrast`,
`context-depth` (`tools/visual/boot-check.js`): the view must hide at least 1,000 pixels of overlay (so the case holds the occlusion, not only the
overlays' presence), the eye's matrix and the drawing buffer unchanged across the loss, the depth drawn again by the app's own frames
(`GDEPTH.n` advancing), its texels equal to those before the loss, the frame within 100 pixels of the frame before. It fails on 8B (all three)
and passes on CI and here on the fixed builds.

*Found on the way, in the test, not the app:* the existing `context-loss` case (decision 212 (b)) failed on CI after fix A (run 40155177371):
after the restore its clock step drew no frame before its settle ended. A step that changes the environment map recompiles the programs that read
it, and under software WebGL its first frame comes 2-4 s after the step (2.2-2.4 s before any loss, on both builds); on 8B's build, whose restored
environment was empty, it came within a second, so the settle (begun 0.3 s after the step, reading `DEV.state`, which only a frame sets) saw it.
The case now waits for the step's first frame before reading the page as idle; its judgement is unchanged (frames drawn after the step, at least
one "does not belong to this context" warning, at most `CTX_DELETES`): 193 warnings on the fixed builds, 195 on 8B's.

**B. A march row under a reading.** The audit's report came from a synthetic probe; it was checked here on the real data, under both readings,
at every minute of the day (`tools/stage8/march-8c.js`, `docs/stage8-evidence/8c/march-8b.json`), and in the live page by real clicks (the order of
battle's row, its card, its full dossier). Under Napoleon's headquarters at 16:00 the full dossiers of Kienmayer's division and of the Left Wing
Command said "Position at 16:00: Not known to Napoleon's headquarters at 16:00" and below it "Marching: 2.1 km in 120 min · 1.1 km/h over the
frozen mere" (2.0 km in 150 min for the Left Wing Command): the row named where the formation is now, and that it moves now, which the reading
does not know. Over the day, under Napoleon's headquarters, formations it does not know have a march row in 4,852 formation-minutes (4,259 "Marching", 593 "Next move"), "over the
frozen mere" in 193 of them (Kienmayer from 15:47, the Left Wing Command from 15:49, Dokhturov's column from 16:11); under the Allied
headquarters in 8,894 (5,725 "Marching", 3,169 "Next move"), none over the ice. The distinction kept: what the dossier says of the formation's day as history (its statements, cited
and tagged, and the leg's length, time and rate, which 8A's review kept as the plotted leg's figures without a place) is a historical reference;
"Marching"/"Next move" (whether it moves at this minute) and "over the frozen mere" (where it is at this minute) are derived from its current
place, which the reading withholds. **Fixed** narrowly in `marchRow`: under a reading that does not know the formation the row is "Plotted leg"
with the same figures and the reading's note ("whether it moves now, and where, is not shown: not known to %r at %c (a model reading)"); a known
formation's row unchanged. **Held** by `runtime-test.js` (decision 251's block): for every hidden formation at the clocks it reads, no
"Marching", "Next move" or "frozen mere" and the neutral row with its note (440 rows, 5 of them over the ice); for every known one the row as
before (its ice phrase said where its leg crosses the meres). It fails on 8B's build. After the fix the same enumeration finds no hidden
formation's row naming a movement or a place (`march-8c.json`), and the live page shows "Plotted leg" for both dossiers.

**C. The five unobstructed failures CI reports** (`first-run` at 1600 x 900 and at 1280 x 720, `first-run-laptop` at 1280 x 720, `narrow-1024`,
`phone-844x390-explore`). Reproduced here on Chromium 141.0.7390.37, the headless shell Playwright 1.56 pins and CI runs (`first-run` 0.6256
against its baseline 0.626 and 0.506 against 0.507; `first-run-laptop` 0.506 against 0.507; `narrow-1024` 0.5321 against 0.533;
`phone-844x390-explore` 0.6879 against 0.690), and on 8B's build exactly as on `main`'s. **Not caused by 8A or 8B:** followed back through
every merged build from roadmap step 1 (PR #49) through Part A (PR #64), 8A (`3010fc7`) and 8B (`95fa28a`) to 8C's on Chromium 141
(`tools/stage8/panels-8c.js`, `docs/stage8-evidence/8c/unobstructed/`), `first-run` is 0.6256 and `first-run-laptop` 0.5461 on all fourteen, and
`narrow-1024` 0.5354 on the first two and 0.5321 from step 3 on (PR #51, whose Panels button widened the tools' box by 41 px there). The baselines
were measured on another Chromium (153, a container's; decisions 141, 164 and 232's re-measures): on it the same 8C build gives 0.6263, 0.5469 and
0.5334, all at or above their baselines, because there the same embedded fonts set the tools' box 7-11 px narrower (its left edge at 1267.2 px
against 1260 at 1600 px wide, 662.2 against 651 at 1024) and the view switch 4 px narrower; the viewport, the fonts (embedded, decision 141) and the
panels' layout are otherwise the same. (`phone-844x390-explore` is measured by the harness on a phone page reached by taps, 0.6879 on Chromium 141
on 8B's and 8C's builds; the panels script reads that case on a desktop page, where its share is not the harness's, and its rows there are not used.) **Not fixed by lowering a baseline:** `remeasure.js` now stops
unless its two runs are on Playwright's pinned headless shell (`--any-browser` lifts it for a study, never for a limit), and the re-measure on CI's
browser is put to the owner (question 256, section 15.10). Until the owner decides, `check:visual` on CI reports these five as before.

**Decision 254 (a)** is recorded in `tools/visual/thresholds.js`: `CONF_SHARE.land` stays 7%; since 8B the measure is the ground cues as each case
shows them (the outlines, a reported formation's C zone, the eye level's own side), no longer the filled marks, and a return of the filled washes
fails it; the paper map's limit (16%) unchanged.

### 15.2 The map layer in motion (decision 240 (a))

As section 3.4 describes it, in `app.js` (`MLS`, `mlStabBegin`, `mlHoldTry`, `mlLayout`), with the values decided there (held by `css-test.js`):

- **Motion is read from the app's own state** (`mlMotionSource`): a tween or glide in flight (a vantage, the paper map's eased move, Follow), Play,
  the input hold (`INPUT_HOLD_MS`, 450 ms after a pointer, wheel or key event), a panel's move. A pass is *moving* from the first pass whose view
  (the camera's matrices, the window, the clock) changed under a motion source until the source ends: between a wheel's steps or a key's repeats
  the view stands still for a frame or two and the gesture goes on. No harness switch: the checks drive the app through its own input.
- **While the view moves** each counter and name first keeps the place it held against its own anchor (a counter its frame's foot where it stood;
  a size change keeps the side toward the anchor), else takes one of the places hugging its anchor (`mlCands`: a label's eight, a place name's
  eight beside its marker, a counter's one), else it is hidden and fades out. What is hidden or new is looked for again only in a re-placement pass,
  every 333 ms of the app's clock, by the full search, and drawn after **two** successive passes with room. Collisions are tested in every frame
  against the drawn boxes, the panels, the arrow heads and the event glyphs: no overlap among live items in any frame.
- **What is never dropped** (decision 39: the selection, the hovered, the highlighted family, the live events) and the item with the keyboard's
  focus are placed by the full search in every frame, as before 8C (section 3.4's invariant), never held or hidden; the focused item is drawn
  over the others when it has no room (step 3's A-2), as before.
- **The band:** while the view moves, the level-of-detail switches read a distance held until the true one has moved 8% from it (the corps and
  division counters at 250 units and the brigades at 165, the names' ranges 170/220/300, the places at 210, the counters' full form at 70, the
  names near the eye at 34, the plan links at 190, the far step's ratio); at rest the true distance. A view's level of detail never depends on
  how it was reached.
- **Fades** of 180 ms of wall-clock time while the view moves or after it has moved: an item appearing fades in; an item leaving while still in
  the layer (hidden by the hold, or dropped) fades out where it was last drawn, as the same element (no second name, no second focus stop),
  under the live items (`z-index -1`) and taking no pointer (`.ml-fading`); an item no longer in the layer (a level-of-detail switch, a reading
  that no longer knows it, a layer turned off) leaves at once. A counter's content (strength, status, reading) changes at once, never faded.
  **Under reduced motion no fade**; the hold and the band are kept (they reduce motion).
- **At rest after motion** (the band released, the final pass at the true distance): every place that still fits is kept first, in priority
  order, then the others are placed by the full search in the room left; nothing drawn moves to make room for another (no reshuffle), and the
  page returns to idle (one pass more after the last moving one).
- **A view reached without motion** is laid out exactly as before 8C: the first pass after a discontinuity, and every pass at rest until the view
  next moves, has no memory, no hold, no band and no fade. A discontinuity clears the memory: a change of ground (map type), presentation,
  reading, the eye level entered or left, the display factor, a resize, a restored context, a tween ended at once, a move made at once (under
  reduced motion a glide or Follow's step is a jump), and any jump a pass finds (the clock more than 5 minutes from the last pass's, the eye or
  target moved more than 0.6 of the eye's distance or the view turned more than 40 degrees, the paper map's plan moved or zoomed as far).

**What is not as Part A prototyped it, and why.** (1) Part A's prototype placed the never-dropped items by "its last place, else the full
search"; section 3.4 and decision 240 keep them "placed by the full search every frame as today", and 8C does so: their 39 jumps over the 16
motions are the build's own 39 (counted in the totals below; the prototype's 249 did not have them). (2) Part A's rest pass took each item in
priority order, its last place else the full search, so a returning item of higher priority could take a held item's place and move it; 8C keeps
every valid place first, as the owner's brief for 8C asks ("retain valid placements else full search, avoid reshuffling"): jumps at rest after the
16 motions 57 with the prototype's order (297 in all), 5 with 8C's (245). (3) A first 8C build also took the full search's layout at rest whenever it
placed more items than the kept places allowed; that reshuffled the layer at the moment of rest (79 jumps at rest, 319 in all, over the 16
motions) and was removed for the same reason. (The three builds measured with the same driver, Chromium 141.) What a view reached through motion keeps (`tools/stage8/rest-8c.js`, `docs/stage8-evidence/8c/rest-8c.json`): at rest
after each of the 16 motions it places as many items as the same view reached directly in all (448 and 448), one or two fewer after four of them
(the pan, the orbit and the glide of Landscape with counters, the low view's orbit), one more after six, as many after six; its dropped ids differ
from the direct view's after twelve (other items kept, others dropped) until the view next moves or is reached afresh. The items it does not draw
are reachable by hover and keyboard as every dropped item is (decision 39).

### 15.3 The far step (section 7.2; decision 240 (a))

In the two perspective presentations an item whose anchor stands farther from the eye than 1.5 times the eye's distance to its orbit target is
drawn a type step smaller, where decision 16 allows one: a place's or a terrain-study name, `t-small` (11.5 px) to `t-micro` (10.5 px, the floor
decision 16 gives tertiary information; the harness holds it there). The item keeps the box its own size gives it for the layout (its place, its
room, its hover target), so no placement, drop or dropped id changes; the smaller words stand inside that box on the side toward its anchor. The
distance is guarded (an eye nearer than one unit to its target, or a ratio that is not finite: no step) and held inside the band while the view
moves (no flicker at the boundary). None on the paper map. **Battle information is not stepped:** formation names and counters, events, the
plateau's reading, the arrows' and the objectives' labels are at `t-ui` (12.5 px), and decision 16 holds battle information at 12 px at least;
the type scale has no step between. In Part A's low views beyond 1.5 times the eye's distance to its target
stand 23 of the 30 items drawn in `horizon-east` (16 formation names, 3 events, 2 arrows' labels, the plateau's reading, an objective), none of
them a place or terrain-study name, so none is stepped; in `ice-low` 25 of 35 (21 formation names), 2 stepped (places); in `stream-low` 19 of 23
(9 formation names, 5 places), the 5 places stepped; close on Sokolnitz 9 of 19, its 5 places stepped (`label-far.js` on this build,
`docs/stage8-evidence/8c/label-far-8c.json`). So in the low views, where Part A found the
"wall" of far names (16 of the 23 far items in `horizon-east` formation names), the step touches only the places and terrain-study names; this
is put to the owner as question 255 (section 15.10). In the `check:visual` cases it draws 1-5 names smaller (close on Sokolnitz 5, the low
Pratzen views 1-3, Landscape with counters dimmed 2, the eye level 1); their boxes, drops and dropped ids are 8B's (section 15.5).

### 15.4 The checks, and each made to fail

- **The self-test** (its manifest 261 to 270: nine added, none removed or renamed; all 270 pass here and on CI): the motion invariants (a pan
  and an orbit of Landscape with counters, the paper map's zoom by the wheel and its Play, driven through the app's own frame on a clock of the
  test's and its own pointer and wheel handlers: no overlap, what is never dropped drawn, an item drawn in two frames keeps its place against its
  anchor or takes a place hugging it, never a ring or a row, one appears only in a re-placement pass and never back within 333 ms); the
  remnants and the rest (a leaving item fades out as itself, under the live items, never picked by the pointer, gone within 180 ms; at rest nothing drawn moved
  to make room for another, the band released, the layer's items those of the view reached without motion, nothing fading, no frame asked
  for); a view reached without motion laid out as before the view moved; the band (with a key held, the eye drawn back 0.5% a frame across the
  corps switch: the divisions kept while within 8%, the corps at rest); reduced motion (no remnant, every drawn item at full opacity, the hold
  kept); a reading changed while the view moves (nothing drawn or fading that it does not know); the item with the keyboard's focus (the most
  crowded drawn formation) placed by the full search in every frame of an orbit, drawn and never held;
  a key that moves nothing leaves the layer at rest; the far step (close on Sokolnitz, 4 of 5 place names at 10.5 px inside their own boxes, the
  layout identical without the step, none on the paper map, no battle information stepped).
- **`css-test.js`** holds the decided values (`MLS`: 333 ms, 2 passes, 8%, 180 ms, 1.5), the motion read from the app's state alone, no fade
  under reduced motion or in a fresh view, the band on every switch and released at rest, the never-dropped items and the focus by the full
  search, each discontinuity a fresh view, the remnant's rule and the far step's (t-micro, on `.mlt-small` only).
- **`runtime-test.js`** dry-runs the stabiliser on the app's own state (a reset gives a fresh view; the eye moved under the input hold reads as
  moving with every item counted once, fades on unless reduced motion asks; the hold over, at rest; the band's arithmetic), and holds finding B.
- **The motion block** of `check:visual` and `check:selftest` (`tools/visual/harness.js`, judged in `thresholds.js` `MOTION`), on a page of its
  own: the 16 motions of `label-motion.js` driven through the app's own input and frame (`tools/visual/motion.js`: 30 frames a second on a clock
  of the driver's, the WebGL draw skipped, nothing set that the app does not set), each from a view reached without motion and followed by 30
  frames at rest; the four that real input can drive (the left drag, the right drag, the wheel on Landscape with counters and on the paper map)
  by real input, Playwright's mouse through the browser's own input pipeline (on `check:selftest`'s page two of them, the right drag and the
  paper map's wheel: each real-input frame costs a round trip; the whole block first took 12.5 minutes of the job's 45, and with the views settled
  without a drawn frame the job takes 15-34 minutes on CI's runners, by runner, on this build: at most 11 minutes short of its limit); two with Saint-Hilaire's division
  selected; three under a headquarters' reading; a finger's pan on the phone layout (390 px). Judged against the owner's starting targets over
  the 16 (jumps 300, pops 1,300, flickers 200, the level-of-detail switches not above 8B's 130 in the same motions), and in every run: no
  overlap, no never-dropped item hidden in view, no remnant out of rule, nothing drawn that the reading does not know, frames read as moving,
  idle at rest after the motion (Play aside), each real-input motion within 6 (or 25%) of its twin driven in the page.
  *Found in the final validation, in the driver, not the app:* on one build the block's totals differed by a few counts from run to run (CI's
  `check:selftest` 244 jumps, 997 pops, 17 flickers; CI's `check:visual` 242, 1,014, 18; here 237, 1,021, 19; the level-of-detail switches 130 in
  all), each within the limits but not repeatable. The block sets each view up without a drawn frame, so a run followed the last one within
  a second or two, and the driver restarted its clock at the page's real time, behind the last run's end: the last run's input hold could
  still be running, and the frames left asked for (render on demand) decided how many frames before the motion laid the layer out, so the
  phase of its re-placement passes (traced frame by frame: the runs part at the first motion frame where one is a re-placement pass and
  the other not). Repeated here with a 1.5 s pause between the set-up and the run, the totals moved (248, 1,005, 22). The driver now starts
  each run 2 s past every timer the set-up left, with the page's clock never running back, on a view marked as reached afresh (the app's own
  `mlReset`, as placing the camera does) and with no frame pending, as an idle page stands: four runs here, with and without the pause, give
  the same counts motion by motion, 245, 985, 130 and 10, exactly `label-motion.js`'s (whose set-up draws frames and so already started
  clean). On CI (`check:selftest` on `88da6f0`, run 40176782747) every one of the block's 24 runs gives the same counts as here: the 16 at
  245, 985, 130 and 10, the two by real input exactly their twins' (before the fix within a few jumps of them: 5 and 7 against 7 and 5 in CI's
  `check:visual` on `339143c`), the
  selections', the readings' and the phone's as `label-motion.js` measured them. CI's `check:visual` on the same commit
  gives them again in its 26 runs, each of its four by real input exactly its twin's.
- **Made to fail** (`tools/stage8/mutate-8c.js`: one string replaced in a copy of the built page; the self-test's 8C block run on it, read
  from the page's own source, and with `--motion` the 16 motions judged as the block judges them): on the build all nine of the block's checks pass. *The stabiliser off* (every pass laid out afresh, as 8B): three fail
  (the motion invariants, the rest, reduced motion's hold) and the motion block fails (3,439 jumps). *No band*: the band's check fails; the motion
  block passes (130 level-of-detail switches either way: the band moves the switches to the moment the view stops and removes none, so the totals
  cannot tell it; the band is held by the self-test and `css-test.js`). *A reshuffle at rest* (the full search for every item after motion): the
  rest's check fails, and the motion block (384 jumps). *A returning item drawn at once* (no re-placement pass, no second pass): the motion
  invariants fail, and the motion block (378 jumps, 3,167 pops, 1,201 flickers). *The never-dropped items held like the rest*: the motion
  invariants fail, and the motion block (never-dropped items hidden in view in six runs: the zooms and Plays of Landscape with
  counters, the paper map and the landscape). *The keyboard's focus held*: the focus check fails
  (Saint-Hilaire's counter held at frames 8-11 of the orbit). *A remnant picked by the pointer* (the app's picking, `mlHit`, taking items not
  drawn): the remnants' check fails. *Fades under reduced motion*: the reduced-motion check fails. *A remnant kept past its fade*: three fail.
  *The far step on battle information*: the far step's check fails. Two checks were found passing on their first mutations and were made able
  to fail (`339143c`): the focus held (A-2's fallback still drew it, so "drawn in every frame" held: the check now focuses the most crowded
  drawn formation, orbits the view and requires it never held) and a remnant's CSS without `pointer-events:none` (the whole map layer takes no
  pointer events, so the rule is belt and braces: the check now asks the app's own picking at the remnant's centre). `css-test.js`'s block fails on
  each of seven mutated sources (fades under reduced motion, the pass at 100 ms, the reading's reset removed, a remnant taking the pointer, a
  harness switch in the motion source, the band kept at rest, the far step on battle information). The `context-depth` case fails on 8B's build;
  `runtime-test.js`'s finding-B checks fail on 8B's build.

### 15.5 A view reached without motion: unchanged

Every `check:visual` case the harness applies by its spec (20: all but the fresh pages, the phone and device cases, the interactions and the
opening's), applied and settled on 8B's build and on 8C's (`tools/stage8/fresh-8c.js`, `docs/stage8-evidence/8c/fresh-8c.json`): every item of the
map layer in the same state with the same box to the pixel and the same leader, the same drops and dropped ids, in all 20. The far step draws
names smaller in seven of them inside those same boxes (section 15.3).

### 15.6 Before and after: the measures in motion and the formations followed

`tools/stage8/label-motion.js --app` on 8B's build and on 8C's, the same driver (Chromium 141; `docs/stage8-evidence/8c/label-motion-8b.json`,
`label-motion-8c.json`): Part A's measures (section 3.2) over each motion and 30 frames at rest after it, and the tracking of formations a
visitor follows. **The driver differs from Part A's probe**, so its numbers are not Part A's: Part A set a `MOVING` flag and moved the camera by
the app's functions; here the app reads its own state and the motion comes through its input handlers (a drag of 8 px a frame, a right drag of
6 px, the wheel's own step every third frame, ten in and ten out, a vantage's glide, Play at ½x with Follow from 09:00). Under this driver 8B's
own counts are the "before".

**Per motion** (8B / 8C; a motion's counts include its 30 frames at rest; "formations drawn while in view" is the share of the frames in which a
followed formation stood in view, on the screen, not under a panel, in front of the ground and in the layer at its level of detail, that it was
drawn; "longest hidden by the layout" the longest such run of frames it was not drawn; "back after room" the most frames, in ms of the app's clock,
it stayed hidden once the full search would have placed it in every frame since):

| motion | jumps | pops | level-of-detail switches | flickers | formations drawn while in view | longest hidden by the layout | back after room (most) |
|---|---|---|---|---|---|---|---|
| `hybrid-pan` | 131 / 5 | 39 / 55 | 23 / 23 | 8 / 0 | 78% / 67% | 2,033 / 2,467 ms | 0 / 667 ms |
| `hybrid-zoom` | 334 / 27 | 95 / 116 | 24 / 24 | 23 / 4 | 85% / 61% | 1,533 / 1,533 ms | 0 / 633 ms |
| `hybrid-orbit` | 508 / 7 | 117 / 145 | 0 / 0 | 31 / 0 | 85% / 58% | 1,300 / 2,200 ms | 0 / 667 ms |
| `hybrid-glide` | 359 / 16 | 122 / 79 | 12 / 12 | 40 / 1 | 86% / 68% | 2,533 / 2,533 ms | 0 / 633 ms |
| `hybrid-play` | 237 / 10 | 76 / 109 | 2 / 2 | 16 / 2 | 76% / 62% | 4,033 / 3,100 ms | 0 / 667 ms |
| `paper-pan` | 12 / 0 | 2 / 5 | 0 / 0 | 0 / 0 | 100% / 97% | 0 / 667 ms | 0 / 667 ms |
| `paper-zoom` | 314 / 8 | 20 / 92 | 0 / 0 | 14 / 2 | 100% / 69% | 0 / 667 ms | 0 / 667 ms |
| `paper-glide` | 288 / 5 | 21 / 43 | 27 / 27 | 9 / 0 | 100% / 69% | 0 / 633 ms | 0 / 633 ms |
| `paper-play` | 113 / 5 | 6 / 30 | 2 / 2 | 1 / 0 | 100% / 93% | 0 / 667 ms | 0 / 667 ms |
| `land-pan` | 113 / 12 | 6 / 34 | 2 / 2 | 1 / 0 | 100% / 91% | 0 / 1,133 ms | 0 / 567 ms |
| `land-zoom` | 233 / 32 | 27 / 63 | 30 / 30 | 8 / 1 | 100% / 77% | 0 / 667 ms | 0 / 667 ms |
| `land-orbit` | 408 / 40 | 49 / 78 | 0 / 0 | 12 / 0 | 100% / 83% | 0 / 667 ms | 0 / 667 ms |
| `land-play` | 208 / 22 | 21 / 74 | 2 / 2 | 3 / 0 | 100% / 83% | 0 / 667 ms | 0 / 667 ms |
| `low-pan` | 18 / 6 | 3 / 10 | 0 / 0 | 0 / 0 | 100% / 93% | 0 / 533 ms | 0 / 533 ms |
| `low-orbit` | 74 / 16 | 13 / 29 | 0 / 0 | 2 / 0 | 100% / 78% | 0 / 633 ms | 0 / 633 ms |
| `low-zoom` | 89 / 34 | 19 / 23 | 6 / 6 | 4 / 0 | 100% / 80% | 0 / 633 ms | 0 / 633 ms |
| **the 16** | **3,439 / 245** | **636 / 985** | **130 / 130** | **172 / 10** | | | |

Over the 16 motions 8C makes **jumps 245** (8B 3,439; the target at most 300), **flickers 10** (172; at most 200), **the level-of-detail switches
130** (130: the band defers them to the moment the view stops, as Part A found, and removes none), **pops 985** (636; at most 1,300), no overlap
in any frame of either. Of the 245 jumps 39 are the never-dropped items', placed by the full search every frame as before (8B's 39), 3 are boxes
whose size changed (a counter's full form, new words), and 5 are at rest after the motion. The four motions driven by real input give exactly
their twins' counts on both builds (the browser's own events read as the page's synthetic ones are: the motion source is the app's own input hold).

**The other runs** (8B / 8C): the four by real input, three under a headquarters' reading, a finger's pan on the phone layout (390 x 844), and four
with Saint-Hilaire's division selected:

| run (8B / 8C) | jumps | pops | level-of-detail switches | flickers | formations drawn while in view | never-dropped hidden | drawn though not known |
|---|---|---|---|---|---|---|---|
| `hybrid-pan+real` | 131 / 5 | 39 / 55 | 23 / 23 | 8 / 0 | 78% / 67% | 0 / 0 | 0 / 0 |
| `hybrid-orbit+real` | 508 / 7 | 117 / 145 | 0 / 0 | 31 / 0 | 85% / 58% | 0 / 0 | 0 / 0 |
| `hybrid-zoom+real` | 334 / 27 | 95 / 116 | 24 / 24 | 23 / 4 | 85% / 61% | 0 / 0 | 0 / 0 |
| `paper-zoom+real` | 314 / 8 | 20 / 92 | 0 / 0 | 14 / 2 | 100% / 69% | 0 / 0 | 0 / 0 |
| `hybrid-pan+fr` | 78 / 6 | 33 / 48 | 23 / 23 | 5 / 0 | 78% / 68% | 0 / 0 | 0 / 0 |
| `hybrid-pan+al` | 98 / 5 | 34 / 48 | 14 / 14 | 7 / 0 | 88% / 73% | 0 / 0 | 0 / 0 |
| `paper-play+al` | 86 / 5 | 5 / 33 | 2 / 2 | 0 / 0 | 100% / 89% | 0 / 0 | 0 / 0 |
| `phone-pan+touch` | 164 / 1 | 66 / 49 | 0 / 0 | 22 / 0 | 75% / 40% | 0 / 0 | 0 / 0 |
| `hybrid-zoom+sel` | 347 / 31 | 115 / 111 | 24 / 24 | 34 / 4 | 85% / 59% | 0 / 0 | 0 / 0 |
| `hybrid-orbit+sel` | 538 / 10 | 130 / 141 | 0 / 0 | 34 / 4 | 84% / 59% | 0 / 0 | 0 / 0 |
| `paper-zoom+sel` | 307 / 13 | 21 / 106 | 0 / 0 | 12 / 2 | 100% / 67% | 0 / 0 | 0 / 0 |
| `paper-play+sel` | 137 / 8 | 5 / 40 | 2 / 2 | 0 / 2 | 100% / 87% | 0 / 0 | 0 / 0 |

**Following a formation** (decision 240's qualification: whether a visitor can follow a formation through camera movement and playback). Over
the 16 motions, for every formation whose counter or name the layer collects:

| over the 16 motions (8B / 8C) | |
|---|---|
| formation-frames in view (drawn, behind the ground, or hidden by the layout) | 29,202 / 29,291 |
| of them drawn | 26,989 (92%) / 21,987 (75%) |
| hidden by the layout (no room, or held by 8C until a re-placement pass) | 2,213 / 7,304 |
| behind the ground | 0 / 0 |
| off the screen or under a panel (not counted against visibility) | 8,271 / 8,330 |
| out of the layer by its level of detail | 3,481 / 3,333 |
| times a formation was hidden by the layout | 131 / 417 |
| longest such disappearance | 4,033 / 3,100 ms |
| back after the layout had room for it again: mean, most | 0, 0 / 494, 667 ms |
| a drawn formation's box moving against its anchor (jumps) | 2,197 / 97 |
| its box changing side of its anchor | 1,568 / 91 |
| two neighbouring formations' boxes swapping order (identity) | 2,642 / 270 |

And for each of the eleven formations followed by name (over the 16 motions):

| formation (8B / 8C, over the 16) | drawn while in view | longest hidden by the layout | jumps | swaps |
|---|---|---|---|---|
| sthilaire | 93% / 65% | 2,067 / 1,600 ms | 91 / 3 | 68 / 9 |
| vandamme | 100% / 78% | 33 / 1,233 ms | 86 / 3 | 98 / 9 |
| legrand | 100% / 71% | 0 / 1,233 ms | 108 / 10 | 40 / 5 |
| dok | 100% / 83% | 0 / 633 ms | 21 / 3 | 30 / 5 |
| lang | 100% / 77% | 0 / 633 ms | 59 / 5 | 33 / 4 |
| prz | 100% / 77% | 0 / 667 ms | 77 / 5 | 37 / 2 |
| kollo | 99% / 93% | 267 / 567 ms | 59 / 4 | 72 / 16 |
| lich | 98% / 82% | 1,000 / 1,367 ms | 90 / 4 | 165 / 11 |
| bag | 100% / 95% | 0 / 533 ms | 28 / 0 | 75 / 15 |
| c_iv | 100% / 77% | 0 / 667 ms | 23 / 0 | 30 / 3 |
| c_iii | 100% / 90% | 0 / 400 ms | 19 / 0 | 1 / 0 |

**What this means, candidly.** 8C does what decision 240 (a) asked of it: a formation a visitor follows no longer darts across the screen or trades
places with its neighbours while the view moves (its box moved against its anchor 97 times against 2,197; changed side of it 91 times against
1,568; swapped order with a neighbour 270 times against 2,642), and the layer stops reshuffling at rest. The price is the one the owner accepted, and
it is larger than "a fifth fewer items" in some motions: over the 16 motions the formations in view are drawn in 75% of their frames against 92%
(the paper map's zoom and glide 69% against 100%, the orbit of Landscape with counters 58% against 85%, the phone layout's pan 40% against 75%);
a formation hidden by the layout is hidden 417 times against 131, and comes back 0.4-0.7 s after the layout has room for it (8B at once, by
moving it or another); its longest disappearance is 3.1 s against 4.0 s. The counters are hidden more than the names: a counter has one place
beside its anchor, so when that is taken it has nowhere else to go until a re-placement pass (question 258). The never-dropped items are never
hidden: the selected division is drawn in every frame of the zoom and the orbit on both builds (its 9 and 1 jumps the same on both, its swaps 5
and 7 on 8B, 0 and 2 on 8C). Under either headquarters' reading nothing it does not know is drawn or fades in any frame.

### 15.7 The layer's cost

`tools/stage8/layer-cost.js` (section 3.5's budget: at most 0.5 ms more at the median of a pass and 2 ms more at its 95th percentile): the 16
motions, each pass of `mlLayout` timed by the real clock, the WebGL draw skipped, the two builds (8B's `9b20dc4c` and this one) in turn, three
rounds with the order alternated, on Chromium 141 in this container (4 CPUs, Intel Xeon at 2.10 GHz, no other job running; the load average of
about 4 is the run's own). CPU time in a page on this machine; a device's frame time is for the device runs (section 8), not run here.

| motion | 8B: median / 95th percentile (ms) | 8C | 8C's excess |
|---|---|---|---|
| `hybrid-pan` | 1.4 / 2.5 | 1.3 / 2.5 | −0.1 / 0 |
| `hybrid-zoom` | 1.4 / 4.1 | 1.1 / 3.2 | −0.3 / −0.9 |
| `hybrid-orbit` | 1.4 / 2.2 | 1.2 / 2.2 | −0.2 / 0 |
| `hybrid-glide` | 1.5 / 2.7 | 1.4 / 2.7 | −0.1 / 0 |
| `hybrid-play` | 1.3 / 2.0 | 1.2 / 2.1 | −0.1 / +0.1 |
| `paper-pan` | 1.3 / 2.7 | 1.1 / 2.1 | −0.2 / −0.6 |
| `paper-zoom` | 1.0 / 2.2 | 0.9 / 1.8 | −0.1 / −0.4 |
| `paper-glide` | 1.2 / 2.8 | 1.1 / 2.3 | −0.1 / −0.5 |
| `paper-play` | 1.0 / 1.6 | 0.9 / 1.5 | −0.1 / −0.1 |
| `land-pan` | 1.1 / 1.9 | 1.1 / 2.0 | 0 / +0.1 |
| `land-zoom` | 0.8 / 2.3 | 0.9 / 2.1 | +0.1 / −0.2 |
| `land-orbit` | 0.9 / 1.8 | 0.9 / 1.4 | 0 / −0.4 |
| `land-play` | 1.0 / 1.5 | 0.9 / 1.6 | −0.1 / +0.1 |
| `low-pan` | 0.7 / 1.2 | 0.9 / 1.6 | +0.2 / +0.4 |
| `low-orbit` | 0.8 / 1.4 | 1.0 / 1.6 | +0.2 / +0.2 |
| `low-zoom` | 0.6 / 1.2 | 0.8 / 1.4 | +0.2 / +0.2 |
| **all passes** | **1.1 / 2.2** (3,891 passes) | **1.0 / 2.1** (4,116) | **−0.1 / −0.1** |

Within the budget in every motion: the worst excess is +0.2 ms at the median and +0.4 ms at the 95th percentile, both in the low perspective
views, where the far step's test and the band's arithmetic run for every item. A pass in motion is cheaper than 8B's, as the hold tries one place
where 8B searched them all; 8C lays the layer out in 6% more frames (4,116 passes against 3,891), the re-placement passes and the fades after
the view stops, which 8B did not run. `docs/stage8-evidence/8c/layer-cost.json`.

### 15.8 The recordings

`tools/stage8/record.js --app` (`record-app.js`): the same driver with the WebGL draw kept, every third frame of 30 a second captured, so each
clip shows 10 frames of the visitor's second, as Part A's do; stacked top to bottom: 8B, 8C, 8C under reduced motion
(`docs/stage8-evidence/8c/clips/`), each made with the driver as committed (its runs starting as an idle page stands, section 15.4):
- `hybrid-orbit.mp4`: Landscape with counters from the Field vantage at 09:30, orbited by a right-button drag of 6 px a frame for 2 s, then
  1 s at rest (31 frames shown, 3.1 s);
- `hybrid-zoom.mp4`: the same view, the wheel's ten notches in and ten out over 2 s, then 1 s at rest;
- `paper-zoom.mp4`: the paper map as entered at 09:30, the same wheel;
- `paper-play.mp4`: the paper map as entered while Play runs at ½x from 09:00 until the clock reaches 09:20, then 1 s at rest (71 frames
  shown, 7.1 s): the app's own Play, so the clock is held 1.5 s in the dwell at the 09:00 event's start and eases 0.5 s out of it (with
  120 frames, as the measured motion has it, the clock reached 09:15; the clip plays on to 09:20).
What they show agrees with section 15.6. While the view moves, 8B's counters and names take new places from frame to frame, and 8C's keep
theirs against their anchors; 8C draws visibly fewer of them in the zooms and the orbit (mid-zoom on the paper map two counters where 8B
draws five or six), the others fading out and coming back a moment later; at rest 8C moves nothing, and under reduced motion it keeps the
same places with no fade (the same layout at rest as 8C's). The clips are frame-stepped under software WebGL at 10 frames of the visitor's
second, not filmed in real time; `record-log.txt` gives each build's frames and clock at the end.

### 15.9 What was run

On the final build (md5 `04547a28...`, 2,357,922 bytes; the commits after `339143c` change the motion driver, the recorder and the records,
not the build), here on Chromium 141.0.7390.37, the headless shell Playwright 1.56 pins and CI runs, software WebGL, and on CI:
- `npm run build` writes the committed file byte for byte; `npm test`: all nine suites and the height guard pass; `check:data`: all 131
  declarations byte-identical to its reference; `check:chronology`: 0 errors; `check:baseline`: passes.
- `check:selftest` here (the driver before its fix): 270 of 270 by name, the slider, Play and the 3E keys by real key presses, the live
  blocks and the motion block passing; `check-report.js` judges its report again with no failure, and the manifest was written from it
  (the same 270 names; its build's md5). Again with the fixed driver (`88da6f0`), on a machine loaded with three other browser jobs:
  270 of 270, the motion block's 24 runs giving CI's counts run for run, `check-report.js` again with no failure.
- CI on `339143c` (run 40162602191): the checks job (`npm test`, `check:data`, `check:chronology`); `check:contrast`: 45 states reached
  (10 as a phone), every text at AA in the embedded faces, no console message, the seven start-up cases (`context-loss` 193 warnings, at most
  248; `context-depth` the frame within 27 pixels of the frame before the loss, the view hiding 3,741 pixels of the overlays); `check:selftest`:
  270 of 270 and the motion block; all pass. `check:visual`: its 39 cases, sweeps and live blocks, with five failures, exactly the five
  inherited unobstructed shares (section 15.1, C: `first-run` 62.6% and at 1280 x 720 50.7%, `first-run-laptop` 50.7%, `narrow-1024` 53.2%,
  `phone-844x390-explore` 68.8%, against their baselines 62.6%, 50.7%, 50.7%, 53.3% and 69.0%: each short by 0.0004 to 0.0021, which the log's one
  decimal hides in three); no other failure: every case's drops and dropped items, every text at AA, the self-test's 270 checks, the motion block
  (242 jumps, 1,014 pops, 130 switches, 18 flickers before the driver's fix) and the live blocks pass. No limit was moved.
- CI on `88da6f0` (the driver's fix; the push and pull-request runs 40176779106 and 40176781836, and with `check:visual` 40176782747):
  the checks job, `check:contrast` and `check:selftest` (270 of 270; 15-34 minutes by runner) pass in all three runs; `check:visual` (69
  minutes on its runner) fails the same five unobstructed shares with the same values and nothing else, and its motion block's 26 runs
  give exactly the counts measured here (section 15.4).
- The evidence of sections 15.1-15.8, each file naming its build (`docs/stage8-evidence/README.md`).
- Not run: a device of the owner's (none in this session: device acceptance is pending), Safari, a GPU's frame time.

### 15.10 What remains, and the owner's questions 255-258

*Decided by the owner with 8D's brief on 26 October 2026: 255 (a), 256 (a), 257 (b) and 258 (a) provisionally with (b) commissioned (section 16.1, with the owner's words). The questions are kept below as they were put.*

- **Question 255: the far step and battle information** (section 15.3). (a) **As built:** the step on place and terrain-study names only;
  battle information keeps `t-ui` (decision 16). (b) A step to 12 px for far battle information (a new token, `t-ui` less 0.5 px: within decision
  16, barely visible). (c) Far battle information at `t-small` (11.5 px): it would amend decision 16's 12 px floor. (d) A hierarchy for battle
  information by another means than size (a lighter plate or ink for far names, still at AA), to be prototyped and measured first. **Recommended:
  (a)**, with (d) as a prototype for a later PR if the low views' wall of names still reads as one weight.
- **Question 256: the five inherited unobstructed baselines** (section 15.1, C). (a) **Re-measure them on CI's browser**, by `remeasure.js` over
  two full runs on Playwright's pinned headless shell, as decision 141 set its re-measure: from today's measures `first-run` [0.625, 0.506],
  `first-run-laptop` [0.546, 0.506], `narrow-1024` [0.532, 0.628], `phone-844x390-explore` [0.687, —], each recorded with what was, what is and why;
  (b) keep them, CI reporting the five; (c) pin the container's Chromium on CI instead. **Recommended: (a)**: the shortfalls are a browser's
  rendering of the same page, not a change of the layout.
- **Question 257: the motion block's limits** (section 15.4). Section 3.5 set them "at the 8C build's measure and put to the owner then"; the
  owner's brief for 8C called section 3.5's values "the specified starting targets, not permission to change limits automatically". (a) **Keep
  the starting targets** (jumps 300, pops 1,300, flickers 200, the level-of-detail switches not above 8B's 130), as built; (b) set them at 8C's
  measure (jumps 245, pops 985, flickers 10, the level-of-detail switches 130), so a regression shows sooner, with the per-run invariants as now. **Recommended: (b)**, the block's
  counts being repeatable since the driver's fix (section 15.4: the same counts in every run here, with and without a pause before each run). CI's `check:selftest` gives the same counts (section 15.4).
- **Question 258: the formations' visibility while the view moves** (section 15.6). The owner accepted "fewer jumps and more temporary
  disappearances" as the starting design; measured, the formations in view are drawn in 75% of their frames over the 16 motions against 8B's 92% (69% against 100% in the paper map's zoom, 40% against 75% in the phone layout's pan), and a hidden one comes back 0.4-0.7 s after the layout has room for it (section 15.6). (a) **Accept it as built**; (b) prototype more places beside a counter's anchor (today
  one: a counter hidden by the hold has nowhere else to go, so counters disappear more than names) in a later PR, measured as here; (c) shorten the
  wait for a returning item (one pass with room instead of two): sooner back, more flicker. **Recommended: (a) now, (b) as a measured follow-up.**
- **The ribbons at the eye level** (recorded apart, section 14.6): the overlay ribbons stand 1.6-2.4 units over the ground at 4x, above an eye
  3 m (scaled) over it, so near the eye a ribbon is seen from below, edge-on, as a thread. 8C does not change it: a lift tied to the eye's height
  is a rendering change of the overlays, not of the map layer, and belongs with the low views' ground (8F) or a PR of its own.
- **Device acceptance: pending.** No owner hardware was available to this session. The layer's cost was measured on this machine's CPU (section
  15.7); its cost on the owner's laptop and iPhone is for the device runs section 8 plans (8D before, 8H after), with the route of step 6.
- **Not measured:** a GPU's frame time (software WebGL here); Safari (no WebKit here); a visitor's judgement of the fades and of following a
  formation (the recordings are for the owner).

## 16. Implementation PR 8D as built (26 October 2026)

**Status.** Built on `claude/kind-darwin-ewmlwu` (PR #69, base `main` at `8eb3ef4`, PR #68's merge); merged into `main` by the owner on 26 October
2026 (`2f41819`; the audit of it found two faults in culling's checks, corrected first in 8E, sections 17.1 and 17.2). It applies
the owner's decisions 255-258 (section 16.1, given with 8D's brief) and, as Part A's decisions set them, 249 (a) and 250 (b) (sections 8.3-8.5
and 10). In order, each in commits of its own: the prerequisite correction the audit of 8C found (section 16.2), decision 257 (b) (16.3),
decision 256 (a) (16.4), then 8D (16.5-16.11) and the records. Nothing of 8E: no richer kit, no gait drawn, no model detail added. No data file,
geography, simulation, visual convention, text size or `lowTier` setting changed (`check:data`: all 131 declarations byte-identical to its
reference; `lowTier` keeps density 1.0 and no shadow map, held by `css-test.js` since 8D).

### 16.1 The owner's decisions 255-258 (26 October 2026, with 8D's brief)

- **255: option (a).** "Accept option (a) for the current implementation: only eligible place and terrain-study names use the smaller far
  step. Preserve the battle-information text-size floor. Record option (d), a different visual hierarchy for far battle information, as a
  separate prototype task. Do not mark the low-view wall of formation names fully resolved." As built in 8C (section 15.3): nothing changes.
  Option (d) is recorded as a prototype task of its own (section 16.12, `docs/ROADMAP.md`); the wall of formation names in the low views
  (Part A's `horizon-east`: 16 formation names among 23 far items, none stepped) stays open.
- **256: option (a).** "Remeasure the affected inherited unobstructed-map baselines on Playwright's pinned CI browser using the required two
  full runs. Record the browser, exact build, previous values, measured values and reasons. Change only the justified affected baselines. Do
  not weaken unrelated checks." Applied in section 16.4.
- **257: option (b).** "For the deterministic 8C motion benchmark: jumps 245, pops 985, level-of-detail switches 130 and flickers 10, after
  confirming repeatability on the pinned environment. These are benchmark ceilings, not universal device-performance guarantees. Preserve
  the per-run invariants. Also add protection against worsening formation visibility and disappearance duration. Record the current
  per-motion baseline with exact denominators and test that a deliberately worsened result fails. Do not allow fewer jumps achieved by
  hiding more formations to count as an improvement." Applied in section 16.3.
- **258: option (a) provisionally, (b) commissioned.** "Keep the merged implementation provisionally and commission option (b) as a separate
  measured follow-up: additional placements close to a counter's anchor. The current visibility loss is not final UX acceptance. Preserve the
  two-pass return rule until a measured comparison justifies changing it. Do not fold a broad label-placement redesign into the culling PR."
  8D changes nothing of the map layer's placement (the prerequisite of section 16.2 changes only the opacity of an item given a priority);
  the two-pass rule (`MLS.PASSES` 2) is kept and held by `css-test.js` as before; option (b) is a follow-up of its own (section 16.12), to be
  measured as section 15.6 measured 8C, against the visibility baselines of section 16.3.

### 16.2 The prerequisite correction: a protected item drawn at full opacity at once (the audit of 8C; commit `314bb2f`)

- **Found** by the audit of 8C in an isolated probe of `mlLayout` (its DOM, projection and placement replaced by stand-ins): an item the
  stabiliser held hidden, given the keyboard's focus, was placed at once (decision 39 and A-2: what is never dropped, and the focus, are placed by
  the full search) but drawn at the fade's alpha, 0.09 a frame later, counted as on and not held. **Reproduced in a fresh browser by real
  input** (`tools/stage8/protect-8d.js`, `docs/stage8-evidence/8d/protect.json`, on `main`'s build `04547a28...`): Landscape with counters at the
  Field vantage at 09:30, orbited by the right button through the app's own handlers on the motion driver's clock until a formation's counter
  was held (Nansouty's, each time), the drag released while the input hold still ran, then a real Tab to it (from the item before it in the
  layer's order) or a real click on its row in the order of battle: in the frames after, the counter on, not held, at alpha 0.185 (its inline
  and computed opacity 0.19), then 0.37, 0.56 and 0.74 at 30 frames a second; 0.09, 0.19, 0.28 and 0.37 at 60. A visitor tabbing to a
  formation, or selecting it, while the view still moved saw it fade in over 180 ms behind the focus ring.
- **The correction.** In `mlLayout`'s fade step, an item the stabiliser never holds takes its state at once: the never-dropped items (`keep`:
  the selection, the hovered, the highlighted family, live events), the item with the keyboard's focus and its forced place (A-2). Its own
  presentation opacity (`it.op`, an overlay's fade-in) still multiplies the fade's alpha, as before; every other item fades as 8C built it.
  On the corrected build (`87578ebc...`): alpha 1, inline opacity none and computed opacity 1 in every frame after, by focus and by
  selection, at 30 and at 60 frames a second.
- **Held** by a self-test check (the manifest 270 to 271: four ways, each found while Landscape with counters orbits and given its priority by the
  app's own path: the element's focus, `select()`, a pointer's move to its anchor that the canvas's handler reads, and the focus given to a
  remnant fading out; one frame drawn: on, alpha 1, no inline opacity, computed opacity 1), the runtime-test dry run (the selection and the
  focus on an item held or fading in while the view moves; fails on 8C's code) and `css-test.js` (the rule, and the opacity formula). Reduced
  motion had no fades already; nothing a reading does not know is drawn (the motion block's count of such frames is 0 in every run); the
  keyboard's path and the focus's forced place are unchanged. Nothing else of the layer changed: placement, the hold, the band and the
  two-pass rule are 8C's (decision 258).

### 16.3 Decision 257 (b): the motion block at its own counts, and the formations' visibility held (commit `3c9e2eb`)

- **The ceilings.** `thresholds.js` `MOTION`: over the 16 motions, jumps at most 245, pops 985, level-of-detail switches 130, flickers 10 (were
  the owner's starting targets 300, 1,300 and 200, and 8B's 130). They are the deterministic benchmark's own counts on the pinned browser and
  state nothing about a device. **Repeatable:** on the prerequisite's build the self-test page's block (24 runs, Chromium 141 here) gives 245,
  985, 130 and 10, motion by motion 8C's, and its two runs by real input equal their twins; on CI, on `3c9e2eb`, the pull request's run and the two dispatched runs (40256875257, 40256833873, 40256841580) give the same totals and every run's counts and visibility the same, but for one glide in one of them (`hybrid-glide`: 1,221 formation-frames drawn of 1,805 where the baseline has 1,218, its counts and its longest disappearance the same: more drawn, which the rule allows; a glide's drawn count also moved by 3 when 8C's evidence was re-made with the driver's fix), and the push run's phone run, which was not the same run (below). The per-run invariants are kept as
  they were (no overlap, no never-dropped item hidden, no remnant out of rule, nothing drawn that the reading does not know, frames read as
  moving, idle at rest, a real-input run within 6 or 25% of its twin).
- **The formations' visibility, held per run.** A total under the ceilings bought by hiding formations is not an improvement, so every driven
  run (the 16, the two with Saint-Hilaire's division selected, the three under a reading, the finger's pan: 22) is held to its formations'
  visibility as the prerequisite's build measures it (`MOTION.VIS`, the driver's tracking, `tools/visual/motion.js`): the formation-frames in
  view (drawn, behind the ground or hidden by the layout: the denominator) exactly the baseline's, a change being another motion or a formation
  made absent; the drawn at least the baseline's; the longest disappearance by the layout at most the baseline's. A run by real input is held
  to its twin's within one frame (its denominator and its drawn within one frame's formations in view, its longest within one frame's time).
  The baselines, with their exact denominators:

| run (its key) | frames | formation-frames in view (the denominator) | drawn | share | hidden by the layout | behind the ground | disappearances | the longest (ms) |
|---|---|---|---|---|---|---|---|---|
| `hybrid-pan` | 91 | 2,049 | 1,378 | 67.3% | 671 | 0 | 26 | 2,467 |
| `hybrid-zoom` | 91 | 2,254 | 1,375 | 61.0% | 879 | 0 | 53 | 1,533 |
| `hybrid-orbit` | 91 | 2,548 | 1,489 | 58.4% | 1,059 | 0 | 51 | 2,200 |
| `hybrid-glide` | 76 | 1,805 | 1,218 | 67.5% | 587 | 0 | 36 | 2,533 |
| `hybrid-play` | 121 | 3,388 | 2,115 | 62.4% | 1,273 | 0 | 45 | 3,100 |
| `paper-pan` | 91 | 1,274 | 1,240 | 97.3% | 34 | 0 | 2 | 667 |
| `paper-zoom` | 91 | 1,229 | 850 | 69.2% | 379 | 0 | 27 | 667 |
| `paper-glide` | 76 | 821 | 566 | 68.9% | 255 | 0 | 30 | 633 |
| `paper-play` | 121 | 1,694 | 1,570 | 92.7% | 124 | 0 | 8 | 667 |
| `land-pan` | 91 | 2,051 | 1,869 | 91.1% | 182 | 0 | 14 | 1,133 |
| `land-zoom` | 91 | 2,261 | 1,730 | 76.5% | 531 | 0 | 37 | 667 |
| `land-orbit` | 91 | 2,366 | 1,955 | 82.6% | 411 | 0 | 27 | 667 |
| `land-play` | 121 | 3,146 | 2,613 | 83.1% | 533 | 0 | 32 | 667 |
| `low-pan` | 91 | 885 | 820 | 92.7% | 65 | 0 | 5 | 533 |
| `low-orbit` | 91 | 887 | 691 | 77.9% | 196 | 0 | 15 | 633 |
| `low-zoom` | 91 | 633 | 505 | 79.8% | 128 | 0 | 9 | 633 |
| `hybrid-orbit+sel` | 91 | 2,548 | 1,494 | 58.6% | 1,054 | 0 | 53 | 2,000 |
| `paper-zoom+sel` | 91 | 1,229 | 823 | 67.0% | 406 | 0 | 29 | 667 |
| `hybrid-pan+fr` | 91 | 1,935 | 1,308 | 67.6% | 627 | 0 | 22 | 2,467 |
| `hybrid-pan+al` | 91 | 1,346 | 979 | 72.7% | 367 | 0 | 17 | 2,467 |
| `paper-play+al` | 121 | 1,331 | 1,180 | 88.7% | 151 | 0 | 9 | 667 |
| `phone-pan+touch` | 91 | 732 | 296 | 40.4% | 436 | 0 | 25 | 1,367 |
| **the 16** | | 29,291 | 21,984 | 75.1% | 7,307 | 0 | 417 | |

- **Found on CI, and fixed in the driver (commit `067bb83`).** On CI the block's finger's pan at 390 px was not the same run on every runner:
  the push run's `check:selftest` on `3c9e2eb` (run 40256828983) measured it at 1,490 drawn of 2,133 formation-frames in view, 26
  level-of-detail switches and a 2,467 ms disappearance, where this container, the dispatch run's `check:selftest` on the same commit
  (40256841580) and 8C's CI run on `main`'s build (40176782747) measured 296 of 732, no switch and 1,367 ms; the 16 motions, the selections
  and the readings matched on every runner. The run is the only one that follows a resize of the page (1600 x 900 to 390 x 844), and the app
  takes a resize in its handler, at a rendering step: the phone layout (`PHONE`), the eye's aspect, the view offset, and with them the portrait
  framing of the view the run sets up (the eye drawn back from the Field vantage's 243.7 units to 426.8). The driver gave the handler a fixed
  wait. Set up before the handler has run (reproduced here by setting the view up at once after the resize), the run is another run: 521 of
  1,266, 4 jumps, the eye at 243.7 units; what a slow runner measures depends on when in the run its handler comes. `tools/visual/motion.js`
  now waits, after any resize, until the app has run its handler (the window's size, the eye's aspect, and `PHONE` as the media query says)
  before the view is set up. No app code changed; the counts here are unchanged, and decision 257's baseline for the run is the phone
  layout's, as a phone visitor has it. After the fix, on `067bb83`, `check:selftest` passes in the push run, the pull request's run and a
  dispatched run (40260005010, 40260008599, 40262942179), each giving the totals 245, 985, 130 and 10 and every run's counts and visibility the
  baseline's (the phone run 296 of 732, no switch, 1,367 ms, in all three), but for the glide's 1,221 in one; the full `check:visual` run on
  `3c9e2eb` (40256841580) measured the same in its 26 runs.
- **Made to fail** (`tools/stage8/vis-257.js`, `docs/stage8-evidence/8d/vis-257.json`): a recorded report's block, judged as `check:report`
  judges it, passes as recorded and fails, with the rule's own words, each of twelve worsened copies: a run's drawn one fewer; its longest
  disappearance one frame longer; its denominator one smaller; five fewer jumps bought by 40 formation-frames hidden by the layout (the totals
  then under the ceilings: 240 jumps); the same with the frames made absent (the denominator 40 smaller); a run by real input 40 formation-frames
  under its twin; each total one over its ceiling; a run's visibility not measured. And the block run on a copy of the prerequisite's
  build whose stabiliser, while the view moves, hides a formation whose held place is taken instead of placing it close to its anchor (the
  hold's near search removed): its jumps over the 16 motions fall from 245 to 42, under their ceiling, and it fails by its formations'
  visibility in 12 runs (in `land-orbit` 1,711 formation-frames drawn of 2,366 against the baseline's 1,955; in `low-orbit` 614 of 887 against
  691), and by its pops (1,195) and flickers (17) over their ceilings.
- **Where it runs.** The harness's motion block moved into `tools/visual/motion.js` (`runBlock`, with each run's key and tracking), unchanged in
  what it drives and measures; `tools/stage8/motion-8d.js` runs the same block on a page of its own.

### 16.4 Decision 256 (a): the inherited unobstructed baselines re-measured on CI's browser (commit `e008825`)

- **Why.** Since roadmap step 1 CI's runner has measured five unobstructed shares a few hundredths of a point under their baselines (sections
  13.3 and 15.1, C), on `main`'s build and every build since: the baselines were measured in this container's Chromium, and CI's browser, the
  headless shell Playwright pins, draws the same layout a little narrower. They are a browser's rendering of an unchanged layout, not a
  regression; decision 256 (a) re-measures them on CI's browser.
- **The runs.** Two full `check:visual` runs on CI's runner (`ubuntu-latest`, linux, Chromium 141.0.7390.37, Playwright 1.56.0's headless
  shell), of the prerequisite's build (`87578ebce0e414a4c8b308d88f7abc03`, which the second and third prerequisites leave unchanged): run
  40256841580 on `3c9e2eb` and run 40262942179 on `067bb83`. A third, 40256833873 on `3c9e2eb`, ended at 66 minutes without its report
  (its job's log was not kept) and is not used. Both runs fail those five shares and nothing else, and measure every case's share
  identically to four places (`docs/stage8-evidence/8d/unobstructed-256.json`).
- **The method.** `tools/visual/remeasure.js --bounds keep --accept-loosening 256`, decision 62's method as decision 141 applied it: a bound
  is kept where both runs meet it, and lowered to the measure rounded down to 0.1 point only where CI's browser measures it below. The new
  `--accept-loosening 256` accepts only the lowering of the four cases' unobstructed baselines decision 256 names, and stops on any other change
  it would propose (shown: with another case's share lowered in copies of the two reports it stops and names it). None was proposed, and
  both runs then pass every check (`check-report.js` on each). `remeasure.js` also wrote a phone case's baseline, which has no 1280 x 720 value
  (null since roadmap step 6), as `[0.687,]` and failed on it; it now writes JSON.

| case | viewport | was | measured, both runs | is |
|---|---|---|---|---|
| `first-run` | 1600 x 900 / 1280 x 720 | 0.626 / 0.507 | 0.6256 / 0.5069 | **0.625 / 0.506** |
| `first-run-laptop` | 1366 x 768 / 1280 x 720 | 0.546 / 0.507 | 0.5461 / 0.5069 | 0.546 / **0.506** |
| `narrow-1024` | 1024 x 768 / 1280 x 720 | 0.533 / 0.628 | 0.5321 / 0.6291 | **0.532** / 0.628 |
| `phone-844x390-explore` | 844 x 390 (a phone; no 1280 x 720 measure) | 0.690 | 0.6879 | **0.687** |

  Five values in four cases, each 0.1 to 0.3 point; every other baseline, drop limit and floor is unchanged (`docs/stage8-evidence/8d/
  remeasure-256.txt`, the tool's whole output over the two runs). On 8D's commit CI's `check:visual` (40276605486) measures the four cases
  identically again and passes them at the new baselines (section 16.13).

### 16.5 three r128, read before the mechanism was chosen (`node_modules/three`, 0.128.0, the version the page loads from cdnjs)

- **An instanced mesh is never culled.** `InstancedMesh`'s constructor sets `frustumCulled = false` (`objects/InstancedMesh.js:23`), because
  `Frustum.intersectsObject` (`math/Frustum.js:65-75`) tests the geometry's bounding sphere through the object's world matrix: for an instanced
  mesh that is one instance's sphere at the mesh's origin, wherever its instances stand. r128 has no bounding volume of an instanced mesh's own
  (r151 later added `InstancedMesh.computeBoundingSphere`); r128's `intersectsObject` also computes and writes the geometry's own sphere where
  it has none, which for the kit's geometries, shared by every block of their class, would be one man's sphere.
- **Both passes cull, each with its own frustum, through the same test.** The world pass keeps a mesh when `!object.frustumCulled ||
  _frustum.intersectsObject(object)` with the eye's frustum (`renderers/WebGLRenderer.js:1214`); the shadow pass draws a caster when
  `object.castShadow && (!object.frustumCulled || _frustum.intersectsObject(object))` with `_frustum = shadow.getFrustum()`, the light's
  (`renderers/webgl/WebGLShadowMap.js:183, 400`). So a mesh whose frustum test reads the right bounds is culled in each pass by that pass's
  frustum, and `visible` need not be touched: hiding a block would also take its shadow away.
- **The shadow's material.** For the sun (a directional light) the shadow pass draws an object's `customDepthMaterial` when it has one, else
  three's own depth material (`WebGLShadowMap.js:284`); so a vertex hook in the kit's own material moves only what the eye sees unless the kit's
  depth material carries the same hook.
- **The opaque draw order is by material.** The render list's sort compares programs first (`painterSortStable`), but it reads a material's
  program from `materialProperties.program` (`renderers/webgl/WebGLRenderLists.js:85, 100`), a field r128 no longer sets (it keeps
  `currentProgram`, `WebGLRenderer.js:1442`): every item sorts as the default program, so opaque meshes are drawn by render order, then by
  their material's id, in the order the materials were made. Two consequences for 8D: a test that swaps a material for a clone draws that mesh
  after every other (a few coplanar faces, a standard's staff and cloth against its bearer, are settled by that order: 1,125-1,403 pixels of the
  low Pratzen view); and 8D's own depth materials, never drawn in the world pass, leave the world pass's order as 8C's.

### 16.6 Culling (decision 249 (a); `app.js` `CULL`, `cullBlock`, `cullGeo`, `cullRefresh`, `cullTest`, `setCull`)

- **The mechanism.** Every instanced mesh of every formation block (the men's and riders' coats and fixed parts, the horses, the guns, crews,
  teams and limbers of a battery, the skirmishers, the standards' poles, cloths and finials: 338 meshes on the day, 255 of them the kit's) is
  given bounds of its own in `userData.cull` and its `frustumCulled` set on (`cullBlock`, from `buildFormations`). three's
  `Frustum.prototype.intersectsObject` is replaced by one that, for an object with such bounds, refreshes them if stale and tests their sphere
  through the object's world matrix (`cullTest`), and for every other object calls r128's own, unchanged. No other object's culling changes.
- **The bounds** are those of what the GPU draws: a sphere in the mesh's own frame over its first `count` instances, each instance's sphere
  being its geometry's sphere carried through that instance's matrix (centre transformed, radius scaled by the matrix's largest axis), widened
  by the animation's envelope (`animEnv`, section 16.7) before the scaling, so that the bound holds every vertex of every drawn instance in any
  pose the hook can give it. The instance matrices already carry everything that places a man: the formation's frontage and depth (line,
  column, square), the battalions shown, a battery deployed or limbered, the seating on the drawn ground with its slopes, the facing and the
  jitter, and the display factor's height. The block's own transform (its position, rotation and scale) is in the mesh's world matrix, applied
  at the test. A mesh with no instance to draw (a cloth whose standards are not shown) is culled: before 8D three issued no draw call for it
  (r128 issues none for no instances) but set its program and buffers up in every pass.
- **Shared geometry is never written.** Each geometry's own sphere is read once from its positions into `CULL.geo` (keyed by its uuid);
  `geometry.boundingSphere` and `computeBoundingSphere` are never touched by the culling code (`css-test.js` holds it), so the kit's
  geometries, shared by every block of their class, keep r128's state.
- **Invalidation.** The bounds are refreshed at the test, not every frame: when the mesh's `instanceMatrix.version` differs from the one they
  were made from (three's own signal that the matrices changed and must be uploaded: `layoutFigs` and `placeStandards` set it whenever a block
  moves, turns, re-seats, changes its shape, shows another number of battalions or limbers its guns), when its `count` changed (`showBattalions`,
  `stdCount`) or its geometry. So the bounds are current for whoever renders, whenever (a frame, the shadow pass, the self-test's own renders),
  and an unchanged mesh costs one comparison of three values. The clock, the presentation, the mode, a formation's state and the terrain reach
  the bounds only through the matrices they change; the camera only through the frustum.
- **Camera visibility, shadow visibility and knowledge stay apart.** Culling never writes `visible`: a block outside the eye's frustum and
  inside the sun's box is drawn in the shadow pass and casts into the view (section 16.9). The model's knowledge rules ("Whose eyes?", the
  readings of decision 251) decide what is drawn as before, through `visible` and the map layer; culling reads neither and changes neither, nor
  the selection, the labels, the dossiers, the history or the simulation. The figure, standards and seating checks read every block, drawn or
  culled (their meshes are their own whether or not a frame draws them).
- **A measurement switch.** `CULL.on` false (`setCull`; as `CONF.none`, the app never sets it: `css-test.js` holds that only the self-test and
  the measures switch it) draws every block in both passes, as before 8D. The census, the equivalence checks and the device route's culling
  route use it.
- **Its own cost, counted.** `CULL.frame` (reset with `renderer.info` at each frame's start) counts the tests, the meshes culled, the bounds
  refreshed and their instances, and the time spent; `CULL.total` the same over the page's life; the developer readout shows the frame's.
  The refresh reuses one scratch array (grown once to the largest mesh's instances) and the test one preallocated sphere: no allocation per test.

### 16.7 The kit's animation hooks, for 8E (decisions 244 (a), 250 (b); `app.js` `ANIM`, `animAt`, `animEnv`, `kitMerge`, `animGLSL`, `animHook`, `animMesh`)

- **The attribute.** Every vertex of the figure kit's geometries (a man's coat and his fixed parts, a rider's, a horse; 30 geometries on the
  day, shared by class) carries `aPart`, one float, the part it belongs to (`kitMerge`; `kitPart` names a part's own number, else the
  geometry's default): 1 and 2 a man's left and right legs, 3 his left arm (the right carries the musket, drawn with his body), 10 the rest of
  a man; 5-8 a horse's legs (left fore, right fore, left hind, right hind); 11 the rest of a horse; 12 a rider. The gear, the guns and the
  standards carry none. Its space is the geometry's own: the figure's frame in kit units, feet at y 0, facing +z, before the instance's matrix.
- **The motion it allows.** A part swings about its joint, the line along x through (y, z) = (py, pz), by `A x amp x sin(phase + 2 pi off)`,
  and the figure rises by `bob x amp x |sin(phase)|`; `phase` (radians) and `amp` are the mesh's two uniforms, `uAnimPhase` and `uAnimAmp`,
  `amp` clamped to [0, 1] in the shader. `ANIM.PART` holds each part's A, off, py, pz and bob: DESIGN values carried from Part A's `f-gait`
  prototype (section 4.3), its joints set on this kit's boxes; 8E sets the rule that drives phase and amp and may retune the table, through
  its own evidence step for the gait (section 4.3); nothing in 8D is a claim about how men or horses moved.
- **The hook.** One vertex hook (`animHook`), the same text in a kit mesh's own material and in its own depth material, so that the shadow
  casts whatever pose the figure is drawn in: it gives the atmosphere's uniforms first (as every material's default hook does: the fog and the
  haze unchanged), declares `aPart` and the two uniforms after three's `common` chunk, and moves `transformed` right after three's
  `begin_vertex`, before the instance's matrix, the projection and the depth's packing (the fog's distance is the moved vertex's). With `amp` 0 the branch
  is not taken and the vertex is exactly three's (section 16.9: the frame with the hooks is the frame without them, 0 pixels). The colours,
  the instance colour and the vertex colours are untouched (the hook writes the position only); the kit is flat-shaded, its normals the faces'
  own taken in the fragment shader from the positions drawn, so a swung part is lit as it stands without a normal of its own. All kit materials share one program and all kit depth materials another (one function, one
  program cache key): two programs more than 8C's (30 to 32 in the low Pratzen view), compiled once; a mesh first drawn when it enters the view
  takes them from three's cache.
- **Ownership.** The uniforms belong to the mesh (`mesh.userData.anim`, shared by its two materials): 8E's rule will write them, per mesh; in
  8D nothing writes them but the self-test's controlled check and the mutations (`css-test.js` fails any other writer). `ANIM.built` and
  `ANIM.depth` count the materials the hook has been built into (three runs it as it makes each material's program, again after a restored
  context; the materials share the two programs).
- **The envelope.** `animEnv(geometry)` is the largest displacement any vertex of that geometry can take for any phase and any amp in [0, 1]
  (the chord of its largest swing about its joint plus its bob, `2 r sin(A/2) + bob`), computed once per geometry; the culling bounds are
  widened by it (section 16.6), so 8E's gait needs no change to them. The self-test checks every vertex of every kit geometry at 16 phases at
  amp 1 against it (219,216 positions, none outside).
- **Proved working, not shown.** The self-test's controlled check (section 16.9 (f)) sets amp 1 at a quarter cycle on the kit meshes in view
  of the low Pratzen view: the frame changes (126,635 pixels here, 126,641 on CI's runner; 117,219 and 117,235 with the shadow held at rest, the figures alone) and so does the sun's
  depth map where those blocks cast (9,329 of 65,536 texels read); with the depth materials' hook removed the depth map does not change (0 texels: the shadow would have stayed the rest pose's); back
  at amp 0 both frames are the rest frames (0 and 0). No visitor sees it: nothing in the app sets amp.

### 16.8 The census, a measure the harness holds (decision 250 (b); `tools/visual/measure.js` `census`, `cullEquiv`; `thresholds.js` `CENSUS`)

- **What it counts.** Step 6's `tools/step6/census.js` counted one frame's draw calls by what was drawn; since 8B the frame has another pass
  (the ground's own depth for the overlays, `GDEPTH`, drawn only when its key changes) and 8D adds culling, so the census is now a harness
  measure of its own: every draw call of one whole frame where three r128 issues it (`renderer.renderBufferDirect`, wrapped for that frame
  and restored), by pass, `shadow` (the sun's map: a call with no scene, inside the world's render), `depth` (8B's pass, its own scene),
  `world` (the app's scene through the world layer; with the visual effects off the one pass), `labels` (the map symbols over the graded
  frame) and `post` (the effects' quad passes), and by what is drawn (a block's men and horses by the kit's geometries, its guns and gear, its
  standards; the ground, the trees and the rest by name). Triangles as three counts them (the index or position count within the draw range
  and group, times the instances); an instanced mesh with no instance reaches three's draw but issues no call (r128 returns before it, and
  `renderer.info` counts nothing), so the census counts it apart (`empty`), as a frame without culling still sets it up. Both sums are reconciled with `renderer.info` for the same frame (the app resets it as each frame begins):
  in every frame measured here, calls and triangles equal, both builds.
- **Like with like.** Four frames per view: culled and not (`setCull`), each with the depth pass reused from the frame before (a still eye:
  its key unchanged) and drawn again (a frame whose eye moved: its key cleared first). So the depth pass's cache never passes for a saving of
  culling's, and a build without culling (8C's) is measured the same way, its one frame standing for both. The tables below compare the frame
  whose eye moved (the depth drawn), culled against not.
- **Held by the harness.** `check:visual` takes the census in every one of its 39 cases (the four frames, reconciled) and compares the frame
  culled with the frame not culled, both drawn from one state and read from the drawing buffer at once (`cullEquiv`): judged in
  `thresholds.js` (`censusCheck`): every frame reconciled; 0 pixels differing beyond the case's own two renders' difference (0 in every case:
  under software WebGL two renders of one state are identical, so no tolerance is needed); section 8.3's desktop budget on the frame as drawn
  when the eye moves (a desktop's case at most 2.8 million triangles and 900 draw calls; a phone case, `lowTier`, over 1.62 million triangles is
  reported for the device run, not failed, as section 8.3 provides: the phone route decides it); and in `pratzen-low` the frame's triangles,
  every pass with the depth drawn, at least 10% under the same frame drawn without culling. Its console line prints both frames by pass in
  every case.
- **The 10% target, defined.** Section 10 set "the triangles in the low Pratzen view down by at least 10%" from step 6's measure, "339,000 of
  the world pass's figure triangles off the screen there, 13.7% of the frame". The target is held as stated, on the whole frame (world,
  shadow, the ground's depth, labels and post together, the depth drawn, the harness's `pratzen-low` case at 4x, 1600 x 900): not on the
  world pass alone, where the saving is larger, and not on the figures alone.

### 16.9 The picture unchanged, and the boundaries held

**The tolerance is 0.** Every comparison of culling below draws the frame with culling and the frame without it from one state, in one
page, and reads each from the drawing buffer at once (`gl.readPixels` right after the render): under software WebGL two renders of one state
are identical (every repeat measured here, 0 pixels), so no rendering tolerance is needed and none is allowed. Screenshots are not used for
it: the harness's screenshots come after the settling frames, whose easing differs between two captures by a few pixels. The comparison of
the two builds (below) is of another kind: fresh pages, whose frames already differ a little from load to load.

- **The self-test's 8D block** (13 checks, `app.js`; run on one fresh page at 1366 x 768 by `check:selftest`):
  - *(a) the bounds hold, at 1x, 4x and 10.33x:* every instanced mesh of every block (338, 255 the kit's): each instance's own sphere (its
    geometry's through its matrix, widened by the envelope) and every vertex of its first, middle and last instance in the world (239,091)
    inside the mesh's bounds;
  - *(b) a sweep of views at each factor:* the vantages, the low Pratzen view, close on Sokolnitz, every formation drawn as figures taken out
    of the view by each of its four edges at 0.75, 1 and 1.25 times the half-width or half-height, and at 4x the eye level at Napoleon's
    headquarters (380 views at 4x, 379 at 10.33x; 115,140 and 114,837 mesh tests): a mesh is culled only when none of its instances is in the eye's
    frustum (88,188 and 88,340 culled, none wrongly), and a mesh whose centre is out of view with figures in it is drawn (4,679 and 5,147 times;
    r128's own test would have culled each); at 1x the blocks are not drawn (footprints, decision 34), so nothing is tested;
  - *(c) the passes and the picture, at each factor,* in an instrumented frame of the low Pratzen view and of the close view of Sokolnitz: the
    world pass draws exactly the meshes the eye's frustum holds, the shadow pass exactly those the sun's box holds and every mesh with an
    instance in it (at 4x 334 meshes in the world pass, 492 in the shadow pass, 185 of them out of the eye's view and casting; at 10.33x 231,
    526 and 314); the frame with culling is the frame without it, 0 pixels in both views at both factors (two renders 0);
  - *(d) the bounds follow the block:* after Saint-Hilaire's division's shape is changed (1.6 times the frontage, half the depth), a battalion
    fewer shown and back, the battery on the Pratzeberg's heights (`heightguns`, the first battery drawn, at 13:00) limbered and deployed, the
    display factor's change to 10.33x and a move of the clock, each mesh's bounds are refreshed at its next test and hold its instances (90
    mesh tests);
  - *(g) a shadow from outside the view:* with the sun low (08:20), the eye placed on the sun's side of a block and looking along its shadow,
    so that the block stands behind the eye and its shadow before it (Saint-Hilaire's division: 10 meshes, 9 drawn in the shadow pass, none in
    the world pass): the frame equals the frame without culling (0 pixels); hiding the block, as culling by `visible` would, changes 108 pixels
    (its shadow in the view): culling must and does keep them;
  - *(e) the hooks inert* (section 16.7): every kit vertex in `ANIM`'s table, every kit mesh hooked on both materials with its uniforms at 0,
    the hook built into 459 materials and 245 depth materials over the whole self-test (216 and 216 with the block alone on a fresh page: the other checks build more of the kit, and a mesh never drawn gets its program when it is); the
    low Pratzen view with and without the hooks 0 pixels with the draw order held (`renderer.sortObjects` off in both; 1,125 as three sorts
    them, the clones drawn last: section 16.5);
  - *(f) a controlled deformation* (section 16.7): the figures and their shadow move alike; without the depth material's hook the shadow does not;
    back at rest both as before; every vertex within its envelope.
- **Culling in motion** (the live block `cull` of `check:visual`, `tools/visual/cullmotion.js`; run on its own by `tools/stage8/cull-8d.js`,
  `docs/stage8-evidence/8d/cull-motion.json`): fourteen sequences of the app's own frames on the motion driver's clock on a desktop's page at 1280 x
  720 (the desktop's tier with its shadow pass, which the block requires of each: below 900 x 700 the app draws the low tier, density 1.0 and
  no shadow, decision 236), the motion reaching the app as a visitor's does, and a finger's pan on a phone's page (390 x 844, density 3,
  `lowTier`); every frame's culling judged against its instances, and every second frame and each run's first drawn compared with the same
  state drawn without culling. On the committed build (run here in three parts and joined, `cull-8d.js --join`, judged as `check:visual`
  judges the block): 15 runs, 485 frames judged and 243 compared, **0 pixels differing**; 48,624 meshes culled, none with an instance in view;
  35,825 mesh-frames drawn in the shadow pass only (out of the view and casting into it: the edges, the low sun, the zoom, 10.33x, the
  restored context); 1,699 boundary crossings (a mesh changing between culled and drawn), 1,088 of them in the two edge sequences; the
  reduced-motion jump's one frame compared; 28 frames judged after the restored context; the phone's pan on `lowTier`, without a shadow pass,
  973 culled, 0 pixels. CI's `check:visual` on 8D's commit ran the block whole and measured exactly the same, run by run (section 16.13).
  **Found while it was built, and fixed:** the block first ran its sequences on a 960 x 540 page,
  where the app draws the low tier, so that no shadow pass was drawn and no mesh could cast from out of view (the low sun's sequence counted
  none); a glide under reduced motion draws one frame and rests, so that no frame was compared; and the two edge sequences named no camera
  for the harness's case set-up, which stopped the block. The block's own rules now fail a desktop sequence drawn without its shadow pass and a
  sequence with no frame compared.
- **Two builds, frame for frame** (`tools/stage8/xbuild-8d.js`, `docs/stage8-evidence/8d/xbuild.json`): 8C's build and 8D's, each on five fresh
  pages, in six views with one eye placed by its numbers (the vantages' framing put aside, so that both builds look from the same point), the
  WebGL frame read from the drawing buffer. Fresh pages of one build already differ among themselves, in either build alike (8C's 196 to
  2,354 pixels of the 1,440,000 in a view, 8D's 183 to 4,277): what a page settles to is not wholly the same from load to load. Outside those
  pixels, in five of the six views (the low Pratzen view, the selected formation, the Field vantage's Overview, the eye level at the Zuran
  and phase 8's Overview in Watch) no pixel differs between the builds. Close on Sokolnitz, in that session, 47 pixels did, each the same on
  all five pages of each build (1 to 6 levels of 255, in the view's upper right: the 24 recorded at x 958-1,564, y 356-437). They did not
  reproduce: the same view on six fresh pages a build, in a session of its own (`xbuild-sokolnitz-2.json`), gives none outside the 1,343
  pixels that differ between pages, and the 24 recorded pixels read again in a third session were the same on both builds at 23 of them. So
  no change of the frame is attributable to the build; what made those 47 pixels agree within each build in one session is not established,
  and is recorded as found.
- **Each check made to fail.** The self-test's 8D block on the build and on eight copies with one rule broken (`tools/stage8/mutate-8d.js`,
  `docs/stage8-evidence/8d/mutate-8d.json`; the block alone, on a fresh page at 1366 x 768): the build passes its 13 checks; r128's own frustum
  test for the blocks fails 8 of them (the bounds at each factor, the sweep and the passes at 4x and 10.33x, the bounds following the
  block); the bounds' radius halved, the same 8; no envelope, 6 (the bounds at each factor, the sweep at both factors, the bounds following
  the block); the bounds never refreshed, 7 (as no envelope, and the passes at 4x); the shadow pass culled by the eye's frustum (camera-only
  culling), 3 (the passes at both factors, and the shadow from out of view: none of the meshes out of view casting); the depth material without the hook, 2 (the
  hooks, and the controlled deformation: the shadow does not move); the kit's own material without the hook, 2 (the hooks, and the controlled deformation: with the shadow held at rest the frame does not change, 0 pixels, the figures drawn at rest; 12,314 pixels change, the shadow's alone); and the prerequisite
  undone fails the 8C block's check (focus and selection: alpha 0.19, opacity 0.19). `css-test.js`'s 8D block on the source and on eight
  copies of `app.js` with one rule broken (`tools/stage8/mutate-css-8d.js`, `docs/stage8-evidence/8d/mutate-css-8d.json`): it passes on the
  source and fails each copy with its own words (a block left without bounds; a mesh with nothing to draw hidden by `visible`; the bounds not
  refreshed by the matrices' version; a shared geometry's own bounds written; the app switching culling off on a low tier; the depth material
  without the hook; the gait's uniforms written outside the self-test; `lowTier`'s shadow setting changed). The culling-in-motion block on
  two copies (`cull-8d.js --mutate`, on the sequences that cross each rule's boundary, judged as `check:visual` judges the block): the bounds'
  radius halved, on the pan from the Field vantage and Saint-Hilaire's division leaving by each edge, 219 frames with a mesh culled whose
  instance is in view and 11,472 pixels differing; the shadow pass culled by the eye's frustum, on the low sun's orbit, no mesh casting from
  out of the view (6,230 on the build) and 2,136 pixels differing: each fails. The runtime test's dry run (`runtime-test.js`, "culling and the hooks"): every block's
  meshes bounded and their instances inside, every kit mesh hooked on both materials at 0, and a test mesh of its own culled behind the eye and
  drawn before it, its bounds refreshed by a moved instance and a count change and not otherwise, culled with nothing to draw.

### 16.10 8C's layouts, motion, focus and readings: unchanged but for the prerequisite

8D changes nothing of the map layer: culling reads neither the layer nor the readings, and the layer reads nothing culling writes. Measured:

- **Fresh layouts** (`tools/stage8/fresh-8c.js --ref <prerequisite> --cand <8D>`, `docs/stage8-evidence/8d/fresh-8d.json`): the 20 `check:visual` cases applied by their spec are laid out identically on both builds, item by item and box by box (each item's state, box and leader), 20 of 20.
- **The motion block** on 8D's build (`tools/stage8/motion-8d.js`, `check:visual`'s set of 26 runs, `docs/stage8-evidence/8d/motion-ae7f16b8-1.json`): the totals 245, 985, 130 and 10, and every run the self-test page shares with the prerequisite's build (24 of them) identical in its jumps, pops, switches, flickers, formation-frames in view, drawn and longest disappearance; judged as `check:visual` judges the block, it passes decision 257's ceilings and visibility baselines. On CI the self-test page's block on 8D's build (run 40276598532) gives the same: every one of its 24 runs the
  baseline's exactly.
- **8C's motions and the formations followed** (`tools/stage8/label-motion.js --app` on 8D's build, `docs/stage8-evidence/8d/label-motion-8d.json`,
  against `8c/label-motion-8c.json`, the same browser): the totals over the 16 motions 245, 985, 130 and 10, and those of the four by real
  input, the four with a selection and the readings' and the phone's, exactly 8C's; in every one of the 28 runs the jumps, pops,
  level-of-detail switches, flickers, overlaps, never-dropped items hidden, remnants out of rule and items drawn that the reading does not know
  identical, and in 27 of them every count of the formations followed as well. The two glides differ by a few frames in what the layer
  held and drew (`hybrid-glide`: 1,218 formation-frames drawn of 2,280 against 1,221, and 1,178 item-frames held against 1,159; `paper-glide`:
  729 item-frames held against 731), the variation a glide shows from run to run on one build (section 16.3).
- **Focus and the readings:** the self-test's 8C block (the focus placed by the full search in every frame of an orbit; a reading changed
  while the view moves; nothing drawn that it does not know) and its prerequisite check pass on 8D's build; the motion block's runs under a
  headquarters' reading draw nothing the reading does not know (0 item-frames).

### 16.11 Performance: what 8D costs and saves, measured here; the devices pending

**The census, per view and pass** (`tools/stage8/census-8d.js`, `docs/stage8-evidence/8d/census.json` and `census.md`): the frame whose eye moved
(the ground's depth drawn), the prerequisite's build (8C's frame, the baseline before culling) against 8D's, calls / triangles:

| view | world pass | shadow pass | whole frame | triangles | step 6's estimate (world, figure meshes wholly off the view) |
|---|---|---|---|---|---|
| `close-sokolnitz` | 493 / 1.471 M → 387 / 1.267 M | 275 / 1.020 M | 781 / 2.638 M → 675 / 2.434 M | **-7.7%** | 293.0 k (159 of 289 meshes) |
| `close-sokolnitz-10x` | 484 / 1.468 M → 317 / 1.178 M | 275 / 1.020 M → 274 / 1.019 M | 771 / 2.635 M → 603 / 2.345 M | **-11.0%** | 368.0 k (196 of 289 meshes) |
| `pratzen-low` | 471 / 1.455 M → 293 / 1.119 M | 278 / 1.026 M → 239 / 945.0 k | 760 / 2.628 M → 543 / 2.211 M | **-15.9%** | 339.0 k (179 of 293 meshes) |
| `selected-formation` | 465 / 1.474 M → 390 / 1.300 M | 289 / 1.043 M | 766 / 2.663 M → 691 / 2.490 M | **-6.5%** | 174.8 k (85 of 303 meshes) |
| `watch-selected` | 452 / 1.455 M → 335 / 1.235 M | 279 / 1.026 M | 742 / 2.628 M → 625 / 2.408 M | **-8.4%** | 234.0 k (121 of 293 meshes) |
| `hybrid-dimmed` | 452 / 1.459 M → 350 / 1.283 M | 279 / 1.026 M → 274 / 1.019 M | 742 / 2.632 M → 635 / 2.449 M | **-7.0%** | 176.3 k (102 of 293 meshes) |
| `pratzen-low-10x` | 472 / 1.456 M → 292 / 1.115 M | 278 / 1.026 M → 277 / 1.026 M | 761 / 2.629 M → 580 / 2.288 M | **-13.0%** | 349.4 k (181 of 293 meshes) |
| `eye-zuran` | 160 / 362.6 k → 139 / 285.4 k | 36 / 133.3 k → 27 / 97.0 k | 207 / 643.0 k → 177 / 529.6 k | **-17.6%** | 90.4 k (24 of 39 meshes) |
| `phone:pratzen-low` | 440 / 1.458 M → 212 / 1.031 M | 0 / 0 | 451 / 1.605 M → 223 / 1.178 M | **-26.6%** | 426.7 k (229 of 293 meshes) |

Unchanged (no figure mesh off the view, or no figures drawn): `overview-field` 834 / 2.692 M, `overview-field-1x` 197 / 385.1 k, `overview-field-10x` 834 / 2.695 M, `overview-plan` 834 / 2.671 M, `close-sokolnitz-1x` 181 / 385.7 k, `staff-paper` 148 / 238.7 k, `pratzen-low-1x` 162 / 374.9 k, `paper-north-up` 156 / 240.9 k, `paper-close` 103 / 203.5 k, `paper-drawer` 110 / 226.5 k, `ph8-overview-study` 811 / 2.653 M, `ph8-overview-watch` 811 / 2.650 M, `ph8-overview-watch-1x` 183 / 383.8 k, `ph8-overview-watch-10x` 811 / 2.653 M, `eye-zuran-1x` 129 / 374.2 k, `plans-overview` 859 / 2.677 M, `paper-laptop` 156 / 240.9 k, `narrow-1024` 834 / 2.698 M, `phone:overview-plan` 545 / 1.640 M, `phone:ph8-overview-watch` 527 / 1.631 M.

Calls are draw calls, triangles as three counts them; the frame is drawn as when the eye moves (the ground's depth for the overlays drawn
again: 2 calls, 147,088 triangles in every landscape view; with the eye still it is reused, the same in both builds). In every view the frame
8D draws without culling is the prerequisite's frame exactly (the same calls and triangles in every pass), and every frame reconciles with
`renderer.info`.

- **The 10% target: met.** In the low Pratzen view (`pratzen-low`, 4x, 1600 x 900) the whole frame falls from 2,628,383 triangles and 760
  calls to 2,211,039 and 543: **15.9%** fewer triangles over every pass with the depth drawn (the world pass 23.1% fewer, 1,455,318 to
  1,118,920; the shadow pass 7.9%, 1,025,966 to 945,020, since the blocks out of the sun's box no longer cast). `check:visual` holds it in
  that case at 10% (`thresholds.js` `CENSUS.LOW`).
- **Step 6's estimate, re-evaluated.** Step 6 counted, in the world pass, the figure meshes none of whose instances is in the eye's frustum
  (`docs/STEP6_SPEC.md` §3.2: 339 k triangles in the low Pratzen view, 293 k close on Sokolnitz). Read again on the prerequisite's build, the
  estimate is 339,022 and 292,986. What culling removes from the world pass is 336,398 (99% of it) and 204,280 (70%): a mesh is culled by
  one sphere over all its instances, and close on Sokolnitz the spheres of long lines and columns reach into the narrow view though none of
  their men stands in it. The estimate is the most a per-mesh test could take; the conservative bound takes less, and nothing it should not.
  Across the nine views with figures off the screen culling takes 70-100% of the estimate from the world pass (the least close on Sokolnitz at
  4x, 79% there at 10.33x, 85% at the eye level, 94-100% in the others), and the shadow pass adds its own where blocks leave the sun's box.
- **Where it saves nothing.** In the Overview, the plans' Overview and every 1x and paper-map view no figure mesh is wholly off the view (or
  no figure is drawn): the frames are unchanged, 2,650,323-2,698,179 triangles and 811-859 calls in the Overview views.
- **Section 8.3's budgets.** Desktop (the 4x frame, at most 2.8 million triangles and 900 calls): every desktop view within it before and after,
  the largest 2,698,179 triangles (`narrow-1024`) and 859 calls (`plans-overview`), both Overview views that culling does not change: 96% of
  the triangle budget is used where 8E's richer kit will cost most and culling saves nothing (section 16.12). Phone (`lowTier`, at most 1.62
  million triangles in the heavy views, calls at most 10% above today's): the low Pratzen view falls from 1,605,135 to 1,178,497 (26.6%);
  the Overview with the plans and phase 8's Overview are unchanged at 1,640,415 and 1,631,301 with the depth drawn, 1.3% and 0.7% over the
  budget, and 1,493,327 and 1,484,213 with the eye still. They were over it before 8D (8A's ribbons and 8B's depth pass came after P5's 1.47
  million), so section 8.3's alternative applies, a phone run of the route holding the heavy segments' long frames at or under 5%: pending
  (section 16.12). No view's calls rise.
- **The cases `census-8d.js` does not open** (the nine fresh pages reached by real clicks: the first screens, the opening's steps and its end,
  the right-button orbit) were measured through the harness's own per-case census on 8D's build here (`harness.js --only`, without `--test`):
  every frame reconciled, the frame with culling the frame without it (0 pixels), all within the desktop budget (at most 745 calls and
  2,624,777 triangles as drawn; 753 and 2,668,851 unculled); culling saves up to 17.3% of the frame there (the opening's third step, 2,631,069
  to 2,176,947 triangles). `check:visual` on CI holds all 39 cases (section 16.13).

**Culling's own cost on the CPU** (`tools/stage8/cost-8d.js`, `docs/stage8-evidence/8d/cost.json`; this container's CPU, shared with the runs
beside it, software WebGL; each frame drawn as the app's loop draws one, the blocks posed and seated, then the frame):

| view | tests a frame (both passes) | culled | bounds refreshed: still, panning | while the clock plays (as at 4x) | a factor change (4x to 10.33x) | a test |
|---|---|---|---|---|---|---|
| `pratzen-low` | 559 | 217 | 0, 0 | 293 meshes, 6,317 instances: 0.5 / 1.0 / 4.8 ms | 293: 0.5 ms | 0.136 us |
| `close-sokolnitz` | 551 | 106 | 0, 0 | 250 meshes, 5,287 instances: 0.4 / 0.9 / 4.4 ms | 289: 0.8 ms | 0.105 us |
| `overview-field` | 579 | 0 | 0, 0 | 293 meshes, 6,317 instances: 0.5 / 0.7 / 1.2 ms | 303: 1.2 ms | 0.102 us |

(the refreshes' time a frame as median / p95 / max over 24 frames.) So the tests cost about 0.06-0.08 ms a frame; a still or panning view
refreshes nothing; while the clock plays every block drawn is re-seated at each step (the app's own `layoutFigs`, as before 8D) and its
bounds refreshed with it, about half a millisecond a frame here; a factor change refreshes every block once. The tests themselves were timed
apart (67,600 each view, the bounds current). The heap after a forced collection, over 30 frames culled and 30 not: +71 and +32 KB, +33 and
+13 KB, -984 and +27 KB in the three views: no growth that culling keeps (the refresh reuses one scratch array and the test one sphere). How
long a whole frame takes to return here (`renderFrame`, the median of 20 frames in interleaved blocks; under software WebGL it includes
waiting on the GPU process's drawing): culled 4.76 s and not 8.47 s in the low Pratzen view, 5.16 and 5.05 close on Sokolnitz, 4.68 and 4.51 in
the Overview, on a machine whose load moved frames by seconds (a p95 of 36.6 s): these say nothing of a GPU's frame time.

**What the hooks cost:** no draw call and no triangle (8D's frame without culling is the prerequisite's exactly, every pass, every view);
one float a vertex on the kit's 30 geometries (13,701 vertices: 54,804 bytes, on the GPU and in the page); 255 depth materials of the kit's
own, one a kit mesh; two shader programs more (32 where 8C's frame has 30), compiled once (the hook built into the 226 materials and 226 depth
materials these three views drew, all sharing the two programs); in the vertex shader one branch on a uniform, not taken at amplitude 0. A GPU's cost of that
branch is not measured (software WebGL).

**The devices: pending** (section 16.12). Software WebGL's timings decide nothing about a GPU, so no frame time is claimed here. The device
route's two bracketed routes (`perf-run.html?route=cull` and `?route=fx`, decision 250's corrected rule) were run end to end in this container
to show that they run and report (`tools/step6/perf-local.js --cull --quick` and `--fx --quick`, `docs/stage8-evidence/8d/route-cull-local.json`
and `route-fx-local.json`): both ran end to end and reported, with no console warning or error, but under software WebGL
a frame here took from a quarter of a second to several (the culling route's warm-up: 2 frames, 3.7 s each, 586 calls and 2,256,543 triangles
in its own low Pratzen view; the effects route's: 1 frame), so the quick routes' three-second blocks held no frame, and the rule, every
comparison missing (12 of 12 in each view), decided nothing ("not shown (a block missing or hidden: run again)"), as it must. Their verdicts
are the devices'.

### 16.12 What remains, the follow-ups commissioned, and whether the foundation is ready for 8E

- **Device acceptance: pending.** No owner hardware was available to this session, and fewer triangles do not prove faster frames. Prepared for
  the owner: the build before 8D (`main`'s, `git show 8eb3ef4:austerlitz-command-map.html`, md5 `04547a28...`; its WebGL frame is the
  prerequisite build's) and after (this PR's), and the device route of `docs/STEP6_SPEC.md` §2 (`tools/step6/perf-run.html`, `?src=` naming
  the build) with a culling route of its own (`?route=cull`: in the low Pratzen view, culling on and off in blocks A and B in the order A B A B
  A B A, twice, then after a rest B A B A B A B, twice, judged by the corrected rule of decision 250: each inner block against both its
  neighbours, culling faster only if every comparison in both orders and rounds says so; on a desktop also at 10.33x; the phone's warm-up 45 s
  and rest 3 minutes, as the phone route's). The same route on the build before and after gives the before-and-after the plan asks for
  (section 8.5); the culling route separates culling's effect from anything else in one build. An integrated-GPU run is not required by
  section 8.3 for 8D, which lowers the frame's triangles and calls; it is required before 8E's richer kit (section 8.3), and no integrated-GPU
  laptop was available here either. The bracketed effects-off diagnostic (decision 250 (b), corrected) was not performed here: it is a device
  measurement, and software WebGL's timings decide nothing (the phone route, `?route=phone`, already carries it).
- **Decision 258 (b), commissioned, not built:** more placements close to a counter's anchor while the view moves, in a PR of its own, measured
  as section 15.6 measured 8C (the formations followed, the jumps and pops) and judged against decision 257's visibility baselines, which it
  must not fall below; the two-pass return rule kept until a measured comparison justifies a change.
- **Decision 255 (d), commissioned as a prototype, not built:** a hierarchy for far battle information by another means than size (a lighter
  plate or ink for far formation names, still at AA, decision 16's floor kept), prototyped and measured first; the low views' wall of
  formation names (Part A's `horizon-east`) is its test, and is not resolved.
- **For 8E, ready:** the bounds hold any pose the hook can draw (the envelope); a block moving, re-seating, changing its battalions or its
  battery's state is re-bounded at its next test; the shadow pass draws the pose the eye sees (the depth hook); the census and section 8.3's
  desktop budget are checked in every case, so a richer kit that exceeds them fails `check:visual`, and the 10% target in the low view fails
  if culling stops paying. **Not ready, and 8E's to decide:** the gait's rule (what drives phase and amplitude per mesh; section 4.3's clock-
  locked gait) and its evidence step; the hook carries one phase per mesh, so every man of a mesh steps together unless 8E gives each instance
  a phase of its own (an instanced attribute: a change of the hook, stated); the level of detail by a man's size on screen (section 8.4) that
  8E's kit needs to stay inside the budgets is not built; and the device runs (the phone's budget of 1.62 million triangles is exceeded in its two
  Overview views with the depth pass drawn, before 8D as after it, section 16.11, so the phone route is the gate). The foundation is ready to build 8E on;
  8E is not ready to merge without those runs.
- **Not measured:** a GPU's frame time (software WebGL here); Safari (no WebKit here); memory on a device.

### 16.13 What was run

Here (Chromium 141.0.7390.37, Playwright 1.56's headless shell, software WebGL; the container's CPU shared with the runs beside it) and on CI
(GitHub's `ubuntu-latest` runners, the same browser), on the commits named:

- **Here, on 8D's committed build** (md5 `ae7f16b8...`): `npm run build` writes it byte for byte; `npm test` (all nine suites and the height guard); `check:data` (131 of 131
  declarations identical) and `check:chronology` (0 errors); `check:baseline`; the self-test, 284 of 284 and no console message, on one page opened as the harness opens its self-test page
  (`tools/stage8/selftest-report.js`; the manifest written from its report by `check-report.js --write-manifest`). The harness's own
  `check:selftest` run here passed the self-test (284 of 284) and stopped after it in the live block of the timeline's tips, which could not
  focus an event marker within Playwright's 30 seconds while the container ran five browsers on its four cores; the same steps, after the
  self-test's 8D block, kept a focusable marker throughout in a page of their own, and on CI the block passes (below). The evidence of section 16.8-16.12
  as the evidence index lists it (`docs/stage8-evidence/README.md`), each JSON naming its build.
- **Here, not run in full:** `check:visual` (its 39 cases, the census and the culling block in each, and its live blocks take about ten hours
  under this container's software WebGL beside the other runs; it was run on CI) and `check:contrast` (on CI).
- **On CI:** on `3c9e2eb` (decision 257 (b)): the push run 40256828983 (the checks job and `check:contrast` pass; `check:selftest` fails the
  phone run's visibility, the driver's race of section 16.3, fixed by `067bb83`), the pull request's run 40256875257 (every job passes) and
  the two dispatched runs 40256833873 and 40256841580 (the checks job, `check:contrast` and `check:selftest` pass in each; `check:visual`, the
  two full runs of decision 256: 40256841580 failed exactly the five inherited shares; 40256833873's job ended at 66 minutes without a
  report). On `067bb83`: the push run 40260005010, the pull request's 40260008599 and the dispatched 40262942179 (the checks job,
  `check:contrast` and `check:selftest` pass in each; the dispatched run's `check:visual`, decision 256's second run, fails exactly the five
  inherited shares); a second dispatched run, 40267502634, was cancelled once the two had reported. On `e008825` (decision 256): the push
  run 40274915627 (the checks job, `check:contrast` and `check:selftest` pass). On `4cb72b1` (8D): the push run 40276598532, the pull request's 40276603864 and the dispatched 40276605486: the checks job, `check:contrast` and `check:selftest` pass in each (the self-test 284 of 284 with no console message; every live block, the timeline's tips among them; the motion block's 24 runs each identical in its counts and its formations' visibility to the prerequisite's run on `067bb83`, 40260005010); `check:selftest` took 29, 30 and 21 minutes on the three runners (16, 31 and 26 on `e008825` and `067bb83`'s push run: the runners differ more than the block's cost). The dispatched run's `check:visual` passes every check: the 39 cases, each
case's census reconciled and its frame with culling the frame without it (0 pixels in every case), the culling block's 15 runs exactly as
here (485 frames judged, 243 compared, 0 pixels differing, 48,624 meshes culled, 35,825 mesh-frames drawn in the shadow pass only, 1,699
crossings), the four re-measured cases' shares at decision 256's baselines (0.6256 / 0.5069, 0.5461 / 0.5069, 0.5321 / 0.6291, 0.6879), the
self-test 284 of 284 and no console message; `check-report.js` judges its report again here and passes it. It took 136 minutes, against 138
for decision 256's second run on `067bb83` (the runners differ more than the census and the culling block cost; the block's 15 runs took 38
minutes of it); the job's limit is 240. On `51acc3c` and `62c141e` (the workflow's comment and `cost-8d.js`, the build unchanged): the push
runs 40284841784 and 40290083254 and the pull request's 40284845988 and 40290087975 pass every job.

## 17. Implementation PR 8E as built (27 October 2026)

**Status.** Built on `claude/optimistic-thompson-4e5hsn` (PR #70, base `main` at `2f41819`, PR #69's merge: implementation PR 8D, merged
by the owner on 26 October 2026); merged into `main` by the owner on 28 October 2026 (`94d6e46`; the audit of it found two faults, the gait eased
at a paused clock and the feet's contact judged field-wide, corrected first in 8F, sections 18.1 and 18.2). It applies decisions 242 (a), 243 (a), 244 (a) and 245 (a) as the owner settled them
(section 0.3, with the points of section 0.3.1, items 7 and 8), after the two findings of the audit of 8D, each corrected in a commit of its own
(sections 17.1 and 17.2), and the artillery's data task in a commit of its own before anything is drawn from it (section 17.3). In order:
`2af8ed9`, `1c6b54e`, `d95bfe0` (the data task), `62f5cd2` (the troops and their checks), `a99eb7b` (what the evidence runs found in
the checks and the measuring tools, section 17.12), then the records. Nothing of decision 258 (b)'s
counter-placement work or of decision 255 (d)'s far-label prototype is in it (both commissioned separately, section 16.12). **Device acceptance
is pending**: no owner hardware was available to this session (section 17.13).

**In numbers** (sections 17.4 to 17.15): per figure the rich kit at most 1.21 times 8D's (a gunner; a man on foot 1.17 to 1.18; a rider and
his horse the same count, reshaped), the simple level 8D's kit in all 39 classes; the frame's triangles at most +8.0% (close on Sokolnitz at
4x; the low Pratzen view +4.7%, the Overviews +0.1% to +0.4%, 1x and the paper map as 8D's), every desktop view within section 8.3's 2.8
million triangles and 900 calls, so its integrated-GPU condition is not met; the phone's two Overview views over its 1.62 million by 1.4%
and 1.1%, as before 8D (1.3% and 0.7%): the phone route's run required before merging, pending; the gait no draw call and no triangle (29
views of 29), its CPU 0.112 to 0.185 ms a frame (the budget 0.2), the level of detail 0.040 to 0.056 ms more; nothing allocated under 8E's
functions while the eye moves; the planted feet within 0.020 units of their rest contact in 99 poses of 100 at 4x (0.047 at 10.33x); the
self-test 295 of 295; every rule its checks hold made to fail by a mutation (the self-test's 8D and 8E blocks on 26 copies, `css-test.js`'s blocks on 25), three of them after the checks they first passed were strengthened; `check:visual` on CI passing on `62f5cd2` and `a99eb7b` (198 and 169 minutes, against 8D's 136), and every other job on every 8E commit; on the final build `27a3d2f`, on a slower runner, `check:visual` reached its job's limit of 240 minutes with its 39 cases passing and about twelve minutes of its work left, so the limit is now 350 minutes and the run is made again (section 17.15).

### 17.1 Prerequisite 1: culling's animation allowance follows the geometry drawn and the animation's definition (the audit of 8D; commit `2af8ed9`)

- **Found** by the audit of 8D: `cullBlock` read a mesh's animation envelope once, when it first made the mesh's bounds, so a mesh given another
  geometry (or a geometry whose positions or parts changed, or a changed animation table) kept its first envelope: an animated vertex could
  leave the bounds (the audit's leg box: envelope 0.022 cached against 0.283 needed; a vertex 0.043 outside). Reproduced by
  `tools/stage8/envelope-8e.js` on 8D as merged (`--revs 2f41819,2af8ed9`, `docs/stage8-evidence/8e/envelope.json`).
- **The correction.** `animEnv` caches per part attribute, keyed by the position and part attributes (objects and versions) and `ANIM.ver`;
  `animDefine` moves `ANIM.ver` and the kit programs' cache key (`animKey`); `cullGeo` is keyed by the position attribute and its version; each
  mesh's bounds record what they were made from, and `cullStale` refreshes them whenever any of it differs (one comparison per field on an
  unchanged frame). Shared geometries share their envelope and bounds, never a mesh's state.
- **Held** by the self-test's culling check (a), at rest and animated (every animated vertex of the first, middle and last instance inside the
  bounds by the test's own envelope over 64 phases), a new check (h) (meshes switched between geometries with different envelopes and back, an
  in-place part rewrite, a changed definition, placements at the eye's frustum and the sun's box where only the swing reaches in: drawn in that
  pass, the frame and the depth map identical to culling off), `runtime-test.js`'s dry run on real three r128 geometries and `cullmotion.js`'s
  own envelope; each made to fail by `mutate-8e.js` on copies with 8D's rule put back (`docs/stage8-evidence/8e/mutate-pre1.json`). The
  manifest 284 to 285. Since 8E itself the envelope is computed over every pose the hook allows (`animPoses`: the slopes, the trot, the knee
  and the wheels at their extremes, section 17.11).

### 17.2 Prerequisite 2: culling's static comparison requires zero differences, located (the audit of 8D; commit `1c6b54e`)

- **Found** by the audit of 8D: `thresholds.js` passed a case when the culled frame differed from the unculled in no more pixels than two renders
  of the culled frame differed, wherever those lay: an unrelated change could be excused by an equal count of repeat noise elsewhere.
- **The correction.** `censusCheck` fails any pixel where the culled frame differs from the unculled (`EQUIV_PX` 0), and fails as inconclusive any
  difference between two renders of one state (a deterministic same-state comparison on the pinned browser must repeat exactly); nothing is
  subtracted. `measure.js`'s `cullEquiv` locates both sets: where culling differs and the two renders agree (`outside`), where both differ
  (`shared`, and where culling's difference exceeds the repeat's, `worse`), and the first pixels of each by coordinates and channels.
- **Shown** by `tools/stage8/equiv-8e.js` (`docs/stage8-evidence/8e/equiv.json`): on records, an unrelated difference with an equal repeat count
  elsewhere passes the old rule and fails the new; on the build in the low Pratzen case, as built 0 pixels and 0 between renders (both rules
  pass); with one kit mesh in view wrongly culled (1,700 pixels) and the second render given 1,700 changed pixels elsewhere, the old rule passes
  and the new fails. Harness and measurement code only: the build unchanged.

### 17.3 The data task: the artillery's claims, registered, graded and scoped (decision 243 (a); commit `d95bfe0`)

The leads of Part A (`leads.md`, topic 1, read by a machine reader on 23 October) were read again on the printed page images (archive.org's
page images and the UIBK scan, each opened and read on the image; the register `docs/stage8-evidence/8e/artillery-readings.md`: 15 items, each
passage as printed, its grade on the appearance table's scale, its scope, and what the drawing takes from it) and recorded in `appearance.js`
before anything was drawn from them: `APPEARANCE_SOURCES` changed (three works added: Gassendi's *Aide-mémoire* t. II, 1809; Alombert and
Colin's *La campagne de 1805 en Allemagne* t. I, 1902; Nilus' *История материальной части артиллерии* т. 2, 1904) and `ORDNANCE` added, every
claim with its source, locator, grade, label, quotation and scope. `check:data`'s reference moved to that commit's build
(`archive/stage8e-f3c3f3af.html`): 130 of 132 data declarations identical to the old reference, those two changed or added; nothing else of
the data changed in 8E.

Where each source applies (decision 243 (a): "Specify where each source applies"):

| claim | source (grade) | scope | drawn |
|---|---|---|---|
| the matériel | Alombert and Colin t. I, p. 228 (B) | the Grande Armée's field artillery at the campaign's opening; which calibres stood where on 2 December not read | a generic Gribeauval field piece, no calibre or model claimed |
| the wheels | Gassendi t. I, p. 110 (B) | the Gribeauval field carriages and limbers in his tables; the 1805 carriage kept (t. I, p. 11) | the gun's and the limber's at 1.462 and 1.137 m, at the figures' scale; 12 and 10 spokes (two to a felloe: an inference) |
| the coffret | Gassendi t. II, pp. 869-870; t. I, p. 174 (B) | the field piece in his drill (1809) | between the trail's cheeks on the move, on the limber in action |
| the limber behind the piece | Gassendi t. II, pp. 870, 873 (B) | his drill; the regulation itself not read | each deployed piece's limber, team and driver behind it; how far it turned not read: the facing a design value; the distance compressed |
| limbered on the move | Gassendi t. II, p. 872 (B), with his caveat that it is not regulated | French foot artillery | the battery on the move limbered, as before |
| the team | Gassendi t. I, p. 440 (B) | French ordinary practice (1809) | four horses a drawn gun (a symbol: a drawn gun stands for two pieces) |
| the harness | Gassendi t. II, p. 829 (B) | the French artillery harness | the driver on the near horse (that the porteur was the near horse: an inference) |
| the drivers | Salligny's letter of 25 October 1805, Alombert and Colin t. IV, pp. 183-184 (A as a document; label inference) | **IV Corps' divisions' artillery teams, from 25 October** | one driver a team of `heightguns` alone (below) |
| limbering's duration | none read (generic) | none | the switch at once, as before |
| the Guard's teams | Napoleon to Mortier, 29 August 1805 (A) | the Guard's artillery as ordered in August | nothing (no Guard battery drawn as figures); its drivers generic |
| Austria's limber box | Teuber, p. 185 (B) | the Liechtenstein matériel to 1809 | nothing (no Austrian battery drawn as figures); drivers generic |
| Russia's limbers | Nilus, p. 21 (B) | the Arakcheev matériel | nothing (no Russian battery drawn as figures); drivers generic |

**The drivers' boundary, stated** (decision 243 (a): "Do not generalise IV Corps' October authorisation for driver numbers into a
demonstrated rule for the Guard, Austrian or Russian artillery"). One battery is drawn with drivers: `heightguns`, "French guns on the
heights", whose data names it IV Corps' and the Guard's artillery ("Corps and Guard artillery") and whose figures are drawn as IV Corps' foot
artillery (`COMPOSITION.heightguns`, its dominant class; the Guard's 24 pieces Thiébault names are listed with it, their share of the drawn guns
not sourced, and are not drawn as figures). Salligny's letter addresses IV Corps' divisions' generals about their artillery teams; that the
battery's teams were among them is not read, nor that the reduction still held on 2 December: the drawing is an inference on both counts, so
labelled in `ORDNANCE` and in the sources sheet ("Guns of the Guard listed with them are outside the order and are not drawn as figures"). No
other battery is drawn with drivers (`artDrivers`: a claim whose corps is the battery's ancestor; none reaches the Santon's guns, which are drawn
as pieces alone as before). The independent review of 8E's code (section 17.12) asked for this boundary to be stated; **it is put to the owner**
(section 17.16): drawing no driver anywhere is the alternative if the inference is not wanted.

### 17.4 The kit (decision 242 (a); `app.js` `kitGeo`, `kitFootFixedR`, `kitFootCoatR`, `kitRiderFixedR`, `kitRiderCoatR`, `kitHorseR`, `kitWrap`)

- **Two levels for every class.** The simple level is 6C's kit, unchanged; the rich level is the prototype's direction (Part A's `f-kit`,
  section 4.2) built from each class's existing claims: the man's torso wider at the shoulders with the coat's skirts behind, tapered arms with
  hands, the legs in two segments (thigh and shin, so the knee bends in the gait) with feet in the legwear's colour (section 4.2's rule), a
  rounder head, the class's headgear as 6C draws it, the pack, musket and bayonet as before; the rider seated with thighs along the horse and
  shins down, the coat and skirts over the saddle, the arms toward the reins; the horse a barrel body, the neck raised, the head angled down,
  each leg one taper. Every colour is the class's own as 6C resolves it (the coat by instance, the legwear, the headgear, the cuirass, the
  horse), the same in both levels; the figure's height to its hat's top is the simple kit's, so decision 106's ratio is unchanged.
- **Decision 245 (a): no facings** (decision 104 kept). The saddle-cloths' claims carry no colour class (section 4.6), so the saddle stays the
  kit's leather in both levels: recorded for the owner, not drawn.
- **Each mesh's own geometry.** Every kit mesh draws a geometry of its own at each level (`kitWrap`: its class's shared position, normal,
  colour and part attributes, and its instances' own phase offsets `aPh` and slopes `aSl`), so no formation's state is ever written into a
  shared geometry (the self-test's check (d): 265 kit meshes, 530 geometries of their own over 70 shared ones; the shared ones unchanged
  through the day).
- **The cost, per figure, by class** (`tools/stage8/kit-census-8e.js`, `docs/stage8-evidence/8e/kit-census.json`; section 8.2's limit 1.3
  times the 8D kit per man):

| class | 8D kit | 8E simple | 8E rich | rich / 8D |
|---|---|---|---|---|
| a gunner, `fr_foot_art` | 168 | 168 | 204 | 1.214 |
| a man on foot, `at_grenz` | 204 | 204 | 240 | 1.176 |
| a man on foot, `at_jager` | 204 | 204 | 240 | 1.176 |
| a man on foot, `at_line` | 204 | 204 | 240 | 1.176 |
| a man on foot, `fr_gren_light` | 204 | 204 | 240 | 1.176 |
| a man on foot, `fr_gren_line` | 204 | 204 | 240 | 1.176 |
| a man on foot, `fr_guard_chass` | 208 | 208 | 244 | 1.173 |
| a man on foot, `fr_guard_gren` | 208 | 208 | 244 | 1.173 |
| a man on foot, `fr_light` | 216 | 216 | 252 | 1.167 |
| a man on foot, `fr_line` | 200 | 200 | 236 | 1.18 |
| a man on foot, `it_guard` | 204 | 204 | 240 | 1.176 |
| a man on foot, `ru_gren` | 204 | 204 | 240 | 1.176 |
| a man on foot, `ru_guard_inf` | 216 | 216 | 252 | 1.167 |
| a man on foot, `ru_guard_jager` | 216 | 216 | 252 | 1.167 |
| a man on foot, `ru_jager` | 204 | 204 | 240 | 1.176 |
| a man on foot, `ru_musk` | 216 | 216 | 252 | 1.167 |
| a rider and his horse, `at_chevauleger` | 328 | 328 | 328 | 1 |
| a rider and his horse, `at_cuirassier` | 340 | 340 | 340 | 1 |
| a rider and his horse, `at_hussar_hh` | 300 | 300 | 300 | 1 |
| a rider and his horse, `at_hussar_szekler` | 300 | 300 | 300 | 1 |
| a rider and his horse, `fr_carabinier` | 288 | 288 | 288 | 1 |
| a rider and his horse, `fr_cuirassier` | 352 | 352 | 352 | 1 |
| a rider and his horse, `fr_dragoon` | 340 | 340 | 340 | 1 |
| a rider and his horse, `fr_guard_chasscav` | 288 | 288 | 288 | 1 |
| a rider and his horse, `fr_guard_grencav` | 292 | 292 | 292 | 1 |
| a rider and his horse, `fr_hussar2` | 300 | 300 | 300 | 1 |
| a rider and his horse, `fr_hussar4` | 300 | 300 | 300 | 1 |
| a rider and his horse, `fr_hussar5` | 300 | 300 | 300 | 1 |
| a rider and his horse, `fr_mameluke` | 327 | 327 | 327 | 1 |
| a rider and his horse, `fr_staff` | 284 | 284 | 284 | 1 |
| a rider and his horse, generic (no class) | 288 | 288 | 288 | 1 |
| a rider and his horse, `ru_chevalier` | 328 | 328 | 328 | 1 |
| a rider and his horse, `ru_cossack` | 292 | 292 | 292 | 1 |
| a rider and his horse, `ru_dragoon` | 328 | 328 | 328 | 1 |
| a rider and his horse, `ru_guard_horse` | 328 | 328 | 328 | 1 |
| a rider and his horse, `ru_guard_hussar` | 300 | 300 | 300 | 1 |
| a rider and his horse, `ru_hussar_elisavetgrad` | 300 | 300 | 300 | 1 |
| a rider and his horse, `ru_staff` | 284 | 284 | 284 | 1 |
| a rider and his horse, `ru_uhlan` | 300 | 300 | 300 | 1 |

Every class within 1.3 times: the most, a gunner, 1.21 (168 to 204 triangles); a man on foot 1.17 to 1.18 (36 triangles more, the rich man
of the first item above). A rider and his horse keep the same count at both levels in every class:
the rich horse is 120 triangles against the simple's 108 (a team's horse in the self-test's check (a)) and the rich rider 12 fewer than the
simple one, so their triangles move rather than grow. The simple level is 8D's kit in every one of the
39 classes.

### 17.5 The level of detail through the camera (decision 242 (a), section 8.4; `KLOD`, `kitLodFrame`, `kitLod`, `kitLodSet`)

- **The rule.** A block draws the rich kit while it stands in the eye's view and a man of it stands at least 17.6 CSS px high at the block's
  nearest point (16 px and a tenth), and the simple kit once he is under 14.5 px (16 px less a tenth) or the block leaves the view: a view at
  rest or moving slowly near the threshold never toggles. Measured through the camera and the viewport, per frame: the box of the block's
  seated men (their x and z extent and the heights they stand at, kept by `layoutFigs`, widened by 0.6 units and a man's height) through the
  block's position, tilt, turn and scale, tested against the camera's frustum; its nearest corner's depth along the view for a man's height on
  screen (the camera's own projection, the view offset counted), or where larger a man's height projected exactly at a corner of its base (the
  perspective stretches him toward the view's edges). A block out of view keeps the simple kit, so the shadow pass, which draws what the sun's
  box holds wherever the eye looks, does not pay for detail nobody sees.
- **Stable.** All of a block's kit meshes switch together, each to the other geometry of its own pair, the knee's uniform with them (the simple
  kit has no knee); the culling bounds follow the geometry (`cullStale`, section 17.1); nothing is allocated (`css-test.js` in the source; none sampled while
  the eye moves, section 17.13). Along a dolly of
  31 settled steps toward Saint-Hilaire's division and back (the self-test's check (c)): rich at 120 units (the block's nearest point 20.3 px, its largest man 18.2 px),
  simple at 170 units (the nearest point 14.2 px, the largest man 12.7 px), one switch each way and none while the eye held for four frames at each step, and between 14.5 and 17.6 px the level the way
  the eye came (at 140 units, the nearest point 17.3 px: simple coming in, rich going out); every block with a man of
  17.6 px or more in view rich and none with every man under 8.7 px, at the vantages, the low Pratzen view and close on Sokolnitz.

### 17.6 The artillery drawn (decision 243 (a); `kitArtR`, `kitWheel`, `kitDisc`, `kitGunParts`, `kitLimberParts`, `artGeo`, `ART_AT`, `artDrivers`)

- **The piece**: a generic Gribeauval field piece on a bracket trail of two cheeks (`ORDNANCE.fr.system`: no calibre or model), its wheels and
  its limber's at Gassendi's heights at the figures' scale (`KIT.art`: the drawn man's head top standing for a stature of 1.60 m, a design value
  inside the statures read; 0.8844 units a metre: the wheels 1.293 and 1.006 units, the self-test's check (b)), the gun's of twelve spokes and the
  limber's of ten, every part of a wheel symmetric under a turn of one spoke's interval; the coffret between the cheeks on the move and on the
  limber in action; the limbered piece turned onto its limber and pitched about its axle so that its trail's end lies on the pintle wherever
  they stand (`ud.afterSeat`, after every seating, the wheels kept on the ground). One carriage colour for every army (`KIT.gear`, decisions
  109, 243 (a)); the switch between the deployed and the limbered battery at once (`ORDNANCE.fr.limbering`: no duration read).
- **The battery** (`heightguns`, IV Corps' and the Guard's guns on the heights, six drawn guns): deployed, each piece facing the front with its
  five gunners at posts about it (two by the muzzle, two by the wheels, one by the trail: the prototype's, a design value, where 6C sampled them
  behind the piece; no drill manual's posts read), and behind it its limber with the coffret on it, its team of four facing the rear and its
  driver (section 17.3's boundary); limbered, the team ahead, the limber, the piece behind with the coffret between its cheeks, the driver on the
  near wheel horse. Each horse keeps one index in both groups, so its beat, and its driver's, survive the switch. The gunners are drawn with the
  deployed battery only, as before 8E: Gassendi has them march beside their piece (register item 8), which would change the crew's
  representation the brief keeps: **recorded for the owner** (section 17.16).
- **The Santon's battery** (attached to the 17e Légère): its pieces alone, deployed, as before 8E (the richer piece at the two levels; no limber,
  team or driver: none was drawn there before, and its data names guns only).
- **Extra equipment** reported apart from a man's kit (section 8.2): per drawn gun (triangles, `kit-census.json`): deployed, the vehicles 156 on 8D's build (barrel, two wheels, trail) against 256 simple and 940 rich
  (the piece on its bracket trail with its spoked wheels, the limber with its wheels and the coffret on it), the team behind the piece 432 and 480
  (none before), its driver 168 and 156 (none before), the gunners 840 as before and 1,020 rich; limbered, the vehicles 268 before against 256
  and 940, the team 432 before against 432 and 480, the driver 168 and 156 (none before). Six drawn guns on both builds.

### 17.7 The gait (decision 244 (a); `GAIT`, `clockRate`, `gaitDist`, `gaitLeg`, `gaitRoll`, `gaitStep`, `gaitFastest`, `ANIM`, `animGLSL`, `animAt`)

**What it is.** A visual convention for symbols under compressed time: the march is seen as a march; the figures (45-70 times life size) still
slide over the ground by the ratio of their scale to the clock's, and no footstep is matched to it. So the legend says, wherever figures are
drawn ("marching figures step: a visual convention for symbols under compressed time, not their footsteps"), and the sources sheet's "How the
troops move". Every number below is a design value.

- **The phase**: the distance the formation's modelled track has covered at the clock (every leg reached in full, the current one to the
  clock's fraction, in map units) over a stride: 6.6 map units a cycle of two steps for men, 16 for the cavalry's and the officers' horses, 12
  for the teams (section 4.3's). A paused clock holds the pose; a halted formation does not step; a minute shows one pose however it was reached
  (the self-test's check (e) at four clocks, each reached from three others: every uniform identical; `runtime-test.js` the same in its dry
  run). A formed body steps together; each horse on its own beat (`aPh`, fixed per horse from its index), a rider and a driver on his horse's.
- **The amplitude**: none under reduced motion (at once: S-6, "what moves stops"), on a halted formation, or on a leg under 1 km/h (a drift
  between anchors, not a march: 450 of the self-test's 780 judgments); else full while the formation's fastest-cycling part drawn now (its men,
  else its horses; a limbered battery's teams, its gunners being drawn with the deployed guns: `gaitFastest`) makes at most 3.2 cycles a second
  on screen at the clock's present rate (Play's, slowed in a dwell's ease; none paused or in the dwell's hold), none from 4.8, in proportion
  between: a formation's parts fade together. Eased by 0.22 of the way a 60th of a second (nine tenths in 0.15 s, within 10⁻³ in about half a
  second), then idle. A paused clock: the amplitude full, the pose held still (decision 244: "A paused clock must hold the pose still"). Above 8
  km/h of modelled speed the horses trot, eased the same way.
- **The wheels**: turned by the teams' distance, two spoke intervals of the gun's wheel a team's cycle, the limber's by the two wheels' sourced
  heights (they roll together, much slower than rolling without slip, as the feet slide), drawn within one spoke's interval; at most 4.8 cycles a
  second a wheel turns 9.6 intervals a second, under a third of an interval a frame at 30 frames a second, so the turn does not alias. They turn
  at their distance's angle while the amplitude is above 0 and stand at rest, angle 0 (their symmetry makes it the nearest spoke's), once it is
  0: one turn of at most half an interval as the fade ends. (A first build scaled the angle with the fade, which stepped back by a fraction of
  an interval at every interval: the review's finding 3, section 17.12.)
- **The hook** (8D's, extended): the parts are a man's thighs (1, 2), shins (13, 14), swinging arm (3) and the rest (10); a horse's legs (5-8)
  and the rest (11), its rider or driver (12); the gun's wheels (20) and the limber's (21); every other vertex rigid (0). Uniforms per mesh: the
  phase, the amplitude, the trot, the two wheels' angles and the knee (the rich kit's, written by `kitLodSet`); attributes per instance: the
  phase offset and the slopes. With the amplitude 0 the branch is not taken and the vertex is three's own (the frame with the hooks the frame
  without them, 0 pixels: the 8D block's check (e)). `gaitStep` is the one writer of the gait's uniforms (`css-test.js`), and does nothing (no
  computation, no allocation) for a block whose clock, rate, reduced motion and drawn parts are unchanged and whose gait has arrived.
- **What it does not do**: no casualty animation, firing, kneeling, falling or wind (`css-test.js`: the hook's parts are the legs, the arm, the
  root and the wheels; the standards' cloth reads no clock).

### 17.8 The feet on the ground (decision 244 (a): "Verify ... terrain contact")

- **The rule.** The hook keeps the lowest of each man's heels and toes (each horse's hoof edges) at its rest contact with the drawn ground: the
  figure rises or dips by the most any edge's posed position would cut the ground, read as the drawn ground's slopes under that instance along
  the way it faces (`aSl`: two chords of the drawn ground from where it stands, a man's ahead and behind over his soles' travel, a horse's to its
  fore and hind hooves' far edges; `layoutFigs`, two lookups a figure), clamped at 3.0 (the drawn ground's steepest under a figure is 0.96 at 4x
  and 2.5 at 10.33x). At rest nothing changes: the upright figure stands as 6C seated it (the rest pose's seating check, 0.02 units at each
  figure's origin, unchanged).
- **On the way.** A first build planted the formations whose men stood under 10 px on screen against their block's own tilt (no lookup); on the
  Allied and French headquarters' wide, curved blocks it left a planted edge up to 2.87 px off at 4x and 8.02 px at 10.33x, so every animated
  formation now takes its own chords, in view or not. Their cost is held (section 17.13) by taking them again, while the clock plays, only once
  a block has moved a tenth of a unit (a third of the reach) or turned about a degree since; with the clock still (paused, in the dwell's hold,
  scrubbed, a jump) always, and where the clock stopped with them behind, at once (the self-test: Play at half speed for 24 steps and four slow ones, 546 seatings, 189 of them of animated formations and 157 of
  those taking the slopes, 2 blocks left behind at the last step and taken again at the pause, the 59 animated meshes' slopes then exactly a
  fresh seating's at the clock).
- **Measured** (the self-test's check (h), at 4x and 10.33x, at three clocks, up to 40 instances of every animated man's and horse's mesh at four
  phases at full swing with their knee and trot, each edge posed by `animAt`, the hook's arithmetic, against the drawn ground; at 1x no figure,
  decision 34):
  - *at 4x*, 23,292 poses: the planted edge within 0.0001 units of its rest contact in half of them and within 0.020 in 99 of 100 (the
    check's tolerance 0.03 units, about 2% of a man's height and a third of a pixel at the rich kit's threshold; 102 poses beyond it, the worst
    0.087, the grenadier division's fixed parts at 09:05); 9,710 poses floating (at most 0.087) and 10,268 sinking (at most 0.070); the raised
    edge lifted over the planted one by 0.131 units at the median and 0.611 at most;
  - *at 10.33x*, 23,292 poses: half within 0.0002, 99 in 100 within 0.047 (the tolerance 0.077, the same in proportion to the relief; 75
    beyond it, the worst 0.213, the same mesh); 9,046 floating (at most 0.213) and 10,078 sinking (at most 0.185); the raised edge's lift
    0.140 at the median, 1.381 at most;
  - *at rest* the edges stand up to 0.543 units off the ground at 4x and 1.406 at 10.33x: the upright figure on a slope, as 6C seats it (the
    rest pose's seating check unchanged). The gait plants the lowest edge where the rest pose stood; it does not tilt the figure to the slope.

### 17.9 S-5: the facing, a function of the clock (`faceClock`, `enemyFacing`)

A formation that is not marching faces the nearest enemy as placed at one clock of its own: the start of the phase or of its halt (its arrival
at the anchor it stands on), whichever is later. Until 8E the facing was cached per phase at the first clock visited in it, so it depended on the
path to the clock (ten formations by more than 30 degrees; Bagration in "The wheel" by 178); now it is a function of the clock alone, and is the
facing the day showed when played through. The block still wheels to it at its arm's rate, as before. The self-test (check (g)) and the dry run:
960 facings at three clocks of each phase, each the same reached from the phase's start, its end and directly. Each formation's facing is kept for
the clock it was asked at, so nothing is computed or allocated while the clock stands.

### 17.10 The standards' still drape (section 4.5; `flagGeo`, `KIT.std.fold`)

The cloth folded in its own depth only, two and a half folds, at most 0.07 units deep (in the cloth's 2.4 by 1.4 plane before scaling), none at
the staff, still (no clock, no wind). Its width and height are as before, so every carrier, count, painting, measure and decision 106's ratio is
the 6D checks' (all pass); the cloths are drawn on both faces, as before, and culled by their own bounds, folds included: nothing hides a standard
near the eye.

### 17.11 Shadows, culling and a lost context with the new meshes

- **Shadows**: every new mesh (the rich kit, the pieces, limbers, teams and drivers) casts, through its own depth material with the same hook,
  so the shadow casts the pose drawn (the 8D block's check (f): 87 kit meshes in view at full swing move 106,222 pixels of the frame and 8,366 texels of the sun's
  depth map; with the depth materials' hook removed, 101,737 pixels, the figures alone, and no texel; back at rest none; 5,876,136 vertex
  positions over every pose the hook allows inside the envelope).
- **Culling**: every new mesh is in a block, bounded by its own instances and the envelope of every pose the hook allows (`animPoses`: the slopes
  at their clamp either way, the trot, the knee and the wheels' angles at their extremes); refreshed by the geometry's switch; a block out of view
  still casts into it (the 8D block's checks, all passing on 8E's build: in the low Pratzen view and close on Sokolnitz the world passes 352 meshes and the shadow
  passes 495, 170 of them out of the eye's view and casting, each frame with culling its frame without it, 0 pixels, two renders 0 apart; over a sweep of 379 views
  114,079 mesh tests, 85,583 culled, each with none of its instances in the eye's frustum; Saint-Hilaire's division out of the view casting into
  it: 0 pixels against culling off, 108 with the block hidden). The independent review ran 400,000 random poses through `animAt`
  against the envelope: none outside (the largest excess −6 × 10⁻⁶). The root's bound under the clamp is wide (1.70 units for a man, 1.07 for a
  horse: the rise or dip a slope of 3.0 allows), which costs culling some yield and nothing else.
- **A lost context**: a new case of `boot-check.js` (`check:contrast` runs it), `context-gait`: Saint-Hilaire's division mid-stride at 09:00 at
  4x, close, the context lost and restored: the kit's programs compiled again with the hook (210 to 291 materials, 219 to 438 depth
  materials, as three r128 recompiles them), the block still rich at full swing; the frame 112 pixels from the pose before the loss (the rest
  pose 37,615 from it) and the sun's depth map 364 texels (the rest pose 12,316): the pose drawn and cast again after the restore.

### 17.12 The checks, and each made to fail

- **The self-test** (295 checks, every one passing: 285 before 8E, ten added and two renamed, the level-of-detail check renamed
  again in `a99eb7b`): an 8E block of ten checks, self-contained (`tools/stage8/mutate-8e.js` runs it alone on copies of the build):
  (a) the kit by class at its two levels (the same class, colours and height, the triangles per figure within 1.3 times); (b) the artillery as
  `ORDNANCE` draws it (the wheels at Gassendi's heights at the figures' scale, every wheel symmetric under a spoke's turn, the coffret's two
  places, the piece on its limber's pintle, four horses a gun, drivers only where the claim's scope reaches, one carriage colour, the switch at
  once); (c) the level of detail through the camera, with its hysteresis; (d) the shared geometries untouched by any formation's state; (e) the gait a function
  of the clock (four clocks, each reached from three others), still while the clock stands (the frame too), its slopes after Play exactly a
  fresh seating's; (f) the amplitude by the rule at a paused clock and at ½x, 1x, 2x and 4x, reduced motion at once, the ease then idle; (g)
  S-5; (h) the feet on the ground; (j) the step described; (i) the drape. The 8D block's checks adapted to a gait that writes its uniforms (the
  hooks inert with every amplitude 0, the controlled deformation from the rest pose, the envelope over every pose the hook allows, the gait's own
  uniforms again after the test's).
- **`css-test.js`**: an 8E block (the values and rules of decisions 242-245 in the source, listed in `CLAUDE.md`); the 8D block's rules moved to
  8E's (the one writer of the gait's uniforms, `animDefine`'s form, the amplitude clamped). `tools/stage8/mutate-css-8e.js`: each of 17
  mutations of `app.js` fails the block, and the source passes it; `mutate-css-8d.js`, brought to the code as 8E's prerequisite left it, likewise
  for 8D's block (`docs/stage8-evidence/8e/mutate-css-8e.json`, `mutate-css-8d.json`).
- **`runtime-test.js`**: dry runs of the gait on the app's own state (four clocks from four paths each: every mesh's uniforms identical; the
  phase the track's distance by the test's arithmetic; the wheels within half a spoke's interval), the amplitude at every speed (none under
  reduced motion), S-5 (960 facings, three paths each), the sources sheet's notes (the table's values as read) and `kitLod`'s decision along a
  dolly on a block of the test's (one switch each way, none while the eye holds, simple with the eye turned away).
- **The height guard** classifies the slopes' reads of the drawn ground (`makeBlock > slopes`, presentation).
- **`boot-check.js`**: the case `context-gait` (section 17.11). The case `context-loss` failed once here while two other browser runs shared the
  container: its clock step needs 22 drawn frames to settle on 8D's build and on 8E's alike (traced by hand: the headquarters' and
  Saint-Hilaire's wheel to their facings, the same in both), and under that load fewer than 22 came within its 120 s; alone, and with one run beside it, it passes (eight cases of eight,
  section 17.15).
- **The self-test's blocks on copies with one rule broken** (`tools/stage8/mutate-8e.js`, `docs/stage8-evidence/8e/mutate-8e.json`, on 8E's
  build):

| mutation | what it breaks | block | checks failing |
|---|---|---|---|
| `none` | nothing (the build as it is) | 8d | none of 14 (the build as it is) |
| `envonce` | 8D's behaviour: the envelope read once, when the mesh's bounds are first made, and kept whatever geometry it is given | 8d | culling (8E's prerequisite, the audit of 8D) |
| `stale8d` | 8D's staleness test: the instances' version and count and the geometry's identity only (no attribute or definition compared) | 8d | culling (8E's prerequisite, the audit of 8D) |
| `envcache8d` | 8D's envelope cache: one value per part attribute, whatever its version or the animation's definition | 8d | culling (8E's prerequisite, the audit of 8D) |
| `none8e` | nothing (the build as it is) | 8e | none of 10 (the build as it is) |
| `kitratio` | the rich kit's head four times as fine (its triangles past section 8.2's 1.3 times) | 8e | the kit (decision 242 (a)) |
| `kitcolour` | the rich man's feet in the leather's colour, not the legwear's | 8e | the kit (decision 242 (a)) |
| `artwheels` | the limber's wheels the gun's size (Gassendi's two heights not kept) | 8e | the artillery (decision 243 (a), ORDNANCE) |
| `artcoffret` | no coffret on the deployed limber (ORDNANCE.fr.coffret not drawn) | 8e | the artillery (decision 243 (a), ORDNANCE) |
| `artdrivers` | IV Corps' authorisation generalised: a driver on every French team | 8e | the artillery (decision 243 (a), ORDNANCE) |
| `lodcentre` | a man's size on screen measured at the block's centre, not at its nearest point | 8e | the kit's level of detail (decisions 242 (a), 249) |
| `lodnohyst` | no hysteresis: one threshold each way | 8e | the kit's level of detail (decisions 242 (a), 249) |
| `lodsplit` | a block's first mesh left on the simple kit when the block turns rich | 8e | the kit's level of detail (decisions 242 (a), 249) |
| `shared` | the phases written into the shared geometry | 8e | the kit's shared geometries (8E) |
| `gaitwall` | the phase accumulated frame by frame (wall-clock), not the clock's | 8e | the gait (decision 244 (a)) |
| `wheelwrap` | the wheels' angle not taken within one spoke's interval | 8e | the gait (decision 244 (a)) |
| `gaitnofade` | the amplitude never faded by the speed | 8e | the gait's amplitude (decision 244 (a)) |
| `gaitcrew` | a battery's cadence its hidden crew's (every part's, not the parts drawn) | 8e | the gait's amplitude (decision 244 (a)) |
| `gaitrmease` | reduced motion eased, not at once | 8e | the gait's amplitude (decision 244 (a)) |
| `gaitparts` | a formation's horses faded apart from its men | 8e | the gait's amplitude (decision 244 (a)) |
| `gaitdrift` | no 1 km/h floor: a drift between anchors stepped | 8e | the gait's amplitude (decision 244 (a)) |
| `gaitrm` | reduced motion ignored by the gait | 8e | the gait's amplitude (decision 244 (a)) |
| `gaitnoease` | the amplitude set at once, not eased | 8e | the gait's amplitude (decision 244 (a)) |
| `slopestale` | the slopes left where Play stopped (not taken again on the pause) | 8e | the gait (decision 244 (a)) |
| `slopeevery` | the slopes taken at every seating while the clock plays (no step) | 8e | the gait (decision 244 (a)) |
| `s5` | 8D's facing: cached per phase at the first clock visited | 8e | the facing (S-5; 8E); the gait (decision 244 (a)) |
| `contact` | the drawn ground's slopes not counted in the rise or dip that plants the feet (the hook and its mirror alike) | 8e | the gait on the ground (decision 244 (a)) |
| `drape` | the cloth narrowed by its folds | 8e | the standards' drape (section 4.5; 8E) |

On the final build both blocks pass (8D's 14 checks, 8E's 10), and every copy fails the check that holds its rule; `s5` fails two (the
facing, and the gait's check: with the clock standing the frame still changes, 22 pixels at 13:50, as blocks wheel toward a facing the
path to the clock chose). `lodnohyst`, `slopestale` and `slopeevery` passed the block as it stood in
`62f5cd2` and `a99eb7b` and fail since its checks (c) and (e) were strengthened (above).

- **The independent review.** An agent given the diff, not the author's account, read `app.js`'s 8E code for correctness: the hook and its
  mirror agree branch by branch; 400,000 random poses (amplitude below 1, fractional trot and knee, slopes beyond the clamp, every wheel angle)
  inside the envelope (the largest excess −6 × 10⁻⁶); no NaN or crash path; nothing of a formation written into a shared geometry; the knee
  following the level; nothing to re-create after a lost context. Four defects, each fixed before the evidence was made: (1) the drivers'
  boundary (section 17.3), now stated in `ORDNANCE`, the register and the sources sheet, and put to the owner; (2) a battery's step faded by its
  gunners' cadence, though they are hidden while it marches (at 2x the teams would have glided unstepped): now the parts drawn
  (`gaitFastest`), a mutation of it failing (f); (3) the wheels stepping back by a fraction of an interval at every interval while the
  amplitude faded: now whole until it ends; (4) reduced motion easing the gait out over half a second: now at once (S-6), a mutation of it
  failing (f). Its robustness remarks were applied: the hook's man branch names its parts (any other vertex rigid, as `animAt` has it); the
  level of detail's box has the men's heights; nothing computed or allocated in the gait or the facing while the clock stands; the sources
  sheet's wording. Its remark on the root's wide bound stands as recorded (section 17.11).
- **What the evidence runs found in the checks and the tools, fixed in a commit of their own** (`a99eb7b`): (1) the self-test's 8E block
  passed a copy of the build whose level of detail had no hysteresis (`mutate-8e.js`'s `lodnohyst`): its dolly counted the switches and
  their places, not the band in which the level is the way the eye came. Check (c) now records each distance's level coming in and going
  out and requires, between 14.5 and 17.6 px at the block's nearest point, simple coming in and rich going out (the same both ways
  elsewhere): on the build the band is seen at 140 units (17.3 px); on the copy the check fails there, simple both ways. `css-test.js` held
  the rule in the source (now also as `mutate-css-8e.js`'s `lodhyst`) and `runtime-test.js`'s dry run by its switch points; now the page
  does too. (2) The device route's gait bracket ran no segment: it looked for its view among the held views, not the played ones; fixed,
  and run end to end here. (3) `clips-8e.js` and `cost-8e.js` played the clock with the dwell on, so a stretch begun at an event's start
  sat in the dwell's hold: the clips' clocks stood still, and part of the costs' stretch from 08:45 drew nothing moving; both now play with
  the dwell off, and the costs below are the corrected runs'. (4) Smaller: the deployed battery's still aimed before the guns reach the field;
  the kit census read no gun count from 8D's battery; one mutation named a condition as it read before a refactor. The build changed in the
  self-test's check (c) alone.
- **Then two more, in a commit of their own** (`27a3d2f`): the full table on `a99eb7b`'s build found two mutations of the slopes passing the
  8E block, `slopestale` (the slopes left where Play stopped) and `slopeevery` (the slopes taken at every seating, no step rule). Check
  (e)'s Play at half speed moved every marching block past the step at each 60th of a second, so no block was ever left behind for the
  pause to take again, and its count of seatings included those of formations the gait leaves at rest. It now plays four slow steps
  after the 24, as Play's clock slows into a dwell's hold, requires that some block is left behind (else the pause tests nothing), that
  the pause takes its slopes again, and that the seatings of animated formations skipped some (a counter of those, `SEAT_STATS.want`):
  on the build 546 seatings, 189 of them of animated formations and 157 of
  those taking the slopes, 2 blocks left behind at the last step and taken again at the pause, the 59 animated meshes' slopes then exactly a
  fresh seating's at the clock; both mutations now fail. The check's name already said so; the build changed in check (e) and the counter.

### 17.13 Performance: the census against 8D, the CPU, the devices pending

**The census, per view and pass** (`tools/stage8/census-8e.js`, `docs/stage8-evidence/8e/census.json` and `census.md`): one whole frame per view
after the eye moved (culled, every pass, the ground's depth drawn), reconciled with `renderer.info` in every frame; 8D's build against 8E's,
calls / triangles:

| view | world pass | shadow pass | whole frame (calls / triangles) | triangles | figures (calls / triangles) | rich / simple blocks |
|---|---|---|---|---|---|---|
| `overview-field` | 531 / 1.502 M → 529 / 1.504 M | 289 / 1.043 M → 287 / 1.042 M | 834 / 2.692 M → 830 / 2.694 M | **+0.1%** | 585 / 1.267 M → 581 / 1.269 M | 1 / 30 |
| `overview-field-1x` | 183 / 238.0 k → 183 / 238.0 k | 0 / 0 → 0 / 0 | 197 / 385.1 k → 197 / 385.1 k | **+0.0%** | 0 / 0 → 0 / 0 | 0 / 0 |
| `overview-field-10x` | 531 / 1.505 M → 529 / 1.508 M | 289 / 1.043 M → 287 / 1.042 M | 834 / 2.695 M → 830 / 2.697 M | **+0.1%** | 585 / 1.267 M → 581 / 1.269 M | 1 / 30 |
| `overview-plan` | 531 / 1.481 M → 529 / 1.483 M | 289 / 1.043 M → 287 / 1.042 M | 834 / 2.671 M → 830 / 2.673 M | **+0.1%** | 585 / 1.267 M → 581 / 1.269 M | 0 / 31 |
| `close-sokolnitz` | 387 / 1.267 M → 406 / 1.384 M | 275 / 1.020 M → 273 / 1.096 M | 675 / 2.434 M → 692 / 2.628 M | **+8.0%** | 450 / 1.016 M → 467 / 1.210 M | 25 / 6 |
| `close-sokolnitz-1x` | 167 / 238.6 k → 167 / 238.6 k | 0 / 0 → 0 / 0 | 181 / 385.7 k → 181 / 385.7 k | **+0.0%** | 0 / 0 → 0 / 0 | 0 / 0 |
| `close-sokolnitz-10x` | 317 / 1.178 M → 331 / 1.281 M | 274 / 1.019 M → 272 / 1.096 M | 603 / 2.345 M → 615 / 2.525 M | **+7.7%** | 387 / 930.8 k → 399 / 1.111 M | 19 / 12 |
| `staff-paper` | 136 / 238.7 k → 136 / 238.7 k | 0 / 0 → 0 / 0 | 148 / 238.7 k → 148 / 238.7 k | **+0.0%** | 0 / 0 → 0 / 0 | 0 / 0 |
| `pratzen-low` | 293 / 1.119 M → 296 / 1.173 M | 239 / 945.0 k → 243 / 995.2 k | 543 / 2.211 M → 550 / 2.315 M | **+4.7%** | 346 / 816.2 k → 353 / 920.2 k | 14 / 17 |
| `selected-formation` | 390 / 1.300 M → 388 / 1.365 M | 289 / 1.043 M → 287 / 1.112 M | 691 / 2.490 M → 687 / 2.625 M | **+5.4%** | 509 / 1.094 M → 505 / 1.228 M | 22 / 9 |
| `watch-selected` | 335 / 1.235 M → 338 / 1.302 M | 279 / 1.026 M → 277 / 1.087 M | 625 / 2.408 M → 626 / 2.535 M | **+5.3%** | 447 / 1.013 M → 448 / 1.140 M | 21 / 10 |
| `hybrid-dimmed` | 350 / 1.283 M → 350 / 1.333 M | 274 / 1.019 M → 274 / 1.085 M | 635 / 2.449 M → 635 / 2.565 M | **+4.7%** | 457 / 1.050 M → 457 / 1.167 M | 16 / 15 |
| `pratzen-low-1x` | 151 / 227.8 k → 151 / 227.8 k | 0 / 0 → 0 / 0 | 162 / 374.9 k → 162 / 374.9 k | **+0.0%** | 0 / 0 → 0 / 0 | 0 / 0 |
| `pratzen-low-10x` | 292 / 1.115 M → 295 / 1.163 M | 277 / 1.026 M → 275 / 1.073 M | 580 / 2.288 M → 581 / 2.383 M | **+4.2%** | 382 / 892.7 k → 383 / 988.1 k | 14 / 17 |
| `paper-north-up` | 144 / 240.9 k → 144 / 240.9 k | 0 / 0 → 0 / 0 | 156 / 240.9 k → 156 / 240.9 k | **+0.0%** | 0 / 0 → 0 / 0 | 0 / 0 |
| `paper-close` | 94 / 203.4 k → 94 / 203.4 k | 0 / 0 → 0 / 0 | 103 / 203.5 k → 103 / 203.4 k | **-0.0%** | 0 / 0 → 0 / 0 | 0 / 0 |
| `paper-drawer` | 100 / 226.5 k → 100 / 226.5 k | 0 / 0 → 0 / 0 | 110 / 226.5 k → 110 / 226.5 k | **+0.0%** | 0 / 0 → 0 / 0 | 0 / 0 |
| `ph8-overview-study` | 516 / 1.474 M → 516 / 1.480 M | 284 / 1.032 M → 284 / 1.036 M | 811 / 2.653 M → 811 / 2.663 M | **+0.4%** | 575 / 1.245 M → 575 / 1.256 M | 0 / 32 |
| `ph8-overview-watch` | 516 / 1.471 M → 516 / 1.478 M | 284 / 1.032 M → 284 / 1.036 M | 811 / 2.650 M → 811 / 2.661 M | **+0.4%** | 575 / 1.245 M → 575 / 1.256 M | 0 / 32 |
| `ph8-overview-watch-1x` | 172 / 236.7 k → 172 / 236.7 k | 0 / 0 → 0 / 0 | 183 / 383.8 k → 183 / 383.8 k | **-0.0%** | 0 / 0 → 0 / 0 | 0 / 0 |
| `ph8-overview-watch-10x` | 516 / 1.474 M → 516 / 1.480 M | 284 / 1.032 M → 284 / 1.036 M | 811 / 2.653 M → 811 / 2.663 M | **+0.4%** | 575 / 1.245 M → 575 / 1.256 M | 0 / 32 |
| `eye-zuran` | 139 / 285.4 k → 144 / 301.1 k | 27 / 97.0 k → 27 / 112.6 k | 177 / 529.6 k → 182 / 560.8 k | **+5.9%** | 45 / 153.3 k → 50 / 184.5 k | 4 / 1 |
| `eye-zuran-1x` | 118 / 227.1 k → 118 / 227.1 k | 0 / 0 → 0 / 0 | 129 / 374.2 k → 129 / 374.2 k | **-0.0%** | 0 / 0 → 0 / 0 | 0 / 0 |
| `plans-overview` | 548 / 1.487 M → 546 / 1.489 M | 289 / 1.043 M → 287 / 1.042 M | 859 / 2.677 M → 855 / 2.679 M | **+0.1%** | 585 / 1.267 M → 581 / 1.269 M | 0 / 31 |
| `paper-laptop` | 144 / 240.9 k → 144 / 240.9 k | 0 / 0 → 0 / 0 | 156 / 240.9 k → 156 / 240.9 k | **+0.0%** | 0 / 0 → 0 / 0 | 0 / 0 |
| `narrow-1024` | 531 / 1.509 M → 529 / 1.511 M | 289 / 1.043 M → 287 / 1.042 M | 834 / 2.698 M → 830 / 2.700 M | **+0.1%** | 585 / 1.267 M → 581 / 1.269 M | 0 / 31 |
| `phone:overview-plan` | 531 / 1.493 M → 529 / 1.496 M | 0 / 0 → 0 / 0 | 545 / 1.640 M → 543 / 1.643 M | **+0.1%** | 306 / 633.5 k → 304 / 635.9 k | 0 / 31 |
| `phone:pratzen-low` | 212 / 1.031 M → 213 / 1.068 M | 0 / 0 → 0 / 0 | 223 / 1.178 M → 224 / 1.215 M | **+3.1%** | 66 / 190.2 k → 67 / 226.7 k | 8 / 23 |
| `phone:ph8-overview-watch` | 516 / 1.484 M → 516 / 1.491 M | 0 / 0 → 0 / 0 | 527 / 1.631 M → 527 / 1.638 M | **+0.4%** | 301 / 622.9 k → 301 / 629.5 k | 0 / 32 |

Every frame of both builds is reconciled with `renderer.info`. **No view's triangles or calls rise by more than 10%**: the most, close on
Sokolnitz at 4x, +8.0% (2,433,595 to 2,627,505 triangles; 675 to 692 calls, +2.5%), at 10.33x +7.7%; the eye level +5.9% (calls +2.8%, the
most of any view); the low Pratzen view and the views with a formation selected +4.2% to +5.4%; the Overviews +0.1% to +0.4%, where every
block is simple (one, near the eye in the Field vantage's Overview, rich); every view at 1x and on the paper map, where no figure is drawn,
within 46 triangles of 8D's (the position-confidence patches, `conf`: two fresh pages of 8D's own build differ
by as much, 84 and 96 triangles in two of these views, so the variation is not 8E's; traced by a probe listing each drawn mesh's triangles). The rich kit is what costs: in the close view 25 of the 31 blocks in it draw it. **Section 8.3's
budgets**: every desktop view within 2.8 million triangles and 900 calls (the most 2,700,453 triangles, `narrow-1024`, and 855 calls,
`plans-overview`, Overviews that 8E changes by 0.1%), so the **integrated-GPU condition is not met**: no 4x frame rises by more than 10% in
triangles or calls. The phone (`lowTier`): its low Pratzen view 1,178,497 to 1,214,927 triangles (+3.1%), within 1.62 million; its two
Overview views 1,642,785 and 1,637,881 against 8D's 1,640,415 and 1,631,301, over the budget by 1.4% and 1.1% as they were before 8D
(section 16.11; 8E adds 0.1% and 0.4%), so section 8.3's alternative, the phone route's run, is required before merging, as it was for 8D,
and is pending. No phone view's calls rise by more than one.

**The gait draws nothing more**: on 8E's build each view's frame with every kit mesh's amplitude 0 (the same culling: the bounds hold the
envelope whatever the amplitude) has the same calls and triangles in every pass as the frame drawn (all 29 views, 28 of them with 12 to 46 kit meshes animated). The level of detail is
the geometry's cost; the gait's is the CPU's and the vertex shader's.

**The CPU** (`tools/stage8/cost-8e.js`, `docs/stage8-evidence/8e/cost-0845.json`, `cost-0845-fast.json`, `cost-1040.json`; this machine's, a container's shared CPU;
per step of a played stretch, 240 steps of Play at 60 a second with the dwell off, so that every step is at the speed's nominal rate,
medians over five repetitions):

| view, speed | `gaitStep` | the slopes: counted (lookups) / benched / timed | the animation | `kitLod` | seatings a frame (taking the slopes) | slope attributes uploaded a frame |
|---|---|---|---|---|---|---|
| `pratzen-low` at 08:45, 0.5x | 0.0708 ms | 0.027 ms (1060) / 0.0472 ms / 0.1366 ms | **0.118 ms** | 0.0558 ms | 21.88 (3.19) | 26.96 (7.5 KB) |
| `pratzen-low` at 08:45, 1x | 0.0942 ms | 0.0464 ms (1750) / 0.0681 ms / 0.0458 ms | **0.1623 ms** | 0.055 ms | 23.02 (5.28) | 44.64 (12.4 KB) |
| `close-sokolnitz` at 08:45, 0.5x | 0.0804 ms | 0.0297 ms (1060) / 0.0374 ms / 0.12 ms | **0.1178 ms** | 0.0504 ms | 21.88 (3.19) | 26.96 (7.5 KB) |
| `close-sokolnitz` at 08:45, 1x | 0.0871 ms | 0.0621 ms (1750) / 0.0976 ms / 0.0463 ms | **0.1847 ms** | 0.0504 ms | 23.02 (5.28) | 44.64 (12.4 KB) |
| `overview-plan` at 08:45, 0.5x | 0.0771 ms | 0.0281 ms (1060) / 0.0409 ms / -0.0075 ms | **0.118 ms** | 0.0458 ms | 21.88 (3.19) | 26.96 (7.5 KB) |
| `overview-plan` at 08:45, 1x | 0.0708 ms | 0.0578 ms (1750) / 0.0736 ms / 0.0488 ms | **0.1444 ms** | 0.0504 ms | 23.02 (5.28) | 44.64 (12.4 KB) |
| `overview-field` at 08:45, 0.5x | 0.0754 ms | 0.0398 ms (1060) / 0.0478 ms / -0.1266 ms | **0.1232 ms** | 0.04 ms | 21.88 (3.19) | 26.96 (7.5 KB) |
| `overview-field` at 08:45, 1x | 0.0721 ms | 0.0665 ms (1750) / 0.0965 ms / 0.0584 ms | **0.1686 ms** | 0.0458 ms | 23.02 (5.28) | 44.64 (12.4 KB) |
| `pratzen-low` at 08:45, 2x | 0.0633 ms | 0.0429 ms (1682) / 0.0568 ms / 0.0034 ms | **0.1201 ms** | 0.0429 ms | 27.32 (5.5) | 43.76 (11.96 KB) |
| `pratzen-low` at 08:45, 4x | 0.0621 ms | 0.0345 ms (1232) / 0.0499 ms / -0.0384 ms | **0.112 ms** | 0.0446 ms | 29.57 (5.32) | 42.42 (9.14 KB) |
| `close-sokolnitz` at 08:45, 2x | 0.0737 ms | 0.0454 ms (1682) / 0.0622 ms / 0.1059 ms | **0.1359 ms** | 0.0429 ms | 27.32 (5.5) | 43.76 (11.96 KB) |
| `close-sokolnitz` at 08:45, 4x | 0.0721 ms | 0.029 ms (1232) / 0.0414 ms / 0.1016 ms | **0.1135 ms** | 0.0467 ms | 29.57 (5.32) | 42.42 (9.14 KB) |
| `overview-plan` at 08:45, 2x | 0.0704 ms | 0.0757 ms (1682) / 0.0835 ms / 0.0891 ms | **0.1539 ms** | 0.0471 ms | 27.32 (5.5) | 43.76 (11.96 KB) |
| `overview-plan` at 08:45, 4x | 0.0721 ms | 0.0339 ms (1232) / 0.0471 ms / 0.1304 ms | **0.1192 ms** | 0.0471 ms | 29.57 (5.32) | 42.42 (9.14 KB) |
| `overview-field` at 08:45, 2x | 0.0704 ms | 0.0479 ms (1682) / 0.062 ms / 0.33 ms | **0.1324 ms** | 0.0471 ms | 27.32 (5.5) | 43.76 (11.96 KB) |
| `overview-field` at 08:45, 4x | 0.0696 ms | 0.0345 ms (1232) / 0.0448 ms / 0.0183 ms | **0.1144 ms** | 0.0429 ms | 29.57 (5.32) | 42.42 (9.14 KB) |
| `pratzen-low` at 10:40, 0.5x | 0.0883 ms | 0.0232 ms (844) / 0.0345 ms / 0.315 ms | **0.1228 ms** | 0.05 ms | 25.52 (4.08) | 36.27 (6.37 KB) |
| `close-sokolnitz` at 10:40, 0.5x | 0.0825 ms | 0.0236 ms (844) / 0.035 ms / 0.0004 ms | **0.1175 ms** | 0.0483 ms | 25.52 (4.08) | 36.27 (6.37 KB) |
| `overview-plan` at 10:40, 0.5x | 0.0704 ms | 0.0224 ms (844) / 0.0474 ms / 0.0162 ms | **0.1178 ms** | 0.0446 ms | 25.52 (4.08) | 36.27 (6.37 KB) |
| `overview-field` at 10:40, 0.5x | 0.0792 ms | 0.0236 ms (844) / 0.0365 ms / 0.1254 ms | **0.1157 ms** | 0.0421 ms | 25.52 (4.08) | 36.27 (6.37 KB) |

The animation (section 8.3's row: at most 0.2 ms a frame) is `gaitStep`'s time plus the slopes' (the larger of the counted and the
benched): **0.112 to 0.185 ms a frame** in every view at every speed measured, the most close on Sokolnitz at 1x from 08:45 (seven formations
marching, 5.3 seatings a frame taking the slopes); within the budget. The level of detail (`kitLod`, every block's decision every frame: the
kit's cost, not the gait's) is 0.040 to 0.056 ms more, so the troops' per-frame work in all is at most 0.235 ms here. The timed difference
(the same stretch with the slopes and without, alternately) is bound by this shared machine's noise, its pairs from -0.32 to +0.62 ms, and
decides nothing: hence the slopes counted (the ground lookups the seating makes, times one lookup's own cost here) and benched (each block
seated with them and without in tight loops). The slopes' attributes uploaded: 27 to 45 a frame, 6 to 12 KB. A first run of these measures
left the dwell on: from 08:45, an event's start, its stretch sat for part of its steps in the dwell's hold, where nothing moves, and
understated a moving frame (the animation 0.105 to 0.168 ms); the runs above play with the dwell off (section 17.12).

**No allocation while only the eye moves** (`tools/stage8/alloc-8e.js`, `docs/stage8-evidence/8e/alloc.json`; Chrome's sampling heap profiler,
a sample every 16 bytes on average): at a still clock (09:05) in the low Pratzen view, seven formations marching (their pose held) and 13
blocks rich, the eye orbited about its target in 600 steps after 600 unsampled ones (each step's blocks posed, seated, given their level of
detail and their gait): **nothing sampled under any of 8E's per-frame functions** (`kitLodFrame`, `kitLod`, `kitLodSet`, `gaitStep`,
`gaitFastest`, `gaitLegOf`, `gaitDistOf`, `gaitRoll`, `clockRate`, `enemyFacing`, `faceClock`, `layoutFigs` and the slopes), and
`updateVisibility` in all 142.8 bytes a step on 8E's build against 142.6 on 8D's (what it allocated before 8E). Sampled from the first step
instead, `kitLod` showed about 13 KB in all whether 300 or 1,200 steps followed (43.6 and 11.2 bytes a step): V8 compiling it, once, not a
frame's allocation, which would grow with the steps; the warm-up separates the two.

**The devices: pending.** No owner hardware was available, so no frame time was measured on a device; geometry counts are budgets, not
proof of frame rates (decision 250 (b)). By the counts above, the desktop's budget is met in every view, the integrated-GPU condition by
none, and the phone's two Overview views exceed its budget as before 8D, so the phone route's run is required before merging (section
17.16). The route's new gait bracket (`perf-run.html?route=gait`) was run end to end here (`route-gait-local.json`): every block in its
order, A B A B A B A twice and, after a rest, B A B A B A B twice; under software WebGL a block's few seconds draw 0 to 2 frames, as in 8D's
local runs of its brackets, so it gives no verdict here.

### 17.14 The captures and the clips

Made by `tools/stage8/clips-8e.js` on 8E's build (section 17.15) and 8D's, each on a page opened as the harness opens it with the app's own
loop held, the state set through the app's own functions; `clips/record-log.txt` gives each one's states. The views are design choices,
made by looking: Saint-Hilaire's division from ahead of its march (from behind, the wood beside it hides the column), its line low from
the side at 10.33x.

- **Stills** (`docs/stage8-evidence/8e/stills/`, 1280 x 720, JPEG, at a paused clock: a marching formation's pose at that clock), 8D's above 8E's
  where both draw the view: `infantry` (Saint-Hilaire's division marching up the Pratzen at 09:00, 26 units off: 8D's men upright, 8E's rich kit in stride),
  `cavalry` (the Guard's cavalry at 10:45, 30 units off), `artillery-deployed` (the guns on the heights in action at 13:00, 22 units off: the
  pieces, the coffret on the limber, the limber, its team and its driver behind each gun, against the guns and crews 8D drew),
  `artillery-limbered` (the same battery limbered and moving at 14:05: team, driver, limber, the piece on its pintle with the coffret between
  its cheeks); 8E's alone: `lod-26`, `lod-110` and `lod-180` (the level of detail by distance: rich at 26 and 110 units, the block's nearest
  point 224.6 and 23.4 px; simple at 180 units, 13.4 px), `slope-10x` (the division's line on the slope at 10.33x, low from the side: its men
  in stride, the planted feet on the drawn ground) and `phone` (a phone's page, 390 x 844 at density 1, an iPhone's user agent).
- **Clips** (`clips/`, H.264 at 10 frames a second, 960 x 540: each frame three steps of Play's own stepping at 30 a second with the dwell off,
  the eye following the formation): `infantry-half` (09:00 to 09:14 at half speed, 8D's slide above 8E's step), `cavalry-half` (10:45 to
  10:59), `artillery-half` (the guns limbered and moving from 14:00: the teams' step and the wheels turning with them), `speeds` (from 09:00
  at ½x, 1x, 2x and 4x, 1.5 s each; the amplitude sampled along it 1, 1, 1 at ½x, 0.63, 0.52, 1.00 at 1x, 0.59, 0.02, 0 at 2x and 0, 0, 0
  at 4x, each by the division's leg at that clock), `pause` (half speed, then the clock still for 1.5 s with the pose held, then half speed
  again), `slope-10x` and `phone-half`.

### 17.15 What was run

Here (Chromium 141.0.7390.37, Playwright 1.56's headless shell, software WebGL; the container's CPU shared with the runs beside it) and on CI
(GitHub's `ubuntu-latest` runners, the same browser), on the commits named:

- **The prerequisites**, each on its own commit's build: `npm test` (all nine suites and the height guard), the self-test 285 of 285 (`2af8ed9`),
  the measures of sections 17.1 and 17.2; on CI, on `1c6b54e`: the push run 40453901130 and the pull request's 40453930102, the checks job,
  `check:contrast` and `check:selftest` passing in each.
- **The data task** (`d95bfe0`), on its own build (`f3c3f3af...`): `npm test` (all nine suites and the height guard); `check:data` against the
  old reference (130 of 132 identical, the two changes as listed) and the new (132 of 132).
- **8E's build** (md5 `d73d01154b8f6e2552fe04bfb24d05e5`, 2,537,677 bytes, `27a3d2f`), and the two before it that draw the same (the
  troops' commit `62f5cd2`, `ff3149adcee37a8846c7b4565caa7b2c`, 2,535,729 bytes; `a99eb7b`, `e80577e2e2ac815205bf8b1572e767bd`, 2,537,038
  bytes; they differ in the self-test's checks (c) and (e) and the counter `SEAT_STATS.want` alone): `npm run build` writes each byte for
  byte; `npm test` (all nine suites and the height guard), `check:data` (132 of 132 declarations identical to the new reference),
  `check:chronology` (no error; its open items as before 8E) and `check:baseline` on each; the self-test 295 of 295 with no console message
  on each, alone (1,152 s, 1,112 s and 1,049 s); `boot-check.js`'s eight cases (on `62f5cd2`'s build); the static mutations; and the
  evidence of sections 17.4 to 17.14, each file naming its build: the census on `62f5cd2`'s; the kit census, the allocation, the costs, the
  route's gait bracket, the stills and the clips on `a99eb7b`'s; the self-test's mutations on `27a3d2f`'s.
- **On CI**: on `d95bfe0` (the data task), the push run 40488755731 and the pull request's 40488763165: every job passes. On `62f5cd2`
  (the troops), the push run 40490778062, the pull request's 40490784810 and the dispatched 40490808164: the checks job, `check:contrast`
  (its eight start-up cases, `context-gait` among them) and `check:selftest` (295 of 295) pass in each, and the dispatched run's
  `check:visual` passes: its 39 cases, every census reconciled and every case's frame with culling its frame without it (0 pixels), the
  motion block's counts over its 16 motions 245, 985, 130 and 10 (8D's, exactly: the map layer in motion unchanged), the culling block's 15
  runs (485 frames judged, 243 compared, 0 pixels differing, 46,840 meshes culled, 34,828 mesh-frames drawn in the shadow pass only), the
  self-test 295 of 295 and no console message; `check-report.js` judges its report again here and passes it. It took 198 minutes against
  8D's 136 (the job's limit is 240): under software WebGL the richer kit's vertices and the hook's arithmetic run on the runner's CPU.
  On `a99eb7b`: the push run 40524845225, the pull request's 40524853920 and the dispatched 40524850177 pass every job; the dispatched
  run's `check:visual` passes in 169 minutes with the same counts (its 39 cases, the motion block's 245, 985, 130 and 10, the culling
  block's 485 frames judged, 243 compared and 0 pixels differing, the self-test 295 of 295, no console message), and `check-report.js`
  judges its report again here and passes it. On `6e24083` and `839bdbe`
  (evidence only): the push runs 40534591093 and 40539654788 and the pull request's 40534602845 pass every job; the pull request's
  40539665517 on `839bdbe` lost its `check:contrast` job while installing the browser (an apt mirror's time-out, before any check ran;
  the push run's same job on the same commit passed). On `27a3d2f` (the final build): the pull request's run 40545859944 and the push run
  40545852952 pass every job (the self-test 295 of 295 in each), and so do the dispatched 40545866479's checks job, `check:contrast` and
  `check:selftest`; its `check:visual` reached the job's limit of 240 minutes and was cancelled, a slower runner's time, not a failure:
  every case took 1.13 to 1.45 times as long as on `62f5cd2`'s runner (the culling block 68 minutes against 47 on `a99eb7b`'s), and it had
  measured all 39 cases (`check-report.js` passes each of them again here), run the self-test (295 of 295 in its log) and every live block
  (the motion block's counts 245, 985, 130 and 10 over its 16 motions, as before; the culling block's 485 frames judged, 243 compared, 0
  pixels differing), with the day's light, the valley fog and the horizon left, about twelve minutes on that runner. The visual job's limit
  is now 350 minutes (`.github/workflows/checks.yml`; GitHub ends any job at 360), and the run is made again on the head that carries it.
  On `43d3f3e` (the records, pushed with `47e376e`; the build unchanged): the push run 40552654044 and the pull request's 40552659959 pass
  every job. The `check:selftest` step took 19 to 38 minutes in eleven runs on 8E's builds (16 to 31 on 8D's), its job at most 44 of
  the 60 allowed.

### 17.16 What remains, for the owner's attention

- **Device acceptance: pending.** No owner hardware was available, and software WebGL's timings decide nothing. Prepared for the owner: 8D's
  build (`git show 2f41819:austerlitz-command-map.html`, md5 `ae7f16b8...`) and 8E's (this PR's), and the device route of
  `docs/STEP6_SPEC.md` §2 (`tools/step6/perf-run.html`, `?src=` naming the build): the desktop route and the phone route (`?route=phone`) on
  both builds give the before and after; the new gait bracket (`?route=gait`: Play at half speed under Follow from 08:30 at the Field vantage,
  the gait as built against the gait at rest, the culling route's orders, rounds and rule) separates the gait's cost from the kit's in one
  build. Section 8.3's integrated-GPU condition is not met (no view's frame rises by more than 10% in triangles or calls: the most +8.0%
  triangles, close on Sokolnitz at 4x), so it does not hold 8E back; none was available, and a run on one would still be the best test of
  the richer kit's vertex cost. The phone's two Overview views remain over its triangle budget (by 1.4% and 1.1%; on 8D's build 1.3% and
  0.7%), so section 8.3's alternative, a phone run of the route holding the heavy segments' long frames at or under 5% in two runs, is
  required before merging, as it was for 8D.
- **For the owner's decision or attention** (none of them blocks the build; each is drawn as recorded above):
  1. *The drivers on the guns on the heights* (section 17.3): drawn as an inference from IV Corps' letter to its divisions, the battery being
     IV Corps' and the Guard's artillery drawn as IV Corps' foot artillery. The alternative, drawing no driver anywhere until a reading reaches a
     battery, is one line of `artDrivers`.
  2. *Gunners beside moving pieces*: Gassendi has the gunners of foot artillery march beside their piece (register item 8); the crew is drawn
     with the deployed battery only, as before 8E, because drawing it with the limbered battery changes the crew's representation, which the
     brief keeps.
  3. *The Santon's battery*: its pieces alone, as before (no limbers, teams or drivers: none in the data).
  4. *The limber's facing in action*: « tourne à gauche » does not say by how much; the team drawn facing the rear is a design value.
  5. *The saddle-cloths*: their claims carry no colour class, so the saddle stays the kit's leather in both levels.
  6. *Facings* (decision 245 (a)): to be reconsidered now that the troops can be judged.
  7. *The drifts under 1 km/h*: in 450 of the self-test's 780 amplitude judgments (a formation at a clock and a speed) the formation moves
     under 1 km/h between anchors (the modelled legs' slow drifts): none steps, as decided; a visitor sees them glide.
- **Kept outside this PR**, as the brief asks: decision 258 (b)'s counter placement and decision 255 (d)'s far-label prototype (both
  commissioned with 8D, section 16.12, not begun). Nothing of the map layer changed.
- **Not measured**: a GPU's frame time (software WebGL here); Safari (no WebKit here); memory on a device.

## 18. Implementation PR 8F as built (28 October 2026)

**Status.** Built on `claude/loving-cerf-xmk1wu` (draft PR #71, base `main` at `94d6e46`, PR #70's merge: implementation PR 8E), for review; not
merged. First the two findings of the audit of 8E, each corrected in a commit of its own (sections 18.1 and 18.2): `5f59c10` (a paused clock holds
the gait drawn), `0c4ce62` and `3a074c5` (the feet on the ground, each instance against itself, and the count of the cases kept open); then
decisions 246 (a) and 247 (a) as the owner settled them (section 0.3) with their checks, `e618e5e`; then the evidence and the records. Nothing of
8G, of decision 258 (b)'s counter placement or of decision 255 (d)'s far-label prototype is in it; decision 245 (a) is kept (no facings), and the
drivers and the artillery are as 8E drew them. **Device acceptance is pending** for 8E and for 8F: no owner hardware was available to this session
(section 18.7).

**In numbers** (sections 18.1 to 18.9): at a pause 0 of 30 paused frames move, for each formation and each way into it (8E's 30 of 30 once the
gait had begun to fade); at 4x the men's poses beyond 0.03 units 263 to 36 and 205 to 35 on the drawn soles, 137 to 11 and 176 to 19 on the
planted edges, the cases left kept open, bounded (2.5 to 3.5 times the tolerance) and counted; each foot's own profile 0.22 to 0.35 ms a frame
against the budget of 0.2, not drawn; from above the shore 1.00 to 1.01 times the field beside it (8E's 1.02 to 1.03, the first draft's 1.18 to
1.20), the rimed margin 1.16 to 1.19 (8E's ice there 1.15 to 1.17); 348, 254, 348 and 254 triangles a deciduous tree (8E's 560, 380, 560, 380),
the frame 14.7% to 21.6% fewer triangles in six views with the same draw calls and more of the troops seen through the woods, the shimmer higher
(1.93% of the woods' pixels against 1.39% in the pheasantry view); the near detail's tone 1.000 of the ground without it, each cell's mean within
0.1%; in the census the desktop frame 380,072 triangles fewer wherever the woods are drawn (14.1% to 16.4%), the draw calls the same in every
view, every desktop view within section 8.3's budget and the phone's two Overview views back within its own (1.40 million triangles against 1.62);
the self-test 301 of 301; 17 mutations of the self-test's 8F block and 27 of `css-test.js`'s each caught.

### 18.1 Prerequisite 1: a pause holds the gait drawn; a seek shows the clock's own pose (the audit of 8E; commit `5f59c10`)

- **Found** by the audit of 8E and **reproduced** on the merged build (`tools/stage8/pause-8f.js`: the app's own loop run frame by frame on a
  clock of the driver's, Play, the speed and Pause by real clicks; `docs/stage8-evidence/8f/pause.json`, the clip
  `docs/stage8-evidence/8f/clips/pause-8e-8f.mp4`, 8E above, the fix below): after the gait had faded out at 4x, `stopPlay()` fixed the clock but
  `gaitStep` eased the amplitude back toward the paused clock's rule (full), so an infantry division, a cavalry corps and a limbered battery
  stepped back into their stride with the clock standing: 0 to 0.39 in the first paused frame at 30 frames a second, 0.63, 0.77, 0.86 in the next
  three, 1 after about fourteen (30 of 30 paused frames moved); paused in the fade (0.37), the same climb; the dwell's hold did the same.
- **The correction.** A clock that stands without being moved (Pause, the day's end, the dwell's hold) holds the pose drawn: the amplitude and the
  trot where they are, and with them the riders' and drivers' beat and the wheels' angles (the phase being the clock's). The ease runs only while
  the clock moves. `setClock` counts every move of the clock but Play's own advance (`GAIT.seek`; `tickClock` passes `opts.play`), so a seek shows
  that clock's own pose at once (the rule's amplitude at the clock and the rate: full where the formation marches at a paused clock), and a minute
  sought shows one pose however it was reached. Reduced motion still stops the gait at once, paused or not.
- **Shown** (the same reproduction on the fix): every way into the pause, for all three formations, the first paused frame's amplitude the last
  played's and every one of 30 paused frames the first's (0 of 30 moved); resumed at 4x, eased on from the amplitude held; a seek while paused the
  clock's own pose in its first frame (8E's eased toward it over several).
- **Held** by the self-test's new check (k) (the pause by the app's own path: its loop run frame by frame on the test's clock, Play, the speed and
  Pause by their buttons; infantry, cavalry and a limbered battery paused from half speed, in the fade and faded out; the first paused frame's
  gait the last played's and every paused frame's the first's; the frame and the sun's depth map drawn with the formation alone, unchanged where
  its block stands as it was; resumed, eased on from the amplitude held; a seek the clock's own pose at once; the dwell's hold held; reduced
  motion at once); checks (e) and (f) reach their paused case by a seek and drive Play's advance as Play does; `css-test.js` holds the hold, the
  seek counter and `tickClock`'s two calls; `runtime-test.js` dry-runs the pause in the fade and faded out by `stopPlay`, the resume and a seek.
  Each made to fail: `mutate-8e.js`'s `pauseease` (8E's behaviour), `seekease` and `playseek` fail the self-test's block; `mutate-css-8e.js`'s
  `pausehold`, `seekease`, `seekcount` and `playseek` fail `css-test.js`'s. The manifest 295 to 296.
- **Found on the way, not changed** (the formation model's, not the gait's): a block still wheeling toward its heading at its arm's rate (`WHEEL`,
  real time) when the clock stops keeps turning after the pause. Recorded for the owner (section 18.10).

### 18.2 Prerequisite 2: the feet on the ground, each instance against itself (the audit of 8E; commits `0c4ce62` and `3a074c5`)

- **Found** by the audit of 8E: check (h) passed on "99 poses in 100 within 0.03 units" and on "none further off than the rest pose stands
  anywhere on the field", a field-wide maximum unrelated to any one instance; at 4x 102 poses of 23,292 were beyond 0.03 (the worst 0.087), at
  10.33x 75 (0.213), the grenadier division's at 09:05 the worst.
- **Reproduced and taken apart** (`tools/stage8/contact-8f.js`, `docs/stage8-evidence/8f/contact.json`): every formation drawn with a gait at
  09:05, 10:40 and 13:50, up to 40 instances of every animated mesh (3,484 instance-clocks of men and 612 of horses at each factor), eight phases
  at full swing, each level, each instance against itself at rest on the drawn ground, on 8E's build (with prerequisite 1) and on the fix: two
  sets of points, the edges the hook plants (each foot's heel and toe on its line, each hoof's fore and aft edges) and the soles the kit draws
  (the corners of a man's legs or feet and of a horse's hooves). The **legacy seat** (the upright figure on a slope, a sole's corner off the
  ground at rest: up to 0.18 units at 4x on the simple kit, 0.55 on a horse's hoof) and the **raised foot** (its lift over the planted one: 0.08
  to 0.14 at the median) are the rest pose's and the stride's, reported, not the gait's error. Three causes of the gait's own error:
  1. **the simple kit's soles not planted**: the hook planted the rich kit's heel and toe (-0.065 and 0.135 from the foot's rest point) on both
     levels, while the simple kit's legs are boxes 0.18 deep (-0.09 to 0.09);
  2. **a chord taken by the way an edge moves**: the two slopes (ahead of the man and behind him, chords of the drawn ground from his middle) were
     given to an edge by the direction it moved, so a toe drawn back but still ahead of his middle, or a heel brought forward but still behind it,
     was judged against the other side's chord;
  3. **the ground under each foot and each hoof**: the chords are the figure's middle line's, so a crease of the drawn ground running across a
     foot (its cells' diagonals) is not seen, nor the ground under each hoof.
- **Corrected within the animation's budget** (section 8.3: 0.2 ms a frame): (1) each kit's own soles planted, chosen by the knee's uniform, which
  is the level's (`ANIM.MAN.HEEL0`, `TOE0`; the hook and its mirror); (2) the chords anchored at the man's middle, each edge's posed place against
  its rest place on them (`animChord`; the horse's chords were already its pairs'); the chords read through the drawn ground's compact heights
  (`world.js` `groundHeights`, `groundYFast`: `groundY`'s own arithmetic on a compact copy of the drawn mesh's vertex heights, value for value the
  same), made again whenever `scaleGround` changes the ground. Two lookups a figure, as 8E.
- **The same sample on both builds**: at 4x the men's poses beyond 0.03 on the drawn soles 263 to 36 (the simple kit) and 205 to 35 (the rich), on
  the planted edges 137 to 11 and 176 to 19; at 10.33x (its tolerance 0.0774, in proportion to the relief) 104 to 24, 159 to 32, 90 to 13 and 106
  to 22. The horses unchanged (their model was not touched: 27 to 29 poses beyond at 4x, the headquarters' escort on the Zuran mound and the
  limbered teams). **Not better for every instance**: each instance against itself on the two builds (its worst over the eight phases), of 3,484
  instance-clocks of men at each factor, 46 to 312 are worse by more than 0.001 units (3 to 12 by more than a third of the tolerance) and at most
  7 newly beyond it (none in one set), against 862 to 3,394 better and 27 to 105 brought within it; the most worse the grenadiers' #63 at 09:05 at
  10.33x (0.149 to 0.247 units, sinking), #68 there (0.109 to 0.175) and Saint-Hilaire's #7 at 10:40 at 4x (0.025 to 0.050), each on a crease of
  the drawn ground across the foot, which 8E's wrong-sided chord had happened to offset. The worst at 10.33x on the drawn soles rose with them:
  0.214 to 0.247 (the simple kit), 0.200 to 0.216 (the rich); the worst on the planted edges fell (0.213 to 0.175, 0.262 to 0.165), and at 4x
  every worst of the men fell (the drawn soles 0.101 to 0.096 and 0.102 to 0.086, the edges 0.087 to 0.056 and 0.107 to 0.063).
- **Not drawn: each foot's own profile** (3), measured as an option (`docs/stage8-evidence/8f/contact/profile-option.patch`): the drawn ground
  along each foot's own line in four slopes (five lookups a foot) and each hoof's ahead and behind (three a hoof), clamped as before, in two
  attributes a figure (`aSl`, `aSl2`). It brings the planted edges within 0.03 units at 4x in every pose measured (the worst 0.016 for the men,
  0.027 for the horses; the drawn soles 11 poses beyond, the worst 0.042, a sole's width across a crease) and at 10.33x all but two hooves'. Its
  cost (`tools/stage8/cost-8e.js`, the stretch Play draws, `docs/stage8-evidence/8f/contact/cost-*.json`): on every block 0.217 to 0.354 ms a
  frame (8E's chords 0.109 to 0.162 measured the same way); only on blocks drawn with the rich kit, 0.115 to 0.321 (over in the low and close
  views); only where a man is drawn 48 px or more (a chord's worst error there about 2.6 px), still 0.239 in the low Pratzen view and 0.284 to
  0.314 close on Saint-Hilaire's division. So it is not drawn: **a material trade-off, put to the owner** (section 18.10).
- **Held**: check (h) rewritten: each instance against itself at rest, both levels, at 4x and 10.33x, fresh (three clocks, up to 24 instances of
  each animated mesh, eight phases) and in motion (Play through the app's own loop on the test's clock for three stretches: Saint-Hilaire's
  division up the Pratzen through its via point and turn, the eye dollied in so that its blocks turn rich; the Guard's cavalry at 1x; the limbered
  battery; each third frame every animated instance as drawn; then paused), the hook's edges and the drawn soles: every pose within H_TOL (0.03
  units at 4x, in proportion to the relief at 10.33x) but where the cases the chords leave are **kept open**, each set with a **proposed bound**
  on its worst (H_OPEN, in H_TOL: the edges 2.5, the men's drawn soles 3.5, the horses' 3; the largest measured in each set, 2.13 to 3.19, rounded
  up to the next half) and **no more cases than were found** (H_CASES: the poses beyond H_TOL on prerequisite 2's build, by factor, set, way and
  level, with a margin of a tenth, at least two; where none was found, none: the original criterion). The count was added by `3a074c5`, when the
  mutations showed that a bound on the worst alone admitted 8E's soles back on the simple kit (its worst within 3.5 H_TOL). Every case beyond
  H_TOL counted and reported with its pixels: at its largest size on the screen (a man 17.6 px tall) the simple kit's worst 0.82 px at 4x and 2.12
  px at 10.33x; in motion through the camera, the rich kit's largest at most 1.13 px for the men (the hook's edges; their drawn soles 0.94 px) and
  1.42 px for the horses at 4x, 2.61 px and 4.00 px at 10.33x (on 8F's build, here); in motion at 4x no man's pose and one horse's (0.031, a
  limbered team) beyond H_TOL. The legacy seat and the lift reported, not judged; the resting seat's own check (5) unchanged; the slopes' lookup
  the drawn ground's at every factor; the level switched along the dolly and the division turned. `runtime-test.js` dry-runs `groundYFast` against
  `groundY` on the drawn ground's own layout (8,800 points at two scales, the compact heights made again when stale) and the hook's arithmetic
  (3,600 posed edges of each kit's soles planted on its chords; the simple kit's own soles, not the rich kit's). `css-test.js` holds the rules.
  The manifest's check (h) renamed twice (296 checks).
- **The cases kept open, as they stand** (the self-test's check (h) on 8F's build, here, `docs/stage8-evidence/8f/selftest-local.json`; the counts
  are `H_CASES`'s, found on prerequisite 2's build and unchanged since; every set not listed has none, the original criterion): the poses beyond
  H_TOL by factor, figures, the edges judged, way and level, with the most `H_CASES` allows, the worst pose and its instance (fresh, every set's
  worst at 09:05: the headquarters' escort on the Zuran mound, or the grenadiers' #63 on a crease of the drawn ground; in motion, a limbered
  team's horses or one of Vandamme's men while playing):

  | factor | figures | edges judged | way | level | poses | beyond H_TOL (at most) | the worst, units (H_TOL) | the worst's instance |
  |---|---|---|---|---|---|---|---|---|
  | 10.33x | horses | drawn soles | fresh | rich | 7704 | 28 (31) | 0.1848 (2.39) | the headquarters' escort #3 at 09:05 |
  | 10.33x | horses | drawn soles | fresh | simple | 7704 | 25 (28) | 0.2002 (2.59) | the headquarters' escort #1 at 09:05 |
  | 10.33x | horses | drawn soles | motion | rich | 1958 | 1 (3) | 0.0875 (1.13) | the guns on the heights' team #20 at 13:51 (playing) |
  | 10.33x | horses | hook's edges | fresh | rich | 7704 | 29 (32) | 0.1870 (2.42) | the headquarters' escort #3 at 09:05 |
  | 10.33x | horses | hook's edges | fresh | simple | 7704 | 29 (32) | 0.1870 (2.42) | the headquarters' escort #3 at 09:05 |
  | 10.33x | horses | hook's edges | motion | rich | 1958 | 2 (4) | 0.0793 (1.02) | the guns on the heights' team #20 at 13:51 (playing) |
  | 10.33x | men | drawn soles | fresh | rich | 22848 | 21 (24) | 0.2156 (2.79) | the grenadiers' #63 at 09:05 |
  | 10.33x | men | drawn soles | fresh | simple | 22848 | 14 (16) | 0.2465 (3.18) | the grenadiers' #63 at 09:05 |
  | 10.33x | men | drawn soles | motion | rich | 7856 | 1 (3) | 0.0804 (1.04) | Vandamme's #0 at 13:58 (playing) |
  | 10.33x | men | hook's edges | fresh | rich | 22848 | 20 (22) | 0.1652 (2.13) | the grenadiers' #63 at 09:05 |
  | 10.33x | men | hook's edges | fresh | simple | 22848 | 11 (13) | 0.1394 (1.80) | the grenadiers' #63 at 09:05 |
  | 4x | horses | drawn soles | fresh | rich | 7704 | 29 (32) | 0.0576 (1.92) | the headquarters' escort #3 at 09:05 |
  | 4x | horses | drawn soles | fresh | simple | 7704 | 27 (30) | 0.0639 (2.13) | the headquarters' escort #5 at 09:05 |
  | 4x | horses | drawn soles | motion | rich | 1882 | 1 (3) | 0.0310 (1.03) | the guns on the heights' team #18 at 13:50 (playing) |
  | 4x | horses | hook's edges | fresh | rich | 7704 | 29 (32) | 0.0583 (1.94) | the headquarters' escort #3 at 09:05 |
  | 4x | horses | hook's edges | fresh | simple | 7704 | 29 (32) | 0.0583 (1.94) | the headquarters' escort #3 at 09:05 |
  | 4x | men | drawn soles | fresh | rich | 22848 | 21 (24) | 0.0860 (2.87) | the grenadiers' #63 at 09:05 |
  | 4x | men | drawn soles | fresh | simple | 22848 | 9 (11) | 0.0958 (3.19) | the grenadiers' #63 at 09:05 |
  | 4x | men | hook's edges | fresh | rich | 22848 | 14 (16) | 0.0625 (2.08) | the grenadiers' #63 at 09:05 |
  | 4x | men | hook's edges | fresh | simple | 22848 | 4 (6) | 0.0563 (1.88) | the grenadiers' #63 at 09:05 |

  None is beyond its set's proposed bound (H_OPEN: the worst 3.19 H_TOL against 3.5). **These are open, not accepted**: the original criterion
  (every pose within H_TOL) is what the owner's choice in section 18.10 would restore.

### 18.3 The water (decision 246 (a); `world.js` `WATER_COL`, `ICE`, `STREAM`, `WATER_GLSL`, `iceHook`, `streamHook`, `buildWater`, `waterPresentation`)

- **The meres' ice, by material and light alone.** On the landscape the ice is clearer, darker and glossier toward the middle (`iceClear`,
  roughness 0.20) and rimed toward the shore (`iceFrost`, roughness 0.62) from 0.38 of a mere's radius, eased into each other with a broad noise;
  a broad variation of tone of low contrast (a tenth of the tone in all, value noise on the world's plane, patches about 9 units across, the
  rime's grain about 2.7: anchored to the ground, nothing moves); the sky reflected more at a grazing view over the clear ice (its weight 1.4 at
  the horizon, falling with the fourth power of the eye's height over the ice). The rimed margin answers the one description of the ice's look
  read, Ségur's "ce miroir, blanchi par les frimas" (section 5.2: a memoir, grade C), as Part A's `w-ice` did; every value a design value. No
  line, crack, hole, open water, snow or figure (`docs/STAGE4_SPEC.md` §F.1's rule as 4E built it).
- **The shore ice**: 4E's ring (0.86 to 1 of each mere's ellipse, lifted 0.02 units, its outer edge the mere's own) feathered at both edges: its
  opacity rising over the inner 0.35 of its width and falling to nothing at the shore from 0.55, so that no hard ring is drawn and the shore reads
  as the drawn ground meeting the ice; drawn after its ice whatever the eye (`renderOrder` 1: both are transparent and their centres a lift apart,
  so an eye looking up would have sorted the band first and shown the ground through its feathered edges), over ice that writes no depth (nothing
  visible lies under the ice), so the band never fights the ice for a pixel at a grazing view, and only the drawn ground hides it.
- **The streams**: still (nothing in them reads a clock or a time, so an idle page draws no frame for them), darker and less blue (`streamLand`,
  against 8E's `stream`), a little glossier (roughness 0.30, the environment's weight 0.40), a still variation of tone (a tenth in all) and the
  sky at a grazing view (weight 2.0, the cube of the eye's height over the water); their banks darker (`bankLand`). No ice on the streams, no
  flow, no crack, hole, snow or figure (section 5.2: no source read says whether the Goldbach or the Littawa was frozen).
- **Kept**: the meres' outlines and levels, the ring's geometry, the streams' lines and 8A's widths (`terrain-test.js`'s meres' and shore ice's
  edges at 1x, 4x and 10.33x pass unchanged; the self-test's 4E and 8A checks pass); every colour in `WATER_COL` (8E's `ice`, `iceRim`, `bank` and
  `stream` kept for the paper map; `iceClear`, `iceFrost`, `iceBand`, `bankLand`, `streamLand` the landscape's); the hooks chain the atmosphere's
  uniforms (`atmoUniforms`: the haze and the valley fog as on every material) and have programs of their own (`customProgramCacheKey`); nothing
  new is sorted but the band's order. **The paper map draws the water with 8E's own materials** (`WATER_MATS.paper`, made as `buildWater` made
  them until 8F), put in place by `setMode` (`waterPresentation`) before it sets the water's opacity as before: every parameter 8E's, no hook of
  their own.
- **The bright margin tuned, measured** (`docs/stage8-evidence/8f/ice-margin.json`; the owner: "Tune the bright ice margins so they integrate with
  the surrounding terrain"). The light of the shore band's middle (0.92 of a mere's radius) and of the rimed margin (0.8) against the field just
  beyond the shore (1.12), in the frame from above (90 units, 4x), obliquely and low, at 09:00, 12:00 and 15:00 (`tools/stage8/ice-8f.js`, a 1366
  x 768 page, the light as drawn, linear); each cell the shore band's middle / the rimed margin / the clear middle (0.5 of the radius), the least
  to the most over the three clocks:

  | view | 8E | 8F's first draft | the first draft with Part A's margin colour (`w-ice`) | 8F as built |
  |---|---|---|---|---|
  | from above | 1.02-1.03 / 1.15-1.17 / 1.20-1.21 | 1.18-1.20 / 1.26-1.28 / 1.16-1.17 | 1.40-1.44 / 1.43-1.46 / 1.19-1.20 | **1.00-1.01 / 1.16-1.19 / 1.11-1.12** |
  | obliquely | 0.95-0.98 / 1.04-1.08 / 1.15-1.21 | 1.08-1.12 / 1.12-1.16 / 1.15-1.21 | 1.26-1.31 / 1.27-1.31 / 1.17-1.23 | **0.93-0.97 / 1.04-1.09 / 1.09-1.16** |
  | low | 1.10-1.13 / 1.22-1.23 / 1.31-1.38 | 1.14-1.16 / 1.24-1.26 / 1.34-1.40 | 1.24-1.27 / 1.33-1.36 / 1.35-1.42 | **1.07-1.09 / 1.19-1.21 / 1.31-1.36** |

  So, as built, the shore stands against the field a little darker than 8E's ice did everywhere (by 0.010 to 0.043) and the rimed margin within
  0.03 of 8E's ice there (at most 0.014 lighter, from above), the clear middle darker than 8E's from above, and Part A's margin colour is not
  drawn (Part A, section 5: "the margin is bright at these distances, the one value to tune in 8F"). From above the margin is lighter than the
  middle (the rime); obliquely and low the clear middle reflects more of the sky and reads lighter. The first draft's margin was brighter against
  the field than 8E's ice, and taken apart it was not the colour: the environment's weight at 0 changed the shore's ratio by 0.001 (from above at
  12:00: 1.196 to 1.195), the frost's colour at 0.82 of itself by about 0.06 (1.134), the band hidden brought it to 1.037, the band without its
  offset to 1.032. The cause was a fault of the draft: the band's polygon offset (against z-fighting with the ice) drew it over the drawn ground
  at the shore, wherever the ground stands within the offset's reach above the ice, so the ice reached outside the shore line 4E draws. Corrected:
  no offset, the ice writing no depth instead; then the margin and the middle darker together, so that the rimed margin stays lighter than the
  clear middle (the disc alone from above at noon: the margin 33.1 against the middle 15.4, in the self-test's grey) while standing against the
  field about as 8E's ice stood. The stills (`docs/stage8-evidence/8f/pairs/ice-*.jpg`) show the meres as grey-green ice with a soft, lighter
  margin, not plates with a white rim; against a low sun the glare on the clear ice spreads wider than 8E's sheen (section 18.10).

### 18.4 The woods (decision 247 (a); `world.js` `TREE8F`, `treeKit`, `treeShell`, `treeLimbs`, `treePrism`, `treeGeo`, `buildWoods`)

- **The prototypes first** ("8F begins with a prototype measured against 2F's checks", section 10): three ways of making the deciduous crowns
  airier, each put into 8E's live scene (`tools/stage8/protos/woods.js`) and measured in six views (`tools/stage8/woods-8f.js`,
  `docs/stage8-evidence/8f/woods-8f-8e.json`, the stills in `woods/` and the sheets in `sheets/`): **t-open** (each crown a twig shell: 8E's
  crown, so its envelope is 8E's, about half its faces kept by a seeded choice, each shrunk toward its own centre, with a trunk forking into limbs
  and twigs inside it; opaque, drawn on both faces), **t-airy** (t-open more open: 42% of the faces kept, each shrunk to 0.70) and **t-lace**
  (t-open's trunk and limbs with crossed alpha-tested twig cards in place of each shell: the transparency option, measured for its overdraw,
  shimmer and shadows as the decision asks). Measured in each: the triangles a tree; the frame's draw calls and triangles, every pass; the troops
  seen through the woods (the troops' pixels drawn white over every other solid thing drawn black, with the woods and without); the shimmer (the
  woods' pixels whose grey changes by more than 24 of 255 when the eye moves half a pixel, a share of the woods' pixels); the fragments the woods
  rasterise per pixel they cover (each drawn alone, additively, with no depth test and its alpha test off: what a card shades before it discards);
  2F's placement rules (every tree and scrub of a wood inside the drawn wood class, the counts by kind); a low tier's calls and triangles. Every
  variant keeps the placement: 1,750 instances, none outside the drawn wood class or the model's, the counts by kind 8E's. In the six views (8E's
  woods against the three):

  | view | measure | 8E | t-open | t-airy | t-lace |
  |---|---|---|---|---|---|
  | pheasantry (4x) | the frame's triangles (calls) | 2,306,505 (600) | 2,060,041 (600) | 1,926,433 (600) | 1,691,753 (608) |
  | | troops seen through | 84.4% | 87.9% | 89.8% | 91.9% |
  | | shimmer | 1.39% | 1.86% | 1.91% | 2.00% |
  | | fragments a pixel | 5.75 | 6.63 | 5.61 | 11.51 |
  | from inside a wood (ice-sun) | triangles (calls) | 1,756,323 (312) | 1,509,859 (312) | 1,376,251 (312) | 1,141,571 (320) |
  | | troops seen through | 11.0% | 15.3% | 18.5% | 21.7% |
  | | shimmer | 0.11% | 0.45% | 0.66% | 0.86% |
  | | fragments a pixel | 10.64 | 11.23 | 8.90 | 20.44 |
  | the low Pratzen view | triangles (calls) | 2,168,001 (548) | 1,921,537 (548) | 1,787,929 (548) | 1,553,249 (556) |
  | | shimmer | 0.38% | 0.66% | 0.72% | 0.64% |
  | | fragments a pixel | 4.43 | 5.17 | 4.49 | 8.44 |
  | close on Sokolnitz | triangles (calls) | 2,480,417 (690) | 2,233,953 (690) | 2,100,345 (690) | 1,865,665 (698) |
  | | troops seen through | 85.9% | 89.0% | 90.8% | 93.0% |
  | | shimmer | 1.74% | 2.18% | 2.47% | 2.57% |
  | the Field vantage | triangles (calls) | 2,588,869 (828) | 2,342,405 (828) | 2,208,797 (828) | 1,974,117 (836) |
  | the phase-8 Overview (Watch) | triangles (calls) | 2,513,937 (809) | 2,267,473 (809) | 2,133,865 (809) | 1,899,185 (817) |
  | a low tier (800 x 600): the Field vantage, the low Pratzen view | triangles (calls) | 1,516,419 (529), 1,144,171 (278) | 1,354,267, 982,019 | 1,274,675, 902,427 | 1,170,123 (533), 797,875 (282) |

- **Chosen: t-airy**, the most open of the opaque ways: the frame's triangles 14.7% to 21.6% fewer than 8E's in every view (`woods-8f.js`'s frame,
  without the ground's depth pass, which the app draws again only when the eye moves; the census of section 18.7 counts the whole frame), the
  calls the same; more of the troops seen through the woods (from inside a wood 18.5% against 11.0%; close on Sokolnitz 90.8% against 85.9%); the
  fragments a pixel about 8E's (2.83 to 8.90 against 3.29 to 10.64). Its price: **the open crowns shimmer more** (1.91% of the woods' pixels
  against 1.39% in the pheasantry view, 2.47% against 1.74% close on Sokolnitz): the gaps are edges. t-lace was the most open, but its cards
  rasterise about twice the fragments a pixel (11.51 against 5.61) and add eight draw calls; decision 247 (a) asks that a transparency's costs be
  measured if one is introduced, and the opaque way meets the ask without one.
- **Built**: the four deciduous habits and the bush as 8E placed and shaped them (each crown 8E's icosahedron with its jitter, so that its
  envelope, and a wood's mass from afar, are 8E's), each crown a perforated twig shell (a seeded 42% of its faces kept, each shrunk to 0.70 toward
  its own centre; the bush 45% and 0.72) around a trunk forking into four limbs into the main crown and one into each lesser crown, each ending in
  two twigs toward the shell; drawn on both faces (the shell's inside shows through its gaps), opaque (nothing sorted, no alpha; its shadow its
  own shape). The triangles a tree: 348, 254, 348 and 254 for the four habits (8E's 560, 380, 560, 380), the bush 174 (360), the conifers 8E's own
  (62 and 41; their shares the build's, pending evidence); the trees by kind as 8E's (634 in the woods, 184 in the villages, 376 conifers, 354 at
  the woods' edges and 202 along the streams); the woods' boundaries and the cover classes untouched.
- **As built, measured again** (`woods-8f.js --protos "" --tag 8f` on 8F's build, `docs/stage8-evidence/8f/woods-8f-8f.json`): in each of the six
  views the prototype's triangles, calls, troops seen through and fragments a pixel exactly; 1,750 instances, none outside the drawn wood class or
  the model's; the shimmer 0.62% to 2.47% of the woods' pixels (the prototype's 0.66% to 2.47%: 8F's ground behind the crowns differs); on a low
  tier the Field vantage 529 calls and 1,274,675 triangles, the low Pratzen view 278 and 902,427 (8E's 1,516,419 and 1,144,171).
- **Its limit**: close to the eye (a low free view a few units from a crown: `pairs/ice-eye.jpg`, `pairs/ice-sun.jpg`; the eye-level vantage
  itself draws no woods, as at 1x) the shells read as separate facets rather than twigs; at the distances the views are taken from (the low views
  and above) they read as bare crowns, the troops and standards inside a wood seen through them (`pairs/woods-edge-low.jpg`).

### 18.5 The near ground (decision 247 (a); `world.js` `GDETAIL`, `GROUND_FRAG_DETAIL`, `atlasLum`, `groundDetail`)

- **What it draws**: near the eye, each ground texel scaled by a finer sample of its own cell of the atlas (each class its own texture, so no new
  class and no new colour): the sample's grey over the cell's mean grey (`atlasLum`: each cell's mean over its period, linear, made again when the
  photographs repaint the atlas), clamped to 0.62 to 1.38, mixed in at 0.55 at most; the sample 7.3 times finer than the coarse one and turned
  0.61 rad, so that its tiles fall neither on the coarse sample's nor on the grid's; full to 14 units from the eye, none from 60; in the ground's
  own co-ordinates (anchored: nothing swims as the eye moves; `clips/ground-pan-8e-8f.mp4`); WebGL 2's `textureGrad` with its own gradients (no
  mip seam where a tile wraps). The cover classes, the frost, the crop strips and the hollows are the shader's as before (they colour the class,
  not the texel), and so are the heights, the boundaries and the horizon.
- **Where**: the landscape's natural ground only (`uMode` 1): not the going layer, not the apron, not the paper map (whose ground has no texture,
  and whose eye is always beyond the detail's far edge). **Not on a low tier** (`groundDetail(!lowTier)`; decision 236: the phone's frame as P5
  measured it).
- **Its normalisation, corrected before commit**: three uploads the atlas's canvas flipped (`CanvasTexture`'s `flipY`, its default), so the
  shader's cell row cj (tuv's v from the texture's foot) is the canvas's row 2-cj; the first draft took each cell's mean from the canvas's cells
  as laid out, so the classes of the top and bottom rows were scaled by another cell's mean. `atlasLum` now takes them as the shader samples them,
  and the self-test reads each of the 12 cells through the GPU as the ground's shader reads it (each within 0.1% of the mean it uses; the copy
  normalised by the cells as laid out, `mutate-8f.js`'s `lumflip`, fails it).
- **Measured** (the self-test's check (e)): in the low Pratzen view (480 x 270) 7,335 to 7,343 pixels change with the detail on (three runs),
  their mean tone 1.000 of what it is without it; the Field vantage and the paper map identical on and off (0 pixels). Its cost: section 18.7.
- **Found in review, not changed**: the detail's gradients (`dFdx`, `dFdy` of its uv) are taken inside the branch that skips it beyond the fade
  (`gDf > 0.002`), which GLSL ES 3.00 leaves undefined where a 2 x 2 quad of fragments straddles the branch's edge. There the detail's weight is
  about 0.002, so a wrong mip level changes a texel by under 0.08% (under one level in 255): nothing visible depends on it. Taking the gradients
  above that branch (inside the uniform one) is a one-line change for a later build; it was found after this build's checks and evidence had run,
  and is recorded rather than built here.
- **Found on the way, not changed (2F's)**: the same flip means that the ground's shader shows for each cover cell k the grain painted for the
  canvas's cell (k mod 4, 2 - floor(k/4)): the patterns and photographs made for the open field, the meadow, the marsh and the water (cells 0 to
  3) are drawn on the plough, the pasture, the winter sowing and the trodden ground, and the other way round (the middle row, wood, village,
  vineyard and track, is its own) (`tools/stage8/atlas-8f.js`, `docs/stage8-evidence/8f/atlas-8f.jpg` and `.json`: for the six cells whose
  patterns differ, 0, 2, 3, 8, 10 and 11, the shader's sample correlates 0.03 to 0.29 with the canvas's own cell and 0.73 to 1.00 with the flipped
  one; the meadow's and the pasture's, 1 and 9, made alike, 0.74 to 0.75 with either; the middle row's the same either way). The cover classes'
  colours, frost and strips are not affected (they colour the class, not the texel); only which grain each class wears. It is 2F's drawing, so it
  is put to the owner (section 18.10), not changed here.

### 18.6 The checks, and each made to fail

- **The self-test's 8F block**, five checks after the 8E block (its own state kept and restored, its renders its own, into a target of the test's,
  without post-processing): (a) the water's presentations: on the landscape every water mesh drawn with 8F's material (the streams and banks in
  their landscape colours; the ice writing no depth; the shore band without a polygon offset and drawn after its ice), on the paper map with 8E's
  (every parameter of 8E's three materials made afresh, no shader hook of their own); (b) the water still: a view of the meres and the Goldbach,
  300 of the app's own frames on the test's clock with the clock standing (the view's easings arriving), drawn, 300 more, drawn again: the same
  pixels, each frame asked for so that anything the frames move would move; at rest no frame asked; (c) the meres' ice: the shore band drawn alone
  from above feathered at both edges (its light at the inner edge and at the shore at most a tenth of its peak), the rimed margin lighter than the
  clear middle, and in the frame at three clocks the shore band at most 1.10 times the field beside the shore and the rimed margin at most 1.25
  times (`ICE8F`: design bounds between 8E's 1.02 and 1.15-1.17 and the first draft's 1.20 and 1.26-1.28); (d) the woods: the trees and the scrub
  by kind as 8E drew them (`WOODS8E`), each habit's triangles within 8E's (`KIT8E`, read on 8E's build), the conifers 8E's own, the open crowns on
  both faces and casting shadows; (e) the near ground: drawn near the eye (the low Pratzen view: pixels differ with it on and off), its mean tone
  within 1% of the ground's without it, each cell's mean that of the cell the shader samples (read through the GPU), nothing beyond its far edge
  (the Field vantage identical on and off), none on the paper map, on at this tier (the self-test's page is never a low tier: that setting is
  `css-test.js`'s). The manifest 296 to 301.
- **`css-test.js`'s 8F block**: the water's colours in `WATER_COL` (8E's four kept for the paper map), `ICE`'s 4E values, the meres' outlines,
  levels and ring 4E's, the paper map's water 8E's materials, put in place before the opacity as before; the ice writing no depth, the band
  without an offset and after its ice; the hooks chaining the atmosphere's uniforms with programs of their own; nothing in the water read from a
  clock or a time, no hole cut, no presentation's branch; `TREE8F`'s values, the crowns opaque on both faces, 8E's crowns' jitter and the
  conifers; `GDETAIL`'s values, the detail on the natural ground alone, faded by the eye's distance, anchored to the ground's uv, its cell's grey
  ratio within the clamp (no new colour), inside the texture (none on the paper map), the cells' means as the shader samples them, off under
  lowTier; and the self-test's bounds (`ICE8F`, `WOODS8E`, `KIT8E`).
- **`runtime-test.js`** dry-runs the water's presentations (each water mesh its presentation's material both ways, the paper map's unhooked) and
  the near detail's setting at the tier; **`tools/stage2/height-sites.js`** classifies the block's aim as a test read.
- **Each made to fail** (`docs/stage8-evidence/8f/mutate-8f.json`, `mutate-css-8f.json`, `mutate-css-8e.json`): the self-test's 8F block passes on
  the build (5 of 5) and fails on each of 17 copies with one rule broken: the paper map's water drawn with the landscape's materials or its
  streams in the landscape's colour (`paperwater`, `paperstream`); the shore ice a hard ring, the margin as bright as Part A's prototype or as the
  first draft drew it (`hardring`, `brightrim`, `firstrim`); the band with a polygon offset, the ice writing its depth, the band sorted with its
  ice (`polyoffset`, `depthwrite`, `renderorder`); the streams' tone moved in every frame (`flow`); a wood thinned, a habit heavier than 8E's, the
  crowns one-sided (`treecount`, `treetris`, `treeside`); the near detail beyond its far edge, on the paper map, darkening the ground, normalised
  by the canvas's cells as laid out, never drawn (`detailfar`, `detailpaper`, `detailtone`, `lumflip`, `detailoff`). `css-test.js`'s 8F block
  passes on the source and fails on each of 27 copies (`mutate-css-8f.js`: the colours, the ring, a mere's level, the paper map's materials and
  their order in `setMode`, the depth, the offset, the order, the atmosphere's uniforms, a time, a hole, `TREE8F`, the faces, alpha, the jitter,
  the conifers, `GDETAIL`, the detail's presentation, fade, anchoring, tint, flip and tier, the self-test's bounds); its 8E block, with the
  prerequisites' rules, on each of 27 (`mutate-css-8e.js`), both run on this PR's final source. The prerequisites' own: section 18.1
  (`mutate-pre1.json`: the pause's three rules and four of 8E's, each failing the self-test's 8E block on prerequisite 1's build) and section 18.2
  (`mutate-pre2.json`, `mutate-pre2-count.json`). 8F's commit does not touch the 8E block's code, so its mutations were not run again on 8F's
  build; the whole self-test passes there (301 of 301).

### 18.7 Performance: the census against 8E, the frame's cost, the devices pending

- **The census** (`tools/stage8/census-8e.js <8E> <8F> --phone`, `docs/stage8-evidence/8f/census.json`, `census.md`: one whole frame per view
  after the eye moved, culled, every pass, the ground's depth drawn, reconciled with `renderer.info` in every frame; 8E's build against 8F's; the
  counts are what each build asks the GPU to draw, the same on any GPU at the same viewport):

  | view | whole frame, 8E → 8F (calls / triangles) | triangles | world pass (triangles) | shadow pass (triangles) |
  |---|---|---|---|---|
  | `overview-field` | 830 / 2.694 M → 830 / 2.314 M | **-14.1%** | 1.504 M → 1.263 M | 1.042 M → 904.1 k |
  | `overview-field-1x` | 197 / 385.1 k → 197 / 385.1 k | **+0.0%** | 238.0 k → 238.0 k | 0 → 0 |
  | `overview-field-10x` | 830 / 2.697 M → 830 / 2.317 M | **-14.1%** | 1.508 M → 1.266 M | 1.042 M → 904.1 k |
  | `overview-plan` | 830 / 2.673 M → 830 / 2.293 M | **-14.2%** | 1.483 M → 1.242 M | 1.042 M → 904.1 k |
  | `close-sokolnitz` | 692 / 2.628 M → 692 / 2.247 M | **-14.5%** | 1.384 M → 1.142 M | 1.096 M → 958.0 k |
  | `close-sokolnitz-1x` | 181 / 385.7 k → 181 / 385.7 k | **+0.0%** | 238.6 k → 238.6 k | 0 → 0 |
  | `close-sokolnitz-10x` | 615 / 2.525 M → 615 / 2.145 M | **-15.1%** | 1.281 M → 1.040 M | 1.096 M → 958.0 k |
  | `staff-paper` | 148 / 238.7 k → 148 / 238.7 k | **+0.0%** | 238.7 k → 238.7 k | 0 → 0 |
  | `pratzen-low` | 550 / 2.315 M → 550 / 1.935 M | **-16.4%** | 1.173 M → 931.0 k | 995.2 k → 856.9 k |
  | `selected-formation` | 687 / 2.625 M → 687 / 2.245 M | **-14.5%** | 1.365 M → 1.124 M | 1.112 M → 974.1 k |
  | `watch-selected` | 626 / 2.535 M → 626 / 2.155 M | **-15.0%** | 1.302 M → 1.060 M | 1.087 M → 948.3 k |
  | `hybrid-dimmed` | 635 / 2.565 M → 635 / 2.185 M | **-14.8%** | 1.333 M → 1.092 M | 1.085 M → 946.7 k |
  | `pratzen-low-1x` | 162 / 374.9 k → 162 / 374.9 k | **+0.0%** | 227.8 k → 227.8 k | 0 → 0 |
  | `pratzen-low-10x` | 581 / 2.383 M → 581 / 2.003 M | **-15.9%** | 1.163 M → 921.6 k | 1.073 M → 934.8 k |
  | `paper-north-up` | 156 / 240.9 k → 156 / 240.9 k | **+0.0%** | 240.9 k → 240.9 k | 0 → 0 |
  | `paper-close` | 103 / 203.4 k → 103 / 203.4 k | **+0.0%** | 203.4 k → 203.4 k | 0 → 0 |
  | `paper-drawer` | 110 / 226.5 k → 110 / 226.5 k | **+0.0%** | 226.5 k → 226.5 k | 0 → 0 |
  | `ph8-overview-study` | 811 / 2.663 M → 811 / 2.283 M | **-14.3%** | 1.480 M → 1.239 M | 1.036 M → 897.7 k |
  | `ph8-overview-watch` | 811 / 2.661 M → 811 / 2.281 M | **-14.3%** | 1.478 M → 1.236 M | 1.036 M → 897.7 k |
  | `ph8-overview-watch-1x` | 183 / 383.8 k → 183 / 383.8 k | **+0.0%** | 236.7 k → 236.7 k | 0 → 0 |
  | `ph8-overview-watch-10x` | 811 / 2.663 M → 811 / 2.283 M | **-14.3%** | 1.480 M → 1.238 M | 1.036 M → 897.7 k |
  | `eye-zuran` | 182 / 560.8 k → 182 / 560.8 k | **+0.0%** | 301.1 k → 301.1 k | 112.6 k → 112.6 k |
  | `eye-zuran-1x` | 129 / 374.2 k → 129 / 374.2 k | **+0.0%** | 227.1 k → 227.1 k | 0 → 0 |
  | `plans-overview` | 855 / 2.679 M → 855 / 2.299 M | **-14.2%** | 1.489 M → 1.248 M | 1.042 M → 904.1 k |
  | `paper-laptop` | 156 / 240.9 k → 156 / 240.9 k | **+0.0%** | 240.9 k → 240.9 k | 0 → 0 |
  | `narrow-1024` | 830 / 2.700 M → 830 / 2.320 M | **-14.1%** | 1.511 M → 1.269 M | 1.042 M → 904.1 k |
  | `phone:overview-plan` | 543 / 1.643 M → 543 / 1.401 M | **-14.7%** | 1.496 M → 1.254 M | 0 → 0 |
  | `phone:pratzen-low` | 224 / 1.215 M → 224 / 973.2 k | **-19.9%** | 1.068 M → 826.1 k | 0 → 0 |
  | `phone:ph8-overview-watch` | 527 / 1.638 M → 527 / 1.396 M | **-14.8%** | 1.491 M → 1.249 M | 0 → 0 |

  Every frame reconciled on both builds; **the draw calls the same in every view**. Wherever the woods are drawn (the landscape at 4x and 10.33x,
  Landscape with counters, the phone) the frame draws the same number of triangles fewer in every such view: **380,072 on the desktop** (241,744
  in the world pass and 138,328 in the shadow pass: the woods are never culled, so the saving is the whole woods' each frame), 14.1% to 16.4% of
  the frame, and 241,744 on the phone (no shadow pass there), 14.7% to 19.9% of its frame; at 1x, at the eye level and on the paper map, where no
  wood is drawn, every count the same. Every desktop view within section 8.3's budget (the most 2,320,381 triangles, `narrow-1024`, and 855 calls,
  `plans-overview`, against 2.8 million and 900). **The phone's two Overview views, over its triangle budget since 8D, are within it again**:
  1,401,041 and 1,396,137 triangles against 1.62 million (8E's 1,642,785 and 1,637,881); section 8.3's alternative for them (a phone run holding
  the heavy segments' long frames at or under 5%) is no longer what admits them, though the device run itself is still pending. The census's
  findings name 8E's two phone views alone; 8F has none.
- **The frame's cost** (`tools/stage8/cost-8f.js`, `docs/stage8-evidence/8f/cost-8f.json`; software WebGL, so where the work goes, not a device's
  frame time; each view on a fresh page as the harness opens it, the median of 15 frames after 3, the frame as the app draws it at rest, its
  ground's depth pass reused): in eight desktop views 8F's frame took 0.98 to 1.05 times 8E's; at the eye level 1.16 (no wood is drawn there, so
  this is the near detail: with it off 1.03). The near detail on against off: 0.95 to 1.07 in those views (the repeats' own spread is of that
  order; in the phase-8 Overview, whose eye is beyond the detail's fade, 1.07 is that noise) and 1.12 at the eye level, where most of the frame is
  ground near the eye; on the phone's low tier, which draws no detail, 8F's frame 1.00 and 1.01 times 8E's. The shimmer of the whole frame (its
  pixels whose grey changes by more than 24 of 255 when the eye moves half a pixel): where the woods are far or few, 8E's (0.41% to 2.26% against
  0.41% to 2.27%); where they fill the view, up (the pheasantry 1.45% to 2.10%, close on Sokolnitz 1.21% to 1.88%, the phone over the pheasantry
  1.86% to 2.55%); the near detail adds none (on and off the same in every view).
- **The CPU**: 8F adds no per-frame work in JavaScript: the water and the near detail are shaders with fixed uniforms (nothing written per frame;
  the near detail's uniform written once at start), the woods are geometry built once. Prerequisite 2's chords against 8E's
  (`docs/stage8-evidence/8f/contact/cost-chords-before.json`, `cost-chords-after.json`: `cost-8e.js` on prerequisite 1's build and on 8F's, back
  to back, alone): the animation's CPU a frame (gaitStep and the slopes, the larger of their counted and benched cost) 0.102 to 0.149 ms with
  prerequisite 2's chords against 0.110 to 0.167 ms with 8E's, in four views at half speed and 1x, the same 3,519 and 4,337 ground lookups a
  frame: within the budget of 0.2 ms, as 8E's were.
- **Render on demand kept**: no clock, time or animation in the water or the woods; the self-test's check (b) holds that a view at rest asks no
  frame.
- **lowTier kept** (decision 236): no near detail; the shadow and the density as before; the woods' triangles fewer than 8E's there too.
- **Device acceptance: pending** for 8E and 8F. No owner hardware was available to this session; software WebGL's timings decide nothing. The
  builds for the device route (`docs/STEP6_SPEC.md` §2, `tools/step6/perf-run.html`, `?src=` naming the build): 8E's (`git show
  94d6e46:austerlitz-command-map.html`) and 8F's (this PR's).

### 18.8 The captures and the clips

`tools/stage8/stills-8f.js --before <8E> --after <8F>` (`docs/stage8-evidence/8f/pairs/`, 8E on the left, 8F on the right, each tile captioned
with its build, clock and factor; each view on a page opened as the harness opens it, the same state on both):
- **the water**: the meres from above, obliquely and low at 15:00 (`ice-high`, `ice-mid`, `ice-low`), obliquely at 09:00 and 12:00 (the light
  through the day, `ice-mid-0900`, `ice-mid-1200`), at 1x and 10.33x (`ice-mid-1x`, `ice-mid-10x`), against the low sun from inside a wood at
  14:00 (`ice-sun`), near the ice's level at 15:00 (`ice-eye`, a low free view), and in Landscape with counters (`ice-hybrid`); the Goldbach from
  above and obliquely at noon (`goldbach-top`, `goldbach-noon`) and low in the valley fog at 08:20 (`stream-low`);
- **the woods**: the pheasantry at 4x, 1x and 10.33x at 08:20 (`woods-pheasantry`, `-1x`, `-10x`), through a wood's edge low with troops beyond at
  09:00 (`woods-edge-low`), close on Sokolnitz at 08:20, the Field vantage at 09:30 and the phase-8 Overview at 14:40 (the silhouettes from afar);
- **the near ground**: the low Pratzen view at 1x, 4x and 10.33x at 09:50, low toward the east at noon (`horizon-east`), the eye level at the
  Zuran at 08:30 (`eye-zuran`: the eye-level vantage draws no woods), low over the fields at noon (`fields-low`), and in Landscape with counters
  (`hybrid-low`);
- **a phone's screen** (390 x 844, a low tier: no shadow and no near detail) over the meres at 15:00 and over the pheasantry at 08:20
  (`phone-ice`, `phone-woods`).

And three clips (`docs/stage8-evidence/8f/clips/`, 8E above, 8F below, 10 frames a second, each frame drawn by the app, the clock standing): an
orbit at the pheasantry's edge (the crowns' openness and their shimmer), a dolly toward a grazing view over the Satschan mere (the ice and the
shore band), a slow pan low over the fields (the near detail anchored: nothing swims). The woods' prototypes in their six views:
`woods/<view>-<variant>.jpg` and the sheets `sheets/<view>-woods.jpg`; the atlas's cells as the shader samples them: `atlas-8f.jpg`; the contact's
worst cases close on both builds: `contact/*.jpg`; the pause: `clips/pause-8e-8f.mp4`.

### 18.9 What was run

Here: Chromium 153.0.8010.12 (the container's browser, `AUSTERLITZ_CHROME`; CI runs 141.0.7390.37, Playwright 1.56's headless shell, the browser
the motion block's counts are pinned to by decision 257 (b), which this container does not have), software WebGL, the container's CPU shared with
the runs beside it. On CI, GitHub's `ubuntu-latest` runners. On the commits named:

- **The prerequisites**, each on its own commit's build: `npm test` (all nine suites and the height guard) on each; the self-test's 8E block on
  each (11 of 11, `mutate-8e.js`'s `none8e`) and its mutations (sections 18.1 and 18.2), the reproductions and measures of sections 18.1 and 18.2.
  On CI every job passes (the checks job, `check:contrast` and `check:selftest`, 296 of 296 in CI's browser with the motion block within its
  limits): `5f59c10`, the push run 40613632865 and the pull request's 40613662156; `0c4ce62`, 40634640111 and 40634644072; `3a074c5`, 40639826754
  and 40639830432.
- **8F's build** (md5 `6ba949da17229530324add3c54dd94ff`, 2,607,535 bytes, `e618e5e`): `npm run build` writes it byte for byte; `npm test` (all
  nine suites and the height guard; "console.warn unique" 0); `check:data` (132 of 132 declarations identical to `archive/stage8e-f3c3f3af.html`);
  `check:chronology` (0 errors; the movement audit 0 findings; its open items as before 8F); `check:baseline`; `check:selftest`, here: the
  self-test 301 of 301 (1,269 s), every live block passing but the motion block, whose counts in this browser are 8E's own (jumps 240, pops 988,
  level-of-detail switches 130 and flickers 11 over the 16 motions on 8F's build and on 8E's, against CI's 245, 985, 130 and 10; 23 of its 24 runs
  identical on the two builds, `hybrid-glide` drawing 3 formation-frames more on 8F's: `docs/stage8-evidence/8f/selftest-local.json`,
  `motion-8e-chromium153.json`), so it is judged on CI's browser; `check-report.js --write-manifest` wrote the manifest (301 checks) from that
  run; the mutations of section 18.6 (the static ones again on the final source); the evidence of sections 18.3 to 18.8, each file naming its
  build.
- **On CI** (Chromium 141.0.7390.37), on `e618e5e`: the push run 40665825995, the pull request's 40665833860 and the dispatched 40665840278 (with
  `check:visual`): the checks job (the build written byte for byte, `npm test`, `check:data`, `check:chronology`), `check:contrast` (its start-up
  cases among them) and `check:selftest` (301 of 301 in CI's browser, the motion block within its limits) pass in each. On `cfa6a22` (the
  evidence; the build the same): the push run 40675861432 and the pull request's 40675878965 pass every job. The `check:selftest` step took 21 to
  43 minutes in the five runs (8E's 19 to 38), its job at most 44 of the 60 allowed; a slower runner may bring it near the limit (not changed:
  recorded). The dispatched run's `check:visual` passes, in 250 minutes (09:39 to 13:49 UTC; the job's limit 350; 8E's 169 to over 240): its 39
  cases, every census reconciled and every case's frame with culling its frame without it (0 pixels; the low Pratzen view's frame 17.5% fewer
  triangles with culling), the motion block's counts over its 16 motions 245, 985, 130 and 10 (8E's, exactly: the map layer in motion unchanged),
  the culling block's 15 runs (485 frames judged, 243 compared, 0 pixels differing), the self-test and every live block, and `STAGE0: all checks
  passed`. On `96fc022` (the records; the build the same): the push run 40687193681 and the pull request's 40687200421 pass every job.

### 18.10 What remains, for the owner's attention

- **Device acceptance: pending**, for 8E and for 8F (section 18.7). Prepared: 8E's build and 8F's, and the device route with its brackets.
- **For the owner's decision** (none blocks the build; each is drawn as recorded above):
  1. *The feet on the ground* (section 18.2): the cases the chords leave are kept open, each set with a proposed bound on its worst (2.5, 3.5 and
     3 times the tolerance) and its count held. Each foot's own profile meets the original tolerance at 4x but costs 0.22 to 0.35 ms a frame
     against the animation's budget of 0.2: the choice is to accept the chords with these bounds, to raise the budget for the profile, or to draw
     it only where a man is large on the screen (still over the budget in the closest views, 0.24 to 0.31 ms).
  2. *The wheeling block after a pause* (section 18.1): a block still turning toward its heading when the clock stops keeps turning at its arm's
     rate (`WHEEL`, real time). The formation model's, not the gait's; not changed.
  3. *The ground's grain on eight cover cells* (section 18.5): 2F's atlas is sampled flipped, so the open field, meadow, marsh and water wear the
     plough's, pasture's, winter sowing's and trodden ground's grain and the other way round (the trodden ground, for one, the water cell's pale
     streaks: `atlas-8f.jpg`'s last row). A small change of 2F's drawing (the atlas textures uploaded unflipped, or their rows laid out flipped);
     the classes' colours do not change. The near detail follows the flip either way.
  4. *The woods' open crowns*: they shimmer more than 8E's solid ones (1.93% of the woods' pixels against 1.39% in the pheasantry view, 2.47%
     against 1.74% close on Sokolnitz), and close to the eye (a low free view a few units from a crown) they read as separate facets
     (`pairs/ice-eye.jpg`). Shading the shells as one volume would calm both; not tried here.
  5. *The ice against a low sun*: at 15:00 the sun's glare on the clear ice spreads wider and whiter than 8E's sheen (`pairs/ice-mid.jpg`; from
     above and at the other clocks the measures of section 18.3). A rougher clear ice would narrow it, at the cost of the gloss the decision asks
     for; left as built.
- **Kept outside this PR**, as the brief asks, and still to come: 8G (buildings and landmarks, decision 248 (a): the evidence step first);
  decision 258 (b)'s counter placement in motion and decision 255 (d)'s far-label prototype (both commissioned with 8D, section 16.12, not begun);
  8H. Nothing of the map layer, the troops' models, their claims, the standards, the level of detail, culling or the shadow system changed, but
  where the prerequisites required (the gait's pause and its ground contact); the trees cast the shadows of their new crowns. Decision 245 (a)
  kept: no facings; the drivers and the artillery as 8E drew them.
- **Not measured**: a GPU's frame time (software WebGL here); Safari (no WebKit here); memory on a device.

## 19. Implementation PR 8G as built (29 October 2026; this record written in 8H, 30 October 2026)

**Status.** Built on `claude/great-pasteur-pi33mf` (PR #72, base `main` at `51d4a15`, PR #71's merge: implementation PR 8F), merged into `main`
by the owner on 29 October 2026 (`636cc5ddba6c146ecabff01e6d7c86738add0e4b`). It applied decision 248 (a) (section 0.3) after the two
prerequisites 8F handed on (section 18.10, items 3 and, from 8F's review, the near detail's gradients) and a third found on the way, each in a
commit of its own, then the data task and the buildings. **The PR's code was merged ahead of its record:** the commits, the code's comments, the
self-test's checks and the evidence README cited this section (19, 19.1, 19.2, 19.5) before it was written; implementation PR 8H wrote it from the
commits, CI's runs and reports, the committed evidence and measures made again on the exact builds (each named by its md5). What 8H reconstructed
is said to be so where it is cited (sections 19.6 and 19.7; `docs/stage8-evidence/8g/README.md`).

**In numbers.** The prerequisites: a block at rest drawn the same in every frame (between two frames with the clock standing, 247 to 294 objects'
matrices moved by up to 1.4e-7 units on 8F's build, 0 since); the ground's atlas mapped as painted (eight of the twelve cover cells had worn
another row's grain); the near detail's gradients taken outside its fade's branch. The data task: 76 readings of the texts and the stable
cadastre's sketches of 1825-1826 read on their page images, 32 claims checked a second time (11 corrected), `BUILDINGS` and `CHAPELS` added,
`APPEARANCE_SOURCES` and `CHURCHES` changed. The buildings: 177 farmsteads for the build's 179 houses (Satschan 5 of 7), 150 of them an L, 27
buildings at the back of the yards, 10 churches and chapels, the Sokolnitz castle and its farm, the Austerlitz château, Telnitz's churchyard
wall, fences round Telnitz and Sokolnitz (625 records); the self-test 302 to 313 checks, 313 of 313 on CI's browser; the frame +9 draw calls and
+31,740 triangles on every desktop landscape view (+1.5% to +1.8%), +5 and +23,010 on a phone's (+1.9% to +3.0%), nothing on the paper map, at
1x or at the eye level; `check:visual` on CI passing (its 39 cases, 208 minutes).

### 19.1 Prerequisites 0 and 1: a block at rest drawn the same in every frame; the ground's atlas mapped as painted (`1c427d1`, `f24d944`)

- **Prerequisite 0 (`1c427d1`; found while verifying prerequisite 1).** The self-test's gait check saw 2 pixels change between two frames four
  settles apart with the clock standing. `poseBlock` eased each block's shape, tilt and heading toward its target on every frame and stopped
  asking for frames within 0.002 of it, but eased on below that, about 1e-9 a frame. Measured by `tools/stage8/rest-8g.js` (two frames of the low
  Pratzen view, the camera fixed, every object's world matrix compared): on 8F's build 294, 256, 247 and 122 objects moved at 09:05, 10:40, 13:50
  and 15:05, by up to 1.4e-7 units; on the fix's build 0 at each (`docs/stage8-evidence/8g/rest-pre0.json`). Within the threshold each eased value
  now takes its target exactly; a loose body's sway eased on, taking its swayed heading exactly within 1e-6. `css-test.js`'s block "a block at
  rest" holds it; each of 8F's three easings put back fails it (`mutate-css-pre0.json`). The self-test 301 of 301 here
  (`selftest-pre0-local.json`, Chromium 153; its motion block failing in this browser as on 8F's build, pops 988 against CI's 985 and flickers 11
  against 10, its counts pinned to CI's browser). Build `27b54e45...`, 2,608,344 bytes.
- **Prerequisite 1 (`f24d944`; 8F's finding, section 18.10 item 3).** three uploads a canvas flipped (`CanvasTexture`'s `flipY`), so for cell k
  the shader drew the canvas's cell (k mod 4, 2 - floor(k/4)) upside down: eight of the twelve cells wore another row's grain (the open field, the
  meadow, the marsh and the water the plough's, the pasture's, the winter sowing's and the trodden ground's, and the reverse) in the colour atlas,
  the normal atlas and 8F's near detail. Both atlases are uploaded as painted; the photographs' normal maps (OpenGL's convention, green toward the
  image's top) are turned over as they are blended in, so the atlas has one convention; the water cell takes a photograph of its own (the mud),
  tinted so that the class keeps the tone the flip had shown for it (a design value: drawn correctly without one, its pale ripple read as a blue
  band beside every stream); `atlasLum` follows the upload. The self-test's new check (the manifest 301 to 302): each cell forced over the ground
  and read through the GPU straight down, for the atlases as the photographs repainted them and for the procedural ones painted afresh, against
  what each of the 12 cells would show the right way up or flipped in u, v or both (48 expectations), its own the nearest and every other at least
  half its difference further off; the normals' direction correlated with the painted slopes and the repainted normals integrable; every mutation
  of what it holds fails it (`tools/stage8/mutate-8g.js`, `mutate-pre1.json`); `css-test.js` holds the upload, the painters, the turned green and
  the debug outputs off as built. Measured (`tools/stage8/classtone-8g.js`, `classtone-pre1.json`, five views): every class's tone within about 2%
  but the winter sowing (6% to 15% lighter), the marsh (4% to 8% darker), the plough (2% to 3% darker) and the stubble (2% to 4% lighter), each now
  its own grain; the atlas through the GPU before and after (`tools/stage8/atlas-8g.js`, `atlas-8f.json`, `atlas-pre1.json` and their sheets); the
  paper map identical. The self-test 302 of 302 here (`selftest-pre1-local.json`). Build `1dbb7d85...`, 2,624,565 bytes.

### 19.2 Prerequisite 2: the near detail's gradients taken before its fade's branch (`bf97e9e`; 8F's review, section 18.5)

`GROUND_FRAG_DETAIL` took `dFdx` and `dFdy` inside the fade's test, which differs between the four fragments of a quad at the fade's far edge, and a
derivative taken there is undefined in GLSL. The coordinates and both gradients are now taken under the uniforms' test alone (the landscape's
mode, the detail on, the self-test's debug sample), the texture still sampled only where the fade is on, through `textureGrad` with those
gradients. `css-test.js` holds the order; each mutation fails it (`tools/stage8/mutate-css-8g.js`, `mutate-css-pre2.json`). Found and left,
harmless: the viewshed's `texture2D(uVS, ...)` inside a non-uniform test (one level, nearest filtering: no level of detail is chosen). Build
`6144b577...`, 2,625,059 bytes. No visible effect was expected; 8H's captures (section 19.7) compare the views where the detail is drawn, fades and
is not drawn.

### 19.3 The data task (`7e989a1`; decision 248 (a): "add supported landmarks after research and a documented data task")

The sources were read first, every quotation on its page image (`docs/stage8-evidence/8g/`): the texts' register `readings-texts.md` (76 entries
in seven sections, T1 to T7: Wolny's topography of the Brünn district, 1836-1837; Schwoy's of Moravia, 1793; Wolný's church topography of the
Brünn diocese, 1856-1861; what the stable cadastre's colours mean, the Instruction of 1824; the roofing, every statement found; the battle
accounts on the villages' edges and the landmarks; corrections to earlier registers), its negatives (`negatives.md`) and works (`sources.md`);
the cadastre's indication sketches of 1825-1826 for Sokolnitz, Telnitz, Pratzen and Kobelnitz with Puntowitz read at the Moravian Land Archive's
highest level (`readings-cadastre.md`, eleven crops in `cadastre/`); the landmarks' modern places in the map's frame (`places.md`); and a second
reader's check of every claim on its page image (`quote-check.md`: 32 claims, 21 right as drafted, 11 corrected, all applied).
`APPEARANCE_SOURCES` changed (eleven works added, every other entry byte-identical); `BUILDINGS` added (guarded: every value a claim with source,
locator, grade, label, quotation and a scope saying how it bears on 1805, or generic with its reason; the roofs and the counts generic; the
Sokolnitz castle's walled orchard disputed and not drawn; Telnitz's churchyard walled in the battle, attributed; `notDrawn`, what the sources
name and the map does not draw, each with its reason and the alternatives put to the owner); `CHURCHES` changed (Satschan and Menitz added;
Girzikowitz, Kobelnitz, Sokolnitz and Blasowitz removed, no church being named there in 1793, 1836-1837 or 1856-1861; Holubitz moved to
`CHAPELS`, added). `test.js` holds `BUILDINGS`, each rule made to fail (`tools/stage8/mutate-test-8g.js`, `mutate-test-data.json`).
`check:data`'s reference moved to the data task's build, `archive/stage8g-84fe987b.html` (against the step-5c/8E reference 130 data declarations
identical). The full list is `CHANGELOG.md`'s 8G entry. Build `84fe987b...`, 2,656,947 bytes.

### 19.4 The villages and the landmarks (`dddd4e4`; decision 248 (a))

- **The villages** (`world.js` `VILL8G`, `v8PlanAt`, `villagePlan8g`, `planBuildings8g`): laid out on the sketches' pattern, applied to 1805 as an
  inference (`BUILDINGS.plan`): each farmstead an L along the drawn roads through its village's place (then its streams' banks, then a lane), the
  long range back along the plot's northern boundary on most plots (`VILL8G.north` 0.85), a range along the street, a building at the back of the
  yard on the share its village's sketch gives (timber at Pratzen and Kobelnitz). The farmsteads' count is the build's symbol count (`VILLAGES`)
  but at Satschan, five of seven (its drawn place half under the drawn mere's ice, the Littawa across the rest, its church in it; the self-test's
  `FARMS8G` names the exception with its reason). Every building's centre in its village's place as the paper map draws it and its corners within
  the place's margin, clear of the drawn roads and streams (their ribbons as the landscape draws them), the meres' ice as drawn, the trees and each
  other, and off every other farmstead's plot (the first draft left 51 buildings on another's plot); each plot at the first size where it stands,
  smaller only in the tight spots; the plan seeded and made again the same to the last coordinate. As built: 177 farmsteads, 150 of them with
  their range along the street, 27 a long range alone where the street left no room for it (the dossiers said "each an L" of every village:
  corrected in 8H, section 20.3), 27 buildings at the back of the yards, 625 records; 372 of 372 buildings in their village's place; their centres
  on the ground's drawn village class 308 of 372 (83%; 0% at Sokolnitz, 5% at Telnitz and 19% at Kobelnitz, where the drawn class is the water's
  or the marsh's along the streams, 100% in eleven villages).
- **The roofs** a design convention (no source read names the villages' roofing): thatch, tile on about one farmstead in six (`BLD8G.tile` 0.17:
  32 of 153 village farmsteads as drawn), the town of Austerlitz tiled (Schwoy 1793), the manors and the churches tiled; a building's walls never
  choose its roof. The walls whitewashed on a darker plinth; the timber buildings boarded; the thatch textured.
- **The churches** where a source names one standing in 1805 (`CHURCHES`), in the build's silhouette, each at its village's point moved the least
  step that clears the drawn roads and streams through it (the build's stood on them, Telnitz's in the Goldbach); Holubitz's chapel at half a
  church's size; Austerlitz's church the temple the church topography of 1860 describes (six columns under a pediment, its tower no higher than its
  roof), its château by it within a quarter-turn of its bearing today (drawn at 323 degrees, the bearing today 236: corrected in 8H, section 20.3);
  the Sokolnitz castle the closed quadrangle of 1825 and 1837, its east range the deepest and two storeys, by the map's legacy place moved off the
  drawn brook, its farm south of it; 8F's ring of wall round the castle removed, no wall round its orchard (disputed) or its pheasantry (unread);
  Telnitz's churchyard walled with its gate (attributed); post-and-rail fences round Telnitz and Sokolnitz, their course a convention. Not drawn:
  St Anthony's chapel, the Santon's chapel, the Sokolnitz granary (`BUILDINGS.notDrawn`).
- **On the ground** at every factor (each building's floor and plinth from the drawn ground under its footprint, read exactly; the fences' and
  walls' runs sheared along the slope with plumb posts), laid again whenever the ground is rescaled; none at 1x, on the paper map or at the eye
  level. **The dossiers:** each village's and the town's names the claims its buildings rest on ("Buildings drawn here"); the sources sheet says
  how the villages are drawn, with every church's and the chapel's claim (ten villages have no dossier of their own) and each village drawn with
  fewer farmsteads than the map's symbol.

### 19.5 The geographic corrections proposed, not made (`places.md`)

No landmark was moved to its own place: decision 248 (a) asks that "any proposed geographic correction must be identified and reviewed as such".
`places.md` (a research reader's note of 28 October 2026, the landmarks' modern positions converted into the map's frame by `GEOREF`) proposed:
the Sokolnitz castle about 535 m north-west of the drawn one, across a drawn Goldbach that runs 0.3 to 0.5 km west of the stream there; the
pheasantry's enclosure 2.3 km north of the drawn wood (north of the castle, not south-east of the village); Pratzen's church about 400 m south of
the village's point, outside the village; the Posoritz post house 1,367 m south-east of its drawn place, on the old road, which the map draws up to
1.2 km north of its course east of the Santon; the château garden at Austerlitz west of the château, the drawn park 2 km south-east. The note's
companion files (`places.json`, `raw/`, the figures and the scripts) were not committed, so its numbers could not be reproduced from the
repository; 8H made the research inputs again where the network allowed and reviewed each proposal (section 20.6,
`docs/stage8-evidence/8h/geo/`).

### 19.6 The checks, and the frame's cost

- **The self-test** 302 to 313 checks (the manifest written from a passing run): at each factor the buildings on the drawn ground (each read as
  drawn: the plinth's foot below the lowest ground under it, the walls on their plinths, the runs' ends on the ground) and none at 1x; the 8G
  block: the farmsteads and the plan made again; every building in its village's place, the share on the drawn class reported; clear of the
  ribbons, the ice, the trees and each other; the plots; the presentations; the landmarks; the dossiers; the roofs. On CI (Chromium 141) 313 of 313,
  every live block passing (`docs/stage8-evidence/8g/selftest-ci-dddd4e4.json`, CI's own report, run 40870570661). `css-test.js`'s block "the
  buildings" (the values, what is read from the claims, the roofs, the walls, the plan seeded, the ground read exactly, the layers); `runtime-test.js`
  plans the buildings headless; the height guard classifies the new ground reads; the harness's census names the building meshes.
- **The frame's cost**, from CI's own `check:visual` reports, 8F's (run 40665840278, build `6ba949da...`) against 8G's (run 40870570661, build
  `508927e6...`), one frame as a visitor's page draws it in each of the 39 cases (`tools/stage8/census-8g.js`; written in 8H; `census-ci.json`,
  `census-ci.md` in `docs/stage8-evidence/8g/`): on every desktop landscape view +9 draw calls and +31,740 triangles (+1.46% to +1.79%), the
  buildings from 6 calls and 8,712 triangles to 17 and 42,420 (14,070 of them in the shadow pass); on the phones (low tier, no shadow) +5 calls and
  +23,010 triangles (+1.87% to +3.01%; 4,356 to 28,350); the paper map, 1x and the eye level unchanged (no building drawn). The largest desktop frame
  2,205,033 triangles (`narrow-1024`) and 862 draw calls (`plans-overview`), within section 8.3's 2.8 million and 900; the largest phone frame
  1,251,075 triangles, within its 1.62 million. The buildings' meshes are drawn whole in every landscape view (not culled: one instanced mesh a
  kind over the whole field).

### 19.7 The captures (reconstructed in 8H)

The README of `docs/stage8-evidence/8g/` cited `stills-pre1.json`, `stills-pre2.json` and their pairs, and `selftest-pre2-local.json`, which were
not committed, and no capture of the buildings was committed. 8H made them again with 8G's own tool (`tools/stage8/stills-8g.js`, unchanged) on the
exact builds, in this container's Chromium 153 and software WebGL, at 1600 x 900 (390 x 844 for the phone's view), each pair side by side with
the share of the frame whose grey changed by more than 8 of 255 (every page's programs linked, no page error):
- **Prerequisite 1** (`stills-pre1.json`, `pairs/pre1-*.jpg`, 8F's build against prerequisite 1's): the fields low and close 11.3% and 12.7% of
  the frame changed, the Goldbach at noon 14.0%, the Littawa's bank 13.1%, the marsh bottoms 6.9%, the going layer 6.4%, a phone's fields 5.4%,
  the low Pratzen view 2.1% and the Overview 1.3% (each cell now its own grain); the stream in the valley fog 0.1%; the paper map 0% (it draws no
  texture).
- **Prerequisite 2** (`stills-pre2.json`, `pairs/pre2-*.jpg`, prerequisite 1's against prerequisite 2's): 0% in all ten views, where the near
  detail is drawn, where it fades out and where it is not: no visible effect, as expected.
- **The buildings** (`stills-8g.json`, `pairs/8g-*.jpg`, prerequisite 2's against 8G's; the captures 8G's own README did not list): the
  villages close and low 6.8% to 18.8% of the frame (the Sokolnitz castle 18.8%, Austerlitz 15.8%, Sokolnitz at noon 14.8%, Pratzen close 12.3%,
  Telnitz 8.9% and 9.6%, Kobelnitz and Puntowitz 9.0%, a phone at Telnitz 8.2%), from afar 1.0% to 3.7% (the Overview, the low Pratzen view, the
  meres at Augezd), at 10.33x 1.8%; at 1x, on the paper map and at the eye level 0% (no building drawn there, as built).
CI's own captures of the same cases on 8F's and 8G's builds, from the two `check:visual` runs (not reconstructed), are `ci-pairs/` (seven
cases).

### 19.8 What was run

Here (the 8G session's container: Chromium 153.0.8010.12, software WebGL; CI runs 141.0.7390.37, Playwright 1.56's headless shell, the browser
the motion block's counts are pinned to): on each prerequisite's build `npm test` (all nine suites and the height guard) and the self-test (301
of 301, 302 of 302; `selftest-pre0-local.json`, `selftest-pre1-local.json`), the measures and mutations of sections 19.1 and 19.2; on the data
task's build `npm test` (the language scan 0 findings, one scope reworded); on 8G's build `npm test`, `check:data` (134 of 134 declarations
identical to `archive/stage8g-84fe987b.html`), `check:chronology` (0 errors) and the self-test, 313 of 313 (the motion block failing in this browser
exactly as on 8F's, character for character). On CI (`ubuntu-latest`, Chromium 141.0.7390.37), on `7e989a1` (the data task): the push run
40865614417 and the pull request's 40865656626 pass every job; on `dddd4e4` (8G): the push run 40870563554 (the checks job, `npm test` 5 min 22 s;
`check:contrast` 17 min 40 s; `check:selftest` 43 min 13 s), the pull request's 40870571183 and the dispatched 40870570661 (the checks job;
`check:contrast` 9 min 42 s; `check:selftest` 41 min 40 s, the self-test 313 of 313 in 1,716 s; `check:visual` 208 minutes, 12:07 to 15:35 UTC,
its 39 cases and every live block passing, no failure in its report) pass every job. 8G's build: `austerlitz-command-map.html` 2,740,873 bytes, md5
`508927e6f72e1b6f2f9186e954d61b59` (`check:baseline`).

### 19.9 What remained (found after the merge; taken up in 8H, section 20)

The audit of 8G (the brief for 8H) found three acceptance discrepancies in the buildings, each reproduced by 8H on the merged build: the
château drawn 86.5 degrees off its bearing today, accepted by the quarter-turn the planner and its check allowed; Satschan's five farmsteads of
seven, accepted by an explicit exception; the dossiers' "each an L" though 27 farmsteads are a long range alone. And the records: this section,
`docs/ROADMAP.md`, `CLAUDE.md` and the evidence index stopped at 8F or cited what did not exist. The geographic corrections of section 19.5 were
left for a review of their own.

## 20. Implementation PR 8H as built (30 October 2026): integration, polish and verification

**Status.** Built on `claude/sharp-faraday-g2uy8o` from `main` at `636cc5ddba6c146ecabff01e6d7c86738add0e4b` (PR #72's merge, 8G; recorded when the
work began on 29 October 2026, no newer commit on `main` then or when fetched again at 02:20 UTC on 30 October 2026); a draft pull request for review,
not merged. The brief: the final integration, polish and verification pass for Stage 8: an honest completion checklist; 8G's missing records; the
buildings' acceptance discrepancies; a focused review of the geographic corrections 8G proposed; the timing, pause and interface seams; the visual
work left open (the trees close up, the ice under a low sun, the troops' contact with the ground, decisions 258 (b) and 255 (d)); the audit's
maintenance findings G-2, P-3, P-4 and T-7; and the verification of the final build, with the device runs prepared. Each change in a commit of its
own: `f869d17` (the buildings' acceptance; a data task), `bab9f30` (S-7; the pose at a pause), `a22edd2` (the phase's message; A-6), `2f10a1f` (G-2,
P-3, P-4, T-7; a data task that changes no coordinate), `f08b58c` (the motion block's Play runs as measured; A-6 held by the self-test and on a
screenshot), `cde1a88` (8G's records; the geographic research made again, the proposal), `30f1ffe` (the crowns close up near the eye; the visual
prototypes measured), and the record's own commits after them (the self-test's manifest, the evidence, this section; among them `91434fd`, the
harness's `toast` block holding the message for its read, and `7b78265`, two faults of `mutate-8h.js` and the route runner's browser fixed).

**In numbers.** The château drawn at 255 degrees from its church (19 off its bearing today; 8G's 322.5, 86.5 off); the dossiers' farmsteads counted as
drawn (26 of 177 a long range alone); every village's plan identical to 8G's but Austerlitz's. 8G's Table A reproduced from 783 fresh responses;
seven geographic corrections proposed with their consequences, none made. A change of speed inside a dwell ending at the new speed's rate (4.965
of 5, against 37.8 then 5); a block's pose held at a pause (0 of 60 paused frames moving, against 60 of 60) and the clock's at a seek; the motion
block at 8G's counts on all 26 runs (245, 985, 130, 10; 33,159 of 46,492 formation-frames drawn). The phase's message over no control in 18 of 18
cases (8G: over the switch by up to 1,993 px, and over the Menu on every phone); a 2 px focus ring read off a screenshot; a main landmark; no
heading level skipped. 3,078,746 numbers of the geography unchanged by G-2. The crowns near the eye: the frame's half-pixel shimmer among them
10,616 to 7,663 pixels, the same triangles and calls. Decisions 258 (b) and 255 (d) prototyped and measured, not adopted. The self-test 313 to
316 checks; on CI `check:visual`'s 39 cases passing in 198 minutes and the frame's census as 8G's (the same draw calls in every case, 72
triangles fewer). The build `austerlitz-command-map.html` 2,772,772 bytes, md5 `9fa50cb46a085ab4ea8f932cd405f1e8`.

### 20.1 The completion checklist

Every requirement of the brief, every acceptance exception open at 8G's merge and every open audit finding 8H was given. "Before" is 8G's
build (md5 `508927e6...`) unless said; the statuses: **fixed** (changed and verified here, with a check able to fail where practical), **kept**
(no change, by an owner decision or a measured reason), **open: defect**, **open: owner** (a decision only the owner can take; the question is
in section 20.14), **pending: device** (only the owner's hardware can measure it). Nothing is marked fixed because a test was given an
exception. The working copy is `docs/stage8-evidence/8h/checklist.md`.

| # | item | before 8H | intended | 8H | evidence | status |
|---|---|---|---|---|---|---|
| 1 | 8G's records (spec section 19, roadmap, changelog, evidence index) | section 19 cited (README, commits, code comments) but never written; roadmap and CLAUDE.md stopped at 8F; the evidence README cited files 8G did not commit | the record of 8G as built, its evidence reproducible, what is reconstructed said | section 19 written; the evidence README says what is original, what was added from CI's runs (the self-test report, the census, CI's captures) and what is reconstructed (the stills, made with 8G's own tool); roadmap, CLAUDE.md, evidence index | `docs/stage8-evidence/8g/README.md`; section 19 | fixed (but `selftest-pre2-local.json`: not reconstructed, said so) |
| 2 | the château's bearing from its church | 322.5 degrees, 86.5 off the surveyed 236 (the planner's and the check's tolerance 90) | within a source-grounded tolerance, clear of roads, streams and yards | an octant (22.5), its centre in the town's place, no drawn road or stream between; the church the least move leaving it room | `buildings-8h.js`, `plan-8h.js`; self-test 8G (e); `mutate-8h.js`, `mutate-css-8h.js` | fixed (255 degrees, 19 off) |
| 3 | Satschan's farmsteads | 5 of 7, an explicit exception (`FARMS8G`) | 7 within the approved constraints, or a proposal | no lane, size or church place gives 7 within the constraints (204 lanes, every size, 24 church places); a smaller size would (2 of 7 an L), a looser margin 6 | `buildings-8h.js`; section 20.3 | open: owner (261) |
| 4 | "each an L" in the dossiers | said of every village; 27 of 177 farmsteads a long range alone | the words what is drawn | counted per village (`farmsteadsText`); the sources sheet states 26 of 177 | self-test 8G (e'), recounted from the drawn records; `mutate-8h.js` eachL | fixed |
| 5 | the villages' ground | per village as 8G: 308 of 372 buildings on the drawn village class (0% at Sokolnitz, 5% at Telnitz, 19% at Kobelnitz, 74% at Puntowitz, where the drawn class is the water's or the marsh's along the streams; section 19.4), 372 of 372 in their village's place | kept or improved per village | every village's plan identical to 8G's but Austerlitz's, its 61 buildings all on the drawn village class (as 8G's); 308 of 372 and 372 of 372 again | `buildings-8h.json` coverage, 8G against the final, village by village | kept (no village's share lowered; raising the four would change the land cover, a data question) |
| 6 | the geographic review (pheasantry, castle, Goldbach, post house, highway, Pratzen church, Austerlitz park) | proposed in 8G, not reproducible (its inputs never committed), not reviewed | identity, date, conversion and 1805 relevance verified; a separate proposal with its consequences | research made again from fresh fetches (Table A reproduced; the frame sound; the 1825-52 maps read); verdicts per facet; proposal with consequences; nothing changed | `docs/stage8-evidence/8h/geo/` | open: owner (259, 260) |
| 7 | S-7: a change of speed in a dwell | the ease kept the old speed: left the dwell at 37.8 clock min/s, then 5 | the remaining ease at the new speed | the ease rescaled by the speeds' ratio | `s7-8h.js` | fixed (4.965 at the end) |
| 8 | S-7: a relief change during a glide | Follow idle under Play (`_tw.cam` left set) | Follow follows | `stopTweens` clears both slots | `s7-8h.js` | fixed |
| 9 | S-7: the knowledge rule against the eased fog | not re-measured since the audit's 5-minute sample | the historical rule kept; the difference explained | every minute 08:00-10:00, both readings: 0 differences | `s7-8h.js` | kept (explained) |
| 10 | a block wheeling on after Pause (8F's finding) | 60 of 60 paused frames moved, 1.18 rad; one clock by two paths 1.15 rad apart | the pose held paused; a seek the clock's; resume on from the held pose | eases only while Play advances the clock; a seek or a first pose the clock's | `pose-8h.js`; self-test (l); `mutate-8h.js`, `mutate-css-8h.js` | fixed |
| 11 | the motion block (decision 257 (b)) on 8H's build | 245, 985, 130, 10 on 8G's build | the same counts and visibility | the Play runs' pre frames drawn by the driver (their passes' phase as measured): all 26 runs 8G's | `motion-8h.js` on Chromium 141 | fixed (no limit changed) |
| 12 | the phase's message under the switch (section 9.6) | 1,685-1,993 px over the switch at the desktop sizes in Study; over "Begin the opening"; over the Menu on every phone | 0 at every harness size, 08:45's message | placed below any shown control it would cross, within the top half; the harness's block holds the message for its read (`91434fd`, after CI read it hidden once on a slow runner) | `toast-8h.js`; the harness's live block `toast` (CI: 18 of 18) | fixed (0 px in 18 of 18) |
| 13 | A-6: the focus ring, a main landmark, the heading levels | a 1 px ring; no `main`; "What changed" h4 under h2; the Plans tab's h3 under h1 | 2 px; a main landmark; no skipped level | 2 px ring; `main` round the map layer; the timeline a region; levels corrected | self-test "A-6 (8H)"; the live block `ring` (a screenshot after real Tabs: 2 px; 8G 1 px); `mutate-8h.js` | fixed |
| 14 | keyboard, focus return, touch, reduced motion | verified by the harness's real-input blocks | verified on the final build by real input | the blocks run on the final build | `check:selftest` (section 20.11) | fixed (verified) |
| 15 | the trees close up (8F item 4) | shimmer 1.93% (pheasantry), 2.47% close on Sokolnitz; separate shards close to the eye | measured prototypes, the gains kept | volume shading measured (no effect, not adopted); the crowns closing near the eye built (the same triangles and calls, CI's census): among the crowns the frame's half-pixel changes 10,616 to 7,663, from afar identical; its cost not distinguishable in software WebGL (the device route's) | `woods-8f.js --module woods8h`, `near-8h.js`; self-test (d'); `mutate-8h.js`, `mutate-css-8h.js` | fixed (a crown within a few units still shows large facets: open, recorded) |
| 16 | the ice under a low sun (8F item 5) | glare wider and whiter at 15:00 | within the ice rules | roughness and the grazing sky term measured; the oblique look unchanged by either | `ice-8h.js` | open: owner (264), kept |
| 17 | troop-ground contact (8F item 1) | the cases kept open, bounded; the profile option over budget | the exceptions against the original criteria; the full cost of a correction | re-measured on 8H's build (8G's identical): the chords leave 8F's cases (the men's drawn soles 36 and 35 poses beyond at 4x); 8F's profile option meets the criterion at the planted edges at 0.21-0.36 ms a frame on every block, 0.11-0.26 ms where a man is drawn 48 px or more (the budget 0.2 ms, not raised); nothing changed | `contact-8f.js`, `cost-8e.js`; section 20.10 | open: owner (265) |
| 18 | decision 258 (b): places near a counter's anchor | commissioned, not built | built and measured against 257's baselines | prototyped, measured: more drawn, jumps over the ceiling | `motion-8h.js --proto` | open: owner (262), not adopted |
| 19 | decision 255 (d): far battle information | commissioned, not built | a prototype with contrast, size and performance | prototyped, measured: a lighter plate at AA; a dimmer ink below AA | `far-8h.js` | open: owner (263), not adopted |
| 20 | G-2: the map-to-world factor typed outside `geo.js` | `W`'s 0.5 and origin, `regionalH`'s inverse, `SUN_DAY`, a theme's length, the atmosphere's first uniforms | one authority, no coordinate changed | `GEOREF.MAP_PER_WORLD` and `WORLD_ORIGIN` read everywhere | `g2-8h.js` (3,078,746 numbers, 0 differ); `geo-test.js`; `mutate-css-8h.js` | fixed |
| 21 | P-3: idle work per animation frame | `syncFollow`, `paintDevStats` each frame | idle work avoided | each touches the document only on a change | code; self-test (render on demand) | fixed |
| 22 | P-4: the start and the relief grid's cost | recorded in 2E (+0.45 s), never re-measured | measured, repeated | phases timed in the build (`BOOTMS`, `WORLDMS`); seven loads of each build interleaved: the first frame 15.2 s (8G 14.9 s; software WebGL), init 4.88 s, the relief grid 71 ms cold and 52 ms warm, the ground 3.19 s | `startup-8h.js` | fixed (measured; nothing to cut on software timings) |
| 23 | T-7: wall-clock thresholds | the pan budget judged on the mean | medians and 95th percentiles | the pan's median judged, p95 and mean reported | self-test | fixed |
| 24 | decision 140 (the self-test kept in the file) | kept | kept | kept | | kept |
| 25 | device acceptance (8E-8H): desktop, iPhone, an integrated-GPU laptop; the effects-off bracket | never run on 8E-8G | the routes run on the final build | builds, protocol and routes prepared (section 20.12); the phone route, the effects bracket and the desktop route run end to end here on the final build, no console warning or error, their largest frames within the budgets (software WebGL: their times decide nothing) | section 20.12; `route-*-local.json` | pending: device |
| 26 | 8E: the drivers on the guns on the heights (an inference); gunners beside moving pieces; facings (245) | for the owner | unchanged unless decided | unchanged | section 17 | open: owner (carried) |
| 27 | 8G: St Anthony's chapel, the Santon's chapel, the granary not drawn (`BUILDINGS.notDrawn`) | alternatives put to the owner | unchanged unless decided | unchanged | section 19.4 | open: owner (carried) |

### 20.2 8G's records

Section 19 (8G as built) was cited by 8G's commits, code comments, self-test checks and evidence README but never written; `docs/ROADMAP.md`
and `CLAUDE.md` stopped at 8F; the evidence README cited files 8G did not commit. Written in 8H from the commits, CI's own runs and reports
(downloaded: the self-test's report and `check:visual`'s report and captures of 8G's commit, run 40870570661, and of 8F's, run 40665840278)
and measures made again on the exact builds (each named by its md5): section 19; `docs/stage8-evidence/8g/README.md` saying what is original,
what was added from CI's runs (`selftest-ci-dddd4e4.json`, `census-ci.json` and `.md`, `ci-pairs/`) and what is reconstructed (`stills-pre1.json`,
`stills-pre2.json`, `stills-8g.json` and `pairs/`, made with 8G's own tool, unchanged, here); `places.md` noting that its companion files were
never committed and pointing to the research made again (section 20.6); the roadmap, `CLAUDE.md` and the evidence index. Not reconstructed:
`selftest-pre2-local.json` (an intermediate run; 8G's own build passed 313 of 313 on CI).

### 20.3 The buildings' acceptance (commit `f869d17`; a data task)

- **The château's bearing.** On 8G's build the Austerlitz château stood at 322.5 degrees from its church, 86.5 degrees off the bearing its own
  place has from the church today (236 degrees, west-south-west; places.md, reproduced in section 20.6: 144 m at 236 degrees), admitted by 8G's
  quarter-turn (90 degrees) in the planner and in its check. A tolerance must mean something the sources can say: they name the relation in
  words (a garden "an den w." of the château, Wolny 1836) and today's centroids give it within a few degrees, so the bearing is held to an octant
  (22.5 degrees, `BLD8G.chateau.tol`); the distance stays a convention (the symbols at the building scale cannot stand 143 m apart). The planner
  now seeks the château within the octant, its centre in the town's drawn place and no drawn road or stream between it and its church, and the
  town's church takes the least move, among its clear places within 5 units (the self-test's limit for a church), that leaves the château such a
  place. Drawn now at 255 degrees (19 off), 379 m from the church as before; the church 4.75 units (300 m) from the town's point (8G: 2.5 units),
  which brings it within 60 m of its own place (a consequence, not the rule's aim). `tools/stage8/buildings-8h.js`, `plan-8h.js`; the
  self-test's 8G check (e) holds the octant, the place and nothing between; `css-test.js` the value and the rule; `appearance.js`'s scope text
  changed to say what is drawn (the data task: `BUILDINGS` changed, one string; `check:data`'s reference moved).
- **Satschan's farmsteads (open: owner, question 261).** 5 of the build's 7, an explicit exception (`FARMS8G`). With the drawn mere's ice over
  half its place, the Littawa across the rest and its church in it, no lane, plot size or church place the planner can try holds seven (204 lanes
  more, every size, 24 church places tried: five, `buildings-8h.js`). A fourth, smaller farmstead size would draw seven (two of them an L); a looser
  place margin six. Each changes a convention for one village's count; the cause is the drawn mere's outline (decision 27). Not changed.
- **"Each an L".** 27 of 8G's 177 farmsteads were a long range alone (26 of 177 now: Austerlitz's are all an L since the church moved), yet every
  village's dossier said "each an L". The dossiers now count what is drawn (`farmsteadsText`: "each an L" only where every one is); the sources
  sheet states the long ranges drawn alone; the self-test's check (e') recounts the words from the drawn records.
- **The villages' ground.** Every village's plan identical to 8G's record for record but Austerlitz's, whose 61 buildings all stand on the drawn
  village class, as on 8G's (`buildings-8h.js`'s coverage table, per village, 8G against the final: no village's share lowered). Over all, 308 of
  372 buildings on the drawn village class on both builds and 372 of 372 in their village's place; the shortfall is 8G's (section 19.4: 0% at
  Sokolnitz, 5% at Telnitz, 19% at Kobelnitz and 74% at Puntowitz, where the drawn class is the water's or the marsh's along the streams), not
  raised here: raising it would change the land cover, a data question. No building on the ice.

### 20.4 Timing and the pause (commits `bab9f30`, `f08b58c`)

- **S-7, a change of speed inside a dwell.** The ease kept the speed it was entered at: from 4x to 1/2x a third of the way into the ease in, out
  or during the hold, the clock eased on at 4x's pace and left the dwell at 37.8 clock minutes a second, then dropped to 1/2x's 5. `dwellAdvance`
  now scales the ease's remaining time by the speeds' ratio (its fraction and distance kept): the rate changes by the ratio at the change, and every
  ease ends at the new speed's rate (4.965 of 5; `tools/stage8/s7-8h.js`, `s7-8g.json`, `s7-8h.json`).
- **S-7, a relief change during a glide.** `redrawGround` stopped the tween but left the camera's slot set, so Follow stayed idle under Play until
  the next phase boundary (the target moved 0 in a second of play). `stopTweens` clears both slots; the camera stays where the glide stopped,
  Follow follows (18.2 units in a second).
- **S-7, the knowledge rule against the eased fog.** Kept: decision 92 reads the knowledge at the phase's record of the mist; the drawn fog's
  twenty-minute ease is a presentation. Measured every minute 08:00-10:00 for both headquarters: no formation's reading would differ were the
  rule taken on the drawn fog's eased amount (0 of 242 minutes). The distinction (the historical rule against the drawing) is stated, not hidden.
- **A block wheeling on after a pause** (8F's finding, section 18.10 item 2; the brief's "WHEEL after Pause"). `poseBlock` eased each block's
  heading (`WHEEL`), shape, standards' dip and a broken body's sway in real time whatever the clock did: on 8G's build 60 of 60 paused frames moved
  (Vandamme's division turned 1.18 rad with the clock standing; up to 2.73 rad across the blocks), and one clock reached by two paths showed two
  poses 1.15 rad apart. The eases now run only while Play advances the clock; with the clock standing (paused, a dwell's hold) the whole pose is
  held; a seek (8F's `GAIT.seek`) or a block's first pose shows that clock's pose at once; Resume turns on from the held pose (`tools/stage8/
  pose-8h.js`: 0 of 60 paused frames move, the two paths identical, every block at its own heading in the first frame after a seek, the held
  block turning on when resumed). 8G's exact rest (prerequisite 0, section 19.1) kept inside the eases; render on demand: a broken body's sway is
  part of the held pose, no longer drift (`ambientNow`). The self-test's check (l) holds it through the app's own loop with Play, Pause and the
  ten-minute step by their buttons; 8F's check (k) judges every paused frame; `css-test.js`'s "a block at rest" holds the hold, the seek and 8G's
  exact rest. A dwell state set by other means without its speed (the self-test's) is taken as entered at the current speed.
- **The motion block (decision 257 (b)) at its own counts.** On CI's browser 8H's pose held at a seek changed two runs: the paper map's Play (4
  jumps, 29 pops, 1,564 formation-frames drawn, where 8G's build measures 5, 30, 1,570) and the same under the Allied reading (1,178 against 1,180),
  which `MOTION.VIS`'s "drawn at least" would fail. Bisected (the four 8H commits' builds, Chromium 141): from `bab9f30`. Its cause, measured
  (`motion-8h.js --frames`, `docs/stage8-evidence/8h/motion/frames-*.log`): a Play run seeks its own clock before its eight frames at rest; on 8G's
  build the blocks went on easing after the seek and kept all eight drawn, each laying the map layer out; on 8H's render on demand draws the two
  the driver asks for, so the layer's re-placement passes (every 333 ms while moving, MLS) fall six frames earlier in the Play. The landscape's two
  Play runs draw all eight on both builds (Follow keeps them drawn), every other run two on both. With the eight drawn (`--frames --pre-all`),
  8H's build gives 8G's counts exactly. The driver (`tools/visual/motion.js`) now asks for a Play run's pre frames, so they are drawn on any build
  as the baselines were measured: on 8H's build every one of the 26 runs gives 8G's counts and visibility (245, 985, 130, 10; 33,159 of 46,492
  formation-frames drawn; `motion-8h-driver.json` against `motion-8g.json`). No limit changed; the layer itself is unchanged.

### 20.5 The interface (commits `a22edd2`, `f08b58c`)

- **The phase's message over the presentation switch** (section 9.6). Measured on 8G's build at the nine sizes the harness measures, in Study
  and Watch, by a real PageDown from 08:40 to 08:45's message (`tools/stage8/toast-8h.js`): over the switch by 1,685 px at 1600 x 900, 1366 x 768
  and 1280 x 720 in Study, by 1,993 px at 1024 x 768 and at 844 x 390 (where it also covered "Begin the opening", 483 px, and "Guided tour"); on
  every phone pushed against the right edge by half the rail's width and wrapped into a 102 px column over the Menu button (1,175 to 1,680 px). Now
  centred over the free area (the window's, but where the rail is docked and shown), its own width within the screen, and placed below any shown
  control its box would cross, within the screen's top half (`placeToast`): 0 px over the switch and over every control in all 18 cases. A live
  block of the harness, `toast`, judged by `checkLive` in `check:selftest` and `check:visual` (the 18 cases, 0 px, 08:45's message). The block
  holds the message for its read (`91434fd`): CI's run on `ac2067a` read it hidden in one case of 18 (844 x 390, Watch), the frame after the
  PageDown having taken longer on a slow runner than the message's 3.4 s; reproduced here with the main thread stalled 4 s after the key (the
  block as it was reads it hidden, as it is reads it shown at its place), it wraps the app's flash() for its own duration so that the hiding
  timer is cleared as the message shows, as `tools/stage8/toast-8h.js` holds it.
- **A-6** (`docs/FINAL_AUDIT.md`). The focus ring 2 px (1 px until 8H: WCAG 2.4.7 met, under 2.4.13's 2 px) in the theme's accent; the map layer's
  group in the page's one `main` landmark (its place in the tab order unchanged); the timeline a named region; the heading levels: the Now tab's
  "What changed" an `h3` under the dispatch's `h2` (it was an `h4`), the Plans tab's heads `h2` and `h3` under the rail's `h1` (`h3` and `h4`), an
  Analysis theme's title an `h2` (an `h3`), each keeping its look by its own rule. Held twice: the self-test's check "A-6 (8H)" (the landmark, the
  region, no level skipped in eight states a visitor reads headings in, the ring on a focused control or its rule) and the harness's live block
  `ring`, which reaches Play by real Tab presses from the page's start and reads the ring off a screenshot (2 px on each side here; 8G's build 1 px).
- **Keyboard, focus return, touch and reduced motion,** verified by the harness's real-input blocks on the final build, not by a style: the
  shortcuts (real keys: the "?" button, Tab to the switch, Space, Esc and focus back), the narrow layout by real resizes and clicks, the phone
  layout by taps, the tips by mouse, keys and taps, the reduced-motion preference turned on and off on the open page, the slider and an event
  marker by real keys, the first-run card's keys and wheel, the motion block's finger pan (section 20.11).

### 20.6 The geographic review (no correction made; questions 259 and 260)

`docs/stage8-evidence/8h/geo/` (its `README.md`, `proposal.md`, `consequences.js` and `.json`). 8G's `places.md` proposed five corrections and
could not be reproduced (its companion files were never committed). 8H made the research again from fresh fetches, every request's response
kept with its URL, status and hash (783 responses; `fetch-places.js`, `raw/manifest.json`), and read the period maps 8G's note left unchecked:
- **Reproduced:** all 28 modern positions of Table A to 0.1 m; 27 offsets to the metre and the degree (the 28th 110.6 m, rounded 110 here, 111
  there). **The frame** (`GEOREF`): sound, no correction proposed (round trips exact; distances 0.07-0.29% short of the ellipsoid's, bearings
  within 0.11° over 136 village pairs; one finding recorded: every `GT` village point lies 13.5 m north-east of the Czech survey's definition
  point, a shift inside the register the frame was fitted to, below the map's unit of 31.6 m).
- **The period maps reached:** the stable cadastre's sketches of 1825-26 (Sokolnitz georeferenced: three checks 0.8-1.2 km from its control
  points hold to 7-15 m), the Second Military Survey (1836-52; its west sheet missing from the service), the Third's special map. **Not reached:**
  the First Military Survey (the only map at this scale before 1805), the imperial obligatory imprints (a token), mapire.eu (HTTP 403). So every
  "site in 1805" below is the 1825-52 site carried back by inference (C), supported where noted by texts of 1793-1844 (B).
- **Verdicts** (each facet apart: identity, site in 1805, appearance, woodland boundary, road alignment): the pheasantry north of the castle in
  1825 (B; 1805 C), its 1825 wood 0.247 km², not today's woodland (which lies 170-490 m further north, over 1825 meadow and strip fields); the castle
  on today's site in 1825 (B) and by the texts in 1805 (B), 535 m from the drawn one; the Goldbach east of the castle in 1825 within about 10 m of
  today's channel (B), 316-515 m east of the drawn brook; the post house at Kovalovice No. 109 in 1826 and 1836-52 (B), 1,367 m from its drawn
  place, outside the "about 1 km" the dataset states; the highway east of the Santon on II/430's line in 1826-52 (B), the drawn road 0.2-1.2 km north
  of it; the Austerlitz garden west of the château (B), the drawn park 1.6 km south-east; Pratzen's church outside the village (A for 1793), 399 m
  from the drawn one.
- **Consequences traced** (`consequences.js` from the repository's own declarations): the Sokolnitz group (castle, pheasantry, brook) and the two
  small ones (the Austerlitz garden, the Pratzen church) move no anchor; with the brook corrected, the village point, Legrand's four positions at
  Sokolnitz, the French plan's route, two events and four overlay points, all east of the drawn brook today, come to lie west of it, as in 1825
  (one act, Legrand@7's "presses east across the stream", would stand 15 m from the new bed); eight anchors that stand inside the drawn "pheasantry"
  today (the fight for Telnitz) would not. The highway and the post house are substantial: eleven anchors of Suchet's division and Bagration's
  Advance Guard stand on the drawn road (0-21 m), both plans' road columns with them, and the correction pass's own record ("Holubitz now lies 1.7
  km south of it") would be superseded: **this contradicts an established project decision**, stated here and not changed.
- **Proposed** (`proposal.md`): one geographic data task for the Sokolnitz group and the two small ones (question 259), and a second, its own pull
  request, for the road, the post house and the eleven anchors re-plotted from their sources (question 260). Nothing implemented: each changes a
  declaration `check:data` guards, which only a task explicitly about geographic data may change; separating the substantial correction into its
  own pull request is what the brief asked.

### 20.7 Maintenance (commit `2f10a1f`; a data task that changes no coordinate)

- **G-2, the map-to-world factor typed outside `geo.js`.** `GEOREF` exports `MAP_PER_WORLD` (2, its own value, unexported until now) and
  `WORLD_ORIGIN` ([340, 250], frozen); `W`, `regionalH`'s inverse and `SUN_DAY` read them where each typed them; a theme's length is
  `len*KM_PER_MAP`; the atmosphere's first uniforms take `DISPLAY.defaultFactor`, `GEOREF.DATUM_M`, `GEOREF.M_PER_WORLD` and `ATMO.FOG_TOP` (they
  typed 4, 243.1, 63.2 and 238.2). No coordinate changed, shown: `tools/stage8/g2-8h.js` compares 3,078,746 numbers with `===` (`W` over every
  map point the data and the ground truth name and a grid, the relief functions over a grid, every land-cover and relief array, the sun's place,
  the transform) between `636cc5d` and the working tree: 0 differ. `geo-test.js` holds the single authority (four checks). `check:data`'s
  reference moved (`GEOREF`, `W`, `regionalH`, `SUN_DAY` changed: each a reading of the same numbers).
- **P-3, idle work per animation frame.** `syncFollow` (eight buttons' attributes read in every frame, idle ones too) touches the document only when
  Follow or the vantage changed; the developer readout, off and hidden, reads and writes nothing in a frame. Render on demand unchanged.
- **P-4, the start's cost.** The start's phases timed in the build (`BOOTMS`, `WORLDMS`, the first frame) and measured over repeated loads, medians
  and 95th percentiles (`tools/stage8/startup-8h.js`, `docs/stage8-evidence/8h/startup-8h.json`: seven loads of each build, interleaved, on a fresh
  page as a visitor's, software WebGL, 1600 x 900, the machine otherwise idle). The first frame at 15.2 s on 8H's build (p95 15.9 s) and 14.9 s on
  8G's (p95 19.0 s: two loads of seven slower), the same within the loads' spread. On 8H's build init begins about 0.25 s after the page's start and
  lasts 4.88 s: the renderer 0.12 s, the world 4.53 s (the land cover's grid 91 ms; the relief grid 71 ms, 2E's "+0.45 s", made again warm 52 ms on
  both builds; the cover's multi-level grid 456 ms; the ground's geometry 275 ms; the ground's mesh, material and atlases 3.19 s; the water, the roads
  and the woods under 30 ms each; the settlements, 8G's planner, 233 ms; the rest 152 ms), then the formations 71 ms, the interface 22 ms and the
  state 116 ms. The ten seconds between init's end and the first frame are that frame's own work in software WebGL (the page's programs compiled and
  the frame drawn), which a GPU does in a small part of it: the device runs measure it. Nothing changed on this account: the ground's 3.2 s is the one
  place a start could be shortened (its atlases painted in the page), a design question for the device runs' numbers, not for software rendering.
- **T-7, wall-clock thresholds.** The self-test's pan budget (2 ms a move) is judged at the median of the run's moves, the 95th percentile and the
  mean reported (it was the mean, which one slow move on a busy machine could lift past the budget); the layer's pass time was already the median of
  five; the harness's 20 s waits are functional timeouts, not thresholds, and are kept.

### 20.8 Decision 258 (b): more places beside a counter's anchor in motion (measured; not adopted)

The prototype (`tools/stage8/protos/counters.js`, put into the live page): while the view moves, a counter whose held place is taken tries
the places hugging its anchor before it is hidden: "c4", right, left, below and straight above lifted clear of its first place's row; "c8", c4's
and the four corners. A fresh view and the rest after motion untouched. Measured on the exact benchmark decision 257 (b) pins (the motion block's
26 runs, Chromium 141, `motion-8h.js --proto`):

| | the 16: jumps | pops | lod | flickers | formation-frames drawn (of 46,492) | the longest disappearance | disappearances |
|---|---|---|---|---|---|---|---|
| as built (8H) | 245 | 985 | 130 | 10 | 33,159 (71.32%) | 3,100 ms | 729 |
| c4 | 302 | 959 | 130 | 11 | 34,116 (73.38%) | 4,033 ms | 661 |
| c8 | 336 | 913 | 130 | 9 | 34,381 (73.95%) | 4,033 ms | 625 |

More formation-frames drawn in every landscape and paper run (the phone's pan 296 to 344 and 362 of 732; Saint-Hilaire's selected orbit 1,494 to
1,622 and 1,658) and fewer disappearances, but each counter that moves to a place beside its anchor is a jump: 302 and 336 over decision 257's
ceiling of 245, flickers 11 over 10 for c4, and three runs' longest disappearance over its baseline (`hybrid-orbit` 2,200 to 3,033 ms,
`hybrid-play` 3,100 to 4,033, `hybrid-orbit+sel` 2,000 to 3,033: a counter moved in holds the room another would have come back to). The
trade-off is the one the owner set the other way in 8C ("fewer jumps and more temporary disappearances"). Not adopted: it would need decision
257's ceilings raised, which this PR does not do (question 262).

### 20.9 Decision 255 (d): a hierarchy for far battle information (a prototype; not adopted)

The prototype (`tools/stage8/protos/farnames.js`, put into the live page; `tools/stage8/far-8h.js`, `docs/stage8-evidence/8h/far/`): the
landscape's formation names standing beyond the far step's distance (8C's `MLS.FAR`, 1.5 times the eye's distance to its target, the far
step's own test without its band) drawn with a lighter plate ("d-plate": the plate's alpha .62 for the dark theme's .88), a dimmer ink ("d-ink":
the interface's body text, `#B4AC99`, on the plate as it is) or both ("d-both": the plate at .74, the ink the interface's text, `#CABFA8`); their
size (12.5 px, decision 16's floor kept), words, marks and places unchanged. Measured in the views where far battle information stands (Part A's
`horizon-east`, the wall of formation names, 16 of its 19 names far; the infantry's front, 5 of 7; the low Pratzen view, 2 of 12; the phase-8
Overview, none), each name's contrast as rendered (the 10th percentile of the ground round its ink, on the captured frame) and every map text by
the harness's own measure:

| view | far names | as built: far, min | d-plate | d-ink | d-both | every map text at AA |
|---|---|---|---|---|---|---|
| `horizon-east` | 16 of 19 | 12.4:1 | 6.64:1 | 3.80:1 | 6.51:1 | all but d-ink (14 below 4.5:1) |
| infantry's front | 5 of 7 | 12.33:1 | 6.59:1 | 4.09:1 | 6.71:1 | all but d-ink (2 below, 3.55:1 the least) |
| low Pratzen | 2 of 12 | 12.66:1 | 7.33:1 | 4.47:1 | 7.16:1 | all |
| phase-8 Overview | 0 of 5 | (none far) | unchanged | unchanged | unchanged | all |

The near names keep their 12.2-14.1:1 in every variant; the layer's pass time is the build's within this machine's noise (the variants set two
inline styles after the pass). So a hierarchy by the plate is available at AA (the far names about half the near names' contrast, 6.5-7.3:1),
while a dimmer ink alone is not (below AA in two views). Not adopted: decision 255 (d) commissioned a prototype, and the wall of names in the low
views stays open as the owner asked (question 263: adopt d-plate in a follow-up with its own checks, or keep as built).

### 20.10 The visual work: the trees close up, the ice under a low sun, the troops' contact with the ground

**The trees close up** (8F's item 4: the open crowns shimmer more than 8E's solid ones, and close to the eye read as separate facets). Two
prototypes, measured in the live page by 8F's own tool (`tools/stage8/woods-8f.js --module woods8h`, `tools/stage8/protos/woods8h.js`; the
shimmer: the woods' pixels whose grey changes by more than 24 of 255 when the eye moves half a pixel, on the frame drawn without its
post-processing):
- *The crowns shaded as one volume* (8F's suggestion): each shell's vertices given the normal of their crown's ellipsoid ("t-vol"; "t-vol50" half the
  ellipsoid's and half the facet's), the material's flat shading off (with it on three derives each fragment's normal from its triangle and reads no
  normal of the geometry). The shimmer, as built, t-vol and t-vol50: among the pheasantry wood's crowns a few units off (`tree-close`) 2.12%, 2.07%
  and 2.01% of the woods' 352,247 pixels; the pheasantry view (8F's) 1.93%, 1.92% and 1.93%; close on Sokolnitz 2.57%, 2.55% and 2.57%; the triangles,
  draw calls and troops seen through the woods unchanged (`docs/stage8-evidence/8h/woods-8f-8h.json`, `woods/`). So the shimmer is the shells'
  silhouettes (the gaps between the shrunk faces crossing pixels), not their light; volume shading does not touch it.
- *The crowns closing near the eye* ("t-near"; "t-nearvol" with the volume normals): each kept face grown back toward its full size by the eye's
  distance to it (full within 5 units, as built beyond 16), in the vertex shader, the same triangles and draw calls. Over the whole frame (8F's
  tool counts the changed pixels inside a mask of the woods drawn without the hook, which would favour it: `tools/stage8/near-8h.js` counts them
  over the frame, the woods being all the prototype changes): among the crowns (8F's own close view by the Satschan mere, `trees-eye`) 10,616
  pixels of 360,000 change as built, 7,663 with t-near and 7,667 with t-nearvol; in the pheasantry view and close on Sokolnitz, where no crown
  stands within 16 units, identical (8,094 and 7,084). Close up a crown reads as a volume of facets rather than separate shards
  (`docs/stage8-evidence/8h/near/woods/trees-eye-*.jpg`).
**Built: the crowns closing near the eye** (t-near, 8F's flat shading kept; `world.js` `TREE8H` {near 5, far 16}, `treeNearGeo`, `treeNear`): the same
triangles (348, 254, 348 and 254 a tree, the bush 174), instances and draw calls, so 8F's savings are kept; one attribute more a vertex (the face's
centre) and a few operations in the crowns' vertex shader; the shadows the built crowns' (three's own depth material: the sun's eye is never near).
Held: the self-test's check (d') in the 8F block (every habit and the bush with the hook; among the crowns at least 1,000 pixels differ with it off,
15,144 of 129,600 measured; from the Field vantage none), `css-test.js`'s rules (TREE8H's values, the hook on every crown, the faces' centres, the
growth about each face's own centre, the atmosphere's uniforms chained), and their mutations, which fail them (`mutate-8h.js` nonear, nohook;
`mutate-css-8h.js` nearvals, nearcall, neargeo, nearatmo). Its cost a frame is for the device runs (the route draws the woods): here, in software
WebGL, the frame's cost is not steady enough to show it. On one page consecutive frames take from 9 ms to 6.6 s, the hook on or off (the first frames
after a view is set, then by stretches; `tools/stage8/near-8h.js --toggle`, the hook's uniform alternated frame by frame on one page: the paired
differences' median +1.1 and -0.8 ms among the crowns in two runs, their middle half -82 to +89 ms, and -0.3 ms in the pheasantry view,
`docs/stage8-evidence/8h/near/near-toggle-8h.log`); across builds, two fresh pages of each and 25 frames (`near-cost-8h-r2.json`), the medians among
the crowns 11.1 and 12.8 ms without the hook and 14.9 and 13.9 with it, in the pheasantry view 11.8 and 11.2 against 12.9 and 9.6, close on Sokolnitz
14.8 and 13.8 against 12.1 and 13.4. No cost of the hook stands out of the pages' spread here; what its grown faces cost a GPU (their fill near the
eye) is the device route's to measure. Not adopted: the volume shading (no measurable effect). Still open: a crown very near the eye (within a few
units) shows its facets as large planes; a crown that reads as twigs there needs another representation (8F's alpha-tested twig cards, measured in 8F
and set aside for their transparency and overdraw): recorded, not built.

**The ice under a low sun** (8F's item 5: "at 15:00 the sun's glare on the clear ice spreads wider and whiter than 8E's sheen ... A rougher clear
ice would narrow it, at the cost of the gloss"). Measured on copies of the build with one value changed (`tools/stage8/ice-8h.js`,
`docs/stage8-evidence/8h/ice/`), in 8F's three views of the meres (from above, obliquely, low; 09:00, 12:00, 15:00): the ice rules' ratios (the
shore band's and the rimed margin's grey over the field beside the shore, the self-test's ICE8F bounds 1.10 and 1.25; the margin lighter than the
clear middle from above), and the glare, the share of the ice's samples brighter than 1.5 times the field:

| variant | low view, glare at 09:00 / 12:00 / 15:00 | low, the clear middle at 15:00 | from above, margin / clear middle at 15:00 | obliquely, the clear middle at 15:00 |
|---|---|---|---|---|
| as built (`ICE.clear` 0.20, `ICE.sky` 1.4) | 18.2% / 21.2% / 43.5% | 1.305 | 1.147 / 1.107 | 1.080 |
| `ICE.clear` 0.26 | 15.5% / 19.5% / 37.2% | 1.297 | 1.148 / 1.116 | 1.079 |
| `ICE.clear` 0.32 | 0.4% / 16.8% / 31.7% | 1.287 | 1.147 / 1.128 | 1.078 |
| `ICE.clear` 0.40 | 0.4% / 1.7% / 27.1% | 1.275 | 1.146 / 1.144 (the margin no longer lighter by a visible step) | 1.077 |
| `ICE.sky` 0.7 (the sky's reflection at a grazing view halved) | 0.4% / 1.7% / 31.5% | 1.284 | 1.147 / 1.107 | 1.079 |
| `ICE.sky` 0 | 0.4% / 1.7% / 25.8% | 1.266 | 1.147 / 1.107 | 1.078 |

Every variant keeps the ice rules (the band at most 1.087 times the field, the margin at most 1.207). Two findings: the low views' glare is the
grazing sky term's and the clear ice's gloss together, and either lowered cuts it, but also takes the morning's and noon's grazing sheen (18-21% to
under 2%); and the oblique view 8F pointed to (`pairs/ice-mid.jpg`) does not change with either (the clear middle 1.077-1.080 times the field in
every variant): there the ice reads "whiter" by its neutral tone against the brown field, not by a glare. So no value here answers 8F's
observation without taking the gloss decision 246 (a) asked for at other hours; kept as built, the trade-off put to the owner (question 264).

**The troops on the ground** (8F's item 1, the brief's "report exceptions against the original criteria, the soles included; measure the full
cost; do not raise the budget or rename the exception"). Measured again by 8F's own tool on 8G's build and on 8H's (`tools/stage8/contact-8f.js`,
`docs/stage8-evidence/8h/contact-8g-8h/`): every formation drawn with a gait at 09:05, 10:40 and 13:50, up to 40 instances of every animated mesh,
eight phases of full swing, both levels, each instance against itself at rest; 8H changed nothing of the contact (every set's counts and worst
identical on both builds). Against **the original criterion** (every pose within H_TOL, 0.03 units at 4x and in proportion, 0.0774, at 10.33x),
as built with 8F's chords:

| at 4x (10.33x) | poses | beyond H_TOL | the worst, in H_TOL | its pixels at its largest size (the simple kit: a man 17.6 px tall; the rich kit: the closest figure view) |
|---|---|---|---|---|
| men, the hook's planted edges, simple / rich kit | 38,880 | 11 / 18 (13 / 22) | 1.88 / 2.08 (2.26 / 2.14) | 0.48 / 3.50 px (1.51 / 9.26) |
| men, **the drawn soles**, simple / rich | 38,880 | **36 / 35** (24 / 32) | **3.19 / 2.87** (3.19 / 2.79) | 0.82 / 4.82 px (2.12 / 12.09) |
| horses, the edges, simple / rich | 7,704 | 29 / 29 (29 / 29) | 1.94 / 1.94 (2.42 / 2.42) | 0.50 / 3.27 px (1.61 / 10.48) |
| horses, the drawn soles, simple / rich | 7,704 | 27 / 29 (25 / 28) | 2.13 / 1.92 (2.59 / 2.39) | 0.55 / 3.23 px (1.72 / 10.36) |

So the original criterion is **not met** with the chords: the cases are 8F's (`H_OPEN`, their bounds 2.5 H_TOL for the edges and 3.5 for the men's
soles, 3 for the horses', and `H_CASES`, their counts), unchanged and still open; the self-test's check (h) holds those bounds and counts, as 8F left
it (no bound raised, no exception renamed). **The correction that meets it** is 8F's option, each foot's own profile
(`docs/stage8-evidence/8f/contact/profile-option.patch`, applied to 8H's sources but for its self-test hunk; `contact-profile/`): at 4x every planted
edge within H_TOL (the worst 0.52 H_TOL for the men, 0.90 for the horses), the horses' soles within it, the men's soles 11 poses beyond (the worst 1.4
H_TOL, a sole's width across a crease of the drawn ground); at 10.33x all but 2 horses' edges, 4 men's soles and 2 horses' soles. Its **cost** a frame
on this machine's CPU, measured as 8F measured it (`tools/stage8/cost-8e.js`, the stretch Play draws from 08:45 in the low Pratzen view, close on
Sokolnitz and the two Overviews, 240 frames five times, the machine otherwise idle; `docs/stage8-evidence/8h/contact/`): the profile on every block
0.206-0.224 ms a frame at 1/2x and 0.285-0.362 ms at 1x, against the chords' 0.104-0.122 and 0.129-0.131 on the final build (the profile's slope
lookups 7,771 a frame against 3,521: each foot's own); the profile only where a man is drawn 48 px or more (one of the variants 8F measured)
0.107-0.145 ms at 1/2x and 0.134-0.225 ms at 1x: in the Overviews, where no man is drawn that large, the chords' own cost (the same lookups; the two
builds' difference there, 0.01-0.02 ms, is this measure's noise); close on Sokolnitz 0.44 blocks a frame take the profile at 1x (0.141 ms); in the low
Pratzen view at 1x 1.7 (0.2245 ms, over the budget); in 8F's two closest figure views, where the variant is meant to act (close on Saint-Hilaire's
division and on Nansouty's), 0.157-0.197 ms at 1/2x and 0.214-0.256 ms at 1x, against the chords' 0.093-0.094 and 0.121-0.148 there: over the budget
at 1x in both (8F: 0.284-0.314 ms close on Saint-Hilaire's division, 0.166-0.205 close on Nansouty's). Between runs this measure moves by up to 0.1 ms
on the same work (8F's run of the same variant gave 0.239 ms in the low Pratzen view at 1/2x with 4,808 lookups a frame, this one 0.145 with 4,811:
the benched part is noise-bound on a shared machine), so a value near the budget is not decided here: the device route's gait bracket decides it. With
it on every block, over the budget (section 8.3: the animation 0.2 ms a frame) in every view at both speeds; the budget is not raised here: question
265 (8F's, measured again).

### 20.11 Verification on the final build

On the final build (`austerlitz-command-map.html` 2,772,772 bytes, md5 `9fa50cb46a085ab4ea8f932cd405f1e8`), here unless said:
- `npm test`: all nine suites and the height guard pass (the build above, commit `8d05f2b`); `check:data`: 134 of 134 declarations identical to
  `archive/stage8h-24e29da7.html`; `check:chronology`: 0 errors; `check:baseline`: passes.
- `check:selftest` on CI's browser (Playwright 1.56's headless shell, Chromium 141.0.7390.37, installed here): every one of the 316 checks and every
  live block passing: the motion block's 24 runs at decision 257 (b)'s ceilings and visibility baselines (the paper map's Play 5, 30 and 1,570 again),
  `toast` 18 of 18 cases at 0 px, `ring` 2 px on each side, culling in motion, the tips, the narrow and phone layouts, the shortcuts, reduced motion
  live, the slider and the keys by real input (`docs/stage8-evidence/8h/selftest-chromium141.json`; its only failures the six the old manifest makes:
  313 checks against 316, three checks new and one renamed). The manifest written from that report (313 to 316: the pose at a pause, A-6 and the
  crowns near the eye added, 8G's landmarks check renamed for the château's octant); CI's run against it below.
- The mutations (`docs/stage8-evidence/8h/mutate-css-8h.json`, `mutate-8h.json`, `mutate-8h-final.json`): every one of `css-test.js`'s and
  `geo-test.js`'s 8H rules fails on a copy with it broken (17 mutations, each failing it; 4 controls passing); the self-test's 8H checks fail on
  copies with their rule broken (`mutate-8h.js`: on `e8fed44b`'s build the 8G block's, the 8E block's and A-6's nine, each failing its check, the
  controls passing; on the final build the 8F block's two, the crowns' growth removed and a habit drawn without the hook, each failing the crowns'
  check, the controls passing), but for two mutations of the château's planner that leave it where it was drawn (the place chosen already meets the
  rule: nothing the check reads changes), which `css-test.js` holds on the code instead (reported as equivalent on the final build; `e8fed44b`'s
  record shows them WRONG, the tool's fault then, which looked for the château in `BLDG` as an object of arrays and found none: `7b78265`). The
  harness's `toast` and `ring` blocks were shown failing on 8G's build (the message over the switch; a 1 px ring), the motion block's Play runs on
  `2f10a1f`'s (section 20.4).
- On CI (Chromium 141.0.7390.37), on `8d05f2b`: the push's and the pull request's runs passing: `npm test`, `check:data` and `check:chronology` (4 and
  7 minutes); `check:contrast` (14 and 11 minutes); `check:selftest` (35 and 43 minutes, each job's length: 316 of 316 against the written manifest,
  no failure, every live block: the motion block's 16 motions at 245 jumps, 985 pops, 130 level-of-detail switches and 10 flickers, decision 257 (b)'s
  counts, `toast` 18 of 18 cases at 0 px, `ring` 2 px on each side; `docs/stage8-evidence/8h/selftest-ci-8d05f2b.json`). The later commits change
  records and tools only (the build the same, md5 `9fa50cb4...`): every run of the later commits (records and tools; the build the same) that had
  finished when this section was written passes every job but one: the push run on `ac2067a` (41010403258), whose `toast` block read the phase's
  message hidden in one of its 18 cases (844 x 390, Watch) on a slow runner, the block's race (section 20.5; the same commit's pull-request run
  passing); fixed in `91434fd`, and on `607bb22` (run 41014490595) the self-test with the block as fixed passes 316 of 316, `toast` 18 of 18 shown at
  0 px (`selftest-ci-607bb22.json`). The dispatched `check:visual` (run 40995113422, on `8d05f2b`): passing in 198 minutes (the job's limit 350): its
  39 cases and every live block, the self-test 316 of 316, the census reconciled in all 39 cases and every frame with culling its frame without (0
  pixels), the motion block's 16 motions at 245, 985, 130 and 10 with 33,159 of 46,492 formation-frames drawn (8G's), the culling block's 485 frames
  judged and 243 compared (0 pixels differing), `toast` 18 of 18 at 0 px, `ring` 2 px on each side; no console message.
- The matched captures and clips: `docs/stage8-evidence/8h/pairs/` (`stills-8h.js`, 8G's build against the final, eleven views, each pair's
  share of pixels whose grey differs by more than 8 of 255: the town of Austerlitz and close by its church, the château now west-south-west of
  the church, 11.7% and 35.5%; the phase's message at 1600 x 900, 1024 x 768 and on a phone, moved clear of the switch and of the Menu, 1.3%,
  2.3% and 5.4%; the crowns near the eye, 8F's close view and among the pheasantry's crowns, 11.6% and 31.9%; where 8H changes nothing to be
  seen, close on Sokolnitz and the paper map identical, the low Pratzen view and the Overview 0.04% and 0.05%), `clips/pause-8g-8h.mp4`
  (Vandamme's division paused at about 08:48 by a real click while it turns, 0.96 rad off its heading: over the next 60 frames, every third
  shown, it turns on 0.96 rad on 8G's build and 0 on the final; 8G's above, 8H's below), and 8G's own in `docs/stage8-evidence/8g/` (section
  19.7).
- `check:contrast` on CI: passing on each of the three runs of `8d05f2b` (the push's, the pull request's and the dispatched one's, 8.7 to 14.1
  minutes): its 45 interface states at AA and the 10.5 px floor in the embedded faces, every console message judged, and the eight start-up cases.
- Not run here: `check:visual` (its 39 cases take three to four hours of software rendering on CI's runner; dispatched on CI instead, above) and
  `check:contrast` (CI's, above).

### 20.12 Performance, and the device runs

**The frame on CI's runs** (`tools/stage8/census-8g.js`: 8G's `check:visual` report, run 40870570661, against 8H's, run 40995113422;
`docs/stage8-evidence/8h/census-ci.md`): in all 39 cases the same draw calls as 8G's; the triangles 72 fewer in every desktop landscape view
and 36 fewer on a phone's (the buildings' 42,420 to 42,348, Austerlitz re-planned), more in none: the crowns' hook adds no triangle and no call.
The largest desktop frame 862 calls and 2,204,961 triangles (section 8.3's budget: 900 and 2.8 million), the largest phone frame 1,251,039
triangles (its budget 1.62 million).

**The device runs: pending** (decision 250 (b); section 12.3: "after 8E and after 8H, desktop and phone"; the integrated-GPU laptop's
condition of section 8.3). No owner hardware was reachable from this session, and software WebGL's timings decide nothing about a device: every
time in this section is this container's CPU or SwiftShader, said so where given. Nothing below is a substitute for the owner's runs.

*What to run, on what* (the protocol of `docs/STEP6_SPEC.md` section 2.3, unchanged; the routes `tools/step6/perf-route.js` and the wrapper
`tools/step6/perf-run.html`, its `?src=` naming the build):
- **The builds.** 8G's as merged (`git show 636cc5d:austerlitz-command-map.html`, md5 `508927e6f72e1b6f2f9186e954d61b59`) and 8H's final
  (`austerlitz-command-map.html` 2,772,772 bytes, md5 `9fa50cb46a085ab4ea8f932cd405f1e8`); 8E's and 8F's are named in sections 17 and 18 for the owner
  who wants the whole line.
- **Hosting** (an outward-facing act: the owner's choice): GitHub Pages from the branch, or any static host, the build at the root and
  `tools/step6/` with its two files beside it (the wrapper looks for `../../austerlitz-command-map.html`; `?src=` names another file, so both
  builds can sit side by side, for example `austerlitz-8g.html` and `austerlitz-8h.html`).
- **The desktop** (Windows, Chrome or Edge, window maximised, zoom 100%, plugged in; `chrome://gpu` saying "WebGL: Hardware accelerated"): the
  hosted `tools/step6/perf-run.html?src=../../austerlitz-8h.html`, Start, Copy (L3's form), twice two minutes apart, then the same with
  `?src=` naming 8G's build: the frame's own cost on each build, every segment of the route (the Overview, the low Pratzen view at 1x, 4x and
  10.33x, the phase-8 Overview, the paper map, the eye level, held and moving; with the figures hidden and with the effects off; Play at 4x and
  at half speed). If an integrated-GPU laptop can be had, the same there: section 8.3's condition for any PR adding more than 10% to the frame.
- **The phone** (the iPhone, Safari, Low Power Mode off, Reduce Motion off, Auto-Lock "Never" for the runs and set back after, held upright,
  untouched): `perf-run.html?route=phone&src=...` (the phone route, decision 236), twice per build, two minutes apart.
- **The brackets** (decision 250 (b) as corrected): `?route=fx` (Visual effects off against on, bracketed), `?route=cull` (8D's culling) and
  `?route=gait` (8E's gait), once each on the phone and once on the desktop on 8H's build.
- **What to send back**: each report as pasted text (each begins "Austerlitz step 6 frame-time route"), the devices' models, and anything that
  happened during a run (a notification, the screen dimming, the fan). They decide section 8.3's budgets on hardware; until then the device
  acceptance of 8E-8H stays pending.

*Verified here*: the three routes run end to end on the final build in this container (`tools/step6/perf-local.js`, Chromium 153 on
SwiftShader; `docs/stage8-evidence/8h/route-phone-local.json`, `route-fx-local.json`, `route-desktop-local.json`), each report in the form the
owner's runs paste back and none with a console warning or error: the phone route's 47 segments (the low tier; the largest frame 532 calls and
1,452,827 triangles, within the phone's 1.62 million), the effects bracket's 30 (its verdict here "effects off slower", 12 comparisons of 12:
software rendering's, as the phone found in step 6, deciding nothing), the desktop route's 23 (the largest frame 820 calls and 2,375,397
triangles, Play at 4x, within 900 and 2.8 million; a frame here takes 3 to 9 s, so 20 of its segments drew no frame in their window). Their
times are this container's CPU and decide nothing.

### 20.13 What remains

Stage 8 is **not complete**. What is open, by kind:
- **Pending: device.** The frame times of 8E-8H on the owner's desktop and iPhone, the integrated-GPU laptop's (section 8.3's condition), and
  the bracketed effects-off diagnostic on hardware (section 20.12). No acceptance of the budgets on a device is claimed.
- **Open: owner** (section 20.14): the geographic corrections (259, 260), Satschan (261), decision 258 (b) (262), decision 255 (d) (263), the ice
  under a low sun (264), the feet's remaining cases (265); carried: 8E's drivers and gunners, decision 245 (a)'s facings, 8G's `notDrawn`.
- **Open: defect or finding, not fixed.** A crown within a few units of the eye still shows its facets as large planes (section 20.10: twigs there
  would need another representation, recorded); four villages' buildings largely off the drawn village class (8G's: 0% at Sokolnitz, 5% at Telnitz,
  19% at Kobelnitz, 74% at Puntowitz, where the drawn class is the water's or the marsh's; a land-cover question, section 20.3); the knowledge rule
  and the drawn fog's ease (kept by decision 92, explained, section 20.4); the low views' wall of formation names (decision 255, open until 263 is
  decided); `GEOREF.GT`'s 13.5 m shift against the Czech survey (recorded, below the map's unit, section 20.6); the evidence 8G's session made and did
  not commit, reconstructed or replaced but not recovered (section 20.2).
- **Not measured here**: a GPU's frame time (software WebGL), the crowns' hook's cost among them (software WebGL's frames too unsteady to show it,
  section 20.10); Safari (no WebKit); memory on a device; a visitor's judgement of the gait, the buildings and the ice (the captures and clips are
  for the owner).

### 20.14 Questions for the owner (259-265)

Each is a decision only the owner can take: a change to guarded geographic data, a limit the owner set, or a trade-off of a look the owner
approved. Nothing in the build waits on them; each is drawn as recorded above until decided.

- **Question 259: the Sokolnitz group and the two small corrections** (section 20.6; `docs/stage8-evidence/8h/geo/proposal.md` G1-G3, G6,
  G7). (a) **Authorise one geographic data task**: the pheasantry drawn to its 1825 outline, the Goldbach at the castle and the village to its
  1825 bed, the castle, the Pratzen church and the Austerlitz garden at their own sites; (b) some of them (name which); (c) keep the map as drawn,
  its words saying where a place is drawn away from its own. **Recommended: (a)**: each rests on a period map read and georeferenced (B), none
  moves an anchor, and the brook's correction puts the French line at Sokolnitz on its own bank.
- **Question 260: the highway east of the Santon and the post house** (G4, G5). (a) **Authorise a separate data task, its own pull request**:
  the road on its 1826-52 line, the post house at Kovalovice No. 109, the eleven anchors on the road re-plotted from their sources, superseding
  the correction pass's route; (b) the post house alone (the road would then miss it: not recommended); (c) keep both, labelled. **Recommended:
  (a)**, after question 259's task.
- **Question 261: Satschan's farmsteads** (section 20.3). (a) **Keep five of seven**, the exception named with its cause (the drawn mere's
  outline, decision 27); (b) a fourth, smaller farmstead size for the tight spots (seven drawn, two of them an L); (c) a looser place margin
  for this village (six). **Recommended: (a)**: the shortfall is the drawn mere's, and (b) and (c) change a convention for one village's count.
- **Question 262: decision 258 (b), more places beside a counter's anchor in motion** (section 20.8). (a) **Keep 8C's placement**, the
  prototype recorded; (b) adopt four places (c4), raising decision 257's jump ceiling to 302 and three runs' longest-disappearance baselines (more
  formations drawn, 73.4% against 71.3%, fewer disappearances, more jumps); (c) eight places (c8: 74.0%, jumps 336). **Recommended: (a)**: the
  owner set the trade-off toward fewer jumps in 8C, and the gain is 2-3 points of formations drawn.
- **Question 263: decision 255 (d), far battle information** (section 20.9). (a) **Adopt the lighter plate for far formation names** ("d-plate":
  the far names at 6.6-7.3:1 against the near names' 12-14:1, every map text at AA, size and places unchanged) in a follow-up with its own checks
  (the contrast as rendered in the low views, the far test the far step's); (b) the plate and the ink together ("d-both", 6.5-7.2:1); (c) keep as
  built. Not a dimmer ink alone (below AA in two views). **Recommended: (a)**, the wall of names in the low views otherwise staying open.
- **Question 264: the ice under a low sun** (section 20.10). (a) **Keep as built**; (b) halve the sky's reflection at a grazing view (`ICE.sky`
  0.7: the low views' glare at 15:00 43.5% to 31.5% of the ice, and the morning's and noon's grazing sheen gone); (c) a rougher clear ice
  (`ICE.clear` 0.32: 31.7%, the gloss from above a little less). Neither changes the oblique view 8F pointed to. **Recommended: (a)**, the
  oblique look being the ice's tone against the field, not a glare.
- **Question 265: the feet's remaining cases** (8F's question, section 18.10 item 1, measured again on 8H's build, section 20.10). (a) **Accept 8F's
  chords with the proposed bounds and counts**, as built; (b) each foot's own profile on every block, over the animation's budget of 0.2 ms a frame
  (0.21-0.36 ms here, the chords 0.10-0.13); (c) the profile only where a man is drawn 48 px or more (0.11-0.22 ms in the four views of (b), over the
  budget in the low Pratzen view at 1x; 0.16-0.26 ms in the closest figure views, over it there at 1x). The budget is not raised here, and no
  exception renamed. **Recommended: (a)** until a device run shows the gait's cost: the remaining cases are at most 0.82 px on the simple kit at its
  largest, but up to 4.8 px on the rich kit in the closest figure view at 4x (12 px at 10.33x), which (c) would cure where it shows.
- **Carried, not new** (each recorded where it was put): 8E's drivers on the guns on the heights (an inference from IV Corps' letter) and the
  gunners beside moving pieces (section 17); decision 245 (a)'s facings, to be reconsidered now that the troops can be judged; 8G's
  `BUILDINGS.notDrawn` (St Anthony's chapel, the Santon's chapel, the Sokolnitz granary, section 19.4).

## 21. The follow-up before the final audit (8I, 8J, 8K), as built (30 October 2026)

**The brief** (the owner, 30 October 2026, after PR #73's merge, `b7fb67ab8c25a55915dea3da64ab4d79fe00ef51`, the audited merge): complete the
bounded Stage 8 follow-up before the final combined audit, with the owner's decisions on questions 259-265:
- **259 (a)**: authorise the geographic data task for the Sokolnitz castle, the pheasantry and the Goldbach group, the Pratzen church and the
  Austerlitz garden, subject to the evidence's qualifications;
- **260 (a)**: authorise the highway and post-house correction as a separate data task and pull request, reviewing and re-plotting the eleven
  affected anchors from their sources, the road not moved without reviewing the reconstruction that depends on it;
- **261 (a)**: Satschan's five farmsteads kept as an accepted symbolic-count exception (not a historical claim; the mere not distorted);
- **262 (a)**: the counters' placement kept, decision 258 (b)'s prototype not adopted, its evidence kept;
- **263 (a)**: the "d-plate", the lighter plate for distant formation names, adopted with production integration and rendered contrast checks,
  text size, placement, protected-item behaviour and the accessibility floor preserved;
- **264 (a)**: the ice kept, its low-sun appearance on the final visual-review checklist;
- **265 (a)**: the troops' contact with the ground kept provisionally pending the device measurements and the final audit; the animation's budget
  not raised; the original criterion not marked satisfied; the exceptions, bounds, counts and measured alternatives preserved.
With them: the phase's message placed again after a layout's change (presentation, resize or orientation, panels), its duration preserved and no
idle work; the performance reporting corrected (both frames, the audited maxima, measured again for each build, never carried forward); full
verification on the final revisions; device acceptance left pending without owner hardware. No general redesign; the final audit not begun.

**The plan as built**: three pull requests, stacked, each reviewable alone. **8I** (this branch, `claude/tender-einstein-gwrsij`, into `main`):
presentation and records, no data. **8J** (`claude/tender-einstein-gwrsij-sokolnitz`, into 8I's branch): decision 259 (a), a data task.
**8K** (`claude/tender-einstein-gwrsij-highway`, into 8J's branch): decision 260 (a), a data task. Each moves `check:baseline`; 8J and 8K each
move `check:data`'s reference to their own build.

### 21.1 The baseline

`main` at `b7fb67a` (PR #73's merge; nothing newer on `main` when the work began). Its build `9fa50cb46a085ab4ea8f932cd405f1e8`, 2,772,772 bytes,
the 8H build `check:baseline` names; `check:data`'s reference `archive/stage8h-24e29da7.html`; the self-test 316 checks.

### 21.2 The phase's message under a layout's change (8I)

*The fault* (the audit of 8H's build, item 3): `placeToast` (8H, section 20.5) ran only as `flash()` showed the message. `tools/stage8/toast-8i.js`
shows the message at 08:45 by its own `flash()`, changes the layout while it shows (by real clicks and keys where the change has a control, by
the app's own call and the viewport's resize otherwise), and reads it before and after: the message's box, whether it is shown with its text at
the clock, and every control it covers (`docs/stage8-evidence/8i/toast-8h.json`). On 8H's build 4 of 8 changes left it over a control: Watch to
Study at 1600 x 900 (1,716 px over the switch), 1600 x 900 to 1024 x 768 in Study (3,528 px over the opening's button, 182 over the tour's) and
back (over two vantage buttons), a phone turned to 844 x 390 (over the opening's button and a vantage button), a phone's Menu opened (6,463 px over
the switch); Study to Watch, the Panels opened and closed at 1024 x 768 and the paper map and back stayed clear.

*The change* (`app.js`): `toastRelayout(slide)`, called by every writer of a layout that can move the controls in the screen's upper half while
the message is seen (`toastSeen`: its class on, or its fade not finished): `setPresentation`, `setMode`, `syncInert` (the one writer of the
panels' reasons: the drawer, the rail, the sheets, the first-run card), `syncVis`, `setDSheet`, `setMenu` (the phone's Menu is not one of
syncInert's reasons; the first build of 8I missed it, and its own evidence run found the Menu case still over the switch), `onResize`, an
`orientationchange` listener, and `transitionend` (a panel's slide ended). A change places it at once (the layout as the change left it: in
software rendering the next frame came a second later, the message over the switch until then) and once more in the next frame, for what
settles after; a slide's end, which comes in bursts, in the next frame only; once a frame at most (`TOAST.raf`). Unseen, it returns at once:
nothing runs while the message is hidden. Its lifetime is `flash()`'s one 3.4 s timer (roadmap step 5's SW-13), which `toastRelayout` never
touches; `placeToast` is unchanged.

*Measured on the final build* (`docs/stage8-evidence/8i/toast-8i.json`, shots in `toast-8i/`): on the final build the self-test page's live block `toastLayout` (`docs/stage8-evidence/8i/selftest-8i.json`, `live.toastLayout`): **0 of the
8 changes over a control in all 24 reads**, the message shown with 08:45's text at each and placed again after each change (`TOAST.placed` rising),
the phone's Menu among them (on the first build of 8I, before `setMenu` called it, the Menu case still lay 6,463 px over the switch); unheld, flash()'s
3.4 s timer set once, never cleared or replaced while the message showed, the message hidden 6.5 s after it was set (the timer's callback delayed by
software frames, never earlier) by that same timer, and the change to Study made while it showed placing it again, clear. The evidence tool's run
on the same build with every read's capture: the same 8 changes clear in all 24 reads (`docs/stage8-evidence/8i/toast-8i.json`, its captures in `toast-8i/`; the phone's Menu
opened puts it below the Menu's controls, 55,280, and closed back at 55,62), and unheld one timer, never cleared, the message hidden 13.0 s after it was set
(the resize's software frames holding the main thread; never sooner than 3.4 s), by that timer.

*The checks*: `css-test.js` holds the hooks (each writer named, the listener and the slide's next-frame placement), the guard (nothing while
unseen), the once-a-frame rule and the untouched timer; the harness's live block `toastLayout` (in `check:selftest` and `check:visual`) runs the
eight changes on fresh pages, the message's timer held for the reads (so that a slow software frame cannot expire it between a change and its
read) and then, separately, unheld: the timer set once, never cleared or replaced while shown, the message hidden no sooner than 3.4 s after it
was set, and a layout changed while it showed placing it again (`thresholds.js` `checkLive`: 0 px over every control in all 24 reads).

### 21.3 The far names' lighter plate (8I; decision 263 (a))

*As built* (`app.js` `mlFarPlate`, `mlFarRatio`; `tokens.js` `sym.plate.far`): a formation's name on the landscape standing beyond the far step's
distance, `MLS.FAR` (1.5) times the eye's distance to its target (`mlFar`'s test for the places' small names, section 15; the ratio held inside its
band while the view moves, so that no name flickers at the boundary), is drawn on `TOKENS.sym.plate.far`, rgba(10,14,18,.64). The alpha is the
lightest keeping the plate's one ink, the label ink, at AA over white ground, the rule `sym.plate` is built on: 4.55:1 there, 15.4:1 over black
(Part A's prototype, 0.62, gave 4.23:1 over white and was only measured as rendered in its views). The name's words, size (t-ui, 12.5 px),
marks, place and box are unchanged, so the layout is the same with or without it (the self-test lays the view out with the far step's distance
set beyond reach and compares). Kept on the full plate: what the layer protects (the selection, the hovered, the highlighted family, the
focus's forced place, the item with the focus), places, counters and events; the paper map draws no formation names. The plate is written only
when an item's state changes, and `mlContent` resets it with new content.

*Measured* (`tools/stage8/far-8i.js`, the 13 views of `FAR_PLATE_VIEWS` on 8H's build and 8I's, matched; `docs/stage8-evidence/8i/far/`):
in the 13 views the far names, where any stand (11 views), read **6.97 to 7.78:1** at their least as rendered (medians 7.16 to 11.26), against
12.34 to 12.66:1 for the same names on 8H's full plate and 12.21 to 14.06:1 for the near names on 8I; every formation name at one size (12.5 px);
**no map text below AA** in any view on either build (8I's least 5.38:1, in the landscape with counters, where no formation name is drawn and
8H's is the same); the selected and the focused far name (the Allied headquarters' in the low view) on the full plate; the phase-8 Overview and
the fogged Overview at 08:00 with no name beyond the step (0 far); with counters no formation name. The layer's pass 0.7-4.4 ms a view (8H's
0.5-5.3; software rendering, deciding nothing). Each view's two captures side by side in `far/*-sheet.jpg`.

*The checks*: the self-test's "map layer (Stage 8, 8I; decision 263)" (the low view east over the Goldbach at 12:00: the far names on the far
plate, the near and the protected on the full, one size, the layout identical with the step off, a far name selected and one focused on the
full plate, the same under Napoleon's reading, none on the paper map); `css-test.js` (the token's AA and alpha, the rule's test, names only,
the protected excepted, no class or size); the live block `farPlate` in `check:visual` (the 13 views: every name on the plate the rule gives it,
the far ones at AA as rendered, one size, far names in the wall of names, none with counters).

### 21.4 The census's two frames (8I; the correction of section 20.12)

Section 20.12 gave the largest frames on 8H's CI run as 862 calls and 2,204,961 triangles (desktop) and 1,251,039 triangles (phone). Those are
`renderer.info` over a frame that reuses the ground's depth (the eye still: `onWarm`); the budget's frame is the complete one, the depth drawn
(`onCold`, 8D's definition, section 16: "the whole frame, every pass, the depth drawn"). Computed from 8H's `check:visual` report (CI run
40995113422) by `tools/stage8/census-8i.js` (`docs/stage8-evidence/8i/census-8h-both.md`), each maximum over the cases separately:

| 8H's build | complete frame (depth drawn) | still eye (depth reused) |
|---|---|---|
| desktop, calls | 864 (plans-overview) | 862 (plans-overview) |
| desktop, triangles | 2,352,049 (narrow-1024) | 2,204,961 (narrow-1024) |
| phone, calls | 482 (phone-390-first) | 480 (phone-390-first) |
| phone, triangles | 1,398,127 (phone-390-first) | 1,251,039 (phone-390-first) |

Against section 8.3's budgets (900 calls and 2.8 million triangles on a desktop, 1.62 million on a phone) the headroom is the complete frame's:
36 calls and 447,951 triangles on the desktop, 221,873 triangles on the phone. From now on both frames are reported, and every build of this
follow-up is measured again on its own `check:visual` run (section 21.6 and the 8J and 8K sections): nothing is carried forward after a
geographic or visual change. These are geometry counts from software rendering; they decide nothing about a device's frame time, which only the
owner's runs measure.

### 21.5 Decisions recorded without a change to the build (8I)

- **261 (a)**: Satschan's five farmsteads of seven are an accepted symbolic-count exception, named with its cause (the drawn mere's outline,
  decision 27), not a historical claim; no convention changed for one village.
- **262 (a)**: 8C's placement kept; decision 258 (b)'s prototype (section 20.8) not adopted, its evidence kept in `docs/stage8-evidence/8h/`.
- **264 (a)**: the ice as built; its appearance under a low sun (section 20.10: the low views' glare at 15:00, 43.5% of the ice) goes on the final
  visual-review checklist.
- **265 (a), provisional**: 8F's chords with the proposed bounds and counts kept pending the device runs and the final audit; the animation's
  budget (0.2 ms a frame) not raised; the original criterion (every foot on the ground) **not** marked satisfied; the exceptions, the bounds, the
  counts and the measured alternatives ((b) each foot's own profile, 0.21-0.36 ms; (c) the profile from 48 px, over the budget in two views) kept
  as recorded in section 20.10.

### 21.6 Verification (8I)

Here (Chromium 141 under Playwright 1.56, SwiftShader): `npm test`, all nine suites and the height guard; `check:data`, 134 data declarations
identical to `archive/stage8h-24e29da7.html`; `check:chronology`, 0 errors (70 moves with a timed statement: 66 consistent, 4 early, the named
conflicts bag@6, guard_cav@6, kamensky@3 and kamensky@4; REVIEW's locators 75 of 75 current); `check:baseline` on 8I's build (2,782,595 bytes, md5
`697bbf34ec29fc4d05695dc8e1cd3c5e`); `check:selftest`, the self-test's 317 checks all passing and every live block judged and passing, the run's two
failures the manifest's (316 names), which was then regenerated from this run (`check-report.js --write-manifest`: the far plate's check added,
none removed); `css-test.js`, 0 errors; the far plate's 13 views (21.3); the phase's message (21.2).

*On CI*: the checks job, `check:contrast` and `check:selftest` run on every push of this branch (the pull request's checks), and `check:visual` is
dispatched on its head (`workflow_dispatch`, "visual" ticked): its census, in both frames, is this build's own, recorded with the other two builds'
in section 21.9 when the runs land.

*The device routes.* GitHub Pages serves `main` (checked from this session: the build there is 8H's, md5 `9fa50cb4...`): the route pages
https://billybobbyboo.github.io/Austerlitz/tools/step6/perf-run.html (the desktop route), `?route=phone`, `?route=fx`, `?route=cull` and
`?route=gait` each loaded, loaded the build in their frame and booted without an error or a console error here (`pages-smoke`, in this section's
evidence note), so they are usable now for 8H's build and will serve this follow-up's build once it is merged (or at once if the owner points Pages
at a branch: an outward-facing setting, the owner's). The protocol is section 20.12's, unchanged. No device was reachable from this session: the
device acceptance of 8E-8K stays pending; nothing here is a device's time.

### 21.7 The Sokolnitz group, the Pratzen church and the Austerlitz garden (8J; decision 259 (a); a data task)

*What it implements.* 8H's proposal G1, G2, G3, G6 and G7 (`docs/stage8-evidence/8h/geo/proposal.md`), each validated again against its evidence
before it was drawn, with the qualifications the owner set: the later map's position and the 1805 inference kept apart in the records and in what
a visitor reads; the pheasantry drawn to its researched historical outline, not today's woodland; the garden by the evidence, its conventions
labelled; every layer updated (the landscape, the ground's cover, the paper map, the day-track, the dossiers and the sources sheet); roads,
crossings, positions, sight lines, knowledge, movement and the narrative checked; Legrand's "across the stream" and the castle's and the
enclosure's anchor revisited explicitly; what no source supports kept uncertain.

| place | was | is | the later map (grade) | 1805 |
|---|---|---|---|---|
| the Goldbach at Sokolnitz (`GOLDBACH_M`) | x 204-205, 316-515 m west of the stream | today's Říčka from y 309.8 to 377.9 | the 1825 sketch within about 10 m (B) | C; which of two channels north of the castle, not established |
| the pheasantry (`WOODS[0]`) | an ellipse 1.9 km south-south-east, 190 trees | the 1825 "Fasangarten", 0.246 km², 46 trees | the 1825 sketch, traced (B) | C (the castle's garden of the 18th century) |
| the castle (`LANDMARK_SITES.castle`) | the build's legacy place, 535 m south-east | its own site [212.9,344.3] | the 1825 quadrangle and today's castle on one site (B) | B by the texts (Schwoy 1793; Mikhailovsky-Danilevsky) |
| the Pratzen church (`LANDMARK_SITES.church`) | the village's point | its own site [277.0,255.6], 399 m at 193 degrees | the 1826 sketch's round churchyard, today's church (B) | "outside the village" A (Schwoy 1793); the site B |
| the Austerlitz garden (`GARDENS`; `WOODS[1]` dropped) | a wood 1.6 km south-east of the town | the garden west of the château, rows of trees | the 1826 sketch and the Second Survey, today's outline (B) | C (Kaunitz's, before 1794); the planting not established |

*The III Column and Legrand.* The III Column's phases 2, 4 and 7 stood by the build's castle, east of the drawn brook; they are re-plotted to one
place at the castle and the pheasantry as corrected, where their acts put the column, graded B (A until 8J: the sector documented, the frontage an
approximation, the 1825 sites carried back). Legrand's phase 7 stays where it was; with the bed corrected it stands at the stream's west bank, so
its act says "to the stream" where it said "across" (no source read gives this move). The III Column's arrow (`OVERLAYS[2]`) ends at the castle.

*What it draws* (`tools/stage8/geo-8j.js`, `docs/stage8-evidence/8j/geo-8j.json`): the traced outline 85.2% drawn as wood (the rest the brook's water and wet bottom), 1.8% of the ground within 3 units
outside it; the castle's site on the model's road class, the Pratzen church's on the village class, the garden 100% the town's village class; the
corrected bed 203 m east of the village's point (the old bed 103 m west of it), 146 m from the castle's site.

*The castle's size* (`tools/stage8/castle-8j.js`, `docs/stage8-evidence/8j/castle-8j.json`). At its site the drawn track (118 m west, drawn 76 m
wide) and the drawn brook (146 m east, drawn 145 m wide: decision 253 (b)'s display widths) leave 8G's quadrangle (480 by 367 m) no room: down to
40% of that size no clear place lies within 8 units on the castle's side of both (8G's size finds its nearest, 461 m off, across the track), and at
35%, 30% and 25% the nearest clear places (114, 89 and 57 m off) leave the site outside the quadrangle. The planner now draws the castle and its
farm at the largest of 8G's size and smaller ones, in steps of 5% down to 15% (`CASTLE8J`, design values; as a farmstead takes a smaller size in a
tight spot), at which the quadrangle stands clear and covers its own site: 20%, 96 by 73 m, at the site (its centre 2 m from it), the farm unmoved
south of it, Sokolnitz's 13 farmsteads all drawn. The storeys' heights are kept, so beside the villages' farmsteads (drawn at the buildings'
convention, a plot's frontage 1.9-2.2 units, 120-139 m, against the sketches' about 22 m) the castle stands near its own size (the 1825 quadrangle 79.6 by 60.0 m). The self-test's landmarks check holds the
quadrangle covering its site and the castle and farm at one size; `css-test.js` pins `CASTLE8J` and the rule; the sources sheet gives the drawn
size, read from what is drawn; the castle's claim (`appearance.js`) says so. Seen close (`pairs/8j-sokolnitz-castle-afternoon.jpg`, 15:00, the
III Column gone), the castle at about its own size reads smaller than the farmhouses beside it, which are drawn at the buildings' convention: a
visitor sees its form (the closed quadrangle, the taller east range) but not its standing among the village's buildings. No size of 8G's
convention can stand at the site: the drawn track and brook with their clearances leave 115 m clear across the site (64 m west of it, 51 m
east: `castle-8j.json`), and the quadrangle at 8G's size, turned to the true north while the corridor runs about 20 degrees east of it, spans
about 580 m across the corridor; narrowing the drawn ribbons there would admit about 30% (an estimate from the corridor's width, not built). *Put to the owner, question 266*: (a) keep it so (recommended,
by the project's order of priorities: the site and its relations are geographic integrity, the size a visual convention, stated where it is
drawn); (b) a middle size off its site, 25-35% of 8G's size with the quadrangle's centre 57-114 m south of the site and the site outside it
(measured; not built); (c) narrow the drawn track's and brook's ribbons at Sokolnitz (decision 253 (b)'s convention changed at one place; about
30% at most, estimated); (d) 8G's size at its nearest clear place, 461 m off across the track (its site and its side of the track lost).

*The woods' random sequence.* The woods drew their trees from one continuing sequence and the buildings keep clear of the woods' and the
villages' trees; replacing the pheasantry and dropping the park re-planned the buildings of ten villages far from either. Each kept wood and the
villages' trees now restart from their state in 8H's sequence (`WOODS_RS`, read by `tools/stage8/woods-rs-8j.js`): the buildings' plans of Austerlitz, Pratzen, Sokolnitz and Telnitz changed, each by the data (no house in the garden, the church,
the castle and the pheasantry, the old pheasantry on Telnitz's fields), the 16 other villages' identical part for part (without the hold 14
villages were re-planned, 10 of them, Augezd, Bosenitz, Girzikowitz, Holubitz, Hostieradek, Kobelnitz, Krzenowitz, Menitz, Puntowitz and
Schlapanitz, for no change of their own; `tools/stage8/woods-bldg-8j.js`, `docs/stage8-evidence/8j/woods-bldg-8j.json` and `-nohold.json`). The trees' habits, turns and the scrub, drawn from the sequence's end, are not held: a presentation only.

*Consequences checked* (`tools/stage8/know-8j.js` against 8I's build; `check:chronology`; the movement audit; the narrative): 2,636 readings of "Whose eyes?" (both headquarters, every ten minutes): 15 differ, all Napoleon's, all of Kienmayer's
advance guard and the I Column by Telnitz and Sokolnitz, unknown before (no line of sight), uncertain (valley fog) 05:10-08:40 and seen
08:50-09:40 now: the relief's carve follows the corrected bed, so the trench that hid them from the Zuran runs elsewhere, a reading of the
model; the Allied reading identical; the viewsheds within 0.4 points but Sokolnitz's own (0.74% to 1.66%); the plateau's strength and the
centres' separation identical; `check:chronology`'s verdicts unchanged (66 consistent, the four named conflicts), the movement audit 0
findings; the narrative's statements naming the brook at Sokolnitz true but Legrand's act, rewritten.

*The captures* (`tools/stage8/stills-8j.js`, `pairs/`): 8I's build beside 8J's in ten matched views, among them the castle at 10:00 (under the
III Column) and at 15:00 close, the pheasantry, the brook by the village, the column at the castle, the Pratzen church, the garden and the paper
map on Sokolnitz; each inspected.

*Two faults found by the first local self-test run, fixed.* The château was not drawn: 8J's garden rule kept the church as well as the town's
houses off the garden's outline, and from no remaining place of the church did the château find one within its octant (section 20.3). The
rule is now the houses' only (`ctx.landmark` in `churchPlan8g`): the church and the château, whose places are a layout of their symbols, may
stand over the outline, the château at its 8I place and the garden's rows ending west of it (12 trees). And the bank scrub along the streams,
set at random off their lines, kept clear of the villages' places only: with the brook corrected one bush stood on the castle's farm (the
buildings check's nearest crown -0.194). It now keeps clear of every building as drawn, its scale drawn before the test so that no other bush
moves (4 bushes not drawn). Austerlitz's plan without the garden rule is 8I's part for part; Telnitz's changed by the old pheasantry, whose 199
trees bordered its buildings (the nearest 0.86 units off in 8I).

*The motion block's visibility* (decision 257 (b)'s baselines, `MOTION.VIS`). 8J's data moves what each motion has in view: the III Column's
places, the ground under the formations by the corrected Goldbach's carve, and Napoleon's readings in the morning. On 8J's build 13 of the 22
runs differ from the baselines (the counts and the was and is in `CHANGELOG.md` and `thresholds.js`; repeated run for run on a page of its
own, `motion-8j.json`): seven fell in their drawn (the most, Saint-Hilaire selected in the orbit, 1,494 to 1,454 drawn of the same 2,548 in view), six
rose. The map layer's code is 8I's, whose run gave the earlier values exactly, and the paper map's
runs, on flat ground, are unchanged; putting the III Column and its arrow back at their 8I places on 8J's build moves the counts part of the
way back (`motion-8j-prz8i.json`), the ground's change remaining. Under the owner's rule for this follow-up (geographic baselines moved only
where the authorized data change justifies it, the reason recorded) they are re-measured on 8J's build; the totals stay within their ceilings
(238, 985, 130 and 9 against 245, 985, 130 and 10).

*The checks.* `terrain-test.js`'s downstream check reads the corrected bed; the self-test's church check reads a church's own site, its landmarks
check the castle covering its site at one size with its farm (its name and the manifest's entry with it); its woods
pins at 8J's counts, the check named "as pinned" since (the manifest's entry renamed with it); `redteam.js`'s march-rate acknowledgement; the motion block's visibility baselines re-measured (above); `check:data`'s reference moved to
8J's build.

*Verification* (here; CI's runs and the census in section 21.9): `npm test`, `check:data`, `check:chronology` and `check:baseline` pass; the
self-test 317 of 317 with every live block run, the motion block judged again with its re-measured baselines without a failure; the evidence
re-taken on the delivered build (`7d5594ba...`). The device runs pending.

*Found and recorded, not changed*: kienmayer@7's and lang@2's places beside the corrected brook (each on its own evidence, not re-plotted); the
castle's site on the model's road class (a track passes it); the castle's walls (not established); from 08:00 to 14:10 the III Column's place
stands 124 m from the castle's site, so its figures stand over the castle's symbol while it holds the castle (as its acts have it; figures are
drawn over buildings everywhere: `castle-8j.json`); the garden under the château's symbol at the Overview's scale; no garden sign on the paper map.

### 21.8 The highway east of the Santon and the Posoritz post house (8K; decision 260 (a); a data task)

*The decision superseded.* The correction pass (CHANGELOG, "Correction pass", Roads and Places; its script `tools/geo-anchor.js`, history, not run)
routed the highway from the Santon's foot "through the post house" it constructed "where a straight Tvarožná-Rousínov highway line crosses
Holubice's meridian" (open question 6, "±1 km"), and placed Suchet's and Bagration's anchors and both plans' columns along that line by one
function, `along(km, dS)`. 8H's geographic review found the road of 1826-52 0.2-1.2 km south of it and the post 1.37 km south-east of the
constructed one (proposal G4, G5); the owner authorised its correction with the anchors reviewed from their sources (question 260 (a)). This
section and `docs/stage8-evidence/8k/register.md` record what replaced what; the evidence dossier the review rests on (every reading on place,
every statement naming the road, the chronology ledger's entries) is summarised there.

*The places.* The highway (`ROADS[0]`) east of the Santon's foot on II/430's line, the road of the 1826 sketches and the Second Military Survey
(B for 1826-52, C for 1805); the post house (`GT.posthouse`, `FEATURES[#posthouse]`, `VILLAGES`) at Kovalovice No. 109 (B for 1826-52, C for 1805);
the edge marker "To Rausnitz" and the road's label point moved with the road; the "Holubitz-Posoritz track" cut at the highway; the legacy "wood
above Holubitz" not drawn (the road and the post run through it, the Second Survey has fields there). Measured: the Santon 465 m north of the road
(276 m before), the post 26 m north of it, Holubitz 0.72 km south (1.7 km before), the road leaving the frame at 56 degrees true toward Rausnitz.

*The anchors* (register sections A1-A9; the rule: B where a reading places the formation then relative to a named place, C where no reading does
and the point is this map's sequence; no grade kept because it was there):

| anchor | was | is | grade | basis |
|---|---|---|---|---|
| suchet@0 | [225,97] | [235,103] | A to B | the order of 1 December: right (south) of the road level with the Santon (C4.5) |
| suchet@5 | [242,78] | [254,88] | B to C | this map's advance, 0.8 km along the road |
| suchet@6 | [264,67] | [279,81] | (B) to C | 1.6 km along |
| suchet@7 | [284,57] | [300,76] | (B) to C | 2.3 km along |
| suchet@8 | [309,43] | [348,62] | (B) to C | west of the post: Schönhals's renewed attack on the height beyond it (C6.13) |
| suchet@9 | [321,38] | [364,54] | (B) to B | at the post: Napoleon's order of 3 December dated there (C6.9) |
| bag@0 | [319,49] | [352,64] | B to B | by the post, Krug and Holubitz held (C6.10, C6.12); the line not established |
| bag@5 | [262,68] | [262,68] (kept) | B to B | the heights by Dwaroschna (C6.10), now north of the road; the identification this map's |
| bag@6 | [284,57] | [300,76] | (B) to C | this map's falling back, 2.3 km along |
| bag@7 | [304,46] | [321,70] | (B) to C | 3.0 km along |
| bag@8 | [337,29] | [386,38] | B to B | Schönhals's height between Rausnitz and the post (C6.13), east of the post as corrected |
| bag@9 | [366,14] | [414,13] | (B) to C | toward Rausnitz inside the frame; question 180 (c) kept |

("(B)" an inherited grade.) Three acts rewritten, each with an attributed claim and a note naming this map's part (suchet@0's, bag@0's, bag@5's);
the post house's sub-title and claim note, the edge marker's distance and `SOURCE_NOTE.body[5]`'s open question changed. Both plans' columns on
the road moved with it, the Allied staging "Bagration on the highway" re-centred on Bagration's dawn.

*What it does* (measured): 2,636 readings of "Whose eyes?" on 8J's and 8K's builds (`know-8k.json`): 11 differ, the Allied
reading of Suchet at his corrected dawn place (seen to unknown, no line of sight, at ten of the clocks between 05:20 and 09:40) and Napoleon's of
Bagration at 12:20 (unknown to seen), readings of the model; the viewsheds, the plateau's strength and the centres' separation identical. The
Command tab's inference that from the Zuran "most of the Olmütz road sector, including the Santon, is in view" (`COMMAND.fr["5"][0]`) measured
again (`roadview-8k.json`): the drawn road from the Santon's foot to the post 68.5% in sight before, 100% now, the Santon and the post in sight in
both: it stands. Buildings (`woods-bldg-8k.json`): Bellowitz, Bosenitz, Holubitz and the post house re-planned, each by the road, the track or the
wood beside it, the 16 other villages identical (without 8J's hold on the woods' sequence 15 would have changed, 11 for no change of their own,
`woods-bldg-8k-nohold.json`). `check:chronology` unchanged in its verdicts: 66 consistent, the four named conflicts; bag@6's derived arrival
11:31 to 11:40.

*The map layer in motion* (decision 257 (b)'s benchmark; `docs/stage8-evidence/8k/motion/`). The self-test's motion block changes in 19
of its 22 runs on 8K's build: the formation-frames drawn over all 72.90% (8J's 73.03%), the longest a formation stays hidden by the layout in
Play 4,033 ms (3,100). The visibility baselines are re-measured on this build under 8J's rule. Not moved, and failing on 8K's build alone: the
16's ceilings (jumps 248 against 245, pops 998 against 985) and the real input's tolerance in the paper map's zoom (jumps 26 against its driven
twin's 10, formations drawn 732 against 795). Measured by the block with one of 8K's changes undone at a time: the road's label point and the
post house leave it as it is; with both divisions' places of 8J everything is within its limit; with Suchet's of 8J alone too (244, 965); with
Bagration's of 8J alone the pops (999) and the zoom's divergence remain. So the pops' excess and the divergence come with Suchet's re-plotted
places (at 09:30, the benchmark's hour, still his dawn place south of the road level with the Santon), the jumps' with both divisions'
together, Play's longest hidden with Bagration's. The places follow the readings and are not tuned to a benchmark; the map layer's code is
unchanged; the ceilings and the tolerance are the owner's. *Put to the owner, question 267*: (a) re-baseline the 16's totals at this build's
(248, 998) and accept the paper zoom's divergence as the benchmark's sensitivity at a crowded spot; (b) recommended: a bounded presentation
follow-up first (the items at the tipping point in the paper map's zoom found, the real input brought within its twin), then re-baseline only
what remains. Until the owner decides, `check:selftest` and `check:visual` fail on these three lines alone. 8K's `check:visual` on CI adds
two lines of the same kind, each traced to one of 8K's data changes and put to the owner under the same question (section 21.9): the Plans
view's drop limit (13 against 12, the Littawa's name, by both plans' columns on the corrected road: (c) the limit 13, recommended, as decisions
199 and 214 moved drop limits, or (d) the plans' labels laid out again) and Watch's caption at 14:40 without a derived reading (the centre
separation ending at 14:30 with Bagration's place on Schönhals's height: (e) the case exempt in `CAP_DERIVED_NONE` with that reason,
recommended, the reading a spatial heuristic that the corrected place ends earlier, or (f) the reading's rule revisited).

*The checks.* `geo-test.js`'s two checks that held the correction pass's line and rule replaced by checks of the corrected geography and of
the register's rules (each at least as strict); `redteam.js`'s march-rate acknowledgement (infantry 1.33 to 1.35); the self-test's woods pins;
`check:chronology` unchanged in its verdicts (the cites of `body[5]` reviewed and rehashed); `check:data`'s reference moved.

### 21.9 The settled baseline for the final audits

*Superseded in part by section 22 (the integration pass, 31 October 2026).* PR #74 (8I) reached `main` (`72c7e1b`); PR #75 (8J) and PR #76 (8K)
were merged by the owner into their stacked feature branches (`c7de7a2`, `c706c96`), not into `main`, and the integration pass brings both into
`main` (section 22.1). Question 266 is decided (a), question 267 answered by the bounded presentation-repair approach (sections 22.2 to 22.4); the
check lines this section lists as failing are resolved or remain as section 22 states.


The state the final audits start from: `main` at `b7fb67a` with the three follow-up pull requests merged in order (8I, 8J, 8K), whose final
build is 8K's (`f10fe585c46aea576f436ed51ac46f83`, 2,810,630 bytes). Until they are merged, that build is on `claude/tender-einstein-gwrsij-highway`.

**Fixed and verified in the follow-up** (each with its check; the evidence in `docs/stage8-evidence/8i/`, `8j/`, `8k/`):
- the phase's message placed again under every layout's change while it shows (8H: 4 of 8 changes over a control; now 0 of 8, 24 reads), its
  3.4 s timer untouched, nothing run while it is hidden (8I);
- the far formation names on the lighter plate at AA as rendered, one size, the protected on the full plate (decision 263 (a), 8I);
- section 20.12's census corrected to the complete frame and every build's census measured again in both frames (8I; the delivered build's in
  section 21.6 and below);
- the Goldbach at Sokolnitz, the pheasantry, the castle and the III Column's places, the Pratzen church, the Austerlitz garden, Legrand's act
  (decision 259 (a), 8J; the woods' random sequence held so that no building moves but where the data changed; the motion block's visibility
  baselines re-measured on each data task's build under the owner's rule for geographic baselines, the reason recorded);
- the highway east of the Santon, the post house, the twelve anchors on and by the road, both plans' columns (decision 260 (a), 8K);
- two faults the first local self-test of 8J found, fixed: the Austerlitz château undrawn under 8J's garden rule, and a bank bush on the
  castle's farm (8J).

**Open owner questions** (each with its measured options and a recommendation): 266, the castle's drawn size at its site (8J, section 21.7);
267, 8K's check lines moved by its re-plotted places and plans: the map layer's motion benchmark over its ceilings, the Plans view's drop
limit and Watch's derived reading at 14:40 (8K, sections 21.8 and above: `check:selftest` and `check:visual` fail on these alone until it is
decided).

**Accepted exceptions** (named, with their causes; not historical claims):
- Satschan's five farmsteads of seven (decision 261 (a)): the drawn mere's outline (decision 27) leaves no room for seven;
- the feet's remaining cases (decision 265 (a), provisional): 8F's chords with their bounds and counts (section 20.10), the original criterion
  not satisfied, pending the device runs and the final audit;
- the conventions labelled as such: the farmsteads' plan and the roofs (8G), the garden's rows and spacing (8J), the far plate's alpha by
  sym.plate's rule (8I), the gait as a visual convention under compressed time (8E), the ribbons' widths (8A), the derived arrivals' rates
  (design values, unsourced).

**Provisional choices** (decided for now, to be confirmed): the Sokolnitz castle drawn at 20% of 8G's size at its own site, where the drawn
track and brook leave no more room (8J; owner question 266, open); decision 265 (a); decision 264 (a)'s ice, with its low-sun appearance on the final
visual-review checklist; the device acceptance of 8E-8K (pending: below); the identifications this map makes and says it makes (Stutterheim's
heights by Dwaroschna as the ground east of Bosenitz, Schönhals's height as the rise east of the post, the 1825 sketch's places carried back
to 1805, the 1826-52 road and post carried back to 1805).

**Unresolved historical questions** (kept open in the data and the sources sheet; none is guessed): the places in 1805 of the highway and the
post (the First Military Survey not reached); which of the 1825 sketch's two channels carried the Goldbach north of the Sokolnitz castle in 1805;
the castle's walls and whether the bottom by Sokolnitz was marshy in December 1805; the garden's planting in 1805; Bagration's exact line at
dawn and where he stood at 17:00 (Rausnitz, or already toward Austerlitz); which side of the road Schönhals's height lay; Krug's place (the Second
Survey's "Kruch" beside Holubitz, against the drawn Krug's warped legacy place); and `SOURCE_NOTE`'s open questions as they stand (Russian infantry
flags, the Grenz infantry's coats, the vines, the Russian Guard's attack, Kologrivov's command, the hours the accounts dispute, and the rest).

**Remaining findings** (recorded, not acted on): kienmayer@7's and lang@2's offsets from the corrected brook (each on its own evidence, 8J);
the castle's site on the model's road class, a track passing it (8J); the III Column's figures over the castle's symbol from 08:00 to 14:10, while it holds the castle (8J); the garden under the château's symbol at the Overview's scale and no garden sign on the paper
map (8J); Caffarelli's anchors 2.5-2.9 km south of Bagration's from 14:30 (as before, 8K); the woods' habits, turns and scrub drawn again where a
wood changed (presentation; the buildings and the kept woods' trees held, 8J).

**Carried forward** (each where it was put): 8E's drivers on the guns on the heights (an inference from IV Corps' letter) and the gunners beside
moving pieces (section 17); decision 245 (a)'s facings, to be reconsidered now that the troops can be judged; 8G's `BUILDINGS.notDrawn` (St
Anthony's chapel, the Santon's chapel, the Sokolnitz granary, section 19.4).

**The census of the three builds in both frames** (`tools/stage8/census-8i.js` on each build's own `check:visual` report on CI; the complete
frame, the ground's depth drawn, is what section 8.3's budget judges; the still eye's frame, the depth reused, beside it; each maximum over the
cases taken separately; geometry counts, not frame times):

| build | the complete frame (the budget's): desktop calls, triangles | phone triangles | the still eye: desktop calls, triangles | phone triangles | its `check:visual` run |
|---|---|---|---|---|---|
| 8I (`697bbf34...`) | 864 (plans-overview), 2,352,049 (narrow-1024) | 1,398,127 (phone-390-first) | 862, 2,204,961 | 1,251,039 | 41048882622: all 39 cases, the self-test 317 of 317 and every live block passing (4 h 13 min) |
| 8J (`7d5594ba...`) | 864 (plans-overview), 2,200,439 (narrow-1024) | 1,315,760 (phone-390-first) | 862, 2,053,351 | 1,168,672 | 41071549726: 38 of the 39 cases, the self-test 317 of 317 and every live block passing (the motion block with its re-measured baselines); one line failing, below (2 h 4 min) |
| 8K (`f10fe585...`) | 864 (plans-overview), 2,151,193 (narrow-1024) | 1,288,561 (phone-390-first) | 862, 2,004,105 | 1,141,473 | 41080693215: 37 of the 39 cases and the self-test 317 of 317 passing, every live block but the motion block; three lines failing, below (4 h 11 min) |

Section 8.3's budgets against the complete frame: 8I's desktop 36 calls (4%) and 447,951 triangles (16%) within 900 and 2.8 million, its phone
221,873 triangles (13.7%) within 1.62 million; the same as 8H's to the triangle (section 21.4), as a change to the page's text and timers alone
should be (`docs/stage8-evidence/8k/census/census-8i.json`, `.md`). 8J's desktop 36 calls (4%) and 599,561 triangles (21.4%) within the
budget, its phone 304,240 (18.8%): 151,610 triangles fewer than 8I's on the desktop and 82,367 on the phone, the pheasantry's 46 trees for
190 and the park's 170 no longer drawn (`census-8j.json`, `.md`). 8K's desktop 36 calls (4%) and 648,807 triangles (23.2%), its phone 331,439
(20.5%): 49,246 and 27,199 fewer than 8J's, the wood above Holubitz no longer drawn (`census-8k.json`, `.md`). The draw calls the same in all three
builds' maxima (864 and 482): the follow-up changed what is drawn, not how.

*8J's one failing line* (judged again by `check-report.js` with 8J's thresholds): `phone-844x390-explore`'s framing floor (decision 232
(a)), 9 of the map layer's 11 items inside the free rectangle against the floor of 10, 8I's build standing at the floor. The case replayed as
the harness reaches it (a phone held landscape, Explore, 09:30): every item drawn a pixel up and left of where 8I draws it, and the Guard
Cavalry's name, its first place 3 px from the Allied Headquarters' name, taking its next place, above the free rectangle; with the III Column
put back at its 8I places the same, so the shift is the fitted view's over the corrected Goldbach's ground. 8K's build meets the floor again
(10 of 12, its "To Rausnitz" marker now in the view). The floor is not moved: it holds on the stack's last build, and on 8J's alone it would be
the owner's to move (as decisions 199 and 214 moved drop limits).

*8K's three failing lines* (judged again by `check-report.js` with 8K's thresholds), each traced to one of 8K's data changes by its build with
that change undone, all three put to the owner under question 267 (section 21.8): (1) the motion block, as on `check:selftest` (jumps 248, pops
998, the paper map's zoom by real input against its twin): Suchet's and Bagration's re-plotted places; (2) `plans-overview`, 13 map items
dropped against the limit of 12 (measured on the 5F build, decision 141): the Littawa's name newly dropped where both plans' columns and the
Allied staging now run along the corrected road (with 8J's `PLANS` on 8K's build 12 again; with 8J's anchors and 8K's plans 13); (3)
`ph8-overview-watch`, Watch's caption without a derived reading at 14:40: the centre separation (a French formation across the line joining
the Allied groups north and south of the Pratzeberg, `centreSeparation`) ends at 14:30 instead of 15:00, because Bagration's place at 14:30, on
Schönhals's height east of the post, moves the northern group's centroid about 7 map units east (with his places of 8J it holds at 14:40 as
before; `CAP_DERIVED_NONE`, the case's exemption list, empty and not added to). The rows still pending are filled from their builds' own runs as they
complete, never carried over.

**CI on each pushed head** (as recorded when this section was written; completed when the runs complete): 8I (`9d7a966`): the push's and
the pull request's runs passing (41048791108, 41048869905: the checks job, `check:contrast`, `check:selftest`), the dispatched run passing
whole (41048882622: the checks job, `check:contrast`, `check:selftest` and `check:visual`); 8J (`0ed98b9`): runs 41071486091, 41071525851 and
41071549726, the checks job, `check:contrast` and `check:selftest` passing on all three, the dispatched `check:visual` failing on the one line
above; 8K (`5efb458`, then `58c6b3f` and `9d11acb` with these records): the checks job and `check:contrast` passing, `check:selftest` failing
on question 267's motion lines alone (judged again here from the run's report: 317 of 317 in-app checks, the motion block's jumps 248, pops
998 and the paper map's zoom by real input; runs 41080693215, 41088292871, 41088300578), the dispatched `check:visual` (41080693215) failing on
the three lines above.

**Device acceptance: pending.** No owner hardware was reachable from this session; nothing here substitutes emulation or software-WebGL timing
for a device. The routes are live on GitHub Pages for `main`'s build, each checked from this session (the page loads, its build boots in
the frame, no console error): https://billybobbyboo.github.io/Austerlitz/tools/step6/perf-run.html (the desktop route) and the same page with
`?route=phone`, `?route=fx`, `?route=cull` and `?route=gait`. Pages builds from `main`, so these links serve 8H's build until the follow-up is
merged and the delivered build (8K's) after it. Before the merge a branch's build is measured as section 20.12 says: hosted where the owner
chooses (an outward-facing act), or a checkout of the branch served at the repository's root (`python3 -m http.server 8000`) and opened at
`http://<host>:8000/tools/step6/perf-run.html`, the iPhone on the same network; `?src=` names another build file beside it. The protocol is
section 20.12's, unchanged: on the desktop the route twice, two minutes apart, on 8H's build and on the delivered build; on the iPhone the phone
route twice per build; the three brackets once each on both devices on the delivered build; each report pasted back as text with the devices'
models. They decide section 8.3's budgets on hardware; the geometry counts above are not frame times.

**Stability.** What is settled: every regression suite, `check:data`, `check:chronology` and `check:baseline` pass on each of the three
builds; the self-test passes all 317 of its checks on each; 8I and 8J pass every live block; the geographic corrections of decisions 259 (a)
and 260 (a) are in the data with their evidence, grades and registers, and every derived reading, chronology verdict and sight line they move
is measured and recorded. What is not: 8K's `check:selftest` fails on its motion block and its `check:visual` on that block, the Plans view's drop limit and Watch's
derived reading at 14:40, each traced to 8K's re-plotted places or plans (question 267) and not moved until the owner decides; 8J's
`check:visual`, on its own build, fails one line (a phone framing floor, met again on 8K's build: above); the census and the
`check:visual` runs of the three builds are pending on CI and are recorded here as they complete; the device runs are pending. The build is
therefore stable for the final audits' reading of its data, records and code, with question 267 and the device acceptance named as the two
open conditions; nothing in it is known to be broken but what this section names.

## 22. The integration and stabilisation pass before the final combined audit (8L), as built (31 October 2026)

**The brief** (the owner, 31 October 2026): a bounded integration and stabilisation pass for Stage 8 before the final combined audit.
(1) Resolve the integration gap: one integration branch from the current `main` bringing in the complete intended 8J and 8K, 8I and anything newer
on `main` preserved, its source and generated build verified, its pull request targeted at `main` ("do not assume a PR's 'merged' status proves
its changes reached main"). (2) **Decision 266 (a)**: the Sokolnitz castle retained at its corrected site and its present footprint of about
96 × 73 m, the explanation of the symbol-scale compromise preserved, its visual prominence and its obstruction by troop symbols kept on the final
audit checklist, no historical geography moved to make it larger. (3) **Question 267, the bounded presentation-repair approach**: the 16's 248
jumps against 245 and 998 pops against 985, and the paper map's zoom by the real wheel (26 jumps against its scripted comparison's 10, 732
formation-label appearances against 795) investigated; whether the divergence comes from the application's behaviour, the input's scheduling or
an invalid comparison determined and demonstrated; the corrected geography, the motion ceilings and the visibility safeguards preserved; no pass
obtained by hiding more information, weakening the input-equivalence checks or broadly raising thresholds; the longer hidden interval in Play
inspected; where a bounded repair cannot satisfy the existing criteria, the precise remaining trade-off reported with measured alternatives.
(4) The two visual expectations resolved narrowly: `plans-overview`'s further dropped Littawa label inspected and a small presentation correction
tried if appropriate, a case-specific limit of 13 only if the corrected geography explains it and essential information stays readable and
accessible, the reason recorded, no limit raised globally; `ph8-overview-watch` at 14:40: verified that neither derived reading applies, the case's
expectation updated to the model with an explicit absence assertion and positive coverage at a time when a derived reading should appear, no
caption fabricated and no model altered. (5) The final integration build verified (the regression suite, `check:baseline`, `check:data`,
`check:chronology`, `check:contrast`, `check:selftest`, the full `check:visual`, on the pinned CI browser where required), the coverage of the
message's placement, the far labels' contrast, the protected labels, the phone framing, the geography and the dependent troop positions kept;
the commits, the build's identity, the CI links, the failures, the accepted exceptions and the pending hardware checks reported; the stale merge
and completion records updated; real-device performance, the provisional foot contact, the low-sun ice, the troops' facings, the landmarks'
legibility and the unresolved historical questions kept on the final audit checklist, none marked passed; one reviewable pull request into
`main`, not merged; the post-merge checks; a readiness verdict.

### 22.1 The integration gap and its resolution

*What the remote held* (fetched at the start of the work, 31 October 2026, and again before each push): `main` at
`72c7e1b58de93acc60f674aebac8c5370f9d85cf`, PR #74's merge of 8I's head `9d7a966` into `b7fb67a`, its tree 8I's own (`324b7727...`): `main`
carried 8I alone. PR #75 (8J, head `0ed98b9`) was merged by the owner into 8I's branch `claude/tender-einstein-gwrsij` (merge
`c7de7a29092edefc9eb180dd467abaee6b42dd95`, its tree 8J's own) and PR #76 (8K, head `c3e2f51`) into 8J's branch
`claude/tender-einstein-gwrsij-sokolnitz` (merge `c706c969f9e2c649f1a8265c188d0b35872dd6aa`, its tree 8K's own, `bbfe4c31...`): each "merged",
neither into `main`. Nothing newer on `main`; no other open pull request. The published page followed `main`: GitHub Pages served 8I's
build (`austerlitz-command-map.html`, 2,782,595 bytes, md5 `697bbf34ec29fc4d05695dc8e1cd3c5e`, fetched 31 October 2026), so the map a visitor
reached had neither 8J's nor 8K's corrections.

*What was done*: `claude/charming-dijkstra-srj84w` from `main` at `72c7e1b`; PR #75's merge commit merged into it (`08f033c`), then PR #76's
(`df8b135`), each `--no-ff`, neither with a conflict. The tree that results is 8K's head's, object for object (`bbfe4c317ad1f4c235c46acce9b7eeb78fe97bb9`),
so nothing of 8I or of `main` is lost and nothing is added by the merges; after this pull request `main`'s history holds the three pull requests'
merges (`72c7e1b`, `c7de7a2`, `c706c96`) and their heads (`9d7a966`, `0ed98b9`, `c3e2f51`). `npm run build` writes `austerlitz-command-map.html`,
2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83`: the committed file, `archive/stage8k-f10fe585.html` and `check:baseline`'s value, byte for
byte. This pass changes no source of the build (sections 22.3 and 22.4 change the harness and its thresholds; section 22.2 is a record): the
delivered build is 8K's own, and `check:data`'s reference stays `archive/stage8k-f10fe585.html`.

### 22.2 Decision 266 (a): the Sokolnitz castle

The owner's decision (31 October 2026): (a). The castle stays at its corrected site (`LANDMARK_SITES.castle`, [212.9, 344.3]: the 1825 quadrangle
and today's castle on one site, B for 1825), drawn at the largest of 8G's size and smaller ones that stands clear there: 20% of 8G's size, the
quadrangle about 96 by 73 m (the 1825 quadrangle 79.6 by 60.0 m), its farm at that size south of it (`CASTLE8J`, design values; `css-test.js`'s pin
and the self-test's landmarks check hold them). Nothing changes in the build. The explanation of the compromise stays where a visitor reads it:
the sources sheet's "How the villages are drawn" (`castleSizeText`: the map's track and brook, drawn wider than they ran, leave it no room at the
size the map draws its buildings, and the size drawn, read from what is drawn) and the castle's claim in `appearance.js` (its scope: drawn
smaller, at the largest size that stands clear, since 8J). No geography moves to make it larger: section 21.7's options (b) to (d) are not taken.
On the final audit checklist (section 22.6): its visual prominence (at about its own size it reads smaller than the farmhouses beside it, drawn
at the buildings' convention) and its obstruction by the III Column's figures, which stand over its symbol from 08:00 to 14:10 while the column
holds the castle (section 21.7).

### 22.3 Question 267: the motion block

*The paper map's zoom by real input: an invalid comparison* (`tools/stage8/twin-8l.js`, `docs/stage8-evidence/8l/twin-8l.json`). The block holds
each run by real input within its tolerance (`REAL_TOL`: 6, or 25% of the twin's count) of a twin driven in the page. Until this pass the twin was
the 16's own run, which has no pointer: its wheel events carry their place, but no pointer comes to the map. Real input's does: before it presses
or wheels, `runReal` moves the mouse to the motion's start, and the browser sends the canvas a buttonless pointer move there; the app's hover
(`mlHoverAt`) takes the formation whose counter or name lies under the pointer, and the layer protects what is hovered, placing it first and
never dropping it (decision 39). On 8J's build the box at the paper view's centre (948, 428) was the Littawa's name, a place with no formation:
nothing was hovered and the runs matched. On 8K's build, the layout moved by the corrected places, it is the Russian Imperial Guard's counter
(`c:constantine`), hovered for the whole zoom in the real run only. Demonstrated: the same driven motion with the real pointer's buttonless
arrival at its start and its departure (to (2, 2), over the rail: the canvas's out and leave), the *twin with the pointer*, hovers the same
counter and gives 28 jumps, 126 pops, 9 flickers and 726 of 1,232 formation-frames drawn, against the 16's run's 10, 105, 3 and 795 (25 items
count differently); the run by real input, three times on one page, gives 26/125/7/725, 26/123/7/732 and 26/123/7/732 (and 28/126/9/726, the
twin's own numbers, where it follows its twin on the self-test's page),
each hovering the Guard's counter, each with one buttonless move (its arrival: the browser adds none). The divergence is the hover: the input
differed, not the application's handling of it. *Input scheduling* accounts for the rest: repeated real runs differ by up to 2 jumps, 3 pops,
2 flickers and 7 formation-frames (three outcomes seen: real input yields to the event loop between its steps, which a driven run, one evaluation,
never does), well within the tolerance. The three hybrid motions' pointers hover nothing: their twins are their 16's runs frame for frame, and
their real runs the same in every count.

*The comparison repaired* (`tools/visual/motion.js`, `thresholds.js`): each run by real input now follows its twin with the pointer (`+point`:
`RUN`'s `a.point`, `blockRuns`), and the judge holds the run by real input to that twin: the same formation hovered as the pointer arrives,
every count within `REAL_TOL` (unchanged), its formations' visibility within a frame of the twin's (unchanged). It holds each twin to the 16's
run: where its pointer hovers nothing, equal in every count and in its formations' visibility (the pointer's coming and going change nothing
else); where it hovers a formation, the hover named in the run. The twins are new runs, with visibility baselines of their own measured on this
build (`MOTION.VIS`: the three hovering nothing their 16's runs' values; `paper-zoom+point` [726, 1,232, 667]). No existing baseline, ceiling or
tolerance moved, and the 16 are as before. Each new rule fails on a copy of a measured record with that one thing broken
(`tools/stage8/mutate-8l.js`: 15 mutations, all caught; the records as measured pass).

*The 16's totals: the application's behaviour on corrected data* (`tools/stage8/items-8l.js`, `items-8l.json`, `items-8l.md`). The 16 are driven
runs, frame for frame on the driver's clock, the same counts in every run (here, on CI and in 8K's evidence: 248 jumps, 998 pops, 130
level-of-detail switches, 9 flickers): no input scheduling. They compare the same motions as the ceilings were set on (decision 257 (b)): a valid
comparison. What moved them is the map layer's response to 8K's corrected places: between 8J's build (238, 985) and 8K's (248, 998) 61 items
change their counts in 13 of the 16 runs (hybrid-pan's pops 55 to 65, the paper map's zoom's 92 to 105, its glide's jumps 5 to 11, the
landscape's zoom's pops 65 to 77; others fall: hybrid-play's pops 108 to 98, hybrid-orbit's 148 to 139), no item at a tipping point (the largest
net change one counter's 12 pops fewer); with both divisions' places of 8J on 8K's build the totals were 237 and 985 (`motion-8k-e3.json`). The
mechanism in motion: a held item comes back only at a re-placement pass (every 333 ms) after two passes in a row with room, and the pass places
in priority order (decision 240 (a)'s invariant, section 3.4), so an item coming back takes the place of a lower-priority item still drawn there,
which leaves and in turn waits two passes (hybrid-play's pass at frame 27: 10 items back, 6 gone; `items-8l.md`). The corrected places (Suchet's
dawn place south of the road level with the Santon, Bagration's by the post house) add items to those cycles in the views at 09:00-09:30.

*The bounded repairs measured* (`tools/stage8/variants-8l.js`, `variants-8l.json`: the block as `check:selftest` runs it, on copies of the build
with one rule changed, judged by `thresholds.js`'s own judge; none adopted):

| variant | the 16: jumps, pops, flickers | formation-frames drawn (the baselines' 30,205) | failing lines |
|---|---|---|---|
| none (this build) | 248, 998, 9 | 30,205 | 2: the two ceilings |
| kept first while moving: the items drawn in the last pass keep their places first, the held ones are looked for after them in the room left (persist's order at rest, applied in motion) | 238, 815, 4 | 30,997 (+2.6%) | 10: 7 runs below their visibility baselines (hybrid-pan 1,375 against 1,427; hybrid-zoom 1,288 against 1,342, a formation hidden 3,033 ms against 2,133; hybrid-orbit 3,033 ms against 1,900; hybrid-glide 1,105 against 1,152; land-orbit 1,944 against 1,981; hybrid-pan under the two readings 1,318 against 1,370 and 869 against 938), the orbit's twin, the real paper zoom 15 formation-frames from its twin |
| a protected item drawn keeps its place (a label hovered where it stands stays there) | 221, 1,014, 8 | 29,943 | 9: pops over the ceiling, 8 runs below their baselines |
| both | 209, 805, 2 | 30,775 (+1.9%) | 9: 7 runs below their baselines, the orbit's twin |

The first is the rule that removes the cycle above: it meets the ceilings with a wide margin and draws more formation-frames in all, but it
trades visibility between runs (in the Landscape-with-counters views the larger formations, coming back, find the smaller ones' kept places)
and sets aside decision 240 (a)'s priority order in motion; decision 257 (b) forbids buying the totals with any run's visibility. The second,
the one aimed at the hover alone, makes the totals worse (live events, also protected, keep their places too). No variant meets the existing
criteria. Restoring 8J's places (237 and 985) is excluded by the brief.

*The remaining trade-off* (for the owner; nothing decided here): this build exceeds the 16's ceilings by 3 jumps (1.2%) and 13 pops (1.3%), every
run's formations' visibility at its baseline and every other line of the block passing. Measured options: (a) the ceilings re-baselined at this
build's counts (248, 998), as the benchmark's sensitivity to the corrected places (8J's data moved them the other way, to 238 jumps; decision 257
(b) calls them "ceilings of this benchmark, not a guarantee of what a device shows"); (b) kept-first while moving, which meets the ceilings by a
wide margin but fails seven runs' visibility baselines and changes decision 240 (a)'s priority order: only with the owner's decision on both;
(c) the two lines carried into the final audit as a named open condition. Until the owner decides, `check:selftest` and `check:visual` fail on
these two lines alone.

*Play's longer hidden interval* (inspected; `items-8l.md`). In the Landscape-with-counters Play (09:00, 90 frames at ½x) the longest a formation
stays hidden by the layout went from 3,100 ms (8J) to 4,033 ms (8K; its baseline moved in 8K under 8J's rule): the counters of Nansouty's
Cuirassiers, Walther's Dragoons and Miloradovich's Russians are hidden for the whole run, 121 frames (on 8J's build drawn in 51, 3 and 10). All
three are dropped at rest in that view at 09:00 and again after the motion (frame 0, frames 91-120: the static layout has no room for them).
While it plays the full search has room for them between passes (Nansouty's in 50 of the 121 frames, Walther's in 43, Miloradovich's in 7) but
never at two passes in a row, because at each pass the higher-priority held items, coming back first, take it (the cycle above). With
Bagration's places of 8J it was 3,100 ms (`motion-8k-e3b.json`): his corrected place by the post house adds his counter to that cycle. Each of
the three stays reachable by hover and keyboard (decision 39), as every dropped item is; no variant measured shortens it (4,033 ms in each).

### 22.4 The two visual expectations

*plans-overview: the Littawa* (`tools/stage8/plans-8l.js`, `plans-8l.json`). On 8K's build 13 items are dropped against the case's limit of 12,
the 13th the Littawa's name (`t:litava`). A place name is drawn only beside its own 10 px marker, which must be free first; it is covered (within
the layer's padding) by Liechtenstein's name (`n:lich`), at a ring place below the one it held on 8J's build. The chain, in placement order: with
decision 260 (a) both plans' columns on the highway and the Allied staging "Bagration on the highway" follow the corrected road, and their labels
move with them (the staging's by 47.7 px, the Advance Guard of the Right's by 35.3, the pivot's by 22.3; the arrows' labels for Suchet and
Bagration by 18.6 and 23.0); the plan label "Stare Vinohrady" moves onto Liechtenstein's name's place, and Liechtenstein's next free place covers
the Littawa's marker. With 8J's `PLANS` restored on 8K's build: 12 dropped, the Littawa drawn. A small presentation correction was considered
and not made: what drops the Littawa's name is the general placement (the priority order, the rings, a place's name only beside its marker), and
any change to it moves every view's layout, the 39 cases' drop limits and the motion block's counts, for one tertiary name in one view. What
stays drawn is what 8J's build draws there: every formation name but the Allied headquarters', every plan label but "The concealed centre" (both
dropped on 8J's build too), the river itself; the Littawa's name stays in the layer's keyboard order and, focused, is drawn (forced, clear of the
panels; dropped again when the focus leaves: A-2); the map text at AA as rendered (the case's own measure, its least 12.17:1). The owner's
condition holds, so the case's limit is 13 (`thresholds.js`: a line below decision 141's, which it replaces for this case alone, its reason
beside it); no other case's limit moved.

*ph8-overview-watch at 14:40* (`tools/stage8/caption-8l.js`, `caption-8l.json`). Verified: at 14:40 (phase 8) the plateau reading cannot apply (it
applies through `PLATEAU_LAST`, phase 6; the Allied strength on the heights is 0) and `centreSeparation()` finds no French formation across the
line joining the Allied groups north and south of the Pratzeberg. On 8K's build it holds until 14:20 and ends at 14:30 (on 8J's until 14:40):
Bagration's corrected place on Schönhals's height east of the post moves the northern group's centroid east (432.9, 160.4 at 14:40 against 425.9,
159.3 on 8J's build). Every ten minutes from 04:00 to 17:00 the caption shows exactly the readings the model gives, on both builds (79 clocks each,
no disagreement). The case's expectation is now the model's (`thresholds.js` `CAP_DERIVED_ABSENT`, not an exemption): `measure.js`'s
`derivedModel` asks the model at the case's clock, and the case fails if the model gives a reading there or the caption shows one (the explicit
absence); `harness.js` measures the same view once more at 14:20 (phase 7, the last ten-minute clock with the centre separation), where the
caption must show the model's reading whole (the positive coverage), then sets the case's clock back (checked). Every other Watch case keeps the
strict rule (its caption must show a derived reading). Measured on this build (`report-two-cases.json`): at 14:40 the model gives neither and the
caption shows none; at 14:20 the centre separation, shown whole; the clock back at 14:40. The model and the caption are unchanged.

### 22.5 Verification

Here (Playwright 1.56's headless Chromium 141.0.7390.37 under SwiftShader, the browser CI pins; the build `f10fe585...`, unchanged):
- `npm test`: all nine suites and the height guard passed on the integration build (5 min 31 s, before this pass's harness changes, which no
  suite reads); on the final state: *pending, recorded when the run completes*.
- `check:data`: all 139 data declarations byte-identical to `archive/stage8k-f10fe585.html`. `check:chronology`: 0 errors (the movement audit 0
  findings; 118 statements cited by 73 of 75 REVIEW rows, 37 allowed by name; the four named conflicts). `check:baseline`: md5
  `f10fe585c46aea576f436ed51ac46f83`, 2,810,630 bytes.
- The motion block on a page of its own (`tools/stage8/motion-8h.js`, as `check:selftest` and as `check:visual` run it,
  `docs/stage8-evidence/8l/motion/`): the 16 at 248 jumps, 998 pops, 130 level-of-detail switches, 9 flickers; every driven run at its visibility
  baseline; every run by real input within its tolerance of its twin with the pointer (on the self-test's page identical to it); judged by
  `thresholds.js`: two failing lines, the 16's two ceilings (section 22.3). `tools/stage8/mutate-8l.js`: 15 of 15 mutations caught.
- The two cases judged anew (`report-two-cases.json`, `check-report.js`): both pass.
- `check:selftest`, `check:contrast` and the full `check:visual`: *pending, recorded when the runs complete*.

On CI (the pinned browser): the push of `0b7b77c` (run 41156435794: the checks job, `check:contrast`, `check:selftest`) and a `check:visual` run
dispatched on it (41156439125): *pending, recorded when the runs complete*.

### 22.6 The final audit checklist (carried; none of it marked passed)

- **Real-device performance**: the device acceptance of 8E-8K, unchanged by this pass (section 20.12's protocol; the routes on GitHub Pages serve
  `main`'s build, which after this pull request is this one, `f10fe585...`); no time measured here is a device's.
- **The troops' contact with the ground**: decision 265 (a), provisional: 8F's chords with their bounds and counts; the original criterion (every
  foot on the ground) not satisfied; the animation's budget not raised.
- **The ice under a low sun**: decision 264 (a): the low views' glare at 15:00 (43.5% of the ice, section 20.10).
- **The troops' facings**: decision 245 (a), to be reconsidered now that the troops can be judged; with them 8E's drivers on the guns on the
  heights (an inference from IV Corps' letter) and the gunners beside moving pieces.
- **The landmarks' legibility**: the Sokolnitz castle at about 96 by 73 m, reading smaller than the farmhouses beside it, and the III Column's
  figures over its symbol from 08:00 to 14:10 (decision 266 (a)); the Austerlitz garden under the château's symbol at the Overview's scale and no
  garden sign on the paper map (8J); Satschan's five farmsteads of seven (decision 261 (a)); 8G's `BUILDINGS.notDrawn` (St Anthony's chapel, the
  Santon's chapel, the Sokolnitz granary); the Littawa's name dropped in the Plans view at the Overview (section 22.4).
- **The map layer in motion**: the 16's totals over their ceilings, unless the owner decides before the audit (section 22.3); Play's longest hidden
  formation, 4,033 ms (three counters dropped at rest in the hybrid view at 09:00).
- **The unresolved historical questions** (kept open in the data and the sources sheet; none guessed): section 21.9's list (the places in 1805 of
  the highway and the post; which of the 1825 sketch's two channels carried the Goldbach north of the castle; the castle's walls and the bottom's
  marshiness in December 1805; the garden's planting in 1805; Bagration's line at dawn and his place at 17:00; which side of the road Schönhals's
  height lay; Krug's place); kienmayer@7's and lang@2's offsets from the corrected brook; Caffarelli's anchors 2.5-2.9 km south of Bagration's
  from 14:30; `SOURCE_NOTE`'s open questions as they stand.

### 22.7 Readiness

*Pending the verification runs (section 22.5); written when they complete.*

### 22.8 After the merge: what to check

1. The three pull requests in `main`: after `git fetch origin main`, `git merge-base --is-ancestor <commit> origin/main` succeeds for #74's merge
   `72c7e1b58de93acc60f674aebac8c5370f9d85cf`, #75's `c7de7a29092edefc9eb180dd467abaee6b42dd95`, #76's `c706c969f9e2c649f1a8265c188d0b35872dd6aa`,
   their heads `9d7a9663e257fa2bf7db74f69dff5c6143f53812`, `0ed98b991ca85f5d1c90bc78d41b667cb8cff8db` and `c3e2f51ca35e5311cbdbb2886fa3765b538a8246`,
   and this pull request's head.
2. Nothing of the build differs from 8K's head: `git diff --stat c3e2f51 origin/main` lists only `CHANGELOG.md`, `CLAUDE.md`, `docs/` and `tools/`
   (no application source, data file, archive or build); `git diff c3e2f51 origin/main -- austerlitz-command-map.html` is empty.
3. The published HTML is the accepted build: `npm run build` then `git diff --exit-code austerlitz-command-map.html` (the committed file is the
   sources' build); `npm run check:baseline` (md5 `f10fe585c46aea576f436ed51ac46f83`, 2,810,630 bytes); `cmp austerlitz-command-map.html
   archive/stage8k-f10fe585.html`; `npm run check:data` (139 data declarations identical). Once GitHub Pages has deployed `main`, the page it
   serves is the same file: `curl -sL https://billybobbyboo.github.io/Austerlitz/austerlitz-command-map.html | md5sum` gives `f10fe585...`.
4. CI on the merge commit: the checks job and `check:contrast` pass; `check:selftest` (and a dispatched `check:visual`) fail on no line but the
   16's two ceilings, until the owner decides question 267's remaining trade-off (section 22.3).
