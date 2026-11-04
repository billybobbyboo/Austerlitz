## K. Comparison with ChatGPT's audit (added 4 November 2026)

ChatGPT's independent audit (`docs/FINAL_AUDIT_POST_STAGE8_CHATGPT.md`, evidence in `docs/final-audit-chatgpt-evidence/`) audited the same
build: `43e3e5b`, md5 `f10fe585...`, identical to Pages and to every device report. Its 11 findings (CG-F01 to CG-F11) are mapped here to
this register. Its merge ledger, with the Claude column filled in, is `docs/audit-post8-evidence/chatgpt-comparison/merge-ledger-filled.csv`.
The finalized roadmap from both is `docs/ROADMAP_FINAL_AUDIT.md`.

### K.1 How each audit worked

| | this audit (Claude) | ChatGPT's |
|---|---|---|
| required checks | run here: `npm test`, `check:baseline`, `check:data`, `check:chronology`, `check:contrast`, `check:selftest`, `check:report`. `check:visual` run fresh on CI (run 41394859313) | run locally: `npm test`, `check:baseline`, `check:data`, `check:chronology`. The earlier CI visual run (41259079904) and self-test artifact re-judged with the current judge. Contrast and boot read from current-head CI |
| browser | Chromium 141 on SwiftShader, and Chromium's phone emulation | the same |
| method | 16 areas, each finding attacked by a skeptic (two for S1/S2), then a completeness critic and an independent reviewer | targeted static review, new diagnostics (model sweep, extended playback, contact and ice probes, device recomputation), report negative controls |
| sources | 62 force, time and place claims traced to the sources' text (Duffy's text layer, Sokolov, Schönhals, Stutterheim, the *Correspondance*, Davout), 26 internal-consistency claims, 29 geographic claims against open data | three fresh primary pages (Rapp 1823 p. 60, Materialien 1806 p. 106, Thiébault III p. 466), one stored 1825 tile, the official park history, the 704-statement inventory, a 35-item ledger of open questions |
| register | 151 findings, from S1 to S4 | 11 findings, S2 and S3 |

### K.2 Where the audits agree

| ChatGPT | this register | relationship |
|---|---|---|
| CG-F01 counters hidden over long playback | `CL-MAP-01` (and `CL-TEST-02`) | same issue. ChatGPT's continuous 3,600-frame run measured a longer gap: the French Guard cavalry 36.6 s, about 11:02-13:15. This audit's runs were split at 11:30 and 12:00. Folded into `CL-MAP-01`. Both audits find that a selected formation stays drawn and the paper map stays reliable |
| CG-F03 unresolved chronology and places | E.3, `CL-GEO-07`, `CL-GEO-10`, `CL-HIS-07`, `CL-HIS-08`, `CL-HIS-09` | same questions, kept open by both. ChatGPT's 35-item ledger is broader than E.3 and is taken into WP-15's research queue |
| CG-F06 the phone's fluidity | `CL-PERF-03`, `CL-PERF-06`, new `CL-PERF-15` | the same reading of the long-frame definition and of the P5/P3/P4 comparisons |
| CG-F07 the desktop CPU excess | `CL-PERF-12`, `CL-PERF-04` | the same measurement and the same L3 caveats. ChatGPT found no attribution in the device reports. This audit's in-container profiles attribute part of it. The readings are compatible |
| CG-F09 records drift (the README) | `CL-REC-02` | same issue |
| CG-F11 no screen-reader results | `CL-REC-05` | same issue |

### K.3 Found only by ChatGPT, now in this register

