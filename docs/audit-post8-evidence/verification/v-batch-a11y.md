# v-batch-a11y: verification of a11y findings #1-#12 (minor and polish)

Audited: application files identical to origin/main 43e3e5b; build `austerlitz-command-map.html` md5 f10fe585c46aea576f436ed51ac46f83.
Method: code and data read at HEAD; the auditor's evidence files and screenshots re-read (cropped where a claim rests on a picture);
two cheap reproductions (no app page booted): `tools/audit-post8/verification/v-batch-a11y/rail-cover.js` (the markers' hit coverage of
the rail from EVENTS and the CSS) and `pinch-control.js` (the auditor's CDP pinch on a minimal page in the same phone emulation).
Result object: `v-batch-a11y.json`; outputs `v-batch-a11y-rail-cover.jsonl`, `v-batch-a11y-pinch-control.json`.

| # | verdict | sev/pri (mine) | one line |
|---|---|---|---|
| 1 | WEAKENED | S3 P3 | title-only on the main screen, yes; but the derived caveats are visible in the sources sheet (data.js:800, rendered app.js:8680), and the cut caption's parts are drawn on the timeline (decision 159) |
| 2 | CONFIRMED | S3 P2 | every quoted internal reference is in the rendered notes (app.js:8553, narrative.js:41/545/617/624/632, data.js:158/252/254/267/434/506/534) |
| 3 | CONFIRMED | S3 P3 | markers are siblings over the rail (shell.html:315-321); hit coverage 63.2% of the 374 px phone rail (88.5% 07:00-15:00), 22.5% of 1,572 px desktop |
| 4 | WEAKENED | S4 P3, untested | the emulation pinch began on the open event dossier (phone2 step 2 opened it; drawer y 259-723) and on the timeline; a control shows the emulation honours canvas touch-action:none; only the untested status stands |
| 5 | CONFIRMED | S3 P3 | 0 forced-colors rules; states by background; 22 of 25 markers borderless (3 decisions bordered) |
| 6 | CONFIRMED | S3 P3 | setPop moves no focus on open (app.js:7071-7076); #layerpop after five vantage buttons; select() keeps focus on a shown map item (app.js:6262) |
| 7 | CONFIRMED | S3 P3, accepted-compromise | card and stops [0,5,6,7] silent on reconstruction; TOUR[8] says it but is not in the opening (decision 114); key closed (decision 49) |
| 8 | CONFIRMED | S4 P3/P4 | the hint names D only; D muted with the switch off (app.js:6720-6721); Esc not named; "guided tour" during the opening |
| 9 | CONFIRMED | S4 P4 | names and landmarks as stated (shell.html:38-48, 384; style.css:689-690; app.js:8793, 8131) |
| 10 | CONFIRMED | S4 P4 | jargon strings as stated (app.js:6578, 7730, 7805, 8004; data.js:148) |
| 11 | CONFIRMED | S4 P4 | range 42-50% on desktop states (not 42-47%), 33% on the phone; none under 10.5 px |
| 12 | WEAKENED | S4 P4 | (a) contradicted by code (setSpeed(4) presses 4×); (b) and (d) confirmed; (c) visible only with the Panels open |

## Details

**#1.** `app.js:7368-7370` writes FLAT_NOTE and SEP_NOTE (`:7347-7348`) only into `title=` on non-focusable spans (also the Now tab, `:7380`).
The vantages' "a preset view, not what he saw" is only in `shell.html:129,131` titles (grep finds it nowhere else). The relief reason
(`app.js:2581`) and the squeezed key's reason (`:5639`) are titles. But `SOURCE_NOTE.body[6]` (`data.js:800`) states both derived caveats
("plots formations and not losses ... a spatial test, not a historical statistic") as visible text in Accuracy and sources (`app.js:8680`),
reachable by keyboard and touch; "never see" is wrong. The caption's ellipsis is decision 159's fitting (`docs/ROADMAP.md:69`); the act and
phase it cuts are drawn whole on the timeline's rows. Origin inherited (99733eb, 0a19964).

**#2.** Code and data as quoted; claim notes rendered by `claimDetail` (`app.js:8640`), timing notes by the Dated-by row (`app.js:7990`).
All strings predate Stage 8 (git log -S: 0a19964, 714226f, d8cac0a, 69031df). Remedy is a guarded data task.

**#3.** `rail-cover.js`: at the rail's centre line a plain marker's rotated 20 px hit square is 16.3 px wide, a decision marker's 23.1 px;
25 markers, 21 distinct starts; phone 374 px: 63.2% (07:00-15:00: 88.5%); desktop 1,572 px: 22.5% (33.1%). The auditor's 66/91 and
24/34 are within 3 points. `#evmarks` is a sibling of `#timerail` (`shell.html:315-321`), so a marker's pointerdown never reaches
the rail's scrub handler (`app.js:7528`). Origin inherited (1613575, step 6 item 3 Part B).

**#4.** True: no repository check drives the map's pinch with browser input (`app.js:9262-9266` synthetic; `tools/visual/harness.js:422`,
`tools/stage8/carried.js:111` taps only). Not shown: a fault. In `phone2.json` step 2 the tap at 30% hit `button.ev-mark.dec` (clock
240 to 505): its click selects the event (`app.js:7523`), which opens the event dossier, on a phone a sheet 464 px high above the timeline
(`style.css:817-819`, y 259-723). Step 4's points (160,360) and (230,430) are inside it; `phone2-05-after-timeline-pinch.jpg` shows the
dossier ("Command decision...") from y about 260. `phone.json`'s pinch had a finger on the timeline. The control (`pinch-control.js`,
Chromium 141, phone context, phone2.js's touch parameters): canvas `touch-action:none` kept visualViewport at 1 and delivered both pointers
(20 moves, 0 cancels), also with the main thread busy 600 ms a frame; `touch-action:auto` zoomed 1 to 3.53 with 2 pointercancels. So
the emulation honours `touch-action:none`, and the audit's zooms were pinches on the interface, which the finding itself expects to zoom
the page. Corrected: untested, S4 P3; a device check (or a CDP pinch on the map with no panel open) remains.

