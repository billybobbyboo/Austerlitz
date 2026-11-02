# Verifier v-repro-rob (reproduction lens): robustness #0 (R-1)

Audited build `austerlitz-command-map.html`, 2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83`. Repository HEAD `df67fdd` (application files
those of `origin/main` `43e3e5b`). Browser: the pinned Chromium 141.0.7390.37 headless shell (CI's pin). Nothing in the application, data, tests,
thresholds, archive or build was changed; the live site was never sent a crafted URL.

## robustness #0: "The device route's ?src= runs a visitor-supplied URL in the public site's origin (DOM XSS on GitHub Pages)"

**Verdict: CONFIRMED.** Severity S1, priority P1, confirmed-defect, origin inherited: all as the finding states. Two corrections to its record
(below) leave the verdict unchanged.

### What I checked

1. **The code at HEAD.** `tools/step6/perf-run.html` (md5 `3f57a5bf8135326d51099d87144d0e83`, 76 lines):
   - `:40` `src=q.get("src")||"../../austerlitz-command-map.html"`: taken from `location.search` with no check;
   - `:44` `fr.src=src`: assigned to the frame's `src` as given;
   - `:28` `<iframe id="app" ...>`: no `sandbox` attribute;
   - `:49` puts `src` back only through `textContent`, so that path is not a sink.
   - `?route=`, `?quick=` and `?only=` are only compared or split (`:40`, `:56`; `perf-route.js:92` splits `only`, `:220` `want(id)` looks ids up). The area's claim holds.
   - `perf-route.js` calls `w.eval` only on constant strings (`:82`, `:93`, `:308`). No other HTML the repository publishes outside `archive/` reads
     `location.search`, `location.hash`, `URLSearchParams`, `postMessage` or `message`, apart from the product, which only regex-tests
     `harness=1` (`app.js:9`) and `stats` (`app.js:3824`).
2. **The live copy, by a plain GET with no parameters** (2026-11-02 11:21 UTC, saved in the scratchpad's `v-repro-rob/live/`):
   - `https://billybobbyboo.github.io/Austerlitz/tools/step6/perf-run.html` returned HTTP 200, md5 `3f57a5bf...`;
   - `.../tools/step6/perf-route.js` returned md5 `c1323fa7...`. Both equal the repository's files.
   - `.../austerlitz-command-map.html` returned 200 with 2,810,630 bytes.
   - The responses send no `content-security-policy` and no `x-frame-options`.
   - Pages serves the whole repository: "Deploy from a branch", `main`, `/ (root)` (`docs/STEP6_SPEC.md:206-208`). The route is documented as live
     there (`docs/STAGE8_SPEC.md:4882-4884`, `:5165`).
3. **My own probe**, `tools/audit-post8/verification/v-repro-rob/repro-src.js`:
   - **Layout.** It copies the two tool files into a Pages-like layout (`/Austerlitz/tools/step6/`), with the audited build beside them (md5 checked
     `f10fe585...`). It adds a second path, `/Other/index.html`, which stands in for another project site on the same origin and keeps a secret in
     `localStorage`.
   - **Servers.** That layout is served from `127.0.0.1:A`. A second port, `127.0.0.1:B`, is a foreign origin.
   - **Pages.** Every case runs at 1280 x 720, each on a fresh page in one context, so storage is shared as in one visitor's browser.
   - **Output.** Raw results are in `docs/audit-post8-evidence/verification/v-repro-rob/repro-src-part1.json` and `repro-src-part2.json`, with the
     screenshots `js-dom.jpg` and `foreign.jpg`.

### Results

