## E. Historical and source verification ledger

This section says which of the map's claims were traced to what a source prints, and how. The full rows are in the companion file
(section L.3). Each area's method and its limits are in its README.

### E.1 What was checked, and against what

| ledger | rows | verified | partly | contradicted | not supported or not verified | inaccessible | method | evidence |
|---|---|---|---|---|---|---|---|---|
| forces: strengths, guns, commanders, the army totals (`data.js` notes, `SOURCE_NOTE`, the theme "weakness") | 42 | 14 | 17 | 7 | 2 | 2 | page images where the project's registers read them (Sokolov, Schönhals, the *Correspondance*); Duffy (1977) on archive.org's OCR text layer, by full-text search, because the lending item's page images could not be opened from this container | `sources-oob/ledger.md`, `ledger.json` |
| the reconstruction against itself: totals, names, grades, events' claims, sides of the stream, opposing formations' legs, the Russian Guard's approach, prior fixes | 26 | 10 | 4 | 12 | 0 | 0 | node probes over the data (`tools/audit-post8/history/`), the registers of readings | `history/README.md`, `result.json` |
| geography: the frame, relief, water, roads, settlements, landmarks, the garden, the crossings | 29 | 17 | 5 | 3 | 4 | 0 | open data (OpenStreetMap ways, Wikidata points, terrain models), the 1825-52 maps as 8H read them, the project's own transform | `geography/README.md`, `raw/` |
| timings, events and places | 20 | 14 | 5 | 1 | 0 | 0 | public-domain texts (Stutterheim 1807, the 30th Bulletin, memoirs), the registers of readings, the project's tracks and events | `sources-chronology/ledger.md`, `ledger.json` |

**Coverage, stated plainly.** Most of the map's statements were not traced to a source by this audit. The project's own sourcing stage did
that work (`narrative.js` and its inventory, `docs/step4-evidence/inventory.json`, current: of 704 statements, 148 carry a claim of their own (63 attributed, 65 disputed, 12 interpretation, 6 uncertain, 2 derived), 75 one by class, and 481 none; `docs/step4-evidence/readings.md`, 273
entries). This audit re-traced a sample, chosen for consequence: the force figures a visitor reads first, the hours that carry the battle's
argument, the places where 8J and 8K moved the map, and the claims the records call settled. A row that says "verified" means the source
prints what the map says. It does not mean the map's reading of the battle is the only defensible one.

### E.2 What the ledgers found

- **Forces.** Seven claims are contradicted by the sources read: four Duffy attributions (below), the French army's range of 'other accounts' (which
  omits Mikhailovsky-Danilevsky's and Duffy's figures), the cavalry divisions' working strengths against Sokolov's 22 November returns,
  and Kologrivov's command. The largest group is attributed to Duffy (1977), who does not print them (`CL-SRC-01`; three more Duffy rows,
  Kienmayer, the I Column and the Russian wing, hold only in part). Friant's division "about 3,470 in Duffy and Smith": Duffy has 3,800 with 9 guns. The theme "weakness" says "some 4,300 men by
  Duffy's and Smith's count". The IV Column is "13,900 (Duffy 1977; Smith 1998)" while Duffy gives 23,900. Two claims are supported by no
  source read: Bourcier "about 830 sabres present", and the I Column range's low end (below). Seven formations show a working strength with no note, and six of them exceed the 22
  November returns the project reads elsewhere (`CL-SRC-05`). `SOURCE_NOTE` illustrates honest disagreement with an I Column range whose low
  end, 7,750, appears in no source read; its origin is not established (`CL-SRC-04`). "Kologrivov's command is in Sokolov alone" is contradicted by
  Schönhals p. 178 and by the project's own stage 6B reading (`CL-SRC-03`). The Duffy rows rest on his OCR text layer. The same search
  reproduces exactly the Guard rows the owner photographed (register entry S5.7), which supports the method, but a page-image reading
  remains the standard the project sets (`docs/step4-evidence/readings.md`) and is the remedy's first step.
- **The reconstruction against its own readings.** Twelve of 26 consistency claims fail:
  - events whose own texts dispute the hour are not labelled disputed (`CL-HIS-06`);
  - an event's pill says Fact beside its own text's "this map's reading" (`CL-HIS-01`);
  - Command rows say DOCUMENTED where the claims register says "Not yet checked" (`CL-HIS-12`);
  - the grades do not follow one rule (`CL-HIS-02`);
  - opposing formations' legs pass through one another (`CL-HIS-04`, `CL-HIS-10`), and legs cross the Litava (`CL-HIS-10`);
  - formations with an offensive status walk away from the enemy (`CL-HIS-05`);
  - the Russian Guard's plotted approach takes one side of a divided register (the disposition and Stutterheim against the official report)
    without saying so, and nobody holds Blasowitz when it falls (`CL-HIS-03`);
  - an act's side of the Goldbach disagrees with its anchors: Kienmayer's 'Holding west of the Goldbach' is drawn 0.9 km east of the brook
    (`CL-HIS-08`);
  - Caffarelli is not where the records say (`CL-HIS-09`);
  - Miloradovich at dawn, the prior audit's G-3, was never taken up: an open prior finding (`CL-REC-06`), not a failed fix.

  Eleven of the earlier audit's history fixes hold (H-1, H-2, H-3, H-4, H-12, H-13, H-14, H-18, D-3, D-4, S-5). Of its 75 findings, 64 are resolved, 6 partly (H-19's spellings among them), 2 accepted by decision, 2 superseded and 1 open (`records/prior-findings.md`).
