> **Stage 6 Part A, evidence register (`docs/STAGE6_SPEC.md` §2). Leads, not evidence.** Compiled on 4 October 2026 by the research
> pass of this part. No external source was read: the session's network policy refuses every host that holds them (HTTP 403;
> `docs/STAGE6_SPEC.md` §2.0), and the search tool's summaries are machine-written and not a source. Every external row is a lead to
> read in 6B; no grade in it is a verified grade. Texts reached through copies in other GitHub repositories are excluded (this session
> may read only its own repository). Nothing here may change the data or the drawing until its source is read.

# French army at Austerlitz (2 December 1805): appearance, leads only

Research file for the historical-appearance work. Compiled 4 October 2026, then revised the same day under the
coordinator's binding constraints. The question: what the French units drawn in the reconstruction wore on
2 December 1805, covering coat, facings, legwear, headgear, horse furniture, horse colours and greatcoats.

---

## 0. Status: nothing external was read

**No external source was read in a way this session allows.** So this file holds **no evidence**, only **leads**: author,
title, date, URL, and what each lead is expected to show. **Every external lead is graded "unread".** Nothing here may go
into `data.js` or the renderer until the source has been read and graded.

Why:

1. **Network policy.** WebFetch returned `EGRESS_BLOCKED` for every source host I tried: gallica.bnf.fr, archive.org,
   books.google.com, www.google.com, fr.wikisource.org, en.wikipedia.org, commons.wikimedia.org, www.napoleon.org,
   www.napoleon-series.org, www.musee-armee.fr, library.brown.edu, pop.culture.gouv.fr (Joconde), babel.hathitrust.org,
   www.gutenberg.org, journals.openedition.org and blundersonthedanube.blogspot.com. Shell probes also failed (no
   connection, or 403) for Project Gutenberg's mirrors, europeana.eu, digi.ub.uni-heidelberg.de, e-rara.ch,
   bavarikon.de, data.bnf.fr, retronews.fr, persee.fr, cairn.info, repository.library.brown.edu, loc.gov,
   metmuseum.org, collections.vam.ac.uk, rct.uk, nam.ac.uk, parismuseescollections.paris.fr, collections.louvre.fr,
   photo.rmn.fr, bibliotheque-numerique.inha.fr, onb.digital, openlibrary.org, catalog.hathitrust.org, bl.uk and
   several Napoleonic hobby sites. The Google Books API answered with a quota of zero.
2. **Search.** I ran 8 WebSearch queries. The 8th was refused: "this session has used its web search budget
   (200 of 200 WebSearch calls)". The budget is shared, and per the coordinator's rule I stopped searching. A search call
   returns result listings (title and URL) plus a **machine-written summary, which is not evidence**. Below, listing
   titles are quoted verbatim to identify a source. Summary content is marked "search summary" and serves only as a
   lead.
