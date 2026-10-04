# Stage 6 Part A: prototype appearance, measured (austerlitz-command-map.html)

`node tools/stage6/appearance-probe.js`. P1: prototype coats; P2: coats, headgear, facings, cuirasses and flags (measurement values, not proposals). Solid near-black: the share of 8 x 8 blocks at least 90% near-black outside the panels (Stage 0 limit 0.0005). Map text: the lowest contrast as rendered and the number below AA. The confidence marks' share as rendered (`measure.js` `confShare`). Changed: the share of the free rectangle that differs from the view as it is.

Runs: run 1 (2026-10-04T22:11:06.949Z): 16 views, cut short by a container restart before close-sokolnitz@10.33x; run 2 (2026-10-04T23:11:45.587Z): close-sokolnitz@10.33x, ph8-overview-watch@10.33x, paper-north-up and paper-close, and four views again for the sheet (close-sokolnitz, pratzen-low, eye-zuran and pratzen-orbit-min: every threshold measure as in run 1, the parts within 0.0001 of the free rectangle, the world pass within 2.3 ms); run 3 (2026-10-04T23:29:24.709Z): pratzen-orbit-min again, with solid near-black for P2 without each part (P2 0.00233 here, 0.00228 in runs 1 and 2: the flags move); the views below are run 1's, run 2's four new views and run 3's pratzen-orbit-min (its keyed coats, run 1's: run 3 keyed none)

## Identity today, and the thresholds

| view | figures in view | formations with figures | named or countered | with a ground mark | solid black today / P1 / P2 | mean luminance today / P2 | text min today / P2 (below AA) | drops today / P2 | confidence share today / P2 | changed P1 / P2 |
|---|---|---|---|---|---|---|---|---|---|---|
| overview-field | 2923 | 18 | 13 | 18 | 0 / 0 / 0 | 77.2 / 77.4 | 8.32 / 8.32 (0 / 0) | 6 / 6 | 0.0431 / 0.0433 | 0.0109 / 0.0243 |
| overview-plan | 2940 | 28 | 4 | 28 | 0 / 0 / 0 | 53.8 / 53.9 | 8.03 / 8.03 (0 / 0) | 4 / 4 | 0.037 / 0.037 | 0.002 / 0.0062 |
| close-sokolnitz | 1462 | 13 | 9 | 13 | 0 / 0 / 0 | 126.5 / 126.7 | 7.67 / 7.67 (0 / 0) | 4 / 4 | 0.0927 / 0.0934 | 0.013 / 0.0487 |
| pratzen-low | 1077 | 9 | 9 | 9 | 0.0002 / 0.0002 / 0.0002 | 90.8 / 90.9 | 8.26 / 8.26 (0 / 0) | 4 / 4 | 0.0997 / 0.1007 | 0.0283 / 0.063 |
| selected-formation | 1054 | 9 | 9 | 9 | 0 / 0 / 0 | 64.4 / 64.7 | 7.57 / 7.57 (0 / 0) | 4 / 4 | 0.1503 / 0.1505 | 0.0199 / 0.0354 |
| watch-selected | 1271 | 11 | 8 | 11 | 0.0001 / 0.0001 / 0.0001 | 57.4 / 57.5 | 7.59 / 7.59 (0 / 0) | 4 / 4 | 0.1519 / 0.1525 | 0.0157 / 0.0271 |
| hybrid-dimmed | 1678 | 8 | 5 | 8 | 0.00005 / 0.00005 / 0.00005 | 62 / 62.2 | 6.49 / 6.49 (0 / 0) | 8 / 8 | 0.1456 / 0.1459 | 0.0109 / 0.0198 |
| ph8-overview-study | 2906 | 27 | 5 | 27 | 0 / 0 / 0 | 44.4 / 44.4 | 8.27 / 8.27 (0 / 0) | 3 / 3 | 0.0332 / 0.0333 | 0.0016 / 0.0062 |
| ph8-overview-watch | 2906 | 29 | 5 | 29 | 0 / 0 / 0 | 44.6 / 44.7 | 8.17 / 8.17 (0 / 0) | 3 / 3 | 0.0359 / 0.0358 | 0.002 / 0.0064 |
| eye-zuran | 172 | 0 | 0 | 0 | 0 / 0 / 0 | 117.5 / 117.5 | 7.57 / 7.57 (0 / 0) | 5 / 5 | 0.0004 / 0.0004 | 0.0002 / 0.0023 |
| plans-overview | 2940 | 24 | 3 | 24 | 0 / 0 / 0 | 54 / 54 | 8.52 / 8.52 (0 / 0) | 11 / 11 | 0.0235 / 0.0235 | 0.0005 / 0.0025 |
| pratzen-orbit-min | 1012 | 11 | 0 | 11 | 0.0003 / 0.0003 / 0.00233 | 76.5 / 77.3 | 11.72 / 11.77 (0 / 0) | 1 / 1 | 0.0307 / 0.0309 | 0.0544 / 0.1939 |
| pratzen-low-1x | 0 | 0 | 0 | 0 | 0 / - / - | 75.3 / - | 8.49 / - (0) | 4 / - | - | - |
| pratzen-low-10x | 878 | 7 | 7 | 7 | 0 / 0 / 0 | 110.4 / 110.5 | 8 / 7.94 (0 / 0) | 3 / 3 | 0.0571 / 0.0571 | 0.0137 / 0.0248 |
| eye-zuran-1x | 0 | 0 | 0 | 0 | 0 / - / - | 101.2 / - | 11.36 / - (0) | 6 / - | - | - |
| overview-field@10.33x | 2912 | 19 | 15 | 19 | 0 / 0 / 0 | 88.1 / 88.3 | 7.95 / 7.95 (0 / 0) | 7 / 7 | 0.0446 / 0.0448 | 0.0094 / 0.021 |
| close-sokolnitz@10.33x | 1265 | 10 | 8 | 10 | 0 / 0 / 0 | 145.5 / 145.5 | 7.67 / 7.67 (0 / 0) | 3 / 3 | 0.0904 / 0.0909 | 0.0096 / 0.0319 |
| ph8-overview-watch@10.33x | 2906 | 28 | 5 | 28 | 0 / 0 / 0 | 52.7 / 52.8 | 8.17 / 8.17 (0 / 0) | 3 / 3 | 0.0351 / 0.035 | 0.0018 / 0.0058 |
| paper-north-up | 0 | 0 | 0 | 0 | 0 / - / - | 145.8 / - | 5.38 / - (0) | 12 / - | - | - |
| paper-close | 0 | 0 | 0 | 0 | 0 / - / - | 192.2 / - | 5.1 / - (0) | 1 / - | - | - |

