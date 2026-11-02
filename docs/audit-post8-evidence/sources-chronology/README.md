# Final audit after Stage 8: sources and chronology (timings, events, places)

Build audited: `austerlitz-command-map.html`, 2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83` (origin/main 43e3e5b). Third attempt at
this area (usage limits stopped the first two, which left only `tracks-dump.txt` and `events-dump.txt`, reused here). No application file, data,
threshold, test, archive or build was changed; no npm test, build, harness or contrast run was made in the repository.

## What was examined

A source-verification ledger of 20 of the most consequential timed or placed claims (`ledger.md`, `ledger.json`, rows L01-L20): the fog and the
Pratzen assault's release and start (L01-L03), Dokhturov's descent and the columns' departure (L04), Kienmayer at Telnitz (L05), Friant's march, his
arrival at the Goldbach and Telnitz retaken at 09:30 (L06-L08, decisions 177 (b), 199), Sokolnitz attacked (L09), Kamensky's turn, its hour and the
face-about (L10-L12, a named conflict), the Pratzeberg at 11:00 (L13), Blasowitz and the Russian Guard, the 4th Line's eagle and Rapp's charge
(L14-L16), Bagration at dawn by the Posoritz post house (L17, 8K), the Satschan ice and its dead (L18), the Sokolnitz castle and pheasantry (L19, 8J),
and the end of the fighting (L20). For each: (a) where it is shown and how it is labelled (the event pill from `CLAIM`, data.js:16-21; the timing
pill or the dossier's timing row, app.js:7984-7990 and 8296-8302; the statement's claim word from narrative.js), (b) its cited sources and register
entries, and (c) the text of the source itself, read by this audit.

## How

- Source texts: the archive.org text layers (OCR) of 19 period works, the same scans the step-4 register used (Stutterheim, Hamburg 1806, the cited
  German edition, with the English 1807 and French 1806 editions; Schönhals 1873; the Correspondance de Napoléon t. XI with the 30th Bulletin and the
  dispositions; Davout's Correspondance t. I with his reports of 2 and 26 December 1805; Thiébault t. III; Ségur t. II; Savary t. II; Rapp; the
  Materialien of 1806; Mikhailovsky-Danilevsky in the French translation of 1846; Kutuzov's documents t. II of 1951 with Buxhowden's, Kutuzov's and
  Przybyszewski's reports; Thiers t. VI; Marbot t. I; Lejeune). Passages were located with `srcgrep.py` (joins lines, drops end-of-line hyphens) and
  re-extracted by `quotes.sh` with their context and OCR line into `quotes-textlayer.txt` (72 extractions, 0 misses). Three pages were read on their
  page images (`pages/`): Kutuzov's documents pp. 261-262 (n289-n290, Buxhowden's letter) and Schönhals p. 162 (n166).
- Quotations: German long s as s; OCR slips corrected only inside square brackets; [...] an omission. Nothing is quoted that was not read.
- Display and labels: read from the code paths (no browser run): `dossierEvent` (app.js:8284-8330), the formation dossier's timing rows
  (app.js:7984-7990), `CLAIM` (data.js:16-21), `CLAIM_WORDS` (narrative.js:19-28); each statement's claim with `stmts.js` (`statements-key.txt`).
- Coverage counts with `coverage.js` (`coverage.json`).

## Commands

```
node tools/audit-post8/sources-chronology/stmts.js <isolated copy> '<ref regex>'      # statements, claims, readings
node tools/audit-post8/sources-chronology/coverage.js <isolated copy>                  # coverage.json
tools/audit-post8/sources-chronology/fetch-texts.sh <dir>                              # the text layers and the three page images
tools/audit-post8/sources-chronology/quotes.sh [<dir>] > .../quotes-textlayer.txt      # every quotation with its OCR context
python3 -I tools/audit-post8/sources-chronology/make-ledger.py .../sources-chronology   # ledger.json, ledger.md
```

## Results

Ledger: 14 verified, 5 partly, 1 contradicted (L12). Every attribution the 20 rows' texts make that could be read was accurate, including the hours
in Buxhowden's, Kutuzov's and Przybyszewski's reports (Russian), Davout's two reports (05:00; 05:30-06:00; Telnitz "à neuf heures et demie"), the
30th Bulletin (20,000 drowned; Repnin taken by Rapp; the victory "à une heure après midi"), and the dispute texts' sides. Three findings:

1. **S4 P3, unresolved-historical.** Buxhowden's letter to Kutuzov of 21 January 1806 (Kutuzov's documents no. 250, p. 262, page image) blames
   Langeron for having sent Kamensky back: a contemporary document on the "Langeron sent it" side of the Kamensky dispute (analysis.js:296-298),
   not in the registers and not shown (L10).
2. **S3 P2, confirmed-defect.** The Pratzen climb ("Saint-Hilaire and Vandamme climb the slope", 08:45-09:15, analysis.js:284-286) carries the
   "Fact" pill although the accounts read put it from about 08:00 (Ségur: "Il était huit heures") to about 09:00 (Stutterheim, Schönhals), as the
   map's own timing note and release event say; by data.js:20 it is "Disputed". A fourth instance of the history area's finding (L03).
3. **S3 P2, confirmed-defect.** The face-about's "no account read gives the order" (analysis.js:292-294, data.js:80) is contradicted by Schönhals
   p. 162 (page image; also the step-4 register's C1.20): "Kutusow befahl den österreichischen Brigaden Jurschek und Rottermund, die Höhe zu nehmen",
   and by Stutterheim pp. 63-64 (the Emperor orders the 4th Column's battalions forward; Kollowrath ordered to hold the left). The order is attested
   and disputed; neither "Fact" nor "This map's reading" fits (L12; refines the history area's face-about finding).

Related findings of other areas, cited, not repeated: history (`../history/result.json`): the face-about pill; the three events with disputed hours
not labelled disputed (decision, guard-attack, ice); Kamensky's turn drawn from 08:00; the Russian Guard's approach and Blasowitz (L14's three
accounts reinforce it). Geography (`../geography/result.json`): "walled castle" and "pheasantry enclosure" stated as fact (L19 adds that none of the
19 period texts names a pheasantry: 0 hits). Sources-oob (`../sources-oob/`): forces.

Observation, not a finding: the statements this ledger verified include several the claims register leaves "Not yet checked" (all 25 timing notes,
PHASES[#0].lede's fog, PHASES[#2].events[0], PHASES[#3].lede and events[0]); the timing notes are shown untagged (app.js:7990), the unchecked phase
lines are summarised, not listed, in the sources sheet's index. The readings in this ledger would let them be claimed.

## Coverage

185 track anchors (180 positioned), 25 with an explicit timing (A 2, B 12, C 11); 25 events (14 at one clock time, 11 as windows; pills 5 Fact,
9 Estimate, 11 Disputed); 32 phase lines, 26 with a clock; check:chronology's REVIEW holds 75 moves with 75 timed statements cited and 37 allowed.
Checked here: 5 timed anchors directly (sthilaire@3, vandamme@3, dok@1, friant@1, friant@3) and 2 through the ice's hour (kienmayer@8, dok@8);
16 of 25 events; 13 of 26 clocked phase lines; about 45 narrative statements (`statements-key.txt`).

## Not checked

The 1844 Russian edition of Mikhailovsky-Danilevsky (the 1846 French translation reads "à huit heures" where the register reads "въ 8-мъ часу");
copyrighted modern works (Sokolov 2006: Suchet's drain report, the 16:30 end, the 115 km; Duffy; Goetz): inaccessible; Kutuzov's private relation
(p. 265) and Buxhowden's "II Column at eight" not re-read; the Allied report's "quiet from 15:00"; Mikhailovsky-Danilevsky's "last shots between
five and six" and Thiébault's "three hours" not located on the text layers; the other Blasowitz attackers (Stutterheim p. 68, Thiébault p. 462,
Sokolov, the Chevalier Guard's history, Marbot); every quotation but the three page images rests on the text layer (the registers' readings were on
images); 9 events, 13 clocked phase lines and 18 timed anchors outside the ledger; check:chronology's rows one by one (the check passed); Gallica,
HathiTrust and Google Books (not needed: the archive.org scans sufficed); no browser run (labels read from the code).

## Evidence index

| file | what |
|---|---|
| `ledger.md`, `ledger.json` | the ledger, 20 rows (generated by `tools/audit-post8/sources-chronology/make-ledger.py`) |
| `quotes-textlayer.txt` | every quotation re-extracted with OCR context and line (`quotes.sh`; section keys = row ids; L03 uses L02's) |
| `pages/kutuzov1951-p261-n289-buxhowden-letter-head.png`, `pages/kutuzov1951-p262-n290-buxhowden-letter-kamensky.png` | Buxhowden's letter, page images (finding 1) |
| `pages/schoenhals1873-p162-n166-kutuzov-orders-jurczek.png` | Schönhals p. 162, page image (finding 3) |
| `statements-key.txt` | the statements touched, with claim, readings and notes (`stmts.js`) |
| `coverage.json` | the counts (`coverage.js`) |
| `tracks-dump.txt`, `events-dump.txt` | the earlier attempts' dumps (`dump-tracks.js`) |
| `result.json` | the area's structured result |
