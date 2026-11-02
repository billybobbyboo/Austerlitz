# v-repro-ux-maps: reproduction of the UX and map findings (a11y #0, visual-maps #0-#4)

Build: `austerlitz-command-map.html`, md5 f10fe585c46aea576f436ed51ac46f83 (2,810,630 bytes). Browser: Chromium 141.0.7390.37 headless shell,
SwiftShader (CI's pin). Wall-clock times are not device timings. Scripts: `tools/audit-post8/verification/v-repro-ux-maps/` (`zoom.js`,
`phone.js`, `phone2.js`, `desk.js`, `origin.js`). Raw output and captures: `docs/audit-post8-evidence/verification/v-repro-ux-maps/`.
Every probe is my own; I read the area's numbers only to compare. Set-up by script is named where used (the clock by `setClock`, the
V-M4 sweep by `setCommandView`); the gestures are real input (Playwright mouse/keyboard, CDP `Input.dispatchTouchEvent`, `touchscreen.tap`).
`desk.js` ran on the harness page (`?harness=1`, render on demand) after a visitor page timed out on its first 1600x900 screenshot under a
load average of 25 (an environment limit). It stopped at its last step (the browser closed: environment) after every V-M2 to V-M5 read-back
it needed except 1024 px.

| finding | verdict | severity / priority (mine) | origin |
|---|---|---|---|
| a11y #0 400% zoom / 320 px reflow | CONFIRMED | S2 / P2 | inherited |
| visual-maps #0 V-M1 phone rail | CONFIRMED (two details corrected) | S2 / P2 | inherited |
| visual-maps #1 V-M2 no key | CONFIRMED (scope note) | S2 / P2 | inherited |
| visual-maps #2 V-M3 no compass | CONFIRMED (understated: wider than stated) | S2 / P2 | inherited |
| visual-maps #3 V-M4 reading leaks | CONFIRMED (example corrected, scope wider) | S2 / P2 | inherited |
| visual-maps #4 V-M5 paper map without names | CONFIRMED at 1600 and 1280 (1024 from the area's raw output); cause made more specific | S2 / P2 | inherited |

## a11y #0: CONFIRMED
Method: `zoom.js`, a visitor page (no harness), viewport 400x225 and 320x256 at deviceScaleFactor 4 (1600x900 and 1280x1024 at 400%),
and a phone 844x390; real Esc, real clicks, a real Tab route. Output `zoom.json`, captures `zoom-*.jpg`.
- 400x225: the card's box is y -112 to 116 (heading -93 to -73, first paragraph -65 to 50). It cannot scroll (overflow visible, html/body
  overflow hidden). After Esc: `.dispatch` display none, the Now tab hidden, the caption 0 px wide, the legend none, `#helpbtn` partly off
  screen (x 370-402). A real click at the Panels button's centre hits `div.tb-top` and the rail stays hidden. The keyboard route (37 Tabs,
  Enter) un-hides the rail, but at x -275 with a scrolling area 0 px tall. A click on "Accuracy and sources" opens no sheet.
- 320x256: the card is at y -140 (heading -121 to -101); '?' is off screen (x 370). Panels opens the rail, but its scrolling area is 0 px tall
  (scrollHeight 2,081) and the centre of "Accuracy and sources" hits `div.tb-ctrl`, so no sheet opens.
- 844x390 phone: no dispatch and no Now tab. The caption (428 px) still shows the phase title and the live event.
- Code at HEAD: style.css:619-625 (`max-height:430px`: `.dispatch`, `.legend` none; its comment's premise, "the situation strip keeps the
  narrative", fails because the strip `#situation` lives inside the dispatch since 3C, style.css:477-479); style.css:645-646 (`#firstrun`
  bottom-anchored, no max-height or overflow); style.css:851-862 (the held-landscape block hides `#eyesbtn`; its own comment, 849-850,
  says a desktop window 430 px tall or less takes it too); app.js:8971-8984 (`syncDock`).
- Decisions: the 844x390 observation is today's layout, kept for a phone held landscape by decision 226 (a). That part is accepted. No
  decision record mentions browser zoom or reflow (grep over STEP6_SPEC, FINAL_AUDIT, ROADMAP, STAGE8_SPEC), so the 400% part is not
  covered by any decision. S2 stands: WCAG 2.2 1.4.10 (AA). Origin inherited: the rules first appear in 0a19964 (2026-10-14) and 1613575
  (2026-10-21, step 6 Part B). The remedy is feasible, but the phone cases of decisions 223-226 and 232 must hold.

