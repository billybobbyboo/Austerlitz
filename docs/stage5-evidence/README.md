# Stage 5 Part A: evidence

Produced by the scripts in `tools/stage5/` against the Stage 4E build as merged (#31; md5 `e1fac9ea08a4c2b2eaefe5b78529c843`,
1,416,737 bytes) in headless Chromium with software WebGL; `census.js` runs in node on the live sources. Cited from
`docs/STAGE5_SPEC.md`. The page scripts inject **probes** into the running page: measurement code that adds prototype meshes or
elements for the measurement and removes them, not the Stage 5 implementation; they changed no source file. Frame times are software
WebGL on one machine, measured with no other probe running: comparable with one another only.

| file | section | script |
|---|---|---|
| `census.json`, `census.md` | 0, A, B, C, D, E, F, G.3 | `census.js --json --md`: every leaf formation's position grade every 10 minutes and at each phase's start, middle and end (`confAt`), with the interpolated ones; anchors, legs and the timing evidence; the events' windows; the Command view's rule every 10 minutes from each headquarters, without the page's cache, by override or computed; `COMMAND`'s statements; each `PLANS` column against the tracks of the formations it names; the phase-0 axis arrows against the plan routes; each formation's day as a track (anchors, extent, length, shortest leg, grades); duplicate keys in `data.js` and `analysis.js` |
| `confidence-probe.json` | A | `confidence-probe.js --json`: in every landscape harness view at 1600 x 900, four of them also at 1x and 10.33x, and two paper-map views: the formations drawn by grade inside the free rectangle and their footprints (m); four encodings (F every formation as its footprint; G1 A crisp, B soft frontage, C diffuse zone of radius the frontage; G2 as G1 with a 1 km zone; G3 only B and C marked) against the view without: the changed share of the free rectangle, the contrast of the changed pixels against the ground, drops, map text contrast as rendered, solid near-black, the world pass's time, the share of the drape under the drawn ground |
| `confidence-sheet.jpg` | A | `confidence-probe.js --sheet`: five views today, in G1 and in G2 |
| `skeleton-probe.json` | B | `skeleton-probe.js --json`: the same views (and the paper map with a selection): the skeleton in three scopes (S-day, S-phase, S-sel): anchors and legs drawn and inside the free rectangle, coverage and contrast, drops, map text, the world pass's time, the drape |
| `skeleton-sheet.jpg` | B | `skeleton-probe.js --sheet`: four views with the skeleton |
| `layout-probe.json` | C, F | `layout-probe.js --json`: the timeline at 1600 x 900, 1280 x 720 and 1024 x 768 in Study and Watch (rail width, timebar height, lanes, shortest bar, the bars inside the marker band against the numerals and markers, the bars' contrast, each interval's marker against its dwell); the dossier's size with a selection; each formation's day-track fitted into it (derived from `census.json`) |
| `timeline-sheet.jpg` | C | `layout-probe.js --sheet`: the timebar with the prototype bars at 1600 x 900 and 1024 x 768, Study and Watch |
| `eyes-probe.json` | D | `eyes-probe.js --json`: the Command view's drawn reading against the reading at the clock (the page's cache); what it marks on screen in each presentation; the viewshed from each headquarters' anchor, its time, the share under the fog's top, the two line-of-sight implementations against each other; an eye 3 m above the drawn ground at the headquarters at 1x, 4x and 10.33x (drawn against model line of sight, what the drawing shows that the model hides, sizes on screen, the camera floor and near plane) |
| `eyes-sheet.jpg` | D | `eyes-probe.js --sheet`: the eye at the Zuran at 08:30 toward the Pratzeberg at 1x, 4x and 10.33x (the map layer hidden; the camera floor waived for the probe) |
| `plans-probe.json` | E | `plans-probe.js --json`: in the landscape views, four at 1x and 10.33x, and the paper map: the Plans overlay as drawn today (both plans) and the plan-ghost prototype, against the view without: routes in view, coverage and contrast, drops, map text, the world pass's time |
| `plans-sheet.jpg` | E | `plans-probe.js --sheet`: three views with the overlay today and with the ghosts |

**Stage 5B** (spatial confidence, implemented): `report-5b.js` on the Stage 4E build as merged (md5 `e1fac9ea…`, `git show
9b969e1:austerlitz-command-map.html`, the "before") and on the 5B build.

| file | section | script |
|---|---|---|
| `5b-before.json`, `5b-after.json` | I (5B) | `report-5b.js --json`: per harness view at 1600 x 900 at its factor, four at 1x and 10.33x, and the paper-map views: the grades drawn in the free rectangle, the marks' share of the free rectangle as rendered (`measure.js` `confShare`: the view drawn once more without them), solid near-black, mean luminance, the lowest map-text contrast as rendered, drops against `DROP_LIMIT`, the world pass's time (software) |
| `5b-report.md` | I (5B) | `report-5b.js --from 5b-after.json --before 5b-before.json --md`: the two side by side |
| `5b-sheet-before.jpg`, `5b-sheet.jpg` | I (5B) | `report-5b.js --sheet`: six views on the 4E build and on the 5B build |

The 5B run measured a build (md5 `7b2bce73…`) that differs from the committed one only in the removal of two functions it no longer
called (`makeFootprint`, `placeFootprint`, the 2B footprint primitive) and their comments; what is drawn is the same.

