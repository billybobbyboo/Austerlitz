# The correction-pass source tree and regression suite: recovered

**Status: recovered, proven, and synchronised with Stage 0.**

## How
The first project chat built the source tree, the suites and the tools in its own temporary sandbox and never
downloaded them. The account data export (`conversations.json`) holds that chat complete: 94 messages, 616 tool
calls and their outputs. Every call that wrote files was re-run in order in a fresh sandbox, with `/bin/sh` as the
original used (read-only commands and test runs, which change no files, were skipped); file creations and edits were
re-applied from their recorded inputs. Exit codes were compared with the originals: the one difference was the step
that built `assets.js` from ground-texture photographs downloaded from Poly Haven, which the sandbox could not reach,
so `assets.js` was taken from the verified build.

## Proof
- The recovered tree, built with its own original `build.py`, reproduces `archive/correction-pass-672aff9f.html`
  byte for byte (1,047,490 bytes, md5 `672aff9f...`): every source file, and the seeded `assets.js`, is exact.
- The original suite, run unmodified on that tree, reproduces the recorded results:

| suite | correction-pass build | Stage 0 build |
|---|---|---|
| `css-test.js` | 0 CSS errors, 9/9 behaviour checks | same |
| `test.js` | 0 errors, 0 warnings, order of battle 41/41 | same |
| `geo-test.js` | 54 passed, 0 failed | same |
| `terrain-test.js` | all pass (summits, downstream fall, meres, tour stop 5) | same |
| `audit.js` | 0 march-rate, 0 terrain violations | same |
| `sim-test.js` | 25 events, 0 disagreements; tour stop 4 agrees | same |
| `redteam.js` | 37 retired claims, 0 found; 0 findings | same |
| `runtime-test.js` | 0 errors; tour stops and parent/child checks OK | same, since task 2 (below) |

## Synchronised with Stage 0
The 73 Stage 0 edits (`tools/stage0/stage0-edits.json`) were applied to the recovered tree: 72 located by
`apply-stage0.py` (with the one-off `tools/patch-*.py` excluded, since they quote the old code); the CSS block, whose
anchor spans `style.css` and `shell.html`, appended to `style.css`. The original `build.py` then reproduces
`archive/stage0-c09c4b23.html` byte for byte (1,097,610 bytes, md5 `c09c4b23...`).

## Changes to recovered files
- `tools/run-all.sh`: finds the repository root from its own location (it had the sandbox path hard-coded).
- `build.py`: writes its outputs with LF line endings on every platform (Linux output unchanged; md5 still `c09c4b23`).
- `runtime-test.js`: two browser stand-ins that Stage 0 code needs (`location`, `renderer.info`); then brought up to
  Stage 0 (`docs/HANDOFF.md`, task 2; below).

## `runtime-test.js` brought up to Stage 0 (task 2, done)
It reported 2 errors on Stage 0 (`mesh.getMatrixAt is not a function`; `_cR.setFromMatrixColumn is not a function`):
its hand-written three.js stand-in had only token maths, and Stage 0's figure seating and label placement use real
vector, matrix and quaternion methods. The first error was thrown inside `init`, so none of the drive checks ran.
- The maths is now the real `three@0.128.0`: `Vector2`, `Vector3`, `Matrix3`, `Matrix4`, `Quaternion`, `Euler`,
  `Spherical`; the stand-in `Object3D` extends the real one (its token quaternion and empty matrix could not carry a
  world transform), and the cameras are the real `PerspectiveCamera` and `OrthographicCamera` (labels are placed
  through their projection). Rendering stays stubbed: renderer, render targets, textures, materials, geometries,
  `Color`.
- `InstancedMesh` stores per-instance matrices as r128 does (`instanceMatrix.array`, 16 floats each, zero until set;
  `setMatrixAt`, `getMatrixAt`, `count`).
- The `document` stand-in: elements answer `querySelector` as `document` already did (Stage 0's selection chip fills
  its `.sc-k`/`.sc-n`/`.sc-s`), and `getComputedStyle` reports an element's inline `display`/`visibility` or the
  defaults, since no stylesheet is loaded. `getBoundingClientRect` is unchanged.
- The re-seating check reset its block with `rec.seatPos=null`, the correction pass's "not yet seated" state; Stage 0
  (edit to `settleBlock`) keeps that state in `rec.seated`, so the reset reset nothing and the check saw 1 re-seat, not
  2. The reset now clears both. The assertion (exactly 2: first, then after a move) is unchanged.

No assertion was removed or changed. Verified: on Stage 0 the test reports 0 errors and 0 warnings, and its output is
byte-identical to the unmodified test's output on the correction-pass build (the 36 drive checks, the photo atlas,
the same numbers); the modified test also gives byte-identical output on the correction-pass build.

## History kept in `tools/`, never to be run again
`geo-migrate.js`, `geo-anchor.js`, `warp.js`, `warp-proto.js`, `geo-proto.js`, `geo-dump.js`, `relief-fit.js`,
`stale-compare.js`, `inventory.js`, `leg-check.js`, `patch-app.py`, `patch-history.py` (one-off correction-pass
tools, already applied); `split-from-html.py` and `stage0/` (how the interim tree and the Stage 0 patch were made).
The first chat's scratch files (renders, relief images, backups) are not part of the build or tests and were left out.
