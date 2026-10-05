# Stage 6 census: what is drawn for every formation today (austerlitz-command-map.html)

`node tools/stage6/census.js`, read from the running page at 09:30 (the scene, not the documents). World unit = 63.20 m.

## The figure kit (`figKit`): every part's colour as drawn

"instance" is the formation's coat colour (`NATION[f.nation].fill`, each figure jittered 0.86-1.14). Extents in world units.

| geometry | colour | vertices | x | y (height) | z |
|---|---|---|---|---|---|
| infCoat (top 1.18) | instance | 108 | -0.29 to 0.29 | 0.62 to 1.18 | -0.12 to 0.199 |
| infFixed (top 1.981) | #BDB8AC | 72 | -0.155 to 0.155 | 0 to 0.62 | -0.09 to 0.09 |
| infFixed (top 1.981) | #C9A98A | 240 | -0.115 to 0.115 | 1.185 to 1.415 | -0.115 to 0.115 |
| infFixed (top 1.981) | #2E2B27 | 84 | -0.127 to 0.127 | 1.365 to 1.635 | -0.117 to 0.13 |
| infFixed (top 1.981) | #3A2E22 | 36 | -0.14 to 0.14 | 0.81 to 1.11 | -0.27 to -0.13 |
| infFixed (top 1.981) | #4A3826 | 36 | 0.185 to 0.355 | 0.502 to 1.738 | -0.014 to 0.254 |
| infFixed (top 1.981) | #8A8E92 | 36 | 0.299 to 0.361 | 1.659 to 1.981 | 0.016 to 0.104 |
| horse (top 1.42) | #5A4232 | 252 | -0.19 to 0.19 | 0 to 1.42 | -0.525 to 0.96 |
| horse (top 1.42) | #2E2B27 | 36 | -0.03 to 0.03 | 0.637 to 0.963 | -0.689 to -0.431 |
| horse (top 1.42) | #3A2E22 | 36 | -0.15 to 0.15 | 0.97 to 1.05 | -0.22 to 0.22 |
| rider (top 1.55) | instance | 108 | -0.27 to 0.27 | 1.05 to 1.55 | -0.11 to 0.173 |
| riderFixed (top 2.015) | #C9A98A | 240 | -0.115 to 0.115 | 1.565 to 1.795 | -0.115 to 0.115 |
| riderFixed (top 2.015) | #2E2B27 | 84 | -0.127 to 0.127 | 1.745 to 2.015 | -0.117 to 0.13 |
| riderFixed (top 2.015) | #BDB8AC | 72 | -0.195 to 0.195 | 0.797 to 1.163 | -0.093 to 0.193 |
| riderFixed (top 2.015) | #8A8E92 | 36 | 0.194 to 0.366 | 1.14 to 1.96 | -0.159 to 0.359 |

Figure top (`figureTop`): on foot 1.981 units (125 m drawn), mounted 2.015 units. Standard ratio `STD_RATIO` 1.6 (provisional, decisions 26 and 36); pole geometry 5.2 units before scaling.

Shared geometries never drawn (`initBlockGeo`, created and unused): shako, bear, musket, sabre, body, horse, rider. `formationAtlas` defined: true (never called).

## The flag textures (`flagTexture`), sampled

| nation | colour | share of the cloth | columns (of 128) | rows (of 64) |
|---|---|---|---|---|
| fr | #2C4C9C | 0.344 | 2-42 | 2-62 |
| fr | #B3302E | 0.344 | 86-126 | 2-62 |
| fr | #E9E2D2 | 0.313 | 46-82 | 2-62 |
| ru | #2E7A48 | 0.736 | 2-126 | 2-62 |
| ru | #E9E2D2 | 0.264 | 2-126 | 2-62 |
| at | #E9E2D2 | 0.633 | 2-126 | 10-50 |
| at | #C8A03A | 0.313 | 2-126 | 2-62 |
| at | #2A2622 | 0.039 | 54-70 | 22-38 |

## Per formation

Coat: the instance colour's base (the nation's fill) and the share in a second nation's (`f.mix`). Every figure on foot and every rider wears the same black cylinder (the kit's `shako`); every man the same breeches; every horse the same brown. Standards: how many, the cloth in world units.