**#5.** grep for forced-colors, forced-color-adjust, -ms-high-contrast in style.css, shell.html, app.js and fonts.css: 0 hits. Pressed states
are drawn by background (`style.css:43,112,439`) or a border-left colour and tint (`:511`). `.ev-mark` has `border:0` (`:380`); only `.dec`
(3 of 25 EVENTS) is bordered (`:387`). Emulation only; not an A/AA criterion by itself.

**#6.** `setPop` (`app.js:7071-7076`) moves focus only on close. The DOM order is `#layersbtn` (`shell.html:122`), the five visible vantage
buttons (`:128-132`), then `#layerpop` (`:137`), so its first control is the sixth Tab. `select()` moves focus into the dossier only if
the opener is no longer shown (`app.js:6262`). No owner decision keeps focus on the opener.

**#7.** The card (`shell.html:366-374`) and `TOUR[0,5,6,7]` say nothing about reconstruction or grades; `TOUR[8]` does but is not among
`OPENING.stops` (`app.js:4710`); `ML.legendOpen` is false (`app.js:5016`). Accepted under decisions 114 (`docs/STAGE7_SPEC.md:161`),
49 and 108. The finding asks the owner and does not override those decisions.

**#8.** `shell.html:58`. `hideDispatch` is set only by the tour and the opening (`app.js:4650, 4725`). `setDispatchVisible` is called only
from KEYS row d (`:6679`), which is muted with the switch off (`:6720-6721`). Esc and leaving the tour restore the text
(`:9071-9072, 4662, 4803`); the hint names neither.

**#9.** As stated: `shell.html:42,48,38-104,384`; `style.css:689-690` (the "+" enters the name: `button Key +` in the auditor's tree);
`app.js:8793`; `app.js:8131` (the tag inside the h3); `style.css:35` (the rail hidden below 1080 px).

**#10.** As stated (`app.js:6578, 7730, 7805, 7951, 8004`; `data.js:148`). CONF_INTERP and the designation are guarded.

**#11.** `tokens.js:51`. `fu-1600x900.json` small: 44/105, 67/135, 68/153, 66/140; `zoom.json` 42/95, 45/100; `phone.json` 16/49.

**#12.** (a) `openingStretch` calls `setSpeed(OPENING.SPEED)` (`app.js:4765`), and `setSpeed` presses the 4× button (`:8797-8802`). Its
other writers are `openingHalt` (`:4789-4791`), the click (`:6953`), `speedNext` (`:8812`) and the self-test. The self-test holds the speed at 4
during the stretch (`:12410`). The screenshot does show ½× styled pressed beside "Pause"; with `button.t{transition:all .18s}`
(`style.css:110`), a frame caught at the transition's start under SwiftShader would look like that (not reproduced). (b) The separators are
`flex:none` while the act and phase shrink to `min-width:0` (`style.css:361-363`); `phone-03-explore.jpg` shows "· ·". (c) At 800x450 CSS
px, in the explore state, the 319 px² is the tools box's empty corner (the Field button starts at x about 467; the card ends at 456).
With the Panels open the vantage buttons overlap the card's top edge by about 10 px, covering no text (`zoom-800x450-at2-4-panels.jpg`).
(d) `#dgrip` is a click toggle only (`app.js:9028-9030`), styled as a 40 x 4 bar (`style.css:804`).

## Not done
No browser run of 12(a); no real device for #3 and #4, and no CDP pinch on the app's map with no panel open; no screen reader and no
Windows High Contrast; #3's coverage computed from data and CSS, not measured with elementFromPoint.
