# Map readability specification (Stage 2, Part A)

**Status: Part A reviewed; the owner's answers are decisions 31-39 (§0, §L). §M (the chronology audit) was reviewed and
remedy (c) accepted; the chronology data task that followed it (owner decisions 40-46, §M.7-§M.13) is merged. 2B (display height,
exaggeration, standards) is implemented as specified in §A, §B, §I.1, §J and §K; what it found is at the end of §K. The
derived-arrival question of §M.13 is decided (the 2C precondition), and 2C (movement arrows) is implemented as §C.1 ("After
2C"), §C.3, §D, §J and §K describe; it is merged (#15). 2D (one DOM/SVG layer for map text, and the contextual legend) is
implemented as §E, §F, §H, §J and §K describe; what it found is at the end of §K; it is merged (#17). 2E (the true north-up
paper map) is implemented as §F, §G, §J and §K describe; what it found, and where it departs from §G.2, is at the end of §K; it
is merged (#18). 2F (the ground surface: land cover drawn per point, draped roads and streams, the meres' legend row) is
implemented as §J and §K describe; what it found is at the end of §K; it is merged (#19). Stage 2 is complete.** Sections A-L below still describe the build
they were written against, except §C.1, whose tables were re-run on the new tracks (the earlier ones are §C.4). Written against `main` at `7e03692`
(`austerlitz-command-map.html` 1,107,799 bytes, md5 `5bf48b75373fe0cf9fc8a32cbeae918c`, confirmed before any work;
`npm run check:baseline` now checks exactly that build). Line numbers refer to that commit.

Scope: Stage 2 of `docs/VISUAL_AUDIT.md` (problems 4, 5, 8, 9 and opportunity 5) as ordered by owner decisions 18-30
(§0). Parts 2B-2F implement it; this part only measures, prototypes and specifies.

**How this was established.** Every number below was produced by a script in `tools/stage2/` (committed; not bundled)
against the build above: the model scripts run the live sources in node (`model.js`); the page scripts drive the
built page in headless Chromium 141 with software WebGL, the same way the Stage 0 harness does (`page.js`, reusing
`tools/visual/measure.js` and the harness cases). Where a design needed to be tried, the script injects a **probe**
into the running page (`probe-exag.js`, `arrowheads.js`, `dom-layer.js`, `paper-map.js`): measurement code, not the
2B-2F implementation, and it changes no source file. Images are in `docs/stage2-evidence/`.

Labels, as in `docs/VISUAL_SPEC.md`: **fact** (read from the code or data, or measured), **derived** (computed from
facts), **owner decision** (decisions 1-30), **recommendation** (a proposal for 2B-2F), **open** (needs the owner).

| script | section | what it produces |
|---|---|---|
| `height-sites.js [--check] [--md f]` | A | every call of `height`, `hAt`, `groundY`, `localHeight`, `regionalLevel`, classified; `--check` is the 2B guard |
| `relief.js` | B | relief, drawn slopes and relief-to-symbol ratios at 1x, 3x, 4x, 5x, 10.33x |
| `exag-renders.js`, `probe-exag.js`, `exag-1x-options.js` | B | renders at each factor from the five vantages and the low Pratzen view; the 1x options |
| `arrow-binding.js [--md f]` | C | every `OVERLAYS` arrow bound to the formation tracks |
| `arrowheads.js` | D | the Allied chevron and French triangle, landscape and paper map, greyscale and three CVD simulations |
| `map-text.js` | E, H | every in-scene text element's on-screen size and rendered contrast; the unobstructed map fraction |
| `dom-layer.js` | F | the one-layer prototype: overlaps, drops, leaders, pass time, node count per harness view |
| `paper-map.js` | G | today's paper map against a north-up, straight-down, near-orthographic probe |
| `chronology.js [--md f] [--evidence] [--times] [--check]` | M | every anchor's engine window against the app's timed statements; verdicts computed from the reviewed statements; `--times` lists each explicit time with its evidence; `--check` is the regression (`npm run check:chronology`) |
| `chronology-sim.js` | M | the derived readings and suite values under each timing remedy |
| `delayed-moves.js [build] [--json f] [--shots dir]` | M.11 | what the interface shows while a dated move waits or runs inside its phase (decision 46) |
| `renders-2b.js [out] [--sheets dir]` | K (2B) | the built page at 1x, 4x and 10.33x from the five vantages and the low Pratzen view, through the app's own control; the time a factor change takes |
| `derived-legs.js [--md f] [--json f]` | M.13 | every leg with a derived arrival or near its ceiling: speed, status, ground, the slack its next anchor leaves; the options simulated |

## 0. Owner decisions 18-46 (fixed), and whether the evidence contradicts them

The decisions are recorded here as given; the verdict column says what the measurements found. Where a decision
conflicts with the evidence or with an earlier decision the conflict is stated, not worked around.

| # | decision (summary) | verdict |
|---|---|---|
| 18 | Sequencing: Part A, then 2B display height, exaggeration, flags; 2C movement arrows, binding test, draping, derivation, Allied arrowhead, boundaries, "IV Column halted"; 2D one DOM/SVG layer and contextual legend; 2E true north-up paper map; 2F land cover, draped roads and streams, meres if sourced. Each part passes every check on its own. | **Workable in this order** (§K). One soft dependency, not a forcing one: the paper map (2E) shows the triangle "sawtooth" cover boundaries more plainly than the landscape, and 2F fixes them after 2E. Question L1. |
| 19 | Vertical exaggeration is presentation only: one display factor on the drawn ground and one display-height helper; model units stay for `height()`, `hAt()`, viewsheds, line of sight, contours as data, dossier elevations, the march-rate audit. Settings 1x, about 4x, 10.33x. Symbols do not rescale. The paper map ignores the setting and uses its own cartographic hillshade factor, stated in the legend. Known conflict with decision 6 at 1x. | **Workable.** Verified: 52 presentation sites call `height()`/`hAt()` today and must move to the display height; 12 model sites stay (§A). The 1x conflict with decision 6 is **confirmed**: the Pratzeberg-Sokolnitz relief is 1.85 world units at 1x, a figure 1.98, a median broadleaf 3.39 (§B.1). **Two further findings:** (1) the going layer's slope classes are computed on the *drawn* 10.33x slope, so they would change with the setting unless bound to the model (§B.4, question L2); (2) 29 camera presets are stored in the data (`PHASES`, `ANALYSIS`, `TOUR`) in world units at 10.33x; they must be re-framed at use, not edited (§A.3). |
| 20 | The notched chevron becomes the Allied head on every Allied arrow; French arrows keep the plain triangle; plan ribbons keep their heads; "plan" stays carried by the ribbon form and dashes. Verify at overview zoom and in greyscale; if the chevron fails, report, do not substitute. | **Passes** (§D): at overview zoom the heads are 36-38 px with an 11.5-12.3 px notch, distinct from the plain head in greyscale and under the three simulations, judged on the crops. Two conditions, neither about the shape: heads drawn above labels and ribbons; framing. |
| 21 | Boundaries become a solid thin line in the annotation colour (2C), explained in the legend. List any other dashed drawing that escaped §10.5. | **Confirmed**, and one more escaped the inventory: the plan staging-area outline (`planStaging`, `app.js:2228`) is drawn as a dashed ellipse. It is a plan, so the dash is consistent with decision 15; it only needs listing and a legend line (§C.2). |
| 22 | No change to `OVERLAYS` in Part A; bind every arrow to the tracks; verdicts derivable / interpretive / mismatch; in 2C only derivable arrows are generated. | **Workable, with one contradiction in its wording.** "Their track legs *across* that phase" does not describe how the arrows were authored. A track anchor is where a formation stands at the *start* of its phase (`legWindow`, `app.js:1254`), so the model makes the move shown in a phase's arrow *before* that phase begins. Of the 11 derivable arrows, 10 match the leg that *arrives* at the phase's anchor and 1 matches the leg *across* the phase (§C.1). Deriving arrows "across the phase" would move ten arrows one phase later than they are drawn today. Question L3. |
| 23 | "IV Column halted" is not intended movement and will not be an axis arrow; propose its representation. | Proposal in §C.3. |
| 24 | One DOM/SVG layer for counters and all map text (2D), priority layout, panels as obstacles, leader lines, occlusion; compact counters by default; all map text measurable with the 10.5 / 12 / 13 px floors; zero unresolved overlaps, the Walther / Nansouty allowance retired; keyboard focus, accessible names, picking by footprint. | **Workable** (§E, §F). Measured today: 149 of 495 in-scene text runs are below their floor and 83 below AA across the harness views (§E). The prototype reaches 0 overlaps in all eleven views, the hybrid Walther / Nansouty pair included; its pass time is dominated by the occlusion rays, which need a cheaper method (§F.3). |
| 25 | Paper map: true north up (`GEOREF.NORTH`, `GEOREF.ROT`), straight down, orthographic or near-orthographic; pan and zoom only; drag-to-pan and zoom-to-cursor brought forward for the paper map; drawn and hidden elements as listed; framing inside the unobstructed area. | **Workable** (§G). Naming only: `geo.js` exports the rotation as `GEOREF.ROT_DEG` (17.42 degrees), not `GEOREF.ROT`; **the decision's wording is superseded: read `GEOREF.ROT_DEG`** (owner, on review). |
| 26 | Flags and standards join the figure scale (2B) with a provisional pike-to-man ratio, labelled provisional until Stage 6; state its basis. | Proposal in §I.1. |
| 27 | Meres: no outline change without a georeferenced source; a research note on the Satschan, Menitz and Kobelnitz ponds. | Note in §I.2. Two points the owner's brief states differently from the sources found: the Second Military Survey covered **Moravia in 1836-1840** (1836-52 is the span for the Czech lands as a whole), and the local estate report as quoted gives the Satschan draining as **8-16 December 1805**, not 8-12. The recovered finds also disagree with the app's own data (§I.2). |
| 28 | Land cover follows the cover polygons, not the 81 m triangles; roads and streams draped; palette colours stay Stage 4. | Workable; §K (2F). |
| 29 | Legend (2D, 2E): contextual, compact, collapsible, no empty area, never over the dispatch; states the current exaggeration and the two named symbol scales. | Workable; §F.2. |
| 30 | Scope guard: no historical, geographic, chronological or order-of-battle change in Stage 2 except the traceable `OVERLAYS` changes under 21-23; no other Stage 3 item. | Noted. The going-layer thresholds (§B.4) and the pond finds (§I.2) are recorded as questions for data tasks, not changed. |
| 31 | (L1) 2E stays before 2F: the paper map draws woods, villages and water from their polygons (§G.2), so triangle edges matter mainly in the landscape until 2F. | Recorded. |
| 32 | (L2) In 2B the going classes are computed from the model's slope with today's thresholds converted to true degrees (0.88 and 1.70), so the map does not change at any factor. "Hard for guns" and "severe slope" at under 2 degrees of true slope are unsupported claims about the ground, so until a data task decides: the legend shows each slope class with its true-degree threshold and the word "provisional"; the sources sheet states the thresholds are unsourced design values; the texts relying on the classes are listed; the data task (source the thresholds, or rename the classes descriptively) is recorded as open in `CHANGELOG.md`. | Recorded. Texts relying on the classes (fact): the layer's own description, "Where guns and formed cavalry could and could not pass" (`shell.html:120`); the class labels (`tokens.js:71-76`) and the legend rows written from them (`app.js:3221-3224`). No narrative, dossier or analysis text uses the classes. Related claims that do not use them: the Goldbach "difficult for guns and horse in December mud" (`data.js:627`), the stream note "guns and formed cavalry cross it at the villages" (`world.js:132`), the escarpment "steep enough to hide a division" (`world.js:130`). Note: "hard for guns" also covers woods and villages by cover class, not by slope (`world.js:536`). |
| 33 | (L3) Not decided as posed. Neither reading is adopted as a rule. Target: the arrow shown during phase ph depicts the movement the model makes during phase ph, and the model's timing agrees with the app's timed statements. Fix the model, not the arrow; the rule for 2C is settled after §M and the data task that follows it. | Recorded; §M is the audit. |
| 34 | (L4) Option (b): at 1x formations are drawn as their modelled footprints (W0, D0) in the side colour; buildings, trees, scrub, figures and standards are not drawn; counters, labels and the legend line ("true scale: formations drawn as their footprints") stay. The footprint is one primitive that Stage 5's spatial-confidence display can reuse. | Recorded; §J, §K (2B). |
| 35 | (L5) Default display factor 4x. Settings are stated relative to true scale (1x = true); the internal scale applied to model heights is factor / `GEOREF.EXAG`, which stays unchanged as the model's vertical scale. Every user-facing statement of the relief's exaggeration reads the display factor: the sources text (built HTML line 1755, `SOURCE_NOTE`, `data.js:737`), the relief caption (built line 7510, `app.js:3741`), the legend, the paper map's hillshade line. A self-test that no user-facing text states `GEOREF.EXAG` as the drawn exaggeration. | Recorded. Both texts reach the page through `geoText()` (`app.js:3905`), which substitutes `{EXAG}` with `GEOREF.EXAG`: 2B changes that substitution to the display factor, so `SOURCE_NOTE` (guarded data) does not change. |
| 36 | (L6) The provisional standard ratio 1.6 is accepted, labelled as proposed in §I.1 (a design rule, not a historical value). | Recorded. |
| 37 | (L7) No blanket tolerance rule. After §M and its data task, each of the 11 mismatches is resolved on its own against the app's narrative, events and cited sources: a wrong track changes (traceable) and the arrow is derived; an arrow that points at a place or objective becomes interpretive and is flagged; one that cannot be settled stays hand-authored and is listed by name in the binding test. §C lists what each mismatch's endpoints correspond to. | Recorded; §C.1. |
| 38 | (L8) Compact counter as proposed, plus the status icon without its text. For 2D: counter text, badges and nation tags sit on plates opaque enough to meet AA over any ground, measured, not computed (§E shows today's translucent paper halo fails); on dimmed counters the nation tag is text under decision 13: full opacity, one step down, at AA (Stage 1B's 34% tag does not meet decision 13). | Recorded; §F.1, §J. |
| 39 | (L9) Accepted with conditions: per view, drops may not exceed the number of labels today's canvas pass hides in that view; never dropped: the selection, the highlighted family and labels of live events; a dropped formation stays reachable by hovering its position and from the keyboard; §H's numbers are the input to Stage 3, where docking the dispatch comes first. | Recorded; §J. Today's hidden counts per view are in §F.3 ("canvas today: hidden"): 12, 14, 10, 10, 9, 9, 7, 21, 5, 11, 10. The probe's drops (4, 6, 19, 0, 0, 5, 1, 0, 14, 1, 0) exceed them in overview-field (19 > 10) and selected-formation (14 > 5): 2D must place better there. **2D re-measured the hidden counts on the 2C build with the panels at rest** (§K, 2D): 12, 16, 11, 12, 18, 13, 13, 27, 3, 8, 13, and 12 at 1x and 8 at 10.33x. Those are the limits (`thresholds.js`, `DROP_LIMIT`). |
| 40-46 | The chronology data task: the phase-start rule documented and kept as the default, explicit anchor times with evidence, grade and basis, the three disagreeing texts, the early and creeping moves, the events, the interface during a delayed move. | Recorded in §M.7; what was done in §M.8-§M.12. |

## A. Height call-site inventory and the display-height design

### A.1 The call sites (fact; `node tools/stage2/height-sites.js`)

87 calls: `height` 59, `groundY` 19, `hAt` 4, `regionalLevel` 3, `localHeight` 2. Classified by enclosing function:
**model 12, presentation 66, test 9.** Of the presentation sites, **52 call `height()` or `hAt()`** directly and must
move to the display height in 2B (`height-sites.js --check` counts them; it becomes the 2B guard, §J).

| class | enclosing function (calls) | notes |
|---|---|---|
| model | `height` (2), `hAt` (1), `buildGrid` (1), `buildFaceFacts` (1, `regionalLevel`), `buildMarshSymbols` (1, `localHeight`), `hasLOS` (3), `knowledgeOf` (1), `dossierFeature` (1), `dossierAnalysis` (1) | stay in model units. `buildGrid` fills `gridH`, which the viewshed (`computeViewshed`) and the contour lattice read. `buildFaceFacts` classifies land cover on local relief. `buildMarshSymbols` chooses where reeds go on local relief (model) but places them with `height` (presentation). |
| presentation, world build | `buildWorld` (1: the ground mesh vertices), `groundY` (2: the fallback off the mesh), `ribbon` (2: streams and banks), `buildWater > mereLevel` (2), `buildSettlements` (4), `buildWoods` (4), `buildApron > v` (1), `buildMarshSymbols` (1), `buildAnalysis` (7), `mistSheet` (3, `groundY`), `buildMist` (1) | built once; in 2B built from the display height and rebuilt, or re-seated, when the factor changes |
| presentation, per frame or on demand | `makeBlock > seatLocal`, `settleBlock` (4), `updateVisibility` (block seat), `spriteFloor` (2), `camGround` (2) | already read `groundY()`, the drawn mesh: they follow the display factor with no change |
| presentation, overlays and labels | `groundPts` (arrows, lines, boundaries), `buildObjective` (2), `buildFeatureGlyphs`, `updateTrail`, `buildPlateauRing` (3), `updateSelRing`, `buildEventLayer`, `planRibbon > build` (6), `planStaging` (3), `planObjective` (2), `updatePlanLinks` (2), `setPlan`, `updateVisibility > placeSprite`, `pickAt`, `centreOnMap`, `onScreen` | call `height()` today; move to the display height |
| test | `figureError` (2), `selfTest` (6), `selfTest > centreEye` (1) | the seating tests already compare with `groundY()`; the ground check (`selfTest`, `groundY` against `height` at the mesh vertices, `app.js:4131`) must compare with the display height |

The full table (87 rows with file and line) is generated by `height-sites.js --md`.

**Not found by a call scan, and also presentation (fact):** the contour lines are drawn at `y = L + 0.30` straight
from the lattice level `L` (`marchLevel`, `world.js:1253-1280`), with no call; the baked hillshade, frost and slope
(`FACE.vsh`, `FACE.shade`, `FACE.slope`, `FACE.vnz`, `world.js:426-447`) come from the drawn mesh's normals; the apron
sits 0.35 below the field edge (`world.js:1226`); the haze sheet is at a fixed `y = 3.4` (`world.js:1414`).

### A.2 Design (recommendation)

- **One display factor, presentation state, not a scale.** `DISPLAY_EXAG` is a view setting (1, the default, or
  `GEOREF.EXAG`); the drawn height of a model height `h` is `s * h` with `s = DISPLAY_EXAG / GEOREF.EXAG`. It is not a
  second scale constant: metres, kilometres and the vertical scale still come only from `GEOREF` (`elevM`,
  `unitsFromM`, `M_PER_WORLD`), and `s` is always derived from `GEOREF.EXAG`. Datum: `y = s * h`, i.e. about
  `GEOREF.DATUM_M` (243.1 m), which keeps the field's middle heights near `y = 0` so camera targets move least.
- **One helper:** `displayY(h)` and `displayHeight(x, z) = displayY(height(x, z))` in `world.js`. `groundY()` keeps
  reading the mesh (so it is already the display height) and its off-mesh fallback becomes `displayHeight`. Every
  presentation site of §A.1 calls `displayHeight` or `groundY`; every model site keeps `height`/`hAt`.
- **Changing the factor** re-seats what was built once: mesh vertices, normals (`(s nx, ny, s nz)` normalised),
  `FACE.vsh/shade/slope/vnz`, the palettes, instanced placements (houses, roofs, chimneys, spires, trees, scrub),
  ribbons, meres, contours, marsh ticks, analysis lines, mist sheets, and rebuilds overlays and plans. The probe
  (`probe-exag.js`) does exactly this; its cost is in §B.3.
- **Not rescaled:** figures, horses, guns, standards, buildings and trees (owner decisions 14 and 19): only their
  seat on the ground moves.

### A.3 What else must move with the display factor (fact, then recommendation)

| item | today | in 2B |
|---|---|---|
| water: meres | a flat disc at `min(base + 1.2 * regionalLevel, lowest edge - 0.05)` (`world.js:880-884`) | the same rule on display heights (the margin scales, or stays 0.05 drawn, so no edge hangs) |
| water: streams, banks | ribbons `height + 0.16 / 0.26` | `displayHeight + offset` |
| mist sheets and haze | sheets at `height + 1.5`, faded where the ground rises through (Stage 0); haze fixed at 3.4 | sheets at `displayHeight + 1.5`, fade recomputed from `groundY`; haze height scaled or re-fitted. The mist self-test must pass at every factor |
| camera floor | `camGround` reads `groundY` + `CAM_CLEAR` 1.8 units | unchanged in code; the clamp follows the mesh |
| figure seating | `seatLocal`, `settleBlock` read `groundY` | unchanged; the probe measured seating error 0.0000-0.0003 units at every factor and view (§B.2) |
| vantage and preset framings | 5 `VANTAGE` entries (`app.js:2952`), the staff view (`app.js:2444`), and **29 presets in the data**: `PHASES[].cam` (10), `ANALYSIS[].cam`, `TOUR[].cam` | never edited (they are guarded data): re-framed at use by one function in `flyTo`, `startPhaseTransition` and `placeCamera`: eye and target each keep their height above their own ground, `y' = y + (s - 1) * height(x, z)` (the probe's rule; §B.2 shows it frames every vantage). The self-test's camera checks (every view, every glide, the lowest orbit) must pass at every factor |
| contours | lattice from `gridH` (model), drawn at `L + 0.30` | lattice unchanged (model, `CONTOUR_INTERVAL` guarded); drawn at `displayY(L) + 0.30` |
| Stage 0 lighting correction | shadow toe in the composite, landscape hillshade narrowed to 0.70-1.12 (`world.js:516-521`), tuned at 10.33x | kept; the darkness measures of the harness run at each factor. Gentler relief gives less deep shade, so the correction can only matter less; its removal stays Stage 4 |
| baked hillshade and frost | from the drawn normals | recomputed from the display normals for the landscape; the paper map uses its own cartographic factor (§G) |
| going layer slope classes | from the drawn slope (§B.4) | bound to the model slope (question L2) |
| harness baselines | 11 cases, cameras in world units at 10.33x | the 11 cases run at the default factor, with their cameras re-framed by the same rule; new cases at 1x and 10.33x (§J) |

## B. Exaggeration evidence

### B.1 Relief and symbols (fact and derived; `node tools/stage2/relief.js`)

Model heights: Pratzeberg 323.9 m above Sokolnitz 206.7 m (117.2 m over 3.42 km); the Santon 295.9 m above the Goldbach at
the stream's nearest point, 234.5 m (61.3 m over 1.13 km). The owner's numbers are **verified**: at 1x the
Pratzeberg-Sokolnitz relief is **1.85 world units**; a standing figure is 1.98 and a median broadleaf 3.39
(`docs/VISUAL_SPEC.md` §9).

True slopes (1x): the transect due west from the Pratzeberg summit to the Goldbach (2.46 km, 106.5 m drop) has a mean
of 2.5 degrees and a maximum of 10.7; the mesh triangles on the west face (west of the summit, within 2 km, above the
Goldbach; 1,861 triangles, 81 m cells) have a 95th percentile of 7.8 and a maximum of 11.2 degrees.

| display factor | Pratzeberg-Sokolnitz, world units | Santon-Goldbach, units | west face drawn slope: transect max / mean | mesh p95 / max | relief / figure (1.98) | / house height (1.35) | / broadleaf (3.39) | / conifer (4.66) | Santon / figure |
|---:|---:|---:|---|---|---:|---:|---:|---:|---:|
| 1x | 1.85 | 0.97 | 10.7 / 2.5 | 7.8 / 11.2 | 0.94 | 1.37 | 0.55 | 0.40 | 0.49 |
| 3x | 5.56 | 2.91 | 29.5 / 7.4 | 22.5 / 30.7 | 2.81 | 4.12 | 1.64 | 1.19 | 1.47 |
| 4x | 7.42 | 3.88 | 37.0 / 9.8 | 28.9 / 38.4 | 3.75 | 5.50 | 2.19 | 1.59 | 1.96 |
| 5x | 9.27 | 4.85 | 43.3 / 12.2 | 34.6 / 44.7 | 4.68 | 6.87 | 2.74 | 1.99 | 2.45 |
| 10.33x (today) | 19.15 | 10.02 | 62.8 / 24.1 | 54.9 / 64.0 | 9.67 | 14.19 | 5.65 | 4.11 | 5.06 |

### B.2 Renders (fact; `node tools/stage2/exag-renders.js`)

Contact sheets, 1x / 3x / 4x / 5x / 10.33x, Watch presentation, 09:30 (the low view 09:50):
`docs/stage2-evidence/exag-field.jpg`, `exag-zuran.jpg`, `exag-pratzen.jpg`, `exag-allied.jpg`, `exag-overview.jpg`,
`exag-pratzen-low.jpg`. Per render (probe, re-framed vantage):

| view | screen height of the Pratzeberg-Sokolnitz relief stood at the summit, px: 1x / 3x / 4x / 5x / 10.33x | figure seating error, units (all factors) | eye above ground, units (1x / 10.33x) |
|---|---|---|---|
| Field | 10 / 29 / 39 / 49 / 102 | 0.0000-0.0003 | 95.4 / 95.4 |
| Zuran | 28 / 84 / 112 / 140 / 290 | 0.0000-0.0003 | 24.2 / 21.4 |
| Pratzen | 36 / 110 / 148 / 185 / 393 | 0.0000-0.0003 | 27.8 / 27.6 |
| Allied | 14 / 42 / 56 / 70 / 145 | 0.0000-0.0003 | 46.1 / 46.0 |
| Overview | 1 / 2 / 3 / 4 / 8 | 0.0000-0.0003 | 275.6 / 275.2 |
| low Pratzen (harness) | 35 / 104 / 139 / 173 / 351 | 0.0000-0.0002 | 10.1 / 21.8 |

A figure at the same distance is 1.98 / 1.85 = 1.07 times the 1x relief: at 1x the Pratzen vantage shows the whole
Pratzeberg-Sokolnitz relief (36 px) about as tall as one man drawn at the summit (about 38 px).

### B.3 Changing the factor (fact)

The probe's `exag()` (re-seating every built object, recomputing the baked shade and slope, both palettes and the
overlays) took **356-507 ms** per change over two runs (to 4x: 507 and 377 ms; to 1x: 360 and 356 ms) in headless
Chromium with software rendering (`exag-1x-options.js`). A factor change is a user action, not a per-frame cost, so a
sub-second rebuild is acceptable; 2B shows its own time, and the control is disabled during playback if it is over 100 ms on the harness machine.

### B.4 A finding: the going layer classifies the drawn slope (fact, then open)

`makeGoingPalette` (`world.js:530-548`) calls a triangle "hard for guns" above 9 degrees and "severe slope" above 17
degrees of `FACE.slope`, which is the slope of the drawn 10.33x mesh. In true slope these are **0.88 and 1.70
degrees** (derived: `atan(tan(t) / 10.33)`). The share of triangles in the slope classes is 9.4% "hard" and 10.0%
"severe" today; if the layer followed the drawn slope at 4x it would be 4.0% and 1.4%, at 1x 0.2% and 0.0%. So an
analysis layer would change its reading with a view setting. In 2B the classification must be computed from the
model's slope (presentation must not change analysis). Whether the thresholds should keep today's meaning (0.88 and
1.70 true degrees, so the map is unchanged) or be re-set in true degrees from a source is a data question, not
decided here: **question L2**, now **decision 32** (thresholds kept at 0.88 and 1.70 true degrees, labelled provisional
and unsourced until a data task decides).

### B.5 Recommended default (recommendation)

**4x.** At 4x the Pratzen's west face is drawn at 28.9 degrees at the 95th percentile (38 at the steepest triangle), which
reads as a slope rather than the 55-64 degree cone of today; the Pratzeberg stands 3.75 figure heights and 2.2 broadleaf
heights above Sokolnitz, so the relief reads above its own symbols; the Santon is about two figures above the
Goldbach; the low Pratzen view gives the relief 139 px. At 3x the Santon is 1.5 figures and the relief 1.6 trees, so
the knoll on the French left barely clears the tree crowns; at 5x the west face is back to 35-45 degrees.
The choice is visual: it trades the owner's aim (a defensible, not dramatic, relief) against legibility of the
relief above figure-scale symbols. 4x is what the numbers support. **Decided: decision 35 (4x).**

### B.6 True scale (1x): options (derived, then recommendation; decision 19 keeps 1x)

At 1x the ground is honest but every symbol is taller than the relief it stands on: a figure (1.98) is taller than
the whole Pratzeberg-Sokolnitz relief (1.85), a broadleaf is 1.8 times it. Options:

| option | what 1x shows | for | against |
|---|---|---|---|
| (a) unchanged, with a caveat | the same symbols on true-scale ground; the legend says "true scale: relief 1:1; figures, buildings and trees are symbols many times life size" | no new drawing mode; honest about the convention | the relief is unreadable under the symbols (renders `exag-1x-options.jpg`, left column) |
| (b) **formations as footprints at 1x** | figure blocks replaced by their modelled footprints (frontage and depth, ground scale) in the side colour; buildings, trees and scrub hidden, their extents shown by the village and wood cover already in the ground palette; counters and labels unchanged | everything drawn is then at ground scale, so 1x is a true-scale reading of the ground and the frontages, which is what 1x is for; it uses the footprint the model already has (`W0`, `D0`), so no new data | a second drawing mode to maintain; a visitor switching to 1x loses the figures |
| (c) 1x only from low, eye-level views | 1x offered only with the Stage 5 eye-level views from the command posts | at eye level, true relief is what an observer saw | Stage 5 dependency; does not answer 1x in the map views |

**Recommendation: (b)**, labelled in the legend ("true scale: formations drawn as their footprints"). It does not
rescale any symbol (decision 19): at 1x the figure-scale and landscape-scale layers are not drawn. Renders:
`docs/stage2-evidence/exag-1x-options.jpg` (Pratzen, low Pratzen and Zuran, (a) against (b)). **Decided: decision 34, option
(b)**; the footprint is built as one primitive that Stage 5's spatial-confidence display can reuse.

## C. Movement arrows, dashes, and "IV Column halted"

### C.1 The arrow binding report (fact and derived; `node tools/stage2/arrow-binding.js`)

**Method.** For each of the 36 arrows in `OVERLAYS` (drawn while the clock is in its phase), the formations its label
names (names, commanders' surnames, "I Column" = First Column and so on) are compared with the tracks, of the arrow's
side. Two readings of "the leg across that phase" are scored, because the model's convention decides between them:
**across** = the movement while the arrow is on screen (position at the phase's start to its end; the leg into anchor
ph+1); **into** = the leg that arrives at anchor ph, completed as the phase begins. Distances are metres between the
arrow's first point and the leg's start, and its last point and the leg's end (1 map unit = 31.6 m, `GEOREF`);
headings are compared. **Tolerance: 450 m at both ends and 35 degrees** (derived: about half a modelled division's
frontage, Saint-Hilaire's block being 872 m, so an arrow drawn from the front of a block still matches). Verdicts:
*interpretive* if the kind is `axis` (an ordered route), the label names a group (two or more formations, "A and B", or
a corps without a track) or no modelled formation; *derivable* if one named formation matches one-to-one in either
reading (the reading is recorded); *mismatch* otherwise.

**Re-run after the chronology data task (owner decision 46).** The tables below are the report re-run on the new tracks
(anchors may now be reached after their phase opens, or begin their move later in it: §M.8). A third reading is scored:
**exec** = the leg the model *executes* during the phase (every leg whose window overlaps the phase by a minute or more;
the arrow is derivable if it matches one of them one-to-one, same tolerance). The tables as first published, on the
Stage 1B tracks, are kept in §C.4.

**Summary (on the chronology data task's tracks).**

| verdict | arrows | which |
|---|---:|---|
| derivable, leg *into* the phase | 10 | Kienmayer (ph1); II Column → Sokolnitz, III Column → castle, Liechtenstein crosses the front, Friant retakes Telnitz (ph2); Saint-Hilaire, Vandamme (ph3); Caffarelli, Suchet, Nansouty's cuirassiers (ph5) |
| derivable, leg *across* the phase | 2 | Vandamme takes the height (ph8); **Bagration withdraws on Rausnitz (ph8)**, newly, because his withdrawal now runs inside phase 8 (16:30-16:45) |
| **derivable, leg executed in the phase (the 2C rule)** | **4** | Friant retakes Telnitz (ph2, leg 07:00-08:30), Saint-Hilaire (ph3, 08:45-09:15), Vandamme (ph3, 08:45-09:14), Vandamme takes the height (ph8, 14:30-17:00). On the Stage 1B tracks: 1 (Vandamme takes the height) |
| interpretive | 14 | unchanged (§C.4) |
| mismatch (neither *into* nor *across*) | 10 | the 11 of §C.4 less Bagration withdraws on Rausnitz |
| other overlay items | 24 | unchanged: all interpretive |

**The arrows that are not derivable on the executed leg** (18; the binding test of 2C will read this column). *Into* arrows
whose leg the model still executes in the phase before (the timing of their anchor is the phase-start default, with no dated
statement that moves it): Kienmayer (ph1), II Column → Sokolnitz, III Column → castle, Liechtenstein crosses the front
(ph2), Caffarelli, Suchet, Nansouty's cuirassiers (ph5). The 10 mismatches: V Column counter-marches north (ph0), I Column
descends and Friant's approach march (ph1), Kamensky turns about (ph4), Bagration (ph5: he now holds throughout phase 5, his
advance being dated c. 09:30), Drouet forms line (ph6), Saint-Hilaire wheels south, Vandamme wheels south, Przybyszewski's
breakout (ph7), I Column to the defile (ph8); plus Bagration withdraws on Rausnitz (ph8), derivable across the phase but on
two legs, 16:30-16:45 and 16:45-17:00, not on one. Per-arrow figures: `docs/stage2-evidence/arrow-binding.md`.

**Mismatches (both readings): data questions for 2C, not fixed here.** The endpoint distances are unchanged from §C.4 except:

| ph | arrow | the nearest leg of the named formation now | change from §C.4 |
|---|---|---|---|
| 1 | Friant's approach march | leg 1→2 (07:00-08:30): 2,010 / 241 m | the leg now ends at 08:30 (was 08:00) |
| 7 | Saint-Hilaire wheels south | leg 6→7 (13:00-14:00): 761 / 0 m | the leg now runs inside phase 7 (was 11:15-12:45) |
| 7 | Vandamme wheels south | leg 7→8 (13:15-14:30): 621 / 170 m; leg 6→7 (13:00-13:15): 572 / 3,174 m | both legs now run in phase 7 |
| 8 | I Column to the defile | leg 7→8 (14:30-15:00): 0 / 899 m | the leg now runs in phase 8 (was 12:45-14:30) |
| 8 | Bagration withdraws on Rausnitz | derivable across the phase; legs 7→8 (16:30-16:45) 0 / 608 m and 8→9 (16:45-17:00) | no longer a mismatch |

**What each mismatch's endpoints correspond to** (decision 37; derived: the named places (`FEATURES`), event markers and
`OVERLAYS` objectives within 600 m of each end point, nearest first). This is evidence for the per-arrow resolution after
§M, not a verdict.

| ph | arrow | start point | end point | reading |
|---|---|---|---|---|
| 0 | V Column counter-marches north | Pratzen Heights 268 m; event `face-about` 268 m | nothing within 600 m (Stare Vinohrady 854 m) | a direction on the plateau, not a place |
| 1 | I Column descends | nothing within 600 m | event `buxhowden-blind` 530 m | follows the column's own route; ends short of the anchor |
| 1 | Friant's approach march | nothing within 600 m (off the map toward Raigern) | event `davout` 241 m; Telnitz 538 m | points at the event "Friant's leading brigade reaches the Goldbach" |
| 4 | Kamensky turns about | nothing within 600 m | the Pratzeberg 170 m; events `kamensky` and `pratzeberg` 170 m | points at the summit, the objective of the counter-attack |
| 5 | Bagration | nothing within 600 m | Brünn–Olmütz highway 430 m | along the highway |
| 6 | Drouet forms line | nothing within 600 m | nothing within 600 m | neither |
| 7 | Saint-Hilaire wheels south | event `face-about` 348 m; Pratzen Heights 381 m | nothing within 600 m (event `wheel` 710 m) | a direction (the wheel) |
| 7 | Vandamme wheels south | event `face-about` 430 m | nothing within 600 m | a direction (the wheel) |
| 7 | Przybyszewski's breakout | event `sokolnitz-falls` 544 m | Kobelnitz 544 m; objective "Kobelnitz — never reached" 544 m | points at the break-out's objective, Kobelnitz |
| 8 | I Column to the defile | Telnitz 460 m; events `telnitz-retaken` 384 m, `telnitz` 460 m | Augezd and the objective "The Augezd defile" 114 m | points at a place: the defile |
| 8 | Bagration withdraws on Rausnitz | nothing within 600 m | nothing within 600 m (toward Rausnitz, off the map) | a direction toward an off-map place |

**What this shows now (derived).** With the dated moves in place, the arrows drawn on the *into* reading for phases 2 and 3
(Friant, Saint-Hilaire, Vandamme) now show the leg the model runs during their phase, which the Stage 1B tracks ran a
phase early. Seven *into* arrows still sit one phase after their leg, because nothing in the app dates those moves later
than the phase-start default; they are not evidence that the default is wrong. The wheel arrows (ph7) and the I Column's
retreat (ph8) now fall in the right phase but still start or stop off the anchors; their endpoints are decision 37's per-arrow
questions.

**The rule for 2C (owner decision 46).** *The arrow shown during phase ph depicts the leg the model executes during phase
ph* (the **exec** column): a leg whose window overlaps the phase. With the phase-start default, that is the leg into the
next phase's anchor; with a dated move, it is the dated leg. 2C derives arrows from this reading, and resolves the arrows
that are not derivable on it one by one under decision 37.

**After 2C (fact; `node tools/stage2/arrow-binding.js`, `binding-test.js`; `docs/stage2-evidence/arrow-binding.md`).** The
rule above is implemented: every arrow either names the leg, or run of consecutive legs, that the model executes during its
phase (`leg:[id, from, to]`), and takes its points from the track (`arrowPts`), or carries an interpretive marker
(`interp:"<kind>: <why>"`). Of the 36: **17 derived** (all derivable on the executed reading, end points equal to the anchors
exactly), **19 interpretive**: 4 routes (the `axis` arrows of phase 0), 3 objectives, 5 groups, 4 unmodelled, 1 halt and 2
unsettled, hand-authored and listed by name. Decision 37's three outcomes needed a fourth reading, stated here because it
is an interpretation of decisions 33 and 46 rather than of 37. **Where the model is right and the arrow was drawn a phase
late or off its leg, the arrow now follows the model**: it is generated from the leg the model executes in its phase. Where
that leg is the one the arrow depicted, the arrow moves to the phase that leg runs in (Caffarelli, Suchet and Bagration, to
phase 4: its timeline dates "Lannes advances along the highway. Bagration counter-attacks." c. 09:30). Otherwise it
depicts the executed leg in its own phase, under the same label, where the formation's act in that phase still describes it.
**No track changed**: no arrow gave evidence that a track was wrong, and the sources that would test the doubtful hours are
unread (§M.9). Arrow by arrow, with was and is, in `CHANGELOG.md` (Stage 2C).

| verdict after 2C | arrows |
|---|---|
| derived, same phase | V Column counter-marches north (ph0, lich 0→2); Kienmayer (ph1, 1→2); Friant's approach march (ph1, friant 1→2); Liechtenstein crosses the front (ph2, lich 2→3); Friant retakes Telnitz (ph2, friant 1→2); Saint-Hilaire, Vandamme (ph3, 2→3); Nansouty's cuirassiers (ph5, 5→6); Drouet forms line (ph6, 6→7); Saint-Hilaire wheels south (ph7, 6→7); Vandamme wheels south (ph7, 6→7→8); Przybyszewski's breakout (ph7, 7→8); Vandamme takes the height (ph8, 8→9); Bagration withdraws on Rausnitz (ph8, 7→8→9) |
| derived, moved to the phase its leg runs in | Caffarelli, Suchet, Bagration (ph5 → ph4, 0→5, 09:30-10:30) |
| interpretive: objective | II Column → Sokolnitz, III Column → castle (ph2); I Column to the defile (ph8) |
| interpretive: unsettled (hand-authored, listed) | I Column descends (ph1; the Dokhturov conflict, `dok@1`); Kamensky turns about (ph4; the Kamensky conflict, `kamensky@3`, `kamensky@4`) |
| interpretive: route, group, unmodelled, halt | as before (§C.4), with "IV Column halted" now the `halt` kind (§C.3) |

### C.2 Dashed and segmented drawing today (fact)

| drawing | where | kind | in `VISUAL_SPEC.md` §10.5? | Stage 2 |
|---|---|---|---|---|
| `axis` arrows: 9 segments | `buildArrow`, `app.js:1109-1111` | intended routes | yes | kept dashed (decision 15); re-drawn draped in 2C |
| **corps boundaries: 7 segments** | `buildBoundary`, `app.js:1144` | disposition | **no** | solid thin line, annotation colour (decision 21, 2C) |
| plan-divergence links | `buildPlanLinks`, `app.js:2267` (`LineDashedMaterial`) | plan | yes | kept |
| **plan staging-area outline: 33 alternate segments** | `planStaging`, `app.js:2224-2233` (`a % 2` with `LineSegments`) | plan | **no** | kept dashed (a plan, decision 15); add to the inventory and to the Plans legend line |
| valley and dead-ground lines | `buildAnalysis`, `world.js:1331` | terrain notation | yes | kept, terrain-study layer only |
| legend dash sample | `style.css:90`, `shell.html:151` (`.an-only`) | legend | yes | kept |
| movement trail | `updateTrail`, `app.js:1060`: `computeLineDistances()` on a solid `LineBasicMaterial` | solid (1B) | yes | a leftover call with no effect; remove in 2C |
| front lines: 15 perpendicular ticks | `buildLine`, `app.js:1128-1135` | ticks (side of the line), not dashes | n/a | kept; draped in 2C |
| ridge and escarpment ticks, marsh reeds | `world.js:1340-1353`, `1292-1312` | map symbols | n/a | kept |

No canvas drawing uses `setLineDash`; counters draw no dashes (1B).

### C.3 "IV Column halted" (recommendation; the data change is 2C's, under decision 22)

Today `OVERLAYS[2]` holds `{pts:[[325,230],[301,237]], kind:"axis", side:"al", label:"IV Column halted"}` (`app.js:35`),
drawn as a dashed intended route. The data describe a column held up on the plateau, not a route: phase 2's lede
(`data.js:68`), the Kobelnitz feature ("the Allied 4th Column, which never reached it", `data.js:653-655`), and phase 0's
own intended route "IV Column → Kobelnitz" (`app.js:19`).

**Proposal.** A new overlay kind, **halt**: a short solid bar across the column's line of march at the point it had
reached, in the side colour and cased like the arrows, with no head, and the label in the annotation colour. Its
position is the arrow's last point `[301,237]`, its direction the arrow's own `[[325,230],[301,237]]`; its length is the
column's modelled frontage. The intended route stays what it is: the dashed `axis` arrow of phase 0. The binding test
treats `halt` as interpretive. Legend line: "halt: a column stopped short of its objective". The 2C change is then
traceable: the entry's kind changes from `axis` to `halt` (what it was, the evidence above, what it becomes, why).
Reading (derived): the Fourth Column's centroid (Miloradovich and Kollowrat) is 200 m from `[301,237]` at the end
of phase 2, within the binding tolerance, so the bar stands where the model has the column.

### C.4 Appendix (dated 2026-09, before the chronology data task): the binding report on the Stage 1B tracks

These are §C.1's tables as first published, from `arrow-binding.js` on the Stage 1B build (md5 `5bf48b75…`), kept for
comparison. The full table is `docs/stage2-evidence/arrow-binding-before-chronology.md`.

**Summary.**

| verdict | arrows | which |
|---|---:|---|
| derivable, leg *into* the phase | 10 | Kienmayer (ph1); II Column → Sokolnitz, III Column → castle, Liechtenstein crosses the front, Friant retakes Telnitz (ph2); Saint-Hilaire, Vandamme (ph3); Caffarelli, Suchet, Nansouty's cuirassiers (ph5) |
| derivable, leg *across* the phase | 1 | Vandamme takes the height (ph8) |
| interpretive | 14 | the four ordered routes of phase 0 and "IV Column halted" (`axis`); Jurczek's Austrians, Levasseur up the Goldbach, Over the Satschan mere, Across the Menitz mere (no modelled formation); Liechtenstein and Uvarov, Russian Imperial Guard, Bessieres and Rapp, Davout resumes the offensive, Legrand and Friant (groups) |
| mismatch | 11 | listed below as data questions |
| other overlay items | 24 | 8 lines, 2 boundaries, 14 objective markers: all interpretive |

**Mismatches: data questions for 2C, not fixed here.**

| ph | arrow | the nearest leg of the named formation | question |
|---|---|---|---|
| 0 | V Column counter-marches north (Liechtenstein) | no anchor at phase 0; the leg 0→2 starts at the arrow's start and ends 1,159 m from its end | the counter-march is drawn in phase 0 but the track moves over phases 0-1; which is meant? |
| 1 | I Column descends (Dokhturov) | leg 0→1: 0 / 470 m, 2 degrees | 20 m outside tolerance: the arrow stops short of the anchor |
| 1 | Friant's approach march | leg 1→2 (across): 2,010 / 241 m; leg 0→1: 3,297 / 885 m | the arrow starts about 2 km east of where the track has Friant |
| 4 | Kamensky turns about | leg 3→4: 651 / 71 m | the arrow starts 651 m from the phase-3 anchor |
| 5 | Bagration | leg 0→5: 858 / 0 m, 10 degrees | the start differs by 858 m |
| 6 | Drouet forms line | leg 3→6: 1,759 / 170 m | the start differs by 1.8 km |
| 7 | Saint-Hilaire wheels south | leg 6→7: 761 / 0 m | start 761 m off |
| 7 | Vandamme wheels south | leg 7→8 (across): 621 / 170 m | 171 m outside tolerance at the start, and drawn on the *across* reading |
| 7 | Przybyszewski's breakout | leg 7→8 (across): 0 / 684 m | the arrow ends 684 m short of the phase-8 anchor |
| 8 | I Column to the defile (Dokhturov) | leg 7→8: 0 / 899 m | ends 899 m short |
| 8 | Bagration withdraws on Rausnitz | leg 7→8: 0 / 608 m | ends 608 m short |

**What this shows (derived).** (1) The arrows were drawn from the same anchors as the tracks: 16 of the 22 arrows
that name one tracked formation (and are not `axis`) start within 5 m of one of its anchors. (2) They were authored
mostly on the *into* reading (10 of 11 derivable), with three on the *across* reading (Vandamme twice, Przybyszewski). (3) Of the 11 mismatches, 4 arrows stop short of the anchor, 6 start off it, and 1 is a question of phase (the V Column's counter-march). Decision 22's "legs across that phase"
would draw 10 of the 11 derivable arrows one phase later than today. **Decision 33:** neither reading is adopted; the model's
timing is audited first (§M), and the arrows follow the corrected model. The full list, with every
candidate's distances, is `docs/stage2-evidence/arrow-binding.md` (from `arrow-binding.js --md`).

## D. The Allied arrowhead (owner decision 20)

**Probe (fact; `node tools/stage2/arrowheads.js`).** The phase's `OVERLAYS` arrows drawn as ground-draped ribbons with the
app's own `planRibbon()` (dark casing, side colour from `TOKENS.sym.side`), shaft 2.0-2.6 units, head 7.5 units wide and
6.5 long, notch 0.38 of the head's length; Allied heads notched (the chevron), French plain. Phase 5 (10:50: attacks
and counter-attacks on both sides) and phase 8 (15:30: Allied retreats, French attacks), at the Overview vantage and
in a close view, on the landscape and on the paper map. Every render is also simulated in greyscale and under
protanopia, deuteranopia and tritanopia (Machado 2009, full severity). Evidence: `docs/stage2-evidence/heads-*.jpg`
(contact sheets: normal, greyscale, three simulations) and `heads-crops-terrain.png`, `heads-crops-paper.png` (every head
on screen at 2x without smoothing, normal above greyscale).

| view | Allied head width, px | notch depth, px | French head width, px |
|---|---|---|---|
| Overview (both phases, both modes) | 35.8-38.3 | 11.5-12.3 | 35.0-37.1 |
| close, phase 5 | 110.5-114.2 | 34.6-53.9 | 127.0-150.1 |
| close, phase 8 | 107.2-161.3 | 30.6-43.3 | 91.3-131.5 |

**Reading (judged by eye on the crops, with the sizes above).**
- *Greyscale:* side blue and Allied amber fall to nearly the same grey (as predicted, CIEDE2000 2.1, `VISUAL_SPEC.md` §7);
  the head's shape is then the only cue, and it is resolved: at the Overview zoom the notch is 11.5-12.3 px deep, about
  a third of the head, and the notched and plain heads are distinct in every crop where the head is not covered by
  something else. At close zoom the difference is unmistakable.
- *Colour-vision simulations:* blue and amber stay distinct under protanopia and deuteranopia (blue against olive) and
  under tritanopia (teal against red), as in Stage 1; the head adds a redundant cue.
- *Paper map:* the same, on the light ground.
- **Verdict: the chevron passes** as the Allied side cue at overview zoom and in greyscale (decision 20). Two
  conditions found, neither about the shape: (1) at the Overview, heads are small enough (about 36 px) that a label or
  another ribbon drawn over a head hides the notch; in 2C heads are drawn above ribbons and the label layer keeps clear
  of them (2D); (2) one Allied head in the phase 8 Overview lay under the timebar, a framing matter (§H), not a legibility
  one. A numeric legibility test was not made: the verdict rests on the measured sizes and on inspection.
- Plan ribbons keep their own heads (decision 20); a plan still reads as a plan by the heavy tapered ribbon, the dashes
  of the divergence links and staging outlines, and the Plans overlay being switched on.

## E. Map text today, measured from the projected sprites

**Method (fact; `node tools/stage2/map-text.js`).** Stage 1B's `check:contrast` measured page text only; canvas text
was computed from the drawing code. Here every in-scene element is measured as drawn: an init script records every
`fillText` on every canvas (text, font size through the canvas transform, fill colour, the run's box), each visible
sprite is projected with the live camera, and a run's on-screen size is its canvas font size times the sprite's
screen height over the canvas height. Contrast is read from the rendered frame: within the run's screen box (plus
2 px), the pixels at least half the largest RGB distance from the ink are the text's rendered surround (halo, plate or
ground); the ink is the recorded fill at the sprite's opacity over it; the value reported is the 10th percentile over
those pixels. Floors (decision 16): 12 px for battle information (formation names, movement and objective labels,
events, the plateau statistic, the counter's name, strength and status), 10.5 px for tertiary map text (designation,
echelon, nation tag, badges, place and terrain-study labels). AA: 4.5:1 below 18 px (14 px bold), else 3:1.
Objective names are drawn as overlay labels and are counted there; the objective marker itself is a symbol.

**Per harness view (fact).**

| view | elements | text runs | below floor | below AA | unobstructed 1600x900 (case viewport) | unobstructed 1280x720 |
|---|---:|---:|---:|---:|---:|---:|
| first-run | 40 | 37 | 26 | 1 | 54.4% (1600x900) | 43.9% |
| first-run-laptop | 38 | 35 | 24 | 1 | 48.3% (1366x768) | 43.9% |
| overview-field | 35 | 34 | 25 | 6 | 33.9% (1600x900) | 19.7% |
| overview-plan | 34 | 33 | 21 | 3 | 80.5% (1600x900) | 79.9% |
| close-sokolnitz | 19 | 17 | 0 | 7 | 80.5% (1600x900) | 79.9% |
| staff-paper | 23 | 103 | 3 | 29 | 33.9% (1600x900) | 19.7% |
| pratzen-low | 21 | 20 | 3 | 4 | 80.5% (1600x900) | 77.1% |
| pratzen-orbit-min | 21 | 20 | 6 | 8 | 80.5% (1600x900) | 77.1% |
| selected-formation | 31 | 30 | 5 | 1 | 17.5% (1600x900) | 19.7% |
| watch-selected | 23 | 22 | 3 | 1 | 78.4% (1600x900) | 73.2% |
| hybrid-dimmed | 30 | 144 | 33 | 22 | 78.7% (1600x900) | 74.3% |
| **all 11** | 315 | 495 | 149 | 83 | | |

**Per element (fact, all eleven views).**

| element | floor | text runs | on-screen size, px | below floor | below AA | lowest contrast |
|---|---:|---:|---|---:|---:|---:|
| name | 12 | 116 | 11.5-35.4 | 79 | 14 | 3.59 |
| event | 12 | 6 | 12.7-28.8 | 0 | 0 | 3.63 |
| plateau | 12 | 8 | 12.7-14.3 | 0 | 1 | 3.91 |
| overlay | 12 | 61 | 6.0-61.6 | 37 | 6 | 3.21 |
| objective | 10.5 | 0 | - | 0 | 0 | - |
| place | 10.5 | 78 | 10.7-20.8 | 0 | 14 | 2.92 |
| counter | 12 / 10.5 | 226 | 7.5-15.2 | 33 | 48 | 1.11 |

**Today, 149 of 495 in-scene text runs are below their floor and 83 below AA** (derived from the tables). What they are:
- **Movement (overlay) labels at 6.0-9.8 px** in every overview (37 runs): they are sized in world units and shrink with
  distance; nothing enforces a minimum. The largest single failure of decision 16 on the map.
- **Formation names at 11.5-12.0 px** in distant views (79 runs): their minimum on-screen height is set just under the
  12 px floor.
- **Counters on the paper map and in the hybrid view** (33 below floor, 48 below AA): the grey designation, strength and
  commander text (`#5D5A4E` on the paper halo) measures 2.9-4.5:1 where the translucent halo lies over darker hillshade (Stage 1B computed it against the halo
  colour alone); dimmed counters' nation tags, drawn at 34% opacity by design (decision 13), measure about 1.7:1, and
  some undimmed tags on the paper map 1.1-2.9:1 (these may be the margin artefact below, where a tag sits against the
  frame's keyline); in the hybrid view dimmed counters also shrink to 7.5 px text.
- **Place labels** keep their size (10.7-20.8 px) but 14 runs fall below AA over bright or busy ground (lowest 2.92:1).

Caveats (fact): the 2 px margin can take in a neighbouring mark (a frame keyline, another label), which can only lower
a value; the per-run list with every value is in `docs/stage2-evidence/map-text.json`. The Stage 1B claim that canvas
text meets AA (computed) is therefore **not confirmed by measurement** for the paper-map counters and dimmed tags.
2D moves this text into the DOM layer, where `check:contrast` measures it (§J).

## F. The DOM/SVG layer (owner decision 24)

### F.1 Design (recommendation)

- **One layer, one pass.** A single absolutely positioned DOM container over the canvas (above the WebGL canvas, below
  the interface panels), holding every counter and every piece of map text as HTML elements, plus one SVG for leader
  lines. No framework; built with the same `el()` helper the interface uses. The canvas sprite path (`drawSymbol`,
  `makePlainLabel`, `makeFeatureGlyph`, the label sprites and `declutter`) is removed once parity is shown (decision 24).
- **Priority order** (highest first): the selection; the highlighted family; counters by echelon (army, corps, division,
  brigade; larger strength first within an echelon); live events (by `evWeight`); the plateau statistic; movement
  labels; formation names (landscape); place labels, major features first; terrain-study labels; objective names.
- **Placement.** Each element first tries its anchor (bottom-centre 6 px above its ground point), then eight
  neighbouring positions, then rings of 24-144 px with a leader line to the anchor. An element that finds no place is
  dropped for this frame and counted; in 2D the selection and the highlighted family are never dropped (they displace
  lower-priority elements instead; the probe places them first but does not yet displace others).
- **Obstacles.** The fixed panels (rail, dispatch, legend, drawer, top controls, timebar, tour bar, selection chip,
  layers popover), read as rectangles once per layout; placed elements (2 px pad).
- **Occlusion (oblique views).** A ray from the eye to each anchor against the terrain mesh (`Raycaster` on the ground
  mesh, which carries the display height); an anchor behind the drawn ground is dropped. In the probe this is part of
  the pass time below; 2D may cache it per camera position.
- **Update policy under render-on-demand.** The layout runs only in a frame that is drawn (camera moved, clock changed,
  selection or layer changed) and after a resize; a frame skipped by render-on-demand does not lay out. Element content
  (text) is rebuilt only when its key changes (as `refreshSymbol` does today with `texKey`), positions every drawn frame.
- **Compact counter (default):** a 40 x 28 px cased frame (1 px keyline, 3 px side band, keyline, nation fill), the arm
  glyph (SVG), the nation tag (10.5 px), the echelon mark above (10.5 px), the B / C / ? badge on its plate, the status
  icon without its text (decision 38), and the short name beside it at 12.5 px. **Full counter** (on hover, keyboard focus, selection, for the highlighted family, and
  when zoomed closer than a stated distance, set in 2D from the harness views): adds the strength (12.5 px) and the
  status plate with its icon (12.5 px); the commander's name appears in the full counter. All colours from `TOKENS`.
- **Accessibility.** Each counter is a focusable element (`tabindex`, `role="button"`) with an accessible name
  ("Saint-Hilaire's Division, French, division, about 6,600, attacking, position grade B"); Tab moves through counters
  in priority order, Enter selects; the selection is announced as the dossier opens (existing live region). Picking by
  the drawn footprint: a click on a counter element selects it, and a click on the ground tests the formation's
  footprint polygon (frontage by depth) instead of today's 34 px radius.
- **How the checks read it.** `measure.js` takes the layer's rendered boxes (`getBoundingClientRect`) for the label
  statistics, so overlaps are counted on what is drawn; `check:contrast` reads the layer as it reads any page text (it is
  DOM), with the map backdrops, and applies the 10.5 / 12 px floors (§E); `selfTest` gains the accessibility checks.

### F.2 The legend (decision 29; recommendation)

- **Contextual:** one row per encoding actually on screen, written from the same tables that draw it (as the Stage 0
  colour key and the Stage 1 going rows already are): side colours and heads when arrows are shown, the dash only with
  plans or the terrain-study layer, the badge row only when counters are, the going classes only with the going layer,
  "halt" only when one is drawn.
- **Always:** the scale line: "Ground to scale; relief exaggerated 4x (true scale: 1x)"; on the paper map "Hillshade
  exaggerated Nx"; and the two named symbol scales ("figures about 45-70x life; buildings and trees about 10-15x life",
  `VISUAL_SPEC.md` §9), with the provisional standard ratio noted in the sources sheet (§I.1).
- **Compact and collapsible:** a single column sized to its rows (no fixed empty area, which Stage 1B left), collapsed to
  a "Key" button by default in Watch; it is one of the obstacles of the layout (§F.1) and is placed so that it never
  overlaps the dispatch (a rectangle test, §J).

### F.3 Prototype (fact; `node tools/stage2/dom-layer.js`)

The probe hides the canvas label sprites and lays out the same items as DOM elements in one pass (compact counters,
full for the selection and the highlighted family; the priority, placement, obstacle and occlusion rules of §F.1), in
all eleven harness views. Overlaps are re-checked independently on the rendered boxes. Screenshots:
`docs/stage2-evidence/dom-layer.jpg` (the probe's output in four views).

| view | items | placed | with leader | dropped (no room) | occluded | off screen | overlaps | over a panel | canvas today: visible / hidden / unresolved / overlaps | DOM nodes | pass ms (median of 5) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---:|---:|
| first-run | 37 | 32 | 8 | 4 | 0 | 1 | 0 | 0 | 37 / 12 / 0 / 0 | 55 | 177.9 |
| first-run-laptop | 35 | 28 | 11 | 6 | 0 | 1 | 0 | 0 | 35 / 14 / 0 / 0 | 59 | 170.2 |
| overview-field | 34 | 15 | 3 | 19 | 0 | 0 | 0 | 0 | 34 / 10 / 0 / 0 | 42 | 204.8 |
| overview-plan | 34 | 32 | 7 | 0 | 0 | 2 | 0 | 0 | 33 / 10 / 0 / 0 | 50 | 155.9 |
| close-sokolnitz | 21 | 16 | 1 | 0 | 0 | 5 | 0 | 0 | 19 / 9 / 0 / 0 | 25 | 84.5 |
| staff-paper | 22 | 17 | 6 | 5 | 0 | 0 | 0 | 0 | 22 / 9 / 0 / 0 | 114 | 114.3 |
| pratzen-low | 21 | 19 | 5 | 1 | 0 | 1 | 0 | 0 | 20 / 7 / 0 / 0 | 33 | 104.5 |
| pratzen-orbit-min | 21 | 19 | 0 | 0 | 1 | 1 | 0 | 0 | 21 / 21 / 0 / 0 | 23 | 93.6 |
| selected-formation | 33 | 16 | 11 | 14 | 0 | 3 | 0 | 0 | 32 / 5 / 0 / 0 | 57 | 129.3 |
| watch-selected | 25 | 21 | 0 | 1 | 0 | 3 | 0 | 0 | 22 / 11 / 0 / 0 | 27 | 101.9 |
| hybrid-dimmed | 30 | 27 | 8 | 0 | 0 | 3 | 0 | 0 | 30 / 10 / 1 / 1 | 160 | 126.2 |

**Reading (derived).**
- **0 overlaps and 0 elements over a panel in every view**, including hybrid-dimmed, where today's canvas pass leaves
  the Walther / Nansouty pair unresolved: the known residual can be retired (decision 24).
- **Drops:** 50 of 313 items found no room, almost all formation names and place labels in the Study views, where the
  rail, dispatch and legend leave 17.5-33.9% of the screen (§H): overview-field drops 14 of 20 names, selected-formation
  8 of 16. In the one view with a highlighted family of counters (hybrid-dimmed) none was dropped. Today's canvas pass hides a similar number
  (5-21 per view) but silently; the layer reports them, and 2D sets a ceiling (§J).
- **Pass time: 84-205 ms, of which the occlusion rays are nearly all** (timed separately on two views: the rays took
  205.7 ms in a 204.8 ms median pass, and 124 ms of 126 ms; the rest of the pass is 2-3 ms):
  each ray is tested against the 134,400-triangle ground mesh with no spatial index. **Recommendation:** occlusion by marching each ray over the display height grid (`groundY` at
  about 64 samples per ray, some 2,000 lookups a pass), or by one read of the depth buffer; either brings the pass to a
  few milliseconds. The 2D budget (§J): layout pass under 8 ms at 1600 x 900 on the harness machine.
- **DOM nodes:** 23-160 per view (160 with 18 counters in the hybrid view); no concern.
- The probe's anchors for counters are the ground point plus 2.2 units (where counters stand today); anchored on the
  ground itself, three hybrid counters were wrongly occluded by the slope they stand on, so 2D lifts anchors likewise.


## G. The north-up paper map (owner decision 25)

### G.1 Today and the probe (fact; `node tools/stage2/paper-map.js`)

| | today: staff mode, Overview vantage | probe: north up, straight down, field of view 4 degrees |
|---|---|---|
| camera | perspective 37 degrees, eye `(-27,272,41)`, target `(-27,0,9)`: tilted about 7 degrees | eye straight above the frame's centre, `camera.up` = `GEOREF.NORTH`, far above (near-orthographic), `setViewOffset` centring the frame in the free area |
| true north on screen | **18.4 degrees** off up | 0.2 degrees |
| screen px per true km at the Pratzeberg / Sokolnitz / the Santon / Satschan | 79.6 / 79.0 / 75.5 / 78.7 (**5.2%** spread) | 28.6 / 28.6 / 28.7 / 28.6 (0.3%) |
| battlefield frame on screen / inside the unobstructed area | 51.6% / 35.9% | 99.9% / 99.9% |

Renders: `docs/stage2-evidence/paper-map.jpg` (today; the probe at the overview; the probe closer, on Sokolnitz).
The probe's closer view on Sokolnitz: 102.4 / 102.0 / 102.4 / 101.5 px per km (0.9% spread) and north 1.0 degree
off up: at close range the 10.33x relief's parallax shows even at 4 degrees, which is why the recommendation is a true
orthographic camera over flat ground.

### G.2 Design (recommendation)

- **Camera: orthographic** (`THREE.OrthographicCamera`, available in r128), looking straight down, `up` =
  `GEOREF.NORTH` (rotation `GEOREF.ROT_DEG`, 17.42 degrees). Reasons: one scale everywhere, so the scale bar is
  exact across the view (today it is valid only at the centre, `VISUAL_AUDIT.md` low-impact list); no parallax, so
  the paper map does not depend on the relief's drawn height at all. The near-orthographic probe shows the result
  (0.3% scale spread); a true orthographic camera makes it exact. Cost: three places size labels from the perspective
  field of view (`pxPerWorld`, `labelRect`, `fitLabel`, `app.js:2475-2515`, `2716`); the DOM layer (2D) removes the
  sprite sizing, and a projection helper `worldPerPx(point)` serves both cameras. This is why 2E follows 2D.
- **Ground:** the paper map draws the ground **flat** (factor 0 in the 2B helper) with a cartographic hillshade computed
  from the model normals at its own factor, stated in the legend ("hillshade exaggerated N times"; N chosen on the
  renders in 2E, the landscape factor is irrelevant, decision 19). Contours at their model levels, drawn flat.
- **Drawn:** hillshade, contours, flat village footprints (from `VILLAGES` extents, not roofs), water, woods as map
  symbology (outline and a tree-symbol fill), draped (flat) arrows of 2C, compact counters of 2D.
  **Hidden:** figures, roofs, chimneys, spires, 3D trees and scrub, smoke and dust, mist (today's staff mode still draws the
  houses as roofless crates, visible in the probe's renders, and its chimneys, `VISUAL_AUDIT.md` low-impact list).
- **Controls:** drag pans (screen-space drag moves the orthographic centre), wheel zooms toward the cursor (the ground
  point under the cursor stays under it), keyboard pan and zoom; no orbit or tilt. Written as a small map-controls
  module that Stage 3 reuses for the landscape.
- **Framing:** `setViewOffset` (or the orthographic frustum's offset) centres the focus in the unobstructed rectangle
  (§H), so the rail, the dispatch and the timebar never hide the part of the map in question.
- **Harness cases to add:** `paper-north-up` (overview, 09:30), `paper-close` (Sokolnitz), `paper-drawer` (a formation
  selected, dossier open), `paper-laptop` (1280 x 720); assertions in §J.

## H. A new baseline: the unobstructed map fraction

**Definition (recommendation, measured now).** The share of the viewport not covered by the union of the fixed
interface panels (rail, dispatch, legend, timebar, top controls, view-mode switch, first-run card, drawer, tour bar,
selection chip, layers popover, view badge; the harness's own list), sampled on a 4 px grid, per harness view, at the
case's viewport and at 1280 x 720 (the same state). It is reported by every part of Stage 2 and **must not fall** in any
view (§J). Values today (fact; `map-text.js`) are in the per-view table of §E, last two columns: from **17.5%**
(a formation selected: rail, dispatch and drawer) and **33.9%** (Study presentation, overview and paper map) to 80.5%
(Watch). At 1280 x 720 the Study views fall to **19.7%**. So in the default Study presentation two-thirds of a
1600 x 900 screen, and four-fifths of a 1280 x 720 one, is interface, not map. Stage 2 must not make this worse; the
large gains (docking the dispatch, the timebar) are Stage 3 (decision 30).

## I. Flags at figure scale, and the meres

### I.1 Standards and flags (fact, then recommendation; decision 26)

Today (fact, `app.js:392-393`, `855-875`): the pole is 5.2 units (6.5 for a single-standard block, `tall` 1.25), from
the ground to its top; the cloth is 2.4 x 1.4 units, hung with its centre at 4.5 units (5.6). A standing figure is
1.98 units, so the pole top is **2.63 (3.28) figure heights** and the cloth spans 1.9-2.6 figure heights.

**Proposal (accepted, decision 36): a provisional pole-top-to-man ratio of 1.6**, with the cloth, the pole's thickness and the hanging
offsets scaled by the same factor (0.61; 0.49 for the single-standard block, so every block uses one ratio): pole
3.17 units, cloth 1.46 x 0.85, cloth bottom at 2.32 units (1.17 figure heights).

**Basis (a design rule, not a historical value):** the cloth must clear the heads of the ranks it stands among
(its bottom at least 1.05 figure heights, so the colour reads above the block), and the pole should be the shortest
that does so with today's cloth proportions; 1.6 is that value to one decimal. It is not presented as the real
ratio of a pike to a man, which is not sourced in this project. The code constant and the sources sheet say
"provisional (Stage 2): chosen so that the colour clears the ranks; to be replaced by a sourced ratio in Stage 6". For
cavalry the reference height is the mounted figure's, by the same rule.

### I.2 The meres: research note (decision 27)

**Status: sources located, none yet obtained as a georeferenced outline. No outline changes.** The network policy of
this environment blocked opening the pages directly; everything below comes from search results that quote or
summarise them, and every figure must be read from the source itself before any use. Nothing here is a fact about
1805 until then; the labels say "reported".

**The ponds in the app today (fact).** Two ellipses: Satschan (`SATS`, map `[268,421]`, semi-axes 28 x 10.5 world
units, about 1.77 x 0.66 km) and Menitz (`MENI`, `[187,457]`, 23 x 9 units, about 1.45 x 0.57 km), `world.js:187-188`,
`872-884`, `245-246`; the Kobelnitz ground is drawn as marsh (`MARSH`, "Kobelnitz bottom", `world.js:92-94`), not as a
pond. Areas of the ellipses (derived): Satschan about 3.7 km², Menitz about 2.6 km².

**Candidate sources.**

| source | date | covers the ponds? | accuracy (reported) | relevance to 2 Dec 1805 |
|---|---|---|---|---|
| First Military Survey (Josephine) | 1764-68 | expected to (the ponds are older); not checked | surveyed "a la vue", without a geodetic basis: low positional accuracy, known | before the battle; needs local rubber-sheeting to be usable |
| Stable cadastre, imperial obligatory prints, 1:2,880 (ČÚZK archive) | Moravia 1824-1830 and 1833-1836 | depends on whether each pond still existed; not checked | trigonometric survey: the most accurate of the four | after the battle, and after any draining or conversion to fields; shows a later state |
| Second Military Survey (Franciscan) | Moravia 1836-1840 (146 sections; accepted by the owner, superseding "1836-52") | as the cadastre (it was drawn on it) | triangulated, derived from the cadastre | as the cadastre |
| Contemporary battle plans (French and Austrian) | 1805-06 and after | usually show both ponds | schematic; not surveyed | the state at the battle, but not georeferenced |

**The draining in December 1805 (reported).** A report by František Brutmann, administrator of the Chrlice estate,
quoted in Czech local sources (austerlitz.org, Žatčany chronicle; obeczatcany.cz), says the Satschan pond was
drained on Napoleon's order between **8 and 16 December 1805** and held two drowned Russian soldiers, 180 artillery horses
and 18 guns. **Correction (owner, on review):** austerlitz.org's Žatčany page gives **8-12 December 1805**; the estate
report as quoted elsewhere gives **8-16 December**. The two dates are a disagreement between sources, not an error in one
of them; both are recorded with their sources and neither is adopted until the report itself is read. (Not verified here:
the pages could not be opened from this environment.) English-language summaries (napoleon-series.org, historyofwar.org) give 38 guns and about 130 horses,
or two or three men and about 150 horses. **The app's own data** (`FEATURES`, satschan, `data.js:687`) says "38 guns,
about 130 horses, and two men (figures as usually given)". These disagree; the disagreement is kept, and changing the
data is a data task. The finds disagreement (18 guns and 180 horses in the quoted report; 38 guns and about 130 horses in the app's data and the
English summaries) stays open for a data task.

**Areas that disagree (reported).** Menitz: 514 ha (one local source) against "over 800 ha" and "the largest pond in
Moravia" (another; slavkov-austerlitz.com); a search summary of the same article also gives "almost 189 jitra
(about 108 ha) when abolished in 1827", which may refer to a remnant or to another pond. The Satschan pond's area was
not found. Both disagreements are kept; the ellipses in the app (about 2.6 and 3.7 km², i.e. 260 and 370 ha) are
schematic and not fitted to either.

**Kobelnitz (reported).** Kobylnice's municipal history says a pond flooded the site of the village's 15th-16th
century fort and was drained in the 19th century. Its extent and whether it held water in December 1805 were not
found; the app draws the ground as marsh.

**Status at 2F (fact):** no georeferenced outline has been adopted; the meres are unchanged, and the legend says "meres:
pond outlines schematic" in every view (§K, 2F).

**What 2F needs before any outline changes (recommendation).** A georeferenced trace of each pond from the stable
cadastre sheets of Žatčany, Měnín, Újezd, Telnice and Kobylnice (with its date), compared with the First Military
Survey and with at least one contemporary plan; the outline adopted is the cadastre's only where the sources agree the
pond was unchanged between 1805 and the survey, and otherwise stays schematic. Until then the legend says "pond
outlines schematic". Search results used: austerlitz.org (Žatčany chronicle), obeczatcany.cz, morava-napoleonska.cz,
slavkov-austerlitz.com, virtualtravel.cz (Měnín), napoleon-series.org (Satschan ponds), historyofwar.org,
geoportal.cuzk.gov.cz (cadastre metadata), chartae-antiquae.cz and cs.wikipedia (military surveys), obeckobylnice.cz and
mistopisy.cz (Kobylnice).

## J. Test plan for 2B-2F

Every threshold below is new or stricter; none is loosened. A threshold that replaces a weaker one says so.

**2B, display height, exaggeration, flags**
- **Height guard (new suite test):** `tools/stage2/height-sites.js --check` in `tools/run-all.sh`: 0 presentation sites
  call `height()` or `hAt()` (today 52), and any new call site that is not classified fails (`UNCLASSIFIED`). This is
  the check that no presentation code reads the model height where the display height is required.
- **Model unchanged:** `check:data` all 112 declarations identical; `GEOREF.EXAG` unchanged; the self-test's derived
  readings (plateau 38,700 at 04:00, both totals, 0 movement findings) unchanged at every factor.
- **Self-test, stricter (replaces "groundY equals height at the mesh vertices"):** at each of 1x, the default and
  10.33x: `groundY` equals `displayHeight` at the vertices; every man, horse and standard on the drawn ground (today's
  tolerance); every fixed and computed view, every glide and the lowest orbit above the ground; no mist where the
  ground rises through a sheet. The probe measured seating at 0.0000-0.0003 units at all five factors.
- **Relief test (new):** the drawn Pratzeberg-Sokolnitz relief equals `s` times the model relief (to 0.01 units); the
  going classes are identical at every factor (bound to the model, question L2).
- **Harness:** the 11 cases at the default factor with re-framed cameras, all Stage 0 thresholds unchanged; new cases
  `pratzen-low-1x` and `pratzen-low-10x` (the old default kept as a case) with the same thresholds.
- **Standards (new):** pole top / figure height = the provisional ratio for every block (to 0.01); seating as today.
- **Legend (new, self-test):** states the current factor and the two named symbol scales.
- **No stale exaggeration (new, self-test; decision 35):** no user-facing text (sources sheet, place-dossier relief caption,
  legend, paper-map hillshade line) states `GEOREF.EXAG` as the drawn exaggeration; each states the display factor
  relative to true scale. `geoText()`'s `{EXAG}` substitution reads the display factor; `SOURCE_NOTE` is unchanged.
- **Going classes (decision 32):** computed from the model slope at 0.88 and 1.70 true degrees; identical at every factor;
  the legend rows show the true-degree threshold and "provisional"; the sources sheet states the thresholds are unsourced.
- **True scale (decision 34):** at 1x no figure, standard, building, tree or scrub is drawn and every formation on the
  field has its footprint (frontage W0 x sw, depth D0 x sd) drawn in its side colour; counters, labels and the legend line
  stay. The footprint is one function, reused by Stage 5.
- `check:baseline` moves to 2B's build, recorded in `CHANGELOG.md`.

**Data task between 2B and 2C: the chronology** (§M.5; decisions 33 and 37). Every timing change is a traceable data
change; the suite values it moves (§M.3) are re-derived and recorded, never loosened.

**2C, movement arrows**
- **Arrow-track binding (new suite test, `binding-test.js`):** run after the chronology data task, on the corrected model:
  the arrow of phase ph is the model's movement during ph (decision 33); every `OVERLAYS` arrow has one verdict; every arrow
  marked derivable is generated from its leg and its end points equal the leg's anchors exactly; every other arrow
  carries an explicit interpretive marker; no `axis` arrow describes a halt. Mismatches left after 2C's data decisions
  are listed by name in the test as data questions, each with its `CHANGELOG.md` entry; any other mismatch fails.
- **Dashes (new static test):** dashed or segmented drawing only in the allowed drawers (`axis` arrows, plan links,
  plan staging outlines, valley and dead-ground lines); boundaries solid.
- **Draping (self-test):** every arrow, line and boundary vertex at its lift above `groundY` (to 0.05) at each factor.
- **Heads (self-test):** every Allied arrow head is the notched chevron, every French head the plain triangle.
- Harness thresholds unchanged; the overlay labels still pass the label-overlap threshold.

**2D, one DOM/SVG layer**
- **Label overlaps, stricter (replaces the Stage 0 threshold with its named residual):** 0 overlaps among map
  elements in every harness view; the Walther / Nansouty allowance removed from `thresholds.js` (done early, in the
  chronology data task, §M.11). `measure.js` reads
  the rendered boxes of the DOM layer instead of projecting sprites.
- **Nothing that matters dropped (new; decision 39):** the selection, the highlighted family and the labels of live events are
  never dropped; in each view the number of dropped labels is at most the number today's canvas pass hides in that view
  (12, 14, 10, 10, 9, 9, 7, 21, 5, 11, 10 in the harness order, §F.3); every dropped formation is reachable by hovering its
  position and from the keyboard.
- **Plates at AA, measured (new; decision 38):** counter text, badges and nation tags on plates that meet AA over both
  map backdrops and over the rendered ground of every harness view, measured by the §E method on the DOM layer; a dimmed
  counter's nation tag at full opacity, one step down, at AA.
- **Map text measurable (extends `check:contrast`):** the layer is DOM, so the contrast collector reads it: WCAG AA
  over the rendered map (the two backdrops), 12 px for battle information, 10.5 px for tertiary map text, as §E.
- **Accessibility (new, self-test):** every counter is focusable, has an accessible name (name, side, echelon,
  strength, status, grade), and can be selected from the keyboard; picking uses the drawn footprint.
- **Budget (new):** the layout pass under 8 ms at 1600 x 900 on the harness machine (§F.3; today's probe needs 84-205 ms because of its occlusion rays).
- **Unobstructed map fraction (new, §H):** not below today's value in any view at 1600 x 900 or 1280 x 720.
- **Legend:** contextual (only what is on screen), never over the dispatch (rectangle test), states the factor.
- The canvas sprite path is removed only when all of the above pass; `check:contrast` and `check:visual` must pass.

**2E, the paper map**
- **New harness cases:** `paper-north-up` (overview), `paper-close` (Sokolnitz), `paper-drawer` (dossier open),
  `paper-laptop` (1280 x 720).
- **Geometry (new):** `GEOREF.NORTH` on screen within 0.5 degrees of up; screen pixels per true kilometre equal at four
  places to 1% (today they differ by 5.2% and north is 18.4 degrees off, §G); the scale bar correct to 1%.
- **Drawn and hidden (new):** no figures, roofs, chimneys or 3D trees drawn; hillshade, contours, village footprints,
  water, woods symbology, draped arrows and compact counters drawn.
- **Controls (new):** drag pans; after zoom-to-cursor the ground point under the cursor stays within 1 px; no orbit.
- **Framing:** the battlefield frame inside the unobstructed area at the overview.

**2F, the ground surface**
- **Cover boundaries (new):** along each cover polygon's edge, the drawn cover changes within 20 m of the edge
  (today up to one 81 m triangle).
- **Draped roads and streams (new):** every vertex at its lift above `groundY` at each factor.
- **Meres:** unchanged unless a sourced outline is adopted (then its source and date in the code and the sources
  sheet); the legend says "schematic" until then.

## K. Pull-request plan for 2B-2F

| part | files touched | depends on | regression risks | its report must show |
|---|---|---|---|---|
| **2B** display height, exaggeration, flags | `world.js` (display helper, re-seating, `groundY` fallback, going classes from the model), `app.js` (52 sites, camera re-framing in `flyTo`, `startPhaseTransition`, `placeCamera`; exaggeration control; standards ratio; self-test), `shell.html`, `style.css` (the control and legend line), `tokens.js` only if a colour is needed; `tools/run-all.sh`, harness cases | Part A | every guarded preset re-framed at use (29 presets): a glide could dip below the ground at 1x (the self-test's glide check must pass at every factor); the Stage 0 darkness measures at other factors; mist fade; the going layer | the 52 → 0 guard, the relief test, the seating and camera checks at three factors, harness at the default, renders at 1x / default / 10.33x, the standards ratio, `check:data` identical |
| **data task** chronology (§M.5) | `data.js` (anchor times, the events re-dated), the engine's timing (`legWindow`, `legAt`: guarded model code), the suites' recorded values, `CHANGELOG.md` | 2B (independent of it, but after it by decision) | every reading of §M.3 moves; the harness views at 08:20-10:00 change | each change: what it was, the statement it follows, what it becomes, why; the re-derived suite values |
| **2C** movement arrows | `app.js` (draped arrow drawer from `planRibbon`, derivation from legs, heads, boundaries, halt kind, trail leftover), **`OVERLAYS`** (traceable data changes only: the halt entry; any mismatch the owner decides), a new `binding-test.js`, `tools/run-all.sh` | 2B (draping on the display height) and the chronology data task | the arrows follow the corrected model (decision 33); overlay labels move with the arrows and meet the label-overlap threshold; `check:data` will report `OVERLAYS` changed, with each change in `CHANGELOG.md` | the binding table after 2C, every `OVERLAYS` change (was, is, evidence, why), the chevron renders, the dash test |
| **2D** one DOM/SVG layer, legend | `app.js` (layer, layout, occlusion, accessibility, picking, legend), `symbols.js` (canvas counter path removed at the end), `shell.html`, `style.css`, `tools/visual/measure.js`, `thresholds.js` (residual removed), `contrast.js` | 2C (arrow labels are among its elements) | the largest change of the stage: every view's text moves; render-on-demand (the layer updates only when a frame is drawn); picking; the first-run and tour states | per view: overlaps (0), drops, leaders, pass time, node count, text sizes and contrast, unobstructed fraction; parity screenshots against the canvas path before it is removed |
| **2E** paper map | `app.js` (camera mode, pan and zoom-to-cursor written for reuse in Stage 3, what is drawn), `world.js` (flat village footprints, woods symbology, cartographic hillshade), `style.css`, harness cases | 2B (factor handling), 2C (draped arrows), 2D (compact counters) | the camera code assumes a perspective `fov` in label sizing (`pxPerWorld`, `labelRect`, `fitLabel`); 2D removes most of that; the scale bar | north bearing, scale uniformity, the new cases, the framing, what is hidden |
| **2F** ground surface | `world.js` (cover from polygons in the shader or a cover texture, draped roads and streams), possibly `assets.js` (no new asset expected) | 2B | cover classification is model (`coverClass`, guarded): the drawing changes, not the classes; performance of a cover texture; the paper map's look | the boundary test, draping, the meres note's status |

**2B, as delivered (fact; `CHANGELOG.md`, Stage 2B).** The design of §A.2 and §A.3 was built as written:
- one display height, and the ground built on the model surface then drawn at the factor, so land cover and the going
  classes cannot move with it;
- a factor change re-seats or rebuilds everything built once;
- the presets are re-framed at use;
- footprints at 1x, and standards at 1.6.

The guard went from 52 to 0. A factor change takes 186-421 ms on the harness machine, so the control is disabled during
playback. Four things were not as the plan assumed:
1. At the 4x default the lowest orbit can reach a body of men, which at 10.33x a hill usually kept away. The camera floor
   now also clears the figures inside a drawn formation's footprint. The harness case `pratzen-orbit-min` needed this to
   stay within the near-black threshold.
2. The hybrid-dimmed view needed a third declutter ring, like the second (#12). It is a stopgap until 2D.
3. The harness's orbit case chose its target on the model height, which is the drawn ground only at 10.33x; it now reads
   the display height.
4. At 1x the guarded sources text reads "exaggerated about 1 times". Rewording it is a data-task question; the sources
   sheet's new section states true scale plainly.

The paper map follows the display factor, as the owner asked for 2B. Its own hillshade factor (decision 19) is 2E's.
Renders: `docs/stage2-evidence/2b-*.jpg`.

**2C, as delivered (fact; `CHANGELOG.md`, Stage 2C).**
- The precondition (§M.13) came first, as its own commit.
- Arrows, lines, boundaries and the halt bar are flat ribbons draped on the drawn ground (`drapedRibbon`, from
  `planRibbon`'s ribbon and head). Every vertex stands at its lift above `groundY` at 1x, 4x and 10.33x (self-test,
  14,911 vertices, worst 0.0000).
- They are drawn over woods and buildings, as the plan ribbons are. The tubes were hidden by them.
- Heads: Allied heads are the notched chevron (the notch 0.38 of the head's length, inside the head), French heads the
  plain triangle. The tip stands on the last point, so a derived arrow's tip is its anchor.
- One finding about §D. The probe drew its "chevron" with `planRibbon`, whose fourth head point lies 0.38 of the head's
  length *behind* the base. That makes a kite, not a notch. The plan ribbons keep that head (decision 20). The movement
  arrows now carry the notched shape decision 20 names; it was re-rendered and measured (`2c-heads.jpg`: 37 px wide and
  a 12 px notch at the Overview, distinct in greyscale).
- Dashes come only from `dashRuns`, which only the `axis` arrows and the plan staging outlines use; the static test
  checks this.
- `computeLineDistances` was removed from the trail.

**2D, as delivered (fact; `CHANGELOG.md`, Stage 2D).** The design of §F.1 and §F.2 was built as written:
- one DOM layer, `#maplayer`, over the canvas and under the panels, holds every counter and all map text; the symbols
  (arrows and their heads, event glyphs, objective and plan markers) stay in the scene;
- one pass per drawn frame, so render on demand is unchanged (self-test);
- the priority order, the placement (anchor, eight neighbours, rings with a leader), the panels, placed items, heads, glyphs
  and markers as obstacles, and what is never dropped placed first;
- compact counters, full ones for the selection, the family, hover, focus and closer than 70 units; every map text on a
  plate; picking by footprint; keyboard focus in priority order.

The canvas path was removed only after parity screenshots from one build (`2d-parity-*.jpg`). The layer's pass takes
0.7-2.4 ms (median of five) per harness view (budget 8 ms). Seven things were not as the plan assumed:
1. **The drop limits, re-measured on the 2C build**, differ from §F.3's in 8 of the 11 views (the limits are the new
   counts). §F.3's probe read its items after the canvas pass had hidden what it hides, so its "dropped" is not the same
   count; the layer's drops are counted over the whole level-of-detail set, as the canvas pass's hidden count is.
2. **The Stage 0 harness measured some views with the panels frozen mid-slide.** Headless Chromium does not advance a CSS
   transition while the page draws nothing, and render on demand draws nothing once a view is settled. The harness now turns
   CSS transitions off, as `check:contrast` did; the baselines were re-measured that way. Only one value moved:
   selected-formation at 1280 x 720 is 6.97% free at rest, not 15.1%.
3. **The Stage 1B legend lay over the dispatch** in selected-formation (51,124 px² at 1600 x 900). The 2D legend never does:
   where it would, it stays closed.
4. **§E's contrast method needs two refinements for DOM text** (`measure.js`, `textContrast`): only pixels wholly inside a
   text's box, and the ink's 1 px anti-aliased fringe left out of the surround. Without them the 10th percentile falls on
   the fringe (3.8-4.0:1 for text measured 6.49:1 at the median on its opaque plate).
6. **selected-formation's limit is 3, not 5.** With the dossier at rest the 2C canvas pass hides 3 there; 5 was counted
   with the dossier frozen mid-slide (item 2). The limit is the at-rest count. There the layer drops two place names
   (Vinohrady, Pratzeberg), which have no room beside their markers. Two more (Litava, Křenovice) have their marker's
   anchor within 7 px of the top edge, where the 10 px marker cannot be drawn. The layer counts a place whose marker
   does not fit on the screen as off screen, not dropped. That is a definition, and it is stated here.
7. **The guided tour drew its stops without their arrows** (on 2C too; since the first build). `flyTo` replaced the
   phase change's transition, so the overlay fade stopped at 0 and the previous phase's arrows stayed drawn. A glide now
   runs on top of a transition that is already running (`glide`). Found by the self-test's tour state.
5. **Occlusion by marching the segment over `groundY`** (§F.3's recommendation) agrees with §F.3's rays on every anchor
   measured, at about a thousandth of the cost; at the 4x default no harness anchor is behind the ground.

Open for the owner: at the orbit minimum (pratzen-orbit-min) three arrow heads fill most of the view, and labels keep
clear of each head's bounding box, so the layer draws no map text there (18 dropped, within the limit of 27). Testing
against the heads' triangles would place labels, but would weaken the self-test's box test.

§F.2's "collapsed to a Key button by default in Watch" was not adopted: a Key button would be a new panel in the Watch
views, whose unobstructed fraction §J forbids to fall.

**2E, as delivered (fact; `CHANGELOG.md`, Stage 2E).** The design of §G.2 was built as written:
- an orthographic camera straight down with `GEOREF.NORTH` up; north on screen 0.00°, and px per true km at four places equal
  to 0.2% (the cos-latitude difference of true kilometres across the field, not the camera);
- the ground drawn flat through the 2B helper (`DISPLAY.flat`; the setting is kept for the landscape), with its own
  cartographic hillshade, `PAPER_HILLSHADE` = 6, chosen on renders and stated in the legend;
- flat village footprints and woods symbology, traced from the model's cover fields at `coverClass`'s thresholds;
- `MAPCAM`: drag to pan, wheel toward the cursor, keys, framing in the largest free rectangle, eased moves, written for reuse;
- one projection helper, `worldPerPx(point)`, for both cameras;
- the four harness cases, with the §J assertions.

The paper map is identical at 1x, 4x and 10.33x (self-test). A switch into it takes 111-157 ms, and back 70-92 ms.
Renders: `2e-paper.jpg`, `2e-legend.jpg`, `2e-hillshade.jpg`, `2e-sawtooth.jpg`. Five things were not as the plan assumed:
1. **The framed field is small in Study.** "Inside the unobstructed area" (§H counts the legend; §G.2 names the rail, the
   dispatch and the timebar) leaves 472 x 648 px at 1600 x 900 (17.1 px per km) and 152 x 552 px at 1280 x 720 (5.5 px per
   km). This is §H's finding again, and Stage 3's remedy.
2. **Drop limits for the new views** had no 2C view to count on. They were reproduced on the 2C build with a straight-down
   camera at each view's centre and scale, with the 2C panels moved to the 2E rectangles: 20, 2, 5, 21. With the 2C build's
   own panels the counts are 19, 3, 3, 0; the 0 is its large legend covering the whole framed field. A method choice for the
   owner.
3. **The small plan needed more room for labels.** On the paper map every label may use the far rings and rows that 2D gave
   only to what is never dropped. At 1366 x 768 with a dossier open, the selection's counter and a live event's name are
   wider than the only free strip (236 px), so what is never dropped now wraps as a last resort. Hover reaches a dropped
   formation's own position before a neighbour's box.
4. **The head-obstacle question affects the paper map**: one drop each in staff-paper, paper-close and paper-drawer.
5. **Village footprints are larger than the drawn houses.** Model cover radius about 480 m for Pratzen. The woods' cover
   ignores `WOODS.rot`. Both are guarded model code, left for 2F or a data task.

Question L1: the triangle edges of the cover classes are plain on the flat sheet, worst along the Goldbach and the Litava;
not fixed in 2E.

**2F, as delivered (fact; `CHANGELOG.md`, Stage 2F).** The plan of the 2F row was built as written, in the shader:
- the ground shader classifies every drawn point by `coverClass`'s rule, on the six cover rasters uploaded as they are and
  a local-relief grid (`COVER_ML`, `localHeight` at 0.25 world units, built coarse to fine, bicubic between nodes); the
  classes, `coverClass`, `buildCover`, `covAt`, the rasters and the going layer are unchanged;
- the colour of each point is the palette's colour of its class, with the elevation tint, the field pattern and the
  occlusion per point instead of per triangle; the palette colours are unchanged;
- the woods' trees and edge scrub stand inside the drawn wood class, and the paper map's woods are traced from it;
- roads and streams are draped on `groundY`, 0.5 units apart, at every factor and on the flat paper map;
- the meres are unchanged; the legend says their outlines are schematic.

The cover boundary error (§J, "today up to one 81 m triangle") fell from 52-156 m per class on the landscape and 53-810 m on
the paper map to 7.2 m (meadow) and 3.9 m (every other class), measured on the render at 1x, 4x, 10.33x and on the paper map.
Renders: `2f-sawtooth.jpg`, `2f-woods.jpg`. Four things were not as the plan assumed:
1. **The cover polygons of meadow, marsh and stream water are contours of the local relief**, not polygons in the data. On a
   flat valley floor a small error in the relief moves them far, so the relief interpolated from the 81 m vertices (234 m out)
   or from a 0.5 grid (44 m) was not enough. The 0.25 grid costs about 0.45 s at start-up on the harness machine.
2. **The paper map's village footprints are the cover disc** (owner decision on 2E), and 3.25 km² of them is classed water or
   marsh. Against the class polygon the footprint's edge is 810 m out; the paper-map test measures it against the disc, as
   decided, and the ground under it against the classes.
3. **"No known sawtooth" needed more than the classes.** The field pattern, the elevation tint and the occlusion were per
   triangle too, and made the paper map's mosaic; they are per point now.
4. **Draping needed a finer ribbon than one vertex per unit**: at 1 unit 30 ribbon edges still cut under the ground at
   10.33x; at 0.5 none do. The test checks the edge midpoints as well as the vertices.

## L. The owner's answers (decisions 31-39)

The nine questions of the first draft are decided; the recommendations they answered are kept in the history of this
file. In short (full wording in §0):

1. **Order of 2E and 2F** (decision 31): 2E stays before 2F.
2. **Going thresholds** (decision 32): computed from the model slope at 0.88 and 1.70 true degrees in 2B; shown as
   "provisional" with their true-degree thresholds; stated as unsourced in the sources sheet; a data task is open.
3. **Which leg an arrow shows** (decision 33): not decided as posed; the model's timing is to agree with the app's timed
   statements, and the arrow of phase ph shows the model's movement during ph. §M is the audit; the rule for 2C follows
   the data task after it.
4. **True scale** (decision 34): option (b), footprints, as one primitive reusable in Stage 5.
5. **Default factor** (decision 35): 4x; every user-facing statement of exaggeration reads the display factor.
6. **Standard ratio** (decision 36): 1.6, provisional.
7. **Mismatched arrows** (decision 37): no blanket tolerance; each resolved on its own after §M (§C.1 lists what each
   one's endpoints correspond to).
8. **Compact counter** (decision 38): as proposed, plus the status icon; plates measured at AA; dimmed nation tags at
   full opacity, one step down.
9. **Drops** (decision 39): accepted with conditions (no more than today's hidden labels per view; never the selection,
   the highlighted family or live events; reachable by hover and keyboard); §H feeds Stage 3.

**Still open:** the three disagreeing texts, left unresolved by the chronology data task because the sources could not be
read (§M.9), and the other source questions of §M.6. **Before 2C:** the arrivals derived from the march-rate ceiling (§M.13).

## M. The chronology audit (owner decision 33; report only, no data change)

**Question.** The engine completes every move by the start of its anchor's phase (`legWindow`, `app.js:1254-1258`: a leg
runs from the previous anchor's phase start, or `moveMin` before, to `PHASES[b.ph].t0`). The anchors' act and status
text, the phase timelines and the events are shown during that phase and read as what happens during it. Does the
app's own chronology agree with the engine?

**Method (fact; `node tools/stage2/chronology.js`, `--md` writes the full table to `docs/stage2-evidence/chronology.md`).**
Every anchor with a position after the first (148 moves across 31 formations; 4 status-only entries and 1 removal are not
moves) is compared with every timed statement about its formation in the app's own data: phase timelines and ledes,
`EVENTS` (by their `forms` and by name), the anchors' act and objective text, formation notes, analysis chapters (text and
the clock each chapter sets), tour stops (text and clock), features, the command-knowledge text and comments in `data.js`:
102 timed statements. A statement is first attached to the anchor whose phase contains its time; each attachment was then
**reviewed by hand** against the anchor's act, and the verdict recorded with its evidence in the script's `REVIEW` table
(so the classification can be re-checked line by line). A verdict needs a timed statement about *this* move; falling
in the same phase is not enough. **consistent**: the text's time lies in the engine's window (plus or minus 15 min);
**early**: the engine arrives before the text says the move happens (size = the text's time minus the engine's, the start
or the arrival, whichever the text gives); **late**: the reverse; **undetermined**: no timed statement about the move. Moves
under 250 m are "minor"; phase-9 positions are "nightfall" (reached at 17:00, after dark by definition). A **creep** flag
marks moves the engine spreads over hours from 04:00 although the text starts them later.

### M.1 Results (fact)

| | consistent | early | late | undetermined | minor | nightfall | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| French | 20 | 13 | 0 | 26 | 3 | 16 | 78 |
| Allied | 28 | 9 | 0 | 23 | 1 | 9 | 70 |
| **all** | **48** | **22** | **0** | **49** | **4** | **25** | **148** |

By phase: phase 1: 4 consistent, 2 early; 2: 7 / 1 (5 undetermined); 3: 2 / 4; 4: 2 / 3; 5: 9 / 0; 6: 9 / 3; 7: 7 / 5; 8: 6 / 4.
Of the 70 moves with a timed statement, **22 are early (31%) and none is late**. Sizes: 15 min (3), 30 (6), 45 (5), 60 (3),
75 (4), 120 (1); median 45 min. In addition 9 moves creep (Caffarelli, Suchet, Kellermann, Nansouty and d'Hautpoul to
phase 5, Rivaud to phase 3, the Allied headquarters to phase 3, Bagration to phase 5, the Russian Guard cavalry to phase 6),
and 9 undetermined moves have an act that describes the move as happening during its phase (the crossings of the Goldbach,
Levasseur's march, Bourcier's pursuit, the grenadiers moving up, the Allied headquarters falling back, Buxhowden's escape,
Kienmayer holding, Rottermund's retreat).

**The early moves** (engine window → the text's time; evidence):

| move | engine | text | early by | evidence |
|---|---|---|---:|---|
| Friant, Raigern → the Goldbach (ph1) | 04:00-07:00 | c. 08:00 (07:45-08:15) | 60 | `data.js:64`, `analysis.js:251` |
| Dokhturov descends (ph1) | 04:00-07:00 | begins c. 07:30 | 30 | `data.js:63` (but the event 04:00-07:00, `analysis.js:236`, agrees with the engine) |
| Friant retakes Telnitz (ph2) | 07:00-08:00 | c. 08:30 | 30 | `data.js:71`, `analysis.js:259` |
| Saint-Hilaire climbs (ph3) | 08:00-08:45 | 08:45, village 09:00 | 45 | `data.js:78-79`, `analysis.js:267`, `271`, `31`, `353` |
| Vandamme climbs (ph3) | 08:00-08:45 | 08:45 | 45 | as above |
| Rivaud follows Soult (ph3) | 04:00-08:45 | after 08:45 | 15+ | act, `data.js:78` |
| Kamensky turns about (ph3) | 08:00-08:45 | c. 09:45 | 60 | `data.js:87`, `analysis.js:279` (the act itself puts it in phase 3) |
| Kamensky drives the 10e Légère off (ph4) | 08:45-09:30 | c. 09:45 | 15 | `data.js:87` |
| Kollowrat: Jurczek attacks the summit (ph4) | 08:45-09:30 | c. 10:15 | 45 | `data.js:88` |
| Langeron's reinforcements (ph4) | 08:00-09:30 | c. 10:30 | 60 | `data.js:89`, `analysis.js:283` |
| Napoleon to Stare Vinohrady (ph6) | 10:35-11:15 | c. 12:00 | 45 | `data.js:105`, `analysis.js:303` |
| Rapp's counter-charge (ph6) | 10:30-11:15 | c. 11:45 | 30 | `data.js:104` (but the event window starts 11:15, `analysis.js:299`) |
| Bagration falls back (ph6) | 10:30-11:15 | begins c. 11:15 | 45 | `data.js:97` |
| Saint-Hilaire, Vandamme, the Guard infantry, the grenadiers wheel south (ph7) | 11:15-12:45 | 13:00-14:00 | 75 each | `data.js:113`, `analysis.js:315`, `51` |
| Legrand presses east "as the trap closes" (ph7) | 09:30-12:45 | 13:00-14:00 | 15+ | act, `data.js:113` |
| Legrand retakes Telnitz for good (ph8) | 12:45-14:30 | until 15:00 | 30 | `data.js:640` |
| Kienmayer and Dokhturov fall back over the meres under fire (ph8) | 12:45-14:30 | 14:30-15:00 | 30 each | `data.js:120-121`, `analysis.js:327` |
| Bagration withdraws on Rausnitz (ph8) | 12:45-14:30 | c. 16:30 | 120 | `data.js:122` |

**The owner's two cases (verified).** Saint-Hilaire: the phase-3 anchor `[267,275]` ("Climbs the western slope") is
reached at 08:45, moving 08:00-08:45; the event `soult` is at t 525 (08:45) and `pratzen-village` at t 540 (09:00):
**confirmed**, early by 45 min. The Guard cavalry: the phase-6 anchor (moveMin 45) moves 10:30-11:15; phase 6's timeline
says "c. 11:45 Bessieres and Rapp counter-charge" (`data.js:104`): **confirmed**, early by 30 min. **One correction:** the
item at t 680 (11:20) is the *analysis chapter* "guard" (its clock, `analysis.js:38`), not an event; the event is
`guard-broken`, window 11:15-13:15 (`analysis.js:299`), which starts exactly when the engine arrives. So the app's own
statements disagree about this one: the timeline says 11:45, the event's window allows 11:15.

### M.2 The pattern (derived)

**Mixed, with one clear rule inside it.** A phase begins at a moment the narrative dates: an attack on a village (07:00
Telnitz, 08:00 Sokolnitz), Soult's advance (08:45), the fall of Blasowitz (11:15), the height above Augezd (14:30). Moves
that *prepare* that moment (formations in place when it happens) agree with the engine: 27 of the 48 consistent moves
have their text time at the start of the anchor's phase. Moves that *are* the phase's action (a climb, a charge, a wheel, a
retreat under fire) are early: the phase start is when they begin, and the engine has them finished. None is late. So:
- **Your reading holds for 22 moves**, whose acts and the timelines describe the move as happening during its phase.
- **The phase-start rule was nevertheless used deliberately** and the data was fitted to it in places: the correction
  pass named anchors by the clock at which they are reached ("the Allied HQ at 09:30, Kamensky at 11:15", `CHANGELOG.md:634`);
  Przybyszewski's phase-8 timing is written for it (`data.js:496`); and several **event markers were placed where the
  engine puts the formation**: `soult` (08:45, "climb the slope") has its marker at `[262,262]` on the slope's crest, where
  the engine has Saint-Hilaire at 08:45, not at the foot where the text starts the climb. The sim-test's event-agreement
  check (1 km) then binds that. Nowhere is it documented that an act text summarises the whole phase or that an anchor
  means "in place at the phase's start"; the code comment says only "track keys are phase ids; values carry forward until
  changed" (`data.js:135`).
- **The texts themselves disagree in three places** (source questions, below): Dokhturov's descent (timeline 07:30,
  event 04:00-07:00); Rapp's charge (timeline 11:45, event from 11:15); Kamensky's turn (act in phase 3, timeline 09:45).

### M.3 Derived readings that move with the timing (fact; `node tools/stage2/chronology-sim.js`)

The simulation reloads the model as the suites do and replaces only the leg timing; its generic engine reproduces today's
positions exactly (difference 0.000000 map units) before any variant is applied. Variants: **(a-end)** every anchor reached
at the end of its phase; **(a-mid)** half-way through it; **(b-shift)** today's rule with each of the 22 early moves moved
later by its measured offset, later legs pushed back keeping their durations (a sketch of remedy (b)).

| reading (who checks it) | today | (a-end) | (a-mid) | (b-shift) |
|---|---|---|---|---|
| march-rate audit: legs over their arm's ceiling (`audit.js`, `selfTest` "movement audit", `redteam.js`) | 0 | 1 (Friant's march, 5.2 km/h) | 10 (fastest 14.8 km/h) | 0 |
| event agreement: events with no named formation within 1 km (`sim-test.js`) | 0 (worst 0.82 km) | 5 (telnitz, soult, pratzen-village, hq-forward, augezd) | 3 | 2 (soult, pratzen-village) |
| plateau, Allied / French at 08:45 (`sim-test.js` series, situation line) | 23,550 / 13,300 | 19,300 / 0 | 19,300 / 0 | 19,300 / 0 |
| plateau at 12:00 | 4,250 / 37,500 | 18,150 / 13,300 | 23,780 / 31,500 | 13,350 / 37,500 |
| plateau at 14:00 | 0 / 18,500 | 13,350 / 37,500 | 9,100 / 30,900 | 0 / 30,900 |
| tour stop 4 figures, 38,700 at dawn and the low before 08:45 (`sim-test.js`; quoted in the tour text) | 38,700 / 19,300 | 38,700 / 19,300 | 38,700 / 19,300 | 38,700 / 19,300 |
| plateau at 04:00 (`selfTest` "derived readings unchanged") | 38,700 | 38,700 | 38,700 | 38,700 |
| centre separation first reported (situation line, `sim-test.js` "not cut before the battle") | **08:26** | 09:16 | 09:01 | 09:10 |
| "the centre empties before Soult attacks" / "the French hold the plateau at 11:00" (`sim-test.js`) | yes / yes | yes / yes | yes / yes | yes / yes |
| Command view (`knowledgeOf`): enemy formations seen / uncertain / unknown at each phase's midpoint; phases whose counts change | French eyes 3/3/6 4/4/4 5/3/5 6/2/5 5/2/6 2/2/9 4/0/9 9/0/4 7/0/6 4/0/8; Allied eyes 2/0/16 1/0/17 3/1/14 5/1/12 3/2/13 3/2/13 8/1/9 9/1/9 9/1/9 9/1/9 | French 9 of 10, Allied 6 | French 7, Allied 5 | French 4 (phases 2, 5, 7, 8), Allied 1 (phase 7) |
| formations moved at the harness clocks (08:20-10:00), largest / mean | 0 | 3,529 m / 941 m | 3,529 m / 714 m | 1,561 m / 140 m |
| events naming a formation not yet on the field (`redteam.js`) | none | none | none | none |

Two readings deserve a note. **Centre separation is reported at 08:26 today**, 19 minutes before the texts have Soult's
divisions start to climb: a symptom of the early engine, visible on the situation line. And at 08:45 today the plateau
already holds 13,300 French, when the texts say that is the moment they begin the climb. Everything else that reads
`posAtClock` moves with the timing too: the counters and blocks, the movement trail, headings and formations' facing,
the dossier's "moving at ... km/h" line, the plateau ring, the arrow binding (§C.1) and every harness screenshot at the
clocks above. `selfTest` would fail its "movement audit" check under (a-mid) and (a-end); `sim-test.js` would fail its
event-agreement check under every variant until the events named are re-dated or re-placed.

### M.4 Remedies and their consequences (derived)

| | what changes | what it does to the 27 moves written for the phase-start rule | other consequences |
|---|---|---|---|
| **(a) change the rule globally** (an anchor is reached at its phase's end, or during it) | `legWindow` and `legAt` (guarded model code) | breaks them: pre-positioning for an action that opens a phase would arrive after the action (Kienmayer reaches Telnitz at 08:00 for a 07:00 attack; event `telnitz` fails at 2.81 km); the phase-9 positions arrive at 18:00 | compresses long marches into one phase (10 legs over their ceilings at "mid"); 5 events fail (at "end"); the creeping moves stay; the 22 early moves become roughly right, but by rule, not by evidence |
| **(b) keep the rule, give individual anchors explicit timing** from the app's own timed statements (an arrival or departure time; `moveMin` alone cannot express an arrival *after* the phase start) | a small engine extension (optional per-anchor times honoured by `legWindow`; guarded, so part of the data task) and 22 + 9 anchors | leaves them untouched | the sketch keeps the march-rate audit clean; 2 events whose markers were fitted to the early timing (`soult`, `pratzen-village`) need their window or marker re-dated; centre separation moves from 08:26 to about 09:10; the event-agreement results, the centre-separation time and the `sim-test.js` series change and must be re-derived, not loosened |
| **(c) a combination**: (b), plus a documented default rule (an anchor is in place at its phase's start unless it carries its own time), plus the three disagreeing texts settled first | as (b) plus a comment and a `CHANGELOG.md` record of the rule | leaves them untouched and makes the rule they rely on explicit | as (b); the 49 undetermined moves keep today's timing and are listed, not guessed |

### M.5 Recommendation

**(c).** Document the phase-start rule as the default, since 27 moves and several events were fitted to it deliberately;
add optional explicit times to anchors; and in a separate data task before 2C, never inside 2B:
1. settle the three disagreeing texts (Dokhturov's descent, Rapp's charge, Kamensky's turn) against the literature, or
   record them as disputed;
2. give the 22 early moves explicit times from the app's own statements, each a traceable data change (what it was, the
   statement it follows, what it becomes, why);
3. give the 9 creeping moves a departure time where a text dates the start (Lannes's advance c. 09:30, the emperors
   joining the column c. 08:30-09:00), otherwise leave them and list them;
4. re-date the events whose markers were fitted to the early timing (`soult` as a window over the climb; `pratzen-village`),
   as data changes;
5. re-derive, not loosen, every suite value that moves (the event agreement, the centre-separation time, the series in
   `sim-test.js`, the knowledge counts), and record the new values.
The 49 undetermined moves keep today's timing; their act texts are not evidence of timing on their own. Then decision 33's
target holds: the arrow shown during phase ph is the movement the model makes during phase ph, and 2C derives it.

### M.6 Source questions (the app's text against the literature; not resolved here)

The 22 early verdicts rest on the app's own statements, and almost none of them cites a source: of the timeline entries
used, none carries a citation; the Allied headquarters' 08:45 cites the *Russian Biographical Dictionary* (1903,
`data.js:412`); Friant's march cites "sources vary" (`data.js:64`). Before the data task adopts any of these times:
- the three internal disagreements above;
- "after 11:00 ... the hour is not established" for the Russian Guard's attack (`data.js:103`), which bounds Vandamme's,
  Drouet's and both Guards' phase-6 moves from one side only;
- Bagration's withdrawal "c. 16:30" (`data.js:122`), dated by the end of organised resistance rather than by his own
  movement;
- the wheel "13:00-14:00" (`data.js:113`, `analysis.js:51`), on which five early verdicts rest;
- the Pratzeberg "firmly in French hands" at 11:00 (`analysis.js:287`) and the Telnitz fighting "between 07:00 and 15:00"
  (`data.js:640`).

### M.7 Owner decisions 40-46 (the chronology data task)

The owner reviewed §M and accepted remedy (c): the phase-start rule stays the documented default and individual anchors
get explicit times. The framing that every early move was an error was partly wrong (the rule was deliberate), and so was
the "guard" detail (t 680 is an analysis chapter). The task makes the model agree with the app's own dated statements; most
of them cite no source (§M.6), so the result is **internal consistency, not verified history**, and every change says which.

| # | decision |
|---|---|
| 40 | **The rule.** The phase-start rule stays the default and is documented in the code at `FORMATIONS` and `legWindow`: an anchor is reached at its phase's start unless it carries an explicit time. The smallest engine extension expresses an arrival after the phase start, and a departure time where a text dates the start of a move. Validated: departure before arrival, no overlap with the next leg, inside the day. Anchors without a time behave exactly as before. |
| 41 | **Evidence and grade on every explicit time**: its evidence (the statement with file and line, or a source with page); a timing grade using the grades the dossier already shows; a basis, "source" or "app narrative, unsourced". The dossier shows the grade as it does today. No time without evidence; where evidence gives a range, the range is used, not its midpoint. |
| 42 | **The three disagreeing texts** (Dokhturov's descent, Rapp's charge, Kamensky's turn) are settled against sources (those the project cites, Duffy 1977 and Smith 1998, and any others in the Sources panel), not by choosing one of the app's texts. Where the sources agree, their time is used and the disagreeing text corrected; where they disagree, the anchor gets an interval spanning them and the disagreement goes into the Sources panel's open questions; where a source cannot be read (network policy), that is said, the conflict is left unresolved with today's behaviour, and listed. No web summaries or AI output as a source. |
| 43 | **The 22 early moves** get explicit times from the statements §M cites, under decision 41; each reported: was, is, evidence, grade, basis. |
| 44 | **Events.** `soult` and `pratzen-village` are re-dated; an event that describes a process becomes an interval (as `guard-broken`); a marker placed where the engine put the formation moves with the corrected track (old and new position and time stated). The sim-test event check keeps its 1 km rule; its expected values change with this task and are recorded; the rule is not loosened. |
| 45 | **Creeping moves.** Where a text dates the start, a departure time; otherwise nothing is invented, today's behaviour stays, and while the formation is between anchors the dossier shows the existing "interpolated" marker. The undated ones are listed. |
| 46 | **The interface during a delayed move** reads coherently: the dossier's "Doing now", status and counter while a formation is still at its old position inside its phase; the Study view at the phase start; the Watch view during the move; the arrow of that phase. Presentation is fixed only where inconsistent. §C records the rule this makes natural for 2C (the arrow shown during phase ph depicts the leg the model executes during phase ph); the binding report is re-run on the new tracks and §C's tables replaced, the old ones kept as a dated appendix. |

Also: every derived value that moves is re-derived and reported (old, new); no threshold is loosened; narrative text that
states a derived time or figure is corrected or flagged; the march-rate ceiling holds on every leg; `check:data` reports
only the declarations this task changes; no `OVERLAYS`, strength, order-of-battle or geography change.

### M.8 The engine and the explicit times (decisions 40, 41, 43)

**The engine (fact; `app.js`, the comment above `anchorList`).** A track entry may carry `tm`: `tm.at` (the anchor is
reached then, possibly after its phase opens) and `tm.dep` (the move into it begins then), in minutes of the day, plus
`gr` (A/B/C), `basis`, `ev` (the quoted statements) and `note`. `anchorList` resolves each anchor's window once, `w =
[departure, arrival]`, and its arrival `arr`; `legWindow` returns it; `legAt` passes an anchor when it is *reached* (`arr`),
not when its phase opens. Rules, in order:
- no `tm`: exactly as before (reached at `PHASES[ph].t0`; departs at the previous arrival, or `moveMin` before);
- a range is honoured at its far end: `dep:[lo,hi]` departs at lo, `at:[lo,hi]` arrives at hi, so a ranged move is shown in
  motion across the whole range; no midpoint is taken (none of the times written in this task is a range: where a text gives
  one, e.g. the wheel "between about 13:00 and 14:00", it is written as `dep` 13:00 and `at` 14:00);
- a departure at or after the phase start with no arrival: reached after `moveMin`, or once the leg has been marched at its
  arm's ceiling (`SPEED_CEIL`), whichever is later, rounded up to the minute (`arrDerived`). This is **derived**, not a time
  from a text: the least delay that the dated departure and the ceiling allow. The dossier says so.
`auditMovement` validates every explicit time (departure before arrival; not before the previous anchor is reached; arriving
no later than the next leg departs and the next anchor is reached; inside the day; never on a first or removal entry);
`redteam.js` proves each of the five rules rejects a bad case and that a valid delayed move holds, then moves. The refactor
was checked to reproduce the Stage 1B timing exactly before any time was written (`chronology-sim.js`: every reading
identical).

**Timing grades** (the dossier's A/B/C, applied to time): **A** dated in a cited source; **B** given as approximate ("c.")
in the app's narrative, which cites no source for it; **C** inferred from the narrative (a bound, a sequence, or a range
applied to this move). Every time written here has basis "app narrative, unsourced", so none is A.

**Every anchor changed, and the 22 early moves** (was = the Stage 1B engine window; evidence file:line resolved by
`chronology.js --times` on this build; verdict computed by the audit):

| anchor | was (engine window) | §M verdict | is (window) | explicit time | grade | basis | evidence (file:line) | verdict now |
|---|---|---|---|---|---|---|---|---|
| gqg@6 | 10:35-11:15 | early 45 | 12:00-12:40 (arrival derived) | dep 12:00 | B | app narrative, unsourced | data.js:105; data.js:646 | consistent |
| sthilaire@3 | 08:00-08:45 | early 45 | 08:45-09:15 (arrival derived) | dep 08:45 | B | app narrative, unsourced | data.js:78; analysis.js:31; data.js:79 | consistent |
| sthilaire@7 | 11:15-12:45 | early 75 | 13:00-14:00 | dep 13:00, at 14:00 | B | app narrative, unsourced | analysis.js:51; data.js:113 | consistent |
| vandamme@3 | 08:00-08:45 | early 45 | 08:45-09:14 (arrival derived) | dep 08:45 | B | app narrative, unsourced | data.js:78; analysis.js:31 | consistent |
| vandamme@7 | 11:15-12:45 | early 75 | 13:00-13:15 (arrival derived) | dep 13:00 | B | app narrative, unsourced | analysis.js:51; data.js:113 | consistent |
| legrand@7 | 09:30-12:45 | early 15 | 13:00-14:00 | dep 13:00, at 14:00 | C | app narrative, unsourced | data.js:229; analysis.js:51 | consistent |
| legrand@8 | 12:45-14:30 | early 30 | 14:00-15:00 | at 15:00 | C | app narrative, unsourced | data.js:665; data.js:231 | consistent |
| friant@1 | 04:00-07:00 | early 60 | 04:00-07:00 | none | - | - | - | undetermined |
| friant@2 | 07:00-08:00 | early 30 | 07:00-08:30 | at 08:30 | C | app narrative, unsourced | data.js:71; data.js:64 | consistent |
| caffarelli@5 | 04:00-10:30 | consistent | 09:30-10:30 | dep 09:30 | B | app narrative, unsourced | data.js:86 | consistent |
| suchet@5 | 04:00-10:30 | consistent | 09:30-10:30 | dep 09:30 | B | app narrative, unsourced | data.js:86 | consistent |
| rivaud@3 | 04:00-08:45 | early 15 | 08:45-09:09 (arrival derived) | dep 08:45 | C | app narrative, unsourced | data.js:365; data.js:78 | consistent |
| guard_inf@7 | 11:15-12:45 | early 75 | 13:00-14:00 | dep 13:00, at 14:00 | B | app narrative, unsourced | analysis.js:51; data.js:113 | consistent |
| guard_cav@6 | 10:30-11:15 | early 30 | 10:30-11:15 | none | - | - | - | early (unresolved conflict) |
| c_gren@7 | 11:15-12:45 | early 75 | 13:00-14:00 | dep 13:00, at 14:00 | B | app narrative, unsourced | analysis.js:51; data.js:113 | consistent |
| kienmayer@8 | 12:45-14:30 | early 30 | 14:30-15:00 | dep 14:30, at 15:00 | C | app narrative, unsourced | data.js:120; data.js:121 | consistent |
| dok@1 | 04:00-07:00 | early 30 | 04:00-07:00 | none | - | - | - | early (unresolved conflict) |
| dok@8 | 12:45-14:30 | early 30 | 14:30-15:00 | dep 14:30, at 15:00 | C | app narrative, unsourced | data.js:120; data.js:121 | consistent |
| lang@4 | 08:00-09:30 | early 60 | 08:00-10:30 | at 10:30 | C | app narrative, unsourced | data.js:89 | consistent |
| kamensky@3 | 08:00-08:45 | early 60 | 08:00-08:45 | none | - | - | - | early (unresolved conflict) |
| kamensky@4 | 08:45-09:30 | early 15 | 08:45-09:30 | none | - | - | - | early (unresolved conflict) |
| kollo@4 | 08:45-09:30 | early 45 | 08:45-10:15 | at 10:15 | B | app narrative, unsourced | data.js:88 | consistent |
| bag@5 | 04:00-10:30 | consistent | 09:30-10:30 | dep 09:30 | B | app narrative, unsourced | data.js:86 | consistent |
| bag@6 | 10:30-11:15 | early 45 | 11:15-11:25 (arrival derived) | dep 11:15 | B | app narrative, unsourced | data.js:97 | consistent |
| bag@8 | 12:45-14:30 | early 120 | 16:30-16:45 (arrival derived) | dep 16:30 | C | app narrative, unsourced | data.js:122 | consistent |

**Anchors whose window moved only as a consequence** (the leg after a delayed anchor departs when it is reached; no time
written): `gqg@7` 11:15-12:45 → 12:40-12:45; `sthilaire@4` 08:45-09:30 → 09:15-09:30; `sthilaire@8` 12:45-14:30 → 14:00-14:30;
`vandamme@4` 08:45-09:30 → 09:14-09:30; `vandamme@8` 12:45-14:30 → 13:15-14:30; `legrand@9` 14:30-17:00 → 15:00-17:00;
`friant@3` 08:00-08:45 → 08:30-08:45; `rivaud@6` 08:45-11:15 → 09:09-11:15; `guard_inf@9` 12:45-17:00 → 14:00-17:00;
`c_gren@8` 12:45-14:30 → 14:00-14:30; `kienmayer@9` and `dok@9` 14:30-17:00 → 15:00-17:00; `lang@7` 09:30-12:45 →
10:30-12:45; `kollo@5` 09:30-10:30 → 10:15-10:30; `bag@7` 11:15-12:45 → 11:25-12:45; `bag@9` 14:30-17:00 → 16:45-17:00.
None changes verdict.

**How each was read (inference, stated in each `tm.note`).** The climb (Saint-Hilaire, Vandamme): the texts date its start,
c. 08:45; Pratzen village is passed c. 09:00 but the end of the climb is not dated, and 2.5 km at the infantry ceiling takes
30 minutes, so the arrival is derived (09:15, 09:14). Rivaud "follows Soult": it cannot start before Soult. Napoleon: "moves
forward ... c. 12:00" and the Zuran "vacated about noon" date a departure; the existing 40-minute march gives 12:40. The wheel
is a range, used whole for Saint-Hilaire, the Guard infantry, the grenadiers and Legrand ("as the trap closes"); **not for
Vandamme**: his next anchor, the height above Augezd c. 14:30, is 3.3 km on (40 minutes at the ceiling), so an arrival at
14:00 would break the ceiling; he gets the start, 13:00, and a derived arrival (13:15). Legrand retakes Telnitz "for good":
Telnitz changed hands until about 15:00. Friant's phase-2 anchor is the position behind the stream *after* Telnitz is retaken
c. 08:30. Jurczek's attack on the summit, c. 10:15, is Kollowrat's arrival; Langeron's reinforcements, c. 10:30, his (the event
it rests on is itself graded a reconstruction, so C). Bagration begins falling back c. 11:15 (derived arrival 11:25) and
withdraws on Rausnitz c. 16:30, a time that dates the end of organised resistance, not his own move (§M.6), hence C. Kienmayer
and Dokhturov fall back "under fire": not before the causeway is under fire, c. 14:30, and over the neck before the ice is
fired on, c. 15:00.

**Friant's phase-1 anchor, re-reviewed (a correction to §M).** §M counted `friant@1` early by 60, matching "the leading
brigade reaches the Goldbach c. 08:00" to it. That statement dates the arrival *at the Goldbach*, which is the leg into
`friant@2` (the `davout` event's marker is that anchor), not this waypoint 1.4 km short of the stream; the waypoint's own
march from Raigern is undated. So `friant@1` gets no time and is **undetermined** (its act, "Marching from Raigern toward
Telnitz", is shown while the leg 1→2 is in motion, 07:00-08:30). §M's count of 22 early moves is therefore 21 on this reading.

**The audit's rule, made explicit (a correction to §M's prose).** §M's verdicts were made by hand; the audit now records,
for each reviewed statement, *what it dates* for that move (its start, the arrival, an action during the move, or the
whole move as a span) and computes the verdict against the live engine window, so re-running it re-derives every verdict.
The tolerance that reproduces §M's table is **a difference of 15 minutes or more counts** (§M's prose said "plus or minus
15", but its table counts three 15-minute cases as early). On the Stage 1B data the computed verdicts reproduce §M's
exactly, except `friant@1` (above); two sizes differ because the statement's kind is now explicit: `rivaud@3` (the start:
285 minutes, not "at least 15") and `vandamme@7` (the start: 105, not 75).

### M.9 The three disagreeing texts (decision 42): not settled; the sources could not be read

The project cites Duffy (1977) and Smith (1998); the Sources panel names no other source for these hours. Neither book is
in the repository, and this environment's network policy blocked every host tried (archive.org: HTTP 403 from the proxy;
Google Books, HathiTrust, Open Library, Gallica, Wikipedia: no connection). No web summary or AI output was used. So, under
decision 42, **all three conflicts are left unresolved, with today's timing**, and listed:

| conflict | the app's texts | kept (today's behaviour) | listed in |
|---|---|---|---|
| Dokhturov's descent | phase 1 timeline "c. 07:30 Dokhturov's I Column begins descending" (`data.js:63`) against the event "columns begin to leave the plateau", 04:00-07:00 (`analysis.js:236`) | `dok@1` reached 07:00, moving from 04:00 (early 30 on the timeline's reading) | the Sources panel's open questions (`SOURCE_NOTE`, new sentence); `chronology.js` CONFLICTS |
| Kamensky's turn | phase 4 timeline "c. 09:45 Kamensky turns his brigade about and drives the 10e Legere off the crest" (`data.js:87`) and the event at 09:45 (`analysis.js:279`), against his own act in phase 3, 08:45-09:30 (`data.js:500`) | `kamensky@3` reached 08:45 and `kamensky@4` 09:30 (early 60 and 15); `kamensky@4` is dated by the same timeline entry, so it stays with the conflict | as above |
| Rapp's counter-charge | phase 6 timeline "c. 11:45 Bessieres and Rapp counter-charge" (`data.js:104`) against the event `guard-broken`, 11:15-13:15 (`analysis.js:299`) | `guard_cav@6` reached 11:15 (early 30) | as above |

The regression allows exactly these four anchors, by name, to remain early (`chronology.js --check`).

**What would settle each, from page scans** (only works the project already cites; no page numbers are given, because
none could be checked; the same sentence is in the Sources panel's open questions):

| conflict | source | passage |
|---|---|---|
| Dokhturov's descent | Duffy, *Austerlitz 1805* (1977) | his account of the Allied left columns (Kienmayer's advance guard and the I Column) coming down off the plateau toward Telnitz: when the I Column moved off, and when it reached the valley |
| Kamensky's turn | Duffy (1977); Thiebault's memoirs (the Sources panel: "Narrative of the fight for the Pratzeberg follows accounts drawing on Thiebault's memoirs and Duffy") | the counter-attack of Kamensky's brigade on the Pratzeberg: when the brigade turned about, relative to Soult's advance (c. 08:45) and to the 10e Légère reaching the crest |
| Rapp's counter-charge | Duffy (1977) | the Guard cavalry fight at Stare Vinohrady: the hour of the Russian Guard's attack on Vandamme and of Bessières's and Rapp's counter-charge |

Smith, *The Napoleonic Wars Data Book* (1998), is cited for strengths; whether its Austerlitz entry dates any of these moves
is not known, and it is not listed as settling them. The Russian Biographical Dictionary (1903), cited for the Tsar's
arrival at the 4th Column, is not known to date these moves either.

### M.10 Creeping moves (decision 45)

Dated start, given a departure: **Caffarelli and Suchet** (phase 5, c. 09:30, "Lannes advances along the highway"),
**Bagration** (phase 5, c. 09:30, "Bagration counter-attacks"), **Rivaud** (phase 3, after Soult's advance c. 08:45; §M.8).
Each now holds until then and moves 09:30-10:30 (Rivaud 08:45-09:09). **Undated, kept as they are and listed:** Kellermann,
Nansouty and d'Hautpoul to phase 5 (the texts date the cavalry collision, c. 10:40, not the start of their move); the Allied
headquarters to phase 3 (the emperors "join the column about 08:30-09:00"; its departure from Krzenowitz is not dated); the
Russian Guard cavalry to phase 6 (its attack is "after 11:00"; its start is not dated). Between anchors their dossiers show
"interpolated", as before: **confirmed in the built page** (on #12's follow-up) for all five, at three clocks each inside
their creeping legs (Kellermann, Nansouty, d'Hautpoul at 05:00, 07:00, 10:00; the headquarters at 05:00, 08:00, 08:40; the
Guard cavalry at 05:00, 08:20, 11:00), in both the compact card and the full dossier. No change was needed.

### M.11 Events and the interface (decisions 44, 46)

**Events** (fact; nearest named formation by `sim-test.js`'s rule):

| event | was | is | marker | agreement on the new tracks |
|---|---|---|---|---|
| `soult` "Saint-Hilaire and Vandamme climb the slope" | t 525 (08:45) | **t [525, 555]** (08:45-09:15: the climb, a process; its end is the derived arrival, §M.8) | kept at [262,262]: it lies 0.2 km off the corrected track, which passes it at about 09:10, inside the new window | Saint-Hilaire 0.20 km at 09:10 (was 0.44 km at 08:45) |
| `pratzen-village` "Thiebault's brigade clears Pratzen village" | t 540 (09:00), tolerance 1.5 km | **time kept**: "c. 09:00" is what the texts say, and the check passes at 09:00 on the new track; only its written reason changed, because it described the old track ("the division's plotted centre lies between the village and the Pratzeberg" → "at about 09:00 the division's plotted centre is still climbing the western slope below it") | the village, [276,243] (not engine-fitted) | 1.21 km at 09:00 (was 1.14), under the same 1.5 km |
| `hq-forward` "Napoleon moves forward to Stare Vinohrady" | t 720 (12:00) | **t [720, 760]** (the move, 12:00-12:40): a consequence of `gqg@6`'s dated departure, needed because at 12:00 Napoleon is now still at the Zuran, 4.8 km from the marker | kept at [309,207], the destination | 0.00 km at 12:40 (was 0.32 at 12:00) |

The decision named `pratzen-village` for re-dating on the strength of §M.3's sketch (b-shift), which moved Saint-Hilaire later
than this task does; on the corrected track re-dating it would detach it from the text's "c. 09:00", so it was not done. No
other event changed; `sim-test.js` reports 0 disagreements with its 1 km rule unchanged, worst 0.82 km (telnitz, unchanged).

**The interface during a delayed move** (fact; `node tools/stage2/delayed-moves.js`, before and after in
`docs/stage2-evidence/delayed-moves.md`). Inconsistent before: while a dated move had not begun inside its phase, the
dossier's "Doing now" and the counter's status already showed the phase's act (e.g. Napoleon at 11:30 "moves forward" while
the Stage 1B engine already had him at Stare Vinohrady; at 12:45 Saint-Hilaire "wheels south" 15 minutes before the dated
wheel). Fixed in presentation only (`waitingFor`, `textPhase`, `liveStatus`, `timingNow`; the model is unchanged): until the
dated departure the counter, the block's pose, the smoke, the selection chip and the dossier use the previous anchor's act
and status; the dossier adds a row "From hh:mm: <the phase's act>" and its timeline shows the move as "From hh:mm"; the
dispatch's "What changed" list prefixes such acts with "From hh:mm:"; the dossier repaints when a selected formation's move
begins or ends inside a phase (it repainted only at phase changes before). Every explicitly timed move shows a "Timing" pill
with its grade, and in the full dossier the window, whether the arrival is derived, the basis, the quoted evidence and the
note; the footer adds the grade's meaning. During a move the existing "interpolated" marker shows, as before. Study view at a
phase start and Watch view during a move were checked in the probe's eight states; the arrow of each phase is §C.1's re-run
(no `OVERLAYS` change: 2C's).

**A consequence for `check:visual` (fact).** Caffarelli's dated advance (09:30-10:30) puts his counter among the cavalry
reserve's at 10:00, where the hybrid-dimmed harness view looks: the Stage 0 counter fallback (20 positions, then 80% and 64%
size) then left four counters overlapping (Caffarelli, d'Hautpoul, Walther, Drouet), a threshold failure. Adding those
pairs to the allowance would loosen it, so the fallback was extended instead: after its 20 positions it tries a ring of ten
wider ones (`declutter`, `app.js`), which only a counter that found no place before can reach. The view now has no overlap,
the Stage 0 Walther / Nansouty residual included, so that allowance is removed from `thresholds.js` (decision 24 had put
this in 2D). 2D's DOM layer replaces this canvas pass in any case.

### M.12 Derived readings and text (re-derived, not loosened)

| reading (who checks it) | before (Stage 1B) | after |
|---|---|---|
| centre separation first reported (situation line; `sim-test.js` "not cut before the battle") | 08:26, reported until 14:14 | **09:03**, until 14:52 |
| plateau Allied / French at 08:45 (`sim-test.js` series) | 23,550 / 13,300, ARMY CUT | 23,550 / **0**, not cut |
| plateau at 09:30, 11:00, 12:00 | 18,150 / 13,300; 17,050 / 20,300; 4,250 / 37,500 | unchanged |
| plateau at 14:00 | 0 / 18,500 | 0 / **30,900** (the wheel now leaves the plateau 13:00-14:00) |
| plateau at 04:00, 07:00, 08:00, 16:00; tour stop 4's 38,700 and 19,300 (first reached 07:07) | 38,700; 27,000; 19,300; 0 / 18,500 | unchanged |
| "the centre empties before Soult attacks"; "the French hold the plateau at 11:00" (`sim-test.js`) | yes; yes | yes; yes |
| event agreement (`sim-test.js`, 1 km) | 0 disagreements, worst 0.82 km | 0, worst 0.82 km; `soult` 0.44 → 0.20, `pratzen-village` 1.14 → 1.21 (1.5 allowed, unchanged), `hq-forward` 0.32 → 0.00 |
| march-rate audit (`audit.js`, `selfTest`, `redteam.js`): legs over the ceiling; fastest leg by arm (km/h) | 0; inf 3.41, hq 7.15, mixed 1.11 | 0; inf **4.97** (Saint-Hilaire's climb), hq **7.62**, mixed **3.87**; cav, guard, art unchanged |
| `redteam.js` mean march rates, infantry / cavalry (km/h) | 0.77 / 0.82 | **1.28** / 0.82: its warning "cavalry mean rate is not above infantry" now fires (a warning, not a finding). Cause: the dated moves are shorter and faster; the cavalry's slow legs are the undated creeping moves of §M.10. Not changed |
| Command view, enemy formations seen / uncertain / unknown at each phase's midpoint, French eyes | phases 5-8: 2/2/9, 4/0/9, 9/0/4, 7/0/6 | 4/2/7, 6/0/7, 7/0/6, 8/0/5 (phases 0-4 and 9 unchanged) |
| the same, Allied eyes | phases 2-3: 3/1/14, 5/1/12 | 4/1/13, 6/1/11 (the rest unchanged) |
| formations moved at the harness clocks, against Stage 1B | - | 08:20: 8 (largest Rivaud 1,656 m); 09:30: 6 (Bagration 1,607 m); 09:45: 7 (Bagration 1,205 m); 09:50: 7 (1,071 m); 10:00: 7 (803 m) |
| chronology audit (`chronology.js --check`) | 70 moves with a timed statement: 48 consistent, 22 early | 69 (friant@1 re-reviewed): **65 consistent, 4 early (the unresolved conflicts, by name), 0 late** |
| arrow binding (§C.1): derivable on the executed leg | 1 | 4 |

**Text against the derived readings (searched: narrative, tour, analysis, dispatch, command and dossier text).** Tour stop 4
("about 39,000 at 04:00 to about 19,000 by 07:15") still matches (first reached at 07:07). Tour stop 8 ("in two halves", clock
14:40) and the chapter "The destruction of the Allied left" (14:40) now fall inside the centre-separation interval; on the
Stage 1B tracks the reading had already stopped at 14:14, so the new timing removes that inconsistency. The chapter "The
attack on the Pratzen" (clock 08:47) no longer shows the army as cut and the French as holding 13,300 on the plateau, which
matches its text ("At about 08:45 they climbed the western slope"). No text states the centre-separation time, the knowledge
counts or the march rates. **Nothing needed correcting; nothing is flagged.**

### M.13 Arrivals derived from the march-rate ceiling: decided (owner, 2C precondition): "(b) where it fits, otherwise (c), flagged"

**The problem (owner, on #12).** For an undated arrival after a dated departure, §M.8 takes "no earlier than the ceiling
allows" as the arrival. That turns an upper bound into a pace: those formations move at 93-99% of their arm's ceiling.
The report showed the bias: the fastest infantry leg rose from 3.41 to 4.97 km/h (ceiling 5), the mean infantry rate
(1.28 km/h) now exceeds the cavalry's (0.82), and Vandamme's wheel takes 15 minutes. Since 2C derives arrows from these
tracks, this is recorded as an **open data question that must be decided before 2C**. The `redteam.js` warning stays a
warning; it is not silenced.

**The legs (fact; `node tools/stage2/derived-legs.js`, table `docs/stage2-evidence/derived-legs.md`).** Seven legs have a
derived arrival: five from the ceiling and one from its existing `moveMin` (Napoleon, 60% of the headquarters ceiling). Four
more are dated at both ends but run at 80% of the ceiling or more. Status is the formation's status during the leg; ground is
the ascent along the route (model elevations through `GEOREF`), a Goldbach crossing, and villages within 700 m of the route.

| leg | window | km | km/h | of ceiling | arrival | status | ground | bounded by the next anchor: latest arrival; slowest pace that fits |
|---|---|---:|---:|---:|---|---|---|---|
| sthilaire@3, the climb | 08:45-09:15 | 2.48 | 4.97 | 99% | derived | attacking | 213 → 259 m, ascent 47 m; crosses the Goldbach; Puntowitz | `sthilaire@4` at 09:30 (phase-start default): 09:22; 3.98 km/h |
| vandamme@3, the climb | 08:45-09:14 | 2.40 | 4.96 | 99% | derived | attacking | 226 → 254 m, ascent 31 m; crosses the Goldbach; Girzikowitz | `vandamme@4` at 09:30 (default): 09:20; 4.14 km/h |
| rivaud@3, follows Soult | 08:45-09:09 | 1.97 | 4.93 | 99% | derived | advancing | 246 → 229 m; crosses the Goldbach; Girzikowitz | `rivaud@6` at 11:15 (default): 10:59; 0.88 km/h |
| vandamme@7, the wheel | 13:00-13:15 | 1.19 | 4.76 | 95% | derived | advancing | 264 → 245 m; Pratzen | `vandamme@8` at 14:30 (default, the Augezd height c. 14:30): 13:50; 1.43 km/h |
| bag@6, falls back | 11:15-11:25 | 0.78 | 4.66 | 93% | derived | holding | level | `bag@7` at 12:45 (default): 12:36; 0.57 km/h |
| bag@8, withdraws on Rausnitz | 16:30-16:45 | 1.17 | 4.69 | 94% | derived | retreating | level; Posoritz post house | `bag@9` at 17:00 (default): 16:48; 3.99 km/h |
| gqg@6, Napoleon forward | 12:00-12:40 | 4.77 | 7.15 | 60% of 12 | derived (moveMin 40) | observing | ascent 64 m; crosses the Goldbach; Girzikowitz | `gqg@7` at 12:45 (default): 12:42; 6.84 km/h |
| c_gren@8 | 14:00-14:30 | 2.47 | 4.94 | 99% | dated (the wheel ends 14:00; the phase-8 anchor is the default 14:30) | attacking | 254 → 219 m, descending | forced: dated end to default start |
| kollo@5 | 10:15-10:30 | 1.22 | 4.86 | 97% | dated (Jurczek c. 10:15; the phase-5 anchor at the default 10:30) | engaged | level | forced: dated arrival to default arrival |
| bag@9 | 16:45-17:00 | 1.03 | 4.13 | 83% | the derived 16:45 to the default 17:00 | retreating | level | follows from bag@8 |
| guard_inf@6 | 10:15-11:15 | 4.02 | 4.02 | 80% | moveMin 60 (unchanged since Stage 1B) | advancing | ascent 36 m; crosses the Goldbach | not changed by this task |

**What forces each speed (derived).** For five of the six ceiling-derived legs the next anchor leaves room: the pace is the
rule's choice, not a constraint. **Vandamme's wheel is the clearest case, and the premise needs correcting:** the height above
Augezd by 14:30 does *not* force the 15-minute wheel. It leaves him until 13:50 (1.43 km/h would do). What Augezd forced was
not using the wheel's end, 14:00, as his arrival (§M.8). The legs that are genuinely constrained are **the two climbs**:
the phase-4 anchors on the Pratzeberg and at Stare Vinohrady are undated phase-start defaults (09:30), which leave the
climb at least 3.98 and 4.14 km/h. **Bagration's withdrawal** is held by `bag@9`'s default (17:00, nightfall), and
**`c_gren@8` and `kollo@5`** by a dated time followed 15-30 minutes later by a default phase start. In every constrained case
the binding anchor is an undated default, not a dated statement.

**Options for a later data task** (simulated on the whole model; any rate is a **design value, unsourced**, and would be
labelled so, never presented as history):

| option | what changes | consequences (simulated) |
|---|---|---|
| (a) undated arrivals at a stated share of the ceiling (75%, 60%, 50%) | the rule in `anchorList` | At 75%: both climbs and Bagration's withdrawal no longer fit before their next anchor (3 movement-audit findings). At 60% or 50%: the same, plus the climbs arrive after the phase-4 anchors (timing findings) and `pratzen-village` fails its 1.5 km (1.57 / 1.67 km). Centre separation 09:09 / 09:15 / 09:21. Unless the constrained next anchors are also re-timed (undated, so not possible without evidence), (a) is unworkable at any share below about 80%. |
| (b) a lower tactical rate for formations deployed in battle order (design values: infantry and Guard 3.0 km/h, cavalry 6.0, mixed 4.0; statuses attacking, advancing, counter-attacking, engaged, charging, holding, supporting, withdrawing, repulsed) | a rate table beside `SPEED_CEIL`, used only for derived arrivals | The wheel (Vandamme 13:24), Rivaud (09:25) and Bagration falling back (11:31) take plausible times. The two climbs do not fit (same findings as (a) at 60%) and `pratzen-village` fails. Bagration's withdrawal stays at the ceiling (its status is "retreating"). |
| (c) leave them at the ceiling and flag them | nothing in the engine; the dossier already says "arrival derived: the march-rate ceiling"; a list in §M | No finding and no event failure; the bias stays, and 2C would derive arrows from 15-minute moves. |
| **(b) where it fits, else (c), flagged** (simulated) | (b)'s rate where the leg then still fits before its next anchor; otherwise the ceiling, listed by name | 0 findings, 0 event failures, centre separation 09:03 (unchanged). Vandamme 13:00-13:24, Rivaud 08:45-09:25, Bagration 11:15-11:31 at about 3 km/h. The two climbs and Bagration's withdrawal stay at the ceiling, flagged. |

**Recommendation.** The last row: a tactical rate for formed bodies, labelled a design value, used only where the move
still fits; the ceiling, flagged by name, where it does not. The flagged legs (the two climbs, Bagration's withdrawal) are
constrained by undated default anchors, so they are not a rate question but a dating one. The climbs in particular hang on
when Saint-Hilaire reached the Pratzeberg crest, which is the same question as Kamensky's turn (§M.9); they should be
settled from the same passage of Duffy and Thiebault, not by choosing a rate. Also in scope for that data task: the two
dated legs forced near the ceiling by a following default (`c_gren@8`, `kollo@5`), which are the same pattern. Until it is
decided, the tracks stay as they are, and 2C must not start.

**Decided (owner, the 2C precondition) and done: the recommendation, "(b) where it fits, otherwise (c), flagged".** The rule
lives in `anchorList` (`app.js`, guarded) with the table `TACTICAL_RATE` and the statuses `BATTLE_ORDER` beside `SPEED_CEIL`.
For a leg whose arrival is derived (a dated departure, no dated arrival) and whose formation is in battle order during the leg
(its status at the anchor's phase is attacking, advancing, counterattack, engaged, charging, holding, supporting, withdrawing or
repulsed), the arrival is taken at a **tactical rate: infantry and Guard 3.0 km/h, cavalry 6.0, mixed 4.0**; artillery and
headquarters have none, so their ceilings apply as before. **These rates are design values, unsourced**: said so in the code,
in the dossier ("arrival derived: tactical rate, a design value") and on the sources sheet ("Arrivals the map derives"). The
tactical arrival is used only where the leg still fits before its next anchor (no later than the latest arrival that leaves the
next leg within the ceiling, the next leg's dated departure, or the phase the formation leaves the field); otherwise the arrival
stays at the ceiling and is flagged (`arrFlag`), by name in `chronology.js` (`CEILING_FLAGGED`; `--check` fails on any other
derived arrival at the ceiling). The outcome reproduces the simulation, leg by leg (`node tools/stage2/derived-legs.js`):

| leg | before | after | rule |
|---|---|---|---|
| vandamme@7, the wheel | 13:00-13:15, 4.76 km/h | **13:00-13:24, 2.97 km/h** | tactical |
| rivaud@3, follows Soult | 08:45-09:09, 4.92 km/h | **08:45-09:25, 2.96 km/h** | tactical |
| bag@6, falls back | 11:15-11:25, 4.68 km/h | **11:15-11:31, 2.93 km/h** | tactical |
| sthilaire@3, the climb | 08:45-09:15 | unchanged | ceiling, flagged: the tactical rate (09:35) does not fit before `sthilaire@4` (latest 09:22) |
| vandamme@3, the climb | 08:45-09:14 | unchanged | ceiling, flagged: the tactical rate (09:33) does not fit before `vandamme@4` (latest 09:20) |
| bag@8, withdraws on Rausnitz | 16:30-16:45 | unchanged | ceiling, flagged: its status is *retreating*, not a battle-order status, so the tactical rate does not apply; it would not fit either (16:54 against the latest 16:48) |
| gqg@6, Napoleon forward | 12:00-12:40 | unchanged | its own `moveMin` (headquarters: no tactical rate) |

The following legs move with them, their departures being the new arrivals: `vandamme@8` 13:24-14:30 (was 13:15), `rivaud@6`
09:25-11:15 (was 09:09), `bag@7` 11:31-12:45 (was 11:25). **Not changed, and still open:** the two climbs and Bagration's
withdrawal are a dating question tied to the unresolved Kamensky passage (Duffy 1977; Thiebault's memoirs) and to nightfall;
they wait on the sources. The dated legs forced near the ceiling, `c_gren@8` and `kollo@5`, and the four unresolved conflicts
(`dok@1`, `guard_cav@6`, `kamensky@3`, `kamensky@4`) are untouched.

Re-derived (`chronology-sim.js`, the suites): centre separation 09:03 (unchanged); the plateau series (04:00 38,700 / 0 to
16:00 0 / 18,500) unchanged; the Command view's knowledge counts at every phase midpoint unchanged; event agreement 0
disagreements, worst 0.82 km (telnitz), unchanged; the march-rate audit 0 legs over a ceiling, fastest by arm unchanged (inf
4.97, the climbs); the chronology audit 65 consistent, 4 early (the named conflicts), 0 late. Positions change only for
Vandamme (13:01-14:29, up to 446 m), Rivaud (08:46-11:14, up to 729 m) and Bagration (11:16-12:44, up to 291 m); at the
harness clocks only Rivaud moves (09:30 158 m, 09:45 135 m, 09:50 128 m, 10:00 113 m). `redteam.js` mean march rates:
infantry 1.28 → **1.23** km/h, cavalry 0.82: its warning (cavalry not above infantry) **still fires**, kept as a warning.
