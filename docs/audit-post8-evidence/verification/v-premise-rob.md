# Verification v-premise-rob (premise lens): robustness #0, R-1

Audited build `austerlitz-command-map.html` md5 `f10fe585...`; the finding concerns `tools/step6/perf-run.html` (md5 `3f57a5bf...`), not the
build. Nothing in the application, data, thresholds, tests, archive or build was changed. Script:
`tools/audit-post8/verification/v-premise-rob/src-premise.js`; its output: `v-premise-rob-src.json` (this folder).

## robustness #0 (R-1): the device route's `?src=` runs a visitor-supplied URL in the public site's origin. **CONFIRMED** (S1, P1, confirmed-defect, inherited)

**The code.** `tools/step6/perf-run.html:40` `src=q.get("src")||"../../austerlitz-command-map.html"`, `:44` `fr.src=src`; no check between.
`git log -S'q.get("src")'`: introduced in `1b46001` (2026-10-21, roadmap step 6 Part A), before Stage 8 Part A (begun 23 October); `49ee5ac`,
`4cb72b1`, `62f5cd2` only appended `?route=` tests to line 40. Origin **inherited** is right.

**Is the expected behaviour required?** CLAUDE.md has no security rule; the expectation stands on the tool's own contract and its function:
- `?src=` is documented only as a path to a build: "the build's path" (`perf-run.html:9`), "`?src=` names another path" (`docs/STEP6_SPEC.md:211`),
  "`?src=` names another build file beside it" (`docs/STAGE8_SPEC.md:5169`); every recorded use is relative and same-origin
  (`STAGE8_SPEC.md:4672` `?src=../../austerlitz-8h.html`, `:4677`, `STEP6_SPEC.md:1275` `?src=../../austerlitz-command-map.html%3Fv%3D5`).
- The route cannot work on any other origin: `perf-run.html:45` reads `fr.contentWindow.AUSTERLITZ_DEBUG`, which "a browser allows only for the
  same origin" (`STEP6_SPEC.md:203-204`). Restricting `src` to the page's origin removes no function.
- The audit rubric's S1 includes "a real, reachable security exposure" with no primary-path qualifier.

**Has the owner accepted it?** No. Question 217 (`STEP6_SPEC.md:115`, `:677-682`) let the owner publish the whole repository on GitHub Pages,
accepting that "every file on `main` then has a public address" (confidentiality of documents and evidence) and "taken down after the runs if
wished"; it says nothing of a published page executing visitor-supplied script, and no other decision (ROADMAP, STAGE8_SPEC, FINAL_AUDIT 6.0)
names `?src=`. Not an accepted compromise.

**Reachable?** Pages serves the page's exact bytes (the area's passive GET, `robustness/pages-tools-headers.txt`: HTTP 200, md5 equal, no
CSP/X-Frame-Options), and the owner's device acceptance runs from it (`STAGE8_SPEC.md:5164-5165`, `:5528-5530` "from GitHub Pages"), so it
stays published by design.

**Reproduced independently** (local imitation of a Pages user origin on 127.0.0.1, the tool at `/Austerlitz/tools/step6/`, a stand-in second
Pages site at `/other-site/` that writes `localStorage.probe`; Chromium 141.0.7390.37; the live site never touched):

| case (unmodified page) | result |
|---|---|
| `?src=javascript:` reading `parent.localStorage` and replacing `parent.document` | title `DEFACED SECRET-of-other-site`, body `OWNED`, address still `.../Austerlitz/tools/step6/perf-run.html?src=...`: script in the origin, another path's storage read, the page replaced |
| `?src=http://localhost:<p>/x.html` (another origin) | framed at 1280 x 720 under the tool's address, the panel's "Loading the build…" on top (content spoofing; the route never ready) |
| no `src` (control) | the default build stub loaded |

**Severity.** S1 by the audit's rubric, kept. For calibration only: on a conventional scale it is medium (CVSS 3.1 about 6.1,
AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N): it needs one click on a crafted link, the origin holds no session or credentials, and the product stores
nothing (`robustness/README.md` A1); what is exposed is the owner's address (phishing or defacement under `billybobbyboo.github.io`) and the storage
of any other Pages site of the account, which shares the origin by GitHub's project-site URL scheme (their existence not checked: the session's
proxy refused `gh api users/...` and `repos/.../pages`). P1 is proportionate: minutes to fix, no product or data change.

**Remedy.** The first alternative is sound and sufficient. Tested on a patched scratch copy (`new URL(src, location.href)`; same origin and
`http:`/`https:`, else the default with a message; the parsed `u.href` assigned):

| input | result |
|---|---|
| `../../austerlitz-8h.html`, `../../austerlitz-command-map.html?v=5`, `/Austerlitz/austerlitz-8h.html` | kept (3 of 3) |
| `javascript:`, `JAVASCRIPT:`, ` java<TAB>script:`, `data:`, cross-origin `http:`, protocol-relative `//host`, `blob:` of the same origin | rejected to the default (7 of 7) |

The protocol test is needed besides the origin test: `new URL("blob:<origin>/x").origin` equals the page's origin (node check). The second
alternative ("publish only the product on Pages") does not fix R-1 while the device route stays on Pages for the owner's runs (question 217 (b)'s
own set, the build and `tools/step6/`, keeps the sink); narrowing what Pages publishes is the owner's outward-facing choice under question 217, not
a tool change. Its cross-reference "also removes R-6" should read R-8 (the archived builds without `integrity`; R-6 is the gait's GLSL mirror).

**Scope complete.** Of the 29 published HTML files (`git ls-files '*.html'`), only this page takes URL input into a sink; the product
(`app.js:9`, `:3824`) and every archived build test `location.search` with `.test()` only.

## Extra (records, S4)
The robustness README cites findings by ids that do not match `result.json`: `README.md:34` "R-6" (is R-8), `:52` "R-7" (is R-9), `:26` "R-11"
(is R-12), `:60` "R-12" (is R-5); R-1's remedy repeats the slip.

## Not checked
The live site with any crafted URL (by instruction); the account's other Pages sites (API refused); Safari and Firefox (only Chromium here; the
standard behaviour is the same: a `javascript:` frame's initial document inherits the parent's origin).
