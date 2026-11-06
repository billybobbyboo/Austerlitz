# The final audits' Stage 3 (WP-05, WP-06): evidence

Stage 3 of `docs/ROADMAP_FINAL_AUDIT.md`: the panels while the clock moves (WP-05) and the camera and the timeline under input (WP-06).
The record is `CHANGELOG.md`'s Stage 3 entry. Every file here was made on this branch's build (Chromium 141.0.7390.37 headless shell, the
project's pinned browser, SwiftShader; node 22).

| file | what it is | made by |
|---|---|---|
| `mutations.json`, `mutations.txt` | the negative controls: each fix taken out of a copy of the sources, the copy built, and the fix's own check run on it (runtime-test.js's WP-05/06 block, the self-test's `wp56Checks`, or both). M0 is the unmutated copy, which must pass | `node tools/final-stage3/mutate.js --out docs/final-stage3-evidence/mutations.json` |
| `state-probes.log` | the audit's node probes of the clock, the dossiers, the reading and the fade (`tools/audit-post8/state/props-bundle*.js`, `props-helpers.js`) run again on a built copy of this branch | `node tools/audit-post8/state/<probe>.js <copy>` |
| `audit-probes/` | the audit's real-input probes run again on this build, from a scratch copy so that the audit's own evidence (`docs/audit-post8-evidence/`) is not overwritten: the glides under input (`s14`), the tip over Play (`s13`), resizes and turns (`s7`), panels while dragging (`s6`), the phone (`s10`, `s10b`), the rail's hit map and real touch drags, and the reading on a phone (`rail-probe.json`, `eyes-al-route.jpg`, `rail-drag-from-marker.jpg`); `rerun.log` is their console | `node tools/audit-post8/interaction/<probe>.js`, `node tools/audit-post8/visual-maps/rail-probe.js` |
| `play-cost.json` | an open dossier's cost while the clock plays at 4x (the time of the clock's step per 60 Hz frame with no dossier, a card and a full dossier open), this build against the Stage 2 build | `tools/final-stage3/play-cost.js` |

The audit's probes write into `docs/audit-post8-evidence/`; they were run from a copy of the repository for that reason, and only their
outputs were copied here. The audit's own records of the build before the fixes are unchanged.
