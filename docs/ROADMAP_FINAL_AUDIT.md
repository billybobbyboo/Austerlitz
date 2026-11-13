# Roadmap after the final audits

4 November 2026. This is the finalized roadmap from the two independent audits after Stage 8:
- Claude's: `docs/FINAL_AUDIT_POST_STAGE8.md`, 151 findings.
- ChatGPT's: `docs/FINAL_AUDIT_POST_STAGE8_CHATGPT.md`, 11 findings, with its evidence in `docs/final-audit-chatgpt-evidence/`.

Both audited the same build: `main` at `43e3e5b`, md5 `f10fe585...`, 2,810,630 bytes.

**How the two registers were merged.** Every ChatGPT finding was mapped to the Claude register:
- **Same issue:** merged into the existing entry. Its ChatGPT identifier is written beside it, and any new evidence is folded in. One example
  is CG-F01's longer counter gap in `CL-MAP-01`.
- **Not in the register:** added as a new entry with its own `CL-` identifier and its ChatGPT identifier. There are seven:
  - `CL-SRC-10`, the unchecked corpus;
  - `CL-VIS-10`, the ground contact on the current build;
  - `CL-VIS-11`, landmark legibility;
  - `CL-PERF-15`, the phone's figure workload as the lever;
  - `CL-PERF-16`, the phone rule accepting empty reports;
  - `CL-REC-09`, `build.py`'s character count printed as bytes;
  - `CL-REC-10`, the stale glare figure.

Nothing is listed twice. The merged register has 158 entries (`docs/audit-post8-evidence/register.json`, `register-export.csv`; the
`chatgpt` column names the ChatGPT finding). Section K of the Claude report gives the comparison: where the audits agree, where they
differ, and what each found alone.

The owner's own audit is still to be combined, by the same rules (report section H).

## How to read the effort levels

Each pass has two figures:
- **Days:** an estimate of working days for one session to do the pass, including its re-measurement. Research time is the least certain.
- **Effort level:** the Claude Code reasoning effort recommended for that pass (`/effort`).

| level | when it is the right one here |
|---|---|
| **low** | a mechanical edit with one decisive check (a label, a stale count) |
| **medium** | a bounded code or records change, existing checks covering it, little judgement |
| **high** | a guarded data task, a change across subsystems, a source to read on page images, a new check to design and prove with a negative control |
| **xhigh** | a large data task with geographic consequences and baselines to re-measure under the owner's rules; an algorithmic trade-off judged against benchmarks; the closing re-verification |
| **max** | not recommended for any pass. Nothing here needs more than xhigh, and max's cost would buy little more |

Every pass keeps the project's rules (`CLAUDE.md`):
- No data problem is fixed by changing only the display.
- A data task cites its evidence and moves `check:data`'s reference.
- A threshold moves only on the owner's word.
- All nine suites pass, and the build's new md5 is recorded in `CHANGELOG.md`.

## The stages