## visual-maps #0 (V-M1): CONFIRMED, two details corrected
Method: `phone.js` and `phone2.js` on a visitor phone page, 390x844, density 3, touch. Explore by a real tap. The clock set to 09:30 by
script. Hit map by `elementFromPoint` every pixel across the rail [8,820,374,24]. Drags by CDP touch events (10 moves, 40 ms apart);
the tap by `touchscreen.tap`.
- Hit map: at y 824, markers take 77.0% of the line. At y 832 (the middle), markers take 64.2% (20 of 25 markers) and the rail 35.8%.
  The area measured 65.8%. At y 840 (4 px above the foot), markers take 4.5%; the area measured 9.4%.
- A drag of 60 px right from the rail (x 51.5, y 832) moved the clock from 09:30 to 07:52. That is exactly `toClock(111.5)`: the clock
  follows the finger.
- A drag of 60 px right from a marker (x 121.5, "Napoleon releases Soult against the heights") left 09:30 and selected nothing. So did a
  60 px left drag from another marker (x 233.5, 12:30).
- A tap at (121.5, 832) set 08:25, selected `e:decision` and opened its dossier (capture `phone-rail-tap-marker.jpg`).
- Correction: a real touch drag from (121.5, 840), where `elementFromPoint` returns the rail, did not scrub either (twice: `phone.js` and
  `phone2.js`). So the finding's escape route, "the rail's bottom 4 px", does not hold under a marker. My unverified hypothesis: the
  touch's hit area reaches the marker's `::after` diamond, whose lower vertex sits at about y 840.
