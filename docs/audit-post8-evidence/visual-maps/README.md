# Final audit after Stage 8: the maps' cartographic usability

Area `visual-maps`: how the audited build reads as a map: hierarchy, labels and counters, selection, the legend, the symbols a
first-time visitor meets, the paper map, the Plans view, Watch, the low views' names, "Whose eyes?", the eye level, the caption and
timeline at laptop widths, and the phone layouts. Build `austerlitz-command-map.html`, 2,810,630 bytes, md5
`f10fe585c46aea576f436ed51ac46f83`. Measurement only: no application source, data, test, threshold, archive or build was changed.
The full structured result is `result.json` (18 findings, V-M1 to V-M18); this file says what was examined, how, and what it found.

## How this pass was made

A first attempt captured 74 views with read-backs (71 on the harness page in the `d1600`, `d1280`, `d1024`, `phone-390x844` and
`phone-844x390` folders, 3 on the visitor page in `visitor-1280x720`, and one crop) and stopped at a usage limit before writing anything
else. This pass reused all of them, added 3 desktop captures, a phone probe of the timeline's rail and of "Whose eyes?" (4 captures),
and one motion clip (21 frames), built 8 contact sheets and 13 crops, inspected them with about 20 full-size images, read the code
behind each observation and wrote the analysis.

- Browser: Chromium 141.0.7390.37 headless shell (CI's pin), ANGLE on SwiftShader (software WebGL). Not device colours, timings or
  touch hardware. The machine's load was 20-27 for most of the run (other audit areas' browsers), so pages took 30-230 s to open.
- Page: the harness page (`?harness=1`: drift and smoke still, CSS transitions off, the first-run card closed by a real Esc) unless
  marked "visitor page". Views set through the harness's own entry point (`window.__aus.apply`), settled as the harness settles them.
- Phone: a context of density 3, touch, `isMobile`, an iPhone's user agent (`tools/audit-post8/lib.js` `openPhone`); taps by
  Playwright's `page.tap`, drags by CDP `Input.dispatchTouchEvent`.
- Each capture has a JSON beside it: the spec, the steps, `__aus.state`, the map layer's items (drawn, dropped, held, with boxes),
  the caption's parts, the legend's rows, the scale bar, the far names' plates and the text contrast as rendered (the harness's own
  measure on a PNG of the same frame). `summary.json` tabulates them.
- **Caveat on the first attempt's 1600 captures:** its capture script did not reset layers between shots, so a layer turned on by one
  shot stayed on for the later shots of the same run. Nine captures at 1600 have Position confidence, the evidence skeleton and the
  ordered routes on without asking for them (`selected-sthilaire`, `selected-sthilaire-paper`, `selected-soult-counters`, `pratzen-low`,
  `wall-1200`, `wall-1200-counters`, `wall-0900-arrows-on`, `eyes-al-overview`, `eye-zuran-noarrows`; the three `layers-skel-routes-*`
  ask for them); each JSON's `state.layers` says so. Judgements about default views use the 1280 and 1024 captures (all default), the three captures added here, and the
  visual-landscape area's `v-low-*` shots for the low Pratzen view.
- Judgements are labelled technical, historical or aesthetic/cartographic in `result.json` (`judgement_kind`). Owner decisions are
  treated as accepted trade-offs (V-M14, V-M16, V-M17).

### Commands

```
node tools/audit-post8/visual-maps/capture.js d1600|d1280|d1024 [shot,...]   # first attempt; this pass: d1600 clean-field,wall-0900,land-field-key
node tools/audit-post8/visual-maps/phone.js 390x844|844x390                    # first attempt
node tools/audit-post8/visual-maps/visitor.js 1280x720                         # first attempt (3 of 6 shots before the interruption)
node tools/audit-post8/visual-maps/rail-probe.js                               # this pass: the rail under a finger; "Whose eyes?" on the phone
node tools/audit-post8/visual-maps/clips.js counters-pan10 1600x900            # this pass: a 2.1 s pan clip at 10 fps
python3 -I tools/audit-post8/visual-maps/clip-report.py docs/audit-post8-evidence/visual-maps/clips/counters-pan10.json docs/audit-post8-evidence/visual-maps/clips/counters-pan10-timelines.md
python3 -I tools/audit-post8/visual-maps/sheet.py <out.jpg> <tile w> <cols> <title> <a.jpg> ...   # sheets A-H
```

