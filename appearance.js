/* ============================================================
   AUSTERLITZ — historical appearance (Stage 6B: docs/STAGE6_SPEC.md §5, §6.1; owner decisions 96-110, §0.4)
   The CLAIMS about what the troops present on 2 December 1805 wore and carried, each with its source, its locator
   (page, plate, view), an appearance grade and a label. Nothing here is drawn: the drawn colours and shapes are
   presentation (KIT in app.js, 6C), design decisions taken from these claims (decision 102). Guarded data
   (tools/visual/data-invariance.js); a change is a data task, listed in CHANGELOG.md with what was, what is and why.
   The readings behind every claim, with their fuller quotations: docs/stage6-evidence/readings-*.md.

   Appearance grades (the Stage 6 grades; not the data's position grades A/B/C of data.js, which grade where a
   formation stood):
     A  documented for 1805: a source dated 1804-1805, or a regulation shown to be in force on 2 December 1805
     B  documented for the period and probable for 1805
     C  reconstructed or disputed
   Labels: fact, disputed, derived, inference, uncertain.

   A value takes one of four forms.
     A claim: {v, en, src, at, gr, lab, q, dated, inForce, note}: v the source's own words, en an English rendering,
       src a key of APPEARANCE_SOURCES, at the locator, gr the grade, lab the label, q a short verbatim quote (the
       source's language, as printed; OCR slips marked [sic]), dated the date of the document quoted when it is a
       dated text printed later (an order of 1805 in an edition of 1863), inForce {src, at, q} what shows that a
       regulation used at grade A was in force on the day, note anything else (a conflict, what the grade rests on).
     A disputed value: {v, lab:"disputed", gr:"C", sides:[claim, claim, ...], note}: the sources disagree; each side
       is kept with its source; none is chosen (decision 103: drawn generic).
     A generic value: {gen:true, why}: no read source settles it; drawn generic and labelled (§2.9; decisions 98, 105).
     A null value (colours only): {none:true, why}: no read source shows that the units carried colours; nothing drawn.
   Drawable attributes also carry a class from APPEARANCE_VOCAB (c a colour class, h a headgear class): the vocabulary
   names what the source's words describe so that 6C can draw it; the source's words stay in v. A greatcoat value says
   whether the sources show it worn in the fighting (worn: true, false, or null for not established; decision 101); a
   cuirass value whether one was worn (has).
   ============================================================ */

var APPEARANCE_GRADE = {
  A: "documented for 1805",
  B: "documented for the period, probable for 1805",
  C: "reconstructed or disputed"
};

/* the classes a drawable attribute may take. "generic" is the vocabulary's word for a value no read source settles, or
   that the sources dispute: 6C draws it in its generic, labelled form. */
var APPEARANCE_VOCAB = {
  colour: ["dark blue","blue","sky blue","dark green","green","light green","white","red","brown","grey","straw","turquoise",
    "black","buff","generic"],
  head: ["bicorne","round hat","shako","bearskin","grenadier cap","crested helmet","metal helmet","colback","czapka","fur cap",
    "turban","generic"]
};

/* every work read for this table: au author, ti title, pub place and publisher, d year of the edition read, kind
   (regulation, primary-text, primary-image, object, specialist, modern-web-specialist), url the scan read, ia its
   archive.org identifier where it has one (the text the quotes are checked against: tools/stage6/verify-quotes.js) */
var APPEARANCE_SOURCES = {
  /* France */
  alombert4_1908: {au:"P.-C. Alombert and J. Colin (Section historique de l'État-major de l'armée)", ti:"La campagne de 1805 en Allemagne, t. IV (with the situations of the Grande Armée, pp. 711-762)", pub:"Paris, Chapelot", d:1908, kind:"specialist", url:"https://archive.org/details/la-campagne-de-1805-en-allemagne-vol.-4", ia:"la-campagne-de-1805-en-allemagne-vol.-4"},
  corr9_1858:  {au:"Napoléon Ier (Commission)", ti:"Correspondance de Napoléon Ier, publiée par ordre de l'empereur Napoléon III, t. IX", pub:"Paris, Plon and Dumaine (series 1858-1870)", d:1858, kind:"primary-text", url:"https://archive.org/details/correspondancede09napouoft", ia:"correspondancede09napouoft"},
  corr10_1858: {au:"Napoléon Ier (Commission)", ti:"Correspondance de Napoléon Ier, t. X", pub:"Paris, Plon and Dumaine (series 1858-1870)", d:1858, kind:"primary-text", url:"https://archive.org/details/correspondancede10napouoft", ia:"correspondancede10napouoft"},
  corr11_1863: {au:"Napoléon Ier (Commission)", ti:"Correspondance de Napoléon Ier, t. XI (letters, orders and bulletins of 1805)", pub:"Paris, Imprimerie impériale", d:1863, kind:"primary-text", url:"https://archive.org/details/correspondancede11napouoft", ia:"correspondancede11napouoft"},
  corr13_1858: {au:"Napoléon Ier (Commission)", ti:"Correspondance de Napoléon Ier, t. XIII", pub:"Paris, Plon and Dumaine (series 1858-1870)", d:1858, kind:"primary-text", url:"https://archive.org/details/correspondanced13napo", ia:"correspondanced13napo"},
  corr14_1858: {au:"Napoléon Ier (Commission)", ti:"Correspondance de Napoléon Ier, t. XIV", pub:"Paris, Plon and Dumaine (series 1858-1870)", d:1858, kind:"primary-text", url:"https://archive.org/details/correspondancede14napouoft", ia:"correspondancede14napouoft"},
  corr16_1858: {au:"Napoléon Ier (Commission)", ti:"Correspondance de Napoléon Ier, t. XVI", pub:"Paris, Plon and Dumaine (series 1858-1870)", d:1858, kind:"primary-text", url:"https://archive.org/details/correspondancede16napouoft", ia:"correspondancede16napouoft"},
  berriat2_1812: {au:"H. Berriat", ti:"Législation militaire, ou Recueil méthodique et raisonné des lois, décrets, arrêtés, réglemens et instructions actuellement en vigueur, t. II", pub:"Alexandrie, L. Capriolo", d:1812, kind:"regulation", url:"https://archive.org/details/lgislationmilit02armgoog", ia:"lgislationmilit02armgoog"},
  berriat3_1812: {au:"H. Berriat", ti:"Législation militaire [...] actuellement en vigueur, t. III", pub:"Alexandrie, L. Capriolo", d:1812, kind:"regulation", url:"https://archive.org/details/bub_gb_Ic0GiuKgGOYC", ia:"bub_gb_Ic0GiuKgGOYC"},
  reglt_gen_an12: {au:"Ministère de la Guerre", ti:"Règlement sur l'uniforme des généraux, des officiers des états-majors des armées et des places [...] (du 1er vendémiaire an XII)", pub:"Paris, Magimel", d:1803, kind:"regulation", url:"https://gallica.bnf.fr/ark:/12148/btv1b8426960v"},
  bardin_memorial1813: {au:"É.-A. Bardin (ed.)", ti:"Mémorial de l'officier d'infanterie, ou Collection méthodique de tout ce que les règlemens aujourd'hui en vigueur [...] contiennent de particulier à cette arme", pub:"Paris, Magimel", d:1813, kind:"regulation", url:"https://archive.org/details/bub_gb_BmAOAAAAQAAJ", ia:"bub_gb_BmAOAAAAQAAJ"},
  bardin1_1849: {au:"É.-A. Bardin", ti:"Dictionnaire de l'armée de terre, partie 1 (article Aigle)", pub:"Paris, J. Corréard", d:1849, kind:"specialist", url:"https://archive.org/details/bub_gb_9zvfIRepbicC", ia:"bub_gb_9zvfIRepbicC"},
  bardin4_1849: {au:"É.-A. Bardin", ti:"Dictionnaire de l'armée de terre, partie 4 (Cantonnement - Chien)", pub:"Paris, J. Corréard", d:1849, kind:"specialist", url:"https://archive.org/details/bub_gb_xJVcg1iO_pQC", ia:"bub_gb_xJVcg1iO_pQC"},
  bardin6_1849: {au:"É.-A. Bardin", ti:"Dictionnaire de l'armée de terre, partie 6", pub:"Paris, J. Corréard", d:1849, kind:"specialist", url:"https://archive.org/details/bub_gb_87JOMXO9_LUC", ia:"bub_gb_87JOMXO9_LUC"},
  bardin7_1849: {au:"É.-A. Bardin", ti:"Dictionnaire de l'armée de terre, partie 7 (Disponibilité - Eystène)", pub:"Paris, J. Corréard", d:1849, kind:"specialist", url:"https://archive.org/details/bub_gb_3EC2tWkkO6oC", ia:"bub_gb_3EC2tWkkO6oC"},
  bardin9_1849: {au:"É.-A. Bardin", ti:"Dictionnaire de l'armée de terre, partie 9 (Général - Infanterie)", pub:"Paris, J. Corréard", d:1849, kind:"specialist", url:"https://archive.org/details/bub_gb_bPGdVhjH43IC", ia:"bub_gb_bPGdVhjH43IC"},
  bardin15_1850: {au:"É.-A. Bardin", ti:"Dictionnaire de l'armée de terre, partie 15 (article Schako)", pub:"Paris, J. Corréard", d:1850, kind:"specialist", url:"https://archive.org/details/bub_gb_wYFsiLtmMuEC", ia:"bub_gb_wYFsiLtmMuEC"},
  bardin17_1851: {au:"É.-A. Bardin", ti:"Dictionnaire de l'armée de terre, partie 17 (Tribun - Zygarque; article Uniforme)", pub:"Paris, J. Corréard", d:1851, kind:"specialist", url:"https://archive.org/details/bub_gb_iGVBRA6sQTwC", ia:"bub_gb_iGVBRA6sQTwC"},
  fieffe2_1854: {au:"E. Fieffé", ti:"Histoire des troupes étrangères au service de France [...], t. II", pub:"Paris, J. Dumaine", d:1854, kind:"specialist", url:"https://www.e-rara.ch/zut/doi/10.3931/e-rara-91034"},
  perrot1821: {au:"A. Perrot", ti:"Histoire de l'ex-garde, depuis sa formation jusqu'à son licenciement [...] les uniformes de ses divers corps", pub:"Paris, Delaunay", d:1821, kind:"specialist", url:"https://gallica.bnf.fr/ark:/12148/bpt6k6516585c"},
  martinet_tf: {au:"P. Martinet (publisher)", ti:"Troupes Françaises, hand-coloured plates (the BnF volume 'Collection de tous les uniformes de l'armée de Buonaparte, 1807 à 1813')", pub:"Paris, Martinet", d:1807, kind:"primary-image", url:"https://gallica.bnf.fr/ark:/12148/btv1b10538169m"},
  regnault1967: {au:"J. Regnault", ti:"Les Aigles impériales et le drapeau tricolore, 1804-1815", pub:"Paris, J. Peyronnet", d:1967, kind:"specialist", url:"https://gallica.bnf.fr/ark:/12148/bpt6k3340531p"},
  hollander1902: {au:"O. Hollander", ti:"Nos drapeaux et étendards de 1812 à 1815", pub:"Paris and Nancy, Berger-Levrault", d:1902, kind:"specialist", url:"https://archive.org/details/hollander.-drapeaux-et-etandards-l-armee-francais-1812-1815", ia:"hollander.-drapeaux-et-etandards-l-armee-francais-1812-1815"},
  morvan1904: {au:"J. Morvan", ti:"Le Soldat impérial (1800-1814), t. I", pub:"Paris, Plon", d:1904, kind:"specialist", url:"https://archive.org/details/lesoldatimpria01morvuoft", ia:"lesoldatimpria01morvuoft"},
  painvin1891: {au:"A. Painvin", ti:"Historique du 51e régiment d'infanterie", pub:"Beauvais, D. Père", d:1891, kind:"specialist", url:"https://archive.org/details/historiqueduerg00paingoog", ia:"historiqueduerg00paingoog"},
  fraser1912: {au:"E. Fraser", ti:"The War Drama of the Eagles", pub:"London", d:1912, kind:"specialist", url:"https://archive.org/details/wardramaofeagles00fras", ia:"wardramaofeagles00fras"},
  osenat21003_202: {au:"Osenat (experts J.-C. Dey, A. de Gouvion Saint-Cyr)", ti:"Sale 21003, lot 202: drapeau modèle 1804 du Ier bataillon du 111e régiment d'infanterie de ligne", pub:"Fontainebleau, Osenat", d:2021, kind:"object", url:"https://www.osenat.com/en/lot/21003/4364027"},
  osenat21003_200: {au:"Osenat", ti:"Sale 21003, lot 200: aigle de drapeau modèle 1804", pub:"Fontainebleau, Osenat", d:2021, kind:"object", url:"https://www.osenat.com/en/lot/21003/4364025"},
  villerme1829: {au:"L.-R. Villermé", ti:"Mémoire sur la taille de l'homme en France, Annales d'hygiène publique et de médecine légale, 1re série, t. 1", pub:"Paris, Gabon", d:1829, kind:"specialist", url:"https://archive.org/details/BIUSante_90141x1829x01", ia:"BIUSante_90141x1829x01"},
  crociani2004: {au:"P. Crociani, V. Ilari, C. Paoletti", ti:"Storia militare del Regno Italico (1802-1814), vol. I, tomo 2", pub:"Rome, Stato Maggiore dell'Esercito, Ufficio Storico", d:2004, kind:"specialist", url:"https://archive.org/details/storia-militare-del-regno-italico-1802-1814-vol.-1-tomo-1"},
  gassendi1809: {au:"J.-J.-B. Gassendi", ti:"Aide-mémoire à l'usage des officiers d'artillerie de France, attachés au service de terre, 4e éd., t. I", pub:"Paris, Magimel", d:1809, kind:"specialist", url:"https://archive.org/details/india.history.resource.106008", ia:"india.history.resource.106008"},
  /* Stage 8, implementation PR 8E (decision 243 (a)): the works its artillery claims add (ORDNANCE; docs/stage8-evidence/8e/artillery-readings.md) */
  gassendi2_1809: {au:"J.-J.-B. Gassendi", ti:"Aide-mémoire à l'usage des officiers d'artillerie de France, attachés au service de terre, 4e éd., t. II", pub:"Paris, Magimel", d:1809, kind:"specialist", url:"https://archive.org/details/india.history.resource.105837", ia:"india.history.resource.105837"},
  alombert1_1902: {au:"P.-C. Alombert and J. Colin (Section historique de l'État-major de l'armée)", ti:"La campagne de 1805 en Allemagne, t. I", pub:"Paris, Chapelot", d:1902, kind:"specialist", url:"https://archive.org/details/la-campagne-de-1805-en-allemagne-vol.-1", ia:"la-campagne-de-1805-en-allemagne-vol.-1"},
  nilus1904: {au:"А. А. Нилус", ti:"История материальной части артиллерии, т. 2", pub:"Санкт-Петербург", d:1904, kind:"specialist", url:"https://archive.org/details/nilusaaistorijamaterialnojchastiartil76", ia:"nilusaaistorijamaterialnojchastiartil76"},
  martinien1899: {au:"A. Martinien", ti:"Tableaux, par corps et par batailles, des officiers tués et blessés pendant les guerres de l'Empire (1805-1815)", pub:"Paris, Charles-Lavauzelle", d:1899, kind:"specialist", url:"https://gallica.bnf.fr/ark:/12148/bpt6k503971d"},
  /* participants and the allied accounts */
  thiebault3_1894: {au:"P. Thiébault (ed. F. Calmettes)", ti:"Mémoires du général baron Thiébault, t. III (1799-1806)", pub:"Paris, Plon, Nourrit", d:1894, kind:"primary-text", url:"https://archive.org/details/mmoires03thieuoft", ia:"mmoires03thieuoft"},
  barres1923: {au:"J.-B.-A. Barrès (ed. M. Barrès)", ti:"Souvenirs d'un officier de la Grande Armée", pub:"Paris, Plon, Nourrit", d:1923, kind:"primary-text", url:"https://gallica.bnf.fr/ark:/12148/bpt6k650906"},
  coignet1909: {au:"J.-R. Coignet (ed. L. Larchey)", ti:"Les cahiers du capitaine Coignet (1799-1815)", pub:"Paris, Hachette", d:1909, kind:"primary-text", url:"https://archive.org/details/lescahiersducapi00coig", ia:"lescahiersducapi00coig"},
  savary1828: {au:"A.-J.-M.-R. Savary, duc de Rovigo", ti:"Mémoires du duc de Rovigo, pour servir à l'histoire de l'empereur Napoléon, t. II", pub:"Paris, A. Bossange", d:1828, kind:"primary-text", url:"https://archive.org/details/mmoiresduducder04savagoog", ia:"mmoiresduducder04savagoog"},
  stutterheim1806fr: {au:"K. von Stutterheim", ti:"La bataille d'Austerlitz, par un militaire témoin de la journée du 2 décembre 1805", pub:"Hambourg", d:1806, kind:"primary-text", url:"https://gallica.bnf.fr/ark:/12148/bpt6k6497274t"},
  stutterheim1806de: {au:"K. von Stutterheim", ti:"Die Schlacht bey Austerlitz, am 2. December 1805. Von einem Officier und Augenzeugen. Aus dem Französischen", pub:"Hamburg", d:1806, kind:"primary-text", url:"https://archive.org/details/11344011bsb", ia:"11344011bsb"},
  materialien1806: {au:"anonymous ('gesammelt von einem Militär')", ti:"Materialien zu der Geschichte der Schlacht bei Austerlitz", pub:"Weimar, Landes-Industrie-Comptoir", d:1806, kind:"primary-text", url:"https://archive.org/details/10807964bsb", ia:"10807964bsb"},
  duffy1977: {au:"C. Duffy", ti:"Austerlitz 1805 (appendix: order of battle, pp. 184-185)", pub:"London, Seeley Service", d:1977, kind:"specialist", url:"https://archive.org/details/austerlitz18050000duff", ia:"austerlitz18050000duff"},
  schoenhals1873: {au:"K. von Schönhals", ti:"Der Krieg 1805 in Deutschland (Beilage: Ordre de Bataille des verbündeten Heeres in der Schlacht von Austerlitz, pp. 177-178)", pub:"Wien", d:1873, kind:"specialist", url:"https://archive.org/details/derkriegindeuts00schgoog", ia:"derkriegindeuts00schgoog"},
  mikhailovsky1846: {au:"A. I. Mikhailovsky-Danilevsky (tr. L. Narischkine)", ti:"Relation de la campagne de 1805 (Austerlitz)", pub:"Paris, Dumaine", d:1846, kind:"specialist", url:"https://archive.org/details/relationdelacam00dangoog", ia:"relationdelacam00dangoog"},
  mikhailovsky1844: {au:"А. И. Михайловский-Данилевский", ti:"Описание первой войны Императора Александра съ Наполеономъ въ 1805 году", pub:"Санкт-Петербург", d:1844, kind:"specialist", url:"https://archive.org/details/1805-.-bmk-brz"},
  /* Russia */
  viskovatov9_1850: {au:"А. В. Висковатов", ti:"Историческое описание одежды и вооружения российских войск, ч. 9 [1796-1801]: Знамена и штандарты", pub:"Санкт-Петербург, Военная типография", d:1850, kind:"specialist", url:"https://archive.org/details/viskovatovaleksandrvasilevich180418550", ia:"viskovatovaleksandrvasilevich180418550"},
  viskovatov9_1900: {au:"А. В. Висковатов", ti:"Историческое описание одежды и вооружения российских войск, ч. 9 (2nd ed.)", pub:"Санкт-Петербург, В. С. Балашев", d:1900, kind:"specialist", url:"https://archive.org/details/istoricheskoeopisanieodezhdyivooruzhenij58", ia:"istoricheskoeopisanieodezhdyivooruzhenij58"},
  viskovatov10_1900: {au:"А. В. Висковатов", ti:"Историческое описание одежды и вооружения российских войск, ч. 10 [army infantry 1801-1825] (2nd ed.)", pub:"Санкт-Петербург, В. С. Балашев", d:1900, kind:"specialist", url:"https://archive.org/details/istoricheskoeopisanieodezhdyivooruzhenij12", ia:"istoricheskoeopisanieodezhdyivooruzhenij12"},
  viskovatov11_1853: {au:"А. В. Висковатов", ti:"Историческое описание одежды и вооружения российских войск, ч. 11 [army cavalry 1801-1825]", pub:"Санкт-Петербург, Военная типография", d:1853, kind:"specialist", url:"https://archive.org/details/viskovatovaleksandrvasilevich180418512", ia:"viskovatovaleksandrvasilevich180418512"},
  viskovatov12_1900: {au:"А. В. Висковатов", ti:"Историческое описание одежды и вооружения российских войск, ч. 12 [artillery, pioneers 1801-1825] (2nd ed.)", pub:"Санкт-Петербург, В. С. Балашев", d:1900, kind:"specialist", url:"https://archive.org/details/istoricheskoeopisanieodezhdyivooruzhenij2", ia:"istoricheskoeopisanieodezhdyivooruzhenij2"},
  viskovatov14_1901: {au:"А. В. Висковатов", ti:"Историческое описание одежды и вооружения российских войск, ч. 14 [Guard infantry 1801-1825] (2nd ed.)", pub:"Санкт-Петербург, В. С. Балашев", d:1901, kind:"specialist", url:"https://archive.org/details/istoricheskoeopisanieodezhdyivooruzhenij65", ia:"istoricheskoeopisanieodezhdyivooruzhenij65"},
  viskovatov15_1901: {au:"А. В. Висковатов", ti:"Историческое описание одежды и вооружения российских войск, ч. 15 [Guard cavalry 1801-1825] (2nd ed.)", pub:"Санкт-Петербург, В. С. Балашев", d:1901, kind:"specialist", url:"https://archive.org/details/istoricheskoeopisanieodezhdyivooruzhenij55", ia:"istoricheskoeopisanieodezhdyivooruzhenij55"},
  viskovatov17_1901: {au:"А. В. Висковатов", ti:"Историческое описание одежды и вооружения российских войск, ч. 17 [generals, staff; colours and standards 1801-1825] (2nd ed.)", pub:"Санкт-Петербург, В. С. Балашев", d:1901, kind:"specialist", url:"https://archive.org/details/istoricheskoeopisanieodezhdyivooruzhenij22", ia:"istoricheskoeopisanieodezhdyivooruzhenij22"},
  viskovatov18_1901: {au:"А. В. Висковатов", ti:"Историческое описание одежды и вооружения российских войск, ч. 18 [irregular troops 1801-1825] (2nd ed.)", pub:"Санкт-Петербург, В. С. Балашев", d:1901, kind:"specialist", url:"https://archive.org/details/istoricheskoeopisanieodezhdyivooruzhenij31", ia:"istoricheskoeopisanieodezhdyivooruzhenij31"},
  psz27_1830: {au:"(official)", ti:"Полное собрание законов Российской империи, собрание первое, т. 27 (1802-1803)", pub:"Санкт-Петербург, Типография II Отделения", d:1830, kind:"regulation", url:"https://archive.org/details/polnoesobraniezakonovrossijskojimperiis30", ia:"polnoesobraniezakonovrossijskojimperiis30"},
  psz28_1830: {au:"(official)", ti:"Полное собрание законов Российской империи, собрание первое, т. 28 (1804-1805)", pub:"Санкт-Петербург, Типография II Отделения", d:1830, kind:"regulation", url:"https://archive.org/details/polnoesobraniezakonovrossijskojimperiis72", ia:"polnoesobraniezakonovrossijskojimperiis72"},
  psz44_2_1830: {au:"(official)", ti:"Полное собрание законов Российской империи, т. 44, ч. 2: Книга штатов (uniform legislation in chronological tables)", pub:"Санкт-Петербург, Типография II Отделения", d:1830, kind:"regulation", url:"https://archive.org/details/polnoesobraniezakonovrossijskojimperiis27", ia:"polnoesobraniezakonovrossijskojimperiis27"},
  ulyanov1996: {au:"И. Э. Ульянов", ti:"Регулярная пехота 1801-1855", pub:"Москва, АСТ", d:1996, kind:"specialist", url:"http://militera.lib.ru/h/leonov_ulyanov2/index.html"},
  stackelberg1881: {au:"К. К. Штакельберг", ti:"Полтора века Конной гвардии. 1739-1880", pub:"Санкт-Петербург", d:1881, kind:"specialist", url:"https://archive.org/details/poltoravekakonnojgvardii1739188057", ia:"poltoravekakonnojgvardii1739188057"},
  sokolov2006: {au:"О. В. Соколов", ti:"Аустерлиц. Наполеон, Россия и Европа, 1799-1805 гг., т. II", pub:"Москва, Русский культурный фонд «Империя истории»", d:2006, kind:"specialist", url:"https://archive.org/download/1799-1805-.-ii/"},
  /* Austria */
  schem1805: {au:"(official army list; C. Gräffer, publisher)", ti:"Militär-Almanach Nro. XVI = Schematismus der kaiserl. königl. Armée für das Jahr 1805", pub:"Wien, Cath. Gräffer", d:1805, kind:"primary-text", url:"https://library.hungaricana.hu/en/view/MilitarAlmanachSchematismus_1805/"},
  teuber1895: {au:"O. Teuber (text), R. von Ottenfeld (ill.)", ti:"Die österreichische Armee von 1700 bis 1867", pub:"Wien, Berté", d:1895, kind:"specialist", url:"https://diglib.uibk.ac.at/urn:nbn:at:at-ubi:2-15217"},
  dolleczek1896: {au:"A. Dolleczek", ti:"Monographie der k.u.k. österr.-ung. blanken und Handfeuer-Waffen, Kriegsmusik, Fahnen und Standarten", pub:"Wien, Kreisel & Gröger", d:1896, kind:"specialist", url:"https://archive.org/details/monographiederku00doll", ia:"monographiederku00doll"},
  wrede1_1898: {au:"A. von Wrede", ti:"Geschichte der k. und k. Wehrmacht, Bd. I", pub:"Wien, Seidel (for the Kriegsarchiv)", d:1898, kind:"specialist", url:"https://archive.org/details/geschichtederkun00wred", ia:"geschichtederkun00wred"},
  vanicek1875: {au:"F. Vaníček", ti:"Specialgeschichte der Militärgrenze, Bd. III", pub:"Wien, k.k. Hof- und Staatsdruckerei", d:1875, kind:"specialist", url:"https://archive.org/details/specialgeschich00vangoog", ia:"specialgeschich00vangoog"},
  /* roadmap step 4 (narrative.js): works read for the narrative statements' claims (docs/step4-evidence/readings.md); one table of the
     works read, so the claims' sources are registered here beside the appearance table's */
  davout1885: {au:"L.-N. Davout (ed. Ch. de Mazade)", ti:"Correspondance du maréchal Davout, prince d'Eckmühl, t. I", pub:"Paris, E. Plon, Nourrit et Cie", d:1885, kind:"primary-text", url:"https://archive.org/details/correspondanced03davogoog", ia:"correspondanced03davogoog"},
  marbot1891: {au:"M. de Marbot", ti:"Mémoires du général baron de Marbot, t. I (Gênes, Austerlitz, Eylau), 27th edition", pub:"Paris, Plon, Nourrit", d:1891, kind:"primary-text", url:"https://archive.org/details/mmoiresdugn01marbuoft", ia:"mmoiresdugn01marbuoft"},
  kavalergard1851: {au:"(the regiment's history; author not read)", ti:"История кавалергардов и Кавалергардского Ее Величества полка, с 1724 по 1-е июля 1851 года", pub:"(place not read)", d:1851, kind:"specialist", url:"https://archive.org/details/istorijakavalergardovikavalergardskogoee45", ia:"istorijakavalergardovikavalergardskogoee45"},
  kutuzov1951: {au:"М. И. Кутузов", ti:"М. И. Кутузов. Сборник документов, т. II (1805)", pub:"Москва, Воениздат", d:1951, kind:"primary-text", url:"https://archive.org/details/20250102_20250102_1833", ia:"20250102_20250102_1833"},
  rapp1823: {au:"J. Rapp", ti:"Mémoires du général Rapp, aide-de-camp de Napoléon, écrits par lui-même, et publiés par sa famille", pub:"Paris, Bossange frères", d:1823, kind:"primary-text", url:"https://archive.org/details/mmoiresdugnralr00rappgoog", ia:"mmoiresdugnralr00rappgoog"},
  segur1877: {au:"Ph.-P. de Ségur", ti:"Histoire et mémoires, t. II, 2e éd.", pub:"Paris, Firmin-Didot et Cie", d:1877, kind:"primary-text", url:"https://archive.org/details/histoireetmmoir06sggoog", ia:"histoireetmmoir06sggoog"},
  lejeune1851: {au:"L.-F. Lejeune", ti:"Souvenirs d'un officier de l'Empire", pub:"Toulouse, Typographie Viguier", d:1851, kind:"primary-text", url:"https://archive.org/details/souvenirsdunoff00jeungoog", ia:"souvenirsdunoff00jeungoog"},
  lejeune1895: {au:"L.-F. Lejeune", ti:"Mémoires du général Lejeune, t. I", pub:"Paris, Firmin-Didot", d:1895, kind:"primary-text", url:"https://archive.org/details/mmoiresdugnrale00lejegoog", ia:"mmoiresdugnrale00lejegoog"},
  stutterheim1806fr2: {au:"K. von Stutterheim (notes by a French officer)", ti:"La Bataille d'Austerlitz, par le général-major autrichien Stutterheim. Seconde édition, avec des notes par un officier français", pub:"Paris, Fain, Debray, Mongie, Delaunay", d:1806, kind:"primary-text", url:"https://archive.org/details/bub_gb_bLCe2qyA_D8C", ia:"bub_gb_bLCe2qyA_D8C"},
  ujezd2025: {au:"Město Újezd u Brna", ti:"Cesta přírodou: naučná stezka Újezd u Brna, stop 'Kaple sv. Antonína' (after the chronicle of church buildings, c. 1900)", pub:"municipal website, fetched 14 October 2026", d:2025, kind:"modern-web-specialist", url:"https://ujezdubrna.cz/mesto/stezka/naucna-stezka-ujezd-u-brna/bod/kaple-sv-antonina"},
  turistika_kaple: {au:"turistika.cz (user contribution)", ti:"Újezd u Brna - kaple sv. Antonína Paduánského (no source named)", pub:"tourist website, last updated 2 December 2023, fetched 14 October 2026", d:2023, kind:"modern-web-specialist", url:"https://www.turistika.cz/mista/ujezd-u-brna-kaple-sv-antonina-paduanskeho/detail"},
  czartoryski1887: {au:"A. Czartoryski (ed. Ch. de Mazade)", ti:"Mémoires du prince Adam Czartoryski et correspondance avec l'empereur Alexandre Ier, t. I", pub:"Paris, Plon", d:1887, kind:"primary-text", url:"https://archive.org/details/mmoiresduprincea01czar", ia:"mmoiresduprincea01czar"},
  austerlitzorg2000: {au:"Team Austerlitz (austerlitz.org)", ti:"The first cannon shot (no source named)", pub:"website, posted 4 May 2000, fetched 14 October 2026", d:2000, kind:"modern-web-specialist", url:"https://www.austerlitz.org/en/?p=36"},
  wolny1836: {au:"G. Wolny", ti:"Die Markgrafschaft Mähren, topographisch, statistisch und historisch geschildert, Bd. II, Abth. 1 (Brünner Kreis)", pub:"Brünn", d:1836, kind:"specialist", url:"https://archive.org/details/10011827bsb", ia:"10011827bsb"},
  thiers1847: {au:"A. Thiers", ti:"Histoire du Consulat et de l'Empire, t. VI", pub:"Paris, Paulin", d:1847, kind:"specialist", url:"https://archive.org/details/histoireduconsul06thieuoft", ia:"histoireduconsul06thieuoft"},
  /* Stage 8, implementation PR 8G (decision 248 (a)): the works read for the villages' buildings and landmarks (docs/stage8-evidence/8g/sources.md,
     readings-texts.md, readings-cadastre.md); each title page read on its image */
  schwoy1793: {au:"F. J. Schwoy", ti:"Topographie vom Markgrafthum Mähren, Zweyter Band, enthält den Brünner und Hradischer-Kreis", pub:"Wien, Joseph Hraschanzky", d:1793, kind:"specialist", url:"https://archive.org/details/10011319bsb", ia:"10011319bsb"},
  wolny1837: {au:"G. Wolny", ti:"Die Markgrafschaft Mähren, topographisch, statistisch und historisch geschildert, Bd. II, Abth. 2 (Brünner Kreis)", pub:"Brünn, Selbstverlag; L. W. Seidel", d:1837, kind:"specialist", url:"https://archive.org/details/10011828bsb", ia:"10011828bsb"},
  wolnykt1_1856: {au:"G. Wolný", ti:"Kirchliche Topographie von Mähren, meist nach Urkunden und Handschriften, II. Abtheilung: Brünner Diöcese, Bd. I", pub:"Brünn, Selbstverlag; Nitsch und Grosse", d:1856, kind:"specialist", url:"https://www.digitale-sammlungen.de/view/bsb10028418"},
  wolnykt2_1858: {au:"G. Wolný", ti:"Kirchliche Topographie von Mähren, II. Abtheilung: Brünner Diöcese, Bd. II", pub:"Brünn, Selbstverlag; Nitsch und Grosse", d:1858, kind:"specialist", url:"https://archive.org/details/10028419bsb", ia:"10028419bsb"},
  wolnykt3_1860: {au:"G. Wolný", ti:"Kirchliche Topographie von Mähren, II. Abtheilung: Brünner Diöcese, Bd. III", pub:"Brünn, Selbstverlag; A. Nitsch", d:1860, kind:"specialist", url:"https://www.digitale-sammlungen.de/view/bsb10028420"},
  instruction1824: {au:"(official; no author or office printed)", ti:"Instruction zur Ausführung der zum Behufe des allgemeinen Catasters in Folge des 8ten und 9ten Paragraphes des Allerhöchsten Patentes vom 23. December 1817 angeordneten Landes-Vermessung", pub:"Wien, k. k. Hof- und Staats-Aerarial-Druckerey", d:1824, kind:"regulation", url:"https://ulb-digital.uibk.ac.at/content/titleinfo/19050"},
  mza_sokolnitz1825: {au:"(the stable cadastre's survey: Geometer W. Krautzky, Adjunct F. Knoblech, as the sheet's title reads them)", ti:"Indication sketch of the Gemeinde Sokolnitz, 1825 (MOR246318250)", pub:"Moravský zemský archiv v Brně, fund D9 Indikační skici", d:1825, kind:"primary-image", url:"https://www.mza.cz/indikacniskici/skica/detail/MOR246318250"},
  mza_telnitz1825: {au:"(the stable cadastre's survey)", ti:"Indication sketch of the Gemeinde Tellnitz, 1825 (MOR265518250)", pub:"Moravský zemský archiv v Brně, fund D9 Indikační skici", d:1825, kind:"primary-image", url:"https://www.mza.cz/indikacniskici/skica/detail/MOR265518250"},
  mza_pratzen1826: {au:"(the stable cadastre's survey)", ti:"Indication sketch of the Gemeinde Pratze, 1826, with its detail pieces of the village (MOR205818260)", pub:"Moravský zemský archiv v Brně, fund D9 Indikační skici", d:1826, kind:"primary-image", url:"https://www.mza.cz/indikacniskici/skica/detail/MOR205818260"},
  mza_kobelnitz1825: {au:"(the stable cadastre's survey)", ti:"Indication sketch of the Gemeinde Kobelnitz with the enclave Puntowitz, 1825 (MOR102418250)", pub:"Moravský zemský archiv v Brně, fund D9 Indikační skici", d:1825, kind:"primary-image", url:"https://www.mza.cz/indikacniskici/skica/detail/MOR102418250"},
  npu1000133864: {au:"Národní památkový ústav", ti:"Památkový katalog, record 1000133864: kaple sv. Gottharda, Holubice (its annotation, read through the NPÚ geoportal's layers 5 and 12)", pub:"NPÚ geoportal, read 28 October 2026", d:2026, kind:"modern-web-specialist", url:"https://pamatkovykatalog.cz/x-14918913"}
};

