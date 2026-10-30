# Stage 8, the follow-up 8K: the highway east of the Santon, the Posoritz post house, and the anchors re-plotted

Owner decision 260 (a) (`docs/STAGE8_SPEC.md` §20.14, question 260): "authorize highway/post-house correction as a separate data task and PR,
review and re-plot the eleven affected anchors from their sources, don't move the road without reviewing dependent reconstruction". This register
is that review: what each place and anchor rests on, what it was, what it is, its grade before and after and why, what stays uncertain, and what
the change does to everything that reads it. The readings are cited by the registers' ids (`docs/step4-evidence/readings.md`, `docs/step2-evidence/readings.md`,
8G's `docs/stage8-evidence/8g/`, 8H's `docs/stage8-evidence/8h/geo/`); the 8H proposal is `docs/stage8-evidence/8h/geo/proposal.md` G4 and G5.

Grades are the dataset's position grades (`CONF_TEXT`): A "Position documented in the sources.", B "Sector documented; the frontage shown is an
approximation.", C "Reconstructed from the narrative — treat as indicative only." The rule applied here, anchor by anchor: **B** where a reading
places the formation at that time relative to a named place (a sector); **C** where no reading places it then and the point is this map's
sequence between documented places. No grade was kept because it was there: every one below is assessed against its new basis.

## 1. The places

### 1.1 The highway (`world.js` `ROADS[0]`)

- **Evidence.** 8H README 7.5 and proposal G4: II/430 is the old imperial road Brünn-Olmütz (the "Poststrasse" of Schwoy 1793 and Wolny 1837;
  C for its identity); 1826: at the post the road band coincides with today's road (Kowalowitz sketch, georeferenced by 8G, B), the Holubitz inn on
  II/430's line (8G, ±150 m, B), across Bosenitz a straight chaussée between tree rows south of the village (B, not georeferenced); 1836-52: from
  about 16.80 E to the post the road on II/430's line within 20-40 m, the drawn line 0.86-1.23 km north of it in fields (Second Military Survey,
  B; `fig/ii_survey_posthouse.jpg`). **For 1805: C** (an inference: no realignment between 1805 and 1826 is recorded; the First Survey, which
  would test it, was not reached).
- **Was.** `[[30,154],[142,128],[225,97],[239,80],[324,36],[401,-4]]`: the correction pass's line (`tools/geo-anchor.js`, history, not run),
  through its constructed post house, "Holubitz 1.7 km south of it" (CHANGELOG, the correction pass).
- **Is.** `[[30,154],[142,128],[224,103.8],[232,97.7],[256,87.3],[336,66.5],[358,57.6],[364,54.3],[382,41.6],[412,15.3],[414,12.2],[422,4.7],[432,-8]]`:
  east of the Santon's foot II/430's line (`consequences.json` `highway.rows`, the OSM line simplified to 0.6 map units, 19 m); the legacy western
  part kept, meeting it at the Santon's foot (its last 2 km bend by at most 0.2 km, a consequence of moving the junction; west of the Santon the
  gap the proposal measured, 128-197 m, is not proposed).
- **Measured** (geo-test): the Santon's summit 465 m from the road (was 276 m); the post 26 m from it, north; Holubitz 0.72 km south of it (was
  1.7 km); the road leaves the frame at true bearing 56 degrees toward Rausnitz.
- **Dependent geography.** The "Holubitz-Posoritz track" ended at the constructed post house: cut at the highway, `[[340,89],[333.5,67.1]]` (its
  legacy course kept to the road; beyond it the track ran through fields on the Second Survey). The "wood above Holubitz" (`WOODS`, c [353,55],
  rx 28, ry 13, 110 trees, legacy and unsourced): the corrected road and post run through it, and the Second Survey has fields there with the road
  between its tree rows; **not drawn**. Two finds from the same sheet are recorded, not acted on (outside decision 260): the Second Survey labels
  "Kruch" immediately west of Holubitz, 0.7 km south of the road, where the dataset draws Krug 2.9 km away at [339,139] (its "warped legacy place"; no
  register read places it); and no wood stands anywhere between the post and Holubitz.

