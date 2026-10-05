> **Stage 6B, reading register (`docs/STAGE6_SPEC.md` §6.1).** The working notes of the 6B reading pass (5 October 2026): every work read, with
> the passages quoted verbatim, their locators (page, plate, view), the grade and label each was given, the disagreements kept, and what
> was looked for and not found. The claims of `appearance.js` cite the works themselves (`APPEARANCE_SOURCES`); this file records how they
> were read. The quotes were checked against the sources' text by `tools/stage6/verify-quotes.js` (`quote-check.md`); a quote marked
> "image checked" was read on the page image. Source keys here may differ from `appearance.js`'s (`corr11_1858` and `napcorr11` are
> `corr11_1863`; `stutterheim1806` is `stutterheim1806fr`, `stutterheim1806de` or the Paris edition as the file's own table says;
> `alombertcolin4_1908` and `alombert1902` are `alombert4_1908`). Nothing was taken from an encyclopedia, a search summary, or a
> GitHub-held copy.

# Stage 6B research: COMPOSITION of the drawn formations at Austerlitz, 2 December 1805

- Topic: which regiments (and how many battalions / squadrons of each) were in each formation the project draws, so each
  formation's figures can be dressed by class (line, light, grenadiers, jägers, cuirassiers, dragoons, hussars, chasseurs,
  Cossacks, Grenz, artillery...).
- Date of this file: 2026-10-05 (research session for Stage 6B).
- Scope: the formations in /home/user/Austerlitz/data.js `FORMATIONS` (French and Allied). Primary first (Weyrother's
  disposition, French situations, official accounts, memoirs), then specialist (Nafziger OOB files, CARL; others).
- Status: session complete. 60 claims: 15 graded A, 44 B, 1 C. Sections: Sources read, Claims (by source), Summary by formation (pointers only), Disagreements, Not found / not readable.

## Sources read

