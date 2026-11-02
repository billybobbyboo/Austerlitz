## I. Owner decisions

These are the questions the audit cannot settle, because the answer is the owner's: what the site publishes, which sources to read, which
rules to apply, which accepted trade-offs to revisit. They are numbered from 270 so they do not collide with the project's decisions (the
last is 269). Each gives the evidence, the options and a recommendation. Decisions 267 (a), 268 (a) and 269 (a) are not reopened.
Questions 274 and 278 concern what those decisions left open, not their acceptance.

**Question 270: what GitHub Pages publishes** (`CL-ROB-01`, `CL-ROB-06`, `CL-ROB-13`). The device route's page on the public site puts any URL passed in
`?src=` into its frame, and a `javascript:` URL there runs in the site's origin (reproduced on a local copy only). About 460 third-party
archive images (the Moravian Land Archive's cadastre) are published with the repository, their terms of use unread. Seven archived builds on the same origin load
three.js without SRI.
- (a) Pages publishes only the product, through an explicit artifact. The device route is then served from somewhere the owner chooses.
- (b) The tools stay on Pages and `?src=` accepts only same-origin http(s) paths. The archived builds stay as they are (frozen reference
  builds, `CLAUDE.md`), so their exposure (`CL-ROB-06`) and the archive images' (`CL-ROB-13`) remain until (a).
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
anchor. A visitor reads "Position documented in the sources" where no reading of its own places the formation there. The 44 are unreviewed grades, not grades shown to be wrong. 8K regraded Suchet's
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
totals and kept its visibility baselines, the 4,033 ms among them, but left the counters' visibility over longer playback to this audit
(section 23.2). This audit shows the 4,033 ms is the benchmark's whole window. Over the morning at half speed, in Landscape with
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
A/B/C letters beside names mean; the key starts closed. Decisions 108 (the card's words), 49 (the key closed at first) and 114 (the opening's stops) set them.
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
when it was 12.8% of the file. It is now 21.7% (611,113 bytes, 277,502 more in Stage 8).
- (a) Keep it shipped (the single-file principle; the harness and CI need it).
- (b) Build a visitor file without it and a test file with it, both single files, the visitor file the one published.

*Recommended: (a) unless the transfer size matters to the owner's visitors; (b) is a build change with its own checks to adapt.*

**Question 284: the low views' wall of formation names** (decision 255 (a), (d); `CL-MAP-15`). Decision 255 left the wall of names in the
low views open, and decision 263 (a)'s lighter far plate is applied and measured. The wall remains: in the low Pratzen view the formation
names stand in rows over the troops. Decision 255 (d) prototyped thinning them and measured it, but did not adopt it.
- (a) Thin the far names in the low views, by priority and distance, with the motion block re-measured on the owner's word.
- (b) As decided.

*Recommended: (b) until WP-07's map-layer change is made, then re-measure: the same priority rule governs both.*

