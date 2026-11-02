# Final audit after Stage 8: area "a11y" (accessibility, first use, visitor-facing content)

Build audited: `austerlitz-command-map.html`, md5 `f10fe585c46aea576f436ed51ac46f83`, 2,810,630 bytes (origin/main `43e3e5b`).
Nothing in the application, its data, thresholds, tests, archive or build was changed. Scripts: `tools/audit-post8/a11y/`. Evidence: this
directory (`<probe>.json` records every step with its focus, computed name, measures and words; `<probe>-*.jpg` screenshots at CSS pixels).
The structured result is `result.json` (written by `node tools/audit-post8/a11y/result-src.js` from `result-data.js`).

**Environment, said plainly.** Chromium 141.0.7390.37 headless shell (CI's pin), ANGLE on SwiftShader (software WebGL), on a 4-core container
shared with other audit jobs (load average 18-37 throughout). A frame took seconds; **no time here is a device's**, and four readings had to be
separated from frame timing (the map layer's focus, the `.t` buttons' ring transition, keyboard smooth scrolling, camera glides): anything
animated waits for a frame, and the document timeline only advances when one is drawn. The phone is desktop Chromium emulating an iPhone
(390 x 844, density 3, touch, isMobile, an iPhone's user agent): **not a real mobile browser**. **No screen reader or other assistive technology
was available**: names, roles, states and live regions were read from Chromium's accessibility tree (CDP `Accessibility.getFullAXTree` /
`getPartialAXTree`), not heard. Forced colours is Chromium's emulation (`forced-colors: active`, its default light palette), not Windows'
contrast themes.

## Earlier coverage (proved elsewhere; not repeated)
- `check:contrast` (passed on this build, `../checks/check-contrast.txt`): every visible text element in 45 states at WCAG AA and the 10.5 px
  floor, in the embedded faces; the eight start-up cases.
- `check:selftest` (passed, 317 checks, `../checks/check-selftest.txt`): focus successors (SW-5), the sources sheet a modal dialog (SW-4), a
  closed dossier inert (SW-3), reduced motion followed live (S-6), 2.5.8 for the timeline's control row, rail, tabs, dossier bar, chip and close
  buttons (A-3; decisions 166-167), every map-layer stop drawn when focused (A-2), A-6 (main landmark, timeline region, heading levels, 2 px
  ring), the first-run card's modality (7B), and the live blocks `shortcuts`, `narrow`, `rmLive`, `tips`, `ring`, `toast`, `toastLayout`.
- `docs/step3-evidence/sr-session.md`: recorded complete on the owner's word (decision 175) **without item results**.

This area looked for what those miss: first use as a visitor meets it, the whole Tab order, hover-only information, browser zoom and reflow,
forced colours, touch gestures near the timeline, the words a visitor reads, and keyboard scrolling of the two long sheets.

## How (commands; all from the repository root; each writes `<tag>.json` and its screenshots here)

| probe | command | what it does |
|---|---|---|
| first use | `node tools/audit-post8/a11y/fu.js 1600x900` | visitor page; the card; the opening by its own buttons (Next plays at 4x, Next again goes straight there) to Finish; Play and Pause; a formation clicked on the map; "How this is sourced"; the sheet's keys; Esc, the dossier's x and Back by keys; "?" and the shortcuts switch; the sources sheet from the rail |
| keyboard | `node tools/audit-post8/a11y/kbd.js 1600x900 harness` | the whole Tab cycle from Play back to Play with the computed role and name of every stop, its box, opacity, ring and what covers it; operability from set starting points; Watch's and Clean's cycles; the accessibility tree. A first run on a visitor page (`kbd.js 1600x900`) was stopped after 12 stops (each stop waited about 40 s for a frame of the starved GPU process); its card steps, tree and four ring clips are kept |
| map focus, sheets | `node tools/audit-post8/a11y/mapfocus.js` | the map layer's stops by real Tab, read at 120 ms and after frames; Layers by keyboard; a `.t` button's ring at 120 ms and 1.2 s; the legend's toggle twice; keyboard scrolling of the sources sheet and of the "?" overlay, polled 6 s per key, with a wheel for comparison |
| control | `node tools/audit-post8/a11y/ctl-scroll.js tools/audit-post8/a11y/ctl-scroll.html` | the same sheet structure in a plain page without the app's script: does this browser scroll it from the keyboard? |
| sheets without smooth scrolling | `node tools/audit-post8/a11y/sheetkeys.js` | its own browser with `--disable-smooth-scrolling` (a key's scroll applied at once, no frame needed): the control page, then the sources sheet (a real click, Tab to its text, PageDown, ArrowDown, Space, End, Home), a click on its text, and the "?" overlay |
| zoom, reflow | `node tools/audit-post8/a11y/zoom.js` | 1280x720 at density 1, 800x450 at 2 (200% of 1600x900), 400x225 at 4 (400%), 320x256 at 4 (WCAG 1.4.10's width): the card, Esc, the screen to explore, "?", the Panels and the sources sheet by real clicks, a dossier |
| phone | `node tools/audit-post8/a11y/phone.js`, `phone2.js` | 390x844 portrait, then 844x390: the card, the opening, the grip, drags and pinches by CDP touch, the Menu, a dossier, "How this is sourced". `phone.js` was stopped after its timeline pinch zoomed the page 5x (its later taps missed); `phone2.js` repeats the gestures with that pinch last, then the rest unzoomed |
| forced colours, reduced motion | `node tools/audit-post8/a11y/fc.js` | `forced-colors: active`: pressed and selected states, the focus ring, the swatches, a dossier and the full dossier's targets; then reduced motion turned on live (a vantage's glide); then the "press D" hint with the shortcuts off |
| words | `node tools/audit-post8/a11y/jargon.js`; `node tools/audit-post8/a11y/leaks.js` (and `leaks.js timing`) | lang-scan's visitor strings searched for internal references and jargon; then the dossiers and the sources sheet read as drawn (harness page; clock and selection set by script) |
| digest | `node tools/audit-post8/a11y/digest.js <tag>` | a compact reading of a record |

## Results

### First use (1600 x 900 visitor page, real mouse and keys; `fu-1600x900.json`, `fu-1600x900-01..11-*.jpg`)
- **First screen.** The card (a modal dialog, focus on "Begin (two min)", Tab kept inside, ring visible) says what the colours mean and that
  "this map reads [the Pratzen] as deciding the battle". The Now tab beside it starts with a "derived" reading and a long source-critical note
  on Friant's division (Davout's two reports, Sokolov, Thiers) before the phase's own title. Grade letters (B, C) already stand beside the
  names; nothing on the first screen says what they mean, the key starts closed (A11Y-08).
- **The opening.** "Begin" starts it with focus on Next; each step's bar text is good prose; a played stretch says "the clock plays" and the
  live region says it once; Finish lands at 04:00, Study, the Overview, focus on Play, "The opening has ended. Play runs the day from 04:00."
  (decision 118). During the 4x stretch the speed group still shows ½× pressed (A11Y-13). The Now tab, hidden during it, says "press D to
  show it. During the guided tour..." (it is the opening, not the tour; with the shortcuts off D does nothing: A11Y-09).
- **Play** turns into "Pause" (name) while aria-pressed is true (A11Y-10). **A formation** clicked on the map opens its card in the rail with
  "How this is sourced" at its head; the sheet opens with focus on its close, the rest inert, the dossier's tagged statements at its head;
  Esc closes it and focus returns to the button. **Esc** with focus in the dossier, the dossier's x and its Back by Enter: focus goes to the
  Now tab each time, never to the body. **"?"** opens the overlay (focus on its close; Tab cycles close, switch, list); the shortcuts switch
  works (with it off, "2" changed nothing).
- **Evidence and reconstruction.** The claim words are plain ("Not yet checked", "As a source tells it", "This map's reading"); the sheet's
  second paragraph explains A/B/C; but the dossier shows "Position B · Timing B" side by side (two scales, one letter set: A11Y-11), and the
  sources sheet (89,703 characters, 15 headings, 33,000 px tall) speaks the project's working language in places (A11Y-03).

### Keyboard (`kbd-h-1600x900*.json`, `mapfocus.json`)
- The cycle from Play back to Play has **47 stops** (46 controls, every one named, none in a hidden panel, and the document itself where the
  cycle wraps); order: the timeline's controls, the acts, phases
  and events (one stop each, roving), the slider, the map group and its 14 items, then (wrapping) the presentation switch, the Now tab, the
  rail's scroller (Chromium makes it focusable), "Accuracy and sources", the tools, the vantages, the key's toggle. No trap.
- Read 120 ms after each key on this machine, 23 `.t`/`.vm-btn` stops showed a 0 px outline and 5 place names stood at (0,0) with opacity 0.
  Both are timing: the `.t` buttons' `transition: all .18s` animates the outline in, and the transition only advances when a frame is drawn
  (still 0 px at 1.2 s in `mapfocus.json`, yet the clip, which forces a frame, shows the 2 px ring: `mapfocus-ring-layersbtn.jpg`; the
  card's primary read 2 px after 2.5 s); and the map layer places a focused item at its next frame (all 18 map stops on screen at opacity 1
  after frames; 7 brought forward with `ml-forced`).
- Watch keeps the switch in the timeline and drops the rail and tools from the order; Clean leaves the map group, the switch and "Show
  interface"; Esc returns to Study with focus on Play. Layers, and a dossier opened from a map item, do not take the focus: A11Y-07. Both sheets scroll from the keyboard (`sheetkeys.json`, with smooth scrolling off; the zero readings in `mapfocus.json` and `zoom.json` were smooth-scroll animations starved of frames: the control page `ctl-scroll.html` scrolls either way).

### Zoom and reflow (`zoom.json`, `zoom-*.jpg`)
| case | result |
|---|---|
| 1280 x 720 | everything reachable; caption cut to "THE DECEPT… · D. · interval Friant's division at Raigern since the ni…" (`zoom-1280x720-at1-caption-crop.jpg`) |
| 800 x 450 at 2 (200%) | everything reachable: the card whole, the phase text in its card (scrolling), the rail beside it; the vantage row overlaps the card's top edge (3,069 px²) |
| 400 x 225 at 4 (400%) | **fails**: the card's top 112 px above the viewport and unscrollable; no phase text anywhere; caption 0 px wide; no key; Panels under the timeline (a real click hits the timeline); "?" partly off screen |
| 320 x 256 at 4 (1.4.10) | **fails**: the card's top 140 px cut; "?" off screen; Panels opens a rail whose scrolling area is 0 px tall; "Accuracy and sources" then under the timeline |

### Phone (`phone.json`, `phone2.json`, `phone*-*.jpg`)
- Portrait: the card, the opening, Skip, the grip (aria-expanded, "The phase text in full"), the phase list (362 x 44 rows) and the Menu
  (every item 44 px tall) all work; no failing target; no cut text but the caption's event. The caption begins with two orphan separators
  ("· ·": the act and phase names shrink to 0 px). The grip opens by a tap; a swipe up on it does nothing.
- One finger dragged on the map pans (CDP touches reach the app). A drag along the time rail never scrubbed (twice); a tap at 30% landed on
  an event marker: A11Y-04. How much of the rail the markers take: each marker is an 8 px square turned 45° with a 6 px hit margin
  (style.css:380-382), a diamond 16.2 px wide at the rail's centre line; placed at the 21 distinct event starts (from the accessibility tree's
  event names, `kbd-h-1600x900-axtree.json`) they cover 66% of the 374 px phone rail (91% between 07:00 and 15:00), 30% of the 1,252 px rail
  at 1280 and 24% of the 1,572 px rail at 1600. Pinches zoomed the page, not the map, in this emulation: A11Y-05.
