# Stage 5 Part A: the evidence census

`node tools/stage5/census.js` on the live sources (the model in node, `tools/stage2/model.js`). Fact: counted from the data and the app's own functions; nothing is changed.

## Grades per phase (leaf formations on the field at the phase's start · middle · last minute; A/B/C, * interpolated)

| phase | start A/B/C (interp) | middle | end |
|---|---|---|---|
| 0 Deployment (04:00 - 07:00) | 17/10/3 (0) | 17/10/3 (21) | 17/10/3 (21) |
| 1 Telnitz (07:00 - 08:00) | 17/10/3 (15) | 17/10/3 (21) | 17/10/3 (21) |
| 2 Sokolnitz (08:00 - 08:45) | 18/10/3 (9) | 15/12/4 (20) | 16/11/4 (20) |
| 3 The Pratzen (08:45 - 09:30) | 18/9/4 (13) | 15/12/4 (23) | 15/12/4 (23) |
| 4 Pratzeberg (09:30 - 10:30) | 15/12/4 (16) | 14/13/4 (25) | 14/13/4 (27) |
| 5 Olmutz road (10:30 - 11:15) | 16/11/4 (14) | 15/12/4 (27) | 15/12/4 (27) |
| 6 The Guard (11:15 - 12:45) | 16/11/4 (9) | 16/10/5 (24) | 16/10/5 (25) |
| 7 The wheel (12:45 - 14:30) | 16/10/6 (3) | 15/11/6 (26) | 14/12/6 (28) |
| 8 The ponds (14:30 - 17:00) | 15/13/4 (9) | 15/13/4 (27) | 15/13/4 (28) |
| 9 Reckoning (After dark) | 14/13/4 (0) | 14/13/4 (0) | 14/13/4 (0) |

