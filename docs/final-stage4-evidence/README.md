# The final audits' Stage 4, WP-03: evidence

WP-03 of `docs/ROADMAP_FINAL_AUDIT.md` (tracks, grades and internal consistency), built on `claude/compassionate-curie-igyzhl`. What changed is in
`CHANGELOG.md` (the Stage 4 entry); this directory holds what it rests on.

| file | what it is | made by |
|---|---|---|
| `pages/` | the 64 page images the 75 readings of `docs/step4-evidence/readings.md` section S7 were read on (archive.org, downloaded afresh on 6 November 2026; recompressed to 1,400 px wide, greyscale, for the repository; the file names `<sourcekey>-p<page>-n<leaf>.jpg`, for Mikhailovsky-Danilevsky 1844 the leaf the IIIF canvas index) | three source researchers (machine readers), one per cluster |
| `grades-review.md` | owner decision 272 (a): every reviewed anchor, its grade was, proposed and is, the reason and the readings | generated from the researchers' findings by the lead |
| `probes/*-base.txt`, `probes/*-after.txt` | the audit's history probes (`tools/audit-post8/history/`: motion-vs-status, closest, grades, legs-water, caffarelli, probes.js's plateau-day, legrand-through-castle, sokolnitz-defence, blasowitz-guard, litava-anchors, guard-attack-motion) on `main` at `add185b` (base) and on this branch (after); `near-0.5km-*.txt` every opposing pair within 0.5 km by minute (`tools/final-stage4/near.js`) | `ISO=<an isolated copy> node <probe>` |
| `mutations.txt`, `mutations.json` | the negative controls: each fix taken out of a copy of the sources and its check run | `node tools/final-stage4/mutate.js --out docs/final-stage4-evidence/mutations.json` |

The researchers' scratch files (their findings in full, the text layers and crops) are not committed; what each found is in the S7 entries,
`grades-review.md` and `CHANGELOG.md`.
