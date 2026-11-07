/* WP-15: the open historical questions, merged and ranked by interpretive impact (docs/ROADMAP_FINAL_AUDIT.md, WP-15; ChatGPT's CG-F03).
   Merges ChatGPT's 35 (docs/final-audit-chatgpt-evidence/unresolved-questions.csv, U01-U35), the audit's section E.3
   (docs/FINAL_AUDIT_POST_STAGE8.md) and SOURCE_NOTE's open questions (data.js, SOURCE_NOTE.body[5]); adds those WP-15's first batch found.
   The judgements (V, D, A below) are written out by hand, each with its reason; the statement counts (S) are computed from the inventory
   by the pattern given; the ranking is computed. Writes docs/wp15-evidence/open-questions.md.
     node tools/wp15/open-questions.js [--check]
   The criteria, each scored by hand:
     V  what a visitor is shown that depends on it: 3 the first screen, the opening, the tour or a phase lede; 2 an event, the caption, the
        Command tab or a dossier; 1 the sources sheet only; 0 the records only;
     D  whether the drawing takes a side: 2 the map draws one answer (a position, a track, a timing, the ground); 1 the text takes a side;
        0 neither;
     A  the battle's argument: 2 it bears on the turning points (the plateau, the Allied left's ruin, the Guards' fight, the end); 1 local;
        0 presentation only.
   Rank: V + D + A, highest first; then S (the inventory's statements whose text matches the question's pattern); then the merged id. */
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..", ".."), OUT = path.join(ROOT, "docs", "wp15-evidence", "open-questions.md");

