#!/usr/bin/env python3
"""Final audit after Stage 8, area sources-chronology: write result.json (the area's structured result) from ledger.json and the findings
below. Read-only with respect to the application. usage: python3 -I make-result.py EVIDENCE_DIR"""
import json, os, sys
E = sys.argv[1]
led = json.load(open(os.path.join(E, "ledger.json"), encoding="utf-8"))["rows"]
def short(s, n): return s if len(s) <= n else s[:n - 3].rstrip() + "..."
ledger = [{"claim": r["id"] + ": " + short(r["claim"], 150), "where_shown": short(r["where_shown"], 140), "cited_source": short(r["cited_source"], 110),
           "verification": r["verification"], "method": short(r["method"], 80),
           "notes": short(r["quotes"][0]["source"].split(",")[0].split(" (")[0] + " " + r["quotes"][0]["locator"] + ": \"" + short(r["quotes"][0]["quote"], 110) + "\". " + r["notes"], 220)} for r in led]
EV = "docs/audit-post8-evidence/sources-chronology/"
res = {
 "area": "sources-chronology",
 "scope_summary": ("Source-verification ledger for the timings, events and places of build f10fe585 (origin/main 43e3e5b): 20 of the most consequential "
   "timed or placed claims (the fog and the Pratzen release and climb; Dokhturov's descent and the columns' departure; Telnitz at 07:00; Friant's 05:00 "
   "march, his ~09:00 arrival and Telnitz retaken at 09:30; Sokolnitz; Kamensky's turn, its hour and the face-about; the Pratzeberg at 11:00; Blasowitz, "
   "the Guard's attack and eagle, Rapp's charge; Bagration by the Posoritz post house (8K); the Satschan ice and its dead; the Sokolnitz castle and "
   "pheasantry (8J); the end), each traced to where and how it is shown (pill, timing grade, claim word), to its cited sources and register entries, "
   "and to the source text itself, read by this audit on the archive.org text layers of 19 period works (72 extractions re-run by quotes.sh, 0 misses) "
   "and on three page images. Result: 14 verified, 5 partly, 1 contradicted; three findings (one new counter-source, two labelling defects that extend "
   "the history area's findings). Evidence: " + EV + " (README.md, ledger.md/json, quotes-textlayer.txt, pages/); scripts: tools/audit-post8/sources-chronology/."),
 "coverage": [
  {"item": "Ledger of 20 consequential timed or placed claims", "method": "display read from app.js/data.js/analysis.js code paths and narrative.js claims (stmts.js); sources read on archive.org text layers (srcgrep.py, quotes.sh) and three page images", "result": "14 verified, 5 partly, 1 contradicted (L12); 0 rows inaccessible as a whole (sub-claims resting on Sokolov 2006 inaccessible)", "evidence": EV + "ledger.md; " + EV + "quotes-textlayer.txt"},
  {"item": "Timed anchors (25 with tm: A 2, B 12, C 11)", "method": "tm.note sources re-read", "result": "5 checked directly (sthilaire@3, vandamme@3, dok@1, friant@1, friant@3: all as stated), 2 through the ice's hour (kienmayer@8, dok@8); 18 not checked", "evidence": EV + "coverage.json; ledger L03, L04, L06-L08, L18"},
  {"item": "Events (25; pills 5 Fact, 9 Estimate, 11 Disputed)", "method": "each event's why/dispute sides re-read in the source", "result": "16 of 25 in the ledger; sides accurate; 'soult' (Fact) has a disputed hour (finding 2); face-about's 'no account read' contradicted (finding 3); not checked: counter-march, pratzen-village, kursk (M-D's 1,600 verified only), hq-forward, buxhowden-blind, davout-resumes (M-D's 13:00 verified only), wheel, sokolnitz-falls (Przybyszewski's until 16:00 and Thiebault's ~15:00 verified only), augezd", "evidence": EV + "statements-key.txt"},
  {"item": "Phase lines with a clock (26 of 32)", "method": "as events", "result": "13 checked (PHASES[1] 0-1, [2] 0-1, [3] 0,1,3,4, [4] 1,3, [8] 1-2, plus [0] 2's one o'clock and 07:30 verified in the Correspondance pp. 443, 450)", "evidence": EV + "statements-key.txt"},
  {"item": "Shown as disputed? (the ice, the Guard, Kamensky, the end, Telnitz, Sokolnitz, the columns' departure)", "method": "pill, dispute section, claim tag and place dossier compared with the sources", "result": "disagreements kept and accurately attributed; the ice's toll kept in full in the Satschan dossier (data.js:749); pills inconsistent where history already found and for 'soult' (finding 2)", "evidence": EV + "ledger.md L18, L15, L10-L11, L20"},
  {"item": "check:chronology (REVIEW 75 moves, 75 cites, 37 allowances)", "method": "counts read from tools/stage2/chronology.js; not re-run (passed in this audit's required checks)", "result": "not audited row by row", "evidence": "docs/audit-post8-evidence/checks/"},
 ],
 "findings": [
  {"title": "A January 1806 letter by Buxhowden naming Langeron as having sent Kamensky back is missing from the Kamensky dispute and the registers",
   "category": "unresolved-historical", "severity": "S4", "priority": "P3", "subsystem": "historical data: analysis.js EVENTS[#kamensky].why, narrative.js sides, docs/step4-evidence/readings.md C1",
   "user_impact": "The 'who turned the brigade' dispute shows the 'Langeron sent it' side as Schönhals's alone (an official history published 1873); a contemporary document by Langeron's superior supports it. The disagreement is kept, so only the weight of one side is understated.",
   "status": "open", "origin": "inherited",
   "refs": ["analysis.js:296-298", "data.js:521", "docs/step4-evidence/readings.md:281-291", "docs/step4-evidence/readings.md:509-519", EV + "pages/kutuzov1951-p262-n290-buxhowden-letter-kamensky.png"],
   "evidence": "Kutuzov documents t. II (1951) no. 250, '1806 г. января 21. — ПИСЬМО Ф. Ф. БУКСГЕВДЕНА М. И. КУТУЗОВУ', p. 262 (archive.org 20250102_20250102_1833 page n290), read on the page image: 'Не должно ли приписать в вину графа Ланжерона, что он пошел на деревню Сокольниц? [...] А притом генерал-майора графа Каменского 1-го с полком его и другими рассеянными несколькими командами послав назад, тем храброго сего генерала с его отрядом подвергал крайней опасности' ('and moreover, by sending Major-General Count Kamensky 1st back with his regiment and several scattered detachments, he exposed this brave general and his detachment to extreme danger'). No hit for 'Dubno|no. 250|послав назад|kutuzov1951 pp. 260-262' in the step-4 and step-2 registers or narrative.js. Ledger L10.",
   "expected": "CLAUDE.md: 'Where sources disagree, keep the disagreement. Prefer primary and specialist sources': a dated 1806 document in an edition the project reads, bearing on a named dispute, registered and weighed.",
   "observed": "EVENTS[#kamensky].why names five sides (Mikhailovsky-Danilevsky, Schönhals, Kutuzov's official and private relations, Stutterheim); the step-4 cluster read pp. 241-242, 255-258 and 265-270 of the same volume but not no. 250 (pp. 260-262).",
   "remedy": "Register the reading (page image n290; grade by the register's rule: a letter of January 1806 by the left wing's commander, at second hand for the II Column; label fact; disputed) and add it to the 'Langeron sent the brigade' side of EVENTS[#kamensky].why's narrative.js entry; a data task under CLAUDE.md's rule (check:data reference moves).",
   "effort": "S", "risk": "low", "judgement_kind": "source-evidence",
   "cause_hypothesis": "Step 4's C1 cluster read the Kutuzov documents by targeted pages (the relations and reports) and did not page through no. 250, Buxhowden's answer to Kutuzov's letter of 16 January.",
   "validation": "Re-read p. 262 on the image; test.js's narrative checks (registered reading, sides from two sources) pass with the new side.",
   "prior_refs": []},
  {"title": "The Pratzen climb ('Saint-Hilaire and Vandamme climb the slope', 08:45-09:15) is labelled 'Fact' although the accounts read put it from about 08:00 to about 09:00",
   "category": "confirmed-defect", "severity": "S3", "priority": "P2", "subsystem": "event labelling: analysis.js EVENTS[#soult].claim, app.js dossierEvent",
   "user_impact": "In the dossier of the day's central event the visitor sees 'Fact', 'Timing C', 'Interval, not a timestamp' and 'Attested in the standard accounts of the battle. Shown as an interval rather than a timestamp: ... an hour this map does not fix to the minute'; nothing there says that Ségur has the divisions appear at eight while Stutterheim and Schönhals put the French advance about nine, though Saint-Hilaire's dossier and the release event say so.",
   "status": "open", "origin": "inherited",
   "refs": ["analysis.js:284-286", "data.js:16-21", "data.js:192", "data.js:210", "data.js:77", "app.js:8296-8302", "app.js:8328-8329", "docs/audit-post8-evidence/history/result.json"],
   "evidence": "EVENTS[#soult] claim:'fact', t:[525,555], no dispute field (analysis.js:284-286). CLAIM.disputed (data.js:20): 'its hour ... is disputed: the accounts read disagree with each other or with this map's timing'. sthilaire@3's timing note (data.js:192): 'inside the sources' range (about eight in Ségur, the aide's report at half past eight in Thiébault, about nine in Stutterheim and Schönhals)'. Read: Ségur t. II pp. 466-467 'les divisions Vandamme et Saint[-]Hilaire, s'élançant hors du brouillard qui les env[el]oppait, apparurent soudainement. Il était huit heures.'; Stutterheim (Hamburg 1806) pp. 60-61 'Es war ungef[ä]hr 9 Uhr'; Schönhals p. 160 'es mochte 9 Uhr Früh [s]ein [...] gab er den Befehl z[u]m Angriff'. Ledger L02-L03.",
   "expected": "Pill 'Disputed' and a 'When it happened: disputed' section naming the sides (app.js:8308 renders it from EVENTS[].dispute), as EVENTS[#decision] already words them.",
   "observed": "Pill 'Fact' with the CLAIM.fact note; the disagreement appears only in the formation dossiers' timing notes and the release event.",
   "remedy": "Set EVENTS[#soult].claim to 'disputed' and add a dispute string from sthilaire@3's timing note (Ségur eight; Thiébault's aide at 08:30; Stutterheim and Schönhals about nine; the map's 08:45 its choice) with its narrative.js entry; a data task (check:data reference moves). Merge with the history area's 'Three events whose own texts say the hour is disputed are not labelled disputed' as a fourth instance.",
   "effort": "S", "risk": "low", "judgement_kind": "labelling-rule",
   "cause_hypothesis": "Decision 201 (b) relabelled the events whose texts named a disputed hour; the climb's dispute lives in the anchors' timing notes and the release event, not in its own text, so it was not caught.",
   "validation": "Event dossier shows 'Disputed' with sides; runtime-test's claims-on-screen checks pass.",
   "prior_refs": ["docs/audit-post8-evidence/history/result.json: Three events whose own texts say the hour is disputed are not labelled disputed"]},
  {"title": "The face-about's 'no account read gives the order' is contradicted by the project's own reading of Schönhals p. 162 and by Stutterheim pp. 63-64",
   "category": "confirmed-defect", "severity": "S3", "priority": "P2", "subsystem": "historical labelling: analysis.js EVENTS[#face-about].why and its narrative.js note, data.js PHASES[#3].events[3]",
   "user_impact": "The visitor is told twice that Kutuzov's order is this map's own reading which no account gives; two accounts the project read attribute the 4th Column's turn against the French to an order (Kutuzov's in Schönhals, the Emperor's in Stutterheim). The event is attested and disputed (by whom), so neither the 'Fact' pill nor the 'This map's reading' tag is right; this decides the remedy of the history area's face-about finding.",
   "status": "open", "origin": "inherited",
   "refs": ["analysis.js:292-294", "data.js:80", "docs/step4-evidence/readings.md:292-302", "docs/step4-evidence/readings.md:801-808", EV + "pages/schoenhals1873-p162-n166-kutuzov-orders-jurczek.png"],
   "evidence": "Schönhals, Der Krieg 1805 in Deutschland (1873) p. 162 (archive.org derkriegindeuts00schgoog page n166), read on the page image: 'Kutusow befahl den österreichischen Brigaden Jurschek und Rottermund, die Höhe zu nehmen.' The step-4 register's C1.20 holds the same sentence, read on the image. Stutterheim (Hamburg 1806) pp. 63-64 (text layer): 'Der Russ[i]sche Kaiser, welcher [während die]ses mörderischen Gefechtes bey seiner Infanterie von der [4]ten Colonne geblieben war, [...] befahl [s]einen Bataillonen vorzurücken, und zu versuchen den Feind in der Flanke zu nehmen. Der General Kollowrath erhielt Befehl, den Feind auf dem linken Flügel aufzuhalten'. The map: EVENTS[#face-about].why 'That he ordered the column to face about is this map's reading' (claim interpretation; narrative.js note 'No account read has Kutuzov order the 4th Column to face about'); PHASES[#3].events[3] 'in this map's reading, which no account read gives, nor its hour'. Ledger L12.",
   "expected": "The statement's claim matches the readings: an order to the 4th Column's Austrian brigades in Schönhals (Kutuzov), to its Russian battalions in Stutterheim (the Emperor); the hour the map's.",
   "observed": "Claim 'interpretation' and 'no account read gives'; pill 'Fact'.",
   "remedy": "Reword EVENTS[#face-about].why and PHASES[#3].events[3] to name the sides (Schönhals: Kutuzov ordered Jurczek's and Rottermund's brigades to take the height; Stutterheim: the Emperor ordered the battalions forward and Kollowrath was ordered to hold the left; Mikhailovsky-Danilevsky: Kutuzov rode to the 4th Column's left wing), claim 'disputed' with sides and pill 'disputed'; consider naming the event for what the sources attest ('The 4th Column turns against the French on the plateau'). A data task; merge with the history area's face-about finding.",
   "effort": "S", "risk": "low", "judgement_kind": "source-evidence",
   "cause_hypothesis": "The face-about was weighed against the Kamensky accounts (Mikhailovsky-Danilevsky, Kutuzov's relations) only; the Schönhals sentence was registered for Jurczek's attack and the Pratzen fight's length (C1.20), and Stutterheim's for Jurczek's attack, not for who ordered the column.",
   "validation": "Re-read Schönhals p. 162 and Stutterheim pp. 63-64; test.js's narrative checks pass with 'disputed' sides from two sources.",
   "prior_refs": ["docs/audit-post8-evidence/history/result.json: The face-about event is labelled Fact beside its own why claimed This map's reading"]},
 ],
 "experiments": [
  {"command": "python3 -I tools/audit-post8/sources-chronology/srcgrep.py <archive.org _djvu.txt> '<regex>' [ctx] [max] over 19 period texts; re-run for every quotation by tools/audit-post8/sources-chronology/quotes.sh", "environment": "local text files fetched from archive.org by an earlier attempt into the scratchpad (fetch-texts.sh documents the URLs)", "evidence_path": EV + "quotes-textlayer.txt", "outcome": "72 extractions, 0 misses; all 20 ledger rows' quotations located", "limitations": "OCR text layer: Fraktur and Cyrillic OCR damaged in places (corrections bracketed); a negative OCR search is not conclusive"},
  {"command": "curl https://archive.org/download/20250102_20250102_1833/page/n289.jpg, .../n290.jpg; https://archive.org/download/derkriegindeuts00schgoog/page/n166.jpg; crops viewed", "environment": "agent proxy, archive.org BookReader images", "evidence_path": EV + "pages/", "outcome": "Buxhowden's letter (p. 262) and Schönhals p. 162 confirmed on the image", "limitations": "only these three pages read on images"},
  {"command": "node tools/audit-post8/sources-chronology/stmts.js <isolated copy> '<ref regex>'; node tools/audit-post8/sources-chronology/coverage.js <isolated copy>", "environment": "isolated repo copy (scratchpad sources-chronology-iso, data files md5-identical to the repository)", "evidence_path": EV + "statements-key.txt; " + EV + "coverage.json", "outcome": "claims and readings of about 45 statements; 185 anchors, 25 timed, 25 events, 26 clocked phase lines", "limitations": "static: labels read from the code, not rendered"},
  {"command": "grep -c -i 'faisander|fasaner|Fasangarten|pheasantr|фазан' over the 19 text layers (quotes.sh tail)", "environment": "local", "evidence_path": EV + "quotes-textlayer.txt", "outcome": "0 hits in every text", "limitations": "OCR negative"},
  {"command": "python3 -I tools/audit-post8/sources-chronology/make-ledger.py; python3 -I tools/audit-post8/sources-chronology/make-result.py", "environment": "local", "evidence_path": EV + "ledger.json; " + EV + "result.json", "outcome": "ledger 20 rows (14 verified, 5 partly, 1 contradicted)", "limitations": ""},
 ],
 "not_checked": [
  "Mikhailovsky-Danilevsky's 1844 Russian edition (only the 1846 French translation read; it says 'à huit heures' where the register reads 'въ 8-мъ часу')",
  "Copyrighted modern works: Sokolov 2006 (Suchet's drain report, the 16:30 end, the 115 km march), Duffy 1977, Goetz 2005: inaccessible",
  "Kutuzov's private relation (no. 252, p. 265) and Buxhowden's report's 'II Column at eight' not re-read; the Allied report's 'quiet from 15:00' (Materialien pp. 118-119) not re-read",
  "Mikhailovsky-Danilevsky's 'last shots between five and six' and Thiébault's 'three hours' on the plateau not located on the text layers",
  "The other Blasowitz attackers (Stutterheim p. 68, Thiébault p. 462, Sokolov p. 49, the Chevalier Guard's history, Marbot) not re-read",
  "All quotations but three pages rest on the OCR text layer (the registers' own readings were on page images)",
  "9 of 25 events, 13 of 26 clocked phase lines and 18 of 25 timed anchors outside the ledger; check:chronology's 75 REVIEW rows not audited one by one",
  "Geography of the castle, pheasantry, post house and highway (geography area) and forces (sources-oob area)",
  "Gallica, HathiTrust, Google Books not tried (archive.org scans sufficed); no browser run",
 ],
 "carried_status": [
  {"item": "history: face-about labelled Fact beside 'This map's reading'", "status": "confirmed and refined", "evidence": "Schönhals p. 162 and Stutterheim pp. 63-64 attest an order (by Kutuzov, by the Emperor): 'disputed' is the fitting label (finding 3)"},
  {"item": "history: three events with disputed hours not labelled disputed", "status": "confirmed; a fourth instance", "evidence": "the decision event's sides verified (L02); the climb event 'soult' also (finding 2); the ice's hour dispute in PHASES[#8].events[1] verified (L18)"},
  {"item": "history: Kamensky's turn drawn from 08:00", "status": "consistent", "evidence": "no account read gives the hour (L11); Thiébault p. 504 bounds it (the brigade still on the heights at 08:30)"},
  {"item": "history: the Russian Guard's approach and Blasowitz", "status": "reinforced", "evidence": "Stutterheim p. 56, Schönhals pp. 163-164, Mikhailovsky-Danilevsky pp. 256-257 put the Guard's jägers in the village (L14)"},
  {"item": "geography: 'walled castle' and 'pheasantry enclosure' stated as fact", "status": "reinforced", "evidence": "the castle is in four accounts; 'walled' and a pheasantry in none of 19 period texts (L19)"},
 ],
 "ledger": ledger,
 "strengths": [
  "Every attribution the 20 rows' texts make that could be read was accurate, including the hours in Buxhowden's, Kutuzov's and Przybyszewski's Russian reports and Davout's two reports",
  "Disagreements are kept and their sides are stated exactly (the columns' departure, Telnitz, Sokolnitz, Kamensky, the Guard, Rapp's charge, the end)",
  "The ice's toll is kept in full in the Satschan dossier (the Bulletin's 20,000, Marbot, Thiébault's 3,000-4,000, Lejeune, Stutterheim, Schönhals's 60-100, Suchet via Sokolov) and the map labels its 'encirclement' reading as interpretation",
  "The day's one A-graded event hour (Telnitz at 09:30) rests on a report dated 26 December 1805 quoted exactly; Dokhturov's A-graded 07:00 on two 1806 documents",
  "Timing grades are candid: the climb's 08:45 is graded C 'app narrative, unsourced' with the sources' range in its note",
 ],
}
json.dump(res, open(os.path.join(E, "result.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(json.dumps(res, ensure_ascii=False)))
