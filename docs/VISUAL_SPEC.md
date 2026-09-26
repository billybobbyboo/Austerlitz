# Visual language specification (Stage 1, Part A)

**Status: specification drafted; no code, data or test changed.** Written against `main` at `e9190e1`
(`austerlitz-command-map.html` md5 `c09c4b23d9e245ff9d693960cf9496b9`). Part B implements it. Line numbers
refer to that commit.

Scope: the colour and type used by the interface, the counters, the labels and the map symbology. The 3D
terrain palette, lighting, sky, fog, smoke and mist are Stage 4 and are only documented here (appendix A).
Uniforms, headgear and flag designs are Stage 6.

**How this was established.** Every colour literal and font value was extracted from the sources with its file
and line (appendix A). Text contrast was **measured in the built page**, not estimated from the stylesheet:
the page was driven in Chromium through 17 interface states (first run, Study, formation, event, place and
terrain dossiers, analysis, command, plans, layers, sources, tour, and the paper map with its dossier, tour
and layers). Every visible text element was read with its computed colour, size and weight, and its stack of
translucent ancestor backgrounds and opacities. Each was composited over two map backdrops taken from the
Stage 0 harness screenshots: dark `#0C1116` (the page ink, as at 04:00) and bright `#A6AEB3` (95th-percentile
map pixel of the midday and low Pratzen views); on the paper map `#F1EDE1` (95th percentile) and `#D4D5C9`
(median). CSS transitions were disabled for the measurement so that no colour was read mid-transition.
Canvas text (counters, labels) was computed from the drawing code and the measured on-screen sprite sizes.
Contrast is WCAG 2.x relative luminance; colour differences are CIEDE2000; colour-vision deficiency is
simulated with the Machado, Oliveira and Fernandes (2009) matrices at full severity.

Labels used below: **fact** (read from the code or measured), **derived** (computed from facts),
**recommendation** (a proposal for Part B), **open** (needs the owner).

## 1. The owner's decisions, and whether they are workable

The decisions are fixed. None is unworkable. Five need a technical condition met to work, and one conflicts
in part with other colours that already exist; both are stated here so that Part B does not discover them.

| # | decision | verdict | condition or conflict |
|---|---|---|---|
| 1 | Side symbology: French blue; Allied amber for arrows, event markers and counter frames. Nation colours stay as counter fills and figure coats. | Workable, with a **cased frame**. | A frame in one side colour cannot be seen against its own fill and every ground: French arrow blue on the French fill is 2.02:1, Allied amber on the Russian fill 1.81:1, and both fall to 1.5-1.6:1 on the bright landscape (WCAG non-text minimum 3:1). A frame made of a side-colour band between two thin dark keylines passes everywhere: the band carries it on dark ground (5.2-5.6:1), the keyline on light ground (8.6-16.5:1). See §6. The same casing makes the Austrian white counter visible on the paper map, where its fill is 1.02-1.29:1 today. **Selection** can no longer recolour the frame (it does today, `symbols.js:90`), because the frame now carries side: selection becomes a separate outer ring. |
| 1 | (continued) figure coats | Workable now; **note for Stage 6.** | Coats in nation colours are right for this convention, but `docs/VISUAL_AUDIT.md` (opportunity 3) plans historically accurate uniforms, where French dragoons and chasseurs wore green and the Chevalier Guard white. From Stage 6 a coat cannot carry nation; nothing in this specification relies on coats to carry nation or side. |
| 2 | The interface accent becomes a neutral warm ivory; amber is used only for the Allies. | Workable, with two conditions and **one partial conflict**. | (a) An ivory accent is close in hue and lightness to the ivory text, so it cannot be the only sign of "current" or "selected": pair it with a bar, weight or background (§5, §8). (b) Ivory cannot work on the paper map's light panels (about 1.1:1); the paper theme needs a dark counterpart (`#4E3F1E`, 5.0:1 or better). (c) **Conflict:** amber and gold also carry non-Allied meanings: the terrain-analysis ridge `#D8A05A` and escarpment `#C2743C` lines and labels (`world.js:1316-1317`, `app.js:2450`, `app.js:3841`), the "hard for guns" going class `#B8863A` (`world.js:537`, `shell.html:154`), the height place-label colour `#D9BC7A` (`symbols.js:169`), the objective marker `#EFC468` (`app.js:1157`, `1164`), the movement trail `#D8C48A` (`app.js:1010`) and the "decision" event gold `#E7C069` (`app.js:1818`, `1915`). The overlay colours are symbology and can move in Part B (§5). The going classes are part of the terrain palette (Stage 4, out of scope): they stay amber until Stage 4, and the legend says so. |
| 3 | Status and claim labels stop using side colours: neutral tones, distinguished by icon, shape, weight and text. | Workable, **no data change needed.** | `STATUS[*].tone` (guarded by `check:data`) stays as a meaning key; only `TONE` (not guarded, `symbols.js:7-10`) and the drawing change. Today three of the six tone pills fail contrast (warn 3.04, quiet 3.56, active 3.97:1) and "active" orange is 1.0 CIEDE2000 from the Allied plan colour. The same treatment is recommended for the evidence-layer and source tags, which have the same problem (§3.2); that is an extension of decision 3 for the owner to confirm (open question 3). |
| 4 | Counter confidence: no dashed or dotted frames; B and C by a letter badge; "reported only" keeps its "?". | Workable, with a **plated badge.** | The badge letter is drawn today with no halo or plate: `#D8B563` on the bright landscape is 1.15:1, the "?" `#EFC468` 1.37:1 (`symbols.js:118-131`). Once the dash is gone the badge is the only encoding, so it needs its own plate and keyline (§10). The legend's "approximate position ----" entry (`shell.html:150`) must change with it. |
| 5 | Vertical exaggeration adjustable in Stage 2 (1x, default about 4x, current 10.3x). | Recorded (§11). | No conflict. The display factor must apply to the ground mesh and `groundY()` only; `height()`, the viewshed and line of sight stay in true model units (all guarded by `check:data`). |
| 6 | Miniature scale of figures, buildings and flags is deliberate; flags come to the same symbol scale in Stage 2. | Recorded (§9). | Measured: figures are drawn about 55-70 times life size, buildings 10-15 times, flags over 100 times. "One convention" is today three different factors (open question 7). |
| 7 | The paper map becomes a true north-up, top-down map in Stage 2. | Recorded (§11). | No conflict: `GEOREF.NORTH` and `GEOREF.ROT` (17.42 degrees) already give the rotation. |

**`NATION` does not need to change.** The three nation fills stay well apart under protanopia and
deuteranopia (CIEDE2000 34-55). They are weak only under tritanopia (French/Russian 8.5) and in greyscale
(4.4), and decision 1's side-coloured frame restores the French/Russian separation under tritanopia (frame
difference 66). The Austrian fill's low contrast against the paper map is fixed by the cased frame, not by
changing the fill. So the task's stop condition does not apply.

## 2. Findings in brief

1. **168 distinct colours** in the interface and symbol code, and 533 colour literals across the sources
   (appendix A). Only 13 are tokens (CSS custom properties); JavaScript has none, and 4 of the 13 are unused
   (`--fr`, `--ru`, `--at`, `--panel-2`, `style.css:2`, `style.css:6`).
2. **One hue, many meanings.** The amber/gold family carries 9 meanings (Allied side, interface accent,
   "decision" events, "active" status, "estimate" claims, "inference" sources, reconstruction tags,
   reported-only and grade badges, selection); the light blue family carries 4 (French side, "documented"
   source, "derived" tag, "steady" status). Details in §3.2.
3. **72 of 192 measured text/background pairs fail WCAG AA** (appendix B). `--faint` `#5C666E` is in 33 of
   them and fails on every panel it is used on (2.99-3.30:1 at full opacity); `--dim` `#7C858E` is in 14,
   mostly on the paper map, where a dark-theme grey meets light panels or dark buttons are left on the light
   timebar.
4. **The paper map is half themed.** The dispatch, legend, timebar, tour bar, layers popover and view-mode
   switch turn light; the rail, the dossier drawer, the sources sheet and the tools stay dark. Several
   paper-only colours were written for one theme and meet the other: the selected rail tab is `#14120C` on the
   dark rail, 1.03:1 (`style.css:246`); timebar buttons stay dark with muted text on the light bar, 2.92:1;
   the tour step counter uses the ivory-gold accent on the light tour bar, 1.76:1.
5. **Canvas labels on the paper map** keep their landscape colours on a light halo: objective, overlay,
   plateau and terrain-analysis labels reach only 1.19-2.23:1 (`app.js:1142`, `1164`, `1869`, `2466`).
6. **The confidence badge has no plate** (1.15:1 on bright ground), which decision 4 makes the only encoding.
7. **Blue and amber are an excellent pair for the colour-blind but identical in greyscale** (CIEDE2000 2.1):
   side needs a non-hue cue as well (§7).
8. **The event dossier contradicts the map:** the map draws Allied events amber (`app.js:1818`, `1915`), the
   dossier heads them with the Russian green (`app.js:3796`, `NATION.ru.fill`), conflating the Allied side
   with one nation.
9. **Two sources for one colour table:** the going classes are drawn from `world.js:534-539` and repeated by
   hand in the legend (`shell.html:153-157`); the terrain-analysis colours exist in three copies
   (`world.js:1316-1320`, `app.js:2450`, `app.js:3841`).
10. **19 font sizes** from 9 to 25 px, and two different font stacks for the same role (CSS `--sans`/`--serif`
    against canvas `ui-sans-serif, system-ui, sans-serif` and `'Iowan Old Style', Palatino, Georgia, serif`).

## 3. Inventory

The complete list, every literal with file and line, grouped by meaning, is appendix A (typography:
appendix C). This section is the analysis.

### 3.1 By meaning (fact)

| meaning | where it is decided | values today |
|---|---|---|
| Nation | `NATION` `data.js:9-11` (fill, edge, ink, tag) | FR `#2E5496`/`#16274A`, RU `#3E6B4A`/`#1C3222`, AT `#D9D2BF`/`#4A4638`; unused CSS copies `style.css:6` |
| Side: arrows | `SIDE_COL` `app.js:1080-1081` | FR `#4C86D8` `#6E9BD0` `#2F6BC4` `#7FA6CE`; AL `#D4703A` `#C98E58` `#C85A2C` `#CB9366` (6 roles each, 4 distinct) |
| Side: event markers | `app.js:1818`, `1915`; dossier bar `app.js:3796` | FR `#7FB0F0`, AL `#EC9A5E`, decision `#E7C069`; dossier FR `NATION.fr.fill`, AL `NATION.ru.fill`, decision `#D9A64B` |
| Side: plans | `app.js:2307-2308`; `style.css:346-347` | FR `#4B8CE0`/edge `#0E2748`, AL `#E07A2E`/edge `#50230A`; plan blocks `#3C6EB4`, `#C2632F` |
| Side: interface | `style.css:377-379`, `463-464` | timeline ticks FR `#4B8CE0`, AL `#E07A2E`, decision `#E0A94B`; first-run words `#7FB0F0`, `#EC9A5E` |
| Status | `TONE` `symbols.js:7-10` (from `STATUS[*].tone`, `data.js:23-46`) | quiet `#7F847F`, steady `#3F6FA6`, active `#C0602C`, warn `#B8861F`, bad `#9E3D36`, gone `#63484A`; text `#F7F2E6`/`#FBF7EE` |
| Claim type | `style.css:277-279` | fact `#2F6B48`, estimate `#8A6A24`, reconstruction `#6A4A6E` |
| Evidence layer | `style.css:481-488` | record `#8FCFA8` on green tint, reconstruction `#E3BE78` on amber tint, derived `#A9C4E8` on blue tint, situation tag `#8FA6C4` |
| Source kind | `style.css:271-274` | documented `#9CC0EA` on blue tint, inference `#E3BE78` on amber tint |
| Confidence grade | `symbols.js:85-87`, `118-131`; `app.js:3538` | dashes `[9,6]` (B), `[3,7]` (C), `[5,5]` (reported); letter `#D8B563`/paper `#8A7A4E`; "?" `#EFC468`/paper `#8A5F12`; 82% opacity when reported only |
| Derived readings | `app.js:1844`, `1869`; `style.css:361-369`, `486-488` | plateau ring `#D8CFB6` dashed, label `#E3D9BE`; "army cut" `#E08A6A`; "derived" tag `#8FA6C4` |
| Interface emphasis | `--sun` `style.css:5` (18 uses) and its tints `rgba(217,166,75,.06-.7)` | `#D9A64B`; selection frame `#F0C463` `symbols.js:90`; selection ring `#E8DCBC` `app.js:1888`; toast/badge `#F2DCAE` `#EBD7A8` `#F5E4BC` |
| Interface text | `--bone`, `--bone-hi`, `--dim`, `--faint` and ~40 literals | see appendix A: 6 creams, 8 near-blacks, 6 greys for "secondary text" |
| Paper-map theme | 73 `body.mode-staff` literals, 38 values | `style.css:76-84`, `101-102`, `185-193`, `202-203`, `214-218`, `232`, `245-246`, `285-286`, `295-298`, `334-336`, `366-369`, `389-391`, `417-420`, `429-430`, `452-454`, `488`, `543`, `609-610` |
| Labels | `symbols.js:33-35`, `166-173`, `194`; `app.js:1000` | counter ink/sub/halo; place water/height/road/other (dark and paper); formation names tinted by nation |
| Terrain analysis | `world.js:1316-1320`; `app.js:2450`, `3841` | ridge, scarp, valley, defile, dead ground (three copies) |
| Going classes | `world.js:534-539`; `shell.html:153-157` | good `#6E8A5A`, hard for guns `#B8863A`, severe slope `#8E4436`, marsh `#6B5A3E`, water `#36505E` |

