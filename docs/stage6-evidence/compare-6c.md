# Stage 6C: the figures by class against the build before them

`node tools/stage6/compare-6c.js`, run 2026-10-05. Before: `archive/stage6b-7fc0f6c3.html` (Stage 6B); after: `austerlitz-command-map.html` (Stage 6C). 1600 x 900, software WebGL (the world pass's times compare only with one another). Solid near-black: the share of 8 x 8 blocks at least 90% near-black outside the panels (Stage 0 limit 0.0005). Map text: the lowest contrast as rendered and the number below AA. Drops: the map layer's. Smoke and confidence: their shares of the free rectangle (measure.js); the confidence marks against the view drawn with no mark (CONF.none on 6C), and on 6C the share of decision 107's side footprint, drawn when Position confidence is off. The world pass: the median of 15 frames, and the draw calls of one frame. Changed: the share of the free rectangle that differs between the builds.

| view | figures | solid black before / after | mean luminance before / after | text min (below AA) before / after | drops before / after | confidence share before / after | side footprint (after) | smoke share before / after | world pass ms before / after | draw calls before / after | changed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| overview-field | 2923 | 0 / 0 | 77.2 / 77.2 | 8.32 (0) / 8.32 (0) | 6 / 6 | 0.0431 / 0.0433 | 0.0281 | 0.0853 / 0.0853 | 9.5 / 8.9 | 653 / 815 | 0.0184 |
| overview-plan | 2940 | 0 / 0 | 53.8 / 53.8 | 8.03 (0) / 8.03 (0) | 4 / 4 | 0.037 / 0.037 | 0.0252 | 0.0136 / 0.0136 | 5.6 / 12.3 | 653 / 815 | 0.0037 |
| close-sokolnitz | 1462 | 0 / 0 | 126.5 / 126.3 | 7.67 (0) / 7.68 (0) | 4 / 4 | 0.0927 / 0.0937 | 0.0519 | 0.24 / 0.24 | 6.4 / 8.3 | 614 / 776 | 0.0416 |
| pratzen-low | 1077 | 0.0002 / 0.0002 | 90.8 / 90.5 | 8.26 (0) / 8.26 (0) | 4 / 4 | 0.0997 / 0.1009 | 0.0437 | 0.24 / 0.24 | 5.4 / 7.9 | 584 / 746 | 0.059 |
| selected-formation | 1054 | 0 / 0 | 64.4 / 64.3 | 7.57 (0) / 7.57 (0) | 4 / 4 | 0.1503 / 0.1509 | 0.0914 | 0.0412 / 0.0412 | 7.5 / 10.4 | 586 / 748 | 0.0306 |
| watch-selected | 1271 | 0.0001 / 0.0001 | 57.4 / 57.4 | 7.59 (0) / 7.59 (0) | 4 / 4 | 0.1519 / 0.1523 | 0.0779 | 0.0222 / 0.0222 | 6.4 / 9.3 | 566 / 728 | 0.0241 |
| hybrid-dimmed | 1678 | 0.00005 / 0.00005 | 62 / 61.9 | 6.49 (0) / 6.49 (0) | 8 / 8 | 0.1456 / 0.146 | 0.0549 | 0.0237 / 0.0237 | 8.3 / 8.3 | 566 / 728 | 0.0166 |
| ph8-overview-study | 2906 | 0 / 0 | 44.4 / 44.4 | 8.27 (0) / 8.27 (0) | 3 / 3 | 0.0332 / 0.0333 | 0.025 | 0.0075 / 0.0075 | 7 / 11.9 | 635 / 797 | 0.0033 |
| ph8-overview-watch | 2906 | 0 / 0 | 44.6 / 44.6 | 8.17 (0) / 8.17 (0) | 3 / 3 | 0.0359 / 0.0359 | 0.0267 | 0.0077 / 0.0077 | 9 / 6.3 | 635 / 797 | 0.0039 |
| eye-zuran | 172 | 0 / 0 | 117.5 / 117.5 | 7.57 (0) / 7.57 (0) | 5 / 5 | 0.0004 / 0.06 | 0.06 | 0.051 / 0.051 | 2.7 / 1.8 | 197 / 205 | 0.0015 |
| plans-overview | 2940 | 0 / 0 | 54 / 54 | 8.52 (0) / 8.52 (0) | 11 / 11 | 0.0235 / 0.0235 | 0.0155 | 0 / 0 | 9.1 / 7.3 | 677 / 839 | 0.0013 |
| pratzen-orbit-min | 1012 | 0.0003 / 0.00015 | 76.5 / 75.2 | 11.72 (0) / 11.73 (0) | 1 / 1 | 0.0307 / 0.0325 | 0.0252 | 0.24 / 0.24 | 5.3 / 10.1 | 580 / 742 | 0.2045 |
| pratzen-low-1x | 0 | 0 / 0 | 75.3 / 75.3 | 8.49 (0) / 8.49 (0) | 4 / 4 | - / - | - | 0.24 / 0.24 | 1.1 / 1.2 | 160 / 160 | 0 |
| pratzen-low-10x | 878 | 0 / 0 | 110.4 / 110.3 | 8 (0) / 7.68 (0) | 3 / 3 | 0.0571 / 0.0575 | 0.0327 | 0.24 / 0.24 | 5.4 / 8.6 | 585 / 747 | 0.022 |
| eye-zuran-1x | 0 | 0 / 0 | 101.2 / 101.2 | 11.36 (0) / 11.36 (0) | 6 / 6 | - / - | - | 0.051 / 0.051 | 0.9 / 1.2 | 132 / 132 | 0 |
| overview-field@10.33x | 2912 | 0 / 0 | 88.1 / 88.1 | 7.95 (0) / 7.95 (0) | 7 / 7 | 0.0446 / 0.0447 | 0.0311 | 0.0859 / 0.0859 | 5.7 / 8.4 | 653 / 815 | 0.0162 |
| close-sokolnitz@10.33x | 1265 | 0 / 0 | 145.5 / 145.3 | 7.67 (0) / 7.69 (0) | 3 / 3 | 0.0904 / 0.091 | 0.0486 | 0.24 / 0.24 | 9.7 / 10.2 | 603 / 765 | 0.0255 |
| ph8-overview-watch@10.33x | 2906 | 0 / 0 | 52.7 / 52.7 | 8.17 (0) / 8.17 (0) | 3 / 3 | 0.0351 / 0.0351 | 0.0259 | 0.0076 / 0.0076 | 9.5 / 12.6 | 635 / 797 | 0.0034 |
| paper-north-up | 0 | 0 / 0 | 145.8 / 145.8 | 5.38 (0) / 5.38 (0) | 12 / 12 | - / - | - | - / - | 1 / 1.2 | 155 / 155 | 0 |
| paper-close | 0 | 0 / 0 | 192.2 / 192.2 | 5.1 (0) / 5.1 (0) | 1 / 1 | - / - | - | - / - | 0.8 / 0.9 | 105 / 105 | 0 |

## Coats as rendered: the closest pairs of formations of opposite sides (CIEDE2000)

Each formation's coats keyed in magenta (one render each), the pixels where they show read in the plain render. Expected to fall (decision 97): coats follow the sources, and side is carried by the symbology.

| view | before: pairs, closest three | after: pairs, closest three |
|---|---|---|
| overview-field | 70: santon-bag 21.7; santon-milo 22.8; suchet-bag 22.9 | 70: drouet-kamensky 16.2; drouet-prz 16.3; drouet-milo 16.5 |
| close-sokolnitz | 28: vandamme-prz 17; vandamme-milo 17.7; vandamme-lang 18.3 | 28: vandamme-prz 9.9; vandamme-milo 11.2; legrand-prz 12.7 |
| pratzen-low | 14: sthilaire-kamensky 30.9; sthilaire-ahq 31.2; vandamme-ahq 32 | 14: sthilaire-kamensky 23.1; vandamme-kamensky 24.9; vandamme-milo 26.6 |
| selected-formation | 20: rivaud-kamensky 24.1; drouet-kamensky 24.2; dhautpoul-kamensky 24.3 | 20: dhautpoul-kamensky 16.9; dhautpoul-milo 17.5; drouet-kamensky 17.9 |
| watch-selected | 30: walther-kamensky 28.2; sthilaire-kamensky 28.4; vandamme-kamensky 29.4 | 30: walther-ahq 3.6; walther-milo 5.7; walther-kamensky 10 |
| hybrid-dimmed | 12: sthilaire-kamensky 26.2; drouet-kamensky 26.9; drouet-rg_inf 27.3 | 12: sthilaire-kamensky 18.6; drouet-kamensky 20.2; sthilaire-milo 21.7 |
| pratzen-orbit-min | 10: caffarelli-lich 26.1; walther-lich 26.9; nansouty-lich 29.8 | 10: walther-lich 5.7; dhautpoul-lich 26.4; caffarelli-lich 26.6 |

## Every block's classes as drawn (after), with their grades (coat / legwear / headgear; "not settled" and "disputed" are drawn generic)

| block | role | class | units | figures | coat | legwear | headgear | cuirass | horses | grades |
|---|---|---|---|---|---|---|---|---|---|---|
| gqg | escort | fr_staff | 12 | 12 | dark blue | dark blue | bicorne | - | brown | A / A / A |
| heightguns | crew | fr_foot_art | 1 | 30 | dark blue | dark blue | generic | - | - | B / B / C |
| sthilaire | ranks | fr_light | 2 | 48 | dark blue | dark blue | shako | - | - | B / B / B |
| sthilaire | ranks | fr_line | 4 | 96 | dark blue | generic | bicorne | - | - | B / not settled / A |
| sthilaire | skirmish | fr_line | 0 | 16 | dark blue | generic | bicorne | - | - | B / not settled / A |
| sthilaire | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| vandamme | ranks | fr_light | 1 | 24 | dark blue | dark blue | shako | - | - | B / B / B |
| vandamme | ranks | fr_line | 5 | 120 | dark blue | generic | bicorne | - | - | B / not settled / A |
| vandamme | skirmish | fr_line | 0 | 16 | dark blue | generic | bicorne | - | - | B / not settled / A |
| vandamme | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| legrand | ranks | fr_line | 4 | 96 | dark blue | generic | bicorne | - | - | B / not settled / A |
| legrand | ranks | fr_light | 2 | 48 | dark blue | dark blue | shako | - | - | B / B / B |
| legrand | skirmish | fr_line | 0 | 16 | dark blue | generic | bicorne | - | - | B / not settled / A |
| legrand | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| friant | ranks | fr_line | 2 | 48 | dark blue | generic | bicorne | - | - | B / not settled / A |
| friant | ranks | fr_light | 1 | 24 | dark blue | dark blue | shako | - | - | B / B / B |
| friant | skirmish | fr_line | 0 | 16 | dark blue | generic | bicorne | - | - | B / not settled / A |
| friant | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| bourcier | ranks | fr_dragoon | 2 | 20 | green | white | metal helmet | - | brown | B / B / B |
| caffarelli | ranks | fr_light | 1 | 24 | dark blue | dark blue | shako | - | - | B / B / B |
| caffarelli | ranks | fr_line | 5 | 120 | dark blue | generic | bicorne | - | - | B / not settled / A |
| caffarelli | skirmish | fr_line | 0 | 16 | dark blue | generic | bicorne | - | - | B / not settled / A |
| caffarelli | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| suchet | ranks | fr_line | 5 | 120 | dark blue | generic | bicorne | - | - | B / not settled / A |
| suchet | skirmish | fr_line | 0 | 16 | dark blue | generic | bicorne | - | - | B / not settled / A |
| suchet | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| santon | ranks | fr_light | 2 | 48 | dark blue | dark blue | shako | - | - | B / B / B |
| santon | skirmish | fr_light | 0 | 16 | dark blue | dark blue | shako | - | - | B / B / B |
| santon | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| kellermann | ranks | fr_hussar2 | 1 | 10 | brown | sky blue | shako | - | brown | B / B / B |
| kellermann | ranks | fr_hussar4 | 1 | 10 | dark blue | dark blue | shako | - | brown | B / B / B |
| kellermann | ranks | fr_hussar5 | 1 | 10 | sky blue | sky blue | shako | - | brown | B / B / B |
| nansouty | ranks | fr_carabinier | 1 | 10 | generic | white | generic | - | brown | C / B / C |
| nansouty | ranks | fr_cuirassier | 1 | 10 | dark blue | white | metal helmet | metal | brown | B / B / B |
| dhautpoul | ranks | fr_cuirassier | 2 | 20 | dark blue | white | metal helmet | metal | brown | B / B / B |
| walther | ranks | fr_dragoon | 2 | 20 | green | white | metal helmet | - | brown | B / B / B |
| rivaud | ranks | fr_line | 5 | 120 | dark blue | generic | bicorne | - | - | B / not settled / A |
| rivaud | skirmish | fr_line | 0 | 16 | dark blue | generic | bicorne | - | - | B / not settled / A |
| rivaud | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| drouet | ranks | fr_light | 2 | 48 | dark blue | dark blue | shako | - | - | B / B / B |
| drouet | ranks | fr_line | 4 | 96 | dark blue | generic | bicorne | - | - | B / not settled / A |
| drouet | skirmish | fr_line | 0 | 16 | dark blue | generic | bicorne | - | - | B / not settled / A |
| drouet | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| guard_inf | ranks | fr_guard_gren | 1 | 24 | dark blue | white | bearskin | - | - | B / B / B |
| guard_inf | ranks | fr_guard_chass | 1 | 24 | dark blue | white | bearskin | - | - | B / B / B |
| guard_inf | ranks | it_guard | 1 | 24 | generic | generic | generic | - | - | not settled / not settled / not settled |
| guard_inf | skirmish | fr_guard_gren | 0 | 16 | dark blue | white | bearskin | - | - | B / B / B |
| guard_inf | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| guard_cav | ranks | fr_guard_grencav | 1 | 10 | dark blue | white | bearskin | - | black | B / B / B |
| guard_cav | ranks | fr_guard_chasscav | 1 | 10 | green | generic | generic | - | brown | B / C / C |
| guard_cav | ranks | fr_mameluke | 1 | 10 | generic | generic | turban | - | brown | B / B / B |
| c_gren | ranks | fr_gren_line | 2 | 48 | generic | generic | generic | - | - | C / not settled / disputed |
| c_gren | ranks | fr_gren_light | 3 | 72 | generic | generic | generic | - | - | C / C / disputed |
| c_gren | skirmish | fr_gren_light | 0 | 16 | generic | generic | generic | - | - | C / C / disputed |
| c_gren | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| ahq | escort | ru_staff | 12 | 12 | generic | generic | bicorne | - | brown | B / not settled / B |
| buxhowden | escort | ru_staff | 12 | 12 | generic | generic | bicorne | - | brown | B / not settled / B |
| kienmayer | ranks | at_jager | 1 | 24 | generic | generic | generic | - | - | not settled / not settled / not settled |
| kienmayer | ranks | at_grenz | 5 | 120 | generic | generic | generic | - | - | disputed / disputed / disputed |
| kienmayer | skirmish | at_grenz | 0 | 16 | generic | generic | generic | - | - | disputed / disputed / disputed |
| kienmayer | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| kienmayer | riders | at_chevauleger | 2 | 2 | generic | generic | crested helmet | - | brown | disputed / not settled / B |
| kienmayer | riders | at_hussar_hh | 2 | 2 | green | red | shako | - | brown | A / A / A |
| kienmayer | riders | at_hussar_szekler | 2 | 2 | blue | blue | shako | - | brown | A / A / A |
| kienmayer | riders | ru_cossack | 2 | 2 | dark blue | dark blue | fur cap | - | brown | B / B / B |
| dok | ranks | ru_jager | 1 | 24 | light green | light green | generic | - | - | B / B / disputed |
| dok | ranks | ru_musk | 5 | 120 | dark green | white | shako | - | - | B / B / A |
| dok | ranks | ru_gren | 1 | 24 | dark green | white | generic | - | - | B / B / C |
| dok | skirmish | ru_musk | 0 | 16 | dark green | white | shako | - | - | B / B / A |
| dok | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| lang | ranks | ru_jager | 1 | 24 | light green | light green | generic | - | - | B / B / disputed |
| lang | ranks | ru_musk | 6 | 144 | dark green | white | shako | - | - | B / B / A |
| lang | skirmish | ru_musk | 0 | 16 | dark green | white | shako | - | - | B / B / A |
| lang | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| kamensky | ranks | ru_gren | 2 | 48 | dark green | white | generic | - | - | B / B / C |
| kamensky | ranks | ru_musk | 2 | 48 | dark green | white | shako | - | - | B / B / A |
| kamensky | skirmish | ru_gren | 0 | 16 | dark green | white | generic | - | - | B / B / C |
| kamensky | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| prz | ranks | ru_musk | 7 | 168 | dark green | white | shako | - | - | B / B / A |
| prz | skirmish | ru_musk | 0 | 16 | dark green | white | shako | - | - | B / B / A |
| prz | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| milo | ranks | ru_musk | 3 | 72 | dark green | white | shako | - | - | B / B / A |
| milo | ranks | ru_gren | 1 | 24 | dark green | white | generic | - | - | B / B / C |
| milo | skirmish | ru_musk | 0 | 16 | dark green | white | shako | - | - | B / B / A |
| milo | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| kollo | ranks | at_line | 7 | 168 | white | generic | generic | - | - | B / C / disputed |
| kollo | skirmish | at_line | 0 | 16 | white | generic | generic | - | - | B / C / disputed |
| kollo | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| lich | ranks | at_cuirassier | 1 | 10 | white | generic | crested helmet | black | brown | B / not settled / B |
| lich | ranks | ru_cossack | 1 | 10 | dark blue | dark blue | fur cap | - | brown | B / B / B |
| lich | ranks | ru_uhlan | 1 | 10 | dark blue | dark blue | czapka | - | brown | B / B / B |
| lich | ranks | ru_dragoon | 2 | 20 | light green | generic | crested helmet | - | brown | B / not settled / B |
| lich | ranks | ru_hussar_elisavetgrad | 1 | 10 | straw | white | shako | - | brown | B / B / B |
| bag | ranks | ru_jager | 3 | 72 | light green | light green | generic | - | - | B / B / disputed |
| bag | ranks | ru_musk | 4 | 96 | dark green | white | shako | - | - | B / B / A |
| bag | skirmish | ru_musk | 0 | 16 | dark green | white | shako | - | - | B / B / A |
| bag | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| rg_inf | ranks | ru_guard_inf | 3 | 72 | dark green | white | shako | - | - | B / B / B |
| rg_inf | ranks | ru_guard_jager | 1 | 24 | light green | light green | shako | - | - | B / B / B |
| rg_inf | ranks | ru_gren | 2 | 48 | dark green | white | generic | - | - | B / B / C |
| rg_inf | skirmish | ru_guard_inf | 0 | 16 | dark green | white | shako | - | - | B / B / B |
| rg_inf | officers | generic | 1 | 2 | generic | generic | generic | - | brown | - |
| rg_cav | ranks | ru_chevalier | 1 | 10 | white | generic | crested helmet | - | brown | B / not settled / B |
| rg_cav | ranks | ru_guard_horse | 1 | 10 | white | generic | crested helmet | - | brown | B / not settled / B |
| rg_cav | ranks | ru_guard_hussar | 1 | 10 | dark blue | generic | shako | - | brown | B / not settled / B |
| rg_cav | ranks | ru_guard_cossack | 1 | 10 | generic | generic | generic | - | brown | C / C / C |

`compare-6c-sheet.jpg`: close-sokolnitz, pratzen-low, eye-zuran, pratzen-orbit-min, before and after.