| case | `?src=` | observed |
|---|---|---|
| 1 | `javascript:parent.localStorage.setItem('vrr',parent.location.origin);parent.document.title='VRR1 '+...` | title `VRR1 http://127.0.0.1:<A> /Austerlitz/tools/step6/perf-run.html`; `localStorage.vrr` set in the page's origin; frame `about:blank` |
| 2 | `javascript:parent.document.title='VRR2 '+parent.localStorage.getItem('otherSecret')` | title `VRR2 s3cr3t-1793618617884`: the `/Other/` path's secret read (one origin, one storage, across project paths) |
| 3 | `javascript:parent.document.body.innerHTML='<h1 id=vrr-phish>replaced by the link</h1>'` | `#app`, `#panel`, `#msg` gone; body is the injected heading (`js-dom.jpg`): arbitrary content under the owner's address |
| 4 | `http://127.0.0.1:<B>/evil.html` (another origin) | the foreign page framed at 0,0,1280x720 under the page's address, "FOREIGN CONTENT" shown below the 206 px panel (`foreign.jpg`); no script in the page's origin (SecurityError on access) |
| 5 | the remedy on a copy, `javascript:...` | rejected; title stays "Frame-time route"; frame on `../../austerlitz-command-map.html`, which boots ("The build has started (115 s)") |
| 5b | the remedy, the foreign URL | rejected; frame on the default |
| 6 | the remedy, `../../austerlitz-command-map.html` | accepted as `http://127.0.0.1:<A>/Austerlitz/austerlitz-command-map.html`; "The build has started (32 s). Press Start." (`ready()`: `applyCase`, `AUS_BOOT.done`, `AUS_PERF`) |

What I saw matches the finding's "observed": any URL is assigned to the frame. The area's case wrote the title; mine reached further, to the
origin's storage, to another path's storage and to the whole document.

On timing: case 5's first attempt waited for the page's `load` event and timed out at 60 s, because the default frame loads the 2.8 MB build. That
is an environment effect: the second part reads the page from `domcontentloaded` instead. The boot times are SwiftShader's on shared cores, not a
device's.

### Origin
`git log -S 'q.get("src")' -- tools/step6/perf-run.html` gives `1b46001` (21 October 2026, roadmap step 6 Part A: the measurement probes). Stage 8
Part A began on 23 October. `git blame` shows line 40 last touched by 8E (`62f5cd2`, adding `route=gait`), but the `src` clause is unchanged since
`1b46001`. The defect is **inherited**.

### Severity and priority
**S1/P1 kept.** The rubric's S1 includes "a real, reachable security exposure" with no primary-path qualifier. This one is real (measured above)
and reachable: a public link on the owner's Pages address, one click by the victim.

The practical impact is bounded:
- The map stores nothing: `app.js` has no `localStorage`, `sessionStorage`, `indexedDB` or `document.cookie`.
- The origin holds no credentials.
- The value to an attacker is the owner's address (phishing, defacement) and the storage of any other Pages site of the account. Whether such a
  site exists I could not check.

P1 stands: the exposure is published, and the fix takes minutes.

### Corrections to the record (the verdict is unchanged)
- The remedy says publishing only the product "also removes R-6". It should read **R-8** (seven archived builds on the same Pages origin without
  integrity); R-6 is the gait hook's missing test. The area README's line 34 makes the same slip ("finding R-6" for the archive builds).
- **The remedy's second option conflicts with the owner's device protocol.** Publishing only the product on Pages would take the device route
  off the host the protocol uses (`docs/STAGE8_SPEC.md:4882-4884`, `:5165`), unless the Pages artifact also carries `tools/step6/`.
- **The first option is feasible and conflicts with nothing.** It accepts `new URL(src, location.href)` only when it has `location`'s origin
  and an http(s) protocol, and then assigns the parsed `u.href`, not the raw string, so the parser and the frame see the same URL. It keeps every
  documented use, all of them relative same-origin paths: `?src=../../austerlitz-8h.html` (`STAGE8_SPEC.md:4672`) and
  `?src=../../austerlitz-command-map.html%3Fv%3D5` (`STEP6_SPEC.md:1275`). Case 6 shows it does.

### Not checked
- **WebKit and Firefox:** not installed. The HTML spec runs a same-origin initiator's `javascript:` navigation in the frame's initial
  `about:blank`, whose origin is the parent's, so the same result is expected but was not measured.
- **Other Pages sites of the account:** the GitHub API's user endpoints are closed to this session.
- **`data:` URLs:** not re-tested; the area's case shows them blocked, as an opaque origin implies.
