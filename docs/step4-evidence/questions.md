# Roadmap step 4: the owner questions (176-195)

Choices that decisions 1-175 do not settle, put to the owner as the task asked, each with its options, a recommendation and the
conservative default built meanwhile. No default breaks a test, moves a harness limit (`DROP_LIMIT`, `UNOBSTRUCTED`, `PAPER_MIN_PXKM`; the
opening cases never, decision 121) or loosens an assertion. Where a default keeps this map's timing or figure against a reading, the words
that carry the gap are named, and the claim says so. Most questions come from the synthesizer's plan (step 4's research workflow); the lead's
changes to it are said.

**Status.** Each question's *Status* line says whether its default is in the repository (with the commit) or pending, by the plan's label
(K4 the three disputed hours, K5 the other hours, K6 Friant, K7 I Corps and the Guard, K8 the two grades, K9 the Zuran, the chapel and the
ice, K10 the strengths, K11 Blasowitz, K12 the app's sentences). This file is updated as each lands; `CHANGELOG.md`'s list of commits gives
each label's hash.

**Settled under decision 125 (b), not a question (implemented, K4).** The I Column's departure (dok@1): the disposition orders every column to
march at seven (Materialien 1806, pp. 101-106), and Buxhowden's and Kutuzov's reports have the I Column leave its camp at seven (Kutuzov,
documents, 1951, pp. 241-242, 255-258). The task asked for the disputed hours to be settled from the published accounts; this one is, so
K4 makes dok@1 depart at 07:00 (`tm.dep` 420, grade A, basis "source"), its arrival derived, and takes it out of the named conflicts. The
engine then moves the column differently only between 04:00 and 08:00, where no harness case stands (dok@2's arrival is 08:00 before and
after, computed by `tools/stage2/chronology.js`).

**176. The II and III Columns' 04:00 against the disposition's seven (lang@1, prz@1; sim-test's mechanism assertion; tour stop 4).**
- *Options.* (a) Keep this map's 04:00 for the two columns. No reading supports it, so `check:chronology` must name the two moves as
  disagreements kept against the sources (its `CONFLICTS` list, which decision 42 began for the map's own internal disagreements), with the
  sources' side cited and the map's side allowed by name; the texts say the disposition ordered seven. (b) Retime both to the sources (from
  07:00, B), rewrite tour stop 4's two figures to the new derived values, and replace sim-test's assertion that the Allied centre visibly
  empties before Soult attacks (the plateau's minimum over 04:00-08:45 under 55% of dawn; it would be about 70%) with an equally strict one
  the readings support (for instance the plateau at 08:45 holding the 4th Column and Kamensky's brigade, Thiebault p. 504): an assertion
  changed only on your word.
- *Recommendation.* (b): the readings agree on seven (or half past six for the left wing, Schönhals) and none on four.
- *Default.* (a). *Status.* Implemented (K4).

**177. Friant at the Goldbach and Telnitz retaken, from Davout's report (about nine; Telnitz at half past nine, then lost again).**
- *Options.* (a) Keep friant@1's departure from 04:00, friant@2 at 08:30 and the events' clocks, the texts naming Davout's hours and the
  two moves named in `CONFLICTS` as in 176 (a). (b) Retime to the sources (the departure from Raigern at five or half past five; the retaking
  anchor at half past nine, A; `EVENTS[#davout]` [525, 555], `#telnitz-retaken` 570; the phase lines moved to phase 3).
- *Recommendation.* (b) if `opening-2` and the cases at 500-570 measure within their limits; else (a) unless decision 121 is amended for
  that case. *Default.* (a). *Status.* Implemented (K6).

**178. Kamensky's turn: the point at 09:45 or an interval.** Decision 142 keeps t 585; this asks only whether the readings reopen it.
- *Options.* (a) Decision 142 stands: t 585, the dispute naming the sources' sequence and the versions of who turned the brigade. (b) An
  interval [525, 615].
- *Recommendation.* (a): no source read gives a clock hour. *Default.* (a). *Status.* Implemented (K4).

**179. The Russian Guard's attack and Rapp's charge: the windows and the engine's 11:15.**
- *Options.* (a) Keep guard-attack [660, 780], guard-broken [675, 795] and guard_cav@6 at 11:15; guard-broken "disputed" (question 161) with
  both sides and the map's early placing in its dispute. (b) Extend the windows. (c) Move the charge toward one o'clock (Rapp, Ségur).
- *Recommendation.* (a). *Default.* (a). *Status.* Implemented (K4).

**180. Bagration's withdrawal (bag@6, bag@8's 16:30, bag@9) and the end of the day (`EVENTS[#end]` 16:30).**
- *Options.* (a) Keep bag@6's 11:15 and bag@8's 16:30 as the map's, the readings in their notes and acts (bag@6 named in `CONFLICTS`
  against Schönhals's "toward noon"); the end "disputed". (b) Drop bag@8's departure (no source dates a movement then). (c) Redraw bag@9
  toward Austerlitz over Alt-Rausnitz.
- *Recommendation.* (b) if `opening-4` measures unchanged, else (a); (c) not now. *Default.* (a). *Status.* bag@8 and the end implemented (K5); bag@6's conflict pending (K11).

**181. The forced dated legs: c_gren@7/@8 and kollo@4/@5.**
- *Options.* c_gren: (a) keep `{dep 780, at 840}`, the readings in the note; (b) `{dep 780}` without `at`, c_gren@8 leaving `FORCED_DATED`.
  kollo: (a) keep `at 615`; (b) drop it.
- *Recommendation.* c_gren (b), kollo (a). *Default.* (a) for both. *Status.* Implemented (K5).

**182. I Corps as the centre, and the French plan's "In hand" column.**
- *Options.* (a) One column, its `ord` rewritten to the orders read. (b) Split into the centre (Bernadotte) and the reserve (the Guard and
  the grenadiers). (c) One column renamed the reserve, without Drouet.
- *Recommendation.* (b) if `plans-overview` stays within its drop limit, else (c). *Default.* (a). *Status.* Pending (K7).

**183. drouet@6's grade.**
- *Options.* (a) A kept, the act disputed. (b) B, the place disputed (near Blasowitz in Stutterheim and Schönhals, on the Emperor's left in
  Ségur, behind Vandamme in Savary).
- *Recommendation.* (b), as K8 proposes for gqg@0 under decision 160. *Default.* (b) only if the phase-8 cases at 14:40 (`ph8-overview-study`,
  `-watch`, where drouet@7 inherits the grade) and `opening-4` measure within their limits; else (a). *Status.* Pending (K8, measured).

**184. The strengths: the working figures.**
- *Options per formation.* kienmayer 6,800 or 6,340 (Schönhals); lich 5,400 or 5,600 (Schönhals; moves `PLATEAU_04_RECORDED`); the IV Corps
  divisions kept or Sokolov's 22 November figures; legrand's staff as pinned or the readings' brigadiers.
- *Recommendation.* kienmayer 6,340; lich kept; the IV Corps divisions kept until a 2 December return is read; legrand's staff the readings'.
- *Default.* Every working figure and pin kept; every note rewritten to the readings. *Status.* Pending (K10).

**185. The losses lede and tour stop 9.** *Options.* (a) Attributed figures where they are read; (b) a short lede, the figures in the
sources sheet. *Recommendation and default.* (a). *Status.* Pending (K10).

**186. The drained count.** *Options.* (a) Both kept, attributed (Suchet's as Sokolov quotes it; the usual figures, their source not
traced); (b) Suchet's only; (c) the usual figures dropped. *Recommendation and default.* (a). *Status.* Pending (K9).

**187. The claims on screen.**
- *Options.* (i) One vocabulary (`CLAIM_WORDS`, `CLAIM`, `SRC_LABEL`, `CONF_TEXT.A`). (ii) Visibility: an index in the sources sheet, then a
  button at the end of the drawer dossiers. (iii) The framing statements "interpretation" by class, or unchecked. (iv) The formation dossier's
  section tags follow their statements.
- *Recommendation.* (i) yes; (ii) the index first, each measured; (iii) "interpretation" by class; (iv) yes, with (ii).
- *Default.* Nothing new shown; claims are data and the inventory. *Status.* The default is the repository's state.

**188. The interpolated pill's rule and words.** *Options.* The minimal rule or every interpolated position; "Position: interpolated" or
"Position: between documented positions". *Recommendation and default.* The minimal rule, "Position: interpolated". *Status.* Implemented
(K2, `b2fc7b5`, with its review fixes in `3db2cab`).

**189. Decision 136's human second reading.**
- *Options.* (a) The owner or a tester reads the 15 A-graded quotes among the 131 on their page images (decision 136 as decided), starting
  from the machine second reading's record (`docs/stage6-evidence/second-reading.md`) and first from question 195's Szekler page. (b) Accept
  the machine second reading in its place (amending 136). (c) Defer to step 5 (amending 136's timing).
- *Recommendation.* (a). *Default.* The machine second reading done and recorded as one; decision 136 open, to be carried in
  `docs/ROADMAP.md` at the step's end. *Status.* The machine reading is in `3dafee8`; the human reading is not done.

**190. The opening's words, its bar, and the events it shows.**
- *Options.* (a) Minimal rewordings, no longer than the text they replace, where the readings contradict it (`TOUR[5].x`, `TOUR[7].x`), each
  applied only where the opening cases measure unchanged. (b) Leave them, labelled elsewhere. (c) The bar's marking of the ceiling-derived
  climbs: none, or `LABELS.event.derived`. (d) The events live at an opening case keep claims that add no label note.
- *Recommendation.* (a); (c) none; (d) keep. *Default.* The same. *Status.* `TOUR[7].x` reworded, shorter (`be730cf`); `TOUR[5].x` pending (K11).

**191. Places and the Guard cavalry: Turas, Krug, Bellowitz, the Posoritz post house, Kologrivov and rg_cav.**
- *Options.* Turas moved to the register's point (2.85 km WNW) or kept; the others kept or moved to weaker identifications.
- *Recommendation.* Turas moved, measured; the others kept; rg_cav a note. *Default.* Nothing moves. *Status.* The default is the
  repository's state.

**192. Track additions the readings suggest but do not place.**
- *Options.* (a) None in step 4. (b) A Russian Guard detachment drawn in Blasowitz (the village's defenders in every account that names
  them; rg_inf is plotted 1.8 km away at 11:15). (c) kamensky@7 over Augezd (Schönhals) or at the foot of the heights until half past three
  (Kutuzov's report). (d) bag@9 toward Austerlitz (with 180).
- *Recommendation and default.* (a): each needs a position no reading gives. *Status.* The default is the repository's state.

**193. The Timing A of the events not examined in step 4.** *Options.* (a) Keep A until examined; (b) grade each against the registers.
*Recommendation.* (b). *Default.* (a), except those the readings contradict (B). *Status.* soult, pratzen-village, ice and end implemented (K5); telnitz-retaken (K6).

**194. The blue the Russian records print as "синій".**
- *Context.* Viskovatov's scale runs голубой (light blue), синій, темносиній (dark blue); the step-4 adjudicator reads "синій" as "blue",
  while the 6B register's glossary translated it "dark blue" (`docs/stage6-evidence/readings-ru-colours.md`), which is the class drawn. The
  table's `KIT` cloth "blue" is already the Szekler hussars' cornflower (`app.js`), a lighter shade.
- *Options.* (a) Keep the drawn class "dark blue" for the Russian uhlans' coat and legwear and the Guard hussars' dolman, each record's note
  naming it the class for the printed "синій" (the uhlans' cap and the Guard horse's shabraques carry the gloss only: headgear is drawn by
  shape, and furniture is not drawn). (b) A new mid-blue class between the Szekler cornflower and the
  French "dark blue", drawn for these records (a `KIT` cloth and `css-test.js`'s table follow).
- *Recommendation.* (a) until a period colour sample or plate in colour is read: the printed word fixes a name, not a shade. *Default.* (a).
  *Status.* Implemented (`3dafee8`; the shabraques' gloss in the review's fixes).

**195. The Szekler hussars' cornflower blue (the appearance table's A-graded record, `schem1805` p. 297).**
- *Context.* The 1805 Schematismus could not be reached again in step 4 (Hungaricana 403; no other scan). In the 1813 edition, read on its
  images, the record's words "kornblumenblaue Pelze, Dollmans und Hosen" stand in Palatinal Nr. 12's box and the Szekler Nr. 11's reads
  "dunkelblaue". If the 1805 page has the same layout, the record took the neighbouring regiment's colour.
- *Options.* (a) Keep the record (A, drawn cornflower), its note naming the doubt, until the 1805 page is read with its neighbours (the first
  item of question 189's human reading). (b) Lower it to B now and draw the Szekler hussars "dark blue" after the 1813 box, labelled an
  inference from a later edition. (c) Draw them generic until the 1805 page is read.
- *Recommendation.* (a), with the 1805 page read first. *Default.* (a). *Status.* The note added in the review's fixes of `3dafee8`.
