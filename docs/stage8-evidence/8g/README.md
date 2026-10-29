# Stage 8, implementation PR 8G: the evidence

Decision 248 (a): "develop the villages around the cadastral street-and-yard pattern and add supported landmarks after research and a
documented data task. Keep later maps' relevance to 1805 explicitly qualified. Unestablished roofing and other forms must remain labelled
design conventions." The record is `docs/STAGE8_SPEC.md` section 19.

## The sources read (the data task)

- `readings-texts.md`: the texts' register, 76 entries in seven sections (T1 Wolny's topography of the Brünn district, 1836-1837; T2 Schwoy's
  topography of Moravia, 1793; T3 Wolný's church topography of the Brünn diocese, 1856-1861; T4 what the stable cadastre's colours mean, the
  Instruction of 1824; T5 the roofing, every statement found and what each allows for 1805; T6 the battle accounts on the villages' edges and
  the landmarks; T7 corrections to the earlier registers), each quotation read on its page image, with its source, date, locator, claim, grade
  and how it bears on 1805.
- `readings-cadastre.md`: the stable cadastre's indication sketches of 1825-1826 (Sokolnitz, Telnitz, Pratzen, Kobelnitz with Puntowitz) read at
  the Moravian Land Archive's highest level, its sections cited as C1.1 and so on; `cadastre/`, eleven of the crops read, each named by its
  village, its pieces and what it shows.
- `negatives.md`: what was searched for and not found, source by source (N1 to N9: the topographies, the church topography, the cadastre's
  colours, the battle accounts, what could not be reached or read, the maps not attempted, the heritage catalogue, the indication sketches).
- `sources.md`: the works, with their editions and the pages' images.
- `places.md`: the landmarks' places in the map's frame against the places the sources and the cadastre give (the corrections proposed, none
  made).
- `quote-check.md`: a second reader's check of every claim of `BUILDINGS` on its page image (32 claims; 11 corrected, all applied).
- `mutate-test-data.json`: `test.js`'s new checks of `BUILDINGS`, `CHURCHES` and `CHAPELS`, each mutation failing them
  (`tools/stage8/mutate-test-8g.js`).

## The prerequisites

- Prerequisite 0 (a block at rest drawn the same in every frame): `rest-pre0.json` (`tools/stage8/rest-8g.js`), `mutate-css-pre0.json`,
  `selftest-pre0-local.json`.
- Prerequisite 1 (the ground's atlas mapped as painted): `atlas-8f.json`, `atlas-pre1.json` and their sheets (`tools/stage8/atlas-8g.js`),
  `classtone-pre1.json` (`tools/stage8/classtone-8g.js`), `mutate-pre1.json` (`tools/stage8/mutate-8g.js`), `mutate-css-8f-pre1.json`,
  `selftest-pre1-local.json`, `stills-pre1.json` and `pairs/pre1-*.jpg` (`tools/stage8/stills-8g.js --set pre1`).
- Prerequisite 2 (the near detail's gradients before its fade's branch): `mutate-css-pre2.json`, `stills-pre2.json` and `pairs/pre2-*.jpg`
  (`--set pre2`), `selftest-pre2-local.json`.
