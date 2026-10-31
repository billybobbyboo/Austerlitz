# Stage 8, the follow-up 8J: evidence

The record is `docs/STAGE8_SPEC.md` section 21.7 and `CHANGELOG.md`; the research it implements is 8H's (`docs/stage8-evidence/8h/geo/`,
`proposal.md` G1, G2, G3, G6, G7). Every file here was made in this session by the tool named beside it, on the builds or source trees named in it
(each page-based file records its builds' md5s); none is reconstructed. 8I's build is `697bbf34...`, 8J's final build `7d5594ba...`. Software
rendering (SwiftShader in headless Chromium 141): its times decide nothing about a device.

| file | what | tool |
|---|---|---|
| `geo-8j.json` | what the corrections draw, read in node on the model's own cover (8I's tree against 8J's): the traced pheasantry 85.2% drawn as wood (the brook's water 9.2%, its wet bottom 5.5%), 1.8% spill within 3 units; the castle's site on the road class, the Pratzen church's on the village class, the garden 100% village; the corrected bed 146 m from the castle's site | `tools/stage8/geo-8j.js --before <8I's tree>` |
| `castle-8j.json` | the Sokolnitz castle at its site: the drawn track (118 m off, drawn 76 m wide) and brook (146 m off, drawn 145 m wide) beside it; for 8G's size and every smaller one by 5%, its nearest clear place on its side of both and its nearest clear place covering its site; 8G's size anywhere within 8 units (461 m off, across the track); what the build draws (20%, 96 by 73 m, at its site, its farm south of it; Sokolnitz's 13 farmsteads); the III Column's place against the site every ten minutes (124 m from it, 08:00-14:10) | `tools/stage8/castle-8j.js <8J build>` |
| `woods-rs-8h.json`, `woods-rs-8j.json` | the woods' random sequence in `woodsPlan`, read in node: on 8H's tree the states each wood and the villages' trees start from (world.js's `WOODS_RS`); on 8J's tree each kept wood starting and ending at those states | `tools/stage8/woods-rs-8j.js [<tree>]` |
| `woods-bldg-8j.json` | the woods by kind and the buildings village by village, 8I's build against 8J's: 4 villages changed, each by the data (Austerlitz, Pratzen, Sokolnitz, Telnitz), 16 identical part for part | `tools/stage8/woods-bldg-8j.js <8I> <8J>` |
| `woods-bldg-8j-nohold.json` | the same against 8J's sources built with `WOODS_RS` unread (`b051f2dd...`, not kept): 14 villages changed, 10 for no change of their own | `tools/stage8/woods-bldg-8j.js <8I> <8J without the hold>` |
| `know-8j.json` | "Whose eyes?" every ten minutes 04:00-17:00 for both headquarters (2,636 readings), the seven observers' viewsheds, the plateau's strength and the centres' separation, 8I's build against 8J's | `tools/stage8/know-8j.js --before <8I> --after <8J>` |
| `chronology-8j.md` | `check:chronology`'s table on 8J's tree (every movement anchor's verdict; the same verdicts as 8I's: 66 consistent, the four named conflicts) | `node tools/stage2/chronology.js --md` |
| `motion-8j.json` | the self-test's motion block on 8J's build on a page of its own: the 16 motions and the extra runs, each run's jumps, pops, level-of-detail switches and flickers and its formations' visibility, the same run for run as `check:selftest`'s block (the source of `MOTION.VIS`'s re-measured baselines) | `tools/stage8/motion-8h.js <8J> --json` |
| `motion-8j-prz8i.json` | the same on an experiment, 8J's build with the III Column's three places and its arrow put back as 8I has them (`f49b0c17...`, not kept): the counts move part of the way back, the ground's change remaining | `tools/stage8/motion-8h.js <experiment> --json` |
| `stills-8j.json`, `pairs/8j-*.jpg` | the matched captures, 8I's build on the left and 8J's on the right, each view in the same state on both: the castle and the pheasantry close at 10:00 (the castle under the III Column), the castle close at 15:00 (the column gone), the brook by the village, the III Column at the castle at 10:00, the Pratzen church, the Austerlitz garden, the paper map close on Sokolnitz, the low Pratzen view and the Overview (where 8J changes nothing to be seen but the woods) | `tools/stage8/stills-8j.js --set 8j --before <8I> --after <8J>` |

The census of 8J's build in both frames comes from its own `check:visual` run on CI, computed by `tools/stage8/census-8i.js`, and is recorded
in `docs/STAGE8_SPEC.md` section 21.9 (the settled baseline, in 8K's pull request) as it lands: never carried forward from another build.
