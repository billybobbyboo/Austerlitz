# Roadmap step 5: the owner questions (from 205)

Choices that decisions 1-204 do not settle, put to the owner as the task asked (20 October 2026), each with its options, a recommendation
and the conservative default built meanwhile. No default moves a harness limit (`DROP_LIMIT`, `UNOBSTRUCTED`, `PAPER_MIN_PXKM`,
`CTX_DELETES`; the opening cases never, decision 121) or loosens an assertion. Each *Status* line says what the build carries.

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
