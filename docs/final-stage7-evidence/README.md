# The final audits' Stage 7: evidence

Stage 7 of `docs/ROADMAP_FINAL_AUDIT.md` ("Performance and robustness": WP-16, WP-12 and WP-14, with WP-11's rule alongside).

- `questions.md`: the owner's questions and decisions (278, 283 carried; 317 onward).
- `wp14/`: WP-14, the robustness residuals.
  - `boot-main-dcc65319.txt`: the new and revised start-up cases on `main`'s build before the pass (`node tools/visual/boot-check.js <build> context-play,context-heap`), each failing.
  - `npm-test.txt`, `check-contrast.txt`: `npm test` and `npm run check:contrast` on the pass's build.
  - `mutate-wp14.txt`, `.json`: the negative controls (`node tools/final-stage7/mutate.js wp14 --json ...`): each fix put back, its check run alone.
  - `idle-wp14.json`, `idle-main-dcc65319.json`: the idle page's cost (`node tools/final-stage7/idle.js <build> --secs 60 --json ...`), CL-ROB-12.
