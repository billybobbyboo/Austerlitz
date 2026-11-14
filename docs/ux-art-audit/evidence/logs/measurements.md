# Probe measurements (transcribed from the probes' output, 14 November 2026)

Pinned build, Chromium 153.0.8010.12, Mesa llvmpipe unless noted. "Free map" is the app's own free rectangle (`MAPCAM.freeRect`).
"Box" is the screen bounding box of the formations on the field that fall inside the free map, as a share of it. "Cover in action" is the
share of that box under a drawn map-layer item (4 px raster). Functions: `probes/metrics.js`.

## Composition during Play at half speed, Follow on (probe j9f.js; full rows in j9f-all.json)

| view | clock | eye distance | box | labels | cover of free map | cover in action |
|---|---|---|---|---|---|---|
| desktop 1440x900 Study, paused phase view | 08:30 | 130 | 0.49 | 43 | 0.16 | 0.23 |
| desktop Study, playing | 08:45 to 09:10 | 231 to 255 | 0.27 to 0.33 | 30 to 35 | 0.14 to 0.16 | 0.27 to 0.32 |
| desktop Study, paused phase view | 09:00 | 141 | 0.26 (9 of 31 formations in the free map; 2 of 4 live events outside) | 21 | 0.08 | 0.17 |
| desktop Watch, playing | 08:45 to 09:13 | 230 to 255 | 0.17 to 0.21 | 26 to 36 | 0.08 to 0.10 | 0.22 to 0.32 |
| desktop Watch, paused phase view | 09:00 | 141 | 0.33 (14 of 31; 2 of 4 live events outside) | 31 | 0.08 | 0.15 |
| phone 390x844, paused phase view | 08:30 | 228 | 0.40 (15 of 31; the live event outside) | 23 | 0.37 | 0.47 |
| phone, playing | 08:38 to 09:28 | 363 to 447 | 0.16 to 0.47 | 10 to 15 | 0.24 to 0.35 | 0.27 to 0.63 |
| phone, event sheet open, playing | 09:30 | 486 | 0.30 (free map 288 x 232 px) | 10 | 0.41 | 0.44 |

## The framing tested (probes m1.js, m2.js), 09:00, same target as Follow's

| view | elevation, distance | box | formations in free map | live events in free map | cover in action |
|---|---|---|---|---|---|
| desktop, as built | phase direction, 238 | 0.30 | 31 of 31 | 4 of 4 | 0.325 |
| desktop, closer only | phase direction + 0.10, 150 | 0.45 | 19 of 31 | 2 of 4 | 0.185 |
| desktop, steeper | 52 degrees, 205 | 0.87 | 28 of 31 | 4 of 4 | 0.175 |
| phone, as built | phase direction, 409 | 0.19 | 16 of 31 | 3 of 4 | 0.39 |
| phone, steeper | 55 degrees, 300 | 0.69 | 13 of 31 | 2 of 4 | 0.29 |

## Free map as a share of the screen (probe j6.js)

| viewport | cold | Study | key or Layers open | Panels open | Watch |
|---|---|---|---|---|---|
| 1280 x 720 | 0.256 | 0.374 (key open) | 0.374 | n/a | 0.813 |
| 800 x 450 | 0.095 | 0.180 | 0.077 (Layers) | 0.037 | 0.700 |

## Timeline (probes j3.js, j9d.js, j9f.js, j10.js)

- Event markers: 25, drawn 11 x 11 px (three at 14 x 14). Two share an x at 07:00, 08:45, 11:00 and 11:15.
- Phone rail (374 x 24 px) hit test, one sample per px: a marker under 291 px near the top, 246 px at mid height, 35 px near the bottom.
- Phone: a tap aimed at 09:00 on the rail gave 09:15 with the event "Kutuzov orders the 4th Column to face about" open; free map 288 x 232 px.
- Desktop, press on a marker then one move of +90 px and release: scrubbed to the time under the release (the rail took it).
- Desktop, press on a marker with a 5 px slip: the event opened at its start. With a 9 px slip: the clock moved 5.4 minutes.
- Desktop, the playhead under the 04:15 marker, a 200 px drag (expected 06:14): in 2 px moves 04:15 to 06:14; in 8, 16 and 33 px moves the clock did not change.
- Drag from a marker while playing (+60 px in 3 moves): Play stopped, the clock moved to the release.

## Dossier and sources (probes j3c.js, j9d.js)

- Docked drawer 300 px wide. Saint-Hilaire's full dossier: 6,253 characters, scroll height 6,345 px in a 774 px viewport (8.2 screens); the day-track's top at 4,765 px; 7 anchors, 14 x 14 or 14 x 16 px.
- Day-track anchor pressed while paused: the clock to the anchor's time, focus on the anchor. While playing: Play stopped, clock to the anchor's time, the dossier kept.
- Presses on the 09:15 anchor while playing at half speed, software frames of about 1 s: 8 of 8 taken at 0 ms, 100 ms and 250 ms holds; paused 5 of 5.
- Sources sheet: 543 px wide, 38,972 px tall, 104,457 characters. Esc returned focus to "How this is sourced"; drawer scroll 5,571 px before and after.

## Key (probes j2 (cold), j9d.js A, j9f.js G1)

- 1280 x 720, key open: rows box 274 x 463 px, client width 259 px (a 15 px scrollbar), scroll height 842 px.
- Phone 390 x 844 and 800 x 450: after "Show the key" the legend's computed display is `none`, the card is closed, focus is on Play; the "?" sheet holds the key (3,901 characters).

## Keyboard (probe j7.js), 1280 x 720

- Card: focus on "Begin (two min)" at load; Tab: "Explore on my own", "Show the key", then wraps.
- From Play: next, next event, Follow, Eyes, "?", four speeds, the act, the phase, the slider, the first event marker, the map group, the map's items (events, formations, 12 places), one stop on the page body, Study/Watch/Clean, the tab, the dispatch, sources, the tools, the vantages, the key, then the transport again.
- Slider: ArrowRight 10 minutes, Shift+ArrowRight an hour, PageDown to the next phase, Home and End; Space plays and pauses.
- A place the layer had not drawn (Zuran mound), focused: drawn at once at its place (class `ml-forced`).
- Enter on a formation's name: the dossier opens with focus on its heading. "?" opens the sheet with focus on Close; Esc returns focus.

## Reduced motion, forced colours, reflow (probe j8.js)

- Reduced motion: `RM` true; the opening's Next went straight to step 2 (08:45), no played stretch; 8 s of Play from 08:45 left the eye where it was.
- Forced colours: active; captures j8-fc-*.
- 320 x 256 at density 4: the phone layout; no horizontal or vertical page scroll; "Phase text" opens the dispatch as a sheet; the Menu's targets 44 px tall.

## Console

No error, warning or page error in any session.