## What each part of P2 changes, as rendered (px over the free rectangle, and per figure in view; the median contrast of the changed pixels against the same pixels without the part)

| view | facings px (per figure, contrast) | headgear px (per figure, contrast) | flags px (contrast) | world pass ms today / P2 | a crisp side footprint for every formation: share (median contrast, share at 3:1) |
|---|---|---|---|---|---|
| overview-field | 11170 (3.82, 1.27) | 7918 (2.71, 1.22) | 1979 (1.21) | 7.8 / 14.6 | 0.028 (1.69, 0.104) |
| overview-plan | 6712 (2.28, 1.3) | 1178 (0.4, 1.16) | 236 (1.08) | 7.7 / 8.6 | 0.0251 (2.35, 0.227) |
| close-sokolnitz | 17070 (11.68, 1.2) | 23780 (16.27, 1.27) | 12832 (1.44) | 7.8 / 9.9 | 0.052 (1.12, 0) |
| pratzen-low | 27286 (25.33, 1.36) | 31367 (29.12, 1.27) | 11894 (1.5) | 7.8 / 8.3 | 0.0433 (2.02, 0.233) |
| selected-formation | 17039 (16.17, 1.53) | 12798 (12.14, 1.27) | 1935 (1.32) | 8 / 8.8 | 0.0909 (1.32, 0.035) |
| watch-selected | 16874 (13.28, 1.37) | 15251 (12, 1.25) | 2163 (1.33) | 6.6 / 10 | 0.0778 (1.34, 0.037) |
| hybrid-dimmed | 10992 (6.55, 1.35) | 8698 (5.18, 1.25) | 1721 (1.3) | 7.4 / 9.2 | 0.0549 (1.4, 0.053) |
| ph8-overview-study | 4136 (1.42, 1.23) | 591 (0.2, 1.15) | 74 (1.07) | 8.2 / 11.1 | 0.0251 (2.48, 0.273) |
| ph8-overview-watch | 6910 (2.38, 1.24) | 1288 (0.44, 1.17) | 234 (1.09) | 7.9 / 13.7 | 0.0267 (2.22, 0.271) |
| eye-zuran | 1418 (8.25, 1.04) | 473 (2.75, 1.19) | 827 (1.51) | 3.8 / 2.4 | 0.0004 (1.09, 0) |
| plans-overview | 1765 (0.6, 1.22) | 212 (0.07, 1.18) | 0 (1.15) | 7.6 / 10 | 0.0154 (1.44, 0) |
| pratzen-orbit-min | 52650 (52.03, 1.8) | 103131 (101.91, 1.22) | 59878 (1.41) | 6.7 / 12.1 | 0.0237 (1.58, 0.186) |
| pratzen-low-10x | 12424 (14.15, 1.48) | 11487 (13.08, 1.26) | 3047 (1.38) | 9.2 / 7.4 | 0.0323 (1.55, 0.109) |
| overview-field@10.33x | 10178 (3.5, 1.26) | 6785 (2.33, 1.22) | 1767 (1.24) | 7.4 / 11.6 | 0.0309 (1.61, 0.091) |
| close-sokolnitz@10.33x | 13669 (10.81, 1.11) | 11548 (9.13, 1.11) | 8838 (1.16) | 8.9 / 6.9 | 0.0485 (1.11, 0) |
| ph8-overview-watch@10.33x | 6093 (2.1, 1.27) | 1172 (0.4, 1.18) | 234 (1.08) | 5.3 / 6.4 | 0.0258 (2.14, 0.242) |

