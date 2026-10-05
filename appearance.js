/* ============================================================
   AUSTERLITZ — historical appearance (Stage 6B: docs/STAGE6_SPEC.md §5, §6.1; owner decisions 96-110, §0.4)
   The CLAIMS about what the troops present on 2 December 1805 wore and carried, each with its source, its locator
   (page, plate, view), an appearance grade and a label. Nothing here is drawn: the drawn colours and shapes are
   presentation (KIT in app.js, 6C), design decisions taken from these claims (decision 102). Guarded data
   (tools/visual/data-invariance.js); a change is a data task, listed in CHANGELOG.md with what was, what is and why.

   Appearance grades (the Stage 6 grades; not the data's position grades A/B/C of data.js, which grade where a
   formation stood):
     A  documented for 1805: a source dated 1804-1805, or a regulation shown to be in force on 2 December 1805
     B  documented for the period and probable for 1805
     C  reconstructed or disputed
   Labels: fact, disputed, derived, inference, uncertain.

   A claim is {v, en, src, at, gr, lab, q, note}: v the source's own words, en an English rendering, src a key of
   APPEARANCE_SOURCES, at the locator, gr the grade, lab the label, q a short verbatim quote (the source's language),
   note anything else (a conflict, what the grade rests on). A regulation used at grade A also carries inForce
   {src, at, q}: what shows it was in force on the day. Drawable attributes also carry a class from APPEARANCE_VOCAB
   (c a colour class, h a headgear class): the vocabulary names what the source's words describe, so 6C can draw it;
   the source's words stay in v. An attribute no read source settles is {gen:true, why}: drawn generic and labelled
   (§2.9; decisions 98, 105).
   ============================================================ */

var APPEARANCE_GRADE = {
  A: "documented for 1805",
  B: "documented for the period, probable for 1805",
  C: "reconstructed or disputed"
};

/* the classes a drawable attribute may take; a source's words map to one of these (en says how) */
var APPEARANCE_VOCAB = {
  colour: [],
  head: []
};

/* every work read for this table: au author, ti title, pub place, publisher, d year (the edition read), kind
   (regulation, primary-text, primary-image, object, specialist, modern-web-specialist), url the scan read */
var APPEARANCE_SOURCES = {
};

/* dress classes: one per kind of dress the sources describe for a class of troops present */
var DRESS = {
};

/* each leaf formation's composition (decision 100): parts {dress, n, unit (bn, sqn, coy, bty, staff), regts, src, at,
   gr, lab}; a part's share is its n over the formation's total. A formation whose composition no read source gives
   takes its dominant class, marked so. Mixed-arm formations keep the arm the data gives them (no splitting). */
var COMPOSITION = {
};

/* the colours carried by each dress class's units: model, count rule, cloth, staff, finial, each a claim, or
   {gen:true, why} */
var COLOURS_CARRIED = {
};

/* the two sourced numbers per nation behind the standard's ratio (decision 106): the staff's top (with its eagle or
   finial) and the man's stature to his hat's top; the ratio is their quotient (derived) or, where either is not
   sourced, 1.6 stays provisional */
var STANDARD_MEASURES = {
};

/* the table's resolution (decision 100): a leaf formation's dress classes with their shares of its drawn battalions or
   squadrons, and the colours each carries. Read by the tests and the dossier (6C); draws nothing. */
function appearanceOf(id){
  var c=COMPOSITION[id]; if(!c) return null;
  var tot=c.parts.reduce(function(t,p){ return t+p.n; },0);
  return { id:id, dominant:!!c.dominant, note:c.note||null,
    parts:c.parts.map(function(p){ var d=DRESS[p.dress];
      return { dress:p.dress, share:tot>0?p.n/tot:0, n:p.n, unit:p.unit, regts:p.regts||null, d:d||null,
        colours:(d&&COLOURS_CARRIED[d.carry])||null }; }) };
}
