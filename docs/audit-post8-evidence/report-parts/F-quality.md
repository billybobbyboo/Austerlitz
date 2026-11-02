## F. Quality assessment

Each assessment rests on the findings and measurements cited. **Strong** means it holds under adversarial checking with only polish left.
**Sound, with gaps** means the method is right and most of it holds, but named findings break it on paths a visitor uses. **Needs work**
means it fails its own stated standard on a primary path. A passing check is not counted as quality where the check cannot see the
failure (section B, `CL-TEST-*`).

| dimension (`CLAUDE.md` priority) | assessment | what holds (evidence) | what does not (findings) |
|---|---|---|---|
| 1 historical integrity | **sound, with gaps** | Every inventoried statement has a claim or is honestly "unchecked" (10 plan labels drawn on the map lie outside the inventory, `CL-TEST-12`). There are 273 register entries, the disputed hours are kept as named conflicts, and `narrative.js` tags claims on screen. Eleven of the prior audit's history fixes hold. The 8J and 8K re-plots sit where their sources put them | The apparatus contradicts itself or the sources in consequential places. The face-about's pill (`CL-HIS-01`). Four events whose disputed hours are unlabelled (`CL-HIS-06`). DOCUMENTED beside "Not yet checked" (`CL-HIS-12`). 44 A grades carried without a reading (`CL-HIS-02`). The Russian Guard's divided register drawn as one side (`CL-HIS-03`). Formations walking away while "attacking" (`CL-HIS-05`). A Stage 8 re-plot that puts Legrand through the III Column (`CL-HIS-04`) |
| 2 data integrity | **sound, with gaps** | `check:data`: 139 of 139 declarations byte-identical to the reference. Data and presentation are separated as the rules ask. Every data change is listed in `CHANGELOG.md` with `check:data`'s reference moved | Figures attributed to Duffy that Duffy does not print (`CL-SRC-01`, P1). Bare working strengths (`CL-SRC-05`). The guards are change detectors that a data task resets, and a run-time override passes every check (`CL-TEST-03`, `CL-TEST-05`) |
| 3 geographic integrity | **sound, with gaps** | One scale authority. A similarity transform of true geography. The rotation disclosed. Villages from the Czech register within 20 m. The 8J and 8K corrections verified against their sources | The relief is 30-80 m off over the ground the battle turns on, while the visitor is told it is fitted (`CL-GEO-01`, P1). The hydrography is schematic outside Sokolnitz (`CL-GEO-03`). Marsh is drawn over three villages (`CL-GEO-05`). Open questions are told as settled (`CL-GEO-02`, `CL-GEO-06`) |
| 4 simulation integrity | **strong in the model, weaker in its presentation** | Positions are continuous at every critical time (766 checks, a 215,072-sample sweep), deterministic and clamped. Play, the dwell, speed changes and pauses behave as specified, but for small edges (`CL-SIM-07`, `CL-SIM-08`, `CL-UX-14`). There is no duplicate listener or leaked timer. Seeks by four paths give identical positions and statuses (the reading excepted, `CL-SIM-06`) | What the panels and overlays say lags or leaks the model. The open dossier is stale within a phase (`CL-SIM-01`). "Whose eyes?" draws arrows of unknown formations (`CL-SIM-02`). Themes don't stop Play (`CL-SIM-03`). The fade flashes skipped arrows (`CL-SIM-04`) |
| 5 software correctness | **sound, with gaps** | Every required check passes on the audited build. The start-up guard holds in all 8 start-up cases (four failures, a slow start and three context losses). Prolonged use grows nothing after each mode's first construction, except across context restores (`CL-ROB-04`) | A reachable script injection in a published tools page (`CL-ROB-01`, S1). A glide undoes the visitor's pan (`CL-UX-02`). A context loss while playing can throw (`CL-ROB-02`). The input edge cases (`CL-UX-13`, `-19`) |
| 6 visual quality | **strong, with defects** | Computed light and atmosphere through the day, a restrained December palette, villages on their 1825 plan, troops identifiable by side and nation, convincing artillery close up. 100 captures had no warning or error | Figures sunk into the frozen mere (`CL-VIS-01`). Trees on the ice (`CL-VIS-02`). Blocks interpenetrating buildings and one another (`CL-VIS-04`). Facings along slow drifts (`CL-VIS-03`) |
| 6 cartographic usability | **needs work** | The default Landscape keeps 83-89% of formations labelled during Play with short gaps. The paper map is north-up and to scale. The far names' plate holds AA | In Landscape with counters, five to eight formations go unlabelled for most of Play (`CL-MAP-01`). No key between 720 and 1079 px or on a phone held upright (`CL-MAP-03`). No north indicator outside Study in windows at least 1080 px wide and more than 700 px tall, so none on a 1366 x 768 laptop's browser (`CL-MAP-04`). The paper map as entered names no place (`CL-MAP-05`). The caption loses its act and phase (`CL-MAP-06`) |
| 6 interaction, accessibility and first use | **sound, with gaps** | Every control is named and keyboard-reachable. The sheets and card are real modal dialogs. The single-key switch meets 2.1.4. Desktop targets are 24 px and phone targets 44 px. 200% zoom is fully usable. Contrast is AA throughout (6,926 elements). The opening ends in its documented state from every exit | The interface does not reflow at 320 px and 400% (`CL-UX-01`). Caveats live only in tooltips (`CL-UX-08`). Forced colours lose state (`CL-UX-09`). Panels opened by keyboard don't take focus (`CL-UX-10`). The phone's rail is mostly event markers (`CL-UX-03`). The first screen does not say it is a reconstruction (`CL-UX-11`). No screen-reader session has results (`CL-REC-05`) |
| 7 performance | **acceptable on the measured hardware, thinly evidenced** | On the desktop (RTX 4070): the frame budget holds, Play is at 120-124 fps against step 6's 139-140, and the CPU excess was accepted by decision 268 (a). On the phone (iPhone 17 Pro): the budget holds, Overview 40.8 and Play 43.35 fps (24 A blocks each), long frames 18.15% and 8.6%, accepted by 269 (a). All 349 rows recompute from their JSON | The long-frame share is not a dropped-frame measure: 28-32% of 60 Hz refreshes bring no new frame (`CL-PERF-03`). No integrated-GPU run (`CL-PERF-02`). The desktop comparison spans a Chrome update (`CL-PERF-04`). "After the phone warms" has no temperature evidence behind it (`CL-PERF-01`). P5 points to a Stage 8 slowdown on the phone that no like-for-like run has tested (`CL-PERF-06`) |
| 8 tests and evidence | **extensive, partly blind** | Nine suites, 317 self-test checks, 39 visual cases and 18 live blocks pass, and every warning is acknowledged by its text. Of 33 mutations, 30 are caught | Three mutations are caught by nothing and 11 only by change detectors (D.4). The browser checks gate no merge (`CL-TEST-01`). The motion ceilings are the build's own counts and cannot see a gap longer than their window (`CL-TEST-02`, `CL-TEST-14`). Some bounds come from the code under test (`CL-TEST-09`) |
| robustness, security, maintainability | **sound, with one exposure** | three.js r128's SRI matches npm and cdnjs byte for byte. The 8 start-up cases pass. No growth in prolonged use, but across context restores (`CL-ROB-04`). No reachable advisory for three r128 | `CL-ROB-01` (S1). The archived builds lack SRI (`CL-ROB-06`). No licence (`CL-ROB-08`). The documents an agent must read are larger than a context (`CL-ROB-03`). Tools that CI never runs are rotting (`CL-ROB-07`) |
| records | **sound, with recurring drift** | The decisions are recorded with dates and words. The carried register answers every item (57 items, C.4, with this audit's findings beside each) | The README misstates the checks again (`CL-REC-02`, the prior audit's R-1). Merged PRs are recorded as drafts (`CL-REC-03`, R-2 again). `CLAUDE.md`'s current state lags (`CL-REC-08`) |

