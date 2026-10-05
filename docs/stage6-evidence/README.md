# Stage 6 Part A: evidence

Produced against the Stage 5G build as merged (#38; md5 `4c12cac6d458b02e3282237f4d1abb92`, 1,528,608 bytes) and cited from
`docs/STAGE6_SPEC.md`. The page scripts in `tools/stage6/` drive the built page in headless Chromium with software WebGL, as the Stage 0
harness does (`tools/stage2/page.js`, which injects `tools/visual/measure.js`; the Stage 5 helpers of `tools/stage5/lib.js`). The
appearance probe changes the running scene for the measurement (instance colours, the figures' fixed-part geometry, an added facings
mesh, the flags' textures) and restores it; its prototype colours, shapes and flag patterns are measurement values standing for classes,
not proposals, and claim nothing about any regiment. No source file was changed. Frame times are software WebGL on one machine:
comparable with one another only.

The five `leads-*.md` files are not script outputs: they are the registers of the research pass (`docs/STAGE6_SPEC.md` §2), written
while no external source could be read (the network policy refused every host that holds them; the search tool's summaries are not a
source). Every external row in them is a lead to read in 6B, not evidence.

| file | section | script |
|---|---|---|
| `census.json`, `census.md` | 1 | `census.js --json --md`: from the running page at 09:30, the figure kit's every part (extent, colour as drawn, or the instance colour); per formation (41) its nation, arm, echelon, strength, guns, `mix`, staff text; for the 32 leaf formations their block's every instanced mesh (kind, count, group, material or vertex colours, instance colours' mean and hues), the coat's base colour and second-nation share, the standards (count, scale, pole length, cloth size); the counter's and the name's colours; the flag textures sampled by area; the shared geometries never drawn; the legend's nation rows and the first-run key |
| `scale-probe.json`, `scale-probe.md` | 3.1, 3.2 | `scale-probe.js --json --md`: in 20 views (every landscape harness view at 1600 x 900 at its own factor, the closest orbit by the harness's pointer path, the low Pratzen view at 1x and 10.33x, three views at 10.33x, the eye level at 1x, two paper-map views): each figure on foot and each rider in the free rectangle projected part by part (the man, his headgear's height and width, his coat's width and height, a facing at 4% of a man's height) and each standard's cloth; median, 90th percentile and largest px, counts at or above 1-64 px, per kind and per formation |
| `scale-sheet.jpg` | 3.1 | `scale-probe.js --sheet`: six of the views measured |
| `appearance-probe.json`, `appearance-probe.md` | 3.3, 4 | `appearance-probe.js --json --md`: in the same views: the formations whose figures are drawn in the free rectangle and, for each, whether its name or counter is displayed and whether its position-confidence mark (the side's colour) is drawn; prototype variants P1 (coats) and P2 (coats, headgear, facings, cuirasses, flags), and P2 without each part, against the view as it is: the changed share of the free rectangle, px per figure, solid near-black and mean luminance, map text contrast as rendered, drops, the world pass, the confidence marks' share as rendered; for P2 without each part also solid near-black (which part darkens a view); in the close views each formation's coats keyed in turn: their rendered colour today and in P1, and the CIEDE2000 difference between formations of the two sides. **Three runs, merged** (the JSON's `runs`): a container restart cut the first short after 16 views; the second measured the other four and four of the first again for the sheet (every threshold measure identical, the parts within 0.0001); the third measured `pratzen-orbit-min` again with the per-part darkness (its coats keyed are the first run's) |
| `appearance-sheet.jpg` | 3.3 | `appearance-probe.js --sheet` (the second run): four views as they are and in P2 (`close-sokolnitz`, `pratzen-low`, `eye-zuran`, `pratzen-orbit-min`) |
| `leads-fr-uniforms.md` | 2.1 | none (the research pass): French dress, the questions and the works that would settle them; the excluded copies listed |
| `leads-fr-colours.md` | 2.2, 2.7 | none: French colours, eagles and standards (the 1804 model, the 1812 vertical tricolour, eagles per battalion, the 4e de ligne's eagle, staff and eagle dimensions) |
| `leads-ru-uniforms.md` | 2.3 | none: Russian dress (the 1802 coat, the 1805 headgear orders and the dispute about practice, jägers and dragoons light green, no cuirasses, hussars) and the order of battle beyond the data |
| `leads-ru-colours.md` | 2.4, 2.7 | none: Russian colours and standards (the 1797, 1800 and 1803 patterns, numbers, the pole, colours taken at Austerlitz); the rows that rested on copies held in other GitHub repositories are marked EXCLUDED and ungraded |
| `leads-at.md` | 2.5 | none: the Austrian order of battle, dress (the 1798 regulation, the Grenz question, cuirassiers, chevaulegers, artillery) and colours (the 1792 pattern, Leibfahne and Ordinarfahne, flames, 161 x 142 cm, the decree of 22 June 1805) |
