# Austerlitz command map: independent audit after Stage 8

**Audit date:** 2 November 2026, Australia/Sydney. **Auditor:** ChatGPT/Codex. **Scope:** the current application and its supporting engineering, with sampled historical verification. **Application changes made:** none. No merge, deployment, historical-data edit, threshold relaxation or owner-decision change was made.

## A. Executive verdict

**Stage 8's implementation and owner acceptance are closed. The map is ready to share and use as a qualified historical reconstruction. It is not justified to describe the entire map as historically verified or every original quality criterion as satisfied.** Decisions 267(a), 268(a) and 269(a) are settled and remain intact. Completing this audit requires no new phone or desktop run.

The strongest parts are the separation of evidence, reconstruction and derived readings; the usable paper map; the coherent visual language; the breadth of regression checks; the explicit handling of historical disagreement; and the reproducible source-to-build pipeline. The current source build, deployed file and all ten owner-measured files identify the same HTML. The ordinary regression suites pass. Existing full visual evidence is unusually substantial and passes when independently judged again against current rules.

The most consequential new result is **CG-F01**: an ordinary counter can disappear from the layout for far longer than the short benchmark suggests. In a 120-second, 30 Hz diagnostic playback, the French Guard cavalry counter is placement-hidden for **36.633 uninterrupted seconds on the driver's clock**, spanning approximately **11:02-13:15 on the battle clock**. These samples exclude off-screen and terrain-occluded items. Placement status is the metric: an initial fade-out remnant may persist for up to the configured 180 ms, so the episode length is not an exact pixel-alpha-zero duration. This is not an owner-device timing measurement. Selecting Saint-Hilaire protects it in every sampled frame, and the paper map is much more reliable. The narrow problem is ordinary hybrid-counter visibility over time.

The largest confidence limitation is **CG-F02**: **481 of the 704 inventoried narrative statements remain unchecked** against a registered source reading. That does not mean they are false. It means the source-verification work is incomplete and the data-invariance test cannot close that gap. Several central timing and location questions remain openly disputed, rather than solved.

Other worthwhile work is proportionate: harden the phone diagnostic against empty evidence (**CG-F08**), improve landmark identification without relocating geography (**CG-F05**), and correct stale developer instructions and the character-counting build log (**CG-F09**). Ground contact remains imperfect (**CG-F04**), but the default-view sampled errors are mostly small. Phone and high-refresh desktop performance limits remain accepted, measured compromises (**CG-F06/07**), not renewed acceptance questions.

**What prevents an unqualified “finished” verdict:** reliable sustained hybrid-counter identification, a defensible completion boundary for prominent historical claims, and honest closure of the remaining visual/verification limits. There is no demonstrated reason here for an architectural rewrite, another universal polish stage, or holding ordinary sharing hostage to research that may never resolve every disputed location.

**What remains uncertain:** complete historical truth of the unchecked corpus; the correct answers to the named disputes; individual Stage 8 contributors to the desktop CPU rise; a specific phone bottleneck; actual integrated-GPU behavior; current NVDA/VoiceOver speech; Firefox/Safari functional parity beyond the supplied Safari measurements; and multi-hour resource behavior. These are separated below from confirmed defects.

## B. Baseline and provenance

