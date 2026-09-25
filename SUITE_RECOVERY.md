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
| `runtime-test.js` | 0 errors; tour stops and parent/child checks OK | 2 errors (below) |

## Synchronised with Stage 0
The 73 Stage 0 edits (`tools/stage0/stage0-edits.json`) were applied to the recovered tree: 72 located by
`apply-stage0.py` (with the one-off `tools/patch-*.py` excluded, since they quote the old code); the CSS block, whose
anchor spans `style.css` and `shell.html`, appended to `style.css`. The original `build.py` then reproduces
`archive/stage0-c09c4b23.html` byte for byte (1,097,610 bytes, md5 `c09c4b23...`).

## Changes to recovered files
- `tools/run-all.sh`: finds the repository root from its own location (it had the sandbox path hard-coded).
- `build.py`: writes its outputs with LF line endings on every platform (Linux output unchanged; md5 still `c09c4b23`).
- `runtime-test.js`: two browser stand-ins that Stage 0 code needs (`location`, `renderer.info`).

## Open
`runtime-test.js` still reports 2 errors on Stage 0 (`mesh.getMatrixAt is not a function`;
`_cR.setFromMatrixColumn is not a function`): its hand-written three.js stand-in has only token maths, and Stage 0's
figure seating and label placement use real vector, matrix and quaternion methods. The application is unaffected
(the Stage 0 harness and self-test run it in a real browser). The fix is `docs/HANDOFF.md`, task 2.

## History kept in `tools/`, never to be run again
`geo-migrate.js`, `geo-anchor.js`, `warp.js`, `warp-proto.js`, `geo-proto.js`, `geo-dump.js`, `relief-fit.js`,
`stale-compare.js`, `inventory.js`, `leg-check.js`, `patch-app.py`, `patch-history.py` (one-off correction-pass
tools, already applied); `split-from-html.py` and `stage0/` (how the interim tree and the Stage 0 patch were made).
The first chat's scratch files (renders, relief images, backups) are not part of the build or tests and were left out.