- Code: style.css:344 (`.timerail` has `touch-action:none`); style.css:379-382 (`.evmarks` at z-index 2; `.ev-mark` 8 px rotated, with
  `::after` at inset -6 px and `pointer-events:auto`); style.css:794 (on the phone, `.timerail` and `.evmarks` at top 12px); app.js:7529-7531
  (the rail's `pointerdown` only). Decision 167 exempts the markers' target size, not their capture of the slider's drags. Origin
  inherited (0a19964; the phone timeline from step 6 Part B).

## visual-maps #1 (V-M2): CONFIRMED, with a scope note
- Code at HEAD: the only key is `.legend` (shell.html:206). It is hidden at `max-width:1079.98px` (style.css:584), at `max-height:430px`
  (style.css:624), and under `body.pm-watch` and `body.pm-map` (style.css:415 and 422). The phone's reach check does not include a key
  (tools/visual/phone-measure.js:85-87).
- `desk.json` (1600x900, real clicks): in Study the legend shows at [1489,753,93,42]. In Watch and Clean the legend is display none and no
  Key button is shown.
- `phone.json`: after Explore the legend is display none. The Menu's 12 buttons include no key. The Layers panel describes only the
  grades and the dashed ordered routes. The sources sheet (real taps: Menu, Panels, "Accuracy and sources") explains the grades, the B/C
  extents, the skeleton, dashed routes and interpretive arrows. It has no hit for status icons, echelon marks (XX/XXX), event glyphs or
  the viewshed.
- Scope: Watch and Clean hide the key by their stated purpose ("Battlefield and timeline only", "The battlefield alone: no panels"). From
  there the key is two presses away: 1, then Key, which is closed by default (decision 49). The substantive gap is below 1080 px wide or
  at 430 px tall or less, where no presentation offers the key. STAGE3_SPEC.md:694-695 records that the key line is hidden; that is a
  record, not a decision. S2 stands, because the integrity marks (B/C/? badges, ordered versus interpretive arrows) go largely
  unexplained on phones. Origin inherited.

## visual-maps #2 (V-M3): CONFIRMED, and wider than stated
- Code at HEAD: the rose is an SVG inside `#lg-toggle` (shell.html:209-217), and `updateRose` (app.js:8371-8381) only rotates
  `#rose-needle`. A grep over shell.html, app.js and style.css for compass, north arrow and scale finds no other indicator; `#scalebar`
  (shell.html:308) carries no north.
- New: style.css:640 hides `.legend .rose` under `max-height:700px`, even where the legend shows. North therefore appears only in Study
  at 1080 px wide or more and more than 700 px tall. A 1366x768 laptop's browser viewport (about 650 px tall; computed, not measured) shows
  no rose even in Study.
- `desk.json`: in Study at 1600x900 the rose shows at [1500,760,26,26]; in Watch and Clean its box is 0. `phone.json`: the rose's box is
  0 after Explore and on the paper map.
- The 09:30 view after Esc had camera position (-75, 37.9, 42) and target (7, 10, 12). With GEOREF.NORTH = (-0.299, -0.954), that view
  faces a bearing of about 87°: up on screen is east.
- Not a duplicate of V-M2. The two share a cause, but a standalone rose is a separate remedy. Origin inherited.

## visual-maps #3 (V-M4): CONFIRMED, its example corrected and its scope wider
- Code at HEAD: `rebuildOverlays` builds every arrow of the phase (app.js:3101-3116). `drawOnArrows` has no reading test
  (app.js:3153-3160). `plateauStrength` sums every formation (app.js:4061-4071). `plateauText` builds the label from it (app.js:5176-5180),
  and so does `paintSituation`, the Now tab's and the caption's reading (app.js:7357). `readHidden` (app.js:4325-4329) is never called
  from overlay code (grep of every call site). The project's own S-1 rule for aggregate counters (app.js:4296-4299: "no strength while only
  some are known") contradicts the plateau figure.
- `desk.json`, by real clicks (two on `#eyesbtn`, then Landscape with counters), 1600x900, 09:30, reading `al`: there is no `c:suchet` or
  `c:caffarelli` item. The `o:Suchet` and `o:Caffarelli` labels are registered (off screen in the Field view). Both arrows' ghost shafts are
  visible at opacity 0.19 to 0.236, with `readHidden` true. Capture: `eyes-al-counters-0930.jpg`.
- The sweep (the reading and the clock set by script, every 30 min) found arrows of unknown formations drawn:
  - under `al`: Friant's approach march 07:00-08:30 (drawn on 0.50-0.87), Caffarelli and Suchet 09:30-10:00 (0.00, then 0.50), Nansouty's
    cuirassiers 10:30-11:00;
  - under `fr`: Kienmayer and "I Column descends" 07:00-07:30, Liechtenstein 08:00-08:30, "Bagration withdraws on Rausnitz" 14:30-16:30.
- Corrections:
  - At 09:30 the Suchet and Caffarelli arrows are drawn on 0.00: the faint whole arrow and its label, not yet "to their current place".
    At 10:00 the full-strength part ends at the formation.
  - The plateau example shows no leak: at 09:30 under `al` the French figure is 13,300 both counted over all and over the known ones.
  - Real plateau leaks: under `al` at 11:30-12:30, 31,500 against 25,800 known, and 37,500 against 31,800. Under `fr` they are larger:
    the Allied figure is 38,700 against 17,900 known (04:30-07:00), 23,550 against 13,900 (08:30), and 16,250 against 7,150 (11:00).
- Origin inherited (0a19964; 4D and 5E). Decision 251 (8A) lists the dossier, the centring, the place rows, the midpoint, the day-track and
  `placeNearby`, not the arrows. S2 / P2.

## visual-maps #4 (V-M5): CONFIRMED (1024 not re-run by me)
- `desk.js`: the paper map entered by real clicks (Layers, Paper map, close) at 09:30, Study, everyone.
  - 1600x900: 36 items. Counters 14 on, event 1, plateau 1, overlay labels 7 and objective 1 on; all 12 places dropped (Pratzen Heights,
    Stare Vinohrady, Pratzeberg, the Santon, Zuran, Goldbach, Litava, Telnitz, Sokolnitz, Augezd, Satschan, Austerlitz).
  - 1280x720: the same.
  - Landscape with counters at the Overview (real click), 1280x720: 12 places dropped.
  - `paper-entered-1600x900.jpg` shows no village, stream or hill name. "Pratzeberg" appears only as the objective label.
- 1024x768: I inspected the area's raw `visual-maps/d1024/paper-entered.json`: 12 dropped, with freeCam true. I did not re-run it.
- Cause, more specific than "priority":
  - Places are placed last (pri 8 for major places, 8.5 for others; app.js:5163). They come after counters, overlay labels (pri 6,
    app.js:5157) and the plateau (pri 5).
  - A place must have its 10x10 marker free at its anchor and its name in one of eight slots hugging the marker (app.js:5259-5264).
  - On the paper map every other label may go to the far rings with a leader (app.js:5267-5270), and leaders reserve no space
    (`mlTake`, app.js:5298). So the counters and labels around the villages take each place's own slot first.
- Both remedies are feasible. Drop limits paper-north-up 20 and paper-laptop 21 (thresholds.js:22) accept the count; re-baselining needs
  the owner's word. Origin inherited (2D priority, 2E limits), not checked on an archive build.

## Not checked
V-M5 at 1024 px (the area's raw output only); a real finger's touch radius on the rail (CDP touches only); real 400% browser zoom, as
opposed to a viewport at deviceScaleFactor 4 (equivalent CSS layout); the V-M5 drop state on an archive build (origin by code history
only).
