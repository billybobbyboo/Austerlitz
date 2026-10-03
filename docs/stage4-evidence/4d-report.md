# Stage 4D: pacing, against the build before it (the Stage 4C build (md5 622634ef37c67e5ae9e9a921228ab0c7, main at 71ffd88, #29))

`node tools/stage4/report-4d.js` on each build.

## Section D.2's table, as built

Study at 1600 x 900, the default factor, Follow on, played from 04:00 to 18:00 in 50 ms steps of real time. Before 4D: the phase glide (Stage 3D); 4D: the continuous follow and the dwells.

| build @ speed | the day, s | minutes with every live event in the free rectangle | live event-minutes in it | target's speed px/s: median / 95th / largest | floor clamps; lowest clearance | drops every 10 min: mean / largest |
|---|---|---|---|---|---|---|
| before @0.5x | 168 | 69.9% | 75.0% | 0 / 0 / 24676.8 | 0; 36.6 | 5.84 / 16 |
| 4D @0.5x | 210 | 86.4% | 92.1% | 15.5 / 100.9 / 150 | 0; 26.9 | 6.29 / 19 |
| before @1x | 84 | 69.9% | 75.0% | 0 / 0 / 24676.8 | 0; 36.6 | 5.84 / 16 |
| 4D @1x | 126 | 86.7% | 92.2% | 31.3 / 139.1 / 150 | 0; 27.4 | 6.34 / 18 |

## The day's length

Computed from the dwells as built (the self-test and `runtime-test.js` check a dry run against it). 22 distinct event starts; the one at 04:00 is where Play begins and does not dwell.

| speed | 0.5x | 1x | 2x | 4x |
|---|---|---|---|---|
| the day, s | 210 | 126 | 83.5 | 61.3 |

| phase | minutes | seconds at ½× (with its dwells) | dwells |
|---|---|---|---|
| 0 Deployment | 180 | 38 | 1 |
| 1 Telnitz | 60 | 16 | 2 |
| 2 Sokolnitz | 45 | 15 | 3 |
| 3 The Pratzen | 45 | 15 | 3 |
| 4 Pratzeberg | 60 | 14 | 1 |
| 5 Olmutz road | 45 | 13 | 2 |
| 6 The Guard | 90 | 26 | 4 |
| 7 The wheel | 105 | 25 | 2 |
| 8 The ponds | 150 | 36 | 3 |
| 9 Reckoning | 60 | 12 | 0 |

## The draw-on

Each derived arrow at 20 clocks inside its legs: the largest distance of its drawn end from the formation (units; the self-test's limit 0.5).

| phase | arrow | leg | clocks | length | worst |
|---|---|---|---|---|---|
| 0 | V Column counter-marches north | lich 0 2 | 04:00-08:00 | 18.5 | 0 |
| 1 | Kienmayer | kienmayer 1 2 | 07:00-08:00 | 7.3 | 0 |
| 1 | Friant's approach march | friant 1 2 | 07:00-08:30 | 16 | 0 |
| 2 | Liechtenstein crosses the front | lich 2 3 | 08:00-08:45 | 11.5 | 0 |
| 2 | Friant retakes Telnitz | friant 1 2 | 07:00-08:30 | 16 | 0 |
| 3 | Saint-Hilaire | sthilaire 2 3 | 08:45-09:15 | 39.3 | 0.086 |
| 3 | Vandamme | vandamme 2 3 | 08:45-09:14 | 38 | 0.061 |
| 4 | Caffarelli | caffarelli 0 5 | 09:30-10:30 | 28.2 | 0 |
| 4 | Suchet | suchet 0 5 | 09:30-10:30 | 12.7 | 0 |
| 4 | Bagration | bag 0 5 | 09:30-10:30 | 30 | 0 |
| 5 | Nansouty's cuirassiers | nansouty 5 6 | 10:30-11:15 | 15.1 | 0 |
| 6 | Drouet forms line | drouet 6 7 | 11:15-12:45 | 12.7 | 0 |
| 7 | Saint-Hilaire wheels south | sthilaire 6 7 | 13:00-14:00 | 26 | 0 |
| 7 | Vandamme wheels south | vandamme 6 8 | 13:00-14:30 | 71.7 | 0 |
| 7 | Przybyszewski's breakout | prz 7 8 | 14:10-14:30 | 14.5 | 0 |
| 8 | Vandamme takes the height | vandamme 8 9 | 14:30-17:00 | 12.4 | 0 |
| 8 | Bagration withdraws on Rausnitz | bag 7 9 | 16:30-17:00 | 34.9 | 0 |

## The harness views

Derived arrows drawn whole / in part / not yet; the map layer's drops against the view's limit.

| view | before: arrows; drops | 4D: arrows; drops | limit |
|---|---|---|---|
| overview-field | 3 / 0 / 0; 6 | 0 / 0 / 3; 6 | 11 |
| overview-plan | 3 / 0 / 0; 4 | 0 / 0 / 3; 4 | 12 |
| close-sokolnitz | 2 / 0 / 0; 4 | 0 / 2 / 0; 4 | 18 |
| staff-paper | 3 / 0 / 0; 3 | 0 / 0 / 3; 3 | 13 |
| pratzen-low | 3 / 0 / 0; 5 | 0 / 3 / 0; 5 | 13 |
| selected-formation | 3 / 0 / 0; 4 | 0 / 0 / 3; 4 | 4 |
| watch-selected | 3 / 0 / 0; 3 | 0 / 3 / 0; 3 | 8 |
| hybrid-dimmed | 3 / 0 / 0; 8 | 0 / 3 / 0; 8 | 13 |
| pratzen-low-1x | 3 / 0 / 0; 4 | 0 / 3 / 0; 4 | 12 |
| pratzen-low-10x | 3 / 0 / 0; 3 | 0 / 3 / 0; 3 | 8 |
| paper-north-up | 3 / 0 / 0; 12 | 0 / 0 / 3; 12 | 20 |
| paper-close | 2 / 0 / 0; 1 | 0 / 2 / 0; 1 | 2 |
| paper-drawer | 3 / 0 / 0; 1 | 0 / 0 / 3; 1 | 5 |
| ph8-overview-study | 2 / 0 / 0; 3 | 0 / 1 / 1; 3 | 7 |
| ph8-overview-watch | 2 / 0 / 0; 3 | 0 / 1 / 1; 3 | 7 |
