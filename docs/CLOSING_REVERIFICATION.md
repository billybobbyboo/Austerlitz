# The closing re-verification pass

The last pass of `docs/ROADMAP_FINAL_AUDIT.md` ("Closing"): each finding of the merged register (`docs/audit-post8-evidence/register-export.csv`,
158 findings from Claude's and ChatGPT's audits after Stage 8) re-verified on the build the roadmap ends with, by the audits' own probes, then the
audit's 33 negative controls and every required check. 13-14 November 2026. Build `austerlitz-command-map.html`, 3,037,848 bytes, md5
`8c0d383eb45a6f2a5522d04863824b7b` (WP-16's second PR; WP-12 changed no build). Nothing in the build, its sources or its data changes in this pass.
The evidence is in `docs/closing-evidence/` (its `README.md` says what made each file); the verdicts in `docs/closing-evidence/verdicts.json`, made
by `tools/closing/verdicts.py`.

**No device result is filled in here.** The owner's desktop and phone runs of this build are those of 13 November 2026 (`docs/STAGE8_SPEC.md`
section 27); the integrated-GPU run and the screen-reader and device script (`docs/final-stage6-evidence/sr-session.md`) are not run, and are carried.

## The verdicts

- **fixed**: re-verified on this build. The audit's probe, or the remedy's own measure where the probe cannot see the fix, no longer shows the
  defect. "Held by" names the check that fails without the fix, or says that none does.
- **kept**: left as it is by an owner decision or as an accepted compromise, re-measured where a measure exists.
- **carried**: open. Not done, done only in part, or waiting on the owner's run. It goes forward.

| verdict | findings | S1 | S2 | S3 | S4 |
|---|---|---|---|---|---|
| fixed | 103 | 1 | 13 | 50 | 39 |
| kept | 19 | 0 | 0 | 6 | 13 |
| carried | 36 | 0 | 2 | 20 | 14 |
| all | 158 | 1 | 15 | 76 | 66 |

Against what the records claimed before this pass (`docs/closing-evidence/inventory/claimed.json`, from `CHANGELOG.md`'s entries of each stage):

| claimed by the records | fixed | kept | carried |
|---|---|---|---|
| fixed (107) | 103 | 0 | 4 |
| done in part (6) | 0 | 0 | 6 |
| kept (19) | 0 | 19 | 0 |
| deferred (3) | 0 | 0 | 3 |
| the owner's run (3) | 0 | 0 | 3 |
| never taken up by name (20) | 0 | 0 | 20 |

Four findings the records call fixed are carried. In each, part of the fix holds, but the probe still shows part of the defect:
- **CL-MAP-01** (S2): the long gaps are bounded (Landscape with counters 08:30-11:30, the longest hidden by the layout 99.8 battle minutes to
  18.3; `MOTION.LONG` holds 30). The roadmap's other done-when, no formation under 50%, is not met: 6 formations are under half drawn there,
  d'Hautpoul at 41.5%. WP-07 itself recorded this.
- **CL-MAP-02**: the event-named formations rise from 59% to 76% drawn, but the finding's own instance remains. The Russian Guard cavalry at the
  Guard's rout is drawn 12.7% of its frames.
- **CL-MAP-07**: the phone's gap is bounded, but half its formation-frames are still not drawn.
- **CL-UX-03** (S2): a finger and a slow mouse drag hand a press on a marker to the rail. A mouse whose first move leaves the 12 px marker does
  not (below).

## What this pass found

1. **A click lost during Play, a side effect of WP-05's CL-SIM-01 fix** (`tools/closing/dossier-click-driven.js`,
   `interaction/dossier-click-driven-*.json`). While the clock plays, an open dossier is now repainted at most every 250 ms (`DRAWER_PLAY_MS`). A
   repaint replaces its buttons, and a press whose release falls after a repaint lands on another element, so the browser makes no click.
   - **How it was measured:** the audit's driver ran the app's loop at 60 frames a second, with Saint-Hilaire's full dossier open. The real mouse
     pressed the day-track's second anchor 16 times, each press at another phase of the repaint.
   - **½×, 100 ms presses:** 7 of 16 were lost.
   - **4x, 100 ms presses:** 7 of 16 were lost.
   - **½×, 60 ms presses:** 5 of 16 were lost.
   - **The cause:** every lost press, and only those, had a repaint between its press and its release. When paused, 12 of 12 were taken.
   - **Keyboard:** Enter on a focused anchor is not affected.
   - **In real time on this machine** every press was lost (`interaction/dossier-click.*`, 0 of 12), because a frame of the software renderer
     takes hundreds of ms there.
   - **How it was found:** the audit's s1 scenario now reaches this check (`daytrack-anchor-during-play`). At the audit it did not: its full
     dossier held no anchor (0 then, 6 now).

   No check holds it. The self-test's CL-SIM-01 check keeps a focused control's focus across a repaint, not a press. It is carried as a new
   finding, with a small remedy: defer the repaint while a pointer is down in the dossier, or act on the anchor's own press.
