# Visibility over long playback: the tables

Made by `tools/audit-post8/visibility/analyse.js` from `runs/` (`long-play.js`, `realtime.js`). Build austerlitz-command-map.html (md5 f10fe585c46aea576f436ed51ac46f83), Chromium 141.0.7390.37.
Codes per frame: drawn, hidden by the layout (held or dropped; with or without room for the full search), behind the ground, off the screen or under a panel, not in the layer. Times in ms are the driver's clock (30 frames a second unless said); clock minutes are the battle's.

## Runs

| run | view | presentation, mode | reading | Follow | speed | clock | play frames | passes | dwell frames | formation-frames drawn / in view (play) | longest hidden by the layout | keep hidden | quirk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| bench-hybrid | hybrid-field 1600x900 | study, hybrid | none | on | 0.5x | 09:00-09:14 | 90 | 9 | 8 | 1440 / 2520 (57.1%) | 4033 ms | 0 | 0 |
| bench-land | land-field 1600x900 | study, terrain | none | on | 0.5x | 09:00-09:14 | 90 | 9 | 8 | 1861 / 2340 (79.5%) | 667 ms | 0 | 0 |
| bench-paper | paper-frame 1600x900 | study, staff | none | on | 0.5x | 09:00-09:14 | 90 | 9 | 8 | 1147 / 1260 (91.0%) | 667 ms | 0 | 0 |
| hybrid-0830 | hybrid-field 1600x900 | study, hybrid | none | on | 0.5x | 08:30-11:30 | 1560 | 156 | 600 | 29061 / 43005 (67.6%) | 27667 ms | 0 | 0 |
| hybrid-0830-60 | hybrid-field 1600x900 | study, hybrid | none | on | 0.5x (16.667 ms frames) | 08:30-11:30 | 3120 | 156 | 1197 | 57723 / 86013 (67.1%) | 27667 ms | 0 | 0 |
| hybrid-1200 | hybrid-field 1600x900 | study, hybrid | none | on | 0.5x | 12:00-15:00 | 1328 | 132 | 316 | 22974 / 31626 (72.6%) | 15333 ms | 0 | 0 |
| hybrid-4x-day | hybrid-field 1600x900 | study, hybrid | none | on | 4x | 04:01-18:00 | 1800 | 180 | 1437 | 27966 / 42841 (65.3%) | 13000 ms | 0 | 0 |
| land-0900 | land-field 1600x900 | study, terrain | none | on | 0.5x | 09:00-12:00 | 1508 | 150 | 541 | 34330 / 38417 (89.4%) | 1667 ms | 0 | 0 |
| land-4x-day | land-field 1600x900 | study, terrain | none | on | 4x | 04:01-18:00 | 1800 | 180 | 1440 | 35087 / 42248 (83.1%) | 2533 ms | 0 | 0 |
| paper-0900 | paper-frame 1600x900 | study, staff | none | on | 0.5x | 09:00-12:00 | 1508 | 150 | 541 | 19669 / 21112 (93.2%) | 667 ms | 0 | 0 |
| phone-0900 | phone-hybrid 390x844 | study, hybrid | none | on | 0.5x | 09:00-12:00 | 1508 | 150 | 541 | 7046 / 13635 (51.7%) | 25100 ms | 0 | 0 |
| phone-land-0900 | phone-land 390x844 | study, terrain | none | on | 0.5x | 09:00-12:00 | 1508 | 150 | 541 | 3689 / 4637 (79.6%) | 2333 ms | 0 | 0 |
| hybrid-fr-0900 | hybrid-field 1600x900 | study, hybrid | fr | on | 0.5x | 09:00-12:00 | 1508 | 150 | 541 | 24116 / 34948 (69.0%) | 16000 ms | 0 | 0 |
| hybrid-al-0900 | hybrid-field 1600x900 | study, hybrid | al | on | 0.5x | 09:00-12:00 | 1508 | 150 | 541 | 20341 / 26573 (76.5%) | 24667 ms | 0 | 0 |
| hybrid-fixed-0830 | hybrid-field 1600x900 | study, hybrid | none | off | 0.5x | 08:30-11:30 | 1560 | 156 | 600 | 31519 / 43680 (72.2%) | 22000 ms | 0 | 0 |
| hybrid-watch-0830 | hybrid-field 1600x900 | watch, hybrid | none | on | 0.5x | 08:30-11:30 | 1560 | 156 | 600 | 30736 / 43589 (70.5%) | 17667 ms | 0 | 0 |
| land-watch-0900 | land-field 1600x900 | watch, terrain | none | on | 0.5x | 09:00-12:00 | 1508 | 150 | 541 | 34918 / 39107 (89.3%) | 1667 ms | 0 | 0 |
| hybrid-sel-0900 | hybrid-field 1600x900 | study, hybrid | none, selected nansouty | on | 0.5x | 09:00-10:00 | 540 | 54 | 225 | 9649 / 15120 (63.8%) | 15867 ms | 0 | 0 |
| hybrid-0900-1h | hybrid-field 1600x900 | study, hybrid | none | on | 0.5x | 09:00-10:00 | 540 | 54 | 225 | 9743 / 15120 (64.4%) | 19033 ms | 0 | 0 |
| hybrid-0900-157 | hybrid-field 1600x900 | study, hybrid | none | on | 0.5x (157 ms frames) | 09:00-10:00 | 150 | 50 | 63 | 2816 / 4200 (67.0%) | 19154 ms | 0 | 0 |
| hybrid-0900-slow | hybrid-field 1600x900 | study, hybrid | none | on | 0.5x (1000 ms frames) | 09:00-10:00 | 150 | 150 | 63 | 2901 / 4200 (69.1%) | 174000 ms | 0 | 0 |

## Priority checks (play frames)

| run | protected items hidden (frames) | events drawn / in view | army and corps counters drawn / in view | not always drawn | places | objectives | by echelon (army, corps, div, bde) |
|---|---|---|---|---|---|---|---|
| bench-hybrid | 0 | 313/313 (100.0%) | 310/360 (86.1%) | ahq 81.1%, 2.83 min; lich 84.4%, 2.33 min; bag 78.9%, 3.17 min | 197/1080 (18.2%) | 160/180 (88.9%) | 90.6%, 81.7%, 52.3%, - |
| bench-land | 0 | 313/313 (100.0%) | 163/180 (90.6%) | lich 81.1%, 2.83 min | 179/1080 (16.6%) | 169/180 (93.9%) | -, 90.6%, 78.6%, - |
| bench-paper | 0 | 313/313 (100.0%) | 1057/1170 (90.3%) | c_iv 61.1%, 3.17 min; c_iii 87.8%, 1.52 min; col4 87.8%, 1.52 min; constantine 77.8%, 3.33 min; ahq 82.2%, 2.67 min; buxhowden 77.8%, 3.33 min | 44/1080 (4.1%) | 130/180 (72.2%) | 91.1%, 90.2%, 100.0%, - |
| hybrid-0830 | 0 | 3114/3114 (100.0%) | 5568/6075 (91.7%) | gqg 97.8%, 0 min; ahq 97.0%, 3.17 min; lich 84.9%, 3.33 min; bag 86.4%, 3.33 min | 2596/18407 (14.1%) | 1827/2434 (75.1%) | 97.4%, 85.6%, 63.6%, - |
| hybrid-0830-60 | 0 | 6220/6220 (100.0%) | 11119/12150 (91.5%) | gqg 97.7%, 0 min; ahq 96.9%, 3.25 min; lich 84.7%, 3.33 min; bag 86.2%, 3.33 min | 4795/36814 (13.0%) | 3682/4867 (75.7%) | 97.3%, 85.4%, 63.1%, - |
| hybrid-1200 | 0 | 3233/3233 (100.0%) | 3445/3809 (90.4%) | gqg 91.3%, 2.83 min; ahq 94.3%, 3.33 min; lich 87.3%, 0.24 min; bag 86.0%, 3.17 min | 3718/14438 (25.8%) | 948/1328 (71.4%) | 92.7%, 86.7%, 70.2%, - |
| hybrid-4x-day | 0 | 3659/3659 (100.0%) | 6108/7468 (81.8%) | gqg 88.4%, 0.71 min; ahq 83.2%, 7.99 min; lich 72.0%, 81.93 min; bag 84.5%, 0 min; c_iv 80.8%, 0 min; c_iii 81.7%, 3.01 min; c_v 56.9%, 3.01 min; c_cav 68.9%, 26.67 min; c_i 89.2%, 0 min; c_gd 89.2%, 0 min; col4 80.8%, 0 min; constantine 77.2%, 25.66 min; buxhowden 89.2%, 0 min | 3527/20071 (17.6%) | 1950/2586 (75.4%) | 86.0%, 78.3%, 61.8%, - |
| land-0900 | 0 | 3043/3043 (100.0%) | 2589/2848 (90.9%) | lich 89.1%, 1.5 min; bag 93.0%, 3.1 min | 5883/17704 (33.2%) | 1696/2082 (81.5%) | -, 90.9%, 89.2%, - |
| land-4x-day | 0 | 3659/3659 (100.0%) | 3078/3209 (95.9%) | lich 98.1%, 0 min; bag 96.1%, 0 min; gqg 89.2%, 0 min; ahq 89.2%, 0 min; buxhowden 89.2%, 0 min | 6796/20072 (33.9%) | 1960/2585 (75.8%) | 89.2%, 96.7%, 82.0%, - |
| paper-0900 | 0 | 3043/3043 (100.0%) | 18352/19604 (93.6%) | c_iv 89.7%, 1.5 min; c_iii 91.0%, 1.83 min; c_v 97.3%, 1.83 min; c_cav 91.9%, 3.33 min; c_i 94.7%, 3.33 min; c_gd 91.3%, 3.33 min; col4 93.0%, 1.83 min; constantine 89.6%, 3.33 min; gqg 97.3%, 2.67 min; ahq 95.2%, 2.67 min; buxhowden 98.7%, 3.33 min; lich 90.8%, 3.33 min; bag 96.4%, 3.33 min | 2146/18096 (11.9%) | 1758/2145 (82.0%) | 96.3%, 93.1%, 87.3%, - |
| phone-0900 | 0 | 2965/2965 (100.0%) | 6926/12859 (53.9%) | c_iv 79.6%, 4.33 min; c_iii 76.2%, 12.17 min; c_v 30.5%, 8.33 min; c_cav 13.1%, 24.67 min; c_i 59.0%, 14.39 min; c_gd 33.2%, 16.83 min; col4 63.2%, 16.67 min; constantine 21.4%, 50.17 min; gqg 79.3%, 0 min; ahq 91.4%, 6 min; buxhowden 76.8%, 1.01 min; lich 0.0%, 90 min; bag 36.5%, 5.5 min | 1179/12624 (9.3%) | 991/1671 (59.3%) | 88.4%, 47.5%, 15.5%, - |
| phone-land-0900 | 0 | 2965/2965 (100.0%) | 3689/4637 (79.6%) | gqg 74.0%, 1.83 min; ahq 88.8%, 3.33 min; buxhowden 82.0%, 3.33 min; lich 70.4%, 10.17 min; bag 45.1%, 3.33 min | 1713/12624 (13.6%) | 1254/1671 (75.0%) | 85.2%, 75.3%, -, - |
| hybrid-fr-0900 | 0 | 3043/3043 (100.0%) | 4491/4880 (92.0%) | gqg 98.5%, 0 min; ahq 96.7%, 2.83 min; lich 86.1%, 3.1 min; bag 89.7%, 3.17 min | 5280/17704 (29.8%) | 1631/2082 (78.3%) | 98.0%, 87.8%, 65.3%, - |
| hybrid-al-0900 | 0 | 3043/3043 (100.0%) | 4467/4880 (91.5%) | gqg 95.6%, 0 min; ahq 98.9%, 2.83 min; lich 84.5%, 3.1 min; bag 89.7%, 3.17 min | 4248/17704 (24.0%) | 1690/2082 (81.2%) | 98.0%, 86.9%, 73.2%, - |
| hybrid-fixed-0830 | 0 | 3114/3114 (100.0%) | 6017/6240 (96.4%) | gqg 99.2%, 0 min; ahq 97.6%, 3.17 min; lich 95.2%, 3.33 min; bag 93.7%, 3.33 min | 7115/18720 (38.0%) | 1994/2497 (79.9%) | 98.4%, 94.5%, 68.1%, - |
| hybrid-watch-0830 | 0 | 3114/3114 (100.0%) | 5792/6240 (92.8%) | ahq 97.0%, 3.17 min; lich 84.6%, 3.33 min; bag 89.7%, 3.33 min | 2895/18720 (15.5%) | 1904/2497 (76.3%) | 98.5%, 87.1%, 66.8%, - |
| land-watch-0900 | 0 | 3043/3043 (100.0%) | 2789/3016 (92.5%) | lich 89.1%, 1.5 min; bag 95.9%, 1.5 min | 7019/18096 (38.8%) | 1722/2145 (80.3%) | -, 92.5%, 89.0%, - |
| hybrid-sel-0900 | 0 | 1136/1136 (100.0%) | 2071/2160 (95.9%) | gqg 92.2%, 2.77 min; ahq 96.9%, 2.83 min; lich 94.4%, 2.67 min | 562/6480 (8.7%) | 602/787 (76.5%) | 94.5%, 97.2%, 58.5%, - |
| hybrid-0900-1h | 0 | 1136/1136 (100.0%) | 2022/2160 (93.6%) | gqg 95.7%, 0 min; ahq 96.9%, 2.83 min; lich 85.4%, 3.1 min; bag 96.5%, 3.17 min | 725/6480 (11.2%) | 697/787 (88.6%) | 96.3%, 90.9%, 59.6%, - |
| hybrid-0900-157 | 0 | 313/313 (100.0%) | 543/600 (90.5%) | gqg 93.3%, 0 min; ahq 96.0%, 3.6 min; lich 76.0%, 3.6 min; bag 96.7%, 3 min | 180/1800 (10.0%) | 188/218 (86.2%) | 94.7%, 86.3%, 63.1%, - |
| hybrid-0900-slow | 0 | 313/313 (100.0%) | 584/600 (97.3%) | gqg 97.3%, 0 min; ahq 98.7%, 1.2 min; lich 94.7%, 1.2 min; bag 98.7%, 1.2 min | 208/1800 (11.6%) | 204/218 (93.6%) | 98.0%, 96.7%, 64.4%, - |

## Priority against the static layout (play frames)

A fresh view's layout (`build`) in the same frame, against what the layout in motion drew: 'starved' frames the fresh layout would draw an item the moving layout hides; 'extra' frames the moving layout draws an item the fresh layout would not (a kept place).

| run | formations: share in motion, fresh | starved, extra | places: share, fresh | starved, extra | objectives: share, fresh | extra | events |
|---|---|---|---|---|---|---|---|
| bench-hybrid | 57.1%, 76.9% | 600, 102 | 18.2%, 15.6% | 29, 57 | 88.9%, 94.4% | 4 | 100.0% |
| bench-land | 79.5%, 99.7% | 479, 7 | 16.6%, 24.0% | 115, 35 | 93.9%, 100.0% | 0 | 100.0% |
| bench-paper | 91.0%, 100.0% | 113, 0 | 4.1%, 2.9% | 8, 21 | 72.2%, 100.0% | 0 | 100.0% |
| hybrid-0830 | 67.6%, 77.2% | 6679, 2517 | 14.1%, 9.5% | 773, 1622 | 75.1%, 95.5% | 29 | 100.0% |
| hybrid-0830-60 | 67.1%, 77.2% | 13433, 4725 | 13.0%, 9.5% | 1539, 2836 | 75.7%, 95.6% | 59 | 100.0% |
| hybrid-1200 | 72.6%, 84.5% | 4901, 1142 | 25.8%, 22.4% | 506, 986 | 71.4%, 77.3% | 87 | 100.0% |
| hybrid-4x-day | 65.3%, 81.1% | 8813, 2043 | 17.6%, 15.4% | 1305, 1741 | 75.4%, 91.2% | 96 | 100.0% |
| land-0900 | 89.4%, 99.9% | 4087, 23 | 33.2%, 28.9% | 1302, 2073 | 81.5%, 93.6% | 129 | 100.0% |
| land-4x-day | 83.1%, 99.9% | 7153, 41 | 33.9%, 31.2% | 1292, 1834 | 75.8%, 99.9% | 0 | 100.0% |
| paper-0900 | 93.2%, 100.0% | 1443, 0 | 11.9%, 4.9% | 434, 1691 | 82.0%, 100.0% | 0 | 100.0% |
| phone-0900 | 51.7%, 60.1% | 1935, 788 | 9.3%, 8.7% | 461, 546 | 59.3%, 80.3% | 116 | 100.0% |
| phone-land-0900 | 79.6%, 98.6% | 903, 22 | 13.6%, 9.3% | 499, 1042 | 75.0%, 100.0% | 0 | 100.0% |
| hybrid-fr-0900 | 69.0%, 78.9% | 5129, 1655 | 29.8%, 22.3% | 881, 2217 | 78.3%, 94.4% | 86 | 100.0% |
| hybrid-al-0900 | 76.5%, 88.7% | 3966, 734 | 24.0%, 17.6% | 841, 1977 | 81.2%, 89.3% | 123 | 100.0% |
| hybrid-fixed-0830 | 72.2%, 77.2% | 4719, 2512 | 38.0%, 27.4% | 523, 2502 | 79.9%, 92.2% | 109 | 100.0% |
| hybrid-watch-0830 | 70.5%, 78.6% | 6521, 2985 | 15.5%, 10.7% | 1090, 1984 | 76.3%, 96.1% | 42 | 100.0% |
| land-watch-0900 | 89.3%, 99.9% | 4189, 23 | 38.8%, 33.6% | 973, 1920 | 80.3%, 93.8% | 129 | 100.0% |
| hybrid-sel-0900 | 63.8%, 72.9% | 2136, 755 | 8.7%, 7.8% | 197, 253 | 76.5%, 89.6% | 55 | 100.0% |
| hybrid-0900-1h | 64.4%, 73.9% | 2228, 797 | 11.2%, 8.7% | 202, 362 | 88.6%, 96.4% | 11 | 100.0% |
| hybrid-0900-157 | 67.0%, 74.0% | 617, 324 | 10.0%, 8.6% | 54, 79 | 86.2%, 96.3% | 6 | 100.0% |
| hybrid-0900-slow | 69.1%, 74.0% | 422, 215 | 11.6%, 8.3% | 47, 106 | 93.6%, 96.3% | 7 | 100.0% |

