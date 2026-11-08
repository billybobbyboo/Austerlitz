# The final audits' Stage 5, WP-08's furniture: evidence

Made on this branch's build (`4749fa00...`) and `main`'s at `c1222e3` (`cdca9984...`), Chromium 141.0.7390.37 (the pinned browser), software WebGL.

| file | what it holds | made by |
|---|---|---|
| `caption-main.json`, `caption-main.txt` | the caption's 24 reads on `main`'s build and the judge's lines: 19 failing (the negative control of CL-MAP-06) | `tools/final-stage5/caption-judge.js` |
| `caption-5b.json`, `caption-5b.txt` | the same on this build: 0 failing | the same |
| `card-main.txt`, `card-5b.txt` | the narrow block's read at 1000 px with the rail hidden and a dossier open: on `main` the card 184 px from the dossier and no north (CL-MAP-13, -04); here neither | `tools/final-stage5/card-judge.js` |
| `mutate-wp08.json` | the self-test's WP-08 block on copies with one fix put back each: 11 of 11 as expected | `tools/final-stage5/mutate-wp08.js` |
| `motion-block-5b.json` | the motion block (`check:selftest`'s runs) on this build: the 16's totals and every visibility baseline `main`'s | `tools/final-stage5/variants.js` (on the WP-07 branch) `--only none --long none` |
| `shots/legend-255.png`, `legend-570.png` | the open key at 04:15 and 09:30 in Landscape with counters, 1600 x 900 (taken before the key's rose was put back in its toggle; the rows as built) | a probe |
| `shots/help-*.png` | the "?" overlay with the map key at 1024 x 768 (Study, counters), 1600 x 900 (Watch, the landscape) and 1280 x 720 (the paper map) | a probe |
