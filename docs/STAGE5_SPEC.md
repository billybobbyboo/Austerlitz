# Evidence made visible: specification (Stage 5, Part A)

**Status: Part A merged (#32); the owner answered questions 1-4 (decisions 85-88, §0.4). 5B (spatial confidence) is merged (#33). The
owner answered question 6 (decision 89, §0.4); 5C (interval bars, one event clock) is implemented, for review; what 5B and 5C found is
at the end of §I. Sections A-J below still describe the build they were written against.** Written against `main` at `407cda0` (Stage 4E
merged as #31; with it Stage 4 is complete), whose build `austerlitz-command-map.html` is 1,416,737 bytes, md5
`e1fac9ea08a4c2b2eaefe5b78529c843`. On it (the same build throughout: this part changes no source file): `check:baseline` passed; `npm test` (all nine suites and the height
guard) passed; `check:data` found all 113 declarations identical to `archive/stage4d-9b13adbf.html`; `check:chronology` reported 0
errors; `check:contrast` (4,250 text elements in 28 states, 0 below AA, 0 below 10.5 px) and `check:visual` (20 views, the self-test 157
of 157) passed (§H.0). Line numbers refer to that commit; the code is the source of truth, not the documents.

Scope: the Stage 5 line of `docs/VISUAL_AUDIT.md` ("Spatial confidence, evidence skeleton, interval events, "Whose eyes?" with
eye-level views from the command posts (needs Stage 2's true-scale relief), plan ghosts, day-tracks"), which carries high-impact
problem 9 ("Uncertainty is invisible in the default view") and opportunity 1 ("Make the evidence layer the signature"). §0.2 lists
what else the records assign to Stage 5. Parts 5B onward implement it; this part measures, prototypes and specifies.

**Scope guard (the brief; kept).** No historical, geographic, chronological, order-of-battle, grade or `OVERLAYS` change; nothing
from Stage 6 (uniforms, headgear, flags) or Stage 7 (first run, opening sequence); nothing implemented. Stage 5 makes existing
evidence visible; it does not create evidence. Every reading drawn from a model (knowledge, line of sight, the fog, interpolated
legs) is labelled as a model reading, never presented as a record. Where a design would need data the project does not have (a
grade not present, a distance a grade does not give, a source not cited), it is listed as a separate data task (§G.3), not
invented. The radii, falloffs and opacities the probes try are **design values for the measurement**, not error bounds.

**How this was established.** Every number below was produced by a script in `tools/stage5/` (committed; not bundled), run
against the build above. `census.js` reads the live sources in node through `tools/stage2/model.js`. The page scripts drive the
built page in headless Chromium with software WebGL, as the Stage 0 harness does (`tools/stage2/page.js`, which injects
`tools/visual/measure.js`), and inject a **probe**: measurement code that adds prototype meshes or elements to the running page,
measures, and removes them; it is not the Stage 5 implementation. Coverage is measured as rendered: two screenshots of the same
view, without and with the prototype; the share of the free rectangle (outside every panel and map-layer item) whose pixels changed,
and the WCAG luminance ratio of each changed pixel against the same pixel before (the encoding against the ground it lies on;
non-text needs 3:1). Frame times are software WebGL on the harness machine: comparable with one another, not with a GPU. Evidence
is in `docs/stage5-evidence/` (its README lists every file, its section and its script).

Labels, as in the earlier specifications: **fact** (read from the code or data, or measured), **derived** (computed from facts),
**recommendation** (a proposal for 5B onward), **open** (needs the owner). Owner decisions are cited by number (1-17 in
`docs/VISUAL_SPEC.md`, 18-46 in `docs/STAGE2_SPEC.md`, 47-67 in `docs/STAGE3_SPEC.md`, 68-84 in `docs/STAGE4_SPEC.md`).

| script | section | what it produces |
|---|---|---|
| `census.js [--json f] [--md f]` | 0, A-F | in node, from the live sources: every leaf formation's position grade every 10 minutes and per phase (the app's `confAt`); anchors, legs and the timing evidence (`tm`); the events' windows; the Command view's rule every 10 minutes from each headquarters without the page's cache; each plan column against the tracks; the phase-0 axis arrows against the plan routes; each formation's day as a track; duplicate keys in the data's object literals |
| `confidence-probe.js [--json f] [--sheet f] [--only views]` | A | four spatial-confidence encodings drawn under the formations (every formation as its footprint; graded A crisp / B soft frontage / C diffuse zone at two radii; B and C only) in every landscape harness view, four at 1x and 10.33x, and two paper-map views: grades in view, coverage and contrast as rendered, drops, map text contrast, darkness, the world pass's time, the drape |
| `skeleton-probe.js [--json f] [--sheet f] [--only views]` | B | the evidence skeleton (anchors by grade, legs as thin draped lines) in three scopes (the day, the phase, the selected family) in the same views and three paper-map views: what is drawn, coverage and contrast, drops, map text, the world pass's time, the drape |
| `layout-probe.js [--json f] [--sheet f]` | C, F | the timeline at three sizes in Study and Watch: its height against Stage 3C's 92 px, the intervals packed in lanes, a prototype of the bars inside the marker band, the bars' contrast, each interval's marker against its dwell; the dossier's size, and each formation's day-track fitted into it (derived from `census.json`) |
| `eyes-probe.js [--json f] [--sheet f] [--cache-only]` | D | the Command view's reading as drawn against the reading at the clock; what it changes on screen in each presentation; the viewshed from each headquarters' anchors and under the fog's top; the two line-of-sight implementations against each other; an eye 3 m above the drawn ground at the headquarters at each factor (the drawn line of sight against the model's, what the drawing shows that the model hides, sizes on screen, the camera floor and near plane); a sheet from Napoleon's post |
| `plans-probe.js [--json f] [--sheet f] [--only views]` | E | the Plans overlay as drawn today (both plans) and a prototype of plan ghosts (the ordered routes as thin depth-tested ribbons) in the landscape views, four at 1x and 10.33x, and the paper map: coverage and contrast, drops, map text, the world pass's time |
| `lib.js` | - | shared by the page probes: the views, the screenshot comparison, the world pass's timer |

## 0. The decisions, the scope and the records against the evidence

### 0.1 Decisions that bind Stage 5

| # | decision (summary) | what it means for Stage 5 |
|---|---|---|
| 4, 13 | Counter confidence: no dashed or dotted frames; B and C by a plated letter badge; "reported only" keeps its "?" (the 82% opacity dropped). | The spatial encoding may not use dashes or dotted outlines for B or C; the badge stays the counter's encoding. |
| 10 | Evidence-layer and source tags neutral, by icon and text (record: filled circle; reconstruction: hollow circle; derived: diamond). | A model reading is a **derived** reading in the app's own taxonomy (`SOURCE_NOTE.layers`, `data.js:769`: "What the engine computes from the plot ... Never a source figure; always marked derived"). "Whose eyes?", the skeleton's legs and the interpolated positions are labelled with that tag and its diamond. |
| 15 | Dashes mean "planned or intended" only. | The plan ghosts may be dashed (they are plans); spatial confidence and the skeleton may not. |
| 1, 9 | Side owns hue (French blue, Allied amber on symbology); nation colours on counters; hue never carries evidence. | Grade is carried by shape and sharpness (crisp, soft, diffuse), never by a new hue; zones keep the side's colour. |
| 16, 38, 39, 62 | Type floors; map text on plates at AA as rendered; drops per view within `DROP_LIMIT`, never the selection, the highlighted family or live events; drop limits only tighten. | Every new ground drawing changes the pixels under the map layer: contrast as rendered is measured per prototype (§A.3, §B.2, §E.2). Nothing in Stage 5 may raise a drop limit. |
| 19, 35 | The display factor is presentation (1x, 4x default, 10.33x); `height()`, `hAt()`, viewsheds and line of sight stay on the model. | Every ground drawing is measured at all three factors. Line of sight is the model's at every factor (§D.4 shows the drawn ground agrees with it when the eye's metre is scaled). |
| 34 | At 1x formations are drawn as their modelled footprints (`makeFootprint`, `placeFootprint`, `app.js:1246-1262`), "one primitive that Stage 5's spatial-confidence display can reuse". | §A reuses it; its lift (0.25 world units, about 16 m at 1x) matters at eye level (§D.4). |
| 47 | Follow is `!freeCam` made visible; a pan, orbit, zoom or double-click turns it off. | An eye-level view (§D) is a camera path: it turns Follow off and keeps the rule. |
| 72, 73 | The valley fog drawn at most 55% opaque, its top the knowledge model's 238.2 m; the evening mist (phases 8-9) kept, labelled "modelled". | "Whose eyes?" reads the same fog rule; it does not draw a second fog. |
| 75, 83 | A dwell at each event's **start**; derived arrows drawn whole and faint ("ghost and progress"). | The timeline's marker stands at an interval's **midpoint** while the dwell lights it at its start (§C.1). "Ghost" already names the faint whole arrow of decision 83: the plan ghosts need another word in the interface (§E.3). |

"Things that should not change" (`docs/VISUAL_AUDIT.md`) that Stage 5 touches: **the claim/grade/layer taxonomy and "derived"
labelling** (kept and extended to every model reading); **the dossier structure and its progressive disclosure** (the day-track is a
section of it, §F); **the Command view, Plans, plateau and centre-separation readings** (kept; "Whose eyes?" promotes the Command
view, it does not replace its rule, §D); **continuous clock-driven positions** (the skeleton draws the anchors and legs the clock
already interpolates; nothing moves); **the restrained dark UI** and **reduced-motion support** (the encodings are static; none
animates).

### 0.2 What the records assign to Stage 5 (the scope)

| item | where it is assigned | section |
|---|---|---|
| Spatial confidence: "crisp footprint A, soft frontage B, diffuse zone C" | roadmap, Stage 5 line; opportunity 1; problem 9; `docs/VISUAL_SPEC.md:182` ("spatial encoding in Stage 5"), `:518-520` (§10.2: "a known gap"); `app.js:1243-1245`, `CHANGELOG.md:1958` (the footprint "meant for reuse by Stage 5") | A |
| The evidence skeleton: "a toggle (graded anchors joined by thin interpolated legs)" | roadmap; opportunity 1; `docs/VISUAL_SPEC.md:518` | B |
| Interval events drawn as bars on the timeline | roadmap; opportunity 1; `docs/STAGE3_SPEC.md` §0.2 item 7 ("The one timeline of Stage 3 keeps today's marker at an interval's midpoint"); `docs/STAGE4_SPEC.md:79` | C |
| "Whose eyes?": the Command view promoted to a control combining the knowledge model, the viewshed and the valley fog, "always labelled as a model reading", with eye-level views from the command posts | roadmap; opportunity 1; `docs/STAGE4_SPEC.md` §0.2 ("Not Stage 4"), §C.5 item 5 ("the fog as a reading (line of sight through fog, "Whose eyes?") is Stage 5") | D |
| Plan ghosts: "ordered routes as ghosts behind columns" | roadmap; opportunity 1 | E |
| Day-tracks: "a day-track map in each dossier" | roadmap; opportunity 1 | F |
| **Assigned by the records, not named in the roadmap's Stage 5 line:** "an interim ground ring styled by grade earlier" (problem 9: "*When:* Stage 5, with an interim ground ring styled by grade earlier") | `docs/VISUAL_AUDIT.md:85-86` | G.1 |
| **Deferred to Stage 5 by Stage 2:** option (c) of true scale, "1x offered only with the Stage 5 eye-level views from the command posts" (not chosen; decision 34 took (b)), recorded as a Stage 5 dependency | `docs/STAGE2_SPEC.md:209` | D.4 |
| **Deferred to Stage 5 by Stage 4:** the fog as a reading (line of sight through the fog) | `docs/STAGE4_SPEC.md:620` (§C.5 item 5) | D.3 |
| **Deferred to Stage 5 by Stage 1:** the landscape view shows no grade ("a known gap") | `docs/VISUAL_SPEC.md:518-520` | A |

Nothing else in `CHANGELOG.md`, `docs/STAGE2_SPEC.md`, `docs/STAGE3_SPEC.md` or `docs/STAGE4_SPEC.md` names Stage 5 (fact: every
occurrence of "Stage 5", "skeleton", "day-track", "ghost", "Whose eyes", "eye-level" and "interval event" in the records was read).
Not Stage 5: uniforms, headgear and flags (Stage 6, including the provisional standard ratio, decision 26); the first run and the
opening sequence (Stage 7).

### 0.3 Where the evidence contradicts the roadmap, the records, the data or the brief (fact)

Each is stated, not resolved.

1. **"Interim ground ring styled by grade earlier"** (problem 9) was never built. No ring by grade exists in any stage's code or
   record (the only rings are the selection ring and the plateau ring). The landscape view still shows no grade at all: names are
   drawn without a badge (`nameHTML`, `symbols.js:83`), counters with their badge only on the paper map and in "Landscape with
   counters" (`symbols.js:58`). Stage 5 replaces the interim ring with the encoding itself (§A); nothing needs to be built first.
2. **"Eye-level views ... (needs Stage 2's true-scale relief)."** Measured (§D.4), what an eye at a command post can see does not
   need true scale: with the eye's and the target's metres scaled by the display factor, line of sight over the drawn ground agrees
   with the model's for every enemy formation at 1x, 4x and 10.33x (75 of 75 headquarters-formation pairs at each factor, five clocks), because a uniform vertical
   scale does not change what is visible (the app's own comment, `app.js:2621-2625`). What true scale changes is the **picture**:
   the slopes' look. And at 1x the picture shows formations only as footprints lifted 0.25 world units (about 16 m) above the ground,
   which from an eye 3 m up stand above the crests that hide them in the model (6 of the 7 formations the model hides from the Zuran
   at 08:30). At 4x and 10.33x the figures, at their deliberate miniature scale (decisions 6, 14), stand 19-236 px tall on screen at
   1.1-8.6 km, and over the five clocks the drawing shows above the ground between for 17 (1x), 23 (4x) and 20 (10.33x) of the 55
   readings in which the model hides the formation. So the roadmap's dependency holds for the look of the
   slopes, not for the reading; and at every factor an eye-level picture contradicts the model reading unless the Command view's
   "not known" removes what the eye cannot see (§D.5).
3. **The Command view is not labelled as a model reading.** The Command tab's heading says "See the field as a headquarters saw it"
   (`shell.html:58`) and its default text "Enemy formations it could not see are removed from the map" (`app.js:2741`); `SOURCE_NOTE`
   (`data.js:756-772`) does not mention the Command view, line of sight or the knowledge rule. The roadmap requires "always labelled
   as a model reading". The dossier's sightline button does carry a caveat ("computed from this model's elevations, not the real
   survey, and take no account of woods, buildings or smoke", `app.js:5238-5239`). §D.5 item 4 labels the reading; a sentence in
   `SOURCE_NOTE` would be a data task (§G.3).
4. **The Command tab's text describes an encoding that no longer exists.** "Formations known only by report are drawn with a broken
   outline and a query" (`app.js:2741`): the broken outline went with decision 4 (Stage 1B). Today a reported-only formation is
   marked only by the counter's "?" badge, which replaces its grade letter (`symbols.js:58`), and only where counters are drawn: in the
   landscape a reported-only formation looks exactly like one in sight (measured: 0 of 1-3 marked in the Field vantage at 05:00,
   08:00 and 10:00, §D.2).
5. **The Command view's reading is computed once per phase, not at the clock.** `knowledgeOf` caches by `commandView|curPhase`
   (`app.js:2647-2649`) while positions follow the clock (`posNow`). By the same rule evaluated at every 10 minutes (census.js), the
   reading at a later clock differs from the phase's first in 73 of 961 French and 52 of 1,397 Allied samples; §D.2 gives what the
   page actually draws. A reading that does not follow the clock is a software defect in a model reading, not a data question.
6. **"Documented limits" without a source.** `KNOW_OVERRIDE` (`analysis.js:117-139`) is introduced as "Documented limits on what a
   headquarters could know about a specific formation"; its 15 entries name no source, and over the day they decide 29% of the
   French headquarters' readings and 51% of the Allied (census.js). `COMMAND`'s statements are marked "doc" or "inf" with no source
   named either (`docs/STAGE4_SPEC.md` §C.2 found the same of the fog). "Whose eyes?" must say which part of a reading is the rule
   (line of sight, the fog) and which an authored override; whether the overrides have sources is a data question (§G.3).
7. **A duplicate key in the data.** `heightguns`' phase-8 entry gives `cf:"C"` and then `cf:"B"` in one object literal
   (`data.js:178` and `:180`); JavaScript keeps the later, so the anchor is graded B (with `claim:"recon"` beside it). It is the only
   duplicate key in `data.js` and `analysis.js` (census.js). Which grade was meant is a data question (§G.3); Stage 5 draws what the
   app computes (B).
8. **No position is graded by a cited source, and no timing is graded A.** The grades A, B and C are the data's own (`data.js:3-4`:
   "A = well documented · B = sector documented, frontage approximate · C = reconstructed from narrative, position conjectural"); no
   anchor names its source. All 20 explicit timings (`tm`) are graded B (12) or C (8), all with the basis "app narrative, unsourced";
   the dossier's `TIMING_TEXT.A` ("Timing dated in a cited source", `app.js:4921`) is never shown. Spatial confidence draws the
   position grade as the data gives it; it adds no claim about sources.
9. **A grade gives no distance.** "Soft frontage B, diffuse zone C" needs a size for the softness and the zone; the data gives none
   (the only distances are three events' marker tolerances, `tolKm` 1.3-1.5 km, `analysis.js:276`, `296`, `332`). Any radius is a
   design value, stated as such; a sourced error distance per anchor would be new data (§G.3).
10. **Most positions on screen are interpolated.** 67.5% of the formation-samples of the day lie between two anchors (census.js), and
   are graded "no better than the weaker anchor" (`confAt`, `app.js:645-654`). The roadmap's skeleton ("graded anchors joined by thin
   interpolated legs") draws exactly that; spatial confidence must say what it draws between anchors (§A.4).
11. **Plans and the phase-0 axis arrows draw the same routes twice.** The four Allied "axis" arrows of `OVERLAYS` phase 0
   (`app.js:24-27`, "an ordered route in the Allied disposition") lie within 80-130 m of the `PLANS` routes of the same columns and
   stop short of them (0.3-2.1 km; census.js). Plan ghosts in phase 0 would draw them twice (§E.3). `OVERLAYS` does not change.
12. **The Plans overlay is drawn over everything.** Its ribbons and heads have `depthTest:false` (`app.js:2796`, `2819`) and it dims
   every formation (`setPlan`, `app.js:2930`); "ghosts behind the columns" needs the opposite (depth-tested, under the figures, the
   formations not dimmed).
13. **A known model/source mismatch at Napoleon's last post.** `CHANGELOG.md:2965` (correction pass, item 10): "From the chapel of
   St Anthony the model shows little of the Satschan pond ... A source records Napoleon watching the end from there. This is left as
   a documented model/source mismatch." The viewshed from the headquarters' phase-8 anchor covers 6.6% of the modelled ground
   (§D.3). An eye-level view from there would show the visitor the mismatch; §D.5 item 6 requires it to be said where it is shown.
14. **The Plans tab breaks the drop limits it was never measured against.** Drawn with the camera where the visitor left it (`setPlan`
   flies to the Overview only while `freeCam` is false, `app.js:2924`), both plans raise the map layer's drops above the view's
   `DROP_LIMIT` in 9 of 19 landscape harness views (the Field vantage 16 against 11; `plans-probe.js`, §E.2). No harness case opens the
   Plans tab. Outside Stage 5's scope (the Plans tab is not changed); recorded, with a check proposed (§H.3, 5F).

### 0.4 Owner decisions 85-89 (the answers to §J questions 1-4 and 6)

Part A merged (#32). Before 5B the owner answered the four questions that bind it, each with the recommendation; before 5C, question 6,
with the recommendation. Questions 5 and 7-13 stay open until the parts they bind.

| # | question | decision |
|---|---|---|
| 85 | 1, spatial confidence by default | On by default, at every factor and on the paper map, with a "Position confidence" toggle in the layers panel. (5B) |
| 86 | 2, the C zone's size | Its radius the formation's own frontage; stated as a drawn size, not a measured error. (5B) |
| 87 | 3, grade A | Drawn as the crisp footprint (every formation on the field has a ground mark). (5B) |
| 88 | 4, between anchors | The grade `confAt` gives (the weaker anchor's); "interpolated" stays the dossier's word, not a fourth look. (5B) |
| 89 | 6, an interval's marker | At the interval's start: one event clock (the start) for the marker, a click or Enter on it, the previous/next keys, the themes, the tour, the dwell, the dossier's "Go to this moment" and the map layer's names; the bar shows the window. (5C) |

## A. Spatial confidence: crisp footprint A, soft frontage B, diffuse zone C

### A.1 Today (fact; read from the code)

- **The grade.** Each anchor's `cf` (A, B or C; `data.js:3-4`), carried forward by `stateAt` (`app.js:573-586`; "B" if none was ever
  given: no formation relies on that default, census.js); a position between two anchors is graded no better than the weaker of them,
  and marked interpolated (`confAt`, `app.js:645-654`); an aggregate takes its leaves' worst (`aggConf`, `app.js:660-666`).
- **Where it shows.** The counter's plated badge, "B" or "C" (none for A), replaced by "?" when the Command view reports the formation
  only (`counterHTML`, `symbols.js:58`), drawn on the paper map and in "Landscape with counters"; the counter's accessible name ends
  "position grade B" (`symbols.js:80`); the dossier's pill "Position B · interpolated" and its footer (`CONF_TEXT`, `CONF_INTERP`,
  `app.js:4929-4933`, `5027`); the legend's badge row (`shell.html:189`). **In the landscape, the default ground, no grade is drawn:**
  formation names carry no badge (`nameHTML`, `symbols.js:83-85`), and the figures are the same for every grade (problem 9).
- **The footprint** (decision 34; `makeFootprint`, `placeFootprint`, `app.js:1246-1262`): a plane of 6 x 4 segments, frontage `W0 x sw`
  by depth `D0 x sd` (the block's own layout at ground scale), draped at a lift of 0.25 world units, the side's colour at 85%; drawn
  only at 1x, in place of the figures (`app.js:3811-3817`). The trodden-ground pad under the figures at 4x and 10.33x is a separate
  mesh, larger by 4.5 units (`app.js:3684-3688`).

### A.2 The grades on the field (fact; `census.js` §1)

| phase (clock) | leaf formations on the field: A / B / C at the phase's start, middle, last minute (interpolated) |
|---|---|
| 0 Deployment (04:00-07:00) | 17/10/3 (0) · 17/10/3 (21) · 17/10/3 (21) |
| 1 Telnitz (07:00-08:00) | 17/10/3 (15) · 17/10/3 (21) · 17/10/3 (21) |
| 2 Sokolnitz (08:00-08:45) | 18/10/3 (9) · 15/12/4 (20) · 16/11/4 (20) |
| 3 The Pratzen (08:45-09:30) | 18/9/4 (13) · 15/12/4 (23) · 15/12/4 (23) |
| 4 Pratzeberg (09:30-10:30) | 15/12/4 (16) · 14/13/4 (25) · 14/13/4 (27) |
| 5 Olmutz road (10:30-11:15) | 16/11/4 (14) · 15/12/4 (27) · 15/12/4 (27) |
| 6 The Guard (11:15-12:45) | 16/11/4 (9) · 16/10/5 (24) · 16/10/5 (25) |
| 7 The wheel (12:45-14:30) | 16/10/6 (3) · 15/11/6 (26) · 14/12/6 (28) |
| 8 The ponds (14:30-17:00) | 15/13/4 (9) · 15/13/4 (27) · 15/13/4 (28) |
| 9 Reckoning (17:00-18:00) | 14/13/4 (0) · 14/13/4 (0) · 14/13/4 (0) |

Over the day (every 10 minutes, 2,636 formation-samples): A 50.2%, B 36.8%, C 13.1%; interpolated 67.5%. In the harness views the free
rectangle holds 3-32 formations, of which C 0-4. The footprints measure 318-1,305 m of frontage (median 638 m) by 81-1,289 m of depth
(median 334 m); the four C formations at 09:30 have frontages of 318-1,172 m (`confidence-probe.json`, overview-plan).

### A.3 Four encodings, measured (fact; `confidence-probe.js`, `confidence-sheet.jpg`)

F: every formation as its crisp footprint; G1: A crisp footprint, B soft frontage (frontage doubled, its ends feathered over their
outer halves), C diffuse zone (a disc of radius the formation's own frontage, alpha falling from the centre); G2: G1 with the zone's
radius 1 km; G3: only B and C marked. Opacities 0.62 (crisp), 0.55 (soft), 0.45 (zone), the side's colour; meshes of 16 x 16 segments,
draped at the footprint's lift. Each cell: the changed share of the free rectangle · the median contrast of the changed pixels against
the ground they cover (luminance; 3:1 is the non-text level) · drops (today's in brackets) · the lowest map-text contrast (today's).

| view @ factor (clock) | grades in the free rectangle A/B/C | F | G1 | G2 | G3 |
|---|---|---|---|---|---|
| overview-field (09:30) | 15/12/3 | 1.1% · 1.59 | 2.5% · 1.47 · 6 (6) · 8.32 (8.32) | 3.6% · 1.46 | 2.1% · 1.47 |
| overview-plan (09:30) | 15/12/4 | 1.2% · 2.37 | 2.1% · 1.92 · 4 (4) · 8.03 (8.03) | 3.1% · 1.81 | 1.7% · 1.82 |
| close-sokolnitz (08:20, valley fog) | 5/7/2 | 1.8% · 1.02 | 5.7% · 1.02 · 4 (4) · 7.59 (7.58) | 9.1% · 1.01 | 5.5% · 1.02 |
| pratzen-low (09:50) | 5/3/2 | 2.4% · 2.94 | 7.2% · 1.66 · 5 (5) · 11.94 (11.94) | 7.2% · 1.71 | 6.8% · 1.66 |
| selected-formation (09:30) | 3/7/0 | 4.0% · 2.77 | 8.4% · 1.73 · 4 (4) · 7.57 (7.57) | 9.5% · 1.61 | 7.0% · 1.61 |
| watch-selected (09:45) | 6/8/1 | 3.6% · 2.80 | 9.4% · 1.71 · 3 (3) · 7.59 (7.59) | 11.3% · 1.66 | 8.0% · 1.64 |
| hybrid-dimmed (10:00) | 7/9/2 | 2.6% · 2.59 | 10.7% · 1.93 · 8 (8) · 6.49 (6.49) | 12.5% · 1.95 | 9.8% · 1.90 |
| ph8-overview-study / -watch (14:40) | 14/14/4 | 1.3-1.4% · 2.47-2.61 | 1.8-1.9% · 2.14-2.18 · 3 (3) · 8.66, 8.54 (8.70) | 2.8-3.0% · 1.99 | 1.2% · 1.86-1.94 |
| overview-field @1x / @10.33x | 15/12/3 | 0.1% / 1.2% | 3.1% · 1.60 / 2.5% · 1.45; drops 6 (6) / 7 (7) | 4.8% / 3.1% | 3.0% / 2.0% |
| close-sokolnitz @1x / @10.33x | 8/8/3, 4/5/2 | 5.7% / 2.1% | 15.5% · 1.02 / 6.6% · 1.01; drops 5 (5) / 3 (3) | 20.8% / 9.4% | 13.1% / 6.3% |
| pratzen-low @1x / @10.33x | 6/4/2, 5/3/0 | 0.2% / 1.1% | 12.1% · 1.74 / 2.7% · 1.32; drops 4 (4) / 3 (3) | 11.9% / 2.4% | 11.9% / 1.8% |
| ph8-overview-watch @1x / @10.33x | 14/14/4 | 0.1% / 1.3% | 0.8% · 1.45 / 1.9% · 2.14; drops 3 (3) / 3 (3) | 2.1% / 2.8% | 0.8% / 1.2% |
| paper-north-up (09:30) | 15/12/4 | 0.3% · 1.23 | 0.4% · 1.14 · 12 (12) · 5.38 (5.38) | 0.4% | 0.3% |
| paper-close (08:20) | 1/1/1 | 15.3% · 1.28 | 39.4% · 1.10 · 1 (1) · 5.10 (5.10) | 36.3% | 40.6% |

In all 22 views and four encodings: **drops unchanged**; **0 map texts below AA**, the lowest contrast unchanged or at most 0.16 lower
(ph8-overview-watch 8.70 to 8.54); **solid near-black unchanged** (at most 0.02%); the drape **never under the drawn ground at 1x or
4x**, and at 10.33x under it at 0.01-0.08% of the zone's sample points (close-sokolnitz G3); the world pass's time within the noise of
the software renderer (6.8-21.9 ms against 6.8-11.4 ms at 4x and 10.33x, with no consistent direction; 1.5-2.9 ms at 1x and on the
paper map). At 1x, F is today's drawing (0.1-0.2% changed, where the meshes differ).

Reading (derived):
- **The encoding is quiet.** Against the ground it covers, the median changed pixel reaches 1.0-2.9:1, and at most 32% of changed
  pixels reach 3:1 (ph8-overview-watch); in the valley fog's hours (close-sokolnitz at 08:20) about 1.0, because the fog covers the
  ground and the zones alike. The encoding cannot be the only carrier of the grade: the badge and the dossier's text stay the
  accessible carriers, and the landscape needs one (A.4 item 4).
- **G1 and G2 are close** where frontages are near 1 km (the median frontage is 638 m); G2 covers more in most views, less in the low Pratzen view at 1x and 10.33x and the close paper view. A zone sized
  by the formation's own frontage says less than a fixed distance would: that it is this body of men whose place is uncertain.
- **The 2B primitive needs finer draping for zones**: its 6 x 4 segments were not tried for B and C; a C zone up to 2.6 km across
  draped from 16 x 16 still dipped under the ground at 10.33x (0.08% of samples).
- **The close paper view is the limit**: at 08:20 one formation of each grade fills 39% of the free rectangle; on the paper map, at
  close zoom, the zones need a cap on screen.

### A.4 Design (recommendation)

1. **One primitive, three grades** (decision 34's footprint, one mesh of 16 x 16 segments, a texture per grade): A the crisp footprint
   (frontage x depth, the side's colour at about 0.6); B the soft frontage (the frontage doubled, its outer halves feathered to nothing,
   the depth crisp); C the diffuse zone (a disc of radius the formation's frontage, alpha falling from the centre). No dash, no new hue
   (decisions 1, 4, 15); the sharpness carries the grade. G1 of §A.3 (questions 2 and 3). Its sizes are design values, stated as such in the legend and the
   sources sheet: "Drawn size, not a measured error: the sources grade a position, they do not give its error."
2. **Drawn under the figures at every factor** (a ground mark at 4x and 10.33x, replacing the trodden-ground pad's role under the
   block, which keeps its own look), and **in place of the 1x footprint** at true scale; on the paper map under the counters, capped
   on screen (no zone larger than a quarter of the free rectangle's shorter side; the cap is a design value measured in 5B).
3. **Between anchors**, the grade `confAt` gives (the weaker anchor's), as the dossier already says; "interpolated" is not a fourth
   look (question 4). Aggregates are not drawn: each leaf carries its own.
4. **A text carrier in the landscape**: the formation's name plate carries the badge (B, C or "?"), as the counter does (decision 4's
   plated badge, `counterHTML`'s rule), so the grade is never carried by the ground drawing alone. This changes the name plates'
   width: 5B measures drops against `DROP_LIMIT` (none may rise).
5. **On by default**, with a toggle "Position confidence" in the layers panel (question 1); under reduced motion nothing changes
   (nothing moves).
6. **The legend** (contextual, decision 29): one row per grade drawn on screen ("A: position documented; B: sector documented, frontage
   approximate; C: reconstructed, position indicative"; the data's own definitions), and the sentence of item 1.
7. **Not done:** no sourced error distance (a data task, §G.3 item 5); no change to any grade; no hue for evidence.

### A.5 What must hold

Existing: every harness threshold in every view (drops within `DROP_LIMIT`, map text at AA as rendered, darkness, the unobstructed
baselines); the paper map identical at every relief setting (2E); 2F's cover checks (the encoding is above the ground, not in the
ground shader); decision 34's 1x drawing (now the A and B encodings); `css-test.js`'s dash rule.
New:
- **Self-test, bound to the grade:** at 20 clocks, every drawn leaf's encoding is the one its `confAt` grade names, at its footprint's
  frontage and depth (A), doubled frontage (B), frontage radius (C), in the side's colour.
- **Self-test, draped:** every vertex at its lift above `groundY` and, sampled every 0.5 units between vertices, never under the drawn
  ground at 1x, 4x and 10.33x (the prototype dipped at 10.33x: 0.08% of samples; 5B must reach 0, by finer segments or a larger lift).
- **Self-test, a text carrier:** in the landscape every drawn name of a B or C formation carries its badge.
- **Harness:** in every landscape view and the paper map, the encoding's share of the free rectangle under a cap set from 5B's first
  build (the prototype: at most 15.5% in the landscape at any factor, 39% on the paper map before a cap); drops and map text unchanged.

## B. The evidence skeleton

### B.1 Today (fact)

- **The anchors and legs exist and drive every position** (`anchorList`, `app.js:1793-1836`; `legPath`, `1837-1846`; `legWindow`,
  `1857-1862`; `legAt`, `1863-1878`): 180 anchors over 32 leaf formations (A 101, B 60, C 19), 148 legs (18 with vias); the legs
  cover 71.9% of the formation-minutes on the field (census.js). 20 anchors carry explicit timing evidence (`tm`: grade B 12, C 8;
  basis "app narrative, unsourced" for all 20); 7 arrivals are derived (3 at the tactical rate, 3 at the ceiling, 1 by `moveMin`;
  3 flagged; `check:chronology` names them).
- **Nothing draws them.** The movement trail (`updateTrail`, `app.js:1450-1462`) draws only the part of the current leg already
  marched, 1.4 units above the ground, for the selected formation or every formation with the trails layer; the 17 derived arrows
  (Stage 2C, 4D) draw the legs `OVERLAYS` names, in their phases. The dossier says "interpolated" and the grade in text.

### B.2 Measured (fact; `skeleton-probe.js`, `skeleton-sheet.jpg`)

Each cell: anchors in the free rectangle / drawn · legs in the free rectangle / drawn · the changed share of the free rectangle · the
median contrast of the changed pixels against the ground (luminance) and the share at 3:1 or more.

| view @ factor | S-day (every anchor and leg) | S-phase (the legs meeting the phase) | S-sel (the selected family) |
|---|---|---|---|
| overview-field | 176/180 · 146/148 · 1.9% · 1.75, 20% | 76/77 · 48/48 · 0.6% · 1.70 | - |
| overview-plan | 180/180 · 148/148 · 2.2% · 2.12, 34% | 77/77 · 48/48 · 0.8% · 1.98 | - |
| close-sokolnitz (08:20) | 78/180 · 83/148 · 0.8% · 1.39, 4% | 38/66 · 33/43 · 0.2% · 1.35 | - |
| pratzen-low | 93/180 · 89/148 · 2.1% · 1.86, 23% | 35/77 · 28/48 · 0.4% · 1.73 | - |
| selected-formation | 56/180 · 64/148 · 3.2% · 1.93, 27% | 28/77 · 25/48 · 1.1% | 5/9 · 6/8 · 0.3% · 1.98 |
| watch-selected | 67/180 · 77/148 · 3.0% · 1.91 | 36/77 · 33/48 · 1.2% | 9/19 · 9/16 · 0.3% · 1.67 |
| hybrid-dimmed | 116/180 · 118/148 · 3.0% · 1.89 | 50/77 · 38/48 · 0.9% | 17/27 · 16/23 · 0.7% · 1.84 |
| ph8-overview-study / -watch | 180/180 · 148/148 · 2.4-2.9% · 2.26-2.36, 38-40% | 82/82 · 51/51 · 0.9-1.1% | - |
| overview-field @1x / @10.33x | 176 and 173 of 180 · 3.0% / 1.9% | 0.7-1.1% | - |
| close-sokolnitz @1x / @10.33x | 104 and 54 of 180 · 2.6% / 0.5% | 0.1-0.8% | - |
| pratzen-low @1x / @10.33x | 97 and 82 of 180 · 3.6% / 1.9% | 0.3-0.9% | - |
| ph8-overview-watch @1x / @10.33x | 180/180 · 2.5% / 2.3% | 0.8-0.9% | - |
| paper-north-up / paper-close / paper-drawer | 180, 15, 28 of 180 · 0.8% / 1.0% / 1.5% · 1.24-1.52 | 0.3-0.4% | paper-drawer 5/9 · 0.2% |

In all 21 views and every scope: **drops unchanged** (the skeleton is not a map-layer item); **0 map texts below AA**, the lowest
contrast unchanged or at most 0.30 lower (pratzen-low, S-day, 11.94 to 11.64); **no leg sample under the drawn ground** at any factor;
the world pass's time within the software renderer's noise (8.0-16.2 ms against 7.1-14.9 ms at 4x and 10.33x; 1.5-2.9 ms against 0.8-3.0 ms at 1x
and on the paper map).

Reading (derived): the whole day's skeleton is light on the ground (at most 3.6% of the free rectangle) but dense in count: 180
anchors and 148 legs in the wide views, 54-116 anchors in the close ones; the phase scope draws about a third. The marks reach 3:1
against the ground in 0-40% of their pixels: like the confidence encoding, they need the dossier and the accessible names as their
text carriers. A label per anchor in the free rectangle would add up to 180 map-layer items in the Overview: anchors are not labelled
on the map.

### B.3 Design (recommendation)

1. **A toggle "Evidence skeleton"** in the layers panel (off by default; question 7), drawing for the formations in scope:
   - **anchors** as small ground marks by grade, the shapes of the counter's badge family and never a dash or hue: A a filled disc,
     B a ring, C a small open ring; about 9 px across at their distance (drawn at the anchor's ground, sized to the screen as the event
     glyphs are, Stage 3E's cap and fade near the eye); each anchor's clock (`b.arr`) and grade in its accessible name and on hover;
   - **legs** as thin solid lines draped on the ground (sampled every 0.5 units, lifted 0.4 above `groundY`), in the annotation
     colour (the paper map's own there), through every via: the line between anchors is the model's interpolation, labelled so (the
     derived tag);
   - an anchor with explicit timing (`tm`) marked by a tick on its ring, its evidence in the dossier as today.
2. **Scope** (question 7): the selected formation's family; with no selection, the legs whose window meets the current phase, and
   their anchors; a "whole day" choice in the toggle. Measured, the whole day draws 180 anchors and 148 legs and covers up to 3.6%
   of the free rectangle (§B.2); the phase scope about a third of that.
3. **Not a map-layer item.** The skeleton is ground drawing, below the map layer's plates: it adds no item and no drop (measured: 0 in
   every view); anchors are not labelled on the map (the dossier and hover carry the clock); labelling every anchor in the free
   rectangle would add up to 180 items (the Overview).
4. **Legend and sources:** "Evidence skeleton: each formation's plotted anchors (filled: A, ring: B, open ring: C) and the lines this
   reconstruction interpolates between them. The lines are not recorded routes."

### B.4 What must hold

Existing: `binding-test.js` (every derived arrow's ends are its anchors exactly); `check:chronology`; the trail.
New:
- **Self-test, bound to the track:** every drawn anchor is an `anchorList` anchor (position, phase, grade by `stateAt`), every leg
  passes through its vias within 0.5 units, and the scope rule draws exactly the legs whose window meets the phase.
- **Self-test, draped:** no leg sample under the drawn ground at 1x, 4x and 10.33x (the probe: 0 in every view).
- **Self-test, shapes:** the grade by shape; no `setLineDash`, dashed material or segmented line in the skeleton (decision 15).
- **Harness:** drops unchanged in every view with the skeleton on; map text at AA as rendered.

## C. Interval events drawn as bars on the timeline

### C.1 Today (fact)

- **The events** (`EVENTS`, `analysis.js:239-347`; guarded): 25, of which 14 are instants and 11 intervals (`t:[t0,t1]`, "t may be a
  single minute or an interval where the hour is not fixed"): the counter-march 225 minutes, the columns leaving the plateau 180, the
  Russian Guard's attack and its breaking 120 each, Buxhowden not knowing and the wheel 60 each, Raigern 45, the headquarters moving
  forward 40, Davout's arrival and Soult's climb 30 each, Napoleon's release of Soult 20 (census.js). At most 5 windows are open at
  once (12:30). Each event has its own grade (`cf`: 14 A, 10 B, 1 C) and claim.
- **The timeline** (Stage 3C, `buildTimeline`, `app.js:4713-4755`): the track (`.tb-trackwrap`, 53 px, `style.css:211`) holds the act
  bands (0-15 px), the phase ticks (15-31 px) and the rail (31-53 px, `style.css:288`); the event row (`#evmarks`, `style.css:312`)
  is drawn **over** the rail, its 8 px diamonds at 2-10 px (`style.css:313`), above the hour ticks and numerals. An interval is one
  marker at its **midpoint** (`app.js:4733-4735`); the dossier says "Interval, not a timestamp" (`app.js:5270`).
- **An event's clock means three things.** A click or Enter on a marker sets the clock to the midpoint (`app.js:4736`), as the
  previous/next event keys do (`eventTimes`, `app.js:4788-4791`); a theme or tour stop naming an event takes its **start**
  (`momentOf`, `app.js:2693`); the dwell (decision 75) stops at each event's **start** and lights its marker (§0.1). For the
  counter-march the marker stands 210 px (at 1600 x 900) to the right of the minute at which the dwell lights it.

### C.2 Measured (fact; `layout-probe.js` §1, `timeline-sheet.jpg`)

| size, presentation | rail width | timebar height (Stage 3C: at most 92) | lanes for the 11 intervals | shortest bar | bars' contrast against the timebar (French, Allied) |
|---|---|---|---|---|---|
| 1600 x 900, Study / Watch | 1,572 px | 90.5 / 92.0 | 4 | 37.4 px (Napoleon's release, 20 min) | 5.26, 5.69 |
| 1280 x 720, Study / Watch | 1,252 px | 90.5 / 92.0 | 4 | 29.8 px | 5.26, 5.69 |
| 1024 x 768, Study / Watch | 996 px | 90.5 / 92.0 | 4 | 23.7 px | 5.26, 5.69 |

With the bars drawn inside the event row (the prototype: lane k a 2 px bar at 1 + 2.5k px from the row's top), the four lanes take
a band 9.5 px deep at the top of the rail (at 1600 x 900, y 877-886.5), under the diamonds (2-10 px); the hour numerals begin 3 px
below it (889.5): 0 bars over a numeral at any size; every bar passes under at least one diamond (its own, at the midpoint); the
timebar's height is unchanged (90.5 and 92.0 px). The band crosses the rail's hour-tick line (`.rail-ticks`, 5-8 px,
`style.css:289-291`), as the diamonds already do.

Reading (derived): there is no height to add (0-1.5 px under the cap): a row of bars would break Stage 3C's 92 px. The four lanes
fit inside the marker band the event row already occupies, under the diamonds, at the rail's own size at every width; the shortest
bar is 3.0 to 4.7 times a diamond's 8 px, so every interval reads as a bar.

### C.3 Design (recommendation)

1. **Each interval a bar** in the event row, 2 px tall, its lane (at most 4, packed in start order, greedy) from the top of the row,
   in the side colour (decision 1; 5.3-5.7:1 against the timebar); instants stay diamonds. No new row; the timebar's height does not
   change.
2. **The marker moves to the interval's start** (question 6), so the diamond, the dwell, the themes and the tour name one minute;
   a click, Enter or the previous/next keys go to the start too. The bar shows the rest of the window. (Alternative: keep the marker
   at the midpoint, with the bar through it; then the dwell lights a marker away from its minute.)
3. **Accessible name:** "08:45 to 09:15, Saint-Hilaire and Vandamme climb the slope (an interval: the hour is not fixed)"; the bar is
   not a separate focus target (the marker is).
4. **The bar lights with the marker** (`.on` while the event's weight exceeds 0.5, `.dw` during its dwell) and with a theme's moments
   (`.inth`), as the marker does today.
5. **Not done:** no bar for a phase (the phase ticks are already intervals); no softening of a bar by the event's grade (the grade is
   the dossier's); no event data change.

### C.4 What must hold

Existing: Stage 3C's timeline at most 92 px in every view; the hour numerals and the current phase's label never cut at 1280 x 720;
the slider's keys and an event marker's Enter by real key presses (the harness's expected clock moves from the midpoint to the start
for an interval if question 6 is answered "start": a changed expectation, recorded, not a loosened one); the dwell's checks.
New:
- **Self-test, bars bound to the events:** one bar per interval and none for an instant; each bar's left and right edges at `tlPc`
  of its window within 1 px; no two bars in a lane overlap; at most 4 lanes; the timebar's height unchanged.
- **Self-test, one event clock:** a marker's click, the previous/next keys, `momentOf` and the dwell name the same minute for every
  event (if question 6 is "start").
- **`check:contrast`:** the bars against the timebar at 3:1 (non-text), in Study and Watch, dark theme and the paper map's.

## D. "Whose eyes?": the knowledge model, the viewshed and the fog, and eye-level views

### D.1 Today (fact; read from the code)

- **The knowledge rule** (`knowledgeOf`, `app.js:2641-2664`; guarded, unchanged): with a headquarters chosen (`commandView` "fr" or
  "al", the Command tab's buttons, `shell.html:57-64`), an enemy formation is: the override's state if `KNOW_OVERRIDE` names it
  (`analysis.js:119-139`, 10 French formations for the Allied view, 5 Allied for the French, each `[phaseFrom, state]`); else
  "unknown" if the headquarters (`gqg` or `ahq`, at its plotted position at the clock) has no line of sight to it (`hasLOS`,
  `app.js:2627-2639`: the model's `height()`, a 3 m eye, a 2.5 m target, 0.5 m clearance, at most 110 samples); else "uncertain"
  ("reported only") while the phase's `mist` exceeds 0.5 and the formation stands below model height -0.8 (238.2 m); else "seen".
- **What it changes on the map** (`updateVisibility`, `app.js:3803-3804`): an "unknown" formation is not drawn (figures, footprint,
  counter, name); an "uncertain" one is drawn, and its counter's badge reads "?" in place of its grade (`symbols.js:58`); the
  dossier shows a pill ("In sight", "Reported only", "Not known", `app.js:5029-5033`); the Command tab lists `COMMAND`'s statements
  for the phase ("Could see", "Knew", "Did not know", "Ordered", "Expected"), each tagged DOCUMENTED or INFERRED (`paintCommand`,
  `app.js:2737-2756`).
- **The viewshed** (`computeViewshed`, `world.js:1113-1133`): 900 rays from a place over the model's grid (`gridH`), a 3 m eye,
  out to 204 world units (12.9 km); drawn as a tint in the ground shader (`uVS`). Offered only from a place's dossier ("What can be
  seen from here", `app.js:5228-5236`), with the caveat quoted in §0.3 item 3. It is not offered from a headquarters or a formation,
  and the Command view does not use it (it uses `hasLOS`).
- **The valley fog** (Stage 4C, `ATMO`, `app.js:367-433`): drawn with its top at the same 238.2 m and its amount from `PHASES[].mist`;
  the self-test checks that the Command view's "uncertain" is exactly the enemy in sight under the drawn top (`app.js:6572-6583`).
- **The camera** cannot stand at eye level: the floor is 1.8 world units above the drawn ground (`CAM_CLEAR`, `app.js:3905`), and
  the near plane is 1 world unit (63 m, `app.js:519`).

### D.2 The reading over the day, and on screen (fact; `census.js`, `eyes-probe.js`)

| headquarters (enemy readings every 10 min) | computed: seen | uncertain (fog) | unknown (no line of sight) | override: seen | uncertain | unknown |
|---|---|---|---|---|---|---|
| French on the Allies (1,074) | 225 | 10 | 530 | 188 | 112 | 9 |
| Allied on the French (1,562) | 71 | 2 | 692 | 391 | 72 | 334 |

Reading (derived): line of sight decides most readings; the fog rule decides 12 of 2,636 over the day (it applies only in phases 0-2
and only to a formation in sight below 238.2 m); the overrides decide 29% of the French view and 51% of the Allied. In the model the
Allied headquarters at Krzenowitz cannot see Soult's divisions in the Goldbach valley at 05:00, 07:00, 08:00 or 08:30 because the
ground hides them (`census.js` rule without the override: every reading "unknown", the divisions at 213-235 m), not because of the
fog; the app's texts credit the fog (`docs/STAGE4_SPEC.md` §C.2). The override says the same ("unknown" to phase 3).

**The reading as drawn is the phase's, not the clock's** (§0.3 item 5): with the page's own cache, the drawn reading differs from the
rule at the clock in 65 of 1,074 French and 50 of 1,562 Allied samples (6.1% and 3.2%; `eyes-probe.js` §1): for example the Allied
headquarters "not known" to the French at 07:30-07:50 though in sight at the clock, the Santon "seen" by the Allies at 06:10-06:30
though out of sight. The census's rule-only count (73 and 52) differs because the page computes the phase's reading at the first
clock it draws, not at the phase's start.

**On screen** (the Field vantage, `eyes-probe.js` §2): with the French view at 05:00, 3 Allied formations are "reported only"
(Przybyszewski, the Russian Guard's infantry and cavalry, all by override); in the landscape none of them is marked (names carry no
badge), in "Landscape with counters" 1 of 3 (the others' counters are folded into their corps at that distance), on the paper map 3
of 3. At 08:00 and 10:00 the same: 0 marked in the landscape.

### D.3 The viewshed from the headquarters, and the fog (fact; `eyes-probe.js` §3)

| headquarters' anchor | place (phase) | modelled ground visible (3 m eye) | of it, under the fog's top (238.2 m) | `hasLOS` and the viewshed disagree |
|---|---|---|---|---|
| `gqg` | the Zuran (0) | 39.0% | 21.3% | 1 of 12 enemy formations |
| `gqg` | Stare Vinohrady (6) | 31.8% | 40.7% | 0 of 13 |
| `gqg` | (7) [307,227] | 12.6% | 4.9% | 0 of 13 |
| `gqg` | the chapel of St Anthony (8) | 6.6% | 87.3% | 1 of 13 |
| `ahq` | Krzenowitz (0) | 6.3% | 61.6% | 1 of 18 |
| `ahq` | on the plateau (3) | 1.1% | 0% | 0 of 18 |
| `ahq` | (4) | 7.4% | 0% | 1 of 18 |
| `ahq` | toward Krzenowitz (6) | 10.7% | 69.3% | 0 of 18 |
| `ahq` | (8), (9) | 4.8%, 5.0% | 72.9%, 81.1% | 1 and 2 of 18-19 |

Reading (derived): the two line-of-sight implementations agree on 154 of 161 pairs; each disagreement is a formation at the edge
(the viewshed tests the ground cell, `hasLOS` a 2.5 m target). From the Zuran a fifth of what Napoleon's eye reaches lies under the
fog's top: that ground was fogged until about 08:45 by the model's rule; neither the viewshed nor its tint says so today. From the
chapel of St Anthony the eye reaches 6.6% of the field, most of it low ground: the documented model/source mismatch of §0.3 item 13.

### D.4 An eye at the command post (fact; `eyes-probe.js` §4, `eyes-sheet.jpg`)

The eye 3 m above the drawn ground at `gqg` (08:30, 10:00, 13:00) and `ahq` (08:00, 10:00), at each factor, the vertical metre
scaled by the factor (k / 63.2 world units at kx):

| | 1x | 4x | 10.33x |
|---|---|---|---|
| drawn line of sight (displayHeight, scaled eye and target) against the model's (`hasLOS`) | 75 of 75 agree | 75 of 75 | 75 of 75 |
| of the 55 readings the model hides, the drawing shows above the ground between | 17 (the footprint, lifted 0.25 units, 16 m) | 23 (the figures' tops) | 20 |
| a formation's drawing on screen from the eye (median px tall, at a median 4.2-6.1 km) | 3.5-5.1 (the footprint's lift) | 45-70 (figures) | 41-71 |
| the camera floor above the ground, in true metres | 114 m | 28 m | 11 m |
| the near plane | 63 m | 63 m | 63 m |

Reading (derived):
- **The reading does not need true scale** (§0.3 item 2): the drawn ground and the model agree on every line of sight when the eye's
  and the target's metres are scaled by the factor. The picture does: at 4x the Pratzeberg reads as a hill four times steeper; at
  10.33x as a cone (`eyes-sheet.jpg`).
- **The drawing contradicts the reading at every factor** unless what the reading hides is not drawn: from the Zuran at 08:30 the
  model hides 7 Allied formations, and their figures stand above the intervening ground (4x: all 7). The Command view's rule already
  removes "unknown" formations; an eye-level view must be the Command view's, never the omniscient one.
- **At true scale a body of men is not visible from a command post as figures**: 2.5 m at 5 km is about 0.5 px. What showed at that
  distance (dark masses, smoke, glints) is not modelled. The map layer's names (DOM, on top) carry the formations.
- **Today's camera cannot take the view**: the floor stands 11-114 m above the eye, and the near plane cuts the first 63 m of ground.

### D.5 Design (recommendation)

1. **One control, "Whose eyes?"** (question 5), in place of the Command tab's three buttons (Omniscient / French / Allied) and reachable from the
   timeline's control row in Study and Watch, with three states: everyone (today's omniscient view), Napoleon's headquarters,
   the Allied headquarters. It applies the knowledge rule unchanged (`knowledgeOf`, guarded); what changes is the drawing:
   - "not known" as today (not drawn);
   - "reported only" marked **everywhere**, not only on counters: in the landscape the name carries the "?" plate (the counter's
     badge, decision 13), and the formation's drawing is shown at the C encoding of §A (a diffuse zone, no figures): reported, not
     seen;
   - the viewshed from the chosen headquarters' position at the clock drawn as the existing tint (`uVS`), recomputed when the
     headquarters moves to its next anchor (10 anchors over the day; 4-16 ms each in the probe, software), not every frame;
   - the ground under the fog's top inside the viewshed drawn as fogged while the rule applies (phases 0-2): the same 238.2 m, read
     from `ATMO`, one threshold (the Stage 4C self-test extends to it).
2. **The reading follows the clock** (question 8). The cache keyed by phase (§0.3 item 5) becomes a cache keyed by the clock's minute (or cleared
   when a formation's leg changes); `KNOW_OVERRIDE` and the rule are not changed. This changes what is drawn in 6% and 3% of samples,
   always toward the rule as written.
3. **Eye-level views from the command posts**, offered only inside "Whose eyes?" (a headquarters chosen), as a vantage: the eye at
   the headquarters' plotted position at the clock, 3 m above the drawn ground (the metre scaled by the factor), looking toward the
   phase's authored target. The camera floor gives way to a floor at the eye for this vantage only (the self-test's floor checks keep
   every other path); the near plane is lowered for it (0.05 world units, 3 m, as the probe used); any orbit, pan or zoom leaves it
   for the ordinary camera at its floor (decision 47: Follow off). At 1x the footprint's lift (0.25 units, about 16 m) is the one change the eye
   needs: while the eye is at the post the encodings of §A are drawn at about 0.02 units (1.3 m), so they lie on the ground the eye
   looks over (question 5).
4. **Labelled as a model reading, everywhere it is drawn** (decision 10's derived tag, its diamond): the control's caption "A model
   reading: line of sight over this model's ground from the headquarters' plotted position, the valley fog's rule, and authored limits
   on what each side knew. Not a record of what was seen." The eye-level view adds "Relief drawn x{k}; figures are symbols many times
   life size." The Command tab's "broken outline" sentence (§0.3 item 4) and its heading (§0.3 item 3) are rewritten in the
   interface (not data); the `SOURCE_NOTE` sentence is a data task (§G.3).
5. **The dossier says which part decides.** A formation's knowledge pill gains its reason: "Not known (no line of sight)", "Not
   known (authored limit)", "Reported only (valley fog)", "Reported only (authored limit)". The overrides keep their text; their
   sources are a data question.
6. **Where the record and the model disagree, say so where it shows.** From the chapel of St Anthony (phase 8) the eye-level view
   carries the correction pass's sentence (`CHANGELOG.md:2965`): the model shows little of the Satschan pond; a source records
   Napoleon watching the end from there.
7. **Not in Stage 5:** a change to the knowledge rule, the overrides, the viewshed's or line of sight's arithmetic, the eye heights,
   or the fog's top; smoke as an obstacle to sight (the app's caveat already says sightlines ignore woods, buildings and smoke).

### D.6 What must hold

Existing: `runtime-test.js`, `terrain-test.js` and `sim-test.js` on the knowledge rule and the viewshed (unchanged); the self-test's
valley-fog check (the Command view's "uncertain" exactly the enemy in sight under the drawn top); the floor on every camera path at
every factor (the eye-level vantage is the one, named exception); Follow equal to `!freeCam` after every path.
New:
- **Self-test, the reading at the clock:** at every 10 minutes, for both headquarters, the drawn reading equals the rule evaluated
  afresh (0 of 2,636 samples differ; today 115).
- **Self-test, reported only marked:** in the landscape, the paper map and "Landscape with counters", every "uncertain" formation
  whose name or counter is drawn carries the "?" (today 0 of 3 in the landscape).
- **Self-test, the eye-level vantage at 1x, 4x and 10.33x:** the eye 3 m (scaled) above the drawn ground at the headquarters; no
  "unknown" formation drawn; every drawn formation in line of sight by the model (no drawing of what the model hides); the label
  shown; leaving the vantage restores the floor.
- **Self-test, one fog threshold:** the viewshed's fogged tint uses `ATMO`'s top; the same set as the Command view's "uncertain".
- **Harness:** a new view, the eye at the Zuran at 08:30 at 4x (and at 1x), with every threshold of its kind (darkness, map text at
  AA, drops within a limit set from Part B's first build and never raised, decision 62); `check:contrast` gains the "Whose eyes?"
  states (the control, its caption, the dossier's reason).

## E. Plan ghosts: the ordered routes behind the columns

### E.1 Today (fact)

- **The plans** (`PLANS`, `analysis.js:147-215`; guarded): 8 Allied and 6 French columns, each with an ordered route (`route`, 3-5
  points), its objective, the formations it names (21 tracked leaf formations; Saint-Hilaire and Vandamme in two French columns), an
  order (`ord`) and, per plan, staging areas, objectives, an author, an intent and its assumptions. "Routes are intended lines of
  march, not what actually happened" (`analysis.js:144-145`).
- **The Plans tab** (`setPlan`, `app.js:2902-2932`) draws one or both plans as heavy tapered ribbons with a dark casing, heads (the
  Allied chevron), dashed staging outlines, objective crosses, labels, and dashed links from each named formation to its objective
  (`buildPlanLinks`, `updatePlanLinks`, `app.js:2864-2901`; decision 15); the ribbons are drawn over everything (`depthTest:false`),
  every formation is dimmed (`setHighlight({})`), and the camera flies to the Overview unless the visitor has moved it.
- **The routes against the tracks** (census.js §5): the executed tracks keep within 1 km of their ordered routes for 36-100% of the
  day's samples; the largest distances are the 4th Column's (Miloradovich 4.8 km, Kollowrath 5.1 km), Liechtenstein's (5.5 km),
  Friant's (6.5 km, against the route of "The bait - Legrand, then Davout", which follows Legrand's stretch of the Goldbach),
  Vandamme's second axis (5.0 km) and the grenadiers' (5.1 km). These are distances, derived; why a column left its route is the
  narrative's, not this measure's. The four phase-0 axis arrows lie on the plan routes (§0.3 item 11).

### E.2 Measured (fact; `plans-probe.js`, `plans-sheet.jpg`)

Each cell: the changed share of the free rectangle · the median contrast of the changed pixels against the ground · drops (the
view's `DROP_LIMIT`; today's without the overlay in brackets) · the lowest map-text contrast. P-today keeps the camera where the view
put it (the Plans tab flies to the Overview only while the visitor has not moved the camera).

| view @ factor | routes in the free rectangle | P-today (both plans, as the Plans tab draws them) | P-ghost (prototype) |
|---|---|---|---|
| overview-field (limit 11) | 14 | 24.4% · 1.58 · **16** (6) · 8.04 | 1.4% · 1.73 · 6 · 8.22 |
| overview-plan (12) | 14 | 12.8% · 1.26 · 10 (4) · 8.46 | 0.9% · 1.76 · 4 · 8.03 |
| close-sokolnitz (18) | 11 | 66.2% · 1.61 · 9 (4) · 11.49 | 3.4% · 1.03 · 4 · 7.58 |
| pratzen-low (13) | 11 | 51.9% · 1.29 · 8 (5) · 8.30 | 5.0% · 2.00 · 5 · 11.94 |
| selected-formation (4) | 9 | 77.4% · 1.23 · **8** (4) · 11.85 | 7.0% · 2.07 · 4 · 7.57 |
| watch-selected (8) | 9 | 73.5% · 1.26 · 7 (3) · 11.47 | 6.6% · 2.13 · 3 · 7.59 |
| hybrid-dimmed (13) | 13 | 64.5% · 1.26 · **18** (8) · 6.49 | 5.5% · 2.13 · 8 · 6.49 |
| ph8-overview-study / -watch (7) | 14 | 13.0-13.2% · 1.29-1.30 · **10, 9** (3) · 8.59 | 1.0% · 1.85-2.03 · 3 · 8.34-8.70 |
| overview-field @1x / @10.33x (11) | 14 | 23.1% / 24.1% · **17, 15** (6, 7) | 1.8% / 1.5% · 6, 7 |
| close-sokolnitz @1x / @10.33x (18) | 11, 10 | 69.1% / 56.3% · 11, 6 (5, 3) | 7.1% / 2.7% · 5, 3 |
| pratzen-low @1x / @10.33x (13) | 11, 10 | 54.4% / 41.8% · 9, 5 (4, 3) | 5.8% / 4.4% · 4, 3 |
| ph8-overview-watch @1x / @10.33x (7) | 14 | 12.6% · **9, 9** (3, 3) | 1.0% · 3, 3 |
| paper-north-up (20) | 14 | 8.5% · 1.58 · 12 (12) · 5.10 | 0.2% · 1.08 · 12 · 5.38 |

In every view and both variants: 0 map texts below AA. P-today (the Plans tab, unchanged by Stage 5) draws over 12-77% of the free
rectangle and **exceeds the view's drop limit in 9 of the 19 landscape views** (bold); no harness case draws the Plans tab, so no check
has seen it (§0.3 item 14). P-ghost: drops unchanged in all 20 views; the lowest map-text contrast at most 0.36 lower (8.70 to 8.34, the
phase-8 Overview); 0.2-7.1% of the free rectangle; its pixels reach 3:1 against the ground in at most 6.5% (it is a faint mark by
design: the side's colour at 30%); the world pass's time within the noise (6.7-15.9 ms against 7.8-16.2 at 4x and 10.33x).

### E.3 Design (recommendation)

1. **A toggle "Ordered routes"** in the layers panel (off by default; question 9; not called "ghosts" in the interface, because
   decision 83's faint whole arrow is already a ghost): each formation's ordered route (`PLANS[side].cols[].route` of the column that
   names it), drawn as the prototype: a thin ribbon about 100 m wide, draped, depth-tested so the figures stand on it, the side's
   colour at 30%, **dashed** (decision 15: planned), no head, label, staging or objective. The Plans tab is unchanged.
2. **Which routes, when:** with a selection, the selected family's columns; else every column while any formation it names is on the
   field and has not yet reached its final anchor; in phase 0 not the four columns whose axis arrows `OVERLAYS` already draws (§0.3
   item 11), so no route is drawn twice.
3. **Where plan and execution part**, the formation's dossier says so in text from the census measure ("largest distance from the
   ordered route: 4.8 km"), tagged derived. No arrow is added.
4. **Legend and sources:** "Ordered routes (dashed): the columns' lines of march in the two plans, as the plans set them out; not
   what was marched."

### E.4 What must hold

Existing: `binding-test.js` and the dash rule (decision 15); the Plans tab's own drawing; `OVERLAYS` unchanged.
New:
- **Self-test:** each drawn route is its column's `PLANS` route exactly (every point, within 0.5 units, draped); depth-tested and
  under the figures (its render order below the blocks'); dashed; the phase-0 rule; formations not dimmed by it.
- **`binding-test.js`:** the routes are the only new dashed drawing, and they are plans.
- **Harness:** drops and map text as rendered within today's thresholds with the routes on in every landscape view.

## F. Day-tracks: each formation's day as a map in its dossier

### F.1 Today (fact)

- The dossier (`dossierFormation`, `app.js:5006-5141`) tells a formation's day as text: the previous, current and next action
  ("What it was doing", three rows), its position at the clock as the nearest place (`nearestFeature`), the march rate of the leg in
  progress, the timing and its evidence when the leg carries `tm`, and its pills (status, claim, "Position B · interpolated", "Timing
  B"). There is no map of the formation's day; the only drawn trace is the movement trail of the leg in progress (`updateTrail`,
  `app.js:1450-1462`, the selected or every formation with the trails layer).
- The day's track is in the data: every leaf formation's anchors (`anchorList`) and legs (`legPath`, with vias), each anchor's grade
  (`stateAt(id, ph).cf`), each leg's window (`legWindow`) and its timing evidence (`tm`).

### F.2 What a day-track would show (fact; `census.js` §6, `layout-probe.js` §2; derived)

- **32 leaf formations**, 1-9 anchors each (median 6), every anchor at a distinct place except `heightguns` (two anchors at one) and
  the Santon (one anchor, no leg). Extents from 0.4 x 2.3 km (`heightguns`) to 8.7 x 3.6 km (Bourcier); lengths 2.4-11.1 km (the Santon none); the
  shortest leg 0.13 km (Kollowrath), 0.14 km (Friant), 0.2 km (Saint-Hilaire).
- **The dossier** is 255 px wide in the rail's column at 1600 x 900 and 1280 x 720 (docked, decision 54), 315 px as the card at
  1024 x 768. A 3:2 inset in it (239 x 159 px, 299 x 199 at 1024) fits each formation's day at 23-81 px per km (the Santon, one
  point, at an assumed 1 km across); at that scale the shortest leg is under 8 px for 3 formations (Friant 5.4 px, Kollowrath 5.4,
  Saint-Hilaire 6.0) and every other leg at least 9.6 px.
- **Grades along a day** (anchor by anchor, census.js): 15 formations are graded the same at every anchor (9 all A, 4 all B, Bourcier
  and Walther all C), 17 change grade along the day (for example Langeron AAACCCC, Kamensky BAAABCC, Saint-Hilaire AAAAAAABB).

### F.3 Design (recommendation)

1. **A small north-up map** as the first section after "Where" in a leaf formation's dossier: the formation's day drawn in SVG at a
   fitted scale (never more than the inset's width per km; a scale bar in km from `GEOREF`), north up (`GEOREF.ROT`, as the paper
   map), over the paper map's flat ground drawn small (water, villages and woods outlines from the paper map's symbology, read; no
   hillshade at this size).
2. **What it draws**, from the data as it is: the anchors as the skeleton's markers by grade (§B.3: filled, ring, small ring), each
   with its clock (the anchor's arrival, `b.arr`) on hover and in its accessible name; the legs as a thin line, solid (a leg the model
   executes is not a plan, decision 15); the leg in progress and the position at the clock (a dot, the formation's side colour); the
   formation's own plan route, where a `PLANS` column names it, as a dashed line (decision 15: planned), labelled "ordered route"
   (question 10).
3. **Legs under 8 px** (3 formations at the docked width) are drawn as one marker for both anchors with both clocks listed; nothing is
   enlarged out of scale.
4. **Interaction:** a click on an anchor sets the clock to its arrival (as an event marker does) and keeps the selection; the keyboard
   reaches the anchors in time order (a roving group, as the timeline's markers, `rovingGroup`, `app.js:4701-4712`).
5. **Labelled:** "The formation's plotted day: anchors graded A/B/C as in the data; the lines between them are this reconstruction's
   interpolation, not a recorded route." (the derived tag on the legs).
6. **Aggregates** (corps, columns, armies) show their leaves' day-tracks together, each leaf's line in the same side colour, its
   name on hover; no aggregate track is invented (an aggregate has no anchors of its own).

### F.4 What must hold

Existing: the dossier's structure and its progressive disclosure; `check:contrast`'s dossier states; `css-test.js`'s names.
New:
- **Self-test, day-track bound to the track:** for every leaf formation, the inset's anchors are its anchors exactly (count, order,
  grade), its line passes through every via, and the position dot is `posNow` within 0.5 px of the inset's scale.
- **Self-test, scale:** one scale per inset; the scale bar to 1% (as the paper map's, Stage 2E); north within 0.5 degrees of up.
- **`check:contrast`:** the dossier with a day-track (the inset's text and markers: text at AA, markers at 3:1 against the inset's
  ground), docked and as the card.
- **Harness:** the `selected-formation` and `paper-drawer` views keep their drop limits and unobstructed baselines (the inset is in
  the dossier, which is already a panel).

## G. The other items the records assign, and the data tasks Stage 5 would need

### G.1 The interim ground ring by grade (problem 9)

Not built (§0.3 item 1). **Recommendation:** not built now; §A's encoding is the remedy the ring was the interim for, and 5B is the
first part (§I). Nothing else in the records names an interim measure.

### G.2 Software findings (fact; the part that would fix each)

| finding | where | part |
|---|---|---|
| the Command view's reading cached per phase, not at the clock (6.1% and 3.2% of drawn readings not the clock's) | `app.js:2647-2649` | 5E |
| "reported only" not marked in the landscape (names carry no badge) | `symbols.js:83`, `app.js:3270-3276` | 5E |
| the Command tab's "broken outline" sentence and its heading, not labelled a model reading | `app.js:2741`, `shell.html:58` | 5E |
| an event's clock is its midpoint (marker, keys) or its start (themes, tour, dwell) | `app.js:4736`, `4788-4791`, `2693` | 5C |
| the Plans overlay dims every formation and is drawn over everything | `app.js:2930`, `2796`, `2819` | 5F (the overlay itself unchanged; the ghosts are a separate drawing) |
| the 1x footprint's lift (0.25 world units, about 16 m) stands above the eye at a command post | `app.js:3815` | 5E |
| the Plans tab (both plans, the camera kept) over `DROP_LIMIT` in 9 of 19 landscape views; no harness case opens it | `app.js:2902-2932` | not Stage 5's (question 13); a harness case proposed with 5F |

### G.3 Data tasks (not done here; each would be a separate task, with evidence, recorded in `CHANGELOG.md`, moving `check:data`)

1. **`heightguns` phase 8: `cf:"C"` and `cf:"B"` in one entry** (`data.js:178`, `:180`). Which grade was meant (the later, B, is what
   the app computes; the entry also carries `claim:"recon"` and "placed by the chapel of St Anthony (Újezd local history)").
2. **`KNOW_OVERRIDE` sources** (`analysis.js:117-139`): 15 entries introduced as "documented limits", none naming a source; they decide
   29% of the French view's readings and 51% of the Allied. A data task would give each a basis (a source, or "app narrative,
   unsourced", as the timings do) so "Whose eyes?" can show it.
3. **`COMMAND` sources** (`analysis.js:64-115`): 46 statements tagged "doc" or "inf", none naming a source.
4. **`SOURCE_NOTE`: a sentence on the model readings** (the Command view's line of sight and fog rule, the overrides, the skeleton's
   interpolated legs), in the voice of its existing paragraph on the two derived figures (`data.js:765`). The interface labels (§A.4,
   §B.3, §D.5) do not need it; the sources sheet would.
5. **A positional error per anchor** (a distance, sourced): only if the owner wants the zones' sizes to be evidence rather than a
   design value (question 2). Not recommended now: no source in the project gives one.

## H. Test plan

### H.0 The checks on the build this part was written against (fact)

Run on the unmodified Stage 4E build (`main` at `407cda0`; this part changes no source file, so the build the checks ran on is the
one the specification measures). The first run of `check:visual` was stopped at the background job's one-hour limit while the
probes ran beside it; it was run again alone, and that run is reported.

| check | result |
|---|---|
| `npm test` | all 9 suites pass, and the height guard (`binding-test.js`: 381 checks, 0 failed) |
| `npm run check:baseline` | md5 `e1fac9ea08a4c2b2eaefe5b78529c843`, 1,416,737 bytes: passes |
| `npm run check:data` | all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html` |
| `npm run check:chronology` | 0 errors (the open items it lists are the known ones) |
| `npm run check:contrast` | 4,250 text elements in 28 states; 0 below AA, 0 below 10.5 px |
| `npm run check:visual` | all checks passed: 20 views, the day's light, the valley fog's hours, the horizon, the key tests; the self-test 157 of 157; the two Canvas2D `willReadFrequently` warnings are the known ones |

### H.1 The thresholds each recommended change touches (measured in this part)

| change | drops (`DROP_LIMIT`) | map text as rendered (AA) | darkness (Stage 0) | share of the free rectangle drawn | contrast against the ground (median, luminance) | world pass (software) | drape |
|---|---|---|---|---|---|---|---|
| spatial confidence, G1 (§A) | unchanged in 22 views | 0 below; lowest at most 0.16 lower | unchanged (at most 0.02%) | 0.8-15.5% in the landscape at any factor; paper map 0.4-39.4% (before a cap) | 1.0-2.2 | within noise | 0 under at 1x and 4x; up to 0.08% at 10.33x (to be 0) |
| evidence skeleton, S-day / S-phase (§B) | unchanged in 21 views | 0 below; lowest at most 0.30 lower | not measured (lines and small marks) | at most 3.6% / 1.2% | 1.2-2.4 | within noise | 0 under |
| interval bars (§C) | - (the timeline is a panel) | - | - | the timebar's height unchanged (90.5 / 92.0 px) | 5.26 and 5.69 against the timebar | - | - |
| "Whose eyes?" (§D) | not measured (the control, the eye-level view: 5E) | not measured | not measured | the viewshed tint exists today | - | the viewshed 4-16 ms per anchor | the eye 3 m above the drawn ground: under today's floor (11-114 m) |
| plan ghosts (§E) | unchanged in 20 views (today's Plans tab: over the limit in 9 of 19) | 0 below; lowest at most 0.36 lower | not measured | 0.2-7.1% (solid; dashed about half) | 1.0-2.3 | within noise | 0.3 lift, draped every 0.5 units |
| day-tracks (§F) | - (in the dossier) | not measured (5G adds the dossier state to `check:contrast`) | - | - | - | - | - |


### H.2 Checks that stay, unchanged (every part)

`npm test` (the nine suites and the height guard: no presentation code reads `height()`/`hAt()`; every new call site classified; the
knowledge rule and the viewshed are read through their existing functions, already classified "model" (`hasLOS`, `knowledgeOf`,
`tools/stage2/height-sites.js:52`); the eye-level vantage and every Stage 5 drawing stand on `groundY()`/`displayHeight()`, and any new
call site is classified "model", "presentation" or "test"), `check:data` (113 declarations identical to
`archive/stage4d-9b13adbf.html`: no Stage 5 part changes a guarded declaration; §G.3's data tasks are separate), `check:chronology`
(0 errors: nothing changes a timing; the skeleton and the day-tracks draw `anchorList` as it resolves), `check:contrast` (28 states;
a state is added only where a part adds one), `check:visual` (every view's thresholds; the drop limits and the unobstructed baselines
neither raised nor lowered by Stage 5, decision 62), `binding-test.js` (every arrow bound to the tracks; the dash rule, decision 15:
the plan ghosts are the only new dashed drawing, and plans), `check:baseline` moved by each part that changes the build.

### H.3 New checks, by part (from §A.5, §B.4, §C.4, §D.6, §E.4, §F.4)

| part | self-test (in `app.js`) | harness (`tools/visual`) | suites |
|---|---|---|---|
| 5B spatial confidence | each drawn leaf's encoding is its `confAt` grade at the clock (20 clocks); A crisp at the footprint, B's frontage and C's zone at their design sizes; no dash; the encoding's colour the side's; every mesh vertex at its lift above `groundY` and the drape (every 0.5 units) never under the drawn ground at 1x, 4x and 10.33x; on the paper map identical at every relief setting | in every landscape view and the paper map: the encoding's coverage of the free rectangle under the cap of §A.4 item 2 and §A.5; map text at AA as rendered; drops within `DROP_LIMIT`; darkness within Stage 0's limit | `css-test.js`: no `setLineDash` or dashed material in the encodings; `runtime-test.js`: the encodings built in a dry run |
| 5C interval bars | one bar per interval at `tlPc` of its window within 1 px; at most 4 lanes, none overlapping; the timebar's height unchanged; one event clock (question 6) | the timebar at most 92 px in every view (unchanged); the marker key check's expected clock (recorded) | `check:contrast`: the bars at 3:1 |
| 5D skeleton | its anchors are `anchorList`'s exactly, its legs `legPath`'s (vias included) within 0.5 units; grades by shape; no dash; draped (no sample under the ground) at each factor; the scope rule; adds no map-layer item | every view with the skeleton on (S-phase, and S-sel where there is a selection): drops unchanged, map text at AA, coverage under the cap | `binding-test.js`: the skeleton's legs not dashed |
| 5E "Whose eyes?" | the drawn reading equals the rule at the clock (every 10 minutes, both sides); "reported only" marked wherever its formation is named; the eye-level vantage at each factor (no "unknown" drawn, nothing drawn the model hides, the label shown, the floor restored on leaving); the viewshed's fogged tint and the "uncertain" set from one threshold | the eye at the Zuran at 08:30 at 4x and 1x, every threshold of its kind; `check:contrast` with the control and its caption | `runtime-test.js`, `terrain-test.js`, `sim-test.js` unchanged; the height guard classifies the new reads |
| 5F plan ghosts | each ghost is its column's `PLANS` route exactly, depth-tested, under the figures (render order), dashed; not drawn for the phase-0 axis columns while their axis arrows are; formations not dimmed | every view with the ghosts on: drops and map text as today's thresholds; if question 13 says so, a new case with the Plans tab open at the Overview (where it flies), its drop limit what 5F's build drops there, never raised | `binding-test.js`: the ghosts are the only new dashed drawing, and are plans |
| 5G day-tracks | the inset's anchors are `anchorList`'s (count, order, grade); its line through every via; its position dot at `posNow`; one scale, the bar to 1%, north within 0.5 degrees | `selected-formation` and `paper-drawer` keep their limits and baselines | `check:contrast`: the dossier with a day-track, docked and as the card |

## I. Pull-request plan for 5B onward

Each part passes every check on its own, records what changed and why in `CHANGELOG.md` with the numbers, and moves
`check:baseline`. None changes a guarded declaration; the data tasks of §G.3 are separate, if the owner wants them.

| part | files | depends on | regression risks | the report must show |
|---|---|---|---|---|
| **5B, spatial confidence** (§A) | `app.js` (the encodings from `makeFootprint`/`placeFootprint` with a texture per grade; `updateVisibility`; the layers panel's toggle; the legend's rows), `shell.html` (the toggle, the legend), `style.css` (via tokens if a token is added), `tools/visual` (the coverage measure) | - | every landscape view's darkness and map text as rendered (a new ground drawing under the plates); the 1x footprint (decision 34) becomes the A encoding; the drape at 10.33x (the zone's mesh against the ground); the smoke's cap (the zones are not smoke, but share the screen); the paper map identical at every relief setting | per harness view at its factor and the four at 1x and 10.33x: grades in view, the encoding's coverage of the free rectangle and its contrast, drops, lowest map-text contrast, solid near-black, the world pass's time, before and after; a sheet |
| **5C, interval bars** (§C) | `app.js` (`buildTimeline`, `paintTimeline`, the marker at the start if question 6 says so, `eventTimes`, the click), `style.css` (the bar), `tools/visual` (the slider-and-marker key check's expected clock) | - | Stage 3C's 92 px; the hour numerals; the marker's keyboard group; the dwell's lit marker; `check:contrast`'s timeline states | the timebar's height at three sizes in Study and Watch; the lanes; the bars against the events' windows; the one event clock |
| **5D, the evidence skeleton** (§B) | `app.js` (the skeleton's anchors and legs as draped lines and markers; its scope by the selection, the theme, the phase; the layers panel's toggle; the legend), `shell.html` | 5B soft (the anchors' grade marks are the same shapes as the badge) | drops (the skeleton is ground drawing, not map-layer items: it must add none); map text as rendered; the world pass's time with 148 legs; the paper map | per view and scope: anchors and legs drawn, coverage and contrast, drops, map text, the pass time; the binding check |
| **5E, "Whose eyes?"** (§D) | `app.js` (the control; the reading's cache by the clock; "reported only" marked on names; the viewshed from the headquarters, recomputed per anchor; the fogged tint; the eye-level vantage, its floor and near plane; the labels; the dossier's reasons), `symbols.js` (`nameHTML` with the "?"), `shell.html` (the control replacing the Command tab's buttons, its caption), `tools/visual` (the eye-level view) | 5B (the "reported only" drawing is the C encoding) | the Command view's readings (`runtime-test.js`, `terrain-test.js`, `sim-test.js` unchanged; the drawn readings change in 6% and 3% of samples, toward the rule); the camera floor checks (one named exception); Follow; the valley fog's one threshold; `check:contrast`'s Command states | the reading at the clock against the page's before (115 samples that change); reported-only marked in every presentation; the viewshed per anchor and its time; the eye-level view at 1x, 4x and 10.33x with its labels; the floor exception exercised and restored |
| **5F, plan ghosts** (§E) | `app.js` (the ghosts: each formation's ordered route under its figures, depth-tested, its toggle; the Plans overlay unchanged), `shell.html` (the toggle, the legend row) | - | drops and map text in the views where the routes lie; phase 0's axis arrows drawn twice (§0.3 item 11); the dash rule (decision 15) in `binding-test.js` | per view: routes in view, coverage and contrast, drops, map text, the pass time; phase 0 with and without the axis arrows |
| **5G, day-tracks** (§F) | `app.js` (`dossierFormation`'s inset, SVG; its keyboard group), `style.css` | 5D (the anchor marks), 5F soft (the ordered route in the inset) | the dossier's height and scroll at 1280 x 720; `check:contrast`'s dossier states; the selected-formation and paper-drawer views | per formation: anchors drawn against `anchorList`, scale and north, the shortest leg in px; the dossier's height before and after; contrast |

Sequencing (question 12): 5B, 5C, 5D, 5E, 5F, 5G. 5C is independent and small and can go at any point; 5E needs 5B's C encoding
for "reported only"; 5G reuses 5D's marks.

### 5B, as delivered (spatial confidence; decisions 85-88)

Implemented in `app.js` (`CONF`, `confTexture`, `makeConfMark`, `confSize`, `confPlace`; `updateVisibility`; the legend's rows; the
sources sheet's sentence; the self-test's confidence checks), `symbols.js` (`nameHTML` with the grade's badge), `shell.html` (the
"Position confidence" toggle, on; the legend's grade rows), `style.css` (the rows' swatches, the name's badge), as §A.4 proposed (the
2B footprint's `makeFootprint` and `placeFootprint`, no longer called, removed), with
these changes found while building it, each measured (`tools/stage5/report-5b.js`, `docs/stage5-evidence/5b-report.md`,
`5b-before.json`, `5b-after.json`, `5b-sheet.jpg`, `5b-sheet-before.jpg`; `CHANGELOG.md`, Stage 5B):
- **The drape is a decal.** A plane draped at its vertices, even one vertex per world unit, cut under the ground at 10.33x (the
  self-test: 46 of 110,313 points, 0.375 units under, on the Zuran): the ground bends between the plane's vertices. Each mark is now a
  patch of the drawn ground's own cells, with the same diagonal as `groundY`, every node at the lift above the ground, and the
  grade's mask (in the mark's own frame, every edge texel transparent) shapes it. It lies exactly 0.25 units above the drawn ground at
  every point (the self-test: 0 of 319,740 points under at each factor, the lowest exactly 0.250).
- **The paper map's cap keeps the footprint.** A quarter of the free rectangle's shorter side capped B's frontage and C's zone, but at
  close zoom that made a mark smaller than the formation's own footprint. The cap now holds the uncertain extent between the footprint
  and the cap: B's frontage between W0 and 2 W0, C's zone between the footprint's larger side and its frontage radius.
- **The marks cover more than the prototype measured.** As rendered, the marks' share of the free rectangle is 3.3-15.2% in the 4x
  landscape views (the prototype, G1: 1.8-10.7%), 19.2% in the low Pratzen view at 1x (12.1%), 21.2% close on Sokolnitz at 1x
  (15.5%), 0.9-15.1% on the paper map (with the cap; the prototype 0.4-39.4% without). Inference, not verified: the prototype's coarse
  planes sank under the ground between their vertices and were partly hidden by it; the decal is not. The harness's cap (`CONF_SHARE`)
  is set from the 5B build: 20% on the landscape, 16% on the paper map, never raised.
- **The badge row** of the legend now shows wherever names or counters are drawn (the landscape's names carry the badge); the
  self-test's legend check follows that rule (a decided change, not a looser one), and checks the grade rows too.
- **The name's badge at the name's own size** (12.5 px, not the counter badge's 10.5 px): on a name the harness holds it to the
  12 px floor of what is needed to follow the battle (decision 16), and at 10.5 px 13 views failed.
- **At 1x** the A mark is the true-scale footprint at its 0.85 opacity (decision 34's drawing unchanged for A), B and C at their
  grade's look; with the toggle off the 1x footprint is drawn crisp, as before 5B.

Per view (fact; every harness view at its factor, four at 1x and 10.33x): drops within `DROP_LIMIT` everywhere, one view one higher
than before (watch-selected 3 to 4, limit 8), one lower (pratzen-low 5 to 4); map text 0 below AA, the lowest contrast in any view at
most 3.68 lower (pratzen-low, 11.94 to 8.26; the view's lowest is still 8.26); solid near-black unchanged (at most 0.020%); mean
luminance within 3.8; the world pass (software WebGL, 14 views at 4x and 10.33x) 4.4-10.2 ms against 4.4-6.8 ms, on average 5.9
against 5.2 ms. The self-test has 163 checks (157 before): the
drape at each factor, the grade and size and colour at 20 clocks, the names' badges, the paper map's cap.

### 5C, as delivered (interval bars, one event clock; decision 89)

Implemented in `app.js` (`evClock`, `evTimeText`; `buildTimeline`'s bars, `EV_BAR`; `paintTimeline`; `eventTimes`; the dossier's "Go to
this moment"; the map layer's event names; the self-test's checks), `style.css` (`.ev-bar`), as §C.3 proposed, measured by
`tools/stage5/report-5c.js` (`docs/stage5-evidence/5c-report.md`, `5c-before.json`, `5c-after.json`, `5c-sheet.jpg`; `CHANGELOG.md`,
Stage 5C):
- **One event clock, the start** (decision 89): a marker stands at its event's start; its click or Enter, the previous/next event keys,
  the dossier's "Go to this moment" and the map layer's event names give the start, as the themes, the tour (`momentOf`) and the dwell
  already did. Before 5C a marker stood up to 210.5 px from its start (the counter-march at 1600 x 900: the marker at 06:07, the theme
  and the dwell at 04:15); now 0 px for all 25 at every size. Three pairs of events share a start (04:00: `columns-move` and `raigern`; 11:00:
  `pratzeberg` and `guard-attack`; 11:15: `blasowitz` and `guard-broken`), so the 25 events have 22 starting
  minutes, each one stop of the event keys: from 04:00 (the first, where the clock already is) they stop at 22 minutes (21 starts and
  the day's end), where the midpoints gave 24.
- **Each interval a bar** in the event row, 2 px tall, its lane (packed in start order; a lane free 5 minutes after its last bar ends)
  1 + 2.5k px from the row's top, in the side's colour, under the diamonds: 11 bars in 4 lanes, in a band 9.5 px deep that ends 3 px
  above the hour numerals at every size; the shortest 37.4, 29.8 and 23.7 px at 1600, 1280 and 1024 px wide; every edge within 0.03 px of
  `tlPc` of its window; the timebar's height unchanged (90.5 px in Study, 92.0 in Watch, at every size). The bar is hidden from assistive
  technology; the marker names the window ("04:15 to 08:00, Liechtenstein counter-marches across the 4th Column (an interval: the hour is
  not fixed)"). It lights with its marker (`.on`, `.dw`) and with a theme's moments (`.inth`).
- **The bars' contrast** against the timebar (its scrim at 0.96 over black and over white): 4.86-5.71 in the dark theme, 4.34-5.43 in the
  paper map's, at least 3:1 (WCAG 1.4.11). It is checked in the self-test, not in `check:contrast` (§C.4 proposed it there): that check
  reads text only; the self-test reads the bars' computed colours in both themes.
- **Changed expectations, each a decided rule (decision 89), none looser:** the self-test's marker-name check accepts the window form
  ("hh:mm to hh:mm, ...") for an interval; the harness's marker Enter compares the clock with the marker's own minute (now the start);
  `runtime-test.js`'s forward event jumps, which assumed every midpoint distinct (at least 23 hops), now stop exactly once at every distinct
  start after 04:00 and at the end (22 hops).

## J. Questions for the owner

Each has a recommendation and its trade-off. Questions 1 to 4 bind 5B; 5 and 8, 5E; 6, 5C; 7, 5D; 9 and 10, 5F and 5G; 11, the data
tasks; 12, the order; 13, a finding outside Stage 5's scope.

1. **Spatial confidence on by default?** Draw the encoding under every formation in the landscape at every factor and on the paper map
   from the first view (§A.4), or only with a layer toggle? **Recommendation: on by default**, with a toggle in the layers panel
   ("Position confidence"). Trade-off: the field carries more ground drawing (§A.3's coverage) in every view; problem 9 is that the
   default view hides the grade.
2. **The C zone's size.** A radius equal to the formation's own frontage (it scales with the body of men) or a fixed ground distance
   (1 km tried)? Either is a design value: the data gives no distance (§0.3 item 9). **Recommendation: the formation's frontage**,
   stated in the legend and the sources sheet as "drawn size, not a measured error". Trade-off: a small C formation gets a small zone,
   which can read as more certain than a large B one; a fixed distance reads as a claim about error the project cannot support.
3. **A drawn or not.** Draw A as the crisp footprint (every formation then has a ground mark), or leave A unmarked so only B and C carry
   one ("no mark means documented", variant G3)? **Recommendation: A as the crisp footprint.** Trade-off: about half the formations
   on screen gain a ground mark they did not have at 4x; without it an A formation and an unencoded one look alike, and the encoding
   reads as "only the doubtful are marked".
4. **Between anchors.** Draw an interpolated position at the weaker anchor's grade, as the app already grades it (`confAt`), or as its
   own state? **Recommendation: the weaker anchor's grade**, the dossier's "interpolated" pill unchanged, and the skeleton (§B) for the
   legs. Trade-off: 67.5% of the day's formation-samples are interpolated (§0.3 item 10); none of them gets a sharper mark than its
   weaker anchor, and none is marked "moving between anchors" on the ground.
5. **"Whose eyes?" as one control, with eye-level views.** Replace the Command tab's three buttons with the control of §D.5 (everyone,
   Napoleon's headquarters, the Allied headquarters), add the eye-level vantage from the chosen headquarters (the floor waived for it
   alone, the near plane lowered, the 1x footprint's lift lowered while there)? **Recommendation: yes.** Trade-off: one camera path
   breaks the floor rule (named, tested); at 4x the eye-level picture shows a steeper Pratzen than an observer saw (the line of sight
   is right at every factor, the look of the slopes only at 1x), and the legend says so.
6. **An interval's marker.** Move it to the interval's start (one event clock for the marker, the keys, the themes, the tour and the
   dwell) with the bar showing the rest, or keep it at the midpoint? **Recommendation: the start.** Trade-off: the harness's marker
   check moves its expected clock (recorded); a visitor clicking the counter-march's marker lands at 04:15, not 06:07.
7. **The skeleton's scope.** When the skeleton is on, draw the selected formation's family, else the current phase's legs (§B.3), or
   always the whole day? **Recommendation: the selection, else the phase.** Trade-off: the whole day's 180 anchors and 148 legs are
   never drawn at once by default; a "whole day" choice in the toggle gives them.
8. **The reading at the clock.** Key the Command view's cache by the clock's minute, so the drawn reading is the rule's at that
   minute (§D.5 item 2)? **Recommendation: yes** (a software fix, no data change). Trade-off: 6.1% of the French and 3.2% of the Allied
   readings change, so a formation can appear or vanish within a phase.
9. **Plan ghosts: when, and named how.** Draw each formation's ordered route faint under its figures while the formation is on it
   (§E.3), with a toggle, named "Ordered routes" in the interface (decision 83 already calls the faint whole arrow a ghost)?
   **Recommendation: yes, off by default, named "Ordered routes", dashed (decision 15: planned).** Trade-off: the Plans tab stays the
   heavy overlay; the ghosts duplicate phase 0's four axis arrows (§0.3 item 11), so in phase 0 the ghosts of those four columns are
   not drawn while the axis arrows are.
10. **Day-tracks: the ordered route in the inset.** Draw the formation's ordered route in its day-track (dashed), where `PLANS` names it?
   **Recommendation: yes.** Trade-off: 21 of the 32 leaf formations are named by a plan column (Saint-Hilaire and Vandamme by two); the others' insets show the executed
   day only.
11. **The data tasks of §G.3.** Open them (the `heightguns` grade; the overrides' and `COMMAND`'s bases; a `SOURCE_NOTE` sentence on
   the model readings), or leave them? **Recommendation: open the first and the last now as one small data task before 5E**; the
   bases of the overrides and `COMMAND` need the sources read, and wait for that. Trade-off: guarded declarations change; until they
   do, "Whose eyes?" can say only "authored limit" for an override, not its source.
12. **Sequencing.** 5B, 5C, 5D, 5E, 5F, 5G (§I)? **Recommendation: yes**; 5C can go first if the owner wants a quick, low-risk part.
   Trade-off: "Whose eyes?" (the most visible) comes fourth, after the encoding it needs.
13. **The Plans tab's drops** (§0.3 item 14). Today's Plans overlay, with the camera where the visitor left it, drops more map items
   than the view's limit in 9 of 19 landscape views. Add a harness case with the Plans tab open at the Overview (where the tab flies
   when the camera has not been moved), its limit what the build drops there, and leave the moved-camera case as a recorded finding;
   or treat it as a defect to fix (the plan labels, the dimmed counters) in a part of its own? **Recommendation: the harness case with
   5F, and the fix as a separate task after Stage 5.** Trade-off: until then a visitor who opens the Plans tab from a close view can
   lose up to 11 more map items than without it (up to 6 over the view's limit); Stage 5 does not change the Plans tab.
