# Appearance and motion: specification (Stage 8, Part A)

**Status: Part A, the specification, is complete and merged (PR #64, `main` at `d86835e`). The owner decided its questions 239-253 on
24 October 2026 (section 0.3, the decisions with their qualifications, and the points they settle in this text); the implementation follows
the plan of section 10 in eight implementation PRs, 8A to 8H, of which 8A (section 13) and 8B (section 14, added by its own PR, stacked on
8A's) are built in the session that recorded the decisions. Names (section 0.4): "Stage 8 Part A" is this specification only;
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
  visibility separately. A lower jump count alone does not establish a better result. Do not implement 8C during this session." *8C; not
  implemented.*
- **241, arrows and event glyphs: option (a).** "Cap movement-arrow casing width at 16 screen pixels in the perspective presentations, reduce
  the fill to 0.62 of its existing opacity, and cap event glyphs at 64 pixels. Test arrows against the drawn terrain alone, preserving their
  annotation role over buildings and vegetation. Keep lines of battle, boundaries and halt bars at their existing widths and opacity, with the
  specified terrain occlusion. Preserve paths, head forms, side colours, planned-versus-executed distinctions, labels and clock-driven draw-on.
  Keep paper-map arrow widths unchanged. The width cap must respond correctly as the camera moves. Measure the cost of any extra terrain depth
  pass." *Applied in 8B.*
- **242, troop models: option (a), subject to the specified budgets.** "For 8E, improve infantry, horses and riders using the prototype
  direction and existing appearance claims. Preserve miniature scale and sourced colours, headgear and equipment. Complete rendering
  preparation first. Optimise the models and use richer detail only where it is visible. Do not apply the expensive prototype unchanged across
  the entire battlefield." *8E, after 8D; not implemented.*
- **243, artillery: option (a), with explicit source boundaries.** "Use the generic field-piece improvements: spoked wheels, a recognisable
  trail and carriage, improved limbers, appropriate ammunition boxes, and teams behind deployed guns. Retain the single carriage colour and
  current instantaneous deployed/limbered switch. Register and grade each historical claim before using it. Do not generalise IV Corps'
  October authorisation for driver numbers into a demonstrated rule for the Guard, Austrian or Russian artillery. Specify where each source
  applies. Elsewhere use an explicitly identified generic or inferred convention pending stronger evidence." *8E with its data task; not
  implemented.*
- **244, gait: option (a).** "Use a gait whose phase follows the modelled track and clock, with amplitude controlled by the specified
  playback-speed thresholds. No swing when halted, below the proposed 1 km/h cutoff, or under reduced motion. A paused clock must hold the
  pose still. Fade a formation's parts together and ease speed-related amplitude changes. Verify reproducibility when scrubbing, terrain
  contact, moving bounds and shadow behaviour. Describe the animation honestly as a visual convention for symbolic figures under compressed
  time; do not claim physically matched footsteps." *8D (hooks) and 8E; not implemented.*
- **245, uniform facings: option (a).** "Keep decision 104. Do not add facings in this implementation. Reconsider them after the main
  troop-model work can be judged." *Nothing to build; reconsidered after 8E.*
- **246, water: option (a).** "For 8F, improve the meres' ice through material, lighting and restrained tonal variation, with softer shore
  transitions. Keep streams still, darker and less blue. No added stream ice, animated flow, cracks, holes, snow or figures on the ice.
  Preserve geographic outlines and levels. Tune the bright ice margins so they integrate with the surrounding terrain." *8F; not implemented
  (8A draws the streams' ribbons with today's materials, section 13).*
- **247, woodland and near terrain: option (a).** "For 8F, use airier deciduous silhouettes, restrained variation and a finer near-ground
  detail layer. Preserve woodland boundaries, tree counts, the existing conifer shares pending evidence, land-cover classes, frost and crop
  strips. Hold tree geometry within the specified budget and measure transparency costs if introduced." *8F; not implemented.*
- **248, buildings and landmarks: option (a), with the evidence step first.** "For 8G, develop the villages around the cadastral
  street-and-yard pattern and add supported landmarks after research and a documented data task. Keep later maps' relevance to 1805
  explicitly qualified. Unestablished roofing and other forms must remain labelled design conventions. Preserve village locations, footprints
  and symbolic scale. Do not replace the existing church silhouettes with the prototype's weaker generic towers without adequate evidence and
  a convincing visual result. Any proposed geographic correction must be identified and reviewed as such." *8G; not implemented.*
- **249, culling: option (a).** "For 8D, cull figure blocks using correct per-block bounds before adding richer models. Account for changing
  formation shape, terrain seating, animation and shadow visibility. Verify that visible figures and their shadows do not disappear
  incorrectly." *8D; not implemented.*
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

**Status.** Built on `claude/blissful-clarke-9axnzp` (draft PR #65), from `main` at `d86835e` (PR #64, Stage 8 Part A, merged; nothing
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

**Status.** Built on `claude/blissful-clarke-9axnzp-8b` (draft PR #66), **stacked on implementation PR 8A's branch**: its base is
`claude/blissful-clarke-9axnzp`, so its diff is 8B's alone, and it is to be merged after 8A (or retargeted to `main` once 8A is merged). It
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
`docs/stage8-evidence/8b/compare/compare.json`, the build before the patches' change below).** In the eight landscape views compared, 147,088 more
triangles in a frame whose eye has moved, and 2 more draw calls in seven of them (close on Sokolnitz 781 on both): the ground's depth pass,
the field and the apron drawn once more (its own JavaScript 0.1-0.6 ms). The outlines' patches against 8A's filled marks: from 1,934 fewer
triangles to 20,942 more (each patch covers its footprint and the band's reach, where a filled mark covered its grade's extent); with
Position confidence on, 670-9,956 more than with it off. On the paper map nothing (156 calls, 240,915 triangles, as on 8A).
With the eye moving (the pass drawn in every frame), the low Pratzen view took 2.7-3.0 ms more in each of three runs (9.2-9.9 ms on 8A, 11.9-12.9
on 8B, the median of five frames each); the Overview, close on Sokolnitz and the low view with counters moved within their noise (their medians
+1.0, +1.1 and -2.9 ms). With the eye still (the pass kept) no difference beyond the noise. The cap's relayout runs only in a frame whose eye has
moved. On a device's GPU these costs are for the device runs (section 8: 8D before, 8H after).

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
  arrays are deleted, against 884, and the case gives 199 warnings here. The bound is unchanged.
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

Measured on CI (Chromium 141, the runner's; `check:visual`'s 39 cases), 8A's build (run 40075243524) against 8B's
build before its last two changes (run 40075245190, `c260697e`: neither change alters a measure below but the paper map's arrows, section
14.2; the final build's run is named in section 14.7), and compared case by case
(`tools/step3/report-diff.js`):

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
  limit (16%) is unchanged: its marks are drawn as before, and measured the new way give the same shares within 0.01 points in five of its six
  cases; at `paper-close` 14.32% against 13.68%, a view whose movement arrows cross the marks (their casing is now a border there too; that
  this is the cause is not measured).
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
- @@CI8B@@
