# v-batch-rob: robustness findings #1-#12 (R-2 to R-13), adversarial verification

Audited commit: HEAD 58a6314 (application files identical to origin/main 43e3e5b); build md5 f10fe585c46aea576f436ed51ac46f83 (checked).
Own evidence: `docs/audit-post8-evidence/verification/v-batch-rob/ctx-race.json`, `ctx-leak.json` (scripts in
`tools/audit-post8/verification/v-batch-rob/`, three 0.128.0 alone from `node_modules/three/build/three.min.js`, Chromium 141.0.7390.37,
SwiftShader). Everything else below is code, data or git reading at HEAD, plus one passive HEAD request to GitHub Pages. No browser run of
the app in this attempt.

| # | id | verdict | method |
|---|---|---|---|
| 1 | R-2 | CONFIRMED | code + own repro on three r128 alone |
| 2 | R-3 | CONFIRMED (origin note) | measured, git history |
| 3 | R-4 | CONFIRMED | three source + own repro on three r128 alone |
| 4 | R-5 | CONFIRMED (accepted, decision 133 (a)) | code + decision record |
| 5 | R-6 | CONFIRMED | code reading of every use of animAt / animGLSL |
| 6 | R-7 | CONFIRMED | own re-check of the five search strings; checks.yml |
| 7 | R-8 | CONFIRMED | grep of 19 archives; one HEAD request to Pages |
| 8 | R-9 | CONFIRMED | git ls-tree origin/main; package.json |
| 9 | R-10 | CONFIRMED | byte/char count of app.js:9154-14253 |
| 10 | R-11 | CONFIRMED (origin corrected) | grep over the repo; git log -S |
| 11 | R-12 | CONFIRMED | code; dataset counts taken from the area |
| 12 | R-13 | CONFIRMED (origin corrected) | code; area's idle measure; git show 9eb7abb |

## #1 R-2 context loss while playing throws "reading 'trim'": CONFIRMED (S3 P3, confirmed-defect, inherited)
- app.js:567-571: `GL.lost=true` is set only in the `webglcontextlost` handler; app.js:9116-9119 `loop()` skips only on `GL.lost`.
  three r128 sets `_isContextLost` only in its own handler (node_modules/three/src/renderers/WebGLRenderer.js:600-608) and calls
  `gl.getProgramInfoLog(program).trim()` (webgl/WebGLProgram.js:736-738), which is null on a lost context.
- Own repro, three r128 alone (ctx-race.json, 3 of 3 trials): after `WEBGL_lose_context.loseContext()`, `isContextLost()` is true at once,
  the event has not fired by the next animation frame (`eventFiredBeforeRaf:false`), and a render that compiles a new program throws
  "Cannot read properties of null (reading 'trim')"; the event fires later. The app-level stack in the area's ctx-error.json matches
  (`new Jr < acquireProgram < renderBufferDirect`).
- "Never lost while playing": boot-check.js:171, :239, :285 lose the context without Play; cullmotion.js:131-134 calls `stopPlay()` before
  its context case. No other `loseContext` in app.js or the suites.
