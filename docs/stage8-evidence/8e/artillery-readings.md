# The artillery's readings, re-read for implementation PR 8E (27 October 2026)

**What this is.** Implementation PR 8E's evidence step (decision 243 (a): "Register and grade each historical claim before using it ... Do
not generalise IV Corps' October authorisation for driver numbers into a demonstrated rule for the Guard, Austrian or Russian artillery.
Specify where each source applies"). Stage 8 Part A's leads (`docs/stage8-evidence/leads.md`, topic 1, read by a machine reader on
23 October 2026) were read again here on the printed page images (archive.org's page images and the UIBK scan, each opened and read on
the image by this session; the leaf named is the image read). Each entry gives the passage as printed, its grade on the appearance
table's scale (`appearance.js`: A documented for 1805, a dated 1804-1805 document or a regulation in force; B documented for the period
and probable for 1805; C reconstructed or disputed), its **scope** (the troops and the time the source speaks for), and what the
drawing takes from it. What the drawing takes is registered in `appearance.js` (`ORDNANCE`, with its sources in `APPEARANCE_SOURCES`)
before anything is drawn from it; the drawn values are presentation (`KIT.art` in `app.js`).

**Which batteries are drawn.** Two, both French: the guns on the heights (`heightguns`, IV Corps; its figures drawn as their dominant
class, IV Corps' foot artillery, `COMPOSITION.heightguns`; the Guard's 24 pieces Thiébault places there are listed with it, not drawn as
its figures) and the Santon's battery (drawn in front of the 17e Légère, Suchet's division of V Corps; guns only, no crew, limbers or
teams, as the build draws it). No Austrian, Russian or Guard battery is drawn as figures (the Allied guns are listed with the formations
they served: decision 100). So the Allied and the Guard's readings below mark where the French readings stop; nothing is drawn from them.

Conversions are derived: 1 pied du roi = 0.3248 m, 1 pouce = 1/12 pied, 1 toise = 6 pieds; a pas taken at about 0.65 m.

## France: the Gribeauval field matériel (drawn)

1. **The matériel.** Alombert and Colin, *La campagne de 1805 en Allemagne*, t. I (1902), Introduction, p. 228 (leaf n239; image read):
   « L'artillerie de la Grande Armée comprend des canons de 12, de 8 et de 4, et des obusiers de 6 pouces, du modèle de Gribeauval.
   D'après le système de l'an XI, les pièces de 8 et de 4 auraient dû être remplacées par des pièces de 6 [...] la fabrication était peu
   avancée ». Grade **B** (the Section historique, from the archives). Scope: the Grande Armée's field artillery at the campaign's opening;
   which calibres stood on the heights or at the Santon on 2 December is **not read** (the data's `strengthNote` says so). Drawn: a
   generic Gribeauval field piece, no calibre or model claimed.
2. **A division's pieces.** The same, p. 230 (leaf n241; image): « Dans chaque division d'infanterie, l'artillerie comprenait 12 bouches à
   feu : 2 de 12, 6 de 8, 2 de 4, et 2 obusiers ». Grade **B**. Scope: an infantry division's artillery at the opening of the campaign.
   Drawn: nothing directly; it shows that ten of a division's twelve pieces took the wheels of item 4 (the 12, the 8 and the howitzer).
3. **Each piece's chest.** The same, p. 229, note (leaf n240; image): « L'approvisionnement simple était porté par les coffrets de pièce
   et par 1 caisson pour le 4, 2 caissons pour le 8, 3 caissons pour le 12 et l'obusier », with the rounds « dans le coffret de pièce »:
   18 (the 4), 15 (the 8), 9 (the 12), 4 (the howitzer). Grade **B**. Drawn: every drawn gun has its coffret (item 5). The caissons are not
   drawn (they stood 16 to 20 toises behind, item 8, outside the battery's drawn frame).
4. **The wheels.** Gassendi, *Aide-mémoire*, 4e éd. (1809), t. I, p. 110, the table « Hauteur des Roues » (leaf n191; image): no. 3 « —
   de campagne de 12 » 4 pi. 6 po.; no. 4 « — de 8 » *Idem*; no. 5 « — de 4 » 4 pi. 2 po.; no. 10 « — d'obusiers de 8 pouces et de 6
   pouces » 4 pi. 6 po.; no. 19 « — d'affût de campagne de 12 et de 8, de caisson et de chariot à munitions » [avant-train] 3 pi. 6 po.;
   no. 20 « — d'affût de 4 » 3 pi. 2 po.; « Il y a 6 Jantes aux 15 premiers numéros [...] et 5 aux num. 17, 18, 19 et 20 ». Grade **B**.
   Scope: the Gribeauval field carriages and their limbers in Gassendi's tables (the field carriage of 1805 was kept: t. I, p. 11, note,
   the an XI carriage « Sa Majesté a fait conserver provisoirement les affûts existans », leaf n92, read in Part A, not re-read here).
   Derived: 1.462 m and 1.137 m (ratio 0.778). Drawn: the gun's wheel and the limber's in that ratio, at the figures' scale. **Not read**:
   the number of spokes (6 felloes and 5 are read; 12 and 10 spokes, two to a felloe, are an inference), nor the 4-pounder's drawn (its
   smaller wheels are within 7% of the others').
5. **The coffret's two places.** Gassendi, t. II, p. 869 (leaf n336; image), « Otez l'Avant-train »: « 3e. Servant de droite retire
   l'avant-train à 3 pas [...] Canonnier de droite, Canonnier de gauche, placent le coffret sur l'avant-train »; p. 870 (leaf n337; image),
   « Amenez l'Avant-train »: « Canonnier de droite, Canonnier de gauche placent le coffret entre les flasques ». And t. I, p. 174 (leaf
   n255; image): the « COFFRET D'AFFUT DE CAMPAGNE, pour les Bouches à feu de 12... 8... 4... obusiers de 6 pouces » lodged between the
   limber's armons, the 8's (« plus long ») on them. Grade **B**. Scope: the Gribeauval field piece in Gassendi's drill (1809). Drawn: the
   coffret between the trail's cheeks on the limbered gun, on the limber of the deployed one.
