# The final audits' Stage 7: evidence

Stage 7 of `docs/ROADMAP_FINAL_AUDIT.md` ("Performance and robustness": WP-16, WP-12 and WP-14, with WP-11's rule alongside).

- `questions.md`: the owner's questions and decisions (278, 283 carried; 317 onward).
- `wp14/`: WP-14, the robustness residuals.
  - `boot-main-dcc65319.txt`: the new and revised start-up cases on `main`'s build before the pass (`node tools/visual/boot-check.js <build> context-play,context-heap`), each failing.
  - `npm-test.txt`, `check-contrast.txt`: `npm test` and `npm run check:contrast` on the pass's build.
  - `mutate-wp14.txt`, `.json`: the negative controls (`node tools/final-stage7/mutate.js wp14 --json ...`): each fix put back, its check run alone.
  - `idle-wp14.json`, `idle-main-dcc65319.json`: the idle page's cost (`node tools/final-stage7/idle.js <build> --secs 60 --json ...`), CL-ROB-12.
- `wp16/`: WP-16, the measured performance changes (this PR: CL-PERF-14 and CL-PERF-13). The candidate builds were WP-14's build (`eabe076a...`)
  with each change alone (C3 `bf835e42...`, C2 `fd7bfa42...`), made from this branch's `app.js` before the self-test's block and its counter were added.
  - `pixels-c3.*`, `pixels-c2.*`: the picture and the sun's shadow map against WP-14's build (`node tools/final-stage7/pair-pixels.js <A> <B> --pages 2 --json ...`).
  - `paired.json`, `paired.log`, `paired.md`: the frame's CPU and GL calls, the three builds side by side (`PA_REPS=2 node tools/audit-post8/perf-attribution/paired.js
    <out.json> <rawdir> A=<A> C3=<C3> C2=<C2>`; `node tools/audit-post8/perf-attribution/analyse-paired.js paired.json A > paired.md`).
  - `mutate-wp16.*`: the negative controls of the self-test's `wp16Checks` (`node tools/final-stage7/mutate.js wp16 --json ...`).
  - `npm-test.txt`, `check-contrast.txt`: the suites on this PR's build.
- `wp16b/`: WP-16's second PR (CL-PERF-12, decision 321 (a); CL-PERF-15 profiled, question 322). `A` is `main`'s build `07c186de...`; `P` the packed
  build `084863c7...`, before the self-test's third WP-16 check was added (the final build differs from it by that check alone).
  - `pixels-packed.*`: the picture, the shadow map and the gait's amplitude in six views (`node tools/final-stage7/pair-pixels.js <A> <P> --pages 2 --json ...`).
  - `paired.*`: the matched protocol, two palindromes; `paired-drags.*`: the two drags again over three (`PA_MOTIONS=overview-drag,ph8-drag PA_REPS=3`).
  - `phone-paired.*`: the phone's tier (`PA_VP=402x714`): `P` against two measurement copies, the standards hidden (`Hstd`) and the figures and
    standards hidden (`Hfig`), made by a line put into `renderFrameNow` that hides each block's `std` (and `body`); never shipped.
  - `phone-census.*`: empty: `tools/step6/census.js` skips cases that need a fresh page, the phone cases among them (recorded, not used).
  - `mutate-wp16b.*`: the negative controls (`node tools/final-stage7/mutate.js wp16b --json ...`); `npm-test.txt`, `check-contrast.txt`.
- `device-protocol.md`: the device runs the records lack, prepared for the owner (decision 278 (a)); `device/builds/`: the three builds it names.
- `wp12/`: WP-12, the device evidence.
  - `device-reread.*`: Stage 8's device reports read again from their JSON (`node tools/final-stage7/device-reread.js --json ...`): the missed-refresh
    share beside the long-frame share, the largest segment medians.
  - `route-local-paste.*`, `route-local-frame.*`, `route-local-phone.*`: the route (version 4) run end to end here, the console way, the wrapper page,
    and the phone route on an iPhone's emulation (`node tools/step6/perf-local.js --quick ...`); software WebGL, its times decide nothing.
  - `fx-off-probe.json`: the first switch to effects off at the phone's tier (`node tools/final-stage7/fx-off-probe.js --json ...`), CL-PERF-10.
  - `mutate-wp12.*`: the negative controls of `tools/final-stage7/route-check.js` (`node tools/final-stage7/mutate.js wp12 --json ...`).