### 1.2 The Posoritz post house (`geo.js` `GT.posthouse`, `FEATURES[#posthouse]`, `VILLAGES`)

- **Evidence.** 8H README 7.4 and proposal G5: Stará pošta, Kovalovice No. 109: "Posoritzer Post." on the 1826 sketch 32 m from the building (8G,
  B for 1826), "Posoritzer Post" on the Second Survey at it (B for 1836-52); Wolny (1837): the post with a toll house, an inn and a smithy half an
  hour south of Posoritz on the post road (8G T1.10, B); the 1806 accounts name a "Posoržitzer Posthaus" without placing it (C6.10, C6.13: "does not
  settle: the post house's position"); the post in No. 109 from 1785 is a modern text's (C). **For 1805: C.** Rejected again: No. 108 (the inn
  opposite), Pozořice (the post only from 1879), Rousínov (the next station).
- **Was.** lat 49.19337, lon 16.812243, map (323.8, 36.0): "placed where a straight Tvarožná-Rousínov highway line crosses Holubice's meridian;
  uncertain by about 1 km" (the error was 1.37 km). `FEATURES` p [324,36]; `VILLAGES` [324,36,3].
- **Is.** lat 49.18519, lon 16.826263 (RÚIAN building 23571594, the area's centroid), map (363.2, 53.8); `FEATURES` p [363,54]; `VILLAGES` [363,54,3].
  The place's sub-title "position approximate (about 1 km)" now "drawn where the maps of 1826-52 show the post"; its claim (attributed, the same
  three readings) has its note "The place drawn is the post of the cadastral sketch of 1826 and of the Second Military Survey, Kovalovice No. 109;
  that it stood there in 1805 is an inference: no map of 1805 was read."
- **`SOURCE_NOTE.body[5]`.** The open question "the exact place of the Posoritz post house" becomes "whether the Posoritz post house stood in 1805
  where the maps of 1826-52 show the post": answered for 1826-52, open for 1805.

### 1.3 The map's other places on the road

- `FEATURES[#olmutzroad]` p [249,64] to [264,75]: the correction pass's rule (1.2 km along the road from the Santon's foot, 0.3 km to the north
  side) applied to the corrected road.
- `FEATURES[#rausnitz]` ("To Rausnitz", the edge marker) p [393,6] to [423,4], where the corrected road nears the frame's edge; its sub-title "about
  2.7 km beyond this edge" to "about 2 km" (2.01 km to `GT.rausnitz`, measured).

## 2. The anchors

"Along" below is the true distance along the corrected road from its point nearest the Santon's summit ([231,98.4], 0.465 km from it), the
correction pass's own construction (`along()`, which measured from 0.35 km south of the Santon on its own road) carried over only where no reading
places the formation. The post is 4.43 km along the corrected road (the constructed post house was 3.7 km along the old one); Holubitz's meridian
3.43 km.

The owner's question named eleven anchors on the road (Suchet @0, @5-@9 and Bagration @5-@9: `consequences.json` `highway.near`); Bagration's
dawn, tied to the post house (`posthouse.near`), is reviewed with them: twelve.

### A1. suchet@0, Suchet's Division at dawn

- **Readings.** The order of 1 December (C4.5, `corr11.p441.butte-reread`, A, read on the page image): "Ordre à la division Suchet et à la
  division Caffarelli de se placer en avant à droite de la route, à la hauteur du Santon." The dispositions of the night (C3.1, A): Caffarelli to
  place himself at seven "à la droite de la division Suchet". The Materialien's editor (step-2 §3.3, B): the division "stützte sich an die
  dominirende Höhe zwischen Lesch und Kowalowitz".
