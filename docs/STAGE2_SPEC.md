# Map readability specification (Stage 2, Part A)

**Status: draft for the owner's review. No change to the build.** Written against `main` at `7e03692`
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

## 0. Owner decisions 18-30 (fixed), and whether the evidence contradicts them

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
| 25 | Paper map: true north up (`GEOREF.NORTH`, `GEOREF.ROT`), straight down, orthographic or near-orthographic; pan and zoom only; drag-to-pan and zoom-to-cursor brought forward for the paper map; drawn and hidden elements as listed; framing inside the unobstructed area. | **Workable** (§G). Naming only: `geo.js` exports the rotation as `GEOREF.ROT_DEG` (17.42 degrees), not `GEOREF.ROT`. |
| 26 | Flags and standards join the figure scale (2B) with a provisional pike-to-man ratio, labelled provisional until Stage 6; state its basis. | Proposal in §I.1. |
| 27 | Meres: no outline change without a georeferenced source; a research note on the Satschan, Menitz and Kobelnitz ponds. | Note in §I.2. Two points the owner's brief states differently from the sources found: the Second Military Survey covered **Moravia in 1836-1840** (1836-52 is the span for the Czech lands as a whole), and the local estate report as quoted gives the Satschan draining as **8-16 December 1805**, not 8-12. The recovered finds also disagree with the app's own data (§I.2). |
| 28 | Land cover follows the cover polygons, not the 81 m triangles; roads and streams draped; palette colours stay Stage 4. | Workable; §K (2F). |
| 29 | Legend (2D, 2E): contextual, compact, collapsible, no empty area, never over the dispatch; states the current exaggeration and the two named symbol scales. | Workable; §F.2. |
| 30 | Scope guard: no historical, geographic, chronological or order-of-battle change in Stage 2 except the traceable `OVERLAYS` changes under 21-23; no other Stage 3 item. | Noted. The going-layer thresholds (§B.4) and the pond finds (§I.2) are recorded as questions for data tasks, not changed. |

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
decided here: **question L2**.

### B.5 Recommended default (recommendation)

