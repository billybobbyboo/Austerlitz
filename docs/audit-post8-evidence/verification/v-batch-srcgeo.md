# Verification batch `v-batch-srcgeo`: sources-oob #1-#8 and geography #1-#10

Audit after Stage 8, adversarial verification, mixed lens (minor and polish findings). Audited build `austerlitz-command-map.html`, md5
`f10fe585c46aea576f436ed51ac46f83`. The application files at HEAD `55fee3a` are identical to `43e3e5b` (`git diff --stat 43e3e5b` over the
application sources is empty). Done on 2 November 2026 by a machine reader. No application file, data, test, threshold, archive or build was changed,
and no repository check was run. Finding indices are 0-based, as in each area's `result.json`.

**Scripts** (`tools/audit-post8/verification/v-batch-srcgeo/`; read-only, they print and write nothing):
- `banks.js <root>`: geography #1. Uses `geo.js` (`toMap`, `kmBetween`), `GOLDBACH_M` parsed from `world.js`, and the geography area's saved
  Nominatim geometries of the Roketnice and the Říčka.
- `hydro.js <root>`: geography #2. Today's streams measured against every drawn stream.
- `church.js <iso>`: geography #3 and #7. Runs `planBuildings8g` through the geography area's loader on its isolated copy, whose sources are
  md5-identical to the audited ones (1 min 40 s).

Their outputs are kept in `docs/audit-post8-evidence/verification/v-batch-srcgeo/` (`banks.json`, `hydro.json`, `church.json`), with the Duffy
text-layer re-runs in `duffy-fts-v.txt` (`python3 -I tools/audit-post8/sources-oob/ia-fts.py austerlitz18050000duff ...`, 15 queries).

**Page images.** I made my own crops of the sources-oob area's cached scans, kept in the scratchpad and not committed (Sokolov is in copyright):
- Sokolov 2006 t. II, pp. 188, 189, 190, 191, 195 and 197 (leaves n187-n190, n194, n196);
- Schönhals 1873, pp. 177 and 178 (n181, n182);
- the committed Fieffé crop.

| finding | verdict | sev/pri (mine) | method |
|---|---|---|---|
| sources-oob #1 | WEAKENED | S3 / P3 | page images, data, code |
| sources-oob #2 | CONFIRMED | S3 / P3 | page images, register, node count |
| sources-oob #3 | CONFIRMED | S3 / P3 | code, node count |
| sources-oob #4 | CONFIRMED | S3 / P3 | page image, registers, text layer |
| sources-oob #5 | WEAKENED | S3 / P3 | text layer, page images, data |
| sources-oob #6 | CONFIRMED | S4 / P3 | text layer, register |
| sources-oob #7 | WEAKENED | S4 / P4 | crops, djvu text, page images |
| sources-oob #8 | CONFIRMED | S4 / P4 | data, test |
| geography #1 | CONFIRMED | S3 / P3 | own node script |
| geography #2 | CONFIRMED | S3 / P2 | own node script, legend |
| geography #3 | CONFIRMED | S3 / P3 | node re-measure, code |
| geography #4 | WEAKENED | S3 / P3 | code, data |
| geography #5 | CONFIRMED | S3 / P2 | code, data, register |
| geography #6 | CONFIRMED (partial duplicate of history #13) | S3 / P3 | geo.js recomputation |
| geography #7 | CONFIRMED | S4 / P4 | node re-measure, code |
| geography #8 | CONFIRMED | S4 / P4 | code |
| geography #9 | CONFIRMED | S4 / P4 | data, code |
| geography #10 | CONFIRMED | S4 / P4 | code |

## sources-oob

### #1: the III Corps detachment and the IV Column drawn below every figure read. WEAKENED

**Checked on the page images:**
- Sokolov p. 188: Friant "Предположительно на 02.12.1805 3 800**". The paragraph below reads "Даву мог располагать не более чем 3 500—4 000 человек
  из дивизии Фриана и 1 200—1 500 человек из дивизии Бурсье".
- Sokolov p. 189: Bourcier "Всего: 1 900 / Предположительно ... 1 500". Davout's troops "8 975 / 5 300".
- Schönhals p. 177: "Summa der ganzen Colonne . 27 5 2 16118 125". The Russian wing "Summa . 12 2 2 6965 125" (its lines 125 + 2000 + 340 + 1500 + 1500
  = 5,465, with Smolensk blank). The Austrians 9150.