- **Geography.** The frame is sound: one scale authority, a similarity transform of true geography, the 17-degree rotation from true north
  disclosed, the villages from the Czech municipality register, the 8J and 8K corrections in the data where their sources put them. In the drawing, though, the Pratzen church stands 161 m from its read site (`CL-GEO-08`) and Legrand's leg crosses the re-plotted castle (`CL-HIS-04`). Three claims are
  contradicted:
  - the Pratzen place's 'Extent: runs north-south between Blasowitz and the Litava', which the drawn relief contradicts (its high ground ends
    about 1 km south of the Pratzeberg); the sheet's 'fitted to surveyed elevations' holds only in part (`CL-GEO-01`);
  - Krug lies 1.67 km from where the 1836-52 survey puts it, while the visitor is told no source fixes it (`CL-GEO-07`);
  - three villages stand on marsh rather than on the village class (`CL-GEO-05`).

  Four claims cannot be verified from what is read: the Pratzen-Austerlitz road, the upper Goldbach and the brooks (`CL-GEO-03`), the bottom's
  marshiness (`CL-GEO-06`), and the castle's walls and the pheasantry's enclosure in 1805 (`CL-GEO-02`).
- **Timings and places.** Of the 20 most consequential timed or placed claims (the fog and the release, the climb, Dokhturov's descent, Telnitz at 07:00, Friant's march and arrival, Telnitz retaken at 09:30, Sokolnitz, Kamensky's turn and the face-about, the Pratzeberg at 11:00, Blasowitz, the Guard's eagle, Rapp's charge, Bagration by the Posoritz post house, the Satschan ice, the castle and the pheasantry, the end), 14 are verified on the sources' own text layers, quoted with their locators (for example Davout's report of 26 December, pp. 203-204, for Telnitz retaken at 09:30, the day's one A-graded event). Five hold in part: the climb's 08:45 is the map's choice inside the sources' range of about 08:00-09:00, while it is labelled Fact (`CL-HIS-06`); the castle is in the accounts but 'walled' and the pheasantry in none of the 1805-1806 texts read (`CL-GEO-02`). One is contradicted: the face-about's 'no account read gives the order', against Schonhals p. 162 (`CL-HIS-01`). A January 1806 letter by Buxhowden naming Langeron as having sent Kamensky back is missing from that named conflict's sides (`CL-SRC-09`). Coverage: 20 of the 155 timed statements and of the 180 positioned anchors, chosen for consequence; the rest are as the project's own sourcing stage left them.

### E.3 The unresolved historical questions

| question | where the records keep it | shown to a visitor? | this audit |
|---|---|---|---|
| the 1805 course of the highway, and the post house | `docs/STAGE8_SPEC.md` 21.8, 21.9 | the post house yes; the highway's course no (`CL-GEO-10`) | open |
| which channel carried the Goldbach north of the castle | 21.7, 21.9 | no (a code comment) (`CL-GEO-10`) | open |
| the castle's walls and the pheasantry's enclosure | 21.7, 21.9 | told as fact in the 08:00 dispatch (`CL-GEO-02`) | open; contradicted for the pheasantry in 1825 |
| the Goldbach bottom's marshiness | 21.9 | drawn and told as settled (`CL-GEO-06`) | open |
| the garden's planting | 21.7, 21.9 | yes: the rows a convention | open |
| Bagration's line at dawn and at 17:00 | 21.9 | yes (both sources) | open |
| which side of the road Schönhals's height lay | 21.9 | no; moot in the drawing | open |
| Krug's place | 21.9 | yes, with a reason the 1836-52 survey contradicts (`CL-GEO-07`) | the survey's place is available |
| Kologrivov's command | `SOURCE_NOTE` | yes, with a contradicted note (`CL-SRC-03`, `CL-HIS-14`) | two sources read give it |
| the retreat over the Satschan meres and the ice casualties | `SOURCE_NOTE`, `PHASES` | yes: shown as disputed (the 30th Bulletin's twenty thousand drowned against the much lower figures of later counts) | verified as labelled (sources-chronology L18) |
