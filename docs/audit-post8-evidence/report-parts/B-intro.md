Every finding here rests on an area finding in `docs/audit-post8-evidence/<area>/result.json`, cited at the end of its entry as
"area #n", counting from 1. The area's README and evidence files sit beside it, and its scripts are in `tools/audit-post8/<area>/`. Area
findings were merged only when they named the same subsystem and the same failure scenario. Each merge is named in its entry. Related but
distinct issues are cross-referenced instead. Two area results that are not findings were set aside and reported in section C. They confirm
that a decision is implemented as decided: geography #11 (the meres' outlines, decision 27; the castle's size, decision 266 (a)) and
sources-oob #9 (the owner-decided force claims).

**Adversarial verification.** After the areas reported, every finding was given to a separate skeptic with orders to refute it. Each S1 and S2
finding had two: one tried to reproduce it on the audited build with its own probe, and one attacked its premise. The premise skeptic asked
whether the expectation is really required by a `CLAUDE.md` rule, an owner decision, WCAG 2.2 or a source; whether the owner has already
accepted it; and whether its severity and origin are right. S3 and S4 findings went in batches to one skeptic each, who used the cheapest
decisive check: the cited lines at `HEAD`, the cited evidence, or a short re-run. The verdicts are:
- **CONFIRMED**: established independently.
- **PLAUSIBLE**: consistent with the evidence but not established independently.
- **WEAKENED**: real but overstated. The auditor applied the correction.
- **REFUTED**: the finding failed and was withdrawn, or rewritten where a smaller claim survived.
- **DUPLICATE**: merged into the finding named.

Where lenses disagreed, the more adverse verdict stands until the auditor resolves it, and the entry says how. No finding was refuted. The one duplicate verdict concerned a merge already made (`CL-UX-03`). `CL-REC-07` was merged into `CL-ROB-09`, the same issue, and its number is not reused. The completeness critic's three findings (`CL-TEST-21`, `CL-UX-21`, `CL-ROB-13`) and two carried items registered from the records area's evidence (`CL-GEO-11`, `CL-UX-22`) were not given a separate skeptic. Their entries say so. The verifiers' reports are in
`docs/audit-post8-evidence/verification/`, one `.md` and one `.json` per batch.

The fields follow the brief: subsystem, user impact, status and origin, expected and observed behaviour, evidence, reproduction, references,
cause (hypothesis, and whether verified), remedy, effort, dependencies, risk of the remedy, validation, prior records and verification. A
field the area did not fill is omitted, never invented.
