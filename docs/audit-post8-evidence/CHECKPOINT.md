# Audit checkpoint (working file; superseded by docs/FINAL_AUDIT_POST_STAGE8.md when written)

## Baseline (done)
- `main` = `43e3e5b` (PR #79 merge); build `f10fe585...` / SHA-256 `bf27887c...db07`, 2,810,630 bytes, identical from `0b7b77c` to `43e3e5b`,
  identical to `archive/stage8k-f10fe585.html` and to GitHub Pages (last-modified 1 Nov 10:57:40 GMT). See `baseline/README.md`.
- CI on `43e3e5b`: run 41299647851 success. Last CI `check:visual`: run 41259079904 on `d3f7026` (no code/tool change since).
- Browser for checks: Chromium 141.0.7390.37 headless shell (CI's pin) in the scratchpad (`AUSTERLITZ_CHROME`), SwiftShader.
- three.js SRI: shell.html's sha512 = npm three@0.128.0 = live cdnjs copy (byte-identical), checked 2 Nov.

## Required checks (tools/audit-post8/run-checks.sh; logs in checks/)
- check:baseline pass; npm test pass (402 s; 9 suites + height guard); check:data pass (139/139); check:chronology pass (0 errors).
- check:contrast: main pass clean (6,926 elements, 45 states, 0 below AA); start-up cases running at time of writing.
- check:selftest: queued after contrast (browser probes ran beside it: README warns against sharing the machine; a quiet re-run is
  provided by check:visual's own self-test).
- check:visual + check:report: to run ALONE after the browser diagnostics (README: never beside a page probe).

## Workflows launched (results in their journals; evidence under docs/audit-post8-evidence/<area>/)
- audit-history (wf_9f5f76d0-c1f): history, sources-oob, sources-chronology, content
- audit-code (wf_84290373-cd1): state, tests, robustness
- audit-geo-perf-records (wf_6dbd64d8-3cf): geography, perf, records
- audit-browser-a (wf_7eef51d2-a38): interaction, visibility, runtime, perf-attribution (result.json per area)
- audit-browser-b (wf_80207556-7fc): visual-landscape, visual-maps, a11y (result.json per area)

## Independent notes (mine)
- README.md stale: check:data reference (step5c), 35 states/six start-up cases, 242 checks/15 min, 30 views/100 min; "self-contained" though
  three.js comes from cdnjs; no visitor-facing description of evidence vs reconstruction.
- 1280x720 visitor first screen: the timebar caption reads "THE DECEPT... · D. · [interval] Friant's division at Raigern since the ni..." (to verify).

## Next
1. Collect static + browser results; extract to evidence; consolidate candidate findings.
2. Adversarial verification workflow (skeptics per S1/S2; batched for S3/S4) + completeness critic.
3. check:visual alone; check:report.
4. Write docs/FINAL_AUDIT_POST_STAGE8.md; evidence README; commit; draft PR.
