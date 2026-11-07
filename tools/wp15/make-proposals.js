/* WP-15's first batch (docs/ROADMAP_FINAL_AUDIT.md; finding CL-SRC-10, ChatGPT CG-F02): the proposed data changes, written as
   docs/wp15-evidence/proposals.json and proposals.md. The batch's content (each statement's proposed claim, its readings and any
   correction) is written out below by hand, from the readings of docs/wp15-evidence/readings.md (S8) and the registered readings named;
   everything a source file can give is computed here, never typed: each statement's text, label, file, line, its hash
   (tools/step4/statements.js hashOf, the hash narrative.js's h holds), its tier, group and rank (tools/wp15/tiers.js), and a corrected
   statement's hash. Nothing in the repository's sources is changed: tools/wp15/apply-proposals.js applies the proposals to a copy.
     node tools/wp15/make-proposals.js           write the two files
     node tools/wp15/make-proposals.js --check   exit 1 if either file differs from what this script writes now */
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..", ".."), OUT = path.join(ROOT, "docs", "wp15-evidence");
const { statements, hashOf } = require(path.join(ROOT, "tools", "step4", "statements.js"));
const T = require("./tiers.js");

/* the readings: rd -> its source key, as the registers declare them (test.js's own parse, repeated) */
function registers() {
  const REG = new Map();
  ["docs/step2-evidence/readings.md", "docs/step4-evidence/readings.md", "docs/wp15-evidence/readings.md"].forEach(f => {
    const p = path.join(ROOT, f); if (!fs.existsSync(p)) return; let sec = null, cur = null;
    fs.readFileSync(p, "utf8").split("\n").forEach(l => { let m;
      if (/^## /.test(l)) { m = /^## [\w.]+ `([\w.-]+)`/.exec(l); sec = m ? m[1] : null; cur = null; }
      else if ((m = /^### [\w.]+ `([^`]+)`/.exec(l))) { cur = { id: m[1], src: sec, file: f }; REG.set(m[1], cur); }
      else if (/^#/.test(l)) cur = null;
      else if (cur && (m = /^- \*\*source\*\*: `([\w.-]+)`/.exec(l))) cur.src = m[1]; });
  });
  return REG;
}

/* ---- the batch: 20 statements of tier 1 ----
   outcome "claim": a claim for the statement as it stands; "correction": the statement as it stands stays unchecked, and a correction
   is proposed with the claim its corrected text would carry (applied by the verifier only where appliedForTest). Reading ids in NEW are
   this batch's (docs/wp15-evidence/readings.md, S8); REREAD are registered readings read again here on their page images; the rest are
   registered readings cited as their registers give them, not re-read here. */
const NEW = new Set(["sokolov2006.p35.armies-on-the-day", "sokolov2006.p36.allies-and-orders", "sokolov2006.p36.telnitz-hill",
  "sokolov2006.p200.allied-totals", "sokolov2006.p183-184.v-corps-17e", "materialien1806.p102-103.columns-bagration",
  "materialien1806.p106.retreat-hodjegitz", "mikhailovsky1846.p216-217.route-de-vienne", "mikhailovsky1846.p232-234.dispositions-night",
  "mikhailovsky1846.p243.buxhowden-telnitz", "mikhailovsky1846.p253.order-to-retire", "stutterheim1806de.p39-41.krzenowitz-defiles",
  "stutterheim1806de.p50-51.zwey-mahl", "alombert4_1908.p732.suchet-17e", "stutterheim1806de.p16-27.guard-8500",
  "mikhailovsky1846.p193.guard-8500", "corr11_1863.p447-448.tourner-prendre"]);
const REREAD = new Set(["sokolov2006.p193.guard-totals-source", "sokolov2006.p183-185.v-and-i-corps", "sokolov2006.p194.kienmayer",
  "schoenhals1873.p177.kienmayer", "schoenhals1873.p178.lich-bagration-recap", "mat1806.p101-106.disposition", "stut1806de.p49-52.telnitz",
  "stutterheim1806de.p50-51.telnitz-moerderisch", "stutterheim1806de.p71.bagration-posorsitz", "corr11.9541.p451.guard-one",
  "corr11_1863.p451.guard-centre-reserve", "rapp1823.p60-61.guard-charge", "marbot1891.p262.guard-descends", "md1844.p181.fourth-column",
  "thieb.p457.fog", "corr11.p448.cette-idee"]);

const R = (src, at, rd) => ({ src, at, rd });
const BATCH = [
  { ref: "PHASES[#0].lede", outcome: "claim",
    claim: { cl: "attributed", by: [
      R("marbot1891", "t. I, p. 259", "marbot.p259.trap"),
      R("stutterheim1806de", "pp. 39-41", "stutterheim1806de.p39-41.krzenowitz-defiles"),
      R("materialien1806", "pp. 101-106", "mat1806.p101-106.disposition"),
      R("materialien1806", "pp. 102-103", "materialien1806.p102-103.columns-bagration"),
      R("mikhailovsky1846", "pp. 232-234", "mikhailovsky1846.p232-234.dispositions-night"),
      R("sokolov2006", "t. II, p. 36", "sokolov2006.p36.allies-and-orders"),
      R("materialien1806", "p. 109", "mat1806.p109.delivery"),
      R("thiebault3_1894", "t. III, p. 457", "thieb.p457.fog")],
      note: "Marbot calls the thin right a trap; Stutterheim has the French draw their outposts back to the villages on the stream and the Allied headquarters at Krzenowitz; Mikhailovsky-Danilevsky has Weyrother explain the disposition to the column chiefs at Kutuzov's toward the middle of the night, before its Russian translation, and Sokolov has many commanders understand their routes poorly; the disposition sends four of its five columns against the French right by villages, not by a bearing, so south-west is this map's. Thiébault has the fog hide the French in the valleys." },
    why: "Each part of the lede rests on a reading made on a page image, but for three of its words. 'Read out ... after midnight' is this map's precision for Mikhailovsky-Danilevsky's account (Weyrother explained the disposition on a plan of the ground toward the middle of the night), which the note gives; the place is Kutuzov's quarters, the headquarters at Krzenowitz in Stutterheim; 'south-west' is this map's bearing. Thiébault's p. 457, read again here for the fog, also has Napoleon say on 21 November that he would refuse his right by drawing it back toward Brünn (not part of the registered quotation)." },
  { ref: "TOUR[0].x", outcome: "claim",
    claim: { cl: "attributed", by: [R("stutterheim1806de", "pp. 39-41", "stutterheim1806de.p39-41.krzenowitz-defiles")],
      note: "Stutterheim has the Allies on the heights between Aujest, Pratzen and Holubitz and the defiles of Telnitz, Sokolnitz and Schlapanitz between the two armies; he names the stream's defiles, not the stream. The field's breadth is measured on this map, from the Santon to Telnitz, and the colours are its convention." },
    why: "The geography is Stutterheim's (A). 'Ten kilometres' is the distance from the Santon to Telnitz in GEOREF's frame, 10.15 km (derived here with GEOREF.kmBetween); 'open Moravian farmland' is not in a passage read." },
  { ref: "TOUR[5].x", outcome: "claim",
    claim: { cl: "attributed", by: [
      R("corr11_1863", "no. 9541, p. 451", "corr11.9541.p451.guard-one"),
      R("thiebault3_1894", "t. III, p. 457", "thieb.p457.fog"),
      R("mikhailovsky1844", "p. 181", "md1844.p181.fourth-column"),
      R("stutterheim1806de", "pp. 60-61", "stut.p60-61.nine-pratzen")],
      note: "The 30th Bulletin sends Soult onto the heights of Pratzen with Vandamme's and Saint-Hilaire's divisions and says no man of the reserve, the Guard's battalions and the grenadiers, was engaged; Thiébault has the fog hide them in the valley; Stutterheim and Mikhailovsky-Danilevsky have the 4th Column still on the plateau. The hour is this map's, inside the range the sources read give (the climb's event names each side)." },
    why: "The opening's second step. Its hour is the map's choice inside a disputed range (EVENTS[#soult].dispute, since the final audits' Stage 2, names Ségur's, Thiébault's, Stutterheim's and Schönhals's hours); the note says so without a clock time, as test.js requires." },
  { ref: "TOUR[6].x", outcome: "correction",
    current: "Mikhailovsky-Danilevsky has Langeron learn from Kamensky's report, as he neared the Goldbach, that the French were climbing the heights, and Kutuzov order Buxhowden to retire with the three columns (S8.11): 'will not learn what has happened behind them until about noon' is not true of all Buxhowden's columns, and no reading gives the hour Buxhowden himself learned it. The first sentence is the Bulletin's (C1.15: the enemy's left cut off).",
    correction: { file: "analysis.js",
      from: "Buxhowden's columns are still attacking westward and will not learn what has happened behind them until about noon.",
      to: "Buxhowden's columns are still attacking westward, Buxhowden himself waiting at Telnitz for their success while the fight behind them goes on.",
      newText: "With the plateau gone the Allied army is in two halves that can no longer help one another. Buxhowden's columns are still attacking westward, Buxhowden himself waiting at Telnitz for their success while the fight behind them goes on.",
      appliedForTest: true,
      claim: { cl: "attributed", by: [
        R("corr11_1863", "no. 9541, p. 451", "corr11.9541.p451.guard-one"),
        R("mikhailovsky1846", "p. 243", "mikhailovsky1846.p243.buxhowden-telnitz"),
        R("mikhailovsky1846", "p. 253", "mikhailovsky1846.p253.order-to-retire")],
        note: "The 30th Bulletin has the Allied left cut off before the fighting had lasted an hour; Mikhailovsky-Danilevsky has Buxhowden wait at Telnitz with Dokhturov as the fight near Pratzen began behind his columns, Langeron told by Kamensky's report that the French were climbing the heights, and Kutuzov order Buxhowden to retire." } },
    why: "The opening's third step. The same claim stands in ANALYSIS[#cut].text and COMMAND.al[\"7\"][0] (outside the batch, listed below); a data task changes them together, and re-measures the opening's caption fit, since TOUR[6].x is the opening's text (decision 115)." },
  { ref: "TOUR[7].x", outcome: "claim",
    claim: { cl: "interpretation", by: [
      R("marbot1891", "t. I, p. 262", "marbot1891.p262.guard-descends"),
      R("schoenhals1873", "p. 168", "schoen.p168.artillery-iv-garde"),
      R("materialien1806", "p. 105", "materialien1806.p105.retraite-kobelnitz"),
      R("materialien1806", "p. 106", "materialien1806.p106.retreat-hodjegitz")],
      note: "Marbot has the Emperor come down from the Pratzen with Soult's corps and the Guard and take the Allied columns in the rear while Davout attacks them in front; Schönhals has the guns of IV Corps and of the Guard on the height above the retreat. That the neck of dry ground at Augezd was a way out is this map's reading: the disposition's retreat for the left ran through Kobelnitz and Puntowitz, and the army's, should the attack fail outright, on Niemtschan, Hodjegitz and Herspitz. The ninety degrees are this map's geometry." },
    why: "The opening's last step. Its first sentence is in the sources; its second is the reading PHASES[#8].lede already calls this map's ('This map reads it as a way left open'), so the claim is this map's reading, with the readings that bound it." },
  { ref: "TOUR[1].x", outcome: "claim",
    claim: { cl: "attributed", by: [
      R("materialien1806", "pp. 101-106", "mat1806.p101-106.disposition"),
      R("materialien1806", "pp. 102-103", "materialien1806.p102-103.columns-bagration"),
      R("mikhailovsky1846", "pp. 216-217", "mikhailovsky1846.p216-217.route-de-vienne"),
      R("mikhailovsky1846", "pp. 232-234", "mikhailovsky1846.p232-234.dispositions-night")],
      note: "The disposition, Weyrother's as the Materialien's editor prints it, sends four columns against the French right, the 4th among them, and none to hold the plateau; it names villages, not a bearing, so south-west is this map's. Cutting the road to Vienna is the aim Mikhailovsky-Danilevsky gives the Allied command's resolution after Wischau, not a phrase of the disposition." },
    why: "The tour's second stop." },
  { ref: "PHASES[#1].lede", outcome: "claim",
    claim: { cl: "attributed", by: [
      R("stutterheim1806de", "pp. 49-52", "stut1806de.p49-52.telnitz"),
      R("stutterheim1806de", "pp. 50-51", "stutterheim1806de.p50-51.telnitz-moerderisch"),
      R("stutterheim1806de", "pp. 50-51", "stutterheim1806de.p50-51.zwey-mahl"),
      R("sokolov2006", "t. II, p. 35", "sokolov2006.p35.armies-on-the-day"),
      R("sokolov2006", "t. II, p. 36", "sokolov2006.p36.telnitz-hill"),
      R("davout1885", "t. I, no. 123, pp. 192-193", "davout1885.no123.p192-193.plus-belle-resistance")],
      note: "Stutterheim has the 3rd Line and two battalions of skirmishers in Telnitz and its vineyards, the height before the village taken, the village entered and lost again, and the I Column slow to come up; Sokolov puts the 3rd Line in Legrand's division; Davout reports the village taken and retaken. 'Thin' and 'the southernmost village on the Goldbach' are this map's words." },
    why: "Every part is in a reading made on a page image but the two words the note names." },
  { ref: "PHASES[#2].lede", outcome: "correction",
    current: "'the 4th Column, which was meant to replace the troops leaving the heights' is contradicted by the disposition read: the 4th Column too marches off by the left through the places named and aligns with the first three (S8.6), toward Kobelnitz (Mikhailovsky-Danilevsky, S8.9, C1.9); and 'the pheasantry' is in none of the accounts read (this batch searched the text layers of the sixteen works it downloaded for 'Fasan', 'faisan' and 'фазан' and found none; the audit after Stage 8 found it in none of the 1805-1806 texts, CL-GEO-02). This map draws the pheasantry from the cadastral sketch of 1825 (decision 259 (a)); whether it stood, and was enclosed, in 1805 is among SOURCE_NOTE's open questions.",
    correction: { file: "data.js",
      from: "Langeron and Przybyszewski attack Sokolnitz village, its castle and the pheasantry beyond. On the plateau the 4th Column, which was meant to replace the troops leaving the heights, is still standing still: Liechtenstein's cavalry has cut across its line of march. A gap opens between it and the 3rd Column.",
      to: "Langeron and Przybyszewski attack Sokolnitz village and its castle. On the plateau the 4th Column, which the disposition sends down after them toward Kobelnitz, is still standing: Liechtenstein's cavalry has crossed its line of march, and Kutuzov holds it there. A gap opens between it and the 3rd Column.",
      newText: "Langeron and Przybyszewski attack Sokolnitz village and its castle. On the plateau the 4th Column, which the disposition sends down after them toward Kobelnitz, is still standing: Liechtenstein's cavalry has crossed its line of march, and Kutuzov holds it there. A gap opens between it and the 3rd Column.",
      appliedForTest: true,
      claim: { cl: "attributed", by: [
        R("materialien1806", "pp. 102-103", "materialien1806.p102-103.columns-bagration"),
        R("mikhailovsky1846", "p. 232", "mikhailovsky1846.p232-234.dispositions-night"),
        R("mikhailovsky1846", "p. 243", "mikhailovsky1846.p243.buxhowden-telnitz"),
        R("mikhailovsky1844", "p. 181", "md1844.p181.fourth-column"),
        R("stutterheim1806de", "pp. 60-61", "stut.p60-61.nine-pratzen")],
        note: "The disposition sends the 4th Column, too, down through the places named and into line with the first three; Mikhailovsky-Danilevsky has it held first by Liechtenstein's cavalry passing before it and then by Kutuzov standing still, and the French driven from the castle; Stutterheim has the 3rd Column already off the height when the 4th reached the ground it had held." } },
    why: "The phase title (by class) and nine other statements name the pheasantry (listed below); this correction drops it from the lede only. The data task may instead keep it as 'and, as this map draws it from the survey of 1825, the pheasantry beyond'." },
  { ref: "FORMATIONS.gqg.army.men", outcome: "claim",
    claim: { cl: "attributed", by: [
      R("sokolov2006", "t. II, p. 35", "sokolov2006.p35.armies-on-the-day"),
      R("sokolov2006", "t. II, p. 193", "sokolov2006.p193.guard-totals-source"),
      R("duffy1977", "the narrative", "duffy1977.textlayer.oob")],
      note: "Sokolov gives about 72,500 to 73,000 with the staffs, the reserve artillery and the trains, and 72,500 in his table, estimates from the returns of 22 November; Duffy's nominal 73,000 to 75,000 is read on his text layer only." },
    why: "The French army card's total. The card's 139 guns are Duffy's text layer's figure; Sokolov gives 140 (S8.1): a figure, not a narrative statement, listed below." },
  { ref: "FORMATIONS.gqg.army.src", outcome: "claim",
    claim: { cl: "attributed", by: [
      R("sokolov2006", "t. II, p. 193", "sokolov2006.p193.guard-totals-source"),
      R("sokolov2006", "t. II, p. 35", "sokolov2006.p35.armies-on-the-day"),
      R("duffy1977", "the narrative", "duffy1977.textlayer.oob")],
      note: "Sokolov's table gives 72,500 for 2 December, his text about 72,500 to 73,000; Duffy's nominal figure is read on his text layer only." },
    why: "The source line beside the French total." },
  { ref: "FORMATIONS.ahq.army.men", outcome: "claim",
    claim: { cl: "interpretation", by: [
      R("schoenhals1873", "p. 178", "schoenhals1873.p178.lich-bagration-recap"),
      R("sokolov2006", "t. II, p. 36", "sokolov2006.p36.allies-and-orders"),
      R("sokolov2006", "t. II, p. 200", "sokolov2006.p200.allied-totals"),
      R("stutterheim1806de", "pp. 16, 27", "stutterheim1806de.p16-27.guard-8500"),
      R("duffy1977", "the narrative", "duffy1977.textlayer.oob")],
      note: "This map's working figure, which no source read prints: Schönhals's table sums to 82,575; Sokolov gives about 80,000 present, about 84,000 with the artillery and the staffs; Stutterheim's order of march of 27 November sums to 82,040; Duffy's 80,000 to 87,000 is read on his text layer only." },
    why: "Its source line already calls it this map's working figure (since the final audits' Stage 2); the claim says the same, with the figures read beside it." },
  { ref: "FORMATIONS.ahq.army.src", outcome: "correction",
    current: "The line's only source figure is Duffy's, read on his text layer only (S6.7), so no claim can rest on it; the totals read on page images (Schönhals's 82,575, C5.2; Sokolov's about 84,000 with the artillery and the staffs, S8.4) are not on it.",
    correction: { file: "data.js",
      from: "src:\"this map's working figure; Duffy 1977, 80,000-87,000 with 278 pieces\"",
      to: "src:\"this map's working figure; Schönhals 1873, 82,575, his table's sum; Sokolov 2006, about 84,000 with the artillery and the staffs; Duffy 1977, 80,000-87,000 with 278 pieces\"",
      newText: "this map's working figure; Schönhals 1873, 82,575, his table's sum; Sokolov 2006, about 84,000 with the artillery and the staffs; Duffy 1977, 80,000-87,000 with 278 pieces",
      appliedForTest: true,
      claim: { cl: "attributed", by: [
        R("schoenhals1873", "p. 178", "schoenhals1873.p178.lich-bagration-recap"),
        R("sokolov2006", "t. II, p. 200", "sokolov2006.p200.allied-totals"),
        R("duffy1977", "the narrative", "duffy1977.textlayer.oob")],
        note: "Duffy's figures are read on his text layer only." } },
    why: "The army card's 278 guns are Duffy's text layer's figure too; Sokolov gives 318 at the start and 330 after midday (S8.4): listed below." },
  { ref: "FORMATIONS.c_v.strengthNote", outcome: "claim",
    claim: { cl: "attributed", by: [
      R("duffy1977", "p. 181", "duffy1977.p179-185.oob"),
      R("sokolov2006", "t. II, p. 193", "sokolov2006.p193.guard-totals-source"),
      R("sokolov2006", "t. II, pp. 183-184", "sokolov2006.p183-184.v-corps-17e")] },
    why: "Both figures as their sources print them; Duffy's page is read on the owner's photographs (S6.8), not re-read here." },
  { ref: "FORMATIONS.buxhowden.strengthNote", outcome: "claim",
    claim: { cl: "derived", by: [
      R("schoenhals1873", "p. 178", "schoenhals1873.p178.lich-bagration-recap"),
      R("schoenhals1873", "p. 177", "schoenhals1873.p177.kienmayer"),
      R("sokolov2006", "t. II, p. 194", "sokolov2006.p194.kienmayer"),
      R("sokolov2006", "t. II, pp. 195-197", "sokolov2006.p195-197.columns")],
      note: "The two sums are this map's arithmetic over the sources' rows: Schönhals's recapitulation, 6,340, 12,730, 10,840 and 8,570; Sokolov's 3,440 and 2,940, 13,800 and 200, 10,840 and 300, and 8,000." },
    why: "38,480 and 39,520 checked here: 6,340 + 12,730 + 10,840 + 8,570 = 38,480; 3,440 + 2,940 + 13,800 + 200 + 10,840 + 300 + 8,000 = 39,520 (derived). Sokolov's pp. 195-197 are Stage 2's reading (S6.6), not re-read here." },
  { ref: "FORMATIONS.bag.strengthNote", outcome: "claim",
    claim: { cl: "attributed", by: [
      R("schoenhals1873", "p. 178", "schoenhals1873.p178.lich-bagration-recap"),
      R("duffy1977", "p. 184", "duffy1977.p179-185.oob")],
      note: "Schönhals's table gives the corps no guns (its horse artillery without a count); the 42 are Duffy's." },
    why: "Schönhals's 13,000 read again at 600 dpi from the item's PDF; Duffy's p. 184 is read on the owner's photographs (S6.8), not re-read here." },
  { ref: "FORMATIONS.constantine.strengthNote", outcome: "claim",
    claim: { cl: "attributed", by: [
      R("duffy1977", "pp. 184-185", "duffy1977.p184-185.guard-oob"),
      R("duffy1977", "pp. 184-185", "duffy1977.p179-185.oob"),
      R("stutterheim1806de", "pp. 16, 27", "stutterheim1806de.p16-27.guard-8500"),
      R("mikhailovsky1846", "p. 193", "mikhailovsky1846.p193.guard-8500")],
      note: "Duffy's pages are read on the owner's photographs. The narrative accounts read give about 8,500: Stutterheim has the Guard 10,000 strong, 8,500 of them under arms, on its arrival at Olmütz, and 8,500 in the order of march of 27 November; Mikhailovsky-Danilevsky has it arrive 8,500 strong. Smith is cited, not read." },
    why: "Duffy's figures as S5.7 and S6.8 read them on the owner's photographs (not re-read here: the photographs are not committed). 'Narrative accounts often give about 8,500' had no reading until this batch: Stutterheim's and Mikhailovsky-Danilevsky's 8,500 are read here on their page images; both are November figures, not 2 December's." },
  { ref: "FORMATIONS.caffarelli.strengthNote", outcome: "correction", extra: true,
    current: "'about 6,700' is bare and above Sokolov's return of 22 November, 6,498 under arms, from which he presumes 6,500 on 2 December (S8.5, C5.9): a strength that could only have fallen by 2 December. No source read gives 6,700.",
    correction: { file: "data.js",
      from: "strength:6700, strengthNote:\"about 6,700\",",
      to: "strength:6700, strengthNote:\"about 6,700, this map's working figure, not from a source read: above Sokolov's return of 22 November, 6,498 under arms, from which he presumes 6,500 on 2 December (t. II, p. 184)\",",
      newText: "about 6,700, this map's working figure, not from a source read: above Sokolov's return of 22 November, 6,498 under arms, from which he presumes 6,500 on 2 December (t. II, p. 184)",
      appliedForTest: true,
      claim: { cl: "attributed", by: [
        R("sokolov2006", "t. II, p. 184", "sokolov2006.p183-184.v-corps-17e"),
        R("sokolov2006", "t. II, p. 184", "sokolov2006.p183-185.v-and-i-corps")] } },
    why: "Two options for the data task. (a), recommended as the final audits' Stage 2 rule reads ('where Sokolov gives only a return of 22 November, the map draws no more than that return'; where the map's figure has no source, Sokolov's estimate): draw 6,500 with the note '6,500, Sokolov's estimate for 2 December: 6,498 under arms on 22 November (t. II, p. 184)'. V Corps' children would then be 12,500 against its 12,700, so test.js's parent rule holds; a drawn strength re-ranks the counters, so the motion block is re-measured as in Stage 2, on the owner's word. (b), applied by the verifier because it changes no drawn figure: keep 6,700 and say what it is (the text above)." },
  { ref: "FORMATIONS.suchet.strengthNote", outcome: "correction", extra: true,
    current: "The 17e légère's membership is read (Alombert and Colin, S8.14; Sokolov, S8.1, S8.5), but 'about 6,000' is not in a source read and is below Sokolov's 6,827 under arms on 22 November and his 7,000 presumed for 2 December (S8.5); the note does not say it is this map's.",
    correction: { file: "data.js",
      from: "strengthNote:\"about 6,000, including the detachment on the Santon:",
      to: "strengthNote:\"about 6,000, this map's working figure, not from a source read (Sokolov counts 6,827 under arms on 22 November, the 17e Légère's 1,450 among them, and presumes 7,000 on 2 December, t. II, p. 183), including the detachment on the Santon:",
      newText: "about 6,000, this map's working figure, not from a source read (Sokolov counts 6,827 under arms on 22 November, the 17e Légère's 1,450 among them, and presumes 7,000 on 2 December, t. II, p. 183), including the detachment on the Santon: the 17e Légère, of this division (numbered there the 3rd of V Corps) in the French situation of 28 October 1805 (Alombert and Colin, t. IV, p. 732)",
      appliedForTest: true,
      claim: { cl: "attributed", by: [
        R("sokolov2006", "t. II, p. 183", "sokolov2006.p183-184.v-corps-17e"),
        R("alombert4_1908", "t. IV, p. 732", "alombert4_1908.p732.suchet-17e"),
        R("sokolov2006", "t. II, p. 35", "sokolov2006.p35.armies-on-the-day")],
        note: "The situation's date, 28 October, is this note's; the page read gives the division's regiments, not its date." } },
    why: "By Stage 2's rule Suchet would draw Sokolov's 7,000; with Caffarelli's 6,500 V Corps' children would be 13,500 against Duffy's 12,700 for the corps, which test.js's parent rule forbids: so the drawn figures of V Corps are one decision (the corps at Sokolov's 13,800, or the divisions kept as working figures), put to the owner with the data task. The verifier applies the labelling only." },
  { ref: "COMMAND.al[\"0\"][3]", outcome: "claim",
    claim: { cl: "attributed", by: [
      R("materialien1806", "pp. 101-106", "mat1806.p101-106.disposition"),
      R("materialien1806", "pp. 102-103", "materialien1806.p102-103.columns-bagration"),
      R("mikhailovsky1846", "p. 232", "mikhailovsky1846.p232-234.dispositions-night"),
      R("stutterheim1806de", "p. 71", "stutterheim1806de.p71.bagration-posorsitz")],
      note: "The disposition sends four columns against the French right and has Bagration's advance guard hold its position, which Stutterheim has him hold long by Posoritz, on the highway; it names the columns' villages, not a bearing, so south-west is this map's." },
    why: "A row of the documented kind: with this claim it shows DOCUMENTED (decision of the final audits' Stage 2, CL-HIS-12)." },
  { ref: "COMMAND.al[\"0\"][4]", outcome: "claim",
    claim: { cl: "attributed", by: [
      R("corr11_1863", "no. 9541, pp. 447-448", "corr11_1863.p447-448.tourner-prendre"),
      R("corr11_1863", "no. 9541, p. 448", "corr11.p448.cette-idee"),
      R("mikhailovsky1846", "pp. 216-217", "mikhailovsky1846.p216-217.route-de-vienne"),
      R("czartoryski1887", "t. I, p. 405", "czartoryski1887.p405.retreat")],
      note: "The 30th Bulletin has the Allied council mean to turn the French army and take it, and fear only that it would slip away; Czartoryski has the headquarters read a French retreat and expect no resistance; cutting the road to Vienna is the aim Mikhailovsky-Danilevsky gives the Allied resolution after Wischau." },
    why: "A row of the documented kind. The Bulletin reports the Allied council's intentions at second hand; Czartoryski's page is read partly on the text layer (C5.25), so the claim rests on the other readings." },
  { ref: "COMMAND.fr[\"6\"][1]", outcome: "claim",
    claim: { cl: "attributed", by: [
      R("corr11_1863", "no. 9541, p. 451", "corr11_1863.p451.guard-centre-reserve"),
      R("rapp1823", "p. 60", "rapp1823.p60-61.guard-charge")],
      note: "The 30th Bulletin has Napoleon order Bessières to the help of his right with the Guard; Rapp has the order given to him, to take the Mamelukes, two squadrons of chasseurs and one of grenadiers of the Guard." },
    why: "The row names the Bulletin's version; Rapp's is the note's. The data task may instead name both sides in the row and make it 'disputed'." },
  { ref: "COMMAND.al[\"5\"][1]", outcome: "correction",
    current: "A row of the documented kind ('ordered / doc'), but the reading has no order: Stutterheim has Bagration, after holding long by Posoritz, withdraw to the heights by Rausnitz as the Russian Guard left the heights behind Blasowitz, and receive an order only in the evening, to march to Austerlitz (C6.11, read again here).",
    correction: { file: "analysis.js",
      from: "[\"ordered\",\"doc\",\"A withdrawal on Rausnitz, covering the Allied right.\"]",
      to: "[\"ordered\",\"inf\",\"A withdrawal on Rausnitz, covering the Allied right. Inferred: Stutterheim has Bagration, after holding long by Posoritz, fall back on the heights by Rausnitz as the Russian Guard left the heights behind Blasowitz, and ordered to Austerlitz only in the evening; no order for the withdrawal itself is read.\"]",
      newLabel: "ordered / inf",
      newText: "A withdrawal on Rausnitz, covering the Allied right. Inferred: Stutterheim has Bagration, after holding long by Posoritz, fall back on the heights by Rausnitz as the Russian Guard left the heights behind Blasowitz, and ordered to Austerlitz only in the evening; no order for the withdrawal itself is read.",
      appliedForTest: true,
      claim: { cl: "interpretation", by: [R("stutterheim1806de", "p. 71", "stutterheim1806de.p71.bagration-posorsitz")],
        note: "That the withdrawal was ordered is this map's inference." } },
    why: "The row would show its claim's tag instead of DOCUMENTED (Stage 2's rule for the Command tab). The words 'in the evening' are no clock time for check:chronology's extractor, which a data task runs." }
];

/* ---- outside the batch: what its readings show of other statements and figures (for later batches and data tasks) ---- */
const OUTSIDE = [
  { what: "FORMATIONS.santon.strengthNote and FORMATIONS.santon.strength (1,600)", finding: "The 17e légère had 1,450 under arms on 22 November in Sokolov's table (S8.5); the map draws the Santon detachment at 1,600, citing a municipal history. By the final audits' Stage 2 rule the map draws no more than the return of 22 November. A data task (a drawn strength: the motion block re-measured on the owner's word)." },
  { what: "FORMATIONS.gqg.army.guns (139) and FORMATIONS.ahq.army.guns (278)", finding: "Both are Duffy's figures as his text layer gives them (S6.7). Read on page images: Sokolov's 140 French guns (S8.1) and, for the Allies, about 300 (S8.2), 318 at the start and 330 after midday (S8.4). Figures, not narrative statements; a data task." },
  { what: "ANALYSIS[#cut].text and COMMAND.al[\"7\"][0] ('until about noon', 'From about noon')", finding: "The same claim as TOUR[6].x; Mikhailovsky-Danilevsky has Langeron told by Kamensky's report as he neared the Goldbach, and Kutuzov order Buxhowden to retire (S8.11). To be corrected with TOUR[6].x." },
  { what: "COMMAND.al[\"8\"][0], PHASES[#8].lede, FEATURES[#augezd].why[0] (the disposition's retreat)", finding: "Accurate for the left (C6.20: through the Turas wood, Kobelnitz and Puntowitz), but the disposition also orders the whole army's retreat in the worst case on Niemtschan, Hodjegitz and Herspitz (S8.7), and Mikhailovsky-Danilevsky gives it as Kodiegitz on the road to Hungary (S8.9). C6.20's own 'settles' line ('the only retreat the disposition orders for the left') stands; a note could name the army's retreat too." },
  { what: "the pheasantry: PHASES[#2].title (by class), PHASES[#2].events[0], FORMATIONS.prz.role, FORMATIONS.prz.track[\"0\"].obj, FORMATIONS.prz.track[\"2\"].obj and .act, FEATURES[#sokolnitz].sub and .facts[0], PLANS.al.cols[3].ord, EVENTS[#sokolnitz].why, FEATURES[#sokolnitz].why[0]", finding: "No account read names a pheasantry (this batch's search of sixteen text layers; the audit's CL-GEO-02). The map draws it from the cadastral sketch of 1825. A data task decides whether the statements say so." },
  { what: "PHASES[#7].lede (examined, left for the next batch)", finding: "'supported by the Guard and the grenadier division' is disputed in the readings: Marbot has the Guard come down from the Pratzen (C3.c2, read again here), Ségur leaves the Guard on foot on the plateau (C3.12), and the 30th Bulletin says no man of the reserve was engaged (C3.5); no reading names the grenadiers' part. A correction naming the sides, then 'disputed'." },
  { what: "COMMAND.al[\"2\"][0] (the Tsar and Kutuzov, cited from the Russian Biographical Dictionary of 1903)", finding: "Mikhailovsky-Danilevsky (1844, p. 181, C1.9, read again here) gives the exchange in the ninth hour ('Михайло Ларіоновичъ! Почему не идете вы впередъ?'): an earlier source than the row's, in the table of works. Its continuation (p. 182) was not read; next batch." },
  { what: "the drawn sums against the army totals", finding: "The French corps drawn sum to 71,400 (derived) against the card's 'about 73,000'; the Allied to 85,715 (derived) against 'about 85,400'. The totals are working figures, not the sums; noted, not a finding against them." }
];

/* ---- bears on WP-03 (the main track's review); listed, not pursued ---- */
const WP03 = [
  { item: "the Russian Guard's positions 07:00-11:00", readings: "S8.12 (Stutterheim p. 39: on the evening of 1 December the Guard's reserve corps took post forward of Austerlitz, its left toward Krzenowitz and its right toward the Austerlitz-Brünn high road); S8.7 (the disposition, p. 106: behind Blasowitz and Kruh at daybreak, also C1.1); S8.9 (Mikhailovsky-Danilevsky p. 233: the Guard ready to reinforce Bagration); S8.2 (Sokolov p. 36: the Russian Guard formed a little west of Austerlitz)." },
  { item: "Legrand's route after 08:00 (Levasseur's brigade only?) and who held Sokolnitz village", readings: "S8.1 (Sokolov p. 35: at dawn Levasseur's brigade at Kobelnitz, Merle's at Sokolnitz and Telnitz); S8.10 (Mikhailovsky-Danilevsky p. 243: the French driven from the castle; Wimpfen's Podolia, Azov and Narva regiments the reserve on the Allied side of the stream)." },
  { item: "Kamensky's turn", readings: "S8.11 (Mikhailovsky-Danilevsky, French translation, p. 253: Kamensky reports to Langeron, as he nears the Goldbach, that the French are climbing the Pratzen heights and that the Phanagoria and Ryazhsk regiments cannot follow toward Sokolnitz; Kutuzov withdraws with Kamensky's brigade toward Hostieradek after ordering Buxhowden to retire)." },
  { item: "Liechtenstein's and the Guard's retreats", readings: "S8.7 (the disposition, p. 106: in the worst case the army retires on Niemtschan, Hodjegitz and Herspitz) and S8.9 (Mikhailovsky-Danilevsky p. 233: on Kodiegitz, on the road to Hungary); C6.11 (Stutterheim p. 71, read again here: Bagration to the Rausnitz heights as the Guard left the heights behind Blasowitz, behind Austerlitz in the evening)." }
];

function main() {
  const REG = registers();
  const S = statements(ROOT), byRef = new Map(S.map(s => [s.ref, s]));
  const inv = require(path.join(ROOT, "docs", "step4-evidence", "inventory.json"));
  const ranked = T.rank(inv.rows, T.sourceContext(ROOT)), rk = new Map(ranked.map(r => [r.ref, r]));
  const errs = [];
  const checkBy = (ref, by) => by.forEach(b => { const r = REG.get(b.rd);
    if (!r) errs.push(ref + ": reading " + b.rd + " is in no register"); else if (r.src !== b.src) errs.push(ref + ": reading " + b.rd + " is of " + r.src + ", not " + b.src); });
  const status = rd => NEW.has(rd) ? "new (S8), read on the page image" : REREAD.has(rd) ? "registered, read again here on the page image" : "registered, not re-read here";
  const out = BATCH.map((b, i) => {
    const s = byRef.get(b.ref), r = rk.get(b.ref);
    if (!s) { errs.push(b.ref + ": no such statement"); return null; }
    if (!b.extra && (!r || r.tier !== 1)) errs.push(b.ref + ": not tier 1 (mark it extra: true to propose it outside the batch)");
    if (r && r.claim !== "unchecked") errs.push(b.ref + ": not unchecked (" + r.claim + ")");
    const p = { n: i + 1, extra: !!b.extra, ref: b.ref, tier: r ? r.tier : null, group: r ? r.group : null, rank: r ? r.rank : null, class: s.cls, file: s.file, line: s.line,
      label: s.label, text: s.text, hash: hashOf(s.whole), outcome: b.outcome === "claim" ? "claim proposed" : "correction proposed", why: b.why || null };
    if (b.claim) { checkBy(b.ref, b.claim.by); p.claim = Object.assign({ h: p.hash, cl: b.claim.cl, by: b.claim.by }, b.claim.note ? { note: b.claim.note } : {}); }
    if (b.current) p.unresolved = b.current;
    if (b.correction) {
      const c = b.correction, src = fs.readFileSync(path.join(ROOT, c.file), "utf8"), n = src.split(c.from).length - 1;
      if (n !== 1) errs.push(b.ref + ": the correction's text occurs " + n + " times in " + c.file);
      const lab = c.newLabel !== undefined ? c.newLabel : s.label, whole = (lab ? lab + " / " : "") + c.newText;
      checkBy(b.ref, c.claim.by);
      p.correction = { file: c.file, from: c.from, to: c.to, newLabel: c.newLabel || null, newText: c.newText, appliedForTest: !!c.appliedForTest,
        claim: Object.assign({ h: hashOf(whole), cl: c.claim.cl, by: c.claim.by }, c.claim.note ? { note: c.claim.note } : {}) };
    }
    const ids = [...new Set([].concat(b.claim ? b.claim.by : [], b.correction ? b.correction.claim.by : []).map(x => x.rd))];
    p.readings = ids.map(id => ({ id, status: status(id) }));
    return p;
  }).filter(Boolean);
  /* the batch in rank order, then what was found on the way */
  out.sort((x, y) => (x.extra - y.extra) || (x.rank - y.rank)); out.forEach((p, i) => { p.n = i + 1; });
  const json = { batch: "WP-15, first batch (the final audits' Stage 4, alongside track)", register: "docs/wp15-evidence/readings.md",
    rules: "A claim is written as narrative.js's STATEMENT_CLAIMS writes it ({h, cl, by, note}); h is tools/step4/statements.js hashOf of the statement's label and text. A correction's claim carries the hash of the corrected statement. appearanceSources: none (every work cited is in APPEARANCE_SOURCES).",
    appearanceSources: {}, proposals: out, outsideBatch: OUTSIDE, bearsOnWP03: WP03 };
  return { json, errs, ranked };
}

function md(J) {
  const L = [], q = t => String(t).replace(/\|/g, "\\|");
  const B = J.proposals.filter(p => !p.extra), C = J.proposals.filter(p => p.correction);
  const js = c => "{h:\"" + c.h + "\", cl:\"" + c.cl + "\", by:[" + c.by.map(b => "{src:\"" + b.src + "\", at:\"" + b.at + "\", rd:\"" + b.rd + "\"}").join(", ") + "]" + (c.note ? ", note:" + JSON.stringify(c.note) : "") + "}";
  L.push("# WP-15's first batch: the proposed data changes", "",
    "Generated by `node tools/wp15/make-proposals.js` (with `proposals.json`); never edited by hand. The final audits' Stage 4, alongside track",
    "(`docs/ROADMAP_FINAL_AUDIT.md`, WP-15; finding CL-SRC-10, ChatGPT's CG-F02). **This track changes no data**: every change below is a",
    "proposal for a later data task (WP-01 or WP-03), which cites this evidence, moves `check:data`'s reference and records was and is in",
    "`CHANGELOG.md`. `node tools/wp15/apply-proposals.js` applies them to a copy of the sources, outside the repository, and runs that copy's",
    "`test.js` and `redteam.js` (its result: `apply-proposals.log`).", "",
    "## How the claims are chosen", "",
    "- The batch's " + B.length + " statements are tier 1's (`triage.md`): the first screen's lede, the opening's four steps, one more tour stop,",
    "  two phase ledes, eight headline strengths and four Command rows, chosen for content a source can check. Two statements of tier 3, the",
    "  strength notes of Suchet's and Caffarelli's divisions, are proposed beside the batch (*found on the way*): its readings showed them.",
    "- **attributed** (\"As a source tells it\") where the statement's substance is what the sources read say, as the project's sourced",
    "  narrative statements are claimed (no statement in the inventory is claimed \"fact\"; `CLAIM_WORDS`' \"fact\" would claim more than a",
    "  composite of several accounts supports); the works and a note in a visitor's words say which source says what, and what is this map's.",
    "- **interpretation** where the statement is this map's reading with sources bounding it (TOUR[7], the Allied working total).",
    "- **derived** where the statement is the map's arithmetic over figures the sources print (Buxhowden's wing).",
    "- **correction proposed** where a reading shows the statement wrong or over-precise: the statement as it stands stays unchecked, and the",
    "  corrected text is given with the claim it would carry. The verifier applies the corrections marked applied-for-test (all " + C.length + " here:",
    "  each changes text only, no drawn figure) in a second run, to show that the corrected claims pass `test.js` too.",
    "- No note carries a clock time (`test.js`); where the hour is this map's, the note says so in words.", "",
    "## The outcomes", "", "| # | rank | statement | class | outcome | claim | readings (new / re-read / cited) |", "|---|---|---|---|---|---|---|");
  J.proposals.forEach(p => {
    if (p.extra && !J.proposals.some(x => x.extra && x.n < p.n)) L.push("| | | *found on the way, outside the batch:* | | | | |");
    const c = p.claim || (p.correction && p.correction.claim), cnt = k => p.readings.filter(r => r.status.startsWith(k)).length;
    L.push("| " + p.n + " | " + p.rank + " (" + p.group + ") | `" + q(p.ref) + "` | " + p.class + " | " + p.outcome + " | " + (p.claim ? p.claim.cl : "after correction: " + c.cl) + " | " +
      cnt("new") + " / " + p.readings.filter(r => /read again/.test(r.status)).length + " / " + p.readings.filter(r => /not re-read/.test(r.status)).length + " |");
  });
  L.push("");
  J.proposals.forEach(p => {
    L.push("## " + p.n + ". `" + p.ref + "`" + (p.extra ? " (found on the way: tier " + p.tier + ", outside the batch)" : ""), "",
      "- **where**: " + p.file + ":" + p.line + "; tier " + p.tier + ", group " + p.group + ", rank " + p.rank + " of the inventory; class " + p.class + ".",
      "- **as it stands**: " + (p.label ? "*" + p.label + "* / " : "") + p.text, "- **hash**: `" + p.hash + "`", "- **outcome**: " + p.outcome + ".");
    if (p.claim) L.push("- **proposed `STATEMENT_CLAIMS` entry**:", "", "  ```js", "  " + JSON.stringify(p.ref) + ": " + js(p.claim) + ",", "  ```", "");
    if (p.unresolved) L.push("- **as it stands, unresolved**: " + p.unresolved);
    if (p.correction) {
      const c = p.correction;
      L.push("- **proposed correction** (" + c.file + (c.appliedForTest ? "; applied by the verifier's second run" : "") + "):",
        "  - *was*: `" + q(c.from) + "`", "  - *is*: `" + q(c.to) + "`",
        "- **its claim, on the corrected text** (hash `" + c.claim.h + "`):", "", "  ```js", "  " + JSON.stringify(p.ref) + ": " + js(c.claim) + ",", "  ```", "");
    }
    L.push("- **readings**: " + p.readings.map(r => "`" + r.id + "` (" + r.status + ")").join("; ") + ".");
    if (p.why) L.push("- **why**: " + p.why);
    L.push("");
  });
  L.push("## Still unresolved", "",
    "No statement of the batch is left without an outcome. " + C.length + " statements stay unchecked as they stand (their corrections above are",
    "proposals: " + C.map(p => "`" + p.ref + "`").join(", ") + "), and two statements of tier 1 were examined and left for the next batch",
    "(below, *Outside the batch*: PHASES[#7].lede and COMMAND.al[\"2\"][0]).",
    "The searches made for each: the text layers of the sixteen works downloaded (`sokolov2006`, `materialien1806`, `stutterheim1806de`,",
    "Stutterheim's French text (archive.org `labatailledaust00stutgoog`), `schoenhals1873`, `corr11_1863`, `rapp1823`, `thiebault3_1894`, `segur1877`, `mikhailovsky1846`,",
    "`davout1885`, `kutuzov1951`, `marbot1891`, `thiers1847`, `alombert4_1908`, `savary1828`), by archive.org's full-text search and the",
    "`_djvu.txt` files, then the page images; `mikhailovsky1844` by its IIIF images. Duffy (1977) was not readable here (in copyright, a lending",
    "item); his figures stand as S6.7 (text layer) and S6.8 (the owner's photographs) register them.", "",
    "## Outside the batch", "");
  J.outsideBatch.forEach(o => L.push("- **" + o.what + "**: " + o.finding));
  L.push("", "## Bears on WP-03", "",
    "Listed for the main track (WP-03), which has its own research; this track did not look for these. Each reading is in this register (S8)",
    "or read again here.", "");
  J.bearsOnWP03.forEach(o => L.push("- **" + o.item + "**: " + o.readings));
  L.push("");
  return L.join("\n");
}

if (require.main === module) {
  const { json, errs } = main();
  if (errs.length) { console.error("make-proposals: " + errs.length + " errors\n  " + errs.join("\n  ")); process.exit(1); }
  const outJ = JSON.stringify(json, null, 1) + "\n", outM = md(json) + "\n";
  const fj = path.join(OUT, "proposals.json"), fm = path.join(OUT, "proposals.md");
  if (process.argv.includes("--check")) {
    const bad = [[fj, outJ], [fm, outM]].filter(([f, t]) => !fs.existsSync(f) || fs.readFileSync(f, "utf8") !== t).map(([f]) => path.relative(ROOT, f));
    console.log(bad.length ? "OUT OF DATE: " + bad.join(", ") : "proposals current (" + json.proposals.length + " statements)");
    process.exit(bad.length ? 1 : 0);
  }
  fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(fj, outJ); fs.writeFileSync(fm, outM);
  const n = k => json.proposals.filter(p => p.outcome === k).length;
  console.log("wrote " + path.relative(ROOT, fj) + " and " + path.relative(ROOT, fm) + ": " + json.proposals.length + " statements, " +
    n("claim proposed") + " claims proposed, " + n("correction proposed") + " corrections proposed");
}
module.exports = { main, BATCH };