Two small edits to the first attempt's scripts: `capture.js` writes no sheet and a separate errors file on a partial run (so the earlier
sheet and log are kept); `clips.js` gained the `counters-pan10` clip (a first 120-frame version took about 80 s per captured frame
under the load and was stopped after 2 frames, then shortened to 61 frames, 21 captured). Every run: 0 console warnings or errors.

## Results by question

**Hierarchy and clutter.** The landscape in Study at the Field vantage is legible: 43 items, 5 dropped at 1600 x 900, names on plates
with leader lines, places with diamonds, the scene still visible. Clutter concentrates in four places: the Plans view (V-M11: about 40
serif labels of the two plans and the current phase in one style; at 1280 three plan labels are themselves dropped), the low views'
wall of names (V-M14, accepted), arrow labels that repeat formation names (V-M9), and Landscape with counters at the Field vantage,
which drops 6 of 28 counters at rest at 09:30 (Vandamme, Miloradovich, the Russian Guard cavalry, Nansouty, Walther, d'Hautpoul; the
visibility area's subject).

**Overlap and readability.** No two labels overlap in any capture. 2,486 text measurements in 74 captures: every one at AA or better as
rendered, the least 4.84:1 (the paper map with a selection). One size for battle text (12.5 px). Leader lines cross in dense views.

**Selection.** Strong on the paper map and in Landscape with counters (everything outside the selected family dimmed, the selected
counter in full with its status in words and its commander). Weak on the landscape, the default presentation (V-M10): the selected
name keeps the common plate, and its ground cues share the cream of the plateau outline and the leader lines.

**The legend.** What it lists is correct and contextual, but it exists only in Study from 1080 px wide (V-M2: hidden below 1080 px,
below 430 px of height, in Watch and in Clean), its toggle carries the map's only compass (V-M3), and it has no row for seven
encodings it draws (V-M8). About half of its landscape rows are caveats (figures' dress, standards, the gait, the meres, the vineyard,
the fog, the scales), an integrity choice consistent with the project's priorities but costly in space (300 x 620 px open at 1600).

**What a first-time visitor understands.** Explained: the two side colours (first-run card, legend), outlines and grade extents
(legend; the phone's Layers panel), the "?" and B/C badges in one legend row ("position approximate (B, C) · reported only (?)"; no word
on what A is or how B differs from C). Not explained on screen: the counters' status icons (only in words on hover or close up), the
echelon marks and arm glyphs, the dashed axis arrows of phase 0, the five event glyphs and the objective crosshair, which the "capture"
glyph resembles (V-M8, V-M15). The "derived" tag explains itself only in a hover tooltip and the sources sheet (no touch).

**The paper map.** Technically sound: north-up, one scale, a short-labelled scale bar (5 km entered, 250 m close; the harness holds it to
1%), villages and woods at their model extent, contours and a hillshade (soft and blotchy close up: aesthetic), consistent typography
(sans counters, serif labels). Cartographically weak at its entry framing: no place name at all at 1600, 1280 or 1024 (V-M5), counters
placed in callout rings far from their anchors and some on the grey margin off the sheet (the leader lines carry the geography), and no
north arrow below 1080 px (V-M3) on a sheet that, being the rotated map frame, looks tilted. Close up the arrows grow without a cap
(V-M17, decision 241 (a)'s scope) and the default event glyph looks like a north arrow (V-M15).

**The Plans view and the Littawa.** At 1600 x 900 13 items are dropped, the case's limit: "The concealed centre", the Allied
headquarters' name and 11 place names, the Littawa's among them (V-M16, accepted in section 22.4). At 1280 x 720, 17: the Littawa again,
plus "Soult concealed in the Goldbach valley", "The second axis", "Stare Vinohrady", Liechtenstein's name and the Pratzeberg objective
(V-M11).

**Watch at 14:20 and 14:40.** At 1600 x 900 exactly as section 22.4 says: "centre separation detected" at 14:20, no derived reading at
14:40. At 1280 x 720 the 14:20 caption reads "T. · · derived centre separation detected": the act one letter, the phase empty, the event
given way (V-M6).

**The low views' wall of names and the far plate.** Present: at 12:00 looking east over the Goldbach at 1280 x 720, 31 labels (19
formation names, 16 of them far) in the top 47% of the view over a distant cluster, the lower half empty field; label area 8.5% of the
view. Decision 263 (a) works as specified: far names on the lighter plate at 6.96-7.30:1, near and protected names on the full plate at
12.5:1, one size. The footprint of the wall is unchanged (V-M14; open by decision 255).

**"Whose eyes?".** The "?" badges and C zones appear as designed (from the Zuran at 08:30: Kienmayer's Advance Guard and the First
Column marked "?"). But arrows, arrow labels and the plateau count ignore the reading (V-M4: under the Allied reading at 09:30 Suchet's
and Caffarelli's counters are gone while their arrows, drawn on to their current place, and their names stay; the plateau label reads
"French ≈ 13,300" as for everyone, `crops/plateau-label-al-vs-everyone.jpg`). On the phone the control is three presses deep (decision
225) and, once the Panels close, nothing on screen says a reading is on (V-M7).

**The eye level.** The eye stands 3 m above the Zuran at 08:30 with the model-reading caption; names at AA (least 7.41:1). The large
saturated blue sheets in the middle distance are the observer's own side drawn as its filled graded marks (decision 91,
`app.js:6133-6156`); in Watch nothing explains them (V-M2). The arrows layer's removal changes only the arrows and their labels
(`crops/eye-zuran-diff.png`).

