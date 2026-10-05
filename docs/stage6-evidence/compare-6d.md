# Stage 6D: the standards from the table against the build before them

`node tools/stage6/compare-6d.js`, run 2026-10-05. Before: the Stage 6C build (`07c61c82`, commit 04f8535); after: `austerlitz-command-map.html` (Stage 6D). 1600 x 900, software WebGL. Solid near-black: the share of 8 x 8 blocks at least 90% near-black outside the panels (Stage 0 limit 0.0005). Map text: the lowest contrast as rendered and the number below AA. Confidence: the marks' share against the view with no mark. Cloths: the standards whose cloth's centre lies in the free rectangle, and the cloth's width along its top edge and height along the staff, in px on screen (median / largest). Changed: the share of the free rectangle that differs between the builds.

| view | solid black before / after | mean luminance before / after | text min (below AA) before / after | drops before / after | confidence share before / after | smoke before / after | world pass ms before / after | draw calls before / after | cloths in view before / after | cloth width px (median, largest) before / after | cloth height px before / after | changed |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| overview-field | 0 / 0 | 77.2 / 77.2 | 8.32 (0) / 8.32 (0) | 6 / 6 | 0.0433 / 0.0417 | 0.0853 / 0.0853 | 9.1 / 9.7 | 815 / 839 | 55 / 142 | 6.3, 13.7 / 5.8, 14.5 | 5.3, 7.3 / 7.3, 11.9 | 0.0122 |
| overview-plan | 0 / 0 | 53.8 / 53.8 | 8.03 (0) / 8.03 (0) | 4 / 4 | 0.037 / 0.037 | 0.0136 / 0.0136 | 8.5 / 11.5 | 815 / 839 | 55 / 142 | 5.7, 6 / 5.6, 6.5 | 0.6, 1.2 / 0.6, 2.1 | 0.0009 |
| close-sokolnitz | 0 / 0 | 126.3 / 126 | 7.68 (0) / 7.68 (0) | 4 / 4 | 0.0937 / 0.0869 | 0.24 / 0.24 | 8.7 / 8.8 | 776 / 800 | 22 / 70 | 35.4, 74.8 / 31, 59 | 20.3, 34.6 / 31.9, 45.8 | 0.0436 |
| pratzen-low | 0.0002 / 0.0002 | 90.5 / 90.2 | 8.26 (0) / 8.26 (0) | 4 / 4 | 0.1009 / 0.0901 | 0.24 / 0.24 | 6.6 / 8.1 | 746 / 770 | 22 / 62 | 24.4, 64 / 24.2, 65.9 | 18.5, 32.7 / 25.6, 55.3 | 0.0424 |
| selected-formation | 0 / 0 | 64.3 / 64.3 | 7.57 (0) / 7.57 (0) | 4 / 4 | 0.1509 / 0.1476 | 0.0412 / 0.0412 | 7 / 8.2 | 748 / 772 | 16 / 45 | 13.5, 27.1 / 13.8, 21.8 | 8.9, 11.9 / 14, 16.1 | 0.0124 |
| watch-selected | 0.0001 / 0.0001 | 57.4 / 57.4 | 7.59 (0) / 7.59 (0) | 4 / 4 | 0.1523 / 0.1492 | 0.0222 / 0.0222 | 8.5 / 6.7 | 728 / 752 | 21 / 57 | 12, 28.9 / 12.9, 29 | 9.1, 12.4 / 9.5, 21.4 | 0.0104 |
| hybrid-dimmed | 0.00005 / 0.00005 | 61.9 / 61.9 | 6.49 (0) / 6.49 (0) | 8 / 8 | 0.146 / 0.1441 | 0.0237 / 0.0237 | 8.1 / 8.1 | 728 / 752 | 33 / 88 | 8.4, 22.2 / 8.2, 22.1 | 7.5, 10.8 / 10.4, 16.1 | 0.0079 |
| ph8-overview-study | 0 / 0 | 44.4 / 44.4 | 8.27 (0) / 8.27 (0) | 3 / 3 | 0.0333 / 0.0332 | 0.0075 / 0.0075 | 6.7 / 8.7 | 797 / 818 | 56 / 142 | 4.6, 4.7 / 2.7, 5.1 | 0.5, 2.3 / 0.7, 3.8 | 0.0008 |
| ph8-overview-watch | 0 / 0 | 44.6 / 44.6 | 8.17 (0) / 8.17 (0) | 3 / 3 | 0.0359 / 0.0358 | 0.0077 / 0.0077 | 9 / 8.5 | 797 / 818 | 56 / 142 | 5.8, 6 / 3.5, 6.5 | 0.7, 2.8 / 1, 4.8 | 0.0012 |
| eye-zuran | 0 / 0 | 117.5 / 117.2 | 7.57 (0) / 7.57 (0) | 5 / 5 | 0.06 / 0.0601 | 0.051 / 0.051 | 1.7 / 1.7 | 205 / 208 | 3 / 14 | 18, 20.4 / 17.8, 20.2 | 13.7, 14.5 / 23, 24.4 | 0.004 |
| plans-overview | 0 / 0 | 54 / 54 | 8.52 (0) / 8.52 (0) | 11 / 11 | 0.0235 / 0.0235 | 0 / 0 | 7.8 / 8.4 | 839 / 863 | 55 / 142 | 3.6, 3.8 / 3.6, 4.1 | 0.3, 0.7 / 0.4, 1.1 | 0.0003 |
| pratzen-orbit-min | 0.00015 / 0.00015 | 75.2 / 73.8 | 11.73 (0) / 12.58 (0) | 1 / 1 | 0.0325 / 0.0171 | 0.24 / 0.24 | 9.9 / 9.4 | 742 / 766 | 12 / 36 | 22.8, 250.8 / 13.2, 1281.3 | 30.6, 271.2 / 31.4, 1341.4 | 0.4405 |
| pratzen-low-1x | 0 / 0 | 75.3 / 75.3 | 8.49 (0) / 8.49 (0) | 4 / 4 | 0.1922 / 0.1922 | 0.24 / 0.24 | 1.1 / 1.2 | 160 / 160 | 0 / 0 | - / - | - / - | 0 |
| pratzen-low-10x | 0 / 0 | 110.3 / 110.1 | 7.68 (0) / 7.94 (0) | 3 / 3 | 0.0575 / 0.0559 | 0.24 / 0.24 | 6.9 / 9.2 | 747 / 771 | 16 / 46 | 24.3, 33.1 / 20.8, 35.5 | 16.2, 21 / 24.6, 36.2 | 0.0144 |
| eye-zuran-1x | 0 / 0 | 101.2 / 101.2 | 11.36 (0) / 11.36 (0) | 6 / 6 | 0 / 0 | 0.051 / 0.051 | 0.8 / 1 | 132 / 132 | 0 / 0 | - / - | - / - | 0 |
| overview-field@10.33x | 0 / 0 | 88.1 / 88.1 | 7.95 (0) / 7.95 (0) | 7 / 7 | 0.0447 / 0.0429 | 0.0859 / 0.0859 | 9 / 13.5 | 815 / 839 | 55 / 141 | 6.3, 13.6 / 5.8, 14.5 | 5.3, 7.3 / 7.3, 11.9 | 0.0111 |
| close-sokolnitz@10.33x | 0 / 0 | 145.3 / 145.4 | 7.69 (0) / 7.69 (0) | 3 / 3 | 0.091 / 0.086 | 0.24 / 0.24 | 8.4 / 8.8 | 765 / 789 | 19 / 56 | 37, 73.6 / 35.1, 57.8 | 22.3, 33.6 / 33.7, 44.2 | 0.0314 |
| ph8-overview-watch@10.33x | 0 / 0 | 52.7 / 52.7 | 8.17 (0) / 8.17 (0) | 3 / 3 | 0.0351 / 0.035 | 0.0076 / 0.0076 | 7.4 / 9.9 | 797 / 818 | 56 / 142 | 5.7, 5.9 / 3.5, 6.4 | 0.7, 2.8 / 1, 4.8 | 0.001 |
| paper-north-up | 0 / 0 | 145.8 / 145.8 | 5.38 (0) / 5.38 (0) | 12 / 12 | - / - | - / - | 1 / 1 | 155 / 155 | - / - | - / - | - / - | 0 |
| paper-close | 0 / 0 | 192.2 / 192.2 | 5.1 (0) / 5.1 (0) | 1 / 1 | - / - | - / - | 0.9 / 0.8 | 105 / 105 | - / - | - / - | - / - | 0 |

