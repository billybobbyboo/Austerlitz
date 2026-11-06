## 2026-11 · Final audits' roadmap, Stage 4 (main track, 2 of 2): WP-04b, the relief and the drawn geography

**Status: on `claude/compassionate-curie-igyzhl-relief`, stacked on WP-03 (`claude/compassionate-curie-igyzhl` at `f237f70`, rebased onto it); not pushed, for
the lead.** WP-04b of `docs/ROADMAP_FINAL_AUDIT.md`: CL-GEO-01 (owner decision 273 (a), "disclose and refit, measured first"), CL-GEO-05,
CL-GEO-11, CL-GEO-07, and CL-GEO-03 and -04 by their quick remedy. **A data task**: against `archive/stage4wp03-af2965c6.html` six data
declarations change (GEOREF, SOURCE_NOTE, VILLAGES, regionalH, localHeight, coverClass) and four are added (RELIEF_DEM, tbump, CASTLE_GROUND,
castleGround), each below; `check:data`'s reference moves to this build, `archive/stage4wp04b-b1deeb38.html`. `austerlitz-command-map.html` is
now 2,897,183 bytes, md5 `b1deeb380496bef5a1c9e377b11926a5` (was 2,888,060, `af2965c6...`); `check:baseline` moves to it (`package.json`). The records and evidence:
`docs/final-stage4-wp04b-evidence/` (its README lists each file and the tool that made it).

**Put to the owner (texts not changed, measured):** tour stop 5's figures and the texts on the Pratzeberg's dead ground and the chapel's view,
which the refit makes untrue (below, "The owner's questions"); and the self-test's baselines the build moves.

### What changed, and why

