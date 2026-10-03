# Time and atmosphere specification (Stage 4, Part A)

**Status: Part A merged (#27); the owner accepted every recommendation of §J, recorded as decisions 68-82 (§0.4). 4B (the light)
is merged (#28); 4C (the atmosphere) is merged (#29); 4D (pacing) is merged (#30); 4E (smoke, ice, the horizon and the palette tables) is implemented, for review; what each found is at the end of §I. Sections A-J below still describe the build they were written
against.** Part A was written
against `main` at `18e014b` (the spine data task merged, #26), whose build `austerlitz-command-map.html` is 1,348,542 bytes,
md5 `6b2cccd44138e95e6082c82b8b2d2f8a`. Before any work: `check:baseline` passed; `npm test` (all nine suites and the height
guard) passed; `check:data` found all 113 declarations identical to `archive/spine-6b2cccd4.html`; `check:chronology` reported 0
errors; `check:visual` (20 views, the self-test 126 of 126) and `check:contrast` (4,223 text elements in 28 states, 0 below AA, 0
below 10.5 px) passed. Line numbers refer to that commit; the code is the source of truth, not the documents.

Scope: the Stage 4 line of `docs/VISUAL_AUDIT.md` ("Ephemeris sun and continuous light (replacing Stage 0's temporary shadow toe
and re-assessing its narrowed landscape hillshade), valley fog, smoke, ice, horizon, pacing"), which carries high-impact
opportunities 2 ("Let the documented weather and light do the dramatic work") and 4 ("Pacing and direction"). §0.2 lists what
else the records assign to Stage 4. Parts 4B onward implement it; this part measures, prototypes and specifies. Nothing from
Stage 5 (spatial confidence, the evidence skeleton, interval events, "Whose eyes?", plan ghosts, day-tracks) or later is
specified here; where a Stage 4 design meets Stage 5, the boundary is stated (§C.6, §D.3).

**Scope guard (the brief; kept).** No historical, geographic, chronological, order-of-battle or `OVERLAYS` change; nothing is
implemented. Light and atmosphere are presentation. Where something would read as historical evidence (the weather, the fog,
the sun's hour), it is labelled with what the app's own texts say and whether they cite a source; nothing about the day's
weather is invented, and no new source is used. The sun's position is **derived** from astronomy (§A.2), not a record of the day.

**How this was established.** Every number below was produced by a script in `tools/stage4/` (committed; not bundled), run
against the build above. `sun.js` reads the live sources in node through `tools/stage2/model.js`. The page scripts drive the built
page in headless Chromium with software WebGL, as the Stage 0 harness does (`tools/stage2/page.js`, which injects
`tools/visual/measure.js`), and inject a **probe** into the running page: measurement code, not the Stage 4 implementation. No
source file changes. Evidence is in `docs/stage4-evidence/` (its README lists every file). Frame times are software WebGL on the
harness machine: comparable with one another, not with a GPU.

Labels, as in the earlier specifications: **fact** (read from the code or data, or measured), **derived** (computed from facts),
**recommendation** (a proposal for 4B onward), **open** (needs the owner). Owner decisions are cited by number (1-17 in
`docs/VISUAL_SPEC.md`, 18-46 in `docs/STAGE2_SPEC.md`, 47-67 in `docs/STAGE3_SPEC.md`).

| script | section | what it produces |
|---|---|---|
| `ephem.js` | A | the sun on 2 December 1805 at a site, one self-contained function (Meeus ch. 25, NOAA's equation of time, Bennett's refraction), shared by the others |
| `sun.js [--md f] [--json f]` | A, C | the computed sun every 10 minutes in two readings of the clock; sunrise, sunset, twilight; each phase's `LIGHT` preset as an azimuth and altitude against it; the altitude a sun corrected to the display factor takes; the share of the modelled ground facing away from the sun and in the terrain's cast shadow, at 1x, 4x and 10.33x, under the true and the corrected sun; the model's slopes |
| `light-probe.js [--json f] [--sheet f]` | A | seven variants of the light (today; no toe; the computed sun; corrected to the factor; three baked hillshades) rendered in every landscape harness view, four of them at 1x, 4x and 10.33x, and an hourly sweep 08:00-16:00: darkness, luminance percentiles, map text contrast as rendered, drops, pass and frame times |
| `fog-probe.js [--json f] [--sheet f]` | B, C | the fog as drawn in every landscape view (with and without Stage 3D's recession); the formations' and places' elevations against candidate fog tops; a true-space haze and a valley fog layer rendered through replaced fog chunks: darkness, contrast, drops, frame times, the haze over the ground, the figures under the fog |
| `report-4b.js [--json f] [--md f] [--sheet f]` | I (4B) | per landscape view (four also at 1x and 10.33x) and the day at 4x: solid near-black, luminance, map text contrast as rendered, drops, and on a 4B build the sun's true and drawn altitude and the shadow box; run on the build before 4B with `AUSTERLITZ_HTML` |
| `pace-probe.js [--json f]` | D | the clock's durations at each speed; the phase change's glide against each phase; two camera rules over the whole day (today's phase-boundary rule and a continuous follow): live events inside the free rectangle, the floor, the ground's speed across the screen, the map layer's drops |

## 0. The decisions, the scope and the records against the evidence

### 0.1 Decisions that bind Stage 4

| # | decision (summary) | what it means for Stage 4 |
|---|---|---|
| 5, 19, 35 | The display factor is presentation: one factor on the drawn ground and `groundY()`; `height()`, `hAt()`, viewsheds and line of sight stay on the model; settings 1x, 4x (default), 10.33x. | The light and the fog are drawn at every factor and measured at all three (§A.4, §B.2). A sun over exaggerated ground is a new instance of the same question (§A.3): the light's geometry must follow the drawn ground, or the shading is the exaggeration's, not the day's. |
| 6, 14 | The miniature scale of figures, buildings and flags is deliberate and stated. | Shadows of figures, trees and houses are at that scale whatever the sun does; their length is a design matter, not a measure (§A.5). |
| 27 | No mere outline changes without a georeferenced source. | "Ice on the meres" (§F.1) changes their surface, never their outline. |
| 28 | Land cover from the polygons; "palette colours stay Stage 4". | The natural terrain palette is Stage 4's (§G); the cover classes (`coverClass`, guarded) are not. |
| 16, 38, 39 | Type floors; map text on plates meeting AA as rendered; drops per view no more than the limit, never the selection, the highlighted family or live events. | Every change of light or fog changes the pixels behind the map layer: contrast as rendered is measured per variant (§A.4, §C.4). Pacing's follow camera is measured against the drop limits along the whole day (§D.2). |
| 47, 61 | Follow is `!freeCam` made visible; the fitted Overview with the fog receding beyond the authored distance. | Continuous follow (§D.3) extends Follow, it does not replace the toggle or its rules. The recession (`fogShift`) is a stopgap Stage 4 replaces (§B.3). |
| 56 | The relief control stays disabled while the battle plays; the ground switch does not. | Unchanged. A slower default (§D.3) lengthens the time the relief control is disabled; the sources sheet's sentence (1.2 minutes at normal speed) must follow the new speed. |
| 62 | Drop limits only tighten. | No Stage 4 part may raise one (§H). |

"Things that should not change" (`docs/VISUAL_AUDIT.md`) that Stage 4 touches: **bare winter trees, frost on north-facing slopes,
crop strips** (kept; the frost is computed from the drawn normals, `world.js:548-560`, and the shader, `world.js:983-984`);
**reduced-motion support** (every new motion has a reduced-motion form, §D.3); **the Command view** (its knowledge rule already reads
the phase's mist, §C.1, and is not changed); **continuous clock-driven positions** (pacing changes how fast the clock runs, never
where a formation is at a clock); "Do not animate losses ... or suggest mass drowning at the meres" (opportunity 4; §F.1).

### 0.2 What the records assign to Stage 4 (the scope)

| item | where it is assigned | section |
|---|---|---|
| Ephemeris sun and continuous light, "replacing Stage 0's temporary shadow toe and re-assessing its narrowed landscape hillshade" | roadmap, Stage 4 line; opportunity 2 ("a continuous, clock-driven sun gives raking light all day"); `CLAUDE.md` current state; `world.js:909-915`; `docs/STAGE2_SPEC.md` (§A table: the toe was tuned at 10.33x, "its removal stays Stage 4") | A |
| Valley fog: "height fog in the valley bottoms, lifting on the timing the narrative gives (documented versus modelled marked)" | roadmap; opportunity 2; `world.js:1772` ("Stage 0 only: the valley fog itself is Stage 4") | C |
| The fog's recession beyond the authored Overview's distance | Stage 3D (`app.js:1985-1996`, "a presentation matter of the light, which Stage 4 replaces"); decision 61 | B |
| Smoke: "soft-particle smoke tied to engagement" | roadmap; opportunity 2 | E |
| Ice on the meres; a horizon ring | roadmap; opportunity 2 | F |
| Pacing: "slower default, automatic dwell at each event, a follow camera, arrows that draw on with the clock" | roadmap, Stage 4 line ("pacing"); opportunity 4; `docs/STAGE3_SPEC.md` §0.2 item 8 (continuous following is Stage 4) | D |
| **Assigned by the records, not named in the roadmap's Stage 4 line:** the natural (and paper) terrain palette, `COVER_COL` ("Stage 4's to change", `world.js:646`); the colour literals of lighting, sky, fog and sun (70 values), smoke, dust and mist (11) and terrain, water, vegetation and buildings (72), documented in `docs/VISUAL_SPEC.md` appendix A as "Stage 4, out of scope"; decision 28 ("palette colours stay Stage 4") | `docs/VISUAL_SPEC.md:8`, `:283`, `:721`, `:1047-1164`; decision 28 | G |
| **Named in the roadmap's opportunity 4 but not in its staged plan:** "arrows that draw on with the clock" | `docs/VISUAL_AUDIT.md`, opportunity 4 | D.3 |

Not Stage 4 (by the roadmap): "Whose eyes?", which combines "the knowledge model, the viewshed and the valley fog (always labelled
as a model reading)", is Stage 5 (opportunity 1); interval events drawn as bars are Stage 5; the first-run opening sequence is
Stage 7. Stage 4 draws the fog; it does not make the fog a reading (§C.6).

### 0.3 Where the evidence contradicts the roadmap, the records or the brief (fact)

Each is stated, not worked around.

1. **The roadmap's sun is confirmed, and so is its account of the presets.** Computed for 49.14 N, 16.76 E on 2 December 1805
   (`sun.js`, derived): sunrise 07:45 and sunset 16:15 local apparent time (07:34 and 16:05 local mean time), the sun on the
   meridian at 12:00 apparent (11:50 mean), never higher than 19.0 degrees. The roadmap's "around 07:40-07:50 local solar time
   and never ... above about 19 degrees" agrees. The presets (fact, `app.js:151-182`): the midday preset puts the sun 30.4 degrees
   up (the computed 18.2-19.0 in its phase); the dawn preset shows a disc at 35% from 07:00, when the computed sun is 7.2 degrees
   below the horizon; **two more the roadmap does not name**: the late preset (phase 8, to 17:00) keeps the sun 7.7 degrees up
   and its disc at 90% while the computed sun sets at 16:15, and the dusk preset (phase 9, 17:00-18:00) shows a disc at 50%, 2.8
   degrees up, with the computed sun 7-17 degrees below the horizon. The afternoon preset's azimuth (233.9) is 30 degrees west of
   the computed sun at its phase's middle (203.4). The predawn preset (phase 0) lights the field from azimuth 357 (north), 25
   degrees up: a night key light, not a sun (§A.1).
2. **"The clock basis of the sources is itself uncertain by minutes"** (roadmap) is the app's own position, but the app does not
   say it: `SOURCE_NOTE` says "the hours given are well documented" and names no clock basis. The two readings differ by the
   equation of time, 10.4 minutes on the day (derived). Which one the sun follows is a question (§J, question 2); the difference
   is smaller than the "c." of every timed statement in the data.
3. **An ephemeris sun over the exaggerated ground is not the day's light.** At the default 4x and at 10.33x a sun at its true
   altitude lights the drawn slopes, which are 4 and 10.33 times steeper in gradient, so the shading and the cast shadows are the
   exaggeration's: at 08:00 the computed sun (1.5 degrees up) leaves 5.5% of the modelled ground in the terrain's cast shadow at
   true scale, 27.2% at 4x and 59.2% at 10.33x; at noon 0%, 0.5% and 2.8% (`sun.js`, derived). The roadmap's "a continuous,
   clock-driven sun" and decision 19 ("the display factor is presentation") pull apart here; §A.3 shows the one light that
   satisfies both exactly (the sun's vertical scaled by the factor) and §J question 1 asks for the choice.
4. **The Stage 0 correction was tuned at 10.33x** (`docs/STAGE2_SPEC.md`, §A table) and 2B said "gentler relief gives less deep
   shade, so the correction can only matter less". Measured at the default 4x without the toe (§A.4): four of the nine landscape
   views at 4x then exceed the Stage 0 limit on solid near-black (0.16-0.44% against 0.05%), and two at 10.33x (up to 1.85%). The
   toe cannot simply be removed under today's presets; under the corrected sun with a fill tied to the sun it can (§A.4b).
5. **"Height fog in the valley bottoms, lifting on the timing the narrative gives (documented versus modelled marked)."** The
   narrative's timing is the app's own texts (§C.2): "Fog fills the Goldbach valley" (phase 0), "standing in fog behind Puntowitz"
   (Saint-Hilaire's track, phase 0), "c. 08:45 Soult's divisions advance. The mist lifts off the heights." (phase 3's timeline), "climb
   out of the fog into sunlight" (phase 3). **None cites a source**: the move records that quote the 08:45 line give its basis as
   "app narrative, unsourced" (`data.js:191`, `209`, `364`), and `SOURCE_NOTE.refs` names no source for the weather. So in this
   project nothing about the fog is "documented" in the sense of the evidence layer; it is the app's narrative, which the
   reconstruction follows. §C labels it so and proposes no new claim. The texts also say the mist lifted off the **heights**, not
   out of the valley: the valley still held fog when Soult climbed out of it.
6. **The model already has a fog** (fact, not in any record of Stage 4): the knowledge model calls a formation "uncertain" when
   the phase's `mist` exceeds 0.5 and the formation stands below model height -0.8 (`app.js:2316`, `knowledgeOf`, guarded), that is
   below 238.2 m (`GEOREF.elevM(-0.8)`, derived). Phases 0-2 (04:00-08:45) carry `mist` 1.0, 0.98 and 0.90 (`data.js:57`, `65`, `73`).
   A drawn valley fog whose top differs from 238.2 m, or whose lifting differs from 08:45, would contradict the Command view's
   reading. §C.5 draws it at that threshold.
7. **`PHASES[].mist` after the battle's morning has no text behind it.** Phases 8 and 9 carry 0.22 and 0.30 (`data.js:123`, `131`)
   and the mist sheets come back over the meres and the Goldbach in the afternoon and evening; no text in the app mentions fog or
   mist after 08:45. The values are design values in a guarded declaration; changing them is a data task (§J question 6).
8. **"Ice on the meres": the meres are already drawn as ice** (`world.js:1162`, `iceMat`, a matte grey-blue disc, opacity 0.96),
   and the data says so ("Large shallow fishpond, frozen on 2 December", `data.js:711`). What Stage 4 can add is the ice's
   surface under the computed sun; the outlines are schematic and stay so (decision 27). How thick the ice was, and how much of
   either mere was frozen, is not in the app's texts and is not invented.
9. **"A horizon ring"**: the modelled ground ends at the field (±180 by ±155 world units) and a coarse apron runs to ±860 by ±760
   (about 54 and 48 km from the centre, `world.js:1498-1499`); beyond it is the sky dome (`world.js:473`). A ring of the real distant hills would be
   geographic data (it needs a terrain model beyond the field and a source); that is a data task, not presentation. §F.2
   proposes only the atmospheric horizon.
10. **Smoke is tied to the phase, not to engagement.** A formation smokes while its phase status is a fighting one (`FIGHTING`,
   `app.js:3382`; `liveStatus(id,curPhase)`, `app.js:3461`), so smoke switches at phase boundaries; the events' windows (`EVENTS[].t`)
   are not read. §E measures how far the two agree. Soft particles need the scene's depth, which the frame path does not keep
   (`FX.rtScene` is made by `makeRT` with a depth buffer but no depth texture, `app.js:1738-1744`, `1752`).
11. **"Arrows that draw on with the clock"** (opportunity 4) can apply only to the arrows derived from an executed leg (17 of 36,
   `binding-test.js`): an interpretive arrow has no leg and so no clock to draw on. `OVERLAYS` is guarded and does not change.
12. **The roadmap's pacing figures are confirmed** (`pace-probe.js`, fact): at 1x the day (04:00-18:00, 840 clock minutes) plays
   in 84 s and the Pratzen assault (phase 3, 45 minutes) in 4.5 s. The phase change's camera glide (`TRANS_MS`, 2.6 s) takes 26 clock
   minutes at 1x: 58% of each of the three 45-minute phases (2, 3 and 5) and 43% of the 60-minute ones (§D.1).

### 0.4 Owner decisions 68-82 (the answers to §J)

The owner accepted every recommendation of §J ("happy to go with your recommendations re questions"). Each is recorded as a
decision, in the question's order; §J keeps the trade-offs.

| # | question | decision |
|---|---|---|
| 68 | 1, the light at 4x and 10.33x | The light's vertical is scaled by the display factor (tan alt_k = k tan alt); the disc at the true altitude. (4B) |
| 69 | 2, the clock's basis | The app's clock read as local apparent (solar) time, stated as a reading, not a finding. (4B) |
| 70 | 3, the shadow toe | Replaced by a fill light opposite the sun, its strength in the light table. (4B) |
| 71 | 4, before dawn | A design night light, labelled; no moon computed. (4B) |
| 72 | 5, the valley fog's opacity | About 55%. (4C) |
| 73 | 6, `PHASES[].mist` 0.22 and 0.30 | Kept, drawn as a thin evening haze labelled "modelled"; no data change. (4C) |
| 74 | 7, the default speed | ½×, no new button. (4D) |
| 75 | 8, dwell | About 2.5 s at each of the 22 event starts while playing, on by default, a toggle in the layers panel. (4D) |
| 76 | 9, decision 56's sentence | "normal speed" becomes "1×" in a one-line data task with 4D, recorded. (4D) |
| 77 | 10, smoke | The phase status decides who smokes; the naming events' windows decide how much. (4E) |
| 78 | 11, Follow while playing | Continuous while the clock plays; the phase views for the phase buttons and the pause. (4D) |
| 79 | 12, the 3D colours | The paper map's ground colours into `TOKENS.sym.paperMap`; the landscape's in four named tables. (4E) |
| 80 | 13, the horizon | No ring of distant relief; the haze and the sky meet at the horizon. (4C, 4E) |
| 81 | 14, the haze | Counted from the focus (beyond the orbit target's distance). (4C) |
| 82 | 15, sequencing | 4B, 4C, 4D, 4E. |
| 83 | asked while building 4D (§I, "4D, as delivered") | The draw-on as "ghost and progress": a derived arrow is always drawn whole and faint, its head at the destination; the part marched is drawn over it at full strength to the formation, without a head; once the leg is complete the arrow is drawn at full strength. In place of §D.3 item 4's "not drawn before the leg starts, the head at the tip". (4D) |

## A. The light

### A.1 The light today (fact; read from the code)

- **Four lights** (`app.js:240-275`, `init`): a hemisphere fill (sky `#A9BBCC`, ground `#3E3A30`); a weak fixed fill from
  (80, 60, -120) at 0.16, "a weak fill from opposite the sun so shaded slopes are dark, never black" (its comment; it stands at
  azimuth 51, 22.6 degrees up, derived, so it is opposite only an afternoon sun near azimuth 231); the sun, a directional light that casts shadows; the
  environment map, re-made from the sky's colours (`refreshEnvironment`, `app.js:203-225`) whenever they change. The sun's shadow
  map is 4096 px square (2048 where the GPU's largest texture is smaller, 1024 on the low tier), over an orthographic box of
  236 by 216 world units (about 14.9 by 13.7 km) centred on the orbit target, near 20 and far 660 along the light. Each drawn
  frame moves the sun and its target with the orbit target (`loop`, `app.js:5192-5198`), so the box follows the view; it is
  not fitted to what is on screen.
- **Ten presets, one per phase** (`LIGHT`, `app.js:151-182`; the phase names its preset in `PHASES[].light`, guarded data):
  each fixes the sun's intensity, colour and direction (`p`, a vector from the orbit target), the sky fill, the fog's near, far
  and colour, the background, the sky's three colours, the mist's colour, the sun disc's opacity and the grade (lift, gain,
  saturation, contrast, bloom, exposure). An eleventh, `staff`, is the paper map's.
- **The light steps at phase boundaries.** `setClock` starts a transition when the phase changes (`app.js:1691-1703`);
  `startPhaseTransition` (`app.js:1643-1690`) interpolates every value of the preset (and the mist, the sky texture and the
  environment map) over `TRANS_MS`, 2.6 s of real time, eased; within a phase the light does not change with the clock. At 1x a
  phase change's light takes 26 clock minutes; scrubbing or a phase button starts it anew each time.
- **The sun disc** is a sprite 74 units across, 560 units from the orbit target along the preset's direction, fog off, its
  opacity the preset's `disc` × 0.92 (`buildSunDisc`, `app.js:226-237`; `loop`).
- **The grade** (FX path only, `initFX`, `app.js:1746-1880`): bloom, exposure, ACES, lift and gain, saturation, contrast about
  mid-grey in gamma space, a vignette, grain, linear to sRGB, then **the shadow toe** (`app.js:1872-1876`): below 0.2 on screen
  each channel is lifted by `1.2 * c * (0.2 - c)^2 / 0.04`, "continuously (value and slope match at 0.2), and leaves black black".
  Without FX (`setFXEnabled(false)`, the F key) the renderer's own ACES tone mapping draws the frame, without the toe.
- **The baked hillshade** (`world.js:548-560`, `scaleGround`; `world.js:983-985`, the ground shader): each vertex carries
  `max(0, N·L)` for a fixed light from azimuth 330.7, 44.4 degrees up (derived from (-0.52, 0.70, -0.49); the cartographic
  north-west convention, turned with the map's frame), computed from the drawn normals. The landscape multiplies the ground's
  colour by `0.70 + 0.42 sh` (0.70-1.12; "was 0.46-1.20", Stage 0's narrowing, `world.js:909-915`), the paper map by
  `0.66 + 0.46 sh`. On the landscape the real-time sun lights the same ground again, from its own direction. The frost
  (north-facing slopes lightened toward a cold grey, up to 30%) reads the same drawn normals.
- **The paper map** draws with the `staff` preset (sun 71.9 degrees up, intensity 0.28, sky fill 1.05), shadows off
  (`renderer.shadowMap.enabled=!staff`, `app.js:2674`) and its own hillshade (`paperShade`, `world.js:453-459`); nothing in this
  section changes it.

### A.2 The computed sun against the presets (derived; `node tools/stage4/sun.js`, `docs/stage4-evidence/sun.md`)

The sun's position is computed (Meeus, *Astronomical Algorithms*, ch. 25, low accuracy, about 0.01 degree; NOAA's equation of
time; Bennett's refraction) for GEOREF's origin, 49.14 N 16.76 E, on 2 December 1805; the field spans about 0.1 degree, which
moves sunrise by under a minute. It is astronomy, not a record of the day: whether the sky was clear, and when, is the app's
narrative's matter (§C.2).

| | clock read as local apparent time | as local mean time |
|---|---|---|
| equation of time (apparent - mean) | 10.4 min | 10.4 min |
| sun on the meridian; highest altitude | 12:00; 19.0 degrees | 11:50; 19.0 degrees |
| nautical dawn, civil dawn, sunrise | 06:28, 07:08, 07:45 | 06:18, 06:58, 07:34 |
| sunset, civil dusk, nautical dusk | 16:15, 16:52, 17:31 | 16:05, 16:41, 17:21 |

| phase (clock) | preset | preset sun: azimuth, altitude (degrees) | disc | computed at start / middle / end, apparent time (azimuth, altitude) |
|---|---|---|---|---|
| 0 (04:00-07:00) | predawn | 356.9, 25.1 | 0 | 82, -35.8 / 99, -21.2 / 115, -7.2 |
| 1 (07:00-08:00) | dawn | 141.1, 6.8 | 0.35 | 115, -7.2 / 121, -2.9 / 127, 1.5 |
| 2 (08:00-08:45) | mist | 143.6, 10.1 | 0.45 | 127, 1.5 / 131, 4.3 / 135, 6.9 |
| 3 (08:45-09:30) | sunburst | 143.1, 11.6 | 1.0 | 135, 6.9 / 140, 9.3 / 145, 11.5 |
| 4 (09:30-10:30) | morning | 154.2, 19.4 | 0.55 | 145, 11.5 / 151, 14.1 / 158, 16.2 |
| 5 (10:30-11:15) | morning | 154.2, 19.4 | 0.55 | 158, 16.2 / 164, 17.4 / 169, 18.3 |
| 6 (11:15-12:45) | midday | 182.9, 30.4 | 0.40 | 169, 18.3 / 180, 19.0 / 191, 18.2 |
| 7 (12:45-14:30) | afternoon | 233.9, 19.5 | 0.55 | 191, 18.2 / 203, 15.7 / 215, 11.5 |
| 8 (14:30-17:00) | late | 257.4, 7.7 | 0.90 | 215, 11.5 / 231, 3.3 / 245, -7.2 |
| 9 (17:00-18:00) | dusk | 272.7, 2.8 | 0.50 | 245, -7.2 / 250, -11.8 / 255, -16.5 |

Reading (derived): the presets follow the sun's arc from south-east to south-west in outline, and phase 3's "sunburst" (143,
11.6) is within 5 degrees of the computed sun across its phase. They depart from it in four places: a disc before sunrise (phase
1) and after sunset (phases 8 and 9); the midday sun 11 degrees too high; the afternoon sun 30 degrees too far west; and a
direction that holds for a whole phase (phase 8's 150 minutes, in which the computed sun moves 30 degrees in azimuth and from
11.5 degrees up to 7 below the horizon).

### A.3 The display factor and the light (derived; `sun.js`)

At factor k the drawn ground's gradient is k times the true one (decision 35; the model's own vertical scale is 10.33x). Under a
sun at its true altitude the drawn slopes are lit as no slope of the true ground is. Over the modelled ground (105,651 points at
1-unit spacing; the shadow march every 2 units, up to 200 units toward the sun):

| clock (true altitude) | facing away from the sun, % at 1x / 4x / 10.33x | in the terrain's cast shadow, % at 1x / 4x / 10.33x |
|---|---|---|
| 08:00 (1.5) | 3.2 / 14.8 / 32.6 | 5.5 / 27.2 / 59.2 |
| 09:00 (8.5) | 0.05 / 1.2 / 6.7 | 0.06 / 2.4 / 11.8 |
| 10:00 (14.1) | 0 / 0.4 / 3.9 | 0 / 0.8 / 7.1 |
| 12:00 (19.0) | 0 / 0.3 / 1.2 | 0 / 0.5 / 2.8 |
| 15:00 (8.5) | 0.05 / 1.0 / 3.7 | 0.08 / 2.2 / 7.6 |
| 16:00 (1.5) | 1.8 / 12.9 / 32.6 | 3.7 / 25.1 / 58.8 |

The model's slopes at true scale: median 0.38 degrees, 90th percentile 1.4, 99th 4.8, steepest 14.1; drawn at 4x: 1.5, 5.7, 18.5,
45.1; at 10.33x: 3.9, 14.4, 40.8, 68.9.

**The corrected sun** (derived, exact). For a surface y = f(x, z) drawn as y = k f(x, z), the normal (-k f_x, 1, -k f_z) and a
light whose vertical component is also multiplied by k, (l_x, k l_y, l_z), give N_k · L_k = k (N · L): the lit side (the sign) is
the true ground's under the true sun at every factor, and so is every cast shadow (a ray of the corrected light over the drawn
ground is the drawn image of the true ray over the true ground). Its altitude is tan(alt_k) = k tan(alt): at 4x the noon sun is
drawn 53.9 degrees up (19.0 true), at 10.33x 74.3; at 08:00, 6.2 and 15.6 (1.5 true). Under it the shares above are, at every
factor, the 1x column: 3.2% facing away and 5.5% in cast shadow at 08:00, none at noon. The tonal ratio of a slope to the flat
ground is the true one up to the normal's length (|N| / |N_k|: 1.00 at the median slope, 0.95 at the 99th percentile at 4x). What
it does not keep is the sun's height as seen: vertical things (figures, trees, houses, at their own miniature scale, decision 6)
cast shadows k times shorter than the true sun would draw, and the disc stands where the drawn light is unless it is drawn
separately at the true altitude (§A.5).

### A.4 The light rendered (fact; `node tools/stage4/light-probe.js`, `docs/stage4-evidence/light-probe.json`, `light-sheet.jpg`)

Seven variants in every landscape harness view at its own clock (four views also at 1x and 10.33x): **A** today; **B** today
without the toe; **C** the computed sun's direction (apparent time) with the preset's colour, intensity, sky fill, fog and grade,
the toe on; **D** C without the toe; **E** the computed sun corrected to the factor, without the toe; **F** E with the baked
hillshade at its pre-Stage-0 range (0.46-1.20); **G** E with no baked hillshade on the landscape. The cell is the share of the
map (outside the panels) in solid near-black 8x8 blocks, in per cent; the harness's Stage 0 limit is 0.05% (**bold** above it);
then the 5th percentile of luminance (0-255) and the mean.

| view @ factor (preset; computed altitude, drawn altitude in E) | A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|---|
| overview-field @1x (morning; 11.5) | 0 · 23 · 64.2 | 0 · 20 · 61.8 | 0 · 20 · 61.4 | 0 · 17 · 58.3 | 0 · 17 · 58.3 | 0 · 17 · 58.0 | 0 · 17 · 58.3 |
| close-sokolnitz @1x (mist; 4.0) | 0 · 33 · 76.5 | 0 · 28 · 75.9 | 0 · 31 · 75.3 | 0 · 26 · 74.6 | 0 · 26 · 74.6 | 0 · 26 · 74.4 | 0 · 26 · 74.7 |
| pratzen-low @1x (morning; 13.3) | 0 · 32 · 68.9 | 0 · 26 · 67.4 | 0 · 30 · 68.7 | 0 · 23 · 66.8 | 0 · 23 · 66.8 | 0 · 23 · 66.5 | 0 · 23 · 66.8 |
| ph8-overview-study @1x (late; 10.6) | 0 · 23 · 35.1 | 0 · 17 · 29.0 | 0 · 25 · 36.0 | 0 · 18 · 30.3 | 0 · 18 · 30.3 | 0 · 18 · 30.1 | 0 · 18 · 30.3 |
| overview-field @4x (11.5; 39.3) | 0 · 20 · 63.8 | 0 · 19 · 61.4 | 0 · 19 · 60.8 | 0.013 · 17 · 57.6 | 0 · 20 · 68.7 | 0 · 20 · 68.2 | 0 · 20 · 68.8 |
| overview-plan @4x (11.5; 39.3) | 0 · 27 · 36.4 | 0 · 20 · 31.0 | 0 · 22 · 32.6 | 0 · 16 · 26.0 | 0 · 30 · 40.8 | 0 · 29 · 40.3 | 0 · 30 · 40.9 |
| close-sokolnitz @4x (4.0; 15.5) | 0 · 34 · 75.9 | 0.010 · 28 · 75.4 | 0 · 33 · 74.4 | 0.010 · 26 · 73.7 | 0.010 · 28 · 76.3 | 0.010 · 28 · 76.0 | 0.010 · 28 · 76.4 |
| pratzen-low @4x (13.3; 43.4) | 0 · 21 · 73.3 | **0.257** · 16 · 71.5 | 0 · 19 · 72.6 | **0.475** · 15 · 70.4 | **0.109** · 19 · 76.3 | **0.099** · 19 · 76.1 | **0.124** · 19 · 76.1 |
| selected-formation @4x (11.5; 39.3) | 0.006 · 17 · 40.1 | **0.440** · 14 · 35.2 | 0.013 · 15 · 36.2 | **1.058** · 11 · 30.5 | **0.083** · 18 · 43.7 | **0.096** · 17 · 43.0 | **0.115** · 17 · 43.9 |
| watch-selected @4x (12.9; 42.5) | 0 · 18 · 39.5 | **0.406** · 14 · 34.5 | 0 · 16 · 36.3 | **0.994** · 12 · 30.7 | 0.025 · 20 · 44.4 | 0.030 · 20 · 43.7 | 0.036 · 19 · 44.6 |
| hybrid-dimmed @4x (14.1; 45.2) | 0 · 24 · 42.6 | **0.162** · 17 · 38.4 | 0 · 21 · 40.4 | **0.344** · 15 · 35.4 | 0.015 · 25 · 48.5 | 0.015 · 25 · 47.9 | 0.010 · 25 · 48.7 |
| ph8-overview-study @4x (10.6; 36.7) | 0 · 24 · 35.4 | 0 · 17 · 29.5 | 0 · 26 · 36.4 | 0 · 19 · 30.9 | 0 · 28 · 40.3 | 0 · 28 · 40.0 | 0 · 28 · 40.3 |
| ph8-overview-watch @4x (10.6; 36.7) | 0 · 25 · 35.4 | 0 · 18 · 29.6 | 0 · 26 · 36.4 | 0 · 19 · 31.0 | 0 · 28 · 40.2 | 0 · 28 · 39.9 | 0 · 28 · 40.3 |
| overview-field @10.33x (11.5; 64.6) | 0 · 20 · 63.5 | **0.051** · 18 · 61.0 | 0 · 19 · 60.6 | **0.076** · 16 · 57.5 | 0 · 22 · 73.3 | 0 · 21 · 72.7 | 0 · 22 · 73.6 |
| close-sokolnitz @10.33x (4.0; 35.5) | 0 · 42 · 81.0 | 0 · 40 · 80.9 | 0 · 40 · 79.8 | 0.005 · 38 · 79.6 | 0 · 45 · 83.9 | 0 · 45 · 83.6 | 0 · 46 · 84.2 |
| pratzen-low @10.33x (13.3; 67.8) | 0 · 18 · 91.4 | **1.847** · 13 · 89.6 | 0 · 17 · 90.6 | **2.431** · 12 · 88.6 | 0.015 · 24 · 96.2 | 0.015 · 24 · 96.2 | 0.025 · 24 · 95.8 |
| ph8-overview-study @10.33x (10.6; 62.5) | 0 · 24 · 35.9 | 0 · 18 · 30.2 | 0 · 26 · 37.0 | 0 · 19 · 31.7 | 0 · 34 · 46.3 | 0 · 34 · 45.9 | 0 · 34 · 46.5 |

**The day at 4x** (the sweep: the Field vantage and the low Pratzen view every hour 08:00-16:00, variants A, D and E; the same
cells; `light-probe.json`, `sweep`):

| clock (preset) | Field: A | D | E | low Pratzen: A | D | E |
|---|---|---|---|---|---|---|
| 08:00 (mist) | 0 · 25 · 87.8 | 0 · 22 · 85.2 | 0 · 23 · 86.5 | 0 · 25 · 87.4 | **0.129** · 19 · 84.9 | **0.089** · 19 · 88.6 |
| 09:00 (sunburst) | 0 · 21 · 64.6 | 0.019 · 17 · 60.5 | 0 · 22 · 70.8 | 0 · 23 · 78.0 | **0.173** · 17 · 76.5 | **0.144** · 21 · 82.7 |
| 10:00 (morning) | 0 · 20 · 63.9 | 0.006 · 17 · 58.9 | 0 · 21 · 70.1 | 0 · 21 · 73.4 | **0.391** · 15 · 70.2 | **0.099** · 19 · 76.4 |
| 11:00 (morning) | 0 · 19 · 62.5 | **0.083** · 17 · 59.0 | 0.006 · 21 · 70.2 | 0.005 · 18 · 68.7 | **0.490** · 14 · 63.5 | **0.163** · 18 · 71.8 |
| 12:00 (midday) | 0 · 20 · 65.3 | 0.025 · 18 · 58.9 | 0 · 21 · 70.5 | 0 · 22 · 70.5 | **0.129** · 16 · 64.9 | **0.059** · 20 · 74.4 |
| 13:00 (afternoon) | 0 · 20 · 62.5 | 0.025 · 16 · 58.1 | 0 · 20 · 68.0 | 0 · 23 · 68.7 | **0.149** · 16 · 63.1 | **0.059** · 19 · 71.0 |
| 14:00 (afternoon) | 0 · 20 · 62.6 | **0.153** · 15 · 56.9 | 0 · 21 · 67.0 | 0 · 21 · 68.3 | **0.386** · 14 · 61.7 | 0.050 · 19 · 69.9 |
| 15:00 (late) | 0 · 17 · 62.6 | **0.121** · 14 · 60.1 | 0 · 20 · 66.4 | 0 · 23 · 65.9 | **0.144** · 16 · 61.8 | 0.005 · 24 · 67.5 |
| 16:00 (late) | 0 · 18 · 62.7 | **0.503** · 10 · 57.3 | **0.147** · 12 · 59.3 | 0 · 23 · 65.1 | **0.990** · 12 · 58.3 | **0.124** · 15 · 60.5 |

The other thresholds, in every view and variant (fact): **map text** 0 below AA as rendered; the lowest contrast 6.49:1
(hybrid-dimmed, every variant: a text on its plate), and E lowers a view's lowest by at most 0.39 (overview-field at 10.33x,
8.49 to 8.10) because the ground behind the plates is lighter; **drops** unchanged by the light in every view (the same count in
all seven variants; all within `DROP_LIMIT`); **the map layer's pass** at most 1.7 ms (budget 8); **the unobstructed fraction and
the eye's clearance** identical before and after (the light moves neither); **frame time** (the world pass, software WebGL,
median over the views): 6.1-7.8 ms in every variant, with no ordering beyond the noise (the first render after each factor change
compiles shaders, 2.4 s, and is not counted).

Reading (derived):
- **The toe still matters at the default 4x**, against 2B's expectation (§0.3, item 4): without it (B), four of the nine views
  at 4x exceed the Stage 0 limit (0.16-0.44%), and at 10.33x two (pratzen-low 1.85%). At 1x it never does.
- **The computed sun at its true altitude makes it worse** (D against B): every 4x view that failed fails by more (up to 1.06%),
  and the Field vantage fails at 11:00, 14:00, 15:00 and 16:00.
- **The corrected sun removes most of it** (E against B): every view at 1x, 10.33x and the Overviews is at or near 0; the Field
  vantage passes every hour but 16:00 (the sun 1.5 degrees up). **It does not remove all of it**: three 4x views stay above the
  limit (pratzen-low 0.109%, selected-formation 0.083%, and the low Pratzen view at 08:00-13:00 and 16:00). §A.4b names what is
  black there.
- **The baked hillshade hardly matters under the corrected sun** (E, F and G within 0.04 point of each other and within 1 of
  luminance everywhere): the real-time sun does the shading.
- **The ground is lighter under the corrected sun at 4x and 10.33x** (the mean +4 to +12 of 255), because its drawn altitude is
  higher than the presets' (39-68 degrees against 8-30); the grade and the palette were tuned under the presets (§G).

### A.4b What is black without the toe, and two remedies (fact; `node tools/stage4/dark-probe.js`, `docs/stage4-evidence/dark-probe.json`)

A ray through the centre of every solid near-black block names what is drawn there (the counts are blocks, the whole frame,
panels included). Two remedies are tried on E: **H**, the fixed fill light (0.16, from (80, 60, -120), `app.js:263-265`) turned to
stand opposite the sun's azimuth at 0.28; **J**, the sky fill raised by 0.12 (0.40 to 0.52 in the morning preset).

| view @ factor | A today | B today, no toe | E corrected sun, no toe | H: E + the fill opposite the sun | J: E + sky fill +0.12 |
|---|---|---|---|---|---|
| pratzen-low @4x (09:50) | 0 | 52: ground 31, conifers 17, figures 3 (Vandamme 2, Legrand 1), trees 1 | 22: conifers 17, ground 3, trees 1, figures 1 | 4: conifers 2, ground 1, figures 1 | 4: conifers 3, figures 1 |
| pratzen-low @10.33x | 0 | 373: ground 334, Vandamme's figures 16, lines and others 20, conifers 3 | 3: conifers 2, ground 1 | 0 | 2 |
| close-sokolnitz @4x (08:20) | 0 | 2: conifers 1, Bourcier's figures 1 | 2 (the same) | 1 | 0 |
| overview-field @4x (09:30) | 0 | 0 | 0 | 0 | 0 |

Reading (derived): without the toe, today's light blackens the **ground** (334 of 373 blocks at 10.33x: the exaggerated slopes in
the presets' shade); the corrected sun removes that, and what is left at 4x is mostly the **conifers'** crowns on their shaded side
(17 of 22), a few figures in dark coats and a little ground. Either a fill that stands opposite the sun or a slightly stronger sky
fill brings the worst view to 4 blocks (about 0.02% of the map, under the limit of 0.05%). So the toe can go if the light carries a
fill tied to the sun (recommendation, §A.5 item 5): a remedy in the light, where the shade is made, not in the grade.

### A.5 Design (recommendation)

1. **One sun, computed from the clock.** `sunAt(clock)` (the code of `tools/stage4/ephem.js`, moved into `app.js` as presentation;
   derived, labelled so in the sources sheet) gives the true azimuth and altitude at the field for the clock read as local
   apparent time (question 2). It replaces the presets' directions on the landscape; the paper map keeps its own `staff` light.
2. **The light's geometry follows the drawn ground** (question 1): the light's azimuth is the sun's; its altitude is corrected to
   the display factor, tan(alt_k) = k tan(alt) (§A.3), so at every factor the lit side and the cast shadows of the drawn ground are
   those of the true ground under the true sun; at 1x it is the true sun. **The disc is drawn at the sun's true altitude** (what
   an observer saw) and only while the sun's upper limb is above the horizon (07:45-16:15 apparent). The two then disagree at 4x
   and 10.33x (the disc lower than the light); the sources sheet says so in one sentence, as it says the relief is exaggerated.
3. **Continuous light.** Every value the presets carried (intensity and colour of the sun, the sky fill, the sky's three colours,
   the haze's and the mist's colours, the background, the grade, the disc's opacity) becomes a function of the sun's true altitude
   and of morning or afternoon, read from one table (`LIGHT_BY_ALT`, rows at about -18, -12, -6, -0.8, 2, 6, 12 and 19 degrees,
   morning and afternoon rows where today's presets differ), interpolated each drawn frame from the clock. Its first values are
   today's presets placed at the altitude where each one's phase has the sun (dawn at -3, mist at 4, sunburst at 9, morning at 15,
   midday at 19, afternoon at 16, late at 3, dusk at -12), so the look is kept where the presets matched the sun. The phase change
   (`startPhaseTransition`) then fades only the overlays and moves the camera; scrubbing shows the light of that minute at once.
   The environment map (`refreshEnvironment`, a PMREM pass) is re-made only when the sky's colours have moved by more than a
   threshold, not every frame (its cost is to be measured in 4B; not measured here).
4. **Night and twilight.** Below -0.8 degrees the sun's light is off and the disc hidden; the sky fill and the sky follow the
   table down through civil (-6) and nautical (-12) twilight. Before nautical dawn (06:28) the field is lit by a night light, a
   design light as the predawn preset is today (azimuth 357, 25 degrees), labelled in the code as a design value, not a moon. The
   moon is not computed here: by the mean synodic month (derived, ±1 day) it was about 10 days old and about 80% lit; whether it
   was above the horizon between 04:00 and 07:00 needs a lunar ephemeris (question 4).
5. **The shadow toe goes**, replaced by a fill tied to the sun: the fixed fill light (0.16 from a fixed direction) is turned to
   stand opposite the sun's azimuth and raised to about 0.28 (variant H, §A.4b), its value in the light table. Measured: the
   corrected sun alone leaves three views at 4x over the Stage 0 limit (conifer crowns in shade, a few dark coats); with the fill the
   worst is 4 blocks (0.02%). The FX and non-FX paths then draw shade alike (the non-FX path has no toe today).
6. **The baked hillshade leaves the landscape** (variant G): with a real sun it is a second light from a fixed north-west, which in
   the afternoon contradicts the sun (the sun in the south-west); E, F and G measure the same (§A.4). The paper map keeps its own
   cartographic hillshade (Stage 2E, decision 19); the going layer keeps its per-face shade (`world.js:677`). The frost stays.
7. **The shadow map follows what is drawn.** The box is fitted each frame to the drawn ground inside the free rectangle (not a
   fixed 236 by 216 units about the target), its centre snapped to whole shadow texels so a moving camera (§D) does not make shadows
   shimmer, and the light placed so the box's near and far cover the ground under it. Derived: with today's fixed box the ground
   the shadow map spans along the sun's azimuth is 216 / sin(alt) units: at 4x and noon (53.9 degrees drawn) 267 units, 15 texels a
   unit; at 08:00 (6.2 drawn) 2,000 units, 2 texels a unit; at 1x and 08:00 (1.5) 8,250 units.
8. **Where the words go.** Every sentence this specification puts in "the sources sheet" (here, §B.3, §C.5) is one of the sheet's
   presentation notes, written by `app.js` as the arrows' notes are (`arrowNotes`, `app.js:4988`), not a change to `SOURCE_NOTE`
   (guarded data); the one exception, decision 56's sentence, is question 9.
9. **What does not change:** the cover classes and their colours' meaning (§G), the frost, bare winter trees and crop strips;
   `height()`, `hAt()`, the viewshed and line of sight; the paper map's light; reduced motion (the light has no motion of its own;
   it follows the clock).

### A.6 What must hold

Existing, unchanged: the Stage 0 darkness measure (solid near-black at most 0.05%) in every harness view, at its factor; map text
at AA as rendered and at its floor; drops within `DROP_LIMIT`; the layer's pass under 8 ms; the unobstructed baselines; the camera
floor; the self-test's ground, figure, mist, overlay-draping, arrowhead, paper-map and cover checks at 1x, 4x and 10.33x;
`check:contrast`; the paper map identical at every relief setting.

New (to hold the gain):
- **Self-test, the sun:** at 40 clocks across the day and at each factor, the drawn light's azimuth equals `sunAt`'s within 0.1
  degree and its altitude equals the corrected altitude within 0.1 degree; the disc is drawn exactly when the true altitude of the
  upper limb is above the horizon (none before 07:45 or after 16:15 apparent); at 1x the drawn altitude is the true one.
- **Self-test, continuity:** across every phase boundary, a one-minute step of the clock changes the sun's direction, intensity and
  colour, the sky fill and the grade by no more than the largest one-minute change within a phase (no step at a boundary).
- **Self-test, shadows:** every point of the drawn ground under the free rectangle lies inside the shadow camera's frustum, at
  each factor, from every vantage.
- **Harness, the day:** the darkness measure on the Field vantage and the low Pratzen view at 4x every hour 08:00-16:00 (the sweep
  of §A.4, as new cases or as a harness loop), and on the four multi-factor views at 1x and 10.33x; all within the Stage 0 limit
  without the toe.
- **Harness:** the composite carries no shadow toe once it is removed (a static check of the shader text in `css-test.js`'s
  manner), so it cannot come back unmeasured.

## B. The atmosphere: aerial perspective, and the fog's recession

### B.1 Today (fact; `node tools/stage4/fog-probe.js --only today`, `docs/stage4-evidence/fog-probe.json`)

- **One linear fog** (`THREE.Fog`, `app.js:243`): the fog factor is `smoothstep(near, far, depth)` in the eye's view depth, its
  near, far and colour the phase preset's (90-560 at start; 100-640 predawn to 240-1,080 midday; `LIGHT`). Stage 3D adds the
  recession: each drawn frame on the landscape, `fogShift()` adds `max(0, eye-to-target distance - 274)` to near and far, 274
  being the authored Overview's distance (`app.js:1985-1996`). Every material is fogged except the sky dome, the sun disc, the
  mist sheets and the paper map's symbols (`fog:false`).
- **The haze sheet**: one broad mist sheet (360 by 310 units) 3.4 model units above the datum, at 26% of the phase's `mist`
  (`world.js:1820-1826`), "so the far ground recedes properly"; it is mist, not fog (§C.1).
- **What the fog does in the harness views** (fog factor at the orbit target; over the drawn ground under a 32 x 18 grid in the
  free rectangle: the mean, and the share above 0.5):

| view (eye to target, units) | shift | at the target | mean | above 0.5 | without the shift: at the target, mean, above 0.5 |
|---|---|---|---|---|---|
| overview-field (243.7) | 0 | 0.003 | 0.062 | 0 | the same |
| overview-plan, the fitted Overview in Watch (425.4) | 151.6 | 0.014 | 0.014 | 0 | 0.172, 0.173, 0 |
| close-sokolnitz (57.2) | 0 | 0 | 0 | 0 | the same |
| pratzen-low, at 1x / 4x / 10.33x (70-72) | 0 | 0 | 0.048-0.064 | 0.053-0.056 | the same |
| selected-formation, watch-selected, hybrid-dimmed (87-99) | 0 | 0 | 0 | 0 | the same |
| ph8-overview-study, the fitted Overview in Study (536.2) | 262.3 | 0.047 | 0.048 | 0 | 0.492, 0.494, 0.377 |
| ph8-overview-watch (425.4) | 151.6 | 0.047 | 0.048 | 0 | 0.269, 0.271, 0 |

Reading (derived): in every view at or within the authored distance the fog does almost nothing to the ground in view (a mean of
at most 6%, all of it toward the horizon in the low views); its work is at the horizon. Without the shift the fitted Overview in
Study would be half fogged at its target, which is why 3D added it. The shift is a kink (none up to 274 units, then one unit of
fog distance per unit of eye distance) and has no meaning in the scene's terms.

### B.2 Candidates tried (fact; `fog-probe.js --only render,focus`)

The probe replaces three.js's fog chunks so that every fogged material computes an exponential haze **in the true geometry**:
the ray from the eye to the point with its vertical divided by the display factor, heights in metres through `GEOREF` (one scale
authority), density falling with height above 200 m with a 400 m scale height, and the meteorological visibility at 200 m as the
one parameter (10 km in H1, 20 km in H2; design values, not a record of the day's visibility). H3 is H1 counted only beyond the
orbit target's distance from the eye (the subject clear; what lies behind it receding). The haze's colour is the preset's fog
colour. Haze over the drawn ground: at the target, the mean, the share above 0.5; the frame's mean luminance (0-255); the
lowest map-text contrast as rendered.

| view @ factor (eye's height, true metres) | H0 today: luminance, lowest contrast | H1 (10 km): at target, mean, > 0.5; luminance; contrast | H2 (20 km): the same | H3 (10 km beyond the focus): the same |
|---|---|---|---|---|
| overview-plan @1x (26,933) | 36.6, 8.42 | 0.13, 0.14, 0; 63.1; 8.19 | 0.07, 0.07, 0; 47.9; 8.28 | - |
| overview-plan @4x (6,929) | 36.4, 8.42 | 0.14, 0.22, 0; 79.8; 8.19 | 0.07, 0.12, 0; 58.3; 8.27 | 0, 0.14, 0; 63.4; 8.35 |
| overview-plan @10.33x (2,844) | 36.7, 8.42 | 0.19, 0.41, 0.29; 109.2; 8.16 | 0.10, 0.24, 0; 82.0; 8.27 | - |
| ph8-overview-study @4x (8,667) | 35.4, 8.56 | 0.14, 0.20, 0; 66.3; 8.41 | 0.07, 0.11, 0; 46.7; 8.55 | 0, 0.12, 0; 51.2; 8.62 |
| overview-field @4x (1,730) | 63.8, 8.55 | 0.70, 0.77, 1.00; 144.8; 7.59 | 0.45, 0.54, 0.53; 125.4; 7.83 | 0, 0.38, 0.43; 96.1; 7.76 |
| close-sokolnitz @1x (1,723) | 76.5, 7.89 | 0.30, 0.34, 0.12; 108.3; 7.81 | 0.16, 0.19, 0; 95.9; 7.82 | - |
| close-sokolnitz @4x (602) | 75.9, 8.01 | 0.55, 0.58, 0.63; 124.2; 7.77 | 0.33, 0.36, 0.18; 109.2; 7.85 | 0, 0.20, 0.19; 91.5; 7.85 |
| close-sokolnitz @10.33x (373) | 81.0, 8.02 | 0.64, 0.64, 0.77; 128.8; 7.77 | 0.40, 0.42, 0.29; 114.8; 7.85 | - |
| pratzen-low @1x (1,624) | 68.9, 8.76 | 0.32, 0.49, 0.37; 122.6; 7.76 | 0.18, 0.32, 0.17; 105.2; 8.02 | - |
| pratzen-low @4x (590) | 73.3, 12.11 | 0.60, 0.74, 0.92; 144.3; 11.52 | 0.37, 0.54, 0.46; 128.8; 11.76 | 0, 0.40, 0.41; 106.7; 11.65 |
| pratzen-low @10.33x (378) | 91.4, 7.83 | 0.69, 0.85, 1.00; 153.8; 7.49 | 0.45, 0.67, 0.70; 143.5; 7.58 | - |

In every candidate and view: 0 solid near-black blocks, 0 map texts below AA, the same drops as today (within `DROP_LIMIT`), the
layer's pass at most 1.2 ms. **Frame cost** (the world pass once compiled, software WebGL; `fog-probe.js --only cost`, each candidate on a fresh page, 5 frames to warm up, the median of 15): the Field vantage at 08:00 H0 4,093 ms, H1 4,112,
the valley fog 3,904; the low Pratzen view at 08:30 3,947, 4,163, 3,807; the fitted Overview 3,345, 3,322, 3,188. The candidates are
within -5% to +5% of today's in each view, which is the noise of this measure. The absolute times are not usable: on these fresh
pages every frame took 3-4 s, three orders of magnitude more than the same views' 6-8 ms in `light-probe.js` (and an earlier
attempt that compiled every candidate on one page slowed H0 itself from 29 to 273 ms); the cause was not found. Derived instead:
the haze adds two exponentials and about 30 arithmetic operations per fogged fragment, the valley layer two more exponentials; the
cost belongs on a GPU in 4C's report.

Reading (derived):
- **A haze in the true geometry fixes the Overview without a shift**: from the fitted Overview (the eye 6.9-8.7 km up at 4x) the
  line of sight crosses little air of the haze's height, so the field is hazed 0.14-0.22 on average at 10 km and half that at 20,
  near today's look with its shift (0.014-0.048) and far from today's without it (0.17-0.49), and it does so by the same rule that
  hazes a low view's horizon.
- **But counted from the eye it hazes the subject in the low and close views** (H1 0.55-0.70 at the target at 4x; the frame's
  luminance doubles): the visitor's eye is a camera 0.4-1.7 km above the ground and 3.6-15 km from its subject, not an observer on
  the field, and a true 10 km visibility over that distance is heavy. 20 km halves it and is still 0.33-0.45 at the target.
- **Counted beyond the focus (H3)** the subject is clear in every view by construction and the haze grows behind it: the mean
  over the ground is 0.12-0.40, the share above 0.5 at most 0.43 (all of it behind the subject), the frame's luminance 16-33 above
  today's (whose fog does almost nothing in these views), the lowest contrast 7.76. In the Overviews it is a little less than
  H1's (0.12-0.14 against 0.20-0.22). H3's haze can never exceed H1's at the same point (it counts part of the same path).
- The exaggeration matters: at 10.33x the drawn eye stands lower in true metres (the presets keep their height above the drawn
  ground), so the same view is hazier than at 1x.

### B.3 Design (recommendation)

1. **One atmosphere in the fog chunks**, replacing `THREE.Fog`'s linear near and far and Stage 3D's `fogShift`: the exponential
   haze of B.2, computed in the true geometry (heights in metres through `GEOREF`, the vertical divided by the display factor), its
   density falling with height (scale height 400 m above the valley floor's 200 m), **counted beyond the orbit target's distance**
   (H3; on the paper map no haze, as today's `staff` preset's 600-2,000 near and far amount to none). One parameter, the
   visibility at the valley floor, from the light table (§A.5), so dawn and dusk can be hazier than noon; its values are design
   values and the sources sheet says so ("the haze is a depth cue; the day's visibility is not recorded in this reconstruction").
2. **The sky meets the haze**: the dome's horizon colour is the haze's colour at the horizon, so the apron's edge and the dome
   meet without a band (§F.2).
3. **The haze sheet goes** (the broad mist sheet "so the far ground recedes"), its job done by the haze; the valley fog is §C.
4. **Cost**: one exponential pair per fragment for the haze; the chunk is one place (`THREE.ShaderChunk` before any material
   compiles), shared by every fogged material, sprites included.

### B.4 What must hold

Existing: every threshold of every harness view (darkness, contrast as rendered, drops, pass time, unobstructed, floor); the
phase-8 Overview's arrow heads; the fitted Overview naming its corps and armies (decision 63); the paper map identical at every
relief setting. New:
- **Self-test, the haze:** at the orbit target the haze is 0 in every vantage at every factor (beyond-the-focus rule); over the
  drawn ground in the free rectangle of the fitted Overview its mean is at most 0.25 at 4x (H3 measured 0.12-0.14) and at most 0.45
  at 1x and 10.33x (H1, from the eye, measured 0.14 and 0.41 there; H3 cannot exceed it); today's look with the shift is 0.05,
  without it 0.49; the paper map draws none.
- **Self-test, no shift:** `fogShift` is gone and the haze is a function of the eye, the target and the point only (the same view
  from 274 and 536 units has the same haze at the target: 0).
- **Harness:** the luminance of the free rectangle's ground in each landscape view within ±15 of today's (so the palette and the
  grade are retuned with the haze, not around it), and the map text's contrast as rendered at AA, as now.

## C. The valley fog

### C.1 Today (fact)

- **Twenty mist sheets and one haze sheet** (`buildMist`, `world.js:1797-1830`): flat textured squares 44-68 units across, 1.5
  units above the drawn ground at their centres, placed "dense along the Goldbach and the meres, thinner on the open ground, nothing
  on the crest"; each vertex's alpha falls to nothing where the ground rises to the sheet (`mistSheet`, Stage 0), and they drift
  0.8 units side to side (`MIST_DRIFT`; off under reduced motion and in the harness). Their opacity is the phase's `mist` × 0.55
  (the haze sheet × 0.26), their colour the preset's `mistC`, interpolated over 2.6 s at a phase change (`app.js:1677-1683`).
- **`PHASES[].mist`** (guarded data, `data.js:57-131`): 1.0, 0.98, 0.90 (phases 0-2, to 08:45), 0.16, 0.05 (phases 3-4), 0, 0, 0
  (5-7), 0.22, 0.30 (8-9). The sheets are drawn while it exceeds 0.012.
- **The Command view reads it** (`knowledgeOf`, `app.js:2300-2320`, guarded): to the commander whose view it is, an enemy formation
  in line of sight is "uncertain" while the phase's `mist` exceeds 0.5 and the formation stands below model height -0.8, that is
  below 238.2 m (derived). So in phases 0-2 the model already has a fog with a top at 238.2 m that lifts at 08:45.
- **The harness checks** the sheets' edges: no sheet visible where the ground rises through it (alpha at most 0.02 at the
  crossing, `measure.js` `mistEdge`).

### C.2 What the app's own texts say (fact; quoted, with their basis)

| text | where | basis given |
|---|---|---|
| "Fog fills the Goldbach valley. Soult's two assault divisions are standing in it, invisible from the heights." | phase 0's lede, `data.js:52` | none (the narrative) |
| "Standing in fog behind Puntowitz, hidden from the plateau" | Saint-Hilaire's track, phase 0, `data.js:189` | none |
| "c. 08:45 Soult's divisions advance. The mist lifts off the heights." | phase 3's timeline, `data.js:78` | quoted as the evidence of Saint-Hilaire's, Vandamme's and Levasseur's departures: "app narrative, unsourced" (`data.js:191`, `209`, `364`) |
| "Saint-Hilaire and Vandamme climb out of the fog into sunlight on ground the Allies have just vacated." | phase 3's lede, `data.js:76` | none |
| "Its valley held the fog that hid Soult's two divisions until they stepped onto the plateau" | the Goldbach's feature, `data.js:653` | none |
| "The crest of the Pratzen, once the mist lifted, and the 4th Column still on it." / "That two French divisions were standing in the Goldbach valley. The fog in the valley hid them." | the command knowledge (what the French saw, phase 3; what the Allies did not know), `analysis.js:77`, `94` | marked "doc" (documented) in the app's own taxonomy, with no source named |
| "on the morning of the battle the valley lay in fog, and it was the fog that hid Soult's divisions forming at the foot of the slope." | tour stop 5, `analysis.js:359` | none (the caveat to the viewshed reading) |

Reading: the texts agree with one another: fog in the Goldbach valley from the night; Soult's divisions hidden in it; the mist
off the heights about 08:45, when the divisions climbed out of the fog into sunlight. They say nothing of the fog's depth, of when
the valley cleared, or of any fog later in the day. `SOURCE_NOTE` names no source for the weather (its `refs` cover the order of
battle, the Pratzeberg narrative and the meres' figures). In the evidence layer's terms the fog is the app's narrative, followed
by the reconstruction, not a documented observation with a source; §C.5's label says so.

### C.3 The model's elevations (derived; `fog-probe.js --only model`)

Model elevations (metres, `GEOREF.elevM` of the model height) at 08:00 of the 29 drawn leaf formations: French, Saint-Hilaire 213,
Vandamme 226, Legrand 206, Friant 227, Bourcier 225, Caffarelli 238, Nansouty 235, d'Hautpoul 227, Drouet 221, Suchet 263,
Kellermann 244, Walther 245, Rivaud 246, the Guard 246, the grenadiers 248, the Santon 296, Napoleon's headquarters (the Zuran)
290; Allied, Kienmayer 208, Dokhturov 216, Przybyszewski 233, the Russian Guard's infantry 229 and cavalry 242, Kamensky 240,
Miloradovich 248, Kollowrath 280, Liechtenstein 288, Bagration 268, Allied headquarters 265. Places: the Goldbach at Puntowitz
214, Sokolnitz 207, Telnitz 197, Pratzen 245, the Pratzeberg 324, Stare Vinohrady 295, the Zuran 290. The model reproduces the
sourced elevations of the nine places that have one within 5 m (Augezd 190 against 195; the others within 2).

| fog top (m) | formations under it at 08:00, French (men) | Allied (men) |
|---|---|---|
| 220 | 2 (13,600) | 2 (20,290) |
| 230 | 7 (32,900) | 3 (27,020) |
| **238.2** (the knowledge model's) | **9 (41,200): Saint-Hilaire, Vandamme, Legrand, Friant, Bourcier, Caffarelli, Nansouty, d'Hautpoul, Drouet** | **4 (34,720): Kienmayer, Dokhturov, Przybyszewski, the Russian Guard's infantry** |
| 250 | 15 (62,300) | 7 (47,470) |
| 260 | 15 (62,300) | 7 (47,470) |
| 280 | 16 (68,300) | 9 (61,170) |

Reading (derived): a top at 238.2 m holds both of Soult's assault divisions (213 and 226 m) and leaves the Zuran (290), the
plateau's columns (Kollowrath 280, Liechtenstein 288, Miloradovich 248) and both headquarters above it, which is what the texts
describe; it also puts the Allied columns already down in the valley (Kienmayer, Dokhturov, Przybyszewski) in it, of which the texts
say nothing either way. At 05:00 Vandamme stands at 235 m, 3 m under the top. A top at 250-260 m would also take in the French
reserve (Rivaud, Walther, the Guard, the grenadiers at 245-248) and Miloradovich, for which there is no text.

### C.4 The valley fog rendered (fact; `fog-probe.js --only render,focus`, `fog-sheet.jpg`)

The same chunks as §B.2, with a second layer: uniform below the top, a 15 m soft edge above it, 200 m visibility inside it, its
colour the preset's mist colour, drawn at most 85% opaque (V238, V260) or 55% (V55, with the H3 haze); the mist sheets hidden. At
08:00-08:30 at 4x: the fog over the drawn ground in the free rectangle (mean; share above 0.5), the drawn formations whose figures
stand under the top, the frame's luminance, the lowest contrast.

| view @ factor (clock) | today (sheets): luminance, contrast | V238 (85%): mean, > 0.5; formations under; luminance; contrast | V260 (85%) | V55 (238.2 m, 55%, H3) |
|---|---|---|---|---|
| overview-field @4x (08:00) | 87.8, 8.02 | 0.70, 0.83; 15 of 31; 164.0; 7.31 | 0.83, 0.97; 24 of 31; 168.8; 7.31 | 0.28, 0.41; 15 of 31; 101.9; 7.49 |
| close-sokolnitz @4x (08:20) | 75.9, 8.01 | 0.84, 0.99; 15 of 31; 166.4; 7.40 | 0.85, 1.00; 25 of 31; 169.4; 7.40 | - |
| pratzen-low @4x (08:30) | 87.9, 8.56 | 0.80, 0.94; 15 of 31; 165.4; 7.31 | 0.84, 0.98; 25 of 31; 168.5; 7.31 | 0.32, 0.57; 15 of 31; 113.5; 7.42 |
| close-sokolnitz @1x / @10.33x (08:20) | 76.5, 7.89 / 81.0, 8.02 | 0.66, 0.72 / 0.85, 1.00; 154.4 / 171.4 | 0.81, 0.99 / 0.85, 1.00 | - |
| pratzen-low @1x / @10.33x (08:30) | 83.2, 8.77 / 100.2, 8.49 | 0.63, 0.69 / 0.82, 0.96; 155.4 / 165.9 | 0.80, 0.95 / 0.84, 0.99 | - |

In every case: 0 solid near-black blocks, 0 map texts below AA, the same drops as the view without fog. The formations count is
of drawn leaf formations' blocks (31 at 08:00 with aggregates' own blocks).

Reading (derived): drawn to the knowledge model's top the fog covers most of the field's drawn ground at 08:00 (the valley and
the low ground west of the plateau are most of it), and at 85% it whites out the formations in it: the counters and names (the
map layer, DOM) stay on top and legible, but the figures do not (`fog-sheet.jpg`). That is what "invisible from the heights"
means for an Allied officer; it is not what the visitor needs to follow the battle. At 55% (V55, with the beyond-the-focus haze) the fog over the ground averages 0.28-0.32, the frame's luminance is 102-114 (today's sheets 88), the figures in it show as shapes, and the lowest contrast is 7.42.

### C.5 Design (recommendation)

1. **The valley fog is drawn from the model's own fog**: a layer in the atmosphere's chunk (§B.3) with its top at the knowledge
   model's threshold, 238.2 m (`hAt` -0.8, derived), at the factor's drawn height, so the picture and the Command view's reading
   agree. Its density follows `PHASES[].mist` (read, not changed), continuously in the clock: while the phase's `mist` exceeds 0.5
   (to 08:45) the layer is whole; it thins over the first minutes after 08:45 ("the mist lifts off the heights": the top first
   sinks, so the heights clear before the valley, as the texts have Soult climb out of the fog into sunlight) and follows the data's
   0.16 and 0.05 through phases 3 and 4 (question 6 asks about 0.22 and 0.30 in phases 8 and 9).
2. **Drawn at most about 55% opaque** (question 5): the formations under it stay visible as shapes in a white ground, the counters
   and names stay on top; the fog's meaning (who could not see whom) is the Command view's, which is unchanged.
3. **Labelled.** The legend (contextual: only while the fog is drawn) and the sources sheet: "Valley fog: as the narrative gives
   it (in the Goldbach valley until about 08:45; off the heights first). Its top is drawn at 238 m, where the Command view's
   reading treats ground as fogged; its depth and its lifting are modelled, not recorded." This is the roadmap's "documented versus
   modelled marked": nothing in it is documented in this project's evidence layer (§C.2).
4. **The mist sheets go** with the haze sheet; the sheet-edge check is replaced (§C.6). Their drift goes with them; the layer has
   no motion of its own (it follows the clock), so reduced motion needs nothing more.
5. **Not in Stage 4:** the fog as a reading (line of sight through fog, "Whose eyes?") is Stage 5; the knowledge rule, the
   viewshed and line of sight are guarded and unchanged.

### C.6 What must hold

Existing: every harness threshold; the Command view's readings (`runtime-test.js`, `terrain-test.js`, `sim-test.js` unchanged);
the sheet-edge check stays while sheets exist. New:
- **Self-test, the fog's top:** at 08:00, 08:30 and 08:44, at each factor, a ground point drawn 1 m (true) below 238.2 m is fogged
  and one 20 m above it is not (along a vertical ray from above), and the knowledge model's "uncertain" set equals the set of
  enemy formations in line of sight under the drawn top: one threshold, read from one place.
- **Self-test, the lifting:** the fog's amount over the day is continuous in the clock (no step at a phase boundary), whole while
  `PHASES[].mist` > 0.5, and at 09:30 not more than `PHASES[4].mist` allows.
- **Harness:** a view at 08:00 (the Field vantage) and the low Pratzen view at 08:30 as new cases, with every threshold of their
  kind, the figures under the fog still drawn (not culled) and the fog at most its cap.

## D. Pacing

### D.1 The clock as it plays (fact; `node tools/stage4/pace-probe.js`, `docs/stage4-evidence/pace-probe.json`)

- **The constants** (`app.js:1380-1383`, `5064-5069`, `shell.html:212-215`): the clock runs `MIN_PER_SEC` = 10 clock minutes a
  second at 1x; the speed buttons are ½×, 1× (the default, `speed=1`), 2× and 4×; the frame step is capped at 120 ms. A phase change
  starts the light's and the overlays' transition and, with Follow on, the camera's glide to the phase's view, over `TRANS_MS` =
  2,600 ms of real time whatever the speed.
- **Durations**: the day (04:00-18:00, 840 clock minutes) plays in 168 s at ½×, 84 s at 1×, 42 s at 2×, 21 s at 4×.

| phase | minutes | seconds at ½× / 1× / 2× / 4× | the glide's share of the phase at 1× | events starting in it | of them, inside the glide at 1× |
|---|---|---|---|---|---|
| 0 Deployment | 180 | 36 / 18 / 9 / 4.5 | (no glide at 04:00) | 3 | - |
| 1 Telnitz | 60 | 12 / 6 / 3 / 1.5 | 43% | 2 | telnitz |
| 2 Sokolnitz | 45 | 9 / 4.5 / 2.3 / 1.1 | 58% | 3 | sokolnitz, decision |
| 3 The Pratzen | 45 | 9 / 4.5 / 2.3 / 1.1 | 58% | 3 | soult, pratzen-village |
| 4 Pratzeberg | 60 | 12 / 6 / 3 / 1.5 | 43% | 1 | kamensky |
| 5 Olmutz road | 45 | 9 / 4.5 / 2.3 / 1.1 | 58% | 3 | kursk |
| 6 The Guard | 90 | 18 / 9 / 4.5 / 2.3 | 29% | 5 | blasowitz, guard-broken, buxhowden-blind |
| 7 The wheel | 105 | 21 / 10.5 / 5.3 / 2.6 | 25% | 2 | wheel |
| 8 The ponds | 150 | 30 / 15 / 7.5 / 3.8 | 17% | 3 | augezd |
| 9 Reckoning | 60 | 12 / 6 / 3 / 1.5 | 43% | 0 | - |

Reading (derived): 12 of the 22 events after phase 0 start while the camera is still gliding to their phase's view; at 1x
the Pratzen assault (phase 3) is 4.5 s, of which 2.6 s is the glide. The 25 events start at 22 distinct minutes.

### D.2 Two camera rules over the day (fact; the same probe)

Study at 1600 x 900, the default factor, Follow on, the clock stepped one minute at a time. **Today**: at each phase boundary the
eye glides to the phase's authored view over `TRANS_MS` (through the app's own `presetFrame`, `setupArc`, `applyArc`). **Follow**
(the candidate): the target eased toward the weighted centre of the live events (`liveEvents`, the app's weights) with a 1.5 s
time constant of real time; the distance eased toward 2.4 times their weighted radius plus 70 units (86-274); the direction eased
toward the current phase's authored view; the floor applied.

| rule @ speed | minutes with every live event (weight ≥ 0.5) inside the free rectangle | live event-minutes inside it | the ground's speed across the screen, px/s: median / 95th / largest | floor clamps; lowest clearance | drops every 10 minutes: mean / largest |
|---|---|---|---|---|---|
| today @1× | 73.1% | 77.9% | 0 / 304 / 791 | 0; 36.6 | 5.94 / 19 |
| follow @1× | 83.4% | 90.3% | 52 / 146 / 267 | 0; 29.4 | 6.16 / 19 |
| today @½× | 71.1% | 76.4% | 0 / 148 / 748 | 0; 36.6 | 5.87 / 17 |
| follow @½× | 87.6% | 92.8% | 24 / 102 / 286 | 0; 27.6 | 6.27 / 19 |

Reading (derived): the continuous rule keeps the live events in the free part of the screen for 10-17 more points of the day,
never needs the floor, and moves the picture all the time instead of in nine jumps (today's glides peak at 750-790 px/s; the
follow's 95th percentile is 102-146 px/s). The map layer drops about as many items (the same largest count, 19, which is today's
too, at 08:10-08:50 in the Sokolnitz and Pratzen phases; the mean 0.2-0.4 higher). These are the candidate's numbers with one set
of constants, not a tuned design.

### D.3 Design (recommendation)

1. **A slower default.** Play starts at ½× (5 clock minutes a second; the day in 2 min 48 s before dwells); the buttons stay
   (½×, 1×, 2×, 4×) and keep their meaning, so the sources sheet's sentence on the slow frame (1.2 minutes at normal speed) stays
   true of 1×; its "normal speed" becomes "1×" (decision 56's text, a `SOURCE_NOTE` change: a data task; question 9).
2. **Dwell at each event.** While playing, at each event's start (22 distinct minutes) the clock eases down to a stop over 0.5 s,
   holds 1.5 s with the event's marker lit and its name in the caption, and eases back over 0.5 s: about 2.5 s a dwell, 55 s over
   the day, which at ½× plays in about 3 min 45 s (derived); the Pratzen assault (phase 3, three event starts) in about 16.5 s
   instead of 4.5. Scrubbing, the keys, the phase and act buttons and the tour never dwell. The dwell is time, not motion: it stays
   under reduced motion. A toggle in the layers panel ("Pause briefly at events", on) turns it off (question 8).
3. **Continuous follow while playing.** With Follow on and the clock playing, the camera follows the action by the rule of
   §D.2 (live events' weighted centre, distance holding their spread, the phase's authored direction), eased in real time; the
   phase boundary's glide is not used while playing. When the clock stops, the view stays; a phase or act button, a vantage, a
   theme or a tour stop still glides to its authored view (decision 47 unchanged: any pan, orbit, zoom or double-click turns
   Follow off). The ground's speed across the screen is capped (150 px/s at the free centre) by slowing the ease, not by
   jumping. Under reduced motion the follow moves only at each event's start, at once (no glide), as today's glides do.
4. **Arrows that draw on with the clock** (opportunity 4), for the 17 arrows derived from an executed leg only: the drawn length is
   the leg's progress at the clock (`legWindow`, read, not changed), the head at the tip; before the leg starts the arrow is not
   drawn, after it ends it is whole, as today. The 19 interpretive and other arrows keep today's fade at the phase change. Under
   reduced motion every arrow is drawn whole at once.
5. **Not done:** no animation of losses (the model plots formations, not casualties), nothing that suggests mass drowning at the
   meres (opportunity 4), no change to where any formation is at any clock.

### D.4 What must hold

Existing: Follow's state equal to `!freeCam` after every path (decision 47, the self-test); the camera floor on every path at
every factor; the slider's keys and the event markers by real key presses; Space and Enter on a focused button; ← → on a focused
button leave the clock; the relief control disabled while playing (decision 56); `binding-test.js` (every arrow bound to the
tracks, the dash rule); drops within `DROP_LIMIT` in every harness view.

New:
- **Self-test, the day under follow** at 1x, 4x and 10.33x: no floor violation; every live event of weight ≥ 0.5 inside the free
  rectangle in at least 80% of the day's minutes; the ground's speed across the screen never above the cap; the map layer's drops
  every 10 minutes never above today's rule's largest (19).
- **Self-test, dwell:** a dry run of the day at ½× takes its computed length within 1 s (no dwell skipped, none doubled); a scrub
  across an event does not dwell; reduced motion keeps the dwell and moves the camera only at event starts.
- **Self-test, draw-on:** at 20 clocks inside each derived arrow's leg, the drawn tip lies on the leg's path at the leg's progress
  within 0.5 units; `binding-test.js` extended to assert that only derived arrows draw on.
- **Harness:** Play by a real key press runs at ½× (the speed button pressed), and the Watch view at the phase-3 Pratzen moment
  during a dwell keeps every threshold of its view.

## E. Smoke

### E.1 Today (fact; `app.js:1130-1147`, `3382`, `3460-3474`; `node tools/stage4/extras-probe.js`, `docs/stage4-evidence/extras-probe.json`)

- One smoke sprite per leaf formation, 8-18 units across by strength, its texture ten soft puffs that fade to nothing at every edge
  (Stage 0; the harness checks the edge), drifting 0.8 units; drawn while the formation's **phase status** is one of `FIGHTING`
  (attacking, engaged, charging, counterattack, repulsed, encircled, broken), it stands on the field, the ground is the landscape
  and it is not dimmed; it fades in and out over a few frames. Dust: one sprite per mounted or artillery formation on the move.
  Sprites stand above the drawn ground (`spriteFloor`); they are not soft against the ground or the figures.
- **On screen** (the sum of the sprites' projected squares over the free rectangle, overlaps counted twice): the Field vantage 11
  smoke sprites, 8.7%; the fitted Overviews 1-2%; **close-sokolnitz 7 sprites, 53%; pratzen-low 11, 41% (42% at 1x, 27% at
  10.33x)**; the selected views 2-4%.
- **Over the day** (every 5 clock minutes): smoke is drawn in 120 of 169 samples, 1,083 formation-samples in all; **only 300 (28%)
  belong to a formation (or its parent) that a live event of weight ≥ 0.5 names**. By phase: phase 6 (the Guard) 72%, phase 2 37%,
  phase 1 29%, phase 3 26%, phase 7 20%, phase 4 11%, phase 5 7%, phase 8 (the ponds) 5%. Smoke switches at phase boundaries; within a phase it does not change.
- **Soft particles** need the scene's depth. A depth pre-pass of the world at the scene target's size (2,080 x 1,170) costs 2.0-8.1
  ms in the probe against the world pass's 6-8 ms median (software WebGL; §A.4): roughly half again the world pass.

### E.2 Design (recommendation)

1. **Smoke follows the clock and the engagement, from the data as it is.** A formation smokes while its phase status is a fighting
   one (as today: the record of who fought in the phase), with an amount that follows the clock: full inside the window of any
   event that names it or its parent (`EVENTS[].forms`, `evWeight`'s own lead and tail), a low residue otherwise, eased so nothing
   steps at a phase boundary. No new event, status or window is invented; where the two disagree (72% of the day's smoking samples
   are not named by a live event) the smoke is thin, not absent (question 10).
2. **Soft without a depth pass.** Each formation's smoke becomes a few smaller puffs along its front (the frontage the model draws),
   each kept clear of the drawn ground and the figures (`spriteFloor`, as today) and fading toward its lower edge, so no puff cuts
   into a slope; this is what "soft-particle" buys here, at no extra pass. A depth pre-pass (true soft particles) is not recommended
   on the measured cost; 4E may try it on a GPU and report.
3. **A cap on screen**: in a close view the smoke may not cover more than a quarter of the free rectangle (today 53% and 41% in the
   close and low views), thinned with distance to the eye rather than culled, so the formations it belongs to stay legible.
4. **Not done:** no animation of losses; no smoke on the ice at the meres beyond the formations' own (the guns' fire onto the ice,
   `ice`, is an event, drawn as its glyph).

### E.3 What must hold

Existing: the sprites fade to nothing at every edge (the harness); every threshold in every view. New: self-test, at 20 clocks, a
formation smokes only with a fighting phase status and is at full amount only inside a naming event's window; no puff's lower edge
below the drawn ground; harness, the smoke's share of the free rectangle at most 25% in every landscape view.

## F. Ice, and the horizon

### F.1 The meres (fact, then recommendation)

- Today: two ellipses of an ice material (`world.js:1162-1170`, `#4E5C66`, roughness 0.58, opacity 0.96, flat-shaded), at a level
  kept under their own drawn edge; the legend says "meres: pond outlines schematic" (decision 27). The data calls the Satschan mere
  "frozen on 2 December" (`data.js:711`); the phase-8 texts have French guns fire "down on the ice" and some formations break "south
  across the frozen water".
- On screen (`extras-probe.js`): both meres inside the free rectangle in the fitted Overviews; the Satschan mere in the Field
  vantage and in a third of the Sokolnitz close view; neither in the other harness views.
- **Recommendation:** the ice's surface only (decision 27: never the outline): a smoother, slightly reflective ice that takes the
  computed sun's sheen and the sky (roughness lowered, the environment map's weight raised), a lighter rim where the shore ice
  meets the bank, matte where the formations cross. No cracking, breaking or figures in the water; nothing that suggests mass
  drowning (opportunity 4); no snow (no text in the app mentions it). Check: the meres' level stays under their edge at every
  factor (Stage 2B's rule), and the legend row stays.

### F.2 The horizon (fact, then recommendation)

- Today (fact): the camera's far plane is 1,900 units; the apron runs about 54 and 48 km from the field's centre along the map's axes; the
  dome, a sphere of radius 1,400 about the origin (`world.js:468-475`), draws the sky, repainted from the preset's three sky colours
  with the fog's colour at and below its equator (`paintSky`, `app.js:186-202`).
- Measured (`extras-probe.js --horizon-only`): the true horizon is on screen only in the low views (the low Pratzen view at 1x,
  4x and 10.33x: 6, 79 and 232 px from the top); there the apron's far edge, 60-78 km away, stands 35-37 px below it, and today's
  fog is 0.90-1.00 at the edge, so the edge is mostly hidden. In the Field vantage the horizon is just above the screen and the
  apron's edge, 59-88 km away, shows near the top at a fog of 0.72-1.00: partly visible. In the Overviews the horizon is far above
  the screen (the edge's fog 0.02-0.16).

- **Recommendation:** no ring of distant relief (it would be geographic data without a source: a data task, §0.3 item 9). The
  horizon is the atmosphere's: the haze of §B.3 at the horizon matches the dome's lowest colour, and the dome's gradient becomes a
  function of the light table (§A.5), so the apron's edge, where it shows, sinks into the haze. Check: in the low views the gap
  between the apron's edge and the true horizon, if any, is drawn in the haze's colour (a pixel test along the horizon row).

## G. The palette, and the 3D colours (assigned by the records)

### G.1 Today (fact)

- The natural ground's eight class colours (`COVER_COL.natural`, `world.js:646-650`, "the palette's own: Stage 4's to change")
  and the paper map's (`COVER_COL.paper`) are uploaded to the ground shader as `uPal` (`groundPal`, `world.js:1022`); the shader
  adds the elevation tint, the field pattern, the damp and trodden ground, the hollows, the frost and the baked hillshade.
- `docs/VISUAL_SPEC.md` appendix A lists the colour literals Stage 1 left to Stage 4, with file and line as they then stood:
  lighting, sky, fog and sun (70 values, 85 occurrences: `LIGHT`, the hemisphere and fill lights, the dome's gradient), smoke,
  dust, mist and sprite textures (11, 13), terrain, water, vegetation, buildings and contours (72, 79). `tokens.js` is "the only
  source of interface and symbology colours" (`CLAUDE.md`); these are neither, except the paper map's ground, which is the
  paper map's symbology (its woods and villages are already in `TOKENS.sym.paperMap`).
- The palette was chosen under today's presets. Under the corrected sun the landscape is lighter where the presets' sun was lower
  than the corrected one (the Field vantage at 09:30 and 4x: mean luminance 63.8 today, 68.7 corrected; §A.4), and the sweep
  shows the same through the day.

### G.2 Design (recommendation)

- **Where the colours live.** The paper map's ground colours move into `TOKENS.sym.paperMap` (symbology, beside its woods and
  villages, so `check:contrast` and the legend read one table). The landscape's colours (the light table of §A.5, the sky, the
  haze, the mist, smoke and dust, the terrain classes, water, vegetation and buildings) stay with the code that draws them, in
  one named table each, not as scattered literals: one light table in `app.js` (keyed by the sun's altitude, §A.5), one ground
  palette in `world.js` (`COVER_COL`), one sprite palette. This keeps the rule that `tokens.js` is the interface's and the
  symbology's, and it puts appendix A's 153 values in four tables (question 12).
- **What changes in the palette.** Only what the new light needs, measured: the natural classes' brightness is re-balanced so the
  Field vantage's median luminance through the day stays within today's range (the sweep, §A.4) and no class falls under the
  near-black measure without the toe. The hues are not changed: the cover classes' distinctness is Stage 2F's (each class's edge
  within 20 m of the model's, the self-test), and the going layer's and the legend's colours are tokens (Stage 1).
- **Not in Stage 4:** the uniforms, flags and figure coats (Stage 6); the going layer and the analysis lines (tokens, Stage 1).

### G.3 What must hold

`check:contrast` (every state), the map text's contrast as rendered in every harness view, Stage 2F's cover checks (the drawn
edges, the classes identical at every setting), the paper map identical at every relief setting, `css-test.js` and the token
drift check (`build.py --tokens`). New: a static check that the landscape's light, sky, haze, mist and sprite colours are read
from their tables (no colour literal outside them in the drawing code that 4B-4E touch).

## H. Test plan

### H.1 The thresholds each recommended change touches (measured in this part)

| change | darkness (Stage 0, solid near-black ≤ 0.05%) | map text as rendered (AA) | unobstructed fraction | drops (`DROP_LIMIT`) | layer pass (< 8 ms) | frame cost (world pass, software) | camera floor |
|---|---|---|---|---|---|---|---|
| corrected sun, no toe (E) | 3 views at 4x over (§A.4) | 0 below; lowest 6.49, at most 0.39 lower than today | unchanged (identical before and after) | unchanged in every view | ≤ 1.7 ms | no difference beyond noise (6.1-7.8 ms medians) | untouched (clearance identical) |
| + the fill opposite the sun (H) | worst 4 blocks, 0.02% (§A.4b) | not measured with H (the ground lighter only in shade) | unchanged | unchanged | - | not measured (one existing light turned and raised; no new light) | untouched |
| no baked hillshade (G) | as E (within 0.04 point) | as E | unchanged | unchanged | ≤ 1.7 ms | none | untouched |
| haze beyond the focus (H3) | 0 blocks in every view tried | 0 below; lowest 7.76 | unchanged | unchanged | ≤ 1.2 ms | within ±5% of today's (software; §B.2) | untouched |
| valley fog at 238.2 m, 55% (V55) | 0 blocks | 0 below; lowest 7.42 | unchanged | unchanged | ≤ 1.2 ms | within ±5% of today's (software; §B.2) | untouched (the fog is not geometry) |
| continuous follow (§D.2) | not measured along the day (the light is per view) | not measured along the day | unchanged (no panel) | largest along the day 19, as today's rule | - | the frame draws every frame while playing, as today | 0 clamps, lowest clearance 27.6 |
| smoke cap, ice surface, horizon | not measured (4E) | not measured (4E) | unchanged (no panel) | not measured (4E) | - | not measured; the design adds no pass (a depth pre-pass measured at 2.0-8.1 ms, §E.1, is not recommended) | untouched |

### H.2 Checks that stay, unchanged (every part)

`npm test` (the nine suites and the height guard: no presentation code reads `height()`/`hAt()`; any new call site classified),
`check:data` (113 declarations identical to `archive/spine-6b2cccd4.html`: Stage 4 changes no guarded declaration unless the owner
answers question 6 or 9 with a data task), `check:chronology` (0 errors; pacing changes how fast the clock runs, never a timing),
`check:contrast` (28 states; a state is added only if a part adds one), `check:visual` (every view's thresholds; the drop limits and
the unobstructed baselines never raised or lowered by Stage 4), `check:baseline` moved by each part that changes the build.

### H.3 New checks, by part (from §A.6, §B.4, §C.6, §D.4, §E.3, §F, §G.3)

| part | self-test (in `app.js`) | harness (`tools/visual`) | suites |
|---|---|---|---|
| 4B light | the drawn light equals `sunAt` (azimuth) and its corrected altitude, within 0.1 degree, at 40 clocks and each factor; the disc only between sunrise and sunset; no step at a phase boundary (a one-minute step never larger than the largest within a phase); the shadow frustum covers the free rectangle's ground | the sweep (the Field vantage and the low Pratzen view, 4x, 08:00-16:00 hourly) and the four multi-factor views at 1x and 10.33x within the Stage 0 limit, without the toe | `css-test.js`: the composite has no toe; `runtime-test.js`: the light table read, no `LIGHT[ph.light]` on the landscape |
| 4C atmosphere | the haze 0 at the target from every vantage at each factor; the fitted Overview's mean haze ≤ 0.25; no haze on the paper map; `fogShift` gone; the fog's top at 238.2 m (a point 1 m under is fogged, 20 m over is not) and its set equal to the knowledge model's "uncertain" set; the fog's amount continuous in the clock | two new views: the Field vantage at 08:00 and the low Pratzen view at 08:30, every threshold of their kind; the free rectangle's ground luminance within ±15 of today's in every landscape view | `terrain-test.js`, `runtime-test.js` unchanged (the knowledge rule and the viewshed) |
| 4D pacing | the day under follow at each factor (no floor violation; live events in the free rectangle ≥ 80% of minutes; the screen speed ≤ the cap; drops ≤ 19); the dwell's day length within 1 s, no dwell on scrubbing, the dwell kept under reduced motion; the draw-on tip on the leg's path within 0.5 units | Play by a real key press starts at ½×; Space, Enter, ← → as today; a Watch view during a dwell keeps its thresholds | `binding-test.js`: only derived arrows draw on |
| 4E smoke, ice, horizon, palette | smoke only with a fighting status, full only inside a naming event's window; no puff under the ground; the meres' level under their edge at each factor | the smoke's share of the free rectangle ≤ 25% in every view; the horizon row's gap drawn in the haze's colour in the low views | a static check that the landscape's light, sky, haze, mist and sprite colours come from their tables |

## I. Pull-request plan for 4B onward

Each part passes every check on its own, records what changed and why in `CHANGELOG.md` with the numbers, and moves
`check:baseline`. None changes a guarded declaration (questions 6 and 9 aside, each a separate data task if the owner wants it).

| part | files | depends on | regression risks | the report must show |
|---|---|---|---|---|
| **4B, the light** (§A) | `app.js` (`sunAt`; `LIGHT_BY_ALT` replacing the landscape's use of `LIGHT`; the fill tied to the sun; `startPhaseTransition` without the light; `loop`; the composite without the toe; the shadow box fitted and snapped; the disc), `world.js` (the landscape's baked hillshade out of `GROUND_FRAG_MAIN`; the paper map's and the going layer's kept), `tools/visual` (the sweep), `css-test.js` | - | the darkness measure (the sweep, three 4x views); map text contrast as rendered (the ground lighter); `check:contrast`'s landscape states; 2F's cover checks (the palette under a new light); the environment map's regeneration cost; the shadow box's coverage in the low views | per harness view at its factor and the four at 1x and 10.33x: solid near-black, luminance p5 and mean, lowest contrast, drops, pass time, today against 4B; the sweep; `light-sheet`-style before and after; the self-test's count |
| **4C, the atmosphere** (§B, §C) | `app.js` (the fog chunks set before any material compiles; the haze and the valley fog from the light table and `PHASES[].mist`; `fogShift` removed; the legend's fog row; the sources sheet's notes), `world.js` (`buildMist`'s sheets and the haze sheet removed; the dome's gradient), `tools/visual` (two views, the mist-edge check replaced) | 4B (the haze's and the mist's colours come from the light table) | every material recompiles with the new chunks (sprites, lines, points included); the fitted Overview's look (decision 61); contrast as rendered over the white fog; the frame cost of the chunks; the Command view must not change | the today/after table of §B.2 for every landscape view at 1x, 4x and 10.33x; the two 08:00-08:30 views; the frame cost on the harness machine and, if available, on a GPU; the fog's top against the knowledge rule |
| **4D, pacing** (§D) | `app.js` (the default speed, the dwell, the continuous follow, the draw-on of derived arrows, reduced motion), `shell.html` (½× pressed at start; the dwell toggle in the layers panel), `style.css` (the dwell's caption), `binding-test.js` | 4B soft (the shadow box must follow a moving camera without shimmer) | Follow's semantics (decision 47); the key fixes of 3E; the tour and themes (they never dwell); the map layer's drops along the day; the relief control's disabled time (decision 56) | §D.2's table on the implementation; the day's length at each speed; Follow after the 14 camera paths; the draw-on against the legs |
| **4E, smoke, ice, horizon and the palette tables** (§E, §F, §G) | `app.js` (smoke amount and puffs, the cap), `world.js` (the ice's material, `COVER_COL` balance, the sprite palette), `tokens.js` (the paper map's ground colours), `style.css` (via `build.py --tokens`) | 4B, 4C | the sprites' edge check; the paper map identical at every relief setting (its ground colours move to tokens, unchanged in value); 2F's cover checks; `check:contrast` on the paper map | the smoke's share per view before and after; the meres under the new light; the horizon row in the low views; the colour tables with every moved literal listed (was, is) |

### 4B, as delivered (the light; decisions 68-71)

Implemented in `app.js` and `world.js` as §A.5 proposed, with three changes found while building it, each measured
(`tools/stage4/report-4b.js`, `docs/stage4-evidence/4b-report.md`, `4b-before.json`, `4b-after.json`, `4b-sheet.jpg`,
`4b-sheet-before.jpg`; `CHANGELOG.md`, Stage 4B):
- **The fill's strength.** Part A's fill opposite the sun at 0.28 (§A.4b, H) left the figures' and houses' cast shadows
  near-black in two views at 4x (selected-formation 0.076%, the low Pratzen view at 11:00 0.079%, limit 0.05%); §A.4b had
  measured four views, not these. The light table carries a fill of 0.36 by day and raises the sky fill by 0.08 by day (Part A's
  J, smaller); the worst view is then 0.035%.
- **The shadow box's least size.** Fitted to a close view the box was 112 units, finer than the fixed 236 before 4B, which drew
  the figures' own shadows as solid dark blocks; it is never smaller than 240 units now (the box grows for wide views, to 592 in
  the fitted Overview).
- **The light follows the clock at once.** `setClock` applies the light, so a phase button or the slider changes the light and
  the grade without waiting for a frame (`runtime-test.js` reads the grade after `setPhase`).

Per view (fact; every landscape view at its factor and four at 1x and 10.33x, and the day at 4x): solid near-black at most
0.035% everywhere (before 4B, with the toe, at most 0.006%; without the toe and under the presets, up to 1.85%: §A.4); map text
0 below AA, the lowest contrast 6.49 (unchanged) and in each view at most 0.45 lower than before (overview-field at 10.33x); drops unchanged in every view;
the ground's mean luminance from 4 lower (at 1x, where the drawn sun is the true one and lower than the presets') to 15 higher (at
10.33x, where it is steeper). The self-test has 135 checks (126 before): the drawn sun against the computed one at each factor,
the shadow box's coverage from every vantage at each factor, the disc, continuity, and the toe and hillshade absent.

### 4C, as delivered (the atmosphere; decisions 72, 73, 80, 81)

Implemented in `app.js` (`ATMO`, the fog chunks, `applyAtmo`, `atmoAt`), `world.js` (the mist sheets removed) and `shell.html` (the
legend's row) as §B.3 and §C.5 proposed, with these changes found while building it, each measured (`tools/stage4/report-4b.js`,
`docs/stage4-evidence/4c-report.md`, `4c-before.json`, `4c-after.json`, `4c-sheet.jpg`, `4c-sheet-before.jpg`; `CHANGELOG.md`, Stage 4C):
- **The haze's visibilities.** At §B.2's physical values (8-25 km) the ground's mean luminance rose 17-29 above 4B in four views,
  against §B.4's ±15. The light table's `vis` is five times those (40-120 km): a depth cue, as §B.3 labels it, not the day's air.
- **The day fill.** The mist sheets had faintly lifted the low Pratzen view's dark foreground conifers; without them the view
  reached the 0.05% limit. The light table's day fill is 0.52 (4B: 0.36); the worst view is 0.030%.
- **The fog's edge** is 6 m (an exponential above the top); at 15 m a point 20 m over the top kept too much fog.
- **§C.6's top check** uses a ray falling 1 in 10 from 300 m above the top, and reads "not fogged" 20 m over it as at most a
  quarter of the cap; a vertical ray from above measures the edge's own depth only.
- **§C.6's two harness views** are a loop after the day's light (`FOG_VIEWS`), not new cases, so no unobstructed baseline is added.
- **§B.4's ±15 luminance** is recorded as a measured design target, not a check: outside the fog's hours (08:00-09:05, the ease of
  the 08:45 lifting included) every landscape view is within 13.3 and the day at 4x within 15.2; in the fog's hours the white fog
  raises the ground 18-60, by design.
- **The dome** needed nothing: its horizon is already drawn in the fog colour (decision 80).

Per view (fact; every landscape view at its factor and four at 1x and 10.33x, the day at 4x, and three views in the fog's hours):
solid near-black at most 0.030%; map text 0 below AA, the lowest contrast 6.49 (unchanged) and in each view at most 0.91 lower than
4B (the low Pratzen view at 08:30, over the fog); drops unchanged; the haze at the orbit target 0 everywhere; the valley fog 0.31-0.54
over the ground at 08:00-08:30 (cap 0.55). The self-test has 141 checks (135 before): the fog's top and the haze at the target at each
factor; the Command view's "uncertain" against the drawn top, the fog's amount over the day, nothing on the paper map, once.

### 4D, as delivered (pacing; decisions 74-76, 78 and 83)

Implemented in `app.js` (the default speed; the dwell, `DWELL`, `dwellAdvance`; Follow while playing, `FOLLOW`, `followStep`; the
draw-on, `DRAWON`, `drawOnArrows`), `shell.html` (½× pressed; the layers panel's "Playing" section with the dwell's toggle; Follow's
title), `style.css` (the dwell's lit marker and caption) and `data.js` (decision 76's one word), with these changes found while
building it, each measured (`tools/stage4/report-4d.js`, `docs/stage4-evidence/4d-report.md`, `4d-before.json`, `4d-after.json`;
`CHANGELOG.md`, Stage 4D):
- **The draw-on (decision 83).** 12 of the 17 derived arrows' legs run from their phase's first minute to its last (the timing rule:
  an anchor is reached as its phase opens, so the leg into the next anchor runs through the phase). As §D.3 item 4 had it, at every
  phase start (a phase button, a tour stop, a theme, every harness view) those arrows were not drawn, and each was whole only at the
  instant its phase's overlay was replaced; a head at the tip also lay under the moving formation's own counter, against Stage 2D's
  rule that nothing is drawn over a head. The owner chose "ghost and progress" (decision 83).
- **Derived arrows kept to their path.** The arrow's curve (Catmull-Rom through the path's points, Stage 2C) bulged up to 1.4 units
  off the formation's path between points; points are added every 2 units along each segment, so the marched part ends within
  0.13 units of the formation. The ends stay the anchors exactly (`binding-test.js`).
- **Follow's distance** is 230-300 units (2.4 x the live events' spread + 130), not §D.2's candidate 86-274: at those distances the
  map layer dropped 19-20 items over the day (the limit 19), where every brigade is labelled; at 230-300 at most 11-12, with every
  live event in the free rectangle in 92-93% of the day's minutes (the phase glide before 4D: 71-73%). Wider than most phase views
  (92-212 units in phases 1-8).
- **The dwell's length.** Each dwell adds 1.5 s plus its two eases, 2.0 s where the eases are whole (§D.3 estimated 2.5 s): the day
  plays in 3 min 30 s at ½× (§D.3: about 3 min 45 s). The event start at 04:00, where Play begins, does not dwell: 21 dwells.
- **§D.4's harness case** is a check in the key tests: Play by a real key press runs at ½×, and the low Pratzen case in Watch held
  in the dwell at 09:00 keeps its thresholds. The self-test's layer check counts only the heads drawn, as the harness's measure does.

Per the report: the phase glide before 4D kept every live event in the free rectangle in 71.1% of the day's minutes at ½× (73.1% at
1×), moved the ground across the screen at up to 853 px/s, and dropped at most 16 (19 at 1×) map items; with 4D 92.7% (92.4%), at most
150 px/s, at most 11. The self-test's pacing checks: the day under Follow at each factor, the draw-on at each factor, the dwell's
length at every speed, scrubbing, reduced motion.

### 4E, as delivered (smoke, ice, the horizon and the palette; decisions 77, 79, 80)

Implemented in `app.js` (`SMOKE`, `smokeAmount`, `smokePlace`; `SPRITE_COL`; `LIGHT_RIG`; the dome centred on the eye, `domeFollow`; the
sky's horizon the fog colour), `world.js` (`WATER_COL`, `ICE` and the shore ice; `LAND_COL`; `COVER_KEYS`), `tokens.js`
(`sym.paperMap.ground`, `contour`, `marsh`), with these changes found while building it, each measured (`tools/stage4/report-4e.js`,
`docs/stage4-evidence/4e-report.md`, `4e-before.json`, `4e-after.json`, `4e-sheet.jpg`, `4e-sheet-before.jpg`; `CHANGELOG.md`, Stage 4E):
- **The smoke's cap** shrinks the puffs largest on screen to one common size, found by bisection, so the share stays under the cap;
  none is culled or made fainter for it. The close and low views reach the cap (24%); every other view is under 10% with no puff shrunk.
- **The horizon.** The dome was centred on the world's origin: from a high eye (the relief drawn 10.33x) the level horizon met the
  dome above its equator, where the sky darkens, so the hazed far edge of the apron showed a band under a darker sky. The dome is
  centred on the eye; its horizon colour is the fog colour itself (in sRGB: the sky's colours are sRGB, the fog's linear). No ring
  of distant relief (decision 80).
- **The shore ice is the landscape's**: on the paper map the meres are drawn as before (the paper map unchanged).
- **The palette needed no rebalancing**: the Field vantage's median luminance through the day at 4x is 61-71 at 10:00-16:00, inside
  its range before Stage 4 (41-85); only the valley fog's hours (08:00-09:05, 4C) are brighter, by design. The hues are unchanged.
- **The tables** hold every value they replace unchanged: the paper map's ground, contours and marsh lines in `TOKENS.sym.paperMap`;
  the landscape's in `LIGHT`/`LIGHT_RIG` (app.js), `SPRITE_COL` (app.js), `COVER_COL` and `LAND_COL` (world.js) and `WATER_COL`
  (world.js). The figures', coats' and flags' colours stay where they are: Stage 6's.
- **Not done:** the ice "matte where the formations cross" (§F.1) is not drawn: it would need the formations' crossing points on the
  ice as a moving mask, and the phase-8 texts give no more than "across the frozen water"; no depth pre-pass for soft particles.

## J. Questions for the owner

Each has a recommendation and its trade-off. Questions 1 to 3 bind 4B; 4 to 6 and 14, 4C; 7 to 9 and 11, 4D; 10, 12 and 13, 4E.

1. **The light at 4x and 10.33x.** Light the drawn ground with the computed sun's vertical scaled by the display factor (the lit
   side and the cast shadows exactly the true ground's under the true sun, §A.3), or with the sun at its true altitude (the shade
   the exaggeration makes: 27% of the ground in cast shadow at 08:00 at 4x, 59% at 10.33x)? **Recommendation: scaled.** Trade-off:
   vertical things (figures, trees, houses) cast shadows 4 or 10 times shorter than the true sun would, and the disc (drawn at the
   true altitude) stands lower than the light seems to come from; at 1x both readings are the same.
2. **The clock's basis for the sun.** Read the app's clock as local apparent (solar) time (the sun south at 12:00) or local mean
   time (south at 11:50; sunrise 07:34 instead of 07:45)? **Recommendation: apparent**, stated in the sources sheet as a reading,
   not a finding. Trade-off: neither is established for the sources' hours; the difference (10.4 minutes) is inside every "c.".
3. **The shadow toe.** Replace it with a fill light standing opposite the sun (§A.4b, H: the worst view 4 blocks), with a stronger
   sky fill (J: also 4), or keep it? **Recommendation: the fill opposite the sun**, its strength in the light table. Trade-off: a
   second directional light whose direction moves with the sun (no shadow, no extra pass); the sky fill would flatten every view
   a little to fix a few conifer crowns.
4. **Before dawn.** Keep a design night light (as the predawn preset is) labelled as such, or compute the moon (derived; about 10
   days old by the mean month, its altitude at 04:00-07:00 not computed here)? **Recommendation: a design night light, no moon.**
   Trade-off: no astronomical claim is made for the night; a computed moon would be derived, not a record of the sky, and the
   weather that night is not in the app's texts either.
5. **How opaque the valley fog is drawn.** Opaque enough to hide what it hid (85% measured: the figures white out, the counters stay)
   or about 55% (the figures show through)? **Recommendation: about 55%.** Trade-off: the picture understates how blind the fog made
   the Allies; the Command view (unchanged) carries that meaning, and the legend says the fog is drawn see-through.
6. **`PHASES[].mist` 0.22 and 0.30 in phases 8 and 9.** No text in the app mentions fog after 08:45 (§0.3 item 7). Keep them, drawn
   as a thin evening haze labelled "modelled" (no data change), or set them to 0 in a data task? **Recommendation: keep, labelled.**
   Trade-off: a modelled evening mist with no text behind it stays on screen; removing it changes a guarded declaration on the
   absence of text, which is not evidence either.
7. **The default speed.** Start Play at ½× (the day in 2 min 48 s before dwells; about 3 min 45 s with them), add a slower ¼×, or
   keep 1×? **Recommendation: ½×, no new button.** Trade-off: the whole day still passes in under four minutes; the dwell, not the
   speed, gives the decisive minutes their time.
8. **Dwell at each event.** About 2.5 s at each of the 22 event starts while playing, on by default, with a toggle in the layers
   panel? **Recommendation: yes.** Trade-off: the clock stops for a moment 22 times; scrubbing and the tour never dwell.
9. **Decision 56's sentence** ("1.2 minutes at normal speed (4.8 at four times speed)", `SOURCE_NOTE`). If ½× becomes the
   default, "normal speed" no longer names 1×. Change "normal speed" to "1×" in a one-line data task, or leave it?
   **Recommendation: the one-line data task with 4D**, recorded as decision 56's sentence was. Trade-off: a guarded declaration
   changes for a word.
10. **Smoke.** Keep the phase status as the rule for who smokes, with the amount following the naming events' windows (§E.2), or
   draw smoke only inside the events' windows? **Recommendation: status, amount by event.** Trade-off: 72% of today's smoking
   formation-samples are named by no live event; they keep a thin smoke rather than none, because their status says they fought.
11. **Follow while playing.** Make Follow continuous while the clock plays (§D.2: live events in the free rectangle 83-88% of the
   day against 71-73%), keeping the phase views for the phase buttons and the pause? **Recommendation: yes.** Trade-off: the picture
   moves all the time while playing (median 24-52 px/s), which a visitor may prefer to the nine jumps; Follow off keeps it still.
12. **Where the 3D colours live.** The paper map's ground colours into `TOKENS.sym.paperMap`; the landscape's light, sky, haze,
   mist, sprite and terrain colours in four named tables in the code that draws them (§G.2)? **Recommendation: yes.** Trade-off:
   `tokens.js` stays the interface's and the symbology's only; the landscape's palette is not in the token check.
13. **The horizon.** No ring of distant relief (it would need a terrain model and a source beyond the field: a data task), only
   the haze and the sky meeting at the horizon? **Recommendation: yes.** Trade-off: the low views show a featureless horizon; the
   real distant hills are not drawn.
14. **Where the haze is counted from.** From the focus (H3: the subject always clear, the background receding; §B.2) or from the
   eye, as the air would (H1: the subject hazed 0.55-0.70 in the close and low views)? **Recommendation: from the focus.**
   Trade-off: it is a depth cue, not a physical atmosphere, and the sources sheet must say so.
15. **Sequencing.** 4B, 4C, 4D, 4E, in that order (§I)? **Recommendation: yes**; 4D could go before 4C if the owner wants pacing
   sooner. Trade-off: 4D before 4B would build the moving camera on a shadow box that shimmers.
