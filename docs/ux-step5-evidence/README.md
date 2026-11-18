# UI/UX roadmap step 5: the paper plate (UA-08)

Evidence for the draft pull request. Presentation only: no data changed. The tools are in [`tools/ux-step5/`](../../tools/ux-step5/) (not bundled) and
the live block in [`tools/visual/ux5.js`](../../tools/visual/ux5.js), judged by `tools/visual/thresholds.js` `checkUx5`. The records:
[`villages/`](villages/) (the twelve, derived), [`base/`](base/) (the base build as entered), [`proto/`](proto/) (the prototypes as entered),
[`motion/`](motion/) (the motion block's paper runs: [`motion/proto/`](motion/proto/) for the prototypes on the base build, [`motion/build/`](motion/build/)
for this build's lettering modes), [`block/`](block/) (the live block on both builds), [`spot/`](spot/) (forced colours, reduced motion, the landscape
unchanged), [`names/`](names/) (this build's lettering modes as entered) and the matched captures [`captures/`](captures/).

## 0. The builds and the environment

| | Base (UI/UX step 4, `main` at `78ba837b0ae8518bfe9a3c9edbf383d8f721702f`, #115's merge) | This build |
|---|---|---|
| `austerlitz-command-map.html` | 3,100,850 bytes, md5 `66b4edc251ada879b2146ed7dabd385b` | **3,136,806 bytes, md5 `bfda6af8f046d29848d60fb72bba77fb`** |
| SHA-256 | `393bbc1e88cdb7847939fede792134a09fe7dcfe16fd527d65c535783ae4f3bf` | `bc7e71ebdbaef549d9efcc05ac487d2cce2d65d7cc563ab94ddc18c1f83edab9` |

The branch was made from `origin/main` at `78ba837`, which contains #115's merge (`git merge-base --is-ancestor 78ba837 origin/main`: yes; it is
that merge).

**Every number here:** Chromium 141.0.7390.37 (Playwright 1.56.0's pinned build), headless, **software WebGL** (ANGLE on SwiftShader), Linux, 4 cores.
The phone is **Chromium's emulation** (390 x 844, density 3, touch, an iPhone's user agent), not a physical device. No frame rate is measured. The
plate adds on the paper map one draw call (the surround's sheet over the apron, 12,688 triangles, the apron's own geometry) and three DOM elements
(the neatline, the cartouche, the base lettering's twelve names); the landscape and the phone's layout draw nothing new, so the device route was not
required by the brief and was not run.

**The owner's decisions** (18 November 2026, asked with the measures of sections 3 and 4, each as recommended):

1. **Decision 302 (b), reopened by UA-08: option (b).** The twelve villages' names are laid out after the counters and before every other item of
   the map layer while the plate stands: the counters keep their places, the labels make room. Measured as entered at 09:30: **7, 5 and 7 of 12** at
   1600 x 900, 1366 x 768 and 1280 x 720, **the audit's 10 of 12 not met, accepted**; no motion baseline lowered. Option (a), the names laid first,
   drew 12 of 12 at each size but lowered six visibility baselines and took the motion block's jumps over their ceiling (section 4).
2. **The plate stands while the field is shown as framed** (as entered, after the Overview's button, after a resize or a panel's change that frames
   it again): the first pan, zoom or glide stands it down. Held always it costs the paper runs' baselines (section 4).
3. **On a phone (below 720 px wide) the plate is the surround alone**: no neatline, no cartouche, no counter rule. The phone case, `phone-390-paper`,
   is checked as before (its drop limit 17, the base's 17).

## 1. The result against the brief's acceptance points

| # | Target | Base | This build | Met? |
|---|---|---|---|---|
| 1 | As entered at 1600 x 900, 1366 x 768, 1280 x 720: at least 10 of the 12 village names drawn | 0, 0, 0 (by real input at 09:30) | **7, 5, 7** | **no** (decision 1: option (b), accepted as measured) |
| 2 | No counter outside the neatline | 0, 1, 4 outside the free map (no neatline) | **0, 0, 0** | yes |
| 3 | North within 0.5 degrees; one scale and the scale bar to 1% | 0.000 degrees; spread 0.2%; bar 0.2-0.3% | the same | yes |
| 4 | The field framed inside the free area as before | inside | the same framing, box for box | yes |
| 5 | The phone's paper map framed and checked as now; say what the plate does | | the surround alone (decision 3); drops 17, as now | yes |
| 6 | The motion block's paper runs: no visibility baseline lowered, no ceiling raised | | every run's counts and visibility the base build's or better (section 4) | yes |
| 7 | No other baseline lowered | | none moved (section 6) | yes |
| 8 | `check:contrast`: every text at AA and the 10.5 px floor, the cartouche and the names included | | 57 of 57 states, 9,467 text elements, 0 below AA, 0 under 10.5 px; 510 cased map texts read against their casing, the names among them (section 8) | yes |
| 9 | Forced colours and reduced motion spot-checked | | section 7 | yes |
| 10 | A live block `ux5`, judged in `thresholds.js`, failing on the base and passing here | 14 failures | **0** | yes |
| 11 | The self-test's manifest by name | 356 | **360** (section 8) | yes |
| 12 | `check:data` byte-identical | | 143 of 143 declarations identical | yes |

## 2. What was tilted, and what was not

The audit says the sheet "enters tilted about 20 degrees". Measured as entered on the base build (`base/probe-base.json`, `tools/ux-step5/probe.js`):
**north is 0.000 degrees off up** in every view (the harness's `paperMap()`: the bearing of a point 0.01 degrees north of the Pratzeberg), the scale's
spread 0.20-0.21% and the scale bar within 0.18-0.41% of the true kilometre: the paper map is true north-up, as decision 25 has it. What is turned is
the **modelled ground's frame**: its four edges stand at **17.42 degrees** from the screen's axes (17.416 to 17.429 measured), which is
`GEOREF.ROT_DEG` (17.4228): the world's rectangle is rotated against north, and a north-up plan draws it as it lies. Nothing was rotated to square
it and `GEOREF` is untouched. The neatline is drawn north-aligned round the free map (the rectangle MAPCAM frames the field in), the field inside
it as before; the turned sheet now stands on paper of its own tone inside a frame, not in an olive void.

## 3. The twelve villages, derived (`villages/`, `tools/ux-step5/villages.js`)

From the narrative the brief names (PHASES, EVENTS, TOUR, ANALYSIS: 568 strings, camera presets skipped), the strings that name each village the
data hold (world.js `VILLAGES`, the drawn footprints, and data.js `FEATURES` of kind village or town, the map's named places), as a whole word:

| village | strings | as the page names it | note |
|---|---|---|---|
| Sokolnitz | 15 | FEATURES `sokolnitz` | |
| Telnitz | 12 | FEATURES `telnitz` | |
| Augezd | 10 | FEATURES `augezd` | |
| Blasowitz | 8 | FEATURES `blasowitz` | |
| Kobelnitz | 4 | FEATURES `kobelnitz` | |
| Puntowitz | 4 | FEATURES `puntowitz` | |
| Austerlitz | 3 | FEATURES `austerlitz` (town) | "the sun of Austerlitz" not counted |
| Pratzen village | 3 | FEATURES `pratzenv` | counted only where a string says "Pratzen village": "Pratzen" alone is the plateau as often |
| Holubitz | 2 | VILLAGES (no map-layer place) | |
| Krug | 2 | VILLAGES (no map-layer place) | its place C for 1805 (WP-04b) |
| Krzenowitz | 2 | FEATURES `krzenowitz` | |
| Girzikowitz | 0 (7 in the formations' text) | FEATURES `girzikowitz` | the twelfth, by the same rule over FORMATIONS, COMMAND, PLANS |

Satschan (3 strings) is named only as its mere and dam, Turas (3) only as its wood: neither counted as a village. Bellowitz, Bosenitz, Hostieradek,
Menitz, the Posoritz post house and Schlapanitz: 0. No name is added or changed: ten are drawn under the FEATURES name the map layer gives them on
zoom, two (Holubitz, Krug) under world.js's VILLAGES name. The audit's own "12" (CL-MAP-05's) was `MAJOR_FEATURES`, which holds four villages and
eight heights and waters; the brief asked for villages, so this list replaces it for the check.

## 4. The options, prototyped and measured

Prototypes put into the live base page (`tools/ux-step5/protos/plate.js`, variants `tools/ux-step5/variants.js`), then the chosen ones built and measured
again on the build. **As entered** (`proto/protos.log`, `tools/ux-step5/protos-run.js`; Study, 09:30, the harness's own entry): the twelve drawn, the
counters drawn and outside the neatline (or the free map), the layer's drops. **In motion** (`motion/`, `tools/ux-step5/motion-paper.js`: the motion
block's paper runs exactly as `check:visual` runs them, on a page of their own; each run against `thresholds.js MOTION.VIS`).

### The plate's scope (the neatline, the cartouche and the counter rule)

| variant | as entered 1600 / 1366 / 1280 / phone: counters outside | drops | paper runs: jumps, pops, switches, flickers | baselines lowered |
|---|---|---|---|---|
| base | 0 / 1 / 4 / 4 (of the free map) | 12 / 12 / 12 / 17 | 22, 178, 29, 4 | none (its own) |
| frame (surround, neatline, cartouche; no rule; always) | 0 / 1 / 3 / 2 | 12 / 12 / 12 / 18 | 20, 182, 27, 3 | paper-pan 1,274 to 1,243 drawn and 0 to 533 ms; paper-glide 822 to 735 in view |
| hold (the rule, always) | 0 / 0 / 0 / 0 | 12 / 12 / 12 / 20 | 25, 213, 25, 2 | paper-pan 1,274 to 963 drawn; paper-zoom, paper-glide, zoom+point, zoom+sel |
| hold, counters only, always | 0 / 0 / 0 / 0 | 12 / 12 / 12 / 18 | 20, 190, 27, 3 | paper-pan 1,183; paper-glide; zoom+sel |
| **hold while framed (built)** | **0 / 0 / 0 / 0** | **12 / 12 / 12 / 20** | **22, 178, 29, 4** | **none** |

Held while framed, the runs equal the base build's count for count: each begins from the entered plate and its first pan, zoom or glide stands the
plate down, and Play leaves the field framed and the counters already inside. On the phone every rule added drops over the case's 17 (`proto/protos-phone.log`):
the neatline with the rule 18, with the cartouche 20; the surround alone, or the neatline without the rule, 17. Hence decision 3.

### The lettering (decision 302 (b), reopened)

| option | as entered: twelve at 1600 / 1366 / 1280 | counters' leaders, median px | paper runs: jumps, pops, switches, flickers | baselines lowered |
|---|---|---|---|---|
| (d) as decided, none | 0 / 0 / 0 | 89 / 89 / 97 | 22, 178, 29, 4 | none |
| ranked in the layer at 3.95, under the counters | 1 / 1 / 1 | | 29, 228, 23, 4 (held always) | five |
| ranked at 2.5, before the counters (WP-08's) | 6 / 6 / 5 | | 37, 236, 23, 3 (held always); at rest only 32, 174, 59, 1 | seven; at rest five, the jumps and switches over their ceilings |
| ranked at 3.95 at rest only | 1 | | 25, 175, **59**, 4 | none, but switches +30 (the 16's 108 to 138, ceiling 130) |
| **(c) after the layer** | **5 / 2 / 3** | 89 / 89 / 97 | **22, 178, 29, 4** | **none** |
| **(b) after the counters (chosen)** | **7 / 5 / 7** | 89 / 89 / 97 | **20, 164, 29, 4** | **none** |
| (a) first, before the layer, while framed | **12 / 12 / 12** | 111 / 110 / 119 | 30, 160, 29, 4 | six (below) |
| first at rest only (prototype) | 12 | | 32, 182, 29, 2 | four, jumps over their ceiling |
| first always (prototype) | 12 | | 26, 195, 29, 2 | six |

Option (a)'s six, base to (a) (`motion/build/framed.json`): paper-pan 1,274 to 1,216 drawn and its longest hidden 0 to 533 ms; paper-zoom 852 to 835;
paper-glide 551 to 539; paper-zoom+point 852 to 813; paper-zoom+sel 821 to 749; paper-play+al 1,182 (baseline 1,171) to 1,109; and the paper four's
jumps 22 to 30, which would take the 16's 246 to about 254 against the ceiling of 251. The same option prototyped on the base build cost three
baselines and 3 jumps: the cost is real and sensitive to the layout's details. A wider fourth ring or names at 11.5 px lifted option (b) only to 8,
5 and 8, so neither was kept. The comparison sheet the owner saw: `captures/options-1600x900.jpg`.

The names laid before or amid the layer exposed a duplicate: a village's own place label could be drawn beside its base name (Austerlitz, in the
sheet's first draft). While a base name stands for a village, the layer now withholds that village's place label (counted as withheld, as WP-08's
name-only labels are), so the drops as entered fall from 12 to 9, 8 and 8.

## 5. This build (`block/`, `names/`, `captures/`)

Each view as entered at 09:30, the base build then this one (`captures/probe.json`, `tools/ux-step5/probe.js`; the harness's own entry, `paper:"frame"`;
the captures `captures/base-*-paper-entered.jpg` and `captures/new-*-paper-entered.jpg`):

| view | north, degrees | the field's edges | counters drawn / outside | the twelve | layer drops | the surround at the free map's corner (RGB) |
|---|---|---|---|---|---|---|
| 1600 x 900 base / new | 0 / 0 | 17.423 / 17.423 | 14, 0 / 14, 0 | 0 / **7** | 12 / 9 | 115, 117, 99 / **232, 227, 217** |
| 1366 x 768 base / new | 0 / 0 | 17.423 / 17.423 | 14, 1 / 14, **0** | 0 / **5** | 12 / 8 | 114, 116, 98 / **233, 228, 218** |
| 1280 x 720 base / new | 0 / 0 | 17.423 / 17.423 | 14, 4 / 14, **0** | 0 / **7** | 12 / 8 | 116, 118, 100 / **234, 229, 219** |
| 390 x 844 phone base / new | 0 / 0 | 17.423 / 17.423 | 10, 4 / 10, 4 (no neatline) | 0 / 0 | 17 / 17 | 113, 115, 97 / **227, 222, 212** |

The drops fall because a village's own place label is withheld while its base name stands (counted as withheld, not dropped). The phone draws the
surround alone: its layer, its drops (17, `phone-390-paper`'s limit) and its counters are the base's; its base lettering is laid out after the layer
and draws none as entered (four after a pan).

**By real input** (`block/new.json`, `block/base.json`; `tools/ux-step5/block.js`, the live block `ux5`, judged by `checkUx5`): the paper map entered by
the Layers and Paper map buttons after the rail's PageDown to 09:30, on fresh pages. This build: the neatline at 305, 57, 1255, 799 (1600 x 900),
305, 57, 1023, 671 and 305, 57, 935, 623, each 7 px round the free rectangle; 14 counters, none beyond the neatline's inner side; the twelve 7, 5, 7;
the cartouche right of the neatline with "2 December 1805 · 09:30", "The crisis on the Pratzeberg", "The Pratzen Strike · 09:30 - 10:30"; the
unobstructed share 0.7038, 0.6533, 0.6291 (the base's own); a drag stands the plate down, the Overview's button brings it back (the field framed
again, nothing beyond the neatline); the phone's paper map by taps the surround alone. **0 failures** (the base build: **14**, no neatline, no
cartouche, no village named, counters beyond the free map at 1366 and 1280, the phone's surround olive).

**In motion** (`motion/build/final.json`): the motion block's paper runs on this build: paper-pan 1,274 of 1,274 drawn (0 ms hidden), paper-zoom 852 of
1,232 (667 ms), paper-glide 551 of 822, paper-play 1,533 of 1,694, paper-zoom+point 852 (equal to paper-zoom in every count), paper-zoom+sel 821,
paper-play+al 1,182 of 1,331: every visibility baseline exact (play+al's 1,171 exceeded as on the base). The paper four: 20 jumps, 162 pops, 29
switches, 3 flickers (base 22, 178, 29, 4). `check:selftest`'s full block on this build: the 16 at 244 jumps, 947 pops, 108 switches, 9 flickers
(ceilings 251, 1,049, 130, 12).

**A fault found and fixed on the way**: the first `check:selftest` run failed one motion rule: paper-zoom's twin with the pointer (hovering nothing) must
equal the 16's run, and differed by one pop. The base lettering had kept its last place across views (its memory outlived a fresh view, which the
layer's does not); since `bf6754b` the names are laid out fresh in a fresh view and keep their places only while the view moves or rests after motion.
The twin and its run are identical frame for frame (`tools/ux-step5/motion-paper.js`).

## 6. Baselines and limits

No baseline, limit or ceiling moved. The paper cases' drop limits (`paper-north-up` 20, `paper-laptop` 21) hold with the drops as entered at 9, 8 and
8 (the base's 12, the withheld places no longer counted as dropped); the unobstructed shares are the base's (the harness's panel list does not include
the cartouche, which stands in the margin outside the free map as entered: section 5 gives its box); `phone-390-paper` keeps its 17.

## 7. Spot checks (`spot/`, `tools/ux-step5/spot.js`)

`spot/spot.json`, `tools/ux-step5/spot.js`, on this build (captures `spot/forced-1366x768.jpg`, `spot/reduced-1366x768.jpg`): **every check passed**.

- **Forced colours** (Chromium's emulation of `forced-colors: active`, 1366 x 768, entered by real clicks): the neatline's two lines drawn in the system's
  ink (`rgb(0, 0, 0)`, 2 px and 1 px), the cartouche's border drawn and its box on Canvas, each of the five names drawn on Canvas (the casing gone, as
  the browser draws no text-shadow there; style.css's forced-colours rule).
- **Reduced motion** (`prefers-reduced-motion: reduce` before load): the app reads it (`RM` true); the plate as entered at once (the neatline, the
  cartouche, five names, no counter outside); a drag stands it down; the Overview's button brings it back within one frame (no glide).
- **The landscape unchanged**: the Field vantage at 09:00 in Study and in Watch at 1600 x 900 on the base build and this one: the canvas alone **0 of
  1,440,000 pixels differing** in both; the whole page 1 pixel at 1 level in each, the renderer's own noise (the base build against itself: 1 pixel at
  1 level). On the landscape the surround's sheet is not drawn, the neatline, the cartouche and the names are hidden.
- The surround's sheet: 12,688 triangles, the apron's own geometry, one draw call on the paper map alone.

## 8. Checks

Here (Chromium 141.0.7390.37, the pinned Playwright 1.56.0, software WebGL), on this build (`bfda6af8...`) unless named:

- `npm test`: all nine suites, the height guard and the dead-code check pass (`npm-test.log`); `css-test.js` holds the plate's rules (the paper theme's
  colours, the rail head's day, nothing to MAPCAM's framing, the plate's scope, the surround through the curve's inverse, the lettering's casing and
  place); `runtime-test.js` 0 errors, "console.warn unique" 0.
- `check:data`: all 143 data declarations byte-identical to `archive/stage6wp09w-45d29cc5.html`.
- `check:chronology`: 0 errors.
- `check:selftest`: on this build **360 of 360** checks pass and every live block (the motion block, `ux1` to `ux5` among them); the run's only failing
  lines were the manifest's (4 checks not in it), and the manifest was written from that run (`check-report.js --write-manifest`: 356 to 360, 4 added,
  0 removed). A run on the build before `bf6754b` had also failed the twin rule above (fixed). A second local run after the manifest was cut off by the
  container's restart; the clean run is CI's: `check:selftest` passed on CI with the new manifest on this build (runs 44232536488 and 44233706713 on `3f66434`, 43 and 44 minutes, and 44234497630 on `3ea3282` and 44236237997 on `270b8e6`, the build `bfda6af8...` unchanged since `3f66434`).
- `check:contrast` (CI, run 44226346847 on `a267a82` and run 44232536488 on `3f66434`, both this build): 57 of 57 states reached (10 as a phone, 12 at
  320 x 256 and in forced colours), 9,467 text elements, 126 distinct pairs, **0 below AA, 0 under 10.5 px**, 510 cased map texts read against their
  casing (the base lettering's among them, `tools/visual/contrast.js`'s casing rule extended to `.pl-name`), 0 font failures, 0 console messages; the
  boot cases 10 of 10. The cartouche is page text on the paper theme's panel.
- `check:baseline`: on this build, `bfda6af8f046d29848d60fb72bba77fb`, 3,136,806 bytes.
- The live block `ux5` alone (`tools/ux-step5/block.js`): 0 failures here, 14 on the base build.
- `check:visual` in full on CI: the first run (44233706713 on `3f66434`, this build) stopped after 2 h 48 min. Every case and block before it ran.
  It stopped in step 2's live block `ux2`, before its scripted Play: `playRun: the app's pending frame did not come within 15 s of the driver's start`
  (`tools/visual/ux2.js` line 171, a step 2 harness wait). It was a harness error, not a failed check. The same block passed on this build in the four
  CI runs of `check:selftest` and locally (`tools/ux-step2/block.js`, every check, 169 s, Play in Study 270 frames). The app's loop always
  requests its next frame, so the missed frame is the runner's; the cause is not known. Re-dispatched as run 44260893369 on `1a74ab8`, the same build:
  **passed** (`STAGE0: all checks passed`, 2 h 54 min, every case and live block, `ux2` to `ux5` among them).

## 9. Not met, uncertain, handed on

- **The audit's 10 of 12 is not met**: 7, 5 and 7 as entered at 09:30 by real input, the owner's choice (decision 1). Puntowitz, Krzenowitz and
  Girzikowitz are the names most often left out: they lie under the counters' boxes at the Goldbach and on the plateau's east.
- The neatline and the cartouche stand down at the first pan or zoom (decision 2); a visitor who wants them back presses the Overview.
- The surround reaches the screen in the token's tone at the screen's middle; the post pass's vignette darkens it toward the corners as it does the
  whole map (measured 232, 227, 217 at the free map's corners at 1600 x 900, against the token's 243, 238, 226).
- Contours were already on by default on the paper map (`layerOn.contours`, drawn, since Stage 2E): nothing changed.
- Everything is software WebGL; `check:visual` in full on CI only; no device run (one draw call on the paper map).