- Sokolov p. 197: "Всего: 27 бат., 5 эск., 76 орудий, 15 900 пех., 300 ка[в]".

**What the map draws:** c_iii 4,300, friant 3,470, bourcier 830, col4 13,900 and milo 4,800 (`data.js:240`, `248`, `263`, `550`, `558`). The
detachment, the column and the Russian wing are below every figure read. Friant's 3,470 sits only 30 under Sokolov's lower bound of 3,500, so the
detachment's gap comes from Bourcier: 830 against 1,200-1,500. The detachment's 4,300 is below Sokolov's prose range (4,700-5,500), his table
(5,300) and Duffy's text layer (6,300).

**Partly wrong:** "their notes omit those figures" does not hold for milo. Its note (`data.js:559`) gives "Schönhals (1873) gives the Russian
wing twelve battalions and 6,965 men", and its range of 4,800-7,000 is on the compact card (`app.js:7812`). col4's range of 12,000-23,900 is
also shown. The omission is real for c_iii, friant and bourcier (Sokolov's 3,800, 3,500-4,000, 1,500, 1,200-1,500 and 5,300) and for col4
(Schönhals's 16,118 and Sokolov's 15,900).

**What "drawn" amounts to:** `subUnits` (`app.js:833-838`) draws Friant with 3 sub-units and Bourcier with 2 at either figure. milo draws 4
battalions, against 6 at 6,965. The visible effect is mostly the numbers shown, the counters' size and rank (`app.js:5126`, `6046`) and the
derived sums.

**Corrected:** the omission is for the c_iii, friant, bourcier and col4 notes, not milo's. Priority P3: this is a 1-2 day data task with
re-measurement, not a quick fix. S3 kept. Origin inherited (`git log -S`: 0a19964 or earlier; step 4's register C5.8 already held Sokolov's
5,300). No owner decision covers these strengths.

### #2: seven bare working figures, six above the 22 November returns. CONFIRMED

**No strengthNote:** a node count over `FORMATIONS` gives kellermann, dhautpoul, walther, rivaud, drouet, guard_inf and guard_cav (34
formations have a plain strength, 3 a range, 2 an army total; heightguns none).

**The returns, against the map:**

| formation | source | 22 November | Sokolov's 2 December estimate | map | over the return |
|---|---|---|---|---|---|
| d'Hautpoul | Sokolov p. 190 | 1,136 | 1,100 | 1,300 | 14.4% |
| Walther | Sokolov p. 190 | 1,340 | 1,200 | 1,500 | 11.9% |
| Kellermann | Sokolov p. 191 | 2,021 | 1,500 | 2,400 | 18.8% |
| Rivaud | C5.9 (`docs/step4-evidence/readings.md:2420-2431`) | 5,216 | | 6,000 | 15.0% |
| Drouet | C5.9 | 6,318 | | 7,000 | 10.8% |
| Guard cavalry | C5.8 (horse 376 + 48 + 599) | 1,023 | | 2,500 | 2.44 times (1.89 times 1,321 with the horse artillery) |

Guard infantry: the map's 3,000 is under Sokolov's 3,309.

**Minor corrections:**
- The six without notes are 11-19% above their returns. The finding's 7% is Nansouty's, and Nansouty has a note.
- "Strength could only have fallen" is overstated. Sokolov's own 2 December estimates rise for Oudinot (5,016 to 5,700) and for the Guard (5,025
  to 5,500, C5.8). The six still exceed both his returns and his estimates.

`SOURCE_NOTE.refs[0]`'s "a figure without a note is this map's" (`data.js:805`) is step 4's disclosure (`CHANGELOG.md:3284-3286`), not an owner
decision. The seven bare figures overlap #3.

### #3: headline strength and guns untagged. CONFIRMED

Code read:
- `compactCard` (`app.js:7791-7813`): the "Army total" row is tagged (`claimTag` on `army.men` and `army.src`, for gqg and ahq). The range row says
  "working figure" (kamensky, col4, milo). Otherwise `row("Strength","≈ N men")` has neither tag nor note: 34 formations.
- `dossierFormation` (`app.js:7974-7978`): the "Approximate strength" and "Guns" rows are untagged; only the strength note is tagged.
- The step-4 classes (`tools/step4/statements.js:15-40`) match strings, so the numbers are outside the inventory.

The two army totals are the exception to "wherever they appear". The remedy is presentation only and conflicts with no decision (decision 187 tags
statements, and the numbers are not statements in the inventory).