| id | name | ech | nation | arm | drawn | men / riders / horses / barrels | coat as drawn | standards (cloth, units) | counter fill / side band |
|---|---|---|---|---|---|---|---|---|---|
| gqg | Imperial Headquarters | army | fr | hq | headquarters: marquee, 4 tents, 12 mounted escort | 0 / 12 / 12 / 0 | #2E5496 | 1 x 1.17 x 0.683 (fr flag) | #2E5496 / #4C86D8 |
| c_iv | IV Corps | corps | fr | inf | counter and name only | - | - | - | #2E5496 / #4C86D8 |
| heightguns | French guns on the heights | bde | fr | art | battery: guns, crews (infantry kit), limbers and teams | 30 / 0 / 24 / 12 | #2E5496 | 1 x 1.17 x 0.683 (fr flag) | #2E5496 / #4C86D8 |
| sthilaire | Saint-Hilaire's Division | div | fr | inf | infantry ranks, skirmishers, 2 mounted officers | 160 / 2 / 2 / 0 | #2E5496 | 2 x 1.463 x 0.853 (fr flag) | #2E5496 / #4C86D8 |
| vandamme | Vandamme's Division | div | fr | inf | infantry ranks, skirmishers, 2 mounted officers | 160 / 2 / 2 / 0 | #2E5496 | 2 x 1.463 x 0.853 (fr flag) | #2E5496 / #4C86D8 |
| legrand | Legrand's Division | div | fr | inf | infantry ranks, skirmishers, 2 mounted officers | 160 / 2 / 2 / 0 | #2E5496 | 2 x 1.463 x 0.853 (fr flag) | #2E5496 / #4C86D8 |
| c_iii | III Corps (detachment) | corps | fr | inf | counter and name only | - | - | - | #2E5496 / #4C86D8 |
| friant | Friant's Division | div | fr | inf | infantry ranks, skirmishers, 2 mounted officers | 88 / 2 / 2 / 0 | #2E5496 | 2 x 1.463 x 0.853 (fr flag) | #2E5496 / #4C86D8 |
| bourcier | Bourcier's Dragoons | div | fr | cav | cavalry ranks | 0 / 20 / 20 / 0 | #2E5496 | 1 x 1.19 x 0.694 (fr flag) | #2E5496 / #4C86D8 |
| c_v | V Corps | corps | fr | inf | counter and name only | - | - | - | #2E5496 / #4C86D8 |
| caffarelli | Caffarelli's Division | div | fr | inf | infantry ranks, skirmishers, 2 mounted officers | 160 / 2 / 2 / 0 | #2E5496 | 2 x 1.463 x 0.853 (fr flag) | #2E5496 / #4C86D8 |
| suchet | Suchet's Division | div | fr | inf | infantry ranks, skirmishers, 2 mounted officers | 136 / 2 / 2 / 0 | #2E5496 | 2 x 1.463 x 0.853 (fr flag) | #2E5496 / #4C86D8 |
| santon | The Santon detachment | bde | fr | inf | infantry ranks, skirmishers, 2 mounted officers, an attached battery | 64 / 2 / 2 / 6 | #2E5496 | 1 x 1.463 x 0.853 (fr flag) | #2E5496 / #4C86D8 |
| c_cav | Cavalry Reserve | corps | fr | cav | counter and name only | - | - | - | #2E5496 / #4C86D8 |
| kellermann | Kellermann's Light Cavalry | div | fr | cav | cavalry ranks | 0 / 30 / 30 / 0 | #2E5496 | 1 x 1.19 x 0.694 (fr flag) | #2E5496 / #4C86D8 |
| nansouty | Nansouty's Cuirassiers | div | fr | cav | cavalry ranks | 0 / 20 / 20 / 0 | #2E5496 | 1 x 1.19 x 0.694 (fr flag) | #2E5496 / #4C86D8 |
| dhautpoul | d'Hautpoul's Cuirassiers | div | fr | cav | cavalry ranks | 0 / 20 / 20 / 0 | #2E5496 | 1 x 1.19 x 0.694 (fr flag) | #2E5496 / #4C86D8 |
| walther | Walther's Dragoons | div | fr | cav | cavalry ranks | 0 / 20 / 20 / 0 | #2E5496 | 1 x 1.19 x 0.694 (fr flag) | #2E5496 / #4C86D8 |
| c_i | I Corps | corps | fr | inf | counter and name only | - | - | - | #2E5496 / #4C86D8 |
| rivaud | Rivaud's Division | div | fr | inf | infantry ranks, skirmishers, 2 mounted officers | 136 / 2 / 2 / 0 | #2E5496 | 2 x 1.463 x 0.853 (fr flag) | #2E5496 / #4C86D8 |
| drouet | Drouet d'Erlon's Division | div | fr | inf | infantry ranks, skirmishers, 2 mounted officers | 160 / 2 / 2 / 0 | #2E5496 | 2 x 1.463 x 0.853 (fr flag) | #2E5496 / #4C86D8 |
| c_gd | Imperial Guard | corps | fr | guard | counter and name only | - | - | - | #2E5496 / #4C86D8 |
| guard_inf | Guard Infantry | div | fr | guard | infantry ranks, skirmishers, 2 mounted officers | 88 / 2 / 2 / 0 | #2E5496 | 2 x 1.463 x 0.853 (fr flag) | #2E5496 / #4C86D8 |
| guard_cav | Guard Cavalry | div | fr | cav | cavalry ranks | 0 / 30 / 30 / 0 | #2E5496 | 1 x 1.19 x 0.694 (fr flag) | #2E5496 / #4C86D8 |
| c_gren | Grenadier Division | div | fr | inf | infantry ranks, skirmishers, 2 mounted officers | 136 / 2 / 2 / 0 | #2E5496 | 2 x 1.463 x 0.853 (fr flag) | #2E5496 / #4C86D8 |
| ahq | Allied Headquarters | army | ru | hq | headquarters: marquee, 4 tents, 12 mounted escort | 0 / 12 / 12 / 0 | #3E6B4A | 1 x 1.17 x 0.683 (ru flag) | #3E6B4A / #D4703A |
| buxhowden | Left Wing Command | corps | ru | hq | headquarters: marquee, 4 tents, 12 mounted escort | 0 / 12 / 12 / 0 | #3E6B4A | 1 x 1.17 x 0.683 (ru flag) | #3E6B4A / #D4703A |
| kienmayer | Kienmayer's Advance Guard | div | at | mixed | infantry ranks with horse behind | 160 / 10 / 10 / 0 | #D9D2BF | 2 x 1.463 x 0.853 (at flag) | #D9D2BF / #D4703A |
| dok | First Column | div | ru | inf | infantry ranks, skirmishers, 2 mounted officers | 184 / 2 / 2 / 0 | #3E6B4A | 3 x 1.463 x 0.853 (ru flag) | #3E6B4A / #D4703A |
| lang | Second Column | div | ru | inf | infantry ranks, skirmishers, 2 mounted officers | 184 / 2 / 2 / 0 | #3E6B4A | 3 x 1.463 x 0.853 (ru flag) | #3E6B4A / #D4703A |
| kamensky | Kamensky's Brigade | bde | ru | inf | infantry ranks, skirmishers, 2 mounted officers | 112 / 2 / 2 / 0 | #3E6B4A | 2 x 1.463 x 0.853 (ru flag) | #3E6B4A / #D4703A |
| prz | Third Column | div | ru | inf | infantry ranks, skirmishers, 2 mounted officers | 184 / 2 / 2 / 0 | #3E6B4A | 3 x 1.463 x 0.853 (ru flag) | #3E6B4A / #D4703A |
| col4 | Fourth Column | corps | at | inf | counter and name only | - | - | - | #D9D2BF / #D4703A |
| milo | Miloradovich's Russians | div | ru | inf | infantry ranks, skirmishers, 2 mounted officers | 112 / 2 / 2 / 0 | #3E6B4A | 2 x 1.463 x 0.853 (ru flag) | #3E6B4A / #D4703A |
| kollo | Kollowrat's Austrians | div | at | inf | infantry ranks, skirmishers, 2 mounted officers | 184 / 2 / 2 / 0 | #D9D2BF | 3 x 1.463 x 0.853 (at flag) | #D9D2BF / #D4703A |
| lich | Fifth Column (cavalry) | corps | ru | cav | cavalry ranks | 0 / 60 / 60 / 0 | #3E6B4A (20% #D9D2BF) | 1 x 1.19 x 0.694 (ru flag) | #3E6B4A / #D4703A |
| bag | Advance Guard of the Right | corps | ru | inf | infantry ranks, skirmishers, 2 mounted officers | 184 / 2 / 2 / 0 | #3E6B4A | 3 x 1.463 x 0.853 (ru flag) | #3E6B4A / #D4703A |
| constantine | Russian Imperial Guard | corps | ru | guard | counter and name only | - | - | - | #3E6B4A / #D4703A |
| rg_inf | Guard Infantry | div | ru | guard | infantry ranks, skirmishers, 2 mounted officers | 160 / 2 / 2 / 0 | #3E6B4A | 2 x 1.463 x 0.853 (ru flag) | #3E6B4A / #D4703A |
| rg_cav | Guard Cavalry | div | ru | cav | cavalry ranks | 0 / 40 / 40 / 0 | #3E6B4A | 1 x 1.19 x 0.694 (ru flag) | #3E6B4A / #D4703A |

## Where nationality and side are carried today

- Legend nation rows: French rgb(46, 84, 150); Russian rgb(62, 107, 74); Austrian rgb(217, 210, 191).
- First-run key: "Blue is the French army. The Allies are green for Russia and white for Austria, and their movement arrows are drawn in amber. The high ground in the centre is the Pratzen plateau, and it decides the battle."