### 3.2 Colours that carry more than one meaning (fact)

| colour family | meanings it carries | where |
|---|---|---|
| amber/gold `#D9A64B` and near neighbours `#E0A94B`, `#E7C069`, `#EFC468`, `#F0C463`, `#D8B563`, `#E3BE78`, `#8A6A24`, `#C0602C`, `#D8C48A` | **Allied side** (arrows, events, plans, ticks); **interface accent** (focus, current step, tab, playhead, act, chapter, pressed layer, dispatch rule); **"decision" events**; **"active" status**; **"estimate" claim**; **"inference" source** and **reconstruction** tag (the same `#E3BE78`); **grade B/C badge** and **reported-only "?"**; **selection** frame; **objective** marker; **movement trail** | `style.css:5` and 18 `var(--sun)`; `app.js:1080-1081`, `1157`, `1164`, `1818`, `1915`, `1010`; `symbols.js:8`, `90`, `120`, `125`; `style.css:274`, `278`, `379`, `484` |
| light blue `#7FB0F0`, `#9CC0EA`, `#A9C4E8`, `#A9C6EE`, `#8FA6C4` | **French side** (event markers, first-run word, French name labels); **"documented" source**; **"derived" tag** | `app.js:1000`, `1818`; `style.css:273`, `463`, `485`, `486` |
| mid blue `#3F6FA6`, `#3C6EB4`, `#2F6BC4` | **French side** (plan block, counter-attack arrows) and **"steady" status** | `symbols.js:8`; `style.css:346`; `app.js:1080` |
| green `#2F6B48` / `#3E6B4A` (CIEDE2000 2.5 apart) | **Russian nation** and **"fact" claim** / **record** layer | `data.js:10`; `style.css:277`, `483` |
| Russian green `NATION.ru.fill` | **Russia** and, in the event dossier, **all Allied events** | `app.js:3796` |
| orange `#C0602C` / `#C2632F` (CIEDE2000 1.0) | **"active" status** and the **Allied plan** block | `symbols.js:8`; `style.css:347` |
| `#B8861F` / `#B8863A` (3.8) | **"warn" status** and the **"hard for guns"** going class | `symbols.js:9`; `world.js:537` |
| `#8A5F12` | paper-map **accent** (current step, clock, act) and the paper **reported-only "?"** | `style.css:78`, `218`, `367`, `430`; `symbols.js:120` |
| dash pattern | **confidence B/C** and **reported only** on counters; **plan links** (intended routes); **plateau ring** and **selection ring**; **movement trail**; **valley** and **dead-ground** analysis lines; legend "approximate position" | `symbols.js:85-87`; `app.js:1010`, `1844`, `1888`, `2268`; `world.js:1318`, `1320`; `shell.html:150` |

### 3.3 Near-duplicates (fact)

Clusters of values less than 4 CIEDE2000 apart, which read as one colour but are written separately
(every location is in appendix A):

- **about 11 French blues** for one meaning: `#2E5496`, `#16274A`, `#0E2748`, `#2F6BC4`, `#3C6EB4`, `#4B8CE0`,
  `#4C86D8`, `#6E9BD0`, `#7FA6CE`, `#7FB0F0`, `#A9C6EE` (plus `#3F6FA6`, "steady", which looks French);
- **about 12 Allied oranges and ambers**: `#D4703A`, `#C98E58`, `#C85A2C`, `#CB9366`, `#E07A2E`, `#C2632F`,
  `#EC9A5E`, `#50230A`, and the golds that the accent shares;
- **6 creams** for "light text or plate": `#F2EEE2`, `#F3EEE2` (0.5 apart), `#F7F2E6`, `#F2EEE4`, `#F6F1E5`,
  `#FBF7EE`;
- **8 near-blacks** for "panel": `#0B0F14`, `#0A0E13`, `#080B0F`, `#05080B`, `#04080A`, `#0A0E12`, `#080C10`,
  and `#000000` shadows; plus 5 dark slates `#0C1116`, `#131A21`, `#101720`, `#121A22`, `#141A20`;
- the bone family: `--bone` `#CABFA8` against the line colour `rgba(199,189,165,…)` = `#C7BDA5` (0.9 apart),
  and `#CFC4AC`, `#CDC4B2`;
- secondary text greys: `#95917F`, `#9A9384`, `#9B9585` (2.2-2.5 apart), `#9AA0A2`, `#9EA5A3`, `#9AA3A8`;
  prose `#ABA491`, `#B4AC99`, `#B8B09E`, `#B0A48C`;
- `#EFC468` / `#F0C463` (0.7); `#D9A64B` / `#E0A94B` (1.4); `#EBD7A8` / `#F2DCAE` (1.5); `#16274A` /
  `#0E2748` (2.0); `#4B8CE0` / `#4C86D8` (2.2); `#8FB6CC` / `#93BFD4` (2.7).

## 4. Encoding table

What each meaning is carried by after Part B (recommendation, within the decisions). "Hue" appears only
where the decisions put it; every other meaning is carried by shape, text, weight or position, so that no
meaning depends on hue alone.

| meaning | primary channel | redundant channel | tokens | never carried by |
|---|---|---|---|---|
| **Side** (French / Allied) | hue: blue / amber on arrows, event markers, counter frame band, plan ribbons, timeline ticks | shape: Allied arrows keep the plans' chevrons, event glyphs keep their kind shapes; text in legend and dossier | `side-fr`, `side-fr-light`, `side-fr-deep`, `side-al`, `side-al-light`, `side-al-deep`, `keyline` | the interface accent; status; claim |
| **Nation** (France / Russia / Austria) | hue: `NATION` fill on counters, figure coats (until Stage 6), order-of-battle dot, dossier bar | text: nation name in dossier; proposed nation tag on counters (open question 4) | `NATION` only (no copy) | side symbology |
| **Status** (22 states in 6 groups) | text label | icon shape per group, weight; neutral plate | `status-plate`, `status-ink`; icon set §10.3 | hue |
| **Claim type** (fact / estimate / reconstruction) | text label | icon: filled / half / hollow circle | `plate`, `text` | hue |
| **Evidence layer** (record / reconstruction / derived) | text tag | icon: filled circle / hollow circle / diamond | `plate`, `text-muted` | hue (today green / amber / blue) |
| **Source kind** (documented / inference) | text tag | weight (documented regular, inference italic) | `text-muted` | hue (today blue / amber) |
| **Confidence grade** (A / B / C, reported only) | counter badge: none for A, letter "B" or "C", "?" for reported only | dossier text "Position B"; spatial encoding in Stage 5 | `badge-plate`, `badge-ink`, `keyline` | dashed or dotted frames; hue |
| **Derived reading** (plateau strength, centre separation) | text tag "derived" | diamond icon; solid thin ring on the ground | `text-muted`, `annotation` | the accent; hue |
| **Interface emphasis** (current, selected, pressed, focus) | ivory accent bar, underline or outline | weight, background tint | `accent`, `accent-tint` | amber |
| **Map selection** | accent ring outside the counter's frame; solid selection ring on the ground | dossier opens; chip | `accent`, `keyline` | recolouring the frame |
| **Annotation** (objectives, overlay text, movement trail) | warm neutral text on halo | shape (objective cross-circle) | `annotation`, `annotation-paper` | amber, gold |
| **Terrain classes** (going, cover, analysis lines) | documented here; terrain palette is Stage 4 | analysis lines: dash and tick patterns (existing) | analysis tokens §5.4 | amber for analysis lines (moves off it in Part B); going classes keep their values until Stage 4 |

## 5. Colour tokens

### 5.1 One source of truth for CSS and JavaScript (recommendation)

Constraints (fact): the suites run the JavaScript in Node with no stylesheet (`runtime-test.js` stubs the
DOM, `getComputedStyle` returns only display and visibility); `css-test.js` reads the source `style.css` and
fails on any `var(--x)` not declared in that file; `build.py` pastes `style.css` into `shell.html`;
`NATION` is guarded by `check:data`.

Proposal:
1. A new source file **`tokens.js`** declares `var TOKENS = { … }` whose body is strict JSON (so Python can
   read it without a JavaScript parser). It holds every interface and symbology colour below, for both
   themes. It is loaded first in the bundle, after `assets.js` (`build.py` `ORDER`).
2. **JavaScript** reads `TOKENS` directly (canvas counters, labels, three.js materials, inline styles). This
   works unchanged in Node.
3. **CSS** keeps a `:root` block and a `body.mode-staff` block **written into `style.css`** between
   `/* tokens:begin */` and `/* tokens:end */`, generated from `tokens.js` by `python3 build.py --tokens`.
   The normal build **fails if the block in `style.css` differs** from what `tokens.js` generates, the same
   way CI fails if the committed HTML differs from a fresh build. `css-test.js` therefore still sees every
   custom property declared, with no change to the suite.
4. **Nation colours stay only in `NATION`.** CSS never uses them (the four nation/panel custom properties
   declared today are unused and are removed); the legend, first-run key and order-of-battle dots are painted
   from `NATION` by JavaScript, as now.
5. A theme is a set of values for the same token names: the paper map redefines the tokens under
   `body.mode-staff` instead of 73 per-selector overrides.

Rejected alternatives: reading CSS custom properties from JavaScript with `getComputedStyle` (no stylesheet in
Node, and a flash of wrong colours before the stylesheet applies); generating CSS only into the built HTML
(`css-test.js` would fail on undeclared properties); a JSON file read at runtime (the product is one
self-contained file).

### 5.2 Interface tokens (recommendation; every text pair verified in §6.2)

| token | dark theme | paper theme | use | replaces |
|---|---|---|---|---|
| `ink` | `#0C1116` | `#F3EEE2` | page and map ground behind panels | `--ink`, page backgrounds |
| `panel` | `#131A21` | `#F3EEE2` | opaque panels (drawer, sheet) | `--panel`, `#131A21` |
| `scrim` | `rgba(10,14,19,.92)` | `rgba(243,238,226,.95)` | translucent panels over the map | 14 `rgba(10…19,.72-.96)` values |
| `line`, `line-2` | `rgba(199,189,165,.16)`, `.30` | `rgba(40,36,28,.14)`, `.25` | rules, borders | `--line`, `--line-2`, 12 staff literals |
| `text-hi` | `#E7DFCC` | `#14120C` | titles, current items | `--bone-hi`, `#F1E9D6`, `#EFE7D4`, staff `#14120C` |
| `text` | `#CABFA8` | `#33301F` | body text | `--bone`, `#D6CDB8`, staff `#33301F`, `#2E2B1E` |
| `text-body` | `#B4AC99` | `#3A362B` | serif prose, definition values | `#B4AC99`, `#ABA491`, `#B8B09E`, `#C4BCA8`, `#C0B8A4` |
| `text-muted` | `#9BA3A9` | `#45412F` | secondary text, labels, timestamps | `--dim` `#7C858E`, `--faint` `#5C666E`, `#95917F`, `#9A9384`, `#9B9585`, `#9AA0A2`, `#9EA5A3`, staff `#5E5947`, `#6B6553`, `#7B7563`, `#857F6B` |
| `accent` | `#EFE4C8` (warm ivory) | `#4E3F1E` (dark umber) | current, selected, pressed, focus: always with a bar, underline, weight or tint | `--sun` `#D9A64B`, `#E0A94B`, `#F2DCAE`, `#EBD7A8`, `#F5E4BC`, staff `#8A5F12`, `#9A6F1E` |
| `accent-tint` | `rgba(239,228,200,.10)` | `rgba(78,63,30,.10)` | selected-row and current-step backgrounds | `rgba(217,166,75,.06-.14)` |
| `on-accent` | `#101720` | `#F2EEE2` | text on a pressed ivory button | `#101720`, `#F2EEE2` |
| `plate` | `#2A3038` | `#E3DDCD` | status, claim, evidence and source tags | the pill colours of `TONE` and `.pill.claim-*`, `.ltag.*`, `.src.*` |

