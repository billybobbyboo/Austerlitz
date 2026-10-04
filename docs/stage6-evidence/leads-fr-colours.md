> **Stage 6 Part A, evidence register (`docs/STAGE6_SPEC.md` §2). Leads, not evidence.** Compiled on 4 October 2026 by the research
> pass of this part. No external source was read: the session's network policy refuses every host that holds them (HTTP 403;
> `docs/STAGE6_SPEC.md` §2.0), and the search tool's summaries are machine-written and not a source. Every external row is a lead to
> read in 6B; no grade in it is a verified grade. Texts reached through copies in other GitHub repositories are excluded (this session
> may read only its own repository). Nothing here may change the data or the drawing until its source is read.

# French colours, eagles and standards on 2 December 1805: leads only (nothing external read)

Research note for the Austerlitz command map (Stage 6, flags). Written 4 October 2026. No source file in the repository was changed.

## 0. Status: nothing external was read

**No external source was read in this session.** Every row below that rests on something outside this repository is a **lead**:
label "uncertain (lead)", grade **unread**, access **not read (blocked)**. The "claim" column says what the lead is *expected* to show;
it is not a finding and must not be used as one.

Why:

1. **Network.** The egress proxy refused every source host tried, through WebFetch ("EGRESS_BLOCKED") and through curl ("CONNECT tunnel
   failed, response 403"): fr.wikipedia.org, archive.org, gallica.bnf.fr, books.google.com, napoleon.org, musee-armee.fr,
   napoleon-series.org, hermitagemuseum.org, nam.ac.uk, gutenberg.org, millon.com, artcurial.com, osenat.com, bertrand-malvaux.com and
   others.
2. **Search summaries are not evidence** (owner's rule). The web search tool returned real page titles and URLs, listed below, plus
   machine-written summaries. The summaries were used only to decide what each lead is expected to show; nothing in them is quoted as
   evidence. Text in quotation marks below is a page's own title as the search tool listed it, or an inscription the lead is expected
   to show; neither has been verified.
3. **GitHub copies are not admissible** (owner's rule, relayed by the coordinating session: this session may read only
   `billybobbyboo/austerlitz`). Before that rule reached me, some Project Gutenberg texts and some French Wikipedia text had been
   opened through GitHub copies. **Nothing from them is used here**; the downloaded copies were deleted. Works of that kind appear
   below only as bibliographic leads, to be read from an admissible host.
4. **The shared search budget (200 calls) is exhausted**; no further searching was done.

The only facts in this note are about the app itself, read from this repository: `app.js` `flagTexture("fr")` paints every French
standard as three vertical bands (blue at the hoist, white, red); `STD_RATIO = 1.6` is labelled provisional ("a design rule … not a
sourced ratio, to be replaced in Stage 6"); `docs/VISUAL_AUDIT.md` and `CHANGELOG.md` already list the vertical tricolour as a likely
anachronism, "not verified".

**Grade key for the next pass** (none is assigned here): A documented for 1805; B documented for the period and probable for 1805; C
reconstructed or disputed. **Labels**: fact, disputed, derived, inference, uncertain, design decision. **Source types**: primary; object
(a surviving piece, here mostly sale-catalogue descriptions, citable as "object description, sale catalogue" once read); specialist
secondary; Osprey (popular secondary); tertiary (Wikipedia, FOTW, forums, blogs, re-enactors: finders only).

---

## 1. The 1804 model ("drapeau modèle 1804")

| item | claim (what the lead is expected to show) | label | grade | source (author, title, date, page/plate/inventory) | access | quote/note |
|---|---|---|---|---|---|---|
| 1.1 field | A white lozenge in the centre, its points on the edges; the four corner triangles alternately blue and red. | uncertain (lead) | unread | (a) Object: "Rare drapeau modèle 1804 (Challiot) du Ier bataillon du 111e …", Osenat, sale of the Napoleonic collection of the Princely Palace of Monaco, lot 202, osenat.com/en/lot/21003/4364027 (also gazette-drouot.com/en/lots/4364027; lotsearch.net/lot/rare-drapeau-modele-1804-challiot-du-ier-38083822); resold Artcurial, sale 6146, lot 88-a, artcurial.com/ventes/6146/lots/88-a. (b) *Grande Encyclopédie Larousse*, "drapeau", larousse.fr/archives/grande-encyclopedie/page/4395 (tertiary). (c) Fondation Napoléon, "Le drapeau modèle 1812 : le drapeau des adieux de Napoléon à Fontainebleau", napoleon.org (specialist secondary). (d) FOTW, crwflags.com/fotw/flags/fr_1emp.html (tertiary). | not read (blocked) | Every lead found points the same way. The 111e de ligne lot is the most valuable: an 1804-model infantry flag, whose description is expected to say the regiment fought at Austerlitz. |
| 1.2 corner order | Which colour sits in the upper hoist corner. | uncertain (lead) | unread | FOTW, "France: First Empire" (fr_1emp.html) and "France: Regimental flags under the First Empire" (fr%5Er_1e.html) (tertiary) | not read (blocked) | The two pages are expected to give opposite orders (see §8); they may describe opposite faces. Only photographs of an object (1.1 a) can settle it. |
| 1.3 inscriptions | Obverse in gold: "L'EMPEREUR DES FRANÇAIS AU [n]e RÉGIMENT D'INFANTERIE DE LIGNE"; reverse: "VALEUR ET DISCIPLINE" with the battalion number (on the 111e flag: "… 1er BATAILLON"). | uncertain (lead) | unread | Object 1.1 (a); FOTW fr_1emp.html | not read (blocked) | Inscriptions as the lead is expected to give them; unverified. Cavalry and Guard wording: no admissible lead found. |
| 1.4 corner numbers | The regimental number in gold inside a laurel wreath in each corner; a laurel frieze round the lozenge. | uncertain (lead) | unread | Object 1.1 (a); FOTW fr%5Er_1e.html; napoleon.org 1812-model page | not read (blocked) | |
| 1.5 technique, maker | Silk painted on both faces, the decoration in gold paint; maker "Challiot" (name in the lot title). | uncertain (lead) | unread | Object 1.1 (a) (lot title) | not read (blocked) | Whether embroidery was used on any 1804 infantry flag: no lead. |
| 1.6 size, infantry | About 80 cm square; the 111e flag catalogued at 79 x 79 cm. | uncertain (lead) | unread | Object 1.1 (a); English pages among the results, not identified which says it: TMP, "French regimental flags and eagles", theminiaturespage.com/boards/msg.mv?id=480200; Waterloo Association, "Eagle Standard of the 45th", ageofrevolution.waterlooassociation.org.uk/200-object/eagle-standard-of-the-45th/; Napoleon Series, "Trophies Taken by the British…", napoleon-series.org/military-info/battles/c_capturedflags.html (specialist secondary); a Scribd OCR of T. Wise, *Flags of the Napoleonic Wars (1)*, MAA 77 (Osprey, popular secondary); tinytintroops.co.uk (tertiary) | not read (blocked) | The lot is expected to give a display-stand height (about 2.3 m); that is a modern stand, not the pole. |
| 1.7 pole | A blue-painted wooden staff about 3 cm thick and about 2.10 m long, the cloth nailed with gilt-headed studs; whether the 2.10 m includes the eagle is expected to be stated both ways. | uncertain (lead) | unread | The English pages of 1.6; Pierre Bissuel (work not identified) as quoted on the re-enactor forum lesapn.forumactif.fr/t4412-longueur-de-la-hampe-porte-aigle (tertiary); tambours-bgha.org/equipements/equipements-armement/le-drapeau/ (re-enactors, tertiary) | not read (blocked) | The forum is expected to report staffs from 1.90 to 2.50 m. No regulation and no measured 1804 staff found. |
| 1.8 eagle | Gilt bronze, cast by Pierre-Philippe Thomire after a model by Antoine-Denis Chaudet; wings half spread, talons on a thunderbolt; on a box ("caisson") with the regimental number and a socket for the staff. | uncertain (lead) | unread | Fondation Napoléon, "Les Aigles Premier Empire et Second Empire" and "Aigle de drapeau du 6e régiment de Chasseurs à cheval", napoleon.org (specialist secondary); EN "The Imperial Eagles of the First and Second Empires", napoleon.org | not read (blocked) | |
| 1.9 eagle size, weight | Surviving 1804-model eagles: bird about 21-22.5 cm high, 24-26 cm across the wing bases, about 1.76-1.9 kg; about 31 cm high with the caisson. | uncertain (lead) | unread | Objects: Osenat / Giquello, same Monaco sale, lot 200, "Emouvante aigle de drapeau blessée, modèle 1804", giquelloetassocies.fr/lot/21003/4364025 (expected to cite Pierre Charrié, *Les Aigles françaises (1804-1815)*, p. 121); Artcurial, sale 1342, lot 54-a, whose listed title reads "AIGLE DE DRAPEAU MODELE 1804. (H 21 cm, L 26 cm, poid 1,9 kg) …", artcurial.com/en/sales/1342/lots/54-a; Osenat lot 203, osenat.com/lot/21003/4364028; Millon, "Collection Museo Imperial 1808", lot 43; Bertrand Malvaux, item 15786, bertrand-malvaux.com; exposition-experts-cnes.fr. Assembled height: en.wikipedia, "French Imperial Eagle" (tertiary). | not read (blocked) | Caution, a reproduction among the results: Thierry de Maigret, sale 22008, lot 4766865 ("aigle … du 30e régiment"), expected to be catalogued as a 20th-century cast. |
| 1.10 weight problem | The 1804 eagle was soon judged too heavy; a lightened model about 1810-1811; a third model in 1815. | uncertain (lead) | unread | napoleon.org EN, "The Imperial Eagles of the First and Second Empires" | not read (blocked) | If confirmed, every eagle of 1805 was of the heavy 1804 model. |
| 1.11 cravate | Design, colours and size of the 1804 cravate. | not sourced | unread | no lead found | n/a | See §9. |
| 1.12 the emblem chosen | Council of State, 12 June 1804, on the Empire's emblem. | uncertain (lead) | unread | page not identified among the results of the search on the 1804 infantry flag (compilhistoire.fr/drapeau.htm; force-publique.net "Les emblèmes"; aptg-france.fr "Le drapeau français et les emblèmes militaires"); E. Fraser, *The War Drama of the Eagles*, London, 1912, gutenberg.org/files/75293/75293-h/75293-h.htm (secondary) | not read (blocked) | |
| 1.13 arms decreed | Decree of 21 messidor an XII (10 July 1804) on the imperial arms (an eagle "à l'antique" holding a thunderbolt); per one lead, also one flag (later an eagle) per battalion or squadron. | uncertain (lead) | unread | napoleon.org, "Les Aigles Premier Empire et Second Empire"; D. Gorchkoff, "Les fanions du 2e régiment d'infanterie de ligne en 1812", *Revue historique des armées* 267 (2012/2), pp. 70-77, journals.openedition.org/rha/7457 (specialist secondary) | not read (blocked) | The decree text itself: no lead located. |
| 1.14 eagle on the staff | Decision at the headquarters of Pont-de-Briques (Boulogne), 27 July 1804: the gilt-bronze eagle to top the staff of the new flags and standards. | uncertain (lead) | unread | Sale-catalogue texts (Millon lot 43 and others in 1.9); Napoleon's correspondence (primary; not located) | not read (blocked) | |
| 1.15 distribution | Distribution on the Champ de Mars, before the École militaire, 5 December 1804 (14 frimaire an XIII), three days after the coronation. | uncertain (lead) | unread | napoleon.org (both eagle pages; image page "Distribution of the Eagle Standards"); Musée Carnavalet print listed as "Tribune élevée au Champs de Mars pour la distribution des aigles, le 5 décembre 1804", parismuseescollections.paris.fr; J. Regnault, *Les aigles impériales et le drapeau tricolore 1804-1815* (1967), Gallica ark:/12148/bpt6k3340531p (specialist secondary) | not read (blocked) | |

---

## 2. The vertical tricolour: when it came to the regimental colours

| item | claim (what the lead is expected to show) | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| 2.1 1812 model | Regimental colours with three equal vertical bands (blue at the hoist, white, red) came with the **1812 model**; before that the lozenge pattern. | uncertain (lead) | unread | napoleon.org, "Le drapeau modèle 1812 …"; Larousse, "drapeau" (tertiary); FOTW fr_1emp.html (tertiary); Société française de vexillologie, "Histoire du drapeau français", drapeaux-sfv.org; fr.wikipedia, "Drapeau de la France" (tertiary) | not read (blocked) | All the leads found agree. |
| 2.2 the steps of 1812 | January 1812: new colours ordered, to be renewed every three years; Cessac, minister of war administration, consults David (who proposes cloths "à la romaine" on a crossbar). 9 February 1812: commissaire ordonnateur Barnier proposes equal vertical bands from the hoist, blue, white, red. 10 March 1812: a regiment to show one flag only in action. | uncertain (lead) | unread | napoleon.org EN, "David's studies for the army's new standards, January 1812"; napoleon.org 1812-model page (or fr.wikipedia "Drapeau de la France"; which page carries the Barnier proposal was not established) | not read (blocked) | The decision documents themselves: not located. |
| 2.3 1812 object | The 1812-model flag of the 1st Grenadiers à pied of the Guard (Fontainebleau, 20 April 1814): silk 83 cm square, vertical bands, gold-embroidered border; Musée de l'Armée inv. 04071, Ba 117. | uncertain (lead) | unread | napoleon.org 1812-model page | not read (blocked) | Comparison only; not 1805. |
| 2.4 the app | The app draws every French standard as a vertical tricolour. | fact (repository) | n/a | `app.js`, `flagTexture("fr")`; flagged in `docs/VISUAL_AUDIT.md` §3 and `CHANGELOG.md` ("Deferred", Stage 6) | read (repository) | |
| 2.5 consequence | If the leads are confirmed, a vertical tricolour on a French standard at Austerlitz is an anachronism of about seven years, and the 1804 lozenge pattern should replace it. | inference (from unread leads) | unread | 2.1-2.3 | n/a | **Not established by any source read here.** Nothing should be changed on this note alone; it says which sources to read first (§9). |

---

## 3. How many eagles per regiment; light infantry; the Guard; the Italian Royal Guard

| item | claim (what the lead is expected to show) | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| 3.1 per battalion | From 1804 to 1808 every infantry battalion and every cavalry squadron had its own eagle and flag. | uncertain (lead) | unread | Gorchkoff, RHA 267 (2012), journals.openedition.org/rha/7457; the English pages of 1.6; Regnault 1967 (Gallica); Fraser 1912 | not read (blocked) | If confirmed, a three-battalion regiment at Austerlitz could carry up to three eagles; how many were in the ranks that day would still need a source. |
| 3.2 1808 | Decree of 18 February 1808: one eagle per regiment, carried by a porte-aigle (a lieutenant or sous-lieutenant with ten years' service or the four campaigns of Ulm, Austerlitz, Jena and Friedland), with a second and a third porte-aigle; the eagle to stay where most battalions are; the other battalions' eagles withdrawn. | uncertain (lead) | unread | Transcriptions of the decree (primary text): histoire-empire.org/docs/decret_infanterie_1808.htm; mylak.free.fr/decret_18_fevrier_1808.htm; sgtcoignet.fr (decree of 18 February 1808); austerlitz.org, "Bicentenaire du décret impérial du 18 février 1808" | not read (blocked) | After 1805; relevant only as the end of the one-per-battalion rule. |
| 3.3 bearer before 1808 | Who carried a battalion's eagle in 1805, and of what rank, before the porte-aigle of the 1808 decree. | uncertain (lead) | unread | Regnault 1967; Charrié 1982; Fraser 1912 | not read (blocked) | No admissible lead seen that states it. |
| 3.4 light infantry | Whether light infantry regiments received eagles in 1804 on the same terms as the line. | uncertain (lead) | unread | Regnault 1967; Charrié 1982; Fraser 1912 | not read (blocked) | |
| 3.5 light infantry restricted? | A claim that hussars, chasseurs à cheval, dragoons **and light infantry**, though issued eagles, were not allowed to carry them in battle (undated). | disputed (lead) | unread | tertiary pages among the results: napoleon-series.org, "The Soldiers of Hesse Nassau: Chapter VII"; gamewire.belloflostsouls.net, "Napoleon's Eyes and Ears"; shannonselin.com, "Symbols of Napoleon: The Eagle"; en.wikipedia, "Mounted Chasseurs of the Imperial Guard" | not read (blocked) | Expected to be contradicted for dragoons by the 1806 order (4.3). |
| 3.6 Guard | Whether and how the Guard's regiments carried eagles in 1805 (inscriptions, reverse). | uncertain (lead) | unread | Regnault 1967; Charrié 1982; Fraser 1912; comparison only: Isabella Stewart Gardner Museum, Boston, no. 21857, eagle, staff, flag and cravat of the 1st Grenadiers à pied, dated 1813-14, gardnermuseum.org/experience/collection/21857 | not read (blocked) | The Gardner piece is an 1812-pattern Guard flag, not 1805 evidence. Whether every Guard unit present had received its eagle by 2 December 1805: not sourced. |
| 3.7 Italian Royal Guard | What colours the Grenadiers of the Italian Royal Guard carried in 1805. | not sourced | unread | no lead found (not searched before the budget ran out) | n/a | |

---

## 4. Cavalry and artillery

| item | claim (what the lead is expected to show) | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| 4.1 per squadron | One eagle per cavalry squadron in 1804, for cuirassiers, carabiniers, dragoons, hussars and chasseurs alike. | uncertain (lead) | unread | Gorchkoff 2012; Regnault 1967; Fraser 1912 | not read (blocked) | |
| 4.2 size and form | A cavalry standard of the 1804 model 60 x 60 cm, with or without fringe; whether any 1804 cavalry piece was a swallow-tailed guidon. | uncertain (lead) | unread | page not identified among: fr.wikipedia "14e régiment de cuirassiers (France)" and "Chasseurs à cheval de la Garde impériale" (tertiary); histoire-pour-tous.fr; empirecostume.com; aigles-et-lys.fandom.com. Object: Osenat, Monaco sale, lot 201, "Etendard type 1804 du 1er régiment de hussards hollandais", osenat.com/lot/21003/4364026 (a Dutch standard after the French 1804 type) | not read (blocked) | The summary behind these leads mixed statements that may concern the Revolution or the Guard; treat as unattributed. |
| 4.3 in the field | Berthier's order of 25 September 1806: on campaign hussars and chasseurs à cheval leave all their eagles behind, dragoons take one per regiment, cuirassiers and carabiniers all; reportedly modified in July 1808. | uncertain (lead) | unread | regimental histories among the results: histoire-empire.org/historiques_de_regiments/1er_hussards.htm; napoleon-histoire.com, "Historiques - 1er hussards" and "Historiques - 9e hussards"; J.-J. Michel-Béchet, *Historique sommaire du 11e régiment de hussards*, Gallica ark:/12148/bpt6k6353755m | not read (blocked) | After Austerlitz. |
| 4.4 in 1805 | If 4.3 is confirmed and nothing earlier is found, light cavalry and dragoons may have carried their eagles at Austerlitz. | inference (from unread leads) | unread | 4.1, 4.3 | n/a | Any cavalry eagle drawn for 2 December 1805 would be a reconstruction. |
| 4.5 artillery | Whether artillery regiments received eagles in 1804, and whether they carried them in the field in 1805. | uncertain (lead) | unread | Regnault 1967; Charrié 1982; Fraser 1912 | not read (blocked) | No lead on field use. |

---

## 5. Uncased in action? The eagle of the 4e de ligne

| item | claim (what the lead is expected to show) | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| 5.1 the Bulletin | A battalion of the 4e de ligne was charged and overthrown by the Russian Guard cavalry; the Bulletin is expected not to mention the eagle, and to claim forty Russian flags taken. | uncertain (lead) | unread | 30e Bulletin de la Grande Armée, 12 frimaire an XIV (3 December 1805) (primary), napoleon.org/histoire-des-2-empires/articles/30e-bulletin-de-la-grande-armee-12-frimaire-an-xiv-3-decembre-1805/; napoleon-histoire.com/1805-trentieme-bulletin-de-la-grande-armee/ | not read (blocked) | |
| 5.2 the French witness | The loss of the eagle, the bearer's fate, whether the battalions had time to form square, and Russian flags taken in return. | uncertain (lead) | unread | *Mémoires du général Bigarré, aide de camp du roi Joseph, 1775-1813* (Paris, 1893) (primary: Bigarré commanded the 4e de ligne at Austerlitz), digitised by the Service historique de la Défense, bibliotheques-numeriques.defense.gouv.fr/shd/document/d8168257-3397-42e3-9161-30eae91dc86e. Secondary retellings: legrandcontinent.eu (2023); napoleon-empire.org, "Témoignages sur la bataille d'Austerlitz"; grandquebec.com, "Colère de l'Empereur" (tertiary) | not read (blocked) | The best single source for whether the eagle was uncased. |
| 5.3 an Allied witness | The Russian Guard's counter-attack described by an Austrian staff officer present at the battle. | uncertain (lead) | unread | Major-General Stutterheim, *A Detailed Account of the Battle of Austerlitz*, trans. Major Pine Coffin (London, 1807) (primary-adjacent: written by a participant on the Allied staff) | not read (blocked) | |
| 5.4 the captors | Privates Gavrilov, Omelchenko, Ushakov and Lazunov of the Life Guard Horse Regiment; the regiment's standard later inscribed for the capture of an enemy colour at Austerlitz (Old Style date 20 November 1805). | uncertain (lead) | unread | army.armor.photos/hist/lg-konny.php; imha.ru/1144524357-lejjb-gvardii-konnyjj-polk.html; impereur.blogspot.com/2015/09/1-4-4e-regiment-dinfanterie-de-ligne.html (blog); en.wikipedia, "Life Guard Horse Regiment"; warhistory.org, "'We Are Heroes After All, Aren't We?'" (all tertiary) | not read (blocked) | The regimental history behind them: not identified. |
| 5.5 where it is now | Not established. Leads conflict: kept in the regimental church until 1917 (Russian site); "still in the Hermitage" (tertiary French sites); the St Petersburg Artillery Museum displays the Russian regiment's standard, not (it seems) the French eagle. | uncertain (lead) | unread | artillery-museum.spb.ru/en/main-exposition/mikhail-kutuzov-and-the-war-of-1812.html; wikiland.org/fr/French_Imperial_Eagle; aigles-et-lys.fandom.com "Bataille d'Austerlitz"; grandquebec.com; en.wikipedia "Transfiguration Cathedral (Saint Petersburg)" (about another church's trophies) | not read (blocked) | No museum record or inventory number found. A painting of the capture (B. Willewalde, 1884; worldhistory.org/image/17622) is a later image, not evidence. |
| 5.6 Napoleon's reproach | Napoleon's words to the 4e after the battle (several versions circulate). | uncertain (lead) | unread | grandquebec.com; napoleon-empire.org (tertiary); Fraser 1912 | not read (blocked) | Not traced to a primary text. |
| 5.7 cased or uncased | Whether the eagles at Austerlitz were carried uncased. | not sourced | unread | no lead addresses it directly; Bigarré (5.2) is the likeliest | n/a | A capture in a cavalry mêlée would be consistent with an uncased eagle but would not prove it (inference, unread). |

---

## 6. Surviving 1804-model flags and eagles (as catalogued)

| item | claim (what the lead is expected to show) | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| 6.1 111e flag | Drapeau modèle 1804, 1st battalion, 111e de ligne; painted silk, 79 x 79 cm; Monaco Palace collection; Osenat lot 202 (expected estimate EUR 20-25,000, result EUR 75,000); later Artcurial 6146/88-a. Current owner unknown. | uncertain (lead) | unread | as 1.1 (a) | not read (blocked) | First thing to read: photographs give the corner order and the painting technique. |
| 6.2 eagle, lot 200 | 1804-model eagle: H 22.5 cm, 25.5 cm at the wing base, 1,760 g; pierced by two biscaïens, sabre cuts; caisson without number; cited by Charrié, *Les Aigles françaises (1804-1815)*, p. 121. | uncertain (lead) | unread | giquelloetassocies.fr/lot/21003/4364025; osenat.com/lot/21003/4364025 | not read (blocked) | Battle damage of unknown date. |
| 6.3 other eagles | Artcurial 1342/54-a; Millon lot 43; Osenat lot 203 and sale 21922 lot 168 (osenat.com/en/lot/21922/4595087); Bertrand Malvaux items 15786 and 51642 (the latter "attribuée au 13ème régiment de Chasseurs à cheval"). | uncertain (lead) | unread | as listed | not read (blocked) | Sale catalogues: object descriptions once read. |
| 6.4 Musée de l'Armée | No 1804-model flag or eagle with an inventory number found. The numbers found (04071, Ba 117) are expected to belong to the 1812-model Fontainebleau flag. | uncertain (lead) | unread | napoleon.org 1812-model page; musee-armee.fr, "L'écho du dôme" no. 41 (2018), "De la restauration à l'exposition" | not read (blocked) | Older catalogues to check (general bibliographic knowledge, not located online here): Penguilly L'Haridon, catalogue of the Musée d'artillerie (1862); L. Robert, catalogue of the Musée d'artillerie (1889-93); Niox, *Drapeaux et trophées*. |
| 6.5 Gardner Museum | 1st Grenadiers à pied of the Guard, eagle, staff, flag and cravat, dated 1813-14; expected dimensions: flag with fringe 101.6 x 102.2 cm, cravat 121.9 x 78.7 cm, eagle finial 25.4 cm (the finial stolen in 1990). | uncertain (lead) | unread | gardnermuseum.org/experience/collection/21857 (also 17723, 17725); Google Arts & Culture | not read (blocked) | Not 1805; possibly useful for a staff length if the record gives one. |
| 6.6 Hermitage | A French 1804 eagle or flag in the Hermitage (the 4e's or any other). | not sourced | unread | no catalogue lead found | n/a | |

---

## 7. The pole against the man: can a ratio be sourced?

| item | claim | label | grade | source | access | quote/note |
|---|---|---|---|---|---|---|
| 7.1 staff | About 2.10 m (with or without the eagle), reported range 1.90-2.50 m. | uncertain (lead) | unread | as 1.7 | not read (blocked) | |
| 7.2 eagle | About 0.3 m with its caisson (bird 21-22.5 cm). | uncertain (lead) | unread | as 1.9 | not read (blocked) | |
| 7.3 eagle top | If 7.1 and 7.2 were confirmed: with the butt grounded, the eagle's top at about 2.10 m (2.10 m including the eagle), about 2.41 m (2.10 m + 0.31 m), or up to about 2.81 m (2.50 m + 0.31 m). | derived (from unread leads) | unread | arithmetic on 7.1-7.2 | n/a | Carried in a shoulder-belt socket it would stand higher; no lead for that height. |
| 7.4 the man | A sourced height for an 1805 French eagle-bearer or soldier. | not sourced | unread | no lead found | n/a | The denominator also needs a design decision: stature bare-headed, or the figure with headgear (`figureTop` in `app.js` includes the headgear). |
| 7.5 check on 1.6 | For eagle tops of 2.10 / 2.41 / 2.81 m, the present ratio 1.6 would imply a man of 1.31 / 1.51 / 1.76 m. | derived (from unread leads) | unread | 7.3 / 1.6 | n/a | Only the top of the reported range gives an adult height. **No ratio can be sourced from this session**: 1.6 stays provisional. |

---

## 8. Disagreements (between leads; all unread)

| question | position 1 + source | position 2 + source | note |
|---|---|---|---|
| Q1 corner order | corners, clockwise from the top left, red-blue-red-blue (FOTW fr_1emp.html, tertiary) | blue-red-red-blue (FOTW fr%5Er_1e.html, tertiary) | Possibly opposite faces; to be settled from an object's photographs (6.1). |
| Q1/Q7 staff length | 2.10 m including the eagle (one of the English pages in 1.6, not identified) | a staff 2.10 m high surmounted by the eagle (Bissuel, as quoted on lesapn.forumactif.fr); 1.90-2.50 m (same forum; tambours-bgha.org) | Moves the eagle's top by about 0.3 m. |
| Q1 eagle size | H 21 cm, L 26 cm, 1.9 kg (Artcurial 1342/54-a, from its listed title) | H 22.5 cm, 25.5 cm, 1.76 kg (Monaco sale lot 200); about 1.85 kg (Regnault-type and Wikipedia-type summaries) | Differences between pieces and between ways of measuring. |
| Q3/Q4 eagles in battle | hussars and chasseurs leave their eagles behind, dragoons one per regiment, from Berthier's order of 25 September 1806 (regimental histories, 4.3) | hussars, chasseurs, dragoons and light infantry never allowed to carry them in battle, undated (tertiary pages, 3.5) | For 1805 neither rule is documented by a lead. |
| Q5 where the eagle is | in the Hermitage (wikiland, aigles-et-lys, grandquebec: tertiary) | in the Life Guard Horse Regiment's church until 1917, later fate not given (army.armor.photos / imha.ru); the Artillery Museum shows the Russian regiment's standard (museum page) | No museum record found. |
| Q6 inventory Ba 117 | the 1812-model Fontainebleau flag, inv. 04071 / Ba 117 (napoleon.org 1812-model page) | an 1804-model flag numbered Ba 117 (a summary of musee-armee.fr pages) | The second is probably a conflation in the summary. |

---

## 9. Could not be sourced

**Nothing in this note is sourced**: no external text was read (§0). Beyond that, not even a lead was found for:

- **the cravate** of the 1804 model (colours, embroidery, fringe, size);
- **a measured 1804 staff** or a regulation length and colour;
- **the Grenadiers of the Italian Royal Guard**: their colours in 1805 (not searched; budget exhausted);
- **cased or uncased** eagles at Austerlitz;
- **who carried a battalion's eagle in 1805** (rank of the bearer before the 1808 decree);
- **field use in 1805** of eagles by light cavalry, dragoons or artillery;
- **the 4e de ligne eagle's present location** with a museum record or inventory number;
- **a museum inventory entry** (number, dimensions) for any 1804-model flag or eagle in the Musée de l'Armée or the Hermitage;
- **a man's height** for 1805 (eagle-bearer or soldier), hence **no sourced pole-top-to-man ratio**;
- **the primary texts** of the decree of 21 messidor an XII, the Pont-de-Briques decision of 27 July 1804, Berthier's order of 25 September
  1806 and the 1812 decisions;
- **the specialist literature named in the brief**: P. Charrié, *Drapeaux et étendards de la Révolution et de l'Empire* (Copernic, 1982)
  and *Les Aigles françaises (1804-1815)*; J. Regnault, *Les aigles impériales et le drapeau tricolore 1804-1815* (1967; Gallica
  ark:/12148/bpt6k3340531p); Lienhart & Humbert, *Les uniformes de l'armée française* (1897-1906); Rousselot; Bucquoy; J. Elting, *Swords
  Around a Throne* (1988); Haythornthwaite; T. Wise, *Flags of the Napoleonic Wars* (Osprey MAA 77/78/115; popular secondary); G. Desjardins,
  *Recherches sur les drapeaux français* (1874): none located or read.

**Reading order for the next pass** (once a permitted route exists): (1) the 111e flag's catalogue and photographs (Osenat lot 202;
Artcurial 6146/88-a): field, corner order, inscriptions, size, technique; (2) Regnault 1967 and Charrié 1982: the 1804 decisions, staff,
cravate, cavalry standards, the 1806 order, the Guard; (3) Bigarré's memoirs (1893): the 4e's eagle, cased or not, the bearer;
(4) Stutterheim (1807) and the 30th Bulletin: the capture; (5) the Russian Life Guard Horse Regiment's history and the Hermitage and
Artillery Museum databases: the eagle today; (6) the Musée de l'Armée catalogue and the Musée d'artillerie catalogues (1862, 1889-93):
surviving 1804 pieces with dimensions; (7) for the ratio, a measured 1804 staff and a sourced stature for French soldiers of 1805.
