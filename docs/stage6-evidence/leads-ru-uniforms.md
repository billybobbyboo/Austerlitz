> **Stage 6 Part A, evidence register (`docs/STAGE6_SPEC.md` §2). Leads, not evidence.** Compiled on 4 October 2026 by the research
> pass of this part. No external source was read: the session's network policy refuses every host that holds them (HTTP 403;
> `docs/STAGE6_SPEC.md` §2.0), and the search tool's summaries are machine-written and not a source. Every external row is a lead to
> read in 6B; no grade in it is a verified grade. Texts reached through copies in other GitHub repositories are excluded (this session
> may read only its own repository). Nothing here may change the data or the drawing until its source is read.

# Russian army at Austerlitz (2 December 1805): appearance, leads only

Research file for Stage 6 (historical appearance). Compiled 4 October 2026, revised the same day under the coordinator's
binding constraints. The question was what the Russian units drawn in the reconstruction wore on 2 December 1805: coats,
facings, legwear, headgear, horse colours, greatcoats.

---

## 0. Status: nothing external was read

**No external source was read.** This file contains **no evidence**, only **leads**: author, title, date, URL, and what
each is expected to show. **Every lead is graded "unread", and its access is "not read (blocked)".** Nothing here may go
into `data.js` or the renderer until the source has been read and graded.

Why:

1. **Network policy.** WebFetch returned `EGRESS_BLOCKED` for every source host I tried. Among them: ru.wikipedia.org,
   en.wikipedia.org, archive.org, commons.wikimedia.org, runivers.ru, rusneb.ru, prlib.ru, lib.geraldika.ru, raruss.ru,
   napoleon-series.org and books.google.com. HTTP probes from the shell also failed (no connection, or 403) for hathitrust,
   gallica, digi.ub.uni-heidelberg, digitale-sammlungen, europeana, loc.gov, digitalcollections.nypl.org,
   library.brown.edu, hermitagemuseum.org, shm.ru, militera.lib.ru, adjudant.ru, dlib.rsl.ru, elib.shpl.ru,
   vivaldi.nlr.ru, ru.wikisource.org, web.archive.org, marksrussianmilitaryhistory.info, memorandum.ru, litresp.ru,
   imha.ru, forma-odezhda.com, prussia.online, reenactor.ru, topwar.ru, napolun.com, theminiaturespage.com and tapatalk.com.
2. **Search.** WebSearch ran 54 queries for this agent, in Russian and English. Then it refused: "this session has used
   its web search budget (200 of 200 WebSearch calls)". The budget is shared across the session, and per the
   coordinator's rule I stopped searching. A search call returns result listings (title and URL) and a machine-written
   summary. **The summaries are not evidence.** They were used here only to work out *which* source to read and *what*
   it may show. Listing titles are given verbatim, to identify the source.
3. **GitHub.** Before the coordinator's constraint arrived, I ran 8 GitHub code searches and 1 WebFetch of a github.com
   search page, plus HTTP status probes of github.com and raw.githubusercontent.com. They returned nothing relevant.
   **No text from GitHub is used in this file.** The only repository text used is the project's own `data.js` and `docs/`,
   read locally.
4. **No quotations.** No source text was read, so there are no quoted passages and no translations of them. Russian titles
   are given verbatim with a translation in brackets.

### Legend
- **Grade.** "unread" for every external lead. A, B and C (A = documented for 1805; B = documented for the period and
  probable for 1805; C = reconstructed or disputed) can only be assigned after reading.
- **Label.** "uncertain (unread lead)" for a single lead. "disputed (unread leads conflict)" where leads point different
  ways. "inference (from unread leads)" for my own reasoning on top of leads. "derived" for arithmetic.
- **Access.** "not read (blocked)" for every external lead.
- **"Seen as"** in the note column says how the lead surfaced: as a *listing title* (verbatim from the search index) or
  in a *search summary* (machine-written, not evidence).
- **Viskovatov.** A. V. Viskovatov, *Историческое описание одежды и вооружения российских войск* [Historical description
  of the clothing and arms of the Russian troops], St Petersburg 1841-62 (1st edition, 30 parts; a 2nd edition in 34
  parts, 1899-1948). Part numbers below follow M. Conrad's English translation pages (specialist secondary); which edition
  they follow is not checked. **No page or plate number was identified.**

---