const Q = [
  { id: "climb", q: "When the Allied columns left the plateau, and when Soult's divisions climbed onto it", from: ["U26", "SOURCE_NOTE (the columns' departure)", "the climb's dispute (Stage 2)"],
    where: "SOURCE_NOTE.body[5]; EVENTS[#columns-move], EVENTS[#soult].dispute, EVENTS[#decision].dispute; check:chronology's CONFLICTS", shown: "yes: the opening's second step (TOUR[5].x), phase 3's lede, the events' disputes, the plateau reading (derived)",
    settle: "a dated order or report giving the 4th Column's and the climb's hours (Kutuzov's and Buxhowden's reports, Langeron's journal, the French corps' reports); the published accounts read give a range of about an hour", re: /quarter to nine|climb|left the plateau|leaving the heights|off the heights|filing off/i, V: 3, D: 2, A: 2 },
  { id: "kamensky", q: "Who turned Kamensky's brigade, and when", from: ["U27", "SOURCE_NOTE (Kamensky's turn)", "CL-SRC-09"],
    where: "SOURCE_NOTE.body[5]; EVENTS[#kamensky]; COMMAND.al[\"4\"][0]; check:chronology's CONFLICTS (kamensky@3, @4)", shown: "yes: phase 4's lede, the event and its dispute, the Command tab",
    settle: "Langeron's report and journal (cited at second hand by Mikhailovsky-Danilevsky; the manuscript in St Petersburg); S8.11 adds the French translation's account of Kamensky's report to Langeron", re: /Kamensky/, V: 3, D: 2, A: 2 },
  { id: "guard-attack", q: "The Russian Guard's attack: its hour, its upper bound, and Rapp's counter-charge", from: ["U15", "U28", "SOURCE_NOTE (the upper bound; Rapp's charge)"],
    where: "SOURCE_NOTE.body[5]; EVENTS[#guard-attack].dispute; PHASES[#6].lede (disputed); check:chronology's CONFLICTS (guard_cav@6)", shown: "yes: phase 6's lede, the events, the Command tab",
    settle: "the Russian Guard's regimental reports (Depreradovich to Maliutin, cited by Mikhailovsky-Danilevsky), the French Guard's reports; the accounts read give about noon to about 13:00", re: /Guard (attack|cavalry|charge)|Rapp|Stare Vinohrady|Old Vineyards/, V: 3, D: 2, A: 2 },
  { id: "buxhowden-learned", q: "When Buxhowden and his columns learned that the centre was gone", from: ["new (WP-15's first batch)"],
    where: "TOUR[6].x, ANALYSIS[#cut].text, COMMAND.al[\"4\"][1], COMMAND.al[\"7\"][0]; docs/wp15-evidence/proposals.md", shown: "yes: the opening's third step ('until about noon'), the theme, the Command tab",
    settle: "Langeron's and Buxhowden's reports; Mikhailovsky-Danilevsky (S8.10, S8.11) has Langeron told by Kamensky early and Kutuzov order Buxhowden to retire, without an hour", re: /until about noon|centre (had gone|was gone)|not (been )?told|will not learn/, V: 3, D: 1, A: 2 },
  { id: "retreat", q: "The Allied left's way out: the retreat the disposition ordered and the one taken over Augezd and the meres", from: ["new (WP-15's first batch)", "C6.20"],
    where: "PHASES[#8].lede (disputed), TOUR[7].x, COMMAND.al[\"8\"][0], FEATURES[#augezd]", shown: "yes: the opening's last step, phase 8's lede, the Command tab",
    settle: "an order of the day naming the left's retreat; the disposition read orders two (the left through Kobelnitz and Puntowitz, p. 105; the army in the worst case on Niemtschan, Hodjegitz and Herspitz, p. 106, S8.7; Kodiegitz in Mikhailovsky-Danilevsky, S8.9)", re: /way out|retreat|Augezd defile|neck of dry ground/, V: 3, D: 2, A: 2 },
  { id: "drowned", q: "How many men drowned in the meres, and the ice casualties", from: ["U21", "E.3", "SOURCE_NOTE"],
    where: "SOURCE_NOTE.body[5]; PHASES[#8].lede; EVENTS[#ice]; FEATURES[#satschan]", shown: "yes: shown as disputed (the 30th Bulletin's 20,000 against the later counts)",
    settle: "the drainage counts of 1806 (Satschan), already in the register in part; the Russian returns of losses", re: /\bdrown|\bice\b|\bmeres?\b/i, V: 3, D: 1, A: 2 },
  { id: "bagration", q: "Bagration's line at dawn and at the end of the day, and when his corps fell back", from: ["U07", "U08", "U30", "E.3", "SOURCE_NOTE"],
    where: "SOURCE_NOTE.body[5]; docs/STAGE8_SPEC.md 21.9; FORMATIONS.bag; check:chronology's CONFLICTS (bag@6)", shown: "yes: both sources' places; phase 5's lede; the Command tab",
    settle: "Bagration's report; the disposition's 'Pohorlitz' identified (S8.9); Stutterheim p. 71 (C6.11) and Schönhals p. 166 already read", re: /Bagration/, V: 3, D: 2, A: 1 },
  { id: "allied-total", q: "The armies' totals and guns on the day (the Allied 85,400 working figure; the French about 73,000; the guns 139 and 278)", from: ["new (WP-15's first batch)", "CL-SRC-01 (the totals left in Stage 2)"],
    where: "FORMATIONS.gqg.army, FORMATIONS.ahq.army; SOURCE_NOTE.body[2]; docs/wp15-evidence/proposals.md", shown: "yes: the army cards and dossiers, the tour's last stop",
    settle: "read now on page images: Sokolov 72,500-73,000 and 140 guns, about 80,000 and about 300 (318-330) guns (S8.1, S8.2, S8.4); Schönhals 82,575 (C5.2); Stutterheim 82,040 on 27 November (S8.15); Duffy's text layer 80,000-87,000 and 278 pieces; no source read prints 85,400", re: /85,400|73,000|72,500|80,000|working figure/, V: 2, D: 2, A: 1 },
  { id: "blasowitz", q: "When Blasowitz fell", from: ["U17", "SOURCE_NOTE"], where: "SOURCE_NOTE.body[5]; EVENTS[#blasowitz]; COMMAND.al[\"6\"][2]", shown: "yes: phase 5's lede, the event, the Command tab",
    settle: "the Russian Guard jägers' and Bagration's reports; the accounts read give no clock hour", re: /Blasowitz/, V: 3, D: 2, A: 1 },
  { id: "bernadotte", q: "When Bernadotte's corps, Drouet's division with it, crossed the Goldbach", from: ["U19", "SOURCE_NOTE"], where: "SOURCE_NOTE.body[5]; COMMAND.fr[\"4\"][1] (disputed); FORMATIONS.drouet", shown: "yes: the Command tab, the dossiers",
    settle: "I Corps' report; Marbot, Ségur and Stutterheim already read disagree", re: /Bernadotte|Drouet/, V: 2, D: 2, A: 2 },
  { id: "friant", q: "When Friant's division left Raigern, and its arrival at the Goldbach", from: ["U29", "SOURCE_NOTE (Friant's departure)"], where: "SOURCE_NOTE.body[5]; FORMATIONS.friant; decisions 177 (b) and 199",
    shown: "yes: the dossiers, phase 1's lines, the events", settle: "Davout's two reports already read give five, or half past five to six (C1-C2); Sokolov about six; the map's timing follows decision 199", re: /Friant/, V: 2, D: 2, A: 1 },
  { id: "zuran", q: "When Napoleon took post on the Zuran", from: ["U18", "SOURCE_NOTE"], where: "SOURCE_NOTE.body[5]; FEATURES[#zuran]; ANALYSIS[#pratzen]", shown: "yes: the place and the theme",
    settle: "the 30th Bulletin and Mikhailovsky-Danilevsky place him on a height at sunrise; no source read names the Zuran (an identification)", re: /Zuran/, V: 2, D: 2, A: 1 },
  { id: "russian-guard-place", q: "The Russian Guard's place from dawn to its attack (behind Blasowitz and Kruh, or toward Krzenowitz)", from: ["WP-03 (CL-HIS-03)", "new readings of WP-15's first batch"],
    where: "docs/ROADMAP_FINAL_AUDIT.md WP-03; FORMATIONS.rg_inf, rg_cav", shown: "yes: the Guard's drawn track and its grades",
    settle: "the disposition (C1.1, S8.7) against Stutterheim's evening of 1 December (S8.12) and Sokolov's 'a little west of Austerlitz' (S8.2); the Guard's reports", re: /Constantine|Russian Guard|Imperial Guard/, V: 2, D: 2, A: 2 },
  { id: "pheasantry", q: "The Sokolnitz castle's walls, and the pheasantry: its enclosure, and whether the accounts know it at all", from: ["U04", "E.3", "SOURCE_NOTE", "CL-GEO-02", "WP-15's search"],
    where: "SOURCE_NOTE.body[5]; docs/STAGE8_SPEC.md 21.7, 21.9; PHASES[#2] (title and lede) and nine other statements", shown: "yes: phase 2's title and lede name the pheasantry; the walls are not drawn",
    settle: "an estate plan or inventory of Sokolnitz before 1825; no account of 1805-1806 read names a pheasantry (WP-15 searched sixteen text layers)", re: /pheasantry|castle/, V: 3, D: 2, A: 0 },
  { id: "marsh", q: "How wet the Goldbach's bottom was in December 1805", from: ["U05", "E.3", "SOURCE_NOTE", "CL-GEO-06"], where: "SOURCE_NOTE.body[5]; docs/STAGE8_SPEC.md 21.9; the marsh drawn beside the lower brook", shown: "the marsh is drawn; the text says it is open",
    settle: "the cadastre's land-use registers of 1825 (the sketches already read); an account of the day (Marbot's 'marais' is of the meres' borders)", re: /marsh|\bwet\b/i, V: 2, D: 2, A: 1 },
  { id: "highway", q: "The highway's course east of the Santon in 1805", from: ["U01", "E.3", "SOURCE_NOTE", "CL-GEO-10"], where: "SOURCE_NOTE.body[5]; docs/STAGE8_SPEC.md 21.8, 21.9", shown: "the road is drawn on the 1826-52 course; the question in the sources sheet",
    settle: "a road map before 1805-1810 (the first military survey, 1764-1768 and 1780-1783, Moravia sheets)", re: /highway/i, V: 1, D: 2, A: 1 },
  { id: "posthouse", q: "Where the Posoritz post house stood in 1805", from: ["U02", "E.3", "SOURCE_NOTE"], where: "SOURCE_NOTE.body[5]; FEATURES[#posthouse]; docs/STAGE8_SPEC.md 21.9", shown: "yes: the place is drawn and named",
    settle: "the first military survey; the post's records", re: /post house|Posoritz/i, V: 2, D: 2, A: 0 },
  { id: "channel", q: "Which channel carried the Goldbach north of the Sokolnitz castle in 1805", from: ["U03", "E.3", "SOURCE_NOTE", "CL-GEO-10"], where: "SOURCE_NOTE.body[5]; docs/STAGE8_SPEC.md 21.7, 21.9; a code comment", shown: "the sources sheet only",
    settle: "the first military survey; an estate plan", re: /channel/i, V: 1, D: 2, A: 0 },
  { id: "krug", q: "Krug's and Bellowitz's positions", from: ["U10", "U11", "E.3", "SOURCE_NOTE", "CL-GEO-07"], where: "SOURCE_NOTE.body[4], [5]; docs/STAGE8_SPEC.md 21.9", shown: "yes: Krug drawn with a reason the 1836-52 survey contradicts",
    settle: "the second military survey (1836-52) places Krug (CL-GEO-07): available, for WP-04b", re: /Krug|Bellowitz/, V: 2, D: 2, A: 0 },
  { id: "chapel-guns", q: "How many guns stood by the chapel of St Anthony, and whose", from: ["U20", "SOURCE_NOTE"], where: "SOURCE_NOTE.body[5]; FORMATIONS.heightguns (disputed)", shown: "yes: the battery is drawn; its note disputed",
    settle: "IV Corps' and the Guard artillery's reports", re: /chapel|heightguns|twenty guns/i, V: 2, D: 2, A: 1 },
  { id: "kologrivov", q: "Kologrivov's command of the Guard cavalry on 2 December", from: ["U16", "E.3", "SOURCE_NOTE", "CL-SRC-03"], where: "SOURCE_NOTE.body[5]; FORMATIONS.rg_cav.commander", shown: "yes: the dossier's commander",
    settle: "the Guard cavalry's reports; Schönhals's table (S6.2) and Sokolov already read", re: /Kologrivov/, V: 2, D: 1, A: 0 },
  { id: "uvarov", q: "Whether Uvarov's regiments were with Liechtenstein's column or had gone to Bagration the evening before", from: ["U25", "SOURCE_NOTE"], where: "SOURCE_NOTE.body[5]; FORMATIONS.lich.strengthNote", shown: "yes: the dossiers",
    settle: "Mikhailovsky-Danilevsky sends them the evening before (read again, S8.9, p. 233); Schönhals's table counts them in the 5th Column (C5.2); Liechtenstein's report", re: /Uvarov/, V: 2, D: 2, A: 1 },
  { id: "numbers", q: "How Suchet's, Caffarelli's, Rivaud's and Drouet's divisions were numbered on the day", from: ["U22", "U23", "SOURCE_NOTE"], where: "SOURCE_NOTE.body[5]; the divisions' desig", shown: "yes: the dossiers' designations",
    settle: "a French return of 2 December (none exists, C5.8); Sokolov's table (S8.5, C5.9) and the October situations read differ", re: /division of|1st division|2nd division|3rd division/i, V: 2, D: 1, A: 0 },
  { id: "gladkov", q: "Gladkov's brigade", from: ["U24", "SOURCE_NOTE"], where: "SOURCE_NOTE.body[5]", shown: "the sources sheet", settle: "Duffy names him alone (S6.8); the 5th Column's reports", re: /Gladkov/, V: 1, D: 1, A: 0 },
  { id: "flags", q: "The pattern of Russian infantry flags", from: ["U12", "SOURCE_NOTE"], where: "SOURCE_NOTE.body[5]; appearance.js COLOURS_CARRIED.ru_inf", shown: "yes: the standards are drawn plain", settle: "a regulation or flag register of 1797-1805 (Viskovatov's later volumes read)", re: /\bflags?\b|colours carried/i, V: 1, D: 2, A: 0 },
  { id: "grenz", q: "Whether Grenz infantry wore brown in 1805", from: ["U13", "SOURCE_NOTE"], where: "SOURCE_NOTE.body[5]; appearance.js DRESS (Grenz)", shown: "yes: the figures drawn generic", settle: "an Austrian clothing regulation of 1798-1805", re: /Grenz/, V: 1, D: 2, A: 0 },
  { id: "vines", q: "Whether vines stood at Telnitz and at Stare Vinohrady in 1805", from: ["U14", "SOURCE_NOTE"], where: "SOURCE_NOTE.body[5]; the land cover", shown: "the land cover; the sources sheet",
    settle: "answered for Telnitz in part by readings already registered: Stutterheim (A) has vineyards with a broad ditch round the village (C6.4, S8.13), as Sokolov (S8.3); Stare Vinohrady's are not read", re: /vineyard|vines/i, V: 2, D: 2, A: 0 },
  { id: "garden", q: "The Austerlitz garden's planting in 1805", from: ["U06", "E.3"], where: "docs/STAGE8_SPEC.md 21.7, 21.9", shown: "yes: its rows drawn as a convention", settle: "the château's garden plans", re: /garden/i, V: 1, D: 2, A: 0 },
  { id: "schoenhals-height", q: "On which side of the road Schönhals's height lay", from: ["U09", "E.3"], where: "docs/STAGE8_SPEC.md 21.9", shown: "no; moot in the drawing", settle: "the first military survey with Schönhals's text", re: /Schönhals's height/, V: 0, D: 0, A: 1 },
  { id: "brook-offsets", q: "Kienmayer's and Langeron's anchors against the corrected brook (Kienmayer@7, Langeron@2), and Caffarelli's late separation from Bagration", from: ["U31", "U32", "U33", "CL-HIS-08", "CL-HIS-09"], where: "WP-03 (docs/ROADMAP_FINAL_AUDIT.md)", shown: "yes: the drawn tracks",
    settle: "WP-03's review of the anchors against their readings", re: /Kienmayer|Caffarelli/, V: 2, D: 2, A: 1 },
  { id: "terrain-limits", q: "The terrain model's limits: reverse stream gradients, and the chapel's height not showing the Satschan pond's centre", from: ["U34", "U35", "SOURCE_NOTE", "CL-GEO-01"], where: "SOURCE_NOTE.body[5]; WP-04b", shown: "the sources sheet; the drawn ground",
    settle: "a refit against terrain data (WP-04b); Lejeune's knoll identified", re: /reverse gradient|knoll/i, V: 1, D: 2, A: 1 }
];

function main() {
  const inv = JSON.parse(fs.readFileSync(path.join(ROOT, "docs", "step4-evidence", "inventory.json"), "utf8"));
  const csv = fs.readFileSync(path.join(ROOT, "docs", "final-audit-chatgpt-evidence", "unresolved-questions.csv"), "utf8").trim().split("\n").slice(1)
    .map(l => { const m = /^(U\d+),([^,]+|"[^"]*"),/.exec(l); return m ? { id: m[1], q: m[2].replace(/^"|"$/g, "") } : null; }).filter(Boolean);
  const covered = new Set([].concat(...Q.map(x => x.from)).filter(f => /^U\d+$/.test(f)));
  const missing = csv.filter(u => !covered.has(u.id)).map(u => u.id);
  const rows = Q.map(x => {
    const S = inv.rows.filter(r => x.re.test((r.label ? r.label + " " : "") + r.text)).length;
    const unchecked = inv.rows.filter(r => r.claim === "unchecked" && x.re.test((r.label ? r.label + " " : "") + r.text)).length;
    return Object.assign({}, x, { S, unchecked, score: x.V + x.D + x.A });
  }).sort((a, b) => (b.score - a.score) || (b.S - a.S) || (a.id < b.id ? -1 : 1));
  const q = t => String(t).replace(/\|/g, "\\|");
  const L = ["# WP-15: the open historical questions, ranked by interpretive impact", "",
    "Generated by `node tools/wp15/open-questions.js`; never edited by hand. The final audits' Stage 4, alongside track (`docs/ROADMAP_FINAL_AUDIT.md`,",
    "WP-15; ChatGPT's CG-F03). It merges ChatGPT's 35 open questions (`docs/final-audit-chatgpt-evidence/unresolved-questions.csv`, U01-U35), the",
    "audit's section E.3 (`docs/FINAL_AUDIT_POST_STAGE8.md`) and `SOURCE_NOTE`'s open questions (`data.js`, `SOURCE_NOTE.body[5]`), duplicates",
    "merged (each row names what it merges), with four questions WP-15's first batch found. \"Still unresolved\" is an acceptable outcome: nothing",
    "here is settled by this list; where a reading already registered answers part of a question, the row says so.", "",
    "## The criteria", "",
    "- **V, what a visitor is shown that depends on it**: 3 the first screen, the opening, the tour or a phase lede; 2 an event, the caption,",
    "  the Command tab or a dossier; 1 the sources sheet only; 0 the records only.",
    "- **D, whether the drawing takes a side**: 2 the map draws one answer (a position, a track, a timing, the ground); 1 only the text takes a",
    "  side; 0 neither.",
    "- **A, the battle's argument**: 2 it bears on the turning points (the plateau, the Allied left's ruin, the Guards' fight, the end); 1 local;",
    "  0 presentation only.",
    "- **S, the statements that depend on it**: the inventory's statements whose text matches the row's pattern (computed; a rough measure,",
    "  shown with how many of them are still unchecked).",
    "- **Rank**: V + D + A, highest first, then S. V, D and A are judgements, written out with their reasons in `tools/wp15/open-questions.js`.", "",
    "ChatGPT's 35 are all merged into the rows below" + (missing.length ? " but " + missing.join(", ") : "") + ".", "",
    "| rank | question | merges | V | D | A | score | S (unchecked) | where the records keep it | shown to a visitor | what would settle it |",
    "|---|---|---|---|---|---|---|---|---|---|---|"];
  rows.forEach((r, i) => L.push("| " + (i + 1) + " | " + q(r.q) + " | " + q(r.from.join(", ")) + " | " + r.V + " | " + r.D + " | " + r.A + " | " + r.score + " | " +
    r.S + " (" + r.unchecked + ") | " + q(r.where) + " | " + q(r.shown) + " | " + q(r.settle) + " |"));
  L.push("", "The patterns behind S, for checking:", "");
  rows.forEach(r => L.push("- `" + r.id + "`: `" + String(r.re) + "`"));
  L.push("");
  return { md: L.join("\n") + "\n", missing };
}

if (require.main === module) {
  const { md, missing } = main();
  if (missing.length) { console.error("not merged: " + missing.join(", ")); process.exit(1); }
  if (process.argv.includes("--check")) { const ok = fs.existsSync(OUT) && fs.readFileSync(OUT, "utf8") === md; console.log(ok ? "open questions current" : "OUT OF DATE: " + path.relative(ROOT, OUT)); process.exit(ok ? 0 : 1); }
  fs.writeFileSync(OUT, md); console.log("wrote " + path.relative(ROOT, OUT) + ": " + Q.length + " questions");
}
