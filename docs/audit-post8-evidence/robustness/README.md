# Final audit after Stage 8: robustness (security, dependencies, maintainability, runtime robustness)

Audited build: `austerlitz-command-map.html`, 2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83` (the tree's application files identical to
`origin/main` `43e3e5b`). Third attempt of this area: the first two stopped at usage limits after saving `static-scan.json`, `ci-reach.json`,
`osv-three-*.json`, `pages-tools-headers.txt`, `ctx-cycles.json` and the idle and presentation parts of `visitor.json`; those are reused here, not
redone. Browser: the pinned Chromium 141.0.7390.37 headless shell (CI's), ANGLE on SwiftShader (software WebGL), on a 4-core machine shared with
other audit agents (load average 15-38 during these runs): **no time below is a device's**, and settle times are this machine's. No application
source, data, threshold, test, archive or build was changed; scripts are in `tools/audit-post8/robustness/`, evidence here.
Not repeated (verified by the audit lead): three.js r128's SRI matching npm three@0.128.0 and the live cdnjs file; check:contrast's eight start-up cases.

The structured result is `result.json` (area "robustness"); this file says what was examined, how, and where each number is.

## A. Static

### A1. HTML sinks and outside input (`sink-judgement.json`, from `static-scan.json`)
- The product reads nothing from outside its bundle but two boolean tests of `location.search` (`app.js:9` `harness=1`, `app.js:3824` `stats`) and
  calls `location.reload()` (`app.js:573`, `shell.html:432`). Searched for and not found in `app.js`, `world.js`, `symbols.js`, `shell.html`: storage,
  cookies, `window.name`, referrer, hash, `history.state`, `postMessage` or a `message` listener, input/textarea/contenteditable, clipboard, drag and
  drop, files, `fetch`, XMLHttpRequest, WebSocket, workers, `import()`, `window.open`, `eval`, `new Function`, string timers. `world.js:976`/`1014`
  load images from the embedded `ASSETS` data: URIs only.
- Verdict on the 57 sinks (all in `app.js`): **0 reachable** by outside input. 13 clear to "", 13 are wholly `esc()`-escaped or literal, 31 have
  non-escaped parts, every one a bundle constant (a token colour, a number) or markup built in the same function from `esc()`-escaped bundle strings.
- `esc()` (`app.js:6910`) escapes `& < >`, not quotes; several double-quoted attributes take `esc()`ed text (`app.js:2496` `aria-label="'+name+'`,
  the day-track's `aria-label="'+esc(lab)+'"`). No string in `data.js`, `analysis.js`, `appearance.js`, `geo.js` or `LABELS` holds a `"`, `<` or `&`
  (`dataset-chars.json`; scripts `dataset-chars.js`, `labels-chars.js`); `narrative.js`'s 38 strings with `"` are statement refs, which `claimTag`
  puts in a single-quoted `data-ref` (`app.js:8117-8118`). Latent only (finding R-11).
