# Geographic corrections proposed (Stage 8, implementation PR 8H): for the owner's decision; nothing implemented

30 October 2026. The 8H brief asked for a focused review of the places 8G found misplaced (the Sokolnitz pheasantry and castle, the Goldbach
there, the Posoritz post house, the highway, and the others 8G named), each verified for identity, the date of its source, the conversion and
its relevance to 1805, with site, appearance, woodland boundary and road alignment kept apart, and a correction proposal that traces each
change's consequences; to implement only if authorised and supported. **No correction is implemented**: every one changes a declaration
`check:data` guards (`world.js`'s geography group or `geo.js`), and CLAUDE.md allows that only in a task explicitly about geographic data,
with the evidence cited, `CHANGELOG.md` recording what was, what is and why, and the reference moved. This file is the proposal; the evidence
is `README.md` beside it (the research, re-run from its inputs), `places.json`, `consequences.json` (computed by `consequences.js` from the
repository's own declarations) and `fig/`.

## 1. What was verified, and how

- **The frame** (`GEOREF`, `geo.js`): sound. `toGeo(toMap(p))` returns every ground-truth point exactly; over the 136 pairs of on-map villages its
  distances are 0.07-0.29% short of the ellipsoid's and its bearings within 0.11°; Table A's 28 offsets agree with an ellipsoidal (Vincenty)
  computation within 3.9 m and 0.5°. **No correction is proposed to the frame.** One finding, recorded and not acted on: every `GT` village point
  lies 13.5 m north-east (35°) of the Czech survey's (ZABAGED) definition point of the same place, a shift inside the register the frame was fitted
  to; it moves no conclusion here (a map unit is 31.6 m).
- **The modern positions** (Czech building register RÚIAN, ZABAGED, the heritage catalogue, OpenStreetMap, Wikidata): 8G's Table A reproduced
  from fresh data (all 28 positions to 0.1 m; 27 offsets to the metre and the degree, the 28th 110.6 m, rounded 110 here and 111 in 8G).
- **The period maps** (README section 6): the stable cadastre's indication sketches of 1825-26 (Moravian Land Archive: Sokolnitz, Kobelnitz,
  Kowalowitz, Bosenitz, Austerlitz) and the Second Military Survey (1836-52; CENIA's east sheet; its west sheet over Sokolnitz, the Santon and
  Bosenitz is missing from the service). The Sokolnitz sketch was georeferenced (8G's measured scale and orientation; two control points;
  three checks 0.8-1.2 km from them hold to 7-15 m). **Not reached:** the First Military Survey (the only map at this scale before 1805), the
  imperial obligatory imprints (a token the service issues only to its own viewer), mapire.eu (HTTP 403). So **no site below is graded for 1805
  from a map of 1805**: each "in 1805" is the 1825-52 site carried back by inference (grade C), supported where noted by texts of 1793-1844 (B).

## 2. The corrections, one by one

Grades as the brief asks: **A** a period source read directly; **B** a period map read, its georeference approximate (or a period text read);
**C** a modern source or an inference. Distances from `GEOREF.kmBetween`. "Anchors" are the formations' plotted positions
(`FORMATIONS[].track[phase].p`); `consequences.json` lists every one within 20 map units (about 630 m) of the old or new place, with both distances.

### G1. The Sokolnitz castle (the buildings planner's legacy place)

- **Identity** (C): today's castle (RÚIAN 13158571) is the same seat rebuilt (a fort of 1560, a Baroque château after 1705, neo-Gothic from
  1843). **Site, 1825** (B): the sketch's closed quadrangle round a court stands where today's castle stands (the georeference rests on it and its
  far checks hold). **Site, 1805** (B): Schwoy (1793) names the castle; Mikhailovsky-Danilevsky (1844) has the road cross the brook beside it,
  Thiébault (1894) a slope east of it overlooking it: both fit the 1825 site. **Appearance**: already in `BUILDINGS` (8G, a quadrangle; its
  form in 1805 an inference).