### 5.3 Symbology tokens (recommendation)

| token | value | use | notes |
|---|---|---|---|
| `side-fr` | `#4C86D8` | French arrows, frame band, timeline tick | = `SIDE_COL.fr.attack` today, so the legend and first-run key keep their colour |
| `side-fr-light` | `#7FB0F0` | French event glyph and text on dark | |
| `side-fr-deep` | `#2A5FB0` | French symbology on the paper map | 5.34:1 on paper |
| `side-al` | `#D4703A` | Allied arrows, frame band, timeline tick | = `SIDE_COL.al.attack` today |
| `side-al-light` | `#EC9A5E` | Allied event glyph and text on dark | |
| `side-al-deep` | `#A8501C` | Allied symbology on the paper map | 4.69:1 on paper |
| `side-*-2`, `side-*-3` | lighter and darker steps of the side colour | the six arrow roles (attack/line, move/axis, counter, retreat) collapse to three steps per side | replaces the 8 `SIDE_COL` values; the roles stay |
| `keyline` | `#0A0E12` | outer and inner keyline of counter frames and badges; arrow casing | |
| `badge-plate` / `badge-ink` | `#0A0E12` / `#F2EEE4`; paper `#F6F1E5` / `#25231D` | grade and "?" badge | 16.7:1 and 13.9:1; the paper plate carries a `keyline` border (plate against paper is only 1.3:1) |
| `counter-ink`, `counter-sub`, `counter-halo` | `#F2EEE4`, `#B9B5A8`, `rgba(10,14,18,.86)`; paper `#25231D`, `#5D5A4E`, `rgba(246,241,229,.92)` | counter text | values kept: they pass (§6.3) |
| `annotation` | `#E3D9BE`; paper `#3A362C` | overlay labels, objectives, plateau reading, movement trail | replaces `#EFC468`, `#CDC4B2`, `#D8C48A`, and fixes the paper-map failures |
| `selection` | = `accent` | selection ring on the map and around a counter | replaces `#F0C463`, `#E8DCBC` |

Nation colours are not tokens: `NATION.fr/ru/at.fill` and `.edge` (unchanged, guarded).

### 5.4 Terrain-analysis and place-label tokens (recommendation)

Terrain-analysis lines are symbology drawn over the ground, so they are in scope; their data
(`TERRAIN_LINES`, guarded) is not touched. One table replaces the three copies, with a paper variant, and
ridge and escarpment leave the amber axis (decision 2):

| type | line (dark) | label (dark) | paper | pattern (kept) |
|---|---|---|---|---|
| ridge | a warm grey-brown | light variant | dark variant | solid, ticked |
| escarpment | a red-brown distinct from the Allied orange | light variant | dark variant | solid, ticked |
| valley | `#6FA0B8` (kept) | `#93BFD4` (kept) | `#3C6A86` | dashed |
| defile | `#D05A4C` (kept) | lighter, to reach 4.5:1 (today 4.39:1) | dark variant | solid |
| dead ground | `#9080B4` (kept) | `#B4A6D6` (kept) | dark variant | dashed |

Exact ridge and escarpment values are chosen in Part B against two tests: at least 20 CIEDE2000 from `side-al`
for normal vision and deuteranopia, and at least 4.5:1 for the label on its halo in both themes. The height
place label (`#D9BC7A`, `symbols.js:169`) moves to the same ridge brown.

The going classes (`world.js:534-539`) are terrain palette (Stage 4): **values unchanged**; Part B only makes
the legend read them from the same table (`shell.html:153-157` stops repeating them).

## 6. Contrast

### 6.1 Today (fact)

Measured in the built page (method at the top; all 72 failing pairs in appendix B):

| group | failing pairs | ratio | cause |
|---|---:|---|---|
| `--faint` `#5C666E` on its own panels | 25 | 2.99-3.30:1 at full opacity; 2.01-2.32:1 where also faded (past and next rows of a dossier's timeline) | the token is too dark for text on these panels |
| secondary greys and faded hints (`#6B6553`, `#7B7563`, `#857F6B`, `#8A5F12`, `#46422F`, `#9A9384`, `#9EA5A3`, several at 60-80% opacity) | 19 | 2.85-4.44:1 | too little contrast, or faded by opacity |
| paper map, theme mismatch: dark-theme text on the rail, drawer and tools that stay dark; dark timebar and tour buttons left on the light bar; the accent on the light tour bar | 17 | 1.03-4.18:1 | half-themed paper map (§2 item 4) |
| `--dim` `#7C858E` on the paper map's light panels | 3 | 2.63-3.05:1 | a dark-theme grey on light panels |
| `--dim` on the selected order-of-battle row | 1 | 4.11:1 | tinted row background |
| order of battle: formations not yet on the field, at 34% opacity | 3 | 1.37-1.60:1 | dimming by opacity |
| separator dots at 40% opacity | 2 | 1.75-1.78:1 | dimming by opacity |
| status pills: "Heavily engaged" (warn), "Concealed" (quiet) | 2 | 2.91, 3.41:1 | white on mid-tone plates |

The lowest passing pair is 4.68:1; `--bone`, `--bone-hi`, the serif prose colours and the counter text all pass.

### 6.2 Proposed tokens, verified (derived)

Worst case over every panel background measured today, composited over the bright map:

| pair | worst ratio | on |
|---|---:|---|
| dark `text-hi` `#E7DFCC` | 10.88 | timeline tick row `#282A2A` |
| dark `text` `#CABFA8` | 7.92 | timeline tick row |
| dark `text-muted` `#9BA3A9` | 5.64 | timeline tick row |
| dark `accent` `#EFE4C8` | 11.41 | timeline tick row |
| paper `text-hi` `#14120C` | 9.16 | darkest paper strip `#BAB5AA` |
| paper `text` `#33301F` | 6.49 | darkest paper strip |
| paper `text-muted` `#45412F` | 5.01 | darkest paper strip |
| paper `accent` `#4E3F1E` | 5.00 | darkest paper strip |
| status plate, dark: `#E7DFCC` on `#2A3038` | 10.03 | |
| status plate, paper: `#14120C` on `#E3DDCD` | 13.81 | |
| badge, dark: `#F2EEE4` on `#0A0E12` | 16.71 | |
| badge, paper: `#25231D` on `#F6F1E5` | 13.94 | |

Rules for Part B: all text below 18 px (14 px bold) meets 4.5:1 against the worst backdrop; text is never
faded with `opacity` below 1 (a "not yet on the field" row says so in words, or uses `text-muted`); a
graphical object that carries meaning meets 3:1 against what surrounds it (WCAG 1.4.11).

### 6.3 Canvas text (derived)

Counters are drawn at a fixed height on screen (`targetPx` 88 px in the landscape, 104 px on the paper map,
`app.js:2718`); measured on screen at 93-97 px and 110-116 px, so their 19-25-unit canvas fonts appear at
about **8.6-14 px**: all of it is small text.

| text | today | verdict |
|---|---:|---|
| counter name and echelon on halo (landscape / paper) | 13.43 / 13.40 | pass |
| counter designation and strength on halo | 7.59 / 5.89 | pass |
| grade letter B/C, no halo (landscape / paper) | 1.15 / 2.18 | **fail**: needs the plate (decision 4) |
| "?" reported only, no halo | 1.37 / 2.92 | **fail**: needs the plate |
| status pill text (quiet, active, warn) | 3.56, 3.97, 3.04 | **fail**: replaced by neutral plate (decision 3) |
| status pill text (steady, bad, gone) | 4.87, 6.19, 7.68 | pass |
| place labels, all kinds, both themes | 4.93-10.61 | pass |
| formation names (dark halo in every mode) | 5.02-7.12 | pass |
| objective, overlay, plateau, analysis labels, landscape | 4.39-8.26 | pass, except defile 4.39 |
| the same labels on the paper map (same colour, light halo) | 1.19-2.23 | **fail**: use the paper variants (§5.3, §5.4) |

Halo contrast is the designed case: the text sits on a 4-5-unit stroke of halo. Without the halo the same
text falls to 1.0-1.9:1 on the bright landscape, so no map label may drop its halo.

## 7. Colour-vision deficiency (derived)

CIEDE2000 between pairs after simulation (Machado et al. 2009, severity 1; greyscale for achromatopsia):

| pair | normal | protan | deutan | tritan | greyscale |
|---|---:|---:|---:|---:|---:|
| side: arrow blue / arrow amber | 45.5 | 49.4 | 53.8 | 66.0 | **2.1** |
| side: event blue / event amber | 43.0 | 45.4 | 48.8 | 61.6 | **0.1** |
| side: plan blue / plan amber | 48.3 | 52.8 | 56.7 | 67.7 | **3.5** |
| event amber / decision gold (today) | 16.5 | 8.6 | **5.5** | 10.3 | 6.4 |
| nation: FR fill / RU fill | 37.1 | 36.3 | 34.4 | **8.5** | **4.4** |
| nation: FR fill / AT fill | 52.9 | 50.2 | 55.0 | 51.9 | 42.1 |
| nation: RU fill / AT fill | 40.6 | 35.2 | 37.5 | 45.1 | 36.4 |
| Allied amber frame / RU fill | 45.2 | **14.4** | 25.8 | 51.3 | 16.7 |
| status active / warn (today) | 19.5 | 11.8 | **6.4** | 10.6 | 7.3 |

Readings:
- **Blue against amber is the right side pair:** it stays well separated under protanopia and deuteranopia
  (the red-green deficiencies, together roughly 8% of men of European descent) and under the rare
  tritanopia.
- **Blue and amber have the same lightness**, so side vanishes in greyscale, on a monochrome print or for
  achromatopsia. Side must therefore also be carried by shape: the Allied plan ribbons already carry chevrons
  (`app.js:2309`); event glyphs already differ by kind; arrows need a non-hue side cue in Stage 2 (open
  question 5).
- **French and Russian fills converge under tritanopia and in greyscale.** Decision 1's side band separates
  them under tritanopia (frame blue against frame amber: 66.0). In greyscale the text (nation tag or dossier)
  is the only remaining cue (open question 4).
- The **decision gold is nearly the Allied amber under deuteranopia** (5.5): moving decision events to their
  side colour with a distinct glyph (§10.4) removes the confusion.
- Amber on the Russian fill under protanopia drops to 14.4: the cased frame's dark keylines separate band and
  fill regardless (§10.1).

## 8. Type

### 8.1 Today (fact)

19 sizes: 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
25 px across base rules and media queries (appendix C). Weights: 400 almost everywhere, 500 in two places;
hierarchy is carried by size, colour and letter-spacing. Families: `--serif` (Iowan Old Style, Palatino
Linotype, Palatino, Book Antiqua, Georgia) for titles and narrative, `--sans` (system UI) for the interface,
a monospace stack for the developer overlay; canvas text uses its own shorter stacks (`symbols.js:77-187`).

### 8.2 Scale (recommendation)

Seven steps; sizes in CSS px at the base layout (media queries scale the whole set, not single rules):

| step | size / line height | family, weight | use |
|---|---|---|---|
| `t-micro` | 10.5 / 1.3, tracking .06em | sans 400, tabular numerals | hour ticks, tags, small caps headings |
| `t-small` | 11.5 / 1.45 | sans 400 | secondary interface text, definition terms |
| `t-ui` | 12.5 / 1.5 | sans 400 | interface body, list rows, definition values |
| `t-prose` | 14 / 1.6 | serif 400 | narrative, dossier prose, tour text |
| `t-h3` | 17 / 1.3 | serif 400 | tour title, panel titles |
| `t-h2` | 21 / 1.15 | serif 400 | dossier and sheet titles |
| `t-display` | 25 / 1.12 | serif 400 | dispatch and first-run titles |

No text below 10.5 px (today 9 and 9.5 px exist: `style.css:271`, `284`, `291`, `481`, `486`, `514`, and the
compass "N"). Emphasis within a step uses weight 500 or the `accent` bar, not a new size. Canvas text uses
the same two families as CSS (one stack each, defined once in `TOKENS`).

### 8.3 Label hierarchy on the map (fact, then recommendation)

Stage 0's placement order (`declutter`, `app.js:2528-2600`), highest first: 1 counters (selected, then by
echelon), 2 event labels (selected, then most live), 3 the plateau reading, 4 overlay labels, 5 formation
names, 6 terrain-analysis labels, 7 place names.

