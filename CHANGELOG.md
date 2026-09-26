# Austerlitz Command Map — Changelog

## 2026-09 · Chronology data task (owner decisions 40-46; docs/STAGE2_SPEC.md §M.7-§M.12): explicit anchor times

**Status: done; awaits the owner's review. 2B has not started. `austerlitz-command-map.html`: 1,121,991 bytes, md5
`e76222b31b3671020c7643b9e6ea1925`** (was 1,107,799 bytes, md5 `5bf48b75…`). `check:baseline` and `check:data` move to this
build (below).

**What this is, and what it is not.** It makes the model agree with the app's own dated statements. Every time written here
has basis "app narrative, unsourced": the statements it follows cite no source (§M.6). The result is **internal
consistency, not verified history**. Implementation choices (the rule for a derived arrival, the audit's tolerance, the
presentation of a waiting move) are kept apart from historical claims below.

**What changed**
- **Engine** (`app.js`; guarded): the phase-start rule is documented above `anchorList` and at `FORMATIONS` (`data.js`), and
  stays the default. A track entry may carry `tm` with `at` (arrival, possibly after the phase opens) and/or `dep`
  (departure), plus evidence, grade and basis. `anchorList` resolves each anchor's window (`w`, `arr`); `legWindow` returns
  it; `legAt` passes an anchor when it is reached, not when its phase opens. A range is honoured at its far end, never a
  midpoint. A departure at or after the phase start without an arrival is reached after `moveMin` or at the arm's
  march-rate ceiling, whichever is later (**derived**, flagged `arrDerived`, and said so in the dossier). `auditMovement`
  validates every explicit time (departure before arrival; no overlap with the neighbouring legs; inside the day; none on a
  first or removal entry). Without `tm` the engine reproduces the Stage 1B timing exactly (checked before any time was
  written: every reading of `chronology-sim.js` identical).
- **Data** (`data.js`, `analysis.js`; guarded): explicit times on 20 anchors (table below); events `soult` and `hq-forward`
  re-dated as intervals; `pratzen-village`'s tolerance reason corrected; the Sources panel's open questions list the three
  unresolved conflicts.
- **Presentation** (`app.js`, not guarded): `waitingFor`, `textPhase`, `liveStatus`, `timingNow`, `TIMING_TEXT`, `drawerKey`.
  While a dated move has not begun inside its phase, the counter, block pose, smoke, selection chip and dossier show the
  previous anchor's act and status, plus "From hh:mm: <act>"; the dispatch's "What changed" list prefixes such acts with the
  time; the dossier repaints when a selected formation's move begins or ends inside a phase; a "Timing A/B/C" pill, and in the
  full dossier the window, the basis, the quoted evidence and the grade's meaning. The counter declutter (`declutter`,
  Stage 0's fallback) tries a wider ring of ten positions after its twenty; only a counter that found no place before can use
  them. This was needed because Caffarelli's dated advance puts his counter among the cavalry reserve at 10:00, and
  `check:visual`'s hybrid-dimmed view then failed with four overlaps (Caffarelli, d'Hautpoul, Walther, Drouet). With the
  ring, the view has no overlap at all, the Stage 0 Walther / Nansouty residual included.
