# Stage 8, the follow-up 8I: evidence

The record is `docs/STAGE8_SPEC.md` section 21 (21.2-21.6) and `CHANGELOG.md`. Every file here was made in this session by the tool named
beside it, on the builds named in it (each file records its build's md5); none is reconstructed. Software rendering (SwiftShader in headless
Chromium 141): its times decide nothing about a device.

| file | what | tool |
|---|---|---|
| `toast-8h.json` | the phase's message on 8H's build (`9fa50cb4...`): the eight layout changes, each read before and after; 4 of 8 left it over a control (its lifetime section from the tool's first revision, before the unheld case was rewritten; 8H has no relayout to judge there) | `tools/stage8/toast-8i.js --html <8H build>` |
| `toast-8i.json`, `toast-8i/` | the same on 8I's final build (`697bbf34...`): 0 of 24 reads over a control; the unheld lifetime (one timer, never cleared, hidden 13.0 s after it was set: software frames, never sooner than 3.4 s); the captures of every read | `tools/stage8/toast-8i.js` |
| `far/` | the far names' plate, the 13 views of `FAR_PLATE_VIEWS` on 8H's build and 8I's, matched: per name its plate, distance ratio, protection, size and contrast as rendered; every map text at AA; the layer's pass time (`far-8i.json`); a sheet per view, the two builds' captures side by side (`*-sheet.jpg`; the single captures not kept) | `tools/stage8/far-8i.js --before <8H build>` |
| `census-8h-both.json`, `census-8h-both.md` | 8H's `check:visual` report (CI run 40995113422) in both frames: the complete frame (the ground's depth drawn) and the still eye (depth reused), each maximum over the cases separately | `tools/stage8/census-8i.js` |
| `selftest-8i.json` | the local `check:selftest` run on 8I's final build: the in-app self-test's 317 checks all passing, every live block passing (`toastLayout` among them), the run's two failures the manifest's before it was regenerated from this run | `npm run check:selftest` (the report, copied) |
| (no file) | the route pages live on GitHub Pages for `main`'s build (8H's), each loaded, its build booted in the frame, no error: desktop 128 s, phone 46 s, fx 104 s, cull 99 s, gait 98 s to boot here | a Playwright smoke test of https://billybobbyboo.github.io/Austerlitz/tools/step6/perf-run.html and its four routes |

The census of 8I's own build, and of 8J's and 8K's, comes from each build's `check:visual` run on CI (section 21.6 and the 8J and 8K
sections), computed by the same tool: never carried forward from another build.
