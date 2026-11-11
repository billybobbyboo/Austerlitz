# The final audits' Stage 6: the owner's questions and decisions

Stage 6 of `docs/ROADMAP_FINAL_AUDIT.md` ("Access and the picture"): WP-09 (accessibility and first use) and WP-10 (the rendered picture),
with WP-11's rule alongside. Three questions were carried from `docs/FINAL_AUDIT_POST_STAGE8.md` section I (276, 280, 281); the rest were put
while the stage was planned and built, numbered from 305.

**The owner's decisions (9 November 2026), in the owner's words: "Your recommendations for all."** Each question below is decided as its
recommendation reads.

| question | what it asks | decided | where it is applied |
|---|---|---|---|
| **276** | The first-run card's words (CL-UX-11; decisions 108, 49, 114): neither the card nor the opening says the map is a reconstruction, or what the A/B/C letters mean | **(a)**: one sentence on the card ("a reconstruction from the sources, its certainty graded A to C"), the key's grade rows reachable from it | WP-09, the focus, names and first-use PR (6b) |
| **280** | Uniform facings (decision 245 (a), carried) | **(a)**: decision 245 (a) kept, no facings (at the default distances a man is under 17.6 px; they would not read where visitors look) | nothing to build |
| **281** | The artillery's drivers and moving gunners (decision 243 (a), carried) | **(a)**: as built | nothing to build |
| **305** | The phase text at heights of 430 px or less (a phone held landscape, a desktop at 400% zoom; the layout is chosen by height alone, so the two cannot be told apart): decision 226 (a) kept today's held-landscape layout without phase text, its premise not stated to the owner then | **(a)**: the phase text reachable at every height, through the dispatch sheet's grip, as on the phone held upright | WP-09, the reflow PR (6a) |
| **306** | The limits of the two new `check:visual` cases (320 x 256 and 400 x 225 CSS px at density 4: WCAG's reflow width and a 1600 x 900 screen at 400%) | **as measured** on the reflow PR's build, as decisions 232 (a) and 237 (a) set the phone cases' | WP-09, the reflow PR (6a) |
| **307** | Formation blocks drawn inside buildings (CL-VIS-04): (a) fade the building parts under a block while it stands there, prototyped and measured first; (b) offset the figures clear (moves the drawn position: not recommended); (c) accept and say so in the sources sheet | **(a)**, measured first; **(c)** the fallback if (a) does not measure well. Opposing blocks sharing ground stays as the tracks draw it (a data question, CL-HIS-04) | WP-10, the crowns and buildings PR (6g) |
| **308** | The deciduous crowns' facets near the eye (CL-VIS-08; left open by 8H) | an alpha-tested twig representation within a few units of the eye **prototyped and measured** (overdraw, triangles, the shadow map), **adopted only within the budget**; else kept as 8H accepted it | WP-10, the crowns and buildings PR (6g) |
| **309** | Ground contact (CL-VIS-10, ChatGPT's CG-F04; optional) | **(a)**: decision 265 (a)'s bounded convention kept; not done in this stage | nothing to build |
| **310** | Visitor jargon and the overloaded A/B/C letters (CL-UX-16; `CONF_INTERP` guarded, a data task) | **the words as proposed**: "anchors" becomes "plotted positions", "Plotted leg" becomes "Plotted march", each grade named with its scale ("Position: estimated (B) · Timing: estimated (B)"); the full table in the visitor-words PR | WP-09, the visitor-words data task (6c) |
| **311** | Small type (CL-UX-17): 42-47% of the main screens' texts at 10.5-11.5 px, all at or above the 10.5 px floor | **(a)**: `t-small` kept at 11.5 px (raising it would re-measure most drop limits and baselines) | nothing to build |
| **312** | The three Stage 3 reading-scope items (the full dossier's earlier act, its "Historical event" links, the unbound interpretive arrows under a reading). Not WP-09's (accessibility): decision 251 (a)'s reach, WP-05's area | **(a)**: under a reading that does not know the formation, its dossier's earlier act and its "Historical event" links say the reading's "Not known to ..." sentence, as "Now" and "Next" do since WP-05; the plans', objectives' and groups' arrows kept (labelled interpretation, binding no formation's present place), with a sentence in the sources sheet saying so | a small PR of its own |
| **313** | The self-test's pinned woods counts after CL-VIS-02 (the trees and bushes on the Satschan mere's ice not drawn) | **re-pinned at the measured counts**: village 184 to 180, stream 222 to 205 (every other tree and bush drawn exactly as before) | WP-10, the meres PR (6e) |
| **314** | The gait-on-the-ground check's kept-open counts after CL-VIS-01 (the figures on the mere stand on its ice; its waterline is a crease the gait's chords cannot follow, as the ground's own creases are) | **(a)**: twelve fresh groups re-baselined at the measured counts (every case added Dokhturov's or Kienmayer's at the Satschan shore, each within its group's proposed bound); `H_TOL` and every bound unchanged | WP-10, the meres PR (6e) |


**Put while the PRs were verified (10 November 2026), decided the same day: "Re-baseline (Recommended)".**

| question | what it asks | decided | where it is applied |
|---|---|---|---|
| **315** | The first screens' limits after decision 276 (a): the card's sentence and its "Show the key", inline in the key's paragraph, make the card about two lines taller; on CI (run 42778177074, build `19d7105f`) `first-run`'s unobstructed map 62.5% to 60.8% (at 1280 x 720 50.6% to 47.9%), `first-run-laptop`'s 54.6% to 52.1% (47.9%), `phone-390-first`'s 59.1% to 53.6% and its framing 16 to 13 of 15 items, every other measure passing | **re-baselined at CI's measures**, rounded down as before: `first-run` [0.607, 0.478], `first-run-laptop` [0.521, 0.478], `phone-390-first` 0.535, its framing 13 (the alternatives put: a shorter sentence, or the sentence off the card) | WP-09, the focus PR (6b); `tools/visual/thresholds.js` |

Also carried into WP-09's review by decision 304 (a): the phone's event-named share during Play, accepted as measured; it is measured again on
the stage's final build and reported there.