### #4: "Kologrivov's command ... in Sokolov alone". CONFIRMED

- Schönhals p. 178, read on my crop: "K. russische Garden | Grossfürst Constantin | Waren am Morgen in Schlachtordnung | GL. Kollowrizow | GM.
  Jancowitz", with Kollowrizow in the "Divisionen" column over all ten rows.
- Stage 6B's reading (`docs/stage6-evidence/readings-composition.md:548`): "a second source for that name".
- C6.n7 (`docs/step4-evidence/readings.md:3301`) searched with `Кологрив|Kologri|Kolagri|Kologriw|Колог`, which cannot match "Kollowrizow".
- Duffy's text layer, re-run: "Lt.-Gen. of Cavalry Kologrivov".
- The wording: `data.js:640` "in Sokolov alone" and `data.js:799` "rests on Sokolov alone" (e7f0df1, step 4 K11).

**Nuances:**
- rg_cav's note already cites Schönhals p. 178 for the four cavalry rows. rg_inf's credits Duffy only.
- Schönhals puts Kollowrizow over the whole Guard, so the question of his cavalry command can stay open; "alone" cannot.

**For consolidation:** history #13's remedy writes "Sokolov alone" into rg_cav's commander field, which would spread the wording this finding
refutes.

### #5: the I Column's 7,750 in SOURCE_NOTE. WEAKENED

- Duffy's text layer, re-run: "7,752", "7,750" and "14,200" each have 0 hits.
- Schönhals p. 177 gives 13,730, and his recapitulation 12,730 (read on the scan). With Duffy's 13,650 (text layer) and Sokolov's 13,800 + 200
  (ledger), the figures read run 12,730-14,000.
- No source read gives 7,750 (`data.js:796`, `485`).

**Not established:** "appears only on a popular website". It rests on a search result's summary (the page answered 503) and was not reproduced.
Smith 1998, Goetz, Castle, Bowden and Chandler were not searched.

**Corrected title:** "... whose low end (7,750) no source read gives; the three sources read give 12,730-14,000; its origin is not established".
S3/P3 kept. The statement's message (strengths are uncertain) is true, as the IV Column's 13,900 against 23,900 shows; its example is unsourced.

### #6: army-total notes. CONFIRMED

- Duffy's text layer, re-run: "85,400" has 0 hits; "between 80,000 and 87,000 troops, with 278 pieces"; "may well have stood at as little as
  60,000".
- C5.26 (`readings.md:2615-2625`): Mikhailovsky-Danilevsky 1844 p. 171, "до 90,000".
- What the map says: `data.js:152`, `154`, `444`, `446` as quoted.
- The evidence is a zero hit on an OCR layer. Smith (not read) may print 85,400, so the joint attribution may hold for Smith, though not for Duffy.

### #7: stronger sources uncredited, locator slips. WEAKENED

**Confirmed:**
- The Fieffé crop shows the quoted passage in the body text. The footnote "(A)" concerns an arrêté of 5 pluviôse an VI, so `appearance.js:160`'s
  "footnote" is wrong.
- The 30th Bulletin (`corr11_djvu.txt` lines 24241-24242): "Il avait avec lui la division Friant et les dragons de la division du général
  Bourcier". It is not cited at `data.js:267`.
- Schönhals p. 177: "GM. Kamerskay" braces Kurskoy, Riasky and Tanagorsky, each 3 battalions and 2000 men.

**Wrong:** "Schönhals and Sokolov ... print it". Sokolov p. 195 gives battalions only ("3 б-на") and the column's 10,840, and puts Kursk under
Olsufiev 3rd. Corrected accordingly; S4/P4 kept.

**Not re-checked:** Duffy's working figures and Viskovatov pp. 229-230.

### #8: owner-decided force claims consistent. CONFIRMED

- Decision 184: Kienmayer 6,340 (`data.js:470`).
- Decision 202 (b): Bourcier's departure at 300 (05:00) with Friant (`data.js:266-268`).
- Decision 210 (c): the Guard infantry's commander "Not established on the day" (`data.js:628`).
- Decision 213 (b): the corps 10,500 against 7,330 drawn, acknowledged in `test.js:477-478`.
- Decision 243 (a): the drivers' letter quoted, its inference labelled (`appearance.js:856`).

Accepted compromise.

## geography

### #1: the Goldbach between Girzikowitz and Sokolnitz. CONFIRMED

