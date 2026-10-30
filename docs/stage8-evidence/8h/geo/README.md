# The landmarks' places re-fetched, recomputed and read on the period maps (Stage 8, 8H)

Research note, 29-30 October 2026 (fetches 2026-10-29T23:04Z to 2026-10-30T00:05Z). Nothing in the repository's sources, data
or build was changed; nothing here is committed by this task. It replaces the lost companion files of
`docs/stage8-evidence/8g/places.md` (its `places.json`, `raw/` and scripts were never committed) with inputs that can be re-run,
and reads the period maps that 8G's note left unchecked.

Grades used below (the brief's): **A** a period source read directly; **B** a period map read, its georeference approximate;
**C** a modern source only, or an inference. "1825-26" (the stable cadastre's sketches) and "1836-52" (the Second Military
Survey) are twenty and more years after the battle: a statement about 1805 that rests on them is an inference, and is marked so.

## In short

1. **places.md Table A reproduces from fresh data.** All 28 modern positions agree with 8G's to 0.1 m; 27 of the 28 offsets
   are identical to the metre and the degree; the 28th (Šlapanice church) is 110.6 m, rounded 110 here and 111 there. The
   other numbers of the note reproduce too (castle 672 m at 31° from the village point, the drawn one 651 m at 78°; pheasantry
   884 m at 16° from the castle, the drawn wood 999 m at 179° from the drawn castle; the Říčka at x 215-221 against the drawn
   204-205; the highway's gaps 464, 1,063 and 1,231 m at x 240, 324, 363 (8G: 465, 1,062, 1,232); the post house 1,070 m off
   the drawn highway; Slavkov château 144 m at 236° from its church (8G: 143 m); the garden 1,990 m at 311° from the drawn park).
2. **The frame holds.** `GEOREF.toGeo(toMap(·))` returns every `GT` point exactly; over the 136 pairs of the 17 on-map `GT`
   villages the frame's distances are 0.07-0.29 % short of the ellipsoid's and its bearings within 0.11°; every offset in
   Table A agrees with an ellipsoidal (Vincenty) computation within 3.9 m and 0.5°. One systematic finding: **every `GT`
   village coordinate lies 13.5 m at 35° (NE) of the ČÚZK ZABAGED definition point of the same place** (14 villages, all
   identical), a datum-like shift inside the frame's fit; it moves no conclusion (the map unit is 31.6 m).
3. **Period maps reached:** the stable cadastre's indication sketches of 1825-26 (Moravian Land Archive) for Sokolnitz,
   Kobelnitz, Kowalowitz, Bosenitz and Austerlitz; the Second Military Survey (CENIA's WMTS), whose mosaic lacks the sheet over
   the west of the field (Sokolnitz, Pratzen, the Santon, Bosenitz) but has the east (Holubitz, the post house, Austerlitz) at
   2-16 m a pixel; the Third Survey's 1:75,000 special map (CENIA; an edition with Czech names, so after 1918). **Not reached:**
   mapire.eu (HTTP 403), the ČÚZK archive's joined imperial obligatory imprints (its service answers "Token Required"), and any
   copy of the First Military Survey.
4. **The 1825 Sokolnitz sketch, georeferenced** (8G's measured scale and orientation, placed by the castle's court and the
   granary; checked 0.8-1.2 km away against today's cadastral boundary, 11 m median; today's Říčka, 7 m; the enclosure's east
   wall, 15 m): the **"Fasangarten" lay north of the castle** (0.247 km², 882 m north-south), its centroid **1,909 m at 357°
   from the drawn wood**, 393 m south of today's woodland centroid; **the brook ran east of the castle** as today (within
   about 10 m of today's channel), 0.35-0.48 km east of the drawn Goldbach there.
5. **Per discrepancy** (section 7): every drawn place examined is contradicted by the 1825-52 maps where they reach it (B); the
   drawn wood, castle, Goldbach at the castle, highway east of the Santon, post house and Austerlitz park have no support in
   them. What the maps cannot give is 1805 itself: each "site in 1805" verdict below is the 1825-52 site carried back by
   inference, supported where noted by texts of 1793-1837.

## 1. Files and how to re-run

| file | what |
|---|---|
| `fetch-places.js` | every network request (through `curl`); saves each response under `raw/` as served (gzipped where a text response is over 200 KB) and lists it in `raw/manifest.json` with its exact URL, HTTP status, size, sha256 and time; failed attempts also in `manifest.failures` |
| `krovak.js` | WGS 84 to S-JTSK / Křovák East North (EPSG:5514) and back, for the services that serve EPSG:5514; checked against the RÚIAN service's own two outputs (0.00 m) |
| `period-trace.py` | image measurement only: the 1825 Sokolnitz sketch's control points, its Fasangarten, its blue lines and its communal boundary, and Kobelnitz's boundary band, in the sketch's own pixels, to `derived/period-pixels.json` |
| `compute-places.js` | no network: reads `raw/`, `geo.js` and `world.js` (the drawn places from their declarations, line numbers reported), and `derived/period-pixels.json`; writes `places.json` |
| `period-figures.py` | draws the overlays in `fig/` and writes `derived/period-figures.json` |
| `places.json` | every landmark with each source's point and its distance from the primary, map coordinates, the offset from the map's place with its provenance, the checks (frame, Křovák, Sokolnice, Goldbach, highway, Slavkov, the 1825 georeference and its features), and the overlays' geometry |
| `fig/` | `sokolnitz_1825_overlay.jpg`, `ii_survey_posthouse.jpg`, `ii_survey_posthouse_close.jpg`, `ii_survey_slavkov.jpg`, `ii_survey_slavkov_close.jpg`, `ii_survey_coverage.jpg`, `iii_survey_highway.jpg`, `iii_survey_sokolnice.jpg`, `austerlitz_1826_town.jpg`, `bosenitz_1826_highway.jpg` (red: what the map draws; blue: today's positions; orange: the 1825 trace; green: today's woodland; magenta: today's cadastral boundary) |

Re-run, from the repository root (the second to fourth need no network):

    node docs/stage8-evidence/8h/geo/fetch-places.js            # optional; --only ruian,zabaged,npu,osm,walk,walkwest,wikidata,cswiki,cenia,mza,mza1,mza3,mza4,probe; --force
    python3 -I docs/stage8-evidence/8h/geo/period-trace.py       # about 1 minute
    node docs/stage8-evidence/8h/geo/compute-places.js            # prints the reproduced table and the checks
    python3 -I docs/stage8-evidence/8h/geo/period-figures.py

`compute-places.js` reads the working tree's `world.js` and `geo.js` at run time and records the line numbers it found
(`places.json` `repo.lines`; during this session other 8H work shifted them, e.g. the castle's `W(226,355)` from line 1738 to
1741). The drawn values themselves are identical at `51d4a15` (places.md's reference) and at `2f10a1f` (HEAD when this ran):
`GOLDBACH_M`, the highway's points, `WOODS[0]` and `WOODS[1]`, the `VILLAGES` rows and `GT.santon`, `GT.chapel`, `GT.posthouse`
(checked by hashing the lines at both commits).

Sizes: `raw/` 15 MB (CENIA's tiles 4.7 MB, the Archive's tiles 4.8 MB, OSM 2.1 MB), `fig/` 3.0 MB. The nine level-6 tiles of
the Second Survey (5.8 MB) were fetched, checked and drawn into `fig/ii_survey_coverage.jpg` but are not kept: their URLs, sizes
and sha256 are in the manifest (`kept: false`); `fetch-places.js --only cenia --keep-all` writes them. Every other tile can be
re-fetched by the same script and checked against the manifest's sha256.

## 2. What was fetched

| source | endpoint (exact URLs in `raw/manifest.json`) | what | status |
|---|---|---|---|
| ČÚZK RÚIAN | `https://ags.cuzk.cz/arcgis/rest/services/RUIAN/MapServer/{3,1,7,11}/query` | the 22 buildings by `kod` in EPSG:4326 and EPSG:5514; Kovalovice address points 23956321 (č.p. 109), 23956313 (č.p. 108); ten cadastral territories | 200 |
| ČÚZK ZABAGED | `.../ZABAGED_POLOHOPIS/MapServer/{93,79,102,39,3}/query` | watercourses at Sokolnice (the Říčka as "Říčka (Zlatý potok)"); road 430 (39 parts); castles; walls; the parts of municipalities' definition points | 200 |
| NPÚ heritage catalogue | `https://geoportal.npu.cz/arcgis/rest/services/Tematicke/CP_PaKaSintc/MapServer/{5,12}/query` (+ 6, 13 at Pozořice) | 17 catalogue numbers and their parts, with the catalogue's annotations | 200 |
| OpenStreetMap API 0.6 | `https://api.openstreetmap.org/api/0.6/{way,relation}/<id>/full`, `/node/<id>`, `/map?bbox=16.705,49.106,16.742,49.136`, `/node/<id>/ways` | the 24 elements of places.md; the Sokolnice area (the Říčka, walls); II/430 walked way by way from the post house (no Overpass): 38 ways with `ref=430` from 16.745 E to Rousínov, then 65 more westward to 16.669 E (two short carriageway splits without `ref`) | 200 |
| Wikidata | `https://www.wikidata.org/wiki/Special:EntityData/<Q>.json`; `https://query.wikidata.org/sparql` | 27 items (P625); catalogue numbers (P4075); every item within 1.5 km of the Sokolnice castle and the Slavkov château | 200 (one 429, retried) |
| cs.wikipedia | `index.php?oldid=26159478&action=raw`; `api.php?action=query&prop=revisions...` | the battlefield monument list at places.md's revision; articles "Stará Pošta (Kovalovice)" (rev. 26199399, 2026-09-08), "Sokolnice (zámek)" (rev. 25641431, 2026-01-31), "Slavkov u Brna (zámek)" (rev. 26040741, 2026-07-15) | 200; "Kostel Povýšení svatého Kříže (Prace)" and "Říčka (přítok Litavy)" HTTP 429 three times, not read |
| Moravian Land Archive, fund D9 | `https://www.mza.cz/indikacniskici/data/obrazky/<ID>/Img/{map.jpg,Preview,little,Small,Normal}/...` | Sokolnitz 1825 (MOR246318250): pieces A03D-A05E at level 2, A03E-A05E at level 3, the castle's 20 tiles at level 4; Kobelnitz 1825 (MOR102418250): A04C-A06D at level 2, A05C-A06C at level 3; Kowalowitz 1826 (MOR108718260) A06B-A06C level 2; Bosenitz 1826 (MOR273018260) A07B-A09E level 2 and previews; Austerlitz 1826 (MOR243418260) the town's previews A11A-A12D | 200 |
| CENIA, Second Military Survey | `https://gis.cenia.cz/mapcache/II_vojenske_mapovani/wmts/1.0.0/II_vojenske_mapovani/default/jtsk:epsg:5514/{L}/{row}/{col}.jpgpng` | levels 6, 7 (the field, the post house, Slavkov) and 9 (the post house, Slavkov, 2 m a pixel) | 200 |
| CENIA, Third Military Survey | `.../III_vojenske_mapovani/...` (same scheme) | levels 7 and 8 over Sokolnice, the highway and Slavkov | 200 |

## 3. What failed or was not reached (recorded in `raw/probe/`, `raw/manifest.json` `failures`)

- **mapire.eu** (Arcanum's Second and First Military Surveys): `https://mapire.eu/en/` answered **HTTP 403 Forbidden** (nginx) to a
  plain request on 29 October 2026 (twice); not retried under another identity.
- **The First Military Survey (1764-68 / 1780s)**: no other open copy reached: CENIA has no such cache
  (`https://gis.cenia.cz/mapcache/I_vojenske_mapovani/wmts?...` HTTP 404); the ČÚZK archive lists none. **Not read.**
- **archivnimapy.cuzk.cz** redirects to `https://ags.cuzk.gov.cz/archiv/`; its joined imperial obligatory imprints
  (`.../arcgis4/rest/services/Archiv/archiv_spojene_cisarske_otisky/MapServer`) answer **`{"error":{"code":499,"message":"Token
  Required"}}`**; the token is issued to the archive's own viewer and was not obtained. **Not read.**
- **The Second Survey's own gap**: CENIA's mosaic lacks one whole sheet: the field west of about 16.80 E (Sokolnitz, Pratzen,
  the Santon, Bosenitz) is transparent at every level (levels 8-9 there: an empty 139-byte PNG; the WMS at 2 m a pixel:
  "no tiles containing image data could be retrieved"). The national geoportal's older WMS
  (`geoportal.gov.cz/arcgis/services/CENIA/cenia_rt_II_vojenske_mapovani/...`) answered **HTTP 503** ("maintenance");
  `oldmaps.geolab.cz/map_root.pl` returned its Perl source instead of the viewer.
- **Overpass API**: `https://overpass-api.de/api/status`: **connection reset** (as in 8G); the OSM API 0.6 was used instead.
- **pamatkovykatalog.cz**: **HTTP 503**; its records were read through the NPÚ geoportal's layers.
- **Wikimedia**: Wikidata answered 429 once (retried, 200); cs.wikipedia's API 429 for two articles (above).
- **Placing the Bosenitz 1826 sketch by its boundary failed** (a chamfer search of its red boundary line against today's Tvarožná
  territory left the median at 186-234 m: on this sheet the boundary's red cannot be told from the red parcel lines at level 2);
  its highway is therefore read without a georeference. A free search for the Kobelnitz sketch likewise ran to its scale bound
  and was replaced by the shared-sheet placing (section 6.1).

## 4. The frame checked (GEOREF, `geo.js`)

- Round trip: `GEOREF.toGeo(GEOREF.toMap(lat, lon))` returns every `GT` point to 0 m (double precision).
- The drawn `VILLAGES` points are `GT`'s map points rounded: at most 0.62 map units (20 m) apart (places.md said "within 0.5";
  four exceed it: Blasowitz 0.62, Girzikowitz 0.56, Krzenowitz 0.54, Puntowitz 0.51).
- Independent village centres: ZABAGED's definition points of 14 parts of municipalities (`raw/zabaged/defpoints_castobce_4326.json`)
  fall 6-31 m from the drawn village points (Sokolnice 6, Telnice 13, Prace 27, Holubice 15, Tvarožná 17 ...), and **every one is
  13.5 m at 215° from the `GT` coordinate**: the `GT` list ("33bcdd/souradnice-mest", 2018) is the same set of points shifted
  13.5 m to the north-east, so the frame fitted to it carries that shift (C; the cause, a datum convention in that list, is an
  inference). Positions taken from RÚIAN, ZABAGED, OSM or NPÚ therefore sit up to 13.5 m off the drawn village points for that
  reason alone.
- Scale and turn, against the ellipsoid: over the 136 pairs of on-map `GT` villages, `GEOREF.kmBetween` gives 0.99709-0.99926 of
  the Vincenty distance and `GEOREF.bearingDeg` is within 0.11° of the Vincenty azimuth. For the 28 offsets of Table A the
  frame's numbers agree with Vincenty's from `GEOREF.toGeo(now)` within 3.9 m (Rousínov, 5.3 km) and 0.5° (the frame's bearings
  are given to whole degrees).
- `krovak.js` against the RÚIAN service's own EPSG:5514 and EPSG:4326 outputs for the 22 buildings: 0.00 m with EPSG:1623's seven
  parameters in the position-vector convention (31 m in the coordinate-frame convention, which this tool's first draft used).

## 5. Table A reproduced

Primary position: the area centroid of the RÚIAN building (a building), of the OSM polygon (an area: the pheasantry's woodland
less its ten clearings, as places.md; the garden), else the RÚIAN address point or the NPÚ point. "Map now" is the place the map
draws, with its declaration (lines in `places.json` `landmarks[].now.from`). Offset = `GEOREF.kmBetween` and `GEOREF.bearingDeg`
from the map's place to the modern one (true bearing of the move). Spread = the largest distance of any other source's point
from the primary (8G's in brackets).

| # | landmark | primary: lat, lon | map x, y | map now | offset now -> modern | places.md | spread m | same |
|---|---|---|---|---|---|---|---|---|
| 1 | Sokolnice castle (zámek Sokolnice, Zámecká 57) | RÚIAN bldg 13158571: 49.119172, 16.726282 | 212.90, 344.29 | drawn castle W(226,355): world.js `castlePlan8g` | **535 m** @ 327° | 535 m @ 327° | 24 (24) | yes |
| 2 | Sokolnice granary (barokní sýpka) | RÚIAN bldg 46430121: 49.118074, 16.724342 | 209.79, 349.32 | drawn castle W(226,355) (granary not drawn) | **543 m** @ 307° | 543 m @ 307° | 6 (5) | yes |
| 3 | Sokolnice pheasantry: the woodland's outline | OSM relation/7163945: 49.126828, 16.729562 | 212.05, 316.34 | `WOODS[0]` centre (236, 385): world.js | **2,298 m** @ 358° | 2,298 m @ 358° | 430 (430) | yes |
| 4 | Sokolnice village chapel (OSM 'Kaple Panny Marie') | RÚIAN bldg 46068201: 49.114041, 16.721233 | 207.20, 364.99 | `VILLAGES` Sokolnitz (208, 365) | **25 m** @ 288° | 25 m @ 288° | 2 (2) | yes |
| 5 | Prace, church of the Exaltation of the Holy Cross | RÚIAN bldg 46052721: 49.137777, 16.764355 | 277.03, 255.59 | `VILLAGES` Pratzen (276, 243) | **399 m** @ 193° | 399 m @ 193° | 8 (8) | yes |
| 6 | Telnice, church of St John the Baptist | RÚIAN bldg 50266829: 49.102113, 16.718287 | 213.28, 407.05 | `VILLAGES` Telnitz (212, 408) | **50 m** @ 71° | 50 m @ 71° | 8 (9) | yes |
| 7 | Újezd u Brna, church of SS Peter and Paul | RÚIAN bldg 39874931: 49.104498, 16.756527 | 294.86, 372.66 | `VILLAGES` Augezd (297, 372) | **71 m** @ 270° | 71 m @ 270° | 10 (10) | yes |
| 8 | Újezd u Brna, chapel of St Anthony of Padua | RÚIAN bldg 39874940: 49.108974, 16.756850 | 290.86, 357.42 | `GT.chapel` (291.31, 354.05): geo.js | **107 m** @ 205° | 107 m @ 205° | 82 (82) | yes |
| 9 | Santon, chapel of Our Lady of the Snows | RÚIAN bldg 46085165: 49.188388, 16.763744 | 222.39, 86.18 | `GT.santon` (222.12, 86.75): geo.js | **20 m** @ 43° | 20 m @ 43° | 6 (6) | yes |
| 10 | Stará pošta, Kovalovice č.p. 109 (the Posoritz post house) | RÚIAN bldg 23571594: 49.185190, 16.826263 | 363.24, 53.77 | `GT.posthouse` (323.79, 36.00): geo.js | **1,367 m** @ 132° | 1,367 m @ 132° | 24 (24) | yes |
| 11 | Kovalovice č.p. 108, the inn opposite (rejected) | RÚIAN address 23956313: 49.184772, 16.827377 | 366.13, 54.40 | `GT.posthouse` | **1,459 m** @ 131° | 1,459 m @ 131° | - (-) | yes |
| 12 | Pozořice, former post office (rejected) | NPÚ 138729_1: 49.208735, 16.792271 | 263.70, -1.78 | `GT.posthouse` | **2,243 m** @ 320° | 2,243 m @ 320° | - (-) | yes |
| 13 | Rousínov (Rausnitz), Stará pošta (rejected) | NPÚ 1000121971: 49.203874, 16.882809 | 467.91, -47.95 | `GT.posthouse` | **5,270 m** @ 77° | 5,270 m @ 77° | 5 (5) | yes |
| 14 | Kobylnice, belfry-chapel (no church) | RÚIAN bldg 39854523: 49.139731, 16.731668 | 203.09, 271.59 | `VILLAGES` Kobelnitz (205, 277) | **181 m** @ 358° | 181 m @ 358° | 13 (13) | yes |
| 15 | Šlapanice, church of the Assumption | RÚIAN bldg 39847462: 49.169658, 16.726577 | 160.38, 174.68 | `VILLAGES` Schlapanitz (163, 177) | **110 m** @ 329° | 111 m @ 329° | 9 (10) | 110.6 m |
| 16 | Šlapanice, château | RÚIAN bldg 23691972: 49.168803, 16.724884 | 157.56, 178.72 | `VILLAGES` Schlapanitz (163, 177) | **180 m** @ 270° | 180 m @ 270° | 8 (9) | yes |
| 17 | Jiříkovice, belfry on the green (no church) | RÚIAN bldg 43615511: 49.167943, 16.758111 | 231.53, 158.68 | `VILLAGES` Girzikowitz (233, 162) | **115 m** @ 354° | 115 m @ 354° | 0 (1) | yes |
| 18 | Jiříkovice, manor farm on the green | NPÚ 1000119615: 49.166950, 16.758706 | 233.89, 161.59 | `VILLAGES` Girzikowitz (233, 162) | **31 m** @ 83° | 31 m @ 83° | - (15) | yes |
| 19 | Blažovice, church of the Sacred Heart (1930-1934) | RÚIAN bldg 50432346: 49.163131, 16.784877 | 295.46, 156.35 | `VILLAGES` Blasowitz (296, 147) | **296 m** @ 201° | 296 m @ 201° | 8 (8) | yes |
| 20 | Blažovice, belfry-chapel on the green (1831-1832) | RÚIAN bldg 39854426: 49.166808, 16.786738 | 295.68, 142.73 | `VILLAGES` Blasowitz (296, 147) | **135 m** @ 13° | 135 m @ 13° | 1 (1) | yes |
| 21 | Blažovice, former manor house ('zámeček', č.p. 36) | RÚIAN bldg 23713933: 49.165562, 16.786079 | 295.54, 147.36 | `VILLAGES` Blasowitz (296, 147) | **18 m** @ 249° | 18 m @ 249° | 1 (1) | yes |
| 22 | Holubice, church of St Wenceslas (1929) | RÚIAN bldg 49964330: 49.174291, 16.812916 | 345.37, 99.55 | `VILLAGES` Holubitz (340, 89) | **374 m** @ 170° | 374 m @ 170° | 6 (6) | yes |
| 23 | Holubice, chapel of St Gotthard (1769) | RÚIAN bldg 45872252: 49.177748, 16.812190 | 340.13, 88.45 | `VILLAGES` Holubitz (340, 89) | **18 m** @ 31° | 18 m @ 31° | 4 (4) | yes |
| 24 | Křenovice, church of St Lawrence | RÚIAN bldg 45858501: 49.140967, 16.828778 | 415.34, 200.43 | `VILLAGES` Krzenowitz (415, 196) | **140 m** @ 193° | 140 m @ 193° | 4 (4) | yes |
| 25 | Tvarožná, church of St Nicholas (1880-81) | RÚIAN bldg 46054103: 49.190328, 16.775753 | 246.76, 71.39 | `VILLAGES` Bosenitz (236, 69) | **348 m** @ 120° | 348 m @ 120° | 8 (8) | yes |
| 26 | Slavkov u Brna, Church of the Resurrection | RÚIAN bldg 39712834: 49.155509, 16.876505 | 504.98, 118.69 | `VILLAGES` Austerlitz (507, 126) | **240 m** @ 2° | 240 m @ 2° | 10 (10) | yes |
| 27 | Slavkov u Brna, château | RÚIAN bldg 13846744: 49.154794, 16.874864 | 502.12, 122.23 | `VILLAGES` Austerlitz (507, 126) | **195 m** @ 325° | 195 m @ 325° | 31 (31) | yes |
| 28 | Slavkov u Brna, château garden (Zámecká zahrada) | OSM way/27326751: 49.154577, 16.870750 | 493.30, 125.79 | `WOODS[1]` centre (551, 151): world.js | **1,990 m** @ 311° | 1,990 m @ 311° | 483 (69) | yes |

Notes on the table:
- **Map now.** The castle's place is the legacy `W(226,355)` that `castlePlan8g` starts from; 8G then moves the drawn quadrangle
  "the least step" (at most 4 world units, about 250 m, `v8Settle`) off the drawn brook; that drawn position is not computed here.
  The churches are drawn by `churchPlan8g` near their village point (since 8G); Sokolnitz, Kobelnitz, Girzikowitz and Blasowitz
  have had no church drawn since 8G (`CHURCHES`), so rows 4, 14, 17 and 19-21 compare with the village point only.
- **Spreads** differ from 8G's where the sources differ: Jiříkovice manor (8G had a ZABAGED building, not fetched here); the
  garden (Wikidata Q28915627 "Slavkovský zámecký park a aleje" carries a second point on the avenues, 483 m off; NPÚ's point is
  69 m off, 8G's figure); a few metres elsewhere. The pheasantry's 430 m is its sources naming different points (the obora's
  definition point, the wall's, the marked gun positions, the memorial trees), not uncertainty.
- **Not re-fetched:** places.md's Table B (village street axes, OSM street ways) and the coaching inns Pindulka and Maxlůvka
  (the road's gap west of the Santon was measured at x 146, 175 and 202 instead).

## 6. The period maps

### 6.1 Sokolnitz 1825 (and Kobelnitz north of it), georeferenced

**Method.** The level-2 mosaic of pieces A03D-A05E (six quarter sheets, 651 x 522 px each) is placed by a similarity with
8G's measured scale (2.7215 px/m at level 4, `readings-cadastre.md` 0.2) and the sheet's up at true north (8G: within 0.25°),
translated so the two control points (the castle's court, measured on 20 level-4 tiles, against the courtyard ring of RÚIAN
13158571; the granary "10" against RÚIAN 46430121) fit on average (residual 7.9 m each). A free two-point fit was rejected: it
turns the sheet 4.8° and moves features 1 km away by up to 100 m. **Checks far from the control points** (compute-places.js
`checks.period1825`): the communal boundary drawn at the top of A03E lies a median **11 m** (p90 18 m) from today's boundary of
the cadastral territory Sokolnice (the free fit: 44 m); the sketch's channel along the avenue lies a median **7 m** from today's
Říčka 1 km north of the castle; today's east wall of the enclosure lies a median **15 m** (3 vertices) from the traced edge
(8G read 10-20 m). The castle's block centre falls 6 m from today's.

What it shows (B for 1825; fig/sokolnitz_1825_overlay.jpg):

- **The "Fasangarten"** (labelled; section III, parcels 366-378), a dark wash with tree signs, an avenue with a channel and an oval
  loop, from the castle's north side to a meadow ("378 a"): traced area **0.247 km²** (0.256 under the free fit), **882 m
  north-south, 575 m east-west**, from 49.1196 to 49.1275 N. Its centroid lies **1,909 m at 357° from the drawn wood's centre**,
  502 m at 24° from the castle, and **393 m at 186° from today's woodland centroid**. **78 %** of it lies inside today's woodland
  outline; **37 %** of today's outline lies inside it; **none** of it inside the drawn ellipse.
- **North of it**, inside Sokolnitz, a meadow ("378 a", "Wiese") up to the communal boundary; today's woodland covers it.
  **North of the boundary** (36 % of today's woodland lies in the cadastral territory Kobylnice u Brna), the 1825 Kobelnitz sketch
  draws narrow peasant strip parcels with owners' names: of its pixels under today's woodland there, 69 % carry a green wash,
  5 % the Fasangarten's dark grey, 7 % bare paper (`derived/period-figures.json`). Placed by the shared sheet: Kobelnitz's piece
  A06C and Sokolnitz's A03E are the same quarter sheet, each drawing its own side of the boundary (placed separately, their
  corners fell 36 m apart); Kobelnitz's boundary band then lies a median 22 m (p75 38 m) from today's boundary.
- **The brook** (blue lines, level 3): (i) the channel along the avenue through the Fasangarten, median **7-8 m** from today's
  Říčka; (ii) a second line along the Fasangarten's west edge, **111-149 m** west of today's Říčka, with no waterway in today's OSM
  within 120 m (it lies 50-107 m east of the drawn Goldbach there); (iii) the stream through the castle park, **east of the
  castle**, median **10 m** (3-31 m) from today's Říčka, the castle 163 m west of it; it lies **354-484 m east of the drawn
  Goldbach**.
- **The castle**: a closed carmine quadrangle round a court (8G: 79.6 x 60.0 m, the east range the deepest); the granary "10"
  south-west of it; **no wall sign** round the Fasangarten (8G C3.3; the Instruction's wall sign is a carmine line, 8G T4.2).
- **The drawn places on the sheet**: the drawn castle point falls in a green-washed parcel (the wash of the parcels labelled
  "lauky", meadows) south-east of the castle park; the drawn wood lies south-east of the village over fields and such parcels,
  mostly in the Telnitz territory ("TELLNITZ"), 1.9 km from the Fasangarten.

### 6.2 The 1826 sketches read without a georeference

- **Kowalowitz** (MOR108718260; 8G `readings-cadastre.md` 5, georeferenced by 8G ±15 m): "Posoritzer Post." north of the
  highway; 8G's post yard 49.18547 N, 16.82614 E is **32 m** from the RÚIAN building č.p. 109 and 1,340 m at 131° from
  `GT.posthouse`; the road band coincides with today's road edges. 8G's "Hollubitzer Wirthshaus" (Holubitz 1826, ±150 m) maps to
  (322.5, 69.8): on II/430's line (69.6 at x 324), 1.0 km south of the drawn highway.
- **Bosenitz** (MOR273018260, pieces A07B-A07E; fig/bosenitz_1826_highway.jpg): the highway crosses the territory as a straight
  chaussée (the Instruction's pale carmine, 8G T4.1) between rows of trees, gently bent, in the territory's south part, well
  south of the village; no building on it. Not georeferenced (section 3).
- **Austerlitz** (MOR243418260, the town's enlargement A11A-A12D, previews; fig/austerlitz_1826_town.jpg): the château (a U
  with wings) with **a formal garden of compartments and tree rows to its west**, a lawn with trees and winding paths next to the château; the
  church north-east of the château on the square.

### 6.3 The Second Military Survey (1836-52; CENIA's east sheet)

- **Post house** (fig/ii_survey_posthouse.jpg, `_close.jpg`): the road with tree rows from "Holubitzer W.H." to **"Posoritzer
  Post"**, the label beside buildings north of the road **at the RÚIAN building č.p. 109**, a "W.H." (Wirthshaus) south of the
  road just east of it (consistent with No. 108, the inn opposite); today's II/430 coincides with the drawn road within about 20-40 m on the 2 m tiles (the service's
  georeference, not the road, sets that tolerance). `GT.posthouse` and the drawn highway lie in open fields about 1 km north.
- **Austerlitz** (fig/ii_survey_slavkov.jpg, `_close.jpg`): a formal garden west of the château, its outline that of today's
  garden; the drawn "Austerlitz park" 1.6 km south-east lies in open fields and meadows by the Litava.
- Sokolnitz, the Santon and Bosenitz fall in the missing sheet (fig/ii_survey_coverage.jpg).

### 6.4 The Third Military Survey's special map (CENIA; an edition with Czech names, after 1918)

The road runs straight from "host. Maxlůvka" past the Santon's south foot, "host. Rohlenka" and "Kopečky" to "Pozořická Pošta",
about 0.7 km south of Tvarožná, on II/430's line (fig/iii_survey_highway.jpg); at Sokolnice the wood "Bažantnice" lies north of the
castle, smaller than today's woodland (fig/iii_survey_sokolnice.jpg). Late for 1805: C.

## 7. The discrepancies assessed

Each facet separately: (a) identity, (b) site in 1805, (c) appearance, (d) woodland boundary, (e) road alignment.

### 7.1 Sokolnice pheasantry against the drawn wood (`WOODS[0]`, 236, 385)
- (a) **Identity.** Today's woodland (OSM relation 7163945; NPÚ "obora", 1000120787_0004: "founded in the 2nd quarter of the 18th
  century") is the castle's pheasant garden by name and place, the 1825 sketch's "Fasangarten" and Wolny's (1837) "Fasangarten"
  north of the castle. **B** (1825 label and position) / **C** (the founding date: modern catalogue).
- (b) **Site in 1805.** North of the castle, between it and the Kobelnitz boundary, along the brook: the 1825 sketch (B) and
  Wolny 1837 ("gegen N. in den 90 bis 100 Joch betragenden Fasangarten", B, 8G T1). Carried back to 1805 by inference (the
  catalogue's 18th-century founding; no change recorded): **B for 1825, C for 1805**. The drawn wood, 2.3 km south of today's
  woodland and 1.9 km south of the 1825 Fasangarten, stands on 1825 fields and meadows of Sokolnitz and Telnitz: **no support (B)**.
- (c) **Appearance.** 1825: a dark-washed wood with tree signs, a straight north-south avenue with a channel and an oval loop (B);
  1837: walks, groups of trees, a broad main avenue of very old horse chestnuts and the meandering brook (Wolny, B); walls: none
  drawn in 1825 (B, a negative on a sheet that has a wall sign); the east wall's date disputed (modern web, C). The chestnuts'
  being "hochbejahrt" in 1837 makes the avenue likely in 1805 (C, inference).
- (d) **Woodland boundary.** In 1825 the wood covered 0.25 km² from the castle's north side to 49.1275 N; today's woodland (0.52
  km² outline, 0.46 km² wood) starts about 170 m further north and runs about 490 m further north, over the 1825 meadow 378a and
  into what Kobelnitz drew in 1825 as peasant strip parcels (green washes, not the dark wash). So the 1825 boundary is not
  today's: **B**. Wolny's "90 bis 100 Joch" (about 52-58 ha) is about twice the 1825 dark wash; whether his figure includes the
  meadow, orchard and park, or the garden grew between 1825 and 1837, is **not established**. For 1805 the 1825 outline is the
  nearest evidence (**B for 1825, C for 1805**).

### 7.2 Sokolnice castle against the drawn castle W(226,355)
- (a) **Identity.** Today's castle (RÚIAN 13158571) is the same seat rebuilt: NPÚ "a historicist château made from a Baroque
  building on the site of an older fort"; cs.wikipedia (rev. 25641431): a fort of 1560, a two-storey Baroque château with chapel
  after 1705, rebuilt neo-Gothic by the Mitrovský family from 1843. **C.**
- (b) **Site in 1805.** The 1825 quadrangle stands where today's castle stands (the georeference uses it, and the three far checks
  hold to 7-15 m, which a moved castle would not allow): **B for 1825**. For 1805: Schwoy 1793 names "ein gutes Schloß" (8G T2.1,
  read on the image); Mikhailovsky-Danilevsky (1844) has the road cross the brook beside the castle, Thiébault (1894) a slope east
  of it overlooking it (8G T6.6-6.7, B): both fit the 1825-and-today site by the brook under the plateau. **B.** The drawn place is
  535 m south-east, east of the brook, in a green-washed 1825 parcel: **no support (B)**.
- (c) **Appearance.** 1825: a closed quadrangle about 80 x 60 m round a court, the east range deepest (8G, B); 1837: a regular
  quadrangle, the east front two storeys, the others one (Wolny, B). That it burned in the battle rests on modern texts only (C;
  8G N5.2). Already in `BUILDINGS` (8G).

### 7.3 The drawn Goldbach at Sokolnice (0.3-0.5 km west of the Říčka)
- (a) **Identity.** The Říčka, "Říčka (Zlatý potok)" in ZABAGED, is the Goldbach by name (Zlatý potok, "golden brook"): **C**.
- (b) **Site (the bed) in 1825 and 1805.** At the castle's and the village's rows (map y 340-365) today's Říčka runs at x 215-221
  and the drawn line at x 204-205 (gaps 316-515 m, reproduced). In 1825 the brook ran **east of the castle within about 10 m of
  today's channel** (B); the castle (145 m), the granary (317 m) and the village point (206 m) lie **west** of it, while the map puts
  the village point 95 m **east** of its Goldbach. In 1805 the road crossed the brook beside the castle (Mikhailovsky-Danilevsky
  1844, B), consistent with the 1825 course. North of the castle the 1825 sketch shows two channels: the avenue channel on today's
  line and a west-edge channel 110-150 m west that has no counterpart today; which carried the brook in 1805 is **not
  established**. **B for 1825 at the castle and the village; C for 1805 (inference supported by the 1844 text).**
- (c) **Appearance.** Thin blue lines in 1825 (a small brook); a pale-blue pond parcel 627 south of the granary (8G); Wolny's
  meandering brook through the pheasant garden (1837, B). Today's channel is regulated (when: not established).

### 7.4 The Posoritz post house against `GT.posthouse`
- (a) **Identity.** Stará pošta, Kovalovice č.p. 109: the post station set up in house No. 109 in 1785, a coaching inn of the
  first half of the 18th century before that, the post until 1879, named "Pozořická pošta" on the 1826 map (cs.wikipedia rev.
  26199399, 2026-09-08: **C**); "Posoritzer Post." on the 1826 sketch at this building (8G, 32 m) and "Posoritzer Post" on the
  Second Survey at it (**B**). Wolny 1837: the Posořitz post, with a toll house, an inn and a smithy, half an hour south of
  Posořitz on the Brünn-Olmütz post road (8G T1.10, B). The 1806 accounts name a "Posoržitzer Posthaus" (8G leads 54, text layer).
- (b) **Site in 1805.** At Kovalovice No. 109 on the highway: **B for 1826 and 1836-52; C for 1805** (the 1785 founding is a modern
  text's; no move before 1879 is recorded; Schwoy 1793 names no post at Posoritz, 8G N2.2). `GT.posthouse` (a construction: "where
  a straight Tvarožná-Rousínov highway line crosses Holubice's meridian") lies 1.34-1.37 km north-west, in open fields on the
  Second Survey: **no support (B)**. Rejected candidates confirmed: No. 108 is the inn opposite (cs.wikipedia; consistent with the
  survey's "W.H." south of the road), Pozořice had the post only from 1879 (C), Rousínov is the next station (C).
- (c) **Appearance.** 1826: masonry (pink) ranges round a yard north of the highway, one facing the road, a north-south wing, in a
  polygonal enclosure with a garden (8G, B for 1826); the present buildings' age is not established (C).

### 7.5 The highway east of the Santon (drawn 0.5-1.2 km north of II/430)
- (a) **Identity.** II/430 is the old imperial road Brünn-Olmütz (the "Poststrasse" of Schwoy 1793 and Wolny 1837; built in the
  first half of the 18th century according to the cs.wikipedia article above, C).
- (e) **Alignment.** 1826: at the post the road band coincides with today's road edges (Kowalowitz, 8G, B); the Holubitz inn on
  the highway lies on II/430's line, 1.0 km south of the drawn line (8G ±150 m, B); across Bosenitz a straight chaussée between
  rows of trees in the territory's south part, not through the village (B, not georeferenced). 1836-52: from about 16.80 E (x ≈
  300) to the post house the road lies on II/430's line within about 20-40 m, the drawn line 0.86-1.23 km north of it in open
  fields (B). The 20th-century special map shows the same straight line through the Second Survey's gap (C). **So from the Santon
  to the post house the 1826-52 road ran on II/430's line, south of Tvarožná: B. For 1805: C** (inference; the chaussée predates
  1805 by a modern text's account, and no realignment between 1805 and 1826 is recorded; the First Survey, which would test it,
  was not reached). Gaps measured (map y, then perpendicular): x 222: 197/185 m; x 240: 464/309 m; x 260: 538/477 m; x 280:
  700/622 m; x 300: 863/767 m; x 324: 1,063/944 m; x 340: 1,172/1,040 m; x 363: 1,231/1,093 m. West of the Santon (x 146-202):
  137-174 m along y, 128-163 m perpendicular. The Santon chapel lies north of the road (as data.js says).

### 7.6 Slavkov château garden against the drawn "Austerlitz park" (`WOODS[1]`, 551, 151)
- (a) **Identity.** "Zámecká zahrada" (OSM) is the château's park (NPÚ 1000152934_0003: a French Baroque garden "built already
  during the château's construction", later landscaped; cs.wikipedia rev. 26040741: remade in Baroque form under Prince Wenzel
  Kaunitz): **C**.
- (b) **Site in 1805.** West of the château: the 1826 sketch (B, read without a georeference: the side is unambiguous), the Second
  Survey with today's outline (B), Wolny 1836 "an den w. ein herrlicher ... Garten anstoßt", the garden "eine Schöpfung des ... Fürst.
  Wenzel" Kaunitz (8G T1.13, B; Kaunitz died in 1794, so the garden predates 1805: inference). **B.** The drawn park, 1.6 km
  south-east of the town, is open fields and meadows on the 1836-52 survey: **no support (B)**.
- (c) **Appearance.** Formal compartments with tree rows on an east-west axis in 1826 and 1836-52 (B); today 16.9 ha, about
  800 x 260 m (OSM); its later English landscaping is undated here (C).

### 7.7 Prace church, 399 m south of the village point
- (a) **Identity.** The church built new in 1728-1730 on the site of an older one (Wolny's church topography 1856, 8G T3.10, and
  Wolny 1837, B); its tower partly taken down in 1819 and repaired after 1852 (Wolny 1856, B); a lower tower after 1805 (the
  battlefield list says 1810, C).
- (b) **Site in 1805.** Outside the village before the battle (Schwoy 1793, "mit einer außer dem Orte stehenden Kirche", read on the
  image, 8G T2.3: **A** for "outside the village"); on a height in the walled cemetery (Wolny 1856, B); in 1826 south-south-west of
  the core, south of the brook, apart from the farm rows, 276 m at 194° from the main street's midpoint (8G C4, B; the 8G crop
  `prace_A08A_L4_church-environs-1826-detail.jpg` shows it in its round churchyard on open ground). Today's church stands 399 m at
  193° from the map's Pratzen point. **B** (site); the map's church at the village point has no support.
- (c) **Appearance.** A vaulted church with a much higher tower than after 1819 (Wolny 1856, B); 1826 plan 27.9 x 13.8 m with an apse
  (8G, B). Already in `BUILDINGS` (8G).

## 8. What 8G's numbers this reproduces, and what it does not

**Reproduced from fresh data:** every position and offset of Table A (above); the castle's, granary's and village point's
distances and bearings; the pheasantry's outline (1,202 x 580 m, 0.52 km² outline, map extent x 201.4-219.9, y 297.2-338.1), its
centroid from the castle (884 m at 16°), the drawn ellipse (1.28 km², x 212-260, y 368-402) and their zero overlap; the Říčka's
x at the castle's rows and the 145 m and 206 m; the highway's y-values at x 222-363 and the gaps (to 1 m); the post house's
1,070 m from the drawn highway; Slavkov's 433 m at 288°, 1,599 m at 137° and 16.9 ha.

**Not reproduced or changed:** Table B (street axes; not attempted); Pindulka and Maxlůvka (not fetched); the west-of-Santon
range "120-260 m" (measured here at three points: 128-197 m); places.md's "within 0.5 map units" for the village points (0.62
at most); the garden's spread (483 m here, see the table's notes); and places.md's statements "the 1805 outline not checked" and
"the 1805 bed was not checked", now checked for 1825 (sections 6.1, 7.1, 7.3).

## 9. Open

- The First Military Survey (the only pre-1805 map at this scale) and the imperial obligatory imprints were not reached.
- The 1825 west-edge channel at Sokolnitz: its course south of 49.124 N and whether it, or the avenue channel, was the brook in 1805.
- Wolny's 90-100 Joch against the 1825 Fasangarten's 25 ha.
- The cause of the `GT` list's 13.5 m shift (section 4).
- The Bosenitz highway's exact line on the 1826 sheet (the boundary fit failed).
