# v-batch-sim: verification of 14 minor and polish findings (state #1-#7, interaction #1-#7)

Audited commit 58a6314 (application files identical to origin/main 43e3e5b), build `austerlitz-command-map.html` md5 f10fe585c46aea576f436ed51ac46f83.
Method: code reading at HEAD, with every cited range and every origin count reproduced by `tools/audit-post8/verification/v-batch-sim/code-checks.sh` (output saved in `docs/audit-post8-evidence/verification/v-batch-sim/code-checks.txt`), and re-reading the area auditors' saved measurements. No browser run (budget; none of the 14 is S1/S2 and code reading decided each).

| finding | verdict | severity/priority | correction |
|---|---|---|---|
| state #1 | CONFIRMED | as filed | none |
| state #2 | CONFIRMED | as filed | none |
| state #3 | CONFIRMED | as filed | none |
| state #4 | CONFIRMED | as filed | none |
| state #5 | CONFIRMED | as filed | none |
| state #6 | WEAKENED | S4/P4 | severity: S4; priority: P4 |
| state #7 | CONFIRMED | as filed | none |
| interaction #1 | CONFIRMED | as filed | none |
| interaction #2 | CONFIRMED | as filed | none |
| interaction #3 | CONFIRMED | as filed | none |
| interaction #4 | CONFIRMED | as filed | category: confirmed-defect |
| interaction #5 | CONFIRMED | as filed | none |
| interaction #6 | CONFIRMED | as filed | none |
| interaction #7 | CONFIRMED | as filed | none |

## state #1: CONFIRMED

Method: code reading at HEAD + archive origin check + re-read of the auditor's measured evidence.

What I checked: app.js:4193-4208 setChapter calls setHighlight, setClock(chapterClock,{force}), flyTo, never stopPlay; applyTour app.js:4674 and the phase/act buttons app.js:7487, 7554 do; the 4D comment app.js:8827 says 'the tour and the themes stop the clock'; followActive app.js:8906 (playing&&!freeCam&&!_tw.cam) so Follow takes the camera once flyTo's tween ends. Evidence props-bundle.txt B4 (theme 'plan' chosen while playing: clock 04:00 then 04:10 two seconds later, playing true) and props-bundle3.txt D2 (camera 7.0, 63.0, 76.3 units from the theme's target at 1.7, 3.7, 7.7 s). Inherited: archive/stage4d-9b13adbf.html setChapter has no stopPlay (docs/audit-post8-evidence/verification/v-batch-sim/code-checks.txt).

Judgement: Severity S3/P2 and the remedy (stopPlay() at the top of setChapter when cid is set) agreed; no decision conflicts (the 4D comment states the intended behaviour).

## state #2: CONFIRMED

Method: code reading at HEAD (fade arithmetic) + archive origin check + re-read of B5/B13/D1.

What I checked: rebuildOverlays app.js:3103,3113-3114 makes the current group the outgoing one and sets ovFadeIn=0, ovFadeOut=1 whatever it reached; applyOverlayOpacity app.js:3185 draws the outgoing group at 0.9*ovFadeOut; the scene tween app.js:3475-3476 (ovFadeOut=1-k/0.42, ovFadeIn=(k-0.34)/0.66, TRANS_MS 2600) gives the 1.09 s fade-out and a zero fade-in for any phase left within 0.34*2.6=0.88 s, so a phase stepped through in 0.5 s goes from 0.00 to 0.90 (props-bundle3.txt D1, 4 of 4 steps). props-bundle.txt B5: dwell off at 4x, 5 of 9 boundaries pop (e.g. 08:00 phase 0.13 -> 0.90); dwell on 0 of 9. Present in archive/step5c-45f8f662.html and stage8e (inherited).

Judgement: Same expression as interaction #3 (app.js:3185) but a different defect (interrupted fade vs missing layer factor); one fix covers both: start the outgoing group from the opacity it had reached, layer factor included.

## state #3: CONFIRMED

Method: code reading at HEAD + archive origin check + re-read of B9.

