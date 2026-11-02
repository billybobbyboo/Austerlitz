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

**The audit branch changes no application file.** `git diff --stat 43e3e5b HEAD` lists only `docs/FINAL_AUDIT_POST_STAGE8.md`, its companion `docs/FINAL_AUDIT_POST_STAGE8_LEDGERS.md`,
`docs/audit-post8-evidence/` and `tools/audit-post8/`. The build on the branch is still md5 `f10fe585...` (`npm run check:baseline` passes there).

### D.2 How the audit was run

The work was split into areas, each done by a sub-agent with a written brief: history, the forces sources, the timings and places sources,
geography, state, tests, robustness, the device evidence, CPU attribution, visibility, the landscape, the paper map, interaction, accessibility
and first use, and the records. Each sub-agent wrote its evidence, a README and a structured result to `docs/audit-post8-evidence/<area>/`.
The account's usage limit stopped most areas at about 01:30 UTC. Each interrupted area was finished from its saved evidence after the reset;
its README says what was redone. The auditor read every area's result, merged duplicates and assigned the identifiers in `register.json`. Each
S1 and S2 finding then went to a separate skeptic, and the rest in batches, to try to refute it (section B's introduction). A completeness critic last read the report against the brief; its corrections are applied and its three findings registered. The auditor
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
  them. One raised Play's longest-hidden ceiling from 3,100 to 4,033 ms, which is the benchmark's whole window; the largest raised the orbit with a selection's from 2,000 to 3,033 ms, also its window (`CL-TEST-02`).
- `JUMPS` 248 and `POPS` 998 are exactly the build's own counts. They are pins, not quality bars (`CL-TEST-14`).
- `CTX_DELETES` keeps 248 where the case has measured 193 since 8C (`CL-TEST-17`).

**The in-app self-test's own limits are unchanged.** All 253 literal comparisons present before Stage 8 are still present and unchanged.
None of the 131 checks with a literal name in both versions changed its condition.
