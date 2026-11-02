# v-repro-vis: reproduction lens, three major findings

Build: `austerlitz-command-map.html`, md5 f10fe585c46aea576f436ed51ac46f83; comparison build c4793156 (`git show 9eb7abb:austerlitz-command-map.html`,
the last build before Stage 8). Chromium 141.0.7390.37, SwiftShader. Scripts: `tools/audit-post8/verification/v-repro-vis/` (`vis-probe.js`,
`vis-analyse.js`, `ice-probe.js`). Evidence: `docs/audit-post8-evidence/verification/v-repro-vis/` (`vis-summary.json`, four captures). Raw JSON
and logs in the scratchpad (`v-repro-vis/raw-*.json`, `ana-*.json`, `ice-*.json`). Nothing of the application was changed. The ice was hidden in
the probe's own page for two captures only.

## visibility #0: WEAKENED (S2, P2; origin corrected)

**Method.** My own probe, not the area's instrument. It uses motion.js RUN's Play set-up: VIEWS.hybrid, 1600x900, Study, Landscape with counters,
the Field vantage. It seeks to 08:30 or 12:00 with Follow on at 1/2x, waits eight frames at rest, plays three hours of clock, then waits 30 frames
at rest. A counter counts as "drawn" when its DOM computed opacity is at least 0.5. It counts as "in view" when the probe's own projection puts its
anchor inside the canvas, the canvas is topmost at that point and the anchor is not occluded. I ran the same probe on the audited build and on the
pre-Stage-8 build.

**Numbers (audited, 08:30-11:30, 1,560 Play frames).** The total drawn share is 67.5%. Shares by formation:

| formation | share drawn |
|---|---|
| d'Hautpoul | 9.8% |
| Russian Guard cavalry | 15.7% |
| Walther | 15.9% |
| French Guard cavalry | 16.2% |
| Miloradovich | 17.3% |
| Kellermann | 36.6% |
| Nansouty | 46.4% |

Longest gaps:

| formation | longest gap |
|---|---|
| Miloradovich | 27,667 ms (100.2 clock min from 09:15) |
| Russian Guard cavalry | 17,667 ms |
| Walther | 15,333 ms |
| French Guard cavalry | 13,300 ms |
| d'Hautpoul | 12,667 ms |
| Kellermann | 12,333 ms |

From 12:00 to 15:00 the total is 72.3%. Two numbers differ from the area's there: d'Hautpoul's longest gap is 11,367 ms (the area has 15,300 ms),
and the longest gap of all is the French Guard cavalry's, 18,033 ms. Default Landscape from 09:00 to 12:00: 89.3% drawn, longest gap 2,000 ms. The
app's own state matches the area's raw recording in every cell of the 08:30 run (43,708 of 43,708). The finding's 'observed' line is reproduced.

**Code.** Read at HEAD:

- app.js:5114 `rank`, and 5126: a counter's priority is 3+rank unless it is selected, hovered or in the selected family. There is no term for
  events or motion.
- app.js:5340: `mlMotionSource` counts `playing`, so Play is motion even when the camera is still.
- app.js:5474-5482: the hold strategy. A counter that is not drawn needs room at `MLS.PASSES`=2 passes, and a pass comes every 333 ms.
- STAGE8_SPEC.md:5308: 121 frames = 4,033 ms, so 4,033 ms is the benchmark's window, not a measured gap.
- STAGE8_SPEC.md:5485-5488: visibility over longer playback is left on the final audit checklist. It is therefore not an accepted compromise.

**Correction: origin.** The pre-Stage-8 build gives, with the same settings:

| | pre-Stage-8 (c4793156) | audited (f10fe585) |
|---|---|---|
| total drawn, 08:30-11:30 | 78.4% | 67.5% |
| total drawn, 12:00-15:00 | 85.6% | 72.3% |
| d'Hautpoul | 5.4% | 9.8% |
| Russian Guard cavalry | 8.1% | 15.7% |
| French Guard cavalry | 23.8% | 16.2% |
| Kellermann | 38.8% (gap 16,967 ms) | 36.6% (gap 12,333 ms) |
| Nansouty | 44.9% | 46.4% |
| Walther | 39.0% | 15.9% |
| Miloradovich | 33.3% (gap 11,233 ms) | 17.3% (gap 27,667 ms) |

So the starvation of the cavalry divisions and the Guard cavalries is inherited. Stage 8 aggravates it: the totals drop by 11 to 13 points,
Miloradovich's gap more than doubles, and Walther's share falls. The finding should say "inherited, aggravated in Stage 8", not "new-regression".
Severity S2 and priority P2 kept: this is one of the three main presentations, and the purpose of the counters is defeated for these formations.

**Remedy.** Feasible. It needs the owner, because it touches decision 240 (a)'s order and the MOTION.VIS baselines.

## visibility #1: CONFIRMED (S2, P2, inherited)

**Method.** The same runs. For each event, I took the share of in-view frames in which each formation named in `EVENTS[].forms` has its counter
drawn, counted over the Play frames in which the event's label is drawn.

**Audited build, 08:30 run:**

| event | formation | share drawn |
|---|---|---|
| guard-broken | French Guard cavalry | 0.0% |
| guard-broken | Russian Guard cavalry | 0.5% |
| face-about | Miloradovich | 10.4% (area: 10.9%) |
| guard-attack | Russian Guard cavalry | 3.2% |
| guard-attack | Russian Guard infantry | 34.6% |
| blasowitz | Russian Guard infantry | 25.0% |
| blasowitz | Rivaud | 47.9% |
| blasowitz | Caffarelli | 70.8% |

**Audited build, 12:00 run:**

