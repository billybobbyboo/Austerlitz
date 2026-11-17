# UI/UX roadmap step 4: the first frame (UA-03, UA-04)

Evidence for the draft pull request. The tools are in [`tools/ux-step4/`](../../tools/ux-step4/) (not bundled) and the live block in
[`tools/visual/ux4.js`](../../tools/visual/ux4.js), judged by `tools/visual/thresholds.js` `checkUx4`. The records: [`block/`](block/) (the live block
on both builds), [`proto/`](proto/) (the light and the placement measured in the live page), [`spot/`](spot/) (forced colours and reduced motion),
[`first/`](first/) (the first frame on both builds) and the matched captures [`captures/`](captures/).

## 0. The builds and the environment

| | Base (UI/UX step 3 with its records, `main` at `2b3e747f6fb4c4fd2a46dfdc067c21755c34e3c5`) | This build |
|---|---|---|
| `austerlitz-command-map.html` | 3,085,998 bytes, md5 `fd7b8b72c6315d1bb5bf0b8fa45cf263` | **3,100,850 bytes, md5 `66b4edc251ada879b2146ed7dabd385b`** |
| SHA-256 | `48f5d6314e2b8b336d17d3be6caad94c5c4254471da6095605fd013d644c9b34` | `393bbc1e88cdb7847939fede792134a09fe7dcfe16fd527d65c535783ae4f3bf` |

`origin/main` was `2b3e747` when the branch was made, #114's merge (the step 3 device records, records only, the build unchanged), which contains
#113's merge `81d7b04` (verified with `git merge-base --is-ancestor`).

**Every number here:** Chromium 141.0.7390.37 (Playwright 1.56.0's pinned build), headless, **software WebGL** (ANGLE on SwiftShader), Linux, 4 cores.
The phone is **Chromium's emulation** (390 x 844, density 3, touch, an iPhone's user agent), not a physical device. Forced colours is Chromium's
emulation of `forced-colors: active`. This machine's browser measured the base build's first screens exactly as CI's did when their baselines were set
(decision 315: 0.6076 / 0.4788, 0.5214 / 0.4788 and 0.5356). No frame rate is measured: the light change is three uniform values and a grade row, no
geometry, pass or draw call, so the device route was not required by the brief and was not run.

**The owner's decisions** (17 November 2026, "Your recommendations for both"), asked with the measures of section 3:

- **Decision 71** (the 04:00 design night light): lifted, option N3: the predawn row's sun 0.26 to 0.60 and hemisphere 0.62 to 1.25, a cooler grade
  (gain 0.92 / 0.97 / 1.10, saturation 0.86, exposure 1.22); the clock stays 04:00, the sun's computed altitude is untouched, the row is still the
  design night light the table blends into dawn from -18 degrees.
- **Decision 113** (the Now tab and its dispatch visible beside the card, from 1080 px): superseded while the card stands, option W1t: the welcome
  stands in the rail's column over its Now tab, the tools and the view switch standing down (hidden in place, `visibility:hidden`) while it is open;
  the dispatch returns the moment the card closes, by any way out. Decision 119's concern, the plateau reading's "derived" tag on screen, is met by the
  map's own label ("THE PRATZEN · derived: Allied ≈ 40,915"), which the self-test now holds.

## 1. The result against the brief's acceptance points

| # | Target | Base | This build | Met? |
|---|---|---|---|---|
| 1 | First-run unobstructed share at least 0.70 at 1600 x 900 and 1366 x 768 | 0.6076, 0.5214 | **0.7294, 0.6875** | 1600 yes; **1366 no** (0.0125 short; accepted as measured, question 1 (a)) |
| 2 | No other baseline lowered; moved baselines listed | | three raised, none lowered (section 4) | yes |
| 3 | The battle area's median luminance at 04:00 at least doubled, if decision 71 allows | 31.9 (1600), 31.6 (1366) | **52.8, 52.7** (1.66 times) | **no** (N3 kept, question 2 (a)) |
| 4 | With the key open, the three grade definitions on screen in every layout, the phone included | in none of 9 layouts | **in all 9** (section 5) | yes |
| 5 | `check:contrast`: every text at AA and the 10.5 px floor | | 57 of 57 states, 0 below AA, 0 under 10.5 px (section 6) | yes |
| 6 | Forced colours and reduced motion spot-checked | | section 7 | yes |
| 7 | Focus: the primary at load, Tab kept inside, Esc and the stay button close in place with focus on Play | as required | unchanged, by real keys (section 5) | yes |
| 8 | A live block `ux4`, judged in `thresholds.js`, failing on the base | | base 13 failures, this build 0 | yes |
| 9 | The self-test's manifest by name | 354 | **356** (section 8) | yes |