- **What the map draws**: the 8G quadrangle by `W(226,355)` (world.js `castlePlan8g`, the build's legacy point, moved at most 4 units off the
  drawn brook): **535 m south-east** of the castle's site, east of the drawn Goldbach, on a meadow parcel of 1825. `appearance.js`
  (`BUILDINGS.sokolnitz.castle.scope`) already says so ("a geographic correction proposed, not made").
- **The correction**: the planner's centre to (212.9, 344.3), today's castle and the 1825 quadrangle (with G3: the castle then stands west of
  the drawn brook, 145 m from it, as in 1825).
- **Consequences** (`consequences.json` `castle`): no guarded declaration (the place is `castlePlan8g`'s, presentation code), but
  `appearance.js`'s scope text (guarded) changes to say it is drawn at its site; the farm (`BUILDINGS.sokolnitz.farm`, south of the castle) moves
  with it. Nine positioned items lie within 630 m of the old or new place; no anchor is placed by the castle: Langeron@2 and @7, Saint-Hilaire@8
  and Przybyszewski@4 and @7 stand 230-538 m from the old place and 488-770 m from the new, their acts naming the village and the attack.
  Przybyszewski@2 ("Storms the walled castle grounds and the pheasant enclosure", grade A, (238, 332)) stands 820 m from the drawn castle and
  884 m from its site: the correction does not bring them together; re-reading that anchor's evidence is a question of its own, not proposed
  here. The 14 statements that name the castle (Sokolnitz's phase, its place, Przybyszewski's objective) stay true. The self-test's 8G castle
  checks follow the planner (their rules unchanged).
- **Recommendation**: implement (with G3), as a geographic data task.

### G2. The Sokolnitz pheasantry (`WOODS[0]`)

- **Identity** (B for the 1825 label and place; C for the founding date): today's woodland north of the castle (OSM relation 7163945; the
  heritage catalogue's "obora, founded in the second quarter of the 18th century") is the castle's pheasant garden, the 1825 sketch's
  "Fasangarten" and Wolny's (1837) "Fasangarten" north of the castle.
- **Site, 1825** (B) and **1805** (C, inference): north of the castle, between it and the Kobelnitz boundary, along the brook.
- **Woodland boundary** (B for 1825, kept apart from the site): the 1825 wood covered **0.247 km²** (882 m north-south, 575 m east-west) from the
  castle's north side to 49.1275 N; **today's woodland is not the 1825 one**: it begins about 170 m further north and runs about 490 m further north,
  over an 1825 meadow and the Kobelnitz peasants' strip parcels. Wolny's "90 bis 100 Joch" (52-58 ha) is about twice the 1825 wood: whether he
  counted the meadow, orchard and park, or the garden grew between 1825 and 1837, is **not established**. For 1805 the 1825 outline is the
  nearest evidence (C). **Appearance** (B, 1825-37): a dark-washed wood with tree signs, a straight north-south avenue with a channel and an oval
  loop; walks, groups of trees, an avenue of very old horse chestnuts (Wolny 1837); **no wall** drawn in 1825 (as 8G draws none).
- **What the map draws**: an ellipse (centre (236, 385), 24 by 17 units) **1.9 km south-south-east** of the 1825 wood, on the 1825 fields and
  meadows of Sokolnitz and Telnitz: no support (B).
- **The correction**: `WOODS[0]` to the 1825 outline (centroid (214.6, 328.5); x 207.4-221.0, y 311.6-342.1), drawn as the woods model draws
  (an ellipse of that extent, or the outline itself if the model is extended to polygons).
- **Consequences** (`consequences.json` `pheasantry`): `WOODS` is guarded (`check:data`). **Eight anchors stand inside the drawn wood today**
  (Kienmayer@1 and @7, Dokhturov@2, Langeron@8, Legrand@8 and @9, Bourcier@8, Saint-Hilaire@9: the fight for Telnitz and the pursuit after it,
  drawn inside a wood the 1825 map has as fields); after the correction none would be, and one (Legrand@4, "supporting", (220, 321), a waypoint of
  Levasseur's march onto the Pratzeberg) would stand inside the 1825 wood. (Legrand@0, (208, 312), stands inside today's woodland, which the
  proposal does not draw.) The land cover's wood class moves (the `terrain-test.js` cover fractions, the going model's woods, the trees' counts by
  wood, the harness's views near Sokolnitz and the self-test's woods checks take the new place; their rules unchanged). The 12 statements naming
  the pheasantry ("the pheasantry enclosure beyond", Przybyszewski's objective) stay true; "enclosure" rests on this map's record (narrative.js
  already says "not checked here").
- **Recommendation**: implement, with G3, as one geographic data task; the woodland boundary drawn as 1825's (labelled: 1825's outline, for 1805
  an inference), not today's.

