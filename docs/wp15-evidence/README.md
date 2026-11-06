# WP-15's evidence: the first batch (the final audits' Stage 4, alongside track)

WP-15 of `docs/ROADMAP_FINAL_AUDIT.md` (finding CL-SRC-10, ChatGPT's CG-F02 and CG-F03): the unchecked narrative statements triaged by
prominence, a first batch of tier-1 statements sourced on page images, and the open questions ranked. **This track changes no data**: no
data file, no guarded declaration and no build changes; every data change is a proposal for a later data task (WP-01 or WP-03). The
main track (WP-03) adds its readings as section S7 of `docs/step4-evidence/readings.md` and edits `narrative.js`; this track touches only
this directory, `tools/wp15/`, `test.js`'s `regFiles` line and `CHANGELOG.md`.

| file | what it is | made by |
|---|---|---|
| `readings.md` | the register of WP-15's readings, section S8 (S8.1-S8.17), in the step-4 register's format; `test.js` reads it as a register (`regFiles`) | written by hand from the page images, by a machine reader |
| `pages/` | the 37 page images read (new readings and registered ones read again), at most 1400 px wide; public-domain works, and Sokolov (2006) as the final audits' Stage 2 kept it | downloaded from archive.org (Schönhals's p. 177-178 rendered from the item's PDF at 300 and 600 dpi), downscaled by a one-off script |
| `triage.md`, `triage.json` | every unchecked statement ranked by prominence, in three tiers and their groups; the counts before and after the batch (projected) | `node tools/wp15/triage.js` (tiers: `tools/wp15/tiers.js`); `--check` |
| `proposals.md`, `proposals.json` | the batch's 20 statements and two found on the way: each statement's hash, the proposed `STATEMENT_CLAIMS` entry, any correction with its claim, the readings; what the readings show outside the batch; what bears on WP-03 | `node tools/wp15/make-proposals.js`; `--check` |
| `apply-proposals.log` | the verifier's run (baseline, the claims applied, the corrections applied too, each through the copy's `test.js` and `redteam.js`), with the whole suite on the corrected copy, and its seven negative controls | `node tools/wp15/apply-proposals.js --suite`, then `--mutate KIND` for each kind |
| `open-questions.md` | ChatGPT's 35 open questions, the audit's E.3 and `SOURCE_NOTE`'s open questions merged (31 rows) and ranked by interpretive impact | `node tools/wp15/open-questions.js`; `--check` |

Regenerate in this order: `make-proposals.js` (reads the registers and the inventory), then `triage.js` (reads `proposals.json` to mark the
batch), then `open-questions.js`; then `apply-proposals.js` to verify. None of these is part of `npm test`; `test.js` reads `readings.md`.
Every reader was a machine reader; nothing here was read by a person.
