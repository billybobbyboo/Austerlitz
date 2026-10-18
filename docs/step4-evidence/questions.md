# Roadmap step 4: the owner questions (176-197)

Choices that decisions 1-175 do not settle, put to the owner as the task asked, each with its options, a recommendation and the
conservative default built meanwhile. No default breaks a test, moves a harness limit (`DROP_LIMIT`, `UNOBSTRUCTED`, `PAPER_MIN_PXKM`; the
opening cases never, decision 121) or loosens an assertion. Where a default keeps this map's timing or figure against a reading, the words
that carry the gap are named, and the claim says so. Most questions come from the synthesizer's plan (step 4's research workflow); the lead's
changes to it are said.

**Decided, 15 October 2026.** The owner wrote: "Let's go with your recommendations for all questions", and then: "Only record the
decisions/your recommendations. We will implement later." Each question 176-197 is decided as its *Recommendation* reads, conditions
included (a recommendation that depends on a measurement is to be applied only where the measurement allows it, else its stated fallback).
None was implemented then: the build carried each question's *Default* until a later task applied the decision; each *Status* line says
what the build carries now.
Roadmap step 4b part A took up 176, 177, 180, 181, 182, 184, 190, 191, 193, 195 and 197 (`CHANGELOG.md`): each *Status* line says what
it applied, or the fallback a measurement required; it met questions 198-202, at the end of this file. Roadmap step 4b part B applied 187,
196 and 202, recorded 189 complete on the owner's word, and met question 203.
Question 189's recommendation is a reading by the owner or a tester. 178, 179, 183, 185, 186, 188, 192 and 194 recommended what the build
already carries.

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
- *Default.* (a). *Status.* The default (a) implemented (K4); the decision, (b), applied in roadmap step 4b (`714226f`): lang@1 and prz@1
  from 07:00, grade B; sim-test's assertion still holds and is kept, the check the question proposed added beside it (`CHANGELOG.md`).

**177. Friant at the Goldbach and Telnitz retaken, from Davout's report (about nine; Telnitz at half past nine, then lost again).**
- *Options.* (a) Keep friant@1's departure from 04:00, friant@2 at 08:30 and the events' clocks, the texts naming Davout's hours and the
  two moves named in `CONFLICTS` as in 176 (a). (b) Retime to the sources (the departure from Raigern at five or half past five; the retaking
  anchor at half past nine, A; `EVENTS[#davout]` [525, 555], `#telnitz-retaken` 570; the phase lines moved to phase 3).
- *Recommendation.* (b) if `opening-2` and the cases at 500-570 measure within their limits; else (a) unless decision 121 is amended for
  that case. *Default.* (a). *Status.* The default (a) implemented (K6). In roadmap step 4b (b) was built and measured: `opening-2` unchanged, but
  `narrow-1024` 6 drops -> 7, past its limit 6, so (a) stood (`6a49f76`); on decision 199 (17 October 2026) the limit is 7 and (b) is applied.

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
- *Recommendation.* (b) if `opening-4` measures unchanged, else (a); (c) not now. *Default.* (a). *Status.* bag@8 and the end implemented (K5); bag@6's conflict implemented (K11). In roadmap step 4b `opening-4`
  measured unchanged, so (b) is applied: bag@8's dated departure dropped (`117d53f`); (c) not now.

**181. The forced dated legs: c_gren@7/@8 and kollo@4/@5.**
- *Options.* c_gren: (a) keep `{dep 780, at 840}`, the readings in the note; (b) `{dep 780}` without `at`, c_gren@8 leaving `FORCED_DATED`.
  kollo: (a) keep `at 615`; (b) drop it.
- *Recommendation.* c_gren (b), kollo (a). *Default.* (a) for both. *Status.* The default implemented (K5); the decision applied in
  roadmap step 4b (`117d53f`): c_gren@7 without its `at`, c_gren@8 out of `FORCED_DATED`; kollo kept.

