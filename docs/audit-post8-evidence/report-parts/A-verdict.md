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
- *Stage 8.* Its work (8A-8L) is implemented as the owner decided. Of this audit's {{N}} findings, {{NEW}} are new in Stage 8 or later,
  {{MIXED}} mixed and {{INHERITED}} inherited from before it.

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
  Chrome update. Its +30% GL calls are three.js re-binding the kit's three Stage 8 attributes on every instanced draw. That re-binding is
  13-21% of the script rise and Stage 8's own per-frame work 20-32%; about a third is unattributed (`CL-PERF-12`).
- *The phone* (269 (a)). Its "after the phone warms" has no temperature evidence behind it (`CL-PERF-01`). Its long-frame share counts
  delivered frames, not missed refreshes: beside 8.6% and 18.15% long, 28-32% of 60 Hz refreshes bring no new frame (`CL-PERF-03`).
- *Not measured.* No integrated-GPU run exists (`CL-PERF-02`). Nothing measured on the RTX desktop speaks for a weaker machine.

**The register.** {{N}} findings. By severity: {{SEV}}. By kind: {{KIND}}. Every area finding went to a skeptic told to refute it; each S1 and S2
to two, one reproducing and one attacking its premise. Five entries registered last, from the completeness critic and the records' evidence, did not. Verification: {{VER}}. Where a skeptic weakened a finding, its correction is applied,
and the entry shows both the area's claim and the correction. Weakened findings were mostly the severities of map furniture and of the test
gate, and origins.

**Recommendation.** Before calling the map finished, the roadmap (section G) sequences six packages, together about 6-11 working days:
- **WP-00**, the security fix (hours);
- **WP-01**, the claims and words a visitor is told (1-2 days);
- **WP-02**, the force figures traced to what the sources print, starting with the owner's photographs of Duffy's pages (2-3 days);
- **WP-04's disclosure** on the relief (hours);
- **WP-05**, the dossier and the readings (2-4 days);
- **WP-06**, the camera and the rail (1-2 days).

They contain every P1 finding ({{P1}}) and most of the S2s. The larger data tasks follow: the tracks and grades (WP-03) and the relief's
refit (WP-04). Then legibility, accessibility and the picture (WP-07 to WP-10), with tests and records alongside. Fifteen owner questions
(270-284, section I) decide what the audit cannot.

**The audit's own limits.**
- No device timing comes from here (software WebGL).
- The phone was Chromium's emulation, not Safari on an iPhone.
- No screen reader was used.
- The source verification is a consequence-chosen sample, not the whole text.
- Three usage-limit interruptions stopped areas mid-way. Each was finished from its saved evidence, and its README says what was redone.