**Status (13 November 2026):** Stages 1 to 6 are merged: Stage 1 (#82), Stage 2 (#83), Stage 3 (#84), Stage 4's WP-03 (#86), WP-04b (#87) and WP-15's first batch (#85), Stage 5's WP-07 (#89), WP-08's lettering and landmarks (#91, brought into `main` by #92) and WP-08's furniture (#90), Stage 6's WP-10 meres (#94), CI pinned to Ubuntu 24.04 (#95), WP-09's reflow, short screens and forced colours (#98), its names, focus, caveats and first card (#100), its visitor words (#96, a data task), WP-10's facings, camp, streams and tier on a resize (#99), its crowns near the eye and blocks among the buildings (#102), decision 312 (a), what "Whose eyes?" withholds (#97), and the screen-reader and device script (#103, which carries the file #101 merged into #100's branch after that branch had reached `main`). `main`'s build is `dcc65319...` (3,025,956 bytes), its self-test 348 checks, `check:visual` 41 cases, `check:data`'s reference `archive/stage6wp09w-45d29cc5.html`; the owner decisions run to 316. Four of WP-13's items are deferred with reasons: CL-ROB-03, -08, -09 and -13 (`CHANGELOG.md`). The screen-reader session (`docs/final-stage6-evidence/sr-session.md`) is the owner's to run; nothing in it is recorded. What each stage leaves is listed in its `CHANGELOG.md` entry. Stage 7 ("Performance and robustness"; `docs/final-stage7-evidence/`) is merged but for its last PR: the Stage 6 records (#104), WP-14 (#105), WP-16 in two PRs (#106, #107), with owner decisions 278, 283 and 317-323; `main`'s build `8c0d383e...` (3,037,848 bytes), its self-test 351 checks. WP-12, the device evidence (records, the route's version 4, the protocol for the owner's runs), is the PR after them, with the owner's desktop runs of Stage 7's build (13 November 2026: section 8.3's budget and CPU line and section 8.5's rule hold;
`docs/STAGE8_SPEC.md` section 27.1) and phone runs (section 27.2: the budget within, the frames a second P5's, section 8.5's long-frame clause failing in
one segment, accepted as measured by decision 324 (a)); with it Stage 7 is done, an integrated GPU at the owner's convenience (decision 278). The closing re-verification pass follows.

| stage | passes | days | the gate it closes |
|---|---|---|---|
| **1. Now** | WP-00, WP-04a, WP-13 | about 1-3 | no public exposure; no false statement about the relief; the evidence tools and records trustworthy before the next decision |
| **2. What a visitor is told** | WP-01, WP-02 | about 3-5, plus the owner's photographs | the claims, labels and force figures say what the sources support |
| **3. Correctness on common paths** | WP-05, WP-06 | about 3-6 | the panels follow the clock and the reading; input is never undone |
| *Before calling the map finished* | stages 1-3 | about 7-14 | every P1 finding (`CL-ROB-01`, `CL-SRC-01`, `CL-GEO-01`), seven of the 15 S2s, and ChatGPT's first package (W1) |
| **4. Reconstruction depth** | WP-03, WP-04b, WP-15 (first batch) | about 7-17 | the tracks, grades and relief consistent with their sources; the prominent unchecked claims triaged |
| **5. Visibility and legibility** | WP-07, WP-08 | about 7-15 | formations stay identified during Play; the map explains itself at every width |
| **6. Access and the picture** | WP-09, WP-10 | about 5-10 | reflow, focus, forced colours and a screen-reader record; the picture's contact and overlaps |
| **7. Performance and robustness** | WP-16, WP-12, WP-14 | about 5-11, plus the owner's device runs | the measured optimisations and the device evidence's gaps |
| *Alongside every stage* | WP-11 | about 3-6 in all | each fix held by a check that can fail, shown by a negative control |
| *Closing* | the re-verification pass | about 1-2 | each closed finding re-verified with the audits' own probes |

Stage 4 comes before stage 5 on purpose. The tracks and the relief move positions and ground, so the map layer's priority work and its
re-baselining are done once, on the final geography. The research batches of WP-15 can run beside any stage. Their outcomes feed WP-01 and
WP-03 as data tasks.

## The passes