**182. I Corps as the centre, and the French plan's "In hand" column.**
- *Options.* (a) One column, its `ord` rewritten to the orders read. (b) Split into the centre (Bernadotte) and the reserve (the Guard and
  the grenadiers). (c) One column renamed the reserve, without Drouet.
- *Recommendation.* (b) if `plans-overview` stays within its drop limit, else (c). *Default.* (a). *Status.* The default (a) implemented (K7). In roadmap step 4b (b), built with both columns on the one route drawn, measured
  past `plans-overview`'s drop limit (12 -> 13), so (c) is applied (`5eaa92f`): one column renamed the reserve, without Drouet; the
  dispositions' sentence on I Corps moved into `PLANS.fr.intent` (an addition beyond (c), for the owner to confirm).

**183. drouet@6's grade.**
- *Options.* (a) A kept, the act disputed. (b) B, the place disputed (near Blasowitz in Stutterheim and Schönhals, on the Emperor's left in
  Ségur, behind Vandamme in Savary).
- *Recommendation.* (b), as K8 proposes for gqg@0 under decision 160. *Default.* (b) only if the phase-8 cases at 14:40 (`ph8-overview-study`,
  `-watch`, where drouet@7 inherits the grade) and `opening-4` measure within their limits; else (a). *Status.* Implemented (K8): (b), measured with gqg@0 on the full check:visual (below in `CHANGELOG.md`). Grade C (the division
  placed about 1.9 km from Blasowitz, where Stutterheim and Schönhals have the fight, or idle in Thiebault) was not weighed: a further option.

**184. The strengths: the working figures.**
- *Options per formation.* kienmayer 6,800 or 6,340 (Schönhals); lich 5,400 or 5,600 (Schönhals; moves `PLATEAU_04_RECORDED`); the IV Corps
  divisions kept or Sokolov's 22 November figures; legrand's staff as pinned or the readings' brigadiers.
- *Recommendation.* kienmayer 6,340; lich kept; the IV Corps divisions kept until a 2 December return is read; legrand's staff the readings'.
- *Default.* Every working figure and pin kept; every note rewritten to the readings. *Status.* The default implemented (K10); the
  decision applied in roadmap step 4b (`da16e48`): Kienmayer 6,340, Legrand's brigadiers Sokolov's, the two pins replaced by equally strict ones.

**185. The losses lede and tour stop 9.** *Options.* (a) Attributed figures where they are read; (b) a short lede, the figures in the
sources sheet. *Recommendation and default.* (a). *Status.* Implemented (K10).

**186. The drained count.** *Options.* (a) Both kept, attributed (Suchet's as Sokolov quotes it; the usual figures, their source not
traced); (b) Suchet's only; (c) the usual figures dropped. *Recommendation and default.* (a). *Status.* Implemented (K9).

**187. The claims on screen.**
- *Options.* (i) One vocabulary (`CLAIM_WORDS`, `CLAIM`, `SRC_LABEL`, `CONF_TEXT.A`). (ii) Visibility: an index in the sources sheet, then a
  button at the end of the drawer dossiers. (iii) The framing statements "interpretation" by class, or unchecked. (iv) The formation dossier's
  section tags follow their statements.
- *Recommendation.* (i) yes; (ii) the index first, each measured; (iii) "interpretation" by class; (iv) yes, with (ii).
- *Default.* Nothing new shown; claims are data and the inventory. *Status.* Applied in roadmap step 4b part B as the owner chose on being
  asked ("Index + tags", 17 October 2026): (i), (ii)'s index in the sources sheet, (iii) for phase titles, track objectives and act lines
  (event names not classed: their claim is the event's own), (iv); the drawer button is question 203 (`CHANGELOG.md`). Before it: the default. The eye-level
  caption's source attributions (`app.js` `eyeCaption`: Schönhals, the French officer's note of 1806, Lejeune) are presentation sentences outside
  check:data's guard and the claims; whether they should be read from the data belongs here (the review of `c3e6299`).