- Inherited: the loop head is identical at 9eb7abb (Stage 8's start, app.js:7600). Remedy feasible (`isContextLost()` is synchronous, measured);
  a loss detected mid-frame would still need a try/catch around the render to be complete.

## #2 R-3 documents outgrown a context: CONFIRMED; origin inherited but grown in Stage 8
- `wc -c`: CLAUDE.md 130,902 (745 lines), CHANGELOG.md 1,283,488 (9,387 lines), docs/STAGE8_SPEC.md 665,797. origin/main tree (git ls-tree -r -l):
  2,478 files, 342.9 MB, docs/ 294.5 MB, archive/ 38.4 MB. All exact.
- Growth: CLAUDE.md 79,060 bytes at 9eb7abb (23 Oct, Stage 8's start) -> 120,078 at b7fb67a -> 130,902 (+66% during Stage 8);
  CHANGELOG.md 1,098,907 -> 1,283,488 (+17%). The problem predates Stage 8 (a 1.1 MB log already), so "inherited" stands, worsened by Stage 8.

## #3 R-4 heap and dispose listeners per restore: CONFIRMED (S3 P4, inherited, three r128)
- three r128: `initGLContext()` makes new `WebGLTextures` and `WebGLGeometries` (WebGLRenderer.js:266-288); `get()` adds
  `geometry.addEventListener('dispose', onGeometryDispose)` with the new instance's closure (WebGLGeometries.js:50-58); textures likewise
  when the recreated properties lack `__webglInit` (WebGLTextures.js:476-483).
- Own repro, three alone, 400 meshes / 40 textures, two forced GCs before each read (ctx-leak.json): geometry dispose listeners 400 -> 2,800 and
  texture listeners 40 -> 280 over six restores, exactly +1 per object per restore (max per object 1 -> 7); heap 5.50 -> 15.29 MB (+1.6 to +1.7 MB
  per restore). The area's app-level +2.6 to +4.0 MB per restore is consistent in mechanism. Severity S3 (edge path) accepted; S4 would also be
  defensible (about 30 restores to add 100 MB). Remedy "accept and record" consistent with CLAUDE.md (three r128 unless agreed).

## #4 R-5 cdnjs needed: CONFIRMED as accepted-compromise (decision 133 (a))
- shell.html:437 the r128 tag with integrity and crossorigin; shell.html:28 the failure text naming cdnjs.cloudflare.com;
  docs/FINAL_AUDIT.md:835 and :880 decision 133 (a) (option (b) inline). three.min.js r128 is 603,445 bytes (the "about 600 KB").

## #5 R-6 GLSL hook and JS mirror unguarded: CONFIRMED (S4, optional-improvement)
- `ANIM.body=animGLSL()` (app.js:1081, :1882); `animAt` (app.js:1020). The self-test's GPU check (f) (app.js:12819-12850) asserts only that the
  figures and the shadow move at amp 1 and return to rest. Every other use of the arithmetic reads `animAt` alone: the bounds (12858-12905),
  contact (13385-13430), runtime-test.js:1265-1448 (node). css-test.js:484 and :587 are textual (the version moves; no forbidden behaviour words).
  No suite compares the compiled hook with `animAt`. Not re-run: the area's transform-feedback comparison (mirror-check.json, max 0.0007729).

## #6 R-7 tools rot: CONFIRMED
- Own check of the five from-strings: 8D `stale`, 8F `treetris`, css-8F `woods8e` absent from their files; css-8G `shape` and `tilt` absent as full
  strings: their first lines are present but the `else` line is now indented four spaces (app.js: `}\n    else { u.sw=sh[0]; u.sd=sh[1]; } }`),
  so they no longer apply. Note: mutate-rot.json's `missing` field truncates the multi-line strings, so a naive substring test of it finds them.
- .github/workflows/checks.yml:13-15, :75-76: `visual` only on `workflow_dispatch` with `inputs.visual`. origin/main has 257 tracked files under
  tools/ (the area's 248 is its own selection); CI reach (24) not recounted.

## #7 R-8 archived builds without integrity on the Pages origin: CONFIRMED (S4 P4, inherited)
- grep of the first cdnjs script tag of each of 19 archive/*.html: 7 without `integrity` (correction-pass-672aff9f, spine-6b2cccd4, stage0-c09c4b23,
  stage2c-68ac7721, stage4d-9b13adbf, stage6b-7fc0f6c3, step2-af98f586), 12 with.
- Served: `curl -I https://billybobbyboo.github.io/Austerlitz/archive/stage0-c09c4b23.html` (2026-11-02 15:35 UTC) HTTP/2 200, content-length
  1,097,610 = the local file. Remedy caution: "publish only the product" must keep the device route (tools/step6/perf-run.html, run by the owner
  from Pages for device acceptance) in the published set, with R-1's fix.

## #8 R-9 no licence: CONFIRMED (S4 P4)
- `git ls-tree -r --name-only origin/main | grep -ic 'licen|copying'` = 0; package.json:3 `"private": true`, no `license` key. three.js is
  loaded from cdnjs (shell.html:437), not redistributed.

## #9 R-10 self-test shipped: CONFIRMED (S4 P4)
- app.js:9154-14253 (`var AUSTERLITZ_DEBUG=(function(){` to `})();`): 611,017 characters of app.js's 1,300,537 (47.0%); in bytes 611,113 of
  1,300,743; 611,113 / 2,810,630 = 21.7% of the build. A consequence of decision 132 (check:selftest runs it in the built page); remedy (lazy body)
  keeps that.

## #10 R-11 gaitDist dead: CONFIRMED; origin corrected to Stage 8
- app.js:5827 the definition; the only other mention the comment at app.js:5780; no other .js in the repo names it (bundle.js aside); CLAUDE.md
  names it once. `git log -S"function gaitDist("` -> 62f5cd2 (8E), where it was already unreferenced. v8Near (world.js:1703) from dddd4e4 (8G),
  named only in the comment at world.js:1712 and the generated _world_mod.js. Both Stage 8 code: origin new-regression by the rubric's dating
  (no behavioural effect; S4 P4 unchanged).

## #11 R-12 esc() and double-quoted attributes: CONFIRMED (S4 P4, inherited)
- app.js:6910 escapes `& < >` only. Double-quoted sinks: app.js:2486 `aria-label="'+esc(lab)+'"`; :2495-2496 `name=esc(f.name)` into
  `aria-label="'+name+'...`; 6 occurrences of `="'+esc(` in app.js; :8118 `data-ref` single-quoted. Data counts (0 double quotes in data.js,
  analysis.js, appearance.js, geo.js, LABELS) taken from the area's dataset-chars.json, not recounted. esc() dates from 0a19964 (14 Oct 2026),
  before Stage 8.

## #12 R-13 animation frames requested while idle: CONFIRMED; origin corrected to inherited
- app.js:9116-9125: `requestAnimationFrame(loop)` precedes every state test; idle returns after `syncFollow`, `openingWatch`, `paintDevStats`.
  The same loop head at 9eb7abb:app.js:7600 (before Stage 8). visitor.json idle.at0400: 6,825 callbacks in 120 s (56.9 a second), 0 frames
  drawn, 0 timers, TaskDuration +1.135 s (SwiftShader; not a device timing).

## Not checked
- No app-level browser run in this attempt (budget): #1's in-app rate (1-2 of 3) and #3's app-level MB per restore are the area's numbers; my
  repros are on three r128 alone. #5's GPU-vs-JS difference not re-measured. #11's character counts and #6's CI reach count not recomputed.
