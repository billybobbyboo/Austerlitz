> **Roadmap step 2, reading register (`docs/ROADMAP.md`, step 2: integrity on screen).** The readings behind every text of step 2 that rests
> on a source read (basis S): the passage quoted as printed, a translation, the locator (page, and the page image or text layer it was
> read on), a grade, a label, what the passage settles and what it does not. Every quote below was read on the page image named, except
> where it is marked "OCR" (read in the scan's text layer only). Each entry is **not yet second-read (H-17)**: one reading, by one
> reader, on 8 October 2026; step 4's sourcing stage reads them again (`docs/FINAL_AUDIT.md` H-17, owner decision 136's practice).
> The source keys are `appearance.js`'s `APPEARANCE_SOURCES` keys where one exists (`corr11_1863`, `stutterheim1806de`,
> `stutterheim1806fr`, `materialien1806`, `thiebault3_1894`, `mikhailovsky1846`, `mikhailovsky1844`, `alombert4_1908`); `marbot1891`
> is the key `docs/stage6-evidence/readings-eyewitness.md` uses for the same work (a different copy, the same pages); `tolstoy_maude` is
> new here. Nothing was taken from an encyclopedia, a search summary, or a GitHub-held copy. Step 2's commits cite this file by section
> (§1 to §13).

# Roadmap step 2: the register of readings (Austerlitz, 2 December 1805)

- Scope: the passages the step-2 commits rest on (`docs/ROADMAP.md` step 2; the implementation plan's commit C2), with the two the
  plan's completeness critic added (Stutterheim p. 56, the direction toward the Blasowitz heights; Marbot t. I p. 260, the centre
  formed by Soult's and Bernadotte's troops), and what the same pages showed that bears on step 2's texts (§13).
