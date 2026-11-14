# Visibility over long playback: the tables

Made by `tools/audit-post8/visibility/analyse.js` from `runs/` (`long-play.js`, `realtime.js`). Build austerlitz-command-map.html (md5 8c0d383eb45a6f2a5522d04863824b7b), Chromium 141.0.7390.37.
Codes per frame: drawn, hidden by the layout (held or dropped; with or without room for the full search), behind the ground, off the screen or under a panel, not in the layer. Times in ms are the driver's clock (30 frames a second unless said); clock minutes are the battle's.

## Runs

| run | view | presentation, mode | reading | Follow | speed | clock | play frames | passes | dwell frames | formation-frames drawn / in view (play) | longest hidden by the layout | keep hidden | quirk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| bench-hybrid | hybrid-field 1600x900 | study, hybrid | none | on | 0.5x | 09:00-09:14 | 90 | 9 | 8 | 1486 / 2520 (59.0%) | 4033 ms | 0 | 0 |
| hybrid-0830 | hybrid-field 1600x900 | study, hybrid | none | on | 0.5x | 08:30-11:30 | 1560 | 156 | 600 | 29867 / 43136 (69.2%) | 5667 ms | 0 | 0 |
| hybrid-1200 | hybrid-field 1600x900 | study, hybrid | none | on | 0.5x | 12:00-15:00 | 1328 | 132 | 316 | 22812 / 31339 (72.8%) | 5667 ms | 0 | 0 |
| hybrid-4x-day | hybrid-field 1600x900 | study, hybrid | none | on | 4x | 04:01-18:00 | 1800 | 180 | 1440 | 17157 / 23139 (74.1%) | 2667 ms | 0 | 0 |
| land-0900 | land-field 1600x900 | study, terrain | none | on | 0.5x | 09:00-12:00 | 1508 | 150 | 541 | 34079 / 38564 (88.4%) | 1300 ms | 0 | 0 |
| phone-0900 | phone-hybrid 390x844 | study, hybrid | none | on | 0.5x | 09:00-12:00 | 1508 | 150 | 541 | 6396 / 13847 (46.2%) | 6667 ms | 0 | 0 |

## Priority checks (play frames)

| run | protected items hidden (frames) | events drawn / in view | army and corps counters drawn / in view | not always drawn | places | objectives | by echelon (army, corps, div, bde) |
|---|---|---|---|---|---|---|---|
| bench-hybrid | 0 | 313/313 (100.0%) | 276/360 (76.7%) | ahq 65.6%, 3.33 min; lich 84.4%, 2.33 min; bag 56.7%, 3.33 min | 257/1080 (23.8%) | 149/180 (82.8%) | 82.8%, 70.6%, 56.0%, - |
| hybrid-0830 | 0 | 3114/3114 (100.0%) | 4879/6075 (80.3%) | gqg 88.9%, 0 min; ahq 79.9%, 3.74 min; lich 75.6%, 8.33 min; bag 76.4%, 3.33 min | 2583/18406 (14.0%) | 1862/2434 (76.5%) | 84.4%, 76.0%, 67.4%, - |
| hybrid-1200 | 0 | 3233/3233 (100.0%) | 2775/3812 (72.8%) | gqg 68.0%, 18.33 min; ahq 74.6%, 14.83 min; lich 72.3%, 6.67 min; bag 80.6%, 3.33 min | 4076/14437 (28.2%) | 861/1328 (64.8%) | 70.9%, 76.0%, 72.8%, - |
| hybrid-4x-day | 0 | 3659/3659 (100.0%) | 15159/20097 (75.4%) | gqg 75.7%, 26.67 min; ahq 74.0%, 0 min; lich 53.2%, 23.47 min; bag 74.4%, 0 min; c_iv 76.4%, 26.67 min; c_iii 78.4%, 0 min; c_v 76.4%, 26.67 min; c_cav 71.2%, 26.67 min; c_i 76.6%, 4.23 min; c_gd 83.8%, 26.67 min; col4 73.4%, 29.96 min; constantine 73.0%, 27.28 min; buxhowden 88.9%, 0 min | 5555/20069 (27.7%) | 2028/2585 (78.5%) | 74.9%, 75.5%, 65.7%, - |
| land-0900 | 0 | 3043/3043 (100.0%) | 2602/2848 (91.4%) | lich 90.6%, 0.4 min; bag 92.2%, 3.1 min | 4740/17703 (26.8%) | 1820/2082 (87.4%) | -, 91.4%, 88.1%, - |
| phone-0900 | 0 | 2965/2965 (100.0%) | 6109/13071 (46.7%) | c_iv 71.9%, 5.17 min; c_iii 57.6%, 18 min; c_v 16.3%, 11.5 min; c_cav 28.5%, 17.83 min; c_i 52.5%, 13.33 min; c_gd 31.4%, 8.57 min; col4 50.4%, 17.93 min; constantine 40.4%, 18.17 min; gqg 42.1%, 16.17 min; ahq 45.4%, 17.67 min; buxhowden 51.8%, 20 min; lich 32.5%, 23.33 min; bag 36.5%, 5.5 min | 1065/12624 (8.4%) | 960/1671 (57.5%) | 44.6%, 47.1%, 37.0%, - |

## Priority against the static layout (play frames)

A fresh view's layout (`build`) in the same frame, against what the layout in motion drew: 'starved' frames the fresh layout would draw an item the moving layout hides; 'extra' frames the moving layout draws an item the fresh layout would not (a kept place).

| run | formations: share in motion, fresh | starved, extra | places: share, fresh | starved, extra | objectives: share, fresh | extra | events |
|---|---|---|---|---|---|---|---|
| bench-hybrid | 59.0%, 75.5% | 585, 168 | 23.8%, 12.7% | 42, 162 | 82.8%, 92.8% | 13 | 100.0% |
| hybrid-0830 | 69.2%, 80.0% | 7341, 2718 | 14.0%, 11.4% | 912, 1388 | 76.5%, 93.5% | 89 | 100.0% |
| hybrid-1200 | 72.8%, 86.6% | 5746, 1425 | 28.2%, 24.2% | 787, 1368 | 64.8%, 77.7% | 44 | 100.0% |
| hybrid-4x-day | 74.1%, 94.7% | 5177, 420 | 27.7%, 24.3% | 1048, 1733 | 78.5%, 92.8% | 87 | 100.0% |
| land-0900 | 88.4%, 100.0% | 4485, 8 | 26.8%, 23.4% | 1171, 1760 | 87.4%, 99.9% | 2 | 100.0% |
| phone-0900 | 46.2%, 58.5% | 2709, 1001 | 8.4%, 8.9% | 525, 462 | 57.5%, 85.0% | 46 | 100.0% |

