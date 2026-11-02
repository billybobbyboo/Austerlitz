# Evidence for the final audit after Stage 8

The evidence behind `docs/FINAL_AUDIT_POST_STAGE8.md` and its companion `docs/FINAL_AUDIT_POST_STAGE8_LEDGERS.md`.

**What the evidence touches.** Nothing in this directory or in `tools/audit-post8/` changes the application, its data, thresholds, tests,
archive or build. The scripts only measure. Experiments ran against the committed build (md5 `f10fe585...`), in isolated copies under the
session's scratchpad (each rebuilt to that md5 first), or on local copies served from 127.0.0.1. The security reproduction never touched the
live site.

## How the report is made

```
python3 tools/audit-post8/register.py    # register.json from the areas' results, the verdicts and tools/audit-post8/resolution.py
python3 tools/audit-post8/report.py      # docs/FINAL_AUDIT_POST_STAGE8.md, docs/FINAL_AUDIT_POST_STAGE8_LEDGERS.md, register-export.csv
```

- `register.json`: one entry per finding (`CL-<GROUP>-NN`). Each entry names the area finding it rests on, any area findings merged into it,
  the auditor's overrides and the verification verdict.
- `tools/audit-post8/resolution.py`: the auditor's resolution of the verification. It holds each change of severity, priority, category,
  origin or wording, with its reason; the work packages; and the carried issues' cross-references.
- `report-parts/*.md`: the hand-written sections (A, C-J). Their counts (`{{N}}`, `{{SEV}}` and so on) are filled from the register when the
  report is made.
- `register-export.csv`: this audit's half of the combined register's columns (report section H).

## The directories

| directory | what it holds |
|---|---|
| `baseline/` | the identity of the audited build (source, generated, deployed, tested, device-measured) and the code indexes |
| `checks/` | the required checks' logs, run here by `tools/audit-post8/run-checks.sh` (`summary.txt`), the suites' outputs, the self-test report, CI's `check:visual` report (run 41394859313, gzipped) and `check:report` on it |
| `history/` | the reconstruction against its own readings: tracks, events, grades, claims (node probes) |
| `sources-oob/` | the forces' figures against the sources they cite (42 claims) |
| `sources-chronology/` | the timings, events and places against the sources' text (20 claims; page captures in `pages/`) |
| `geography/` | scale, orientation, relief, water, settlements, landmarks, crossings against open data (`raw/`) |
| `state/` | simulation, state and correctness: node property checks on the helper modules and the built bundle |
| `interaction/` | 14 scenario scripts under real input (mouse, wheel, keys, taps, CDP touch) |
| `visibility/` | the map layer over long playback (21 runs on the motion driver) |
| `visual-landscape/` | 100 landscape captures, the facings, the ice |
| `visual-maps/` | the paper map, the layouts, the legend, the furniture, the label hierarchy (74 captures with read-backs) |
| `a11y/` | accessibility and first use: zoom and reflow, forced colours, focus, names, the first screen |
| `perf/` | the ten Stage 8 device reports and their 349 rows recomputed; the route's definitions |
| `perf-attribution/` | where the main thread's script time goes: the audited build against step 6's L3 build and 8E's |
| `robustness/` | security (HTML sinks, URL parameters, advisories), licences, offline dependence, context loss cycles, prolonged use, maintainability |
| `tests/` | the gate, threshold history, the 33 mutations (negative controls), the self-test manifest |
| `records/` | the prior audit's 75 findings now, the 57 carried issues (`carried.md`), the records' consistency |
| `verification/` | the adversarial verifiers' reports, one `.md` and one `.json` per batch (`v-repro-*`: reproduction lens; `v-premise-*`: premise lens; `v-batch-*`: S3/S4 batches) |
| `completeness/` | the completeness critic's review of the report against the brief |

Each area's `README.md` says what was examined, how, with which commands, what was found and what was not checked. Its `result.json` is its
structured result. The register cites findings by their order in that file. An area README may number its findings differently.

## Interruptions

The account's usage limit stopped the audit three times, at about 01:30, 13:00 and later UTC on 2 November 2026. Each area or verifier that
stopped was finished from its saved evidence in a later attempt, with its partial work reused. Its README or verification report says what
was redone. Where an agent stopped before writing up results it had saved, the audit lead summarised the saved files and marked it so (for
example `robustness/README.md` section B2).
