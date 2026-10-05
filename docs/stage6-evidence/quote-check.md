# Stage 6B: the quotes of appearance.js checked against their sources' text

`node tools/stage6/verify-quotes.js --md docs/stage6-evidence/quote-check.md`, run 2026-10-05. Each quote normalised (case, diacritics, pre-reform letters, punctuation, hyphenation) and searched for whole in the source's OCR text; "checked on the page image" names the image (tools/stage6/quote-check-images.json); "not found whole" gives the share of its word pairs found (OCR errors, a quote read on the page image, a different edition's text); "not checked" means no text layer could be read here (the quote was read on the page image by the reading pass, `readings-*.md`).

**quotes 309: found whole 103, found with OCR differences 31, not found 56, checked on the page image 41, not checked (no text layer here) 78**

| claim | source | locator | result | quote |
|---|---|---|---|---|
| DRESS.fr_line.coat | `fieffe2_1854` | t. II, pp. 17-18, footnote | found | habit bleu avec revers, retroussis et pattes de parements blancs |
| DRESS.fr_line.facings | `fieffe2_1854` | t. II, p. 17 | found | collet et passe-poils rouges |
| DRESS.fr_line.head | `corr11_1863` | no. 9541, 30e Bulletin de la Grande Armée, Austerlitz, 12 frimaire an XIV, pp. 450-452 | found | les chapeaux au bout des baïonnettes |
| DRESS.fr_line.greatcoat side 0 | `alombert4_1908` | p. 321 (Vandamme to Soult, Mettenheim, 8 brumaire an XIV) | found | aucun corps n'a encore reçu ses capotes |
| DRESS.fr_line.greatcoat side 1 | `corr11_1863` | no. 9506, to Dejean, Znaim, p. 424 | found | J'ai ici des capotes plus qu'il ne m'en faut |
| DRESS.fr_line.greatcoat side 2 | `corr11_1863` | no. 9572, ordre du jour, Schönbrunn, p. 477 | found | On doit profiter de l'armistice pour faire confectionner des capotes |
| DRESS.fr_light.coat | `fieffe2_1854` | t. II, pp. 28-29, footnote | found | portait l'habit-veste et le pantalon bleus |
| DRESS.fr_light.legwear | `fieffe2_1854` | t. II, pp. 28-29 | found | l'habit-veste et le pantalon bleus |
| DRESS.fr_light.head | `bardin15_1850` | article 'Schako d'infanterie', p. 4789 | found with OCR differences: 70% of its word pairs in one passage (archive.org OCR) | Toute l'infanterie légère en fut coiffée en l'an six |
| DRESS.fr_light.greatcoat side 0 | `alombert4_1908` | p. 321 (Vandamme's division, which held the 24e légère) | found | aucun corps n'a encore reçu ses capotes |
| DRESS.fr_light.greatcoat side 1 | `corr11_1863` | no. 9506, p. 424 | found | J'ai ici des capotes plus qu'il ne m'en faut |
| DRESS.fr_gren_line.coat | `fieffe2_1854` | t. II, pp. 17-18 | found | habit bleu avec revers, retroussis et pattes de parements blancs |
| DRESS.fr_gren_line.head side 0 | `bardin9_1849` | article 'Grenadiers réunis', p. 2659 | found with OCR differences: 67% of its word pairs in one passage (archive.org OCR) | l'adoption des schakos |
| DRESS.fr_gren_line.head side 1 | `barres1923` | p. 56 (view f84) | found | en grande tenue, bonnets à poil et plumets au vent |
| DRESS.fr_gren_line.greatcoat | `barres1923` | p. 56 | not checked (Gallica: no view named in the locator, or not reachable) | en grande tenue |
| DRESS.fr_gren_light.coat | `fieffe2_1854` | t. II, pp. 28-29 | found | portait l'habit-veste et le pantalon bleus |
| DRESS.fr_gren_light.legwear | `fieffe2_1854` | t. II, pp. 28-29 | found | l'habit-veste et le pantalon bleus |
| DRESS.fr_gren_light.head side 0 | `bardin9_1849` | article 'Grenadiers réunis', p. 2659 | found with OCR differences: 67% of its word pairs in one passage (archive.org OCR) | l'adoption des schakos |
| DRESS.fr_gren_light.head side 1 | `barres1923` | p. 56 (view f84) | found | en grande tenue, bonnets à poil et plumets au vent |
| DRESS.fr_gren_light.greatcoat | `barres1923` | p. 56 | not checked (Gallica: no view named in the locator, or not reachable) | en grande tenue |
| DRESS.fr_guard_gren.coat | `perrot1821` | 'Garde des consuls. Grenadiers à pied', pp. 209-210 (views f219-f220) | found | L'habit des grenadiers était bleu de roi |
| DRESS.fr_guard_gren.facings | `perrot1821` | p. 209 | not checked (Gallica: no view named in the locator, or not reachable) | revers blancs, taillés carrément |
| DRESS.fr_guard_gren.legwear | `perrot1821` | p. 210 | not checked (Gallica: no view named in the locator, or not reachable) | Veste et culotte blanches |
| DRESS.fr_guard_gren.head | `perrot1821` | pp. 210, 212 | not checked (Gallica: no view named in the locator, or not reachable) | Bonnet d'oursin, garni d'une plaque |
| DRESS.fr_guard_gren.greatcoat | `barres1923` | p. 56 (view f84) | found | en grande tenue |
| DRESS.fr_guard_chass.coat | `perrot1821` | 'Chasseurs à pied', pp. 226-227 (views f236-f237) | found | semblable pour les couleurs à celui des grenadiers à pied |
| DRESS.fr_guard_chass.legwear | `perrot1821` | p. 226 | not checked (Gallica: no view named in the locator, or not reachable) | semblable pour les couleurs |
| DRESS.fr_guard_chass.head | `perrot1821` | p. 226 | not checked (Gallica: no view named in the locator, or not reachable) | Le bonnet sans plaque |
| DRESS.fr_guard_chass.greatcoat | `barres1923` | p. 56 (view f84) | found | en grande tenue |
| DRESS.fr_cuirassier.coat | `martinet_tf` | pl. 67 '(1808)', view f71 | not checked (Gallica: no view named in the locator, or not reachable) | Cuirassiers 2. Rég. |
| DRESS.fr_cuirassier.cuirass | `bardin6_1849` | article 'Cuirasse de cavalerie française', p. 1770 | not found whole: 44% of its word pairs in one passage (archive.org OCR) | donna la Cuirasse à tous les corps de grosse cavalerie |
| DRESS.fr_cuirassier.legwear | `bardin4_1849` | article 'Cavalerie française', p. 1093 | found | la culotte de peau à toute la Cavalerie |
| DRESS.fr_cuirassier.head | `martinet_tf` | pl. 67 '(1808)', view f71 | not checked (Gallica: no view named in the locator, or not reachable) | Cuirassiers 2. Rég. |
| DRESS.fr_cuirassier.furniture | `martinet_tf` | pl. 67, view f71 | not checked (Gallica: no view named in the locator, or not reachable) | Cuirassiers 2. Rég. |
| DRESS.fr_carabinier.coat | `martinet_tf` | pl. 104, view f90 (no printed year) | not checked (Gallica: no view named in the locator, or not reachable) | Carabinier à cheval 1. Régiment |
| DRESS.fr_carabinier.cuirass side 0 | `bardin6_1849` | p. 1770 | not found whole: 44% of its word pairs in one passage (archive.org OCR) | donna la Cuirasse à tous les corps de grosse cavalerie |
| DRESS.fr_carabinier.cuirass side 1 | `martinet_tf` | pl. 104, view f90 | not checked (Gallica: no view named in the locator, or not reachable) | Carabinier à cheval 1. Régiment |
| DRESS.fr_carabinier.legwear | `bardin4_1849` | p. 1093 | found | la culotte de peau à toute la Cavalerie |
| DRESS.fr_carabinier.head | `martinet_tf` | pl. 104, view f90 | not checked (Gallica: no view named in the locator, or not reachable) | Carabinier à cheval 1. Régiment |
| DRESS.fr_dragoon.coat | `bardin7_1849` | article 'Dragon français', p. 1936 | found | ont pris et conservé le vert depuis 1762 |
| DRESS.fr_dragoon.legwear | `bardin7_1849` | p. 1937 | found | leur ancienne culotte de peau |
| DRESS.fr_dragoon.head | `bardin7_1849` | pp. 1936-1937 | found | casques à bandeaux de peau garnie de son poil |
| DRESS.fr_dragoon.furniture | `martinet_tf` | pl. 25 '(1807)', view f97 | not checked (Gallica: no view named in the locator, or not reachable) | Cavalerie Légère, Dragon 1er Régiment |
| DRESS.fr_hussar2.coat | `martinet_tf` | pl. 7 '(1807)', view f210 | not checked (Gallica: no view named in the locator, or not reachable) | Hussard 2e Régiment |
| DRESS.fr_hussar2.legwear | `martinet_tf` | pl. 7, view f210 | not checked (Gallica: no view named in the locator, or not reachable) | Hussard 2e Régiment |
| DRESS.fr_hussar2.head | `bardin15_1850` | 'Schako d'homme de troupe', p. 4788 | found | reconnaissait le Schako à toute la cavalerie, légère |
| DRESS.fr_hussar4.coat | `martinet_tf` | pl. 10 '(1807)', view f214 | not checked (Gallica: no view named in the locator, or not reachable) | Hussard 4e Régiment |
| DRESS.fr_hussar4.legwear | `martinet_tf` | pl. 10, view f214 | not checked (Gallica: no view named in the locator, or not reachable) | Hussard 4e Régiment |
| DRESS.fr_hussar4.head | `bardin15_1850` | p. 4788 | found | reconnaissait le Schako à toute la cavalerie, légère |
| DRESS.fr_hussar5.coat | `martinet_tf` | pl. 11 '(1807)', view f216 | not checked (Gallica: no view named in the locator, or not reachable) | Hussard 5e Régiment |
| DRESS.fr_hussar5.legwear | `martinet_tf` | pl. 11, view f216 | not checked (Gallica: no view named in the locator, or not reachable) | Hussard 5e Régiment |
| DRESS.fr_hussar5.head | `bardin15_1850` | p. 4788 | found | reconnaissait le Schako à toute la cavalerie, légère |
| DRESS.fr_chasseur5.coat | `fieffe2_1854` | t. II, pp. 30-31, footnote | found | Dolmanjusqu'en [sic] 1806 |
| DRESS.fr_chasseur5.legwear | `fieffe2_1854` | t. II, pp. 30-31 | found | pantalon vert dans la botte |
| DRESS.fr_chasseur5.head | `fieffe2_1854` | t. II, pp. 30-31 | found | shako; colback à flamme pour les compagnies d'élite |
| DRESS.fr_guard_grencav.coat | `perrot1821` | 'Grenadiers à cheval', pp. 235-236 (views f245-f246) | not checked (Gallica: no view named in the locator, or not reachable) | Habit entièrement semblable à celui des gre- nadiers à pied |
| DRESS.fr_guard_grencav.legwear | `perrot1821` | p. 235 | not checked (Gallica: no view named in the locator, or not reachable) | culotte de peau blanche |
| DRESS.fr_guard_grencav.head | `perrot1821` | p. 235 | not checked (Gallica: no view named in the locator, or not reachable) | Bonnet d'oursin sans plaque |
| DRESS.fr_guard_grencav.horse | `coignet1909` | p. 336 ('Additions et variantes') | found with OCR differences: 80% of its word pairs in one passage (archive.org OCR) | les chevaux noirs, c'est-à-dire les grenadiers à cheval |
| DRESS.fr_guard_grencav.furniture | `perrot1821` | 'Harnachement', p. 244 | not checked (Gallica: no view named in the locator, or not reachable) | Housse à pied en drap bleu de roi |
| DRESS.fr_guard_grencav.greatcoat | `perrot1821` | p. 236 | not checked (Gallica: no view named in the locator, or not reachable) | Manteau blanc |
| DRESS.fr_guard_chasscav.coat | `perrot1821` | 'Chasseurs à cheval', pp. 236-237 (views f246-f247) | not checked (Gallica: no view named in the locator, or not reachable) | Dolman de drap vert |
| DRESS.fr_guard_chasscav.legwear | `perrot1821` | p. 236 | not checked (Gallica: no view named in the locator, or not reachable) | Pantalon de peau jaune |
| DRESS.fr_guard_chasscav.head | `perrot1821` | pp. 236-237 | not checked (Gallica: no view named in the locator, or not reachable) | Kolbac à flamme rouge |
| DRESS.fr_mameluke.coat | `perrot1821` | 'Mamelucks', p. 237 | not checked (Gallica: no view named in the locator, or not reachable) | il n'était point uniforme |
| DRESS.fr_mameluke.legwear | `perrot1821` | p. 237 | not checked (Gallica: no view named in the locator, or not reachable) | variait par les couleurs des pantalons |
| DRESS.fr_mameluke.head | `perrot1821` | p. 237 | not checked (Gallica: no view named in the locator, or not reachable) | des vestes et des turbans |
| DRESS.fr_foot_art.coat | `martinet_tf` | view f234 '(1808)' | not checked (Gallica: no view named in the locator, or not reachable) | Canonnier |
| DRESS.fr_foot_art.legwear | `martinet_tf` | view f234 | not checked (Gallica: no view named in the locator, or not reachable) | Canonnier |
| DRESS.fr_foot_art.head | `martinet_tf` | view f234 | not checked (Gallica: no view named in the locator, or not reachable) | Canonnier |
| DRESS.fr_guard_art.coat | `perrot1821` | 'Artillerie à pied', pp. 232-233 (views f242-f243) | not checked (Gallica: no view named in the locator, or not reachable) | Uniforme des grenadiers à pied, avec re- vers et collet bleus |
| DRESS.fr_guard_art.legwear | `perrot1821` | p. 232 | not checked (Gallica: no view named in the locator, or not reachable) | veste et culotte bleues |
| DRESS.fr_guard_art.head | `perrot1821` | p. 233 | not checked (Gallica: no view named in the locator, or not reachable) | Bonnet d'oursin sans plaque |
| DRESS.fr_staff.coat | `reglt_gen_an12` | ch. I, art. 1, pp. 5-6 (views f15-f16) | not checked (Gallica: no view named in the locator, or not reachable) | L'habit grand uniforme des généraux sera de drap bleu national |
| DRESS.fr_staff.coat inForce | `berriat3_1812` | contents of ch. XIV, 4th section | found | Réglement du premier vendémiaire an 12 |
| DRESS.fr_staff.legwear | `reglt_gen_an12` | p. 6 | not checked (Gallica: no view named in the locator, or not reachable) | La culotte, en drap bleu |
| DRESS.fr_staff.legwear inForce | `berriat3_1812` | contents of ch. XIV, 4th section | found | Réglement du premier vendémiaire an 12 |
| DRESS.fr_staff.head | `reglt_gen_an12` | pp. 8-9 | not checked (Gallica: no view named in the locator, or not reachable) | Le panache sera composé de trois plumes d'autruche |
| DRESS.fr_staff.head inForce | `berriat3_1812` | contents of ch. XIV, 4th section | found | Réglement du premier vendémiaire an 12 |
| DRESS.fr_staff.furniture | `reglt_gen_an12` | 'Équipement du cheval', art. IV, pp. 10-11 | not checked (Gallica: no view named in the locator, or not reachable) | drap cramoisi |
| DRESS.fr_staff.furniture inForce | `berriat3_1812` | contents of ch. XIV, 4th section | found | Réglement du premier vendémiaire an 12 |
| DRESS.ru_musk.coat | `viskovatov10_1900` | p. 196 (leaf n199); plate 1274 | found | изъ темнозеленаго сукна |
| DRESS.ru_musk.facings | `viskovatov10_1900` | p. 196 | found with OCR differences: 75% of its word pairs in one passage (archive.org OCR) | въ каждой Инспекціи особаго цвѣта |
| DRESS.ru_musk.legwear | `viskovatov10_1900` | p. 197 (leaf n200) | not found whole: 33% of its word pairs in one passage (archive.org OCR) | Панталоны, изъ бѣлаго сукна |
| DRESS.ru_musk.head | `psz44_2_1830` | p. 67, no. 21,621 (order of 13 February 1805, OS) | checked on the page image (https://archive.org/download/polnoesobraniezakonovrossijskojimperiis27/page/n1051_w1600.jpg) | построить же ихъ по прошествіи срока сукну на старыхъ шапкахъ |
| DRESS.ru_musk.greatcoat | `viskovatov10_1900` | p. 198 (leaf n201) | found | изъ некрашенаго сукна |
| DRESS.ru_gren.coat | `viskovatov10_1900` | p. 196 (the grenadier private's coat) | found | изъ темнозеленаго сукна |
| DRESS.ru_gren.legwear | `viskovatov10_1900` | p. 197 | not found whole: 33% of its word pairs in one passage (archive.org OCR) | Панталоны, изъ бѣлаго сукна |
| DRESS.ru_gren.head | `psz44_2_1830` | p. 67, no. 21,621 | checked on the page image (https://archive.org/download/polnoesobraniezakonovrossijskojimperiis27/page/n1051_w1600.jpg) | построить же ихъ по прошествіи срока сукну на старыхъ шапкахъ |
| DRESS.ru_gren.greatcoat | `viskovatov10_1900` | p. 198 | found | изъ некрашенаго сукна |
| DRESS.ru_jager.coat | `viskovatov10_1900` | p. 253 (leaf n256); p. 258 | not found whole: 50% of its word pairs in one passage (archive.org OCR) | но только свѣтлозеленый |
| DRESS.ru_jager.legwear | `viskovatov10_1900` | p. 253 | not found whole: 50% of its word pairs in one passage (archive.org OCR) | но только свѣтлозеленыя |
| DRESS.ru_jager.head side 0 | `viskovatov10_1900` | pp. 256-258 | found | даны круглыя |
| DRESS.ru_jager.head side 1 | `psz44_2_1830` | p. 67, no. 20,927 | checked on the page image (https://archive.org/download/polnoesobraniezakonovrossijskojimperiis27/page/n1051_w1600.jpg) | вмѣсто шляпъ, быть шапкамъ изъ чернаго сукна |
| DRESS.ru_jager.head side 2 | `ulyanov1996` | p. 61 | not checked (no text layer reachable here (page images read)) | егерским полкам было велено носить шапку |
| DRESS.ru_jager.greatcoat | `viskovatov10_1900` | p. 198 (the infantry greatcoat) | found | изъ некрашенаго сукна |
| DRESS.ru_guard_inf.coat | `viskovatov14_1901` | p. 6 (leaf n7); plate 1873 | found | въ Преображенскомъ полку остались, по прежнему, красные |
| DRESS.ru_guard_inf.legwear | `viskovatov14_1901` | p. 6 | not found whole: 50% of its word pairs in one passage (archive.org OCR) | такое же обмундированіе |
| DRESS.ru_guard_inf.head | `viskovatov14_1901` | pp. 10-11 (leaves n11-n12) | not found whole: 20% of its word pairs in one passage (archive.org OCR) | вмѣсто касокъ, повелѣно носить суконныя шапки |
| DRESS.ru_guard_inf.greatcoat | `viskovatov10_1900` | p. 198 (the grenadier pattern) | found | изъ некрашенаго сукна |
| DRESS.ru_guard_jager.coat | `viskovatov14_1901` | p. 28 (leaf n29) | not found whole: 25% of its word pairs in one passage (archive.org OCR) | какое въ исходѣ 1802 года имѣли Армейскіе Егерскіе полки |
| DRESS.ru_guard_jager.legwear | `viskovatov14_1901` | p. 28 | found | выпушка на полахъ, фалдахъ и панталонахъ |
| DRESS.ru_guard_jager.head | `viskovatov14_1901` | p. 29 (leaf n30) | found with OCR differences: 60% of its word pairs in one passage (archive.org OCR) | вмѣсто круглыхъ шляпъ, даны суконныя шапки |
| DRESS.ru_guard_jager.greatcoat | `viskovatov10_1900` | p. 198 | found | изъ некрашенаго сукна |
| DRESS.ru_cuirassier.coat | `viskovatov11_1853` | pp. 2-3, 18 (leaves n11-n12, n27) | not found whole: 0% of its word pairs in one passage (archive.org OCR) | изъ бѣлой кирзы |
| DRESS.ru_cuirassier.cuirass | `viskovatov11_1853` | p. 1 (leaf n10) | checked on the page image (https://archive.org/download/viskovatovaleksandrvasilevich180418512/page/n10_w1200.jpg) | кирасы отмѣнены |
| DRESS.ru_cuirassier.head | `viskovatov11_1853` | pp. 20-21 (leaves n29-n30) | found | изъ черной, лакированной, пумповой кожи |
| DRESS.ru_cuirassier.horse | `viskovatov11_1853` | p. 11 (leaf n20) | not found whole: 25% of its word pairs in one passage (archive.org OCR) | опредѣленнаго цвѣта шерсти не имѣла |
| DRESS.ru_cuirassier.furniture | `viskovatov11_1853` | p. 9 (leaf n18) | not found whole: 33% of its word pairs in one passage (archive.org OCR) | по цвѣту колетнаго воротника |
| DRESS.ru_dragoon.coat | `viskovatov11_1853` | p. 36 (leaf n45); p. 52 | not found whole: 0% of its word pairs in one passage (archive.org OCR) | изъ свѣтлозеленаго сукна |
| DRESS.ru_dragoon.head | `viskovatov11_1853` | p. 48 (leaf n57) | not found whole: 33% of its word pairs in one passage (archive.org OCR) | вмѣсто шляпъ, даны каски |
| DRESS.ru_dragoon.horse | `viskovatov11_1853` | p. 41 (leaf n50) | not found whole: 25% of its word pairs in one passage (archive.org OCR) | опредѣленнаго цвѣта шерсти не имѣла |
| DRESS.ru_hussar_pavlograd.coat | `viskovatov11_1853` | p. 84 (leaf n93) | found with OCR differences: 67% of its word pairs in one passage (archive.org OCR) | ментія бирюзовая, дуламанъ темнозеленый |
| DRESS.ru_hussar_pavlograd.legwear | `viskovatov11_1853` | pp. 77-78 | not found whole: 0% of its word pairs in one passage (archive.org OCR) | изъ бѣлаго сукна |
| DRESS.ru_hussar_pavlograd.head | `viskovatov11_1853` | pp. 86-88 (leaves n95-n97) | not found whole: 40% of its word pairs in one passage (archive.org OCR) | повелѣно ввести во всѣхъ Гусарскихъ полкахъ |
| DRESS.ru_hussar_pavlograd.horse | `viskovatov11_1853` | p. 80 (leaf n89) | not found whole: 25% of its word pairs in one passage (archive.org OCR) | опредѣленнаго цвѣта шерсти не имѣла |
| DRESS.ru_hussar_mariupol.coat | `viskovatov11_1853` | p. 83 (leaf n92) | checked on the page image (https://archive.org/download/viskovatovaleksandrvasilevich180418512/page/n92_w1200.jpg) | ментія синяя, дуламанъ бѣлый |
| DRESS.ru_hussar_mariupol.legwear | `viskovatov11_1853` | pp. 77-78 | not found whole: 0% of its word pairs in one passage (archive.org OCR) | изъ бѣлаго сукна |
| DRESS.ru_hussar_mariupol.head | `viskovatov11_1853` | pp. 86-88 | not found whole: 40% of its word pairs in one passage (archive.org OCR) | повелѣно ввести во всѣхъ Гусарскихъ полкахъ |
| DRESS.ru_hussar_mariupol.horse | `viskovatov11_1853` | p. 80 | not found whole: 25% of its word pairs in one passage (archive.org OCR) | опредѣленнаго цвѣта шерсти не имѣла |
| DRESS.ru_hussar_elisavetgrad.coat | `viskovatov11_1853` | p. 85 (leaf n94) | not found whole: 33% of its word pairs in one passage (archive.org OCR) | ментія и дуламанъ палевые |
| DRESS.ru_hussar_elisavetgrad.legwear | `viskovatov11_1853` | pp. 77-78 | not found whole: 0% of its word pairs in one passage (archive.org OCR) | изъ бѣлаго сукна |
| DRESS.ru_hussar_elisavetgrad.head | `viskovatov11_1853` | pp. 86-88 | not found whole: 40% of its word pairs in one passage (archive.org OCR) | повелѣно ввести во всѣхъ Гусарскихъ полкахъ |
| DRESS.ru_hussar_elisavetgrad.horse | `viskovatov11_1853` | p. 80 | not found whole: 25% of its word pairs in one passage (archive.org OCR) | опредѣленнаго цвѣта шерсти не имѣла |
| DRESS.ru_uhlan.coat | `viskovatov11_1853` | p. 114 (leaf n123) | not found whole: 0% of its word pairs in one passage (archive.org OCR) | куртка синяя |
| DRESS.ru_uhlan.legwear | `viskovatov11_1853` | p. 114 | not found whole: 0% of its word pairs in one passage (archive.org OCR) | Панталоны были синія |
| DRESS.ru_uhlan.head | `viskovatov11_1853` | pp. 112-114 | not found whole: 50% of its word pairs in one passage (archive.org OCR) | Строевая шапка синяя |
| DRESS.ru_cossack.coat | `viskovatov18_1901` | p. 6 (leaf n9) | found | чекмень изъ темносиняго сукна |
| DRESS.ru_cossack.legwear | `viskovatov18_1901` | p. 6 | not found whole: 0% of its word pairs in one passage (archive.org OCR) | шаравары темносинія |
| DRESS.ru_cossack.head | `viskovatov18_1901` | pp. 5-6 | found with OCR differences: 71% of its word pairs in one passage (archive.org OCR) | шапку такую же, какъ и при домашней одеждѣ |
| DRESS.ru_guard_horse.coat | `viskovatov15_1901` | p. 8 (leaf n11) | found | воротникъ и обшлага алые |
| DRESS.ru_guard_horse.cuirass | `viskovatov11_1853` | p. 1 | checked on the page image (https://archive.org/download/viskovatovaleksandrvasilevich180418512/page/n10_w1200.jpg) | кирасы отмѣнены |
| DRESS.ru_guard_horse.head | `viskovatov15_1901` | p. 9 (leaf n12) | not found whole: 0% of its word pairs in one passage (archive.org OCR) | со звѣздою, напереди, вмѣсто орла |
| DRESS.ru_guard_horse.horse | `stackelberg1881` | p. 18 (leaf n28); p. 51 | found | лошадей разношерстныхъ |
| DRESS.ru_guard_horse.furniture | `viskovatov15_1901` | p. 8 | found with OCR differences: 67% of its word pairs in one passage (archive.org OCR) | чепраки и чушки синіе |
| DRESS.ru_chevalier.coat | `viskovatov15_1901` | p. 9 (leaf n12) | found | одинаковыя съ Л.-Гв. Коннымъ полкомъ |
| DRESS.ru_chevalier.cuirass | `viskovatov15_1901` | p. 9 | found | одинаковыя съ Л.-Гв. Коннымъ полкомъ |
| DRESS.ru_chevalier.head | `viskovatov15_1901` | p. 9 | found with OCR differences: 67% of its word pairs in one passage (archive.org OCR) | съ густымъ, волосянымъ плюмажемъ |
| DRESS.ru_chevalier.furniture | `viskovatov15_1901` | p. 9 | found | чепраки и чушки красные |
| DRESS.ru_guard_hussar.coat | `viskovatov15_1901` | pp. 23-24 (leaves n26-n27) | not found whole: 0% of its word pairs in one passage (archive.org OCR) | доломаны синіе |
| DRESS.ru_guard_hussar.head | `viskovatov15_1901` | p. 24 | not found whole: 50% of its word pairs in one passage (archive.org OCR) | положены противъ Армейскихъ Гусарскихъ полковъ |
| DRESS.ru_guard_cossack.coat | `viskovatov9_1900` | pp. 24, 26 (leaves n27, n29) | not found whole: 33% of its word pairs in one passage (archive.org OCR) | темно-синіе, суконные кафтаны |
| DRESS.ru_guard_cossack.legwear | `viskovatov9_1900` | p. 24 | found | бирюзовыя, суконныя шировары |
| DRESS.ru_guard_cossack.head | `viskovatov9_1900` | p. 24 | found with OCR differences: 75% of its word pairs in one passage (archive.org OCR) | шапки изъ чернаго, Бухарскаго смушка |
| DRESS.ru_foot_art.coat | `viskovatov12_1900` | p. 5 (leaf n8) | found | темнозеленые мундиры |
| DRESS.ru_foot_art.head | `viskovatov12_1900` | pp. 6-7 | found with OCR differences: 75% of its word pairs in one passage (archive.org OCR) | вмѣсто шляпъ даны суконныя шапки |
| DRESS.ru_staff.coat | `viskovatov17_1901` | p. 21 (leaf n24) | not found whole: 43% of its word pairs in one passage (archive.org OCR) | генералы носили, во всѣхъ случаяхъ, мундиры тѣхъ полковъ |
| DRESS.ru_staff.head | `viskovatov10_1900` | p. 207 (leaf n210) | found | съ высокимъ султаномъ |
| DRESS.at_line.coat | `teuber1895` | p. 260 (the 1798 Adjustirungsvorschrift as quoted) | not checked (no text layer reachable here (page images read)) | Zur Schonung des weissen, so kostbaren Rockes |
| DRESS.at_line.legwear | `teuber1895` | p. 255 (a letter of the 1798 reform period) | not checked (no text layer reachable here (page images read)) | Die deutsche Infanterie bekommt weisse Hosen |
| DRESS.at_line.head side 0 | `teuber1895` | pp. 258, 355 | not checked (no text layer reachable here (page images read)) | in denen der Helm seine eigentliche Erprobung zu bestehen hatte |
| DRESS.at_line.head side 1 | `teuber1895` | p. 794 | not checked (no text layer reachable here (page images read)) | nur circa 18 deutsche Regimenter |
| DRESS.at_line.greatcoat | `teuber1895` | p. 260 | not checked (no text layer reachable here (page images read)) | graumelirter Ueberrock, von der Farbe der Mäntel der gemeinen Mannschaft |
| DRESS.at_grenz.coat side 0 | `teuber1895` | p. 275 (c278) | not checked (no text layer reachable here (page images read)) | der weisse Rock und die »weisse lange Hose« |
| DRESS.at_grenz.coat side 1 | `teuber1895` | p. 382 (c385) | not checked (no text layer reachable here (page images read)) | Man sah weisse und braune Grenzerröcke |
| DRESS.at_grenz.coat side 2 | `wrede1_1898` | p. 150 (n189); p. 154 (n193) | found | 1798 dunkelbrauner Rock |
| DRESS.at_grenz.legwear side 0 | `teuber1895` | p. 275 | not checked (no text layer reachable here (page images read)) | die »weisse lange Hose« |
| DRESS.at_grenz.legwear side 1 | `teuber1895` | p. 382 | not checked (no text layer reachable here (page images read)) | der gewöhnlichen Hose |
| DRESS.at_grenz.head side 0 | `teuber1895` | p. 275 | not checked (no text layer reachable here (page images read)) | sowie das Casquet |
| DRESS.at_grenz.head side 1 | `teuber1895` | p. 383 (c386) | not checked (no text layer reachable here (page images read)) | war noch 1805 mit Sonnen- und Nackenschirm versehen worden |
| DRESS.at_cuirassier.coat | `teuber1895` | p. 289 (the 1798 cavalry regulation as quoted) | not checked (no text layer reachable here (page images read)) | Röckel von weissem Tuch |
| DRESS.at_cuirassier.cuirass | `teuber1895` | p. 812 (c815, OCR) | not checked (no text layer reachable here (page images read)) | einfache schwarz lackirte Kürasse |
| DRESS.at_cuirassier.head | `teuber1895` | p. 289 | not checked (no text layer reachable here (page images read)) | Helm wie beim gemeinen Infanteristen |
| DRESS.at_chevauleger.coat side 0 | `teuber1895` | pp. 313-314 (OCR) | not checked (no text layer reachable here (page images read)) | dunkelgrün zu kleiden |
| DRESS.at_chevauleger.coat side 1 | `teuber1895` | p. 314 | not checked (no text layer reachable here (page images read)) | blieb der grüne Chevauxleger, wie wir wissen, neben dem weissen |
| DRESS.at_chevauleger.head | `teuber1895` | p. 258 | not checked (no text layer reachable here (page images read)) | die Jäger und deutsche Reiterei schmücken sollte |
| DRESS.at_hussar_hh.coat | `schem1805` | p. 285 (view 286) | not checked (no text layer reachable here (page images read)) | paperlgrüne Pelze u. Dollmanns |
| DRESS.at_hussar_hh.legwear | `schem1805` | p. 285 | not checked (no text layer reachable here (page images read)) | ponceaurothe Hosen |
| DRESS.at_hussar_hh.head | `schem1805` | p. 285 | not checked (no text layer reachable here (page images read)) | Hellblaue Csako |
| DRESS.at_hussar_szekler.coat | `schem1805` | p. 297 (view 298) | not checked (no text layer reachable here (page images read)) | kornblumenblaue Pelze, Dollmanns und Hosen |
| DRESS.at_hussar_szekler.legwear | `schem1805` | p. 297 | not checked (no text layer reachable here (page images read)) | kornblumenblaue Pelze, Dollmanns und Hosen |
| DRESS.at_hussar_szekler.head | `schem1805` | p. 297 | not checked (no text layer reachable here (page images read)) | Schwarze Csako |
| DRESS.at_uhlan_merveldt.coat | `schem1805` | p. 299 (view 300) | not checked (no text layer reachable here (page images read)) | grasgr. Kurtka u. Hosen |
| DRESS.at_uhlan_merveldt.legwear | `schem1805` | p. 299 | not checked (no text layer reachable here (page images read)) | grasgr. Kurtka u. Hosen |
| DRESS.at_uhlan_merveldt.head | `schem1805` | p. 299 | not checked (no text layer reachable here (page images read)) | Kaisergelbe Czapka |
| DRESS.at_art.coat | `schem1805` | pp. 303-304 (views 304-305) | not checked (no text layer reachable here (page images read)) | Rehfarbe und Ponceau |
| DRESS.at_art.legwear | `teuber1895` | pp. 322-323 | not checked (no text layer reachable here (page images read)) | den ungarischen weissen Hosen |
| DRESS.at_art.head | `teuber1895` | p. 323 | not checked (no text layer reachable here (page images read)) | Kopfbedeckung war, wie wir wissen, der Corséhut |
| COMPOSITION.heightguns other 0 | `thiebault3_1894` | p. 466 (leaf n477) | found | vingt-quatre pièces d'artillerie de la garde impériale |
| COMPOSITION.sthilaire part 0 | `alombert4_1908` | p. 727 (situation of 28 October 1805) | found with OCR differences: 67% of its word pairs in one passage (archive.org OCR) | 10e légère (2 bataillons) |
| COMPOSITION.sthilaire part 1 | `alombert4_1908` | p. 727 | found with OCR differences: 78% of its word pairs in one passage (archive.org OCR) | 14e de ligne (2 bataillons) ; 36e de ligne (2 bataillons) |
| COMPOSITION.vandamme part 0 | `alombert4_1908` | p. 728 | found | 24e légère (2 bataillons) |
| COMPOSITION.vandamme part 1 | `alombert4_1908` | pp. 727-728 | found with OCR differences: 68% of its word pairs in one passage (archive.org OCR) | 4e de ligne (2 bataillons) ; 28e de ligne (2 bataillons) ; 46e de ligne (2 bataillons) ; 57e de ligne (2 bataillons) |
| COMPOSITION.legrand part 0 | `alombert4_1908` | pp. 728-729 | found | 3e de ligne (3 bataillons) ; 75e de ligne (2 bataillons) ; 18e de ligne (2 bataillons) |
| COMPOSITION.legrand part 1 | `alombert4_1908` | p. 729 | found | Tirailleurs du Pô (1 bataillon) ; 26e légère (2 bataillons) |
| COMPOSITION.legrand part 2 | `alombert4_1908` | p. 729 | found | Tirailleurs corses (1 bataillon) |
| COMPOSITION.friant part 0 | `alombert4_1908` | p. 724 | found with OCR differences: 78% of its word pairs in one passage (archive.org OCR) | 108e de ligne (2 bataillons) ; 111e de ligne (2 bataillons) |
| COMPOSITION.friant part 1 | `alombert4_1908` | p. 724 | found | 15e légère (2 bataillons) |
| COMPOSITION.caffarelli part 0 | `alombert4_1908` | pp. 723-724 | found with OCR differences: 67% of its word pairs in one passage (archive.org OCR) | 13e légère (2 bataillons) |
| COMPOSITION.caffarelli part 1 | `alombert4_1908` | p. 724 | found | 17e de ligne (2 bataillons) ; 30e de ligne (2 bataillons) |
| COMPOSITION.suchet part 0 | `alombert4_1908` | p. 732 | not found whole: 55% of its word pairs in one passage (archive.org OCR) | 34e de ligne ; 40e de ligne ; 64e de ligne ; 88e de ligne |
| COMPOSITION.santon part 0 | `materialien1806` | Zusatz 6, pp. 100-101 (leaves n109-n110) | not found whole: 50% of its word pairs in one passage (archive.org OCR) | Das 17te Regiment leichter Infanterie deckte dieselbe |
| COMPOSITION.santon other 0 | `materialien1806` | Zusatz 6, pp. 100-101 | found | mit 18 Kanonen |
| COMPOSITION.kellermann part 0 | `alombert4_1908` | pp. 717-718 | found | 2e hussards ; 4e hussards ; 5e hussards ; 5e chasseurs |
| COMPOSITION.kellermann part 1 | `alombert4_1908` | p. 718 | found | 2e hussards ; 4e hussards ; 5e hussards ; 5e chasseurs |
| COMPOSITION.kellermann part 2 | `alombert4_1908` | p. 718 | found | 2e hussards ; 4e hussards ; 5e hussards ; 5e chasseurs |
| COMPOSITION.kellermann part 3 | `alombert4_1908` | p. 718 | found | 2e hussards ; 4e hussards ; 5e hussards ; 5e chasseurs |
| COMPOSITION.nansouty part 0 | `alombert4_1908` | p. 741 | found with OCR differences: 67% of its word pairs in one passage (archive.org OCR) | 1er et 2e carabiniers |
| COMPOSITION.nansouty part 1 | `alombert4_1908` | p. 741 | found with OCR differences: 60% of its word pairs in one passage (archive.org OCR) | 2e, 9e, 3e et 12e cuirassiers |
| COMPOSITION.dhautpoul part 0 | `alombert4_1908` | p. 741 | not found whole: 20% of its word pairs in one passage (archive.org OCR) | 1er, 5e, 10e et 11e cuirassiers |
| COMPOSITION.walther part 0 | `alombert4_1908` | p. 742 | not found whole: 43% of its word pairs in one passage (archive.org OCR) | 10e, 13e, 22e, 3e, 6e et 11e dragons |
| COMPOSITION.bourcier part 0 | `alombert4_1908` | p. 743 | not found whole: 17% of its word pairs in one passage (archive.org OCR) | 15e, 17e, 27e, 18e, 19e, 25e dragons |
| COMPOSITION.rivaud part 0 | `alombert4_1908` | p. 717 | not found whole: 50% of its word pairs in one passage (archive.org OCR) | 8e de ligne ; 45e de ligne ; 54e de ligne |
| COMPOSITION.drouet part 0 | `alombert4_1908` | pp. 716-717 | found with OCR differences: 71% of its word pairs in one passage (archive.org OCR) | 27e légère ; 94e de ligne ; 95e de ligne |
| COMPOSITION.drouet part 1 | `alombert4_1908` | p. 717 | found with OCR differences: 71% of its word pairs in one passage (archive.org OCR) | 27e légère ; 94e de ligne ; 95e de ligne |
| COMPOSITION.guard_inf part 0 | `barres1923` | p. 56 (view f84) | found with OCR differences: 80% of its word pairs in one passage (Gallica OCR (ALTO) of the views named) | dont 8 de la Garde impériale |
| COMPOSITION.guard_inf part 1 | `barres1923` | p. 56 (view f84) | found with OCR differences: 80% of its word pairs in one passage (Gallica OCR (ALTO) of the views named) | dont 8 de la Garde impériale |
| COMPOSITION.guard_inf part 2 | `barres1923` | p. 56 (view f84) | found | 2 de la garde royale italienne |
| COMPOSITION.guard_cav part 0 | `regnault1967` | p. 36 (view f40) | found | aux quatre escadrons respectifs des deux régiments de cavalerie |
| COMPOSITION.guard_cav part 1 | `regnault1967` | p. 36 (view f40) | found | aux quatre escadrons respectifs des deux régiments de cavalerie |
| COMPOSITION.guard_cav part 2 | `martinien1899` | p. 98 (view f98) | not found whole: 0% of its word pairs in one passage (Gallica OCR (ALTO) of the views named) | Compagnie de Mamelucks |
| COMPOSITION.c_gren part 0 | `alombert4_1908` | p. 755 (situation of 26 October 1805) | found with OCR differences: 71% of its word pairs in one passage (archive.org OCR) | Bat. d'élite du 9e rég. de ligne |
| COMPOSITION.c_gren part 1 | `alombert4_1908` | p. 755 | found with OCR differences: 80% of its word pairs in one passage (archive.org OCR) | du 2e rég. d'inf. légère |
| COMPOSITION.kienmayer part 0 | `schoenhals1873` | p. 177 | found | Wiener Jäger |
| COMPOSITION.kienmayer part 1 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Broder-Infanterie |
| COMPOSITION.kienmayer part 2 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Chevaux legers |
| COMPOSITION.kienmayer part 3 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Merweldt-Uhlanen |
| COMPOSITION.kienmayer part 4 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Schwarzenberg-Uhlanen |
| COMPOSITION.kienmayer part 5 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Hessen-Homburg-Huszaren |
| COMPOSITION.kienmayer part 6 | `schoenhals1873` | p. 177 | found | Szekler-Huszaren |
| COMPOSITION.kienmayer part 7 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Melentiew-Kosaken |
| COMPOSITION.kienmayer other 0 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | 2 österr. Cavallerie-Batterien |
| COMPOSITION.dok part 0 | `schoenhals1873` | p. 177 | found | 7. Jäger-Regiment |
| COMPOSITION.dok part 1 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Neu-Ingermannland |
| COMPOSITION.dok part 2 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Kiow-Grenadier |
| COMPOSITION.dok other 0 | `mikhailovsky1846` | p. 224 | not checked (archive.org OCR) | 2 escadr. de cosaques irrégul. |
| COMPOSITION.dok other 1 | `mikhailovsky1846` | p. 224 | not checked (archive.org OCR) | 2e comp. d'artill. de position |
| COMPOSITION.lang part 0 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | 8. Jäger-Regiment |
| COMPOSITION.lang part 1 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Kurskoy |
| COMPOSITION.kamensky part 0 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Tanagorisky |
| COMPOSITION.kamensky part 1 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Riasky |
| COMPOSITION.prz part 0 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | 8. Jäger-Regiment |
| COMPOSITION.prz part 1 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Gallizi |
| COMPOSITION.prz other 0 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Demisod-Kosaken |
| COMPOSITION.milo part 0 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Apscheronsky |
| COMPOSITION.milo part 1 | `schoenhals1873` | p. 177 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n181_w1600.jpg) | Malorosizky |
| COMPOSITION.milo other 0 | `schoenhals1873` | p. 177 | found | Erzherzog Johann-Dragoner |
| COMPOSITION.kollo part 0 | `schoenhals1873` | p. 177 | found | Salzburg |
| COMPOSITION.lich part 0 | `schoenhals1873` | p. 178 | found | Lothringen-Cürassier |
| COMPOSITION.lich part 1 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Gardejew-Kosaken |
| COMPOSITION.lich part 2 | `schoenhals1873` | p. 178 | found | Grossfürst Constantin-Uhlanen |
| COMPOSITION.lich part 3 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Charchow-Dragoner |
| COMPOSITION.lich part 4 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Leib-Cürassier |
| COMPOSITION.lich part 5 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Elisabethgrad-Huszaren |
| COMPOSITION.bag part 0 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | 6. Jäger-Regiment |
| COMPOSITION.bag part 1 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Pskowsky |
| COMPOSITION.bag other 0 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Paulogradsky-Huszaren |
| COMPOSITION.bag other 1 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Marinepolsky-Huszaren |
| COMPOSITION.bag other 2 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Twusky-Dragoner |
| COMPOSITION.bag other 3 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Malachow-Kosaken |
| COMPOSITION.bag other 4 | `mikhailovsky1846` | p. 226 | not checked (archive.org OCR) | 2 comp. d'artillerie à pied |
| COMPOSITION.rg_inf part 0 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Preobrajschensky |
| COMPOSITION.rg_inf part 1 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Leib-Jäger |
| COMPOSITION.rg_inf part 2 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Leib-Grenadier |
| COMPOSITION.rg_cav part 0 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Chevaliers-Garde |
| COMPOSITION.rg_cav part 1 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Leib-Garde zu Pferd |
| COMPOSITION.rg_cav part 2 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Leib-Huszaren |
| COMPOSITION.rg_cav part 3 | `schoenhals1873` | p. 178 | checked on the page image (https://archive.org/download/derkriegindeuts00schgoog/page/n182_w1600.jpg) | Leib-Kosaken |
| COLOURS_CARRIED.fr_eagle_inf.model | `regnault1967` | p. 21 (view f25) | found | le Drapeau modèle 1804 |
| COLOURS_CARRIED.fr_eagle_inf.pattern | `regnault1967` | p. 21 (view f25) | found | un losange blanc central inscrit dans le carré |
| COLOURS_CARRIED.fr_eagle_inf.count | `regnault1967` | pp. 25-26 (views f29-f30) | found | un Drapeau, Etendard ou Guidon par bataillon ou escadron |
| COLOURS_CARRIED.fr_eagle_inf.cloth | `regnault1967` | p. 21 (view f25) | found | deux pieds six pouces de côtés (81 centimètres) |
| COLOURS_CARRIED.fr_eagle_inf.finial | `regnault1967` | p. 21 (view f25) | found with OCR differences: 80% of its word pairs in one passage (Gallica OCR (ALTO) of the views named) | avait une hauteur de vingt centimètres |
| COLOURS_CARRIED.fr_eagle_cav.model | `regnault1967` | pp. 21, 25-26 (views f25, f29-f30) | found | le Drapeau modèle 1804 |
| COLOURS_CARRIED.fr_eagle_cav.count | `regnault1967` | p. 26 (view f30) | found | un Drapeau, Etendard ou Guidon par bataillon ou escadron |
| COLOURS_CARRIED.fr_eagle_cav.finial | `regnault1967` | p. 21 (view f25) | found with OCR differences: 80% of its word pairs in one passage (Gallica OCR (ALTO) of the views named) | avait une hauteur de vingt centimètres |
| COLOURS_CARRIED.fr_eagle_lightcav.model | `regnault1967` | pp. 21, 25-26 (views f25, f29-f30) | found | le Drapeau modèle 1804 |
| COLOURS_CARRIED.fr_eagle_lightcav.count side 0 | `morvan1904` | t. I, p. 267 | found | Ils ne le font point |
| COLOURS_CARRIED.fr_eagle_lightcav.count side 1 | `fraser1912` | p. 182 | found | Every Hussar and Chasseur regiment was ordered to return its three squadron Eagles |
| COLOURS_CARRIED.fr_guard_eagle.model | `regnault1967` | pp. 38-39 (views f42-f43) | found | tous sont dans l'ensemble du modèle choisi en 1804 |
| COLOURS_CARRIED.fr_guard_eagle.count | `regnault1967` | p. 36 (view f40) | found | quatre aux quatre bataillons de Grenadiers et Chasseurs à pied |
| COLOURS_CARRIED.it_guard_eagle.count | `crociani2004` | vol. I, tomo 2, 'Da Parigi ad Austerlitz' | not checked (no text layer reachable here (page images read)) | le aquile dei battaglioni |
| COLOURS_CARRIED.fr_mameluke_none.count | `regnault1967` | p. 40 (view f44) | not found (one word) | Mameluks |
| COLOURS_CARRIED.fr_art_none.count | `morvan1904` | t. I, p. 267 | found | les régiments d'artillerie laissaient leurs drapeaux au dépôt |
| COLOURS_CARRIED.ru_inf.model | `viskovatov9_1850` | p. 68 | not found whole: 0% of its word pairs in one passage (archive.org OCR) | служили безсрочно |
| COLOURS_CARRIED.ru_inf.count | `psz27_1830` | no. 20,193 (21 March 1802), p. 80 | not found whole: 20% of its word pairs in one passage (archive.org OCR) | на каждый баталіонъ по два знамя |
| COLOURS_CARRIED.ru_inf.cloth | `viskovatov9_1850` | pp. 68-69 | not found whole: 50% of its word pairs in one passage (archive.org OCR) | по 2 аршина |
| COLOURS_CARRIED.ru_inf.staff | `viskovatov9_1850` | p. 69 | not found whole: 50% of its word pairs in one passage (archive.org OCR) | Длина древка была 4½ аршина |
| COLOURS_CARRIED.ru_inf.finial | `viskovatov9_1850` | p. 69 | found | длина копья, съ трубкою — 5½ вершковъ |
| COLOURS_CARRIED.ru_guard_inf.model side 0 | `viskovatov9_1850` | p. 115 | not found whole: 50% of its word pairs in one passage (archive.org OCR) | были пожалованы всѣмъ тремъ полкамъ Гвардейской Пѣхоты новыя знамена |
| COLOURS_CARRIED.ru_guard_inf.model side 1 | `viskovatov9_1850` | note 375, p. XXXVII | not found whole: 33% of its word pairs in one passage (archive.org OCR) | заготовленныя, но не бывшія въ употребленіи знамена |
| COLOURS_CARRIED.ru_guard_inf.count | `psz27_1830` | no. 20,193, p. 80 | not found whole: 20% of its word pairs in one passage (archive.org OCR) | на каждый баталіонъ по два знамя |
| COLOURS_CARRIED.ru_jager_none.count | `viskovatov17_1901` | p. 33, footnote | found with OCR differences: 71% of its word pairs in one passage (archive.org OCR) | Егерскимъ полкамъ знамена полагались только въ случаѣ пожалованія |
| COLOURS_CARRIED.ru_cuir.model | `viskovatov9_1850` | pp. 102-104 | not found whole: 50% of its word pairs in one passage (archive.org OCR) | Штандартовъ, въ каждый Кирасирскій полкъ |
| COLOURS_CARRIED.ru_cuir.pattern | `viskovatov9_1850` | pp. 102-104 | not found whole: 50% of its word pairs in one passage (archive.org OCR) | крестъ, въ сіяніи |
| COLOURS_CARRIED.ru_cuir.count | `viskovatov9_1850` | p. 104 | found | по числу эскадроновъ, пять |
| COLOURS_CARRIED.ru_cuir.cloth | `viskovatov9_1850` | pp. 102-103 | found with OCR differences: 86% of its word pairs in one passage (archive.org OCR) | по древку — 10, а въ-длину — 12 вершковъ |
| COLOURS_CARRIED.ru_drag.model | `viskovatov9_1850` | p. 107 | found with OCR differences: 67% of its word pairs in one passage (archive.org OCR) | Драгунскіе полки, вмѣсто состоявшихъ у нихъ знаменъ, начали получать штандарты |
| COLOURS_CARRIED.ru_drag.count | `viskovatov9_1850` | p. 107 | found | по числу эскадроновъ |
| COLOURS_CARRIED.ru_drag.cloth | `viskovatov9_1850` | p. 107 | not found whole: 50% of its word pairs in one passage (archive.org OCR) | по 12 вершковъ |
| COLOURS_CARRIED.ru_huss_none.count | `viskovatov9_1850` | contents and pp. 68-121 | found | Знамена и штандарты |
| COLOURS_CARRIED.ru_guard_cav.model | `viskovatov9_1850` | pp. 117-118 | found | Въ 1799 — 10 штандартовъ |
| COLOURS_CARRIED.at_inf.model | `dolleczek1896` | pp. 158-159 (n169-n170) | not found whole: 50% of its word pairs in one passage (archive.org OCR) | eine einzige Leibfahne |
| COLOURS_CARRIED.at_inf.pattern | `dolleczek1896` | pp. 157-158 | found | schwarze Doppeladler |
| COLOURS_CARRIED.at_inf.count side 0 | `wrede1_1898` | pp. 46-47 (footnote 6) | found | Die Zahl der Fahnen wurde auf eine per Bataillon herabgesetzt |
| COLOURS_CARRIED.at_inf.count side 1 | `dolleczek1896` | pp. 158, 161 | found | es erhielt jedes Bataillon nur mehr eine Fahne |
| COLOURS_CARRIED.at_inf.cloth | `dolleczek1896` | p. 158 (n169) | found | bei der Fahne 161 : 142 cm |
| COLOURS_CARRIED.at_inf.staff | `dolleczek1896` | p. 159 (n170) | found | Die Fahnenstangen waren circa 285 cm lang |
| COLOURS_CARRIED.at_inf.finial | `dolleczek1896` | p. 159 | found | Das Krönlein in der gebräuchlichen Lindenblattform |
| COLOURS_CARRIED.at_grenz.model | `teuber1895` | p. 383 (c386), footnote | not checked (no text layer reachable here (page images read)) | nur eine ordinäre gelbe Fahne |
| COLOURS_CARRIED.at_grenz.count | `teuber1895` | p. 383, footnote | not checked (no text layer reachable here (page images read)) | jedes Grenz-Bataillon »nur eine ordinäre gelbe Fahne« zu führen habe |
| COLOURS_CARRIED.at_grenz.cloth | `dolleczek1896` | p. 158 | found | bei der Fahne 161 : 142 cm |
| COLOURS_CARRIED.at_cav.model | `dolleczek1896` | pp. 158, 162 | not found whole: 33% of its word pairs in one passage (archive.org OCR) | eine einzige Leibfahne (Standarte) |
| COLOURS_CARRIED.at_cav.count | `dolleczek1896` | p. 158 (n169) | found | Zwei solche bildeten eine Division und erhielten eine |
| COLOURS_CARRIED.at_cav.cloth | `dolleczek1896` | p. 158 | found with OCR differences: 80% of its word pairs in one passage (archive.org OCR) | bei der Standarte 71 : 63 cm |
| STANDARD_MEASURES.ru.staff | `viskovatov9_1850` | p. 69 | not found whole: 50% of its word pairs in one passage (archive.org OCR) | Длина древка была 4½ аршина |
| STANDARD_MEASURES.ru.stature | `psz28_1830` | no. 21,490 (October 1804), § 3, p. 550 | not found whole: 57% of its word pairs in one passage (archive.org OCR) | ростомъ въ 2 аршина 4 вершка, безъ обуви |
| STANDARD_MEASURES.at.staff | `dolleczek1896` | p. 159 | found | Die Fahnenstangen waren circa 285 cm lang |
| STANDARD_MEASURES.at.stature | `teuber1895` | p. 247 (c250) | not checked (no text layer reachable here (page images read)) | mindestens 165 Centimeter |
