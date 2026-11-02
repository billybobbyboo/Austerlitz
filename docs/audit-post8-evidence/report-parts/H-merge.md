## H. Structure for combining the three audits

The owner means to combine this audit with their own and with ChatGPT's. Neither of those was available to this audit, and nothing here
presumes their results. This section proposes a structure that keeps each audit's evidence traceable and its disagreements visible.

### H.1 Identifiers

| audit | prefix | example | where its register lives |
|---|---|---|---|
| this audit (Claude) | `CL-<AREA>-NN` | `CL-HIS-02` | section B; `docs/audit-post8-evidence/register-export.csv` |
| the owner's audit | `OW-<AREA>-NN` (proposed) | `OW-UX-03` | the owner's document |
| ChatGPT's audit | `GP-<AREA>-NN` (proposed) | `GP-PERF-01` | that audit's document |
| the combined register | `AU-NN` | `AU-17` | a new combined document |

The area codes are this audit's: HIS history, SRC sources, GEO geography, SIM simulation and state, VIS the rendered picture, MAP the map layer
and labels, UX interaction and accessibility, PERF performance and the device evidence, TEST the tests and benchmarks, ROB robustness,
security and dependencies, REC the records and documentation. Each audit's identifiers stay as they are. The combined register maps to them
and never renumbers them.

### H.2 One row per issue in the combined register

| column | content |
|---|---|
| `AU` | the combined identifier |
| `CL`, `OW`, `GP` | the source identifiers. An issue one audit did not find is left empty, not marked as disagreement |
| title, subsystem | taken from the most specific source |
| severity: `CL`, `OW`, `GP`, agreed | each audit's own grading, then the agreed one. The rule: take the highest severity that reproducible evidence supports, and keep any disagreement in a note with each side's reason, as the project keeps disputed readings |
| kind | confirmed defect, probable problem, accepted compromise, optional improvement, unresolved historical question, untested area. A probable problem becomes a confirmed defect only when one audit reproduces it |
| evidence | each source's evidence path, never only a summary |
| reproduced by | which audits reproduced it, and on which build. All three should name md5 `f10fe585...` or say otherwise |
| owner decision | the decision number if one applies (an accepted compromise), or the open question (section I) |
| work package | one package of section G (or of the combined roadmap) |
| status | open, decided, fixed in a named PR, or retired with its reason |

`docs/audit-post8-evidence/register-export.csv` has this audit's half of these columns, one row per `CL-` finding, so the merge can start
from a table, not from prose.

### H.3 Matching rules

1. Two findings are the same issue when they name the same subsystem and the same failure scenario. A shared title or symptom is not enough.
   Example: "labels hidden during Play" (`CL-MAP-01`) and "a test cannot see long gaps" (`CL-TEST-` entries) are different issues with one cause.
2. If one finding contains another, keep the larger as the row and record the smaller as its source.
3. A finding that one audit calls an accepted compromise and another a defect is a disagreement. The row keeps the owner's decision number,
   the new evidence and the question whether that evidence changes the decision's premise (this audit's rule; section I).
4. Coverage merges as a union. Each dimension of section C gets one column per audit (deep, sampled, read, not covered). An area that no audit
   covered stays visible as an untested area in the combined register.
5. A historical finding keeps its sources and its claim label (fact, attributed, disputed, derived, interpretation, uncertain, design), as
   `narrative.js` does. Two audits that read different sources are not merged into one reading.

### H.4 What this audit hands to the merge

- The register: section B and `register.json` (machine-readable, with each finding's area source and verification verdict).
- The coverage matrix, section C, with each area's "not checked" list kept.
- The ledgers. Experiments are in section D. Historical and source verification is in section E, with the full ledgers in
  `docs/audit-post8-evidence/sources-oob/ledger.md`, `sources-chronology/` and `geography/`.
- The owner questions, numbered from 270 (section I), so they do not collide with the project's decisions.
- The roadmap's work packages (section G), each listing its `CL-` findings, so the other audits' findings can be attached to the same
  packages or to new ones.
