# The final audits' Stage 4, WP-04b: evidence

WP-04b of `docs/ROADMAP_FINAL_AUDIT.md` (the relief and the drawn geography: CL-GEO-01, -03, -04, -05, -07, -11), stacked on WP-03's branch
`claude/compassionate-curie-igyzhl`. What changed is in `CHANGELOG.md` (the Stage 4 WP-04b entry); this directory holds what it
rests on. Every measure below can be made again from the committed files; nothing is fetched by a test.

| file | what it is | made by |
|---|---|---|
| `dem/req-vsouth.json`, `dem/req-vslap.json`, `dem/req-anchors.json`, `dem/urls.txt`, `dem/urls-srtm.txt` | WP-04b's DEM requests: the 150 m grids over the southern Pratzen plateau (map x 250-350, y 275-375) and Slapanice (x 140-195, y 150-210), and fifteen named anchors, as points and as the URLs fetched | the measurement session for decision 273 (a) (its scripts `tools/final-stage4-wp04b/geometry/`) |
| `dem/raw/*.json`, `dem/raw/manifest.tsv` | the responses: Copernicus GLO-90 through the Open-Meteo elevation API, SRTM 30 m through OpenTopoData; the manifest gives each file's URL, HTTP status, bytes, sha256 and time (6 November 2026; the failed first attempts, status 000, retried) | as above |
| `relief/tolerance-before.*`, `-c16r.*`, `-after.*` | the tolerance lines (`tools/relief-tolerance.js`) and the residuals beside them on the relief before WP-04b, on the candidate c16r as measured for the owner, and on this branch | `node tools/final-stage4-wp04b/relief-measure.js [WORLD_JS] --json ...` |
| `relief/deadground.*` | the Pratzeberg's sight (tour stop 5's shares), the "Dead ground, Goldbach valley" line, the concealed French centre's anchors and the plateau's extent, before and after the refit | `node tools/final-stage4-wp04b/deadground.js <world.js before> --json ...` |
| `relief/consequences.json`, `marsh/`, `castle/`, `krug/consequences.json`, `consequences-all.json` | what each step moved (the land cover on a 1-unit grid, the streams' reverse gradients, "Whose eyes?" from both headquarters every 10 minutes, the buildings by village, the heights): each step against the one before it, and `consequences-all.json` WP-04b whole against WP-03 | `node tools/final-stage4-wp04b/consequences.js BASEROOT CANDROOT OUT` (lean trees of each step's sources) |
| `castle/castle-site-*.json` | the drawn class at the Sokolnitz castle's site and in rings round it, before and after its own ground | `node tools/audit-post8/records/castle-site.js ROOT` |
| `krug/ruian/` | RÚIAN queried for a part of a municipality or a basic settlement unit named Kruh, and for Holubice's own (6 November 2026; none at Holubice): the URLs, sha256 and responses | `curl` (the URLs in `manifest.tsv`) |
| `relief/sights.json` | owner decision 289 (a)'s sight readings before and after the refit: the Goldbach's bed from the Pratzeberg (its dead reaches), the dead-ground lines, the Zuran's view of the western escarpment, the chapel's views of the Augezd defile and of the meres, its sight line to the Satschan mere's centre | `node tools/final-stage4-wp04b/sights.js <world.js before> --json ...` |
| `artillery/limber-probe.json` | the limbered pieces' trail's end to their limber's pintle and their wheels on the drawn ground, the heights' battery over its moving leg, on the build before the seating's fix and after it | `node tools/final-stage4-wp04b/limber-probe.js <a.html> <b.html> --json ...` |
| `selftest/` | `check:selftest`'s results: `selftest-final.json` (the verdicts, the gait's detail and the motion block's runs), `gait-cases-final.txt` (the gait's 32 cases, WP-03's count and this build's against `H_CASES`, owner decisions 292 (a) and 293 (a)), `compare-wp03.txt` (the motion block and the self-test against WP-03's run), `gait-ground.txt` (the ground under the gait's cases, WP-03's relief and this one's, decision 293 (a)'s cause) | the harness; `tools/final-stage4-wp04b/gait-ground.js <WP-03 tree> <this tree>` |
| `mutations.txt`, `mutations.json` | the negative controls: each fix taken out of a copy of the sources (or the rule broken) and the suite that holds it run | `node tools/final-stage4-wp04b/mutate.js --out docs/final-stage4-wp04b-evidence/mutations.json` |

The DEM values the test reads are `tools/relief-dem.json`, written by `tools/relief-dem.js` from the final audit's committed responses
(`docs/audit-post8-evidence/geography/raw/`), each file named with its sha256. The geometry search that found `RELIEF_DEM`'s terms is
`tools/final-stage4-wp04b/geometry/` (`fit.js`, `fitlib.js`; the search `c16.json` and its rounding `c16r.json`, with their outputs, reproduced
exactly from the committed responses); the amplitudes are `tools/relief-fit.js`'s.
