# Stage 8, the follow-up 8K: evidence

The record is `docs/STAGE8_SPEC.md` section 21.8 and `CHANGELOG.md`; the per-anchor register is `register.md` here; the research it rests on is
8H's (`docs/stage8-evidence/8h/geo/`, `proposal.md` G4 and G5, `consequences.json`, `fig/`). Every file here was made in this session by the tool
named beside it, on the builds or source trees named in it (each page-based file records its builds' md5s); none is reconstructed. 8J's build is
`7d5594ba...`, 8K's final build `f10fe585...`. Software rendering (SwiftShader in headless Chromium 141): its times decide nothing about a device.

| file | what | tool |
|---|---|---|
| `register.md` | the register of the twelve anchors (the owner's eleven on the road and Bagration's dawn): for each its source, the reading, the interpretation, was and is, its grade assessed on its new basis, its uncertainty and its consequences; the road, the post house and the dependent geography; what stays unresolved | written from the readings (8H's dossier, the step-4 register) |
| `chronology-8k.md` | `check:chronology`'s table on 8K's tree (every movement anchor's verdict; the same verdicts as 8J's: 66 consistent, the four named conflicts; bag@6's derived arrival 11:31 to 11:40) | `node tools/stage2/chronology.js --md` |
| `woods-bldg-8k.json` | the woods by kind and the buildings village by village, 8J's build against 8K's: 4 villages changed (Bellowitz, Bosenitz, Holubitz, the post house), 16 identical part for part | `tools/stage8/woods-bldg-8j.js <8J> <8K>` |
| `woods-bldg-8k-nohold.json` | the same between 8J's and 8K's sources built with `WOODS_RS` unread (neither kept) | `tools/stage8/woods-bldg-8j.js <8J without the hold> <8K without the hold>` |
| `roadview-8k.json` | the Command tab's inference that from the Zuran "most of the Olmütz road sector, including the Santon, is in view", measured on both builds: the drawn road from the Santon's foot to the post sampled every 0.05 km against the model's viewshed | `tools/stage8/roadview-8k.js --before <8J> --after <8K>` |
| `know-8k.json` | "Whose eyes?" every ten minutes 04:00-17:00 for both headquarters (2,636 readings), the seven observers' viewsheds, the plateau's strength and the centres' separation, 8J's build against 8K's | `tools/stage8/know-8j.js --before <8J> --after <8K>` |
| `motion/motion-8k.json` | the self-test's motion block on 8K's build on a page of its own: the 16 motions and the extra runs, each run's jumps, pops, level-of-detail switches and flickers and its formations' visibility (the same run for run as `check:selftest`'s block): jumps 248 and pops 998 over the 16, the paper map's zoom by real input 26 jumps against its twin's 10 | `tools/stage8/motion-8h.js <8K> --selftest --json` |
| `motion/motion-8k-e1.json` ... `-e3b.json` | the same on experiments, each 8K's build with one change undone (none kept): e1 the road's label point of 8J (248, 998); e2 the post house's places of 8J (246, 998); e3 both divisions' places of 8J (237, 985, the real input its twin's); e3a Suchet's of 8J (244, 965, the real input its twin's); e3b Bagration's of 8J (235, 999, the real input 23 jumps against 4) | `tools/stage8/motion-8h.js <experiment> --selftest --json` |
| `stills-8k.json`, `pairs/8k-*.jpg` | the matched captures, 8J's build on the left and 8K's on the right, each view in the same state on both: the post, the highway at the Santon's foot, Bagration at dawn, the northern battle at 10:30 and 14:30, the paper map's north, the Overview | `tools/stage8/stills-8j.js --set 8k --before <8J> --after <8K>` |

The census of 8K's build in both frames comes from its own `check:visual` run on CI, computed by `tools/stage8/census-8i.js`, and is recorded
in `docs/STAGE8_SPEC.md` section 21.9: never carried forward from another build.
