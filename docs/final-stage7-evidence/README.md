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
