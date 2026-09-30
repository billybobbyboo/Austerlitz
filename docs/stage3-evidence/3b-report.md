# Stage 3B: per harness view, before (Stage 2F, ee4390a2) and after (3B, 543a9bf0)

From the two harness reports (`tools/visual/harness.js`), by `tools/stage3/report-3b.js`. Unobstructed: the Stage 2 section H measure at the case's viewport and at 1280 x 720. Dropped: the map layer's drops against `DROP_LIMIT`. Paper map: screen px per true km at the Pratzeberg.

| view | unobstructed, case viewport | at 1280 x 720 | dropped (limit) | paper map px/km | the dispatch | legend | legend over rail, dossier or timebar (px) | layer pass ms | lowest map-text contrast |
|---|---|---|---|---|---|---|---|---|---|
| first-run | 54.4% → 54.4% | 43.9% → 43.9% | 7 → 7 (12) | - → - | hidden → hidden | open (default) → closed | 0 | 0.9 → 1.6 | 8.71 → 8.71 |
| overview-field | 38.6% → 63.1% | 25.0% → 57.8% | 5 → 6 (11) | - → - | card → Now tab | open (default) → closed | 0 | 0.8 → 1 | 8.71 → 8.57 |
| overview-plan | 80.5% → 80.5% | 79.9% → 79.9% | 5 → 5 (12) | - → - | hidden → hidden | open (default) → closed | 0 | 0.7 → 0.7 | 8.76 → 8.76 |
| close-sokolnitz | 80.5% → 80.5% | 79.9% → 79.9% | 5 → 5 (18) | - → - | hidden → hidden | open (default) → closed | 0 | 0.9 → 0.8 | 7.94 → 7.94 |
| staff-paper | 36.5% → 63.1% | 21.5% → 57.8% | 4 → 3 (13) | 77.7 → 77.7 | card → Now tab | open (default) → closed | 0 | 0.8 → 1 | 5.38 → 5.07 |
| pratzen-low | 80.5% → 80.5% | 77.1% → 77.1% | 5 → 5 (13) | - → - | hidden → hidden | open (default) → closed | 0 | 0.8 → 0.7 | 12.23 → 12.23 |
| pratzen-orbit-min | 80.5% → 80.5% | 77.1% → 77.1% | 18 → 18 (27) | - → - | hidden → hidden | open (default) → closed | 0 | 0.8 → 1 | null → null |
| selected-formation | 19.6% → 63.1% | 12.5% → 57.8% | 2 → 2 (3) | - → - | card → Now tab | open (default) → closed | 0 | 0.6 → 0.7 | 11.49 → 12.49 |
| watch-selected | 78.4% → 78.4% | 73.2% → 73.2% | 2 → 2 (8) | - → - | hidden → hidden | open (default) → closed | 0 | 1.1 → 0.6 | 12.35 → 12.35 |
| hybrid-dimmed | 78.7% → 78.7% | 74.3% → 74.3% | 7 → 7 (13) | - → - | hidden → hidden | open (default) → closed | 0 | 1.6 → 1.1 | 6.49 → 6.49 |
| pratzen-low-1x | 80.5% → 80.5% | 77.1% → 77.1% | 4 → 4 (12) | - → - | hidden → hidden | open (default) → closed | 0 | 1.2 → 0.6 | 8.76 → 8.76 |
| pratzen-low-10x | 80.5% → 80.5% | 77.1% → 77.1% | 3 → 3 (8) | - → - | hidden → hidden | open (default) → closed | 0 | 0.8 → 0.6 | 7.84 → 7.84 |
| paper-north-up | 36.5% → 63.1% | 21.5% → 57.8% | 11 → 12 (20) | 17.1 → 25.4 | card → Now tab | open (default) → closed | 0 | 1.7 → 1.1 | 5.38 → 5.38 |
| paper-close | 35.7% → 63.1% | 22.2% → 57.8% | 1 → 1 (2) | 366.8 → 366.8 | card → Now tab | open (default) → closed | 0 | 1.8 → 0.7 | 5.1 → 5.1 |
| paper-drawer | 17.5% → 63.1% | 12.5% → 57.8% | 4 → 2 (5) | 247.4 → 247.4 | card → Now tab | open (default) → closed | 0 | 1 → 0.8 | 4.68 → 5.04 |
| paper-laptop | 21.5% → 57.8% | 21.5% → 57.8% | 18 → 12 (21) | 5.5 → 19.8 | card → Now tab | open (default) → closed | 0 | 2.2 → 1.6 | 5.45 → 5.38 |
| narrow-1024 | 48.4% → 48.4% | 43.9% → 57.8% | 5 → 5 (5) | - → - | card → card | open (default) → closed | 0 | 1.2 → 0.9 | 8.43 → 8.43 |
| first-run-laptop | 48.3% → 48.3% | 43.9% → 43.9% | 5 → 5 (16) | - → - | hidden → hidden | open (default) → closed | 0 | 0.9 → 1.9 | 8.71 → 8.71 |

Failures in the after report: none.
Self-test (after): 103 of 103 pass, in 190 s.
