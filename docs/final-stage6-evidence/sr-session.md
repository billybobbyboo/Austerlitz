# The final audits' Stage 6: the screen-reader session and the device checks (a script for the owner)

**Status: prepared, not run.** WP-09 of `docs/ROADMAP_FINAL_AUDIT.md` is done when "an AT session's results [are] recorded item by item with versions"
(CL-REC-05; ChatGPT's CG-F11). This script is for the owner, who runs it; nothing below is recorded until the owner gives the results. The
"expected" column is what this stage's build's DOM says (roles, names, states, live regions), read from `shell.html` and `app.js`; what a screen
reader speaks may differ, and every difference is a finding. It replaces `docs/step3-evidence/sr-session.md` (step 3's script, recorded complete on
the owner's word with no item results, decision 175), whose expected column no longer matches the page (Stage 6 renamed the rail and its tablist,
moved the page's one h1, took Play's pressed state off, added the phase text's button, the card's sentence and its "Show the key", and moves the focus
into a panel opened from the keyboard).

Two device checks the audit could not make here are at the end: the map's pinch on a real phone (CL-UX-06) and the embedded faces' metrics in Safari
(CL-UX-22).

## What to record (for every pair)

| field | NVDA pair | VoiceOver pair |
|---|---|---|
| the build's md5 (`md5sum austerlitz-command-map.html`, or the page's source) | | |
| the operating system and its version | Windows ... | macOS ... / iOS ... |
| the browser and its exact version | Chrome ... | Safari ... |
| the screen reader and its exact version | NVDA ... | VoiceOver (the OS's) |
| the browser's locale (numbers are formatted in it) | | |
| the window size (CSS px) | 1366 x 768 | 1366 x 768 (a Mac) or the phone's |
| the speech rate and the verbosity, if changed | | |

For every item: the mode (NVDA browse or focus, NVDA+Space; VoiceOver's Quick Nav on or off), the result **pass**, **fail** (with the exact speech)
or **n/a**, and anything else heard. A key-driven step is done in focus mode unless it says otherwise (browse mode keeps the page's keys).

## The script

| # | where and what | expected (from the DOM) | a failure | NVDA | VoiceOver |
|---|---|---|---|---|---|
| 1 | Load; do nothing | A dialog "The Battle of Austerlitz", described by the key's sentences, the last "It is a reconstruction from the sources, its certainty graded A to C: the letter beside a name is its position's grade." followed by "Show the key, button"; focus on "Begin (two min), button" | no dialog; no description; Tab leaves the card | | |
| 2 | Tab, Tab, Tab | "Explore on my own, button", then "Show the key, button", then back to "Begin (two min)": the three stay inside the card | focus leaves the card | | |
| 3 | On "Show the key", Enter | the card closes; focus on "Key, button, expanded" (the key's toggle, no "plus" or "minus" in its name); the key's rows readable after it | the card stays; a sign read in the name | | |
| 4 | Reload; Esc on the card | the card closed where it stands; focus "Play, button" (no "toggle", no "pressed") | focus on the page; "toggle button, not pressed" | | |
| 5 | Space on Play; then Space again | its name becomes "Pause, button", then "Play, button"; no pressed state spoken | "Pause, toggle button, pressed" | | |
| 6 | Landmarks (NVDA D; VoiceOver rotor, Landmarks) | "Panels, complementary" (from 1080 px), "Tools, region", "main" holding "The map: formations, events and places", "Timeline, region"; the heading list (NVDA H) starts with "Austerlitz, 2 December 1805: a command map, heading level 1" | the narrative under a navigation landmark; no h1 below 1080 px | | |
| 7 | The rail's tablist | "Panels, tab list"; "Now, tab, selected, 1 of 5"; the arrows (focus mode) move between tabs, not the clock | "The rail" | | |
| 8 | Order of battle: open a formation's full dossier; headings (NVDA H) | "Who", "How many", "Dress", "Where", "Its day", ... each a heading of its own; the layer's tag ("record", "reconstruction", "derived") read after the heading, not in it | "How many record" as one heading | | |
| 9 | Its dossier's pills | "Position: estimated (B)" or "(B, interpolated)"; "Timing: approximate (B)" (or dated (A), inferred (C)); no bare "Position B" or "Timing B" | two letters of two scales side by side | | |
| 10 | "Layers…" by Enter (focus mode) | the panel opens and focus moves into it, on the first ground button ("Landscape, toggle button, pressed"); Esc or its x closes it, focus back on "Layers…" | focus stays on the button; the panel six Tabs on | | |
| 11 | Tab into the map, to a formation's item, Enter | it is selected; its dossier opens with focus on its heading (the formation's name, heading level 2); its x (or Esc) closes it and focus returns to the same map item | focus stays on the item; focus lost on close | | |
| 12 | The Now tab at 09:00 (from 1080 px wide) | the plateau's derived reading followed by its note as text: "The reconstruction plots formations, not losses. ..." | the note only in a tooltip | | |
| 13 | The vantages: press "Zuran" | under the vantages, as text and announced once (a polite live region): "Zuran: a preset view, not what he saw."; "Field" pressed: nothing | silence; the caveat only in the tooltip | | |
| 14 | Press D (with nothing focused) to hide the phase text; read the Now tab | "The phase text is hidden. Or press D." and "Show the phase text, button"; that button shows the text again with focus on its title | "press D" with the single-key shortcuts off | | |
| 15 | "?" then "Single-key shortcuts, toggle button, pressed": Space, Esc; then D | nothing changes; the Now tab's hint no longer names D (item 14's sentence without "Or press D.") | D acts; the hint still names D | | |
| 16 | "Begin the opening" (Menu below 720 px) with the phase text hidden | the Now tab's hint says "during the opening: its words are in the opening's bar" (not "the guided tour"); one polite "Step 1 of 4: ..." | "guided tour" during the opening | | |
| 17 | "Accuracy and sources": the claims index | each kind with its count; the last "Not yet checked: ... Every other statement (463 statements)." | no count for the unchecked | | |
| 18 | The sources sheet as a dialog | focus on "Close (Esc)"; Tab stays inside; browse mode cannot reach the page behind; Esc closes it, focus back on the button | the background read | | |
| 19 | The timeline's groups (focus mode) | the slider "Battle clock" with its value; the events each with its clock and note; the acts and the phases one Tab stop each | a group of many stops | | |
| 20 | "Whose eyes?" (the timeline's button) | "Eyes: everyone. Whose eyes? Everyone (press to change)", no pressed state; a press: "Eyes: Napoleon..." | | | |
| 21 | A window 1000 px wide: the Panels button | "Panels, button, collapsed"; Enter: expanded, the rail shown | the rail shown but not reachable | | |
| 22 | Zoom the browser to 400% (a 1280 x 1024 or 1600 x 900 screen) | the phone layout: the "Menu" button; the timeline's "Phase text, button, collapsed": Enter opens the phase text over the map, focus on its grip ("The phase text in full"); the Menu's "Panels" opens the panels over the screen; "Accuracy and sources" reachable | a control unreachable; the page scrolls sideways | | |
| 23 | Reduce Motion on, keyboard only | Begin, Next: each step a cut | glides | | |
| 24 | A failed start: block cdnjs, reload | an alert dialog "The map cannot start", its reason, focus on "Reload"; nothing else reachable | no message | | |

## Forced colours (Windows only: Settings, Accessibility, Contrast themes; then Chrome)

| # | where and what | expected | NVDA pair (sighted observer) |
|---|---|---|---|
| F1 | The timeline's speeds, the presentation (Study, Watch, Clean), the vantages, the current phase | the pressed one drawn in the theme's selection colours (Highlight), its neighbours not | |
| F2 | The event markers on the timeline | every marker drawn, the French and the Allied in their colours with an edge | |
| F3 | The key opened; the side marks before the landscape's names; the first card's swatches | blue and amber kept, each with an edge | |
| F4 | Layers: the rows on and off | the on rows in the selection colours | |

## The device checks

**CL-UX-06, the map's pinch on a real phone (the owner's iPhone, Safari; an Android phone if one is at hand).** The audit's emulated pinches landed on
the page's own zoom, not the map's.

| # | what | expected | result (with the phone, its OS and browser versions) |
|---|---|---|---|
| D1 | Explore (the card closed), two fingers on the map, apart | the map zooms toward the fingers; the page does not zoom (the panels keep their size) | |
| D2 | Two fingers together | the map zooms out | |
| D3 | A pinch with one finger starting on the timeline | the page may zoom; record what happens and whether a tap then lands where it should | |
| D4 | After any page zoom, pinch the page back | the page at its own scale again; the controls where they were | |

**CL-UX-22, the embedded faces in Safari (the owner's iPhone or a Mac).** The layouts were measured in Chromium; Safari's handling of the faces'
metric overrides is untested, and every italic is synthesized (no italic face is embedded). On the iPhone, at 390 x 844 or its own width:

| # | what | expected | result |
|---|---|---|---|
| S1 | The first card | its sentences whole, its three buttons each on one line, nothing cut | |
| S2 | The timeline's caption at 09:00 in Study | the act and the phase whole or given way whole (no fragment such as "D."), the event's tag whole | |
| S3 | A formation's full dossier | its headings and pills on one line each; the italics (the readings' notes) drawn slanted, legibly | |
| S4 | A screenshot of each, sent with the results | (for the record) | |

## Recorded results

None yet. When the owner gives them, they go in the tables above with the versions, and `CHANGELOG.md` says what was run, by whom, on which build,
and what was found; nothing is marked pass that was not reported so.