- **The device route's `?src=` is a DOM XSS on the public site** (finding R-1). `tools/step6/perf-run.html:40` takes `src` from the query string
  unchecked and `:44` sets the frame's `src` to it. GitHub Pages serves this page from the repository (`pages-tools-headers.txt`: HTTP 200, md5
  `3f57a5bf...` equal to the repository's). Reproduced on a local copy (same md5) served over HTTP on 127.0.0.1, never the live site
  (`perfrun-src.js` -> `perfrun-src.json`): `?src=javascript:parent.document.title='RBX '+parent.location.origin;void 0` set the page's title to
  `RBX http://127.0.0.1:<port>` (script in the page's origin, with access to the parent); a `data:` URL could not reach the parent (opaque origin);
  the control loaded the default path. `?route=`, `?quick=`, `?only=` are only compared or split (`perf-route.js:92`, `:220`).
- Other HTML the repository publishes: the 19 archive builds (7 of them, `correction-pass`, `stage0`, `stage2c`, `spine`, `stage4d`, `stage6b`, `step2`,
  load three.js from cdnjs without `integrity`: finding R-6); five raw third-party pages under `docs/stage8-evidence/8h/geo/raw/probe/` (one inline
  script, a config assignment; one root-relative module that 404s on Pages: no third-party code runs on the origin); two audit pages (no parameters).

### A2. Dependencies and advisories (`osv-three-0.128.0.json`, `osv-three-all.json`, `osv-devdeps.json`)
- three 0.128.0: no advisory (OSV). The one advisory for the package, GHSA-fq6p-x6j3-cmmq (CVE-2020-28496, colour-parser ReDoS), affects
  < 0.125.0. Dev dependencies, exactly pinned in `package.json` with a lockfile of 6 packages: playwright 1.56.0, playwright-core 1.56.0, acorn 8.18.0:
  no advisory (OSV queries, 2026-11-02; playwright's GHSA-7mvr-c777-76hp is fixed in 1.55.1).
- three r128 behaviours this audit measured on the context-loss path (findings R-2, R-3) are library behaviour, not advisories.

### A3. Licences and attributions
- Fonts: `fonts.css` (generated, 96,619 bytes) carries one 17,438-byte licence comment, and it survives into the build: the full SIL OFL 1.1 text
  ("PERMISSION & CONDITIONS"), Inter's copyright, the Bitstream Vera and Arev licences with DejaVu's public-domain note, the GUST Font License with
  the changes made, "Its authors provide no support for this modified version" and where to obtain the unmodified original (grep counts in the
  build: OFL 4, GUST 5, Bitstream 22, Arev 1). Each face renamed. Satisfies the licences' notice, renaming and LPPL 6(b)-(d) conditions as read here.
- three.js: loaded from cdnjs, not redistributed in the product or the repository (no copy in `git ls-files`; `node_modules/` ignored), so MIT's
  notice is not owed in the product; the product does not credit it (optional).
- Textures: `assets.js:1-2` (product line 1674) "CC0 from Poly Haven (brown_mud_03, sparse_grass, forest_ground_06)": provenance named, no
  attribution owed.
- The project has no licence: no LICENSE/COPYING file, `package.json` `"private": true` with no `license` field (finding R-7).
- Not checked: the terms of use of the ~450 Moravian Land Archive (MZA) cadastre tiles and other third-party material under `docs/` that Pages
  publishes; no terms are recorded beside them (`docs/stage8-evidence/8h/geo/README.md`, grep).

### A4. Dependence on cdnjs
Decision 133 (a) (`docs/FINAL_AUDIT.md:835`, `:880`): three.js stays on cdnjs with `integrity` and `crossorigin` and a plain failure message.
Offline, or where cdnjs is blocked, a visitor sees "The map cannot start ... Its 3D library, three.js, could not be loaded from
cdnjs.cloudflare.com ... The map needs a network connection that can reach that address." (`shell.html:26-28`), focus on Reload, the rest inert;
check:contrast's "three.js aborted" case holds it (lead-verified). The single file is not usable offline: accepted compromise (R-12).

### A5. Maintainability
- Dead code (`static-scan.json` deadCode; checked by grep): of 791 top-level functions in `app.js`, `world.js`, `symbols.js`, one dead
  (`gaitDist`, `app.js:5827`, named in the comment at `app.js:5780` and in CLAUDE.md's 8E list as part of the gait), two test- or tool-only
  (`v8Near`, `world.js:1703`, referenced only by a comment and the generated `_world_mod.js`; `posOf`, `app.js:712`, held by check:data's model
  list, `tools/visual/data-invariance.js:26`). The self-test, `app.js:9154-14253`, is 611,017 bytes: 47.0% of `app.js`, 21.7% of the build, parsed
  by every visitor (R-9).
- Mirrored logic: `groundY`/`groundYFast` (`world.js:500`, `:526`) are held value for value (`Object.is`) by `runtime-test.js:1415-1434`. The
  gait's GLSL hook (`animGLSL`, `app.js:1849`; the string every kit material compiles, `ANIM.body`) and its JavaScript mirror (`animAt`,
  `app.js:1020`) are held together by nothing: every check of the gait's arithmetic reads `animAt` (the self-test's envelope, culling-bounds and
  contact checks, `app.js:12858-12905`, `:13430`; `runtime-test.js:1263-1448`), and the GPU hook is checked only to move the figures and come back
  to rest (`app.js:12819-12850`); no test compiles the hook and compares it (grep: no transform feedback in any suite). Measured here by transform
  feedback on a WebGL2 context of the page's own (`mirror-check.js` -> `mirror-check.json`): 25,600 vertices over 400 uniform sets (amps 0-1.4,
  every part, slopes and knees beyond their clamps): the GPU hook equals `animAt` within 7.73e-4 units (a man is about 1.8 units tall; the
  displacements reach 1.42), against SwiftShader's own sin/cos error of 1.89e-4 over 0-4 pi: equivalent today within the GPU's trigonometric
  precision; parts outside the table rigid in both (0 difference). `ANIM.body === animGLSL()`: true (R-4).
