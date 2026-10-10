# Roadmap step 3: the screen-reader session (a script for a person; NOT VERIFIED)

`docs/ROADMAP.md` step 3 ends with one session with a screen reader, to check what the final audit and this step could only read from the
DOM (`docs/FINAL_AUDIT.md` §2.7, "Not verifiable here"). No screen reader was available in the step-3 session, so **nothing below has been
verified**: the "expected" column is what the step-3 build's DOM says (roles, names, states, live regions), read from `shell.html` and
`app.js`; what a screen reader actually speaks may differ, and every difference is a finding to record.

## Set-up

- The built `austerlitz-command-map.html` of the step-3 build, opened online (three.js comes from cdnjs).
- Two pairs: **NVDA (2024.x or later) with Chrome** (the harness's engine) and **VoiceOver with Safari** (the only WebKit check: Safari's
  `inert` and `aria-modal` are the risk).
- A window of 1366 x 768, then 1000 x 768 for items 18 and 19.
- Record for the session: the browser and its version, the screen reader and its version, the operating system, the **browser's locale**
  (numbers are formatted in it), and for every key step the screen reader's **mode** (NVDA: browse or focus, NVDA+Space; VoiceOver: Quick
  Nav off). A screen reader's browse mode keeps the page's own keys, so every key-driven step below is done in focus mode unless it says
  otherwise.
- Write the result into the table's last column as **pass**, **fail** (with the exact speech) or **n/a**.

## The script

| # | where and what | expected (from the DOM) | a failure | result |
|---|---|---|---|---|
| 1 | Load; do nothing | A dialog, "The Battle of Austerlitz", described by its key sentence; focus on "Begin (two min), button". Note whether the polite phase announcement written at load ("04:00. ...") is spoken | the boot line read after the card; no description; Tab leaves the card | |
| 2 | Esc on the card | the card closed where it stands; focus "Play, toggle button, not pressed" | focus on the page | |
| 3 | Reload; Enter on "Begin (two min)" | one polite "Step 1 of 4: The battlefield, 04:00."; focus on Next; a region named "Opening, step 1 of 4 The battlefield" | no message or two; focus on Skip; an unnamed region | |
| 4 | Next | "The clock plays on to step 2 of 4, ..."; one message on arrival; no phase announcement in between | phase announcements while it plays; silence on arrival | |
| 5 | While it plays: Tab to Play, Space (focus mode); then Esc | the stretch paused (the heading "...: paused" is not a live region: note whether anything is spoken); after Esc "The opening has ended. ...", focus on Play | the clock still playing; focus lost | |
| 6 | Reload, Begin; then activate "Watch" with the screen reader's own activation (NVDA browse mode Enter, VoiceOver VO+Space) while the opening runs | the opening ends where it stands (a click alone does what a press does, SW-12), then Watch | the opening still running behind Watch | |
| 7 | The "?" button | a dialog "Keys and controls"; focus on "Close (Esc), button"; Tab: "Single-key shortcuts, toggle button, pressed", then the region "The keys and controls, by group"; Tab returns to Close | the list unnamed; the switch's state not spoken; Tab leaves the dialog | |
| 8 | Click the dialog's heading, then Esc | closed; focus back on "?" | Esc does nothing (SW-6) | |
| 9 | The switch off; close; in focus mode press 2, M, F, ?; then dictate a sentence with a speech-input tool | nothing changes; reopened, the muted rows end "(off)" | any key acts | |
| 10 | **Keyboard alone, no screen reader**, the switch off: 1, H, the full stop; then Space, the arrows, Esc | letters, digits and punctuation do nothing; Space plays; the arrows step the clock; Esc as its row says | a letter acts | |
| 11 | Study: "Accuracy, sources and confidence grades" | a dialog "Accuracy and sources"; focus on "Close (Esc)"; Tab stays inside; browse mode cannot reach the page behind it; Esc closes only the sheet, focus back on the button | the background read or reachable; Space plays; Esc ends a tour behind it | |
| 12 | The rail's tablist | navigation "Army and map controls"; a tablist; "Now, tab, selected, 1 of 5"; the arrows (focus mode) move between tabs, not the clock | the arrows step the clock | |
| 13 | The timeline's groups (focus mode) | the acts ("The Deception, ...", current); the phases; the slider "Battle clock" with its value spoken after a key; the events in time order, each with its clock and its note ("... (the hour is disputed)"). With the slider focused and the clock playing, note how much the value is spoken | a group takes more than one Tab stop; a marker without its clock or note; the title read as well (record) | |
| 14 | Browse mode over the map | the plateau label "graphic, The Pratzen plateau, a derived reading: ..." (phases 0-6); the arrows' marks "(disputed)" read as text; the events' labels with their notes ("... (interval)") | "derived" missing; labels that are not drawn read | |
| 15 | Tab into the map, then through its items | the group named with its keys; each item, when focused, drawn and ringed (a sighted observer confirms) and named ("Saint-Hilaire's Division, French, division, about ..., position grade A") | focus on something not drawn (A-2) | |
| 16 | Activate a formation with the screen reader's own activation; or speech input "click Saint-Hilaire" | it is selected; in Study its dossier "Dossier" opens (note whether anything says so); in Watch the selection chip (a status: note whether it is spoken) | nothing happens (A-2's click) | |
| 17 | In the dossier: "Full dossier"; then let the clock play; then x | focus stays in the dossier across its rebuilds; after x, back on the control that opened it | focus to the page; the closed dossier's buttons still reachable | |
| 18 | At 1000 px, Study: Tab past the tools | the rail is hidden and none of its controls is a tab stop; 2 then Esc shows it beside the dispatch card, never over it | a tab stop off screen; the rail over the card | |
| 19 | At 1000 px, narrow then widen the window back to 1366 px | the docked rail shown and usable | the rail shown but not reachable | |
| 20 | The Command tab, "Whose eyes?" | a group of three toggle buttons; the timeline's button named "Whose eyes? ..." (its visible text is "Eyes: ..."; note the mismatch: an owner question); choose Napoleon's headquarters, then "Begin the opening": the opening under everyone's reading, Napoleon's given back after Skip (note whether the change is spoken) | the reading kept under the opening | |
| 21 | Reduce Motion turned on in the system while the page is open; keyboard only | Begin, Next: each step a cut; the panels do not slide | glides or slides | |
| 22 | A failed start: block cdnjs (the browser's request blocking), reload; then a browser with WebGL turned off | an alert dialog "The map cannot start" read without any action, its reason, focus on "Reload"; nothing else reachable | no message; the first card read instead; the page behind reachable | |
| 23 | Note for the record | the role-less names (`.speeds`, `#scalebar`); the only `h1` is in the rail (hidden below 1080 px); numbers in the browser's locale ("about 6.600" in Dutch); the eye-level caption is not live; the phase flash's words only in `#toast` | (recorded for the owner questions) | |

## Not verified

Everything above. The step-3 build passes its automated checks (`CHANGELOG.md`, roadmap step 3), which read roles, names, focus and live
regions from the DOM; none of them hears a screen reader.
