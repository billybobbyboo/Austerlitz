# First run and opening sequence: specification (Stage 7, Part A)

**Status: Part A written (#43); the owner accepted every recommendation of §7 (decisions 111-122, §0.5). 7B (§6) written, for review:
`CHANGELOG.md`. Part A itself changed no source file, no data and no build:** `check:baseline` passes on the unchanged Stage 6D
build (`austerlitz-command-map.html`, 1,720,613 bytes, md5 `3dd7ca41f73d0e5ffcfe5fa64adc5f51`) before and after it. Written against `main` at
`b1cb13f` (Stage 6D merged as #42; with it Stage 6 is complete); `check:data`'s reference is `archive/stage6b-7fc0f6c3.html`. Line numbers
refer to that commit; the code is the source of truth, not the documents. The next owner decision is 111 (§7). On this build every check
was run: `npm test` (all nine suites and the height guard), `check:data` (121 declarations identical), `check:chronology` (errors 0),
`check:contrast` (5,354 elements, 0 below AA, 0 below 10.5 px) and `check:visual` ("STAGE0: all checks passed", 23 views, the self-test 203
of 203); details in `CHANGELOG.md`.

Scope: the Stage 7 line of `docs/VISUAL_AUDIT.md` ("Stage 7, first run and opening sequence", `:163`), which carries high-impact problem 3
("The first screen", `:43-47`: "later a short skippable opening built only from tested tour text") and the pacing rule of opportunity 4
(`:112-114`). What the records hand to Stage 7 is in §0.1. Parts 7B onward implement it; this part reads the code, measures today's first
screen, inventories the text, prototypes the openings with the app's own machinery and specifies.

**Scope guard (the brief; kept).** Nothing is implemented; no source file changes behaviour; no data changes. Nothing historical is invented:
every sentence an opening would show is traced to a tested string in the dataset (file and line, §2), and every claim is labelled **fact**,
**disputed**, **derived**, **inference**, **uncertain**, **interpretation** or **design decision**. Durations, reading rates and speeds tried by
the probes are **design values for the measurement**, not proposals.

**How this was established.** Every number below comes from a script in `tools/stage7/` (committed; not bundled), run against the build above:

| script | section | what it measures |
|---|---|---|
| `text-inventory.js [--json f] [--md f]` | 2 | every string an opening could use (the tour, the themes, the dispatch, the acts, the events' `why`, `SOURCE_NOTE`, the first-run card): file and line, words, reading time at 160, 200 and 238 words a minute, its clock times and figures, the suites that read it; no page |
| `firstrun-probe.js [--json f] [--sheet f] [--only screens,ways,count,narrow]` | 1, 4 | fresh pages at 1600 x 900, 1366 x 768, 1280 x 720, 1024 x 768 and 390 x 844, under reduced motion and without `?harness=1`: the clock, the sun, the light, the fog, the smoke, the camera, the card (text, buttons, ARIA, focus), what is shown and hidden, the unobstructed fraction, drops, map text as rendered, darkness, the smoke's and the confidence marks' shares, draw calls; each way out of the card by real clicks and key presses; a reload; the ways into the day counted; the dispatch card's box below 1080 px |
| `opening-probe.js [--json f] [--sheet f] [--only tour,glides,small,played,card,ends,names]` | 3, 5 | the nine tour stops as stills applied by the tour's own `applyTour`, every glide sampled; the subsets' glides; the stops at smaller sizes; an opening played by the app's own `tickClock`, `followStep`, dwell and draw-on in 50 ms steps (lengths at four speeds, the camera's path, frames at the holds); the card's prototypes (DOM edits in the probe's page); the end states; what the stops name on the map |
| `lib.js` | | shared: the page opened as the harness opens it, reduced motion before load, one frame's measures as the harness takes them |

The page probes drive the built page in headless Chromium with software WebGL, as the Stage 0 harness does (`tools/stage2/page.js`'s
method, with `tools/visual/measure.js` injected and the Stage 5 helpers of `tools/stage5/lib.js`). Their outputs, and a README listing each
file, its section and its script, are in `docs/stage7-evidence/`. Frame times are software WebGL on one machine (comparable only with one
another; no GPU was used).

## 0. The decisions that bind Stage 7, and the records against the code

### 0.1 What the records say about Stage 7 (quoted)

| record | file:line | the words |
|---|---|---|
| the roadmap's Stage 7 line | `docs/VISUAL_AUDIT.md:163` | "**Stage 7, first run and opening sequence.**" (the line names no content of its own) |
| high-impact problem 3, the first screen | `docs/VISUAL_AUDIT.md:43-47` | "Dark 04:00 field; rail, dispatch card, first-run card, legend and a ~145 px four-row timebar over it; the default rail tab is the order of battle (reference, not story); no single next action among tour, Play, 10 phases, 5 acts, 25 event diamonds, 10 analysis moments, 5 vantages, 3 presentations. *Change:* interim first-run arrangement (done in Stage 0); later a short skippable opening built only from tested tour text. *When:* Stage 7." |
| the short answer | `docs/VISUAL_AUDIT.md:11-14` | "What a first-time visitor meets: a near-black 04:00 field behind five overlapping surfaces (rail, dispatch card, first-run card on top of it, legend, a four-row timeline), and a first sentence ("Amber is the Russian and Austrian army") that the screen contradicts ... At 1600x900 over half the viewport is interface." |
| opportunity 4, pacing | `docs/VISUAL_AUDIT.md:112-114` | "Slower default, automatic dwell at each event, a follow camera, arrows that draw on with the clock. Do not animate losses (the model plots formations, not casualties) or suggest mass drowning at the meres." |
| the audit's header | `docs/VISUAL_AUDIT.md:3-7` | "Written against the verified correction-pass build (md5 `672aff9f…`), before Stage 0. Stage 0 has since fixed ... the first-run text and card overlap (parts of problems 2 and 3) ... Figures quoted here are as audited then." |
| Stage 0's interim arrangement | `CHANGELOG.md:3566-3568` | "**First run:** the card stands alone near the foot of the map over the Overview view at 04:00, with three ways in: Guided tour, Watch the battle, Explore. Dispatch and legend are held back until one is chosen; any click or key outside the card counts as Explore without moving the camera." |
| Stage 3 Part A | `docs/STAGE3_SPEC.md:74-76` | "**The first screen is no longer as the audit describes it.** Stage 0 hid the dispatch and legend while the first-run card is open (`style.css:550-551`). Unobstructed at first run: 54.4% (1600 x 900), 48.3% (1366 x 768). Stage 7 owns the first run; §B leaves it as it is." (the rule is now `style.css:611-612`) |
| §B.2, "Unchanged" | `docs/STAGE3_SPEC.md:328-329` | "**Unchanged:** the tools, the presentation switch in Study, the tour bar, the chip, the badge, the layers popover and the first-run card (Stage 7)." |
| the 3B report, item 1 | `docs/STAGE3_SPEC.md:820-822` | "**While the first-run card is open the rail shows the Order of battle, as before**, and the dispatch stays hidden: the first run is Stage 7's, and the harness's Stage 0 check "first-run card stacked on the dispatch card" is kept as it is. Closing the card opens the Now tab, unless the visitor chose a tab meanwhile." (the same in `CHANGELOG.md:1788-1790`; in the code `app.js:6448-6449`) |
| Stage 4's scope | `docs/STAGE4_SPEC.md:79-80` | "... the first-run opening sequence is Stage 7. Stage 4 draws the fog; it does not make the fog a reading (§C.6)." |
| Stage 5's scope guard | `docs/STAGE5_SPEC.md:20-21`, `:92-93` | "nothing from Stage 6 (uniforms, headgear, flags) or Stage 7 (first run, opening sequence)"; "Not Stage 5: ... the first run and the opening sequence (Stage 7)." |

Nothing else in `CHANGELOG.md`, `docs/STAGE2_SPEC.md` to `docs/STAGE6_SPEC.md`, `docs/VISUAL_SPEC.md` or the sources names Stage 7 (fact:
every occurrence of "Stage 7" was read: the ones above, `CLAUDE.md`'s roadmap, and in the code one comment, `app.js:6448-6449`, "the first
run is Stage 7's"). Two code comments describe the first screen without naming the stage: `app.js:4681-4683` (the card is not a panel
for the landscape's focus) and `:5265-5268` (the first view).

### 0.2 The decisions that bind Stage 7

| # | decision (where recorded) | what it means for Stage 7 |
|---|---|---|
| Stage 0 | the first-run card, three ways in, the dispatch and legend held back, any click or key outside it an Explore that does not move the camera (`CHANGELOG.md:3566-3568`; `app.js:5265-5291`, `style.css:601-612`) | Today's arrangement, and the harness's Stage 0 check that pins it (`tools/visual/thresholds.js:127`, "first-run card stacked on the dispatch card"). Stage 7 replaces it or keeps it; either way the check is kept or replaced with its reason stated (§6). |
| 55 | "Study opens on the Now tab." (`docs/STAGE3_SPEC.md:113`) | Against it, the rail shows the order of battle while the card is open (3B's item 1, above). Stage 7 decides which holds on the first screen (§5, question 113). |
| 49 | the legend "closed to its "Key" head by default in Study, remembered while the page is open" (`:107`) | The first screen after the card or the opening opens with the legend closed; the first-run card hides it altogether today (`style.css:611`). |
| 58 | "The dispatch stays a card there" below 1080 px (`:116`) | Below 1080 px the dispatch is a card over the map (at 1024 x 768 its box overlaps the first-run card's, §6); an opening hides it while it runs, as the tour does, and shows it after (§4.7). |
| 47, 78 | Follow: a pan, orbit, zoom or double-click turns it off; a vantage, theme, tour stop, phase or act turns it on; continuous while the clock plays (`docs/STAGE3_SPEC.md:105`; `docs/STAGE4_SPEC.md:161`) | An opening that plays the clock runs under Follow; any pan, orbit or zoom by the visitor during it turns Follow off, which is itself a way to take control (§4.1). |
| 61, 62, 63 | the Overview fits the day's battle, "the first-run card is not counted as a panel for the landscape's focus; the fog recedes beyond the authored Overview's distance"; two drop limits; corps and army names drawn at any distance once the view shows corps (`docs/STAGE3_SPEC.md:124-126`) | The first screen's camera is decision 61's (`app.js:4681-4688`, `:5275-5278`): the battle fitted to the free rectangle as Study draws it, the card standing over its lower part (§1.3). Drop limits are never raised (62's method gives a new view's limit: what the build drops there, §6). |
| 74, 75, 78 | Play at ½×; a dwell at each event start, on by default, with its toggle; Follow continuous while playing (`docs/STAGE4_SPEC.md:157-161`; as delivered, `CHANGELOG.md:1030-1046`) | The default speed of an opening that plays is ½×: at it the clock takes 84 s from 04:00 to 11:00 before any dwell (§3). A faster opening speed would be a new design value (question 116). |
| 83 | the draw-on, "ghost and progress": a derived arrow drawn whole and faint, the part marched at full strength (`docs/STAGE4_SPEC.md:166`) | An opening that plays the clock draws arrows this way; one made of stills shows them as at any clock. Under reduced motion every arrow is whole (`CHANGELOG.md:1049`). |
| 89 | one event clock: an event's start, for "the marker, a click or Enter on it, the previous/next keys, the themes, the tour, the dwell, the dossier's "Go to this moment" and the map layer's names" (`docs/STAGE5_SPEC.md:176`) | An opening's moments are the tour's and the themes' moments, at their starts (§2, §3). |
| 91 | "the eye-level vantage at the chosen headquarters, the camera floor waived for it alone" (`docs/STAGE5_SPEC.md:178`) | No opening camera goes below the floor: the eye level is the one exception and an opening does not use it (§3: every glide sampled). |
| 108 | "Both reworded to name the symbology, not the coats (§4.3's wording); tour stop 1 in 6B (`TOUR` is guarded data), the first-run card in 6C." (`docs/STAGE6_SPEC.md:178`) | The first-run key's words and tour stop 1's are decided and pinned (the self-test's first-run check, `app.js:8291-8314`); an opening shows them as they are. |
| 52, 59, 64-67 | the spine data task: themes and stops name their moments; "cut" at `pratzeberg` (11:00) with stop 7 following it; the theme "guard" at phase 6; stop 9 at phase 9, 17:00; two exceptions keep their own cameras, the theme "cut" and stop 5 (`docs/STAGE3_SPEC.md:110`, `:117`, `:132-135`) | Every stop an opening uses keeps its moment, clock and camera; stop 4 keeps its own clock (07:25, `t:445`) because its text quotes the 07:15 reading (`analysis.js:345-347`; `test.js:120`). |
| 56, 76 | the relief control disabled while the battle plays; `SOURCE_NOTE`'s "1.2 minutes at 1×" (`docs/STAGE3_SPEC.md:114`; `docs/STAGE4_SPEC.md:159`) | An opening that plays disables the relief control while it plays, as Play does (§3.5). |
| the audit's "should not change" | `docs/VISUAL_AUDIT.md:137-144` | Those that bind here: "reduced-motion support, ARIA states, the keyboard time slider" and "the narrative voice and attributions"; also "the claim/grade/layer taxonomy and "derived" labelling" (the opening shows the tour's readings as derived, as the tour does) and "the restrained dark UI with serif narrative" (the card's type is the dispatch's). |
| `CLAUDE.md` | rules | "Never invent historical facts ... Label claims"; `analysis.js` is guarded: "change only when the task is explicitly about historical or geographic data". An opening built from the dataset's words needs no data change (§2.3). |

### 0.3 What changed since the audit described the first screen, and what is true now

The audit described the correction-pass build's first screen. What each stage changed on it (fact; the records and the code):

| stage | what changed on the first screen | record |
|---|---|---|
| 0 | the card alone near the map's foot over the Overview at 04:00; the dispatch, legend, drawer, badge, tour bar and chip hidden while it is open; one colour key (`COLOUR_KEY`) for the card and the legend; any click or key outside it closes it | `CHANGELOG.md:3566-3571`; `style.css:601-612` |
| 1B | the card's colours and type from the tokens (`--t-h2`, the serif) | `docs/VISUAL_SPEC.md:403`, `:646-648` |
| 3B | the rail docked from 1080 px with the Now tab; while the card is open the rail shows the order of battle; closing it opens the Now tab; the legend closed by default | `CHANGELOG.md:1786-1790`, `:1799`; `app.js:5274`, `:5287` |
| 3C | the four-row 170 px timebar became one timeline of about 90 px: the first screen's unobstructed share 54.4% to 61.5% (1600 x 900), 48.3% to 53.2% (1366 x 768) | `CHANGELOG.md:1720` |
| 3D | the Overview fitted to the day's battle (decision 61), the eye 491 units out on the first-run screen (278 before), framed without the card; left-drag pans; the card's hint follows the new controls | `CHANGELOG.md:1586-1592`, `:1605` |
| 3E | names (Study / Watch / Clean); the key table `KEYS` and the "?" overlay; Esc's first action "close the first card" | `app.js:4900-4902` |
| 4B-4E | the light at 04:00 is decision 71's design night light (the computed sun 35.9 degrees below the horizon); the valley fog at its full amount (`PHASES[0].mist` 1.0) drawn at most 55% opaque; no smoke at 04:00; the meres' ice; the sky dome | §1.2 |
| 4D | "Watch the battle" plays at ½× with the dwell and Follow (the button's own code is unchanged since Stage 0: `closeFirst("watch")`, `app.js:5289`) | `CHANGELOG.md:1030-1046` |
| 5B | the position-confidence marks drawn on the first screen (on by default, decision 85) | `CHANGELOG.md:781-861` |
| 6C | the key's words (decision 108): "French formations are marked in blue and the Allies in amber ..."; the figures by class | `CHANGELOG.md:146-148` |

**What is true now (fact; §1 measures it).** At 1600 x 900 a first-time visitor meets the fitted Overview at 04:00 in the night light
and the valley fog, the rail on its Order of battle tab on the left, the tools at the top right, the presentation switch at the top, the
timeline of 90 px at the foot, and the card above the timeline in the map's centre with three buttons. Not shown: the dispatch, the legend,
the drawer, the tour bar, the chip, the badge. The map is 61.5% unobstructed. Of the audit's five surfaces three remain on the first screen
(rail, card, timeline); the audit's "first sentence that the screen contradicts" is gone (Stage 0, then decision 108); the audit's
"default rail tab is the order of battle" is **still true of the first screen**, and only of it (3B's item 1); "no single next action" is
still true: the card offers three, and §1.7 counts 128 focusable controls on the first screen.

### 0.4 Where the records contradict the code or each other (fact; stated, not resolved)

1. **Decision 55 against the first screen.** "Study opens on the Now tab" (`docs/STAGE3_SPEC.md:113`); the first screen is Study, and its
   rail shows the Order of battle (`app.js:5274`: `if(docked) selectTab("oob")`), which the audit called "reference, not story". 3B kept
   it so that the Stage 0 check could stay as it was (3B's item 1). Stage 7 must decide (question 113).
2. **The Stage 0 check no longer describes what it tests.** `thresholds.js:127` fails when the card and the dispatch are both visible,
   with the message "first-run card stacked on the dispatch card". Since 3B the dispatch from 1080 px is the rail's Now tab, which
   cannot stand under the card (the card is placed right of the rail, `style.css:602`); there the check forbids the Now tab, not a
   stacking (measured, §3.3: with the dispatch shown in the rail the check fails, though the two boxes do not meet). Below 1080 px the dispatch is a card again (decision 58) and the check means what it says. A replacement must keep its
   meaning below 1080 px (§6).
3. **"Explore" is two different things.** Stage 0's record: "any click or key outside the card counts as Explore without moving the
   camera" (`CHANGELOG.md:3568`; the code's comment `app.js:5266-5268`). The code: a click or key outside closes the card in place
   (`closeFirst(null)`), but the **Explore button** calls `setPhase(0)` (`app.js:5290`), which sets Follow on and glides the camera from
   the Overview to phase 0's authored view (§1.5 measures it). So the button named Explore moves the camera and the "Explore" a click
   outside performs does not. The record's sentence is true of the outside click only.
4. **The tour's length in the code's comments.** `analysis.js:341` says "nine stops, about twelve minutes"; `app.js:3615` still says
   "GUIDED TOUR — eight stops", which Stage 3 Part A found (`docs/STAGE3_SPEC.md:60-63`) and nobody changed. Nine is right (`TOUR` has
   nine; the page counts "1 OF 9"). "About twelve minutes" is not measured anywhere: at 200 words a minute the nine texts take 2 min 17 s
   to read (§2.2); the comment's figure would need the visitor to look at each stop for over a minute.
5. **The audit's counts are of the build it read.** "~145 px four-row timebar" was 170 px (Stage 3 Part A, `docs/STAGE3_SPEC.md:64-66`);
   it is 90.5 px now. "25 event diamonds": 25 events, 22 distinct starts, 11 drawn as interval bars since 5C. "10 analysis moments": ten
   themes. Problem 6's "8 tour stops": nine (as item 4). The counts now are §1.7.
6. **The dialog's ARIA is less than the records imply.** The card is `role="dialog"` with `aria-labelledby` (`shell.html:308`); it has
   no `aria-modal`, no `aria-describedby`, does not take focus when it opens, and Tab from a fresh page reaches the rail and the tools
   before it (§1.4). The "?" overlay (3E) is the project's modal dialog done fully (`aria-modal="true"`, focus to its close button, Tab
   kept inside, focus returned, `app.js:4969-4990`). The audit's "ARIA states" to keep (`:142`) are kept by an opening only if it does at
   least what the overlay does (§4.2).
7. **"First-time" is not known to the page.** Nothing is stored (no `localStorage`, `sessionStorage`, IndexedDB or cookie anywhere in the
   sources; §1.6): every load is a first run, and so the card returns on every reload. The audit's and Stage 0's "first-time visitor" is,
   in the code, every visitor on every load.
8. **The key's last clause is an interpretation.** "The high ground in the centre is the Pratzen plateau, and it decides the battle"
   (`app.js:5263`; decided in decision 108's words) is the first claim a visitor reads. It is the project's reading (the themes' header:
   "the nine things that decided Austerlitz", `analysis.js:2`), not a record, and no overclaim scan reads it: `redteam.js`'s reads the
   events, phases, themes, tour, formations and plans (`redteam.js:183-188`), not the first-run key (its retired-phrase scan reads
   `app.js` whole, so the key is held to the 37 retired phrases, "amber army" among them). Labelled here **interpretation**;
   an opening that keeps the key keeps the clause as decided.
9. **Two of the moments an opening would show carry the data's own named disputes.** Tour stop 4's "From seven o'clock the Allied left goes
   down into the villages" sits on the unresolved Dokhturov conflict (`dok@1`, decision 42; `SOURCE_NOTE`'s open question: "c. 07:30 in
   the 07:00 timeline, but from 04:00 in the event and on the map"), and stop 6's "At about a quarter to nine Saint-Hilaire and Vandamme
   climb" sits on legs `check:chronology` flags as derived at the march-rate ceiling (`sthilaire@3`, `vandamme@3`: "the tactical rate does not
   fit before the next anchor"). Neither is a contradiction of the text by the code (the conflict and the flag are recorded and allowed by
   name); both are things an opening would put on screen at the moment it shows the words (§2.4).
10. **A "should not change" item does not hold on the first screen.** The audit keeps "the claim/grade/layer taxonomy and "derived"
   labelling" (`docs/VISUAL_AUDIT.md:138-139`). The first screen shows the plateau's derived reading ("THE PRATZEN · Allied ≈ 38,700") and,
   while the card is open, no "derived" tag anywhere (§1.1): the tags are in the Now tab's dispatch and the timeline caption, both hidden in
   this state (`style.css:611`, `:317`).

### 0.5 Owner decisions 111-122 (the answers to §7)

The owner accepted every recommendation of §7 ("We will go with your recommendations for all"). Each is recorded as a decision, in the
question's order; §7 keeps the trade-offs.

| # | question | decision |
|---|---|---|
| 111 | the opening | C, stills through a subset of the tour by the tour's own machinery, entered from B, the card refined. (7B, 7C) |
| 112 | auto-start | No: the card's primary button starts it; offered, not forced. (7B, 7C) |
| 113 | the rail's tab on the first screen | The Now tab (decision 55 holds on the first screen too); the Stage 0 check replaced by an overlap test, its reason stated. (7B) |
| 114 | the stops | 1, 6, 7, 8. (7C) |
| 115 | "tested" | §2.1's definition; whole stops only, shown from `TOUR` by index; every string shown `===` a `TOUR` field or a `LABELS` entry. (7C) |
| 116 | played stretches | None in Stage 7. (7D not built) |
| 117 | "seen it" | No storage; the URL fragment left optional and not built. (7B) |
| 118 | the end | 04:00, Study on the Now tab, the Overview, Play focused as the single next action. (7C; 7B applies the same focus rule to the card) |
| 119 | the derived figure on the first screen | (a): the Now tab under the card shows the reading with its "derived" tag; (b), the tag on the map label in every view, stays open. (7B) |
| 120 | the card's hint | Off the card: the "?" overlay's pointer rows and the legend's control line carry it. (7B) |
| 121 | the harness cases | `first-run` and `first-run-laptop` kept; the opening's cases with 7C, their limits measured on its build; the Stage 0 check's test replaced. (7B, 7C) |
| 122 | below 1024 px | Recorded, not fixed: a `narrow-390` case for the first screen, its timeline's height recorded, not held to 92 px. (7B) |

**How 7B applies 111 before 7C exists.** The card's primary action is the opening, which is 7C. Until 7C is built the primary button starts
the guided tour (the existing nine stops, the tour's own words), the one way in the card already offered that is built from the tested text;
7C points the same button at the opening and keeps the guided tour in the tools. This is sequencing, not a new decision.

## 1. Today (fact; read from the code and measured in the harness's page)

`node tools/stage7/firstrun-probe.js` (`docs/stage7-evidence/firstrun-probe.json`, `firstrun-sheet.jpg`): fresh pages as the harness opens
them (`?harness=1`, software WebGL, CSS transitions off), one more at 1600 x 900 under reduced motion and one without `?harness=1` (a
visitor's page). Each frame measured as the harness measures it (`tools/visual/measure.js`; the confidence marks' share by drawing the view
again without them, `CONF.none`).

### 1.1 The first screen at each size

| | 1600 x 900 | 1366 x 768 | 1280 x 720 | 1024 x 768 | 390 x 844 |
|---|---|---|---|---|---|
| layout | docked (rail 300 px) | docked | docked | undocked (rail hidden) | undocked |
| the card's box (x, y, w x h) | 680, 550, 540 x 241 | 563, 418, 540 x 241 | 520, 370, 540 x 241 | 242, 418, 540 x 241 | 16, 335, 358 x 319 |
| the rail's tab | Order of battle | Order of battle | Order of battle | (hidden) | (hidden) |
| shown | rail, tools, presentation switch, timeline (91 px), card | same | same | tools, switch, timeline, card | same; the timeline 172 px tall (it wraps) |
| hidden while the card is open | dispatch, legend, drawer, tour bar, chip, badge | same | same | same (the dispatch is a card here) | same |
| unobstructed (harness baseline) | **61.5%** (61.4%) | **53.2%** (53.1%) | **49.0%** (49.0% at 1280 x 720) | 67.9% (no case) | 38.3% (no case) |
| the eye's distance from the target | 491.4 | 510.6 | 524.3 | 533.8 | 868.7 |
| map items placed / dropped (limit) | 19 / 5 (12) | 17 / 4 (16) | 14 / 4 (16, stated) | 16 / 4 (16, stated) | 6 / 2 |
| dropped | Pratzen, Stare Vinohrady, Pratzeberg, Zuran, Goldbach | Pratzen, Stare Vinohrady, Zuran, Goldbach | Pratzen, Stare Vinohrady, Zuran, Litava | Pratzen, Stare Vinohrady, Zuran, Goldbach | Santon, Zuran |
| map text, lowest contrast as rendered (AA 4.5) | 8.64 | 8.64 | 11.98 | 8.65 | 12.36 |
| solid near-black (limit 0.05%) / near-black / mean luminance | 0 / 0.27% / 35.5 | 0 / 0.25% / 34.9 | 0 / 0.23% / 34.5 | 0 / 0.31% / 33.4 | 0 / 1.94% / 28.1 |
| smoke's share (limit 25%) / confidence marks' share (limit 20%) | 0 / 3.7% | 0 / 3.3% | 0 / 3.1% | 0 / 3.4% | 0 / 5.4% |
| draw calls / triangles / world pass (software, median of 7) | 756 / 2.50 M / 9.4 ms | 756 / 2.50 M / 17.3 ms | 756 / 2.50 M / 8.4 ms | 756 / 2.50 M / 14.3 ms | 756 / 2.50 M / 18.0 ms |
| the Stage 0 checks (the harness's, on this frame) | pass | pass | pass | pass | fail: "the timeline is 172 px tall (at most 92)" |

Under reduced motion (1600 x 900) and on a visitor's page (no `?harness=1`) every measure is the same as at 1600 x 900 (the world pass
aside: 18.3 and 6.4 ms, software timings, not comparable run to run).

**How the first screen names the Pratzen** (fact; `firstrun-probe.js --only narrow`, `names`). The card says "The high ground in the
centre is the Pratzen plateau". On the map the plateau is named only by its derived reading, the plateau label "THE PRATZEN · Allied ≈
38,700" (`plateauText`, `app.js:3972-3975`): a figure computed from the plotted positions (`SOURCE_NOTE`'s last paragraph), which carries no
"derived" mark on the map and no accessible name of its own (`app.js:3946-3949`, no `aria`). The place names Pratzen (the plateau) and Stare
Vinohrady are dropped at every size from 1024 px, and the Pratzeberg at 1600 x 900: the layer places items by priority clear of the panels
(`mlLayout`, `app.js:4120-4126`; the card is one of its panels, `app.js:3977`), the corps and army names drawn at this distance (decision 63)
and the plateau reading come first, and the place names that find no room are dropped (within the limits: 5 of 12). The same names are
dropped with the card closed in place (§5: the Overview at 04:00 in Study drops Pratzen, Stare Vinohrady and Pratzeberg too), so the card is
not the cause; the Overview's distance is. At 390 x 844 neither the place names nor the plateau reading are drawn: the plateau is not named
on the map at all. While the card is open, every "derived" tag is hidden (read from the code): the Now tab's readings are inside the dispatch,
which the card hides (`app.js:5384-5385`; `style.css:611`), and the timeline caption's are hidden in Study unless the dispatch is
(`style.css:317`; the first screen's body is `docked pm-study firstrun-on`, without `no-dispatch`). **The first screen shows a derived figure
with nothing on screen saying it is derived.** The audit's "the claim/grade/layer taxonomy and "derived" labelling" is among the things that
should not change (`docs/VISUAL_AUDIT.md:138-139`).

### 1.2 The clock, and what 04:00 draws

- **The clock** is `T_MIN`, 04:00 (`app.js:556`: `setClock(T_MIN,{instant:true,force:true})`), phase 0 "Deployment", "Dispositions in the
  dark"; the polite live region holds "04:00 - 07:00. The Deception: Dispositions in the dark." from start-up.
- **The computed sun** (`SUN_DAY.at(240)`, 4B): 35.85 degrees below the horizon, azimuth 82.4 (derived; the clock read as local apparent time,
  decision 69); sunrise, the upper limb at the horizon, at 07:45. No disc. The light is the table's first row, the design night light of
  decision 71 ("predawn": "the predawn preset's direction, not a moon", `app.js:247`), its twilight weight 0.
- **The valley fog** (4C): its amount `PHASES[0].mist` = 1.0 (`data.js:57`), drawn at its cap, 55% (decision 72), its top at 238.2 m (the
  Command view's threshold); the haze on. The narrative's "Fog fills the Goldbach valley" (`data.js:52`) is drawn; its depth is modelled.
- **Smoke** (4E): none. No formation has a fighting status at 04:00, so `smokeAmount` is 0 for all and the share is 0 (decision 77).
- **What a visitor sees**: a dark field (mean luminance 33-36 of 255 on the first screens, 55-136 at the tour's daylight stops, §3.1), no solid black (Stage 0's
  darkness limit is met: 0 blocks), the fog over the valley, the formations as figures with their confidence marks and side footprints, the
  corps and army names. The audit's "near-black 04:00 field" is now a dark, legible one: the clipped slopes Stage 0 measured are gone,
  and the darkness left is the night's, drawn by decision 71's design light.

### 1.3 The camera

`openFirstRun` (`app.js:5270-5281`) places the eye at `presetFrame(VANTAGE.plan)`: the Overview fitted to the day's battle (decision 61), in
the free rectangle that Study's panels leave, **without the card** (`landPanels`, `app.js:4684-4688`), so the orbit target is the free
rectangle's centre and the card stands over the lower part of the framed battle. It cancels the start-up phase transition's camera
(`camArc=null`), clamps to the floor, and sets `curVantage="plan"`, so Follow is on and the Overview's button is pressed. At 1600 x 900 the eye
is 491.4 units from the target, straight above it but for the preset's slight tilt (eye -38.8, 488.7, 61.3; target -38.8, 0.5, 4.7), 490 units
above the drawn ground: never near the floor.

### 1.4 The card: text, buttons, ARIA, focus

- **Text** (`shell.html:308-319`; the key written at start-up by `paintKey`, `app.js:5261-5263`): the title "The Battle of Austerlitz"; the
  key "French formations are marked in [swatch] blue and the Allies in [swatch] amber: on their names, their counters and the ground beneath
  them, and on the movement arrows. The high ground in the centre is the Pratzen plateau, and it decides the battle." (41 words); the hint
  "Drag to move the map, right-drag to turn it, scroll to zoom, and click any formation to see who it was and what it was doing." (26 words).
- **Buttons**: "Guided tour" (`#fr-tour`), "Watch the battle" (`#fr-watch`), "Explore" (`#fr-close`); 34 px high (46 px at 390 x 844), 77-134 px
  wide. None is marked as the primary one.
- **ARIA**: `role="dialog" aria-labelledby="fr-title"`; no `aria-modal`, no `aria-describedby`, no `tabindex`.
- **Focus**: not moved on load (`document.activeElement` is the body at every size). Eight presses of Tab from a fresh page reach the
  presentation switch's three buttons, the Order of battle tab and four of its rows; never the card (its buttons come late in the DOM, after
  the rail, the tools and the timeline). The card stays open while focus moves (Tab is exempt from the "any key closes it" rule, `app.js:5002`).
- **Esc** closes it in place (the `KEYS` row "esc", `app.js:4900-4902`: `if(firstRunOpen){ closeFirst(null); return; }`), focus on the body.

### 1.5 Each way out (fact; each on a fresh page at 1600 x 900, by a real click or key press)

| way | the card | clock | presentation, tab | camera | focus after |
|---|---|---|---|---|---|
| "Guided tour" | closed | 04:00 (stop 1) | Study; the tab Now, the dispatch hidden (`hideDispatch`), the tour bar shown, "1 OF 9" | glides 491 → 321 units, to stop 1's camera (phase 0's) | the body (the pressed button is hidden) |
| "Watch the battle" | closed | plays from 04:00 at ½× | Watch | `setPhase(0)`: glides to phase 0's view, then Follow while playing | the body |
| "Explore" | closed | 04:00 | Study; Now tab, the dispatch shown, the legend shown closed | `setPhase(0)`: glides 491 → 321 units to phase 0's view | the body |
| a click on the map | closed | 04:00 | Study; Now tab | **unmoved** (the Overview kept) | the body |
| key 2 | closed | 04:00, paused | Watch | unmoved | the body |
| Space | closed | plays from 04:00 at ½× | Study; Now tab | unmoved until Follow moves it | the body |
| "?" | closed | 04:00 | Study; Now tab; the "?" overlay open | unmoved | the overlay's close button |
| Esc | closed | 04:00 | Study; Now tab | unmoved | the body |
| → | closed | 04:10 | Study; Now tab | unmoved | the body |
| Tab (8 presses) | **stays open** | 04:00 | Study; Order of battle | unmoved | the rail's rows |

So the three buttons do three different things, and two of them (Watch, Explore) move the camera off the Overview the visitor was shown; the
outside click and the keys leave it. Every way but Tab ends with the Now tab in Study (3B), the legend closed (decision 49), and focus on the
body.

### 1.6 Reload, storage, reduced motion

- **Reload**: the card returns (every load). Nothing is stored: `localStorage` and `sessionStorage` are empty before and after the card is
  closed; the sources contain no `localStorage`, `sessionStorage`, IndexedDB or cookie call.
- **Reduced motion**: the first screen is the same (§1.1). `RM` stops the ambient drift and makes glides 1 ms, so "Guided tour", "Watch"
  and "Explore" cut instead of gliding; Follow while playing moves only at event starts (`app.js:6403-6408`).

### 1.7 The ways into the day, counted as the audit counted them

| the audit's count (`docs/VISUAL_AUDIT.md:44-46`, of the correction-pass build) | now (fact; from the running page) |
|---|---|
| tour | the Guided tour: **9 stops** (the tools' "Guided tour" and the card's) |
| Play | **Play**, with 4 speeds (½× default) and Follow |
| 10 phases | **10** phases (the timeline's phase ticks) |
| 5 acts | **5** acts (the timeline's act bands) |
| 25 event diamonds | **25** events: 25 markers (one per event), 11 of them drawn with interval bars; **22** distinct start minutes |
| 10 analysis moments | **10** themes (the Analysis tab), each naming its moments (the spine data task) |
| 5 vantages | **5** vantage buttons (Field, Zuran, Pratzen, Allied, Overview), and the eye level (hidden until a headquarters is chosen) |
| 3 presentations | **3** presentations (Study, Watch, Clean) and **3** ground styles (Landscape, Paper map, Landscape with counters) |
| (not counted) | the rail's **5** tabs (Now, Order of battle, Analysis, Command, Plans); **3** plan buttons; "Whose eyes?" (3 choices, in the Command tab and the timeline); the "?" overlay listing **29** key rows in 7 groups; the layers panel |
| | **128** focusable controls visible on the first screen |

The card's three buttons are the only ways in it names; it marks none as the one to take.

### 1.8 Every test that touches the first run

| test | file:line | what it holds |
|---|---|---|
| the harness's fresh case `first-run` (1600 x 900) | `tools/visual/cases.js:7-8` | "What a first-time visitor sees, untouched": every Stage 0 threshold on the first screen as loaded |
| the harness's fresh case `first-run-laptop` (1366 x 768) | `cases.js:9-10` | the same at 1366 x 768 |
| their drop limits | `tools/visual/thresholds.js:14` | 12 and 16 (the 2C canvas pass's) |
| their unobstructed baselines | `thresholds.js:59` | 61.4% / 49.0% and 53.1% / 49.0% (at the case's size / at 1280 x 720; 3C's, never lowered) |
| the Stage 0 check | `thresholds.js:127` | "first-run card stacked on the dispatch card": fails if both are visible |
| the docking checks skip the first run | `thresholds.js:152-153` | the Now-tab and legend-closed rules apply only when the card is not visible |
| the harness skips the reading measures on fresh cases | `tools/visual/harness.js:134-160` | no confidence share, skeleton or routes measure on the first-run views ("whose card is not a reading") |
| the unobstructed fraction counts the card | `tools/visual/measure.js:184`, `:296`, `:460` | `#firstrun` among the panels |
| `check:contrast`'s first state | `tools/visual/contrast.js:124` | the page as loaded (the card, the rail's Order of battle), read over the dark backdrops, at AA and the 10.5 px floor |
| `check:contrast`'s later states close it | `contrast.js:57-58` | `closeFirst` before "now-default" and "study" |
| the self-test's map-layer state "the first-run card" | `app.js:6931`, `:6947`, `:7014` | the card reopened (`openFirstRun`) at 04:00 in Study on the landscape, at 1x, 4x and 10.33x: no overlap, nothing over a panel or a head, the never-dropped items drawn |
| the self-test's first-run key check | `app.js:8291-8314` | the key's swatches equal the legend's and the drawing colours; four phrases of decision 108's words; no coat named as a nation's |
| the self-test's and the harness's case set-up | `app.js:6819`, `:7950` | `closeFirst(null)` before every case and every self-test (the card closed in place) |
| the map layer's panels | `app.js:3977` | `#firstrun` in `ML_PANELS` (nothing is placed under it) |
| the landscape's focus | `app.js:4684-4688` | the card left out of the panels the focus keeps clear of (decision 61) |

No suite in `npm test` touches the first run: `css-test.js`, `runtime-test.js` and the others never open or close the card (`startTour`
calls `closeFirst`, a no-op there).

## 2. The text

`node tools/stage7/text-inventory.js` (no page; `docs/stage7-evidence/text-inventory.md` and `.json`) lists 100 strings with their file
and line, their words, their reading time at three rates and what they state (clock times, figures). Reading rates are **design values for
the measurement** (160, 200 and 238 words a minute; 200 is used below), not a measurement of this audience.

### 2.1 What "tested" means here (definition, proposed)

The audit's phrase is "built only from tested tour text" (`docs/VISUAL_AUDIT.md:46-47`). Read against the suites, a string is:

- **guarded** if it is part of a data declaration `check:data` holds byte-identical to its reference (`archive/stage6b-7fc0f6c3.html`;
  `tools/visual/data-invariance.js`): every string in `data.js` and `analysis.js`. A change is a data task (`CLAUDE.md`).
- **scanned** if, in addition, `redteam.js` reads it: no certainty words ("certainly", "proves", "always" ...; `redteam.js:176`), causal
  language warned, and none of the 37 retired phrases (`:191-201`, in six source files). `redteam.js:183-188` scans the events' names and
  `why`, the phases' titles and ledes, the themes' texts, the tour's texts, the formations' roles and notes, and the plans' intent and cost.
  The overclaim scan does **not** read the phases' timeline lines, the acts' lines, `SOURCE_NOTE`, the tour's titles or the first-run key;
  the retired-phrase scan reads whole files (`data.js`, `appearance.js`, `analysis.js`, `world.js`, `app.js`, `shell.html`), so it covers
  every string in this section.
- **anchored** if, in addition, its clock times are timed statements `check:chronology` audits against the engine (`tools/stage2/
  chronology.js:69-82`: the timeline lines, ledes, event clocks, themes and tour texts), its moment resolves to a phase or an event
  (`test.js:114-121`; the self-test's spine check, `app.js:8221-8235`), and every **derived** figure it quotes is recomputed by a suite.

**Tested**, for the opening, = guarded, scanned and anchored. Every tour stop's text (`TOUR[].x`) is tested in this sense; two carry figures
a suite recomputes from the model (stop 4's "about 39,000 ... about 19,000", `sim-test.js:84-89`, live 38,700 and 19,300, within 600;
stop 5's "about 73 per cent ... under 3 per cent", `terrain-test.js:61-66`, live 73.4% and 2.1%). The themes' texts are tested in the same
sense (their figures are sourced, not derived: no suite recomputes Duffy's and Smith's 4,300). The phases' ledes are guarded and scanned;
their moment is the phase. The timeline lines are guarded and audited by `check:chronology` but not scanned. The act lines and `SOURCE_NOTE`
are guarded only (one paragraph of `SOURCE_NOTE` is also held by `test.js:225-230`, decision 105). The first-run key is not data at all:
it is written by `paintKey` (`app.js:5261-5263`) and pinned word for word by the self-test (four phrases, decision 108, `app.js:8302-8303`).

### 2.2 The inventory (the strings an opening could use)

**The tour** (`analysis.js:349-368`; every stop guarded, scanned and anchored; read forward and back by `runtime-test.js:271-278`):

| stop | title (`analysis.js` line) | moment, clock | camera | words | s at 200 | clock times and figures it states | also |
|---|---|---|---|---|---|---|---|
| 1 | The battlefield (351) | `ph:0`, 04:00 | phase 0's | 56 | 16.8 | "Ten kilometres" | decision 108's words ("marked in blue ... marked in amber") |
| 2 | The Allied plan (353) | `ph:0`, 04:00 | its own (the plan's overview) | 46 | 13.8 | "four of the five Allied columns" | needs the Allied plan drawn ("The heavy arrows are the intended lines of march") |
| 3 | The French deception (355) | `ph:0`, 04:00 | theme `deception` | 37 | 11.1 | "1 December", "five kilometres" | |
| 4 | The Allied advance (357) | `ph:1` with its own clock 07:25 (`t:445`) | theme `commitment` | 62 | 18.6 | "seven o'clock", "about 39,000 at 04:00", "about 19,000 by 07:15" (derived; `sim-test.js`) | the Dokhturov conflict (§0.4 item 9); "Watch the figure on the plateau outline" needs the plateau reading drawn |
| 5 | Why the Pratzen matters (359) | `ph:2`, 08:00 | its own (decision 67) | 72 | 21.6 | "about 73 per cent", "under 3 per cent" (derived; `terrain-test.js`) | says "That is a reading from the model, not a record" |
| 6 | The French strike (361) | `ev:soult`, 08:45 | theme `pratzen` | 34 | 10.2 | "about a quarter to nine" | the climb's legs at the march-rate ceiling, flagged (§0.4 item 9); phase 3's "flash" ("The sun of Austerlitz", `data.js:81`) shows as the stop is applied |
| 7 | The army divided (363) | `ev:pratzeberg`, 11:00 | theme `cut` | 37 | 11.1 | "forty thousand", "about noon" | follows its theme (decision 52) |
| 8 | The collapse (365) | `ev:augezd`, 14:30 | theme `collapse` | 41 | 12.3 | "ninety degrees" | |
| 9 | What it cost (367) | `ph:9`, 17:00 | phase 9's | 70 | 21.0 | losses "usually given as fifteen to sixteen thousand ... twelve thousand or more ... about a hundred and eighty guns ... near nine thousand" (attributed: "usually given") | the evidence statement: "positions are graded A, B or C ... two figures on the situation line are computed rather than recorded" |

The whole tour reads in 455 words, 2 min 17 s at 200 words a minute (2 min 51 s at 160). The subsets §3 measures: stops 1, 6, 7 in 127
words (38 s); 1, 6, 7, 8 in 168 (50 s); 1, 4, 6, 7, 8 in 230 (69 s).

**The themes** (`analysis.js:11-62`; ten; tested as above): 53-89 words each (15.9-26.7 s); "the attack on the Pratzen" is the longest
(89 words). Each opens on its principal moment (decision 89's clock). Their texts overlap the tour's (stop 3 and the theme `deception`,
stop 6 and `pratzen`, stop 7 and `cut`, stop 8 and `collapse` say the same things at greater length): an opening needs one or the other,
and the audit names the tour.

**The dispatch per phase** (`data.js:50-142`): ten titles and ledes (45-75 words; guarded and scanned) and 32 timeline lines (guarded and
audited, not scanned). The dispatch is what Study shows in the Now tab after any opening.

**The acts' lines** (`analysis.js:220-231`; five, 17-21 words; guarded; `sim-test.js:93` checks only that the acts cover the phases). Short
enough to caption a played opening (5-6 s each), but not scanned: using them would widen "tested" (question 115).

**`SOURCE_NOTE`** (`data.js:756-773`; seven paragraphs, 43-279 words; guarded): the project's statement of method. Not narrative; an opening
points to it (stop 9's last sentence does: "The sources panel says which is which") rather than quoting it.

**The first-run card** (`app.js:5261-5263` and the static copy `shell.html:310-313`; not data): the key, 41 words (12.3 s), pinned by the
self-test; the hint, 26 words (`shell.html:313`), pinned by nothing (3D changed it with the controls, `CHANGELOG.md:1605`).

### 2.3 What an opening would need that the dataset does not have

None of the options in §3 needs a new or reworded historical sentence (derived from the inventory; each text was read in its subset's
order for what it refers to):
- Each stop's text refers to its own moment and to what its own setting draws (stop 2's "heavy arrows" are its plan, stop 4's "figure on the
  plateau outline" is its theme's reading): a stop applied by the tour's own `applyTour` draws them, so the words stay true on screen.
- In the subsets 1, 6, 7 and 1, 6, 7, 8 each text reads after the one before it without a missing referent: stop 7's "With the plateau gone"
  follows stop 6; stop 6's "ground the Allies have just left" is complete without stop 4 (the leaving is said in stop 6's own sentence);
  stop 8's "The French centre" needs nothing before it. Stop 2 needs its plan drawn and stop 4 its reading: both are drawn by the stop.
- What an opening adds is interface text: a heading, the step count ("1 of 3"), the controls ("Skip", "Next", "Back", "Play the day"),
  the end's single next action. These are labels, not claims; they belong in `LABELS` (`app.js:4851`, Stage 3E) and `css-test.js` can
  check they contain no clock time, figure or proper name (§6).

**Recommendation (how to avoid a data change).** The opening holds **indices into `TOUR`**, never copies of its strings: its text is
`TOUR[i].n` and `TOUR[i].x`, read at run time, so it cannot drift from the tested text and a change of `TOUR` (a data task) changes the opening
with it. A test (§6) asserts that every string the opening shows is `===` a `TOUR` field or a `LABELS` entry. If the owner wants a sentence
the tour does not have (an introduction, a closing line with content), that is a data task of its own, with its evidence, before 7B (question
115).

### 2.4 Claims on screen, labelled

What an opening built from the tour shows, with the label each claim already carries in the data:
- **fact** (attested; the tour states it plainly): the plateau given up on 1 December (stop 3), the climb "at about a quarter to nine" (stop
  6), the Augezd neck (stop 8). Each is the dataset's, cited in `SOURCE_NOTE`'s refs and the events' grades.
- **derived** (the model's reading, said so in the text): stop 4's "a reading derived from the plotted positions"; stop 5's "That is a reading
  from the model, not a record of what anyone saw". An opening keeps these sentences whole; it never shows a derived figure without its
  qualifier (a reason to show whole stops only).
- **derived, on the map**: the plateau reading's label is drawn at stops 1 and 6 ("Allied ≈ 38,700" at 04:00, "≈ 23,550" at 08:45;
  `opening-probe.js --only names`). Stop 4's text says the holding falls "to about 19,000 by 07:15"; a subset with stops 4 and 6 would show
  the figure higher at 08:45 than stop 4's, with no word on it (the model's readings at two clocks, both as computed). Without stop 4 the
  opening shows 38,700 and 23,550; while it runs the timeline's caption carries the reading with its "derived" tag, since the tour's
  machinery hides the dispatch (`hideDispatch` sets `no-dispatch`, `app.js:6484`, and `style.css:317` then shows the caption's readings;
  read from the code).
- **attributed** ranges: stop 9's losses, "usually given as".
- **disputed / unresolved** (not in the words, but under them): §0.4 item 9's two. The opening puts the map at those moments as the tour does;
  `SOURCE_NOTE` (the sources sheet) states the first; `check:chronology`'s report states the second. Recommendation: no opening shows stop 4
  (the Dokhturov conflict sits under its first sentence, and its frame drops 14 map items, over the reference limit, §3.1); stop 6 is shown
  as the tour shows it.
- **interpretation**: the first-run key's "and it decides the battle" (§0.4 item 8); stop 7's "can no longer help one another" is the themes'
  reading of the cut.
The opening adds no historical claim, time, figure or quotation, and keeps every attribution: it shows whole stops in the tour's own words.

## 3. What the opening could be (options, measured, not chosen)

`node tools/stage7/opening-probe.js` (`docs/stage7-evidence/opening-probe.json`, `opening-sheet-tour-glides-small-played-card-ends.jpg`).
Every prototype is the app's own machinery driven in the probe's page: the tour's `applyTour` (clock, theme, plan, feature, camera, Follow
on, the dispatch hidden), `flyTo`'s glide, `tickClock` with the dwell, `followStep`, the draw-on, `setPresentation`, `selectTab`. The card's
prototypes are edits of the probe page's DOM. No source file is changed.

### 3.1 What every option shares (fact, then design values)

- **The start.** Every option starts on today's first screen at 04:00 (§1): stop 1's moment is phase 0 (`ph:0`). There the computed sun is
  35.9 degrees below the horizon and the light is decision 71's night light; the valley fog is at its full amount; nothing smokes. The day's
  light comes with the later stops (the sun's true altitude at each stop below). No option starts at another clock: the tour's text begins
  at 04:00, and a later start would skip the key the first stop gives.
- **The stops' frames** (each stop applied by `applyTour` after the one before it, as the tour runs it; Study, the dispatch hidden, the tour
  bar shown; 1600 x 900; drops held against the first-run case's limit of 12, stated, since no opening case exists):

| stop | clock | the sun (true altitude) | fog | eye to target | unobstructed | placed / dropped | map text, lowest (AA 4.5) | solid black / mean lum. | smoke | confidence | draw calls | tour bar (x, y, w x h) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 The battlefield | 04:00 | -35.9 | 1.00 | 321.3 | 63.2% | 23 / 8 | 8.50 | 0 / 49.5 | 0 | 3.5% | 753 | 520, 606, 560 x 187 |
| 2 The Allied plan | 04:00 | -35.9 | 1.00 | 268.1 | 64.0% | 46 / 9 | 8.54 | 0 / 43.0 | 0 | 5.2% | 788 | 520, 629, 560 x 164 |
| 3 The French deception | 04:00 | -35.9 | 1.00 | 132.2 | 64.0% | 22 / 5 | 12.03 | 0 / 55.4 | 0 | 5.3% | 728 | 520, 629, 560 x 164 |
| 4 The Allied advance | 07:25 | -3.6 | 0.98 | 161.2 | 63.2% | 44 / **14** | 7.91 | 0 / 105.2 | 1.9% | 3.4% | 751 | 520, 606, 560 x 187 |
| 5 Why the Pratzen matters | 08:00 | 1.5 | 0.98 | 140.7 | 63.2% | 24 / 4 | 7.67 | 0 / 117.1 | 7.1% | 2.3% | 769 | 520, 606, 560 x 187 |
| 6 The French strike | 08:45 | 6.9 | 0.90 | 140.7 | 64.0% | 25 / 7 | 7.48 | 0 / 135.8 | 2.6% | 4.4% | 736 | 520, 629, 560 x 164 |
| 7 The army divided | 11:00 | 17.7 | 0 | 91.9 | 64.0% | 12 / 3 | 8.48 | 0 / 73.5 | 3.9% | 3.5% | 713 | 520, 629, 560 x 164 |
| 8 The collapse | 14:30 | 11.5 | 0 | 153.0 | 64.0% | 24 / 4 | 8.27 | 0 / 54.7 | 4.1% | 6.4% | 763 | 520, 629, 560 x 164 |
| 9 What it cost | 17:00 | -7.2 | 0.22 | 321.1 | 62.3% | 17 / 1 | 8.26 | 0 / 41.6 | 0 | 4.3% | 733 | 520, 584, 560 x 209 |

  Every stop meets every Stage 0 threshold the harness applies (no overlap, nothing over a panel or a head, no solid black, map text at AA
  as rendered, the smoke under 25%, the confidence marks under 20%), and every stop's text is whole in the bar (no scroll). **Stop 4 drops 14
  map items** (place names: Pratzen, Stare Vinohrady, Pratzeberg, Santon and ten more), above the first-run case's 12: the tour shows it so
  today, and no harness case holds it. Stops 1 and 2 drop the place names Pratzen and Pratzeberg, though stop 1's text asks the visitor to find
  "the Pratzen plateau, the high ground in the centre of the field": as on the first screen, the plateau is named there by its derived
  reading's label, "THE PRATZEN · Allied ≈ 38,700" (§1.1; at stop 6, 08:45, it reads "≈ 23,550"). The harness's checks counted here are all but the drop limit and the unobstructed baselines, which are reported
  in the columns. The map layer's pass took 0.2-2.5 ms (budget 8).
  The world pass (software WebGL, median of 7) took 11.3-63.2 ms; one sample, stop 8's 63.2, is an outlier of the machine (the same stop's
  draw calls are within the others' range): not comparable as a cost.
- **The glides** (the tour's `flyTo`: 1.6 s, eased, bulge 0.12; sampled every 2% of each glide, 51 samples): from the first screen's Overview
  (491 units out) to stop 1 (321 units) and between every pair of stops in every subset, the eye never came lower than **38.7 units** above
  the drawn ground (the floor is 1.8) and the floor lifted it **0** times (the eye level, decision 91's one exception, is never used).
- **At smaller sizes** (the same stops, the same machinery):

| size, stop | unobstructed | placed / dropped (limit stated) | map text, lowest | solid black | smoke | confidence | tour bar (x, y, w x h) | the harness's checks |
|---|---|---|---|---|---|---|---|---|
| 1280 x 720, stop 1 | 51.7% | 21 / 10 (16) | 8.50 | 0 | 0 | 4.5% | 360, 426, 560 x 187 | pass |
| 1280 x 720, stop 4 | 51.7% | 36 / **20** (16) | 7.91 | 0 | 2.5% | 3.9% | 360, 426, 560 x 187 | pass but for the drops |
| 1280 x 720, stop 6 | 52.9% | 21 / 7 (16) | 7.48 | 0 | 0.6% | 4.6% | 360, 449, 560 x 164 | pass |
| 1280 x 720, stop 7 | 52.9% | 7 / 3 (16) | 13.33 | 0 | 1.3% | 4.5% | 360, 449, 560 x 164 | pass |
| 1280 x 720, stop 8 | 52.9% | 21 / 3 (16) | 12.16 | 0 | 3.5% | 6.1% | 360, 449, 560 x 164 | pass |
| 1024 x 768, stop 1 | 71.5% | 23 / 8 (16) | 8.50 | 0 | 0 | 4.5% | 232, 474, 560 x 187 | pass |
| 390 x 844, stop 1 | 47.1% | 12 / 9 (16) | 12.05 | 0 | 0 | 11.2% | 10, 435, 370 x 227 | "the timeline is 172 px tall" (as the first screen) |

  At 1280 x 720 the bar covers a quarter of the map above the timeline (its top at 426-449 px of a 629 px map), and stop 4 drops 20 items.
  The texts are whole at every size (no scroll). At both sizes stop 8 drops the names Augezd and Satschan, the places its text is about
  ("the neck of dry ground at Augezd"), and stop 1 the place names Pratzen and Pratzeberg, as the first screen does; at stops 1 and 6 the
  plateau is named by its derived reading's label, at stops 7 and 8 not at all (`opening-probe.js --only names`).

- **Reading time** is a design value: 200 words a minute (the inventory gives 160 and 238 as well). An option's length below is the glides
  plus the reading of the stops' texts at 200, plus, for a played option, the clock's own time; the visitor's pace replaces the reading time
  when Next is pressed (§4.5: nothing advances on a timer).

### 3.2 Option A: the card as today

- **Length** 0 s: it waits for the visitor. **Stops and moments**: none. **Camera**: the fitted Overview (§1.3), unmoved until a way out
  moves it (§1.5). **Text on screen**: the title, the key (41 words, 12 s at 200) and the hint (26 words, 8 s), as long as the visitor leaves it.
- **Skip**: there is nothing to skip; the card closes by any of ten ways (§1.5), from the first frame.
- **End**: the way chosen decides (§1.5): the tour's stop 1 (Study, Now tab hidden), Watch playing from 04:00, or Study on the Now tab at
  04:00 with the camera at phase 0's view (Explore) or the Overview (any other way).
- **Replay**: a reload (§1.6). **Cost**: none beyond the first screen (§1.1: 756 draw calls).

### 3.3 Option B: the card refined (no sequence)

Prototyped by editing the probe page's card (nothing is written to `shell.html`): B1 without the hint; B2 one primary action (the hint and
"Watch the battle" removed: "Guided tour" stands for "Begin", "Explore" for "Explore on my own"); B3 today's card with the Now tab under it
(decision 55's tab).

| prototype | size | the card (x, y, w x h) | unobstructed | drops (limit) | map text, lowest | the harness's checks | under the card: formations / places (of 54 on screen) |
|---|---|---|---|---|---|---|---|
| today | 1600 x 900 | 680, 550, 540 x 241 | 61.5% | 5 (12) | 8.64 | pass | kienmayer, dok / telnitz, sokolnitz, augezd, satschan, menitz, chapel |
| without the hint | 1600 x 900 | 680, 599, 540 x 192 | 63.4% | 5 (12) | 8.64 | pass | kienmayer / telnitz, sokolnitz, augezd, satschan, menitz |
| one primary action | 1600 x 900 | 680, 599, 540 x 192 | 63.4% | 5 (12) | 8.64 | pass | kienmayer / telnitz, sokolnitz, augezd, satschan, menitz |
| the Now tab under it | 1600 x 900 | 680, 550, 540 x 241 | 61.5% | 5 (12) | 8.64 | pass | kienmayer, dok / telnitz, sokolnitz, augezd, satschan, menitz, chapel |
| today | 1280 x 720 | 520, 370, 540 x 241 | 49.0% | 4 (16) | 11.98 | pass | legrand, friant, bourcier, buxhowden, kienmayer, dok, lang, prz / pratzeberg, goldbach, telnitz, sokolnitz, kobelnitz, augezd, satschan, menitz, chapel |
| without the hint | 1280 x 720 | 520, 419, 540 x 192 | 52.1% | 6 (16) | 11.98 | pass | friant, bourcier, buxhowden, kienmayer, dok / telnitz, sokolnitz, augezd, satschan, menitz, chapel |
| one primary action | 1280 x 720 | 520, 419, 540 x 192 | 52.1% | 6 (16) | 11.98 | pass | friant, bourcier, buxhowden, kienmayer, dok / telnitz, sokolnitz, augezd, satschan, menitz, chapel |
| the Now tab under it | 1280 x 720 | 520, 370, 540 x 241 | 49.0% | 4 (16) | 11.98 | pass | legrand, friant, bourcier, buxhowden, kienmayer, dok, lang, prz / pratzeberg, goldbach, telnitz, sokolnitz, kobelnitz, augezd, satschan, menitz, chapel |
| the Now tab with its dispatch under it | 1600 x 900 | 680, 550, 540 x 241 | 61.5% | 5 (12) | 8.64 | first-run card stacked on the dispatch card | kienmayer, dok / telnitz, sokolnitz, augezd, satschan, menitz, chapel |
| the Now tab with its dispatch under it | 1280 x 720 | 520, 370, 540 x 241 | 49.0% | 4 (16) | 11.98 | first-run card stacked on the dispatch card | legrand, friant, bourcier, buxhowden, kienmayer, dok, lang, prz / pratzeberg, goldbach, telnitz, sokolnitz, kobelnitz, augezd, satschan, menitz, chapel |

- **What the measures show.** Without the hint the card is 49 px lower (192 px tall): the map is 1.9 points freer at 1600 x 900 and 3.1 at
  1280 x 720, and the card uncovers Dokhturov and the chapel at 1600 x 900, three formations and three places at 1280 x 720 (the card stands
  over the battle's southern part at every size, since decision 61 frames the battle without it: at 1280 x 720 today it covers eight
  formations and nine places, the whole of the Goldbach fight). Dropping "Watch the battle" changes nothing measured (the buttons share one
  row). The Now tab under the card changes nothing measured either (the rail keeps its width); with its dispatch shown (the card's rule that
  hides it lifted, `style.css:611`) **the Stage 0 check fails as written, "first-run card stacked on the dispatch card", though the two do not
  overlap** (the dispatch in the rail, x 0-300; the card from x 680 at 1600 x 900): §0.4 item 2, measured.
- **Length** 0 s; **camera** as A; **skip** as A (Esc and the outside click close it in place). **End**: B2's primary action starts the
  opening (C) or the tour; its secondary closes it in place on the Now tab. **Replay**: as A. **Cost**: none.

### 3.4 Option C: stills through a subset of the tour

The tour's own stops, a subset, each applied by `applyTour` and joined by its glide; the tour bar as the caption; Next by the visitor.

| subset | words | reading at 200 (160 / 238) | glides | length at 200 | stops and moments | lowest glide clearance / lifts |
|---|---|---|---|---|---|---|
| C3: 1, 6, 7 | 127 | 38.1 s (47.6 / 32.0) | 3 x 1.6 s | **42.9 s** | 04:00 (ph:0), 08:45 (`soult`), 11:00 (`pratzeberg`) | 38.7 / 0 |
| C4: 1, 6, 7, 8 | 168 | 50.4 s (63.0 / 42.4) | 4 x 1.6 s | **56.8 s** | as C3, and 14:30 (`augezd`) | 38.7 / 0 |
| C5: 1, 4, 6, 7, 8 | 230 | 69.0 s (86.3 / 58.0) | 5 x 1.6 s | **77.0 s** | as C4, and 07:25 (stop 4's own clock) | 38.7 / 0 |
| (reference) the full tour, 9 stops | 455 | 136.5 s (170.6 / 114.7) | 9 x 1.6 s | **150.9 s** | every stop | 38.7 / 0 |

- **Camera path**: the tour's cameras (stop 1 phase 0's view; stop 6 the theme `pratzen`'s, phase 3's view; stop 7 the theme `cut`'s own;
  stop 8 the theme `collapse`'s, phase 8's view), joined by 1.6 s glides, never under the floor (§3.1). Under reduced motion each is a cut.
- **Text on screen**: one stop's title and text at a time in the tour bar (560 x 164-187 px at 1600 x 900), until the visitor presses Next.
  Phase 3's "flash" ("The sun of Austerlitz", `data.js:81`, 3.4 s in the toast) appears at stop 6, as in the tour today.
- **Skip**: a Skip button in the bar and Esc, from the first frame (today's tour bar has "Leave the tour", which does the same for the tour,
  `exitTour`); a pan, orbit or zoom ends it in place (§4.1).
- **End** (§5): recommended at 04:00, Study, the Now tab, the Overview, Play focused (one more glide, 1.6 s).
- **Replay**: from a "Begin the opening" entry beside "Guided tour" in the tools (both are the tour's machinery).
- **Cost**: each stop's frame as the tour's (713-788 draw calls against 756 on the first screen; the map layer under 2.5 ms); no new mesh,
  texture or pass.

### 3.5 Option D: C3 with the clock played between the stills

Watch (no rail, no dispatch), Follow on, the dwell and the draw-on as Play has them (4D); the clock played from each stop's clock to the next
by the app's own `tickClock` and `followStep` in 50 ms steps (no wall clock); the stop's text held while the clock stands at its moment.

- **Length** (the clock's own time, simulated; the dwells counted, the one at the stretch's end as it is entered; plus the reading at the
  three holds, 38.1 s at 200 words a minute):

| speed | 04:00 → 08:45 | 04:00 → 11:00 (D3) | 04:00 → 14:30 (D4, with stop 8) | D3 with its reading | D4 with its reading |
|---|---|---|---|---|---|
| ½× (the default, decision 74) | 69.3 s, 7 dwells | 106.3 s, 12 | 162.3 s, 19 | **144.4 s** | 212.7 s |
| 1× | 40.8 s, 7 | 64.3 s, 12 | 99.3 s, 19 | 102.4 s | 149.7 s |
| 2× | 26.0 s, 7 | 42.8 s, 12 | 67.3 s, 19 | 80.9 s | 117.7 s |
| 4× | 18.2 s, 7 | 31.2 s, 12 | 50.3 s, 19 | **69.3 s** | 100.7 s |

  At the default speed D3 is longer than the full nine-stop tour read at 238 words a minute (2 min 24 s against 2 min 9 s); only a speed
  the opening sets for itself (a new design value, question 116) makes it short.
- **Camera path**: Follow while playing (decision 78): its target the live events' weighted centre, its distance 230-300 units, held to
  150 px/s across the screen (measured: at most 147-150 px/s at every speed), never under the floor (lowest clearance 57.0-86.2 units,
  0 lifts). The holds keep Follow's camera, not the tour's: at 08:45 and 11:00 the eye is 230-277 units out, where the stills stand 141 and
  92 units out (§3.1). Under reduced motion it would move only at the event starts, at once; the recommendation is C instead (§4.4).
- **Text on screen**: at each hold the stop's text in the bar, as in C; between holds the dwell's caption names each event as the clock
  reaches it (`EVENTS[].n`, scanned by `redteam.js`): twelve between 04:00 and 11:00, from "Liechtenstein counter-marches across the 4th
  Column" (04:15) to "The Pratzeberg is firmly in French hands / The Russian Guard takes the eagle of the 4th Line" (11:00), each held 1.5 s.
  Two of them carry the data's open questions: 09:45 "Kamensky turns his brigade about ..." (the unresolved `kamensky@3`, `kamensky@4`), and
  11:00 "The Russian Guard takes the eagle of the 4th Line", whose hour "is not established" (`data.js:103`; decision 64). Phase 3's flash
  ("The sun of Austerlitz") shows at 08:45. Five phase announcements (07:00, 08:00, 08:45, 09:30, 10:30).
- **Skip**: as C, and Space or the Pause button pauses the clock (WCAG 2.2.2).
- **End**: as C (§5).
- **Replay**: as C.
- **Frames at 4x** (Watch: no rail; at the holds the stop's text in the tour bar):

| frame | clock | eye to target | the bar | unobstructed | placed / dropped (12) | map text, lowest | solid black / mean lum. | smoke | confidence | draw calls |
|---|---|---|---|---|---|---|---|---|---|---|
| 04:00 (stop 1's hold) | 04:00 | 425.4 | 520, 605, 560 x 187 | 82.5% | 24 / 7 | 8.5 | 0.000% / 40.1 | 0.0% | 3.5% | 756 |
| 06:30, playing | 06:30 | 247.8 | none | 89.8% | 42 / 10 | 8.24 | 0.000% / 72.4 | 0.0% | 1.9% | 787 |
| 08:45 (stop 6's hold) | 08:45 | 276.1 | 520, 628, 560 x 164 | 83.4% | 38 / 10 | 11.48 | 0.000% / 124.3 | 3.9% | 1.2% | 794 |
| 10:00, playing | 10:00 | 230.3 | none | 89.8% | 39 / 8 | 8.62 | 0.000% / 80.1 | 5.3% | 2.8% | 837 |
| 11:00 (stop 7's hold) | 11:00 | 230 | 520, 628, 560 x 164 | 83.4% | 38 / 7 | 8.18 | 0.000% / 74.8 | 9.1% | 3.4% | 831 |

- **Cost**: the played stretches draw every frame while they run (render on demand is "active" while playing); draw calls 756-837 a frame,
  as Play's.

### 3.6 The options side by side

| | A: the card today | B2: the card refined | C3: stills 1, 6, 7 | C4: stills 1, 6, 7, 8 | D3 at 4x | D3 at ½× | (the full tour) |
|---|---|---|---|---|---|---|---|
| length at 200 words a minute | waits | waits | **42.9 s** | **56.8 s** | 69.3 s | 144.4 s | 150.9 s |
| moments | 04:00 | 04:00 | 04:00, 08:45, 11:00 | and 14:30 | 04:00 to 11:00, held at three | the same | nine |
| camera | the Overview | the Overview | the tour's, 1.6 s glides | the same | Follow, 230-300 units | the same | the tour's |
| lowest clearance / floor lifts | 490 / 0 | 490 / 0 | 38.7 / 0 | 38.7 / 0 | 64.3 / 0 | 57.3 / 0 | 38.7 / 0 |
| text on screen | the key and the hint (67 words) | the key (41) | one stop at a time (127 words) | (168 words) | three stops and 12 event names | the same | 455 words |
| skip | ten ways (§1.5) | the same | Skip, Esc, a pan; from the first frame | the same | and Pause | the same | "Leave the tour", Esc |
| unobstructed at 1600 x 900 | 61.5% | 63.4% | 63.2-64.0% | 63.2-64.0% | 82.5-83.4% at the holds; 89.8% playing | the same | 62.3-64.0% |
| unobstructed at 1280 x 720 | 49.0% | 52.1% | 51.7-52.9% | 51.7-52.9% | not measured | | 51.7-52.9% (stops 1, 4, 6-8) |
| drops over the reference limit | none | none | none | none | none | | stop 4 (14 of 12; 20 of 16 at 1280 x 720) |
| draw calls a frame | 756 | 756 | 713-753 | 713-763 | 756-837 | | 713-788 |
| a new historical sentence | none | none | none | none | none (the dwell's names are `EVENTS[].n`) | none | none |
| under reduced motion | the same | the same | cuts | cuts | becomes C3 | | cuts |
| new state to remember | none | none | none | none | none | none | none |

Every option keeps every frame within the Stage 0 thresholds the harness applies (darkness, map text at AA, smoke, confidence marks); the
only frame over a reference drop limit is the tour's stop 4, which no recommended subset uses.


## 4. Accessibility and control

Today first (fact, §1.4-§1.6), then what an opening must do (recommendation). The model the project already has is the "?" overlay (3E):
`role="dialog" aria-modal="true"`, focus to its close button on opening, Tab kept inside, Esc and "?" close it, focus returned to where it
was (`shell.html:283`; `app.js:4969-4990`). Accessibility facts cited from WCAG 2.2 are the standard's success criteria by number; they are
requirements of the standard, not measurements of this page.

### 4.1 Skip, from the first frame, by keyboard, pointer and touch

- **Today:** the card can be left by any of its three buttons, a click or touch anywhere outside it, Esc, or any key but Tab, Shift and
  \` (`app.js:5002`, `:5159-5164`). It is never in the way of a visitor who wants to act: the first act closes it. But focus is not in it
  (`document.activeElement` is the body), so a keyboard visitor who presses Tab goes to the rail first (§1.4).
- **An opening** must be skippable from its first frame by: a **Skip** button in its bar, focused when the opening starts (Enter or Space
  presses it); **Esc**; a pointer or touch **pan, orbit or zoom** on the map (which already turns Follow off, decision 47: the visitor has
  taken the camera, and the opening ends where it is, with the visitor's camera kept). Its buttons at least 24 x 24 CSS px (WCAG 2.2, 2.5.8;
  today's card buttons are 34 px high, §1.4). A click on the map that does not move the camera (a selection) also ends the opening, at its
  current stop, and opens that selection's dossier as Study would.

### 4.2 Dialog semantics and focus

- **Today:** `role="dialog" aria-labelledby="fr-title"`; no `aria-modal`, no `aria-describedby`; focus is not moved into it; after it closes,
  by any way but "?", focus is on the body (a pressed button is hidden with the card, §1.5): the next Tab starts from the top of the page.
- **Recommended:** the card (if kept) a modal dialog as the "?" overlay is: `aria-modal="true"`, `aria-describedby` its key, focus to its
  primary button on load, Tab kept inside, Esc closes it as today. The opening's bar is **not modal**: the map stays live behind it (a pan ends
  it); it is a `role="region"` labelled by its title ("Opening, step 1 of 3"), its buttons in the tab order after the skip link. **Where focus
  lands:** after **Skip** or **Esc**, on the end state's single next action (§5); after the opening's natural **end**, the same; after a **pan**
  or **selection** that ends it, where the visitor's pointer was (focus is not moved). Never on a hidden element.

### 4.3 One polite live region, not flooding

- **Today:** `#live-phase` (`shell.html:88`, polite) says each phase change, once, whichever tab is shown (3B; the self-test checks it,
  `app.js:8136-8137`); the selection chip is a polite status (`shell.html:167`). The tour bar is not a live region: a new stop's text is not
  announced (pressing Next leaves focus on Next, and nothing is read). The dwell's caption (`#tb-cap`) is not live. The toast (`#toast`,
  the phase-3 "flash") is not live.
- **Recommended:** the opening announces each step once in the existing `#live-phase`: its count, title and clock ("Step 2 of 3: The French
  strike, 08:45"), not the full text (the text is in the bar, reachable by Tab, and read when the visitor moves to it). While the opening runs,
  the phase announcement it would cause is folded into that one message (one message per step). A played opening (option D) crosses five
  phase boundaries in 31 s at 4x (§3.5): announced as they are today, that is five messages besides its steps; folded, three. No message
  for the dwells.

### 4.4 Reduced motion

- **Today:** `RM` (`app.js:4`) makes every glide 1 ms (`app.js:4646`), Follow move only at each event start (`app.js:6403-6408`), every derived
  arrow whole (4D), and stops the drift (`ambientNow`, `app.js:6516-6517`). The first screen is the same under reduced motion (§1.1: identical
  measures at 1600 x 900).
- **The opening becomes stills, cut**: each stop applied at once (the glide is already 1 ms under `RM`), no played clock between stops (a
  played option, D, becomes C under reduced motion: the clock's movement over the field is motion), the bar and its controls unchanged. The
  dwell is time, not motion (4D), but with no clock played there is none. Nothing advances on its own (§4.5).

### 4.5 Nothing plays that the visitor cannot stop; no sound

- The app has no audio (fact: no `Audio`, `<audio>` or Web Audio call in the sources). An opening adds none.
- **No step advances on a timer.** A text that moves on after a fixed reading time is a time limit (WCAG 2.2, 2.2.1, "Timing Adjustable") and
  any reading rate is wrong for some visitors (§2: 160 to 238 words a minute differ by half). The visitor presses Next. A played stretch
  between two stops (option D) is moving content that starts by the visitor's press and lasts over 5 s: it needs a pause (2.2.2, "Pause,
  Stop, Hide"): the timeline's Play/Pause and Space pause it as they pause Play; Skip and Esc stop it.
- The opening never starts by itself on load unless the owner decides so (question 112): a visitor who has not asked for it meets the card
  (or its successor), whose first button starts it.

### 4.6 The key table and the "?" overlay during the opening

- The opening's keys are rows of `KEYS` (`app.js:4881`) so the "?" overlay lists them and the self-test's key dry run covers them (3E's rule:
  "the overlay cannot disagree with the bindings"): Esc (skip), Enter or Space on the focused Next (next), and, with focus in the bar, ← and →
  (back and next; as the time rail's arrows are its own, `app.js:5000`).
- Every other window key ends the opening first and then does its own action, as every key does to the card today (`app.js:5002`): 1/2/3,
  Space, the time arrows with focus off the bar, M, D, C. "?" opens the overlay **over** the opening without ending it (the overlay is modal;
  Esc then closes the overlay, not the opening: `bindHelp` stops the key, `app.js:4985`).
- Esc's row text (`app.js:4900`: "Back: close the first card, the layers panel or the tour ...") gains "the opening" in its order.

### 4.7 Below 1080 px

- **Today:** the rail is hidden (`syncDock`), the card is centred on the window (`style.css:604`), the dispatch a card behind it (hidden while
  it is open). At 1024 x 768 the map is 67.9% unobstructed; at 390 x 844, 38.3% (the card 358 px wide, most of the map's height; §1.1).
- **The opening** uses the tour bar's place, which is the full width less 20 px at 720 px and below (`style.css:533`): its text wraps to more
  lines and the bar grows (§3.1 measures it at 1280 x 720, 1024 x 768 and 390 x 844: 164-187 px tall where docked, 227 px at 390 x 844). The dispatch card stays hidden while the opening
  runs (as the tour hides it today, `hideDispatch`) and shows after it ends (decision 58).

### 4.8 Is "seen it" remembered? (trade-offs; no storage exists today)

The page stores nothing today (§1.6), so every load is a first run and the card returns on reload. Remembering would add storage to the
single file for the first time. Options:

| option | how | for | against |
|---|---|---|---|
| none (today) | every load shows the card or the opening's offer | no new state; the harness's fresh cases stay fresh; nothing to clear; behaves the same from `file://`, `https://` and an e-mailed copy | a returning visitor dismisses it each time (one key: Esc, or one click) |
| `sessionStorage` | a flag for the tab | survives a reload in the same tab; gone when the tab closes | a second tab shows it again; from `file://` its scope is each browser's own (uncertain, as below) |
| `localStorage` | a flag kept | a returning visitor goes straight in | from `file://` the storage's origin is each browser's own choice and differs between browsers (uncertain: only Chromium was run here), so an opened copy and a downloaded copy may disagree; private windows forget it; a sandboxed frame or blocked storage throws (every access in `try`/`catch`); a new kind of state the project must document; the harness's fresh pages start empty, a visitor's browser does not, so the tests would cover only the empty case unless they seed it |
| the URL | `#explore` (or a query) skips the opening | shareable, no storage, deliberate | the visitor must know it; a link someone sends decides for the reader |

**Recommendation:** none in 7B (the opening is offered, not forced, so a returning visitor's cost is one key), with the URL fragment as
the deliberate skip for links (question 117).

## 5. The first screen after the opening or the card

What the visitor is left with, measured (`opening-probe.js`, the `ends` part; each state reached by the app's own calls, at 1600 x 900 and
1280 x 720), against the 3C unobstructed baselines (`tools/visual/thresholds.js:59`: the Study views 70.3% / 62.8%, the Watch views 89.7% /
87.2%; never lowered):

| state | size | unobstructed (3C baseline) | placed / dropped (limit) | dropped | map text, lowest | solid black / mean lum. | smoke | confidence | the harness's checks |
|---|---|---|---|---|---|---|---|---|---|
| Study, Now tab, at the last stop's clock (11:00), Follow on | 1600 x 900 | 70.4% (70.3%) meets it | 13 / 3 (12) | vinohrady, pratzeberg, krzenowitz | 8.42 | 0.000% / 80.7 | 13.2% | 3.5% | pass |
| Study, Now tab, 04:00, the Overview | 1600 x 900 | 70.4% (70.3%) meets it | 25 / 7 (12) | pratzen, vinohrady, pratzeberg, zuran, goldbach, telnitz, sokolnitz | 8.28 | 0.000% / 37.5 | 0.0% | 2.8% | pass |
| Watch, paused at 11:00, the stop's camera | 1600 x 900 | 89.8% (89.7%) meets it | 15 / 3 (12) | vinohrady, pratzeberg, krzenowitz | 8.47 | 0.000% / 79 | 9.1% | 3.5% | pass |
| Study, Now tab, at the last stop's clock (11:00), Follow on | 1280 x 720 | 62.9% (62.8%) meets it | 10 / 3 (16) | pratzeberg, litava, krzenowitz | 12.67 | 0.000% / 79.5 | 14.7% | 3.6% | pass |
| Study, Now tab, 04:00, the Overview | 1280 x 720 | 62.9% (62.8%) meets it | 22 / 10 (16) | pratzen, vinohrady, pratzeberg, santon, zuran, goldbach, litava, telnitz, sokolnitz, augezd | 8.5 | 0.000% / 37.6 | 0.0% | 2.4% | pass |
| Watch, paused at 11:00, the stop's camera | 1280 x 720 | 87.2% (87.2%) meets it | 14 / 4 (16) | vinohrady, pratzeberg, litava, krzenowitz | 11.5 | 0.000% / 78.2 | 9.5% | 3.6% | pass |

**Today, after the card** (§1.5): Study on the Now tab at 04:00 (the decision-55 tab, opened by `closeFirst`), the legend closed (decision 49),
and the camera at the Overview (outside click, keys) or phase 0's view (Explore); focus on the body; Play not playing. The audit's "single next
action" does not exist: the card is gone and nothing is focused or marked.

**Recommended (question 118, option (ii)):**
- **Tab:** the Now tab (decision 55), whose dispatch is phase 0's ("Dispositions in the dark", `data.js:51-58`): the narrative continues where
  the opening's first stop began.
- **Clock:** 04:00, the day's start: the opening previewed the day; the visitor now plays it in order.
- **Camera:** the Overview as the first screen frames it (decision 61), Follow on, so Play moves it continuously (decision 78).
- **The legend:** closed to its "Key" head (decision 49), as everywhere in Study. The key's swatches are in it; the opening's first stop
  has said them.
- **The single next action:** **Play** (the timeline's `#play`, at ½×, decision 74), focused when the opening ends, skips or is dismissed by
  Esc, and named in the live region's last message ("The opening has ended. Play runs the day from 04:00."; interface words in `LABELS`, no
  claim). Nothing else is marked; every other control stays where it is.
- **Measured:** this state is the `ends` part's "Study, Now tab, 04:00, the Overview": 70.4% unobstructed at 1600 x 900 and 62.9% at 1280 x 720 (the Study baselines 70.3% / 62.8%: met), 7 and 10 dropped (limits 12 and 16), map text at AA as rendered, no solid black. It equals the first screen with the card closed
  in place (§1.5's outside click), plus the focus.

Alternatives measured: (i) Study at the last stop's clock keeps the moment but its next action is the rest of the day from 14:30 (with stop 8)
or 11:00 (C3); (iii) Watch at that clock is the largest free share but has no dispatch to read, and its next action is the same.

## 6. A design, part by part (recommendation; each part waits on the owner's answers in §7)

The parts follow the recommendations of §7 (question numbers in brackets). If the owner chooses differently, the part that question binds
changes; the others stand. Every part keeps the build single-file, framework-free, on three.js r128; none changes `data.js`, `analysis.js`,
`appearance.js` or `geo.js` (the opening reads `TOUR` by index, §2.3); none raises a drop limit or lowers an unobstructed baseline.
`binding-test.js` and `check:chronology` read the data and the arrows' bindings, which no part touches: on this build they give "binding-test:
383 checks, 0 failed" (36 arrows, 17 derived) and "errors: 0" (69 moves with a timed statement, 65 consistent, the four named conflicts
allowed); each part's report shows the same two lines.

### 7B: the first screen (questions 111-113, 117, 119, 120, 122)

**What.** The card refined (§3.3, B2): its title, its key (decision 108's words, unchanged), one primary button that starts the opening
("Begin", with the opening's length stated in words, a design value), and a secondary "Explore on my own"; the hint moved to the "?" overlay
and the legend, where 3E put the controls' words; the "Guided tour" (nine stops) stays in the tools, and "Watch the battle" is Watch (key 2)
and Play (Space), both named in the overlay. A modal dialog as the "?" overlay is (§4.2): `aria-modal`, `aria-describedby` its key, focus to
"Begin" on load, Tab kept inside, Esc = "Explore on my own" in place (today's outside-click behaviour, which does not move the camera: the
Explore button's `setPhase(0)` goes, §0.4 item 3). The rail on the Now tab under the card (decision 55 on the first screen too, [113]), which also
puts the plateau reading's "derived" tag on the first screen [119]. No storage [117].

**Files.** `shell.html` (the card's markup), `style.css` (its size; nothing else moves), `app.js` (`openFirstRun`, `closeFirst`, the key
handler's first-run rule `:5002`, the click capture `:5163-5164`, `KEYS`'s Esc row, `LABELS` for the card's words), `tools/visual/thresholds.js` (the Stage 0 check, below), `tools/visual/contrast.js` (states).

**Depends on.** Part A's answers only.

**Regression risks.** The Stage 0 check (`thresholds.js:127`): with the Now tab under the card the dispatch is visible with the card at
1080 px and up, and the check as written fails. **Replaced, with the reason stated:** "first-run card stacked on the dispatch card" becomes
"the first-run card overlaps the dispatch" (their boxes intersect), which is what the message says and what it meant when written (the
dispatch was a floating card); below 1080 px (the dispatch a card, decision 58) it still forbids both shown, since the card is centred over
the dispatch's place there (at 1024 x 768 the card's box is 242, 418, 540 x 241 and the dispatch card's, once shown, 16, 108, 440 x 557: they overlap by 214 x 241 px; measured with `tools/stage7/firstrun-probe.js`'s page, §1.1). The harness's
`first-run` and `first-run-laptop` cases are kept as they are (fresh pages, no input): their unobstructed baselines (61.4% / 49.0% and
53.1% / 49.0%) must not fall, and a smaller card raises them (§3.3: B2 measured at 1600 x 900 and 1280 x 720). Their drop limits (12, 16)
stay (the dispatch in the rail does not change the map's panels: §3.3 measured the same drops with it). The self-test's layer state "the first-run card"
(`app.js:6931`) and its first-run key check (`:8291-8314`) keep their words and swatches; the key check gains "the card has focus" and
"a derived tag is on screen whenever a derived reading is". `check:contrast`'s "first-run" state is read with the Now tab shown. The tour bar, the chip and the badge stay
hidden while the card is open (`style.css:611-612`).

**What its report must show.** Per first-run view (1600 x 900, 1366 x 768, 1280 x 720, 1024 x 768): the card's box, unobstructed before and
after, drops before and after (and which), the derived tag on screen, map text at AA as rendered, the dialog's focus and Tab order by real
key presses, Esc and the outside click; the 390 x 844 screen recorded (question 122).

**Tests.**
- self-test: the card is a modal dialog (attributes; focus on "Begin" after `openFirstRun`; Tab stays inside; Esc closes it in place,
  camera unmoved; a pointer press outside closes it in place); the rail's tab while it is open is Now, the dispatch shown, its derived
  tag visible; the key's words and swatches as now.
- harness: `first-run`, `first-run-laptop` kept (fresh, untouched); the Stage 0 check replaced as above; new: by real key presses on a fresh
  page, Tab from load stays in the card, Esc closes it with the camera unmoved and focus on the page's first control after it.
- `runtime-test.js`: a dry run of `openFirstRun` and `closeFirst` for each way out (the three states it leaves), no exception.
- `css-test.js`: the card's buttons at least 24 px (WCAG 2.5.8), `aria-modal` on the card, its words from `LABELS`.
- `check:contrast`: the "first-run" state with the Now tab; a new "first-run-narrow" state is not possible (the tool has one viewport):
  the self-test holds the card's colours at 1366 x 768, as 5G's inset.
- `binding-test.js`, `check:chronology`, `check:data`: unaffected (no arrow, no data); run and shown.

### 7C: the opening, stills from the tour (questions 111, 114-116, 118)

**What.** `OPENING`, a presentation table in `app.js`: a list of indices into `TOUR` (recommended: stops 1, 6, 7, 8 [114]), and the end
state [118]. Started by the card's "Begin", and by a "Begin the opening" button beside "Guided tour" in the tools for a later visit. Each step is
the tour's own `applyTour` for that stop (its clock, chapter, plan, feature, camera, Follow on; the dispatch hidden as the tour hides it):
the opening is a short path through the tour, not a second mechanism. Its bar is the tour bar (its place, type and buttons), headed "Opening,
step k of n", with Skip, Back and Next; its text `TOUR[i].x`, its title `TOUR[i].n`. Nothing advances by itself (§4.5). The steps are joined
by the tour's glide (1.6 s, the floor kept, §3.1); under reduced motion by cuts. The last Next ends it at the end state (§5). Skip and Esc end
it at the same end state; a pan, orbit or zoom (Follow off) or a selection ends it where it is. The live region says each step once (§4.3).
`KEYS` gains its rows (§4.6). The full nine-stop tour is unchanged.

**Files.** `app.js` (`OPENING`, `openingGo`, `openingEnd`, the tour bar's heading for the opening, `KEYS`, `LABELS`, `#live-phase`'s
message), `shell.html` (the bar's Skip button, its `role="region"` and label; the tools' button), `style.css` (the Skip button, from the tokens), the self-test,
`tools/visual/cases.js` and `thresholds.js` (new cases), `contrast.js`, `runtime-test.js`, `css-test.js`.

**Depends on.** 7B (the card's "Begin" starts it; the end state is 7B's first screen after the card).

**Regression risks.** The tour's own behaviour (`runtime-test.js` walks its nine stops; the self-test's spine check; contrast's tour states)
must not change: the opening calls `applyTour` and must leave `tourStep` at -1 when it ends. Esc's order (`app.js:4900`). The phase-3
"flash" ("The sun of Austerlitz", `data.js:81`) shows at stop 6 as it does in the tour (it is data; not changed; recorded). The harness's
`check:visual` grows by the new cases (time).

**What its report must show.** For each step at 1600 x 900 and 1280 x 720: unobstructed, drops (against the limit set on this build by
decision 62's method), map text at AA as rendered, darkness (solid black under 0.05%), the smoke's share (under 25%), the confidence marks'
share (under 20%), draw calls and the world pass; every glide sampled (lowest clearance, floor lifts 0); the bar's height and that its text
is whole; the length at 160, 200 and 238 words a minute; Skip from every step to the end state (clock, tab, presentation, focus); the same
under reduced motion.

**Tests.**
- self-test: every string the opening shows is `===` a `TOUR` field or a `LABELS` entry (the tested-text rule, §2.3); each step's clock,
  chapter and camera are the tour stop's (`stopClock`, `stopCam`); every glide stays above the floor at 1x, 4x and 10.33x (sampled as the
  self-test samples the tour's glides today); Skip, Esc and the last Next from each step land on the end state with focus on its next
  action; a pan ends it with Follow off and the camera kept; one live message per step; under `RM` no glide (the camera at the stop's
  frame at once) and no played clock; `tourStep` is -1 after it ends.
- harness: new cases `opening-1` ... (each step, fresh page, reached by real clicks on "Begin" and Next) and `opening-end` at 1600 x 900,
  and `opening-1-laptop` at 1280 x 720: Stage 0 thresholds, drops within limits measured on the 7C build (never raised), the unobstructed
  fraction recorded as each case's baseline; by real key presses: Esc from step 2 lands on the end state, Next by Enter, Skip by Space.
- `runtime-test.js`: a dry run of the sequence forward, back and skipped from each step (the states it leaves), and the tour after it.
- `css-test.js`: the opening's labels contain no clock time, figure, proper name or quotation mark; the Skip button from the tokens.
- `check:contrast`: new states "opening" (a step in the dark theme) and "opening-end".
- `binding-test.js` (no arrow drawer changes; its list of dashed drawers is unchanged), `check:chronology` and `check:data` (no data):
  unaffected; run and shown.

### 7D (only if the owner chooses played stretches, question 116)

**What.** Between two steps the clock plays (Watch-like: the panels as in the opening, Follow, the dwell, the draw-on) at the speed the owner
sets, from one stop's clock to the next's, then holds for the next text. Under reduced motion, 7C's cuts. **Files** as 7C plus the dwell's
caption in the bar. **Risks:** the dwell's captions are event names (`EVENTS[].n`, scanned), shown without their `why`: before 15:00 none is
the ice's (the opening of §3.5 ends at 11:00; one that reached 15:00 would show "French artillery fires on the ice of the Satschan mere"
without its correction, which opportunity 4 forbids suggesting); five phase announcements in 31 s (§4.3); the relief control disabled while
it plays (decision 56). **Report and tests** as 7C, with the played path sampled (clearance, floor lifts, screen speed under 150 px/s, drops
every 10 minutes no more than Follow's 19) and the pause by Space.

### What the records still leave open after Stage 7 (listed, not proposed)

Stage 7 is the roadmap's last line (`docs/VISUAL_AUDIT.md:163`). After it, the records leave open:

**Historical and data (each a data task when taken up):**
- `SOURCE_NOTE`'s open questions (`data.js:764`): the pattern of Russian infantry flags; whether Grenz infantry wore brown in 1805; vines at
  Telnitz and Stare Vinohrady in 1805; the upper bound of the Russian Guard's attack; Bagration's exact line at dawn; the Posoritz post house;
  the true position of Turas; Kologrivov's command; and the three hours the reconstruction's own texts disagree on (Dokhturov's descent,
  Kamensky's turn, Rapp's counter-charge).
- `check:chronology`'s unresolved conflicts (`dok@1`, `guard_cav@6`, `kamensky@3`, `kamensky@4`), its ceiling-flagged legs (`sthilaire@3`,
  `vandamme@3`, `bag@8`) and the dated legs forced near the ceiling (`c_gren@8`, `kollo@5`), "waiting on the sources".
- The 6B data questions (`CHANGELOG.md:224-225`): Drouet's and Rivaud's numbers, the IV Column's battalions, "Gladkov", the Empress's
  cuirassiers, Ryazhsk or Ryazan, the grenadier division's artillery, the narrative's "45 standards".
- The appearance left generic or open by 6C and 6D (`CHANGELOG.md:88-90`, `:217-223`): the Russian infantry's colours (decision 105), the
  Russian cavalry's and Guard's patterns, the Austrian flame border and Leib colours, the French corner colour at the staff's top, the
  French and cavalry staffs (the provisional 1.6), the Russian Guard cavalry's standards, headgear colours, facings and lace (decision 104).
- The meres' outlines (schematic until a georeferenced source, decision 27); the woods' shapes and the villages' extents (2E, "data-task
  questions"); the two known limits of the terrain model (`SOURCE_NOTE`: reverse stream gradients; the chapel of St Anthony's view).
- The `SOURCE_NOTE` sentence on the model readings and Stage 5's §G.3 data tasks (`CHANGELOG.md:642`, `:473-474`); decision 56's sentence not
  yet in the sources sheet (`CHANGELOG.md:1553`); the 23 phase lines that duplicate an event keep their wording (decision 59).

**Software and presentation:**
- The Plans tab's extra drops from a moved camera (decision 94: "the fix a task after Stage 5").
- The movement arrows drawn over everything, so at eye level they show through hills (5E, `CHANGELOG.md:637`).
- The self-test's five failures run at 1024 x 768 outside the harness (5C, `CHANGELOG.md:777-780`): recorded, not fixed.
- No GPU measurement of any frame cost, at any stage (software WebGL only); touch tested by synthetic events only (3D).
- The items left "for the owner's eye" in 4C-6D (the fog's whitening at 08:00-08:30, the smoke's look, the draw-on's faintness, Follow's
  framing, the skeleton's and the confidence marks' looks, the routes' faintness, the closest orbit's standard filling the view).
- The relief grid's start-up cost (2E: +0.45 s) and the per-point classification's frame cost (2F).
- The plateau reading's label carries no "derived" mark and no accessible name on the map in any view (§1.1; question 119's (b)).
- From the audit's low-impact list, not traced in the records as done: the scale bar "valid only at the screen centre in perspective; say
  so"; the compass rose's opacity and "serif fallbacks differ by OS" (`docs/VISUAL_AUDIT.md:133-134`).

## 7. Questions for the owner (numbered from 111)

Each with a recommendation and its trade-off, and the part it binds. Nothing in Stage 7 is built until they are answered.

111. **What is the opening?** (A) the card as today; (B) the card refined, no sequence; (C) a short path of stills through a subset of the
     tour, started from the refined card; (D) C with the clock played between the stills. *Recommendation:* **C, entered from B.** It is
     built only from the tested tour text and the tour's own machinery (`applyTour`), keeps every stop's measured frame (§3.1: the recommended subset's all within
     the thresholds), costs nothing the tour does not already cost, and needs no data change. *Trade-off:* C is a slideshow of four moments;
     it shows the field change between them by a glide, not by the clock. D shows the morning happen, but at the default ½× it is not short
     (§3.5) and it brings the dwell's bare event names and five phase announcements. A is the cheapest and leaves the audit's "no single next
     action" as it is. (Binds 7B, 7C, 7D.)
112. **Does the opening start by itself on load?** *Recommendation:* **no; the card's primary button starts it** ("offered, not forced").
     *Trade-off:* an automatic start reaches every visitor, but it is moving content nobody asked for (WCAG 2.2.2 then needs a pause) and a
     returning visitor sits through its first frame on every load unless "seen it" is stored (question 117). (Binds 7B.)
113. **The rail's tab on the first screen: the Order of battle (today) or the Now tab (decision 55)?** *Recommendation:* **the Now tab**, and
     the Stage 0 check replaced by an overlap test with its reason stated (§6, 7B). *Trade-off:* the Now tab puts phase 0's dispatch (66 words
     of lede and three timeline lines) beside the card's key: two texts on the first screen instead of one text and a reference list. But the
     order of battle is what the audit called "reference, not story", and decision 55 then holds everywhere in Study; the unobstructed share is
     the same (the rail does not change size, §3.3). (Binds 7B.)
114. **Which stops?** 1, 6, 7 (127 words; about 38 s of reading at 200 a minute and two glides) or **1, 6, 7, 8** (168 words; about 50 s and
     three glides) or 1, 4, 6, 7, 8 (230 words; 69 s). *Recommendation:* **1, 6, 7, 8**: the field and its key, the strike, the cut, the
     collapse, ending at 14:30 above Augezd. Stop 4 is left out (the Dokhturov conflict sits under its first sentence, and its frame drops 14 map items
     at 1600 x 900 and 20 at 1280 x 720, over the first-run limits, §2.4, §3.1); stop 9 (losses and the evidence statement) is left to the full tour, which the end state offers.
     *Trade-off:* without stop 9 the opening does not say that positions are graded; the first screen's position-confidence marks and the
     legend carry that (5B). With stop 9 it is 238 words (71 s). (Binds 7C.)
115. **What counts as "tested"?** *Recommendation:* the definition of §2.1 (guarded, scanned, anchored), **whole stops only** (no excerpts, no
     act lines, no new sentence), shown from `TOUR` by index, with a test that every string shown is `===` a `TOUR` field or a `LABELS` entry.
     *Trade-off:* the opening cannot be shorter than its stops' texts; a shorter opening needs shorter texts, which is a data task with its
     own evidence, before 7C. (Binds 7C.)
116. **Played stretches (option D), and if so at what speed?** *Recommendation:* **none in Stage 7** (stills, C). If the owner wants D: 4x
     between the stops (31 s from 04:00 to 11:00 with 12 dwells, §3.5), a new design value for the opening alone; the visitor's Play stays ½×
     (decision 74). *Trade-off:* D at ½× takes about 2 min of clock before any reading (§3.5); at 4x the field moves fast and the dwell's
     captions flash by. (Binds 7D.)
117. **Is "seen it" remembered?** *Recommendation:* **no storage** (the opening is offered, not forced: a returning visitor's cost is Esc or
     one click); optionally a URL fragment (`#explore`) for links that should skip it. *Trade-off:* every load shows the card; storage would
     spare that but brings the `file://` differences of §4.8 and a first kind of state in the single file. (Binds 7B.)
118. **Where does the opening leave the visitor?** (i) at its last stop's clock (14:30 with stop 8), Study on the Now tab, Follow on, paused;
     (ii) **at 04:00, Study on the Now tab, the Overview, with Play focused** as the single next action; (iii) Watch at the last stop's clock.
     *Recommendation:* **(ii)**: the opening previews the day; the visitor then plays it from its start, in order, at ½×, with the dispatch
     beside it; Skip and Esc land in the same place, so the end is the same however the opening ends (a pan ends it in place). *Trade-off:*
     (ii) costs one more glide (back to the Overview) and drops the visitor out of the moment the opening reached; (i) keeps the moment but its
     next action ("play on from 14:30") is the end of the day. Measured in §5. (Binds 7C.)
119. **The derived figure on the first screen.** The plateau is named on the first screen only by its derived reading, "THE PRATZEN ·
     Allied ≈ 38,700", and while the card is open nothing on screen says it is derived (§1.1; the place names Pratzen, Pratzeberg and Stare
     Vinohrady are dropped at the Overview's distance, card or no card). (a) The Now tab under the card (question 113) shows the reading with
     its "derived" tag at the top of the dispatch; (b) the plateau label marked "derived" on the map, in every view; (c) the reading hidden
     while the card is open. *Recommendation:* **(a)**, which question 113's answer gives at no further cost; (b) is a change to every view's
     map layer, outside the first run, and is listed as open (§6). *Trade-off:* with (a) the tag is in the rail, not beside the figure; (c)
     would remove the one place the key's "Pratzen plateau" is named on the map. (Binds 7B.)
120. **The card's hint ("Drag to move the map, right-drag to turn it ...").** *Recommendation:* **off the card**, into the "?" overlay (where the
     controls are listed) and the legend's control line, so the card has one message and one primary action. *Trade-off:* a first-time visitor
     who chooses "Explore" is not told the controls unless they open "?" or the legend; the "?" button is in the timeline's control row.
     (Binds 7B.)
121. **The harness cases.** *Recommendation:* keep `first-run` and `first-run-laptop` as they are (fresh, untouched); add one case per opening
     step and the end state at 1600 x 900 and the first step at 1280 x 720, their drop limits and unobstructed baselines measured on the 7C build
     (decision 62's method, never raised); replace the Stage 0 check's test as in §6. *Trade-off:* about 8-10 minutes more per `check:visual`
     run (an estimate: each new case is a fresh page, and on the harness machine a page loads in 12-27 s and a measured frame takes about a
     minute, §1.1). (Binds 7B, 7C.)
122. **Below 1024 px.** No harness case is narrower than 1024 px; at 390 x 844 the timeline is 172 px tall (it wraps; the harness's limit is
     92 px) and the card covers most of the map (§1.1). *Recommendation:* **record it, do not fix it in Stage 7**: add a `narrow-390` case for
     the first screen only, with the timeline's height recorded, not held to 92. *Trade-off:* phones remain outside the project's tested
     layouts; a phone layout is its own piece of work. (Binds 7B.)