- Held landscape (844 x 390): no failing target, but the phase text is not shown anywhere (the card hidden by the 430 px rule, no Now tab
  below 1080 px); the Panels' rail has a 105 px scrolling area.

### Forced colours and reduced motion (`fc.json`, `fc-*.jpg`)
- Chromium reports `forced-colors: active`; no element of the app sets `forced-color-adjust`. The colour key's swatches, the legend's four
  nation and side swatches and the side marks before formation names all turn to identical white squares (`fc-01-first.jpg`,
  `fc-08-legend.jpg`); 22 of the 25 event markers vanish from the timeline (only the three bordered "decision" diamonds remain,
  `fc-05-timebar.jpg`); the speed group's ½×, Follow and the current phase look like their neighbours; in the Layers panel every row looks the
  same on or off, and Landscape like Paper map (`fc-09-layers.jpg`). Over the map (presentation switch, vantages) a pressed button stays
  distinguishable, its opaque background against translucent neighbours over the dark canvas. The focus ring stays (2 px, forced highlight).
  The full dossier's on-screen targets: none failing; its day-track anchors are 14.8 px with centres 24.5 px or more apart (they pass the
  spacing test). Its headings carry their tag words ("How many record", "Where reconstruction").
- Reduced motion turned on live: the stylesheet rule applies at once (the rail's and the dossier's transitions 0 s). The camera samples
  (a vantage pressed, 150 ms and 2.5-3 s) are inconclusive: no frame was drawn in 3 s on this machine, with reduced motion on or off. The
  live switch is held by the self-test's `rmLive` block (passed on this build).