- **Thresholds, tightened**: `tools/visual/thresholds.js` no longer allows the Walther / Nansouty overlap (fixed; the
  file's own rule is to remove an entry when fixed). `check:visual` now allows no residual.
- **Tools**: `tools/stage2/chronology.js` now computes its verdicts. REVIEW records what each statement dates (start,
  arrival, during, span), and `--times` / `--check` are new; `npm run check:chronology` is the regression, also run in CI.
  `arrow-binding.js` scores a third reading, the leg the model executes during the phase. New
  `delayed-moves.js` probes the interface. `model.js` loads `KM_PER_MAP` and `SPEED_CEIL`. `redteam.js` has a new
  section: five invalid timings must each be rejected, and a valid delayed move must hold, then move.
- **Docs**: `docs/STAGE2_SPEC.md`: decisions 40-46 (§0, §M.7), what was done (§M.8-§M.12), §C.1 re-run on the new tracks
  with the 2C rule, the earlier tables kept as §C.4 (dated). Evidence regenerated: `chronology.md`, `arrow-binding.md`;
  new: `arrow-binding-before-chronology.md`, `delayed-moves.md`, two screenshots.
- **Baselines**: `check:baseline` checks this build; `check:data` compares against `archive/chronology-e76222b3.html` (this
  build, frozen), because the data changed on purpose. Its report against the Stage 0 reference is recorded below.

**Guarded declarations changed** (`check:data` against `archive/stage0-c09c4b23.html`; exactly these 7):
- `FORMATIONS`: `tm` on 20 anchors (below). No position, strength, route, status, act or order-of-battle entry changed.
- `EVENTS`: `soult` t 525 → [525, 555]; `hq-forward` t 720 → [720, 760]; `pratzen-village` tolWhy text only (time and 1.5 km
  tolerance unchanged).
- `SOURCE_NOTE`: one sentence added to the open questions, on the three unresolved conflicts.
- `anchorList`, `legWindow`, `legAt`, `auditMovement`: the engine extension and its validation (above).
Unchanged: `OVERLAYS` (2C's), `PHASES`, `FEATURES`, `ANALYSIS`, `TOUR`, `ACTS`, `COMMAND`, `PLANS`, all geography and every
derived-reading function.

**The anchors** (was = Stage 1B window; evidence file:line and full reasoning in §M.8; grade B = the app's "c." hour,
C = inferred; basis for all: app narrative, unsourced):

| anchor | was | is | time written | grade |
|---|---|---|---|---|
| gqg@6 Napoleon to Stare Vinohrady | 10:35-11:15 | 12:00-12:40 | dep 12:00 (arrival from its 40-min march) | B |
| sthilaire@3, vandamme@3 the climb | 08:00-08:45 | 08:45-09:15, 08:45-09:14 | dep 08:45 (arrival derived) | B |
| rivaud@3 follows Soult | 04:00-08:45 | 08:45-09:09 | dep 08:45 (arrival derived) | C |
| sthilaire@7, guard_inf@7, c_gren@7 the wheel | 11:15-12:45 | 13:00-14:00 | dep 13:00, at 14:00 | B |
| vandamme@7 the wheel | 11:15-12:45 | 13:00-13:15 | dep 13:00 (arrival derived; 14:00 would break the ceiling to Augezd by 14:30) | B |
| legrand@7 "as the trap closes" | 09:30-12:45 | 13:00-14:00 | dep 13:00, at 14:00 | C |
| legrand@8 retakes Telnitz for good | 12:45-14:30 | 14:00-15:00 | at 15:00 | C |
| friant@2 retakes Telnitz, falls back | 07:00-08:00 | 07:00-08:30 | at 08:30 | C |
| kollo@4 Jurczek attacks the summit | 08:45-09:30 | 08:45-10:15 | at 10:15 | B |
| lang@4 Langeron's reinforcements | 08:00-09:30 | 08:00-10:30 | at 10:30 | C |
| bag@6 begins falling back | 10:30-11:15 | 11:15-11:25 | dep 11:15 (arrival derived) | B |
| bag@8 withdraws on Rausnitz | 12:45-14:30 | 16:30-16:45 | dep 16:30 (arrival derived) | C |
| kienmayer@8, dok@8 over the neck under fire | 12:45-14:30 | 14:30-15:00 | dep 14:30, at 15:00 | C |
| caffarelli@5, suchet@5 Lannes advances; bag@5 counter-attacks | 04:00-10:30 | 09:30-10:30 | dep 09:30 | B |

Not given a time: `friant@1` (re-reviewed: §M matched its statement to the wrong anchor; the statement dates the arrival at the
Goldbach, `friant@2`; the waypoint's own move is undated); and the four anchors of the unresolved conflicts.

**The three conflicts (decision 42): not settled.** Duffy (1977) and Smith (1998) are not in the repository, and this
environment's network policy blocked every host tried (archive.org: HTTP 403 from the proxy; Google Books, HathiTrust, Open
Library, Gallica, Wikipedia: no connection). No web summary or AI output was used. Dokhturov's descent (`dok@1`), Kamensky's
turn (`kamensky@3`, and `kamensky@4`, dated by the same timeline entry) and Rapp's counter-charge (`guard_cav@6`) keep
today's timing, are listed in the Sources panel's open questions, and are the only early moves the regression allows, by name.

**Creeping moves (decision 45).** Given a departure: Caffarelli, Suchet, Bagration (c. 09:30), Rivaud (after 08:45).
**Undated, unchanged:** Kellermann, Nansouty, d'Hautpoul (phase 5), the Allied headquarters (phase 3), the Russian Guard
cavalry (phase 6).

**Derived values that moved** (old → new; re-derived, no threshold loosened; details §M.12):
- centre separation first reported 08:26 → **09:03** (last 14:14 → 14:52);
- plateau at 08:45, Allied / French 23,550 / 13,300 (cut) → 23,550 / **0** (not cut); at 14:00, 0 / 18,500 → 0 / **30,900**;
  every other mark, the 04:00 figure (38,700) and tour stop 4's figures (38,700, 19,300 first at 07:07) unchanged;
- event agreement: still 0 disagreements, worst 0.82 km; `soult` 0.44 → 0.20 km, `pratzen-village` 1.14 → 1.21 km (1.5
  allowed, unchanged), `hq-forward` 0.32 → 0.00 km;
- fastest leg by arm: infantry 3.41 → 4.97 km/h, hq 7.15 → 7.62, mixed 1.11 → 3.87 (ceilings 5, 12, 8: no leg over);
- `redteam.js` mean march rates, infantry / cavalry 0.77 / 0.82 → 1.28 / 0.82; its **warning** "cavalry mean rate is not
  above infantry" now fires (a warning, not a finding: the dated moves are faster, the undated cavalry moves still creep);
- Command view counts (seen / uncertain / unknown): French eyes, phases 5-8, 2/2/9, 4/0/9, 9/0/4, 7/0/6 → 4/2/7, 6/0/7,
  7/0/6, 8/0/5; Allied eyes, phases 2-3, 3/1/14, 5/1/12 → 4/1/13, 6/1/11;
- harness clocks 08:20-10:00: 6 to 8 formations moved, up to 1,656 m (Rivaud, 08:20);
- chronology audit: 22 early (70 with a timed statement) → **4 early** (69; the unresolved conflicts), 0 late;
- arrows derivable on the leg executed in their phase: 1 → 4.

**Expected values that changed** (each a recorded consequence of this data change): `check:baseline` md5 and size;
`check:data`'s reference build; `tools/visual/thresholds.js` KNOWN emptied (tighter). No suite's assertion was edited;
`sim-test.js`'s event rule (1 km, 2 km cap) and `selfTest`'s 38,700 are unchanged.

**Text.** Searched narrative, tour, analysis, dispatch, command and dossier text for derived times or figures: tour stop
4's "by 07:15" still holds; tour stop 8 and the chapter "The destruction of the Allied left" (both at 14:40) now fall inside
the separation interval (before, the reading had stopped at 14:14); nothing needed correcting, nothing is flagged.

**Tests** (on this build)
- `npm run build`: 1,121,991 bytes, md5 `e76222b31b3671020c7643b9e6ea1925`.
- `npm test`: RESULT_TEST.
- `npm run check:data` against the Stage 0 reference: 7 DATA declarations changed, exactly those listed; against the new
  reference: all identical.
- `npm run check:chronology`: RESULT_CHRON.
- `npm run check:visual`: RESULT_VISUAL.
- `npm run check:contrast`: RESULT_CONTRAST.
- `npm run check:baseline`: passes on this build.
- `tools/stage2/delayed-moves.js`: eight states, before and after (`docs/stage2-evidence/delayed-moves.md`).

**Not verified:** the literature behind every time written (all "app narrative, unsourced"); the three conflicts (sources
unreadable here); the derived arrivals (a model rule, not evidence); the undated creeping moves.

## 2026-09 · Stage 2A continued: owner decisions 31-39 and the chronology audit (docs/STAGE2_SPEC.md §M); no change to the build

**Status: §M awaits the owner's review; 2B has not started. `austerlitz-command-map.html` unchanged: 1,107,799 bytes, md5
`5bf48b75373fe0cf9fc8a32cbeae918c`.**

**What changed**
- `docs/STAGE2_SPEC.md`: the owner's answers to §L recorded as decisions 31-39 (§0, §L), and the specification updated
  where they apply (§B, §C, §F, §I, §J, §K); §C lists what each mismatched arrow's endpoints correspond to (decision 37);
  new §M, the chronology audit.
- `tools/stage2/chronology.js` (every anchor against the app's timed statements, with the hand-reviewed verdicts) and
  `chronology-sim.js` (the derived readings under each timing remedy); `model.js` exports more data; evidence
  `docs/stage2-evidence/chronology.md`.

**The audit (§M), in brief.** 148 moves; 70 have a timed statement about the move in the app's own data: 48 consistent,
**22 early** (median 45 min, up to 120), **0 late**; 9 more creep from 04:00. Mixed, not systematic: moves that prepare a
phase's opening action agree with the engine's phase-start rule; moves that are the phase's action (climbs, charges, the
wheel, retreats under fire) are early. The rule was used deliberately in the correction pass and some event markers were
fitted to it. Remedies simulated; recommendation (c): keep the rule as a documented default, add explicit anchor times
from the app's own statements in a separate data task before 2C. Both of the owner's cases confirmed; the item at t 680
is the analysis chapter "guard", not an event (the event `guard-broken` starts at 11:15).

**Corrections recorded**
- Decision 25: the rotation export is `GEOREF.ROT_DEG`; the decision's wording `GEOREF.ROT` is superseded.
- The Second Military Survey covered Moravia in 1836-1840 (accepted).
- The Satschan draining dates disagree between sources: austerlitz.org's Žatčany page gives 8-12 December 1805; the
  estate report as quoted elsewhere gives 8-16 December. Both recorded with their sources; neither adopted until the
  report itself is read.
- The finds disagreement (18 guns and 180 horses in the quoted report; 38 guns and about 130 horses in the app's data and
  English summaries) stays open.

**Open data tasks (recorded, not done)**
- The going layer's slope thresholds (0.88 and 1.70 true degrees): source them, or rename the classes descriptively
  (decision 32). Until then they are provisional and unsourced design values.
- The chronology (§M.5): explicit anchor times from the app's timed statements; the three disagreeing texts; re-dating the
  events fitted to the early timing; the suite values re-derived. Before 2C.
- The Satschan draining dates and finds.

**Tests**
- `npm run build`: md5 `5bf48b75373fe0cf9fc8a32cbeae918c`, 1,107,799 bytes (unchanged).
- `npm run check:baseline`: passes.
- `npm test`: ALL 8 SUITES PASSED.
- `npm run check:data`: all 112 DATA declarations byte-identical.
- `chronology-sim.js` check: its variant engine reproduces today's positions exactly (0.000000 map units).

**Not verified:** the literature behind the app's timed statements (§M.6 lists the source questions); the draining dates
(the pages could not be opened from this environment); the remedies are simulated, not implemented.

## 2026-09 · Stage 2A: map readability specified (docs/STAGE2_SPEC.md); no change to the build

**Status: specification for the owner's review. `austerlitz-command-map.html` unchanged: 1,107,799 bytes, md5
`5bf48b75373fe0cf9fc8a32cbeae918c`** (confirmed on `main` before the work, and by `check:baseline` after it).

**What changed**
- `docs/STAGE2_SPEC.md`: owner decisions 18-30 and their verdicts; sections A-L (height inventory and display-height
  design, exaggeration evidence and the 1x options, arrow binding, dashes, "IV Column halted", the Allied arrowhead,
  map text measured, the DOM/SVG layer, the north-up paper map, the unobstructed-map baseline, the provisional
  standard ratio, the meres research note, test plan, pull-request plan, open questions).
- `docs/stage2-evidence/`: the renders and tables the specification cites.
- `tools/stage2/`: the scripts that produced every number (not bundled). Probes are injected into the running page
  for measurement only; no source file is changed by them.
- **`check:baseline` re-baselined** (`package.json`): it passed only on the Stage 0 build (`c09c4b23…`) and has failed
  since Stage 1B by design. It now passes only on the Stage 1B build: md5 `5bf48b75373fe0cf9fc8a32cbeae918c` **and**
  1,107,799 bytes, so it proves this task did not change the build. `CLAUDE.md` updated to match.
- `.gitignore`: `tools/stage2/out/`.

**Findings that the owner's decisions did not anticipate** (details and questions in the specification)
- The going layer's slope classes are computed on the drawn 10.33x slope: "hard for guns" above 9 degrees drawn is 0.88
  degrees true, "severe slope" above 17 is 1.70 (§B.4, question L2). Not changed.
- 29 camera presets live in guarded data (`PHASES`, `ANALYSIS`, `TOUR`) in 10.33x world units; 2B must re-frame at use.
- `OVERLAYS` arrows depict the leg that *arrives* at the phase's anchor (10 of the 11 derivable arrows), not the leg
  *across* the phase that decision 22 names (§C.1, question L3).
- The plan staging-area outline is a dashed drawing missing from `VISUAL_SPEC.md` §10.5 (a plan, so allowed).
- The Satschan pond finds in the app's data (38 guns, about 130 horses, two men) disagree with a local estate report
  as quoted (18 guns, 180 horses, two men; drained 8-16 December 1805). Kept as a disagreement; not changed.
**Tests (all run on the unchanged build)**
- `npm run build`: md5 `5bf48b75373fe0cf9fc8a32cbeae918c`, 1,107,799 bytes, identical to `main`.
- `npm run check:baseline` (re-baselined): passes; a copy with one byte added fails (exit 1).
- `npm test`: ALL 8 SUITES PASSED.
- `npm run check:data`: all 112 DATA declarations byte-identical (against the Stage 0 reference, as before).
- `npm run check:visual`: STAGE0: all checks passed; `selfTest()` 13/13 PASS; the only counter overlap is the named
  hybrid-dimmed Walther / Nansouty residual.
- `npm run check:contrast`: 3,101 text elements, 0 below AA, 0 below 10.5 px.
- The measurement scripts in `tools/stage2/` ran to completion; their outputs are in `docs/stage2-evidence/`.

**Not verified or not done:** browsers other than headless Chromium 141 with software WebGL (the pass times of the
DOM probe and the factor-change times are for that renderer, not a user's GPU); the meres sources could not be opened
from this environment (the network policy blocked them), so every figure in §I.2 is as quoted in search results and
must be read from the source before use; arrowhead legibility was judged by eye on crops, with measured sizes, not by a
numeric test; the map-text contrast method can under-read where a run's 2 px margin takes in a neighbouring mark; the
probes approximate what 2B-2F would build (for example the 1x footprints use the block's own frontage and depth, the
paper-map probe is near-orthographic, not orthographic). Historical uncertainty (the pond finds and dates, the pond
areas) is recorded in §I.2 as disagreement between sources, separate from these implementation limits.

## 2026-09 · Stage 1B: the visual language implemented (docs/VISUAL_SPEC.md)

**Status: done; all checks pass except `check:baseline`, which fails by design (the build changed).**
`austerlitz-command-map.html`: 1,107,799 bytes, md5 `5bf48b75373fe0cf9fc8a32cbeae918c` (was 1,097,610, `c09c4b23…`).

**What changed** (the specification's §12 plan; values and departures in its new §14):
- **One source of colour and type:** `tokens.js` (`TOKENS`, strict JSON between markers) holds every interface and
  symbology colour for the landscape and paper themes, the seven type steps and the font stacks. `build.py` loads
  it second in the bundle; `python3 build.py --tokens` writes its copy into `style.css`, and the normal build stops
  if that copy has drifted. Nation colours stay only in `NATION` (unchanged); the four unused CSS nation/panel
  properties are gone.
- **Stylesheet:** every colour is a token (the developer overlay's text excepted); the 52 paper-map override rules
  are replaced by the paper token set, so the whole interface turns light on the paper map (owner decision 8); the
  interface accent is warm ivory, paired with a bar, underline or weight; 20 font sizes became the seven steps with
  floors of 10.5 px (tertiary), 12.5 px (battle information) and 14 px (dossier and dispatch body); text is no
  longer faded with opacity.
- **Counters (`symbols.js`):** a cased frame in the side colour (blue / amber) between dark keylines; the nation's
  fill and a nation tag (`NATION.tag` in `NATION.ink`); no dashes; plated B / C / "?" badges; neutral status plates
  with icons; dimmed counters dim only fill, frame, glyph and tag, with text one step down; a selection ring
  outside the frame; frame 110 x 78 units, names, strengths and status at 27 units (at least 12 px on screen).
- **Map and interface (`app.js`, `world.js`, `shell.html`):** `SIDE_COL` from the side tokens; every event, decisions
  included, in its side colour (dossier bar: side, not the Russian fill); annotation colour for overlay, objective,
  plan, plateau and event text, with paper variants; formation names neutral with a side mark; solid movement
  trail, selection ring, plateau ring and retreat arrows (only intended routes and plan links stay dashed);
  terrain-analysis colours from one table with paper variants, recoloured on the paper map; ridge, escarpment,
  "hard for guns" and vineyards off the amber axis; status, claim, layer and source tags as neutral plates with
  icons; the legend's going rows written from the table the going layer draws, the dash entry replaced by the badge
  row, the terrain-notation dash shown only with the terrain-study layer; place labels at least 10.5 px.
- **New check:** `npm run check:contrast` (`tools/visual/contrast.js`).

**Tests (all run on the final build):**
- `npm run build`: 1,107,799 bytes; the token block matches `tokens.js`. Drift check proven on a scratch copy: an
  edited token without `--tokens` stops the build (exit 1).
- `npm test`: ALL 8 SUITES PASSED (css-test 0 errors, 9/9; test.js 0 errors, 41/41; geo-test 54/0; terrain all OK;
  audit 0 and 0 violations; sim-test 0 errors; redteam 0 findings; runtime-test 0 errors).
- `npm run check:data`: all 112 DATA declarations byte-identical; 34 rendering and interface declarations changed,
  11 added, `TONE` removed.
- `npm run check:visual`: STAGE0: all checks passed; `AUSTERLITZ_DEBUG.selfTest()` 13/13 PASS, including the
  first-run key against the legend and the drawing colours. Counter overlaps: only the allowed hybrid-dimmed
  Walther / Nansouty pair. An earlier counter layout (frame 150 x 86, all counter text at 27 units) failed this
  threshold (7 pairs hybrid-dimmed, 1 paper map) and was re-fitted, not the threshold.
- `npm run check:contrast`: 3,101 text elements, 0 below WCAG AA, 0 below 10.5 px (the Stage 0 build: 67 below AA,
  447 below 10.5 px).
- `npm run check:baseline`: fails by design (new md5).
- No suite or self-test assertion was changed: none checked a colour the specification changed.
- Screenshots before and after: `docs/stage1-review/`.

**Not verified or not done:** browsers other than headless Chromium 141 with software WebGL (the CSS uses
`rgba(var(--x-rgb),a)`, supported in all current browsers); canvas text contrast is computed from the drawing code
(specification §6.3), not measured in pixels; the highlighted family's dominance in the hybrid-dimmed view was judged
by eye, with no numeric metric; event glyphs keep their landscape (light) side colours on the paper map, since they
are built once; the view-mode switch still fades to 24% in watch and map modes (a behaviour, left); the legend's empty
area and its overlap with the dispatch on the paper map were there before (layout, Stage 2 and 3).

**Note added 26 September 2026 (Stage 2A review):** the contrast results above measure page text; for the canvas text (counters
and map labels) this entry relied on values computed from the drawing code (`docs/VISUAL_SPEC.md` §6.3), as its "Not verified"
line says. The measurement in `docs/STAGE2_SPEC.md` §E does not confirm it for counters on the paper
map (grey text on the translucent paper halo, 2.9-4.5:1 over darker hillshade) or for dimmed counters' nation tags (about
1.7:1, drawn at 34% opacity, which also does not meet owner decision 13). The entry is left as written.

## 2026-09 · Stage 1A: owner decisions recorded in the specification; no code change

`docs/VISUAL_SPEC.md` records the owner's answers to its ten open questions as owner decisions 8-17 (§1.1)
and updates the sections they affect: the whole interface turns light on the paper map through a second token
set; formation names are neutral text with a side-coloured mark beside them in the landscape view; evidence
and source tags are neutral with icons; counters carry `NATION.tag`; dashes mean "planned or intended" only;
two named symbol scales (figure, landscape), with trees grouped with settlements; type floors of 10.5 px
(tertiary), 12 px (battle information) and 13 px (body text); ridge, escarpment and "hard for guns" leave the
amber axis in Stage 1.

Checked for the decisions (fact): the chevron head on plan ribbons is set by side (`app.js:2309`), not by plan,
so it is a side cue; `retreat` movement arrows are drawn dashed although they are not intended movement, and
become solid in Part B (`axis`, the Allied columns' intended routes, stays dashed); "hard for guns" is only a
palette value in `makeGoingPalette` and a legend key, so it changes in Stage 1, not Stage 4; the going legend
lacks the vineyard class; the tree kit measures 3.4 (broadleaf) and 4.7 (conifer) world units median, 214 and
295 m, about 10-15 times life like the buildings; counter strengths and designations reach only 9.5-11.8 px on
screen, below the new 12 px floor. A scratch prototype (not committed) of full-opacity text on dimmed counters,
rendered through the hybrid-dimmed harness case, made the text legible but weakened the highlighted family's
dominance, so the rule is full opacity one step down in tone and weight, with neutral status plates.

No code, data, test or build change: `austerlitz-command-map.html` unchanged, 1,097,610 bytes, md5
`c09c4b23d9e245ff9d693960cf9496b9`. Still open: exact replacement colours (chosen in Part B against the tests in
the specification), the Allied arrowhead (Stage 2), the kind of the "IV Column halted" arrow (a data question),
and the counter re-fit for the 12 px floor.

## 2026-09 · Stage 1A: specification drafted; no code change

`docs/VISUAL_SPEC.md`: the visual language specification (Stage 1, Part A), written against `e9190e1` with the
owner's seven decisions as fixed input. It holds the colour and type inventory with file and line (533 colour
literals, 168 distinct interface and symbol colours), the encoding table, proposed colour tokens with one
source of truth for CSS and JavaScript, measured text contrast, a colour-vision check, the type scale and label
hierarchy, the symbol-scale convention, the confidence encoding, the Part B plan with its expected effect on
every check, and ten open questions.

**Measured, not estimated:** 192 text/background pairs read from the built page in Chromium across 17
interface states, composited over dark and bright map backdrops; 72 fail WCAG AA (4.5:1). Findings that
bear on the decisions: a single side-coloured counter frame cannot reach 3:1 against its own fill and every
ground, so decision 1 needs a cased frame (a side band between dark keylines); the confidence badge that
decision 4 makes the only encoding has no plate today (1.15:1 on bright ground); amber also carries
non-Allied meanings (terrain-analysis ridge and escarpment, the "hard for guns" going class, the height
label, objectives, the movement trail, decision events), which decision 2 moves off it except for the going
classes (terrain palette, Stage 4); the paper map is half themed. `NATION` does not need to change. Blue and
amber stay distinct under protanopia, deuteranopia and tritanopia but are identical in greyscale, so side
also needs a non-hue cue.

No code, data, test or build change: `austerlitz-command-map.html` unchanged, 1,097,610 bytes, md5
`c09c4b23d9e245ff9d693960cf9496b9`. Uncertain: the real-world sizes used to state the symbol-scale factors
are rough general values, not historical data; standard and flag dimensions are to be sourced in Stage 6.

## 2026-09 · CI checks the committed build; set-up tasks closed (no change to the build)

`.github/workflows/checks.yml` now runs `git diff --exit-code --stat austerlitz-command-map.html` after `npm run
build`: the committed product must be exactly what the sources build, so a source change committed without its
rebuilt HTML fails CI. Checked on a scratch clone: exit 0 on this tree; exit 1 after a one-character edit to
`style.css` and a rebuild. `docs/HANDOFF.md` is now the record of the four completed set-up tasks; `README.md` and
the finishing note in `CLAUDE.md` follow. `austerlitz-command-map.html` unchanged: 1,097,610 bytes, md5
`c09c4b23d9e245ff9d693960cf9496b9`.

## 2026-09 · Automated checks on every push (CI only; no change to the build)

**Status: added (`docs/HANDOFF.md`, task 4).** `.github/workflows/checks.yml` runs on every push and pull request, on
`ubuntu-latest` with Node 22: `npm install`, `npm run build`, `npm test` (fails if any suite fails, since task 3) and
`npm run check:data`. Implementation choices: `npm install` rather than `npm ci`, because the repository has no lockfile;
Playwright's browser download is skipped, and `npm run check:visual` is not run in CI (it needs Chromium and about ten
minutes of software rendering; it stays a local check); read-only repository permissions; a 45-minute job limit.

**Verified locally** on a fresh clone of this branch with the same steps: all four exit 0 (`ALL 8 SUITES PASSED`; 112
DATA declarations byte-identical). The first run on GitHub is the push of this change; its result is reported in the
pull request. `austerlitz-command-map.html` unchanged: 1,097,610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`.

## 2026-09 · The test runner fails loudly (test tooling only; no change to the build)

**Status: done (`docs/HANDOFF.md`, task 3).** `tools/run-all.sh` printed each suite's summary but always exited 0, so
`npm test` passed whatever the suites found. Two suites never set an exit code at all: `audit.js` (it reports only
`MARCH RATE VIOLATIONS (N)` and `TERRAIN VIOLATIONS (N)`) and `runtime-test.js` (`errors: N` and `  E ` lines). The
runner now marks a suite failed if it exits non-zero (which covers a crash and the 600 s timeout) or its output shows an
error summary: a non-zero `ERRORS`, `CSS ERRORS`, `errors`, `findings`, `VIOLATIONS`, `failed` or `disagreements`
count, or a failed-check line (`  ! `, `  E `, `  FAIL `, `  ✗ `, `BROKEN`, `FLOATS`, `DISAGREE`, `<-- outside`). It
prints `!!! <suite> FAILED` after that suite, and at the end either `ALL 8 SUITES PASSED` (exit 0) or `REGRESSION
FAILED: <suites>` (exit 1). The per-suite summary it prints is unchanged, and no suite was changed. **Design decision:**
warnings (`warnings: N`, `console.warn unique: N`) do not fail the run; the suites themselves keep them apart from
errors.

**Verified:** on this tree `npm test` prints `ALL 8 SUITES PASSED` and exits 0, and none of the failure patterns
matches anything in the eight suites' full output (no false alarms). On a scratch copy broken three ways (the infantry
march-rate ceiling lowered to 1 km/h, a throw added to `syncSelChip`, the French gun total set to 140), the new runner
exits 1 and names `test.js`, `audit.js`, `sim-test.js` and `runtime-test.js`; `audit.js` and `runtime-test.js` exited
0 and were caught by their summaries (25 march-rate violations; 2 errors). The original runner, on the same copy,
exited 0. `npm run check:baseline`: md5 `c09c4b23d9e245ff9d693960cf9496b9`. `npm run check:data`: 112 DATA
declarations byte-identical. `docs/SUITE_RECOVERY.md` and the checks note in `CLAUDE.md` updated.
`austerlitz-command-map.html` unchanged: 1,097,610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`.

## 2026-09 · `runtime-test.js` brought up to Stage 0 (test harness only; no change to the build)

**Status: done (`docs/HANDOFF.md`, task 2).** `runtime-test.js` reported 2 errors on Stage 0 (`mesh.getMatrixAt is
not a function`; `_cR.setFromMatrixColumn is not a function`). The first was thrown inside `init`, so on Stage 0 none of
its drive checks had run. Cause: its stand-in three.js had token maths, while Stage 0 seats figures through world
matrices and places labels through the camera's projection. Changes, all in `runtime-test.js`:
- The maths is the real `three@0.128.0` (the existing devDependency): `Vector2`, `Vector3`, `Matrix3`, `Matrix4`,
  `Quaternion`, `Euler`, `Spherical`. Beyond the handoff's list, and needed for the same reason: the stand-in
  `Object3D` extends the real one (its token quaternion and empty `matrix` could not carry a world transform), and the
  cameras are the real `PerspectiveCamera` and `OrthographicCamera`. Rendering stays stubbed (renderer, render
  targets, textures, materials, geometries, `Color`).
- `InstancedMesh` stores per-instance matrices as r128 does (`instanceMatrix.array`, `setMatrixAt`, `getMatrixAt`,
  `count`).
- The `document` stand-in gained element `querySelector` (Stage 0's selection chip) and `getComputedStyle` (inline
  style or defaults; no stylesheet is loaded), which Stage 0's label placement asks for.
- The re-seating check's reset set `rec.seatPos=null`, which Stage 0's `settleBlock` no longer reads (it keeps the
  state in `rec.seated`); the reset now clears both. Its assertion is unchanged.

No assertion was removed or loosened (no changed line in the diff contains `throw`, `Error`, `errs`, `warns` or
`console`). **Verified:** on Stage 0, `runtime-test.js` reports 0 errors, 0 warnings, and its output is byte-identical
to the unmodified test's output on the correction-pass build (36 drive checks plus the photo atlas, same numbers:
40 formations, 281 clock steps, 24 event hops, 12,688 apron faces, 294 men in 5 draws, 57 parent/child moments). The
modified test's output on the correction-pass build is byte-identical to the unmodified test's. `npm test`: all eight
suites pass (runtime 0 errors). `npm run check:baseline`: md5 `c09c4b23d9e245ff9d693960cf9496b9`. `npm run
check:data`: 112 DATA declarations byte-identical. `docs/SUITE_RECOVERY.md` and the checks note in `CLAUDE.md`
updated. Not re-run: `npm run check:visual` (no application code changed). `austerlitz-command-map.html`
unchanged: 1,097,610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`.

## 2026-09 · Recovered tree put in place; `dist/` retired (no change to the build)

The upload of the recovered tree (commit `03b7118`) came through the GitHub web interface and was flattened again:
all 60 files landed at the repository root. The layout the new `CLAUDE.md` and `docs/SUITE_RECOVERY.md` describe is
restored, each file placed by its own path references:
- **Removed as byte-identical duplicates** of files already in place (checked with `cmp`): `README (1).md`,
  `README (2).md`, `STAGE0_VERIFICATION.md`, `VISUAL_AUDIT.md`, the eight `tools/visual/` scripts, the four
  `tools/stage0/` files, `split-from-html.py`, both `archive/` builds, and `download` (= `.gitattributes`).
- **Replaced by the uploaded version:** `docs/SUITE_RECOVERY.md` (now the recovery record), and `.gitignore`
  (uploaded as `download (3)`; adds `bundle.js` and the generated `_*.js` test modules).
- **Moved:** `HANDOFF.md` to `docs/`; `run-all.sh`, `mk-helpers.js`, `mk-world-mod.js` (they take `..` as the root)
  and the twelve history tools (`geo-migrate.js`, `geo-anchor.js`, `warp.js`, `warp-proto.js`, `geo-proto.js`,
  `geo-dump.js`, `relief-fit.js`, `stale-compare.js`, `inventory.js`, `leg-check.js`, `patch-app.py`,
  `patch-history.py`; they `require('../geo.js')`) to `tools/`. The suites and `style.css` stay at the top level.
- **`docs/HANDOFF.md` task 1:** `dist/` deleted; it was byte-identical to the top-level
  `austerlitz-command-map.html`. Nothing else refers to it: the remaining mentions are earlier entries of this
  changelog, `docs/HANDOFF.md` itself, and `apply-stage0.py`'s generic list of folders to skip.
- The entry "Repository structure restored", dropped by the upload, is restored below.

No source, data, suite or tool content changed. **Verified:** `npm run check:baseline`: md5
`c09c4b23d9e245ff9d693960cf9496b9` (`build.py` prints "bytes: 1097392", which is its count of characters; the file
is 1,097,610 bytes). `npm run check:data`: all 112 DATA declarations byte-identical. `npm test`: build OK; seven
suites pass with the recorded results (CSS 0 errors, 9/9; test.js 0 errors, 41/41; geo-test 54/0; terrain all OK;
audit 0 and 0 violations; sim-test 25 events, 0 disagreements; redteam 37 claims, 0 found, 0 findings);
`runtime-test.js` reports the 2 known errors (`mesh.getMatrixAt is not a function`,
`_cR.setFromMatrixColumn is not a function`), as `docs/SUITE_RECOVERY.md` records. The runner exits 0 regardless
(`docs/HANDOFF.md`, task 3). Not re-run here: `npm run check:visual`. `austerlitz-command-map.html`: 1,097,610
bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`.

## 2026-09 · Source tree and regression suite recovered; source synchronised with Stage 0

**Status: done; both builds reproduced byte for byte.** The correction-pass source tree, its eight suites, the
runner and every tool were recovered from the account data export by replaying the first project chat's tool calls
(method and proof: `docs/SUITE_RECOVERY.md`). The recovered tree rebuilds the correction-pass file exactly (md5
`672aff9f...`), and the original suite reproduces every recorded result on it. With the 73 Stage 0 edits applied, the
original `build.py` rebuilds the Stage 0 file exactly: 1,097,610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`.

**Implementation source of truth: this recovered tree** (`style.css`, the scripts, the suites at the top level,
`tools/run-all.sh`), built by `build.py`. It supersedes the interim tree split from the HTML and its `dist/` folder.

**On Stage 0, seven suites pass unchanged** with the correction-pass results. `runtime-test.js` reports 2 errors:
its stand-in three.js lacks maths that Stage 0's seating and labels use; the application is unaffected (verified in a
real browser by the Stage 0 harness and self-test). Fix: `docs/HANDOFF.md`, task 2.

**Changed in recovered files:** `tools/run-all.sh` finds the repository root itself (was a sandbox path); `build.py`
writes LF on every platform (output unchanged); `runtime-test.js` gains the `location` and `renderer.info` stand-ins
Stage 0 needs. `assets.js` was taken from the verified build, because its source photographs were downloaded in that
chat; the byte-identical rebuild proves it exact.

## 2026-09 · Suite recovery, round 1 (no change to the build)

Recovered from the first project chat and validated: `tools/mk-helpers.js` (verbatim) and
`tools/mk-world-mod.js` (creation plus its one recorded edit). Both run cleanly on the correction-pass
and Stage 0 builds; the world module reproduces the verified elevations. Generated test modules are
ignored by git. The eight suites are still to be recovered (`docs/SUITE_RECOVERY.md`). The build is
unchanged (md5 `c09c4b23…`).

## 2026-09 · Repository structure restored (no change to the build)

*(Restored: this entry was dropped when the recovered tree was uploaded. The layout it describes held until the recovered tree replaced `dist/`; see the entry above.)*

The first upload through the GitHub web interface flattened the tree: every file landed at the
repository root, `.gitignore` and `.gitattributes` arrived as `download` and `download (3)`, and the two
sub-READMEs as `README (1).md` and `README (2).md`. `check:data` and `check:visual` could not run
(`Cannot find module tools/visual/data-invariance.js`). The layout is restored with 23 pure renames
(`git mv`, every one 100% similar, 0 lines changed), each placed by its own header and by the paths
that `package.json`, `CLAUDE.md`, `README.md` and the documents already cite:
- `tools/visual/`: `data-invariance.js`, `harness.js`, `measure.js`, `thresholds.js`, `cases.js`,
  `check-report.js`, `compare-gallery.js`, `darkness-study.js`, and `README.md` (was `README (1).md`,
  "Visual regression harness (Stage 0)").
- `tools/stage0/`: `apply-stage0.py`, `extract-edits.py`, `stage0-edits.json`, `stage0.patch`, and
  `README.md` (was `README (2).md`, "Stage 0 source patch", which names these four files).
- `tools/split-from-html.py` (its docstring gives that path).
- `archive/`: `stage0-c09c4b23.html` (md5 `c09c4b23…`), `correction-pass-672aff9f.html` (md5 `672aff9f…`).
- `docs/`: `VISUAL_AUDIT.md`, `STAGE0_VERIFICATION.md`, `SUITE_RECOVERY.md`.
- `dist/austerlitz-command-map.html` (was at the root; md5 `c09c4b23…`).
- `.gitignore` (was `download`: `node_modules/`, `tools/visual/out/`, `*.pre-stage0`, `__pycache__/`) and
  `.gitattributes` (was `download (3)`: `* text=auto eol=lf` and the binary types). Every tracked file
  was already LF, so `.gitattributes` renormalises nothing.

No source, data, HTML, test or script content changed. **Verified after the move:** `npm run
check:baseline`: 1,097,610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`, matches. `npm run check:data`:
all 112 DATA declarations byte-identical (and, as an extra check, also between
`archive/correction-pass-672aff9f.html` and `archive/stage0-c09c4b23.html`). `npm run check:visual`
(Playwright 1.56.0, its bundled Chromium 141): 11 cases and the self-test, "STAGE0: all checks passed";
the only overlap is the allowed hybrid-dimmed counter pair; two Canvas2D `willReadFrequently`
performance warnings in the console. **Not run:** the correction-pass suite (`tools/run-all.sh`), which
is not in the repository (`docs/SUITE_RECOVERY.md`). `dist/austerlitz-command-map.html` unchanged:
1,097,610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`.

## 2026-09 · Repository set-up (no change to the build)

The source tree went into the GitHub repository with `CLAUDE.md` (the project rules for Claude Code),
`package.json` (`npm run build`, `check:data`, `check:visual`, `check:baseline`), `docs/`
(`VISUAL_AUDIT.md`, the Stage 0 verification report, the suite-recovery plan) and `archive/` (the
correction-pass build, md5 `672aff9f…`, and the Stage 0 build, md5 `c09c4b23…`, kept as frozen
references). `dist/austerlitz-command-map.html` is unchanged: 1,097,610 bytes, md5
`c09c4b23d9e245ff9d693960cf9496b9`. The correction-pass regression suite is still to be recovered
(`docs/SUITE_RECOVERY.md`).

## 2026-09 · Source tree re-established from the Stage 0 build

**Status: done; the rebuild is byte-identical.** The editable source tree now exists outside any chat
sandbox: `shell.html`, `assets.js`, `geo.js`, `data.js`, `analysis.js`, `world.js`, `symbols.js`,
`app.js` and `build.py`. `python3 build.py` produces `dist/austerlitz-command-map.html`, 1,097,610 bytes,
md5 `c09c4b23d9e245ff9d693960cf9496b9`, byte-identical to the verified Stage 0 build (checked with `cmp`
and md5). **Implementation source of truth: this tree**, built by `build.py`; the HTML is its output.

**How it was made.** The correction pass's tree (`/home/claude/aus2`) existed only in the first project
chat's temporary sandbox. Only its built HTML and this changelog were ever downloaded, so no later chat
had it. The tree was re-created from the Stage 0 HTML by `tools/split-from-html.py`, which cuts the
bundle at each original file's header banner, in the load order recorded in the first chat's
`build.py` (assets, geo, data, analysis, world, symbols, app, placed in `shell.html`). No code was
rewritten: the files are slices of the verified build, each parses on its own, `geo.js` still loads under
Node, and the rebuild reproduces the build exactly. The new `build.py` reads and writes bytes and turns
CRLF back into LF, so a Windows checkout builds the same file.

**Not recovered.** The correction-pass regression suite (`css-test.js`, `test.js`, `geo-test.js`,
`terrain-test.js`, `audit.js`, `sim-test.js`, `redteam.js`, `runtime-test.js`, `tools/run-all.sh`), its
helper generators (`tools/mk-helpers.js`, `tools/mk-world-mod.js`) and the one-off migration tools
(`tools/warp.js`, `geo-migrate.js`, `geo-anchor.js`, `relief-fit.js`, `stale-compare.js`) were in the same
sandbox and are not in this tree. Their recorded results (the correction-pass entry below) stand for that
build, and the data they checked is byte-identical today (Stage 0's data-invariance proof), but they
cannot be re-run until recovered from the first chat's transcript or rebuilt. Stage 0's harness,
self-test and data-invariance check (`tools/visual/`) are in the tree. `tools/stage0/` is kept as a record;
its edits are already in these files.

## 2026-09 · Stage 0: visual and UX baseline, and trust

**Status: complete for Stage 0, verified in the delivering chat to the extent listed under Tests.
The correction-pass suite (`tools/run-all.sh`) has not been run on this build.** Published file:
`austerlitz-command-map.html` (1,097,610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`), produced from the
verified correction-pass build (md5 `672aff9f0d1b1673d079903185d39351`) by the 73 edits in
`tools/stage0/stage0-edits.json`. (Byte count corrected: this entry first gave 1,094,070, a figure measured on
an intermediate build before the last fixes; the file is authoritative.)

**Source (updated after Stage 0).** Stage 0 was made on the built HTML because the correction pass's
source tree no longer existed. The source tree has since been re-created from this build and rebuilds
it byte for byte; see "Source tree re-established from the Stage 0 build" above. `tools/stage0/` keeps the
record of the 73 edits, which are already in the tree.

Scope: rendering and interface only. No historical, geographic, chronological, order-of-battle or
model data changed (see Data).

### Rendering
- **Figures stand on the drawn ground.** Each man keeps the world x,z his place in the block gives him,
  is set on the terrain mesh's own triangles there (`groundY`), and is mapped back through the inverse of
  the block's world matrix: exact under any block scale (highlight dimming, hybrid mode), tilt or
  deployment. Before, the correction was written into the block's frame unscaled and untilted and only
  refreshed when the block moved 1.5 units or turned; on the Pratzeberg men stood up to 16 units off the
  ground (roughly 100 m on the 10.3x vertical scale). A first fixed-point version diverged where the
  exaggerated relief is steeper than 45 degrees; the delivered method needs no iteration.
- **Men and horses stand upright**; guns, limbers and tents keep the slope. Standards are seated and
  upright too. Skirmishers, gun crews, teams, guns, limbers and tents, which were never seated, now are.
- **Re-seating is driven by change**: position, tilt, yaw, block scale or deployment, and nothing else.
- **Camera floor.** The eye stays 1.8 units above the highest drawn ground within 1.6 units (1.2 more on
  the coarse apron). Orbit, zoom, glides, presets and the first view all pass through `clampCamera()`;
  a guard before each frame counts any path that does not.
- **Colour grade:** contrast is applied in perceptual space with a curve pinned at black and white (it
  was applied about 0.5 in linear light, which sent everything below 0.02-0.04 linear to pure black),
  plus a shadow toe. **Temporary presentation fix; see below.**
- **Landscape palette:** the baked north-west hillshade narrowed from 0.46-1.20 to 0.70-1.12.
  **Temporary; see below.** The paper map keeps its full cartographic hillshade, unchanged.
- **Smoke and dust** textures fade to zero at every edge (puffs inset, soft round window); before, puffs
  cut off by the canvas edge gave each sprite a straight translucent side (the "floating fog" cards).
  Sprites are lifted clear of the drawn ground across their width.
- **Mist sheets** carry a per-vertex fade to zero where the ground rises to meet them, eroded by one
  cell so no cell the ground passes through has any alpha; drift is bounded and time-based. The valley
  fog itself is Stage 4.
- **Render on demand.** A frame is drawn for a tween, playback, input, an unfinished easing or an explicit
  request; slow drift alone draws at an ambient rate (about 11 frames a second); nothing moving draws
  nothing. Easings are time-based, so they keep their wall-clock speed at any frame rate.

### Interface
- **First run:** the card stands alone near the foot of the map over the Overview view at 04:00, with
  three ways in: Guided tour, Watch the battle, Explore. Dispatch and legend are held back until one is
  chosen; any click or key outside the card counts as Explore without moving the camera.
- **One colour key** (`COLOUR_KEY`) writes both the legend swatches and the first-run sentence from the
  colours that draw the counters, figures and arrows. The contradiction "Amber is the Russian and Austrian
  army" is gone; the legend gains French and Allied movement rows. The wider encoding problems are Stage 1.
- **Selection chip:** whenever something is selected but the dossier is not on screen (Watch, the clean
  Map view) a small bar says what is selected and why the rest is dimmed, and offers the dossier or a way
  out. Before, a selection in Watch dimmed the field with no visible explanation.
- **Dossier heights in metres** through `GEOREF.elevM`; place dossiers also quote the surveyed height
  from `GEOREF.GT` / `ELEV_SRC` where the place is surveyed; terrain-study dossiers give a metre range.
  "units above the valley floor" (wrong in units and in datum) is gone.
- **Label placement (interim):** counters, event labels and the plateau reading are now placed, in
  priority order; a displaced counter keeps its stem on its true position; a counter may shrink to 80%
  then 64% before it stays where it is; a label wholly under an interface panel takes no space. The
  shrink fallback is kept as evidence for the Stage 2 counter layer, not as a design.
- **Development readout** (the `` ` `` key, or `?stats`): frames drawn and skipped, CPU time per stage,
  world-pass draw calls and triangles, post and label passes, seating, label placement, camera clearance,
  GPU memory objects.
- **Runtime checks:** `AUSTERLITZ_DEBUG.selfTest()` (13 checks, from the console or the harness); the
  render-time camera guard; with the readout on, a periodic seating check. `?harness=1` gives deterministic
  frames (no drift, fixed grain) for the harness.

### Temporary lighting correction (replace in the lighting pass, Stage 4)
- **Problem it solves.** With the contrast clip removed, slopes in cast shadow (the Pratzeberg's west face
  under the morning sun) were still close to black: the filmic tone curve's toe has a slope of about 0.2
  near zero, and those slopes carried very little light because the baked hillshade and the real-time sun
  darkened them from opposite sides. They read as black silhouettes with men apparently floating on them.
- **Why now.** That silhouette was the main trust-breaking fault in the audit and it cannot wait for the
  lighting pass; both changes are small, sit in the existing grade and palette, and leave mid-tones,
  highlights, pure black and the paper map as they were.
- **What replaces it.** A lighting balance in which shade receives sky light at a physical proportion of
  the sun (ambient roughly two to three stops below the sun, not five), a single light direction instead of
  a baked hillshade fighting a real-time sun, and a clock-driven sun from the 2 December ephemeris. When that
  exists, remove the shadow toe (`vec3 tt=...` in the composite) and restore or retire the baked term.

### Data: unchanged, and how that is known
`tools/visual/data-invariance.js` parses both builds (acorn) and compares every top-level declaration.
All 112 data declarations are byte-identical: historical datasets (18, 770,653 bytes), geography and relief
model (43), movement, strength and confidence model (34), derived readings, sight and knowledge (17).
31 rendering and interface functions changed, 44 declarations were added, none were removed; the original
CSS rules are kept verbatim with additions appended. At runtime the self-test re-derives 38,700 Allied on
the plateau at 04:00, both totals within 85,400 and 73,000 at 57 moments, and 0 movement-audit findings.

### Before and after (visual harness, the same 11 cases, software WebGL, 1600x900 unless stated)
| Case | Largest figure error (units) | Standards | Solid black 8x8 blocks | Near-black pixels | Overlapping labels/counters | Eye above ground | Selection shown |
|---|---|---|---|---|---|---|---|
| first-run | 5.0241 → 0.0002 | 9.49 → 0.00 | 0 → 0 | 0.48% → 0.00% | 0 → 0 | 136.39 → 275.20 | - |
| first-run-laptop | 5.0241 → 0.0002 | 9.49 → 0.00 | 0 → 0 | 0.52% → 0.00% | 0 → 0 | 136.39 → 275.20 | - |
| overview-field | 15.9459 → 0.0003 | 7.35 → 0.00 | 41 → 0 | 1.70% → 0.26% | 0 → 0 | 95.37 → 95.37 | - |
| overview-plan | 13.9212 → 0.0003 | 8.21 → 0.00 | 0 → 0 | 0.00% → 0.33% | 1 → 0 | 275.20 → 275.20 | - |
| close-sokolnitz | 3.7157 → 0.0002 | 5.75 → 0.00 | 958 → 0 | 12.82% → 0.04% | 1 → 0 | 23.48 → 23.48 | - |
| staff-paper | 0.0000 → 0.0000 | 0.00 → 0.00 | 0 → 0 | 0.00% → 0.00% | 13 → 0 | 275.20 → 275.20 | - |
| pratzen-low | 5.7624 → 0.0002 | 6.96 → 0.00 | 3141 → 1 | 24.07% → 2.50% | 0 → 0 | 21.79 → 21.79 | - |
| pratzen-orbit-min | 5.3318 → 0.0003 | 7.63 → 0.00 | 2807 → 0 | 19.44% → 0.01% | 1 → 0 | -12.28 → 1.81 | - |
| selected-formation | 15.7315 → 0.0002 | 7.77 → 0.00 | 3034 → 0 | 84.61% → 0.67% | 0 → 0 | 68.81 → 68.81 | dossier → dossier |
| watch-selected | 5.4960 → 0.0002 | 7.75 → 0.00 | 13465 → 1 | 83.92% → 2.56% | 0 → 0 | 65.84 → 65.84 | nowhere → chip |
| hybrid-dimmed | 6.4471 → 0.0001 | 4.61 → 0.00 | 9218 → 0 | 65.86% → 1.45% | 30 → 1 | 57.45 → 57.45 | nowhere → chip |

In every case: smoke and dust texture edge alpha 71/35 → 0/0 (of 255); mist alpha where the ground crosses a sheet 0.447 → at most 0.007.
Figures and standards: distance from the drawn ground, world units (about 6 m of vertical scale each). Near-black: pixels whose brightest channel is below 16/255, outside the interface panels; it includes legitimately black details, so the black-slope test is the solid-block column. Eye above ground: world units.

**Orbit into the hill (`pratzen-orbit-min`).** Centred on place pratzenv, zoomed fully in, dragged to the lowest pitch and turned toward the rising ground, the orbit asks for an eye 12.28 units below the drawn ground. The original build puts it there: 12.28 units below the ground, the black silhouette with men apparently floating above it. The Stage 0 floor holds it 1.81 units above.

### The low Pratzen view, step by step (`tools/visual/darkness-study.js`)
| Build | Near-black pixels | Solid black 8x8 blocks | Mean luminance |
|---|---|---|---|
| A original build | 13.63% | 1028 | 57.1 |
| B original grade+palette, Stage 0 seating | 21.96% | 2875 | 91.2 |
| C + contrast in perceptual space (clamped) | 7.02% | 579 | 101 |
| D + narrower landscape hillshade  (the 7.4% state) | 7.44% | 627 | 101 |
| E + pinned contrast and shadow toe  (final) | 2.50% | 1 | 103.1 |
| E final, no labels | 2.48% | 1 | 103.3 |
| E final, no formations | 1.86% | 0 | 100.8 |
| E final, no woods | 2.50% | 1 | 103.1 |
| E final, none of these | 1.79% | 0 | 100.8 |

**What the 7.4% was.** Row D, the intermediate build in which it was first measured, reproduces it (7.44%). It is the share of map pixels in this view whose brightest channel is below 16/255. It was a real defect: the Pratzeberg west face, in the hill's own shadow, sat on the filmic curve's toe at a few code values and read as black (627 solid black blocks in D). The pinned contrast and shadow toe (D to E) removed it.

**What remains in the final build (2.50%)**, found by hiding each family and re-rendering the same frame: formations 0.64 points (shakos, the dark pads under blocks; the one solid block is here), labels 0.02, woods 0.00, and 1.79 points of scattered dark ground texels and the vignetted lower edge, with no solid region. Expected detail, not a clipped slope, which is why the black-slope test counts solid 8x8 regions.

**Two findings recorded, not acted on.** (1) Narrowing the landscape hillshade (C to D) did not help this view (7.02% to 7.44%); the pinned contrast and shadow toe did the work. The palette change is kept as accepted, but its benefit is not demonstrated and it should be re-assessed in the lighting pass. (2) The original build's result depends on what came before: 13.63% on a fresh page (row A) but 24.07% after the preceding cases in one page (the before/after table). The Stage 0 build gives the same figure both ways (2.50% and 2.50%). The cause in the original build was not investigated further. Row B is darker than A because the Stage 0 mist fade no longer veils the slopes the original grade clips.

### Tests
Run in the delivering chat, on the delivered build:
- **In-app self-test** (`AUSTERLITZ_DEBUG.selfTest()`, via the harness): 13 of 13 pass.
  - pass: ground: groundY() returns the drawn terrain at its vertices
  - pass: camera: every fixed and computed view is above the ground
  - pass: camera: glides between tour stops, phases, chapters and vantages stay above the ground
  - pass: camera: orbiting at the lowest pitch and closest zoom never enters the ground
  - pass: camera: no path placed the eye below the floor before a frame
  - pass: figures: every visible man, horse and standard stands on the drawn ground
  - pass: first run: the colour key agrees with the legend, and the legend with what is drawn
  - pass: dossiers: elevations are metres through GEOREF, never model units
  - pass: watch mode: a selection is always shown, and clearing it clears the dimming
  - pass: sprites: smoke and dust fade to nothing at every edge
  - pass: mist: no sheet shows where the ground rises through it
  - pass: derived readings unchanged: the plateau at 04:00, both army totals, the movement audit
  - pass: render on demand: a view at rest draws nothing; slow drift alone draws at the ambient rate
- **Visual thresholds** (`tools/visual/check-report.js`) on the 11 cases of the delivered build: all pass, with the one named known residual below
- The same thresholds on the original build: 11 of 11 cases fail (the faults Stage 0 fixes).
- **Data invariance** (`tools/visual/data-invariance.js`): 112 of 112 data declarations byte-identical
- **Edit list** (`tools/stage0/apply-stage0.py --html`): the 73 edits applied to the original build reproduce the delivered build byte for byte (md5 match).
- **Tree port, simulated:** the applier placed all 73 edits in a simulated split tree and the reassembled result matched the delivered md5. Not run against the real tree.
- **Darkness study** (`tools/visual/darkness-study.js`): the table above.

Not run: `sh tools/run-all.sh` and its eight suites (`css-test.js`, `test.js`, `geo-test.js`,
`terrain-test.js`, `audit.js`, `sim-test.js`, `redteam.js`, `runtime-test.js`). The source tree and
tools were not available. The data declarations they exercise are byte-identical, so `geo-test`,
`terrain-test`, `audit`, `sim-test` and `redteam` are expected to pass unchanged; `runtime-test` and
`css-test` exercise the interface and may need updating for the first-run card (new button ids
`fr-watch`; `fr-close` now means Explore), the legend swatches filled by script, and the new elements
`#selchip` and `#devstats`.

### Known residuals
- **hybrid-dimmed:** Walther's and Nansouty's counters (Cavalry Reserve, both dimmed) overlap at the left
  screen edge. The Stage 0 fallback finds no free place; the app reports it (`unresolved` in the label
  statistics) and the harness records it as a named known residual, so any other overlap still fails.
  Evidence for the Stage 2 counter layer.
- **Near-black detail:** shakos, conifers, text halos and poles stay near-black by design; the
  black-slope test counts solid 8x8 regions, not these.
- **Harness speed:** about 45 s per page load and 25 s per case on one CPU with software rendering.

### Deferred (Stage 1 onward)
- Stage 1: the encoding spec (status and claim colours that reuse the side hues; dashed and dotted
  counter frames that mean something else in APP-6; the legend's "approximate position" dash, which only
  counters show).
- Stage 2: the DOM/SVG counter and label layer (replacing the interim placement and its shrink fallback);
  vertical exaggeration as a presentation parameter; land cover without triangle sawtooth; mere outlines
  from a sourced survey; ground-draped arrows derived from the tracks; a true north-up paper map.
- Stage 3: pan and map-style camera controls, one time spine and timeline, mode names, docked panels.
- Stage 4: lighting (replacing the temporary correction above), valley fog, soft-particle smoke, horizon.
- Stage 6: uniforms, headgear and flags, research first. Observations from the audit, not acted on and
  still to be verified: French colours drawn as vertical tricolours (the 1804 pattern is the usual
  reconstruction for 1805); every figure in a shako (French line infantry of 1805 are usually shown in the
  bicorne); the Austrian flag design matches no pattern identified.


## 2026-09 · Correction pass: geographic ground truth, data-model integrity, verified history

**Status: complete and verified.** Published file: `austerlitz-command-map.html`
(1,047,490 bytes, md5 `672aff9f0d1b1673d079903185d39351`), built from this tree by `build.py`.
Every item below is present in the current implementation and covered by the regression
(`sh tools/run-all.sh`). Nothing in this entry is aspirational.

### Final verification

| Suite | Result |
|---|---|
| `css-test.js` | 0 CSS errors, 9/9 behaviour checks |
| `test.js` | 0 errors, 0 warnings, order of battle 41/41 |
| `geo-test.js` (new) | 54 passed, 0 failed |
| `terrain-test.js` | all 13 elevation anchors, ordering, downstream fall, pond edges, land-cover guard, tour stop 5 |
| `audit.js` | 0 march-rate violations, 0 terrain violations |
| `sim-test.js` | 0 errors, 0 warnings; 25 events, 0 disagreements at 1.0 km true; tour stop 4 agrees |
| `redteam.js` | 0 findings, 0 warnings; 37 retired claims, none present |
| `runtime-test.js` | 36 checks OK, 0 errors, 0 warnings; parent/child rendering assertion passes |

Stale-coordinate comparison against the pre-correction tree (`tools/stale-compare.js`):
699 coordinates before, 705 after. 598 moved exactly as the migration warp prescribes, and
92 were re-anchored under 19 documented rules. None is stale and none is unexplained.
9 were removed and 15 added; all are intentional.

### Geography and scale

- **`geo.js` (`GEOREF`): the single geographic reference.** Everything that needs a distance, bearing or height reads from it.
  - **Ground truth:** village centres from the Czech municipality register; summits from PeakVisor DEM data, with official heights where they differ.
  - **Transform:** the legacy map frame is kept as a fitted similarity transform — 31.647 map units per km (0.03160 km per unit), rotated 17.42° from true north. It reproduces the audited positions to within 17 m and inverts exactly.
  - **Old constants retired:** `KM_PER_MAP` 0.01916, `UNITS_PER_KM` 26.1, `0.019`, `0.0191`.
  - **Everything derived from it:**
    - the scale bar, march rates, event tolerances and the location descriptor (true bearings, not map axes);
    - the contour label and the exaggeration statement in the sources (derived: 10.3×, not "roughly fivefold").
- **Migration.** Every coordinate in the data was moved through one rubber-sheet warp, exact at the 19 surveyed places (`tools/warp.js`, `tools/geo-migrate.js`).
  - Where the legacy map was topologically wrong, features were re-anchored by stated rules (`tools/geo-anchor.js`).
  - Pratzen village had been drawn east of the line joining the two summits.
  - The Olmütz highway had run due east through Holubitz.
- **Places.** Every surveyed village now lies within 20 m of ground truth. Hostieradek was added. The Pratzeberg now lies 1.47 km south of Pratzen village.
  - **Off-map places:** Raigern, Rausnitz and Kowalowitz lie beyond the frame; they are no longer drawn inside it, and are shown as edge markers.
  - **Chapel of St Anthony:** added at the northern edge of Augezd (position derived, about 0.6 km north of the village).
  - **Posoritz post house:** added on the highway north of Holubitz (position approximate, about ±1 km).
- **Roads.**
  - **Olmütz highway:** passes the Santon's southern foot (276 m from the summit) and runs through the post house, leaving the frame north-east toward Rausnitz. Holubitz now lies 1.7 km south of it.
  - **Vienna road:** runs west of the frame and is no longer drawn inside it.
  - **Raigern–Telnitz:** a local road via Otmarov.
  - **Pratzen–Austerlitz and Krzenowitz roads:** re-anchored on their end villages.
- **Water.**
  - **Litava:** rerouted from ground truth: the southern edge of Slavkov, past Hostěrádky, through Újezd and Žatčany.
  - **Rakovec:** added through Křenovice. Křenovice lies on the Rakovec, not the Litava.
  - **Goldbach:** now meets the Litava.
- **Compass.** The rose shows true north for the current camera view. It had been fixed at "up".

### Terrain

- **Relief fitted to sourced elevations** (`tools/relief-fit.js`):

  | Place | Model | Sourced |
  |---|---|---|
  | Pratzeberg | 324 m | 324 m |
  | Staré Vinohrady | 294 m | 294 m |
  | Santon | 296 m | 296 m |
  | Žuráň | 290 m | 286–293 m |
  | Tvarožná | 258 m | 257 m |
  | Kobelnitz | 210 m | 211 m |
  | Sokolnitz | 207 m | 207 m |
  | Telnitz | 196 m | 195 m |
  | Pratzen village | 245 m | 245 m |
  | col south of Staré Vinohrady | 272 m | ≈273 m (DEM) |
  | Augezd | 190 m | 195 m |
  | Křenovice | 216 m | 203–216 m |
  | Austerlitz | 227 m | 200–237 m (range only) |

- **Plateau shape.** The legacy plateau put Pratzen village above Staré Vinohrady. The plateau is now a crest arc (Staré Vinohrady → col → Pratzeberg) with the village in its hollow.
- **Goldbach.** Now falls downstream, 210 → 207 → 196 m.
- **Height model.** Height is local relief plus a regional fall. The regional fall is the northward rise and the middle-Litava lowland along the Litava and the Rakovec.
- **Threshold consumers.** The floor, the land-cover thresholds and the reeds still read local relief, as calibrated. The ground tint is expressed in metres.
- **Land-cover classifier.** Now a single shared function (`coverClass`), used by the terrain build and by the tests.
- **Ponds.**
  - Each shoreline is held level.
  - Each water level is derived from the pond's own edge, so no edge of the water can hang above the ground.
- **Contours.** They cover the terrain's real range on the legacy lattice.
- **Eye heights.** Line of sight and the viewshed use real eye heights (3 m observer, 2.5 m formed troops). The old world-unit values amounted to 10–13 m.

### Data model and simulation integrity

- **The leaf rule (`ownStrengthAt`).** A formation's own troops exclude subordinates already on the field, and command-only formations carry none. Every battlefield total uses it.
  - Allied men on the field never exceed 83,120 of 85,400; French never exceed 69,900 of 73,000. The naive sum had been 127,370.
- **Parent formations.**
  - Buxhöwden's Left Wing is a command post, no longer a 40,000-man block.
  - Langeron's block drops Kamensky's battalions once Kamensky detaches.
  - The runtime harness asserts both across 57 moments of the battle.
- **Plateau statistic.** A polygon traced over the real plateau replaces the old ellipse, which took in Blasowitz and Krzenowitz. The statistic reads 38,700 at 04:00; it had read 107,820, more than the entire Allied army.
- **Confidence.** An interpolated position is graded no better than its weaker anchor and labelled "interpolated".
- **Event agreement.** Tested in true distance: 1.0 km by default, as closest approach across each event's window.
  - Three events carry written, capped exceptions: Pratzen village 1.14 km, Blasowitz 1.16 km, the ice 1.33 km.
  - "Organised resistance ends" names no plotted formation.
- **Movement.** The audit is clean.
  - Kollowrat's 5.01 km/h leg was not justified by the evidence. Its 11:15 anchor contradicted its own text; the worst leg is now 2.4 km/h.
  - Four Allied anchors that the warp had pulled into French-held Pratzen village were re-placed by their own texts: the Allied HQ at 09:30, Kamensky at 11:15, and Kollowrat in phases 4 and 5.
  - Inferred routes and timings are marked in the data:
    - Legrand along the west-bank road through Sokolnitz;
    - Przybyszewski holding at Sokolnitz until surrounded;
    - Kamensky retiring east, graded C.
  - Bourcier's route follows his own stated action.

### Order of battle (Duffy 1977 and Smith 1998, unless a range names others)

- **Army totals:** the 139 guns are now the army total (`gqg.army`), not the HQ's. The Allied army total is recorded as about 85,400 men and 278 guns.
- **4th Column:** 13,900, within a sourced range of 12,000–23,900. Miloradovich 4,800–7,000, where he had been an unsourced 10,000.
- **Kollowrat:** FZM, per the Deutsche Biographie (Feldzeugmeister from October 1800).
- **Russian Guard cavalry:** Lt.-Gen. Kologrivov (single source).
- **The Santon:** Claparède, with the 17e Légère and 18 guns, drawn as infantry with an attached battery.
- **Telnitz:** held by Schobert's 3e de Ligne with the Tirailleurs du Pô. Legrand's brigades are Merle, Féry and Levasseur.
- **5th Column:** mixed and mostly Russian, drawn with about 20% Austrian riders.
- **Kamensky:** 4,000–4,500.
- **Cavalry Reserve:** 36 guns, with Nansouty at about 1,600. The grenadier division's unsourced 10 guns are removed.

### Chronology and historical prose

- **Davout and Friant:** at Raigern overnight on 1 December; Friant's leading brigade reaches the Goldbach about 08:00. The march is about 113 km in 40–46 hours (sources vary).
- **Allied HQ:** at Krzenowitz at 04:00. The Tsar reaches the 4th Column about 08:45 (Russian Biographical Dictionary, 1903).
- **Napoleon's command posts:** Žuráň, then Staré Vinohrady (no chapel there), then the chapel of St Anthony above Augezd.
- **Intervals, graded B:** the Russian Guard attack from after 11:00, and the wheel at 13:00–14:00. Blasowitz and Soult's "twenty minutes" are graded B.
- **The eagle:** taken by the Russian Guard cavalry (traditionally the Life Guard Horse Regiment).
- **Kursk:** the "1,600 of 2,000" figure is removed; the event is graded C.
- **Removed or corrected:**
  - "already cut in two" and "within the hour";
  - "perhaps five thousand" at the ponds;
  - Przybyszewski "reduced to the ranks";
  - the "fourth assumption" miscount;
  - "the amber army".
- **Attributions:**
  - Buxhöwden's drunkenness is attributed to Langeron.
  - The Kutuzov dispute is attributed.
  - The 4th Column's delay is given both causes.
- **Naming:** "Francis II (Francis I of Austria)" is used consistently.
- **Visibility claims.** Every "can see" claim is either rewritten or labelled as a model reading; fog is kept as the documented cause of concealment.
- **Tour stops 4 and 5.** Both now quote labelled, derived figures, bound by tests to the live computation.
- **Sources panel.** Now names the order-of-battle sources and derives the exaggeration. It lists the open questions below.

### Testing

- **New suite and scripts:** `geo-test.js`; `tools/run-all.sh` (full regression); `tools/stale-compare.js`.
- **Helpers regenerated from live code.** The test helpers are now regenerated from `app.js` on every run (`tools/mk-helpers.js`), and the world module from `world.js` (`tools/mk-world-mod.js`). The old hand-copied helpers had drifted, so `test.js` had been exercising a stale `posOf`.
- **Test fixes.** `test.js` no longer counts a parent formation with its own children, and it now pins the corrected order of battle.
- **New guards:**
  - retired claims can't return;
  - totals never exceed the armies;
  - no hard-coded legacy scale constant;
  - pond edges;
  - land cover;
  - the downstream fall;
  - the tour figures.
- **Defects found and fixed during the pass:**
  - a name collision (`GEO`) that would have broken the app on load;
  - a planar tilt that made the Litava run uphill;
  - land-cover thresholds reading regional rather than local relief, which put "meadow" at 41% of the field;
  - pond water floating up to 20 m above the ground;
  - a pond hold that dragged Telnitz down;
  - two tint inputs lost in the classifier refactor.

### Open questions (documented in the Sources panel; deliberately not resolved)

1. The pattern of Russian infantry flags.
2. Whether Grenz infantry wore brown in 1805.
3. Whether vines stood at Telnitz and at Staré Vinohrady in 1805; the Telnitz "vineyard bank" text is kept.
4. The upper bound of the Russian Guard's attack.
5. Bagration's exact line at dawn; he is re-plotted on the corrected road, graded B.
6. The exact position of the Posoritz post house (±1 km).
7. The true position of Turas; it keeps its warped legacy place.
8. Kologrivov's command, which rests on one source.
9. The stream beds are not downhill at every point (reverse gradients of up to about 10 m within a reach).
10. **Chapel sightline.** From the chapel of St Anthony the model shows little of the Satschan pond: 0% of the pond bed, and 7% of the ice surface at the model's water level. A source records Napoleon watching the end from there. This is left as a documented model/source mismatch: the chapel's position is approximate and the relief stylised, and the battlefield was not reshaped to fit.

### Deliberately not changed in this pass

Uniform, headgear and flag rendering; the Kobelnitz pond, whose outline is unverified; and any
visual redesign. Those belong to the next phase.