### G3. The Goldbach at Sokolnitz (`GOLDBACH_M`, `MARSH[0]`)

- **Identity** (C): the Říčka ("Zlatý potok", golden brook, in the Czech survey) is the Goldbach.
- **Bed, 1825** (B): **east of the castle**, within about 10 m of today's channel; north of the castle the sketch's channel along the avenue lies
  7-8 m from today's Říčka, and a second channel 110-150 m west of it has no counterpart today (which carried the brook in 1805 is **not
  established**). **1805** (C, supported by Mikhailovsky-Danilevsky's road crossing the brook beside the castle, B).
- **What the map draws**: at the castle's and village's rows (y 340-365) the drawn brook runs at x 204-205, today's (and 1825's) at x 215-221:
  **316-515 m apart**; from Kobelnitz's south end (y 300) to below the village (y 380) 28-515 m (`consequences.json` `goldbach.rows`).
- **The correction**: `GOLDBACH_M`'s points between y 300 and 380 to today's channel (= 1825's at the castle; north of it the avenue channel);
  `MARSH[0]` ("lower Goldbach, Sokolnitz down to Telnitz", centred on the drawn brook) with it. **South of y 380** (to Telnitz and the meres,
  decision 27) **the course was not reviewed** and is not proposed.
- **Consequences**: `GOLDBACH_M` and `MARSH` are guarded. **The French line comes to lie on its own bank.** Today the village point, Legrand's
  four positions at Sokolnitz (@0, @1, @2, @7), the French plan's route, the two Sokolnitz events and the four overlay lines through the village
  stand **east** of the drawn brook, on the attackers' side; with the correction all thirteen stand **west** of it, as the 1825 map has the
  village and the castle (`goldbach.sideChanges`). No anchor would stand within 5 units of the new bed. The Kobelnitz-Sokolnitz track would
  cross the brook at (210.5, 309) instead of reaching the village on the brook's line; the Sokolnitz-Telnitz track no longer meets it at the
  village. The stream ribbons, the bridges' going, the marsh's going and the self-test's water and ribbon checks follow (rules unchanged).
  The 11 statements naming the brook at Sokolnitz stay true; one act would want reading again: Legrand@7 ("Presses east across the stream as the
  trap closes", (213, 371)) stands 203 m east of the drawn brook today and would stand 15 m west of the new bed, at the stream rather than across
  it.
- **Recommendation**: implement with G1 and G2.

### G4. The highway from the Santon to the post house (`ROADS[0]`)

- **Identity** (C): II/430 is the old imperial road Brünn-Olmütz (the "Poststrasse" of Schwoy 1793 and Wolny 1837).
- **Alignment, 1826 and 1836-52** (B): at the post house the road band of 1826 coincides with today's road; the Holubitz inn of 1826 stands on
  II/430's line; across Bosenitz a straight chaussée between tree rows in the territory's south part (not georeferenced); on the Second Survey
  the road lies on II/430's line within about 20-40 m from about 16.80 E to the post house. **1805** (C): the chaussée predates 1805 by a modern
  account and no realignment between 1805 and 1826 is recorded; the First Survey, which would test it, was not reached.
- **What the map draws**: from the Santon east the drawn road runs **195 m to 1,231 m north** of that line (x 222: 195 m; x 300: 863 m; x 363:
  1,231 m).
- **This contradicts an established project decision.** The correction pass (CHANGELOG, "Roads": "Olmütz highway: passes the Santon's southern
  foot (276 m from the summit) and runs through the post house ... Holubitz now lies 1.7 km south of it") routed the road through the post house's
  constructed place. By the 1826-52 maps Holubitz lies about 0.8 km south of the road, and the post house is elsewhere (G5). Per CLAUDE.md it is
  stated here, not changed silently.
- **The correction**: `ROADS[0]` east of the Santon to II/430's line (`consequences.json` `highway.rows`); west of the Santon (128-197 m, a gap
  of a road's width at this scale) not proposed.
- **Consequences: substantial.** `ROADS` is guarded. **Eleven anchors stand on the drawn road** (0-21 m): Suchet@0 (A) and @5-@9, Bagration@5-@9
  ("astride the highway", "attacks along the highway", "advances astride the highway toward the post house"); with the correction they would stand
  161-1,086 m off it. Each would have to be **re-plotted on the corrected road from its own evidence** (a data task: their positions, their
  grades and their acts' words; Bagration@0's act says "re-plotted on the corrected road, which passes about 2 km north of Holubitz", which would
  become wrong), and with them both plans' columns on the road (`PLANS.al` column 7's route and objective, `PLANS.fr` column 4's), the derived
  legs and arrivals (`check:chronology`, the derived arrows), the knowledge model's sight lines along the road, and 26 statements naming the road
  (most stay true; "Holubitz 1.7 km south" in the record and Bagration@0's act would not).
- **Recommendation**: implement only as **its own data task and pull request**, after G1-G3 and G5, re-plotting the eleven anchors from their
  sources (this is the "substantial geographic correction work" the brief asked to keep apart). Until then: keep, and say in the sources sheet
  that the road east of the Santon is drawn 0.2-1.2 km north of its 1826-52 line.

### G5. The Posoritz post house (`GT.posthouse`, `FEATURES[#posthouse]`)

- **Identity** (B for 1826 and 1836-52; C for the date): Stará pošta, Kovalovice No. 109: "Posoritzer Post." on the 1826 sketch 32 m from the
  building, "Posoritzer Post" on the Second Survey at it; Wolny (1837) has the post, a toll house, an inn and a smithy half an hour south of
  Posoritz on the post road; the 1806 accounts name a "Posoržitzer Posthaus". The post set up in No. 109 in 1785 is a modern text's (C); no move
  before 1879 is recorded. Rejected again: No. 108 (the inn opposite), Pozořice (the post only from 1879), Rousínov (the next station).
- **What the map draws**: `GT.posthouse`, a construction ("where a straight Tvarožná-Rousínov line crosses Holubice's meridian"), **1,367 m
  north-west** of No. 109, in open fields on the Second Survey. The dataset says "position approximate (about 1 km)": the error is larger than
  stated.
- **The correction**: `GT.posthouse` to No. 109 (map (363.2, 53.8)); `FEATURES[#posthouse].p` with it; the sub-title's "position approximate
  (about 1 km)" to the site's grade (B for 1826, C for 1805).
- **Consequences**: `GEOREF.GT` and `FEATURES` are guarded. The post house is the road's eastern anchor in the correction pass, so G5 and G4 go
  together; Bagration@0 ((319, 49), B, "astride the highway") stands 438 m from the old place and 1,406 m from the new. `SOURCE_NOTE.body[5]`'s
  open question "the exact place of the Posoritz post house" would be answered (B for 1826; C for 1805), and the record's "about ±1 km" corrected.
- **Recommendation**: implement with G4.

### G6. The Austerlitz park (`WOODS[1]`)

- **Identity** (C): the château garden ("Zámecká zahrada"; the heritage catalogue's French Baroque garden "built already during the château's
  construction", later landscaped). **Site, 1805** (B): west of the château on the 1826 sketch (read without a georeference: the side is
  unambiguous) and on the Second Survey with today's outline; Wolny (1836) "an den w. ein herrlicher ... Garten anstoßt", the garden Prince Wenzel
  Kaunitz's creation (Kaunitz died in 1794: the garden predates 1805, an inference). **Appearance** (B): formal compartments with tree rows on an
  east-west axis in 1826 and 1836-52.
- **What the map draws**: a wood (centre (551, 151), 30 by 22 units) **1.6 km south-east of the town**, open fields and meadows by the Litava on
  the Second Survey: no support (B).
- **The correction**: `WOODS[1]` to the garden (centroid (493.3, 125.8); x 480.7-505.5, y 117.9-133.7, about 800 by 260 m), drawn as a formal
  garden, not a wood (a design question: tree rows and compartments, or the woods model with its rows).
- **Consequences**: `WOODS` guarded. No anchor within 630 m of the old place; Austerlitz's place (433 m) and the Russian Guard cavalry's last
  anchor (435 m) near the new. The garden lies inside the town's drawn footprint (radius 24 units), so 8G's town plan would have to keep its
  houses out of it (the planner's rules unchanged; the town's coverage per house changes, measured then). No statement names the park.
- **Recommendation**: implement with G1-G3 (a small change to the data, a visible one to the town).

### G7. The Pratzen church

- **Identity and site** (A for "outside the village", Schwoy 1793 read on the page image; B for the 1826 site, 276 m south-south-west of the
  street's midpoint in its round churchyard): today's church stands on that site, **399 m at 193° from the map's Pratzen point**. **Appearance**:
  already in `BUILDINGS` (8G; a much higher tower before 1819, Wolny 1856).
- **What the map draws**: the church by the village's point (8G's `churchPlan8g`, as before 8G); `appearance.js` already says "its own place ... a
  geographic correction proposed, not made".
- **The correction**: the church at (277.0, 255.6), outside the village (the planner's church place for Pratzen alone).
- **Consequences**: presentation (`churchPlan8g`) and the guarded scope text in `appearance.js`; no anchor within 300 m of the new place; the
  Pratzen village event and place stay at the village point. The self-test's churches check (standing churches drawn by their villages) would
  name Pratzen's own place.
- **Recommendation**: implement with G1-G3.

## 3. Sequence proposed

1. **One geographic data task** (G1, G2, G3, G6, G7): `world.js` (`GOLDBACH_M`, `MARSH[0]`, `WOODS[0]`, `WOODS[1]`; the castle's and Pratzen
   church's places in the planner), `appearance.js` (the scope texts), each change with its evidence (this folder), `CHANGELOG.md` (was, is, why),
   `check:data`'s reference moved; measured before and after (the anchors' sides, the cover fractions, the harness's views near Sokolnitz and
   Austerlitz). Its consequences for the data are small (no anchor moves; thirteen positions come to lie on the correct bank).
2. **A second data task, its own pull request** (G4, G5): the road and the post house, and the eleven anchors re-plotted from their own sources,
   with the plans' columns, the chronology and the statements; the established decision of the correction pass superseded on the owner's word.
3. **Kept until decided**: everything as drawn, the dossiers' and the sources sheet's words saying where a place is drawn away from its own (as
   `appearance.js` already does for the castle and the Pratzen church).

## 4. For the owner (questions 259-260, `docs/STAGE8_SPEC.md` section 20.6)

- **Question 259: the Sokolnitz group and the two small ones (G1, G2, G3, G6, G7).** (a) **Authorise one geographic data task** implementing them
  as proposed (the pheasantry drawn to its 1825 outline, the brook at the castle and the village to its 1825 bed, the castle, the Pratzen church
  and the Austerlitz garden at their sites); (b) authorise some of them (name which); (c) keep the map as drawn, labelled. **Recommended: (a)**:
  each is supported by a period map read and georeferenced (B), none moves an anchor, and G3 puts the French line on its own bank.
- **Question 260: the highway east of the Santon and the post house (G4, G5).** (a) **Authorise a separate data task** re-routing the road on its
  1826-52 line, the post house at Kovalovice No. 109, and the eleven anchors on the road re-plotted from their sources (superseding the correction
  pass's route); (b) the post house alone, the road kept (the road then no longer passes the post house: not recommended); (c) keep both,
  labelled. **Recommended: (a)**, after question 259's task, as its own pull request.
