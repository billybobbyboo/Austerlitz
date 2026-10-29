# The quote check: every claim of `BUILDINGS` read again on its page image

Stage 8, implementation PR 8G (decision 248 (a)). A second machine reader, working apart from the readers of the registers, read each claim of
the draft `BUILDINGS` (appearance.js) that names a source on that source's **page image** (archive.org page images, the Bayerische
Staatsbibliothek's IIIF images, ULB Tirol's page images; for the stable cadastre's sketches, the Moravian Land Archive's tiles at their highest
level), not on a text layer, on 29 October 2026. For each claim: is its quotation (`q`) on the page verbatim; does its value (`v`) match the page
(a description of a drawing, not a quotation, was not checked as a quotation); is its locator (`at`) right.

**Result: 32 claims checked; 21 right as drafted in all three respects; 11 corrected: two quotations (Kobelnitz's and Puntowitz's sheet
title), one locator wrong (noChurch.Sokolnitz), one quotation running past its value (noChurch.Holubitz, the entry since replaced), six cadastral
locators that did not name the piece their title is on (the pieces they named exist; now the title's piece is named too) and one locator made
precise (churches.Austerlitz); and one note outside the claims was wrong. Every correction below is applied in the data task's `BUILDINGS`.**
(The reader's own summary read "28 passed all three checks; four needed correcting", counting the cadastral locators as one correction and the
locators whose pieces exist as passed; restated here from the table below, which is the reader's.)

| claim | quotation verbatim | value matches | locator right |
|---|---|---|---|
| plan.form | yes: the back of sheet II, piece R02D, reads "Nro II / Gemeinde / SOKOLLNITZ / in / Mähren Brünner Kreis / 1825" | a description, not checked | the pieces named exist; the title is on R02D (corrected: named) |
| plan.north | yes (the same title) | not checked | as plan.form (corrected) |
| plan.walls | yes | yes | yes (p. 79, §§ 466 and 468) |
| villages.Sokolnitz.rear | yes (the same title) | not checked | as plan.form (corrected) |
| villages.Telnitz.rear | yes: "Grundparzellen 1353 / Bauparzellen 98 / Suma 1451", in red ink | not checked | the pieces named exist; the count is on title piece A01A (corrected: named) |
| villages.Pratzen.rear | yes: "Gemeinde PRATZE", with "O. C. IV. S. 20" below | not checked | the pieces named exist; the title is on A01A (corrected: named) |
| villages.Kobelnitz.rear | **no**: the front title reads "Kobelnitz samt Enclav Puntowitz" | not checked | A04C exists; the title is on A01A |
| villages.Puntowitz.rear | **no** (the same title) | not checked | A02D exists; the title is on A01A |
| churches.Telnitz | yes | yes | yes |
| churches.Pratzen | yes | yes | yes |
| churches.Augezd | yes | yes | yes (p. 211 heads "2. Augezd (Újezd), Pfarre … Filialkirche in Satschan") |
| churches.Satschan | yes | yes | yes |
| churches.Menitz | yes | yes | yes (the entry "4. Mönitz (Měnín), Pfarre") |
| churches.Schlapanitz | yes | yes | yes (the entry "4. Schlappanitz (Šlapanice)" begins on p. 433) |
| churches.Krzenowitz | yes | yes | yes |
| churches.Bosenitz | yes | yes | yes (the entry "2. Bosenitz (Tvarožná), Pfarre" begins on p. 481) |
| churches.Austerlitz | yes | yes | as a range; the sentence quoted is all on p. 48, leaf n56 (corrected) |
| noChurch.Girzikowitz | yes | yes | yes |
| noChurch.Kobelnitz | yes | yes | yes (the second Kobelnitz on the page; the first is Bernstein's) |
| noChurch.Sokolnitz | yes, on p. 394 | yes | **no**: p. 394, leaf n402 |
| noChurch.Blasowitz | yes | yes | yes |
| noChurch.Holubitz | yes, but the quotation ran past the end of the value | yes | yes |
| sokolnitz.castle | yes | yes | yes |
| sokolnitz.farm | yes | yes | yes |
| sokolnitz.orchardWall, side 0 | yes | yes ("stoßt" printed without the umlaut, as quoted) | yes |
| sokolnitz.orchardWall, side 1 | yes (the title of the back of sheet II) | not checked | A04E exists; the title is on R02D (corrected: named) |
| telnitz.churchyard | yes | yes | yes |
| fences.Telnitz | yes | yes | yes |
| fences.Sokolnitz | yes | yes | yes |
| austerlitz.roofs | yes ("eingedecket": one damaged letter, legible) | yes | yes |
| austerlitz.church | yes (p. 474) | yes (its first part p. 473, its second p. 474; the omission the rest of p. 473) | yes |
| austerlitz.chateau | yes | yes | yes |

## The corrections, as applied

1. **noChurch.Sokolnitz's locator**: "Im Schloße befindet sich eine geräumige Kapelle" opens p. 394 (leaf n402): "Joche Wiesen. Im Schloße
   befindet sich eine geräumige Kapelle, und bey derselben ein Schloß- und zugleich Lokal-kaplan angestellet." (p. 393, leaf n401, ends "…und bey
   200 Jo-"). Now "p. 394 (leaf n402)"; the farm's claim on p. 393 is right.
2. **villages.Kobelnitz.rear and villages.Puntowitz.rear**: the quotation took its word order from the front of the sheet and its spelling from
   the back. The front title (piece A01A) reads "Kobelnitz samt Enclav Puntowitz"; the back (piece R01D, fetched for this check) reads "Nº I /
   Gemeinde / KOBELNITZ / KOBELNICE samt Enclave PUNTOWITZ / in / Mähren Brünner Kreis / 1825" (four other back pieces, R03C, R03D, R05B and
   R05D, carry the same title). Now "Kobelnitz samt Enclav Puntowitz", the title on piece A01A named in the locator.
3. **noChurch.Holubitz**: its quotation continued past its value (", zwischen Schlapanitz, und Rausnitz gelegen", printed on the same page).
   In the data task Holubitz's entry is a chapel's claim instead (the modern heritage catalogue's chapel of 1769, `BUILDINGS.chapels`), so the
   entry is gone; Schwoy's silence on a church there is kept in the chapel's scope.
4. **The cadastral claims' locators**: none of the sheets' titles quoted is on the piece the claim names. Sokolnitz's "Gemeinde SOKOLLNITZ" is
   the title on the back of sheet II (piece R02D; the front's title piece A01A reads only "Sokolnitz", in script, partly torn); Telnitz's
   "Bauparzellen 98" and the Pratzen and Kobelnitz titles are on the front's piece A01A. Each locator now names the title's piece beside the
   pieces read (every piece named exists in the sketch's level-4 set). The claims' values, descriptions of the drawings, were not checked as
   quotations here; readings-cadastre.md gives what each rests on.
5. **churches.Austerlitz** (imprecise, not wrong): "pp. 47-48" covered the whole entry; the sentence quoted is all on p. 48. Now "p. 48 (leaf
   n56)".

## Noticed outside the claims

- **notDrawn.granary** said that Wolny gives the taking of over 3,000 Russians near the granary "as an unattributed tradition". On Wolny 1837
  p. 466 (leaf n471) he states it in his own voice, with an hour: "…in dessen Nähe während der Schlacht von Austerlitz, Nachmittags zwischen 3
  u. 4 Uhr, über 3000 Russen von den siegenden Franzosen gefangen wurden." The word "tradition" has no ground in the print: the note now says
  that he writes it in his own voice, naming no source. The register's entry T1.2 (readings-texts.md) is corrected the same way. The hour
  bears on the chronology, not on the buildings: handed on (docs/STAGE8_SPEC.md section 19), not used.
- Checked and right: Wolny 1837 p. 466, "Südlich vom Schloße liegt der obrgktl. solid gebaute Mhof."; the church topography 1856 p. 438,
  "kegelförmig auslaufenden Thurmes, zwischen 1726 u. 1734"; Schönhals's work is "Der Krieg 1805 in Deutschland", Wien 1873, by archive.org's
  catalogue.

The page images and crops of this check were kept in the session (not committed); each locator above, with the image URLs in the registers,
finds the page again.
