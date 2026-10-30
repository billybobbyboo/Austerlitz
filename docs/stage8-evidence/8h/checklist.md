# Stage 8, implementation PR 8H: the completion checklist (working copy)

The 8H brief's requirements, every Stage 8 acceptance exception still open at 8G's merge, and the open audit findings 8H was given. Each row:
what the build did before 8H (measured on 8G's build, `main` at `636cc5d`, md5 `508927e6...`, unless said), the intended result, what 8H did,
the evidence, and the status. Statuses: **fixed** (changed and verified here, with a check able to fail where practical), **kept** (no change,
by an owner decision or a measured reason), **open: defect** (a fault not fixed), **open: owner** (a decision the owner must take; the proposal
is in `docs/STAGE8_SPEC.md` section 20), **pending: device** (only the owner's hardware can measure it). A row is never marked fixed because a
test was given an exception. This copy is revised as the work lands; the final table is section 20.1 of the specification.

| # | item | before 8H | intended | 8H | evidence | status |
|---|---|---|---|---|---|---|
| 1 | 8G's records (spec section 19, roadmap, changelog, evidence index) | section 19 cited (README, commits, code comments) but never written; roadmap and CLAUDE.md stop at 8F; the 8G changelog entry stops at the data task; `stills-pre1/pre2/8g.json`, `pairs/`, `selftest-pre2-local.json`, `places.json`, `raw/` cited, absent | the record of 8G as built, its evidence reproducible, what is reconstructed said | in progress | | in progress |
| 2 | château's bearing from its church | 322.5 degrees, 86.5 off the surveyed 236 (tolerance 90) | within a source-grounded tolerance, clear of roads, streams, yards | octant tolerance (22.5), centre in the town's place, nothing drawn between; the church the least move leaving it room | `buildings-8h.js`, `plan-8h.js`; self-test 8G (e) | fixed (255 degrees, 19 off) |
| 3 | Satschan's farmsteads | 5 of 7, an explicit exception (FARMS8G) | 7 within the approved constraints, or a proposal | measured: no lane, size or church place gives 7 within the constraints; a smaller size would (2 of 7 an L), a looser margin 6 | `buildings-8h.js`; the trials recorded in section 20.3 | open: owner |
| 4 | "each an L" in the dossiers | said of every village; 27 of 177 farmsteads a long range alone | the words what is drawn | counted per village (`farmsteadsText`), the sources sheet states 26 of 177 | self-test 8G (e'), recounted from the drawn records | fixed |
| 5 | village-ground coverage | per village as 8G | kept or improved per village | every village identical but Austerlitz (61 of 61 kept) | `buildings-8h.js` coverage table | fixed (kept) |
| 6 | geographic review (pheasantry, castle, Goldbach, post house, highway, Pratzen church, Austerlitz park) | proposed in 8G, no review | identity, date, conversion and 1805 relevance verified; a separate proposal | research reconstructed (in progress) | `docs/stage8-evidence/8h/geo/` | in progress |
| 7 | S-7: speed change in a dwell | the ease kept the old speed: left the dwell at 37.8 clock min/s, then 5 | the remaining ease at the new speed | ease rescaled by the speeds' ratio | `s7-8h.js` | fixed (4.965 at the end) |
| 8 | S-7: relief change in a glide | Follow idle under Play (`_tw.cam` left set) | Follow follows | `stopTweens` clears both slots | `s7-8h.js` | fixed |
| 9 | S-7: knowledge rule against the eased fog | not re-measured since the audit's 5-minute sample | the historical rule kept; the presentation's difference explained | measured every minute 08:00-10:00, both readings: 0 differences | `s7-8h.js` | kept (explained) |
| 10 | a block wheeling on after Pause (8F's finding) | 60 of 60 paused frames moved, 1.18 rad; two paths to one clock 1.15 rad apart | the pose held paused; a seek the clock's; resume on from the held pose | eases only while Play advances the clock; a seek or first pose the clock's | `pose-8h.js`; self-test (l) | fixed |
| 11 | the phase's message under the view switch (section 9.6) | 1,685 px overlap at 1600 x 900 and 1366 x 768 in Study | 0 at every harness size, 08:45's message | in progress | `toast-8h.js` | in progress |
| 12 | A-6: focus ring, main landmark, heading levels | 1 px ring; no `main`; "What changed" h4 under h2; Plans h1 to h3 | 2 px; a main landmark; no skipped level | 2 px ring; `main` round the map layer, the timeline a region; levels corrected | in progress | in progress |
| 13 | trees close up (8F item 4) | shimmer 1.93% vs 1.39%; facets close | measured prototypes, the gains kept | not begun | | not begun |
| 14 | ice under a low sun (8F item 5) | glare wider and whiter than 8E's at 15:00 | within the ice rules | not begun | | not begun |
| 15 | troop-ground contact (8F item 1) | the cases kept open, bounded; the profile option over budget | the exceptions reported against the original criteria, the cost of any correction | not begun | | not begun |
| 16 | decision 258 (b): placements near a counter's anchor | commissioned, not built | built and measured against 257's visibility baselines | not begun | | not begun |
| 17 | decision 255 (d): far battle information's hierarchy | commissioned, not built | a prototype with contrast, size and performance measures | not begun | | not begun |
| 18 | G-2: the map-to-world factor typed outside `geo.js` | `len*0.5/UNITS_PER_KM` in a theme's length; `W`'s 0.5 (guarded) | one authority, no coordinate changed | not begun | | not begun |
| 19 | P-3: idle work per animation frame | `syncFollow`, `openingWatch`, `paintDevStats` each frame | idle work avoided | not begun | | not begun |
| 20 | P-4: start-up and the relief grid's cost | recorded in 2E (+0.45 s), never re-measured | measured, repeated | not begun | | not begun |
| 21 | T-7: wall-clock thresholds | single-frame timings | medians and 95th percentiles over runs | not begun | | not begun |
| 22 | decision 140 (the self-test kept in the file) | kept | kept | kept | | kept |
| 23 | device acceptance (8E, 8F, 8G, 8H): desktop, iPhone Safari, an integrated-GPU laptop; the effects-off bracket | never run on 8E-8G | the routes run on the final build | builds and instructions prepared | | pending: device |
| 24 | the motion block's counts on CI's browser (Chromium 141) | pinned there; this container runs 153 | CI's run | | | in progress |
| 25 | 8E: the drivers on the guns on the heights (an inference); gunners beside moving pieces; facings (245) | for the owner | unchanged unless decided | | | open: owner |
| 26 | 8G: St Anthony's chapel, the Santon's chapel, the granary not drawn (`BUILDINGS.notDrawn`) | alternatives put to the owner | unchanged unless decided | | | open: owner |