## bench-hybrid: every formation (play frames, 09:00-09:14)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 90 | 0 | 0.0% | 0.0%, 3000 | 3000; 14.69; 09:00 | 1 | 55.6% | d d d | `xxx` |
| walther (Walther's Dragoons) | div cav fr | 3.200 | 90 | 0 | 0.0% | 1.1%, 2800 | 3000; 14.69; 09:00 | 1 | 47.8% | d d d | `xxx` |
| milo (Miloradovich's Russians) | div inf ru | 3.200 | 90 | 0 | 0.0% | 31.1%, 933 | 3000; 14.69; 09:00 | 1 | 7.8% | d d d | `xxx` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 90 | 8 | 8.9% | 0.0%, 3000 | 2100; 10.19; 09:04 | 2 | 53.7% | d d d | `-xx` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 90 | 15 | 16.7% | 16.7%, 2467 | 2300; 11.5; 09:00 | 2 | 57.3% | d d d | `xx+` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 90 | 19 | 21.1% | 75.6%, 667 | 2367; 11.52; 09:03 | 1 | 32.4% | # d # | `+xx` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 90 | 19 | 21.1% | 8.9%, 2333 | 2367; 11.52; 09:03 | 1 | 16.9% | # d d | `+xx` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 90 | 25 | 27.8% | 71.1%, 700 | 600; 3; 09:03 | 4 | 98.5% | # # d | `---` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 90 | 50 | 55.6% | 100.0%, 0 | 667; 3.33; 09:03 | 2 | 100.0% | # # # | `++-` |
| friant (Friant's Division) | div inf fr | 3.200 | 90 | 51 | 56.7% | 100.0%, 0 | 667; 3.33; 09:06 | 2 | 100.0% | # # # | `--#` |
| prz (Third Column) | div inf ru | 3.199 | 90 | 54 | 60.0% | 100.0%, 0 | 667; 3.33; 09:01 | 2 | 100.0% | # # # | `--#` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 90 | 55 | 61.1% | 100.0%, 0 | 400; 2; 09:04 | 3 | 77.1% | # d # | `#+-` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 90 | 55 | 61.1% | 100.0%, 0 | 667; 3.33; 09:05 | 2 | 100.0% | # # # | `--#` |
| lang (Second Column) | div inf ru | 3.199 | 90 | 59 | 65.6% | 100.0%, 0 | 533; 2.67; 09:10 | 2 | 100.0% | # # # | `+#-` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 90 | 60 | 66.7% | 84.4%, 200 | 633; 3.17; 09:06 | 2 | 63.3% | # d # | `#-+` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 90 | 61 | 67.8% | 100.0%, 0 | 600; 3; 09:08 | 2 | 86.2% | # # # | `#-+` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 90 | 61 | 67.8% | 100.0%, 0 | 667; 3.33; 09:03 | 2 | 100.0% | # # # | `+++` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 90 | 70 | 77.8% | 100.0%, 0 | 467; 2.33; 09:09 | 2 | 100.0% | # # # | `#++` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 90 | 71 | 78.9% | 100.0%, 0 | 633; 3.17; 09:00 | 1 | 73.7% | # # # | `-##` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 90 | 71 | 78.9% | 100.0%, 0 | 633; 3.17; 09:00 | 1 | 100.0% | # # # | `-##` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 90 | 72 | 80.0% | 100.0%, 0 | 600; 3; 09:02 | 1 | 100.0% | # # # | `-##` |
| dok (First Column) | div inf ru | 3.199 | 90 | 72 | 80.0% | 100.0%, 0 | 600; 3; 09:10 | 1 | 100.0% | # # # | `##-` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 90 | 73 | 81.1% | 100.0%, 0 | 567; 2.83; 09:00 | 1 | 0.0% | # # # | `-##` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 90 | 73 | 81.1% | 100.0%, 0 | 567; 2.83; 09:10 | 1 | 41.2% | # # # | `##-` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 90 | 76 | 84.4% | 100.0%, 0 | 467; 2.33; 09:01 | 1 | 21.4% | # # # | `+##` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 90 | 90 | 100.0% | 71.1%, 367 | 0; 0; - | 0 | - | # # d | `###` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 90 | 90 | 100.0% | 93.3%, 200 | 0; 0; - | 0 | - | # # # | `###` |

Other items not always drawn while in view (17 of 22 in view): `t:vinohrady` place 0.0% (longest 14.69 min); `t:pratzeberg` place 0.0% (longest 14.69 min); `t:santon` place 0.0% (longest 14.69 min); `t:zuran` place 0.0% (longest 14.69 min); `t:goldbach` place 0.0% (longest 14.69 min); `t:sokolnitz` place 0.0% (longest 14.69 min); `t:austerlitz` place 0.0% (longest 14.69 min); `t:telnitz` place 11.1% (longest 9.85 min); `t:pratzen` place 27.8% (longest 6 min); `t:litava` place 35.6% (longest 9.35 min); `o:Saint-Hilaire` overlay 43.3% (longest 3.33 min); `p:plateau` plateau 44.4% (longest 6.5 min); `o:Friant retakes Telnitz` overlay 48.9% (longest 3.33 min); `t:satschan` place 56.7% (longest 6.19 min); `o:Vandamme` overlay 58.9% (longest 3.33 min); `o:Stare Vinohrady` objective 77.8% (longest 3.33 min); `t:augezd` place 87.8% (longest 1.52 min)

## bench-land: every formation (play frames, 09:00-09:14)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| vandamme (Vandamme's Division) | div inf fr | 7.199 | 90 | 33 | 36.7% | 100.0%, 0 | 600; 3; 09:07 | 4 | 100.0% | # # # | `--+` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 7.199 | 90 | 34 | 37.8% | 100.0%, 0 | 667; 3.33; 09:05 | 3 | 100.0% | # # # | `#--` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 7.200 | 90 | 40 | 44.4% | 100.0%, 0 | 667; 3.33; 09:03 | 3 | 100.0% | # # # | `+-+` |
| guard_cav (Guard Cavalry) | div cav fr | 7.200 | 90 | 40 | 44.4% | 100.0%, 0 | 667; 3.33; 09:06 | 3 | 100.0% | # # # | `--+` |
| friant (Friant's Division) | div inf fr | 7.200 | 90 | 48 | 53.3% | 100.0%, 0 | 600; 3; 09:03 | 3 | 100.0% | # # # | `--#` |
| guard_inf (Guard Infantry) | div guard fr | 7.200 | 90 | 53 | 58.9% | 100.0%, 0 | 633; 3.17; 09:03 | 2 | 100.0% | # # # | `-+#` |
| rg_cav (Guard Cavalry) | div cav ru | 7.200 | 90 | 54 | 60.0% | 100.0%, 0 | 667; 3.33; 09:10 | 2 | 100.0% | # # # | `#--` |
| bourcier (Bourcier's Dragoons) | div cav fr | 7.200 | 90 | 70 | 77.8% | 100.0%, 0 | 667; 3.33; 09:10 | 1 | 100.0% | # # # | `##-` |
| suchet (Suchet's Division) | div inf fr | 7.199 | 90 | 70 | 77.8% | 100.0%, 0 | 667; 3.33; 09:10 | 1 | 100.0% | # # # | `##-` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 7.199 | 90 | 70 | 77.8% | 100.0%, 0 | 667; 3.33; 09:10 | 1 | 100.0% | # # # | `##-` |
| rivaud (Rivaud's Division) | div inf fr | 7.199 | 90 | 71 | 78.9% | 100.0%, 0 | 633; 3.17; 09:01 | 1 | 100.0% | # # # | `-##` |
| lich (Fifth Column (cavalry)) | corps cav ru | 7.099 | 90 | 73 | 81.1% | 100.0%, 0 | 567; 2.83; 09:10 | 1 | 100.0% | # # # | `##-` |
| legrand (Legrand's Division) | div inf fr | 7.199 | 90 | 74 | 82.2% | 100.0%, 0 | 533; 2.67; 09:09 | 1 | 100.0% | # # # | `#++` |
| caffarelli (Caffarelli's Division) | div inf fr | 7.199 | 90 | 77 | 85.6% | 100.0%, 0 | 433; 2.17; 09:07 | 1 | 100.0% | # # # | `#+#` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 7.200 | 90 | 77 | 85.6% | 92.2%, 233 | 433; 2.17; 09:11 | 1 | 100.0% | # # # | `##+` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 7.199 | 90 | 77 | 85.6% | 100.0%, 0 | 433; 2.17; 09:06 | 1 | 100.0% | # # # | `#+#` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 7.200 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| walther (Walther's Dragoons) | div cav fr | 7.200 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| c_gren (Grenadier Division) | div inf fr | 7.199 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| dok (First Column) | div inf ru | 7.199 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| lang (Second Column) | div inf ru | 7.199 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| prz (Third Column) | div inf ru | 7.199 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| milo (Miloradovich's Russians) | div inf ru | 7.200 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| kollo (Kollowrat's Austrians) | div inf at | 7.199 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| bag (Advance Guard of the Right) | corps inf ru | 7.099 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| rg_inf (Guard Infantry) | div guard ru | 7.200 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |

Other items not always drawn while in view (13 of 22 in view): `t:pratzen` place 0.0% (longest 14.69 min); `t:vinohrady` place 0.0% (longest 14.69 min); `t:pratzeberg` place 0.0% (longest 14.69 min); `t:zuran` place 0.0% (longest 14.69 min); `t:litava` place 0.0% (longest 14.69 min); `t:telnitz` place 0.0% (longest 14.69 min); `t:satschan` place 2.2% (longest 8.17 min); `t:sokolnitz` place 13.3% (longest 12.69 min); `t:austerlitz` place 23.3% (longest 11.19 min); `t:augezd` place 27.8% (longest 10.52 min); `t:goldbach` place 32.2% (longest 9.86 min); `o:Saint-Hilaire` overlay 78.9% (longest 3.17 min); `o:Stare Vinohrady` objective 87.8% (longest 1.52 min)

## bench-paper: every formation (play frames, 09:00-09:14)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| c_iv (IV Corps) | corps inf fr | 3.098 | 90 | 55 | 61.1% | 100.0%, 0 | 633; 3.17; 09:10 | 2 | 100.0% | # # # | `#--` |
| constantine (Russian Imperial Guard) | corps guard ru | 3.099 | 90 | 70 | 77.8% | 100.0%, 0 | 667; 3.33; 09:10 | 1 | 100.0% | # # # | `##-` |
| buxhowden (Left Wing Command) | corps hq ru | 3.096 | 90 | 70 | 77.8% | 100.0%, 0 | 667; 3.33; 09:10 | 1 | 100.0% | # # # | `##-` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 90 | 74 | 82.2% | 100.0%, 0 | 533; 2.67; 09:07 | 1 | 100.0% | # # # | `#-#` |
| c_iii (III Corps (detachment)) | corps inf fr | 3.100 | 90 | 79 | 87.8% | 100.0%, 0 | 367; 1.52; 09:13 | 1 | 100.0% | # # # | `##+` |
| col4 (Fourth Column) | corps inf at | 3.099 | 90 | 79 | 87.8% | 100.0%, 0 | 367; 1.52; 09:13 | 1 | 100.0% | # # # | `##+` |
| c_v (V Corps) | corps inf fr | 3.099 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| c_cav (Cavalry Reserve) | corps cav fr | 3.099 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| c_i (I Corps) | corps inf fr | 3.099 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| c_gd (Imperial Guard) | corps guard fr | 3.099 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 90 | 90 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `###` |

Other items not always drawn while in view (17 of 22 in view): `t:pratzen` place 0.0% (longest 14.69 min); `t:vinohrady` place 0.0% (longest 14.69 min); `t:pratzeberg` place 0.0% (longest 14.69 min); `t:santon` place 0.0% (longest 14.69 min); `t:goldbach` place 0.0% (longest 14.69 min); `t:telnitz` place 0.0% (longest 14.69 min); `t:augezd` place 0.0% (longest 14.69 min); `t:satschan` place 0.0% (longest 14.69 min); `t:austerlitz` place 0.0% (longest 14.69 min); `t:litava` place 11.1% (longest 13.02 min); `t:sokolnitz` place 14.4% (longest 11.5 min); `t:zuran` place 23.3% (longest 11.5 min); `o:Pratzeberg` objective 66.7% (longest 3.17 min); `o:Saint-Hilaire` overlay 77.8% (longest 3.33 min); `o:Stare Vinohrady` objective 77.8% (longest 3.33 min); `p:plateau` plateau 87.8% (longest 1.52 min); `o:Vandamme` overlay 87.8% (longest 1.52 min)

## hybrid-0830: every formation (play frames, 08:30-11:30)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 1560 | 153 | 9.8% | 3.8%, 16100 | 12667; 46.83; 09:43 | 10 | 35.7% | d d d | `x--xxxxx-xx-xx-xxxxxxxx-x--xxx--x-#+` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 1560 | 247 | 15.8% | 10.4%, 16367 | 17667; 54.83; 08:45 | 10 | 13.6% | # d d | `##+xxxxxxxxxx--xxxxx-#+---xxxx---xxx` |
| walther (Walther's Dragoons) | div cav fr | 3.200 | 1560 | 253 | 16.2% | 26.1%, 30000 | 15333; 56.67; 09:26 | 21 | 38.1% | d # # | `x-----xx-x--xxxxxxxxxx----+---------` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 1560 | 258 | 16.5% | 20.8%, 16500 | 13233; 48.17; 09:30 | 15 | 28.6% | d d d | `xx-------x--xxxxxxxxx-x+##x----xxxxx` |
| milo (Miloradovich's Russians) | div inf ru | 3.200 | 1560 | 273 | 17.5% | 47.9%, 7433 | 27667; 99.83; 09:15 | 8 | 16.2% | d # # | `-+--xxx--xxxxxxxxxxxxxxxxxxx-#+xx+##` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 1560 | 571 | 36.6% | 42.1%, 12367 | 12333; 39.83; 08:45 | 8 | 16.3% | # # # | `##+xxxxxxx-+#xxxxxxxxx--xx-#####+#-#` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 1560 | 726 | 46.5% | 38.2%, 5833 | 3133; 7.5; 08:37 | 20 | 42.0% | d d d | `x--##++#+x--x++x+#+-x----+#+++##--+x` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 1560 | 1011 | 64.8% | 56.3%, 5267 | 3667; 18.33; 09:56 | 19 | 44.8% | # d d | `##++-+###########-xx--++--#-++++x-xx` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 1560 | 1025 | 65.7% | 95.2%, 1567 | 2000; 5.17; 09:25 | 25 | 36.3% | # # # | `#-+#-++++#+---###-##-#-++##-#--++#--` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 1560 | 1136 | 72.8% | 99.6%, 200 | 667; 3.33; 08:38 | 23 | 72.9% | # # # | `#+--++##+##+-#+#+###-#+++####+##++-+` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 1560 | 1144 | 73.3% | 97.7%, 900 | 2000; 0.64; 11:14 | 21 | 54.6% | # # # | `#++-+-++##+-######++#+++#-#-##-#-#-#` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 1560 | 1172 | 75.1% | 48.8%, 7967 | 5033; 15.4; 11:14 | 11 | 34.5% | # d d | `#-+########++#########++#-##x+++-xxx` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 1560 | 1181 | 75.7% | 96.5%, 1067 | 667; 3.33; 08:38 | 23 | 74.7% | # # # | `#++-++#++#++#-+##--####+#####++-++#+` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 1560 | 1199 | 76.9% | 93.8%, 2133 | 667; 1.5; 08:45 | 22 | 30.2% | # d # | `#+#+-###+#-+##+#-##+++#+#####+-+--##` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 1560 | 1253 | 80.3% | 97.9%, 667 | 2667; 8.5; 11:06 | 14 | 63.5% | # # # | `##---+####+++#+#++########+###+---##` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 1400 | 1139 | 81.4% | 99.4%, 300 | 667; 0; 08:45 | 15 | 100.0% | # o o | `#++++########-+##+#####++---++#--...` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 1560 | 1294 | 82.9% | 100.0%, 0 | 667; 3.33; 08:40 | 14 | 63.9% | # # # | `#---++##+##++#+#################+#-#` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 1560 | 1300 | 83.3% | 99.4%, 300 | 667; 0.4; 08:44 | 15 | 28.8% | # # # | `--+-+###+#+#####-###########-++-++##` |
| friant (Friant's Division) | div inf fr | 3.200 | 1429 | 1211 | 84.7% | 100.0%, 0 | 667; 2.93; 08:45 | 14 | 100.0% | # o o | `-+--###++##+################-+#+-...` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 1560 | 1324 | 84.9% | 100.0%, 0 | 667; 3.33; 08:35 | 15 | 41.1% | # # # | `#-+#######++#-+########+####-++-+--#` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 1395 | 1205 | 86.4% | 100.0%, 0 | 667; 3.33; 08:35 | 12 | 73.2% | # # # | `#-+##################+-+....-+###-++` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 1456 | 1283 | 88.1% | 98.8%, 233 | 1300; 6.5; 08:31 | 10 | 86.1% | # o o | `--+#####################++#+#+##-...` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 1560 | 1380 | 88.5% | 100.0%, 0 | 667; 0.24; 08:45 | 11 | 100.0% | # # # | `#-+#####+########-######+##--##-+###` |
| lang (Second Column) | div inf ru | 3.199 | 1560 | 1428 | 91.5% | 100.0%, 0 | 667; 0; 08:45 | 8 | 87.1% | # # # | `##+########+##+####++###########+##-` |
| prz (Third Column) | div inf ru | 3.199 | 1560 | 1447 | 92.8% | 100.0%, 0 | 667; 3.1; 09:26 | 7 | 100.0% | # # # | `##+########-+#############-#+#######` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 1560 | 1513 | 97.0% | 100.0%, 0 | 633; 3.17; 08:31 | 3 | 74.5% | # # # | `-######-##+#########################` |
| dok (First Column) | div inf ru | 3.199 | 1445 | 1409 | 97.5% | 100.0%, 0 | 633; 0; 11:15 | 3 | 100.0% | # o o | `##+#############################+...` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 1560 | 1526 | 97.8% | 100.0%, 0 | 400; 0; 09:30 | 3 | 35.3% | # # # | `#####+#####+##+#####################` |

Other items not always drawn while in view (40 of 53 in view): `t:vinohrady` place 0.6% (longest 165 min); `t:pratzeberg` place 1.4% (longest 136.5 min); `o:Russian Imperial Guard` overlay 2.1% (longest 15 min); `t:santon` place 9.4% (longest 51.5 min); `t:sokolnitz` place 11.6% (longest 60 min); `t:litava` place 12.1% (longest 95.17 min); `t:zuran` place 12.2% (longest 75.4 min); `t:telnitz` place 14.1% (longest 68.17 min); `t:austerlitz` place 17.9% (longest 60.33 min); `t:augezd` place 18.1% (longest 82.83 min); `t:satschan` place 20.1% (longest 71 min); `t:pratzen` place 25.6% (longest 49.83 min); `t:goldbach` place 26.3% (longest 103.5 min); `p:plateau` plateau 33.7% (longest 23.33 min); `o:Friant's approach march` overlay 38.1% (longest 1.93 min); `o:Liechtenstein crosses the front` overlay 41.2% (longest 5.93 min); `o:French on the plateau` overlay 41.3% (longest 6.67 min); `o:Liechtenstein and Uvarov` overlay 42.1% (longest 11.67 min); `o:II Column → Sokolnitz` overlay 47.4% (longest 3.33 min); `o:Stare Vinohrady` objective 55.1% (longest 6.83 min); `o:Kobelnitz — never reached` objective 55.7% (longest 3.17 min); `o:Bessières and Rapp` overlay 55.9% (longest 1.5 min); `o:Drouet forms line` overlay 55.9% (longest 4.66 min); `o:French hold the crest` overlay 57.9% (longest 3.5 min); `o:IV Column halted` overlay 63.9% (longest 3.33 min); ...

## hybrid-0830-60: every formation (play frames, 08:30-11:30)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 3120 | 386 | 12.4% | 3.7%, 16117 | 11500; 37.5; 10:40 | 13 | 36.0% | d d d | `x--xxx----x-xx-xxxxx-x--x--xxxxxx-#+` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 3120 | 520 | 16.7% | 20.8%, 16500 | 12250; 43.25; 09:30 | 10 | 23.4% | d d d | `xx-xx-xx-xx-xxxxxxxx-+-+##xxx-xxxxxx` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 3120 | 524 | 16.8% | 10.4%, 16350 | 17667; 54.92; 08:45 | 11 | 12.7% | # d d | `##+xxxxxxxxxx--x--xx-#+---xxxx---xxx` |
| milo (Miloradovich's Russians) | div inf ru | 3.200 | 3120 | 564 | 18.1% | 48.1%, 7433 | 27667; 99.92; 09:15 | 9 | 15.3% | d # # | `-+---xx--xxxxxxxxxxxxxxxxxxx-#+xx+##` |
| walther (Walther's Dragoons) | div cav fr | 3.200 | 3120 | 588 | 18.8% | 25.8%, 29983 | 13000; 45; 09:28 | 22 | 38.8% | d # # | `x---x-xx-x--xxxxxxxx-x----#---------` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 3120 | 1122 | 36.0% | 42.0%, 12383 | 12333; 39.92; 08:45 | 9 | 12.6% | # # # | `##+xxxxxxx-+#xxxxxxxx---xxx+####+#-#` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 3120 | 1183 | 37.9% | 56.3%, 5267 | 6233; 20.89; 08:53 | 21 | 33.9% | # d d | `##+-+xxx-xx-xx-x-###+--+--##+--+x-xx` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 3120 | 1437 | 46.1% | 38.2%, 5850 | 4500; 22.5; 10:02 | 19 | 34.6% | d d d | `x--##++#+---x++x+#-xxx---+#+++##--+x` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 3120 | 2026 | 64.9% | 95.2%, 1550 | 2000; 5.08; 09:25 | 26 | 41.1% | # # # | `#-+--++++#----###-##-#-++##-#--++#--` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 3120 | 2322 | 74.4% | 99.6%, 200 | 667; 3.33; 08:38 | 22 | 83.6% | # # # | `#+-+++##+##+-#++-###-#+++####+##++-+` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 3120 | 2354 | 75.4% | 96.5%, 1050 | 667; 3.33; 08:38 | 23 | 77.4% | # # # | `#+++++#++#++#-+##--####+#####++-++#+` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 3120 | 2384 | 76.4% | 48.8%, 7983 | 5017; 15.36; 11:14 | 11 | 39.1% | # d d | `#-+########++#########++#-##++++-xxx` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 3120 | 2416 | 77.4% | 93.8%, 2150 | 667; 1.58; 08:45 | 21 | 36.9% | # # # | `#+#+-###+#-+##+#-##++-#+#####+-+--##` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 3120 | 2425 | 77.7% | 97.9%, 650 | 2667; 8.42; 11:06 | 10 | 47.5% | # # # | `##----#####+##-################---##` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 3120 | 2523 | 80.9% | 97.7%, 883 | 2000; 0.63; 11:14 | 14 | 54.3% | # # # | `#++-############++###+++#-#+-#-#-+-#` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 2802 | 2323 | 82.9% | 99.4%, 300 | 667; 0; 08:45 | 14 | 100.0% | # o o | `#++++########-+##+#####++---++#-#...` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 3120 | 2597 | 83.2% | 99.4%, 317 | 667; 0.36; 08:44 | 15 | 25.4% | # # # | `--+-+###+#+#####-###########-++-++##` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 3120 | 2605 | 83.5% | 100.0%, 0 | 667; 3.33; 08:40 | 14 | 57.1% | # # # | `#--#-###+##++#+#################+#-#` |
| friant (Friant's Division) | div inf fr | 3.200 | 2858 | 2420 | 84.7% | 100.0%, 0 | 667; 2.98; 08:45 | 14 | 100.0% | # o o | `-+--###++##+################-+#+-...` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 3120 | 2642 | 84.7% | 100.0%, 0 | 667; 3.33; 08:35 | 15 | 37.0% | # # # | `#-+#######++#-+########+####-++-+--#` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 2790 | 2405 | 86.2% | 100.0%, 0 | 667; 3.33; 08:35 | 12 | 73.0% | # # # | `#-+##################+-+....-+###-++` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 2912 | 2568 | 88.2% | 98.7%, 250 | 1317; 6.58; 08:31 | 10 | 85.5% | # o o | `--++####################++#+#+##-...` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 3120 | 2756 | 88.3% | 100.0%, 0 | 667; 0.27; 08:45 | 11 | 100.0% | # # # | `#-++####+########-######+##--##-+###` |
| lang (Second Column) | div inf ru | 3.199 | 3120 | 2853 | 91.4% | 100.0%, 0 | 667; 0; 08:45 | 8 | 87.3% | # # # | `##+########+##+####++###########+##-` |
| prz (Third Column) | div inf ru | 3.199 | 3120 | 2890 | 92.6% | 100.0%, 0 | 667; 3.06; 09:26 | 7 | 100.0% | # # # | `##+########-+#############-#+#######` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 3120 | 3024 | 96.9% | 100.0%, 0 | 650; 3.25; 08:31 | 3 | 74.0% | # # # | `-######-##+#########################` |
| dok (First Column) | div inf ru | 3.199 | 2891 | 2818 | 97.5% | 100.0%, 0 | 633; 0; 11:15 | 3 | 100.0% | # o o | `##+#############################+...` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 3120 | 3048 | 97.7% | 100.0%, 0 | 433; 0; 09:30 | 3 | 36.1% | # # # | `#####+#####+##+#####################` |

Other items not always drawn while in view (40 of 53 in view): `t:vinohrady` place 0.6% (longest 165 min); `t:pratzeberg` place 1.3% (longest 136.58 min); `o:Russian Imperial Guard` overlay 2.1% (longest 15 min); `t:litava` place 5.1% (longest 166.75 min); `t:zuran` place 9.9% (longest 120 min); `t:santon` place 10.0% (longest 51.58 min); `t:sokolnitz` place 11.6% (longest 60 min); `t:telnitz` place 12.0% (longest 68.25 min); `t:augezd` place 18.1% (longest 82.83 min); `t:austerlitz` place 19.2% (longest 57 min); `t:satschan` place 19.3% (longest 71 min); `t:pratzen` place 24.4% (longest 60.27 min); `t:goldbach` place 24.9% (longest 104.73 min); `p:plateau` plateau 35.4% (longest 23.25 min); `o:Friant's approach march` overlay 37.5% (longest 1.81 min); `o:French on the plateau` overlay 40.2% (longest 6.67 min); `o:Liechtenstein crosses the front` overlay 40.7% (longest 5.98 min); `o:Liechtenstein and Uvarov` overlay 42.8% (longest 11.67 min); `o:II Column → Sokolnitz` overlay 47.9% (longest 3.33 min); `o:Stare Vinohrady` objective 53.8% (longest 6.75 min); `o:Kobelnitz — never reached` objective 55.2% (longest 3.25 min); `o:Bessières and Rapp` overlay 55.6% (longest 1.58 min); `o:Drouet forms line` overlay 55.6% (longest 4.72 min); `o:Nansouty's cuirassiers` overlay 61.0% (longest 8.42 min); `o:French hold the crest` overlay 62.5% (longest 3.42 min); ...

## hybrid-1200: every formation (play frames, 12:00-15:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 918 | 223 | 24.3% | 29.5%, 11000 | 14333; 56.83; 12:03 | 7 | 25.9% | # p p | `+xxxxxxxxxx---xx-##+-++-x...........` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 1014 | 271 | 26.7% | 23.0%, 7867 | 15300; 60; 12:00 | 8 | 42.1% | d p p | `xxxxxxxxxxx-xxx+-x++---+####........` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 815 | 290 | 35.6% | 59.1%, 5833 | 4667; 13.33; 12:25 | 12 | 23.6% | d o o | `x+xx+xx-----xxx+####-#-x............` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 1033 | 439 | 42.5% | 45.9%, 12667 | 13333; 50.17; 12:10 | 10 | 33.0% | d p p | `-#xxxxxxxxx-#######+#--++--x-.......` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 1328 | 637 | 48.0% | 53.1%, 12867 | 12600; 43; 12:27 | 9 | 34.9% | d # # | `xxxxx-xxxxxxx-++#--++--##-##########` |
| walther (Walther's Dragoons) | div cav fr | 3.200 | 816 | 485 | 59.4% | 93.6%, 667 | 1667; 8.33; 13:23 | 13 | 78.5% | d o o | `x-+#-#+##+++#-#-+x-x+-+#............` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 854 | 518 | 60.7% | 62.1%, 2833 | 2300; 11.5; 12:00 | 15 | 59.8% | d o o | `xx-##+#++--+-+#--+##++++............` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 1289 | 789 | 61.2% | 73.6%, 5133 | 4667; 13.33; 12:53 | 13 | 32.2% | # p p | `---x---x++-xx-++#+###########+####-.` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 1328 | 850 | 64.0% | 65.6%, 3867 | 5633; 28.17; 12:00 | 11 | 56.9% | d # # | `xxxxx---xx+#####-++#-+-#+#####-#####` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 1328 | 861 | 64.8% | 91.7%, 1300 | 6500; 22.5; 13:44 | 12 | 25.5% | # # # | `###-#+###-+####--###+xxxx-xx-#---+##` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 1328 | 957 | 72.1% | 91.6%, 1933 | 1967; 9.83; 12:00 | 18 | 70.4% | d # # | `x-+##--x+#-###-##+##-+-#-#+-#+######` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 1328 | 958 | 72.1% | 86.0%, 1600 | 3000; 15; 14:31 | 15 | 75.1% | # # d | `##-#-+###+--+#++-+-######-###+-xx+-#` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 1328 | 1004 | 75.6% | 100.0%, 0 | 667; 3.33; 12:13 | 18 | 78.7% | # # # | `++++#+-###---#+++###-+++#####+##++#+` |
| milo (Miloradovich's Russians) | div inf ru | 3.200 | 1266 | 970 | 76.6% | 87.0%, 3267 | 3667; 17.93; 12:30 | 10 | 60.5% | # p p | `#-###--xx-###############--##+-##++.` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 1107 | 856 | 77.3% | 100.0%, 0 | 667; 3.33; 12:10 | 14 | 66.1% | # p p | `##-##+#++-####-#######-+++#++-+.....` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 1328 | 1076 | 81.0% | 96.5%, 1100 | 667; 3.33; 12:06 | 15 | 63.9% | d # # | `--++-+###-#########++-++###--+####+#` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 1328 | 1083 | 81.6% | 88.1%, 1733 | 2667; 13.33; 14:03 | 10 | 64.5% | # # # | `++###+++################+xx-#++##---` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 688 | 562 | 81.7% | 100.0%, 0 | 667; 3.33; 12:05 | 7 | 100.0% | # o o | `---++####-######+++.................` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 762 | 629 | 82.5% | 100.0%, 0 | 667; 3.33; 12:05 | 8 | 95.5% | # o o | `#-++-+####++########++..............` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 629 | 541 | 86.0% | 100.0%, 0 | 633; 3.17; 12:45 | 6 | 88.6% | # o o | `--#######-+#####-...................` |
| dok (First Column) | div inf ru | 3.199 | 1328 | 1153 | 86.8% | 100.0%, 0 | 667; 3.33; 14:40 | 11 | 82.9% | # # # | `####-####+-#################-+-+-+-+` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 793 | 692 | 87.3% | 100.0%, 0 | 667; 0.24; 12:30 | 6 | 49.5% | # o o | `#-##++###--##########+-.............` |
| lang (Second Column) | div inf ru | 3.199 | 1328 | 1176 | 88.6% | 100.0%, 0 | 667; 3.33; 14:25 | 9 | 73.0% | # # # | `####-+####-++#++########++##++######` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 1328 | 1213 | 91.3% | 100.0%, 0 | 567; 2.83; 12:38 | 8 | 82.6% | # # # | `###--++++####+####################-#` |
| friant (Friant's Division) | div inf fr | 3.200 | 1328 | 1215 | 91.5% | 100.0%, 0 | 667; 3.33; 12:20 | 6 | 100.0% | # # # | `####-#####++##-####-#########+######` |
| prz (Third Column) | div inf ru | 3.199 | 1328 | 1241 | 93.4% | 100.0%, 0 | 667; 1.83; 12:28 | 5 | 100.0% | # # # | `#####+##+--#########################` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 1059 | 999 | 94.3% | 100.0%, 0 | 667; 3.33; 12:15 | 4 | 50.0% | # p p | `###-#+######################--......` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 1319 | 1286 | 97.5% | 100.0%, 0 | 567; 2.6; 14:57 | 2 | 90.9% | # p p | `++#################################-` |

Other items not always drawn while in view (30 of 39 in view): `t:satschan` place 0.0% (longest 180 min); `t:sokolnitz` place 1.0% (longest 150 min); `t:litava` place 5.7% (longest 78.33 min); `p:plateau` plateau 6.1% (longest 36.83 min); `t:vinohrady` place 12.2% (longest 99.83 min); `t:pratzen` place 16.1% (longest 96.26 min); `t:pratzeberg` place 17.2% (longest 150 min); `t:telnitz` place 21.7% (longest 90 min); `o:Drouet forms line` overlay 25.5% (longest 20 min); `t:augezd` place 27.5% (longest 53.17 min); `o:Stare Vinohrady` objective 30.3% (longest 3.5 min); `o:Russian Imperial Guard` overlay 33.9% (longest 11.83 min); `t:goldbach` place 42.4% (longest 58.17 min); `t:austerlitz` place 44.0% (longest 48.17 min); `o:Over the Satschan mere` overlay 49.0% (longest 1.5 min); `o:French on the plateau` overlay 58.8% (longest 6.5 min); `o:Bessières and Rapp` overlay 60.6% (longest 5 min); `o:Buxhowden's columns, now cut off` overlay 63.4% (longest 6.83 min); `o:Vandamme wheels south` overlay 66.6% (longest 3.33 min); `t:santon` place 70.6% (longest 24.17 min); `o:Vandamme takes the height` overlay 78.4% (longest 1.5 min); `o:Legrand and Friant` overlay 78.4% (longest 1.5 min); `o:The Augezd defile` objective 78.4% (longest 3.33 min); `o:Davout resumes the offensive` overlay 80.7% (longest 3.33 min); `o:Przybyszewski's breakout` overlay 82.0% (longest 3.33 min); ...

## hybrid-4x-day: every formation (play frames, 04:01-18:00)

Strip: one character per 15 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 1328 | 209 | 15.7% | 10.1%, 9467 | 13000; 84.16; 08:25 | 19 | 43.7% | d # # | `-..........xxxx-+-xxxxx+--x--x--x-x-x-x++-...........xx#` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 1322 | 265 | 20.0% | 26.2%, 10200 | 11000; 119.51; 11:20 | 14 | 28.9% | # d d | `#..........xxxx-xx-xx++-x-----xxxxxxx+#+--...........xx-` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 1633 | 531 | 32.5% | 34.8%, 14367 | 12467; 119.79; 11:00 | 21 | 38.0% | d # # | `x..........-xxxx+---+--xx---xxxxxxx-x+#+###+-+--#+##-+##` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 1310 | 471 | 36.0% | 39.6%, 2367 | 3667; 29.84; 08:45 | 27 | 52.4% | d # # | `x..........-x-x-x+-x-+-x#-++-x-+x-#+##---x............x-` |
| walther (Walther's Dragoons) | div cav fr | 3.200 | 1273 | 459 | 36.1% | 47.1%, 9100 | 7333; 45; 09:00 | 23 | 56.0% | # # # | `#..........-xxx-x+--xx-xx----+-##-x-###+...............-` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 1282 | 558 | 43.5% | 55.8%, 3633 | 9667; 100.07; 09:15 | 15 | 28.2% | d d d | `-..........+#####+xx-xxxxxx--x++++#####-..............xx` |
| milo (Miloradovich's Russians) | div inf ru | 3.200 | 1418 | 647 | 45.6% | 52.1%, 5600 | 3333; 30; 10:30 | 24 | 44.0% | d d d | `x..........-xx+-x+-+---+--x-+##-x-x+#####--+........xx+-` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 1349 | 642 | 47.6% | 44.8%, 14900 | 7333; 59.25; 11:39 | 17 | 34.4% | # # d | `#..........+####x+-+##-xx++xxx-xxx--x+#+--...........x##` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 1633 | 905 | 55.4% | 63.3%, 7767 | 4000; 28.1; 11:33 | 25 | 58.4% | d # # | `-..........+x--+#-+--##x+-+--#----x-##---###############` |
| c_v (V Corps) | corps inf fr | 3.099 | 167 | 95 | 56.9% | 100.0%, 0 | 667; 3.01; 04:15 | 4 | 86.1% | . . . | `-+#x-##+x###............................................` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 1392 | 873 | 62.7% | 86.4%, 2733 | 2500; 32; 15:00 | 25 | 70.9% | o # # | `...............-+-+++#+##+++-.-####+--x-x-x-xx+-#+######` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 1633 | 1057 | 64.7% | 98.4%, 300 | 667; 1.23; 07:00 | 32 | 58.2% | # # # | `-..........-####x#++++-x#-#+-x+++-#-x+-++-x###--########` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 1501 | 973 | 64.8% | 89.9%, 967 | 2000; 24.46; 11:15 | 27 | 65.0% | # # # | `#..........-####x++++++x#+-+-x++-+x-x+#####-.....-###+x#` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 1170 | 785 | 67.1% | 100.0%, 0 | 667; 26.67; 07:11 | 23 | 77.9% | # p p | `#..........++x+#x+-+++++x+.-+#+#++#+###x................` |
| c_cav (Cavalry Reserve) | corps cav fr | 3.099 | 167 | 115 | 68.9% | 100.0%, 0 | 667; 26.67; 05:51 | 3 | 86.5% | . . . | `+####-+-x###............................................` |
| friant (Friant's Division) | div inf fr | 3.200 | 1402 | 971 | 69.3% | 100.0%, 0 | 667; 0; 08:45 | 27 | 95.4% | o # # | `...............xx+-+++#####+-.-##-#+###+#+x-#-x######x##` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 1633 | 1137 | 69.6% | 96.3%, 733 | 667; 8.1; 08:18 | 29 | 82.1% | # # # | `-..........+#####++--+-####-+x++#+###-x+-+#-+x#--##-+-x#` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 1440 | 1037 | 72.0% | 92.2%, 1633 | 2200; 81.93; 04:15 | 22 | 32.0% | # # # | `+xxxxx+#+x#+###-##++##+##+#++#++-+##x+#+.............xx#` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 1800 | 1301 | 72.3% | 91.7%, 2167 | 667; 0; 04:15 | 28 | 64.3% | # # # | `+--#--##-x#######+-#+++##--+-x#+####+x#--+-+##--++######` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 1633 | 1231 | 75.4% | 100.0%, 0 | 667; 22.44; 07:01 | 24 | 94.8% | # # # | `+..........+x-x+-+-++-###########+#-+x#+##x+x+######+x--` |
| lang (Second Column) | div inf ru | 3.199 | 1633 | 1253 | 76.7% | 100.0%, 0 | 667; 14.67; 10:16 | 24 | 77.9% | # # # | `-..........+###+-#++#++##+##-++##+#+-+##-+x+############` |
| constantine (Russian Imperial Guard) | corps guard ru | 3.099 | 167 | 129 | 77.2% | 95.2%, 267 | 667; 25.66; 04:18 | 2 | 73.7% | . . . | `+--#########............................................` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 1558 | 1234 | 79.2% | 99.5%, 133 | 667; 0.54; 08:24 | 19 | 61.7% | # # # | `#..........+#####++-++++x+#+-####+##x-x####+.....+######` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 1249 | 1007 | 80.6% | 100.0%, 0 | 667; 10.33; 07:00 | 14 | 60.3% | # # # | `-..........--##+#-##########-#++-+#####+..............x-` |
| c_iv (IV Corps) | corps inf fr | 3.098 | 167 | 135 | 80.8% | 100.0%, 0 | 600; 0; 04:15 | 2 | 100.0% | . . . | `+#####-+####............................................` |
| col4 (Fourth Column) | corps inf at | 3.099 | 167 | 135 | 80.8% | 100.0%, 0 | 600; 0; 04:15 | 2 | 56.3% | . . . | `-+##########............................................` |
| dok (First Column) | div inf ru | 3.199 | 1608 | 1304 | 81.1% | 100.0%, 0 | 667; 0; 11:15 | 21 | 88.8% | # # # | `+..........+#-++#++#########-x+##+#+#####+-++x###+######` |
| c_iii (III Corps (detachment)) | corps inf fr | 3.100 | 60 | 49 | 81.7% | 100.0%, 0 | 367; 3.01; 04:15 | 1 | 100.0% | . . . | `x+####..................................................` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 1623 | 1338 | 82.4% | 95.5%, 767 | 800; 6.69; 08:39 | 18 | 88.4% | # # # | `#..........+#-+##+++#######+-x+#++#++x###+#+###########x` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 1558 | 1297 | 83.2% | 100.0%, 0 | 667; 7.99; 09:08 | 17 | 77.8% | # # # | `+##--####+-+###+##+#+++#######+##+-+#####+x..........x#-` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 1402 | 1169 | 83.4% | 98.8%, 433 | 667; 1.01; 08:59 | 15 | 38.2% | # # # | `-..........+#######++++#####-#++#+##########.........x#x` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 1274 | 1077 | 84.5% | 100.0%, 0 | 667; 0; 04:15 | 12 | 80.7% | # p p | `+--###################+##-.++x###+x+#-..................` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 1800 | 1592 | 88.4% | 100.0%, 0 | 667; 0.71; 14:30 | 13 | 53.4% | # # # | `+--#############++###++#########++--+x-+#+##############` |
| c_i (I Corps) | corps inf fr | 3.099 | 167 | 149 | 89.2% | 100.0%, 0 | 600; 0; 04:15 | 1 | 100.0% | . . . | `+###########............................................` |
| c_gd (Imperial Guard) | corps guard fr | 3.099 | 167 | 149 | 89.2% | 100.0%, 0 | 600; 0; 04:15 | 1 | 100.0% | . . . | `+###########............................................` |
| buxhowden (Left Wing Command) | corps hq ru | 3.096 | 167 | 149 | 89.2% | 100.0%, 0 | 600; 0; 04:15 | 1 | 100.0% | . . . | `+###########............................................` |
| prz (Third Column) | div inf ru | 3.199 | 1588 | 1538 | 96.9% | 98.9%, 333 | 667; 1.23; 07:00 | 3 | 44.0% | # . . | `-..........-########################################....` |

Other items not always drawn while in view (60 of 88 in view): `t:vinohrady` place 0.0% (longest 660 min); `t:litava` place 10.3% (longest 270 min); `t:augezd` place 11.0% (longest 263 min); `t:pratzen` place 14.6% (longest 285.33 min); `t:pratzeberg` place 15.5% (longest 599.67 min); `t:sokolnitz` place 16.1% (longest 183.12 min); `t:zuran` place 19.0% (longest 315 min); `t:telnitz` place 20.4% (longest 240 min); `t:satschan` place 20.9% (longest 332 min); `t:goldbach` place 22.2% (longest 375.33 min); `t:austerlitz` place 27.6% (longest 117.96 min); `o:Nansouty's cuirassiers` overlay 29.1% (longest 0 min); `o:Liechtenstein and Uvarov` overlay 30.4% (longest 0 min); `o:Drouet forms line` overlay 32.6% (longest 41.92 min); `o:V Column counter-marches north` overlay 34.8% (longest 42 min); `p:plateau` plateau 38.8% (longest 89 min); `t:santon` place 40.2% (longest 90 min); `o:Russian Imperial Guard` overlay 42.3% (longest 28.1 min); `o:French line on the Goldbach` overlay 43.2% (longest 40 min); `o:Kienmayer` overlay 44.8% (longest 22 min); `o:Allied columns on the plateau` overlay 44.9% (longest 0 min); `o:Suchet` overlay 46.5% (longest 0 min); `o:French hold the crest` overlay 48.4% (longest 2.6 min); `o:Stare Vinohrady` objective 49.7% (longest 8.89 min); `o:Blasowitz` objective 51.4% (longest 12 min); ...

## land-0900: every formation (play frames, 09:00-12:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rg_cav (Guard Cavalry) | div cav ru | 7.200 | 1508 | 1090 | 72.3% | 99.3%, 133 | 1667; 8.33; 11:46 | 20 | 91.9% | # # # | `#-+#+###+########-++#--++---##-+#--#` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 7.200 | 1508 | 1136 | 75.3% | 100.0%, 0 | 667; 3.33; 09:23 | 20 | 100.0% | # # # | `####++-+++++####--++-##++#++-###-###` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 7.199 | 1508 | 1237 | 82.0% | 100.0%, 0 | 667; 3.33; 09:05 | 16 | 100.0% | # # # | `#-+#++--+#######-#####-+#-+-++######` |
| rg_inf (Guard Infantry) | div guard ru | 7.200 | 1508 | 1247 | 82.7% | 100.0%, 0 | 667; 0; 09:15 | 15 | 100.0% | # # # | `##+###--++#######+##+--#+#--#+######` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 7.199 | 1508 | 1269 | 84.2% | 100.0%, 0 | 667; 3.33; 09:10 | 14 | 96.2% | # # # | `##+###-#+###+##-#++##-###-+-++######` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 7.200 | 1508 | 1303 | 86.4% | 100.0%, 0 | 667; 3.33; 09:03 | 12 | 100.0% | # # # | `+-+##+##+################+-####++###` |
| guard_inf (Guard Infantry) | div guard fr | 7.200 | 1508 | 1303 | 86.4% | 100.0%, 0 | 667; 3.33; 09:33 | 11 | 99.0% | # # # | `-+####++####+######-#####-+-++#+####` |
| walther (Walther's Dragoons) | div cav fr | 7.200 | 1508 | 1307 | 86.7% | 100.0%, 0 | 667; 2.93; 09:30 | 11 | 100.0% | # # # | `######-#+#########-++-++###--##+####` |
| vandamme (Vandamme's Division) | div inf fr | 7.199 | 1508 | 1326 | 87.9% | 100.0%, 0 | 667; 1.83; 09:13 | 11 | 100.0% | # # # | `--+################+###+##-##-#####+` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 7.200 | 1508 | 1326 | 87.9% | 99.5%, 233 | 667; 0; 09:15 | 10 | 100.0% | # # # | `##+#++##+##-##+--#####-+############` |
| caffarelli (Caffarelli's Division) | div inf fr | 7.199 | 1508 | 1328 | 88.1% | 100.0%, 0 | 667; 0; 09:30 | 11 | 100.0% | # # # | `#+###+++++-###+##+#######-+########+` |
| guard_cav (Guard Cavalry) | div cav fr | 7.200 | 1508 | 1333 | 88.4% | 99.7%, 167 | 667; 3.33; 09:06 | 9 | 100.0% | # # # | `--++++#-##################+#-#######` |
| lich (Fifth Column (cavalry)) | corps cav ru | 7.099 | 1508 | 1343 | 89.1% | 100.0%, 0 | 667; 1.5; 09:30 | 9 | 100.0% | # # # | `##+###-++########+####-###+########+` |
| rivaud (Rivaud's Division) | div inf fr | 7.199 | 1508 | 1369 | 90.8% | 100.0%, 0 | 667; 1.83; 09:43 | 8 | 100.0% | # # # | `-#+#++##+#################+#-#-###-#` |
| kollo (Kollowrat's Austrians) | div inf at | 7.199 | 1508 | 1376 | 91.2% | 100.0%, 0 | 667; 1.5; 09:30 | 7 | 100.0% | # # # | `######+#+#################-+#+#+####` |
| milo (Miloradovich's Russians) | div inf ru | 7.200 | 1508 | 1378 | 91.4% | 100.0%, 0 | 667; 0; 09:45 | 7 | 100.0% | # # # | `##+#####+#######-##-###+###-######-#` |
| bourcier (Bourcier's Dragoons) | div cav fr | 7.200 | 1291 | 1195 | 92.6% | 100.0%, 0 | 667; 3.33; 09:10 | 6 | 100.0% | # # # | `##+###################+#+--....+####` |
| bag (Advance Guard of the Right) | corps inf ru | 7.099 | 1340 | 1246 | 93.0% | 100.0%, 0 | 667; 3.1; 09:41 | 7 | 100.0% | # # # | `########+######+-+....-######+######` |
| friant (Friant's Division) | div inf fr | 7.200 | 1361 | 1272 | 93.5% | 100.0%, 0 | 667; 3.1; 11:36 | 6 | 100.0% | # # # | `--##++#####################...-+####` |
| suchet (Suchet's Division) | div inf fr | 7.199 | 1508 | 1417 | 94.0% | 100.0%, 0 | 667; 3.33; 09:10 | 5 | 100.0% | # # # | `##+##++####################-#-######` |
| c_gren (Grenadier Division) | div inf fr | 7.199 | 1508 | 1429 | 94.8% | 100.0%, 0 | 667; 3.33; 09:31 | 4 | 100.0% | # # # | `#####+-####################+-#######` |
| legrand (Legrand's Division) | div inf fr | 7.199 | 1508 | 1440 | 95.5% | 100.0%, 0 | 667; 0; 09:30 | 4 | 100.0% | # # # | `#++##++#############################` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 7.199 | 1387 | 1328 | 95.7% | 100.0%, 0 | 667; 0; 11:15 | 4 | 100.0% | # # # | `#+########################+...-#####` |
| dok (First Column) | div inf ru | 7.199 | 1370 | 1352 | 98.7% | 100.0%, 0 | 600; 3; 11:33 | 1 | 100.0% | # # # | `###########################...x+####` |
| lang (Second Column) | div inf ru | 7.199 | 1508 | 1488 | 98.7% | 100.0%, 0 | 667; 0; 11:15 | 1 | 100.0% | # # # | `##########################+#########` |
| prz (Third Column) | div inf ru | 7.199 | 1508 | 1492 | 98.9% | 100.0%, 0 | 533; 2.67; 09:55 | 1 | 100.0% | # # # | `###########-########################` |

Other items not always drawn while in view (31 of 46 in view): `t:vinohrady` place 2.0% (longest 150 min); `t:pratzeberg` place 12.6% (longest 106.5 min); `t:litava` place 15.0% (longest 90 min); `t:pratzen` place 22.8% (longest 67.83 min); `t:austerlitz` place 23.9% (longest 45 min); `t:augezd` place 36.0% (longest 57.33 min); `t:satschan` place 38.6% (longest 45 min); `t:zuran` place 43.5% (longest 66.5 min); `t:santon` place 43.8% (longest 55.67 min); `t:telnitz` place 46.5% (longest 56.5 min); `t:sokolnitz` place 57.4% (longest 28 min); `t:goldbach` place 59.2% (longest 25.17 min); `o:Stare Vinohrady` objective 68.8% (longest 5.17 min); `o:Pratzeberg` objective 82.5% (longest 3.33 min); `o:Russian Imperial Guard` overlay 89.8% (longest 2.67 min); `o:The Santon holds` objective 91.4% (longest 2.67 min); `o:Blasowitz` objective 91.8% (longest 3.33 min); `o:Bessières and Rapp` overlay 91.8% (longest 1.5 min); `o:Kamensky turns about (disputed)` overlay 92.1% (longest 2.33 min); `o:Saint-Hilaire` overlay 92.3% (longest 3.17 min); `o:Liechtenstein and Uvarov` overlay 92.8% (longest 2.67 min); `o:Levasseur up the Goldbach` overlay 93.3% (longest 1.5 min); `o:French on the plateau` overlay 93.9% (longest 0 min); `o:Drouet forms line` overlay 94.1% (longest 0 min); `o:Jurczek's Austrians` overlay 94.2% (longest 2.67 min); ...

## land-4x-day: every formation (play frames, 04:01-18:00)

Strip: one character per 15 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| walther (Walther's Dragoons) | div cav fr | 7.200 | 1436 | 929 | 64.7% | 100.0%, 0 | 667; 0; 04:15 | 29 | 99.4% | # # # | `---#+x-x+--+-##++++-#+#x####-+-+++#-####...............-` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 7.200 | 1475 | 1035 | 70.2% | 99.7%, 100 | 667; 0; 08:00 | 26 | 98.2% | # # # | `#######+x--+###+#++-#++-x-+--+++++#####+##............x#` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 7.200 | 1492 | 1048 | 70.2% | 98.5%, 267 | 667; 0; 04:15 | 25 | 100.0% | # # # | `+x#+x-#--x#+#########++##--+-x-+#-#+###++#...........xx#` |
| milo (Miloradovich's Russians) | div inf ru | 7.200 | 1584 | 1115 | 70.4% | 99.8%, 100 | 2533; 101.33; 04:37 | 24 | 87.2% | # # # | `+#-xxxxxx-x+#-++#+-++++##-##+#++###+#+x#####........xx##` |
| rg_cav (Guard Cavalry) | div cav ru | 7.200 | 1487 | 1103 | 74.2% | 99.5%, 167 | 667; 0; 04:15 | 21 | 93.2% | # # # | `-+#x-#############+++++##++++x++#-++######...........xx-` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 7.199 | 1789 | 1371 | 76.6% | 99.9%, 33 | 667; 26.67; 05:11 | 25 | 99.8% | # # # | `++-#+x+####-+-x+#+-#########--+####+x+-+#-x-############` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 7.199 | 1800 | 1427 | 79.3% | 100.0%, 0 | 667; 0; 09:45 | 22 | 100.0% | # # # | `##################+++++#####-######-x-x++++-+x--+++x+###` |
| bourcier (Bourcier's Dragoons) | div cav fr | 7.200 | 1480 | 1194 | 80.7% | 100.0%, 0 | 667; 0; 08:45 | 18 | 100.0% | o # # | `x+####.........+##-+########+.+####--+-+###-x-x--#######` |
| rivaud (Rivaud's Division) | div inf fr | 7.199 | 1660 | 1355 | 81.6% | 100.0%, 0 | 667; 0; 04:15 | 17 | 100.0% | # # # | `+########--#######+++-+##-#++#++#+##########.....-######` |
| vandamme (Vandamme's Division) | div inf fr | 7.199 | 1800 | 1471 | 81.7% | 100.0%, 0 | 667; 26.67; 04:31 | 19 | 100.0% | # # # | `-+x-#####+-########+++#####-+x+##+#+#-x+++##############` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 7.200 | 1445 | 1200 | 83.0% | 100.0%, 0 | 667; 0; 04:15 | 14 | 99.2% | # # # | `-#########x+###+##+###+#######++-+#+####..............x-` |
| friant (Friant's Division) | div inf fr | 7.200 | 1526 | 1274 | 83.5% | 100.0%, 0 | 667; 0.71; 14:30 | 16 | 100.0% | o # # | `x+####.........+#++++-#######.+##+#+#####+#####+-+######` |
| guard_cav (Guard Cavalry) | div cav fr | 7.200 | 1800 | 1503 | 83.5% | 99.4%, 367 | 667; 3.01; 04:15 | 18 | 100.0% | # # # | `-+x---##+x########++#+++####--+##+#+####################` |
| caffarelli (Caffarelli's Division) | div inf fr | 7.199 | 1415 | 1188 | 84.0% | 100.0%, 0 | 667; 0; 04:15 | 13 | 100.0% | # # # | `-#x-#################++x--##+#+###-#####..............x-` |
| rg_inf (Guard Infantry) | div guard ru | 7.200 | 1511 | 1277 | 84.5% | 100.0%, 0 | 667; 0; 04:15 | 13 | 96.2% | # # # | `+--#################+##-x++++x+-##########...........x##` |
| legrand (Legrand's Division) | div inf fr | 7.199 | 1800 | 1543 | 85.7% | 100.0%, 0 | 667; 26.67; 04:58 | 16 | 100.0% | # # # | `###+x-#####+###--+#+#-+################+-+#######+######` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 7.199 | 1717 | 1474 | 85.8% | 100.0%, 0 | 667; 0; 04:15 | 15 | 100.0% | # # # | `+x######x#############++x+-+--++##x#########.....+######` |
| prz (Third Column) | div inf ru | 7.199 | 1754 | 1508 | 86.0% | 100.0%, 0 | 667; 0; 04:15 | 16 | 95.9% | # . . | `-+x-#-+#x#x++--+#########+#########+-+###+##########....` |
| lang (Second Column) | div inf ru | 7.199 | 1800 | 1560 | 86.7% | 100.0%, 0 | 667; 0; 04:15 | 14 | 100.0% | # # # | `-##x--+#x#########+#########+######+#####+#+#-x+-+######` |
| suchet (Suchet's Division) | div inf fr | 7.199 | 1330 | 1156 | 86.9% | 100.0%, 0 | 667; 0; 04:15 | 11 | 96.6% | # p p | `+--+x-###############++##-.+#x#####+####................` |
| dok (First Column) | div inf ru | 7.199 | 1771 | 1558 | 88.0% | 100.0%, 0 | 667; 0; 04:15 | 13 | 100.0% | # # # | `++-##########x-++++##########.+##+#######+-+x+#####-+###` |
| gqg (Imperial Headquarters) | army hq fr | 7.000 | 167 | 149 | 89.2% | 100.0%, 0 | 600; 0; 04:15 | 1 | 100.0% | . . . | `+###########............................................` |
| ahq (Allied Headquarters) | army hq ru | 7.000 | 167 | 149 | 89.2% | 100.0%, 0 | 600; 0; 04:15 | 1 | 100.0% | . . . | `+###########............................................` |
| buxhowden (Left Wing Command) | corps hq ru | 7.096 | 167 | 149 | 89.2% | 100.0%, 0 | 600; 0; 04:15 | 1 | 100.0% | . . . | `+###########............................................` |
| c_gren (Grenadier Division) | div inf fr | 7.199 | 1800 | 1610 | 89.4% | 100.0%, 0 | 667; 10.84; 08:50 | 11 | 100.0% | # # # | `#+-###############++#++#####-++##+#####+-+##############` |
| guard_inf (Guard Infantry) | div guard fr | 7.200 | 1800 | 1630 | 90.6% | 100.0%, 0 | 667; 15.33; 04:15 | 9 | 100.0% | # # # | `-x#x-#######################+#+##+x+####################` |
| kollo (Kollowrat's Austrians) | div inf at | 7.199 | 1567 | 1480 | 94.4% | 100.0%, 0 | 667; 0; 04:15 | 5 | 92.0% | # # # | `-x#############################+###########.........xx##` |
| bag (Advance Guard of the Right) | corps inf ru | 7.099 | 1270 | 1220 | 96.1% | 100.0%, 0 | 667; 0; 09:45 | 4 | 100.0% | # p p | `######################+#++.+##########..................` |
| lich (Fifth Column (cavalry)) | corps cav ru | 7.099 | 1438 | 1411 | 98.1% | 100.0%, 0 | 467; 0; 04:15 | 2 | 70.4% | # # # | `+#######################################.............xx#` |

Other items not always drawn while in view (57 of 88 in view): `t:vinohrady` place 10.1% (longest 300.33 min); `t:augezd` place 17.7% (longest 150 min); `t:pratzeberg` place 21.1% (longest 182.46 min); `t:austerlitz` place 22.9% (longest 122.04 min); `t:satschan` place 24.3% (longest 352.1 min); `t:telnitz` place 26.0% (longest 240 min); `t:litava` place 30.3% (longest 239.96 min); `t:pratzen` place 31.5% (longest 330 min); `t:santon` place 44.0% (longest 84.22 min); `t:sokolnitz` place 51.9% (longest 103.67 min); `o:Blasowitz` objective 53.4% (longest 0 min); `o:The Augezd defile` objective 56.8% (longest 21.19 min); `o:Stare Vinohrady` objective 57.1% (longest 4.16 min); `t:zuran` place 59.6% (longest 63.33 min); `t:goldbach` place 69.7% (longest 180 min); `o:The Santon holds` objective 70.0% (longest 3.91 min); `o:Przybyszewski's breakout` overlay 71.8% (longest 13.33 min); `o:Jurczek's Austrians` overlay 72.3% (longest 0 min); `o:Vandamme` overlay 74.4% (longest 7.99 min); `o:Allied columns on the plateau` overlay 76.8% (longest 13.64 min); `o:Davout resumes the offensive` overlay 77.2% (longest 15.46 min); `o:Buxhowden's columns, now cut off` overlay 78.6% (longest 15.46 min); `o:IV Column halted` overlay 78.9% (longest 0.02 min); `o:Pratzeberg` objective 79.6% (longest 2.04 min); `o:V Column counter-marches north` overlay 79.8% (longest 3.68 min); ...

## paper-0900: every formation (play frames, 09:00-12:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| c_gren (Grenadier Division) | div inf fr | 3.199 | 1508 | 1317 | 87.3% | 100.0%, 0 | 667; 3.33; 09:38 | 11 | 100.0% | # # # | `#######++#######++++##-#++#++--#####` |
| constantine (Russian Imperial Guard) | corps guard ru | 3.099 | 1508 | 1351 | 89.6% | 100.0%, 0 | 667; 3.33; 09:10 | 9 | 100.0% | # # # | `##+#++-###+#-###-+-####+############` |
| c_iv (IV Corps) | corps inf fr | 3.098 | 1508 | 1352 | 89.7% | 100.0%, 0 | 667; 1.5; 09:30 | 9 | 100.0% | # # # | `#-+-##+-#########+###--######-######` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 1508 | 1370 | 90.8% | 100.0%, 0 | 667; 3.33; 09:38 | 8 | 100.0% | # # # | `####++#++####++#######-###+##-####-#` |
| c_iii (III Corps (detachment)) | corps inf fr | 3.100 | 1508 | 1372 | 91.0% | 100.0%, 0 | 667; 1.83; 09:13 | 7 | 100.0% | # # # | `##+##########++##+####++##+#######-#` |
| c_gd (Imperial Guard) | corps guard fr | 3.099 | 1508 | 1377 | 91.3% | 100.0%, 0 | 667; 3.33; 10:55 | 8 | 100.0% | # # # | `#################++###+++++#########` |
| c_cav (Cavalry Reserve) | corps cav fr | 3.099 | 1508 | 1386 | 91.9% | 100.0%, 0 | 667; 3.33; 09:35 | 7 | 100.0% | # # # | `#######-+####+##-++#######+#########` |
| col4 (Fourth Column) | corps inf at | 3.099 | 1508 | 1402 | 93.0% | 100.0%, 0 | 667; 1.83; 09:13 | 6 | 100.0% | # # # | `##+#-++##################-+#########` |
| c_i (I Corps) | corps inf fr | 3.099 | 1508 | 1428 | 94.7% | 100.0%, 0 | 667; 3.33; 09:35 | 5 | 100.0% | # # # | `#######-##############-+#-+#########` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 1508 | 1436 | 95.2% | 100.0%, 0 | 533; 2.67; 09:07 | 5 | 100.0% | # # # | `#-###+###########+####-#######-#####` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 1508 | 1454 | 96.4% | 100.0%, 0 | 667; 3.33; 09:31 | 3 | 100.0% | # # # | `######-###################+#++######` |
| c_v (V Corps) | corps inf fr | 3.099 | 1508 | 1468 | 97.3% | 100.0%, 0 | 667; 1.83; 11:13 | 2 | 100.0% | # # # | `##########################+#########` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 1508 | 1468 | 97.3% | 100.0%, 0 | 533; 2.67; 11:07 | 3 | 100.0% | # # # | `#####+###########+#######-##########` |
| buxhowden (Left Wing Command) | corps hq ru | 3.096 | 1508 | 1488 | 98.7% | 100.0%, 0 | 667; 3.33; 09:10 | 1 | 100.0% | # # # | `##+#################################` |

Other items not always drawn while in view (32 of 46 in view): `t:vinohrady` place 0.0% (longest 180 min); `t:santon` place 0.0% (longest 180 min); `t:satschan` place 0.0% (longest 180 min); `t:pratzeberg` place 1.3% (longest 146.5 min); `t:pratzen` place 2.0% (longest 103.5 min); `t:goldbach` place 2.7% (longest 106.5 min); `t:litava` place 4.0% (longest 71.67 min); `t:zuran` place 4.6% (longest 150 min); `t:sokolnitz` place 4.8% (longest 90 min); `t:augezd` place 34.7% (longest 67.83 min); `t:austerlitz` place 43.0% (longest 39.83 min); `t:telnitz` place 45.1% (longest 73.17 min); `o:Liechtenstein and Uvarov` overlay 63.8% (longest 1.5 min); `o:Jurczek's Austrians` overlay 69.2% (longest 1.5 min); `o:Kamensky turns about (disputed)` overlay 74.6% (longest 3.33 min); `o:Nansouty's cuirassiers` overlay 76.4% (longest 3.33 min); `o:Vandamme` overlay 76.5% (longest 1.83 min); `o:Russian Imperial Guard` overlay 76.5% (longest 1.5 min); `o:Pratzeberg` objective 80.9% (longest 1.83 min); `o:The Santon holds` objective 82.1% (longest 3.33 min); `o:Stare Vinohrady` objective 82.4% (longest 3.33 min); `o:Blasowitz` objective 83.1% (longest 0.24 min); `o:French on the plateau` overlay 83.6% (longest 3.33 min); `o:Drouet forms line` overlay 83.6% (longest 3.1 min); `o:Saint-Hilaire` overlay 83.8% (longest 3.33 min); ...

## phone-0900: every formation (play frames, 09:00-12:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 1365 | 0 | 0.0% | 0.1%, 20433 | 25067; 90; 09:00 | 2 | 4.6% | d d d | `xxxxxxxxxxxxxxxxxx...xxxxxxxxxxxxxxx` |
| c_cav (Cavalry Reserve) | corps cav fr | 3.099 | 688 | 90 | 13.1% | 6.0%, 10833 | 7233; 24.67; 10:50 | 7 | 9.9% | d d d | `xxx...................xxxx---#--xxxx` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 776 | 120 | 15.5% | 26.4%, 5067 | 13733; 47.33; 11:12 | 7 | 20.3% | o d d | `.................+-x-+---x-xxxxxxxxx` |
| constantine (Russian Imperial Guard) | corps guard ru | 3.099 | 1508 | 322 | 21.4% | 20.7%, 15000 | 13667; 50.17; 10:10 | 10 | 13.2% | d d d | `xx++#+xx-xxx+#xxxxxxxxx--x--xx+-xxxx` |
| c_v (V Corps) | corps inf fr | 3.099 | 246 | 75 | 30.5% | 68.3%, 733 | 1667; 8.33; 11:23 | 7 | 21.6% | d o o | `x........................x--+x+-....` |
| c_gd (Imperial Guard) | corps guard fr | 3.099 | 765 | 254 | 33.2% | 29.9%, 11067 | 3667; 16.83; 11:23 | 12 | 16.4% | d d # | `x................x+#-+++xx--+xx-x+xx` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 52 | 19 | 36.5% | 17.3%, 1433 | 1100; 5.5; 09:03 | 1 | 0.0% | # o o | `+x..................................` |
| c_i (I Corps) | corps inf fr | 3.099 | 1253 | 739 | 59.0% | 81.1%, 1833 | 4600; 14.39; 09:15 | 18 | 40.1% | d # # | `-#-xxx....-###+##+##---+xx-####-+-##` |
| col4 (Fourth Column) | corps inf at | 3.099 | 1508 | 953 | 63.2% | 68.5%, 4467 | 5333; 16.67; 09:10 | 14 | 12.8% | # d d | `##xxx+##+############++-+#-xxxx+#--+` |
| c_iii (III Corps (detachment)) | corps inf fr | 3.100 | 738 | 562 | 76.2% | 82.9%, 4033 | 4433; 12.17; 09:12 | 4 | 35.2% | # o o | `+#-x-+###########+..................` |
| buxhowden (Left Wing Command) | corps hq ru | 3.096 | 1238 | 951 | 76.8% | 91.3%, 3567 | 1833; 1.01; 10:59 | 13 | 25.8% | # # # | `#####+######++###+#-----xx.....-++##` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 482 | 382 | 79.3% | 100.0%, 0 | 633; 0; 11:00 | 6 | 47.0% | o o o | `..................x+###+#-+#+##.....` |
| c_iv (IV Corps) | corps inf fr | 3.098 | 1508 | 1201 | 79.6% | 96.9%, 700 | 867; 4.33; 09:22 | 18 | 67.8% | # # # | `+#+#-+#######-#--+#-##+++#-#########` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 1508 | 1378 | 91.4% | 99.0%, 333 | 1200; 6; 11:07 | 7 | 45.4% | # # # | `+-###+#-############-#-##-+#########` |

Other items not always drawn while in view (30 of 43 in view): `t:vinohrady` place 0.0% (longest 180 min); `t:pratzeberg` place 0.0% (longest 180 min); `t:santon` place 0.0% (longest 9.83 min); `t:austerlitz` place 0.0% (longest 90 min); `t:satschan` place 1.9% (longest 34.17 min); `t:goldbach` place 2.7% (longest 90 min); `t:litava` place 4.4% (longest 90 min); `t:telnitz` place 8.4% (longest 56.17 min); `t:zuran` place 8.6% (longest 32.83 min); `t:pratzen` place 9.7% (longest 51 min); `t:sokolnitz` place 10.8% (longest 33.17 min); `p:plateau` plateau 13.5% (longest 53.17 min); `o:Russian Imperial Guard` overlay 35.3% (longest 6.5 min); `o:Stare Vinohrady` objective 35.6% (longest 6.5 min); `o:The Santon holds` objective 35.9% (longest 3.33 min); `o:Nansouty's cuirassiers` overlay 36.5% (longest 8.17 min); `o:Drouet forms line` overlay 43.7% (longest 6.5 min); `o:Liechtenstein and Uvarov` overlay 44.1% (longest 5.17 min); `o:French on the plateau` overlay 52.4% (longest 5 min); `o:Bessières and Rapp` overlay 52.9% (longest 5.83 min); `t:augezd` place 57.1% (longest 16 min); `o:Kamensky turns about (disputed)` overlay 67.9% (longest 0 min); `o:Jurczek's Austrians` overlay 70.4% (longest 4.83 min); `o:Blasowitz` objective 75.9% (longest 0 min); `o:Saint-Hilaire` overlay 76.5% (longest 3.17 min); ...

## phone-land-0900: every formation (play frames, 09:00-12:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| bag (Advance Guard of the Right) | corps inf ru | 7.099 | 51 | 23 | 45.1% | 100.0%, 0 | 667; 3.33; 09:03 | 2 | 100.0% | # o o | `+-..................................` |
| lich (Fifth Column (cavalry)) | corps cav ru | 7.099 | 1361 | 958 | 70.4% | 95.1%, 1100 | 2333; 10.17; 09:35 | 20 | 85.9% | # # # | `##-+-++x+########+...x++##+-#-++#++#` |
| gqg (Imperial Headquarters) | army hq fr | 7.000 | 480 | 355 | 74.0% | 100.0%, 0 | 667; 1.83; 10:58 | 7 | 94.4% | o o o | `..................x+###+##++--#.....` |
| buxhowden (Left Wing Command) | corps hq ru | 7.096 | 1237 | 1014 | 82.0% | 100.0%, 0 | 667; 3.33; 09:01 | 13 | 100.0% | # # # | `--+##+###########++##-+++-.....+++##` |
| ahq (Allied Headquarters) | army hq ru | 7.000 | 1508 | 1339 | 88.8% | 100.0%, 0 | 667; 3.33; 09:08 | 10 | 100.0% | # # # | `#++--+############++##-+#-+#########` |

Other items not always drawn while in view (30 of 43 in view): `t:pratzeberg` place 0.0% (longest 180 min); `t:santon` place 0.0% (longest 9.83 min); `t:zuran` place 0.0% (longest 57.5 min); `t:satschan` place 0.0% (longest 39.83 min); `t:austerlitz` place 0.0% (longest 90 min); `t:vinohrady` place 1.8% (longest 114 min); `t:telnitz` place 7.2% (longest 56.17 min); `t:pratzen` place 17.1% (longest 52.83 min); `t:litava` place 22.4% (longest 50.17 min); `t:goldbach` place 24.0% (longest 73.17 min); `t:augezd` place 27.9% (longest 15.4 min); `t:sokolnitz` place 30.9% (longest 30 min); `o:Nansouty's cuirassiers` overlay 63.5% (longest 3.33 min); `o:Blasowitz` objective 66.2% (longest 3.33 min); `o:French on the plateau` overlay 68.8% (longest 2.93 min); `o:Stare Vinohrady` objective 70.8% (longest 3.1 min); `o:Bessières and Rapp` overlay 71.4% (longest 0.24 min); `p:plateau` plateau 74.2% (longest 7.83 min); `o:Saint-Hilaire` overlay 76.5% (longest 3.17 min); `o:Vandamme` overlay 79.8% (longest 3 min); `o:Pratzeberg` objective 80.2% (longest 3.33 min); `o:Drouet forms line` overlay 80.6% (longest 1.83 min); `o:Jurczek's Austrians` overlay 80.8% (longest 3.33 min); `o:The Santon holds` objective 87.2% (longest 1.67 min); `o:French hold the crest` overlay 87.5% (longest 1.5 min); ...

## hybrid-fr-0900: every formation (play frames, 09:00-12:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| milo (Miloradovich's Russians) | div inf ru | 3.200 | 479 | 0 | 0.0% | 31.1%, 5733 | 15967; 49.83; 09:00 | 1 | 12.7% | d . . | `xxxxxxxxxx..........................` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 1508 | 122 | 8.1% | 9.7%, 17833 | 12667; 46.83; 09:43 | 9 | 27.7% | d d d | `xxxx--xx-xxxxxxxx-xxx-x--xx--#+xxxxx` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 1508 | 349 | 23.1% | 51.2%, 11300 | 13000; 53.17; 09:30 | 11 | 13.8% | # d # | `+xxx-#xxxxxxxxxx-----#-+##-+xxxxxxxx` |
| walther (Walther's Dragoons) | div cav fr | 3.200 | 1508 | 403 | 26.7% | 36.4%, 23800 | 13533; 47.67; 09:25 | 17 | 42.3% | d d # | `xx----xxxxxxxx-xx---#-#+##----#+xxxx` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 1508 | 430 | 28.5% | 30.0%, 15200 | 13267; 48.17; 09:30 | 14 | 22.9% | # d d | `-x----xxxxxxxxx--#####+-x--xxx+-xxxx` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 1508 | 650 | 43.1% | 23.5%, 13033 | 11333; 36.67; 09:03 | 8 | 13.3% | # d d | `+xxxxxx--xx-####+#########xxxxx-#---` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 1508 | 664 | 44.0% | 61.5%, 9433 | 10333; 34.83; 09:30 | 22 | 33.2% | # d d | `+####-xxxxxx-#--++--++-++-x+x-#+##xx` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 1508 | 772 | 51.2% | 45.4%, 9233 | 4667; 23.33; 10:00 | 18 | 43.6% | d # # | `x--++-##+-++xxxx---+--#+##--##x+####` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 1508 | 1058 | 70.2% | 96.8%, 1567 | 2333; 9.83; 09:30 | 20 | 44.4% | # # # | `#++---x-###-##-#-++##-#+--++--#+####` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 1508 | 1092 | 72.4% | 98.7%, 667 | 3667; 8.57; 11:39 | 16 | 37.0% | # d # | `##+#-++###########+-#-##+#++##--x--x` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 1508 | 1164 | 77.2% | 99.7%, 167 | 667; 3.33; 09:03 | 19 | 83.1% | # # # | `+++-#-##+#+###-#+++####+##++-+#+####` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 1508 | 1173 | 77.8% | 83.3%, 3700 | 4200; 13.17; 11:40 | 5 | 22.4% | # # # | `#--x-#####################-####-xx-+` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 1295 | 1089 | 84.1% | 100.0%, 0 | 667; 3.33; 09:03 | 12 | 100.0% | # # # | `+-++-+###########+####-++--....+####` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 1508 | 1295 | 85.9% | 100.0%, 0 | 667; 0; 09:15 | 13 | 58.7% | # # # | `#+-+-###+#-##+++#+########+###++####` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 1508 | 1298 | 86.1% | 100.0%, 0 | 667; 3.1; 09:41 | 14 | 29.0% | # # # | `+###-+#-+########+####-++-+-######-#` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 1508 | 1308 | 86.7% | 100.0%, 0 | 667; 0; 09:15 | 11 | 63.0% | # # # | `#--#-+##+#################+#-##+####` |
| friant (Friant's Division) | div inf fr | 3.200 | 1364 | 1221 | 89.5% | 100.0%, 0 | 667; 3.33; 09:25 | 9 | 100.0% | # # # | `-+#-#+#-#################+-...-#####` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 1343 | 1204 | 89.7% | 100.0%, 0 | 633; 3.17; 09:00 | 9 | 74.8% | # # # | `-##############+-+....-+###-++######` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 1508 | 1357 | 90.0% | 100.0%, 0 | 667; 3.33; 09:25 | 8 | 74.8% | # # # | `#####+#################+#-+-##++#-##` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 827 | 755 | 91.3% | 100.0%, 0 | 633; 3.17; 09:16 | 4 | 75.0% | # . . | `#-#--#####-#########................` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 1508 | 1416 | 93.9% | 100.0%, 0 | 667; 3.1; 09:11 | 6 | 100.0% | # # # | `-++##+###################+##########` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 1508 | 1422 | 94.3% | 97.8%, 733 | 667; 3.33; 09:03 | 5 | 100.0% | # # # | `++++#######-###++###################` |
| prz (Third Column) | div inf ru | 3.199 | 1508 | 1436 | 95.2% | 100.0%, 0 | 667; 3.33; 09:01 | 5 | 100.0% | # # # | `--++#+##############################` |
| dok (First Column) | div inf ru | 3.199 | 467 | 449 | 96.1% | 100.0%, 0 | 600; 3; 09:10 | 1 | 100.0% | # . . | `##+#######..........................` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 521 | 504 | 96.7% | 100.0%, 0 | 567; 2.83; 09:10 | 1 | 100.0% | # . . | `##+#########........................` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 1508 | 1485 | 98.5% | 100.0%, 0 | 400; 0; 09:30 | 2 | 4.3% | # # # | `#####+##+###########################` |

Other items not always drawn while in view (33 of 46 in view): `t:vinohrady` place 0.0% (longest 180 min); `t:pratzeberg` place 6.2% (longest 76.5 min); `t:austerlitz` place 9.3% (longest 49.83 min); `t:litava` place 13.4% (longest 89.6 min); `t:santon` place 13.8% (longest 58.33 min); `t:pratzen` place 17.4% (longest 49.83 min); `o:Russian Imperial Guard` overlay 21.5% (longest 19.33 min); `t:zuran` place 28.5% (longest 75 min); `p:plateau` plateau 31.2% (longest 43.5 min); `o:Drouet forms line` overlay 35.5% (longest 15.23 min); `t:goldbach` place 41.7% (longest 79.83 min); `t:telnitz` place 48.6% (longest 41.9 min); `t:augezd` place 52.9% (longest 36.67 min); `o:Liechtenstein and Uvarov` overlay 53.8% (longest 0.24 min); `t:sokolnitz` place 63.2% (longest 30 min); `o:French hold the crest` overlay 66.0% (longest 3.33 min); `o:Stare Vinohrady` objective 66.9% (longest 0.64 min); `o:Blasowitz` objective 67.4% (longest 0.24 min); `t:satschan` place 68.4% (longest 36.5 min); `o:French on the plateau` overlay 68.5% (longest 8.33 min); `o:Vandamme` overlay 70.0% (longest 0 min); `o:Nansouty's cuirassiers` overlay 71.3% (longest 3.33 min); `o:Saint-Hilaire` overlay 71.7% (longest 3.33 min); `o:Bagration` overlay 71.9% (longest 0 min); `o:Bessières and Rapp` overlay 73.4% (longest 3.33 min); ...

## hybrid-al-0900: every formation (play frames, 09:00-12:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 391 | 10 | 2.6% | 0.3%, 13000 | 12067; 41.5; 11:15 | 2 | 2.6% | . d d | `..........................xxxxxxxxx-` |
| milo (Miloradovich's Russians) | div inf ru | 3.200 | 1508 | 440 | 29.2% | 59.7%, 7133 | 24633; 90; 09:00 | 9 | 7.3% | d d d | `xxxxxxxxxxxxxxxxx-#-#--###--###-x--x` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 1508 | 454 | 30.1% | 28.4%, 11033 | 9967; 38.5; 11:21 | 10 | 19.3% | # d d | `+xxx--xx-xx-#####-x-###----#-xxxxxxx` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 38 | 20 | 52.6% | 100.0%, 0 | 333; 1.67; 09:40 | 2 | 100.0% | . . . | `.......x+...........................` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 1508 | 823 | 54.6% | 45.4%, 10233 | 12000; 40.23; 11:14 | 11 | 21.0% | # d d | `#--x-+-#########+####-++++-xxxxxxx-+` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 36 | 20 | 55.6% | 100.0%, 0 | 533; 2.67; 09:34 | 1 | 100.0% | . . . | `......x+............................` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 1508 | 1061 | 70.4% | 96.8%, 1567 | 2733; 8.83; 09:21 | 19 | 41.6% | # d # | `#++#----###-##-#-++##-#--#+####+###+` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 1508 | 1149 | 76.2% | 100.0%, 0 | 667; 0; 09:15 | 21 | 70.5% | # # # | `#+--++##+#-##+++#+#####+-+--###+####` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 1295 | 1029 | 79.5% | 99.7%, 133 | 667; 3.33; 09:08 | 15 | 100.0% | # # # | `-++#-++##########+-#+-++#--....+####` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 332 | 265 | 79.8% | 100.0%, 0 | 667; 3.1; 11:36 | 4 | 100.0% | . # # | `.................+##..........-+###+` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 1508 | 1205 | 79.9% | 100.0%, 0 | 3000; 13.5; 11:26 | 12 | 76.6% | # # # | `###--++-+#################++--x+###+` |
| friant (Friant's Division) | div inf fr | 3.200 | 1364 | 1132 | 83.0% | 100.0%, 0 | 667; 0.4; 09:29 | 15 | 100.0% | # # # | `--++-+###############-#+#+-...-##+#-` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 391 | 329 | 84.1% | 95.9%, 333 | 667; 1.5; 11:15 | 4 | 61.3% | . # # | `..........................-+##+#####` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 1392 | 1173 | 84.3% | 99.9%, 33 | 1233; 6.17; 11:32 | 13 | 87.2% | # # # | `--###+###########+++#+#+##-...x+##++` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 1508 | 1274 | 84.5% | 100.0%, 0 | 667; 3.1; 09:41 | 16 | 68.8% | # # # | `+###-+#-+########+####-++-+#-#++##-#` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 1508 | 1308 | 86.7% | 99.6%, 200 | 667; 1.83; 10:58 | 12 | 18.0% | # # # | `#####+####-###########-++-++##-+###+` |
| lang (Second Column) | div inf ru | 3.199 | 1508 | 1329 | 88.1% | 100.0%, 0 | 667; 0; 11:15 | 11 | 100.0% | # # # | `+#+##+##+####++###########+##--#-++#` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 1508 | 1344 | 89.1% | 98.5%, 733 | 667; 3.33; 09:18 | 9 | 89.6% | # # # | `+-+++######-#############-++###+####` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 1343 | 1204 | 89.7% | 100.0%, 0 | 633; 3.17; 09:00 | 9 | 96.4% | # # # | `-##############+-+....-+###-++######` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 521 | 498 | 95.6% | 100.0%, 0 | 400; 0; 09:30 | 2 | 56.5% | # . . | `#####+##+###........................` |
| dok (First Column) | div inf ru | 3.199 | 1374 | 1322 | 96.2% | 100.0%, 0 | 633; 0; 11:15 | 4 | 100.0% | # # # | `##+#######################+...-#####` |
| prz (Third Column) | div inf ru | 3.199 | 1508 | 1461 | 96.9% | 100.0%, 0 | 667; 3.33; 09:01 | 3 | 100.0% | # # # | `--###+##############################` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 1508 | 1491 | 98.9% | 100.0%, 0 | 567; 2.83; 09:10 | 1 | 41.2% | # # # | `##+#################################` |

Other items not always drawn while in view (33 of 46 in view): `t:vinohrady` place 0.0% (longest 180 min); `t:pratzeberg` place 9.8% (longest 76.5 min); `t:litava` place 12.1% (longest 71.83 min); `t:sokolnitz` place 13.2% (longest 60 min); `t:augezd` place 19.5% (longest 50 min); `t:austerlitz` place 23.2% (longest 49.83 min); `t:pratzen` place 28.8% (longest 56.83 min); `t:telnitz` place 29.9% (longest 48.33 min); `o:Russian Imperial Guard` overlay 31.2% (longest 9.83 min); `t:santon` place 35.6% (longest 51.5 min); `t:goldbach` place 36.5% (longest 65.17 min); `t:satschan` place 37.4% (longest 45.74 min); `o:Drouet forms line` overlay 44.0% (longest 9.6 min); `t:zuran` place 44.5% (longest 44.83 min); `p:plateau` plateau 49.6% (longest 45 min); `o:Liechtenstein and Uvarov` overlay 56.7% (longest 0.24 min); `o:French hold the crest` overlay 60.4% (longest 1.5 min); `o:Levasseur up the Goldbach` overlay 67.9% (longest 3.33 min); `o:Stare Vinohrady` objective 68.3% (longest 3.33 min); `o:Friant retakes Telnitz` overlay 69.6% (longest 3.33 min); `o:Vandamme` overlay 72.5% (longest 3.33 min); `o:Nansouty's cuirassiers` overlay 73.3% (longest 2.93 min); `o:Blasowitz` objective 76.4% (longest 1.5 min); `o:Bessières and Rapp` overlay 77.7% (longest 3.33 min); `o:Jurczek's Austrians` overlay 77.9% (longest 0 min); ...

## hybrid-fixed-0830: every formation (play frames, 08:30-11:30)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 1560 | 108 | 6.9% | 2.3%, 32333 | 21967; 69.83; 08:30 | 7 | 20.5% | d d d | `xxxxxxxxxxxxx--xxxxxxxxxx-+x--xx--x-` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 1560 | 261 | 16.7% | 22.1%, 17767 | 15700; 58.5; 10:31 | 6 | 6.3% | # d d | `###xxx--x---xxxxxxxxxxx+-xxxxxxxxxxx` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 1560 | 364 | 23.3% | 35.2%, 24167 | 18700; 63.5; 10:26 | 3 | 3.8% | # d d | `###xxxxx-xxxxxx-#######-xxxxxxxxxxxx` |
| milo (Miloradovich's Russians) | div inf ru | 3.200 | 1560 | 467 | 29.9% | 46.2%, 26167 | 12000; 40.23; 09:29 | 8 | 9.9% | d # # | `-+-+xxxxxx--xxxxxxx-#+xxxxx+-+###+#-` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 1560 | 518 | 33.2% | 5.9%, 18300 | 10000; 40; 09:41 | 15 | 27.1% | d d d | `xx-+++-++#x--#-xxxxxxx++x--xx-xx--##` |
| walther (Walther's Dragoons) | div cav fr | 3.200 | 1560 | 583 | 37.4% | 15.3%, 11567 | 6000; 26.83; 10:03 | 21 | 36.1% | d # # | `xx+#--x---##+-+++x-xxxx--x---+#+--x-` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 1560 | 720 | 46.2% | 85.0%, 2667 | 11333; 46.43; 09:43 | 14 | 9.8% | # d d | `#-###+--++++#--xxxxxxxx-+####-xxxxxx` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 1560 | 783 | 50.2% | 43.1%, 7633 | 8700; 30; 11:00 | 16 | 24.3% | d d d | `xxx-x+-##-##-######+++---+-++-xxxxxx` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 1560 | 958 | 61.4% | 78.2%, 6567 | 5800; 19; 11:11 | 20 | 39.2% | # d d | `##--++#+++######-#-##-++--+-++-+-xxx` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 1560 | 1041 | 66.7% | 61.8%, 9300 | 12333; 41.67; 10:38 | 9 | 30.6% | # d d | `#-+####-+###-##########+#+xxxxxxx-#+` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 1560 | 1228 | 78.7% | 85.8%, 3100 | 667; 3.1; 08:41 | 18 | 41.0% | # d # | `##+-#+##+#++#-++##+######++##++++-#+` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 1560 | 1264 | 81.0% | 100.0%, 0 | 667; 3.33; 08:40 | 17 | 45.6% | # # # | `##+++###+##+#-+#-##++#-++###-+#-++#-` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 1560 | 1268 | 81.3% | 86.3%, 2967 | 3000; 13.5; 09:01 | 14 | 44.5% | # d # | `#++-#--x+#++#########+######-+###+##` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 1560 | 1325 | 84.9% | 100.0%, 0 | 667; 1.83; 08:43 | 13 | 100.0% | # # # | `##+#-##++###-##++++#-#++########++##` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 1560 | 1341 | 86.0% | 100.0%, 0 | 1333; 6.67; 11:20 | 11 | 38.8% | # # # | `###+###++##+##+########+#-###+##++x+` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 1560 | 1388 | 89.0% | 100.0%, 0 | 1333; 0; 08:45 | 9 | 79.1% | # # # | `##+--+################-+#######-+###` |
| friant (Friant's Division) | div inf fr | 3.200 | 1560 | 1414 | 90.6% | 100.0%, 0 | 667; 3.33; 08:35 | 8 | 86.3% | # # # | `#-++##--+##+########################` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 1560 | 1421 | 91.1% | 98.9%, 333 | 867; 4.33; 08:52 | 8 | 31.7% | # # # | `--##-+######-#++#############+##+###` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 1560 | 1433 | 91.9% | 100.0%, 0 | 667; 3.1; 08:56 | 8 | 94.5% | # # # | `#-+#-+#++##+########################` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 1560 | 1462 | 93.7% | 100.0%, 0 | 667; 3.33; 09:05 | 6 | 89.8% | # # # | `#######-#####++#######++########+-++` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 1560 | 1479 | 94.8% | 95.8%, 1967 | 1000; 4.77; 08:55 | 4 | 60.5% | # # # | `#-+##+##############################` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 1560 | 1485 | 95.2% | 100.0%, 0 | 667; 3.33; 08:35 | 5 | 25.3% | # # # | `#-+####################+########+-##` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 1560 | 1509 | 96.7% | 100.0%, 0 | 667; 3.33; 08:40 | 3 | 19.6% | # # # | `-#+#################################` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 1560 | 1522 | 97.6% | 100.0%, 0 | 633; 3.17; 08:31 | 2 | 50.0% | # # # | `-#####-#############################` |
| dok (First Column) | div inf ru | 3.199 | 1560 | 1528 | 97.9% | 100.0%, 0 | 533; 2.67; 08:52 | 2 | 100.0% | # # # | `####-#####-#########################` |
| lang (Second Column) | div inf ru | 3.199 | 1560 | 1541 | 98.8% | 100.0%, 0 | 633; 3.17; 11:26 | 1 | 0.0% | # # # | `###################################-` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 1560 | 1548 | 99.2% | 100.0%, 0 | 400; 0; 08:45 | 1 | 100.0% | # # # | `##+#################################` |
| prz (Third Column) | div inf ru | 3.199 | 1560 | 1560 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `####################################` |

Other items not always drawn while in view (37 of 52 in view): `t:vinohrady` place 0.0% (longest 180 min); `t:pratzeberg` place 0.0% (longest 180 min); `t:goldbach` place 0.0% (longest 180 min); `t:austerlitz` place 3.8% (longest 153.33 min); `t:pratzen` place 8.2% (longest 64.83 min); `t:santon` place 14.1% (longest 45 min); `t:zuran` place 26.9% (longest 103.17 min); `p:plateau` plateau 36.9% (longest 35.17 min); `o:French on the plateau` overlay 42.7% (longest 0 min); `o:Bessières and Rapp` overlay 49.7% (longest 1.5 min); `t:litava` place 50.0% (longest 65 min); `o:Blasowitz` objective 53.1% (longest 6.67 min); `o:IV Column halted` overlay 58.8% (longest 3.33 min); `o:Legrand on the stream` overlay 60.8% (longest 3.33 min); `o:Vandamme` overlay 63.3% (longest 1.5 min); `t:telnitz` place 68.7% (longest 39.83 min); `o:Russian Imperial Guard` overlay 69.2% (longest 3.33 min); `o:Nansouty's cuirassiers` overlay 72.8% (longest 0 min); `o:Stare Vinohrady` objective 73.9% (longest 10.17 min); `o:Suchet` overlay 74.2% (longest 0.4 min); `o:Jurczek's Austrians` overlay 74.6% (longest 0 min); `o:French hold the crest` overlay 75.4% (longest 1.5 min); `o:Drouet forms line` overlay 77.6% (longest 1.5 min); `o:II Column → Sokolnitz` overlay 79.4% (longest 3.33 min); `o:Liechtenstein crosses the front` overlay 79.4% (longest 3.33 min); ...

## hybrid-watch-0830: every formation (play frames, 08:30-11:30)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 1560 | 165 | 10.6% | 4.2%, 16100 | 12667; 53.33; 09:31 | 14 | 34.9% | d d d | `x--xxx-#-xx--xxxxxxxxx--xxx---xx---x` |
| milo (Miloradovich's Russians) | div inf ru | 3.200 | 1560 | 243 | 15.6% | 45.2%, 9733 | 9333; 26.9; 09:14 | 15 | 16.6% | d # # | `-+--xxx--xxxxx-xxx-xx-x-xxx+x--x--##` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 1560 | 396 | 25.4% | 11.9%, 15900 | 17667; 54.83; 08:45 | 9 | 14.9% | # d d | `##+xxxxxxxxxx--x-#####-xxxx--+-+xxxx` |
| walther (Walther's Dragoons) | div cav fr | 3.200 | 1560 | 414 | 26.5% | 33.3%, 16800 | 7733; 24.83; 09:30 | 23 | 43.2% | d # # | `x---x+#x-xx-xxxx--#xxxx--+++-+-x-#--` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 1560 | 601 | 38.5% | 28.3%, 26933 | 5000; 15; 08:56 | 20 | 41.8% | d d d | `xx----xx+##-xx+#######-+------xx-xxx` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 1560 | 726 | 46.5% | 49.5%, 3933 | 12000; 38.17; 08:45 | 8 | 8.6% | # # # | `##+xxxxxxx-#+#-xxxxx-###x-xx-####++-` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 1560 | 757 | 48.5% | 35.9%, 4667 | 6300; 21.19; 09:30 | 20 | 39.6% | d d d | `x--#####+-#--xxx+#+##++---x---##---#` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 1560 | 888 | 56.9% | 70.3%, 5267 | 4333; 11.9; 08:59 | 22 | 54.8% | # d d | `##++--xx+##+-########-----+#-+---xxx` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 1560 | 1116 | 71.5% | 95.3%, 1567 | 2000; 5.17; 11:10 | 20 | 50.0% | # # # | `#++-++#++#-++#########++####+--#----` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 1560 | 1126 | 72.2% | 96.5%, 1067 | 4000; 10; 09:13 | 19 | 68.0% | # # # | `#++-++#--x-######--##+-#####+++-++##` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 1560 | 1146 | 73.5% | 95.2%, 1567 | 2000; 9.6; 09:30 | 21 | 44.0% | # # # | `#-+#-++++#+---###--+########-###++-#` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 1560 | 1152 | 73.8% | 46.3%, 8800 | 2667; 11.5; 10:30 | 11 | 31.6% | # d d | `#-+#########+#########+-xx+x-##-+x+x` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 1560 | 1230 | 78.8% | 99.4%, 333 | 667; 0.4; 08:44 | 19 | 37.0% | # # # | `--+-+###+#+#####-#-+#-###++-+++-+###` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 1560 | 1271 | 81.5% | 93.8%, 2133 | 667; 1.5; 08:45 | 18 | 54.7% | # # # | `#+#+-###++-###+########+##--++-+-###` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 1560 | 1282 | 82.2% | 100.0%, 0 | 667; 3.33; 08:38 | 16 | 91.7% | # # # | `#+--+##++##++########+#++-#####-#++#` |
| friant (Friant's Division) | div inf fr | 3.200 | 1560 | 1309 | 83.9% | 100.0%, 0 | 667; 3.33; 08:46 | 16 | 100.0% | # # # | `+---##++++-+############-##-#+##+###` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 1560 | 1311 | 84.0% | 97.9%, 667 | 667; 3.1; 08:41 | 13 | 69.9% | # # # | `##---+##################--#+++##+###` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 1560 | 1319 | 84.6% | 100.0%, 0 | 667; 3.33; 08:35 | 16 | 47.7% | # # # | `#-+#######++#-###+####-+####-++-+#-#` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 1469 | 1271 | 86.5% | 100.0%, 0 | 667; 3.33; 08:35 | 12 | 100.0% | # # # | `#-+-###-#####-##############-+##+..x` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 1560 | 1351 | 86.6% | 100.0%, 0 | 667; 1.5; 08:45 | 12 | 100.0% | # # # | `#-++-###+###-####-######+##--##-+###` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 1560 | 1400 | 89.7% | 100.0%, 0 | 667; 3.33; 08:35 | 9 | 88.8% | # # # | `#-+####################+###-#+###-++` |
| lang (Second Column) | div inf ru | 3.199 | 1560 | 1412 | 90.5% | 100.0%, 0 | 667; 3.33; 08:40 | 9 | 88.5% | # # # | `##-+#######+##+####++###############` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 1560 | 1414 | 90.6% | 100.0%, 0 | 667; 3.33; 08:40 | 8 | 44.5% | # # # | `#---++#####+##+#####################` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 1560 | 1419 | 91.0% | 100.0%, 0 | 667; 1.5; 08:45 | 9 | 90.8% | # # # | `-#++###################+++#+##-##+##` |
| prz (Third Column) | div inf ru | 3.199 | 1560 | 1419 | 91.0% | 100.0%, 0 | 667; 0; 08:45 | 8 | 99.3% | # # # | `##+-#######-+#############-#+#######` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 1560 | 1513 | 97.0% | 100.0%, 0 | 633; 3.17; 08:31 | 3 | 78.7% | # # # | `-######-##+#########################` |
| dok (First Column) | div inf ru | 3.199 | 1560 | 1525 | 97.8% | 100.0%, 0 | 633; 1.67; 08:43 | 2 | 100.0% | # # # | `#-+#################################` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 1560 | 1560 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `####################################` |

Other items not always drawn while in view (41 of 53 in view): `t:vinohrady` place 1.9% (longest 104.6 min); `t:santon` place 1.9% (longest 93.33 min); `t:pratzeberg` place 2.6% (longest 76.5 min); `t:litava` place 7.4% (longest 74.33 min); `o:Russian Imperial Guard` overlay 8.4% (longest 15 min); `t:sokolnitz` place 10.8% (longest 60 min); `t:zuran` place 12.7% (longest 60 min); `t:austerlitz` place 15.3% (longest 35 min); `p:plateau` plateau 18.3% (longest 30.4 min); `t:telnitz` place 19.0% (longest 68.17 min); `t:satschan` place 22.3% (longest 69.83 min); `t:augezd` place 25.6% (longest 78.17 min); `o:Drouet forms line` overlay 26.6% (longest 8.5 min); `t:pratzen` place 28.3% (longest 51.5 min); `o:Kobelnitz — never reached` objective 36.1% (longest 3.17 min); `t:goldbach` place 37.7% (longest 68.33 min); `o:II Column → Sokolnitz` overlay 41.2% (longest 3.33 min); `o:Bessières and Rapp` overlay 42.7% (longest 0 min); `o:Liechtenstein and Uvarov` overlay 45.6% (longest 3.33 min); `o:French on the plateau` overlay 46.2% (longest 1.5 min); `o:Nansouty's cuirassiers` overlay 52.3% (longest 3.5 min); `o:IV Column halted` overlay 58.8% (longest 3.33 min); `o:Friant's approach march` overlay 60.0% (longest 2 min); `o:Stare Vinohrady` objective 61.2% (longest 3.33 min); `o:Liechtenstein crosses the front` overlay 61.9% (longest 3.33 min); ...

## land-watch-0900: every formation (play frames, 09:00-12:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rg_cav (Guard Cavalry) | div cav ru | 7.200 | 1508 | 1110 | 73.6% | 99.3%, 133 | 1667; 8.33; 11:46 | 19 | 91.5% | # # # | `#-+#+###+########-++#--++++-##-+#--#` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 7.200 | 1508 | 1152 | 76.4% | 100.0%, 0 | 667; 3.33; 09:23 | 19 | 97.8% | # # # | `####++-+++#--####---###++-+#-###-###` |
| walther (Walther's Dragoons) | div cav fr | 7.200 | 1508 | 1231 | 81.6% | 100.0%, 0 | 667; 3.33; 09:35 | 15 | 100.0% | # # # | `#######-+#-#-#-+#+++#+-+###+-##+####` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 7.199 | 1508 | 1237 | 82.0% | 100.0%, 0 | 667; 3.33; 09:05 | 16 | 100.0% | # # # | `#-+#++--+#######-#####-+#-+-++######` |
| rg_inf (Guard Infantry) | div guard ru | 7.200 | 1508 | 1247 | 82.7% | 100.0%, 0 | 667; 0; 09:15 | 15 | 100.0% | # # # | `##+###--++#######+##+--#+#--#+######` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 7.200 | 1508 | 1254 | 83.2% | 99.5%, 233 | 667; 0; 09:15 | 14 | 100.0% | # # # | `##+#++#++##########-+--+####-+++####` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 7.200 | 1508 | 1266 | 84.0% | 100.0%, 0 | 667; 3.33; 09:03 | 14 | 100.0% | # # # | `+-+##+#####-###--########+-####++###` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 7.199 | 1508 | 1269 | 84.2% | 100.0%, 0 | 667; 3.33; 09:10 | 14 | 100.0% | # # # | `##+###-#+###+##-#++##-###-+-++######` |
| guard_cav (Guard Cavalry) | div cav fr | 7.200 | 1508 | 1315 | 87.2% | 99.7%, 167 | 667; 3.33; 09:06 | 11 | 100.0% | # # # | `--+#++-##################++-++######` |
| vandamme (Vandamme's Division) | div inf fr | 7.199 | 1508 | 1326 | 87.9% | 100.0%, 0 | 667; 1.83; 09:13 | 11 | 100.0% | # # # | `--+################+###+##-##-#####+` |
| caffarelli (Caffarelli's Division) | div inf fr | 7.199 | 1508 | 1328 | 88.1% | 100.0%, 0 | 667; 0; 09:30 | 11 | 100.0% | # # # | `#+###+++++-###+##+#######-+########+` |
| guard_inf (Guard Infantry) | div guard fr | 7.200 | 1508 | 1335 | 88.5% | 100.0%, 0 | 667; 1.83; 11:13 | 10 | 100.0% | # # # | `-+#####################+#--+++#+####` |
| lich (Fifth Column (cavalry)) | corps cav ru | 7.099 | 1508 | 1343 | 89.1% | 100.0%, 0 | 667; 1.5; 09:30 | 9 | 100.0% | # # # | `##+###-++########+####-###+########+` |
| suchet (Suchet's Division) | div inf fr | 7.199 | 1508 | 1349 | 89.5% | 100.0%, 0 | 667; 3.33; 09:10 | 9 | 100.0% | # # # | `##+##+###++-+++-###########-#-######` |
| rivaud (Rivaud's Division) | div inf fr | 7.199 | 1508 | 1369 | 90.8% | 100.0%, 0 | 667; 1.83; 09:43 | 8 | 100.0% | # # # | `-#+#++##+#################+#-#-###-#` |
| kollo (Kollowrat's Austrians) | div inf at | 7.199 | 1508 | 1376 | 91.2% | 100.0%, 0 | 667; 1.5; 09:30 | 7 | 100.0% | # # # | `######+#+#################-+#+#+####` |
| milo (Miloradovich's Russians) | div inf ru | 7.200 | 1508 | 1378 | 91.4% | 100.0%, 0 | 667; 0; 09:45 | 7 | 100.0% | # # # | `##+#####+#######-##-###+###-######-#` |
| c_gren (Grenadier Division) | div inf fr | 7.199 | 1508 | 1406 | 93.2% | 100.0%, 0 | 667; 1.5; 11:15 | 6 | 100.0% | # # # | `#################+########-+-#######` |
| bourcier (Bourcier's Dragoons) | div cav fr | 7.200 | 1407 | 1337 | 95.0% | 100.0%, 0 | 667; 3.33; 09:10 | 4 | 100.0% | # # # | `##+#######################+...-#####` |
| friant (Friant's Division) | div inf fr | 7.200 | 1508 | 1434 | 95.1% | 100.0%, 0 | 633; 0; 11:40 | 5 | 100.0% | # # # | `--##++#########################+####` |
| legrand (Legrand's Division) | div inf fr | 7.199 | 1508 | 1440 | 95.5% | 100.0%, 0 | 667; 0; 09:30 | 4 | 100.0% | # # # | `#++##++#############################` |
| bag (Advance Guard of the Right) | corps inf ru | 7.099 | 1508 | 1446 | 95.9% | 100.0%, 0 | 667; 1.5; 10:30 | 4 | 100.0% | # # # | `##########++#####++##########+######` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 7.199 | 1508 | 1482 | 98.3% | 100.0%, 0 | 433; 2.17; 09:06 | 2 | 100.0% | # # # | `#+###########################+######` |
| lang (Second Column) | div inf ru | 7.199 | 1508 | 1488 | 98.7% | 100.0%, 0 | 667; 0; 11:15 | 1 | 100.0% | # # # | `##########################+#########` |
| prz (Third Column) | div inf ru | 7.199 | 1508 | 1492 | 98.9% | 100.0%, 0 | 533; 2.67; 09:55 | 1 | 100.0% | # # # | `###########-########################` |
| dok (First Column) | div inf ru | 7.199 | 1508 | 1508 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `####################################` |

Other items not always drawn while in view (31 of 46 in view): `t:vinohrady` place 2.0% (longest 150 min); `t:pratzeberg` place 12.6% (longest 106.5 min); `t:litava` place 15.0% (longest 90 min); `t:pratzen` place 22.8% (longest 67.83 min); `t:satschan` place 23.5% (longest 90 min); `t:austerlitz` place 27.2% (longest 45 min); `t:augezd` place 36.7% (longest 57.33 min); `t:telnitz` place 45.6% (longest 56.5 min); `t:zuran` place 66.3% (longest 30 min); `o:Stare Vinohrady` objective 68.8% (longest 5.17 min); `t:goldbach` place 69.2% (longest 25.17 min); `t:sokolnitz` place 71.9% (longest 28 min); `t:santon` place 72.7% (longest 43.5 min); `o:Blasowitz` objective 78.2% (longest 2.93 min); `o:Pratzeberg` objective 82.5% (longest 3.33 min); `o:Russian Imperial Guard` overlay 89.8% (longest 2.67 min); `o:Bessières and Rapp` overlay 91.8% (longest 1.5 min); `o:Kamensky turns about (disputed)` overlay 92.1% (longest 2.33 min); `o:Saint-Hilaire` overlay 92.3% (longest 3.17 min); `o:Liechtenstein and Uvarov` overlay 92.8% (longest 2.67 min); `o:Levasseur up the Goldbach` overlay 93.3% (longest 1.5 min); `o:French on the plateau` overlay 93.9% (longest 0 min); `o:Drouet forms line` overlay 94.1% (longest 0 min); `o:Jurczek's Austrians` overlay 94.2% (longest 2.67 min); `p:plateau` plateau 96.3% (longest 0 min); ...

## hybrid-sel-0900: every formation (play frames, 09:00-10:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| milo (Miloradovich's Russians) | div inf ru | 3.200 | 540 | 21 | 3.9% | 2.2%, 17433 | 14867; 45.07; 09:14 | 3 | 10.0% | d d # | `-x-xxxxxxxxx` |
| walther (Walther's Dragoons) | div cav fr | 3.200 | 540 | 41 | 7.6% | 3.5%, 8767 | 8667; 29.83; 09:30 | 4 | 25.7% | d # d | `xx--x-xxxxx-` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 540 | 55 | 10.2% | 5.9%, 7800 | 8833; 30; 09:30 | 3 | 13.8% | # d d | `+-xxx-xxxxxx` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 540 | 71 | 13.1% | 4.8%, 8900 | 6667; 23.33; 09:36 | 3 | 33.3% | d # d | `xxx-#x#-xxx-` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 540 | 94 | 17.4% | 1.7%, 11233 | 10633; 33.17; 09:27 | 5 | 22.6% | d d d | `--+-x-xxxxxx` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 540 | 109 | 20.2% | 20.2%, 9400 | 8033; 29.76; 09:30 | 2 | 4.2% | # d d | `+xxx-#-xxxxx` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 540 | 124 | 23.0% | 49.1%, 3433 | 7333; 26.43; 09:18 | 6 | 30.5% | # d # | `#---xxxx+xxx` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 540 | 186 | 34.4% | 73.7%, 2700 | 5333; 15.24; 09:30 | 8 | 39.8% | # # d | `--+-x-xxx#-#` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 540 | 276 | 51.1% | 84.3%, 1900 | 5333; 16.67; 09:40 | 5 | 38.6% | # # # | `#---####xxx+` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 540 | 320 | 59.3% | 68.9%, 2933 | 4667; 13.33; 09:40 | 5 | 25.0% | # # # | `++###-+#xx-#` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 540 | 366 | 67.8% | 43.0%, 4433 | 4667; 13.33; 09:10 | 3 | 31.0% | # # d | `-+xx-#######` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 540 | 389 | 72.0% | 96.7%, 600 | 667; 3.33; 09:03 | 9 | 38.4% | # d # | `+-+#++#-+##+` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 540 | 389 | 72.0% | 100.0%, 0 | 667; 3.33; 09:10 | 9 | 64.9% | # # # | `-#-#-++-####` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 540 | 424 | 78.5% | 100.0%, 0 | 667; 3.33; 09:06 | 6 | 100.0% | # # # | `--+##++#####` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 540 | 424 | 78.5% | 100.0%, 0 | 667; 2.93; 09:15 | 7 | 37.1% | # # # | `-#+-#+++###+` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 540 | 424 | 78.5% | 98.5%, 233 | 1333; 5.17; 09:25 | 6 | 37.1% | # # # | `+-##--#-####` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 540 | 431 | 79.8% | 90.2%, 1767 | 1667; 0.4; 09:44 | 4 | 45.0% | # # # | `#-+##+##-###` |
| friant (Friant's Division) | div inf fr | 3.200 | 540 | 435 | 80.6% | 100.0%, 0 | 667; 3.33; 09:06 | 6 | 100.0% | # # # | `--++-+######` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 540 | 455 | 84.3% | 100.0%, 0 | 667; 3.33; 09:20 | 5 | 100.0% | # # # | `+###-++#####` |
| lang (Second Column) | div inf ru | 3.199 | 540 | 468 | 86.7% | 100.0%, 0 | 533; 2.67; 09:10 | 5 | 100.0% | # # # | `+#+##+##+###` |
| prz (Third Column) | div inf ru | 3.199 | 540 | 494 | 91.5% | 100.0%, 0 | 633; 3.17; 09:03 | 3 | 100.0% | # # # | `+++##+######` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 540 | 498 | 92.2% | 100.0%, 0 | 600; 2.77; 09:30 | 3 | 0.0% | # # # | `#####+-#####` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 540 | 510 | 94.4% | 100.0%, 0 | 533; 2.67; 09:22 | 2 | 40.0% | # # # | `+###-#######` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 540 | 520 | 96.3% | 100.0%, 0 | 667; 3.1; 09:26 | 1 | 100.0% | # # # | `#####+######` |
| dok (First Column) | div inf ru | 3.199 | 540 | 522 | 96.7% | 100.0%, 0 | 600; 3; 09:10 | 1 | 100.0% | # # # | `##+#########` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 540 | 523 | 96.9% | 100.0%, 0 | 567; 2.83; 09:10 | 1 | 82.4% | # # # | `##+#########` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 540 | 540 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `############` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 540 | 540 | 100.0% | 100.0%, 0 | 0; 0; - | 0 | - | # # # | `############` |

Other items not always drawn while in view (25 of 31 in view): `t:vinohrady` place 0.0% (longest 60 min); `t:pratzeberg` place 0.0% (longest 60 min); `t:goldbach` place 0.0% (longest 60 min); `t:zuran` place 0.9% (longest 46.01 min); `t:litava` place 2.4% (longest 49.67 min); `t:santon` place 5.6% (longest 30 min); `t:telnitz` place 5.7% (longest 51.67 min); `t:austerlitz` place 7.0% (longest 49.83 min); `t:sokolnitz` place 7.4% (longest 30 min); `t:augezd` place 11.7% (longest 46.83 min); `p:plateau` plateau 25.7% (longest 28.33 min); `t:pratzen` place 27.8% (longest 16.83 min); `t:satschan` place 35.6% (longest 36.5 min); `o:Stare Vinohrady` objective 53.4% (longest 0.24 min); `o:Friant retakes Telnitz` overlay 69.6% (longest 3.33 min); `o:Kamensky turns about (disputed)` overlay 76.8% (longest 1.5 min); `o:Jurczek's Austrians` overlay 77.1% (longest 3.33 min); `o:Bagration` overlay 77.5% (longest 2.93 min); `o:French hold the crest` overlay 82.3% (longest 3.33 min); `o:Saint-Hilaire` overlay 83.8% (longest 3.33 min); `o:Pratzeberg` objective 87.0% (longest 3.1 min); `o:Caffarelli` overlay 87.7% (longest 1.43 min); `o:Levasseur up the Goldbach` overlay 89.1% (longest 3.33 min); `o:Vandamme` overlay 91.9% (longest 0 min); `o:Suchet` overlay 95.6% (longest 0 min)

## hybrid-0900-1h: every formation (play frames, 09:00-10:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| milo (Miloradovich's Russians) | div inf ru | 3.200 | 540 | 0 | 0.0% | 23.3%, 7300 | 18000; 60; 09:00 | 1 | 2.8% | d d d | `xxxxxxxxxxxx` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 540 | 49 | 9.1% | 10.0%, 7200 | 6333; 21.67; 09:03 | 4 | 13.8% | # d d | `+xxx--x--xxx` |
| walther (Walther's Dragoons) | div cav fr | 3.200 | 540 | 50 | 9.3% | 0.2%, 17800 | 7700; 28.5; 09:31 | 5 | 27.3% | d d d | `xx--x--xxxxx` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 540 | 58 | 10.7% | 1.3%, 9400 | 5367; 16.83; 09:43 | 5 | 31.1% | d d d | `-x-xx-xx-xxx` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 540 | 70 | 13.0% | 3.9%, 11233 | 9033; 30; 09:30 | 6 | 27.0% | d d d | `xx--+-xxxxxx` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 540 | 119 | 22.0% | 40.7%, 9233 | 7033; 25.17; 09:35 | 3 | 16.2% | # d d | `+xxx-+#xxxxx` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 540 | 202 | 37.4% | 53.0%, 4667 | 8700; 30; 09:30 | 3 | 14.2% | # d # | `###+x-xxxxxx` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 540 | 209 | 38.7% | 15.4%, 9233 | 3633; 15; 09:00 | 7 | 45.3% | d # d | `xx--+-x++-++` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 540 | 335 | 62.0% | 90.9%, 1567 | 2733; 8.83; 09:21 | 6 | 24.9% | # # # | `#++#----###-` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 540 | 341 | 63.1% | 42.8%, 7967 | 4333; 11.67; 09:13 | 3 | 27.1% | # # # | `#--x-+-#####` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 540 | 375 | 69.4% | 99.1%, 167 | 667; 3.33; 09:03 | 9 | 55.2% | # # # | `+++-#+-#+#+#` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 540 | 381 | 70.6% | 100.0%, 0 | 667; 0; 09:15 | 9 | 59.1% | # # # | `#+--++##+#-#` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 540 | 389 | 72.0% | 100.0%, 0 | 667; 3.33; 09:03 | 8 | 80.1% | # # # | `++---++#####` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 540 | 400 | 74.1% | 100.0%, 0 | 667; 0; 09:15 | 8 | 46.4% | # # # | `#--##++#+###` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 540 | 435 | 80.6% | 89.8%, 1667 | 667; 3.33; 09:18 | 6 | 82.9% | # # # | `--+++######-` |
| friant (Friant's Division) | div inf fr | 3.200 | 540 | 435 | 80.6% | 100.0%, 0 | 667; 3.33; 09:06 | 6 | 100.0% | # # # | `--++-+######` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 540 | 445 | 82.4% | 100.0%, 0 | 667; 3.33; 09:05 | 5 | 100.0% | # # # | `--###-+#####` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 540 | 451 | 83.5% | 100.0%, 0 | 667; 3.33; 09:20 | 5 | 100.0% | # # # | `-###-++#####` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 540 | 461 | 85.4% | 100.0%, 0 | 667; 3.1; 09:41 | 5 | 6.3% | # # # | `+###-+#-+###` |
| lang (Second Column) | div inf ru | 3.199 | 540 | 466 | 86.3% | 100.0%, 0 | 600; 1.5; 09:28 | 5 | 100.0% | # # # | `+#+##+##+###` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 540 | 484 | 89.6% | 100.0%, 0 | 667; 3.33; 09:16 | 3 | 42.9% | # # # | `-##-#+######` |
| prz (Third Column) | div inf ru | 3.199 | 540 | 493 | 91.3% | 100.0%, 0 | 667; 3.33; 09:01 | 3 | 100.0% | # # # | `--###+######` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 540 | 501 | 92.8% | 100.0%, 0 | 667; 3.1; 09:26 | 2 | 87.2% | # # # | `-####+######` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 540 | 511 | 94.6% | 98.9%, 200 | 600; 3; 09:52 | 2 | 0.0% | # # # | `#####+####-#` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 540 | 517 | 95.7% | 100.0%, 0 | 400; 0; 09:30 | 2 | 4.3% | # # # | `#####+##+###` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 540 | 521 | 96.5% | 100.0%, 0 | 633; 3.17; 09:00 | 1 | 100.0% | # # # | `-###########` |
| dok (First Column) | div inf ru | 3.199 | 540 | 522 | 96.7% | 100.0%, 0 | 600; 3; 09:10 | 1 | 100.0% | # # # | `##+#########` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 540 | 523 | 96.9% | 100.0%, 0 | 567; 2.83; 09:10 | 1 | 41.2% | # # # | `##+#########` |

Other items not always drawn while in view (25 of 31 in view): `t:vinohrady` place 0.0% (longest 60 min); `t:goldbach` place 0.0% (longest 60 min); `t:pratzeberg` place 3.3% (longest 30 min); `t:santon` place 5.6% (longest 30 min); `t:telnitz` place 5.7% (longest 51.67 min); `t:austerlitz` place 7.0% (longest 49.83 min); `t:sokolnitz` place 7.4% (longest 30 min); `t:zuran` place 7.6% (longest 45 min); `p:plateau` plateau 13.1% (longest 41.67 min); `t:litava` place 13.3% (longest 30 min); `t:augezd` place 14.6% (longest 46.83 min); `t:pratzen` place 34.1% (longest 30 min); `t:satschan` place 35.6% (longest 36.5 min); `o:Jurczek's Austrians` overlay 63.8% (longest 5.17 min); `o:French hold the crest` overlay 64.8% (longest 1.5 min); `o:Levasseur up the Goldbach` overlay 64.8% (longest 0 min); `o:Friant retakes Telnitz` overlay 69.6% (longest 3.33 min); `o:Bagration` overlay 75.8% (longest 0 min); `o:Vandamme` overlay 76.9% (longest 3.33 min); `o:Stare Vinohrady` objective 77.3% (longest 3.33 min); `o:Saint-Hilaire` overlay 79.4% (longest 3.33 min); `o:Kamensky turns about (disputed)` overlay 81.2% (longest 2.67 min); `o:Caffarelli` overlay 86.7% (longest 0 min); `o:Suchet` overlay 89.1% (longest 1.5 min); `o:Pratzeberg` objective 93.7% (longest 0 min)

## hybrid-0900-157: every formation (play frames, 09:00-10:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| walther (Walther's Dragoons) | div cav fr | 3.200 | 150 | 17 | 11.3% | 0.0%, 23550 | 14444; 35.2; 09:25 | 3 | 21.1% | d d d | `xx+x-xxxxxxx` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 150 | 21 | 14.0% | 1.3%, 12403 | 7693; 19.4; 09:04 | 7 | 31.8% | d d d | `-xxx--xx--xx` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 150 | 22 | 14.7% | 9.3%, 9420 | 15386; 38.8; 09:04 | 3 | 9.4% | # # d | `+xxxxxxx-x-#` |
| milo (Miloradovich's Russians) | div inf ru | 3.200 | 150 | 30 | 20.0% | 24.7%, 9577 | 16485; 33; 09:14 | 3 | 0.8% | d d d | `-#-xxxxxx++x` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 150 | 33 | 22.0% | 3.3%, 14758 | 7065; 17; 09:35 | 8 | 30.8% | d d d | `x------xxx-x` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 150 | 61 | 40.7% | 16.7%, 11775 | 4239; 14.82; 09:15 | 6 | 29.2% | d # d | `xx+xx-x++x+#` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 150 | 65 | 43.3% | 91.3%, 2041 | 7065; 16.16; 09:14 | 6 | 15.3% | # d # | `+x-xx-x-##+-` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 150 | 86 | 57.3% | 40.7%, 12717 | 9106; 24.8; 09:35 | 2 | 12.5% | # d d | `#####+#xxxxx` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 150 | 97 | 64.7% | 98.7%, 314 | 942; 3.6; 09:03 | 9 | 39.6% | # # # | `+--+#+-#++-#` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 150 | 99 | 66.0% | 100.0%, 0 | 942; 3.6; 09:03 | 9 | 72.5% | # # # | `+-++++##+#-#` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 150 | 99 | 66.0% | 54.0%, 5966 | 3297; 12.59; 09:17 | 6 | 27.5% | # # # | `#-+-x+-#####` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 150 | 110 | 73.3% | 100.0%, 0 | 942; 3.6; 09:07 | 7 | 42.5% | # # # | `--+##++#+#++` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 150 | 114 | 76.0% | 100.0%, 0 | 942; 3.6; 09:03 | 6 | 69.4% | # # # | `++#---+#####` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 150 | 114 | 76.0% | 100.0%, 0 | 942; 3.6; 09:10 | 7 | 0.0% | # # # | `+#+#++#-+##+` |
| friant (Friant's Division) | div inf fr | 3.200 | 150 | 116 | 77.3% | 100.0%, 0 | 942; 3.6; 09:22 | 7 | 100.0% | # # # | `--++-+######` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 150 | 116 | 77.3% | 100.0%, 0 | 942; 3.6; 09:03 | 6 | 100.0% | # # # | `+-+#-++#####` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 150 | 121 | 80.7% | 90.0%, 2198 | 942; 3.6; 09:05 | 5 | 82.8% | # # # | `--+++#####++` |
| lang (Second Column) | div inf ru | 3.199 | 150 | 126 | 84.0% | 100.0%, 0 | 942; 3.6; 09:10 | 5 | 100.0% | # # # | `+#+##+##+###` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 150 | 127 | 84.7% | 100.0%, 0 | 942; 3.6; 09:24 | 4 | 21.7% | # # # | `####+++#+###` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 150 | 128 | 85.3% | 100.0%, 0 | 942; 3.6; 09:05 | 4 | 100.0% | # # # | `--###++#####` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 150 | 128 | 85.3% | 43.3%, 10519 | 1413; 1.6; 09:30 | 3 | 50.0% | # # # | `+++##++#####` |
| prz (Third Column) | div inf ru | 3.199 | 150 | 134 | 89.3% | 100.0%, 0 | 942; 3.6; 09:01 | 3 | 100.0% | # # # | `--##++######` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 150 | 139 | 92.7% | 100.0%, 0 | 942; 2.76; 09:27 | 2 | 90.9% | # # # | `-####+######` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 150 | 140 | 93.3% | 100.0%, 0 | 785; 0; 09:30 | 2 | 50.0% | # # # | `#####+#++###` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 150 | 140 | 93.3% | 99.3%, 157 | 785; 3; 09:24 | 3 | 10.0% | # # # | `####++####++` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 150 | 144 | 96.0% | 100.0%, 0 | 942; 3.6; 09:10 | 1 | 0.0% | # # # | `##+#########` |
| dok (First Column) | div inf ru | 3.199 | 150 | 144 | 96.0% | 100.0%, 0 | 942; 3.6; 09:10 | 1 | 100.0% | # # # | `##+#########` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 150 | 145 | 96.7% | 100.0%, 0 | 785; 3; 09:00 | 1 | 100.0% | # # # | `-###########` |

Other items not always drawn while in view (25 of 31 in view): `t:vinohrady` place 0.0% (longest 60 min); `t:pratzeberg` place 0.0% (longest 60 min); `t:zuran` place 0.0% (longest 60 min); `t:goldbach` place 0.7% (longest 59.4 min); `t:santon` place 4.0% (longest 30.04 min); `p:plateau` plateau 5.3% (longest 28.99 min); `t:telnitz` place 6.7% (longest 51 min); `t:litava` place 7.3% (longest 30 min); `t:sokolnitz` place 8.0% (longest 30 min); `t:austerlitz` place 8.0% (longest 48.6 min); `t:augezd` place 15.3% (longest 46.2 min); `t:pratzen` place 34.0% (longest 30.04 min); `t:satschan` place 36.0% (longest 36.59 min); `o:Jurczek's Austrians` overlay 40.2% (longest 9 min); `o:Levasseur up the Goldbach` overlay 52.4% (longest 0 min); `o:French hold the crest` overlay 68.3% (longest 2.59 min); `o:Kamensky turns about (disputed)` overlay 69.5% (longest 3.6 min); `o:Friant retakes Telnitz` overlay 75.0% (longest 3.6 min); `o:Bagration` overlay 76.8% (longest 0.04 min); `o:Stare Vinohrady` objective 77.9% (longest 2.92 min); `o:Vandamme` overlay 82.4% (longest 3.6 min); `o:Caffarelli` overlay 82.9% (longest 0 min); `o:Saint-Hilaire` overlay 83.8% (longest 3.6 min); `o:Suchet` overlay 89.0% (longest 1.6 min); `o:Pratzeberg` objective 90.0% (longest 0 min)

## hybrid-0900-slow: every formation (play frames, 09:00-10:00)

Strip: one character per 5 clock minutes: # drawn in 90% or more of its frames in view, + 50% or more, - less, x in view and never drawn, t behind the ground only, . not in view.

| formation | kind | base priority | in view | drawn | share | fresh layout: share, longest gap (ms) | longest hidden (ms; clock min; from) | episodes | with room | rest before, after, fresh | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|
| milo (Miloradovich's Russians) | div inf ru | 3.200 | 150 | 3 | 2.0% | 26.7%, 61000 | 131000; 48.6; 09:12 | 4 | 2.0% | d d d | `---xxxxxxxxx` |
| rg_cav (Guard Cavalry) | div cav ru | 3.200 | 150 | 4 | 2.7% | 5.3%, 60000 | 144000; 56.4; 09:04 | 2 | 3.4% | # d d | `-xxxxxxxxxxx` |
| walther (Walther's Dragoons) | div cav fr | 3.200 | 150 | 6 | 4.0% | 0.0%, 150000 | 92000; 35.2; 09:25 | 6 | 6.9% | d d d | `-x-x-xxxxxxx` |
| dhautpoul (d'Hautpoul's Cuirassiers) | div cav fr | 3.200 | 150 | 16 | 10.7% | 0.7%, 80000 | 51000; 15; 09:30 | 10 | 9.0% | d d d | `-+-x--xx-xxx` |
| kellermann (Kellermann's Light Cavalry) | div cav fr | 3.200 | 150 | 19 | 12.7% | 41.3%, 80000 | 67000; 22.8; 09:30 | 3 | 2.3% | # d d | `-xxx+-xxxx-x` |
| guard_inf (Guard Infantry) | div guard fr | 3.200 | 150 | 26 | 17.3% | 56.0%, 38000 | 49000; 19.4; 09:41 | 12 | 7.3% | # d # | `-+-#x-xx-xxx` |
| guard_cav (Guard Cavalry) | div cav fr | 3.200 | 150 | 35 | 23.3% | 3.3%, 94000 | 47000; 18.2; 09:41 | 8 | 7.8% | d # d | `-#-x+-xx-xx-` |
| nansouty (Nansouty's Cuirassiers) | div cav fr | 3.200 | 150 | 96 | 64.0% | 20.0%, 70000 | 16000; 9.46; 09:20 | 11 | 18.5% | d d d | `--+-x+##+#++` |
| rg_inf (Guard Infantry) | div guard ru | 3.200 | 150 | 96 | 64.0% | 39.3%, 74000 | 35000; 11; 09:12 | 6 | 11.1% | # # # | `-+-x++######` |
| sthilaire (Saint-Hilaire's Division) | div inf fr | 3.199 | 150 | 103 | 68.7% | 90.0%, 14000 | 14000; 5.6; 09:40 | 9 | 23.4% | # # # | `-+#+###+---#` |
| vandamme (Vandamme's Division) | div inf fr | 3.199 | 150 | 103 | 68.7% | 91.3%, 13000 | 13000; 7.38; 09:30 | 9 | 8.5% | # # # | `++#+-+x-+###` |
| rivaud (Rivaud's Division) | div inf fr | 3.199 | 150 | 122 | 81.3% | 100.0%, 0 | 2000; 1.2; 09:03 | 14 | 50.0% | # # # | `+#++++##+++#` |
| suchet (Suchet's Division) | div inf fr | 3.199 | 150 | 128 | 85.3% | 98.7%, 2000 | 2000; 1.2; 09:01 | 11 | 54.5% | # # # | `+++#++######` |
| friant (Friant's Division) | div inf fr | 3.200 | 150 | 134 | 89.3% | 100.0%, 0 | 2000; 1.2; 09:00 | 8 | 100.0% | # # # | `++#++#######` |
| drouet (Drouet d'Erlon's Division) | div inf fr | 3.199 | 150 | 138 | 92.0% | 100.0%, 0 | 2000; 1.2; 09:09 | 6 | 83.3% | # # # | `#+++########` |
| legrand (Legrand's Division) | div inf fr | 3.199 | 150 | 140 | 93.3% | 100.0%, 0 | 2000; 1.2; 09:01 | 5 | 100.0% | # # # | `-+##+#######` |
| bourcier (Bourcier's Dragoons) | div cav fr | 3.200 | 150 | 140 | 93.3% | 100.0%, 0 | 2000; 1.2; 09:01 | 5 | 100.0% | # # # | `+##++#+#####` |
| caffarelli (Caffarelli's Division) | div inf fr | 3.199 | 150 | 140 | 93.3% | 100.0%, 0 | 2000; 1.2; 09:04 | 5 | 20.0% | # # # | `+#+#+#######` |
| lang (Second Column) | div inf ru | 3.199 | 150 | 140 | 93.3% | 100.0%, 0 | 2000; 1.2; 09:03 | 5 | 90.0% | # # # | `+####+######` |
| lich (Fifth Column (cavalry)) | corps cav ru | 3.099 | 150 | 142 | 94.7% | 100.0%, 0 | 2000; 1.2; 09:01 | 4 | 12.5% | # # # | `+###+##+####` |
| c_gren (Grenadier Division) | div inf fr | 3.199 | 150 | 144 | 96.0% | 100.0%, 0 | 2000; 1.2; 09:00 | 3 | 33.3% | # # # | `+###########` |
| prz (Third Column) | div inf ru | 3.199 | 150 | 144 | 96.0% | 100.0%, 0 | 2000; 1.2; 09:01 | 3 | 100.0% | # # # | `++##########` |
| gqg (Imperial Headquarters) | army hq fr | 3.000 | 150 | 146 | 97.3% | 100.0%, 0 | 2000; 0; 09:30 | 2 | 25.0% | # # # | `#######+####` |
| kienmayer (Kienmayer's Advance Guard) | div mixed at | 3.199 | 150 | 146 | 97.3% | 100.0%, 0 | 2000; 1.2; 09:00 | 2 | 75.0% | # # # | `+###+#######` |
| kollo (Kollowrat's Austrians) | div inf at | 3.199 | 150 | 146 | 97.3% | 99.3%, 1000 | 2000; 1.2; 09:24 | 2 | 0.0% | # # # | `####+##+####` |
| ahq (Allied Headquarters) | army hq ru | 3.000 | 150 | 148 | 98.7% | 100.0%, 0 | 2000; 1.2; 09:10 | 1 | 50.0% | # # # | `############` |
| dok (First Column) | div inf ru | 3.199 | 150 | 148 | 98.7% | 100.0%, 0 | 2000; 1.2; 09:10 | 1 | 100.0% | # # # | `############` |
| bag (Advance Guard of the Right) | corps inf ru | 3.099 | 150 | 148 | 98.7% | 100.0%, 0 | 2000; 1.2; 09:00 | 1 | 100.0% | # # # | `+###########` |

Other items not always drawn while in view (25 of 31 in view): `t:vinohrady` place 0.0% (longest 60 min); `t:pratzeberg` place 0.0% (longest 60 min); `t:santon` place 2.7% (longest 31.01 min); `t:sokolnitz` place 2.7% (longest 29.46 min); `t:goldbach` place 6.0% (longest 35.2 min); `t:austerlitz` place 7.3% (longest 42 min); `p:plateau` plateau 9.3% (longest 44.39 min); `t:telnitz` place 10.0% (longest 50.4 min); `t:zuran` place 12.0% (longest 45 min); `t:augezd` place 12.7% (longest 48.6 min); `t:litava` place 13.3% (longest 24.66 min); `t:pratzen` place 34.7% (longest 30 min); `t:satschan` place 37.3% (longest 36.18 min); `o:Jurczek's Austrians` overlay 53.7% (longest 5.6 min); `o:French hold the crest` overlay 69.5% (longest 10.8 min); `o:Vandamme` overlay 79.4% (longest 1.2 min); `o:Stare Vinohrady` objective 82.4% (longest 1.2 min); `o:Friant retakes Telnitz` overlay 85.3% (longest 1.2 min); `o:Bagration` overlay 89.0% (longest 0.79 min); `o:Saint-Hilaire` overlay 91.2% (longest 1.2 min); `o:Kamensky turns about (disputed)` overlay 91.5% (longest 0 min); `o:Levasseur up the Goldbach` overlay 91.5% (longest 0 min); `o:Suchet` overlay 91.5% (longest 0 min); `o:Caffarelli` overlay 96.3% (longest 0.22 min); `o:Pratzeberg` objective 98.7% (longest 0 min)

## Across the runs: each formation (play frames; share drawn while in view / longest hidden by the layout in clock minutes)

| formation | hybrid-0830 | hybrid-0830-60 | hybrid-1200 | hybrid-4x-day | land-0900 | land-4x-day | paper-0900 | phone-0900 | phone-land-0900 | hybrid-fr-0900 | hybrid-al-0900 | hybrid-fixed-0830 | hybrid-watch-0830 | land-watch-0900 | hybrid-sel-0900 | hybrid-0900-157 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| milo | 17.5% / 99.83 (27667 ms) | 18.1% / 99.92 (27667 ms) | 76.6% / 17.93 (3667 ms) | 45.6% / 30 (3333 ms) | 91.4% / 0 (667 ms) | 70.4% / 101.33 (2533 ms) | - | - | - | 0.0% / 49.83 (15967 ms) | 29.2% / 90 (24633 ms) | 29.9% / 40.23 (12000 ms) | 15.6% / 26.9 (9333 ms) | 91.4% / 0 (667 ms) | 3.9% / 45.07 (14867 ms) | 20.0% / 33 (16485 ms) |
| lich | 84.9% / 3.33 (667 ms) | 84.7% / 3.33 (667 ms) | 87.3% / 0.24 (667 ms) | 72.0% / 81.93 (2200 ms) | 89.1% / 1.5 (667 ms) | 98.1% / 0 (467 ms) | 90.8% / 3.33 (667 ms) | 0.0% / 90 (25067 ms) | 70.4% / 10.17 (2333 ms) | 86.1% / 3.1 (667 ms) | 84.5% / 3.1 (667 ms) | 95.2% / 3.33 (667 ms) | 84.6% / 3.33 (667 ms) | 89.1% / 1.5 (667 ms) | 94.4% / 2.67 (533 ms) | 76.0% / 3.6 (942 ms) |
| guard_cav | 16.5% / 48.17 (13233 ms) | 16.7% / 43.25 (12250 ms) | 48.0% / 43 (12600 ms) | 32.5% / 119.79 (12467 ms) | 88.4% / 3.33 (667 ms) | 83.5% / 3.01 (667 ms) | - | - | - | 28.5% / 48.17 (13267 ms) | 2.6% / 41.5 (12067 ms) | 50.2% / 30 (8700 ms) | 38.5% / 15 (5000 ms) | 87.2% / 3.33 (667 ms) | 17.4% / 33.17 (10633 ms) | 22.0% / 17 (7065 ms) |
| dhautpoul | 9.8% / 46.83 (12667 ms) | 12.4% / 37.5 (11500 ms) | 26.7% / 60 (15300 ms) | 15.7% / 84.16 (13000 ms) | 87.9% / 0 (667 ms) | 70.2% / 0 (667 ms) | - | - | - | 8.1% / 46.83 (12667 ms) | 52.6% / 1.67 (333 ms) | 6.9% / 69.83 (21967 ms) | 10.6% / 53.33 (12667 ms) | 83.2% / 0 (667 ms) | 13.1% / 23.33 (6667 ms) | 14.0% / 19.4 (7693 ms) |
| walther | 16.2% / 56.67 (15333 ms) | 18.8% / 45 (13000 ms) | 59.4% / 8.33 (1667 ms) | 36.1% / 45 (7333 ms) | 86.7% / 2.93 (667 ms) | 64.7% / 0 (667 ms) | - | - | - | 26.7% / 47.67 (13533 ms) | - | 37.4% / 26.83 (6000 ms) | 26.5% / 24.83 (7733 ms) | 81.6% / 3.33 (667 ms) | 7.6% / 29.83 (8667 ms) | 11.3% / 35.2 (14444 ms) |
| rg_cav | 15.8% / 54.83 (17667 ms) | 16.8% / 54.92 (17667 ms) | 24.3% / 56.83 (14333 ms) | 20.0% / 119.51 (11000 ms) | 72.3% / 8.33 (1667 ms) | 74.2% / 0 (667 ms) | - | - | - | 43.1% / 36.67 (11333 ms) | 30.1% / 38.5 (9967 ms) | 16.7% / 58.5 (15700 ms) | 25.4% / 54.83 (17667 ms) | 73.6% / 8.33 (1667 ms) | 10.2% / 30 (8833 ms) | 14.7% / 38.8 (15386 ms) |
| c_cav | - | - | - | 68.9% / 26.67 (667 ms) | - | - | 91.9% / 3.33 (667 ms) | 13.1% / 24.67 (7233 ms) | - | - | - | - | - | - | - | - |
| c_gren | 80.3% / 8.5 (2667 ms) | 77.7% / 8.42 (2667 ms) | 81.6% / 13.33 (2667 ms) | 72.3% / 0 (667 ms) | 94.8% / 3.33 (667 ms) | 89.4% / 10.84 (667 ms) | 87.3% / 3.33 (667 ms) | 15.5% / 47.33 (13733 ms) | - | 90.0% / 3.33 (667 ms) | - | 89.0% / 0 (1333 ms) | 84.0% / 3.1 (667 ms) | 93.2% / 1.5 (667 ms) | 79.8% / 0.4 (1667 ms) | 73.3% / 3.6 (942 ms) |
| kellermann | 36.6% / 39.83 (12333 ms) | 36.0% / 39.92 (12333 ms) | 35.6% / 13.33 (4667 ms) | 43.5% / 100.07 (9667 ms) | 86.4% / 3.33 (667 ms) | 83.0% / 0 (667 ms) | - | - | - | 23.1% / 53.17 (13000 ms) | - | 23.3% / 63.5 (18700 ms) | 46.5% / 38.17 (12000 ms) | 84.0% / 3.33 (667 ms) | 20.2% / 29.76 (8033 ms) | 57.3% / 24.8 (9106 ms) |
| constantine | - | - | - | 77.2% / 25.66 (667 ms) | - | - | 89.6% / 3.33 (667 ms) | 21.4% / 50.17 (13667 ms) | - | - | - | - | - | - | - | - |
| guard_inf | 64.8% / 18.33 (3667 ms) | 37.9% / 20.89 (6233 ms) | 64.0% / 28.17 (5633 ms) | 55.4% / 28.1 (4000 ms) | 86.4% / 3.33 (667 ms) | 90.6% / 15.33 (667 ms) | - | - | - | 44.0% / 34.83 (10333 ms) | 84.1% / 1.5 (667 ms) | 61.4% / 19 (5800 ms) | 56.9% / 11.9 (4333 ms) | 88.5% / 1.83 (667 ms) | 23.0% / 26.43 (7333 ms) | 66.0% / 12.59 (3297 ms) |
| c_v | - | - | - | 56.9% / 3.01 (667 ms) | - | - | 97.3% / 1.83 (667 ms) | 30.5% / 8.33 (1667 ms) | - | - | - | - | - | - | - | - |
| nansouty | 46.5% / 7.5 (3133 ms) | 46.1% / 22.5 (4500 ms) | 60.7% / 11.5 (2300 ms) | 36.0% / 29.84 (3667 ms) | 75.3% / 3.33 (667 ms) | 70.2% / 0 (667 ms) | - | - | - | 51.2% / 23.33 (4667 ms) | - | 33.2% / 40 (10000 ms) | 48.5% / 21.19 (6300 ms) | 76.4% / 3.33 (667 ms) | 100.0% / 0 (0 ms) | 40.7% / 14.82 (4239 ms) |
| c_gd | - | - | - | 89.2% / 0 (600 ms) | - | - | 91.3% / 3.33 (667 ms) | 33.2% / 16.83 (3667 ms) | - | - | - | - | - | - | - | - |
| vandamme | 65.7% / 5.17 (2000 ms) | 64.9% / 5.08 (2000 ms) | 81.0% / 3.33 (667 ms) | 64.7% / 1.23 (667 ms) | 87.9% / 1.83 (667 ms) | 81.7% / 26.67 (667 ms) | - | - | - | 70.2% / 9.83 (2333 ms) | 70.4% / 8.83 (2733 ms) | 46.2% / 46.43 (11333 ms) | 73.5% / 9.6 (2000 ms) | 87.9% / 1.83 (667 ms) | 34.4% / 15.24 (5333 ms) | 43.3% / 16.16 (7065 ms) |
| bag | 86.4% / 3.33 (667 ms) | 86.2% / 3.33 (667 ms) | 86.0% / 3.17 (633 ms) | 84.5% / 0 (667 ms) | 93.0% / 3.1 (667 ms) | 96.1% / 0 (667 ms) | 96.4% / 3.33 (667 ms) | 36.5% / 5.5 (1100 ms) | 45.1% / 3.33 (667 ms) | 89.7% / 3.17 (633 ms) | 89.7% / 3.17 (633 ms) | 93.7% / 3.33 (667 ms) | 89.7% / 3.33 (667 ms) | 95.9% / 1.5 (667 ms) | 100.0% / 0 (0 ms) | 96.7% / 3 (785 ms) |
| rg_inf | 75.1% / 15.4 (5033 ms) | 76.4% / 15.36 (5017 ms) | 42.5% / 50.17 (13333 ms) | 47.6% / 59.25 (7333 ms) | 82.7% / 0 (667 ms) | 84.5% / 0 (667 ms) | - | - | - | 77.8% / 13.17 (4200 ms) | 54.6% / 40.23 (12000 ms) | 66.7% / 41.67 (12333 ms) | 73.8% / 11.5 (2667 ms) | 82.7% / 0 (667 ms) | 67.8% / 13.33 (4667 ms) | 85.3% / 1.6 (1413 ms) |
| sthilaire | 75.7% / 3.33 (667 ms) | 75.4% / 3.33 (667 ms) | 72.1% / 9.83 (1967 ms) | 69.6% / 8.1 (667 ms) | 82.0% / 3.33 (667 ms) | 79.3% / 0 (667 ms) | - | - | - | 94.3% / 3.33 (667 ms) | 89.1% / 3.33 (667 ms) | 81.3% / 13.5 (3000 ms) | 72.2% / 10 (4000 ms) | 82.0% / 3.33 (667 ms) | 51.1% / 16.67 (5333 ms) | 80.7% / 3.6 (942 ms) |
| c_i | - | - | - | 89.2% / 0 (600 ms) | - | - | 94.7% / 3.33 (667 ms) | 59.0% / 14.39 (4600 ms) | - | - | - | - | - | - | - | - |
| rivaud | 73.3% / 0.64 (2000 ms) | 80.9% / 0.63 (2000 ms) | 61.2% / 13.33 (4667 ms) | 64.8% / 24.46 (2000 ms) | 90.8% / 1.83 (667 ms) | 81.6% / 0 (667 ms) | - | - | - | 72.4% / 8.57 (3667 ms) | 79.9% / 13.5 (3000 ms) | 78.7% / 3.1 (667 ms) | 71.5% / 5.17 (2000 ms) | 90.8% / 1.83 (667 ms) | 59.3% / 13.33 (4667 ms) | 76.0% / 3.6 (942 ms) |
| bourcier | 81.4% / 0 (667 ms) | 82.9% / 0 (667 ms) | 72.1% / 15 (3000 ms) | 62.7% / 32 (2500 ms) | 92.6% / 3.33 (667 ms) | 80.7% / 0 (667 ms) | - | - | - | 84.1% / 3.33 (667 ms) | 79.5% / 3.33 (667 ms) | 94.8% / 4.77 (1000 ms) | 86.5% / 3.33 (667 ms) | 95.0% / 3.33 (667 ms) | 84.3% / 3.33 (667 ms) | 77.3% / 3.6 (942 ms) |
| col4 | - | - | - | 80.8% / 0 (600 ms) | - | - | 93.0% / 1.83 (667 ms) | 63.2% / 16.67 (5333 ms) | - | - | - | - | - | - | - | - |
| suchet | 72.8% / 3.33 (667 ms) | 74.4% / 3.33 (667 ms) | 81.7% / 3.33 (667 ms) | 67.1% / 26.67 (667 ms) | 94.0% / 3.33 (667 ms) | 86.9% / 0 (667 ms) | - | - | - | 77.2% / 3.33 (667 ms) | 55.6% / 2.67 (533 ms) | 84.9% / 1.83 (667 ms) | 82.2% / 3.33 (667 ms) | 89.5% / 3.33 (667 ms) | 72.0% / 3.33 (667 ms) | 64.7% / 3.6 (942 ms) |
| kienmayer | 88.1% / 6.5 (1300 ms) | 88.2% / 6.58 (1317 ms) | 64.8% / 22.5 (6500 ms) | 82.4% / 6.69 (800 ms) | 95.7% / 0 (667 ms) | 76.6% / 26.67 (667 ms) | - | - | - | - | 84.3% / 6.17 (1233 ms) | 96.7% / 3.33 (667 ms) | 91.0% / 1.5 (667 ms) | 98.3% / 2.17 (433 ms) | 96.3% / 3.1 (667 ms) | 92.7% / 2.76 (942 ms) |
| drouet | 76.9% / 1.5 (667 ms) | 77.4% / 1.58 (667 ms) | 97.5% / 2.6 (567 ms) | 79.2% / 0.54 (667 ms) | 84.2% / 3.33 (667 ms) | 85.8% / 0 (667 ms) | - | - | - | 85.9% / 0 (667 ms) | 76.2% / 0 (667 ms) | 86.0% / 6.67 (1333 ms) | 81.5% / 1.5 (667 ms) | 84.2% / 3.33 (667 ms) | 72.0% / 3.33 (667 ms) | 66.0% / 3.6 (942 ms) |
| friant | 84.7% / 2.93 (667 ms) | 84.7% / 2.98 (667 ms) | 91.5% / 3.33 (667 ms) | 69.3% / 0 (667 ms) | 93.5% / 3.1 (667 ms) | 83.5% / 0.71 (667 ms) | - | - | - | 89.5% / 3.33 (667 ms) | 83.0% / 0.4 (667 ms) | 90.6% / 3.33 (667 ms) | 83.9% / 3.33 (667 ms) | 95.1% / 0 (633 ms) | 80.6% / 3.33 (667 ms) | 77.3% / 3.6 (942 ms) |
| gqg | 97.8% / 0 (400 ms) | 97.7% / 0 (433 ms) | 91.3% / 2.83 (567 ms) | 88.4% / 0.71 (667 ms) | - | 89.2% / 0 (600 ms) | 97.3% / 2.67 (533 ms) | 79.3% / 0 (633 ms) | 74.0% / 1.83 (667 ms) | 98.5% / 0 (400 ms) | 95.6% / 0 (400 ms) | 99.2% / 0 (400 ms) | 100.0% / 0 (0 ms) | - | 92.2% / 2.77 (600 ms) | 93.3% / 0 (785 ms) |
| legrand | 88.5% / 0.24 (667 ms) | 88.3% / 0.27 (667 ms) | 75.6% / 3.33 (667 ms) | 75.4% / 22.44 (667 ms) | 95.5% / 0 (667 ms) | 85.7% / 26.67 (667 ms) | - | - | - | 93.9% / 3.1 (667 ms) | - | 91.9% / 3.1 (667 ms) | 86.6% / 1.5 (667 ms) | 95.5% / 0 (667 ms) | 78.5% / 3.33 (667 ms) | 85.3% / 3.6 (942 ms) |
| c_iii | - | - | - | 81.7% / 3.01 (367 ms) | - | - | 91.0% / 1.83 (667 ms) | 76.2% / 12.17 (4433 ms) | - | - | - | - | - | - | - | - |
| lang | 91.5% / 0 (667 ms) | 91.4% / 0 (667 ms) | 88.6% / 3.33 (667 ms) | 76.7% / 14.67 (667 ms) | 98.7% / 0 (667 ms) | 86.7% / 0 (667 ms) | - | - | - | - | 88.1% / 0 (667 ms) | 98.8% / 3.17 (633 ms) | 90.5% / 3.33 (667 ms) | 98.7% / 0 (667 ms) | 86.7% / 2.67 (533 ms) | 84.0% / 3.6 (942 ms) |
| buxhowden | - | - | - | 89.2% / 0 (600 ms) | - | 89.2% / 0 (600 ms) | 98.7% / 3.33 (667 ms) | 76.8% / 1.01 (1833 ms) | 82.0% / 3.33 (667 ms) | - | - | - | - | - | - | - |
| kollo | 83.3% / 0.4 (667 ms) | 83.2% / 0.36 (667 ms) | 77.3% / 3.33 (667 ms) | 83.4% / 1.01 (667 ms) | 91.2% / 1.5 (667 ms) | 94.4% / 0 (667 ms) | - | - | - | 91.3% / 3.17 (633 ms) | 86.7% / 1.83 (667 ms) | 91.1% / 4.33 (867 ms) | 78.8% / 0.4 (667 ms) | 91.2% / 1.5 (667 ms) | 78.5% / 5.17 (1333 ms) | 93.3% / 3 (785 ms) |
| caffarelli | 82.9% / 3.33 (667 ms) | 83.5% / 3.33 (667 ms) | 82.5% / 3.33 (667 ms) | 80.6% / 10.33 (667 ms) | 88.1% / 0 (667 ms) | 84.0% / 0 (667 ms) | - | - | - | 86.7% / 0 (667 ms) | 79.8% / 3.1 (667 ms) | 81.0% / 3.33 (667 ms) | 90.6% / 3.33 (667 ms) | 88.1% / 0 (667 ms) | 78.5% / 2.93 (667 ms) | 84.7% / 3.6 (942 ms) |
| c_iv | - | - | - | 80.8% / 0 (600 ms) | - | - | 89.7% / 1.5 (667 ms) | 79.6% / 4.33 (867 ms) | - | - | - | - | - | - | - | - |
| dok | 97.5% / 0 (633 ms) | 97.5% / 0 (633 ms) | 86.8% / 3.33 (667 ms) | 81.1% / 0 (667 ms) | 98.7% / 3 (600 ms) | 88.0% / 0 (667 ms) | - | - | - | 96.1% / 3 (600 ms) | 96.2% / 0 (633 ms) | 97.9% / 2.67 (533 ms) | 97.8% / 1.67 (633 ms) | 100.0% / 0 (0 ms) | 96.7% / 3 (600 ms) | 96.0% / 3.6 (942 ms) |
| ahq | 97.0% / 3.17 (633 ms) | 96.9% / 3.25 (650 ms) | 94.3% / 3.33 (667 ms) | 83.2% / 7.99 (667 ms) | - | 89.2% / 0 (600 ms) | 95.2% / 2.67 (533 ms) | 91.4% / 6 (1200 ms) | 88.8% / 3.33 (667 ms) | 96.7% / 2.83 (567 ms) | 98.9% / 2.83 (567 ms) | 97.6% / 3.17 (633 ms) | 97.0% / 3.17 (633 ms) | - | 96.9% / 2.83 (567 ms) | 96.0% / 3.6 (942 ms) |
| prz | 92.8% / 3.1 (667 ms) | 92.6% / 3.06 (667 ms) | 93.4% / 1.83 (667 ms) | 96.9% / 1.23 (667 ms) | 98.9% / 2.67 (533 ms) | 86.0% / 0 (667 ms) | - | - | - | 95.2% / 3.33 (667 ms) | 96.9% / 3.33 (667 ms) | 100.0% / 0 (0 ms) | 91.0% / 0 (667 ms) | 98.9% / 2.67 (533 ms) | 91.5% / 3.17 (633 ms) | 89.3% / 3.6 (942 ms) |

## The 90-frame benchmark against longer playback

The benchmark's hybrid Play (09:00, 90 frames at 1/2x): formation-frames drawn 57.1%, longest hidden 4033 ms (its starved: nansouty, walther, milo, dhautpoul, guard_cav, kellermann, rg_cav, sthilaire). The long run from 08:30 cut into 17 windows of 90 play frames: share drawn 55.2% to 74.6%; 14 windows with a formation hidden for the whole window (3,000 ms); over the whole run 67.6%, longest 27667 ms.

| window (clock) | share drawn | longest hidden in the window | who |
|---|---|---|---|
| 08:30-08:44 | 63.5% | 2967 ms | guard_cav |
| 08:44-08:50 | 58.4% | 2033 ms | dhautpoul |
| 08:50-09:00 | 66.7% | 3000 ms | kellermann |
| 09:00-09:10 | 74.6% | 3000 ms | kellermann |
| 09:10-09:15 | 72.6% | 3000 ms | kellermann |
| 09:15-09:29 | 67.3% | 3000 ms | milo |
| 09:29-09:35 | 67.0% | 3000 ms | walther |
| 09:35-09:45 | 70.8% | 3000 ms | kellermann |
| 09:45-09:55 | 72.2% | 3000 ms | kellermann |
| 09:55-10:10 | 68.4% | 3000 ms | kellermann |
| 10:10-10:25 | 69.7% | 3000 ms | dhautpoul |
| 10:25-10:30 | 71.6% | 3000 ms | milo |
| 10:30-10:45 | 72.9% | 3000 ms | milo |
| 10:45-10:59 | 66.4% | 3000 ms | dhautpoul |
| 10:59-11:05 | 74.4% | 2967 ms | dhautpoul |
| 11:05-11:15 | 55.2% | 3000 ms | guard_cav |
| 11:15-11:25 | 56.3% | 3000 ms | guard_cav |

## Real time (gl) against hybrid-0900-slow (driver, frames 1,000 ms apart), clock 09:00-09:17

Real frames 46 (interval p10/median/p90 14955/26727/35114 ms, passes 46), driver frames 46 (passes 46). Formation-frames drawn: real 873/1288 (67.8%), driver 873/1288 (67.8%); frames paired by clock 46, identical in every formation 46 (0 formation-frame differences).

| formation | real: share, longest (frames; clock min), episodes | driver: share, longest, episodes |
|---|---|---|
| kellermann | 2.2%, 45; 17, 1 | 2.2%, 45; 17, 1 |
| milo | 6.5%, 27; 6.2, 4 | 6.5%, 27; 6.2, 4 |
| walther | 8.7%, 12; 3.6, 5 | 8.7%, 12; 3.6, 5 |
| rg_cav | 8.7%, 40; 14, 2 | 8.7%, 40; 14, 2 |
| dhautpoul | 21.7%, 12; 2.6, 6 | 21.7%, 12; 2.6, 6 |
| rg_inf | 23.9%, 27; 6.2, 5 | 23.9%, 27; 6.2, 5 |
| guard_inf | 39.1%, 10; 0, 7 | 39.1%, 10; 0, 7 |
| guard_cav | 47.8%, 12; 0, 4 | 47.8%, 12; 0, 4 |
| nansouty | 56.5%, 9; 5.4, 5 | 56.5%, 9; 5.4, 5 |
| suchet | 69.6%, 2; 1.2, 7 | 69.6%, 2; 1.2, 7 |
| sthilaire | 78.3%, 2; 0.6, 5 | 78.3%, 2; 1.2, 5 |
| friant | 78.3%, 2; 0.6, 5 | 78.3%, 2; 1.2, 5 |
| rivaud | 78.3%, 2; 1.2, 5 | 78.3%, 2; 1.2, 5 |
| legrand | 82.6%, 2; 1.2, 4 | 82.6%, 2; 1.2, 4 |
| drouet | 82.6%, 2; 1.2, 4 | 82.6%, 2; 1.2, 4 |
| vandamme | 87.0%, 2; 1.2, 3 | 87.0%, 2; 1.2, 3 |
| caffarelli | 87.0%, 2; 1.2, 3 | 87.0%, 2; 1.2, 3 |
| prz | 87.0%, 2; 1.2, 3 | 87.0%, 2; 1.2, 3 |
| bourcier | 91.3%, 2; 1.2, 2 | 91.3%, 2; 1.2, 2 |
| c_gren | 91.3%, 2; 0.6, 2 | 91.3%, 2; 1.2, 2 |
| lang | 91.3%, 2; 1.2, 2 | 91.3%, 2; 1.2, 2 |
| ahq | 95.7%, 2; 1.2, 1 | 95.7%, 2; 1.2, 1 |
| kienmayer | 95.7%, 2; 0.6, 1 | 95.7%, 2; 1.2, 1 |
| dok | 95.7%, 2; 1.2, 1 | 95.7%, 2; 1.2, 1 |
| lich | 95.7%, 2; 1.2, 1 | 95.7%, 2; 1.2, 1 |
| bag | 95.7%, 2; 0.6, 1 | 95.7%, 2; 1.2, 1 |
| gqg | 100.0%, 0; 0, 0 | 100.0%, 0; 0, 0 |
| kollo | 100.0%, 0; 0, 0 | 100.0%, 0; 0, 0 |

## Real time (nogl) against hybrid-0900-1h (driver, 30 frames a second), clock 09:00-10:00

Real frames 157 (interval p10/median/p90 89/157/234 ms, passes 60), driver frames 537 (passes 54). Formation-frames drawn: real 2894/4396 (65.8%), driver 9684/15036 (64.4%); frames paired by clock 54, identical in every formation 0 (360 formation-frame differences).

| formation | real: share, longest (frames; clock min), episodes | driver: share, longest, episodes |
|---|---|---|
| milo | 13.4%, 135; 47.38, 2 | 0.0%, 537; 59.5, 1 |
| rg_cav | 3.8%, 151; 56.36, 1 | 8.6%, 190; 21.67, 4 |
| walther | 5.7%, 70; 20.67, 4 | 9.3%, 231; 28.5, 5 |
| dhautpoul | 9.6%, 88; 29.43, 5 | 10.8%, 161; 16.83, 5 |
| guard_cav | 14.0%, 81; 29.96, 8 | 13.0%, 271; 30, 6 |
| kellermann | 50.3%, 69; 29.87, 3 | 21.6%, 211; 25.17, 3 |
| guard_inf | 42.0%, 27; 14.32, 9 | 37.1%, 261; 30, 3 |
| nansouty | 42.0%, 53; 15.19, 7 | 38.9%, 106; 14.5, 7 |
| vandamme | 43.3%, 37; 14.67, 7 | 61.8%, 82; 8.83, 6 |
| rg_inf | 90.4%, 6; 3.13, 3 | 62.9%, 130; 11.67, 3 |
| suchet | 80.3%, 6; 0.19, 6 | 69.3%, 20; 3.33, 9 |
| drouet | 80.9%, 6; 2.98, 6 | 70.4%, 20; 0, 9 |
| rivaud | 84.7%, 6; 2.98, 5 | 71.9%, 20; 3.33, 8 |
| caffarelli | 84.7%, 6; 2.22, 6 | 73.9%, 20; 0, 8 |
| sthilaire | 51.6%, 28; 6.8, 7 | 80.4%, 20; 3.33, 6 |
| friant | 82.2%, 5; 3, 7 | 81.0%, 20; 3.33, 6 |
| legrand | 75.2%, 6; 0.19, 8 | 82.3%, 20; 3.33, 5 |
| bourcier | 83.4%, 6; 3.51, 5 | 83.4%, 20; 3.33, 5 |
| lich | 93.0%, 4; 2.4, 3 | 85.3%, 20; 3.1, 5 |
| lang | 87.9%, 5; 2, 5 | 86.2%, 18; 1.5, 5 |
| c_gren | 79.0%, 6; 0.19, 7 | 89.8%, 20; 3.33, 3 |
| prz | 84.1%, 6; 3.13, 5 | 91.2%, 20; 3.33, 3 |
| kienmayer | 94.9%, 5; 2, 2 | 93.3%, 20; 3.1, 2 |
| kollo | 76.4%, 25; 13.65, 4 | 94.6%, 18; 3, 2 |
| gqg | 96.2%, 3; 0, 2 | 95.7%, 12; 0, 2 |
| dok | 98.1%, 3; 1.8, 1 | 96.6%, 18; 3, 1 |
| ahq | 98.1%, 3; 1.8, 1 | 96.8%, 17; 2.83, 1 |
| bag | 98.1%, 3; 1.8, 1 | 97.0%, 16; 2.67, 1 |

## Real time (glVs30) against hybrid-0900-1h (driver, 30 frames a second), clock 09:00-09:17

Real frames 46 (interval p10/median/p90 14955/26727/35114 ms, passes 46), driver frames 162 (passes 16). Formation-frames drawn: real 873/1288 (67.8%), driver 2733/4536 (60.3%); frames paired by clock 20, identical in every formation 0 (113 formation-frame differences).

| formation | real: share, longest (frames; clock min), episodes | driver: share, longest, episodes |
|---|---|---|
| milo | 6.5%, 27; 6.2, 4 | 0.0%, 162; 17, 1 |
| kellermann | 2.2%, 45; 17, 1 | 9.9%, 146; 14.33, 1 |
| walther | 8.7%, 12; 3.6, 5 | 9.9%, 126; 14.5, 2 |
| rg_cav | 8.7%, 40; 14, 2 | 9.9%, 146; 14.33, 1 |
| nansouty | 56.5%, 9; 5.4, 5 | 12.3%, 106; 14.5, 3 |
| guard_cav | 47.8%, 12; 0, 4 | 13.0%, 75; 2.51, 2 |
| dhautpoul | 21.7%, 12; 2.6, 6 | 23.5%, 82; 10.5, 3 |
| rg_inf | 23.9%, 27; 6.2, 5 | 35.2%, 86; 4.33, 2 |
| rivaud | 78.3%, 2; 1.2, 5 | 42.0%, 20; 3.33, 5 |
| suchet | 69.6%, 2; 1.2, 7 | 54.3%, 20; 3.33, 4 |
| caffarelli | 87.0%, 2; 1.2, 3 | 57.4%, 20; 0, 4 |
| drouet | 82.6%, 2; 1.2, 4 | 58.0%, 20; 0, 4 |
| sthilaire | 78.3%, 2; 0.6, 5 | 59.9%, 18; 3, 4 |
| friant | 78.3%, 2; 0.6, 5 | 66.7%, 20; 3.33, 3 |
| vandamme | 87.0%, 2; 1.2, 3 | 72.8%, 20; 1.83, 3 |
| prz | 87.0%, 2; 1.2, 3 | 77.8%, 20; 3.33, 2 |
| legrand | 82.6%, 2; 1.2, 4 | 78.4%, 20; 3.33, 2 |
| lang | 91.3%, 2; 1.2, 2 | 80.9%, 16; 2.67, 2 |
| c_gren | 91.3%, 2; 0.6, 2 | 86.4%, 16; 2.67, 2 |
| bourcier | 91.3%, 2; 1.2, 2 | 88.9%, 18; 3, 1 |
| dok | 95.7%, 2; 1.2, 1 | 88.9%, 18; 3, 1 |
| ahq | 95.7%, 2; 1.2, 1 | 89.5%, 17; 2.83, 1 |
| kienmayer | 95.7%, 2; 0.6, 1 | 90.1%, 16; 2.67, 1 |
| bag | 95.7%, 2; 0.6, 1 | 90.1%, 16; 2.67, 1 |
| lich | 95.7%, 2; 1.2, 1 | 91.4%, 14; 2.33, 1 |
| gqg | 100.0%, 0; 0, 0 | 100.0%, 0; 0, 0 |
| guard_inf | 39.1%, 10; 0, 7 | 100.0%, 0; 0, 0 |
| kollo | 100.0%, 0; 0, 0 | 100.0%, 0; 0, 0 |

## Real time (noglMatched) against hybrid-0900-157 (driver, frames 157 ms apart: the no-draw real-time run's median), clock 09:00-10:00

Real frames 157 (interval p10/median/p90 89/157/234 ms, passes 60), driver frames 150 (passes 50). Formation-frames drawn: real 2894/4396 (65.8%), driver 2816/4200 (67.0%); frames paired by clock 46, identical in every formation 1 (270 formation-frame differences).

| formation | real: share, longest (frames; clock min), episodes | driver: share, longest, episodes |
|---|---|---|
| walther | 5.7%, 70; 20.67, 4 | 11.3%, 92; 35.2, 3 |
| dhautpoul | 9.6%, 88; 29.43, 5 | 14.0%, 49; 19.4, 7 |
| rg_cav | 3.8%, 151; 56.36, 1 | 14.7%, 98; 38.8, 3 |
| milo | 13.4%, 135; 47.38, 2 | 20.0%, 105; 33, 3 |
| guard_cav | 14.0%, 81; 29.96, 8 | 22.0%, 45; 17, 8 |
| nansouty | 42.0%, 53; 15.19, 7 | 40.7%, 27; 14.82, 6 |
| vandamme | 43.3%, 37; 14.67, 7 | 43.3%, 45; 16.16, 6 |
| kellermann | 50.3%, 69; 29.87, 3 | 57.3%, 58; 24.8, 2 |
| suchet | 80.3%, 6; 0.19, 6 | 64.7%, 6; 3.6, 9 |
| drouet | 80.9%, 6; 2.98, 6 | 66.0%, 6; 3.6, 9 |
| guard_inf | 42.0%, 27; 14.32, 9 | 66.0%, 21; 12.59, 6 |
| c_gren | 79.0%, 6; 0.19, 7 | 73.3%, 6; 3.6, 7 |
| rivaud | 84.7%, 6; 2.98, 5 | 76.0%, 6; 3.6, 6 |
| lich | 93.0%, 4; 2.4, 3 | 76.0%, 6; 3.6, 7 |
| friant | 82.2%, 5; 3, 7 | 77.3%, 6; 3.6, 7 |
| bourcier | 83.4%, 6; 3.51, 5 | 77.3%, 6; 3.6, 6 |
| sthilaire | 51.6%, 28; 6.8, 7 | 80.7%, 6; 3.6, 5 |
| lang | 87.9%, 5; 2, 5 | 84.0%, 6; 3.6, 5 |
| caffarelli | 84.7%, 6; 2.22, 6 | 84.7%, 6; 3.6, 4 |
| legrand | 75.2%, 6; 0.19, 8 | 85.3%, 6; 3.6, 4 |
| rg_inf | 90.4%, 6; 3.13, 3 | 85.3%, 9; 1.6, 3 |
| prz | 84.1%, 6; 3.13, 5 | 89.3%, 6; 3.6, 3 |
| kienmayer | 94.9%, 5; 2, 2 | 92.7%, 6; 2.76, 2 |
| gqg | 96.2%, 3; 0, 2 | 93.3%, 5; 0, 2 |
| kollo | 76.4%, 25; 13.65, 4 | 93.3%, 5; 3, 3 |
| ahq | 98.1%, 3; 1.8, 1 | 96.0%, 6; 3.6, 1 |
| dok | 98.1%, 3; 1.8, 1 | 96.0%, 6; 3.6, 1 |
| bag | 98.1%, 3; 1.8, 1 | 96.7%, 5; 3, 1 |

## Real time (driverSlowVs30) against hybrid-0900-1h (driver, 30 frames a second); 'real' here is the driver at 1,000 ms frames, clock 09:00-10:00

Real frames 150 (interval p10/median/p90 0/0/0 ms, passes 150), driver frames 537 (passes 54). Formation-frames drawn: real 2901/4200 (69.1%), driver 9684/15036 (64.4%); frames paired by clock 62, identical in every formation 1 (317 formation-frame differences).

| formation | real: share, longest (frames; clock min), episodes | driver: share, longest, episodes |
|---|---|---|
| milo | 2.0%, 131; 48.6, 4 | 0.0%, 537; 59.5, 1 |
| rg_cav | 2.7%, 144; 56.4, 2 | 8.6%, 190; 21.67, 4 |
| walther | 4.0%, 92; 35.2, 6 | 9.3%, 231; 28.5, 5 |
| dhautpoul | 10.7%, 51; 15, 10 | 10.8%, 161; 16.83, 5 |
| guard_cav | 23.3%, 47; 18.2, 8 | 13.0%, 271; 30, 6 |
| kellermann | 12.7%, 67; 22.8, 3 | 21.6%, 211; 25.17, 3 |
| guard_inf | 17.3%, 49; 19.4, 12 | 37.1%, 261; 30, 3 |
| nansouty | 64.0%, 16; 9.46, 11 | 38.9%, 106; 14.5, 7 |
| vandamme | 68.7%, 13; 7.38, 9 | 61.8%, 82; 8.83, 6 |
| rg_inf | 64.0%, 35; 11, 6 | 62.9%, 130; 11.67, 3 |
| suchet | 85.3%, 2; 1.2, 11 | 69.3%, 20; 3.33, 9 |
| drouet | 92.0%, 2; 1.2, 6 | 70.4%, 20; 0, 9 |
| rivaud | 81.3%, 2; 1.2, 14 | 71.9%, 20; 3.33, 8 |
| caffarelli | 93.3%, 2; 1.2, 5 | 73.9%, 20; 0, 8 |
| sthilaire | 68.7%, 14; 5.6, 9 | 80.4%, 20; 3.33, 6 |
| friant | 89.3%, 2; 1.2, 8 | 81.0%, 20; 3.33, 6 |
| legrand | 93.3%, 2; 1.2, 5 | 82.3%, 20; 3.33, 5 |
| bourcier | 93.3%, 2; 1.2, 5 | 83.4%, 20; 3.33, 5 |
| lich | 94.7%, 2; 1.2, 4 | 85.3%, 20; 3.1, 5 |
| lang | 93.3%, 2; 1.2, 5 | 86.2%, 18; 1.5, 5 |
| c_gren | 96.0%, 2; 1.2, 3 | 89.8%, 20; 3.33, 3 |
| prz | 96.0%, 2; 1.2, 3 | 91.2%, 20; 3.33, 3 |
| kienmayer | 97.3%, 2; 1.2, 2 | 93.3%, 20; 3.1, 2 |
| kollo | 97.3%, 2; 1.2, 2 | 94.6%, 18; 3, 2 |
| gqg | 97.3%, 2; 0, 2 | 95.7%, 12; 0, 2 |
| dok | 98.7%, 2; 1.2, 1 | 96.6%, 18; 3, 1 |
| ahq | 98.7%, 2; 1.2, 1 | 96.8%, 17; 2.83, 1 |
| bag | 98.7%, 2; 1.2, 1 | 97.0%, 16; 2.67, 1 |