6. **The limber behind the piece.** Gassendi, t. II, p. 870 (leaf n337; image): « 3e. Servant de droite mène l'Avant-train à 20 pas en
   arrière, en obliquant un peu à droite, et tourne à gauche ». And p. 873 (leaf n340; image): « La position de l'Avant-train est prescrite
   par le réglement » (the regulation itself not read). Grade **B**. Derived: about 13 m. Drawn: each deployed gun's limber, its team and its
   driver behind it, the team facing the rear: « tourne à gauche » does not say by how much (a quarter or a half turn), so that facing is a
   design value, as is the distance at the figures' scale.
7. **Foot artillery on the move.** Gassendi, t. II, p. 872 (leaf n339; image): « L'Artillerie à pied conserve ses Pièces sur
   l'Avant-train dans tous ses mouvemens », under the section's own caveat on the same page: « Elles ne sont point déterminées par un
   réglement ; ce qu'on va en dire n'est donc que ce que pratiquent quelques Régimens, ou ce qu'on leur propose de faire ». Grade **B**.
   (Part A's leads put this caveat on p. 871 and read it as the limbering drill's; on the image it opens the « Manœuvres des bouches à feu
   de bataille » of p. 872.) Drawn: the battery on the move limbered, as the build has always drawn it.
8. **The caissons and the gunners in movement.** Gassendi, t. II, p. 873 (leaf n340; image): the caissons « en arrière de leur pièce, à
   16 ou 20 toises » (31-39 m), and « Dans l'Artillerie à pied, soit en colonne, soit en ligne ou en bataille, les Canonniers et Servans
   marchent constamment à droite et à gauche de leur Bouche-à-feu ». Grade **B**. **Not drawn**: the caissons; and the build parents the
   crew to the deployed group, so a limbered battery shows no gunners. Showing them beside the moving pieces would change the crew's
   representation, which the brief keeps: recorded for the owner (`docs/STAGE8_SPEC.md` section 17).