| event | formation | share drawn |
|---|---|---|
| guard-broken | French Guard cavalry | 10.5% |
| guard-broken | Russian Guard cavalry | 10.8% |
| guard-attack | Russian Guard cavalry | 9.0% |
| guard-attack | Russian Guard infantry | 20.0% |
| hq-forward | Imperial Headquarters (gqg) | 77.4% |

All named formations together: 58.9% (08:30) and 65.1% (12:00). In default Landscape: 80.1%, with the French Guard cavalry at 91.0% and
Miloradovich at 91.2%.

Two values differ from the area's: the Russian Guard cavalry at 12:00 (10.8% against 16.0%) and the Russian Guard infantry at Blasowitz (25.0%,
just above the area's range of 0-24%).

**Pre-Stage-8 build:** guard-broken French Guard cavalry 0%, Russian Guard cavalry 2.0%; face-about Miloradovich 0%; guard-attack Russian Guard
infantry 0.9%, Russian Guard cavalry 1.2%. This confirms "inherited". Stage 8 lowered three formations: Rivaud from 100% to 47.9%, Caffarelli from
100% to 70.8% and the Allied headquarters at the face-about from 100% to 85.5%. It raised the Russian Guard infantry.

**Code.**

- app.js:5126: the counter priority has no live-event term.
- app.js:5144: event labels are `keep:true` (decision 39).
- app.js:5476: kept items are placed first.

The event labels' own 100% therefore rests on this code. I did not measure it.

**Overlap.** Same mechanism as visibility #0, but a distinct claim and remedy, so not a duplicate.

**Remedy.** Feasible. It adds protected items, so the MOTION.VIS baselines may move, which is an owner decision.

## visual-landscape #0: CONFIRMED (S2, P2, inherited)

**Method.** My own probe, `ice-probe.js`. It reads every visible InstancedMesh instance under each block and compares the instance's world bottom
and top with the plane of each mere's disc. Settings: harness page 1600x900, Watch, aim `dok`, dir [0.55,0.45,0.70], r16 and r40. Clocks: 06:30,
12:00, 14:00, 15:00, 15:30, 16:00, 16:20, 16:40 and 17:00, at factors 4 and 10.33. Each capture was taken with the ice shown and then hidden in the
same state. I ran the same probe on c4793156.

**Numbers.**

- Satschan disc: y -4.14. The bed is below the ice on 69.2% of the disc, at most 0.875 units below.
- Menitz: the bed is below the ice on 77.5% of the disc, at most 1.143 units below.
- These reproduce the area's 69%/0.874 and 78%/1.142.

Instances below the ice at 16:40, 4x:

| formation | instances below the ice / inside the disc |
|---|---|
| Dokhturov | 350 / 378 |
| Kienmayer | 289 / 328 |
| Buxhowden | 28 / 40 |
| Friant | 24 / 99 |
| Legrand | 2 / 13 |

- Buxhowden's camp: four tent-sized meshes, up to 59% of their height under the ice.
- At 10.33x: up to 2.338 units below the ice.
- Pre-Stage-8 at 16:40: Dokhturov 349 of 378, at most 0.875 units below. This confirms "inherited".

**Captures.**

- `current-dok-1640-r16.jpg` against `-r16-noice.jpg`: with the ice, the men are cut at the thigh; with the ice hidden, their legs are whole.
- `current-dok-1640-r40.jpg` against `-r40-noice.jpg`: with the ice, the tents are sunk to their tips and the horses' legs are cut. So the defect is
  visible at r40, not only at r20 or closer.

**Code.** Read at HEAD:

- world.js:1381-1384: `mereLevel` puts the ice at min(level, lowest ground on the mere's edge - 0.05).
- world.js:1453-1454: `depthWrite:false`.
- data.js:465, 480, 495: `ice:true` on the phase-9 legs.

**Corrections (minor).**

- The ice's live opacity on the landscape is 0.94, set at app.js:4838; 0.96 is only the declared value.
- The "62% of a man" is the depth divided by the kit's head top, 1.415 (app.js:890). My per-mesh fractions do not confirm that exact share. The
  captures do show men cut at the thigh.
- The scope is wider than the ponds phase. Blocks that overlap the disc are sunk at 06:30 (Kienmayer, 136 of 222), at 12:00 (Kienmayer 64 of 95,
  Dokhturov 114 of 172) and at 14:00 (Kienmayer 100 of 154, Dokhturov 35 of 92).

**Severity.** S2 and P2 kept: this is the battle's best-known moment, visible from r40, and it shows the disputed drowning story (data.js:749).

**Remedy.** Feasible and presentation only. The new seating must agree with `groundYFast`, which the gait's contact check reads, and with the
height guard.

## Extra issue (S3, inherited, probable-problem)

Kienmayer's phase-1 via point [228,409] maps to world (-56,79.5). That is a normalised radius of 0.92, inside the Satschan disc (world.js:250 SATS;
rx 28, rz 10.5). At 06:30 his block therefore stands on the ice and is sunk in it: 136 of 222 instances. At 12:00 and 14:00 the anchors lie just
outside the disc, at radius 1.10-1.13, but the blocks still overlap it. None of these legs has `ice:true`. The drawn outline is schematic (decision
27), so this may be a question of outline against route.

## Not done

- visibility #0: I did not re-run Follow off, 60 fps, 4x-day, fixed, Watch or the fr/al runs. I did not check the fresh-layout shares or the
  "room in that frame" figure.
- visibility #1: I did not re-run the phone-with-counters or paper-map shares.
- visual-landscape #0: I took no captures at 10.33x. I did not re-read the self-test's contact check.
- No device run.
- Tool note: in the first `ice-probe.js` run, `setDisplayFactor` before `__aus.apply` was undone by apply, so its 10.33 rows repeat the 4x rows.
  They are not used. The 10.33x numbers above come from the scope run, which applied the factor.