| ChatGPT | new entry | checked here |
|---|---|---|
| CG-F02 481 of 704 statements unchecked | `CL-SRC-10` (untested, S3, P2) | confirmed: the inventory recomputed. This audit had stated the count in E.1 but not registered it |
| CG-F04 ground contact on the current build | `CL-VIS-10` (accepted compromise, 265 (a)) | plausible: ChatGPT's run of the project's `contact-8f.js` on the audited build. This audit had not re-measured it |
| CG-F05 landmark roles at symbolic scale | `CL-VIS-11` (S3, P3) | confirmed: this audit's own captures show the castle hidden by the III Column at 10:00 |
| CG-F06 the phone's figure workload as the lever | `CL-PERF-15` (accepted compromise, 269 (a)) | confirmed from the device reports (figures hidden, Play about 59 fps) |
| CG-F08 the phone rule accepts empty reports | `CL-PERF-16` (S3, P2) | **reproduced here**: two empty reports give "rule 2: figShadow", exit 0 (`chatgpt-comparison/phone-rule-empty.txt`) |
| CG-F09 `build.py` prints characters as bytes | `CL-REC-09` (S4) | **reproduced here**: 2,801,357 printed against 2,810,630 bytes (`chatgpt-comparison/build-bytes.txt`) |
| CG-F10 the old glare figure is not current | `CL-REC-10` (S4) | plausible: ChatGPT's run of `ice-8h.js` on the audited build gives 5.90% against the carried 43.5% (another build, Chromium 153). This audit's carried register had repeated the old figure (C.4, C-10) |

### K.4 Found only by this audit

Of this register's 151 original entries, 138 have no counterpart in ChatGPT's register. The consequential ones:
- **The S1.** The published `tools/step6/perf-run.html` runs a `javascript:` URL given in `?src=` in the site's origin (`CL-ROB-01`).
  ChatGPT's section H found "no reachable injection exploit". It reviewed the application's DOM paths, not the published tools pages. This
  audit reproduced the injection on a local copy, and two skeptics confirmed it.
- **Integrity of what is told:**
  - the figures attributed to Duffy that his text layer does not print (`CL-SRC-01`). ChatGPT noted the Duffy figures were "not read" but
    did not search the text;
  - the face-about's Fact label against its own text and Schönhals (`CL-HIS-01`);
  - four events whose disputed hours are unlabelled (`CL-HIS-06`);
  - the 44 carried A grades (`CL-HIS-02`);
  - the Russian Guard's divided register (`CL-HIS-03`);
  - Legrand through the III Column (`CL-HIS-04`);
  - formations walking away while attacking (`CL-HIS-05`);
  - the relief model's 30-80 m residuals behind "fitted to surveyed elevations" (`CL-GEO-01`).
- **State and input:** the stale open dossier (`CL-SIM-01`), "Whose eyes?" drawing what the reading does not know (`CL-SIM-02`), the glide
  undoing a pan (`CL-UX-02`), the phone's rail taken by event markers (`CL-UX-03`).
- **Access and the map:** no reflow at 320 px and 400% (`CL-UX-01`), no key between 720 and 1079 px (`CL-MAP-03`), figures sunk into the
  frozen mere (`CL-VIS-01`).
- **Tests:** the 33 mutations, 3 caught by nothing and 11 only by change detectors (D.4); the merge gate (`CL-TEST-01`). ChatGPT's own
  negative controls are on the report judge (15 + 5 mutations, all caught). They are complementary, not contradictory.

### K.5 Where the judgements differ

- **The verdict.** ChatGPT: "ready to share and use as a qualified historical reconstruction", but not "historically verified". This audit:
  "not yet finished by its own standard". The two agree that the map must not be called verified. They differ because this audit found
  specific statements the sources contradict, and a public exposure, that ChatGPT's samples did not reach. Sharing the map as a qualified
  reconstruction is defensible once WP-00 is done (hours) and while WP-01, WP-02 and WP-04a are pending, with the integrity findings
  disclosed.
- **Severity.** ChatGPT grades confidence limitations and tooling as S2 (CG-F02, CG-F06, CG-F08, CG-F11). This audit grades by the
  visitor's exposure, so untested areas, tools and accepted compromises are S3. The merged entries keep this audit's grade; the merge ledger
  records both.
- **Owner questions.** ChatGPT asks none, and recommends prototyping the counter work before putting a trade-off to the owner. This audit
  puts 15 (270-284). Question 274's recommended option is the same order: measure, then decide. Questions 270-274 shape a pass; 275-284 have
  default recommendations that stand without an answer.
- **Measurements this audit had carried without re-running.** The low-sun glare (`CL-REC-10`) and the ground contact (`CL-VIS-10`). Both
  now carry ChatGPT's current figures with their build and browser.
