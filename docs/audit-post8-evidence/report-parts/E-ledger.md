## E. Historical and source verification ledger

This section says which of the map's claims were traced to what a source prints, and how. The full rows are in the companion file
(section L.3). Each area's method and its limits are in its README.

### E.1 What was checked, and against what

| ledger | rows | verified | partly | contradicted | not supported or not verified | inaccessible | method | evidence |
|---|---|---|---|---|---|---|---|---|
| forces: strengths, guns, commanders, the army totals (`data.js` notes, `SOURCE_NOTE`, the theme "weakness") | 42 | 14 | 17 | 7 | 2 | 2 | page images where the project's registers read them (Sokolov, Schönhals, the *Correspondance*); Duffy (1977) on archive.org's OCR text layer, by full-text search, because the lending item's page images could not be opened from this container | `sources-oob/ledger.md`, `ledger.json` |
| the reconstruction against itself: totals, names, grades, events' claims, sides of the stream, opposing formations' legs, the Russian Guard's approach, prior fixes | 26 | 10 | 4 | 12 | 0 | 0 | node probes over the data (`tools/audit-post8/history/`), the registers of readings | `history/README.md`, `result.json` |
| geography: the frame, relief, water, roads, settlements, landmarks, the garden, the crossings | 29 | 17 | 5 | 3 | 4 | 0 | open data (OpenStreetMap ways, Wikidata points, terrain models), the 1825-52 maps as 8H read them, the project's own transform | `geography/README.md`, `raw/` |
| timings, events and places | SC_ROWS | SC_VERIFIED | SC_PARTLY | SC_CONTRA | SC_NOT | SC_INACC | public-domain texts (Stutterheim 1807, the 30th Bulletin, memoirs), the registers of readings, the project's tracks and events | `sources-chronology/ledger.md`, `ledger.json` |

**Coverage, stated plainly.** Most of the map's statements were not traced to a source by this audit. The project's own sourcing stage did
that work (`narrative.js` and its inventory, `docs/step4-evidence/inventory.json`, current: of 704 statements, 148 carry a claim of their own (63 attributed, 65 disputed, 12 interpretation, 6 uncertain, 2 derived), 75 one by class, and 481 none; `docs/step4-evidence/readings.md`, 273
entries). This audit re-traced a sample, chosen for consequence: the force figures a visitor reads first, the hours that carry the battle's
argument, the places where 8J and 8K moved the map, and the claims the records call settled. A row that says "verified" means the source
prints what the map says. It does not mean the map's reading of the battle is the only defensible one.

### E.2 What the ledgers found

- **Forces.** Seven figures are contradicted by the source they cite. The largest group is attributed to Duffy (1977), who does not print them
  (`CL-SRC-01`). Friant's division "about 3,470 in Duffy and Smith": Duffy has 3,800 with 9 guns. The theme "weakness" says "some 4,300 men by
  Duffy's and Smith's count". The IV Column is "13,900 (Duffy 1977; Smith 1998)" while Duffy gives 23,900. One claim is not supported by any
  read source: Bourcier "about 830 sabres present". Seven formations show a working strength with no note, and six of them exceed the 22
  November returns the project reads elsewhere (`CL-SRC-05`). `SOURCE_NOTE` illustrates honest disagreement with an I Column range whose low
  end, 7,750, appears in no source read, only on a popular website (`CL-SRC-04`). "Kologrivov's command is in Sokolov alone" is contradicted by
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
  - the Russian Guard's plotted approach contradicts the register's A readings, and nobody holds Blasowitz when it falls (`CL-HIS-03`);
  - Caffarelli is not where the records say (`CL-HIS-09`);
  - the earlier fix G-3, Miloradovich at dawn, does not hold.

  Eleven of the earlier audit's history fixes hold (H-1, H-2, H-3, H-4, H-12, H-13, H-14, H-18, D-3, D-4, S-5).
- **Geography.** The frame is sound: one scale authority, a similarity transform of true geography, the 17-degree rotation from true north
  disclosed, the villages from the Czech municipality register, the 8J and 8K corrections where their sources put them. Three claims are
  contradicted:
  - the relief is not fitted to surveyed elevations where a visitor reads it most (`CL-GEO-01`);
  - Krug lies 1.67 km from where the 1836-52 survey puts it, while the visitor is told no source fixes it (`CL-GEO-07`);
  - three villages stand on marsh rather than on the village class (`CL-GEO-05`).

  Four claims cannot be verified from what is read: the Pratzen-Austerlitz road, the upper Goldbach and the brooks (`CL-GEO-03`), the bottom's
  marshiness (`CL-GEO-06`), and the castle's walls and the pheasantry's enclosure in 1805 (`CL-GEO-02`).
- **Timings and places.** SC_SUMMARY

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
| the retreat over the Satschan meres and the ice casualties | `SOURCE_NOTE`, `PHASES` | SC_ICE | SC_ICE_AUDIT |