- **Interpretation.** Right of the road for an army facing east is its south side; level with the Santon is abreast of it along the road. Whether
  the order of the 1st was carried out by dawn on the 2nd is not established (C4.5's "does not settle").
- **Was.** [225,97], A, "Formed astride the road under the fortified hill" (unchecked): the correction pass's along(0,0), on its road; no recorded
  basis for A (the pass's archived build has it; CHANGELOG records none).
- **Is.** [235,103]: 0.2 km south of the corrected road at the Santon's foot (191 m measured), 0.66 km from the summit. **B**: the order's sector;
  the frontage and its execution this map's. Act: "Formed south of the road, on its right as ordered the evening before, level with the fortified
  hill", claim attributed (C4.5), note: "That the order's right of the road is its south side, the army facing east, and that the division stood
  there at dawn are this map's readings."
- **Grade.** A to B: the position is not documented; a sector is (CONF_TEXT B).
- **Consequences.** The old point lay 6 map units north of the corrected road, against the order. The derived arrow "Suchet" (phase 4) starts
  here. Caffarelli's dawn [240,115] (not re-plotted) stands 0.42 km south-south-east of it, on Suchet's right as C3.1 orders.

### A2. suchet@5, the advance (the move 09:30-10:30)

- **Readings.** None places the division at 10:30. Lannes's advance along the road is the northern battle's axis (Schönhals p. 166, C6.13: Suchet's
  division and part of Caffarelli's break Bagration's line; Thiers, C6.18, C, disputed: Holubitz and Kruch "le long de la route d'Olmütz"); its hour
  is the map's ("app narrative, unsourced", B as a timing grade; a separate matter).
- **Was.** [242,78], B (along(0.8,0) on the old road). **Is.** [254,88] = along 0.8 km on the corrected road (5 m from it). **C**: this map's
  advance, its distance kept from the correction pass's sequence. Act unchanged ("Advances astride the highway toward the post house"; still true).
- **Grade.** B to C: the point is a reconstruction; the old B rested on the constructed road.
- **Consequences.** Leg 0.77 km (was 0.81), consistent (chronology row: during 09:30-10:40).

### A3. suchet@6, @7, @8, the pursuit

- **Readings.** None places Suchet at 11:15 or 12:45. For 14:30 Schönhals (C6.13, B): Bagration gathers on "der rechts von der Brünner Strasse
  zwischen Rausnitz und dem Posoržitzer Posthause liegenden Anhöhe" "als ein erneuerter Angriff Suchet's das Corps gänzlich zu zerstreuen drohte":
  Suchet attacks toward the height beyond the post.
- **Was.** @6 [264,67], @7 [284,57], @8 [309,43]: along 1.6, 2.3 and 3.2 km on the old road, inheriting B.
- **Is.** @6 [279,81] and @7 [300,76]: along 1.6 and 2.3 km on the corrected road (C, this map's sequence; @7 is again Bagration's @6 point, the
  map's choreography). @8 [348,62]: 0.55 km short of the post on the road, as Schönhals has Suchet attack Bagration on the height beyond it (C: the
  relation Schönhals's, the hour and the point this map's). @6 carries C (from @5) to @8.
- **Grade.** B (inherited) to C for all three: no reading places Suchet at these hours.
- **Consequences.** Legs 0.82, 0.68 and 1.58 km (were 0.78, 0.71, 0.91): @8's longer, the post 1.4 km further east; chronology: @6 consistent
  (arrival 11:15), @7 and @8 undetermined (no timed statement), as before.

### A4. suchet@9, nightfall

- **Readings.** Napoleon's order of 3 December, 8 a.m., is dated "Pozoritzer-Post" (C6.9, A): the French held the post by the night. Schönhals
  (C6.13, B): Suchet's renewed attack on the height beyond the post; the corps, "vom Feinde nicht weiter angegriffen", retreats toward six.
  Mikhailovsky-Danilevsky (C2.11, C2.12, B): Lannes ready to attack the Rausnitz position when ordered to halt; Lannes and Murat in view of Rausnitz
  at dusk. The Allied report (C2.29, C6.22, B, disputed): the French line from three "von dem Rausnitzer Posthause bis Klein-Hostjeradek" (whether
  the same building: uncertain).
- **Was.** [321,38] (along 3.6 km; 109 m from the constructed post house), inheriting B. **Is.** [364,54]: on the road at the post (25 m from
  No. 109). **B**: the sector documented by the order dated at the post and Schönhals's sequence.
- **Grade.** B kept on a new basis (it was inherited from a constructed road; it now rests on C6.9 and C6.13).
- **Consequences.** Leg 0.57 km (was 0.41); nightfall as before.

### A5. bag@0, Bagration's Advance Guard at dawn

- **Readings.** Stutterheim (C6.10, A, page images): "Dieser General war endlich von dem Pesorsitzer Posthause vorgerückt, um sich dem linken Flügel
  des Marschall Lannes ... entgegen zu stellen; der Fürst Bagration hatte die Dörfer Krug und Holubitz durch den General Ulanius mit 3 Bataillonen
  Jäger besetzen lassen." Schönhals (C6.12, B): "Bagration hatte die Dörfer Hollubitz und Kruch durch 3 Bataillone des 6. Jäger-Regiments und durch
  Kosaken unter General Ulanius besetzt." Thiébault (C6.14, B, disputed): Lannes drove him from "Pozorzitz" toward Holubitz. No reading gives his
  line (`SOURCE_NOTE` keeps "Bagration's exact line at dawn").
- **Interpretation.** He starts the day by the post house (he advances from it), his outposts in Krug and Holubitz, 0.7-0.9 km south of the road.
- **Was.** [319,49], B, "Astride the Olmütz highway, his line reaching south toward Holubitz. Re-plotted on the corrected road, which passes about 2
  km north of Holubitz; the exact line is not established" (unchecked): along(3.4, 0.3) on the old road, 0.44 km from the constructed post house;
  669 m north of the corrected road, 1.43 km from Holubitz. The act's "about 2 km north of Holubitz" is wrong for the road of 1826-52 (0.72 km).
- **Is.** [352,64]: 0.48 km west-south-west of the post along the road, 0.12 km south of it, 0.87 km from Holubitz (the old point's relation to its
  post house, 0.44 km toward Holubitz, carried to the post as corrected). **B**: the sector (by the post, Krug and Holubitz held) documented by C6.10
  and C6.12; the line itself not. Act: "Astride the Olmütz highway by the Posoritz post house, from which Stutterheim has him advance; his line
  reaches south toward Holubitz, held with Krug by Ulanius's jägers. The exact line is not established", claim attributed (C6.10), note: "Where his
  line stood is this map's placing, between the post house as drawn and Holubitz: Stutterheim gives no distance or bearing."
- **Grade.** B kept on a new basis (the correction pass's B rested on its constructed road).
- **Consequences.** The phase-4 derived arrow "Bagration" starts here (to bag@5, 2.85 km, was 1.90); the Allied plan's column starts at its road
  point; its staging ellipse is re-centred on it (section 3).

### A6. bag@5, the counter-attack (the move 09:30-10:30)

- **Readings.** Stutterheim p. 70 (C6.10, A): "von dem Posorsitzer-Posthause vorwärts gerückt, und hatte die Anhöhen bey Dwaroschna zu besetzen
  gesucht" (Dwaroschna is Tvarožná, Bosenitz). Marbot (step-2 §8.4, B): Lannes "repoussa toutes les attaques des ennemis contre le Santon". The
  step-4 proposals report Thiers p. 318 (C) having him take Bosenitz below the Santon without approaching the 17e (not a register quotation).
- **Interpretation.** His attack went toward Bosenitz, north of the corrected road (Bosenitz lies 0.85 km north of it). The model's terrain east of
  the village is a plateau at 257-260 m above the Goldbach's head valley (234-250 m) south of the road; the Santon (296 m) stands south-west of
  the village. Identifying Stutterheim's heights with that ground is this map's.
- **Was.** [262,68], B, "Attacks along the highway; cannot get past the Santon battery" (unchecked), along(1.5,0) on the old road.
- **Is.** [262,68], **kept**: the old point stands on that ground, 0.54 km north of the corrected road and 0.83 km east of Bosenitz, so the evidence
  asks for no move; the act changes, since it is no longer on the highway: "Seeks to occupy the heights by Bosenitz, north of the highway
  (Stutterheim); cannot get past the Santon battery", claim attributed (C6.10), note: "That these heights are the ground east of Bosenitz drawn
  here, and that the Santon's battery stopped him, are this map's readings." **B**.
- **Grade.** B kept on a new basis (C6.10's sector).
- **Consequences.** Its leg from the new dawn place is 2.85 km in the window 09:30-10:30 (2.85 km/h; the ceiling 5.0, the tactical rate 3.0, both
  design values): consistent, as before.

### A7. bag@6 and bag@7, falling back

- **Readings.** None places him at 11:40 or 12:45. Schönhals (C6.13, B; C2.25): Ulanius thrown out of Kruch and Hollubitz; d'Hautpoul's charge;
  the battalions fall back "gegen das Thal hinter dem Posthause von Posoržitz" (no hour; toward noon or after in his sequence: bag@6 is a named
  conflict, `CONFLICTS`, unchanged).
- **Was.** @6 [284,57] (B, with its own act and tm), @7 [304,46] (inheriting): along 2.3 and 3.0 km on the old road.
- **Is.** @6 [300,76] and @7 [321,70]: along 2.3 and 3.0 km on the corrected road, falling back along it toward Holubitz's meridian and the post.
  **C** (explicit at @6, carried to @7): this map's sequence; its timing a named conflict.
- **Grade.** B to C: no reading places him at these hours.
- **Consequences.** @6's leg 1.23 km (was 0.78) from the dated departure 11:15: the derived arrival at the tactical rate 11:40 (was 11:31), the
  verdict "early (unresolved conflict)" by 45 minutes against Schönhals's noon as before; @7's leg 0.69 km, consistent.

### A8. bag@8, on the height toward Rausnitz (from 14:30)

- **Readings.** Schönhals (C6.13, C2.25, B, disputed): the height "rechts von der Brünner Strasse zwischen Rausnitz und dem Posoržitzer Posthause".
  Stutterheim (C6.11, C2.20, A): "zog er sich auf die Anhöhen bey Rausnitz". Mikhailovsky-Danilevsky (C2.12): by Rausnitz at dusk. The step-4
  skeptic (proposals C2.p7 (d)): identifying a point with that height "is an inference, say so".
- **Interpretation.** Between the post and Rausnitz, i.e. east of the post, which moved 1.4 km east: the old point [337,29] stands 0.8 km west of
  the post as corrected, on the wrong side of it. "Right of" the road is not read as either side (the skeptic: it "fits either point"); the model's
  ground rises gently east of the post on both sides of the road (266-269 m), falling to a valley south-east of it.
- **Was.** [337,29], B (along 4.2 km; 0.47 km past the constructed post house). **Is.** [386,38]: astride the road on the rise 0.87 km east of the
  post (along 5.3 km), 3.6 km from Rausnitz. **B**: Schönhals's and Stutterheim's sector; that this point is that height is this map's inference,
  as the act's claim already says. Act unchanged (its claim, attributed, unchanged).
- **Grade.** B kept on a new basis.
- **Consequences.** Leg 2.29 km in 12:45-14:30 (was 1.17).

### A9. bag@9, after dark

- **Readings.** Mikhailovsky-Danilevsky (C2.12, B): "Князь Багратіонъ стоялъ у Раузница" at dusk; Schönhals and Stutterheim send him toward
  Austerlitz by six (C2.25, C2.20, C6.11), Ermolov finds his rearguard in Austerlitz before midnight (C2.34). Question 180 (c), redrawing him
  toward Austerlitz, was decided "not now" and question 192 (d) not taken: kept.
- **Was.** [366,14] (along 5.2 km), inheriting B. **Is.** [414,13]: on the road toward Rausnitz 0.4 km inside the frame (along 6.5 km), 2.4 km from
  Rausnitz. **C**: the frame stops 2 km short of the place the one reading names, and the others send him elsewhere.
- **Grade.** B (inherited) to C.
- **Consequences.** The phase-8 derived arrow "Bagration withdraws on Rausnitz" (bag 8 to 9) runs along the road from the rise to the frame's edge
  (1.19 km, was 1.03).

## 3. Plans, objectives, acts, arrows

- `PLANS.al.cols[6]` (Bagration): obj [253,73] to [266,85] (along 1.2 km, the correction pass's rule on the corrected road); route
  [[315,41],[292,52],[273,62],[253,73]] to [[351,60],[309,74],[288,79],[266,85]] (from bag@0's road point). Its order unchanged (unchecked).
- `PLANS.al.staging[3]` "Bagration on the highway": c [377,95] (1.6 km south of the corrected road, never re-anchored by the correction pass) to
  [352,64], bag@0's place; rx 70, ry 30 kept.
- `PLANS.fr.cols[3]` (Lannes): obj [304,46] to [321,70]; route [[225,97],[247,75],[276,61],[304,46]] to [[231,98],[260,86],[291,78],[321,70]]
  (along 0, 1, 2 and 3 km). `PLANS.fr.staging[2]` "Lannes and Murat on the highway" c [227,114] stays: 12.5 map units south of the corrected
  road, right of it as the order of 1 December has it.
- Objectives (interpretation by class): unchanged in word; `caffarelli@0`'s "Hold south of the highway" still true (0.66 km south).
- Acts: suchet@0, bag@0 and bag@5 rewritten (above). The other 34 statements naming the highway, the post house, Holubitz or Rausnitz were read
  again (the dossier's section 8): all stay true but `FEATURES[#posthouse].sub` ("north of Holubitz", "position approximate (about 1 km)"),
  `FEATURES[#rausnitz].sub` ("about 2.7 km") and `SOURCE_NOTE.body[5]`'s open question, each changed; `COMMAND.fr["5"][0]` (the Olmütz road
  sector in view from the Zuran, inferred from the model's terrain) measured again (section 4).
- Arrows: the derived arrows "Suchet", "Bagration" (phase 4) and "Bagration withdraws on Rausnitz" (phase 8) take their points from the tracks
  (`arrowPts`) and move with them; binding-test holds them.
- Events: none has its marker in the sector; `EVENTS[#end].why` ("Bagration holds the height toward Rausnitz, then withdraws on Austerlitz") stays
  true.

## 4. Chronology, rates, sight lines, knowledge (measured)

See section 21 of `docs/STAGE8_SPEC.md` and `docs/stage8-evidence/8k/` for the runs; in brief:

- `check:chronology`: 70 moves with a timed statement, 66 consistent, 4 early (the four named conflicts, bag@6 among them, unchanged), 0 late; no
  derived arrival at the ceiling added (bag@6's tactical arrival 11:40); the cites of `SOURCE_NOTE.body[5]` reviewed (only the post house's
  phrase changed) and rehashed; REVIEW's locators rewritten. No timing was changed.
- March rates: infantry mean 1.33 to 1.35 km/h (`KNOWN_WARN` updated with its cause), no leg over its arm's ceiling, audit 0 violations.
- Sight lines and knowledge: `tools/stage8/roadview-8k.js` and `tools/stage8/know-8j.js` before and after (section 21).

## 5. Unresolved

- The road's and the post's places **in 1805** (C): the First Military Survey (1764-68, 1780-83) was not reached; no realignment between 1805 and
  1826 is recorded.
- Bagration's exact line at dawn; what "the heights by Dwaroschna" were; which side of the road Schönhals's height lay; where Bagration stood at
  17:00 (Rausnitz, or already toward Austerlitz).
- Krug's place (the Second Survey's "Kruch" beside Holubitz against the drawn Krug at [339,139]): a candidate data task, not decided.
- Caffarelli's anchors (not on the road, not re-plotted) stand 2.5-2.9 km south of Bagration's from 14:30, as they stood from his old ones.