- **CL-GEO-01, the relief refitted between its anchors (decision 273 (a); `world.js`, `tools/relief-fit.js`).** The relief met its twelve
  sourced anchors and departed 30-80 m from open elevation data between them (the audit: the southern Pratzen plateau and St Anthony's knoll too
  low, Slapanice too high), while the visitor was told it was fitted.
  - *Is:* six terms (`RELIEF_DEM`, rotated bumps `tbump` in `regionalH`, so that the land cover's local relief and its thresholds are untouched)
    for the landforms the anchors left out: the southern plateau (+44.7 m at most), St Anthony's knoll (+41.0), the spur toward Hostieradek
    (+42.4), the east flank to the Litava (-33.7, trimming the plateau term), the Říčka's valley at Slapanice (-28.6), the saddle south-west of the
    Pratzeberg's top (-30.2); PBERG's amplitude 5.45 to 2.93, SCHLAP's 3.0 (never fitted) to 0.22; `DATUM_M` and `V_M_PER_UNIT` unchanged (the fog's
    top, 238.2 m, and the 10.33x setting keep their values). Each term is commented with the DEM points inside it and their mean residual before
    and after.
  - *How:* fitted (`tools/relief-fit.js`, made current: its old CUR table no longer matched `world.js`) to Copernicus GLO-90 through Open-Meteo
    (the audit's 300 m grid within x 240-360, y 260-380, and two 150 m grids fetched for WP-04b), sigma 10 m; within 0.6 km of the Pratzeberg the
    lower of GLO-90 and SRTM 30 m, sigma 3 m (both surface models; GLO-90 up to 16 m above SRTM in the Cairn of Peace's park); with the twelve
    anchors held (sigma half their tolerance), the Goldbach's sourced drop, the drawn beds of the Litava, the Goldbach, BROOKS[1] and BROOKS[3]
    held (no reverse gradient added) and **the summit held** (below). The geometry is the measured candidate **c16r**'s (a Nelder-Mead search with
    the amplitudes solved inside it, rounded: `tools/final-stage4-wp04b/geometry/`, reproduced exactly from the committed responses).
  - *Departure from the measured candidate, said so:* c16r as measured for the owner draws 326.4 m 168 m east of the Pratzeberg's point, 2.4 m
    above its surveyed 324 m, and so fails the summit line the measurement proposed (no ground within 1 km more than 2 m above the summit). The
    amplitudes were solved again with that line as a constraint (an active set of 25 m lattice points capped at 325.5 m, sigma 0.05 m), the
    geometry unchanged: PBERG 3.26 to 2.93, the six terms 6.15/5.56/5.69/-4.66/-3.90/-4.61 to 6.09/5.58/5.77/-4.59/-3.90/-4.11. Every line was
    measured again on the result (the table below); its Pratzeberg viewshed is 46.8% (c16r 48.5%).
  - *SOURCE_NOTE.body[3] (was):* "...fitted to twelve surveyed elevations (the summits and several villages), which it meets within their
    tolerances. Between them the drawn ground departs from today's elevation data by up to about 80 m: the southern Pratzen plateau and St
    Anthony's knoll are drawn 40-80 m too low and Slapanice about 45 m too high, so read heights there as approximate." *(is):* "...which it meets
    within their tolerances, and between them to today's elevation data (the Copernicus GLO-90 surface model) over the battle's centre. Against
    that data on a 300 m grid there, half the drawn ground lies within about 10 m and none departs by more than about 50 m, chiefly where the
    plateau falls east to the Litava, at the Santon's foot and west of the Goldbach; over the southern Pratzen plateau the drawn ground's mean is
    within a metre of it and no point there is more than about 22 m off, and St Anthony's knoll and Slapanice are within about 5 m. That data is
    today's ground, not the ground of 1805, so read heights as approximate." (measured: the 897-cell core grid's median absolute departure 10.3
    m, its largest 48.5 m; the southern box's cells -21.6 to +19.0 m, mean -0.3 m.)
- **CL-GEO-05, the villages on their own ground (`coverClass` and the ground shader's `gClass`).** The village before the marsh inside a village's
  place (its cover above 0.55): the marsh had come first, so 21 of Sokolnitz's 27 buildings, 20 of Telnitz's 25, 9 of Kobelnitz's 16 and 2 of
  Satschan's 14 stood on marsh and Sokolnitz's centre on it. *Is:* on the village class Sokolnitz 4 to 25 of 27, Telnitz 2 to 22 of 25,
  Kobelnitz 3 to 12 of 16, Satschan 10 to 12 of 14; all villages 309 to 361 of 377 (360 of 376 once Krug is re-planned, below); none on marsh. The marsh's extent (`MARSH`, `covMarsh`,
  which the movement model's `wetAt` reads) is unchanged; 297 of 112,271 points of a 1-unit grid change class, all marsh to village; the planner's
  637 records unchanged. *Not changed:* 16 buildings stand on the stream's water class (Puntowitz 5, Kobelnitz 4, Telnitz 3, Sokolnitz 2, Satschan
  2), the brook through the village; water keeps its precedence.
- **CL-GEO-11, the castle's own ground (`CASTLE_GROUND`, `castleGround`, guarded beside `LANDMARK_SITES`).** The Kobelnitz-Sokolnitz track runs 118
  m west of the castle's site and the cover raster's road band reached it: the site and 13 of 16 points within 25 m were track; of the drawn
  ranges' 63 corners and centres 23 were track, 24 marsh, 6 water, 8 meadow, 2 village. *Is:* an ellipse about the castle and its farm as
  `castlePlan8g` draws them (map [213.0,345.6], 1.4 by 2.0 world units), the village class there, before the track, the marsh, the meadow and the
  brook's bed, after a traced wood and the meres, in `coverClass` and `gClass` (uniform `uCastle`): the site and its 25, 50 and 75 m rings all
  village; the ranges' 63 points all village. 8 grid points change class. The track, its ribbon, the cover rasters and the records unchanged.
- **CL-GEO-07, Krug (`GEOREF.GT.krug`, `VILLAGES`).** Krug drawn at its warped legacy place [339,139], 1.58 km south-south-east of the Kruh tract
  and 1.67 km from today's Kruh (Wikidata Q1790108), where the Second Military Survey (1836-52) labels "Kruch" immediately west of Holubitz (8K's
  register section 1.1). *Is:* at the Czech geographic names register's point for the Kruh tract (ČÚZK Geonames, Pozemková trať, Holubice;
  16.802127 E, 49.178210 N; register entry C6.26, read 14 October 2026), as decision 191 placed Turas: map [318,94], 0.71 km west of Holubitz
  (was 1.58 km), C for 1805 (that the tract is the village of 1805 is an inference from the name and the survey; RÚIAN has no part of a
  municipality or basic settlement unit named Kruh at Holubice, queried 6 November 2026, `krug/ruian/`). SOURCE_NOTE.body[4] (was "Krug and
  Bellowitz, which no register read places, are not") says where Krug is and that its identity is an inference; body[5] (was "the positions of
  Krug and Bellowitz, which no source read fixes") "Krug's position in 1805, and Bellowitz's, which no source read fixes"; the 8K register's
  "2.9 km" corrected (1.67 km to today's Kruh, 1.58 km to the tract's point). *Its consequences, measured:* the planner re-plans Krug alone (12
  buildings to 11); 148 grid points change class (the old site's village to field and to the Blasowitz-Krzenowitz track, which runs through it,
  and the new site's field to village); "Whose eyes?" unchanged. The texts that name Krug (each attributed or saying the point is this map's):
  caffarelli@7 ("Attack Bagration's left at Krug and Holubitz") 0.83 to 1.11 km from Krug, 0.82 km from Holubitz; bag@0 2.41 to 1.43 km; bag@6
  and @7 0.80 and 0.76 km (were 2.34 and 2.25); the Guard's "behind Blasowitz and Kruh" (the disposition's words): rg_inf@0 3.07 to 4.55 km
  (its act says the camp is before Austerlitz); rg_inf@5 ("on the heights by Blasowitz and Krug", disputed, the point this map's) 2.18 to 3.74
  km. No anchor moved. *Not done:* Bellowitz (C6.26 reads Bedřichovice's RÚIAN point, 1.29 km from the drawn place) is outside this task;
  the Blasowitz-Krzenowitz track still bends through the old site (no road of 1805 read there).
- **CL-GEO-03, CL-GEO-04, the streams labelled (the quick remedy).** A legend row in every view, as the meres' (decision 27): "streams: traced
  from a period map at Sokolnitz only, elsewhere schematic; the brooks at Bosenitz and Schlapanitz not drawn"; and SOURCE_NOTE.body[4]: "Of the
  streams only the Goldbach's reach through Sokolnitz is traced from a period map (the cadastral sketch of 1825, on today's channel); the rest are
  schematic, on no map read here: the Goldbach above and below that reach (between Girzikowitz and Kobelnitz today's channel runs west of both
  villages, the drawn one east of them), the Litava, the brooks from the plateau and the Rakovec north of Krzenowitz, and the brooks at Bosenitz
  and through Schlapanitz are not drawn." No stream re-traced.
- **The claims.** No statement's claim changed; SOURCE_NOTE's statements carry none of their own. The narrative inventory regenerated (726
  statements). `check:chronology`'s L9 hashes of SOURCE_NOTE.body[5] written again by its own procedure (`--rehash --write`) after the row's
  review: only the Krug clause changed, none of the cited hours.

### The tolerance lines, before and after (`tools/relief-tolerance.js`; `relief/tolerance-*.txt`)

| line (limit) | before WP-04b | c16r as measured | WP-04b |
|---|---|---|---|
| southern box mean, map x 270-330, y 295-350, 36 cells (10 m) | -45.3 m | -0.2 m | -0.3 m |
| profile Pratzeberg-Augezd, worst (20 m) | -81.8 m | -14.7 m | -14.1 m |
| profile Pratzeberg-Hostieradek, worst (20 m) | -51.7 m | +13.3 m | +12.8 m |
| profile Pratzen-Augezd, worst (20 m) | -76.3 m | -14.6 m | -14.6 m |
| profile Sokolnitz-Hostieradek, worst (20 m) | -81.6 m | +13.5 m | +13.1 m |
| Slapanice, GT.schlapanitz (10 m) | +48.0 m | +4.9 m | +4.9 m |
| St Anthony's knoll, the chapel's OSM point (10 m) | -41.8 m | +2.0 m | +2.1 m |
| the twelve sourced anchors (their tolerances) | 12 of 12 | 12 of 12 | 12 of 12 (the Pratzeberg 322.5 m, 324 ± 5) |
| no false summit within 1 km of the Pratzeberg (+2 m over 324 m) | +1.1 m | **+2.4 m (fails)** | +1.9 m |
| core 300 m grid (897 cells): rms, beyond 30 m, beyond 50 m | 20.1 m, 106, 18 | 16.3 m, 67, 0 | 16.3 m, 67, 0 |
| southern box cells above the fog's top 238.2 m (GLO-90: 32 of 36) | 9 | 33 | 33 |
| Kobylnice to Sokolnice at the GT points (sourced 4 m drop) | -0.2 m | -0.2 m | -0.2 m |

What else the refit moves (`relief/consequences.json`, `relief/deadground.*`): 0 land-cover class changes; no reverse gradient added (the
Goldbach's three, 1.5, 9.4 and 3.7 m, as before); "Whose eyes?" 56 of 1,185 French-headquarters readings and 3 of 1,975 Allied change (the
Allied left from 14:00 to 17:00 mostly turns unknown to Napoleon's, Langeron 18, Dokhturov 9, Buxhowden 7, Kienmayer 3; 18 turn seen); the
viewsheds (3 m eye): the Pratzeberg 73.4% to 46.8%, Stare Vinohrady 64.4 to 61.1, the Santon 41.5 to 42.1, the Zuran 38.4 to 38.9, Puntowitz 2.2 to
2.1, Sokolnitz 1.7 to 1.8, Augezd 4.8 to 3.2; the high ground south of the Pratzeberg above the fog's top 0.89 to 2.09 km.

### The owner's questions (measured; nothing changed)

- **Tour stop 5 (TOUR[4], "Why the Pratzen matters").** It quotes "about 73 per cent of the field" from the Pratzeberg and "under 3 per cent" from
  Puntowitz. Live: 46.8% (c16r 48.5%) and 2.1%. terrain-test.js's quote check fails on this line alone ("tour stop 5 quotes 73% and under 3%; live
  readings 46.8% and 2.1%: DISAGREE"), left failing. The fall comes from where the observer stands: the drawn top is now 168 m east of the
  summit point (325.9 m against 322.5 m there); from the drawn top the share is 72.9% (before WP-04b 59.3% from there, 73.4% from the point).
- **The dead ground.** `TERRAIN_LINES` "Dead ground, Goldbach valley" ("Dead ground as seen from the Pratzeberg in this model's terrain - a derived
  reading"): 0 of its 21 samples visible from the Pratzeberg before, 19 of 21 after (from the summit point and from the drawn top alike).
  Kobelnitz turns visible from the Pratzeberg and the Pratzeberg from Puntowitz (terrain-test's printed lines); Sokolnitz and Telnitz stay dead
  ground. sthilaire@0 ("Standing in fog behind Puntowitz, hidden from the plateau") and @2 turn visible from the Pratzeberg (they were hidden);
  vandamme@2 too; from Stare Vinohrady sthilaire@0 and the vandamme anchors were already visible. Tour stop 5's second sentence and the line's own
  note put the concealment on the fog.
- **The chapel's view.** SOURCE_NOTE.body[5]: "from the chapel of St Anthony it does not show the centre of the Satschan pond". After the refit
  the chapel's point does (a 3 m eye, margin +0.4 m, grazing; was -22.8 m), while gqg@8's drawn point, 110 m away on the knoll's far side, does
  not (-28.0 m; was -22.4 m).
- **The Pratzen place's "Extent" ("Runs north–south between Blasowitz and the Litava").** The audit found the high ground ending about 1 km south of
  the Pratzeberg; after the refit it runs 2.09 km south above the fog's top (1.49 km above 260 m), to within about 0.6 km of the Litava: the line
  now agrees with the relief; not changed.
- **The baselines the build moves** (below): the motion block's counts and visibility, the gait's kept-open cases, and the self-test's artillery
  check, which fails on the refit's slope.

### The checks added (each shown to fail without its fix: `mutations.*`, `tools/final-stage4-wp04b/mutate.js`)

- `terrain-test.js`: the relief's tolerance lines (`tools/relief-tolerance.js` against `tools/relief-dem.json`); no village's centre and no
  building on the drawn marsh class; the castle and its farm (7 ranges, their corners and centres, the site and its 25 m ring) on the village class.
- `css-test.js`: the streams' legend row, shown in every view, and SOURCE_NOTE's sentence.
- The self-test's legend check names the streams' row (no new check, no manifest change).
- `geo-test.js`'s surveyed-village check now holds Krug (GT.krug is kind "v").
- **The negative controls** (`mutations.txt`, `.json`): the unmutated copy (N0) passes terrain-test, test, sim-test, runtime-test, css-test and
  geo-test but for the one line held for the owner (tour stop 5's quote); each of seven mutations is caught by its check: N1 the relief before
  WP-04b (terrain-test: the southern box -45.3 m and six more lines outside), N2 c16r's amplitudes (the summit line, +2.4 m), N3 the marsh before
  the village (52 buildings on marsh), N4 the castle's ground taken out (2 of 80 points on the village class), N5 Krug back at [339,139] (geo-test:
  worst Krug 1,580 m), N6 the streams' legend row taken out, N7 SOURCE_NOTE's stream sentence taken out (css-test).

### Verified

All on this branch's final tree (build `b1deeb38...`, rebased onto `f237f70`; the selftest and contrast runs were made on this build before the last rebase, which brought WP-03's records only), here:

- `npm run build`: 2,897,183 bytes; the committed build is a fresh build's.
- `npm test`: the nine suites and the height guard; **every suite passes but terrain-test.js, which fails on one line, the owner's**: "tour stop 5
  quotes 73% and under 3%; live readings 46.8% and 2.1%: DISAGREE". Its new lines pass: the relief's tolerance lines (all within), the villages on
  their own ground (376 buildings, 360 on the village class, 0 on marsh), the castle's own ground (7 ranges, 80 of 80 points on the village class).
  geo-test 67 of 67 (every surveyed village within 0.5 km, worst Blasowitz 20 m; the Pratzeberg 26.6 m above the highest of the three summits,
  terrain-test). css-test, test.js (1 warning, acknowledged), sim-test (0 errors), redteam (0 findings), runtime-test (console.warn unique 0),
  binding-test (400 checks), audit.js (0 violations) pass.
- `npm run check:data`: against WP-03's reference (`archive/stage4wp03-af2965c6.html`) the ten declarations above, every other identical;
  against the new reference `archive/stage4wp04b-b1deeb38.html` all 143 data declarations identical.
- `npm run check:chronology`: 0 errors; 70 moves with a timed statement, 66 consistent, 4 early (bag@6, guard_cav@6, kamensky@3, kamensky@4, the
  named conflicts), 0 late; the movement audit 0 findings: as on WP-03 (its L9 hashes of SOURCE_NOTE.body[5] rewritten after the review, above).
- `npm run check:baseline`: passes on `b1deeb38...`, 2,897,183 bytes.
- `npm run check:contrast`: every text element at AA in the embedded faces (7,175 elements, 120 pairs, 0 below AA, 0 below 10.5 px, 0 font
  failures), 45 of 45 states reached (10 as a phone), 0 console messages; the start-up cases 8 of 8.
- `npm run check:selftest` (`tools/visual/harness.js` on a copy of the build, Chromium 141): the self-test 323 of 325; STAGE0 FAILURES 3, each
  under "The baselines" below, verbatim in `selftest/selftest-final.json`: the map layer in motion, the artillery, the gait on the ground.
- `tools/relief-fit.js`: world.js carries the fitted amplitudes (to 0.01); `tools/relief-dem.js` writes `tools/relief-dem.json` again
  unchanged; the geometry search reproduces c16r's amplitudes exactly from the committed responses.
- `node tools/final-stage4-wp04b/mutate.js`: all 8 as expected (above).
- Not run: `check:visual` (dispatched on CI by the lead).

### The baselines (measured, not moved: the owner decides)

`check:selftest` on this build (`selftest/`; Chromium 141 at /opt/pw-browsers, one fresh 1366 x 768 page): the self-test 323 of 325, the
harness's STAGE0 FAILURES 3. Against WP-03's own counts (owner decisions 287 (a) and 288 (a), `tools/visual/thresholds.js` and `H_CASES` at
`9c06458`; WP-03's run on its build, `selftest/compare-wp03.txt`):

- **The map layer in motion (decision 240 (a), `MOTION`).** The 16's totals: jumps 229 to 240 (ceiling 251), **pops 1,035 to 1,049 (ceiling
  1,035, over by 14)**, flickers 9 to 7 (10), level-of-detail switches 128 to 128 (130). Visibility (drawn of in view, longest hidden), was WP-03's
  baseline, is this build: hybrid-orbit 1,564 to 1,520 of 2,548 (also its +point and +real twins); hybrid-orbit+sel 1,593 to 1,524 of 2,548,
  longest 2,033 to 2,100 ms; land-play 2,615 to 2,603 of 3,146; low-orbit 665 to 649 of 859, longest 633 to 667 ms; low-zoom 457 to 441 of 590 (the
  failing lines); and, within their baselines, hybrid-glide 1,153 to 1,172, hybrid-pan 1,359 to 1,368, hybrid-pan+al 948 to 976, land-pan 1,783 to
  1,800, land-zoom 1,649 to 1,655, land-orbit 1,749 to 1,753 (longest 1,167 to 667 ms). No run's in-view count changed. *Cause:* the relief: every
  count is the same on the refit's own build before the other steps (md5 `23000397...`, run before the rebase) as on the final one, so the castle's
  ground, the marsh, Krug and the legend row move none of them; that the raised southern plateau changes which names and counters compete for the
  labels in the orbit and low views is an inference.
- **The gait on the ground (decision 244 (a), `H_CASES`).** The 4x men's case 288 (a) re-baselined holds (25 found, at most 28). Six cases at
  10.33x fail, the horses on the refit's slopes: "10.33x horses drawn fresh rich: 40 poses beyond H_TOL, 28 found and kept open (at most 31);
  10.33x horses drawn fresh simple: 38 poses beyond H_TOL, 25 found and kept open (at most 28); 10.33x horses drawn motion rich: 13 poses beyond
  H_TOL, 1 found and kept open (at most 3); 10.33x horses edges fresh rich: 38 poses beyond H_TOL, 29 found and kept open (at most 32); 10.33x
  horses edges fresh simple: 38 poses beyond H_TOL, 29 found and kept open (at most 32); 10.33x horses edges motion rich: 9 poses beyond H_TOL, 2
  found and kept open (at most 4)" (WP-03: only "4x men drawn fresh rich: 25 poses beyond H_TOL, 21 found and kept open (at most 24)", which 288
  (a) re-baselined). H_CASES not changed.
- **The artillery (decision 243 (a)), new:** "WRONG: a limbered piece's trail 0.545 units from its limber's pintle" (the limit 0.12; it held on
  WP-03). The heights' battery at its moving leg's middle (14:07, map [281.5,320.0]) stands on ground the refit raised by 57 m and steepened from
  6.5% to 13.9% (26% to 56% drawn at 4x); 8E's seating (`ud.afterSeat`) turns the limbered piece about its axle in pitch only, so on that slope its
  trail's end misses the pintle. A presentation fix, not made; the threshold not moved.
- `check:visual` (CI) will move the drop limits and unobstructed baselines wherever the relief, the castle's ground, Krug's name and the streams'
  legend row change a view; not run here.

### Not done, and why (handed on)

- **Re-tracing the streams** (the Bosenitz brook, the Říčka through Slapanice, the upper Goldbach and BROOKS[2], the Goldbach between Girzikowitz
  and Kobelnitz from the 1825 sketches of Kobylnice and Jiříkovice): 2-5 days each, a georeferencing task; labelled instead.
- **The Goldbach's sourced drop** Kobylnice 211 to Sokolnice 207 m: the GT points still read -0.2 m (both villages lie outside the new terms; the
  fit weights it but no fitted term reaches them).
- **The relief beyond the battle's centre** (the frame's 600 m grid rms 44.4 m, the east of the frame up to 165 m low) was not fitted.
- **Bellowitz** to its RÚIAN point (Bedřichovice, C6.26): not in this task's brief.
- **The self-test's artillery check on the refit's slope** (a limbered piece's trail 0.545 units from its limber's pintle, the limit 0.12): a
  presentation fix in 8E's seating (`ud.afterSeat` turns the piece in pitch only), not made here.
- **The texts of tour stop 5, the dead ground and the chapel's view**: the owner's.