## Which part darkens a view: solid near-black of P2 and of P2 without each part (Stage 0 limit 0.0005)

| view | today | P1 | P2 | P2 without the facings | P2 with today's cylinder | P2 with today's flags |
|---|---|---|---|---|---|---|
| pratzen-orbit-min | 0.0003 | 0.0003 | 0.00233 | 0.00233 | 0.0005 | 0.00213 |

## Coats as rendered: the closest pairs of formations of opposite sides (CIEDE2000), today and in prototype P1

| view | formations keyed | pairs | closest today | closest in P1 |
|---|---|---|---|---|
| overview-field | 17 | 70 | santon-bag 21.6; santon-milo 22.7; santon-dok 22.8 | gqg-buxhowden 9; gqg-milo 9.2; gqg-dok 9.9 |
| close-sokolnitz | 11 | 28 | vandamme-prz 17; vandamme-milo 17.7; vandamme-lang 18.3 | vandamme-prz 7.6; vandamme-lang 8.8; sthilaire-prz 9.2 |
| pratzen-low | 9 | 14 | sthilaire-kamensky 30.8; sthilaire-ahq 31.2; vandamme-ahq 32.1 | sthilaire-ahq 19; sthilaire-kamensky 20.1; vandamme-ahq 20.1 |
| selected-formation | 9 | 20 | rivaud-kamensky 23.3; drouet-kamensky 23.4; dhautpoul-kamensky 23.5 | drouet-kamensky 14; nansouty-kamensky 14.1; dhautpoul-kamensky 14.1 |
| watch-selected | 11 | 30 | walther-kamensky 28.2; sthilaire-kamensky 28.3; vandamme-kamensky 29.4 | walther-milo 3.6; kellermann-milo 4.9; walther-kamensky 7.5 |
| hybrid-dimmed | 8 | 12 | sthilaire-kamensky 26.2; drouet-kamensky 26.9; drouet-rg_inf 27.3 | sthilaire-kamensky 15.9; drouet-rg_inf 16.7; drouet-kamensky 17.4 |
| eye-zuran | 0 | 0 |  |  |
| pratzen-orbit-min | 11 | 10 | caffarelli-lich 26.1; walther-lich 26.9; nansouty-lich 29.8 | walther-lich 4; kellermann-lich 10.8; caffarelli-lich 13.9 |

## Each keyed formation's coats as rendered (mean sRGB of the pixels where its coats show; px)

