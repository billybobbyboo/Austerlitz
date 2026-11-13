# The final audits' Stage 7: the device runs (WP-12; decision 278)

The owner's reports, pasted from `tools/step6/perf-run.html` (GitHub Pages, the PR's branch published for the runs) and kept verbatim; nothing here
was measured in this container. Each `.txt` is the report as pasted (the owner's own words around it removed); each `.json` is that report's
`AUS_PERF_JSON` line, parsed and indented. Each `.txt` is, character for character, the route's own `format()` of its `.json`
(`tools/final-stage7/device-desk.js`), and each `.json` passes `tools/final-stage7/route-check.js` (`../wp12/route-check-desk.txt`).
`docs/STAGE8_SPEC.md` section 27.1 reads them.

| file | run | route | started (UTC) | build measured |
|---|---|---|---|---|
| `desk-S7-1.txt`, `.json` | the desktop, run 1 | `step6-perf-route 4` (the ordinary route) | 2026-11-13 07:26:15 | 3,037,848 bytes, SHA-256 `22756380...a547d` (md5 `8c0d383e...`, Stage 7's build) |
| `desk-S7-2.txt`, `.json` | the desktop, run 2 | `step6-perf-route 4` | 2026-11-13 07:36:43 | the same |

The desktop: the same machine as step 6's L3 and Stage 8's D1 and D2: Chrome 156 on Windows (the user agent's; its minor version is not reported),
NVIDIA GeForce RTX 4070 (ANGLE, Direct3D 11), 32 cores, 32 GB, 2,560 x 1,440 at 144 Hz (refresh 6.9 ms at the start and at the end), the page
2,560 x 1,305 at density 1, effects on at scale 1.3, not `lowTier`, in the wrapper page; the wake lock held. Run 1 fetched the page (1,289,590 bytes
transferred, DOM ready 4.3 s), run 2 from the browser's cache (300 bytes, 5.2 s).

Not run (the owner, 13 November 2026): Stage 6's build (`builds/austerlitz-dcc65319-stage6.html`) was not available to the owner, so there is no
before-and-after of Stage 7's own work on one machine; the integrated GPU and the phone are still to come.

`builds/` holds the three builds the protocol names (`../device-protocol.md`).