| level | what | on-screen size (today) | style (recommendation) |
|---|---|---|---|
| 1 | selected formation | counter 88-116 px tall | counter + selection ring |
| 2 | counters by echelon (army, corps, division, brigade) | name 11-14 px, sub 9.5-12 px | sans; name `counter-ink` 500, sub `counter-sub` 400 |
| 3 | events | glyph 5.4 units, label serif | side-coloured glyph, `annotation` text |
| 4 | derived reading (plateau) | serif 30-unit label | `annotation` text with "derived" diamond |
| 5 | overlay annotations and objectives | serif 28-30-unit labels | `annotation` |
| 6 | formation names | serif 34-unit label | neutral `counter-ink` (open question 2) |
| 7 | terrain analysis | about 17 px | analysis tokens §5.4 |
| 8 | place names | 9 px and up (22-unit text in a 72-unit glyph shown at least 30 px tall) | place tokens; minimum on-screen height raised so text is at least 10.5 px |

The DOM/SVG overlay that replaces sprite labels is Stage 2; this hierarchy is what it lays out.

## 9. Symbol-scale convention

Measured in the page with `GEOREF` (`geo.js`): one world unit is **63.2 m** of ground
(`GEOREF.M_PER_WORLD` = 1000 / (31.647 / 2)); heights are exaggerated **10.33x** (`GEOREF.EXAG` = 63.2 / 6.12).
Figures, buildings and flags are not vertically exaggerated: they are drawn at their own miniature scale.