- **overview-field**: gqg (fr, 66 px) #4D6088 -> #4C5B50; sthilaire (fr, 266 px) #384160 -> #35313D; vandamme (fr, 113 px) #4D5C7D -> #4A4D5F; suchet (fr, 108 px) #4D5974 -> #4C4D5A; santon (fr, 80 px) #4E566C -> #4B4A54; drouet (fr, 192 px) #4C5671 -> #4A4953; c_gren (fr, 143 px) #47506A -> #44414D; ahq (al, 68 px) #5E6750 -> #564F42; buxhowden (al, 104 px) #536449 -> #4C4B3C; kienmayer (al, 371 px) #A29B8D -> #A6A095; dok (al, 734 px) #4A5743 -> #444338; lang (al, 176 px) #444B36 -> #3D362A; kamensky (al, 390 px) #424C39 -> #3B362C; prz (al, 392 px) #48533E -> #413E32; milo (al, 188 px) #555E4A -> #4E4C40; kollo (al, 450 px) #918779 -> #958D82; bag (al, 92 px) #5E6250 -> #595349
- **close-sokolnitz**: sthilaire (fr, 47 px) #6A7690 -> #686C77; vandamme (fr, 138 px) #616A7D -> #60646B; legrand (fr, 2260 px) #6E7995 -> #6A6E7A; friant (fr, 4787 px) #637397 -> #5F6477; buxhowden (al, 232 px) #8B978E -> #878C88; kienmayer (al, 70 px) #B5B5B2 -> #B8B9B8; dok (al, 1132 px) #96A09A -> #939795; lang (al, 874 px) #738275 -> #6C716C; kamensky (al, 575 px) #475748 -> #40433D; prz (al, 2137 px) #6B796E -> #656965; milo (al, 279 px) #586A5D -> #505551
- **pratzen-low**: sthilaire (fr, 2120 px) #2C3B65 -> #27263A; vandamme (fr, 3104 px) #334A7E -> #2D334E; ahq (al, 616 px) #3F5A43 -> #343A31; buxhowden (al, 1091 px) #49694E -> #3C4438; lang (al, 3111 px) #3B583D -> #2D3428; kamensky (al, 2256 px) #334930 -> #27291E; milo (al, 887 px) #566D56 -> #4C5146; kollo (al, 3254 px) #A49D8F -> #ABA59C; rg_inf (al, 997 px) #607560 -> #575C53
- **selected-formation**: sthilaire (fr, 4579 px) #31416B -> #2B2B3F; nansouty (fr, 70 px) #435278 -> #3E4051; dhautpoul (fr, 127 px) #445478 -> #414152; rivaud (fr, 608 px) #425377 -> #3D3F52; drouet (fr, 1047 px) #405075 -> #3A3C4E; ahq (al, 166 px) #506043 -> #413F30; kamensky (al, 822 px) #3B5044 -> #2F312D; milo (al, 993 px) #4C5E43 -> #3F4032; kollo (al, 2634 px) #A0998B -> #A6A198
- **watch-selected**: sthilaire (fr, 1743 px) #343C5A -> #2F2B38; vandamme (fr, 1140 px) #3F4D72 -> #3B3C4D; kellermann (fr, 77 px) #3A4C71 -> #3A4638; walther (fr, 209 px) #3A4969 -> #3A4436; rivaud (fr, 879 px) #405176 -> #3A3D4F; drouet (fr, 1155 px) #3E4F74 -> #383A4D; ahq (al, 387 px) #4E5F43 -> #433F31; kamensky (al, 2843 px) #384E34 -> #2B2E22; milo (al, 931 px) #4A6145 -> #3C3F32; lich (al, 750 px) #667B60 -> #5B5F53; rg_cav (al, 84 px) #627961 -> #BDBBB5
- **hybrid-dimmed**: sthilaire (fr, 1473 px) #343D5E -> #2F2C3B; drouet (fr, 456 px) #405074 -> #3A3D50; ahq (al, 87 px) #535F47 -> #494437; buxhowden (al, 527 px) #405A3B -> #333526; kamensky (al, 728 px) #374533 -> #2F2E26; milo (al, 244 px) #4F6047 -> #464639; kollo (al, 1308 px) #A9A090 -> #AFA79B; rg_inf (al, 157 px) #52644F -> #494B41
- **eye-zuran**: 
- **pratzen-orbit-min**: vandamme (fr, 7226 px) #2E4578 -> #282D47; caffarelli (fr, 1185 px) #657290 -> #61616C; kellermann (fr, 238 px) #475E8A -> #465642; nansouty (fr, 721 px) #546991 -> #4E5367; dhautpoul (fr, 707 px) #536992 -> #4E5267; walther (fr, 408 px) #627293 -> #616D5A; rivaud (fr, 2110 px) #495E87 -> #42455A; drouet (fr, 5985 px) #3B578D -> #323755; guard_inf (fr, 860 px) #3E5278 -> #373C51; guard_cav (fr, 1444 px) #465A81 -> #3F4459; lich (al, 1629 px) #71856C -> #676C60