`banks.js` against the saved OSM geometries:

| point | drawn bed | today's channel | bank swapped |
|---|---|---|---|
| Girzikowitz [233,162] | 172 m east (x 239.0) | Roketnice, 170 m west (x 227.6) | yes |
| Kobelnitz [205,277] | 79 m east (207.5) | Říčka, 91 m west (201.6) | yes |
| Puntowitz [213,222] | 45 m west | 238 m west | no |
| Sokolnitz [208,365] | 207 m east | 206 m east | no |
| sthilaire@2 | 146 m east of the anchor | 62 m west of the anchor (the anchor across) | yes |

- The Roketnice's mouth is at map [202.6, 225.3].
- The drawn bed's largest gap to today's channel over y 176-309 is 336 m, at [207.9, 261].
- `world.js:47-50`: north of y 309.8 there is "no period map read". The legacy vertices predate Stage 8.

**Caveats:**
- The measure is against regulated modern channels; the 1805 course is not established.
- Nominatim's "Zlatý potok" returns the Říčka relation (`raw/nominatim-water-zlaty.json`). North of the Roketnice's mouth, reading the Roketnice
  as the Goldbach is the area's inference.
- vandamme@2 ("Crosses the Goldbach") also stands 238 m west of the drawn bed and 125 m west of today's.

### #2: schematic, unlabelled hydrography. CONFIRMED

`hydro.js`, over the 680 x 500 frame (`tools/map-frame.js`):
- The Tvaroženský potok runs 4.10 km in the frame, all of it over 300 m from every drawn stream (max 3,029 m).
- The Říčka runs 20.24 km in the frame, 13.08 km of it over 300 m from any drawn stream (max 6,363 m).
- The drawn upper Goldbach (y 109-176) lies 255-1,153 m from today's nearest channel.

The area's figures (4.65 km, 275 m) differ slightly; the geometry source accounts for it.

**Labelling:** the legend has only "meres: pond outlines schematic" (`shell.html:248`) and no stream row. `SOURCE_NOTE` names only the reverse
gradients.

**The cavalry:** Kellermann, Nansouty, d'Hautpoul and Walther (leg 0->5) cross the drawn reach [250,109]-[240,160] at y 125-152.

No owner decision covers the streams' courses (decision 27 covers the meres).

### #3: villages standing in marsh. CONFIRMED

`church.js`, buildings on the village class:

| village | on the village class | marsh | water |
|---|---|---|---|
| Sokolnitz | 4 of 27 | 21 | 2 |
| Telnitz | 2 of 25 | 20 | 3 |
| Kobelnitz | 3 of 16 | 9 | 4 |
| Puntowitz | 14 of 19 | | |
| Satschan | 10 of 14 | | |

**Why:**
- `covMarsh` is 1 inside 0.6 of an ellipse's radius (`world.js:352`).
- The village centres lie at normalised distances 0.566 (Sokolnitz, MARSH[0]), 0.571 and 0.551 (Telnitz, MARSH[0] and [1]), and 0.248 and 0.285
  (Kobelnitz, MARSH[4] and [6]).
- `coverClass` returns marsh (`world.js:316`) before village (`:317`).

Origin: the cause is inherited (MARSH and the class order predate Stage 8; Sokolnitz was also inside the ellipse before 8J), made visible by 8G's
buildings and recorded open in `docs/STAGE8_SPEC.md:4700-4702`.

### #4: marshiness told as settled; no crossing check. WEAKENED

**The marsh, stated as settled:**
- `analysis.js:371`: "a small stream in a marshy bottom". This is TOUR[0], the opening's first step (`OPENING.stops [0,5,6,7]`, `app.js:4710`).
- `data.js:686`: "Small stream in a marshy valley".
- Neither statement has a claim. `SOURCE_NOTE.body[5]` (`data.js:799`) never mentions the marsh, though `docs/STAGE8_SPEC.md:5101-5102` lists the
  marshiness as unresolved.

**The check:**
- `crossingProblem` (`app.js:3391-3400`) fails a pond crossing unless the pond is iced.
- It fails a marsh crossing (marsh > 0.50, road < 0.35) only outside 22 map units of every village (`nearSettlement`, `:3384-3389`).
- It never tests streams.

**Corrected:** "no check can fail a ... marsh crossing" is overstated. The rule can fail marsh away from villages: MARSH[5]'s centre [324,343] is
1.2 km from Hostieradek. Corrected title: "... the movement audit never tests stream crossings and exempts marsh within 695 m of any village". The
check half overlaps history #9 and history #15.