Formation-samples every 10 minutes over the day: 2636; A 1322 (50.2%), B 970 (36.8%), C 344 (13.1%); interpolated 1779 (67.5%).
Formations with no explicit cf anywhere (graded B by stateAt's default): none.
Grade set on an entry with no position (the grade changes, the position is carried): none.

## Anchors, legs and timing

Anchors 180 (A 101, B 60, C 19); legs 148 (18 with vias); leg minutes 18735 of 26055 formation-minutes on the field (71.9%).
Explicit timing (tm): 20 anchors; grade {"A":0,"B":12,"C":8}; basis {"app narrative, unsourced":20}; derived arrivals 7 {"moveMin":1,"ceiling":3,"tactical":3}, flagged 3.

## Events

25 events: 14 instants, 11 intervals; at most 5 windows open at once (at 750 min). Interval lengths (min): counter-march 225, columns-move 180, guard-attack 120, guard-broken 120, buxhowden-blind 60, wheel 60, raigern 45, hq-forward 40, davout 30, soult 30, decision 20. Event cf: {"A":14,"B":10,"C":1}.

## Knowledge (every 10 minutes; o: an override in KNOW_OVERRIDE, c: computed by line of sight and the fog rule)

- French headquarters on the Allies: {"c:unknown":530,"o:uncertain":112,"c:seen":225,"c:uncertain":10,"o:unknown":9,"o:seen":188}
- Allied headquarters on the French: {"c:unknown":692,"o:unknown":334,"c:seen":71,"c:uncertain":2,"o:seen":391,"o:uncertain":72}
- within a phase, the reading at a later clock differs from the phase's first in 73 of 961 French and 52 of 1397 Allied samples (the page caches per phase). Examples: fr ahq 450: c:unknown -> c:seen; fr ahq 460: c:unknown -> c:seen; fr ahq 470: c:unknown -> c:seen; fr kienmayer 470: c:unknown -> c:uncertain; fr kollo 470: c:unknown -> c:seen; fr kienmayer 510: c:uncertain -> c:unknown
- COMMAND statements: {"fr":{"saw/doc":6,"knew/doc":6,"didnt/inf":2,"ordered/doc":9,"expected/doc":1,"saw/inf":1},"al":{"knew/doc":6,"didnt/doc":3,"didnt/inf":2,"ordered/doc":6,"expected/doc":1,"saw/doc":3}}; KNOW_OVERRIDE entries: {"fr":5,"al":10}.

## Plans against the tracks

| side | column | route km | formation: largest distance from the route (km), share of samples within 1 km, last distance from the objective (km) |
|---|---|---|---|
| al | Advance Guard - Kienmayer | 3.28 | kienmayer: 1.41, 0.86, 2.01 |
| al | 1st Column - Dokhturov | 4.95 | dok: 1.45, 0.85, 3.47 |
| al | 2nd Column - Langeron | 3.7 | lang: 1.68, 0.74, 3.07 |
| al | 3rd Column - Przybyszewski | 3.58 | prz: 0.66, 1, 1.22 |
| al | 4th Column - Kollowrat and Miloradovich | 4.34 | milo: 4.8, 0.47, 9.18; kollo: 5.12, 0.54, 9.47 |
| al | 5th Column - Liechtenstein | 3.52 | lich: 5.51, 0.51, 5.83 |
| al | Advance Guard of the Right - Bagration | 2.21 | bag: 1.82, 0.91, 4.03 |
| al | Reserve - Constantine | 2.22 | rg_inf: 2.5, 0.74, 2.82; rg_cav: 2.91, 0.71, 3.2 |
| fr | The bait - Legrand, then Davout | 3.14 | legrand: 0.45, 1, 0.74; friant: 6.46, 0.74, 0.32 |
| fr | The concealed centre - Soult | 3.37 | sthilaire: 3.39, 0.71, 3.33 |
| fr | The second axis - Vandamme | 2.97 | vandamme: 5.04, 0.66, 5.04 |
| fr | The pivot - Lannes and Murat | 3 | suchet: 0.59, 1, 0.59; caffarelli: 4.08, 0.41, 4.08; santon: 0.29, 1, 2.9 |
| fr | In hand - Bernadotte, the Guard, the grenadiers | 3.87 | guard_inf: 1.27, 0.82, 1.28; guard_cav: 0.82, 1, 0.82; c_gren: 5.07, 0.64, 5.08; drouet: 0.94, 1, 0.94 |
| fr | The wheel | 3.95 | sthilaire: 2.89, 0.36, 1.4; vandamme: 3.33, 0.35, 0.25 |

The phase-0 axis arrows (OVERLAYS) against the PLANS routes of the same columns:
- I Column → Telnitz vs 1st Column - Dokhturov: 3 and 5 points, the axis arrow at most 0.08 km off the plan route, the largest distance between them 2.12 km, their ends 2.12 km apart
- II Column → Sokolnitz vs 2nd Column - Langeron: 3 and 4 points, the axis arrow at most 0.13 km off the plan route, the largest distance between them 1.5 km, their ends 1.5 km apart
- III Column → the castle vs 3rd Column - Przybyszewski: 3 and 4 points, the axis arrow at most 0.09 km off the plan route, the largest distance between them 1.39 km, their ends 1.39 km apart
- IV Column → Kobelnitz vs 4th Column - Kollowrat and Miloradovich: 3 and 4 points, the axis arrow at most 0.08 km off the plan route, the largest distance between them 0.32 km, their ends 0.32 km apart

## Day-tracks

| formation | anchors (places) | extent km | length km | shortest leg km | grades |
|---|---|---|---|---|---|
| gqg | 4 (4) | 4.17 x 6.89 | 9.37 | 0.64 | AAAB |
| heightguns | 3 (2) | 0.41 x 2.34 | 2.37 | 2.37 | CBB |
| sthilaire | 9 (9) | 2.75 x 5.34 | 8.76 | 0.2 | AAAAAAABB |
| vandamme | 8 (8) | 2.91 x 6.13 | 9.35 | 0.37 | AAAAAAAA |
| legrand | 7 (7) | 0.7 x 2.56 | 7.15 | 0.4 | AAABBBB |
| friant | 7 (7) | 6.19 x 3.32 | 7.61 | 0.14 | BBAAAAA |
| bourcier | 5 (5) | 8.69 x 3.63 | 9.49 | 0.55 | CCCCC |
| caffarelli | 6 (6) | 5.78 x 0.82 | 5.89 | 0.79 | AAAAAA |
| suchet | 6 (6) | 3.03 x 1.86 | 3.61 | 0.41 | ABBBBB |
| santon | 1 (1) | 0 x 0 | 0 | - | A |
| kellermann | 5 (5) | 4.46 x 0.54 | 4.5 | 0.89 | BAAAA |
| nansouty | 5 (5) | 4.96 x 0.57 | 5.04 | 0.96 | BAAAA |
| dhautpoul | 4 (4) | 5.15 x 0.54 | 5.25 | 1.08 | BBBB |
| walther | 4 (4) | 4.9 x 0.57 | 4.98 | 0.79 | CCCC |
| rivaud | 5 (5) | 4.58 x 1.36 | 5.33 | 0.81 | BBBBB |
| drouet | 5 (5) | 4.74 x 1.26 | 5.31 | 0.63 | BBAAA |
| guard_inf | 4 (4) | 3.29 x 3.16 | 5.35 | 0.56 | AAAA |
| guard_cav | 4 (4) | 3.22 x 2.62 | 4.69 | 0.35 | AAAA |
| c_gren | 5 (5) | 2.72 x 6.57 | 8.45 | 0.57 | BBBBB |
| ahq | 6 (6) | 5.91 x 2.91 | 10.85 | 0.35 | BABBBB |
| buxhowden | 5 (5) | 1.33 x 3.35 | 5.41 | 0.98 | CCCBB |
| kienmayer | 6 (6) | 2.4 x 2.18 | 7.98 | 0.46 | AAABAA |
| dok | 6 (6) | 2.09 x 3.07 | 7.18 | 0.29 | AAAAAA |
| lang | 7 (7) | 1.83 x 2.21 | 5.49 | 0.58 | AAACCCC |
| kamensky | 7 (7) | 4.36 x 3 | 5.57 | 0.43 | BAAABCC |
| prz | 6 (6) | 1.99 x 1.96 | 3.91 | 0.27 | AAAAAA |
| milo | 7 (7) | 5.85 x 2.15 | 7.78 | 0.29 | AAABBBB |
| kollo | 8 (8) | 5.69 x 3.86 | 11.11 | 0.13 | AAABBBBB |
| lich | 8 (8) | 5.47 x 4.2 | 8.83 | 0.73 | BAAAAAAA |
| bag | 6 (6) | 3.29 x 1.71 | 5.6 | 0.72 | BBBBBB |
| rg_inf | 6 (6) | 4.68 x 1.83 | 8.02 | 1.12 | AAAAAA |
| rg_cav | 5 (5) | 5.06 x 1.93 | 8.92 | 1.36 | AAAAA |

## Duplicate keys in the data's object literals

- data.js:180 cf (also line 178)