- Compiled: 8 October 2026 (roadmap step 2, commit C2). The design session's own reading of the same pages (the plan's list) was
  repeated here from the scans, not copied: every page was fetched again from archive.org (Stutterheim's French original from
  Gallica's IIIF image service, Tolstoy from Project Gutenberg) and read on its image.
- Revised: 8 October 2026, after a review of this register (step 2, C2's review fixes): §1.1 (the order to Bernadotte restored), §2.3
  (the Blasowitz heights against Stare Vinohrady labelled an inference; the page URLs), §3.2, §4.2, §4.10 (Thiébault's two regiments
  beside, not in, Kamensky's brigade; the aide's identity an inference; the boast as Thiébault frames it), §8.2 (the page URL), §12 and
  §13 F1, F2, F11 changed; §2.6 (Stutterheim's "Rhiasky"), §3.4 (Kutuzov's report in the Materialien), §4.11 (Thiébault p. 474) and §13
  F13 added. Every quote added was read on its page image that day.
- Revised again: 8 October 2026, for the owner's answers to questions 153, 155, 157 and 158 (step 2, C14a): §2.7 (Stutterheim p. 56, the
  Guard's jäger battalion in Blasowitz and Liechtenstein's arrival), §5.7 (Mikhailovsky-Danilevsky 1846 pp. 256-257, the Guard's
  defence of Blasowitz), §6.8 (the second reading of Mikhailovsky-Danilevsky 1844 for question 153, the footnote's day on p. 187 among
  it) and §7.6 (Alombert and Colin p. 69, Caffarelli in Bisson's place) added; §6.5, §6.7 and §12 changed. Each page added was read on
  its image that day.
- Revised again: 8 October 2026, after the review of C14a-C18 (step 2, "C14a-C18, review fixes"): §8.4 (Marbot pp. 259-260, Lannes
  driving the enemy back to Blasiowitz) added, read on its images n278-n279 that day; §4.7 and §4.8 (the Guard that had no shot to fire
  and took no part, against the map's c_gd and guard_inf@6) and §12 changed; §13 F14 added.
- Revised again: 8 October 2026, after the review of C19-C23 (step 2, "C19-C23, review fixes"): §4.4 (the words its quote cuts, and what
  it settles) and §13 F1 (what the sources sheet's light note now says) changed. Thiébault pp. 456, 461 and 504 and Marbot p. 260 were
  checked again that day in archive.org's text layers (`mmoires03thieuoft`, `mmoiresdugn01marbuoft`): Marbot's sentence on the sun stands
  whole on p. 260 (p. 259 ends with "Mais à notre gauche, le maréchal Lannes non seulement").
- Transcription: as printed, with the source's own spelling, accents and capitals (Thiébault, Riajsk, Blasowitz, Girschikowitz,
  "étoit"); the German Fraktur's long s is written s; Russian in the pre-1918 spelling as printed (ъ, ѣ, і); "[...]" marks a cut and
  "/" a page turn inside a quotation. The translations are this register's own.
- Grades (of the passage for what it is used for, as in `docs/stage6-evidence/`): **A** a document dated 1805 (an order, a return, a
  bulletin), or an account printed in 1806 by an officer present; **B** a participant's memoir published decades later, an official
  history written from the archives, a 1805 return used for 2 December, or an 1806 editor's note of unstated origin; a novel is not
  graded (not a source for the event).
- Labels: **fact** (what the source says, as it says it); **disputed** (another source read here says otherwise; both are kept);
  **inference** (a step this register or the map takes beyond the words); **uncertain**.
- Page images: `https://archive.org/download/<identifier>/page/n<k>.jpg` (the item's page index k, given with each page; the offset
  from the printed page differs between items and, where plates intervene, within one); for Mikhailovsky-Danilevsky 1844 the item has
  no page viewer, so its pages were read through `https://iiif.archive.org/iiif/1805-.-bmk-brz$<k>/full/1100,/0/default.jpg` (k = the
  item's hOCR page index).

## Sources read

| key | author | title | place, publisher, year | kind | URL |
|---|---|---|---|---|---|
| corr11_1863 | Napoléon Ier (Commission) | Correspondance de Napoléon Ier, t. XI | Paris, Imprimerie impériale, 1863 | primary-text (orders and bulletins dated 1805) | https://archive.org/details/correspondancede11napouoft (images: page n = printed page + 9 for pp. 441-452) |
| stutterheim1806de | K. von Stutterheim | Die Schlacht bey Austerlitz, am 2. December 1805. Von einem Officier und Augenzeugen. Aus dem Französischen | Hamburg, 1806 | primary-text (an account by an Austrian officer present, translated from the French original of the same year) | https://archive.org/details/11344011bsb (images: page n = printed page + 3) |
| stutterheim1806fr | K. von Stutterheim | La bataille d'Austerlitz, par un militaire témoin de la journée du 2 décembre 1805 | Hambourg, 1806 | primary-text (the French original) | https://gallica.bnf.fr/ark:/12148/bpt6k6497274t (IIIF views f = printed page + 4) |
| materialien1806 | anonymous ("gesammelt von einem Militär") | Materialien zu der Geschichte der Schlacht bei Austerlitz | Weimar, Landes-Industrie-Comptoir, 1806 | primary-text (a German translation of Stutterheim with the editor's additions, "Zusätze", among them a translation of Kutuzov's official report, Zusatz 11) | https://archive.org/details/10807964bsb (images: page n = printed page + 9) |
| thiebault3_1894 | P. Thiébault (ed. F. Calmettes) | Mémoires du général baron Thiébault, t. III (1799-1806) | Paris, Plon, Nourrit, 1894 | primary-text (the memoir of a brigade commander in Saint-Hilaire's division on the Pratzen, published long after) | https://archive.org/details/mmoires03thieuoft (images: page n = printed page + 11 for pp. 449-474; p. 504 = n517) |
| mikhailovsky1846 | A. I. Mikhailovsky-Danilevsky (tr. L. Narischkine) | Relation de la campagne de 1805 (Austerlitz) | Paris, Dumaine, 1846 | specialist (the French translation of the 1844 official history) | https://archive.org/details/relationdelacam00dangoog (images: page n = printed page + 24 for pp. 227-238, + 26 from p. 239, after the plate no. 7) |
| mikhailovsky1844 | А. И. Михайловскій-Данилевскій | Описаніе первой войны Императора Александра съ Наполеономъ, въ 1805-мъ году | Санктпетербургъ, 1844 | specialist (official history written by imperial order from the archives; its author was not a participant in 1805) | https://archive.org/details/1805-.-bmk-brz (IIIF, k = hOCR page index; the title page k = 1) |
| alombert4_1908 | P.-C. Alombert and J. Colin (Section historique de l'État-major de l'armée) | La campagne de 1805 en Allemagne, t. IV | Paris, Chapelot, 1908 | specialist (prints the French returns of October 1805, each with its date) | https://archive.org/details/la-campagne-de-1805-en-allemagne-vol.-4 (images: pp. 716-732 n = page + 8; pp. 755-756 n760-n761; p. 762 n766) |
| marbot1891 | M. de Marbot | Mémoires du général baron de Marbot, t. I (Gênes, Austerlitz, Eylau); the copy read is the 27th edition ("Vingt-septième édition"; first published 1891, the volume's deposit note reading May 1891) | Paris, Plon, Nourrit | primary-text (the memoir of an aide-de-camp at imperial headquarters on the day, published long after) | https://archive.org/details/mmoiresdugn01marbuoft (images: page n = printed page + 19). The 53rd edition, https://archive.org/details/memoiresdugenera01marb, has the same pages 258-263 (its text layer's running heads) |
| tolstoy_maude | L. Tolstoy, tr. Louise and Aylmer Maude | War and Peace | Project Gutenberg eBook #2600 (updated 14 June 2022) | a novel (not graded) | https://www.gutenberg.org/ebooks/2600 (text: https://www.gutenberg.org/cache/epub/2600/pg2600.txt) |

## 1. `corr11_1863`: the orders of 1 December and the 30th Bulletin

### 1.1 `corr11.9534.butte`: the orders of 1 December (no. 9534, p. 441)
- **source**: no. 9534, "Ordres", "Au bivouac en avant de Brünn, 10 frimaire an XIV (1er décembre 1805)", p. 441; image n450
  (https://archive.org/download/correspondancede11napouoft/page/n450.jpg).
- **quote**: "Ordre au maréchal Bernadotte de prendre la position du bivouac du général Caffarelli. Ordre au général Caffarelli de
  prendre le bivouac de la division de grenadiers. Ordre aux grenadiers de se porter en avant de la butte, sur la droite de la route.
  [...] Ordre au 17e régiment d'infanterie légère de prendre position au Santon. Ordre au quartier général de se transporter à la butte."
- **translation**: "Order to Marshal Bernadotte to take the position of General Caffarelli's bivouac. Order to General Caffarelli to
  take the bivouac of the grenadier division. Order to the grenadiers to move in front of the mound, on the right of the road. [...]
  Order to the 17th light infantry regiment to take position at the Santon. Order to headquarters to move to the mound."
- **grade**: A (orders dated 1 December 1805, printed from the Dépôt de la guerre's text). **label**: fact.
- **settles**: on 1 December headquarters was ordered to "la butte", the 17e légère to the Santon, and Bernadotte to the position of
  Caffarelli's bivouac (Caffarelli to the grenadiers' bivouac, the grenadiers in front of the mound).
- **does not settle**: which mound "la butte" is: that it is the Zuran is an inference, not stated here; where Caffarelli's bivouac
  was, and whether it is the ground no. 9535 gives Bernadotte for 07:00 on 2 December (§1.2; §13 F11); no hour for the moves; nothing
  about the hour on 2 December.
- **status**: read on the page image; not yet second-read (H-17).

### 1.2 `corr11.9535.dispositions`: the dispositions for 2 December (no. 9535, pp. 442-443)
- **source**: no. 9535, "Dispositions générales pour la journée du 11", "Au bivouac en avant de Brünn, 10 frimaire an XIV (1er
  décembre 1805), 8 heures et demie du soir", pp. 442-443; images n451-n452.
- **quote** (p. 442): "M. le maréchal Soult donnera les ordres pour que ses trois divisions soient placées au delà du ravin, à sept
  heures du matin [...]. M. le maréchal Soult sera de sa personne, à sept heures et demie du matin, près de l'Empereur, à son bivouac.
  [...] M. le maréchal Bernadotte, avec ses deux divisions d'infanterie, se portera, à sept heures du matin, sur la même position
  qu'occupe, aujourd'hui 10, la division du général Caffarelli, hormis que sa gauche sera à hauteur derrière le Santon, et y restera en
  colonne par régiment." (p. 443): "A sept heures et demie MM. les maréchaux se trouveront près de l'Empereur, à son bivouac, pour, selon
  les mouvements qu'aura faits l'ennemi pendant la nuit, donner de nouveaux ordres."
- **translation**: "Marshal Soult will give orders for his three divisions to be placed beyond the ravine at seven in the morning
  [...]. Marshal Soult will himself be near the Emperor, at his bivouac, at half past seven in the morning. [...] Marshal Bernadotte, with
  his two infantry divisions, will move at seven in the morning onto the same position that General Caffarelli's division occupies today,
  the 10th, except that his left will be level behind the Santon, and will remain there in column by regiment." "At half past seven the
  marshals will be near the Emperor, at his bivouac, to give new orders according to the movements the enemy has made in the night."
- **grade**: A (orders dated 1 December 1805, 8.30 p.m.). **label**: fact (what was ordered).
- **settles**: the marshals were called to the Emperor's bivouac for 07:30 on 2 December, for new orders; the place the orders give
  Bernadotte's two divisions for 07:00.
- **does not settle**: where the bivouac was (not named; "la butte" of no. 9534 is not named here); whether the orders were carried out
  at those hours; the hour Napoleon took post on the Zuran; I Corps' position in the night (§13 F11).
- **status**: read on the page images; not yet second-read (H-17).

### 1.3 `corr11.9541.p449`: the 30th Bulletin, the order of battle (p. 449)
- **source**: no. 9541, "30e Bulletin de la Grande Armée", "Austerlitz, 12 frimaire an XIV (3 décembre 1805)" (pp. 446-453), p. 449;
  image n458.
- **quote**: "Il donna le commandement de la gauche au maréchal Lannes, de la droite au maréchal Soult, du centre au maréchal Bernadotte,
  et de toute la cavalerie, qu'il réunit sur un seul point, au prince Murat. La gauche du maréchal Lannes était appuyée au Santon,
  position superbe que l'Empereur avait fait fortifier, et où il avait fait placer dix-huit pièces de canon. Dès la veille, il avait confié
  la garde de cette belle position au 17e régiment d'infanterie légère [...]. Le maréchal Bernadotte, c'est-à-dire le centre, avait à sa
  gauche la division du général Rivaud, appuyée à la droite du prince Murat, et à sa droite la division du général Drouet."
- **translation**: "He gave the command of the left to Marshal Lannes, of the right to Marshal Soult, of the centre to Marshal Bernadotte,
  and of all the cavalry, which he gathered on a single point, to Prince Murat. Marshal Lannes's left rested on the Santon, a superb
  position the Emperor had had fortified and where he had had eighteen guns placed. From the day before he had entrusted the guard of
  this fine position to the 17th light infantry regiment [...]. Marshal Bernadotte, that is, the centre, had on his left General Rivaud's
  division, resting on Prince Murat's right, and on his right General Drouet's division."
- **grade**: A (dated 3 December 1805). **label**: fact (what the Bulletin says); I Corps as "the centre" is disputed against the map's
  "general reserve" (question 157).
- **settles**: the Bulletin calls I Corps the centre, Rivaud on its left and Drouet on its right; it has the 17e légère on the Santon.
- **does not settle**: where the centre stood or when it moved; the Bulletin is the army's own published account.
- **status**: read on the page image; not yet second-read (H-17).

### 1.4 `corr11.9541.p450`: the reserve's guns, the sunrise, the marshals (p. 450)
- **source**: no. 9541, p. 450; image n459.
- **quote**: "Cette réserve était rangée sur deux lignes, en colonnes par bataillon, à distance de déploiement, ayant dans les intervalles
  quarante pièces de canon servies par les canonniers de la Garde. [...] Le 11 frimaire, le jour parut enfin. Le soleil se leva radieux
  [...]. L'Empereur, entouré de tous les maréchaux, attendait pour donner ses derniers ordres que l'horizon fût bien éclairci. Aux premiers
  rayons du soleil les ordres furent donnés, et chaque maréchal rejoignit son corps au grand galop."
- **translation**: "This reserve was drawn up on two lines, in columns by battalion at deploying distance, with forty guns served by the
  Guard's gunners in the intervals. [...] On 11 frimaire the day broke at last. The sun rose radiant [...]. The Emperor, surrounded by all
  the marshals, waited until the horizon had cleared to give his last orders. At the first rays of the sun the orders were given, and each
  marshal rejoined his corps at full gallop."
- **grade**: A (dated 3 December 1805). **label**: fact (what the Bulletin says).
- **settles**: the marshals were with the Emperor before the first rays of the sun; the Bulletin's forty guns served by the Guard's
  gunners with the reserve; a radiant sunrise (without the phrase "soleil d'Austerlitz").
- **does not settle**: where the Emperor stood; any clock hour.
- **status**: read on the page image; not yet second-read (H-17).

### 1.5 `corr11.9541.p451`: the centre advances as the Russian Guard is routed (p. 451)
- **source**: no. 9541, p. 451; image n460.
- **quote**: "Des hauteurs d'Austerlitz, les deux empereurs virent la défaite de toute la garde russe. Au même moment, le centre de
  l'armée, commandé par le maréchal Bernadotte, s'avança. Trois de ses régiments soutinrent une très-belle charge de cavalerie. [...] Pas
  un homme de la réserve n'avait été nécessaire et n'avait donné nulle part."
- **translation**: "From the heights of Austerlitz the two emperors saw the defeat of the whole Russian Guard. At the same moment the
  centre of the army, commanded by Marshal Bernadotte, advanced. Three of its regiments withstood a very fine cavalry charge. [...] Not
  one man of the reserve had been needed or had engaged anywhere."
- **grade**: A (dated 3 December 1805). **label**: fact (what the Bulletin says); disputed against Stutterheim pp. 55-56 (§2.3) and
  Mikhailovsky-Danilevsky 1846 p. 229 (§5.1) for when I Corps moved.
- **settles**: the Bulletin puts the centre's advance at the moment of the Russian Guard's rout.
- **does not settle**: a clock hour; whether the centre had already crossed the brook.
- **status**: read on the page image; not yet second-read (H-17).

### 1.6 `corr11.9541.p452`: the twenty guns and the lake (pp. 451-452)
- **source**: no. 9541, pp. 451-452; images n460-n461.
- **quote**: "La canonnade ne se soutenait plus qu'à notre droite. Le corps / ennemi qui avait été cerné et chassé de toutes ses hauteurs se
  trouvait dans un bas-fonds et acculé à un lac. L'Empereur s'y porta avec vingt pièces de canon. Ce corps fut chassé de position en
  position, et l'on vit un spectacle horrible, tel qu'on l'avait vu à Aboukir : 20,000 hommes se jetant dans l'eau et se noyant dans les
  lacs!"
- **translation**: "The cannonade was now kept up only on our right. The enemy corps that had been surrounded and driven from all its
  heights was in a low ground, backed against a lake. The Emperor went there with twenty guns. This corps was driven from position to
  position, and one saw a horrible spectacle, such as had been seen at Aboukir: 20,000 men throwing themselves into the water and drowning
  in the lakes!"
- **grade**: A (dated 3 December 1805) for what the Bulletin claims. **label**: fact (the claim); the figure is disputed (Marbot §8.3,
  Thiébault §4.8, the drained count of `data.js`'s Satschan record).
- **settles**: the Bulletin's twenty guns and its 20,000 drowned.
- **does not settle**: where the twenty guns stood (not at a named chapel); the number drowned.
- **status**: read on the page images; not yet second-read (H-17).

## 2. `stutterheim1806de` (with `stutterheim1806fr`): an Austrian officer's account, 1806

Stutterheim served with the Allied army; what he reports of the French side is not his own observation (inference). The German edition
is a translation of the French original of the same year (its title page: "Aus dem Französischen"); §2.3 is also read in the original.

### 2.1 `stut.p41.centre`: I Corps placed behind Girschikowitz in the night; "formirte das Centrum" (p. 41)
- **source**: stutterheim1806de, p. 41; image n44.
- **quote**: "Der Marschall Bernadotte, welcher sich am nähmlichen Tage mit dem Kaiser Napoleon vereiniget hatte, an welchem sich die
  Alliirten dem Feinde auf den Anhöhen von Pratzen zeigten, war anfangs auf die linke Seite der großen Landstraße gestellt worden. In der
  Nacht aber ließ ihn der Kaiser über diese Straße herüber marschiren, und stellte ihn hinter das Dorf Girschikowitz, welches stark
  besetzt wurde. Dieses Corps, welches aus den Divisionen Rivaud und Drouet bestand, formirte das Centrum der Französischen Armee."
- **translation**: "Marshal Bernadotte, who had joined the Emperor Napoleon on the same day the Allies showed themselves to the enemy on
  the heights of Pratzen, had at first been placed on the left side of the high road. In the night, however, the Emperor had him march
  across this road and placed him behind the village of Girschikowitz, which was strongly occupied. This corps, which consisted of the
  divisions Rivaud and Drouet, formed the centre of the French army."
- **grade**: A (printed 1806 by an officer present; a report of the French side). **label**: fact (what Stutterheim says); I Corps as
  "the centre" disputed against the map's "general reserve" (question 157); its night position disputed (§13 F11).
- **settles**: Stutterheim's night placement of I Corps behind Girschikowitz, and his "centre".
- **does not settle**: the hour of the move (the night is that of 1-2 December by the context: the French original closes the passage
  "Voilà quelle étoit la position des deux armées dans la nuit du 1.er au 2 décembre", p. 58, view f62).
- **status**: read on the page image; not yet second-read (H-17).

### 2.2 `stut.p49.seven`: the Allied army moves at 7 (p. 49)
- **source**: stutterheim1806de, p. 49; image n52.
- **quote**: "Um 7 Uhr Morgens setzte sich die combinirte Armee in Bewegung, und verließ die Anhöhen bey Pratzen, um auf ihre bestimmten
  Puncte vorzurücken. [...] zwischen 7 und 8 Uhr rückten einige Escadronen Husaren vor, um den Feind zu recognosciren."
- **translation**: "At 7 in the morning the combined army set itself in motion and left the heights by Pratzen to advance on its
  appointed points. [...] between 7 and 8 o'clock some squadrons of hussars came forward to reconnoitre the enemy."
- **grade**: A (an officer present on the Allied side, printed 1806). **label**: fact (what Stutterheim says); it bears on the disputed
  descent of the I Column (decision 125; settling it is step 4's, 125 (b)).
- **settles**: Stutterheim's hour for the Allied army's move.
- **does not settle**: when Dokhturov's I Column itself began to descend; the clock's basis.
- **status**: read on the page image; not yet second-read (H-17).

### 2.3 `stut.p55-56.crossing`: Bernadotte crosses at the same time as Soult's attack, toward the Blasowitz heights (pp. 55-56)
- **source**: stutterheim1806de, pp. 55-56, images n58-n59 (https://archive.org/download/11344011bsb/page/n58.jpg,
  https://archive.org/download/11344011bsb/page/n59.jpg); the French original, stutterheim1806fr, pp. 77-78, Gallica views f81-f82
  (https://gallica.bnf.fr/ark:/12148/bpt6k6497274t/f81.item, https://gallica.bnf.fr/ark:/12148/bpt6k6497274t/f82.item).
- **quote** (German, pp. 55-56): "Der Marschall Soult, welcher mit den zwey Divisionen St. Hilaire und Vandamme während der Nacht in das
  Thal bey Kobelnitz war postirt worden, ging mit denselben durch Kobelnitz und Puntowitz, um seinen Angriff auf die Anhöhen und das
  Dorf Pratzen zu richten. Zu gleicher Zeit ging der Marschall Bernadotte über eine schlechte kleine Brücke, auf einige Flintenschüsse
  weit vom Feinde, über den Bach des Dorfes Gir- / schikowitz, mit der Division Rivaud auf seinem linken und der Division Drouet auf
  seinem rechten Flügel, und nahm seine Richtung nach den Anhöhen bey Blasowitz."
- **quote** (French original, pp. 77-78): "Le Maréchal Bernadotte en même temps, après avoir passé, sur un mauvais petit pont à quelques
  portées de fusil de l'ennemi, le ruisseau du village de Girschikowitz avec la division Rivaud sur sa gauche, et Drouet sur sa droite,
  prit sa direction sur les / hauteurs de Blasowitz."
- **translation**: "Marshal Soult, who with the two divisions of St. Hilaire and Vandamme had been posted in the night in the valley by
  Kobelnitz, went with them through Kobelnitz and Puntowitz to direct his attack on the heights and the village of Pratzen. At the same
  time Marshal Bernadotte crossed the brook of the village of Girschikowitz by a bad little bridge, a few musket shots from the enemy,
  with Rivaud's division on his left and Drouet's on his right wing, and took his direction toward the heights by Blasowitz."
- **grade**: A (printed 1806 by an officer present; a report of the French side, not his own observation). **label**: fact (what
  Stutterheim says); disputed against Mikhailovsky-Danilevsky 1846 p. 229 (the crossing at nightfall, §5.1) and the 30th Bulletin p. 451
  (the centre advancing as the Russian Guard is routed, §1.5).
- **settles**: in Stutterheim, I Corps crosses at the same time as Soult's attack (the sequence, the basis of drouet@3's departure with
  Soult's advance, C7), and takes its direction toward the heights by Blasowitz (the plan's completeness critic, item 1). That these are
  not the Stare Vinohrady height, where the map's drawn route goes (data.js: Blasowitz [296,147], Stare Vinohrady [313,205]), is this
  register's inference; Stutterheim names no other height.
- **does not settle**: a clock hour (none on the page); the route drawn, which is this reconstruction's.
- **status**: read on the page images (both editions); not yet second-read (H-17).

### 2.4 `stut.p67.liechtenstein`: Liechtenstein's cavalry between Blasowitz and Pratzen; the vineyards (p. 67)
- **source**: stutterheim1806de, p. 67; image n70.
- **quote**: "[...] Liechtenstein deckte, nach dem unglücklichen Angriffe der Uhlanen, mit seiner Cavallerie das Terrain zwischen Blasowitz
  und Pratzen. Der Oesterreichische General Caramelli that mit dem Cuirassier-Regimente Lothringen einen Anfall auf die feindliche
  Infanterie, welche aus Girschikowitz hervor kam, und die zwischen diesem Dorfe und Pratzen liegenden Weinberge benützte, um den Russen
  in die Flanke zu fallen."
- **translation**: "[...] Liechtenstein, after the uhlans' unlucky attack, covered the ground between Blasowitz and Pratzen with his
  cavalry. The Austrian General Caramelli charged with the Lothringen cuirassier regiment the enemy infantry that came out of
  Girschikowitz and used the vineyards lying between this village and Pratzen to fall on the Russians' flank."
- **grade**: A (an officer present on the Allied side, printed 1806). **label**: fact (what Stutterheim says).
- **settles**: in Stutterheim, Liechtenstein covered the ground between Blasowitz and Pratzen (question 158, Liechtenstein's part); he
  names vineyards between Girschikowitz and Pratzen.
- **does not settle**: where the vines of Stare Vinohrady were (decision 135's vineyard stays presumed); a clock hour.
- **status**: read on the page image; not yet second-read (H-17).

### 2.5 `stut.p68-70.blasowitz`: Blasowitz taken by Bernadotte's corps; the eagle; the 27th at the Santon (pp. 68-70)
- **source**: stutterheim1806de, pp. 68-70; images n71-n73.
- **quote** (p. 68): "Das Dorf Blasowitz, welches er, wie schon erwähnt worden, hatte besetzen lassen, wurde von den Truppen des Corps des
  Marschall Bernadotte angegriffen und genommen." (p. 69): "Bey dieser Gelegenheit eroberte das Garde-Regiment zu Pferd einen
  Französischen Adler von einem Bataillon des vierten Regiments. [...] Die Chevaliers-Garden thaten einen tapfern Angriff, und schlugen
  sich mit den Grenadiers zu Pferd von der Französischen Garde, die unter dem General Rapp gekommen waren, die feindliche Cavallerie zu
  verstärken." (p. 70): "Der Marschall Lannes hatte zur Deckung des linken Flügels der Französischen Armee und ihrer Retraite im Falle
  eines Unglücks, auf der dominirenden Anhöhe zwischen Lesch und Kowalowitz, links an der Brünnerstraße, 18 Kanonen, welche von dem
  sieben und zwanzigsten Infanterie-Regimente bewacht wurden".
- **translation**: (p. 68) "The village of Blasowitz, which he [the Grand Duke] had had occupied, as already mentioned, was attacked and
  taken by the troops of Marshal Bernadotte's corps." (p. 69) "On this occasion the Horse Guard regiment took a French eagle from a
  battalion of the fourth regiment. [...] The Chevalier Guards made a brave attack and fought the horse grenadiers of the French Guard,
  who had come under General Rapp to reinforce the enemy cavalry." (p. 70) "For the cover of the French army's left wing and its retreat in
  case of misfortune, Marshal Lannes had 18 guns on the commanding height between Lesch and Kowalowitz, left of the Brünn road, guarded by
  the twenty-seventh infantry regiment".
- **grade**: A (an officer present on the Allied side, printed 1806). **label**: fact (what Stutterheim says); Blasowitz's attackers
  disputed (Thiébault p. 462, §4.6; Mikhailovsky-Danilevsky 1846 pp. 255-257, §5.6); the Santon's 27th disputed (the 17e légère of the
  orders, §1.1, the Bulletin, §1.3, and the Materialien's note, §3.3).
- **settles**: Stutterheim's attackers at Blasowitz (Bernadotte's corps, p. 68; the plan's question 158 has pp. 68-69); his eagle
  taken by the Horse Guard regiment; his 27th at the Santon.
- **does not settle**: any clock hour; the Santon's regiment (the dated order of 1 December names the 17e légère).
- **status**: read on the page images; not yet second-read (H-17).

### 2.6 `stut.p64.rhiasky`: the Fanagoria and "Rhiasky" regiments sent to reinforce Kamensky's brigade (p. 64)
- **source**: stutterheim1806de, p. 64, image n67 (https://archive.org/download/11344011bsb/page/n67.jpg); the French original,
  stutterheim1806fr, p. 90, Gallica view f94 (https://gallica.bnf.fr/ark:/12148/bpt6k6497274t/f94.item), the page `appearance.js`
  COMPOSITION.kamensky cites.
- **quote** (German, p. 64): "Zwey Russische Regimenter von der 2ten Colonne, Fanagorisky Grenadiers und Rhiasky Musketiers, welche als
  Reserve auf der Anhöhe standen, wo diese Colonne die Nacht über zugebracht hatte, kamen auf Befehl des General en Chef, um die Brigade
  des General Kamensky zu verstärken."
- **quote** (French original, p. 90): "Deux régimens russes de la seconde colonne, celui de Fanagorisky grenadiers et Rhiasky
  mousquetaires, qui étoient en réserve sur la hauteur que cette colonne avoit occupée pendant la nuit, vinrent, par ordre du général en
  chef, renforcer la brigade du général Kamensky."
- **translation**: "Two Russian regiments of the 2nd column, the Fanagorisky grenadiers and the Rhiasky musketeers, which stood in
  reserve on the height where this column had spent the night, came by order of the General en Chef to reinforce General Kamensky's
  brigade." (The French: "Two Russian regiments of the second column, the Fanagorisky grenadiers and the Rhiasky musketeers, which were
  in reserve on the height this column had occupied during the night, came, by order of the commander-in-chief, to reinforce General
  Kamensky's brigade.")
- **grade**: A (as §2.1: printed 1806 by an officer present; `docs/stage6-evidence/readings-composition.md`
  al.kamensky.units.stutterheim and al.lang.regiments.md grade the French page A). **label**: disputed (Rjäsan in the Materialien's list,
  §3.2, and in its translation of Kutuzov's report, §3.4; the brigade formed of these regiments in Mikhailovsky-Danilevsky, §5.6, §6.5;
  Kutuzov's report has him re-form the two regiments and give them to Kamensky, §3.4).
- **settles**: the 1806 eyewitness's spelling, "Rhiasky" (both editions); in his account the two regiments, of the 2nd column's reserve,
  were sent by the commander-in-chief's order to reinforce Kamensky's brigade: they are not the brigade's own regiments.
- **does not settle**: whether "Rhiasky" renders Ряжскій (Ryazhsk) or Рязанскій (Ryazan): the spelling settles neither (inference; as
  readings-composition.md al.kamensky.units.stutterheim); what Kamensky's brigade itself was made of; who turned it against the French
  (§13 F13); a clock hour.
- **status**: read on the page images (both editions); not yet second-read (H-17).

### 2.7 `stut.p56-57.blasowitz-guard`: the Grand Duke has Blasowitz occupied by the Guard's jäger battalion; Liechtenstein arrives "in dem nähmlichen Augenblicke" (pp. 56-57)
- **source**: stutterheim1806de, pp. 56-57, images n59-n60 (https://archive.org/download/11344011bsb/page/n59.jpg,
  https://archive.org/download/11344011bsb/page/n60.jpg). Read on the images for C14a (question 158).
- **quote** (p. 56): "Der Großfürst Constantin, welcher mit dem Corps der Garden die Reserve des rechten Flügels zu formiren hatte,
  verließ zur bestimmten Stunde die Anhöhen vor Austerlitz, um auf die Anhöhen bey Blasowitz und Krug vorzurücken. Kaum war er auf
  diesem Puncte angelangt, als er sogleich auf die Plänkler von der Division Rivaud und von der leichten Cavallerie des Fürsten Murat
  unter Commando des General Kellermann stieß, und mit ihnen ins Gefecht verwickelt war. Der Großfürst ließ eilig das Dorf Blasowitz durch
  das Jäger-Bataillon der Garde besetzen. In dem nähmlichen Augenblicke kam auch der Fürst Johann Liechtenstein mit seiner Cavallerie."
  (p. 57): "Als der Fürst Liechtenstein beym linken Flügel des Großfürsten anlangte, fand er den Feind den Russischen Garden gegen über:
  dieß war die Cavallerie des General Kellermann, unterstützt von der Infanterie des linken Flügels des Marschall Bernadotte und jener
  des rechten Flügels des Marschall Lannes."
- **translation**: (p. 56) "The Grand Duke Constantine, who with the corps of the Guards was to form the reserve of the right wing, left
  the heights before Austerlitz at the appointed hour to advance onto the heights by Blasowitz and Krug. Hardly had he arrived at this
  point when he at once came upon the skirmishers of Rivaud's division and of Prince Murat's light cavalry under General Kellermann, and
  was engaged with them. The Grand Duke hastily had the village of Blasowitz occupied by the Guard's jäger battalion. At the same moment
  Prince Johann Liechtenstein also came up with his cavalry." (p. 57) "When Prince Liechtenstein reached the Grand Duke's left wing, he
  found the enemy facing the Russian Guards: General Kellermann's cavalry, supported by the infantry of Marshal Bernadotte's left wing
  and that of Marshal Lannes's right wing."
- **grade**: A (an officer present on the Allied side, printed 1806). **label**: fact (what Stutterheim says); Blasowitz's attackers
  disputed (§2.5, §4.6, §5.6, §5.7); Liechtenstein's arrival disputed (Mikhailovsky-Danilevsky 1846 p. 257: only once the village was
  lost, §5.7).
- **settles**: in Stutterheim, the defenders of Blasowitz are the Russian Guard's (its jäger battalion; "er" of p. 68, §2.5, is the
  Grand Duke); Liechtenstein arrives as the village is occupied (question 158).
- **does not settle**: a clock hour ("zur bestimmten Stunde" names none).
- **status**: read on the page images; not yet second-read (H-17).

## 3. `materialien1806`: the German translation with the editor's additions, 1806

### 3.1 `mat.p50-51.crossing`: the same crossing in the Materialien's translation (pp. 50-51)
- **source**: materialien1806, p. 50; image n59.
- **quote**: "Der Marschall Bernadotte nahm zu gleicher Zeit, nachdem er in der Entfernung von einigen Flintenschüssen von dem Feinde auf
  einer kleinen schlechten Brücke über den Bach bei Girschikowitz gegangen war, seinen Marsch mit der Division Rivaud auf seiner Linken
  und der Division Drouet auf seiner Rechten nach den Anhöhen von Blasowitz."
- **translation**: "Marshal Bernadotte at the same time, after crossing the brook by Girschikowitz on a small bad bridge a few musket
  shots from the enemy, took his march with Rivaud's division on his left and Drouet's on his right toward the heights of Blasowitz."
- **grade**: A as Stutterheim's text, translated; **not an independent witness**. **label**: fact (the same statement as §2.3).
- **settles**: nothing beyond §2.3 (the same account).
- **does not settle**: as §2.3.
- **status**: read on the page image; not yet second-read (H-17).

### 3.2 `mat.p99.ryazan`: Langeron's column list, "Rjäsan" (p. 99)
- **source**: materialien1806, p. 99 (the editor's list of the Russian regiments by column); image n108
  (https://archive.org/download/10807964bsb/page/n108.jpg); and pp. 58-59 (its translation of Stutterheim's p. 64, §2.6), images
  n67-n68 (https://archive.org/download/10807964bsb/page/n67.jpg, https://archive.org/download/10807964bsb/page/n68.jpg).
- **quote**: "Zweite Colonne, unter General-Lieutenant Graf Langeron. [...] 1 Grenadier-Regiment von Fanagorsk / 1 Regim. Musket. von
  Fanagorsk / 1 Regim. Musket. von Rjäsan / 1 Regim. Musket. von Kursk / 1 Regim. Musket. von Perm / 1 Regim. Musket. von Wiburg"
  (the slashes here separate the list's lines).
- **translation**: "Second column, under Lieutenant-General Count Langeron. [...] 1 grenadier regiment of Fanagoria; 1 musketeer regiment
  of Fanagoria; 1 musketeer regiment of Ryazan; 1 musketeer regiment of Kursk; 1 musketeer regiment of Perm; 1 musketeer regiment of
  Vyborg".
- **grade**: B (an 1806 editor's list of unstated origin). **label**: disputed (Ryazan here; Ryazhsk in Mikhailovsky-Danilevsky 1844
  and 1846, §5.5, §5.6, §6.2, §6.4, §6.5, and in Thiébault pp. 474, 504, §4.10, §4.11; Stutterheim's "Rhiasky", §2.6, settles neither).
- **settles**: the Materialien's editor's list reads "Rjäsan" (p. 99), while its translated text reads "Rhiäsky" (p. 58); its
  translation of Kutuzov's report reads "Rjäsansche" (p. 112, §3.4).
- **does not settle**: which regiment marched with Kamensky (the list names no brigade); the list also has a "Musket." regiment of
  Fanagoria beside the grenadiers, as printed. The same book's translation of Stutterheim prints "Musquetierregiment Rhiäsky" (p. 58,
  read on images n67-n68: "Zwei russische Regimenter von der zweiten Colonne, nämlich das Grenadierregiment Fanagorisky und
  Musquetierregiment Rhiäsky, die als Reserve auf der Anhöhe geblieben waren, auf welcher diese Co- / lonne die Nacht zugebracht hatte,
  erhielten von dem Obergeneral den Befehl die Brigade des Generals Kamensky zu verstärken.", pp. 58-59): the Materialien gives both
  spellings.
- **status**: p. 99 read on image n108 and pp. 58-59 on images n67-n68; not yet second-read (H-17).

### 3.3 `mat.p100-101.santon`: the editor's note on the Santon, the 17th (Zusatz 6, pp. 100-101)
- **source**: materialien1806, Zusatz 6, pp. 100-101; image n110 (p. 101); p. 100 OCR.
- **quote**: (p. 100, OCR) "Die Division Suchet stützte sich an die dominirende Höhe zwischen Lesch und Kowalowitz [...]. Napoleon hatte
  diese treffliche Position am 1sten Decbr. befestigen und mit 18 Kanonen / besetzen lassen. Das 17te Regiment leichter Infanterie deckte
  dieselbe. (M. s. Campagnes de la grande Armée et de l'Armée d'Italie en l'an XIV. Paris, Librairie économique, 1806. 8. p. 297. — (Mr. de
  Stutterheim) la bataille d'Austerlitz. Hambourg, 1806. 8. p. 90.)"
- **translation**: "Suchet's division rested on the commanding height between Lesch and Kowalowitz [...]. Napoleon had had this excellent
  position fortified on 1 December and occupied with 18 guns. The 17th light infantry regiment covered it. (See Campagnes de la grande
  Armée [...], 1806, p. 297; (Mr. de Stutterheim) la bataille d'Austerlitz, Hamburg, 1806, p. 90.)"
- **grade**: B (an 1806 editor's note citing a French compilation of 1806). **label**: fact (what the note says); disputed against
  Stutterheim's 27th (§2.5).
- **settles**: the editor's 17th, placed under Suchet's division's height.
- **does not settle**: the note is anchored at Suchet's division in the translation (p. 35, OCR: "mit den Divisionen Suchet 6)"), while
  the translation itself keeps Stutterheim's "27sten Infanterie-Regiments" at the Santon (p. 65, OCR); see §13 F12.
- **status**: p. 101 read on the page image, p. 100 in the OCR; not yet second-read (H-17).

### 3.4 `mat.p110-112.kutuzov`: Kutuzov's official report, translated: "das Fanagorskische und Rjäsansche Regiment" given to Kamensky (Zusatz 11, pp. 110-112)
- **source**: materialien1806, Zusatz 11, pp. 110-112; images n119 (p. 110, https://archive.org/download/10807964bsb/page/n119.jpg) and
  n121 (p. 112, https://archive.org/download/10807964bsb/page/n121.jpg); the report's text runs from p. 110 to p. 112 (p. 111 not
  quoted). Found while checking §3.2 for the review of this register (8 October 2026); not in the plan's list.
- **quote**: (p. 110) "Zur Vergleichung mit diesem Berichte über den Antheil der vierten Colonne an der Schlacht, kann des General
  Kutusof's officieller Bericht in der St. Petersburger Hofzeitung (welcher nachdem in dem Moniteur mit Gegenbemerkungen erschien) dienen,
  da General Kutusof sich während der Schlacht bei dieser Colonne selbst befand." (p. 112) "Auf der Anhöhe fand ich das Fanagorskische
  und Rjäsansche Regiment von der zweiten Colonne abgeschnitten. Nachdem ich diese Regimenter wieder geordnet hatte, befahl ich dem
  General-Major, Grafen Kamensky, mit denselben alsogleich den Bergrücken zu besetzen, an dessen Seiten sich der Feind vorbei zog. Diese
  Regimenter verursachten dem Feinde einen starken Verlust, allein gezwungen der Ueberlegenheit zu weichen, verließen sie den Berg,
  deployirten am Fuße desselben und blieben im Angesichte des Feindes bis um halb 4 Uhr."
- **translation**: (p. 110) "For comparison with this account of the fourth column's part in the battle, General Kutuzov's official
  report in the St Petersburg Court Gazette (which afterwards appeared in the Moniteur with counter-remarks) may serve, since General
  Kutuzov was himself with this column during the battle." (p. 112) "On the height I found the Fanagoria and Ryazan ('Rjäsansche')
  regiments of the second column cut off. Having put these regiments in order again, I ordered Major-General Count Kamensky to occupy
  with them at once the ridge along whose sides the enemy was passing. These regiments caused the enemy a heavy loss but, forced to yield
  to superior numbers, left the hill, deployed at its foot and remained facing the enemy until half past three."
- **grade**: A for what the report says (the commander-in-chief's own account, printed in 1806; read here only in the Materialien's
  German translation of the gazette's text, whose Russian wording and date were not read, so the spelling "Rjäsansche" is the
  translation's). **label**: fact (what the translated report says); the regiment's name disputed (Ryazhsk in Mikhailovsky-Danilevsky,
  §5.5, §5.6, §6.2, §6.4, §6.5, and Thiébault's "Riajski", §4.10, §4.11; Stutterheim's "Rhiasky", §2.6); who gave Kamensky the two
  regiments, and who turned them, disputed (§13 F13).
- **settles**: in the report as translated, Kutuzov found the Fanagoria and "Rjäsansche" regiments of the second column cut off on the
  height, re-formed them and ordered Major-General Count Kamensky to occupy the ridge with them; they held at its foot until half past
  three (the report's hour).
- **does not settle**: the Russian text's spelling (Ряжскій or Рязанскій); what Kamensky's brigade was before Kutuzov's order; the hour
  of the order.
- **status**: pp. 110 and 112 read on the page images; not yet second-read (H-17).

## 4. `thiebault3_1894`: a brigade commander's memoir, published 1894

Thiébault says he printed "observations rectificatives" in Paris in 1806 (p. 466); the memoir was published in 1894.

### 4.1 `thieb.p449.position`: the position after the retreat of 29 November (p. 449)
- **source**: p. 449; image n460.
- **quote**: "la cavalerie de ligne prit position en arrière de Girzikowitz, qu'une des divisions du maréchal Bernadotte occupa, l'autre
  restant à Schlapanitz [...] et la réserve de grenadiers, ainsi que la garde impériale, quittèrent Brünn pour camper autour du bivouac de
  l'Empereur, qui fut placé sur un monticule derrière le village de Kritschen."
- **translation**: "the line cavalry took position behind Girzikowitz, which one of Marshal Bernadotte's divisions occupied, the other
  remaining at Schlapanitz [...] and the grenadier reserve and the Imperial Guard left Brünn to camp around the Emperor's bivouac, which
  was placed on a hillock behind the village of Kritschen."
- **grade**: B (a participant's memoir, published 1894). **label**: fact (what Thiébault says, of the days after 29 November).
- **settles**: Thiébault's placing of Bernadotte's two divisions after the retreat (one at Girzikowitz, one at Schlapanitz).
- **does not settle**: their place on the night of 1-2 December (§13 F11); which mound the "monticule" is.
- **status**: read on the page image; not yet second-read (H-17).

### 4.2 `thieb.p456-458.twenty-minutes`: the twenty minutes and the quarter of an hour (pp. 456-458)
- **source**: pp. 456-458; images n467-n469.
- **quote**: (p. 456) "Cet ordre était ridicule, car le jour ne venait qu'à huit heures [...]. Bien avant le jour, l'Empereur était à cheval;
  avant huit heures, il avait réuni autour de lui le prince Murat, les maréchaux Bernadotte, Lannes, Davout, Soult, Bessières, Oudinot, et
  Berthier. [...] Au jour naissant, on vint rendre compte à l'Empereur / que les dernières troupes russes qui avaient encore passé la nuit
  sur le plateau de Pratzen, le quittaient, se dirigeant vers Telnitz : « Combien de temps faut-il à vos troupes pour couronner le plateau
  de Pratzen? » demanda alors Napoléon au maréchal Soult, et, sur la réponse qu'il fallait au plus vingt minutes, voulant mettre à profit un
  brouillard qui couvrait les vallées et empêchait de voir nos troupes qui s'y trouvaient comme blotties, l'Empereur ajouta : « Eh bien,
  nous attendrons encore un quart d'heure. »" (p. 458) "il retarde l'attaque d'un quart d'heure parce que le maréchal Soult lui dit qu'il
  faut vingt minutes pour couronner les hauteurs de Pratzen; il ne donne le signal de l'attaque que quand un aide de camp vient lui dire (un
  peu prématurément) que ces hauteurs sont abandonnées".
- **translation**: (p. 456) "This order was absurd, for day came only at eight [...]. Long before daybreak the Emperor was on horseback;
  before eight he had gathered around him Prince Murat and the Marshals Bernadotte, Lannes, Davout, Soult, Bessières, Oudinot and Berthier.
  [...] At daybreak he was told that the last Russian troops that had spent the night on the Pratzen plateau were leaving it toward
  Telnitz: 'How long do your troops need to crown the Pratzen plateau?' Napoleon then asked Marshal Soult, and on the answer that twenty
  minutes at most were needed, wishing to profit from a fog that covered the valleys and hid our troops crouching there, the Emperor added:
  'Well, we will wait another quarter of an hour.'" (p. 458) "he delays the attack by a quarter of an hour because Marshal Soult tells him
  twenty minutes are needed to crown the Pratzen heights; he gives the signal for the attack only when an aide-de-camp comes to tell him (a
  little prematurely) that these heights are abandoned".
- **grade**: B (a participant's memoir, published 1894; Thiébault does not say he was present at the exchange, and his brigade was under
  arms before Kobelnitz from three in the morning, pp. 455-456: that he tells it at second hand is an inference). **label**: fact (what
  Thiébault says); the exchange is a memoir anecdote (H-7).
- **settles**: the anecdote's words as Thiébault gives them: "au plus vingt minutes", "nous attendrons encore un quart d'heure", the signal
  only when an aide reported the heights abandoned, "(un peu prématurément)"; he sets it "au jour naissant", with day at eight (p. 456).
- **does not settle**: a clock hour for the exchange on these pages; but see §4.10 (p. 504: an aide's report at half past eight, which
  this register identifies with this one by inference) and §13 F1.
- **status**: read on the page images; not yet second-read (H-17).

### 4.3 `thieb.p460.friant-legrand`: Friant at about nine; "40 ou 50,000 Russes" (p. 460)
- **source**: p. 460; image n471.
- **quote**: "Il ne fait occuper Sokolnitz et Telnitz que par le 3e de ligne et les deux bataillons corse et du Pô, de la division Legrand,
  quelques pièces de canon et la brigade de cavalerie légère de Margaron; et c'est seulement quand le feu est commencé, vers neuf heures du
  matin, qu'il les fait renforcer par 4,000 hommes de la division Friant. [...] mais, comme elles n'étaient pas de force à résister à 40 ou
  50,000 Russes [...] avec 75,000 hommes contre 104,000, il n'eut pas à en faire combattre plus de 50,000."
- **translation**: "He has Sokolnitz and Telnitz held only by the 3rd of the line and the Corsican and Po battalions of Legrand's division,
  a few guns and Margaron's light cavalry brigade; and only when the firing has begun, toward nine in the morning, does he reinforce them
  with 4,000 men of Friant's division. [...] but as they were not strong enough to resist 40 or 50,000 Russians [...] with 75,000 men
  against 104,000, he had to engage no more than 50,000."
- **grade**: B (a participant's memoir, published 1894; not his sector). **label**: fact (what Thiébault says).
- **settles**: Thiébault's "vers neuf heures" for Friant's reinforcement and his "40 ou 50,000 Russes" against Legrand's defenders.
- **does not settle**: the davout event's "About 08:00" (handed to step 4); the ratio "roughly six times" is a derived reading of these
  figures, not Thiébault's words.
- **status**: read on the page image; not yet second-read (H-17).

### 4.4 `thieb.p461.sun`: "le « soleil d'Austerlitz »" (p. 461)
- **source**: p. 461; image n472.
- **quote**: "Le soleil levant du 2 décembre 1805, le « soleil d'Austerlitz » qui, pendant tout le temps que le canon tira, joua lui-même un
  rôle historique dans cette journée, ce soleil, dis-je, fut salué par l'attaque de Telnitz et de Sokolnitz, où nos troupes firent des
  prodiges contre les trois premières colonnes russes (1) [...]. Ce même soleil éclaira la marche offensive des divisions Saint-Hilaire et
  Vandamme gravissant les hauteurs de Pratzen". Footnote (1): "Elles eurent affaire aux 1er et 2e corps des alliés et au 3e, moins la brigade
  Kamenski."
- **translation**: "The rising sun of 2 December 1805, the 'sun of Austerlitz', which itself played a historic part in that day for as
  long as the guns fired, that sun, I say, was greeted by the attack on Telnitz and Sokolnitz, where our troops did wonders against the
  first three Russian columns [...]. The same sun lit the offensive march of the Saint-Hilaire and Vandamme divisions climbing the heights
  of Pratzen." (1) "They had to deal with the 1st and 2nd corps of the Allies and the 3rd, less Kamensky's brigade."
- **grade**: B (a participant's memoir, published 1894). **label**: fact (what Thiébault says: he puts the phrase in quotation marks).
- **the cut** (checked in the text layer, OCR, 8 October 2026, after the review of C19-C23): "[...] que la quatrième même devait suivre ;
  il éclaira le mouvement rétrograde des généraux Legrand et Friant, qui, ne pouvant résister aux masses des assaillants, se retirèrent
  [...]": "which the fourth was itself to follow; it lit the withdrawal of Generals Legrand and Friant, who, unable to resist the masses of
  the attackers, fell back [...]".
- **settles**: Thiébault's use of the phrase, in quotation marks, for the rising sun, which in his telling greets the attack on Telnitz
  and Sokolnitz, lights Legrand's and Friant's withdrawal and then ("Ce même soleil") the climb onto the Pratzen (H-9, C22; the Basis
  entry's wording since the review of C19-C23).
- **does not settle**: a clock hour for the climb; who first used the phrase.
- **status**: read on the page image; not yet second-read (H-17).

### 4.5 `thieb.p457.fog`: the fog in the valleys (p. 457)
- See §4.2: "un brouillard qui couvrait les vallées et empêchait de voir nos troupes qui s'y trouvaient comme blotties" (p. 457, image
  n468). **grade**: B. **label**: fact (what Thiébault says). **settles**: Thiébault's fog hiding the French in the valleys before the
  attack (C22's lightNotes). **does not settle**: a clock hour. **status**: read on the page image; not yet second-read (H-17).

### 4.6 `thieb.p462.blasowitz`: "La 1re division du cinquième corps avait disputé Blazowitz" (p. 462)
- **source**: p. 462; image n473.
- **quote**: "La 1re division du cinquième corps avait disputé Blazowitz à la réserve du grand-duc Constantin, qu'elle abîma dans plusieurs
  chocs successifs et à laquelle elle prit ses drapeaux et ses canons."
- **translation**: "The 1st division of the fifth corps had contested Blasowitz with the Grand Duke Constantine's reserve, which it
  shattered in several successive clashes and from which it took its colours and its guns."
- **grade**: B (a participant's memoir, published 1894; not his sector). **label**: disputed (Bernadotte's corps in Stutterheim p. 68,
  §2.5; both corps in Mikhailovsky-Danilevsky 1846 p. 255, §5.6).
- **settles**: Thiébault's attacker at Blasowitz, a division of Lannes's V Corps (question 158).
- **does not settle**: which division he means by "1re"; the hour.
- **status**: read on the page image; not yet second-read (H-17).

### 4.7 `thieb.p463-464.right-wheel`: Lannes, reinforced by "la 1re division du corps du maréchal Bernadotte" (pp. 463-464)
- **source**: pp. 463-464; images n474-n475 (p. 464 OCR).
- **quote**: "le maréchal Lannes, saisissant ce que cette situation rendait possible, fit aussitôt un à-droite avec sa 1re division (1) et,
  renforcé par la 1re division du corps du maré- / chal Bernadotte, arriva à son tour sur les hauteurs de Pratzen, où se rendirent
  également toute la cavalerie, la garde impériale et la réserve de grenadiers (qui n'eurent pas un coup de fusil à tirer)."
- **translation**: "Marshal Lannes, seizing what the situation made possible, at once wheeled right with his 1st division and, reinforced
  by the 1st division of Marshal Bernadotte's corps, arrived in his turn on the heights of Pratzen, where all the cavalry, the Imperial
  Guard and the grenadier reserve also went (which had not one shot to fire)."
- **grade**: B. **label**: fact (what Thiébault says); which division is "the 1st" of I Corps is uncertain (the returns of 26 and 28
  October number Rivaud's and Drouet's divisions differently, §7.2, §7.5); the Imperial Guard "qui n'eurent pas un coup de fusil à
  tirer" disputed against the map's guard_inf@6 ("Committed onto the plateau as the Russian Guard attacks") and c_gd's role (§13 F14).
- **settles**: in Thiébault, one I Corps division (his "1re") reached the Pratzen with Lannes late in the day; in Thiébault, the Guard and
  the grenadier reserve went onto the Pratzen heights without firing a shot.
- **does not settle**: whether that is Drouet's or Rivaud's division.
- **status**: p. 463 read on the page image, p. 464 in the OCR; not yet second-read (H-17).

### 4.8 `thieb.p466.ice`: "trois à quatre mille" drowned; 24 pieces of the Guard; I Corps' 2nd division took no part (p. 466)
- **source**: p. 466; image n477.
- **quote**: "C'est pendant cette demi-heure que l'on prit des masses d'hommes, qu'on en noya trois à quatre mille qui cherchaient à passer
  sur le lac des Satschan, dont vingt-quatre pièces d'artillerie de la garde impériale brisèrent la glace [...]. tous les colonels ayant
  assisté à la bataille furent faits commandeurs de la Légion d'honneur, même ceux de la garde impériale et de la réserve et de la 2e
  division du premier corps qui ne prirent aucune part à la lutte. [...] d'imprimer en 1806, à Paris, des observations rectificatives".
- **translation**: "It was during this half hour that masses of men were taken, that three to four thousand were drowned who were trying
  to cross the Satschan lake, whose ice twenty-four pieces of the Imperial Guard's artillery broke [...]. All the colonels present at the
  battle were made commanders of the Legion of Honour, even those of the Imperial Guard and of the reserve and of the 2nd division of the
  first corps, which took no part in the fighting. [...] to print, in 1806 in Paris, corrective observations".
- **grade**: B (a participant's memoir, published 1894; he was wounded about three in the afternoon beyond Sokolnitz, p. 465, so the ice is
  not his own observation: inference). **label**: disputed (the drowned: the Bulletin's 20,000, §1.6; Marbot's thousands, §8.3; the
  drained count); I Corps' 2nd division disputed against the Bulletin p. 451 (§1.5) and the map's drouet@6; the Imperial Guard "qui ne
  prirent aucune part à la lutte" disputed against the map's guard_inf@6 and c_gd's role (§13 F14).
- **settles**: Thiébault's "trois à quatre mille" drowned and his 24 pieces of the Guard breaking the ice (C10, C11); his 2nd division of
  I Corps that took no part (§13 F11's I Corps lead; question 157).
- **does not settle**: where the 24 pieces stood (he does not place them at a chapel); which division is "the 2nd".
- **status**: read on the page image; not yet second-read (H-17).

### 4.9 `thieb.p469.morand`: Morand alone with the 10e léger against Kamensky's brigade (p. 469)
- **source**: p. 469; image n480.
- **quote**: "Notre gauche débarrassée d'ennemis, je suivis le mouvement de Morand [...]. Mais, et en dépit de Koutousow et de Stutterheim,
  Morand était déjà assailli par des forces disproportionnées. Avec le 10e léger, seul, il faisait face à toute la brigade Kamenski; il
  était débordé à droite et à gauche de manière à être pris à revers. [...] cette brigade Kamenski, que nous évaluâmes devoir être de 4 à
  5.000 hommes" (the last two words, on the next line, OCR).
- **translation**: "Our left cleared of enemies, I followed Morand's movement [...]. But, whatever Kutuzov and Stutterheim say, Morand was
  already assailed by disproportionate forces. With the 10th light, alone, he faced Kamensky's whole brigade; he was outflanked right and
  left so as to be taken in the rear. [...] this Kamensky brigade, which we reckoned to be 4 to 5,000 men".
- **grade**: B (a participant's memoir, published 1894; his own sector). **label**: fact (what Thiébault says); a sequence, not a clock.
- **settles**: Thiébault's sequence: Kamensky's brigade is against Morand after his own brigade has cleared the village (pp. 468-469).
- **does not settle**: a clock hour for Kamensky's turn (the dispute of decision 125 (a): the map's 08:45 record against the event's c.
  09:45; settling it is step 4's).
- **status**: read on the page image; not yet second-read (H-17).

### 4.10 `thieb.p504.half-past-eight`: an aide-de-camp at half past eight; the Fanagoria and "Riajski" regiments beside Kamensky's brigade; the boast of the 2nd division of I Corps (p. 504)
- **source**: p. 504; image n517 (https://archive.org/download/mmoires03thieuoft/page/n517.jpg).
- **quote**: "Sans doute, il avait été trompé par l'aide de camp qui, à huit heures et demie du matin, vint lui dire que les derniers corps
  de l'ennemi avaient quitté les hauteurs de Pratzen, alors que la brigade Kamenski, les régiments Fanagorski et Riajski et la quatrième
  colonne qui devait suivre le mouvement des trois premières s'y trouvaient encore en entier". Further down: "Ne fût-ce donc que pour
  cette raison, Napoléon devait nous faire soutenir par une réserve." "J'ai toujours été convaincu que, s'il ne le fit pas, ce fut afin
  de pouvoir dire : « Par la puissance de mon génie (nous n'en étions pas encore à l'étoile), je n'ai eu besoin, dans cette bataille, ni
  de la deuxième division du premier corps, ni de ma réserve de grenadiers, ni de ma garde. » Et ce fut cette forfanterie qui l'empêcha
  de prendre 15,000 hommes de plus".
- **translation**: "No doubt he had been misled by the aide-de-camp who at half past eight in the morning came to tell him that the last
  enemy corps had left the heights of Pratzen, while Kamensky's brigade, the Fanagoria and Ryazhsk ("Riajski") regiments, and the fourth
  column that was to follow the movement of the first three were still there in full". "For that reason alone, then, Napoleon ought to
  have had us supported by a reserve." "I have always been convinced that if he did not, it was so as to be able to say: 'By the power of
  my genius (we had not yet come to the star), I needed in this battle neither the second division of the first corps, nor my grenadier
  reserve, nor my guard.' And it was this bragging that kept him from taking 15,000 more men".
- **grade**: B (a participant's memoir, published 1894). **label**: fact (what Thiébault says); Ryazhsk disputed (Ryazan in the
  Materialien, §3.2, §3.4); the two regiments' relation to Kamensky's brigade disputed (Mikhailovsky-Danilevsky 1844 p. 187 and 1846
  p. 251: the brigade formed of them, §5.6, §6.5); the identification of this aide with p. 458's is an inference (below).
- **settles**: Thiébault gives a clock hour, half past eight, for an aide-de-camp's report that the heights had been abandoned, which
  this register identifies (inference, from the same words) with the report on which the signal was given (p. 458, "(un peu
  prématurément)", §4.2); Thiébault says Napoleon was misled by it ("il avait été trompé"). He names the Fanagoria and Ryazhsk regiments
  ("les régiments Fanagorski et Riajski") on the heights, listed apart from Kamensky's brigade (p. 504) and, on p. 474, as reinforcing it
  (§4.11); he does not make them the brigade's regiments, and his framing is Stutterheim's (p. 64, §2.6), whom he cites on p. 469 (§4.9)
  (inference: not an independent witness to the brigade's make-up). He repeats that I Corps' 2nd division was not engaged, in a boast he
  imputes to Napoleon ("afin de pouvoir dire"; a "forfanterie"), while arguing that a reserve should have supported his brigade.
- **does not settle**: the clock's basis; the hour of the twenty-minutes exchange itself ("au jour naissant", p. 456); that the aide of
  p. 504 and the aide of p. 458 are one (no page states it); whether "Riajski" renders Ряжскій (Ryazhsk: the reading of the spelling is an
  inference). See §13 F1, F2.
- **status**: read on the page image (both passages; the boast was read in the OCR at first and on image n517 for the review of this
  register); not yet second-read (H-17).

### 4.11 `thieb.p474.reinforced`: Kamensky's brigade "renforcée par les régiments de Fanagorski et Riajski" (p. 474)
- **source**: p. 474; image n485 (https://archive.org/download/mmoires03thieuoft/page/n485.jpg).
- **quote**: "Une fois hors de la portée de notre canon, les débris des régiments repoussés avaient été promptement reformés, et, lorsque
  la brigade Kamenski, renforcée par les régiments de Fanagorski et Riajski, eut rétabli le combat contre nous, elle s'était trouvée
  rejointe par ces débris reformés."
- **translation**: "Once out of range of our guns, the remnants of the regiments driven back had been quickly re-formed, and, when
  Kamensky's brigade, reinforced by the Fanagoria and Ryazhsk ("Riajski") regiments, had restored the fight against us, it had been
  joined by these re-formed remnants."
- **grade**: B (a participant's memoir, published 1894; his own sector). **label**: disputed (Mikhailovsky-Danilevsky 1844 p. 187 and
  1846 p. 251: the brigade formed of these two regiments, §5.6, §6.5); it agrees with Stutterheim (§2.6) and the Materialien's
  translation of him (p. 58, §3.2).
- **settles**: in Thiébault, the two regiments reinforce Kamensky's brigade; they are not its own regiments.
- **does not settle**: what the brigade itself was made of; a clock hour; whether "Riajski" renders Ряжскій (inference, as §4.10).
- **status**: read on the page image; not yet second-read (H-17).

## 5. `mikhailovsky1846`: the official Russian history in French, 1846

### 5.1 `md1846.p229.night-crossing`: Soult and Bernadotte across the brook at nightfall (p. 229)
- **source**: p. 229; image n253.
- **quote**: "A la nuit tombante, il fit passer le ruisseau à Soult et à Bernadotte, les plaça en avant de Girzikowitz, Pontowitz et
  Kobelnitz, et fit avancer ses réserves de manière à attaquer notre centre. A dix heures du soir, ce changement fut exécuté pendant
  l'obscurité la plus profonde".
- **translation**: "At nightfall he had Soult and Bernadotte cross the stream, placed them in front of Girzikowitz, Pontowitz and
  Kobelnitz, and brought his reserves forward so as to attack our centre. At ten in the evening this change was carried out in the deepest
  darkness".
- **grade**: B (an official history from the archives, 1844, translated 1846). **label**: disputed (Stutterheim pp. 55-56: the crossing
  at the time of Soult's attack, §2.3).
- **settles**: Mikhailovsky-Danilevsky's night crossing of I Corps (the other side kept in drouet@3's note, C7).
- **does not settle**: where on the far bank I Corps stood at dawn; the sources of this passage are not cited on the page.
- **status**: read on the page image; not yet second-read (H-17).

### 5.2 `md1846.p227-230.strengths`: no Allied estimate of the French strength (pp. 227-230)
- **source**: pp. 227-230 (the item's page index n251-n254); searched in the text layer; p. 229 also read on its image (§5.1).
- **quote** (p. 227): "Là totalité de notre armée s'élevait à peu près à 80,000 hommes." (OCR; "Là" as OCR'd). Pp. 228-229 list the
  French corps by divisions without numbers.
- **translation**: "The whole of our army amounted to about 80,000 men."
- **grade**: B. **label**: fact (the Allied figure); the absence of a French estimate is a negative finding.
- **settles**: these pages give the Allied army about 80,000 and no figure for the French (C12, question 151: "about 50,000 by the Allied
  estimate" has no support here).
- **does not settle**: whether the Allied staff made such an estimate elsewhere.
- **status**: searched in the text layer (OCR); not yet second-read (H-17).

### 5.3 `md1846.p233.uvarov`: Uvarov's three regiments sent to Bagration's left the same evening (p. 233)
- **source**: p. 233; image n257.
- **quote**: "Afin de renforcer cette gauche de Bagration, on lui envoya le soir même, sous les ordres de l'aide de camp général Ouvaroff,
  les régiments de hussards d'Elisabethgrad, et ceux de dragons de Kharkoff et de Tchernigoff, qui précédemment faisaient partie de la
  cinquième colonne."
- **translation**: "To reinforce this left of Bagration's, there were sent to him that same evening, under Adjutant-General Uvarov, the
  Elisabethgrad hussar and the Kharkov and Chernigov dragoon regiments, which had previously been part of the fifth column."
- **grade**: B. **label**: disputed (Schönhals 1873, read in 6B, keeps Uvarov's brigade in Liechtenstein's column:
  `docs/stage6-evidence/readings-composition.md`, al.lich.oob.schoenhals and al.uvarov.transfer.md).
- **settles**: Mikhailovsky-Danilevsky's transfer of Uvarov's regiments the evening before (C9, lich.staff).
- **does not settle**: the strength left with Liechtenstein.
- **status**: read on the page image; not yet second-read (H-17).

### 5.4 `md1846.p238-239.eight`: the columns leave at eight; Napoleon on a height near Schlapanitz; Bernadotte and Soult ordered onto the heights (pp. 238-239)
- **source**: pp. 238-239; images n262 and n265 (the plate no. 7 between).
- **quote** (p. 238): "Le 20 novembre (2 décembre), à huit heures du matin, les trois premières colonnes quittèrent leurs bivouacs (1).
  [...] Napoléon se tenait en observation sur une hauteur, près de Schlapanitz, entouré de ses maréchaux, que, dès l'aube du jour, il avait
  mandés près de lui. Le mouvement de nos troupes, favorisé par un brouillard assez épais, n'avait pas d'abord été aperçu; mais lorsque le
  soleil eut éclairé la cime des montagnes, Napoléon vit avec joie que les hauteurs que nous occupions se dégarnissaient [...] il donna
  définitivement à ses maréchaux les ordres suivants : 1° A Bernadotte et à Soult de s'emparer des hauteurs de Pratzen, de couper notre armée
  en / deux, et de commencer l'attaque au bout d'une demi-heure". Footnote (1): "Plan de la bataille d'Austerlitz, no 7."
- **translation**: "On 20 November (2 December), at eight in the morning, the first three columns left their bivouacs. [...] Napoleon
  stood observing on a height near Schlapanitz, surrounded by his marshals, whom he had summoned to him from the first light of day. The
  movement of our troops, favoured by a fairly thick fog, was not at first seen; but when the sun had lit the tops of the hills, Napoleon
  saw with joy that the heights we occupied were being emptied [...] he gave his marshals these final orders: 1st, to Bernadotte and Soult,
  to seize the heights of Pratzen, cut our army in two, and begin the attack in half an hour".
- **grade**: B. **label**: fact (what the 1846 translation says); its "à huit heures" translates the Russian "въ 8-мъ часу", in the eighth
  hour, i.e. between seven and eight (§6.3; §13 F3).
- **settles**: Mikhailovsky-Danilevsky has Bernadotte and Soult ordered onto the Pratzen together (question 157's evidence for "centre");
  the marshals summoned to Napoleon on a height near Schlapanitz.
- **does not settle**: the hour Napoleon took post; which height (the Russian has "курганъ", a barrow, §6.3).
- **status**: read on the page images; not yet second-read (H-17).

### 5.5 `md1846.p241-242.kamensky`: Kamensky with "Riajsk"; half past eight is Dokhturov's attack on Telnitz (pp. 241-242)
- **source**: pp. 241-242; images n267-n268. (p. 224, OCR, lists in Langeron's column "Wiborg", "Perro" [Perm], "Koursk", "Riajsk" and the
  "Grenadiers de Phanagorie".)
- **quote**: "Le comte de Langeron quitta son bivouac à peu près en même temps que Doctouroff, la gauche en avant, précédé par le 8e régiment
  de chasseurs à pied, et soutenu par ceux de Wibourg, de Perm et de Koursk. Derrière Langeron marchait le comte de Kamenski, avec le régiment
  de Riajsk et celui / des grenadiers de Phanagorie. A huit heures et demie, lorsque Doctouroff commença l'attaque de Tellnitz, Langeron
  s'approcha du Goldbach".
- **translation**: "Count Langeron left his bivouac at about the same time as Dokhturov, left in front, preceded by the 8th jäger regiment
  and supported by those of Vyborg, Perm and Kursk. Behind Langeron marched Count Kamensky with the Ryazhsk regiment and the Fanagoria
  grenadiers. At half past eight, when Dokhturov began the attack on Telnitz, Langeron approached the Goldbach".
- **grade**: B. **label**: fact (what it says); Ryazhsk disputed (§3.2).
- **settles**: the 1846 translation's "Riajsk" with Kamensky; its half past eight is Dokhturov's attack on Telnitz (after Kienmayer's
  attacks, p. 240), not the start of the I Column's descent.
- **does not settle**: when the I Column began to descend (decision 125 (a)'s first dispute).
- **status**: read on the page images; not yet second-read (H-17).

### 5.6 `md1846.p251-257.kamensky-kursk-blasowitz`: Kamensky turns; the Kursk regiment; Blasowitz (pp. 251-257)
- **source**: pp. 251-257; images n277 (p. 251), n279-n281 (pp. 253-255), n283 (p. 257); p. 252 and p. 256 in the OCR.
- **quote** (p. 251): "Koutouzoff se rendit à l'aile gauche de la quatrième colonne; après avoir franchi la montagne, il y trouva la
  brigade du comte Kamenski Ier, formée des régiments de grenadiers de Phanagorie et Riajsk. Cette brigade, en marchant à la suite de la
  colonne de Langeron, vers Sokolnitz, avait aperçu à la droite les Français qui escaladaient les hauteurs de Pratzen. Kamenski prévint
  Langeron, arrêta ses troupes, les mit en position verticalement vis-à-vis du flanc droit de l'ennemi, et l'attaqua dans le but de faire
  une diversion favorable à la quatrième colonne (1)." Footnote (1): "Rapports de Langeron à Koutouzoff, du 23 novembre (v. style)."
- **quote** (pp. 253-254): "A peine Koutouzoff s'était-il retiré avec la brigade de Kamenski que le comte Langeron arriva avec le régiment
  du Koursk sur la place même où cette brigade venait de combattre. [...] Les Français attaquèrent le régiment de Koursk, qui, se trouvant
  seul exposé au mouvement d'un ennemi infiniment supérieur en nombre, fut complétement détruit. Ce régiment perdit à cette seule bataille
  1600 hommes."
- **quote** (p. 255): "Il ordonna aussitôt à une partie de la division Riveau, du corps de Bernadotte, envoyée à l'avance à Pratzen, et à
  deux divisions du corps de Lannes, celle de Cafarelli et la division de cavalerie de Kellermann, de marcher sur Blasowitz et d'occuper
  l'espace qui avait été réservé au prince Lichtenstein." (p. 257): "Les Français forcèrent nos troupes d'évacuer Blasowitz; leurs
  batteries firent feu sur la garde. Ce fut seulement à ce moment que parut le prince de Lichtenstein".
- **translation**: (p. 251) "Kutuzov went to the left wing of the fourth column; having crossed the hill he found there the brigade of
  Count Kamensky I, formed of the Fanagoria grenadier and Ryazhsk regiments. This brigade, marching behind Langeron's column toward
  Sokolnitz, had seen on its right the French climbing the heights of Pratzen. Kamensky warned Langeron, halted his troops, placed them
  facing the enemy's right flank, and attacked it to make a diversion in favour of the fourth column." (1) "Langeron's reports to Kutuzov
  of 23 November (old style)." (pp. 253-254) "Hardly had Kutuzov withdrawn with Kamensky's brigade when Count Langeron arrived with the
  Kursk regiment on the very ground where that brigade had just fought. [...] The French attacked the Kursk regiment, which, alone exposed
  to an enemy infinitely superior in number, was completely destroyed. This regiment lost 1,600 men in this battle alone." (p. 255) "He at
  once ordered part of Rivaud's division of Bernadotte's corps, sent ahead to Pratzen, and two divisions of Lannes's corps, Caffarelli's
  and Kellermann's cavalry division, to march on Blasowitz and occupy the space that had been reserved for Prince Liechtenstein." (p. 257)
  "The French forced our troops to evacuate Blasowitz; their batteries fired on the Guard. Only at that moment did Prince Liechtenstein
  appear".
- **grade**: B. **label**: fact (what it says); Kamensky's hour is not given here (a sequence); Blasowitz's attackers disputed (§2.5, §4.6);
  the Kursk loss uncertain (one history; §13 F5); the brigade's make-up and who turned it disputed (§2.6, §3.4, §4.11; §13 F13).
- **settles**: Kamensky turned on seeing the French climb, before Kutuzov arrived (the critic's item 2: "the first to see" was the
  event's side, not this account's); "Riajsk" with Fanagoria, citing Langeron's report; Napoleon's order sending part of Rivaud's division
  and Lannes's Caffarelli and Kellermann toward Blasowitz (p. 255; the plan's question 158 has "p. 256"); Langeron's reinforcement as the
  Kursk regiment (pp. 253-254).
- **does not settle**: any clock hour for Kamensky's turn; who took Blasowitz (p. 257 says "les Français").
- **status**: pp. 251, 253-255, 257 read on the page images; not yet second-read (H-17).

### 5.7 `md1846.p256-257.blasowitz-guard`: the Guard's jäger battalion in Blasowitz, reinforced by a Semenovsky battalion; Liechtenstein only after the village was lost (pp. 256-257)
- **source**: pp. 256-257; images n282 (p. 256) and n283 (p. 257) (https://archive.org/download/relationdelacam00dangoog/page/n282.jpg,
  https://archive.org/download/relationdelacam00dangoog/page/n283.jpg). Read on the images for C14a (question 158); §5.6 had p. 256 in the
  OCR only.
- **quote** (p. 256): "Le grand-duc ordonna au bataillon des chasseurs de la garde, sous le commandement du comte de Saint-Priest, tué en
  1814 à Reims, d'occuper le village de Blasowitz, et fit aussitôt prévenir de cette attaque inattendue le prince Bagration, son / (p. 257)
  compagnon de gloire dans la campagne d'Italie. Bagration répondit à Son Altesse qu'elle avait pris la meilleure résolution, celle de
  défendre Blasowitz, et que tout ce qu'elle pouvait faire de mieux était de s'y maintenir jusqu'à ce qu'on connût le motif de l'absence du
  prince de Lichtenstein. Le grand-duc dépêcha, comme renfort, aux chasseurs à pied, un bataillon des gardes de Séménowski." (p. 257,
  further down, quoted in §5.6): "Les Français forcèrent nos troupes d'évacuer Blasowitz; leurs batteries firent feu sur la garde. Ce fut
  seulement à ce moment que parut le prince de Lichtenstein".
- **translation**: "The Grand Duke ordered the Guard's jäger battalion, under the command of Count Saint-Priest, killed in 1814 at Reims,
  to occupy the village of Blasowitz, and at once informed Prince Bagration, his companion in glory in the Italian campaign, of this
  unexpected attack. Bagration answered His Highness that he had taken the best resolution, that of defending Blasowitz, and that the best
  he could do was to hold there until the reason for Prince Liechtenstein's absence was known. The Grand Duke sent a battalion of the
  Semenovsky Guards to reinforce the jägers." "The French forced our troops to evacuate Blasowitz; their batteries fired on the Guard.
  Only at that moment did Prince Liechtenstein appear".
- **grade**: B. **label**: fact (what it says); the attackers disputed (§2.5, §2.7, §4.6); Liechtenstein's arrival disputed (Stutterheim
  p. 56: at the same moment as the occupation, §2.7).
- **settles**: in Mikhailovsky-Danilevsky, the defenders of Blasowitz are the Russian Guard's (the jäger battalion and a Semenovsky
  battalion), Bagration being only informed; Liechtenstein appears only after the village is lost (question 158).
- **does not settle**: which French troops took the village (p. 257: "les Français"; p. 255 has Napoleon order part of Rivaud's division
  and Lannes's Caffarelli and Kellermann toward it, §5.6); a clock hour.
- **status**: read on the page images; not yet second-read (H-17).

## 6. `mikhailovsky1844`: the Russian original, 1844

Read on the page images (IIIF, k = the hOCR page index); the hOCR text layer was used only to find pages and words.

### 6.1 `md1844.title`: the title page (k = 1)
- **quote**: "Описаніе первой войны Императора Александра съ Наполеономъ, въ 1805-мъ году, по Высочайшему повелѣнію сочиненное
  Генералъ-Лейтенантомъ и Членомъ Военнаго Совѣта Михайловскимъ-Данилевскимъ. Съ девятью планами и картами. Санктпетербургъ. 1844."
- **translation**: "Description of the first war of the Emperor Alexander with Napoleon, in the year 1805, composed by Imperial command by
  Lieutenant-General and Member of the War Council Mikhailovsky-Danilevsky. With nine plans and maps. St Petersburg, 1844."
- **settles**: the work and its date; the 1846 French "Relation" (§5) is its translation (one witness, two languages).
- **status**: read on the page image; not yet second-read (H-17).

### 6.2 `md1844.p167.columns`: Langeron's column, "Ряжскій" (p. 167, k = 176)
- **quote**: "2-я колонна, Графа Ланжерона. Полки: 8-й егерскій, Мушкетерскіе: Выборгскій, Пермскій, Курскій, Ряжскій, Фанагорійскій
  гренадерскій, 1 рота піонеровъ, 2½ сотни казаковъ."
- **translation**: "2nd column, Count Langeron's. Regiments: the 8th jäger; musketeers: Vyborg, Perm, Kursk, Ryazhsk; the Fanagoria
  grenadiers; 1 company of pioneers; 2½ sotnias of Cossacks."
- **grade**: B. **label**: disputed (Ryazan in the Materialien, §3.2).
- **settles**: the Russian original's Ryazhsk in Langeron's column. Noted in passing: on the same page Kienmayer's detachment has "3 полка
  слабыхъ Венгерской конницы" (3 weak regiments of Hungarian cavalry) where the 1846 translation p. 224 has "2 faibles régiments" (§13 F9).
- **status**: read on the page image; not yet second-read (H-17).

### 6.3 `md1844.p174-177.uvarov-eight-kurgan`: Uvarov's regiments in the evening (p. 174, k = 184); the eighth hour; the barrow by Schlapanitz (p. 177, k = 188)
- **quote** (p. 174): "Для усиленія лѣваго крыла его, послали ему ввечеру изъ колонны Князя Лихтенштейна, порученные Генералъ-Адъютанту
  Уварову, полки Елисаветградскій гусарскій, Черниговскій и Харьковскій драгунскіе."
- **quote** (p. 177): "Ноября 20-го, въ 8-мъ часу утра, первыя три колонны выступили съ ночлега: (*) Дохтуровъ пошелъ къ Тельницу; на
  правомъ крылѣ его слѣдовалъ Графъ Ланжеронъ; Пржибышевскій спускался отъ Працена къ Сокольницу. Наполеонъ стоялъ на курганѣ при
  Шлапаницѣ, окруженный своими маршалами, еще до зари къ нему созванными. Движенія наши были сперва скрыты отъ него туманомъ."
- **translation**: (p. 174) "To strengthen his [Bagration's] left wing, there were sent to him in the evening from Prince Liechtenstein's
  column, entrusted to Adjutant-General Uvarov, the Elisavetgrad hussar, Chernigov and Kharkov dragoon regiments." (p. 177) "On 20
  November, in the eighth hour of the morning, the first three columns set out from their bivouac: Dokhturov went toward Telnitz; on his
  right wing followed Count Langeron; Przybyszewski descended from Pratzen toward Sokolnitz. Napoleon stood on the barrow by Schlapanitz,
  surrounded by his marshals, summoned to him even before dawn. Our movements were at first hidden from him by the fog."
- **grade**: B. **label**: fact (what the original says); "въ 8-мъ часу" is the Russian idiom for the hour between seven and eight (a
  reading of the idiom: inference); the 1846 translation renders it "à huit heures" (§5.4).
- **settles**: the original's Uvarov transfer "ввечеру" (in the evening); its hour for the columns' setting out, between seven and eight;
  Napoleon on a "курганъ" (barrow) by Schlapanitz with the marshals summoned before dawn.
- **does not settle**: that the barrow is the Zuran (inference, not stated); the hour he took post; the clock's basis. See §13 F3, F4.
- **status**: read on the page images; not yet second-read (H-17).

### 6.4 `md1844.p179.half-past-eight`: Kamensky "съ полками Ряжскимъ мушкетерскимъ и Фанагорійскимъ гренадерскимъ"; Langeron at the Goldbach at half past eight (p. 179, k = 190)
- **quote**: "въ замкѣ слѣдовалъ Графъ Каменскій 1-й, съ полками Ряжскимъ мушкетерскимъ и Фанагорійскимъ гренадерскимъ. Въ половинѣ 9-го,
  когда Дохтуровъ началъ атаку Тельница, Графъ Ланжеронъ подошелъ къ Гольдбаху, былъ встрѣченъ поставленными на другомъ берегу ручья
  стрѣлками и батареями, и завязалъ дѣло съ непріятелемъ." The page's only footnote, "(*) Донесеніе Графа Буксгевдена Кутузову", is
  anchored to the Telnitz sentence above (OCR for the anchor).
- **translation**: "at the rear followed Count Kamensky I with the Ryazhsk musketeer and Fanagoria grenadier regiments. At half past eight,
  when Dokhturov began the attack on Telnitz, Count Langeron came up to the Goldbach, was met by skirmishers and batteries placed on the far
  bank of the stream, and engaged the enemy." (The footnote: "Count Buxhowden's report to Kutuzov.")
- **grade**: B. **label**: fact (what it says); Ryazhsk disputed (§3.2).
- **settles**: the original's Ryazhsk with Kamensky; Langeron at the Goldbach at half past eight.
- **does not settle**: the source of the half past eight (the page's footnote is anchored elsewhere).
- **status**: read on the page image; not yet second-read (H-17).

### 6.5 `md1844.p186-187.kamensky`: Kamensky's turn, citing Langeron's report no. 867 (pp. 186-187, k = 197-198)
- **quote**: (p. 186) "Кутузовъ поѣхалъ къ лѣвому крылу четвертой колонны. Подымаясь на гору, онъ нашелъ тамъ бригаду Графа / (p. 187)
  Каменскаго 1-го, полки Фанагорійскій и Ряжскій, очутившіеся на горѣ по слѣдующему случаю: идучи въ замкѣ колонны Графа Ланжерона, къ
  Сокольницу, Графъ Каменскій увидѣлъ вправо Французовъ, входившихъ на Праценскія высоты. Извѣстя о томъ Графа Ланжерона, онъ остановилъ
  бригаду, построилъ ее отвѣсно противъ праваго крыла Французовъ, и атаковалъ, желая помочь 4-й колоннѣ. (*)" Footnote: "(*) Донесеніе
  Графа Ланжерона Кутузову, отъ 23-го Ноября, № 867."
- **translation**: "Kutuzov rode to the left wing of the fourth column. Climbing the hill, he found there the brigade of Count Kamensky I,
  the Fanagoria and Ryazhsk regiments, which had come to be on the hill as follows: marching at the rear of Count Langeron's column toward
  Sokolnitz, Count Kamensky saw on his right the French climbing onto the Pratzen heights. Having informed Count Langeron, he halted the
  brigade, formed it perpendicular against the French right wing, and attacked, wishing to help the 4th column." (Footnote: "Count
  Langeron's report to Kutuzov of 23 November, no. 867.")
- **grade**: B (citing a report of 23 November old style, 5 December new style: the conversion is derived). **label**: fact (what it
  says); Ryazhsk disputed (§3.2, §3.4); the brigade's make-up and who turned it disputed (§2.6, §3.4, §4.11; §13 F13).
- **settles**: the original's Ryazhsk, citing Langeron's report no. 867; the sequence (Kamensky sees the climb, warns Langeron, attacks).
- **does not settle**: a clock hour; the footnote's day is printed in a bold numeral read as 23 (it could be read 25; the 1846 translation,
  §5.6, has 23). **Corrected by the second reading (§6.8):** the second digit has a flat top with a hooked left end, like the
  footnote-size "5" in "5-й ... егерскіе" on p. 144 and unlike the round-topped "3" of "30-го Ноября" in p. 188's footnote; the hOCR reads
  "25". The second reader reads "отъ 25-го Ноября", 25 November (old style), with moderate confidence; the day is not settled (23 in the
  1846 translation), and it does not bear on question 153.
- **status**: read on the page images; not yet second-read (H-17).

### 6.6 `md1844.p256-257.tolstoy-corps`: the Ryazan regiment with Tolstoy's corps in Swedish Pomerania (pp. 256-257, k = 269-270)
- **quote**: (p. 256) "корпусъ Графа Толстаго отправился моремъ изъ Кронштата и Ревеля въ Шведскую Померанію. Въ составѣ его были полки
  Лейбъ-кирасирскій Его Величества, Курляндскій драгунскій, / (p. 257) Изюмскій гусарскій, два казачьи, Лейбъ-казачья Уральская сотня,
  Павловскій и Санктъ-Петербургскій гренадерскіе, Бѣлозерскій, Рязанскій и Кексгольмскій мушкетерскіе, 3-й морской, 1-й и 20-й егерскіе,
  всего 20,363 строевыхъ чиновъ."
- **translation**: "Count Tolstoy's corps sailed from Kronstadt and Reval to Swedish Pomerania. It comprised the Life Cuirassier
  regiment of His Majesty, the Courland dragoons, the Izyum hussars, two Cossack regiments, the Life Cossack Ural sotnia, the Pavlov and
  St Petersburg grenadiers, the Belozersk, Ryazan and Kexholm musketeers, the 3rd marine, the 1st and 20th jägers, 20,363 combatants in
  all."
- **grade**: B. **label**: fact (what it says).
- **settles**: in this history, the Ryazan musketeer regiment was in Tolstoy's corps sent to Swedish Pomerania (question 153's case for
  Ryazhsk at Austerlitz).
- **does not settle**: whether part of the Ryazan regiment could have been elsewhere; question 153 stays with the owner.
- **status**: read on the page images; not yet second-read (H-17).

### 6.7 `md1844.ocr`: further occurrences, found in the text layer only
- "Ряжск" also occurs in the OCR on pp. 144 (k = 152: in a footnote's list of musketeer regiments, its heading not read), 188, 189, 198 and
  205 (k = 199, 200, 209, 217: the Fanagoria and Ryazhsk regiments in the battle and the retreat). OCR only.
- "Шепел" occurs on pp. 33 and 37 (k = 39, 43: Shepelev commanding a column of Kutuzov's army in August 1805, and its cavalry in
  September) and p. 275 (k = 288: a Flügel-Adjutant Shepelev bringing news of Austerlitz); not in the battle chapter. OCR only.
- "Уваров" occurs on pp. 174, 196, 197, 205, 221 (OCR); p. 174 is read in §6.3.
- "Гладков" (Gladkov) is not found in the OCR of the whole volume (a negative in a text layer: a word the OCR misread would be missed).
- **status**: OCR only; not yet second-read (H-17). The "Ряжск" pages 144, 188, 189, 198 and 205 have since been read on their images in
  the second reading (§6.8).

### 6.8 `md1844.second-reading`: Ryazhsk with Kamensky, a second reading of the page images (question 153)
- **source**: the same and only archive.org scan, `1805-.-bmk-brz` (archive.org advancedsearch finds no other copy of the 1844 work), its
  page images read through the BookReader image API
  (`https://ia600806.us.archive.org/BookReader/BookReaderImages.php?zip=/16/items/1805-.-bmk-brz/<name>_jp2.zip&file=<name>_jp2/<name>_NNNN.jp2&scale=2`;
  leaf NNNN = the k of §6.2-§6.6), each page cropped and read by eye at full resolution, by a second reader on 8 October 2026 (H-17's
  practice; owner decision on question 153). An OCR search of the whole volume (hOCR, the patterns "Ряж", "Ряз", "яжс", "язан", "азанск")
  found the name on leaves 152, 176, 190, 198, 199, 200, 209, 217 (Ryazhsk) and 270 (Ryazan), each then read on its image.
- **readings** (as printed, read on the images):
  - pp. 143-144 (k = 151-152): the footnote on Buxhoeveden's corps lists "... Фанагорійскій гренадерскій, / Ряжскій, Архангелогородскій,
    Псковской, Пермскій, Староингерманландскій, Выборгскій и Курскій мушкетерскіе, 5-й и 7-й егерскіе ..." ("... the Fanagoria
    grenadiers, Ryazhsk, Arkhangelogorod, Pskov, Perm, Old Ingermanland, Vyborg and Kursk musketeers, the 5th and 7th jägers ..."): Ryazhsk
    came with Buxhoeveden's corps, beside Fanagoria (not the battle itself).
  - p. 167 (k = 176): as §6.2, word for word. The column's numeral is **2** ("2-я колонна, Графа Ланжерона"); the hOCR reads "3-я", but
    the image's 2 differs from the 3 that heads "3-я колонна, Пржибышевскаго" on p. 168 (k = 177), which has neither Fanagoria nor Ryazhsk.
  - p. 179 (k = 190): as §6.4.
  - p. 187 (k = 198): as §6.5 on the regiments ("полки Фанагорійскій и Ряжскій"); the footnote's day, below.
  - p. 188 (k = 199): "Дѣйствія Фанагорійскаго и Ряжскаго полковъ въ правый флангъ непріятелей удерживали довольно долго часть Сультова
    корпуса" ("The Fanagoria and Ryazhsk regiments' action against the enemy's right flank held part of Soult's corps for a fairly long
    time"); its footnote, quoting Kutuzov's report to the Emperor of 30 November: "...къ собранію людей Фанагорійскаго и Ряжскаго полковъ,
    съ которыми и могъ я въ нѣкоторомъ порядкѣ ретироваться" ("... in rallying the men of the Fanagoria and Ryazhsk regiments, with whom I
    was able to retire in some order").
  - p. 189 (k = 200): "...онъ остановилъ полки Фанагорійскій и Ряжскій, и не можетъ идти съ ними къ Сокольницу за второю колонною" ("...
    he had halted the Fanagoria and Ryazhsk regiments and could not go on with them to Sokolnitz after the second column").
  - p. 198 (k = 209): "Графъ Ланжеронъ, лишенный содѣйствія пошедшихъ съ Кутузовымъ полковъ Ряжскаго и Фанагорійскаго" ("Count Langeron,
    deprived of the support of the Ryazhsk and Fanagoria regiments, which had gone with Kutuzov").
  - p. 205 (k = 217): "Кутузовъ и Князь Волконской шли съ Фанагорійскимъ и Ряжскимъ полками на дорогу въ Венгрію" ("Kutuzov and Prince
    Volkonsky went with the Fanagoria and Ryazhsk regiments onto the road to Hungary").
  - p. 257 (k = 270): as §6.6 (Рязанскій in Tolstoy's corps); p. 256 was not viewed as an image in the second reading.
- **the footnote's day on p. 187**: the first reading (§6.5) gives "отъ 23-го Ноября"; the second reads **25** ("отъ 25-го Ноября", 25
  November old style), with moderate confidence (the digit's flat, hooked top matches the footnote "5" on p. 144, not the round "3" on
  p. 188; the hOCR reads "25"). Not settled; the 1846 translation prints 23 (§5.6). It does not bear on question 153.
- **grade**: B (as §6.2-§6.6). **label**: fact (what the book prints): no page of it names Ryazan (Рязанскій) in Kamensky's brigade, in
  Langeron's column or anywhere in Moravia; the book's only Рязанскій is in Tolstoy's corps (p. 257; leaves without an OCR hit were not
  read by eye). Against other witnesses the regiment's name stays disputed: the Materialien of 1806 print "Rjäsan" (p. 99, §3.2) and
  "Rjäsansche" in their translation of Kutuzov's report (p. 112, §3.4), and Duffy is cited in `data.js` for Ryazan (not read, §11).
- **settles**: what Mikhailovsky-Danilevsky prints: Ryazhsk (Ряжскій) is the musketeer regiment of Count Kamensky I's brigade at
  Austerlitz, with Fanagoria every time (pp. 167, 179, 187, 188, 189, 198, 205), the second reading agreeing with the first on every page
  the first cites. On the owner's answer to question 153 (8 October 2026), the map now names the regiment Ryazhsk and keeps Ryazan as the
  Materialien's and Duffy's reading (`data.js` kamensky.strengthNote; `appearance.js` COMPOSITION.kamensky).
- **does not settle**: the historical question against the other witnesses; this is a second reading of the same and only scan, not of a
  second copy.
- **status**: second-read on the page images (H-17's practice), 8 October 2026; the working notes are outside the repository.

## 7. `alombert4_1908`: the French returns of October 1805

### 7.1 `alo.p711.situation`: the situation of 28 October (p. 711)
- **source**: p. 711, OCR (the situation's heading).
- **quote**: "Grande Armée à l'époque du 6 brumaire an XIV."
- **translation**: "The Grande Armée as at 6 brumaire year XIV" (28 October 1805; the conversion is derived).
- **grade**: A for its own date. **label**: fact.
- **status**: OCR; not yet second-read (H-17).

### 7.2 `alo.p716-717.i-corps`: I Corps on 28 October: Drouet the 1st division, Rivaud the 2nd (pp. 716-717)
- **source**: pp. 716-717; images n724-n725.
- **quote**: (p. 716) "1re division du 1er corps. Général de division... Drouet." (p. 717) "Troupes... 27e légère; 94e de ligne; 95e de
  ligne. 2e division du 1er corps. Général de division... Rivaud. [...] Généraux de brigade.. Dumoulin; [...] Pacthod; [...] Troupes... 8e de
  ligne; 45e de ligne; 54e de ligne. Division de cavalerie du 1er corps. Général de division... Kellermann."
- **translation**: "1st division of I Corps: General of division Drouet. [...] troops: 27th light, 94th and 95th of the line. 2nd division
  of I Corps: General of division Rivaud; brigade generals Dumoulin, Pacthod; troops: 8th, 45th, 54th of the line. Cavalry division of I
  Corps: General of division Kellermann."
- **grade**: A for 28 October 1805; B for 2 December. **label**: disputed (the numbering differs on 26 October, §7.5).
- **settles**: on 28 October Drouet's division is the 1st and Rivaud's the 2nd of I Corps (C9).
- **does not settle**: their numbers on 2 December (neither return is of that day).
- **status**: read on the page images; not yet second-read (H-17).

### 7.3 `alo.p732.suchet`: Suchet's division the 3rd of V Corps, with the 17e légère (p. 732)
- **source**: p. 732; image n740.
- **quote**: "3e division du 5e corps. Général de division... Suchet. [...] Généraux de brigade.. Becker; [...] Roger-Walhubert; [...]
  Claparède. [...] Troupes... 17e légère; 34e de ligne; 40e de ligne; 64e de ligne; 88e de ligne."
- **translation**: "3rd division of V Corps: General of division Suchet; brigade generals Becker, Roger-Walhubert, Claparède; troops: 17th
  light, 34th, 40th, 64th and 88th of the line."
- **grade**: A for 28 October 1805; B for 2 December. **label**: fact.
- **settles**: on 28 October the 17e légère belongs to Suchet's division, numbered the 3rd of V Corps (C13; question 155).
- **does not settle**: the division's number on 2 December.
- **status**: read on the page image; not yet second-read (H-17).

### 7.4 `alo.p755-756.v-corps`: V Corps on 26 October: the grenadier division's artillery; Suchet the 3rd division (pp. 755-756)
- **source**: pp. 755-756; images n760-n761.
- **quote**: (p. 755) "Situation des divisions composant le 5e corps de la Grande Armée à l'époque du 4 brumaire an XIV (26 octobre 1805).
  [...] Division de grenadiers. 6e régiment d'artillerie à cheval [...] 1er — à pied [...] 5e bataillon bis du train [...] 2e comp. du 2e
  bataillon de sapeurs" (p. 756) "3e division aux ordres du général Suchet. [...] 17e rég. d'inf. légère [...] A Landshut, le 4 brumaire, an
  XIV."
- **translation**: "Situation of the divisions forming V Corps of the Grande Armée as at 4 brumaire year XIV (26 October 1805). [...]
  Grenadier division: 6th horse artillery regiment, 1st foot artillery, 5th bis train battalion, 2nd company of the 2nd sapper battalion
  [...]. 3rd division under General Suchet: [...] 17th light infantry regiment [...]. At Landshut, 4 brumaire year XIV."
- **grade**: A for 26 October 1805; B for 2 December. **label**: fact.
- **settles**: on 26 October the grenadier division is listed with horse and foot artillery (question 155), and Suchet's division is the
  3rd, with the 17e légère.
- **does not settle**: the artillery with the grenadiers on 2 December.
- **status**: read on the page images; not yet second-read (H-17).

### 7.5 `alo.p762.i-corps`: I Corps on 26 October: Pacthod's 1st division, Drouet's 2nd, Kellermann's advance guard with the 27e légère (p. 762)
- **source**: p. 762; image n766.
- **quote**: "Force des troupes du 1er corps de la Grande Armée en présents sous les armes, prêts à combattre, commandée par S. E. le maréchal
  Bernadotte. 4 brumaire (26 octobre). [...] Division d'avant-garde, général Kellermann: 27e rég. d'infant. légère. 4e rég. de hussards.
  5e rég. de chasseurs. Une comp. d'artill. légère. 1re division, commandée par le génal Pacthod: 8e rég. d'infant de ligne. 45e rég. d'inf.
  de ligne (1). Une comp. d'artillerie (2). 2e division, général Drouet: 94e rég. d'infant. de ligne. 95e rég. d'infant. de ligne. 2e rég.
  de hussards. 5e rég. de hussards. Une comp. d'artillerie." Notes: "(1) Le 54e régiment qui fait partie de la 1re division est à
  Ingolstadt. (2) A reçu l'ordre de se diriger sur Munich, ainsi que le général Rivaud; sa force est de 75 officiers et 1,815 hommes."
- **translation**: "Strength of the troops of I Corps of the Grande Armée present under arms, ready to fight, commanded by H.E. Marshal
  Bernadotte, 4 brumaire (26 October). Advance-guard division, General Kellermann: 27th light infantry, 4th hussars, 5th chasseurs, one
  company of light artillery. 1st division, commanded by General Pacthod: 8th and 45th of the line, one artillery company. 2nd division,
  General Drouet: 94th and 95th of the line, 2nd and 5th hussars, one artillery company." Notes: "(1) The 54th, which belongs to the 1st
  division, is at Ingolstadt. (2) Has received the order to go to Munich, as has General Rivaud; its strength is 75 officers and 1,815
  men."
- **grade**: A for 26 October 1805; B for 2 December. **label**: disputed (the numbering differs on 28 October, §7.2); that the "1re
  division" here is Rivaud's is an inference from its regiments (8e, 45e, 54e, as Rivaud's on 28 October), its brigade general (Pacthod)
  and note (2).
- **settles**: on 26 October Drouet's division is the 2nd, with the 94e, 95e and two hussar regiments; the 27e légère is in Kellermann's
  advance-guard division; the 1st division (the 8e and 45e, the 54e detached) is under Pacthod (C9's Rivaud and Drouet notes).
- **does not settle**: the numbers on 2 December.
- **status**: read on the page image; not yet second-read (H-17).

### 7.6 `alo.p69.caffarelli`: Caffarelli replaces the wounded Bisson at the head of his division (p. 69)
- **source**: p. 69 (Introduction, chapter IX, "Journée du 2 novembre", which begins on p. 68); image n78
  (https://archive.org/download/la-campagne-de-1805-en-allemagne-vol.-4/page/n78.jpg). Read on the image for C14a (question 155). The
  division's number is the situation of 28 October, pp. 723-724: "1re division du 3e corps. Général de division... Bisson", read in
  `docs/stage6-evidence/readings-composition.md` (fr.caffarelli.regiments; `appearance.js` COMPOSITION.caffarelli).
- **quote**: "La blessure du général Bisson l'obligeant à garder le repos pendant quelque temps, il est remplacé par le général Caffarelli,
  aide de camp de l'Empereur, qui commandera la division jusqu'à la fin de la campagne."
- **translation**: "General Bisson's wound obliging him to rest for some time, he is replaced by General Caffarelli, aide-de-camp to the
  Emperor, who will command the division until the end of the campaign."
- **grade**: B (the historical section's narrative, 1908, written from the archives). **label**: fact (what it says).
- **settles**: that the division Caffarelli led is Bisson's, the 1st of III Corps in the situation of 28 October (question 155: the
  number the map's "1re Div., V Corps" left unsaid).
- **does not settle**: the division's number or attachment on 2 December (the map's "with V Corps" is its staff line's "Attached from III
  Corps for the battle").
- **status**: read on the page image; not yet second-read (H-17).

## 8. `marbot1891`: an aide-de-camp's memoir, published 1891 (the 27th edition read)

### 8.1 `marbot.p258.night`: no moon, thick fog (p. 258)
- **source**: p. 258, OCR (hOCR page 279); the same page as `docs/stage6-evidence/readings-eyewitness.md`'s weather.night1to2.cold-fog.
- **quote**: "Il n'y avait point de lune, et l'obscurité de la nuit était augmentée par un épais brouillard qui rendait la marche fort
  difficile."
- **translation**: "There was no moon, and the darkness of the night was increased by a thick fog that made marching very difficult."
- **grade**: B. **label**: disputed (Mikhailovsky-Danilevsky 1846 p. 235: the moon showed several times; Thiébault p. 456: a clear night;
  §13 F7).
- **status**: OCR; not yet second-read (H-17).

### 8.2 `marbot.p260.centre-sun`: "le centre, formé par les troupes des maréchaux Soult et Bernadotte"; "ce brillant soleil d'Austerlitz" (p. 260)
- **source**: p. 260; image n279 (https://archive.org/download/mmoiresdugn01marbuoft/page/n279.jpg). (The critic's item 1.)
- **quote**: "Pendant que notre gauche remportait cet éclatant succès, le centre, formé par les troupes des maréchaux Soult et Bernadotte,
  placé par l'Empereur au fond du ravin de Goldbach où il était caché par un épais brouillard, s'élançait vers le coteau sur lequel est situé
  le village de Pratzen. Ce fut à ce moment que parut dans tout son éclat ce brillant soleil d'Austerlitz, dont Napoléon se plaisait tant à
  rappeler le souvenir."
- **translation**: "While our left was winning this brilliant success, the centre, formed by the troops of Marshals Soult and Bernadotte,
  placed by the Emperor at the bottom of the Goldbach ravine where it was hidden by a thick fog, rushed toward the slope on which the
  village of Pratzen stands. It was at that moment that the brilliant sun of Austerlitz appeared in all its splendour, the sun whose memory
  Napoleon so liked to recall."
- **grade**: B (a participant's memoir, published 1891). **label**: fact (what Marbot says); the "centre" is disputed against the map's
  I Corps as "general reserve" (question 157).
- **settles**: Marbot's centre of Soult's and Bernadotte's troops, hidden by fog in the Goldbach ravine (question 157's evidence); his
  "soleil d'Austerlitz" (italic in the print) lighting the climb toward Pratzen, the sun Napoleon liked to recall (C22).
- **does not settle**: a clock hour; that I Corps climbed the Pratzen (Marbot then names only Soult taking the plateau).
- **status**: read on the page image; not yet second-read (H-17).

### 8.3 `marbot.p262-263.ice`: the ice broken by the Guard's artillery; thousands sinking (pp. 262-263)
- **source**: pp. 262-263; image n282 (p. 263), p. 262 OCR.
- **quote**: (p. 263) "enfin, le plus grand nombre des ennemis, principalement les Russes, cherchent un passage sur la glace des étangs.
  Elle était fort épaisse, et déjà cinq ou six mille hommes, conservant un peu d'ordre, étaient parvenus au milieu du lac Satschan, lorsque
  Napoléon, faisant appeler l'artillerie de sa garde, ordonne de tirer à boulets sur la glace. Celle-ci se brisa sur une infinité de points
  [...] et nous vîmes des milliers de Russes, ainsi que leurs nombreux chevaux, canons et chariots, s'enfoncer lentement dans le gouffre!
  [...] Quelques-uns, en très petit nombre, parvinrent à se sauver [...]; mais la plus grande partie fut noyée!"
- **translation**: "at last most of the enemy, chiefly the Russians, seek a way over the ice of the ponds. It was very thick, and five or
  six thousand men, keeping some order, had already reached the middle of the Satschan lake when Napoleon, calling up the artillery of his
  guard, orders it to fire roundshot at the ice. The ice broke at countless points [...] and we saw thousands of Russians, with their many
  horses, guns and wagons, sink slowly into the abyss! [...] A very few managed to save themselves [...]; but the greater part was drowned!"
- **grade**: B (a participant's memoir, published 1891, recalling what he says he saw). **label**: disputed (Thiébault's three to four
  thousand, §4.8; the Bulletin's 20,000, §1.6; the drained count).
- **settles**: Marbot's thousands drowned when the Guard's artillery broke the ice (C11, question 150).
- **does not settle**: a number (his "cinq ou six mille" are those on the ice; "la plus grande partie" of them drowned); where the guns
  stood.
- **status**: p. 263 read on the page image; not yet second-read (H-17).

### 8.4 `marbot.p259-260.blasiowitz`: Lannes drives the enemy back across the Olmütz road "jusqu'à Blasiowitz" (pp. 259-260)
- **source**: pp. 259-260; images n278 (p. 259, its last line) and n279 (p. 260, its first lines)
  (https://archive.org/download/mmoiresdugn01marbuoft/page/n278.jpg, .../page/n279.jpg). The sentence stands just before the passage of
  §8.2. (The review of C14a-C18, item 5.)
- **quote**: "Mais à notre gauche, le maréchal Lannes non seulement / repoussa toutes les attaques des ennemis contre le Santon, mais il
  les rejeta de l'autre côté de la route d'Olmütz jusqu'à Blasiowitz, où le terrain, devenant plus uni, permit à la cavalerie de Murat
  d'exécuter plusieurs charges brillantes, dont le résultat fut immense, car les Russes furent menés tambour battant jusqu'au village
  d'Austerlitz."
- **translation**: "But on our left Marshal Lannes not only repulsed all the enemy's attacks on the Santon, but threw them back across the
  Olmütz road as far as Blasiowitz, where the ground, becoming more level, allowed Murat's cavalry to make several brilliant charges,
  whose result was immense, for the Russians were driven at the double as far as the village of Austerlitz."
- **grade**: B (a participant's memoir, published 1891). **label**: fact (what Marbot says); it bears on the disputed attackers at
  Blasowitz (question 158: Lannes's V Corps in Thiébault p. 462, §4.6; Bernadotte's corps in Stutterheim p. 68, §2.5; both in
  Mikhailovsky-Danilevsky 1846 p. 255, §5.6).
- **settles**: Marbot's Lannes drives the enemy back to Blasiowitz, and Murat's cavalry charges there: a fourth account read that sends
  Lannes toward Blasowitz.
- **does not settle**: who held or took the village (Marbot names no defenders, so the defenders' "three accounts read", §2.7, §5.7,
  stand); a clock hour.
- **status**: read on the page images; not yet second-read (H-17).

## 9. `tolstoy_maude`: War and Peace, Book Three, chapter XVIII

### 9.1 `tolstoy.b3c18.forty`: "some forty men" (Book Three: 1805, chapter XVIII)
- **source**: tolstoy_maude, Book Three (1805), chapter XVIII (Project Gutenberg #2600, the text file's lines 16360-16384).
- **quote**: "The ice, that had held under those on foot, collapsed in a great mass, and some forty men who were on it dashed, some forward
  and some back, drowning one another."
- **grade**: not graded (a novel; not a source for the event). **label**: fact (what the novel says).
- **settles**: the novel's scene has some forty men on the ice, not a mass drowning: the attribution "the mass drowning is propaganda that
  Tolstoy later made permanent" (`data.js` FEATURES Satschan story) has no support in this text (C11).
- **status**: read in the text; not yet second-read (H-17).

## 10. Searched and not found

- **Ségur.** Two volumes searched in the design session (8 October 2026) and searched again here in the same text files: Ségur, *Du Rhin
  à Fontainebleau* (Paris, Nelson, 1913; https://archive.org/details/durhinfontaine00sg) and Ségur, *Histoire et mémoires*, t. I (2nd ed.,
  Paris, Firmin-Didot, 1877; a Google scan whose archive.org identifier the design session did not record). Neither has "soleil
  d'Austerlitz". Ségur's history of 1812 (archive.org has it, e.g. https://archive.org/details/histoiredenapol01sg) was not read: the
  later invocation of the phrase stays a lead for step 4.
- **The Allied estimate of the French strength.** Mikhailovsky-Danilevsky 1846 pp. 227-230 and 237-238: not found (§5.2).
- **"Гладков" (Gladkov).** Not found in the OCR of Mikhailovsky-Danilevsky 1844 (§6.7).

## 11. Not readable

- Duffy 1977 (*Austerlitz 1805*) and Smith 1998 (*The Greenhill Napoleonic Wars Data Book*): in copyright; not read. Their attributions in
  `data.js` stay as cited, unchecked.
- Stutterheim's French original: Gallica was blocked in the design session; in this reading its IIIF page images were reachable (its text
  layer, `texteBrut`, was refused, HTTP 403), and §2.3 was read on them.

## 12. What these readings bear on (by step-2 commit and owner question)

| commit / question | entries |
|---|---|
| C3 (125 (a): the kamensky event's text; with C9, kamensky.role) | §2.6, §3.4, §5.6, §6.5, §4.11 (who turned the brigade; §13 F13) |
| C7 (H-2, Drouet's departure) | §2.1, §2.3 (with the French original), §3.1, §5.1, §1.5; the critic's item 1: §2.3's "nahm seine Richtung nach den Anhöhen bey Blasowitz" |
| C8 (H-7, the twenty minutes) | §4.2; §4.10 and §13 F1 |
| C9 (H-11) | §7.2, §7.5 (Rivaud, Drouet); §7.3 (Suchet); §3.2, §3.4, §2.6, §5.5, §5.6, §6.2, §6.4, §6.5, §6.6, §4.10, §4.11 (Ryazhsk or Ryazan; the brigade's make-up, §13 F2, F13); §5.3, §6.3 (Uvarov); §6.7 (Gladkov, Shepelev) |
| C10 (H-12) | §1.1, §1.2, §1.4 (the Zuran and the marshals); §5.4, §6.3 (§13 F3, F4); §1.6, §4.8 (the chapel battery's accounts); §5.6 and §13 F5 (Langeron, Kursk) |
| C11 (H-13, the ice) | §1.6, §4.8, §8.3, §9.1 |
| C12 (H-14) | §4.3 (Legrand's "40 ou 50,000"), §5.2 (no Allied estimate) |
| C13 (D-3, the Santon under Suchet) | §1.1, §1.3, §3.3, §7.3, §7.4; §2.5 (Stutterheim's 27th) |
| C22 (H-9, the sun) | §8.2, §4.4, §4.5, §1.4; §8.1 and §13 F7, F8 |
| question 153 (Ryazhsk) | §3.2, §3.4, §2.6, §5.5, §5.6, §6.2, §6.4, §6.5, §6.6, §6.7, §4.10, §4.11 (Thiébault pp. 474, 504); §6.8 (the second reading; C14a) |
| question 155 (division numbers, the grenadiers' artillery) | §7.2-§7.5; §7.6 (Caffarelli; C14a) |
| question 157 (I Corps: reserve or centre) | §1.3, §2.1, §5.4, §8.2; §4.7, §4.8, §4.10; §1.1, §1.2 (§13 F11) |
| question 158 (Blasowitz) | §2.5, §4.6, §5.6; §2.4 (Liechtenstein); §2.7, §5.7 (the Guard's defenders; Liechtenstein's arrival; C14a); §8.2, §8.4 (Marbot's Lannes to Blasiowitz; handed on to step 4 with the event's forms) |
| question 147 (H-4's roles; c_gd) | §4.7, §4.8 (Thiébault: the Guard had no shot to fire and took no part; §13 F14, handed on to step 4) |
| step 4 (125 (b), the disputed hours) | §2.2, §5.4, §5.5, §6.3, §6.4, §4.9, §4.10 |

## 13. Found in this reading: what bears on step 2's planned texts

Each is recorded for the commit named; none changes a text in this commit (records only).

- **F1 (C8).** Thiébault gives a clock hour, half past eight, for an aide-de-camp's report that the heights had been abandoned:
  "l'aide de camp qui, à huit heures et demie du matin, vint lui dire que les derniers corps de l'ennemi avaient quitté les hauteurs de
  Pratzen" (p. 504, §4.10), which this register identifies (inference, from the same words) with the report on which the signal was given
  (p. 458, "(un peu prématurément)", §4.2); Thiébault says Napoleon was misled by it ("il avait été trompé"). The exchange itself he sets
  "au jour naissant" (p. 456), with day at eight. The plan's C8 texts say "the hour is this map's" and "the hour this map gives it is its
  own" for the c. 08:30 line: Thiébault's half past eight should be weighed before those words are written. If C8 rests a visitor text on
  it, it attributes the hour to Thiébault's p. 504 and marks the link to the twenty-minutes exchange as an inference. Since the review of
  C19-C23 the sources sheet's light note (app.js `lightNotes`) gives Thiébault's two hours as his (day only at eight, p. 456; the aide's
  report at half past eight that the last enemy corps had left the Pratzen heights, which he says misled Napoleon, p. 504), without the
  identification, beside the drawn 08:45 sun; the drawn hours and the c. 08:30 line are weighed against them in step 4 (125 (b)).
- **F2 (C9, question 153).** Thiébault spells the regiment "Riajski" (pp. 474, 504), a witness to the name Ryazhsk (the reading of the
  spelling as Ряжскій is an inference), but has the Fanagoria and Ryazhsk regiments reinforce Kamensky's brigade (p. 474, §4.11), as
  Stutterheim does (p. 64, §2.6); Mikhailovsky-Danilevsky forms the brigade of them (1844 p. 187; 1846 p. 251). Keep this disagreement on
  the brigade's make-up in C9's kamensky texts and in question 153. The 1806 eyewitness, Stutterheim, spells it "Rhiasky" (German p. 64;
  the French original p. 90; §2.6), a spelling that settles neither name. The Materialien gives both spellings: "Rhiäsky" in its
  translation of Stutterheim (p. 58) and "Rjäsan" in its editor's list (p. 99, §3.2), and its translation of Kutuzov's official report has
  "das Fanagorskische und Rjäsansche Regiment" (p. 112, §3.4). The plan's kamensky strengthNote ("Ryazan in the Materialien of 1806")
  should name which of the Materialien's texts it means.
- **F3 (step 4; the dok@1 dispute).** The Russian original reads "въ 8-мъ часу утра" (p. 177, §6.3), the hour between seven and eight;
  the 1846 translation has "à huit heures du matin" (p. 238). The plan's §5 lead cites the translation ("at eight"); the original is the
  reading to weigh in step 4.
- **F4 (C10; step 4).** The Russian original has Napoleon "на курганѣ при Шлапаницѣ" (on the barrow by Schlapanitz) with the marshals
  "еще до зари къ нему созванными" (summoned even before dawn) (p. 177); the 1846 translation weakens both ("une hauteur", "dès l'aube du
  jour", p. 238). That the barrow is the Zuran is an inference; the hour he took post is still not given. It bears on PLANS.fr.author's
  "before dawn" (handed to step 4).
- **F5 (C10's Langeron role; the kursk event).** Mikhailovsky-Danilevsky 1846 names Langeron's reinforcement as the Kursk regiment, alone
  and destroyed, "Ce régiment perdit à cette seule bataille 1600 hommes" (pp. 253-254, §5.6). The data's "Which regiment, and what it lost,
  are not established" stands as a hedge across accounts (one account has two battalions arriving), but one history read here does name the
  regiment and a loss for the whole battle; a text saying "the accounts differ" would assert less than "not established".
- **F6 (question 158).** The Blasowitz pages are Mikhailovsky-Danilevsky 1846 p. 255 (Napoleon's order naming part of Rivaud's division
  and Lannes's Caffarelli and Kellermann) and p. 257 (the evacuation, "les Français" without a corps), not p. 256; Stutterheim's "angegriffen
  und genommen" by Bernadotte's corps is on p. 68.
- **F7 (C22's lightNotes).** The night sky is disputed: Marbot "Il n'y avait point de lune" (p. 258); Mikhailovsky-Danilevsky 1846 "la lune
  se montra à plusieurs reprises" (p. 235, OCR); Thiébault "par une nuit claire et extrêmement froide" (p. 456). C22's "nothing about the
  night's sky is claimed" is consistent with keeping the disagreement.
- **F8 (C22).** The 30th Bulletin, dated 3 December 1805, already has "Le soleil se leva radieux" (p. 450), without the phrase "soleil
  d'Austerlitz"; C22's "a phrase the memoirs use" stands.
- **F9 (H-11 class, step 4).** Kienmayer's Hungarian cavalry: "3 полка слабыхъ" in the original (p. 167) against "2 faibles régiments" in
  the 1846 translation (p. 224, OCR), which `appearance.js` COMPOSITION.kienmayer's note quotes.
- **F10 (step 4).** Mikhailovsky-Danilevsky 1844 p. 179's half past eight has no footnote of its own (the page's one note, Buxhowden's
  report, is anchored to the Telnitz sentence).
- **F11 (step 4: drouet@0; question 157).** I Corps' position before the attack has five readings, two orders and three accounts. The
  orders of 1 December send Bernadotte to "la position du bivouac du général Caffarelli" (no. 9534, p. 441, §1.1; no hour; the same
  orders move Caffarelli to the grenadiers' bivouac), and the dispositions order his two divisions for 07:00 on 2 December onto "la même
  position qu'occupe, aujourd'hui 10, la division du général Caffarelli", the left behind the Santon, in column by regiment (no. 9535,
  p. 442, §1.2): no. 9534 (1 December) and no. 9535 (for 07:00 on 2 December) both put I Corps on Caffarelli's ground (whether they mean
  the same ground the pages do not say). Stutterheim places it in the night behind Girschikowitz (p. 41); Mikhailovsky-Danilevsky across
  the brook at nightfall, in front of Girzikowitz (1846 p. 229); Thiébault, after the retreat of 29 November, one division at Girzikowitz
  and the other at Schlapanitz (p. 449).
- **F12 (C13).** The Materialien keeps Stutterheim's 27th at the Santon in its translation (p. 65, OCR) and gives the 17th in its editor's
  Zusatz 6 (pp. 100-101), anchored at Suchet's division (p. 35, OCR); the dated order of 1 December (no. 9534) and the Bulletin (p. 449)
  name the 17e légère.
- **F13 (C3 and C9: who turned Kamensky's brigade; found in the review of this register).** The accounts read here differ.
  Mikhailovsky-Danilevsky has Kamensky see the French climbing, warn Langeron, halt his brigade and attack (1844 pp. 186-187, citing
  Langeron's report no. 867; 1846 p. 251; §5.6, §6.5). Stutterheim has the Fanagoria and "Rhiasky" regiments sent "auf Befehl des General
  en Chef" to reinforce Kamensky's brigade (p. 64; the French p. 90; §2.6), and Thiébault has the brigade reinforced by them (p. 474,
  §4.11); neither says who turned the brigade. Kutuzov's official report, in the Materialien's translation, has Kutuzov find the two
  regiments cut off on the height, re-form them and order Kamensky to occupy the ridge with them (p. 112, §3.4). The critic's planned
  kamensky.why for C3 ("Allied initiative on the plateau, taken by a brigade commander on his own judgement") and kamensky.role (C9) rest
  on Mikhailovsky-Danilevsky's side; Kutuzov's report should be weighed before "on his own judgement" is written (for the lead or the
  owner).
- **F14 (C15's c_gd role, question 147; step 4; found in the review of C14a-C18).** c_gd's role ("then its cavalry charges the Russian
  Guard and its infantry is committed onto the plateau") restates guard_inf@6's act ("Committed onto the plateau as the Russian Guard
  attacks"), as question 147 decided (record-only). Thiébault has the Guard and the grenadier reserve go onto the Pratzen heights
  "qui n'eurent pas un coup de fusil à tirer" (p. 463, §4.7) and counts the Imperial Guard among those "qui ne prirent aucune part à la
  lutte" (p. 466, §4.8); "committed" can be read as "sent into action". The record is not changed here (it does not say the Guard's
  infantry fought); the disagreement is handed to step 4 with "whether Drouet's division fought" (the same pages), where "moved onto the
  plateau" may be weighed for both texts.