### #5: "walled castle" and "pheasantry enclosure". CONFIRMED

**Where it is stated:**
- `data.js:68` (PHASES[2].lede).
- `paintDispatch` writes the lede untagged (`app.js:7670`).
- None of PHASES[#2].lede, FEATURES[#sokolnitz].sub or prz's phase-2 act (`data.js:536`) has a claim.

**What the records say:**
- `narrative.js:90-91`: "this map's record, not checked here".
- `docs/stage8-evidence/8h/geo/proposal.md:67`: "no wall drawn in 1825".
- `appearance.js:1015-1021`: the orchard wall disputed and not drawn.
- The sheet: "No wall round its pheasantry is drawn" (`app.js:8498`).

**Nuance:** "enclosure" alone is weaker. A Fasangarten is an enclosed preserve, and an 1825 sketch without the carmine wall line does not exclude a
fence. "Walled" is the substantive overclaim. Origin inherited.

### #6: Krug. CONFIRMED, a partial duplicate of history #13

Recomputed with `geo.js`:
- Wikidata's Kruh (Q1790108) maps to [322.21, 88.85].
- The drawn Krug [339,139] is 1,671 m from it.
- Kruh is 562 m from the drawn Holubitz; the drawn Krug is 1,580 m from it.
- The drawn Bellowitz is 1,302 m from Bedřichovice.

**The wording:**
- `data.js:799` says "which no source read fixes" (c3e6299, step 4).
- 8K's register (`docs/stage8-evidence/8k/register.md:36`) read "Kruch" beside Holubitz and gives the drawn Krug as 2.9 km away; measured, it is
  1.67 km.

**Merge with history #13's Krug part:** this finding adds the inaccurate reason and the register's figure.

### #7: the Pratzen church. CONFIRMED

- The church is drawn at [281.33, 252.89], 161 m (2.55 world units) from `LANDMARK_SITES.church.Pratzen` [277.0, 255.6] (`world.js:162`).
- The self-test admits 5.0 world units, 316 m (`app.js:14147-14149`).
- The sheet says "Pratzen's, drawn at its own site outside the village" (`app.js:8497`, 0ed98b9, 8J).

8J moved the church from 399 m off (`world.js:160-161`) to 161 m off: the drawing improved, and the text overclaims. Origin: Stage 8 (8J).

### #8: "exaggerated about 1 times". CONFIRMED

- `data.js:797`: "Terrain relief is exaggerated about {EXAG} times".
- `geoText` (`app.js:8590-8592`) replaces `{EXAG}` with `fmtFactor(DISPLAY.factor)`.
- `fmtFactor` returns "1" at 1 (`app.js:2575`).

### #9: two carried questions invisible. CONFIRMED

- `SOURCE_NOTE.body[5]` (`data.js:799`) has no "channel", "highway" or "road".
- `FEATURES[#olmutzroad]` (`data.js:768-771`) states its course and has no claim of its own.
- Both questions sit in code comments only (`world.js:47-50`, `66-71`).

### #10: decisions 27 and 266 (a) as decided. CONFIRMED

- The legend row (`shell.html:248`).
- The area's planner record: the castle at scale 0.2, its ranges 40 m from the site; decision 266 (a) (`docs/STAGE8_SPEC.md:5189`, `5228`).

## Extra issue

**STAGE8_SPEC section 21.9 says its unresolved questions are "kept open in the data and the sources sheet; none is guessed"
(`docs/STAGE8_SPEC.md:5101`).** Four of them are absent from `SOURCE_NOTE.body[5]` (`data.js:799`):
- the highway's 1805 course;
- the Goldbach's channel north of the castle;
- the castle's walls;
- the bottom's marshiness.

Two of the four are stated as settled on primary paths (geography #4 and #5). S4: a records inaccuracy in the settled baseline.

## Not done

- Duffy's pages were not opened (a lending item). The Duffy statements rest on the OCR text layer, re-run here.
- Smith, Goetz, Castle, Bowden and Chandler were not searched.
- Sokolov p. 193 and pp. 183-185 were not re-read on the image: registers C5.8 and C5.9 were relied on.
- The 1805 hydrography was not established.
- The area's crossing counts were not recomputed; only the four cavalry crossings of the upper reach were checked by hand.
- No browser run: every verdict here rests on code, data, sources or node.
