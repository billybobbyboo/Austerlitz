> **Stage 6 Part A, evidence register (`docs/STAGE6_SPEC.md` §2). Leads, not evidence.** Compiled on 4 October 2026 by the research
> pass of this part. No external source was read: the session's network policy refuses every host that holds them (HTTP 403;
> `docs/STAGE6_SPEC.md` §2.0), and the search tool's summaries are machine-written and not a source. Every external row is a lead to
> read in 6B; no grade in it is a verified grade. Texts reached through copies in other GitHub repositories are excluded (this session
> may read only its own repository). Nothing here may change the data or the drawing until its source is read.

# Austrian army at Austerlitz (2 December 1805): appearance and colours

Research notes for the reconstruction. Compiled 2026-10-04. Nothing in the project was changed.

---

## 0. Read this first: what these notes are, and what they are not

**No source was read for this report.** Treat every external claim below as an unverified lead.

1. **WebFetch was blocked for every domain tried.** The network egress proxy refused all of them: en.wikipedia.org,
   archive.org, napoleon-series.org, google.com, catalog.hathitrust.org, digitale-sammlungen.de, kuk-wehrmacht.de,
   and even example.com. A `curl` to archive.org got the same 403. So no page, PDF or digitised book could be opened.
2. **WebSearch was the only working tool.** For each search it returns:
   - the page **titles and URLs** of the hits. These are real and are used here as finders.
   - a **machine-written summary** of the pages' content. Under this task's source standard ("never cite AI-generated text or
     search summaries"), a summary is **not citable**. It is reported here only to say what a source may contain and where
     to check, and it is always marked **S**.
3. **The session's web-search budget (200 calls) ran out** after about 75 searches by this agent, so it is apparently shared
   with other work in the session. Hussars, artillery facings, generals, horses, the shako date, Grenz headgear, cavalry standards and Grenz colours were
   still to be searched; they are listed under "Could not be sourced".
4. **Consequence for grading.** In the tables the grade is **provisional**, marked with `*`. It is the grade the claim would
   carry if the source, once read, says what the lead reports. Until then every external item counts as **unverified**. No item
   reaches A now. Labels: **uncertain** = reported by a lead but not verified; **disputed** = the leads disagree;
   **inference** = my deduction; **fact** is used only for what I read myself (the project's own code and data).

**Access codes** (the table column "access"):
- **R**: read by me. This applies only to the project files.
- **T**: seen only as a search-result title or URL. That shows the item exists and gives its exact title, nothing more.
- **S**: content known only from a search-engine summary of the page. Finder only; not citable.

**Source class** (written after the source):
- **P**: primary.
- **SP**: specialist secondary.
- **O**: Osprey (popular secondary).
- **PS**: popular secondary.
- **W**: web secondary, by a named author who is not an academic.
- **TER**: tertiary (Wikipedia, FOTW, wargaming, re-enactor and forum pages).

**What the project currently draws** (R):
- **The flag** (`app.js` lines 1153-1157, `flagTexture`). Austria's flag is drawn as `#E9E2D2` (off-white) with `#C8A03A` (gold)
  bands across the top and bottom and a black disc of radius 11 px in the centre, commented "Austrian: white with a gold border".
- **Kienmayer's staff string** (`data.js` line 450): "Grenz infantry (Broder Nr. 7, 1st and 2nd Szekler Nr. 14 and 15) with
  chevau-legers, hussars and Cossacks".
- **The open question** (`data.js` line 764, `SOURCE_NOTE`): "Open questions, left unresolved rather than guessed: ... whether
  Grenz infantry wore brown in 1805".

---

## 1. Which Austrian units: the order of battle behind the uniform questions

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Kienmayer, total | Advance guard of 5 battalions, 22 squadrons and 2 batteries (12 guns). | uncertain | B* | de.wikipedia "Schlacht bei Austerlitz" (TER), https://de.m.wikipedia.org/wiki/Schlacht_bei_Austerlitz (also austria-forum AustriaWiki copy) | S | weaponsandwarfare.com/?p=4548 (TER) says "five battalions supported by twenty squadrons" (S): see Disagreements. |
| Kienmayer, Grenz | 1st and 2nd Szekler Grenz IR Nr. 14 and Nr. 15, 2 battalions each (de.wikipedia), with part of the Broder Nr. 7 (weaponsandwarfare). | uncertain | B* | de.wikipedia, as above (TER); weaponsandwarfare.com/?p=4548 (TER): "parts of the 7th frontier regiment, 14th and 15th Szekler frontier field regiment" | S | That the Broder part was one battalion is my **inference**: the 5-battalion total less the 4 Szekler battalions. |
| Kienmayer, hussars | Hessen-Homburg Hussars (Nr. 4) under Oberst Mohr; Szekler Hussars (Nr. 11), 8 squadrons. | uncertain | B* | napolun.com mirror "Austrian Cavalry" (TER), https://www.napolun.com/mirror/web2.airmail.net/napoleon/Austrian_cavalry.htm; austria-forum AustriaWiki "K.u.k. Husarenregiment ... Nr. 11" (TER); weaponsandwarfare (TER): "4th and 11th Hussar regiment" | S | The napolun page quotes, apparently from a contemporary account: "The Hussars, excellent ones of Hessen-Homburg, had many men and horses killed by the French skirmishers, but the enemy did not succeed in making them yield." The page names no author. Stutterheim's 1806 account (see below) is the likely origin: **inference**. |
| Kienmayer, chevaulegers and uhlans | Stutterheim's brigade: 8 squadrons of O'Reilly Chevaulegers Nr. 3 (about 900 sabres) and 40 troopers of Merveldt Uhlans Nr. 1. | uncertain | B* | en.wikipedia "Karl Wilhelm von Stutterheim" (TER), https://en.wikipedia.org/wiki/Karl_Wilhelm_von_Stutterheim | S | The 40 Merveldt uhlans mean an uhlan figure is defensible only as a token. |
| Kienmayer, primary account | Stutterheim, an Austrian officer present, wrote the contemporary account *La bataille d'Austerlitz, par un militaire témoin de la journée du 2 décembre 1805* (1806). | uncertain | (P) | Bibliographic detail from my own knowledge; **not confirmed in this pass**. Only his Wikipedia page appeared in the results. | none | For presence and actions, not uniforms. |
| Kollowrat, Jurczek's brigade | One battalion each of: Kaiser IR 1 (1,000), Czartoryski IR 9 (600), Lindenau IR 29 (400), Württemberg IR 38 (500), Kerpen IR 49 (700), Reuss-Greitz IR 55 (600), Beaulieu IR 58 (500). | uncertain | B* | en.wikipedia "Battle of Austerlitz order of battle" (TER), https://en.wikipedia.org/wiki/Battle_of_Austerlitz_order_of_battle | S | The same summary mentions Major Mahler bringing the Kerpen battalion to a rise, with the Beaulieu battalion covering the flank. |
| Kollowrat, Rottermund's brigade | Salzburg IR 23 (several battalions); the 6th battalion of Kaunitz IR 20 (900); the 6th battalion of Auersperg IR 24 (600). | uncertain | B* | napoleon-series "Russian-Austrian Order-of-Battle at Austerlitz" (W), https://www.napoleon-series.org/military-info/battles/Austerlitz/c_austerlitzoob2.html; en.wikipedia OOB, as above (TER) | S | Strength of Salzburg: "6 battalions, 6,000" (napoleon-series summary, which garbles it as "Salzburg Landwehr") against "3,000 men of the Salzburg Infantry Regiment and one battalion each of Kaunitz and Auersperg, 1,500 men" (battlefieldanomalies.com, TER). See Disagreements. |
| Kollowrat, guns | Two Austrian position batteries of six 12-pounders each. | uncertain | B* | napoleon-series OOB, as above (W) | S | |
| Kollowrat, character of the battalions | Formed "mostly of unhealthy soldiers or untrained recruits from the 6th (depot) battalions of their regiments"; Thiébault's c. 2,600 men faced 16 Austrian battalions of over 8,000. | uncertain | B* | napoleon.org "The Battle of Austerlitz and the Principles of War", https://www.napoleon.org/en/history-of-the-two-empires/articles/the-battle-of-austerlitz-and-the-principles-of-war/ (W) | S | Bears on whether grenadiers were present: see A.1 and Disagreements. |
| IR 23 "Salzburg" | IR 23's Inhaber was Ferdinand III, Grand Duke of Tuscany, Elector of Salzburg 1803-1805; hence "Salzburg". | inference | C | austria-forum "Ferdinand III. (Toskana)" (TER), S: Ferdinand received the Electorate of Salzburg in 1803 and it passed to Austria at the end of 1805. napoleonguide's facings table lists No. 23 as "von Toscana" (S). | S | The link between regiment and title is my inference from those two leads. |
| Nafziger | A compiled Austrian order of battle for Austerlitz exists as a PDF in the Nafziger collection. | uncertain | (W) | G. Nafziger, "Austrian Order of Battle at Austerlitz, 2 December 1805", https://www.napoleon-series.org/nafzigger/805LCJ.pdf | T | Not read: the domain is blocked. |
| Liechtenstein, Caramelli's brigade | Nassau Cuirassiers Nr. 5 (300, 6 squadrons); Lothringen Cuirassiers Nr. 7 (300, 6 squadrons). | uncertain | B* | en.wikipedia OOB, as above (TER) | S | |
| Liechtenstein, Weber's brigade | GM Johann Weber von Treuenfels with Kaiser Cuirassiers Nr. 1 (500, 8 squadrons). | uncertain | B* | en.wikipedia OOB, as above (TER) | S | 300 + 300 + 500 = 1,100, which matches `data.js`'s "about 1,100" (R). |
| Earlier context | A digitised German document (Wienbibliothek) lists 8 squadrons each of Lothringen and Nassau cuirassiers, and names GM Caramelli with 3 grenadier battalions and 2 cuirassier regiments "in and before Ingolstadt". | uncertain | n/a | https://www.digital.wienbibliothek.at/download/pdf/2601839.pdf (P or SP? not identified) | S | This is the Ulm campaign, not Austerlitz. It suggests the regiments were reduced from 8 squadrons to 6 by December: **inference**. |
| Cossacks | The Cossacks attached to Kienmayer were Russian. | fact (scope) | n/a | data.js line 450 (R) | R | Outside this Austrian brief; not researched. |

---

## (A) APPEARANCE

### A.1 Line infantry (Kollowrat's IV Column)

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Regulation | A uniform regulation of 1798 (Adjustierungsvorschrift) introduced the uniforms in the rows below. The Mollo plates of it are called "an invaluable source for researching the Austrian Army from the early Napoleonic Wars until 1805". | uncertain | B* | WarHistory.org, "The Austrian Army Takes Stock: The 1798 Adjustierungsvorschrift" (W; author not shown), https://warhistory.org/article/the-austrian-army-takes-stock-the-1798-adjustierungsvorschrift; the napoleon-series Mollo page (below) | S | The regulation's own text was not located. Whether every detail still held in December 1805 is not established. |
| Helmet (fusiliers) | The 1798 helmet replaced "the old casquet headdress with its raised front": a black leather skullcap 16.5 cm high, a raised comb from front to back, and on it a crest of black over yellow wool 5 cm high. Wool for other ranks, silk for officers, and "unturned" silk for field and staff officers. | uncertain | B* | WarHistory.org, as above (W) | S | S: "phasing out of the old casquet headdress with its raised front in favour of a more impressive classical Roman-style helmet with a black and yellow crest". |
| Coat | White cloth with ten yellow or white buttons on the breast. Collar (now upright), cuffs and turnbacks in the facing colour; the turnbacks smaller and the skirts less full than before. | disputed (turnbacks) | B* (coat white), C (turnbacks) | WarHistory.org, as above (W) | S | Another hit in the same search said: "Turnbacks were white edged with facing colour. Collars were white with a patch of the facing colour". The summary cannot tie that to a page: one of weltseele.miraheze.org "Generalities of Line Infantry (Austria)", napoleon-series "Austrian Regular Infantry" (c_ausinf3) or the baccus6mm painting guide, all TER or W. It may describe another army or period. Unresolved. |
| Contemporary plates of the 1798 regulation | *Abbildung der neuen Adjustirung der k.k. Armee*: 46 hand-coloured engravings by J. G. Mansfeld after V. G. Kininger, published by Tranquillo Mollo, Vienna, c. 1796-1798, showing the new uniforms front and back. A copy is in the ULB Darmstadt; napoleon-series reproduces the plates. | uncertain | P (pictorial) | napoleon-series, "The Austrian Army in 1798: the Uniform Plates of Tranquillo Mollo and Joseph George Mansfield", https://www.napoleon-series.org/military-info/organization/Austria/UniformPlates/Mollo/c_Mollo.html | T + S | **The best primary pictorial source found** for coat, helmet, legwear and the Grenz field dress. S: "no year of publication is listed ... most likely from around 1798". **Must be read first.** |
| Later specialist plates | Teuber and Ottenfeld, *Die österreichische Armee von 1700 bis 1867* (Vienna: Berté and Czeiger, 1895): Tafel 33 "Deutsche Infanterie 1798-1805"; Tafel 32 "Offizier und Grenadier der ungarischen Infanterie 1798-1805". | uncertain | SP (1895 reconstruction) | Plate titles from the vestes-bellica.com plate list and Deutsche Digitale Bibliothek entries (originals held by the Deutsches Historisches Museum, Berlin) | S (titles of 32 and 33 only in summaries) | Text and plates digitised by ULB Tirol: https://diglib.uibk.ac.at/urn:nbn:at:at-ubi:2-15217 (T). HathiTrust record 002028042 (T). |
| Facings, by regiment | See the facings table below. | uncertain or disputed | C* | napoleonguide.com "Austrian Infantry Colour Facings" (TER) and/or E. Acerbi, *The Austrian Imperial-Royal Army 1805-1809* (W, PDF at centotredicesimo.org); the summaries mix the two | S | Not citable; must be checked against the 1805 Schematismus. |
| Legwear, German | White breeches and black gaiters. | could not be sourced | n/a | none found | n/a | |
| Legwear, Hungarian | Light blue tight breeches with braid. | could not be sourced for the line | n/a | The only lead is the Grenz field rule's "blue Hungarian breeches" (A.2). Tafel 32 (Hungarian infantry 1798-1805) is the place to look. | n/a | |
| Grenadiers | A bearskin cap with a brass plate. | could not be sourced | n/a | Tafel 32 shows a Hungarian grenadier of 1798-1805 (title only, S) | n/a | Grenadiers' presence in the IV Column is itself uncertain (next row). |
| The 1805 organisation | Mack's 1805 reform: four companies per battalion; five field battalions, the former depot battalion among them, and a sixth "elite" battalion of the two grenadier companies and two fusilier companies, styled "Velite-Grenadiere". That sixth battalion was the depot in peace and went to the Army Reserve in war. | disputed | C | Summary of a Wikipedia article on the Austrian army of the period (TER) and the napoleon-series Acerbi overview (W) | S | This conflicts with "6th (depot) battalions ... untrained recruits" (napoleon.org). If Kollowrat's "6th battalions" were the Mack sixth battalions, grenadier caps could have been present. Unresolved. |
| Shako | The date the shako was adopted (1806?) and whether any Austrian line infantry wore it at Austerlitz. | could not be sourced | n/a | none found | n/a | Product titles such as "Austrian German Line Infantry battalion (1798-1809, Helmet Period)" (abfigures.com, T) are not evidence. |

**Facings table: leads only, to be checked.** "Buttons" means yellow (brass) or white (pewter). The table's Inhaber names
differ from those in the 1805 order of battle: "B. Preiss" for 24 (Auersperg), "G. Murray" for 55 (Reuss-Greitz), and
"G. Oliver [Wallis]" for 29 (Lindenau). So the table was evidently compiled for another year (**inference**). Whether any
regiment's facings differed in 1805 is not established.

| regiment (1805 name) | facing colour reported | buttons | label | grade | source | access |
|---|---|---|---|---|---|---|
| IR 1 Kaiser | "pompadour red" (German *pompadourrot*?) | yellow ("gold") | uncertain | C* | napoleonguide and/or Acerbi (TER, W) | S |
| IR 9 Czartoryski | apple green | yellow | uncertain | C* | same | S |
| IR 20 Kaunitz | "crab red" (*krebsrot*) | white | uncertain | C* | same (two hits agree) | S |
| IR 23 Salzburg (Toscana) | "poppy red" (*ponceau*) | white | uncertain | C* | same | S |
| IR 24 Auersperg | dark blue | white | uncertain | C* | same (listed under "B. Preiss") | S |
| IR 29 Lindenau | **white** (one summary) or **pale blue** (another) | white | disputed | C | Acerbi-type summary against napoleonguide (listed under "G. Oliver", Wallis) | S |
| IR 38 Württemberg | rose or pink (the summary says "Walloon rose pink") | yellow | uncertain | C* | same | S |
| IR 49 Kerpen | pike grey (*hechtgrau*) | white | uncertain | C* | same | S |
| IR 55 Reuss-Greitz | pale blue | yellow | uncertain | C* | same (listed under "G. Murray") | S |
| IR 58 Beaulieu | black | white | uncertain | C* | same | S |
| Grenz IR 7 Broder, 14 and 15 Szekler | not found | not found | could not be sourced | n/a | n/a | n/a |

**Where to check the facings: the primary source.** The *Schematismus der kais. königl. Armée* for 1805 (the army list,
published under that title 1804-1808). It records each regiment's facings ("Aufschläge", "Kragen") and buttons ("weisse
Knöpfe", "gelbe Knöpfe"):
- Hungaricana holds the Austrian State Archives' "Militär Almanach und Schematismus 1791-1914" collection,
  https://library.hungaricana.hu/en/collection/austrian_state_archives_MilitarAlmanachSchematismus/ (T).
- Wikisource lists digitisations: https://de.wikisource.org/wiki/%C3%96sterreichischer_Milit%C3%A4r-Schematismus (T).

The second check is A. von Wrede, *Geschichte der k. und k. Wehrmacht*, Bd. I (1898), Infanterie, in its regiment entries
(HathiTrust record 007324046, T; Hungaricana also lists a part of the work dated 1909, T). Page numbers were not obtained.

### A.2 Grenz infantry (Kienmayer): the open question "brown in 1805?"

The leads below were not read (S), and all are web secondary or tertiary. **They point one way:**
- In 1805 the Grenzer's regulation **field** coat was **white**, with blue Hungarian breeches.
- **Brown** was the home dress (Hausmontur), worn on the Military Border.
- Brown became the field coat only by the imperial resolution of **18 August 1808**, and was introduced slowly (1809-1813).

**But the primary basis has not been read**: the 1798 regulation, the Mollo plates, Wrede, and the 1808 resolution itself.
**The question stays open.**

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Home dress | "The Grenz always had a brown uniform, the 'Hausmontur', which they wore while on frontier duty at home and which they had to supply themselves." | uncertain | B* | TMP forum thread "Austrian Grenzer uniforms" (TER), http://theminiaturespage.com/boards/msg.mv?id=103836 and/or "Blunders on the Danube: Grenz-Infanterie" (TER blog, 2011), https://blundersonthedanube.blogspot.com/2011/02/grenz-infanterie.html | S | Both pages came up with this wording; the summary cannot say which page it is from. |
| Field dress from 1798 | "From 1798 the Grenzers were supposed to wear the white feldmontur in the field, white tunic and blue Hungarian breeches, red cloak on the pack, with either black or white belts." | uncertain | B* (for 1805: the rule, not proof of what was worn) | same pages (TER) | S | "Supposed to": a rule, not an observation. |
| Field dress, wartime | "During wartime while going outside the Military Border, Grenzers were obliged to carry Battalion white 'Montur', which they got from the military warehouse or from military suppliers. Domestic and peacetime uniforms were brown and were worn during service in areas within the Military Border." | uncertain | B* | E. Acerbi, "The Austrian Imperial-Royal Army 1805" (Grenz chapter), napoleon-series (W), https://www.napoleon-series.org/military-info/organization/Austria/ArmyStudy/c_AustrianArmyGrenz.html | S | Acerbi also wrote *The Austrian Army 1805-1809, Vol. 2: Grenzer, Landwehr, Elite Forces* (Soldiershop) (T, through a zinnfigur.com listing). |
| Belts, 1805 | "In 1805, black belts worn over the jacket were introduced for Grenzers." | uncertain | A* if confirmed | Acerbi, as above (W) | S | The one dated 1805 detail found. Its source is not given in the summary. |
| Change of colour | "With the 1807-1808 reform, the Grenzer battalions had to change the old white jackets with new brown ones, comprehensive of black shoulder belts." | uncertain | B* | Acerbi, as above (W) | S | That is, white was the field jacket up to 1807-08. |
| The 1808 resolution | "With the 'kaiserliche Entschliessung' of August 18, 1808 the former difference between Home and Field uniforms was abandoned." | uncertain | B* (as a date) | Lead from the search hits TMP 103836 / 233399 / 558123, General de Brigade forum, lombardoveneta.weebly.com "I grenzers" (all TER); not attributable to one page | S | The primary act itself is to be found in the Kriegsarchiv or in Wrede. |
| The 1808 uniform | Dark brown coats with facing-colour collars, pointed cuffs with white bear's-paw lace, and turnbacks; black leatherwork; blue Hungarian trousers with yellow-black braid; "a peak was added to the shako". | uncertain | B* (for 1808, not 1805) | Hits: jemimafawr.co.uk "Imperial & Royal ... Part 3: Light Troops" (2020), rafa-pardo-almudi.blogspot.com "Austrian Grenzer" (2009) (TER) | S | "A peak was added" suggests a peakless shako (Czako) before 1808: **inference**, unconfirmed. |
| Pace of change | Brown tunics not worn in the field until after 1809; "by 1812 only 4 regiments out of 11 had switched"; Grenz IR 9 adopted it only in 1813, "according to Dave Hollins in his book 'Austrian Auxiliary Troops 1792-1816'". | uncertain | B* | jemimafawr.co.uk blog (TER), citing D. Hollins, *Austrian Auxiliary Troops 1792-1816*, Osprey MAA 299 (1996) (O) | S | **Osprey (popular secondary)**; seen cited, not read. |
| Why brown | "The color brown began to become the distinguishing hue of the Grenzers ... The main reason which led to the adoption of this new colour was the depot large availability of the former old home uniforms." | uncertain | C* | Lead from the same group of hits (Acerbi and/or lombardoveneta, W or TER) | S | |
| Szekler home dress | A regulation standardised the Hausmontur jacket as dark brown for all, "eliminating the black of the Transylvanians and the gray of the Wallachians". | uncertain | C* | Lead from the same group of hits (TER or W) | S | **Relevant here:** the Szekler regiments (Nr. 14 and 15) were Transylvanian. If they wore home dress in 1805, it may have been **black**, not brown. Date of the standardisation not given. **inference** |
| Reserve formations | "All Grenzers wore the simpler Hausmontur (basically home made) on frontier duty and the reserve formations would have worn this if called into the field: Klobuk, brown jacket, white trousers, opanken shoes." | uncertain | C* | Same group of hits (TER) | S | Applies to reserve formations, not to the field battalions at Austerlitz. |
| A later painted reconstruction | R. von Ottenfeld, "Grenz-Scharfschütze und Grenz-Infanterist um 1798", oil on cardboard, 1896, Heeresgeschichtliches Museum, Vienna. | uncertain | SP (1896) | List of Ottenfeld's works at hellenicaworld.com (TER) | S | Coat colours as painted not known; inventory number not obtained. Ottenfeld's drawings and sketches for the 1895 work are also said to be in the HGM (S). |
| The debate itself | The hobby literature disputes white against brown, even for 1809. | fact (that a debate exists) | n/a | TMP thread titles: "Say it Ain't so: Austrian Grenze 1809 had white coats?!?" (msg 233399), "Grenzers in shakoes?" (msg 222099), "Grenzers?" (msg 558123) | T | Titles only. |
| Grenz headgear 1805 | Shako, helmet or casquet? | could not be sourced | n/a | n/a | n/a | See "a peak was added" above (inference only). |

### A.3 Cuirassiers (Caramelli: Nassau Nr. 5, Lothringen Nr. 7; Weber: Kaiser Nr. 1)

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Coat, armour, helmet | In 1798 there were 12 cuirassier units, "dressed in the familiar white coats, front plate only cuirass, and crested helmets". | uncertain | B* | WarHistory.org, "The Austrian Army Takes Stock" (W) | S | Helmet details (comb, crest colour, plate) and the cuirass's finish (blackened?) were not found. |
| Facings, Kaiser Nr. 1 | Dark red, white buttons (table for 1802-14). | uncertain | C* | napoleonguide.com "Austrian Cuirassiers Colour Facings" (TER), https://www.napoleonguide.com/cavalry_aucolcur.htm | S | Check against the Schematismus 1805. |
| Facings, Nassau-Usingen Nr. 5 | Light blue, white buttons (the table lists it as "Marquis Sommariva, formerly Nassau-Usingen"). | uncertain | C* | same (TER) | S | The Sommariva name shows a post-1805 table. |
| Facings, Lothringen Nr. 7 | Dark blue, white buttons. | uncertain | C* | same (TER) | S | |
| Plate | Teuber and Ottenfeld 1895, Tafel 35, "Kürassiere 1798-1806". | uncertain | SP | Plate list (vestes-bellica.com) | S | |
| Blog | "Blunders on the Danube: Austrian Napoleonic Cuirassier Uniforms" (2020). | n/a | TER | https://blundersonthedanube.blogspot.com/2020/02/austrian-cuirassiers.html | T | |

### A.4 Chevaulegers (O'Reilly Nr. 3) and uhlans (Merveldt Nr. 1, 40 men)

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| O'Reilly coat colour | **White** coat (not dark green), poppy-red (*ponceau*), "bright red" facings and yellow buttons, in 1805. | uncertain; **contradicts the brief's assumption** | B* | "Blunders on the Danube: Austrian Napoleonic Dragoons and Chevaulegers" (2012, TER), https://blundersonthedanube.blogspot.com/2012/02/austrian-napoleonic-dragoons-and.html; napoleonguide "Austrian Chevauxlegers Colour Facings" (TER), https://www.napoleonguide.com/cavalry_aucolclg.htm | S | Two hobby sources agree. A specialist check is needed (Haythornthwaite MAA 181, O; Wrede Bd. III, SP; the Schematismus 1805, P). |
| Green against white | After 1801 the dragoons were split into dragoons and chevaulegers. The intention was that the chevaulegers keep green and the dragoons return to white, but "in practice this never quite happened and some of the Chevauxleger regiments adopted white". Also: "by 1805 an official order directed that some of the Chevauleger regiments wear dark green coats and others white". | uncertain | B* | Same group of hits (TER) | S | |
| Recruitment | "The superb O'Reilly Chevaulegere Regiment was formed of Poles." | uncertain | C* | napolun mirror (TER) | S | Not about appearance. |
| Plates | Teuber and Ottenfeld 1895, Tafel 38, "Jäger zu Pferde und leichte Dragoner 1800"; Tafel 30, "Chevauleger und Husar zu Pferd, 1769/1798" (before our period). | uncertain | SP | Plate list (vestes-bellica.com) (S); AbeBooks print "Österreich: Chevauleger und Husar 1769-1798 (1895)" (T) | S/T | |
| Chevauleger helmet | not found | could not be sourced | n/a | n/a | n/a | |
| Uhlans | Teuber and Ottenfeld, Tafel 37, "Uhlan 1798-1805". | uncertain | SP | Plate list (S) | S | Uniform details not found. |

### A.5 Hussars (Hessen-Homburg Nr. 4; Szekler Nr. 11)

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Plate | Teuber and Ottenfeld 1895, Tafel 36, "Husar zu Pferd, 1798/1806". | uncertain | SP | Plate list (vestes-bellica.com) and DDB summary | S | |
| Dolman, pelisse and breeches colours; headgear (shako or fur cap) in 1805 | not found | could not be sourced | n/a | n/a | n/a | The search budget ran out before these could be searched. |

### A.6 Artillery and train (Kienmayer's 12 guns; Kollowrat's two 12-pounder position batteries)

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Coat colour | "The Austrian artillery were traditionally uniformed in brown jackets until the end of the Empire." | uncertain | B* | WarHistory.org, "The Austrian Army Takes Stock" (W) | S | |
| Plate | "Uniformdarstellung, Offizier und Kanonier der Artillerie, Gemeiner des Militär-Fuhrwesens, Österreich, 1798/1803. Tafel 39 aus: Ottenfeld/Teuber: Die österreichische Armee." | fact (the plate exists, with this title) | SP | Deutsche Digitale Bibliothek, item JOCV4FGWKH2RZNEPHWI3RXVX25UFEM3A (original in the DHM, Berlin), https://www.deutsche-digitale-bibliothek.de/item/JOCV4FGWKH2RZNEPHWI3RXVX25UFEM3A | T | Shows an officer, a gunner and a train driver (Fuhrwesen) for 1798-1803. Contents not seen. |
| Facings (red?) and headgear (hat?) | not found | could not be sourced | n/a | n/a | n/a | A forum thread "Österreichische Artillerie 1792-1800" (forum.napoleon-online.de, TER) exists (T). |

### A.7 Generals and staff (Allied headquarters, column commanders)

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Plate | "Uniformdarstellung, General und Adjutant, Österreich, 1798/1805. Tafel 34 aus: Ottenfeld/Teuber: Die österreichische Armee." | fact (the plate exists) | SP | Deutsche Digitale Bibliothek, item TTM6EGVG3AATRKFCZDLVAA2HQACPYGIN (DHM), https://www.deutsche-digitale-bibliothek.de/item/TTM6EGVG3AATRKFCZDLVAA2HQACPYGIN | T | The plate dated exactly to our year. Contents not seen. |
| Regulation | The 1798 regulation required generals to appear before their men with coats "fully buttoned" and called officers' wearing of civilian dress a "dangerous delusion". | uncertain | B* | WarHistory.org (W) | S | |
| Coat, facings, hat and plume; staff officers' uniform; Weyrother and the other Austrian staff officers | not found | could not be sourced | n/a | n/a | n/a | |

### A.8 Horses

Horse colours by regiment or arm: **could not be sourced.**

---

## (B) COLOURS AND STANDARDS

### B.1 Which pattern was in use in 1805

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Patterns | "Three main patterns of flags were used" by the Habsburg army in the period. | uncertain | B* | en.wikipedia "Flags of the Austrian Army during the French Revolutionary and Napoleonic Wars" (TER), https://en.wikipedia.org/wiki/Flags_of_the_Austrian_Army_during_the_French_Revolutionary_and_Napoleonic_Wars | S | Its references were not visible (the domain is blocked), so they could not be followed. |
| 1792 pattern | When Francis II succeeded in 1792, "a new pattern was created known today as the 1792 pattern, where the initials FII replaced those of JII". | uncertain | B* | same (TER) and/or napitalia.org.uk (TER) | S | "Known today as": a modern label. |
| 1804 pattern | "An Imperial Patent of 11 August 1804 issued a new pattern to reflect the creation of the Austrian Empire, but the production order was not given until 28 March 1805." Also: "It cannot be established how many were actually made. However, it appears that only a couple were made." | uncertain | A* for the dates if traced | Same group of hits: Wikipedia, napitalia.org.uk "Austrian Ordinärfahne Standards" (TER) | S | So the 1804 pattern was **rare in 1805**: lead. |
| Old flags kept | "Although new patterns were approved in 1804 and 1806, regiments continued to use their old flags until they became worn out. These older flags were often only 'updated' by painting changes onto the originals." | uncertain | B* | same group of hits (TER) | S | |
| Older flags still in use in 1805 | "Four cavalry standards captured by the French in the 1805 campaign were of the 1769-1780 pattern as the cypher 'MT'". | uncertain | A* if traced | same group of hits (TER) | S | Maria Theresa's cipher on standards carried in 1805. Where they were taken is not given. |
| Conclusion | In 1805 Austrian battalions most likely carried **1792-pattern flags (cipher FII)**, some older flags, and at most a few of the 1804 pattern. | inference | C | from the four rows above | n/a | The 1806 pattern (after 6 August 1806) **post-dates the battle** and must not be used as evidence for it. |

### B.2 The Leibfahne

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Field | White. | uncertain | B* | Wikipedia "Flags of the Austrian Army ..." (TER); napoleon-series "Austrian Regular Infantry" (c_ausinf5) (W) | S | Several hits agree. |
| Sides, 1792 pattern | "The Leibfahne of 1792 for all regiments was white with a border in the colors of Austria and the Holy Roman Empire". The front bore heraldic elements; "the reverse showed the Virgin Mary with the Christ Child in her arms, floating on clouds and surrounded by a radiant halo". | uncertain | B* | same group of hits (TER) | S | A **Madonna and Child**, not explicitly an Immaculata: see Disagreements. |
| Sides, 1806 pattern | White silk; on the reverse "the Virgin Mary within a gold aura. Twelve silver stars circled the Virgin's head"; on the obverse "the Imperial 'doppeladler' (double-headed eagle) in black, with a number of heraldic devices thereon". | uncertain | B* (for 1806, not 1805) | FOTW (crwflags), "Austrian Military Colours" (TER), https://www.crwflags.com/fotw/flags/at%5Ecol.html | S | Twelve stars suggest Immaculata iconography, but **in the 1806 pattern**. |
| Who carried it | Before June 1805, the 1st (Leib) battalion; after the decree of 22 June 1805, "the Grenadier (or Leib Battalion)". | uncertain | B* | Wikipedia (TER) | S | See B.6. |
| Contemporary-style depictions | NYPL, Vinkhuijzen collection: "Leibfahne vom Jahre 1806 ; Leibfahne vom Jahre 1816". A Vinkhuijzen series covers "flags and standards carried by Austrian troops ... the Army 1792-1810" (S). | fact (the item exists) | SP or P? (book not identified) | https://digitalcollections.nypl.org/items/510d47d9-9400-a3d9-e040-e00a18064a99 | T | According to the summary, Wikipedia also uses NYPL images of a "1780 pattern modified to 1792 pattern Ordinarfahne" and a "1804 Ordinarfahne" (S). |

### B.3 The Ordinarfahne, and the black-and-yellow question

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Field and eagle | Yellow field with the black double-headed eagle. | uncertain | B* | Wikipedia "Flags of the Austrian Army ..." (TER); austria-forum essay "Österreichische Flaggen in der Monarchie" (TER), https://austria-forum.org/af/Wissenssammlungen/Essays/Geschichte/%C3%96sterreichische_Flaggen_in_der_Monarchie | S | austria-forum (S): "regiments with white flags and with yellow flags, with the yellow flag variant having the imperial eagle on both sides". |
| Black and yellow | So the Ordinarfahne was in the Habsburg (Imperial) black and yellow, and its flame border added red and white, the colours of Austria. | inference from the leads | B* | austria-forum essay (TER): border of triangles "in black, gold, red and white (the colors of Austria)" | S | The essay's description is not dated in the summary and may describe a later pattern. |
| 1806 Ordinarfahne | "Made of yellow silk with black, red and white 'flames' pointing outwards on three sides." | uncertain | B* (for 1806) | FOTW, "Austrian Military Colours" (TER) | S | 1806, not 1805. |

### B.4 The border of flames

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Colours and width | "The 'flames' each 16 cm wide at the base in red, black, yellow and white, the last two replaced by gold and silver on the Leibfahne throughout the period." | uncertain | B* | Wikipedia "Flags of the Austrian Army ..." (TER) | S | The same wording recurs in several summaries, so it is probably close to the article's text. |
| Width, another lead | A 12 cm border "with an embedded trim showing alternating black-gold-red-silver flames". | disputed | C | austria-forum essay (TER) | S | 12 cm against 16 cm. |
| Sides and colours, 1806 | Leibfahne: "a border on three sides of red and black 'flames' pointing outwards"; Ordinarfahne: "black, red and white" flames on three sides. | disputed (with the four-colour description) | C | FOTW (TER) | S | Possibly the 1806 pattern differs from 1792, or one description is wrong. |

### B.5 Dimensions and pole

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Cloth | 161 x 142 cm. | uncertain | B* | Wikipedia "Flags of the Austrian Army ..." (TER) | S | The brief's "about 175 x 130 cm?" has **no support** in what was found. The proportion 161:142 (about 1.13:1) is nearly square. |
| Pole length; finial | not found | could not be sourced | n/a | n/a | n/a | |

### B.6 How many flags per regiment and battalion in 1805

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Up to 1805 | "From 1768 until 1805, each infantry regiment carried two flags per battalion: the 1st or Leib Battalion carried the white Leibfahne and one yellow Ordinarfahne, while the others used two Ordinarfahnen." | uncertain | B* | Wikipedia "Flags of the Austrian Army ..." (TER) | S | |
| June 1805 | "An Imperial Decree of 22 June 1805 reduced the flags to one per battalion, the Grenadier (or Leib Battalion) carrying the white Leibfahne as it was the senior battalion and the others carrying one Ordinarfahne each." | uncertain | A* if the decree is traced | same (TER) | S | Whether it had been carried out by 2 December 1805 is **not established**. |
| December 1806 | "When the army reverted to its former organisation on 6 December 1806, so did the flags: Leibfahne plus one Ordinarfahne for 1st (Leib) Battalion, two Ordinarfahnen for the others." | uncertain | B* | same (TER) | S | After the battle. |
| What this means for the IV Column | Kollowrat's single battalions (many of them 6th battalions) would each have carried at most **one** flag, most likely an **Ordinarfahne** (yellow). A white Leibfahne is unlikely in a single depot battalion. **Whether depot battalions carried colours at all was not found.** | inference | C | from the rows above | n/a | |

### B.7 Grenz colours

**Could not be sourced.**

### B.8 Cavalry standards

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Captured 1805 standards | Four cavalry standards captured in the 1805 campaign carried the Maria Theresa cipher ("MT"; pattern 1769-1780). | uncertain | B* | Wikipedia / napitalia (TER) | S | Which regiments, and where taken: not given. |
| Which arms carried standards (cuirassiers and dragoons; hussars and chevaulegers?); Leibstandarte and Eskadronsstandarte; size | not found | could not be sourced | n/a | n/a | n/a | |

### B.9 Carried uncased in action?

**Could not be sourced.**

### B.10 Austrian colours lost at Austerlitz

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Total | The Allies lost about 45 flags (with 180 guns) at Austerlitz. | uncertain | B* | de.wikipedia "Schlacht bei Austerlitz" (TER) | S | How many were Austrian: **not established**. Another summary speaks of "forty flags, the standards of the Russian Imperial Guard". |
| Survivors in Paris | Four Austrian flags of the 1805 campaign escaped the burning of trophies in the courtyard of the Invalides in 1814 (on Sérurier's order, about 1,500 trophies burned) and hang above the altar of Saint-Louis des Invalides. | uncertain | B* | Musée de l'Armée, "Les drapeaux de la cathédrale Saint-Louis des Invalides" (museum handout, PDF), https://www.musee-armee.fr/fileadmin/user_upload/Documents/Support-Visite-Fiches-Presentation/MA_drapeaux-cathedrale-st-Louis.pdf | S | The summary says "captured from Austria at Austerlitz" in one sentence and "captured during the 1805 campaign in Germany and Austria" in another. **Provenance ambiguous.** |
| Their pattern | 1792-pattern Ordinarfahnen (numbered 1-4 on the page): "many regiments continued to carry their old colours in 1805, when they were captured by the French (presumably at the battle of Austerlitz)". | uncertain | C | FOTW, "Flags of Saint-Louis-des-Invalides Cathedral" (TER), https://www.crwflags.com/fotw/flags/fr%5Einval.html | S | "Presumably": FOTW does not know. **Ulm (October 1805), where whole regiments surrendered, is an obvious alternative: inference.** If they were taken in 1805 they would be the best physical evidence of what was carried that year, but they need inventory numbers and the museum's provenance. |
| Images | Carnavalet prints: "Drapeaux pris à Austerlitz reçus à Notre-Dame"; "Austerlitz ; Rapp présentant à l'empereur les drapeaux pris à Pratzen". | fact (the items exist) | P? (dates not seen) | https://www.parismuseescollections.paris.fr/fr/musee-carnavalet/oeuvres/drapeaux-pris-a-austerlitz-recus-a-notre-dame ; .../austerlitz-rapp-presentant-a-l-empereur-les-drapeaux-pris-a-pratzen | T | Whether the flags shown are Austrian is not known. |

### B.11 The reconstruction's present Austrian flag

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| What is drawn | An off-white field with gold bands across the top and bottom and a black disc in the centre. | fact | n/a | `app.js` lines 1153-1157 | R | |
| Against the evidence | It matches **no pattern** in the leads. None has a plain white field with horizontal gold bands. Both infantry flags have a **flame border** (at least on three sides) and a **central figure**: the eagle on the Ordinarfahne; the Madonna on one side of the Leibfahne and the eagle on the other. | inference | C | B.2-B.4 | n/a | |
| What the leads would support (a design decision for the owner, not taken here) | The common flag of an 1805 battalion would be the **yellow Ordinarfahne with a black double-headed eagle and a flame border** (red, black, yellow and white per Wikipedia). At most one battalion per regiment carried the white **Leibfahne**. For Kollowrat's single battalions an Ordinarfahne is the defensible default. All of this is subject to reading the sources. | inference | C | as above | n/a | It is a data and presentation decision for the owner (CLAUDE.md: "do not change it silently"). |

---

## Disagreements

1. **Flame border.**
   - Four colours, apparently on all four sides: red, black, yellow and white, with gold and silver for yellow and white on
     the Leibfahne (Wikipedia; austria-forum: black, gold, red and silver).
   - Three sides only: red and black on the Leibfahne, black, red and white on the Ordinarfahne (FOTW, describing **M1806**).
   - This may be a difference between patterns, or an error in one of them. Unresolved.
2. **Flame width.** 16 cm at the base of each flame (Wikipedia) against a 12 cm border (austria-forum).
3. **The Leibfahne's Marian image.** "The Virgin Mary with the Christ Child ... floating on clouds ... radiant halo" (the
   1792 description) against "the Virgin Mary within a gold aura ... twelve silver stars" (FOTW, M1806). These are a Madonna
   and Child against Immaculata-type iconography. The brief's "Immaculata" is not established for 1805.
4. **Turnbacks of the infantry coat.**
   - Facing colour: WarHistory, on the 1798 regulation.
   - White edged with the facing colour, and a white collar with a facing patch: an unattributed hit, possibly another army
     or period.
5. **Kollowrat's "6th battalions".**
   - Depot battalions of sick men and recruits (napoleon.org).
   - Mack's 1805 sixth "elite" battalion of grenadiers and velites, the depot only in peacetime (Wikipedia and Acerbi
     summaries).
   - This decides whether grenadier caps belong in the IV Column.
6. **Strength of the Salzburg regiment.** "6 battalions, 6,000" (napoleon-series summary, garbled as "Landwehr") against
   about 3,000 (battlefieldanomalies.com).
7. **Kienmayer's cavalry.** 20 squadrons (weaponsandwarfare) against 22 (de.wikipedia).
8. **Facings of IR 29 Lindenau.** White (an Acerbi-type summary) against pale blue (napoleonguide).
9. **Chevauleger coat.** The brief assumes dark green; the leads say **white** for O'Reilly Nr. 3 in 1805, with poppy-red
   facings and yellow buttons. Some chevauleger regiments were green and some white.
10. **The Grenz coat in 1805.**
    - The leads found say the field coat was white under the 1798 rule, brown was the home dress, and brown became the field
      colour from 18 August 1808 (in use 1809-1813).
    - The common image is of brown-coated Grenzer, and a hobby thread asks whether they were still white in 1809.
    - The Szeklers' home dress may have been **black**, not brown.
11. **The four Austrian flags at the Invalides.** "Presumably" taken at Austerlitz (FOTW) against "the 1805 campaign" (Musée
    de l'Armée summary). Ulm is possible.
12. **Dimensions.** The brief's "about 175 x 130 cm" against the only figure found, 161 x 142 cm.

---

## Could not be sourced in this pass

These are gaps caused by blocked access and the exhausted search budget. They are not negative findings.

- **The shako.** When it was adopted (1806?) and whether any Austrian infantry wore it at Austerlitz.
- **Line infantry, beyond the coat.**
  - German legwear (white breeches, black gaiters).
  - Hungarian legwear (light blue breeches with braid), except the Grenz rule's "blue Hungarian breeches".
  - The grenadiers' bearskin and its plate.
  - Whether each IV Column regiment was German or Hungarian.
- **Grenz infantry.** Headgear in 1805; the facings of Grenz IR 7, 14 and 15.
- **Cavalry.**
  - Cuirassier helmet details and the cuirass's finish.
  - The chevauleger helmet.
  - Hussar dolman, pelisse and breeches colours and headgear (Nr. 4 and Nr. 11).
  - The uhlan uniform.
- **Artillery.** Facing colour and headgear.
- **Generals and staff.** The generals' uniform, and the uniform of the general staff (Generalquartiermeisterstab).
- **Horses.** Colours by regiment or arm.
- **Colours and standards.**
  - Grenz colours.
  - Cavalry standards: which arms carried them, their types and size.
  - Pole length and finial.
  - Whether colours were carried uncased in action.
  - Which Austrian colours, if any, were lost at Austerlitz itself.
- **Sources not reached.**
  - Whether "Otto von Pivka" is a pen name of Digby Smith: not checked; no evidence either way.
  - Rothenberg, *Napoleon's Great Adversaries* (1982).
  - Knötel, *Uniformenkunde*.
  - HGM inventory numbers.
  - Gerhard Haschke.
  - Haythornthwaite, MAA 176 and 181 (O): only seen to exist (a Nationaal Militair Museum catalogue record, T).
  - Wise, MAA 78 (O): seen to exist (Osprey listing, T).
  - K. Over, *Flags and Standards of the Napoleonic Wars* (1976) (PS): seen to exist.
  - *Uniforms of Austerlitz: Napoleonic Uniforms of the Grand Armée and the Russian and Austrian Imperial Armies of 1805*
    (ISBN 978-1-7396950-0-2): seen to exist; author not established.

## Where to verify, in order of value

1. **The Mollo and Mansfeld plates of c. 1798** (primary pictorial; napoleon-series reproductions from the ULB Darmstadt
   copy). They cover infantry coat and helmet, Hungarian and German legwear, the Grenz field dress and the cavalry.
2. **The Schematismus der k.k. Armée for 1805** (primary; Hungaricana, Austrian State Archives collection). It gives facings
   and buttons for:
   - infantry: IR 1, 9, 20, 23, 24, 29, 38, 49, 55, 58;
   - Grenz infantry: GIR 7, 14, 15;
   - cuirassiers: KR 1, 5, 7;
   - chevaulegers: ChL 3;
   - hussars: HR 4, 11;
   - uhlans: UR 1.
3. **Teuber and Ottenfeld (1895)**, digitised by ULB Tirol: Tafeln 32-39 and the text, including its flag figures ("Leibfahne
   vom Jahre 1806" and others). Treat it as a careful 1895 reconstruction, not as primary.
4. **Wrede, *Geschichte der k. und k. Wehrmacht*** (HathiTrust 007324046; Hungaricana): the regiment entries (facings), the
   history of the Grenz uniform, and the flag decree of 22 June 1805, with page numbers.
5. **The Wikipedia article "Flags of the Austrian Army during the French Revolutionary and Napoleonic Wars"**: follow its
   footnotes for "161 x 142 cm", "16 cm flames", "22 June 1805" and "11 August 1804 / 28 March 1805", and cite what they cite.
6. **The Musée de l'Armée**: inventory numbers and capture records for the four Austrian flags in Saint-Louis des Invalides
   (Austerlitz or Ulm).
7. **The HGM**: Ottenfeld's "Grenz-Scharfschütze und Grenz-Infanterist um 1798" (1896), its inventory number and the colours as
   painted; HGM flag holdings of the 1792 pattern.
8. **Hollins**, *Austrian Auxiliary Troops 1792-1816*, MAA 299 (O), on when the Grenz brown was adopted, cross-checked with
   Haythornthwaite MAA 176 and 181 (O).

## Search log (abridged; all through WebSearch, no page fetched)

- **Order of battle.** Austerlitz Austrian order of battle (Kienmayer, Kollowrat with Jurczek and Rottermund, Liechtenstein
  with Caramelli and Weber); the "6th battalions"; the Mack 1805 reorganisation; the Merveldt uhlans.
- **Grenz infantry.** "Grenzinfanterie 1805 brauner Rock"; "Hausmontur braun weiß Feldmontur 1798 1808"; the Grenz brown coat
  1808, 1798 or 1769.
- **Plates.** Teuber and Ottenfeld plates (DDB "Uniformdarstellung"); the Mollo and Kininger 1798 "Abbildung der neuen
  Adjustirung"; WarHistory "1798 Adjustierungsvorschrift"; infantry turnbacks.
- **Facings.** Facings for IR 1, 9, 20, 23, 24, 29, 38, 49, 55, 58; cuirassier facings for KR 1, 5, 7; O'Reilly chevaulegers.
- **Flags.** "Ordinärfahne 1792 ... Flammen"; "Leibfahne ... Immaculata ... 1792 1804 1806"; NYPL Vinkhuijzen flag plates;
  "161 x 142 cm"; 1804 pattern; captured 1805 standards; Invalides trophies; Austerlitz flag losses.
- **Primary sources.** Militär-Schematismus 1805; Wrede's volumes.
- **Not searched (budget exhausted).** Hussars, artillery facings, generals, horses, the shako of 1806, Grenz headgear, cavalry
  standards, Grenz colours, Pivka and Digby Smith.
