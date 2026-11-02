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
- **Status** says how the area auditor established the finding (confirmed, inferred, unverified). **Verification** gives the adversarial
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

## A. Executive verdict

**The build.** The audited build is the same bytes everywhere it matters: `43e3e5b`'s source rebuilds it, GitHub Pages serves it, and every
Stage 8 device report names it (2,810,630 bytes, md5 `f10fe585...`, SHA-256 `bf27887c...db07`). Every required check passes on it:
- run here: `npm test` (nine suites and the height guard), `check:baseline`, `check:data` (139 of 139), `check:chronology` (0 errors),
  `check:contrast` (45 states, 8 of 8 start-up cases), `check:selftest` (317 of 317), and `check:report` on CI's visual report;
- on CI's runner, in this audit: `check:visual` (39 cases, 2 h 1 min).

**What is strong.** The project's method is unusually serious, and it holds under adversarial checking:
- *Sourcing.* Its claims are labelled, its disagreements kept and its positions graded. 14 of the 20 most consequential timed claims, and 14
  of 42 force claims, are exactly what their sources print.
- *The model and the code.* The model is continuous and deterministic (766 critical-time checks, a 215,072-sample sweep). Prolonged use grows
  nothing. three.js is pinned and integrity-checked.
- *The picture and access.* The light, atmosphere and palette are coherent through the day. Keyboard paths and dialogs are sound, and
  contrast is AA throughout.
- *Stage 8.* Its work (8A-8L) is implemented as the owner decided. Of this audit's 146 findings, 16 are new in Stage 8 or later,
  3 mixed and 108 inherited from before it.

**What is not yet good enough.** By its own standard (`CLAUDE.md`: historical integrity first) the map is not yet finished:
- **One critical exposure (S1), not in the map itself.** The published device-route page runs any URL given in `?src=` in the site's origin
  (`CL-ROB-01`). It is a fix of hours.
- **Integrity of what is told.** A visitor is told things the sources do not support:
  - figures attributed to Duffy (1977) that he does not print (`CL-SRC-01`, P1);
  - an event labelled Fact against its own text and the sources (`CL-HIS-01`);
  - four events whose disputed hours are unlabelled (`CL-HIS-06`);
  - 44 A position grades carried without a reading of their own (`CL-HIS-02`);
  - the Russian Guard's divided register drawn as one side (`CL-HIS-03`);
  - a relief model 30-80 m off over the ground the battle turns on, while the sources sheet says it is fitted to surveyed elevations
    (`CL-GEO-01`, P1).

  Stage 8's own re-plot puts Legrand through the III Column it fights (`CL-HIS-04`), and formations walk away while marked as attacking
  (`CL-HIS-05`).
- **What the panels say while the clock moves.** The open dossier goes stale within a phase (`CL-SIM-01`). "Whose eyes?" still draws the
  arrows and counts of formations the reading does not know (`CL-SIM-02`). A pan during a glide is undone (`CL-UX-02`). On a phone the event
  markers take most of the time rail (`CL-UX-03`).
- **The map as a map.** In Landscape with counters, five to eight formations go unlabelled for most of Play, up to 28 s at a stretch. The
  benchmark's accepted 4,033 ms is only its window (`CL-MAP-01`). There is no key below 1080 px (`CL-MAP-03`). Figures are sunk into the
  frozen mere (`CL-VIS-01`). The interface does not reflow at 320 px or 400% zoom (`CL-UX-01`).

**The evidence the acceptances rest on.** Decisions 267 (a), 268 (a) and 269 (a) are respected and not reopened:
- *The desktop CPU excess* (268 (a)) is now attributed. It reproduces on one browser at the device's ratio, so it is not the unrecorded
  Chrome update. It comes mostly from three.js re-binding the kit's three Stage 8 attributes on every instanced draw (`CL-PERF-12`).
- *The phone* (269 (a)). Its "after the phone warms" has no temperature evidence behind it (`CL-PERF-01`). Its long-frame share counts
  delivered frames, not missed refreshes: beside 8.6% and 18.15% long, 28-32% of 60 Hz refreshes bring no new frame (`CL-PERF-03`).
- *Not measured.* No integrated-GPU run exists (`CL-PERF-02`). Nothing measured on the RTX desktop speaks for a weaker machine.

**The register.** 146 findings. By severity: S1 1, S2 15, S3 71, S4 59. By kind: 58 confirmed defects, 34 probable problems, 23 optional improvements, 14 accepted compromises, 9 untested areas, 8 unresolved historical questions. Every finding went to a skeptic told to refute it; each S1 and S2
to two, one reproducing and one attacking its premise. Verification: confirmed 114, weakened 29, not re-verified 3. Where a skeptic weakened a finding, its correction is applied,
and the entry shows both the area's claim and the correction. Weakened findings were mostly the severities of map furniture and of the test
gate, and origins.

**Recommendation.** Before calling the map finished, the roadmap (section G) sequences six packages, together about 6-11 working days:
- **WP-00**, the security fix (hours);
- **WP-01**, the claims and words a visitor is told (1-2 days);
- **WP-02**, the force figures traced to what the sources print, starting with the owner's photographs of Duffy's pages (2-3 days);
- **WP-04's disclosure** on the relief (hours);
- **WP-05**, the dossier and the readings (2-4 days);
- **WP-06**, the camera and the rail (1-2 days).

They contain every P1 finding (`CL-ROB-01`, `CL-GEO-01`, `CL-SRC-01`) and most of the S2s. The larger data tasks follow: the tracks and grades (WP-03) and the relief's
refit (WP-04). Then legibility, accessibility and the picture (WP-07 to WP-10), with tests and records alongside. Fourteen owner questions
(270-283, section I) decide what the audit cannot.

**The audit's own limits.**
- No device timing comes from here (software WebGL).
- The phone was Chromium's emulation, not Safari on an iPhone.
- No screen reader was used.
- The source verification is a consequence-chosen sample, not the whole text.
- Three usage-limit interruptions stopped areas mid-way. Each was finished from its saved evidence, and its README says what was redone.

## B. Findings register

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

Where lenses disagreed, the more adverse verdict stands until the auditor resolves it, and the entry says how. The verifiers' reports are in
`docs/audit-post8-evidence/verification/`, one `.md` and one `.json` per batch.

The fields follow the brief: subsystem, user impact, status and origin, expected and observed behaviour, evidence, reproduction, references,
cause (hypothesis, and whether verified), remedy, effort, dependencies, risk of the remedy, validation, prior records and verification. A
field the area did not fill is omitted, never invented.

Counts: 146 findings; by severity S1 1, S2 15, S3 71, S4 59; by kind confirmed defect 58, probable problem 34, optional improvement 23, accepted compromise 14, untested area 9, unresolved historical question 8; by adversarial verification CONFIRMED 114, WEAKENED 29, not re-verified 3.

### B.1 Index (most severe first)

| ID | sev | pri | kind | status | verification | title |
|---|---|---|---|---|---|---|
| [CL-ROB-01](#cl-rob-01) | S1 | P1 | confirmed defect | open | CONFIRMED | The device route's ?src= runs a visitor-supplied URL in the public site's origin (DOM XSS on GitHub Pages) |
| [CL-GEO-01](#cl-geo-01) | S2 | P1 | confirmed defect | confirmed | CONFIRMED | The relief model is 30-80 m too low over the southern Pratzen plateau and the chapel knoll and about 45 m too high at Slapanice, while the visitor is told it is fitted to surveyed elevations |
| [CL-SRC-01](#cl-src-01) | S2 | P1 | confirmed defect | confirmed (on Duffy's OCR text layer, via archive.org full-text search; the lending item's page images cannot be opened here; the same search reproduces exactly the Guard rows that S5.7 read on the owner's photograph) | CONFIRMED | Order-of-battle figures attributed to Duffy (1977) that Duffy does not print |
| [CL-HIS-01](#cl-his-01) | S2 | P2 | confirmed defect | confirmed | CONFIRMED | The face-about event contradicts itself and the sources: its pill says Fact ('Attested in the standard accounts'), its own text calls the order 'this map's reading' because 'no account read gives the order', yet the project's own reading of Schonhals p. 162 gives Kutuzov's order, and Stutterheim pp. 63-64 a competing account of who gave it |
| [CL-HIS-03](#cl-his-03) | S2 | P2 | confirmed defect | confirmed | WEAKENED | The Russian Guard's plotted approach takes one side of a divided register without saying so: its morning positions are graded A though the project's readings contest them (the disposition and Stutterheim against the official report's 'ordered height of Krzenowitz'); the plan text misstates the disposition; nobody is drawn at Blasowitz when it falls 'from the Russian Guard' |
| [CL-HIS-04](#cl-his-04) | S2 | P2 | confirmed defect | confirmed | CONFIRMED | New in 8J: Legrand's division marker walks through the Sokolnitz castle and the III Column holding it |
| [CL-HIS-05](#cl-his-05) | S2 | P2 | confirmed defect | confirmed | CONFIRMED | Russian Guard, Liechtenstein and Miloradovich drawn walking away from the enemy while shown Counter-attacking/Charging |
| [CL-MAP-01](#cl-map-01) | S2 | P2 | confirmed defect | confirmed | WEAKENED | Landscape with counters: during Play five to eight formations' counters are hidden most of the time, up to 28 s (about 100 clock minutes) at a stretch; the cavalry's starvation is inherited, Stage 8 lowered the share drawn (78% to 68% over the morning) and lengthened the gaps; the benchmark's 4,033 ms is only its window |
| [CL-MAP-03](#cl-map-03) | S2 | P2 | confirmed defect | confirmed | WEAKENED | No symbol key at all between 720 and 1079 px wide or on a phone held upright, so the integrity encodings (the B and C grades, '?', the dashed intended routes) go unexplained there; Watch, Clean and a phone held landscape hide it by recorded design or decision |
| [CL-SIM-01](#cl-sim-01) | S2 | P2 | confirmed defect | confirmed | CONFIRMED | The open dossier goes stale while the clock moves within a phase: 'Position at 12:03' still shown at 12:37, a place's 'Formations nearby now' wrong in 86 of 240 place-phases |
| [CL-SIM-02](#cl-sim-02) | S2 | P2 | confirmed defect | confirmed | CONFIRMED | 'Whose eyes?' still draws the movement arrows, arrow labels and plateau count of formations the reading does not know |
| [CL-UX-01](#cl-ux-01) | S2 | P2 | confirmed defect | confirmed | CONFIRMED | At 400% browser zoom and at WCAG's 320 px reflow width the interface loses content and functions (the card's start, the phase text, the caption, the key, the panels, the sources) |
| [CL-UX-02](#cl-ux-02) | S2 | P2 | confirmed defect | confirmed | CONFIRMED | On the landscape, a pan, zoom or keyboard pan during a camera glide is undone: the glide carries the camera on to its destination (the paper map's MAPCAM already stops its glide) |
| [CL-UX-03](#cl-ux-03) | S2 | P2 | confirmed defect | confirmed | CONFIRMED | On a phone, two thirds of the timeline's rail belong to event markers: a finger's drag there does nothing and a tap jumps to an event |
| [CL-VIS-01](#cl-vis-01) | S2 | P2 | confirmed defect | confirmed | CONFIRMED | Figure blocks are drawn sunk into the frozen Satschan mere: in the ponds phase, and wherever a leg's path crosses the drawn disc (at 06:30, 136 of Kienmayer's 222 instances on his phase-1 via are below the ice) |
| [CL-HIS-02](#cl-his-02) | S2 | P3 | probable problem | confirmed | WEAKENED | 44 of 88 A position grades are carried forward unreviewed from an earlier anchor: on moved anchors with no act (Caffarelli @6-@9 among them) a visitor reads 'Position documented in the sources' with nothing in the data placing the formation there, where 8K graded the adjacent Suchet pursuit C |
| [CL-GEO-02](#cl-geo-02) | S3 | P2 | unresolved historical question | confirmed | CONFIRMED | 'Walled castle' and 'pheasantry enclosure' are stated as fact in the 08:00 dispatch, against the project's own records |
| [CL-GEO-03](#cl-geo-03) | S3 | P2 | probable problem | confirmed | CONFIRMED | Outside Sokolnitz the hydrography is schematic and unlabelled: the Bosenitz brook and the Ricka through Slapanice are not drawn, and the upper Goldbach runs where no stream runs today |
| [CL-HIS-06](#cl-his-06) | S3 | P2 | confirmed defect | confirmed | CONFIRMED | Four events whose hours the sources dispute are not labelled disputed: three whose own texts say so, and the Pratzen climb, shown as Fact at 08:45-09:15 while the accounts read put it from about 08:00 to about 09:00 |
| [CL-MAP-06](#cl-map-06) | S3 | P2 | confirmed defect | confirmed | CONFIRMED | The caption shrinks the act and phase to a letter or nothing with orphan separators, and in Watch at 1280 px its readings and event give way entirely |
| [CL-PERF-01](#cl-perf-01) | S3 | P2 | probable problem | confirmed (no thermal evidence exists; Play's series is flat); the cause of the Overview's dips is unverified | CONFIRMED | 'After the phone warms' is asserted without temperature or throttling evidence, and the reports contradict a warming trend for Play |
| [CL-PERF-02](#cl-perf-02) | S3 | P2 | untested area | unverified | CONFIRMED | No integrated-GPU run: performance on the machine decision 138 and section 8.3 name is unknown |
| [CL-REC-02](#cl-rec-02) | S3 | P2 | confirmed defect | open | CONFIRMED | README.md describes the checks wrongly again and calls the file self-contained (the prior audit's R-1 recurred) |
| [CL-REC-03](#cl-rec-03) | S3 | P2 | confirmed defect | open | CONFIRMED | Merged pull requests are recorded as drafts in CHANGELOG.md, docs/ROADMAP.md and CLAUDE.md, which contradict one another for #77 and #78 (the prior audit's R-2 recurred) |
| [CL-SIM-03](#cl-sim-03) | S3 | P2 | confirmed defect | confirmed | CONFIRMED | A theme chosen while the clock plays does not stop it: the clock runs on and Follow takes the camera from the theme's view within seconds |
| [CL-SIM-04](#cl-sim-04) | S3 | P2 | confirmed defect | confirmed | CONFIRMED | The overlays' fade draws the outgoing phase's arrows when it should not: with the Movement layer off every phase change flashes them at about 0.87 opacity, and a phase change that interrupts a fade pops them back to 0.9 (stepping through phases quickly flashes each skipped phase's arrows) |
| [CL-TEST-02](#cl-test-02) | S3 | P2 | confirmed defect | confirmed | CONFIRMED | No check can see long gaps: the motion benchmark's longest-hidden measure saturates at its own 121-frame window, and the one check that plays the whole day counts drops, not how long a formation stays hidden |
| [CL-UX-04](#cl-ux-04) | S3 | P2 | confirmed defect | confirmed | CONFIRMED | The timeline's tooltip covers the control row and swallows a press on Play reached from the timeline |
| [CL-UX-05](#cl-ux-05) | S3 | P2 | confirmed defect | confirmed | CONFIRMED | Internal project references are shown to visitors: 'owner decision 106', register ids '(S5.7)', 'roadmap step 6B (docs/stage6-evidence/readings-composition.md)', 'the register (read partly on the text layer)', and in the full dossier's 'Dated by' rows 'Until roadmap step 4b ... (question 177)', '(moveMin)' |
| [CL-UX-07](#cl-ux-07) | S3 | P2 | confirmed defect | confirmed | CONFIRMED | On a phone a 'Whose eyes?' reading leaves no sign on screen once the Panels close |
| [CL-GEO-04](#cl-geo-04) | S3 | P3 | probable problem | inferred | CONFIRMED | Between Girzikowitz and Sokolnitz the drawn Goldbach departs up to about 300 m from today's channel and puts Girzikowitz and Kobelnitz on the opposite bank |
| [CL-GEO-05](#cl-geo-05) | S3 | P3 | confirmed defect | confirmed | CONFIRMED | Sokolnitz, Telnitz and Kobelnitz are drawn standing in marsh: marsh ellipses cover their centres and the cover classifier ranks marsh above village |
| [CL-GEO-06](#cl-geo-06) | S3 | P3 | unresolved historical question | confirmed | WEAKENED | The Goldbach bottom's marshiness, an open question, is drawn and told as settled, the opening's first step included; the movement audit never tests stream crossings and exempts marsh within 695 m of any village |
| [CL-GEO-07](#cl-geo-07) | S3 | P3 | unresolved historical question | confirmed | CONFIRMED | Krug is drawn 1.67 km south of where the 1836-52 survey and today's map put it, and the visitor is told no source read fixes it |
| [CL-HIS-07](#cl-his-07) | S3 | P3 | confirmed defect | confirmed | CONFIRMED | Kamensky's named conflict: the turn is drawn from 08:00, before the French climb, not 'in the 08:45 phase' as disclosed; it lifts the derived plateau reading |
| [CL-HIS-08](#cl-his-08) | S3 | P3 | confirmed defect | confirmed | CONFIRMED | Kienmayer 'Holding west of the Goldbach' is drawn 0.9 km east of the brook (since Stage 0) |
| [CL-HIS-09](#cl-his-09) | S3 | P3 | probable problem | confirmed | CONFIRMED | Caffarelli's objective 'Push Bagration off the highway' shown 12:45-17:00 while 1.5-2.2 km from the highway and moving away; separation misstated in records |
| [CL-HIS-10](#cl-his-10) | S3 | P3 | probable problem | confirmed | CONFIRMED | Interpolated legs pass through enemies and across the Litava; the movement audit tests neither |
| [CL-HIS-11](#cl-his-11) | S3 | P3 | probable problem | confirmed | CONFIRMED | Sokolnitz village drawn empty 09:00-13:15 although the texts have it taken and retaken and defended by Legrand, then Friant |
| [CL-HIS-12](#cl-his-12) | S3 | P3 | probable problem | confirmed | CONFIRMED | Command tab: DOCUMENTED on 31 rows the claims register calls 'Not yet checked'; a phase-5 row anticipates Blasowitz's fall; a 'Could see' row holds a historiographical dispute |
| [CL-HIS-13](#cl-his-13) | S3 | P3 | probable problem | confirmed | CONFIRMED | Dossier says 'Marching' beside 'In reserve'/'Concealed' on 63 slow drift legs |
| [CL-MAP-02](#cl-map-02) | S3 | P3 | probable problem | confirmed | WEAKENED | The formations a live event names are hidden while their event's label is drawn (the Guard cavalry clash 0-16%; Miloradovich at the face-about 0-40%) |
| [CL-MAP-04](#cl-map-04) | S3 | P3 | probable problem | confirmed | WEAKENED | The only north indicator is the rose inside the legend's toggle, so phones, layouts below 1080 px, Watch and Clean show no compass |
| [CL-MAP-05](#cl-map-05) | S3 | P3 | optional improvement | confirmed | WEAKENED | The paper map as entered draws none of the 12 place names at 1600, 1280 and 1024 px |
| [CL-MAP-07](#cl-map-07) | S3 | P3 | confirmed defect | confirmed | WEAKENED | Phone in Landscape with counters: half the formation-frames drawn; Liechtenstein's Fifth Column never drawn from 09:00 to 12:00 |
| [CL-MAP-08](#cl-map-08) | S3 | P3 | confirmed defect | confirmed | CONFIRMED | The legend omits several encodings it draws, against its own one-row-per-encoding rule |
| [CL-MAP-09](#cl-map-09) | S3 | P3 | probable problem | confirmed | CONFIRMED | Arrow labels repeat formation names in the same plate style as the formations' own names |
| [CL-MAP-10](#cl-map-10) | S3 | P3 | probable problem | confirmed | CONFIRMED | On the landscape the selection is barely distinguished on the map |
| [CL-MAP-11](#cl-map-11) | S3 | P3 | probable problem | confirmed | CONFIRMED | The Plans view mixes about 40 serif labels of the plans and the current phase, and at 1280 px drops plan labels |
| [CL-MAP-12](#cl-map-12) | S3 | P3 | confirmed defect | confirmed | CONFIRMED | In Landscape with counters the Field vantage sits 3% inside the corps threshold, so a short pan ends with every division counter replaced |
| [CL-MAP-13](#cl-map-13) | S3 | P3 | probable problem | confirmed | CONFIRMED | Between 720 and 1079 px a selection leaves a 209 px strip of map between the dispatch card and the dossier |
| [CL-MAP-15](#cl-map-15) | S3 | P3 | accepted compromise | confirmed | CONFIRMED | The low views' wall of formation names remains (decision 255 left it open) |
| [CL-PERF-03](#cl-perf-03) | S3 | P3 | probable problem | confirmed | CONFIRMED | The long-frame share, the device acceptance metric, is not a dropped-frame measure and is unstable at the phone's operating point |
| [CL-PERF-04](#cl-perf-04) | S3 | P3 | probable problem | confirmed | CONFIRMED | The desktop before/after spans a browser update (Chrome 155 to 156) that section 24 does not record; the accepted CPU excess cannot be attributed to Stage 8 alone |
| [CL-PERF-05](#cl-perf-05) | S3 | P3 | probable problem | confirmed | CONFIRMED | The 'heaviest frame' figures in sections 24-25 are segment medians, and the census maxima are below what the route drew in Play and in phase 8's Overview |
| [CL-PERF-06](#cl-perf-06) | S3 | P3 | accepted compromise | inferred | CONFIRMED | The two phone readings are not equally strong: P5 (Stage 8's own starting build) points to a Play slowdown from 53 to 43 fps; the P3/P4 proxy is dominated by device state |
| [CL-REC-05](#cl-rec-05) | S3 | P3 | untested area | accepted by decisions 175 and 189 | WEAKENED | Two items "recorded complete on the owner's word" carry no results: the screen-reader session (decision 175) and the human second reading (decision 189) |
| [CL-ROB-02](#cl-rob-02) | S3 | P3 | confirmed defect | open | CONFIRMED | A context loss while the clock plays can throw an uncaught TypeError from three r128 ("reading 'trim'") |
| [CL-ROB-03](#cl-rob-03) | S3 | P3 | probable problem | open | CONFIRMED | The documents an agent must read have outgrown a context: CLAUDE.md 130,902 bytes, CHANGELOG.md 1,283,488 bytes |
| [CL-SIM-05](#cl-sim-05) | S3 | P3 | confirmed defect | confirmed | CONFIRMED | Under a reading that does not know a formation, its card's 'Doing now' still names where it is |
| [CL-SRC-02](#cl-src-02) | S3 | P3 | probable problem | confirmed | WEAKENED | The III Corps detachment and the IV Column are drawn below every figure in the sources read; the notes of the detachment, Friant, Bourcier and the IV Column omit Sokolov's and Schonhals's figures (Miloradovich's note gives Schonhals's 6,965) |
| [CL-SRC-03](#cl-src-03) | S3 | P3 | confirmed defect | confirmed | CONFIRMED | 'Kologrivov's command on 2 December is in Sokolov alone' is contradicted by Schönhals p. 178 and by the project's own stage 6B reading |
| [CL-SRC-04](#cl-src-04) | S3 | P3 | confirmed defect | confirmed (no source read gives 7,750; its web origin is known only from a search result's summary) | WEAKENED | SOURCE_NOTE illustrates disagreement among 'reputable orders of battle' with an I Column range whose low end (7,750) no source read gives (the three read give 12,730-14,000); the figure's origin is not established |
| [CL-SRC-05](#cl-src-05) | S3 | P3 | probable problem | confirmed | CONFIRMED | Seven formations show a working strength with no note; six exceed the 22 November returns the project reads elsewhere |
| [CL-SRC-06](#cl-src-06) | S3 | P3 | probable problem | confirmed (code read) | CONFIRMED | Headline strength and gun figures carry no claim tag; the compact card shows strength with neither note nor tag |
| [CL-TEST-01](#cl-test-01) | S3 | P3 | probable problem | confirmed | WEAKENED | Only the node job is a required check on main: the browser checks run on every push but gate no merge, and check:visual runs only on dispatch (the one red merge, #77, was the owner's knowing merge over question 267's line) |
| [CL-TEST-03](#cl-test-03) | S3 | P3 | untested area | confirmed | CONFIRMED | Historical values a data task may change are held only by change detectors that the task itself resets: a strength, a later anchor's grade, a position, a village, the order of battle's hierarchy and a claim's reading fail no check of the property |
| [CL-TEST-04](#cl-test-04) | S3 | P3 | untested area | confirmed | CONFIRMED | No check covers interpenetration, rivers, motion vs status, act sides of the stream, event pill vs statement claim, or carried-forward grades |
| [CL-TEST-05](#cl-test-05) | S3 | P3 | confirmed defect | confirmed | CONFIRMED | Presentation code can rewrite a guarded datum at run time and every check passes, check:data included |
| [CL-TEST-06](#cl-test-06) | S3 | P3 | confirmed defect | confirmed | CONFIRMED | No check reads the formation dossier's strength against the data |
| [CL-TEST-08](#cl-test-08) | S3 | P3 | untested area | inferred | CONFIRMED | The gait's drawn shader and its JavaScript mirror are never compared: the feet-on-ground, contact and culling-envelope checks verify the mirror |
| [CL-TEST-10](#cl-test-10) | S3 | P3 | untested area | confirmed | CONFIRMED | Interface colours typed into style.css are read by no check |
| [CL-TEST-11](#cl-test-11) | S3 | P3 | optional improvement | confirmed | CONFIRMED | geo-test.js holds the surveyed villages to 0.5 km of ground truth while the worst is 20 m |
| [CL-TEST-12](#cl-test-12) | S3 | P3 | probable problem | confirmed | WEAKENED | The statement inventory is a whitelist with no completeness check: timing bases and plan labels a visitor reads are outside it and outside its own exclusion note |
| [CL-TEST-13](#cl-test-13) | S3 | P3 | probable problem | confirmed | CONFIRMED | check:chronology judges clock-shaped hours only; 45 inventoried statements give hours in words it does not read |
| [CL-TEST-14](#cl-test-14) | S3 | P3 | accepted compromise | confirmed | CONFIRMED | The motion benchmark's ceilings and visibility baselines equal the build's own counts: they detect change, not quality; Play now accepts a formation hidden for 4,033 ms |
| [CL-UX-08](#cl-ux-08) | S3 | P3 | confirmed defect | confirmed | WEAKENED | On the main screen the derived readings' qualifiers, the Zuran and Allied vantages' 'not what he saw' and the relief's and key's disabled reasons are given only in hover tooltips; the derived caveats are also in the sources sheet, the vantages' caveat nowhere else |
| [CL-UX-09](#cl-ux-09) | S3 | P3 | probable problem | confirmed | CONFIRMED | Forced colours (high contrast): the app has no forced-colors handling; the Layers panel's on/off rows and ground buttons, the speed, Follow and the current phase lose their state, 22 of 25 event markers vanish, and the key's swatches and the side marks before names become identical white squares |
| [CL-UX-10](#cl-ux-10) | S3 | P3 | confirmed defect | confirmed | CONFIRMED | Panels opened from the keyboard do not take the focus or announce themselves: Layers (role=dialog) is reached only on the sixth Tab after its button, and a dossier opened by Enter on a map item leaves focus on the item, about 30 Tabs from the dossier (or Shift+Tab back past the earlier map items and the map group) |
| [CL-UX-11](#cl-ux-11) | S3 | P3 | accepted compromise | confirmed | CONFIRMED | First use: neither the card nor the opening says the map is a reconstruction or what the A/B/C letters beside names mean; the key starts closed |
| [CL-VIS-02](#cl-vis-02) | S3 | P3 | confirmed defect | confirmed | WEAKENED | Trees and bushes stand on the frozen Satschan mere |
| [CL-VIS-03](#cl-vis-03) | S3 | P3 | probable problem | confirmed | CONFIRMED | Blocks face along slow drifts and keep stale facings, so some face away from an adjacent enemy |
| [CL-VIS-04](#cl-vis-04) | S3 | P3 | confirmed defect | confirmed | CONFIRMED | Formation blocks interpenetrate buildings and each other |
| [CL-PERF-12](#cl-perf-12) | S3 | P4 | accepted compromise | attributed |  | Decision 268 (a)'s desktop script excess is mostly three.js re-binding 8D/8E's three extra kit attributes on every instanced draw, plus Stage 8's own per-frame app work |
| [CL-ROB-04](#cl-rob-04) | S3 | P4 | confirmed defect | open | CONFIRMED | Each context restore keeps about 2.6-4 MB of heap and one more dispose listener per geometry and texture (three r128) |
| [CL-ROB-05](#cl-rob-05) | S3 | P4 | accepted compromise | accepted | CONFIRMED | The single file needs cdnjs: offline, or where cdnjs is blocked, the map cannot start |
| [CL-TEST-16](#cl-test-16) | S3 | P4 | confirmed defect | confirmed | CONFIRMED | test.js's 'objective off map' reads the objective's x only |
| [CL-PERF-13](#cl-perf-13) | S4 | P2 | optional improvement | open |  | freeRect, the free-rectangle search, runs three times a frame over the whole viewport and is the largest app function in every profile (inherited) |
| [CL-MAP-16](#cl-map-16) | S4 | P3 | probable problem | confirmed | CONFIRMED | The default event glyph reads as a north arrow on the paper map, and the 'capture' glyph as the objective marker |
| [CL-PERF-07](#cl-perf-07) | S4 | P3 | optional improvement | confirmed | CONFIRMED | Instrument limits of the device route: no raw intervals, median counts, flags rather than effects, no clock for played blocks, one refresh measurement |
| [CL-REC-01](#cl-rec-01) | S4 | P3 | optional improvement | open | WEAKENED | The published site's root page is the developer README: no link to the map and nothing for a visitor on evidence and reconstruction |
| [CL-REC-06](#cl-rec-06) | S4 | P3 | unresolved historical question | open | CONFIRMED | G-3 (Miloradovich at dawn) is the one finding of the prior audit never taken up: no step, no decision, no record since |
| [CL-SIM-06](#cl-sim-06) | S4 | P3 | confirmed defect | confirmed | CONFIRMED | The reading ('Whose eyes?') is cached for the clock's minute at the first instant asked, so it depends on the path: 29 and 38 formation-minutes differ by route |
| [CL-SRC-07](#cl-src-07) | S4 | P3 | confirmed defect | confirmed (register readings; Duffy on the text layer) | CONFIRMED | Army-total notes omit figures the project read and credit Duffy with a total he does not give |
| [CL-SRC-09](#cl-src-09) | S4 | P3 | unresolved historical question | open | CONFIRMED | A January 1806 letter by Buxhowden naming Langeron as having sent Kamensky back is missing from the Kamensky dispute and the registers |
| [CL-UX-06](#cl-ux-06) | S4 | P3 | untested area | unverified | WEAKENED | The map's two-finger pinch has never been driven by browser-level touch input (the self-test's pinch is synthetic); the audit's emulated pinches landed on the open event dossier and the timeline, not the map, so they show no fault |
| [CL-UX-12](#cl-ux-12) | S4 | P3 | confirmed defect | confirmed | CONFIRMED | The Now tab's hint 'The phase text is hidden: press D to show it. During the guided tour...' names a key that does nothing with the single-key shortcuts off, offers no pointer or touch way, and says 'guided tour' during the opening |
| [CL-GEO-08](#cl-geo-08) | S4 | P4 | confirmed defect | confirmed | CONFIRMED | The Pratzen church is drawn 161 m from its read site while the sources sheet says it is drawn at its own site |
| [CL-GEO-09](#cl-geo-09) | S4 | P4 | confirmed defect | confirmed | CONFIRMED | The sources sheet reads 'Terrain relief is exaggerated about 1 times' at 1x |
| [CL-GEO-10](#cl-geo-10) | S4 | P4 | unresolved historical question | confirmed | CONFIRMED | Two carried geographic questions are not visible to a visitor: the Goldbach's channel north of the castle and the highway's course in 1805 |
| [CL-HIS-14](#cl-his-14) | S4 | P4 | unresolved historical question | confirmed | WEAKENED | Krug and Bellowitz are drawn at their legacy places with the open question only in SOURCE_NOTE (Krug's place is CL-GEO-07), and the Russian Guard cavalry's commander is shown without a claim tag (the note behind it is CL-SRC-03) |
| [CL-HIS-15](#cl-his-15) | S4 | P4 | confirmed defect | confirmed | CONFIRMED | Smaller internal inconsistencies in texts and fields |
| [CL-HIS-16](#cl-his-16) | S4 | P4 | accepted compromise | confirmed | CONFIRMED | Accepted: the Russian Guard corps shown at 10,500 above its drawn 7,330 |
| [CL-HIS-17](#cl-his-17) | S4 | P4 | accepted compromise | confirmed | CONFIRMED | Accepted: Bagration drawn toward Rausnitz at nightfall while his role says toward Austerlitz |
| [CL-MAP-14](#cl-map-14) | S4 | P4 | accepted compromise | confirmed | WEAKENED | At rest after Play the kept places leave up to three formations hidden that a fresh view would draw, until the next discontinuity |
| [CL-MAP-17](#cl-map-17) | S4 | P4 | accepted compromise | confirmed | CONFIRMED | The Landscape's formation names blink during Play: 10.6% of in-view frames hidden in 0.6 s episodes, about one per name every 6 s |
| [CL-MAP-18](#cl-map-18) | S4 | P4 | accepted compromise | confirmed | CONFIRMED | The Littawa's name is dropped in the Plans view (section 22.4), and at 1280 px too |
| [CL-MAP-19](#cl-map-19) | S4 | P4 | accepted compromise | confirmed | CONFIRMED | Paper-map arrows grow without a cap when zoomed in |
| [CL-MAP-20](#cl-map-20) | S4 | P4 | optional improvement | confirmed | WEAKENED | The map's place names mix German period forms with Czech forms (Stare Vinohrady, Zuran, Litava) under no stated convention |
| [CL-PERF-08](#cl-perf-08) | S4 | P4 | probable problem | confirmed | CONFIRMED | Over-readings in the records: 'the figures and standards are what a phone's frame waits on' and 'the gait adds none' |
| [CL-PERF-09](#cl-perf-09) | S4 | P4 | confirmed defect | confirmed | CONFIRMED | Small numeric and wording inaccuracies in sections 24-25 |
| [CL-PERF-10](#cl-perf-10) | S4 | P4 | untested area | confirmed (data); cause unverified | CONFIRMED | A 329 ms frame in the phone's first effects-off block: counted, unexplained, and not in section 25.2 |
| [CL-PERF-11](#cl-perf-11) | S4 | P4 | accepted compromise | confirmed | CONFIRMED | Section 8.5's acceptance rule is weak at both refresh rates, and the per-PR before/after was replaced by one end-of-stage comparison |
| [CL-PERF-14](#cl-perf-14) | S4 | P4 | untested area | open |  | three r128 recomputes getProgramCacheKey every frame (2.1-2.8 ms profiled self a frame, both builds); cause not investigated |
| [CL-REC-04](#cl-rec-04) | S4 | P4 | confirmed defect | open | WEAKENED | The carried checklist misstates three of its own items (the records' view of other areas' findings) |
| [CL-REC-08](#cl-rec-08) | S4 | P4 | confirmed defect | open | CONFIRMED | CLAUDE.md's file table and heading lag the tree: the claims' counts before 8K and "Current state (October 2026)" |
| [CL-ROB-06](#cl-rob-06) | S4 | P4 | probable problem | open | CONFIRMED | Seven archived builds on the same Pages origin load three.js without integrity |
| [CL-ROB-07](#cl-rob-07) | S4 | P4 | optional improvement | open | CONFIRMED | Assurance tools CI never runs have started to rot: 5 of Stage 8's 189 mutations no longer apply; check:visual runs only on dispatch |
| [CL-ROB-08](#cl-rob-08) | S4 | P4 | optional improvement | open | CONFIRMED | The project has no licence |
| [CL-ROB-09](#cl-rob-09) | S4 | P4 | accepted compromise | accepted by decision 140 on a premise of 12.8% | CONFIRMED | Decision 140's premise has moved: the self-test is 21.7% of the file (12.8% when decided), +277,502 bytes in Stage 8 |
| [CL-ROB-10](#cl-rob-10) | S4 | P4 | optional improvement | open | CONFIRMED | Small dead code: gaitDist is never called though the gait's comment and CLAUDE.md name it |
| [CL-ROB-11](#cl-rob-11) | S4 | P4 | optional improvement | open | CONFIRMED | esc() leaves quotes, and double-quoted attributes take its output |
| [CL-ROB-12](#cl-rob-12) | S4 | P4 | optional improvement | open | CONFIRMED | The frame loop requests an animation frame at the display's rate while nothing is drawn |
| [CL-SIM-07](#cl-sim-07) | S4 | P4 | confirmed defect | confirmed | CONFIRMED | The first Play frame after the page went idle advances 120 ms of play (0.6 clock min at 1/2x, 3.6 at 4x) |
| [CL-SIM-08](#cl-sim-08) | S4 | P4 | confirmed defect | confirmed | CONFIRMED | Pausing in a dwell's hold leaves the caption naming the dwell's events; the same clock reached by a seek names one |
| [CL-SRC-08](#cl-src-08) | S4 | P4 | optional improvement | confirmed | WEAKENED | Stronger or earlier sources uncredited, and two locator slips (Kamensky's 'about 2,000 each' is printed by Schonhals p. 177, which also braces Kursk into the brigade, not by Sokolov p. 195, which gives battalions only) |
| [CL-TEST-07](#cl-test-07) | S4 | P4 | optional improvement | confirmed | WEAKENED | The harness's figure-on-ground and standard-foot checks pass when nothing is measured |
| [CL-TEST-09](#cl-test-09) | S4 | P4 | confirmed defect | confirmed | WEAKENED | Checks take their bounds from the code under test: a 20% looser infantry march-rate ceiling passes every movement check, and the self-test checks decided values against the code's own constants |
| [CL-TEST-15](#cl-test-15) | S4 | P4 | optional improvement | confirmed | WEAKENED | css-test.js holds source text, not behaviour: its march-row pin passed a march row stripped of its 'derived' tag |
| [CL-TEST-17](#cl-test-17) | S4 | P4 | optional improvement | confirmed | CONFIRMED | CTX_DELETES allows 248 context warnings where the case has measured 193 since 8C |
| [CL-TEST-18](#cl-test-18) | S4 | P4 | optional improvement | confirmed | CONFIRMED | The self-test manifest holds names and a count, not conditions |
| [CL-TEST-19](#cl-test-19) | S4 | P4 | optional improvement | confirmed | CONFIRMED | Several 'caught' results come from change detectors that a mechanical regeneration clears: the suites' semantic coverage is narrower than their failure count |
| [CL-TEST-20](#cl-test-20) | S4 | P4 | probable problem | confirmed | CONFIRMED | Wall-clock limits make the suites load-sensitive: runtime-test.js's 30 s font watchdog fired under load in this audit, and run-all.sh kills a suite at 600 s |
| [CL-UX-13](#cl-ux-13) | S4 | P4 | probable problem | inferred | WEAKENED | The time rail seeks on any mouse button and has no cancel path: a right or middle press on the rail moves the clock and stops Play; where a context menu swallows the release (platform-dependent, unverified), hovering the rail then scrubs until the next click |
| [CL-UX-14](#cl-ux-14) | S4 | P4 | confirmed defect | confirmed | CONFIRMED | The event jumps' 1.5-minute margin skips a start the clock stands just before (20 of 21 starts from one minute before) |
| [CL-UX-15](#cl-ux-15) | S4 | P4 | confirmed defect | confirmed | CONFIRMED | Accessible names and structure: the tablist is named 'The rail', the key's toggle is read 'Key plus/minus', Play becomes 'Pause' while also pressed, the full dossier's headings carry their tag word ('How many record', 'Where reconstruction'), the narrative sits inside the navigation landmark and the tools outside any landmark, and below 1080 px the page has no h1 |
| [CL-UX-16](#cl-ux-16) | S4 | P4 | optional improvement | confirmed | CONFIRMED | Visitor-facing jargon and overloaded letters: 'anchors', 'Plotted leg', 'interpolated', 'G.Q.G.', and three different A/B/C scales (position, timing, appearance) shown side by side ('Position B · Timing B') |
| [CL-UX-17](#cl-ux-17) | S4 | P4 | optional improvement | confirmed | CONFIRMED | Small type: 42-47% of visible texts on the main screens are 10.5-11.5 px (controls, tabs, timeline labels, tags), all at or above the project's 10.5 px floor |
| [CL-UX-18](#cl-ux-18) | S4 | P4 | optional improvement | confirmed | WEAKENED | Polish: the phone caption shows two orphan separators when the act and phase shrink to 0 px; at 800 x 450 with the Panels open the vantage row overlaps the dispatch card's top edge by about 10 px; the dispatch sheet's grip looks like a drag handle but only a tap works |
| [CL-UX-19](#cl-ux-19) | S4 | P4 | probable problem | confirmed | CONFIRMED | A modal sheet opened mid-drag does not end the drag: the map pans under the '?' sheet |
| [CL-UX-20](#cl-ux-20) | S4 | P4 | optional improvement | confirmed | CONFIRMED | Focus falls to the page when a resize hides the focused control |
| [CL-VIS-05](#cl-vis-05) | S4 | P4 | probable problem | confirmed | WEAKENED | Streams saturate to white in grazing and low-sun views |
| [CL-VIS-06](#cl-vis-06) | S4 | P4 | unresolved historical question | confirmed | CONFIRMED | Omitted chapels invite a misreading: Bosenitz's church appears to crown the Santon; St Anthony's name stands beside Augezd's church |
| [CL-VIS-07](#cl-vis-07) | S4 | P4 | optional improvement | confirmed | CONFIRMED | Headquarters drawn as a pitched camp at every status |
| [CL-VIS-08](#cl-vis-08) | S4 | P4 | confirmed defect | confirmed | CONFIRMED | Deciduous crowns near the eye show large faceted shards |
| [CL-VIS-09](#cl-vis-09) | S4 | P4 | optional improvement | confirmed | CONFIRMED | The low tier is decided once at start: a desktop page opened in a small window keeps density 1, no shadows and no near detail when enlarged |

### B.2 The findings in full

#### CL-HIS: history: the reconstruction against its own sources and readings

<a id="cl-his-01"></a>

**CL-HIS-01 · S2 · P2 · confirmed defect.** The face-about event contradicts itself and the sources: its pill says Fact ('Attested in the standard accounts'), its own text calls the order 'this map's reading' because 'no account read gives the order', yet the project's own reading of Schonhals p. 162 gives Kutuzov's order, and Stutterheim pp. 63-64 a competing account of who gave it

| field | |
|---|---|
| Subsystem | data/presentation: event claim (analysis.js EVENTS) and dossierEvent |
| User impact | The event dossier for 'Kutuzov orders the 4th Column to face about' (09:15; a moment of the Pratzen theme) shows the pill 'Fact' and the footer 'Attested in the standard accounts of the battle.' while the same dossier's why says the order is this map's reading and narrative.js notes 'No account read has Kutuzov order the 4th Column to face about'. The map label and caption carry no qualifier (evNote has none for 'fact'). |
| Status / origin | confirmed / inherited |
| Expected | The event's claim matches what the project's evidence supports: CLAIM.recon ('Reconstruction: Inferred from the narrative'), which also adds 'reconstruction' to its label via evNote. |
| Observed | claim:"fact" kept. |
| Evidence | event-claims.txt: face-about pill:fact, why:interpretation. dossierEvent renders claimPill(e.claim) and CLAIM[e.claim].note; claimTag after the why renders CLAIM_WORDS.interpretation ('This map's reading'). Decision 201 (b) labelled the why and the phase line but did not change the pill (CHANGELOG step 4b, finding (2)). |
| Reproduction | node tools/audit-post8/history/event-claims.js; in the page, press the 09:15 marker. |
| References | analysis.js:292-294; narrative.js:42; data.js:16-17; app.js:8297-8300; app.js:8328; app.js:3886-3893; data.js:79 |
| Cause (hypothesis) | Decision 201 (b) addressed hours and whys, not the pill. |
| Cause verified | yes |
| Remedy | A data task (analysis.js EVENTS, narrative.js): label the event disputed with both sides, as CLAUDE.md requires where sources disagree (Schonhals p. 162: Kutuzov's order to the 4th Column; Stutterheim pp. 63-64: the Emperor's order to the Russian battalions and an unnamed order to Kollowrath); remove 'no account read gives the order'; re-measure the 09:15 views' drop limits, since the label's words change. |
| Effort | 1-3 h |
| Risk of the remedy | Label length may move a drop limit at 09:15 views. |
| Validation | event-claims.js flags nothing; check:visual within limits. |
| Prior records | H-1; decision 201 (b); decision 193 |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (premise); CONFIRMED (repro); CONFIRMED (batch)] |
| Auditor's note | Merged: the history area found the pill contradicting the event's own text; the chronology area found which side the sources support (the order is given by Schonhals p. 162 and Stutterheim pp. 63-64, which the project has read). The auditor read analysis.js:292-294: the event 'face-about' carries claim:"fact" while its own why says 'That he ordered the column to face about is this map's reading': confirmed. |
| Area finding | history #3; also reported as sources-chronology #3 |

<a id="cl-his-02"></a>

**CL-HIS-02 · S2 · P3 · probable problem.** 44 of 88 A position grades are carried forward unreviewed from an earlier anchor: on moved anchors with no act (Caffarelli @6-@9 among them) a visitor reads 'Position documented in the sources' with nothing in the data placing the formation there, where 8K graded the adjacent Suchet pursuit C

| field | |
|---|---|
| Subsystem | data: track grades (cf carried by stateAt) and their display (POS_CLAIM, CONF_TEXT, confidence outline) |
| User impact | Pursuits and retreats 1-2.7 km past the last documented anchor show 'Position: documented' / 'Position documented in the sources' (e.g. Caffarelli 11:15-17:00, Kellermann and Nansouty's pursuit, Liechtenstein's and the Russian Guard's retreats, Kienmayer and Dokhturov on the ice), while Suchet's neighbouring pursuit anchors at the same hours were set to C in 8K because 'no reading places' them. |
| Status / origin | confirmed / inherited |
| Expected | One grading rule across the dataset; a carried-forward grade reassessed where the formation has moved. |
| Observed | The rule was applied to the twelve 8K anchors only. |
| Evidence | grades.txt: 180 positioned anchors, 88 graded A, 90 grades carried forward, 44 of them A; e.g. caffarelli@6-@9 A from @5 (moved 0.79-1.45 km each, no act), lich@6-@9, rg_inf@7-@9, rg_cav@7-@9, kellermann@6/7/9, nansouty@6/7/9. 8K register: 'B where a reading places the formation at that time relative to a named place; C where no reading places it then ... No grade was kept because it was there'; Suchet @6-@8 'B (inherited) to C for all three'; 'Caffarelli's anchors (not on the road, not re-plotted)'. |
| Reproduction | node tools/audit-post8/history/grades.js |
| References | data.js:286-292; data.js:302-304; app.js:7731-7733; app.js:8092; docs/stage8-evidence/8k/register.md:10; docs/stage8-evidence/8k/register.md:103-112; docs/stage8-evidence/8k/register.md:235 |
| Cause (hypothesis) | stateAt carries cf forward by design (data.js header); never revisited. |
| Cause verified | yes |
| Remedy | Data task: review each carried-forward A (list in grades.txt) against the readings and declare its grade; optionally a test.js rule requiring a declared cf on any anchor that moves more than a set distance. |
| Effort | 1-2 days |
| Dependencies | Source agents |
| Risk of the remedy | Confidence outlines and check:visual confidence shares change. |
| Validation | grades.js: no A carried past a move without review. |
| Prior records | H-5; decision 260 (a) |
| Adversarial verification | WEAKENED: Both lenses: the premise holds through CONF_TEXT.A, not through 8K's rule; 44 counts unreviewed carried grades, not wrong ones (21 are 1-5.6 km from the anchor that declared the A, 29 have no act). Applied: probable problem, P3. [lenses: WEAKENED (premise); WEAKENED (repro)] |
| Auditor's note | The auditor traced the grade inheritance: an anchor without cf takes the previous anchor's grade (data.js tracks; stateAt), shown as 'Position documented in the sources' (app.js:7731 CONF_TEXT.A); 44 of 88 A grades are so carried: confirmed. |
| Area finding | history #5 |

<a id="cl-his-03"></a>

**CL-HIS-03 · S2 · P2 · confirmed defect.** The Russian Guard's plotted approach takes one side of a divided register without saying so: its morning positions are graded A though the project's readings contest them (the disposition and Stutterheim against the official report's 'ordered height of Krzenowitz'); the plan text misstates the disposition; nobody is drawn at Blasowitz when it falls 'from the Russian Guard'

| field | |
|---|---|
| Subsystem | data: rg_inf/rg_cav tracks, PLANS.al reserve column, ANALYSIS plan, EVENTS blasowitz |
| User impact | The Guard is drawn at Krzenowitz from 04:00 (A) and creeping to [378,196] by 10:30 (A carried), then straight onto Stare Vinohrady; it never stands on the heights by Blasowitz and Krug or in Blasowitz. At 11:15 the event 'The French take Blasowitz from the Russian Guard' fires with no Allied formation within 1.4 km (Guard infantry 1.78 km). The plan tab and the plan theme say the Guard was to remain 'behind Krzenowitz'. |
| Status / origin | confirmed / inherited |
| Expected | Positions graded A agree with the A-graded readings the project holds, or are regraded; plan text agrees with the disposition as read; a capture event's named defender is drawn near the place. |
| Observed | Two A grades and their carried A (rg_inf@5) contradict the register; plan order and theme contradict the role. |
| Evidence | blasowitz-guard.txt (probes.js): at 11:15 rg_inf 1.78 km, rg_cav 1.54 km, lich 1.43 km from Blasowitz. Register C6.21 (A, fact): the disposition 'besetzt bei Tages-Anbruche die Position hinter Blasowitz und Kruh'. C6.c6 (A): Stutterheim has the Guard leave the heights before Austerlitz at the appointed hour 'auf die Anhöhen bey Blasowitz und Krug', engage Rivaud's skirmishers and Kellermann, and put the jäger battalion into Blasowitz. constantine.role (claimed attributed on these) says the disposition posts it behind Blasowitz and Kruh; PLANS.al.cols[7].ord 'remain behind Krzenowitz, in hand' and ANALYSIS[#plan] 'stands in reserve behind Krzenowitz' are unchecked. Step 4's proposal C6.p12 changed the role text only ('Text only'). |
| Reproduction | node tools/audit-post8/history/probes.js blasowitz-guard |
| References | data.js:624; data.js:631-633; data.js:642-643; analysis.js:15; analysis.js:165; analysis.js:186; analysis.js:310-312; data.js:735; narrative.js:113; docs/step4-evidence/readings.md:3103; docs/step4-evidence/readings.md:3260 |
| Cause (hypothesis) | Step 4 corrected the role from the readings but not the positions or the plan. |
| Cause verified | yes (proposals.md C6.p12) |
| Remedy | Data task with the source agents: re-plot rg_inf/rg_cav 07:00-11:00 onto the Blasowitz-Krug heights or regrade to B/C with a note; reword PLANS.al.cols[7].ord and ANALYSIS[#plan] to the disposition; give the Blasowitz event a written tolerance reason or the Guard a nearby anchor. |
| Effort | 1-2 days |
| Dependencies | Source agents' reading of the Guard's route |
| Risk of the remedy | Moves the plateau reading (rg_inf/rg_cav enter the outline), motion baselines, sim-test event agreement. |
| Validation | blasowitz-guard probe; sim-test event agreement; check:chronology. |
| Prior records | step 4 C6.p12; decision 213 (b) |
| Adversarial verification | WEAKENED: Both lenses: the register is divided (the disposition and Stutterheim against the official report), so the defect is taking one side without saying so; title corrected; S2 kept. [lenses: WEAKENED (premise); WEAKENED (repro)] |
| Area finding | history #4 |

<a id="cl-his-04"></a>

**CL-HIS-04 · S2 · P2 · confirmed defect.** New in 8J: Legrand's division marker walks through the Sokolnitz castle and the III Column holding it

| field | |
|---|---|
| Subsystem | data: tracks (legrand@2->@4 against prz@2/@4) |
| User impact | 08:30-09:10 the French division that the act says 'Fights for Sokolnitz village and the castle wall' is drawn passing over the castle (25 m at 08:45) and through the Allied III Column storming it (37 m at 08:51): two opposing blocks stand in one another at the opening's 08:45 moment. |
| Status / origin | confirmed / new-regression |
| Expected | Opposing formations' interpolated legs do not pass through each other except in a recorded melee; a data task's consequences include its neighbours' legs. |
| Observed | Legrand's marker crosses the III Column at the castle 08:40-09:00 (37 m at 08:51) and stands 0.4-0.77 km beyond it at 09:15-09:30 with phase 2's act; contact at the castle wall is recorded by both acts, the pass-through is not. Whether the opening's 08:45 frame shows it is not established (history/README.md:112; castle about 30 degrees off the stop's camera axis). |
| Evidence | legrand-through-castle.txt (probes.js): legrand [213.0,343.5] at 08:45, 25 m from LANDMARK_SITES.castle; 37 m from prz at 08:51 (closest.js); status 'engaged' throughout. Archive diff: Legrand's anchors identical in 8H, 8J and now; prz@2/@4/@7 moved by 8J from [238,332]/[233,344]/[227,338] to [215,341]; before 8J the leg passed about 0.67 km from the III Column. 8J's consequences (CHANGELOG 8J entry) measured knowledge, plateau and chronology, not proximity. |
| Reproduction | node tools/audit-post8/history/probes.js legrand-through-castle; node tools/audit-post8/history/closest.js |
| References | data.js:227-228; data.js:536; world.js:162; archive/stage8h-24e29da7.html; archive/stage8j-7d5594ba.html |
| Cause (hypothesis) | 8J re-plotted prz onto the castle site without checking neighbouring legs. |
| Cause verified | yes (archive comparison) |
| Remedy | Data task: route legrand@4 with a via west of the castle and pheasantry, or hold the division at Sokolnitz (only Levasseur's brigade moved, per its own act); add an opposing-proximity check (sim-test.js or audit.js) and run it in every data task. |
| Effort | 2-6 h (data task protocol, check:data reference, motion baselines re-measured) |
| Risk of the remedy | Moves the motion block's visibility baselines (owner rule for geographic baselines). |
| Validation | closest.js shows legrand x prz above 0.5 km; check:chronology unchanged. |
| Prior records | decision 259 (a); docs/STAGE8_SPEC.md 21.7 |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (premise); CONFIRMED (repro)] |
| Auditor's note | The auditor reproduced the distance: Legrand's interpolated position at 08:50 is about 39 m from the III Column's re-plotted place (data.js:227-228; LANDMARK_SITES.castle, world.js:162): confirmed. Verifier's corrections: the minimum to the castle is 4 m at 08:44; before 8J the leg passed 0.62 km from the III Column; in the opening's own 08:45 frame the overlap sits under the time bar, but the phase-2 camera and Play show it. |
| Area finding | history #2 |

<a id="cl-his-05"></a>

**CL-HIS-05 · S2 · P2 · confirmed defect.** Russian Guard, Liechtenstein and Miloradovich drawn walking away from the enemy while shown Counter-attacking/Charging

| field | |
|---|---|
| Subsystem | simulation: leg timing and status/heading presentation |
| User impact | In 'The Guard' phase (a theme, the dwell's events, the eagle) the Russian Guard reaches its attack place at 11:15 and at once walks east, facing east, for 85 minutes with the pills 'Counter-attacking'/'Charging', never meeting the French Guard; the phase-6 arrow draws a westward attack over the eastward movement. The gait (8E) animates the walk (1.5-1.8 km/h). |
| Status / origin | confirmed / inherited |
| Expected | While a formation's status is offensive, it is not drawn moving away from its opponent; or the status and heading shown during a leg match the leg (e.g. the destination's status, or a hold before the retreat). |
| Observed | anchorList's default (an undated leg runs from the previous anchor's arrival to the next phase start) starts the retreat leg the moment the attack anchor is reached; stateAt shows the phase's status; the poser faces the heading. waitingFor (decision 46) handles only dated departures. |
| Evidence | motion-vs-status.txt: rg_inf 'counterattack' moving away 11:20-12:40 at 1.48 km/h, 160 deg off the bearing to Vandamme; rg_cav 'charging' moving away 11:20-12:40 at 1.79 km/h; lich 'charging' moving away 10:35-11:10; milo 'counterattack' moving away 09:50-11:05; kollo 'counterattack' at 4.86 km/h 10:20-10:25. guard-attack-motion.txt: rg_inf [327,194] at 11:15 to [393,196] at 12:40, heading 88 deg (east); status 'counterattack' until 12:45. OVERLAYS phase 6 'Russian Imperial Guard' attack arrow [[413,202],[359,187],[330,192]]. |
| Reproduction | node tools/audit-post8/history/motion-vs-status.js; node tools/audit-post8/history/probes.js guard-attack-motion (ISO=isolated copy). In the page: 11:30-12:40, select the Russian Guard. |
| References | data.js:633-634; data.js:643-644; data.js:593-594; data.js:564-565; data.js:577-579; app.js:3235; app.js:6001-6003; app.js:7689; docs/STAGE2_SPEC.md:1243 |
| Cause (hypothesis) | Phase-granular status plus the default leg window. |
| Cause verified | yes (anchorList/legWindow read; positions and headings computed) |
| Remedy | Owner decision (decision 45 keeps undated legs spread over their interval): either a presentation rule (while a leg moves away from the nearest enemy, show the destination anchor's status and keep facing the enemy), or a data task adding holds (moveMin) on rg_inf@7, rg_cav@7, lich@6, milo@6 with the timing basis recorded; add a motion-vs-status check to sim-test.js. |
| Effort | 4 h-2 days (decision first) |
| Dependencies | Owner decision on decision 45's scope |
| Risk of the remedy | Changing leg timing moves chronology verdicts and motion-block baselines; a presentation rule is lower risk. |
| Validation | Re-run motion-vs-status.js: zero offensive-status samples moving away; check:chronology unchanged. |
| Prior records | decision 45 (docs/STAGE2_SPEC.md M.10); decision 46; decision 181 (kollo@4/@5 forced leg) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (premise); CONFIRMED (repro)] |
| Auditor's note | Related, not the same issue: CL-VIS-03 (the facing rule on slow drifts). Verifiers: the scope is wider than the title (12 formation-intervals, French ones among them: Legrand, Bourcier, the grenadiers, Suchet); the II Column, 'Storms Sokolnitz' (A, attacking), is drawn receding from the village 08:00-10:30. moveMin holds on the four named legs would only shorten the mismatch. |
| Area finding | history #1 |

<a id="cl-his-06"></a>

**CL-HIS-06 · S3 · P2 · confirmed defect.** Four events whose hours the sources dispute are not labelled disputed: three whose own texts say so, and the Pratzen climb, shown as Fact at 08:45-09:15 while the accounts read put it from about 08:00 to about 09:00

| field | |
|---|---|
| Subsystem | data: EVENTS claim |
| User impact | 'Napoleon releases Soult' and 'The Russian Guard takes the eagle' show 'Estimate' and the ice event 'Fact' with no 'hour disputed' on their labels, caption tags or dossier header, though their whys (or, for the ice, its phase line) say the hour is disputed. |
| Status / origin | confirmed / inherited |
| Expected | By CLAIM.disputed's definition and decision 201 (b)'s principle, an event whose accounts give different hours carries claim 'disputed' with a dispute text. |
| Observed | claim est/est/fact. |
| Evidence | Probe in event-claims context: decision (est) 'The hour is disputed: about eight in Ségur...'; guard-attack (est) 'The hour is disputed: Rapp and Ségur put the Guard's last effort about 13:00, Schönhals has the fight over by about noon'; PHASES[8] line c. 15:00 'The accounts differ on the hour'. CLAIM.disputed's definition (data.js:20) fits each. |
| Reproduction | node tools/audit-post8/history/event-claims.js |
| References | analysis.js:280-282; analysis.js:314-316; analysis.js:350-352; data.js:16-21; data.js:121 |
| Cause (hypothesis) | Decision 201 covered the seven events lowered by question 193 only. |
| Cause verified | yes |
| Remedy | Data task: claim 'disputed' with dispute texts for decision, guard-attack and ice; measure labels. |
| Effort | 2-4 h |
| Risk of the remedy | Label lengths at 08:25, 11:00, 15:00 views. |
| Validation | No event why/phase line says 'disputed' while its claim is not. |
| Prior records | decision 201 (b); H-7 |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch); CONFIRMED (batch)] |
| Auditor's note | Merged: one labelling rule, three events found by the history area and a fourth, the Pratzen climb, by the chronology area. |
| Area finding | history #6; also reported as sources-chronology #2 |

<a id="cl-his-07"></a>

**CL-HIS-07 · S3 · P3 · confirmed defect.** Kamensky's named conflict: the turn is drawn from 08:00, before the French climb, not 'in the 08:45 phase' as disclosed; it lifts the derived plateau reading

| field | |
|---|---|
| Subsystem | data/records: kamensky@2->@3 leg, SOURCE_NOTE open question, event dispute, arrow note |
| User impact | From 08:00 the brigade, shown 'On the march ... at the rear of Langeron's column', walks back north-east toward the Pratzeberg while Saint-Hilaire still waits in the valley; at 08:29 the caption's 'derived on the heights: Allied' rises 19,300 to 23,550 with no French on the plateau. The disclosures understate the drawn conflict by 45 minutes. |
| Status / origin | confirmed / inherited |
| Expected | The disclosure names what is drawn (from 08:00), or the leg holds until 08:45 (the act's own sequence: he turns on seeing the French). |
| Observed | Leg window 08:00-08:45 by the default rule. |
| Evidence | named-conflicts.txt and plateau-day.txt: kamensky [259,316] at 08:00 to [268.8,298.4] at 08:44, heading 151 deg; enters PLATEAU_POLY at 08:29; sthilaire at [206,231] until 08:45. SOURCE_NOTE: 'in the 08:45 phase in his brigade's record'; the event dispute 'turns it in the 08:45 phase'; arrow interp 'the track in phase 3'. sim-test prints '08:45 Soult attacks on the heights: Allied 23550'. |
| Reproduction | node tools/audit-post8/history/probes.js plateau-day |
| References | data.js:520-521; data.js:799; analysis.js:297-299; app.js:42-43 |
| Cause (hypothesis) | Default leg window from kamensky@2's arrival. |
| Cause verified | yes |
| Remedy | Record fix (SOURCE_NOTE, event dispute, arrow note: 'from 08:00') or, under decision 42, a moveMin hold on kamensky@3 so the turn starts at 08:45; owner to choose. |
| Effort | 1-3 h |
| Risk of the remedy | check:chronology verdict text and the plateau reading's recorded figures. |
| Validation | plateau-day probe; check:chronology. |
| Prior records | H-1; decision 42; CONFLICTS kamensky@3 |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | history #7 |

<a id="cl-his-08"></a>

**CL-HIS-08 · S3 · P3 · confirmed defect.** Kienmayer 'Holding west of the Goldbach' is drawn 0.9 km east of the brook (since Stage 0)

| field | |
|---|---|
| Subsystem | data: kienmayer@7 act vs position |
| User impact | From 12:45 Kienmayer's dossier says 'Holding west of the Goldbach as the trap closes behind it' while its block stands 901 m east of the drawn stream; its marker never crosses the stream all day. |
| Status / origin | confirmed / inherited |
| Expected | An act's side of the stream agrees with its anchor. |
| Observed | Contradiction since Stage 0; misattributed in 8J's record. |
| Evidence | legs-water.txt: kienmayer@7 [242,400] east 901 m; @1 east 714 m, @2 east 265 m. Stage 0's build has the same anchor and act with the brook at x 212 there; 8J's records file it as an 'offset from the corrected brook' although the brook south of y 377.9 was not changed. |
| Reproduction | node tools/audit-post8/history/legs-water.js |
| References | data.js:476; world.js:51-52; archive/stage0-c09c4b23.html; docs/STAGE8_SPEC.md:4982; CHANGELOG.md:379 |
| Cause (hypothesis) | Original text never checked against the drawn brook. |
| Cause verified | yes |
| Remedy | Data task: reword the act (e.g. 'Holding east of the Goldbach before Telnitz') or re-plot with evidence; correct the 8J record. |
| Effort | 0.5-2 h |
| Risk of the remedy | Statement hash rehash (unchecked claim). |
| Validation | legs-water.js side list. |
| Prior records | 8J carried item |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | history #8 |

<a id="cl-his-09"></a>

**CL-HIS-09 · S3 · P3 · probable problem.** Caffarelli's objective 'Push Bagration off the highway' shown 12:45-17:00 while 1.5-2.2 km from the highway and moving away; separation misstated in records

| field | |
|---|---|
| Subsystem | data: caffarelli@6-@9 (no acts, A carried) |
| User impact | The dossier's objective and the phase-5 narrative (Bagration broken by Caffarelli's, Suchet's and d'Hautpoul's attacks) do not match the drawn route east toward Krzenowitz, graded 'Position: documented'. |
| Status / origin | confirmed / inherited |
| Expected | Objective and route agree, or the act says the route is this map's; records quote measured figures. |
| Observed | Unexplained separation, A grade, records' numbers 0.3-0.4 km high. |
| Evidence | caffarelli-bagration.txt: 12:45-17:00 to the highway 1.54-2.15 km, to Bagration 1.61-2.64 km, nearest enemy Liechtenstein; objective carried from @7; cf A from @5. Records say 2.5-2.9 km; measured 2.13 km at 14:30 and 2.64 km at 17:00 (true distance and northing alike). |
| Reproduction | node tools/audit-post8/history/caffarelli.js |
| References | data.js:286-292; data.js:94; docs/stage8-evidence/8k/register.md:235; CHANGELOG.md:260 |
| Cause (hypothesis) | Not re-plotted in 8K (off the road). |
| Cause verified | partly |
| Remedy | Data task with the source agents (Caffarelli's afternoon route); correct the 8K/CHANGELOG figure. |
| Effort | 2-6 h |
| Dependencies | Source agents |
| Risk of the remedy | Motion baselines. |
| Validation | caffarelli.js |
| Prior records | 8K carried item |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | history #9 |

<a id="cl-his-10"></a>

**CL-HIS-10 · S3 · P3 · probable problem.** Interpolated legs pass through enemies and across the Litava; the movement audit tests neither

| field | |
|---|---|
| Subsystem | data tracks; tools (auditMovement, audit.js) |
| User impact | Bourcier's dragoons are drawn running through Kienmayer (26 m at 14:38) and Dokhturov (12 m at 14:54) to reach Augezd ahead of the retreating columns; Miloradovich's 14:30 anchor stands on the Litava (19 m from its line, covWater 0.96) and its legs cross the river twice with no road. |
| Status / origin | confirmed / inherited |
| Expected | No opposing blocks drawn in one another outside a melee; no river crossing without a road or a recorded crossing. |
| Observed | As above. |
| Evidence | closest-approach.txt; legs-water.txt (milo 6->8 Litava crossing [444.7,210.5] road 0.00; 8->9 back at [449.2,205.6]); litava-anchors.txt. Tracks unchanged since step 2 (archive comparison). auditMovement checks rate, ponds and marsh only. |
| Reproduction | node tools/audit-post8/history/closest.js; node tools/audit-post8/history/probes.js milo-litava |
| References | data.js:270-271; data.js:565-567; world.js:52; app.js:auditMovement (generated _clock.js crossingProblem); audit.js |
| Cause (hypothesis) | Routes drawn by hand on a schematic road/river. |
| Cause verified | partly |
| Remedy | Data task (Bourcier via points behind the columns or later; milo@8 off the river); add proximity and river-crossing rules to audit.js/sim-test.js. |
| Effort | 0.5-1 day |
| Risk of the remedy | Motion baselines. |
| Validation | closest.js and legs-water.js clean. |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | CL-HIS-04 is its one new instance; CL-TEST-04 is the missing check. |
| Area finding | history #10 |

<a id="cl-his-11"></a>

**CL-HIS-11 · S3 · P3 · probable problem.** Sokolnitz village drawn empty 09:00-13:15 although the texts have it taken and retaken and defended by Legrand, then Friant

| field | |
|---|---|
| Subsystem | data: legrand, friant, lang tracks; FEATURES sokolnitz |
| User impact | After Legrand's marker leaves at 08:00 no formation of either side is nearer the village than the III Column at the castle (0.79 km); Friant is never drawn there; Langeron 'storms Sokolnitz' (graded A) from 0.98 km across the brook. The II Column arrow says 'the model has the column at the village from 08:00'. |
| Status / origin | confirmed / inherited |
| Expected | The village fight the narrative describes has formations drawn at it, or the texts say the markers are division centres far from it. |
| Observed | Empty village; arrow note inaccurate. |
| Evidence | sokolnitz-defence.txt: 09:00-13:00 nearest French friant 0.83-1.21 km, nearest Allied prz 0.79 km; lang@2 [235,350] 976 m from [208,365], 452 m east of the brook (legs-water.txt). |
| Reproduction | node tools/audit-post8/history/probes.js sokolnitz-defence |
| References | data.js:227-228; data.js:508; data.js:705-709; app.js:47 |
| Cause (hypothesis) | One marker per division; Legrand's marker used for Levasseur's brigade. |
| Cause verified | partly |
| Remedy | Data task with source agents (who held the village; Legrand's brigade-only move; lang@2's grade); correct the arrow note. |
| Effort | 0.5-1 day |
| Dependencies | Source agents |
| Risk of the remedy | Motion baselines; sim-test event agreement. |
| Validation | sokolnitz-defence probe. |
| Prior records | 8J carried lang@2 |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | history #11 |

<a id="cl-his-12"></a>

**CL-HIS-12 · S3 · P3 · probable problem.** Command tab: DOCUMENTED on 31 rows the claims register calls 'Not yet checked'; a phase-5 row anticipates Blasowitz's fall; a 'Could see' row holds a historiographical dispute

| field | |
|---|---|
| Subsystem | data/presentation: COMMAND, paintCommand, SRC_LABEL |
| User impact | One statement is 'DOCUMENTED' in the Command tab and 'Not yet checked' in the sources sheet's index; from 10:30 the Allied reading says it 'knew ... that Blasowitz had fallen' (the map's fall is 11:15); 'Could see: The accounts differ on who turned Kamensky's brigade about'. |
| Status / origin | confirmed / inherited |
| Expected | One label per statement across screens; rows timed within their phase; row kinds that fit their content. |
| Observed | As above. |
| Evidence | command-claims.txt: 35 DOCUMENTED rows, 31 unchecked; paintCommand shows book[curPhase] for the whole phase; KIND saw -> 'Could see'. No claimTag in the Command tab. |
| Reproduction | node tools/audit-post8/history/command-claims.js |
| References | analysis.js:104; analysis.js:106; app.js:4235-4258 |
| Cause (hypothesis) | Labels predate the sourcing stage. |
| Cause verified | yes |
| Remedy | Presentation: the claim tag in the Command tab (or DOCUMENTED only where the claim is attributed/disputed); data: move al@5's Blasowitz row to phase 6, change al@4[0]'s kind. |
| Effort | 2-4 h |
| Risk of the remedy | check:contrast states with the Command tab. |
| Validation | command-claims.js |
| Prior records | H-6; decision 187 |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | history #12 |

<a id="cl-his-13"></a>

**CL-HIS-13 · S3 · P3 · probable problem.** Dossier says 'Marching' beside 'In reserve'/'Concealed' on 63 slow drift legs

| field | |
|---|---|
| Subsystem | presentation: marchRow |
| User impact | E.g. the Russian Guard cavalry at 07:37: pill 'In reserve', row 'Marching 3.2 km in 435 min · 0.4 km/h derived'; Saint-Hilaire 'Concealed' and 'Marching'. The gait (decision 244) treats under 1 km/h as not a march; the dossier does not. rg_cav's drift also adds 2,900 to the derived plateau reading at 10:05. |
| Status / origin | confirmed / inherited |
| Expected | Decision 45 keeps the drift with the 'interpolated' marker; the row's word should not contradict the status (e.g. 'Plotted leg' under the gait's 1 km/h floor). |
| Observed | marchRow labels any u in (0,1) 'Marching'. |
| Evidence | drift-legs.txt (63 legs over 90 min under 1 km/h); plateau-day.txt (10:05 Al 18,150 -> 21,050). |
| Reproduction | node tools/audit-post8/history/drift.js |
| References | app.js:7917-7930; docs/STAGE2_SPEC.md:1243; docs/STAGE8_SPEC.md:826-833 |
| Cause (hypothesis) | D-6's row added after decision 45 without the drift case. |
| Cause verified | yes |
| Remedy | Presentation: use the gait's KMH floor for the row's word. |
| Effort | 1-2 h |
| Risk of the remedy | runtime-test dry runs of the march row. |
| Validation | drift.js plus a dossier read. |
| Prior records | decision 45; D-6; decision 244 (a) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | history #13 |

<a id="cl-his-14"></a>

**CL-HIS-14 · S4 · P4 · unresolved historical question.** Krug and Bellowitz are drawn at their legacy places with the open question only in SOURCE_NOTE (Krug's place is CL-GEO-07), and the Russian Guard cavalry's commander is shown without a claim tag (the note behind it is CL-SRC-03)

| field | |
|---|---|
| Subsystem | world.js VILLAGES; data.js rg_cav.commander |
| User impact | Krug (with drawn farmsteads) sits 1.6 km south of Holubitz although the acts pair 'Krug and Holubitz' and the 8K register's Second Survey has 'Kruch' beside Holubitz; SOURCE_NOTE lists both villages' positions as open. 'Lt.-Gen. Andrei Kologrivov' heads the Guard cavalry dossier and counter, tagged 'Not yet checked', though SOURCE_NOTE lists his command as single-source and the Guard infantry's commander reads 'Not established on the day'. |
| Status / origin | confirmed / inherited |
| Expected | An open question is marked where it is shown, as decision 210 (c) did for rg_inf. |
| Observed | Unmarked. |
| Evidence | VILLAGES Krug [339,139], Holubitz [340,89]; commander claim 'unchecked' (names list); SOURCE_NOTE.body[5]. |
| Reproduction | read world.js:142-143, data.js:639 |
| References | world.js:142-143; data.js:604; data.js:639-640; data.js:799; docs/stage8-evidence/8k/register.md:43-45 |
| Remedy | Data task: rg_cav.commander claimed attributed/uncertain with 'Sokolov alone' in the field or note; a qualifier on Krug/Bellowitz labels or the candidate Krug data task. |
| Effort | 1-4 h |
| Dependencies | Source agents for Krug |
| Prior records | decision 210 (c); FINAL_AUDIT 2.1 open-questions table |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Auditor's note | Overlaps CL-GEO-07 (Krug's place) and CL-SRC-03 (Kologrivov's command); this entry is the qualification a visitor is not shown. |
| Area finding | history #14 |

<a id="cl-his-15"></a>

**CL-HIS-15 · S4 · P4 · confirmed defect.** Smaller internal inconsistencies in texts and fields

| field | |
|---|---|
| Subsystem | data.js / analysis.js / app.js labels |
| User impact | Limited comprehension cost. |
| Status / origin | confirmed / inherited |
| Expected | Texts, fields and labels agree with positions and with each other. |
| Observed | As listed. |
| Evidence | (a) sthilaire@2/vandamme@2 'Crosses the Goldbach' in phase 2 while 146 m/265 m west of the drawn stream (legs-water.txt). (b) ahq@4 'orders Kamensky to retire' at 09:30-10:30 vs kamensky@5 fighting and @6 'ordered to retire by Kutuzov' at 11:15. (c) 'Arm: Guard infantry' for both Guard corps (c_gd, constantine include cavalry): app.js:7970 maps guard to 'Guard infantry'. (d) G-3 still open: milo@0 A 'near Pratzen village' 1.6 km from it. (e) Unaccented 'Chasseurs a Pied/a Cheval', 'Garde Imperiale', 'Reserve de Cavalerie', 'emigre', 'Frederic Walther' (outside decision 209's six names); guard_inf.commander holds a composition. (f) data.js header gives the frame as ~13 x ~10 km; KM_PER_MAP gives 21.5 x 15.8 km (comment only). (g) Langeron's counter 11,700 includes Kamensky's 4,250, drawn separately from 08:00, with no 'including' in its note; Buxhowden's card/counter '≈ 40,000' without its '33,000-40,000' range. (h) The Chevalier Guard (800 of rg_cav's 2,900) drawn with the Guard from 04:00 at A though the data has it come up late in Maliutin's column. |
| Reproduction | see evidence files |
| References | data.js:191; data.js:209; data.js:450; data.js:561; data.js:323; data.js:399; data.js:410; data.js:500; data.js:3; app.js:7970 |
| Remedy | One small data task for (a), (b), (d), (e), (f), (g) notes; presentation for (c) ('Guard' for corps); (h) with the source agents. |
| Effort | 2-4 h |
| Risk of the remedy | Statement hashes; label widths. |
| Prior records | G-3; H-19; decision 209 (a); H-14 |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | history #15 |

<a id="cl-his-16"></a>

**CL-HIS-16 · S4 · P4 · accepted compromise.** Accepted: the Russian Guard corps shown at 10,500 above its drawn 7,330

| field | |
|---|---|
| Subsystem | data: constantine strength |
| User impact | OOB and the corps counter show 10,500 beside 4,430 and 2,900; the 3,170 (Life Grenadiers 2,300, pioneers 100, 800 in no row) is explained only indirectly in the dossier's note. |
| Status / origin | confirmed / accepted-compromise |
| Expected | As decided. |
| Observed | As decided; the note does not name the 3,170. |
| Evidence | strengths.txt; decision 213 (b). |
| References | data.js:621-626; app.js:7280 |
| Remedy | Optional: one sentence in the strengthNote naming the undrawn 3,170. |
| Effort | 0.5 h |
| Prior records | decision 213 (b) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | history #17 |

<a id="cl-his-17"></a>

**CL-HIS-17 · S4 · P4 · accepted compromise.** Accepted: Bagration drawn toward Rausnitz at nightfall while his role says toward Austerlitz

| field | |
|---|---|
| Subsystem | data: bag@9, phase-8 arrow |
| User impact | The arrow 'Bagration withdraws on Rausnitz' and the role 'withdraws toward Austerlitz in the evening (Stutterheim; Schönhals)' differ. |
| Status / origin | confirmed / accepted-compromise |
| Expected | As decided. |
| Observed | As decided. |
| Evidence | Decision 180 (c) 'not now'. |
| References | data.js:597; data.js:609; app.js:100 |
| Remedy | None unless the owner revisits 180 (c). |
| Prior records | decision 180 (c) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | history #18 |

#### CL-SRC: sources: forces, timings and places traced to what the sources print

<a id="cl-src-01"></a>

**CL-SRC-01 · S2 · P1 · confirmed defect.** Order-of-battle figures attributed to Duffy (1977) that Duffy does not print

| field | |
|---|---|
| Subsystem | data.js FORMATIONS strength notes; analysis.js theme 'weakness'; appearance.js COMPOSITION.friant; narrative.js Kienmayer claim note |
| User impact | Visitors are told a named specialist work gives figures it does not print. - The III Corps detachment's 4,300 (with 830 cavalry) and Friant's 3,470 also appear in the 'weakness' theme, which carries the battle's central argument. - The IV Column's 13,900 is the column broken on the Pratzen; the Russian wing's 4,800 is 'implied' from it. - Kienmayer's note says Duffy gives '3,440 foot and 3,440 horse, which make 6,880'. - Dokhturov's note gives 13,240 infantry. The drawn strengths of the III Corps detachment, the IV Column and its Russian wing rest on these figures, and derived readings sum plotted strengths. |
| Status / origin | confirmed (on Duffy's OCR text layer, via archive.org full-text search; the lending item's page images cannot be opened here; the same search reproduces exactly the Guard rows that S5.7 read on the owner's photograph) / inherited |
| Expected | A figure attributed to a named work is printed in it (CLAUDE.md: never invent sources). Where a work is cited but not read, the note does not state what it gives. |
| Observed | - c_iii: 'Duffy and Smith give 4,300 men present, including 830 cavalry, with 12 guns' - friant: 'about 3,470 in Duffy and Smith' - theme: 'some 4,300 men by Duffy's and Smith's count' - kienmayer: 'Duffy and Smith ..., as transcribed here, give 3,440 foot and 3,440 horse, which make 6,880' - dok: '13,240 infantry and 250 cavalry with 64 guns (Duffy/Smith)' - col4: '13,900 infantry with 52 light and 24 heavy guns (Duffy 1977; Smith 1998) ... 23,900 (Chandler, and an older revision of the same order of battle)' - milo: 'Duffy and Smith imply about 4,800 (13,900 less the Austrian brigades' 9,100)' |
| Evidence | Duffy, text-layer snippets: - 'Ill Corps, MARSHAL DAVOUT 2nd Div. (3,800 and 9 guns) Gen. Friant' - '4th Dr. Div. (2,500 and 3 guns) Gen. Bourcier'; in the narrative, 'the supporting dragoon division of Bourcier (2,500 men and 3 guns)' - 'Advance Guard of 1st Column, Lt.-Gen. Kienmayer (6,780 and 12 light pieces)', and 'this figure, like the following figures, presents the over-optimistic nominal ...' - '1st Column, Lt.-Gen. Dokhturov (13,650, 40 light and 24 heavy pieces)' - '4th Column, Lt.-Gens. Miloradovich and Kollowrath (23,900, 52 light and 24 heavy pieces)'; in the narrative, 'an Austro-Russian fourth column of 23,900 infantry' The map's figures 4,300, 830, 3,470, 3,440, 13,240 and 13,900 have zero hits anywhere in the book. Every gun count agrees: 12 = 9+3; 12; 64; 76. Duffy's IV Column rows add to about 16,065 (derived), not 13,900. |
| Reproduction | python3 -I tools/audit-post8/sources-oob/ia-fts.py austerlitz18050000duff '3,800 and 9 guns' '2,500 and 3 guns' '4,300' '830' '3,470' '6,780' '3,440' '13,650' '13,240' 'Miloradovich and Kollowrath' '13,900' |
| References | data.js:240; data.js:248; data.js:470; data.js:485; data.js:551; data.js:559; analysis.js:25; appearance.js:547; narrative.js:537; CHANGELOG.md:9316-9319; docs/audit-post8-evidence/sources-oob/duffy-fts.txt; docs/audit-post8-evidence/sources-oob/ledger.md L07 L08 L10 L20 L22 L26 L27 |
| Cause (hypothesis) | The early correction pass ('Order of battle (Duffy 1977 and Smith 1998, unless a range names others)', CHANGELOG.md:9316) transcribed figures under a joint heading from another compilation or from Smith. 23,900 to 13,900 looks like a digit slip. Kienmayer's 3,440 + 3,440 mixes in Sokolov's 3,440 infantry. |
| Cause verified | no |
| Remedy | 1. Have Duffy pp. 179-185 read on the page (a loan, or the owner's photograph as for S5.7) and register them. 2. Then, in a data task recorded in CHANGELOG.md, correct each attribution (to Smith only if Smith is read) and settle the working figures with Schönhals, Sokolov and Duffy as the sides. 3. Meanwhile, reword the six notes and the theme so they no longer credit Duffy with numbers absent from his text. |
| Effort | 2-4 h to reword and rehash the claims; 1-2 days for the page reading and the data task |
| Risk of the remedy | A data change moves check:data's reference and the claims' hashes. Counter ranks and map-layer drop limits may move, as may sim-test's tour stop 4 figures. |
| Validation | test.js (claims); check:data; re-run tools/audit-post8/sources-oob/ia-fts.py; a person reads Duffy's pages |
| Prior records | docs/ROADMAP.md:236 (Duffy and Smith cited for strengths, not read); docs/step5-evidence/questions.md:86-127 (Duffy's text layer searched for the Guard only) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (premise); CONFIRMED (repro)] |
| Auditor's note | Verifiers: the attributions fail on positive evidence (in each case Duffy prints a different figure in the same row of his text layer); Duffy's page images (a lending item) and Smith (1998) remain unread, so the page reading is the remedy's first step, before the data task. |
| Area finding | sources-oob #1 |

<a id="cl-src-02"></a>

**CL-SRC-02 · S3 · P3 · probable problem.** The III Corps detachment and the IV Column are drawn below every figure in the sources read; the notes of the detachment, Friant, Bourcier and the IV Column omit Sokolov's and Schonhals's figures (Miloradovich's note gives Schonhals's 6,965)

| field | |
|---|---|
| Subsystem | data.js FORMATIONS c_iii, friant, bourcier, col4, milo |
| User impact | The thinness of the right is drawn larger than any readable source has it: - Bourcier: 830 drawn, against Sokolov's presumed 1,500 and Duffy's 2,500. - The detachment: 4,300 drawn, against 5,300-6,300. The IV Column is drawn smaller: - The column: 13,900 drawn, against about 16,100. - Its Russian wing: 4,800 drawn, against Schönhals's 6,965. Visitors cannot see the read figures. Derived readings that sum plotted strengths inherit the gaps (not recomputed here). |
| Status / origin | confirmed / inherited |
| Expected | CLAUDE.md: 'Where sources disagree, keep the disagreement. Prefer primary and specialist sources.' The figures of the sources read appear as sides. |
| Observed | c_iii is 4,300 (Friant 3,470 + Bourcier 830); bourcier's 'about 830 sabres present' names no source; col4 is 13,900 and milo 4,800, with the read totals absent from both notes. |
| Evidence | III Corps: - Sokolov pp. 188-189 (page images; never registered): Friant 7,037 on 22 November, presumed 3,800; Bourcier 1,900, presumed 1,500; Davout 8,975 / 5,300. The register already quotes the 5,300 from p. 193 (C5.8). - Sokolov: 'Даву мог располагать не более чем 3 500—4 000 человек из дивизии Фриана и 1 200—1 500 человек из дивизии Бурсье'. - Thiers p. 310 (C6.17): Friant 'réduite à 6 mille hommes au plus'. No source read gives the note's 'about 6,400'. IV Column: - Schönhals p. 177 (page image): 'Summa der ganzen Colonne . 27 5 2 16118 125' (recapitulation 16,115); Russian wing 6,965. - Sokolov p. 197: '15 900 пех., 300 ка[в]'. - Duffy's rows: about 16,065 (text layer, derived). - col4's note lists 12,000 (WarHistory), 17,000 (Napoleon-Empire) and 23,900 (Chandler), but neither read total, although it cites Schönhals for battalion counts. |
| References | data.js:240; data.js:248; data.js:263; data.js:550-551; data.js:558-559; docs/step4-evidence/readings.md:2384-2394 (C5.8); docs/step4-evidence/readings.md:3055-3065 (C6.17); docs/audit-post8-evidence/sources-oob/pages/schoenhals1873-p177.png; docs/audit-post8-evidence/sources-oob/ledger.md L07-L09 L26-L27 |
| Remedy | Data task, with CHANGELOG records: 1. Register Sokolov pp. 188-189. 2. Name Sokolov's and Schönhals's figures as sides in the notes. 3. Reconsider the working figures (e.g. the IV Column about 16,100; Bourcier 1,500). 4. Re-measure the derived readings and the limits. |
| Effort | 1-2 days (with the first finding's data task) |
| Dependencies | Same data task as the Duffy attribution finding |
| Risk of the remedy | Moves the plateau holding reading, tour stop 4's figures (held by sim-test), counter ranks and map-layer drop limits |
| Validation | check:data; sim-test; check:visual drop limits |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | sources-oob #2 |

<a id="cl-src-03"></a>

**CL-SRC-03 · S3 · P3 · confirmed defect.** 'Kologrivov's command on 2 December is in Sokolov alone' is contradicted by Schönhals p. 178 and by the project's own stage 6B reading

| field | |
|---|---|
| Subsystem | data.js rg_cav.strengthNote and SOURCE_NOTE.body[5]; registers |
| User impact | Two places tell visitors that a single modern work supports the commander shown: the Russian Guard cavalry's dossier (tagged 'As a source tells it') and the sources sheet's open questions. Yet a source read on its page since step 4 names him in the battle's order of battle. The stage 6B reading had already logged this as 'a second source for that name'. |
| Status / origin | confirmed / inherited |
| Expected | The open question states the sources as read: Sokolov's order of battle; Schönhals's undated table, which puts him over the whole Guard; Duffy's heading. |
| Observed | 'in Sokolov alone, with no source on his page' (rg_cav note); 'which rests on Sokolov alone' (SOURCE_NOTE) |
| Evidence | - Schönhals p. 178 (page image), in 'Ordre de Bataille des verbündeten Heeres in der Schlacht von Austerlitz': 'K. russische Garden \| Grossfürst Constantin \| Waren am Morgen in Schlachtordnung \| GL. Kollowrizow \| GM. Jancowitz'. - Stage 6B reading: 'supports the project's rg_cav commander "Kologrivov" (as "GL. Kollowrizow"): a second source for that name'. - Duffy p. 184 heading (S5.7): 'Lt.-Gen. of Cavalry Kologrivov'. - C6.n7 searched with 'Кологрив\|Kologri\|Kolagri\|Kologriw\|Колог', which cannot match 'Kollowrizow'. - Also: the rows decision 213 (b) took from the owner's photograph of Duffy are printed on the same Schönhals page, and 6B had already summed them to 6,730 and 2,900. The rg_inf note credits Duffy alone. |
| References | data.js:639-640; data.js:799; narrative.js:612; docs/stage6-evidence/readings-composition.md:542-548; docs/step4-evidence/readings.md:3301; docs/audit-post8-evidence/sources-oob/pages/schoenhals1873-p178.png; docs/audit-post8-evidence/sources-oob/ledger.md L31-L32 |
| Remedy | In a data task with CHANGELOG records: 1. Reword rg_cav.strengthNote and SOURCE_NOTE.body[5]. 2. Cite Schönhals p. 178 for the rows in the rg_inf and rg_cav notes. 3. Widen C6.n7's search patterns. |
| Effort | 1-3 h |
| Risk of the remedy | Claim hashes change; check:data moves |
| Validation | test.js claims; check:data |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | sources-oob #5 |

<a id="cl-src-04"></a>

**CL-SRC-04 · S3 · P3 · confirmed defect.** SOURCE_NOTE illustrates disagreement among 'reputable orders of battle' with an I Column range whose low end (7,750) no source read gives (the three read give 12,730-14,000); the figure's origin is not established

| field | |
|---|---|
| Subsystem | data.js SOURCE_NOTE.body[2] and FORMATIONS.dok.strengthNote |
| User impact | The method statement says reputable orders of battle give the I Column anything from 7,750 to 14,200 men. The sources read here agree within about 10% (12,730-14,000). The statement overstates the uncertainty and gives a web figure the authority of 'reputable' and 'returns'. |
| Status / origin | confirmed (no source read gives 7,750; its web origin is known only from a search result's summary) / inherited |
| Expected | Only reputable sources are called reputable; an illustrative range is sourced. |
| Observed | 'Dokhturov's I Column is given as anything from 7,750 to 14,200 men'; 'other returns range from 7,750 to 14,200' |
| Evidence | - Schönhals: 12,730 / 13,730 (page images) - Duffy: 13,650 (text layer) - Sokolov: 13,800 + 200 Cossacks (page image) - Web search: 7,752 on military-review.com (HTTP 503 when fetched); about 14,200 on a fan site. |
| References | data.js:796; data.js:485; docs/audit-post8-evidence/sources-oob/ledger.md L22-L23 |
| Remedy | Use the read sources' range, or a figure genuinely disputed among read sources (e.g. the IV Column, about 16,000 against Duffy's 23,900). Correct the dok note's 'returns'. |
| Effort | 1 h |
| Validation | test.js; check:data |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | sources-oob #6 |

<a id="cl-src-05"></a>

**CL-SRC-05 · S3 · P3 · probable problem.** Seven formations show a working strength with no note; six exceed the 22 November returns the project reads elsewhere

| field | |
|---|---|
| Subsystem | data.js FORMATIONS kellermann, dhautpoul, walther, rivaud, drouet, guard_inf, guard_cav |
| User impact | The French Guard cavalry is shown and drawn as about 2,500 men, about 2.4 times the only return read (1,023 horse). This changes the apparent balance of its fight with the Russian Guard cavalry. The cavalry divisions and I Corps' divisions are 7-19% above their 22 November figures, yet strength could only have fallen between 22 November and 2 December. |
| Status / origin | confirmed / inherited |
| Expected | Each working figure is labelled, and a read source giving another figure is named (CLAUDE.md: label claims; keep the disagreement). |
| Observed | Bare figures. The only label is SOURCE_NOTE.refs[0]'s 'a figure without a note is this map's', on the sources sheet. |
| Evidence | Sokolov page images (archive.org 1799-1805-.-ii): - p. 193: horse chasseurs 376, Mamelukes 48, horse grenadiers 599, horse artillery 298 (Guard horse 1,023) - p. 191: Kellermann 2,021 (presumed 1,500) - p. 190: d'Hautpoul 1,136 (presumed 1,100); Walther 1,340 (presumed 1,200) - register C5.9: Rivaud 5,216, Drouet 6,318 The map draws 2,500, 2,400, 1,300, 1,500, 6,000 and 7,000, none with a note. Nansouty's 1,600 (Sokolov 1,496 / 1,300) has a note. |
| References | data.js:332; data.js:352; data.js:361; data.js:377; data.js:389; data.js:408; data.js:419; docs/audit-post8-evidence/sources-oob/ledger.md L15-L17 |
| Remedy | Data task: give each formation a note with Sokolov's figures (or adopt them), with claims registered. |
| Effort | 3-6 h |
| Risk of the remedy | Same as the previous finding (ranks, derived readings) |
| Validation | check:data; check:visual |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | sources-oob #3 |

<a id="cl-src-06"></a>

**CL-SRC-06 · S3 · P3 · probable problem.** Headline strength and gun figures carry no claim tag; the compact card shows strength with neither note nor tag

| field | |
|---|---|
| Subsystem | app.js compactCard and dossierFormation; tools/step4/statements.js classes |
| User impact | The most visible forces figures, '≈ N men' and the gun count, carry no claim word wherever they appear. - The compact card, the first view of a selected formation, never shows the strength note. 34 formations show a bare figure; three with a range say 'working figure'. - Seven formations have no note even in the full dossier. |
| Status / origin | confirmed (code read) / inherited |
| Expected | CLAUDE.md: 'Label claims as fact, disputed, derived, inference, uncertain, or design decision.' |
| Observed | Unlabelled headline numbers on every formation |
| Evidence | - compactCard: 'else if(str) body+=row("Strength","&asymp; "+str.toLocaleString("en-GB")+" men"+(f.guns?...))', with no claimTag and no note. - dossierFormation: 'row("Approximate strength",...)' and 'row("Guns", esc(String(f.guns)))', with no claimTag. Only strengthNote gets one. - The statement classes cover strings only, so the numbers sit outside the claims inventory. |
| References | app.js:7811-7813; app.js:7974-7978; app.js:8117; tools/step4/statements.js:23-24 |
| Remedy | Tag the strength row with its note's claim, otherwise with a class claim ('This map's reading' for a working figure). On the compact card, say 'working figure' as it already does for ranges, or link to the note. |
| Effort | 2-4 h (presentation, with css/runtime tests) |
| Risk of the remedy | Changes compact-card rows (check:visual layouts; the phone cut-text checks) |
| Validation | runtime-test; check:visual phone cases |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | sources-oob #4 |

<a id="cl-src-07"></a>

**CL-SRC-07 · S4 · P3 · confirmed defect.** Army-total notes omit figures the project read and credit Duffy with a total he does not give

| field | |
|---|---|
| Subsystem | data.js gqg.note, ahq.army, ahq.note |
| User impact | The army totals' stated ranges look narrower and better sourced than the sources read show. |
| Status / origin | confirmed (register readings; Duffy on the text layer) / inherited |
| Expected | Ranges include the figures read; an attribution matches the work. |
| Observed | Narrower ranges; 85,400 credited to Duffy |
| Evidence | - gqg.note's 'Other accounts range from 65,000 to 75,000' omits Mikhailovsky-Danilevsky 1844 p. 171, 'до 90,000' (C5.26, page image), and Duffy's own 'effective force ... as little as 60,000' (text layer). - ahq.army's 'about 85,400 ... (Duffy 1977; Smith 1998)': Duffy gives 'between 80,000 and 87,000 troops, with 278 pieces' (text layer). - The Bulletin's 105,000 goes unremarked. |
| References | data.js:152; data.js:154; data.js:444; data.js:446; docs/step4-evidence/readings.md:2615-2625 (C5.26); docs/audit-post8-evidence/sources-oob/ledger.md L01-L04 |
| Remedy | Reword the two notes with the read figures. Attribute 85,400 to its actual source, or replace it with Duffy's range. |
| Effort | 1 h |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | sources-oob #7 |

<a id="cl-src-08"></a>

**CL-SRC-08 · S4 · P4 · optional improvement.** Stronger or earlier sources uncredited, and two locator slips (Kamensky's 'about 2,000 each' is printed by Schonhals p. 177, which also braces Kursk into the brigade, not by Sokolov p. 195, which gives battalions only)

| field | |
|---|---|
| Subsystem | data.js notes; appearance.js locators |
| User impact | Small loss of evidential strength and traceability |
| Status / origin | confirmed / inherited |
| Expected | The strongest source read is cited; locators are exact. |
| Observed | As listed |
| Evidence | - Decision 202 (b) cites only Mikhailovsky-Danilevsky; the 30th Bulletin (grade A) p. 450 also says 'Il avait avec lui la division Friant et les dragons de la division du général Bourcier'. - Duffy prints working figures the map calls its own or leaves unsourced: V Corps 12,700 with 20 guns; I Corps 13,000; Langeron 11,700; Bagration 13,700 with 42; Liechtenstein 5,375. - Kamensky's 'about 2,000 each' is credited to Duffy only, although Schönhals and Sokolov (both read) print it; Schönhals's brace also includes Kursk. - Fieffé's locator says 'footnote', but the passage is body text on p. 17. - The ru_musk coat cites the grenadier table (Viskovatov p. 196) without the musketeer extension on pp. 229-230. |
| References | data.js:267-268; data.js:275; data.js:370; data.js:501; data.js:517; data.js:601; appearance.js:160-163; appearance.js:323-325; docs/audit-post8-evidence/sources-oob/pages/corr11-1863-p450-bulletin30.png |
| Remedy | Fold into the next data task. |
| Effort | 1-2 h |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | sources-oob #8 |

<a id="cl-src-09"></a>

**CL-SRC-09 · S4 · P3 · unresolved historical question.** A January 1806 letter by Buxhowden naming Langeron as having sent Kamensky back is missing from the Kamensky dispute and the registers

| field | |
|---|---|
| Subsystem | historical data: analysis.js EVENTS[#kamensky].why, narrative.js sides, docs/step4-evidence/readings.md C1 |
| User impact | The 'who turned the brigade' dispute shows the 'Langeron sent it' side as Schönhals's alone (an official history published 1873); a contemporary document by Langeron's superior supports it. The disagreement is kept, so only the weight of one side is understated. |
| Status / origin | open / inherited |
| Expected | CLAUDE.md: 'Where sources disagree, keep the disagreement. Prefer primary and specialist sources': a dated 1806 document in an edition the project reads, bearing on a named dispute, registered and weighed. |
| Observed | EVENTS[#kamensky].why names five sides (Mikhailovsky-Danilevsky, Schönhals, Kutuzov's official and private relations, Stutterheim); the step-4 cluster read pp. 241-242, 255-258 and 265-270 of the same volume but not no. 250 (pp. 260-262). |
| Evidence | Kutuzov documents t. II (1951) no. 250, '1806 г. января 21. — ПИСЬМО Ф. Ф. БУКСГЕВДЕНА М. И. КУТУЗОВУ', p. 262 (archive.org 20250102_20250102_1833 page n290), read on the page image: 'Не должно ли приписать в вину графа Ланжерона, что он пошел на деревню Сокольниц? [...] А притом генерал-майора графа Каменского 1-го с полком его и другими рассеянными несколькими командами послав назад, тем храброго сего генерала с его отрядом подвергал крайней опасности' ('and moreover, by sending Major-General Count Kamensky 1st back with his regiment and several scattered detachments, he exposed this brave general and his detachment to extreme danger'). No hit for 'Dubno\|no. 250\|послав назад\|kutuzov1951 pp. 260-262' in the step-4 and step-2 registers or narrative.js. Ledger L10. |
| References | analysis.js:296-298; data.js:521; docs/step4-evidence/readings.md:281-291; docs/step4-evidence/readings.md:509-519; docs/audit-post8-evidence/sources-chronology/pages/kutuzov1951-p262-n290-buxhowden-letter-kamensky.png |
| Cause (hypothesis) | Step 4's C1 cluster read the Kutuzov documents by targeted pages (the relations and reports) and did not page through no. 250, Buxhowden's answer to Kutuzov's letter of 16 January. |
| Remedy | Register the reading (page image n290; grade by the register's rule: a letter of January 1806 by the left wing's commander, at second hand for the II Column; label fact; disputed) and add it to the 'Langeron sent the brigade' side of EVENTS[#kamensky].why's narrative.js entry; a data task under CLAUDE.md's rule (check:data reference moves). |
| Effort | S |
| Risk of the remedy | low |
| Validation | Re-read p. 262 on the image; test.js's narrative checks (registered reading, sides from two sources) pass with the new side. |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | sources-chronology #1 |

#### CL-GEO: geography: relief, water, settlements and landmarks

<a id="cl-geo-01"></a>

**CL-GEO-01 · S2 · P1 · confirmed defect.** The relief model is 30-80 m too low over the southern Pratzen plateau and the chapel knoll and about 45 m too high at Slapanice, while the visitor is told it is fitted to surveyed elevations

| field | |
|---|---|
| Subsystem | relief model (world.js height/localHeight, tools/relief-fit.js, geo.js vertical scale) |
| User impact | On the default landscape the ground under the afternoon's central scenes (the I-II Columns' dawn ground, Kamensky, the French guns on the heights over the meres, Napoleon at the chapel) is drawn 120-320 m lower at 4x than survey would give, the plateau's southern half is missing, and the valley fog covers ground that stood above it; nothing tells the visitor. |
| Status / origin | confirmed / inherited |
| Expected | Relief within its method's error over the battle core, or its departures stated where the relief is described (CLAUDE.md: never invent terrain; label uncertainty). |
| Observed | Anchored summits within 0-5 m, departures up to 80 m between anchors; the sources sheet names only reverse stream gradients and the chapel's sight line; the Pratzen place's 'Extent: runs north-south between Blasowitz and the Litava' is not what the relief shows (its high ground ends about 1 km south of the Pratzeberg). |
| Evidence | Model = GEOREF.elevM(hAt) on the audited sources. Southern box (map x 270-330, y 295-350): model mean 228.1 m vs GLO-90 273.4 m; 32 of 36 cells above the fog top 238.2 m on survey, 9 in the model. Profiles: Pratzeberg-Augezd mean -39 m, worst -82; Sokolnitz-Hostieradek mean -25, worst -82 (model flat about 219 m, survey ridge to 298 m). SRTM 30 m agrees with GLO-90 within 0-7 m at 6 points where the model is 47-81 m low. St Anthony's chapel (OSM point): model 198 m vs 240 m, 8 m above Augezd's 190 m. Slapanice: model 273 m vs 225 m (Wikidata 230). 300 m core grid rms 20.1 m, 18 cells beyond 50 m. Fitted at 12 anchors, none there. |
| References | world.js:273-300; tools/relief-fit.js:4-9; geo.js:44-50; data.js:797; data.js:799; data.js:651-654; docs/audit-post8-evidence/geography/extra.json; docs/audit-post8-evidence/geography/plateau.json; docs/audit-post8-evidence/geography/dem.json; docs/audit-post8-evidence/geography/fig-relief-banks.png |
| Cause (hypothesis) | parametric surface (plateau bump 50 x 60 world units, crest ridge 8 units wide, named bumps) fitted at 12 elevation anchors; no southern-plateau or Ricka-valley term |
| Cause verified | yes: relief-fit.js anchors and TERMS read |
| Remedy | Before calling the map finished, state the measured departures in the sources sheet and the eye-level note. Then a geographic data task: surveyed anchors on the southern plateau (about 307-311 m at map 288,311; 292-298 m at 297,328), the chapel knoll (about 240 m) and Slapanice (225-230 m) in relief-fit.js, or a DEM-derived grid; re-measure fog extent, knowledge readings, viewsheds, going, self-test pins and motion baselines; CHANGELOG was/is/why. |
| Effort | disclosure 0.5 day; refit 3-8 days with consequences; DEM grid 1-3 weeks |
| Risk of the remedy | moves fog, knowledge, viewsheds, going, cover thresholds and dependent baselines |
| Validation | re-run dem.js --analyse, plateau.js, extra.js: southern box mean within 10 m, profiles' worst within 20 m, Slapanice within 10 m |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (premise); CONFIRMED (repro)] |
| Auditor's note | Verifiers: an unfitted Slapanice bump gives 22 of the +49 m there; P1 holds for the disclosure, the refit itself is a P2 data task. |
| Area finding | geography #1 |

<a id="cl-geo-02"></a>

**CL-GEO-02 · S3 · P2 · unresolved historical question.** 'Walled castle' and 'pheasantry enclosure' are stated as fact in the 08:00 dispatch, against the project's own records

| field | |
|---|---|
| Subsystem | narrative and landmarks (PHASES[2].lede, FEATURES[#sokolnitz].sub, prz@2 act) |
| User impact | The Now tab's 08:00 dispatch, untagged, says the columns attack 'its walled castle and the pheasantry enclosure'; the castle is drawn without a wall, the 1825 sketch draws none round the pheasantry, and the castle's walls are on the unresolved list. |
| Status / origin | confirmed / inherited |
| Expected | An unresolved question not stated as settled on the primary path. |
| Observed | Settled in the dispatch; unchecked tags only in dossiers. |
| Evidence | PHASES[#2].lede, FEATURES[#sokolnitz].sub and prz@2's act carry no claim; paintDispatch writes the lede untagged; narrative.js:91: 'The castle's walls and the pheasantry's enclosure are this map's record, not checked here.'; appearance.js: the orchard wall disputed, not drawn; 8H G2: no wall drawn in 1825. |
| References | data.js:68; data.js:536; data.js:706-708; narrative.js:90-91; app.js:7670; appearance.js:1019-1021; docs/STAGE8_SPEC.md:5102 |
| Remedy | Data task (text): drop or attribute 'walled' and 'enclosure', claims added, chronology L9 rehash if touched. |
| Effort | 0.5 day |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | geography #6 |

<a id="cl-geo-03"></a>

**CL-GEO-03 · S3 · P2 · probable problem.** Outside Sokolnitz the hydrography is schematic and unlabelled: the Bosenitz brook and the Ricka through Slapanice are not drawn, and the upper Goldbach runs where no stream runs today

| field | |
|---|---|
| Subsystem | hydrography (GOLDBACH_M y < 176, BROOKS_M), legend |
| User impact | No stream at the Santon's foot or through Slapanice, a Goldbach source 1.1 km east of the Santon, brooks up to 1.8 km from any watercourse, with no sign of uncertainty (only the meres say 'schematic'); four French cavalry divisions are drawn crossing a reach that does not exist today. |
| Status / origin | confirmed / inherited |
| Expected | Streams from evidence or labelled schematic, as the meres are (decision 27). |
| Observed | Only a code comment calls the Rakovec schematic (world.js:59); no legend row for streams; the Goldbach place states its course (unchecked). |
| Evidence | Tvarozensky potok: 4.65 km in the frame, 51 m from Bosenitz and 131 m from the Santon, all over 300 m (up to 3.0 km) from any drawn stream; the Ricka from the NW edge through Slapanice: 12.2 km over 300 m (up to 6.4 km); drawn Goldbach y 109-176: 275-1,153 m from any modern stream; BROOKS[2] median 772 m (max 1,828) and BROOKS[0] 208 m from OSM's nearest waterway. Kellermann, Nansouty, d'Hautpoul, Walther 0->5 cross the drawn upper Goldbach at y 127-152. |
| References | world.js:51-60; shell.html:247-248; data.js:685-687; docs/audit-post8-evidence/geography/waterways.json; docs/audit-post8-evidence/geography/extra.json; docs/audit-post8-evidence/geography/crossings.json |
| Remedy | Quick: a legend row and a sources-sheet sentence on the streams' schematic courses. Then a geographic data task drawing the Bosenitz brook and the Ricka from the 1825-52 maps and checking the upper Goldbach and BROOKS[2]; re-measure crossings and the relief carve. |
| Effort | label 0.5 day; drawing 2-4 days |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | geography #3 |

<a id="cl-geo-04"></a>

**CL-GEO-04 · S3 · P3 · probable problem.** Between Girzikowitz and Sokolnitz the drawn Goldbach departs up to about 300 m from today's channel and puts Girzikowitz and Kobelnitz on the opposite bank

| field | |
|---|---|
| Subsystem | hydrography (GOLDBACH_M north of y 309.8) |
| User impact | The armies' dividing line runs east of Girzikowitz and Kobelnitz on the map and west of both today: the kind of bank error 8J corrected at Sokolnitz. |
| Status / origin | inferred / inherited |
| Expected | The bed where period evidence puts it, or marked unverified. |
| Observed | Four straight legacy vertices; no period map read north of y 309.8 (world.js:47), though 8H obtained the 1825 Kobelnitz sketch. |
| Evidence | Today's Goldbach = OSM Roketnice to its mouth at map (202.6,225.3), then the Ricka. Girzikowitz: drawn bed 172 m east of the village, today's 170 m west; Kobelnitz: drawn 79 m east, today's 91 m west; Puntowitz and Sokolnitz same bank in both. sthilaire@2 'Crosses the Goldbach and forms for the attack' is 146 m west of the drawn bed and 62 m east of today's. Reach y 212-300 50-340 m off today's channel. |
| References | world.js:41-52; docs/audit-post8-evidence/geography/extra.json; docs/audit-post8-evidence/geography/waterways.json; docs/stage8-evidence/8h/geo/proposal.md:21-26 |
| Remedy | Georeference the 1825 sketches of Kobylnice (held) and Jirikovice, then a geographic data task on GOLDBACH_M with the anchors' sides recomputed; until then say the course there is unverified. |
| Effort | 2-5 days |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | geography #2 |

<a id="cl-geo-05"></a>

**CL-GEO-05 · S3 · P3 · confirmed defect.** Sokolnitz, Telnitz and Kobelnitz are drawn standing in marsh: marsh ellipses cover their centres and the cover classifier ranks marsh above village

| field | |
|---|---|
| Subsystem | land cover (MARSH, coverClass) |
| User impact | The three villages fought over all morning stand on marsh ground on the landscape; 81-92% of their buildings sit on the marsh or water class. |
| Status / origin | confirmed / inherited |
| Expected | Villages on dry ground in their own class, the marsh beside them. |
| Observed | As evidence; recorded open, no owner decision. |
| Evidence | Planner records in node: on the village class Sokolnitz 4/27, Telnitz 2/25, Kobelnitz 3/16 (Puntowitz 14/19, Satschan 10/14; all 309/377). Centres inside MARSH[0] (Sokolnitz 0.57, Telnitz 0.57), MARSH[1-2] (Telnitz), MARSH[4] and [6] (Kobelnitz 0.25, 0.28). coverClass returns water and marsh before village. 8H's page measure 0%, 5%, 19%, 74%; open since 8G. |
| References | world.js:119-132; world.js:314-316; docs/audit-post8-evidence/geography/buildings.json; docs/STAGE8_SPEC.md:4700-4702 |
| Remedy | Geographic data task: village before marsh inside a village's place, or MARSH kept off the villages; re-measure cover fractions, going and the self-test's cover and buildings checks. |
| Effort | 1-2 days |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | geography #4 |

<a id="cl-geo-06"></a>

**CL-GEO-06 · S3 · P3 · unresolved historical question.** The Goldbach bottom's marshiness, an open question, is drawn and told as settled, the opening's first step included; the movement audit never tests stream crossings and exempts marsh within 695 m of any village

| field | |
|---|---|
| Subsystem | land cover and narrative (MARSH, TERRAIN_LINES, FEATURES goldbach, TOUR[0]); movement audit |
| User impact | The opening's first step tells a first-time visitor the Goldbach runs 'in a marshy bottom' and the map draws marsh ellipses 1-2 km across round Telnitz, while the project lists December 1805's marshiness as unresolved (the meres were frozen that day). |
| Status / origin | confirmed / inherited |
| Expected | The open question shown where the claim is made (as the vineyard's legend row does) and a rule that can fail a crossing. |
| Observed | Settled wording on the primary path; the question absent from SOURCE_NOTE's list; streams never tested. |
| Evidence | TOUR[0].x and FEATURES[#goldbach].sub/facts have no claim; the terrain line's note is outside the inventory; MARSH[0]'s comment: rests on that note, not re-examined. 46 legs touch drawn marsh or water; kienmayer 2->7 lies wholly on marsh (664 m); 9 anchors on marsh, 20 on water; 30 of 50 stream crossings away from any village place or road crossing. crossingProblem tests ponds and marsh only and exempts points within 22 map units (695 m) of any village: 0 findings. |
| References | analysis.js:371; data.js:685-688; world.js:119-121; world.js:188-189; app.js:3378-3398; docs/STAGE8_SPEC.md:5100-5103; docs/audit-post8-evidence/geography/crossings.json |
| Remedy | Reword or label the marsh statements, add the question to the open questions and a qualifier to marsh; add stream crossings away from villages and roads to the movement audit. |
| Effort | text 0.5-1 day; audit rule 1 day |
| Prior records | history: interpolated legs across the Litava; the movement audit tests neither; history: no check covers rivers |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | geography #5 |

<a id="cl-geo-07"></a>

**CL-GEO-07 · S3 · P3 · unresolved historical question.** Krug is drawn 1.67 km south of where the 1836-52 survey and today's map put it, and the visitor is told no source read fixes it

| field | |
|---|---|
| Subsystem | settlements (VILLAGES, SOURCE_NOTE) |
| User impact | Bagration's outposts 'in Krug and Holubitz' read as a line 1.6 km long north to south; the two places adjoin (Kruh 0.56 km WNW of Holubitz). |
| Status / origin | confirmed / inherited |
| Expected | A place drawn on the evidence read, or its distance stated; the register's figure correct. |
| Observed | As evidence. |
| Evidence | Drawn Krug [339,139] 1,671 m at 359 deg from Wikidata's Kruh, which lies 562 m at 288 deg from drawn Holubitz; Bellowitz 1,302 m from Bedrichovice. SOURCE_NOTE: 'which no source read fixes'. 8K's register read the Second Survey's 'Kruch' immediately west of Holubitz (the grade on which 8K moved the post and road) and gives the drawn Krug as '2.9 km away' (measured 1.67 km). |
| References | world.js:137-148; data.js:798-799; data.js:604; docs/stage8-evidence/8k/register.md:36; docs/stage8-evidence/8k/register.md:234; docs/audit-post8-evidence/geography/places.json |
| Remedy | Candidate data task: Krug to the Second Survey's Kruch (C for 1805), Bellowitz to its RUIAN point as Turas was, bag@0's act checked; until then correct the note and the register's 2.9 km. |
| Effort | note 0.5 day; data task 1-2 days |
| Prior records | history: open questions drawn or shown without qualification: Krug and Bellowitz |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | geography #7 |

<a id="cl-geo-08"></a>

**CL-GEO-08 · S4 · P4 · confirmed defect.** The Pratzen church is drawn 161 m from its read site while the sources sheet says it is drawn at its own site

| field | |
|---|---|
| Subsystem | buildings planner (churchPlan8g, v8Settle), self-test |
| User impact | Minor: the church stands 161 m east-north-east of its churchyard's place. |
| Status / origin | confirmed / new-regression (Stage 8, 8J) |
| Expected | Drawn at its site, or the sheet stating the offset; a tolerance near the church's size. |
| Observed | As evidence. |
| Evidence | Planner record at map (281.33,252.89), 161 m from LANDMARK_SITES.church.Pratzen (277.0,255.6). The legacy straight Pratzen-Sokolnitz track ('course unverified') passes 72 m from the site and its ribbon's clearance moves the church. The self-test admits 5 world units (316 m). Node, same code and default factor as the page's boot plan. |
| References | world.js:162; world.js:83; world.js:1794-1812; app.js:8497; app.js:14147-14149; docs/audit-post8-evidence/geography/buildings.json |
| Remedy | State the offset, or let a read landmark site displace the unverified track; tighten the self-test's tolerance for read sites. |
| Effort | 0.5-1 day |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | geography #8 |

<a id="cl-geo-09"></a>

**CL-GEO-09 · S4 · P4 · confirmed defect.** The sources sheet reads 'Terrain relief is exaggerated about 1 times' at 1x

| field | |
|---|---|
| Subsystem | sources sheet ({EXAG}) |
| User impact | An awkward sentence at true scale. |
| Status / origin | confirmed / inherited |
| Expected | At 1x the sentence says the relief is drawn at true scale. |
| Observed | 'exaggerated about 1 times'. |
| Evidence | {EXAG} is replaced by fmtFactor(DISPLAY.factor), which returns '1' at 1x. |
| References | data.js:797; app.js:8591-8592; app.js:2575 |
| Remedy | Branch the sentence at 1x (presentation). |
| Effort | under 1 hour |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | geography #9 |

<a id="cl-geo-10"></a>

**CL-GEO-10 · S4 · P4 · unresolved historical question.** Two carried geographic questions are not visible to a visitor: the Goldbach's channel north of the castle and the highway's course in 1805

| field | |
|---|---|
| Subsystem | sources sheet (SOURCE_NOTE), FEATURES olmutzroad |
| User impact | Small: the two channels lie 110-150 m apart; the 1826-52 road is very likely the 1805 chaussee, but the map does not say it is inferred. |
| Status / origin | confirmed / new-regression (Stage 8, 8J and 8K records) |
| Expected | Every question 21.9 calls kept open in the sources sheet listed there. |
| Observed | Both absent from SOURCE_NOTE. |
| Evidence | The channel question is in a code comment only; the highway's place states its course (unchecked) and the open-questions list names only the post's 1805 place; ROADS[0]'s 'C for 1805' is a code comment. |
| References | world.js:47-50; world.js:66-71; data.js:768-771; data.js:799 |
| Remedy | Add both to SOURCE_NOTE's open questions. |
| Effort | under 0.5 day |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Verifier: docs/STAGE8_SPEC.md 21.9 says its unresolved questions are kept open in the sources sheet; four are not in SOURCE_NOTE.body[5]. |
| Area finding | geography #10 |

#### CL-SIM: simulation, state and the readings

<a id="cl-sim-01"></a>

**CL-SIM-01 · S2 · P2 · confirmed defect.** The open dossier goes stale while the clock moves within a phase: 'Position at 12:03' still shown at 12:37, a place's 'Formations nearby now' wrong in 86 of 240 place-phases

| field | |
|---|---|
| Subsystem | dossier / drawer (app.js drawerKey, paintDrawerBody) |
| User impact | A visitor who opens a formation's or place's dossier and plays or scrubs within a phase reads a stale position, time and 'nearby now' list stated as current; the dossier contradicts the map beside it. |
| Status / origin | confirmed / inherited |
| Expected | An open dossier's rows that state the clock or 'now' (Where, Position at HH:MM, Midpoint at HH:MM, the day-track's dot, Formations nearby now) follow the clock. |
| Observed | setClock repaints the dossier within a phase only when drawerKey changes; the key holds each formation's text phase and hidden state, not its place. C1: Napoleon's headquarters' card painted at 12:03 ('Zuran mound') unchanged at 12:37 when the model has it at 'Stare Vinohrady', 4.8 km on; the full dossier still says 'Position at 12:03'. C2: a standing formation's dossier says 'Position at 04:05' at 04:45. C3: 86 of 240 place-phases end with a 'Formations nearby now' list the model no longer has (under everyone's reading; 0 under Napoleon's headquarters). C4: 49 aggregate-phases keep a midpoint the model has left. |
| Evidence | docs/audit-post8-evidence/state/props-bundle2.txt (C1-C4); README.md finding 2 |
| Reproduction | node tools/audit-post8/state/props-bundle2.js <isolated copy root> (python3 build.py && node tools/mk-world-mod.js && node tools/mk-helpers.js first) |
| References | app.js:3498; app.js:7720-7728; app.js:7908-7913; app.js:2488; app.js:2498; app.js:8232-8243; runtime-test.js:1058-1110 |
| Cause (hypothesis) | drawerKey omits the clock-dependent rows' inputs |
| Cause verified | yes (paintDrawerBody wrapped; repaint inputs read) |
| Remedy | Repaint the open dossier's clock-dependent rows when their values change (e.g. include a rounded clock or the computed place in drawerKey for those rows, or repaint those rows each minute); add a runtime test that opens a dossier and moves the clock within a phase. |
| Effort | hours to 1 day |
| Dependencies | none |
| Risk of the remedy | repaint cost each minute; focus must be kept |
| Validation | the C1-C4 checks re-run: 0 stale rows |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (premise); CONFIRMED (repro)] |
| Auditor's note | The auditor read app.js:3498 and 7720-7728: within a phase the dossier is repainted only when drawerKey changes, and the key holds each leaf's text phase, moving or standing, and hidden state, not its place or the clock: confirmed by reading. Verifiers: the stamped rows ('Position at 12:03') are honest but stale; the unstamped card rows and the place list are the misleading part. |
| Area finding | state #1 |

<a id="cl-sim-02"></a>

**CL-SIM-02 · S2 · P2 · confirmed defect.** 'Whose eyes?' still draws the movement arrows, arrow labels and plateau count of formations the reading does not know

| field | |
|---|---|
| Subsystem | Whose eyes? / overlays |
| User impact | Under the Allied headquarters' reading at 09:30 the map omits Suchet's and Caffarelli's divisions (unknown to it) but draws their derived arrows, drawn on to their current place, with their names: a visitor exploring what the Allies knew is told where Lannes's divisions were going. The plateau label's French figure is computed over every formation, known or not. |
| Status / origin | confirmed / inherited |
| Expected | 'Not known: not drawn' (STAGE5_SPEC D.5 item 1), for every drawing of a formation, its movement arrow and label included; the map's own derived readings either follow the reading or say they do not. |
| Observed | Under a headquarters' reading the movement arrows and their labels of formations it does not know are drawn (at 09:30 the Suchet and Caffarelli arrows, faint, with their labels), and the plateau count leaks: under the Allied reading 31,500 against 25,800 known (11:30-12:30); under Napoleon's 38,700 against 17,900 (04:30-07:00); the Now tab's and the caption's 'on the heights' reading leaks the same way. |
| Evidence | eyes-al-counters (1600x900, 09:30, Study, Landscape with counters, Field vantage, reading 'al'): no c:suchet or c:caffarelli item, while o:Suchet and o:Caffarelli are drawn with their arrows (OVERLAYS[4] arrows leg ['suchet',0,5], ['caffarelli',0,5]). rebuildOverlays builds every arrow of the phase and drawOnArrows draws each to its formation's place with no reading test; readHidden is applied only in the dossier, the march rows and the places' lists (decision 251's scope). plateauStrength sums every formation on the plateau, so the plateau label reads 'French ≈ 13,300' under the Allied reading as under everyone. |
| References | app.js:3101-3116; app.js:3027-3041; app.js:4061-4071; app.js:4325-4329; docs/STAGE5_SPEC.md:526-531; docs/audit-post8-evidence/visual-maps/crops/reading-leak-arrows-pair.jpg; docs/audit-post8-evidence/visual-maps/crops/reading-leak-arrows-pair.json; docs/audit-post8-evidence/visual-maps/d1600/eyes-al-counters.json |
| Cause verified | yes (code read; capture) |
| Remedy | Skip (or ghost) arrows and arrow labels bound by a.leg or a.of to a formation readHidden reports; mark the plateau and centre readings 'everyone's' under a reading or compute them over known formations; add a self-test check under both readings every 10 minutes. |
| Effort | 0.5-2 days |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (premise); CONFIRMED (repro)] |
| Auditor's note | The same family as CL-SIM-05 (decision 251 (a)'s reach): drawn overlays here, a card's text there. |
| Area finding | visual-maps #4 |

<a id="cl-sim-03"></a>

**CL-SIM-03 · S3 · P2 · confirmed defect.** A theme chosen while the clock plays does not stop it: the clock runs on and Follow takes the camera from the theme's view within seconds

| field | |
|---|---|
| Subsystem | themes (app.js setChapter) |
| User impact | A visitor who picks an analysis theme while Play runs loses the theme's moment and view within seconds; the explanation then describes a different moment from the one shown. |
| Status / origin | confirmed / inherited |
| Expected | As app.js's own comment says (8827: 'the tour and the themes stop the clock'), choosing a theme stops Play and holds the theme's moment and view. |
| Observed | B4: playing at 05:00, the theme 'plan' put the clock at 04:00 and Play went on (04:10 two seconds later). D2: 1.7 s after the theme was chosen the camera target is 7 units from the theme's authored target, at 3.7 s 63 units, at 7.7 s 76 units; clock 04:28, still playing. |
| Evidence | docs/audit-post8-evidence/state/props-bundle.txt (B4), props-bundle3.txt (D2); README.md finding 1 |
| Reproduction | node tools/audit-post8/state/props-bundle.js / props-bundle3.js <isolated copy root> (python3 build.py && node tools/mk-world-mod.js && node tools/mk-helpers.js first) |
| References | app.js:4193-4207; app.js:6944; app.js:4674; app.js:7487; app.js:7554; app.js:8827; app.js:8906 |
| Cause (hypothesis) | setChapter never calls stopPlay (the tour and the phase and act buttons do) |
| Cause verified | yes (code read + driven) |
| Remedy | Call stopPlay in setChapter as applyTour does; add a test. |
| Effort | minutes |
| Dependencies | none |
| Risk of the remedy | low |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | The auditor read app.js:4193-4207: setChapter sets the clock and flies the camera but never calls stopPlay: confirmed by reading. |
| Area finding | state #2 |

<a id="cl-sim-04"></a>

**CL-SIM-04 · S3 · P2 · confirmed defect.** The overlays' fade draws the outgoing phase's arrows when it should not: with the Movement layer off every phase change flashes them at about 0.87 opacity, and a phase change that interrupts a fade pops them back to 0.9 (stepping through phases quickly flashes each skipped phase's arrows)

| field | |
|---|---|
| Subsystem | overlays (app.js rebuildOverlays, applyOverlayOpacity) |
| User impact | Arrows of a phase the visitor stepped past flash on screen for about a second: a misleading glimpse of movements not belonging to the moment shown. |
| Status / origin | confirmed / inherited |
| Expected | An interrupted fade continues from the opacity reached; a skipped phase's never-shown arrows stay hidden. |
| Observed | rebuildOverlays resets ovFadeIn=0, ovFadeOut=1; the outgoing group is drawn at 0.9*ovFadeOut whatever it had reached. At 4x with the dwell off 5 of 9 boundaries pop (the 08:00 phase's 41 materials 0.13 to 0.90 as 08:45 begins); dwell on: 0. Opening: 1 pop when Next is pressed at once. Clock stopped, two phase steps 0.5 s apart: the stepped-through phase's arrows (never visible, 0.00) drawn at 0.90 and fade over 1.09 s. |
| Evidence | docs/audit-post8-evidence/state/props-bundle.txt (B5, B13), props-bundle3.txt (D1); README.md finding 3 |
| Reproduction | node tools/audit-post8/state/props-bundle.js / props-bundle3.js <isolated copy root> (python3 build.py && node tools/mk-world-mod.js && node tools/mk-helpers.js first) |
| References | app.js:3114; app.js:3185; app.js:3194; app.js:3473-3478 |
| Cause (hypothesis) | fade state reset on rebuild |
| Cause verified | yes |
| Remedy | Carry the outgoing group's current opacity into the new fade (start ovFadeOut from the reached value), or skip drawing a group that never became visible. |
| Effort | hours |
| Dependencies | none |
| Risk of the remedy | low |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch); CONFIRMED (batch)] |
| Auditor's note | Merged: the interrupted fade (state) and the Movement layer off (interaction) are two scenarios of one opacity rule in applyOverlayOpacity. Verifier: one fix covers both scenarios: start the outgoing group from the opacity it had reached, the layer's factor included (app.js:3185). |
| Area finding | state #3; also reported as interaction #4 |

<a id="cl-sim-05"></a>

**CL-SIM-05 · S3 · P3 · confirmed defect.** Under a reading that does not know a formation, its card's 'Doing now' still names where it is

| field | |
|---|---|
| Subsystem | dossiers under 'Whose eyes?' (decision 251) |
| User impact | The card says 'Where: Not known to Allied headquarters at 07:30' and, two rows above, 'Doing now: Standing in fog behind Puntowitz, hidden from the plateau'; the reading's hiding of the formation's place is undone in prose. |
| Status / origin | confirmed / inherited |
| Expected | Decision 251 as 8A records it: a formation the reading does not know is hidden from every place a visitor could read its position from. |
| Observed | 8A kept act texts as 'orders, not places', but these texts state places and present activity. |
| Evidence | docs/audit-post8-evidence/interaction/s3-selection-reading.json reading0730.card and docs/audit-post8-evidence/interaction/s11-state-hypotheses-card-under-allied-reading-0730-dom.jpg (real clicks: OOB row, the Eyes button twice). Scope (docs/audit-post8-evidence/interaction/s12-act-leak.json, app globals, every 10 min): Napoleon's reading hides a formation with a 'Doing now' text 480 formation-clocks, 320 of them naming a place (18 distinct texts, e.g. Kienmayer 07:00-12:40 'Attacks Telnitz'); the Allied reading 798, 304 naming a place (17 texts). |
| Reproduction | tools/audit-post8/interaction/s3-selection-reading.js, s12-act-leak.js |
| References | app.js:7794 (s2=stateAt(id,textPhase(id,clock))); app.js:7818 (the 'Doing now' row, not tested against readHidden); app.js:7819 (the 'From HH:MM' row, likewise); app.js:4325-4329 (readHidden); docs/STAGE8_SPEC.md:1671-1686 (13.1: hidden 'from every place a visitor could read its position from'; act texts 'reviewed and kept ... orders, not places') |
| Remedy | Owner decision: under a reading, give an unknown formation's 'Doing now' and 'From HH:MM' rows the place rows' 'Not known to ... at ...' (or keep them with a note that the text is the visitor's, not the headquarters'); extend runtime-test's decision-251 block. |
| Effort | 1-2 h plus the decision |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Verifier: 8A's review kept act texts as 'orders, not places', but several are positions and the row is labelled 'Doing now', so the implementation contradicts decision 251's stated scope ('hidden from every place a visitor could read its position from'); the replacement row's wording is the owner's. |
| Area finding | interaction #5 |

<a id="cl-sim-06"></a>

**CL-SIM-06 · S4 · P3 · confirmed defect.** The reading ('Whose eyes?') is cached for the clock's minute at the first instant asked, so it depends on the path: 29 and 38 formation-minutes differ by route

| field | |
|---|---|
| Subsystem | the reading (app.js knowAtClock) |
| User impact | Under a headquarters' reading the same moment can show a formation as known or unknown depending on how the visitor got there. |
| Status / origin | confirmed / inherited |
| Expected | Decision 92: the reading at the clock's minute, the same however the clock got there. |
| Observed | B6: the reading at m+0.9 reached through m+0.1 differs from the same clock sought directly in 29 formation-minutes (Napoleon's HQ) and 38 (Allied); Liechtenstein's cavalry at 08:07:54 'unknown' one way, 'seen' the other. |
| Evidence | docs/audit-post8-evidence/state/props-bundle.txt (B6); README.md finding 5 |
| Reproduction | node tools/audit-post8/state/props-bundle.js <isolated copy root> (python3 build.py && node tools/mk-world-mod.js && node tools/mk-helpers.js first) |
| References | app.js:4288; app.js:4133-4152 |
| Cause (hypothesis) | cache keyed by minute, filled at first instant |
| Cause verified | yes |
| Remedy | Compute the reading at the minute's start (floor the clock) when filling the cache. |
| Effort | minutes |
| Dependencies | none |
| Risk of the remedy | low |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | state #5 |

<a id="cl-sim-07"></a>

**CL-SIM-07 · S4 · P4 · confirmed defect.** The first Play frame after the page went idle advances 120 ms of play (0.6 clock min at 1/2x, 3.6 at 4x)

| field | |
|---|---|
| Subsystem | clock loop (app.js loop) |
| User impact | A small jump of the clock when Play starts from the keyboard; not noticeable at 1/2x. |
| Status / origin | confirmed / inherited |
| Expected | Play's first frame advances one frame's worth. |
| Observed | loop returns on idle frames before lastFrame=now, so the next active frame's dt is the 120 ms cap: 0.600 clock min at 1/2x (a 60 Hz frame is 0.083), 3.648 at 4x. Reached when Play starts on a keydown before any frame has run. |
| Evidence | docs/audit-post8-evidence/state/props-bundle.txt (B9); README.md finding 4 |
| Reproduction | node tools/audit-post8/state/props-bundle.js <isolated copy root> (python3 build.py && node tools/mk-world-mod.js && node tools/mk-helpers.js first) |
| References | app.js:9126-9130 |
| Cause (hypothesis) | lastFrame not updated on idle frames |
| Cause verified | yes |
| Remedy | Set lastFrame=now on idle frames. |
| Effort | minutes |
| Dependencies | none |
| Risk of the remedy | low |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | state #4 |

<a id="cl-sim-08"></a>

**CL-SIM-08 · S4 · P4 · confirmed defect.** Pausing in a dwell's hold leaves the caption naming the dwell's events; the same clock reached by a seek names one

| field | |
|---|---|
| Subsystem | caption (paintSituation) |
| User impact | At 07:00 paused in the dwell the caption reads '... leave the plateau; Kienmayer attacks Telnitz', after a seek to 07:00 only '... leave the plateau' (both true); it changes at the next clock change. |
| Status / origin | confirmed / inherited |
| Expected | The caption is a function of the state it keys on. |
| Observed | Stale until the next clock change. |
| Evidence | docs/audit-post8-evidence/interaction/s5-revisit-determinism.json diff_A0700_F0700 (caption). |
| References | app.js:7352-7377 (paintSituation: its key holds playing and the dwell's events); app.js:8781-8787 (stopPlay: no repaint); app.js:3482-3502, 7613 (repainted only through setClock/paintTimeline) |
| Remedy | Call paintSituation() from stopPlay (and dwellReset), or decide that the dwell's caption should persist at a paused event start and key it so. |
| Effort | 0.5 h |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | interaction #6 |

#### CL-UX: interaction, accessibility and first use

<a id="cl-ux-01"></a>

**CL-UX-01 · S2 · P2 · confirmed defect.** At 400% browser zoom and at WCAG's 320 px reflow width the interface loses content and functions (the card's start, the phase text, the caption, the key, the panels, the sources)

| field | |
|---|---|
| Subsystem | layout (style.css short-viewport rules, app.js syncDock), first-run card, timeline control row, tools |
| User impact | A low-vision visitor who zooms a desktop browser to 400% cannot read the first card's heading and opening lines, never sees the phase's narrative, the caption or the key, and cannot open the panels (order of battle, analysis, command, plans) or 'Accuracy and sources' with the pointer: most of the map's explanation is gone. |
| Status / origin | confirmed / inherited |
| Expected | WCAG 1.4.10 (AA): at 320 CSS px wide nothing but the two-dimensional map itself may need two-dimensional scrolling or be lost: the card scrolls inside itself, the phase text stays reachable (the phone layout's grip sheet does this at 390 px), every control stays on screen and pressable. |
| Observed | 400x225 (400%): the card's box starts at y=-112 (height 228, not scrollable; the page has overflow hidden), so its heading and first lines are off screen; after Esc no phase text, situation or events anywhere (.dispatch display:none, no Now tab); caption 0 px wide; no key; the Panels button under the timeline (hit-test div.tb-top at 3 of 3 points; a real click opened nothing); '?' partly off screen; the timeline 40% of the height. 320x256: the card starts at y=-140; '?' off screen (x=370); Panels opens a rail whose scrolling area is 0 px tall and 'Accuracy and sources' sits under the timeline (a real click opened nothing). The phone held landscape (844x390) also shows no phase text. 200% (800x450) passes: everything reachable (1.4.4 met). |
| Evidence | docs/audit-post8-evidence/a11y/zoom.json (steps 400x225-at4:* and 320x256-at4:*); docs/audit-post8-evidence/a11y/zoom-400x225-at4-1-first.jpg, zoom-400x225-at4-2-explore.jpg, zoom-320x256-at4-2-explore.jpg; 200% for comparison: zoom-800x450-at2-*.jpg |
| Reproduction | Visitor page (no ?harness=1), Chromium context viewport 400x225 at deviceScaleFactor 4 (a 1600x900 screen at 400%) and 320x256 at 4 (1280x1024 at 400%); wait for the card; screenshot; press Esc (real key); then a real click on the Panels button's centre and on 'Accuracy and sources'. |
| References | style.css:619-625 (max-height:430px: .dispatch and .legend display:none); style.css:645-648 (#firstrun anchored to the timeline's top, no max-height or overflow below 431 px tall); style.css:851-862 (held-landscape block: the query is the height's alone, so a zoomed desktop window takes it; #eyesbtn hidden); app.js:8971-8984 (syncDock: below 1080 px the Now tab is hidden and the dispatch is the card); shell.html:116-134 (the tools column, which wraps under the timeline) |
| Cause (hypothesis) | The short-viewport rules (Stage 0, kept by decision 226 for a phone held landscape) hide the dispatch and the key on any window 430 px tall or less, and Stage 3C moved the situation strip into the dispatch, so the Stage 0 comment's premise ('the situation strip keeps the narrative') no longer holds; the phone layout that solves this is gated on min-height 431 px. |
| Cause verified | partly: the rules and the gate read in style.css and app.js; the outcome measured |
| Remedy | By size, not by device: give #firstrun a max-height with overflow:auto at heights of 430 px or less; keep the phase text reachable there (the phone's grip sheet, or the Now tab in the rail); below 720 px wide put the tools, '?' and 'Whose eyes?' behind the Menu whatever the height, or let the timeline's control row wrap; keep the rail's scrolling area a usable height (or take the brand and tabs out of it at small heights). Add a 320x256 and a 400x225 case to check:visual. |
| Effort | 1-3 days (layout, then the visual harness's limits re-measured) |
| Risk of the remedy | medium: the phone and held-landscape layouts share these rules (decisions 223-226, 232); their cases must hold |
| Validation | zoom.js again: card fully on screen or scrollable, narr.lede reachable in one press, every control on screen and pressable at 400x225 and 320x256; check:visual's phone cases unchanged |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (premise); CONFIRMED (repro)] |
| Auditor's note | Reproduction lens: confirmed; the 844 x 390 part (no dispatch) is today's layout kept by decision 226 (a), accepted; no decision record mentions browser zoom or reflow, so the 400% and 320 px parts stand. |
| Area finding | a11y #1 |

<a id="cl-ux-02"></a>

**CL-UX-02 · S2 · P2 · confirmed defect.** On the landscape, a pan, zoom or keyboard pan during a camera glide is undone: the glide carries the camera on to its destination (the paper map's MAPCAM already stops its glide)

| field | |
|---|---|
| Subsystem | camera (LANDCAM, glide, tween slots) |
| User impact | After clicking a vantage, an order-of-battle row or a formation (the centring glide, 1.5 s), a phase (2.6 s), a theme or a tour stop, a visitor who starts dragging, zooming or panning by keys before the glide ends sees the move fought and then reverted: the camera finishes at the glide's view while the Follow button shows off. |
| Status / origin | confirmed / inherited |
| Expected | Any pan, orbit, zoom or key pan stops the running glide where it is; the eye stays where the visitor left it (Stage 3 spec, A.3). |
| Observed | Follow turns off but the camera slot keeps running and overwrites the camera every frame until the glide's end. |
| Evidence | docs/audit-post8-evidence/interaction/s14-glide-input.json: 10 frames into each glide, real input, then 90 frames: vantage (Zuran) + drag: camera moved 525.5 (target+eye displacement, units) after the release to the preset; vantage (Pratzen) + wheel x3: 185.7; dossier centring (Legrand's OOB row) + drag: 185.9; vantage (Allied) + map arrow keys x5: 335.4; freeCam true and the camera slot running at release in each. docs/audit-post8-evidence/interaction/s10-phone.json phone-drag-follow + docs/audit-post8-evidence/interaction/s10b-phone-drag.json: a finger pan 2-2.5 s after tapping phase 4 in the phone's list ended at that phase's preset target (7,10,12) = PHASES[4].cam (7,8,12) framed to the ground; with no glide running the pan holds (3/3). |
| Reproduction | tools/audit-post8/interaction/s14-glide-input.js (1280x720), s10-phone.js |
| References | app.js:6309-6322 (glide: setTween('cam') applyArc every frame); app.js:6479 (LANDCAM free(): freeCam=true only); app.js:6483-6498 (panStart/panTo/panEnd: no tween stop); app.js:6854-6905 (bindCanvas: pointer, touch and wheel handlers); app.js:3460-3478 (startPhaseTransition's camera slot); app.js:129-137 (setTween, stopTweens); app.js:2548 (redrawGround stops both slots since 8H: the one input that does); docs/STAGE3_SPEC.md:249-252 ('off, the eye stays where the visitor put it') |
| Cause verified | yes (code read; the camera slot is set at release in every case) |
| Remedy | Stop the camera slot when the visitor takes the camera: in LANDCAM.free() (and the paper map's MAPCAM moves) call setTween('cam',null) and clear camArc, as redrawGround does since 8H; add a self-test check (drag, wheel, keys during each kind of glide leave the camera where the input left it) and a css-test rule. |
| Effort | 1-3 h |
| Validation | re-run s14 and s10/s10b: moved after input < 0.05 |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (premise); CONFIRMED (repro)] |
| Auditor's note | The auditor read app.js:6309-6322 and 6479-6530: the glide runs in the tween's 'cam' slot to its end; a pan, zoom or key move calls free() (freeCam=true) but never clears _tw.cam, so the next frames apply the glide's arc again: confirmed by reading. Verifiers: the landscape only; the paper map's MAPCAM already ends its glide on input (app.js:4915-4953). Remedy caveat: clearing the tween inside free() would cancel the double-click focus glide; clear it in the pan, zoom and key handlers instead. |
| Area finding | interaction #1 |

<a id="cl-ux-03"></a>

**CL-UX-03 · S2 · P2 · confirmed defect.** On a phone, two thirds of the timeline's rail belong to event markers: a finger's drag there does nothing and a tap jumps to an event

| field | |
|---|---|
| Subsystem | timeline / phone layout |
| User impact | On a phone the rail is the clock's slider. A visitor who puts a finger on the middle of the rail to scrub lands on an event marker's hit area about two times in three: the drag is ignored, and a plain tap instead jumps the clock to that event and opens its dossier over the map. Scrubbing works only from the remaining gaps or from the rail's bottom 4 px. |
| Status / origin | confirmed / inherited |
| Expected | A drag that starts anywhere on the rail scrubs the clock (the rail is the slider, decision 53/3C); a marker's tap target need not swallow the rail's drags. |
| Observed | On a phone (390 x 844): markers take 64.2% of the rail's middle line (the area: 65.8%) and 4.5% 4 px above its foot (the area: 9.4%); a finger's drag that starts on a marker does not scrub, and a tap jumps to the event. A real touch drag from (121.5, 840), where elementFromPoint returns the rail, did not scrub either (run twice), so the rail's bottom 4 px is no reliable escape. On a desktop, at an event start the marker's hit area covers the playhead: a drag that starts there goes to the marker and the rail never sees it. Markers take 24-34% of the desktop rail (a11y area). [verifier's measurement, merged with the interaction area's] Markers take 64.2% of the rail's middle line (the area: 65.8%) and 4.5% 4 px above its foot (the area: 9.4%). But a real touch drag from (121.5, 840), where elementFromPoint returns the rail, did not scrub either (run twice). So 'the rail's bottom 4 px' is no reliable escape under a marker, which makes the defect slightly worse than stated. |
| Evidence | rail-probe.js on the phone page (390x844, density 3, touch): document.elementFromPoint along the rail's middle line (y 832) reaches an event marker over 65.8% of the rail's 374 px (20 of 25 markers), the rail over 34.2%; 4 px above its foot 9.4% and 90.6%. A real CDP touch drag of 80 px starting on the rail (x 51) moved the clock 09:30 to 08:36 and followed the finger; the same drag starting on a marker's hit area (x 121, 'Napoleon releases Soult against the heights') left the clock at 09:30 with nothing selected; a real tap there set 08:25, selected e:decision and opened its dossier. At 1280 and 1600 the markers take 28.5% and 22.7% of the middle line (a mouse can aim). |
| Reproduction | node tools/audit-post8/visual-maps/rail-probe.js |
| References | style.css:344; style.css:379-382; style.css:794; app.js:7529-7531; docs/audit-post8-evidence/visual-maps/phone-390x844/rail-probe.json; docs/audit-post8-evidence/visual-maps/phone-390x844/rail-tap-marker.jpg |
| Cause (hypothesis) | Marker hit areas overlap the rail's centre line and capture touch pointers |
| Cause verified | yes: hit map and the two drags |
| Remedy | Let a pointer that starts on a marker and moves more than a few px hand the gesture to the rail (or let the rail own pointerdown and resolve a tap near a marker to that marker); alternatively move the markers to a strip above the rail on phones. Add a phone touch-drag check to the harness's phone block. |
| Effort | 0.5-2 days |
| Adversarial verification | CONFIRMED: Reproduction lens: confirmed (markers take 64.2% of the rail's middle line; a real touch drag at the rail's foot did not scrub either). The premise lens's 'duplicate' referred to this merge itself; it asked that the merged entry keep S2/P2, as it does. [lenses: DUPLICATE (premise); CONFIRMED (repro); CONFIRMED (batch); CONFIRMED (batch)] |
| Auditor's note | Merged: one hit-area rule, measured on a phone by two areas and at the playhead on a desktop by a third. |
| Area finding | visual-maps #1; also reported as a11y #4, interaction #3 |

<a id="cl-ux-04"></a>

**CL-UX-04 · S3 · P2 · confirmed defect.** The timeline's tooltip covers the control row and swallows a press on Play reached from the timeline

| field | |
|---|---|
| Subsystem | timeline tips (#tltip) |
| User impact | Hovering an event marker, a phase or an act shows its tip above it, over Play, Next, Next event and Follow; it stays while the pointer is over it (WCAG 1.4.13), so moving straight up from the timeline to Play lands on the tip and the first press does nothing (it only dismisses the tip). |
| Status / origin | confirmed / inherited |
| Expected | A tip never covers the controls a visitor reaches for from the timeline, or a press on a control under it reaches the control. |
| Observed | The press goes to the tip; Play does not toggle. |
| Evidence | docs/audit-post8-evidence/interaction/s13-tip-covers.json: at 1280x720 the 07:00 marker's tip box [92,641,472,688] overlaps prev, play, next, nextEv, follow and the act/phase buttons; the centres of Play, Next, Next event, Follow covered; pointer moved from the marker to Play in 12 steps and pressed: element under the pointer #tltip, playing false before and after; at 1600x900 the same (the tips of the phase/act buttons crossed on the way cover Play). Control: pointer to empty ground for 300 ms first, then Play toggles (both sizes). Found by docs/audit-post8-evidence/interaction/s5-revisit-determinism.run1.json (path F: '#play is covered by #tltip'). |
| Reproduction | tools/audit-post8/interaction/s13-tip-covers.js |
| References | app.js:7439-7445 (tipShow: placed at r.top-h-8, above the hovered element); app.js:7457-7476 (bindTimeTips: the tip hoverable, pointerover clears its hide); style.css:250-253 (#tltip z-index 62, pointer events on) |
| Remedy | Place the tips where they cannot cover the timebar's control row (above the timebar or beside the element), or give the control row precedence (the tip yields when the pointer enters a control's box), keeping 1.4.13's hoverability; add a check to the tips self-test. |
| Effort | 1-2 h |
| Validation | re-run s13: play-under-tip-* as expected |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | interaction #2 |

<a id="cl-ux-05"></a>

**CL-UX-05 · S3 · P2 · confirmed defect.** Internal project references are shown to visitors: 'owner decision 106', register ids '(S5.7)', 'roadmap step 6B (docs/stage6-evidence/readings-composition.md)', 'the register (read partly on the text layer)', and in the full dossier's 'Dated by' rows 'Until roadmap step 4b ... (question 177)', '(moveMin)'

| field | |
|---|---|
| Subsystem | data notes shown as text (narrative.js claim notes, data.js timing notes, app.js standardNotes) |
| User impact | The sources sheet and the dossiers speak the project's working language (decision numbers, register ids, roadmap steps, a repository path, a code variable) to a visitor, which reads as unfinished and obscures the sentence's point. |
| Status / origin | confirmed / inherited |
| Expected | Visitor text names sources and reasons in plain words; decision numbers, register ids, roadmap steps, file paths and code names stay in CHANGELOG.md and the evidence registers. |
| Observed | As drawn in 'Accuracy and sources' (89,703 characters): 'Height, owner decision 106: ...'; '... read on the page (S5.7)' (twice) and 'Duffy's order of battle (S5.7)'; 'The situation of 28 October is a reading of roadmap step 6B (docs/stage6-evidence/readings-composition.md) ...'; 'in the register (read partly on the text layer)'. As drawn in the full dossiers' 'Dated by' rows at a clock inside each move: '(moveMin)' (Imperial Headquarters, 12:10), 'Until roadmap step 4b ... (question 177)' and '... was the phase-2 entry ...' (Friant, 07:00 and 09:20), 'Until roadmap step 4b's question 202 ... (phase 2)' (Bourcier), '(question 181)' (grenadiers), '(question 176)' (Langeron's and Przybyszewski's columns); the day-track adds 'anchors graded A/B/C as in the data'. |
| Evidence | docs/audit-post8-evidence/a11y/leaks.json step 'the whole sources sheet' (89,703 characters as drawn; 6 internal references quoted in context); docs/audit-post8-evidence/a11y/leaks-timing.json (the seven full dossiers as drawn, clock and selection set by script, the full dossier opened by its own button); docs/audit-post8-evidence/a11y/jargon.json (lang-scan's 69 visitor strings with such references, most in data never drawn) |
| References | app.js:8553 ('Height, owner decision 106: ...', the sources sheet's standards notes); narrative.js:545 (FORMATIONS.legrand.staff note with the docs path); narrative.js:617, 624, 632 ('(S5.7)'); narrative.js:41 (EVENTS[#counter-march].dispute note: 'in the register (read partly on the text layer)'); app.js:8640 (claimDetail renders every claim's note); data.js:158, 252, 254, 267, 434, 506, 534 (timing notes with 'Until roadmap step 4b' / '(question 17x)' / '(moveMin)'); app.js:7990 (the full dossier's 'Dated by' row renders tm.note) |
| Remedy | A small data task: reword the five claim notes and the seven timing notes for visitors (keep the history in CHANGELOG.md), drop 'owner decision 106' from standardNotes; check:data's reference, narrative.js's hashes and check:chronology's L9 hashes move with it. |
| Effort | 2-4 h |
| Risk of the remedy | low; guarded data: check:data and check:chronology must be moved on deliberately |
| Validation | leaks.js finds no internal reference in the sheet or the full dossiers |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | a11y #3 |

<a id="cl-ux-06"></a>

**CL-UX-06 · S4 · P3 · untested area.** The map's two-finger pinch has never been driven by browser-level touch input (the self-test's pinch is synthetic); the audit's emulated pinches landed on the open event dossier and the timeline, not the map, so they show no fault

| field | |
|---|---|
| Subsystem | touch input (app.js bindCanvas pinch, style.css touch-action) |
| User impact | If a real phone behaves as the emulation did, a visitor who pinches to zoom the map zooms the interface instead and must pinch back; the map's own zoom by pinch would be unreachable. |
| Status / origin | unverified / inherited |
| Expected | A pinch on the map zooms the map (touch-action:none on the canvas keeps the browser out); a pinch beginning on the interface may zoom the page (that is the visitor's zoom, which should stay available). |
| Observed | Map-only pinch: camera position unchanged, page zoomed x3.26. One finger on the timeline: page zoomed further. The emulation's handling of multi-touch touch-action is itself uncertain, so this is not a device result. |
| Evidence | docs/audit-post8-evidence/a11y/phone2.json steps 1 and 4-5 (one-finger drag on the map panned the camera: CDP touches reach the app; a pinch on the map alone: camera unchanged, visualViewport.scale 1 -> 3.259; a pinch with one finger starting on the timeline: 3.259 -> 3.918); docs/audit-post8-evidence/a11y/phone.json step 'pinch out: one finger on the timeline' (1 -> 5, the following taps then missed); docs/audit-post8-evidence/a11y/phone2-05-after-timeline-pinch.jpg |
| Reproduction | Phone context (390x844, density 3, isMobile, hasTouch, iPhone user agent), visitor page, card closed; CDP Input.dispatchTouchEvent touchStart with two points (160,360) and (230,430), ten touchMove steps spreading them 50 px, touchEnd; read landCam.position and visualViewport.scale. |
| References | style.css:8 (canvas touch-action:none); style.css:344 (the rail touch-action:none; the rest of the timeline default); app.js:6854-6890 (bindCanvas: the pinch from two tracked touch pointers); app.js:9258-9266 (the self-test's pinch: synthetic PointerEvents dispatched in the page, not browser input) |
| Remedy | Test pinch-to-zoom on a real iPhone and Android phone (the owner's devices); if confirmed, check that the canvas receives both pointers (no element between), and that the page's own zoom stays possible from the panels. |
| Effort | 1 h on devices; fix unknown |
| Risk of the remedy | unknown until reproduced on a device |
| Adversarial verification | WEAKENED: Verifier: the emulation honours touch-action:none for a CDP pinch and no element of the map layer takes pointer events, so the area's runs show no fault in the map's pinch; what remains is untested: a real device's pinch on the map. [lenses: WEAKENED (batch)] |
| Area finding | a11y #5 |

<a id="cl-ux-07"></a>

**CL-UX-07 · S3 · P2 · confirmed defect.** On a phone a 'Whose eyes?' reading leaves no sign on screen once the Panels close

| field | |
|---|---|
| Subsystem | Whose eyes? / phone layout |
| User impact | Below 720 px the timeline's 'Eyes:' button is hidden; after choosing a headquarters in the Command tab and closing the Panels, the map silently omits the formations the reading does not know, with no label that it is a model reading. |
| Status / origin | confirmed / inherited |
| Expected | 'Labelled as a model reading, everywhere it is drawn' (STAGE5_SPEC D.5 item 4). |
| Observed | No label or indicator on the phone's map. |
| Evidence | rail-probe.js: Menu, Panels, Command, 'Allied headquarters', the rail closed, all by real taps; commandView 'al'; the capture shows the control row 'Play \| Follow 09:30 ½×' and the caption with no reading indicator; #eyesbtn display:none in both phone media blocks. |
| References | style.css:769-772; style.css:851-852; docs/STAGE5_SPEC.md:549-553; docs/audit-post8-evidence/visual-maps/phone-390x844/eyes-al-route.jpg; docs/audit-post8-evidence/visual-maps/phone-390x844/rail-probe.json |
| Cause verified | yes |
| Remedy | Show a compact 'Eyes: Allied HQ' chip (or the derived tag) in the phone's control row while a reading is on. |
| Effort | 0.5 day |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | visual-maps #7 |

<a id="cl-ux-08"></a>

**CL-UX-08 · S3 · P3 · confirmed defect.** On the main screen the derived readings' qualifiers, the Zuran and Allied vantages' 'not what he saw' and the relief's and key's disabled reasons are given only in hover tooltips; the derived caveats are also in the sources sheet, the vantages' caveat nowhere else

| field | |
|---|---|
| Subsystem | interface text (app.js paintSituation, shell.html tools, fitCaption) |
| User impact | Keyboard and touch visitors never see that the 'derived' figures are spatial readings, not casualty figures, nor that the Zuran and Allied vantages are not what the commanders saw; screen-reader users get them as descriptions, mouse users only by resting the pointer. |
| Status / origin | confirmed / inherited |
| Expected | Information that qualifies a figure or a view is visible text, or reachable by focus and by touch (a toggletip button, or the sentence in the Now tab and the eye-level caption); native title tooltips are a supplement only. |
| Observed | span.der carries FLAT_NOTE ('The reconstruction plots formations, not losses. A holding that does not change does not mean the fighting there has stopped.') and SEP_NOTE ('...A spatial reading, not a casualty figure.') in title only; the spans take no focus; on a phone no tooltip exists. The vantage buttons' integrity caveats are titles (Chromium exposes them as accessible descriptions). At 1280x720 the caption reads 'THE DECEPT… · D. · interval Friant's division at Raigern since the ni…'; its full text is the title. |
| Evidence | docs/audit-post8-evidence/a11y/fu-1600x900.json step 1 'titles' (25 elements whose title adds words not in their name or visible text); docs/audit-post8-evidence/a11y/zoom-1280x720-at1-caption-crop.jpg (caption cut to 'THE DECEPT… · D. ·') |
| References | app.js:7347-7348 (SEP_NOTE, FLAT_NOTE); app.js:7368-7370 (written only into title= on span.der, not focusable); app.js:7380 (the same spans in the Now tab's situation line); shell.html:129-131 (van-btn titles: 'a preset view, not what he saw', 'not what the Allied staff saw'); app.js:2581 (relief buttons disabled with the reason in title); app.js:5639 (the squeezed key's reason in title); app.js:5724 (an evidence-skeleton anchor's clock and grade as the canvas's title); app.js:7378 (cap.title=capTitle(cap): the full caption) |
| Remedy | Show FLAT_NOTE/SEP_NOTE as visible text in the Now tab (or a focusable 'what is this?' toggletip); put the vantages' caveat into the camera's own caption when a preset is chosen; give disabled relief buttons a visible hint or keep them enabled with a message. |
| Effort | 2-6 h |
| Risk of the remedy | low (presentation; the notes' words exist) |
| Validation | keyboard-only and touch walk-through finds each caveat without a pointer |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | a11y #2 |

<a id="cl-ux-09"></a>

**CL-UX-09 · S3 · P3 · probable problem.** Forced colours (high contrast): the app has no forced-colors handling; the Layers panel's on/off rows and ground buttons, the speed, Follow and the current phase lose their state, 22 of 25 event markers vanish, and the key's swatches and the side marks before names become identical white squares

| field | |
|---|---|
| Subsystem | style.css (no @media (forced-colors) rule; colour carried by backgrounds) |
| User impact | A Windows High Contrast user cannot tell which layers are on, which ground is drawn, which speed is set or whether Follow is on, loses the timeline's event markers, and loses the French/Allied cue on labels and in the key (the map canvas keeps its own colours). |
| Status / origin | confirmed / inherited |
| Expected | Under forced-colors: active, markers and swatches keep a visible, distinct form (system colours for borders, forced-color-adjust:none for the nation swatches and side marks, or text glyphs). |
| Observed | Chromium's emulation, light palette, no forced-color-adjust anywhere: the key's and the card's nation swatches and the side squares before formation names are all rgb(255,255,255); 22 of 25 event markers vanish (only the bordered decision diamonds remain); on the timeline the pressed ½×, Follow and the current phase look like their neighbours; in the Layers panel on and off rows look alike and Landscape like Paper map. Over the map a pressed button stays distinguishable (opaque against translucent neighbours over the dark canvas); tabs keep a weight difference; the focus ring stays (2 px, forced highlight). |
| Evidence | docs/audit-post8-evidence/a11y/fc.json (forced: true; no element with forced-color-adjust:none; swatches rgb(255,255,255) with black borders; pressed backgrounds opaque against translucent ones); docs/audit-post8-evidence/a11y/fc-01-first.jpg (key and side marks as white squares), fc-05-timebar.jpg (3 of 25 event diamonds; ½× and Follow like their neighbours), fc-09-layers.jpg (on and off rows alike), fc-08-legend.jpg, fc-03-viewmode.jpg, fc-04-tools.jpg |
| References | style.css:380-388 (.ev-mark drawn by background:var(--side-fr\|al)); shell.html:369 (the card's swatches); style.css (no forced-colors rule; no forced-color-adjust anywhere: fc.json fcaNone 0) |
| Remedy | An @media (forced-colors: active) block: pressed and selected states by a system-colour border or outline (Highlight) or a glyph, not by background alone (the layer rows, the mode, speed and vantage buttons, Follow, the current phase); borders on .ev-mark; forced-color-adjust:none on the nation swatches and side marks (their colours are content). |
| Effort | 2-4 h |
| Risk of the remedy | low |
| Validation | fc.js again; on Windows with a contrast theme |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | a11y #6 |

<a id="cl-ux-10"></a>

**CL-UX-10 · S3 · P3 · confirmed defect.** Panels opened from the keyboard do not take the focus or announce themselves: Layers (role=dialog) is reached only on the sixth Tab after its button, and a dossier opened by Enter on a map item leaves focus on the item, about 30 Tabs from the dossier (or Shift+Tab back past the earlier map items and the map group)

| field | |
|---|---|
| Subsystem | tools and the Layers panel (app.js setPop, shell.html order) |
| User impact | A keyboard or screen-reader user who opens Layers, or selects a formation on the map with Enter, is not taken to what opened and hears nothing about it; the dossier sits before the map layer in the DOM, so Tab goes on through the map items and round the whole page first. |
| Status / origin | confirmed / inherited |
| Expected | The opened panel next in the focus order (focus moved to its first control, or the panel placed right after its button), as a disclosure or non-modal dialog does (WCAG 2.4.3). |
| Observed | As in the title. |
| Evidence | docs/audit-post8-evidence/a11y/mapfocus.json step 'Layers by keyboard' (open: hidden false, expanded true, focus on #layersbtn; Tab x7: Field, Zuran, Pratzen, Allied, Overview, then the panel's x and Landscape) and step 'a formation's map item ... Enter' (selection f:gqg, drawer on, focus still on the map item); docs/audit-post8-evidence/a11y/kbd-h-1600x900.json step 'Layers: open, Tab, Esc'; DOM order shell.html:325 (aside.drawer) before shell.html:384 (main, the map layer) |
| Reproduction | Harness page 1600x900, card closed by Esc; focus #layersbtn (set-up), press Enter, then Tab seven times (real keys). |
| References | app.js:7070-7075 (setPop: hidden and aria-expanded set, no focus move); shell.html:116-134 (#tools with the vantage group) and shell.html:137 (#layerpop after them in the DOM) |
| Remedy | On opening by keyboard, focus the panel's first control (Layers) and the dossier's heading (a map item's Enter), giving focus back on close as setPop and the dossier already do from inside; or move #layerpop to follow #layersbtn in the DOM. |
| Effort | 1-3 h |
| Risk of the remedy | low (the self-test's SW-5 focus rules must still hold) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | a11y #7 |

<a id="cl-ux-11"></a>

**CL-UX-11 · S3 · P3 · accepted compromise.** First use: neither the card nor the opening says the map is a reconstruction or what the A/B/C letters beside names mean; the key starts closed

| field | |
|---|---|
| Subsystem | first-run card, opening (TOUR stops 0,5,6,7), legend |
| User impact | A first-time visitor sees grade letters (B, C) on the names and 'derived' tags from the first screen with no explanation until they open the key, the sources sheet or reach the guided tour's ninth stop. |
| Status / origin | confirmed / accepted-compromise |
| Expected | One sentence on the primary path (card or opening's first step): positions are reconstructed and graded A/B/C (the letters by the names), and where the sources are. |
| Observed | Card: colour key and the Pratzen plateau 'which this map reads as deciding the battle'. Opening steps 1-4: battlefield, the French strike, the army divided, the collapse; none mentions reconstruction or grades. The key is collapsed ('Key +'); the grades are explained in it, in the sources sheet's second paragraph and in tour stop 9, which the opening does not include. |
| Evidence | docs/audit-post8-evidence/a11y/fu-1600x900.json steps 1-6 (card and opening texts); fu-1600x900-01-first-screen.jpg, -02-opening-1.jpg |
| References | shell.html:366-374 (the card and its words); app.js:4710 (OPENING.stops [0,5,6,7]); analysis.js:387 (TOUR stop 9: 'Everything you have watched today is a reconstruction: positions are graded A, B or C...'); app.js:5016 (ML.legendOpen false: the key opens closed, decision 49) |
| Remedy | Owner decision needed (decisions 49, 108, 111-115 set the card, the key and the opening): add one sentence to the card or the opening's last step, or open the key's grade rows on the first screen. |
| Effort | 1-2 h after a decision |
| Risk of the remedy | low |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Verifier: accepted compromise is right (decisions 114, 49 and 108 chose the stops, the closed key and the card's words); the finding brings a comprehension argument, not new evidence against their premises: owner question 276. |
| Area finding | a11y #8 |

<a id="cl-ux-12"></a>

**CL-UX-12 · S4 · P3 · confirmed defect.** The Now tab's hint 'The phase text is hidden: press D to show it. During the guided tour...' names a key that does nothing with the single-key shortcuts off, offers no pointer or touch way, and says 'guided tour' during the opening

| field | |
|---|---|
| Subsystem | Now tab (shell.html .now-off), KEYS d row |
| User impact | A visitor who turned the shortcuts off (as WCAG 2.1.4 lets them) is told to press a key that is now inert; a mouse or touch user is told to press a key at all. |
| Status / origin | confirmed / inherited |
| Expected | A hint that is true in every state: a 'Show the phase text' button (or 'Esc shows everything'), its words from LABELS according to SHORTCUTS.on, naming the opening when the opening runs. |
| Observed | As in the title; Esc (showEverything) does bring the text back, but the hint does not say so. |
| Evidence | docs/audit-post8-evidence/a11y/fc.json last step (switch off by Space, the guided tour by a real click, D by a real key with nothing focused: hideDispatch stayed true, the hint unchanged); docs/audit-post8-evidence/a11y/fu-1600x900-02-opening-1.jpg (the hint during the opening) |
| References | shell.html:58 (p.now-off: the hint); app.js:6679 (KEYS row d: the only toggle of the phase text); app.js:6720-6721 (charKey, shortcutMuted: D muted when the switch is off); app.js:4725 (the opening hides the phase text) |
| Remedy | Replace the sentence with a button that calls setDispatchVisible(true), or word it from SHORTCUTS.on; distinguish the opening from the tour. |
| Effort | 1 h |
| Risk of the remedy | low |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | a11y #9 |

<a id="cl-ux-13"></a>

**CL-UX-13 · S4 · P4 · probable problem.** The time rail seeks on any mouse button and has no cancel path: a right or middle press on the rail moves the clock and stops Play; where a context menu swallows the release (platform-dependent, unverified), hovering the rail then scrubs until the next click

| field | |
|---|---|
| Subsystem | timeline rail (app.js) |
| User impact | After a right-press on the rail or a cancelled touch, moving the pointer may scrub the clock unexpectedly. |
| Status / origin | inferred / inherited |
| Expected | A drag ends on pointerup, pointercancel or lostpointercapture, and moves only with a button held. |
| Observed | pointerdown seeks with any button; pointermove seeks while dragging without reading e.buttons; only a window pointerup clears it; no pointercancel or lostpointercapture handler. |
| Evidence | docs/audit-post8-evidence/state/README.md finding 7 (code read) |
| Reproduction | read app.js:7527-7531 |
| References | app.js:7527-7531 |
| Cause (hypothesis) | missing cancel paths |
| Cause verified | no (needs a real browser) |
| Remedy | Handle pointercancel/lostpointercapture and test e.buttons in pointermove. |
| Effort | minutes |
| Dependencies | none |
| Risk of the remedy | low |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | state #7 |

<a id="cl-ux-14"></a>

**CL-UX-14 · S4 · P4 · confirmed defect.** The event jumps' 1.5-minute margin skips a start the clock stands just before (20 of 21 starts from one minute before)

| field | |
|---|---|
| Subsystem | event keys (app.js jumpEvent) |
| User impact | Occasional skipped event when stepping events after a pause or a drag. |
| Status / origin | confirmed / inherited |
| Expected | 'Next event' from just before a start goes to that start. |
| Observed | jumpEvent takes the first start more than 1.5 min ahead; from one minute before, 'next event' skips it for 20 of 21 starts; a pause in a dwell's ease in leaves the clock under 1.25 min before the start. |
| Evidence | docs/audit-post8-evidence/state/props-helpers.txt (P4); README.md finding 6 |
| Reproduction | node tools/audit-post8/state/props-helpers.js <isolated copy root> (python3 build.py && node tools/mk-world-mod.js && node tools/mk-helpers.js first) |
| References | app.js:7596-7605 |
| Cause (hypothesis) | margin larger than the dwell's ease |
| Cause verified | yes |
| Remedy | Use a margin below the smallest step that can leave the clock before a start (or test strictly greater than the current clock). |
| Effort | minutes |
| Dependencies | none |
| Risk of the remedy | low |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | state #6 |

<a id="cl-ux-15"></a>

**CL-UX-15 · S4 · P4 · confirmed defect.** Accessible names and structure: the tablist is named 'The rail', the key's toggle is read 'Key plus/minus', Play becomes 'Pause' while also pressed, the full dossier's headings carry their tag word ('How many record', 'Where reconstruction'), the narrative sits inside the navigation landmark and the tools outside any landmark, and below 1080 px the page has no h1

| field | |
|---|---|
| Subsystem | shell.html semantics, style.css generated content |
| User impact | Screen-reader users hear internal jargon ('The rail, tab list'), a stray 'plus', 'Pause, toggle button, pressed', and find the phase text under 'Army and map controls' navigation rather than the main landmark (which holds only the map layer). |
| Status / origin | confirmed / inherited |
| Expected | Plain names ('Panels' or 'Map panels'); the key's state by aria-expanded alone; Play/Pause either a changing label or a pressed state, not both; the narrative in main or a named region; one h1 at every width. |
| Observed | As in the title. Not a WCAG A/AA failure on its own (names exist; states are exposed); no screen reader was run. |
| Evidence | docs/audit-post8-evidence/a11y/kbd-h-1600x900-axtree.json and kbd-1600x900-axtree.json (Chromium's tree: 'tablist The rail', 'button Key +', landmarks navigation/region/main); docs/audit-post8-evidence/a11y/fu-1600x900.json step 'Play (real click)' (name 'Pause', aria-pressed true); docs/audit-post8-evidence/a11y/fc.json full-dossier step (headings 'H3 Who record', 'H3 How many record', 'H3 Where reconstruction', 'H3 Its day derived') |
| References | shell.html:48 (aria-label="The rail"); style.css:689-690 (.lg-head::after '−'/'+' joins the name); app.js:8793 (textContent 'Pause' with aria-pressed true); shell.html:38-104 (nav.rail holds the h1, the tabs and the Now tab's narrative); shell.html:384 (main holds only #maplayer); app.js:7065, 8979 (rail-hidden below 1080 px: the rail, with the h1, leaves the tree) |
| Remedy | aria-label 'Panels'; the +/− in an aria-hidden span; drop aria-pressed from Play or keep its label constant; a role=region with a name for the rail's tab panel (or move main); a visually hidden h1 outside the rail. |
| Effort | 1-3 h |
| Risk of the remedy | low (the self-test's A-6 check may need its landmark rule updated) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | a11y #10 |

<a id="cl-ux-16"></a>

**CL-UX-16 · S4 · P4 · optional improvement.** Visitor-facing jargon and overloaded letters: 'anchors', 'Plotted leg', 'interpolated', 'G.Q.G.', and three different A/B/C scales (position, timing, appearance) shown side by side ('Position B · Timing B')

| field | |
|---|---|
| Subsystem | dossier wording |
| User impact | Readers meet modelling vocabulary without definition and may read a timing grade as a position grade. |
| Status / origin | confirmed / inherited |
| Expected | One word per idea in visitor text ('plotted position', 'move'), and grade letters always with their scale named ('timing grade B'). |
| Observed | As in the title; the sources sheet defines 'anchors' only indirectly ('a route between anchors'). |
| Evidence | docs/audit-post8-evidence/a11y/jargon.json (anchor 15, leg 7, interpolat 11 visitor strings); docs/audit-post8-evidence/a11y/fu-1600x900.json dossier step ('Position: estimated Position B Timing B ...') |
| References | app.js:7730 (CONF_INTERP: 'between two plotted anchors', guarded); app.js:8004 (day-track note: 'anchors graded A/B/C as in the data'); app.js:6578 (LABELS.reading.leg 'Plotted leg'); app.js:7925-7928 (march row 'the plotted leg's length'); app.js:7987 (timing row '· grade B ·') |
| Remedy | Reword in the next data/presentation pass (CONF_INTERP is guarded: a data task). |
| Effort | 1-2 h |
| Risk of the remedy | low |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | a11y #11 |

<a id="cl-ux-17"></a>

**CL-UX-17 · S4 · P4 · optional improvement.** Small type: 42-47% of visible texts on the main screens are 10.5-11.5 px (controls, tabs, timeline labels, tags), all at or above the project's 10.5 px floor

| field | |
|---|---|
| Subsystem | type scale (tokens.js t-micro 10.5 px, t-small 11.5 px) |
| User impact | Harder reading for older or low-vision visitors at 100% zoom; browser zoom helps up to 200% (A11Y-01 above it). |
| Status / origin | confirmed / accepted-compromise |
| Expected | No WCAG minimum; 12 px is a common floor for interface text. |
| Observed | As in the title. |
| Evidence | docs/audit-post8-evidence/a11y/fu-1600x900.json step 1 small (44 of 105 texts under 12 px; 0 under 10.5); zoom.json 1280x720 (42/95); phone.json (16/49) |
| References | tokens.js:51 (t-micro 10.5px, t-small 11.5px) |
| Remedy | Consider t-small 12 px for controls when the layout is next revisited. |
| Effort | hours, with the visual limits re-measured |
| Risk of the remedy | medium (the harness's drop limits and unobstructed baselines move) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Verifier: the share is 42-50% over the desktop states and 33% on the phone; nothing under the 10.5 px floor. |
| Area finding | a11y #12 |

<a id="cl-ux-18"></a>

**CL-UX-18 · S4 · P4 · optional improvement.** Polish: the phone caption shows two orphan separators when the act and phase shrink to 0 px; at 800 x 450 with the Panels open the vantage row overlaps the dispatch card's top edge by about 10 px; the dispatch sheet's grip looks like a drag handle but only a tap works

| field | |
|---|---|
| Subsystem | timeline, phone caption, tools |
| User impact | Small mismatches between what is shown and what is happening. |
| Status / origin | confirmed / inherited |
| Expected | The indicator shows the speed in force; no orphan separators; no overlap; a handle that can be dragged or does not look like one. |
| Observed | As in the title. |
| Evidence | docs/audit-post8-evidence/a11y/fu-1600x900-03-opening-playing.jpg (½× pressed while 'the clock plays'); docs/audit-post8-evidence/a11y/phone-03-explore.jpg (caption '· · interval Friant's...'); docs/audit-post8-evidence/a11y/zoom.json 800x450 explore (.tools x .dispatch overlap 319-3069 px²) and zoom-800x450-at2-2-explore.jpg; docs/audit-post8-evidence/a11y/phone.json step 'drag up 300 px from the grip' (sheet stayed closed) |
| References | style.css:362-363 (.cap-ph, .act shrink to min-width 0); app.js:7371 (caption markup with its separators); shell.html:62 (the grip) |
| Remedy | Small CSS/JS fixes. |
| Effort | 1-3 h |
| Risk of the remedy | low |
| Adversarial verification | WEAKENED: Verifier: the speed-group item (1/2x shown pressed during the opening's 4x) is contradicted by the code and dropped; the other three stand as polish. [lenses: WEAKENED (batch)] |
| Auditor's note | Overlaps CL-MAP-06 on the phone caption's orphan separators. |
| Area finding | a11y #13 |

<a id="cl-ux-19"></a>

**CL-UX-19 · S4 · P4 · probable problem.** A modal sheet opened mid-drag does not end the drag: the map pans under the '?' sheet

| field | |
|---|---|
| Subsystem | canvas input vs sheets |
| User impact | With the mouse button held on the map, '?' opens the keys sheet while the map keeps panning behind it until release. |
| Status / origin | confirmed / inherited |
| Expected | Opening a modal dialog ends any drag in progress. |
| Observed | The captured drag continues under the dialog. |
| Evidence | docs/audit-post8-evidence/interaction/s6-panels-while-dragging.json help-mid-drag: target x -60.8 to -82.8 (22 units for 60 px) while the sheet was open; no drag held after release. |
| References | app.js:6854-6894 (bindCanvas: pointer capture, the drag ends only at pointerup/pointercancel); app.js:6752 (SHEETS) |
| Remedy | End the canvas drag (panEnd, drag=null, release capture) when a sheet opens. |
| Effort | 0.5 h |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | interaction #7 |

<a id="cl-ux-20"></a>

**CL-UX-20 · S4 · P4 · optional improvement.** Focus falls to the page when a resize hides the focused control

| field | |
|---|---|
| Subsystem | focus management on layout change |
| User impact | A keyboard user with focus on Layers who narrows the window below 720 px (the tools go behind the Menu) is left on the body, and stays there when the window widens again. |
| Status / origin | confirmed / inherited |
| Expected | SW-5's rule: focus handed to a shown successor. |
| Observed | Focus on body after the resize. |
| Evidence | docs/audit-post8-evidence/interaction/s7-resize-rotate.json layers-at-1024 focus #layersbtn; layers-at-700, -390, -1600 focus body. |
| References | app.js:7104-7118 (onResize: no focus hand-on); app.js:7189-7203 (shown/focusTo: used when panels close, SW-5) |
| Remedy | In onResize, if the focused element is no longer shown, focusTo a successor (the Menu button on the phone layout, else Play). |
| Effort | 0.5-1 h |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | interaction #8 |

#### CL-MAP: the map layer, labels, map furniture and the paper map

<a id="cl-map-01"></a>

**CL-MAP-01 · S2 · P2 · confirmed defect.** Landscape with counters: during Play five to eight formations' counters are hidden most of the time, up to 28 s (about 100 clock minutes) at a stretch; the cavalry's starvation is inherited, Stage 8 lowered the share drawn (78% to 68% over the morning) and lengthened the gaps; the benchmark's 4,033 ms is only its window

| field | |
|---|---|
| Subsystem | map layer in motion (app.js mlCollect priorities; the MLS stabiliser, implementation PR 8C) |
| User impact | A visitor following the morning at 1/2x in Landscape with counters (52 s of playback) sees the four divisions of Murat's Cavalry Reserve, both Guard cavalries and Miloradovich unlabelled most of the time; Miloradovich's counter vanishes at 09:15 and stays hidden for 28 s of playback. The figures and outlines remain, unidentified; each counter is reachable by hover or keyboard (decision 39). |
| Status / origin | confirmed / inherited, aggravated in Stage 8 (8C's hold through Play and the later data and layout) |
| Expected | Each formation in view labelled most of the time during Play with short, bounded gaps, as the default Landscape achieves (83-89% drawn, gaps <=2.5 s). |
| Observed | Reproduced by the verifier: 67.5% (08:30-11:30) and 72.3% (12:00-15:00) of in-view formation-frames drawn, against 78.4% and 85.6% on the pre-Stage-8 build; d'Hautpoul 9.8% (pre-Stage-8 5.4%), the Russian Guard cavalry 15.7% (8.1%), the French Guard cavalry 16.2% (23.8%), Walther 15.9% (39.0%); Miloradovich's longest gap 27.7 s, about three times the pre-Stage-8 build's; every number within 0.4 points or 70 ms of the area's but one (12:00-15:00's longest gap is the French Guard cavalry's 18.0 s, not d'Hautpoul's 15.3 s). |
| Evidence | docs/audit-post8-evidence/visibility/tables.md (hybrid-0830, hybrid-1200, hybrid-4x-day, hybrid-0830-60, hybrid-fixed-0830, hybrid-watch-0830, hybrid-fr-0900, hybrid-al-0900); items.json; runs/raw-hybrid-*.json; stills/hybrid-0830-f450.jpg |
| Reproduction | node tools/audit-post8/visibility/long-play.js --runs hybrid-0830 (tools/visual/motion.js VIEWS.hybrid: 1600x900, Study, Landscape with counters, the Field vantage; seek 08:30, Follow on, 1/2x, eight frames at rest, Play to 11:30, 30 frames at rest); node tools/audit-post8/visibility/analyse.js |
| References | app.js:5114; app.js:5126; app.js:5339; app.js:5342; app.js:5383-5386; app.js:5474; app.js:5477-5482; docs/STAGE8_SPEC.md 22.3, 23.2, 23.4; tools/visual/thresholds.js:251-269 |
| Cause (hypothesis) | Crowding on the French left (the Santon, Murat's divisions, the Imperial Headquarters, Lannes) and on the Stare Vinohrady heights, decided by a priority rule that ranks divisions by strength (cavalry last), plus the stabiliser's hold strategy for the whole of Play (Play is a motion source even with a still camera): an item not drawn needs room at two successive 333 ms passes, held places are kept. |
| Cause verified | partly: a fresh layout in the same frames starves d'Hautpoul (3.8%), the Russian and French Guard cavalries (10.4%, 20.8%) and Walther (26.1%) nearly as much (crowding + priority, inherited), while Miloradovich (fresh 47.9%) and Kellermann (42.1%) lose mainly to the stabiliser; 26-56% of the hidden formation-frames had room in that very frame. |
| Remedy | Treat it with V-2's priority change, then let a held item that a fresh layout would place ahead of a kept lower-priority item take its room at a pass (section 22.3's 'kept first while moving' variant met the ceilings but failed seven runs' visibility baselines); re-measure the 16 motions and the long runs; an owner decision on decision 240 (a)'s order and the MOTION.VIS baselines. |
| Effort | 1-3 days (code change, re-measurement, owner decision) |
| Dependencies | owner decision (decision 240 (a), MOTION.VIS baselines) |
| Risk of the remedy | room given to one formation is taken from another (a selection shows it: Saint-Hilaire 80.6% to 51.1% when Nansouty is selected) |
| Validation | the long runs here re-run: no formation under 50% over 08:30-11:30; gaps bounded in clock minutes; the 16 motions within their ceilings |
| Prior records | docs/STAGE8_SPEC.md 22.3 'Play's longer hidden interval'; docs/STAGE8_SPEC.md 23.2 'What it does not show' |
| Adversarial verification | WEAKENED: Both lenses: real and reproduced in Landscape with counters; the origin as stated was wrong (the cavalry's starvation is inherited, worse before Stage 8 for d'Hautpoul and the Russian Guard cavalry; Stage 8 lowered the totals and lengthened the gaps): corrected. Not an accepted compromise: section 23.2 leaves longer playback to this audit. S2 kept. [lenses: WEAKENED (premise); WEAKENED (repro)] |
| Area finding | visibility #1 |

<a id="cl-map-02"></a>

**CL-MAP-02 · S3 · P3 · probable problem.** The formations a live event names are hidden while their event's label is drawn (the Guard cavalry clash 0-16%; Miloradovich at the face-about 0-40%)

| field | |
|---|---|
| Subsystem | map layer priorities (app.js mlCollect) |
| User impact | The visitor reads 'Rapp's counter-charge breaks the Chevalier Guard' or 'Kutuzov orders the 4th Column to face about' on the map while the counters of the formations it names are absent; a counter that vanishes as its event begins reads as the formation leaving. |
| Status / origin | confirmed / inherited |
| Expected | While an event is live, the formations it names labelled, as the event label itself is (decision 39 protects the label). |
| Observed | Landscape with counters, share of the named formations' in-view frames drawn while the event's label is drawn: guard-broken (11:15-13:15) French Guard cavalry 0.0% / 10.8% / 4.2% (08:30, 12:00 and 4x-day runs), Russian Guard cavalry 1.5% / 16.0% / 4.2%; guard-attack Russian Guard cavalry 3.7-12.2%, Russian Guard infantry 8.3-34.6%; face-about Miloradovich 0.0-40.0%; blasowitz Russian Guard infantry 0.0-24.0%; hq-forward Imperial Headquarters 77.7%. All named formations: 53.8-66.2% (Landscape 75.2-80.2%, paper map 96.7%, phone with counters 40.2%). The event labels themselves 100%. |
| Evidence | docs/audit-post8-evidence/visibility/README.md table C; tables.json runs.*.evForms (with freshLayoutShare); stills/ |
| Reproduction | as V-1; analyse.js's evForms over runs/raw-hybrid-0830.json, raw-hybrid-1200.json, raw-hybrid-4x-day.json |
| References | app.js:5126; app.js:5144; app.js:5476; analysis.js:248 (EVENTS[].forms) |
| Cause (hypothesis) | mlCollect gives a counter pri 3 + rank (echelon, strength) with no term for live events; live events' labels are protected and placed first, on the ground where their formations fight. |
| Cause verified | yes for the rule (app.js:5126, 5144, 5476); for the Guard cavalries a fresh layout also fails (0-16%), so no stabiliser change alone would show them; for Miloradovich, the Imperial Headquarters, Rivaud and Caffarelli the fresh layout would draw them (33-100%) and the stabiliser hides them. |
| Remedy | Raise every formation a live event names (and its collected parent) to the selected family's priority (pri 1) or protect it while the event is live; measure on the 16 motions and the long runs (an owner decision if MOTION.VIS moves). |
| Effort | 0.5-2 days |
| Dependencies | owner decision if MOTION.VIS baselines move |
| Risk of the remedy | more protected items crowd others out near the action |
| Validation | each named formation drawn >=80% of its event's frames in the long runs |
| Adversarial verification | WEAKENED: Premise lens: protecting event-named formations extends decision 39's never-dropped list, so it needs an owner decision; S3, probable problem. [lenses: WEAKENED (premise); CONFIRMED (repro)] |
| Area finding | visibility #2 |

<a id="cl-map-03"></a>

**CL-MAP-03 · S2 · P2 · confirmed defect.** No symbol key at all between 720 and 1079 px wide or on a phone held upright, so the integrity encodings (the B and C grades, '?', the dashed intended routes) go unexplained there; Watch, Clean and a phone held landscape hide it by recorded design or decision

| field | |
|---|---|
| Subsystem | legend / layout |
| User impact | On every phone, small tablet and 1024 px laptop, and in Watch and Clean at any size, a visitor has no way to learn what the B/C/? badges, status icons, echelon marks, dashed arrows, outlines, grade extents, event glyphs or the eye level's blue sheets mean; only the first-run card's two colours remain. |
| Status / origin | confirmed / inherited |
| Expected | Every presentation that draws encodings offers their key within one press (the legend's own rule: 'one row per encoding on screen', STAGE2_SPEC F.2). |
| Observed | The key is unreachable in those layouts and presentations. |
| Evidence | The legend is the only key (shell.html:206); it is display:none under @media (max-width:1079.98px) (style.css:584) and (max-height:430px) (style.css:624), and in body.pm-watch and body.pm-map (style.css:415, 422). No Key button in the 1024 and phone captures; the '?' overlay lists keys and controls only. Stage 3 recorded the hiding (STAGE3_SPEC.md:694) and moved only the control hints; the phone reach check's features (phone-measure.js:85-87) do not include the key. The phone Layers panel's one-line layer descriptions explain the grades (A footprint, B frontage doubled, C a zone) but no other encoding. |
| References | style.css:575-584; style.css:619-624; style.css:414-427; shell.html:206-269; tools/visual/phone-measure.js:85-87; docs/STAGE3_SPEC.md:694-695; docs/audit-post8-evidence/visual-maps/d1024/land-field.jpg; docs/audit-post8-evidence/visual-maps/phone-390x844/sheet.jpg; docs/audit-post8-evidence/visual-maps/d1600/eye-zuran.jpg |
| Cause verified | yes (CSS read; captures) |
| Remedy | Offer the legend's rows in the phone Menu (or the Layers sheet) and as a collapsed Key button in Watch and below 1080 px; add the key to phone-measure's reach features. |
| Effort | 1-3 days |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (premise); CONFIRMED (repro)] |
| Area finding | visual-maps #2 |

<a id="cl-map-04"></a>

**CL-MAP-04 · S3 · P3 · probable problem.** The only north indicator is the rose inside the legend's toggle, so phones, layouts below 1080 px, Watch and Clean show no compass

| field | |
|---|---|
| Subsystem | map furniture / orientation |
| User impact | The landscape camera orbits freely and two vantages (Allied, Zuran) do not face north; the narrative uses compass directions throughout ('in the north', 'the French right'). In Watch (including the eye level), in Clean, at 1024 px and on every phone the visitor cannot tell which way north lies; below 1080 px the north-up paper map has no north arrow either, and its sheet, the rotated map frame, reads as a tilted sheet. |
| Status / origin | confirmed / inherited |
| Expected | A north indicator on every map view, independent of the key. |
| Observed | North is shown only in Study at 1080 px or wider and more than 700 px tall (style.css hides the rose at 700 px or less), so a 1366 x 768 laptop's browser viewport (about 650 px tall) shows none even in Study; the Field vantage faces 63 degrees from north, the Zuran 135, the Allied 85, the default 09:30 view about 87 (east up); the paper map is north-up by construction. |
| Evidence | The rose (#rose-needle, rotated to true north by updateRose) is an SVG inside the legend's toggle button (shell.html:209-217); no other compass exists in shell.html or app.js. The legend is hidden in the layouts and presentations of V-M2. No compass in the d1024, phone, Watch, Clean or eye-level captures. |
| References | shell.html:209-217; app.js:8371-8380; style.css:584; style.css:624; style.css:415-427; docs/audit-post8-evidence/visual-maps/d1024/paper-entered.jpg; docs/audit-post8-evidence/visual-maps/d1600/eye-zuran.jpg; docs/audit-post8-evidence/visual-maps/phone-390x844/paper.jpg |
| Cause verified | yes |
| Remedy | Draw the rose as its own small control (e.g. beside the scale bar) in every presentation and layout, outside the legend. |
| Effort | 0.5-1.5 days |
| Adversarial verification | WEAKENED: Premise lens: the premise is cartographic convention, not a project rule; the absence of an orientation aid, S3. [lenses: WEAKENED (premise); CONFIRMED (repro)] |
| Auditor's note | The auditor read shell.html:206-215 and style.css: the only rose is inside the legend's toggle button; style.css hides .legend below 430 px tall and .legend .rose below 700 px tall: confirmed in part by reading (the width and Watch/Clean conditions left to the verifiers). Verifier: the rose is also hidden in Study whenever the window is 700 px tall or less. |
| Area finding | visual-maps #3 |

<a id="cl-map-05"></a>

**CL-MAP-05 · S3 · P3 · optional improvement.** The paper map as entered draws none of the 12 place names at 1600, 1280 and 1024 px

| field | |
|---|---|
| Subsystem | paper map / map layer priority |
| User impact | The north-up paper map is the reference view, and the narrative names Telnitz, Sokolnitz, Pratzen, the Santon, the Goldbach and the Zuran throughout; entered, the map shows counters with long leader lines, arrows and event labels but not one village, stream or hill name. The visitor must zoom in or hover to find them. Landscape with counters at the Overview draws none of them at 1280 either. |
| Status / origin | confirmed / inherited |
| Expected | A reference map's entry view names its principal places (a judgement; no decision asks for zero names). |
| Observed | All place names dropped at the entry framing. |
| Evidence | Each capture's layer read-back: places on 0, dropped 12 (t:pratzen, vinohrady, pratzeberg, santon, zuran, goldbach, litava, telnitz, sokolnitz, augezd, satschan, austerlitz) at 1600x900, 1280x720 and 1024x768 (09:30, Study, paper:'frame'); also with a reading. The layer's priority puts place names below counters, events, the plateau reading, movement and plan labels and formation names (app.js:4998-5001); the drop limits accept these counts, so no check fails. 'Pratzeberg' appears only as an objective label. |
| References | app.js:4998-5001; docs/audit-post8-evidence/visual-maps/d1600/paper-entered.json; docs/audit-post8-evidence/visual-maps/d1280/paper-entered.json; docs/audit-post8-evidence/visual-maps/d1024/paper-entered.json; docs/audit-post8-evidence/visual-maps/d1280/counters-overview.json; docs/audit-post8-evidence/visual-maps/d1600/paper-entered.jpg |
| Cause verified | yes (priority order read; read-backs) |
| Remedy | On the paper map draw village and terrain names as base-map lettering beneath the layer (not competing for its slots), or raise place names above overlay labels there; re-measure the paper cases' drop limits and the motion baselines on the owner's word. |
| Effort | 1-3 days (plus re-baselining) |
| Adversarial verification | WEAKENED: Premise lens: within decisions 24 and 39 and their limits; missing reference lettering, an optional improvement. [lenses: WEAKENED (premise); CONFIRMED (repro)] |
| Area finding | visual-maps #5 |

<a id="cl-map-06"></a>

**CL-MAP-06 · S3 · P2 · confirmed defect.** The caption shrinks the act and phase to a letter or nothing with orphan separators, and in Watch at 1280 px its readings and event give way entirely

| field | |
|---|---|
| Subsystem | timeline caption |
| User impact | Visible broken text on common screens: 'THE DECEPT... · D. · interval Friant's division at Raigern since the ni...' on the first screen at 1280x720, '· · derived on the heights...' in Watch at 1600x900, 'T. · · derived centre separation detected' in Watch at 1280. In Watch at 1280x720 (no rail, no Now tab) the caption at 12:00 shows only 'THE ARMY DIVID... · The Russian Guard...': both derived readings and the live event are hidden, available only in a hover tooltip (no touch). |
| Status / origin | confirmed / inherited |
| Expected | Decision 159: readings never cut; what gives way is whole elsewhere. In Watch the readings and the event are the caption's purpose (Stage 3C). |
| Observed | Fragments and orphan dots; in Watch at 1280 the readings and the event are on no visible element. |
| Evidence | Caption read-backs: at 1280x720 Study the act 98 px cut, the phase title 13 px ('D.'); at 04:15 both 0 px wide but displayed, their separators shown; Watch 1280 at 12:00: caption box 270 px, only act and phase shown, both readings and the event fit-off; Watch 1600 at 12:00: act and phase at zero width, the second reading given way. fitCaption gives readings and events way whole but never the act or phase, which only shrink (flex-shrink 1000/100, min-width 0), so their separators stay. Every desktop Watch case in tools/visual/cases.js is 1600x900, so Watch's caption below 1600 is unmeasured. |
| References | app.js:7383-7420; style.css:357-373; tools/visual/cases.js:56-108; docs/audit-post8-evidence/visual-maps/crops/caption-rows.jpg; docs/audit-post8-evidence/visual-maps/visitor-1280x720/first-screen.json; docs/audit-post8-evidence/visual-maps/visitor-1280x720/next-event-1.json; docs/audit-post8-evidence/visual-maps/d1280/watch-1200.json; docs/audit-post8-evidence/visual-maps/d1280/watch-1420.json |
| Cause verified | yes (code read; read-backs) |
| Remedy | Let the act and phase give way whole with their separators (fit-off) below a minimum width, before the readings and the event in Watch (both are whole on the track); add a 1280x720 Watch case or a fitCaption check at 1280 and 1024. |
| Effort | 0.5-1 day |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Verifier: decision 159 is met to the letter but its purpose is lost at 1280 px in Watch; every desktop Watch case of the harness is 1600 x 900, so 1280 is unmeasured. |
| Area finding | visual-maps #6 |

<a id="cl-map-07"></a>

**CL-MAP-07 · S3 · P3 · confirmed defect.** Phone in Landscape with counters: half the formation-frames drawn; Liechtenstein's Fifth Column never drawn from 09:00 to 12:00

| field | |
|---|---|
| Subsystem | map layer on the phone layout |
| User impact | A phone visitor who switches to Landscape with counters loses half the counters during Play; the phone's default Landscape is fine (79.6%, gaps <=2.3 s). |
| Status / origin | confirmed / mixed: inherited crowding (a fresh layout draws 60.1%, Liechtenstein 0.15%) plus new-regression (8C's stabiliser, -8.4 points) |
| Expected | as V-1 |
| Observed | 390x844, 09:00-12:00, 1/2x: 51.7% drawn (fresh 60.1%); corps counters 47.5%: Liechtenstein 0.0% (longest 25,067 ms = 90 clock min), the Cavalry Reserve 13.1%, the Russian Imperial Guard 21.4%; 19.1% of hidden frames had room (mostly crowding). |
| Evidence | docs/audit-post8-evidence/visibility/tables.md phone-0900, phone-land-0900 |
| Reproduction | node tools/audit-post8/visibility/long-play.js --runs phone-0900 (motion.js VIEWS.phone, a desktop context at 390x844 as the motion block's) |
| References | app.js:5126; app.js:5474 |
| Cause (hypothesis) | crowding at the phone's framing plus the priority rule (V-1) |
| Cause verified | partly (fresh layout 60.1%) |
| Remedy | as V-1; or fewer counters at the phone's framing |
| Effort | 0.5-2 days |
| Dependencies | V-1/V-2 |
| Risk of the remedy | as V-1 |
| Validation | phone-0900 re-run |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | visibility #4 |

<a id="cl-map-08"></a>

**CL-MAP-08 · S3 · P3 · confirmed defect.** The legend omits several encodings it draws, against its own one-row-per-encoding rule

| field | |
|---|---|
| Subsystem | legend |
| User impact | Even where the key is shown, a visitor finds no row for the dashed axis arrows of phase 0, the event glyphs (five kinds), the objective marker, the place diamond, the counters' status icons, echelon marks and arm glyphs, or the arrow widths by kind; the 'capture' event glyph (a ring with a cross) and the objective marker look alike. |
| Status / origin | confirmed / inherited |
| Expected | 'One row per encoding actually on screen' (STAGE2_SPEC F.2; app.js:5577). |
| Observed | Seven encodings without a row. |
| Evidence | The rows in shell.html and paintLegend's conditions (app.js:5589-5606) cover nations, figures, standards, the gait, side marks, footprints, outlines, grades, arrows (solid), halts, boundaries, plan staging, wood, village, meres, vineyard, fog, the badge, skeleton, routes, analysis, contours, scales. buildArrow dashes kind 'axis' (app.js:3034; four in phase 0); eventGlyph draws capture/decision/arrival/collapse/default (app.js:3914-3927); STATUS icons ring/square/forward/caution/down/cross (symbols.js:8-24, tokens.js:100-107). |
| References | shell.html:219-269; app.js:5577-5606; app.js:3034; app.js:3914-3927; symbols.js:8-24; docs/STAGE2_SPEC.md:520-526; docs/audit-post8-evidence/visual-maps/crops/paper-key-2x.jpg; docs/audit-post8-evidence/visual-maps/d1600/land-field-key.jpg |
| Cause verified | yes |
| Remedy | Add contextual rows for axis arrows, event glyph kinds, the objective marker and places, and a counter anatomy row (echelon, arm, status icon, badge). |
| Effort | 1-2 days |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | visual-maps #8 |

<a id="cl-map-09"></a>

**CL-MAP-09 · S3 · P3 · probable problem.** Arrow labels repeat formation names in the same plate style as the formations' own names

| field | |
|---|---|
| Subsystem | map layer / overlays |
| User impact | At the Field vantage at 09:30 'Suchet' and 'Caffarelli' each appear twice on the landscape (the name with its side square and badge, and the arrow's label without), and in the counters view as a counter and a serif label with separate leader lines; 'Bagration' labels the Advance Guard of the Right's arrow beside that formation's own counter. A first-time visitor reads two formations of one name. |
| Status / origin | confirmed / inherited |
| Expected | One visible name per formation, or arrow labels styled so they read as the arrow's (movement) label. |
| Observed | Duplicates differing only by the side square. |
| Evidence | land-field.json: both n:suchet ('Suchet B') and o:Suchet, n:caffarelli and o:Caffarelli drawn; counters-field.json: c:suchet, c:caffarelli with o:Suchet, o:Caffarelli; the arrow labels are the OVERLAYS labels (buildArrow adds a.label). |
| References | app.js:3040; app.js:3081; docs/audit-post8-evidence/visual-maps/d1600/land-field.jpg; docs/audit-post8-evidence/visual-maps/crops/counters-field-nw-2x.jpg; docs/audit-post8-evidence/visual-maps/d1600/land-field.json |
| Cause verified | yes |
| Remedy | Drop an arrow's label while its formation's own name or counter is drawn, or style arrow labels distinctly (italic, an arrow glyph, the side's colour). |
| Effort | 1-2 days |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Verifier: also two names on screen for one formation (Bagration / Advance Guard of the Right), against decision 205's one-name rule. |
| Area finding | visual-maps #9 |

<a id="cl-map-10"></a>

**CL-MAP-10 · S3 · P3 · probable problem.** On the landscape the selection is barely distinguished on the map

| field | |
|---|---|
| Subsystem | selection |
| User impact | Selecting a formation opens its dossier, but on the landscape its name keeps the same plate as every other name and its ground cues (a 1 px cream ring at 62% and a 2.2 px cream outline partly under the figures) are the same cream as the plateau outline, leader lines and trails; a visitor has to search for which formation is selected. The paper map and the counters view dim everything else and are clear. |
| Status / origin | confirmed / inherited |
| Expected | The selection the most prominent item on the map (STAGE2_SPEC F.1 puts it first in priority). |
| Observed | Weak cue on the default presentation. |
| Evidence | selRing: THREE.Line in theme accent #EFE4C8 at 0.62; OUTLINE.SEL_LINE 2.2 px in the same accent; plateauRing: THREE.Line in annotation #E3D9BE at 0.5. In the 1280 capture (default layers) the selection ellipse and the plateau octagon read alike; the name 'Saint-Hilaire' is drawn like its neighbours. |
| References | app.js:3959-3988; app.js:2147; app.js:3946; tokens.js:30; tokens.js:69; docs/audit-post8-evidence/visual-maps/d1280/selected-sthilaire.jpg; docs/audit-post8-evidence/visual-maps/d1024/selected-sthilaire.jpg; docs/audit-post8-evidence/visual-maps/crops/sel-paper-map.jpg |
| Cause verified | yes |
| Remedy | Give the selected name an accent edge or inverted plate and dim the other names slightly, as the counters do; draw the ring thicker or in a colour no other annotation uses. |
| Effort | 0.5-1.5 days |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | visual-maps #10 |

<a id="cl-map-11"></a>

**CL-MAP-11 · S3 · P3 · probable problem.** The Plans view mixes about 40 serif labels of the plans and the current phase, and at 1280 px drops plan labels

| field | |
|---|---|
| Subsystem | Plans view |
| User impact | Opened from the Plans tab at the Overview, both plans' labels and the 09:30 phase's own labels share one plate style with no side mark, so the visitor cannot tell French intentions from Allied, or plan from event; at 1280x720 the labels cover most of the plan arrows and three plan labels themselves are dropped. |
| Status / origin | confirmed / inherited |
| Expected | A plan view that reads as the plan. |
| Observed | Plan and present interleaved; plan labels lost at a laptop size. |
| Evidence | 1600: 29 plan labels and 15 other items drawn, 13 dropped; 1280: 40 drawn, 17 dropped, among them pl:Soult concealed in the Goldbach valley, pl:The second axis, pl:Stare Vinohrady. Plan labels carry no side square ('The bait', 'The pivot' beside '1st Column', 'Envelop toward Brünn'). |
| References | docs/audit-post8-evidence/visual-maps/d1600/plans-overview.jpg; docs/audit-post8-evidence/visual-maps/d1600/plans-tab.jpg; docs/audit-post8-evidence/visual-maps/d1280/plans-overview.jpg; docs/audit-post8-evidence/visual-maps/d1280/plans-overview.json; docs/STAGE8_SPEC.md:5315-5330 |
| Cause verified | yes |
| Remedy | While the Plans tab shows a plan, dim or hide the current phase's arrows and labels and give plan labels their side's mark; consider the plans at 04:00 by default. |
| Effort | 1-3 days |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | visual-maps #11 |

<a id="cl-map-12"></a>

**CL-MAP-12 · S3 · P3 · confirmed defect.** In Landscape with counters the Field vantage sits 3% inside the corps threshold, so a short pan ends with every division counter replaced

| field | |
|---|---|
| Subsystem | map layer in motion / aggregation |
| User impact | After a 270 px pan from the Field vantage, 433 ms after release, the 13 division counters drawn (and 7 more held hidden) leave the map together and 8 corps counters fade in (the layer's drawn items 26 to 23): the map the visitor was reading changes level without their asking. |
| Status / origin | confirmed / inherited |
| Expected | An aggregation level that does not flip on an incidental pan from a preset (hysteresis, or presets clear of the threshold). |
| Observed | The swap at rest after a small pan (8C defers it to rest by design, decision 240 (a)). |
| Evidence | Clip log: frames 0-58 division counters (frame 58: 18 counters drawn, 7 held) (c:sthilaire, c:vandamme ... on or held), frame 59 corps counters (c:c_iv, c:c_v, c:c_i, c:c_gd, c:c_cav, c:col4, c:constantine, c:buxhowden). wantCorps = dist>250 with dist held by mlBand while the view moves and released at rest; VANTAGE.field's eye-target distance is 242.8 units. That the pan raised the distance above 250 is inferred (the camera's distance was not logged). |
| References | app.js:6093; app.js:5346-5350; app.js:6333-6339; docs/audit-post8-evidence/visual-maps/clips/counters-pan10.json; docs/audit-post8-evidence/visual-maps/clips/counters-pan10-frame57.jpg; docs/audit-post8-evidence/visual-maps/clips/counters-pan10-frame60.jpg; docs/audit-post8-evidence/visual-maps/clips/counters-pan10-timelines.md |
| Cause (hypothesis) | The pan changed the eye-target distance across 250 |
| Cause verified | partly (swap observed; distance inferred) |
| Remedy | Add hysteresis to wantCorps (e.g. corps above 265, divisions below 235) or move the Field preset clear of 250; re-measure the motion block's counts on the owner's word. |
| Effort | 0.5-2 days |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Verifier: the cause is not the pan's travel but the target re-seated at the pan's end (about +10 units, the picture unchanged), so distance-keyed map-layer levels can flip at rest after any landscape pan; the remedy moves owner-held motion counts (decisions 257 (b), 267 (a)). |
| Area finding | visual-maps #12 |

<a id="cl-map-13"></a>

**CL-MAP-13 · S3 · P3 · probable problem.** Between 720 and 1079 px a selection leaves a 209 px strip of map between the dispatch card and the dossier

| field | |
|---|---|
| Subsystem | layout (undocked) |
| User impact | At 1024x768 (tablet landscape, small laptops), selecting a formation opens the dossier on the right while the dispatch card stays on the left: about a fifth of the width is left for the map, under the top controls. |
| Status / origin | confirmed / inherited |
| Expected | The map keeps a usable area when a formation is selected. |
| Observed | 209 px wide map strip. |
| Evidence | d1024/selected-sthilaire.jpg: card x 16-456, dossier x 665-1024; the card gives way to the dossier only when the rail is shown (style.css:581) or below 720 px. |
| References | style.css:575-582; docs/audit-post8-evidence/visual-maps/d1024/selected-sthilaire.jpg |
| Remedy | Let the dispatch card give way to an open dossier below 1080 px as on the phone, or collapse it to its head. |
| Effort | 0.5-1 day |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | visual-maps #13 |

<a id="cl-map-14"></a>

**CL-MAP-14 · S4 · P4 · accepted compromise.** At rest after Play the kept places leave up to three formations hidden that a fresh view would draw, until the next discontinuity

| field | |
|---|---|
| Subsystem | map layer at rest (MLS persist) |
| User impact | A visitor who pauses to read sees up to three formations unlabelled that a fresh view of the same moment would label; most formations hidden at rest are hidden by crowding anyway. |
| Status / origin | confirmed / accepted-compromise |
| Expected | decision 240 (a): at rest the kept places first |
| Observed | After Play, 0-3 more formations hidden at rest than a fresh view of the same moment would hide (net -1 to +3; the fresh view would hide others instead); persists until the next discontinuity, by decision 240 (a)'s no-reshuffle rule. |
| Evidence | docs/audit-post8-evidence/visibility/tables.json runs.*.restSum |
| Reproduction | any hybrid run; restSum in tables.json |
| References | app.js:5474; app.js:5485-5489; docs/STAGE8_SPEC.md section 15 (decision 240 (a)) |
| Remedy | a fresh layout once the view has rested for a few passes (would trade a reshuffle at rest) |
| Effort | 0.5 day |
| Dependencies | owner decision (240 (a)) |
| Risk of the remedy | labels moving at rest |
| Validation | persistOnly empty in the runs |
| Prior records | docs/STAGE8_SPEC.md 22.3 |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | visibility #5 |

<a id="cl-map-15"></a>

**CL-MAP-15 · S3 · P3 · accepted compromise.** The low views' wall of formation names remains (decision 255 left it open)

| field | |
|---|---|
| Subsystem | map layer / far names |
| User impact | Looking east over the Goldbach at 12:00, 31 labels stand in the top half of the view over a distant cluster, their leader lines converging; the scene the visitor looks at is behind the text. 263 (a)'s lighter plate makes far names a step quieter but the wall's footprint is unchanged. |
| Status / origin | confirmed / accepted-compromise |
| Expected | Decision 255: not marked resolved; option (d) a separate prototype. |
| Observed | As the decision describes. |
| Evidence | d1280/wall-1200: 31 drawn items in y 41-340 of 720 px, 19 names (16 far at 7.06-7.30:1, 3 full at 12.5:1), 3 events, 3 arrow labels, 4 places, the plateau reading; label area 8.5% of the view. |
| References | docs/STAGE8_SPEC.md:2507-2513; docs/STAGE8_SPEC.md:4812-4837; docs/audit-post8-evidence/visual-maps/d1280/wall-1200.jpg; docs/audit-post8-evidence/visual-maps/d1280/wall-1200.json |
| Remedy | Owner's choice: e.g. collapse far names into their corps' or column's name beyond the far step, or a count badge. |
| Effort | 2-5 days |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | visual-maps #14 |

<a id="cl-map-16"></a>

**CL-MAP-16 · S4 · P3 · probable problem.** The default event glyph reads as a north arrow on the paper map, and the 'capture' glyph as the objective marker

| field | |
|---|---|
| Subsystem | symbols / event glyphs |
| User impact | A pale ring with an up-pointing arrow, always pointing up the screen, sits on the north-up paper map (paper-pratzen, top centre) where a reader expects a north arrow; the ring-and-cross 'capture' glyph mimics the objective crosshair. |
| Status / origin | confirmed / inherited |
| Expected | Glyphs that cannot be mistaken for map furniture or another symbol. |
| Observed | Look-alikes. |
| Evidence | eventGlyph: default kind draws a vertical shaft with a head inside a ring; 'capture' draws a ring with a full cross. |
| References | app.js:3914-3927; docs/audit-post8-evidence/visual-maps/d1600/paper-pratzen.jpg |
| Remedy | Point the default glyph along its event's direction or use a distinct shape; give capture and objective different forms. |
| Effort | 0.5 day |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | visual-maps #15 |

<a id="cl-map-17"></a>

**CL-MAP-17 · S4 · P4 · accepted compromise.** The Landscape's formation names blink during Play: 10.6% of in-view frames hidden in 0.6 s episodes, about one per name every 6 s

| field | |
|---|---|
| Subsystem | map layer in motion (MLS two-pass re-admission) |
| User impact | Visible blinking of names during Play in the default view; every name comes back within 0.7 s (2.5 s at worst). |
| Status / origin | confirmed / accepted-compromise |
| Expected | pops within the benchmark's accepted totals (decision 267 (a)) |
| Observed | 09:00-12:00 at 1/2x: 89.4% drawn, a fresh layout 99.9%; 4,087 hidden name-frames in 230 episodes over 26 names in 50.3 s; 98.9% of them had room (the two-pass rule, not crowding). |
| Evidence | docs/audit-post8-evidence/visibility/tables.md land-0900, land-4x-day |
| Reproduction | node tools/audit-post8/visibility/long-play.js --runs land-0900 |
| References | app.js:5339; app.js:5481; docs/STAGE8_SPEC.md 23 (decision 267 (a)) |
| Remedy | none required; a shorter re-admission for an item whose room has been free at one pass would halve it |
| Effort | 0.5 day |
| Dependencies | owner decision |
| Risk of the remedy | more jumps |
| Validation | land-0900 re-run |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | visibility #6 |

<a id="cl-map-18"></a>

**CL-MAP-18 · S4 · P4 · accepted compromise.** The Littawa's name is dropped in the Plans view (section 22.4), and at 1280 px too

| field | |
|---|---|
| Subsystem | Plans view |
| User impact | The river south of the plateau is unnamed in the Plans view; it can be focused by keyboard. |
| Status / origin | confirmed / accepted-compromise |
| Expected | As section 22.4 accepted. |
| Observed | As accepted. |
| Evidence | t:litava dropped at 1600 (13 dropped, the limit 13) and at 1280 (17 dropped). |
| References | docs/STAGE8_SPEC.md:5317-5330; docs/audit-post8-evidence/visual-maps/d1600/plans-overview.json; docs/audit-post8-evidence/visual-maps/d1280/plans-overview.json |
| Remedy | Follows V-M5 or V-M11 if adopted. |
| Effort | none separately |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | visual-maps #16 |

<a id="cl-map-19"></a>

**CL-MAP-19 · S4 · P4 · accepted compromise.** Paper-map arrows grow without a cap when zoomed in

| field | |
|---|---|
| Subsystem | paper map / arrows |
| User impact | At the 250 m scale the movement arrows are 60-80 px wide and cover the formations' marks, the hillshade and the objective (paper-pratzen, paper-sokolnitz). |
| Status / origin | confirmed / accepted-compromise |
| Expected | As decided. |
| Observed | As decided. |
| Evidence | Decision 241 (a)'s scope: 'On the paper map nothing is capped'. |
| References | docs/STAGE8_SPEC.md:1874-1890; docs/audit-post8-evidence/visual-maps/d1600/paper-pratzen.jpg; docs/audit-post8-evidence/visual-maps/d1600/paper-sokolnitz.jpg |
| Remedy | Optional: a screen-space cap on the paper map too. |
| Effort | 1-2 days |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | visual-maps #17 |

<a id="cl-map-20"></a>

**CL-MAP-20 · S4 · P4 · optional improvement.** The map's place names mix German period forms with Czech forms (Stare Vinohrady, Zuran, Litava) under no stated convention

| field | |
|---|---|
| Subsystem | place names (data) |
| User impact | Inconsistent place-name convention on the map; section 22.4 and the stream's own ribbon (world.js) call it the Littawa. |
| Status / origin | confirmed / optional-improvement |
| Expected | One naming convention (decision 205: one name per thing). |
| Observed | German period forms (Sokolnitz, Telnitz, Augezd, Satschan) beside Czech ones (Stare Vinohrady, Zuran, Litava); no single 1805 German convention exists to break; only the records' 'Littawa' differs from the screen name. |
| Evidence | FEATURES litava name 'Litava river', sub 'Also Littawa'; the ribbon is named 'Littawa' in world.js. |
| References | data.js:692-693; world.js:1622 |
| Remedy | A data task if the owner wants it (data.js is guarded). |
| Effort | 0.5 day with the data task's records |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | visual-maps #18 |

#### CL-VIS: the rendered picture

<a id="cl-vis-01"></a>

**CL-VIS-01 · S2 · P2 · confirmed defect.** Figure blocks are drawn sunk into the frozen Satschan mere: in the ponds phase, and wherever a leg's path crosses the drawn disc (at 06:30, 136 of Kienmayer's 222 instances on his phase-1 via are below the ice)

| field | |
|---|---|
| Subsystem | world.js meres (mereLevel, buildWater) / app.js figure seating |
| User impact | At the battle's best-known moment (phase 9, 16:00-17:00) Dokhturov's men, Kienmayer's riders and Buxhowden's camp on the ice look as if they are breaking through it: horses legless, men cut at the thigh. That is a visual claim of the mass-drowning story the narrative keeps disputed (data.js:119, 749; analysis.js:60). Seen when a visitor zooms to the meres (about r 20 units or closer); invisible at the Overview. |
| Status / origin | confirmed / inherited |
| Expected | A formation the data puts on the ice stands on the ice surface. |
| Observed | Blocks are seated on groundY, the carved bed under the disc, up to 0.874 units (62% of a man's 1.415) below the ice plane; the ice (transparent 0.96, depth-tested) covers the sunk parts. The self-test's contact check judges the drawn ground, so it passes. |
| Evidence | docs/audit-post8-evidence/visual-landscape/probe.json (under: Satschan 69% of the disc's ground below the ice, mean 0.266, max 0.874 units; Menitz 78%, max 1.142; formationsInside: kienmayer, dok, buxhowden, friant 16:00-17:00 at depths up to 0.874; kitArt headTop 1.415); docs/audit-post8-evidence/visual-landscape/shots/x-ice-dok-1640.jpg, x-ice-dok-1640-low.jpg, x-ice-bux-1620.jpg; crops/satschan-1200-0-0.jpg (a rider on the ice at 12:00, horse legs hidden) |
| Reproduction | Harness page 1600x900, Watch, 4x; __aus.apply({t:1000, aim:{map:'dok', dir:[0.55,0.45,0.70], r:16}}) (16:40); or node tools/audit-post8/visual-landscape/probe.js out.json |
| References | world.js:1380-1385 (mereLevel: the ice at or below the lowest shore ground minus 0.05); world.js:1454 (8F: depthWrite false, 'nothing visible lies under the ice'); world.js:1469-1470; data.js:465, 480, 495 (phase-9 legs ice:true: buxhowden, kienmayer, dok) |
| Cause verified | yes: probe.json reads the disc level (-4.14) against groundY at the blocks' places |
| Remedy | Seat figures, horses, guns and the HQ camp at max(groundY, the disc's ice level) inside a mere's disc (presentation only), or flatten the drawn bed to the ice level under the disc; add a self-test check that every figure inside a disc stands at the ice surface; re-run the contact check. |
| Effort | 0.5-1.5 days |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (premise); CONFIRMED (repro)] |
| Area finding | visual-landscape #1 |

<a id="cl-vis-02"></a>

**CL-VIS-02 · S3 · P3 · confirmed defect.** Trees and bushes stand on the frozen Satschan mere

| field | |
|---|---|
| Subsystem | world.js woodsPlan (village trees), buildWoods (bank scrub) |
| User impact | 21 deciduous trees and bushes appear to grow out of the ice next to Satschan and Telnitz, in every view of the meres (the ponds' finale, the Telnitz fighting); a visible geography error. |
| Status / origin | confirmed / inherited |
| Expected | No tree or scrub inside a mere's drawn ice (decision 246 (a): nothing added on the ice). |
| Observed | 6 objects visibly rise out of the Satschan ice (4 village trees, 2 bush tops); 14 more bank bushes are planted on the bed under the ice, hidden (world.js: neither the village trees nor the bank scrub test for water). |
| Evidence | docs/audit-post8-evidence/visual-landscape/probe.json (trees.onIceCount 21 inside the drawn disc, 17 on the water class: 4 village trees, 17 'stream' scrub; none on the Menitz mere); docs/audit-post8-evidence/visual-landscape/village-trees.json (the planner's own arithmetic: 3 of 184 village trees on the water class, Telnitz 1, Satschan 2); crops/satschan-1200-0-0.jpg; shots/telnitz-0930-wide.jpg |
| Reproduction | node tools/audit-post8/visual-landscape/probe.js out.json; view shots/satschan-1200.jpg |
| References | world.js:2119-2127 (village trees on a ring round each village, no water test); world.js:2212-2223 (bank scrub along GOLDBACH and LITAVA: tests village cover and buildings only); world.js:53 (LITAVA_M through Satschan, crossing the mere) |
| Cause verified | yes (code read and positions computed in the page) |
| Remedy | Skip a village tree or bank bush inside a disc (or where coverClass is water) without changing the draws consumed, then re-pin the woods counts and confirm no building plan moves (the WOODS_RS hold). |
| Effort | 0.5-1 day |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | visual-landscape #2 |

<a id="cl-vis-03"></a>

**CL-VIS-03 · S3 · P3 · probable problem.** Blocks face along slow drifts and keep stale facings, so some face away from an adjacent enemy

| field | |
|---|---|
| Subsystem | app.js facing rule (headingAt / enemyFacing / faceClock) |
| User impact | Close up, formations in contact show their backs to the enemy: Kamensky's brigade ('counterattack', then 'engaged') faces 130-180 deg away from Saint-Hilaire at 10:00-11:00, 20-420 m off (within 110 m at 10:00-10:20) at the moment the event reads 'Kamensky turns his brigade about'; Saint-Hilaire faces 143-152 deg away from Kamensky (40-90 m) at 09:40-09:50. The rich kit (8E) makes facing legible. |
| Status / origin | confirmed / inherited |
| Expected | A formation in contact faces its opponent unless the data says it turned away; a drift the gait does not animate does not turn the block. |
| Observed | The yaw follows the drift's heading at any rate; a halted block keeps the facing taken toward the nearest enemy at the phase start or on arrival, however the enemy moves. |
| Evidence | docs/audit-post8-evidence/visual-landscape/facings-summary.json (2,051 rows; drifts under 1 km/h 1,146 of 1,440 moving rows, 79.6%; 37 rows with an enemy within 0.5 km and the yaw >120 deg off it, 17 with a fighting status, 29 of them moving; convention check 136/161 = 84.5% halted-near within 45 deg); docs/audit-post8-evidence/visual-landscape/shots/x-face-kamensky-1010.json (yaw 174.8 deg off Saint-Hilaire 0.06 km, moving 0.49 km/h), x-face-sthilaire-0950.json (-142.7 deg, 0.043 km), x-face-prz-0910.json (halted, 152 deg off Legrand 0.322 km), x-face-dok-1350.json (halted, 127.1 deg off Bourcier 0.235 km) |
| Reproduction | node tools/audit-post8/visual-landscape/facings.js <iso-root> out.json (~14 min load); capture shots-extra.json |
| References | app.js:6001-6002 (want=headingAt(id,clock); else enemyFacing); app.js:3336-3345 (headingAt: any leg in progress, whatever its rate); app.js:5740-5774 (faceClock, enemyFacing: nearest enemy at the phase start or arrival); docs/STAGE8_SPEC.md:826-834 (drifts under 1 km/h: no gait swing, decision 244 (a)) |
| Cause verified | yes (read-backs of yaw, heading and rule) |
| Remedy | Below the gait's 1 km/h floor use the enemy rule (or the leg's start facing) instead of the drift's heading; re-take a halted block's facing when its nearest enemy changes materially within a phase; keep S-5 (a function of the clock) and its self-test check (g). |
| Effort | 0.5-2 days |
| Risk of the remedy | A wholesale change could make blocks spin under scrubbing; keep the WHEEL easing and S-5. |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Related, not the same issue: CL-HIS-05 (legs whose direction contradicts the status). Verifier: inherited (enemyFacing cached per phase before 8E); the bearing is centre to centre and blocks overlap at 20-110 m (CL-VIS-04). |
| Area finding | visual-landscape #3 |

<a id="cl-vis-04"></a>

**CL-VIS-04 · S3 · P3 · confirmed defect.** Formation blocks interpenetrate buildings and each other

| field | |
|---|---|
| Subsystem | app.js block placement vs world.js BLDG (8G buildings at plot scale) |
| User impact | Horses and men stand inside houses (Nansouty's cuirassiers in Blasowitz at 10:55; Telnitz at 08:00; the Posoritz post house at 15:00), opposing blocks share ground (Kamensky and Saint-Hilaire at 10:10). Reads as clipping rather than occupation; worst in the villages that carry the narrative (Sokolnitz, Telnitz). |
| Status / origin | confirmed / inherited |
| Expected | Either figures kept clear of drawn buildings or buildings under an occupying block visibly subordinated. |
| Observed | No separation; farmsteads drawn at the building convention (a long range up to 176 x 71 m, probe.json) enlarge the overlap. |
| Evidence | docs/audit-post8-evidence/visual-landscape/crops/cav-close-1055-250-150.jpg; shots/telnitz-0800.jpg, posthouse-1500.jpg, sok-castle-1000.jpg, x-face-kamensky-1010.jpg |
| Reproduction | __aus.apply({t:655, aim:{map:'nansouty', dir:[0.55,0.32,0.77], r:24}}) |
| References | docs/STAGE8_SPEC.md:4982-4986 ('figures are drawn over buildings everywhere', recorded in 8J, not decided); world.js BLDG / planBuildings8g (world.js:1921) |
| Cause verified | yes (visual; no placement rule exists) |
| Remedy | An owner decision first: hide or fade building parts under a block's footprint, or offset figure rows clear of them; the castle case stays under decision 266 (a). |
| Effort | 1-3 days |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | CL-HIS-04 is the one between opposing formations that Stage 8 introduced. |
| Area finding | visual-landscape #4 |

<a id="cl-vis-05"></a>

**CL-VIS-05 · S4 · P4 · probable problem.** Streams saturate to white in grazing and low-sun views

| field | |
|---|---|
| Subsystem | world.js streamHook (8F) |
| User impact | In the low views (the Pratzen vantage at 10:00, the low Pratzen view at 16:30, the climb at 09:00) the brooks become glowing white lines, the brightest thing in the frame, drawing the eye from the troops and readable as roads or highlights; toward the sun at 15:00 the Litava's channel reads as a white wall. |
| Status / origin | confirmed / new-regression |
| Expected | Streams 'still, darker and less blue' (decision 246 (a)). |
| Observed | Toward-sun low views show a white glint on the brooks (218 px at 245 or brighter, 250 at most, in the area's box); STREAM.sky is not the cause (setting it to 0 removes 3 of 218 px); likely the sun's direct specular on 8F's sharper surface plus bloom (inferred, not toggled). |
| Evidence | docs/audit-post8-evidence/visual-landscape/whites.json (236 px at 255 in the brook toward Augezd, v-low-1630; 32 in the Goldbach by Puntowitz, inf-east-0900; 41 behind the castle at 15:00; the Litava channel up to 236 in ice-mid-1500); crops/v-low-1630-900-250.jpg, inf-east-0900-1000-0.jpg, ice-mid-1500-250-80.jpg, sok-castle-1500-close-300-0.jpg |
| Reproduction | __aus.apply({t:990, aim:{map:[285,289], dir:[-1.0,0.13,0.18], r:70}}) |
| References | world.js:1409 (STREAM.sky 2.0); world.js:1446 (radiance *= 1 + 2.0*sG^3 at a grazing view) |
| Cause verified | inferred from the shader term; not toggled here |
| Remedy | Establish the cause first (toggle the stream's roughness and the bloom in the toward-sun views), then tune the material; lowering STREAM.sky would not cure it. |
| Effort | 0.25-0.5 day |
| Adversarial verification | WEAKENED: The glint is real in toward-sun views; the stated cause (STREAM.sky) is refuted by toggling it, and its remedy would not cure it: the cause and remedy rewritten. [lenses: WEAKENED (batch)] |
| Area finding | visual-landscape #5 |

<a id="cl-vis-06"></a>

**CL-VIS-06 · S4 · P4 · unresolved historical question.** Omitted chapels invite a misreading: Bosenitz's church appears to crown the Santon; St Anthony's name stands beside Augezd's church

| field | |
|---|---|
| Subsystem | appearance.js BUILDINGS.notDrawn; world.js CHURCHES |
| User impact | From the south-west views the Bosenitz church, about 720 m beyond the Santon, sits behind the hill's top next to the label 'The Santon'; above Augezd the label 'Chapel of St Anthony' floats over an empty patch with Augezd's drawn church beside it. A visitor can take either church for the chapel the map deliberately omits. |
| Status / origin | confirmed / inherited |
| Expected | An omitted landmark is not visually substituted by another building. |
| Observed | As described; the omission itself is reasoned (form, destruction hour and date not read). |
| Evidence | docs/audit-post8-evidence/visual-landscape/crops/santon-1000-200-50.jpg, crops/stanthony-1300-250-200.jpg; shots/santon-guns-1300.jpg, pratzeberg-0930.jpg |
| References | appearance.js:1065-1068 (notDrawn: stAnthony, santon, granary); world.js:140, 152 (Bosenitz [236,69] with a church), world.js:249 (SANTON=W(222,87)) |
| Remedy | Owner choice among notDrawn's alternatives; at least a site marker or a dossier line saying the chapel is not drawn and why. |
| Effort | 0.25-1 day |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Verifier: the sources sheet says 'Not drawn', but the Santon's and the chapel's place dossiers do not (buildingsSection returns nothing for a landmark): the dossier line is the cheap remedy. |
| Area finding | visual-landscape #7 |

<a id="cl-vis-07"></a>

**CL-VIS-07 · S4 · P4 · optional improvement.** Headquarters drawn as a pitched camp at every status

| field | |
|---|---|
| Subsystem | app.js HQ block (GEO.tent marquee + four tents) |
| User impact | A white pyramid 2.3 units high (1.6x a man) appears among moving guns (14:10) and on the Satschan ice during the rout (16:20-16:40); close up it reads as an unexplained object rather than a staff. |
| Status / origin | confirmed / inherited |
| Expected | A moving or withdrawing headquarters drawn as a mounted group. |
| Observed | The camp is drawn wherever the HQ is, whatever its status. |
| Evidence | docs/audit-post8-evidence/visual-landscape/crops/bat-limbered-1410-800-150.jpg, crops/ice-low8h-1500-300-520.jpg; shots/x-ice-dok-1640-low.jpg |
| References | app.js:811 (GEO.tent ConeGeometry(1.75,2.3,4)); app.js:1542-1546 |
| Remedy | Show the marquee only while the HQ is halted (or never at close range); the riders alone while it moves. |
| Effort | 0.5 day |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | visual-landscape #6 |

<a id="cl-vis-08"></a>

**CL-VIS-08 · S4 · P4 · confirmed defect.** Deciduous crowns near the eye show large faceted shards

| field | |
|---|---|
| Subsystem | world.js TREE8F/TREE8H crowns |
| User impact | In the closest figure views next to woods (Saint-Hilaire's climb at 4x r 10 and 10.33x r 8, the castle close) the crowns break into large brown triangles like broken glass. |
| Status / origin | confirmed / new-regression |
| Expected | Crowns read as bare twig masses at every distance. |
| Observed | As recorded open by 8H; unchanged. |
| Evidence | docs/audit-post8-evidence/visual-landscape/sheets/sheet-troops-2.jpg (slope-10x-0900-r8, slope-4x-0900-r10), crops/sok-castle-1500-close-300-0.jpg |
| References | docs/STAGE8_SPEC.md:4547-4549 (8H: still open, twigs would need another representation); docs/STAGE8_SPEC.md:4699-4700 (listed open) |
| Remedy | As 8H recorded: an alpha-tested twig representation within a few units of the eye, measured for overdraw; or keep and accept. |
| Effort | 2-5 days |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | visual-landscape #8 |

<a id="cl-vis-09"></a>

**CL-VIS-09 · S4 · P4 · optional improvement.** The low tier is decided once at start: a desktop page opened in a small window keeps density 1, no shadows and no near detail when enlarged

| field | |
|---|---|
| Subsystem | renderer tiering (app.js init) |
| User impact | A desktop visitor who starts in a small window sees a lower-quality picture until reload. |
| Status / origin | confirmed / inherited |
| Expected | Quality tier follows the window, or the choice is stated. |
| Observed | lowTier evaluated once (window area under 900x700 or a mobile UA); onResize never re-evaluates; groundDetail chosen once. |
| Evidence | docs/audit-post8-evidence/state/README.md finding 8 (code read) |
| Reproduction | read app.js:621-622, 661, 7104-7118 |
| References | app.js:621-622; app.js:661; app.js:7104-7118 |
| Cause (hypothesis) | by design (one decision at start) |
| Cause verified | yes (read) |
| Remedy | Re-evaluate lowTier on a large resize, or document it. |
| Effort | hours |
| Dependencies | none |
| Risk of the remedy | low |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | state #8 |

#### CL-TEST: tests, benchmarks and CI

<a id="cl-test-01"></a>

**CL-TEST-01 · S3 · P3 · probable problem.** Only the node job is a required check on main: the browser checks run on every push but gate no merge, and check:visual runs only on dispatch (the one red merge, #77, was the owner's knowing merge over question 267's line)

| field | |
|---|---|
| Subsystem | CI (.github/workflows/checks.yml; the repository ruleset on main) |
| User impact | A build whose in-app self-test (317 checks of what a visitor is shown) or contrast states fail can be merged into main and deployed. It happened once in Stage 8: 141f890 (PR #77) was merged and deployed with its self-test failing (the known one-line benchmark excess of question 267), and main stayed red until c2adefe the next day. |
| Status / origin | confirmed / inherited |
| Expected | Decision 132 put check:contrast and the self-test on every push; a merge into main (and the deployment that follows) waits for them, or a merge over a red browser check is an owner decision recorded as one. |
| Observed | Neither browser check gates a merge. The one merge over a red self-test (#77) was made knowingly (CLAUDE.md: 'every required check passes but that one line in check:selftest and check:visual') and was held by the owner's judgement, not by the gate. check:visual's 39 cases (drop limits, unobstructed shares, map text at AA as rendered, census and culling equivalence, the cull motion block, far plates, light, fog, horizon, the phone cases) are required for no merge. |
| Evidence | The repository's only ruleset on main ('protect main.', id 24036909, created 2026-09-26 09:06 UTC, enforcement active) requires a pull request and one status check, context 'checks' (the node job: build, the committed HTML against a fresh build, npm test, check:data, check:chronology; checks.yml:22-40). The browser jobs 'browser (contrast)' and 'browser (selftest)' were added on 2026-10-07 (fd6e537, decision 132) and were never added to the required checks; the job 'visual' runs only on a dispatch with 'visual' ticked (checks.yml:75-76). Check runs read through the GitHub API: PR #77's head ec911c9 has 'browser (selftest)' failure; its merge 141f890 (2026-10-31 07:55 UTC) has 'browser (selftest)' failure (completed 08:44:41) and the Pages jobs 'build' and 'deploy' success; main's next merge c2adefe (2026-11-01 06:55, decision 267 (a)) has it success. 'visual' was skipped on the heads of PRs #71, #73 and #76-#79, passed on #70, #72 and #74, and failed on #75 (8J, merged into its stacked branch, not main); the last dispatched run before the audit (41259079904 on d3f7026, 2026-11-01) passed all four jobs. |
| References | docs/audit-post8-evidence/tests/ci-gate.json; .github/workflows/checks.yml:45-65; .github/workflows/checks.yml:75-76; ruleset 24036909 'protect main.' (GET repos/billybobbyboo/Austerlitz/rules/branches/main); fd6e537 (2026-10-07, decision 132: the browser jobs added); PR #77 head ec911c9 and merge 141f890; c2adefe (PR #78); dispatch run 41259079904 |
| Cause (hypothesis) | the ruleset was written on 2026-09-26, eleven days before the browser jobs existed, and was not revisited |
| Cause verified | dates verified (ruleset created_at, fd6e537); the intent not verified |
| Remedy | Add 'browser (contrast)' and 'browser (selftest)' to the ruleset's required status checks (a settings change; no code). Keep check:visual on demand (decision 132's cost: two to six hours a run), but record in CHANGELOG.md the dispatched run that measured each merged build, or require it on pull requests that touch app.js, world.js, style.css, tokens.js or tools/visual/. |
| Effort | minutes (a ruleset setting) |
| Validation | a draft PR with one self-test check made to fail shows the merge blocked |
| Adversarial verification | WEAKENED: Both lenses: the facts hold; no rule requires the browser checks to gate (decision 132 asked that they run); S3. The lenses differ on P2 or P3 and on probable problem or optional improvement: the auditor takes P3, probable problem (a process risk the project's reliance on the self-test makes real). [lenses: WEAKENED (premise); WEAKENED (repro)] |
| Auditor's note | Verifier: the Pages deployment of main waits for no check. |
| Area finding | tests #1 |

<a id="cl-test-02"></a>

**CL-TEST-02 · S3 · P2 · confirmed defect.** No check can see long gaps: the motion benchmark's longest-hidden measure saturates at its own 121-frame window, and the one check that plays the whole day counts drops, not how long a formation stays hidden

| field | |
|---|---|
| Subsystem | test suite (check:visual / check:selftest motion block) |
| User impact | None directly; a regression that hides formations for longer stays invisible to the safeguard decision 257 (b) relies on. |
| Status / origin | confirmed / new-regression |
| Expected | A visibility safeguard able to see the gaps a visitor meets in normal playback. |
| Observed | 28 formations x 121 frames = the baseline's 3,388; 121 x 33.3 ms = 4,033 ms, the most the measure can report. The long runs' gaps are 12-28 s; in the hybrid runs a formation is hidden for a whole 90-frame window in 6/14 to 17/17 windows. The benchmark's one Play run per presentation starts from a seek at 09:00. The self-test's 4D pacing check plays the whole day at 1/2x but samples one layout pass every ten clock minutes and counts the items dropped (at most 19), in its own state: it cannot see a formation hidden for an hour. |
| Evidence | docs/audit-post8-evidence/visibility/runs/sum-bench-hybrid.json (Nansouty, Walther, Miloradovich hidden in 121 of 121 frames); README.md table D |
| Reproduction | node tools/audit-post8/visibility/long-play.js --runs bench-hybrid; compare thresholds.js MOTION.VIS['hybrid-play'] |
| References | tools/visual/motion.js:187-191 (MOTIONS: hybrid-play 90 frames); tools/visual/thresholds.js:307 (VIS hybrid-play [2033,3388,4033]); app.js:10045-10048 (the self-test's day at 1/2x: one mlLayout every ten clock minutes, dropped items <= 19) |
| Cause (hypothesis) | the motion block was designed for short motions (60-90 frames) and its Play run inherits that length; the day-long check predates the stabiliser and counts drops per sample |
| Cause verified | yes (motion.js MOTIONS; app.js:10045-10048) |
| Remedy | Add a long Play run (08:30-11:30 at 1/2x on the driver without the draw, about 1-3 minutes) to the motion block, judged per formation on the share drawn and the longest gap in clock minutes. |
| Effort | 0.5-1 day |
| Dependencies | owner decision on the new limits |
| Risk of the remedy | CI time (small without the draw) |
| Validation | the new run fails on this build until V-1/V-2 are addressed, or its limits are set at this build's values by the owner |
| Prior records | docs/STAGE8_SPEC.md 23.2 |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Related, not the same issue: CL-TEST-14 (what the motion ceilings mean). Verifier: wider than stated: the hybrid-glide (2,533 ms, 76 frames) and hybrid-orbit with a selection (3,033 ms, 91 frames) baselines are also at their windows, so three of MOTION.VIS's 'longest' baselines cannot fail. |
| Area finding | visibility #3 |

<a id="cl-test-03"></a>

**CL-TEST-03 · S3 · P3 · untested area.** Historical values a data task may change are held only by change detectors that the task itself resets: a strength, a later anchor's grade, a position, a village, the order of battle's hierarchy and a claim's reading fail no check of the property

| field | |
|---|---|
| Subsystem | node suites (test.js, geo-test.js, sim-test.js, audit.js, redteam.js); check:data |
| User impact | A wrong figure, grade or place entered during a data task (the only time such values change) reaches the visitor with every automated check green; only the reviewer's reading of the CHANGELOG's list of changed declarations stands between it and the map. |
| Status / origin | confirmed / inherited |
| Expected | The properties the project ranks first (historical and data integrity) have checks that fail on a plausible slip inside a data task: a strength that disagrees with its own note, a grade raised without a reading, a place moved off its sourced site. |
| Observed | None failed a check of the property itself: M16, M17 and M27 failed check:data alone; M18 failed redteam.js only through an acknowledged warning's text (the infantry mean rate's second decimal moved); M33 failed test.js only on the inventory's freshness; M03 failed the strength sums only because the moved division does not fit under its new corps' declared strength. Within a data task check:data's reference is the task's own build and the inventory and the acknowledgements are regenerated by the task, so none of these would fail anywhere. |
| Evidence | M16: failed data (data identity); M17: failed data (data identity); M18: failed redteam (known-warning text), data (data identity); M27: failed data (data identity); M33: failed test (inventory), data (data identity); M03: failed test, redteam, data (data identity). (M07, which swapped in a reading made partly on the text layer, failed test.js's page-image rule, not a relevance check; M33 swaps in a page-image reading of the same source on another matter and fails only the inventory's freshness.) check:data (data-invariance.js:69-86) fails on any byte of a guarded declaration, and CLAUDE.md requires a data task to move its reference to the task's own build. test.js's strength checks are sums against the parent (test.js:72-74: an error only when the children exceed the parent, a warning beyond 30%) and 13 pinned strengths (test.js:495-505; Saint-Hilaire's is not among them, nor are the other leaf formations'); the grade rule D-2 covers the first positioned anchor only; the claim check verifies that a reading id is registered, of the source named and read on page images, not that it bears on the statement. |
| References | tools/visual/data-invariance.js:69-86; test.js:66-74 (D-3: sums, 30% warning); test.js:495-505 (OOB pins: 13 strengths); geo-test.js:83; test.js:425-446 (claims: register, source, page-image status; no locator or relevance check); docs/audit-post8-evidence/tests/mutations.json M03 M07 M16 M17 M18 M27 M33 |
| Remedy | Add data-integrity checks that hold between data tasks and within them: (1) every strength's note carries the number shown or names it as this map's working figure (M17: note 'about 6,600', value 8,600); (2) every anchor grade A or B names its reading (a reading id per graded anchor, checked like STATEMENT_CLAIMS); (3) pin every leaf formation's strength and every village and anchor position to its CHANGELOG-recorded value with a tolerance of tens of metres, regenerated only by the data task's own command, so that a data task's diff of the pins is the review list; (4) for a claim's reading, keep the human check but list the readings each claim's statement cites in the sources sheet's index (already shown) and in the data task's CHANGELOG entry. |
| Effort | days |
| Dependencies | owner agreement on which values are pinned |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | tests #2 |

<a id="cl-test-04"></a>

**CL-TEST-04 · S3 · P3 · untested area.** No check covers interpenetration, rivers, motion vs status, act sides of the stream, event pill vs statement claim, or carried-forward grades

| field | |
|---|---|
| Subsystem | tests: audit.js, sim-test.js, test.js, check:chronology |
| User impact | The findings above (two of them S2, one a Stage 8 regression) pass every suite; a data task can introduce more without a failure. |
| Status / origin | confirmed / inherited |
| Expected | Data tasks are guarded against these classes. |
| Observed | Unguarded. |
| Evidence | Rules read: auditMovement (rate, ponds, marsh), audit.js (continuity, coverage), sim-test (event agreement, continuity), check:chronology (timed statements). sim-test-iso.txt and audit-js-iso.txt: 0 errors on this build. |
| References | audit.js; sim-test.js; tools/stage2/chronology.js:1-60 |
| Remedy | Add to sim-test.js or audit.js: opposing-centre proximity outside named melees, Goldbach/Litava crossings away from roads, offensive status moving away, act side vs anchor side; to test.js: event pill vs its why's claim, and a declared cf on anchors that move. |
| Effort | 0.5-1 day |
| Risk of the remedy | New KNOWN_WARN entries needed for accepted cases. |
| Validation | Mutations: re-insert the 8J Legrand case; it fails. |
| Prior records | T-6; D-1 |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | history #16 |

<a id="cl-test-05"></a>

**CL-TEST-05 · S3 · P3 · confirmed defect.** Presentation code can rewrite a guarded datum at run time and every check passes, check:data included

| field | |
|---|---|
| Subsystem | check:data (tools/visual/data-invariance.js); runtime-test.js; the self-test |
| User impact | A display-side override (CLAUDE.md: 'Never fix a data problem by changing only the display') would move a formation on screen away from its declared, sourced anchor with no failing check; the dossier, the map and the day-track would all show the overridden value. |
| Status / origin | confirmed / inherited |
| Expected | A check that the guarded declarations are not written after load: the data the visitor is shown is the data declared. |
| Observed | check:data printed 'Rendering and interface declarations changed (1): init' and 'All 139 DATA declarations are byte-identical to the original build' and exited 0 (docs/audit-post8-evidence/tests/m29-check-data.txt); runtime-test.js, css-test.js, test.js, redteam.js, sim-test.js, audit.js and check:chronology passed (sim-test.js, audit.js and check:chronology read the declarations through their own module, not the running app). |
| Evidence | M29: every suite run passed (runtime, css, test, redteam, sim, audit, chron, data). The mutation sets FORMATIONS.sthilaire.track[5].p to a point 0.4 km south as init()'s first statement. data-invariance.js compares the declarations' source text: a changed rendering or interface declaration is listed ('Rendering and interface declarations changed', :79) and the exit code counts DATA declarations only (:86). |
| References | tools/visual/data-invariance.js:79; tools/visual/data-invariance.js:86; app.js:613 (init); docs/audit-post8-evidence/tests/mutations.json M29; docs/audit-post8-evidence/tests/m29-check-data.txt |
| Remedy | In runtime-test.js (and the self-test), deep-freeze or hash every guarded declaration of check:data's DATA list before init() and compare after init and after the dry runs; fail on any difference. |
| Effort | hours |
| Validation | M29 fails runtime-test.js |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Verifier's remedy caveat: a deep freeze would break the app, which writes caches onto guarded FORMATIONS entries (f._anchors, f._gaitCum): hash the declared keys only. |
| Area finding | tests #3 |

<a id="cl-test-06"></a>

**CL-TEST-06 · S3 · P3 · confirmed defect.** No check reads the formation dossier's strength against the data

| field | |
|---|---|
| Subsystem | runtime-test.js; the self-test; app.js dossierFormation |
| User impact | The full dossier's 'Approximate strength' is the figure a visitor reads; a display error there (here 25% too high) is materially misleading and passes every check. |
| Status / origin | confirmed / inherited |
| Expected | Every figure the dossier shows (strength, guns, the army total) equals the data's, or its derived value (aggStrength) for an aggregate. |
| Observed | Every suite run passed. |
| Evidence | M30: every suite run passed (runtime, css, test, redteam, data). The mutation multiplies the full dossier's strength (app.js:7975) by 1.25; the compact card's row (app.js:7809) is left as it was. runtime-test.js opens 40 formation dossiers and checks their other rows (the position pill, the claims' tags, the derived tags), not the strength. In the self-test (read, not run: no browser in this phase) the map layer's naming check accepts any 'about N' in a formation's accessible name by its pattern (app.js:9634-9637), and no check reads the dossier's strength row (no match for 'Approximate strength' or a strength comparison in AUSTERLITZ_DEBUG). |
| References | app.js:7975-7976; app.js:7809; app.js:9634-9637; runtime-test.js (dossiers: 40 formations, 24 features, 9 terrain lines); docs/audit-post8-evidence/tests/mutations.json M30 |
| Remedy | In runtime-test.js, for every formation, parse the dossier's and the compact card's strength and guns and compare them with FORMATIONS (or aggStrength for an aggregate). |
| Effort | hours |
| Validation | M30 fails runtime-test.js |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Verifier: the order-of-battle tab's strengths and the compact card's Strength row are, like the full dossier's, read by no check against the data. |
| Area finding | tests #4 |

<a id="cl-test-07"></a>

**CL-TEST-07 · S4 · P4 · optional improvement.** The harness's figure-on-ground and standard-foot checks pass when nothing is measured

| field | |
|---|---|
| Subsystem | check:visual (tools/visual/thresholds.js check(), requirements(); measure.js figures()) |
| User impact | If a refactor stopped listing the kit's geometries (kitGeos) or the poles, every case would report no figure and no standard and the 'a figure is N units off the drawn ground' check would pass silently in all 39 cases. |
| Status / origin | confirmed / inherited |
| Expected | A landscape case in which figures are drawn requires figures.count > 0 (and standards.count > 0 where standards are drawn), as T-5 requires every other measure. |
| Observed | The check is skipped when the count is 0. |
| Evidence | thresholds.js:429 tests 'm.figures.count&&m.figures.maxErr>0.02' and :430 'm.standards.count&&...'; requirements() (thresholds.js:663-695), written under decision 131 (T-5: 'every measure the case's kind calls for is required: a build or a report without it fails, where before step 1 a missing measure skipped its check without a word'), requires the layer, the docking, the timeline, the smoke, the census and the ground reader's self-check, but no figure or standard count. measure.js:430-445 counts only instanced meshes whose geometry is in the app's kitGeos(). The gate is in the restored Stage 0 file (4156ee7); on this build the counts are about 6,000 per landscape case (docs/stage8-evidence/8l/report-two-cases.json), so the gap is latent. |
| References | tools/visual/thresholds.js:429-430; tools/visual/thresholds.js:663-695; tools/visual/measure.js:428-460 |
| Remedy | In requirements(), for a landscape case, need(m.figures.count>0) and need(m.standards.count>0) where the case shows figures; keep the 0.02 bound. |
| Effort | minutes |
| Validation | the browser candidate in docs/audit-post8-evidence/tests/browser-candidates.json (kitWrap without its push) then fails the case |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | tests #5 |

<a id="cl-test-08"></a>

**CL-TEST-08 · S3 · P3 · untested area.** The gait's drawn shader and its JavaScript mirror are never compared: the feet-on-ground, contact and culling-envelope checks verify the mirror

| field | |
|---|---|
| Subsystem | the in-app self-test (8E/8F gait checks); runtime-test.js; css-test.js |
| User impact | A change to the vertex hook's arithmetic (animGLSL) that is not made in animAt would leave every gait check green while the figures drawn float, sink or swing differently from what the checks measure; the culling envelope computed from the mirror could then also be too small. |
| Status / origin | inferred / new-regression (animAt and animGLSL came with 8D and 8E) |
| Expected | At least one check compares the drawn pose (a rendered silhouette or a transform-feedback-free readback of a posed instance) with animAt, so that the mirror is held to the shader. |
| Observed | The gait checks are internally consistent with the mirror only. |
| Evidence | The self-test's 'the gait on the ground' check (app.js:13430-13501) and the culling envelope check (app.js:12905) place vertices with animAt, 'the hook's arithmetic in JavaScript' (app.js:1017-1020); runtime-test.js's contact check (runtime-test.js:1418-1448) does the same. No check reads a posed vertex back from the GPU (or evaluates animGLSL) and compares it with animAt; css-test.js pins the hook's table and parts by source text (css-test.js:484, 587). The browser candidate (docs/audit-post8-evidence/tests/browser-candidates.json: the thigh swing scaled in the GLSL only) was not run: no browser in this phase. |
| References | app.js:1020 (animAt); app.js:1849 (animGLSL); app.js:12905; app.js:13430; runtime-test.js:1418-1448; css-test.js:484; css-test.js:587 |
| Remedy | Add a self-test check that renders one posed instance at two phases into a small target and compares its lowest drawn pixel row and silhouette with animAt's projection (within a pixel), at both levels of detail. |
| Effort | a day |
| Validation | the GLSL-only swing change then fails it |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch); CONFIRMED (batch)] |
| Auditor's note | Merged: the robustness area found the hook and its mirror equal today; the finding is that nothing holds them so. |
| Area finding | tests #6; also reported as robustness #6 |

<a id="cl-test-09"></a>

**CL-TEST-09 · S4 · P4 · confirmed defect.** Checks take their bounds from the code under test: a 20% looser infantry march-rate ceiling passes every movement check, and the self-test checks decided values against the code's own constants

| field | |
|---|---|
| Subsystem | audit.js, sim-test.js, check:chronology, redteam.js; the in-app self-test |
| User impact | A model limit that keeps the march believable (SPEED_CEIL) or a decided presentation value (the arrow cap of decision 241) can change with the code that it is meant to restrain, and the behavioural checks follow it. |
| Status / origin | confirmed / inherited |
| Expected | The decided or sourced value is written in the test (as runtime-test.js:545 writes the plateau rule, 'not read from PLATEAU_LAST') or pinned by a check that names the decision. |
| Observed | For SPEED_CEIL no check outside check:data holds the value; for the browser constants the value is held by text pins and names, and the self-test verifies only that the code does what its constant says. |
| Evidence | M25: failed redteam (known-warning text), data (data identity). audit.js:45, sim-test.js:40 and chronology.js:627 read SPEED_CEIL from the code under test, so raising it raises their bound; redteam.js failed only because an acknowledged warning's text carries the infantry mean rate (redteam.js:108, acknowledged at :348 as 1.35; it became 1.36). In the browser layer the arrow check's condition is 'S.maxPx<=ARROW_CAP.PX+0.5' with ARROW_CAP.PX in its name (app.js:10915-10916); the decided 16 px is held by css-test.js's source pin (css-test.js:391) and by the manifest, whose names (288 of 317 carry digits) change when an interpolated constant changes. |
| References | app.js:3369 (SPEED_CEIL); audit.js:45; sim-test.js:40; tools/stage2/chronology.js:627; redteam.js:108; redteam.js:348; app.js:2838 (ARROW_CAP); app.js:10915-10916; css-test.js:391; tools/visual/selftest-manifest.json; docs/audit-post8-evidence/tests/mutations.json M25 |
| Remedy | Write the ceilings into audit.js (or a test-owned table checked against SPEED_CEIL with its decision reference) and fail on a difference; list the decided constants the self-test reads in one test-owned table with their decision numbers, checked by css-test.js against the code. |
| Effort | hours |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | tests #8 |

<a id="cl-test-10"></a>

**CL-TEST-10 · S3 · P3 · untested area.** Interface colours typed into style.css are read by no check

| field | |
|---|---|
| Subsystem | css-test.js (palette); check:contrast |
| User impact | A colour outside the tokens (for example a low-contrast hover colour) can enter style.css with every check green; check:contrast reads visible text in its 45 states, not :hover, :focus or :active rules. |
| Status / origin | confirmed / inherited |
| Expected | CLAUDE.md: tokens.js is 'the only source of interface and symbology colours'; a colour literal in style.css outside the tokens block fails unless it is a shadow or the developer readout, named. |
| Observed | M13's #ff00aa hover colour passed css-test.js, the build and redteam.js. |
| Evidence | M13: every suite run passed (css, build, redteam). The palette rule reads world.js, app.js and symbols.js (css-test.js:275); in style.css only the day-track inset's rules are scanned for a colour (css-test.js:858). Today style.css carries 14 colour literals outside its generated tokens block: black or near-black shadows and a vignette (for example style.css:573), and the developer readout's (style.css:757-758); none is a visitor's interface colour, so the rule CLAUDE.md states for tokens.js holds today by review, not by a check. |
| References | css-test.js:275; css-test.js:858; style.css:573; style.css:757-758; docs/audit-post8-evidence/tests/mutations.json M13 |
| Remedy | Extend the palette rule to style.css after the tokens block, with a short named allow-list (the shadows' black alphas, the vignette, #devstats). |
| Effort | hours |
| Validation | M13 then fails css-test.js |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | tests #9 |

<a id="cl-test-11"></a>

**CL-TEST-11 · S3 · P3 · optional improvement.** geo-test.js holds the surveyed villages to 0.5 km of ground truth while the worst is 20 m

| field | |
|---|---|
| Subsystem | geo-test.js |
| User impact | A village can be moved up to about 480 m (24 times today's worst error) by a slip in a data task with geo-test.js green; the geographic corrections of 8J and 8K are protected only by check:data. |
| Status / origin | confirmed / inherited |
| Expected | After the correction passes, a tolerance near the measured worst (for example 0.1 km), loosened only by a data task with its reason. |
| Observed | Kobelnitz moved 0.28 km east passed geo-test.js. |
| Evidence | M27: failed data (data identity). geo-test.js:83 'every surveyed village within 0.5 km of ground truth' (worst on this build Blasowitz, 20 m; the feature markers likewise 0.5 km, worst 20 m, geo-test.js:89). |
| References | geo-test.js:81-83; geo-test.js:88-89; docs/audit-post8-evidence/tests/baseline-isolated-copy.txt; docs/audit-post8-evidence/tests/mutations.json M27 |
| Remedy | Tighten both to 0.1 km (or to each place's own recorded tolerance) and record the change in CHANGELOG.md. |
| Effort | minutes |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | tests #11 |

<a id="cl-test-12"></a>

**CL-TEST-12 · S3 · P3 · probable problem.** The statement inventory is a whitelist with no completeness check: timing bases and plan labels a visitor reads are outside it and outside its own exclusion note

| field | |
|---|---|
| Subsystem | tools/step4/statements.js; test.js (claims); narrative.js |
| User impact | 19 timing bases shown in every timed dossier ('grade B · app narrative, unsourced') and 22 plan labels drawn on the map or listed in the Plans tab ('Soult concealed in the Goldbach valley', 'The bait - Legrand, then Davout') carry no claim and are not counted as unchecked; a new narrative field added to the data would be outside the inventory silently. |
| Status / origin | confirmed / inherited |
| Expected | Every visitor-facing narrative string is inventoried or excluded by a named rule, and a test fails on a guarded prose path that is neither. |
| Observed | 10 plan labels drawn on the map (8 staging, 2 objectives) are narrative statements outside the inventory and its exclusion note; 12 column names are arguable (names, a few interpretive); the 19 timing bases are a two-valued enum the note's 'enums' plausibly covers. No completeness check exists. |
| Evidence | inventory-reach.js: 704 inventoried statements; 765 prose-like guarded strings in data.js and analysis.js, 115 of them matching no class. Most are what statements.js's note excludes (names, tm.ev quotations, tolWhy, CLAIM's apparatus), but 19 FORMATIONS.*.track[n].tm.basis strings (rendered in the dossier's Timing row, app.js:7989), 8 PLANS.*.staging[n].n and 2 PLANS.*.objectives[n].n labels (drawn as map labels by planLabel, app.js:4521, 4536) and 12 PLANS.*.cols[n].n (the Plans tab's row labels, app.js:4625) are statements or labels with a claim in them and are not named in the exclusion note. No check asserts that every guarded prose path matches a class or an exclusion. |
| References | tools/step4/statements.js:9-11; tools/step4/statements.js:15-40; app.js:7989; app.js:4521; app.js:4536; app.js:4625; docs/audit-post8-evidence/tests/inventory-reach.json |
| Remedy | Add an exclusion table to statements.js (pattern, reason) and a test.js check that every guarded prose record of data.js and analysis.js matches a class or an exclusion; decide whether tm.basis and the plan labels are statements (then inventory them) or apparatus (then exclude them by name). |
| Effort | hours |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | tests #12 |

<a id="cl-test-13"></a>

**CL-TEST-13 · S3 · P3 · probable problem.** check:chronology judges clock-shaped hours only; 45 inventoried statements give hours in words it does not read

| field | |
|---|---|
| Subsystem | check:chronology (tools/stage2/chronology.js timesIn) |
| User impact | A retimed 'about nine' or 'at seven' is not compared with the movement model; for 33 statements the claim's hash forces a review of the reword, for 12 unchecked ones only the inventory's freshness fails, which regenerating the inventory clears. |
| Status / origin | confirmed / inherited |
| Expected | Every timed statement judged, as check:chronology's L-rules claim, or the word forms listed as unjudged by name. |
| Observed | 41 inventoried statements (31 own-claim, 10 unchecked) carry 59 word-form hours timesIn does not read; the 45/33/12 count includes 4 statements whose only matches are 'half past N' or quantities. |
| Evidence | M32: failed test (inventory), data (data identity). timesIn (chronology.js:98-109) reads 'HH:MM', ranges, 'after HH:MM', 'a quarter to/past', 'half past', 'N o'clock' and 'noon'/'midday'; it does not read 'at seven', 'about nine', 'past two', 'after three', 'toward eight'. tools/audit-post8/tests/word-hours.js over tools/step4/statements.js's 704 statements finds 45 with such a word-form hour (13 with no clock-shaped hour besides); 33 have a claim of their own (hashed), 12 are unchecked (timing notes, SOURCE_NOTE.body). |
| References | tools/stage2/chronology.js:96-109; tools/audit-post8/tests/word-hours.js; CLAUDE.md (check:chronology: 'its extractor reads only clock-shaped hours (a bare "about eight" goes unjudged; handed on)'); docs/audit-post8-evidence/tests/mutations.json M32 |
| Remedy | Extend timesIn to 'at\|about\|by\|before\|after\|past\|toward\|near <number word>' (the day runs 04:00-18:00, so the hour maps as hr() already does) and review the new cites; or list the word-form statements in ALLOW_TIMED with reasons. |
| Effort | hours to a day (the new cites need review) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | tests #13 |

<a id="cl-test-14"></a>

**CL-TEST-14 · S3 · P3 · accepted compromise.** The motion benchmark's ceilings and visibility baselines equal the build's own counts: they detect change, not quality; Play now accepts a formation hidden for 4,033 ms

| field | |
|---|---|
| Subsystem | check:selftest and check:visual (thresholds.js MOTION) |
| User impact | The label layer's stability in motion is held to 'no worse than the build of 8K', not to a stated level; in the Play run a formation's name may stay hidden for four seconds (was 3,100 ms before 8K). |
| Status / origin | confirmed / accepted-compromise |
| Expected | Accepted by the owner as benchmark pins; the final audit to judge the 4,033 ms on screen. |
| Observed | As accepted; no absolute level of label stability is asserted anywhere. |
| Evidence | MOTION={JUMPS:248, POPS:998, FLICKER:10, LOD:130, ...} (thresholds.js:270): JUMPS and POPS are 8K's build's own totals (decision 267 (a)), LOD 130 its own, FLICKER 10 against 9 measured; decision 257 (b) calls them 'ceilings of this benchmark, not a guarantee of what a device shows'. The VIS floors were re-baselined in 8J and 8K under the owner's brief of 30 October 2026 (thresholds.js:274-296), hybrid-play's longest-hidden ceiling 3,100 to 4,033 ms (+30%, thresholds.js:289, 308), and kept by decision 267 (a), which names Play's 4,033 ms as a final-audit item. The audit's own check:selftest run measured, over the 16, jumps 248, pops 998, level-of-detail switches 130 and flickers 9 (docs/audit-post8-evidence/checks/check-selftest.txt:324-339): three of the four totals exactly at their ceilings, one more jump or pop fails. |
| References | tools/visual/thresholds.js:251-270; tools/visual/thresholds.js:274-296; tools/visual/thresholds.js:308; docs/audit-post8-evidence/tests/thresholds-history.md; docs/audit-post8-evidence/checks/check-selftest.txt:324-339 |
| Remedy | Keep the pins; add one absolute bar the owner can accept (for example: no formation hidden by the layout for more than 2 s in any driven run, protected items never), and judge Play's 4,033 ms case on screen in the final report. |
| Effort | hours (once the bar is decided) |
| Dependencies | an owner decision on an absolute bar |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | tests #14 |

<a id="cl-test-15"></a>

**CL-TEST-15 · S4 · P4 · optional improvement.** css-test.js holds source text, not behaviour: its march-row pin passed a march row stripped of its 'derived' tag

| field | |
|---|---|
| Subsystem | css-test.js |
| User impact | None on this build: runtime-test.js caught the stripped tag. The weakness is that css-test.js's 434 regular expressions over the source are counted as guards of behaviours they only partly see. |
| Status / origin | confirmed / new-regression (8C's second derivedTag in marchRow opened the pin's blind spot) |
| Expected | A check named for a behaviour (the march row tagged) tests the behaviour, or says that it pins text. |
| Observed | The pin passes any refactor that keeps one occurrence of the token, and fails refactors that keep the behaviour. |
| Evidence | M08: failed runtime. css-test.js:380 fails only when 'derivedTag()' is absent from marchRow's whole source; the mutation removed it from the visitor's path (the 'Marching' / 'Next move' return) and left it on the readHidden path, so the pin held. runtime-test.js:756-783 renders every march row at every half hour and caught it ('the march row untagged', 720 rows). css-test.js has 434 '.test(' calls, most over app.js's or style.css's text, against 9 behaviour checks (css-test.js:197). In M14 css-test.js's failure came from a pin on the boundary's drawn options ('the bounds are not tested against the ground'), binding-test.js's from the dash rule itself. |
| References | css-test.js:380; css-test.js:197; runtime-test.js:756-783; app.js:7917-7930 (marchRow; the visitor's path 7927-7929); docs/audit-post8-evidence/tests/mutations.json M08 M14 |
| Remedy | Where a behavioural check exists (runtime-test.js D-6 here), drop or relabel the source pin as a text pin; where it does not, write the behaviour check in runtime-test.js. |
| Effort | hours per pin |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | tests #7 |

<a id="cl-test-16"></a>

**CL-TEST-16 · S3 · P4 · confirmed defect.** test.js's 'objective off map' reads the objective's x only

| field | |
|---|---|
| Subsystem | test.js (overlays) |
| User impact | An overlay objective placed off the field's depth (y beyond the frame) would draw off the map or at its edge with the check green. |
| Status / origin | confirmed / inherited |
| Expected | The objective's point tested with offMap(p), as the other overlay points are. |
| Observed | Phase 0's Telnitz objective at y 608 (the frame is 500 deep) passed. |
| Evidence | M31: failed data (data identity). test.js:96: '(o.obj\|\|[]).forEach(p=>{ if(p[0]<0\|\|p[0]>MAPF.w) errs.push("phase "+i+": objective off map"); })': y is not tested, while the arrows', lines' and bounds' points use offMap(p) on both axes (test.js:93). |
| References | test.js:96; docs/audit-post8-evidence/tests/mutations.json M31 |
| Remedy | Use offMap([p[0],p[1]]) at test.js:96. |
| Effort | minutes |
| Validation | M31 then fails test.js |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | tests #10 |

<a id="cl-test-17"></a>

**CL-TEST-17 · S4 · P4 · optional improvement.** CTX_DELETES allows 248 context warnings where the case has measured 193 since 8C

| field | |
|---|---|
| Subsystem | check:contrast (tools/visual/boot-check.js) |
| User impact | None directly; 55 more 'does not belong to this context' warnings (geometries disposed across a context loss) would pass unseen. |
| Status / origin | confirmed / inherited |
| Expected | A regression bound near the measured count once the measure changed. |
| Observed | The bound kept at the older, higher count. |
| Evidence | boot-check.js:30 CTX_DELETES=248 (decision 212 (b), the count measured then); since 8C waits for the step's first frame the case gives 193 (CLAUDE.md; this audit's check:contrast: '193 “does not belong to this context” warnings (at most 248)'). |
| References | tools/visual/boot-check.js:30; docs/audit-post8-evidence/checks/check-contrast.txt:13 |
| Remedy | Re-baseline to 193 (or a small margin) with an owner decision, as decision 212 (b) set it. |
| Effort | minutes |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | tests #15 |

<a id="cl-test-18"></a>

**CL-TEST-18 · S4 · P4 · optional improvement.** The self-test manifest holds names and a count, not conditions

| field | |
|---|---|
| Subsystem | check:selftest (thresholds.js checkSelfTest; selftest-manifest.json) |
| User impact | A self-test check weakened under an unchanged name (a tolerance widened, a branch skipped) passes the manifest; only review would see it. |
| Status / origin | confirmed / inherited |
| Expected | The manifest, or a companion, records each check's condition (or a hash of its source) so that a changed condition is listed for review. |
| Observed | Names only. |
| Evidence | checkSelfTest fails a missing, added, renamed or duplicated check and any failing one (thresholds.js:976-988); the manifest (317 names) is written by check-report.js --write-manifest from a passing run. selftest-diff.js over the last pre-Stage-8 build (step5c-45f8f662) and today's app.js: 131 checks with a literal name in both, none with a changed condition; 253 literal comparisons before Stage 8, all still present. So no literal tolerance of a kept check was loosened in Stage 8; a weakening by logic would not show in that comparison. |
| References | tools/visual/thresholds.js:976-988; tools/visual/selftest-manifest.json; tools/visual/check-report.js:20; docs/audit-post8-evidence/tests/selftest-diff.json |
| Remedy | Write a hash of each ck() call's condition source into the manifest beside its name (check-report.js --write-manifest), and list changed hashes in the harness's report. |
| Effort | hours |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | tests #16 |

<a id="cl-test-19"></a>

**CL-TEST-19 · S4 · P4 · optional improvement.** Several 'caught' results come from change detectors that a mechanical regeneration clears: the suites' semantic coverage is narrower than their failure count

| field | |
|---|---|
| Subsystem | test.js (inventory freshness), redteam.js and test.js (KNOWN_WARN exact texts), check:chronology L9, check:data |
| User impact | None directly; a reader counting failing suites overstates what is checked. Regenerating the inventory (node tools/step4/inventory.js), rewriting an acknowledged warning's text or --rehash --write clears these failures without any statement of truth being checked. |
| Status / origin | confirmed / inherited |
| Expected | Each control's catch attributed to the check that holds the property. |
| Observed | See section 3's mechanism column. |
| Evidence | Of 33 negative controls, 30 failed some check, 26 some check other than check:data, and 19 a semantic check (mutations-table.js's reading of each failing suite's lines). Caught only by change detectors or review triggers: M04 (test: claim hash+inventory, data: data identity); M05 (test: inventory, data: data identity); M10 (test: inventory, data: data identity); M16 (data: data identity); M17 (data: data identity); M18 (redteam: known-warning text, data: data identity); M25 (redteam: known-warning text, data: data identity); M27 (data: data identity); M31 (data: data identity); M32 (test: inventory, data: data identity); M33 (test: inventory, data: data identity). M01's, M18's and M25's redteam.js failures came from the acknowledged warning 'cavalry mean rate 0.83 is not above infantry 1.35' (redteam.js:348), whose text carries a number every timing change moves. |
| References | test.js:464-470; redteam.js:347-356; tools/stage2/chronology.js:680-700; docs/audit-post8-evidence/tests/mutations.json |
| Remedy | Report change-detector failures separately in tools/run-all.sh's summary ('changed: the inventory', 'changed: an acknowledged warning') from property failures, so that a reviewer sees which kind failed. |
| Effort | hours |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | tests #17 |

<a id="cl-test-20"></a>

**CL-TEST-20 · S4 · P4 · probable problem.** Wall-clock limits make the suites load-sensitive: runtime-test.js's 30 s font watchdog fired under load in this audit, and run-all.sh kills a suite at 600 s

| field | |
|---|---|
| Subsystem | runtime-test.js (the font dry runs' watchdog); tools/run-all.sh (per-suite timeout); the in-app self-test (the pan move's median); check:visual (LAYER_MS) |
| User impact | A loaded runner can fail a correct build (a flake), or a slow regression can hide on a fast one. |
| Status / origin | confirmed / inherited |
| Expected | Timing budgets measured as CPU time or guarded against load, or reported as such. |
| Observed | One spurious failure line seen (the font watchdog, M23's run); the browser budgets held under load; not exercised further. |
| Evidence | runtime-test.js:1652 fails the suite if its asynchronous font dry runs have not finished 30 s (wall clock) after the watchdog is set; in this audit's M23 run (runtime-test.js at nice 19 beside other areas' browsers, 1,403 s for the whole suite) it fired ('E FONTS: the dry runs did not finish within 30 s') beside the mutation's genuine failure; in the other six runtime-test.js runs (693-1,545 s) it did not. tools/run-all.sh:35 kills each suite at 600 s: runtime-test.js took 693-1,545 s in this audit's loaded runs, so npm test on such a machine would fail without a defect (CI's runners are not shared; the audit's own npm test took 402 s in all, checks/summary.txt). The self-test's landscape-controls check requires a pan move's median at most 2 ms (app.js:11322) and check:visual each case's layer pass under 8 ms (thresholds.js:155, 482); the audit's own check:selftest passed on this shared machine (5,422 s, checks/summary.txt). |
| References | app.js:11320-11325; tools/visual/thresholds.js:155; tools/visual/thresholds.js:482; runtime-test.js:1652; tools/run-all.sh:35; docs/FINAL_AUDIT.md T-7; docs/audit-post8-evidence/checks/summary.txt; docs/audit-post8-evidence/tests/mutations.json M23 |
| Remedy | Measure the font dry runs' watchdog in the dry runs' own steps (or raise it with a reason) and let run-all.sh's timeout be set by an environment variable for loaded machines; report the browser budgets' margins in the harness's report and run the browser candidate (the same build with and without a CPU load) once. |
| Effort | an hour |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | tests #18 |

#### CL-REC: the records and documentation

<a id="cl-rec-01"></a>

**CL-REC-01 · S4 · P3 · optional improvement.** The published site's root page is the developer README: no link to the map and nothing for a visitor on evidence and reconstruction

| field | |
|---|---|
| Subsystem | publishing (GitHub Pages root) |
| User impact | A visitor who opens https://billybobbyboo.github.io/Austerlitz/ reads build instructions and suite descriptions; the map file is named twice in code formatting and is not linked; nothing says what the map documents and what it reconstructs. |
| Status / origin | open / inherited (Pages enabled for decision 217's device runs, roadmap step 6) |
| Expected | A visitor arriving at the site root finds a link to austerlitz-command-map.html and one paragraph on the reconstruction (claims, grades, design conventions). |
| Observed | Developer documentation only; the stale statements of the README finding repeated to the public. |
| Evidence | pages-root.html (fetched 2 November 2026 01:41 GMT; last-modified 1 November 10:57:40 GMT): the rendered README; its only <a href> is to the site itself. |
| References | README.md:1-37; docs/audit-post8-evidence/records/pages-root.html; docs/audit-post8-evidence/records/pages-root-headers.txt |
| Remedy | Records/publishing only: a short visitor paragraph and a link at the top of README.md, or a small index.html; no application change. |
| Validation | curl the Pages root after deployment and check for the link. |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Auditor's note | Related, not the same surface: CL-UX-11 (the app's own first screen). |
| Area finding | records #2 |

<a id="cl-rec-02"></a>

**CL-REC-02 · S3 · P2 · confirmed defect.** README.md describes the checks wrongly again and calls the file self-contained (the prior audit's R-1 recurred)

| field | |
|---|---|
| Subsystem | records: README.md, .github/workflows/checks.yml |
| User impact | A contributor or reviewer reading README.md is told check:data compares against step 5c's build, check:contrast reads 35 states and six start-up cases, the self-test has 242 checks in about 15 minutes, check:visual 30 views in about 100 minutes, audit.js only prints, and that the HTML is self-contained although three.js comes from cdnjs. |
| Status / origin | open / inherited (step 6 item 3 made the states and views stale) / new-regression (Stage 8 PRs 8A-8K moved the reference, the counts and the times) |
| Expected | README's table matches package.json and the checks as they run (archive/stage8k-f10fe585.html; 45 states; 8 start-up cases; 317 checks; 39 views), and says three.js loads from cdnjs. |
| Observed | 9 stale statements in README.md (lines 4, 27, 28, 30 twice, 31 twice, 32 twice) and one in checks.yml:5 ("each about 8-15 minutes"; the self-test alone takes 21-43 minutes on CI). README.md last changed at 15b2dcc (decision 214). |
| Evidence | docs/audit-post8-evidence/records/doc-consistency.md (every quoted phrase re-read on its line by doc-consistency.py); docs/audit-post8-evidence/checks/check-contrast.txt ("states 45 (10 at 390 x 844 as a phone)", "boot cases: 8 of 8 pass"); CHANGELOG.md:1936 (audit.js asserts since step 5) |
| References | README.md:4; README.md:27; README.md:28; README.md:30; README.md:31; README.md:32; .github/workflows/checks.yml:5; package.json:9; shell.html:437; tools/visual/selftest-manifest.json; tools/visual/cases.js |
| Remedy | A records-only commit: point README's table at CLAUDE.md's Checks section instead of copying counts and times, or update them; write "one HTML file; three.js r128 is loaded from cdnjs with its integrity hash". |
| Validation | python3 -I tools/audit-post8/records/doc-consistency.py then reads the corrected lines (its quotes would no longer be found). |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | records #1 |

<a id="cl-rec-03"></a>

**CL-REC-03 · S3 · P2 · confirmed defect.** Merged pull requests are recorded as drafts in CHANGELOG.md, docs/ROADMAP.md and CLAUDE.md, which contradict one another for #77 and #78 (the prior audit's R-2 recurred)

| field | |
|---|---|
| Subsystem | records: CHANGELOG.md, docs/ROADMAP.md, CLAUDE.md |
| User impact | The next agent or the owner reading the status lines is told 8H, 8I-8K, 8L, decision 267 (a) and the device records are unmerged drafts; CLAUDE.md:744 says "Draft PR #79 holds both records". |
| Status / origin | open / mixed: inherited (R-2 recurred from PR #58) and new-regression (#64, #73-#79) |
| Expected | Each merged part's status line says "merged (#n, commit)", as step 5 made them (CHANGELOG.md:1854). |
| Observed | Five CHANGELOG heads say "not merged" or "draft"; three ROADMAP paragraphs say "not merged"; CLAUDE.md:744 says draft while CLAUDE.md:734 and :738 record #77 and #78 merged; ROADMAP records none of PRs #73-#79's merges. |
| Evidence | git log --merges origin/main: b7fb67a #73 (30 Oct), 72c7e1b #74, c706c96 #76, c7de7a2 #75 (31 Oct), 141f890 #77 (31 Oct), c2adefe #78 and 43e3e5b #79 (1 Nov); docs/audit-post8-evidence/records/doc-consistency.json |
| References | CHANGELOG.md:5; CHANGELOG.md:18; CHANGELOG.md:40; CHANGELOG.md:58; CHANGELOG.md:86; docs/ROADMAP.md:510; docs/ROADMAP.md:535; docs/ROADMAP.md:548; CLAUDE.md:744; CLAUDE.md:734; CLAUDE.md:738 |
| Remedy | A records-only commit updating the nine status lines with their merge commits. |
| Validation | grep -n "not merged" CHANGELOG.md docs/ROADMAP.md against git log --merges. |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Verifier: four more CHANGELOG status heads record merged PRs as drafts or for review (#58, #59, #60, #64). |
| Area finding | records #3 |

<a id="cl-rec-04"></a>

**CL-REC-04 · S4 · P4 · confirmed defect.** The carried checklist misstates three of its own items (the records' view of other areas' findings)

| field | |
|---|---|
| Subsystem | records: docs/STAGE8_SPEC.md 21.9, 22.6, 23.4 |
| User impact | The checklist the final audit was to start from understates three items: a reader would take them as small offsets and a 4-second gap. |
| Status / origin | open / new-regression (Stage 8 records, 8J-8L) |
| Expected | The checklist states each item as measured. |
| Observed | An offset since Stage 0 filed as 8J's; a separation overstated; a saturated measure read as a duration. |
| Evidence | history finding 8 (kienmayer@7 "Holding west of the Goldbach" drawn 901 m east of the brook since Stage 0, filed by 8J as an offset from the corrected brook); history finding 9 (Caffarelli 1.61-2.64 km from Bagration, the records say 2.5-2.9 km); visibility carried and findings 1, 3 (the 4,033 ms is the benchmark's whole 121-frame window; over 08:30-11:30 counters hidden 12-28 s); docs/audit-post8-evidence/records/carried.md C-06, C-40, C-41 |
| References | docs/STAGE8_SPEC.md:5108; docs/STAGE8_SPEC.md:5111-5112; docs/STAGE8_SPEC.md:5400-5401; docs/STAGE8_SPEC.md:5513-5516; data.js:476; data.js:508 |
| Remedy | Let this register (carried.md) supersede section 22.6's wording; correct the three lines when the records are next touched. |
| Validation | The history and visibility areas' probes. |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Area finding | records #6 |

<a id="cl-rec-05"></a>

**CL-REC-05 · S3 · P3 · untested area.** Two items "recorded complete on the owner's word" carry no results: the screen-reader session (decision 175) and the human second reading (decision 189)

| field | |
|---|---|
| Subsystem | records / accessibility and sources evidence |
| User impact | No screen-reader result exists for any build, Stage 8's landmark and heading changes (8H, A-6) included; the A grades of the drawn coats rest on machine readings only. The records otherwise read as if both were done. |
| Status / origin | accepted by decisions 175 and 189 / accepted-compromise |
| Expected | An owner attestation is labelled as one wherever the work is counted as done. |
| Observed | Both attestations are labelled as such (CLAUDE.md, docs/ROADMAP.md, docs/step3-evidence/sr-session.md). Untested: any screen reader on the current build, including 8H's A-6 changes; one stale line in docs/stage6-evidence/second-reading.md. |
| Evidence | ROADMAP:156-159 ("no item results ... none of its 24 items is recorded here as passed or failed"); ROADMAP:196 ("no item results given, none recorded"); second-reading.md:6-7 ("Both readers were machine readers") |
| References | docs/ROADMAP.md:156-159; docs/ROADMAP.md:196; docs/step3-evidence/sr-session.md; docs/stage6-evidence/second-reading.md:6-7 |
| Remedy | Either run the 24-item script once on the final build and read the 15 quotes once, or label both as attestations without results in CLAUDE.md and ROADMAP (no app change). |
| Validation | The script's result column filled, or the label present. |
| Adversarial verification | WEAKENED: [lenses: WEAKENED (batch)] |
| Auditor's note | Verifier: docs/stage6-evidence/second-reading.md still says the human second reading 'stays open for the owner' after decision 189. |
| Area finding | records #7 |

<a id="cl-rec-06"></a>

**CL-REC-06 · S4 · P3 · unresolved historical question.** G-3 (Miloradovich at dawn) is the one finding of the prior audit never taken up: no step, no decision, no record since

| field | |
|---|---|
| Subsystem | data (FORMATIONS.milo track 0) |
| User impact | milo@0 is graded A ("Position documented in the sources") with the act "Formed on the plateau near Pratzen village" while plotted about 1.6 km from the village; a visitor reads the strongest grade on an unchecked placement. |
| Status / origin | open / inherited |
| Expected | Every prior finding assigned to a step, decided, or recorded as left. |
| Observed | Neither ROADMAP's step table nor Stage 8's list of unassigned findings (docs/STAGE8_SPEC.md:1327-1339) names G-3. |
| Evidence | id-mentions.json: G-3 has 0 mentions in CHANGELOG.md, docs/ROADMAP.md and docs/STAGE8_SPEC.md (with H-10 and T-8, the only ids never written; those two were done under decisions 135 and 132); docs/audit-post8-evidence/history/result.json: "(d) G-3 still open" |
| References | docs/FINAL_AUDIT.md:348; data.js:561; world.js:143; docs/audit-post8-evidence/records/id-mentions.json |
| Remedy | Put it in the next data task: a source check of the IV Column's place at dawn, or the grade lowered with the act qualified; record it in docs/ROADMAP.md. |
| Validation | check:data on the data task; the history area's grade probe. |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | records #5 |

<a id="cl-rec-08"></a>

**CL-REC-08 · S4 · P4 · confirmed defect.** CLAUDE.md's file table and heading lag the tree: the claims' counts before 8K and "Current state (October 2026)"

| field | |
|---|---|
| Subsystem | records: CLAUDE.md |
| User impact | An agent reading CLAUDE.md is given 484 unchecked statements and 145 own claims (now 481 and 148) and an October heading over November state. |
| Status / origin | open / new-regression (8K; 1 November records) |
| Expected | CLAUDE.md states the current counts (it is the agents' map). |
| Observed | "484 after decision 210 (c), 145"; "## Current state (October 2026)". |
| Evidence | docs/audit-post8-evidence/records/claims-count.json (704 statements, 148 own, 75 by class, 481 unchecked, 0 stale entries); CHANGELOG.md:204 records the same |
| References | CLAUDE.md:24; CLAUDE.md:497; CHANGELOG.md:204 |
| Remedy | Two words in a records-only commit. |
| Validation | node tools/audit-post8/records/claims-count.js |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | records #4 |

#### CL-ROB: robustness, security, dependencies and maintainability

<a id="cl-rob-01"></a>

**CL-ROB-01 · S1 · P1 · confirmed defect.** The device route's ?src= runs a visitor-supplied URL in the public site's origin (DOM XSS on GitHub Pages)

| field | |
|---|---|
| Subsystem | tools/step6/perf-run.html (published by GitHub Pages) |
| User impact | Anyone can send a link to https://billybobbyboo.github.io/Austerlitz/tools/step6/perf-run.html?src=javascript:... that runs the sender's script in the origin https://billybobbyboo.github.io (every Pages site of that account shares it): arbitrary content or script under the owner's address (phishing, defacement), and the origin's storage. Bounded: the map itself stores nothing and the origin holds no credentials; the S1 class follows the audit's rule for a real, reachable security exposure. |
| Status / origin | open / inherited |
| Expected | The route frames only a build on its own host: a relative same-origin http(s) path. |
| Observed | Any URL, javascript: included, is assigned to the frame's src. |
| Evidence | perf-run.html:40 reads src=q.get("src") unchecked and :44 sets the frame's src to it. Pages serves the page (HTTP 200, md5 3f57a5bf... equal to the repository's, pages-tools-headers.txt). On a byte-identical local copy served over HTTP on 127.0.0.1 in Chromium 141, ?src=javascript:parent.document.title='RBX '+parent.location.origin;void 0 set the page's title to 'RBX http://127.0.0.1:<port>' (script in the page's origin, reaching the parent); a data: URL could not reach the parent; the control loaded the default path (perfrun-src.json). ?route=, ?quick= and ?only= are only compared or split (perf-route.js:92, :220). The live site was not attacked. |
| Reproduction | node tools/audit-post8/robustness/perfrun-src.js (local copy; never the live site) |
| References | tools/step6/perf-run.html:40; tools/step6/perf-run.html:44; docs/audit-post8-evidence/robustness/pages-tools-headers.txt; docs/audit-post8-evidence/robustness/perfrun-src.json; tools/audit-post8/robustness/perfrun-src.js |
| Cause verified | yes: the assignment executes the javascript: URL in the parent's origin (measured) |
| Remedy | Accept src only when new URL(src, location.href) has location's origin and an http(s) protocol (else keep the default and say so in #msg); or publish only the product on Pages (a Pages workflow with an explicit artifact), which also removes R-6. A tool change, not a data or build change. |
| Effort | minutes |
| Dependencies | none |
| Risk of the remedy | none for the product; the owner's device runs use the default src |
| Validation | perfrun-src.js again: the javascript: case leaves the title 'Frame-time route' and the frame on the default; ?src=../../austerlitz-command-map.html still runs the route. |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (premise); CONFIRMED (repro)] |
| Auditor's note | Verifiers (both lenses): reproduced on a local copy only; the live site was compared by a plain GET. S1 kept by the audit's rubric (a real, reachable security exposure); for calibration a conventional score is medium (CVSS 3.1 about 6.1: one click on a crafted link, no session or credentials on the origin, the product stores nothing). |
| Area finding | robustness #1 |

<a id="cl-rob-02"></a>

**CL-ROB-02 · S3 · P3 · confirmed defect.** A context loss while the clock plays can throw an uncaught TypeError from three r128 ("reading 'trim'")

| field | |
|---|---|
| Subsystem | app.js loop / context-loss handling (three r128) |
| User impact | On a real GPU reset or a mobile browser dropping the context mid-play, the console shows an uncaught exception from the frame loop; frames resume after the restore and nothing visible breaks. The context checks never lose the context while playing, so the path is untested. |
| Status / origin | open / inherited |
| Expected | No uncaught error on a context loss. |
| Observed | One uncaught TypeError in one or two of three losses while playing. |
| Evidence | ctx-error.json: 1 page error in 3 losses while playing (TypeError: Cannot read properties of null (reading 'trim') at new WebGLProgram < acquireProgram < renderBufferDirect), 0 in the paused control; ctx-cycles.json: 2 in 3 playing cycles, 0 in 5 idle. r128 calls .trim() on getProgramInfoLog/getShaderInfoLog, null on a lost context; three's guard (_isContextLost) and the app's (GL.lost) are both set by the webglcontextlost event, which is dispatched after the context is already lost, so a frame that compiles a program in between throws. |
| Reproduction | node tools/audit-post8/robustness/ctx-error.js |
| References | app.js:567-571; app.js:9117-9120; node_modules/three/src/renderers/webgl/WebGLProgram.js:736-738; node_modules/three/src/renderers/WebGLRenderer.js:600-608; node_modules/three/src/renderers/WebGLRenderer.js:1002; docs/audit-post8-evidence/robustness/ctx-error.json; docs/audit-post8-evidence/robustness/ctx-cycles.json |
| Cause verified | yes (three's source and the stack) |
| Remedy | In loop() skip the frame also when renderer.getContext().isContextLost() (synchronous), as for GL.lost; optionally add a playing case to check:contrast's context cases. |
| Effort | one line |
| Dependencies | none |
| Risk of the remedy | low |
| Validation | ctx-error.js: 0 page errors over its three playing cycles (repeat a few times: the window is a race). |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | robustness #2 |

<a id="cl-rob-03"></a>

**CL-ROB-03 · S3 · P3 · probable problem.** The documents an agent must read have outgrown a context: CLAUDE.md 130,902 bytes, CHANGELOG.md 1,283,488 bytes

| field | |
|---|---|
| Subsystem | CLAUDE.md, CHANGELOG.md, docs/ |
| User impact | Maintainers (human or agent) cannot follow 'Read CHANGELOG.md (current state)' as written (about 320k tokens); CLAUDE.md costs about 33k tokens in every session, much of it history; decisions are found by search rather than read. |
| Status / origin | open / inherited |
| Expected | An entry point that fits a session with room to work. |
| Observed | 130 KB of rules and history; a 1.28 MB log to read first. |
| Evidence | Measured 2026-11-02: CLAUDE.md 130,902 bytes, 745 lines (its 'Current state' about 35 KB); CHANGELOG.md 1,283,488 bytes, 9,387 lines; docs/STAGE8_SPEC.md 665,797 bytes; the branch 2,478 files, 342.9 MB (docs/ 294.5 MB, archive/ 38.4 MB), all published by Pages. |
| References | CLAUDE.md; CHANGELOG.md; docs/STAGE8_SPEC.md |
| Remedy | Move CLAUDE.md's stage-by-stage history to a linked file and keep its rules and current state; give CHANGELOG.md a current-state head and split it by stage. |
| Effort | an afternoon (records only) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | robustness #3 |

<a id="cl-rob-04"></a>

**CL-ROB-04 · S3 · P4 · confirmed defect.** Each context restore keeps about 2.6-4 MB of heap and one more dispose listener per geometry and texture (three r128)

| field | |
|---|---|
| Subsystem | three r128 restore path (inherited by the app) |
| User impact | A page that loses and regains its context many times (a phone backgrounding the tab under memory pressure) grows by about 3 MB per loss; nothing else degrades in the cycles measured. |
| Status / origin | open / inherited |
| Expected | A restore leaves the heap where it was. |
| Observed | +2.56 to +2.76 MB per idle restore, +3.6 to +4.0 MB per playing restore, retained. |
| Evidence | After forced GC (two HeapProfiler.collectGarbage), JSHeapUsedSize 15.73 MB at the control step, then 18.29, 20.98, 23.65, 26.41, 29.13 after the five idle restores and 33.12, 36.67, 40.37 after the three playing ones; dispose listeners on the scene's geometries 348 -> 1869 (the most on one geometry 1 -> 9), textures 18 -> 162; materials' unchanged; CDP DOM listeners 566/579, nodes 1,859-1,927 and programs 31-35 not growing. initGLContext() makes new WebGLGeometries/WebGLTextures whose dispose closures are added again to every object used; EventDispatcher drops only an identical function. |
| Reproduction | node tools/audit-post8/robustness/ctx-cycles.js |
| References | docs/audit-post8-evidence/robustness/ctx-cycles.json; node_modules/three/src/renderers/WebGLRenderer.js:266-288; node_modules/three/src/renderers/webgl/WebGLGeometries.js:56; node_modules/three/src/renderers/webgl/WebGLTextures.js:481 |
| Cause verified | yes (source read; counts rise by exactly one per restore) |
| Remedy | Accept and record (rare event; three.js stays r128 unless agreed, CLAUDE.md). An app-side cure would reach into three's internals. |
| Effort | n/a (record) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | robustness #4 |

<a id="cl-rob-05"></a>

**CL-ROB-05 · S3 · P4 · accepted compromise.** The single file needs cdnjs: offline, or where cdnjs is blocked, the map cannot start

| field | |
|---|---|
| Subsystem | shell.html three.js tag (decision 133 (a)) |
| User impact | Offline or behind a filter that blocks cdnjs.cloudflare.com, a visitor sees the failure dialog: 'The map cannot start ... could not be loaded from cdnjs.cloudflare.com ... The map needs a network connection that can reach that address.' |
| Status / origin | accepted / accepted-compromise |
| Expected | As decided. |
| Observed | As decided. |
| Evidence | Decision 133 (a) keeps three.js on cdnjs with integrity and crossorigin and a plain failure message; check:contrast's three.js-aborted case holds the dialog (lead-verified). |
| References | shell.html:26-28; shell.html:437; docs/FINAL_AUDIT.md:835; docs/FINAL_AUDIT.md:880 |
| Remedy | None required; inlining three.js (option (b), about 600 KB) would make the file work offline. |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | robustness #5 |

<a id="cl-rob-06"></a>

**CL-ROB-06 · S4 · P4 · probable problem.** Seven archived builds on the same Pages origin load three.js without integrity

| field | |
|---|---|
| Subsystem | archive/ (published by Pages) |
| User impact | Only on a cdnjs compromise: a tampered three.js would run in the owner's origin through those pages, which the product's SRI otherwise prevents. |
| Status / origin | open / inherited |
| Expected | No page on the origin trusts a CDN copy unchecked. |
| Observed | 7 frozen pages do. |
| Evidence | grep of each archive's script tag: 7 of 19 without integrity (the builds before roadmap step 3's SW-1); Pages publishes archive/ with the rest of the branch. |
| References | archive/correction-pass-672aff9f.html; archive/stage0-c09c4b23.html; archive/stage2c-68ac7721.html; archive/spine-6b2cccd4.html; archive/stage4d-9b13adbf.html; archive/stage6b-7fc0f6c3.html; archive/step2-af98f586.html |
| Remedy | Publish only the product on Pages (see R-1); the archives stay frozen in git. |
| Effort | small |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | robustness #8 |

<a id="cl-rob-07"></a>

**CL-ROB-07 · S4 · P4 · optional improvement.** Assurance tools CI never runs have started to rot: 5 of Stage 8's 189 mutations no longer apply; check:visual runs only on dispatch

| field | |
|---|---|
| Subsystem | tools/, .github/workflows/checks.yml |
| User impact | None to visitors. The evidence that Stage 8's checks can fail is a snapshot: for five checks it can no longer be reproduced as recorded. |
| Status / origin | open / optional-improvement |
| Expected | Mutation evidence reproducible. |
| Observed | 97% applicable; 5 stale. |
| Evidence | CI runs 24 of 248 tools files on every push; check:visual and its live blocks only on workflow_dispatch with inputs.visual. The 224 others all parse and their requires resolve (tools-rot.json). Read without running, 184 of 189 mutations in tools/stage8/mutate-*.js still find the code they break; not: 8D 'stale', 8F 'treetris', css-8F 'woods8e', css-8G 'shape' and 'tilt' (changed since by 8E's prerequisite, 8H and 8J). |
| References | docs/audit-post8-evidence/robustness/ci-reach.json; docs/audit-post8-evidence/robustness/tools-rot.json; docs/audit-post8-evidence/robustness/mutate-rot.json; .github/workflows/checks.yml |
| Remedy | Refresh the five mutations' search strings; optionally run the css-test mutations (node only) in CI. |
| Effort | small |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Verifier: publishing only the product must keep tools/step6/perf-run.html (the owner's device route on Pages), with CL-ROB-01's fix. |
| Area finding | robustness #7 |

<a id="cl-rob-08"></a>

**CL-ROB-08 · S4 · P4 · optional improvement.** The project has no licence

| field | |
|---|---|
| Subsystem | repository |
| User impact | Visitors and contributors have no stated right to reuse the code or the dataset; third-party parts are licensed correctly. |
| Status / origin | open / inherited |
| Expected | An owner decision recorded. |
| Observed | None. |
| Evidence | No LICENSE or COPYING file in git ls-files; package.json private:true with no license field. The fonts' licences are embedded in full in the build; three.js is not redistributed (MIT notice not owed); the textures are CC0 from Poly Haven, named at assets.js:1-2. |
| References | package.json |
| Remedy | The owner chooses a licence (code and data may differ) or states all rights reserved. |
| Effort | minutes |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | robustness #9 |

<a id="cl-rob-09"></a>

**CL-ROB-09 · S4 · P4 · accepted compromise.** Decision 140's premise has moved: the self-test is 21.7% of the file (12.8% when decided), +277,502 bytes in Stage 8

| field | |
|---|---|
| Subsystem | build size |
| User impact | Every visitor downloads 611,113 bytes of self-test and debug API (and 437,848 bytes of comments, partly inside it) that no visitor runs; the desktop report transferred 1,219,603 bytes compressed for the page. |
| Status / origin | accepted by decision 140 on a premise of 12.8% / new-regression (Stage 8 growth of an accepted compromise) |
| Expected | An accepted trade-off re-put when its measure changes materially. |
| Observed | Not re-put since Stage 8 Part A recorded "present, larger". |
| Evidence | size.json (tools/audit/size.js on f10fe585): AUSTERLITZ_DEBUG 611,113 bytes, shareOfHtml 0.217; comments 437,848 bytes (15.6%); 225,445 bytes (12.8%) at the audit, 333,611 (15.0%) at Stage 8 Part A by the same tool |
| References | docs/audit-post8-evidence/records/size.json; docs/FINAL_AUDIT.md:842; docs/STAGE8_SPEC.md:1336; docs/STAGE8_SPEC.md:5577 |
| Remedy | Put decision 140 to the owner again with these numbers; no change without the owner (the harness testing the shipped file is the reason it stands). |
| Validation | node tools/audit/size.js --json |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch); CONFIRMED (batch)] |
| Auditor's note | Merged: the records area read decision 140's premise, the robustness area the payload; one issue, the self-test shipped in the product. |
| Area finding | records #8; also reported as robustness #10 |

<a id="cl-rob-10"></a>

**CL-ROB-10 · S4 · P4 · optional improvement.** Small dead code: gaitDist is never called though the gait's comment and CLAUDE.md name it

| field | |
|---|---|
| Subsystem | app.js, world.js |
| User impact | None; misleads a reader about how the gait's phase is computed. |
| Status / origin | open / new-regression |
| Expected | Named functions in use. |
| Observed | 99 bytes dead. |
| Evidence | Of 791 top-level functions, gaitDist (app.js:5827) has no reference but the comment at app.js:5780; v8Near (world.js:1703) only a comment and the generated _world_mod.js; posOf (app.js:712) is test-only and held by check:data's model list. |
| References | app.js:5827; app.js:5780; world.js:1703; app.js:712; tools/visual/data-invariance.js:26 |
| Remedy | Remove gaitDist and v8Near, or name gaitDistOf in the comment. |
| Effort | minutes |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | robustness #11 |

<a id="cl-rob-11"></a>

**CL-ROB-11 · S4 · P4 · optional improvement.** esc() leaves quotes, and double-quoted attributes take its output

| field | |
|---|---|
| Subsystem | app.js:6910 |
| User impact | None today: no string in the dataset or LABELS holds a double quote, '<' or '&'. A future data edit with a double quote in a name would break an attribute (aria-label, title). |
| Status / origin | open / inherited |
| Expected | Attribute text escaped for quotes. |
| Observed | Relies on the data. |
| Evidence | esc escapes & < > only; app.js:2496 aria-label="'+esc(f.name)+'..."; the day-track's aria-label="'+esc(lab)+'"; dataset-chars.json: 0 such characters in data.js, analysis.js, appearance.js, geo.js and LABELS; narrative.js's refs with " go to a single-quoted data-ref. |
| References | app.js:6910; app.js:2496; app.js:8117-8118; docs/audit-post8-evidence/robustness/dataset-chars.json; docs/audit-post8-evidence/robustness/sink-judgement.json |
| Remedy | Escape " and ' in esc() (a no-op on today's text), or a test that no data string holds them. |
| Effort | minutes |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | robustness #12 |

<a id="cl-rob-12"></a>

**CL-ROB-12 · S4 · P4 · optional improvement.** The frame loop requests an animation frame at the display's rate while nothing is drawn

| field | |
|---|---|
| Subsystem | app.js:9117-9125 |
| User impact | An idle page wakes the main thread about 57 times a second (measured under SwiftShader); no frame is drawn and no timer runs. Battery cost on a phone not measured. |
| Status / origin | open / inherited |
| Expected | n/a (design: idle frames touch nothing, 8H) |
| Observed | as stated |
| Evidence | visitor.json idle.at0400: 120 s at 04:00, 0 frames drawn, 6,825 animation-frame callbacks, 0 timers or intervals fired, CDP TaskDuration +1.135 s, no layout. |
| References | app.js:9117-9125; docs/audit-post8-evidence/robustness/visitor.json |
| Remedy | Optional: stop requesting frames when idle and restart on input, a tween, Play or a panel's transition. |
| Effort | small, with care |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | robustness #13 |

#### CL-PERF: performance and the device evidence

<a id="cl-perf-01"></a>

**CL-PERF-01 · S3 · P2 · probable problem.** 'After the phone warms' is asserted without temperature or throttling evidence, and the reports contradict a warming trend for Play

| field | |
|---|---|
| Subsystem | Stage 8 device records (STAGE8_SPEC section 25, CHANGELOG, ROADMAP, decision 269 (a)'s carried text) |
| User impact | The final audit's performance item reads as if a cool phone would do better. The data show the phone draws Play at about 43 fps from its first block after the warm-up to its last, in both runs. A visitor meets about 43 fps in Play, not only once the phone is hot. |
| Status / origin | confirmed (no thermal evidence exists; Play's series is flat); the cause of the Overview's dips is unverified / new-regression (Stage 8 records, 1 Nov 2026) |
| Expected | Thermal attributions made only with evidence, and steady-state rates reported as the build's on that device. |
| Observed | 'As it warms' is marked as inference at 5609. 'After warming' and 'after the phone warms' appear unmarked at 5657, 5672 and 5679, and CHANGELOG.md:25 states it as fact. |
| Evidence | No report records temperature or throttling, and a page cannot read them (perf-route.js:196-205). Play: all 24 A blocks run at 42.8-43.8 fps (R1 about 07:54-07:57, R2 about 08:04-08:06). The faster Play warm-ups (45.2/45.7 fps) drew lighter content: median 428 calls and 1,203,643 triangles, against 517 and about 1,364,000 in the As (45 s of Play from 08:30 against 6 s blocks from 08:30). Overview: the warm-up (49.5/49.9 fps) has the same counts but is one continuous 2.5-turn orbit, while each block samples the first 120 degrees after the view is applied again. The slow blocks (27.2-32.0 fps) have js50 17-18 ms against 6-7 elsewhere and recover within 1-2 blocks. There is no monotonic decline: R2's second round is its steadiest (40.9-42.5). |
| References | docs/STAGE8_SPEC.md:5609; docs/STAGE8_SPEC.md:5657; docs/STAGE8_SPEC.md:5672; docs/STAGE8_SPEC.md:5679; docs/STAGE8_SPEC.md:1263; CHANGELOG.md:11; CHANGELOG.md:25; docs/ROADMAP.md:575; tools/step6/perf-route.js:284-295; tools/step6/perf-route.js:196-205; docs/audit-post8-evidence/perf/reconcile.md (section 7) |
| Cause (hypothesis) | Overview dips: a transient CPU-side slowdown (core scheduling or frequency, or a page-side task). Warm-up rate: content (Play) and the orbit's arc plus the per-block view re-application (Overview). |
| Cause verified | no |
| Remedy | Reword to 'in the blocks after the 45 s warm-up (the steady state)'. Note that Play's series is flat and that the warm-ups drew different content, and keep 'whether the phone throttled is unknown'. Records only; decision 269 (a) stands. |
| Effort | 0.5-1 h |
| Validation | A continuous 5-minute Play run on a rested, unplugged phone, summarised every 10 s, would show whether the frame rate declines. |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | perf #2 |

<a id="cl-perf-02"></a>

**CL-PERF-02 · S3 · P2 · untested area.** No integrated-GPU run: performance on the machine decision 138 and section 8.3 name is unknown

| field | |
|---|---|
| Subsystem | Device acceptance |
| User impact | Unknown for the most common laptop class. On the desktop, Play is script-bound (js50 7.6 ms median, 8.4-9.0 ms p95). On a CPU half as fast, Play's 95th percentile would approach a 60 Hz frame (inference). |
| Status / origin | unverified / accepted-compromise (decisions 235 and 250 (b); the integrated-GPU condition was retained and not triggered: the largest 4x rise against L3 is +1.4% in calls) |
| Expected | One ordinary-route run on an integrated-GPU laptop, as the step 6 protocol and section 8.3's budget row intended. |
| Observed | Desktop RTX 4070 and iPhone only. |
| Evidence | No integrated-GPU report exists in docs/stage8-evidence/device or docs/step6-evidence. |
| References | docs/STAGE8_SPEC.md:1236; docs/STAGE8_SPEC.md:5552-5554; docs/STEP6_SPEC.md:978-982; docs/stage8-evidence/device/desk-D1.json (play-half js50 7.6, js95 8.4) |
| Remedy | Not a prerequisite: one owner run of the ordinary route, twice, on an integrated-GPU laptop. |
| Effort | About 15 min of owner time plus 1 h of analysis |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | perf #6 |

<a id="cl-perf-03"></a>

**CL-PERF-03 · S3 · P3 · probable problem.** The long-frame share, the device acceptance metric, is not a dropped-frame measure and is unstable at the phone's operating point

| field | |
|---|---|
| Subsystem | Device performance evidence: the tools/step6/perf-route.js metric and its use in STAGE8_SPEC sections 8.5, 14.1, 24-25 and decision 269 (a)'s carried text |
| User impact | Readers of the records (the owner, the final audit) see 'Play 8.6% long, Overview 18.1% long' and may read 80-90% of frames as on time. In fact more than half of the phone's Play frames exceed one 60 Hz refresh (p50 23 ms), and 28%/32% of refreshes bring no new frame. On the 144 Hz desktop, Play reads 0% long while 13.7-16.5% of refreshes bring no new frame. |
| Status / origin | confirmed / inherited (metric defined in step 6; reused by Stage 8's section 8.5 rule and sections 24-25) |
| Expected | A device acceptance measure that rises with missed refreshes and is comparable across refresh rates, and records that say what the share counts. |
| Observed | It is a share of delivered intervals above a floored threshold. It is blind to 1-2 missed refreshes at 144 Hz. At the phone's 23 ms operating point it varies 5.3-14.2% at constant fps; its 25.5 ms threshold sits in the tail of a single distribution. |
| Evidence | Definition: long = interval > max(1.5R, 25 ms), counted per delivered interval, per segment (perf-route.js:157-167). Desktop: R 6.94 ms, so the threshold is the 25 ms floor (3.6 refreshes). D1/D2 Play: 120.2-124.3 fps, p90 13.9 ms, long 0%. Phone: R 17 ms, threshold 25.5 ms. The 24 Play A blocks: 42.8-43.8 fps, p50 23 (one 22), p95 26-27, max 27-31, long 5.3-14.2%. Missed refreshes (1 - fps x R): phone Overview 32%, Play 27.8%; desktop Play 13.7-16.5%. |
| References | tools/step6/perf-route.js:157-159; tools/step6/perf-route.js:160-171; tools/step6/phone-rule.js:18; docs/STAGE8_SPEC.md:1257-1260; docs/STAGE8_SPEC.md:5614-5618; docs/STAGE8_SPEC.md:5656-5658; docs/STAGE8_SPEC.md:5672-5673; docs/STEP6_SPEC.md:179; CHANGELOG.md:11; CHANGELOG.md:25; docs/audit-post8-evidence/perf/reconcile.md (sections 6-7) |
| Remedy | Records: report the missed-refresh share (1 - fps x R) beside longPct, and call longPct 'the share of frames longer than 25.5 ms', not a drop rate. Route, for future runs: add the share of intervals above R and above 1.5R without the floor, plus a 1 ms histogram. The section 8.5 rule itself was adopted by decision 250 (b); changing it is the owner's call. |
| Effort | 0.5-1 h (records); 2-4 h (route change and a local run) |
| Risk of the remedy | low |
| Validation | On future reports, the new columns from the histogram must reproduce the route's fps; reconcile.js re-run. |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | Verifier: STAGE8_SPEC.md:1259 states the threshold max(1.5 R, 25 ms); STEP6_SPEC.md:179 and the perf-route.js:157 comment call it 'a missed refresh', which is wrong at 144 Hz. |
| Area finding | perf #1 |

<a id="cl-perf-04"></a>

**CL-PERF-04 · S3 · P3 · probable problem.** The desktop before/after spans a browser update (Chrome 155 to 156) that section 24 does not record; the accepted CPU excess cannot be attributed to Stage 8 alone

| field | |
|---|---|
| Subsystem | Stage 8 device records (section 24.1's CPU line; decision 268 (a)'s carried item) |
| User impact | The final audit could attribute the +1.0 to +1.5 ms js50 rise, and Play's drop from 139-140 to 120-124 fps at 144 Hz, entirely to Stage 8's code. Part of it may be the browser. |
| Status / origin | confirmed / new-regression (Stage 8 record) |
| Expected | A like-for-like before/after (decision 250 (b): 'repeated, comparable device runs'), or the confound named. |
| Observed | Section 24 describes 'the same desktop as step 6's L1-L3: Chrome 156' and says 'these runs cannot say which part of Stage 8 added it', presupposing that Stage 8 added all of it. |
| Evidence | Browser: L3 Chrome/155 (as were L1 and L2); D1/D2 Chrome/156. Otherwise the same: identical route measurement code, the same played clock windows (510 to 621.9/622.4 and 510 to 550.9/551), and the same GPU, page, density and effects. js50, L3 to D1/D2: - Overview orbit 4.8 to 5.8/5.9 - Overview orbit with effects off 4.0 to 5.1 - Play at half speed 6.1 to 7.6 - Play at 4x 6.0 to 6.9/7.0 - the 4x views with the figures hidden +0.5 to +0.6 - the culled low views -0.2 to +0.2 - the light views +0.1 to +0.3 |
| References | docs/STAGE8_SPEC.md:5527-5540; docs/STAGE8_SPEC.md:5558-5563; docs/step6-evidence/perf-L3-desktop.json (device.ua Chrome/155.0.0.0); docs/stage8-evidence/device/desk-D1.json (device.ua Chrome/156.0.0.0); docs/stage8-evidence/device/desk-D2.json; docs/audit-post8-evidence/perf/route-history.txt; docs/audit-post8-evidence/perf/reconcile.md (section 6) |
| Remedy | Add one sentence to section 24 naming Chrome 155 to 156. If attribution is wanted, profile both builds on one browser version (not a prerequisite; decision 268 (a) stands). |
| Effort | 0.25 h (record); 1-3 h (optional profile) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Auditor's note | The perf-attribution area (CL-PERF-12) reproduced the excess on one fixed browser (Chromium 141 for both builds) at the device's ratio and located it between step 6's build and 8E: the unrecorded browser update remains a records defect, but it is not needed to explain the excess. |
| Area finding | perf #3 |

<a id="cl-perf-05"></a>

**CL-PERF-05 · S3 · P3 · probable problem.** The 'heaviest frame' figures in sections 24-25 are segment medians, and the census maxima are below what the route drew in Play and in phase 8's Overview

| field | |
|---|---|
| Subsystem | Budget evidence: perf-route.js counts; census-8i.js maxima; STAGE8_SPEC sections 21.9, 22.5, 24.1, 25.1 |
| User impact | Budget headroom is overstated. The census gives 23.2% (desktop) and 20.5% (phone); at the route's Play medians it is 18.2% and 15.8%, and the per-frame maximum is recorded nowhere. The budgets still hold at the medians. |
| Status / origin | confirmed / inherited (median counts since step 6) / new-regression (the census maxima used as Stage 8's 'settled baseline') |
| Expected | 'Heaviest frame' measured as a per-frame maximum, or worded as the heaviest segment median; census maxima that cover the heaviest views the build draws. |
| Observed | Medians are called 'the heaviest frame', and no census case plays the clock or shows phase 8's Overview on a phone. |
| Evidence | The route records calls and triangles as pct(...,0.5) over drawn frames, i.e. the median (perf-route.js:170). Desktop: Play at 4x median 2,289,649 triangles, against the census's complete-frame maximum 2,151,193 (narrow-1024). Phone: Play median 1,364,249 for the build's own blocks (1,364,901 in a gait-at-rest block), against the census's phone maximum 1,288,561 (phone-390-first); phase 8's Overview median 1,309,505. Where the views coincide, route and census agree within 0.14%. |
| References | tools/step6/perf-route.js:170; docs/STAGE8_SPEC.md:5548-5551; docs/STAGE8_SPEC.md:5626-5628; docs/STAGE8_SPEC.md:5117-5125; docs/STAGE8_SPEC.md:5372-5375; docs/stage8-evidence/8l/census/census-8l.json; docs/audit-post8-evidence/perf/reconcile.md (section 9) |
| Remedy | Records: say 'the heaviest segment median'. Route: record per-frame max calls and triangles. Optionally add a Play-under-Follow case and a phone phase-8 Overview case to the census; adding cases is a check change and the owner's call. |
| Effort | 0.25 h (records); 1-2 h (route); 2-4 h (census cases) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | perf #4 |

<a id="cl-perf-06"></a>

**CL-PERF-06 · S3 · P3 · accepted compromise.** The two phone readings are not equally strong: P5 (Stage 8's own starting build) points to a Play slowdown from 53 to 43 fps; the P3/P4 proxy is dominated by device state

| field | |
|---|---|
| Subsystem | Phone acceptance (STAGE8_SPEC section 25.1; decision 269 (a)) |
| User impact | On the owner's iPhone 17 Pro, Play at half speed and phase 8's Overview draw at about 43 and 41 fps on a page paced at 60 Hz, which is visible judder. Across Stage 8, Play probably slowed (inference). Decision 269 (a) accepted this as measured. |
| Status / origin | inferred / accepted-compromise |
| Expected | n/a (accepted by decision 269 (a)) |
| Observed | Section 25.1 and decision 269 (a) record the two readings as equal alternatives. |
| Evidence | P5's build (b04e150) is md5 c4793156, Stage 8's starting build, which section 24 names. P5 Play at half speed: 53 fps, p50 17, 1.6% long, 508 calls, 1,464,345 triangles, clock 510 to 550.6. This build's Play As: 43.35 fps (24 blocks within 42.8-43.8), p50 23, 517 calls, about 1.36 M triangles: -18%. Overview orbit 47 to 40.8 fps (-13%). The desktop moves the same way. Caveats: P5 is one session, and on the earlier build Play at half speed varied 27.6-40.2 fps across P1/P2/P5a/P5b. P3/P4: As at medians of 21.0/27.1 fps, all 100% long; density1Pass Overview blocks 25.5-33.6 fps. In the Overview culling saves nothing (532 vs about 525 calls) and triangles are only 11% fewer, yet fps is 39% higher. |
| References | docs/STAGE8_SPEC.md:5630-5640; docs/STAGE8_SPEC.md:5669-5673; docs/step6-evidence/perf-P5-iphone.json; docs/step6-evidence/perf-P3-iphone.json; docs/step6-evidence/perf-P4-iphone.json; docs/STEP6_SPEC.md:1283-1291; docs/audit-post8-evidence/perf/route-history.txt |
| Remedy | Nothing is required by decision 269 (a). For the final audit's weighing: treat the P5 reading as the stronger, and state that it is a single session. The measurement that would settle it is decision 269's option (b), two ordinary-route phone runs; this is listed, not asked for. |
| Effort | n/a (about 10-15 min of owner time if ever run) |
| Dependencies | Decision 269 (a) (not re-litigated) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | perf #5 |

<a id="cl-perf-07"></a>

**CL-PERF-07 · S4 · P3 · optional improvement.** Instrument limits of the device route: no raw intervals, median counts, flags rather than effects, no clock for played blocks, one refresh measurement

| field | |
|---|---|
| Subsystem | tools/step6/perf-route.js |
| User impact | Future device runs cannot be re-derived or attributed beyond their summaries. This audit could recompute no percentile and could not test the 'warming' hypothesis. |
| Status / origin | confirmed / inherited (step 6), with Stage 8 additions (the brackets) |
| Expected | Reports that can be re-derived and attributed. |
| Observed | As listed. |
| Evidence | Each segment keeps summaries only. Calls and triangles are medians. drawing() reads shadowMap.autoUpdate, castShadow, visible and the pixel ratio, not sun.castShadow, so 'shadow pass off' is shown on lowTier where no shadow map exists. The phone and bracket played blocks have no clockFrom/clockTo. The refresh is measured once at the start. The wake lock result is not kept. |
| References | tools/step6/perf-route.js:160-171; tools/step6/perf-route.js:170; tools/step6/perf-route.js:277-282; tools/step6/perf-route.js:289-295; tools/step6/perf-route.js:313-317; tools/step6/perf-route.js:227-235; tools/step6/perf-run.html:55 |
| Remedy | Add a 1 ms interval histogram and per-frame max calls and triangles per segment; clockFrom/clockTo for every played block; FX.on, CULL.on and sun.castShadow per block; a refresh re-measure at the end; the wake lock result. Bump VERSION and check with tools/step6/perf-local.js. |
| Effort | 2-4 h |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | perf #9 |

<a id="cl-perf-08"></a>

**CL-PERF-08 · S4 · P4 · probable problem.** Over-readings in the records: 'the figures and standards are what a phone's frame waits on' and 'the gait adds none'

| field | |
|---|---|
| Subsystem | Stage 8 device records (sections 24.1 and 25.1; decision 269's 'the figures their cost') |
| User impact | A later performance task could target the wrong resource (the gait shader, or GPU vertex load) on the strength of a reference that removes calls, triangles, script and animation together. |
| Status / origin | confirmed / new-regression (Stage 8 records) |
| Expected | 'Hiding the figures (their calls, vertices, script and animation together) restores Play to 59 fps; the Overview still drops without them.' 'The gait's marginal cost is below the bracket's resolution.' |
| Observed | Stated as a single cause ('what a phone's frame waits on') and as a null cost ('adds none'). |
| Evidence | Figures hidden, on the phone: - Play: 517 to 229 calls, 1.36 to 0.74 M triangles, js50 7-8 to 5-6, 43 to 59 fps. - Overview: 532 to 231 calls, 1.31 to 0.68 M triangles, 47.4-54.4 fps, still up to 11.1% long. Gait bracket: block B sets amplitude 0, but gaitStep's per-frame checks and the vertex hook (attributes, branch test) remain. - Desktop: js50 7.2-7.4 (gait) vs 7.2-7.3 (at rest), median 7.2 both; p50 7.0 in every block (vsync-quantized). The GPU timer (gpu50 4.5-4.6 on both sides) is the better evidence of no vertex cost. - Phone: 43.05 vs 43.3 fps. |
| References | docs/STAGE8_SPEC.md:5562; docs/STAGE8_SPEC.md:5623-5624; docs/STAGE8_SPEC.md:5672-5673; docs/STAGE8_SPEC.md:5679; tools/step6/perf-route.js:187-194; tools/step6/perf-route.js:82; app.js:1852; app.js:5850-5869 |
| Remedy | Reword the two sentences (records only). |
| Effort | 0.25 h |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | perf #7 |

<a id="cl-perf-09"></a>

**CL-PERF-09 · S4 · P4 · confirmed defect.** Small numeric and wording inaccuracies in sections 24-25

| field | |
|---|---|
| Subsystem | Stage 8 device records |
| User impact | Minor: a reader who checks the numbers finds small mismatches. |
| Status / origin | confirmed / new-regression (records) |
| Expected | Numbers as computed from the reports. |
| Observed | As listed. |
| Evidence | 1. Largest rise in calls against L3 among the build's own 4x segments is +1.4% (ph8-overview orbit 809 to 820; play-half 794 to 805), not +0.8%. 2. The 9 long frames are counted only after each segment's first 0.5 s; 4 segments hold frames over 25 ms in that first 0.5 s (desk-cull warm-up 76.5 ms). 3. The phone's 'heaviest frame' 1,364,901 is a gait-at-rest B block's median; the build's own maximum is 1,364,249. 4. Standard medians 43.35 and 18.15 are printed 43.3 and 18.1; the cull warm-up's 59.9 is printed 60. 5. 'Checked by script': no checking script was committed. |
| References | docs/STAGE8_SPEC.md:5553; docs/STAGE8_SPEC.md:5546-5547; docs/STAGE8_SPEC.md:5626; docs/STAGE8_SPEC.md:5614-5618; docs/stage8-evidence/device/README.md:5 |
| Remedy | Correct in the records, and commit a checking script (tools/audit-post8/perf/reconcile.js can serve). |
| Effort | 0.25-0.5 h |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | perf #8 |

<a id="cl-perf-10"></a>

**CL-PERF-10 · S4 · P4 · untested area.** A 329 ms frame in the phone's first effects-off block: counted, unexplained, and not in section 25.2

| field | |
|---|---|
| Subsystem | Effects toggle on the phone (setFXEnabled) / device records |
| User impact | A phone visitor who turns Visual effects off may see a one-off hitch of about a third of a second (inference from one occurrence). |
| Status / origin | confirmed (data); cause unverified / unknown (first observed on the Stage 8 build; the fx bracket did not exist before) |
| Expected | No multi-hundred-millisecond stall when toggling effects, or a recorded reason. |
| Observed | One 329 ms interval. |
| Evidence | Block 'fx B AB 1.1': 318 frames, 56.7 fps, p50 17, max 329 ms, long 1 (0.3%), warm 24. The stall therefore fell after the block's first 0.5 s, at least 0.8 s after the toggle. No later B block shows it (max 17-36). The desktop's first B block has max 7.2. |
| References | docs/stage8-evidence/device/phone-fx.txt:11; docs/stage8-evidence/device/phone-fx.json (segments[3]); docs/STAGE8_SPEC.md:5647-5650 |
| Cause (hypothesis) | A first-use program compile or allocation on the effects-off path, or a GC pause. |
| Cause verified | no |
| Remedy | Diagnose in the browser phase: in a lowTier page, count renderer.info.programs and time frames around the first setFXEnabled(false). If it is a program compile, precompile the effects-off path. |
| Effort | 1-2 h (diagnosis) |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | perf #10 |

<a id="cl-perf-11"></a>

**CL-PERF-11 · S4 · P4 · accepted compromise.** Section 8.5's acceptance rule is weak at both refresh rates, and the per-PR before/after was replaced by one end-of-stage comparison

| field | |
|---|---|
| Subsystem | Device acceptance protocol |
| User impact | The rule 'held' on the desktop while Play fell 11-14% in fps. Across routes on the phone, its median clause 'held' with a 6 ms (35%) rise in Play's median. Regressions within Stage 8 cannot be attributed to a PR. |
| Status / origin | confirmed / accepted-compromise (decision 250 (b) adopted section 8.5's rule; section 24 records that section 20.12's 8G/8H pair was not run; decisions 268 (a) and 269 (a) accept as measured) |
| Expected | n/a (owner-accepted) |
| Observed | As stated. |
| Evidence | Median clause: one refresh is 6.9 ms at 144 Hz (allowing 144 to about 72 fps) and 17 ms at 60 Hz (allowing 60 to 30 fps). Long clause floor: 25 ms. Desktop Play 139.0-139.7 to 120.2-124.3 fps: the rule holds. Phone across routes: Play p50 17 to 23 ms: the median clause holds. |
| References | docs/STAGE8_SPEC.md:1257-1260; docs/STAGE8_SPEC.md:4663-4679; docs/STAGE8_SPEC.md:5536-5540; docs/STAGE8_SPEC.md:5544-5547; docs/STAGE8_SPEC.md:5633-5636 |
| Remedy | None required. If the owner revisits it, a missed-refresh clause (for example, 1 - fps x R rising by more than 5 points) would catch both cases. |
| Effort | n/a |
| Adversarial verification | CONFIRMED: [lenses: CONFIRMED (batch)] |
| Area finding | perf #11 |

<a id="cl-perf-12"></a>

**CL-PERF-12 · S3 · P4 · accepted compromise.** Decision 268 (a)'s desktop script excess is mostly three.js re-binding 8D/8E's three extra kit attributes on every instanced draw, plus Stage 8's own per-frame app work

| field | |
|---|---|
| Subsystem | renderer / kit (8D, 8E) |
| User impact | On the owner's 144 Hz desktop Play's script passes the 6.9 ms frame (section 24.2: about one frame in five or six held two refreshes); accepted as measured by decision 268 (a); not re-required. |
| Status / origin | attributed / accepted-compromise |
| Expected | Section 8.3's CPU line: js50 not above L3's by more than 1 ms on the desktop. |
| Observed | Reproduced on one fixed browser (Chromium 141 for both builds) at the device's ratio (+22-23% here, +25% on the desktop), so the Chrome 155->156 update is not needed to explain it; located between L3 and 8E (8E->now within the spread). Mechanism: three attributes x about 450 instanced kit draws a frame ~ 1,350 extra vertexAttribPointer/bindBuffer pairs (inference from counts and code; no build with the attributes removed measured; 8D's build not measured). |
| Evidence | paired.md: Play CPU/frame L3 19.55, 8E 23.88, now 24.03 ms (+22.9%, adjacent pairs +22.8/+22.9%; session 1 +22%); GL calls 10,327 -> 13,227 -> 13,502 a frame at 791/789/802 draws; vertexAttribPointer +1,353, bindBuffer +1,330, useProgram +218 (Play), the same +1,341-1,400 on every Overview motion. summary.md: of the profiled rise (+9.69 ms Play, +8.74 drag) three.js JS + WebGL native +5.54 (57%) / +6.06 (69%), within it three's setup 0.68->1.17, bindBuffer 0.68->1.25, vertexAttribPointer 0.75->1.22 ms; Stage 8 app subsystems about +3.1 (Play: render path/gdepth +0.69, map layer +0.51, culling +0.47, outlines +0.36, updateVisibility +0.33, ground queries +0.23, confidence +0.18, arrows +0.17, gait +0.08, kitLod +0.04). |
| References | docs/STAGE8_SPEC.md:5558-5563; docs/STAGE8_SPEC.md:5594-5595; node_modules/three/build/three.js:10682-10691; app.js:1108; app.js:1243-1249; app.js:12866; git 4cb72b1 (8D); git 62f5cd2 (8E) |
| Cause (hypothesis) | three r128 binding-state re-setup for InstancedMesh multiplied by the kit's added attributes; useProgram +220 from the hooked materials' programs (not isolated) |
| Cause verified | partly: mechanism verified in three r128 source and by the exact per-frame call counts; per-attribute shares and useProgram's cause not isolated |
| Remedy | None required (decision 268 (a)). If the margin is wanted back: measure packing the per-instance aPh and aSl into one attribute and aPart into a spare component of an existing one (GL counts and the device route's js50), and the inherited freeRect memo (next finding), which is larger and independent. |
| Validation | two sessions, two rounds each, palindrome order; counts load-independent |
| Adversarial verification | not re-verified (see B intro) |
| Auditor's note | Refines CL-PERF-04: the excess reproduces on one fixed browser, so the unrecorded Chrome update does not explain it. |
| Area finding | perf-attribution #1 |

<a id="cl-perf-13"></a>

**CL-PERF-13 · S4 · P2 · optional improvement.** freeRect, the free-rectangle search, runs three times a frame over the whole viewport and is the largest app function in every profile (inherited)

| field | |
|---|---|
| Subsystem | camera / free rectangle (Stage 3B-3D, 4B, 4E) |
| User impact | About 13-25% of the profiled main-thread script a frame in both builds at the desktop page size; a memo could plausibly recover more than decision 268's excess (inference; device effect not measured). |
| Status / origin | open / inherited |
| Expected | A function of the viewport and the panel rectangles computed when they change. |
| Observed | Recomputed three times in every drawn frame although neither input changes in Play or an orbit. |
| Evidence | summary.md top functions: freeRect 3.8-6.5 ms profiled self a frame now, 2.5-8.0 in L3 (+ 'viewport' 2.5-4.4 in L3's drags, plausibly inlined, unverified); subsystem share 12.8-17.7% now, 15.7-25.3% L3. paired.md: landFreeRect 3 calls a frame, landPanels 4. Code: 320 x 163 = 52,160 cells at 2560x1305 each tested against every panel, one array allocated per cell (S.push([s0,hh])); callers shadowReceivers (321), placeLights' SHADOW_FIT key (347), smokePlace (6075). |
| References | app.js:4925-4943; app.js:6359; app.js:321; app.js:347; app.js:6075 |
| Cause verified | by code reading and call counts |
| Remedy | Memoize landFreeRect on the viewport and the rounded panel rectangles (MAPCAM already forms such a key, panelsKey), then measure with the same counts and the device route. |
| Adversarial verification | not re-verified (see B intro) |
| Area finding | perf-attribution #2 |

<a id="cl-perf-14"></a>

**CL-PERF-14 · S4 · P4 · untested area.** three r128 recomputes getProgramCacheKey every frame (2.1-2.8 ms profiled self a frame, both builds); cause not investigated

| field | |
|---|---|
| Subsystem | renderer (three r128 setProgram) |
| User impact | A constant share of every frame's script (about 6-9% profiled); not part of Stage 8's rise. |
| Status / origin | open / inherited |
| Expected | getProgram runs only when a material's version, lights state version, fog, encoding or clipping changes (three.js:18186-18215). |
| Observed | It runs in every frame for some materials; which condition fires was not checked. |
| Evidence | summary.md top functions: getProgramCacheKey 2.28 -> 2.23 (Play), 2.77 -> 2.12 (held), 2.77 -> 2.47 (route); getParameters 0.62 (L3 route). |
| References | node_modules/three/build/three.js:18075-18083; node_modules/three/build/three.js:18184-18215 |
| Cause verified | no |
| Remedy | Find which needsProgramChange condition fires per frame (lights.state.version, a material.version bump, fog) before any change; optional. |
| Adversarial verification | not re-verified (see B intro) |
| Area finding | perf-attribution #3 |

## C. Coverage matrix

### C.0 The subsystems audited

The product is one HTML file built by `build.py` from the sources below, with three.js r128 loaded from cdnjs under SRI. Line counts are for
`43e3e5b`.

| subsystem | where (lines) | what it holds | changed in Stage 8 | held by | audited by area |
|---|---|---|---|---|---|
| page shell, start-up, type, tokens | `shell.html` (440), `style.css` (884), `fonts.css` (352), `tokens.js` (113), `build.py` (53) | the markup, the start-up guard `AUS_BOOT`, the embedded type and its licences, the only colour and type source | 8A-8I: the tips, the toast, the far plate's token | `css-test.js`, the 8 start-up cases, `check:baseline` | robustness, a11y, records |
| geographic authority and ground | `geo.js` (128), `world.js` (2,636) | `GEOREF`, relief, land cover, water, roads, woods, villages, buildings, landmarks, garden | 8A ribbons; 8F water, woods, near ground; 8G-8K buildings, landmarks, the castle, the highway | `geo-test.js`, `terrain-test.js`, the self-test | geography, visual-landscape |
| historical dataset | `data.js` (811), `appearance.js` (1,086), `analysis.js` (388), `narrative.js` (637) | phases, order of battle and tracks, features, the appearance and ordnance claims, themes, plans, events, the per-statement claims | 8E `ORDNANCE`; 8G `BUILDINGS`/`CHAPELS`; 8J and 8K re-plots (decisions 259 (a), 260 (a)) | `check:data` (139 declarations), `test.js`, `sim-test.js`, `redteam.js`, `check:chronology` | history, sources-oob, sources-chronology, geography |
| simulation and state | `app.js` (14,255 in all): the clock, tracks and `stateAt`, the dwell, Follow, the readings ("Whose eyes?"), derived readings, selection and dossiers | positions, statuses, grades, readings and every view's state | 8A the readings' reach; 8H the pose at a pause or seek | `sim-test.js`, `runtime-test.js`, `audit.js`, the self-test | state, interaction |
| the 3D picture | `app.js`: scene, light, atmosphere, smoke, the ground shader, the kit, artillery, gait, culling, level of detail | the landscape as drawn | 8B outlines and arrows; 8D culling; 8E kit, gait, artillery; 8F; 8G | the self-test, `runtime-test.js`, `check:visual` | visual-landscape, perf, perf-attribution |
| the map layer | `app.js` `ml*`, `MLS`; `symbols.js` (90) | counters, names, events, places, their priority and their stabiliser in motion | 8C `MLS`; 8I the far plate | the self-test's motion block, `check:visual` | visibility, visual-maps |
| the paper map | `app.js` `MAPCAM`, `world.js` paper symbology | the north-up plan | 8E's water on it, 8I | `check:visual`'s paper cases | visual-maps |
| the interface | `app.js` and `shell.html`: docked layout, timeline, dossiers, sheets, opening and tour, the phone layout, the toast | every panel, control and text a visitor reads | 8A the sources at each dossier's head and the tips; 8H, 8I the toast | the self-test, `check:contrast`, `check:visual`'s phone and live blocks | interaction, a11y |
| tests, benchmarks, CI | 9 suites (`test.js` 533, `runtime-test.js` 1,662, `css-test.js` 1,182 and others), `tools/visual/` (the harness, thresholds, motion driver), `.github/workflows/checks.yml` | the regression suite, the browser checks, the benchmark ceilings, the gate | 8C-8L: the motion block, the census, the cull block, the ceilings (decision 267 (a)) | itself | tests, visibility |
| device evidence | `tools/step6/perf-route.js`, `perf-run.html`, `docs/stage8-evidence/device/` | the frame-time route and its 10 Stage 8 reports | 8D-8F brackets; the reports of 1 Nov 2026 | `phone-rule.js` | perf, perf-attribution |
| records | `CHANGELOG.md`, `CLAUDE.md`, `README.md`, `docs/*.md` | the project's memory of decisions and evidence | every PR | `test.js`'s and `check:chronology`'s text checks, in part | records |

### C.1 Coverage by audit dimension

Depth: **measured** means reproduced by probes or real input on the audited build. **Read** means established from the code, data or records
without running them. **Sampled** means part of the space measured. **Not covered** means no area did it.

| dimension (brief section) | what was examined | depth | what remains outside it |
|---|---|---|---|
| baseline and identity (1) | source, generated, deployed, tested and device-measured builds; the merged PRs; the hashes | measured (hashes, fresh build, Pages fetch) | none |
| historical integrity (3) | every track's anchors and legs against its acts, statuses, grades and claims; the events' claims; the Command tab; the open questions; 26 consistency claims | read and measured (node probes over the data) | the sources themselves for most statements (see E) |
| data integrity (3) | `check:data` 139/139; the forces' figures against the cited sources (42 claims); the strength notes | measured; read against sources | the appearance claims (`appearance.js`) were not re-read against their sources; 6B and the quote check did that |
| geographic integrity (3) | scale, orientation, relief against elevation data, waterways, roads, settlements, landmarks, the garden, the crossings (29 claims) | measured (open data: OSM, Wikidata, terrain models), read | no survey on the ground; 1805 conditions are reconstructions |
| simulation and state (4) | continuity at every critical time (766 checks, a 215,072-sample sweep), Play, the dwell, speed changes, seeks, readings, timers and listeners; 14 interaction scenarios by real input | measured | real-time behaviour on slow devices; Firefox and WebKit |
| visual quality (5) | 100 landscape captures over six vantages and the day, 74 paper-map and layout captures, the label hierarchy, the legend and furniture, long Play runs for visibility (21 runs) | measured (rendered output, SwiftShader) | GPU colour and shimmer on hardware; video of long play (stills and per-frame records only) |
| interaction, accessibility, first use (6) | real mouse, wheel, keys, taps and CDP touch; 400% zoom and 320 px reflow; forced colours (emulated); the accessibility tree; the first-run card and the opening | measured (Chromium; emulated phone) | no screen reader session; no real phone; no Safari or Firefox |
| performance (7) | the 10 device reports and their 349 rows recomputed; the route's definitions; the historical comparisons; CPU attribution against the L3 build (perf-attribution) | measured (recomputation); attribution under software WebGL | no device here; no integrated-GPU run exists |
| carried issues (8) | every item of `docs/STAGE8_SPEC.md` 20.13, 20.14, 21.9, 22.6, 23.4, 24.3, 25.4 and the roadmap's notes (C.4) | per item | as each item says |
| tests and evidence (9) | the required checks run; the gate; threshold history; 33 mutations as negative controls (30 caught, 3 missed); the self-test manifest; the benchmark's meaning | measured | the 317 self-test checks were not read one by one |
| robustness, security, maintainability (10) | HTML sinks, URL parameters, advisories, licences, offline dependence, context loss cycles, resize storms, prolonged use, idle behaviour, dead code, the tools never run by CI | measured and read | penetration testing beyond the page's own inputs |

### C.4 The carried issues, one by one

Every item carried to this audit (`docs/STAGE8_SPEC.md` 20.13, 20.14, 21.9, 22.6, 23.4, 24.3, 25.4, and `docs/ROADMAP.md`'s handed-on notes), as the records area registered it (`docs/audit-post8-evidence/records/carried.md`, 57 items), with its governing decision, its status now and this audit's findings or questions on it. A status says what the evidence shows; an accepted item stays accepted unless a finding says what new evidence bears on it.

| id | item | decision | status now | this audit |
|---|---|---|---|---|
| C-01 | Desktop performance: section 8.3's CPU line exceeded in Play at half speed (+1.5 ms) and the Overview's orbit (+1.1 ms); Play at 144 Hz holds about one frame in five or six for two refreshes | 268 (a) | accepted as measured (decision 268 (a)); not attributed | CL-PERF-12, CL-PERF-04 |
| C-02 | Phone performance: section 8.3's phone budget met; section 8.5 not evaluable like for like; after warming phase 8's Overview about 41 frames a second (18.1% long) and Play at half speed about 43 (8.6% long) | 269 (a) | accepted as measured (decision 269 (a)) | CL-PERF-06, CL-PERF-01, CL-PERF-03 |
| C-03 | An integrated GPU never measured (section 8.3's integrated-GPU condition; the machine decision 138 named) | 235; 250 (b); 268 (a), 269 (a) | not measured | CL-PERF-02; question 278 |
| C-04 | The inconclusive brackets: desktop culling, effects off and gait each 12 of 12 "neither"; phone culling 7 of 12 faster with it, effects 4 of 12 faster with them on, gait 12 of 12 "neither" | 250 (b) | recorded; "not shown" by the rule on both devices | CL-PERF-07, CL-PERF-11 |
| C-05 | Visual effects off not faster on the phone (5 of 14 effects-off blocks fell to 35-47 frames a second): a visitor who turns them off may get a slower map (inference; not decided) | none | open; undecided | CL-PERF-10 |
| C-06 | Counters hidden during playback: Play's longest hidden formation 4,033 ms; three counters dropped at rest in the hybrid view at 09:00 | 267 (a) (accepts the benchmark's totals, not the visibility) | open; confirmed, and understated by the benchmark | CL-MAP-01, CL-MAP-02, CL-TEST-02; question 274 |
| C-07 | Visibility over longer playback than the benchmark's runs, judged on the screen | 267 (a) | measured in this audit: acceptable in three presentations, not in Landscape with counters | CL-MAP-01, CL-MAP-07, CL-MAP-17 |
| C-08 | The motion block's 16 totals over their ceilings (248 jumps, 998 pops against 245 and 985) | 267 (a) | settled (decision 267 (a); not re-required) | CL-TEST-14 (decision 267 (a), not re-required) |
| C-09 | The troops' contact with the ground: 8F's chords with their bounds and counts, the original criterion (every foot on the ground) not satisfied, the animation's 0.2 ms budget not raised | 265 (a), provisional | provisional, unchanged (the device runs it waited on are recorded; the decision not revisited) | CL-VIS-01 (outside the check's scope) |
| C-10 | The ice under a low sun: the low views' glare at 15:00, 43.5% of the ice | 264 (a) | accepted, unchanged | none (accepted, confirmed visually) |
| C-11 | The troops' uniform facings (decision 245 (a): none drawn), to be reconsidered now that the troops can be judged | 245 (a); 104 | unchanged; the owner's reconsideration open | question 280 |
| C-12 | Artillery: the drivers on the guns on the heights (an inference from IV Corps' letter) and the gunners beside moving pieces | 243 (a) | unchanged; the owner has not decided | question 281 |
| C-13 | The Sokolnitz castle's prominence (about 96 by 73 m, reading smaller than the farmhouses beside it) and the III Column's figures over its symbol from 08:00 to 14:10 | 266 (a) | accepted, confirmed | CL-HIS-04 (the III Column's neighbour); accepted |
| C-14 | The castle's site on the model's road class, a track passing it (8J) | none (recorded, not acted on) | present | none |
| C-15 | The Austerlitz garden under the château's symbol at the Overview's scale, and no garden sign on the paper map | 259 (a) (built in 8J); none for the sign | unchanged; not decided | question 282 |
| C-16 | Satschan's farmsteads: five of seven drawn (the drawn mere's outline, decision 27, leaves no room) | 261 (a) | accepted, confirmed | CL-VIS-02 (trees on the mere beside it); accepted |
| C-17 | The omitted landmark symbols (BUILDINGS.notDrawn: St Anthony's chapel, the Santon's chapel, the Sokolnitz granary) | none (8G's data task; the alternatives not decided) | unchanged; not decided | CL-VIS-06; question 282 |
| C-18 | The Littawa's name dropped in the Plans view at the Overview | 267 (8L's bounded repair: the limit 13 on the owner's authorisation) | accepted; still dropped | CL-MAP-18 |
| C-19 | The low views' wall of formation names (decision 255 left it open; 255 (d) prototyped, 263 (a) the far names' lighter plate) | 255 (a), (d); 263 (a) | the plate built (8I); the wall present and open | CL-MAP-15 |
| C-20 | The knowledge rule against the drawn fog's ease ("Whose eyes?" read at the phase's mist while the fog eases over twenty minutes) | 92 | kept by decision 92 (explained) | none (kept by decision 92) |
| C-21 | A crown within a few units of the eye shows its facets as large planes | none | open; confirmed | CL-VIS-08 |
| C-22 | Four villages' buildings largely off the drawn village class (Sokolnitz 0%, Telnitz 5%, Kobelnitz 19%, Puntowitz 74% in 8G's count) | none (a land-cover question) | open; confirmed | CL-GEO-05 |
| C-23 | GEOREF.GT's 13.5 m shift against the Czech survey | none (below the map's unit) | recorded; no action needed | none (below the map's unit) |
| C-24 | 8G's evidence made and not committed: reconstructed or replaced in 8H, not recovered | none | unchanged (not recoverable) | none |
| C-25 | Not measured in Stage 8: a GPU's frame time (the crowns' hook's cost among them), Safari, memory on a device, a visitor's judgement of the gait, the buildings and the ice | none | partly measured since | CL-PERF-02 |
| C-26 | The geographic corrections of question 259 (the Sokolnitz group, the Pratzen church, the Austerlitz garden) | 259 (a) | done (8J), with residuals | CL-HIS-04, CL-GEO-08, CL-GEO-10 |
| C-27 | The highway east of the Santon and the post house (question 260) | 260 (a) | done (8K), with residuals | CL-GEO-10 |
| C-28 | More places beside a counter's anchor in motion (decision 258 (b), question 262) | 258 (b) prototyped; 262 (a) (8C's placement kept) | settled (not adopted) | none (settled, not adopted) |
| C-29 | The conventions labelled as such: the farmsteads' plan and the roofs (8G), the garden's rows (8J), the far plate's alpha (8I), the gait under compressed time (8E), the ribbons' widths (8A), the derived arrivals' rates (design values, unsourced) | 244 (a), 248 (a), 253 (b), 259 (a), 263 (a); 46 and section M.13 for the rates | accepted; labelled | none |
| C-30 | The identifications this map makes and says it makes: Stutterheim's heights by Dwaroschna as the ground east of Bosenitz, Schönhals's height as the rise east of the post, the 1825 sketch's places carried back to 1805, the 1826-52 road and post carried back to 1805 | 259 (a), 260 (a) | provisional, unchanged | none |
| C-31 | Historical question: the places in 1805 of the highway and the post (the First Military Survey not reached) | 260 (a) | open | CL-GEO-10 |
| C-32 | Historical question: which of the 1825 sketch's two channels carried the Goldbach north of the Sokolnitz castle in 1805 | 259 (a) | open; not visible to a visitor | CL-GEO-10, CL-GEO-04 |
| C-33 | Historical question: the castle's walls | 259 (a) | open in the records; stated as settled on screen | CL-GEO-02 |
| C-34 | Historical question: whether the bottom by Sokolnitz was marshy in December 1805 | 259 (a) | open in the records; drawn and told as settled | CL-GEO-06 |
| C-35 | Historical question: the garden's planting in 1805 | 259 (a) | open and visible | question 282 |
| C-36 | Historical question: Bagration's exact line at dawn and where he stood at 17:00 (Rausnitz, or already toward Austerlitz) | 180 (c); 260 (a) | open and visible | CL-HIS-17 |
| C-37 | Historical question: which side of the road Schönhals's height lay | 260 (a) | open; not visible (moot in the drawing) | none (moot in the drawing) |
| C-38 | Historical question: Krug's place (the Second Survey's "Kruch" beside Holubitz, against the drawn Krug's warped legacy place) | none | open; its stated reason inaccurate | CL-GEO-07, CL-HIS-14 |
| C-39 | SOURCE_NOTE's open questions as they stand (Russian infantry flags, the Grenz coats, the vines, the Russian Guard's attack, Bagration's line, the post, Krug and Bellowitz, Kologrivov's command, Blasowitz, the Zuran, Bernadotte's crossing, the chapel's guns, the drowned, the divisions' numbers, Gladkov, Uvarov, the disputed hours) | 105 (kept while the table does not settle them); 125 | kept open in the data, with exceptions | CL-SRC-03, CL-SRC-04 |
| C-40 | kienmayer@7's and lang@2's offsets from the corrected brook (each on its own evidence, 8J) | none (recorded, not acted on) | open; larger than recorded | CL-HIS-08 |
| C-41 | Caffarelli's anchors 2.5-2.9 km south of Bagration's from 14:30 (8K) | none (recorded) | open; the records' numbers high | CL-HIS-09 |
| C-42 | The woods' habits, turns and scrub drawn again where a wood changed (8J; presentation) | none | recorded | none |
| C-43 | Owner's note L1 (7 October 2026): the coloured glow under the troops | 239 (b) | done (8B): outlines; "Position confidence" off at first on the landscape | none (done) |
| C-44 | Owner's note L2: the counters dart about while the view moves | 240 (a); 257 (b); 262 (a); 267 (a) | done (8C), with residuals | CL-MAP-01, CL-MAP-17 |
| C-45 | Owner's note L3: depth and detail in the troops; movement that does not look like floating | 242 (a), 243 (a), 244 (a), 245 (a) | done (8E), with residuals | CL-VIS-03, CL-VIS-04; questions 280, 281 |
| C-46 | Owner's note L4: the ponds and water (the meres frozen) | 246 (a), 247 (a), 264 (a) | done (8F), with residuals | CL-VIS-01, CL-VIS-02, CL-VIS-05 |
| C-47 | Owner's note L5: buildings and structures | 248 (a), 259 (a), 261 (a), 266 (a) | done (8G, 8J), with residuals | CL-VIS-04, CL-VIS-06 |
| C-48 | Step 4 handed on: the claims' reach (statements without a claim) | 128 (b), 130, 187 | partly (481 of 704 unchecked) | CL-TEST-12 |
| C-49 | Step 4 handed on: the chronology's extractor reads only clock-shaped hours | none | open | CL-TEST-13 |
| C-50 | Step 4 and PR #57 handed on: readings not made (Duffy 1977 beyond pp. 184-185, Smith 1998, the Russian Biographical Dictionary 1903, Suchet's report and the French losses through Sokolov only, the Szekler page by a machine reader, decision 136's human second reading) | 136, 189, 211 (b), 213 (b) | open (Duffy's two pages read since, decision 213 (b)) | CL-SRC-01; question 271 |
| C-51 | Step 4 handed on: the records the reviews left (the guns above Augezd's further sources, TOUR[5].x, TOUR[6].x "With the plateau gone", Caffarelli's artillery, the Horse Guard eagle, the step-2 register's German key, the decision and guard-attack events' "The hour is disputed" without a dispute, Maliutin, the eye-level caption's attributions, the light notes) | 190; 210 (c) (Maliutin) | mostly open; one settled | CL-HIS-15 |
| C-52 | Step 5 handed on to a later data task: the Dress notes' internal words, CONF_TEXT.C's em dash, the armistice's own text, the Santon story's second sentence, the eye-level caption and light notes outside the claims | none (a later data task; none has taken them) | open | CL-UX-05 |
| C-53 | PR #57 handed on: the corps-versus-formations warning, the spellings outside decision 209's six, the overclaim scan's attribution pattern | 209 (a); 213 (b) | open, each confirmed in code | CL-HIS-16 |
| C-54 | Step 3 handed on: the screen-reader session recorded complete on the owner's word with no item results; the automated checks Chromium only | 175 | accepted by decision 175; no results exist | CL-REC-05 |
| C-55 | Decision 136's human second reading of the 15 A-graded appearance quotes, recorded complete on the owner's word (decision 189) with no item results | 136, 189 | accepted by decision 189; no results exist | CL-REC-05 |
| C-56 | Step 1 handed on: Safari believed to ignore the faces' metric overrides; no italic face embedded | 141 (a) | unchanged | none (unchanged) |
| C-57 | Step 6 Part A handed on: the probes' own limits (Chromium only, taps not fingers, software WebGL, screenshots at CSS scale) | none | unchanged for the suite | CL-UX-06 |

### C.2 What each area examined, by method

The per-area coverage tables (141 rows) are in the companion file `docs/FINAL_AUDIT_POST_STAGE8_LEDGERS.md`, section L.1.

### C.3 What was not checked, by area

- **a11y**: No screen reader or other assistive technology (NVDA, JAWS, VoiceOver, TalkBack, speech input, switch access) was available: names, roles and live regions were read from Chromium's tree, not heard; docs/step3-evidence/sr-session.md holds no item results. · No real mobile browser: the phone is desktop Chromium emulating an iPhone; Safari/WebKit's touch-action, pinch and VoiceOver behaviour unverified (A11Y-05). · Forced colours only in Chromium's emulation (its default light palette), not Windows contrast themes or Firefox. · Firefox and Safari not run; no GPU; every time here is SwiftShader on a container shared by other jobs (load average 18-37). · Text-only zoom (1.4.4 by text size alone) not emulated; page zoom stands in for it. · The opening's played stretches were cut short by 'Next again' (each would take many real minutes here); the self-test holds them. · Live-region announcements were read as DOM text, not heard; their timing and duplication by a screen reader unverified. · Cognitive load, plain-language reading level and colour-vision simulations were not measured beyond the words read here.
- **geography**: Page captures of the villages on marsh ground and of the southern plateau (reused visual-landscape's only where cited) · Knowledge readings, viewsheds, the fog's drawn extent and the going classes on surveyed ground (impact inferred from heights, not re-run) · 1805 channels, roads and pond outlines: the First Military Survey and the 1825 sketches of Jirikovice and of Kobylnice's brook not read; the Second Survey not re-read (8K's register relied on for 'Kruch') · Residual surface-model bias (GLO-90 and SRTM are surface models; the southern plateau is open fields today, so canopy cannot explain 45-80 m) · The Litava south of Telnitz and the meres beyond decision 27; Bellowitz's 1805 place · The paper map's drawing of streams and marsh; the near-ground detail over the marsh
- **history**: Truth of any historical claim against external sources (assigned to the two source-tracing agents); register quotations read only for C6.21 and C6.c6 · Anything as drawn in a browser: headings, block overlaps, labels and pills are computed from the model and presentation code, not observed (no browser in this phase) · Drawn width of the Litava ribbon and block frontages at the overlaps (centres compared only) · Whether the opening's 08:45 camera shows Legrand's walk-through · appearance.js claims beyond those the dossier strength/composition rows quote · The terrain-dependent tour stop 5 shares (held by terrain-test.js, not re-run here) · KNOW_OVERRIDE's knowledge readings over the day (only id/side coherence checked) · The sources sheet's full text (only searched for totals and the villages note)
- **interaction**: Real hardware and real-time behaviour: every run used the frame driver's 30 fps clock under SwiftShader; wall-clock figures here are not device timings. · The native context menu (headless shows none): the right-button path of state finding 7 is confirmed up to the seek and the unprevented contextmenu event; that the menu swallows the release is inferred. · State finding 5 (the reading cached at the first instant of a minute) in the browser: not re-tested (node-confirmed by the state area). · A drag during a phase glide on the desktop (s14's case ran with Follow already off); the phone's equivalent is confirmed. · Paper-map glides (MAPCAM.glideTo) interrupted by input. · Reduced motion during these sequences; Firefox and WebKit engines; screen readers; pinch during a glide; sessions longer than two rounds of cycles. · CSS-transition timing as a visitor sees it (transitions were finished as a set-up where needed: an environment workaround, recorded).
- **perf**: Any measurement on a device or in a browser (this phase has none). · GPU time on the phone: Safari offers no timer query. · Raw frame intervals behind any fps, percentile, max or long count: the route keeps summaries only, so they cannot be independently recomputed. · Temperature, throttling, background load, charging state and whether the wake lock was granted: not recorded by the route and not readable by a page. · What the owner observed during the runs (notifications, dimming): the owner's words were removed from the pasted reports. · Behavioural differences between Chrome 155 and 156, and the GPU driver version: not in the reports. · The culling-off frame of 2,188,177 triangles in section 22.5: no committed evidence file holds it. · Whether the phone's 23 ms Play frame is GPU-, compositor- or script-bound: no GPU timer, and js50 (7-8 ms) covers only part of it. · The clock windows of the phone route's and the brackets' played blocks: not recorded. · The device model ('iPhone 17 Pro') and iOS version: the owner's word; the user agent's OS token is frozen at 18_7. · The per-frame maximum draw calls and triangles on either device: not recorded.
- **perf-attribution**: 8D's build (ae7f16b8): 8D's and 8E's shares separated only by code reading · a build with the kit attributes removed or packed (the per-attribute cost not isolated) · the low views and Play at 4x (+0.9-1.0 ms on the desktop) · the phone · GPU-side time (SwiftShader, draws stubbed) · garbage collection per frame (freeRect's per-cell allocations not measured as GC) · which condition makes three r128 recompute getProgramCacheKey every frame · the desktop's Chrome 155 -> 156 effect on the device (here one browser for both builds)
- **records**: No browser run in this area: on-screen wording of the stale records was not rendered (the visual and accessibility areas did that). · 37 prior findings rest on the records alone (not re-read in code); their status follows the step sections of CHANGELOG.md. · Steps 1-3's hand-ons were followed only as far as later steps' lists carry them; each was not re-verified on its own. · C-05 (whether the Layers panel says anything about the effects on a phone), C-42 (the woods redrawn where a wood changed) and most of C-51 (step 4's review records) not re-examined. · The perf-attribution, robustness and sources-chronology areas had left no result.json when this was written; their items cite the perf area or nothing. · Pull-request states read from merge commits on origin/main, not from the GitHub API. · STAGE8_SPEC.md's sections other than 20.13-25.4 and 9.4 not audited for internal consistency.
- **sources-chronology**: Mikhailovsky-Danilevsky's 1844 Russian edition (only the 1846 French translation read; it says 'à huit heures' where the register reads 'въ 8-мъ часу') · Copyrighted modern works: Sokolov 2006 (Suchet's drain report, the 16:30 end, the 115 km march), Duffy 1977, Goetz 2005: inaccessible · Kutuzov's private relation (no. 252, p. 265) and Buxhowden's report's 'II Column at eight' not re-read; the Allied report's 'quiet from 15:00' (Materialien pp. 118-119) not re-read · Mikhailovsky-Danilevsky's 'last shots between five and six' and Thiébault's 'three hours' on the plateau not located on the text layers · The other Blasowitz attackers (Stutterheim p. 68, Thiébault p. 462, Sokolov p. 49, the Chevalier Guard's history, Marbot) not re-read · All quotations but three pages rest on the OCR text layer (the registers' own readings were on page images) · 9 of 25 events, 13 of 26 clocked phase lines and 18 of 25 timed anchors outside the ledger; check:chronology's 75 REVIEW rows not audited one by one · Geography of the castle, pheasantry, post house and highway (geography area) and forces (sources-oob area) · Gallica, HathiTrust, Google Books not tried (archive.org scans sufficed); no browser run
- **sources-oob**: Duffy 1977's pages: a lending item, so only its OCR text layer was searched. A person should read pp. 179-185 on the page before any data change. · Smith 1998 is not readable (as register S5.8 found). Some figures jointly attributed to 'Duffy and Smith' may be Smith's alone. · The 1805 Schematismus (Szekler hussars, grade A): Hungaricana answered 403; the browser-user-agent retry was refused by the permission classifier and not pursued. The record rests on one machine reading. · Teuber 1895 (the Austrian white coat): the Innsbruck digital library timed out. · Chandler 1966, Goetz, Castle, Bowden: in copyright, not tried. Also not fetched: WarHistory's 'about 12,000' (part II), Napoleon-Empire's 17,000, and the Tvarožná municipal history's 1,600 at the Santon. · 34 of 40 commanders (including first names), 10 of 14 composition fields, 170 of 174 dress claims, and 7 of 11 ORDNANCE claims. · The losses, and the 'twenty minutes' and drowning figures (outside the forces area). · How sensitive the derived readings are to the strengths questioned here: the holding on the heights, and tour stop 4's 39,000 and 19,000. Not recomputed. · Whether Schönhals's misprinted lines (Salzburg 6000, Kaiser 100, the Guards' Summa 4380) affected any data. Only noted as derivations.
- **state**: Nothing in a real browser in this phase (layout, focus, real pointer/key events, the context-menu case, what a visitor sees of the pop and the stale dossier) · The stubbed DOM answers querySelectorAll with nothing; DOM state not read · Real-time behaviour under slow frame rates · Phone resizing and orientation reviewed by reading only
- **tests**: The browser checks were not run by this area: check:contrast, check:selftest, check:visual, check:report and the start-up cases were read statically; the browser candidates (docs/audit-post8-evidence/tests/browser-candidates.json: the arrow cap's constant, the derived tag in the self-test, a hover colour's contrast, a lowered text token, figures unlisted, the presentation override and the dossier strength in the browser, the band removed from MLS, animEnv returning 0, the GLSL-only gait change, the timing budgets under load) are listed for a browser phase. The audit's runner passed check:contrast (6,926 text elements, 45 states, 8 of 8 start-up cases) and check:selftest (317 checks, 5,422 s). · The in-app self-test's 317 checks were not read one by one; a check weakened by logic under an unchanged name, with no literal moved, would not be found by the literal comparison. · Named constants the self-test reads from app.js were not traced through history. · Mutations of the test tooling itself (statements.js dropping a class, lang-scan.js skipping a file, run-all.sh's FAILS pattern) were not run. · Timing-sensitive checks were not exercised under controlled load. · CI runs before PR #70 were not inspected; the 27 most recent dispatched check:visual runs were listed (9 passed, 13 failed, 5 cancelled, most during development), not read. · Whether the owner intends the browser checks to be non-required (TS-1) was not asked; the facts are the ruleset's and the check runs'.
- **visibility**: Device timings: all runs are on software WebGL or the driver; the 60 fps driver run stands in for a 60 Hz display · The hover run (a still pointer on a moving formation during Play; runs.js hybrid-hover-0900) was not run: whether a visitor can keep a moving formation's counter by pointing at it during Play is unmeasured · Keyboard reach to hidden counters during Play and screen-reader announcements · The low Pratzen view, the eye level, the Overview and the opening's played stretches over long playback; 1x and 2x speeds; 1x and 10.33x relief; the 1280x720 and 1024-wide layouts · V-2's remedy (raising event-named formations) was not prototyped; its cost to other items is unknown · Geometric overlap of kept place names with starved formations' candidate places (only co-occurrence was counted) · The real-time run with the WebGL draw covers 09:00-09:17.6 only (machine load); no real-time run of the three-hour stretch · No video clip; stills are single frames
- **visual-landscape**: Device GPUs, Safari, the phone: software WebGL only; no frame time, colour or shimmer judgement on hardware · The visitor's page (no ?harness=1): drift and smoke motion and CSS transitions were off in every capture · Ground contact on dry ground not re-measured (8H's contact-8f.js not re-run); judged only visually at capture resolution · The ice glare share (43.5% at 15:00) not re-measured (ice-8h.js not re-run); the build's ice is unchanged since 8H · Play, dolly (level-of-detail switching) and orbit sequences: defined in sequence.js, not run (one glide only) · The eye-level views (eye-zuran), the paper map, the phone layouts and the label hierarchy (other areas) · The historical claims behind uniforms, standards and ordnance (appearance.js) not re-read; 6D's flag-ratio checks not re-run · Whether the bank scrub stands inside drawn stream ribbons elsewhere (one bush seen in the Satschan outflow, not counted) · Shadows' correctness at every clock beyond what the captures show
- **visual-maps**: Real devices (iPhone Safari, Android, tablets), real fingers and device GPUs: software WebGL and synthetic touch only · The visitor page's drift and smoke in motion beyond the three visitor captures; reduced motion · Other viewports: 1366x768, 1920x1080 and larger, 360 and 430 px phones, tablet portrait 768x1024, browser zoom · Play in motion (the visibility area measured it); orbit and zoom clips; the opening and the tour views (the a11y area) · The 39 harness cases themselves and check:visual (run separately by the audit) · The day-track inset, the sources sheet and the dossiers' text (other areas) · Screen readers and keyboard focus order (the a11y area) · Why each of the six counters is dropped at rest in the counters view beyond the priority order (the visibility area) · The eye level's blue marks under the Allied reading and at other clocks; the 1x and 10.33x factors' maps · Whether the plateau label's 13,300 includes Vandamme under the Allied reading (the function's lack of a reading test is read from the code; the composition was not computed)

## D. Test and experiment ledger

### D.1 The required checks on the audited build

Run here with `tools/audit-post8/run-checks.sh`, one check after another. Logs are in `docs/audit-post8-evidence/checks/`. All runs used the build
md5 `f10fe585...` and Chromium 141.0.7390.37 (CI's pin). `check:selftest` ran at `296f9d5`, an audit commit whose application files equal
`43e3e5b`'s. Every failure would have been kept. There was none.

| check | where, when | result | duration | log |
|---|---|---|---|---|
| `check:baseline` | here, 00:42 UTC 2 Nov, `43e3e5b` | pass: the fresh build is byte-identical, md5 `f10fe585...` | 0 s | `checks/baseline.txt` |
| `npm test` | here, 00:42-00:49 | pass: "ALL 9 SUITES PASSED (and the height guard)". `geo-test` 67 passed, `binding-test` 400 checks, 0 failed. Every warning acknowledged by `KNOWN_WARN` | 402 s | `checks/npm-test.txt`, `checks/suite-out/` |
| `check:data` | here, 00:49 | pass: "All 139 DATA declarations are byte-identical" to `archive/stage8k-f10fe585.html` | 1 s | `checks/check-data.txt` |
| `check:chronology` | here, 00:49 | pass, 0 errors. 70 timed moves: 66 consistent, 4 early, each one of the four named conflicts (bag@6, guard_cav@6, kamensky@3, kamensky@4). 155 timed statements: 118 cited by 73 of 75 REVIEW rows, 37 allowed by name. Movement audit: 0 findings | 3 s | `checks/check-chronology.txt` |
| `check:contrast` | here, 00:49-01:04 | pass: 6,926 text elements, 120 text/background pairs, 0 below AA, 0 under 10.5 px, 0 font failures. 45 states (10 as a phone), all reached, 0 console messages. Start-up cases 8 of 8 (`context-loss` 193 warnings against a ceiling of 248) | 925 s | `checks/check-contrast.txt` |
| `check:selftest` | here, 01:04-02:35, `296f9d5`, under a machine load near 37 from the page probes running beside it | pass: 317 PASS, 0 FAIL, held to the manifest's 317; "STAGE0: all checks passed" | 5,422 s | `checks/check-selftest.txt`, `checks/selftest-report.json` |
| `check:visual` | CI, run 41394859313 (workflow dispatch on `2f3cd78`, an audit commit whose application files equal `43e3e5b`'s), on a runner of its own as `README.md` asks | pass: the job's `npm run check:visual` step succeeded. The report (artifact `visual-report` 13123743106, zip SHA-256 `a184325a...6e55`) is of md5 `f10fe585...`, has 39 cases in test mode (not legacy), the self-test at 317 of 317 against the manifest's 317, 0 console messages judged, and 18 live blocks (slider, tips, motion, cull, play, dwell, keys3E, shortcuts, narrow, phone, toast, toastLayout, ring, rmLive, light, fog, farPlate, horizon) | 2 h 1 min (05:35:40-07:37:08 UTC) | the run's log; `checks/ci-visual-41394859313-report.json.gz` |
| `check:report` | here, 10:33 UTC, on CI run 41394859313's report | pass: "all checks pass for this report": 39 cases, each against its spec; the live blocks from their raw numbers; the self-test 317 of 317 by name; 0 console messages | 1 s | `checks/check-report.txt` |

CI's own runs on the audit branch (the push workflow: the checks job, `check:contrast`, `check:selftest`) passed on every audit commit. Each of
those commits changes only audit files (section D.2). Earlier CI evidence is cited as earlier evidence, never as a run of this audit. The last
`check:visual` before the audit was run 41259079904 on `d3f7026` (success). `git diff --stat d3f7026 43e3e5b` changes no code, tool or threshold.

**The audit branch changes no application file.** `git diff --stat 43e3e5b HEAD` lists only `docs/FINAL_AUDIT_POST_STAGE8.md`,
`docs/audit-post8-evidence/` and `tools/audit-post8/`. The build on the branch is still md5 `f10fe585...` (`npm run check:baseline` passes there).

### D.2 How the audit was run

The work was split into areas, each done by a sub-agent with a written brief: history, the forces sources, the timings and places sources,
geography, state, tests, robustness, the device evidence, CPU attribution, visibility, the landscape, the paper map, interaction, accessibility
and first use, and the records. Each sub-agent wrote its evidence, a README and a structured result to `docs/audit-post8-evidence/<area>/`.
The account's usage limit stopped most areas at about 01:30 UTC. Each interrupted area was finished from its saved evidence after the reset;
its README says what was redone. The auditor read every area's result, merged duplicates and assigned the identifiers in `register.json`. Each
S1 and S2 finding then went to a separate skeptic, and the rest in batches, to try to refute it (section B's introduction). The auditor
reproduced some findings personally. Those are named in the findings' "Auditor's note".

What no check here can show:
- **Timings.** SwiftShader is software rendering, so its times are not a device's.
- **A real phone.** Chromium's touch emulation does not have Safari's gestures, its toolbar, or its pinch on a page that sets `user-scalable`.
- **A screen reader.** Only the accessibility tree and focus order were read; no screen reader session was held.
- **The owner's machines.** None was available to the session.

### D.2a The thresholds' history

`docs/audit-post8-evidence/tests/thresholds-history.md` covers every non-merge commit that touched `tools/visual/thresholds.js` (68) or
`tools/visual/boot-check.js` (10). The history was read from a partial bare clone of `origin/main` (644 commits), because the working clone
is shallow. Each revision is compared with its parent, key by key.

**Totals.** 467 limits were added, 48 tightened, 36 loosened, 30 removed and 17 changed.

**Every loosening traces to a decision or brief.** Each one goes back to an owner decision or an owner brief recorded beside the value and in
`CHANGELOG.md` (62, 141 (a), 146, 164, 199 (b), 212 (b), 214, 232 (a), 256 (a), the 8J/8K briefs, the conditional authorisation for
`plans-overview`, 267 (a)). No limit was loosened silently.

Three points matter for this audit:
- The 8J and 8K re-baselines of `MOTION.VIS` were made by the implementer under a general rule in the owner's brief. Decision 267 (a) kept
  them. The largest raised Play's longest-hidden ceiling from 3,100 to 4,033 ms, which is the benchmark's whole window (`CL-TEST-02`).
- `JUMPS` 248 and `POPS` 998 are exactly the build's own counts. They are pins, not quality bars (`CL-TEST-14`).
- `CTX_DELETES` keeps 248 where the case has measured 193 since 8C (`CL-TEST-17`).

**The in-app self-test's own limits are unchanged.** All 253 literal comparisons present before Stage 8 are still present and unchanged.
None of the 131 checks with a literal name in both versions changed its condition.

### D.3 The areas' experiments

Every experiment the areas ran (105), with its command, environment, outcome, evidence and limitations, is in the companion file, section L.2.

### D.4 Negative controls: mutations of an isolated copy

Each mutation was applied to an isolated copy of the tree (rebuilt there), the node suites and `check:data` run on it, and the copy restored and rebuilt to md5 `f10fe585...` (every one restored: True). 'Caught by' names the checks that failed; 'semantically' means a check that reads the property, not only a change detector (an inventory, a hash, a data identity) that a data task resets. Totals: 33 mutations, 30 caught, 3 missed; caught semantically 19; missed by every check but `check:data` M16, M17, M27, M31; missed by everything M13, M29, M30.

| id | mutation | expected | outcome | caught by (mechanism) | semantically |
|---|---|---|---|---|---|
| M01 | a march rate over the ceiling: Saint-Hilaire's wheel (sthilaire@7) given 10 minutes instead of 60 | caught | caught | redteam (known-warning text), sim (semantic), audit (semantic), chron (semantic), data (data identity) | sim, audit, chron |
| M02 | a formation's parent changed (Saint-Hilaire's division under V Corps), the children lists left as they were | caught | caught | redteam (semantic), data (data identity) | redteam |
| M03 | a formation moved to another corps consistently (parent and both children lists), historically wrong | caught | caught | test (semantic), redteam (semantic), data (data identity) | test, redteam |
| M04 | a narrative statement with its own claim reworded without its hash (bourcier@3 act) | caught | caught | test (claim hash+inventory), data (data identity) | no |
| M05 | an unchecked narrative statement given a factual change (Saint-Hilaire's role: right-hand becomes left-hand assault division) | missed | caught | test (inventory), data (data identity) | no |
| M06 | a claim's reading id pointing to a reading of another source (bourcier@3 act rests on a Davout reading under Mikhailovsky's name) | caught | caught | test (semantic), data (data identity) | test |
| M07 | a claim's reading id pointing to another reading of the same source, on another matter (Kamensky's turn, not Davout at Telnitz) | missed | caught | test (semantic), data (data identity) | test |
| M08 | the "derived" tag removed from a formation's march row (the dossier's Marching / Next move reading) | caught | caught | runtime (semantic) | runtime |
| M09 | an event's time moved: the French wheel 13:00-14:00 becomes 13:20-14:20 | caught | caught | chron (semantic), data (data identity) | chron |
| M10 | a statement's own claim deleted (bourcier@3 act: attributed becomes unchecked) | caught | caught | test (inventory), data (data identity) | no |
| M11 | a banned superlative in a visitor string (LABELS.layers.shows: "What is drawn, the fiercest ground first") | caught | caught | redteam (semantic) | redteam |
| M12 | a colour literal outside the palette tables in presentation code (app.js legendHint) | caught | caught | css (semantic) | css |
| M13 | an interface colour typed into style.css outside the tokens (#sc-clear:hover color:#ff00aa) | missed | missed | nothing | no |
| M14 | a dashed line added to a non-route drawer: the boundaries drawn with dashRuns | caught | caught | binding (semantic), css (semantic) | binding, css |
| M15 | a formation's first positioned anchor without its grade (sthilaire@0 cf removed) | caught | caught | test (semantic), redteam (semantic), data (data identity) | test, redteam |
| M16 | a later anchor's position grade raised without evidence (sthilaire@8 B becomes A) | missed | caught | data (data identity) | no |
| M17 | a strength changed without its note (Saint-Hilaire 6,600 becomes 8,600; the note still says about 6,600) | missed | caught | data (data identity) | no |
| M18 | an anchor's position moved about 0.4 km (sthilaire@5 on the Pratzeberg, 13 map units south) | missed | caught | redteam (known-warning text), data (data identity) | no |
| M19 | a timed statement retimed: "c. 12:00 Napoleon moves forward from the Zuran" becomes c. 12:30 | caught | caught | test (inventory), chron (semantic), data (data identity) | chron |
| M20 | a timed statement reworded, its time kept: "the causeway comes under fire" becomes "under heavy fire" | caught | caught | test (inventory), chron (semantic), data (data identity) | chron |
| M21 | an explicit anchor time's quoted evidence altered (sthilaire@7: "Napoleon swung his centre" for "turned") | caught | caught | chron (semantic), data (data identity) | chron |
| M22 | a tour stop's quoted derived figure changed ("about 39,000" becomes "about 45,000") | caught | caught | test (claim hash+inventory), sim (semantic), chron (text hash), data (data identity) | sim |
| M23 | the plateau reading kept one phase longer (PLATEAU_LAST 6 becomes 7) | caught | caught | runtime (semantic) | runtime |
| M24 | a presentation site reads the model height: buildBoundary's label placed with height() instead of groundY() | caught | caught | height (semantic) | height |
| M25 | the model's march-rate ceiling for infantry loosened (SPEED_CEIL.inf 5.0 becomes 6.0) | caught | caught | redteam (known-warning text), data (data identity) | no |
| M26 | a disputed event's hour graded A (Kienmayer's attack on Telnitz) | caught | caught | test (semantic), data (data identity) | test |
| M27 | a village moved about 0.28 km (Kobelnitz, 9 map units east) | missed | caught | data (data identity) | no |
| M28 | an event naming only a formation that is not yet on the field (Kienmayer's attack on Telnitz at 07:00 names the guns on the heights, which arrive at 12:45) | caught | caught | redteam (semantic), data (data identity) | redteam |
| M29 | presentation code overrides a guarded datum at start-up (init() moves sthilaire@5 0.4 km), the data file unchanged | missed | missed | nothing | no |
| M30 | the formation dossier shows a strength 25% above the data's (dossierFormation's Approximate strength) | missed | missed | nothing | no |
| M31 | an overlay objective placed off the map in y (phase 0's Telnitz objective at y 608; the frame is 500 deep) | missed | caught | data (data identity) | no |
| M32 | a word-form hour retimed in an unchecked timing note (dok@1: "the departure at seven" becomes "at nine"; the anchor's dep stays 07:00) | caught | caught | test (inventory), data (data identity) | no |
| M33 | a claim's reading swapped for a page-image reading of the same source on another matter (bourcier@3 act: Davout at Telnitz becomes Bagration, p. 198) | caught | caught | test (inventory), data (data identity) | no |

## E. Historical and source verification ledger

This section says which of the map's claims were traced to what a source prints, and how. The full rows are in the companion file
(section L.3). Each area's method and its limits are in its README.

### E.1 What was checked, and against what

| ledger | rows | verified | partly | contradicted | not supported or not verified | inaccessible | method | evidence |
|---|---|---|---|---|---|---|---|---|
| forces: strengths, guns, commanders, the army totals (`data.js` notes, `SOURCE_NOTE`, the theme "weakness") | 42 | 14 | 17 | 7 | 2 | 2 | page images where the project's registers read them (Sokolov, Schönhals, the *Correspondance*); Duffy (1977) on archive.org's OCR text layer, by full-text search, because the lending item's page images could not be opened from this container | `sources-oob/ledger.md`, `ledger.json` |
| the reconstruction against itself: totals, names, grades, events' claims, sides of the stream, opposing formations' legs, the Russian Guard's approach, prior fixes | 26 | 10 | 4 | 12 | 0 | 0 | node probes over the data (`tools/audit-post8/history/`), the registers of readings | `history/README.md`, `result.json` |
| geography: the frame, relief, water, roads, settlements, landmarks, the garden, the crossings | 29 | 17 | 5 | 3 | 4 | 0 | open data (OpenStreetMap ways, Wikidata points, terrain models), the 1825-52 maps as 8H read them, the project's own transform | `geography/README.md`, `raw/` |
| timings, events and places | 20 | 14 | 5 | 1 | 0 | 0 | public-domain texts (Stutterheim 1807, the 30th Bulletin, memoirs), the registers of readings, the project's tracks and events | `sources-chronology/ledger.md`, `ledger.json` |

**Coverage, stated plainly.** Most of the map's statements were not traced to a source by this audit. The project's own sourcing stage did
that work (`narrative.js` and its inventory, `docs/step4-evidence/inventory.json`, current: of 704 statements, 148 carry a claim of their own (63 attributed, 65 disputed, 12 interpretation, 6 uncertain, 2 derived), 75 one by class, and 481 none; `docs/step4-evidence/readings.md`, 273
entries). This audit re-traced a sample, chosen for consequence: the force figures a visitor reads first, the hours that carry the battle's
argument, the places where 8J and 8K moved the map, and the claims the records call settled. A row that says "verified" means the source
prints what the map says. It does not mean the map's reading of the battle is the only defensible one.

### E.2 What the ledgers found

- **Forces.** Seven figures are contradicted by the source they cite. The largest group is attributed to Duffy (1977), who does not print them
  (`CL-SRC-01`). Friant's division "about 3,470 in Duffy and Smith": Duffy has 3,800 with 9 guns. The theme "weakness" says "some 4,300 men by
  Duffy's and Smith's count". The IV Column is "13,900 (Duffy 1977; Smith 1998)" while Duffy gives 23,900. One claim is not supported by any
  read source: Bourcier "about 830 sabres present". Seven formations show a working strength with no note, and six of them exceed the 22
  November returns the project reads elsewhere (`CL-SRC-05`). `SOURCE_NOTE` illustrates honest disagreement with an I Column range whose low
  end, 7,750, appears in no source read, only on a popular website (`CL-SRC-04`). "Kologrivov's command is in Sokolov alone" is contradicted by
  Schönhals p. 178 and by the project's own stage 6B reading (`CL-SRC-03`). The Duffy rows rest on his OCR text layer. The same search
  reproduces exactly the Guard rows the owner photographed (register entry S5.7), which supports the method, but a page-image reading
  remains the standard the project sets (`docs/step4-evidence/readings.md`) and is the remedy's first step.
- **The reconstruction against its own readings.** Twelve of 26 consistency claims fail:
  - events whose own texts dispute the hour are not labelled disputed (`CL-HIS-06`);
  - an event's pill says Fact beside its own text's "this map's reading" (`CL-HIS-01`);
  - Command rows say DOCUMENTED where the claims register says "Not yet checked" (`CL-HIS-12`);
  - the grades do not follow one rule (`CL-HIS-02`);
  - opposing formations' legs pass through one another (`CL-HIS-04`, `CL-HIS-10`), and legs cross the Litava (`CL-HIS-10`);
  - formations with an offensive status walk away from the enemy (`CL-HIS-05`);
  - the Russian Guard's plotted approach contradicts the register's A readings, and nobody holds Blasowitz when it falls (`CL-HIS-03`);
  - Caffarelli is not where the records say (`CL-HIS-09`);
  - the earlier fix G-3, Miloradovich at dawn, does not hold.

  Eleven of the earlier audit's history fixes hold (H-1, H-2, H-3, H-4, H-12, H-13, H-14, H-18, D-3, D-4, S-5).
- **Geography.** The frame is sound: one scale authority, a similarity transform of true geography, the 17-degree rotation from true north
  disclosed, the villages from the Czech municipality register, the 8J and 8K corrections where their sources put them. Three claims are
  contradicted:
  - the relief is not fitted to surveyed elevations where a visitor reads it most (`CL-GEO-01`);
  - Krug lies 1.67 km from where the 1836-52 survey puts it, while the visitor is told no source fixes it (`CL-GEO-07`);
  - three villages stand on marsh rather than on the village class (`CL-GEO-05`).

  Four claims cannot be verified from what is read: the Pratzen-Austerlitz road, the upper Goldbach and the brooks (`CL-GEO-03`), the bottom's
  marshiness (`CL-GEO-06`), and the castle's walls and the pheasantry's enclosure in 1805 (`CL-GEO-02`).
- **Timings and places.** Of the 20 most consequential timed or placed claims (the fog and the release, the climb, Dokhturov's descent, Telnitz at 07:00, Friant's march and arrival, Telnitz retaken at 09:30, Sokolnitz, Kamensky's turn and the face-about, the Pratzeberg at 11:00, Blasowitz, the Guard's eagle, Rapp's charge, Bagration by the Posoritz post house, the Satschan ice, the castle and the pheasantry, the end), 14 are verified on the sources' own text layers, quoted with their locators (for example Davout's report of 26 December, pp. 203-204, for Telnitz retaken at 09:30, the day's one A-graded event). Five hold in part: the climb's 08:45 is the map's choice inside the sources' range of about 08:00-09:00, while it is labelled Fact (`CL-HIS-06`); the castle is in the accounts but 'walled' and the pheasantry in none of the 1805-1806 texts read (`CL-GEO-02`). One is contradicted: the face-about's 'no account read gives the order', against Schonhals p. 162 (`CL-HIS-01`). A January 1806 letter by Buxhowden naming Langeron as having sent Kamensky back is missing from that named conflict's sides (`CL-SRC-09`). Coverage: 20 of the 155 timed statements and of the 180 positioned anchors, chosen for consequence; the rest are as the project's own sourcing stage left them.

### E.3 The unresolved historical questions

| question | where the records keep it | shown to a visitor? | this audit |
|---|---|---|---|
| the 1805 course of the highway, and the post house | `docs/STAGE8_SPEC.md` 21.8, 21.9 | the post house yes; the highway's course no (`CL-GEO-10`) | open |
| which channel carried the Goldbach north of the castle | 21.7, 21.9 | no (a code comment) (`CL-GEO-10`) | open |
| the castle's walls and the pheasantry's enclosure | 21.7, 21.9 | told as fact in the 08:00 dispatch (`CL-GEO-02`) | open; contradicted for the pheasantry in 1825 |
| the Goldbach bottom's marshiness | 21.9 | drawn and told as settled (`CL-GEO-06`) | open |
| the garden's planting | 21.7, 21.9 | yes: the rows a convention | open |
| Bagration's line at dawn and at 17:00 | 21.9 | yes (both sources) | open |
| which side of the road Schönhals's height lay | 21.9 | no; moot in the drawing | open |
| Krug's place | 21.9 | yes, with a reason the 1836-52 survey contradicts (`CL-GEO-07`) | the survey's place is available |
| Kologrivov's command | `SOURCE_NOTE` | yes, with a contradicted note (`CL-SRC-03`, `CL-HIS-14`) | two sources read give it |
| the retreat over the Satschan meres and the ice casualties | `SOURCE_NOTE`, `PHASES` | yes: shown as disputed (the 30th Bulletin's twenty thousand drowned against the much lower figures of later counts) | verified as labelled (sources-chronology L18) |

### E.9 The ledgers in full

Every row of every area's verification ledger is in the companion file, section L.3.

## F. Quality assessment

Each assessment rests on the findings and measurements cited. **Strong** means it holds under adversarial checking with only polish left.
**Sound, with gaps** means the method is right and most of it holds, but named findings break it on paths a visitor uses. **Needs work**
means it fails its own stated standard on a primary path. A passing check is not counted as quality where the check cannot see the
failure (section B, `CL-TEST-*`).

| dimension (`CLAUDE.md` priority) | assessment | what holds (evidence) | what does not (findings) |
|---|---|---|---|
| 1 historical integrity | **sound, with gaps** | Every statement has a claim or is honestly "unchecked". There are 273 register entries, the disputed hours are kept as named conflicts, and `narrative.js` tags claims on screen. Eleven of the prior audit's history fixes hold. The 8J and 8K re-plots sit where their sources put them | The apparatus contradicts itself or the sources in consequential places. The face-about's pill (`CL-HIS-01`). Four events whose disputed hours are unlabelled (`CL-HIS-06`). DOCUMENTED beside "Not yet checked" (`CL-HIS-12`). 44 A grades carried without a reading (`CL-HIS-02`). The Russian Guard's divided register drawn as one side (`CL-HIS-03`). Formations walking away while "attacking" (`CL-HIS-05`). A Stage 8 re-plot that puts Legrand through the III Column (`CL-HIS-04`) |
| 2 data integrity | **sound, with gaps** | `check:data`: 139 of 139 declarations byte-identical to the reference. Data and presentation are separated as the rules ask. Every change since the last audit is recorded | Figures attributed to Duffy that Duffy does not print (`CL-SRC-01`, P1). Bare working strengths (`CL-SRC-05`). The guards are change detectors that a data task resets, and a run-time override passes every check (`CL-TEST-03`, `CL-TEST-05`) |
| 3 geographic integrity | **sound, with gaps** | One scale authority. A similarity transform of true geography. The rotation disclosed. Villages from the Czech register within 20 m. The 8J and 8K corrections verified against their sources | The relief is 30-80 m off over the ground the battle turns on, while the visitor is told it is fitted (`CL-GEO-01`, P1). The hydrography is schematic outside Sokolnitz (`CL-GEO-03`). Marsh is drawn over three villages (`CL-GEO-05`). Open questions are told as settled (`CL-GEO-02`, `CL-GEO-06`) |
| 4 simulation integrity | **strong in the model, weaker in its presentation** | Positions are continuous at every critical time (766 checks, a 215,072-sample sweep), deterministic and clamped. Play, the dwell, speed changes and pauses behave exactly. There is no duplicate listener or leaked timer. Seeks by four paths give identical states | What the panels and overlays say lags or leaks the model. The open dossier is stale within a phase (`CL-SIM-01`). "Whose eyes?" draws arrows of unknown formations (`CL-SIM-02`). Themes don't stop Play (`CL-SIM-03`). The fade flashes skipped arrows (`CL-SIM-04`) |
| 5 software correctness | **sound, with gaps** | Every required check passes on the audited build. The start-up guard holds in all 8 failure cases. Prolonged use grows nothing after each mode's first construction | A reachable script injection in a published tools page (`CL-ROB-01`, S1). A glide undoes the visitor's pan (`CL-UX-02`). A context loss while playing can throw (`CL-ROB-02`). The input edge cases (`CL-UX-13`, `-19`) |
| 6 visual quality | **strong, with defects** | Computed light and atmosphere through the day, a restrained December palette, villages on their 1825 plan, troops identifiable by side and nation, convincing artillery close up. 100 captures had no warning or error | Figures sunk into the frozen mere (`CL-VIS-01`). Trees on the ice (`CL-VIS-02`). Blocks interpenetrating buildings and one another (`CL-VIS-04`). Facings along slow drifts (`CL-VIS-03`) |
| 6 cartographic usability | **needs work** | The default Landscape keeps 83-89% of formations labelled during Play with short gaps. The paper map is north-up and to scale. The far names' plate holds AA | In Landscape with counters, five to eight formations go unlabelled for most of Play (`CL-MAP-01`). No key below 1080 px (`CL-MAP-03`). No north indicator outside wide desktop Study (`CL-MAP-04`). The paper map as entered names no place (`CL-MAP-05`). The caption loses its act and phase (`CL-MAP-06`) |
| 6 interaction, accessibility and first use | **sound, with gaps** | Every control is named and keyboard-reachable. The sheets and card are real modal dialogs. The single-key switch meets 2.1.4. Desktop targets are 24 px and phone targets 44 px. 200% zoom is fully usable. Contrast is AA throughout (6,926 elements). The opening ends in its documented state from every exit | The interface does not reflow at 320 px and 400% (`CL-UX-01`). Caveats live only in tooltips (`CL-UX-08`). Forced colours lose state (`CL-UX-09`). Panels opened by keyboard don't take focus (`CL-UX-10`). The phone's rail is mostly event markers (`CL-UX-03`). The first screen does not say it is a reconstruction (`CL-UX-11`). No screen-reader session has results (`CL-REC-05`) |
| 7 performance | **acceptable on the measured hardware, thinly evidenced** | On the desktop (RTX 4070): the frame budget holds, Play is at 120-124 fps against step 6's 139-140, and the CPU excess was accepted by decision 268 (a). On the phone (iPhone 17 Pro): the budget holds, Overview 40.8 and Play 43.35 fps (24 A blocks each), long frames 18.15% and 8.6%, accepted by 269 (a). All 349 rows recompute from their JSON | The long-frame share is not a dropped-frame measure: 28-32% of 60 Hz refreshes bring no new frame (`CL-PERF-03`). No integrated-GPU run (`CL-PERF-02`). The desktop comparison spans a Chrome update (`CL-PERF-04`). "After the phone warms" has no temperature evidence behind it (`CL-PERF-01`). P5 points to a Stage 8 slowdown on the phone that no like-for-like run has tested (`CL-PERF-06`) |
| 8 tests and evidence | **extensive, partly blind** | Nine suites, 317 self-test checks, 39 visual cases and 18 live blocks pass, and every warning is acknowledged by its text. Of 33 mutations, 30 are caught | Three mutations are caught by nothing and 11 only by change detectors (D.4). The browser checks gate no merge (`CL-TEST-01`). The motion ceilings are the build's own counts and cannot see a gap longer than their window (`CL-TEST-02`, `CL-TEST-14`). Some bounds come from the code under test (`CL-TEST-09`) |
| robustness, security, maintainability | **sound, with one exposure** | three.js r128's SRI matches npm and cdnjs byte for byte. The 8 start-up cases pass. No growth in prolonged use. No reachable advisory for three r128 | `CL-ROB-01` (S1). The archived builds lack SRI (`CL-ROB-06`). No licence (`CL-ROB-08`). The documents an agent must read are larger than a context (`CL-ROB-03`). Tools that CI never runs are rotting (`CL-ROB-07`) |
| records | **sound, with recurring drift** | The decisions are recorded with dates and words. The carried register is complete enough to answer every item (57 items, C.4) | The README misstates the checks again (`CL-REC-02`, the prior audit's R-1). Merged PRs are recorded as drafts (`CL-REC-03`, R-2 again). `CLAUDE.md`'s current state lags (`CL-REC-08`) |

**Overall.** In its method the map is a historically serious reconstruction. It labels its claims, keeps disagreements and grades its
positions. It is geographically coherent in its frame, and robust in operation. It is not yet historically defensible in every figure and
grade it shows, nor geographically exact in its relief. It is not yet usable as a map below desktop widths or under assistive settings. The
owner's acceptances (decisions 239-269) are honoured and verified as implemented. They are not, and were never claimed to be, proof that
every path is good. Section A gives the verdict this supports.

### F.1 The device evidence, reconciled

The perf area regenerated all ten Stage 8 device reports from their JSON with the route's own `format()`, and checked all 349 rows and
every numeric claim of `docs/STAGE8_SPEC.md` sections 24-25. Evidence: `docs/audit-post8-evidence/perf/` (`reconcile.md`, `rows.csv`,
`ledger.json`; 53 record claims, 43 verified, 10 partly, none contradicted). The verifier re-derived the medians (`CL-PERF-*`).

- **The build.** Every report names 2,810,630 bytes and SHA-256 `bf27887c...db07`, the audited build.
- **Desktop Play** (RTX 4070, Chrome 156, 144 Hz).
  - D1: 124.3 fps at 4x, 120.8 at half speed. D2: 123.0 and 120.2. Step 6's L3 run: 139.0 and 139.7. That is 10.6-14.0% slower.
  - Like for like: the route's code, the clock window, the GPU, screen, density and wrapper.
  - Not like for like: the browser (L3 ran on Chrome 155, unrecorded in section 24) and the build (L3's is step 6 item 3 Part B's, not
    Stage 8's starting build).
  - The CPU-attribution area reproduced the rise on one fixed browser at the device's ratio and located it between L3 and 8E (`CL-PERF-12`).
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

## G. Prioritized roadmap

### G.1 How the packages are ordered

The order follows `CLAUDE.md`'s priorities, adjusted for cost:
1. A reachable security exposure first.
2. Then what a visitor is told that the sources do not support, because historical integrity outranks everything below it.
3. Then correctness on common paths.
4. Then legibility, accessibility and the picture.
5. Then tests and records alongside each package, so each fix is held by a check.

Three rules carry over from the project:
- A data task changes only data, cites its evidence and moves `check:data`'s reference. Its geographic consequences re-measure the motion
  baselines under the owner's rule for geographic baselines.
- No package fixes a data problem by changing only the display.
- No package loosens an accepted threshold. Where a package needs a decided value changed, it names the owner question (section I).

Effort is a range for one competent session, including its re-measurement. A package can be split into pull requests along its findings.

### G.2 The packages

| package | what it does | findings | effort | depends on | done when |
|---|---|---|---|---|---|
| **WP-00** close the public script injection | `tools/step6/perf-run.html` accepts `?src=` only as a same-origin http(s) path (else the default, said in `#msg`), or Pages publishes only the product through an explicit artifact. Also decide whether the archived builds and the tools pages belong on the public origin | `CL-ROB-01` (S1), `CL-ROB-06` | 1-3 h for the check; half a day for a Pages artifact | question 270 (what Pages publishes) | the local reproduction (`tools/audit-post8/robustness/perfrun-src.js`) no longer runs script; the device route still works with its default and same-origin paths |
| **WP-01** claims and words a visitor is told | a guarded data task with no positions moved. The face-about and four other events get their disputed labels with both sides. The Command tab's DOCUMENTED aligns with the claims register. The castle's walls, the pheasantry's enclosure and the bottom's marshiness are told as the open questions the records keep. The sources sheet's relief sentence, the church claim and the carried questions are set right. Kologrivov's note is corrected | `CL-HIS-01`, `-06`, `-12`, `-14`, `-15`, `CL-GEO-02`, `-06`, `-08`, `-09`, `-10`, `CL-SRC-03`, `-09` | 1-2 days | none (the readings exist) | `check:data` lists every changed declaration; the claims' hashes and the inventory are current; the 09:15 views' drop limits are re-measured; `redteam.js` passes |
| **WP-02** the force figures traced to what the sources print | first the page-image reading of Duffy (1977)'s order-of-battle rows (the owner photographed pp. 184-185 for S5.7; the rest is needed), then the data task: each figure attributed to a source that prints it, or labelled a derivation; the bare working strengths noted; the headline strengths tagged | `CL-SRC-01` (P1), `-02`, `-04`, `-05`, `-06`, `-07`, `-08` | 1 day of reading (owner's photographs) plus 1-2 days | question 271 (the Duffy pages) | every strength note names a source that prints its figure, on a page-image reading; the force ledger (`sources-oob/ledger.md`) re-run has no "contradicted" row |
| **WP-03** tracks, grades and the reconstruction's internal consistency | a data task with geographic consequences. The 44 carried A grades are reviewed one by one (an anchor without a reading of its own takes B or C, as 8K did for Suchet). The Russian Guard's approach keeps its divided register visible. Legrand's leg is routed clear of the castle and the III Column. Retreat legs no longer start while an offensive status shows. Kienmayer, Kamensky, Caffarelli, Sokolnitz's occupation and Miloradovich at dawn (G-3) are reconciled with their acts | `CL-HIS-02`, `-03`, `-04`, `-05`, `-07`, `-08`, `-09`, `-10`, `-11`, `-13`, `CL-REC-06`, and the two accepted items `CL-HIS-16`, `-17` (kept, recorded) | 3-6 days | question 272 (the grading rule); the owner's rule for geographic baselines | the history probes (`tools/audit-post8/history/`) find no opposing legs within 0.5 km outside a recorded melee and no offensive status on a retreating leg; the motion baselines re-measured under the owner's rule; `check:chronology` unchanged |
| **WP-04** the relief model and the ground | first a disclosure (P1, hours): the sources sheet stops saying the relief is fitted to surveyed elevations where it is not. Then the refit against open terrain data (P2), the hydrography's schematic parts labelled or traced, the marsh no longer over the villages, and Krug at the 1836-52 survey's place or labelled | `CL-GEO-01` (P1), `-03`, `-04`, `-05`, `-07` | hours for the disclosure; 3-5 days for the refit and its re-measurement | question 273 (refit or disclose) | the elevation residuals (`geography/dem*.json`) within a stated tolerance on the plateau, the knoll and Slapanice, or the disclosure in place; every geographic baseline re-measured under the owner's rule |
| **WP-05** what the panels say while the clock moves | the open dossier's clock-dependent rows repainted as the clock moves. "Whose eyes?" withholds the arrows, arrow labels and the card's "Doing now" for what the reading does not know, and a phone keeps a sign of the reading. Themes stop Play. The overlays' fade carries its reached opacity and the Movement layer's factor. The reading is computed at the minute's start. The first Play frame, the dwell's caption and the event jumps' margin are fixed | `CL-SIM-01`, `-02`, `-03`, `-04`, `-05`, `-06`, `-07`, `-08`, `CL-UX-07`, `CL-UX-14` | 2-4 days | none | runtime tests open a dossier and move the clock within a phase; the state area's C1-C4 and the interaction scenarios re-run clean; decision 251 (a)'s reach holds for overlays and cards |
| **WP-06** the camera and the timeline under real input | a pan, zoom or key move ends a running glide. The event markers no longer take presses meant for the rail (on a phone above all). The timeline's tooltip leaves the control row free. The rail's drag ends on `pointercancel` and needs a button. A sheet opened mid-drag ends the drag. Focus is handed on when a resize hides the focused control | `CL-UX-02`, `-03`, `-04`, `-13`, `-19`, `-20` | 1-2 days | none | the interaction scenarios (s1-s14) re-run with real input show no undone pan and a drag scrubbing everywhere on the rail; the phone checks still pass |
| **WP-07** the map layer in motion | the formations an event names, and the starved divisions and cavalry, keep their counters during Play. A held item that a fresh layout would place ahead of a kept lower-priority one takes its room. The benchmark gains a long-gap measure that does not saturate at its window | `CL-MAP-01`, `-02`, `-07`, `-12`, `-14`, `-17`, `CL-TEST-02`, `CL-TEST-14` | 2-4 days, with re-measurement | question 274 (decision 240 (a)'s order and the `MOTION.VIS` baselines) | the long-play runs (`tools/audit-post8/visibility/`): no formation under 50% over 08:30-11:30 and gaps bounded in clock minutes; the 16 motions within their ceilings or re-baselined by the owner's decision |
| **WP-08** map furniture and legibility | a symbol key and a north indicator everywhere a visitor reads the map (below 1080 px, on phones, in short windows). The paper map as entered draws reference names. The caption keeps its act and phase. The legend lists what it draws. Arrow labels, the selection, the Plans view and the event glyphs are told apart. The low views' wall of names, the Littawa and the paper map's arrows are reconsidered where decisions left them open | `CL-MAP-03`, `-04`, `-05`, `-06`, `-08`, `-09`, `-10`, `-11`, `-13`, `-15`, `-16`, `-18`, `-19`, `-20` | 3-5 days | question 275 (the paper map's lettering against decisions 24 and 39) where limits move | `check:visual`'s phone and layout cases show a key and north in every reading state; drop limits re-measured where the owner decides |
| **WP-09** accessibility and first use | the interface reflows at 320 px and 400% (the map itself exempt under WCAG 1.4.10). Caveats reach readers who cannot hover. Forced colours keep state. Panels opened from the keyboard take focus. Internal project references leave visitor text. Names and structure are fixed. The first screen says the map is a reconstruction and what A/B/C mean (an owner decision on the card's words). A screen-reader session is held on the current build | `CL-UX-01`, `-05`, `-06`, `-08`, `-09`, `-10`, `-11`, `-12`, `-15`, `-16`, `-17`, `-18`, `CL-REC-05` | 3-6 days, plus a screen-reader session | question 276 (the first-run card's words) | an AT session's results recorded item by item; `check:contrast` extended to 320 px and forced colours |
| **WP-10** the rendered picture | figures on the frozen mere stand on the ice, and trees and bushes leave it. Blocks face the enemy rather than a slow drift and stop interpenetrating buildings and one another. Streams under a low sun, the headquarters camp, the omitted chapels' misreading and the crowns' near facets are addressed | `CL-VIS-01`, `-02`, `-03`, `-04`, `-05`, `-06`, `-07`, `-08`, `-09` | 2-4 days | none | the landscape captures (`tools/audit-post8/visual-landscape/`) re-shot; the self-test's contact and ice checks extended to the mere's figures |
| **WP-11** tests and CI that can fail | the browser checks become required (the owner's ruleset). Properties replace change detectors where a data task resets them: strengths against their notes, grades against their readings, proximity, rivers, the dossier's strength. Bounds stop coming from the code under test. Style colours, word-form hours and the inventory's completeness get checks. The gait's shader is compared with its mirror. The rotting tools are pruned or run | `CL-TEST-01`, `-03` to `-13`, `-15` to `-20`, `CL-ROB-07` | 3-6 days | question 277 (required checks) | the 33 mutations re-run: the 3 missed by everything (M13, M29, M30) and the 11 caught only by change detectors are caught by a property check |
| **WP-12** the device evidence | the records' readings corrected: no "after the phone warms" without evidence, the browser update named, medians called medians, the long-frame share defined beside a refresh-based measure. The owner's runs where hardware allows: an integrated GPU, a like-for-like phone run of the ordinary route, raw intervals kept | `CL-PERF-01` to `-11` | 1 day of records; device runs at the owner's convenience | question 278 (the device runs) | sections 24-25 corrected; an integrated-GPU report and a phone ordinary-route report filed, or their absence recorded as a limit |
| **WP-13** the records | the README describes the checks as they are and says the file needs cdnjs. Merged PRs are recorded as merged. `CLAUDE.md`'s current state and counts are current. The carried checklist is restated. A licence is chosen. The documents an agent must read are split so they fit a context. The self-test's shipping reconsidered | `CL-REC-01`, `-02`, `-03`, `-04`, `-08`, `CL-ROB-03`, `-08`, `-09` | 1-2 days | question 279 (a licence) | `records/doc-consistency.md`'s list re-run is empty |
| **WP-14** robustness residuals | the context loss while playing stops throwing; the restore's retained heap and listeners are bounded; the frame loop stops requesting frames at the display's rate while idle (if measured worthwhile); the dead code and `esc()`'s quotes are fixed; the offline dependence is stated | `CL-ROB-02`, `-04`, `-05`, `-10`, `-11`, `-12` | 1-2 days | none | the context cycles (`robustness/ctx-cycles.json`) re-run without an uncaught error and with flat retained memory |

**The sequence.**
- **Now:** WP-00 (hours), WP-04's disclosure (hours), WP-13 (a day).
- **Then:** WP-01 and WP-02 (the integrity of what is told), WP-05 and WP-06 (correctness on common paths).
- **Then:** WP-03 and WP-04's refit, the large data tasks, with their re-measurement.
- **Then:** WP-07 to WP-10 (legibility, accessibility, the picture), WP-11 alongside every package, WP-12 when the owner's hardware is free.

Before calling the map finished: WP-00, WP-01, WP-02, WP-04's disclosure, WP-05's dossier and readings, and WP-06's camera and rail. This
list contains every P1 finding (`CL-ROB-01`, `CL-SRC-01`, `CL-GEO-01`).

### G.3 Each package's findings

Each package's findings with their severity, priority, kind and effort are tabled in the companion file, section L.4; the register's CSV (`register-export.csv`) carries each finding's package.

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

## I. Owner decisions

These are the questions the audit cannot settle, because the answer is the owner's: what the site publishes, which sources to read, which
rules to apply, which accepted trade-offs to revisit. They are numbered from 270 so they do not collide with the project's decisions (the
last is 269). Each gives the evidence, the options and a recommendation. Decisions 267 (a), 268 (a) and 269 (a) are not reopened.
Questions 274 and 278 concern what those decisions left open, not their acceptance.

**Question 270: what GitHub Pages publishes** (`CL-ROB-01`, `CL-ROB-06`). The device route's page on the public site runs any URL passed in
`?src=`, `javascript:` included, in the site's origin (reproduced on a local copy only). Seven archived builds on the same origin load
three.js without SRI.
- (a) Pages publishes only the product, through an explicit artifact. The device route is then served from somewhere the owner chooses.
- (b) The tools stay on Pages. `?src=` accepts only same-origin http(s) paths, and the archived builds are dropped from the published
  artifact or given the integrity attribute.
- (c) As now.

*Recommended: (b) at once (hours), because it keeps decision 217's device route working; consider (a) later.*

**Question 271: Duffy's order-of-battle pages** (`CL-SRC-01`, P1). Six figures the map attributes to Duffy (1977) are not what his text
layer prints. In each case he prints a different figure in the same row. The project's standard for a fact is a page-image reading, and the
owner photographed pp. 184-185 before (register S5.7).
- (a) The owner photographs Duffy's remaining order-of-battle pages, then a data task attributes each figure to what the page prints.
- (b) The attributions are withdrawn now and the figures labelled this map's reading until the pages are read.
- (c) As now.

*Recommended: (a), with (b) for any figure the pages do not settle.*

**Question 272: the grading rule for anchors without a reading of their own** (`CL-HIS-02`). 44 of 88 A grades are carried from an earlier
anchor. A visitor reads "Position documented in the sources" where nothing in the data places the formation. 8K regraded Suchet's
pursuit by "B if a reading places it, C if none" but scoped that rule to its own anchors.
- (a) 8K's rule for every anchor, applied by a data task reviewing the 44.
- (b) Keep the carried grades, and make the grade's text say when it is carried from an earlier anchor. This tells the truth about the
  data's own convention, not a display fix to a data problem.
- (c) As now.

*Recommended: (a).*

**Question 273: the relief model** (`CL-GEO-01`, P1). The model is 30-80 m below open elevation data over the southern Pratzen plateau and
the chapel knoll, and about 45 m above it at Slapanice. Part of that is an unfitted bump. The sources sheet tells the visitor the heights
follow a scale "fitted to surveyed elevations".
- (a) Correct the disclosure now, and refit the model as a data task with every geographic baseline re-measured.
- (b) The disclosure only.
- (c) The refit only.

*Recommended: (a).*

**Question 274: the map layer's order during Play** (`CL-MAP-01`, `CL-MAP-02`, `CL-TEST-02`). Decision 267 (a) accepted the benchmark's
totals and its 4,033 ms. This audit shows the 4,033 ms is the benchmark's whole window. Over the morning at half speed, in Landscape with
counters, five to eight formations are labelled less than half the time, Miloradovich's counter is hidden for 28 s at a stretch, and the
formations a live event names are among the hidden.
- (a) Let event-named formations and a fresh layout's higher-priority items take room from held places during Play, add a long-gap measure
  to the benchmark, and re-baseline `MOTION.VIS` on the owner's word.
- (b) Protect only the event-named formations, extending decision 39's never-dropped list.
- (c) Keep decision 240 (a)'s order, recording the measured gaps as accepted.

*Recommended: (a).*

**Question 275: the paper map's lettering as entered** (`CL-MAP-05`). As entered at 1600, 1280 and 1024 px the paper map draws none of its
12 place names. This is within decisions 24 and 39 and their limits. The names appear on zoom.
- (a) Reserve room for the places the narrative names (Sokolnitz, Telnitz, Pratzen, Blasowitz and others), re-measuring the drop limits.
- (b) As decided.

*Recommended: (a), measured; it is an optional improvement, not a defect.*

**Question 276: the first-run card's words** (`CL-UX-11`). Neither the card nor the opening says the map is a reconstruction, or what the
A/B/C letters beside names mean; the key starts closed. Decisions 113-118 set the card's words.
- (a) One sentence on the card ("a reconstruction from the sources, its certainty graded A to C") and the key's grade rows reachable from
  it.
- (b) The same sentence in the opening's first step only.
- (c) As decided.

*Recommended: (a).*

**Question 277: which checks gate a merge** (`CL-TEST-01`). The ruleset requires only the node job. The browser checks
(`check:contrast`, `check:selftest`) run on every push but gate nothing, `check:visual` runs only on dispatch, and Pages deploys `main`
without waiting for any check.
- (a) Require the two browser jobs for merges into `main` (20-45 minutes each), and gate Pages on them.
- (b) As now.

*Recommended: (a).*

**Question 278: the device runs the records lack** (`CL-PERF-02`, `CL-PERF-06`). No integrated-GPU desktop run exists, though decision 138
and section 8.3 name that machine. The phone has no ordinary-route run of this build, so the only like-for-like reading of Stage 8 on it is
P5 (Stage 8's own starting build). P5 points to Play falling from 53 to 43 fps. Decisions 268 (a) and 269 (a) stand either way.
- (a) At the owner's convenience: one integrated-GPU run, and one phone ordinary-route run of this build.
- (b) Record their absence as a limit of the acceptance.

*Recommended: (a); until then (b).*

**Question 279: a licence** (`CL-ROB-08`). The repository has no licence, so by default nothing in it may be reused. The embedded fonts carry
their own licences, as they require.
- (a) The owner names a licence for the code, and one for the data and texts.
- (b) No licence, stated in the README.

*Recommended: (a); the choice of licence is the owner's.*

**Question 280: uniform facings** (decision 245 (a), carried). The owner asked to reconsider facings once the troops could be judged. They
now can be: at the default distances a man is under 17.6 px and facings would not show, and in the closest views the French infantry is
plain blue without white lapels.
- (a) Keep 245 (a): no facings.
- (b) Facings on the rich kit only, from the appearance table's sourced values.

*Recommended: (a), on the evidence that they would not read where visitors look.*

**Question 281: the artillery's drivers and moving gunners** (decision 243 (a), carried). A driver sits on each team of the guns on the heights
only, an inference from IV Corps' letter. The limbered battery has no gunners, though Gassendi has them march beside it. At 14:10 the
battery overlaps an infantry block and a headquarters camp, so the absence is not noticeable.
- (a) Keep as built.
- (b) Draw marching gunners beside the limbered battery.

*Recommended: (a).*

**Question 282: the Austerlitz garden and the omitted landmarks** (8J; `BUILDINGS.notDrawn`; `CL-VIS-06`).
- The garden reads as a few scattered trees, not discernible at the Overview.
- St Anthony's chapel is a name on the ground only, and the Santon's chapel and the Sokolnitz granary are absent. This invites a
  misreading: Bosenitz's church appears to crown the Santon.

Options:
- (a) A small symbol for St Anthony's chapel and the Santon's chapel, labelled as approximate.
- (b) As built, with the omission said in the sources sheet.

*Recommended: (a) for the chapels, (b) for the garden.*

**Question 283: the self-test shipped to every visitor** (decision 140; `CL-ROB-09`). Decision 140 kept the in-app self-test in the product
when it was 12.8% of the file. It is now 21.7% (611,017 bytes, 277,502 more in Stage 8).
- (a) Keep it shipped (the single-file principle; the harness and CI need it).
- (b) Build a visitor file without it and a test file with it, both single files, the visitor file the one published.

*Recommended: (a) unless the transfer size matters to the owner's visitors; (b) is a build change with its own checks to adapt.*

## J. Summary

- **Verdict.** A serious, well-sourced reconstruction whose method holds up. It is not yet finished by its own standard:
  - One critical web exposure: the published tools page `perf-run.html` runs any URL passed in its `?src=` parameter in the site's origin. A
    fix of hours.
  - A handful of consequential integrity failures in what a visitor is told: misattributed force figures, an event labelled Fact against its
    own text and the sources, disputed hours and carried grades unlabelled, a relief model told as fitted when it is 30-80 m off.
  - Real presentation defects on common paths: a stale dossier, "Whose eyes?" leaking, the glide undoing a pan, the phone's rail, counters
    hidden for long stretches of Play.
- **The build and the checks.** One build everywhere (md5 `f10fe585...`). Every required check passes on it: here, and `check:visual` on
  CI's runner in this audit.
- **The register.** 146 findings (S1 1, S2 15, S3 71, S4 59), each verified adversarially (confirmed 114, weakened 29, not re-verified 3).
- **Most findings are older than Stage 8:** 108 inherited, 16 new, 3 mixed.
- **Before calling it finished:** WP-00, WP-01, WP-02, WP-04's disclosure, WP-05 and WP-06, about 6-11 working days. They contain every P1
  (`CL-ROB-01`, `CL-GEO-01`, `CL-SRC-01`).
- **Owner questions 270-283** decide what the audit cannot: what Pages publishes, Duffy's pages, the grading rule, the relief, the map layer's
  order, the paper map's lettering, the first-run card, the merge gate, the device runs, a licence, facings, the artillery's crews, the
  chapels and the garden, and the shipped self-test.
- **Limits.** No device timing here. An emulated phone, not Safari. No screen reader. A sampled source check.