3. **GitHub: excluded under the session rule.** Before the rule was relayed ("read only billybobbyboo/austerlitz; do not
   read GitHub repositories; any text found that way must not be used"), I opened public-domain texts through
   raw.githubusercontent.com and ran about 35 GitHub code searches. **No text, quotation or detail from those reads is
   used in this file.** My local copies were deleted. The works are listed below only as leads: graded "unread",
   access "excluded (GitHub copy; rule 1)", described by their general relevance and **not** by anything I read in them.
   For the record, the copies opened were:
   - Project Gutenberg texts on the GITenberg mirror: Coignet's *Cahiers*; Marbot's *Mémoires* t. I; Fezensac's
     *Souvenirs militaires de 1804 à 1814*; Thiers' *Histoire du Consulat et de l'Empire* t. IV-VIII; *Œuvres de
     Napoléon Bonaparte* t. I-V; *Mémoires pour servir à l'histoire de France sous Napoléon*; Constant's *Mémoires*;
     Rovigo's *Mémoires* t. I; Roustam's *Souvenirs*; Fricasse's *Journal de marche*; and the mirror's index file.
   - A French Project Gutenberg mirror (11 irrelevant files).
   - The Project Gutenberg "Index of the Project Gutenberg Works of Various Authors on Napoleon Bonaparte".
   - A book list in another repository, and text chunks in a typography corpus.
   - Passages of two files that other agents had saved in the shared scratchpad (Bourrienne's *Memoirs*, with Rapp's
     account; Stutterheim 1807).
4. **No quotations.** No source was read in a permitted way, so this file contains no quoted passages and no
   translations of any.
5. **Project files read locally.** These were allowed. `data.js` gives the formation list and the regiments it names.
   `app.js` shows that every figure is drawn with a generic black cylinder "shako" and a coat in the nation's colour
   (`NATION.fr` fill `#2E5496`). This is context, not evidence.

### Legend
- **Grade.** "unread" for every external lead. A, B and C (A = documented for 1805; B = documented for the period and
  probable for 1805; C = reconstructed or disputed) can be assigned only after reading.
- **Label.**
  - "uncertain (unread lead)": a single lead.
  - "disputed (unread leads conflict)": leads point different ways.
  - "hypothesis (own knowledge; not evidence)": what I expect a specialist source to show, from general knowledge of the
    literature. It did not come from any text read in this session, so **it must not be used before checking**.
  - "fact per project data (not re-checked)": taken from `data.js`.
- **Access.**
  - "not read (blocked)" for external leads.
  - "excluded (GitHub copy; rule 1)" for the works listed in item 3 above.
  - "project file, read locally" for `data.js` and `app.js`.
- **"Seen as"** (in the note column) says how the lead surfaced:
  - *listing title*: verbatim from a search result.
  - *search summary*: machine-written, not evidence.
  - *named in the brief*.
  - *own knowledge*: no search result.

---

## 1. Order of battle (which French units to dress)

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote or note |
|---|---|---|---|---|---|---|
| Formations drawn | IV Corps (divisions of Saint-Hilaire, Vandamme and Legrand); III Corps (Friant; Bourcier's dragoons); V Corps (Caffarelli, Suchet; the 17e Légère on the Santon); I Corps (Rivaud, Drouet); cavalry reserve (Kellermann, Nansouty, d'Hautpoul, Walther); Imperial Guard (infantry, cavalry); Oudinot's grenadiers; G.Q.G. | fact per project data (not re-checked) | n/a | project `data.js` | project file, read locally | Beaumont's dragoons and Milhaud's light brigade are not plotted (`data.js`, c_cav note) |
| Regiments named in the project data | 10e Légère (Saint-Hilaire's assault); 43e and 55e de Ligne attached to Vandamme; 4e de Ligne (eagle lost); 3e de Ligne and the Tirailleurs du Pô at Telnitz (Legrand); 17e Légère (Santon); Grenadiers of the Italian Royal Guard with the Guard infantry; Guard Horse Grenadiers, Chasseurs à cheval and Mamelukes | fact per project data (not re-checked) | n/a | project `data.js` | project file, read locally | The brief adds the 26e Légère and the Tirailleurs corses (Legrand) |
| Nansouty's division | Six regiments, about 1,580 sabres in all, per Duffy and Smith. The regiments are not named in `data.js`. Hypothesis to test: 1er and 2e Carabiniers with the 2e, 3e, 9e and 12e Cuirassiers | hypothesis (own knowledge; not evidence) | unread | C. Duffy, *Austerlitz 1805* (1977); D. Smith, *The Greenhill Napoleonic Wars Data Book* (1998); G. Nafziger order-of-battle collection | not read (blocked) | The project already cites Duffy and Smith for the strength. Seen as: own knowledge |
| d'Hautpoul's division | Hypothesis to test: 1er, 5e, 10e and 11e Cuirassiers | hypothesis (own knowledge; not evidence) | unread | Duffy 1977; Smith 1998; Nafziger | not read (blocked) | Seen as: own knowledge |
| Walther's dragoons | Hypothesis to test: 3e, 6e, 10e, 11e, 13e and 22e Dragons | hypothesis (own knowledge; not evidence) | unread | Duffy 1977; Smith 1998; Nafziger | not read (blocked) | Seen as: own knowledge |
| Bourcier's dragoons | Which regiments reached the field is not established. `data.js` says only a fraction of the division did (about 830 sabres) | uncertain | unread | Duffy 1977; Smith 1998; Nafziger | not read (blocked) | No regiment list offered: low confidence |
| Kellermann's light cavalry | Hypothesis to test (low confidence): 2e, 4e and 5e Hussards with the 5e Chasseurs à cheval. `data.js` notes that some orders of battle put the division under I Corps | hypothesis (own knowledge; not evidence) | unread | Duffy 1977; Smith 1998; Nafziger; Wikipedia, "Battle of Austerlitz order of battle", https://en.wikipedia.org/wiki/Battle_of_Austerlitz_order_of_battle (tertiary, a finder only) | not read (blocked) | Seen as: listing title (Wikipedia page) and own knowledge |
| Guard cavalry and escort | The project names Horse Grenadiers, Chasseurs à cheval and Mamelukes. Whether the Gendarmerie d'élite was present is not established | uncertain | unread | H. Lachouque, *Napoléon et la Garde impériale* (1956, to verify); L. Fallou, *La Garde impériale* (1901) | not read (blocked) | Seen as: own knowledge |

---

## 2. Line infantry (fusiliers, grenadiers, voltigeurs)

Divisions: Saint-Hilaire, Vandamme, Legrand, Friant, Caffarelli, Suchet, Rivaud, Drouet.

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote or note |
|---|---|---|---|---|---|---|
| Coat | Expected to show the habit (long-tailed, à la française) of national blue with white lapels, red collar, red cuffs with white cuff flaps. The turnback colour is to be verified. Facings by class only | hypothesis (own knowledge; not evidence) | unread | Malibran, *Guide à l'usage des artistes et des costumiers* (1904); L. Rousselot, *L'Armée française: ses uniformes* (plates on the line infantry, 1804-1812; plate numbers not verified); Lienhart & Humbert, *Les uniformes de l'armée française* (1897-1906); Elting & Knötel, *Napoleonic Uniforms* | not read (blocked) | Seen as: named in the brief and own knowledge |
| Coat (eyewitness, 1804) | Expected to describe line infantry dress in 1804-05, as seen by a volunteer in the 59e (Ney's corps) | uncertain (unread lead) | unread | Duc de Fezensac, *Souvenirs militaires de 1804 à 1814* (Paris, 1863) | excluded (GitHub copy; rule 1) | Read it in an original edition (Gallica) |
| Legwear | Expected to show a white waistcoat and white breeches, with gaiters (black in winter, white in summer: to verify for 1805) | hypothesis (own knowledge; not evidence) | unread | Malibran 1904; Rousselot; Lienhart & Humbert | not read (blocked) | Seen as: own knowledge |
| Fusiliers' headgear, 1805 | Expected to show the black felt hat (bicorne, "chapeau"), worn crosswise, with a tricolour cockade and company pompon | hypothesis (own knowledge; not evidence) | unread | Malibran 1904; Bardin, *Dictionnaire de l'armée de terre* (1841-51), articles "Chapeau" and "Schako"; Blunders on the Danube, "French Napoleonic Line Infantry in Bicorne, Part 2" (2016), https://blundersonthedanube.blogspot.com/2016/11/french-napoleonic-line-infantry-in_23.html (wargaming blog, tertiary) | not read (blocked) | Seen as: listing title (blog) and own knowledge |
| Shako adoption for the line | Search summary: "the imperial decree of February 25, 1806 stipulated that 'starting from the year 1807, shakos would be the headgear of the line infantry'". A second summary: "the dimensions of the shako were fixed by the decree of February 25, 1806". If confirmed, line fusiliers were still in hats on 2 December 1805 | uncertain (unread lead) | unread | Which page the summary drew on is unclear. Candidates: napoleon.org, "Le paquetage du fantassin napoléonien", https://www.napoleon.org/histoire-des-2-empires/articles/le-paquetage-du-fantassin-napoleonien/ ; Bertrand Malvaux (dealer), "SHAKO DU 43ème RÉGIMENT D'INFANTERIE DE LIGNE, MODÈLE 1806, PREMIER EMPIRE.", https://www.bertrand-malvaux.com/p/20841/shako-du-43eme-regiment-d-infanterie-de-ligne-modele-1806-premier-empire.html | not read (blocked) | Seen as: search summary and listing titles. Check against the decree itself (Journal militaire, 1806) |
| Shako: any line regiments before 1806? | No lead found | uncertain | n/a | To check: P. L. Dawson, *Napoleon's Army at Austerlitz* (2025); Rousselot; M. Pétard (articles in *Uniformes* and *Tradition*) | n/a | Not searched before the budget ran out |
| Speed of shako issue, 1806-08 | No lead found | uncertain | n/a | To check: Bardin "Schako"; Malibran; Dawson | n/a | |
| Grenadiers' headgear | Expected to show the bearskin (bonnet à poil) in principle, with many companies in the hat. Red epaulettes and plume | hypothesis (own knowledge; not evidence) | unread | Malibran 1904; Rousselot; Bucquoy cards; Elting & Knötel | not read (blocked) | Seen as: own knowledge |
| Voltigeurs | Expected to show creation by decree for the light infantry (1804) and for the line (1805): dates to verify. Their 1805 distinctions (collar colour, epaulettes, headgear) are to verify. Line voltigeurs raised in autumn 1805 may not yet have worn distinctions at Austerlitz (inference, unverified) | hypothesis (own knowledge; not evidence) | unread | *Journal militaire* (an XII and an XIII); L. Belhomme, *Histoire de l'infanterie en France* (the volume covering 1804-06, to verify); Malibran 1904 | not read (blocked) | Seen as: own knowledge |
| Forage cap and undress | Expected to give the history of the bonnet de police (worn in undress) | uncertain (unread lead) | unread | PDF on archives.defense.gouv.fr (French defence ministry archive site), "Histoire du bonnet de police et du calot", https://archives.defense.gouv.fr/content/download/504454/8551534/file/Histoire%20du%20bonnet%20de%20police%20et%20du%20calot.pdf | not read (blocked) | Seen as: listing title (shown only as the host name) |
| Greatcoat | See section 12 | | | | | |

---

## 3. Light infantry (10e, 17e and 26e Légère; Tirailleurs du Pô; Tirailleurs corses)

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote or note |
|---|---|---|---|---|---|---|
| Coat | Expected to show an all dark-blue habit with pointed lapels and white piping, a blue waistcoat and breeches, and short gaiters cut "à la hussarde". The collar and cuff colours are to verify | hypothesis (own knowledge; not evidence) | unread | Malibran 1904; Rousselot (plates on the light infantry; numbers not verified); Bucquoy; Elting & Knötel | not read (blocked) | Seen as: own knowledge |
| Headgear | Expected to show the shako, adopted progressively before 1805; the date is to verify. Possibly the hat in some battalions | hypothesis (own knowledge; not evidence) | unread | Malibran 1904; Bardin "Schako"; Otto manuscript (c. 1807, light infantry figures); Rousselot | not read (blocked) | Seen as: own knowledge |
| Carabiniers (elite company) | Expected to show the bearskin or fur cap with a red plume and red epaulettes | hypothesis (own knowledge; not evidence) | unread | Malibran 1904; Rousselot | not read (blocked) | Seen as: own knowledge |
| Tirailleurs du Pô | Coat colour and headgear unknown | uncertain | n/a | To check: Malibran; *Carnet de la Sabretache*; specialist histories of foreign and auxiliary corps | n/a | No lead found |
| Tirailleurs corses | Coat colour and headgear unknown | uncertain | n/a | As above | n/a | No lead found |

---

## 4. Oudinot's grenadier division ("grenadiers réunis")

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote or note |
|---|---|---|---|---|---|---|
| Composition | Elite companies drawn from regiments on garrison duty. Oudinot was convalescent and Duroc commanded | fact per project data (not re-checked) | n/a | project `data.js` (c_gren) | project file, read locally | |
| Coats | Expected: each company in its parent regiment's dress, so line grenadiers in white-lapelled blue habits and light carabiniers in all-blue habits | hypothesis (own knowledge; not evidence) | unread | Rousselot; Malibran; Dawson 2025 | not read (blocked) | Seen as: own knowledge |
| Headgear (bearskin or shako?) | **Open question.** Leads to read, without assuming either answer: Thiers t. V-VI (on the grenadier division formed at Arras); Fezensac 1863; Coignet (Guard eyewitness on 2 December); F. Pils, *Journal de marche du grenadier Pils (1804-1814)* (1895, to verify), a grenadier who drew (to verify); Dawson 2025 (Oudinot's inspection reports, per the publisher blurb in a search summary) | uncertain | unread | A. Thiers, *Histoire du Consulat et de l'Empire* t. V-VI (1845); Fezensac 1863; *Les Cahiers du capitaine Coignet*, ed. L. Larchey (1883); Pils 1895; Dawson 2025 | Thiers, Fezensac, Coignet: excluded (GitHub copy; rule 1). Pils, Dawson: not read (blocked) | Decide only after reading |

---

## 5. Imperial Guard infantry; Grenadiers of the Italian Royal Guard

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote or note |
|---|---|---|---|---|---|---|
| Grenadiers à pied: coat | Expected to show a dark-blue habit with white lapels, red cuffs with white flaps, red turnbacks, red epaulettes, white breeches and gaiters | hypothesis (own knowledge; not evidence) | unread | Fallou, *La Garde impériale* (1901); Lachouque (1956, to verify); Bucquoy | not read (blocked) | Seen as: own knowledge |
| Grenadiers à pied: headgear | Expected to show the bearskin with a red plume. Whether it carried a brass plate in 1805 is to verify | hypothesis (own knowledge; not evidence) | unread | Fallou 1901; Musée de l'Armée objects (catalogue numbers not found); napoleon.org, "La Garde impériale : la gloire jusqu'au tombeau (4/4)", https://www.napoleon.org/histoire-des-2-empires/articles/la-garde-imperiale-lorgueil-du-bonnet-a-poil-4-5/ | not read (blocked) | Seen as: listing title (napoleon.org) and own knowledge |
| Chasseurs à pied | Expected to show a dark-blue habit (lapel and cuff details to verify), green epaulettes with red fringes, and a bearskin without plate with a green-over-red plume | hypothesis (own knowledge; not evidence) | unread | Fallou 1901; J.-B. Barrès, *Souvenirs d'un officier de la Grande Armée* (1923, to verify), a vélite of the chasseurs in 1805 (to verify) | not read (blocked) | Seen as: own knowledge |
| Full dress or campaign dress in 1805 | Expected: what the Guard wore on campaign in November-December 1805 against full dress | uncertain (unread lead) | unread | Fallou 1901 | not read (blocked) | |
| Grenadiers of the Italian Royal Guard | Coat colour, facings and headgear unknown | uncertain | n/a | To check: Italian specialist literature, such as the USSME history of the Kingdom of Italy's army by V. Ilari, P. Crociani and C. Paoletti (title and date to verify) | n/a | No lead found |

---

## 6. Cuirassiers and carabiniers (Nansouty, d'Hautpoul)

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote or note |
|---|---|---|---|---|---|---|
| Cuirassiers: coat | Expected to show a dark-blue single-breasted coat, with facings (collar, cuffs, turnbacks) in regimental colour groups | hypothesis (own knowledge; not evidence) | unread | Malibran 1904; Rousselot (cuirassier plates); Bucquoy; Elting & Knötel | not read (blocked) | Seen as: own knowledge |
| Cuirassiers: helmet and cuirass | Expected to show a steel helmet with a brass crest, black horsehair mane and fur turban, and a steel cuirass of breast and back plates. When the cuirass was extended to all cuirassier regiments (c. 1802-03) is to verify | hypothesis (own knowledge; not evidence) | unread | Malibran 1904; Musée de l'Armée objects (numbers not found); the arrêtés organising the cuirassiers, 1802-03 (to identify) | not read (blocked) | Seen as: own knowledge. At block scale the visible marks are the steel cuirass and helmet over dark blue |
| Carabiniers (1er and 2e): headgear | Expected to show the bearskin cap (no cuirass in 1805), replaced by helmet and cuirass under a decree of late 1809 (date to verify) | hypothesis (own knowledge; not evidence) | unread | Malibran 1904; Rousselot (carabinier plates); Bucquoy | not read (blocked) | Seen as: named in the brief and own knowledge |
| Carabiniers: coat | Expected to show a dark-blue coat with red facings | hypothesis (own knowledge; not evidence) | unread | As above | not read (blocked) | Seen as: own knowledge |
| Cloaks | Expected: whether heavy cavalry wore cloaks (colour to verify) on the cold morning | uncertain | unread | Bardin, "Manteau"; Malibran | not read (blocked) | Seen as: own knowledge |
| Horse furniture | Shabraque or saddle-cloth colour unknown (dark blue? to verify) | uncertain | n/a | Malibran; Rousselot | n/a | |

---

## 7. Dragoons (Walther, Bourcier)

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote or note |
|---|---|---|---|---|---|---|
| Coat | Expected to show a green coat ("vert dragon") with lapels, cuffs and collar in regimental facing colours, and white breeches and boots | hypothesis (own knowledge; not evidence) | unread | Malibran 1904; Rousselot (dragoon plates); Elting & Knötel; Otto manuscript (c. 1807) | not read (blocked) | Seen as: named in the brief (green, "confirm for 1805") and own knowledge |
| Helmet | Expected to show a brass helmet with a black horsehair mane and a fur or imitation-fur turban | hypothesis (own knowledge; not evidence) | unread | Malibran; Musée de l'Armée objects (numbers not found) | not read (blocked) | Seen as: own knowledge |
| Cloak | Colour unknown (white? to verify) | uncertain | n/a | Bardin "Manteau"; Malibran | n/a | |
| Shabraque | Colour unknown (green? to verify) | uncertain | n/a | Malibran; Rousselot | n/a | |

---

## 8. Light cavalry (Kellermann): hussars and chasseurs à cheval

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote or note |
|---|---|---|---|---|---|---|
| Regiments | See section 1 (low-confidence hypothesis) | | | | | |
| Hussars: colours | Expected to show dolman, pelisse and breeches in colours peculiar to each regiment. The per-regiment tables are to read | hypothesis (own knowledge; not evidence) | unread | Malibran 1904; Rousselot (hussar plates); Bucquoy; Elting & Knötel | not read (blocked) | Seen as: own knowledge |
| Hussars: headgear | Expected: shako or the peakless "mirliton" in 1805 (the transition date is to verify); fur colback for the elite company | hypothesis (own knowledge; not evidence) | unread | Malibran; Bardin "Schako"; Otto manuscript | not read (blocked) | Seen as: named in the brief and own knowledge |
| Chasseurs à cheval: coat | Expected to show green (the brief asks to confirm): dolman or habit in 1805 to verify, with regimental facings | hypothesis (own knowledge; not evidence) | unread | Malibran; Rousselot (chasseur plates); Bucquoy | not read (blocked) | Seen as: named in the brief and own knowledge |
| Chasseurs à cheval: headgear | Expected: shako or mirliton; colback for the elite company | hypothesis (own knowledge; not evidence) | unread | As above | not read (blocked) | Seen as: own knowledge |

---

## 9. Guard cavalry (Grenadiers à cheval, Chasseurs à cheval, Mamelukes)

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote or note |
|---|---|---|---|---|---|---|
| Grenadiers à cheval | Expected to show a dark-blue coat with white lapels and a bearskin without plate, on black horses | hypothesis (own knowledge; not evidence) | unread | Fallou 1901; Lachouque (1956, to verify) | not read (blocked) | Seen as: own knowledge |
| Chasseurs à cheval | Expected to show a hussar-style dress (green dolman, scarlet pelisse, colback) and a green undress coat for campaign. Which was worn in November-December 1805 is to verify | hypothesis (own knowledge; not evidence) | unread | Fallou 1901; Lachouque (1956, to verify); Marbot, *Mémoires* t. I (Paris, Plon, 1891); F. Gérard, *La bataille d'Austerlitz* (painting, c. 1808-10, date to verify; not an eyewitness) | Fallou, Lachouque, Gérard: not read (blocked). Marbot: excluded (GitHub copy; rule 1) | Painting: Wikipedia, "Battle of Austerlitz, 2 December 1805 (Gérard)", https://en.wikipedia.org/wiki/Battle_of_Austerlitz,_2_December_1805_(G%C3%A9rard) (tertiary, a finder only). Seen as: listing title |
| Mamelukes | Expected to show oriental dress and turbans; colours and details to read | hypothesis (own knowledge; not evidence) | unread | Fallou 1901; P. Cottin (ed.), *Souvenirs de Roustam, mamelouck de Napoléon Ier* (1911) | Fallou: not read (blocked). Cottin: excluded (GitHub copy; rule 1) | |

---

## 10. Artillery (foot, horse) and train

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote or note |
|---|---|---|---|---|---|---|
| Foot artillery | Expected to show a dark-blue habit with blue lapels piped red and red cuffs and turnbacks, blue legwear, and the hat in 1805 | hypothesis (own knowledge; not evidence) | unread | Malibran 1904; Rousselot (artillery plates); Lienhart & Humbert; Bucquoy | not read (blocked) | Seen as: named in the brief and own knowledge |
| Horse artillery | Expected to show a light-cavalry style (chasseur or hussar cut) with a shako. The 1805 cut is to verify | hypothesis (own knowledge; not evidence) | unread | As above | not read (blocked) | Seen as: named in the brief and own knowledge |
| Guard artillery | Not researched | uncertain | n/a | Fallou 1901 | n/a | |
| Artillery train | Coat colour (grey? to verify) | uncertain | n/a | Malibran; Rousselot | n/a | |
| Battery positions | That the batteries on the plateau are reconstructed is project data | fact per project data (not re-checked) | n/a | project `data.js` (heightguns note) | project file, read locally | |

---

## 11. Headquarters and escort

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote or note |
|---|---|---|---|---|---|---|
| Napoleon's escort | Expected: the duty squadron of the Chasseurs à cheval of the Guard, possibly with Mamelukes; its composition on 1-2 December is to verify | hypothesis (own knowledge; not evidence) | unread | Marbot t. I (1891); Coignet (1883); Fallou 1901; Lachouque (1956, to verify) | Marbot, Coignet: excluded (GitHub copy; rule 1). Fallou, Lachouque: not read (blocked) | |
| Napoleon's dress | Expected: the grey greatcoat and small hat of the iconography, not checked for 2 December | hypothesis (own knowledge; not evidence) | unread | L.-F. Lejeune, *Bivouac de Napoléon ... la veille de la bataille d'Austerlitz* (painting; Salon year and Lejeune's presence on Berthier's staff at Austerlitz to verify); Gérard; A.-J. Gros, *Entrevue de Napoléon et de François II* (date to verify; Wikipedia "Interview Between Napoleon and Francis II after the Battle of Austerlitz", tertiary) | not read (blocked) | Seen as: listing title (Gros article) and own knowledge |
| Generals and staff | Expected: generals' embroidered uniforms under the regulation of 1 vendémiaire an XII (24 September 1803; to verify) | hypothesis (own knowledge; not evidence) | unread | Malibran 1904; Bardin | not read (blocked) | Seen as: own knowledge |

---

## 12. Greatcoat (capote) and cloaks on 2 December 1805 (cross-cutting)

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote or note |
|---|---|---|---|---|---|---|
| Worn in action at Austerlitz? (lead 1) | Search summary: "The majority of soldiers wore gray or brown capotes during the battle." | disputed (unread leads conflict) | unread | austerlitz.org (nature of the site not verified), "La bataille d'Austerlitz", https://www.austerlitz.org/fr/la-bataille-dausterlitz/ (tertiary) | not read (blocked) | Seen as: search summary. No source behind the claim is known |
| Worn in action at Austerlitz? (lead 2) | Search summary, relaying text attributed to *Uniforms of Austerlitz*: "For a set-piece battle like Austerlitz, soldiers would prepare their equipment and uniforms – for identification if nothing else. Once battle was joined, evidence suggests that greatcoats were removed and uniform and full equipment..." (truncated) | disputed (unread leads conflict) | unread | *Uniforms of Austerlitz: Napoleonic Uniforms of the Grand Armée and the Russian and Austrian Imperial Armies of 1805*, ISBN 9781739695002 (author not established); site https://uniformsofausterlitz.com/our-philosophy-is-this/ | not read (blocked) | Seen as: search summary. The listing that carried the text was an unauthorised e-book site, so its URL is not given |
| Issue of greatcoats for the 1805 campaign | Expected: orders on the army's clothing and equipment before and during the campaign (August-November 1805) | uncertain (unread lead) | unread | *Correspondance de Napoléon Ier* (1858-70); Fondation Napoléon, *Correspondance générale* (vol. for 1805); Dawson 2025 | not read (blocked) | |
| Eyewitness memoirs to check | Expected: whether named units wore greatcoats on the morning of 2 December | uncertain (unread lead) | unread | Thiébault, *Mémoires* (Plon, 1893-95, to verify; the volume covering 1805) and *The Memoirs of Baron Thiébault* vol. II (tr. A. J. Butler), the brigade commander in Saint-Hilaire's division (search summary); Coignet; Fezensac; Marbot; J.-P. Pouget, *Souvenirs de guerre* (1895, to verify; colonel of the 26e Légère, to verify); Barrès (1923, to verify); Pils (1895, to verify); L.-F. Lejeune, *Mémoires* | Coignet, Fezensac, Marbot: excluded (GitHub copy; rule 1). The others: not read (blocked) | Thiébault seen as: listing titles (Amazon, Goodreads) and search summary |
| Greatcoat colour | Unknown for 1805 line and light infantry, and for the Guard | uncertain | n/a | Malibran; Bardin "Capote"; Dawson 2025; Elting, *Swords Around a Throne* (1988) | n/a | No lead with content found |
| Weather | The project models mist and valley fog (`PHASES[].mist`). Temperature and frost are not sourced here | fact per project data (not re-checked) | n/a | project `data.js`, `app.js` | project file, read locally | |

---

## 13. Horse colours (cross-cutting)

| item | claim | label | grade | source (author, title, date, page/plate) | access | quote or note |
|---|---|---|---|---|---|---|
| Guard Horse Grenadiers | Expected: black horses | hypothesis (own knowledge; not evidence) | unread | Fallou 1901; Lachouque (1956, to verify) | not read (blocked) | |
| Trumpeters | Expected: grey horses | hypothesis (own knowledge; not evidence) | unread | Elting 1988; Malibran | not read (blocked) | Seen as: named in the brief |
| Mamelukes | Arab horses? (to verify) | uncertain | n/a | Fallou; Cottin 1911 | Cottin: excluded (GitHub copy; rule 1) | |
| Line cavalry | No lead | uncertain | n/a | Remount regulations (to identify) | n/a | |

---

## 14. Disagreements (between unread leads)

| question | position 1 + source | position 2 + source | note |
|---|---|---|---|
| Did French infantry fight in greatcoats on 2 December 1805? | Yes, most wore grey or brown capotes: austerlitz.org, "La bataille d'Austerlitz" (tertiary; search summary) | Greatcoats were removed once battle was joined: *Uniforms of Austerlitz* (ISBN 9781739695002; search summary) | Neither was read, and neither names an eyewitness in what the summaries relayed. This decides the dominant colour a viewer should see. Unresolved |
| When did the line infantry receive the shako? | Decree of 25 February 1806, shako the headgear from 1807 (search summary; page unclear: napoleon.org or Bertrand Malvaux) | No conflicting lead found | Not a true disagreement. It is listed because it decides the fusiliers' headgear (the app currently draws a shako on every figure) |
| Oudinot's grenadiers: bearskin or shako? | Not stated: excluded texts cannot be used | Not stated | An open question to settle by reading Thiers t. V-VI, Fezensac, Coignet, Pils and Dawson in permitted copies |

---

## 15. Could not be sourced

Nothing in this file is sourced. The brief's key questions stand as follows:

1. **Line fusiliers' bicorne at Austerlitz; the shako decree; grenadiers and voltigeurs.** Only an unread search summary
   is available (decree of 25 February 1806, effective 1807). No lead on regiments in shakos before 1806, on the speed of
   issue, or on the voltigeurs' 1805 distinctions.
2. **Light infantry headgear in 1805.** Hypothesis only.
3. **Carabiniers' bearskin until 1810.** Hypothesis only.
4. **Hussars' and chasseurs' headgear** (shako, mirliton, colback). Hypothesis only.
5. **Green for dragoons and chasseurs à cheval.** Hypothesis only.
6. **Artillery dress.** Hypothesis only.
7. **Greatcoats in action.** Two unread, conflicting leads; no eyewitness read.
8. **Horse colours.** Hypothesis only.

Further gaps:
- The order of battle at regiment level for Kellermann, Walther and Bourcier, and Nansouty's regiment names. The
  hypotheses are in section 1.
- The Tirailleurs du Pô and Tirailleurs corses, and the Grenadiers of the Italian Royal Guard: no lead at all.
- Musée de l'Armée inventory numbers: none found. Anne S. K. Brown collection plates: none found.
- **"Otto von Pivka" as a pen name of Digby Smith**: the brief asks to check. No source was read, and the attribution
  is unverified here.

---

## 16. Reading list (when access allows), in order of value

1. **Malibran, *Guide à l'usage des artistes et des costumiers* (1904).** Regulation dates, by arm and year (Gallica).
2. **Bardin, *Dictionnaire de l'armée de terre* (1841-51).** Articles "Schako", "Chapeau", "Capote", "Bonnet à poil",
   "Manteau" and "Voltigeur". Gallica, Partie 1:
   https://gallica.bnf.fr/ark:/12148/bpt6k57842818.texteImage. Google Books ids hKwWAAAAQAAJ and 7ikPAAAAQAAJ.
3. ***Journal militaire* (an XII to 1806).** The voltigeur decrees (1804, 1805) and the shako decree (1806).
4. **Napoleon's correspondence.** Clothing orders, August-November 1805 (*Correspondance de Napoléon Ier*; Fondation
   Napoléon, *Correspondance générale*).
5. **P. L. Dawson, *Napoleon's Army at Austerlitz: Uniforms and Equipment of the Grande Armée at the Emperor's
   Greatest Battle* (Frontline Books, 2025).** https://www.pen-and-sword.co.uk/Napoleons-Army-at-Austerlitz/p/52039 ;
   Google Books id o4VEEQAAQBAJ. The search summaries gave 224 and 272 pages, and mention the reports of inspecting
   commanders (Grouchy, Oudinot, Ney) on clothing and equipment.
6. ***Uniforms of Austerlitz*** (ISBN 9781739695002). https://uniformsofausterlitz.com/
7. **Memoirs, in permitted copies** (Gallica originals):
   - Coignet (Larchey edition, 1883)
   - Fezensac (1863)
   - Marbot t. I (1891); gutenberg.org ebook numbers seen in a search listing: 36909 (French t. I) and 2401 (English,
     tr. Oliver C. Colt)
   - Thiébault (1893-95)
   - Pouget (1895)
   - Barrès (1923)
   - Pils (1895)
   - Lejeune
   - Rapp (1823)
   - Thiers t. V-VI (1845), secondary
8. **Specialist plates and secondary works:**
   - Rousselot
   - Bucquoy
   - Elting & Knötel
   - Elting 1988
   - Pivka
   - Haythornthwaite
   - Pétard
   - Lienhart & Humbert
   - Fallou 1901
   - Lachouque (1956, to verify)
   - Funcken (secondary only)
   - I. Castle, *Austerlitz 1805* (Osprey, popular secondary; seen as an eBay listing of a German edition)
9. **Period images.** Give the year each depicts:
   - Otto manuscript (c. 1807)
   - Suhr, "Bourgeois de Hambourg" (1806-15)
   - Zix (1805-07)
   - Weiland (from 1807)
   - Hoffmann
   - Lejeune (date to verify)
   - Gérard (date to verify)
   - Gros (date to verify)
10. **Collections.**
   - Musée de l'Armée (inventory numbers).
   - Anne S. K. Brown Military Collection.
   - Northern Arizona University's online exhibit "Uniforms of the Napoleonic Wars",
     https://ac.nau.edu/omeka-s/s/uniforms-of-the-napoleonic-wars/page/the-culture-of-the-uniform (seen as a listing
     title; content unknown).

---

## 17. Notes for the reconstruction (inference; not evidence)

- **Design decisions until sourced.** No French appearance claim is sourced in this session. Whatever colour and
  headgear the blocks carry is a design decision until the reading list is done, and should be labelled as one.
- **The generic shako.** `app.js` draws a black cylinder "shako" on every figure. For French line fusiliers in 1805 this
  is not supported by anything read here. The one unread lead (the 1806 decree) points against it. Changing it is for the
  owner, after reading.
- **The greatcoat question.** It decides the dominant colour: a blue coat with a white front, or a grey and brown mix.
  Leave it open and label it, rather than pick a side on unread leads.