**188. The interpolated pill's rule and words.** *Options.* The minimal rule or every interpolated position; "Position: interpolated" or
"Position: between documented positions". *Recommendation and default.* The minimal rule, "Position: interpolated". *Status.* Implemented
(K2, `b2fc7b5`, with its review fixes in `3db2cab`).

**189. Decision 136's human second reading.**
- *Options.* (a) The owner or a tester reads the 15 A-graded quotes among the 131 on their page images (decision 136 as decided), starting
  from the machine second reading's record (`docs/stage6-evidence/second-reading.md`) and first from question 195's Szekler page. (b) Accept
  the machine second reading in its place (amending 136). (c) Defer to step 5 (amending 136's timing).
- *Recommendation.* (a). *Default.* The machine second reading done and recorded as one; decision 136 open, to be carried in
  `docs/ROADMAP.md` at the step's end. *Status.* The machine reading is in `3dafee8`. Recorded complete on the owner's word in roadmap step
  4b part B (17 October 2026: "mark Decision 189 as complete"), as decision 175 recorded the screen-reader session: no item results were
  given, so none is recorded, and no quote's grade or record changes for it; the Szekler page (195) stands as the machine reading read it.

**190. The opening's words, its bar, and the events it shows.**
- *Options.* (a) Minimal rewordings, no longer than the text they replace, where the readings contradict it (`TOUR[5].x`, `TOUR[7].x`), each
  applied only where the opening cases measure unchanged. (b) Leave them, labelled elsewhere. (c) The bar's marking of the ceiling-derived
  climbs: none, or `LABELS.event.derived`. (d) The events live at an opening case keep claims that add no label note.
- *Recommendation.* (a); (c) none; (d) keep. *Default.* The same. *Status.* `TOUR[7].x` reworded, shorter (`be730cf`); `TOUR[5].x`'s first sentence reworded (K11); in roadmap step 4b its
  "Two divisions, no reserve committed" became "Two divisions, the Guard held back", one character shorter, `opening-2` measured
  unchanged (`ed61b2d`); (c) and (d) the build's state.

**191. Places and the Guard cavalry: Turas, Krug, Bellowitz, the Posoritz post house, Kologrivov and rg_cav.**
- *Options.* Turas moved to the register's point (2.85 km north-north-west; the C6 proposal's "WNW" was wrong, the review of `e7f0df1`) or kept; the others kept or moved to weaker identifications.
- *Recommendation.* Turas moved, measured; the others kept; rg_cav a note. *Default.* Nothing moves. *Status.* The default implemented (K11): nothing moved, the notes narrowed. In roadmap step 4b Turas is moved to the address
  register's point for Tuřany (`4981b27`), through `GEOREF.GT`; the others kept; rg_cav's note in the build since K11.