**The caption and timeline at 1280 px and below.** What `fitCaption` and `capTitle` intend (`app.js:7383-7420`, decision 159): the
phase title, then the act, then the events' names shrink; if what cannot shrink still overflows, the readings' "plotted strength
unchanged", the second reading, the events with their tags and last the first reading give way whole, never cut; the whole text stays in
the caption's title and in the Now tab. What a visitor sees (`crops/caption-rows.jpg`): on the first screen at 1280 x 720 "THE DECEPT...
· D. · interval Friant's division at Raigern since the ni..."; at 04:15 "· · hour disputed Liechtenstein counter-marches across the 4th
Colu..."; in Watch at 1600 x 900 "· · derived on the heights: Allied ≈ 4,250 · interval The Russian Guard takes the eagle ...". In Study
nothing is lost (the act and phase are whole on the track, the event and readings whole in the Now tab), but the fragments look broken.
In Watch at 1280 x 720, where there is no Now tab, the caption at 12:00 shows only "THE ARMY DIVID... · The Russian Guard...": both
readings and the event are on no visible element (V-M6). No harness Watch case is narrower than 1600 px.

**The phone layouts.** The Menu, the Layers panel, the dispatch sheet and the dossier sheet open and close by real taps without
overlapping; a one-finger drag pans the map; Watch keeps its switch in the control row. Held landscape leaves a map band of about
180 px between the tools and a 110 px timeline. Defects: the rail cannot be scrubbed from two thirds of its middle line (V-M1: event
markers' hit areas cover 65.8% of it at 390 px; a drag starting there does nothing, a tap jumps to the event and opens its dossier), no
key and no compass (V-M2, V-M3), no reading indicator (V-M7).

**Motion (the clip).** A 270 px pan in Landscape with counters from the Field vantage at 09:30, logged at 30 fps: during the drag the
stabiliser keeps the counters' places and holds up to 23 items hidden; 433 ms after release every division counter leaves and 8 corps
counters fade in at once (V-M12): the Field preset's eye stands 242.8 units from its target and the counters switch to corps beyond 250,
a switch 8C holds until the view rests.

**The layout between 720 and 1079 px.** At 1024 x 768 a selection opens the dossier on the right while the dispatch card stays on the
left: 209 px of map remain (V-M13).

## Findings

| id | sev / pri | category | finding | key evidence |
|---|---|---|---|---|
| V-M1 | S2 / P2 | confirmed-defect | Phone: event markers cover 65.8% of the rail's middle line; drags there do nothing, taps jump to an event | `phone-390x844/rail-probe.json`, `style.css:379-382`, `app.js:7529-7531` |
| V-M2 | S2 / P2 | confirmed-defect | No symbol key below 1080 px, below 430 px tall, or in Watch and Clean | `style.css:584`, `:624`, `:415-427`; `phone-measure.js:85-87` |
| V-M3 | S2 / P2 | confirmed-defect | The only compass is in the legend's toggle: none on phones, below 1080 px, in Watch or Clean | `shell.html:209-217`, `app.js:8371-8380` |
| V-M4 | S2 / P2 | confirmed-defect | "Whose eyes?" draws unknown formations' arrows, arrow labels and plateau count | `crops/reading-leak-arrows-pair.jpg`, `app.js:3101-3116`, `:4061-4071` |
| V-M5 | S2 / P2 | confirmed-defect | Paper map as entered: 0 of 12 place names at 1600, 1280 and 1024 | `d*/paper-entered.json`, `app.js:4998-5001` |
| V-M6 | S3 / P2 | confirmed-defect | Caption: one-letter act/phase and orphan separators; Watch at 1280 loses its readings and event | `crops/caption-rows.jpg`, `app.js:7383-7420`, `style.css:357-373` |
| V-M7 | S3 / P2 | confirmed-defect | Phone: no sign of an active "Whose eyes?" reading once the Panels close | `phone-390x844/eyes-al-route.jpg`, `style.css:772` |
| V-M8 | S3 / P3 | confirmed-defect | The legend lacks rows for axis arrows, event glyphs, objective, places, status icons, echelons | `shell.html:219-269`, `app.js:5589-5606` |
| V-M9 | S3 / P3 | probable-problem | Arrow labels duplicate formation names ("Suchet", "Caffarelli" twice) | `d1600/land-field.json`, `crops/counters-field-nw-2x.jpg` |
| V-M10 | S3 / P3 | probable-problem | Landscape selection barely distinguished on the map | `d1280/selected-sthilaire.jpg`, `app.js:3959-3988` |
| V-M11 | S3 / P3 | probable-problem | Plans view: ~40 labels in one style; plan labels dropped at 1280 | `d1280/plans-overview.jpg/.json` |
| V-M12 | S3 / P3 | probable-problem | Counters view: a short pan from the Field preset swaps every division counter for corps at rest | `clips/counters-pan10.json`, `app.js:6093` |
| V-M13 | S3 / P3 | probable-problem | 720-1079 px: a selection leaves a 209 px map strip | `d1024/selected-sthilaire.jpg` |
| V-M14 | S3 / P3 | accepted-compromise | The low views' wall of names (decision 255) | `d1280/wall-1200.jpg/.json` |
| V-M15 | S4 / P3 | probable-problem | Default event glyph reads as a north arrow; "capture" glyph as the objective | `d1600/paper-pratzen.jpg`, `app.js:3914-3927` |
| V-M16 | S4 / P4 | accepted-compromise | The Littawa's name dropped in the Plans view (section 22.4), at 1280 too | `d1600/plans-overview.json` |
| V-M17 | S4 / P4 | accepted-compromise | Paper-map arrows uncapped close up (decision 241 (a)) | `d1600/paper-pratzen.jpg` |
| V-M18 | S4 / P4 | optional-improvement | "Litava river" among 1805 German names | `data.js:692-693` |

Origins: all inherited (none introduced by Stage 8 that this area could isolate), except the three accepted compromises and V-M18.
V-M12's swap-at-rest is 8C's deliberate band (decision 240 (a)); what is new to this audit is that the Field preset sits 3% from the
threshold.

## The carried items

- **The Littawa's name in the Plans view:** still dropped; accepted (section 22.4, the case's limit 13). At 1600 x 900 13 dropped with
  `t:litava`; at 1280 x 720 17, with three plan labels.