What I checked: loop app.js:9125 returns on idle/waiting frames before lastFrame=now (app.js:9129-9130), so the next active frame's dt is min(120, now-lastFrame)=120 ms; tickClock app.js:8814-8819 then advances 0.12 s x MIN_PER_SEC 10 x speed: 0.6 clock min at 1/2x. Reached when Play starts on a keydown (the capture listener app.js:7098-7099 only sets lastInput; togglePlay app.js:8788 sets playing in the same dispatch) with no active frame just before; a mouse press runs frames between pointerdown and click, so the mouse path is not affected. props-bundle.txt B9: 0.600 (1/2x) and 3.648 (4x) clock min on the first frame. Same loop in archive/step4-833743c6.html (inherited).

Judgement: Scope: keyboard (Space shortcut / Enter on the focused button) after the page went idle. S4/P4 agreed.

## state #4: CONFIRMED

Method: code reading at HEAD + decision 92's record + re-read of B6.

What I checked: knowAtClock app.js:4288 clears knowKey once per clock minute; knowledgeOf app.js:4133-4152 then fills knowCache from posNow at the instant first asked (hasLOS, mist), so within a minute the reading is that of whatever fractional clock came first. Decision 92 (docs/STAGE5_SPEC.md:179) is 'the reading at the clock's minute'. props-bundle.txt B6: 29 (fr) and 38 (al) of 838 formation-minutes differ at m+0.9 between reaching it via m+0.1 and seeking it directly (e.g. lich 08:07 'unknown' vs 'seen'). Same code in archive/step4-833743c6.html and step5c (inherited).

Judgement: Remedy feasible (evaluate the reading at floor(clock) when the cache is filled); it changes no guarded data but is the reading's model, so the self-test's 10-minute reading checks (5E) must be re-run. S4/P3 agreed.

## state #5: CONFIRMED

Method: code reading at HEAD + archive origin check + re-read of P4.

What I checked: jumpEvent app.js:7596-7606: forward takes the first start with ts[i]>t+1.5 (back: ts[j]<t-1.5), so from under 1.5 min before a start it goes to the next one. The dwell's ease-in covers a quarter second's travel (app.js:8822-8826: 1.25 clock min at 1/2x), so a pause in it leaves the clock inside the margin. props-helpers.txt P4: from one minute before a start, 20 of 21 starts skipped. The same 1.5 margin in archive/stage2c-68ac7721.html (inherited).

Judgement: Symmetric for 'previous event' from just after a start. Remedy: a margin of about 0.01 min keeps 'standing on a start goes to the next'. S4/P4 agreed.

## state #6: WEAKENED

Method: code reading at HEAD (rail handlers, CSS touch-action, DOM); no browser run (a native context menu cannot be produced in the headless pinned browser).

