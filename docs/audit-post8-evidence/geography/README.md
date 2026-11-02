# Final audit after Stage 8: geography

Audited build `austerlitz-command-map.html`, 2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83`, sources of `origin/main` `43e3e5b`.
Nothing in the application, its data, tests, thresholds, archive or build was changed. No `npm test`, `build.py`, harness or
`contrast.js` was run for this area. All node measures ran on an isolated copy
(`scratchpad/geography-iso`, its `geo.js`, `data.js`, `world.js`, `app.js`, `analysis.js`, `appearance.js`, `narrative.js` and build md5-identical
to the repository's), loading the real sources through `tools/audit-post8/geography/lib.js` (three r128, `_clock.js` from `tools/mk-helpers.js`).

The full structured result is `result.json`. Severity S1-S4, priority P1-P4 and categories as the audit brief defines them.

## 1. What was examined, and how the work was split

A first session began this area and stopped at a usage limit before writing this file. Its scripts and outputs were reused as they
stood, not re-run except where this session needed one of their intermediate values:

| first session | what it measured |
|---|---|
| `places.js`, `fetch-places.js` | GEOREF's round trip, every GT point and drawn place against Wikidata P625, cs.wikipedia and Nominatim (Vincenty), a similarity fit of the drawn villages |
| `dem.js` | the relief model against Copernicus GLO-90 (Open-Meteo) at the GT points, a 600 m grid, the drawn Goldbach's bed and today's Říčka and Roketnice |
| `plateau.js` | a 300 m grid over the battle core, the southern plateau's box, the fog rule's misclassification, the headquarters' heights |
| `waterways.js` | the drawn streams against today's (OSM through Nominatim), both ways, and the villages' banks |
| `crossings.js` | every leg against the drawn streams and the drawn wet cover; every anchor's class |
| `buildings.js` | the buildings planner's records: village class, the castle, the Pratzen church, the château |

This session added `extra.js` (profiles, the southern box's occupants, the chapel's sight line, banks against today's Goldbach, the
brooks against OSM's waterways, the highway against OSM's road 430, the chapel's identity, the garden), `figure.js`, `osm-ways.py`, five fetches
and an SRTM cross-check, then analysed everything and wrote this file and `result.json`.

## 2. Commands

```
ISO=/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad/geography-iso   # cp -r of iso-template; node tools/mk-helpers.js run there
node tools/audit-post8/geography/places.js $ISO          # first session
node tools/audit-post8/geography/dem.js --analyse $ISO   # first session (dem.js --request, then fetch-places.js --only dem)
node tools/audit-post8/geography/plateau.js $ISO         # first session
node tools/audit-post8/geography/waterways.js $ISO       # first session
node tools/audit-post8/geography/crossings.js $ISO       # first session
node tools/audit-post8/geography/buildings.js $ISO       # first session
curl -A "AusterlitzMapAudit/1.0 ..." "https://api.openstreetmap.org/api/0.6/map?bbox=16.762,49.180,16.832,49.196"   # this session, 8.6 MB, kept in scratch
python3 -I tools/audit-post8/geography/osm-ways.py <that.xml> raw/osm-ways-highway430.json ref=430
curl ".../api/0.6/way/27326751/full"; python3 -I tools/audit-post8/geography/osm-ways.py ... raw/osm-ways-garden27326751.json leisure=park name
curl "https://nominatim.openstreetmap.org/search?...q=kaple&viewbox=16.740,49.120,16.780,49.098&bounded=1"   # raw/nominatim-kaple-ujezd.json
curl "https://api.opentopodata.org/v1/srtm30m?locations=<6 points>"                                            # raw/opentopodata-srtm30m-check.json
node tools/audit-post8/geography/extra.js $ISO           # writes extra.json
node tools/audit-post8/geography/figure.js $ISO          # writes fig-relief-banks.svg; rendered to .png by the pinned Chromium 141 headless shell
```

Every fetch is in `raw/manifest.json` (URL, status, bytes, sha256, time). An Overpass query for road 430 failed (connection reset by the
proxy); the OSM API's `/map` served the same ways.

## 3. Scale and orientation

- `GEOREF` (`geo.js`) holds the only horizontal scale (K 31.6467 map units per km, 31.6 m a unit, a world unit 63.198 m), the vertical scale
  (6.12 m a unit, datum 243.1 m) and their ratio EXAG 10.326. A literal search of `app.js`, `world.js`, `symbols.js`, `data.js`, `analysis.js`,
  `appearance.js`, `narrative.js`, `tokens.js` and `shell.html` for 31.6x, 0.0316, 15.82, 63.19/63.2, 6.12, 243.1, 10.33 and 0.0632 finds no
  second scale constant (only "10.33" as self-test label strings). The suite's own check (`geo-test.js:73-74`) looks only for the legacy 0.019x and
  26.1, narrower than this search; not a defect.
- `toGeo(toMap(p))` returns every GT point exactly. A similarity fit of the 16 drawn villages to Wikidata gives a scale 0.99981 of GEOREF's, a
  rotation 0.043° from GEOREF's 17.42°, residuals rms 11.7 m (worst Blasowitz 21 m, Girzikowitz 20 m). The frame's 17.42° turn is disclosed
  (`data.js:798`); the rose and the paper map's north are the suite's checks.
- GT's shift (section 20.13): every village's GT point lies 10.7-11.1 m from Wikidata's at 218-221° (one vector: GT about 11 m north-east of
  the modern points), consistent with 8H's 13.5 m at 35° against ZABAGED; below the 31.6 m unit. The drawn `VILLAGES` points (integer map
  units) lie 4-20 m from GT. Summits: 20-47 m from Wikidata's points.

## 4. Relief and heights (finding 1)

- At the relief's 12 elevation anchors (`tools/relief-fit.js:4-9`) the model reproduces the sourced heights within 0-5 m (Pratzeberg 323.9/324,
  Stare Vinohrady 294.4/294, Santon 295.9/296, Zuran 289.6/290, Bosenitz 257.9/257, Kobelnitz 210.2/211, Telnitz 196.3/195; Augezd 189.9/195).
- Between them it is a parametric surface. Against GLO-90: the 300 m core grid (897 points) rms 20.1 m, 106 points beyond 30 m and 18 beyond
  50 m; the 600 m frame grid (936) mean -14.3 m, rms 44.8 m, correlation 0.42, its worst at the frame's east edge beyond Austerlitz and the
  north-west corner (140-165 m low: the hills there are drawn flat).
- **The southern Pratzen plateau** (box map x 270-330, y 295-350): model mean 228.1 m against 273.4 m; 32 of 36 cells stand above the drawn fog's
  top (238.2 m) on the survey, 9 in the model. Profiles (`extra.json`, `fig-relief-banks.png`): Pratzeberg-Augezd mean -39 m, worst -82 m (the
  survey stays at 310-312 m for about 1 km south of the summit, the model is at 255-230 m there); Pratzeberg-Hostieradek -18/-52 m;
  Pratzen-Augezd -25/-76 m; Sokolnitz-Hostieradek -25/-82 m (a surveyed ridge to 298 m, the model flat at about 219 m, 0 of 16 points above the
  fog's top against 7). SRTM 30 m, an independent mission, agrees with GLO-90 within 0-7 m at six of these points, where the model is 47-81 m low.
  Open fields today: a surface model's canopy cannot explain it.
- Who stands there (every 10 minutes, `posAtClock`): Buxhöwden 04:00-08:20, the I and II Columns 04:00-07:10, Kamensky 08:50-09:00, Saint-Hilaire
  13:30-14:00, Napoleon's headquarters 13:50-14:20, the French guns on the heights 14:00-14:20, Vandamme 14:00-14:50. Under the morning's fog rule
  Buxhöwden, the I Column and the II Column stand under the drawn fog on the model's ground while their surveyed ground stands 30-90 m above its
  top (`plateau.json`). Over the core, 2.43 km² lie under the drawn fog in the model only and 4.77 km² under it on the survey only (10 m margin).
- **St Anthony's chapel**: OSM's place of worship lies 108 m south-south-west of `GT.chapel` (approximate, as labelled). There the model has
  198 m against 240 m: the knoll drawn 8 m above Augezd's 190 m instead of about 45 m. The sight line to the Satschan mere's centre is blocked by
  22.8 m on the model; on the survey's 300 m grid it clears by 0.2 m (from gqg@8's point: -22.4 m and -2.1 m). The disclosed limit (`data.js:799`, the
  eye-level note: "the chapel's position is approximate and the relief stylised") is real; its main cause is the knoll's height.
- **Šlapanice**: model 273 m against 225 m (Wikidata 230 m): the Říčka's valley is not in the relief (along today's Říčka the model rises 21.8 m
  downstream there).
- Visitors read "heights follow a separate vertical scale fitted to surveyed elevations" and two known limits (`data.js:797`, `799`); the
  Pratzen place says "Extent: runs north-south between Blasowitz and the Litava" (`data.js:653`), which the drawn relief does not show.
- **Vertical exaggeration as labelled**: `displayScale = factor / EXAG` (`world.js:459`): 1x is true scale, 4x the default, 10.33x the model's own
  ratio; the relief control, the eye caption and the sources sheet state the display factor (`app.js:8217`, `8591-8592`, `8703`). The rise
  Sokolnitz to the Pratzeberg is 113.5 m on the model (sourced 117, survey 122), drawn 113, 454 and 1,172 m. At 1x the sheet reads "exaggerated
  about 1 times" (finding 9).

## 5. Waterways (findings 2, 3, 5)

- **Goldbach at Sokolnitz** (8J): the drawn reach y 309-386 lies within 1-6 m of OSM's Říčka: 8J's correction reproduces.
- **Between Girzikowitz and Sokolnitz**: today's Goldbach is OSM's Roketnice to its mouth on the Říčka at map (202.6, 225.3), then the Říčka. The drawn
  bed (four legacy vertices) passes 172 m east of Girzikowitz where today's passes 170 m west, and 79 m east of Kobelnitz where today's passes 91 m
  west: both villages on the other bank. Puntowitz and Sokolnitz are on the same bank in both. Saint-Hilaire@2 ("crosses the Goldbach and forms for
  the attack") stands 146 m west of the drawn bed and 62 m east of today's. Today's channels are regulated; at Sokolnitz 8J found the 1825 bed
  within about 10 m of today's.
- **Upper Goldbach and brooks**: the drawn source reach (y 109-176) runs 275-1,153 m from any modern stream. Not drawn at all: the Tvaroženský potok
  (the Bosenitz brook; 4.65 km in the frame, 51 m from Bosenitz, 131 m from the Santon, up to 3.0 km from any drawn stream) and the Říčka from the
  frame's north-west edge through Šlapanice (12.2 km, up to 6.4 km). `BROOKS[2]` (south of the Pratzeberg) median 772 m from OSM's nearest
  waterway (max 1,828 m), `BROOKS[0]` 208 m (max 675 m), `BROOKS[3]` 112 m, `BROOKS[1]` 346 m, the Rakovec 67 m. The Litava: median 233 m, max 716 m
  from today's regulated channel (no finding). Only the meres are labelled schematic.
- **The meres**: schematic ellipses (decision 27), the legend row "meres: pond outlines schematic" (`shell.html:248`); the Satschan pond drained
  8-12 or 8-16 December 1805 and Menitz in 1827 (reported, `docs/STAGE2_SPEC.md` I.2). Accepted.

## 6. Roads

- The highway east of the Santon's foot (8K, `world.js:65-71`) against OSM's road 430 (18 ways, inside 16.762-16.832 E, 49.180-49.196 N): 166
  samples a map unit apart, median 3 m, 95th percentile 7 m, maximum 16 m. The Santon 465 m from the drawn road (461 m from OSM's), Holubitz 722 m
  (724 m), the post house 26 m (21 m): 8K's numbers reproduce.
- The other roads and tracks are straight lines between village points (the Pratzen-Austerlitz road's "course unverified", `world.js:73`),
  unlabelled; one of them displaces the Pratzen church (finding 8).

## 7. Settlements, landmarks, the garden (findings 6, 7, 8)

- Villages: drawn 3-28 m from Wikidata. Krug drawn 1,671 m south of today's Kruh (which lies 562 m west-north-west of Holubitz), Bellowitz
  1,302 m north-east of Bedřichovice; the sources sheet calls their places fixed by no source read, though 8K's register read the Second Survey's
  "Kruch" beside Holubitz (and gives the drawn Krug as 2.9 km away, measured 1.67 km).
- The Sokolnitz castle's site 7 m from Wikidata's (21 m from Nominatim's); the quadrangle at 20% of 8G's size centred 2 m from it (8J), the seven
  ranges with the farm 40 m: decision 266 (a), as decided.
- The Pratzen church's site 4 m from today's church; the planner draws it 161 m east-north-east (the legacy Pratzen-Sokolnitz track passes 72 m
  from the site); the sheet says "drawn at its own site"; the self-test admits 316 m.
- The château drawn 225 m west of Wikidata's point and its church 61 m from its own, disclosed in the sheet ("neither at its own place, their
  distance the symbols'"). The garden's outline 16.96 ha against OSM's 16.91 ha, Hausdorff distance 3 m; both château points fall inside it.
- The post house: GT 16 m from Wikidata, 2 m from Nominatim; drawn 10.5 m from GT.
- "Walled castle" and "pheasantry enclosure": stated in the 08:00 dispatch untagged (`data.js:68`, `app.js:7670`), against `narrative.js:91`
  ("this map's record, not checked here"), the 1825 sketch's unwalled pheasantry and the unresolved walls (finding 6).

## 8. Crossings and the troop tracks (findings 3, 4, 5)

- 50 crossings of drawn streams by legs: 20 inside a village's drawn place, 0 at a drawn road's crossing (within 47 m), 30 elsewhere, 8 of them
  not infantry: Kellermann, Nansouty, d'Hautpoul and Walther 0->5 across the upper Goldbach at y 127-152 (0.4-1.5 km from Girzikowitz, a reach no
  modern stream follows), d'Hautpoul 5->7, the Guard cavalry 0->6 and Napoleon's headquarters 0->6 across `BROOKS[0]`, the Allied headquarters 6->8
  across the Rakovec 495 m from the road. No cavalry crosses the Goldbach bottom (y >= 160) away from a village.
- 46 legs touch drawn marsh or water; Kienmayer 2->7 lies wholly on marsh (664 m), Bourcier 7->8 runs 1,454 m wet along the Telnitz-Augezd track,
  the I Column 8->9 1,943 m on the ice (flagged). 20 anchors on water, 9 on marsh.
- The movement audit (`crossingProblem`, `app.js:3391-3400`) tests ponds (unless ice) and marsh away from roads, and exempts every point within 22
  map units (695 m) of any village point; streams are never tested: 0 findings. The history area reported the missing rule (its findings on the
  Litava crossings and on the checks).
- Villages on marsh: the marsh ellipses cover Sokolnitz, Telnitz and Kobelnitz and `coverClass` ranks water and marsh before village
  (`world.js:314-316`): 4 of 27, 2 of 25 and 3 of 16 buildings on the village class (Puntowitz 14 of 19, Satschan 10 of 14, all 309 of 377).

## 9. The carried geographic questions (STAGE8_SPEC 21.9 and 20.13)

| question | where it stands for a visitor |
|---|---|
| the 1805 highway and post | the post's 1805 place in the open questions and its claim's note; the highway's 1805 course nowhere (finding 10) |
| which channel carried the Goldbach north of the castle | a code comment only (finding 10) |
| the castle's walls | stated as settled in the 08:00 dispatch (finding 6) |
| the bottom's marshiness | drawn and told as settled, tour stop 1 included (finding 5) |
| the garden's planting | visible: the sheet calls the rows a convention |
| Bagration's line at dawn and at 17:00 | visible: bag@0's act ("not established"), bag@8's act with both sources |
| which side of the road Schönhals's height lay | not visible; bag@8 is drawn on the road, so the drawing takes no side |
| Krug's place | listed open with an inaccurate reason (finding 7) |
| four villages' buildings off the village class | open: 15%, 8%, 19%, 74% (finding 4) |
| GT's 13.5 m shift | confirmed in kind (11 m against Wikidata), below the unit; nothing needed |
| St Anthony's chapel not drawn | still not drawn; its label over an empty patch is the landscape area's finding |

No geography is proposed to move for label placement.

## 10. Findings

| # | finding | sev | pri | category |
|---|---|---|---|---|
| 1 | relief 30-80 m low over the southern plateau and the chapel knoll, 48 m high at Šlapanice; described as fitted to surveyed elevations | S2 | P1 | confirmed-defect |
| 2 | the drawn Goldbach between Girzikowitz and Sokolnitz up to 300 m off today's channel; Girzikowitz and Kobelnitz on the other bank | S3 | P3 | probable-problem |
| 3 | hydrography outside Sokolnitz schematic and unlabelled; Bosenitz brook and Říčka at Šlapanice absent | S3 | P2 | probable-problem |
| 4 | Sokolnitz, Telnitz, Kobelnitz drawn standing in marsh | S3 | P3 | confirmed-defect |
| 5 | the bottom's marshiness told as settled; no check can fail a crossing | S3 | P3 | unresolved-historical |
| 6 | "walled castle" and "pheasantry enclosure" stated as fact in the 08:00 dispatch | S3 | P2 | unresolved-historical |
| 7 | Krug 1.67 km off; the note's reason inaccurate | S3 | P3 | unresolved-historical |
| 8 | the Pratzen church 161 m from its read site | S4 | P4 | confirmed-defect |
| 9 | "exaggerated about 1 times" at 1x | S4 | P4 | confirmed-defect |
| 10 | two carried questions not visible | S4 | P4 | unresolved-historical |
| 11 | the meres (decision 27) and the castle's size (266 (a)) as decided | S4 | P4 | accepted-compromise |

## 11. Not checked

- No page capture of the villages on marsh ground or of the southern plateau was taken here; the landscape area's captures are cited only where
  they show something.
- The knowledge readings, viewsheds, the fog's drawn extent and the going classes were not recomputed on surveyed ground: the impact of finding 1 on
  them is inferred from the heights.
- The 1805 state of the channels, roads and ponds: the First Military Survey and the 1825 sketches of Jiříkovice and of Kobylnice's brook were not
  read; the Second Survey was not re-read (8K's register is relied on for "Kruch").
- Surface-model bias: GLO-90 and SRTM are surface models; on today's open fields of the southern plateau a canopy cannot account for 45-80 m.
- The Litava south of Telnitz and the meres beyond decision 27; Bellowitz's 1805 place; the paper map's drawing of streams and marsh.

## 12. Evidence index

| file | content |
|---|---|
| `result.json` | the structured result (findings, ledger, coverage, carried status) |
| `places.json` | frame, GT and drawn places against Wikidata, cs.wikipedia, Nominatim; similarity fit; GT shift |
| `dem.json` | GT points, 600 m grid, Goldbach/Říčka/Roketnice profiles, display factors |
| `dem-request.json`, `dem-core-request.json`, `dem-profiles-request.json` | the points sent to Open-Meteo |
| `plateau.json` | 300 m core grid, the southern box, fog misclassification, the fog rule's hits, headquarters' heights |
| `waterways.json` | drawn streams against today's, today's against drawn, villages' banks |
| `crossings.json` | road and leg crossings, legs on wet cover, anchors' classes |
| `buildings.json` | the planner's buildings by village and class; castle, Pratzen church, château |
| `extra.json` | profiles, southern box occupants, chapel sight lines, banks, brooks, highway, chapel identity, garden, SRTM cross-check |
| `fig-relief-banks.svg`, `.png` | the four profiles; the Goldbach drawn against today's channels, villages, the southern box, Krug and Bellowitz |
| `raw/` | every response as served (`manifest.json`); OSM extracts reduced to the ways used (`osm-ways-*.json`) |
| `tools/audit-post8/geography/` | `lib.js`, `places.js`, `fetch-places.js`, `dem.js`, `plateau.js`, `waterways.js`, `crossings.js`, `buildings.js` (first session); `extra.js`, `figure.js`, `osm-ways.py` (this session) |