## Every block's standards (before: how many; after: per class, from the table)

Rule: per drawn battalion or squadron as the colours entry counts them (sourced), or KIT's lower bound on a disputed count (lower). Height: the sourced ratio over the man to his hat's top (1.635 units), or the provisional 1.6 over the figure's top. Cloth in units (width x height): at its measure against the staff, in its proportion at the provisional drop, or generic.

| block | before | after | class | colours entry | n | painting | rule | height | ratio / denominator | cloth (units) | finial (units) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| gqg | 1 | 0 | fr_staff | - | 0 | - | none: no source read shows colours carried | - | - | - | - |
| heightguns | 1 | 0 | fr_foot_art | - | 0 | - | none: the sources give none | - | - | - | - |
| sthilaire | 2 | 6 | fr_light | fr_eagle_inf | 2 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
|  |  |  | fr_line | fr_eagle_inf | 4 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
| vandamme | 2 | 6 | fr_light | fr_eagle_inf | 1 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
|  |  |  | fr_line | fr_eagle_inf | 5 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
| legrand | 2 | 6 | fr_line | fr_eagle_inf | 4 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
|  |  |  | fr_light | fr_eagle_inf | 2 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
| friant | 2 | 3 | fr_line | fr_eagle_inf | 2 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
|  |  |  | fr_light | fr_eagle_inf | 1 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
| bourcier | 1 | 2 | fr_dragoon | fr_eagle_cav | 2 | lozenge | 1 per sqn | provisional | 1.6 / 2.015 | 0.853 x 0.853 (its proportion) | 0.211 |
| caffarelli | 2 | 6 | fr_light | fr_eagle_inf | 1 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
|  |  |  | fr_line | fr_eagle_inf | 5 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
| suchet | 2 | 5 | fr_line | fr_eagle_inf | 5 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
| santon | 1 | 2 | fr_light | fr_eagle_inf | 2 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
| kellermann | 1 | 0 | fr_hussar2 | - | 0 | - | none: it is disputed whether they were carried in the field | - | - | - | - |
|  |  |  | fr_hussar4 | - | 0 | - | none: it is disputed whether they were carried in the field | - | - | - | - |
|  |  |  | fr_hussar5 | - | 0 | - | none: it is disputed whether they were carried in the field | - | - | - | - |
| nansouty | 1 | 2 | fr_carabinier | fr_eagle_cav | 1 | lozenge | 1 per sqn | provisional | 1.6 / 2.015 | 0.853 x 0.853 (its proportion) | 0.211 |
|  |  |  | fr_cuirassier | fr_eagle_cav | 1 | lozenge | 1 per sqn | provisional | 1.6 / 2.015 | 0.853 x 0.853 (its proportion) | 0.211 |
| dhautpoul | 1 | 2 | fr_cuirassier | fr_eagle_cav | 2 | lozenge | 1 per sqn | provisional | 1.6 / 2.015 | 0.853 x 0.853 (its proportion) | 0.211 |
| walther | 1 | 2 | fr_dragoon | fr_eagle_cav | 2 | lozenge | 1 per sqn | provisional | 1.6 / 2.015 | 0.853 x 0.853 (its proportion) | 0.211 |
| rivaud | 2 | 5 | fr_line | fr_eagle_inf | 5 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
| drouet | 2 | 6 | fr_light | fr_eagle_inf | 2 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
|  |  |  | fr_line | fr_eagle_inf | 4 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | 0.211 |
| guard_inf | 2 | 3 | fr_guard_gren | fr_guard_eagle | 1 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | - |
|  |  |  | fr_guard_chass | fr_guard_eagle | 1 | lozenge | 1 per bn | provisional | 1.6 / 1.981 | 0.853 x 0.853 (its proportion) | - |
|  |  |  | it_guard | it_guard_eagle | 1 | plain | 1 per bn | provisional | 1.6 / 1.981 | 1.462 x 0.853 (generic) | - |
| guard_cav | 1 | 2 | fr_guard_grencav | fr_guard_eagle_cav | 1 | lozenge | 1 per sqn | provisional | 1.6 / 2.015 | 0.853 x 0.853 (its proportion) | - |
|  |  |  | fr_guard_chasscav | fr_guard_eagle_cav | 1 | lozenge | 1 per sqn | provisional | 1.6 / 2.015 | 0.853 x 0.853 (its proportion) | - |
|  |  |  | fr_mameluke | - | 0 | - | none: the sources give none | - | - | - | - |
| c_gren | 2 | 0 | fr_gren_line | - | 0 | - | none: no source read shows colours carried | - | - | - | - |
|  |  |  | fr_gren_light | - | 0 | - | none: no source read shows colours carried | - | - | - | - |
| ahq | 1 | 0 | ru_staff | - | 0 | - | none: no source read shows colours carried | - | - | - | - |
| buxhowden | 1 | 0 | ru_staff | - | 0 | - | none: no source read shows colours carried | - | - | - | - |
| kienmayer | 2 | 8 | at_chevauleger | at_cav | 1 | ordinary | 1 per 2 sqn | provisional | 1.6 / 2.015 | 0.961 x 0.853 (its proportion) | - |
|  |  |  | at_hussar_hh | at_cav | 1 | ordinary | 1 per 2 sqn | provisional | 1.6 / 2.015 | 0.961 x 0.853 (its proportion) | - |
|  |  |  | at_hussar_szekler | at_cav | 1 | ordinary | 1 per 2 sqn | provisional | 1.6 / 2.015 | 0.961 x 0.853 (its proportion) | - |
|  |  |  | at_grenz | at_grenz | 5 | ordinary | 1 per bn | sourced | 1.7273 / 1.635 | 1.595 x 1.407 (its measure against the staff) | - |
|  |  |  | at_jager | - | 0 | - | none: no source read shows colours carried | - | - | - | - |
|  |  |  | ru_cossack | - | 0 | - | none: no source read shows colours carried | - | - | - | - |
| dok | 3 | 12 | ru_musk | ru_inf | 10 | plain | 2 per bn | sourced | 2.1525 / 1.635 | 1.451 x 1.451 (its measure against the staff) | 0.249 |
|  |  |  | ru_gren | ru_inf | 2 | plain | 2 per bn | sourced | 2.1525 / 1.635 | 1.451 x 1.451 (its measure against the staff) | 0.249 |
|  |  |  | ru_jager | - | 0 | - | none: the sources give none | - | - | - | - |
| lang | 3 | 12 | ru_musk | ru_inf | 12 | plain | 2 per bn | sourced | 2.1525 / 1.635 | 1.451 x 1.451 (its measure against the staff) | 0.249 |
|  |  |  | ru_jager | - | 0 | - | none: the sources give none | - | - | - | - |
| kamensky | 2 | 8 | ru_gren | ru_inf | 4 | plain | 2 per bn | sourced | 2.1525 / 1.635 | 1.451 x 1.451 (its measure against the staff) | 0.249 |
|  |  |  | ru_musk | ru_inf | 4 | plain | 2 per bn | sourced | 2.1525 / 1.635 | 1.451 x 1.451 (its measure against the staff) | 0.249 |
| prz | 3 | 14 | ru_musk | ru_inf | 14 | plain | 2 per bn | sourced | 2.1525 / 1.635 | 1.451 x 1.451 (its measure against the staff) | 0.249 |
| milo | 2 | 8 | ru_musk | ru_inf | 6 | plain | 2 per bn | sourced | 2.1525 / 1.635 | 1.451 x 1.451 (its measure against the staff) | 0.249 |
|  |  |  | ru_gren | ru_inf | 2 | plain | 2 per bn | sourced | 2.1525 / 1.635 | 1.451 x 1.451 (its measure against the staff) | 0.249 |
| kollo | 3 | 7 | at_line | at_inf | 7 | ordinary | lower bound, 1 per bn | sourced | 1.7273 / 1.635 | 1.595 x 1.407 (its measure against the staff) | - |
| lich | 1 | 3 | at_cuirassier | at_cav | 1 | ordinary | 1 per 2 sqn | provisional | 1.6 / 2.015 | 0.961 x 0.853 (its proportion) | - |
|  |  |  | ru_dragoon | ru_drag | 2 | plain | 1 per sqn | provisional | 1.6 / 2.015 | 0.853 x 0.853 (its proportion) | - |
|  |  |  | ru_cossack | - | 0 | - | none: no source read shows colours carried | - | - | - | - |
|  |  |  | ru_uhlan | - | 0 | - | none: no source read shows colours carried | - | - | - | - |
|  |  |  | ru_hussar_elisavetgrad | - | 0 | - | none: the sources give none | - | - | - | - |
| bag | 3 | 8 | ru_musk | ru_inf | 8 | plain | 2 per bn | sourced | 2.1525 / 1.635 | 1.451 x 1.451 (its measure against the staff) | 0.249 |
|  |  |  | ru_jager | - | 0 | - | none: the sources give none | - | - | - | - |
| rg_inf | 2 | 10 | ru_guard_inf | ru_guard_inf | 6 | plain | 2 per bn | sourced | 2 / 1.635 | 1.462 x 0.853 (generic) | - |
|  |  |  | ru_gren | ru_inf | 4 | plain | 2 per bn | sourced | 2.1525 / 1.635 | 1.451 x 1.451 (its measure against the staff) | 0.249 |
|  |  |  | ru_guard_jager | - | 0 | - | none: the sources give none | - | - | - | - |
| rg_cav | 1 | 0 | ru_chevalier | - | 0 | - | none: how many were carried is not established | - | - | - | - |
|  |  |  | ru_guard_horse | - | 0 | - | none: how many were carried is not established | - | - | - | - |
|  |  |  | ru_guard_hussar | - | 0 | - | none: the sources give none | - | - | - | - |
|  |  |  | ru_guard_cossack | - | 0 | - | none: how many were carried is not established | - | - | - | - |

`compare-6d-sheet.jpg`: close-sokolnitz, pratzen-low, eye-zuran, pratzen-orbit-min, before and after.
