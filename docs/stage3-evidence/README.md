# Stage 3 Part A: evidence

Produced by the scripts in `tools/stage3/` against the Stage 2F build (md5 `ee4390a2585f3df170fba82eb1994112`, 1,253,655
bytes) in headless Chromium with software WebGL. Cited from `docs/STAGE3_SPEC.md`. The page scripts inject **probes** into
the running page: measurement code, not the Stage 3 implementation. No source file and not the build was changed.

| file | section | script |
|---|---|---|
| `spine.md`, `spine.json` | C | `spine.js --md --json`: per phase, its act, its events, its timeline lines, the chapters and tour stops whose clock falls in it; every clock, camera and stated time that does not line up; events against the phases' timeline lines |
| `dock-probe.json` | B, D, G, H | `dock-probe.js --json`: per harness view (and three more: the phase-8 Overview in Study and Watch, the paper map at 1366 x 768) and per level of the docked-layout probe (today, the Now tab, one timeline, the legend closed, the dossier in the rail): the unobstructed fraction at the case's viewport and at 1280 x 720, the panels' boxes, the timebar's rows, the largest free rectangle, the paper map's px per true km as framed, the arrow heads hidden, the orbit target against the free centre, with and without `setViewOffset`, the layer's drops |
| `dock-report.md` | B, G, H | `report-3a.js`: the tables of `dock-probe.json` |
| `dock-probe.jpg` | B, D | `dock-probe.js --shots`: six views, today (left) and the docked layout probe at its last level (right) |
| `nav-probe.json` | A, F, G | `nav-probe.js --json`: pan (three rules), zoom toward the cursor and the floor at 1x, 4x, 10.33x from four views; `setViewOffset` against `groundAt` and `worldPerPx`; the Watch view-mode control's rendered contrast; the arrow heads' boxes against their triangles, and the map layer's own obstacles by kind (heads, objective markers, event glyphs); the mode switch while playing; Space and the arrow keys by real key presses |
| `orbit-min.jpg` | G.3 | `nav-probe.js --only heads`: the harness view pratzen-orbit-min (its own interaction replayed), the event glyph drawn across the view |

The probe's measurements read CSS pixels only, so `dock-probe.js` draws at a quarter of the pixel ratio and at 1 for its
screenshots; `nav-probe.js` draws at the page's own ratio. Timings in `nav-probe.json` were taken while another probe ran
on the same machine and are an upper bound; the 2F timings (`docs/stage2-evidence/perf-2f.json`) are the reference.