| thing | size in world units | in metres of ground | real size (approximate, assumption) | factor |
|---|---|---|---|---:|
| foot soldier, standing, with shako | 1.98 tall (`figKit` `infFixed`) | 125 m | about 1.75 m | about 70x |
| horse, length | 1.65 (`horse`) | 104 m | about 2.4 m | about 45x |
| gun barrel | 1.5 (`GEO.barrel`) | 95 m | about 2 m | about 50x |
| house, long side (median of 223) | 1.97 (range 1.4-7.0) | 125 m (89-442 m) | about 8-12 m | about 10-15x |
| house, height (median) | 1.35 (range 1.0-4.8) | 85 m | about 6 m | about 14x |
| standard pole | 5.2, or 6.5 for a single-standard block (`GEO.pole`, `app.js:858`) | 330-410 m | to be sourced (Stage 6) | over 100x |
| flag cloth | 2.4 x 1.4 (`GEO.flag`) | 152 x 88 m | to be sourced (Stage 6) | |
| tent | 3.5 x 2.3 x 3.5 (`GEO.tent`) | 221 m | | |
| formation footprint (Saint-Hilaire's division) | 13.8 x 6.6 (`W0`, `D0`) | 872 x 417 m | frontage modelled to scale | 1x |

Other facts: Saint-Hilaire's block draws 294 men for 6,600, so one figure stands for about 22 men; standards
are placed at 2.6 x tall above the ground, flags at 4.5 x tall (`app.js:864-867`).

**The convention (to be stated in the legend and the sources sheet, decision 6):** *ground is to scale;
what stands on it is a symbol.* Frontages, depths, distances and the ground are true to `GEOREF`. Men,
horses, guns and standards are drawn at a single **figure scale** (about 60-70 times life), so that a
formation reads as troops at every zoom. Buildings are drawn at a separate **settlement scale** (about 12
times), so that a village keeps roughly its footprint and does not swallow its surroundings. The real sizes
in the table are rough general values used only to state the factor; they are not historical data, and any
historical dimension (a colour and its pike, a gun) is sourced in Stage 6 before use.

**Stage 2 (decision 6, recorded, not implemented):** flags come to the figure scale. Today a pole is 2.6-3.3
times a man's height; at figure scale it should be the real ratio of a colour's pike to a man, to be sourced
in Stage 6; until then Stage 2 uses a provisional ratio and labels it as such.

## 10. Confidence and uncertainty encoding

### 10.1 The counter (Part B)

- **Frame (decision 1):** fill in the nation colour; frame drawn as a cased band: outer keyline (1 unit,
  `keyline`), band (3 units, side colour: `side-fr` or `side-al`; paper `side-*-deep`), inner keyline
  (1 unit, `keyline`). Arm glyph lines keep `NATION.edge`. No dash pattern of any kind on the frame.
- **Grade A:** no badge.
- **Grades B and C (decision 4):** a square badge at the frame's top right corner, overlapping it by a
  third: `badge-plate` with a `keyline` border, the letter in `badge-ink`, sans 500. The letter is at least
  10.5 px on screen at the smallest counter height.
- **Reported only:** the same badge with "?". The 82% opacity (`symbols.js:71`) is dropped: it lowers the
  contrast of everything on the counter and the "?" already says it (open question 6).
- **Selection:** a ring in `accent` outside the outer keyline, 2 units clear of it; the frame keeps its side
  colour.
- **Dimmed (highlight families):** unchanged (34% opacity) for figures; the counter keeps full opacity for
  its badge and text, and dims only its fill and frame (open question 6).

### 10.2 Elsewhere today

- Dossier pills: "Position B", "Timing B", "interpolated", "Interval, not a timestamp" (`app.js:3538`,
  `3579`, `3808-3809`): text on a ghost pill. Kept; they meet contrast once `text-muted` replaces `--dim`.
- Legend: "approximate position ----" (`shell.html:150`, `style.css:102`, `106`) is replaced by the badge
  itself ("B, C: position approximate; ?: reported only").
- **Spatial display of uncertainty** (crisp footprint A, soft frontage B, diffuse zone C, evidence skeleton)
  is Stage 5. Until then the map shows grade only on counters, which appear in paper and hybrid modes; the
  landscape view shows no grade (a known gap, `docs/VISUAL_AUDIT.md` problem 9).

### 10.3 Status icons (decision 3)

Status keeps its text label; the six existing groups (`STATUS[*].tone`, unchanged) each get a shape, drawn
the same on counters (canvas) and in the dossier (inline SVG), on the neutral `plate`:

| group (key) | states | icon (recommendation) | weight |
|---|---|---|---|
| `quiet` | concealed, in reserve, forming up, observing, fortifying | hollow circle | 400 |
| `steady` | holding, on the march, supporting | filled square | 400 |
| `active` | advancing, attacking, charging, counter-attacking | filled triangle pointing right (forward) | 500 |
| `warn` | delayed, counter-marching, heavily engaged, surprised | filled triangle pointing up, with a bar | 500 |
| `bad` | repulsed, withdrawing, retreating, encircled, broken | filled triangle pointing down | 500 |
| `gone` | captured | cross | 400 |

Shapes are drawn, not font glyphs (font coverage of symbols differs by system).

### 10.4 Claim, layer, source and events (decisions 1-3)

- **Claim** (`CLAIM`, guarded, unchanged): fact = filled circle, estimate = half-filled circle,
  reconstruction = hollow circle, on `plate`, with the label. `.pill.claim-fact` and its siblings stay
  (required by `css-test.js`).
- **Evidence layer tags** (record / reconstruction / derived): the same circle family, and a diamond for
  derived; `text-muted` on `plate`.
- **Source tags** (documented / inference): text only, documented upright and inference italic.
- **Event markers:** side colour (decision 1) for every event, including decisions, which keep their own glyph
  shape instead of gold. The dossier header bar uses the side colour, not `NATION.ru.fill` (`app.js:3796`).

## 11. Recorded for Stage 2 (decisions 5-7; not implemented)

- **Vertical exaggeration (decision 5):** a presentation parameter with three settings: 1x (true scale), a
  default of about 4x (to be confirmed visually in Stage 2 against the Pratzeberg, the Goldbach and the
  Santon), and the current 10.33x. Applied in the ground mesh and `groundY()` only; `height()`, `hAt()`,
  viewsheds, line of sight, contours, dossier elevations and march-rate checks stay in model units (guarded
  by `check:data`). Figure seating, the camera floor and the Stage 0 harness checks must hold at every
  setting. The legend states the current factor.
- **Symbol scale (decision 6):** as §9; flags to the figure scale in Stage 2.
- **Paper map (decision 7):** a true north-up, top-down map: camera looking straight down, rotated by
  `GEOREF.ROT` (17.42 degrees) so that `GEOREF.NORTH` points up; hillshade, contours, flat village footprints
  and water, ground-draped arrows, compact counters. Its colours are the paper theme of §5.

## 12. Part B plan

Every site to change, grouped. Line numbers at `e9190e1`.

### 12.1 Tokens and themes
- New `tokens.js` (`TOKENS`), loaded after `assets.js`: `build.py` `ORDER`; `build.py --tokens` writes the
  `:root` and `body.mode-staff` blocks into `style.css` and the normal build fails on drift (§5.1).
- `style.css:1-11`: the generated block replaces the hand-written `:root`; `--sun` (18 uses) becomes
  `--accent`; `--dim` (25) and `--faint` (35) become `--text-muted` or `--text`; `--fr`, `--ru`, `--at`,
  `--panel-2` are removed (unused).
- `style.css`, about 40 literal text and panel colours (appendix A, "Interface surfaces and text" and
  "Interface emphasis") become tokens.
- The paper theme: the 73 `body.mode-staff` overrides (list in §3.1) are replaced by token values under
  `body.mode-staff`, extended to the panels that stay dark today (rail, drawer, sheet, tools, first-run card)
  or explicitly kept dark (open question 1).

### 12.2 Side (decision 1)
- `app.js:1080-1081` `SIDE_COL`: values from side tokens (three steps per side; the six roles stay).
- `app.js:1815-1830` `eventGlyph`, `app.js:1915` `buildEventLayer`: decision events take the side colour.
- `app.js:3796` event dossier bar: side token instead of `NATION.*.fill` and `#D9A64B`.
- `app.js:2307-2308` plan ribbons; `style.css:346-347` plan blocks; `style.css:377-379` timeline ticks
  (decision ticks: side colour and a distinct tick shape); `style.css:463-464` first-run side words.
- `symbols.js:83-94` counter frame: cased band (§10.1); selection ring outside it instead of `#F0C463`.

### 12.3 Status, claims, evidence (decision 3)
- `symbols.js:7-10` `TONE`: becomes the icon table (§10.3); `symbols.js:146-154` counter status pill: neutral
  plate, icon, text.
- `app.js:3536`, `3576` dossier status pills (inline `TONE` background) and `app.js:3537`, `3578`, `3807`
  claim pills; `style.css:127-129`, `277-279` pill styles (class names kept).
- `style.css:271-274` source tags; `style.css:481-488` layer and situation tags; `app.js:2141` and `3689`
  where they are written.

### 12.4 Confidence (decision 4)
- `symbols.js:85-87` remove all `setLineDash`; `symbols.js:71` drop the 82% opacity for reported only;
  `symbols.js:118-131` plated badge; ink extent (`grow`, `symbols.js:131`) updated for the badge.
- `shell.html:150`, `style.css:102`, `106`: legend entry replaced.

### 12.5 Accent, annotation and labels (decision 2)
- Every `--sun` use and `rgba(217,166,75,…)` tint in `style.css` (lines listed in appendix A) becomes
  `accent` or `accent-tint`, always paired with a bar, underline, weight or tint.
- `app.js:1157`, `1164` objectives; `app.js:1142` overlay labels; `app.js:1869` plateau label; `app.js:1010`
  movement trail (solid, `annotation`); `app.js:1844` plateau ring and `app.js:1888` selection ring (solid).
- `app.js:1000` formation names (open question 2); `symbols.js:166-173` place labels (height colour off
  amber); `symbols.js:184-199` plain label halo from tokens.
- Terrain analysis: `world.js:1316-1320`, `app.js:2450`, `app.js:3841` read one table with paper variants
  (§5.4). `TERRAIN_LINES` untouched.
- Going classes: `shell.html:153-157` read from the table in `world.js:534-539` (values unchanged).

### 12.6 Legend and first-run key
- `app.js:3214-3217` `COLOUR_KEY`: reads `NATION` and the side tokens; the words "blue", "green", "white",
  "amber" are unchanged, so the first-run sentence and the self-test's wording checks still hold.
- In-app self-test `app.js:4211-4214`: the reference colours come from the side tokens instead of
  `SIDE_COL.*.attack`. This keeps the same check (legend equals the drawing colour); it is not loosened.

### 12.7 Type (§8)
- `style.css`: 19 sizes to 7 steps (`t-*` custom properties, generated with the tokens); the 9 and 9.5 px
  rules raised to 10.5 px.
- `symbols.js` canvas fonts: families and sizes from `TOKENS`.

### 12.8 Expected effect on the checks

| check | expected | why |
|---|---|---|
| `npm run check:data` | **passes unchanged** | no guarded declaration changes: `NATION`, `STATUS`, `CLAIM`, `CLAIM_FROM_CONF`, `OVERLAYS`, `TERRAIN_LINES`, `SPEED_CEIL`, `GRADE_RANK`, `confAt` and the rest stay byte-identical; `TOKENS` is reported as an added declaration, which is allowed |
| `npm run check:baseline` | **fails by design** | the build changes; Part B records the new size and md5 |
| `css-test.js` | passes | every custom property declared in `style.css` (generated block); the required rules (`.pill.claim-fact`, `.tab-btn`, `.step`, and the rest) stay; the theme consolidation must not create duplicate top-level rules |
| `test.js`, `geo-test.js`, `terrain-test.js`, `audit.js`, `sim-test.js` | pass unchanged | no colour or type dependency |
| `redteam.js` | passes | new copy must not reintroduce retired phrases ("amber army" is one) |
| `runtime-test.js` | passes | `TOKENS` is plain data in the bundle; canvas calls go through the existing context stand-in; no `getComputedStyle` use in `tokens.js` |
| `npm run check:visual`, geometry (figures, camera, mist, sprites, render on demand) | unchanged | no geometry change |
| `check:visual`, `labels.pairs` | may change slightly | counter ink extents grow by the badge plate and keylines; the one allowed residual (hybrid-dimmed Walther/Nansouty) must not multiply |
| `check:visual`, `pixels.nearBlack` | small rise | keylines `#0A0E12` are near-black by the harness's definition (below 16/255); `solidBlocks` (8 x 8 blocks at 90%) should not change, since keylines are 1 unit wide |
| self-test item "first run: the colour key agrees with the legend" | passes | the sentence and swatches still equal the drawing colours |
| CI build-drift check | passes | the rebuilt HTML is committed with the sources |

Part B must also add a check for the token block (the build fails on drift, §5.1) and should add a contrast
check to the harness: the collector used for this specification (every visible text element per state,
composited over the bright and dark backdrops) as a Stage 1 threshold of 4.5:1.

## 13. Open questions for the owner

1. **Paper-map panels.** Should the whole interface turn light on the paper map (rail, dossier drawer,
   sheet, tools, first-run card included), or should every panel stay dark over the paper map? Today it is
   half and half, which is the source of nine contrast failures. Recommendation: whole interface light.
2. **Formation name labels** are tinted by nation today (`app.js:1000`). Keep the tint, or neutral text with
   nation shown only by the counter? Recommendation: neutral (hue on thin text is a weak channel).
3. **Evidence-layer and source tags:** extend decision 3 (neutral, icon and text) to "record /
   reconstruction / derived" and "documented / inference"? They repeat the side hues today.
   Recommendation: yes.
4. **A non-hue nation cue on counters** for greyscale and tritanopia: draw `NATION.tag` (FR, RU, AT, already
   in the data) small inside the frame? Recommendation: yes, below the arm glyph.
5. **A non-hue side cue on arrows** (Stage 2): chevrons on Allied arrows as on the plan ribbons, or a
   different arrowhead? Dashes are excluded (they mean "planned").
6. **Reported-only and dimmed counters:** drop the 82% opacity for "reported only" (the "?" says it), and
   keep counter text and badge at full opacity when a counter is dimmed by a highlight?
7. **Symbol scales:** confirm two named scales (figure scale about 60-70x; settlement scale about 12x)
   rather than one, since one factor for figures and buildings is impossible (a house at figure scale would
   be about 700 m long).
8. **Dashes elsewhere:** recommendation: keep dashes only where they mean "planned or intended" (plan
   links); make the movement trail, the selection ring and the plateau ring solid; keep the dashed valley
   and dead-ground analysis lines (terrain notation, explained in the legend).
9. **Minimum text size** of 10.5 px, and the seven-step scale.
10. **Ridge and escarpment colours** leave the amber axis (decision 2 read strictly); confirm, and confirm
    that the going class "hard for guns" stays amber until Stage 4.

## Appendix A. Colour inventory (fact)

Every colour literal in `style.css`, `shell.html`, `data.js`, `symbols.js`, `app.js` and `world.js` (533 occurrences), grouped by meaning, with file and line. `var(--…)` uses are counted in §12.1, not listed. Groups marked Stage 4 or Stage 6 are out of scope and documented only.

#### Nation colours (NATION, guarded by check:data) (9 values, 9 occurrences)

- `#16274A`: `data.js` 9
- `#1C3222`: `data.js` 10
- `#2A2720`: `data.js` 11
- `#2E5496`: `data.js` 9
- `#3E6B4A`: `data.js` 10
- `#4A4638`: `data.js` 11
- `#D9D2BF`: `data.js` 11
- `#E9F2E9`: `data.js` 10
- `#EAF0FA`: `data.js` 9

#### Side colour: movement arrows (SIDE_COL) (8 values, 12 occurrences)

- `#2F6BC4`: `app.js` 1080
- `#4C86D8`: `app.js` 1080, 1080
- `#6E9BD0`: `app.js` 1080, 1080
- `#7FA6CE`: `app.js` 1080
- `#C85A2C`: `app.js` 1081
- `#C98E58`: `app.js` 1081, 1081
- `#CB9366`: `app.js` 1081
- `#D4703A`: `app.js` 1081, 1081

#### Side colour: event markers (4 values, 7 occurrences)

- `#7FB0F0`: `app.js` 1818, 1915
- `#D9A64B`: `app.js` 3796
- `#E7C069`: `app.js` 1818, 1915
- `#EC9A5E`: `app.js` 1818, 1915

#### Side colour: plan ribbons (4 values, 4 occurrences)

- `#0E2748`: `app.js` 2308
- `#4B8CE0`: `app.js` 2307
- `#50230A`: `app.js` 2308
- `#E07A2E`: `app.js` 2307

#### Side colour in the interface (7 values, 7 occurrences)

- `#3C6EB4`: `style.css` 346
- `#4B8CE0`: `style.css` 377
- `#7FB0F0`: `style.css` 463
- `#C2632F`: `style.css` 347
- `#E07A2E`: `style.css` 378
- `#E0A94B`: `style.css` 379
- `#EC9A5E`: `style.css` 464

#### Plans: divergence links (1 values, 1 occurrences)

- `#E8DCC0`: `app.js` 2268

#### Movement trail of the selected formation (1 values, 1 occurrences)

- `#D8C48A`: `app.js` 1010

#### Formation name labels (3 values, 3 occurrences)

- `#A9C6EE`: `app.js` 1000
- `#AED3AC`: `app.js` 1000
- `#EFE7D2`: `app.js` 1000

#### Status tones (TONE) (6 values, 6 occurrences)

- `#3F6FA6`: `symbols.js` 8
- `#63484A`: `symbols.js` 9
- `#7F847F`: `symbols.js` 8
- `#9E3D36`: `symbols.js` 9
- `#B8861F`: `symbols.js` 9
- `#C0602C`: `symbols.js` 8

#### Status and claim pills (5 values, 5 occurrences)

- `#2F6B48`: `style.css` 277
- `#6A4A6E`: `style.css` 279
- `#8A6A24`: `style.css` 278
- `#F7F2E6`: `style.css` 128
- `#FBF7EE`: `symbols.js` 153

#### Evidence tags: layer (record/recon/derived) and source (doc/inf) (11 values, 12 occurrences)

- `#8FA6C4`: `style.css` 486
- `#8FCFA8`: `style.css` 483
- `#9CC0EA`: `style.css` 273
- `#A9C4E8`: `style.css` 485
- `#E3BE78`: `style.css` 274, 484
- `rgba(138,106,36,.25)`: `style.css` 484
- `rgba(143,166,196,.35)`: `style.css` 487
- `rgba(217,166,75,.18)`: `style.css` 274
- `rgba(47,107,72,.25)`: `style.css` 483
- `rgba(78,123,174,.22)`: `style.css` 273
- `rgba(94,120,156,.28)`: `style.css` 485

#### Confidence badge and reported-only query (4 values, 4 occurrences)

- `#8A5F12`: `symbols.js` 120
- `#8A7A4E`: `symbols.js` 125
- `#D8B563`: `symbols.js` 125
- `#EFC468`: `symbols.js` 120

#### Derived reading: plateau ring and label (2 values, 2 occurrences)

- `#D8CFB6`: `app.js` 1844
- `#E3D9BE`: `app.js` 1869

#### Derived reading emphasis (2 values, 2 occurrences)

- `#E08A6A`: `style.css` 365
- `rgba(199,189,165,.28)`: `style.css` 479

#### Interface emphasis (selection, current, pressed) (19 values, 23 occurrences)

- `#101720`: `style.css` 35, 95, 331
- `#9B9585`: `style.css` 159
- `#D6CDB8`: `style.css` 150
- `#E8DCBC`: `app.js` 1888
- `#EBD7A8`: `style.css` 224
- `#F0C463`: `symbols.js` 90
- `#F2DCAE`: `style.css` 176
- `#F5E4BC`: `style.css` 226
- `rgba(10,14,19,.9)`: `style.css` 225
- `rgba(10,14,19,.92)`: `style.css` 601
- `rgba(12,17,22,.82)`: `style.css` 176
- `rgba(217,166,75,.06)`: `style.css` 48
- `rgba(217,166,75,.08)`: `style.css` 159, 414
- `rgba(217,166,75,.10)`: `style.css` 212, 254
- `rgba(217,166,75,.14)`: `style.css` 47
- `rgba(217,166,75,.38)`: `style.css` 177
- `rgba(217,166,75,.4)`: `style.css` 225
- `rgba(217,166,75,.5)`: `style.css` 160
- `rgba(217,166,75,.7)`: `style.css` 294

#### CSS custom properties (the only tokens today) (13 values, 13 occurrences)

- `#0C1116`: `style.css` 2
- `#131A21`: `style.css` 2
- `#18212A`: `style.css` 2
- `#2E5496`: `style.css` 6
- `#3E6B4A`: `style.css` 6
- `#5C666E`: `style.css` 4
- `#7C858E`: `style.css` 4
- `#CABFA8`: `style.css` 4
- `#D9A64B`: `style.css` 5
- `#D9D2BF`: `style.css` 6
- `#E7DFCC`: `style.css` 4
- `rgba(199,189,165,.16)`: `style.css` 3
- `rgba(199,189,165,.30)`: `style.css` 3

#### Interface surfaces and text (41 values, 58 occurrences)

- `#101720`: `style.css` 450, 468
- `#95917F`: `style.css` 72
- `#9AA0A2`: `style.css` 386
- `#9EA5A3`: `style.css` 147
- `#ABA491`: `style.css` 172
- `#B0AB9B`: `style.css` 73
- `#B4AC99`: `style.css` 134, 140, 141, 270
- `#B8B09E`: `style.css` 448, 462
- `#C0B8A4`: `style.css` 394
- `#C4BCA8`: `style.css` 68
- `#EFE7D4`: `style.css` 447, 461
- `#F1E9D6`: `style.css` 67
- `rgba(0,0,0,.45)`: `style.css` 64, 497
- `rgba(0,0,0,.5)`: `style.css` 399, 443
- `rgba(0,0,0,.6)`: `style.css` 459
- `rgba(0,0,0,0)`: `style.css` 493
- `rgba(10,14,19,.72)`: `style.css` 326
- `rgba(10,14,19,.90)`: `style.css` 63
- `rgba(10,14,19,.96)`: `style.css` 182, 190, 191
- `rgba(11,15,20,.93)`: `style.css` 25
- `rgba(11,15,20,.95)`: `style.css` 441
- `rgba(11,15,20,.96)`: `style.css` 458
- `rgba(12,17,22,.86)`: `style.css` 339
- `rgba(12,17,22,.96)`: `style.css` 398
- `rgba(19,26,33,.82)`: `style.css` 92
- `rgba(199,189,165,.06)`: `style.css` 211, 253, 412
- `rgba(199,189,165,.07)`: `style.css` 46, 71
- `rgba(199,189,165,.08)`: `style.css` 132, 268
- `rgba(199,189,165,.10)`: `style.css` 220
- `rgba(199,189,165,.14)`: `style.css` 327
- `rgba(199,189,165,.16)`: `style.css` 288
- `rgba(199,189,165,.18)`: `style.css` 39, 119, 490
- `rgba(199,189,165,.20)`: `style.css` 325
- `rgba(199,189,165,.30)`: `style.css` 289
- `rgba(199,189,165,.46)`: `style.css` 290
- `rgba(199,189,165,.5)`: `style.css` 94, 474
- `rgba(207,196,172,.28)`: `style.css` 339
- `rgba(207,196,172,.55)`: `style.css` 341
- `rgba(255,255,255,.55)`: `style.css` 380
- `rgba(5,8,11,.30)`: `style.css` 493
- `rgba(8,11,15,.72)`: `style.css` 165

#### Paper-map (staff) theme overrides (38 values, 73 occurrences)

- `#14120C`: `style.css` 79, 217, 246, 285, 368, 420, 453, 610
- `#1A1710`: `style.css` 216
- `#2A2620`: `style.css` 336
- `#2E2B1E`: `style.css` 84, 391, 543, 609
- `#33301F`: `style.css` 80, 454
- `#3A362B`: `style.css` 418
- `#3F5A80`: `style.css` 488
- `#46422F`: `style.css` 101
- `#5E5947`: `style.css` 214, 366
- `#6B6553`: `style.css` 83, 202, 203, 286, 298, 335, 390
- `#7B7563`: `style.css` 245, 369, 419
- `#857F6B`: `style.css` 215, 429
- `#8A5F12`: `style.css` 78, 218, 367, 430
- `#9A6F1E`: `style.css` 77, 217, 246, 430, 609
- `#F2EEE2`: `style.css` 336
- `rgba(0,0,0,.30)`: `style.css` 77
- `rgba(154,111,30,.13)`: `style.css` 217
- `rgba(238,233,220,.95)`: `style.css` 185
- `rgba(238,233,220,.97)`: `style.css` 192, 193
- `rgba(243,238,226,.8)`: `style.css` 334
- `rgba(243,238,226,.9)`: `style.css` 101
- `rgba(243,238,226,.94)`: `style.css` 76
- `rgba(243,238,226,.95)`: `style.css` 609
- `rgba(243,238,226,.96)`: `style.css` 452
- `rgba(243,238,226,.97)`: `style.css` 417
- `rgba(40,36,28,.06)`: `style.css` 216
- `rgba(40,36,28,.12)`: `style.css` 82
- `rgba(40,36,28,.14)`: `style.css` 335
- `rgba(40,36,28,.18)`: `style.css` 232
- `rgba(40,36,28,.2)`: `style.css` 101, 389
- `rgba(40,36,28,.20)`: `style.css` 81
- `rgba(40,36,28,.22)`: `style.css` 76, 185, 295, 334
- `rgba(40,36,28,.25)`: `style.css` 417, 452, 609
- `rgba(40,36,28,.32)`: `style.css` 543
- `rgba(40,36,28,.35)`: `style.css` 296
- `rgba(40,36,28,.45)`: `style.css` 102
- `rgba(40,36,28,.5)`: `style.css` 297
- `rgba(63,90,128,.4)`: `style.css` 488

#### Legend and first-run key (4 values, 4 occurrences)

- `#9A9384`: `style.css` 98
- `rgba(0,0,0,.5)`: `style.css` 105
- `rgba(0,0,0,.55)`: `style.css` 590
- `rgba(10,14,19,.72)`: `style.css` 99

#### Counter text, halo (6 values, 6 occurrences)

- `#25231D`: `symbols.js` 33
- `#5D5A4E`: `symbols.js` 35
- `#B9B5A8`: `symbols.js` 35
- `#F2EEE4`: `symbols.js` 33
- `rgba(10,14,18,.86)`: `symbols.js` 34
- `rgba(246,241,229,.92)`: `symbols.js` 34

#### Label halo (plain labels) (2 values, 2 occurrences)

- `rgba(246,241,229,.9)`: `symbols.js` 194
- `rgba(8,12,16,.72)`: `symbols.js` 194

#### Place labels (feature glyphs) (12 values, 12 occurrences)

- `#141A20`: `symbols.js` 173
- `#3A362C`: `symbols.js` 166
- `#3C6A86`: `symbols.js` 168
- `#6B5B45`: `symbols.js` 170
- `#7A5C22`: `symbols.js` 169
- `#8FB6CC`: `symbols.js` 168
- `#B0A48C`: `symbols.js` 170
- `#D9BC7A`: `symbols.js` 169
- `#E8E2D3`: `symbols.js` 166
- `#F6F1E5`: `symbols.js` 173
- `rgba(10,14,18,.8)`: `symbols.js` 167
- `rgba(246,241,229,.9)`: `symbols.js` 167

#### Overlay annotations (labels, objectives) (3 values, 4 occurrences)

- `#B9B0A0`: `app.js` 1138
- `#CDC4B2`: `app.js` 1142
- `#EFC468`: `app.js` 1157, 1164

#### Terrain analysis lines and labels (10 values, 15 occurrences)

- `#6FA0B8`: `app.js` 3841; `world.js` 1318
- `#9080B4`: `app.js` 3841; `world.js` 1320
- `#93BFD4`: `app.js` 2450
- `#B4A6D6`: `app.js` 2450
- `#C2743C`: `app.js` 3841; `world.js` 1317
- `#D05A4C`: `app.js` 3841; `world.js` 1319
- `#D8A05A`: `app.js` 3841; `world.js` 1316
- `#DA9366`: `app.js` 2450
- `#E7BC7C`: `app.js` 2450
- `#E88377`: `app.js` 2450

#### Dossier header bars (1 values, 1 occurrences)

- `#8A8570`: `app.js` 3723

#### Compass rose (3 values, 4 occurrences)

- `#3E4A54`: `shell.html` 141
- `#6E7A84`: `shell.html` 138
- `#CABFA8`: `shell.html` 140, 142

#### Terrain: going classes (legend in shell.html) (6 values, 11 occurrences)

- `#36505E`: `shell.html` 157; `world.js` 534
- `#6B5A3E`: `shell.html` 156; `world.js` 535
- `#6E8A5A`: `shell.html` 153; `world.js` 539
- `#8E4436`: `shell.html` 155; `world.js` 536
- `#A89A4C`: `world.js` 538
- `#B8863A`: `shell.html` 154; `world.js` 537

#### In-app self-test (3 values, 3 occurrences)

- `rgb("+((n>>16)`: `app.js` 4211
- `rgb(hex)`: `app.js` 4211
- `rgb(k[1])`: `app.js` 4214

#### Developer overlay (3 values, 3 occurrences)

- `#CFE3C8`: `style.css` 614
- `rgba(160,200,150,.25)`: `style.css` 615
- `rgba(4,8,10,.84)`: `style.css` 615

#### Lighting, sky, fog, sun (Stage 4, out of scope) (70 values, 85 occurrences)

- `#0C1420`: `app.js` 138
- `#0C1522`: `app.js` 139
- `#0D1520`: `app.js` 114
- `#0F1A26`: `app.js` 115, 146
- `#121A22`: `app.js` 204
- `#131D28`: `app.js` 135
- `#152029`: `app.js` 117
- `#152130`: `app.js` 132
- `#152230`: `app.js` 129
- `#16232D`: `app.js` 126
- `#171C21`: `app.js` 141, 142, 142, 142
- `#17242E`: `app.js` 120
- `#18262F`: `app.js` 123
- `#1B2836`: `app.js` 118
- `#24313E`: `app.js` 121
- `#243346`: `app.js` 136
- `#2A2A24`: `app.js` 177
- `#2A3D52`: `app.js` 124
- `#2B3A48`: `app.js` 115, 146
- `#2E3948`: `app.js` 139
- `#2E4358`: `app.js` 133
- `#2E4560`: `app.js` 127
- `#334C68`: `app.js` 130
- `#3E3A30`: `app.js` 222
- `#3E4852`: `app.js` 115
- `#3E4A58`: `app.js` 205
- `#4A4C54`: `app.js` 139
- `#4A5666`: `app.js` 114, 115
- `#4A5866`: `app.js` 118
- `#565A64`: `app.js` 138, 139
- `#66717A`: `app.js` 121
- `#6E7A82`: `app.js` 146
- `#6E7A88`: `app.js` 136
- `#787A7E`: `app.js` 117, 118
- `#7A8D9C`: `app.js` 124
- `#82878A`: `app.js` 120, 121
- `#8393A2`: `app.js` 133
- `#8497A8`: `app.js` 127
- `#8898A6`: `app.js` 129, 130
- `#8A8884`: `app.js` 118
- `#8C8A8A`: `app.js` 135, 136
- `#8C949A`: `app.js` 126, 127
- `#8E9498`: `app.js` 132, 133
- `#8E959A`: `app.js` 123, 124
- `#8EA0B0`: `app.js` 130
- `#8FA2B6`: `app.js` 114
- `#9AA8B8`: `app.js` 224
- `#A4A7A6`: `app.js` 121
- `#A5B2BE`: `app.js` 226
- `#A9663E`: `app.js` 138
- `#A9BBCC`: `app.js` 222
- `#AE9E8E`: `app.js` 136
- `#B8BCBC`: `app.js` 127, 1395
- `#B9BEC2`: `app.js` 130
- `#BDB8B0`: `app.js` 133
- `#C0BCB2`: `app.js` 142
- `#C4BFB4`: `app.js` 124
- `#D8D2C0`: `app.js` 141
- `#D9B189`: `app.js` 117
- `#DCC3A2`: `app.js` 120
- `#F0B87C`: `app.js` 135
- `#FFD2A0`: `app.js` 123
- `#FFD69A`: `app.js` 132
- `#FFDFB2`: `app.js` 126
- `#FFEDD4`: `app.js` 129
- `#FFFFFF`: `app.js` 141
- `rgba(255,170,90,0)`: `app.js` 193
- `rgba(255,190,110,.35)`: `app.js` 193
- `rgba(255,222,160,.95)`: `app.js` 192
- `rgba(255,244,214,1)`: `app.js` 192

#### Smoke, dust, mist, sprite textures (Stage 4, out of scope) (11 values, 13 occurrences)

- `#2A2620`: `app.js` 989
- `#9AA3A8`: `app.js` 971
- `#A9A69E`: `app.js` 982
- `#C6BCA6`: `app.js` 995
- `rgba(0,0,0,.30)`: `app.js` 917
- `rgba(0,0,0,.55)`: `app.js` 917
- `rgba(0,0,0,0)`: `app.js` 880, 917
- `rgba(0,0,0,1)`: `app.js` 880
- `rgba(255,255,255,.22)`: `app.js` 929
- `rgba(255,255,255,.32)`: `app.js` 903
- `rgba(255,255,255,0)`: `app.js` 904, 930

#### Figures, equipment, standards and flags (Stage 6, out of scope) (27 values, 49 occurrences)

- `#1B1917`: `app.js` 410
- `#1C1A17`: `app.js` 513
- `#1D1B18`: `app.js` 438
- `#2A2622`: `app.js` 847
- `#2C4C9C`: `app.js` 840
- `#2E7A48`: `app.js` 842
- `#35322C`: `app.js` 690, 718, 802
- `#3A2E22`: `app.js` 513
- `#4A3826`: `app.js` 513
- `#4A3A2C`: `app.js` 418
- `#5A4232`: `app.js` 513
- `#5A4832`: `app.js` 690, 802
- `#6A5741`: `app.js` 718
- `#6A5B48`: `app.js` 824
- `#6B563C`: `app.js` 690, 718, 802
- `#787C82`: `app.js` 410
- `#8A8E92`: `app.js` 513
- `#B3302E`: `app.js` 840
- `#BDB8AC`: `app.js` 513
- `#C4BCA6`: `app.js` 668
- `#C8A03A`: `app.js` 846
- `#C9A98A`: `app.js` 513
- `#D8D1BC`: `app.js` 666
- `#E9E2D2`: `app.js` 840, 842, 845
- `#FFFFFF`: `app.js` 568, 576, 681, 681, 706, 707, 735, 770, 770, 778, 783, 784, 798, 798, 816, 816
- `rgb("+(r|0)`: `app.js` 397
- `rgba(0,0,0,.12)`: `app.js` 849

#### Terrain, water, vegetation, buildings, contours (Stage 4, out of scope) (72 values, 79 occurrences)

- `#17140C`: `world.js` 1252, 1287
- `#18242E`: `world.js` 363
- `#27332A`: `world.js` 1092
- `#2A2418`: `world.js` 1251, 1286
- `#2C3A2C`: `world.js` 1092
- `#2E2A26`: `world.js` 921
- `#30402F`: `world.js` 1092
- `#33402E`: `world.js` 480
- `#3A3028`: `world.js` 923
- `#3A4850`: `world.js` 480
- `#3E6D88`: `world.js` 1289
- `#403E39`: `world.js` 1079
- `#45423C`: `world.js` 1079
- `#46433A`: `world.js` 1133
- `#474540`: `world.js` 1079
- `#47575F`: `world.js` 363
- `#4A3E36`: `world.js` 969
- `#4A4741`: `world.js` 1079
- `#4E4136`: `world.js` 970
- `#4E4A3E`: `world.js` 1133
- `#4E4A43`: `world.js` 1079
- `#4E5650`: `world.js` 480
- `#4E5A4C`: `world.js` 888
- `#4E5C66`: `world.js` 873
- `#554C3E`: `world.js` 903
- `#574F42`: `world.js` 1133
- `#587A8E`: `world.js` 889
- `#5A4C3E`: `world.js` 923
- `#5C5F50`: `world.js` 480
- `#5D7C8C`: `world.js` 1289, 1310
- `#5F4E42`: `world.js` 1030
- `#5F5A4A`: `world.js` 480
- `#62634F`: `world.js` 480
- `#686659`: `world.js` 480
- `#6A665A`: `world.js` 480
- `#6E4C3E`: `world.js` 1030
- `#6E5629`: `world.js` 1287
- `#736A58`: `world.js` 902
- `#7C4536`: `world.js` 1030
- `#857A63`: `world.js` 901
- `#8A4A38`: `world.js` 1030
- `#8A7346`: `world.js` 1286
- `#8E8474`: `world.js` 919
- `#93553F`: `world.js` 1030
- `#959E9C`: `world.js` 363
- `#9C9078`: `world.js` 900
- `#A8BEC8`: `world.js` 481
- `#B2A894`: `world.js` 1022
- `#B9B2A2`: `world.js` 922
- `#BDB39F`: `world.js` 1022
- `#BFCBA8`: `world.js` 481
- `#C6B9A0`: `world.js` 363
- `#C8C0B0`: `world.js` 932
- `#C9BFAA`: `world.js` 1022
- `#CBD5C8`: `world.js` 481
- `#D1C7B2`: `world.js` 1022
- `#D2C4A4`: `world.js` 481
- `#D9D2C2`: `world.js` 916
- `#DCCFB4`: `world.js` 481
- `#DCD9BC`: `world.js` 481
- `#E2DCBA`: `world.js` 481
- `#E8DFC6`: `world.js` 481
- `#FFFFFF`: `world.js` 967, 968, 1081, 1094, 1128
- `rgba(0,0,0,.42)`: `world.js` 924
- `rgba(0,0,0,0)`: `world.js` 924
- `rgba(120,110,95,"+(0.03+hash2(i,7)`: `world.js` 917
- `rgba(190,198,204,.52)`: `world.js` 1391
- `rgba(190,198,204,0)`: `world.js` 1392
- `rgba(196,204,208,.86)`: `world.js` 1391
- `rgba(255,255,255,"+(hash2(r,k)`: `world.js` 935
- `rgba(60,40,30,"+(0.18+(r%2)`: `world.js` 934
- `rgba(70,62,52,.35)`: `world.js` 920

## Appendix B. Contrast measurements (fact)

Measured in the built page (method at the top). "On (worst)" is the composited background for the worse of the two backdrops. Opacity is folded into the text colour.

### B.1 Failing pairs (72)

| ratio | need | theme | size | text | on (worst) | panel | element | sample |
|---:|---:|---|---:|---|---|---|---|---|
| 1.03 | 4.5 | paper | 11.5 | `#14120C` | `#0B0F14` | rail | `button.tab-btn` | Plans |
| 1.37 | 4.5 | dark | 10.5 | `#5C666E` at 34% | `#0B0F14` | rail | `em` | Corps and Guard artiller |
| 1.37 | 4.5 | dark | 11 | `#5C666E` at 34% | `#0B0F14` | rail | `span.oob-str` | — |
| 1.60 | 4.5 | dark | 12.5 | `#7C858E` at 34% | `#0B0F14` | rail | `span.oob-name` | French guns on the heigh |
| 1.75 | 4.5 | paper | 11.5 | `#5E5947` at 40% | `#E3DED2` | timebar | `span.sep` | · |
| 1.76 | 4.5 | paper | 10.5 | `#D9A64B` | `#EAE5DA` | tourbar | `#tour-n` | 2 OF 9 |
| 1.78 | 4.5 | dark | 11.5 | `#7C858E` at 40% | `#0A0E13` | timebar | `span.sep` | · |
| 2.01 | 4.5 | dark | 11 | `#5C666E` at 66% | `#131A21` | drawer | `b` | 08:45 - 09:30 |
| 2.32 | 4.5 | dark | 11 | `#5C666E` at 78% | `#131A21` | drawer | `b` | 10:30 - 11:15 |
| 2.46 | 4.5 | dark | 9 | `#5C666E` | `#282A2A` | timebar | `b` | 04 |
| 2.63 | 4.5 | dark | 11 | `#5C666E` | `#28241C` | rail | `span.oob-str` | 6,600 |
| 2.63 | 4.5 | paper | 11 | `#7C858E` | `#DCD8CE` | legend | `#contour-val` | ≈ 9 m |
| 2.85 | 4.5 | paper | 9 | `#6B6553` | `#BAB5AA` | timebar | `b` | 04 |
| 2.86 | 4.5 | paper | 9 | `#46422F` at 60% | `#DCD8CE` | legend | `text` | N |
| 2.86 | 4.5 | paper | 11.5 | `#7C858E` | `#3A3F42` | tour-prev | `#tour-prev` | Back |
| 2.86 | 4.5 | paper | 11.5 | `#7C858E` | `#3A3F42` | tour-exit | `#tour-exit` | Leave the tour |
| 2.89 | 4.5 | dark | 10.5 | `#5C666E` | `#1C1D1A` | layerpop | `i` | Military symbols with co |
| 2.91 | 4.5 | dark | 11 | `#F7F2E6` | `#B8861F` | pill | `span.pill` | Heavily engaged |
| 2.92 | 4.5 | paper | 11.5 | `#7C858E` | `#383D41` | prevEv | `#prevEv` | ◄│ |
| 2.92 | 4.5 | paper | 11.5 | `#7C858E` | `#383D41` | prev | `#prev` | ◄ |
| 2.92 | 4.5 | paper | 11.5 | `#7C858E` | `#383D41` | play | `#play` | Play |
| 2.92 | 4.5 | paper | 11.5 | `#7C858E` | `#383D41` | next | `#next` | ► |
| 2.92 | 4.5 | paper | 11.5 | `#7C858E` | `#383D41` | nextEv | `#nextEv` | │► |
| 2.92 | 4.5 | paper | 11 | `#7C858E` | `#383D41` | t | `button.t.spd-btn` | ½× |
| 2.98 | 4.5 | dark | 9 | `#9A9384` at 60% | `#0B0F14` | legend | `text` | N |
| 2.99 | 4.5 | paper | 10 | `#857F6B` | `#E3DED2` | timebar | `button.act-btn` | The Allied Advance |
| 2.99 | 4.5 | dark | 11 | `#5C666E` | `#131A21` | drawer | `p.dh-sub` | 1re Div., IV Corps · Fra |
| 2.99 | 4.5 | dark | 11.5 | `#5C666E` | `#131A21` | drawer | `dt` | Strength |
| 2.99 | 4.5 | dark | 11 | `#5C666E` | `#131A21` | sheet | `h3` | Three layers |
| 2.99 | 4.5 | dark | 11.5 | `#5C666E` | `#131A21` | sheet | `dt` | Historical record |
| 2.99 | 4.5 | paper | 11 | `#5C666E` | `#131A21` | drawer | `p.dh-sub` | 1re Div., IV Corps · Fra |
| 2.99 | 4.5 | paper | 11.5 | `#5C666E` | `#131A21` | drawer | `dt` | Strength |
| 3.05 | 4.5 | paper | 17 | `#7C858E` | `#ECE7DC` | layerpop | `#layerclose` | × |
| 3.05 | 4.5 | paper | 11.5 | `#7C858E` | `#ECE7DC` | layerpop | `button.mode-btn` | Terrain |
| 3.23 | 4.5 | dark | 10.5 | `#5C666E` | `#0C1116` | pm-study | `div.tlabel` | Vantage |
| 3.23 | 4.5 | dark | 11 | `#5C666E` | `#0C1116` | layerpop | `span` | Map |
| 3.23 | 4.5 | dark | 10 | `#5C666E` | `#0C1116` | layerpop | `p.lp-lbl` | How the ground is drawn |
| 3.23 | 4.5 | paper | 10.5 | `#5C666E` | `#0C1116` | mode-staff | `div.tlabel` | Vantage |
| 3.26 | 4.5 | paper | 11.5 | `#6B6553` | `#C5C2B9` | viewmode | `button.vm-btn` | Watch |
| 3.27 | 4.5 | dark | 12 | `#5C666E` | `#0B0F14` | rail | `p` | 2 December 1805 · Moravi |
| 3.27 | 4.5 | dark | 11.5 | `#5C666E` | `#0B0F14` | rail | `button.tab-btn` | Analysis |
| 3.27 | 4.5 | dark | 10.5 | `#5C666E` | `#0B0F14` | rail | `em` | Napoleon I |
| 3.27 | 4.5 | paper | 12 | `#5C666E` | `#0B0F14` | rail | `p` | 2 December 1805 · Moravi |
| 3.27 | 4.5 | paper | 11 | `#5C666E` | `#0B0F14` | rail | `p.sechead` | What each army meant to  |
| 3.27 | 4.5 | paper | 10.5 | `#5C666E` | `#0B0F14` | rail | `h4` | Intent |
| 3.28 | 4.5 | dark | 11.5 | `#5C666E` | `#0B0F14` | viewmode | `button.vm-btn` | Watch |
| 3.29 | 4.5 | dark | 10 | `#5C666E` | `#0A0E13` | dispatch | `h4` | WHAT CHANGED AT 09:30 |
| 3.30 | 4.5 | dark | 9.5 | `#5C666E` | `#0A0E13` | timebar | `small` | 2 Dec 1805 |
| 3.30 | 4.5 | dark | 10.5 | `#5C666E` | `#0A0E13` | timebar | `#sb-label` | 1 km |
| 3.30 | 4.5 | dark | 11.5 | `#5C666E` | `#0A0E13` | timebar | `span.der` | on the heights: Allied ≈ |
| 3.30 | 4.5 | dark | 11 | `#5C666E` | `#0A0E13` | timebar | `span.why` | Every column that goes d |
| 3.30 | 4.5 | dark | 15 | `#5C666E` | `#0A0E13` | timebar | `#sit-close` | × |
| 3.30 | 4.5 | dark | 10 | `#5C666E` | `#0A0E13` | timebar | `button.act-btn` | The Allied Advance |
| 3.41 | 4.5 | paper | 11 | `#F7F2E6` | `#7F847F` | pill | `span.pill` | Concealed |
| 3.43 | 4.5 | paper | 11.5 | `#7B7563` | `#E3DED2` | timebar | `span.der` | on the heights: Allied ≈ |
| 3.57 | 4.5 | paper | 10.5 | `#7B7563` | `#EBE2D0` | layerpop | `i` | Military symbols with co |
| 3.67 | 4.5 | paper | 10 | `#8A5F12` | `#D9D0BB` | timebar | `time` | 04:00 - 07:00 |
| 3.70 | 4.5 | paper | 11 | `#46422F` at 72% | `#DCD8CE` | legend | `div.hint.keys` | study watch map only · m |
| 3.77 | 4.5 | dark | 12.5 | `#9EA5A3` at 66% | `#131A21` | drawer | `span` | Climbs the western slope |
| 3.79 | 4.5 | dark | 11 | `#9A9384` at 72% | `#0B0F14` | legend | `div.hint.keys` | study watch map only · m |
| 4.11 | 4.5 | dark | 10.5 | `#7C858E` | `#28241C` | rail | `em` | Louis Vincent de Saint-H |
| 4.18 | 4.5 | paper | 11.5 | `#7B7563` | `#0B0F14` | rail | `button.tab-btn` | Order of battle |
| 4.20 | 4.5 | paper | 10.5 | `#8A5F12` | `#E3DED2` | timebar | `span.act` | THE DECEPTION |
| 4.31 | 4.5 | paper | 11.5 | `#8A5F12` | `#E5E1D6` | dispatch | `#d-clock` | 04:00 - 07:00 |
| 4.34 | 4.5 | paper | 9.5 | `#6B6553` | `#E3DED2` | timebar | `small` | 2 Dec 1805 |
| 4.34 | 4.5 | paper | 10.5 | `#6B6553` | `#E3DED2` | timebar | `#sb-label` | 1 km |
| 4.37 | 4.5 | paper | 11 | `#5C666E` | `#E3DED2` | timebar | `span.why` | Every column that goes d |
| 4.37 | 4.5 | paper | 15 | `#5C666E` | `#E3DED2` | timebar | `#sit-close` | × |
| 4.41 | 4.5 | dark | 11 | `#9A9384` at 80% | `#0B0F14` | legend | `div.hint` | drag to orbit · scroll t |
| 4.43 | 4.5 | paper | 11 | `#46422F` at 80% | `#DCD8CE` | legend | `div.hint` | drag to orbit · scroll t |
| 4.44 | 4.5 | paper | 12 | `#6B6553` | `#E5E1D6` | dispatch | `b` | c. 01:00 |
| 4.44 | 4.5 | paper | 10 | `#6B6553` | `#E5E1D6` | dispatch | `h4` | WHAT CHANGED AT 04:00 |

### B.2 The 40 lowest passing pairs (of 120)

| ratio | theme | size | text | on (worst) | element |
|---:|---|---:|---|---|---|
| 4.68 | dark | 11.5 | `#7C858E` | `#131A21` | `button.t` |
| 4.68 | dark | 18 | `#7C858E` | `#131A21` | `#drawer-close` |
| 4.68 | dark | 12.5 | `#7C858E` | `#131A21` | `p.dh-cmd` |
| 4.68 | dark | 11 | `#7C858E` | `#131A21` | `span.pill.ghost` |
| 4.68 | dark | 12 | `#7C858E` | `#131A21` | `button.more-btn` |
| 4.68 | dark | 11.5 | `#7C858E` | `#131A21` | `button.linkb` |
| 4.68 | dark | 18 | `#7C858E` | `#131A21` | `#modal-close` |
| 4.68 | paper | 18 | `#7C858E` | `#131A21` | `#drawer-close` |
| 4.68 | paper | 12.5 | `#7C858E` | `#131A21` | `p.dh-cmd` |
| 4.68 | paper | 11 | `#7C858E` | `#131A21` | `span.pill.ghost` |
| 4.68 | paper | 12 | `#7C858E` | `#131A21` | `button.more-btn` |
| 4.74 | paper | 11 | `#2E2B1E` at 72% | `#DCD8CE` | `b` |
| 4.75 | dark | 12.5 | `#9EA5A3` at 78% | `#131A21` | `span` |
| 4.75 | dark | 11.5 | `#7C858E` | `#12181F` | `#tourbtn` |
| 4.75 | dark | 11.5 | `#7C858E` | `#12181F` | `#layersbtn` |
| 4.75 | paper | 11.5 | `#7C858E` | `#12181F` | `button.t.van-btn` |
| 4.75 | paper | 11.5 | `#7C858E` | `#12181F` | `#tourbtn` |
| 4.75 | paper | 11.5 | `#7C858E` | `#12181F` | `#layersbtn` |
| 4.77 | dark | 11.5 | `#7C858E` | `#12181F` | `#tour-prev` |
| 4.77 | dark | 11.5 | `#7C858E` | `#12181F` | `#tour-exit` |
| 4.77 | dark | 12.5 | `#7C858E` | `#12181F` | `#fr-watch` |
| 4.77 | dark | 12.5 | `#7C858E` | `#12181F` | `#fr-close` |
| 4.77 | paper | 11 | `#5C666E` | `#ECE7DC` | `span` |
| 4.77 | paper | 10 | `#5C666E` | `#ECE7DC` | `p.lp-lbl` |
| 4.77 | dark | 11.5 | `#7C858E` | `#11181F` | `#prevEv` |
| 4.77 | dark | 11.5 | `#7C858E` | `#11181F` | `#prev` |
| 4.77 | dark | 11.5 | `#7C858E` | `#11181F` | `#play` |
| 4.77 | dark | 11.5 | `#7C858E` | `#11181F` | `#next` |
| 4.77 | dark | 11.5 | `#7C858E` | `#11181F` | `#nextEv` |
| 4.77 | dark | 11 | `#7C858E` | `#11181F` | `button.t.spd-btn` |
| 5.06 | dark | 17 | `#7C858E` | `#0C1116` | `#layerclose` |
| 5.06 | dark | 11.5 | `#7C858E` | `#0C1116` | `button.mode-btn` |
| 5.06 | dark | 12.5 | `#7C858E` | `#0C1116` | `b` |
| 5.12 | dark | 12.5 | `#7C858E` | `#0B0F14` | `span.oob-name` |
| 5.12 | dark | 11.5 | `#7C858E` | `#0B0F14` | `#srcbtn` |
| 5.12 | paper | 11.5 | `#7C858E` | `#0B0F14` | `#srcbtn` |
| 5.12 | dark | 12.5 | `#7C858E` | `#0B0F14` | `p.fr-hint` |
| 5.14 | dark | 11 | `#7C858E` | `#0B0F14` | `#contour-val` |
| 5.16 | dark | 11.5 | `#7C858E` | `#0A0E13` | `span` |
| 5.16 | dark | 12.5 | `#7C858E` | `#0A0E13` | `span` |

## Appendix C. Typography inventory (fact)

CSS font sizes (`style.css`; selector at the line; media-query overrides from line 495 on):

| size (px) | rules |
|---:|---|
| 9 | `.rail-ticks b` 291, `.ltag` 481, `.tb-sit small` 486, `.act-btn` 514 (media query); compass "N" `shell.html:142` |
| 9.5 | `.src` 271, `.clockbox small` 284 |
| 10 | `.step time` 209, `#d-changes h4` 384, `.lp-lbl` 407, 425 |
| 10.5 | `.tlabel` 90, `#sb-label` 201, `.chap em` 255, `#chaptext .hh` 258, `.planblock h4` 351, `.tb-sit .act` 361, `.lp-row i` 411, `#tour-n` 446, `.oob-name em` 475 |
| 11 | `.sechead` 40, `.oob-head` 42, `.oob-str` 54, `.legend` 98, `.dh-sub` 123, `.pill` 128, `.sect h3` 137, `ol.tl li b` 146, `ol.tl li i` 148, `.sheet h3` 170, `.cmdrow dt` 269, `.speeds .t` 300, `.planauth` 350, 402, `.tb-sit .why` 433, `.tb-sit` 517, `.vm-btn` 532, `#selchip .sc-k` 604; developer overlay (monospace) 614 |
| 11.5 | `.mode-btn` 31, `#srcbtn` 57, `.dispatch .clock` 66, `button.t` 92, `.kv dt` 133, `.linkb` 155, `p.conf` 161, 224, 242, 328, 340, `.planblock .kv dt` 354, 360, `#d-changes li` 386, `.step span` 530 |
| 12 | `.brand p` 29, `.oob-row.sub2` 51, `.dispatch li` 70, `p.note` 159, `.muted` 261, `.cmdwho` 265, `.planblock .kv dd` 355, 473, 602 |
| 12.5 | `.oob-name` 53, `.dh-cmd` 125, `.kv dd` 134, `ul.bul li` 140, 145, `.step span` 210, 252, `#chaptext h3` 257, `.cmdrow dd` 270, `.lp-row b` 410, `#firstrun .fr-hint` 465, `#firstrun .fr-act .t` 593 |
| 13 | `#chaptext .prose` 259, `.planblock .prose` 352, `#tour-x` 553, `#firstrun p` 556 |
| 13.5 | `#tour-x` 510, `.dispatch p.lede` 522, 578 |
| 14 | `p.prose` 141 (serif), `.sheet p` 172 (serif), `.planblock h3` 348, `.ev-why` 394 (serif), `#tour-x` 448 (serif) |
| 14.5 | `.dispatch p.lede` 68 (serif), `#firstrun p` 462 (serif) |
| 15 | toast 176 (serif), 435 |
| 16 | `#sc-clear` 607 |
| 17 | `#boot p` 21 (serif), `#layerclose` 403, `#tour-t` 509, `#clockread` 526 |
| 18 | `#drawer-close` 115, `#modal-close` 173, `.dispatch h2` 520 |
| 19 | `#clockread` 283, `#tour-t` 447 (serif), `#firstrun h2` 555 |
| 20 | `.rail .brand h1` 491 |
| 21 | `#firstrun h2` 512 |
| 22 | `.brand h1` 28 (serif), `.dispatch h2` 573 |
| 23 | `.dh h2` 124 (serif), `#firstrun h2` 588 |
| 24 | `.sheet h2` 169 (serif) |
| 25 | `.dispatch h2` 67 (serif), `#firstrun h2` 461 (serif) |

Weights: 400 in every declared rule (`style.css:28`, `67`, `72`, `124`, `138`, `146`, `169`, `170`, `257`, `291`,
`348`, `351`, `384`, `410`, `447`, `461`, `463`, `464`, `466`, `482`, `541`, `605`) except `#vsbadge b` 500
(`style.css:226`).

Families: `--serif` "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif and
`--sans` ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, sans-serif (`style.css:7-8`);
monospace `style.css:614`; the compass "N" Georgia, serif (`shell.html:142`).

Canvas text (canvas units; on-screen size = units x the sprite's scale, §6.3 and §8.3):

| text | font | where |
|---|---|---|
| echelon (XXXX, XXX, XX, X) | 500 25 sans | `symbols.js:77` |
| commander name | 500 25 sans | `symbols.js:144` |
| designation, strength | 400 21 sans | `symbols.js:134`, `139` |
| status pill | 500 19 sans | `symbols.js:149` |
| grade letter | 500 19 sans | `symbols.js:126` |
| reported-only "?" | 600 22 sans | `symbols.js:121` |
| place label | 400 22 sans | `symbols.js:176` |
| plain labels | 400 serif at the size given: formation names 34 (`app.js:999`), overlay labels 30 (`app.js:1146`), plateau reading 30 (`app.js:1869`), terrain analysis 30 (`app.js:2466`), objectives 28 (`app.js:1164`) | `symbols.js:187` |

Canvas stacks: "ui-sans-serif, system-ui, sans-serif" and "'Iowan Old Style', Palatino, Georgia, serif",
shorter than the CSS stacks, so canvas and interface text can fall back to different faces on the same system.