**192. Track additions the readings suggest but do not place.**
- *Options.* (a) None in step 4. (b) A Russian Guard detachment drawn in Blasowitz (the village's defenders in every account that names
  them; rg_inf is plotted 1.8 km away at 11:15). (c) kamensky@7 over Augezd (Schönhals) or at the foot of the heights until half past three
  (Kutuzov's report). (d) bag@9 toward Austerlitz (with 180).
- *Recommendation and default.* (a): each needs a position no reading gives. *Status.* The default is the repository's state.

**193. The Timing A of the events not examined in step 4.** *Options.* (a) Keep A until examined; (b) grade each against the registers.
*Recommendation.* (b). *Default.* (a), except those the readings contradict (B). *Status.* soult, pratzen-village, ice and end implemented (K5); telnitz-retaken (K6). In roadmap step 4b the eight
  events left at A were graded against the registers (`cfcf1b2` and its review's fixes): counter-march, telnitz, sokolnitz, pratzeberg,
  davout-resumes, sokolnitz-falls and augezd B, face-about C; none was A then. Since decisions 199 and 177 (b) telnitz-retaken is A, at
  Davout's 09:30 (the one event graded A). Question 201 follows from it.

**194. The blue the Russian records print as "синій".**
- *Context.* Viskovatov's scale runs голубой (light blue), синій, темносиній (dark blue); the step-4 adjudicator reads "синій" as "blue",
  while the 6B register's glossary translated it "dark blue" (`docs/stage6-evidence/readings-ru-colours.md`), which is the class drawn. The
  table's `KIT` cloth "blue" is already the Szekler hussars' cornflower (`app.js`), a lighter shade.
- *Options.* (a) Keep the drawn class "dark blue" for the Russian uhlans' coat and legwear and the Guard hussars' dolman, each record's note
  naming it the class for the printed "синій" (the uhlans' cap and the Guard horse's shabraques carry the gloss only: headgear is drawn by
  shape, and furniture is not drawn). (b) A new mid-blue class between the Szekler cornflower and the
  French "dark blue", drawn for these records (a `KIT` cloth and `css-test.js`'s table follow).
- *Recommendation.* (a) until a period colour sample or plate in colour is read: the printed word fixes a name, not a shade. *Default.* (a).
  *Status.* Implemented (`3dafee8`; the shabraques' gloss in the review's fixes). Since roadmap step 4b (question 195) the Szekler hussars are drawn "dark blue" too, and the
  `KIT` cloth "blue" is drawn by no class.

**195. The Szekler hussars' cornflower blue (the appearance table's A-graded record, `schem1805` p. 297).**
- *Context.* The 1805 Schematismus could not be reached again in step 4 (Hungaricana 403; no other scan). In the 1813 edition, read on its
  images, the record's words "kornblumenblaue Pelze, Dollmans und Hosen" stand in Palatinal Nr. 12's box and the Szekler Nr. 11's reads
  "dunkelblaue". If the 1805 page has the same layout, the record took the neighbouring regiment's colour.
- *Options.* (a) Keep the record (A, drawn cornflower), its note naming the doubt, until the 1805 page is read with its neighbours (the first
  item of question 189's human reading). (b) Lower it to B now and draw the Szekler hussars "dark blue" after the 1813 box, labelled an
  inference from a later edition. (c) Draw them generic until the 1805 page is read.
- *Recommendation.* (a), with the 1805 page read first. *Default.* (a). *Status.* The note added in the review's fixes of `3dafee8`.
  In roadmap step 4b the 1805 page was read on its images (Hungaricana, by a machine reader): the Szekler Nr. 11's box closes on p. 296
  with "dunkelblaue Pelze, Dollmanns und Hosen", and "kornblumenblaue" closes Palatinal Nr. 12's on p. 297; the record is corrected to
  dark blue, A (`docs/stage6-evidence/second-reading.md`). Decision 189's human reading of it remains.

**196. A formation waiting at its anchor is graded by the next phase's grade (`confAt`).** Since K8 gqg@0 is B, but from 11:15 (phase 6)
to 12:00, while the headquarters waits at the Zuran point before gqg@6's departure, `confAt` takes phase 6's grade, A, and draws the crisp
mark and "Position: documented" there (the review of `f5e7696`; kienmayer@7 has the same one-minute case at 14:30). The dispatch's text
meanwhile keeps the earlier phase's (`waitingFor`).
- *Options.* (a) Keep `confAt` as it is, the limit recorded. (b) Grade a waiting formation by the phase whose text it shows
  (`stateAt(id, waiting ? phaseAt(t)-1 : phaseAt(t))`, as `waitingFor` does), or, to cover kienmayer@7 too (its next departure falls on the
  phase's start, so `waitingFor` returns nothing), by its leg's first anchor while the leg has not begun: a change to the model's
  presentation in `app.js`, measured on a full check:visual (the review of the step's last commit).
- *Recommendation.* (b), measured. *Default.* (a). *Status.* Applied in roadmap step 4b part B (`6f0adee`): (b) in its fuller form, a
  formation whose next leg has not begun graded by the anchor it stands at (gqg 11:15-12:00, friant at 09:00, kienmayer at 14:30, A -> B);
  `opening-4` measured unchanged, the full check:visual at the part's end (`CHANGELOG.md`).

**197. The Guard's dawn grades (guard_inf@0, guard_cav@0, grade A).** Both are placed by the command post (guard_inf@0's act: "formed in reserve
around Napoleon's command post"; guard_cav@0 has no act), which K8 grades B; the Guard's "in reserve with the Emperor" (c_gd's role) is the
30th Bulletin's (`corr11_1863.p451.guard-centre-reserve`), which places it by no landmark. The readings do not fix them: Stutterheim has the reserve "bey Turas" in the night, without its
dawn place (`stutterheim1806de.p42.reserve-turas`); Coignet has the Guard formed behind the Emperor (`coignet1909.p121-123.guard-followed`);
Savary makes the Guard infantry Lannes's natural reserve (1 December).
- *Options.* (a) Keep A. (b) B for both, as gqg@0 under decision 160, measured on a full check:visual.
- *Recommendation.* (b), measured. *Default.* (a). *Status.* The decision applied in roadmap step 4b (`511f5e5`), measured on a full
  check:visual (`CHANGELOG.md`).

## Roadmap step 4b: the owner questions (198-)

**Decided, 17 October 2026.** The owner wrote: "questions 198-201, lets go with your recommendations, then include that in PR 53". Each is
decided as its *Recommendation* reads, conditions included, and applied in roadmap step 4b (`CHANGELOG.md`); each *Status* line says how.
Question 202, met in the review of those decisions' commits, was decided (b) with 187 and 196 on 17 October 2026 ("your recommendations
for all"), applied in roadmap step 4b part B; questions 203 and 204, met there, were decided as recommended on 18 October 2026 (203 applied in part C;
204 (a), as built).

Choices decisions 1-197 do not settle, met while applying decisions 176-197 in step 4b; each with its options, a recommendation and the
conservative default built meanwhile. The next owner decision after these is the number after the last.

**198. Timing grade B's words for a leg the sources date but give differently (lang@1, prz@1).**
- *Context.* Decision 176 (b) grades the II and III Columns' departures at 07:00 B, basis "source": the disposition and Przybyszewski's
  report give seven, Schönhals half past seven and Buxhowden's report eight for the II Column. `TIMING_TEXT.B`, the sentence the dossier
  shows while a leg graded B runs, reads "Timing given as approximate in this reconstruction's narrative, which cites no source for it."
  (decision 41's grades): untrue of these two legs, which cite sources. Every other leg graded B is unsourced.
- *Options.* (a) Keep B and `TIMING_TEXT` as they are. (b) Reword `TIMING_TEXT.B` to cover both uses, for instance "Timing approximate:
  the sources read differ on it, or this reconstruction's narrative gives it without a source." (a guarded declaration; check:data).
  (c) Grade the two legs A where a source dates the column's own departure (prz@1, its commander's report, as dok@1 is A beside
  Schönhals's half past six), B with (b)'s words for lang@1.
- *Recommendation.* (b): the words then say what B means in both uses, and no grade moves. *Default.* (a), as built.
- *Status.* Decided (b) on 17 October 2026; applied: `TIMING_TEXT.B` reworded as above (`CHANGELOG.md`).

**199. `narrow-1024`'s drop limit for question 177 (b).**
- *Context.* Decision 177 recommended (b), Friant retimed to Davout's hours, if `opening-2` and the cases at 500-570 measure within
  their limits. Built in full and measured in step 4b: `opening-2` unchanged, seven cases within their limits, but `narrow-1024` (09:30,
  1024 x 768) drops 7 labels against its limit 6: Bourcier's name gives way to the retaken village's event label, which (b) puts at 09:30.
  The fallback (a) is built. The limit is the 3C layer's in the 3D framing (decision 62); it is not an opening case (decision 121).
- *Options.* (a) Keep the limit; (a) of 177 stands. (b) Move `DROP_LIMIT["narrow-1024"]` to 7 for this one cause and apply 177 (b),
  measured again on a full check:visual (the patch is recorded in `CHANGELOG.md`, step 4b).
- *Recommendation.* (b): the sources' hours for Friant's march and Telnitz retaken (Davout's report graded A) are worth one name dropped at
  the 1024 px layout, where the dropped name stays reachable by hover and keyboard. *Default.* (a), as built.
- *Status.* Decided (b) on 17 October 2026; applied: the limit 7 and 177 (b) on the current tree (`CHANGELOG.md`); its measure on the
  step's final full check:visual is recorded in `CHANGELOG.md` (step 4b, the final checks).

**200. Question 195 applied on a machine reading.**
- *Context.* 195 (a), decided: keep the Szekler record "until the 1805 page is read with its neighbours (the first item of question 189's
  human reading)". In step 4b the page was read with its neighbours on its images by a machine reader (the Szekler box closes "dunkelblaue";
  "kornblumenblaue" is Palatinal Nr. 12's), and the record was corrected to dark blue, grade A.
- *Options.* (a) Keep the correction (built). (b) Restore the cornflower record with its doubt until 189's human reading confirms the page.
- *Recommendation.* (a): the page is legible on its images and its text layer agrees, and keeping a value shown to be another regiment's
  at grade A "fact" would keep a known error; 189's human reading can still confirm it. *Default.* (a), as built.
- *Status.* Decided (a) on 17 October 2026: the correction stands.

**201. The events whose hour the readings dispute, after question 193.**
- *Context.* Question 193 (b) lowered the timing grades of eight events; six of them (counter-march, telnitz, sokolnitz, pratzeberg,
  sokolnitz-falls, augezd) for hours the readings give differently, and davout-resumes for Mikhailovsky-Danilevsky's one o'clock against the
  map's 12:30. Their claims stay "fact" and they carry no `dispute`, so the dossier shows the disagreement only as "Timing B". Question 193
  asked for the grades only. Two of their whys rest on no reading: Kutuzov ordering the 4th Column to face about (face-about); Langeron
  pushed back on Sokolnitz from the west (davout-resumes). Face-about's phase line ("c. 09:15") and davout-resumes's ("c. 12:30") do not say
  the hour is the map's.
- *Options.* (a) Keep the claims and texts (built). (b) Make each event whose hour the readings dispute "disputed" with a `dispute` naming
  both hours (as telnitz-retaken and end are), each measured where the event is live at a harness case (a disputed event's map label gains
  "hour disputed"). (c) (b) for the texts only (the dispute in the why and phase lines, no claim change, no label note).
- *Recommendation.* (b) where the cases measure unchanged, else (c); the two unread whys checked or labelled this map's in the same task.
  *Default.* (a), as built.
- *Status.* Decided (b) on 17 October 2026; applied: seven events made "disputed" with their disputes, the two whys labelled
  this map's (and, after the review, their other copies: two phase lines, two acts and the Command row, now INFERRED); measured on the
  seven cases where they are live against the 199 build: no difference, so (b) stands for every event (`CHANGELOG.md`).

**202. Bourcier's dragoons after question 177 (b).**
- *Context.* Decision 177 (b) retimed Friant's division to Davout's hours: off from Raigern at 05:00, its leading brigade at the Goldbach
  about 09:00 (phase 3), Telnitz retaken at 09:30. Bourcier's dragoons (`FORMATIONS.bourcier`) were not named in 177: their track still
  reaches its screen south of Telnitz ([184,420], "Screens the ground south of Telnitz") at phase 2, 08:00, an undated creep from Raigern
  at 04:00, so on the map they leave Raigern an hour before Davout's 05:00 and stand south of Telnitz about an hour before Friant's infantry
  reaches the stream; the Allied headquarters' reading has them "uncertain" from phase 2 (`KNOW_OVERRIDE.al.bourcier`), as Friant was
  "seen" from phase 2 until the review moved his to phase 3. Mikhailovsky-Danilevsky has Davout come from Raigern "with Friant's infantry
  division and Bourcier's cavalry" after Kienmayer had taken Telnitz (pp. 178-179, `md1844.p178-179.davout-telnitz`, grade B, fact; no
  hour); no reading read gives Bourcier's own hour or place.
- *Options.* (a) Keep the track and the reading as they are (built). (b) March Bourcier with Friant, as Mikhailovsky-Danilevsky has it:
  the screen's anchor re-keyed from phase 2 to phase 3, its leg dated as Friant's (`tm {dep:300, gr:"B", basis:"source"}`, the departure
  Davout's for the division he brought), `KNOW_OVERRIDE.al.bourcier` "uncertain" from phase 3; measured where Bourcier is drawn
  (`narrow-1024`, whose drop at 09:30 is his name, and the cases at 07:00-09:30), applied only within their limits. (c) (b) without the
  date: the anchor re-keyed to phase 3, the leg still undated.
- *Recommendation.* (b): the one reading that names the dragoons puts them in Friant's march, and Davout's hour for that march is in the
  map since 177 (b); the screen's place is kept, being undated in any reading. *Default.* (a), as built.
- *Status.* Decided (b) on 17 October 2026 ("your recommendations for all"); applied in roadmap step 4b part B (`7968f09`), measured on six
  cases with no difference (`CHANGELOG.md`).

**203. The claims at the end of the drawer dossiers (decision 187 (ii)'s second part).**
- *Context.* Decision 187 (ii) recommended the index in the sources sheet first, then a button at the end of the drawer dossiers, each
  measured. In roadmap step 4b part B the owner chose the index and the dossier's tags, and this button for later. The formation dossier now
  tags each statement with its claim; the event, place and terrain-line dossiers (the "drawer dossiers" besides the formation's) show their
  statements without one, and nothing there leads to the index.
- *Options.* (a) Nothing more: the index and the formation dossier's tags. (b) At the end of every drawer dossier, a button "How this is
  sourced" opening the sources sheet at the index, with the dossier's own statements and their claims listed first; measured on
  `paper-drawer`, `selected-formation` and the contrast states that open a dossier. (c) (b) without the button: the event, place and
  terrain-line dossiers' statements tagged as the formation dossier's are, and the formation's compact card's (its act now, the next act,
  the objective, the army total), which part B left untagged (the review of `c1a000f`).
- *Recommendation.* (b), measured, with (c)'s tags if the measures allow both. *Default.* (a), as built.
- *Status.* Decided (b) with (c) on 18 October 2026 ("Go with your recommendations for 203, 204"); applied in roadmap step 4b part C:
  every drawer dossier (the formation's card and full dossier, an event's, a place's, a terrain line's) ends with "How this is sourced",
  opening the sources sheet at the index with that dossier's statements first; the card's, the events' and the places' statements tagged
  (the dossier headers' name, designation and summary untagged, as the formation dossier's header is); measured (`CHANGELOG.md`).

**204. Event names as framing statements (decision 187 (iii)).**
- *Context.* Decision 187 (iii) gives the framing statements the claim "interpretation" (`CLAIM_WORDS`: "This map's reading") by class. In
  roadmap step 4b part B the classes so claimed are the phase titles, the track objectives and the act lines (75 statements). The option
  put to the owner on 17 October also named event names; they were left out: an event's name states the event ("Kienmayer attacks Telnitz"),
  whose own claim (`EVENTS[].claim`: fact, estimate, reconstruction, disputed) its pill shows, so "This map's reading" would understate a
  documented event. Some track objectives, likewise, restate orders the readings give (the Allied disposition's), which "beyond what its
  sources say" understates without overclaiming.
- *Options.* (a) As built: event names unclassed (their claim the event's), track objectives "interpretation" by class. (b) Event names
  "interpretation" by class too, as the option named them. (c) (a), and the track objectives that restate a read order given claims of their
  own, one by one, from the readings.
- *Recommendation.* (a) now, (c) when a sourcing pass reaches the orders. *Default.* (a), as built.
- *Status.* Decided (a) on 18 October 2026: as built, nothing changes; (c) handed on to the next sourcing pass. The owner's message also
  named a question 205, which did not exist; none was asked. The next owner decision is 205.

