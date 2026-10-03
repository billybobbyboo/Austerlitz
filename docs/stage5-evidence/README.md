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
