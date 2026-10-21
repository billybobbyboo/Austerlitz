# Real hardware, figure level of detail, a phone layout: specification (roadmap step 6, Part A)

**Status: Part A written on `claude/upbeat-hamilton-y9utq8` (draft PR, for review). It changed no source file, no data and no build:**
`check:baseline` passes on the unchanged build (`austerlitz-command-map.html`, 2,200,058 bytes, md5 `45f8f662ef828d2e1ab593a3b87b6ff7`,
SHA-256 `bca73918aed88c62c7b564e6f9531b20b51eedb54554d272dfeb27b45eb10794`) and `check:data` finds 131 of 131 declarations identical
to `archive/step5c-45f8f662.html`. Written against `main` at `7437dcc` (PR #58 merged); line numbers refer to that commit; the code is the
source of truth. The next owner decision is 215 (§7).

Scope: roadmap step 6 (`docs/ROADMAP.md`: "Later, each its own decision: a phone layout; a measured pass on real hardware; figure level of
detail"; findings A-4 and P-1 of `docs/FINAL_AUDIT.md`; decisions 137, 138, 139). Part A specifies all three items and builds none of them.

**Scope guard (the brief; kept).** Nothing is implemented: no source file, data file or build changes; no limit of `tools/visual/thresholds.js`
moves (`DROP_LIMIT`, `UNOBSTRUCTED`, `PAPER_MIN_PXKM`, `CTX_DELETES` untouched). three.js stays r128, the product one self-contained HTML. Every
prototype is CSS or JavaScript a probe puts into a live page after it has started; none is in the source. No GPU frame time could be measured
here (the container has none): every frame time in this document is software WebGL and is said to be; the GPU's numbers are left to item 1's
protocol (§2), which the owner runs. Not in scope: the owner's later notes (Stage 8, L1-L5), P-2 (decision 140 keeps the self-test in the file),
any new feature.

**How this was established.** Every number comes from a script in `tools/step6/` (committed; not bundled), run against the build above, in
headless Chromium with software WebGL (SwiftShader) as the Stage 0 harness runs it, one heavy job at a time, in the background with logs:

| script | section | what it does |
|---|---|---|
| `perf-route.js` | 2 | the frame-time route for real hardware: drives the build through `AUSTERLITZ_DEBUG.applyCase` over 25 segments and prints a report to paste back |
| `perf-run.html` | 2 | the route's page for a phone: the build in a same-origin frame, Start, the report with Copy and Share |
| `perf-local.js [--way paste\|frame] [--device desktop\|iphone] [--viewport WxH] [--quick] [--only ids] [--json f]` | 2.4 | runs the route here under Playwright, both ways, to show it runs (its frame times are software WebGL) |
| `census.js [--json f] [--only views]` | 3.1 | every draw call of one whole frame in 30 views, by pass, by what is drawn, by distance and by a man's height on screen |
| `census-report.js census.json` | 3.1 | the census as tables (`docs/step6-evidence/census.md`) |
| `lod-probe.js [--json f] [--shots dir] [--only views]` | 3.2 | the level-of-detail options prototyped in the live scene and measured, each undone before the next |
| `phone-probe.js [--layout current\|compact\|sheets\|menu] [--only sizes] [--states s] [--json f] [--shots dir]` | 4 | the build at five phone sizes with touch, the device's density and a phone's user agent, eight states each, by real taps |
| `phone-layouts.js` | 4.3 | the three prototype layouts the probe injects |

Their outputs, screenshots and a README are in `docs/step6-evidence/`.

## 1. In short

- **Item 1 (question 139).** The route and protocol are ready (§2): a script the owner pastes into the browser's console on the laptop (Windows,
  Intel integrated GPU, Chrome or Edge), and a page for the iPhone (Safari) opened from a hosted copy. About 30 minutes of the owner's time and a
  hosted copy of the repository's files; five runs; the reports pasted back. Ten clock minutes at 4x last a quarter of a second, so the
  played segments run for 12 s instead (question 216).
- **Item 2 (question 138).** The census corrects the audit: the figures and standards are about half a 4x landscape frame's 2.5 million
  triangles (P-1 said about 91%); the trees with their shadows are a third; the shadow pass alone is 41%. No figure block is ever culled (three
  r128 does not cull instanced meshes), so every 4x view draws nearly the same frame. A man's size on screen differs by view: under 2 px for nine
  tenths of the figures in the Overview, 16 px or more in the low and close views. So a level of detail by size would cut the Overview's figures
  and leave the low views' alone. Measured (§3.2): a box per unit beyond 4 px halves the Overview's frame; no figure shadows takes a quarter
  off every 4x frame; culling the blocks by their own bounds would skip about half the figures' world pass in the low views. The rule that decides 138 from the laptop's report is stated now (§3.4):
  built only if frames drop in the Overview or the low views **and** hiding the figures cures it.
- **Item 3 (question 137).** Measured: at 360-430 px wide the timeline is 172-174 px tall, its act and phase
  labels are cut, the tools stand over the dispatch card, the presentation switch over the dossier's head; the three 45-minute phases are
  18-22 px wide on a proportional axis, under 2.5.8's 24 px, whatever the styling. Three prototypes measured (§4.3-§4.4): a compact timeline (127
  px), sheets at the foot (the map's free share after "Explore" from about 0.20 to 0.50-0.56), and the controls behind a Menu button.
- **Questions 215-230** (§7), each with options, a recommendation and its cost; the order recommended: 1, then 2 or its retirement by the rule,
  then 3, with 3's Part B free to begin while 1 waits on the owner's devices.

## 0. What binds step 6, and the records against the code

### 0.1 The decisions (quoted from their records)

| # | decision (where recorded) | what it means for step 6 |
|---|---|---|
| 137 | "a phone layout after the accessibility work, as its own stage" (`docs/FINAL_AUDIT.md` §6.0) | item 3 is its own stage; the accessibility work (roadmap step 3) is done, so it may begin; this Part A specifies it |
| 138 | "decided after question 139's measurement: built if an ordinary integrated GPU drops frames, else the item retired" (§6.0); the brief's words: "in the Overview or the low views" | item 2 waits on item 1's laptop run; §3.4 states the rule that decides it, in advance |
| 139 | "one measured pass on two ordinary machines (an integrated-GPU laptop and a phone) before any performance work" (§6.0) | item 1: no performance work is proposed here; the route and protocol of §2 are the measurement, run by the owner |
| 140 | "kept in the file (the harness tests the file that ships)" (§6.0) | P-2 is out of scope; the self-test stays in the build, and every check a step-6 item adds is a self-test or harness check of the shipped file |
| 122 | below 1024 px: "Recorded, not fixed: a `narrow-390` case for the first screen, its timeline's height recorded, not held to 92 px" (`docs/STAGE7_SPEC.md` §0.5) | the one phone-sized case today; item 3 would replace "recorded" by limits |
| 58 | below 1080 px "The dispatch stays a card there" (`docs/STAGE3_SPEC.md` §0) | a phone layout that makes the card a sheet (§4.3) keeps it a card in this sense (not docked into the rail); the owner decides whether "card" binds its shape |
| 164, 165 | a "Panels" control in the tools below 1080 px; the undocked dossier "stopped above" the timeline (`docs/ROADMAP.md`) | both are kept by every prototype (§4.3) |
| 166, 167 | the phases' hit areas over the act row, at least 24 x 24 px; the event markers under 2.5.8's essential exception (`docs/ROADMAP.md`) | the compact timeline (§4.3) keeps the phases as presses of at least 24 px and the event markers as they are |
| 159, 174 | the Watch caption's derived reading shown whole or not at all; at 720 px and below the plateau reading kept in the dispatch card (`docs/ROADMAP.md`) | the prototypes keep the caption's own fitting (`fitCaption`) and the card's reading |
| 113, 118 | the Now tab on the first screen; the opening's end at 04:00, Study, Now tab, the Overview, Play focused (`docs/STAGE7_SPEC.md` §0.5) | unchanged by any prototype; below 1080 px the Now tab is the rail's, hidden until Panels is pressed |
| 34, 6, 14 | footprints at 1x (decision 34); figures drawn many times life size (decisions 6 and 14, the scale convention) | the level of detail changes how far figures are drawn, never the convention or the 1x footprints |
| 97-110 | the figures by class: a value drawn only where a claim graded A or B settles it, else generic; the standards by the table (`docs/STAGE6_SPEC.md` §0.4) | any level of detail keeps what is drawn within what `appearance.js` settles (§3.3) |
| 84 | the floor of black, which the figures' cloths now meet (`css-test.js`; `CLAUDE.md`) | a far representation's colours are the figures' own, never darker |
| 141, 131 | the type embedded; the measures independent of the machine's fonts; the checks that cannot fail made strict | the phone cases (§4.5) measure in the embedded faces; Safari's metrics remain unmeasured (step 1's hand-on) |

### 0.2 What the code says now (fact, read from the build of PR #58)

- **The figures are already instanced.** Each formation's block is a group of `THREE.InstancedMesh`es, one per class of the figure kit (a coat,
  the fixed parts, a horse) and per role, the guns and gear, and the standards (`app.js` `makeBlock`, `figMesh`, `classMeshes`, `imesh`); each
  casts a shadow. Instancing *within* a block exists; instancing *across* blocks does not (§3.2's "merge").
- **No figure block is ever culled.** three r128's `InstancedMesh` sets `frustumCulled = false` in its constructor (read in
  `node_modules/three/build/three.js`, 0.128.0, the page's release), and `makeBlock` does not set it back: every block's meshes are submitted in
  every frame, in every pass, whatever the camera sees. The census (§3.1) shows it: a close view of Sokolnitz draws 98% of the Field view's
  triangles. §3.2 measures what a cull by each block's own bounds would skip.
- **The phone path.** `lowTier` (`app.js:593-594`): window under 900 x 700 CSS px or a mobile user agent; then the buffer at most 1.5 device px
  per CSS px, the shadow map 1,024 px, the post-processing at scale 1.0.
- **At 1x and at the eye level there is no shadow pass** (measured, §3.1: 0 shadow-map draw calls). The trees, scrub, roofs, spires, chimneys
  and houses are not drawn there (`app.js:1881-1889`, `syncLandscapeLayers`: `landscapeVisible()` is false at 1x and at the eye level, Stages 2B
  and 5E), the formations are footprints at 1x (decision 34), and nothing else casts a shadow.
- **The audit's P-1 is an inference, and it overstates.** P-1 took the figures as the 4x frame's triangles less the 1x frame's ("so about 2.29
  million are figures and standards"). Counted call by call (§3.1), the figures and standards are 1.23 million of the low Pratzen view's 2.48
  million (49.7%, both passes); the rest of the difference is the trees (0.81 million with their shadows), the scrub (0.20 million) and the
  buildings, which the 1x frame does not draw either. The finding's direction stands (the figures are the largest single item), its number does
  not; recorded for the owner (question 230), the audit not edited.

## 2. Item 1: measuring on real hardware (question 139)

### 2.1 What is known, and what is not (fact)

Every frame time this project has recorded is software WebGL: SwiftShader in headless Chromium on a 4-core container (`docs/FINAL_AUDIT.md`
§2.8, §5). No GPU frame time exists. Three properties of the build decide how a GPU measurement must be taken:

- **It renders on demand** (`app.js` `frameState`, `loop`): a frame is drawn while a tween, Play, recent input, a settling easing or a
  requested render is live; otherwise nothing is drawn. The developer readout's "frames drawn/s" (the ` key, `paintDevStats`) counts the frames
  drawn in the last half second: a still view reads near 0 and says nothing of what a frame costs. A frame time must be taken while the app
  draws every animation frame: while the camera moves, while the clock plays, or with the view kept drawing.
- **On a visitor's page it is not idle while the battle smokes.** Without `?harness=1`, `ambientNow()` (`app.js`) keeps drawing at the ambient
  rate (`AMBIENT_MS` 90: about 11 frames a second) whenever a formation's smoke or dust or a broken formation's sway is visible (read from
  the code). So the display's own refresh interval can only be measured with the app's loop paused (§2.2).
- **The phone takes a lighter path.** `lowTier` is set when the window is under 900 x 700 CSS px or the user agent names Android, iPhone, iPad
  or Mobile (`app.js:593-594`): the drawing buffer at most 1.5 device pixels per CSS pixel (2 otherwise), the shadow map 1,024 px (4,096 or
  2,048 otherwise), the post-processing's scale 1.0 (1.3 otherwise). An iPad on iPadOS reports a desktop user agent (inference, from Safari's
  documented default; not measured here) and so takes the desktop path at a large window.

### 2.2 The route (`tools/step6/perf-route.js`)

One script, run three ways (§2.3). It drives the build, unchanged, through `AUSTERLITZ_DEBUG.applyCase` (the harness's own entry) and the
app's own functions, over a fixed route. Each **segment** holds or moves one view for a fixed number of seconds; the first 0.5 s of each is the
warm-up (shader compiles, texture uploads), reported apart as `warm` (its longest frame).

| segment | view (harness case) | how it moves | seconds |
|---|---|---|---|
| idle | the Overview | the app's loop paused by the script: the display's own refresh interval R | 3 |
| overview held / orbit | the Overview vantage, 09:30, Watch (`overview-plan`) | held: kept drawing every frame (requestRender), the camera still; orbit: 20° a second about the target | 4 / 6 |
| pratzen-low-4x held / orbit | the low Pratzen view, 09:50, the 4x default (`pratzen-low`) | the same | 4 / 6 |
| pratzen-low-1x held / orbit | the same at 1x (`pratzen-low-1x`) | the same | 4 / 6 |
| pratzen-low-10x held / orbit | the same at 10.33x (`pratzen-low-10x`) | the same | 4 / 6 |
| ph8-overview held / orbit | phase 8, 14:40, the Overview, Watch (`ph8-overview-watch`) | the same | 4 / 6 |
| paper held / pan | the paper map as entered (`paper-north-up`) | pan: the centre round a circle of a fifth of the view's width, one turn in 6 s | 4 / 6 |
| eye held / look | eye level at the Zuran, 08:30 (`eye-zuran`) | look: the direction of view turned 20° a second about the eye | 4 / 6 |
| overview, pratzen-low-4x, ph8-overview: orbit -figures | as their orbit | the figures and standards hidden (their materials' `visible`, set by the script and restored) | 6 each |
| the same three: orbit -effects | as their orbit | Visual effects off (the visitor's own F toggle, `setFXEnabled(false)`) | 6 each |
| play-4x | 08:30, Watch, the Field camera, Follow on | Play at 4x under Follow | 12 |
| play-half | the same | Play at ½× (the default speed) under Follow | 12 |

**The brief's "ten clock minutes played at 4x" is a quarter of a second.** Play advances `MIN_PER_SEC × speed` clock minutes a second
(`app.js:2373`: 10), so at 4x ten clock minutes last 0.25 s plus any dwell: about 15 frames at 60 Hz, too few for a 95th percentile. The played
segments therefore run for 12 s of real time each from 08:30 and record the clock they covered (`clockFrom`, `clockTo`); at 4x that is about
three hours of the day with its dwells, at ½× about an hour. Recorded as a departure from the brief's wording, for the owner (question 216).

Per segment the report gives: frames, frames a second, the frame interval's median, 95th and 99th percentiles and maximum (ms), the share of
**long frames** (an interval above 1.5 R, a missed refresh), the warm-up's longest frame, the app's JavaScript time per drawn frame (median and
95th percentile: `loop()` timed by a wrapper the script sets and removes: the CPU side), the GPU's own time per drawn frame where the browser
offers WebGL2's timer query (`EXT_disjoint_timer_query_webgl2`: one query round `renderFrame()`; whether it is offered is reported, not
assumed; SwiftShader here offers it, §2.4), and the draw calls and triangles of a drawn frame (`renderer.info`, which the app
resets at each frame's start: every pass, the shadow map's included). Its head gives the device as the page sees it (user agent, the WebGL
vendor and renderer strings, cores, memory where offered, the screen, the viewport, the device pixel ratio and the ratio drawn, the buffer's
size, `lowTier`, effects and their scale, whether it runs in a frame), the page's own load (Navigation Timing), the build's SHA-256 and size
(fetched by the page) and the refresh interval. A JSON line, `AUS_PERF_JSON {...}`, carries everything for the record.

**How a frame time is read.** The interval between animation frames of the build's window is the frame time a visitor sees. A frame bound by
the GPU shows there too: the browser does not run the next animation frame until the GPU has taken the last (fact for Chrome and Safari's
compositors as they behave; it is how frame-rate meters in pages work). So: a long interval with a short JavaScript time is the GPU (or the
compositor); a JavaScript time near or above R is the CPU.

**What it does not change.** The build is opened as served, without `?harness=1` (a visitor's page: drift and smoke move). The script's own
changes are a wrapper on `loop()` and `renderFrame()` (removed at the end; the loop's wrapper skips the app's loop for the idle sample only, and
`renderFrame()`'s wraps the timer query where offered), the figure materials' `visible` flag in three diagnostic segments
(restored), `setFXEnabled` (the visitor's toggle, restored), the speed (put back to ½×) and the camera. Nothing is stored.

### 2.3 How the owner runs it

**What it needs.** A hosted copy of the repository's files as they are on `main` (the build, `austerlitz-command-map.html`, and
`tools/step6/perf-route.js` and `tools/step6/perf-run.html`), served over HTTPS from one origin. The wrapper page opens the build in a frame and
reads its window, which a browser allows only for the same origin; `file://` pages cannot be used on the phone and are refused that access by
Chrome. three.js still comes from cdnjs with its integrity hash (decision 133 (a)), so the devices need the internet.

Two ways to host, the owner's choice (publishing the build is an outward-facing act: the owner decides it):
- **GitHub Pages from the repository**: Settings → Pages → "Deploy from a branch", `main`, `/ (root)`. The pages are then at
  `https://<owner>.github.io/<repository>/austerlitz-command-map.html` and `.../tools/step6/perf-run.html`. Pages for a private repository need
  a paid GitHub plan, and a Pages site is public to anyone with its address (GitHub's documentation; not verified from here).
- **Any static host** (for example a drag-and-drop host): upload a folder holding `austerlitz-command-map.html` and `tools/step6/` with its
  two files, keeping that layout (the wrapper looks for the build at `../../austerlitz-command-map.html`; `?src=` names another path).

**The runs** (about 30 minutes in all; each run about 3.5 minutes, during which nothing may be touched):

| run | device and browser | how | why |
|---|---|---|---|
| L1 | the Windows laptop, Chrome or Edge, the window maximised, zoom 100%, plugged in | open the hosted build; wait for the first-run card; F12, Console; paste the whole of `perf-route.js` (Chrome asks to type "allow pasting" the first time); Enter; when "done" shows, type `copy(AUS_PERF.last.text)` and paste the report into a reply | the decision run (§3.4) |
| L2 | the same | after 2 minutes' rest, L1 again | repeatability: a drop must show in both |
| L3 | the same | open the hosted `tools/step6/perf-run.html`; Start; Copy | the frame's own cost on the same machine, so the phone's numbers (frame only) can be read against L1 |
| P1 | the iPhone, Safari, Low Power Mode off, Reduce Motion off (Settings → Accessibility → Motion), held upright | open the hosted `tools/step6/perf-run.html`; wait for "Press Start"; Start; keep the screen on and do not touch it; Copy (or Share to Notes or Mail) | the phone (decision 139's second machine) |
| P2 | the same | after 2 minutes' rest, P1 again | repeatability and heat |

Before L1: `chrome://gpu` (or `edge://gpu`) should say "WebGL: Hardware accelerated"; note the laptop's model and, if known, the GPU's name
(the report carries the browser's WebGL renderer string, which on Windows names the GPU through ANGLE). Safari reports "Apple GPU" only, so
the iPhone's model must be sent with P1. A Mac with Safari's Web Inspector is not needed: the wrapper shows the report on the phone. Android
Chrome would be run the same way (or pasted through `chrome://inspect` remote debugging over USB); the owner has an iPhone, so the protocol
names Safari.

**What to send back:** the five reports as pasted text (each begins "Austerlitz step 6 frame-time route"), the laptop's model, the iPhone's
model, and anything that happened during a run (a notification, the screen dimming, the fan).

### 2.4 Verified here, and what here cannot say

`tools/step6/perf-local.js` runs the route under Playwright: pasted into the build's page (`--way paste`) and through the wrapper page from a
local HTTP server (`--way frame`), at 1600 x 900 and as an iPhone (390 x 844, density 3, Safari's user agent: the build took its `lowTier` path,
drawn at 1.5, 585 x 1,266). Both ways ran end to end with no console warning or error. Its frame times are SwiftShader's (a frame takes
hundreds of milliseconds to seconds here) and decide nothing.

## 3. Item 2: the figures' level of detail (question 138; P-1)

### 3.1 The census (measured; hardware-independent)

`tools/step6/census.js` records every draw call of one whole frame where three issues it, in each of the harness's 24 non-fresh views and the
three views drawn at every factor at 1x and 10.33x as well (30 frames); the sum is checked against `renderer.info` for the same frame (equal in
every view: calls exactly; triangles to within the sprites' (at most 92 a frame), which the first run did not count and the committed script
does). The tables are `docs/step6-evidence/census.md`.

**At the 4x default every landscape view draws nearly the same frame**, 2.48-2.53 million triangles in 740-857 calls, from the Overview to the
close view of Sokolnitz: no figure block is culled (§0.2), and the trees (six instanced meshes), the scrub and the ground are each drawn whole
(instanced meshes are never culled in r128, and the ground is one mesh). At 1x and on the
paper map 0.20-0.24 million in 103-195 calls. At the eye level 0.49 million in 200 calls (the trees, scrub and buildings are not drawn at the eye level, Stage 5E,
and the observer's own side within about 500 m is hidden, `EYE.CLEAR_R`).

The low Pratzen view at 4x (`pratzen-low`), by what is drawn:

| what | world pass | shadow pass | together | share |
|---|---|---|---|---|
| men and horses (the figure kit) | 611.5 k in 216 calls | 611.5 k in 216 calls | 1.22 M | 49.4% |
| trees (6 instanced meshes, 1,194 trees) | 404.0 k | 404.0 k | 0.81 M | 32.6% |
| scrub (556) | 200.2 k | none (does not cast) | 0.20 M | 8.1% |
| the ground (one mesh) | 134.4 k | none | 0.13 M | 5.4% |
| roads, streams, banks (draped) | 65.4 k | none | 0.07 M | 2.6% |
| standards | 4.3 k in 71 calls | 4.0 k in 44 calls | 8.3 k | 0.3% |
| guns and gear | 1.1 k | 1.1 k | 2.2 k | 0.1% |
| houses, roofs, chimneys, spires | | | 8.7 k | 0.4% |
| everything else (marks, arrows, sky, smoke, trails, pads, post-processing) | | | | about 1% |
| **the frame** | **1.45 M in 473 calls** | **1.03 M in 278 calls** | **2.48 M in 758 calls** (the post-processing's 7 among them) | |

**The figures' size on screen decides what a level of detail can save.** A man's height on screen (CSS px at 1600 x 900), world pass:

| view | figure triangles, world pass | a man under 2 px | 2-4 px | 4-8 px | 8-16 px | 16 px or more |
|---|---|---|---|---|---|---|
| the Overview (`overview-plan`) | 628 k | 566 k | 67 k | | 0.7 k | |
| phase 8, the Overview (`ph8-overview-watch`) | 617 k | 527 k | 94 k | 0.4 k | 1.3 k | |
| the Field vantage (`overview-field`) | 628 k | | 2.0 k | 2.3 k | 622 k | 6.8 k |
| the low Pratzen view (`pratzen-low`) | 612 k | | 0.7 k | 0.3 k | 0.9 k | 615 k |
| close on Sokolnitz (`close-sokolnitz`) | 605 k | | 0.9 k | 0.7 k | 1.9 k | 607 k |
| the eye level (`eye-zuran`) | 132 k | | | 0.2 k | 0.1 k | 97 k |

(rows may not sum exactly: a mesh whose first man is behind the eye has no size and is not banded.)

So: from the Overview nine tenths of the figures' triangles draw men under 2 px tall, which no one can see as men; in the Field vantage
they are 8-16 px; in the low and close views 16 px or more, everywhere, because every block, near or far, is drawn many times life size
(decisions 6, 14) and the far ones are still large. A level of detail keyed to a man's size on screen would save most of the figures in the
Overview and almost none in the low views.

**Draw calls.** The figures take 556-585 of the 740-857 calls at 4x (both passes), in 36-37 distinct geometries and textures per pass (71-73
counting both): instancing across blocks would draw them in about 73 calls.

### 3.2 The options, prototyped and measured (`tools/step6/lod-probe.js`)

Each option is built in the live scene by the probe (the build unchanged), one frame drawn and counted (`renderer.info`, every pass), a
screenshot compared with the unmodified frame (the share of the free rectangle's pixels that change by more than 8 of 255, `__s5.diff`, as
Stage 5's probes compare), then undone; the frame after undoing was checked equal to the first in calls and triangles every time. "Far" is
decided per block by a man's height on screen (1.8 kit units at its first instance, CSS px at 1600 x 900): P = 4 px. Five views: the two
Overviews (most men under 2 px), the Field vantage (8-16 px), the low Pratzen view and the close view of Sokolnitz (16 px or more). The world
pass's JavaScript time was recorded and found too noisy under software WebGL to compare (from 2 to 4,208 ms for frames of one view); it is not used.

| option | the Overview (`overview-plan`, 2.52 M, 832 calls) | phase 8, the Overview | the Field vantage | the low Pratzen view (2.48 M, 758 calls) | close on Sokolnitz | pixels changed (the Overview / low Pratzen) |
|---|---|---|---|---|---|---|
| **blocks** beyond 4 px: one box per drawn unit (31 blocks, 195 boxes) | 1.27 M (-49.7%), 364 calls | 1.28 M (-48.8%), 361 | no block far: unchanged | no block far: unchanged | unchanged | 2.6% / 0 |
| **thin** beyond 4 px: every 4th man | 1.63 M (-35.5%), 832 calls | 1.61 M (-35.8%) | unchanged | unchanged | unchanged | 0.6% / 0 |
| **noshadow** beyond 4 px | 1.89 M (-25.1%), 553 calls | 1.88 M (-24.7%), 540 | unchanged | unchanged | unchanged | 0.2% / 0 |
| **noshadow** for every block | 1.89 M (-25.1%), 553 | 1.88 M (-24.7%), 540 | 1.89 M (-25.1%), 553 | 1.86 M (-24.9%), 490 | 1.87 M (-24.6%), 516 | 0.2% / 1.0% (Field 0.4%, close 0%) |
| **merge** (instancing across blocks: 303 meshes into 39) | 2.52 M (0%), **327 calls** | 2.50 M, 316 | 2.52 M, 327 | 2.48 M, **273 calls** | 2.48 M, 304 | 0.02% / 0.02% (the same picture) |
| **blocks + noshadow** beyond 4 px | 1.27 M (-49.8%), 320 calls | 1.28 M (-49.0%), 317 | unchanged | unchanged | unchanged | 2.6% / 0 |
| **culling** by each block's bounds (measured, not built: the figure meshes none of whose men is in the view, world pass) | 0 of 303 | 0 of 298 | 0 of 303 | **179 of 293 meshes, 339 k triangles** (55% of the figures' world pass) | **159 of 289, 293 k** | none (nothing in view is removed) |

**What it says.**
- **No size-keyed option touches the low or close views**: at the 4x default every man there is 16 px or more, near or far (the scale
  convention). In the Overviews, a far form halves the frame.
- **Shadows**: the figures' shadow pass is a quarter of every 4x frame, and dropping it changes at most 1% of the free rectangle's pixels at
  this resolution (the low Pratzen view; none close on Sokolnitz, where the blocks' shadows fall under other blocks). It is the one figure
  lever that reaches every view.
- **Culling** would skip about half the figures' world-pass triangles in the low and close views (339 k and 293 k), with nothing on screen
  changing; the shadow pass would cull by the light's frustum, not the eye's (three does so for meshes that allow culling), so shadows cast
  into the view by blocks outside it stay.
- **Merging** cuts the draw calls by 60-64% (832 to 327, 758 to 273) and changes nothing drawn; triangles are unchanged, so it helps only
  where the draw calls, not the triangles, are what costs: on the CPU side, which item 1's JavaScript times show.
- **The far form changes how the Overview reads.** Each box takes its unit's coat colour as the men do (the classes' settled coats, decision
  97): the Russian battalions' green and the Austrians' white become solid fields where the men's coats were specks over the sides' blue and
  amber ground marks (`docs/step6-evidence/lod/overview-plan-blocks_4px.png` against `-base.png`). The colours are the claims' own, so
  nothing false is drawn, but a far green block over an amber ground mark weakens the side's cue at a glance (decision 107's concern). A far
  form in the side's symbol colour would read as today but would draw a colour no claim gives a coat; a far form with no colour of its own
  (the ground mark alone, the men simply not drawn below P) is a fourth option the probe did not build: by the census its frame would be the Overview's 2.52 M less its figures' 1.27 M (computed, not drawn). Question 219.
- **Thinning** keeps the look closest (0.6% of pixels) for 36%.

### 3.3 What each option does to the claims and to the checks

**The rule each must keep** (decisions 97-110, `docs/STAGE6_SPEC.md`): what is drawn is what `appearance.js` settles, a value drawn only where
a claim graded A or B settles it, else generic; each drawn battalion or squadron takes a class in its recorded share (decision 100); the
standards follow `COLOURS_CARRIED` (who carries them, how many, the painting, the proportion, the ratio, decision 106); the side cue under every
formation drawn as figures (decision 107). The scale convention (decisions 6, 14) and the 1x footprints (decision 34) are not touched by any
option.

| option | what is then drawn, against the claims | what the self-test reads today (its checks, `app.js`) | what it would then have to check | the claims at risk |
|---|---|---|---|---|
| **blocks** (beyond P, one box per drawn unit) | each far unit a box in the mean of its men's coat colours: the class's settled coat, or the nation's symbol colour where the table does not settle it (as the men); no headgear, legwear, cuirass or horse colour, which below P are under a pixel; the units are the same units, so decision 100's shares hold by construction; standards unchanged | 6C "figures: every figure drawn as its class's claims say" and "each drawn battalion ... takes a class in proportion" read each block's `ud.dress` records, their meshes' instance colours and geometries; "figures: every visible man, horse and standard stands on the drawn ground" reads `figureError()` over the kit's meshes; the legend's figure rows; decision 107's side cue | the same two 6C checks over the near form, unchanged, **and** over the far form: one box per drawn unit of each class, its colour the class's coat (or the nation's) within the jitter band, no box for a unit not drawn; the far form seated (each box's footprint on the drawn ground within the 0.02 units the men are held to: a box spanning a battalion's frontage on the 10.33x relief's slopes cannot be, so the far form must follow the ground, a draped quad or one box per file); the switch between forms at P on screen, at 1x, 4x and 10.33x; the legend's figure row still true (it says "figures": a far box is a symbol of the same figures) | the far form's colour must be the near form's (never a new colour); a unit's box must never stand where its men would not (the seating) |
| **thin** (beyond P, every k-th man) | the same classes, fewer men per unit: the share of each class kept (each class's mesh thinned alike); the men per unit is a layout value (`kitBlock`'s files and ranks), not a claim; standards unchanged | as above | the two 6C checks unchanged (they read the class records, whose units do not change); the men drawn per unit stated as a design value; the seating check reads the thinned men (unchanged code path) | none known: no claim counts men per unit |
| **noshadow** (beyond P, or every block) | the figures exactly as now, without their shadow beyond P | no self-test check reads which objects cast shadows (4B's light checks read the shadow box's fit, not the casters) | a check that a block beyond P casts none and one within casts | none (a shadow is light, not a claim); visually the far blocks lose their contact with the ground (§3.2's pixel share) |
| **merge** (instancing across blocks) | identical (§3.2 measures it) | every 6C and 6D check reads per-block meshes (`ud.dress[].meshes`, `ud.figs`, `ud.seat`, `ud.poles`, `ud.flagMeshes`, `ud.finials`); `layoutFigs` and `placeStandards` write per-block instance matrices whenever a block moves or redeploys | every one of those checks rewritten to read the merged buffers through a block-to-range index, equally strictly; the per-frame cost of copying moved blocks' matrices into the merged buffers measured (a CPU cost the GPU saving must exceed) | none in what is drawn; the risk is in the code: the 6C/6D paths are the most checked in the build, and every one would be touched |

**Culling** is not an option of the brief's, but the census makes it one (§0.2: no block is ever culled): culling each block by its own bounds
(a sphere round its men, kept as it moves) changes nothing drawn on screen and nothing the self-test reads (it reads blocks, not what the GPU
was sent). §3.2 measures what it would skip.

### 3.4 The rule that decides question 138, stated before the measurement

Decision 138 builds the level of detail "if an ordinary integrated GPU drops frames in the Overview or the low views, else" retires it. Read
literally, a drop caused by something the level of detail does not touch (the shadow map, the trees, the post-processing's fill) would build
a level of detail that does not cure it. The rule below therefore asks two things of the laptop's runs: whether frames drop, and whether the
figures are what drops them. It is applied to the laptop's runs L1 and L2 (§2.3) by the analysis after them, mechanically; the phone's runs do
not decide 138 (decision 138 names an integrated GPU; the phone's numbers go to question 222).

**Definitions** (from the report; R is the run's measured refresh interval):
- a segment **drops frames** when more than 5% of its frames are long (an interval above 1.5 R), or its 95th percentile is above 1.5 R;
- the **decisive segments**: `overview` orbit, `ph8-overview` orbit (the Overview), `pratzen-low-4x` orbit and `pratzen-low-10x` orbit (the low
  views), and `play-4x` and `play-half` (the clock played under Follow, which moves the camera between those views);
- a drop is **the figures'** when, in the same view, the `orbit -figures` segment does not drop frames, or its share of long frames is at most
  half the `orbit` segment's (for `pratzen-low-10x`, the 4x view's diagnostic: the same view, its relief drawn taller; for a played segment, the view it spends most of its time in: the report's camera is not recorded per frame, so the
  played segments count as the figures' only if the Overview's or the low views' diagnostics do).

**The rule:**
1. If no decisive segment drops frames in both L1 and L2: **138 is retired** (the item closes; nothing is built; recorded in the roadmap).
2. If one or more drops frames in both runs and the drop is the figures' in at least one of them: **138 is built**, its form chosen by
   question 219 against §3.2's measures: first what reaches every view and changes least on screen (no figure shadows, culling by the
   blocks' bounds), the laptop measured again, then a far form only for a view that still drops (in the Overview, where most men are under
   4 px; no size-keyed form helps the low views, where every man is 16 px or more).
3. If frames drop in both runs but the figures' diagnostic does not cure it: **138 is retired as a level of detail**, and what the other
   diagnostics show is put to the owner as a new question (question 220): `orbit -effects` curing it points at the post-processing (its 1.3
   scale renders 1.69 times the screen's pixels on a laptop); neither curing it points at the shadow map, the trees or the fill; a JavaScript time
   near or above R points at the CPU.
4. A drop in one run only is reported and not counted (heat, a notification, a background task); if L1 and L2 disagree on a decisive segment,
   a third run (L1 again) settles that segment by two of three.

The thresholds (5%, 1.5 R) are design values chosen for this rule: at 60 Hz, 5% is three missed frames a second, the point at which a pan is
visibly uneven (inference: no study was read for it); 1.5 R is the first interval that is a missed refresh rather than jitter.

## 4. Item 3: a phone layout (question 137; A-4)

### 4.1 How the phone screens were measured

`tools/step6/phone-probe.js` opens the build as the harness does (`?harness=1`, software WebGL, `tools/visual/measure.js` and the Stage 5
helpers injected, CSS transitions off), but in a Playwright context with touch, the device's pixel ratio and a phone's user agent, so the
build takes its `lowTier` path as on the phone:

| size (CSS px) | density | user agent | stands for |
|---|---|---|---|
| 360 x 800 | 3 | Android Chrome | a 360 px Android phone (Galaxy S20-S24 class) |
| 390 x 844 | 3 | iPhone Safari | iPhone 12-15 |
| 412 x 915 | 2.625 | Android Chrome | Pixel 7 class |
| 430 x 932 | 3 | iPhone Safari | iPhone 14-15 Plus and Pro Max |
| 844 x 390 | 3 | iPhone Safari | iPhone 12-15 held landscape |

The sizes are the full CSS viewport. In Safari the address and tool bars take part of it, so a visitor's visible height is less: the route's
report (§2) records the iPhone's own `innerWidth` x `innerHeight` in its "viewport" line, and question 229 asks whether the phone cases use
it. It is Chromium throughout: Safari's layout, its font metrics (step 1's hand-on) and real touch are not here (§6).

Eight states, each on a fresh page, reached by real taps (Playwright's `tap`, touch events) where a control exists; after each tap the probe
checks the state was reached and, if a tap did not take, reaches it by the app's own function and says so in the state's note (no state
needed it in the runs recorded: every state of every layout was reached by its taps); the dossier is opened by `select("f","sthilaire")`, as a tap on its counter does:
`first` (untouched: 04:00, the first-run card), `explore` (after "Explore on my own", the clock set to 09:30), `panels`, `dossier`, `watch`,
`layers`, `paper` (the paper map, from the Layers panel, closed again) and `tour` (the guided tour's first stop).

Per state:
- **unobstructed**: the share of the screen no interface panel covers (`measure.js` `unobstructed()`, the harness's own measure: the rail, the
  dispatch, the legend, the timeline, the tools, the presentation switch, the first-run card, the dossier, the tour bar, the chip, the Layers
  panel, the sightline badge);
- **timeline**: its height (`measure.js` `timeline()`);
- **cut**: an element's own text clipped by its box (an ellipsis, or overflow hidden), or its box partly off the screen; text wholly off the
  screen (a closed panel slid away) is counted apart and not as cut;
- **2.5.8**: every control that takes a press, its box against 24 x 24 px or WCAG 2.5.8's spacing exception (a 24 px circle on its centre
  meeting no other target); the act bands take no press (decision 166 (a)) and are not counted; the event markers are counted apart (decision
  167: 2.5.8's essential exception); **44**: the same boxes against 44 x 44 px (WCAG 2.5.5, AAA, and the size Apple's guidelines give);
- **covered**: a control whose centre another element stands over (a tap there reaches the other);
- **overlaps**: interface panels whose boxes overlap one another;
- **not on screen**: the features with no control on the screen and on top at any of nine points of its box (the transport, the clock's
  rail, the phases, the presentation switch, Layers, the paper map, Panels, Follow, the vantages, "?", the sources, the tour, the event
  markers, the Eyes button, the four speed buttons); "hidden" means the control exists but is not shown in that state (the sources' button
  is in the rail, so "hidden" until Panels is pressed);
- **contrast**: every visible text by `check:contrast`'s own method (its `COLLECT` and its judging, read from `tools/visual/contrast.js` by the
  probe, not copied: the computed colour over the stack of translucent backgrounds, composited over the theme's two backdrops, map text also
  over black and white; AA, 4.5:1, or 3:1 from 18 px or 14 px bold), and the 10.5 px floor (computed sizes); and the map layer's labels as
  rendered (`measure.js` `textContrast` on a screenshot at CSS scale, as the harness reads them). The interface measure is the one that does
  not depend on the device's density (it reads computed styles).

**A false start, recorded.** The first run lost taps: the probe gave each tap 5 s, and Playwright taps only once the element has stood still
for two animation frames, which under software WebGL at density 3 take seconds each. Its Panels, Layers, Paper map and (at 390 px and wider)
Watch states were the "explore" state over again. The probe now waits up to 90 s, records a tap that still fails, and checks each state; the
first run's JSON is superseded by the second.

### 4.2 Today, measured (fact; `docs/step6-evidence/phone.md`, `phone-current.json`; screenshots `phone/current-*.png`)

| state | 360 x 800 | 390 x 844 | 412 x 915 | 430 x 932 | 844 x 390 |
|---|---|---|---|---|---|
| the timeline's height (px) | 172 | 174 | 174 | 174 | 90.5 |
| unobstructed: the first screen (the card open) | 0.41 | 0.44 | 0.50 | 0.51 | 0.39 |
| after "Explore on my own" | 0.19 | 0.20 | 0.19 | 0.19 | 0.69 |
| the Panels (the rail) open | 0.15 | 0.19 | 0.23 | 0.25 | 0.44 |
| a dossier open | **0.03** | **0.04** | **0.04** | **0.05** | 0.37 |
| Watch | 0.74 | 0.79 | 0.80 | 0.81 | 0.77 |
| the Layers panel open | 0.13 | 0.13 | 0.12 | 0.12 | 0.56 |
| the tour's first stop | 0.37 | 0.42 | 0.48 | 0.49 | 0.41 |

(`narrow-390`, the harness's case at density 1, holds the first screen at [0.438, 0.507]: the probe's 0.4388 at density 3 with touch agrees.)

What the five sizes show (the 390 x 844 screenshots are named; every size alike unless said):
- **The timeline takes 172-174 px** in portrait (20-21% of the height), 178 px in Watch (212 px at 360 wide), 90.5 px held landscape. Its
  control row wraps into three rows below 720 px (the transport; the clock, the caption and the Eyes button; "?" and the speeds).
- **Cut text, every portrait size**: the five act names ("The De…", "Th…"), eight of the ten phase names, and the caption's event
  ("Friant retakes Telnitz, then lo…"); with the rail open, its tab row ("Command Plans" runs into the edge, `current-*-panels.png`) and the
  order of battle's longest rows; with a dossier open, the tools (pushed left by the dossier's rule, `body.drawer-open .tools`) cut at the
  left edge (`current-390x844-dossier.png`).
- **Overlaps**: the tools' column stands over the dispatch card after "Explore" at every portrait size (173 x 76 px at 390); the rail under the
  tools (99 x 160) and the presentation switch (161 x 34); a dossier under the dispatch card (307 x 520 at 390) and under the presentation
  switch (168 x 34); the Layers panel over the dispatch card and the tools (it is 58% of the screen's height at 430 x 932). Held landscape,
  the first-run card under the tools (173 x 43).
- **Targets**: no control that takes a press reaches 44 x 44 px but the clock's rail across its width (the transport's buttons are 42 x 38,
  the tools 28 px tall, the speeds 26-31 x 30, "?" 32 x 32): the 44 px size is met by none. Under 2.5.8's 24 px: [pending: the corrected count;
  the three 45-minute phases fail by width at every portrait size, 18-22 px], and the 25 event markers (11-14 px, decision 167's exception).
- **Not on screen**: with the card open, Panels (hidden by its own rule while the card stands, `body.firstrun-on`); the sources' button lives
  in the rail, hidden until Panels; with a dossier open at 390 px, the tour's button pushed off the screen; in Watch, the tools by design.
- **Contrast**: the map labels as rendered, none below AA in any state at any size; the interface text by check:contrast's method, [pending].

**What A-4 said, checked.** "the timeline is 174 px tall (17% of the height) ... its act and phase labels are cut ... the caption is cut ...
the card covers most of the map (46.0% unobstructed)". Measured now at 390 x 844: 174 px (20.6% of 844; 17% is 174 of 1,024, inference: the
audit's percentage looks computed against another height), the labels and caption cut as it says, 43.9% unobstructed (46.0% was the audit's
build; decision 146 re-measured `narrow-390` to [0.438, 0.507] since). A-4 named the first screen only; after "Explore" the free share falls to
0.19-0.20 and with a dossier to 0.03-0.05, which A-4 did not measure.

### 4.3 The prototypes (design values for measurement, not proposals of the words)

Three layouts, each adding to the one before (`tools/step6/phone-layouts.js`; injected by the probe into the started page; the build's own
words throughout; two new control names are placeholders: "Menu" and the grip's "Open the card", question 227):

1. **compact** (below 720 px wide only): the timeline in two rows and a track of 48 px: the transport without its ten-minute steps (event
   back, Play, event forward, Follow), the clock, the speed as one button stepping through the build's four (its words), then the caption with
   "?" beside it; the track without the act row and without the phase labels (each phase keeps its accessible name, as a button 24 px tall);
   the Eyes button leaves the timeline ("Whose eyes?" stays in the Command tab).
2. **sheets** (any phone size): compact, and across the foot of the screen above the timeline: the dispatch card collapsed to 22% of the
   height with a grip that opens it to 60%; the dossier at 55%; the rail at 60%; the first-run card at most 50%; each scrolling inside.
3. **menu**: sheets, and the tools and the presentation switch (outside Watch) behind one "Menu" button, 44 px, at the top right; a press on
   any tool closes it (heard in the capture phase: the Layers button stops its click, `app.js:5766`).

### 4.4 The prototypes, measured

| layout, 390 x 844 | timeline | first screen | after "Explore" | Panels | a dossier | Watch | Layers | the tour | overlaps | 2.5.8 (but markers) |
|---|---|---|---|---|---|---|---|---|---|---|
| today | 174 | 0.44 | 0.20 | 0.19 | 0.04 | 0.79 | 0.13 | 0.42 | tools/dispatch; rail/tools, rail/switch; dossier/dispatch, dossier/switch; Layers/dispatch, Layers/tools | [pending] |
| compact | **127** | 0.49 | 0.21 | | | 0.81 (163 px) | | | tools/dispatch | 3 (the 45-minute phases) |
| sheets | 127 | 0.51 | **0.52** | 0.14 | **0.28** | | | | dossier/dispatch (both sheets) | 3 |
| menu | 127 | **0.59** | **0.63** | 0.26 | **0.31** | 0.79 (175 px) | [pending] | 0.59 | dossier/dispatch | 3 |

At the other portrait sizes alike (`phone.md`): after "Explore", today 0.19-0.20, sheets 0.50-0.56, menu 0.62-0.65; a dossier, today
0.03-0.05, sheets 0.26-0.29, menu 0.29-0.32. Held landscape (844 x 390) the sheets make it worse: a dossier 0.37 today, 0.18 as a sheet,
0.22 with the menu; the Panels 0.44 today, 0.15 and 0.17: **landscape keeps today's side panels** (question 226).

What the prototypes leave open, measured:
- **The phases.** On a proportional time axis (decision 53: one axis, proportional to time) the three 45-minute phases (08:00-08:45,
  08:45-09:30, 10:30-11:15) are 45/840 of the track: 18.4 px at 360, 20 at 390, 21.2 at 412, 22.2 at 430. No styling of the track makes them
  24 px while the axis stays proportional and the phases stay presses on it. Question 224.
- **Watch's timeline grows** (163-175 px) when the presentation switch joins the control row: one more row. The Menu could hold the switch
  in Watch too; not built.
- **Two sheets at once**: the dispatch card's sheet stays under an open dossier's (390 x 186 px); a rule would hide it while a dossier is open,
  as the build does today only beside the rail (`style.css`, SW-2).
- **The rail as a sheet** covers more than the rail did (Panels 0.13-0.18 against 0.15-0.25 today): its tab row and the order of battle want
  the height; a phone may want the rail's tabs as full-screen pages instead. Not built.
- **The dossier's rule that slides the tools aside** (`body.drawer-open .tools`) pushes them off the left edge under sheets; the menu
  removes the problem.

### 4.5 What check:visual and check:contrast would need

Today one case is phone-sized: `narrow-390` (decision 122), at density 1 with a desktop user agent and no touch, the first screen only, its
timeline recorded, not held. A phone layout would make phones a supported layout, so the checks would hold it:

**The harness (`tools/visual/harness.js`, `cases.js`, `thresholds.js`).**
- **A device per case**: `cases.js` gains an optional `device` ({density, touch, mobile user agent}); `harness.js` opens such a case in a
  context with them (as `phone-probe.js` does), its screenshot taken at CSS scale for the text measures. Today every page is density 1
  (`harness.js:44`).
- **The cases** (each a fresh page reached by real taps, as the 7B and 7C cases are): `phone-390-first`, `phone-390-explore`,
  `phone-390-dossier`, `phone-390-watch`, `phone-390-layers`, `phone-360-explore` (the narrowest), `phone-430-explore` (the widest portrait),
  `phone-844x390-explore` (held landscape); with question 229, a 390 case at the height the iPhone's report gives. `narrow-390` stays as it is
  (decision 122's record) or is replaced by `phone-390-first`, the owner's word.
- **Their limits**, each measured once on the build that adds the layout and set on the owner's word (as decisions 121, 141, 146 did; none
  is set here, and no existing limit moves): an `UNOBSTRUCTED` baseline per case; a `DROP_LIMIT` per case; the timeline's height held to a
  ceiling per size (today's 92 px holds only from 1024 px); and four new zero-limits, every one a check of the page as the visitor sees it:
  no control that takes a press under 24 x 24 px without 2.5.8's spacing exception (the event markers excepted, decision 167; the phases, §4.4,
  need the owner's answer to question 224 first); no text cut but where the layout means it to be (a list the case names, each with its
  reason, as `LANG_ALLOW` names its entries); no two interface panels overlapping; every feature on the screen or one named control away
  (the reach list of §4.1, each "hidden" naming the control that shows it).
- **The self-test**: the layout's own checks (the sheets' heights, the Menu's focus order and Esc, the dispatch sheet's grip, decision 165's
  dossier stopped above the timeline), as 3B's and 7B's were added.

**The contrast check (`tools/visual/contrast.js`).** Today its 35 states are at 1600 x 900 (`contrast.js:189`), with the start-up cases on
their own pages. It would gain a second page at 390 x 844 (density 3, touch, the mobile user agent) with the phone states: the first screen,
explore, the dossier, Watch, the Layers panel, the paper map, the tour, the Menu open, the dispatch sheet open; every text element at AA and
the 10.5 px floor, as now. The density-3 screenshot is read at CSS scale; whether that lowers a thin glyph's measured contrast (§4.1) is
measured when the cases are added, and the measure's method stated then.

**The suites.** `css-test.js` would check the phone rules as it checks the others (the colours in the tokens, no duplicate rule per media
block, the controls' sizes where the CSS sets them). `runtime-test.js` would dry-run the Menu and the sheets' grips.

### 4.6 The phone's own drawing

On the phone the build draws less than on the laptop (`lowTier`, §2.1): at most 1.5 device pixels per CSS pixel (an iPhone's 390 x 844 at
density 3 is drawn into 585 x 1,266, against 1,170 x 2,532 at full density), the shadow map 1,024 px, the post-processing at scale 1.0. The
triangles are the same as the laptop's (the census's 2.5 million at 4x: `lowTier` changes no geometry). Whether that is enough is the phone's
runs' to say (P1, P2), and question 222 waits on them. The route ran here as an iPhone through the frame (§2.4); its numbers are software
WebGL.

## 5. The order of the items, and the time each takes

Item 1 decides item 2 (decision 138) and informs item 3 only through question 222 (whether a phone also needs a lighter drawing). Item 3's
layout needs no GPU number: what is cut, covered or too small on a phone is measured here already. So the order recommended is the brief's,
1, then 2 or its retirement, then 3, with one allowance: item 3's Part B may begin while item 1 waits on the owner's devices (question 215).

The time each takes, estimated (inference: from the size of the stages this project has run, not measured; a "session" is one working
session of the kind each roadmap step took):

| item | the owner's part | the work after it | estimate |
|---|---|---|---|
| 1 | host a copy (10-30 minutes, once); five runs of about 3.5 minutes with rests (about 30 minutes); paste the reports back | read the reports against §3.4's rule and record the result (a records-only commit: `CHANGELOG.md`, `docs/ROADMAP.md`, the reports in `docs/step6-evidence/`) | under one session |
| 2, retired | none | the records only (with item 1's commit) | none further |
| 2, built: culling only (question 221) | none | each block culled by its own bounds, kept as it moves; the shadow pass by the light's frustum; a self-test check; measured | one session |
| 2, built: a far form (blocks or thinning) with no shadow beyond P | the form's look (screenshots to approve) | the far form, its seating on the drawn ground at every factor, its colour checks against the classes (§3.3), the switch at P, the harness's figure measures re-run; measured against item 1's numbers on the owner's laptop again | two to three sessions |
| 2, built: instancing across blocks | none | every 6C and 6D check rewritten to read merged buffers (§3.3); not recommended (§3.2) | three or more sessions |
| 3 | the answers to questions 223-229; screenshots to approve | the layout (compact timeline, sheets, Menu, the phases), the cases and limits of §4.5 measured once on its build and set on the owner's word, the contrast states, the self-test's checks, a screen-reader pass on a phone if the owner can run one (VoiceOver) | three to four sessions, as Stage 3B's docked panels with 3C's timeline were |

## 6. What was not verified, and why

- **Any GPU frame time.** The container has no GPU; every frame time here is software WebGL, a frame taking hundreds of milliseconds to
  seconds, and decides nothing. Item 1 exists for this.
- **Safari.** The harness and the probes are Chromium; the iPhone's layout, fonts (Safari is believed to ignore the faces' metric overrides,
  step 1's hand-on) and Safari's toolbars are not here. The route's report carries the iPhone's own viewport.
- **Real touch.** Playwright's taps are touch events, not fingers; gestures (pinch, two-finger turn) were not exercised.
- **The world pass's time under each level-of-detail option** (§3.2): measured here as JavaScript time and found too noisy to compare; the
  counts are exact, the time is the laptop's to give.
- **The hosted copy.** Not made: publishing the build is the owner's act (question 217). `perf-run.html` was run here from a local HTTP
  server, the same files, the same layout.
- **What a level of detail looks like in motion.** The probe compares still frames; the switch between forms as the camera moves (popping)
  is for a Part B to measure.

## 7. Questions for the owner (from 215)

Each with options, a recommendation and what it costs. Nothing is built until they are answered.

**215. The order of the three items.**
(a) 1, then 2 or its retirement by §3.4's rule, then 3, item 3's Part B free to begin while item 1 waits on the devices; (b) strictly one after
another, 3 only after 2 is closed; (c) 3 first. **Recommended: (a).** Item 3 needs no GPU number but question 222's, and item 1 needs only the
owner's half hour. Cost: none beyond the items'; (b) delays the phone layout by item 2's sessions if 2 is built.

**216. The played segments.** The brief asked for "ten clock minutes played at 4x"; at 4x that is a quarter of a second (§2.2).
(a) as built: 12 s of real time at 4x and at ½x from 08:30, the clock covered recorded; (b) ten clock minutes at ½x (2 s, about 120 frames at
60 Hz); (c) both (a) and (b). **Recommended: (a)**: enough frames for a 99th percentile in each, and ½x is the visitor's default speed. Cost:
none (built); (c) adds 2 s to each run.

**217. The hosted copy.** (a) GitHub Pages from the repository (public to anyone with the address; a private repository needs a paid plan);
(b) another static host the owner uses, the two files kept in their folders; (c) no hosted copy: the laptop runs from a local server
(`python -m http.server` in the repository) and the phone is not measured, decision 139 half done. **Recommended: (a) or (b), the owner's
choice**; it can be taken down after the runs. Cost: 10-30 minutes once; the build is then public while it stands.

**218. The rule that decides 138** (§3.4). (a) as stated: built only if a decisive segment drops frames (more than 5% long frames, or a 95th
percentile above 1.5 R) in both laptop runs and hiding the figures cures it; (b) stricter: any decisive segment over 1% long frames; (c)
looser: the Overview only. **Recommended: (a).** It asks the measurement two things, whether frames drop and whether the figures are why, so a
level of detail is built only where it can help. Cost: none now; (b) would build on drops a visitor barely sees.

**219. If 138 is built, which form.** Measured (§3.2): in the Overview, a box per unit beyond 4 px halves the frame (2.6% of the pixels
change, and green and white blocks become fields of colour); every fourth man saves 36% (0.6%); no figure shadow saves 25% in every 4x view
(at most 1%); not drawing the men beyond 4 px at all (the ground mark alone) would save about half, computed, not built. Options: (a) no
figure shadows anywhere, and culling (question 221), first; then measure the laptop again and add (b) only if it still drops; (b) thinning
beyond 4 px; (c) boxes beyond 4 px in the coats' colours; (d) the men not drawn beyond 4 px. **Recommended: (a), then (b) if needed.** They
reach the low views (where 138's drops would matter most and no size-keyed form helps) and change least on screen; neither draws anything
the claims do not settle. Cost: (a) one session; (b) one more, with the seating checks (§3.3); (c) and (d) change how the Overview reads (the
side's cue, decision 107) and want screenshots approved.

**220. If frames drop but the figures are not why** (§3.4, rule 3). (a) record it and stop: no performance work; (b) a performance step on
the lever the diagnostics name (the post-processing's scale, the shadow map, the trees, the fill), with its own Part A; (c) build the level of
detail anyway. **Recommended: (b)**, its Part A to measure the lever on the owner's laptop before anything is changed (decision 139's rule).
Cost: a Part A session; nothing built without its own decision.

**221. Culling the blocks** (§0.2, §3.2): no figure block is ever culled; in the low and close views about half the figures' world-pass
triangles (339 k, 293 k) are drawn out of view. (a) a small change of its own, whatever 138 decides: each block culled by its own bounds,
kept as it moves, nothing on screen changing; (b) only as part of a built 138; (c) leave it. **Recommended: (b) unless item 1 shows the low
views dropping frames**, then (a) first: a change to the draw path is performance work, and decision 139 puts the measurement before it.
Cost: one session; the self-test gains a check that every block in the view is drawn.

**222. The phone's own drawing.** If the iPhone's runs drop frames: (a) the phone layout only, the drawing unchanged; (b) a lighter drawing
on phones as well (effects off by default, no shadows, or a lower density than `lowTier`'s 1.5), each measured on the phone; (c) decide after
the phone's runs. **Recommended: (c).** Cost: none now.

**223. The phone layout's parts** (§4.3-§4.4). (a) all three: the compact timeline, the sheets (portrait only), the controls behind a Menu;
(b) the compact timeline and the sheets, the tools kept as they are; (c) the compact timeline only. **Recommended: (a)**: after "Explore" the
map's free share goes from 0.19-0.20 to 0.62-0.65, with a dossier from 0.03-0.05 to 0.29-0.32, and the overlaps of today go but the two
sheets' (to be ruled). Cost: three to four sessions with the cases of §4.5 (§5).

**224. The phases on a phone.** On a proportional axis the three 45-minute phases are 18-22 px wide (§4.4), under 2.5.8. (a) on a phone, the
phases leave the axis as presses: the axis keeps their ticks and the act and phase in the caption, and the phases become a list in the
dispatch sheet (or a "phase" stepper beside Play); (b) a phone axis not proportional to time, every phase at least 24 px (against decision
53's one proportional axis, on phones only); (c) keep them as they are and record the failure (2.5.8's "equivalent" exception needs another control on
the page that sets the phase and meets 24 px, which is (a)). **Recommended: (a)**: decision 53 holds, every phase is a 44 px press in the list, and the axis stays a
slider. Cost: part of item 3; the self-test's A-3 phase check changes on phones.

**225. Controls that leave the phone's timeline** (the compact prototype): the two ten-minute steps (the slider and the event steps remain),
the Eyes button ("Whose eyes?" stays in the Command tab), the four speeds folded into one button. (a) as prototyped; (b) keep all, the
timeline a row taller (about 170 px); (c) into the Menu. **Recommended: (a)**; the slider's keys are unchanged.
Cost: none beyond item 3; the self-test's Watch-switch and keyboard-group checks read the phone's row.

**226. A phone held landscape** (844 x 390): today's timeline is 90.5 px and after "Explore" 0.69 of the screen is free; the sheets make the
dossier and the rail worse there. (a) keep today's layout held landscape, fixing its one overlap (the first-run card under the tools); (b)
the phone layout there too; (c) not supported. **Recommended: (a).** Cost: small, inside item 3.

**227. The new words.** A phone layout needs at least two names the build does not have: the Menu button's and the dispatch sheet's grip's
(the prototypes' "Menu" and "Open the card" are placeholders). (a) the owner decides them in item 3's Part B from proposals, in `LABELS`;
(b) the prototypes' words. **Recommended: (a).** Cost: none now.

**228. The checks for phones** (§4.5). (a) the eight phone cases in `check:visual` with a device (density 3, touch, a mobile user agent),
the phone states in `check:contrast`, the four new zero-limits (24 px targets but the markers, no cut text but a named list, no overlaps,
every feature one control away), each case's unobstructed baseline, drop limit and timeline ceiling measured once on the build that adds the
layout and set on the owner's word; 44 px recorded, not held; (b) the same with 44 px held; (c) `narrow-390` kept as the only case.
**Recommended: (a).** 44 px is Apple's guideline and WCAG's AAA; holding it would rule out the event markers and much of the build's
density (no control reaches it today but the rail). Cost: part of item 3; `check:visual` grows by eight cases, each a fresh page at density 3
(the probes here took about 1.5 minutes a state under software WebGL: a longer run).

**229. Safari's own viewport.** The probes use the full CSS viewport (390 x 844); Safari's bars take part of it. (a) the phone cases use the
height the iPhone's report gives (its "viewport" line, P1); (b) the full viewport. **Recommended: (a)** once P1 is in. Cost: none.

**230. P-1's number** (§0.2). The audit's "about 91%" and "2.29 million are figures and standards" are an inference the census corrects
(49.7%, 1.23 million in the low Pratzen view). (a) a records-only note in `docs/FINAL_AUDIT.md` under P-1, pointing here; (b) leave the audit
as written, this document carrying the correction. **Recommended: (a)**, in item 1's records commit. Cost: a sentence.

## 8. The review

[pending]
