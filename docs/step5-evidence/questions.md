# Roadmap step 5: the owner questions (from 205)

Choices that decisions 1-204 do not settle, put to the owner as the task asked (20 October 2026), each with its options, a recommendation
and the conservative default built meanwhile. No default moves a harness limit (`DROP_LIMIT`, `UNOBSTRUCTED`, `PAPER_MIN_PXKM`,
`CTX_DELETES`; the opening cases never, decision 121) or loosens an assertion. Each *Status* line says what the build carries.

**Decided.** On 20 October 2026, after PR #56 was merged, the owner: "Go with your recommendations for all questions." Decisions 205-212
are each question's recommendation, applied in roadmap step 5's follow-up (PR #57): 205 (a), 206 (a), 207 (a) and 208 (a), already in the
build as their defaults; 209 (a), the accents, a data task, measured; 210 (c); 211 (b), Duffy read on the text layer and Smith not readable,
so the strength unchanged and question 213 put; 212 (b), `CTX_DELETES` 248 on the owner's word. The next owner decision is 214.

**205. One name per thing on screen (R-3).** `docs/FINAL_AUDIT.md` R-3 found four things with more than one name on screen.
- *The ten themes* were "moments" in the Analysis tab's heading and hint and "chapter" in the "?" overlay and the theme's mark on the
  timeline. The code and the specifications call them themes, and "moment" is a phase's or an event's place in the day (a theme names its
  moments: `ANALYSIS[].at`, `.moments`). Options: (a) "theme" everywhere on screen ("The battle in ten themes", "Pick one of the ten themes
  above", "The theme “…”"); (b) "moment" everywhere, and the spine's own moments renamed; (c) "chapter". *Recommendation and default:* (a).
- *The phase's own text* (the Now tab, the card below 1080 px) was "the dispatch" in the "?" overlay's D row and the legend's tooltip, and
  "the phase text" in the Now tab's note. *Recommendation and default:* "the phase text" (the visible note's words).
- *The sources sheet* had three names: its button "Accuracy, sources and confidence grades", its dialog's name "Accuracy and sources", its
  heading "On accuracy and uncertainty" (`SOURCE_NOTE.title`, data). Options: (a) "Accuracy and sources" for the button, the dialog and its
  text region, the heading kept (a guarded string; its own question below); (b) also retitle `SOURCE_NOTE.title` "Accuracy and sources" (a
  data task: one guarded string, check:data's reference moved). *Recommendation:* (a) now; (b) only if you want the heading to match.
  *Default:* (a). Measured: the shorter button narrows the tools' box (see `CHANGELOG.md`, group 2's measurement).
- *"Whose eyes?"* read "Eyes: Napoleon" beside "Eyes: Allied HQ" on the timeline's button, and "Napoleon's headquarters" / "Allied
  headquarters" everywhere else. *Recommendation and default:* "Eyes: Napoleon's HQ" (the headquarters, abbreviated as the Allied one is).
- *Status:* each default in the build (step 5 group 2), from `LABELS.names` and `EYES.SHORT`.

**206. Formats (R-6).** What the build shows now, each the most conservative way to one form:
- *Clock ranges on screen* were written three ways ("04:00 - 07:00" in `PHASES[].clock`, data; "08:00 to 09:00" in the event dossier and
  the markers' tooltips; "45–70" for a number range). Options: (a) every clock range shown as the phases' own clocks are written,
  "08:00 - 09:00" (spoken names keep "to", which a screen reader reads better); number ranges keep their en dash; (b) an en dash for every
  range, "08:00–09:00", which needs `PHASES[].clock` retyped (a data task, ten guarded strings). *Recommendation and default:* (a).
- *The relief factor's sign* moved ("×4" in the legend, the place dossier, the paper map's note and the eye-level caption; "4×" on the
  buttons). *Recommendation and default:* "4×" everywhere (the buttons' form).
- *The tour's counter* read "1 OF 9" in capitals, outside `LABELS`, beside the opening's "Opening, step 1 of 4". *Recommendation and
  default:* "Stop 1 of 9" (`LABELS.tour.counter`).
- *Numbers* were grouped by the visitor's locale (`toLocaleString()`: on a German browser "Allied ≈ 38.700" in an English sentence).
  *Recommendation and default:* British English grouping always ("38,700").
- *Separators:* the claims index, the confidence grades' list and the order of battle's two army headings used an em dash where the rest
  of the interface uses a colon. *Recommendation and default:* the colon. `CONF_TEXT.C` ("Reconstructed from the narrative — treat as
  indicative only") keeps its em dash: it is a guarded declaration (data in app.js); change it only in a data task, if you want.
- *Status:* each default in the build (step 5 group 2).

**207. The tour's own words (R-6; decision 115).** The stops mix written-out and numeric forms: stop 4 "From seven o'clock" beside
"04:00" and "07:25"; stop 6 "At about a quarter to nine"; stop 7 "until about noon"; stop 9 "about eleven thousand to more than twenty-five
thousand", "near nine thousand" beside stop 4's "about 39,000". `TOUR` is guarded data, and stops 1, 6, 7 and 8 are the opening's text
(decisions 114, 115; the opening cases' limits never move, decision 121). Options: (a) keep the words as written (a narrator's voice,
which writes hours in words and computed readings in figures); (b) every hour and figure in digits ("From 07:00", "At about 08:45", "11,000
to more than 25,000"); (c) every hour and round figure in words. *Recommendation:* (a): the mix follows a rule the text already keeps (the
narrative in words, the derived readings in figures), and (b) or (c) changes the opening's words for no gain in accuracy. *Default:* (a),
nothing changed. *Status:* unchanged.

**208. The event steps' glyphs (`docs/VISUAL_AUDIT.md`, low).** The timeline's previous and next event buttons were "◄│" and "│►", the
bar inside the triangle: the reverse of the media players' ⏮ ⏭. Options: (a) the same two glyphs in the conventional order, "│◄" and "►│"
(no font change); (b) ⏮ and ⏭ themselves (two glyphs the embedded faces lack: `fonts.css` regenerated by `tools/fonts/build-fonts.py`
with a further subset, and its licences' records); (c) as before. *Recommendation and default:* (a). *Status:* (a) in the build.

**209. Accents in names (H-19).** The names are spelled two ways: `data.js` and `analysis.js` write "Thiebault" (56 times), "Vare",
"Bessieres", "Legere" and "Olmutz" (beside "Olmütz", 10 times), `appearance.js` "Thiébault", "Varé", "Légère"; "Grande Armee" in the order of
battle beside `appearance.js`'s "Grande Armée". Options: (a) the accented forms everywhere outside quotations (Thiébault, Varé, Bessières,
Légère, Olmütz, Grande Armée): a data task touching several hundred statements' hashes in `narrative.js` and the chronology ledger's texts,
each reviewed again, every case of check:visual measured (longer words can move a map label); (b) the unaccented forms everywhere outside
quotations and source titles (the build's majority today); (c) as now. *Recommendation:* (a), as its own data task, measured: the accents are
the names' own, and the sources print them. *Default:* (c), nothing changed but "St-Hilaire" (once, in `PHASES[3].lede`), now "Saint-Hilaire"
as everywhere else (not an accent). The Dress notes' internal words that H-19 also names ("data.js", "(col4.mixedNote)", in `appearance.js`)
are not spellings: left for a later data task.
*Status:* decision 209 (a), applied (PR #57): Thiébault, Varé, Bessières, Légère, Olmütz and Grande Armée in every statement of `data.js` and
`analysis.js`, the overlay's label and the order of battle's heading in `app.js`, the claims' notes in `narrative.js` and the chronology
ledger's names, cites and allowances; quotations, source titles and reading ids as printed. 66 statements' texts changed by the six names
alone, 38 claims of their own rehashed after that check (`CHANGELOG.md`); check:visual measured against the step-5 build.

**210. The Guard infantry's commander on 2 December (`FORMATIONS.rg_inf.commander`; step 4's hand-on).** The map names Lt.-Gen. Maliutin.
The sources read (register entries C6.27, C6.28, C6.c1, C6.c2, C6.c3 and S5.6) give him the Guard infantry at Olmütz and on the march, and
Sokolov's order of battle for 2 December still titles him "commanding all the Guard infantry"; but on the day all three that cover it put him
at the head of a separate column (the Life Grenadiers and the Chevalier Guard; the Chevalier Guard sent ahead), which came up late. The Guard
infantry that fought with the Tsesarevich is listed in Sokolov (S5.6, grade C, no source on its page) under Maj.-Gen. Depreradovich 1st, by
title the 1st Guard infantry brigade's commander, with the Izmailovsky and the jägers labelled part of the 2nd brigade. No source read
puts Maliutin with the infantry at Stare Vinohrady, and none names one commander of that infantry under the Tsesarevich. Options: (a) the
commander "Maj.-Gen. Depreradovich 1st" (overstates Sokolov, who gives him a brigade); (b) keep "Lt.-Gen. Maliutin", the commander by title,
and say in the note where he was on the day and who led the infantry that fought; (c) the commander "not established on the day", the note
naming both. *Recommendation:* (c): the field then says what the sources say, and the note keeps both. *Default:* (b), applied in group 4
after its review (the first default, (a), was put in the field and taken out again on the reviewer's finding that it overstates Sokolov);
the note's claim "attributed", six readings.
*Status:* decision 210 (c), applied (PR #57): `FORMATIONS.rg_inf.commander` "Not established on the day", its own claim "uncertain" with
its search (S5.6, C6.c1-C6.c3, C6.27); the strength note names Maliutin and Depreradovich 1st as the sources give them.

**211. The Guard infantry's 6,730 (`FORMATIONS.rg_inf.strength`).** Duffy's and Smith's figure (cited, not read) appears to count the whole
Guard infantry, the Life Grenadiers' three battalions with it, while Sokolov's 1st column (S5.6) has seven battalions with the Tsesarevich and
the Life Grenadiers with Maliutin, away; Sokolov's total for the whole reserve is 10 battalions and 7,500 infantry (p. 200), which gives no
figure for the seven. Options: (a) keep 6,730 with its note (as now); (b) read Duffy and Smith first, then decide; (c) lower it to the seven
battalions' share, if a source read gives it. *Recommendation:* (b). *Default:* (a), unchanged.
*Status:* decision 211 (b), done (PR #57). Duffy (1977) was read on the text layer only (the item lends; its pages not open from here):
register entry S5.7. Its appendix (pp. 184-185) gives the Guard 10,530 and 40 pieces; its rows, as the OCR pairs them, put the 6,730 as the
three Guard regiments (1,000, 1,400, 1,500), the jägers (530) and a three-battalion "Guard Gr.R. (in reserve)" (2,300), which leaves 4,430
for the seven battalions with the Tsesarevich. Smith (1998) could not be read (S5.8). A reading on the text layer carries no claim
(`test.js`), so nothing is changed: the strength stays 6,730 with its note, and the choice goes to the owner as question 213.

**212. The context-loss case and `CTX_DELETES` (group 3).** The case now loses the context with the page idle: 0 "does not belong to this
context" warnings on three runs, deterministic, and the bound 40 untouched. But the case then no longer exercises a geometry drawn before the
loss and disposed after it (three r128's path the warning comes from). Options: (a) as now; (b) add a clock step after the restore (a visitor's
action) so that path runs on every run: 248 warnings on each of three runs (deterministic), which needs `CTX_DELETES` raised to 248 (your
word);
(c) (a), and lower `CTX_DELETES` to 0 to hold the determinism (your word: a bound changed). *Recommendation:* (b) with a bound of 248, the count measured: the case
then tests the restored context under a visitor's step as well, at a count that no longer varies (group 3's review asked for it: the idle
case alone no longer exercises the path its bound was set for). *Default:* (a).
*Status:* decision 212 (b), applied (PR #57): `tools/visual/boot-check.js` holds 0 warnings with the page idle after the restore, then
steps the clock to phase 3 and requires the page idle again with frames drawn; `CTX_DELETES` 248, the count on each of three runs.

**213. The Russian Guard's strengths after Duffy's appendix (decision 211; `FORMATIONS.rg_inf.strength` 6,730, `FORMATIONS.guard_cav.strength`
3,700, the corps note of `FORMATIONS.constantine`).** Read on the text layer only (S5.7), Duffy's 6,730 counts a three-battalion Guard
grenadier regiment "in reserve" with the seven battalions that fought (4,430 by his rows), and his horse rows sum to 2,900, not the 3,700 the map
credits to Duffy and Smith (800 of his 10,530 in no row read). Smith is not read (S5.8). Options: (a) as now, the note saying what the text
layer gives, once its reading is on a page image; (b) borrow Duffy's pages (a person with an archive.org account, or the book) and read pp.
184-185 on the page, then set `rg_inf` to the seven battalions' figure and `guard_cav` to the rows' sum, each with its note, if the page bears
the OCR out; (c) lower `rg_inf` to 4,430 and `guard_cav` to 2,900 now, on the text layer (against the register's rule that a reading on the text
layer carries no claim). *Recommendation:* (b): the figures move only on a page read; the map's other strengths are held to that.
*Default:* (a) without the note's change: nothing changed, the reading recorded.