/* dress classes: one per kind of dress the sources describe for a class of troops present. nation and arm as data.js
   uses them; mount, foot or horse, groups the shares of a formation's composition (appearanceOf); carry names the
   COLOURS_CARRIED entry of the class's units. */
var DRESS = {
  /* ---------------- France ---------------- */
  fr_line: {nation:"fr", arm:"inf", mount:"foot", carry:"fr_eagle_inf", name:"French line infantry (fusiliers; the battalions' grenadier and voltigeur companies in the notes)",
    coat:{v:"habit bleu avec revers, retroussis et pattes de parements blancs ; collet et passe-poils rouges", en:"blue coat, white lapels, turnbacks and cuff flaps, red collar and piping", c:"dark blue",
      src:"fieffe2_1854", at:"t. II, pp. 17-18, footnote", gr:"B", lab:"fact", q:"habit bleu avec revers, retroussis et pattes de parements blancs",
      note:"Bardin dates the national-blue coat from 1793 'maintenu jusqu'en 1806', the white coat ordered only in 1806 (bardin17_1851, 'Uniforme', p. 5161): blue on the day (derived)"},
    facings:{v:"revers, retroussis et pattes de parements blancs ; collet et passe-poils rouges", en:"white lapels, turnbacks and cuff flaps; red collar and piping", src:"fieffe2_1854", at:"t. II, p. 17", gr:"B", lab:"fact",
      q:"collet et passe-poils rouges", note:"the cuff colour is not given; the voltigeur companies, created for the line on 19 September 1805, had the light infantry's chamois collar (berriat2_1812, nos. 59-60), whether by 2 December is uncertain"},
    legwear:{gen:true, why:"no read source gives the line infantry's breeches colour for 1805 unambiguously: Fieffé's 'pantalon de même couleur' (t. II, p. 17) does not say which colour it repeats; the police regulation of 1792, printed in 1813 as in force, prescribes black gaiters on duty and grey linen gaiters on the march (bardin_memorial1813, no. 106, p. 157)"},
    head:{v:"chapeau", en:"the hat (bicorne)", h:"bicorne", src:"corr11_1863", at:"no. 9541, 30e Bulletin de la Grande Armée, Austerlitz, 12 frimaire an XIV, pp. 450-452", dated:"1805-12-03", gr:"A", lab:"fact",
      q:"les chapeaux au bout des baïonnettes",
      note:"agrees: Barrès saw the 1st corps pass 'les chapeaux au bout des épées, des sabres, des baïonnettes' (barres1923, p. 56); the decree of 25 February 1806 makes the shako the line's headgear only 'à dater du renouvellement de 1807' (berriat3_1812, no. 467, p. 227); Bardin's transition 'De 1804 à 1806' (bardin4_1849, p. 1159) leaves room for some regiments in shakos, none identified. The grenadier companies held both bearskins and hats (a grenadier company's losses of 2 November 1805: '20 bonnets à poil [...] 36 chapeaux', alombert4_1908, pp. 435-436)"},
    greatcoat:{v:"capote", lab:"disputed", gr:"C", worn:null,
      sides:[
        {v:"aucun corps n'a encore reçu ses capotes", src:"alombert4_1908", at:"p. 321 (Vandamme to Soult, Mettenheim, 8 brumaire an XIV)", dated:"1805-10-30", gr:"A", lab:"fact", q:"aucun corps n'a encore reçu ses capotes"},
        {v:"J'ai ici des capotes plus qu'il ne m'en faut", src:"corr11_1863", at:"no. 9506, to Dejean, Znaim, p. 424", dated:"1805-11-18", gr:"A", lab:"fact", q:"J'ai ici des capotes plus qu'il ne m'en faut"},
        {v:"faire confectionner des capotes", src:"corr11_1863", at:"no. 9572, ordre du jour, Schönbrunn, p. 477", dated:"1805-12-14", gr:"A", lab:"fact", q:"On doit profiter de l'armistice pour faire confectionner des capotes"}],
      note:"no read source says what the line infantry wore over the coat in the fighting; greatcoats were short in October and November, made from captured Austrian cloth in November (corr11_1863, nos. 9460, 9482), and still to be made on 14 December; no colour is stated (Bardin: at first 'de toutes couleurs', bardin4_1849, p. 1018). Decision 101: the regulation coat is drawn; the dossier says greatcoats may have been worn"}},
  fr_light: {nation:"fr", arm:"inf", mount:"foot", carry:"fr_eagle_inf", name:"French light infantry (chasseurs; the carabinier and voltigeur companies in the notes)",
    coat:{v:"l'habit-veste et le pantalon bleus ; [...] revers et parements en pointe", en:"blue habit-veste, pointed lapels and cuffs, turnbacks piped white", c:"dark blue",
      src:"fieffe2_1854", at:"t. II, pp. 28-29, footnote", gr:"B", lab:"fact", q:"portait l'habit-veste et le pantalon bleus",
      note:"Martinet's light infantry chasseur of 1807 (martinet_tf, pl. 23) agrees: blue coat with pointed lapels piped white, red collar; collar red for carabiniers and centre companies, yellow (Fieffé) or chamois (the arrêté of 22 ventôse an XII, berriat2_1812, no. 59) for voltigeurs"},
    legwear:{v:"le pantalon bleu", en:"blue trousers", c:"dark blue", src:"fieffe2_1854", at:"t. II, pp. 28-29", gr:"B", lab:"fact", q:"l'habit-veste et le pantalon bleus"},
    head:{v:"schako", en:"the shako", h:"shako", src:"bardin15_1850", at:"article 'Schako d'infanterie', p. 4789", gr:"B", lab:"fact", q:"Toute l'infanterie légère en fut coiffée en l'an six",
      note:"the decision of 4 brumaire an X (26 October 1801) recognised the plain shako for the light infantry (bardin15_1850, p. 4788); the carabiniers' bearskin until 1812 (Fieffé) against an undated Martinet carabinier in a shako: not settled for 1805"},
    greatcoat:{v:"capote", lab:"disputed", gr:"C", worn:null,
      sides:[
        {v:"aucun corps n'a encore reçu ses capotes", src:"alombert4_1908", at:"p. 321 (Vandamme's division, which held the 24e légère)", dated:"1805-10-30", gr:"A", lab:"fact", q:"aucun corps n'a encore reçu ses capotes"},
        {v:"J'ai ici des capotes plus qu'il ne m'en faut", src:"corr11_1863", at:"no. 9506, p. 424", dated:"1805-11-18", gr:"A", lab:"fact", q:"J'ai ici des capotes plus qu'il ne m'en faut"}],
      note:"as for the line infantry (DRESS.fr_line.greatcoat)"}},
  fr_gren_line: {nation:"fr", arm:"inf", mount:"foot", carry:"fr_elite_none", name:"Oudinot's grenadiers réunis: elite battalions of line regiments",
    coat:{v:"grenadiers [...] habit bleu (each company in its regiment's dress)", en:"the line infantry's blue coat", c:"dark blue", src:"fieffe2_1854", at:"t. II, pp. 17-18", gr:"C", lab:"inference", q:"habit bleu avec revers, retroussis et pattes de parements blancs",
      note:"no read source describes the grenadiers réunis' coats; that each company kept its parent regiment's dress is an inference (Bardin names them 'tant grenadiers que carabiniers', bardin9_1849, p. 2659)"},
    legwear:{gen:true, why:"as the line infantry's (DRESS.fr_line.legwear): not settled"},
    head:{v:"schako or bonnet à poil", lab:"disputed", gr:"C", h:"generic",
      sides:[
        {v:"l'adoption des schakos", en:"shakos adopted at Arras in 1804", src:"bardin9_1849", at:"article 'Grenadiers réunis', p. 2659", gr:"B", lab:"fact", q:"l'adoption des schakos"},
        {v:"en grande tenue, bonnets à poil et plumets au vent", en:"the reserve of 20 elite battalions, 10 of them 'grenadiers et voltigeurs réunis', in full dress and bearskins", src:"barres1923", at:"p. 56 (view f84)", gr:"B", lab:"fact", q:"en grande tenue, bonnets à poil et plumets au vent"}],
      note:"Coignet's 'vingt-cinq mille bonnets à poils' (coignet1909, p. 122) is a figure of speech for the Guard with Oudinot's grenadiers; decision 103: the generic cap, the dispute in the dossier"},
    greatcoat:{v:"en grande tenue", en:"the reserve marched in full dress", worn:false, src:"barres1923", at:"p. 56", gr:"B", lab:"uncertain", q:"en grande tenue",
      note:"one witness, who places the 10 battalions of grenadiers réunis in the reserve he describes"}},
  fr_gren_light: {nation:"fr", arm:"inf", mount:"foot", carry:"fr_elite_none", name:"Oudinot's grenadiers réunis: elite battalions of light regiments (carabiniers and voltigeurs)",
    coat:{v:"l'habit-veste [...] bleu (each company in its regiment's dress)", en:"the light infantry's blue coat", c:"dark blue", src:"fieffe2_1854", at:"t. II, pp. 28-29", gr:"C", lab:"inference", q:"portait l'habit-veste et le pantalon bleus",
      note:"as fr_gren_line: the coats are an inference from the parent class"},
    legwear:{v:"le pantalon bleu", en:"blue trousers (the light infantry's)", c:"dark blue", src:"fieffe2_1854", at:"t. II, pp. 28-29", gr:"C", lab:"inference", q:"l'habit-veste et le pantalon bleus"},
    head:{v:"schako or bonnet à poil", lab:"disputed", gr:"C", h:"generic",
      sides:[
        {v:"l'adoption des schakos", src:"bardin9_1849", at:"article 'Grenadiers réunis', p. 2659", gr:"B", lab:"fact", q:"l'adoption des schakos"},
        {v:"en grande tenue, bonnets à poil et plumets au vent", src:"barres1923", at:"p. 56 (view f84)", gr:"B", lab:"fact", q:"en grande tenue, bonnets à poil et plumets au vent"}],
      note:"as fr_gren_line"},
    greatcoat:{v:"en grande tenue", worn:false, src:"barres1923", at:"p. 56", gr:"B", lab:"uncertain", q:"en grande tenue"}},
  fr_guard_gren: {nation:"fr", arm:"guard", mount:"foot", carry:"fr_guard_eagle", name:"Imperial Guard: grenadiers à pied",
    coat:{v:"L'habit des grenadiers était bleu de roi; collet bleu [...] revers blancs, taillés carrément [...] paremens écarlates", en:"royal blue, blue collar, square white lapels, scarlet cuffs", c:"dark blue",
      src:"perrot1821", at:"'Garde des consuls. Grenadiers à pied', pp. 209-210 (views f219-f220)", gr:"B", lab:"inference", q:"L'habit des grenadiers était bleu de roi", note:"Perrot's pages describe the Garde des consuls of 1800; at the formation of the Imperial Guard he names only the bonnet plate, the buttons and the giberne as changed (p. 212), so that this held in 1805 is an inference (the step-4 second reading)"},
    facings:{v:"collet bleu [...] revers blancs [...] paremens écarlates [...] pates blanches, à trois pointes ; doublure écarlate", src:"perrot1821", at:"p. 209", gr:"B", lab:"inference", q:"revers blancs, taillés carrément", note:"Perrot's pages describe the Garde des consuls of 1800; at the formation of the Imperial Guard he names only the bonnet plate, the buttons and the giberne as changed (p. 212), so that this held in 1805 is an inference (the step-4 second reading)"},
    legwear:{v:"Veste et culotte blanches", en:"white waistcoat and breeches; black gaiters above the knee", c:"white", src:"perrot1821", at:"pp. 209-210", gr:"B", lab:"inference", q:"Veste et culotte blanches", note:"Perrot's pages describe the Garde des consuls of 1800; at the formation of the Imperial Guard he names only the bonnet plate, the buttons and the giberne as changed (p. 212), so that this held in 1805 is an inference (the step-4 second reading)"},
    head:{v:"Bonnet d'oursin, garni d'une plaque", en:"the bearskin with a plate, red plume", h:"bearskin", src:"perrot1821", at:"pp. 210, 212", gr:"B", lab:"inference", q:"Bonnet d'oursin, garni d'une plaque",
      note:"worn on the day: Barrès, 'en grande tenue, bonnets à poil et plumets au vent' (barres1923, p. 56); Coignet, 'vingt-cinq mille bonnets à poils' (coignet1909, p. 122). The bearskin and the red plume are the Garde des consuls' (p. 210) and the crowned eagle plate the imperial formation's (p. 212): that the rest held in 1805 is an inference (the step-4 second reading)"},
    greatcoat:{v:"en grande tenue", en:"the Guard's reserve marched in full dress", worn:false, src:"barres1923", at:"p. 56 (view f84)", gr:"B", lab:"fact", q:"en grande tenue",
      note:"Perrot gives the grenadiers a single-breasted blue greatcoat (perrot1821, p. 213); Barrès's vélites of the chasseurs had made the campaign in linen smocks and received greatcoats only at Freysing, 10-27 December (barres1923, p. 61)"}},
  fr_guard_chass: {nation:"fr", arm:"guard", mount:"foot", carry:"fr_guard_eagle", name:"Imperial Guard: chasseurs à pied",
    coat:{v:"semblable pour les couleurs à celui des grenadiers à pied; les revers étaient, ainsi que les paremens, taillés en pointes", en:"the grenadiers' colours, pointed lapels and cuffs", c:"dark blue",
      src:"perrot1821", at:"'Chasseurs à pied', pp. 226-227 (views f236-f237)", gr:"B", lab:"inference", q:"semblable pour les couleurs à celui des grenadiers à pied", note:"Perrot's grenadiers' coat is the Garde des consuls' of 1800 (p. 209); at the formation of the Imperial Guard he names only the bonnet plate, the buttons and the giberne as changed (p. 212), so that this held in 1805 is an inference (the step-4 second reading)"},
    legwear:{v:"semblable pour les couleurs à celui des grenadiers à pied", en:"white, as the grenadiers'", c:"white", src:"perrot1821", at:"p. 226", gr:"B", lab:"derived", q:"semblable pour les couleurs"},
    head:{v:"Le bonnet sans plaque, ni sommet, orné de cordon blanc à deux glands", en:"the bearskin without plate", h:"bearskin", src:"perrot1821", at:"p. 226", gr:"B", lab:"inference", q:"Le bonnet sans plaque", note:"the page says 'bonnet'; 'bearskin' follows from the grenadiers' 'bonnet d'oursin' (pp. 210, 232): an inference (the step-4 second reading)"},
    greatcoat:{v:"en grande tenue", worn:false, src:"barres1923", at:"p. 56 (view f84)", gr:"B", lab:"fact", q:"en grande tenue", note:"as the grenadiers'; Barrès was a vélite of the chasseurs à pied"}},
  it_guard: {nation:"fr", arm:"guard", mount:"foot", carry:"it_guard_eagle", name:"Royal Guard of the Kingdom of Italy (Guardia Reale), attached to the Imperial Guard",
    coat:{gen:true, why:"no read source describes the Italian Royal Guard's dress in 1805 (Zanoli 1845, t. II, read: no dress; Fieffé: not found)"},
    legwear:{gen:true, why:"not found"}, head:{gen:true, why:"not found"}, greatcoat:{gen:true, why:"not found"}},
  fr_gen_inf: {nation:"fr", arm:"inf", mount:"foot", carry:"fr_eagle_inf", name:"French infantry, dress not sourced (the Tirailleurs corses)",
    coat:{gen:true, why:"no read source describes the Tirailleurs corses' dress (Fieffé, which covers foreign corps, does not include them)"},
    legwear:{gen:true, why:"not found"}, head:{gen:true, why:"not found"}, greatcoat:{gen:true, why:"not found"}},
  fr_cuirassier: {nation:"fr", arm:"cav", mount:"horse", carry:"fr_eagle_cav", name:"French cuirassiers",
    coat:{v:"Cuirassiers 2. Rég. (plate, 1808): dark blue coat with scarlet facings", en:"dark blue coat", c:"dark blue", src:"martinet_tf", at:"pl. 67 '(1808)', view f71", gr:"B", lab:"inference", q:"Cuirassiers 2. Rég.",
      note:"an image of 1808: its colours read from the plate, not from text; Bardin: the cavalry's coats long, except the hussars', until the decree of 7 February 1812 (bardin4_1849, p. 1093)"},
    cuirass:{has:true, v:"donna la Cuirasse à tous les corps de grosse cavalerie [...] composées d'un plastron et d'un dos", en:"breast and back plates, given to all heavy cavalry under the Consulate", src:"bardin6_1849", at:"article 'Cuirasse de cavalerie française', p. 1770", gr:"B", lab:"fact", q:"donna la Cuirasse à tous les corps de grosse cavalerie"},
    legwear:{v:"la culotte de peau à toute la Cavalerie", en:"leather breeches (white in Martinet's plate of 1808)", c:"white", src:"bardin4_1849", at:"article 'Cavalerie française', p. 1093", gr:"B", lab:"fact", q:"la culotte de peau à toute la Cavalerie"},
    head:{v:"Cuirassiers 2. Rég. (plate, 1808): steel helmet, brass crest, black horsehair mane, fur turban", en:"the metal helmet with crest and mane", h:"metal helmet", src:"martinet_tf", at:"pl. 67 '(1808)', view f71", gr:"B", lab:"inference", q:"Cuirassiers 2. Rég."},
    furniture:{v:"dark blue saddle-cloth edged white (plate, 1808)", en:"dark blue saddle-cloth", src:"martinet_tf", at:"pl. 67, view f71", gr:"B", lab:"inference", q:"Cuirassiers 2. Rég."},
    greatcoat:{gen:true, why:"no read source gives the cuirassiers' cloak or says whether cloaks were worn on 2 December"}},
  fr_carabinier: {nation:"fr", arm:"cav", mount:"horse", carry:"fr_eagle_cav", name:"French carabiniers (1er and 2e)",
    coat:{v:"Carabinier à cheval 1. Régiment (plate, undated): dark blue coat, red collar and lapels", en:"dark blue coat", c:"dark blue", src:"martinet_tf", at:"pl. 104, view f90 (no printed year)", gr:"C", lab:"uncertain", q:"Carabinier à cheval 1. Régiment"},
    cuirass:{v:"cuirass or none", lab:"disputed", gr:"C", has:null,
      sides:[
        {v:"donna la Cuirasse à tous les corps de grosse cavalerie", en:"read literally, all heavy cavalry under the Consulate; the same paragraph, in the present tense and undated (Bardin's own time), says the cuirasses are proper to the cuirassiers and the carabiniers, not to all the heavy cavalry, and describes the carabiniers' copper-covered cuirass; it does not date the carabiniers' cuirass to 1805", src:"bardin6_1849", at:"p. 1770", gr:"B", lab:"inference", q:"donna la Cuirasse à tous les corps de grosse cavalerie"},
        {v:"no cuirass (plate, undated within 1807-1813)", src:"martinet_tf", at:"pl. 104, view f90", gr:"C", lab:"uncertain", q:"Carabinier à cheval 1. Régiment"}],
      note:"decision 104: a class-level feature is drawn only where sourced and undisputed"},
    legwear:{v:"la culotte de peau à toute la Cavalerie", c:"white", src:"bardin4_1849", at:"p. 1093", gr:"B", lab:"fact", q:"la culotte de peau à toute la Cavalerie"},
    head:{v:"bearskin without plate, red plume (plate, undated)", en:"the bearskin", h:"bearskin", src:"martinet_tf", at:"pl. 104, view f90", gr:"C", lab:"uncertain", q:"Carabinier à cheval 1. Régiment"},
    greatcoat:{gen:true, why:"not found"}},
  fr_dragoon: {nation:"fr", arm:"cav", mount:"horse", carry:"fr_eagle_cav", name:"French dragoons",
    coat:{v:"ils ont pris et conservé le vert depuis 1762", en:"green, since 1762", c:"green", src:"bardin7_1849", at:"article 'Dragon français', p. 1936", gr:"B", lab:"fact", q:"ont pris et conservé le vert depuis 1762",
      note:"Martinet's 1st Dragoons of 1807 (martinet_tf, pl. 25): green coat, red lapels and collar"},
    legwear:{v:"leur ancienne culotte de peau", en:"leather breeches (until the Restoration)", c:"white", src:"bardin7_1849", at:"p. 1937", gr:"B", lab:"fact", q:"leur ancienne culotte de peau"},
    head:{v:"un casque [...] casques à bandeaux de peau garnie de son poil", en:"the helmet with a fur band (brass, with fur turban, in Martinet's plate of 1807)", h:"metal helmet", src:"bardin7_1849", at:"pp. 1936-1937", gr:"B", lab:"fact", q:"casques à bandeaux de peau garnie de son poil"},
    furniture:{v:"green saddle-cloth edged white (plate, 1807)", src:"martinet_tf", at:"pl. 25 '(1807)', view f97", gr:"B", lab:"inference", q:"Cavalerie Légère, Dragon 1er Régiment"},
    greatcoat:{gen:true, why:"no read source gives the dragoons' cloak for 1805"}},
  fr_hussar2: {nation:"fr", arm:"cav", mount:"horse", carry:"fr_eagle_lightcav", name:"French 2e hussards",
    coat:{v:"Hussard 2e Régiment (plate, 1807): brown dolman and pelisse with white braid", en:"brown dolman and pelisse", c:"brown", src:"martinet_tf", at:"pl. 7 '(1807)', view f210", gr:"B", lab:"inference", q:"Hussard 2e Régiment"},
    legwear:{v:"sky-blue breeches (plate, 1807)", c:"sky blue", src:"martinet_tf", at:"pl. 7, view f210", gr:"B", lab:"inference", q:"Hussard 2e Régiment"},
    head:{v:"schako", en:"the shako (shown in the plate)", h:"shako", src:"bardin15_1850", at:"'Schako d'homme de troupe', p. 4788", gr:"B", lab:"fact", q:"reconnaissait le Schako à toute la cavalerie, légère",
      note:"the decision of 4 brumaire an X recognised the plain shako for all the light cavalry; the OCR of this page is poor ('toute la ca- valerie, légère et Ô flNFANTERIE [sic]')"},
    greatcoat:{gen:true, why:"not found"}},
  fr_hussar4: {nation:"fr", arm:"cav", mount:"horse", carry:"fr_eagle_lightcav", name:"French 4e hussards",
    coat:{v:"Hussard 4e Régiment (plate, 1807): dark blue dolman with yellow braid, scarlet pelisse", en:"dark blue dolman, scarlet pelisse", c:"dark blue", src:"martinet_tf", at:"pl. 10 '(1807)', view f214", gr:"B", lab:"inference", q:"Hussard 4e Régiment"},
    legwear:{v:"dark blue breeches (plate, 1807)", c:"dark blue", src:"martinet_tf", at:"pl. 10, view f214", gr:"B", lab:"inference", q:"Hussard 4e Régiment"},
    head:{v:"schako", h:"shako", src:"bardin15_1850", at:"p. 4788", gr:"B", lab:"fact", q:"reconnaissait le Schako à toute la cavalerie, légère"},
    greatcoat:{gen:true, why:"not found"}},
  fr_hussar5: {nation:"fr", arm:"cav", mount:"horse", carry:"fr_eagle_lightcav", name:"French 5e hussards",
    coat:{v:"Hussard 5e Régiment (plate, 1807): sky-blue dolman with yellow braid, white pelisse", en:"sky-blue dolman, white pelisse", c:"sky blue", src:"martinet_tf", at:"pl. 11 '(1807)', view f216", gr:"B", lab:"inference", q:"Hussard 5e Régiment"},
    legwear:{v:"sky-blue breeches (plate, 1807)", c:"sky blue", src:"martinet_tf", at:"pl. 11, view f216", gr:"B", lab:"inference", q:"Hussard 5e Régiment"},
    head:{v:"schako", h:"shako", src:"bardin15_1850", at:"p. 4788", gr:"B", lab:"fact", q:"reconnaissait le Schako à toute la cavalerie, légère"},
    greatcoat:{gen:true, why:"not found"}},
  fr_chasseur5: {nation:"fr", arm:"cav", mount:"horse", carry:"fr_eagle_lightcav", name:"French 5e chasseurs à cheval",
    coat:{v:"Dolman jusqu'en 1806", en:"the dolman until 1806 (dark green, yellow collar and braid, in Martinet's plate of 1808)", c:"dark green", src:"fieffe2_1854", at:"t. II, pp. 30-31, footnote", gr:"B", lab:"fact", q:"Dolmanjusqu'en [sic] 1806",
      note:"the colour from Martinet's 5th chasseurs of 1808 (martinet_tf, pl. 65, view f166)"},
    legwear:{v:"pantalon vert dans la botte", en:"green breeches in the boot", c:"dark green", src:"fieffe2_1854", at:"t. II, pp. 30-31", gr:"B", lab:"fact", q:"pantalon vert dans la botte"},
    head:{v:"shako; colback à flamme pour les compagnies d'élite", en:"the shako; the colback for the elite company", h:"shako", src:"fieffe2_1854", at:"t. II, pp. 30-31", gr:"B", lab:"fact", q:"shako; colback à flamme pour les compagnies d'élite"},
    greatcoat:{gen:true, why:"not found"}},
  fr_guard_grencav: {nation:"fr", arm:"cav", mount:"horse", carry:"fr_guard_eagle_cav", name:"Imperial Guard: grenadiers à cheval",
    coat:{v:"Habit entièrement semblable à celui des grenadiers à pied", en:"the foot grenadiers' coat (royal blue, white lapels)", c:"dark blue", src:"perrot1821", at:"'Grenadiers à cheval', pp. 235-236 (views f245-f246)", gr:"B", lab:"inference", q:"Habit entièrement semblable à celui des gre- nadiers à pied", note:"Perrot's grenadiers' coat is the Garde des consuls' of 1800 (p. 209); at the formation of the Imperial Guard he names only the bonnet plate, the buttons and the giberne as changed (p. 212), so that this held in 1805 is an inference (the step-4 second reading)"},
    legwear:{v:"culotte de peau blanche, et bottes à l'écuyère", en:"white leather breeches, heavy boots", c:"white", src:"perrot1821", at:"p. 235", gr:"B", lab:"fact", q:"culotte de peau blanche"},
    head:{v:"Bonnet d'oursin sans plaque", en:"the bearskin without plate, red plume", h:"bearskin", src:"perrot1821", at:"p. 235", gr:"B", lab:"fact", q:"Bonnet d'oursin sans plaque"},
    horse:{v:"les chevaux noirs, c'est-à-dire les grenadiers à cheval", en:"'the black horses, that is the horse grenadiers', launched against the Russian Guard", c:"black", src:"coignet1909", at:"p. 336 ('Additions et variantes')", gr:"B", lab:"uncertain",
      q:"les chevaux noirs, c'est-à-dire les grenadiers à cheval",
      note:"one participant's memoir, written decades later, giving a nickname; an undated Martinet plate also shows a black horse (martinet_tf, pl. 58, C); no regulation or return found. Graded B under decision 109's terms (documented for the period by a participant), labelled uncertain"},
    furniture:{v:"Housse à pied en drap bleu de roi, bordée d'un double galon de laine jaune", en:"royal-blue housse edged yellow", src:"perrot1821", at:"'Harnachement', p. 244", gr:"B", lab:"fact", q:"Housse à pied en drap bleu de roi"},
    greatcoat:{v:"Manteau blanc avec brandebourgs jaunes, et doublure rouge sur le devant", en:"white cloak", c:"white", worn:null, src:"perrot1821", at:"p. 235", gr:"B", lab:"fact", q:"Manteau blanc",
      note:"whether cloaks were worn in the charge is not stated"}},
  fr_guard_chasscav: {nation:"fr", arm:"cav", mount:"horse", carry:"fr_guard_eagle_cav", name:"Imperial Guard: chasseurs à cheval",
    coat:{v:"Dolman de drap vert [...] Petit uniforme. Habit long en drap vert", en:"green, in either dress (the hussar-style full dress or the long green undress coat)", c:"green", src:"perrot1821", at:"'Chasseurs à cheval', pp. 236-237 (views f246-f247)", gr:"B", lab:"fact", q:"Dolman de drap vert",
      note:"which of the two dresses was worn on campaign in late 1805 is not stated"},
    legwear:{v:"Pantalon de peau jaune, collant (full dress); undress not stated", lab:"uncertain", gr:"C", c:"generic", src:"perrot1821", at:"p. 236", q:"Pantalon de peau jaune"},
    head:{v:"Kolbac (full dress) or Chapeau (undress)", lab:"uncertain", gr:"C", h:"generic", src:"perrot1821", at:"pp. 236-237", q:"Kolbac à flamme rouge",
      note:"the full dress has the colback, the undress 'Chapeau comme ceux des chasseurs à pied'; which was worn on the day is not stated"},
    greatcoat:{gen:true, why:"not found"}},
  fr_mameluke: {nation:"fr", arm:"cav", mount:"horse", carry:"fr_mameluke_none", name:"Imperial Guard: Mamelukes",
    coat:{v:"Le costume des mamelucks était celui de leur nation; il n'était point uniforme", en:"their own costume, not uniform, varying in colour", c:"generic", src:"perrot1821", at:"'Mamelucks', p. 237", gr:"B", lab:"fact", q:"il n'était point uniforme"},
    legwear:{v:"variait par les couleurs des pantalons", c:"generic", src:"perrot1821", at:"p. 237", gr:"B", lab:"fact", q:"variait par les couleurs des pantalons"},
    head:{v:"turbans", en:"turbans, varying in colour", h:"turban", src:"perrot1821", at:"p. 237", gr:"B", lab:"fact", q:"des vestes et des turbans"},
    greatcoat:{gen:true, why:"not found"}},
  fr_foot_art: {nation:"fr", arm:"art", mount:"foot", carry:"fr_art_none", name:"French foot artillery",
    coat:{v:"Canonnier (plate, 1808): dark blue coat, red piping and turnbacks", en:"dark blue coat", c:"dark blue", src:"martinet_tf", at:"view f234 '(1808)'", gr:"B", lab:"inference", q:"Canonnier"},
    legwear:{v:"blue breeches, black gaiters (plate, 1808)", c:"dark blue", src:"martinet_tf", at:"view f234", gr:"B", lab:"inference", q:"Canonnier"},
    head:{v:"shako in the plate of 1808, after the decree of 25 February 1806", lab:"uncertain", gr:"C", h:"generic", src:"martinet_tf", at:"view f234", q:"Canonnier",
      note:"the 1805 headgear (hat or shako) is not stated in any source read. Carriages: olive (yellow ochre with lamp-black), the ironwork black (gassendi1809, t. I, p. 247, B); the Austrian and Russian carriage colours were not found, so decision 109 keeps one colour for all"},
    greatcoat:{gen:true, why:"not found"}},
  fr_guard_art: {nation:"fr", arm:"art", mount:"foot", carry:"fr_art_none", name:"Imperial Guard: foot artillery",
    coat:{v:"Uniforme des grenadiers à pied, avec revers et collet bleus, lisérés de rouge", en:"the grenadiers' cut, blue lapels and collar piped red", c:"dark blue", src:"perrot1821", at:"'Artillerie à pied', pp. 232-233 (views f242-f243)", gr:"B", lab:"inference", note:"whether Perrot's p. 232 describes the consular or the imperial Guard was not established in the step-4 second reading; its 'grenadiers' cut' refers to the consular description of p. 209", q:"Uniforme des grenadiers à pied, avec re- vers et collet bleus"},
    legwear:{v:"veste et culotte bleues", c:"dark blue", src:"perrot1821", at:"p. 232", gr:"B", lab:"fact", q:"veste et culotte bleues"},
    head:{v:"Bonnet d'oursin sans plaque, avec cordon et plumet rouges", h:"bearskin", src:"perrot1821", at:"p. 232", gr:"B", lab:"fact", q:"Bonnet d'oursin sans plaque"},
    greatcoat:{gen:true, why:"not found for the day"}},
  fr_staff: {nation:"fr", arm:"hq", mount:"horse", carry:"hq_none", name:"French generals and staff officers",
    coat:{v:"L'habit grand uniforme des généraux sera de drap bleu national [...] Le collet, de drap écarlate", en:"national blue, scarlet collar and cuffs, gold oak-leaf embroidery", c:"dark blue",
      src:"reglt_gen_an12", at:"ch. I, art. 1, pp. 5-6 (views f15-f16)", gr:"A", lab:"fact", q:"L'habit grand uniforme des généraux sera de drap bleu national",
      inForce:{src:"berriat3_1812", at:"contents of ch. XIV, 4th section", q:"Réglement du premier vendémiaire an 12"},
      note:"aides-de-camp: national blue with sky-blue collar and cuffs (p. 13); adjudants-commandants: national blue, scarlet collar and cuffs (pp. 11-12); in force in 1803 and still printed among the texts in force in 1812 (in force on the day: inference that it was not suspended between)"},
    legwear:{v:"La culotte, en drap bleu, sans broderie", en:"blue breeches, white waistcoat", c:"dark blue", src:"reglt_gen_an12", at:"p. 6", gr:"A", lab:"fact", q:"La culotte, en drap bleu",
      inForce:{src:"berriat3_1812", at:"contents of ch. XIV, 4th section", q:"Réglement du premier vendémiaire an 12"}},
    head:{v:"Le panache sera composé de trois plumes d'autruche", en:"the hat with ostrich plumes by rank", h:"bicorne", src:"reglt_gen_an12", at:"pp. 8-9", gr:"A", lab:"fact", q:"Le panache sera composé de trois plumes d'autruche",
      inForce:{src:"berriat3_1812", at:"contents of ch. XIV, 4th section", q:"Réglement du premier vendémiaire an 12"}},
    furniture:{v:"velours cramoisi [...] drap cramoisi", en:"crimson saddle furniture", src:"reglt_gen_an12", at:"'Équipement du cheval', art. IV, pp. 10-11", gr:"A", lab:"fact", q:"drap cramoisi",
      inForce:{src:"berriat3_1812", at:"contents of ch. XIV, 4th section", q:"Réglement du premier vendémiaire an 12"}},
    greatcoat:{gen:true, why:"not stated for the day (Lejeune's staff slept 'étendu dans son manteau' on the night before)"}},
  /* ---------------- Russia ---------------- */
  ru_musk: {nation:"ru", arm:"inf", mount:"foot", carry:"ru_inf", name:"Russian musketeer regiments",
    coat:{v:"Мундиръ полагался двубортный, изъ темнозеленаго сукна", en:"double-breasted, dark-green cloth; collar and cuffs in the inspection's colour, shoulder straps by regiment", c:"dark green",
      src:"viskovatov10_1900", at:"p. 196 (leaf n199); plate 1274", gr:"B", lab:"fact", q:"изъ темнозеленаго сукна",
      note:"the table of 30 April 1802 via a specialist work; no change to the coat's colour or cut before the battle in Viskovatov's chronology"},
    facings:{v:"съ стоячимъ воротникомъ, въ каждой Инспекціи особаго цвѣта; съ обшлагами по цвѣту воротника", en:"collar and cuffs in the inspection's colour", src:"viskovatov10_1900", at:"p. 196", gr:"B", lab:"fact", q:"въ каждой Инспекціи особаго цвѣта"},
    legwear:{v:"Панталоны, изъ бѣлаго сукна", en:"white cloth trousers", c:"white", src:"viskovatov10_1900", at:"p. 197 (leaf n200)", gr:"B", lab:"fact", q:"Панталоны, изъ бѣлаго сукна"},
    head:{v:"шапки [...] по другому образцу [...] построить же ихъ по прошествіи срока сукну на старыхъ шапкахъ", en:"the black cloth cap of 1803, replaced by the 1805 pattern only as the old caps wore out: either a tall cylindrical cloth cap with a peak", h:"shako",
      src:"psz44_2_1830", at:"p. 67, no. 21,621 (order of 13 February 1805, OS)", dated:"1805-02-13", gr:"A", lab:"fact", q:"построить же ихъ по прошествіи срока сукну на старыхъ шапкахъ",
      note:"the 1803 order (no. 20,927): 'вмѣсто шляпъ, быть шапкамъ изъ чернаго сукна' for all infantry, artillery and jäger regiments (psz44_2_1830, p. 67); officers kept hats (viskovatov10_1900, p. 207); the order of 23 December 1805 lets officers in Georgia wear the men's caps because hats exposed them (psz28_1830, no. 21,969)"},
    greatcoat:{v:"Шинель,—изъ некрашенаго сукна, темно или свѣтлосѣраго", en:"undyed cloth, dark or light grey, one shade in a regiment", c:"grey", worn:null, src:"viskovatov10_1900", at:"p. 198 (leaf n201)", gr:"B", lab:"uncertain", q:"изъ некрашенаго сукна",
      note:"held in 1805 (carried on carts in September: mikhailovsky1844, p. 36); gathered from the dead on the night of the battle (savary1828, t. II, p. 209); three accounts say Russian infantry grounded its packs before action (Lejeune, Savary, Barrès); whether worn in the fighting is not stated by any source read. Decision 101: the regulation coat is drawn"}},
  ru_gren: {nation:"ru", arm:"inf", mount:"foot", carry:"ru_inf", name:"Russian grenadier regiments",
    coat:{v:"Мундиръ полагался двубортный, изъ темнозеленаго сукна", c:"dark green", src:"viskovatov10_1900", at:"p. 196 (the grenadier private's coat)", gr:"B", lab:"fact", q:"изъ темнозеленаго сукна"},
    legwear:{v:"Панталоны, изъ бѣлаго сукна", c:"white", src:"viskovatov10_1900", at:"p. 197", gr:"B", lab:"fact", q:"Панталоны, изъ бѣлаго сукна"},
    head:{v:"гренадерская шапка (1802) or the cap of the order of 13 February 1805", en:"the 1802 grenadier cap with its brass front, or the new cloth cap: which on the day is not established", lab:"uncertain", gr:"C", h:"generic",
      src:"psz44_2_1830", at:"p. 67, no. 21,621", dated:"1805-02-13", q:"построить же ихъ по прошествіи срока сукну на старыхъ шапкахъ",
      note:"the 1802 cap: 'съ бляхою изъ мѣдной латуни, напереди' (viskovatov10_1900, pp. 197-198); its replacement was ordered in February 1805 for when the old caps' cloth had served its term, a term not found"},
    greatcoat:{v:"Шинель,—изъ некрашенаго сукна", c:"grey", worn:null, src:"viskovatov10_1900", at:"p. 198", gr:"B", lab:"uncertain", q:"изъ некрашенаго сукна", note:"as the musketeers'"}},
  ru_jager: {nation:"ru", arm:"inf", mount:"foot", carry:"ru_jager_none", name:"Russian jäger regiments",
    coat:{v:"такого же покроя [...] но только свѣтлозеленый", en:"the musketeer cut, light green (changed to dark green only on 7 November 1807)", c:"light green", src:"viskovatov10_1900", at:"p. 253 (leaf n256); p. 258", gr:"B", lab:"fact", q:"но только свѣтлозеленый"},
    legwear:{v:"Панталоны [...] свѣтлозеленыя", c:"light green", src:"viskovatov10_1900", at:"p. 253", gr:"B", lab:"fact", q:"но только свѣтлозеленыя"},
    head:{v:"round hat or cloth cap", lab:"disputed", gr:"C", h:"generic",
      sides:[
        {v:"вмѣсто бывшихъ у нихъ треугольныхъ шляпъ, даны круглыя", en:"round hats from 16 September 1802, kept until 26 September 1807", src:"viskovatov10_1900", at:"pp. 256-258", gr:"B", lab:"fact", q:"даны круглыя"},
        {v:"Во всѣхъ полкахъ инфантеріи, Артиллеріи и Егерей, вмѣсто шляпъ, быть шапкамъ изъ чернаго сукна", en:"the 1803 order names the jägers among the regiments to wear black cloth caps", src:"psz44_2_1830", at:"p. 67, no. 20,927", dated:"1803", gr:"B", lab:"fact", q:"вмѣсто шляпъ, быть шапкамъ изъ чернаго сукна"},
        {v:"В 1805 г. егерским полкам было велено носить шапку по образцу линейной пехоты", src:"ulyanov1996", at:"p. 61", gr:"C", lab:"uncertain", q:"егерским полкам было велено носить шапку"}],
      note:"decision 103: the generic cap"},
    greatcoat:{v:"Шинель", c:"grey", worn:null, src:"viskovatov10_1900", at:"p. 198 (the infantry greatcoat)", gr:"B", lab:"uncertain", q:"изъ некрашенаго сукна"}},
  ru_guard_inf: {nation:"ru", arm:"guard", mount:"foot", carry:"ru_guard_inf", name:"Russian Guard infantry (Preobrazhensky, Semenovsky, Izmailovsky)",
    coat:{v:"такое же обмундированіе, какое, въ 1802 году, было получено Гренадерскими полками", en:"the grenadier regiments' dark-green coat; collars red (Preobrazhensky), light blue (Semenovsky), dark green (Izmailovsky); cuffs red", c:"dark green",
      src:"viskovatov14_1901", at:"p. 6 (leaf n7); plate 1873", gr:"B", lab:"fact", q:"въ Преображенскомъ полку остались, по прежнему, красные"},
    legwear:{v:"(the grenadier regiments' uniform)", en:"white, as the grenadiers'", c:"white", src:"viskovatov14_1901", at:"p. 6", gr:"B", lab:"derived", q:"такое же обмундированіе"},
    head:{v:"вмѣсто касокъ, повелѣно носить суконныя шапки [...] каски [...] отмѣнены вовсе", en:"cloth caps instead of helmets from 19 October 1804; the helmets abolished on 15 March 1805", h:"shako",
      src:"viskovatov14_1901", at:"pp. 10-11 (leaves n11-n12)", gr:"B", lab:"fact", q:"вмѣсто касокъ, повелѣно носить суконныя шапки",
      note:"the order of 15 March 1805 (psz28_1830, no. 21,661, p. 895) issues the cloth for the caps every year 'сверхъ положенныхъ по штату касокъ'"},
    greatcoat:{v:"Шинель", c:"grey", worn:null, src:"viskovatov10_1900", at:"p. 198 (the grenadier pattern)", gr:"B", lab:"uncertain", q:"изъ некрашенаго сукна"}},
  ru_guard_jager: {nation:"ru", arm:"guard", mount:"foot", carry:"ru_jager_none", name:"Russian Life Guard Jäger Battalion",
    coat:{v:"такое же обмундированіе, какое въ исходѣ 1802 года имѣли Армейскіе Егерскіе полки", en:"the army jägers' light green, with orange collar, cuffs and piping", c:"light green", src:"viskovatov14_1901", at:"p. 28 (leaf n29)", gr:"B", lab:"fact", q:"какое въ исходѣ 1802 года имѣли Армейскіе Егерскіе полки"},
    legwear:{v:"(the army jägers' trousers, piped orange)", c:"light green", src:"viskovatov14_1901", at:"p. 28", gr:"B", lab:"derived", q:"выпушка на полахъ, фалдахъ и панталонахъ"},
    head:{v:"вмѣсто круглыхъ шляпъ, даны суконныя шапки", en:"cloth caps instead of round hats from 19 October 1804", h:"shako", src:"viskovatov14_1901", at:"p. 29 (leaf n30)", gr:"B", lab:"fact", q:"вмѣсто круглыхъ шляпъ, даны суконныя шапки"},
    greatcoat:{v:"Шинель", c:"grey", worn:null, src:"viskovatov10_1900", at:"p. 198", gr:"B", lab:"uncertain", q:"изъ некрашенаго сукна"}},
  ru_cuirassier: {nation:"ru", arm:"cav", mount:"horse", carry:"ru_cuir", name:"Russian cuirassiers",
    coat:{v:"Колетъ полагался двубортный, изъ бѣлой кирзы", en:"white kersey colet; collar and facings by regiment (Her Majesty's Life Cuirassiers: light crimson)", c:"white", src:"viskovatov11_1853", at:"pp. 2-3, 18 (leaves n11-n12, n27)", gr:"B", lab:"fact", q:"изъ бѣлой кирзы"},
    cuirass:{has:false, v:"состоявшіе въ Кирасирскихъ полкахъ кирасы отмѣнены", en:"the cuirasses abolished on 9 August 1801; none reintroduced before the battle", src:"viskovatov11_1853", at:"p. 1 (leaf n10)", gr:"B", lab:"fact", q:"кирасы отмѣнены"},
    legwear:{gen:true, why:"the breeches are described on p. 4 of viskovatov11_1853, read only in OCR, not quoted"},
    head:{v:"каски, изъ черной, лакированной, пумповой кожи [...] гребешка, для густаго, волосянаго плюмажа", en:"black lacquered leather helmet with a crest and a thick black horsehair plume (order of 18 October 1803)", h:"crested helmet",
      src:"viskovatov11_1853", at:"pp. 20-21 (leaves n29-n30)", gr:"B", lab:"fact", q:"изъ черной, лакированной, пумповой кожи",
      note:"the order itself: psz27_1830, no. 20,989, p. 934"},
    horse:{v:"опредѣленнаго цвѣта шерсти не имѣла", en:"no set coat colour (the 1802 regulation; trumpeters on greys and the rest on dark horses only from 1815)", c:"generic", src:"viskovatov11_1853", at:"p. 11 (leaf n20)", gr:"B", lab:"fact", q:"опредѣленнаго цвѣта шерсти не имѣла"},
    furniture:{v:"Чепракъ и чушки, суконные, по цвѣту колетнаго воротника", en:"shabraque in the collar's colour", src:"viskovatov11_1853", at:"p. 9 (leaf n18)", gr:"B", lab:"fact", q:"по цвѣту колетнаго воротника"},
    greatcoat:{gen:true, why:"not established for the day"}},
  ru_dragoon: {nation:"ru", arm:"cav", mount:"horse", carry:"ru_drag", name:"Russian dragoons",
    coat:{v:"Кафтанъ или мундиръ полагался двубортный, изъ свѣтлозеленаго сукна", en:"light-green coat (dark green only from 7 November 1807); collar by regiment, red turnbacks", c:"light green", src:"viskovatov11_1853", at:"p. 36 (leaf n45); p. 52", gr:"B", lab:"fact", q:"изъ свѣтлозеленаго сукна"},
    legwear:{gen:true, why:"described on pp. 38-39 of viskovatov11_1853, read only in OCR, not quoted"},
    head:{v:"вмѣсто шляпъ, даны каски, одного образца съ установленными, въ это же время, для Кирасирскихъ полковъ", en:"the cuirassiers' crested helmet, from 18 October 1803", h:"crested helmet", src:"viskovatov11_1853", at:"p. 48 (leaf n57)", gr:"B", lab:"fact", q:"вмѣсто шляпъ, даны каски"},
    horse:{v:"опредѣленнаго цвѣта шерсти не имѣла", c:"generic", src:"viskovatov11_1853", at:"p. 41 (leaf n50)", gr:"B", lab:"fact", q:"опредѣленнаго цвѣта шерсти не имѣла"},
    greatcoat:{gen:true, why:"not established for the day"}},
  ru_hussar_pavlograd: {nation:"ru", arm:"cav", mount:"horse", carry:"ru_huss_none", name:"Russian Pavlograd Hussars",
    coat:{v:"ментія бирюзовая, дуламанъ темнозеленый", en:"turquoise pelisse, dark-green dolman with turquoise collar and cuffs", c:"dark green", src:"viskovatov11_1853", at:"p. 84 (leaf n93)", gr:"B", lab:"fact", q:"ментія бирюзовая, дуламанъ темнозеленый"},
    legwear:{v:"Чакчиры—оставлены прежнія, изъ бѣлаго сукна", c:"white", src:"viskovatov11_1853", at:"pp. 77-78", gr:"B", lab:"fact", q:"изъ бѣлаго сукна"},
    head:{v:"кивера суконные [...] повелѣно ввести во всѣхъ Гусарскихъ полкахъ", en:"the cloth kiver of 20 August 1803", h:"shako", src:"viskovatov11_1853", at:"pp. 86-88 (leaves n95-n97)", gr:"B", lab:"fact", q:"повелѣно ввести во всѣхъ Гусарскихъ полкахъ"},
    horse:{v:"опредѣленнаго цвѣта шерсти не имѣла", c:"generic", src:"viskovatov11_1853", at:"p. 80 (leaf n89)", gr:"B", lab:"fact", q:"опредѣленнаго цвѣта шерсти не имѣла"},
    greatcoat:{gen:true, why:"not established for the day"}},
  ru_hussar_mariupol: {nation:"ru", arm:"cav", mount:"horse", carry:"ru_huss_none", name:"Russian Mariupol Hussars",
    coat:{v:"ментія синяя, дуламанъ бѣлый", en:"blue pelisse, white dolman with yellow collar and cuffs", c:"white", src:"viskovatov11_1853", at:"p. 83 (leaf n92)", gr:"B", lab:"fact", q:"ментія синяя, дуламанъ бѣлый"},
    legwear:{v:"Чакчиры [...] изъ бѣлаго сукна", c:"white", src:"viskovatov11_1853", at:"pp. 77-78", gr:"B", lab:"fact", q:"изъ бѣлаго сукна"},
    head:{v:"кивера суконные", h:"shako", src:"viskovatov11_1853", at:"pp. 86-88", gr:"B", lab:"fact", q:"повелѣно ввести во всѣхъ Гусарскихъ полкахъ"},
    horse:{v:"опредѣленнаго цвѣта шерсти не имѣла", c:"generic", src:"viskovatov11_1853", at:"p. 80", gr:"B", lab:"fact", q:"опредѣленнаго цвѣта шерсти не имѣла"},
    greatcoat:{gen:true, why:"not established for the day"}},
  ru_hussar_elisavetgrad: {nation:"ru", arm:"cav", mount:"horse", carry:"ru_huss_none", name:"Russian Elisavetgrad Hussars",
    coat:{v:"ментія и дуламанъ палевые; воротникъ и обшлага красные", en:"straw-yellow pelisse and dolman, red collar and cuffs", c:"straw", src:"viskovatov11_1853", at:"p. 85 (leaf n94)", gr:"B", lab:"fact", q:"ментія и дуламанъ палевые"},
    legwear:{v:"Чакчиры [...] изъ бѣлаго сукна", c:"white", src:"viskovatov11_1853", at:"pp. 77-78", gr:"B", lab:"fact", q:"изъ бѣлаго сукна"},
    head:{v:"кивера суконные", h:"shako", src:"viskovatov11_1853", at:"pp. 86-88", gr:"B", lab:"fact", q:"повелѣно ввести во всѣхъ Гусарскихъ полкахъ"},
    horse:{v:"опредѣленнаго цвѣта шерсти не имѣла", c:"generic", src:"viskovatov11_1853", at:"p. 80", gr:"B", lab:"fact", q:"опредѣленнаго цвѣта шерсти не имѣла"},
    greatcoat:{gen:true, why:"not established for the day"}},
  ru_uhlan: {nation:"ru", arm:"cav", mount:"horse", carry:"ru_uhlan_none", name:"Russian Uhlan Regiment of the Tsesarevich Constantine",
    coat:{v:"куртка синяя [...] съ воротникомъ, лацканами, обшлагами, выпушкою и обкладкою полъ алыми", en:"blue kurtka, scarlet collar, lapels, cuffs and piping", c:"dark blue", src:"viskovatov11_1853", at:"p. 114 (leaf n123)", gr:"B", lab:"fact", q:"куртка синяя",
      note:"no lances until 2 May 1806 (p. 115); the drawn class 'dark blue' stands for the printed 'синій' (blue); the author writes 'темносиній' where he means dark blue"},
    legwear:{v:"Панталоны были синія, съ выкладкою и выпушкою алыми", c:"dark blue", src:"viskovatov11_1853", at:"p. 114", gr:"B", lab:"fact", q:"Панталоны были синія", note:"the drawn class 'dark blue' stands for the printed 'синій' (blue); the author writes 'темносиній' where he means dark blue"},
    head:{v:"Строевая шапка синяя", en:"the blue uhlan cap", h:"czapka", src:"viskovatov11_1853", at:"p. 114 (leaf n123); the Tatar and Lithuanian cap, pp. 112-113, for the class", gr:"B", lab:"inference", q:"Строевая шапка синяя", note:"the class 'czapka' reads 'шапка' by the Tatar and Lithuanian cap of pp. 112-113, which p. 114 does not say the uhlans took (it names that cut for the kurtka): an inference"},
    greatcoat:{gen:true, why:"not established for the day"}},
  ru_cossack: {nation:"ru", arm:"cav", mount:"horse", carry:"ru_cossack_none", name:"Don Cossack regiments",
    coat:{v:"чекмень изъ темносиняго сукна, съ выпушкою въ каждомъ полку особаго цвѣта", en:"dark-blue chekmen, piping by regiment (left to the Host Ataman)", c:"dark blue", src:"viskovatov18_1901", at:"p. 6 (leaf n9)", gr:"B", lab:"fact", q:"чекмень изъ темносиняго сукна"},
    legwear:{v:"шаравары темносинія", c:"dark blue", src:"viskovatov18_1901", at:"p. 6", gr:"B", lab:"fact", q:"шаравары темносинія"},
    head:{v:"шапку такую же, какъ и при домашней одеждѣ", en:"the black lambskin cap with a coloured top", h:"fur cap", src:"viskovatov18_1901", at:"pp. 5-6", gr:"B", lab:"fact", q:"шапку такую же, какъ и при домашней одеждѣ"},
    greatcoat:{gen:true, why:"not established for the day"}},
  ru_guard_horse: {nation:"ru", arm:"cav", mount:"horse", carry:"ru_guard_cav", name:"Russian Life Guard Horse Regiment",
    coat:{v:"тоже обмундированіе [...] какіе въ этомъ году, были получены Лейбъ-Кирасирскимъ Его Величества полкомъ, но только воротникъ и обшлага алые", en:"the Life Cuirassiers' white colet with scarlet collar and cuffs", c:"white", src:"viskovatov15_1901", at:"p. 8 (leaf n11)", gr:"B", lab:"fact", q:"воротникъ и обшлага алые",
      note:"Grand Duke Constantine led the Guard on the morning 'въ бѣломъ Конногвардейскомъ колетѣ и въ каскѣ' (mikhailovsky1844, p. 190)"},
    cuirass:{has:false, v:"(the army cuirassiers' dress, which had no cuirass from 1801)", src:"viskovatov11_1853", at:"p. 1", gr:"B", lab:"derived", q:"кирасы отмѣнены"},
    legwear:{gen:true, why:"not quoted"},
    head:{v:"каски, съ густымъ, волосянымъ плюмажемъ [...] со звѣздою, напереди, вмѣсто орла", en:"the crested helmet with a star in front (18 October 1803)", h:"crested helmet", src:"viskovatov15_1901", at:"p. 9 (leaf n12)", gr:"B", lab:"fact", q:"со звѣздою, напереди, вмѣсто орла"},
    horse:{v:"разрѣшено покупать лошадей разношерстныхъ, а не только вороныхъ", en:"horses of mixed colours permitted from 1796 until 1823", c:"generic", src:"stackelberg1881", at:"p. 18 (leaf n28); p. 51", gr:"B", lab:"fact", q:"лошадей разношерстныхъ"},
    furniture:{v:"чепраки и чушки синіе", en:"blue shabraques", src:"viskovatov15_1901", at:"p. 8", gr:"B", lab:"fact", q:"чепраки и чушки синіе", note:"'синіе' is blue; the author writes 'темносиній' where he means dark blue (as the uhlans' and the Guard hussars' records, roadmap step 4)"},
    greatcoat:{gen:true, why:"not established for the day"}},
  ru_chevalier: {nation:"ru", arm:"cav", mount:"horse", carry:"ru_guard_cav", name:"Russian Chevalier Guard Regiment",
    coat:{v:"одинаковыя съ Л.-Гв. Коннымъ полкомъ, только пуговицы бѣлыя", en:"as the Life Guard Horse (white colet), with white buttons and silver lace", c:"white", src:"viskovatov15_1901", at:"p. 9 (leaf n12)", gr:"B", lab:"fact", q:"одинаковыя съ Л.-Гв. Коннымъ полкомъ"},
    cuirass:{has:false, v:"(the Life Guard Horse's dress)", src:"viskovatov15_1901", at:"p. 9", gr:"B", lab:"derived", q:"одинаковыя съ Л.-Гв. Коннымъ полкомъ"},
    legwear:{gen:true, why:"not quoted"},
    head:{v:"каски, съ густымъ, волосянымъ плюмажемъ", h:"crested helmet", src:"viskovatov15_1901", at:"p. 9", gr:"B", lab:"fact", q:"съ густымъ, волосянымъ плюмажемъ"},
    furniture:{v:"чепраки и чушки красные", en:"red shabraques", src:"viskovatov15_1901", at:"p. 9", gr:"B", lab:"fact", q:"чепраки и чушки красные"},
    greatcoat:{gen:true, why:"not established for the day"}},
  ru_guard_hussar: {nation:"ru", arm:"cav", mount:"horse", carry:"ru_huss_none", name:"Russian Life Guard Hussars",
    coat:{v:"доломаны синіе, а ментіи, ташки и валтрапы красные", en:"blue dolman, red pelisse", c:"dark blue", src:"viskovatov15_1901", at:"pp. 23-24 (leaves n26-n27)", gr:"B", lab:"fact", q:"доломаны синіе", note:"the drawn class 'dark blue' stands for the printed 'синій' (blue); the author writes 'темносиній' where he means dark blue"},
    legwear:{gen:true, why:"not quoted (the army hussars' white breeches by the 1803 order, inference)"},
    head:{v:"(the army hussars' dress, 20 August 1803)", en:"the cloth kiver", h:"shako", src:"viskovatov15_1901", at:"p. 24", gr:"B", lab:"derived", q:"положены противъ Армейскихъ Гусарскихъ полковъ"},
    greatcoat:{gen:true, why:"not established for the day"}},
  ru_guard_cossack: {nation:"ru", arm:"cav", mount:"horse", carry:"ru_guard_cav", name:"Russian Life Guard Cossacks",
    coat:{v:"сверхъ красныхъ полукафтаньевъ, темно-синіе, суконные кафтаны", en:"dark-blue kaftans over scarlet half-kaftans (the dress of 1796, kept in 1801)", c:"dark blue", src:"viskovatov9_1900", at:"pp. 24, 26 (leaves n27, n29)", gr:"C", lab:"inference", q:"темно-синіе, суконные кафтаны",
      note:"a description of 1796 carried to 1805 through the 1801 entry 'при прежнемъ его обмундированіи' (viskovatov15_1901, p. 34) and the absence of entries until 1809"},
    legwear:{v:"бирюзовыя, суконныя шировары", c:"turquoise", src:"viskovatov9_1900", at:"p. 24", gr:"C", lab:"inference", q:"бирюзовыя, суконныя шировары"},
    head:{v:"шапки изъ чернаго, Бухарскаго смушка, съ алымъ, суконнымъ мѣшкомъ", h:"fur cap", src:"viskovatov9_1900", at:"p. 24", gr:"C", lab:"inference", q:"шапки изъ чернаго, Бухарскаго смушка"},
    greatcoat:{gen:true, why:"not established for the day"}},
  ru_foot_art: {nation:"ru", arm:"art", mount:"foot", carry:"ru_art_none", name:"Russian foot artillery",
    coat:{v:"темнозеленые мундиры [...] съ воротникомъ, обшлагами и отворотами [...] изъ чернаго сукна", en:"dark green, black facings piped red", c:"dark green", src:"viskovatov12_1900", at:"p. 5 (leaf n8)", gr:"B", lab:"fact", q:"темнозеленые мундиры"},
    legwear:{gen:true, why:"not quoted"},
    head:{v:"вмѣсто шляпъ даны суконныя шапки, съ кожаными козырьками", en:"cloth caps with leather peaks (19 August 1803)", h:"shako", src:"viskovatov12_1900", at:"pp. 6-7", gr:"B", lab:"fact", q:"вмѣсто шляпъ даны суконныя шапки"},
    greatcoat:{gen:true, why:"not established for the day"}},
  ru_staff: {nation:"ru", arm:"hq", mount:"horse", carry:"hq_none", name:"Russian generals and staff",
    coat:{v:"генералы носили, во всѣхъ случаяхъ, мундиры тѣхъ полковъ и частей, въ коихъ состояли", en:"generals wore their regiment's or branch's uniform until 1808", c:"generic", src:"viskovatov17_1901", at:"p. 21 (leaf n24)", gr:"B", lab:"fact", q:"генералы носили, во всѣхъ случаяхъ, мундиры тѣхъ полковъ",
      note:"adjutants-general of the infantry: dark green with red collar, cuffs and turnbacks (p. 24)"},
    legwear:{gen:true, why:"by regiment"},
    head:{v:"шляпы, съ петлицею изъ узкаго, золотаго галуна [...] и съ высокимъ султаномъ", en:"hats with a tall plume", h:"bicorne", src:"viskovatov10_1900", at:"p. 207 (leaf n210)", gr:"B", lab:"fact", q:"съ высокимъ султаномъ"},
    greatcoat:{gen:true, why:"not established for the day"}},
  /* ---------------- Austria ---------------- */
  at_line: {nation:"at", arm:"inf", mount:"foot", carry:"at_inf", name:"Austrian (German and Walloon) line infantry",
    coat:{v:"des weissen, so kostbaren Rockes", en:"the white coat; facings by regiment (Militär-Schematismus 1805)", c:"white", src:"teuber1895", at:"p. 260 (the 1798 Adjustirungsvorschrift as quoted)", gr:"B", lab:"inference", q:"Zur Schonung des weissen, so kostbaren Rockes",
      note:"the regulation's words are about officers; the men's white coat is Teuber's reading (and Wrede: 'Für alle Regimenter ohne Unterschied war die weisse Farbe vorgeschrieben', wrede1_1898, p. 43, of the 1760s)"},
    legwear:{v:"Die deutsche Infanterie bekommt weisse Hosen", en:"white breeches; black gaiters since 1788", c:"white", src:"teuber1895", at:"pp. 254-255 (Hauptmann Koller to FML Staader, 9 September 1798, quoted: a project, 'vieles von dem Projectirten unausgeführt blieb'); the black gaiters pp. 801-802", gr:"C", lab:"inference", q:"Die deutsche Infanterie bekommt weisse Hosen"},
    head:{v:"Helm or older headgear", lab:"disputed", gr:"C", h:"generic",
      sides:[
        {v:"der neueingeführte Helm [...] in denen der Helm seine eigentliche Erprobung zu bestehen hatte", en:"the 1798 helmet, tested in the campaigns of 1805", src:"teuber1895", at:"pp. 258, 355", gr:"B", lab:"fact", q:"in denen der Helm seine eigentliche Erprobung zu bestehen hatte"},
        {v:"nur circa 18 deutsche Regimenter und ein Artillerie-Regiment hatten sie erhalten", en:"only about 18 German regiments had received it", src:"teuber1895", at:"p. 794", gr:"C", lab:"uncertain", q:"nur circa 18 deutsche Regimenter"}],
      note:"which of Kollowrat's regiments had helmets is not stated; most of his battalions were newly raised (Stutterheim); decision 103: the generic cap"},
    greatcoat:{v:"graumelirt [...] von der Farbe der Mäntel der gemeinen Mannschaft", en:"grey-mixed cloth", c:"grey", worn:null, src:"teuber1895", at:"p. 260", gr:"B", lab:"uncertain", q:"graumelirter Ueberrock, von der Farbe der Mäntel der gemeinen Mannschaft",
      note:"whether greatcoats were worn in the battle: not found"}},
  at_grenz: {nation:"at", arm:"inf", mount:"foot", carry:"at_grenz", grenz:true, name:"Austrian Grenz infantry (Broder, 1st and 2nd Szekler)",
    coat:{v:"white or brown", lab:"disputed", gr:"C", c:"generic",
      sides:[
        {v:"der weisse Rock und die »weisse lange Hose« [...] sowie das Casquet", en:"officially the white coat (the 1798 list headed 'Röcke weiss')", src:"teuber1895", at:"p. 275 (c278)", gr:"B", lab:"fact", q:"der weisse Rock und die »weisse lange Hose«"},
        {v:"das weisse Röckel und die weisse Hose gewählt, aber nie ganz eingeführt [...] Man sah weisse und braune Grenzerröcke", en:"the white field coat never fully introduced; white and brown coats seen; the brown field coat only from 18 August 1808", src:"teuber1895", at:"p. 382 (c385)", gr:"C", lab:"fact", q:"Man sah weisse und braune Grenzerröcke"},
        {v:"1798 dunkelbrauner Rock, rosenrothe Egalisierung", en:"the Szekler regiments' table: dark-brown coat from 1798", src:"wrede1_1898", at:"p. 150 (n189); p. 154 (n193)", gr:"C", lab:"uncertain", q:"1798 dunkelbrauner Rock"}],
      note:"SOURCE_NOTE's open question ('whether Grenz infantry wore brown in 1805') stays open (decision 105): drawn generic and labelled. Teuber's source: the enrolled men 'trugen im Frieden ihre braune Hausmontur' (vanicek1875, p. 16). Facings, Militär-Schematismus 1805 (A): Broder 'Gris de lin', white buttons; 1st Szekler 'Rosenroth', yellow; 2nd Szekler 'Rosenroth', white (schem1805, pp. 227, 241, 243)"},
    legwear:{v:"weisse lange Hose (officially) or the ordinary trousers of the home dress", lab:"disputed", gr:"C", c:"generic",
      sides:[
        {v:"die »weisse lange Hose« (zum Unterschiede von der blauen der ungarischen Infanterie)", src:"teuber1895", at:"p. 275", gr:"B", lab:"fact", q:"die »weisse lange Hose«"},
        {v:"der gewöhnlichen Hose", en:"the ordinary trousers of the brown home dress", src:"teuber1895", at:"p. 382", gr:"C", lab:"fact", q:"der gewöhnlichen Hose"}]},
    head:{v:"Casquet or Klobuk", lab:"disputed", gr:"C", h:"generic",
      sides:[
        {v:"das Casquet", src:"teuber1895", at:"p. 275", gr:"B", lab:"fact", q:"sowie das Casquet"},
        {v:"Die alte Grenzer-Kopfbedeckung, der »Klobuk«, war noch 1805 mit Sonnen- und Nackenschirm versehen worden", src:"teuber1895", at:"p. 383 (c386)", gr:"B", lab:"fact", q:"war noch 1805 mit Sonnen- und Nackenschirm versehen worden"}]},
    greatcoat:{gen:true, why:"not found"}},
  at_jager: {nation:"at", arm:"inf", mount:"foot", carry:"at_none", name:"Austrian Wiener Jäger (volunteer companies)",
    coat:{gen:true, why:"the Wiener Jäger's dress was not researched in a source read"}, legwear:{gen:true, why:"not found"}, head:{gen:true, why:"not found"}, greatcoat:{gen:true, why:"not found"}},
  at_cuirassier: {nation:"at", arm:"cav", mount:"horse", carry:"at_cav", name:"Austrian cuirassiers (Nassau, Lothringen, Kaiser)",
    coat:{v:"Röckel von weissem Tuch", en:"white coat; facings by regiment: Kaiser pompadour, Nassau light blue, Lothringen dark blue (schem1805, A)", c:"white", src:"teuber1895", at:"p. 289 (the 1798 cavalry regulation as quoted)", gr:"B", lab:"fact", q:"Röckel von weissem Tuch"},
    cuirass:{has:true, v:"Die Mannschaft trug einfache schwarz lackirte Kürasse", en:"plain black-lacquered cuirasses", src:"teuber1895", at:"p. 812 (c815, OCR)", gr:"B", lab:"fact", q:"einfache schwarz lackirte Kürasse"},
    legwear:{gen:true, why:"the regulation's breeches are described in OCR only (teuber1895, pp. 288-290), not quoted"},
    head:{v:"Helm wie beim gemeinen Infanteristen", en:"the infantry pattern leather helmet with crest", h:"crested helmet", src:"teuber1895", at:"p. 289", gr:"B", lab:"fact", q:"Helm wie beim gemeinen Infanteristen"},
    greatcoat:{gen:true, why:"not found"}},
  at_chevauleger: {nation:"at", arm:"cav", mount:"horse", carry:"at_cav", name:"Austrian chevaulegers (O'Reilly, Nr. 3)",
    coat:{v:"green or white", lab:"disputed", gr:"C", c:"generic",
      sides:[
        {v:"die Chevauxlegers auf unbestimmte Zeit, d. h. bis zum gänzlichen Verbrauch aller grünen Vorräthe, dunkelgrün zu kleiden", en:"dark green until the green stocks were used up (1801), white to follow", src:"teuber1895", at:"pp. 313-314 (OCR)", gr:"B", lab:"fact", q:"dunkelgrün zu kleiden"},
        {v:"(white, the dress decided for the cavalry in 1801)", src:"teuber1895", at:"p. 314", gr:"C", lab:"uncertain", q:"blieb der grüne Chevauxleger, wie wir wissen, neben dem weissen"}],
      note:"the facing, Militär-Schematismus 1805: 'Lichtroth', yellow buttons (schem1805, p. 275, A)"},
    legwear:{gen:true, why:"not found"},
    head:{v:"Helm (the 1798 helmet for the German cavalry)", h:"crested helmet", src:"teuber1895", at:"p. 258", gr:"B", lab:"inference", q:"die Jäger und deutsche Reiterei schmücken sollte"},
    greatcoat:{gen:true, why:"not found"}},
  at_hussar_hh: {nation:"at", arm:"cav", mount:"horse", carry:"at_cav", name:"Austrian Hessen-Homburg Hussars (Nr. 4)",
    coat:{v:"paperlgrüne Pelze u. Dollmanns", en:"parrot-green pelisse and dolman", c:"green", src:"schem1805", at:"p. 285 (view 286)", gr:"A", lab:"fact", q:"paperlgrüne Pelze u. Dollmanns",
      note:"the 1802 decree's light blue for all hussars 'never fully carried out' (teuber1895, pp. 314-315); the army list of 1805 gives the regiment's own colours"},
    legwear:{v:"ponceaurothe Hosen", c:"red", src:"schem1805", at:"p. 285", gr:"A", lab:"fact", q:"ponceaurothe Hosen"},
    head:{v:"Hellblaue Csako", en:"light-blue shako", h:"shako", src:"schem1805", at:"p. 285", gr:"A", lab:"fact", q:"Hellblaue Csako"},
    greatcoat:{gen:true, why:"not found"}},
  at_hussar_szekler: {nation:"at", arm:"cav", mount:"horse", carry:"at_cav", name:"Austrian Szekler Hussars (Nr. 11)",
    coat:{v:"dunkelblaue Pelze, Dollmanns und Hosen", en:"dark-blue pelisse, dolman and breeches", c:"dark blue", src:"schem1805", at:"p. 296 (view 297)", gr:"A", lab:"fact", q:"dunkelblaue Pelze, Dollmanns und Hosen",
      note:"read on the 1805 page images in roadmap step 4b (owner question 195): the line closes the Szekler Nr. 11's box (pp. 295-296), 'Schwarze Csako, dunkelblaue Pelze, Dollmanns und Hosen', white buttons; 'kornblumenblaue', which this record gave until then from p. 297, closes Palatinal Nr. 12's box, as in the 1813 edition"},
    legwear:{v:"dunkelblaue [...] Hosen", c:"dark blue", src:"schem1805", at:"p. 296 (view 297)", gr:"A", lab:"fact", q:"dunkelblaue Pelze, Dollmanns und Hosen", note:"read on the 1805 page images in roadmap step 4b (owner question 195): the Szekler Nr. 11's colour line on p. 296; until then this record gave Palatinal Nr. 12's 'kornblumenblaue' from p. 297"},
    head:{v:"Schwarze Csako", h:"shako", src:"schem1805", at:"p. 296 (view 297)", gr:"A", lab:"fact", q:"Schwarze Csako", note:"the Szekler Nr. 11's colour line on p. 296, read on the page image in roadmap step 4b; Palatinal Nr. 12's on p. 297 also has 'Schwarze Csako'"},
    greatcoat:{gen:true, why:"not found"}},
  at_uhlan_merveldt: {nation:"at", arm:"cav", mount:"horse", carry:"at_cav", name:"Austrian Merveldt Uhlans (Nr. 1), a detachment",
    coat:{v:"grasgr. Kurtka u. Hosen, scharlachr. Aufschläge", en:"grass-green kurtka and trousers, scarlet facings", c:"green", src:"schem1805", at:"p. 299 (view 300)", gr:"A", lab:"fact", q:"grasgr. Kurtka u. Hosen"},
    legwear:{v:"grasgr. [...] Hosen", c:"green", src:"schem1805", at:"p. 299", gr:"A", lab:"fact", q:"grasgr. Kurtka u. Hosen"},
    head:{v:"Kaisergelbe Czapka", h:"czapka", src:"schem1805", at:"p. 299", gr:"A", lab:"fact", q:"Kaisergelbe Czapka"},
    greatcoat:{gen:true, why:"not found"}},
  at_gen_cav: {nation:"at", arm:"cav", mount:"horse", carry:"at_cav", name:"Austrian cavalry, dress not read (the Schwarzenberg Uhlans' detachment; the Erzherzog Johann Dragoons with Miloradovich)",
    coat:{gen:true, why:"the Schwarzenberg Uhlans' and the Erzherzog Johann Dragoons' entries in the army list were not read"}, legwear:{gen:true, why:"not read"}, head:{gen:true, why:"not read"}, greatcoat:{gen:true, why:"not found"}},
  at_art: {nation:"at", arm:"art", mount:"foot", carry:"at_none", name:"Austrian artillery",
    coat:{v:"Rehfarbe und Ponceau", en:"fawn (roe-deer brown) with poppy-red facings", c:"brown", src:"schem1805", at:"pp. 303-304 (views 304-305)", gr:"A", lab:"fact", q:"Rehfarbe und Ponceau",
      note:"Teuber: 'dem braunen Rock mit rothem Kragen, Aufschlägen, Schossfutter und den ungarischen weissen Hosen' (teuber1895, pp. 322-323)"},
    legwear:{v:"den ungarischen weissen Hosen", c:"white", src:"teuber1895", at:"pp. 322-323", gr:"B", lab:"fact", q:"den ungarischen weissen Hosen"},
    head:{v:"der Corséhut (mit zeitweiliger Ablösung durch den Helm und den Dreispitz)", lab:"uncertain", gr:"C", h:"generic", src:"teuber1895", at:"p. 323", q:"Kopfbedeckung war, wie wir wissen, der Corséhut"},
    greatcoat:{gen:true, why:"not found"}}
};

