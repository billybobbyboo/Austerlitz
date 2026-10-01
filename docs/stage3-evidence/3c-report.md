# Stage 3C: per harness view, before (Stage 3B, 543a9bf0) and after (3C, 6ae3f8a7)

From the two harness reports (`tools/visual/harness.js`), by `tools/stage3/report-3b.js`. Unobstructed: the Stage 2 section H measure at the case's viewport and at 1280 x 720. Dropped: the map layer's drops against `DROP_LIMIT`. Paper map: screen px per true km at the Pratzeberg.

| view | unobstructed, case viewport | at 1280 x 720 | dropped (limit) | paper map px/km | the dispatch | legend | legend over rail, dossier or timebar (px) | timebar px | layer pass ms | lowest map-text contrast |
|---|---|---|---|---|---|---|---|---|---|---|
| first-run | 54.4% → 61.5% | 43.9% → 49.0% | 7 → 9 (12) | - → - | hidden → hidden | closed → closed | 0 | 170.1 → 90.5 | 0.9 → 0.9 | 8.71 → 8.71 |
| overview-field | 63.1% → 70.4% | 57.8% → 62.9% | 6 → 6 (11) | - → - | Now tab → Now tab | closed → closed | 0 | 170.1 → 90.5 | 1.3 → 1.4 | 8.57 → 8.57 |
| overview-plan | 80.5% → 89.8% | 79.9% → 87.2% | 5 → 6 (12) | - → - | hidden → hidden | closed → closed | 0 | 170.1 → 92 | 0.9 → 0.6 | 8.76 → 8.76 |
| close-sokolnitz | 80.5% → 89.8% | 79.9% → 87.2% | 5 → 6 (18) | - → - | hidden → hidden | closed → closed | 0 | 170.1 → 92 | 0.6 → 0.7 | 7.94 → 7.94 |
| staff-paper | 63.1% → 70.4% | 57.8% → 62.9% | 3 → 3 (13) | 77.7 → 77.7 | Now tab → Now tab | closed → closed | 0 | 170.1 → 90.5 | 0.6 → 1 | 5.07 → 4.89 |
| pratzen-low | 80.5% → 89.8% | 77.1% → 87.2% | 5 → 5 (13) | - → - | hidden → hidden | closed → closed | 0 | 170.1 → 92 | 0.9 → 0.8 | 12.23 → 12.11 |
| pratzen-orbit-min | 80.5% → 89.8% | 77.1% → 87.2% | 18 → 18 (27) | - → - | hidden → hidden | closed → closed | 0 | 170.1 → 92 | 0.5 → 0.9 | null → null |
| selected-formation | 63.1% → 70.4% | 57.8% → 62.9% | 2 → 2 (3) | - → - | Now tab → Now tab | closed → closed | 0 | 170.1 → 90.5 | 0.7 → 0.8 | 12.49 → 12.49 |
| watch-selected | 78.4% → 88.0% | 73.2% → 83.3% | 2 → 4 (8) | - → - | hidden → hidden | closed → closed | 0 | 170.1 → 92 | 0.7 → 0.6 | 12.35 → 12.35 |
| hybrid-dimmed | 78.7% → 88.2% | 74.3% → 84.7% | 7 → 8 (13) | - → - | hidden → hidden | closed → closed | 0 | 170.1 → 92 | 0.8 → 1.2 | 6.49 → 6.49 |
| pratzen-low-1x | 80.5% → 89.8% | 77.1% → 87.2% | 4 → 4 (12) | - → - | hidden → hidden | closed → closed | 0 | 170.1 → 92 | 0.6 → 0.5 | 8.76 → 8.76 |
| pratzen-low-10x | 80.5% → 89.8% | 77.1% → 87.2% | 3 → 3 (8) | - → - | hidden → hidden | closed → closed | 0 | 170.1 → 92 | 0.7 → 0.6 | 7.84 → 7.84 |
| paper-north-up | 63.1% → 70.4% | 57.8% → 62.9% | 12 → 12 (20) | 25.4 → 28.5 | Now tab → Now tab | closed → closed | 0 | 170.1 → 90.5 | 1.1 → 0.8 | 5.38 → 5.38 |
| paper-close | 63.1% → 70.4% | 57.8% → 62.9% | 1 → 1 (2) | 366.8 → 366.8 | Now tab → Now tab | closed → closed | 0 | 170.1 → 90.5 | 0.7 → 0.7 | 5.1 → 5.1 |
| paper-drawer | 63.1% → 70.4% | 57.8% → 62.9% | 2 → 1 (5) | 247.4 → 247.4 | Now tab → Now tab | closed → closed | 0 | 170.1 → 90.5 | 1 → 1 | 5.04 → 5.04 |
| paper-laptop | 57.8% → 62.9% | 57.8% → 62.9% | 12 → 11 (21) | 19.8 → 21.6 | Now tab → Now tab | closed → closed | 0 | 139.1 → 90.5 | 1.2 → 2.3 | 5.38 → 5.38 |
| narrow-1024 | 48.4% → 53.5% | 57.8% → 62.9% | 5 → 5 (5) | - → - | card → card | closed → closed | 0 | 158.9 → 90.5 | 1.2 → 1.2 | 8.43 → 8.43 |
| ph8-overview-study | 63.1% → 70.4% | 57.8% → 62.9% | 3 → 6 (7) | - → - | Now tab → Now tab | closed → closed | 0 | 170.1 → 90.5 | 0.6 → 0.6 | 8.56 → 8.56 |
| ph8-overview-watch | 80.5% → 89.8% | 79.9% → 87.2% | 2 → 5 (7) | - → - | hidden → hidden | closed → closed | 0 | 170.1 → 92 | 0.5 → 0.7 | 8.56 → 8.56 |
| first-run-laptop | 48.3% → 53.2% | 43.9% → 49.0% | 5 → 5 (16) | - → - | hidden → hidden | closed → closed | 0 | 139.1 → 90.5 | 1 → 0.9 | 8.71 → 8.71 |

Failures in the after report: none.
Self-test (after): 110 of 110 pass, in 331 s.