## bench-hybrid: every formation (play frames, 09:00-09:14)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 90 | 0 | 0.0% | 1.1%, 2967 | 3000; 14.69; 09:00 | 1 | 65.6% | d # d | `xxx` |
| walther (Walther's Dragoons) | div cav fr | 3.200 | 90 | 0 | 0.0% | 12.2%, 1033 | 3000; 14.69; 09:00 | 1 | 45.6% | d d d | `xxx` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 90 | 0 | 0.0% | 17.8%, 1700 | 3000; 14.69; 09:00 | 1 | 32.2% | d d d | `xxx` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 90 | 25 | 27.8% | 100.0%, 0 | 567; 2.83; 09:00 | 4 | 70.8% | # # # | `---` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 90 | 29 | 32.2% | 36.7%, 1000 | 1033; 4.85; 09:10 | 2 | 16.4% | # d # | `+-x` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 90 | 29 | 32.2% | 100.0%, 0 | 1367; 6.52; 09:08 | 2 | 52.5% | # d # | `+-x` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 90 | 29 | 32.2% | 0.0%, 3000 | 1367; 6.52; 09:08 | 2 | 37.7% | # d d | `+-x` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 90 | 39 | 43.3% | 37.8%, 1567 | 633; 2.85; 09:12 | 3 | 43.1% | # d # | `---` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 90 | 40 | 44.4% | 0.0%, 3000 | 1633; 8.17; 09:00 | 2 | 68.0% | d d d | `x-#` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 90 | 51 | 56.7% | 100.0%, 0 | 667; 3.1; 09:11 | 2 | 100.0% | # # # | `-#-` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 90 | 51 | 56.7% | 100.0%, 0 | 667; 3.33; 09:06 | 2 | 100.0% | # # # | `--#` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 90 | 55 | 61.1% | 100.0%, 0 | 667; 3.33; 09:05 | 2 | 100.0% | # # # | `--#` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 90 | 56 | 62.2% | 100.0%, 0 | 633; 3.17; 09:01 | 2 | 55.9% | # # # | `-+#` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 90 | 57 | 63.3% | 65.6%, 833 | 667; 3.33; 09:08 | 2 | 90.9% | # # d | `+++` |
| prz (Third Column) | div inf ru | 3.199 | 90 | 57 | 63.3% | 100.0%, 0 | 667; 3.33; 09:05 | 2 | 100.0% | # # # | `#-+` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 90 | 59 | 65.6% | 100.0%, 0 | 667; 3.33; 09:03 | 2 | 3.2% | # # # | `+++` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 90 | 60 | 66.7% | 100.0%, 0 | 633; 3.17; 09:00 | 2 | 100.0% | # # # | `-+#` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 90 | 60 | 66.7% | 76.7%, 433 | 633; 3.17; 09:06 | 2 | 66.7% | # d # | `#-+` |
| milo (Miloradovich's Russians) | div inf ru | 3.199 | 90 | 62 | 68.9% | 66.7%, 700 | 567; 2.83; 09:08 | 2 | 3.6% | # d d | `#+-` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 90 | 70 | 77.8% | 100.0%, 0 | 667; 3.33; 09:10 | 1 | 100.0% | # # # | `##-` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 90 | 71 | 78.9% | 100.0%, 0 | 633; 3.17; 09:00 | 1 | 100.0% | d # # | `-##` |
| dok (First Column) | div inf ru | 3.199 | 90 | 72 | 80.0% | 100.0%, 0 | 600; 3; 09:10 | 1 | 100.0% | # # # | `##-` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 90 | 76 | 84.4% | 100.0%, 0 | 467; 2.33; 09:01 | 1 | 21.4% | # # # | `+##` |
| lang (Second Column) | div inf ru | 3.199 | 90 | 78 | 86.7% | 100.0%, 0 | 400; 2; 09:03 | 1 | 100.0% | # # # | `+##` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| friant (Friant's Division) | div inf fr | 3.200 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |

Other items not always drawn while in view (17 of 22 in view): `o:Saint-Hilaire` overlay 0.0% (longest 14.69 min); `o:Vandamme` overlay 0.0% (longest 14.69 min); `t:vinohrady` place 0.0% (longest 14.69 min); `t:pratzeberg` place 0.0% (longest 14.69 min); `t:sokolnitz` place 0.0% (longest 14.69 min); `t:austerlitz` place 0.0% (longest 14.69 min); `t:goldbach` place 1.1% (longest 14.6 min); `t:pratzen` place 12.2% (longest 13.17 min); `t:zuran` place 16.7% (longest 11.5 min); `p:plateau` plateau 25.6% (longest 3.33 min); `t:telnitz` place 33.3% (longest 6.52 min); `t:litava` place 43.3% (longest 8.19 min); `t:augezd` place 43.3% (longest 6.67 min); `t:satschan` place 56.7% (longest 6.19 min); `o:Stare Vinohrady` objective 65.6% (longest 3.33 min); `t:santon` place 78.9% (longest 3.17 min); `o:Friant retakes Telnitz` overlay 81.1% (longest 2.83 min)

## hybrid-0830: every formation (play frames, 08:30-11:30)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| walther (Walther's Dragoons) | div cav fr | 3.200 | 1560 | 590 | 37.8% | 47.3%, 13733 | 5667; 18.33; 09:40 | 26 | 48.9% | d d # | `x--xx-##-xx--+xxx-##+----+-+-++---#-` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 1560 | 622 | 39.9% | 53.2%, 10000 | 5167; 15.83; 10:52 | 18 | 37.7% | d # d | `xx+#+-xx-xx--#+xxx-+##-------xx-+###` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 1560 | 647 | 41.5% | 35.5%, 10333 | 5667; 18.1; 09:26 | 15 | 34.5% | d d d | `--xx-+#-----xx-##+-xxx+##+x-#+##-x-x` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 1560 | 665 | 42.6% | 41.3%, 11067 | 5367; 16.83; 08:54 | 19 | 27.3% | # d d | `#+---xxx+##+--+xx--xx-#-#-##-##+-xxx` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 1560 | 710 | 45.5% | 57.7%, 5033 | 5333; 16.67; 08:38 | 24 | 49.9% | d # d | `x-xx-+##+##+xx+##++x+x-------+-+--x+` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 1560 | 725 | 46.5% | 46.3%, 10633 | 5667; 18.33; 08:48 | 19 | 31.3% | d # d | `x---xxx+###-##xxx-###-#-+-+##--#--##` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 1560 | 790 | 50.6% | 53.3%, 8867 | 4667; 15; 09:30 | 16 | 27.9% | # d d | `#+----x-###+xx-###-xx---x+#-#++-+--x` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 1560 | 836 | 53.6% | 57.2%, 9433 | 5667; 18.33; 11:10 | 23 | 35.6% | # # # | `------x---++#-+#++-####+###--##-xxx-` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 1560 | 948 | 60.8% | 58.8%, 3267 | 2667; 6.5; 11:00 | 21 | 44.8% | # # # | `#-----+#+##+--+###++-##--+###-x-+-##` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 1560 | 1029 | 66.0% | 83.5%, 3933 | 4000; 13.17; 09:45 | 10 | 27.7% | # # d | `#-+#####--+--#+xx-##+xx-###-####+###` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 1560 | 1048 | 67.2% | 89.9%, 2167 | 2967; 14.83; 09:50 | 24 | 62.1% | # # # | `#-+##+#++#+++++-xx-+#+-+####-+#-+##+` |
| milo (Miloradovich's Russians) | div inf ru | 3.199 | 1560 | 1048 | 67.2% | 75.5%, 6367 | 5000; 15.23; 09:44 | 17 | 40.2% | d # # | `---+#+#+++x-+#-xx-####-++###++###-##` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 1560 | 1089 | 69.8% | 93.7%, 900 | 667; 3.33; 08:38 | 26 | 84.9% | # # # | `#+-##+#-+#++--+#-##---#++####+##+#-+` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 1560 | 1147 | 73.5% | 97.4%, 567 | 2033; 3.67; 09:41 | 21 | 74.1% | # # # | `###--######++#--####+--+--+#-+#-+++#` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 1560 | 1179 | 75.6% | 88.5%, 3367 | 3667; 8.33; 09:10 | 15 | 21.3% | # # # | `#-+++###x-++##+##++#############--+#` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 1395 | 1066 | 76.4% | 100.0%, 0 | 667; 3.33; 08:35 | 20 | 86.9% | # # # | `#-++#+#+###+#-###++#-+-+....-+##+-+#` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 1560 | 1209 | 77.5% | 100.0%, 0 | 667; 0; 08:45 | 20 | 51.6% | # d # | `#-+#-+#-++#++#+###-####+-###-##-#+#+` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 1560 | 1214 | 77.8% | 87.8%, 3600 | 1200; 6; 11:04 | 18 | 48.3% | # # d | `#-+-+###++--##+####++##--+####+-####` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 1560 | 1247 | 79.9% | 93.5%, 1433 | 2667; 3.74; 11:11 | 13 | 45.0% | # # # | `-##+-++-++-###+#################-###` |
| friant (Friant's Division) | div inf fr | 3.200 | 1560 | 1310 | 84.0% | 99.4%, 333 | 667; 3.33; 09:25 | 16 | 100.0% | # # # | `##+##++#+##+####-+#+++#++####+#-+###` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 1560 | 1324 | 84.9% | 100.0%, 0 | 667; 3.33; 08:40 | 13 | 100.0% | # # # | `#+-########++++#########+#-#-###+##-` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 1400 | 1190 | 85.0% | 91.1%, 3933 | 833; 4.17; 11:09 | 12 | 87.6% | d o o | `-+-##########++#########+-+##+#+x...` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 1560 | 1344 | 86.2% | 100.0%, 0 | 667; 0; 08:45 | 14 | 76.9% | # # # | `##+#++#+#+#+--+###--##-#############` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 1456 | 1271 | 87.3% | 96.0%, 1333 | 1000; 5; 08:35 | 10 | 91.9% | # o o | `#-+##+#######-##########+####+##-...` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 1560 | 1387 | 88.9% | 97.6%, 533 | 667; 0; 08:45 | 10 | 42.2% | # # # | `##+#+++#+##+#++###-#-###############` |
| prz (Third Column) | div inf ru | 3.199 | 1560 | 1424 | 91.3% | 100.0%, 0 | 667; 0; 08:45 | 9 | 99.3% | # # # | `-++#++#####+-#######################` |
| dok (First Column) | div inf ru | 3.199 | 1445 | 1348 | 93.3% | 100.0%, 0 | 667; 3.33; 09:38 | 6 | 95.9% | # o o | `##+##########++########+#####+##+...` |
| lang (Second Column) | div inf ru | 3.199 | 1560 | 1460 | 93.6% | 100.0%, 0 | 667; 1.83; 10:58 | 6 | 100.0% | # # # | `--+########+#+###############+######` |

Other items not always drawn while in view (40 of 53 in view): `o:Saint-Hilaire` overlay 0.0% (longest 45 min); `o:Vandamme` overlay 0.0% (longest 45 min); `o:Caffarelli` overlay 0.0% (longest 60 min); `o:Suchet` overlay 0.0% (longest 60 min); `o:Bagration` overlay 0.0% (longest 60 min); `t:pratzeberg` place 1.4% (longest 136.5 min); `t:vinohrady` place 1.9% (longest 101.5 min); `t:litava` place 4.1% (longest 61.43 min); `t:sokolnitz` place 6.7% (longest 60 min); `t:santon` place 8.0% (longest 66.5 min); `t:zuran` place 12.4% (longest 75 min); `p:plateau` plateau 13.8% (longest 35.17 min); `t:telnitz` place 14.1% (longest 73.17 min); `t:goldbach` place 20.7% (longest 60 min); `t:austerlitz` place 21.5% (longest 68.17 min); `t:augezd` place 23.9% (longest 108.17 min); `t:satschan` place 25.0% (longest 71 min); `o:French on the plateau` overlay 25.9% (longest 7.83 min); `t:pratzen` place 29.0% (longest 60.17 min); `o:Liechtenstein crosses the front` overlay 33.0% (longest 6.33 min); `o:Russian Imperial Guard` overlay 37.1% (longest 0.24 min); `o:Friant's approach march` overlay 38.1% (longest 1.93 min); `o:III Column → castle` overlay 49.5% (longest 3.67 min); `o:Liechtenstein and Uvarov` overlay 56.2% (longest 8.33 min); `o:Stare Vinohrady` objective 60.2% (longest 6.67 min); ...

## hybrid-1200: every formation (play frames, 12:00-15:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 854 | 359 | 42.0% | 36.5%, 6400 | 2533; 12.67; 12:05 | 20 | 64.6% | d o o | `--x----##x-+--++----+#-+............` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 1038 | 451 | 43.4% | 60.6%, 6200 | 5667; 18.33; 12:26 | 22 | 49.2% | d p p | `--###-xx-+-+--#-+x+-++-----#+.......` |
| milo (Miloradovich's Russians) | div inf ru | 3.199 | 930 | 428 | 46.0% | 70.0%, 5233 | 5667; 18.33; 12:26 | 14 | 36.5% | # p p | `-#-++-xx--+++xxx+###-#+--...........` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 1014 | 489 | 48.2% | 49.9%, 7833 | 3667; 18.33; 13:05 | 15 | 59.0% | d p p | `xxx-#+#------xxx-###x+x+##-#........` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 814 | 407 | 50.0% | 55.0%, 5067 | 3333; 11.5; 12:30 | 15 | 49.4% | d o o | `x-###-xx+----+-#+++++--#............` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 1121 | 678 | 60.5% | 80.0%, 3700 | 3233; 16.17; 12:10 | 16 | 45.6% | # p p | `+--xx+###x-+-+-+--+-###+++#++-#.....` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 1328 | 863 | 65.0% | 95.8%, 1233 | 2400; 11.39; 12:30 | 24 | 75.7% | # d # | `-#--#+xx+----+###-##+####++--+###---` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 946 | 630 | 66.6% | 70.3%, 3600 | 3667; 18.33; 12:10 | 12 | 46.2% | d p p | `-#xxx+###--+########--#++-..........` |
| walther (Walther's Dragoons) | div cav fr | 3.200 | 816 | 548 | 67.2% | 79.7%, 1233 | 1367; 5.33; 12:54 | 13 | 76.5% | d o o | `---#+-###++--#-######+-x............` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 1328 | 903 | 68.0% | 83.1%, 6833 | 3667; 18.33; 13:06 | 16 | 35.1% | # d # | `###+----+##---xx-#+#++#######+#####+` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 762 | 524 | 68.8% | 100.0%, 0 | 667; 3.33; 12:03 | 13 | 72.3% | # o o | `++-+--###--+-###++##++..............` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 1289 | 921 | 71.5% | 83.8%, 3100 | 3667; 16.83; 12:13 | 13 | 46.5% | d p p | `x-+xx+##+--+++##++####+##--#######+.` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 794 | 574 | 72.3% | 92.7%, 1400 | 1333; 6.67; 12:03 | 11 | 60.0% | # o o | `+-#+++###--+#+###+##--#.............` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 688 | 501 | 72.8% | 100.0%, 0 | 667; 3.33; 12:05 | 10 | 100.0% | # o o | `---+++--#++#####+++.................` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 1328 | 975 | 73.4% | 91.3%, 2567 | 3533; 16.17; 13:44 | 14 | 62.3% | # # # | `#-+-++++#######-####+xx+####-#+-++-#` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 1061 | 791 | 74.6% | 84.5%, 5267 | 4333; 14.83; 12:30 | 9 | 24.8% | # p p | `###-#-xx-####+-#-#++########--......` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 1328 | 1037 | 78.1% | 92.0%, 900 | 1467; 7.33; 13:34 | 14 | 38.8% | d # # | `-#-##-###-++++##-#+x+##+##########++` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 1328 | 1066 | 80.3% | 100.0%, 0 | 667; 3.33; 12:21 | 15 | 91.2% | # # # | `-++#-#-##--++++###+#-#####++####++#+` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 629 | 507 | 80.6% | 100.0%, 0 | 667; 3.33; 12:18 | 8 | 88.5% | # o o | `--#++#+##-+#####-...................` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 1319 | 1075 | 81.5% | 90.1%, 3033 | 4000; 14.83; 12:30 | 7 | 33.2% | # p p | `####--xx-+++######++###############-` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 1328 | 1088 | 81.9% | 83.1%, 1733 | 733; 0.61; 14:29 | 13 | 67.9% | # # # | `#####+-#######-#+--+++-####-++####++` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 1328 | 1094 | 82.4% | 91.6%, 1133 | 3633; 18.17; 12:00 | 6 | 35.9% | d # # | `xxx-#+#x-##+#+######################` |
| dok (First Column) | div inf ru | 3.199 | 1328 | 1119 | 84.3% | 100.0%, 0 | 667; 0; 14:00 | 13 | 67.5% | # # # | `####-+##-###+##########+####-+-+-+-+` |
| lang (Second Column) | div inf ru | 3.199 | 1328 | 1132 | 85.2% | 100.0%, 0 | 667; 3.33; 13:03 | 12 | 70.4% | # # # | `#+#+-###++-+++++#######+++#+#+######` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 1328 | 1137 | 85.6% | 98.7%, 433 | 667; 3.33; 12:11 | 11 | 97.4% | # # # | `+--#-+####++++++#######+############` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 1328 | 1142 | 86.0% | 100.0%, 0 | 667; 3.33; 12:18 | 10 | 53.2% | # # # | `#+++++###--############+###--#####-+` |
| prz (Third Column) | div inf ru | 3.199 | 1328 | 1164 | 87.7% | 100.0%, 0 | 667; 3.33; 12:18 | 9 | 90.2% | # # # | `###++-####++#######-######-+#+######` |
| friant (Friant's Division) | div inf fr | 3.200 | 1328 | 1209 | 91.0% | 98.9%, 467 | 667; 3.33; 12:53 | 6 | 83.2% | # # # | `##########++#-######+-###########-##` |

Other items not always drawn while in view (30 of 39 in view): `t:satschan` place 1.5% (longest 123.5 min); `t:telnitz` place 3.8% (longest 171.5 min); `t:sokolnitz` place 14.5% (longest 103.5 min); `o:Stare Vinohrady` objective 15.8% (longest 16.83 min); `t:litava` place 17.8% (longest 88.17 min); `t:vinohrady` place 21.8% (longest 98.17 min); `t:pratzen` place 22.3% (longest 136.5 min); `t:pratzeberg` place 23.3% (longest 60 min); `p:plateau` plateau 24.2% (longest 15 min); `t:augezd` place 26.9% (longest 63.33 min); `t:austerlitz` place 27.3% (longest 53.17 min); `o:Drouet forms line` overlay 33.3% (longest 15 min); `o:French on the plateau` overlay 36.4% (longest 10.17 min); `t:goldbach` place 40.1% (longest 37.67 min); `o:Bessières and Rapp` overlay 50.6% (longest 3.33 min); `o:Buxhowden's columns, now cut off` overlay 54.4% (longest 3.57 min); `o:Russian Imperial Guard` overlay 54.8% (longest 15 min); `o:Over the Satschan mere` overlay 55.2% (longest 3.33 min); `o:The Augezd defile` objective 71.0% (longest 3.33 min); `o:Vandamme wheels south` overlay 75.3% (longest 3.33 min); `o:Legrand and Friant` overlay 78.4% (longest 3.33 min); `o:Davout resumes the offensive` overlay 79.3% (longest 3.33 min); `o:Saint-Hilaire wheels south` overlay 80.7% (longest 0.4 min); `o:Across the Menitz mere` overlay 81.3% (longest 1.5 min); `o:Przybyszewski's breakout` overlay 81.6% (longest 3.33 min); ...

## hybrid-4x-day: every formation (play frames, 04:01-18:00)

Strip: one character per 15 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| friant (Friant's Division) | div inf fr | 3.200 | 1 | 0 | 0.0% | 100.0%, 0 | 33; 0; 04:15 | 1 | 100.0% | o . # | `x.......................................................` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 2 | 0 | 0.0% | 100.0%, 0 | 67; 0; 04:15 | 1 | 100.0% | o . # | `x.......................................................` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 59 | 21 | 35.6% | 59.3%, 800 | 667; 0; 04:15 | 2 | 63.2% | # . # | `-.......................................................` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 59 | 22 | 37.3% | 100.0%, 0 | 667; 0; 04:15 | 2 | 100.0% | # . # | `-.......................................................` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 59 | 24 | 40.7% | 71.2%, 567 | 967; 15; 04:01 | 2 | 68.6% | d . # | `-.......................................................` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 59 | 25 | 42.4% | 16.9%, 1267 | 800; 8.33; 04:07 | 2 | 70.6% | # . # | `-.......................................................` |
| lang (Second Column) | div inf ru | 3.199 | 59 | 25 | 42.4% | 94.9%, 67 | 667; 0; 04:15 | 2 | 50.0% | # . # | `-.......................................................` |
| prz (Third Column) | div inf ru | 3.199 | 59 | 28 | 47.5% | 96.6%, 67 | 667; 0; 04:15 | 2 | 22.6% | # . . | `-.......................................................` |
| walther (Walther's Dragoons) | div cav fr | 3.200 | 59 | 29 | 49.2% | 32.2%, 833 | 1000; 0; 04:15 | 1 | 96.7% | # . # | `-.......................................................` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 59 | 30 | 50.8% | 71.2%, 567 | 967; 15; 04:01 | 1 | 10.3% | d . d | `+.......................................................` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 59 | 30 | 50.8% | 71.2%, 567 | 967; 15; 04:01 | 1 | 62.1% | d . # | `+.......................................................` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 59 | 30 | 50.8% | 71.2%, 567 | 967; 15; 04:01 | 1 | 51.7% | d . # | `+.......................................................` |
| milo (Miloradovich's Russians) | div inf ru | 3.199 | 59 | 30 | 50.8% | 91.5%, 167 | 633; 15; 04:01 | 2 | 0.0% | d . # | `+.......................................................` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 1441 | 767 | 53.2% | 71.7%, 3133 | 2600; 23.47; 08:52 | 26 | 42.1% | # # # | `+#######-x#++x++-+--++-x#-+++---x+#+-x#+.............xx#` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 59 | 33 | 55.9% | 67.8%, 633 | 533; 0.89; 04:14 | 2 | 61.5% | # . # | `+.......................................................` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 59 | 34 | 57.6% | 100.0%, 0 | 500; 0.49; 04:14 | 2 | 100.0% | # . # | `+.......................................................` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 59 | 39 | 66.1% | 100.0%, 0 | 667; 0; 04:15 | 1 | 0.0% | # . # | `+.......................................................` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 59 | 39 | 66.1% | 100.0%, 0 | 667; 0; 04:15 | 1 | 15.0% | # . p | `+.......................................................` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 59 | 39 | 66.1% | 42.4%, 833 | 667; 0; 04:15 | 1 | 0.0% | # . # | `+.......................................................` |
| dok (First Column) | div inf ru | 3.199 | 59 | 39 | 66.1% | 100.0%, 0 | 667; 0; 04:15 | 1 | 100.0% | # . # | `+.......................................................` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 59 | 39 | 66.1% | 100.0%, 0 | 667; 0; 04:15 | 1 | 50.0% | # . d | `+.......................................................` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 59 | 39 | 66.1% | 8.5%, 1800 | 667; 0; 04:15 | 1 | 65.0% | # . d | `+.......................................................` |
| c_cav (Cavalry Reserve) | corps cav fr | 3.099 | 1412 | 1005 | 71.2% | 94.9%, 533 | 667; 26.67; 06:05 | 23 | 85.3% | . # . | `x+######-x#+x-#+#+++#####+-++#++#+#--x##-.............x-` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 1800 | 1312 | 72.9% | 98.5%, 767 | 667; 25.66; 04:18 | 28 | 98.0% | # # # | `+--x-#-x+#x--##+#+++####++#+-#+######+x+-+x+#####+######` |
| constantine (Russian Imperial Guard) | corps guard ru | 3.099 | 1440 | 1051 | 73.0% | 87.8%, 2333 | 2667; 27.28; 12:25 | 18 | 65.0% | . # . | `x+#################-+##-#--++#++#-x-###+--...........x#-` |
| col4 (Fourth Column) | corps inf at | 3.098 | 1461 | 1073 | 73.4% | 92.4%, 2333 | 2333; 29.96; 12:00 | 19 | 70.6% | . # . | `x+########x+##-+#+#+####-+#-+x#-x+#-+#-+#-..........xx#+` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 1561 | 1155 | 74.0% | 93.5%, 1833 | 667; 0; 04:15 | 26 | 65.5% | # h # | `-##--###-x+-###+#++#+##-#-+++x++#########+x..........x#-` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 1274 | 948 | 74.4% | 100.0%, 0 | 867; 0; 11:00 | 19 | 97.2% | # p p | `++####-x+#x+##-+##+######-.-++-##+#+#-..................` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 1800 | 1363 | 75.7% | 99.7%, 200 | 667; 26.67; 04:45 | 25 | 94.7% | # # # | `+##x-#-x+#x-#+x######++##-####+#++--+x#---#+#####+######` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 59 | 45 | 76.3% | 100.0%, 0 | 467; 8.33; 04:07 | 1 | 50.0% | # . # | `+.......................................................` |
| c_iv (IV Corps) | corps inf fr | 3.098 | 1741 | 1330 | 76.4% | 100.0%, 0 | 667; 26.67; 05:11 | 26 | 99.8% | . # . | `x+##+x+####+######+++++##-##+####+#++-x+--#+###--+#-+###` |
| c_v (V Corps) | corps inf fr | 3.099 | 1334 | 1019 | 76.4% | 100.0%, 0 | 667; 26.67; 05:11 | 19 | 99.4% | . p . | `x+##+x+###x+#+x##+###++#x+#--x###-x####+................` |
| c_i (I Corps) | corps inf fr | 3.099 | 1638 | 1255 | 76.6% | 99.1%, 267 | 667; 4.23; 06:56 | 23 | 86.9% | . # . | `x+######+x#-+x+###++++##-+#--x#+#+++###+###+.....+######` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 59 | 46 | 78.0% | 89.8%, 167 | 433; 0; 04:15 | 1 | 23.1% | # . # | `+.......................................................` |
| c_iii (III Corps (detachment)) | corps inf fr | 3.099 | 1513 | 1186 | 78.4% | 99.7%, 100 | 667; 0; 08:45 | 22 | 98.8% | . # . | `x+####.........--+-++#######-.+##+#++##+#-#+##+-########` |
| c_gd (Imperial Guard) | corps guard fr | 3.099 | 1741 | 1459 | 83.8% | 99.9%, 67 | 667; 26.67; 05:11 | 16 | 79.8% | . # . | `x+##+x+#-x#+###+++++#######+-#-+########################` |
| buxhowden (Left Wing Command) | corps hq ru | 3.096 | 1741 | 1548 | 88.9% | 100.0%, 0 | 667; 0; 14:00 | 12 | 99.0% | . # . | `x+###############+##########+-+##+#-+#-+#+-#############` |

Other items not always drawn while in view (62 of 88 in view): `o:Bagration` overlay 0.0% (longest 59.99 min); `t:vinohrady` place 3.5% (longest 390 min); `t:augezd` place 5.4% (longest 263 min); `t:pratzeberg` place 15.9% (longest 194.46 min); `t:sokolnitz` place 23.8% (longest 103.67 min); `t:litava` place 26.7% (longest 240.33 min); `t:zuran` place 27.5% (longest 75 min); `o:V Column counter-marches north` overlay 28.8% (longest 3.01 min); `o:Liechtenstein and Uvarov` overlay 30.4% (longest 2.04 min); `t:telnitz` place 30.8% (longest 240 min); `t:austerlitz` place 34.7% (longest 119.12 min); `t:pratzen` place 37.0% (longest 285 min); `t:satschan` place 39.1% (longest 182 min); `t:santon` place 40.8% (longest 125.54 min); `o:IV Column halted` overlay 42.8% (longest 16.9 min); `p:plateau` plateau 45.4% (longest 51.3 min); `o:Liechtenstein crosses the front` overlay 45.4% (longest 0.54 min); `o:Saint-Hilaire` overlay 46.8% (longest 0 min); `o:IV Column → Kobelnitz` overlay 48.5% (longest 15.33 min); `o:Stare Vinohrady` objective 50.3% (longest 10.22 min); `t:goldbach` place 50.8% (longest 80 min); `o:Allied columns on the plateau` overlay 54.0% (longest 13.64 min); `o:Blasowitz` objective 54.1% (longest 12 min); `o:III Column → the castle` overlay 54.5% (longest 0 min); `o:French line on the Goldbach` overlay 56.8% (longest 0 min); ...

## land-0900: every formation (play frames, 09:00-12:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| walther (Walther's Dragoons) | div cav fr | 7.200 | 1508 | 1155 | 76.6% | 100.0%, 0 | 667; 3.33; 09:08 | 21 | 100.0% | # # # | `#+-##++###+#++#+++##+++###-+#-#+#-#+` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 7.200 | 1508 | 1187 | 78.7% | 100.0%, 0 | 667; 3.33; 09:10 | 18 | 98.8% | # # # | `##+++-+#+###+-++-+-+#-#++#+#########` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 7.200 | 1508 | 1192 | 79.0% | 100.0%, 0 | 667; 3.33; 09:06 | 18 | 92.1% | # d # | `#-++#+##+######-+-#######+--###+##-+` |
| guard_cav (Guard Cavalry) | div cav fr | 7.200 | 1508 | 1209 | 80.2% | 100.0%, 0 | 667; 3.1; 09:11 | 17 | 100.0% | # # # | `+++#+++++###+####--####++##########+` |
| rivaud (Rivaud's Division) | div inf fr | 7.199 | 1508 | 1231 | 81.6% | 100.0%, 0 | 667; 3.33; 09:05 | 16 | 100.0% | # # # | `#-+#++####-####+-+####-+########-#-+` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 7.199 | 1508 | 1261 | 83.6% | 100.0%, 0 | 667; 3.33; 09:10 | 14 | 99.2% | # # # | `-#+######++#-##-+++##-#+##+++#####-#` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 7.199 | 1508 | 1265 | 83.9% | 100.0%, 0 | 667; 3.33; 09:31 | 14 | 100.0% | # # # | `-#++++-##########+##++-##-+-#######+` |
| caffarelli (Caffarelli's Division) | div inf fr | 7.199 | 1508 | 1273 | 84.4% | 100.0%, 0 | 667; 3.33; 09:36 | 13 | 100.0% | # # # | `#######-+-##+----+#######-####-+####` |
| rg_cav (Guard Cavalry) | div cav ru | 7.200 | 1508 | 1299 | 86.1% | 100.0%, 0 | 667; 1.83; 09:13 | 11 | 81.8% | # # # | `#-+-#+#-+###-#++###########+#--#####` |
| bourcier (Bourcier's Dragoons) | div cav fr | 7.200 | 1291 | 1125 | 87.1% | 100.0%, 0 | 667; 3.33; 10:16 | 10 | 100.0% | # # # | `##############--##-+##++-+-....+####` |
| kollo (Kollowrat's Austrians) | div inf at | 7.199 | 1508 | 1335 | 88.5% | 99.5%, 133 | 667; 0.4; 09:14 | 10 | 85.0% | # # # | `##+##+++++######-######++#+#-#######` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 7.200 | 1508 | 1343 | 89.1% | 100.0%, 0 | 667; 0; 09:15 | 9 | 100.0% | # # # | `+-+#-++++######################+####` |
| legrand (Legrand's Division) | div inf fr | 7.199 | 1508 | 1347 | 89.3% | 100.0%, 0 | 667; 0; 09:30 | 10 | 100.0% | # # # | `#+###+-++#################+####+####` |
| friant (Friant's Division) | div inf fr | 7.200 | 1508 | 1347 | 89.3% | 100.0%, 0 | 667; 3.33; 10:10 | 10 | 100.0% | # # # | `#++#+#########-##+########-##-#####+` |
| vandamme (Vandamme's Division) | div inf fr | 7.199 | 1508 | 1365 | 90.5% | 100.0%, 0 | 667; 3.33; 09:25 | 8 | 100.0% | # # # | `#####+-#+#####-#########--+#########` |
| lich (Fifth Column (cavalry)) | corps cav ru | 7.099 | 1508 | 1366 | 90.6% | 100.0%, 0 | 667; 0.4; 09:44 | 8 | 98.6% | # # # | `##+#-##-+########+#####+##++########` |
| guard_inf (Guard Infantry) | div guard fr | 7.200 | 1508 | 1373 | 91.0% | 100.0%, 0 | 667; 3.33; 09:05 | 8 | 100.0% | # # # | `--######+#################++###+-###` |
| bag (Advance Guard of the Right) | corps inf ru | 7.099 | 1340 | 1236 | 92.2% | 100.0%, 0 | 667; 3.1; 09:41 | 7 | 100.0% | # # # | `########+#######-+....-######-######` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 7.199 | 1387 | 1283 | 92.5% | 100.0%, 0 | 667; 1.83; 09:28 | 7 | 100.0% | # # # | `#+###+#################+##-...-#####` |
| rg_inf (Guard Infantry) | div guard ru | 7.200 | 1508 | 1395 | 92.5% | 100.0%, 0 | 667; 3.33; 09:10 | 7 | 73.5% | # # d | `##+###################-###+#-###++##` |
| suchet (Suchet's Division) | div inf fr | 7.199 | 1508 | 1407 | 93.3% | 100.0%, 0 | 667; 3.33; 09:40 | 6 | 100.0% | # # # | `########+#+######-#########-########` |
| c_gren (Grenadier Division) | div inf fr | 7.199 | 1508 | 1415 | 93.8% | 100.0%, 0 | 667; 1.5; 11:15 | 5 | 100.0% | # # # | `##########################-+##-+####` |
| milo (Miloradovich's Russians) | div inf ru | 7.199 | 1508 | 1441 | 95.6% | 100.0%, 0 | 667; 3.33; 11:05 | 4 | 100.0% | # # # | `#########################--#########` |
| dok (First Column) | div inf ru | 7.199 | 1370 | 1312 | 95.8% | 100.0%, 0 | 667; 3.33; 09:25 | 3 | 100.0% | # # # | `#####+#####################...x+####` |
| prz (Third Column) | div inf ru | 7.199 | 1508 | 1457 | 96.6% | 100.0%, 0 | 633; 3.17; 09:08 | 3 | 100.0% | # # # | `#+++##++############################` |
| lang (Second Column) | div inf ru | 7.199 | 1508 | 1460 | 96.8% | 100.0%, 0 | 667; 2.93; 09:30 | 3 | 100.0% | # # # | `####++-#############################` |

Other items not always drawn while in view (33 of 46 in view): `o:Saint-Hilaire` overlay 0.0% (longest 30 min); `o:Vandamme` overlay 0.0% (longest 30 min); `t:vinohrady` place 0.0% (longest 180 min); `o:Caffarelli` overlay 0.0% (longest 60 min); `o:Suchet` overlay 0.0% (longest 60 min); `o:Bagration` overlay 0.0% (longest 60 min); `t:pratzeberg` place 0.7% (longest 106.5 min); `t:sokolnitz` place 4.6% (longest 146.83 min); `t:pratzen` place 17.7% (longest 67.83 min); `t:telnitz` place 17.8% (longest 56.5 min); `t:litava` place 18.6% (longest 95.17 min); `t:austerlitz` place 31.0% (longest 45 min); `t:augezd` place 34.4% (longest 59.6 min); `t:santon` place 37.4% (longest 66.5 min); `t:satschan` place 38.8% (longest 45 min); `t:zuran` place 47.3% (longest 47.07 min); `t:goldbach` place 73.5% (longest 23.17 min); `o:Friant retakes Telnitz` overlay 76.1% (longest 3.33 min); `o:Blasowitz` objective 76.9% (longest 0 min); `o:Stare Vinohrady` objective 80.6% (longest 0 min); `o:Russian Imperial Guard` overlay 81.6% (longest 0 min); `o:Bessières and Rapp` overlay 81.6% (longest 0.24 min); `o:French on the plateau` overlay 83.4% (longest 3.33 min); `o:Drouet forms line` overlay 84.4% (longest 1.83 min); `o:Levasseur up the Goldbach` overlay 90.8% (longest 3.33 min); ...

## phone-0900: every formation (play frames, 09:00-12:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| c_v (V Corps) | corps inf fr | 3.099 | 246 | 40 | 16.3% | 32.5%, 1400 | 3567; 11.5; 11:15 | 6 | 15.5% | d o o | `x........................--xx--x....` |
| c_cav (Cavalry Reserve) | corps cav fr | 3.099 | 688 | 196 | 28.5% | 30.2%, 8233 | 5567; 17.83; 10:50 | 5 | 13.2% | d # d | `xxx...................xxx-+##-x-xxx+` |
| c_gd (Imperial Guard) | corps guard fr | 3.099 | 765 | 240 | 31.4% | 46.0%, 2767 | 3667; 8.57; 10:59 | 11 | 31.0% | d d d | `x................x-###--x-x-#---xx-+` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 1431 | 465 | 32.5% | 40.5%, 5667 | 6667; 23.33; 11:30 | 15 | 19.3% | d d d | `xx-+x-xx-#####-xx-.-#-xx---+x+xxxx-+` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 52 | 19 | 36.5% | 17.3%, 1433 | 1100; 5.5; 09:03 | 1 | 0.0% | # o o | `+x..................................` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 776 | 287 | 37.0% | 48.8%, 6933 | 3667; 18.33; 10:33 | 12 | 33.3% | o d d | `.................-+xxx-+#---xx-+#+-x` |
| constantine (Russian Imperial Guard) | corps guard ru | 3.099 | 1508 | 609 | 40.4% | 49.7%, 5967 | 4333; 18.17; 11:40 | 21 | 30.3% | d d d | `xx--+---x#######+-+-xx-+#--xx-#-xxx-` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 482 | 203 | 42.1% | 64.3%, 3933 | 3233; 16.17; 11:18 | 9 | 28.0% | o o o | `..................x+x+-+#---xxx.....` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 1508 | 684 | 45.4% | 63.0%, 5033 | 5533; 17.67; 09:07 | 23 | 23.8% | # d # | `+-xx-+#--xxx+###-+#+-#--#--+-xx-##+x` |
| col4 (Fourth Column) | corps inf at | 3.098 | 1508 | 760 | 50.4% | 54.4%, 6433 | 5667; 17.93; 11:00 | 17 | 34.5% | # # # | `##+-+--++x++#++##+--#-#--xx-###-xx--` |
| buxhowden (Left Wing Command) | corps hq ru | 3.096 | 1238 | 641 | 51.8% | 56.5%, 5667 | 5800; 20; 11:40 | 8 | 15.6% | # # # | `+xxx--##+##############xxx.....xxxxx` |
| c_i (I Corps) | corps inf fr | 3.099 | 1253 | 658 | 52.5% | 64.8%, 3633 | 4667; 13.33; 10:55 | 16 | 32.4% | d # # | `x---+x....-###++-+#++##xx---x+####+-` |
| c_iii (III Corps (detachment)) | corps inf fr | 3.099 | 884 | 509 | 57.6% | 82.4%, 2433 | 3700; 18; 11:40 | 9 | 37.1% | # o o | `--+x-###+###xx-##+..............xxx-` |
| c_iv (IV Corps) | corps inf fr | 3.098 | 1508 | 1085 | 71.9% | 94.6%, 1900 | 1333; 5.17; 09:25 | 24 | 70.2% | # # # | `##+++--++######-#+#-#--+-+-##--+#+#+` |

Other items not always drawn while in view (30 of 43 in view): `t:vinohrady` place 0.0% (longest 180 min); `t:pratzeberg` place 0.0% (longest 180 min); `t:santon` place 0.0% (longest 9.83 min); `t:zuran` place 0.0% (longest 57.5 min); `t:satschan` place 0.0% (longest 39.83 min); `t:austerlitz` place 0.0% (longest 90 min); `t:goldbach` place 2.5% (longest 76.5 min); `t:litava` place 6.4% (longest 113.17 min); `t:pratzen` place 7.4% (longest 89.17 min); `t:telnitz` place 15.2% (longest 56.17 min); `o:Drouet forms line` overlay 18.2% (longest 19.6 min); `o:The Santon holds` objective 23.1% (longest 1.83 min); `t:sokolnitz` place 24.0% (longest 33.17 min); `o:Bessières and Rapp` overlay 27.1% (longest 20 min); `p:plateau` plateau 27.9% (longest 28.5 min); `o:Stare Vinohrady` objective 32.0% (longest 14.83 min); `o:Levasseur up the Goldbach` overlay 35.2% (longest 28.33 min); `o:French on the plateau` overlay 35.3% (longest 20 min); `t:augezd` place 36.5% (longest 36.67 min); `o:Liechtenstein and Uvarov` overlay 38.2% (longest 1.83 min); `o:Russian Imperial Guard` overlay 38.4% (longest 14.6 min); `o:Kamensky turns about (disputed)` overlay 42.9% (longest 15 min); `o:Nansouty's cuirassiers` overlay 44.7% (longest 0 min); `o:Blasowitz` objective 63.2% (longest 3.1 min); `o:French hold the crest` overlay 67.5% (longest 1.5 min); ...

## Across the runs: each formation (play frames; share drawn while in view / longest hidden by the layout in clock minutes)

| formation | hybrid-0830 | hybrid-1200 | hybrid-4x-day | land-0900 | phone-0900 |
|---|---|---|---|---|---|
| c_v | - | - | 76.4% / 26.67 (667 ms) | - | 16.3% / 11.5 (3567 ms) |
| c_cav | - | - | 71.2% / 26.67 (667 ms) | - | 28.5% / 17.83 (5567 ms) |
| c_gd | - | - | 83.8% / 26.67 (667 ms) | - | 31.4% / 8.57 (3667 ms) |
| lich | 75.6% / 8.33 (3667 ms) | 72.3% / 6.67 (1333 ms) | 53.2% / 23.47 (2600 ms) | 90.6% / 0.4 (667 ms) | 32.5% / 23.33 (6667 ms) |
| drouet | 77.8% / 6 (1200 ms) | 81.5% / 14.83 (4000 ms) | 35.6% / 0 (667 ms) | 83.6% / 3.33 (667 ms) | - |
| bag | 76.4% / 3.33 (667 ms) | 80.6% / 3.33 (667 ms) | 74.4% / 0 (867 ms) | 92.2% / 3.1 (667 ms) | 36.5% / 5.5 (1100 ms) |
| c_gren | 73.5% / 3.67 (2033 ms) | 81.9% / 0.61 (733 ms) | 72.9% / 25.66 (667 ms) | 93.8% / 1.5 (667 ms) | 37.0% / 18.33 (3667 ms) |
| kienmayer | 87.3% / 5 (1000 ms) | 73.4% / 16.17 (3533 ms) | 37.3% / 0 (667 ms) | 92.5% / 1.83 (667 ms) | - |
| walther | 37.8% / 18.33 (5667 ms) | 67.2% / 5.33 (1367 ms) | 49.2% / 0 (1000 ms) | 76.6% / 3.33 (667 ms) | - |
| guard_cav | 39.9% / 15.83 (5167 ms) | 78.1% / 7.33 (1467 ms) | 50.8% / 15 (967 ms) | 80.2% / 3.1 (667 ms) | - |
| constantine | - | - | 73.0% / 27.28 (2667 ms) | - | 40.4% / 18.17 (4333 ms) |
| nansouty | 46.5% / 18.33 (5667 ms) | 42.0% / 12.67 (2533 ms) | 40.7% / 15 (967 ms) | 78.7% / 3.33 (667 ms) | - |
| dhautpoul | 41.5% / 18.1 (5667 ms) | 48.2% / 18.33 (3667 ms) | 50.8% / 15 (967 ms) | 89.1% / 0 (667 ms) | - |
| gqg | 88.9% / 0 (667 ms) | 68.0% / 18.33 (3667 ms) | 75.7% / 26.67 (667 ms) | - | 42.1% / 16.17 (3233 ms) |
| guard_inf | 45.5% / 16.67 (5333 ms) | 82.4% / 18.17 (3633 ms) | 42.4% / 8.33 (800 ms) | 91.0% / 3.33 (667 ms) | - |
| lang | 93.6% / 1.83 (667 ms) | 85.2% / 3.33 (667 ms) | 42.4% / 0 (667 ms) | 96.8% / 2.93 (667 ms) | - |
| rg_cav | 42.6% / 16.83 (5367 ms) | 66.6% / 18.33 (3667 ms) | 66.1% / 0 (667 ms) | 86.1% / 1.83 (667 ms) | - |
| rg_inf | 66.0% / 13.17 (4000 ms) | 43.4% / 18.33 (5667 ms) | 66.1% / 0 (667 ms) | 92.5% / 3.33 (667 ms) | - |
| ahq | 79.9% / 3.74 (2667 ms) | 74.6% / 14.83 (4333 ms) | 74.0% / 0 (667 ms) | - | 45.4% / 17.67 (5533 ms) |
| milo | 67.2% / 15.23 (5000 ms) | 46.0% / 18.33 (5667 ms) | 50.8% / 15 (633 ms) | 95.6% / 3.33 (667 ms) | - |
| prz | 91.3% / 0 (667 ms) | 87.7% / 3.33 (667 ms) | 47.5% / 0 (667 ms) | 96.6% / 3.17 (633 ms) | - |
| kellermann | 50.6% / 15 (4667 ms) | 50.0% / 11.5 (3333 ms) | 50.8% / 15 (967 ms) | 79.0% / 3.33 (667 ms) | - |
| col4 | - | - | 73.4% / 29.96 (2333 ms) | - | 50.4% / 17.93 (5667 ms) |
| buxhowden | - | - | 88.9% / 0 (667 ms) | - | 51.8% / 20 (5800 ms) |
| c_i | - | - | 76.6% / 4.23 (667 ms) | - | 52.5% / 13.33 (4667 ms) |
| kollo | 53.6% / 18.33 (5667 ms) | 60.5% / 16.17 (3233 ms) | 76.3% / 8.33 (467 ms) | 88.5% / 0.4 (667 ms) | - |
| sthilaire | 86.2% / 0 (667 ms) | 65.0% / 11.39 (2400 ms) | 55.9% / 0.89 (533 ms) | 83.9% / 3.33 (667 ms) | - |
| legrand | 84.9% / 3.33 (667 ms) | 80.3% / 3.33 (667 ms) | 57.6% / 0.49 (500 ms) | 89.3% / 0 (667 ms) | - |
| c_iii | - | - | 78.4% / 0 (667 ms) | - | 57.6% / 18 (3700 ms) |
| rivaud | 60.8% / 6.5 (2667 ms) | 71.5% / 16.83 (3667 ms) | 66.1% / 0 (667 ms) | 81.6% / 3.33 (667 ms) | - |
| vandamme | 77.5% / 0 (667 ms) | 86.0% / 3.33 (667 ms) | 66.1% / 0 (667 ms) | 90.5% / 3.33 (667 ms) | - |
| suchet | 69.8% / 3.33 (667 ms) | 72.8% / 3.33 (667 ms) | 66.1% / 0 (667 ms) | 93.3% / 3.33 (667 ms) | - |
| dok | 93.3% / 3.33 (667 ms) | 84.3% / 0 (667 ms) | 66.1% / 0 (667 ms) | 95.8% / 3.33 (667 ms) | - |
| caffarelli | 67.2% / 14.83 (2967 ms) | 68.8% / 3.33 (667 ms) | 78.0% / 0 (433 ms) | 84.4% / 3.33 (667 ms) | - |
| c_iv | - | - | 76.4% / 26.67 (667 ms) | - | 71.9% / 5.17 (1333 ms) |
| friant | 84.0% / 3.33 (667 ms) | 91.0% / 3.33 (667 ms) | 0.0% / 0 (33 ms) | 89.3% / 3.33 (667 ms) | - |
| bourcier | 85.0% / 4.17 (833 ms) | 85.6% / 3.33 (667 ms) | 0.0% / 0 (67 ms) | 87.1% / 3.33 (667 ms) | - |

## The 90-frame benchmark against longer playback

The benchmark's hybrid Play (09:00, 90 frames at 1/2x): formation-frames drawn 59.0%, longest hidden 4033 ms (its starved: dhautpoul, walther, guard_cav, vandamme, kellermann, guard_inf, rg_cav, kollo, nansouty). The long run from 08:30 cut into 17 windows of 90 play frames: share drawn 57.1% to 82.9%; 10 windows with a formation hidden for the whole window (3,000 ms); over the whole run 69.2%, longest 5667 ms.

| window (clock) | share drawn | longest hidden in the window | who |
|---|---|---|---|
| 08:30-08:44 | 57.1% | 3000 ms | guard_cav |
| 08:44-08:50 | 59.9% | 3000 ms | dhautpoul |
| 08:50-09:00 | 63.1% | 3000 ms | nansouty |
| 09:00-09:10 | 74.9% | 3000 ms | guard_cav |
| 09:10-09:15 | 73.1% | 3000 ms | lich |
| 09:15-09:29 | 71.6% | 3000 ms | guard_cav |
| 09:29-09:35 | 63.8% | 3000 ms | dhautpoul |
| 09:35-09:45 | 61.9% | 2633 ms | kellermann |
| 09:45-09:55 | 70.7% | 3000 ms | nansouty |
| 09:55-10:10 | 73.1% | 1967 ms | caffarelli |
| 10:10-10:25 | 72.0% | 2367 ms | rg_inf |
| 10:25-10:30 | 67.1% | 1633 ms | guard_inf |
| 10:30-10:45 | 76.2% | 1367 ms | dhautpoul |
| 10:45-10:59 | 75.9% | 1533 ms | guard_cav |
| 10:59-11:05 | 82.9% | 3000 ms | guard_cav |
| 11:05-11:15 | 66.3% | 2033 ms | kollo |
| 11:15-11:25 | 65.8% | 3000 ms | kollo |
