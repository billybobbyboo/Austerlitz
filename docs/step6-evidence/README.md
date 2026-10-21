# Roadmap step 6 Part A: evidence

Every file here was written by a script in `tools/step6/` (not bundled), run against the unchanged build of PR #58
(`austerlitz-command-map.html`, 2,200,058 bytes, md5 `45f8f662ef828d2e1ab593a3b87b6ff7`, SHA-256 `bca73918...10794`), in headless Chromium
with software WebGL (SwiftShader), one heavy job at a time, in the background with logs. No source file is written by any of them; every
prototype is put into a live page by its probe and undone or discarded with the page. Frame times here are software WebGL and decide nothing;
counts (draw calls, triangles) and layout measures do not depend on the GPU.

| file | section of `docs/STEP6_SPEC.md` | script |
|---|---|---|
| `census.json`, `census.md` | §3.1 (every draw call of one whole frame in 30 views: by pass, by what is drawn, by distance, by a man's height on screen) | `node tools/step6/census.js --json docs/step6-evidence/census.json`, then `node tools/step6/census-report.js docs/step6-evidence/census.json > docs/step6-evidence/census.md` |
| `size-probe.json` | §3.1 (per block in five views: distance, a vertical man's height on screen and a man-sized sphere's diameter on screen; the review's finding that the first follows the camera's pitch) | `node tools/step6/size-probe.js --json docs/step6-evidence/size-probe.json` |
| `lod-probe.json`, `lod/*.png` | §3.2 (the level-of-detail options in five views: calls, triangles, the pixels that change; the culling measure; screenshots of the Overview and the low Pratzen view under each option, and each view's base) | `node tools/step6/lod-probe.js --json docs/step6-evidence/lod-probe.json --shots docs/step6-evidence/lod` |
| `perf-local-desktop.json`, `perf-local-iphone.json` | §2.4 (the route run here: pasted into the build's page at 1600 x 900, and through `perf-run.html` from a local server as an iPhone; software WebGL) | `node tools/step6/perf-local.js --way paste --json ...`; `node tools/step6/perf-local.js --way frame --device iphone --json ...` |
| `phone-current.json`, `phone/current-*.png` | §4.2 (today at 360 x 800, 390 x 844, 412 x 915, 430 x 932 and 844 x 390, eight states each) | `node tools/step6/phone-probe.js --layout current --json docs/step6-evidence/phone-current.json --shots docs/step6-evidence/phone` |
| `phone-compact.json`, `phone/compact-*.png` | §4.4 (the compact timeline: first, explore, watch) | `... --layout compact --states first,explore,watch --json docs/step6-evidence/phone-compact.json --shots ...` |
| `phone-sheets.json`, `phone/sheets-*.png` | §4.4 (the sheets: first, explore, panels, dossier) | `... --layout sheets --states first,explore,panels,dossier --json docs/step6-evidence/phone-sheets.json --shots ...` |
| `phone-menu.json`, `phone/menu-*.png` | §4.4 (the Menu: all eight states; its layers and paper states superseded by the next file) | `... --layout menu --json docs/step6-evidence/phone-menu.json --shots ...` |
| `phone-menu-layers.json` | §4.4 (the Menu's layers and paper states again, after the prototype's menu was made to close on the Layers button; their screenshots replace the first ones) | `... --layout menu --states layers,paper --json docs/step6-evidence/phone-menu-layers.json --shots ...` |
| `phone-contrast-current.json`, `phone-contrast-menu.json` | §4.2, §4.4 (the interface text's contrast by `check:contrast`'s own method, and the controls' targets with the phases' press area measured whole; today at every size, the Menu at 390 x 844 and 844 x 390) | `... --layout current --contrast-only --json docs/step6-evidence/phone-contrast-current.json`; `... --layout menu --contrast-only --only 390x844,844x390 --json docs/step6-evidence/phone-contrast-menu.json` |
| `phone.md` | §4.2-§4.4 (all the phone JSON files as tables) | `node tools/step6/phone-report.js > docs/step6-evidence/phone.md` |

**Runs superseded, recorded.** The probes were corrected as they ran, and each correction's run replaced the one before:
- the phone probe's first run of today's build lost taps (each tap was given 5 s, and Playwright taps only once the element has stood still
  for two animation frames, seconds each here): its Panels, Layers, Paper map and, at 390 px and wider, Watch states were the "explore" state
  again. The probe now waits up to 90 s, records a failed tap, and checks every state (`phone-current.json` is the second run);
- the compact prototype's first run had its default rules after its media blocks, so its added buttons never showed (`phone-compact.json` is
  the second run);
- the 2.5.8 counts of the first runs measured a phase by its own box, without the 15 px its `::before` adds over the act row (decision 166
  (a)); the contrast-only runs re-measured the targets with it, and `phone-report.js` takes their counts where they exist;
- the census was run twice: the first did not count sprites (at most 92 triangles a frame short of `renderer.info`); `census.json` is the
  second, equal to `info` in every view;
- the size probe's first run used the coat geometry's own sphere, smaller than a man and unlike for riders, and was stopped;
- the LOD probe's first run was stopped (its nine options would have taken about two hours); the second measured six options in five views;
- the route's first local runs counted some frames twice (a segment's frame chain outlived it) and printed run-together columns; the second
  version lacked the hidden-page flag, the wake lock and the 25 ms floor; the two `perf-local-*.json` files are from the version the owner
  will run (`step6-perf-route 3`). Under software WebGL each segment records 0-7 frames (a frame takes seconds): they show the route runs and
  restores the page, nothing more.