## 1. Order of battle (which regiments to dress)

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote/note |
|---|---|---|---|---|---|---|
| V Column, Russian cavalry | Expected to show: Grand Duke Constantine's Uhlans (division of Lt-Gen Essen II), Elisavetgrad Hussars, and Kharkov and Chernigov Dragoons (under Lt-Gen Uvarov; possibly Maj-Gen Penitzky's brigade) | uncertain (unread lead) | unread | G. Nafziger, "Austrian Order of Battle at Austerlitz, 2 December 1805", n.d., napoleon-series.org/nafzigger/805LCJ.pdf; Napoleon Series, "Russian-Austrian Order-of-Battle at Austerlitz: 2 December 1805", compiler and date not seen, napoleon-series.org/military-info/battles/Austerlitz/c_austerlitzoob1.html (and …oob2.html) | not read (blocked) | Seen as: listing titles and search summary. A Russian-language summary (sources among ru.wikipedia "Битва под Аустерлицем", rushist.com, diletant.media) suggests the same four regiments. **"Gladkov" surfaced in no lead.** Also: austerlitz.org, "History trail of the Austerlitz battlefield" (tertiary) |
| Constantine's Uhlans in action | Expected to show: led the column, charged early, were met by Kellermann's light cavalry; losses possibly 28 officers and 480 men | uncertain (unread lead) | unread | Russian page, not identified (summary only) | not read (blocked) | Seen as: search summary |
| Bagration's advance guard | Expected to show: 15 battalions, 35 squadrons, 44 guns. Dolgorukov: 5th and 6th Jägers. Kamensky II: Arkhangelogorod Musketeers. Engelhardt: Old Ingermanland and Pskov Musketeers. Wittgenstein: Pavlograd and Mariupol Hussars. Voropaitzky: Her Majesty's Life Cuirassiers, Tver and St Petersburg Dragoons (5 sqns each). 6-pdr horse batteries Nr 1 and Nr 4. Cossacks | uncertain (unread lead) | unread | Napoleon Series OOB (as above); historyofwar.org, "Battle of Austerlitz, 2 December 1805" (tertiary) | not read (blocked) | Seen as: listing titles and search summary. The project dataset gives 42 guns; the lead suggests 44 |
| Her Majesty's Life Cuirassiers | Expected to show: present with Bagration (5 sqns). His Majesty's Life Cuirassiers were in Pomerania (P. A. Tolstoy's corps) | uncertain (unread lead) | unread | Napoleon Series OOB; *История лейб-гвардии Кирасирского Её Величества полка* [History of the Life Guard Cuirassier Regiment of Her Majesty], vol. 1, date not seen, prlib.ru/item/958929 (the regimental history; the best lead); ru.wikipedia "Кирасирский Его Величества лейб-гвардии полк" (tertiary) | not read (blocked) | Seen as: listing titles and search summary. If confirmed, a line cuirassier regiment was on the field; the project dataset does not name it |
| Kamensky's brigade | Ryazan Musketeers and Fanagoria Grenadiers | fact per project data (not re-checked) | n/a (project data) | project `data.js` (Duffy 1977, via the Langeron column return) | project file, read locally | |
| Russian Guard composition (Life Grenadiers? LG Hussars? LG Cossacks?) | No lead found | uncertain | n/a | n/a | n/a | Not searched before the budget ran out |

---

## 2. Line infantry (musketeers, grenadiers, fusiliers)

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote/note |
|---|---|---|---|---|---|---|
| Coat, 1802 pattern | Expected to show: the table of 30 April 1802 for grenadier regiments, extended to musketeers. Double-breasted dark-green coat; standing collar in a colour per Inspection; cuffs the same colour; dark-green cuff flaps; red lining; brass buttons; two shoulder straps in a regimental colour | uncertain (unread lead) | unread | Viskovatov, Part 10 (army infantry 1801-25), in M. Conrad's translation, "Viskovatov Vol 10b", date not seen, marksrussianmilitaryhistory.info/V10BAll.htm; the order of 30 April 1802 (PSZ number not identified) | not read (blocked) | Seen as: listing title "Viskovatov Vol 10b Uniforms Russian Army Napoleonic 1812 Alexander Grenadier Musketeers Jagers Marines", and search summary |
| Facing system 1802-07 | Expected to show: Inspection colours for collar, cuffs and the grenadier cap's cloth crown; regimental colours for shoulder straps, cap band and pompon centre; a table for 8 June 1802 - 19 November 1807 | uncertain (unread lead) | unread | Jonathan Gingerich, "Russian Infantry Facings - Inspection Era", Napoleon Series, date not seen, napoleon-series.org/military-info/organization/Russia/Infantry/c_facings.htm (specialist secondary) | not read (blocked) | Seen as: listing title and search summary. The summary suggests Gingerich argues that **Viskovatov's Inspection table rests on a proposal never implemented** (see Disagreements) |
| Fanagoria Grenadiers | Expected to show: Smolensk Inspection; white collar and cuffs; red shoulder straps; grenadier- and fusilier-cap crowns white with red bands | uncertain (unread lead) | unread | Gingerich (as above); possibly Viskovatov Part 10 (a summary mentions "part X, page 205"; garbled, unverified) | not read (blocked) | Seen as: search summary |
| Ryazan Musketeers | Expected to show: from 15 January 1802 (Finland Inspection) yellow collar and cuffs, white shoulder straps (dates garbled) | uncertain (unread lead) | unread | ru.wikipedia, "Рязанский 69-й пехотный полк" (tertiary, a finder only) | not read (blocked) | Seen as: search summary, self-contradictory |
| Organisation (headgear proportions) | Expected to show: Fanagoria from 30 April 1802 with one grenadier and two fusilier battalions of four companies; musketeer regiments with one grenadier and two musketeer battalions | uncertain (unread lead) | unread | ru.wikipedia "Фанагорийский 11-й гренадерский полк" (tertiary); imha.ru regimental page (tertiary); State Historical Museum regiment database, rm.shm.ru/core/regiment/46 | not read (blocked) | Seen as: listing titles and search summary |
| Musketeer headgear, 1802 to early 1805 | Expected to show: bicorne (шляпа), its pompon centre in the regimental colour | uncertain (unread lead) | unread | Gingerich (pompon); napoleonistyka mirror, "Russian Infantry, Grenadiers…", napolun.com/mirror/napoleonistyka.atspace.com/Russian_infantry.htm (tertiary) | not read (blocked) | Seen as: search summary. No lead covers the bicorne's details (edging, loop, cockade, how worn) |
| Shako ordered, February 1805 | Expected to show: 13 February 1805, grenadier and fusilier caps of combatant lower ranks replaced by caps on the 1803 non-combatant pattern (brass grenade, horsehair plume); musketeers given the same cap without grenade or plume in February 1805; peaked caps for non-combatants already on 19 August 1803 | uncertain (unread lead) | unread | Viskovatov Part 10 (Conrad, V10BAll.htm, as above); ru.wikipedia "Кивер" and "Знаки на кивера русской армии 1812 года" (tertiary) | not read (blocked) | Seen as: search summaries. If confirmed, this would refute the "1807" premise for the shako's introduction |
| Form of the 1805 cap | Expected to show: straight, tall (4¼ vershok), widening upward, large peak, leather back protection, cloth ear flaps, chin strap; later strengthened with leather and called "kiver"; a new kiver description in summer 1808 | uncertain (unread lead) | unread | PDF, authors probably Alexin and Ulyanov (from the filename; not confirmed), date not seen, reenactor.ru/ARH/PDF/Alexin-Ylianov.pdf (specialist); ru.wikipedia "Кивер" (tertiary) | not read (blocked) | Seen as: **listing title, verbatim (the PDF's opening line):** "В 1805 г. чины русской императорс- кой гвардии и армии наряду с фетровыми" [In 1805 the ranks of the Russian imperial guard and army, alongside felt …]. 4¼ vershok ≈ 18.9 cm (derived: 1 vershok = 4.445 cm) |
| Headgear worn on 2 December 1805 | Expected to show the dispute: bicorne and 1802 caps, or the 1805 shako, or a mixture | disputed (unread leads conflict) | unread | the reenactor.ru PDF above; General de Brigade forum threads "1805 Russians" and "Russian Grenadiers" (tapatalk, tertiary), which reportedly cite Bowden (bicorne and mitre) and John Cook (shako) and Ulyanov's plates (shako); napoleonistyka mirror (tertiary); en.topwar.ru, "Uniforms of the Russian army at the Battle of Austerlitz", and gulkevichi.com (popular) | not read (blocked) | Seen as: listing titles and search summaries. **No eyewitness, return or contemporary image was found** |
| Pavlovsky Grenadiers' 1802 caps | Expected to show: a decree of 20 January 1808 letting the Pavlovsky keep their 1802-pattern grenadier caps after Friedland | uncertain (unread lead) | unread | ar.culture.ru (Artefact museum guide), "Рядовой солдат Павловского гренадерского полка" [Private of the Pavlovsky Grenadier Regiment]; 1812.nsad.ru/46, "Отечественная война 1812 года. Форма русской пехоты" | not read (blocked) | Seen as: search summary. If confirmed, the 1805 order had not reached every regiment by 1807 (inference). Popular pages say the Pavlovsky fought at Austerlitz in mitres; not checked against an OOB; do not use |
| 1802 grenadier and fusilier caps: shape | Expected to show: surviving caps and their construction | uncertain (unread lead) | unread | "Гренадерские шапки 1802 года. Часть 2. Поиски и находки" [Grenadier caps of 1802, part 2: searches and finds], adjudant.ru/gren/02.htm, author and date not seen; *Цейхгауз* no. 7 (PDF on prussia.online) | not read (blocked) | Seen as: listing titles only |
| Legwear | No lead | uncertain | n/a | n/a | n/a | Could not be sourced |

---

## 3. Jägers (army)

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Coat colour | Expected to show: light green until 7 November 1807, when all jäger regiments changed to dark green; officers' coats and trousers light green with piping in regimental colours | uncertain (unread lead) | unread | Viskovatov Part 10 (Conrad, V10BAll.htm); Russian encyclopaedia pages (forma-odezhda.com; imha.ru, tertiary) | not read (blocked) | Seen as: search summaries (several agree). If confirmed, jägers were visibly lighter than the line infantry (inference) |
| Headgear | Expected to show: a brimmed round hat from 1802 ("like civilian top hats"); whether the February 1805 shako order covered jägers is unclear | uncertain (unread lead) | unread | Viskovatov Part 14 (Conrad, Visk14.html, listing title "VOLUME 14 Guards Infantry. 1801-1825"); napoleonistyka mirror (tertiary) | not read (blocked) | Seen as: search summaries |
| Belts | Expected to show: black | uncertain (unread lead) | unread | Russian page, not identified | not read (blocked) | Seen as: search summary |

---

## 4. Guard infantry

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| LG Jäger battalion: coat | Expected to show: tail-coat type, double-breasted, light green, light-green lining and turnbacks | uncertain (unread lead) | unread | forma-odezhda.com, "Мундиры русской гвардии 1802-1805 гг." [Uniforms of the Russian Guard 1802-1805], date not seen (tertiary encyclopaedia) | not read (blocked) | Seen as: listing title and search summary |
| LG Jäger: hat | Expected to show: round hat on the army jäger pattern (16 September 1802), orange tassel with a green centre, tape at the top; in 1804 the brim cut to a peak, the form that later became the kiver | uncertain (unread lead) | unread | Viskovatov Part 14 (Conrad, Visk14.html); forma-odezhda (as above) | not read (blocked) | Seen as: search summaries |
| LG Jäger: colour change | Expected to show: 7 November 1807, light green changed to dark green (coats, trousers, shabracks) | uncertain (unread lead) | unread | Viskovatov, "Том 14", chapter XXXII, litresp.ru (listing title "XXXII. ЛЕГКАЯ ГВАРДЕЙСКАЯ ПЕХОТА.. «Историческое описание одежды и вооружения российских войск. Том 14»") | not read (blocked) | Seen as: listing title and search summary |
| Preobrazhensky, Semenovsky, Izmailovsky | No content lead; the sources to read are identified | uncertain | n/a | Conrad, Visk14.html and Visk15.html (listing title "Visovatov Vol 15 Guards Infantry - Russian Military History"); the reenactor.ru PDF (§2), whose opening covers "guard and army" in 1805 | not read (blocked) | Could not be sourced |

---

## 5. Heavy cavalry (Guard and line cuirassiers) and the cuirass question

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Cuirassier regiments after 1801 | Expected to show: on 31 July 1801 six cuirassier regiments kept (Life His and Her Majesty's, Military Order, Yekaterinoslav, Glukhov, Little Russia); Kazan, Kiev, Starodub, Chernigov, Riga, Kharkov and Tver became dragoons | uncertain (unread lead) | unread | Viskovatov Part 11 (cavalry 1801-25), Conrad, marksrussianmilitaryhistory.info/V11/V11.htm (listing title "Viskovatov uniforms Russian army cavalry cuirassiers lancers dragoons hussars 1801-1825") | not read (blocked) | Seen as: search summary. If confirmed, the Chernigov, Kharkov and Tver Dragoons were former cuirassiers (inference) |
| Cuirasses in 1805 | Expected to show: none worn; abolished 1801 (one lead: 1802), reintroduced by a decree of 1 January 1812, all regiments equipped by July 1812 | uncertain (unread lead) | unread | Great Russian Encyclopedia, "Кирасиры", old.bigenc.ru/military_science/text/2065910; *Военно-исторический журнал*, "Кирасиры: краса и гордость регулярной кавалерии", history.milportal.ru; M. Conrad, "The Russian Army of 1812", marksrussianmilitaryhistory.info/1812CARD.html; napoleonistyka mirror (tertiary) | not read (blocked) | Seen as: listing titles and search summaries. One popular claim, that cuirasses were bought in Prussia after Austerlitz (en.topwar.ru), is unsupported; do not use |
| 1803 helmet | Expected to show: an order of 18 October 1803 for Guard and army cuirassiers, dragoons and horse artillery. Black lacquered leather, front and rear peaks, ear flaps, thick black horsehair crest, brass front plate. A flatter crest from 26 February 1808 | uncertain (unread lead) | unread | 1812.nsad.ru/48, "Отечественная война 1812 года. Форма русской кавалерии" (tertiary); ru.wikisource "ВЭ/ВТ/Головные уборы" (the "ВЭ" prefix should be Sytin's *Военная энциклопедия*, 1911-15: my identification, not checked); Viskovatov Part 11 (Conrad) | not read (blocked) | Seen as: listing titles and search summary |
| Chevalier Guard and Life Guard Horse | No content lead | uncertain | n/a | rodina-history.ru (2 December 2020), "Как Наполеон восхитился русскими кавалергардами при Аустерлице" [How Napoleon admired the Russian Chevalier Guards at Austerlitz] (popular) | not read (blocked) | Could not be sourced: coat, facings, metal, helmet ornament, horses |

---

## 6. Dragoons

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Coat colour | Expected to show: **light green** until 7 November 1807, then dark green; standing collar in the regimental colour, cuffs the same | uncertain (unread lead) | unread | Viskovatov Part 11 (Conrad, V11.htm) | not read (blocked) | Seen as: two search summaries. Conflicts with another lead (see Disagreements) |
| Dress and helmet, 1803 | Expected to show: double-breasted short-tailed coat, white breeches and boots for parade, grey overalls on campaign; the 1803 black crested helmet with brass plate | uncertain (unread lead) | unread | napoleonistyka mirror, "Russian Cavalry…", napolun.com/mirror/napoleonistyka.atspace.com/Russian_cavalry.htm (tertiary); §5 helmet leads | not read (blocked) | Seen as: search summary |
| Shabraque and crest | Expected to show: late 1807, dark-green shabraques bordered in the regimental colour; 1808, an upright crest | uncertain (unread lead) | unread | "Blunders on the Danube: Russian Dragoons and Mounted Jagers" (blog, 2011, tertiary) | not read (blocked) | Seen as: search summary. The pre-1807 shabraque colour surfaced in no lead |
| Strength | Expected to show: 28 dragoon regiments by 1805 | uncertain (unread lead) | unread | *Военно-исторический журнал*, "Драгуны: скромные труженики регулярной кавалерии", history.ric.mil.ru/Stati/item/117833/; N. A. Rogozhan, "Драгунские полки русской армии в 1812 году", reenactor.ru/ARH/PDF/Rogozan_00.pdf | not read (blocked) | Seen as: listing titles and search summary |
| Facings of the Tver, St Petersburg, Kharkov and Chernigov Dragoons | No lead | uncertain | n/a | n/a | n/a | Could not be sourced |

---

## 7. Hussars

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Headgear | Expected to show: shako from 1803 | uncertain (unread lead) | unread | military-history.fandom / Wikipedia, "Russian hussars" (tertiary); forma-odezhda.com, "Униформа армейских гусар 1801-1825 годов" [Uniform of the army hussars 1801-1825] (tertiary) | not read (blocked) | Seen as: listing titles and search summaries (garbled details) |
| Pavlograd | Expected to show: for about 1803-1809, dark-green dolman and chakchiry, turquoise pelisse, turquoise collar and cuffs, yellow lace; before 1803, a sky-blue pelisse | uncertain (unread lead) | unread | Viskovatov Part 11 (Conrad, V11.htm); napoleonguide.com, "Russian Hussars Colour Facings" (tertiary) | not read (blocked) | Seen as: search summaries. The period is my inference from two summaries |
| Mariupol | Expected to show: for about 1802-1809, white dolman, blue pelisse, yellow collar, cuffs and lace | uncertain (unread lead) | unread | Viskovatov Part 11 (Conrad, V11.htm) | not read (blocked) | Seen as: search summaries. The period is my inference |
| Elisavetgrad | Expected to show: straw-yellow dolman and pelisse with red facings until 1809, grey from 1809; one summary dates grey to 1803-05 | disputed (unread leads conflict) | unread | Viskovatov Part 11 (Conrad, V11.htm); TMP forum, "Russian Elisavetgrad Hussars", theminiaturespage.com/boards/msg.mv?id=197724 (tertiary) | not read (blocked) | Seen as: listing titles and search summaries |
| Life Guard Hussars | No content lead | uncertain | n/a | Soldiershop, *Uniforms of Russian army during the Napoleonic war* vol. 17, "The Guards Cavalry: Hussars, Lancers, Cossacks & Others" (Viskovatov plates, ed. L. S. Cristini, translated by M. Conrad), ISBN 9788893273107 | not read (blocked) | Seen as: listing title. Could not be sourced |
| Horse colours | Expected to show: Pavlograd on greys, trumpeters on blacks (period unknown) | uncertain (unread lead) | unread | imha.ru, "Гусарский, Павлоградский полк"; State Historical Museum, rm.shm.ru/core/regiment/127 | not read (blocked) | Seen as: search summary |

---

## 8. Uhlans, Cossacks, artillery, escort

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Constantine's Uhlans | No content lead | uncertain | n/a | navegante.ru, "Помните чье имя носите! 1805 г. Аустерлиц" [Remember whose name you bear! 1805, Austerlitz] | not read (blocked) | Seen as: listing title. Could not be sourced |
| Don Cossacks; Life Guard Cossacks | No content lead | uncertain | n/a | M. Conrad, Viskovatov Vol 18 (Cossacks and irregulars 1801-25), 2011, marksrussianmilitaryhistory.info/Visk18.html; Soldiershop vol. 17 (§7); Novocherkassk Museum of Don Cossack History, article on Austerlitz, novochmuseum.ru | not read (blocked) | Seen as: listing titles. Could not be sourced |
| Artillery coat | Expected to show: 1802, dark-green double-breasted coat, black collar and cuffs piped red | uncertain (unread lead) | unread | V. Kovalsky, "Организация русской полевой артиллерии к 1812 году. Мундир" [Organisation of the Russian field artillery to 1812: uniform], museum.ru/1812/Army/RussArtillery_org/part5.html (specialist); Viskovatov Part 12 (Conrad, V12.htm) | not read (blocked) | Seen as: listing titles and search summary |
| Horse artillery helmet | Expected to show: the 1803 helmet (§5) | uncertain (unread lead) | unread | §5 helmet leads | not read (blocked) | |
| Foot artillery headgear; Allied headquarters escort | No lead | uncertain | n/a | n/a | n/a | Could not be sourced |

---

## 9. Greatcoat (шинель) in action on 2 December 1805

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| Worn in battle | Expected to show: Russian troops hampered by thick greatcoats, while the French had dropped packs and greatcoats | uncertain (unread lead) | unread | S. Bowden, *Napoleon and Austerlitz* (1997), secondary; page not seen | not read (blocked) | Seen as: search summary |
| Eyewitness | Expected to show: a participant on the cold, the snow and the greatcoat | uncertain (unread lead) | unread | I. O. Popadichev, memoir (recorded 1854, published 1895 as *Воспоминания суворовского солдата* [Memoirs of a Suvorov soldier]), fligel-rota.ru, "Воспоминания Попадичева о кампании 1805 года и битве при Аустерлице" [Popadichev's memoirs of the 1805 campaign and the battle of Austerlitz] | not read (blocked) | Seen as: listing title and search summary (garbled). Langeron's and Ermolov's memoirs surfaced in no lead |
| Regulation | Expected to show: one greatcoat every two years, worn from 1 October to 1 May | uncertain (unread lead) | unread | napoleonistyka mirror (tertiary) | not read (blocked) | Seen as: search summary |

---

## 10. Disagreements (between unread leads)

| question | position 1 + source | position 2 + source | note |
|---|---|---|---|
| Line infantry headgear on 2 December 1805 | Bicorne and 1802 caps: Bowden (1997), as reported in a forum (tertiary); en.topwar.ru and gulkevichi.com (popular) | Shako, after the 13 February 1805 order: John Cook and Ulyanov's plates (as reported); Viskovatov via Conrad (order dates) | A third position, a **mixture**: napoleonistyka (tertiary); the opening line of the reenactor.ru PDF ("alongside felt …"); the Pavlovsky lead. All unread |
| When was the infantry shako introduced? | 1803 (non-combatants, 19 August 1803; ru.wikipedia "Кивер") | 1805 (combatants, 13 February 1805: Viskovatov via Conrad; the reenactor.ru PDF) | **No lead supports "1807".** The 1807-08 dates in the leads concern a new kiver description (1808) and coat colours (7 November 1807) |
| Facing colours by Inspection | Viskovatov's Inspection table | Gingerich: Viskovatov's table rests on a proposal never implemented | Affects every line regiment's collar and cuffs |
| Dragoon coat colour in 1805 | Light green (Viskovatov Part 11 via Conrad: changed to dark green on 7 November 1807) | Dark green from 1802 (a summary of Kovalsky's artillery article) | The summary may be garbled |
| Elisavetgrad Hussars in 1805 | Straw-yellow with red facings (TMP; a Conrad colour table) | Grey (one summary) | Grey is probably the 1809 uniform (TMP) |
| Date the cuirass was abolished | Mid-1801 | 1802 (napoleonistyka) | Both point to no cuirasses in 1805 |
| Pavlovsky Grenadiers at Austerlitz | Present, in mitres (popular pages) | No OOB lead names the regiment | Unresolved |

---

## 11. Could not be sourced (no lead at all)

Nothing in this file is sourced; everything above is an unread lead. The following questions did not produce even a lead:

- Chevalier Guard and Life Guard Horse: coat, facings, metal, helmet ornament, horse colours.
- Life Guard Hussars; Life Guard Cossacks; Don Cossacks; Grand Duke Constantine's Uhlans.
- Guard infantry facings and 1805 headgear; whether the Life Grenadiers were present.
- Line infantry legwear; bicorne details; the shapes of the 1802 grenadier and fusilier caps.
- Facings of the dragoon regiments present; facings of musketeer and jäger regiments other than the Ryazan lead; the
  pre-1807 dragoon shabraque.
- Foot artillery headgear; horse artillery coat; the Allied headquarters escort; "Gladkov's brigade".
- Any primary statement about greatcoats in action; horse colours other than the Pavlograd lead.
- Museum holdings (none read); PSZ numbers for the orders; Viskovatov page and plate numbers.
- Not consulted: Haythornthwaite, MAA 185 and 189 (Osprey, popular secondary); Zweguintzow; Shenk; Funcken.

---

## 12. Reading list (when access allows)

1. M. Conrad's Viskovatov translations: V10BAll.htm, V11/V11.htm, V12.htm, Visk14.html, Visk15.html, Visk18.html.
2. J. Gingerich, "Russian Infantry Facings - Inspection Era" (Napoleon Series).
3. The reenactor.ru PDF on 1805 headgear (Alexin-Ylianov.pdf), and I. E. Ulyanov, *Регулярная пехота 1801-1855*
   (Moscow: AST, 1996), militera.lib.ru/h/leonov_ulyanov2/index.html.
4. The Napoleon Series OOB pages and Nafziger's 805LCJ.pdf.
5. The Her Majesty's Cuirassiers regimental history (prlib.ru/item/958929).
6. Popadichev's memoir.
7. adjudant.ru/gren/02.htm.
8. The memorandum.ru Viskovatov plate index, memorandum.ru/viskowatov/T10/pic/index.php.
9. Kovalsky on the artillery.

---

## 13. Notes for the reconstruction (inference from unread leads; not evidence)

**If** the leads are confirmed:
- jägers and dragoons wore light green, not the line infantry's dark green;
- dragoons wore black crested helmets;
- the hussar regiments differed by colour;
- no Russian unit wore cuirasses;
- line infantry headgear remains disputed, and any choice drawn would be a labelled design decision.

None of this should change the build until it has been read and graded.