**4x.** At 4x the Pratzen's west face is drawn at 28.9 degrees at the 95th percentile (38 at the steepest triangle), which
reads as a slope rather than the 55-64 degree cone of today; the Pratzeberg stands 3.75 figure heights and 2.2 broadleaf
heights above Sokolnitz, so the relief reads above its own symbols; the Santon is about two figures above the
Goldbach; the low Pratzen view gives the relief 139 px. At 3x the Santon is 1.5 figures and the relief 1.6 trees, so
the knoll on the French left barely clears the tree crowns; at 5x the west face is back to 35-45 degrees.
The choice is visual: it trades the owner's aim (a defensible, not dramatic, relief) against legibility of the
relief above figure-scale symbols. 4x is what the numbers support; the owner confirms it on the renders.

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
`docs/stage2-evidence/exag-1x-options.jpg` (Pratzen, low Pratzen and Zuran, (a) against (b)). Question L4.

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
would draw 10 of the 11 derivable arrows one phase later than today: **question L3**. The full list, with every
candidate's distances, is `docs/stage2-evidence/arrow-binding.md` (from `arrow-binding.js --md`).

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
  glyph (SVG), the nation tag (10.5 px), the echelon mark above (10.5 px), the B / C / ? badge on its plate, and the
  short name beside it at 12.5 px. **Full counter** (on hover, keyboard focus, selection, for the highlighted family, and
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

**Proposal: a provisional pole-top-to-man ratio of 1.6**, with the cloth, the pole's thickness and the hanging
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
| Second Military Survey (Franciscan) | Moravia 1836-1840 (146 sections) | as the cadastre (it was drawn on it) | triangulated, derived from the cadastre | as the cadastre |
| Contemporary battle plans (French and Austrian) | 1805-06 and after | usually show both ponds | schematic; not surveyed | the state at the battle, but not georeferenced |

**The draining in December 1805 (reported).** A report by František Brutmann, administrator of the Chrlice estate,
quoted in Czech local sources (austerlitz.org, Žatčany chronicle; obeczatcany.cz), says the Satschan pond was
drained on Napoleon's order between **8 and 16 December 1805** and held two drowned Russian soldiers, 180 artillery horses
and 18 guns. English-language summaries (napoleon-series.org, historyofwar.org) give 38 guns and about 130 horses,
or two or three men and about 150 horses. **The app's own data** (`FEATURES`, satschan, `data.js:687`) says "38 guns,
about 130 horses, and two men (figures as usually given)". These disagree; the disagreement is kept, and changing the
data is a data task. The owner's brief gives 8-12 December; the quoted report gives 8-16.

**Areas that disagree (reported).** Menitz: 514 ha (one local source) against "over 800 ha" and "the largest pond in
Moravia" (another; slavkov-austerlitz.com); a search summary of the same article also gives "almost 189 jitra
(about 108 ha) when abolished in 1827", which may refer to a remnant or to another pond. The Satschan pond's area was
not found. Both disagreements are kept; the ellipses in the app (about 2.6 and 3.7 km², i.e. 260 and 370 ha) are
schematic and not fitted to either.

**Kobelnitz (reported).** Kobylnice's municipal history says a pond flooded the site of the village's 15th-16th
century fort and was drained in the 19th century. Its extent and whether it held water in December 1805 were not
found; the app draws the ground as marsh.

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
- `check:baseline` moves to 2B's build, recorded in `CHANGELOG.md`.

**2C, movement arrows**
- **Arrow-track binding (new suite test, `binding-test.js`):** every `OVERLAYS` arrow has one verdict; every arrow
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
  elements in every harness view; the Walther / Nansouty allowance removed from `thresholds.js`. `measure.js` reads
  the rendered boxes of the DOM layer instead of projecting sprites.
- **Nothing that matters dropped (new):** the selection and the highlighted family are never dropped; drops of other
  elements are reported per view, with a ceiling set from 2D's own numbers.
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
| **2C** movement arrows | `app.js` (draped arrow drawer from `planRibbon`, derivation from legs, heads, boundaries, halt kind, trail leftover), **`OVERLAYS`** (traceable data changes only: the halt entry; any mismatch the owner decides), a new `binding-test.js`, `tools/run-all.sh` | 2B (draping on the display height) | ten derived arrows move if the owner chooses the *across* reading (L3); overlay labels move with the arrows and meet the label-overlap threshold; `check:data` will report `OVERLAYS` changed, with each change in `CHANGELOG.md` | the binding table after 2C, every `OVERLAYS` change (was, is, evidence, why), the chevron renders, the dash test |
| **2D** one DOM/SVG layer, legend | `app.js` (layer, layout, occlusion, accessibility, picking, legend), `symbols.js` (canvas counter path removed at the end), `shell.html`, `style.css`, `tools/visual/measure.js`, `thresholds.js` (residual removed), `contrast.js` | 2C (arrow labels are among its elements) | the largest change of the stage: every view's text moves; render-on-demand (the layer updates only when a frame is drawn); picking; the first-run and tour states | per view: overlaps (0), drops, leaders, pass time, node count, text sizes and contrast, unobstructed fraction; parity screenshots against the canvas path before it is removed |
| **2E** paper map | `app.js` (camera mode, pan and zoom-to-cursor written for reuse in Stage 3, what is drawn), `world.js` (flat village footprints, woods symbology, cartographic hillshade), `style.css`, harness cases | 2B (factor handling), 2C (draped arrows), 2D (compact counters) | the camera code assumes a perspective `fov` in label sizing (`pxPerWorld`, `labelRect`, `fitLabel`); 2D removes most of that; the scale bar | north bearing, scale uniformity, the new cases, the framing, what is hidden |
| **2F** ground surface | `world.js` (cover from polygons in the shader or a cover texture, draped roads and streams), possibly `assets.js` (no new asset expected) | 2B | cover classification is model (`coverClass`, guarded): the drawing changes, not the classes; performance of a cover texture; the paper map's look | the boundary test, draping, the meres note's status |

## L. Open questions for the owner

Only what the evidence cannot settle, each with a recommendation.

1. **Order of 2E and 2F.** The paper map shows the triangle cover boundaries more plainly than the landscape. Nothing
   forces a change of order. *Recommendation:* keep 2E before 2F as decided, and accept that the paper map's cover edges
   improve in 2F; or swap them if the owner prefers the paper map to arrive finished.
2. **The going layer's slope thresholds** (§B.4) are 9 and 17 degrees of the drawn 10.33x slope, i.e. 0.88 and 1.70
   degrees true. *Recommendation:* in 2B compute the classes from the model slope with the thresholds converted to
   true degrees (0.88, 1.70), so the map is unchanged at every factor, and record the thresholds as design values to
   be sourced in a later data task.
3. **Which leg an arrow shows** (§C.1). A phase's arrow, as drawn today, is the leg that *arrives* at that phase's anchor
   (10 of 11 derivable arrows); decision 22 says "across that phase". *Recommendation:* derive the arrow of phase ph
   from the leg arriving at anchor ph, shown during phase ph, because that is how the arrows were authored and how
   the anchors are defined (a position at the phase's start); the three arrows drawn on the other reading become
   data questions. The alternative moves ten arrows one phase later.
4. **True scale (1x)** (§B.6). *Recommendation:* option (b), formations as footprints at 1x.
5. **Default factor** (§B.5). *Recommendation:* 4x, to be confirmed on the renders.
6. **Provisional standard ratio** (§I.1). *Recommendation:* 1.6 (pole top to figure height), design rule stated.
7. **Mismatched arrows** (§C.1). *Recommendation:* in 2C, the eight that stop short of or start off an anchor by
   under 900 m are generated from their legs, each change recorded; Friant's approach march (2.0 km), Drouet forms line
   (1.8 km) and the V Column's counter-march (a phase question) stay hand-authored and flagged until a data task
   settles them.
8. **Compact counter content** (§F.1): frame, glyph, nation tag, echelon, badge and the short name; strength, status and
   commander only when full. *Recommendation:* as stated; the zoom distance at which counters open is set in 2D from the
   harness views.
9. **Legibility of the landscape Study views.** The one-layer prototype has to drop up to 14 of 20 formation names in the
   Study views because the panels leave a third of the screen (§H). Stage 2 cannot move the panels (decision 30).
   *Recommendation:* accept the drops in Stage 2 (reported, never the selection or highlighted family) and treat §H as
   the input to Stage 3's docking of the dispatch.