- **The low views' wall of names:** present and open as decision 255 left it; 263 (a)'s far plate applied and measured (far names
  6.96-7.30:1 against 12.5:1 near, one size); 31 labels in the top 47% of the 1280 view.

## Strengths

- No overlapping labels in 74 captures; every measured text at AA or better as rendered.
- One battle-text size, and a consistent visual grammar: sans counters, serif labels, diamonds for places, side squares for names.
- The paper map's and the counters' selection dims everything else; close up, counters spell out status, strength and commander.
- Watch's caption follows the model exactly at 1600 x 900 at 14:20 and 14:40; decision 263 (a)'s far plate as specified.
- Integrity labelling on the map itself: "derived" in the plateau reading, "(disputed)" and "(hour disputed)" on labels, "?" badges.
- The phone's sheets and Menu work by real taps without overlapping; Clean shows the battlefield alone with one control.
- Zero console warnings or errors in every run.

## Not checked

Real devices, real fingers and device GPUs; the visitor page's motion beyond three captures; reduced motion; 1366 x 768, 1920 x 1080
and larger, 360 and 430 px phones, tablet portrait, browser zoom; Play, orbit and zoom clips (Play is the visibility area's); the
opening and the tour (the a11y area); the 39 harness cases themselves; the day-track, the sources sheet and dossier text; screen readers;
why each counter is dropped at rest beyond the priority order; the eye level under the Allied reading, at 1x and 10.33x; whether the
plateau's 13,300 includes Vandamme under the Allied reading (the missing reading test is read from the code; the sum was not computed).

## Evidence index

| path | contents |
|---|---|
| `sheets/A-paper.jpg` ... `H-phone-probe.jpg` | contact sheets: paper map; Landscape with counters; landscape Study; Plans and Watch; low views, eyes and eye level; visitor 1280; this pass's added captures; the phone probe |
| `d1600/`, `d1280/`, `d1024/` | desktop captures (`*.jpg` + `*.json`), `errors*.json` |
| `phone-390x844/`, `phone-844x390/` | phone captures, `sheet.jpg`, `explore-device.jpg` (density 3), `rail-probe.json` and its four captures |
| `visitor-1280x720/` | the visitor page's first screen, Explore, one event step, each with its caption row cropped |
| `clips/` | `counters-pan10.mp4`/`.gif` (10 fps), `.json` (61 frames' layer log), `-timelines.md`, two sheets, frames 57 and 60 |
| `crops/` | `caption-rows.jpg`, `reading-leak-arrows-pair.jpg/.json`, `plateau-label-al-vs-everyone.jpg`, `paper-key-2x.jpg`, `counters-field-nw-2x.jpg`, `sel-paper-map.jpg`, `watch-1420-1440.jpg`, `eye-zuran-*.{jpg,png}`, `phone*.jpg`, `clean-field+wall-0900.jpg` |
| `summary.json` | per capture: clock, presentation, mode, reading, layers, items, drops, least contrast, texts measured, drawn items by category |
| `result.json` | the structured result |
| `tools/audit-post8/visual-maps/` | `capture.js`, `phone.js`, `visitor.js`, `rail-probe.js`, `clips.js`, `clip-report.py`, `sheet.py` |
