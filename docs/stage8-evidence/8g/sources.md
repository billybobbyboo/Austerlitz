# Sources: works read for the villages' buildings and landmarks (texts)

Compiled 29 October 2026 by a machine reader. Each **new** work is given with a proposed key in the form of `appearance.js`
`APPEARANCE_SOURCES` (author, title, place and publisher, year, kind, scan URL, archive.org id where there is one). Title pages were read
on the page image unless said otherwise; the images were saved in the reading session (not committed). Kinds as the project uses them: regulation, primary-text,
primary-image, object, specialist, modern-web-specialist.

## New works (not yet registered)

| proposed key | author | title | place and publisher | year | kind | scan | archive.org id | title page |
|---|---|---|---|---|---|---|---|---|
| `schwoy1793` | Franz Joseph Schwoy | Topographie vom Markgrafthum Mähren. Zweyter Band, enthält den Brünner und Hradischer-Kreis | Wien, gedruckt bey Joseph Hraschanzky, k. k. deutsch- und hebräischer Hofbuchdrucker und Buchhändler | 1793 | specialist | https://archive.org/details/10011319bsb | `10011319bsb` | read (leaves n5, n7: `img/schwoy_n5_title.jpg`, `img/schwoy_n7_title2.jpg`) |
| `wolny1837` | Gregor Wolny | Die Markgrafschaft Mähren, topographisch, statistisch und historisch geschildert. II. Band. Brünner Kreis. II. Abtheilung | Brünn, Selbstverlag des Verfassers; in Commission der L. W. Seidel'schen Buchhandlung | 1837 | specialist | https://archive.org/details/10011828bsb | `10011828bsb` | read (leaf n4: `img/w2_n4_title.jpg`) |
| `wolnykt1_1856` | Gregor Wolný | Kirchliche Topographie von Mähren, meist nach Urkunden und Handschriften. II. Abtheilung. Brünner Diöcese. I. Band | Brünn, Selbstverlag; in Kommission der Nitsch und Grosse'schen Buchhandlung; gedruckt bei W. Burkart | 1856 | specialist | https://www.digitale-sammlungen.de/view/bsb10028418 (IIIF manifest https://api.digitale-sammlungen.de/iiif/presentation/v2/bsb10028418/manifest) | none used (a Google scan, `bub_gb_RNUAAAAAcAAJ`, exists; its OCR was unusable and it was not quoted) | read (canvas 1: `img/kt1_c1_title.jpg`) |
| `wolnykt2_1858` | Gregor Wolný | the same, II. Band | Brünn, Selbstverlag; in Kommission der Nitsch und Grosse'schen Buchhandlung; Druck von Georg Gastl | 1858 | specialist | https://archive.org/details/10028419bsb | `10028419bsb` | read (leaf n0: `img/kt2_n0_title.jpg`) |
| `wolnykt3_1860` | Gregor Wolný | the same, III. Band | Brünn, Selbstverlag; in Kommission der A. Nitsch'schen Buchhandlung; Druck von Georg Gastl | 1860 | specialist | https://www.digitale-sammlungen.de/view/bsb10028420 (IIIF manifest https://api.digitale-sammlungen.de/iiif/presentation/v2/bsb10028420/manifest) | none used | read (canvas 1: `img/kt3_c1_title.jpg`) |
| `wolnykt4_1861` | Gregor Wolný | the same, IV. Band (Schluß), with the Ortsregister für die ganze Brünner Diöcese | Brünn, Selbstverlag; in Kommission der A. Nitsch'schen Buchhandlung; Druck von Georg Gastl | 1861 | specialist | https://archive.org/details/10028421bsb | `10028421bsb` | read (leaf n0: `img/kt4_n0_title.jpg`) |
| `instruction1824` | [no author or issuing office printed on the title page] | Instruction zur Ausführung der zum Behufe des allgemeinen Catasters in Folge des 8ten und 9ten Paragraphes des Allerhöchsten Patentes vom 23. December 1817 angeordneten Landes-Vermessung | Wien, aus der kaiserlich-königlichen Hof- und Staats-Aerarial-Druckerey | 1824 | regulation | https://ulb-digital.uibk.ac.at/content/titleinfo/19050 (Universitäts- und Landesbibliothek Tirol; page images https://ulb-digital.uibk.ac.at/download/webcache/1500/{19058 + printed page}; plate Litt. A a: id 19209) | none | read (`img/instr1824_title.png`; the copy carries an owner's inscription of a surveyor of the 4th class) |
| `vichrova2009` | Martina Vichrová | Katalog objektů stabilního katastru | PDF course material, Masaryk University (course HIAb12, spring 2021); the PDF's metadata: created 9 November 2009, modified 6 February 2012 | 2009 | modern-web-specialist | https://is.muni.cz/el/phil/jaro2021/HIAb12/um/Katalog_objektu_stabilniho_katastru.pdf?kod=nk2118 | none | read (PDF p. 1: "KATALOG OBJEKTŮ STABILNÍHO KATASTRU", "Ing. Martina Vichrová") |

Notes on the new works:

- `wolny1837` is the second part of the registered `wolny1836` (same work, same author, Bd. II); a separate key, as the leads register
  proposed (item 42), because its year, its scan and its pages differ.
- `instruction1824` names no author or issuing office on its title page; the key's `au` can stay empty or read "anonymous
  (official instruction)".
- `vichrova2009` is a teaching catalogue, graded C; it is used only to show that a modern specialist reading of the colour classes
  agrees with the Instruction (stone against wood) and has no roof class.

## Registered works used (already in `APPEARANCE_SOURCES`)

| key | pages read on the image here | for |
|---|---|---|
| `wolny1836` | p. XXIV (n35), pp. 151-153 (n218-n220), 158-159 (n225-n226), 233 (n300), 236-238 (n303-n305) | the district's bricks and roof tiles; Austerlitz, Holubitz, Křenowitz, Kruh, Schlapanitz, Augezd, Satschan, Klein-Hostiehradek |
| `schoenhals1873` | pp. 155 (n159), 167 (n171) | the village edges, the Santon, the St Anthony chapel |
| `stutterheim1806de` | pp. 50-51 (n53-n54), 72 (n75), 74-75 (n77-n78), 77 (n80) | Telnitz's vineyards and ditches; the chapel above Augezd |
| `stutterheim1806fr2` | none (text layer only) | the chapel of St Anthony |
| `thiebault3_1894` | p. 479 (n490) | the Sokolnitz château and its dependencies |
| `mikhailovsky1844` | p. 180 (IIIF canvas 191) | the approach to Sokolnitz and its castle |
| `lejeune1851` | pp. 88-89 (n147-n148), 194-195 (n255-n256) | a burnt village; thatch in the bivouacs |
| `segur1877` | pp. 454-456 (n475-n477) | the peasant house by the bivouac |
| `marbot1891` | p. 258 (n277) | the Santon's chapel; the barn at headquarters |
| `coignet1909` | p. 123 (n154) | the shed burnt on the evening of the battle |