/* each leaf formation's composition (decision 100). parts: the troops the formation's own figures are drawn as, {dress, n,
   unit, v (the regiments in the source's words), src, at, gr, lab, q, note}; unit bn, sqn, regt, coy or men, one unit within
   each mount group (foot, horse); a part's share is its n over its group's total. others: troops of another arm attached
   to the formation, listed but not drawn as its figures (decision 100: mixed-arm formations keep the arm the data gives
   them). A formation whose composition no read source gives takes its dominant class (dominant, with its basis). */
var COMPOSITION = {
  /* ---------------- France ---------------- */
  gqg: {dominant:true, basis:"data.js: the Imperial Headquarters (arm hq), Napoleon, Berthier and the staff; no read source names the escort on the day (Savary: 'l'escadron de son escorte', savary1828, t. II, p. 209, unnamed)",
    parts:[{dress:"fr_staff", n:1, unit:"staff"}]},
  heightguns: {dominant:true, basis:"the IV Corps' foot artillery (5e régiment: eight companies on 28 October, alombert4_1908, p. 729) is the corps artillery the data names; the Guard's 24 pieces that broke the ice at the end (thiebault3_1894, p. 466) are noted, their share of the drawn guns not sourced",
    parts:[{dress:"fr_foot_art", n:1, unit:"dominant"}],
    others:[{dress:"fr_guard_art", n:24, unit:"gun", v:"vingt-quatre pièces d'artillerie de la garde impériale brisèrent la glace", src:"thiebault3_1894", at:"p. 466 (leaf n477)", gr:"B", lab:"fact", q:"vingt-quatre pièces d'artillerie de la garde impériale"}]},
  sthilaire: {note:"the 43e and 55e de ligne (Varé's brigade) followed Vandamme on the day (Thiébault) and are drawn with him, as this reconstruction's order of battle has it",
    parts:[
      {dress:"fr_light", n:2, unit:"bn", v:"10e légère (2 bataillons)", src:"alombert4_1908", at:"p. 727 (situation of 28 October 1805)", gr:"B", lab:"fact", q:"10e légère (2 bataillons)"},
      {dress:"fr_line", n:4, unit:"bn", v:"14e de ligne (2 bataillons) ; 36e de ligne (2 bataillons)", src:"alombert4_1908", at:"p. 727", gr:"B", lab:"fact", q:"14e de ligne (2 bataillons) ; 36e de ligne (2 bataillons)",
        note:"Thiébault's brigade on the day: the 14e (colonel Mazas, two battalions) and the 36e (thiebault3_1894, pp. 467-470)"}]},
  vandamme: {
    parts:[
      {dress:"fr_light", n:2, unit:"bn", v:"24e légère (2 bataillons)", src:"alombert4_1908", at:"p. 728", gr:"B", lab:"fact", q:"24e légère (2 bataillons)"},
      {dress:"fr_line", n:12, unit:"bn", v:"4e de ligne (2 bataillons) ; 28e de ligne (2 bataillons) ; 46e de ligne (2 bataillons) ; 57e de ligne (2 bataillons); with Varé's 43e and 55e", src:"alombert4_1908", at:"pp. 727-728", gr:"B", lab:"inference",
        q:"4e de ligne (2 bataillons) ; 28e de ligne (2 bataillons) ; 46e de ligne (2 bataillons) ; 57e de ligne (2 bataillons)",
        note:"Varé's brigade 'de suivre le mouvement du général Vandamme et de recevoir ses ordres' (thiebault3_1894, p. 467); that it was the 43e and 55e (2 battalions each) is data.js's statement, after Duffy and Smith"}]},
  legrand: {note:"Telnitz was held by the 3e de ligne and the Tirailleurs du Pô (this reconstruction's order of battle)",
    parts:[
      {dress:"fr_line", n:7, unit:"bn", v:"3e de ligne (3 bataillons) ; 75e de ligne (2 bataillons) ; 18e de ligne (2 bataillons)", src:"alombert4_1908", at:"pp. 728-729", gr:"B", lab:"fact", q:"3e de ligne (3 bataillons) ; 75e de ligne (2 bataillons) ; 18e de ligne (2 bataillons)"},
      {dress:"fr_light", n:3, unit:"bn", v:"Tirailleurs du Pô (1 bataillon) ; 26e légère (2 bataillons)", src:"alombert4_1908", at:"p. 729", gr:"B", lab:"fact", q:"Tirailleurs du Pô (1 bataillon) ; 26e légère (2 bataillons)",
        note:"the Tirailleurs du Pô wore 'Celui d'un bataillon d'infanterie légère' (fieffe2_1854, t. II, pp. 28-29)"},
      {dress:"fr_gen_inf", n:1, unit:"bn", v:"Tirailleurs corses (1 bataillon)", src:"alombert4_1908", at:"p. 729", gr:"B", lab:"fact", q:"Tirailleurs corses (1 bataillon)"}]},
  friant: {note:"this reconstruction gives about 3,470 present (Duffy, Smith): only part of the division reached the field; its classes are the division's",
    parts:[
      {dress:"fr_line", n:8, unit:"bn", v:"33e de ligne (2 bataillons) 48e de ligne (2 bataillons) ; 108e de ligne (2 bataillons) ; 111e de ligne (2 bataillons)", src:"alombert4_1908", at:"p. 724", gr:"B", lab:"fact", q:"108e de ligne (2 bataillons) ; 111e de ligne (2 bataillons)"},
      {dress:"fr_light", n:2, unit:"bn", v:"15e légère (2 bataillons)", src:"alombert4_1908", at:"p. 724", gr:"B", lab:"fact", q:"15e légère (2 bataillons)"}]},
  caffarelli: {note:"the 1st division of III Corps, under Bisson on 28 October; that Caffarelli led it at Austerlitz rests on the same work's narrative, in which he replaces the wounded Bisson at its head and commands it to the end of the campaign (alombert4_1908, p. 69)",
    parts:[
      {dress:"fr_light", n:2, unit:"bn", v:"13e légère (2 bataillons)", src:"alombert4_1908", at:"pp. 723-724", gr:"B", lab:"fact", q:"13e légère (2 bataillons)"},
      {dress:"fr_line", n:8, unit:"bn", v:"17e de ligne (2 bataillons) ; 30e de ligne (2 bataillons) ; 51e de ligne (2 bataillons) ; 61e de ligne (2 bataillons)", src:"alombert4_1908", at:"p. 724", gr:"B", lab:"fact", q:"17e de ligne (2 bataillons) ; 30e de ligne (2 bataillons)"}]},
  suchet: {note:"the division's 17e légère (alombert4_1908, p. 732) held the Santon and is drawn there, as the Santon detachment; battalion counts not printed",
    parts:[
      {dress:"fr_line", n:4, unit:"regt", v:"34e de ligne ; 40e de ligne ; 64e de ligne ; 88e de ligne", src:"alombert4_1908", at:"p. 732", gr:"B", lab:"fact", q:"34e de ligne ; 40e de ligne ; 64e de ligne ; 88e de ligne"}]},
  santon: {others:[{dress:"fr_foot_art", n:18, unit:"gun", v:"18 Kanonen", src:"materialien1806", at:"Zusatz 6, pp. 100-101", gr:"B", lab:"fact", q:"mit 18 Kanonen"}],
    parts:[
      {dress:"fr_light", n:1, unit:"regt", v:"Das 17te Regiment leichter Infanterie deckte dieselbe", src:"materialien1806", at:"Zusatz 6, pp. 100-101 (leaves n109-n110)", gr:"B", lab:"fact", q:"Das 17te Regiment leichter Infanterie deckte dieselbe",
        note:"Stutterheim names the 'vingt-septième' (stutterheim1806fr, pp. 98-99): disputed; the Materialien's editor (1806) names the 17te, citing the Campagnes (Paris 1806, p. 297) and Stutterheim's French edition (p. 90) together, without saying that the two differ"}]},
  kellermann: {note:"the I Corps' cavalry division on 28 October; squadrons per regiment not printed; Martinien records officer casualties on 2 December for all four regiments (martinien1899, pp. 585, 616-620)",
    parts:[
      {dress:"fr_hussar2", n:1, unit:"regt", v:"2e hussards", src:"alombert4_1908", at:"pp. 717-718", gr:"B", lab:"fact", q:"2e hussards ; 4e hussards ; 5e hussards ; 5e chasseurs"},
      {dress:"fr_hussar4", n:1, unit:"regt", v:"4e hussards", src:"alombert4_1908", at:"p. 718", gr:"B", lab:"fact", q:"2e hussards ; 4e hussards ; 5e hussards ; 5e chasseurs"},
      {dress:"fr_hussar5", n:1, unit:"regt", v:"5e hussards", src:"alombert4_1908", at:"p. 718", gr:"B", lab:"fact", q:"2e hussards ; 4e hussards ; 5e hussards ; 5e chasseurs"},
      {dress:"fr_chasseur5", n:1, unit:"regt", v:"5e chasseurs", src:"alombert4_1908", at:"p. 718", gr:"B", lab:"fact", q:"2e hussards ; 4e hussards ; 5e hussards ; 5e chasseurs"}]},
  nansouty: {note:"which four cuirassier regiments is disputed: 2e, 9e, 3e, 12e on 28 October (p. 741), 1er, 2e, 3e, 5e on 13 November (p. 757); the class is the same",
    parts:[
      {dress:"fr_carabinier", n:2, unit:"regt", v:"1er et 2e carabiniers", src:"alombert4_1908", at:"p. 741", gr:"B", lab:"fact", q:"1er et 2e carabiniers"},
      {dress:"fr_cuirassier", n:4, unit:"regt", v:"2e, 9e, 3e et 12e cuirassiers", src:"alombert4_1908", at:"p. 741", gr:"B", lab:"fact", q:"2e, 9e, 3e et 12e cuirassiers"}]},
  dhautpoul: {note:"1er, 5e, 10e, 11e on 28 October; 9e, 10e, 11e, 12e on 13 November (alombert4_1908, p. 757): disputed, the class the same",
    parts:[
      {dress:"fr_cuirassier", n:4, unit:"regt", v:"1er, 5e, 10e et 11e cuirassiers", src:"alombert4_1908", at:"p. 741", gr:"B", lab:"fact", q:"1er, 5e, 10e et 11e cuirassiers"}]},
  walther: {
    parts:[
      {dress:"fr_dragoon", n:6, unit:"regt", v:"10e, 13e, 22e, 3e, 6e et 11e dragons", src:"alombert4_1908", at:"p. 742", gr:"B", lab:"fact", q:"10e, 13e, 22e, 3e, 6e et 11e dragons"}]},
  bourcier: {note:"six regiments on 28 October; Martinien records officer casualties at Austerlitz for the 15e, 17e, 18e and 19e only (martinien1899), consistent with this reconstruction's 'Only a fraction of the division reached the field'",
    parts:[
      {dress:"fr_dragoon", n:6, unit:"regt", v:"15e, 17e, 27e, 18e, 19e, 25e dragons", src:"alombert4_1908", at:"p. 743", gr:"B", lab:"fact", q:"15e, 17e, 27e, 18e, 19e, 25e dragons"}]},
  rivaud: {note:"labelled the 2nd division of I Corps in the situation of 28 October (alombert4_1908, p. 717); the force return of 26 October (p. 762) numbers its regiments the 1st division, then under Pacthod (that this is Rivaud's division is an inference from the regiments): the number is disputed; battalion counts not printed",
    parts:[
      {dress:"fr_line", n:3, unit:"regt", v:"8e de ligne ; 45e de ligne ; 54e de ligne", src:"alombert4_1908", at:"p. 717", gr:"B", lab:"fact", q:"8e de ligne ; 45e de ligne ; 54e de ligne"}]},
  drouet: {note:"labelled the 1st division of I Corps in the situation of 28 October (alombert4_1908, pp. 716-717) and the 2nd in the force return of 26 October (p. 762; the 27e légère then with Kellermann's advance guard): the number is disputed; battalion counts not printed",
    parts:[
      {dress:"fr_light", n:1, unit:"regt", v:"27e légère", src:"alombert4_1908", at:"pp. 716-717", gr:"B", lab:"fact", q:"27e légère ; 94e de ligne ; 95e de ligne"},
      {dress:"fr_line", n:2, unit:"regt", v:"94e de ligne ; 95e de ligne", src:"alombert4_1908", at:"p. 717", gr:"B", lab:"fact", q:"27e légère ; 94e de ligne ; 95e de ligne"}]},
  guard_inf: {note:"Barrès's 8 Guard battalions are split equally between grenadiers and chasseurs (inference: the Guard's 1804 eagles went to 'quatre bataillons de Grenadiers et Chasseurs à pied', regnault1967, p. 36); Stutterheim gives the French reserve 'ten battalions of the Imperial Guard'",
    parts:[
      {dress:"fr_guard_gren", n:4, unit:"bn", v:"dont 8 de la Garde impériale", src:"barres1923", at:"p. 56 (view f84)", gr:"B", lab:"inference", q:"dont 8 de la Garde impériale"},
      {dress:"fr_guard_chass", n:4, unit:"bn", v:"dont 8 de la Garde impériale", src:"barres1923", at:"p. 56 (view f84)", gr:"B", lab:"inference", q:"dont 8 de la Garde impériale"},
      {dress:"it_guard", n:2, unit:"bn", v:"2 de la garde royale italienne", src:"barres1923", at:"p. 56 (view f84)", gr:"B", lab:"fact", q:"2 de la garde royale italienne"}]},
  guard_cav: {note:"the Guard cavalry's four squadrons each of grenadiers and chasseurs à cheval are those of the 1804 eagles (regnault1967, p. 36); the Mameluke company is counted as one unit (no source gives its size against a squadron); Martinien records officer casualties at Austerlitz for all three (martinien1899, pp. 93, 96, 98)",
    parts:[
      {dress:"fr_guard_grencav", n:4, unit:"sqn", v:"aux quatre escadrons respectifs des deux régiments de cavalerie, Grenadiers et Chasseurs à cheval", src:"regnault1967", at:"p. 36 (view f40)", gr:"B", lab:"fact", q:"aux quatre escadrons respectifs des deux régiments de cavalerie"},
      {dress:"fr_guard_chasscav", n:4, unit:"sqn", v:"aux quatre escadrons respectifs des deux régiments de cavalerie, Grenadiers et Chasseurs à cheval", src:"regnault1967", at:"p. 36 (view f40)", gr:"B", lab:"fact", q:"aux quatre escadrons respectifs des deux régiments de cavalerie"},
      {dress:"fr_mameluke", n:1, unit:"sqn", v:"Compagnie de Mamelucks (vieille garde)", src:"martinien1899", at:"p. 98 (view f98)", gr:"B", lab:"inference", q:"Compagnie de Mamelucks"}]},
  c_gren: {note:"the return of 26 October; the division fought at Hollabrunn on 16 November; its state on 2 December not shown",
    parts:[
      {dress:"fr_gren_line", n:4, unit:"bn", v:"Bat. d'élite du 9e rég. de ligne [...] du 13e [...] du 58e [...] du 81e", src:"alombert4_1908", at:"p. 755 (situation of 26 October 1805)", gr:"B", lab:"fact", q:"Bat. d'élite du 9e rég. de ligne"},
      {dress:"fr_gren_light", n:6, unit:"bn", v:"du 2e rég. d'inf. légère [...] du 3e [...] du 12e [...] du 15e [...] du 28e [...] du 31e", src:"alombert4_1908", at:"p. 755", gr:"B", lab:"fact", q:"du 2e rég. d'inf. légère"}]},
  /* ---------------- the Allies ---------------- */
  ahq: {dominant:true, basis:"data.js: the Allied headquarters (arm hq), Kutuzov, Alexander I and Francis II with their staffs; no read source names the escort",
    parts:[{dress:"ru_staff", n:1, unit:"staff"}]},
  buxhowden: {dominant:true, basis:"data.js: the left wing's command (arm hq); no read source names its escort",
    parts:[{dress:"ru_staff", n:1, unit:"staff"}]},
  kienmayer: {note:"Stutterheim, present, names the Szekler Grenz, the Hessen-Homburg and Szekler hussars, O'Reilly's chevaulegers and two Cossack regiments (stutterheim1806fr, pp. 69-71); Mikhailovsky-Danilevsky gives '2 regiments of irregular Cossacks, 2 weak regiments of Hungarian cavalry and 5 battalions of Croats' (mikhailovsky1846, p. 224)",
    parts:[
      {dress:"at_jager", n:300, unit:"men", v:"Wiener Jäger — 2 — 300", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Wiener Jäger"},
      {dress:"at_grenz", n:3100, unit:"men", v:"Broder-Infanterie 1 — — 500; 2. Szekler 2 — — 1300; 1. Szekler 2 — — 1300", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Broder-Infanterie"},
      {dress:"at_chevauleger", n:8, unit:"sqn", v:"A'Reilly-Chevaux legers — — 8 900", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Chevaux legers"},
      {dress:"at_uhlan_merveldt", n:0.25, unit:"sqn", v:"Merweldt-Uhlanen — — 1/4 40", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Merweldt-Uhlanen"},
      {dress:"at_gen_cav", n:0.5, unit:"sqn", v:"Schwarzenberg-Uhlanen — — 1/2 100", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Schwarzenberg-Uhlanen"},
      {dress:"at_hussar_hh", n:8, unit:"sqn", v:"Hessen-Homburg-Huszaren — — 8 300", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Hessen-Homburg-Huszaren",
        note:"the squadron figure can be read 3 or 8 in the print; the column's total, 32 3/4, requires 8 (derived)"},
      {dress:"at_hussar_szekler", n:6, unit:"sqn", v:"Szekler-Huszaren — — 6 600", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Szekler-Huszaren"},
      {dress:"ru_cossack", n:10, unit:"sqn", v:"Sesajew-Kosaken — — 5 500; Melentiew-Kosaken — — 5 500", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Melentiew-Kosaken"}],
    others:[{dress:"at_art", n:2, unit:"bty", v:"2 österr. Cavallerie-Batterien", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"2 österr. Cavallerie-Batterien"}]},
  dok: {note:"Mikhailovsky-Danilevsky gives the 5th Jäger and one battalion of the 7th (mikhailovsky1846, p. 224): which jäger regiment is disputed, the class the same",
    others:[{dress:"ru_cossack", n:2, unit:"sqn", v:"2 escadr. de cosaques irrégul.", src:"mikhailovsky1846", at:"p. 224", gr:"B", lab:"fact", q:"2 escadr. de cosaques irrégul."},
      {dress:"ru_foot_art", n:1, unit:"coy", v:"2e comp. d'artill. de position", src:"mikhailovsky1846", at:"p. 224", gr:"B", lab:"fact", q:"2e comp. d'artill. de position"}],
    parts:[
      {dress:"ru_jager", n:3, unit:"bn", v:"7. Jäger-Regiment ... 3", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"7. Jäger-Regiment"},
      {dress:"ru_musk", n:18, unit:"bn", v:"Neu-Ingermannland ... 3; Jaroslaw ... 3; Wladimirz ... 3; Brainsky ... 3; Wiatzky ... 3; Moschovsky ... 3", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Neu-Ingermannland"},
      {dress:"ru_gren", n:3, unit:"bn", v:"Kiow-Grenadier ... 3 1000", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Kiow-Grenadier"}]},
  lang: {note:"Langeron's own battalions; the regiments of Kamensky's brigade are drawn with kamensky. Schönhals puts Kursk in Kamensky's brigade, Mikhailovsky-Danilevsky with Langeron's main body (mikhailovsky1846, p. 241): Kursk is drawn here",
    parts:[
      {dress:"ru_jager", n:2, unit:"bn", v:"8. Jäger-Regiment ... 2 — — 670", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"8. Jäger-Regiment"},
      {dress:"ru_musk", n:9, unit:"bn", v:"Wiborskoy ... 3; Permskoy ... 3; Kurskoy ... 3", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Kurskoy"}]},
  kamensky: {note:"the musketeer regiment is Ryazhsk: 'Ряжскій' in the Russian original (mikhailovsky1844, pp. 167, 179, 187), 'Riajsk' in its French edition (mikhailovsky1846, pp. 241-242); the Russian original puts the Ryazan regiment in Tolstoy's corps in Swedish Pomerania (mikhailovsky1844, p. 257); 'Riasky' (schoenhals1873) and 'Rhiasky' (stutterheim1806fr, p. 90) settle neither name; the Materialien print 'Rjäsan', Ryazan (materialien1806, p. 99), kept as the other reading; Stutterheim has the two regiments sent to reinforce Kamensky's brigade",
    parts:[
      {dress:"ru_gren", n:3, unit:"bn", v:"Tanagorisky [sic] ... 3 2000", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Tanagorisky"},
      {dress:"ru_musk", n:3, unit:"bn", v:"Riasky ... 3 2000", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Riasky"}]},
  prz: {note:"Mikhailovsky-Danilevsky gives two battalions of the 7th Jäger (mikhailovsky1846, p. 225); Schönhals prints '8.' for one battalion",
    others:[{dress:"ru_cossack", n:5, unit:"sqn", v:"Demisod-Kosaken — — 5 500", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Demisod-Kosaken"}],
    parts:[
      {dress:"ru_jager", n:1, unit:"bn", v:"8. Jäger-Regiment ... 1 — — 1300", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"8. Jäger-Regiment"},
      {dress:"ru_musk", n:15, unit:"bn", v:"Gallizi ... 3; Budiersky ... 3; Podolsky ... 3; Norwa ... 3; Asow ... 3", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Gallizi"}]},
  milo: {note:"Schönhals's Russian total is 12 battalions (Smolensk printed without figures: 3, derived), as Stutterheim's 'douze bataillons russes' (stutterheim1806fr, p. 51); this reconstruction keeps WarHistory's fourteen beside them: the count is disputed",
    others:[{dress:"at_gen_cav", n:2, unit:"sqn", v:"Erzherzog Johann-Dragoner ... — — 2 125", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Erzherzog Johann-Dragoner"}],
    parts:[
      {dress:"ru_musk", n:9, unit:"bn", v:"Novogrolsky ... 3; Apscheronsky ... 3; Sonolenskoy", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"derived", q:"Apscheronsky"},
      {dress:"ru_gren", n:3, unit:"bn", v:"Malorosizky ... 3 1500", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Malorosizky"}]},
  kollo: {note:"facings, Militär-Schematismus 1805 (A): IR 1 Kaiser pompadour; IR 9 Czartoryski apple green; IR 20 Kaunitz crab red; IR 23 Salzburg ponceau; IR 24 Auersperg 'Franzblau'; the others in schem1805, pp. 87-201; all ten regiments German or Walloon (derived); most battalions newly raised and weak (Stutterheim)",
    parts:[
      {dress:"at_line", n:15, unit:"bn", v:"Salzburg ... 6; Kaunitz ... 1; Auersperg ... 1; Kaiser ... 1; Czartorisky ... 1; Reuss-Greutz ... 1; Württemberg ... 1; Beaulieu ... 1; Kerpen ... 1; Lindenau ... 1", src:"schoenhals1873", at:"p. 177", gr:"B", lab:"fact", q:"Salzburg",
        note:"the same ten regiments in the 1806 Materialien's list of 27 November (materialien1806, pp. 22-23) and in the German edition of Stutterheim (stutterheim1806de, pp. 28-29)"}]},
  lich: {note:"Mikhailovsky-Danilevsky puts the Empress's cuirassiers and the St Petersburg dragoons with Bagration (mikhailovsky1846, p. 226) and has Uvarov's three regiments sent to Bagration's left on the evening before (p. 233): disputed. No 'Gladkov' appears in any source read; in Schönhals the Russian brigades are Shepelev's ('Czepelow', under Essen) and Penitsky's ('Penitzky', under Uvarov) (schoenhals1873, p. 178). Shares by men (the Austrians 1,100 of 5,600)",
    parts:[
      {dress:"at_cuirassier", n:1100, unit:"men", v:"Nassau-Cürassier — — 8 300; Lothringen-Cürassier — — 8 300; Kaiser-Cürassier — — 8 500", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Lothringen-Cürassier",
        note:"Lorraine and Nassau also named by Stutterheim, present (stutterheim1806fr, p. 94)"},
      {dress:"ru_cossack", n:500, unit:"men", v:"Gardejew-Kosaken 5 500", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Gardejew-Kosaken"},
      {dress:"ru_uhlan", n:1000, unit:"men", v:"Grossfürst Constantin-Uhlanen 10 1000", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Grossfürst Constantin-Uhlanen"},
      {dress:"ru_dragoon", n:1500, unit:"men", v:"Petersburg-Dragoner 5 500; Charchow-Dragoner 5 500; Czernikow-Dragoner 5 500", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Charchow-Dragoner"},
      {dress:"ru_cuirassier", n:500, unit:"men", v:"Leib-Cürassier 5 500", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Leib-Cürassier"},
      {dress:"ru_hussar_elisavetgrad", n:1000, unit:"men", v:"Elisabethgrad-Huszaren 10 1000", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Elisabethgrad-Huszaren"}]},
  bag: {note:"'Ihre Eintheilung in der Ordre de Bataille ist nicht bekannt' (schoenhals1873, p. 178); the 5th Jäger here, in the I Column in Mikhailovsky-Danilevsky: disputed",
    others:[
      {dress:"ru_hussar_pavlograd", n:10, unit:"sqn", v:"Paulogradsky-Huszaren 10 1000", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Paulogradsky-Huszaren"},
      {dress:"ru_hussar_mariupol", n:10, unit:"sqn", v:"Marinepolsky-Huszaren 10 1000", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Marinepolsky-Huszaren"},
      {dress:"ru_dragoon", n:5, unit:"sqn", v:"Twusky-Dragoner 5 500", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Twusky-Dragoner"},
      {dress:"ru_cossack", n:20, unit:"sqn", v:"Isajew-, Kuselew-, Charsumkow-, Malachow-Kosaken, 5 each", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Malachow-Kosaken"},
      {dress:"ru_foot_art", n:2, unit:"coy", v:"2 comp. d'artillerie à pied", src:"mikhailovsky1846", at:"p. 226", gr:"B", lab:"fact", q:"2 comp. d'artillerie à pied"}],
    parts:[
      {dress:"ru_jager", n:6, unit:"bn", v:"6. Jäger-Regiment ... 3 — — 800; 5. Jäger-Regiment ... 3 — — 1300", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"6. Jäger-Regiment"},
      {dress:"ru_musk", n:9, unit:"bn", v:"Archangelokrodsky ... 3; Stary Ingermandlansky ... 3; Pskowsky ... 3", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Pskowsky"}]},
  rg_inf: {note:"the Life Grenadier Regiment, an army grenadier regiment, marched with the Guard (mikhailovsky1846, p. 226: 'les grenadiers du corps'); not drawn in this formation: 'in reserve' in duffy1977 (p. 185), in Maliutin's separate column in sokolov2006 (pp. 199-200); schoenhals1873 (p. 178) lists its three battalions, 2,300",
    parts:[
      {dress:"ru_guard_inf", n:6, unit:"bn", v:"Semunorvsky 2; Preobrajschensky 2; Ismaelovsky 2", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Preobrajschensky"},
      {dress:"ru_guard_jager", n:1, unit:"bn", v:"Leib-Jäger 1 — — 530", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Leib-Jäger"}]},
  rg_cav: {
    parts:[
      {dress:"ru_chevalier", n:5, unit:"sqn", v:"Chevaliers-Garde — — 5 800", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Chevaliers-Garde"},
      {dress:"ru_guard_horse", n:5, unit:"sqn", v:"Leib-Garde zu Pferd — — 5 1000", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Leib-Garde zu Pferd"},
      {dress:"ru_guard_hussar", n:5, unit:"sqn", v:"Leib-Huszaren — — 5 800", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Leib-Huszaren"},
      {dress:"ru_guard_cossack", n:2, unit:"sqn", v:"Leib-Kosaken — — 2 300", src:"schoenhals1873", at:"p. 178", gr:"B", lab:"fact", q:"Leib-Kosaken"}]}
};

/* the colours carried by each dress class's units: model, count (n per unit), cloth (w x h), staff and finial, each a
   claim, a disputed value, {gen:true, why} (carried, but its form not sourced: drawn as a plain labelled cloth) or
   {none:true, why} (no read source shows colours carried: none drawn). */
var COLOURS_CARRIED = {
  fr_eagle_inf: {
    model:{v:"le Drapeau modèle 1804", en:"the 1804 model with the eagle", src:"regnault1967", at:"p. 21 (view f25)", gr:"B", lab:"fact", q:"le Drapeau modèle 1804",
      note:"Napoleon wanted the eagle 'sur la sommité du bâton du drapeau' and a much smaller cloth (corr9_1858, no. 7876, 27 July 1804); the eagles were distributed at the Champ-de-Mars on 5 December 1804 (corr10_1858, no. 8203)"},
    pattern:{v:"un losange blanc central inscrit dans le carré encadré de quatre triangles de couleur alternée rouge et bleue, sans franges ni cravates", en:"a white central lozenge, the four corner triangles alternately red and blue, the number in laurel wreaths", src:"regnault1967", at:"p. 21 (view f25)", gr:"B", lab:"fact",
      q:"un losange blanc central inscrit dans le carré", note:"which corner colour lies against the staff is not shown by any object read (the 111e's flag: 'aux angles de couleur rouge et bleue en opposition', osenat21003_202; painvin1891, C: a blue and a red triangle at the staff); the cravate is disputed (Regnault 'sans franges ni cravates'; the minister in 1812 speaks of the cravates of all flags, hollander1902, pp. 21-22)"},
    count:{v:"un Drapeau, Etendard ou Guidon par bataillon ou escadron", en:"one eagle per battalion (the decree of 10 July 1804)", n:1, per:"bn", src:"regnault1967", at:"pp. 25-26 (views f29-f30)", gr:"B", lab:"fact", q:"un Drapeau, Etendard ou Guidon par bataillon ou escadron",
      note:"the 4e de ligne's 1st battalion carried and lost its eagle at Austerlitz (corr11_1863, no. 9610, order of the day of 25 December 1805, A); one eagle per regiment only from the decree of 18 February 1808 (corr16_1858, no. 13574; Bardin, 'distribuées à raison d'une par bataillon', bardin1_1849, p. 146); the light infantry sent its eagles to the depots only on 26 March 1807 (corr14_1858, no. 12183): it carried them in 1805 (inference)"},
    cloth:{v:"deux pieds six pouces de côtés (81 centimètres)", en:"81 cm square", w:81, h:81, unit:"cm", src:"regnault1967", at:"p. 21 (view f25)", gr:"B", lab:"fact", q:"deux pieds six pouces de côtés (81 centimètres)",
      note:"the 1st battalion flag of the 111e measures 79 x 79 cm (osenat21003_202)"},
    staff:{gen:true, why:"no measured staff read: Fraser 1912 gives 'eight feet long', without a source (C)"},
    finial:{v:"l'Aigle éployée [...] avait une hauteur de vingt centimètres", en:"the gilt eagle, 20 cm high", src:"regnault1967", at:"p. 21 (view f25)", gr:"B", lab:"fact", q:"avait une hauteur de vingt centimètres",
      note:"surviving eagles catalogued at 21-22.5 cm (osenat21003_200 and lot 203)"}},
  fr_eagle_cav: {
    model:{v:"le Drapeau modèle 1804 (étendard)", src:"regnault1967", at:"pp. 21, 25-26 (views f25, f29-f30)", gr:"B", lab:"inference", q:"le Drapeau modèle 1804"},
    count:{v:"un Drapeau, Etendard ou Guidon par bataillon ou escadron", en:"one per squadron", n:1, per:"sqn", src:"regnault1967", at:"p. 26 (view f30)", gr:"B", lab:"fact", q:"un Drapeau, Etendard ou Guidon par bataillon ou escadron",
      note:"in September 1806 the cuirassiers and carabiniers 'auront leurs trois aigles' and the dragoons keep one of three (corr13_1858, no. 10839): three per regiment then"},
    cloth:{gen:true, why:"the 1804 cavalry standard's size was not read"},
    finial:{v:"l'Aigle éployée", src:"regnault1967", at:"p. 21 (view f25)", gr:"B", lab:"inference", q:"avait une hauteur de vingt centimètres"}},
  fr_eagle_lightcav: {
    model:{v:"le Drapeau modèle 1804 (étendard)", src:"regnault1967", at:"pp. 21, 25-26 (views f25, f29-f30)", gr:"B", lab:"inference", q:"le Drapeau modèle 1804"},
    count:{v:"carried or sent to headquarters", lab:"disputed", gr:"C",
      sides:[
        {v:"En 1805, les hussards et les chasseurs doivent réglementairement envoyer leurs aigles au quartier général. Ils ne le font point.", en:"by regulation to be sent to headquarters in 1805; they did not", src:"morvan1904", at:"t. I, p. 267", gr:"B", lab:"fact", q:"Ils ne le font point"},
        {v:"Every Hussar and Chasseur regiment was ordered to return its three squadron Eagles to head-quarters", src:"fraser1912", at:"p. 182", gr:"C", lab:"uncertain", q:"Every Hussar and Chasseur regiment was ordered to return its three squadron Eagles"}],
      note:"Napoleon's order of 20 September 1806 that they 'suivent le règlement' (corr13_1858, no. 10839) shows the rule; whether Kellermann's regiments carried eagles on 2 December is not established"},
    cloth:{gen:true, why:"not read"}},
  fr_guard_eagle: {
    model:{v:"tous sont dans l'ensemble du modèle choisi en 1804 pour les Troupes de Ligne", en:"the 1804 line model with the Guard's ornaments", src:"regnault1967", at:"pp. 38-39 (views f42-f43)", gr:"B", lab:"fact", q:"tous sont dans l'ensemble du modèle choisi en 1804"},
    count:{v:"quatre aux quatre bataillons de Grenadiers et Chasseurs à pied, huit aux quatre escadrons respectifs", en:"one per battalion or squadron", n:1, per:"bn", src:"regnault1967", at:"p. 36 (view f40)", gr:"B", lab:"fact", q:"quatre aux quatre bataillons de Grenadiers et Chasseurs à pied",
      note:"carried uncased in the reserve on the day: 'les aigles et les flammes découvertes' (barres1923, p. 56)"},
    cloth:{gen:true, why:"the Guard's cloth size was not read"}},
  fr_guard_eagle_cav: {
    model:{v:"tous sont dans l'ensemble du modèle choisi en 1804 pour les Troupes de Ligne", en:"the 1804 model; the surviving horse grenadiers' standards of the 1st and 2nd squadrons", src:"regnault1967", at:"pp. 38-39 (views f42-f43)", gr:"B", lab:"fact", q:"tous sont dans l'ensemble du modèle choisi en 1804"},
    count:{v:"huit aux quatre escadrons respectifs des deux régiments de cavalerie, Grenadiers et Chasseurs à cheval", en:"one per squadron", n:1, per:"sqn", src:"regnault1967", at:"p. 36 (view f40)", gr:"B", lab:"fact", q:"huit aux quatre escadrons respectifs",
      note:"Regnault: the Guard 'ont dû vraisemblablement faire la campagne de 1805 avec toutes leurs Aigles' (p. 40), an inference"},
    cloth:{gen:true, why:"not read"}},
  it_guard_eagle: {
    model:{gen:true, why:"the Italian Royal Guard's cloth design was not found"},
    count:{v:"le aquile dei battaglioni", en:"the battalions' eagles, handed to Lechi on 22 September 1805", n:1, per:"bn", src:"crociani2004", at:"vol. I, tomo 2, 'Da Parigi ad Austerlitz'", gr:"B", lab:"inference", q:"le aquile dei battaglioni"},
    cloth:{gen:true, why:"not found"}},
  fr_mameluke_none: {model:{none:true, why:"the Mamelukes' eagle and guidon were granted by decrees of 18 December 1805 and 14 April 1806 (regnault1967, pp. 36, 40): none on the day"},
    count:{v:"(granted 18 December 1805)", n:0, per:"sqn", src:"regnault1967", at:"p. 40 (view f44)", gr:"B", lab:"derived", q:"Mameluks"}, cloth:{none:true, why:"none"}},
  fr_elite_none: {model:{none:true, why:"no read source says whether the elite battalions drawn from other regiments carried eagles (their regiments' eagles stayed with the parent battalions, one per battalion)"},
    count:{none:true, why:"not established"}, cloth:{none:true, why:"not established"}},
  fr_art_none: {model:{none:true, why:"the artillery left its flags at the depot"},
    count:{v:"Déjà, sous le Consulat, les régiments d'artillerie laissaient leurs drapeaux au dépôt", n:0, per:"regt", src:"morvan1904", at:"t. I, p. 267", gr:"B", lab:"inference", q:"les régiments d'artillerie laissaient leurs drapeaux au dépôt"},
    cloth:{none:true, why:"none"}},
  hq_none: {model:{none:true, why:"no read source gives a headquarters a colour or standard (the census found 1-3 drawn on each headquarters today, docs/STAGE6_SPEC.md §1.4)"},
    count:{none:true, why:"none sourced"}, cloth:{none:true, why:"none sourced"}},
  ru_inf: {
    model:{v:"знамена 1797-1800 годовъ, служившія безсрочно", en:"the colours of Paul I's issues, which served without term, two per battalion kept by the order of 21 March 1802", src:"viskovatov9_1850", at:"p. 68", gr:"B", lab:"inference", q:"служили безсрочно",
      note:"the 1803 designs were 'на случай пожалованія впредь' (viskovatov17_1901, p. 34): the colours carried in 1805 were most probably the Paul-era issues (inference)"},
    pattern:{gen:true, why:"SOURCE_NOTE's open question stays open (decision 105): the 1797-1799 and 1800 patterns are described (a cross, four corners and a light-orange circle with a black eagle, viskovatov9_1850, pp. 68-98), but which pattern and which colours each regiment present carried on the day is not established, and the plates read are greyscale"},
    count:{v:"на каждый баталіонъ по два знамя", en:"two per battalion", n:2, per:"bn", src:"psz27_1830", at:"no. 20,193 (21 March 1802), p. 80", dated:"1802-03-21", gr:"B", lab:"fact", q:"на каждый баталіонъ по два знамя",
      note:"a regulation of 1802; no change before 1813 in Viskovatov's chronology (viskovatov17_1901, p. 32), who adds that the first battalions kept one white and one coloured, which the order does not say; colours carried in action on the day (mikhailovsky1844, pp. 184, 187)"},
    cloth:{v:"какъ въ-длину, такъ и въ-ширину, по 2 аршина", en:"2 arshins square (142 cm)", w:142, h:142, unit:"cm", src:"viskovatov9_1850", at:"pp. 68-69", gr:"B", lab:"derived", q:"по 2 аршина",
      note:"cm from 1 arshin = 71.12 cm (derived); the size of the 1797-1799 issues, from surviving colours (Viskovatov's note 141)"},
    staff:{v:"Длина древка была 4½ аршина", en:"the staff 4½ arshins (320 cm)", m:3.20, src:"viskovatov9_1850", at:"p. 69", gr:"B", lab:"derived", q:"Длина древка была 4½ аршина"},
    finial:{v:"плоское копье, съ трубкою [...] длина копья, съ трубкою — 5½ вершковъ", en:"a flat gilt spearhead with a double-headed eagle, 5½ vershoks (24.4 cm) with its socket", src:"viskovatov9_1850", at:"p. 69", gr:"B", lab:"derived", q:"длина копья, съ трубкою — 5½ вершковъ"}},
  ru_guard_inf: {
    model:{v:"1799 colours with the Maltese cross, or the 1800 pattern", lab:"disputed", gr:"C",
      sides:[
        {v:"были пожалованы всѣмъ тремъ полкамъ Гвардейской Пѣхоты новыя знамена, по образцу установленныхъ въ 1800 году", en:"new colours of the 1800 pattern granted", src:"viskovatov9_1850", at:"p. 115", gr:"B", lab:"fact", q:"были пожалованы всѣмъ тремъ полкамъ Гвардейской Пѣхоты новыя знамена"},
        {v:"заготовленныя, но не бывшія въ употребленіи знамена", en:"the author's source note for the Guard's 1800 colours: the 1800 table of colours (the Emperor's library, portfolio no. 169) and colours made ready but never in use, kept in the St Petersburg Arsenal; that the Guard did not carry the 1800 colours is an inference", src:"viskovatov9_1850", at:"note 375, p. XXXVII", gr:"B", lab:"inference", q:"заготовленныя, но не бывшія въ употребленіи знамена"}]},
    pattern:{gen:true, why:"disputed (the model) and not described for the day"},
    count:{v:"на каждый баталіонъ по два знамя", n:2, per:"bn", src:"psz27_1830", at:"no. 20,193, p. 80", dated:"1802-03-21", gr:"B", lab:"fact", q:"на каждый баталіонъ по два знамя",
      note:"the order applies to every regiment ('всѣмъ полкамъ'); Viskovatov names the Guard infantry with the grenadier, musketeer and garrison regiments (viskovatov17_1901, p. 32)"},
    cloth:{gen:true, why:"the Guard's colours not measured in a source read"}},
  ru_jager_none: {model:{none:true, why:"jäger regiments carried colours only when granted them for distinction"},
    count:{v:"Карабинернымъ и Егерскимъ полкамъ знамена полагались только въ случаѣ пожалованія ихъ за особыя отличія", n:0, per:"regt", src:"viskovatov17_1901", at:"p. 33, footnote", gr:"B", lab:"inference", q:"Егерскимъ полкамъ знамена полагались только въ случаѣ пожалованія"},
    cloth:{none:true, why:"none"}},
  ru_cuir: {
    model:{v:"штандарты 1797-1799 годовъ", en:"the standards of Paul I's issues", src:"viskovatov9_1850", at:"pp. 102-104", gr:"B", lab:"inference", q:"Штандартовъ, въ каждый Кирасирскій полкъ"},
    pattern:{v:"вышитое изображеніе двуглаваго, парящаго орла [...] крестъ, въ сіяніи", en:"an embroidered soaring eagle in the lower corner at the staff, a cross in a glory in the opposite corner; the first squadron's white", src:"viskovatov9_1850", at:"pp. 102-104", gr:"C", lab:"uncertain", q:"крестъ, въ сіяніи",
      note:"which colours each regiment present carried is not stated"},
    count:{v:"по числу эскадроновъ, пять", en:"one per squadron, five per regiment", n:1, per:"sqn", src:"viskovatov9_1850", at:"p. 104", gr:"B", lab:"fact", q:"по числу эскадроновъ, пять"},
    cloth:{v:"въ-ширину, по древку — 10, а въ-длину — 12 вершковъ", en:"10 x 12 vershoks (44.5 x 53.3 cm)", w:53.3, h:44.5, unit:"cm", src:"viskovatov9_1850", at:"pp. 102-103", gr:"B", lab:"derived", q:"по древку — 10, а въ-длину — 12 вершковъ",
      note:"cm from 1 vershok = 4.445 cm (derived); w along the fly, h along the staff"}},
  ru_drag: {
    model:{v:"штандарты 1797-1799 годовъ", src:"viskovatov9_1850", at:"p. 107", gr:"B", lab:"inference", q:"Драгунскіе полки, вмѣсто состоявшихъ у нихъ знаменъ, начали получать штандарты"},
    count:{v:"Штандарты Драгунскимъ полкамъ были жалуемы по числу эскадроновъ", en:"one per squadron", n:1, per:"sqn", src:"viskovatov9_1850", at:"p. 107", gr:"B", lab:"fact", q:"по числу эскадроновъ"},
    cloth:{v:"какъ въ-ширину, такъ и въ-длину — по 12 вершковъ", en:"12 vershoks square (53.3 cm)", w:53.3, h:53.3, unit:"cm", src:"viskovatov9_1850", at:"p. 107", gr:"B", lab:"derived", q:"по 12 вершковъ"}},
  ru_huss_none: {model:{none:true, why:"no hussar standards are listed for 1797-1801 (an argument from silence); the Pavlograd Hussars received St George standards only in 1807 (viskovatov17_1901, p. 41)"},
    count:{v:"(none listed for hussar regiments)", n:0, per:"regt", src:"viskovatov9_1850", at:"contents and pp. 68-121", gr:"C", lab:"inference", q:"Знамена и штандарты"},
    cloth:{none:true, why:"none"}},
  ru_uhlan_none: {model:{none:true, why:"no read source gives the uhlans a standard in 1805"}, count:{none:true, why:"not found"}, cloth:{none:true, why:"not found"}},
  ru_cossack_none: {model:{none:true, why:"the Don Cossack regiments' banners were not found"}, count:{none:true, why:"not found"}, cloth:{none:true, why:"not found"}},
  ru_guard_cav: {
    model:{v:"Въ 1799 — 10 штандартовъ", en:"the Life Guard Horse's ten standards of 1799 (white field, crimson corners; the rest crimson with pale-yellow corners)", src:"viskovatov9_1850", at:"pp. 117-118", gr:"B", lab:"inference", q:"Въ 1799 — 10 штандартовъ",
      note:"the Chevalier Guard's standards were taken to the town of Austerlitz before the action (sokolov2006, t. II, p. 56, B, uncertain)"},
    count:{gen:true, why:"how many standards each Guard regiment carried on the day is not stated"},
    cloth:{gen:true, why:"not measured in a source read"}},
  ru_art_none: {model:{none:true, why:"no read source gives the artillery colours"}, count:{none:true, why:"not found"}, cloth:{none:true, why:"not found"}},
  at_inf: {
    model:{v:"eine einzige Leibfahne (Standarte) aus weißem und die noch erforderliche Zahl „ordinärer“ Fahnen (Standarten) aus kaisergelben Seidenstoff", en:"one white Leib colour per regiment, the rest imperial-yellow 'ordinary' colours (the 1769 pattern; Dolleczek's next pattern is of 1806, so that it was carried in 1805 is an inference)", src:"dolleczek1896", at:"pp. 158-159 (n169-n170); the next pattern p. 160", gr:"B", lab:"inference", q:"eine einzige Leibfahne"},
    pattern:{v:"der vorhin beschriebene schwarze Doppeladler [...] Flammenzungen-Einfassung von gelben, weißen, rothen und schwarzen Dreiecken", en:"the black double eagle on both faces of the ordinary colours (the Virgin on the Leib colour's obverse), a border of yellow, white, red and black flame triangles 16 cm wide", src:"dolleczek1896", at:"pp. 157-158", gr:"B", lab:"fact", q:"schwarze Doppeladler",
      note:"the Virgin's star halo only from 1806"},
    count:{v:"one or two per battalion", lab:"disputed", gr:"C",
      sides:[
        {v:"Die Zahl der Fahnen wurde auf eine per Bataillon herabgesetzt", en:"one per battalion, by the Allerhöchste Entschliessung of 20 June 1805", src:"wrede1_1898", at:"pp. 46-47 (footnote 6)", gr:"B", lab:"fact", q:"Die Zahl der Fahnen wurde auf eine per Bataillon herabgesetzt"},
        {v:"Mit dem Reorganisationsstatut vom Jahre 1808 wurde die Zahl der Fahnen abermals auf die Hälfte vermindert, es erhielt jedes Bataillon nur mehr eine Fahne", en:"two per battalion from 1768 until 1808", src:"dolleczek1896", at:"pp. 158, 161", gr:"B", lab:"fact", q:"es erhielt jedes Bataillon nur mehr eine Fahne"}],
      note:"Teuber agrees with Wrede (teuber1895, p. 383, footnote)"},
    cloth:{v:"bei der Fahne 161 : 142 cm", en:"161 x 142 cm, the painted border included", w:161, h:142, unit:"cm", src:"dolleczek1896", at:"p. 158 (n169)", gr:"B", lab:"fact", q:"bei der Fahne 161 : 142 cm"},
    staff:{v:"Die Fahnenstangen waren circa 285 cm lang", en:"about 285 cm, painted in the four colours in spiral stripes", m:2.85, src:"dolleczek1896", at:"p. 159 (n170)", gr:"B", lab:"fact", q:"Die Fahnenstangen waren circa 285 cm lang"},
    finial:{v:"Das Krönlein in der gebräuchlichen Lindenblattform trug die Initialen des Regenten", en:"a linden-leaf finial with the ruler's initials", src:"dolleczek1896", at:"p. 159", gr:"B", lab:"fact", q:"Das Krönlein in der gebräuchlichen Lindenblattform"}},
  at_grenz: {
    model:{v:"nur eine ordinäre gelbe Fahne", en:"one ordinary yellow colour", src:"teuber1895", at:"p. 383 (c386), footnote", gr:"B", lab:"fact", q:"nur eine ordinäre gelbe Fahne"},
    count:{v:"1805 erfolgte auch die Bestimmung, dass künftig jedes Grenz-Bataillon »nur eine ordinäre gelbe Fahne« zu führen habe", en:"one per battalion, by an order of 1805", n:1, per:"bn", src:"teuber1895", at:"p. 383, footnote", gr:"B", lab:"uncertain", q:"jedes Grenz-Bataillon »nur eine ordinäre gelbe Fahne« zu führen habe",
      note:"the order's date and number are not given; whether carried out by 2 December is not shown"},
    cloth:{v:"bei der Fahne 161 : 142 cm", w:161, h:142, unit:"cm", src:"dolleczek1896", at:"p. 158", gr:"B", lab:"inference", q:"bei der Fahne 161 : 142 cm"}},
  at_cav: {
    model:{v:"Leibstandarte aus weißem und ordinäre Standarten aus kaisergelben Seidenstoff", en:"the infantry colours' pattern on a cavalry standard", src:"dolleczek1896", at:"pp. 158, 162", gr:"B", lab:"fact", q:"eine einzige Leibfahne (Standarte)"},
    count:{v:"Zwei solche bildeten eine Division und erhielten eine, mithin das Regiment drei Standarten", en:"one per division of two squadrons", n:0.5, per:"sqn", src:"dolleczek1896", at:"p. 158 (n169)", gr:"B", lab:"fact", q:"Zwei solche bildeten eine Division und erhielten eine",
      note:"the text says 'Cavallerie'; its application to hussars, chevaulegers and uhlans is an inference"},
    cloth:{v:"bei der Standarte 71 : 63 cm", w:71, h:63, unit:"cm", src:"dolleczek1896", at:"p. 158", gr:"B", lab:"fact", q:"bei der Standarte 71 : 63 cm"}},
  at_none: {model:{none:true, why:"no read source gives these troops colours (Dolleczek: light troops lost theirs entirely in 1808)"}, count:{none:true, why:"not found"}, cloth:{none:true, why:"not found"}}
};

/* the two sourced numbers per nation behind the standard's ratio (decision 106): the staff's top (with its eagle or
   finial) and the man's stature; the ratio is their quotient (derived), or, where either is not sourced, 1.6 stays,
   labelled provisional. The drawn denominator is the man to his hat's top (1.635 units); a sourced stature is bare-headed. */
var STANDARD_MEASURES = {
  fr: {provisional:true, why:"no measured staff read: the only figure is Fraser 1912's unreferenced 'eight feet long' (C); the eagle is 20 cm (regnault1967, p. 21) to 22.5 cm (osenat21003_200); statures: the conscription minimum 1.544 m from an XIII, 1.598 m before (villerme1829, p. 368, B), conscript means 1.585-1.640 m in two departments to 1809 (pp. 355-357, B)"},
  ru: {staff:{v:"Длина древка была 4½ аршина; длина копья, съ трубкою — 5½ вершковъ", en:"the staff 3.20 m; its spearhead 0.244 m with the socket", m:3.20, finial_m:0.244, src:"viskovatov9_1850", at:"p. 69", gr:"B", lab:"derived", q:"Длина древка была 4½ аршина",
      note:"the socket fits over the staff's end, how far is not stated: the top lies between 3.20 and 3.44 m; the size of the 1797-1799 colours, from surviving colours"},
    stature:{v:"ростомъ въ 2 аршина 4 вершка, безъ обуви", en:"the recruits' minimum, 2 arshins 4 vershoks (1.600 m) without shoes", m:1.60, src:"psz28_1830", at:"no. 21,490 (October 1804), § 3, p. 550", dated:"1804-10", gr:"A", lab:"derived", q:"ростомъ въ 2 аршина 4 вершка, безъ обуви",
      note:"a minimum, not a mean; the levy of 1 September 1805 admitted men half a vershok below it (no. 21,891). The 1802 table sized the infantry coat 'полагая ростъ человѣка въ 2 арш. 9 вершковъ' (1.822 m), a nominal man for the tailoring (viskovatov10_1900, p. 196, read on the page image)"}},
  at: {staff:{v:"Die Fahnenstangen waren circa 285 cm lang", en:"about 2.85 m; the finial's size not read", m:2.85, src:"dolleczek1896", at:"p. 159", gr:"B", lab:"fact", q:"Die Fahnenstangen waren circa 285 cm lang"},
    stature:{v:"Die Infanterie-Recruten mussten mindestens 165 Centimeter [...] gross sein", en:"the infantry recruits' minimum, 1.65 m (the 1790s)", m:1.65, src:"teuber1895", at:"p. 247 (c250)", gr:"B", lab:"fact", q:"mindestens 165 Centimeter",
      note:"a minimum, not a mean; not shown for 1805"}}
};

/* Stage 8, implementation PR 8E (decision 243 (a), with its source boundaries: "Register and grade each historical claim before using it. Do
   not generalise IV Corps' October authorisation for driver numbers into a demonstrated rule for the Guard, Austrian or Russian artillery.
   Specify where each source applies"; docs/STAGE8_SPEC.md sections 4.4 and 17): the claims the drawn field artillery rests on, each read on
   its page image for 8E (docs/stage8-evidence/8e/artillery-readings.md, the items named in each note). Each claim carries scope, the troops
   and the time its source speaks for; a value is drawn only for a battery inside that scope, and an explicitly identified convention
   elsewhere (KIT.art in app.js; never a claim). The values: wheels in metres (m, derived from the pieds du roi printed, 0.3248 m), their
   felloes as printed; the team a count of horses; the drivers a count a vehicle (n, and n6 for a six-horse vehicle) for the corps the
   source speaks for (corps: the formation id of that corps). Only French batteries are drawn as figures in this map (the Allied guns are
   listed with the formations they served, decision 100), so the Guard's, the Austrian and the Russian entries mark where the French
   readings stop: nothing is drawn from them. The carriage's colour stays one colour (decisions 109, 243 (a)); none is read here. */
var ORDNANCE = {
  fr: {
    system:{v:"L'artillerie de la Grande Armée comprend des canons de 12, de 8 et de 4, et des obusiers de 6 pouces, du modèle de Gribeauval",
      en:"Gribeauval 12-, 8- and 4-pounders and 6-inch howitzers; the an XI pieces meant to replace them were little made", src:"alombert1_1902", at:"Introduction, p. 228 (leaf n239)", gr:"B", lab:"fact",
      q:"du modèle de Gribeauval", scope:"the Grande Armée's field artillery at the opening of the 1805 campaign; which calibres stood on the heights or at the Santon on 2 December is not read, so a generic Gribeauval field piece is drawn, no calibre or model claimed",
      note:"item 1; a division's twelve pieces 2 of 12, 6 of 8, 2 of 4 and 2 howitzers (p. 230, item 2): ten of them on the wheels below"},
    wheels:{v:"Hauteur des Roues [...] de campagne de 12 [...] 4 6 [...] de 8 [...] Idem [...] d'obusiers de 8 pouces et de 6 pouces [...] 4 6 [...] d'affût de campagne de 12 et de 8, de caisson et de chariot à munitions [...] 3 6",
      en:"the field carriage's wheels of the 12, the 8 and the howitzers 4 pieds 6 pouces, their limber's 3 pieds 6 pouces (the 4-pounder's 4 pieds 2 pouces and 3 pieds 2 pouces)",
      gun_m:1.462, limber_m:1.137, felloes:{gun:6, limber:5}, src:"gassendi1809", at:"t. I, p. 110, the table 'Hauteur des Roues', nos. 3, 4, 10, 19 (leaf n191)", gr:"B", lab:"fact", q:"Hauteur des Roues",
      scope:"the Gribeauval field carriages and their limbers in Gassendi's tables (the field carriage of 1805 kept, t. I, p. 11); the 4-pounder's smaller wheels (within 7%) not drawn",
      note:"item 4; metres derived (4.5 and 3.5 pieds of 0.3248 m); the spokes are not printed: twelve and ten, two to a felloe, an inference"},
    coffret:{v:"Canonnier de droite, Canonnier de gauche, placent le coffret sur l'avant-train [...] placent le coffret entre les flasques",
      en:"unlimbered, the piece's chest is set on the limber; limbered, it travels between the trail's cheeks", src:"gassendi2_1809", at:"t. II, pp. 869-870, 'Otez l'Avant-train' and 'Amenez l'Avant-train' (leaves n336-n337)", gr:"B", lab:"fact",
      q:"placent le coffret entre les flasques", scope:"the Gribeauval field piece's 'coffret d'affût de campagne', for the 12, the 8, the 4 and the 6-inch howitzer (t. I, p. 174), in Gassendi's drill (1809)",
      note:"items 3 and 5; every piece carried its own ('les coffrets de pièce', alombert1_1902, p. 229)"},
    limberAt:{v:"3e. Servant de droite mène l'Avant-train à 20 pas en arrière, en obliquant un peu à droite, et tourne à gauche",
      en:"unlimbered, the limber is led 20 paces to the rear and turned", src:"gassendi2_1809", at:"t. II, p. 870 (leaf n337)", gr:"B", lab:"fact", q:"mène l'Avant-train à 20 pas en arrière",
      scope:"the drill Gassendi gives (1809); the limber's place 'est prescrite par le réglement' (p. 873), the regulation not read",
      note:"item 6; about 13 m (derived); drawn at the figures' scale, the distance a design value; 'tourne à gauche' by how much is not read, so the team drawn facing the rear is a design value"},
    limbered:{v:"L'Artillerie à pied conserve ses Pièces sur l'Avant-train dans tous ses mouvemens",
      en:"foot artillery keeps its pieces limbered in all its movements", src:"gassendi2_1809", at:"t. II, p. 872 (leaf n339)", gr:"B", lab:"fact", q:"conserve ses Pièces sur l'Avant-train",
      scope:"French foot artillery's manoeuvres, which the same page says 'ne sont point déterminées par un réglement': what some regiments practise",
      note:"item 7; the same section has the gunners march beside their piece (p. 873, item 8): the crew is drawn with the deployed battery only, as before 8E"},
    team:{v:"de Campagne de 12, chargé de sa Pièce [...] 6 [...] de 8, idem [...] 4 [...] de 4, idem [...] 4 [...] d'Obusier de 6 pouces, idem [...] 4",
      en:"the horses ordinarily put to a field carriage with its piece: the 12, six; the 8, the 4 and the 6-inch howitzer, four", n:4, src:"gassendi1809", at:"t. I, p. 440, the table of the columns' lengths, column B (leaf n523)", gr:"B", lab:"fact",
      q:"d'Obusier de 6 pouces, idem", scope:"French ordinary practice in Gassendi's tables (1809)",
      note:"item 9; in the copy read a reader's pen strokes cross the 12's, the 8's and the 4's rows, the howitzer's four is clear; a drawn gun stands for two pieces, so its four horses are a symbol"},
    harness:{v:"Premier Harnais de derrière ou de Porteur [...] 1 Selle à la dragonne avec ses étriers [...] Second Harnais de derrière ou de Sous-verge [...] 1 Couverture en forte toile grise",
      en:"each pair's porteur saddled, its sous-verge under a blanket: two saddles to a team of four", src:"gassendi2_1809", at:"t. II, p. 829 (leaf n296)", gr:"B", lab:"fact", q:"Selle à la dragonne avec ses étriers",
      scope:"the French artillery harness 'à l'Allemande'",
      note:"item 10; that the porteur was the near (left) horse is usual French usage, not said here: an inference"},
    drivers:[{v:"M. le Maréchal a autorisé le général Lariboisière à réduire vos attelages d'artillerie à un soldat du train par voiture ou au plus à deux pour les voitures à 6 chevaux",
      en:"IV Corps' divisions authorised to reduce their artillery teams to one train soldier a vehicle, two at most for a six-horse vehicle", n:1, n6:2, corps:"c_iv",
      src:"alombert4_1908", at:"pp. 183-184: Salligny, chief of staff of IV Corps, to the generals commanding its three infantry divisions and its cavalry division, Inning, 3 brumaire an XIV (leaves n192-n193)",
      dated:"1805-10-25", gr:"A", lab:"inference", q:"à un soldat du train par voiture",
      scope:"IV Corps' divisions' artillery teams, from 25 October 1805; it says nothing of the Guard's, the other corps', the Austrian or the Russian artillery",
      note:"item 11; p. 184 calls it 'la réduction ordonnée'; that it still held on 2 December is not shown (hence an inference), nor which horse he rode; drawn for heightguns, IV Corps' artillery on the heights, whose figures are IV Corps' foot artillery (COMPOSITION.heightguns): that its teams were among the divisions' teams the letter addresses is not read, a further inference; the Guard's 24 pieces listed with it are outside the letter and are not drawn as figures"}],
    limbering:{gen:true, why:"no source read gives the time limbering or unlimbering took (Gassendi's drill, t. II, pp. 869-870, lists the movements, not their duration): the deployed and the limbered battery switch at once"}
  },
  fr_guard: {
    team:{v:"chaque division sera composée de 4 pièces de 8, 2 pièces de 4 et 2 obusiers, attelés par 44 chevaux",
      en:"each of the Guard artillery's three divisions of four 8-pounders, two 4-pounders and two howitzers drawn by 44 horses", src:"alombert1_1902", at:"p. 399, Napoleon to Mortier, Boulogne, 11 fructidor an XIII (leaf n410)",
      dated:"1805-08-29", gr:"A", lab:"fact", q:"attelés par 44 chevaux",
      scope:"the Guard's artillery as ordered in August 1805; what it brought to the field on 2 December is not read",
      note:"item 13; the split by piece is an inference; nothing is drawn from it (no Guard battery is drawn as figures)"},
    drivers:{gen:true, why:"not read: the Guard's order of 29 August 1805 gives its teams' horses, not their drivers, and IV Corps' letter of 25 October does not reach it"}
  },
  at: {
    limber:{v:"von da ab wurde ein grösserer Kasten auf der Protze angebracht, der zugleich als Sitz für 3 Mann ausreichte",
      en:"from 1774 a larger box on the limber, which also seated three men", src:"teuber1895", at:"p. 185 (image)", gr:"B", lab:"fact", q:"ein grösserer Kasten auf der Protze",
      scope:"the Austrian Liechtenstein matériel, in use 'mit geringer Aenderung bis zum Jahre 1809'",
      note:"item 14; nothing is drawn from it (no Austrian battery is drawn as figures)"},
    drivers:{gen:true, why:"not re-read for 8E (Teuber, pp. 320 and 444: the Fuhrwesen's drivers, from the saddle; Part A's leads); nothing is drawn from it"}
  },
  ru: {
    limber:{v:"Передки съ коробомъ и дышломъ имѣлись двухъ образцовъ, батарейный и легкій—съ коробами на оси",
      en:"limbers of two patterns, battery and light, each with a box over the axle and a pole", src:"nilus1904", at:"p. 21 (leaf n24)", gr:"B", lab:"fact", q:"съ коробами на оси",
      scope:"the Russian matériel of the Arakcheev period",
      note:"item 15; nothing is drawn from it (no Russian battery is drawn as figures)"},
    drivers:{gen:true, why:"not re-read for 8E (viskovatov12_1900, the rules of 1806 and 1809: the company's own men; Part A's leads); nothing is drawn from it"}
  }
};


/* Stage 8, implementation PR 8G (decision 248 (a): "develop the villages around the cadastral street-and-yard pattern and add supported landmarks
   after research and a documented data task. Keep later maps' relevance to 1805 explicitly qualified. Unestablished roofing and other forms must
   remain labelled design conventions"; docs/STAGE8_SPEC.md section 19): the claims the drawn buildings rest on, each read on its page image or its
   sheet for 8G (docs/stage8-evidence/8g/README.md: the texts' register readings-texts.md, entries T, the sketches' readings-cadastre.md, sections C; each
   quotation checked again on its page image, quote-check.md). Each claim carries scope: the place and the time its source
   speaks for, and how far it is applied to 1805. Nothing here is drawn as such: the drawn sizes, heights, roofs, colours and spacings are
   presentation (VILL8G and BLD8G in world.js), design values at the building scale (decision 14). The stable cadastre's indication sketches of
   1825-1826 show the villages twenty years after the battle, after fires (Pratzen 1805, 1814, 1818; Telnitz 1808) and rebuilding: their pattern
   is applied to 1805 by inference, never as fact. A value is a claim, a disputed value with its sides, or {gen:true, why}; notDrawn holds what
   the sources name and the map does not draw, each with why and the alternatives put to the owner. */
var BUILDINGS = {
  /* the villages' plan, as the sketches read at full resolution show it (Sokolnitz, Telnitz, Pratzen, Kobelnitz with Puntowitz) */
  plan: {
    form:{v:"each farmstead one carmine mass drawn as an L: a range along the street and a long range back along a side boundary of a narrow, deep plot, its narrow end at the street",
      en:"the farmsteads L-shaped, a range along the street and a long range back along the plot's side", src:"mza_sokolnitz1825", at:"pieces A04D and A05D, level 4: the west row's plots 52-40 and the east row's 20-32 (about 22 of 26 an L); the title on the back of sheet II, piece R02D",
      gr:"B", lab:"inference", q:"Gemeinde SOKOLLNITZ",
      scope:"Sokolnitz as surveyed in 1825, and as read the same way at Telnitz (1825, all 14 plots measured) and Pratzen (1826, 16 of 17); Puntowitz's closed courtyards the exception read. Drawn for every village: for 1805 an inference, and for the villages whose sketches of the 1820s were not read a design value",
      note:"readings C1.1-C1.4; plots about 22 m wide and 83-112 m deep (drawn narrower and shallower: the building scale); which part of the L was the dwelling is not drawn on the sheets"},
    north:{v:"the long range on the plot's north boundary in the west row's plots 51, 50, 45, 44, 43, 42, 41, 40 and in every plot of the east row read",
      en:"the long range on the plot's northern boundary", src:"mza_sokolnitz1825", at:"pieces A04D and A05D, level 4; the title on the back of sheet II, piece R02D", gr:"B", lab:"inference", q:"Gemeinde SOKOLLNITZ",
      scope:"Sokolnitz in 1825 (8 of 11 in the west row, all in the east), Telnitz in 1825 (all 14 on the north-east boundary), Pratzen in 1826 (on the north); for 1805 an inference; drawn on most plots of every village (VILL8G.north): a design value from these",
      note:"reading C1.1-C1.3"},
    walls:{v:"Die Chausseen, das Innere aller gemauerten Gebäude, die steinernen Brücken werden mit blassem Carmin, die öffentlichen Gebäude mit starkem Carmin angelegt. [...] Alle hölzernen Gebäude werden blaßgelb angelegt.",
      en:"on the survey's sketches masonry buildings are washed pale carmine, public buildings strong carmine, wooden buildings pale yellow", src:"instruction1824", at:"p. 79, §§ 466 and 468",
      gr:"B", lab:"fact", q:"Alle hölzernen Gebäude werden blaßgelb angelegt",
      scope:"what the colours of the 1824-1826 survey's sketches mean: the buildings' walls, masonry or wooden; it names no roof. The villages' houses are carmine on every sketch read; drawn whitewashed (the colour a design value). The regulation of the 1824-1826 survey: not a claim about 1805",
      note:"reading T4.1; the regulation in force for the survey, not for 1805"},
    roofs:{gen:true, why:"no source read names the roofing of the field's villages' houses: not the topographies of 1793 and 1836-1861, not the 1824 Instruction (its colours are the walls'), not the battle accounts. Lejeune names old thatched roofs in the French bivouacs on the eve (lejeune1851, pp. 194-195), Schwoy the town of Austerlitz all tiled (below). Drawn as a design convention: thatch, tile on about one farmstead in six, tile on the town and on the manors (BLD8G.tile)"},
    counts:{gen:true, why:"the number of farmsteads drawn is the build's own symbol count for each village (VILLAGES), not the 28 to 138 houses each had in 1793 (Schwoy) or in 1836-1837 (Wolny): at the building scale more would not fit the village's place; at Satschan five of its seven, its drawn place lying half under the drawn mere's ice and crossed by the Littawa, its church in it"}
  },
  /* the buildings at the back of the yards, village by village: the share of the plots that have one and their walls, as the sketch shows */
  villages: {
    Sokolnitz:{rear:{v:"a separate carmine building at or near the back of the yard in 6 of 26 plots; no yellow building in the village", en:"a masonry building at the back of the yard on about a quarter of the plots",
      n:0.23, wall:"masonry", src:"mza_sokolnitz1825", at:"pieces A04D and A05D, level 4: west row 44, 40; east row 20, 25, 26, 32; the title on the back of sheet II, piece R02D", gr:"B", lab:"inference", q:"Gemeinde SOKOLLNITZ",
      scope:"Sokolnitz in 1825; for 1805 an inference", note:"reading C1.1"}},
    Telnitz:{rear:{v:"a separate building at the back of the yard in 1 of 10 plots checked; no yellow building", en:"a masonry building at the back of the yard on a tenth of the plots",
      n:0.1, wall:"masonry", src:"mza_telnitz1825", at:"pieces A02D and A03D, level 4: north-west row plot 37; the title's count of building parcels on piece A01A", gr:"B", lab:"inference", q:"Bauparzellen 98",
      scope:"Telnitz in 1825, after the fire of 1808 that took 22 houses (Wolny 1837): for 1805 an inference", note:"reading C1.2"}},
    Pratzen:{rear:{v:"a yellow building at the back of the yard, where the yard meets the garden, in about 13 of 17 plots of the main street", en:"a wooden building at the back of the yard on most plots",
      n:0.76, wall:"timber", src:"mza_pratzen1826", at:"detail pieces A07A and A08A, level 4: east row 9 of 9 but 21, west row 89, 86, 78, 77 and probably 82; the title on piece A01A", gr:"B", lab:"inference", q:"Gemeinde PRATZE",
      scope:"Pratzen in 1826, after the fires of 1805, 1814 and 1818 (Wolny 1837): for 1805 an inference; yellow is wooden by the 1824 Instruction's colours", note:"reading C1.3"}},
    Kobelnitz:{rear:{v:"three small yellow squares (about 6 by 6 m) in yards of the village's south part", en:"a few small wooden buildings in the yards",
      n:0.15, wall:"timber", src:"mza_kobelnitz1825", at:"piece A04C, level 4; the title on piece A01A", gr:"B", lab:"inference", q:"Kobelnitz samt Enclav Puntowitz",
      scope:"Kobelnitz in 1825; for 1805 an inference", note:"reading C1.4"}},
    Puntowitz:{rear:{v:"closed courtyards: a continuous carmine range along the green, side ranges and a back range round a small light yard, in nearly every plot of both rows", en:"courtyards closed by a back range",
      n:0.8, wall:"masonry", src:"mza_kobelnitz1825", at:"piece A02D, level 4: north row parcels 10-19, south row about 1-10; the title on piece A01A", gr:"B", lab:"inference", q:"Kobelnitz samt Enclav Puntowitz",
      scope:"Puntowitz (an enclave of the Kobelnitz survey) in 1825; drawn as the L with a building at the back of its yard; for 1805 an inference", note:"reading C1.4"}},
    Augezd:{rear:{gen:true, why:"no indication sketch of the 1820s: the archive's fund holds Augezd's (Újezd u Brna) from 1873 on only (searched 29 October 2026); the design share drawn (VILL8G.rear)"}},
    Satschan:{rear:{gen:true, why:"no indication sketch of the 1820s: Žatčany's from 1873 only (searched 29 October 2026); the design share drawn"}},
    Menitz:{rear:{gen:true, why:"no indication sketch of the 1820s: Měnín's from 1873 on only (searched 29 October 2026); the design share drawn"}}
  },
  /* the churches standing on 2 December 1805, one claim each (CHURCHES in world.js draws them by the village's point, as the build drew them at
     it: each moved the least step that clears the roads and streams drawn through the point, docs/STAGE8_SPEC.md section 19; the place each
     source gives within or beside the village is in its scope. Since the follow-up 8J a church whose own site is read is drawn there:
     Pratzen's, world.js LANDMARK_SITES.church) */
  churches: {
    Telnitz:{v:"die dem hl. Johann d. Täuf. geweihte Kirche mit 3 Altären wurde in ihrer dermaligen Gestalt [...] zwischen 1726 u. 1740 neu erbaut", en:"the church of St John the Baptist, rebuilt between 1726 and 1740",
      src:"wolny1837", at:"p. 467 (leaf n472)", gr:"B", lab:"fact", q:"zwischen 1726 u. 1740 neu erbaut",
      scope:"the church that stood in 1805 (its rebuilding 1726-1734 in the church topography, wolnykt1_1856 p. 438: disputed, both before 1805); a little apart from the village in its walled churchyard (1856), at the street's north-east end on the 1825 sketch; its old tower 'kegelförmig auslaufend' (ending in a cone), as the build's spire draws it",
      note:"readings T1.5, T3.7, C1.2"},
    Pratzen:{v:"Pratzen [...] mit einer außer dem Orte stehenden Kirche", en:"a church standing outside the village",
      src:"schwoy1793", at:"p. 309 (leaf n317)", gr:"B", lab:"fact", q:"mit einer außer dem Orte stehenden Kirche",
      scope:"the church of 1728-1730 (Wolny 1837, pp. 51-52), so standing in 1805; outside the village in 1793 and on the 1826 sketch (276 m south-south-west of the street's midpoint, south of the brook, on a north-facing slope): drawn at its own site, today's church (RÚIAN building 46052721), 399 m south-south-west of the village's point, moved only as far as the drawn roads and streams ask (since the follow-up 8J, decision 259 (a); by the village's point until then): B for 1826, for 1805 the 1826 site carried back with the 1793 text's 'outside the village'",
      note:"readings T2.3, T1.7, T3.10, C4"},
    Augezd:{v:"Die alte Pfarrkirche zu den hl. Fürsten-Aposteln Peter und Paul, mitten im D. etwas erhöhet stehend", en:"the old parish church, standing slightly raised in the middle of the village",
      src:"wolnykt2_1858", at:"p. 212 (leaf n231)", gr:"B", lab:"inference",
      q:"mitten im D. etwas erhöhet stehend", scope:"the church replaced in 1845-1846, which had survived the fire of 1794 that took the rest of the village (Wolny 1836, p. 237): standing in 1805 by inference; Schwoy (1793) names Augezd's parish",
      note:"readings T3.2, T1.16, T2.4"},
    Satschan:{v:"Satschan [...] Dorf von 38 Häusern, 38 Familien, 284 Seelen, mit einer Kirche", en:"a village with a church",
      src:"schwoy1793", at:"p. 370 (leaf n378)", gr:"B", lab:"fact", q:"mit einer Kirche",
      scope:"Satschan in 1793, its church standing in 1805 by inference (no change read); north of the village by the churchyard, with a Romanesque west tower (the church topography, 1858, p. 213); drawn by the village's point. Not drawn before 8G",
      note:"readings T2.5, T3.3"},
    Menitz:{v:"Am nördlichsten Ende des Ortes und im ummauerten Friedhofe steht etwas erhöht die Kirche zur hl. Jgfr. u. Martyr. Margareth.", en:"the church of St Margaret at the north end of the market, in its walled churchyard",
      src:"wolnykt2_1858", at:"p. 220 (leaf n239)", gr:"B", lab:"inference", q:"Am nördlichsten Ende des Ortes",
      scope:"the church restored after the storm of 1763, keeping its Gothic presbytery: standing in 1805 by inference; Schwoy (1793) names Menitz's local chaplaincy of 1785; drawn by the village's point. Not drawn before 8G",
      note:"readings T3.4, T2.6"},
    Schlapanitz:{v:"Nach der Schlacht von Austerlitz diente die Kirche durch einige Tage zum Gefängniß", en:"after the battle the church served for some days as a prison",
      src:"wolnykt1_1856", at:"p. 437", gr:"B", lab:"fact", q:"diente die Kirche durch einige Tage zum Gefängniß",
      scope:"standing in 1805 (the claim itself): the parish church rebuilt after the fire of 1757, in the old churchyard close by the market on a height (p. 433); drawn by the village's point",
      note:"reading T3.5"},
    Krzenowitz:{v:"Die Franzosen raubten hier 1805 außer 5 Kaseln, bedeutender Wäsche u. a., auch 3 Mk. an Silber.", en:"the French plundered the church in 1805",
      src:"wolnykt3_1860", at:"p. 475", gr:"B", lab:"fact", q:"Die Franzosen raubten hier 1805",
      scope:"standing in 1805 (the claim itself): the church of St Laurence on a hill east of the village (1860), its presbytery perhaps of the fifteenth century; Schwoy (1793) names it; drawn by the village's point",
      note:"readings T3.14, T2.12"},
    Bosenitz:{v:"Die Kirche, dem hl. Bischof Nikolaus geweiht, steht etwas erhöht über dem D. gegen OSO. auf dem alten Friedhofe", en:"the church of St Nicholas, a little raised above the village to the east-south-east",
      src:"wolnykt3_1860", at:"p. 482", gr:"B", lab:"inference", q:"steht etwas erhöht über dem D. gegen OSO.",
      scope:"its tower built new in 1794, the church reshaped in 1830-1848: standing in 1805 by inference; Schwoy (1793) names Bosenitz's parish; drawn by the village's point",
      note:"readings T3.12, T2.11"},
    Austerlitz:{v:"so erbaute nur gedachter Fürst erst vor wenig Jahren an einer anderen Stelle, auch von Grund auf, eine ganz neue, geschmackvolle, sehr schöne Kirche", en:"a wholly new church built a few years before 1793",
      src:"schwoy1793", at:"p. 48 (leaf n56)", gr:"B", lab:"fact", q:"eine ganz neue, geschmackvolle, sehr schöne Kirche",
      scope:"the parish church of 1786-1790, standing in 1805, at the north side of the square near the château; drawn as the church topography describes it (below), not with the build's spire",
      note:"readings T2.15, T1.12, T3.13"}
  },
  /* a chapel standing in 1805 where no church stood (CHAPELS in world.js draws it, smaller than the churches) */
  chapels: {
    Holubitz:{v:"Hodnotný historický doklad vrcholně barokní drobné sakrální architektury z roku 1769, výrazná dominanta obce středu obce.", en:"a small high-Baroque chapel of 1769 at the village's centre",
      src:"npu1000133864", at:"the record's annotations (the geoportal's layers 12 and 5)", gr:"C", lab:"inference", q:"drobné sakrální architektury z roku 1769",
      scope:"the chapel of St Gotthard with its belfry on the green (layer 5: 'Kaple sv. Gottharda se zvonicí je sitovaná na návsi obce'), of 1769 by the modern heritage catalogue: standing in 1805 by inference from that date; the topographies of 1793, 1836 and 1856-1861 name no church or chapel at Holubitz (their silence read, not a denial). Drawn as the build's church silhouette at a chapel's size (its form and size a design value; the building today about 4 by 4 m); drawn with a full church until 8G",
      note:"docs/stage8-evidence/8g/places.md, Table A row 23; readings T2.9, T1.14, N3.1"}
  },
  /* the villages the build drew with a church until 8G, where no source read names one */
  noChurch: {
    Girzikowitz:{v:"Girzikowitz, ein Dorf, zwey Meilen von Brünn südwärts gelegen, hat einen Mayerhof", en:"a village with a manorial farm (no church named)",
      src:"schwoy1793", at:"p. 120 (leaf n128)", gr:"B", lab:"inference", q:"hat einen Mayerhof",
      scope:"no church or chapel named in 1793, in 1836-1837 (Wolny) or in the church topography of 1856-1861, whose index has no entry for the village: for 1805 the sources' silence before and after; drawn with a church until 8G, none since", note:"readings T2.8, T1.6, N1.4, N3.1"},
    Kobelnitz:{v:"Kobelnitz, zur Herrschaft Sokolnitz gehöriges Dorf mit einem Mayerhof", en:"a village with a manorial farm (no church named)",
      src:"schwoy1793", at:"p. 160 (leaf n168)", gr:"B", lab:"inference", q:"Dorf mit einem Mayerhof",
      scope:"no church named in 1793, in 1837 or in the church topography (in Schlapanitz parish, with a school only); the 1825 sketch draws a cross on the green and no church: for 1805 the sources' silence before and after; drawn with a church until 8G, none since", note:"readings T2.7, T1.4, T3.5, C1.4"},
    Sokolnitz:{v:"Im Schloße befindet sich eine geräumige Kapelle", en:"in the castle a spacious chapel",
      src:"schwoy1793", at:"p. 394 (leaf n402)", gr:"B", lab:"inference", q:"Im Schloße befindet sich eine geräumige Kapelle",
      scope:"in 1793 and 1837, so in 1805 by inference, the village had no church of its own: it was in Telnitz parish, its church the castle's chapel (Wolny 1837, p. 465); the 1825 sketch draws no church in the village; drawn with a church until 8G, none since (the castle's chapel is within its ranges)", note:"readings T2.1, T1.1, C1.1"},
    Blasowitz:{v:"Blazowitz, Dorf, mit einem Schloße, Bräuhaus, und großen Mayerhof", en:"a village with a castle, a brewery and a large manorial farm (no church named)",
      src:"schwoy1793", at:"p. 60 (leaf n68)", gr:"B", lab:"inference", q:"mit einem Schloße, Bräuhaus, und großen Mayerhof",
      scope:"no church named in 1793 or 1837; in Bosenitz parish, with a school and no chapel (1860): for 1805 the sources' silence before and after (its belfry dates from 1831-1832, places.md); drawn with a church until 8G, none since", note:"readings T2.10, T1.18, T3.12"}
  },
  /* the Sokolnitz castle and its farm (drawn at the castle's own site since the follow-up 8J, decision 259 (a); by the map's legacy place, 535 m
     south-east, until then) */
  sokolnitz: {
    castle:{v:"Das obrgktl. Schloß steht auf einer Anhöhe und bildet ein regelmäßiges Viereck, dessen östl. Fronte 2 Stockwerke hoch ist [...] während die andern 3 Seiten nur 1 Stockwerk haben",
      en:"a regular quadrangle, its east front two storeys, the other three sides one", src:"wolny1837", at:"p. 465 (leaf n470)", gr:"B", lab:"inference", q:"bildet ein regelmäßiges Viereck",
      scope:"the castle in 1837, and in 1825 a closed carmine quadrangle of 79.6 by 60.0 m round a court, its east range about 1.7 times as deep as the others (mza_sokolnitz1825, piece A04E); no rebuilding between 1805 and 1837 read: its form in 1805 an inference. Drawn at its own site, today's castle and the 1825 quadrangle on one site (RÚIAN building 13158571; the sketch georeferenced on it, its far checks holding to 7-15 m: B for 1825), west of the corrected Goldbach as in 1825, its quadrangle covering its site; the drawn track and brook there (their widths a display convention) leave no room for it at the buildings' drawn size, so it and its farm are drawn smaller, at the largest size that stands clear (since the follow-up 8J, decision 259 (a); until then at the map's legacy place, 535 m south-east, across the drawn brook); its site in 1805 the 1825 site by the texts (Schwoy 1793; Mikhailovsky-Danilevsky 1844, the road crossing the brook beside it)",
      note:"readings T1.1, C3.1; Thiébault (1894) names its main house, stables, barns, outbuildings and avenues in the fight (T6.6)"},
    farm:{v:"Sokolnitz, Dorf von 75 Häusern, 574 Seelen, mit einem guten Schloße und Garten, auch einem Bräuhause und Mayerhof", en:"the manorial farm named with the castle in 1793",
      src:"schwoy1793", at:"p. 393 (leaf n401)", gr:"B", lab:"fact", q:"auch einem Bräuhause und Mayerhof",
      scope:"the farm in 1793, standing in 1805 by inference; south of the castle in 1837 (Wolny, p. 466) and on the 1825 sketch (two yards on either side of a road, long carmine ranges); drawn as three ranges round one yard south of the castle (DESIGN), on the castle's side of the brook as corrected (since the follow-up 8J; across the drawn brook from it until then)",
      note:"readings T2.1, T1.2, C3.6"},
    orchardWall:{v:"the walled orchard west of the castle", lab:"disputed", gr:"C",
      scope:"the orchard west of the castle: walled in 1837 (Wolny), no wall drawn there on the 1825 sketch; for 1805 neither settles it, so no wall is drawn", sides:[
      {v:"An dasselbe stoßt im W. der mit seltenen Weinreben, Pfirsich- und andern edlen Bäumen besetzte und ummauerte Obstgarten an", en:"a walled orchard adjoins the castle on the west",
        src:"wolny1837", at:"p. 465 (leaf n470)", gr:"B", lab:"fact", q:"ummauerte Obstgarten"},
      {v:"parcel 620 west of the castle unwashed (not the gardens' green), with no wall line drawn round it or the garden 619", en:"no wall drawn west of the castle in 1825",
        src:"mza_sokolnitz1825", at:"piece A04E, level 4; the title on the back of sheet II, piece R02D", gr:"B", lab:"fact", q:"Gemeinde SOKOLLNITZ"}],
      note:"not drawn (decision 103's rule for a disputed value): Wolny (1837) has the orchard walled, the 1825 sketch draws no wall there (the 1824 Instruction marks a single wall with a carmine line, § 458); for 1805 neither settles it. Readings T1.1, C3.2"}
  },
  /* Telnitz's churchyard, walled in the battle */
  telnitz: {
    churchyard:{v:"Während der Schlacht hat das Pfarrhaus vom russischen Geschütz viel gelitten, weil sich die Franzosen in dem ummauerten Friedhof hartnäckig vertheidigten",
      en:"the French defended themselves stubbornly in the walled churchyard", src:"wolnykt1_1856", at:"p. 440", gr:"B", lab:"attributed", q:"in dem ummauerten Friedhof hartnäckig vertheidigten",
      scope:"the churchyard on 2 December 1805, from the parish memorial book of the priest, an eyewitness, as Wolny reports it; its line and height not read: drawn round the church at a design distance, its gate toward the village",
      note:"reading T3.8; the 1825 sketch draws the churchyard as a light-green polygon by the church (C1.2)"}
  },
  /* the fences round the villages where a source names them (BLD8G.fence draws them along the village's drawn edge: a convention) */
  fences: {
    Telnitz:{v:"welches besonders bei den Dörfern Tellnitz und Sokolnitz schwer zu passiren ist, weil diese mit Zäunen und Gräben umgeben sind", en:"Tellnitz and Sokolnitz surrounded by fences and ditches",
      src:"schoenhals1873", at:"p. 155 (leaf n159)", gr:"B", lab:"fact", q:"mit Zäunen und Gräben umgeben",
      scope:"the two villages as Schönhals (1873, from the war archive's records) describes the ground of 1805; their course not read; the 1825 sketches draw no fence, hedge or ditch at either village's edge (the 1824 Instruction has a sign for each)",
      note:"readings T6.1, C1.1, C1.2; the ditches round Telnitz also in Stutterheim (1806), below"},
    Sokolnitz:{v:"welches besonders bei den Dörfern Tellnitz und Sokolnitz schwer zu passiren ist, weil diese mit Zäunen und Gräben umgeben sind", en:"Tellnitz and Sokolnitz surrounded by fences and ditches",
      src:"schoenhals1873", at:"p. 155 (leaf n159)", gr:"B", lab:"fact", q:"mit Zäunen und Gräben umgeben",
      scope:"as for Telnitz (the ground of 1805 as Schönhals describes it); the fence drawn round the village's place, not round the castle and its farm",
      note:"readings T6.1, C1.1"}
  },
  /* Austerlitz */
  austerlitz: {
    roofs:{v:"215 christliche und 32 jüdische Häuser, so seit dem vor ungefähr 20 Jahren fürgewesenen Brand, auf Veranstaltung des fürstlichen Grundherrn, alle mit Ziegeln eingedecket sind",
      en:"the town's houses all roofed with tiles since a fire about twenty years before 1792", src:"schwoy1793", at:"p. 47 (leaf n55)", gr:"B", lab:"fact", q:"alle mit Ziegeln eingedecket",
      scope:"the town's houses at the count of 1792; for 1805 an inference (no change read): drawn tiled, the one village or town whose roofing a source gives",
      note:"reading T2.15"},
    church:{v:"Die neue, in mancher Hinsicht auffallende Kirche, welche nahe am Schloße und an der äußersten Nordseite des Stadtplatzes mit dem Hochaltar ebenfalls gegen N. gestellt steht [...] dem, wegen schlechten Grundes nur bis zum mit Ziegeln gedeckten Dach reichenden, hinter dem Hochaltar angebauten Thurm",
      en:"the church near the château at the north side of the square, its altar to the north, its one tower behind the altar rising only to its tiled roof", src:"wolnykt3_1860", at:"pp. 473-474", gr:"B", lab:"inference",
      q:"nur bis zum mit Ziegeln gedeckten Dach reichenden",
      scope:"the church finished in 1790, as the church topography describes it in 1860: a temple's front of six columns (Ionic in Wolny 1836, Corinthian in 1860: disputed, the order not drawn) under a pediment, its portico to the south; the low tower put down to the bad ground, so taken for 1805 (inference). Drawn so in place of the build's spired church there; its place a layout of the town's",
      note:"readings T3.13, T1.12"},
    chateau:{v:"Mit der Hauptfronte, an die sich zu beiden Seiten Flügel anschließen, ist es gegen SW. gekehrt, und hat (mit Einschluß des untern), 3 Stockwerke",
      en:"its main front, with a wing at each end, facing south-west; three storeys", src:"wolny1836", at:"p. 152 (leaf n219)", gr:"B", lab:"inference", q:"ist es gegen SW. gekehrt",
      scope:"the château built from about the 1750s (Schwoy 1793: laid out about forty years before), as Wolny describes it in 1836: standing so in 1805 by inference; drawn by the church, within 22.5 degrees of the bearing its own place has from the church's today (236 degrees, west-south-west, places.md), its centre in the town's place and no road or stream of this map's between them, where this map's road and stream through the town leave room: a layout (the sources place the two by the square, not to a point). Its garden west of it (world.js GARDENS, since the follow-up 8J): drawn at the garden's own outline, the 1826 sketch's and the Second Survey's, as rows of trees west of the château as drawn, the rows a convention (DESIGN); no house of the town in it",
      note:"readings T1.13, T2.15"},
    /* Stage 8, the follow-up 8J (decision 259 (a); docs/stage8-evidence/8h/geo/proposal.md G6): the garden west of the château, drawn at its own
       outline (world.js GARDENS) in place of the build's "Austerlitz park", a wood 1.6 km south-east of the town */
    garden:{v:"Uebrigens ist dieses Schloß, an den w. ein herrlicher gegenwärtig aber etwas vernachlässigter Garten anstoßt",
      en:"a splendid garden adjoining the château on the west, somewhat neglected in 1836", src:"wolny1836", at:"p. 153 (leaf n220)", gr:"B", lab:"fact",
      q:"an den w. ein herrlicher gegenwärtig aber etwas vernachlässigter Garten anstoßt",
      scope:"the garden west of the château in 1836, with the château 'eine Schöpfung des [...] Fürst. Wenzel' (p. 152): Kaunitz died in 1794, so it was laid out before 1805 (an inference); a formal garden of compartments with rows of trees on an east-west axis on the 1826 sketch (MOR243418260, read without a georeference: its side unambiguous) and on the Second Military Survey (1836-52), its outline there that of today's garden (OSM way 27326751, 16.9 ha): drawn at that outline as rows of trees west of the château as drawn, the rows' number and spacing a convention (DESIGN), the planting in 1805 not established. The 'Austerlitz park' drawn until the follow-up 8J, a wood 1.6 km south-east of the town, stood on fields and meadows in 1836-52: no support",
      note:"readings T1.13; docs/stage8-evidence/8h/geo/README.md sections 6.2, 6.3 and 7.6"}
  },
  /* what the sources name and the map does not draw, each with why and the alternatives put to the owner (docs/STAGE8_SPEC.md section 19) */
  notDrawn: {
    stAnthony:{gen:true, en:"the chapel of St Anthony above Augezd (it stood, but its form and its state on the day are not known)", why:"the chapel of St Anthony above Augezd stood in 1805 (built before 1713, still standing, deconsecrated, in 1818, demolished afterwards: wolnykt2_1858, pp. 214-215; named as a landmark by Stutterheim in 1806), but its form, its roof and its state on the day are in no source read; that it 'lost its roof about the time of the battle' is a modern web text only (ujezd2025). Alternatives: as now, its name on the ground; a small generic chapel, roofed as a convention and labelled so; or a source first (the Augezd parish memorial book, the First Military Survey's sheet)"},
    santon:{gen:true, en:"the Santon's chapel (destroyed by the French during the battle, at an hour no source read gives)", why:"the Santon's chapel, half masonry and half wood (wolnykt3_1860, pp. 482-483), was destroyed by the French during the battle (wolny1837, p. 130), at an hour no source read gives, and rebuilt in 1832: to draw it would fix a time of destruction, and the rebuilt chapel is not the chapel of 1805. Alternatives: as now; drawn standing until a stated phase, that phase a convention labelled so; or a source for the hour first"},
    granary:{gen:true, en:"the Sokolnitz granary (its date not read)", why:"the Sokolnitz granary is drawn on the 1825 sketch (35.5 by 16.5 m, south-west of the castle) and was four storeys in 1837 (Wolny, p. 466), who writes in his own voice, naming no source, that over 3,000 Russians were taken near it by the French in the afternoon, between 3 and 4; its date is not read (a heritage catalogue's 'first quarter of the eighteenth century' is a search snippet). Alternatives: drawn as standing in 1805 (an inference from the tradition), or the catalogue read first"},
    pheasantryWall:{gen:true, why:"no wall round the pheasantry: the 1825 sketch draws none round the 'Fasangarten' (nor any fence), Wolny (1837) names only the orchard walled, and a regional site dates the wall later (C)"},
    ditches:{gen:true, why:"the ditches round Telnitz and its vineyards (stutterheim1806de, pp. 50-51 and 77: 'mit Gräben umgeben'; Schönhals's 'Gräben' at both villages) are not drawn: their course is not read, and at the building scale a ditch is a line on the ground, left with the ground's polish"}
  }
};

/* the table's resolution (decision 100): a leaf formation's dress classes with their shares of its drawn battalions or
   squadrons (within each mount group: foot, horse), and the colours each carries. Read by the tests and the dossier
   (6C); draws nothing. */
function appearanceOf(id){
  var c=COMPOSITION[id]; if(!c) return null;
  var tot={};
  c.parts.forEach(function(p){ var d=DRESS[p.dress], g=d?d.mount:"?"; tot[g]=(tot[g]||0)+p.n; });
  return { id:id, dominant:!!c.dominant, note:c.note||null,
    parts:c.parts.map(function(p){ var d=DRESS[p.dress], g=d?d.mount:"?";
      return { dress:p.dress, mount:g, share:tot[g]>0?p.n/tot[g]:0, n:p.n, unit:p.unit, regts:p.v||null, d:d||null,
        colours:(d&&COLOURS_CARRIED[d.carry])||null }; }),
    others:(c.others||[]).map(function(p){ return { dress:p.dress, n:p.n, unit:p.unit, regts:p.v||null, d:DRESS[p.dress]||null }; }) };
}