9. **The team.** Gassendi, t. I, p. 440 (leaf n523; image), the « Table servant à estimer la longueur des Colonnes d'Artillerie »,
   column B (chevaux): « de Campagne de 12, chargé de sa Pièce » 6; « de 8, *idem* » 4; « de 4, *idem* » 4; « d'Obusier de 6 pouces, *idem* »
   4. In the copy read a reader's pen strokes cross the 12's, the 8's and the 4's rows (the 4's struck through); the howitzer's 4 is clear.
   Grade **B**. Scope: French ordinary practice (1809). Drawn: the build's four horses a drawn gun, kept; a drawn gun stands for two pieces,
   so the count is a symbol, consistent with the ordinary team of the 8, the 4 and the howitzer.
10. **The harness and its saddles.** Gassendi, t. II, p. 829 (leaf n296; image), « Harnais pour attelage à l'Allemande »: « Premier Harnais
    de derrière ou de Porteur [...] 1 Selle à la dragonne avec ses étriers »; « Second Harnais de derrière ou de Sous-verge [...] 1
    Couverture en forte toile grise »; the front pair likewise; « L'Atelage complet pour 4 Chevaux est donc composé de [...] 2 Selles à la
    dragonne ». Grade **B**. Scope: the French artillery harness. That the porteur is the near (left) horse is usual French usage, **not
    said** here: an inference. Drawn: the driver on a porteur.
11. **The drivers: IV Corps' letter.** Alombert and Colin, t. IV (1908), pp. 183-184 (leaves n192-n193; images): « Le général Salligny, chef
    d'état-major du 4e corps, aux Généraux commandant les trois divisions d'infanterie et la division de cavalerie. Inning, le 3 brumaire an
    XIV. Je vous préviens, Général, que M. le Maréchal a autorisé le général Lariboisière à réduire vos attelages d'artillerie à un soldat
    du train par voiture ou au plus à deux pour les voitures à 6 chevaux, tous les officiers disponibles du train devant conduire des
    chevaux. Les canonniers d'artillerie légère non montés conduiront les chevaux de devant. [...] Dans votre division, vous pourvoirez au
    remplacement des soldats du train qui vous auront été retirés, par des hommes du 3e d'infanterie. De cette manière, les soldats que vous
    avez envoyés au grand parc seront renvoyés à leur corps en proportion du nombre d'hommes du train que la réduction ordonnée aura
    produite. » Grade **A** as a document (dated 25 October 1805). **Scope: IV Corps' divisions' artillery teams, from 25 October 1805.** It
    authorises (and p. 184 calls « la réduction ordonnée ») one train soldier a vehicle, two at most for a six-horse vehicle; whether it
    still held on 2 December, five weeks later, is **not shown**, hence an inference when drawn; which horse he rode is **not said**. It
    reaches neither the Guard nor the other corps, nor the Austrian or Russian artillery. Drawn: one driver to each drawn team of
    `heightguns`, IV Corps' artillery on the heights (the data's "Corps and Guard artillery"), whose figures are drawn as IV Corps' foot
    artillery (`COMPOSITION.heightguns`, its dominant class): the letter addresses the divisions' teams, and that the battery's teams were
    among them is not read, a second inference beside the date's (label: inference); the Guard's 24 pieces listed with it are outside the
    letter and are not drawn as figures. On the near wheel horse (which horse: a design value, the harness's saddle, item 10, an inference).
    (The independent review of 8E's code asked for this boundary to be stated: it is stated here, in `ORDNANCE`'s note and in the sources
    sheet, and put to the owner in `docs/STAGE8_SPEC.md` section 17.)
12. **What is not found.** No source read gives the time limbering or unlimbering took (Gassendi's drill lists the movements, items 5 and 6,
    not their duration; Part A's search, leads item 30). Drawn: the switch between the deployed and the limbered battery at once, as built
    (a drawn transition would show a design value as if it were a measured one).

## The Guard (not drawn as figures: a boundary)

13. **The Guard's teams.** Napoleon to Mortier, Boulogne, 11 fructidor an XIII (29 August 1805), printed in Alombert and Colin, t. I, p. 399
    (leaf n410; image): « l'artillerie de ma Garde sera organisée et attelée de la manière suivante : elle sera divisée en trois divisions;
    chaque division sera composée de 4 pièces de 8, 2 pièces de 4 et 2 obusiers, attelés par 44 chevaux ». Grade **A** (a dated order of
    1805). Scope: the Guard's artillery as ordered in August; what it brought to the field is not read. The split by piece (6, 6 and 4, or
    another) is an inference; **its drivers are not read**. Nothing is drawn from it.

## Austria and Russia (not drawn: boundaries)

14. **Austria.** Teuber and Ottenfeld, *Die österreichische Armee von 1700 bis 1867* (1895), p. 185 (UIBK scan, image read): « Das Geschütz
    Liechtenstein'scher Aera aber [...] war in seiner Construction so ausgezeichnet, dass es mit geringer Aenderung bis zum Jahre 1809 in
    Gebrauch stand. Auch bei diesem neuen Material waren alle Holzbestandtheile gelb, alle Eisentheile schwarz gestrichen. Bis 1774 war das
    sogenannte »Munitionstrüherl« zwischen den Lafettenwänden eingelassen; von da ab wurde ein grösserer Kasten auf der Protze angebracht,
    der zugleich als Sitz für 3 Mann ausreichte. » Grade **B**. Scope: the Austrian Liechtenstein matériel, to 1809. Its drivers (the
    Fuhrwesen's, from the saddle: Teuber pp. 320, 444, read in Part A) were not re-read. Nothing is drawn from it.
15. **Russia.** Nilus, *История материальной части артиллерии*, т. 2 (1904), p. 21 (leaf n24; image): « Передковыя колеса—меньшаго
    діаметра, чѣмъ лафетныя [...] Передки съ коробомъ и дышломъ имѣлись двухъ образцовъ, батарейный и легкій—съ коробами на оси [...]
    Лафеты 12 фн. пушекъ малой пропорціи, 6 фн. пушекъ и 1/4 пд. конныхъ единороговъ имѣли лафетные ящики между станинами ». Grade **B**
    (a specialist history of 1904). Scope: the Russian matériel of the Arakcheev period. Its drivers (the company's own men, Viskovatov,
    rules of 1806 and 1809, read in Part A) were not re-read. Nothing is drawn from it.

## Not re-read here (and not drawn from)

Gassendi t. I, p. 247 (the French carriage's olive, already a note of `DRESS.fr_foot_art`; the leaf the page list names, n328, is p. 245):
decision 243 (a) keeps one carriage colour, so nothing is drawn from it. Teuber pp. 320, 444, 858; Viskovatov ч. 12, pp. 28-29; Igoshin 2013;
Shirokorad (C); the an XI coffret (Gassendi t. I, p. 19): leads of Part A, not used.