2. **CL-UX-03's residual.** A real mouse pressed the playhead under the 04:15 marker and dragged 200 px (`tools/closing/marker-drag.js`). In moves
   of 2 and 8 px the drag scrubs the clock; in moves of 16 and 33 px it does not. The marker's host sees a mouse's moves only while the pointer is
   over it (a mouse has no implicit capture), so a first move past the 12 px marker never reaches `RAIL_SLOP`'s 6 px test. The audit's own probe
   (s1b, moves of 25-33 px) still fails. The self-test's check moves in small steps.
3. **The records had drifted again since WP-13, and are corrected here:**
   - **README.md**'s checks table (CL-REC-02): 45 contrast states and eight start-up cases are now 57 and ten; 325 self-test checks are now 351;
     39 views are now 41; check:data's reference `postaudit1` is now `stage6wp09w-45d29cc5`.
   - **CLAUDE.md**'s narrative.js row (CL-REC-08): it ended at 8K's counts. Today's are added: 463 of 726 unchecked, 187 claims of their own, 76 by
     class.
   - **WP-12's status line** in `CHANGELOG.md` and the roadmap's status: both still said "a draft PR". WP-12 was merged (#108).
4. **Two fixes that no check holds: CL-HIS-12 and CL-SRC-06.** Both are verified in the page by `tools/closing/page-probe.js`:
   - CL-HIS-12: DOCUMENTED appears only on a read claim, across 51 Command rows at every phase.
   - CL-SRC-06: all 74 headline strengths are tagged.

   Two copies with each fix taken out make the probe exit 1. The probe is not in the suite.
5. **The audits' probes have rotted.** None of these is a defect of the build. Each is adapted in `tools/closing/` or explained in its finding's note:
   - `mirror-check.js` and `contact-8f.js` bind `aPh` and read `aSl` with WP-16's old stride. As written, they measure the probe, not the build.
     The contact probe as written puts 258-814 instances beyond its tolerance; adapted, it puts 17-58.
   - `facing.js` extracts a function WP-10 split in two.
   - props-helpers P4 copies the old rule, and props-bundle B9 skips the idle frames the fix relies on.
   - s1's `speed-in-ease` reads 40 frames after the press. `ease-speed.js` shows the hold is reached after 30-70 frames, the step falling by the
     speed ratio with no backward step.
   - s8's `dblclick-play` reads Play's `aria-pressed`, which WP-09 removed (CL-UX-15).
   - s12 counts the data's act texts, not the card as painted.
   - s6's "moved under the overlay" is the orbit target's height re-seated on the ground; the eye does not move.
   - s14's fifth case had ended its glide before the input.

   Stage 8's own mutation scripts are also worse: 11 of 189 no longer apply, against 5 at the audit (CL-ROB-07).
6. **CL-HIS-05's residual.** No Guard, Liechtenstein or Miloradovich leg moves away from the enemy now. But nine short cases (5-20 minutes) remain
   of a formation moving away from its nearest enemy under an offensive status. Decision 285 (a)'s rule tests legs into a retreat, not these, so
   no check holds them.
7. **ChatGPT's 4x protocol beyond the long-gap bar.** At 4x from 09:00, ChatGPT's 3,600-frame run hides the Russian Guard cavalry for 50.3 battle
   minutes. `MOTION.LONG`'s 30-minute bar holds only the ½× runs. The run's 81.7 s longest stretch in real time includes the frames after the
   clock reached 18:00.

## The 33 negative controls

The audit's controls (`tools/audit-post8/tests/mutations-list.js`) were applied one at a time to an isolated copy of this build, and every
restoration was checked (`tools/closing/mutate.js`). Thirty apply as written. Three were re-targeted to the same property in today's text, one edit
each, because a work package changed the text they edit:
- M08: the march row's derived tag, under WP-03's wording.
- M18: Saint-Hilaire's anchor, which now carries its grade.
- M22: the tour's plateau figure, now 41,000.

| | the audit (`f10fe585`) | this build |
|---|---|---|
| caught | 30 | 30 |
| missed by every check | M13, M29, M30 | M13, M29, M30 |
| caught without check:data | 26 | 27 |
| caught by a semantic check | 19 | 21 |
| caught only by change detectors | 11 | 9 |
| missed by every check but check:data | M16, M17, M27, M31 | M17, M27, M31 |

M16 and M18 are now caught by a semantic check, but incidentally:
- M16 by test.js's carried-grade rule of decision 272 (a), because the next anchor carries the raised A.
- M18 by sim-test.js's fight register, because a recorded fight is left unused once Saint-Hilaire moves.

Neither is a check of a grade's evidence or of a position (CL-TEST-03). The three missed are as at the audit: a colour typed into `style.css`
(CL-TEST-10), a datum rewritten at run time (CL-TEST-05), and the dossier's strength (CL-TEST-06). `docs/closing-evidence/mutations/` holds the records
and the table.

## ChatGPT's probes

| probe | ChatGPT (`f10fe585`) | this build | finding |
|---|---|---|---|
| extended playback, ½×, 3,600 frames from 09:00 | longest hidden 36,633 ms, 73.3% | 5,667 ms (18.3 battle minutes), 74.6% | CL-MAP-01 |
| the same, Saint-Hilaire selected | 26,900 ms, 71.3% | 5,500 ms, 73.6% | CL-MAP-01 |
| the same, the paper map | 667 ms, 95.0% | 667 ms, 93.6% | CL-MAP-01 |
| the same, 4x | 82,500 ms, 77.1% | 81,700 ms, 75.7% (the Russian Guard cavalry 50.3 battle minutes; above) | CL-MAP-01 |
| contact, same build both sides | 5-13 instances beyond the tolerance an arm | as written 258-814 (the probe reads WP-16's `aSl` wrongly); adapted 17-58, read identically to the original instance by instance on WP-16's first build; Stage 6's data build 7-22. The rise came with the relief's refit and WP-10's facings, re-baselined on the owner's word (decisions 293 (a), 316) | CL-VIS-10 |
| ice at a low sun, 15:00, the low view | glare 5.90% | 1.87% (band 1.096, margin 1.202: within the self-test's bounds) | CL-REC-10 |
| the phone rule, two empty reports | both "stand", exit 0 | refused, exit 1; its 8 negatives refused | CL-PERF-16 |
| T12, `mutate-8l.js` on the records | 15 of 15 caught | [T12] | |
| T13, five mutations of the full report | 5 of 5 caught | [T13] | |

## The required checks

| check | where | result |
|---|---|---|
| `npm run check:baseline` | here | passes (`8c0d383e`) |
| `npm test` (the nine suites, the height guard, the dead-code scan) | here, and CI on every push | passes; CI runs 43524392315 and 43524457649 |
| `npm run check:data` | here, and CI | passes: every declaration identical to `archive/stage6wp09w-45d29cc5.html` |
| `npm run check:chronology` | here, and CI | passes |
| `npm run check:contrast` | here, and CI | passes: 57 of 57 states, 10 of 10 start-up cases |
| `npm run check:selftest` | CI (run 43524457649, the branch's head `cb01827`; again on the push run) | passes: 351 of 351, every live block; `check:report` on its report passes |
| `npm run check:visual` | CI (run 43524457649, dispatched after the push landed, its head the branch's head `cb01827`) | [VISUAL] |

The local `check:selftest` was stopped at its start to free the machine for the browser probes (`checks/summary.txt`). CI's runs are its evidence.

## Every finding

Each row gives the finding (with ChatGPT's id where it has one), its severity and work package, the evidence on this build, the check that holds
it, and a note. Paths are under `docs/closing-evidence/` unless a check is named.

[TABLE]