| Identity | Independently established result |
|---|---|
| Repository | `billybobbyboo/Austerlitz` |
| Current `main`, verified again near the end | `43e3e5bcc5ab0cbbcb604a22a5b8c29f801649c8` |
| Latest merge | PR #79, device acceptance; merged 1 November 2026 at 10:56:22 UTC |
| Previous merge | PR #78, benchmark closure; `c2adefed5db091d420b95cf2f84ff633279ec2e6` |
| Application file | `austerlitz-command-map.html`, **2,810,630 actual bytes** |
| SHA-256 | `bf27887c177ec68efbaedfe29e9d7826cf89c66ca7390b17e3cda8acf708db07` |
| MD5 | `f10fe585c46aea576f436ed51ac46f83` |
| Deployed file | Directly fetched from [GitHub Pages](https://billybobbyboo.github.io/Austerlitz/austerlitz-command-map.html); identical length and hashes. Retrieval and response metadata: `deployed-build.json` |
| Current-head CI | [Run 41299647851](https://github.com/billybobbyboo/Austerlitz/actions/runs/41299647851): checks, contrast and self-test successful; full visual job intentionally skipped on a normal push |
| Current-head Pages | [Run 41299647355](https://github.com/billybobbyboo/Austerlitz/actions/runs/41299647355): successful |
| Full visual evidence rejudged here | [Run 41259079904](https://github.com/billybobbyboo/Austerlitz/actions/runs/41259079904), test commit `d3f70266e275541fbcd0f1b15e8257896a500423`; visual artifact 13067821452; 39 cases, 317 self-tests, all live blocks pass |
| Why that earlier test applies | `git diff d3f70266 HEAD -- '*.js' '*.css' '*.html' '*.py' package.json .github` is empty. The application, dependencies and check implementation are unchanged; this audit also re-ran the report judge against current code and the current HTML hash |
| Self-test artifact also rejudged | PR #78 main run 41282709563, artifact 13074503512; current build, 317/317; `ci-pr78-check-report.log` |
| Owner-measured files | All ten reports name the current byte count and SHA-256; device identity/settings and visible status checked independently |
| Uploaded ZIPs | Both contain an identical older 1,097,610-byte HTML, SHA-256 `330ff7568672105be2efb0b2e50b5d29866e720e0525989dcaba0bee15136b9f`. Neither is the audited baseline |
| Concurrent audit | PR #80 was an unmerged, active Claude audit when discovered. It was not used as the application baseline or as evidence of another auditor's conclusions |

Source commit, generated build, deployed bytes, test commit and measured build are deliberately separate identities. Their equivalence above was checked, not assumed. The earlier full visual run is **existing CI evidence independently re-evaluated**, not a newly executed full render in this session. A fresh multi-hour full visual/self-test/contrast browser run was not repeated here because byte-identical application and check code already had complete inspectable artifacts. Local investigations and new negative controls are separately identified.

The local environment used Node 24.22.1, Python 3, Playwright 1.56.0 and its Chromium 141.0.7390.37 on Linux, with SwiftShader. CI uses Node 22 and the same pinned Chromium/Playwright. Local software-rendering times are not substituted for the owner's hardware performance.

All supporting paths below are relative to `docs/final-audit-chatgpt-evidence/` unless a repository path is written explicitly. The evidence package retains the report, scripts, raw diagnostic outputs, CI artifacts and selected rendered evidence.

## C. Subsystem inventory and coverage matrix

The inventory covers the whole product, including pre-Stage-8 systems. Static review was targeted by subsystem and failure mode, rather than a claim that every line was independently re-proved. The instruction file, current roadmap/decision records, relevant earlier audit sections, source notes, current carried checklist, test definitions and raw evidence were consulted. Earlier prose was reconciled only after independent build, data, rendering and evidence checks.

| Area / implementation | Methods and evidence | Result | Limits / untested portions |
|---|---|---|---|
| Historical dataset, hierarchy, strengths: `data.js`, `analysis.js`, `narrative.js` | Nine-suite run; independent inventory and model sweep; primary-page samples; source ledger below | Structural and hierarchy checks pass; narrative verification incomplete | No independent re-reading of every commander, strength, regiment or statement |
| Chronology, interpolation, arrivals, combat relationships: `app.js` model helpers | `check:chronology`; 3,410-clock property sweep; forward/reverse queries; exact-boundary samples; simulation/event and arrow-binding suites | No new state-dependent positional result or numerical failure; four known conflicts remain | Model consistency is not historical corroboration; movement paths/rates are often conventions |
| Scale, orientation, relief and hydrology: `geo.js`, `world.js` | Geography/terrain suites, coordinate inverse checks, current data guard, period-map sample, carried-question review | Frame inverse exact for tested GT points; current corrections preserved | Later maps cannot settle 1805 channels/roads/planting; inherited reverse stream gradients remain disclosed |
| Figures, standards, gait, culling: `appearance.js`, `app.js` | Current contact diagnostic, actual rendered sequence, raw CI culling and self-test records, code review | Broad safeguards hold; rare contact errors and symbolic overlaps remain | Sampled contact, not every pose/vertex; no new uniform-source census |
| Terrain, woods, water, buildings | Rendered local stills; current ice probe; castle/garden inspection; full CI views/census | Coherent symbolic landscape; geographic-site changes retained | Low-sun style and landmark hierarchy remain compromises; no photorealism criterion imposed |
| Labels, counters, selection, visibility, knowledge | Static priority review; four 3,600-frame app-loop runs; traced active-play episodes; selected and paper comparisons; CI real-input/twin checks | New long-duration ordinary-counter weakness; protected selection works in measured run | No guarantee for every camera or every device; debug clock skips WebGL only in label measurement |
| Playback, dwell, seeking, speed, Follow, phase transitions, reset/recovery | Local UI Play/Space/modal input; long loop runs at half and 4x; CI slider, pause, dwell, keys and current self-tests | No new core playback defect demonstrated | End/rest must be separated from active playback; no single full-reset feature was assumed; full reload is the clean initialization path |
| First use, narrative, modes, Plans | Actual first screens, six main local views, opening/tour CI captures and checks, source visibility inspection | Guided entry and paper map are strong; hybrid/low views are information-dense | No human usability cohort, comprehension study or timed learning test |
| Keyboard, touch, reflow, contrast, reduced motion | Current CI contrast logs: 6,926 elements/45 states; raw focus/ring/phone blocks; local actual Chromium taps and rotation | Automated checks and sampled interactions pass | Emulation is not Safari, a physical phone, actual browser zoom at all levels, or a screen-reader session |
| Performance, startup, frame pacing | All 349 device rows, embedded JSON, formatting/settings, percentages, brackets, L3 comparison; local boot observation only | Device claims reconcile; accepted CPU/phone excesses remain | No integrated GPU; no phone GPU timing; no temperature/throttle record; no reliable attribution of added CPU to a specific feature |
| Robustness, lifecycle, dependencies, DOM boundaries | Current CI eight boot/context cases; four same-state navigation/resource cycles; DOM/source review; registry audit | No new exploitable input path or resource-growth result in tested scope | No multi-hour soak, adverse network matrix, all browser/graphics combinations or independent license/legal audit |
| Build, tests, records, maintainability | Fresh source build and nine suites; report mutations; diagnostic negative control; source/check diffs; overview-doc comparison | Strong reproducibility; one diagnostic defect and documentation drift confirmed | Old acceptance thresholds encode chosen stability, not an independently optimal user experience |

## D. Test and experiment ledger

| ID | Command / method | Execution and outcome | Evidence |
|---|---|---|---|
| T01 | `npm install --ignore-scripts`; `npx playwright install chromium` | Local setup succeeded. Initial CDN mirror downloads returned invalid ZIPs; fallback mirror installed the pinned browser. These were setup/download failures, not app failures | Version information above; setup note in evidence README |
| T02 | `AUSTERLITZ_SUITE_OUT=... npm test` | **Run locally.** All nine suites plus height guard pass; full passing output preserved | `npm-test.log`, `suites/` |
| T03 | `npm run check:baseline` | **Run locally.** Exact current MD5 and 2,810,630 bytes; source regeneration matches committed file | `baseline.log` |
| T04 | `npm run check:data` | **Run locally.** All 139 guarded declarations match `archive/stage8k-f10fe585.html`; no render/interface declaration change | `data.log` |
| T05 | `npm run check:chronology` | **Run locally.** Zero new errors; four named conflicts; movement audit zero findings | `chronology.log` |
| T06 | `node .../model-audit.js` | **New local diagnostic.** 32 tracked formations, 3,410 clocks, 108,874 finite position checks, 6,820 nonnegative finite strength checks; reverse-query results identical; GT round-trip inverse exact | `model-audit.js/.json/.log` |
| T07 | `node .../device-audit.js` | **New local diagnostic.** Regenerates each full report from JSON and compares it word-for-word after outer trimming; embedded JSON identical; 165 desktop +184 phone rows; build and visible-page status match; percentages/percentile ordering/bracket verdicts reconcile | `device-audit.js/.json/.log` |
| T08 | `node tools/step6/phone-rule.js phone-R1.json phone-R2.json` | **Run locally.** Real reports stand; rule 4: nothing is built | `phone-rule.log` |
| T09 | Phone-rule negative control in `model-audit.js` | **New local experiment.** Two empty reports incorrectly stand and recommend figShadow; exit 0. Temporary files isolated and removed | `model-audit.json` |
| T10 | `node tools/visual/check-report.js .../ci-full/report.json` | **Run locally on downloaded CI evidence.** Current judge passes all 39 cases, 317 self-tests and every live block; zero logged console messages | `ci-full-check-report.log`, `ci-full/`, `ci-summary.json` |
| T11 | Same command on `ci-pr78/report.json` | **Run locally on downloaded CI evidence.** Self-test-only report passes, 317/317 | `ci-pr78-check-report.log`, `ci-pr78/report.json` |
| T12 | `mutate-8l.js` with the two-case report and both recorded motion reports | **Run locally.** Unmodified controls pass; every one of 15 deliberate report mutations caught. An initial invocation without required filenames failed with a CLI argument error and was preserved before the correct invocation | `mutations.json/.log`; initial error `mutate-8l.log` |
| T13 | Five independent mutations of current full report: missing case, no cases, missing self-test check, console error, missing live motion | **New local experiment.** All five detected by current `judgeReport`; no app mutated | `report-negative-controls.json` |
| T14 | `browser-audit.js` and its recorded resume | **Run locally.** Actual Chromium Play/Space/source-sheet input, desktop views, phone-emulated taps/rotation; sources close with focus returned; rotation has no document-width overflow | `browser-audit.json`, `.log`, `browser-resume.log`, local JPG/PNG captures |
| T15 | `extended-playback.js` | **Run locally.** Four 120-second/3,600-frame app-loop runs: hybrid half/4x, paper half, selected hybrid half. Per-formation visibility and priority results retained | `extended-playback.json/.log` |
| T16 | `trace-and-visual.js` | **Run locally.** Adds playing/clock stamps to snapshots; confirms uninterrupted active-play disappearance; captures current troops/artillery/castle/garden and a 12-frame actually rendered sequence | `trace-and-visual.json/.log`, `motion-frames/`, `infantry-motion.mp4/.gif`, `motion-filmstrip.jpg` |
| T17 | Four repeated seven-phase navigation cycles back to the same state, render, request GC, inspect resource counts | **Run locally.** After warm-up, all four cycles: 637 geometries, 37 textures, 35 programs and 1,410 DOM elements; coarse heap reading unchanged at 109 MB | `trace-and-visual.json` memory |
| T18 | `contact-8f.js --before current.html --after current.html --no-stills --out ...` | **Run locally.** Both sides identify current hash; inherited residual remains. Same-build comparison is diagnostic, not evidence of a repair | `contact-current/contact.json`, `contact-current.log` |
| T19 | `ice-8h.js --html current.html --clear 0.20 --out ... --tag audit` | **Run locally.** Identical-value temporary copy of current build; three views/three clocks plus current stills. Low 15:00 proxy 5.90%, versus the old build/browser's 43.5% | `ice-current/`, `ice-current.log` |
| T20 | `npm audit --json` | **Run locally.** Registry returned zero known dependency advisories for this installed tree. This is not a proof that all code is secure | `npm-audit.json` |
| T21 | Actual source images and current deployment retrieved | **Run locally / web retrieval.** Three primary-text pages inspected; one stored period-map tile/composite inspected (fresh MZA fetch returned HTTP 403); official château park history read; direct deployment hashes match | `sources/`, `deployed-build.json` |
| T22 | Current-head CI contrast and boot logs | **Existing CI, independently read.** All 45 states reached, 0 below AA, 0 below 10.5 px, 0 font failures, 8/8 boot/context cases pass | `contrast-ci.log`, `main_jobs.json` |

Two audit-driver corrections are intentionally visible. The first desktop probe was interrupted after its captures because the audit script attempted a hidden Sources button in Watch; the resumed script switched to Study and used the correct modal ID. This was a diagnostic setup mistake, not an application defect. A short initial Play sample remained in the opening dwell, so its label was corrected to “enters playing state”; it is not used as proof of clock advancement. Longer app-loop runs and existing CI provide that evidence.

No skipped or unavailable area is counted as passed. Local timing cannot settle owner-device regression claims. The downloaded visual evidence is complete, but it is still evidence produced by the repository's harness and is judged with that harness's own definitions; independent tests below expose what those definitions miss.

## E. Historical and source verification ledger

The package includes [the 704-row coverage ledger](final-audit-chatgpt-evidence/narrative-coverage.csv), [the sampled source ledger](final-audit-chatgpt-evidence/historical-source-ledger.csv) and [the unresolved-question ledger](final-audit-chatgpt-evidence/unresolved-questions.csv).

This is **sampled verification**, not an exhaustive historical certification. A faithful quotation establishes what a source says, not that its account is correct. Modern institutional pages are useful for their own monuments but do not become contemporary evidence for the battle.

| Claim / coverage | Material actually checked | Conclusion and boundary |
|---|---|---|
| Rapp's counter-charge timing dispute | Fresh image of Rapp 1823, p.60, archive leaf n79; separately the ETH e-rara record and OCR of another copy | The memoir places the ensuing centre action after a 13:00 statement. This supports retaining the discrepancy with the map's 11:15 chronology; it does not establish the memoir as the definitive clock. Same text has different pagination in the ETH copy |
| Allied columns ordered off at seven | Fresh Materialien 1806 p.106, leaf n115 | The disposition explicitly orders all five columns to move at 07:00. This supports the order, not the claim that all five actually did so together |
| Thiébault's ice account and 24 Guard guns | Fresh Thiébault vol.III p.466, leaf n477 | The page supports attributing the 24-gun claim and the memoir's mass-drowning account to Thiébault. It does not corroborate the number drowned |
| Three bodies / drained pond figures | `SOURCE_NOTE.refs` and registered Sokolov attribution | The map correctly says the French report was not directly read. This audit did not independently retrieve Suchet's original report; these numbers remain an attributed secondary chain |
| Sokolnitz enclosure and castle/brook relationship | Actual 1825 sketch material in the stored source composite; stored raw MZA tile verified against its original recorded SHA-256; a fresh fetch returned HTTP 403 | The sketch supports a northern pheasantry and the castle/brook relationship in 1825. The red “as drawn” overlays in the old 8H composite show the pre-correction map, not current main. It cannot alone settle the channels/walls in 1805 |
| Austerlitz garden planting | Current official château history, plus current `GARDENS`/scope | Official history records a nineteenth-century landscape conversion and a twentieth-century restoration drawing on an eighteenth-century design. Modern appearance is not proof of 1805 planting. The current row/spacing convention remains correctly qualified |
| Coordinate frame | Independent GT toMap/toGeo inverse sweep; geography suite | Round-trip mathematics is correct for checked points. It does not independently validate all source coordinates, heights or period-feature positions |
| Hierarchy and strength accounting | Current regression suites and independent finite/nonnegative strength sweep | Structural checks pass; existing tests explicitly distinguish tracked parent/detachment accounting from naive summation. Working strengths are not independently corroborated by this audit |
| 704-statement narrative | Recomputed inventory | 481 unchecked; 223 have a specific or class claim. The 75 class entries are interpretation labels, not 75 independently sourced historical facts |
| Four chronology conflicts | Current chronology checker and targeted source sample | Still named and disclosed: bag@6, guard_cav@6, kamensky@3, kamensky@4. They are not erased by the passing check |
| Uniforms, standards and artillery provenance | `appearance.js` claims/scope and rendered class-level models; data/appearance tests | Claim structure and scope are maintained. This audit did not re-read every appearance source or certify every uniform/flag/gun detail |
| Remaining unchecked territory | Full remaining narrative, all strength alternatives, all original battle accounts, every movement/facing, First Military Survey, Duffy/Smith publications | Explicitly **not independently verified** here; no unsupported resolution or new coordinate is supplied |

External sources used in this audit:

- Rapp scan: [Internet Archive, leaf n79](https://archive.org/download/mmoiresdugnralr00rappgoog/page/n79_w1600.jpg); independent catalogue/copy: [ETH e-rara](https://www.e-rara.ch/zut/content/titleinfo/20809061).
- [Materialien 1806, leaf n115](https://archive.org/download/10807964bsb/page/n115.jpg).
- [Thiébault, leaf n477](https://archive.org/download/mmoires03thieuoft/page/n477_w1600.jpg).
- [Official Slavkov château park history](https://www.zamek-slavkov.cz/o-zamku/park-a-sochy/).
- MZA source URL, failed fresh-fetch result, stored tile hash and original provenance are retained in `sources/sokolnitz-1825-refetch.json`.

## F. Mandatory carried-issue disposition

| Carried item | Current audit disposition | Work justified now? |
|---|---|---|
| 248 jumps /998 pops, decision 267(a) | Settled thresholds retained. Existing full visual motion block passes; raw evidence and mutation detection rechecked | No renewed decision; long visibility requires an additional quality measure, not changing the accepted counts |
| 4,033 ms hidden interval and dropped counters at rest | The original short-run limitation is preserved in its evidence. New long run establishes a much larger active-play episode. The 4x 82.5-second maximum includes the engine having reached 18:00 and resting; it is **not** reported as 82.5 seconds of ongoing battle playback | Yes, CG-F01; separate motion from rest and per-item priority |
| Extended visibility | Four 3,600-frame sequences, per-item ledgers; active-play trace; selected and paper comparisons | Yes, targeted counter work |
| Ground contact, 265(a) | Reproduced on current build; original universal criterion not met; mostly small default errors with close-view outliers | Bounded optional work, CG-F04; no automatic budget increase |
| Low-sun ice, 264(a) | Current low-angle capture inspected and original probe rerun; bright appearance remains. Numerical result differs across build/browser; no causal resolution claimed | No required change; CG-F10 |
| Uniform facings, 245(a) | These are **uniform facing colours**, not formation headings. They remain intentionally omitted. Main models can now be judged; wide-view identity is carried by names, counters and side cues | Recommend retaining 245(a). Class-level French facings may be optional close-view polish after a separate sourced decision; no invented regimental colours |
| Formation orientation | Separately inspected: march direction, fallback nearest-enemy facing at a deterministic clock, seek/pause rules | A visual convention, not a historical orientation database; no new defect demonstrated |
| Artillery drivers and moving gunners | Limbered moving view inspected. Driver inference is scoped to the supported IV Corps context; accompanying crew and compressed motion remain schematic | Keep scope visible; no unsupported historical claim or realistic transport simulation added |
| Sokolnitz castle size, relative houses and III Column overlap | Correct site preserved; small castle and overlap/fog can obstruct identification. The exact carried multi-hour interval was not independently re-swept minute by minute | Presentation cue worth prototyping, CG-F05; do not move the castle |
| Garden visibility | Rows visible in current close view; Overview hierarchy and no paper-map garden sign remain limitations | Optional cue, no geographic relocation |
| Satschan farmsteads | Five of seven, accepted under 261(a), remains the recorded convention; no unsupported footprint expansion | No work required |
| Omitted landmarks | St Anthony's chapel, Santon chapel and Sokolnitz granary remain explicitly `BUILDINGS.notDrawn`; names/roles need not imply a rendered building | No false completion claim; future evidence-led addition only |
| Littawa in Plans | Accepted thirteenth drop; river geometry remains; keyboard/focus route is covered by current checks | No broad label rewrite just for this tertiary name |
| Highway/post location; Goldbach channels; castle walls/marsh; garden planting | Current data and 8J/8K qualifications retained; later maps do not resolve 1805 | Research queue, CG-F03 |
| Bagration dawn/late place; Schönhals height side; Krug | Still open; no replacement coordinates established | Research queue, CG-F03 |
| Kienmayer/Langeron offsets; Caffarelli/Bagration separation; other SOURCE_NOTE questions | Still carried. Neither byte invariance nor smooth interpolation resolves their historical plausibility | Keep named; correct only with evidence |
| Accepted CPU excess | Recomputed against L3; acceptance intact | Optional attribution, CG-F07 |
| Warmed phone and effects/culling/gait brackets | Recomputed; no-op controls distinguished; no animation-zero-cost claim or temperature assertion | Accepted limitation, CG-F06 |

## G. Performance interpretation

The report formatter reproduces every printed table, header, setting and bracket verdict from its JSON. Each embedded JSON object equals the separate JSON file. Build identities and visible-page status match. Long percentages reconcile with long/frame counts, and recorded percentile ordering is internally consistent. **Individual frame-interval arrays were not saved**, so their raw percentile estimates and fps cannot be independently reconstructed frame by frame. The evidence is strong for what the route recorded, not a laboratory-complete trace.

The route counts an interval as long when it is **strictly greater than `max(1.5 × measured idle refresh interval, 25 ms)`**. The desktop cutoff is 25 ms; the phone's is 25.5 ms. A desktop interval of 13.9 ms misses a 144 Hz refresh yet is not “long” under this definition. Long-frame share therefore must not be called dropped-frame percentage. Medians here are medians **of recorded blocks**, not pooled per-frame medians.

| Measured workload | Result | Interpretation |
|---|---|---|
| Desktop half-speed Play | D1/D2 120.8/120.2 fps, js50 7.6 ms vs L3 6.1 ms; p95 interval 13.9 ms | Accepted CPU allowance exceeded. Consistent with high-refresh CPU pressure; no subsystem attribution proven |
| Desktop 4x Play | 124.3/123.0 fps; js50 6.9/7.0 ms | Geometry budgets hold; not a guarantee for weaker or integrated GPUs |
| Phone warmed Overview A blocks | Median40.8 fps; median long 18.15%; 24/24 blocks above 5% long | Real accepted fluidity limit; one run contains transient much slower blocks |
| Phone warmed Play A blocks | Median43.35 fps; median long 8.6%; 24/24 above 5% | Accepted fluidity limit; figures-hidden reference improves Play substantially |
| Phone low Pratzen baseline | Approximately60 fps | Broad claims that every phone view is slow would be false |
| Phone culling bracket | 7 comparisons favor culling, 0 against, remainder neither; fewer calls/triangles | Useful evidence of benefit, but formal all-agree rule still says not shown |
| Phone effects bracket | 4 favor effects-on, none favor effects-off, remainder neither;5/14 off blocks slower | Effects-off is not a demonstrated fix. Temperature or thermal throttling was not measured |
| Gait bracket | Formal result not shown; rounded p50 does not separate sides | Inconclusive at this route's resolution; not zero animation cost |

The older desktop comparison is reasonably informative because hardware and route match, but L3 is not Stage 8's exact starting build. The phone's P5 comparison is across different routes; P3/P4 are closer-protocol proxies with different baseline configurations. Neither supplies a controlled Stage 8 phone regression estimate. The accepted decisions require no repeat now.

Cold network loads in supplied reports took several seconds, with about 1.22 MB transferred compressed; cached loads were faster. Local SwiftShader startup and screenshot latency are excluded from owner-device conclusions. The short lifecycle diagnostic found no growth after warm-up, but four cycles and a privacy-coarsened heap number do not establish a leak-free multi-hour session.

## H. Robustness, security, dependencies and maintainability

The product has one external runtime dependency: three.js r128 from cdnjs with integrity and CORS attributes. Fonts and textures are embedded. “One HTML” is an accurate distribution description; **offline independence from the CDN is not established** unless that dependency is separately provided/cached. The startup guard handles unavailable three.js, integrity failure, unsupported WebGL, interrupted initialization and slow startup. Current CI's context-loss/depth/gait cases pass. Restoration includes a bounded set of known WebGL deletion warnings; it is not silently called warning-free.

DOM insertion is widespread but the reviewed paths use repository-owned data and escaping. URL-controlled runtime flags are not a demonstrated untrusted-HTML input path. No reachable injection exploit was established. The registry audit reports no known advisories for the installed dependency tree. Neither of those statements is an assurance against all vulnerabilities. No security finding is manufactured solely because `innerHTML`, an old library version or a CDN appears in the code.

Embedded font provenance/licence notices are present, and textures are documented as CC0. Third-party licensing and ownership were inspected at a practical distribution level, not legally certified. Choosing a public licence for original project code would be a separate distribution choice if needed; the audit does not infer one or make it a sharing blocker.

The source is large but organized around useful boundaries: data/claims, geographic authority, world generation, symbols, application state and build composition. Roughly the final third of `app.js` is diagnostic/self-test work; a raw line-count target would be misleading. Generated helper extraction and extensive shared globals make changes sensitive, but current regeneration/data guards provide concrete protection. Preserve the working architecture. For future multi-battle work, extract only boundaries with demonstrated repeated needs, using the current self-tests as the contract. No framework migration or rewrite is justified by these findings.

## I. Quality assessment

No numerical score is used: source completeness, subjective aesthetics and hardware coverage would make a single precise score misleading. “Strong” means supported by broad passing evidence; “qualified” means useful with a material named boundary; “incomplete” means the audit cannot justify a general assurance.

| Dimension | Assessment / confidence | What would materially improve it |
|---|---|---|
| Historical integrity | **Qualified; moderate confidence.** Disagreements and conventions are unusually explicit, but the unchecked corpus and working strengths prevent comprehensive verification | Triage prominent claims and close source chains; keep unresolved alternatives visible |
| Geography | **Qualified; moderate confidence.** Single scale authority, corrected sites and guarded transforms; 1805 reconstruction still partly rests on later evidence | Resolve high-impact period-map questions before further coordinate changes |
| Correctness/state | **Strong in tested scope; high confidence.** Broad suites, property checks, deterministic reverse navigation and current browser evidence | Extend duration/combination coverage where independent probes find new behavior |
| Visual quality | **Coherent symbolic reconstruction; moderate confidence.** Landscape conveys ground, paper map is readable, troops/artillery are recognizable as symbols | Improve landmark hierarchy and counter continuity; optional close-view contact/facings polish |
| Usability | **Useful but uneven; moderate confidence.** Guided opening, dossiers, timeline, Study/Watch/Clean and paper map offer clear routes; low/hybrid views are dense | Reduce long losses of ordinary identifiers; test first-time comprehension with actual users if productization warrants it |
| Accessibility | **Strong automated foundation; incomplete AT assurance.** Current contrast/keyboard/phone blocks pass, real sampled focus behaves correctly | Record actual assistive-technology journeys; test browser zoom/reflow beyond the current fixture matrix |
| Performance | **Acceptable by owner decision, qualified by device.** RTX desktop strong; warmed phone 40-43 fps in heavy views; low view near 60 | Focused attribution and measured changes, with identical protocols when evaluating a proposed optimization |
| Robustness | **Strong in existing failure cases; moderate confidence.** Startup/context tests and short resource cycles pass | Target actual observed failures, then longer soak/device coverage if operational use justifies it |
| Maintainability | **Workable and heavily guarded; moderate-high confidence.** No need to rewrite; current overview docs lag | Repair diagnostic missingness validation and operational records; retain small, source-backed changes |

## J. Prioritized follow-up roadmap

Effort ranges are estimates for an engineer familiar with this code, not promises. Research time is especially uncertain. Proposed work does not authorize application changes within this audit.

| Package | Objective, scope and linked findings | Dependencies / risk / effort | Completion criteria |
|---|---|---|---|
| W1: close the evidence-tool gap and update the quick start | Reject incomplete phone reports; add meaningful negative controls; correct current counts/reference/byte log. **CG-F08/09**. No application, data, threshold or acceptance changes | None; low risk; about 0.5-1.5 days | Missing/duplicate/invalid blocks reject; real R1/R2 verdict unchanged; generated HTML/hash unchanged; current instructions match actual commands |
| W2: sustained counter identification | Prototype ordinary-label retention/prioritization, then implement only a measured improvement. **CG-F01**. No troop/site relocation, no removal of selection protection | Start with the extended diagnostic; medium risk across layouts;3-8 days | Per-item active-play/rest exposure improves over baseline; selected/focused/hovered/family items preserved; all existing checks retained; any unavoidable tradeoff presented with measured alternatives |
| W3: focused historical closure | Source the opening/tour/central explanatory claims and consequential strengths first; investigate the highest-impact dependent track questions. **CG-F02/03**. Small evidence clusters, separate approved data tasks | Source access; medium data risk;1-3 research days per tractable cluster, larger total unknown | Every changed claim tied to actual material; alternatives and unsupported precision qualified; no data edits justified by visual convenience; full dependent checks pass |
| W4: landmark comprehension | Give the castle/garden an appropriate presentation cue and test legibility among troops/fog. **CG-F05**. Keep current sites, scale decision and accepted farmstead/landmark omissions | W2 may affect label-room choices; low-medium risk;1-3 days | Castle and garden roles identifiable in representative views without moving geography, covering key formations, or exceeding budgets |
| W5: targeted performance investigation, only if worthwhile | Attribute desktop Play CPU and phone figure/standard workload; implement only a demonstrated improvement. **CG-F06/07**. Avoid automatic effects-off, generic LOD cuts or a rewrite | Accepted performance remains usable; medium risk;1-3 days investigation, then scoped implementation | Controlled same-route comparisons for a proposed change; fidelity, visibility and resource safeguards retained; no generalized integrated-GPU claim |
| Optional finishing work | Near-only ground contact, restrained ice tuning, supported class-level uniform facings, future sourced landmark additions, AT result record. **CG-F04/10/11** and carried ledger | No prerequisite for this audit; variable risk; see individual findings | Real user-visible benefit demonstrated, sources/budgets respected, no repair that damages higher priorities |

**Before calling the map finished:** address the sustained identification problem or clearly define and accept its product boundary; harden the diagnostic before future measurement decisions; and finish a high-impact historical claim pass before claiming comprehensive historical verification. None prevents sharing the current qualified reconstruction.

**Valuable quick fixes:** W1. **Medium changes:** W2 and W4. **Larger work justified by evidence:** W3 in research batches and W5 only after attribution. **Optional polish:** close-view contact/facings, ice and garden symbols. **Accepted limitations requiring no further work now:** the settled motion ceilings, accepted desktop/phone excesses, the unmeasured integrated GPU explicitly disclosed, five Satschan farmsteads, qualified symbolic scales, deliberately omitted unsourced details, and unresolved historical questions kept honestly unresolved.

## K. Combining the three audits

The stable register uses `CG-F01` through `CG-F11`. `findings.json` carries the machine-readable details; `merge-ledger.csv` leaves columns for the Claude finding ID, owner's finding ID, agreement/disagreement and decisive evidence. Those columns are blank/pending because their final audits were not supplied. PR #80's existence is not a result to copy.

Use one combined issue per underlying cause, not one per auditor or screenshot. Keep two layers when combining: whether the observation is confirmed, and whether the proposed remedy is justified. An agreement that a counter disappears is not agreement on a label-layout rewrite. A disagreement about severity can coexist with identical measured data. Resolve differing measurements by matching build, browser, viewport, view, selection, playback state, protocol and metric definition first.

| Earlier record | Current reconciliation |
|---|---|
| Prior H-1 timing disclosure | The current checker still names conflicts; current event/source qualifications and the primary sample mean the old assertion of silently settled timing cannot simply be carried unchanged. Historical conflicts themselves remain CG-F03 |
| Prior H-3 derived marks | Current local rendered views display derived tags; raw CI tests positive and absent derived readings. No new missing-derived-mark defect demonstrated |
| Prior H-5/H-6 sourcing | Per-statement/class claim structure and dossier source access now exist. Remaining coverage gap is CG-F02, not the old claim that no claim system exists |
| Prior S-1 knowledge leaks | Current runtime guards and self-tests cover readings, including aggregate/dossier paths. No new leak demonstrated; this is tested coverage, not universal proof |
| Prior startup, modal, hidden-focus, shortcut and console-check majors | Current boot, focus, inert, keys and contrast records provide substantive closure evidence; five new report mutations also show missing evidence/errors are detected |
| Stage 8 short label benchmark | The accepted benchmark still passes. CG-F01 adds long-duration exposure evidence and does not reopen decision 267(a) |
| Device closure | Raw reports and calculations reconcile. CG-F06/07 preserve accepted limits and do not turn acceptance into a full technical pass |

This is targeted reconciliation of material earlier findings and the complete current carried checklist, not a claim that all 75 findings in the old Stage 7 audit were independently re-rated one by one.

## L. Owner decisions

**No owner answer is needed to complete this audit. No settled decision is resubmitted.** Routine validation, documentation repair and diagnostic hardening should not become owner questions.

The substantive future product choice is how to close ordinary counter visibility if the measured prototypes cannot preserve every current safeguard. The options would be: accept the current behavior with clearer guidance to select a formation/use Paper map; adopt a bounded measured layout improvement; or invest in a broader information-hierarchy change. **Recommendation:** try the bounded measured improvement first, W2, and present actual comparable results before asking for a tradeoff. Its consequences are then concrete rather than speculative.

For ground contact, ice and uniform facings, retain the current decisions unless a focused optional prototype demonstrates a worthwhile improvement. For uncertain history, “still unresolved” is an acceptable evidence-led outcome. It is preferable to a visually convenient invention.

## M. Detailed findings register

Severity rubric: **S1 critical** would block ordinary use or materially misrepresent a central fact with strong evidence; none established here. **S2 major** materially affects comprehension/correctness or limits a broad assurance. **S3 minor** affects localized quality, records or optional finish. A potential-impact rating does not imply a confirmed failure. Priority is separate: **P1** is the next closure work, **P2** worthwhile scoped follow-up, **P3** optional/low-risk cleanup. Accepted limitations may carry S2 impact while requiring no work now.

The detailed register below is generated from the accompanying `findings.json`. Each item identifies status, origin, evidence, reproduction, cause confidence, smallest remedy, validation and estimated effort.

### CG-F01: Ordinary hybrid counters can remain hidden for a substantial part of the battle

**S2 major · P1**. Status: confirmed. Classification: inherited issue; extended beyond the existing short benchmark.

**Subsystem:** map label placement and playback

**User impact:** A visitor following the overall battle can lose an important formation's identity while the formation remains eligible for placement. Selection and the paper map provide effective workarounds.

**Reproduction:** Run extended-playback.js and trace-and-visual.js from the repository root. The hybrid Field view is 1600 x 900, Study, 4x relief, omniscient, no selection. Seek to 09:00 and play at half speed for 3600 frames on the driver's 30 Hz clock.

**Expected:** The default presentation should allow a visitor to keep identifying important formations through sustained playback. The current short benchmark is expected to remain reproducible; it is not an adequate long-duration visibility requirement.

**Observed:** The French Guard cavalry counter is placement-hidden for 1099 consecutive active-play frames, 36.633 seconds on the driver's clock, from battle minute 661.833 to 794.833 (about 11:02 to 13:15). Russian Guard cavalry: 28.233 seconds. Miloradovich: 24.633 active-play seconds. In the separate extended selected run, Saint-Hilaire is on in all 3691 samples. Paper-map longest placement-hidden episode is 667 ms. No protected-item hiding was recorded in the four extended runs.

**Cause and confidence:** The symptom and the fixed priority/protected-item mechanism are verified. Retention of higher-priority placements and competition for limited room are consistent with the recorded earlier cause; no isolated mutation in this audit proves which individual placement rule accounts for every long episode.

**Smallest sensible remedy:** Prototype bounded changes to ordinary-item prioritization or retention, judged by per-formation exposure over extended playback. Keep selection, hover, focus and family protection. Do not move historical positions or simply loosen the accepted motion ceilings.

**Meaningful validation:** Repeat the four extended runs; separate active playback from post-end rest, report each formation's visible share and longest placement-hidden episode, and retain all existing 39 views, protected-item checks, real-input comparisons and accepted motion safeguards. Record any necessary tradeoff explicitly.

**Dependencies:** Agree the user-visible outcome after measuring candidate layouts; decision 267(a) remains the current baseline.

**Implementation risk:** medium: changes can move layouts throughout the app

**Approximate effort:** 3-8 engineering days including prototypes and the full visual check

**Code/data references:** `app.js:5092 mlCollect (priority and protected items)`; `app.js:5427 mlLayout (placement and retained positions)`; `tools/visual/motion.js:187 MOTIONS (90-frame Play)`; `docs/STAGE8_SPEC.md sections 22.3, 22.6, 23.4`.

**Supporting evidence:** [extended-playback.json](final-audit-chatgpt-evidence/extended-playback.json), [trace-and-visual.json](final-audit-chatgpt-evidence/trace-and-visual.json), [ci-full/report.json](final-audit-chatgpt-evidence/ci-full/report.json).

### CG-F02: Historical source verification is substantial but incomplete

**S2 major confidence limitation · P1 for prominent claims; P2 for the remaining corpus**. Status: confirmed coverage gap; unchecked claims are not established errors. Classification: inherited, explicitly disclosed scope boundary.

**Subsystem:** historical narrative and order of battle

**User impact:** The map can be shared as a qualified reconstruction, but its entire narrative cannot be described as independently source-verified.

**Reproduction:** Run model-audit.js or node tools/step4/inventory.js --check; inspect the claim counts and the unchecked rows. Trace a statement's ref to its claim and reading rather than treating its presence in check:data as verification.

**Expected:** Claims presented as historically checked should have inspectable claim-specific support; remaining claims should retain a visible and accurate qualification.

**Observed:** The live inventory has 704 statements: 481 unchecked, 75 interpretations by class, 63 attributed, 65 disputed, 6 uncertain, 2 derived and 12 interpretations with their own entries. Working strength figures citing Duffy and Smith remain explicitly described as not read. Fresh primary-page samples support the recorded Rapp timing conflict, the 07:00 order and Thiébault's account, not the truth of every statement around them.

**Cause and confidence:** The sourcing work deliberately covered selected claims and clusters rather than the complete inventory. Test guards hold the registered text and citations current; they cannot supply missing historical research.

**Smallest sensible remedy:** Prioritize the opening, tour, phase ledes, command explanations and consequential strengths in small source batches. Mark unsupported precision honestly. Retain disagreements; do not demand one artificial historical answer.

**Meaningful validation:** For each changed claim, preserve the source page or precise locator, explain what it supports and does not support, update the claim hash, and rerun data and chronology checks through an authorized data task.

**Dependencies:** Access to the relevant publications and primary accounts; some questions may remain unresolved.

**Implementation risk:** medium for data changes, low for an evidence-only ledger

**Approximate effort:** 1-3 research days per focused cluster of roughly 10-20 substantive claims; the full remainder cannot be reliably sized before triage

**Code/data references:** `tools/step4/inventory.js:16 inventory`; `docs/step4-evidence/inventory.md`; `narrative.js STATEMENT_CLAIMS and CLAIM_BY_CLASS`; `data.js:791 SOURCE_NOTE`.

**Supporting evidence:** [model-audit.json](final-audit-chatgpt-evidence/model-audit.json), [sources/fetch-manifest.json](final-audit-chatgpt-evidence/sources/fetch-manifest.json), [sources/rapp-p60.jpg](final-audit-chatgpt-evidence/sources/rapp-p60.jpg), [sources/disposition-p106.jpg](final-audit-chatgpt-evidence/sources/disposition-p106.jpg), [sources/thiebault-p466.jpg](final-audit-chatgpt-evidence/sources/thiebault-p466.jpg).

### CG-F03: Several consequential chronology and location questions remain unresolved

**S2 potential historical impact · P2; escalate only when contrary evidence establishes an error**. Status: unresolved historical questions, not newly proven geographic defects. Classification: inherited and disclosed.

**Subsystem:** chronology, tracks and geography

**User impact:** Precise hours, opposing formations' relative positions and some terrain relationships remain less certain than the smooth animation can suggest.

**Reproduction:** Run check:chronology, inspect bag@6, guard_cav@6, kamensky@3 and kamensky@4, and follow the 8J/8K register entries for dependent anchors and later-map inferences.

**Expected:** Disputed timings and inferred sites should remain qualified wherever their interpretation is consequential. A later map should not silently become an 1805 survey.

**Observed:** The checker reports 66 consistent moves and four named early conflicts among 70 moves with timed statements. Highway/post-house sites in 1805, the Goldbach's two channels north of the castle, walls, marshiness, garden planting, Bagration at dawn and late in the day, Schönhals's height and Krug remain open. The named Kienmayer/Langeron offsets and the 2.5-2.9 km Caffarelli/Bagration separation have not been historically resolved by this audit.

**Cause and confidence:** Sources disagree or do not locate the reconstruction precisely; some dependent tracks retain inherited choreography. The existence of the disagreements is verified, the correct replacement coordinates or times are not.

**Smallest sensible remedy:** Keep a research queue ranked by interpretive impact. Check contextual disclosure at the relevant dossier/event; authorize a narrowly scoped data correction only after better evidence exists.

**Meaningful validation:** A proposed correction must show its sources, uncertainty, affected formations and derived readings, then pass movement, chronology, geography, data and visual checks. Do not resolve this by label placement.

**Dependencies:** Period maps or account comparisons; no owner device run is needed to complete this audit.

**Implementation risk:** high if coordinates are guessed, medium for evidence-led corrections

**Approximate effort:** 1-5 research days per tractable question; some questions may have no recoverable resolution

**Code/data references:** `data.js:799 SOURCE_NOTE.body[5]`; `tools/stage2/chronology.js CONFLICTS`; `docs/STAGE8_SPEC.md sections 21.9 and 22.6`; `docs/stage8-evidence/8j/register.md`; `docs/stage8-evidence/8k/register.md`.

**Supporting evidence:** [chronology.log](final-audit-chatgpt-evidence/chronology.log), [sources/rapp-p60.jpg](final-audit-chatgpt-evidence/sources/rapp-p60.jpg), [sources/sokolnitz-1825-refetch.json](final-audit-chatgpt-evidence/sources/sokolnitz-1825-refetch.json).

### CG-F04: The original universal ground-contact criterion remains unmet

**S3 minor at default view; S2 visual impact in some close exaggerated views · P2 optional bounded improvement**. Status: confirmed sampled residual. Classification: accepted provisionally under decision 265(a).

**Subsystem:** figure gait and terrain seating

**User impact:** Rare close views show a planted foot or hoof above or below its expected resting contact. The effect is larger at the 10.33x relief setting.

**Reproduction:** Run contact-8f.js with both --before and --after pointing to the current HTML, --no-stills and a separate output directory. Both sides should identify f10fe585, demonstrating a same-build diagnostic, not a before/after repair.

**Expected:** The original every-foot-on-ground criterion would allow no residual. The accepted chord model instead has explicit sampled bounds; it is not equivalent to the original criterion.

**Observed:** At 4x, the drawn-sole samples have 25 of 39136 men's poses beyond the tool's 0.03-unit tolerance for each kit; simple/rich worst projected errors are 0.825/4.818 px. Rich horses have 29 of 7704 beyond, worst 3.227 px. At 10.33x, rich drawn-sole worst errors reach 12.089 px for men and 10.357 px for horses. These are differences against each sampled instance's resting seat; they are not exhaustive absolute clearance measurements of every vertex.

**Cause and confidence:** The two-chord approximation and static seating do not reproduce each foot's exact terrain profile. The diagnostic confirms the residual, not an all-pose/all-instance bound.

**Smallest sensible remedy:** Keep the bounded convention for ordinary use. If close-view finish justifies further work, measure a near-only foot-profile solution within the existing animation budget before adopting it.

**Meaningful validation:** Compare the same instances and phases, both kits and factors, recording absolute rest seating separately from gait-induced changes; check animation budget, pauses, seeks, reduced motion and culling.

**Dependencies:** Current decision 265(a); no increase in the animation budget is authorized by this report.

**Implementation risk:** medium

**Approximate effort:** 2-5 engineering days for a measured near-only prototype; no work required if retained as an explicit limitation

**Code/data references:** `app.js ANIM, animAt, animChord, GAIT and layoutFigs`; `tools/stage8/contact-8f.js`; `docs/STAGE8_SPEC.md sections 18.2, 20.10 and 22.6`.

**Supporting evidence:** [contact-current/contact.json](final-audit-chatgpt-evidence/contact-current/contact.json), [contact-current.log](final-audit-chatgpt-evidence/contact-current.log), [infantry-current.jpg](final-audit-chatgpt-evidence/infantry-current.jpg), [motion-filmstrip.jpg](final-audit-chatgpt-evidence/motion-filmstrip.jpg).

### CG-F05: Landmark significance is not consistently communicated at symbolic scale

**S3 minor to S2 educational impact at Sokolnitz · P2**. Status: confirmed visibility/scale compromise; no new site error established. Classification: inherited, partly accepted by decisions 261(a) and 266(a).

**Subsystem:** buildings, gardens and cartographic hierarchy

**User impact:** The castle central to the Sokolnitz narrative can be harder to identify than ordinary houses, especially beneath III Column and fog. The Austerlitz garden is clearer close up than at Overview scale.

**Reproduction:** Inspect the castle at [212.9,344.3] around 08:20 and later; inspect Austerlitz close and at Overview; open Plans at Overview and focus the Littawa name through the map layer.

**Expected:** A visitor should be able to identify the landmark's role while its supported site and the accepted symbolic-scale choices remain intact.

**Observed:** The castle remains about 96 by 73 m as accepted, small relative to the enlarged village houses; the carried III Column overlap remains a meaningful presentation constraint. The garden has tree rows close up but no dedicated paper-map garden sign; the Littawa name is the accepted thirteenth dropped item in Plans. Satschan remains five drawn farmsteads of seven; the three named omitted landmarks remain explicitly notDrawn.

**Cause and confidence:** Multiple symbolic scales compete at geographically constrained sites. Layout competition drops a tertiary river name. The precise 08:00-14:10 overlap interval is inherited evidence, not re-swept minute by minute here.

**Smallest sensible remedy:** Prototype a restrained landmark cue or selected-site outline/callout, with no historical relocation and no unapproved growth of the castle. Consider a garden sign only if it adds comprehension at actual map scale.

**Meaningful validation:** Compare the castle and garden at representative clocks and factors, with formations present; preserve supported sites, existing labels, keyboard reach and visual/performance budgets.

**Dependencies:** Keep decisions 259(a), 261(a), 266(a) and 267(a).

**Implementation risk:** low to medium for presentation-only work

**Approximate effort:** 1-3 engineering days; reconstructing omitted buildings would require a separate evidence task

**Code/data references:** `world.js:162 LANDMARK_SITES`; `world.js:169 GARDENS`; `world.js:1812 castlePlan8g`; `appearance.js BUILDINGS.sokolnitz and BUILDINGS.austerlitz`; `docs/STAGE8_SPEC.md sections 21.7, 22.2, 22.4 and 22.6`.

**Supporting evidence:** [castle-current.jpg](final-audit-chatgpt-evidence/castle-current.jpg), [garden-current.jpg](final-audit-chatgpt-evidence/garden-current.jpg), [plans-overview.jpg](final-audit-chatgpt-evidence/plans-overview.jpg), [ci-full/plans-overview.png](final-audit-chatgpt-evidence/ci-full/plans-overview.png).

### CG-F06: Warmed phone Overview and Play do not sustain 60 fps

**S2 performance limitation · P2 accepted improvement opportunity**. Status: confirmed in owner-device reports. Classification: accepted under decision 269(a).

**Subsystem:** phone rendering and frame pacing

**User impact:** Longer phone sessions can feel less fluid in Overview and Play even though geometry budgets pass. Low Pratzen remains substantially smoother in the recorded route.

**Reproduction:** Recalculate the two reports' 24 baseline A blocks per kind with device-audit.js. No new owner run is required.

**Expected:** Distinguish the accepted measured result from an unconditional smooth-60-fps claim or a controlled pre/post regression.

**Observed:** Median block fps is 40.8 Overview and 43.35 Play; median block long-frame shares are 18.15% and 8.6%. Every A block is above 5% long. The low view's baseline is approximately 60 fps. Figure-hidden Play is approximately 59 fps. Frame-weighted long shares differ from median block percentages (24.61% and 8.78%).

**Cause and confidence:** Hiding figures and standards improves Play, implicating their combined workload. The evidence does not isolate animation, GPU fill, geometry, JavaScript or temperature. Four ordinary phone candidates are effective no-ops on current lowTier; gait's bracket is inconclusive, and effects-off is not a demonstrated cure.

**Smallest sensible remedy:** Retain acceptance. If optimizing, profile a focused change to the measured figure/standard workload, preserving source fidelity and the current lowTier settings; do not request the rejected repeat ordinary route as a prerequisite.

**Meaningful validation:** Use matching build identities and protocols for a future optimization; retain raw per-block data, visibility and actual interventions. A software renderer cannot supply owner-device timing.

**Dependencies:** Decision 269(a) is settled. The P5 route is unlike R1/R2; an integrated GPU remains unmeasured.

**Implementation risk:** medium

**Approximate effort:** 1-3 days attribution, then 2-5 days for a justified targeted optimization; accepted limitation needs no work now

**Code/data references:** `docs/stage8-evidence/device/phone-R1.json`; `docs/stage8-evidence/device/phone-R2.json`; `tools/step6/perf-route.js:159 longMs`; `docs/STAGE8_SPEC.md sections 25.1-25.4`.

**Supporting evidence:** [device-audit.json](final-audit-chatgpt-evidence/device-audit.json), [device-audit.log](final-audit-chatgpt-evidence/device-audit.log), [phone-rule.log](final-audit-chatgpt-evidence/phone-rule.log).

### CG-F07: Desktop Play exceeds the prior CPU allowance and misses some 144 Hz refreshes

**S3 minor performance limitation · P2 accepted improvement opportunity**. Status: confirmed report comparison; subsystem attribution unverified. Classification: accepted under decision 268(a).

**Subsystem:** desktop per-frame JavaScript and pacing

**User impact:** The recorded RTX desktop runs Play at approximately 120-124 fps rather than the prior 139-140 fps. This is visible on a high-refresh display despite almost no intervals exceeding the route's long-frame threshold.

**Reproduction:** Compare matching segment ids/kinds with L3. D1/D2 Play-half js50 is 7.6 ms against 6.1 ms; Overview orbit rises by up to 1.1 ms.

**Expected:** Report the accepted excess without relabelling it as a technical pass against the original plus-1-ms CPU line.

**Observed:** Half-speed Play is 120.8/120.2 fps and 4x Play 124.3/123.0. Play p95 intervals are 13.9 ms, about two 144 Hz refresh intervals. Desktop long-frame cutoff is strictly above 25 ms; a 13.9-ms interval is therefore not counted long.

**Cause and confidence:** The js95 work exceeds the 6.9-ms refresh window and is consistent with CPU pressure. These route reports do not attribute the added work to an individual Stage 8 subsystem. L3 is the nearest earlier measured build, not Stage 8's exact starting build.

**Smallest sensible remedy:** Keep acceptance. Profile matching Play/orbit routes before choosing a narrowly scoped optimization; do not remove visual fidelity solely to lower a test number.

**Meaningful validation:** Distinguish CPU attribution from actual device pacing, compare identical settings, and retain current geometry and visibility safeguards.

**Dependencies:** Decision 268(a) is settled; no new owner run is required for this audit.

**Implementation risk:** medium

**Approximate effort:** 1-3 days focused attribution; implementation depends on the measured cause

**Code/data references:** `docs/stage8-evidence/device/desk-D1.json`; `docs/stage8-evidence/device/desk-D2.json`; `docs/step6-evidence/perf-L3-desktop.json`; `docs/STAGE8_SPEC.md section 24`.

**Supporting evidence:** [device-audit.json](final-audit-chatgpt-evidence/device-audit.json), [device-audit.log](final-audit-chatgpt-evidence/device-audit.log).

### CG-F08: The phone intervention rule accepts empty measurement sets

**S2 diagnostic correctness · P1 before using it for future acceptance decisions**. Status: confirmed by isolated negative control. Classification: inherited tool defect; existing complete reports remain valid.

**Subsystem:** performance evidence validation

**User impact:** A malformed or incomplete future report can produce a positive intervention recommendation without any measurement supporting it.

**Reproduction:** Run model-audit.js. It creates two temporary JSON reports with refreshMs 17, notes [] and segments [], runs the existing phone rule, records the result, then removes the temporary files.

**Expected:** Reject absent baseline/candidate blocks, incomplete rounds and invalid numerical measurements with a non-zero result.

**Observed:** Both empty reports are called stands; both kinds are called tested; empty candidate block sets have cures true and gain NaN; exit code is 0 and rule 2 recommends figShadow. The real R1/R2 reports contain their required blocks and still produce rule 4: nothing is built.

**Cause and confidence:** As.length is zero, so 0 >= As.length/2 passes, and Array.every on empty candidate lists is true. The tool has no mandatory block/schema completeness gate.

**Smallest sensible remedy:** Validate the expected kind/candidate/round structure, exact required block counts and finite positive measurements before applying the rule; reject missingness explicitly.

**Meaningful validation:** Require empty reports, one missing A, one missing candidate, a missing round, duplicate blocks, disjoint tested kinds, hidden blocks and non-finite fields to reject; keep R1/R2's real verdict unchanged.

**Dependencies:** No application, historical data or owner acceptance change is needed.

**Implementation risk:** low

**Approximate effort:** 2-6 engineering hours

**Code/data references:** `tools/step6/phone-rule.js:20 run validation`; `tools/step6/phone-rule.js tests/candidate blocks and final tested.every rule`.

**Supporting evidence:** [model-audit.json (negativeControl)](final-audit-chatgpt-evidence/model-audit.json), [model-audit.log](final-audit-chatgpt-evidence/model-audit.log), [phone-rule.log](final-audit-chatgpt-evidence/phone-rule.log).

### CG-F09: Developer-facing records and the build-size log have drifted

**S3 minor · P3 quick fix**. Status: confirmed. Classification: inherited documentation/tool-output defects.

**Subsystem:** build and maintenance documentation

**User impact:** A new contributor can read obsolete test counts, the wrong data reference and understated build bytes despite the authoritative checks being current.

**Reproduction:** Compare README's 242 self-tests, 30 views and archive/step5c reference with the actual 317 checks, 39 views and stage8k reference; compare build.py's printed bytes with the actual file byte length.

**Expected:** Current operational documentation should match package.json and the measured product; a bytes label should report UTF-8 bytes.

**Observed:** README says audit.js continuity/coverage only print, although audit.js now asserts them. Several counts/timing descriptions are old. build.py prints bytes: 2801357 by counting Python characters, while the committed UTF-8 file is 2810630 bytes. The actual baseline guard uses the correct byte count and passes.

**Cause and confidence:** Historical records were kept while overview instructions and a character-counting log were not reconciled.

**Smallest sensible remedy:** Update the current quick-start/check tables and either encode the string for its byte count or label the value characters. Preserve historical audit records as history.

**Meaningful validation:** Check documented commands against package.json and one build; the generated HTML and its hashes must remain unchanged.

**Dependencies:** None.

**Implementation risk:** low

**Approximate effort:** 1-3 engineering hours

**Code/data references:** `README.md Checks table`; `tools/visual/README.md Requirements/Scripts/Timing`; `build.py final print statement`; `package.json current scripts`.

**Supporting evidence:** [baseline.log](final-audit-chatgpt-evidence/baseline.log), [ci-summary.json](final-audit-chatgpt-evidence/ci-summary.json), [ci-full-check-report.log](final-audit-chatgpt-evidence/ci-full-check-report.log).

### CG-F10: Low-sun ice remains a visual compromise; the old glare percentage is not a current measurement

**S3 visual judgement · P3 optional polish**. Status: appearance confirmed; changed probe result; cause of difference unverified. Classification: accepted under decision 264(a).

**Subsystem:** ice material and visual evidence provenance

**User impact:** Oblique low-sun ice can look conspicuously bright. Carrying the old 43.5% number forward without its build and browser would overstate what this audit measured.

**Reproduction:** Run ice-8h.js on current HTML with --clear 0.20 and a separate output directory. This creates an identical-value temporary copy and leaves the app unchanged.

**Expected:** Judge the current appearance visually and tie each numerical proxy to its measured build, renderer and view.

**Observed:** The current Chromium 141 probe reports 5.90% glare15 in its low 15:00 view and 0% raw white samples; the old 43.5% came from e8fed44b and Chromium 153. This is the tool's projected polar-grid luminance ratio in an off-screen render, not a percentage of all visible screen pixels. The bright sheen is still apparent in the current capture.

**Cause and confidence:** The glossy/grazing material terms are present. Both the build and browser differ from the earlier measurement; this audit did not isolate the reason for the numerical change and does not claim the issue was fixed.

**Smallest sensible remedy:** Keep the accepted appearance unless a matched visual comparison shows a useful restrained change without removing the desired sheen. Annotate the old evidence rather than replacing its historical result.

**Meaningful validation:** Use the same build/browser/view and both morning and afternoon comparisons, keeping water outlines and levels unchanged.

**Dependencies:** Decision 264(a) remains settled.

**Implementation risk:** low to medium

**Approximate effort:** 0.5-2 days if pursued; no work required now

**Code/data references:** `world.js ICE and WATER_GLSL`; `tools/stage8/ice-8h.js`; `docs/STAGE8_SPEC.md section 20.10`; `docs/stage8-evidence/8h/ice/ice-8h-clear.json`.

**Supporting evidence:** [ice-current/ice-8h-audit.json](final-audit-chatgpt-evidence/ice-current/ice-8h-audit.json), [ice-current.log](final-audit-chatgpt-evidence/ice-current.log), [ice-current/ice-low-1500-clear0.20.jpg](final-audit-chatgpt-evidence/ice-current/ice-low-1500-clear0.20.jpg).

### CG-F11: Screen-reader acceptance lacks an inspectable current result record

**S2 potential access impact; no failure established · P2 evidence gap**. Status: unverified in actual assistive technology. Classification: inherited acceptance-record limitation.

**Subsystem:** accessibility assurance

**User impact:** The DOM, keyboard and contrast checks support accessibility, but cannot establish what VoiceOver or NVDA actually announces through the present experience.

**Reproduction:** Inspect the screen-reader session record: its 24 result cells remain blank and it explicitly records no versions, speech or item-by-item outcomes. Review the current keyboard/contrast evidence separately.

**Expected:** Any claim of verified assistive-technology behavior should identify the tested browser/reader versions and observed outcomes.

**Observed:** Current CI checks 6926 text elements in 45 states at AA and the 10.5 px floor, 8 boot/context cases pass, and keyboard/focus/reduced-motion blocks pass. The owner accepted the earlier reader session, but the repository contains no reproducible speech/results ledger. This audit had no NVDA or VoiceOver access.

**Cause and confidence:** The acceptance was recorded as an owner declaration rather than a technical result table.

**Smallest sensible remedy:** Keep acceptance intact and describe assurance honestly. When a tester is available, record a focused reader journey and any actual failures; do not invent failures or make another owner-device session a prerequisite for this audit.

**Meaningful validation:** Capture the reader/browser versions, mode, focus, dialog boundary, timeline announcements and selection behavior with actual observed results.

**Dependencies:** An available assistive-technology tester; optional for completing this audit.

**Implementation risk:** low for recording; any repair depends on a reproduced issue

**Approximate effort:** 1-3 hours for a focused recorded session, repairs unknown

**Code/data references:** `docs/step3-evidence/sr-session.md:3 acceptance on owner's word`; `shell.html dialog, region, slider and tab semantics`; `app.js SHEETS, syncInert, focusTo`.

**Supporting evidence:** [contrast-ci.log](final-audit-chatgpt-evidence/contrast-ci.log), [ci-full/report.json](final-audit-chatgpt-evidence/ci-full/report.json), [browser-audit.json](final-audit-chatgpt-evidence/browser-audit.json).

