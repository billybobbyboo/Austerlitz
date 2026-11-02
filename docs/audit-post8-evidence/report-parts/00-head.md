# Final audit after Stage 8 (Claude's independent audit)

2 November 2026. An independent, evidence-led audit of the whole Austerlitz command map after Stage 8, its follow-ups 8I-8L, the benchmark
closure (decision 267 (a)) and the device acceptance (decisions 268 (a), 269 (a)). It is one of three audits the owner means to combine
(section H). It does not replace `docs/FINAL_AUDIT.md`, the audit after Stage 7, which stays as written. Its findings use their own
identifiers (`CL-<AREA>-NN`), so they cannot be confused with that audit's (`H-1`, `SW-1`, `A-1` and so on), which are cited where they are
carried forward.

**What the audit did not do.** It changed no application source, data, threshold, test, archive or build file, and no owner decision. Every
experiment ran in the session's scratchpad, in an isolated copy of the tree (each rebuilt there to md5 `f10fe585...` first), or as a page probe
against the committed build. Nothing was merged or deployed. The audit's own files are this report, `docs/audit-post8-evidence/` (evidence,
area reports, structured results) and `tools/audit-post8/` (the diagnostic scripts, which only measure). `git diff 43e3e5b..` on this branch
touches nothing else (section D.1).

## The audited build

| build | identity | how established |
|---|---|---|
| source | `main` at `43e3e5bcc5ab0cbbcb604a22a5b8c29f801649c8` (PR #79's merge, 1 Nov 2026). PR #78 (decision 267 (a), `c2adefe`) and PR #79 (decisions 268 (a), 269 (a)) are merged. | `git rev-parse origin/main`; the audit branch `claude/inspiring-franklin-qt51w2` starts there |
| generated | `austerlitz-command-map.html`: 2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83`, SHA-256 `bf27887c177ec68efbaedfe29e9d7826cf89c66ca7390b17e3cda8acf708db07` | `npm run check:baseline`: a fresh `python3 build.py` is byte-identical to the committed file. The same bytes are committed at `0b7b77c` (8L), `141f890`, `d3f7026`, `c2adefe` and `43e3e5b`, and are `archive/stage8k-f10fe585.html` |
| deployed | GitHub Pages serves the same bytes (2,810,630 bytes, same md5 and SHA-256; `last-modified` 1 Nov 2026 10:57:40 GMT, from Pages run 41299647355 on `43e3e5b`) | fetched and hashed at 00:44 UTC on 2 Nov |
| tested | the suites rebuild `bundle.js` from the same sources; the browser checks open the committed HTML. Here: `npm test`, `check:data`, `check:chronology`, `check:contrast`, `check:selftest`. On CI: the checks job, contrast and self-test on every audit commit, and `check:visual` on `2f3cd78`, whose application files equal `43e3e5b`'s | section D |
| device-measured | all ten Stage 8 device reports (`docs/stage8-evidence/device/`) name 2,810,630 bytes and SHA-256 `bf27887c...db07`, so they measured this build | re-checked report by report (`docs/audit-post8-evidence/perf/`) |

The audit's environment: a Linux container (4 CPUs, 15 GB), Node 22, Python 3.13, Playwright 1.56. The browser is Chromium 141.0.7390.37, the
headless shell CI pins, downloaded into the scratchpad and named by `AUSTERLITZ_CHROME`. WebGL runs on ANGLE over SwiftShader, which is
software rendering, so **no time measured in this audit is a device's**. Every frame time or frame rate quoted here comes from the owner's
device reports. A phone here is Chromium's emulation (density 3, touch, an iPhone's user agent), not a real mobile browser; section C says where
that matters.

**The records read.** `CLAUDE.md`, `README.md` and `CHANGELOG.md`. In `docs/`: `ROADMAP.md`, `STAGE8_SPEC.md` (every section and
decision 239-269), `FINAL_AUDIT.md` (the prior audit and decisions 125-141), `STEP6_SPEC.md` and the earlier stage specifications' decision
records. The evidence registers: `docs/step2-evidence/`, `docs/step4-evidence/`, `docs/stage6-evidence/` and `docs/stage8-evidence/`
(device reports, 8G-8L). Each area README lists what it read.

## How to read the findings

- **Severity.** **S1** critical: materially misleading on a primary path; a crash or an unusable state on a primary path; a real, reachable
  security exposure. **S2** major: wrong behaviour on a reachable common path; a WCAG 2.2 A or AA failure; visible degradation on the target
  hardware; a `CLAUDE.md` rule broken on a primary path. **S3** minor: a secondary path, an edge case, a limited cost to comprehension. **S4**
  polish.
- **Priority.** **P1** must be fixed before the map is called finished. **P2** a valuable quick fix. **P3** medium. **P4** optional.
- **Kind.** A *confirmed defect* is reproduced, or read and shown, against an explicit expectation. A *probable problem* has evidence but is not
  reproduced in full, or its expectation is a judgement. An *accepted compromise* is a limitation the owner has decided, recorded here so the
  three audits can see it. It is not reopened unless new evidence changes its premise, and the finding says so where it does. An *optional
  improvement* is not a defect. An *unresolved historical question* is one the sources leave open. An *untested area* is one no check covers.
- **Origin.** *New* means Stage 8 or later (8A-8L, decisions 239-269). *Inherited* means before Stage 8.
- **Status** says how the area auditor established the finding (confirmed, inferred, unverified). Some areas wrote "open" instead
  (established and not yet fixed), and an accepted item names its decision. **Verification** gives the adversarial
  re-check's verdict, made independently afterwards (section B's introduction).
- **Owner acceptance is not a technical pass, and a technical pass is not a good experience.** Where a check passes and the experience still
  fails, the finding says both.

## Contents

- A. Executive verdict
- B. Findings register (B.1 index, B.2 the findings in full)
- C. Coverage matrix
- D. Test and experiment ledger
- E. Historical and source verification ledger
- F. Quality assessment
- G. Prioritized roadmap
- H. Structure for combining the three audits
- I. Owner decisions
- J. Summary
