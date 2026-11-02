# Audit baseline (final audit after Stage 8)

Established 2 November 2026 (UTC), at the start of the audit, from this container and the GitHub API.

| identity | value | how verified |
|---|---|---|
| source commit (audited) | `43e3e5bcc5ab0cbbcb604a22a5b8c29f801649c8`, PR #79's merge into `main`, 1 Nov 2026 | `git fetch origin main`; `git rev-parse origin/main`; the audit branch `claude/inspiring-franklin-qt51w2` starts at it |
| merged PRs since the last audit's baseline | #78 (decision 267 (a), `c2adefe`), #79 (decisions 268 (a), 269 (a), `43e3e5b`); before them #77 (8L, `141f890`), #74-#76 (8I-8K) | `git log --merges`; GitHub API `list_pull_requests` |
| generated build | `austerlitz-command-map.html`, 2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83`, SHA-256 `bf27887c177ec68efbaedfe29e9d7826cf89c66ca7390b17e3cda8acf708db07` | `npm run check:baseline` (`python3 build.py` then the hash): the fresh build is byte-identical to the committed file |
| the same build at earlier commits | identical at `0b7b77c` (8L), `141f890`, `d3f7026` (#78's change), `c2adefe`, `43e3e5b`; `archive/stage8k-f10fe585.html` identical | `git show <c>:austerlitz-command-map.html \| md5sum` |
| deployed build (GitHub Pages) | the same bytes: md5 `f10fe585...`, SHA-256 `bf27887c...`, 2,810,630 bytes; `last-modified: Sun, 01 Nov 2026 10:57:40 GMT` (Pages run 41299647355 on `43e3e5b`, success) | `curl -sSL https://billybobbyboo.github.io/Austerlitz/austerlitz-command-map.html` at 00:44 UTC 2 Nov, hashed |
| CI on the audited commit | run 41299647851 (push to `main`, `43e3e5b`): the checks job, `check:contrast`, `check:selftest`: success | GitHub API `list_workflow_runs` |
| last CI `check:visual` | run 41259079904 (workflow_dispatch on `d3f7026`): success (job 124708389924, 2 h 2 min per STAGE8_SPEC 23.3) | GitHub API; `git diff --stat d3f7026 43e3e5b`: only `CHANGELOG.md`, `CLAUDE.md`, `docs/` changed, no code, tool or threshold, so that run judges this build and these tools |
| device-measured build | every device report names 2,810,630 bytes, SHA-256 `bf27887c...db07` (measured 1 Nov 2026 07:01-08:35 UTC from Pages after PR #78's merge `c2adefe`, whose build is this one) | `docs/stage8-evidence/device/*.json` (the perf-evidence area re-checks each) |

Environment of this audit: Linux container, 4 CPUs, 15 GB; Node 22.23.4; Python 3.13.18; Playwright 1.56.0 (npm), three 0.128.0 (npm);
Chromium **141.0.7390.37** (Playwright 1.56's pinned headless shell, CI's browser), downloaded from the Playwright CDN
(`chromium-headless-shell-linux.zip`, build 1194, SHA-256 of the zip `d745c721...a8c91f`) into the session scratchpad and named by
`AUSTERLITZ_CHROME`; ANGLE on SwiftShader (software WebGL). The container also has Chromium 153 (`/opt/pw-browsers/chromium`), not used for the
required checks. No time measured here is a device's.

Code indexes made for the audit (line numbers of top-level declarations at `43e3e5b`): `app-index.txt`, `world-index.txt`, `data-index.txt`.