- With the shortcuts off (the switch by Space), the guided tour started by a real click, D pressed with nothing focused: the phase text stays
  hidden and the Now tab still says "press D to show it" (A11Y-09).

### Words (`jargon.json`, `leaks.json`, `leaks-timing.json`)
lang-scan's judged visitor strings hold 15 with "anchor", 7 with "leg", 11 with "interpolat", and 69 with an internal reference (most in data
the interface never draws: GEOREF notes, BUILDINGS scopes, ORDNANCE notes were not found in the sources sheet as drawn). As drawn in
"Accuracy and sources": "Height, owner decision 106: …"; "The strength is Duffy's rows, read on the page (S5.7)" (twice) and "Duffy's
order of battle (S5.7)"; "The situation of 28 October is a reading of roadmap step 6B (docs/stage6-evidence/readings-composition.md); Duffy and
Smith are cited, not read."; "Ermolov's before-dawn march is in the register (read partly on the text layer)". In the full dossiers' "Dated by" rows, at a clock inside each move's window (`leaks-timing.json`, the full dossier opened by its own button): "The arrival follows the existing 40-minute march (moveMin)" (Imperial Headquarters, 12:10); "Until roadmap step 4b this anchor was the phase-2 entry, reached at 08:30 on this map (question 177)" (Friant, 09:20); "Until roadmap step 4b's question 202 the map moved them from 04:00 to this screen by 08:00 (phase 2)" (Bourcier); "(question 181)", "(question 176)" (the grenadiers; Langeron's and Przybyszewski's columns). A11Y-03.