| key | author | title | place, publisher, year | kind | URL(s) of the scan or page |
|---|---|---|---|---|---|
| stutterheim1806 | [Karl von Stutterheim, Austrian GM, present] | La bataille d'Austerlitz, par un militaire témoin de la journée du 2 décembre 1805 | Hambourg, 1806 | primary-text (eyewitness, Allied staff) | https://gallica.bnf.fr/ark:/12148/bpt6k6497274t (page images read through IIIF: https://gallica.bnf.fr/iiif/ark:/12148/bpt6k6497274t/f<n>/full/1000,/0/native.jpg; view n = printed page + 4 in this part) |
| alombertcolin4_1908 | P.-C. Alombert & J. Colin (Section historique de l'état-major de l'armée) | La campagne de 1805 en Allemagne, tome IV, annex "Situations: Grande Armée à l'époque du 6 brumaire an XIV" (28 October 1805), pp. 711-745 | Paris, Chapelot, 1902-1908 (vol. IV 1908) | primary-text (an official return of 28 Oct 1805 printed verbatim by the French General Staff historians) | https://archive.org/details/la-campagne-de-1805-en-allemagne-vol.-4 (page images: https://archive.org/download/la-campagne-de-1805-en-allemagne-vol.-4/page/n<leaf>.jpg, leaf = printed page + 8) |
| mikhailovsky1846 | A. I. Mikhailovsky-Danilevsky, tr. L. Narischkine | Relation de la campagne de 1805 (Austerlitz) [French translation of Описание первой войны императора Александра с Наполеоном в 1805 году, St Petersburg 1844] | Paris, Dumaine, 1846 | specialist (official Russian history written from the archives by the Tsar's commission; translation) | https://archive.org/details/relationdelacam00dangoog (PDF read at https://ia801602.us.archive.org/23/items/relationdelacam00dangoog/relationdelacam00dangoog.pdf; printed p. n = PDF page n + 23 in this part) |
| materialien1806 | [anon., "gesammelt von einem Militär"; the BSB catalogue attributes it to Karl August of Saxe-Weimar] | Materialien zu der Geschichte der Schlacht bei Austerlitz (German translation of Stutterheim's account with the editor's "Zusätze", including a list of the Russian regiments by column and Weyrother's disposition in full) | [Weimar], Landes-Industrie-Comptoir, 1806 (BSB Hbks/X 8 p) | primary-text (1806 compilation from eyewitnesses; the editor's lists are of unstated origin) | https://archive.org/details/10807964bsb (page images: https://archive.org/download/10807964bsb/page/n<leaf>.jpg, leaf = printed page + 9) |
| schoenhals1873 | Karl Freiherr von Schönhals (Austrian FZM) | Der Krieg 1805 in Deutschland, with "Beilage: Ordre de Bataille des verbündeten Heeres in der Schlacht von Austerlitz und Stärke der Colonnen", pp. 177-178 | Wien, 1873 (pages printed as Österreichische militärische Zeitschrift 1874, "Feldzug 1805", per the page footer) | specialist (Austrian staff history; source of the order of battle not stated on the page) | https://archive.org/details/derkriegindeuts00schgoog (PDF https://ia801408.us.archive.org/20/items/derkriegindeuts00schgoog/derkriegindeuts00schgoog.pdf, PDF pp. 182-183) |
| thiebault3_1894 | Paul Thiébault (brigadier in Saint-Hilaire's division at Austerlitz), ed. F. Calmettes | Mémoires du général baron Thiébault, tome III (1799-1806) | Paris, Plon, 1894 | primary-text (memoir of a participant, written later; he says it reproduces and completes his printed "observations" of 1806) | https://archive.org/details/mmoires03thieuoft (page images https://archive.org/download/mmoires03thieuoft/page/n<leaf>.jpg; printed p. 466-470 = leaves 477-481) |
| martinien1899 | A. Martinien (archivist, Archives administratives de la Guerre) | Tableaux, par corps et par batailles, des officiers tués et blessés pendant les guerres de l'Empire (1805-1815) | Paris, Charles-Lavauzelle, 1899 | specialist (compiled from the officers' service records; an officer killed or wounded "2 déc. 1805, bataille d'Austerlitz" shows the unit engaged) | https://gallica.bnf.fr/ark:/12148/bpt6k503971d (page images read through IIIF, views f93-f111 and f517-f640; Gallica's own OCR, ALTO, used to locate entries) |

(all works read are in the table above; finding aids used but not cited: one web search, archive.org and Gallica catalogue searches)

## Claims

### Allied: the columns' size (Stutterheim 1806, battalions and squadrons only, no regiment names)

- **id**: al.cols.1dec.stutterheim
- **claim**: Stutterheim gives the columns' strength in battalions and squadrons for the evening of 1 December (the positions from which they attacked on 2 December): I Column (Dokhturov) 24 Russian battalions; II (Langeron) 18 Russian; III (Przybyszewski) 18 Russian; IV (Kollowrat) 12 Russian battalions under Miloradovich and 15 Austrian; V (Liechtenstein) 82 squadrons, all cavalry; the Grand Duke Constantine's reserve 10 battalions and 18 squadrons of guards; Kienmayer 22 Austrian squadrons, 10 of Cossacks and 5 "Croat" battalions.
- **value (source's words)**: "composée de 24 Bat. russes"; "18 Bat. russes"; "18 Bat. russes"; "douze bataillons russes ... et de quinze autrichiens"; "quatre-vingt-deux escadrons"; "dix bataillons et de dix-huit escadrons de gardes"; "vingt-deux escadrons Autrichiens, dix de Cosaques et de cinq bataillons Croates"
- **source**: stutterheim1806, pp. 50-53 (Gallica views f54-f57), https://gallica.bnf.fr/ark:/12148/bpt6k6497274t/f54.item
- **quote**: p. 50-51: "1.re Colonne, sous le Lieut. Général Dochtorow, composée de 24 Bat. russes, marcha par sa gauche sur Herspitz, Wachan, Klein-Hostieradeck, et prit position en deux lignes, sur les hauteurs de ce village ; un régiment de chasseurs fut posté à Aujest" / p. 51: "2.me Col., commandée par le Lieut. Général Langeron, composée de 18 Bat. russes" / "3.me Col., commandée par le Lieut. Général Przybyszewsky, composée de 18 Bat. russes" / "4.me Colonne, commandée par le Lieutenant-Général autrichien Kollowrath, étoit composée de douze bataillons russes, sous le Lieutenant-Général Miloradowitsch et de quinze autrichiens, [p. 52] qui se trouvèrent à la queue de cette Colonne" / p. 52: "5.me Colonne de cavalerie, sous les ordres du Lieutenant-Général Prince Jean de Liechtenstein, étoit composée de quatre-vingt-deux escadrons" / "Le Corps de réserve du Grand-Duc Constantin, composé de dix bataillons et de dix-huit escadrons de gardes" / p. 53: "son corps alors étoit composé de vingt-deux escadrons Autrichiens, dix de Cosaques et de cinq bataillons Croates." Translation: I Column under Lt-Gen Dokhturov, of 24 Russian battalions ... a regiment of jägers was posted at Augezd; II Column, Langeron, 18 Russian battalions; III Column, Przybyszewski, 18 Russian battalions; IV Column, the Austrian Lt-Gen Kollowrat, twelve Russian battalions under Miloradovich and fifteen Austrian, which were at the tail of this column; V Column of cavalry, Prince Johann Liechtenstein, eighty-two squadrons; the Grand Duke Constantine's reserve, ten battalions and eighteen squadrons of guards; [Kienmayer's] corps then consisted of twenty-two Austrian squadrons, ten of Cossacks and five Croat battalions.
- **grade**: A (an eyewitness account by an officer of the Allied army, printed 1806; it reports the positions of the night of 1-2 December)
- **label**: fact (for the counts as Stutterheim gives them); see Disagreements for other counts
- **notes**: Stutterheim names no regiments here. "Croates" = the Grenz (border) infantry; p. 50 (same view f54) calls them "Cinq bataillons de troupes frontières, sous le général-major Carneville". The II Column's 18 battalions here include Kamensky's brigade (Stutterheim p. 101, view f105, counts the three columns as 55 battalions "en décomptant la brigade du général Kamensky"; OCR snippet only, not yet read as image). On 27 November (pp. 31-34, f35-f38) Stutterheim gives a different, earlier grouping (I Column Wimpfen 18 bn; II Langeron 18 bn; III Przybyszewski 24 bn; IV Kollowrat 32 bn of which 20 Austrian, 30 Russian squadrons of which 8 Cossack; V Hohenlohe/Uvarov 70 squadrons of which 40 Austrian "qui étoient très-foibles", 4,600 horses): that is the march order of 27 Nov, not the battle's.

- **id**: al.kienmayer.grenz.count
- **claim**: Kienmayer's infantry on the night of 1-2 December was five battalions of Grenz troops under GM Carneville, which joined him on the evening of 1 December.
- **value (source's words)**: "Cinq bataillons de troupes frontières, sous le général-major Carneville"
- **source**: stutterheim1806, p. 50 (view f54)
- **quote**: "Cinq bataillons de troupes frontières, sous le général-major Carneville, qui faisoient partie de l'infanterie autrichienne, vinrent le soir renforcer M. de Kienmayer." Translation: Five battalions of frontier troops under GM Carneville, which were part of the Austrian infantry, came in the evening to reinforce Kienmayer.
- **grade**: A (eyewitness, 1806)
- **label**: fact
- **notes**: which Grenz regiments (Broder, Szekler) is given by Stutterheim only partly (see al.kienmayer.units).

- **id**: al.disposition.counts.stutterheim
- **claim**: Stutterheim's summary of the disposition for 2 December states the five columns were "composed as the day before" and gives: I Column 24 Russian bn; II 18 Russian bn; III 18 Russian bn; IV 27 bn of which 15 Austrian; V 82 squadrons; Bagration's advance guard 12 bn and 40 squadrons; the Grand Duke Constantine's reserve 10 bn and 18 squadrons; Kienmayer's infantry (5 Austrian bn) to reinforce the I Column, making it 29 bn.
- **value (source's words)**: "les cinq colonnes, composées comme la veille"; "4.me Col. Lieut. Général Kollowrath 27 Bat. dont 15 Autrichiens"; "Avant-Garde du Lieut. Général Prince Bagration 12 Bat. 40 Esc."; "Corps de réserve du Grand-Duc Constantin, 10 Bat. 18 Esc."; "renforcée de 5 Bat. Autrichiens, et forte de 29 Bataillons"
- **source**: stutterheim1806, pp. 61-64 (views f65-f68)
- **quote**: p. 61: "A cette fin, les cinq colonnes, composées comme la veille, reçurent ordre de marcher en avant de la manière suivante : 1.re Col. Lieut. Général Dochtorow 24 Bat. Russes" ; p. 62: "4.me Col. Lieut. Général Kollowrath 27 Bat. dont 15 Autrichiens" ; p. 63: "L'Avant-Garde de M. Kienmayer devoit avec son infanterie protéger les mouvemens de la première colonne, de façon que celle-ci fût ainsi renforcée de 5 Bat. Autrichiens, et forte de 29 Bataillons." ; p. 64: "5.me Col. Lieut. Général Prince Jean Liechtenstein 82 Esc." / "Avant-Garde du Lieut. Général Prince Bagration 12 Bat. 40 Esc." / "Corps de réserve du Grand-Duc Constantin, 10 Bat. 18 Esc." Translation: To this end the five columns, composed as on the day before, received the order to advance as follows: I Column, Lt-Gen Dokhturov, 24 Russian battalions ... IV Column, Lt-Gen Kollowrat, 27 battalions of which 15 Austrian ... Kienmayer's advance guard was with its infantry to protect the I Column's movements, so that the latter was thus reinforced by 5 Austrian battalions and 29 battalions strong ... V Column, Prince Johann Liechtenstein, 82 squadrons; Bagration's advance guard, 12 battalions, 40 squadrons; the Grand Duke Constantine's reserve, 10 battalions, 18 squadrons.
- **grade**: A (eyewitness 1806; Stutterheim's paraphrase of the disposition, not the disposition's own text)
- **label**: fact (as Stutterheim's counts)
- **notes**: Bagration's 12 battalions conflicts with the project's "about 13,000 to 14,000"? Not necessarily (battalion strength). The disposition's own text (Weyrother) was not read in this session: see Not found.

### Allied: regiments named by Stutterheim (1806)

- **id**: al.kienmayer.units.stutterheim
- **claim**: Kienmayer's corps at Telnitz included the 1st Szekler Grenz infantry regiment (two battalions engaged first, then GM Carneville with the remaining three battalions), the Hesse-Homburg hussars (GM Nostitz), the Szekler hussars (GM Prince Moritz Liechtenstein), the O'Reilly chevau-légers and two Cossack regiments (under GM Stutterheim).
- **value (source's words)**: "un bataillon du premier régiment de Szeckler infanterie"; "Le second bataillon du régiment de Szeckler"; "le reste de son infanterie, qui consistoit encore en trois bataillons"; "Les hussards de Hesse-Hombourg ... et ceux de Szeckler"; "les chevau-légers d'Oreilly, avec deux régimens de cosaques"
- **source**: stutterheim1806, pp. 69-71 and 101 (views f73-f75, f108)
- **quote**: p. 69: "M. de Kienmayer fit avancer un détachement de cavalerie contre cette droite, et un bataillon du premier régiment de Szeckler infanterie sur la hauteur où se tenoit l'infanterie française. [...] Les hussards de Hesse-Hombourg sur la droite, sous le général-major Nostitz, et ceux de Szeckler à gauche, sous le général-major Prince Maurice Liechtenstein, se placèrent sur les flancs de cette infanterie" ; p. 70: "Le second bataillon du régiment de Szeckler étoit venu renforcer le premier" ; p. 71: "M. de Kienmayer fit avancer le général Carneville avec le reste de son infanterie, qui consistoit encore en trois bataillons" ; p. 101: "Les hussards de Szeckler, sous le Prince Maurice Liechtenstein, et les chevau-légers d'Oreilly, avec deux régimens de cosaques, sous le général Stutterheim, s'avancèrent dans la plaine". Translation: Kienmayer sent forward a cavalry detachment and one battalion of the 1st Szekler infantry regiment onto the height held by the French infantry ... the Hesse-Homburg hussars on the right under GM Nostitz and the Szekler hussars on the left under GM Prince Moritz Liechtenstein covered the flanks of this infantry; the second battalion of the Szekler regiment reinforced the first; Kienmayer sent GM Carneville forward with the rest of his infantry, still three battalions; the Szekler hussars under Prince Moritz Liechtenstein and the O'Reilly chevau-légers with two Cossack regiments under GM Stutterheim advanced into the plain.
- **grade**: A (eyewitness, 1806; Stutterheim commanded one of these brigades)
- **label**: fact
- **notes**: Stutterheim names only the 1st Szekler infantry; he does not name the other three Grenz battalions (the project's "Broder Nr. 7" and "2nd Szekler Nr. 15" are not confirmed by this source). Classes: Grenz infantry (5 bn), hussars (2 regiments: Hesse-Homburg, Szekler), chevau-légers (O'Reilly), Cossacks (2 regiments; 10 squadrons per p. 53).

- **id**: al.dok.units.stutterheim
- **claim**: The I Column included the Russian 7th Jäger regiment (a battalion sent to Telnitz) and the New Ingermanland regiment.
- **value (source's words)**: "un bataillon du septième régiment de chasseurs"; "le régiment russe de New-Ingermannland"
- **source**: stutterheim1806, pp. 72-73 (views f76-f77)
- **quote**: p. 72: "Enfin, M. de Buxhoevden déboucha d'Aujest avec la première colonne, et envoya un bataillon du septième régiment de chasseurs au soutien des Autrichiens ; une brigade russe vint former la réserve." p. 73: "Les chasseurs russes et un bataillon autrichien qui avoit été dans Tellnitz, s'étoient retirés en désordre ; le régiment russe de New-Ingermannland devoit les soutenir". Translation: Buxhowden came out of Augezd with the I Column and sent a battalion of the 7th Jäger regiment to support the Austrians; a Russian brigade formed the reserve ... the Russian jägers and an Austrian battalion that had been in Telnitz fell back in disorder; the Russian New Ingermanland regiment was to support them.
- **grade**: A (eyewitness, 1806)
- **label**: fact
- **notes**: Stutterheim does not give the whole I Column's regiment list.

- **id**: al.milo.units.stutterheim
- **claim**: Miloradovich's Russian infantry led the IV Column, with two battalions of the Novgorod and Apsheron regiments and some Austrian dragoons of the Archduke John regiment as its advance guard.
- **value (source's words)**: "Deux de ses bataillons des régimens de Novogrod et Apscheronsky"; "quelques dragons autrichiens du régiment de l'Archiduc Jean"
- **source**: stutterheim1806, p. 84 (view f88)
- **quote**: "L'infanterie russe, commandée par le lieutenant-général Miloradowich, avoit la tête de la colonne. Deux de ses bataillons des régimens de Novogrod et Apscheronsky, commandés par le lieutenant-colonel Monachtin et quelques dragons autrichiens du régiment de l'Archiduc Jean, formèrent l'avant-garde de la colonne". Translation: The Russian infantry under Lt-Gen Miloradovich headed the column. Two of its battalions, of the Novgorod and Apsheron regiments, under Lt-Col Monakhtin, and some Austrian dragoons of the Archduke John regiment formed the column's advance guard.
- **grade**: A (eyewitness, 1806)
- **label**: fact
- **notes**: "Novogrod" [sic, OCR-free reading of the print] = Novgorod. Austrian dragoons (Erzherzog Johann) with the IV Column: a class to dress (Austrian dragoons) not in the project's kollo/milo notes.

- **id**: al.kollo.units.stutterheim
- **claim**: Among the IV Column's Austrians were the Salzburg regiment, a battalion of Auersperg, and the sixth battalions of the Württemberg and Reuss-Greiz regiments (newly raised).
- **value (source's words)**: "Le régiment de Salzbourg et le bataillon d'Auersperg"; "les sixièmes bataillons des régimens de Würtemberg et de Reuss-Graitz"
- **source**: stutterheim1806, pp. 92, 116 (views f96, f120); p. 37 (view f41, OCR snippet only) on Mack's new battalions
- **quote**: p. 92: "Le régiment de Salzbourg et le bataillon d'Auersperg se battirent avec beaucoup de courage ; la brigade Kamensky toujours se distinguoit ; le général autrichien Jurczech fut grièvement blessé" ; p. 116: "il n'y eut que les sixièmes bataillons des régimens de Würtemberg et de Reuss-Graitz, qui, lorsque la quatrième colonne fut battue, étoient en déroute." Translation: The Salzburg regiment and the Auersperg battalion fought with great courage; Kamensky's brigade distinguished itself throughout; the Austrian general Jurczek was badly wounded ... only the sixth battalions of the Württemberg and Reuss-Greiz regiments were in rout when the IV Column was beaten.
- **grade**: A (eyewitness, 1806)
- **label**: fact
- **notes**: Stutterheim does not give the whole Austrian list of the IV Column (15 bn). Class: Austrian (German) line infantry. Brigade allocation (Jurczek / Rottermund) not given here.

- **id**: al.kamensky.units.stutterheim
- **claim**: Stutterheim says two regiments of the II Column, the Fanagoria grenadiers and the "Rhiasky" musketeers, held in reserve on the height, were sent by the commander-in-chief to reinforce Kamensky's brigade.
- **value (source's words)**: "celui de Fanagorisky grenadiers et Rhiasky mousquetaires"
- **source**: stutterheim1806, p. 90 (view f94)
- **quote**: "Deux régimens russes de la seconde colonne, celui de Fanagorisky grenadiers et Rhiasky mousquetaires, qui étoient en réserve sur la hauteur que cette colonne avoit occupée pendant la nuit, vinrent, par ordre du général en chef, renforcer la brigade du général Kamensky." Translation: Two Russian regiments of the second column, the Fanagoria grenadiers and the Rhiasky musketeers, which were in reserve on the height the column had held overnight, came by order of the commander-in-chief to reinforce General Kamensky's brigade.
- **grade**: A (eyewitness, 1806)
- **label**: fact (the regiments' names and classes); disputed (whether they WERE Kamensky's brigade or reinforced it: see Disagreements)
- **notes**: "Rhiasky" is the print's spelling. It may render Ryazhsky (Ряжский, Ryazhsk) rather than Ryazansky (Ryazan); the project's "Ryazan?" is therefore open; see the Russian sources below. Classes: one grenadier regiment, one musketeer (line) regiment.

- **id**: al.lich.units.stutterheim
- **claim**: Stutterheim names, in the V Column's fight, the Grand Duke Constantine's uhlan regiment (led by Lt-Gen Essen), the Elisabethgrad hussars (with Uvarov), and the Austrian Lorraine and Nassau cuirassier regiments (GM Caramelli's horse killed; Lorraine's commander Major Count Auersperg killed); ten squadrons under Uvarov were placed on Bagration's left.
- **value (source's words)**: "hussards d'Élisabethgrod"; "le régiment de uhlans du Grand-Duc Constantin"; "le régiment de Lorraine cuirassiers"; "le régiment de Nassau"; "dix escadrons sous le lieutenant-général Uwarow"
- **source**: stutterheim1806, pp. 79-80, 94 (views f83, f84, f98)
- **quote**: p. 79: "Pendant sa marche, le Prince Liechtenstein avoit fait placer en hâte dix escadrons sous le lieutenant-général Uwarow, sur la gauche du Prince Bagration" ; p. 80: "[Après que le régiment de] hussards d'Élisabethgrod, avec le général Uwarow, se fût formé en bataille, le régiment de uhlans du Grand-Duc Constantin fut à la tête de la colonne de cavalerie." ; p. 94: "avec le régiment de Lorraine cuirassiers sur l'infanterie ennemie [...] Le commandant de ce régiment, un major Comte d'Auersperg, fut tué. Le Prince Jean Liechtenstein fit également attaquer par le régiment de Nassau, l'infanterie française." Translation: During his march Prince Liechtenstein had hastily placed ten squadrons under Lt-Gen Uvarov on Bagration's left ... after the Elisabethgrad hussar regiment, with General Uvarov, had formed line, the Grand Duke Constantine's uhlan regiment was at the head of the cavalry column ... [charged] with the Lorraine cuirassier regiment on the enemy infantry ... this regiment's commander, Major Count Auersperg, was killed. Prince Liechtenstein also had the Nassau regiment attack the French infantry.
- **grade**: A (eyewitness, 1806)
- **label**: fact
- **notes**: Classes in the V Column per Stutterheim: Russian uhlans (Grand Duke Constantine), Russian hussars (Elisabethgrad), Austrian cuirassiers (Lorraine, Nassau). "Nassau" is not called cuirassiers on p. 94 itself. Stutterheim (p. 99, f103) says Bagration later sent "presque toute la cavalerie de son corps" to Uvarov, "qui commandoit ainsi environ trente escadrons". No "Gladkov" appears in any Stutterheim snippet searched (ContentSearch "Gladkow", see Not found).

- **id**: al.rg.units.stutterheim
- **claim**: Stutterheim names, in the Russian Guard's fight, the Grand Duke's Horse Guards regiment (which took an eagle of a battalion of the French 4th regiment), the Chevalier Guards, and some squadrons of the Guard Hussars; and on the French side the grenadiers à cheval of the Guard under Rapp, and the battalion of chasseurs of the (French) Guard at Blasowitz.
- **value (source's words)**: "Le régiment des gardes à cheval du Grand-Duc"; "les chevaliers gardes et quelques escadrons des hussards de la garde"; "les grenadiers à cheval de la garde française"; "le bataillon des chasseurs de la garde"
- **source**: stutterheim1806, pp. 79, 96-98 (views f83, f100-f102)
- **quote**: p. 96-97: "Le régiment des gardes à cheval du Grand-Duc, pour dégager l'infanterie, fit une charge sur le flanc des Français [...] Le régiment des gardes à cheval prit à cette occasion une aigle française d'un bataillon du quatrième régiment. [...] mais fut arrêtée par les chevaliers gardes et quelques escadrons des hussards de la garde [...] Les chevaliers gardes attaquèrent avec valeur et furent aux prises avec les grenadiers à cheval de la garde française, qui, conduits par le général Rapp, étoient venus renforcer la cavalerie ennemie." ; p. 79: "[le village de Blasowitz] par le bataillon des chasseurs de la garde". Translation: The Grand Duke's Horse Guards regiment charged the French flank to free the infantry ... the Horse Guards took on this occasion a French eagle of a battalion of the 4th regiment ... [the enemy cavalry] was stopped by the Chevalier Guards and some squadrons of the Guard Hussars ... the Chevalier Guards attacked bravely and came to grips with the horse grenadiers of the French Guard, who, led by General Rapp, had come to reinforce the enemy cavalry ... [the village of Blasowitz, taken] by the battalion of chasseurs of the guard.
- **grade**: A (eyewitness, 1806)
- **label**: fact
- **notes**: "le bataillon des chasseurs de la garde" at Blasowitz is the Russian Guard jäger battalion: p. 78-79 (views f82-f83) read: "Le Grand-Duc fit en hâte occuper le village de Blasowitz par le bataillon des chasseurs de la garde" (The Grand Duke hastily had the village of Blasowitz occupied by the battalion of chasseurs [jägers] of the guard). Russian Guard cavalry classes from this source: Horse Guards (cuirassier-type heavy), Chevalier Guards, Guard Hussars, plus (pp. 80-81) the Grand Duke's uhlans who were in the V Column, not the Guard.

- **id**: fr.reserve.counts.stutterheim
- **claim**: Stutterheim gives the French reserve as ten battalions of the Imperial Guard and ten battalions of Oudinot's grenadiers.
- **value (source's words)**: "dix bataillons de la garde impériale et de dix bataillons des grenadiers du général Oudinot"
- **source**: stutterheim1806, p. 77 (view f81); also p. 57 (PAG_61, OCR snippet: "commandee par le général Duroc")
- **quote**: "La réserve de l'armée française, composée de dix bataillons de la garde impériale et de dix bataillons des grenadiers du général Oudinot, qui, rétabli de sa blessure, en prit de nouveau le commandement, resta sur les hauteurs, entre Schlapanitz et Kobelnitz." Translation: The French army's reserve, of ten battalions of the Imperial Guard and ten battalions of General Oudinot's grenadiers (Oudinot, recovered from his wound, took command again), stayed on the heights between Schlapanitz and Kobelnitz.
- **grade**: B (an Allied eyewitness describing the French side, not a French return)
- **label**: uncertain (enemy estimate); note the conflict with the project's "Oudinot convalescent; command fell to Duroc": Stutterheim p. 77 says Oudinot resumed command, p. 57 (snippet) says commanded by Duroc
- **notes**: the Guard infantry at Austerlitz is commonly given as fewer than ten battalions; Stutterheim's count may include the Italian guard; not resolved.

- **id**: fr.santon.unit.stutterheim
- **claim**: Stutterheim says Lannes covered the French left with eighteen guns guarded by the "twenty-seventh" infantry regiment on a dominant height left of the Brünn road.
- **value (source's words)**: "dix-huit pièces de canon gardées par le vingt septième régiment d'infanterie"
- **source**: stutterheim1806, pp. 98-99 (views f102-f103)
- **quote**: "Le Maréchal Lannes avoit, pour couvrir la gauche de l'armée française, et sa retraite [p. 99] en cas de revers, dix-huit pièces de canon gardées par le vingt septième régiment d'infanterie sur la hauteur dominante entre Lesch et Kowalowitz, à gauche de la chaussée de Brünn". Translation: Marshal Lannes had, to cover the French army's left and its retreat in case of reverse, eighteen guns guarded by the twenty-seventh infantry regiment on the dominant height between Lesch and Kowalowitz, left of the Brünn road.
- **grade**: C (Allied eyewitness naming a French unit; contradicts the project's 17e Légère)
- **label**: disputed
- **notes**: the project has "17e Légère with 18 guns" (Duffy/Smith). The 18 guns agree. See Disagreements; French sources below.

### French: divisions' regiments in the return of 6 brumaire an XIV (28 October 1805)

General note for every claim in this section: the return is dated 28 October 1805, five weeks before the battle. It is an
official 1805 return (grade A for the composition on that date); for the composition ON 2 DECEMBER it is graded B unless
confirmed by a later source, because detachments and losses between 28 Oct and 2 Dec (Hollabrunn, Dürnstein, garrisons) are not
shown by it. The numbers of battalions are printed for IV Corps, III Corps and Oudinot only. All quotes read from the page images.

- **id**: fr.sthilaire.regiments
- **claim**: Saint-Hilaire's division (1st division, IV Corps; brigades Thiébault, Morand, Waré) comprised the 10e légère and the 14e, 36e, 43e and 55e de ligne, two battalions each (10 battalions; 2 light, 8 line).
- **value (source's words)**: "10e légère (2 bataillons) ; 14e de ligne (2 bataillons) ; 36e de ligne (2 bataillons) ; 43e de ligne (2 bataillons) ; 55e de ligne (2 bataillons)."
- **source**: alombertcolin4_1908, p. 727 (leaf n735), https://archive.org/details/la-campagne-de-1805-en-allemagne-vol.-4/page/n735
- **quote**: "1re division du 4e corps. Général de division .. Saint-Hilaire. [...] Généraux de brigade.. Thiébault ; [...] Morand ; [...] Waré ; [...] Troupes ... 10e légère (2 bataillons) ; 14e de ligne (2 bataillons) ; 36e de ligne (2 bataillons) ; 43e de ligne (2 bataillons) ; 55e de ligne (2 bataillons)." Translation: 1st division of IV Corps, General Saint-Hilaire; brigadiers Thiébault, Morand, Waré; troops: 10th light (2 bn), 14th, 36th, 43rd, 55th line (2 bn each).
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct)
- **notes**: the project's note that the 43e and 55e were attached to Vandamme on 2 Dec is NOT shown by this return (they are Saint-Hilaire's here); not confirmed or refuted in this session. Classes: light infantry 2 bn; line infantry 8 bn.

- **id**: fr.vandamme.regiments
- **claim**: Vandamme's division (2nd division, IV Corps; brigades Schiner, Ferey, Candras) comprised the 24e légère and the 4e, 28e, 46e and 57e de ligne, two battalions each (10 bn; 2 light, 8 line).
- **value (source's words)**: "24e légère (2 bataillons) ; 4e de ligne (2 bataillons) ; 28e de ligne (2 bataillons) ; 46e de ligne (2 bataillons) ; 57e de ligne (2 bataillons)."
- **source**: alombertcolin4_1908, p. 728 (leaf n736)
- **quote**: "2e division du 4e corps. Général de division... Vandamme. [...] Généraux de brigade.. Schiner ; [...] Ferrey ; [...] Candras ; [...] Troupes........ 24e légère (2 bataillons) ; 4e de ligne (2 bataillons) ; 28e de ligne (2 bataillons) ; 46e de ligne (2 bataillons) ; 57e de ligne (2 bataillons)." Translation: 2nd division of IV Corps, General Vandamme; brigadiers Schiner, Ferey [printed "Ferrey"], Candras; troops: 24th light, 4th, 28th, 46th, 57th line, 2 bn each.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct)
- **notes**: the 4e de Ligne lost an eagle at Austerlitz (Stutterheim p. 97, "une aigle française d'un bataillon du quatrième régiment"), which confirms the 4e's presence on 2 Dec (grade A for that regiment). The djvu OCR reads "87e" for "57e": the image shows 57e.

- **id**: fr.legrand.regiments
- **claim**: Legrand's division (3rd division, IV Corps; brigades Levasseur, Merle, Brouard) comprised the Tirailleurs corses (1 bn), 3e de ligne (3 bn), 75e de ligne (2 bn), 18e de ligne (2 bn), Tirailleurs du Pô (1 bn) and 26e légère (2 bn): 11 battalions.
- **value (source's words)**: "Tirailleurs corses (1 bataillon) ; 3e de ligne (3 bataillons) ; 75e de ligne (2 bataillons) ; 18e de ligne (2 bataillons) ; Tirailleurs du Pô (1 bataillon) ; 26e légère (2 bataillons)."
- **source**: alombertcolin4_1908, pp. 728-729 (leaves n736-n737)
- **quote**: "3e division du 4e corps. Général de division... Legrand. [...] Généraux de brigade.. Levasseur ; [...] Merle ; [...] Brouard. [p. 729] Troupes.......... Tirailleurs corses (1 bataillon) ; 3e de ligne (3 bataillons) ; 75e de ligne (2 bataillons) ; 18e de ligne (2 bataillons) ; Tirailleurs du Pô (1 bataillon) ; 26e légère (2 bataillons)." Translation: as the claim.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct)
- **notes**: brigadiers here are Levasseur, Merle, Brouard; the project's "Merle · Féry · Levasseur" has Féry where this return has Brouard (a staff question, outside this topic; recorded, not resolved). Stutterheim p. 70 confirms "le troisième régiment de ligne et deux bataillons de tirailleurs" in Telnitz on 2 Dec (grade A for those units' presence). Classes: line (7 bn), light (2 bn), tirailleurs (2 bn: Corsican and Po light battalions).

- **id**: fr.friant.regiments
- **claim**: Friant's division (2nd division, III Corps; brigades Heudelet, Lochet, Grandeau) comprised the 33e, 48e, 108e and 111e de ligne and the 15e légère, two battalions each (10 bn).
- **value (source's words)**: "33e de ligne (2 bataillons) ; 48e de ligne (2 bataillons) ; 108e de ligne (2 bataillons) ; 111e de ligne (2 bataillons) ; 15e légère (2 bataillons)."
- **source**: alombertcolin4_1908, p. 724 (leaf n732)
- **quote**: "2e division du 3e corps. Général de division... Friant. [...] Généraux de brigade.. Heudelet ; [...] Lochet ; [...] Grandeau ; [...] Troupes........ 33e de ligne (2 bataillons) 48e de ligne (2 bataillons) ; 108e de ligne (2 bataillons) ; 111e de ligne (2 bataillons) ; 15e légère (2 bataillons)." Translation: as the claim.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct)
- **notes**: on 28 Oct Kister is a brigadier of Gudin's division (same page), not Friant's; the project's staff line "Kister · Lochet · Heudelet" is not shown by this return (outside this topic). How many of the ten battalions reached the field on 2 Dec is disputed (project: 3,470 vs up to 6,400).

- **id**: fr.caffarelli.regiments
- **claim**: The 1st division of III Corps (under Bisson on 28 Oct; the division Caffarelli led at Austerlitz) comprised the 13e légère and the 17e, 30e, 51e and 61e de ligne, two battalions each (10 bn).
- **value (source's words)**: "13e légère (2 bataillons) ; 17e de ligne (2 bataillons) ; 30e de ligne (2 bataillons) ; 51e de ligne (2 bataillons) ; 61e de ligne (2 bataillons)."
- **source**: alombertcolin4_1908, pp. 723-724 (leaves n731-n732)
- **quote**: "1re division du 3e corps. Général de division... Bisson. [...] Généraux de brigade.. Demont ; [...] Billy ; [...] Eppler ; [...] [p. 724] Troupes........ 13e légère (2 bataillons) ; 17e de ligne (2 bataillons) ; 30e de ligne (2 bataillons) ; 51e de ligne (2 bataillons) ; 61e de ligne (2 bataillons)." Translation: 1st division of III Corps, General Bisson; brigadiers Demont, Billy, Eppler; troops as the claim.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct); that this is Caffarelli's division of 2 Dec is an inference from the project's own note ("Caffarelli's division, normally of III Corps") and Stutterheim p. 78 ("la division Caffarelli") — the change of commander is not shown by this return
- **notes**: whether the whole division (all 10 bn) was with Lannes on 2 Dec is not shown here.

- **id**: fr.suchet.regiments
- **claim**: Suchet's division (3rd division, V Corps; brigades Becker, Roger-Valhubert, Claparède) comprised the 17e légère and the 34e, 40e, 64e and 88e de ligne (battalion counts not printed).
- **value (source's words)**: "17e légère ; 34e de ligne ; 40e de ligne ; 64e de ligne ; 88e de ligne."
- **source**: alombertcolin4_1908, p. 732 (leaf n740)
- **quote**: "3e division du 5e corps. Général de division... Suchet. [...] Généraux de brigade.. Becker ; [...] Roger-Walhubert ; [...] Claparède. [...] Troupes........ 17e légère ; 34e de ligne ; 40e de ligne ; 64e de ligne ; 88e de ligne." Translation: as the claim.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct)
- **notes**: the 17e légère under brigadier Claparède belongs to Suchet's division here, which is consistent with the project's Santon detachment (Claparède, 17e Légère) and inconsistent with Stutterheim's "27e" (see Disagreements). The V Corps detailed return (same annex, p. ~757, line "31e rég. d'inf. de ligne" in the OCR) was not read as image.

- **id**: fr.drouet.regiments
- **claim**: Drouet's division, labelled the 1st division of I Corps on 28 Oct 1805 (brigades Frère, Werlé), comprised the 27e légère and the 94e and 95e de ligne.
- **value (source's words)**: "27e légère ; 94e de ligne ; 95e de ligne."
- **source**: alombertcolin4_1908, pp. 716-717 (leaves n724-n725)
- **quote**: p. 716: "1re division du 1er corps. Général de division... Drouet. [...] Généraux de brigade.. Frère ; [...] Werlé ;" p. 717: "Troupes........... 27e légère ; 94e de ligne ; 95e de ligne." Translation: 1st division of I Corps, General Drouet; brigadiers Frère, Werlé; troops: 27th light, 94th and 95th line.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct)
- **notes**: NUMBERING CONFLICT: this return numbers Drouet's division 1st and Rivaud's 2nd; the project has rivaud "1re Div., I Corps" and drouet "2e Div., I Corps". Battalion counts not printed (French line regiments then normally fielded 2 field battalions; NOT stated here). Classes: light 1 regiment, line 2 regiments.

- **id**: fr.rivaud.regiments
- **claim**: Rivaud's division, labelled the 2nd division of I Corps on 28 Oct 1805 (brigades Dumoulin, Pacthod), comprised the 8e, 45e and 54e de ligne.
- **value (source's words)**: "8e de ligne ; 45e de ligne ; 54e de ligne."
- **source**: alombertcolin4_1908, p. 717 (leaf n725)
- **quote**: "2e division du 1er corps. Général de division... Rivaud. [...] Généraux de brigade.. Dumoulin ; [...] Pacthod ; [...] Troupes........... 8e de ligne ; 45e de ligne ; 54e de ligne." Translation: as the claim.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct)
- **notes**: all line infantry; no light regiment. See the numbering conflict under fr.drouet.regiments.

- **id**: fr.kellermann.regiments
- **claim**: Kellermann's light cavalry was the cavalry division of I Corps on 28 Oct 1805 (brigades Picard, Van Marizy), comprising the 2e, 4e and 5e hussards and the 5e chasseurs.
- **value (source's words)**: "2e hussards ; 4e hussards ; 5e hussards ; 5e chasseurs."
- **source**: alombertcolin4_1908, pp. 717-718 (leaves n725-n726)
- **quote**: p. 717: "Division de cavalerie du 1er corps. Général de division... Kellermann. [...] Généraux de brigade . Picard ; [...] Van Marizy ;" p. 718: "Troupes........... 2e hussards ; 4e hussards ; 5e hussards ; 5e chasseurs." Translation: cavalry division of I Corps, General Kellermann; brigadiers Picard, Van Marisy; troops: 2nd, 4th, 5th hussars, 5th chasseurs.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct)
- **notes**: supports the project's note that "some orders of battle attribute Kellermann's light cavalry to I Corps". Squadron counts not printed. Classes: hussars (3 regiments), chasseurs à cheval (1).

- **id**: fr.nansouty.regiments
- **claim**: Nansouty's 1st heavy cavalry division (brigades Piston, Lahoussaye, Saint-Germain) comprised the 1er and 2e carabiniers and the 2e, 9e, 3e and 12e cuirassiers: six regiments.
- **value (source's words)**: "1er et 2e carabiniers ; 2e, 9e, 3e et 12e cuirassiers."
- **source**: alombertcolin4_1908, pp. 740-741 (leaves n748-n749)
- **quote**: p. 741: "Généraux de brigade . Piston ; [...] Lahoussaye ; [...] Saint-Germain. [...] Troupes............ 1er et 2e carabiniers ; 2e, 9e, 3e et 12e cuirassiers." Translation: brigadiers Piston, Lahoussaye, Saint-Germain; troops: 1st and 2nd carabiniers; 2nd, 9th, 3rd and 12th cuirassiers.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct)
- **notes**: the division heading "1re division de grosse cavalerie ... Nansouty" is on p. 740 (OCR lines read: "division de grosse cavalerie. Général de division.. . Nansouty."); p. 740 was not viewed as image. Answers the lead "Nansouty's six regiments": 2 carabinier + 4 cuirassier regiments (the carabiniers are a distinct class to dress).

- **id**: fr.dhautpoul.regiments
- **claim**: d'Hautpoul's 2nd heavy cavalry division (brigades Saint-Sulpice, Fauconnet) comprised the 1er, 5e, 10e and 11e cuirassiers.
- **value (source's words)**: "1er, 5e, 10e et 11e cuirassiers."
- **source**: alombertcolin4_1908, p. 741 (leaf n749)
- **quote**: "2e division de grosse cavalerie. Général de division .. d'Hautpoul. [...] Généraux de brigade.. Saint-Sulpice ; [...] Fauconnet ; [...] Troupes............ 1er, 5e, 10e et 11e cuirassiers." Translation: as the claim.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct)
- **notes**: on 28 Oct Fauconnet is ALSO listed commanding V Corps' light cavalry (p. 732); not resolved.

- **id**: fr.walther.regiments
- **claim**: Walther's 2nd dragoon division (brigades Sébastiani, Roget, Boussard) comprised the 10e, 13e, 22e, 3e, 6e and 11e dragons.
- **value (source's words)**: "10e, 13e, 22e, 3e, 6e et 11e dragons."
- **source**: alombertcolin4_1908, p. 742 (leaf n750)
- **quote**: "2e division de dragons à cheval. Général de division... Walther. [...] Généraux de brigade.. Sébastiani ; [...] Roget ; [...] Boussard ; [...] Troupes........... 10e, 13e, 22e, 3e, 6e et 11e dragons." Translation: as the claim.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct)
- **notes**: Stutterheim p. 108 (OCR snippet, PAG_112, not viewed as image) mentions "deux régimens de dragons français qui venoient de Sokolnitz" on the Allied left.

- **id**: fr.beaumont.regiments
- **claim**: Beaumont's 3rd dragoon division (brigades Boyer, Scalfort, Milhaud) comprised the 5e, 8e, 12e, 9e, 16e and 21e dragons.
- **value (source's words)**: "5e, 8e, 12e, 9e, 16e et 21e dragons."
- **source**: alombertcolin4_1908, p. 743 (leaf n751)
- **quote**: "3e division de dragons à cheval. Général de division... Beaumont. [...] Généraux de brigade.. Boyer (Ch.) ; Scalfort ; [...] Milhaud. [...] Troupes........... 5e, 8e, 12e, 9e, 16e et 21e dragons." Translation: as the claim.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct)
- **notes**: not a drawn formation (the project does not plot Beaumont); recorded because the project's c_cav note names it.

- **id**: fr.bourcier.regiments
- **claim**: Bourcier's 4th dragoon division (brigades Laplanche, Sahuc, Verdière) comprised the 15e, 17e, 27e, 18e, 19e and 25e dragons.
- **value (source's words)**: "15e, 17e, 27e, 18e, 19e, 25e dragons."
- **source**: alombertcolin4_1908, p. 743 (leaf n751)
- **quote**: "4e division de dragons à cheval. Général de division... Bourcier. [...] Généraux de brigade.. Laplanche ; [...] Sahuc ; [...] Verdière ; [...] Troupes........... 15e, 17e, 27e, 18e, 19e, 25e dragons." Translation: as the claim.
- **grade**: B for the regiments on 28 Oct; which of them were present on 2 Dec is NOT shown (C until found)
- **label**: fact (for 28 Oct); uncertain (for 2 Dec: the project says only a fraction reached the field)
- **notes**: lead "Bourcier's regiments present": NOT FOUND for 2 Dec in this session (see Not found).

- **id**: fr.guard.composition
- **claim**: The Imperial Guard division on 28 Oct 1805 comprised grenadiers à pied, chasseurs à pied, the (Italian) Garde royale, grenadiers à cheval, chasseurs à cheval, Mamelukes, gendarmes d'élite, artillery, artillery train and ambulance.
- **value (source's words)**: "Grenadiers à pied ; Chasseurs à pied ; Garde royale ; Grenadiers à cheval ; Chasseurs à cheval ; Mamelucks ; Gendarmes d'élite ; Artillerie ; Train d'artillerie ; Ambulance."
- **source**: alombertcolin4_1908, pp. 744-745 (leaves n752-n753)
- **quote**: p. 745: "Troupes............ Grenadiers à pied ; Chasseurs à pied ; Garde royale ; Grenadiers à cheval ; Chasseurs à cheval ; Mamelucks ; Gendarmes d'élite ; Artillerie ; Train d'artillerie ; Ambulance." Translation: as the claim.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct)
- **notes**: "Garde royale" = the Italian Royal Guard (the project's "Grenadiers of the Italian Royal Guard"): that it is Italian is an inference from the name; this page does not say which arms of it. Gendarmes d'élite are a class the project's guard_cav note does not list (Horse Grenadiers, Chasseurs à Cheval, Mamelukes); their presence on 2 Dec is not shown here. No battalion or squadron counts are printed.

- **id**: fr.oudinot.composition
- **claim**: Oudinot's grenadier division (1st division, V Corps, on 28 Oct 1805; brigades Laplanche-Mortières, Dupas, Ruffin) was formed of five combined regiments of elite battalions drawn from other regiments: 1st line regiment from the 13e and 58e (line) battalions; 2nd line from the 9e and 81e; 3rd light from the 2e and 3e (light); 4th light from the 28e and 31e; 5th light from the 12e and 15e; with the 2nd sapper battalion.
- **value (source's words)**: "1er régiment de ligne : 13e et 58e bataillons ; 2e régiment de ligne : 9e et 81e bataillons ; 3e régiment d'infanterie légère : 2e et 3e bataillons ; 4e régiment d'infanterie légère : 28e et 31e bataillons ; 5e régiment d'infanterie légère : 12e et 15e bataillons."
- **source**: alombertcolin4_1908, pp. 730-731 (leaves n738-n739)
- **quote**: p. 731: "Généraux de brigade.. Laplanche Mortières ; [...] Dupas ; [...] Ruffin ; [...] Troupes..... 2e bataillon de sapeurs ; 1er régiment de ligne : 13e et 58e bataillons ; 2e régiment de ligne : 9e et 81e bataillons ; 3e régiment d'infanterie légère : 2e et 3e bataillons ; 4e régiment d'infanterie légère : 28e et 31e bataillons ; 5e régiment d'infanterie légère : 12e et 15e bataillons." Translation: brigadiers Laplanche-Mortières, Dupas, Ruffin; troops: 2nd sapper battalion; 1st line regiment: the 13th and 58th battalions; 2nd line regiment: 9th and 81st battalions; 3rd light infantry regiment: 2nd and 3rd battalions; 4th light: 28th and 31st battalions; 5th light: 12th and 15th battalions.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct). That "13e et 58e bataillons" means the elite (grenadier/voltigeur or carabinier) battalions of the 13th and 58th line regiments is an inference supported by the detailed V Corps return of the same annex (OCR line "Bat. d'élite du 9e rég. de ligne", p. ~758; not yet viewed as image)
- **notes**: the division's heading on p. 730 (leaf n738) read as image: "1re division du 5e corps. Général de division... Oudinot." 10 battalions in all, matching Stutterheim's "dix bataillons des grenadiers du général Oudinot" (p. 77). Classes: line grenadiers (2 regiments, 4 bn) and light carabiniers/voltigeurs (3 regiments, 6 bn). The division fought at Hollabrunn (16 Nov) between this return and Austerlitz; its 2 Dec state is not shown here.

- **id**: fr.oudinot.strength.26oct
- **claim**: The V Corps return of 4 brumaire an XIV (26 October 1805) lists the "Division de grenadiers" as ten elite battalions ("Bat. d'élite") of the 9e, 13e, 58e and 81e de ligne and of the 2e, 3e, 12e, 15e, 28e and 31e légère, 640-720 rank and file each, 7,329 all ranks with its artillery, train and sappers.
- **value (source's words)**: "Bat. d'élite du 9e rég. de ligne ... 668"; "du 13e ... 680"; "du 58e ... 742"; "du 81e ... 716"; "du 2e rég. d'inf. légère ... 659"; "du 3e ... 693"; "du 12e ... 681"; "du 15e ... 702"; "du 28e ... 653"; "du 31e ... 690"; "Totaux ... 223 / 7,106 / 7,329 / 319"
- **source**: alombertcolin4_1908, p. 755 (leaf n760), https://archive.org/details/la-campagne-de-1805-en-allemagne-vol.-4/page/n760
- **quote**: "Situation des divisions composant le 5e corps de la Grande Armée à l'époque du 4 brumaire an XIV (26 octobre 1805). [...] Division de grenadiers. 6e régiment d'artillerie à cheval .... 6 | 31 | 33 | 36 / 1er — à pied ...... 2 | 137 | 141 | 10 / 5e bataillon bis du train .... 4 | 185 | 191 | 303 / 2e comp. du 2e bataillon de sapeurs. 3 | 77 | 80 / Bat. d'élite du 9e rég. de ligne ..... 20 | 648 | 668 / — du 13e — 19 | 661 | 680 / — du 58e — 22 | 720 | 742 / — du 81e — 19 | 697 | 716 / — du 2e rég. d'inf. légère. 19 | 640 | 659 / — du 3e — 23 | 670 | 693 / — du 12e — 21 | 660 | 681 / — du 15e — 22 | 680 | 702 / — du 28e — 23 | 630 | 653 / — du 31e — 20 | 670 | 690 / Totaux ..... 223 | 7,106 | 7,329 | 319". Columns: officers present, troops present, total officers included, horses present. Translation: Grenadier division: horse artillery, foot artillery, train, sappers, and the elite battalions of the 9th, 13th, 58th and 81st line and the 2nd, 3rd, 12th, 15th, 28th and 31st light regiments.
- **grade**: B for 2 Dec (A for 26 Oct 1805: an official return printed verbatim)
- **label**: fact (for 26 Oct)
- **notes**: "Bat. d'élite" (elite battalion) confirms the inference in fr.oudinot.composition: the division was formed of elite battalions drawn from line and light regiments. This answers the lead "Oudinot's grenadier battalions" for late October; the state on 2 Dec (after Hollabrunn, 16 Nov) is NOT shown; the project's 5,500-5,700 is consistent with losses but not checked. Classes: line grenadiers (4 bn), light carabiniers/voltigeurs (6 bn); plus horse and foot artillery (a "No artillery is listed for the division" note in the project's strengthNote is contradicted for 26 Oct: 6e à cheval and 1er à pied detachments are listed).

- **id**: fr.suchet.strength.26oct
- **claim**: The same V Corps return gives Suchet's division on 26 Oct 1805 as the 17e légère (1,638 all ranks), a regiment printed "31e" de ligne (1,488; its 3rd battalion detached at Donauwörth), 40e (1,540), 64e (1,189; 4 companies detached to the grand park) and 88e (1,820), with an artillery detachment and train: 7,906 in all.
- **value (source's words)**: "17e rég. d'inf. légère ... 55 | 1,583 | 1,638 | 13"; "31e rég. d'inf. de ligne (1) ... 59 | 1,429 | 1,488 | 14"; "40e — ... 62 | 1,478 | 1,540"; "64e — (2) ... 40 | 1,149 | 1,189"; "88e — ... 61 | 1,759 | 1,820"; "(1) Le 3e bataillon détaché à Donauwerth. (2) 4 compagnies détachées au grand parc d'artillerie."
- **source**: alombertcolin4_1908, p. 756 (leaf n761)
- **quote**: "3e division aux ordres du général Suchet. Détachement du 5e d'artillerie à pied. 1 | 124 | 128 / Train ... 2 | 101 | 103 | 151 / 17e rég. d'inf. légère ... 55 | 1,583 | 1,638 | 13 / 31e rég. d'inf. de ligne (1) ... 59 | 1,429 | 1,488 | 14 / 40e — ... 62 | 1,478 | 1,540 | 11 / 64e — (2) ... 40 | 1,149 | 1,189 | 7 / 88e — ... 61 | 1,759 | 1,820 | 9 / Totaux ... 283 | 7,623 | 7,906 | 205 / (1) Le 3e bataillon détaché à Donauwerth. (2) 4 compagnies détachées au grand parc d'artillerie. Certifié conforme aux états remis par les chefs d'état-major des divisions. A Landshut, le 4 brumaire, an XIV." Translation: as the claim; certified true to the returns of the divisions' chiefs of staff, Landshut, 26 Oct 1805.
- **grade**: B for 2 Dec (A for 26 Oct 1805)
- **label**: fact (for 26 Oct); the regiment number "31e" (p. 756) vs "34e" (p. 732) is disputed within the same book
- **notes**: the 17e légère's 1,638 on 26 Oct is consistent in order of magnitude with the project's "about 1,600 infantry of the 17e Légère" on the Santon (not a confirmation for 2 Dec). The footnote implies the "31e/34e" had three battalions with one detached.

- **id**: fr.cavres.13nov
- **claim**: A summary return of the Cavalry Reserve of 22 brumaire an XIV (13 November 1805) lists the "1re div. de cavalerie" as the 1er and 2e carabiniers and the 1er, 2e, 3e and 5e cuirassiers (1,752 present), the "2e div. de cavalerie" as the 9e, 10e, 11e and 12e cuirassiers (1,209), and six dragoon regiments 3e, 11e, 10e, 6e, 13e, 22e (1,534; Walther's six of 28 Oct).
- **value (source's words)**: "1re div. de cavalerie: 1er rég. de carabiniers 232; 2e 239; 1er rég. de cuirassiers 350; 2e 305; 3e 291; 5e 335 [total] 1,752"; "2e div. de cavalerie: 9e rég. de cuirassiers 318; 10e 260; 11e 333; 12e 298 [total] 1,209"; "3e rég. de dragons 258; 11e 347; 10e 225; 6e 284; 13e 268; 22e 152 [total] 1,534"
- **source**: alombertcolin4_1908, p. 757 (leaf n762), https://archive.org/details/la-campagne-de-1805-en-allemagne-vol.-4/page/n762
- **quote**: "Réserve de cavalerie. Situation sommaire des régiments ci-après désignés à l'époque du 22 brumaire an XIV (13 novembre 1805). [...] 1re div. de cavalerie: 1er rég. de carabiniers. 232 [...] 2e — 239 / 1er rég. de cuirassiers. 350 / 2e — 305 / 3e — 291 / 5e — 335 } 1,752 [...] 2e div. de cavalerie: 9e rég. de cuirassiers. 318 / 10e — 260 / 11e — 333 / 12e — 298 } 1,209". Column: "Présents sous les armes officiers compris". Translation: Cavalry Reserve, summary return of the regiments named below on 13 November 1805 ... 1st cavalry division: 1st and 2nd carabiniers, 1st, 2nd, 3rd, 5th cuirassiers, 1,752 present under arms, officers included ... 2nd cavalry division: 9th, 10th, 11th, 12th cuirassiers, 1,209.
- **grade**: A for 13 Nov 1805 (official return); B for 2 Dec
- **label**: disputed (the allocation of cuirassier regiments to the two heavy divisions differs from the 28 Oct return: see Disagreements)
- **notes**: the 13 Nov return does not name the division commanders. On 28 Oct Nansouty had 2e, 9e, 3e, 12e cuirassiers and d'Hautpoul 1er, 5e, 10e, 11e; on 13 Nov "1re div." has 1er, 2e, 3e, 5e and "2e div." has 9e, 10e, 11e, 12e. Which allocation held on 2 Dec is NOT settled by these two returns. Either way: Nansouty = 2 carabinier + 4 cuirassier regiments; d'Hautpoul = 4 cuirassier regiments. Strength on 13 Nov: about 1,750 and 1,210 (the project: Nansouty about 1,600, d'Hautpoul 1,300). Walther's six dragoon regiments: 1,534 present (the project: 1,500).

### Allied: the regiments of each column (Mikhailovsky-Danilevsky 1844, French translation 1846)

General note: Mikhailovsky-Danilevsky prints one list, "the order in which they later fought", made the evening before the march
on Austerlitz. He names regiments, not battalions. Russian infantry regiments named under "Fusiliers" are musketeer (line)
regiments unless called grenadiers. Grade B throughout (a specialist history from the archives, 1844, not a 1805 document), unless
confirmed by Stutterheim (A). Read from the page images (pp. 223-226 = PDF pp. 246-249).

- **id**: al.md.intro
- **claim**: Mikhailovsky-Danilevsky states that a new distribution of the regiments by columns was made in the evening, before the march toward Austerlitz, and that the troops later fought in the order he then lists.
- **value (source's words)**: "une nouvelle répartition des régiments par colonnes"
- **source**: mikhailovsky1846, p. 223 (PDF p. 246)
- **quote**: "Dans la soirée on procéda à une nouvelle répartition des régiments par colonnes, ensuite à la formation définitive des troupes qui se mirent en marche le lendemain, 20 novembre, vers Austerlitz, et qui combattirent plus tard dans l'ordre suivant :" Translation: In the evening a new distribution of the regiments by columns was made, then the final formation of the troops, which marched the next day, 20 November [Old Style, as printed], toward Austerlitz, and which later fought in the following order:
- **grade**: B (specialist, from the archives)
- **label**: fact (as the author's statement)
- **notes**: the date is printed in the Russian (Julian) calendar; this file does not convert it.

- **id**: al.dok.regiments.md
- **claim**: The I Column (Dokhturov) comprised the 5th Jäger regiment and one battalion of the 7th Jäger; the New Ingermanland, Yaroslavl, Vladimir, Bryansk, Vyatka and Moscow musketeer regiments and the Kiev Grenadiers; the 2nd position artillery company, one pioneer company and 2 squadrons of irregular Cossacks.
- **value (source's words)**: "5e de chasseurs à pied et un bataillon du 7e idem. Fusiliers : Nouvelle-Ingrie, Jaroslaw, Wladimir, Briansk, Wiatka, Moscou, Grenadiers de Kiew, 2e comp. d'artill. de position, 1 compagnie de pionniers, 2 escadr. de cosaques irrégul."
- **source**: mikhailovsky1846, p. 224 (PDF p. 247)
- **quote**: "1re COLONNE. GÉNÉRAL DOCTOUROFF. RÉGIMENTS : 5e de chasseurs à pied et un bataillon du 7e idem. Fusiliers : Nouvelle-Ingrie, Wiatka, Jaroslaw, Moscou, Wladimir, Grenadiers de Kiew, Briansk, 2e comp. d'artill. de position, 1 compagnie de pionniers, 2 escadr. de cosaques irrégul." Translation: I Column, General Dokhturov. Regiments: 5th Jäger and one battalion of the 7th; musketeers ("fusiliers"): New Ingermanland, Vyatka, Yaroslavl, Moscow, Vladimir, Kiev Grenadiers, Bryansk; 2nd position artillery company; 1 pioneer company; 2 squadrons of irregular Cossacks.
- **grade**: B (specialist); the 7th Jäger battalion and the New Ingermanland regiment are confirmed by Stutterheim pp. 72-73 (A)
- **label**: fact
- **notes**: Classes: jägers (1 regiment + 1 bn), musketeers (6 regiments), grenadiers (1 regiment), position artillery, pioneers, Cossacks. Battalion counts per regiment are not given (Stutterheim: 24 bn in the column). The project's dok note gives "250 cavalry": consistent with 2 Cossack squadrons (Stutterheim 27 Nov: "2 1/2 Escadrons de cosaques ... 250 chevaux").

- **id**: al.kienmayer.regiments.md
- **claim**: Ahead of Dokhturov, Kienmayer's detachment comprised 2 regiments of irregular Cossacks, 2 weak regiments of Hungarian cavalry and 5 battalions of Croats.
- **value (source's words)**: "2 régiments de cosaques irréguliers. 2 faibles régiments de cavalerie hongroise. 5 bataillons de Croates."
- **source**: mikhailovsky1846, p. 224 (PDF p. 247)
- **quote**: "En avant de Doctouroff, le détachement de Kienmeyer, Savoir : 2 régiments de cosaques irréguliers. 2 faibles régiments de cavalerie hongroise. 5 bataillons de Croates." Translation: Ahead of Dokhturov, Kienmayer's detachment, namely: 2 regiments of irregular Cossacks; 2 weak regiments of Hungarian cavalry; 5 battalions of Croats.
- **grade**: B (specialist)
- **label**: disputed (Stutterheim, A, names THREE Austrian cavalry regiments with Kienmayer, Hesse-Homburg hussars, Szekler hussars and O'Reilly chevau-légers, and 22 Austrian squadrons; see Disagreements)
- **notes**: Grenz ("Croates") 5 bn agrees with Stutterheim. Cossacks: 2 regiments agrees with Stutterheim p. 101.

- **id**: al.lang.regiments.md
- **claim**: The II Column (Langeron) comprised the 8th Jäger regiment; the Vyborg, Perm, Kursk and "Riajsk" musketeer regiments and the Fanagoria Grenadiers; one pioneer company and 2 1/2 squadrons of irregular Cossacks.
- **value (source's words)**: "8e régiment de chasseurs à pied. Fusiliers : Wiborg, Perm, Koursk, Riajsk, Grenadiers de Phanagorie, 1 compagnie de pionniers, 2 1/2 escadrons de cosaques irréguliers."
- **source**: mikhailovsky1846, p. 224 (PDF p. 247)
- **quote**: "2e COLONNE. COMTE LANGERON. RÉGIMENTS : 8e régiment de chasseurs à pied. Fusiliers : Wiborg, Grenadiers de Phanagorie, Perm, 1 compagnie de pionniers, Koursk, 2 1/2 escadrons de cosaques irréguliers. Riajsk," Translation: II Column, Count Langeron. Regiments: 8th Jäger; musketeers: Vyborg, Perm, Kursk, Riajsk; Fanagoria Grenadiers; 1 pioneer company; 2 1/2 squadrons of irregular Cossacks.
- **grade**: B (specialist); Fanagoria and "Rhiasky" in the II Column confirmed by Stutterheim p. 90 (A)
- **label**: fact
- **notes**: Kamensky's brigade: MD's list puts Fanagoria and "Riajsk" in the II Column; Stutterheim p. 90 names exactly these two ("Fanagorisky grenadiers et Rhiasky mousquetaires") as the regiments that turned back to the plateau. "Riajsk" / "Rhiasky" transliterate Ряжск (Ryazhsk), not Рязань (Ryazan, French "Riazan"): the project's "Ryazan?" is, on this reading, the Ryazhsk (Ряжский) musketeer regiment. That reading is an inference from the two spellings; the Russian original was NOT read in this session (see Not found). Classes: jägers (1 regiment), musketeers (4), grenadiers (1), Cossacks (2 1/2 sq).

- **id**: al.prz.regiments.md
- **claim**: The III Column (Przybyszewski) comprised 2 battalions of the 7th Jäger regiment; the Galich, Butyrsk, Podolia, Narva and Azov musketeer regiments; and one pioneer company.
- **value (source's words)**: "2 bataillons du 7e régiment de chasseurs à pied. Fusiliers : Galitch, Boutyrsk, Podolie, Narwa, Azoff, 1 compagnie de pionniers."
- **source**: mikhailovsky1846, p. 225 (PDF p. 248)
- **quote**: "3e COLONNE. GÉNÉRAL PRZIBYSZEWSKI. RÉGIMENTS : 2 bataillons du 7e régiment de chasseurs à pied. Fusiliers : Galitch, Narwa, Boutyrsk, Azoff, Podolie, 1 compagnie de pionniers." Translation: III Column, General Przybyszewski. Regiments: 2 battalions of the 7th Jäger; musketeers: Galich, Narva, Butyrsk, Azov, Podolia; 1 pioneer company.
- **grade**: B (specialist)
- **label**: fact
- **notes**: Classes: jägers (2 bn), musketeers (5 regiments), pioneers. No cavalry, no grenadiers.

- **id**: al.col4.regiments.md
- **claim**: The IV Column (Kollowrat) comprised 15 weak Austrian battalions and, under Miloradovich, the Apsheron, Smolensk and Novgorod musketeer regiments and the Little Russia Grenadiers, with one artillery company and one pioneer company.
- **value (source's words)**: "15 faibles bataillons autrichiens. Sous les ordres de Miloradowitch. Apchéron, Smolensk, Nowgorod, Grenadiers de la Petite-Russie, 1 compagnie d'artillerie, 1 compagnie de pionniers."
- **source**: mikhailovsky1846, p. 225 (PDF p. 248)
- **quote**: "4e COLONNE. GÉNÉRAL KOLLOWRAT. RÉGIMENTS : 15 faibles bataillons autrichiens. Sous les ordres de Miloradowitch. RÉGIMENTS : Apchéron, Grenadiers de la Petite-Russie, Smolensk, 1 compagnie d'artillerie, Nowgorod, 1 compagnie de pionniers." Translation: IV Column, General Kollowrat: 15 weak Austrian battalions. Under Miloradovich: Apsheron, Little Russia Grenadiers, Smolensk, Novgorod, 1 artillery company, 1 pioneer company.
- **grade**: B (specialist); Novgorod and Apsheron confirmed by Stutterheim p. 84 (A)
- **label**: fact
- **notes**: MD names no Austrian regiment; Stutterheim names Salzburg, a battalion of Auersperg, the 6th battalions of Württemberg and Reuss-Greiz, and some Erzherzog Johann dragoons (see above). Russian classes: musketeers (3 regiments), grenadiers (1). Stutterheim counts 12 Russian battalions (p. 51) and the project 14: not resolved here.

- **id**: al.lich.regiments.md
- **claim**: The V Column (Liechtenstein) comprised 32 Austrian squadrons and the Russian Elisabethgrad Hussars, Kharkov Dragoons, Chernigov Dragoons and the Grand Duke Constantine's Uhlans.
- **value (source's words)**: "32 escadrons autrichiens, les hussards d'Elisabethgrad, Dragons de Kharkoff, Dragons de Tchernigoff, Les lanciers du grand-duc Constantin."
- **source**: mikhailovsky1846, p. 225 (PDF p. 248)
- **quote**: "5e COLONNE. PRINCE LICHTENSTEIN. RÉGIMENTS : 32 escadrons autrichiens, les hussards d'Elisabethgrad, Dragons de Kharkoff, Dragons de Tchernigoff, Les lanciers du grand-duc Constantin." Translation: V Column, Prince Liechtenstein. Regiments: 32 Austrian squadrons; the Elisabethgrad Hussars; Kharkov Dragoons; Chernigov Dragoons; the Grand Duke Constantine's lancers [uhlans].
- **grade**: B (specialist); the Elisabethgrad hussars and the Grand Duke's uhlans confirmed by Stutterheim p. 80 (A); Lorraine and Nassau among the Austrians by Stutterheim p. 94 (A)
- **label**: fact
- **notes**: answers the lead "the Fifth Column's Russian regiments": four (one hussar, two dragoon, one uhlan). No "Gladkov" appears here: the lead "whether Gladkov commanded a brigade" is NOT FOUND in either source read (Stutterheim's V Column generals on 27 Nov are Hohenlohe, Uvarov, Stutterheim, Weber, Caramelli and the Russian GM "Piritzky", p. 34). Classes: Austrian cuirassiers (Stutterheim names Lorraine, Nassau), Russian hussars, dragoons, uhlans.

- **id**: al.bag.regiments.md
- **claim**: Bagration's advance guard comprised the 6th Jäger regiment; the Pavlograd and Mariupol Hussars; the Tver and St Petersburg Dragoons; the Empress's Cuirassiers; the Old Ingermanland, Arkhangelsk and Pskov musketeer regiments; 8 squadrons of irregular Cossacks; 2 horse and 2 foot artillery companies.
- **value (source's words)**: "6e rég. de chasseurs à pied, Hussards de Pawlograd, Hussards de Marioupol, Dragons de Twer, Cuirass. de l'impératrice, Dragons de Saint-Pétersbourg. Fusiliers : Vieille-Ingrie, d'Archangel, de Pskoff, 8 escadr. de cosaques irrégul., 2 comp. d'artillerie à cheval, 2 comp. d'artillerie à pied."
- **source**: mikhailovsky1846, p. 226 (PDF p. 249)
- **quote**: "DÉTACHEMENTS DU PRINCE BAGRATION. RÉGIMENTS : 6e rég. de chasseurs à pied, Dragons de Twer, Hussards de Pawlograd, Cuirass. de l'impératrice, Hussards de Marioupol, Dragons de Saint-Pétersbourg. Fusiliers : Vieille-Ingrie, 8 escadr. de cosaques irrégul., d'Archangel, 2 comp. d'artillerie à cheval, de Pskoff, 2 comp. d'artillerie à pied." Translation: Prince Bagration's detachments. Regiments: 6th Jäger; Tver Dragoons; Pavlograd Hussars; the Empress's Cuirassiers; Mariupol Hussars; St Petersburg Dragoons; musketeers: Old Ingermanland, Arkhangelsk, Pskov; 8 squadrons of irregular Cossacks; 2 horse artillery companies; 2 foot artillery companies.
- **grade**: B (specialist)
- **label**: fact
- **notes**: answers the lead "Her Majesty's Life Cuirassiers with Bagration": MD lists "Cuirass. de l'impératrice" (the Empress's cuirassiers) in Bagration's detachments. Stutterheim (p. 64) gives Bagration 12 bn and 40 squadrons; MD's list (1 jäger + 3 musketeer regiments = 12 bn if three battalions each: an inference, battalion counts not printed) is consistent. Classes: jägers, musketeers, hussars (2), dragoons (2), cuirassiers (1), Cossacks, horse and foot artillery.

- **id**: al.rg.regiments.md
- **claim**: The reserve under the Grand Duke Constantine comprised the Chevalier Guards, the Horse Guards, the Guard Hussars, the Guard Cossacks, the Preobrazhensky, Semenovsky and Izmailovsky Guards (called grenadiers), the Life Grenadiers, and 1 artillery battalion.
- **value (source's words)**: "des chevaliers-gardes, de la garde à cheval, des hussards de la garde, Cosaques de la garde, Grenadiers de Préobragenski, Idem Séménowski, Idem Izmaïlowski, les grenadiers du corps, 1 bataillon d'artillerie."
- **source**: mikhailovsky1846, p. 226 (PDF p. 249)
- **quote**: "LA RÉSERVE SOUS LES ORDRES DU GRAND-DUC CONSTANTIN. RÉGIMENTS : des chevaliers-gardes, Grenadiers de Préobragenski, de la garde à cheval, Idem Séménowski, des hussards de la garde, Idem Izmaïlowski, Cosaques de la garde, les grenadiers du corps, 1 bataillon d'artillerie." Translation: The reserve under the Grand Duke Constantine. Regiments: the Chevalier Guards; Preobrazhensky Grenadiers [Guards]; the Horse Guards; Semenovsky; the Guard Hussars; Izmailovsky; the Guard Cossacks; the Life Grenadiers; 1 artillery battalion.
- **grade**: B (specialist); Horse Guards, Chevalier Guards, Guard Hussars and a Guard jäger battalion confirmed by Stutterheim pp. 78-79, 96-97 (A)
- **label**: fact
- **notes**: MD's list omits the Guard jäger battalion that Stutterheim (p. 79) puts in Blasowitz; Stutterheim gives the reserve 10 bn and 18 squadrons (pp. 52, 64). "Les grenadiers du corps" = the Life Grenadier regiment (inference from the French term; not a Guard regiment by name here). Classes for rg_inf: Guard infantry (3 regiments), Life Grenadiers, a Guard jäger battalion (Stutterheim); for rg_cav: Chevalier Guards, Horse Guards (both heavy), Guard Hussars, Guard Cossacks.

- **id**: al.uvarov.transfer.md
- **claim**: Mikhailovsky-Danilevsky says that on the evening before the battle the Elisabethgrad Hussars and the Kharkov and Chernigov Dragoons, previously of the V Column, were sent under Adjutant-General Uvarov to reinforce Bagration's left, so that the V Column was then 32 Austrian squadrons and the Grand Duke Constantine's uhlans.
- **value (source's words)**: "les régiments de hussards d'Elisabethgrad, et ceux de dragons de Kharkoff et de Tchernigoff, qui précédemment faisaient partie de la cinquième colonne"; "formée de 32 escadrons autrichiens et du régiment des lanciers du grand-duc Constantin"
- **source**: mikhailovsky1846, p. 233 (PDF p. 258)
- **quote**: "Afin de renforcer cette gauche de Bagration, on lui envoya le soir même, sous les ordres de l'aide de camp général Ouvaroff, les régiments de hussards d'Elisabethgrad, et ceux de dragons de Kharkoff et de Tchernigoff, qui précédemment faisaient partie de la cinquième colonne. La cinquième colonne du prince de Lichtenstein, formée de 32 escadrons autrichiens et du régiment des lanciers du grand-duc Constantin, devait conserver les communications entre le prince Bagration et les premières colonnes". Translation: To reinforce Bagration's left, there were sent to him that same evening, under Adjutant-General Uvarov, the Elisabethgrad hussar regiment and the Kharkov and Chernigov dragoon regiments, which previously belonged to the fifth column. Prince Liechtenstein's fifth column, of 32 Austrian squadrons and the Grand Duke Constantine's lancer regiment, was to keep the communications between Prince Bagration and the leading columns.
- **grade**: B (specialist)
- **label**: fact (as MD's account); it agrees with Stutterheim p. 79 ("dix escadrons sous le lieutenant-général Uwarow, sur la gauche du Prince Bagration") in placing Uvarov on Bagration's left, but Stutterheim has it done by Liechtenstein during the march on the morning, not the evening before
- **notes**: this explains the project's lich strengthNote ("orders of battle that count Uvarov's Russian horse within the column give up to 7,000"). For dressing: the lich formation's Russian figures are the uhlans (MD) or uhlans + Uvarov's hussars and dragoons (if Uvarov is counted in the column); Uvarov's three regiments may belong with bag. MD (p. 264, OCR only, not viewed) has "Ouvaroff, avec ses trois régiments, fit une charge générale" on Bagration's flank.

- **id**: al.kamensky.brigade.md
- **claim**: Mikhailovsky-Danilevsky gives Kamensky's brigade (Kamensky I) as the Fanagoria Grenadier and "Riajsk" regiments, marching behind Langeron's column, citing Langeron's reports to Kutuzov.
- **value (source's words)**: "la brigade du comte Kamenski Ier, formée des régiments de grenadiers de Phanagorie et Riajsk"; "Derrière Langeron marchait le comte de Kamenski, avec le régiment de Riajsk et celui des grenadiers de Phanagorie"
- **source**: mikhailovsky1846, pp. 241-242 and 251 (PDF pp. 268-269, 278); footnote on p. 251: "Rapports de Langeron à Koutouzoff, du 23 novembre (v. style)"
- **quote**: p. 241: "Le comte de Langeron quitta son bivouac à peu près en même temps que Doctouroff, la gauche en avant, précédé par le 8e régiment de chasseurs à pied, et soutenu par ceux de Wibourg, de Perm et de Koursk. Derrière Langeron marchait le comte de Kamenski, avec le régiment de Riajsk et celui [p. 242] des grenadiers de Phanagorie." p. 251: "il y trouva la brigade du comte Kamenski Ier, formée des régiments de grenadiers de Phanagorie et Riajsk. Cette brigade, en marchant à la suite de la colonne de Langeron, vers Sokolnitz, avait aperçu à la droite les Français qui escaladaient les hauteurs de Pratzen." Translation: Langeron left his bivouac at about the same time as Dokhturov, left in front, preceded by the 8th Jäger and supported by the Vyborg, Perm and Kursk regiments. Behind Langeron marched Count Kamensky with the Riajsk regiment and the Fanagoria grenadiers ... [Kutuzov] found there the brigade of Count Kamensky I, formed of the Fanagoria grenadier and Riajsk regiments. This brigade, marching behind Langeron's column toward Sokolnitz, had seen on its right the French climbing the Pratzen heights.
- **grade**: B (specialist, citing Langeron's report of 1805; the report itself not read)
- **label**: disputed (against Stutterheim p. 90, who has these two regiments sent to REINFORCE Kamensky's brigade; see Disagreements)
- **notes**: on both accounts the troops of the kamensky formation are one grenadier regiment (Fanagoria) and one musketeer regiment ("Riajsk", read as Ryazhsk: inference from the spelling). The project's strengthNote "the Ryazan and Fanagoria regiments" should, on this evidence, read Ryazhsk (not changed here: a data task). MD p. 251 also: "Le prince Wolkonski, saisissant alors un drapeau du régiment de Phanagorie" (a colour of the Fanagoria regiment present).

- **id**: al.dok.newingermanland.hessehomburg.md
- **claim**: Mikhailovsky-Danilevsky confirms the New Ingermanland regiment (I Column) and the Hesse-Homburg hussars at Telnitz.
- **value (source's words)**: "Le régiment de la Nouvelle-Ingrie"; "les hussards de Hesse-Hombourg"
- **source**: mikhailovsky1846, p. 241 (PDF p. 268)
- **quote**: "Le régiment de la Nouvelle-Ingrie, envoyé à leur secours, rencontra, dans l'épaisseur des broussailles et des ravins, les troupes qui se retiraient, et fut entraîné par elles. [...] mais ils furent repoussés par les hussards de Hesse-Hombourg, et le comte de Buxhoewden put s'emparer de nouveau de Tellnitz et s'y fixer (1)." Footnote (1): "Rapport de Buxhoewden à Koutouzoff." Translation: The New Ingermanland regiment, sent to their help, met the retreating troops in the thick brush and ravines and was carried away by them ... but they were repulsed by the Hesse-Homburg hussars, and Count Buxhowden could take Telnitz again and hold it.
- **grade**: B (specialist, citing Buxhowden's report); agrees with Stutterheim pp. 69, 73 (A)
- **label**: fact
- **notes**: supports Stutterheim's naming of Hesse-Homburg hussars with Kienmayer against MD's own list (p. 224: "2 faibles régiments de cavalerie hongroise"). Hesse-Homburg hussars are themselves hussars (Hungarian-type cavalry), so "cavalerie hongroise" may mean hussars generally (inference).

### Allied and French: the 1806 "Materialien" (German edition of Stutterheim with additions)

- **id**: al.col4.austrians.materialien
- **claim**: The Austrian infantry of the IV Column on the march of 27 November was 20 battalions: 2 of the 1st Szekler, 2 of the 2nd Szekler, 1 Brod (Grenz); 6 Salzburg; and 1 each of Auersperg, Kaunitz, Lindenau, Kerpen, Beaulieu, Württemberg, Reuss-Greiz, Czartoryski and Kaiser; all newly raised and very weak (Mack's new formation) except Salzburg and the Grenz troops.
- **value (source's words)**: "2 Bataillons 1stes Regiment Szeckler / 2 — 2tes Regiment Szeckler. / 1 — Brooder / 6 — Salzburg / 1 — Auersperg / 1 — Kaunitz / 1 Bataillon Lindenau / 1 — Kerpen / 1 — Beaulieu / 1 — Wirtemberg / 1 — Reuß-Graitz / 1 — Czartorisky / 1 — Kaiser"
- **source**: materialien1806, pp. 22-23, footnote * (leaves n31-n32), https://archive.org/details/10807964bsb/page/n31
- **quote**: "*) Die östreichischen Bataillons, welche einen Theil dieser Colonne ausmachten, waren nach der neuen Formation des Herrn von Mack, der aus den drei Bataillons eines Regiments sechse machte, sehr schwach, und wie bereits gemeldet, neu ausgehoben, ausgenommen das Regiment Salzburg und die Gränztruppen. Dieses Infanterie-Corps bestand aus folgenden Bataillons: 2 Bataillons 1stes Regiment Szeckler / 2 — 2tes Regiment Szeckler. / 1 — Brooder / 6 — Salzburg / 1 — Auersperg / 1 — Kaunitz [p. 23] 1 Bataillon Lindenau / 1 — Kerpen / 1 — Beaulieu / 1 — Wirtemberg / 1 — Reuß-Graitz / 1 — Czartorisky / 1 — Kaiser". Translation: The Austrian battalions that formed part of this [the fourth] column were, by Mack's new formation which made six battalions out of a regiment's three, very weak and, as already said, newly raised, except the Salzburg regiment and the border troops. This infantry corps consisted of the following battalions: [as listed].
- **grade**: A (printed 1806; a contemporary list; on 27 Nov, five days before)
- **label**: fact (for 27 Nov)
- **notes**: DERIVED for 2 Dec: Stutterheim (pp. 50, 53, 63) moves five Grenz battalions to Kienmayer on 1 Dec and leaves 15 Austrian battalions in the IV Column. Removing the five Grenz battalions here (1st Szekler 2, 2nd Szekler 2, Brod 1 = 5) leaves exactly 15: Salzburg 6 and one battalion each of Auersperg, Kaunitz, Lindenau, Kerpen, Beaulieu, Württemberg, Reuss-Greiz, Czartoryski and Kaiser. This matches the project's kienmayer note (Broder Nr. 7, 1st and 2nd Szekler Nr. 14 and 15) and Stutterheim's naming of Salzburg, Auersperg, Württemberg and Reuss-Greiz in the IV Column (A). Label: derived. The brigade split (Jurczek / Rottermund) is NOT given. Classes: Austrian German line infantry (15 bn, of which 9 new sixth battalions per the note); Grenz (5 bn with Kienmayer).

- **id**: al.russian.regiments.materialien
- **claim**: The 1806 Materialien lists the Russian regiments of the I-IV Columns: I (Dokhturov) 2 sq Denisov Cossacks, 5th Jäger, a pioneer company, New Ingermanland, Yaroslavl, Vladimir, "Gr. Sievers", Bryansk, Vyatka, Moscow musketeers, Kiev grenadiers, 2 artillery companies; II (Langeron) 2 1/2 sq Denisov Cossacks, 8th Jäger, a pioneer company, the Fanagoria grenadier regiment, a "Fanagorsk" musketeer regiment, Ryazan ("Rjäsan"), Kursk, Perm, Vyborg musketeers; III (Przybyszewski) 7th Jäger, a pioneer company, Galich, Butyrsk, Podolia, Narva, Azov musketeers; IV (Kollowrat) a pioneer company, Smolensk, Apsheron, Novgorod musketeers, the Little Russia grenadiers, an artillery company, then the Austrian infantry.
- **value (source's words)**: p. 98: "2 Escadrons Denisoff Kosaken / Das 5te Jägerregiment. / 1 Compagnie Pionniers von Kusewitz. / 1 Regiment Musketier von Neu-Ingermannland / 1 Regim. Musketier von Jaroslaw / 1 Regim. Musk. von Wlodimir / 2 Compagnien Artillerie / 1 Regim. Musk. von Gr. Sievers / 1 Regim. Musk. von Brjansk / 1 Regim. Musk. von Wjätka / 1 Regim. Musk. von Moskau / 1 Regim. Grenadier von Kiew"; p. 99: "Das 8te Jägerregiment / 1 Compagnie Pionniers vom Reg. Berg / 1 Grenadier-Regiment von Fanagorsk / 1 Regim. Musket. von Fanagorsk / 1 Regim. Musket. von Rjäsan / 1 Regim. Musket. von Kursk / 1 Regim. Musket. von Perm / 1 Regim. Musket. von Wiburg"; "Das 7te Jäger-Regiment. [...] Halitsch / Butirsk / Podolien / Narwa / Asow"; p. 100: "1 Regim. Musket. von Smolensk / 1 Regim. Musket. von Apscheron / 1 Regim. Musket. von Nowgorod / Das Malorossische Grenadier-Regiment / 1 Compagnie Artillerie von Kadreozow / Dann die östreichische Infanterie, wie solche oben S. 22 f. in der Note angegeben ist."
- **source**: materialien1806, Zusatz 4, pp. 98-100 (leaves n107-n109), https://archive.org/details/10807964bsb/page/n108
- **quote**: p. 98: "4. Folgendes Verzeichniß der bei jeder Colonne befindlichen russischen Regimenter, Compagnien und Escadrons wird hier an seinem Orte stehen. Erste Colonne, unter General-Lieutenant Dochtorow. 2 Escadrons Denisoff Kosaken / Das 5te Jägerregiment. [...]" p. 99: "Zweite Colonne, unter General-Lieutenant Graf Langeron. 2 1/2 Escadrons Denisow Kosaken, aus der ehemaligen Colonne des Gen. Lieutnant Miloradowitsch. Das 8te Jägerregiment / 1 Compagnie Pionniers vom Reg. Berg / 1 Grenadier-Regiment von Fanagorsk / 1 Regim. Musket. von Fanagorsk / 1 Regim. Musket. von Rjäsan / 1 Regim. Musket. von Kursk / 1 Regim. Musket. von Perm / 1 Regim. Musket. von Wiburg". Translation: The following list of the Russian regiments, companies and squadrons with each column belongs here. First Column under Lt-Gen Dokhturov: 2 squadrons of Denisov's Cossacks; the 5th Jäger regiment; [...] Second Column under Lt-Gen Count Langeron: 2 1/2 squadrons of Denisov's Cossacks from the former column of Lt-Gen Miloradovich; the 8th Jäger regiment; 1 pioneer company of the Berg regiment; the Fanagoria grenadier regiment; 1 musketeer regiment "of Fanagorsk"; the Ryazan musketeers; Kursk; Perm; Vyborg. (Third and Fourth Columns as the claim.)
- **grade**: A for the existence of this 1806 list; its accuracy for 2 Dec is B (the editor does not say where the list comes from)
- **label**: disputed for two entries (see below); fact otherwise, agreeing with mikhailovsky1846 regiment for regiment
- **notes**: (1) "Rjäsan" (Ryazan) here vs MD 1846 "Riajsk" (Ryazhsk): a genuine disagreement on the project's "Ryazan?" (Stutterheim's French "Rhiasky" and the Materialien's own translation of it at p. ~113, OCR "Musquetierregiment Rhiäsky", do not settle it). (2) The II Column has both a Fanagoria grenadier and a "Fanagorsk" musketeer regiment; MD has only the grenadiers: probably a printing error, NOT resolved. (3) The I Column has an extra regiment "Gr. Sievers" (named for its chef, a usage of the time: inference) not in MD's list, and MD's I Column has a battalion of the 7th Jäger not here. (4) The list gives no V Column, Bagration or Guard regiments.

- **id**: fr.santon.unit.materialien
- **claim**: The 1806 editor corrects Stutterheim: Suchet's division leaned on the dominant height between Lesch and Kowalowitz, fortified on 1 December and armed with 18 guns, covered by the 17th light infantry regiment.
- **value (source's words)**: "Das 17te Regiment leichter Infanterie deckte dieselbe."
- **source**: materialien1806, Zusatz 6, pp. 100-101 (leaves n109-n110); the editor cites "Campagnes de la grande Armée et de l'Armée d'Italie en l'an XIV. Paris, Librairie économique, 1806. 8. p. 297" and Stutterheim "p. 90"
- **quote**: "6. Die Division Suchet stützte sich an die dominirende Höhe zwischen Lesch und Kowalowitz oder bestimmter zwischen dem Leschner Wirthshause und Dwaroschna nördlich von der Brünner Chaussee nach Ollmütz. Napoleon hatte diese treffliche Position am 1sten Decbr. befestigen und mit 18 Kanonen [p. 101] besetzen lassen. Das 17te Regiment leichter Infanterie deckte dieselbe." Translation: Suchet's division leaned on the dominant height between Lesch and Kowalowitz, more exactly between the Lesch inn and Dwaroschna, north of the Brünn-Olmütz road. Napoleon had this excellent position fortified on 1 December and armed with 18 guns. The 17th light infantry regiment covered it.
- **grade**: A (printed 1806, citing a French 1806 compilation)
- **label**: fact (17e légère); disputed against Stutterheim's "vingt septième" (see Disagreements)
- **notes**: supports the project's santon (17e Légère, 18 guns). The location words ("between Lesch and Kowalowitz") are the editor's and Stutterheim's; whether that is the hill the project calls the Santon is a geographic question outside this topic.

### Allied: the Austrian order of battle in Schönhals (1873/1874), with battalions, squadrons and men per regiment

General note: Schönhals's table ("Ordre de Bataille des verbündeten Heeres in der Schlacht von Austerlitz und Stärke der
Colonnen") is the only source read in this session that gives brigades AND battalion/squadron counts AND men per regiment for every
Allied column. Columns: Bataillone / Compagnien / Escadrone / Mann / Pferde. Grade B (Austrian specialist work, 1873-74; it does
not cite its source on the page). Russian names are printed in German transliteration, some garbled; they are quoted as printed.
Read from PDF pp. 182-183 at 300-500 dpi.

- **id**: al.kienmayer.oob.schoenhals
- **claim**: Kienmayer's advance guard: GM Carneville's brigade with 2 companies of Wiener Jäger (300), 1 bn Broder infantry (500), 2 bn 2nd Szekler (1,300), 2 bn 1st Szekler (1,300); GM Stutterheim's with O'Reilly chevau-légers 8 sq (900) and Merveldt uhlans 1/4 sq (40); GM Count Nostitz's with Schwarzenberg uhlans 1/2 sq (100) and Hessen-Homburg hussars 8 sq (300); GM Prince Moritz Liechtenstein's with Szekler hussars 6 sq (600), 2 Austrian cavalry batteries, Sysoev ("Sesajew") and Melentiev Cossacks 5 sq each (500 each); total 5 bn, 2 coys, 32 3/4 sq, 6,340 men.
- **value (source's words)**: "Wiener Jäger — 2 — 300"; "Broder-Infanterie 1 — — 500"; "2. Szekler 2 — — 1300"; "1. Szekler 2 — — 1300"; "A'Reilly-Chevaux legers — — 8 900 900"; "Merweldt-Uhlanen — — 1/4 40 40"; "Schwarzenberg-Uhlanen — — 1/2 100 100"; "Hessen-Homburg-Huszaren — — 8 300 300"; "Szekler-Huszaren — — 6 600 600"; "2 österr. Cavallerie-Batterien"; "Sesajew-Kosaken — — 5 500 500"; "Melentiew-Kosaken — — 5 500 500"; "Summa 5 2 32 3/4 6340 2440"
- **source**: schoenhals1873, p. 177 (PDF p. 182)
- **quote**: "Avantgarde | FML. Baron Kienmayer | GM. Carneville { Wiener Jäger ... — 2 — 300 — / Broder-Infanterie ... 1 — — 500 — / 2. Szekler ... 2 — — 1300 — / 1. Szekler ... 2 — — 1300 — / GM. Stutterheim { A'Reilly-Chevaux legers ... — — 8 900 900 / Merweldt-Uhlanen ... — — 1/4 40 40 / GM. Graf Nostiz { Schwarzenberg-Uhlanen ... — — 1/2 100 100 / Hessen-Homburg-Huszaren ... — — 8 300 300 / GM. Fürst Moriz Liechtenstein { Szekler-Huszaren ... — — 6 600 600 / 2 österr. Cavallerie-Batterien / Sesajew-Kosaken ... — — 5 500 500 / Melentiew-Kosaken ... — — 5 500 500 / Summa . 5 2 32 3/4 6340 2440". Translation: advance guard, FML Baron Kienmayer; brigades and regiments as the claim; total 5 battalions, 2 companies, 32 3/4 squadrons, 6,340 men, 2,440 horses.
- **grade**: B (specialist)
- **label**: fact (as Schönhals's table); the Hessen-Homburg squadron figure is printed in a glyph that can be read 3 or 8; the column total 32 3/4 requires 8 (derived)
- **notes**: confirms the project's kienmayer Grenz list (Broder, 1st and 2nd Szekler) and adds classes the project does not list: Austrian Jäger (2 coys of Wiener Jäger), uhlans (fractions of Merveldt and Schwarzenberg). The recapitulation on p. 178 gives 2,940 horses for the same line where p. 177 sums 2,440 (internal discrepancy, as printed). The project's "3,440 infantry and 3,440 horse" is not this table's split (infantry 3,400 incl. Jäger; men 6,340 in all).

- **id**: al.dok.oob.schoenhals
- **claim**: I Column (Dokhturov): GM Levis's brigade with the 7th Jäger (3 bn, 1,300), New Ingermanland (3 bn, 2,000), Yaroslavl (3 bn, 2,000); GM Urusov's with Vladimir, Bryansk, Vyatka (3 bn, 2,000 each), Moscow (3 bn, 1,400), Kiev Grenadiers (3 bn, 1,000) and heavy artillery; total 22 bn, 13,730 men.
- **value (source's words)**: "7. Jäger-Regiment 3 — — 1300"; "Neu-Ingermannland 3 2000"; "Jaroslaw 3 2000"; "Wladimirz 3 2000"; "Brainsky 3 2000"; "Wiatzky 3 2000"; "Moschovsky 3 1400"; "Kiow-Grenadier 3 1000"; "Schwere Artillerie"; "Summa 22 — — 13730"
- **source**: schoenhals1873, p. 177 (PDF p. 182)
- **quote**: "1. | General der Infanterie Graf Buxhövden | GL. Doctorov | GM. Levis { 7. Jäger-Regiment ... 3 — — 1300 / Neu-Ingermannland ... 3 2000 / Jaroslaw ... 3 2000 / GM. Urasow { Wladimirz ... 3 2000 / Brainsky ... 3 2000 / Wiatzky ... 3 2000 / Moschovsky ... 3 1400 / Kiow-Grenadier ... 3 1000 / Schwere Artillerie / Summa . 22 — — 13730". Translation: as the claim.
- **grade**: B (specialist)
- **label**: disputed in detail: the jäger regiment (7th here; MD has the 5th and one battalion of the 7th; the Materialien the 5th); the total (13,730 on p. 177, 12,730 in the recapitulation on p. 178)
- **notes**: 8 regiments x 3 bn = 24 would exceed the printed 22: the sum is printed 22 (not resolved). Cossacks: none listed with the I Column here (MD and Materialien: 2 squadrons). Classes: jägers 3 bn; musketeers 15 bn; grenadiers 3 bn.

- **id**: al.lang.oob.schoenhals
- **claim**: II Column (Langeron): GM Olsufiev's ("Alsusiew") brigade with the 8th Jäger (2 bn, 670), Vyborg (3 bn, 2,000), pioneers (1 coy, 170), Perm (3 bn, 2,000); GM Kamensky's ("Kamerskay" as printed) with Kursk, "Riasky" and Fanagoria ("Tanagorisky" as printed), 3 bn and 2,000 each; total 17 bn, 1 coy, 10,840 men.
- **value (source's words)**: "8. Jäger-Regiment 2 — — 670"; "Wiborskoy 3 2000"; "Pionniere — 1 — 170"; "Permskoy 3 2000"; "Kurskoy 3 2000"; "Riasky 3 2000"; "Tanagorisky 3 2000"; "Summa 17 1 — 10840"
- **source**: schoenhals1873, p. 177 (PDF p. 182)
- **quote**: "2. | GL. Langeron | GM. Alsusiew { 8. Jäger-Regiment ... 2 — — 670 / Wiborskoy ... 3 2000 / Pionniere ... — 1 — 170 / Permskoy ... 3 2000 / GM. Kamerskay { Kurskoy ... 3 2000 / Riasky ... 3 2000 / Tanagorisky ... 3 2000 / Summa . 17 1 — 10840". Translation: as the claim.
- **grade**: B (specialist)
- **label**: disputed (Kamensky's brigade = Kursk + "Riasky" + Fanagoria here; MD = Fanagoria + "Riajsk"; Stutterheim = Fanagoria and "Rhiasky" sent to reinforce Kamensky)
- **notes**: the spelling "Riasky" again does not settle Ryazan vs Ryazhsk. The project's kamensky strength (4,000-4,500 for two regiments of about 2,000) matches two of Schönhals's 2,000-man regiments, not three.

- **id**: al.prz.oob.schoenhals
- **claim**: III Column (Przybyszewski): GM Müller's brigade with Denisov ("Demisod") Cossacks 5 sq (500), a jäger regiment printed "8." (1 bn, 1,300), pioneers (1 coy, 170); GM Strik's ("Strück") with Galich (3 bn, 2,000), Butyrsk ("Budiersky", 3 bn, 1,000), Podolia (3 bn, 800), Narva (3 bn, 2,000), Azov (3 bn, 800); total 16 bn, 1 coy, 5 sq, 8,570 men.
- **value (source's words)**: "Demisod-Kosaken — — 5 500 500"; "8. Jäger-Regiment 1 — — 1300"; "Pionniere — 1 — 170"; "Gallizi 3 2000"; "Budiersky 3 1000"; "Podolsky 3 800"; "Norwa 3 2000"; "Asow 3 800"; "Summa 16 1 5 8570 500"
- **source**: schoenhals1873, p. 177 (PDF p. 182)
- **quote**: "3. | GL. Przybyczewsky | GM. Müller { Demisod-Kosaken ... — — 5 500 500 / 8. Jäger-Regiment ... 1 — — 1300 / Pionniere ... — 1 — 170 / GM. Strück { Gallizi ... 3 2000 / Budiersky ... 3 1000 / Podolsky ... 3 800 / Norwa ... 3 2000 / Asow ... 3 800 / Summa . 16 1 5 8570 500". Translation: as the claim.
- **grade**: B (specialist)
- **label**: disputed in detail: the jäger unit is printed "8." here (the 8th Jäger is also in the II Column on the same page; MD and Materialien give the 7th Jäger to the III Column); the recapitulation gives 18 bn for the column where p. 177 sums 16
- **notes**: Classes: Cossacks 5 sq (not in MD's III Column list), jägers, musketeers 15 bn. The project's prz strengthNote (5,450 to 9,500) brackets 8,570.

- **id**: al.col4.oob.schoenhals
- **claim**: IV Column (Kollowrat). Russian part under Miloradovich: GM Wodniansky with Erzherzog Johann dragoons 2 sq (125); GM Berg's brigade with Novgorod ("Novogrolsky", 3 bn, 2,000), pioneers (2 coys, 340), Little Russia Grenadiers ("Malorosizky", 3 bn, 1,500); GM Repninsky's with Apsheron (3 bn, 1,500), Smolensk ("Sonolenskoy", no figures printed) and the artillery reserve; total 12 bn, 2 coys, 2 sq, 6,965. Austrian part under Kollowrat: GM Rottermund's brigade with Salzburg (6 bn, 6,000), Kaunitz (1 bn, 900), Auersperg (1 bn, 600); GM Jurczek's ("Jurschek") with Kaiser (1 bn, 100), Czartoryski (1, 600), Reuss-Greiz (1, 600), Württemberg (1, 500), Beaulieu (1, 500), Kerpen (1, 700), Lindenau (1, 400) and pioneers with 2 bridges (3 coys, 350); total 15 bn, 3 coys, 9,150. Whole column 27 bn, 5 coys, 2 sq, 16,118.
- **value (source's words)**: "GM. Wodniansky Erzherzog Johann-Dragoner — — 2 125 125"; "Novogrolsky 3 2000"; "Pionniere — 2 — 340"; "Malorosizky 3 1500"; "Apscheronsky 3 1500"; "Sonolenskoy"; "Artillerie-Reserve"; "Summa 12 2 2 6965 125"; "GM. Rottermund { Salzburg 6 6000 / Kaunitz 1 900 / Auersperg 1 600"; "GM. Jurschek { Kaiser 1 100 / Czartorisky 1 600 / Reuss-Greutz 1 600 / Württemberg 1 500 / Beaulieu 1 500 / Kerpen 1 700 / Lindenau 1 400 / Pionniere mit 2 Laufbrücken — — 3 350"; "Summa 15 3 — 9150"; "Summa der ganzen Colonne 27 5 2 16118 125"
- **source**: schoenhals1873, p. 177 (PDF p. 182)
- **quote**: "4. | Commandirender en Chef General Graf Kutusow | FML. Graf Collowrath | GL. Miloradovitz | GM. Wodniansky Erzherzog Johann-Dragoner ... — — 2 125 125 / GM. Berg { Novogrolsky ... 3 2000 / Pionniere ... — 2 — 340 / Malorosizky ... 3 1500 / GM. Repninsky { Apscheronsky ... 3 1500 / Sonolenskoy / Artillerie-Reserve / Summa . 12 2 2 6965 125 / FML. Graf Collowrath | GM. Rottermund { Salzburg ... 6 6000 / Kaunitz ... 1 900 / Auersperg ... 1 600 / GM. Jurschek { Kaiser ... 1 100 / Czartorisky ... 1 600 / Reuss-Greutz ... 1 600 / Württemberg ... 1 500 / Beaulieu ... 1 500 / Kerpen ... 1 700 / Lindenau ... 1 400 / Pionniere mit 2 Laufbrücken ... — — 3 350 / Summa . 15 3 — 9150 / Summa der ganzen Colonne . 27 5 2 16118 125". Translation: as the claim. (The "3" for the pioneers is printed in the squadron column; the Austrian sum line counts it under companies.)
- **grade**: B (specialist); the Austrian regiments agree one for one with materialien1806 (A, 27 Nov) less the Grenz, and Salzburg, Auersperg, Württemberg, Reuss-Greiz and the Erzherzog Johann dragoons with Stutterheim (A)
- **label**: fact
- **notes**: answers kollo's brigades: Rottermund = Salzburg (6 bn), Kaunitz, Auersperg (8 bn, 7,500); Jurczek = seven single battalions (Kaiser, Czartoryski, Reuss-Greiz, Württemberg, Beaulieu, Kerpen, Lindenau; 3,400) plus pioneers. The project's 9,100 for the Austrian part matches Schönhals's 9,150. Russian part: 12 bn (Stutterheim: 12; project: 14) and 6,965 men (project: 4,800 derived from Duffy/Smith; not resolved). Classes: Austrian line infantry (15 bn; Salzburg is the only full regiment, the rest single, mostly new sixth, battalions per materialien1806), Austrian pioneers, Austrian dragoons (2 sq); Russian musketeers, grenadiers.

- **id**: al.lich.oob.schoenhals
- **claim**: The cavalry corps or V Column (Liechtenstein): under FML Prince Hohenlohe, GM Caramelli's and GM Weber's brigades with the Nassau cuirassiers (8 sq, 300), Lorraine cuirassiers (8 sq, 300) and Kaiser cuirassiers (8 sq, 500): 24 sq, 1,100. Russian: under Lt-Gen Essen, GM Shepelev's ("Czepelow") brigade with Gordeev's ("Gardejew") Cossacks (5 sq), Grand Duke Constantine Uhlans (10 sq, 1,000), St Petersburg Dragoons (5 sq), Life Cuirassiers ("Leib-Cürassier", 5 sq); under Lt-Gen Uvarov, GM Penitsky's ("Penitzky") with Kharkov Dragoons (5 sq), Chernigov Dragoons (5 sq), horse artillery and Elisabethgrad Hussars (10 sq); 45 sq, 4,500. Corps total 69 sq, 5,600.
- **value (source's words)**: "Nassau-Cürassier — — 8 300 300"; "Lothringen-Cürassier — — 8 300 300"; "Kaiser-Cürassier — — 8 500 500"; "Summa 24 1100 1100"; "Gardejew-Kosaken 5 500"; "Grossfürst Constantin-Uhlanen 10 1000"; "Petersburg-Dragoner 5 500"; "Leib-Cürassier 5 500"; "Charchow-Dragoner 5 500"; "Czernikow-Dragoner 5 500"; "Reitende Artillerie"; "Elisabethgrad-Huszaren 10 1000"; "Summa 45 4500 4500"; "Summa des Cavallerie-Corps 69 5600 5600"
- **source**: schoenhals1873, p. 178 (PDF p. 183)
- **quote**: "Cavallerie-Corps oder 5. Colonne | FML. Fürst Liechtenstein | FML. Fürst Hohenlohe | GM. Caramelly { GM. Weber | Nassau-Cürassier ... — — 8 300 300 / Lothringen-Cürassier ... — — 8 300 300 / Kaiser-Cürassier ... — — 8 500 500 / Summa . — — 24 1100 1100 / GL. Essen | GM. Czepelow { Gardejew-Kosaken ... 5 500 500 / Grossfürst Constantin-Uhlanen ... 10 1000 1000 / Petersburg-Dragoner ... 5 500 500 / Leib-Cürassier ... 5 500 500 / GL. Uwarov | GM. Penitzky { Charchow-Dragoner ... 5 500 500 / Czernikow-Dragoner ... 5 500 500 / Reitende Artillerie / Elisabethgrad-Huszaren ... 10 1000 1000 / Summa . — — 45 4500 4500 / Summa des Cavallerie-Corps . — — 69 5600 5600". Translation: as the claim.
- **grade**: B (specialist); Lorraine and Nassau confirmed by Stutterheim p. 94 (A); Caramelli and Weber as V Column generals by Stutterheim p. 34 (A, 27 Nov)
- **label**: fact for the Austrian cuirassiers; disputed for the Life Cuirassiers and St Petersburg Dragoons (MD p. 226 puts "Cuirass. de l'impératrice" and "Dragons de Saint-Pétersbourg" with Bagration)
- **notes**: answers the leads: (1) the project's "Austrian cuirassiers of Caramelli and Weber (about 1,100)" matches: Nassau, Lothringen, Kaiser, 24 sq, 1,100 men. (2) The Russian brigades are those of GM Shepelev (under Essen) and GM Penitsky (under Uvarov): NO "Gladkov" appears; Stutterheim's 27 Nov list also has "Piritzky, russe" (= Penitsky, inference from the spelling). The project's "Gladkov" is NOT FOUND in any source read. (3) "Her Majesty's Life Cuirassiers": Schönhals puts "Leib-Cürassier" (5 sq) in the V Column under Essen; MD puts the Empress's cuirassiers with Bagration (see Disagreements). Classes: Austrian cuirassiers (3 regiments), Russian uhlans, dragoons (3 regiments), cuirassiers (1), hussars (1), Cossacks (1), horse artillery.

- **id**: al.bag.oob.schoenhals
- **claim**: Bagration's corps on the right wing: Isaev, Kuteinikov(?) ("Kuselew") and Kharitonov(?) ("Charsumkow") Cossacks 5 sq each; 6th Jäger (3 bn, 800) and 5th Jäger (3 bn, 1,300) (generals Dolgoruky, Ulanius and Chaplitz with this corps); Pavlograd Hussars (10 sq), Arkhangelsk (3 bn, 2,000), Old Ingermanland (3 bn, 2,400), Pskov (3 bn, 2,000), Mariupol Hussars (10 sq), horse artillery, Tver Dragoons (5 sq), Malakhov Cossacks (5 sq); "their distribution in the order of battle is not known"; total 15 bn, 45 sq, 13,000 men.
- **value (source's words)**: "Isajew-Kosaken 5 500"; "Kuselew-Kosaken 5 500"; "Charsumkow-Kosaken 5 500"; "6. Jäger-Regiment 3 800"; "5. Jäger-Regiment 3 1300"; "Paulogradsky-Huszaren 10 1000"; "Archangelokrodsky 3 2000"; "Stary Ingermandlansky 3 2400"; "Pskowsky 3 2000"; "Marinepolsky-Huszaren 10 1000"; "Reitende Artillerie"; "Twusky-Dragoner 5 500"; "Malachow-Kosaken 5 500"; "Ihre Eintheilung in der Ordre de Bataille ist nicht bekannt"; "Summa 15 — 45 13000 4500"
- **source**: schoenhals1873, p. 178 (PDF p. 183)
- **quote**: "Corps am rechten Flügel | GL. Fürst Bagration | Bei diesem Corps befanden sich die Generäle Dolgoruky, Ulanius und Czaplitz { Isajew-Kosaken ... 5 500 500 / Kuselew-Kosaken ... 5 500 500 / Charsumkow-Kosaken ... 5 500 500 / 6. Jäger-Regiment ... 3 — — 800 / 5. Jäger-Regiment ... 3 — — 1300 / Ihre Eintheilung in der Ordre de Bataille ist nicht bekannt { Paulogradsky-Huszaren ... 10 1000 1000 / Archangelokrodsky ... 3 2000 / Stary Ingermandlansky ... 3 2400 / Pskowsky ... 3 2000 / Marinepolsky-Huszaren ... 10 1000 1000 / Reitende Artillerie / Twusky-Dragoner ... 5 500 500 / Malachow-Kosaken ... 5 500 500 / Summa . 15 — 45 13000 4500". Translation: as the claim; "their distribution in the order of battle is not known".
- **grade**: B (specialist)
- **label**: disputed (the 5th Jäger: here with Bagration; MD and the Materialien put it in the I Column. The Empress's cuirassiers and St Petersburg dragoons: MD with Bagration, Schönhals in the V Column)
- **notes**: the Cossack names are printed garbled; the Russian identifications in brackets with "(?)" are NOT established and must not be used as data. The project's bag strength (13,000-14,000) matches 13,000; Stutterheim gives 12 bn and 40 sq; Schönhals 15 bn and 45 sq. Classes: jägers (2 regiments), musketeers (3), hussars (2), dragoons (1 here), Cossacks (4 regiments), horse artillery.

- **id**: al.rg.oob.schoenhals
- **claim**: The Imperial Russian Guard (Grand Duke Constantine; GL Kologrivov ("Kollowrizow"); GM Jankovich ("Jancowitz")), "in battle order in the morning": Life Cossacks (2 sq, 300), Life Jägers (1 bn, 530), Life Hussars (5 sq, 800), Semenovsky (2 bn, 1,400), Preobrazhensky (2 bn, 1,500), Chevalier Guards (5 sq, 800), Life Guard Horse (5 sq, 1,000), pioneers (1 coy, 100), Izmailovsky (2 bn, 1,000), Life Grenadiers (3 bn, 2,300); total 10 bn, 1 coy, 17 sq.
- **value (source's words)**: "Leib-Kosaken — — 2 300 300"; "Leib-Jäger 1 — — 530"; "Leib-Huszaren — — 5 800 800"; "Semunorvsky 2 1400"; "Preobrajschensky 2 1500"; "Chevaliers-Garde — — 5 800 800"; "Leib-Garde zu Pferd — — 5 1000 1000"; "Pionniere — 1 — 100"; "Ismaelovsky 2 1000"; "Leib-Grenadier 3 2300"; "Summa der Garden 10 1 17 4380 2900"
- **source**: schoenhals1873, p. 178 (PDF p. 183)
- **quote**: "K. russische Garden | Grossfürst Constantin | Waren am Morgen in Schlachtordnung | GL. Kollowrizow | GM. Jancowitz { Leib-Kosaken ... — — 2 300 300 / Leib-Jäger ... 1 — — 530 / Leib-Huszaren ... — — 5 800 800 / Semunorvsky ... 2 1400 / Preobrajschensky ... 2 1500 / Chevaliers-Garde ... — — 5 800 800 / Leib-Garde zu Pferd ... — — 5 1000 1000 / Pionniere ... — 1 — 100 / Ismaelovsky ... 2 1000 / Leib-Grenadier ... 3 2300 / Summa der Garden . 10 1 17 4380 2900". Translation: as the claim.
- **grade**: B (specialist); the Horse Guards, Chevalier Guards, Guard Hussars and Guard jäger battalion are confirmed by Stutterheim (A)
- **label**: fact (regiments); the total men is printed 4,380 on the line and 9,380 in the recapitulation (the regiment figures sum to 9,730: derived; none of the three equals another)
- **notes**: supports the project's rg_cav commander "Kologrivov" (as "GL. Kollowrizow"): a second source for that name, as the data's strengthNote asks. Classes for rg_inf: Guard infantry 6 bn (Preobrazhensky, Semenovsky, Izmailovsky, 2 each), Life Grenadiers 3 bn, Life Jägers 1 bn; rg_cav: Chevalier Guards, Horse Guards (5 sq each), Life Hussars 5 sq, Life Cossacks 2 sq. Infantry by Schönhals's figures: 6,730 (derived sum: 530+1,400+1,500+1,000+2,300 = 6,730, exactly the project's Duffy/Smith 6,730); horse: 300+800+800+1,000 = 2,900 (the project: 3,700).

- **id**: al.recap.schoenhals
- **claim**: Schönhals's recapitulation gives: Kienmayer 5 bn, 2 coys, 32 3/4 sq, 6,340; I Column 22 bn, 12,730; II 17 bn, 1 coy, 10,840; III 18 bn, 1 coy, 5 sq, 8,570; IV 27 bn, 5 coys, 2 sq, 16,115; V 69 sq, 5,600; Bagration 15 bn, 45 sq, 13,000; Guard 10 bn, 1 coy, 17 sq, 9,380; total 114 bn, 10 coys, 170 3/4 sq, 82,575 men, 16,565 horses; three line companies and one squadron of horse artillery arrived only after the battle.
- **value (source's words)**: "Summa 114 10 170 3/4 82575 16565"; "Anmerkung. Drei Compagnien Linien und eine Escadron reitender Artillerie folgten noch nach, und trafen erst nach entschiedener Schlacht bei der Armee ein."
- **source**: schoenhals1873, p. 178 (PDF p. 183)
- **quote**: "Recapitulation. Colonnen und Corps. Avantgarde des FML. Baron Kienmayer 5 2 32 3/4 6340 2940 / 1. Colonne 22 — — 12730 — / 2. Colonne 17 1 — 10840 — / 3. Colonne 18 1 5 8570 500 / 4. Colonne 27 5 2 16115 125 / 5. Colonne — — 69 5600 5600 / Corps des Fürsten Bagration 15 — 45 13000 4500 / Kaiserl. russ. Garden 10 1 17 9380 2900 / Summa . 114 10 170 3/4 82575 16565. Anmerkung. Drei Compagnien Linien und eine Escadron reitender Artillerie folgten noch nach, und trafen erst nach entschiedener Schlacht bei der Armee ein." Translation: as the claim; "Note: three line companies and one squadron of horse artillery followed and reached the army only after the battle was decided."
- **grade**: B (specialist)
- **label**: fact (as printed); internal inconsistencies noted (I Column 13,730 vs 12,730; III Column 16 vs 18 bn; IV 16,118 vs 16,115; Guard 4,380 vs 9,380; Kienmayer horses 2,440 vs 2,940)
- **notes**: total 82,575 lies inside the project's "73,000-89,000" range for the Allies.

### French: Saint-Hilaire's division on 2 December (Thiébault) and IV Corps artillery

- **id**: fr.sthilaire.brigades.thiebault
- **claim**: On the morning of 2 December Saint-Hilaire sent Morand (the division's advance guard) onto the Pratzen plateau, ordered Varé's brigade to follow Vandamme's movement and take his orders, and sent Thiébault's brigade, the 14e de ligne (colonel Mazas, two battalions) and the 36e de ligne (two battalions), against Pratzen village.
- **value (source's words)**: "Varé de suivre le mouvement du général Vandamme et de recevoir ses ordres"; "le colonel Mazas avec son 1er bataillon"; "mes trois autres bataillons"; "le 1er bataillon du 14e de ligne"; "le 36e"; "la légion Morand"
- **source**: thiebault3_1894, pp. 467-468 and 470 (leaves n478, n479, n481), https://archive.org/details/mmoires03thieuoft/page/n478
- **quote**: p. 467: "Au moment où, à la pointe du jour, le maréchal Soult [...] nous mit en mouvement, Morand reçut du général Saint-Hilaire l'ordre de gravir le plateau de Pratzen et d'y prendre position, Varé de suivre le mouvement du général Vandamme et de recevoir ses ordres, et moi de chasser l'ennemi du village de Pratzen, puis de rejoindre notre avant-garde sur le plateau [...] à charger de l'attaque le colonel Mazas [p. 468] avec son 1er bataillon ; néanmoins, et par une suprême précaution, je suivis Mazas avec mes trois autres bataillons en ligne [...] tout le 1er bataillon du 14e de ligne partit à la débandade." p. 470: "je fis déployer, à l'appui de la légion Morand, le 36e de ligne qui formerait le pivot [...] et je plaçai en colonne, à la gauche de ma ligne, le 2e bataillon du 14e". Translation: When Soult set us moving at daybreak, Morand was ordered by Saint-Hilaire to climb the Pratzen plateau and take position there, Varé to follow General Vandamme's movement and take his orders, and I to drive the enemy out of Pratzen village, then join our advance guard on the plateau ... I gave the attack to Colonel Mazas with his 1st battalion; but I followed Mazas with my three other battalions ... the whole 1st battalion of the 14th line broke ... I deployed the 36th line in support of Morand's force ... and placed the 2nd battalion of the 14th in column on my left.
- **grade**: A for the participant's statement that Varé followed Vandamme (an eyewitness in the division; written later, B for details); the regiments of Thiébault's own brigade A
- **label**: fact (Thiébault = 14e + 36e, 4 bn; Varé attached to Vandamme). INFERENCE: since the 28 Oct return gives the division the 10e légère, 14e, 36e, 43e and 55e, and Thiébault has the 14e and 36e and Morand's advance guard includes the 10e légère (p. 469, OCR only: "la droite du 1er bataillon du 10e léger"), Varé's brigade would be the 43e and 55e, which is the project's note ("43e and 55e de Ligne attached to Vandamme"). Thiébault does not name Varé's regiments in the pages read.
- **notes**: for dressing: the sthilaire formation on the plateau is 10e légère (light, 2 bn) + 14e and 36e (line, 4 bn) = 6 bn; the 43e and 55e (line, 4 bn) fought with Vandamme. Artillery with the brigade (p. 470): "trois des six pièces d'artillerie de la division" with Morand, three with Thiébault, plus "six pièces de 12 que nous envoyait l'Empereur" under chef de bataillon Fontenay.

- **id**: fr.guardart.ice.thiebault
- **claim**: Thiébault says twenty-four pieces of the Imperial Guard's artillery broke the ice of the Satschan mere at the end of the battle.
- **value (source's words)**: "vingt-quatre pièces d'artillerie de la garde impériale brisèrent la glace"
- **source**: thiebault3_1894, p. 466 (leaf n477)
- **quote**: "C'est pendant cette demi-heure que l'on prit des masses d'hommes, qu'on en noya trois à quatre mille qui cherchaient à passer sur le lac des Satschan, dont vingt-quatre pièces d'artillerie de la garde impériale brisèrent la glace". Translation: It was during this half-hour that masses of men were taken, and three to four thousand drowned trying to cross the Satschan lake, whose ice twenty-four pieces of the Imperial Guard's artillery broke.
- **grade**: B (participant's memoir, published 1894; the figure is not his own observation necessarily)
- **label**: fact (as Thiébault's statement); the drowning figure is not part of this topic
- **notes**: bears on heightguns: Guard artillery (foot/horse artillery of the Guard) as a class, 24 pieces. The project's heightguns act line cites "Újezd local history" for 24 guns of the Guard and IV Corps.

- **id**: fr.ivcorps.artillery.28oct
- **claim**: IV Corps artillery on 28 Oct 1805: foot artillery of the 5e régiment (companies 1, 12-18), horse artillery of the 5e régiment (4th company), half companies of pontonniers and artificers, a squad of armourers, and the train (1st bis battalion, companies 1-5; 2nd bis battalion, companies 2-4).
- **value (source's words)**: "Artillerie à pied ... 5e régiment : 1re, 12e, 13e, 14e, 15e, 16e, 17e et 18e compagnies. Artillerie à cheval ... 5e régiment : 4e compagnie."
- **source**: alombertcolin4_1908, p. 729 (leaf n737)
- **quote**: "Artillerie et génie du 4e corps. [...] Artillerie à pied ..... 5e régiment : 1re, 12e, 13e, 14e, 15e, 16e, 17e et 18e compagnies. Artillerie à cheval ... 5e régiment : 4e compagnie. Pontonniers ....... Moitié de la 3e compagnie. Ouvriers d'artillerie .. Moitié de la 4e compagnie. Armuriers ........ Une escouade. Train d'artillerie .... 1er bataillon bis : 1re, 2e, 3e, 4e et 5e compagnies ; 2e bataillon bis : 2e, 3e et 4e compagnies." Translation: as the claim.
- **grade**: B for 2 Dec (A for 28 Oct 1805)
- **label**: fact (for 28 Oct)
- **notes**: classes for heightguns (IV Corps share): foot artillery, horse artillery, artillery train. The Guard's artillery is listed only as "Artillerie ; Train d'artillerie" (p. 745).

### Presence on 2 December by officer casualties (Martinien 1899)

General note: Martinien lists, unit by unit, every officer killed (T.) or wounded (B.) with the action. An entry "2 déc. 1805,
bataille d'Austerlitz" proves the unit (or a detachment of it) was engaged on the day; the absence of an entry proves nothing.
Grade B (specialist compilation, 1899, from the service records). Read from the page images unless marked "OCR".

- **id**: fr.guard.presence.martinien
- **claim**: Officer casualties at Austerlitz are recorded for the Guard's horse grenadiers (6 officers wounded, incl. chef d'escadron Clément), chasseurs à cheval (colonel Morland and captain Thervay killed, 15 wounded), the Mameluke company (3 lieutenants wounded), the horse artillery (chef d'escadron Greiner wounded) and the battalion of Marins (lieutenant Jacquelot killed).
- **value (source's words)**: "Régiment de grenadiers à cheval (vieille garde)"; "Régiment de Chasseurs à cheval (vieille garde)"; "Compagnie de Mamelucks (vieille garde)"; "Régiment d'Artillerie à cheval (vieille garde)"; "Bataillon de Marins"
- **source**: martinien1899, pp. 93, 96, 98, 106, 109 (views f93, f96, f98, f108, f111), e.g. https://gallica.bnf.fr/ark:/12148/bpt6k503971d/f96.item
- **quote**: p. 93: "Régiment de grenadiers à cheval (vieille garde) (4). [...] 2 déc. 1805, bataille d'Austerlitz. Clément, chef d'escad., B. Borde, lieut., B. Messager, lieut., B. Rollet, lieut., B. Seranne, lieut., B. Junker (5), s.-lieut., B." p. 96: "Régiment de Chasseurs à cheval (vieille garde) (1). [...] 2 déc. 1805, bataille d'Austerlitz. Morlant, col., T. Thervay (C.), capit., T. Thiry, chef d'escad., B. Beurmann, chef d'escad., B. Charpentier, chef d'escad., B. [...]" p. 98: "Compagnie de Mamelucks (vieille garde) (1). 2 déc. 1805, bataille d'Austerlitz. Habaiby, lieut., B. Chahin, lieut., B. Renno, lieut., B." p. 106: "Régiment d'Artillerie à cheval (vieille garde) (2). Greiner, chef d'escad., B. 2 déc. 1805, bataille d'Austerlitz." p. 109: "Bataillon de Marins (3). Jacquelot, lieut., T. 2 déc. 1805, bataille d'Austerlitz." Translation: as the claim (T. = killed, B. = wounded).
- **grade**: B (specialist)
- **label**: fact
- **notes**: confirms the project's guard_cav classes (horse grenadiers, chasseurs à cheval, Mamelukes) on the day. Two additions: (1) the Guard horse artillery was engaged (heightguns / Guard artillery); (2) the Guard's battalion of Marins (sailors) had an officer killed at Austerlitz: a class not in the project's guard_inf note (grenadiers and chasseurs à pied, Italian grenadiers). Footnote (5) on p. 93: Junker "Etait détaché près du général Walther comme aide de camp". No Austerlitz entry was found for the Guard dragoons (formed 1806), and the Guard infantry pages were not searched (Stutterheim p. 77 says the reserve did not fire a shot: "Cette réserve ne tira pas un coup de fusil pendant la bataille").

- **id**: fr.cav.presence.martinien
- **claim**: Martinien records officers killed or wounded "2 déc. 1805, bataille d'Austerlitz" for: the 1st and 2nd carabiniers; the 1st, 2nd, 3rd, 5th, 9th, 10th, 11th and 12th cuirassiers (all ten regiments of Nansouty's and d'Hautpoul's divisions in either return); the 3rd, 6th, 10th, 11th, 13th and 22nd dragoons (all six of Walther's division); the 15th, 17th, 18th and 19th dragoons (four of Bourcier's six; none for the 25th and 27th); the 2nd, 4th and 5th hussars and the 5th chasseurs (all four of Kellermann's division).
- **value (source's words)**: e.g. "CUIRASSIERS. 1er Régiment. [...] 2 déc. 1805, bataille d'Austerlitz. Thuon, lieut., B. (mort le 9). Céglas, s.-lieut., T. Demougin, chef d'escad., B. Monteil, capit., B. Dessaignes, s.-lieut., B."; "9e Régiment. 2 déc. 1805, bataille d'Austerlitz. Leblanc, chef d'escad., B. Lecordier, s.-lieut., B. Chobriat, s.-lieut., B. Guillemeaux, lieut., B."; "10e Régiment. Richard, s.-lieut., B. 2 déc. 1805, bataille d'Austerlitz (mort le 6)."; "12e Régiment. Vezin, lieut., B. 2 déc. 1805, bataille d'Austerlitz (mort le 12)."; "15e Régiment. [...] Fuzeau, s.-lieut., B. 2 déc. 1805, bataille d'Austerlitz. Pescheloche, major, B. 3 déc. 1805, route d'Austerlitz (mort le 4)."; "17e Régiment. [...] 2 déc. 1805, bataille d'Austerlitz. Fournie, lieut., B. Mann, lieut., B. Paulus, s.-lieut., B."; "18e Régiment. [...] 2 déc. 1805, bataille d'Austerlitz. Pistre, chef d'escad., B. Leclerc, chef d'escad., B. Guiard, capit., B. Javarry, lieut., B. Dumas, s.-lieut., B."; "19e Régiment. 2 déc. 1805, bataille d'Austerlitz. Collasse, lieut., B. Bertin, lieut., B. Mahyer s.-lieut., B."; "3e Régiment (1). [...] 2 déc. 1805, bataille d'Austerlitz. Canuet, s.-lieut., B. Bazir, s.-lieut., B. Lascours de Renaud de Boulogne, s.-lieut., B."; "6e Régiment. [...] Jobert, lieut., B. 2 déc. 1805, bataille d'Austerlitz."; "10e Régiment (1). Auzoux, capit., B. 2 déc. 1805, bataille d'Austerlitz (mort le 31)."; "11e Régiment. [...] 2 déc. 1805, bataille d'Austerlitz. Lefèvre, maj., T. Giraud, chef d'escad., T. Garret, lieut., B. Droulliot, s.-lieut., B. Joetz, lieut., B."; "13e Régiment. [...] 2 déc. 1805, bataille d'Austerlitz. Debroc, col., B. Laclède, chef d'escad., B. Cadat, capit., B. Hauvel, capit., B."; (chasseurs) "5e Régiment. 2 déc. 1805, bataille d'Austerlitz. Lauvray, capit., T. Corbineau, col., B. [...]"; (hussards) "2e Régiment. 2 déc. 1805, bataille d'Austerlitz. Barbier, col., B. David, chef d'escad., B. [...]"; "4e Régiment. 2 déc. 1805, bataille d'Austerlitz. Schild, capit., T. Barathier, s.-lieut., T. [...]"; "5e Régiment. [...] 2 déc. 1805, bataille d'Austerlitz. Dufay, lieut., T. Duplessis, lieut., T. [...]"
- **source**: martinien1899: carabiniers pp. 517, 519 (views f519, f521); cuirassiers pp. 520-534 (f522, f523, f525, f527, f532, f534, f535, f536); dragoons pp. 537-562 (f539-f564); chasseurs p. 585 (f587); hussars pp. 616-620 (f618, f621, f622)
- **quote**: as in "value"; translation: (regiment), 2 December 1805, battle of Austerlitz: (officer), (rank), wounded (B.) / killed (T.).
- **grade**: B (specialist)
- **label**: fact for the entries read as images (1st carabiniers; 1st, 9th, 10th, 12th cuirassiers; 3rd, 6th, 10th, 11th, 13th, 15th, 17th, 18th, 19th dragoons; 5th chasseurs; 2nd, 4th, 5th hussars). The 2nd carabiniers, 2nd, 3rd, 5th, 11th cuirassiers and 22nd dragoons were located in Gallica's OCR (ALTO) by the regiment header above them and NOT viewed as images: label "uncertain (OCR)"; the 22nd dragoons' line is OCR "2 déc. 1805, bataille d'Austevlitz. Rebours, s.-lieut., T. Perrey, capit., B. Castel, s.-lieut., B." (view f564, under the centred header "22e Régiment").
- **notes**: (1) Bourcier: officer casualties for the 15e, 17e, 18e, 19e dragons, none for the 25e and 27e: consistent with the project's "only a fraction of the division reached the field", but casualties do not prove which squadrons were present; Pescheloche (15e) was wounded on 3 Dec. (2) The cuirassier allocation dispute (28 Oct vs 13 Nov returns) is not settled by Martinien (no divisions given). (3) Also with Austerlitz entries (OCR located; not drawn formations): 1st, 5th, 8th, 9th, 12th, 16th, 21st dragoons (Klein's and Beaumont's regiments); 11th, 13th, 16th, 26th chasseurs; 8th, 9th, 10th hussars. (4) Absence of an entry is not evidence of absence.

## Summary by formation (pointers only; every statement rests on the claim ids named; no new evidence here)

| formation | classes to dress, by the claims | claim ids | open points |
|---|---|---|---|
| sthilaire | light inf (10e légère, 2 bn), line (14e, 36e, 2 bn each) on the plateau; 43e, 55e line (2 bn each) with Vandamme (inference); division artillery | fr.sthilaire.regiments, fr.sthilaire.brigades.thiebault | Varé's regiments not named by Thiébault (inference) |
| vandamme | light inf (24e légère), line (4e, 28e, 46e, 57e), 2 bn each; plus Varé's brigade | fr.vandamme.regiments, fr.sthilaire.brigades.thiebault | 28 Oct return only (B for 2 Dec), the 4e confirmed by its lost eagle |
| legrand | line (3e 3 bn, 18e, 75e 2 bn each), light (26e légère 2 bn), Tirailleurs corses and du Pô (1 bn each) | fr.legrand.regiments | brigadiers Levasseur/Merle/Brouard vs project's Féry |
| friant | line (33e, 48e, 108e, 111e), light (15e légère), 2 bn each | fr.friant.regiments | how many reached the field (strength disputed) |
| bourcier | dragoons (15e, 17e, 18e, 19e with officer casualties; 25e, 27e none) | fr.bourcier.regiments, fr.cav.presence.martinien | which squadrons present not shown |
| caffarelli | light (13e légère), line (17e, 30e, 51e, 61e), 2 bn each | fr.caffarelli.regiments | 28 Oct, under Bisson |
| suchet | light (17e légère), line (34e or "31e", 40e, 64e, 88e) | fr.suchet.regiments, fr.suchet.strength.26oct | 31e vs 34e in the same book |
| santon | light (17e légère) and 18 guns | fr.santon.unit.materialien vs fr.santon.unit.stutterheim | Stutterheim's "27e" |
| kellermann | hussars (2e, 4e, 5e), chasseurs à cheval (5e) | fr.kellermann.regiments, fr.cav.presence.martinien | none |
| nansouty | carabiniers (1er, 2e) and 4 cuirassier regiments | fr.nansouty.regiments, fr.cavres.13nov | which 4 cuirassier regiments (2,3,9,12 on 28 Oct; 1,2,3,5 on 13 Nov) |
| dhautpoul | 4 cuirassier regiments | fr.dhautpoul.regiments, fr.cavres.13nov | (1,5,10,11 on 28 Oct; 9,10,11,12 on 13 Nov) |
| walther | dragoons (3e, 6e, 10e, 11e, 13e, 22e) | fr.walther.regiments, fr.cavres.13nov, fr.cav.presence.martinien | none |
| rivaud | line (8e, 45e, 54e) | fr.rivaud.regiments | the return numbers it 2nd division, the project 1re |
| drouet | light (27e légère), line (94e, 95e) | fr.drouet.regiments | the return numbers it 1st division, the project 2e |
| guard_inf | grenadiers à pied, chasseurs à pied, Italian "Garde royale"; Marins (officer killed) | fr.guard.composition, fr.guard.presence.martinien, fr.reserve.counts.stutterheim | battalion counts on 2 Dec not found |
| guard_cav | grenadiers à cheval, chasseurs à cheval, Mamelukes (all with casualties); gendarmes d'élite in the 28 Oct list | fr.guard.composition, fr.guard.presence.martinien, al.rg.units.stutterheim | gendarmes d'élite on 2 Dec not shown |
| c_gren | 10 elite battalions: line grenadiers of 9e, 13e, 58e, 81e; light companies of 2e, 3e, 12e, 15e, 28e, 31e légère; artillery detachments | fr.oudinot.composition, fr.oudinot.strength.26oct | state after Hollabrunn not shown |
| gqg | escort NOT FOUND | — | see Not found |
| heightguns | IV Corps foot and horse artillery (5e régiments), train; Guard artillery (horse artillery engaged; 24 pieces per Thiébault) | fr.ivcorps.artillery.28oct, fr.guardart.ice.thiebault, fr.guard.presence.martinien | positions not a topic here |
| kienmayer | Grenz (Broder 1 bn, 1st and 2nd Szekler 2 bn each), Wiener Jäger (2 coys), chevau-légers (O'Reilly 8 sq), hussars (Hessen-Homburg 8 sq, Szekler 6 sq), uhlans (fractions of Merveldt, Schwarzenberg), Cossacks (2 regiments, 10 sq), 2 cavalry batteries | al.kienmayer.oob.schoenhals, al.kienmayer.units.stutterheim, al.kienmayer.grenz.count, al.kienmayer.regiments.md | MD's "2 weak regiments of Hungarian cavalry" vs 3 Austrian regiments |
| dok | jägers (7th or 5th), musketeers (New Ingermanland, Yaroslavl, Vladimir, Bryansk, Vyatka, Moscow), Kiev Grenadiers, Cossacks (2 sq per MD), heavy artillery | al.dok.regiments.md, al.dok.oob.schoenhals, al.russian.regiments.materialien, al.dok.units.stutterheim | which jäger regiment |
| lang | 8th Jäger, musketeers (Vyborg, Perm, Kursk), Cossacks 2 1/2 sq, pioneers | al.lang.regiments.md, al.lang.oob.schoenhals | whether Kursk was in Kamensky's brigade |
| kamensky | Fanagoria Grenadiers + "Riajsk/Rjäsan/Riasky" musketeers (+ Kursk per Schönhals) | al.kamensky.brigade.md, al.kamensky.units.stutterheim, al.lang.oob.schoenhals, al.russian.regiments.materialien | Ryazan vs Ryazhsk; brigade vs reinforcement |
| prz | 7th Jäger (2 bn; Schönhals prints "8."), musketeers (Galich, Butyrsk, Podolia, Narva, Azov), Cossacks 5 sq (Schönhals only), pioneers | al.prz.regiments.md, al.prz.oob.schoenhals | jäger number; Cossacks |
| milo | musketeers (Novgorod, Apsheron, Smolensk), Little Russia Grenadiers, pioneers, Austrian Erzherzog Johann dragoons (2 sq) | al.col4.regiments.md, al.col4.oob.schoenhals, al.milo.units.stutterheim | 12 vs 14 bn |
| kollo | Austrian line infantry: Rottermund (Salzburg 6 bn, Kaunitz, Auersperg), Jurczek (Kaiser, Czartoryski, Reuss-Greiz, Württemberg, Beaulieu, Kerpen, Lindenau, 1 bn each), pioneers | al.col4.oob.schoenhals, al.col4.austrians.materialien, al.kollo.units.stutterheim | none on the list; men per battalion as printed |
| lich | Austrian cuirassiers (Nassau, Lothringen, Kaiser; 24 sq, 1,100); Russian: Grand Duke Constantine Uhlans; per Schönhals also Gordeev Cossacks, St Petersburg Dragoons, Life Cuirassiers (Shepelev) and Kharkov, Chernigov Dragoons, Elisabethgrad Hussars (Uvarov/Penitsky) | al.lich.oob.schoenhals, al.lich.regiments.md, al.uvarov.transfer.md, al.lich.units.stutterheim | "Gladkov" NOT FOUND; Uvarov's three regiments in the column or with Bagration; Life Cuirassiers' place |
| bag | jägers (5th per Schönhals, 6th), musketeers (Arkhangelsk, Old Ingermanland, Pskov), hussars (Pavlograd, Mariupol), dragoons (Tver; St Petersburg per MD), Empress's cuirassiers (per MD), Cossacks, horse and foot artillery | al.bag.regiments.md, al.bag.oob.schoenhals | MD vs Schönhals on cuirassiers, St Petersburg dragoons, 5th Jäger |
| rg_inf | Preobrazhensky, Semenovsky, Izmailovsky (2 bn each), Life Grenadiers (3 bn), Life Jägers (1 bn), pioneers | al.rg.oob.schoenhals, al.rg.regiments.md, al.rg.units.stutterheim | none |
| rg_cav | Chevalier Guards, Horse Guards (5 sq each), Life Hussars (5 sq), Life Cossacks (2 sq) | al.rg.oob.schoenhals, al.rg.regiments.md, al.rg.units.stutterheim | none |
| ahq, buxhowden | escorts NOT FOUND | — | see Not found |

## Disagreements

| item | side 1 (source) | side 2 (source) | status |
|---|---|---|---|
| Kamensky's brigade | Fanagoria Grenadiers and "Riajsk" (MD 1846 pp. 241-242, 251, citing Langeron's reports) | Fanagoria and "Rhiasky" were of the II Column's reserve and REINFORCED Kamensky's brigade (Stutterheim 1806 p. 90); Kursk, "Riasky", Fanagoria under "Kamerskay" (Schönhals 1873 p. 177) | open |
| the musketeer regiment with Fanagoria | "Riajsk" = Ryazhsk (MD 1846 pp. 224, 241, 251) | "Rjäsan" = Ryazan (Materialien 1806 p. 99); Stutterheim "Rhiasky" and Schönhals "Riasky" ambiguous | open (the project's "Ryazan?" stays a question) |
| Kienmayer's cavalry | Hesse-Homburg hussars, Szekler hussars, O'Reilly chevau-légers, 2 Cossack regiments; 22 Austrian sq (Stutterheim pp. 53, 69, 101) and Schönhals p. 177 (with uhlan fractions; 32 3/4 sq incl. Cossacks) | "2 faibles régiments de cavalerie hongroise", 2 Cossack regiments (MD 1846 p. 224) | Stutterheim and Schönhals agree; MD's is a summary |
| I Column jägers | 5th Jäger and one battalion of the 7th (MD p. 224); 5th Jäger (Materialien p. 98); a battalion of the 7th Jäger at Telnitz (Stutterheim p. 72) | 7th Jäger regiment, 3 bn (Schönhals p. 177); 5th Jäger with Bagration (Schönhals p. 178) | open |
| III Column jägers | 2 bn of the 7th Jäger (MD p. 225; Materialien p. 99 "Das 7te Jäger-Regiment") | "8. Jäger-Regiment", 1 bn (Schönhals p. 177; the 8th also in the II Column on the same page) | open (possible misprint in Schönhals) |
| Empress's (Life) Cuirassiers, St Petersburg Dragoons | with Bagration (MD p. 226) | in the V Column under Essen / GM Shepelev (Schönhals p. 178) | open |
| Uvarov's Elisabethgrad Hussars, Kharkov and Chernigov Dragoons | moved the evening before from the V Column to Bagration's left (MD p. 233); ten squadrons placed on Bagration's left by Liechtenstein during the march (Stutterheim p. 79) | counted in the V Column under Uvarov / Penitsky (Schönhals p. 178; MD's own list p. 225) | open (a question of when and of counting) |
| Russian brigades of the V Column | GM Shepelev ("Czepelow") under Essen, GM Penitsky ("Penitzky") under Uvarov (Schönhals p. 178); GM "Piritzky, russe" (Stutterheim p. 34, 27 Nov) | the project's "Gladkov" | "Gladkov" NOT FOUND in any source read |
| Santon garrison | 17e légère (Materialien 1806 p. 101, citing the French "Campagnes ... an XIV" p. 297; Suchet's division includes the 17e légère, Alombert IV p. 732) | "vingt septième régiment d'infanterie" (Stutterheim 1806 p. 99) | 17e better supported; Stutterheim's figure likely an error (inference) |
| Nansouty's / d'Hautpoul's cuirassiers | Nansouty: 2e, 9e, 3e, 12e; d'Hautpoul: 1er, 5e, 10e, 11e (return of 28 Oct, Alombert IV p. 741) | "1re div.": 1er, 2e, 3e, 5e; "2e div.": 9e, 10e, 11e, 12e (return of 13 Nov, Alombert IV p. 757) | open (all ten regiments had officer casualties at Austerlitz, Martinien) |
| Suchet's division line regiment | "34e de ligne" (Alombert IV p. 732, 28 Oct) | "31e rég. d'inf. de ligne" (Alombert IV p. 756, 26 Oct) | open (internal to the same book) |
| Numbering of I Corps divisions | Drouet 1re, Rivaud 2e (Alombert IV pp. 716-717) | Rivaud 1re, Drouet 2e (project data.js) | project label vs return; not resolved here |
| Oudinot's command on 2 Dec | Oudinot, recovered, took command again (Stutterheim p. 77) | commanded by Duroc (Stutterheim p. 57, OCR snippet; project data) | open |
| IV Column Russian battalions | 12 (Stutterheim p. 51; Schönhals p. 177) | 14 (project data, after Duffy/Smith) | open |
| Allied totals | Schönhals p. 178: I Column 13,730 (line) vs 12,730 (recap); III Column 16 vs 18 bn; Guard 4,380 vs 9,380 | (internal inconsistencies in the same table) | as printed |
| I Column regiments | 6 musketeer regiments + Kiev Grenadiers (MD p. 224; Schönhals p. 177) | the same plus "Gr. Sievers" (Materialien p. 98) | open |
| II Column | one grenadier regiment, Fanagoria (MD; Schönhals) | Fanagoria grenadiers AND a "Fanagorsk" musketeer regiment (Materialien p. 99) | probably a misprint (inference), open |

## Not found / not readable

- **Weyrother's disposition, original text with a troop list**: the German text was read only in the Materialien 1806 (pp. 101 ff.; it names columns, not regiments) and Stutterheim's French paraphrase; the disposition as printed by Mikhailovsky-Danilevsky (Russian, 1844) was not read. The Russian original of MD (1844) was not looked up (Google Books/prlib not tried in this session for lack of time): this is the source that would settle "Ряжский" vs "Рязанский".
- **Gladkov**: searched Stutterheim (Gallica ContentSearch "Gladkow": 0 results), MD 1846, the Materialien, Schönhals (full-text grep "glad": 0). NOT FOUND.
- **Napoleon's escort (gqg), Allied HQ escort (ahq), Buxhowden's escort**: no source read names an escort for 2 December. Martinien p. 96 has a Guard chasseur officer wounded on 20 Nov "étant d'escorte près du maréchal Bessières", which is not the HQ escort on the 2nd. NOT FOUND.
- **French returns for 1-2 December (e.g. a "situation" of 10 frimaire)**: Alombert & Colin vol. IV ends before Austerlitz ("Toute sa campagne de Moravie, et la bataille d'Austerlitz, seront [traitées]..."); no later volume was found on archive.org. NOT FOUND.
- **Italian Royal Guard elements on 2 Dec** and the **Guard infantry battalion count on 2 Dec**: only the 28 Oct list ("Garde royale") and Stutterheim's "dix bataillons de la garde impériale". NOT FOUND in more detail.
- **Bourcier's squadrons present on 2 Dec**: only officer casualties (Martinien). NOT FOUND as a return.
- **Nafziger order-of-battle files (US Army CARL, cgsc.contentdm.oclc.org)**: the CONTENTdm API timed out (HTTP 504) on cross-collection searches; collection p4013coll8 is not the Nafziger collection; the Nafziger collection alias was not found. Not read.
- **Napoleon Series article "Russian-Austrian Order-of-Battle at Austerlitz: 2 December 1805"** (https://www.napoleon-series.org/military-info/battles-campaigns/russian-austrian-order-of-battle-at-austerlitz-2-december-1805/): HTTP 202 with a captcha redirect (/.well-known/sgcaptcha/), members area. Not read.
- **Gallica full-text (.texteBrut)**: blocked by an "altcha" check (HTTP 200 to a security page); worked around through ContentSearch, ALTO (RequestDigitalElement) and IIIF images; Gallica returned 429 and 503 at times (retried).
- **Langeron's memoir / reports, Duffy 1977, Goetz 2005, Smith 1998, the 30th Bulletin, the "Relation" of the Dépôt de la guerre, Kutuzov's relation**: not read in this session.
- **Thiébault's naming of Varé's regiments**: pp. 466-470 read; Varé's regiments not named there (the 43e/55e attribution remains an inference).

