# Stage 8: the device runs (`docs/STAGE8_SPEC.md` section 24)

The owner's reports, pasted from `tools/step6/perf-run.html` (GitHub Pages) and kept verbatim; nothing here was measured in this container.
Each `.txt` is the report as pasted (the owner's own words around it removed); each `.json` is that report's `AUS_PERF_JSON` line, parsed and
indented. Every table row, header and verdict line was checked against its JSON by script (the desktop's 165 rows of 165).

| file | run | route | started (UTC) | build measured |
|---|---|---|---|---|
| `desk-D1.txt`, `.json` | the desktop, run 1 | `step6-perf-route 3` (the whole route) | 2026-11-01 07:01:22 | 2,810,630 bytes, SHA-256 `bf27887c...db07` (md5 `f10fe585...`) |
| `desk-D2.txt`, `.json` | the desktop, run 2 | `step6-perf-route 3` | 2026-11-01 07:08:05 | the same |
| `desk-fx.txt`, `.json` | the desktop | `stage8-fx-route 1` (`?route=fx`: effects on A, off B) | 2026-11-01 07:11:35 | the same |
| `desk-cull.txt`, `.json` | the desktop | `stage8-cull-route 1` (`?route=cull`: culling on A, off B; 4x and 10.33x) | 2026-11-01 07:16:09 | the same |
| `desk-gait.txt`, `.json` | the desktop | `stage8-gait-route 1` (`?route=gait`: the gait as built A, at rest B) | 2026-11-01 07:25:04 | the same |

The desktop: Chrome 156 on Windows, NVIDIA GeForce RTX 4070 (ANGLE, Direct3D 11), 2,560 x 1,440 at 144 Hz, the page 2,560 x 1,305 at density 1.
| `phone-R1.txt`, `.json` | the iPhone, run 1 | `step6-phone-route 1` (`?route=phone`) | 2026-11-01 07:50:33 | the same |
| `phone-R2.txt`, `.json` | the iPhone, run 2 | `step6-phone-route 1` | 2026-11-01 08:00:09 | the same |
| `phone-fx.txt`, `.json` | the iPhone | `stage8-fx-route 1` | 2026-11-01 08:10:48 | the same |
| `phone-cull.txt`, `.json` | the iPhone | `stage8-cull-route 1` (the low view at 4x) | 2026-11-01 08:22:22 | the same |
| `phone-gait.txt`, `.json` | the iPhone | `stage8-gait-route 1` | 2026-11-01 08:35:11 | the same |

The phone: the owner's iPhone 17 Pro, Safari 26.6.1, the viewport 402 x 714 at density 3, drawn at density 1 (`lowTier`). Its reports' rows, with
each block's printed settings, checked against their JSON: 184 of 184. `docs/STAGE8_SPEC.md` section 25 reads them.