What I checked: app.js:7529 pointerdown sets dragging, stops Play, captures and seeks for any button; app.js:7530 pointermove seeks while dragging without e.buttons; app.js:7531 only a window pointerup clears it; no pointercancel/lostpointercapture handler in app.js (grep: only the canvas's pointercancel at app.js:6892). style.css:344 gives the rail touch-action:none, and touch has no hover moves: after a cancelled touch the next touch's own pointerdown seeks and its pointerup clears dragging, so the touch path has no visible consequence. The remaining path is a mouse right-press on the rail (no contextmenu suppression there: app.js:6856 is the canvas's) on a platform whose context menu swallows the release; then hovering the rail would scrub until the next click anywhere. Not reproduced.

Correction: title: The time rail seeks on any mouse button and has no cancel path: a right-press on the rail moves the clock and stops Play; where the context menu swallows the release (platform-dependent, unverified), hovering the rail then scrubs until the next click; severity: S4; priority: P4; observed: Code facts confirmed (any button seeks; no e.buttons test; no pointercancel/lostpointercapture). The cancelled-touch consequence does not arise (touch-action:none, no touch hover). The lost-pointerup-after-context-menu consequence not reproduced.

Judgement: Certain part: a right-press or middle-press on the rail seeks the clock and stops Play. Remedy agreed (ignore e.button!==0 on pointerdown, test e.buttons in pointermove, end on pointercancel/lostpointercapture). Origin inherited (same handlers in archive/step5c).

## state #7: CONFIRMED

Method: code reading at HEAD + archive origin check.

What I checked: lowTier set once in init app.js:621-622 (window area under 900x700 or a mobile UA); used for pxRatio app.js:602, sun.castShadow app.js:646, the shadow map size app.js:647, groundDetail(!lowTier) app.js:657, FX.scale app.js:3549; onResize app.js:7104-7119 calls renderer.setPixelRatio(pxRatio()) but never re-evaluates lowTier. The area test predates Stage 8 (archive/step5c-45f8f662.html); the shadow switch is decision 236 (step 6), the near detail's switch 8F (decision 247 (a)). Cited line 661 is the overlay root, not the tier; the relevant lines are 646-657.

Judgement: Decision 236's comment names 'a small window' as a low-tier case; it does not decide resizing, so optional-improvement is right. Origin mostly inherited; the near-detail part since 8F. S4/P4 agreed.

## interaction #1: CONFIRMED

Method: code reading at HEAD (tip placement, hoverability, z-index) + re-read of s13-tip-covers.json (real mouse, both sizes).

What I checked: tipShow app.js:7439-7445 places the tip at r.top-h-8 above the hovered element, centred on it; tipHide waits 150 ms and the tip's own pointerover cancels the hide (app.js:7473), so a pointer moving up from a marker crosses the 8 px gap into the tip and keeps it; #tltip z-index 62 with pointer events (style.css:250-253). s13-tip-covers.json: at 1280x720 the tip box [92,641,472,688] covers the centres of play, next, nextEv, follow; the press at Play's centre hit #tltip, playing false before and after, focus then on body; same at 1600x900 via the phase tips crossed on the way; control (pointer to empty ground for 300 ms first) toggles Play at both sizes.

Judgement: Not a WCAG 1.4.13 failure (the tip is dismissable, hoverable, persistent); a usability defect: one wasted press and focus dropped to body. Remedy must keep hoverability (1.4.13). Origin inherited (roadmap step 5; archive/step5c has the same placement). S3 agreed; P2 or P3.

## interaction #2: CONFIRMED

Method: DOM and CSS reading at HEAD (hit geometry computed) + re-read of s1b-recheck.json.

What I checked: shell.html:315-321: #evmarks is a sibling of #timerail, not inside it, so a press on a marker never reaches the rail's pointerdown (app.js:7529). style.css:379-382: markers 8 px at top:2px in the rail's 24 px band (top 31px, z-index 2) with ::after inset -6px: a 20 px square rotated 45 deg, +-14 px about a centre 6 px down the band, +-21 px when scaled 1.5 (hover, .dw style.css:391); the playhead has pointer-events:none (style.css:350-351). At the band's centre line each marker takes about 16 px: 25 markers give about 400 px less overlaps, consistent with the measured 356 of 1,570 px (22.7%). s1b-recheck.json: in the 04:15 hold a 200 px drag from the playhead left the clock at 04:15. Inherited (archive/step5c has the same marker CSS).

Judgement: Reached whenever the clock stands on an event start (event keys, marker click, theme, dwell hold). S3/P3 agreed; decision 167 exempts the markers' size, not this.

## interaction #3: CONFIRMED

Method: code reading at HEAD + archive origin check + re-read of s11b-arrows-tier.json.

What I checked: applyOverlayOpacity app.js:3181-3185: current group base*ovFadeIn with base=layerOn.arrows?0.95:0, outgoing group 0.9*ovFadeOut with no layer factor; rebuildOverlays app.js:3114 sets ovFadeOut=1 on every non-instant rebuild. s11b-arrows-tier.json: Movement off at 08:00, PageDown to 08:45: the 08:00 group's 41 materials at 0.873 on the first frame, 28 of 40 frames above 0.1. The same expression in archive/step5c-45f8f662.html (inherited).

Judgement: Scope: every non-instant phase change with the layer off (setClock with instant:true retires the old group at once; under reduced motion the tween's 1 ms duration ends the fade on the next frame). Shares app.js:3185 with state #2; not a duplicate (different missing term), one fix covers both. S3/P2 agreed: the visitor turned the layer off.

## interaction #4: CONFIRMED

Method: code reading at HEAD + 8A's record (docs/STAGE8_SPEC.md 13.1) + re-read of s3-selection-reading.json and s12-act-leak.json.

What I checked: compactCard app.js:7794 computes s2 from stateAt with no reading test; the 'Doing now' row app.js:7818 and the 'From HH:MM' row app.js:7819 are written regardless of readHidden (app.js:4325-4329), while posRow gives 'Not known to ...'. s3-selection-reading.json reading0730: under the Allied reading at 07:30 Saint-Hilaire's card reads 'Doing now Standing in fog behind Puntowitz, hidden from the plateau' and, two rows below, 'Where Not known to Allied headquarters at 07:30'. s12-act-leak.json: Napoleon's reading 480 hidden formation-clocks with a Doing now text, 320 naming a place; Allied 798 and 304; examples 'At the southern end of the Pratzen plateau' (dok), 'Formed near Augezd before first light' (kienmayer).

Correction: category: confirmed-defect

Judgement: 8A's review (docs/STAGE8_SPEC.md:1684-1685) kept act texts as 'orders, not places'; that is an implementation judgement recorded under decision 251 (a), and the texts themselves are new evidence against its premise (several are positions, and the row is labelled 'Doing now'), so the implementation contradicts decision 251's stated scope ('hidden from every place a visitor could read its position from'). The wording of the replacement row is the owner's to choose. Origin inherited (the row predates 8A; 8A's fix left it). S3 agreed; P2 or P3.

## interaction #5: CONFIRMED

Method: code reading at HEAD + archive origin check.

What I checked: paintSituation app.js:7352-7377 keys on playing and the dwell's events (app.js:7364-7365) and paints the dwell's list when DWELL.st is set; stopPlay app.js:8781-8787 clears DWELL.st (dwellReset app.js:8836) and playing but does not repaint; paintSituation is called from paintTimeline (app.js:7613, via setClock) and syncVis (app.js:9067), so after a pause in the hold the caption keeps the dwell's names until the clock or the panels change. A seek to the same clock names only liveEvents' first (app.js:7375-7376). Same key in archive/step5c (inherited).

Judgement: Both captions name true events at that minute; the cost is inconsistency, not a false statement. S4/P4 agreed.

## interaction #6: CONFIRMED

Method: code reading at HEAD + re-read of s6-panels-while-dragging.json.

What I checked: sheetOpened app.js:6755 sets inert and focus only; the canvas's pointermove app.js:6868-6881 has no sheet test and the drag ends only at the window's pointerup/pointercancel (app.js:6882, 6892); a captured pointer keeps delivering to the canvas under the inert page. s6 help-mid-drag: the target moved -60.8 to -82.8 (22 units for 60 px) while the '?' sheet was open; nothing held after release. Same sheetOpened in archive/step5c (inherited).

Judgement: Reached only by pressing '?' (or Shift+/) with a mouse button held: S4/P4 agreed.

## interaction #7: CONFIRMED

Method: code reading at HEAD + re-read of s7-resize-rotate.json.

What I checked: onResize app.js:7104-7119 calls syncDock and syncPhone but no shown()/focusTo hand-on (app.js:7189-7203 is used by panel closes). s7-resize-rotate.json: layers-at-1024 focus #layersbtn; at 700 (phone layout, the Layers button behind the Menu) focus body, and still body at 390 and back at 1600 (never restored).

Judgement: Same class as SW-5 (docs/FINAL_AUDIT.md:443), on the resize path SW-5's fix did not cover; not a WCAG failure. Origin inherited (the phone layout, roadmap step 6 item 3). S4/P4 agreed.

## Extra issues

- A right-press (or middle-press) on the time rail seeks the clock and stops Play (S4). app.js:7529: the rail's pointerdown runs stopPlay and setClock(toClock(e.clientX)) without testing e.button; no contextmenu handler on the rail (app.js:6856 is the canvas's). Code reading only. Folded into the correction of state #6; listed so the register does not lose it if state #6 is dropped.

## Not done

- No browser run: every verdict rests on code reading at HEAD (58a6314, application files identical to origin/main 43e3e5b; build md5 f10fe585) and on re-reading the area auditors' saved measurements; their numbers were not re-measured.
- state #6's context-menu consequence not reproducible in the headless pinned browser (no native context menu); left unverified.
- Origins checked by counting the same code in archive/step5c-45f8f662.html, step4-833743c6.html, stage4d-9b13adbf.html, stage2c-68ac7721.html and stage8e-f3c3f3af.html, not by git blame.
