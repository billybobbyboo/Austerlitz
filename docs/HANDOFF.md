# Set-up tasks for Claude Code: done

The four tasks handed over after the suite recovery are complete (September 2026). This file is kept as their record;
details and check results are in `CHANGELOG.md`. The next work is Stage 1 (`docs/VISUAL_AUDIT.md`), which starts only
when asked.

| task | outcome | PR |
|---|---|---|
| 1. Tidy the repository after the layout change | recovered tree put in place (the web upload had flattened it); `dist/` retired; nothing refers to it | #2 |
| 2. Bring `runtime-test.js` up to Stage 0 | real three.js maths, `Object3D` and cameras; `InstancedMesh` matrix storage; `querySelector` and `getComputedStyle` stand-ins; 0 errors, output identical to the correction-pass run; no assertion changed | #3 |
| 3. Make the runner fail loudly | `tools/run-all.sh` exits 1 and names the failed suites when any suite exits non-zero or prints an error summary | #4 |
| 4. Automated checks on every push | `.github/workflows/checks.yml`: build, committed HTML equals the build, `npm test`, `npm run check:data` | #5 and after |

Rules that outlast the tasks: never remove or loosen an assertion to make a suite pass; add files by git commit or pull
request, not the GitHub web uploader, which flattens folders and renames dotfiles.
