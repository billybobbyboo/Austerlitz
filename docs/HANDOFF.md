# First tasks for Claude Code

Do them in order, one session each; report every check's actual output. Do not start Stage 1.

## 1. Tidy the repository after the layout change
The repository now uses the recovered original layout: `build.py` writes `austerlitz-command-map.html` at the top
level. Delete the superseded `dist/` folder, then confirm nothing else refers to `dist/`. Then run:
`npm install`; `npm run check:baseline` (expect md5 `c09c4b23d9e245ff9d693960cf9496b9`); `npm run check:data`
(expect all 112 data declarations byte-identical); `npm test` (expect seven suites passing and `runtime-test.js`
reporting 2 errors, as `docs/SUITE_RECOVERY.md` records). Commit only the deletion.

## 2. Bring `runtime-test.js` up to Stage 0
Its stand-in `THREE` (the object literal near the top) has token maths, while Stage 0's seating and label code use
real three.js maths. Replace the maths classes (`Vector2`, `Vector3`, `Matrix3`, `Matrix4`, `Quaternion`, `Euler`,
`Spherical`) with the real ones from `three@0.128.0` (`require('three')`, already a devDependency), keep the
rendering stand-ins (renderer, render targets, textures, `Color`), and give `InstancedMesh` real per-instance matrix
storage (`setMatrixAt`, `getMatrixAt`, `instanceMatrix`, `count`). If Stage 0's label placement then needs more of
the `document` stand-in (`querySelector`, `getBoundingClientRect`, `getComputedStyle`), a harness with no interface
panels is acceptable. Done when `runtime-test.js` reports 0 errors and every check it ran on the correction-pass
build still runs and passes. Never remove or loosen an assertion. Update `docs/SUITE_RECOVERY.md` and `CHANGELOG.md`.

## 3. (Recommended) Make the runner fail loudly
`tools/run-all.sh` prints each suite's summary but exits 0 even when a suite fails. Make it exit non-zero when any
suite exits non-zero or prints an error summary, without changing any suite. Say what you changed.

## 4. (Recommended) Automated checks on every push
A GitHub Actions workflow running `npm run build`, `npm test` and `npm run check:data`. Ask before adding it.
