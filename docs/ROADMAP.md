# Roadmap (after the final audit)

The living plan. `docs/VISUAL_AUDIT.md`'s staged plan (Stages 0-7) is done; the final audit (`docs/FINAL_AUDIT.md`, merged #48) measured what
remains, and the owner accepted every recommendation (decisions 125-141, `docs/FINAL_AUDIT.md` §6.0). This file carries that plan forward, the
owner's notes for later (7 October 2026), and a note on other battles. Each step still begins as the earlier stages did: the current state read
from the code, the approach proposed, the work done conservatively, checked, recorded in `CHANGELOG.md`.

## Planned (decided)

| step | what | findings (`docs/FINAL_AUDIT.md`) | decisions | status |
|---|---|---|---|---|
| 1 | **Suite hardening**: the fonts embedded first (so `check:visual` measures the same everywhere), then the checks that cannot fail or read less than they claim, and CI | T-0, T-1, T-2, D-1, D-2, H-8, T-3, T-4, T-5, T-6 | 131, 132, 141 | begun |
| 2 | **Integrity on screen**: one data task and a presentation part, decided together: the disputed hours marked, the plateau label tagged, the first claim labelled, the claim pill reworded, the contradictions fixed, the vines labelled | H-1 to H-5, H-7, H-9 to H-16, D-3 to D-6 | 125-129, 135 | after step 1 |
| 3 | **Accessibility and robustness**: the shortcuts switch, hidden panels inert, the sources sheet a proper dialog, focus returned, reduced motion live and in CSS, the timeline's targets, focused map items drawn; the start-up message and the CDN integrity; "Whose eyes?" over corps counters, the dwell toggle, the eye level and a phase, the narrow layout, the effects leak; then a screen-reader session | A-1 to A-3, SW-1 to SW-12, S-1 to S-3, S-6 | 133, 134 | after step 2 |
| 4 | **The sourcing stage**: Part A, an inventory of every narrative statement and a register of readings (as Stage 6 did for dress); per-statement claims; the chronology's evidence from the sources; the second reading of the appearance quotes; the 6B data questions; the disputed hours settled | H-6, H-17; 125 (b), 128 (b) | 125, 128, 130, 136 | after step 3 |
| 5 | **Records and polish** (any time; a records-only commit can take R-1, R-2 and R-7 at once) | R-1 to R-7, SW-13, the VISUAL_AUDIT leftovers (event glyphs, native tooltips, the scale bar's note) | | open |
| 6 | **Later, each its own decision**: a phone layout; a measured pass on real hardware; figure level of detail | A-4, P-1 | 137, 138, 139 | open |

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