**Overall.** In its method the map is a historically serious reconstruction. It labels its claims, keeps disagreements and grades its
positions. It is geographically coherent in its frame, and robust in operation. It is not yet historically defensible in every figure and
grade it shows, nor geographically exact in its relief. It is not yet usable as a map below desktop widths or under assistive settings. The
owner's acceptances (decisions 239-269) are honoured. Most are verified as implemented by content; 252-254, 256 and 258 only through the passing checks and the records (C.1). They are not, and were never claimed to be, proof that
every path is good. Section A gives the verdict this supports.

### F.1 The device evidence, reconciled

The perf area regenerated all ten Stage 8 device reports from their JSON with the route's own `format()`, and checked all 349 rows and
every numeric claim of `docs/STAGE8_SPEC.md` sections 24-25. Evidence: `docs/audit-post8-evidence/perf/` (`reconcile.md`, `rows.csv`,
`ledger.json`; 53 record claims in the area's `result.json`, 43 verified, 10 partly, none contradicted; `ledger.json` and the area's own
summary count 51, 41 verified). The verifier re-derived the medians (`CL-PERF-*`).

- **The build.** Every report names 2,810,630 bytes and SHA-256 `bf27887c...db07`, the audited build.
- **Desktop Play** (RTX 4070, Chrome 156, 144 Hz).
  - D1: 124.3 fps at 4x, 120.8 at half speed. D2: 123.0 and 120.2. Step 6's L3 run: 139.0 and 139.7. That is 10.6-14.0% slower.
  - Like for like: the route's code, the clock window, the GPU, screen, density and wrapper.
  - Not like for like: the browser (L3 ran on Chrome 155, unrecorded in section 24) and the build (L3's is step 6 item 3 Part B's, not
    Stage 8's starting build).
  - The CPU-attribution area reproduced the rise on one fixed browser at the device's ratio and located it between L3 and 8E: the kit's three Stage 8 attributes re-bound on every instanced draw are 13-21% of the rise, Stage 8's own app work 20-32% (`CL-PERF-12`).
    Decision 268 (a) accepted it. It is not re-required here.
- **The phone** (iPhone 17 Pro, Safari 26).
  - Over the 24 A blocks of runs R1 and R2 per kind, standard median: Overview 40.8 fps, Play 43.35 (printed 43.3).
  - Long-frame shares over the same blocks: 18.15% and 8.6%.
  - Decision 269 (a) accepted them as measured. It is not re-required here.
- **What "long frame" means.** The route counts an interval between the route's own animation-frame callbacks as long when it exceeds
  `max(1.5 x R, 25 ms)`, where R is the refresh measured once per run. It reports the count as a share of delivered frames, per segment,
  after the first 0.5 s. On the 144 Hz desktop the 25 ms floor is 3.6 refreshes, so doubled frames never count. On the 60 Hz phone the
  threshold is 25.5 ms, so intervals of 17-25.5 ms never count. A long-frame share is therefore not a dropped-frame percentage. Beside the
  phone's 8.6% and 18.15%, 28% and 32% of 60 Hz refreshes bring no new frame (`CL-PERF-03`).
- **What the evidence does not support.**
  - "After the phone warms": no report records temperature or throttling, and Play's 24 A blocks hold 42.8-43.8 fps through both runs
    (`CL-PERF-01`).
  - Any claim for an integrated GPU or a weaker machine: none was measured, and the RTX desktop's GPU was never the limit
    (`CL-PERF-02`).
  - The phone's P5 run (Stage 8's starting build, 53 fps in Play) against this build's 43.35 fps points to a slowdown across Stage 8, but it
    is one session on another route (`CL-PERF-06`).
