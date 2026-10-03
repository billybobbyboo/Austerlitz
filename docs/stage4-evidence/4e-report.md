# Stage 4E against the build before it (the Stage 4D build (md5 9b13adbf7c481e36585fae9eb8ac1be1, main at 4fba007, #30))

`node tools/stage4/report-4e.js` on each build. Each cell: the smoke's share of the free rectangle (its sprites) · solid near-black (limit 0.05%) · mean luminance · lowest map-text contrast as rendered · drops.

| view | before | Stage 4E | drop limit |
|---|---|---|---|
| overview-field | 8.7% (11) · 0.000% · 76.5 · 8.32 · 6 | 8.5% (33) · 0.000% · 76.3 · 8.32 · 6 | 11 |
| overview-plan | 1.4% (11) · 0.000% · 52.2 · 8.02 · 4 | 1.4% (33) · 0.000% · 52.2 · 8.03 · 4 | 12 |
| close-sokolnitz | 53.3% (7) · 0.000% · 128.7 · 7.58 · 4 | 24.0% (21) · 0.000% · 126.9 · 7.58 · 4 | 18 |
| pratzen-low | 41.4% (11) · 0.030% · 90.4 · 11.94 · 5 | 24.0% (33) · 0.030% · 87.7 · 11.94 · 5 | 13 |
| selected-formation | 4.3% (1) · 0.000% · 61.2 · 7.57 · 4 | 4.1% (3) · 0.000% · 61.1 · 7.57 · 4 | 4 |
| watch-selected | 3.7% (3) · 0.010% · 54 · 7.59 · 3 | 2.2% (9) · 0.010% · 53.8 · 7.59 · 3 | 8 |
| hybrid-dimmed | 2.4% (1) · 0.005% · 58.6 · 6.49 · 8 | 2.4% (3) · 0.005% · 58.4 · 6.49 · 8 | 13 |
| pratzen-low-1x | 42.3% (11) · 0.000% · 74.1 · 8.49 · 4 | 24.0% (33) · 0.000% · 71.5 · 8.49 · 4 | 12 |
| pratzen-low-10x | 27.4% (11) · 0.000% · 110 · 7.87 · 3 | 24.0% (33) · 0.000% · 109.1 · 8 · 3 | 8 |
| ph8-overview-study | 0.8% (7) · 0.000% · 43 · 8.7 · 3 | 0.8% (21) · 0.000% · 43 · 8.7 · 3 | 7 |
| ph8-overview-watch | 0.8% (7) · 0.000% · 42.8 · 8.7 · 3 | 0.8% (21) · 0.000% · 42.9 · 8.7 · 3 | 7 |
| overview-field@1x | 8.7% (11) · 0.000% · 53.3 · 8.34 · 6 | 8.5% (33) · 0.000% · 53.2 · 8.27 · 6 | 11 |
| close-sokolnitz@1x | 53.6% (7) · 0.000% · 118.9 · 7.72 · 5 | 24.0% (21) · 0.000% · 118 · 7.72 · 5 | 18 |
| pratzen-low@1x | 42.3% (11) · 0.000% · 74.1 · 8.49 · 4 | 24.0% (33) · 0.000% · 71.5 · 8.49 · 4 | 13 |
| ph8-overview-study@1x | 0.8% (7) · 0.006% · 32.2 · 8.77 · 3 | 0.8% (21) · 0.006% · 32.3 · 8.77 · 3 | 7 |
| overview-field@10.33x | 8.8% (11) · 0.000% · 87.5 · 7.95 · 7 | 8.6% (33) · 0.000% · 87.3 · 7.95 · 7 | 11 |
| close-sokolnitz@10.33x | 52.0% (7) · 0.000% · 146.5 · 7.67 · 3 | 24.0% (21) · 0.000% · 146 · 7.67 · 3 | 18 |
| pratzen-low@10.33x | 27.4% (11) · 0.000% · 110 · 7.87 · 3 | 24.0% (33) · 0.000% · 109.1 · 8 · 3 | 13 |
| ph8-overview-study@10.33x | 0.8% (7) · 0.000% · 50.8 · 8.62 · 3 | 0.7% (21) · 0.000% · 50.8 · 8.62 · 3 | 7 |

## The horizon in the low views

Columns of the free rectangle where the apron's far edge stands under the true horizon; the gap's colour against the sky's just above the horizon (the largest channel difference, 0-255; the harness's limit 10).

| view | before: gap columns, largest gap px, colour difference | Stage 4E |
|---|---|---|
| pratzen-low@1x | 0 of 0, 0 px, 0 | 0 of 0, 0 px, 0 |
| pratzen-low@4x | 32 of 32, 35 px, 4.4 | 32 of 32, 35 px, 4.4 |
| pratzen-low@10.33x | 32 of 32, 35 px, 5.4 | 32 of 32, 35 px, 5.4 |