| pass | what it does | findings (ChatGPT) | days | effort | owner questions | done when |
|---|---|---|---|---|---|---|
| **WP-00** close the public script injection | `tools/step6/perf-run.html` accepts `?src=` only as a same-origin http(s) path. Decide what Pages publishes beside the product | `CL-ROB-01` (S1), `CL-ROB-06` | hours | **medium**: a small change, but security-sensitive; it must keep decision 217's device route working, so it is verified against a local reproduction, never the live site | 270 | `tools/audit-post8/robustness/perfrun-src.js` no longer runs script; the route works with its default and same-origin paths |
| **WP-04a** the relief's disclosure | the sources sheet stops saying the relief is fitted to surveyed elevations where it is 30-80 m off | `CL-GEO-01` (its disclosure) | hours | **medium**: one guarded text change with its claim hash | 273 | the sentence states where the fit holds and where it does not; `test.js` and `check:data` pass with the reference moved |
| **WP-13** records and evidence tools | the phone rule rejects empty or incomplete reports. `build.py` prints bytes. The README's checks, the PR statuses and `CLAUDE.md`'s current state are made current. The carried checklist is restated. The old glare figure is annotated with its build and browser. A licence is chosen. The agent documents are split to fit a context. The self-test's shipping is reconsidered | `CL-PERF-16` (CG-F08), `CL-REC-09` (CG-F09), `CL-REC-02` (CG-F09), `CL-REC-10` (CG-F10), `CL-REC-01`, `-03`, `-04`, `-08`, `CL-ROB-03`, `-08`, `-09`, `-13` | 1-2 | **medium**: mechanical in parts (low would do for `build.py` alone); the phone rule needs negative controls, and the records need careful cross-checking | 279, 283 | the empty, partial and duplicate-block reports exit non-zero while R1/R2 still give rule 4; `records/doc-consistency.md`'s list re-run is empty; the build's md5 unchanged by the records |
| **WP-01** claims and words a visitor is told | the face-about and four other events disputed with both sides. The Command tab's DOCUMENTED aligned with the claims register. The castle's walls, the pheasantry and the marshiness told as open. Kologrivov's note corrected. The church claim and the relief sentence set right | `CL-HIS-01`, `-06`, `-12`, `-14`, `-15`, `CL-SRC-03`, `-09`, `CL-GEO-02`, `-06`, `-08`, `-09`, `-10` (CG-F03) | 1-2 | **high**: a guarded data task, so claim hashes, chronology L9 hashes and the 09:15 views' drop limits must be re-measured | none (a drop limit moves only on the owner's word) | `check:data` lists every changed declaration; the inventory and hashes are current; `redteam.js` passes |
| **WP-02** the force figures | the page-image reading of Duffy (1977)'s order-of-battle rows (the owner's photographs), then each figure attributed to what a source prints or labelled a derivation; bare working strengths noted; headline strengths tagged | `CL-SRC-01` (P1), `-02`, `-04`, `-05`, `-06`, `-07`, `-08` | 2-3, plus the photographs | **high**: reading sources on page images and a guarded data task; xhigh is not needed because the figures are local | 271 | every strength note names a source that prints its figure; the force ledger re-run has no contradicted row |
| **WP-05** the panels while the clock moves | the open dossier's clock-dependent rows repainted. "Whose eyes?" withholds arrows, labels and the card's "Doing now". Themes stop Play. The fade carries its reached opacity. The reading computed at the minute's start. The first Play frame, the dwell's caption and the event jumps' margin fixed | `CL-SIM-01` to `-08`, `CL-UX-07`, `-14` | 2-4 | **high**: several subsystems (dossier, reading, overlays, clock) with runtime tests to add; decision 251 (a)'s reach to extend without leaking | none | runtime tests move the clock inside a phase with a dossier open; the state and interaction scenarios re-run clean |
| **WP-06** the camera and the timeline under input | a pan, zoom or key ends a running glide. Event markers stop taking the rail's presses (on a phone above all). The tooltip leaves the controls free. The rail's drag gets a cancel and a button test. A sheet ends a drag. Focus is handed on after a resize | `CL-UX-02`, `-03`, `-04`, `-13`, `-19`, `-20` | 1-2 | **medium**: bounded input handlers with clear expected behaviour; the phone checks guard the layout | none | the interaction scenarios by real input show no undone pan and a drag scrubbing everywhere on the rail |
| **WP-03** tracks, grades and internal consistency | the 44 carried A grades reviewed one by one. The Russian Guard's divided register visible. Legrand routed clear of the castle and the III Column. Retreat legs not under an offensive status. Kienmayer, Kamensky, Caffarelli, Sokolnitz's occupation and Miloradovich at dawn reconciled with their acts. The named conflicts kept disclosed | `CL-HIS-02`, `-03`, `-04`, `-05`, `-07` (CG-F03), `-08` (CG-F03), `-09` (CG-F03), `-10`, `-11`, `-13`, `CL-REC-06`; the accepted `CL-HIS-16`, `-17` kept | 3-6 | **xhigh**: the largest data task. It has geographic consequences, the motion baselines must be re-measured under the owner's rule for geographic baselines, and every change needs a reading | 272 | the history probes find no opposing legs within 0.5 km outside a recorded melee and no offensive status on a retreating leg; the motion baselines re-measured; `check:chronology` unchanged |
| **WP-04b** the relief's refit and the ground | the relief refit against open terrain data; the hydrography's schematic parts traced or labelled; marsh off the villages; Krug at the 1836-52 survey's place or labelled; the castle on ground of its own | `CL-GEO-01`, `-03`, `-04`, `-05`, `-07` (CG-F03), `-11` | 3-8 (a DEM-derived grid 1-3 weeks) | **xhigh**: it moves the ground every view stands on; every geographic baseline must be re-measured | 273 | the elevation residuals within a stated tolerance on the plateau, the knoll and Slapanice; the baselines re-measured |
| **WP-15** the historical research queue | triage the 481 unchecked statements by prominence (the opening, the tour, the phase ledes, the Command explanations, the headline strengths first). Then source them in batches of 10-20. Rank the open questions by interpretive impact: ChatGPT's 35 in `docs/final-audit-chatgpt-evidence/unresolved-questions.csv` against report section E.3. "Still unresolved" is an acceptable outcome | `CL-SRC-10` (CG-F02); the open questions (CG-F03) | 1-3 per batch (the first: the prominent claims) | **high**: careful reading of primary pages and registers. Each batch is bounded; findings become data tasks in WP-01 or WP-03 | none | each batch's claims carry a registered reading or an accurate qualification; the inventory's unchecked count falls for the prominent classes |
| **WP-07** the map layer in motion | event-named formations and the starved cavalry keep their counters during Play. A held item that a fresh layout would place ahead of a kept lower one takes its room. The benchmark gains a long-gap measure that does not saturate, and ChatGPT's continuous 3,600-frame protocol joins the checks | `CL-MAP-01` (CG-F01), `-02`, `-07`, `-12`, `-14`, `-17`, `CL-TEST-02`, `-14` | 3-8 | **xhigh**: an algorithmic trade-off across every layout and view, judged against the motion block's baselines (decisions 240 (a), 257 (b), 267 (a)) | 274, 284 | over ChatGPT's 3,600-frame run and this audit's long runs, no formation under 50% and gaps bounded in clock minutes; the 16 motions within their ceilings or re-baselined on the owner's word |
| **WP-08** map furniture, legibility and landmarks | a key and a north indicator everywhere a visitor reads the map. Reference names on the paper map as entered. The caption keeps its act and phase. The legend complete. Arrow labels, the selection, Plans and the glyphs told apart. A restrained landmark cue for the castle and the garden, with no relocation | `CL-MAP-03`, `-04`, `-05`, `-06`, `-08` to `-11`, `-13`, `-15`, `-16`, `-18` (CG-F05), `-19`, `-20`, `CL-VIS-11` (CG-F05) | 4-7 | **high**: layout and cartography across widths, with the phone and visual cases re-measured; the decisions' limits respected | 275, 282 | the phone and layout cases show a key and north in every reading state; the castle and the garden identifiable in representative views without new budget |
| **WP-09** accessibility and first use | reflow at 320 px and 400% (the map itself exempt). Caveats beyond tooltips. Forced colours. Focus taken by panels opened from the keyboard. Internal references out of visitor text. Names and structure. The claims index counted. The first screen says it is a reconstruction. A recorded screen-reader session | `CL-UX-01`, `-05`, `-06`, `-08` to `-12`, `-15` to `-18`, `-21`, `-22`, `CL-REC-05` (CG-F11) | 3-6, plus an AT session | **high**: many small changes across the interface, each against a WCAG criterion, with `check:contrast` extended | 276 | an AT session's results recorded item by item with versions; `check:contrast` covers 320 px and forced colours |
| **WP-10** the rendered picture | figures stand on the frozen mere; trees and bushes off the ice; facings toward the enemy; no interpenetration of blocks and buildings; the streams' glint, the headquarters camp, the omitted chapels and the crowns' facets. Optional: a near-only foot profile for ground contact | `CL-VIS-01` to `-09`, `CL-VIS-10` (CG-F04, optional) | 2-4 (plus 2-5 for the optional contact work) | **high**: rendering changes with visual and self-test checks; the contact prototype must stay within the animation budget | 280, 281 | the landscape captures re-shot; the self-test's contact and ice checks extended to the mere's figures |
| **WP-16** targeted performance | only measured improvements: pack the kit's per-instance attributes (`aPh` into `aSl`, about 860 fewer GL calls a frame); memoise `freeRect`; light the label pass so three.js stops re-deriving 318 programs a frame; then profile the phone's figure and standard workload | `CL-PERF-12` (CG-F07), `-13`, `-14`, `-15` (CG-F06) | 1-3 for the remaining attribution, then 2-5 | **high**: each change must be shown on matched protocols, with pixels unchanged and the shadow map untouched (the self-test reads it) | 283 (the payload) | each change's effect measured on the same route and build pair; the picture pixel-identical; the culling and gait checks pass |
| **WP-12** the device evidence | the records corrected: no "after the phone warms" without evidence, the browser update named, medians called medians, the long-frame share beside a refresh-based measure. The owner's runs where hardware allows: an integrated GPU, a like-for-like phone run, raw intervals kept | `CL-PERF-01` to `-11` (`-03` and `-04` read the same way by CG-F06 and CG-F07) | 1, plus the owner's runs | **medium**: records work, and the route's raw intervals are a small tool change | 278 | sections 24-25 corrected; the reports filed, or their absence recorded as a limit |
| **WP-14** robustness residuals | no throw on a context loss while playing; the restore's retained heap bounded; no idle animation-frame polling if measured worthwhile; the dead code and `esc()`'s quotes fixed; the offline dependence stated | `CL-ROB-02`, `-04`, `-05`, `-10`, `-11`, `-12` | 1-2 | **medium**: bounded fixes with the existing context-loss cases as their checks | none | the context cycles re-run without an uncaught error and with flat retained memory |
| **WP-11** tests and CI (alongside) | the browser checks required. Properties instead of change detectors where a data task resets them. Bounds not taken from the code under test. Style colours, word-form hours and the inventory's completeness checked. The gait's shader compared with its mirror. The rotting tools pruned or run. The audits' unexamined parts given a check | `CL-TEST-01`, `-03` to `-13`, `-15` to `-21`, `CL-ROB-07` | 3-6 in all | **high**: each new check must be proved by a negative control | 277 | the 33 mutations re-run: the 3 missed by everything and the 11 caught only by change detectors are caught by a property check |
| **Closing** re-verification | re-run each closed finding's probe from both audits. From Claude's: history, state, interaction and visibility. From ChatGPT's: extended playback, contact, ice, the phone-rule negative control and the report mutations. Then the 33 mutations and every required check, and a short delta report | every closed finding | 1-2 | **xhigh**: it is the audit's standard applied again, and it decides what is called finished | none | a delta report listing each finding as fixed, kept or carried, with evidence |

## The owner questions, by the pass they shape

The questions are in section I of the Claude report.
- **Shape a pass before it can start or finish:** 270 (WP-00), 271 (WP-02), 272 (WP-03), 273 (WP-04), 274 (WP-07).
- **Optional or settled by default:** 275-284. Each recommendation stands if the owner does not answer.

ChatGPT's audit asks no owner question. It recommends prototyping the counter work first and putting a measured trade-off to the owner
afterwards. That is question 274's option (a) in practice. The two positions agree on the order: measure first, then decide.
