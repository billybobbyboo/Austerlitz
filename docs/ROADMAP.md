# Roadmap (after the final audit)

The living plan. `docs/VISUAL_AUDIT.md`'s staged plan (Stages 0-7) is done; the final audit (`docs/FINAL_AUDIT.md`, merged #48) measured what
remains, and the owner accepted every recommendation (decisions 125-141, `docs/FINAL_AUDIT.md` §6.0). This file carries that plan forward, the
owner's notes for later (7 October 2026), and a note on other battles. Each step still begins as the earlier stages did: the current state read
from the code, the approach proposed, the work done conservatively, checked, recorded in `CHANGELOG.md`.

## Planned (decided)

| step | what | findings (`docs/FINAL_AUDIT.md`) | decisions | status |
|---|---|---|---|---|
| 1 | **Suite hardening**: the fonts embedded first (so `check:visual` measures the same everywhere), then the checks that cannot fail or read less than they claim, and CI | T-0, T-1, T-2, D-1, D-2, H-8, T-3, T-4, T-5, T-6 | 131, 132, 141 | merged (#49; `CHANGELOG.md`) |
| 2 | **Integrity on screen**: one data task and a presentation part, decided together: the disputed hours marked, the plateau label tagged, the first claim labelled, the claim pill reworded, the contradictions fixed, the vines labelled | H-1 to H-5, H-7, H-9 to H-16, D-3 to D-6 | 125-129, 135; 142-161 | in review (#50; `CHANGELOG.md`) |
| 3 | **Accessibility and robustness**: the shortcuts switch, hidden panels inert, the sources sheet a proper dialog, focus returned, reduced motion live and in CSS, the timeline's targets, focused map items drawn; the start-up message and the CDN integrity; "Whose eyes?" over corps counters, the dwell toggle, the eye level and a phase, the narrow layout, the effects leak; then a screen-reader session | A-1 to A-3, SW-1 to SW-12, S-1 to S-3, S-6 | 133, 134 | after step 2 |
| 4 | **The sourcing stage**: Part A, an inventory of every narrative statement and a register of readings (as Stage 6 did for dress); per-statement claims; the chronology's evidence from the sources; the second reading of the appearance quotes; the 6B data questions; the disputed hours settled | H-6, H-17; 125 (b), 128 (b) | 125, 128, 130, 136 | after step 3 |
| 5 | **Records and polish** (any time; a records-only commit can take R-1, R-2 and R-7 at once) | R-1 to R-7, SW-13, the VISUAL_AUDIT leftovers (event glyphs, native tooltips, the scale bar's note) | | open |
| 6 | **Later, each its own decision**: a phone layout; a measured pass on real hardware; figure level of detail | A-4, P-1 | 137, 138, 139 | open |

### What step 1 handed on (fact, from its commits; `CHANGELOG.md`)

- **To step 2 (the data task and its presentation part):** each fix removes its own allow-list entry in the same commit, or the stricter
  checks fail on the stale entry: `redteam.js` `LANG_ALLOW` (9 entries; 8 are removed by step 2: the c_iv, c_gd and c_cav roles, the
  Satschan story's "certainly", `SOURCE_NOTE`'s "always marked derived", the first-run key, the Pratzen vantage's title, the card's static
  copy; the ninth, "decisive" in the Allied plan's stated assumptions, is attributed and stays), and
  `tools/stage2/chronology.js` `ALLOW_TIMED` (12 entries, among them H-12's) and `REVIEW_CITES` follow any retimed or reworded sentence; a
  changed march rate re-acknowledges `redteam.js`'s one `KNOWN_WARN` entry; the self-test asserts the plateau's 38,700 at 04:00
  (`PLATEAU_04_RECORDED`). Two items step 1 found that the audit did not name: c_cav's role, "decides the cavalry battle in the north"
  (`data.js:311`), is a verdict of H-4's class; H-14's superlatives ("the single most consequential mistake", "The most famous thing") match
  no pattern (a `SUPERLATIVE` pattern can come with their fix).
- **To step 3:** leaving the eye level puts the eye under the camera floor for one frame, and the app warns (allowed by name in
  `CONSOLE_ALLOW` as `eye-leave-floor` until the fix; it sits with S-3); the hover fix of step 1 runs `pickFormation` on every pointer move
  (its frame cost not measured; a click selects what that hover shows); the S-1 check (no enemy corps counter drawn when all its formations are unknown) is to be added to the
  self-test with S-1's fix (it fails today).
- **To step 5:** T-9's (b) `audit.js` continuity and coverage only print, (d) re-implementations of model code (`terrain-test.js`'s crops,
  `redteam.js`'s `wet()`), (e) map constants typed by hand (680 x 500, `*2+340`); `css-test.js`'s duplicate-rule checks read only the base
  rules before the first `@media` (four selectors are declared twice: `#firstrun`, `#firstrun h2`, `#firstrun p`, `.legend .ar`); the
  GLSL colour literals outside the palette rule; `KIT.weave` lays 12% black over every cloth (a black cloth falls under decision 84's floor
  between its threads); `tools/audit/size.js` does not count `fonts.css` (its parts fall 96,642 bytes short of the build: the 96,643-byte file less the 9-byte
  `/*FONTS*/` marker it counts in `shell.html`); `tools/lang-scan.js` and `css-test.js`'s glyph
  walker duplicate one another; the chronology ledger matches a statement by its reference and time, so a reword that keeps both passes.
- **The type:** Safari is believed to ignore the faces' metric overrides (an inference; the harness is Chromium only); no italic face is
  embedded, so every italic is synthesized (the dossier's Dress labels and the INFERRED source tags, `.src.inf`).

### Step 2: the owner decisions 142-161 (the answers)

Questions 142-159 were put to the owner with the implementation plan's recommendations, and 160 and 161 with its completeness critic's
items 8 and 10; each default was implemented meanwhile in a commit that could be reverted on its own. On 8 October 2026 the owner wrote:
"Lets go with your recommendations for all." Each question below is therefore decided as recommended (`CHANGELOG.md`, roadmap step 2).

| # | question | decision | where |
|---|---|---|---|
| 142 | Kamensky's event: keep `t:585` with both hours in `dispute`, or the interval 08:45-09:45 that H-1's fix sentence names? | keep 585 with both hours in its `dispute` (decision 42's timing kept); the departure from H-1's fix sentence recorded | step 2 (C3) |
| 143 | lower the two disputed events' timing grade from A to B? | B: Timing A means "dated in a cited source", which neither hour is | step 2 (C5) |
| 144 | mark the formations' own records of the three hours (dok@1, kamensky@3, guard_cav@6 acts); should the phase-4 lede and tour stop 4 follow? | the three acts marked; the lede and tour stop 4 unchanged (tour stop 4 dates the arrival in the villages and takes neither side) | step 2 (C6) |
| 145 | if a longer map text drops one more item in a held case, may that case alone be re-measured? | the shorter form first ("PRATZEN · derived", "(disputed)"); a held case that still fails is re-measured alone under its deciding decision, recorded with was, is and why; the opening cases (decision 121) only by the owner's word. Applied to the 07:00 "Augezd" drop: the arrows' mark is "(disputed)"; no case needed a re-measure | step 2 (C14a) |
| 146 | narrow-390: decision 127 (b)'s words make the first-run card one line taller at 390 px | (a): narrow-390 re-measured once under decision 127 (b) with the decided words; `UNOBSTRUCTED["narrow-390"]` [0.46, 0.507] -> [0.438, 0.507], its drop limit 7 kept (4 measured) | step 2 (C27) |
| 147 | H-4's roles (c_iv, c_gd, c_cav): only what the record says, or the verdicts labelled as this map's reading? | record-only; the map's reading is stated once, labelled, in the first-run key | step 2 (C15) |
| 148 | a third Command-tab tag, ANECDOTE, for the rows that tell the memoir anecdote? | yes | step 2 (C8) |
| 149 | H-9: attribute the "sun of Austerlitz" flash or drop it? | attribute it ("as memoirs call it") | step 2 (C22) |
| 150 | H-13: keep the other side on screen (Marbot's and Thiébault's thousands drowned)? | keep it | step 2 (C11) |
| 151 | H-14: remove "roughly 60,000" and "about 50,000 by the Allied estimate", which no record gives? | remove both; the second restored in step 4 if a source gives the Allied staff's estimate | step 2 (C12) |
| 152 | H-14: allow the SUPERLATIVE pattern's seven other hits by name until step 4, and SOURCE_NOTE's "the hardest figures of all" permanently, as "a statement of method"? | yes | step 2 (C12) |
| 153 | H-11: settle Kamensky's musketeer regiment as Ryazhsk, keeping Ryazan as the Materialien's and Duffy's reading? | yes, after a second reading of the Mikhailovsky-Danilevsky 1844 page images (register §6.8); `mikhailovsky1844` was already in `APPEARANCE_SOURCES` (since 6B) and is now cited by `COMPOSITION.kamensky` | step 2 (C14a) |
| 154 | heightguns@8: grade B or C? | B kept; decided in step 4 from the Újezd local history | step 4 |
| 155 | mark Suchet's and Caffarelli's division numbers and c_gren's artillery from the October returns? | yes, as Rivaud's and Drouet's are, with the returns named and no date claimed for 2 December | step 2 (C14a) |
| 156 | take H-19's six Dress-note rewordings and the note assertion in step 2? | yes | step 2 (C16) |
| 157 | I Corps: general reserve (the app) or the centre (the 30th Bulletin, Stutterheim, Mikhailovsky-Danilevsky)? | both readings marked in c_i's dossier now; the plan column and the role settled in step 4 | step 2 (C14a), then step 4 |
| 158 | Blasowitz: the defenders the Russian Guard's, the attackers and Liechtenstein's part disputed | the "Contested by" fact marked with the disagreement; the event's forms left to step 4 | step 2 (C14a), then step 4 |
| 159 | the Watch caption's derived reading cut off by the ellipsis | in step 3: clipping measured against `#tb-cap`'s box, and the derived reading put before the event names in Watch | step 3 |
| 160 | gqg@0 graded A on the Zuran from 04:00 against "the hour he took post is not established" (the critic's item 8) | the phase line reworded now ("the map places him there from 04:00; the hour he took post is not established"); gqg@0's grade reconsidered in step 4 | step 2 (C10), then step 4 |
| 161 | guard-broken's dossier does not name the phase line's c. 11:45 (the critic's item 10) | step 4, recorded | step 4 |

### What step 2 handed on (fact, from its commits and their reviews; `CHANGELOG.md`)

- **To step 3 (accessibility and robustness):** the Watch caption's derived reading cut by the ellipsis, held only by `capDerived`
  (question 159: measure clipping against `#tb-cap`'s box, and put the derived reading before the event names in Watch); a screen reader on
  the plateau label's `role="img"` name and on the arrows' marks, which have no accessible names of their own; the narrow layout's event
  tag; an event's drawn map label keeps its words without its note (the note is in its accessible name only; a layout risk under question
  145); the ceiling-derived climbs' marking in the opening's bar (step 3 or 4, with their dating).
- **To step 4 (the sourcing stage):**
  - The three disputed hours settled (125 (b)). Leads, all inference until read in full: Mikhailovsky-Danilevsky 1846 p. 238 (the first
    three columns leave at eight), p. 242 (Dokhturov at Telnitz at half past eight), pp. 251-252 (Kamensky turns on seeing the French climb);
    1844 p. 179 (Langeron at the Goldbach at half past eight); Stutterheim p. 49 (the army moves at 7); Thiebault p. 469; Duffy 1977 not
    read. guard-broken's dossier does not name the phase line's c. 11:45, and its caption tag is "interval" beside "The hour is disputed"
    (question 161).
  - Other hours: Thiebault pp. 456-457 puts the twenty minutes "au jour naissant" against the map's c. 08:30; p. 460 has Friant reinforce
    "vers neuf heures" against the davout event's "About 08:00"; the Blasowitz hour (the event, the phase line and the theme say 11:15
    without a note; `FEATURES` says "About 11:00-11:15; the hour is not established").
  - Drouet and I Corps: the hour of the crossing (Duffy; Mikhailovsky-Danilevsky's night crossing, 1846 p. 229); drouet@0's dawn position;
    whether Drouet's division fought (Thiebault pp. 466, 504 against the Bulletin p. 451, drouet@6 graded A and the phase-6 lede); I Corps
    reserve or centre (question 157: both readings now in c_i's dossier; the role and the plan column here); four texts in tension with
    drouet@3's 08:45 departure: `COMMAND.fr[4]` "Bernadotte forward onto the plateau in support" (09:30), the French plan's "Remain behind
    the Zuran as the general reserve", `COMMAND.fr[3]`'s "no reserve committed" with tour stop 6 and the opening's step 2, c_i's role.
  - The Guard: guard_inf@6's "Committed onto the plateau" and c_gd's role against Thiébault pp. 464 and 466 ("qui n'eurent pas un coup de
    fusil à tirer"; "qui ne prirent aucune part à la lutte"; register §4.7, §4.8, §13 F14), with "whether Drouet's division fought" (the
    same pages); "moved onto the plateau" may be weighed for both.
  - The Zuran and the plan: the hour Napoleon took post; gqg@0's grade A (question 160; measure the headquarters' confidence patch at
    opening-1 and opening-end first); `PLANS.fr.author`'s "before dawn" against the dispositions dated 1 December, 8.30 p.m.;
    Mikhailovsky-Danilevsky p. 238's height near Schlapanitz; the Zuran story's "watched the Allied columns march off the Pratzen from here".
  - Strengths: Kienmayer's 6,800 against 6,880; what makes up IV Corps' 23,600 against its divisions' 20,300 (Varé's brigade may be
    counted twice); lich's "up to 7,000" beside Schönhals's 5,600; the Guard's guns (the Bulletin p. 450: forty pieces).
  - The chapel battery: the Újezd local history (count, composition); heightguns@8's grade (question 154), and heightguns@8-9 reading
    "Position: reconstructed" beside "Position B".
  - The ice: the source of the drained count; Ségur's 1812 history for the "sun of Austerlitz" invocation.
  - The seven superlatives allowed by name until step 4 (`LANG_ALLOW`); Legrand's "roughly six times its number" (Thiebault p. 460: "40
    ou 50,000 Russes"); the pattern's blind spot for "the only / the one / the first to" (not a pattern: "the only eagle Napoleon lost" is
    a record).
  - H-11 and the 6B data questions: Gladkov (Duffy, Smith); Suchet's division number on 2 December ("3e or 2e": the returns of 26 and 28
    October give the 3rd, and the 2nd on 26 October is Gazan's, p. 755; "or 2e" is the map's former reading, kept without a source);
    Caffarelli's and the grenadier division's artillery on 2 December; `COLOURS_CARRIED.at_inf.model` labelled "fact" for "(the 1769
    pattern, used to 1806)", whose 1805 use the 6B reading calls an inference (the 1804-pattern lead, `docs/stage6-evidence/leads-at.md`);
    the Empress's cuirassiers; "45 standards"; Kamensky: "on his own judgement" in `COMMAND.al[4]` (DOCUMENTED) unattributed, and the Kursk
    regiment and its 1,600 lost (register F5) for the hedge in lang's role, lang@4 and the kursk event; a second reading of every quote in
    `docs/step2-evidence/readings.md` (H-17's practice), the Mikhailovsky-Danilevsky 1844 and Alombert page images first.
  - Claims per statement (128 (b), H-6): an interpolated position between two A anchors reads "Position: documented" (H-5 counts 31.7% of
    formation-samples; the critic's item 12); the dossier's "The hour is not fixed in the sources" on the other interval events, and on
    columns-move dropped although its dispute covers only I Column; `SOURCE_NOTE` body[0]'s "the hours given are well documented"; tour
    stop 7's "With the plateau gone" against the label's 17,050 at 11:00 (H-3); whether vines stood at Telnitz and Stare Vinohrady.
  - Blasowitz (question 158): the event's forms (sim-test binds them), with Marbot pp. 259-260 (register §8.4: Lannes drives the enemy
    back "jusqu'à Blasiowitz"); H-1's tour stop 4 sentence (its reason for standing recorded in `tools/stage2/chronology.js`: it dates the
    arrival in the villages, not the start of the disputed descent).
  - Found by the completeness critic (item 4), outside decisions 125-135: the true position of Turas (the village and the plan order,
    `analysis.js`); the Posoritz map name; Kologrivov's command on the counter and in the header; the ceiling-derived climbs sthilaire@3 and
    vandamme@3 and bag@8, and the forced dated legs c_gren@8 and kollo@5, to step 4's dating (125 (b), `docs/STAGE2_SPEC.md` §M.13).
- **To step 5 (records and polish):** H-19's spelling ("Thiebault"/"Thiébault", "Legere", "Bessieres", "St-Hilaire"; accents change
  chronology statement keys, so regenerate them together); H-18 (the Santon's chapel tradition, the armistice); the arrow labels' and the
  plateau label's cost to `pickFormation` on every move; `buildOOB`'s third-level rows print no commander (Claparède under Suchet's
  Division since D-3); `tools/stage2/chronology.js`'s `REVIEW` file:line locators written before C3 may point one or more lines off
  (records; four corrected in step 2; no check reads them).

## Later: the owner's notes of 7 October 2026 (not yet scheduled; to be decided when taken up)

The owner asked for these to be noted for later. They are about appearance and motion (UI/UX), and together they would make a **Stage 8,
appearance and motion**, after steps 1-3, beginning as every stage did with a Part A (the current state measured, options prototyped, owner
questions). What each touches is stated here so that the decision, when it comes, is taken knowingly; nothing below is decided.

**L1. "The coloured glow underneath troops and divisions (blue for the French, orange for the Russians and Austrians): remove it; it looks
clunky."**
- *What it is (fact):* the position-confidence marks (Stage 5B; `CONF`, `confPlace` in `app.js`): every formation's position grade drawn on the
  ground in its side's colour (`TOKENS.sym.side`: French blue `#4C86D8`, Allied amber `#D4703A`): A a crisp footprint, B a soft frontage, C a diffuse
  zone. With "Position confidence" off in the Layers panel, decision 107's plain footprint in the side's colour stays under every formation drawn
  as figures.
- *What it would overturn:* decision 85 (the marks on by default), 87 (every formation on the field has a ground mark) and 107 (a side cue always),
  and it weakens decision 97: since 6C the figures' coats follow the sources (French dragoons in green, the Chevalier Guard in white), so the ground
  mark is what tells the sides apart among the figures; with it gone, only the names and counters do. It also takes the grade out of the default
  view (the original audit's problem 9 and opportunity 1).
- *Options to put to the owner:* (a) remove both, as asked: the grade only in the names' badges and the dossier, the side only in names and
  counters; (b) restyle rather than remove: no glow, a thin crisp outline at the footprint's edge in the side's colour, the grade by line weight
  (no dashes: decision 85 keeps them out); (c) the marks off by default with the toggle kept, and decision 107's side cue reduced to a small
  marker at the formation's head. Tests touched: the self-test's confidence and side-cue checks, `check:visual`'s `CONF_SHARE`, `css-test.js`
  (on by default), `runtime-test.js`.

**L2. "On the paper map, or 'Landscape with counters', the division counters dart all over the place along with the labels when the screen moves,
so that it is difficult to focus on anything else."**
- *What it is (fact):* the map layer (Stage 2D; `mlLayout` in `app.js`) solves every counter's and label's place again in every drawn frame:
  priority placement with collision tests, leader lines and drops. While the camera moves, items swap sides, jump to another candidate place,
  drop and reappear.
- *Options:* move the laid-out items with the map during a drag, zoom or glide and solve again only when the view rests; hysteresis (an item
  keeps its place unless it is blocked for several frames); fade instead of popping; fewer candidate places. Measure first: a probe that pans and
  zooms in steps and counts the items that change place per frame. Tests touched: the drop limits, the map layer's pass time, map text at AA as
  rendered, keyboard reach (and the audit's A-2, focused items not drawn).

**L3. "Greater depth and detail in cavalry, infantry and especially artillery; greater detail in troops overall; and movement that does not look
like soldiers and equipment moving statically, as if they were floating."**
- *What it is (fact):* each battalion, squadron or battery is a block of merged figure geometries by class (Stage 6C, `KIT`), posed per block and
  slid along its track without a gait; figures are drawn about 45-70 times life size (the stated convention); they are already about 91% of a
  landscape view's triangles (2.29 of 2.52 million in the low Pratzen view, `docs/FINAL_AUDIT.md` §2.8).
- *Constraints:* what is drawn must stay what `appearance.js` settles (claims graded A or B; else generic, decisions 97-104); artillery detail
  (guns, limbers, teams, caissons, crews) needs the same sourcing per system (the French Gribeauval pieces, the Russian 1805 system, the Austrian
  system: research, not invention); the scale convention (decisions 6 and 14); "do not animate losses" (`docs/VISUAL_AUDIT.md` opportunity 4);
  the figure-seating checks; reduced motion; performance: question 139's measurement on real hardware first, and level of detail (question 138)
  becomes necessary rather than optional.
- *Options:* a walk and a gait in the vertex shader (cheap: a bob and a leg swing per figure, horses' four-beat walk and trot); instanced figures
  to afford more detail near the eye; artillery limbering and unlimbering as already modelled in the statuses, drawn with teams.

**L4. "Greater detail with ponds and water, slightly animated, unless that attacks historical integrity: the water may have been frozen."**
- *What the record says (fact):* the Satschan mere was "frozen on 2 December" (`data.js:711`); the phase-8 texts and events have the French guns
  firing "on the ice" and formations crossing "the frozen meres" (`data.js:118-121`, `:462`, `:474-476`). Stage 4E draws both meres as ice with
  shore ice, "no cracks, holes, snow or figures in the water" (decision 79). **Moving water on the meres would contradict the record: they stay
  still ice.** The ice can carry more detail within the record (the computed sun's sheen already moves with the clock).
- *The streams:* the Goldbach and the Litava's state on the day is not recorded in the data (the terrain study calls the Goldbach "marshy in
  December", `world.js:132`). A gentle flow on the streams would be a design choice with that uncertainty stated, or they stay still; a source on
  the streams' state (frozen at the edges? open?) would settle it.

**L5. "Greater detail in buildings and structures overall."**
- *What it is (fact):* villages are flat footprints with instanced houses, roofs, chimneys and spires (`world.js`; houses drawn about 10-15 times
  life size); churches from a list (`CHURCHES`).
- *Constraints:* the villages' extents are data-task questions (2E); the forms of Moravian village buildings around 1805 (roof forms and
  materials, farmsteads, walls) should come from sources (the Second Military Survey of 1836-1840 for plans; period views), as the uniforms did;
  the named landmarks the narrative uses (the chapel of St Anthony, Sokolnitz castle and its pheasantry, Telnitz church, the Posoritz post house)
  first, where sourced; level of detail with L3.

## Other battles (Waterloo, Borodino): feasibility

**Yes, a second battle would be far quicker than starting from scratch, but not yet "plug in new data".** What transfers almost whole is the
software of Stages 1-5 and 7: the clock and the movement model, the map layer and the paper map, the camera and the timeline, the evidence layer
(confidence, skeleton, interval bars, day-tracks), the knowledge model's machinery, the opening, the tokens and symbology, and the test and
measurement harness. About 3% of `app.js`'s lines name Austerlitz things, but the battle is woven into a few places that would have to be
separated first: the ground itself (`world.js`'s relief, water, roads, villages and woods are fitted to this field, and `geo.js` is this field's
georeference), the derived readings (the plateau's holding and the centre separation answer Austerlitz's own questions), the sun's date and place,
the knowledge model's rules (the fog's top), and every harness view and threshold. A refactor that splits an engine from a battle package would come
first. After that, a new battle is mostly what took the most care here: the history (order of battle, tracks, chronology, sources), the terrain, the
battle's own readings, and its appearance table. Borodino (1812) would reuse part of the French and Russian appearance work, though the dress of
1812 differs and needs its own reading; Waterloo would need the British, King's German Legion, Dutch-Belgian, Brunswick, Nassau and Prussian armies
read from scratch. Rough order (inference): the engine split is a stage of its own; each new battle is then perhaps a third to a half of the
effort Austerlitz took, most of it research rather than code.