**Stage 5C** (interval bars and one event clock, implemented; decision 89): `report-5c.js` on the Stage 5B build as merged (md5
`a8db7a17…`, `git show 5d06c40:austerlitz-command-map.html`, the "before") and on the 5C build.

| file | section | script |
|---|---|---|
| `5c-before.json`, `5c-after.json` | I (5C) | `report-5c.js --json`: at 1600 x 900, 1280 x 720 and 1024 x 768 in Study and Watch, the Field vantage: the rail's width, the timebar's height; the bars drawn (number, lanes, the shortest, an edge's largest distance from its window, bars over a numeral, overlaps in a lane, the band they occupy, the lowest contrast against the timebar over black and white); each marker's centre against its event's start; at 1600 x 900 the minutes the next-event key stops at from 04:00 and the counter-march's marker click and theme moment |
| `5c-report.md` | I (5C) | `report-5c.js --from 5c-after.json --before 5c-before.json --md`: the two side by side |
| `5c-sheet.jpg` | I (5C) | `report-5c.js --sheet`: the timebar at 1600 x 900 and 1024 x 768, Study and Watch, on the 5C build |

**Stage 5D** (the evidence skeleton, implemented; decision 90): `report-5d.js` on the 5D build (md5 `c5c47192…`). The skeleton is off by
default, so each view is measured three times on the same build: as it opens (off: the "before"), on in its scope, and on for the whole day.

| file | section | script |
|---|---|---|
| `5d-report.json` | I (5D) | `report-5d.js --json`: per harness view at 1600 x 900 at its factor, four at 1x and 10.33x, and the paper-map views, off / in scope / the whole day: the scope, anchors and legs drawn and in the free rectangle, the skeleton's share of the free rectangle as rendered (`measure.js` `confShare` against the view without it), the map layer's items and drops, the lowest map-text contrast as rendered and the texts below AA, solid near-black, mean luminance, the world pass's time (software) |
| `5d-report.md` | I (5D) | `report-5d.js --from 5d-report.json --md`: the three side by side |
| `5d-sheet.jpg` | I (5D) | `report-5d.js --sheet`: six views in scope and for the whole day |

**Stage 5E** ("Whose eyes?" and the eye-level vantage, implemented; decisions 91, 92): `report-5e.js` on the 5E build (md5 `b50a087c…`).
The "before" of the reading is computed on the same build (the cache keyed by the phase, as before 5E, against the rule at the clock).

| file | section | script |
|---|---|---|
| `5e-report.json` | I (5E) | `report-5e.js --json`: the reading every 10 minutes for both headquarters (the readings the phase's cache would have drawn otherwise, by kind); reported only on screen (both headquarters at 05:00, 08:00 and 10:00, in the landscape, with counters and on the paper map framed: drawn as the C zone, with figures, name or counter drawn, marked "?"); the viewshed from each headquarters' plotted position at each anchor (ground in sight, of it fogged, cells against the rule's threshold, its time, software); the eye-level vantage (Napoleon's headquarters at 08:30, 10:00, 13:00, the Allied at 08:00, 10:00, at 1x, 4x and 10.33x: the eye's height against 3 m scaled, enemy figures drawn and hidden from the headquarters, "not known" drawn, reported zones, drops, solid near-black, mean luminance, the lowest map-text contrast as rendered, the world pass) |
| `5e-report.md` | I (5E) | `report-5e.js --from 5e-report.json --md` |
| `5e-sheet.jpg` | I (5E) | `report-5e.js --sheet`: the eye level at five places and factors |

**Stage 5F** (the ordered routes, implemented; decisions 93, 94): `report-5f.js` on a 5F build (md5 `1ff58879…`; the committed build, `4c7bb9e4…`, differs
only in how the harness's Plans case opens the overlay). The routes are off by
default, so each view is measured twice on the same build: as it opens (off: the "before") and with the routes on.

| file | section | script |
|---|---|---|
| `5f-report.json` | I (5F) | `report-5f.js --json`: per harness view at 1600 x 900 at its factor, four at 1x and 10.33x, and the paper-map views, off and on: routes drawn and in the free rectangle, their share of the free rectangle as rendered, the map layer's items and drops, the lowest map-text contrast as rendered and the texts below AA, solid near-black, the world pass (software); for every formation a column names, the largest distance of its executed position from the column's route (derived, every 10 minutes); the phase-0 axis arrows' columns |
| `5f-report.md` | I (5F) | `report-5f.js --from 5f-report.json --md` |
| `5f-sheet.jpg` | I (5F) | `report-5f.js --sheet`: four views with the routes on |

**Stage 5G** (the day-track inset, implemented; decision 95): `report-5g.js` on a 5G build (md5 `276dc048…`; the committed build, `4c12cac6…`, differs only in the inset's text colour
attribute), at 09:50.

| file | section | script |
|---|---|---|
| `5g-report.json` | I (5G) | `report-5g.js --json`: per leaf formation and IV Corps, anchors and the marks drawn for them, px per km, the scale bar, the shortest leg in inset px, the ordered routes drawn; Saint-Hilaire's full dossier at 1600 x 900, 1280 x 720 (docked) and 1024 x 768 (the card): the inset's size, the dossier's height with and without it, whether it scrolls |
| `5g-report.md` | I (5G) | `report-5g.js --from 5g-report.json --md` |
| `5g-sheet.jpg` | I (5G) | `report-5g.js --sheet`: six insets, docked |
