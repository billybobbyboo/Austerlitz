# Stage 3D: per harness view, before (Stage 3C, 6ae3f8a7) and after (3D, 732e04c0)

From the two harness reports (`tools/visual/harness.js`), by `tools/stage3/report-3b.js`. Unobstructed: the Stage 2 section H measure at the case's viewport and at 1280 x 720. Dropped: the map layer's drops against `DROP_LIMIT`. Paper map: screen px per true km at the Pratzeberg.

| view | unobstructed, case viewport | at 1280 x 720 | dropped (limit) | paper map px/km | the dispatch | legend | legend over rail, dossier or timebar (px) | timebar px | layer pass ms | lowest map-text contrast |
|---|---|---|---|---|---|---|---|---|---|---|
| first-run | 61.5% → 61.5% | 49.0% → 49.0% | 9 → 5 (12) | - → - | hidden → hidden | closed → closed | 0 | 90.5 → 90.5 | 1.7 → 0.6 | 8.71 → 8.71 |
| overview-field | 70.4% → 70.4% | 62.9% → 62.9% | 6 → 6 (11) | - → - | Now tab → Now tab | closed → closed | 0 | 90.5 → 90.5 | 1 → 1.9 | 8.57 → 8.55 |
| overview-plan | 89.8% → 89.8% | 87.2% → 87.2% | 6 → 4 (12) | - → - | hidden → hidden | closed → closed | 0 | 92 → 92 | 0.6 → 0.5 | 8.76 → 8.42 |
| close-sokolnitz | 89.8% → 89.8% | 87.2% → 87.2% | 6 → 4 (18) | - → - | hidden → hidden | closed → closed | 0 | 92 → 92 | 1.1 → 0.8 | 7.94 → 8.01 |
| staff-paper | 70.4% → 70.4% | 62.9% → 62.9% | 3 → 3 (13) | 77.7 → 77.7 | Now tab → Now tab | closed → closed | 0 | 90.5 → 90.5 | 1.2 → 1.4 | 4.89 → 4.89 |
| pratzen-low | 89.8% → 89.8% | 87.2% → 87.2% | 5 → 5 (13) | - → - | hidden → hidden | closed → closed | 0 | 92 → 92 | 1.3 → 0.8 | 12.11 → 12.11 |
| pratzen-orbit-min | 89.8% → 89.8% | 87.2% → 87.2% | 18 → 7 (27) | - → - | hidden → hidden | closed → closed | 0 | 92 → 92 | 0.9 → 0.9 | null → null |
| selected-formation | 70.4% → 70.4% | 62.9% → 62.9% | 2 → 4 (4) | - → - | Now tab → Now tab | closed → closed | 0 | 90.5 → 90.5 | 1 → 1.1 | 12.49 → 7.91 |
| watch-selected | 88.0% → 88.0% | 83.3% → 83.3% | 4 → 3 (8) | - → - | hidden → hidden | closed → closed | 0 | 92 → 92 | 0.6 → 0.5 | 12.35 → 7.93 |
| hybrid-dimmed | 88.2% → 88.2% | 84.7% → 84.7% | 8 → 8 (13) | - → - | hidden → hidden | closed → closed | 0 | 92 → 92 | 0.9 → 1.2 | 6.49 → 6.49 |
| pratzen-low-1x | 89.8% → 89.8% | 87.2% → 87.2% | 4 → 4 (12) | - → - | hidden → hidden | closed → closed | 0 | 92 → 92 | 1.1 → 0.8 | 8.76 → 8.76 |
| pratzen-low-10x | 89.8% → 89.8% | 87.2% → 87.2% | 3 → 3 (8) | - → - | hidden → hidden | closed → closed | 0 | 92 → 92 | 0.7 → 0.8 | 7.84 → 7.83 |
| paper-north-up | 70.4% → 70.4% | 62.9% → 62.9% | 12 → 12 (20) | 28.5 → 28.5 | Now tab → Now tab | closed → closed | 0 | 90.5 → 90.5 | 1.7 → 0.8 | 5.38 → 5.38 |
| paper-close | 70.4% → 70.4% | 62.9% → 62.9% | 1 → 1 (2) | 366.8 → 366.8 | Now tab → Now tab | closed → closed | 0 | 90.5 → 90.5 | 0.8 → 0.9 | 5.1 → 5.1 |
| paper-drawer | 70.4% → 70.4% | 62.9% → 62.9% | 1 → 1 (5) | 247.4 → 247.4 | Now tab → Now tab | closed → closed | 0 | 90.5 → 90.5 | 1.2 → 0.7 | 5.04 → 5.04 |
| paper-laptop | 62.9% → 62.9% | 62.9% → 62.9% | 11 → 11 (21) | 21.6 → 21.6 | Now tab → Now tab | closed → closed | 0 | 90.5 → 90.5 | 1.1 → 1.8 | 5.38 → 5.38 |
| narrow-1024 | 53.5% → 53.5% | 62.9% → 62.9% | 5 → 6 (6) | - → - | card → card | closed → closed | 0 | 90.5 → 90.5 | 1.4 → 1.5 | 8.43 → 8.71 |
| ph8-overview-study | 70.4% → 70.4% | 62.9% → 62.9% | 6 → 3 (7) | - → - | Now tab → Now tab | closed → closed | 0 | 90.5 → 90.5 | 0.7 → 1.3 | 8.56 → 8.56 |
| ph8-overview-watch | 89.8% → 89.8% | 87.2% → 87.2% | 5 → 3 (7) | - → - | hidden → hidden | closed → closed | 0 | 92 → 92 | 0.8 → 0.4 | 8.56 → 8.62 |
| first-run-laptop | 53.2% → 53.2% | 49.0% → 49.0% | 5 → 4 (16) | - → - | hidden → hidden | closed → closed | 0 | 90.5 → 90.5 | 0.8 → 1.3 | 8.71 → 8.71 |

Failures in the after report: none.
Self-test (after): 121 of 121 pass, in 217 s.