### The first frame on both builds (`first/base.json`, `first/new.json`; captures `captures/base-*.png`, `captures/new-*.png`)

`tools/ux-step4/base.js` on each build, each page fresh at 04:00 with the card open (the battle area's median luma as `ux4` reads it):

| view | base: unobstructed | base: luma | this build: unobstructed | this build: luma | the card (this build) |
|---|---|---|---|---|---|
| 1600 x 900 | 0.6076 | 31.9 | **0.7294** | **52.8** | the rail's column, 0-300 x 0-809 |
| 1366 x 768 | 0.5214 | 31.6 | **0.6875** | **52.7** | 0-300 x 0-677 |
| 1280 x 720 | 0.4788 | 31.7 | **0.6678** | **52.7** | 0-300 x 0-629 |
| 390 x 844 (phone) | 0.5356 | 30.3 | **0.5403** | **51.2** | the sheet, 453-723 (base 449-723) |

The lights read from the page: sun 0.26 to 0.60, hemisphere 0.62 to 1.25, the fill 0.16 unchanged.

## 2. What changed

**UA-04, the key** (`shell.html`, `app.js` `paintKey`, `paintLegend`): the old badge row "position approximate (B, C) · reported only (?)" is
replaced by one row per position grade, "A: Position documented in the sources.", "B: Sector documented; the frontage shown is an approximation.",
"C: Reconstructed from the narrative — treat as indicative only.", each with its letter's badge, first in the key, written from `CONF_TEXT` by
`paintKey` (the shell's text is the same words, for a page before the script runs), shown wherever the letters are drawn (the badge row's own rule:
the counters, or the Landscape's names); the reported-only "?" row now its own, shown only under a headquarters' reading, where "?" is drawn. The
"?" sheet copies the key's shown rows, so the same three lines stand there. `TIMING_TEXT`'s grades are not among them. `CONF_TEXT` and `TIMING_TEXT`
are read, not changed (`check:data` byte-identical).

**UA-03, the welcome** (`shell.html` `#firstrun`, `style.css`, `app.js` `paintKey`, `landPanels`): three rows, each with an `aria-hidden` sample: the
sides (the two colour swatches, `COLOUR_KEY`'s sentence), the grades (the badges A B C, the card's sentence that the map is a reconstruction, then
`CONF_TEXT`'s three lines as a list) and the plateau (two contour lines, "The high ground in the centre is the Pratzen plateau, which this map reads as
deciding the battle."); then the two actions (Begin, Explore on my own). The rows' sentences are the base card's own three, split into rows, with `CONF_TEXT`'s lines added; then "Every symbol: the key" (`LABELS.card.key`, the old inline "Show the
key" moved to its own line and renamed as the audit gives it). The dialog's attributes, heading and description are unchanged. From 1080 px the card
is the rail's column from the top to the timeline (the rail's own width and scrim, scrolling inside itself if a short screen needs it, the actions
stacked), so the map's free rectangle is Study's own: `landPanels` counts the hidden tools and view switch while the card stands, so the framing does
not move when the card closes. Below 1080 px it stays the centred card it was. On a phone it is the bottom sheet it was, no taller than the card it replaces (274 px at 390 x 844; its cap 50vh to 32vh), the rows
scrolling inside it with the actions and the key's button always in view (from 431 px tall; at 430 px or less the held-landscape sheet as before).

**UA-03, the light** (`app.js` `LIGHT.predawn`): decision 71's row lifted as option N3 (above). The blend into dawn and every later row unchanged.

**Unchanged** (each held by the self-test, the `ux4` block or both): the card a modal dialog; focus on Begin at load; Tab and Shift+Tab kept inside;
Esc, Explore on my own and a press outside close it where it stands, camera and clock unmoved, focus on Play (decisions 117-118); Begin starts the
opening (7C, 7D unchanged); "Every symbol: the key" opens the key as "Show the key" did (step 1's UA-05 behaviour: the legend from 1080 px wide and
above 430 px tall, else the "?" sheet with its key); steps 1 to 3's blocks pass.

## 3. The owner's questions measured first (`proto/`)

**The light** (`tools/ux-step4/proto-light.js`, `proto/light.json`, `light-more.json`; the base build with the predawn row replaced in the live
page; the battle area's median luma at the Overview, 1600 x 900; then the same view at each clock of the morning):

| option | predawn row | 04:00 | 05:00 | 06:00 | 06:30 | 07:00 | 07:30 | 08:00 | 04:00 / base |
|---|---|---|---|---|---|---|---|---|---|
| N0 (base) | sun 0.26, hemi 0.62 | 31.9 | 31.9 | 34.6 | 44.2 | 50.3 | 56.0 | 62.6 | 1.00 |
| N1 | 0.62, 1.25, saturation 1.12, exposure 1.22 | 53.2 | 53.2 | 53.8 | 55.7 | 56.3 | 56.0 | 62.6 | 1.67 |
| N2 | 0.60, 1.25, cooler gain | 47.6 | 47.6 | 48.6 | 51.9 | 54.4 | 56.0 | 62.6 | 1.49 |
| **N3 (chosen)** | **0.60, 1.25, cooler gain, exposure 1.22** | **52.8** | **52.8** | **53.4** | **55.5** | **56.2** | **56.0** | **62.6** | **1.66** |
| N4 | N2, with the dawn row lifted too | 47.6 | 47.6 | 49.6 | 55.6 | 60.3 | 64.4 | 66.2 | 1.49 |
| N5 | 0.80, 1.60, cooler gain, exposure 1.22 | 61.0 | 61.0 | 61.2 | 59.8 | 58.3 | 56.0 | 62.6 | 1.91 |

The audit's "roughly sun 0.6 and hemisphere 1.25" gives 1.49 to 1.67 times, not double. Doubling (63.8) needs about N5's values, and N5 makes the night
brighter than the dawn after it (61.0 at 04:00, 56.0 at 07:30): the light would darken as the sun rises. N3 is the brightest option that keeps the
morning brightening toward day at every clock measured. Captures: `captures/proto-light-N0..N5-1600x900.png`.

**The placement** (`tools/ux-step4/proto-place.js`, `proto/place.json`, `place-more.json`; the step-4 rows in the live page, each placement injected
as CSS; the harness's unobstructed share):

| option | the card | 1600 x 900 | 1366 x 768 | 1280 x 720 |
|---|---|---|---|---|
| W0 | the new rows centred over the map, as the base places the card | 0.5536 | 0.4474 | 0.3944 |
| W1 | the rail's column, top to timeline | 0.7066 | 0.6571 | 0.6335 |
| W2 | the rail's column, from the timeline up | 0.7066 | 0.6571 | 0.6335 |
| W2c | W2 with the dispatch's top beside it | 0.7066 | 0.6571 | 0.6335 |
| **W1t (chosen)** | **W1, the tools and the view switch standing down** | **0.7294** | **0.6875** | **0.6678** |
| W1tb | W1t, the timeline standing down too | 0.8125 | 0.7807 | 0.7656 |

At 1366 x 768 the rail (300 px), the timeline (90 px) and the tools cover about a third of the screen however the card is placed: only W1tb, which
also hides the timeline while the card is open, reaches 0.70 there. Every option keeps both actions and the key's button in view without scrolling.
Captures: `captures/proto-place-*.png`.

## 4. Baselines moved (`tools/visual/thresholds.js`)

Raised to what this build measures, rounded down to 0.1 point (the 3B and 3C method); none lowered.

| case | was | is | measured (this build) |
|---|---|---|---|
| `first-run` (1600 x 900 / 1280 x 720) | [0.607, 0.478] | **[0.729, 0.667]** | 0.7294 / 0.6678 |
| `first-run-laptop` (1366 x 768 / 1280 x 720) | [0.521, 0.478] | **[0.687, 0.667]** | 0.6875 / 0.6678 |
| `phone-390-first` | [0.535, null] | **[0.540, null]** | 0.5403 |

The other cases run with these (`harness.js --only`, the eight first-screen, opening and zoom cases): every drop within its limit (first-run 7 of 12,
first-run-laptop 8 of 16, phone-390-first 8 of 9, opening-1 8 of 8, opening-end 7 of 7, opening-1-laptop 10 of 10, the zoom cases 4 and 6 of 4 and 6),
every unobstructed share at or above its baseline (opening-1 0.6322 / 0.5173, opening-end 0.7038 / 0.6291, opening-1-laptop 0.5173 / 0.5173, the zoom
cases 0.4531 and 0.386), the map text at least 8.52:1 and 11.5 px. One harness rule is adapted, not loosened: the Stage 0 check "first-run card stacked
on the dispatch card" allows the docked card to cover the dispatch's whole width where the dispatch is the rail's Now tab (decision 113 as answered);
the overlap of a centred card over a dispatch card below 1080 px is still a failure.

## 5. The live block `ux4` (`block/`)

`tools/ux-step4/block.js` runs it alone on any build; the harness runs it in `check:selftest` (1366 x 768, 390 x 844, three grade layouts) and
`check:visual` (all of it).

- **The first pages** (fresh, by real keys and clicks): focus on Begin at load; Tab, Tab, Tab, Shift+Tab cycling Begin, Explore, the key's button inside
  the card; Esc and Explore on my own each closing it with focus on Play, camera and clock unmoved (0); the three controls inside the card; the
  unobstructed share against `UX4.FREE` (1600 x 900: 0.70, the audit's; 1366 x 768: 0.687, the build's measure, under the audit's 0.70 and put to the
  owner; the phone 0.540); the battle area's median luma at 04:00 at least 51 (the measure, `battleLum`: one frame drawn by the app and its buffer read
  in the same task, the drawn ground's points in `actionExtent()` on a 4-unit grid, Rec. 709 luma).
- **The grades** in nine layouts (1600 x 900, 1366 x 768, 1280 x 720, 1080 x 800 by the legend; 1024 x 768, 800 x 450, 1280 x 430 by the "?" sheet; the
  phone at 390 x 844 and 844 x 390 by taps): the card's "Every symbol: the key" pressed, each of `CONF_TEXT`'s three sentences shown by an element whose
  every line box is topmost and inside the viewport; no `TIMING_TEXT` sentence on screen.

| build | failures |
|---|---|
| base `fd7b8b72...` (`block/ux4-base.json`) | **13**: the grades on screen in none of the nine layouts (the key's one badge row names B and C, not their meaning); the luma 31.9 and 31.6 under 51; the unobstructed share 0.6076 and 0.5214 under 0.70 and 0.687 |
| this build (`block/ux4-new.json`) | **0** |

## 6. `check:contrast`

`npm run check:contrast` on this build: **57 of 57 states reached** (10 at 390 x 844 as a phone; 12 at 320 x 256 and in forced colours), 9,431 text
elements, 125 distinct text and background pairs, **0 below AA, 0 under 10.5 px**, 472 cased map texts read against their casing, 0 font failures
(1,030 characters in 22 computed fonts, every one an embedded face), 0 console messages; the boot cases 10 of 10. The first screen's states are the
welcome's new rows (the docked column at 1600 x 900 and 1280 x 720, the phone's sheet), so the rows' sentences, the grades' lines, the badges and the
key's button are among the elements read.

## 7. Forced colours and reduced motion (`spot/`)

`tools/ux-step4/spot.js` (`spot/spot.json`, captures `spot/new-*.png`): forced colours (Chromium's emulation, set on the loaded page) and reduced motion
(set before the page loads, as a visitor with the preference has it) at 1366 x 768 and on the phone at 390 x 844. **4 of 4 pass**: the card shown with
its three rows; focus on Begin at load; every sample drawn (under forced colours the side swatches keep their 1 px `CanvasText` outline, step 3's
forced-colours rule, and the badges and the contour take the system's text colour); the three controls inside the card; `RM` set under reduced
motion; Esc closing the card in place, focus on Play, the eye and the clock unmoved (0); the card opened again and its key's button opening the key
(the legend at 1366 x 768, the "?" sheet on the phone) with `CONF_TEXT`'s three lines on screen and no timing line. Recorded, not judged: Esc from the
key leaves focus in the legend's rows at 1366 x 768 and on Play on the phone, step 1's behaviour, unchanged.

The live change of the preference while the page is open is `check:selftest`'s block `rmLive` (unchanged). A first version of the spot script
changed the preference on the loaded page and read `RM` without a drawn frame: the media query's change event waits for a rendering update, which an
idle page does not make, so `RM` lagged (it missed on the base build's page too in a re-probe). The harness's `rmLive` forces a frame after the change
for that reason; the script now sets the preference at load.

## 8. The self-test (`tools/visual/selftest-manifest.json`, 354 to 356)

- Added: "the key's grades (UI/UX step 4, UA-04): ..." (one row per grade in `CONF_TEXT`'s words, first in the key wherever the letters are drawn, in the
  "?" sheet's copy, no timing grade) and "the welcome's rows (UI/UX step 4, UA-03): ..." (the three rows with their samples, the grades' lines
  `CONF_TEXT`'s, then the two actions, then the key's button), `ux4Checks`.
- Renamed: Stage 7B's first-run check, its docked part now the welcome in the rail's column over its Now tab, the tools standing down, the plateau's
  reading marked derived on the map (it held the Now tab and its tag beside the card; decision 113 as answered). Its other assertions unchanged.
- Adapted, not renamed: the legend rows' check holds the three grade rows and the reported-only row by the rules they are shown by (it held the one
  badge row). `css-test.js`: the card's buttons `fr-tour, fr-close, fr-grades`, the key's paragraph read from the rows.

## 9. What remains uncertain

- 1366 x 768 at 0.6875, under the audit's 0.70 (accepted as measured, question 1 (a)).
- The 04:00 light at 1.66 times, not double (N3 kept, question 2 (a)). Its look is a design decision: the night is still a design night light (decision 71), and
  nothing historical about the light at 04:00 is claimed.
- The matched captures and every measure are software WebGL; the light's look on the owner's displays is not checked here.
- `check:visual` in full runs on CI only.

## 10. Questions for the owner, and the answers

**Answered on 17 November 2026: "Your recommendations for all"**: 1 (a), 2 (a), 3 accepted. The build is unchanged (3,100,850 bytes, md5
`66b4edc251ada879b2146ed7dabd385b`): every recommendation was what this build already does. So 1366 x 768 stays at 0.6875 with its baseline at 0.687
(`UX4.FREE` and `first-run-laptop`), the light stays N3 at 1.66 times, and the three baselines of section 4 stand as listed. The audit's two targets
not met (0.70 at 1366 x 768; the light doubled) are carried as accepted, not as met.

The questions as put:

1. **1366 x 768.** The first screen's free map is 0.6875 there, short of the audit's 0.70. (a, recommended) accept it as measured, the baseline at
   0.687; (b) also stand the timeline down while the card is open (W1tb: 0.7807 at 1366 x 768, 0.8125 at 1600 x 900), which hides the clock and the
   phases on the first screen and changes what decision 113's answer kept.
2. **The light.** 04:00 is 1.66 times brighter, not double. (a, recommended) keep N3; (b) N5 (1.91 times), whose 04:00 is brighter than the dawn at
   07:30, so the morning darkens before it brightens; (c) lift the dawn rows too so the morning stays monotonic at double (not prototyped: it changes
   the light of every clock to 08:00, beyond this step's first frame).
3. **The baselines** of section 4 (three raised, none lowered): accept as listed.