- Global state (`static-scan.json` globals; `globals-clash.json`): `app.js` has 310 top-level `var`s and 620 top-level functions, 101 bindings
  reassigned from inside functions (`freeCam` by 16, `curVantage` 9, `settling` 8). The ten bundled files and the shell's scripts declare 1,287
  top-level names in the window's scope; none clashes with the 982 property names of a fresh window in Chromium 141 (a strength).
- Documentation (measured 2026-11-02): `CLAUDE.md` 130,902 bytes (745 lines; its "Current state" section about 35 KB of history), loaded into
  every agent session; `CHANGELOG.md` 1,283,488 bytes (9,387 lines), which CLAUDE.md asks every task to read first; `docs/STAGE8_SPEC.md` 665,797
  bytes. The repository on `main`: 2,478 files, 342.9 MB, of which `docs/` 294.5 MB and `archive/` 38.4 MB, all published by Pages (Jekyll from
  the branch) (R-8).
- The tools CI never runs (`ci-reach.json`; `tools-rot.json`, `mutate-rot.json`): CI runs 24 of 248 `tools/` files on every push (`npm test`,
  check:data, check:chronology, check:contrast, check:selftest: `.github/workflows/checks.yml`); check:visual and its live blocks only on a manual
  dispatch with `inputs.visual`. Of the 224 others, every `.js` parses (`node --check`) and every `.py` compiles; their relative `require()`s
  resolve (the only missing paths are output folders made at run time and one history script's input). Which matter: the 13 mutation scripts
  (`tools/stage8/mutate-*.js`), the only evidence that Stage 8's self-test, css-test and test.js checks can fail: read without running them, 184 of
  their 189 mutations still find the code they break; 5 no longer do (8D's `stale`, 8F's `treetris`, css-8F's `woods8e`, css-8G's `shape` and
  `tilt`: code changed since, by 8E's prerequisite, 8H and 8J), so those checks' sensitivity is no longer demonstrable as recorded (R-5);
  `tools/stage6/verify-quotes.js` (quote fidelity, network); `tools/fonts/build-fonts.py` (fonts.css's reproducibility; css-test checks the faces
  and licences, not the bytes); `tools/step6/perf-route.js` (the device route, manual by design, decision 139); the rest are history (never run
  again, CLAUDE.md) or a past stage's measurement, whose records are kept.

## B. Runtime (browser, bounded)

### B1. The graphics context lost and restored (`ctx-cycles.json`, `ctx-error.json`)
Harness page 1366 x 768; `WEBGL_lose_context`; 5 cycles idle, 3 while the clock plays (Play by a real click); after each the heap forced through
two garbage collections (CDP `HeapProfiler.collectGarbage`), then CDP `Performance.getMetrics` and the page's own counts (`rlib.js`).
- Behaviour as designed: the notice and its Reload button while lost, no frame drawn while lost, the first frame 1.9-2.8 s after the restore
  (SwiftShader), the clock unchanged across an idle loss, Play still playing after a loss while playing, no notice left after the restore.
- Growing across cycles (R-3): the JS heap after forced GC 15.73 MB before any loss, then 18.29, 20.98, 23.65, 26.41, 29.13 after the five idle
  restores (+2.56 to +2.76 MB each) and 33.12, 36.67, 40.37 after the three playing ones; 40.44 paused, 41.26 after two more clock steps. The
  dispose listeners on the scene's geometries 348 -> 1,869 and textures 18 -> 162, the most on one object 1 -> 9 (exactly one more per restore);
  materials' unchanged (664-697, at most 1). Not growing: CDP DOM listeners 566 (idle) / 579 (playing), nodes 1,859-1,927, three's programs 31-35.
  Cause, read in three r128's source (`node_modules/three`, 0.128.0): the restore runs `initGLContext()` (`src/renderers/WebGLRenderer.js:266-288`),
  making new `WebGLProperties`, `WebGLTextures` and `WebGLGeometries`, whose `dispose` closures are added to every geometry and texture used
  again (`webgl/WebGLGeometries.js:56`, `webgl/WebGLTextures.js:481`; EventDispatcher drops only an identical function, so the materials' one shared
  `onMaterialDispose` does not multiply); the old closures keep the old renderer state reachable.
- An uncaught page error on a loss while playing (R-2): "TypeError: Cannot read properties of null (reading 'trim')" at three r128's
  `WebGLProgram` (`acquireProgram` from `renderBufferDirect`): `ctx-error.json` 1 in 3 losses while playing, 0 in the idle control; `ctx-cycles.json`
  2 page errors over 3 playing cycles, 0 over 5 idle. `WebGLProgram.js:736-738` calls `.trim()` on `getProgramInfoLog`/`getShaderInfoLog`, which
  return null on a lost context; three's own guard (`WebGLRenderer.js:1002`) and the app's (`GL.lost`, `app.js:9120`) are both set by the
  `webglcontextlost` event (`WebGLRenderer.js:600-608`, `app.js:570`), which arrives after the context is already lost, so a frame that compiles a
  program in between throws. Frames resume after the restore. check:contrast's context cases lose the context with the page idle (CLAUDE.md), so
  this path is not covered.
- Chrome's "object does not belong to this context" warnings: 256, 76 and 58 in the playing cycles (decision 212 (b)'s known class).

### B2. A visitor's page in prolonged use (`visitor.json`, `visitor-growth-storm.json`, `relief.json`, `paper-series.json`, `visitor-day.json`)
Visitor pages: no `?harness=1`, CSS transitions kept, 1366 x 768, density 1, the first-run card closed by a real Escape; `rlib.js` counts with GC
forced before each snapshot.
- Idle (`visitor.json`): 120 s at 04:00: 0 frames drawn, 0 timers or intervals fired, 6,825 animation-frame callbacks (57 a second: the loop runs
  and returns, `app.js:9117-9125`), CDP TaskDuration +1.135 s, no layout; 60 s at a moment with smoke: 11 ambient frames.
- 20 presentation switches by real keys 2, 3, 1 (`visitor.json`): heap 15.81 -> 15.99 MB, DOM listeners 384 -> 384, nodes 1,721 -> 1,720,
  geometries 396 -> 396, programs 36 -> 36: no growth.
- RUNTIME_PENDING

## Commands
```
node tools/audit-post8/robustness/static-scan.js        # static-scan.json (earlier attempt)
node tools/audit-post8/robustness/ci-reach.js           # ci-reach.json (earlier attempt)
node tools/audit-post8/robustness/ctx-cycles.js         # ctx-cycles.json (earlier attempt)
node tools/audit-post8/robustness/ctx-error.js          # ctx-error.json
node tools/audit-post8/robustness/perfrun-src.js        # perfrun-src.json (local copy on 127.0.0.1, never the live site)
node tools/audit-post8/robustness/mirror-check.js       # mirror-check.json
node tools/audit-post8/robustness/globals-clash.js      # globals-clash.json
node tools/audit-post8/robustness/tools-rot.js          # tools-rot.json
node tools/audit-post8/robustness/mutate-rot.js         # mutate-rot.json
node tools/audit-post8/robustness/dataset-chars.js data.js analysis.js appearance.js narrative.js geo.js tokens.js; node tools/audit-post8/robustness/labels-chars.js
node tools/audit-post8/robustness/visitor.js idle,growth   # visitor.json (earlier attempt: idle and the presentations)
RB_OUT=visitor-growth-storm.json RB_SKIP_PRES=1 node tools/audit-post8/robustness/visitor.js growth,storm
node tools/audit-post8/robustness/relief.js             # relief.json
node tools/audit-post8/robustness/paper-series.js       # paper-series.json
RB_OUT=visitor-day.json RB_DWELL_OFF=1 RB_DAY_CAP_MIN=40 node tools/audit-post8/robustness/visitor.js day
```
