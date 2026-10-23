# Appearance and motion: specification (Stage 8, Part A)

> **In progress (a working commit).** Placeholders written `[[NAME]]` mark results still being measured; this note goes when they are
> filled. Nothing below is decided.

**Status: Part A, written for review on `claude/festive-wozniak-vsbtqr` (draft PR). No source file, no data file and no build changed:**
`check:baseline` passes on the unchanged build (`austerlitz-command-map.html`, 2,220,714 bytes, md5 `c4793156103b60bb74151c7d13dbdd9d`) and
`check:data` finds 131 of 131 declarations identical to `archive/step5c-45f8f662.html`. Written against `main` at `9eb7abb` (PR #63 merged);
line numbers refer to that commit; the code is the source of truth. The owner's questions begin at 239 (section 11); nothing in this document
is decided by it.

Scope: the owner's notes for later, L1-L5 (`docs/ROADMAP.md`, "Later: the owner's notes of 7 October 2026"), which the roadmap said "would make
a Stage 8, appearance and motion", and the brief of 23 October 2026 that opened it: (1) the glow or filled bases under the troops; (2) counters
and labels that move with the camera; (3) infantry, cavalry and above all artillery, and movement that is not a slide; (4) the ice, the
shorelines and the streams; (5) buildings and structures; and five further opportunities (arrows; label density and hierarchy; woodland;
terrain texture and the horizon; consistency across the three map presentations), with performance as part of the design and the findings
carried from earlier reviews.

**Scope guard (kept).** Nothing is implemented. No source, data or build file changed; no limit of `tools/visual/thresholds.js` moved
(`DROP_LIMIT`, `UNOBSTRUCTED`, `PAPER_MIN_PXKM`, `CTX_DELETES`, `CONF_SHARE` untouched); three.js stays r128 and the product one
self-contained HTML. Every prototype is JavaScript a probe puts into a live page after it has started, undone after its frame (the frame after
it checked equal to the first in draw calls and triangles), or dying with its page; none is in the source. No GPU frame time could be
measured here (the container has none): every timing in this document is the layout's CPU time or software WebGL and is said to be.

**How this was established.** Every number comes from a script in `tools/stage8/` (committed; not bundled), run against the build above in
headless Chromium with software WebGL (SwiftShader), as the Stage 0 harness and step 6's probes run it:

| script | section | what it does |
|---|---|---|
| `lib.js`, `views.js` | all | the shared page helpers (tools/stage7's, with JPEG captures, contact sheets and an encoder); the views the evidence is taken in: 12 harness cases by name and 23 views fixed by clock, presentation and camera, each chosen from the data |
| `stills.js [--views] [--protos file:id]` | 1-6 | direct captures of the build in each view, and of the same view with a prototype put into the live scene; each frame's draw calls, triangles and map-layer counts beside it; the prototype undone and the frame after it checked |
| `density.js` | 1, 7 | what each view is made of: the share of the free rectangle each class of drawing covers (each hidden in turn and the frames compared), the arrows' widths in pixels, a census of the map layer's labels |
| `label-motion.js [--stab]` | 3 | the map layer driven through pans, zooms, orbits, glides and Play on both map types, 30 frames a second, every item's place read after every frame; jumps, pops, level-of-detail switches, flicker, overlaps and the pass's time; six stabilisers prototyped in the page |
| `record.js --clip` | 3-5 | frame-stepped recordings: the clock advanced by the play speed's share of a second per frame, each frame drawn by the app and captured, encoded at 10 frames a second (MP4 and a small GIF) |
| `kit-census.js` | 4, 8 | triangles per man, horse, gun and house in the build's kit and the prototypes', and the frame with each prototype in place |
| `carried.js` | 9 | the three carried findings, by real clicks, keys and taps |
| `gait-check.js`, `legs.js` | 4.3 | the gait's rule checked in the page; every leg of the movement model with its duration and speed (no page) |
| `sheets.py` | all | the comparison sheets: the build and its prototypes side by side, from the captures |
| `pixdiff.py` | 4-6 | how much of a frame each prototype changes: the pixels of the kept captures whose grey level differs by more than 40 of 255 |
| `stream-vis.js` | 5 | how much of the streams the build draws: the ribbons painted and their pixels counted, with and without their depth test |
| `protos/ground.js`, `labels.js`, `figures.js`, `water.js`, `buildings.js`, `arrows.js` | 2-7 | the prototypes, each an in-page module registering `window.__p8[id]` with `install` and `uninstall` |

Their outputs, screenshots and recordings are in `docs/stage8-evidence/` (its `README.md` lists every file).

**The photographs.** The brief names nine photographs of the current map as references for this session. They did not reach the session (no
attachment, nothing in its uploads folder); this document therefore rests on direct captures of the build instead, which the brief asked for
anyway "for exact comparisons", and makes no statement about what the photographs show. If the owner sends them again, section 1's
assessment can be checked against them (section 12.2).

## In short

- **What the build draws (section 1).** At a distance the battle reads as washes of blue and amber, not troops: the confidence marks are
  what is seen of a formation there. Close up, symbology outweighs the troops: arrow ribbons of fixed world width drawn over everything,
  192-px glyph rings, the C marks spread over slopes, large plain standards. The guns are the weakest drawing (tubes on solid discs, brown
  cubes on the march, switched in one frame). Nothing moves within a formation: blocks slide. The meres are flat plates; the streams the
  bluest line in a winter landscape; every house the same box turned at random; no landmark drawn. The light, the fog, the ground's cover, the
  readings, the interface and the paper map hold up and are kept.
- **L1, the glow (section 2; question 239).** Five alternatives in seven views: recommended, a thin cased outline of each formation's
  footprint in its side's colour, the selection in the accent, and "Position confidence" an optional outline layer, off by default on the
  landscape (supersedes decision 85 there; restyles 87 and 107; keeps 86, 88 and 91: a reported-only formation's C zone and the
  eye level's own side stay as they are; 1x unchanged).
- **L2, labels in motion (section 3; question 240).** Measured over 16 motions and 40,715 item-frames: the build makes 4,003 jumps (an item
  taking another place: 1,549 of them counters) and 165 level-of-detail switches, one pan from the Field vantage swaps 23 counters at once (its
  distance 3% inside the corps switch). Six stabilisers prototyped; recommended, a held layout while the view moves (beside its own anchor or
  faded out), a level-of-detail band released at rest, and fades: 249 jumps (counters 19), no overlap among live items; a view reached
  without motion laid out exactly as today.
- **L3, troops and motion (section 4; questions 242-245).** A richer kit prototyped on three formations: the guns change most and read as
  field pieces; infantry and cavalry change less than expected at the visitor's distances. A gait locked to the clock (the phase a function of
  the modelled track, still when paused, the same when scrubbed, faded out above 3.2 cycles a second, none under reduced motion or below
  1 km/h), and why: at
  ½x a drawn formation already moves 2.6-5 times as fast for its size as a man walks, at 4x 20-40 times. Part of the floating is the model's: 52 of its 147 legs drift at under 1 km/h for two hours or more,
  because a move no source dates is spread over its interval (decision 45); the gait leaves them still. The artillery's sources (Gassendi
  1809, IV Corps' order of 25 October 1805, Teuber, Nilus) give the wheels' proportion, the coffret, one driver a vehicle (as an
  authorisation) and the limbers' place, and no time for limbering. Facings: kept out (decision 104), since only the French classes have them sourced.
- **L4, water (section 5; question 246).** The meres stay ice, varied in material and light; the streams darker and still. The day was mild
  in Prague (4.9-10.6 °C; the Klementinum series), the eyewitnesses disagree on the ice's strength, and nothing read says the streams were
  iced: no stream ice, and no flow, which would also keep an idle page drawing about 11 frames a second.
- **L5, buildings (section 6; question 248).** The villages re-laid on the 1825-1826 cadastre's pattern (dwellings end-on to the street,
  barns across the yards); the landmarks the sources support (Sokolnitz castle's quadrangle, the fences of Telnitz and Sokolnitz) after an evidence
  step, and the two chapels once their state on the day is read (St Anthony's roof is not found; the Santon's was destroyed during the
  battle); the pheasantry's wall, dated later, is not proposed.
- **Further (section 7; questions 241, 247).** The arrows capped at 16 px on screen and hidden by the ground alone; the glyphs at 64 px;
  airier woods; a detail layer near the eye.
- **Performance (section 8; questions 249, 250).** Budgets stated before anything is built (the phone's heavy views at most 1.62 million
  triangles; an integrated-GPU run before any PR adds more than 10%); block culling first; the gait free of calls and triangles; the
  effects-off question as a bracketed run.
- **Carried findings (section 9; question 251).** All three still present: under a reading, "Centre the map here" goes to the true
  position of a formation the reading does not know; the dossier's sources are at its end (6,000 px down); a timeline tip stays
  after its element is activated (an extra Esc; on a phone it stays on the screen). Of the audit's unassigned findings, A-5, S-5, S-7, A-6,
  G-2, P-2 and T-7 are still present and P-3 partly.
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

[[S1-DENSITY]]

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
- **Water** (`ph8-overview-watch-base.jpg`, `ice-high-base.jpg`, `water/ice-mid-base.jpg`, `stream-low-base.jpg`). The meres are flat ellipses of one
  grey-blue with a lighter ring at the shore: from above they read as plates laid on the field, with a hard edge where the ground meets them;
  the computed sun's sheen is the only variation. The streams are bright blue-grey ribbons of one width on a darker bank ribbon, the bluest
  thing in a winter landscape.
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

[[S2-MEASURE]]

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

The probe drives the app's own camera functions one 30 fps frame at a time (a pan of 8 px a frame, a zoom of 3% a frame in and then out, an orbit of
6 px a frame, a glide by the app's own arc, Play at ½x with Follow from 09:00) in four views at 1600 x 900 in Study (Landscape with counters and the
landscape from the Field vantage at 09:30, the low Pratzen view at 09:50, the paper map as entered at 09:30), runs the frame's state pass and the map layer's pass as a
drawn frame does, and reads every item's state and box after each frame: 16 motions, 40,715 item-frames (an item in view in two successive
frames). A **jump** is an item drawn in both frames whose box moved more than 3 px against its own anchor (it took another place); a **pop**
an item in view in both frames that went from drawn to dropped or hidden, or back; a **level-of-detail switch** an item entering or leaving
the layer's list in view; a **flicker** an item drawn, gone and drawn again within 10 frames (leaving the screen or passing under a panel
counts here too, though not as a pop); an **overlap** two drawn boxes overlapping (the
layer's rule is none).

**The build (stabiliser "none").** 4,003 jumps in 40,715 item-frames (9.8 per 100; in a zoom, 8 or 9 of the
about 30 items in view change place in every frame), 791 pops (1.9 per 100), 165 level-of-detail switches, 232 flickers, no overlap. The worst
motions are the zooms and orbits: the paper map's zoom 572 jumps (27 per 100 item-frames), Landscape with counters' zoom 519 and orbit 490,
the landscape's orbit 438, the glides 283-372; Play is quieter but not still (Landscape with counters 245, the landscape 205, the paper map
117). By kind: counters 1,549 jumps, the arrows' labels 1,013, the landscape's names 965, the objective markers 223, places 156, the plateau
reading 80, events 17; the places pop most (468: the major/minor range at 210 units and the ground's occlusion). One pan from the Field
vantage swaps the division counters for their corps' (23 counters entering or leaving at once, `hybrid-pan`; the 250-unit switch 3% away). The layer's pass took a median
1.1-3.0 ms per frame and a 95th percentile 1.8-12.3 ms (CPU in this page; a single frame's maximum, up to 313 ms, varies between runs of the
same motion without pattern, 2.8 to 97.7 ms for the same orbit, and is read as the page's own pauses, not the layout).

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

The six stabilisers (with the build, seven variants) keep the layer's rules as they stand at rest (priority order, the never-dropped items, panels and arrow heads as obstacles, leader
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
  The jumps fall to 247 (94% fewer; those left are an item moved to a place beside its own anchor, never across the screen: counters 19
  against the build's 1,549), the pops to 1,143 (45% more than the build's, 36% fewer than anchor's), the flicker below the build's (162).
- **anchor2+band**: anchor2 with persist+hold's level-of-detail band. The band moves the level-of-detail switches to the moment the view stops; the rest as anchor2: 249 jumps (counters 19), 1,156 pops,
  171 flickers, no overlap. About a fifth fewer items are drawn while the view moves (366 against 471, the medians summed); at rest they
  come back (76 reappearances in the frame after the motion, and 45 items take a new place there), which the fades below soften.

**Fades.** A pop is a placement event whatever the rule; what the eye minds is its suddenness. `protos/labels.js` adds `l-fade`: an item
appearing or leaving fades over 180 ms of real time (a leaving item drawn at its last place, under the others, taking no pointer); none
under reduced motion. It changes no placement, so the probe's counts are those of anchor2+band; the recordings show it
(`clips/paper-zoom.mp4`, `clips/hybrid-orbit.mp4`, `clips/hybrid-zoom.mp4`, `clips/paper-play.mp4`: the build above, the prototype below,
the same frames).

### 3.4 Recommended (question 240): anchor2 with the band, and fades

**anchor2+band with `l-fade`'s fades**: while the view moves, every counter and name keeps its place beside its own anchor; one whose place is
taken moves only to a place hugging its anchor, else fades out; what has no room is looked for again every 333 ms and fades in after two passes
with room; the level-of-detail switches act on a distance held inside an 8% band. **At rest** the band is released (the switches read the true
distance, so a view's corps or divisions never depend on how it was reached) and each item first tries the place it held, then the build's own
search (persist). It is the only stabiliser that removes the darting the owner describes (counters' jumps from 1,549 to 19, all jumps from
4,003 to 249, never across the screen) without breaking the layer's rules (no overlap among live items in any frame); its price is a fifth
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

**What they show** (`docs/stage8-evidence/figures/` at the views' distances; `figures-close/` closer, with the build beside each):
- **The guns are where the kit changes most**, partly because the prototype also draws what the build does not (the limbers and teams
  behind the deployed guns, the coffret): the frame rises by 93,800 triangles and four draw calls in `bat-front` (`figure-stills.json`), all three formations' kits together, against
  50,300 and none in `inf-front` and `cav-front`, where the guns are not yet on the field (their first anchor is in phase 7). The build's battery is a row of dark tubes on solid brown discs as large as a man
  (`bat-front-base.jpg`); with `f-kit` each gun stands on spoked wheels with its trail to the ground and its crew about it, and reads as a field
  piece at the Field vantage's distances as well as close (`bat-front-f-kit.jpg`; close up, `figures-close/bat-deployed-*.jpg`: the build's gun is a dark tube laid between two solid
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
  houses and under two Allied arrows): those frames are the arrows', the standards' and a glyph ring's (section 4.5). The kit is what the
  guns need at every distance; for infantry and cavalry it is a refinement of the close views, and not what the distant views need (their
  problem is section 2's and section 7's).
- **A fault found on the way, recorded.** The kit's first captures drew the horse's barrel white on the cavalry's and the officers' horses
  (the part was left uncoloured) and the teams' brown twice, too dark; fixed in the prototype (the barrel takes the class's horse colour,
  decision 109's one brown) and every figure capture retaken with the fix (`figure-stills.json`, `figure-facings.json`; the close views were
  taken after it).
- **The facings** (`inf-front-f-facings.jpg`) are the most legible single change for the French line infantry (section 4.6).
- **What dominates the close views is still not the troops**: in `bat-front` a movement arrow's ribbon, drawn over everything at its fixed
  width, covers a third of the frame and every formation under it, in all three variants (section 7.1).

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
  ½x and 1x the march is seen; at 4x the formations glide as today, which is honest about a clock running 2,400 times faster than the day;
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
its mounted officers', whose stride is longer; the infantry's follow from the amplitude it records). The guns on the heights (13:45-14:30): 0.7 cycles a second at ½x, 1.4 at 1x and 2.8 at 2x,
full swing; none at 4x.

**The drift the gait must not animate** (`tools/stage8/legs.js`, `legs.json`, the model's own legs): of the 147 legs the clock moves, 92 run
at under 1 km/h, 52 of them for two hours or more: Nansouty's division covers 1.85 km between 04:00 and 10:30 (0.28 km/h), Saint-Hilaire's
0.35 km between 04:00 and 08:00. A leg with no dated departure is spread over its whole interval: decision 45 ("Creeping moves ... otherwise
nothing is invented, today's behaviour stays, and while the formation is between anchors the dossier shows the existing 'interpolated'
marker"). So part of what the owner saw as floating is the model saying it does not know when a formation moved; a block drifting its own
width in an hour of the clock is that statement, not a march. **The gait draws no swing below 1 km/h** (DESIGN: a drift between anchors,
not a march), so it never animates a move the sources do not date; a dated departure, where a text gives one, remains a data task under
decisions 40-45.

What it does not do: no figure turns, kneels, fires, falls or runs; no casualty is drawn and no formation thins with losses (`docs/VISUAL_AUDIT.md`
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
- **The gait (244):** the rule of section 4.3 as prototyped. (b) no gait; (c) a gait in real time, independent of the clock (rejected here:
  it would step while the clock stands and differ when scrubbed). **Recommended: (a).**
- **Acceptance (8E):** every 6C and 6D self-test check passing with its meaning unchanged (each figure's class colours, headgear, legwear and
  cuirass; the standards' carriers, counts, cloths, proportions, finials, the ratio at 1x, 4x and 10.33x); the gait's rule held by the
  self-test (`tools/stage8/gait-check.js`'s cases made checks: the pose identical from three paths to a clock, still while paused, none on a
  halted formation or under reduced motion, the fade above 3.2 cycles a second); the figures seated on the drawn ground in every pose within
  the existing tolerance; the battery's driver count, wheel ratio and coffret as their registered readings; section 8.3's budgets.

## 5. Ice, shorelines and streams (the owner's note L4; the brief's priority 4)

### 5.1 What is drawn today (fact, `world.js` `buildWater`, `WATER_COL`, `ICE`; Stage 4E)

The two meres are ellipses (`CircleGeometry`, 48 segments) of one ice material (`WATER_COL.ice` `#4E5C66`, roughness 0.32, the environment's
weight 0.42, 96% opaque), each with a ring of shore ice over its outer 14% (`#75838B`, rougher), at a level kept under the drawn ground's edge
at every factor; their outlines are schematic (decision 27: no outline changes without a georeferenced source). The streams are ribbons of
one width each (the Goldbach 2.8 units, the Littawa 3.2, the brooks 1.4) in one blue-grey (`#587A8E`) on a darker bank ribbon, draped on the ground. Stage
4E's rule for the meres (`docs/STAGE4_SPEC.md` §F.1, as built): ice, "No cracking, breaking or figures in the water ... no snow", nothing
that suggests mass drowning (`docs/VISUAL_AUDIT.md` opportunity 4). (`docs/ROADMAP.md`'s note L4 words it "no cracks, holes, snow or figures
in the water" and attributes it to decision 79, which is the colours' tables; the rule is §F.1's recommendation as 4E built it. A records
slip, noted here, not changed.)

What a visitor sees (`ice-high-base.jpg`, `water/ice-mid-base.jpg`, `ph8-overview-watch-base.jpg`): from above, two flat plates of
one grey-blue laid on the field, the shore ring a second flat tone, a hard edge where the ground meets them; the computed sun's sheen the only
variation. The streams (`stream-low-base.jpg`): the bluest and brightest line in a winter landscape, of one width from source to mouth.

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
| `w-stream` | the streams darker and less blue, reflecting the sky at grazing angles; the banks a little darker at the water | DESIGN |
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
- **The streams** (`stream-low-*.jpg`, the Goldbach at 08:20 in the valley fog; the clip `clips/stream-flow.mp4` closer): `w-stream`
  takes the brightest blue line out of the fogged valley; it reads as water rather than as a drawn line, though at this distance the change
  is small; `w-streamice`'s pale rim is invisible here and would show only close up, which is as well, since nothing read supports it. The
  same draw calls and triangles; removed cleanly.

### 5.4 Stream movement, assessed on its own

- **Known:** the Goldbach ran between marshy meadows with steep banks in places (Schönhals, Ségur, Mikhailovsky-Danilevsky); the roads
  were muddy by the afternoon (Schönhals); the days before were mild in Prague (the Klementinum series).
- **Uncertain:** whether the streams carried ice on the day; how fast they ran. No source read describes their surface on 2 December.
- **The cost of moving water.** The build draws on demand: with the clock stopped and nothing in motion it draws no frame at all, and its
  ambient frames (about 11 a second, `AMBIENT_MS` 90) run only while smoke, dust or a broken formation is in view, never under reduced motion
  (`ambientNow`, `app.js:7584`). A flowing stream is in view in almost every landscape frame, so it would turn an idle page into one drawing
  about 11 frames a second for as long as it is open, on a phone too; and a flow in real time while the clock stands is the one motion on the
  map that would not be the clock's.
- **Recommendation:** no flow; the streams still, darker and less blue (`w-stream`); no stream ice. The flow stays a documented option
  (question 246 (c)), with its cost.

### 5.5 Recommended (question 246)

**(a): `w-ice` and `w-stream`, still, no stream ice**: the meres' material varied (a frosted margin as Ségur's "blanchi par les frimas" has
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
the world is a hairline in the Overview and a band [[ARROWPX]] across in the low and close views, where the heads cover battalions and, at the eye
level, the arrows show through the hills (the audit's A-5, recorded in 5E and still present).

**Prototyped (`protos/arrows.js`; `docs/stage8-evidence/arrows/`).** The prototypes wrap the build's `drapedRibbon`, so they act on every draped
ribbon of the overlays: the movement arrows, and also the lines of battle, the boundaries and the halt bars. `a-cap`: each ribbon's width
capped so its casing is at most 16 px across at its middle (the head scaled with it; never widened; a ribbon whose middle lies
behind the eye left as it is: the prototype's first run failed on one, in `inf-mid`, and was run again with this rule). `a-soft`: `a-cap`, every ribbon's
opacity at 0.62 (fills and casings), and the ribbons depth-tested: the arrows, lifted 2.4 units, pass above the men's 1.88 units, but the
lines of battle (lifted 1.9) and the boundaries (1.6) do not, so in these captures the figures cut them. `a-calm`: `a-soft` with the event
glyphs capped at 64 px instead of 192.
[[S7-ARROWS]]

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
horizon at one weight (`horizon-east-base.jpg`), while the views from above draw 15-24.

[[S7-LABELS-CENSUS]]

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

### 7.6 The event glyphs

**Today (fact).** Event glyphs (a ringed cross, a circled arrow) and objective markers are sprites, capped at `SYM_MAX_PX` 192 px on screen
and faded near the eye (decision 57, `app.js:3193`). In the close views a glyph is the largest single shape after the arrows: 150-190 px
rings over the troops (`inf-front-base.jpg`, `cav-close-base.jpg`), in the eye-level views over the horizon. `a-calm` caps them at 64 px (the
event's map label and its tag unchanged, the glyph's hit area unchanged, decision 167's exception for the markers on the timeline untouched).
[[S7-GLYPHRES]]

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
pass, `lowTier`) from about 1.47 to 1.9-2.1 million (+29-44%). That is outside both budgets of section 8.3 by a wide margin. Three levers,
each measured in step 6 or here, bring it back: block culling (8D: 13.7% of the low view's frame, nothing in the Overview); a lighter kit
(the prototype was shaped for the picture, not for its count: the head alone is an 80-triangle icosahedron, and 8E's target is at most 1.3
times the build's per man); and the rich kit only where it is seen (a man 16 px or more: the low and close views), the build's kit beyond,
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

## 9. Findings carried from earlier reviews (checked on the build, not assumed)

The brief names three; each was checked on the unchanged build by real clicks, keys and taps (`tools/stage8/carried.js`;
`docs/stage8-evidence/carried.json`). The audit findings no roadmap step took up are checked after them, each against the current code.
None is fixed here; each fix is proposed in PR 8A (section 10) or where it belongs.

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
| **8A** | the carried findings (section 9.1-9.3) | the brief's carried findings | question 251 |
| **8B** | the ground under the troops; the arrows and the event glyphs calmed | L1; A-5; 7.1, 7.6 | questions 239, 241 |
| **8C** | the map layer in motion; the hierarchy by distance in the low views | L2; 7.2 | question 240 |
| **8D** | rendering preparation: the blocks culled by their bounds; the kit's part attribute and the gait's shader hooks; the census held by a check; the device runs before | section 8 | questions 249, 250 |
| **8E** | the troops: the kit for every class, the artillery, the gait; the facing per leg (S-5) | L3; S-5 | questions 242-245; 8D |
| **8F** | the water; the woods and the near ground | L4; 7.3, 7.4 | questions 246, 247 |
| **8G** | buildings: the evidence step, then the villages, then the landmarks (a data task) | L5 | question 248 |
| **8H** | integration: accessibility, the device runs after, the effects-off bracket, S-7, the open polish findings | all; 8.5; 9.4 | everything above |

### 8A: the carried findings
- **Benefit:** the knowledge rule holds for the camera too (no centring on what the reading cannot see); a dossier's sources are one
  link from its head; the timeline's tips stop outstaying their use.
- **Systems:** `app.js` (the dossier's centring under a reading; the dossier's source block; `bindTimeTips`); the self-test, runtime-test.
- **Evidence:** none (presentation); `carried.js` re-run as the before and after.
- **Performance:** none.
- **Acceptance:** under each reading, every 30 minutes, "Centre the map here" and the order of battle's rows centre on `readPos` within
  0.5 units, and nothing for a formation the reading does not know (runtime-test, as for 170 (b)); the dossier's source link inside the
  visible box at 1366 x 768 and on the phone (the self-test); Enter, then one Esc closes an event's dossier with no tip left shown (real keys),
  and a tap on a phone shows no tip (the phone case); `carried.js` re-run showing each fixed.

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
  clocks, still with the clock stopped, no swing on a halted formation or under reduced motion, the fade above 3.2 cycles a second; figures
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
- **Benefit:** the whole measured together, on the owner's devices; the open polish findings closed.
- **Systems:** all; `check:visual`, `check:contrast`, `check:selftest`.
- **Evidence:** the device route after (desktop, phone, and an integrated-GPU laptop if one can be had); the effects-off bracket (section 8.5).
- **Acceptance:** section 8.3's budgets on every device run; every check passing; the records.

## 11. Questions for the owner (239-252)

Each question names its options, a recommendation, what it would supersede or extend, and its cost. Nothing is decided by this document; the
build stays as it is until the answers. A limit of `tools/visual/thresholds.js` moves only on the owner's word, in the PR that measures it.

| # | question | options | recommended | supersedes or extends | cost |
|---|---|---|---|---|---|
| **239** | The ground under the troops (L1; section 2) | (a) remove the marks and decision 107's footprint from the landscape (`g-none`); (b) **a thin cased outline** of the footprint in the side's colour under every formation drawn as figures, the selection outlined in the accent, "Position confidence" an optional layer **off by default on the landscape** drawing the grade's extents as outlines (`g-outline`, `g-confline`), the paper map as today; a reported-only formation's C zone and the eye level's own side kept as they are (decision 91), and at 1x the footprint drawn by its grade whatever the layer; (c) a small cased chevron ahead of each formation (`g-marker`) with the same optional layer; (d) as today | **(b)** | supersedes 85 on the landscape (on by default); restyles 87 and 107 (a footprint under every formation, drawn as its edge); keeps 86, 88, 91, 1, 4, 15 (one hue a side, no dash: each outline split on the drawn ground's triangles), 34 (1x drawn as today), the pads | PR 8B; the 5B and 6C self-test checks rewritten to the outline; `CONF_SHARE` replaced by the outline's share, its limit as 8B measures it; `css-test.js`'s default; the legend; about 31 draw calls more unless the outlines are merged into one mesh |
| **240** | The map layer in motion (L2; section 3) and its hierarchy in the low views (section 7.2) | (a) **anchor2 with the band, and fades**: held beside its anchor while the view moves, else faded out; looked for again every 333 ms; the level-of-detail switches banded 8% while moving, released at rest; at rest each item first tries its last place; **and the far items a step smaller**; (b) as (a), and the far items yielding first in the low views (more drops there: their limits only on the owner's word); (c) persist+hold: the last place first, a returning item after four frames with room, the band, without the fades; (d) as today | **(a)** | none; decisions 24, 38, 39 and 47 kept as invariants (section 3.4) | PR 8C; a motion block added to `check:visual`, its limits as 8C measures them |
| **241** | The arrows and the event glyphs (section 7.1, 7.6; A-5) | (a) **each arrow's width capped at 16 px on screen in the two perspective presentations, the ribbons depth-tested, their fill at 0.62 of today's opacity, the glyphs capped at 64 px** (`a-calm`); (b) the cap only (`a-cap`); (c) as today | **(a)** | decision 57's value (192 px) and 2C's "over everything" (the depth test); keeps 1, 15, 20, 21, 83 (form, dash, chevron, boundaries, draw-on) | PR 8B; `binding-test.js` unchanged; the eye-level cases read against a depth-only frame |
| **242** | The figures' kit (L3; section 4) | (a) **`f-kit` for every class**: the man, the horse and the rider redrawn in more parts, every colour, headgear and cuirass from the existing claims; (b) the artillery only; (c) as today | **(a)** | extends 6C's shapes (DESIGN); keeps 97, 100, 102, 103, 104, 106, 109 | PR 8E; on every formation the prototype's kit would add 34-52% to the 4x frame: only with culling (249), a kit of at most 1.3 times the build's per man, and the rich kit where a man is 16 px or more on screen, within section 8.3's budgets |
| **243** | The artillery (L3; section 4.4) | (a) **the generic field piece**: spoked wheels in Gassendi's proportion, a bracket trail, the French coffret between the cheeks when limbered, the Allied limbers' box, one driver a vehicle (two for six horses: IV Corps' order, an authorisation), the limbers and teams behind the deployed guns, four horses a drawn gun, one carriage colour, the switch between the groups as today; each reading registered in `appearance.js` first; (b) as (a), with each army's carriage colour where sourced (French olive, Austrian ochre, the Russian generic); (c) as today | **(a)** | (b) would extend 109 ("one colour unless each army's is sourced": two of three are) | PR 8E with its data task (the readings of `leads.md` topic 1, graded and registered) |
| **244** | The gait (L3; section 4.3) | (a) **the clock's gait**: the swing's phase a function of the clock alone (the modelled track's distance over a design stride), its amplitude the play speed's (faded out above 3.2 cycles a second on screen, eased when the speed changes), none under reduced motion, when halted, or below 1 km/h (the drift of an undated leg, decision 45); (b) no gait; (c) a gait in real time | **(a)** | none (VISUAL_AUDIT's "do not animate losses" kept: no figure falls) | PR 8D (the shader hooks), 8E; no draw call, no triangle |
| **245** | Facings (decision 104; section 4.6) | (a) **keep decision 104**: no facings; (b) class-level facings where the table settles them at A or B, after a data task gives them colour classes (today the French line and the Guard's foot grenadiers; the Allied classes' facings are regimental) | **(a)**, reconsidered after 8E | (b) extends 104 | none for (a) |
| **246** | Water (L4; section 5) | (a) **the meres' ice varied in material and light** (`w-ice`: a frosted margin easing into clearer, glossier ice; a broad tonal variation; a stronger reflection at grazing angles; the shore ring feathered), **the streams darker and less blue** (`w-stream`), **still, no stream ice**; (b) as (a) with edge ice on the streams; (c) as (a) with the streams flowing; (d) as today | **(a)** | keeps 27 (outlines), §F.1's rule (no crack, hole, snow or figure), 79 (the colours' tables) | PR 8F; (c) would make an idle page draw about 11 frames a second whenever a stream is in view |
| **247** | Woods and the near ground (section 7.3, 7.4) | (a) **airier deciduous crowns** and a little more variation, the conifer shares kept until sourced; **a detail layer near the eye** on the ground (no new class or colour); (b) the woods only; (c) as today | **(a)** | keeps 2F's cover checks and "bare winter trees, frost on north-facing slopes, crop strips" | PR 8F; the trees' triangles per tree held at or under today's |
| **248** | Buildings and landmarks (L5; section 6) | (a) **the villages re-laid on the cadastre's pattern** (dwellings end-on or L-shaped to the street, barns across the yards' ends; the roofing a placeholder until read), the churches turned east-west, **then, after an evidence step and a data task, the landmarks the sources support**: the Sokolnitz castle as Wolny's quadrangle, the fences round Telnitz and Sokolnitz; the two chapels once their state on the day is settled (St Anthony's roof not found; the Santon's destroyed during the battle); (b) the villages only; (c) as today | **(a)** | keeps 14 (the building scale), 2E's village footprints, the villages' places and counts; the landmarks are a data task (`data.js` or `world.js`, with their claims) | PR 8G; the villages about 8,700 triangles, 10,200 with the landmarks |
| **249** | Culling the figure blocks (section 8.4) | (a) **each block culled by its own bounds** (decision 221 tied culling to a built 138, which decision 235 retired), in 8D, before the kit; (b) not | **(a)** | reopens 221's condition | PR 8D; nothing on screen changes; the self-test's figure checks read through it |
| **250** | Budgets and device runs (section 8.3, 8.5) | (a) **the budgets of section 8.3** (the phone's heavy views at most 1.62 million triangles, the desktop's 4x frame at most 2.8 million and 900 calls, the map layer's pass not above the build's in the same motions by more than 0.5 ms at the median and 2 ms at the 95th percentile, the gait free of calls and triangles), **an integrated-GPU run before any PR adding more than 10%**, the device route before and after the PRs that change the drawing; (b) as (a), and **the bracketed effects-off run** on the phone (section 8.5) | **(b)** | keeps 236's `lowTier` | the owner's runs: about 15 minutes each |
| **251** | The carried findings (section 9.1-9.3) | (a) **fix all three in 8A** as section 9 proposes: the centring on a formation the reading does not know withheld, the dossier's sources one link from its head, the timeline's tip hidden once its element is activated; (b) fix 9.1 only (it is the knowledge rule's); (c) record them | **(a)** | extends 170 (b)'s rule to the centring | PR 8A, small |
| **252** | The plan (section 10) | (a) **PRs 8A-8H in that order**, each a draft for review with its measures; (b) another order | **(a)** | none | as section 10 |

## 12. Verification, and what remains to be measured

### 12.1 What was run, with its result

| check | result |
|---|---|
| `npm test` on `main` at `9eb7abb` (before any Stage 8 file existed) | all nine suites and the height guard pass (5 min 47 s) |
| `npm run check:data` | 131 of 131 declarations identical to `archive/step5c-45f8f662.html` |
| `npm run check:chronology` | 0 errors |
| `npm run check:baseline` | passes: `austerlitz-command-map.html` 2,220,714 bytes, md5 `c4793156103b60bb74151c7d13dbdd9d`, unchanged by this document |
| [[S12-FINAL]] | |
| every probe of `tools/stage8/` | run to its end on the build above; outputs in `docs/stage8-evidence/` (the README lists each) |
| each prototype undone | the frame after each prototype's removal equal to the frame before it in draw calls and triangles ([[UNDO-COUNT]] removals checked by `stills.js`) |

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