## Findings (full fields in `result.json`)
- **A11Y-01 · S2 / P2 · confirmed-defect · inherited · confirmed.** At 400% browser zoom and at WCAG's 320 px reflow width the interface loses content and functions (the card's start, the phase text, the caption, the key, the panels, the sources).
  Observed: 400x225 (400%): the card's box starts at y=-112 (height 228, not scrollable; the page has overflow hidden), so its heading and first lines are off screen; after Esc no phase text, situation or events anywhere (.dispatch display:none, no Now tab); caption 0 px wide; no key; the Panels button under the timeline (hit-test div.tb-top at 3 of 3 points; a real click opened nothing); '?' partly off screen; the timeline 40% of the height. 320x256: the card starts at y=-140; '?' off screen (x=370); Panels opens a rail whose scrolling area is 0 px tall and 'Accuracy and sources' sits under the timeline (a real click opened nothing). The phone held landscape (844x390) also shows no phase text. 200% (800x450) passes: everything reachable (1.4.4 met).
  Expected: WCAG 1.4.10 (AA): at 320 CSS px wide nothing but the two-dimensional map itself may need two-dimensional scrolling or be lost: the card scrolls inside itself, the phase text stays reachable (the phone layout's grip sheet does this at 390 px), every control stays on screen and pressable.
  Remedy: By size, not by device: give #firstrun a max-height with overflow:auto at heights of 430 px or less; keep the phase text reachable there (the phone's grip sheet, or the Now tab in the rail); below 720 px wide put the tools, '?' and 'Whose eyes?' behind the Menu whatever the height, or let the timeline's control row wrap; keep the rail's scrolling area a usable height (or take the brand and tabs out of it at small heights). Add a 320x256 and a 400x225 case to check:visual. (effort 1-3 days (layout, then the visual harness's limits re-measured))
  Refs: style.css:619-625 (max-height:430px: .dispatch and .legend display:none); style.css:645-648 (#firstrun anchored to the timeline's top, no max-height or overflow below 431 px tall); style.css:851-862 (held-landscape block: the query is the height's alone, so a zoomed desktop window takes it; #eyesbtn hidden); app.js:8971-8984 (syncDock: below 1080 px the Now tab is hidden and the dispatch is the card); shell.html:116-134 (the tools column, which wraps under the timeline).
  Evidence: docs/audit-post8-evidence/a11y/zoom.json (steps 400x225-at4:* and 320x256-at4:*); docs/audit-post8-evidence/a11y/zoom-400x225-at4-1-first.jpg, zoom-400x225-at4-2-explore.jpg, zoom-320x256-at4-2-explore.jpg; 200% for comparison: zoom-800x450-at2-*.jpg.
- **A11Y-02 · S3 / P3 · confirmed-defect · inherited · confirmed.** Caveats a reader needs are given only in hover tooltips (title attributes): the derived readings' warnings, the vantages' 'not what he saw', the cut caption's full text, why relief is disabled.
  Observed: span.der carries FLAT_NOTE ('The reconstruction plots formations, not losses. A holding that does not change does not mean the fighting there has stopped.') and SEP_NOTE ('...A spatial reading, not a casualty figure.') in title only; the spans take no focus; on a phone no tooltip exists. The vantage buttons' integrity caveats are titles (Chromium exposes them as accessible descriptions). At 1280x720 the caption reads 'THE DECEPT… · D. · interval Friant's division at Raigern since the ni…'; its full text is the title.
  Expected: Information that qualifies a figure or a view is visible text, or reachable by focus and by touch (a toggletip button, or the sentence in the Now tab and the eye-level caption); native title tooltips are a supplement only.
  Remedy: Show FLAT_NOTE/SEP_NOTE as visible text in the Now tab (or a focusable 'what is this?' toggletip); put the vantages' caveat into the camera's own caption when a preset is chosen; give disabled relief buttons a visible hint or keep them enabled with a message. (effort 2-6 h)
  Refs: app.js:7347-7348 (SEP_NOTE, FLAT_NOTE); app.js:7368-7370 (written only into title= on span.der, not focusable); app.js:7380 (the same spans in the Now tab's situation line); shell.html:129-131 (van-btn titles: 'a preset view, not what he saw', 'not what the Allied staff saw'); app.js:2581 (relief buttons disabled with the reason in title); app.js:5639 (the squeezed key's reason in title); app.js:5724 (an evidence-skeleton anchor's clock and grade as the canvas's title); app.js:7378 (cap.title=capTitle(cap): the full caption).
  Evidence: docs/audit-post8-evidence/a11y/fu-1600x900.json step 1 'titles' (25 elements whose title adds words not in their name or visible text); docs/audit-post8-evidence/a11y/zoom-1280x720-at1-caption-crop.jpg (caption cut to 'THE DECEPT… · D. ·').
- **A11Y-03 · S3 / P2 · confirmed-defect · inherited · confirmed.** Internal project references are shown to visitors: 'owner decision 106', register ids '(S5.7)', 'roadmap step 6B (docs/stage6-evidence/readings-composition.md)', 'the register (read partly on the text layer)', and in the full dossier's 'Dated by' rows 'Until roadmap step 4b ... (question 177)', '(moveMin)'.
  Observed: As drawn in 'Accuracy and sources' (89,703 characters): 'Height, owner decision 106: ...'; '... read on the page (S5.7)' (twice) and 'Duffy's order of battle (S5.7)'; 'The situation of 28 October is a reading of roadmap step 6B (docs/stage6-evidence/readings-composition.md) ...'; 'in the register (read partly on the text layer)'. As drawn in the full dossiers' 'Dated by' rows at a clock inside each move: '(moveMin)' (Imperial Headquarters, 12:10), 'Until roadmap step 4b ... (question 177)' and '... was the phase-2 entry ...' (Friant, 07:00 and 09:20), 'Until roadmap step 4b's question 202 ... (phase 2)' (Bourcier), '(question 181)' (grenadiers), '(question 176)' (Langeron's and Przybyszewski's columns); the day-track adds 'anchors graded A/B/C as in the data'.
  Expected: Visitor text names sources and reasons in plain words; decision numbers, register ids, roadmap steps, file paths and code names stay in CHANGELOG.md and the evidence registers.
  Remedy: A small data task: reword the five claim notes and the seven timing notes for visitors (keep the history in CHANGELOG.md), drop 'owner decision 106' from standardNotes; check:data's reference, narrative.js's hashes and check:chronology's L9 hashes move with it. (effort 2-4 h)
  Refs: app.js:8553 ('Height, owner decision 106: ...', the sources sheet's standards notes); narrative.js:545 (FORMATIONS.legrand.staff note with the docs path); narrative.js:617, 624, 632 ('(S5.7)'); narrative.js:41 (EVENTS[#counter-march].dispute note: 'in the register (read partly on the text layer)'); app.js:8640 (claimDetail renders every claim's note); data.js:158, 252, 254, 267, 434, 506, 534 (timing notes with 'Until roadmap step 4b' / '(question 17x)' / '(moveMin)'); app.js:7990 (the full dossier's 'Dated by' row renders tm.note).
  Evidence: docs/audit-post8-evidence/a11y/leaks.json step 'the whole sources sheet' (89,703 characters as drawn; 6 internal references quoted in context); docs/audit-post8-evidence/a11y/leaks-timing.json (the seven full dossiers as drawn, clock and selection set by script, the full dossier opened by its own button); docs/audit-post8-evidence/a11y/jargon.json (lang-scan's 69 visitor strings with such references, most in data never drawn).
- **A11Y-04 · S3 / P3 · confirmed-defect · inherited · confirmed.** On a phone the event markers' hit areas cover most of the time rail, so a finger dragged along the rail does not scrub the clock and a tap on it jumps to an event instead.
  Observed: Two real touch drags along the rail (phone.js, phone2.js) left the clock unchanged; a tap at 30% hit button.ev-mark.dec and set 08:25. At the rail's centre line the markers' hit areas (16 px wide there) cover 66% of the 374 px phone rail and 91% of it between 07:00 and 15:00 (24% and 34% of the 1,572 px desktop rail).
  Expected: A drag anywhere on the rail scrubs (markers yield to a moving finger, or take presses only on a tap), as on desktop between markers.
  Remedy: Let a drag that starts on a marker scrub (handle pointerdown on .evmarks, decide tap or drag by movement), or raise the markers above the rail band on touch layouts. (effort 2-4 h)
  Refs: style.css:379-382 (.evmarks over the rail; .ev-mark 8 px rotated, its ::after inset -6px, pointer-events auto); style.css:794 (phone: rail and markers at the same top); app.js:7528-7530 (the rail scrubs only from its own pointerdown).
  Evidence: docs/audit-post8-evidence/a11y/phone2.json steps 2-3; docs/audit-post8-evidence/a11y/phone.json step 'horizontal drag 200 px on the time rail' (before the zoom); coverage computed from the 21 distinct event starts and the markers' hit geometry (README, Phone).
- **A11Y-05 · S3 / P2 · untested · inherited · unverified.** Two-finger gestures on the phone: in Chromium's touch emulation a pinch zoomed the whole page (visual viewport x3.3 to x5) and never the map; no check has ever driven the map's pinch with browser-level touch input.
  Observed: Map-only pinch: camera position unchanged, page zoomed x3.26. One finger on the timeline: page zoomed further. The emulation's handling of multi-touch touch-action is itself uncertain, so this is not a device result.
  Expected: A pinch on the map zooms the map (touch-action:none on the canvas keeps the browser out); a pinch beginning on the interface may zoom the page (that is the visitor's zoom, which should stay available).
  Remedy: Test pinch-to-zoom on a real iPhone and Android phone (the owner's devices); if confirmed, check that the canvas receives both pointers (no element between), and that the page's own zoom stays possible from the panels. (effort 1 h on devices; fix unknown)
  Refs: style.css:8 (canvas touch-action:none); style.css:344 (the rail touch-action:none; the rest of the timeline default); app.js:6854-6890 (bindCanvas: the pinch from two tracked touch pointers); app.js:9258-9266 (the self-test's pinch: synthetic PointerEvents dispatched in the page, not browser input).
  Evidence: docs/audit-post8-evidence/a11y/phone2.json steps 1 and 4-5 (one-finger drag on the map panned the camera: CDP touches reach the app; a pinch on the map alone: camera unchanged, visualViewport.scale 1 -> 3.259; a pinch with one finger starting on the timeline: 3.259 -> 3.918); docs/audit-post8-evidence/a11y/phone.json step 'pinch out: one finger on the timeline' (1 -> 5, the following taps then missed); docs/audit-post8-evidence/a11y/phone2-05-after-timeline-pinch.jpg.
- **A11Y-06 · S3 / P3 · probable-problem · inherited · confirmed.** Forced colours (high contrast): the app has no forced-colors handling; the Layers panel's on/off rows and ground buttons, the speed, Follow and the current phase lose their state, 22 of 25 event markers vanish, and the key's swatches and the side marks before names become identical white squares.
  Observed: Chromium's emulation, light palette, no forced-color-adjust anywhere: the key's and the card's nation swatches and the side squares before formation names are all rgb(255,255,255); 22 of 25 event markers vanish (only the bordered decision diamonds remain); on the timeline the pressed ½×, Follow and the current phase look like their neighbours; in the Layers panel on and off rows look alike and Landscape like Paper map. Over the map a pressed button stays distinguishable (opaque against translucent neighbours over the dark canvas); tabs keep a weight difference; the focus ring stays (2 px, forced highlight).
  Expected: Under forced-colors: active, markers and swatches keep a visible, distinct form (system colours for borders, forced-color-adjust:none for the nation swatches and side marks, or text glyphs).
  Remedy: An @media (forced-colors: active) block: pressed and selected states by a system-colour border or outline (Highlight) or a glyph, not by background alone (the layer rows, the mode, speed and vantage buttons, Follow, the current phase); borders on .ev-mark; forced-color-adjust:none on the nation swatches and side marks (their colours are content). (effort 2-4 h)
  Refs: style.css:380-388 (.ev-mark drawn by background:var(--side-fr|al)); shell.html:369 (the card's swatches); style.css (no forced-colors rule; no forced-color-adjust anywhere: fc.json fcaNone 0).
  Evidence: docs/audit-post8-evidence/a11y/fc.json (forced: true; no element with forced-color-adjust:none; swatches rgb(255,255,255) with black borders; pressed backgrounds opaque against translucent ones); docs/audit-post8-evidence/a11y/fc-01-first.jpg (key and side marks as white squares), fc-05-timebar.jpg (3 of 25 event diamonds; ½× and Follow like their neighbours), fc-09-layers.jpg (on and off rows alike), fc-08-legend.jpg, fc-03-viewmode.jpg, fc-04-tools.jpg.
- **A11Y-07 · S3 / P3 · confirmed-defect · inherited · confirmed.** Panels opened from the keyboard do not take the focus or announce themselves: Layers (role=dialog) is reached only on the sixth Tab after its button, and a dossier opened by Enter on a map item leaves focus on the item, about 30 Tabs from the dossier (or Shift+Tab back past the earlier map items and the map group).
  Observed: As in the title.
  Expected: The opened panel next in the focus order (focus moved to its first control, or the panel placed right after its button), as a disclosure or non-modal dialog does (WCAG 2.4.3).
  Remedy: On opening by keyboard, focus the panel's first control (Layers) and the dossier's heading (a map item's Enter), giving focus back on close as setPop and the dossier already do from inside; or move #layerpop to follow #layersbtn in the DOM. (effort 1-3 h)
  Refs: app.js:7070-7075 (setPop: hidden and aria-expanded set, no focus move); shell.html:116-134 (#tools with the vantage group) and shell.html:137 (#layerpop after them in the DOM).
  Evidence: docs/audit-post8-evidence/a11y/mapfocus.json step 'Layers by keyboard' (open: hidden false, expanded true, focus on #layersbtn; Tab x7: Field, Zuran, Pratzen, Allied, Overview, then the panel's x and Landscape) and step 'a formation's map item ... Enter' (selection f:gqg, drawer on, focus still on the map item); docs/audit-post8-evidence/a11y/kbd-h-1600x900.json step 'Layers: open, Tab, Esc'; DOM order shell.html:325 (aside.drawer) before shell.html:384 (main, the map layer).
- **A11Y-08 · S3 / P3 · accepted-compromise · accepted-compromise · confirmed.** First use: neither the card nor the opening says the map is a reconstruction or what the A/B/C letters beside names mean; the key starts closed.
  Observed: Card: colour key and the Pratzen plateau 'which this map reads as deciding the battle'. Opening steps 1-4: battlefield, the French strike, the army divided, the collapse; none mentions reconstruction or grades. The key is collapsed ('Key +'); the grades are explained in it, in the sources sheet's second paragraph and in tour stop 9, which the opening does not include.
  Expected: One sentence on the primary path (card or opening's first step): positions are reconstructed and graded A/B/C (the letters by the names), and where the sources are.
  Remedy: Owner decision needed (decisions 49, 108, 111-115 set the card, the key and the opening): add one sentence to the card or the opening's last step, or open the key's grade rows on the first screen. (effort 1-2 h after a decision)
  Refs: shell.html:366-374 (the card and its words); app.js:4710 (OPENING.stops [0,5,6,7]); analysis.js:387 (TOUR stop 9: 'Everything you have watched today is a reconstruction: positions are graded A, B or C...'); app.js:5016 (ML.legendOpen false: the key opens closed, decision 49).
  Evidence: docs/audit-post8-evidence/a11y/fu-1600x900.json steps 1-6 (card and opening texts); fu-1600x900-01-first-screen.jpg, -02-opening-1.jpg.
- **A11Y-09 · S4 / P3 · confirmed-defect · inherited · confirmed.** The Now tab's hint 'The phase text is hidden: press D to show it. During the guided tour...' names a key that does nothing with the single-key shortcuts off, offers no pointer or touch way, and says 'guided tour' during the opening.
  Observed: As in the title; Esc (showEverything) does bring the text back, but the hint does not say so.
  Expected: A hint that is true in every state: a 'Show the phase text' button (or 'Esc shows everything'), its words from LABELS according to SHORTCUTS.on, naming the opening when the opening runs.
  Remedy: Replace the sentence with a button that calls setDispatchVisible(true), or word it from SHORTCUTS.on; distinguish the opening from the tour. (effort 1 h)
  Refs: shell.html:58 (p.now-off: the hint); app.js:6679 (KEYS row d: the only toggle of the phase text); app.js:6720-6721 (charKey, shortcutMuted: D muted when the switch is off); app.js:4725 (the opening hides the phase text).
  Evidence: docs/audit-post8-evidence/a11y/fc.json last step (switch off by Space, the guided tour by a real click, D by a real key with nothing focused: hideDispatch stayed true, the hint unchanged); docs/audit-post8-evidence/a11y/fu-1600x900-02-opening-1.jpg (the hint during the opening).
- **A11Y-10 · S4 / P4 · confirmed-defect · inherited · confirmed.** Accessible names and structure: the tablist is named 'The rail', the key's toggle is read 'Key plus/minus', Play becomes 'Pause' while also pressed, the full dossier's headings carry their tag word ('How many record', 'Where reconstruction'), the narrative sits inside the navigation landmark and the tools outside any landmark, and below 1080 px the page has no h1.
  Observed: As in the title. Not a WCAG A/AA failure on its own (names exist; states are exposed); no screen reader was run.
  Expected: Plain names ('Panels' or 'Map panels'); the key's state by aria-expanded alone; Play/Pause either a changing label or a pressed state, not both; the narrative in main or a named region; one h1 at every width.
  Remedy: aria-label 'Panels'; the +/− in an aria-hidden span; drop aria-pressed from Play or keep its label constant; a role=region with a name for the rail's tab panel (or move main); a visually hidden h1 outside the rail. (effort 1-3 h)
  Refs: shell.html:48 (aria-label="The rail"); style.css:689-690 (.lg-head::after '−'/'+' joins the name); app.js:8793 (textContent 'Pause' with aria-pressed true); shell.html:38-104 (nav.rail holds the h1, the tabs and the Now tab's narrative); shell.html:384 (main holds only #maplayer); app.js:7065, 8979 (rail-hidden below 1080 px: the rail, with the h1, leaves the tree).
  Evidence: docs/audit-post8-evidence/a11y/kbd-h-1600x900-axtree.json and kbd-1600x900-axtree.json (Chromium's tree: 'tablist The rail', 'button Key +', landmarks navigation/region/main); docs/audit-post8-evidence/a11y/fu-1600x900.json step 'Play (real click)' (name 'Pause', aria-pressed true); docs/audit-post8-evidence/a11y/fc.json full-dossier step (headings 'H3 Who record', 'H3 How many record', 'H3 Where reconstruction', 'H3 Its day derived').
- **A11Y-11 · S4 / P4 · optional-improvement · inherited · confirmed.** Visitor-facing jargon and overloaded letters: 'anchors', 'Plotted leg', 'interpolated', 'G.Q.G.', and three different A/B/C scales (position, timing, appearance) shown side by side ('Position B · Timing B').
  Observed: As in the title; the sources sheet defines 'anchors' only indirectly ('a route between anchors').
  Expected: One word per idea in visitor text ('plotted position', 'move'), and grade letters always with their scale named ('timing grade B').
  Remedy: Reword in the next data/presentation pass (CONF_INTERP is guarded: a data task). (effort 1-2 h)
  Refs: app.js:7730 (CONF_INTERP: 'between two plotted anchors', guarded); app.js:8004 (day-track note: 'anchors graded A/B/C as in the data'); app.js:6578 (LABELS.reading.leg 'Plotted leg'); app.js:7925-7928 (march row 'the plotted leg's length'); app.js:7987 (timing row '· grade B ·').
  Evidence: docs/audit-post8-evidence/a11y/jargon.json (anchor 15, leg 7, interpolat 11 visitor strings); docs/audit-post8-evidence/a11y/fu-1600x900.json dossier step ('Position: estimated Position B Timing B ...').
- **A11Y-12 · S4 / P4 · optional-improvement · accepted-compromise · confirmed.** Small type: 42-47% of visible texts on the main screens are 10.5-11.5 px (controls, tabs, timeline labels, tags), all at or above the project's 10.5 px floor.
  Observed: As in the title.
  Expected: No WCAG minimum; 12 px is a common floor for interface text.
  Remedy: Consider t-small 12 px for controls when the layout is next revisited. (effort hours, with the visual limits re-measured)
  Refs: tokens.js:51 (t-micro 10.5px, t-small 11.5px).
  Evidence: docs/audit-post8-evidence/a11y/fu-1600x900.json step 1 small (44 of 105 texts under 12 px; 0 under 10.5); zoom.json 1280x720 (42/95); phone.json (16/49).
- **A11Y-13 · S4 / P4 · optional-improvement · inherited · confirmed.** Polish seen on the way: the speed group shows ½× pressed while the opening plays at 4×; the phone caption starts with two orphan separators ('· ·') because the act and phase names shrink to 0 px; the vantage row overlaps the dispatch card's top at 800x450; the grip looks like a drag handle but a swipe does nothing.
  Observed: As in the title.
  Expected: The indicator shows the speed in force; no orphan separators; no overlap; a handle that can be dragged or does not look like one.
  Remedy: Small CSS/JS fixes. (effort 1-3 h)
  Refs: style.css:362-363 (.cap-ph, .act shrink to min-width 0); app.js:7371 (caption markup with its separators); shell.html:62 (the grip).
  Evidence: docs/audit-post8-evidence/a11y/fu-1600x900-03-opening-playing.jpg (½× pressed while 'the clock plays'); docs/audit-post8-evidence/a11y/phone-03-explore.jpg (caption '· · interval Friant's...'); docs/audit-post8-evidence/a11y/zoom.json 800x450 explore (.tools x .dispatch overlap 319-3069 px²) and zoom-800x450-at2-2-explore.jpg; docs/audit-post8-evidence/a11y/phone.json step 'drag up 300 px from the grip' (sheet stayed closed).

## Carried from the previous audit (docs/FINAL_AUDIT.md 2.7)
- A-1 single-key shortcuts (WCAG 2.1.4): **fixed**. docs/audit-post8-evidence/a11y/fu-1600x900.json steps 'set-up: the switch ... Space' and 'Esc, then 2 with the shortcuts off' (presentation stayed 'study'); the switch's state in aria-pressed, its words in the overlay.
- A-2 focus on undrawn map items (2.4.7, 2.4.11): **fixed (drawn at the next frame)**. docs/audit-post8-evidence/a11y/mapfocus.json: 18 map stops by real Tab, all at opacity 1 on screen after frames (7 forced forward: 'ml-forced'); at 120 ms on this starved machine 7 were still at (0,0), opacity 0: the gap is one frame of the app, seconds here, about 16 ms on a device.
- A-3 timeline targets (2.5.8): **fixed / accepted**. docs/audit-post8-evidence/a11y/fu-1600x900.json and zoom.json targets: every desktop target 24 px or more or spaced, but the phases (16 px boxes, their ::before extends the hit area to 31 px, style.css:276) and the 25 event markers (11.3-14.1 px: decision 167's essential exception); phone: every target 44 px but the markers (phone2.json Menu step).
- A-4 first screen at 390 px: **superseded (the phone layout, decisions 223-232)**. docs/audit-post8-evidence/a11y/phone.json first screen and explore: no cut text but the caption's event, no overlaps, no failing target.
- A-6 ring 1 px, no main, skipped heading: **fixed**. docs/audit-post8-evidence/a11y/kbd-h-1600x900-stops.json and mapfocus-ring-layersbtn.jpg (2 px rings once the .18 s transition has had a frame; the stops read here at 120 ms, and one at 1.2 s, show 0 px because no frame was drawn in between), kbd-h-1600x900-axtree.json (main landmark; h1, h2, h3 in order).
- SW-3 hidden panels in the Tab order: **fixed**. docs/audit-post8-evidence/a11y/kbd-h-1600x900-stops.json: 47 stops, none in the closed dossier, the hidden layers panel or the tour bar.
- SW-4 the sources sheet a modal dialog: **fixed**. docs/audit-post8-evidence/a11y/fu-1600x900.json: focus to its close, every other body child inert but the live regions, Esc back to the opener.
- SW-6 'the sources' text is a focusable region, so the keyboard can scroll it': **fixed (verified)**. docs/audit-post8-evidence/a11y/sheetkeys.json: with smooth scrolling off, PageDown, ArrowDown, Space, End and Home scroll the sources sheet and the ? overlay from their text regions (0->644->684->1,328->32,122->0); the zero readings in mapfocus.json and zoom.json were smooth-scroll animations waiting for frames on the starved machine (the control page scrolls either way: ctl-scroll.json).
- S-6 reduced motion in the stylesheet and live: **fixed (CSS verified here; the live JS switch held by the self-test's rmLive block)**. style.css:700-702; docs/audit-post8-evidence/a11y/fc.json: transitions 0s once reduce was emulated; the camera tests there are inconclusive (no frame was drawn in 3 s on the starved machine, with reduced motion on or off).

## Not checked
- No screen reader or other assistive technology (NVDA, JAWS, VoiceOver, TalkBack, speech input, switch access) was available: names, roles and live regions were read from Chromium's tree, not heard; docs/step3-evidence/sr-session.md holds no item results.
- No real mobile browser: the phone is desktop Chromium emulating an iPhone; Safari/WebKit's touch-action, pinch and VoiceOver behaviour unverified (A11Y-05).
- Forced colours only in Chromium's emulation (its default light palette), not Windows contrast themes or Firefox.
- Firefox and Safari not run; no GPU; every time here is SwiftShader on a container shared by other jobs (load average 18-37).
- Text-only zoom (1.4.4 by text size alone) not emulated; page zoom stands in for it.
- The opening's played stretches were cut short by 'Next again' (each would take many real minutes here); the self-test holds them.
- Live-region announcements were read as DOM text, not heard; their timing and duplication by a screen reader unverified.
- Cognitive load, plain-language reading level and colour-vision simulations were not measured beyond the words read here.

## Evidence index
Scripts: `tools/audit-post8/a11y/` (`alib.js` shared helpers; `fu.js`, `kbd.js`, `mapfocus.js`, `sheetkeys.js`, `ctl-scroll.js` with `ctl-scroll.html`, `zoom.js`, `phone.js`, `phone2.js`, `fc.js`, `jargon.js`, `leaks.js`, `digest.js`, `result-data.js`, `result-src.js`, `readme-fill.js`).

- first use at 1600x900 (record and 13 screenshots): `fu-1600x900-01-first-screen.jpg`, `fu-1600x900-02-opening-1.jpg`, `fu-1600x900-03-opening-playing.jpg`, `fu-1600x900-04-opening-2.jpg`, `fu-1600x900-04-opening-3.jpg`, `fu-1600x900-04-opening-4.jpg`, `fu-1600x900-05-opening-end.jpg`, `fu-1600x900-06-playing.jpg`, `fu-1600x900-07-dossier.jpg`, `fu-1600x900-08-sources.jpg`, `fu-1600x900-09-after-esc.jpg`, `fu-1600x900-10-help.jpg`, `fu-1600x900-11-sources-sheet.jpg`, `fu-1600x900.json`
- keyboard on a visitor page, stopped after 12 stops (card steps, accessibility tree, 4 ring clips): `kbd-1600x900-axtree.json`, `kbd-1600x900-ring-001.jpg`, `kbd-1600x900-ring-010.jpg`, `kbd-1600x900-ring-011.jpg`, `kbd-1600x900-ring-012.jpg`, `kbd-1600x900.json`
- keyboard on the harness page (record, 47 stops, accessibility tree, Watch and Clean screenshots): `kbd-h-1600x900-axtree.json`, `kbd-h-1600x900-clean.jpg`, `kbd-h-1600x900-ring-001.jpg`, `kbd-h-1600x900-stops.json`, `kbd-h-1600x900-watch.jpg`, `kbd-h-1600x900.json`
- map stops after frames, Layers by keys, ring, key toggle, sheets (smooth-scroll readings superseded by sheetkeys): `mapfocus-last-map-stop.jpg`, `mapfocus-layers-open.jpg`, `mapfocus-ring-layersbtn.jpg`, `mapfocus.json`
- keyboard scrolling of both sheets with smooth scrolling off, after the control: `sheetkeys.json`
- the control page's keyboard scrolling: `ctl-scroll.json`
- 1280x720, 200%, 400% and 320 px (record and screenshots; caption crop): `zoom-1280x720-at1-1-first.jpg`, `zoom-1280x720-at1-2-explore.jpg`, `zoom-1280x720-at1-3-help.jpg`, `zoom-1280x720-at1-4-panels.jpg`, `zoom-1280x720-at1-5-sources.jpg`, `zoom-1280x720-at1-6-dossier.jpg`, `zoom-1280x720-at1-caption-crop.jpg`, `zoom-320x256-at4-1-first.jpg`, `zoom-320x256-at4-2-explore.jpg`, `zoom-320x256-at4-3-help.jpg`, `zoom-320x256-at4-4-panels.jpg`, `zoom-320x256-at4-5-sources.jpg`, `zoom-400x225-at4-1-first.jpg`, `zoom-400x225-at4-2-explore.jpg`, `zoom-400x225-at4-3-help.jpg`, `zoom-400x225-at4-4-panels.jpg`, `zoom-800x450-at2-1-first.jpg`, `zoom-800x450-at2-2-explore.jpg`, `zoom-800x450-at2-3-help.jpg`, `zoom-800x450-at2-4-panels.jpg`, `zoom-800x450-at2-5-sources.jpg`, `zoom.json`
- phone gestures with the zooming pinch last, the Menu, held landscape: `phone2-05-after-timeline-pinch.jpg`, `phone2-06-menu.jpg`, `phone2-09-landscape.jpg`, `phone2-10-landscape-panels.jpg`, `phone2.json`
- phone first run (valid up to its timeline pinch, which zoomed the page 5x; later shots show the zoomed page): `phone-01-first.jpg`, `phone-02-opening-1.jpg`, `phone-03-explore.jpg`, `phone-04-sheet-open.jpg`, `phone-05-after-drags.jpg`, `phone-06-after-pinch.jpg`, `phone-07-menu.jpg`, `phone-08-dossier.jpg`, `phone.json`
- forced colours, the full dossier's targets, reduced motion, the press-D hint: `fc-01-first.jpg`, `fc-02-explore.jpg`, `fc-03-viewmode.jpg`, `fc-04-tools.jpg`, `fc-05-timebar.jpg`, `fc-06-tabs.jpg`, `fc-07-focus.jpg`, `fc-08-legend.jpg`, `fc-09-layers.jpg`, `fc-10-dossier.jpg`, `fc-10b-full-dossier.jpg`, `fc-11-rm-pratzen.jpg`, `fc-12-tour-hint.jpg`, `fc.json`
- the seven full dossiers' 'Dated by' rows as drawn: `leaks-timing-dated-by-last-dossier.jpg`, `leaks-timing.json`
- the sources sheet as drawn: internal references in context: `leaks.json`
- lang-scan's visitor strings: jargon and internal references by pattern, with file:line: `jargon.json`
- the structured result: `result.json`
