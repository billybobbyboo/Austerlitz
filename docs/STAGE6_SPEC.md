# Historical appearance: specification (Stage 6, Part A)

**Status: Part A merged (#39); the owner accepted every recommendation of §7 (decisions 96-110, §0.4). 6B in progress.** Part A changed no
source file, no data and no build. It was written against `main` at `f54fffa` (Stage 5G merged as
#38; with it Stage 5 is complete), whose build `austerlitz-command-map.html` is 1,528,608 bytes, md5
`4c12cac6d458b02e3282237f4d1abb92`. On it (the same build throughout: this part changes no source file) the checks were run and their
results are in §6.0. Line numbers refer to that commit; the code is the source of truth, not the documents.

Scope: the Stage 6 line of `docs/VISUAL_AUDIT.md` ("Uniforms, headgear, flags, each with a source and a grade", `:162`), which carries
high-impact opportunity 3 ("Historical appearance, evidence first, identity decoupled from coat colour", `:104-110`), and what the
records add to it (§0.2): the provisional standard ratio (decision 26), the figures' black (decision 84), the open questions of
`SOURCE_NOTE`, and the colour key that names coat colours. Parts 6B onward implement it; this part reads the code, measures, assembles
what evidence could be assembled, and specifies.

**Scope guard (the brief; kept).** Nothing is implemented; no source file changes behaviour; no data changes; the build is unchanged
(`check:baseline` passes on the 5G build, §6.0). Nothing is invented: no colour, pattern, regiment or distinction is asserted without a
source, and every claim is labelled **fact**, **disputed**, **derived**, **inference**, **uncertain** or **design decision**.

**The one limit that shapes this part (fact; stated first).** No external source could be read in this session. The environment's
network policy refuses every host that holds the sources (`curl` and the fetch tool: HTTP 403 on CONNECT, "EGRESS_BLOCKED"), among them
Wikipedia and Wikimedia Commons, Gallica, archive.org, HathiTrust, Google Books, the Musée de l'Armée, the Heeresgeschichtliches Museum,
the Hermitage, the Napoleon Series, the Brown University military collection and the Russian state libraries (the full list, §2.0); only
package registries answer. The search tool answered until the session's shared cap (200 searches) was spent, and what it returns is a
list of titles and links with a machine-written summary, which the project does not accept as a source (decision 42's rule: "No web
summaries or AI output as a source"). So **§2 is an evidence register, not evidence**: every external item in it is a **lead** (an
author, a title, a date, a link, what it is expected to show), labelled **uncertain**, with the grade it would carry **if** its source,
once read, says what the lead reports (written A\*, B\*, C\*). No external claim is graded A or B as verified. This follows decision 42:
"where a source cannot be read (network policy), that is said, the conflict is left unresolved with today's behaviour, and listed".
Reading the sources is the first part of Stage 6 (6B, §6), and it needs a session whose network reaches them (question 1).

**How this was established.** Every number below was produced by a script in `tools/stage6/` (committed; not bundled), run against the
build above. `census.js` reads the running page (the scene the visitor sees: every formation's block, its meshes, their colours, its
standards, the flag textures). The two page probes drive the built page in headless Chromium with software WebGL, as the Stage 0
harness does (`tools/stage2/page.js`, which injects `tools/visual/measure.js`, with the Stage 5 helpers of `tools/stage5/lib.js`), and
inject a **probe**: measurement code that changes the running scene (instance colours, the figures' fixed-part geometry, an added mesh,
the flags' textures) and restores it. The prototype colours, shapes and patterns are **measurement values chosen to stand for classes**,
not proposed values, and claim nothing about any regiment. Coverage and visibility are measured as rendered (two screenshots of the
same view; measure.js's darkness, text-contrast and confidence-share measures; the map layer's counts). Frame times are software
WebGL on the harness machine, comparable only with one another. Evidence is in `docs/stage6-evidence/` (its README lists every file,
its section and its script).

Labels, as the brief sets them: **fact** (read from the code or data, or measured), **disputed** (the leads disagree), **derived**
(computed from facts), **inference**, **uncertain** (reported by a lead, not verified), **design decision**; and in §3-§6
**recommendation** (a proposal for 6B onward) and **open** (needs the owner). **Appearance grades** (the brief's): **A** documented for
1805; **B** documented for the period and probable for 1805; **C** reconstructed or disputed. They are not the data's position grades
A/B/C (`data.js:3-4`), which grade where a formation stood; the two are kept apart by name. Owner decisions are cited by number (1-17
in `docs/VISUAL_SPEC.md`, 18-46 in `docs/STAGE2_SPEC.md`, 47-67 in `docs/STAGE3_SPEC.md`, 68-84 in `docs/STAGE4_SPEC.md`, 85-95 in
`docs/STAGE5_SPEC.md`); the next is 96.

| script | section | what it produces |
|---|---|---|
| `census.js [--json f] [--md f]` | 1 | from the running page at 09:30: the figure kit's every part (its size and its colour as drawn); per formation (all 41) its nation, arm, echelon and what its block holds (every instanced mesh, its count, its colours; the coat's instance colours and the share in a second nation's; the standards, the pole, the cloth; the counter's and name's colours); the flag textures sampled by area; where nationality is carried today (the legend's nation rows, the first-run key) |
| `scale-probe.js [--json f] [--md f] [--sheet f] [--only views]` | 3 | in every harness view: each figure on foot and each rider in the free rectangle projected part by part (the figure, its headgear, its coat, a facing at 4% of a man's height) and each standard's cloth: px on screen (median, 90th percentile, largest; counts at or above 1-64 px), per kind and per formation |
| `appearance-probe.js [--json f] [--md f] [--sheet f] [--only views] [--keys views] [--from f]` | 3, 4 | in every harness view: which formations' figures are drawn and whether each carries a name, a counter or a confidence mark (the side's colour); five prototype variants (coats; coats, headgear, facings, cuirasses and flags; that without each part) against the view: the share changed, px per figure, solid near-black, mean luminance, map text contrast as rendered, drops, the world pass, the confidence marks' share; each formation's coats keyed in turn so that their rendered colour is read today and in prototype, and the CIEDE2000 difference between formations of the two sides |
| `lib.js` | - | shared by the page probes: the views, the harness's own pointer path to the closest orbit (copied from `tools/visual/harness.js`), applying a view |

## 0. The decisions, the records, and where they disagree

### 0.1 Decisions that bind Stage 6 (quoted with file and line)

| # | decision (quoted or summarised, with its record) | what it means for Stage 6 |
|---|---|---|
| 1 | "Side symbology: French blue; Allied amber for arrows, event markers and counter frames. Nation colours stay as counter fills and figure coats." (`docs/VISUAL_SPEC.md:35`). Its own note: "Coats in nation colours are right for this convention, but `docs/VISUAL_AUDIT.md` (opportunity 3) plans historically accurate uniforms, where French dragoons and chasseurs wore green and the Chevalier Guard white. From Stage 6 a coat cannot carry nation; nothing in this specification relies on coats to carry nation or side." (`:36`) | The first half (side owns hue on symbology, the cased frame) binds every part. The words "and figure coats" are what Stage 6 would end: historical coats and nation-coloured coats cannot both hold (§0.3 item 1; question 2). |
| 4, 13 | Counter confidence by a plated badge, no dashed frames; "reported only" keeps its "?" (`docs/VISUAL_SPEC.md:39`, `:62`). | The counter stays the carrier of grade and of reported-only; Stage 6 adds nothing to the counter. |
| 6, 14 | "Miniature scale of figures, buildings and flags is deliberate; flags come to the same symbol scale in Stage 2." (`docs/VISUAL_SPEC.md:41`); "Named scales, stated in the legend or the sources sheet ... Flags join the figure scale in Stage 2." (`:63`) | Figures stay symbols "about 45-70× life" (`app.js:1706`, `:5986`): Stage 6 dresses symbols, it does not make them life-size. Proportions inside a figure (a hat to a man, a pole to a man) are the kit's own and can follow sources; the figure's size cannot. |
| 9 | "Neutral text; hue never on the text itself. In the landscape view, which draws no counters, a small side-coloured mark (blue or amber) sits beside each name." (`docs/VISUAL_SPEC.md:58`) | The name's side mark already carries side without the coat (§4). |
| 10, 3 | Evidence-layer and source tags neutral, by icon and text (`docs/VISUAL_SPEC.md:59`, `:38`). | An appearance's grade and source are shown as text with the existing tags, never as a hue. |
| 11 | "Nation tag on counters ... `NATION.tag` small below the arm glyph, read from the data without changing it." (`docs/VISUAL_SPEC.md:60`) | The counter carries nation in words (FR, RU, AT) whatever the coats are. |
| 15 | "Dashes mean 'planned or intended' only." (`docs/VISUAL_SPEC.md:64`; `binding-test.js` dash scan) | No appearance element may be drawn dashed or segmented; a flag's stripes are a painted texture, not a line drawer, and must stay so (§6.3). |
| 16, 38, 39, 62 | Type floors; map text on plates at AA as rendered; drops per view within `DROP_LIMIT`, never raised (`docs/VISUAL_SPEC.md:65`; `docs/STAGE2_SPEC.md:73-74`; `tools/visual/thresholds.js`). | Every appearance change alters the pixels under the map layer: AA as rendered and drops are measured per prototype (§3.3). |
| 19, 34, 35 | The display factor is presentation; at 1x "formations are drawn as their modelled footprints ...; buildings, trees, scrub, figures and standards are not drawn" (`docs/STAGE2_SPEC.md:68`). | Stage 6 matters at 4x and 10.33x, in "Landscape with counters" and at the eye level; not at 1x (no figures) and not on the paper map (counters only). Measured: §3.1. |
| 26, 36 | "Flags and standards join the figure scale (2B) with a provisional pike-to-man ratio, labelled provisional until Stage 6; state its basis." (`docs/STAGE2_SPEC.md:60`); "The provisional standard ratio 1.6 is accepted, labelled as proposed in §I.1 (a design rule, not a historical value)." (`:70`). §I.1: "It is not presented as the real ratio of a pike to a man, which is not sourced in this project ... 'to be replaced by a sourced ratio in Stage 6'" (`:633-640`). | Stage 6 replaces 1.6 with a sourced ratio **only when one is read** (§2.7; nothing in this part supports replacing it). |
| 47, 91 | Follow is `!freeCam` made visible; the eye-level vantage, the one camera path below the floor; at the eye "the observer's own side is drawn as its ground marks, not figures" (`docs/STAGE5_SPEC.md`, 5E as delivered). | At eye level (4x, 10.33x) the enemy in sight is drawn as figures, at 27-48 px; the largest figures are in the closest orbit, up to 181 px (§3.1). |
| 79 | "The paper map's ground colours into `TOKENS.sym.paperMap`; the landscape's in four named tables." (`docs/STAGE4_SPEC.md:162`). Its test leaves the figures out: "or in the figures, coats and flags, which are Stage 6's (formationAtlas, figKit, makeBlock, flagTexture)" (`css-test.js:136-142`). | Stage 6 ends that exemption: the figures' colours come from one table (§5). |
| 84 | "The figures' black (their hats and black kit) drawn at about 2.7% reflectance, #2E2B27 (was #1B1917, about 1%): still black; a rendering value, not a uniform change; Stage 6 sets the figures' colours from sources." (`docs/STAGE4_SPEC.md:167`; `app.js:822`) | The precedent for every drawn colour in Stage 6: the source names the colour, the drawn value is a rendering decision, lifted where the darkness threshold needs it (question 7). |
| 85, 87 | Spatial confidence on by default, in the side's colour (`docs/STAGE5_SPEC.md:172`, `:174`). | Every formation on the field has a ground mark in its side's colour: a side carrier that does not depend on the coat (§4). |

"Things that should not change" (`docs/VISUAL_AUDIT.md:137-144`) that Stage 6 touches: **formation modelling (battalions,
column-to-line, skirmishers, limbering, dipping standards)** (`:140`): the standard's dip on a broken, captured, encircled or repulsed
formation (`app.js:4177-4179`) is kept, whatever the cloth becomes; **the claim/grade/layer taxonomy and "derived" labelling** (appearance
grades are a new, separately named scale, §5); **the single-file, framework-free build on three.js r128**.

### 0.2 What the records say about Stage 6 (quoted with file and line)

| record | statement |
|---|---|
| `docs/VISUAL_AUDIT.md:104-110` (opportunity 3) | "**Historical appearance, evidence first, identity decoupled from coat colour.** French dragoons and chasseurs a cheval wore green; the Chevalier Guard wore white; coats cannot carry nationality once uniforms are accurate. Likely anachronisms to research before changing (not verified): French colours drawn as vertical tricolours (the 1804 lozenge pattern is the usual reconstruction for 1805; vertical bands from 1812); every figure in a shako (French line infantry of 1805 are usually shown in the bicorne; the shako from 1806); the Austrian flag design (white, gold border, black disc) matches no pattern identified. Keep the changelog's open questions open until sourced. Stage 6." |
| `docs/VISUAL_AUDIT.md:126-127` | "Scale: one man is 1.5 units (about 95 m of ground), houses about 90-160 m wide, flagpoles about 330 m, while frontages are true to scale. Deliberate miniature or not, it needs one stated convention." (written before decisions 14 and 26; the pole is now 3.17 units, about 200 m drawn: §1.4) |
| `docs/VISUAL_AUDIT.md:162` | "**Stage 6, historical appearance.** Uniforms, headgear, flags, each with a source and a grade." |
| `docs/VISUAL_SPEC.md:36` | Decision 1's note for Stage 6 (quoted in §0.1). |
| `docs/STAGE2_SPEC.md:625-640` (§I.1) | The standard today (then): "the pole is 5.2 units ... A standing figure is 1.98 units, so the pole top is 2.63 (3.28) figure heights"; the proposal and basis of 1.6, "to be replaced by a sourced ratio in Stage 6". |
| `docs/STAGE4_SPEC.md:823` | "**Not in Stage 4:** the uniforms, flags and figure coats (Stage 6)". |
| `docs/STAGE5_SPEC.md:21`, `:92` | "nothing from Stage 6 (uniforms, headgear, flags)"; "Not Stage 5: uniforms, headgear and flags (Stage 6, including the provisional standard ratio, decision 26)". |
| `CHANGELOG.md:542-545` (Stage 4E) | "The figures', coats' and flags' colours stay where they are (Stage 6), with one exception: **The figures' black** (owner decision 84) ... Still black; no hue, garment or headgear changes; not a uniform claim. Stage 6 sets the figures' colours from sources." |
| `CHANGELOG.md:2916` (Stage 1A) | "Uncertain: the real-world sizes used to state the symbol-scale factors are rough general values, not historical data; standard and flag dimensions are to be sourced in Stage 6." |
| `CHANGELOG.md:3295-3298` (Stage 0, deferred) | "Stage 6: uniforms, headgear and flags, research first. Observations from the audit, not acted on and still to be verified: French colours drawn as vertical tricolours (the 1804 pattern is the usual reconstruction for 1805); every figure in a shako (French line infantry of 1805 are usually shown in the bicorne); the Austrian flag design matches no pattern identified." |
| `CHANGELOG.md:3463-3466` (correction pass) | "Open questions (documented in the Sources panel; deliberately not resolved) 1. The pattern of Russian infantry flags. 2. Whether Grenz infantry wore brown in 1805." |
| `CHANGELOG.md:3476-3479` (correction pass) | "Deliberately not changed in this pass: Uniform, headgear and flag rendering; the Kobelnitz pond ...; and any visual redesign. Those belong to the next phase." |
| `data.js:764` (`SOURCE_NOTE`, guarded) | "Open questions, left unresolved rather than guessed: the pattern of Russian infantry flags; whether Grenz infantry wore brown in 1805; ..." |
| `app.js:1161-1166` | "they join the figure scale at a PROVISIONAL pole-top-to-figure ratio of 1.6, a design rule, not a historical value ... Provisional (Stage 2): to be replaced by a sourced ratio in Stage 6." |
| `app.js:5987` (the sources sheet) | "The standards' pole-to-figure ratio (1.6) is provisional: a design rule chosen so that the colour clears the ranks, not a sourced ratio, to be replaced in Stage 6." |
| `css-test.js:136-142` | The palette rule's exemption for "the figures, coats and flags, which are Stage 6's (formationAtlas, figKit, makeBlock, flagTexture)". |
| `runtime-test.js:543` | "the armies are ranks of figures now, with national colours on the standards" (it asserts only that the cloth has a texture, `:548`). |

Nothing else in `CHANGELOG.md` or the specifications names Stage 6, uniforms, headgear, flags or standards as Stage 6 work (fact: every
occurrence of "Stage 6", "uniform", "headgear", "shako", "bicorne", "flag", "standard", "coat" and "eagle" in the records was read).

### 0.3 Where the records disagree with each other, with the drawing, or with the leads (stated, not resolved)

Each is stated; none is resolved here.

1. **Decision 1 and opportunity 3 cannot both hold.** Decision 1 keeps "nation colours ... as counter fills and figure coats"
   (`docs/VISUAL_SPEC.md:35`); opportunity 3 says "coats cannot carry nationality once uniforms are accurate" (`docs/VISUAL_AUDIT.md:105-106`),
   and decision 1's own note agrees (`:36`). Stage 6 needs the owner to end the words "and figure coats" (question 2). Until then the
   coats are a convention, and nothing on screen says so (item 3).
2. **The drawing answers both open questions that `SOURCE_NOTE` keeps open.** `SOURCE_NOTE` lists "the pattern of Russian infantry flags"
   and "whether Grenz infantry wore brown in 1805" as "left unresolved rather than guessed" (`data.js:764`). The drawing guesses both,
   unlabelled: every Russian standard is "a green colour with a white cross" (`app.js:1151-1153`), and Kienmayer's Grenz infantry are
   drawn in `NATION.at.fill`, the Austrian white (`app.js:868`; census: `kienmayer`, coat `#D9D2BF`). The leads gathered (§2.4, §2.5)
   do not settle either question; they disagree, or point to a third answer (white field coats in 1805, brown or black home dress).
3. **The colour key names coats as nations.** The first-run card ("Blue is the French army. The Allies are green for Russia and white
   for Austria", `shell.html:306`, written by `app.js:5074-5076`), the legend's three nation rows (`shell.html:188-190`, swatches of
   `NATION` fills, shown wherever figures are drawn: `app.js:3997`) and tour stop 1 ("The blue army to the west is French; to the east
   are the Russians in green and the Austrians in white", `analysis.js:351`, guarded) all say what the coats are. They are true of the
   drawing only while coats are nation colours; the self-test pins the words (`app.js:7900-7916`). Stage 6 contradicts them by design;
   `TOUR` is guarded data, so rewording stop 1 is a data task (§6.1, question 13).
4. **The ratio is not to the man.** Decision 26 says a "pike-to-man ratio" and §I.1 a "pole-top-to-man ratio"; the code divides by
   `figureTop()`, the top of the figure kit's bounding box (`app.js:1169-1174`), which on foot is the **bayonet's tip** at 1.981 units,
   not the hat's top at 1.635 (census: `infFixed` steel part to 1.981; hat to 1.635); mounted it is the rider's hat at 2.015. So the
   drawn infantry pole (1.6 x 1.981 = 3.17 units) is **1.94 man-heights** to the hat's top (derived). §I.1 itself says "A standing figure
   is 1.98 units", so the record and the code agree with each other; what they call "the man" includes the musket. A sourced ratio
   (pole to a man's height) must say which height it divides by (§2.7, question 11).
5. **"Every figure in a shako" is exact, and wider than the audit says.** The kit's hat is named `shako` (`app.js:821`) and is a plain
   cylinder (radius 0.115-0.13, 0.27 tall, no peak) in the figures' black, on every man and every rider (census: the infantry and rider
   fixed geometries), so cuirassiers, dragoons, the Imperial Guard, gunners and the headquarters' escorts wear it too, not only the line
   infantry the audit names.
6. **Every leaf formation carries a standard of its nation, including batteries and headquarters.** The census finds a standard on
   `heightguns` (the French guns on the heights), on all three headquarters (`gqg`, `ahq`, `buxhowden`) and on every cavalry block
   (`app.js:991`, `:1048`, `:1127`). Whether artillery or a headquarters carried a colour in the field, and which cavalry carried
   standards, are questions for the evidence; the drawing asserts them (§2.2, §2.4, §2.5).
7. **Mixed formations wear one nation's coat.** Kienmayer's advance guard is drawn wholly in the Austrian white although its staff
   text names "hussars and Cossacks" (`data.js:450`), and the Cossacks were Russian (the leads; `data.js` does not say); the First
   Column's 250 cavalry and 64 guns and Bagration's cavalry and guns are drawn as infantry (`arm:"inf"`: `data.js`, census). This is
   the data's arm, not an appearance claim; the coat is (fact). The Fifth Column's 20% share in the Austrian coat (`f.mix`,
   `app.js:1081-1085`) agrees with its staff text ("the Austrian cuirassier brigades of Caramelli and Weber (about 1,100)" of 4,600-5,400:
   20-24%, derived).
8. **The audit's three anachronisms stay unverified.** The audit marks them "(not verified)" (`docs/VISUAL_AUDIT.md:106`) and the
   Stage 0 list "still to be verified" (`CHANGELOG.md:3296`). This part could not read a source either (the limit above). The leads
   bear on all three (§2.2-§2.5): they agree with the audit on the lozenge flag and on the Austrian flag (the drawn pattern matches no
   lead), and on the French line infantry's bicorne; they **disagree with the brief's own premise** on the Russian shako (leads give
   orders of 13 February 1805, not 1807) and on two coat colours (Russian dragoons and jägers light green until 1807; Austrian O'Reilly
   chevaulegers white, not green). None of it is verified, so none of it is acted on.
9. **The day's colour count.** The data's narrative gives "about 180 guns and 45 standards" (`data.js:126`). The leads give Napoleon's
   own counts as 40 (the proclamation) and 45 (a letter from Brünn), and Russian specialist counts of 29-30 or at most 25 Russian
   colours (§2.4). Out of Stage 6's scope (a narrative figure, not an appearance); recorded for a data task (§6.1).

### 0.4 Owner decisions 96-110 (the answers to §7 questions 1-15)

Part A merged (#39). Before 6B the owner opened the session's network to every host ("full" network access) and accepted the
recommendation of every question of §7, each as written there:

| # | question | decision |
|---|---|---|
| 96 | 1, reaching the sources | 6B runs in a session whose network reaches the sources (the owner set the environment's network access to full). (6B) |
| 97 | 2, decision 1's "and figure coats" | Ended: figures follow the sources; nation and side are carried only by symbology (the counters' bands and fills, the nation tag, the name's side mark, the ground marks, the arrows, the dossier). (6C, 6D) |
| 98 | 3, an honest drawing | Yes: the figures labelled as symbol colours with a generic cap where unsourced, and the three flag patterns replaced by plain, labelled cloths until their models are sourced (§6.4). (6C) |
| 99 | 4, where appearance data lives | A new guarded file, `appearance.js`, for the claims (classes, composition, colours carried, each with source and grade); a presentation table, `KIT`, for the drawn values and shapes (§5). (6B, 6C) |
| 100 | 5, granularity | Each drawn battalion or squadron takes a class in proportion to its formation's sourced composition, else the formation's dominant class; mixed-arm formations keep the arm the data gives them (no splitting in Stage 6). (6B, 6C) |
| 101 | 6, greatcoats | Drawn as the read sources show them worn on 2 December, by side and arm; while the evidence is disputed, the regulation coat, with the dossier saying greatcoats may have been worn. (6B, 6C) |
| 102 | 7, the drawn colour values | The source names the colour; the drawn sRGB is a design decision recorded in `KIT` with its basis; no drawn cloth (or black) darker than decision 84's `#2E2B27`. (6C, 6D) |
| 103 | 8, headgear silhouettes | One low-poly shape per sourced class; the generic cap where unsourced or disputed, with the dispute in the dossier. (6C) |
| 104 | 9, facings and lace | No regimental facings or lace drawn; class-level features only where sourced and large (a cuirass); the dossier says what was worn. (6C) |
| 105 | 10, the open questions of `SOURCE_NOTE` | Both stay open until read sources settle them; the Russian infantry's cloth and the Grenz drawn generic and labelled until then. (6B, 6D) |
| 106 | 11, the standard's ratio | The staff's top (with its finial or eagle) over the man's height to his hat's top, from a measured staff of the period and a sourced stature, per nation; if 6B finds none, 1.6 kept, labelled provisional, its wording corrected. (6B, 6D) |
| 107 | 12, a side cue always | With "Position confidence" off, a plain crisp footprint in the side's colour stays under every formation drawn as figures, in Study, Watch and Clean. (6C) |
| 108 | 13, tour stop 1 and the first-run key | Both reworded to name the symbology, not the coats (§4.3's wording); tour stop 1 in 6B (`TOUR` is guarded data), the first-run card in 6C. (6B, 6C) |
| 109 | 14, horses and equipment | Horses one brown unless 6B grades a horse colour A or B; gun carriages one colour unless each army's is sourced. (6B, 6C) |
| 110 | 15, the order | §6.4, then 6B, 6C, 6D, as recommended; the owner, having opened the network, asked for 6B first, so §6.4's honest drawing becomes the first commit of 6C, as §6.4 itself allows ("It could be the first commit of 6C"). (all) |

## 1. Today (fact; read from the code and from the running page)

### 1.1 The figure kit (`figKit`, `app.js:788-859`)

Every figure is one of five merged geometries, built once and shared by every formation; two instanced meshes per figure kind: the
coat, coloured per instance, and everything else, its colours baked into the vertices (`app.js:788-791`). Read from the running page
(`census.js`; extents in world units, one unit 63.20 m; every block is drawn at 1.25 times the kit, 0.86 of that in "Landscape with
counters", 0.80 of that when dimmed, `app.js:4316`):

| geometry | part | colour as drawn | height (units) | note |
|---|---|---|---|---|
| infantry coat (`infCoat`) | torso 0.36 x 0.56, two arms | the formation's coat (instance) | 0.62-1.18 | jittered 0.86-1.14 per figure (`app.js:876-891`, `:884`) |
| infantry fixed (`infFixed`) | legs | `#BDB8AC` (`BREECH`) | 0-0.62 | one legwear for every man |
| | head | `#C9A98A` (`SKIN`) | 1.185-1.415 | |
| | hat: a plain cylinder, radius 0.115-0.13 | `#2E2B27` (`BLACK`, decision 84) | 1.365-1.635 | named `shako` (`app.js:821`) |
| | pack | `#3A2E22` (`LEATHER`) | 0.81-1.11 | also on gunners |
| | musket; bayonet | `#4A3826`; `#8A8E92` | to 1.981 | the bayonet's tip is the kit's top |
| horse | body, neck, head, legs | `#5A4232` (`HORSE`) | 0-1.42 | one colour for every horse |
| | tail; saddle | `#2E2B27`; `#3A2E22` | | no shabraque, no horse furniture |
| rider coat (`rider`) | torso 0.32 x 0.50, arms | the formation's coat (instance) | 1.05-1.55 | |
| rider fixed (`riderFixed`) | head; hat (the same cylinder) | `#C9A98A`; `#2E2B27` | 1.565-2.015 | the hat on every rider: cuirassiers, dragoons, hussars, the Guard, escorts |
| | legs; sabre | `#BDB8AC`; `#8A8E92` | | |

No facing, collar, lapel, cuff, cuirass, plume, crest, mane, lace or shabraque is drawn anywhere (fact: the five geometries hold only the
parts above). The kit draws two figures, a man on foot and a rider; arm is told apart only by mounted or not, and by the block's layout.

Dead code (fact; never called or never drawn): `formationAtlas` and `pushBox` (`app.js:714`, `:757`), a canvas atlas of ranks with
hats, superseded by the kit; and seven shared geometries built by `initBlockGeo` and drawn by no mesh: `GEO.shako`, `GEO.bear` (a
bearskin's proportions, 0.42 tall), `GEO.musket`, `GEO.sabre`, `GEO.body`, `GEO.horse`, `GEO.rider` (`app.js:686-693`; census:
"Shared geometries never drawn").

### 1.2 What each block holds (`makeBlock`, `app.js:864-1142`)

| arm (data) | what is drawn | formations (census) |
|---|---|---|
| `inf`, `guard` | battalions of 24 men (8 files x 3 ranks), `clamp(round(strength/1150), 2, 7)` of them (`subUnits`, `app.js:781-786`), the front row `ceil(0.6n)` when n >= 5 (`app.js:1052-1075`); 16 skirmishers shown while going forward (`app.js:1090-1104`); 2 mounted officers in the coat (`app.js:1106-1107`); an attached battery where the data gives one (the Santon, `app.js:1109-1121`) | the 8 French line divisions, the Santon, the Guard infantry, the Grenadier Division; the Russian columns I-III, Kamensky, Miloradovich, Bagration, the Russian Guard infantry; Kollowrat |
| `mixed` | the infantry layout, and a row of riders behind, `clamp(round(strength/850), 5, 9)` (`app.js:1122-1126`) | Kienmayer (160 men, 10 riders) |
| `cav` | squadrons of 10 riders (5 files x 2 ranks), `clamp(round(strength/950), 2, 6)` (`app.js:1078-1080`); a share of riders in a second nation's coat (`f.mix`, `app.js:1081-1085`) | Bourcier, Kellermann, Nansouty, d'Hautpoul, Walther, the French Guard cavalry; the Fifth Column (18.3% of its 60 riders in the Austrian coat), the Russian Guard cavalry |
| `art` | `clamp(round(guns/2), 3, 8)` pieces with 5 gunners each **in the infantry kit, with musket and pack** (`app.js:1014-1025`); limbers and 4-horse teams while moving (`app.js:1026-1046`) | the French guns on the heights |
| `hq` | a marquee `#D8D1BC`, four tents `#C4BCA6`, 12 mounted escorts in the coat (`app.js:973-991`) | Napoleon's headquarters, the Allied headquarters, the Left Wing command |

Gun barrels `#35322C`, wheels `#6B563C`, trails `#5A4832`, limbers `#6A5741` (`app.js:999`, `:1027`): one carriage colour for every
army. Per formation, the census lists every mesh and count (`docs/stage6-evidence/census.md`).

### 1.3 The coat's colour, and `NATION`

The coat is `NATION[f.nation].fill` (`app.js:868`), each figure's instance multiplied by 0.86-1.14; a mixed column takes the second
nation's fill for its share (`app.js:1081-1085`). `NATION` (`data.js:8-12`, guarded by `check:data`):

| nation | `fill` (coat, counter fill, dossier bar, legend swatch) | `edge` (counter glyph) | `ink` (nation tag) | `tag` |
|---|---|---|---|---|
| fr | `#2E5496` | `#16274A` | `#EAF0FA` | FR |
| ru | `#3E6B4A` | `#1C3222` | `#E9F2E9` | RU |
| at | `#D9D2BF` | `#4A4638` | `#2A2720` | AT |

`NATION`'s uses (fact; every read of it in the code): the coats (`app.js:868`, `:1082`); the colour key behind the legend's nation rows
and the first-run card (`COLOUR_KEY`, `app.js:5050-5054`; `paintKey`, `:5056-5077`); the order of battle's dots (`app.js:5144`); "What
changed" (`app.js:5412`); the dossier's bar and nation name (`app.js:5517-5520`, `:5556-5560`); the counter's fill, glyph and nation tag
(`counterHTML`, `symbols.js:55-71`); the self-test's colour-key check (`app.js:7900-7916`). The side's colours (decision 1) are not
`NATION`'s: they are `TOKENS.sym.side` (`tokens.js`: French `#4C86D8`, Allied `#D4703A`, with deep, light and edge steps), read through
`sideOfNation` (`symbols.js:24`) by the counter's band (`symbols.js:63`), the name's side mark (`symbols.js:87`), the confidence marks
(`app.js:4325`), the arrows (`SIDE_COL`, `app.js:1826`) and the day-track. **Nothing that carries side reads the coat** (fact); the
legend's nation rows, the first-run key and tour stop 1 are the only places that tie a coat colour to a nation in words (§0.3 item 3).

### 1.4 Standards and flags (`app.js:1132-1198`)

- **How many**: infantry, Guard and mixed blocks one on every other front battalion (`app.js:1071`); cavalry, artillery and
  headquarters one (`app.js:991`, `:1048`, `:1127`). Census: 1 to 3 per block, 56 in all on the 32 blocks (13 blocks with one, 14 with two, 5 with three).
- **The pole and cloth**: a pole `#6A5B48`, 5.2 units before scaling (`GEO.pole`), and a cloth 2.4 x 1.4 (`GEO.flag`, proportion
  1.71:1), both scaled by `k = 1.6 x figureTop / (5.2 x tall)`, `tall` 1.25 for a single-standard block without skirmishers
  (`app.js:1161-1198`): the pole's top is 1.6 figure tops above the ground for every block (the self-test, `app.js:6840`). Drawn: an
  infantry cloth 1.46 x 0.85 units, a cavalry cloth 1.19 x 0.69, a battery's or headquarters' 1.17 x 0.68; an infantry pole 3.17 units
  (about 200 m drawn) (census).
- **The cloth's painting** (`flagTexture`, `app.js:1145-1160`; sampled by the census):

| nation | drawn | colours (share of the cloth) |
|---|---|---|
| fr | a vertical tricolour | `#2C4C9C` 34%, `#E9E2D2` 31%, `#B3302E` 34% |
| ru | "a green colour with a white cross" (the code's comment) | `#2E7A48` 74%, `#E9E2D2` 26% |
| at | "white with a gold border" and a black disc (the code's comment) | `#E9E2D2` 63%, `#C8A03A` 31%, `#2A2622` 4% |

  Each with faint vertical lines "a little cloth" (`app.js:1159`). One texture per nation: every French standard is the same, every
  Russian, every Austrian; the Fifth Column, mostly Russian with an Austrian share, carries a Russian one.
- **The dip**: the cloth tilts by 0.95 rad (54°) while the formation is broken, captured, encircled or repulsed (`app.js:4177-4179`,
  `placeStandards`' `tilt`): a status encoding the audit keeps (§0.1).

### 1.5 Where figures and standards are drawn

At 4x and 10.33x on the landscape and in "Landscape with counters" (smaller, `app.js:4316`); never at 1x (the footprint rule,
decision 34: `rec.block.visible` is false at true scale, `app.js:4314`); never on the paper map (counters only); at the eye level
(5E) at 4x and 10.33x the enemy in sight as figures, the observer's own side as ground marks only (`app.js:4312-4314`); at 1x the
footprint rule holds at the eye too (measured: `eye-zuran-1x` draws no figure, §3.1). Reported-only formations are
drawn as the C zone without figures (`app.js:4304`, `:4314`).

### 1.6 What `check:data` guards, and what pins today's appearance

`tools/visual/data-invariance.js:10-21` guards, byte for byte, `NATION`, `FORMATIONS` (its `nation`, `arm`, `mix`, `staff`, strengths),
`SOURCE_NOTE`, `TOUR`, `EVENTS` and the rest of the historical datasets, the geography and the model. It does **not** guard `figKit`,
`makeBlock`, `flagTexture`, `STD_RATIO`/`STD_POLE`, `COLOUR_KEY`, the shell's text or the tests: every appearance in §1.1-§1.4 is
presentation code, carrying historical meaning without a source.

Tests that pin today's appearance (each must change only to a decided rule, never be loosened): the self-test's colour key ("first run:
the colour key agrees with the legend, and the legend with what is drawn", which requires the words "Blue is the French army", "green
for Russia", "white for Austria" and the legend's swatches to equal `NATION`'s fills, `app.js:7900-7916`); the self-test's standards
ratio (`app.js:6840`); `runtime-test.js:543-549` (ranks of figures; a textured cloth); `css-test.js:136-142` (the Stage 6 exemption);
the harness's float check, which knows the kit's five geometries by name (`tools/visual/measure.js:321`), and its standards' foot check
(`measure.js:339-351`); the Stage 0 darkness limit, whose comment counts "shakos" among the small black details it allows
(`tools/visual/thresholds.js:123`).

### 1.7 The census (fact; `census.js`, `docs/stage6-evidence/census.md`)

41 formations, 32 drawn as blocks and 9 aggregates (counters and names only). Of the 32: 3 headquarters, 1 battery, 8 cavalry (one with
a second nation's share), 1 mixed, 19 infantry (2 of them Guard). By nation: 19 French, 11 Russian, 2 Austrian blocks; 2,942 figures on
foot (with skirmishers and gunners) and 324 riders in all. **Every** man and
rider wears the black cylinder; **every** coat is its nation's fill (one block with a 18.3% share in a second); **every** man wears the
same legwear and **every** horse the same brown; **every** block carries 1-3 standards of its nation's one pattern. The appearance the
visitor sees is therefore three uniforms (blue, green, white) with one hat, one horse and three flags.

## 2. The evidence: a register of leads (nothing external read; §2.0)

### 2.0 What could be read, and how the register is graded (fact)

- **Read in this session:** the project's own files (the code, the data, the records). Nothing else.
- **Refused by the network policy** (HTTP 403 on CONNECT; the fetch tool: "EGRESS_BLOCKED"), tested from this session: Wikipedia (all
  languages) and Wikimedia Commons, Wikisource, Gallica, Retronews, Persée, archive.org and the Wayback Machine, HathiTrust, Google Books,
  Europeana, the Library of Congress, the Bodleian, the Bayerische Staatsbibliothek (digitale-sammlungen.de), ANNO (Austrian National
  Library), the Brown University military collection, the Musée de l'Armée, the Heeresgeschichtliches Museum, the Hermitage, the
  Fondation Napoléon, the Napoleon Series, runivers.ru, the Presidential and State Public Historical Libraries of Russia, the National
  Electronic Library of Russia, and (per the research notes) vexillographia.ru, memorandum.ru, militera, reenactor.ru, the auction houses
  whose catalogues describe surviving flags and eagles, and others. Only package registries (npm, PyPI) answer.
- **The search tool** returned page titles and links (real, and used here to identify leads) and a machine-written summary of the
  pages (not a source; used only to say what a lead is expected to show). It refused further searches once the session's shared cap of
  200 was reached.
- **Excluded:** a few texts that the research pass reached through copies held in other GitHub repositories (OCR of two 19th-century
  Russian periodicals; Project Gutenberg and Wikipedia copies). This session may read only its own repository; nothing from those copies
  is used, and the items they bore on are listed as unread leads.
- **So:** every external claim below is **uncertain** (a lead); its **grade** is written as the grade it would carry if its source, once
  read, says what the lead reports (A\*, B\*, C\*), or **C** where the leads themselves disagree. Nothing is graded A or B as verified.
  The full registers, row by row, with every link, are `docs/stage6-evidence/leads-*.md` (the README lists them); this section is
  their summary, with the leads to read first. Each register says what was searched and what was not reached before the cap.

**What this register is good for.** It is the reading list of 6B, and it already shows where the drawing is most likely wrong and where
the brief's own premises are contradicted (§0.3 item 8). It is not a basis for changing any drawing or datum.

### 2.1 France: uniforms

Register: `leads-fr-uniforms.md`. This pass identified almost no content-bearing lead for French dress before the search cap: most of
its rows are the question and the works that would settle it. They are given here as questions; where the project's own records already
make a claim (the audit), it is quoted as the record's claim, not verified.

| question | the records' claim, or what a lead is expected to show | label | grade if confirmed | leads to read first |
|---|---|---|---|---|
| line fusiliers' headgear on 2 December 1805 | The audit: "French line infantry of 1805 are usually shown in the bicorne; the shako from 1806" (`docs/VISUAL_AUDIT.md:108`). One lead (a search summary; page unclear: the Fondation Napoléon's article on the infantryman's pack, or a dealer's description of a 43e de ligne shako of the 1806 model): a decree of 25 February 1806 made the shako the line's headgear "starting from the year 1807". If confirmed, the fusiliers were in hats at Austerlitz and the drawn cylinder is wrong for them. Line regiments in shakos before 1806, and the speed of issue: no lead. | uncertain | A\* (the decree); practice C | Malibran, *Guide à l'usage des artistes et des costumiers* (1904); Bardin, *Dictionnaire de l'armée de terre* (1841-51), "Chapeau", "Schako"; the *Journal militaire* (an XII to 1806); P. L. Dawson, *Napoleon's Army at Austerlitz* (Frontline, 2025), said to draw on the 1805 inspection reports |
| line infantry coat, legwear; grenadiers' and voltigeurs' distinctions | No content-bearing lead. | - | - | Malibran; L. Rousselot, *L'Armée française: ses uniformes* (plates); Lienhart and Humbert, *Les uniformes de l'armée française* (1897-1906); the *Journal militaire* (the voltigeur decrees); Dawson |
| light infantry (the 10e, 17e and 26e Légère); the Tirailleurs du Pô and corses | No content-bearing lead; for the two tirailleur corps, no lead at all. | - | - | Malibran; Bardin; the Otto manuscript (about 1807); Rousselot |
| Oudinot's grenadiers: bearskins or shakos | **Open**; the texts that bear on it were reached only through excluded copies. | - | - | Thiers, *Histoire du Consulat et de l'Empire*, vols. V-VI (1845); Fezensac, *Souvenirs militaires* (1863); Coignet, *Cahiers* (1883); Pils, *Journal de marche* (1895); Dawson |
| the Guard infantry; the Grenadiers of the Italian Royal Guard | No content-bearing lead; for the Italians, no lead at all. | - | - | L. Fallou, *La Garde impériale* (1901); H. Lachouque on the Guard; the Italian specialist literature on the Kingdom of Italy's army |
| cuirassiers and carabiniers | The records name Nansouty's and d'Hautpoul's cuirassiers (`data.js:325-336`); the brief asks whether the carabiniers in Nansouty's division wore bearskins. Regiment names, the cuirass and helmet, the carabiniers' headgear: no content-bearing lead. | - | - | Duffy (1977), Smith (1998) and Nafziger for the regiments; Malibran; Rousselot |
| dragoons (Walther, Bourcier) and chasseurs à cheval | The audit: "French dragoons and chasseurs a cheval wore green" (`docs/VISUAL_AUDIT.md:104-105`), not verified. The helmet, the regiments present: no content-bearing lead. | uncertain (the record's claim) | B\* | Malibran; Rousselot; the Otto manuscript |
| hussars (Kellermann) | Which regiments (the data names none; it notes some orders of battle put the division under I Corps, `data.js`); their colours and headgear: no content-bearing lead. | - | - | Duffy; Smith; Nafziger; Malibran; Rousselot |
| the Guard cavalry (horse grenadiers, chasseurs à cheval, Mamelukes); the headquarters' escort | No content-bearing lead. | - | - | Fallou (1901); Roustam's *Souvenirs* (ed. Cottin, 1911); Marbot, *Mémoires*, vol. I (1891) |
| artillery and train | No content-bearing lead. | - | - | Malibran; Rousselot; Lienhart and Humbert |
| greatcoats on 2 December | Two leads conflict, neither read and neither naming an eyewitness: "most soldiers wore grey or brown capotes during the battle" (austerlitz.org, tertiary; a search summary) against "once battle was joined ... greatcoats were removed" (*Uniforms of Austerlitz*, ISBN 9781739695002, author not established; a search summary). This decides the colour a visitor should see more than any coat does. | **disputed** | C | the *Correspondance* (clothing orders, August-November 1805); Thiébault's *Mémoires* (1893-95; a brigade commander in Saint-Hilaire's division); Coignet; Fezensac; Pouget; Dawson |
| horse colours | No content-bearing lead. | - | - | Fallou; Malibran |

### 2.2 France: colours, eagles and standards (register: `leads-fr-colours.md`)

| question | what the leads are expected to show | label | grade if confirmed | leads to read first |
|---|---|---|---|---|
| the pattern carried in 1805 | The **1804 model**: a white lozenge with its points on the edges, the four corner triangles alternately blue and red; in gold, "L'EMPEREUR DES FRANÇAIS AU [n]e RÉGIMENT ..." on the face and "VALEUR ET DISCIPLINE" with the battalion's number on the back; the regiment's number in a laurel wreath in each corner. Every lead found agrees. | uncertain | A\* (an 1804-model object of a regiment present), else B\* | the 1804-model flag of the 1st battalion of the 111e de ligne (sale catalogue: Osenat, the Monaco palace collection, lot 202; resold Artcurial, sale 6146, lot 88-a: an object description; whether the 111e was at Austerlitz is itself to be checked against the order of battle); J. Regnault, *Les aigles impériales et le drapeau tricolore 1804-1815* (1967; Gallica ark:/12148/bpt6k3340531p); P. Charrié, *Drapeaux et étendards de la Révolution et de l'Empire* (Copernic, 1982) |
| the corner order | Which colour is in the upper corner at the hoist. | **disputed** (two tertiary pages give opposite orders, perhaps the two faces) | C | photographs of an object (the 111e flag) |
| the vertical tricolour | Equal vertical bands came with the **1812 model** (the proposal of commissaire ordonnateur Barnier, 9 February 1812). If confirmed, the vertical tricolour drawn today (§1.4) is about seven years early (inference from unread leads). | uncertain | B\* | the Fondation Napoléon's page on the 1812 model; the 1812 decisions (not located) |
| the cloth | About 80 cm square; the 111e flag catalogued at 79 x 79 cm. If confirmed, the drawn cloth's proportion (1.71:1, §1.4) is wrong for France. | uncertain | A\* (object) | the 111e lot |
| the eagle | Gilt bronze, cast by Thomire after Chaudet's model; the bird 21-22.5 cm high, about 31 cm with its socket ("caisson"), 1.76-1.9 kg (several surviving pieces as catalogued; one lot cites Charrié, *Les Aigles françaises (1804-1815)*, p. 121); distributed on the Champ de Mars on 5 December 1804; the 1804 eagle judged too heavy, lightened about 1810-1811. | uncertain | A\* (objects), B\* | sale catalogues (Osenat/Giquello, Monaco sale lots 200 and 203; Artcurial 1342/54-a); Charrié; the Fondation Napoléon's pages on the eagles |
| the pole | About 2.10 m, with or without the eagle (the leads say both); 1.90-2.50 m reported by re-enactors. | **disputed** | C | a measured 1804 staff (not found); Regnault; Charrié |
| how many | One eagle and flag per battalion (and per squadron) from 1804 until the decree of 18 February 1808 (one per regiment). How many were in the ranks on 2 December 1805: not sourced. | uncertain | B\* | the decree of 18 February 1808 (transcriptions found); D. Gorchkoff, *Revue historique des armées* 267 (2012), pp. 70-77; Regnault |
| cavalry, light infantry, artillery | One per squadron for every cavalry arm in 1804 (lead); a cavalry standard of about 60 cm square (lead, unattributed); Berthier's order of 25 September 1806 (after Austerlitz) left hussars' and chasseurs' eagles behind on campaign and let dragoons take one per regiment; an undated tertiary claim extends the restriction to light infantry. Field use in 1805 by light cavalry, dragoons or artillery: **no lead**. | uncertain; the two rules disputed | C | Regnault; Charrié; regimental histories (1er and 9e hussards; Michel-Béchet, *Historique ... du 11e hussards*, Gallica) |
| the Guard; the Italian Royal Guard | Whether the Guard's units present carried eagles, and what the Grenadiers of the Italian Royal Guard carried: **no lead** (the budget ran out). | - | - | Regnault; Charrié |
| uncased in action? | No lead says. The 4e de ligne's eagle was taken by the Russian Guard cavalry (the data says so, `data.js:101`, `:212`, `:598`, `:608`; the leads name privates of the Life Guard Horse Regiment); a capture in a cavalry mêlée is consistent with an uncased eagle but does not prove it (inference). Where that eagle is now: the leads conflict (the regiment's church until 1917; "the Hermitage"; no museum record found). | uncertain | C | *Mémoires du général Bigarré* (Paris, 1893; Bigarré commanded the 4e at Austerlitz), digitised by the Service historique de la Défense; the 30th Bulletin (3 December 1805); Stutterheim, *A Detailed Account of the Battle of Austerlitz*, trans. Pine Coffin (London, 1807) |

### 2.3 Russia: uniforms (register: `leads-ru-uniforms.md`)

| question | what the leads are expected to show | label | grade if confirmed | leads to read first |
|---|---|---|---|---|
| which regiments (beyond the data) | The Fifth Column's Russian horse: Grand Duke Constantine's Uhlans, the Elisavetgrad Hussars, the Kharkov and Chernigov Dragoons ("Gladkov", named in `data.js:558`, is in no lead). Bagration's advance guard: the 5th and 6th Jägers; the Arkhangelogorod, Old Ingermanland and Pskov Musketeers; the Pavlograd and Mariupol Hussars; **Her Majesty's Life Cuirassiers**; the Tver and St Petersburg Dragoons; horse batteries; Cossacks. | uncertain | B\* | the Napoleon Series' Russian-Austrian order of battle at Austerlitz; G. Nafziger's Austerlitz orders of battle |
| line infantry coat | The pattern of 30 April 1802: dark green, double-breasted, a standing collar and cuffs in a colour per Inspection, red lining, brass buttons, shoulder straps by regiment. | uncertain | B\* | A. V. Viskovatov, *Историческое описание одежды и вооружения российских войск* (St Petersburg, 1841-62), part 10, in M. Conrad's translation ("Vol 10B") |
| facing colours | By Inspection, per Viskovatov's table; **against it**, J. Gingerich ("Russian Infantry Facings - Inspection Era", Napoleon Series) holds that table to be an unimplemented proposal and gives his own from Russian journals. For Kamensky's brigade: the Fanagoria white collar and cuffs, red shoulder straps (Gingerich); the Ryazan yellow (tertiary). | **disputed** | C | Gingerich; Viskovatov part 10 |
| line infantry headgear on 2 December 1805 | **Disputed.** The orders (shakos for grenadiers and fusiliers on 13 February 1805, for musketeers in February 1805; for non-combatants 19 August 1803) are A\* as orders; what was worn that day is reported three ways: the bicorne and the 1802 grenadier caps (S. Bowden, *Napoleon and Austerlitz*, 1997, as reported), the shako (as reported of J. Cook and of I. Ulyanov's plates), or a mixture (the Pavlovsky Grenadiers still in 1802 caps at Friedland in 1807). **The brief's premise that the Russian shako came in 1807 is supported by no lead.** | **disputed** | C (practice); A\* (the orders) | Viskovatov part 10 (Conrad); the PDF on the 1805 headgear at reenactor.ru (authors probably Alexin and Ulyanov); I. Ulyanov, *Регулярная пехота 1801-1855* (1996) |
| jägers | Light green coats until 7 November 1807 (then dark green), so visibly lighter than the line; a round hat (the Life Guard Jägers' lost its brim in 1804). | uncertain | B\* | Viskovatov parts 10 and 14 (Conrad) |
| dragoons | Light green until 7 November 1807 (Viskovatov) **or** dark green from 1802 (one extract of V. Kovalsky); the black leather crested helmet of 18 October 1803. | **disputed** (coat); uncertain (helmet) | C; B\* | Viskovatov part 11 (Conrad); Kovalsky (museum.ru) |
| cuirassiers | **No cuirasses** between their abolition in 1801 and their return in 1812; the 1803 crested helmet. Her Majesty's Life Cuirassiers fought with Bagration without cuirasses (derived, if both leads hold). | uncertain | B\* | Viskovatov part 11; the regiment's history (vol. 1, prlib.ru) |
| hussars | Before 1809: Pavlograd a dark green dolman and turquoise pelisse; Mariupol a white dolman and blue pelisse; Elisavetgrad straw-yellow with red facings **or** grey (disputed); a shako from 1803 (tertiary). | uncertain; one disputed | B\*; C | Viskovatov part 11 (Conrad) |
| artillery | A dark green coat, black collar and cuffs piped red (1802). | uncertain | B\* | Kovalsky, "Организация русской полевой артиллерии к 1812 году" (museum.ru) |
| the Chevalier Guard, the Life Guard Horse, the Guard hussars and Cossacks, the uhlans, the Cossacks, the Guard infantry's facings, legwear, the artillery's headgear, the headquarters' escort | **No lead found** before the cap. The audit's "the Chevalier Guard wore white" (`docs/VISUAL_AUDIT.md:105`) is not verified here. | - | - | Viskovatov parts 14-18 (Conrad); the Soldiershop volume of Viskovatov's Guard cavalry plates |
| greatcoats | Bowden (1997), as reported: the Russians "hindered by their thick overcoats", the French ordered to drop packs and overcoats. No primary statement found; a soldier's memoir (I. O. Popadichev, recorded 1854) is a lead. | uncertain | C | Bowden; Popadichev; Langeron's and Ermolov's memoirs (not reached) |

### 2.4 Russia: colours and standards (register: `leads-ru-colours.md`; the open question stays open)

| question | what the leads are expected to show | label | grade if confirmed | leads to read first |
|---|---|---|---|---|
| the pattern (the open question) | Paul's **1797 pattern**: a square cloth of about 2 arshins (about 142 cm) made of pieces forming a cross and two-coloured corners, an orange central disc with a black double-headed eagle; one "white" colour (white cross) and nine "coloured" per regiment, issued 1797-1799, each regiment its own pair of colours; colours made permanent by a decree of 30 April 1797, so Paul's colours would still be carried in 1805 (inference). An **1800 pattern** with the Maltese cross went to some regiments; a **pattern of 10 June 1803** kept the size, fixed the central disc at 14 vershoks (62 cm, derived) and was issued as one white and five coloured. **Not established:** the corners' layout, where the Maltese cross stood, the corner devices, which regiments at Austerlitz had which pattern. | uncertain | B\* (1797, 1803); C (1800) | V. V. Zvegintsov's work on Russian colours (Paris, 1963-64; exact title not confirmed); Viskovatov (the part on Paul's reign); the PSZ decrees; T. N. Shevyakov's study of colours lost 1799-1917; vexillographia.ru (a finder) |
| how many per regiment | Ten (1797); two per battalion from 1802; one white and five coloured with the 1803 pattern; so four to six for a regiment at Austerlitz (inference). Which battalion carried the white colour: not sourced. | uncertain | B\*; C (the inference) | as above |
| the Guard | Not established for 1805 (pattern, number, honours). | - | - | Viskovatov; Zvegintsov |
| cavalry | From 1797 only cuirassiers and dragoons had standards (so hussars none, inference); a standard's cloth possibly 12 vershoks (53 cm, inference); the Don Host's white banner of 1800 (a Host banner, not a regiment's). Design and number per regiment: not sourced. | uncertain | C | Zvegintsov; Viskovatov part 17 (flags and standards) |
| the pole | 4½ arshins (320 cm) with a 24 cm finial, but the extract concerns Nicholas I's colours: **not to be applied to 1797-1803 unread**. The finial: a crowned eagle (1797) **or** Paul's cypher (1800): disputed. | uncertain; disputed | C | Zvegintsov; surviving colours in the Hermitage (inventory "Зн-") and the Artillery Museum |
| carried in action | The Azov regiment's colours at Austerlitz (a colour torn from its pole and saved; another found with its pole broken in two places, in a 2012 compilation's chapter): colours carried on their poles (inference). | uncertain | B\* | O. Goncharenko (comp.), *От Аустерлица до Парижа* (2012), chapters on the colours lost at Austerlitz and on the Azov regiment; Shevyakov |
| how many taken | Napoleon's proclamation of 3 December 1805: "quarante drapeaux" and the Russian Guard's standards; a letter from Brünn (9 or 11 December): 45; a Notre-Dame protocol of 19 January 1806 as reported by Russian specialists: 29-30 Russian colours, some bare poles; from French regimental histories: at most 25. | **disputed** | A\* (each as a claim); the count C | the proclamation and the *Correspondance* (napoleon.org, histoire-empire.org); the BnF's procès-verbal of the Notre-Dame service; E. P. Komarovskaya, *Власть* 2022 no. 6 |

### 2.5 Austria: uniforms and colours (register: `leads-at.md`; the open question stays open)

| question | what the leads are expected to show | label | grade if confirmed | leads to read first |
|---|---|---|---|---|
| which regiments | Kollowrat: Jurczek's single battalions of IR 1, 9, 29, 38, 49, 55 and 58; Rottermund's IR 23 (Salzburg) and the 6th battalions of IR 20 and IR 24. Liechtenstein's Austrian horse: the Nassau (Nr 5) and Lothringen (Nr 7) cuirassiers (Caramelli) and the Kaiser cuirassiers (Nr 1, Weber), about 1,100 (as `data.js:558`). Kienmayer: the 1st and 2nd Szekler Grenz (Nr 14, 15) and part of the Broder (Nr 7); O'Reilly chevaulegers (Nr 3); Hessen-Homburg (Nr 4) and Szekler (Nr 11) hussars; 40 Merveldt uhlans; Russian Cossacks. | uncertain | B\* | the Napoleon Series' order of battle; Nafziger; the *Schematismus* of 1805 |
| line infantry | The 1798 regulation (*Adjustierungsvorschrift*): a white coat with collar, cuffs and turnbacks in the regiment's facing colour; the 1798 black leather helmet with a raised comb and a black-over-yellow crest. Turnbacks white edged with the facing colour in another lead (**disputed**). Legwear, grenadiers' caps, the shako's date: **not sourced**. Whether the "6th battalions" were depot recruits or Mack's grenadier battalions (and so whether grenadier caps belong in the IV Column): **disputed**. | uncertain; disputed in part | B\* (coat, helmet); C | the hand-coloured plates of the new dress by Mansfeld after Kininger, published by Mollo (Vienna, about 1798); O. Teuber and R. von Ottenfeld, *Die österreichische Armee von 1700 bis 1867* (1895), plates 32-33; A. von Wrede, *Geschichte der k. und k. Wehrmacht*, vol. I (1898) |
| facing colours | Per regiment (IR 1 "pompadour" red, IR 9 apple green, IR 20 crab red, IR 23 poppy red, IR 24 dark blue, IR 29 white **or** pale blue, IR 38 rose, IR 49 pike grey, IR 55 pale blue, IR 58 black), from a table compiled for another year (its Inhaber names are not those of 1805). | uncertain; one disputed | C\* | the *Schematismus der kais. königl. Armée* for 1805 (Hungaricana; the Austrian State Archives' collection); Wrede |
| the Grenz (the open question) | The leads point one way: in 1805 the Grenz field coat was **white**, with blue Hungarian breeches, under the 1798 rule; **brown** was the home dress; brown became the field coat by the imperial resolution of 18 August 1808 and was adopted 1809-1813; the Szekler (Transylvanian) home dress may have been **black**. Unread; the question stays open. | uncertain | B\* (as rules) | the Mollo plates; Wrede; E. Acerbi's study of the Austrian army of 1805 (Napoleon Series); D. Hollins, *Austrian Auxiliary Troops 1792-1816* (Osprey MAA 299, 1996: Osprey, popular secondary) |
| cuirassiers | White coats, a front plate only, crested helmets; facings per regiment from a post-1805 table. | uncertain | B\*; C\* (facings) | Teuber and Ottenfeld, plate 35 ("Kürassiere 1798-1806"); the *Schematismus* |
| chevaulegers | O'Reilly (Nr 3) in **white**, not dark green, with poppy-red facings; in 1805 some chevauleger regiments green, some white. Contradicts the brief's assumption. | uncertain | B\* | the *Schematismus*; Wrede, vol. III; Haythornthwaite, *Austrian Army of the Napoleonic Wars (2): Cavalry* (Osprey MAA 181, 1986: Osprey, popular secondary) |
| hussars, uhlans | **Not sourced** (plates to read: Teuber and Ottenfeld 36, 37). | - | - | Teuber and Ottenfeld |
| artillery | Brown coats ("traditionally ... until the end of the Empire"); facings and headgear not sourced. | uncertain | B\* | Teuber and Ottenfeld, plate 39 ("Offizier und Kanonier der Artillerie ... 1798/1803") |
| generals | Teuber and Ottenfeld's plate 34, "General und Adjutant, Österreich, 1798/1805", exists (title only). | uncertain | - | that plate |
| colours: pattern | In 1805 mostly the **1792 pattern** (the cypher FII), older flags, and at most a few of the 1804 pattern (patent of 11 August 1804; production ordered 28 March 1805; "only a couple" made, per a lead). The **Leibfahne** white, the Madonna and Child on one side and the eagle on the other; the **Ordinarfahne** yellow with the black double-headed eagle (the Habsburg black and yellow); a border of "flames" in red, black, yellow and white (16 cm) **or** 12 cm, **or**, on the 1806 pattern, on three sides only. Cloth 161 x 142 cm. The drawn Austrian flag (white, gold bands, a black disc, §1.4) matches **none** of the leads. | uncertain; disputed in part | B\*; C | the Wikipedia article on the Austrian army's flags, **for its footnotes** (161 x 142 cm, 16 cm, 22 June 1805, 11 August 1804); Teuber and Ottenfeld (the flag figures); the HGM's 1792-pattern holdings; the Vinkhuijzen plates (New York Public Library) |
| colours: how many | Two per battalion until an imperial decree of 22 June 1805 reduced them to one (the Leib battalion the white Leibfahne, the others an Ordinarfahne); whether it had been carried out by 2 December: **not established**. For Kollowrat's single battalions, at most one flag each, most likely an Ordinarfahne (inference). | uncertain | A\* (the decree, if traced); C | Wrede (the decree, with page numbers) |
| cavalry standards | Four cavalry standards taken in the 1805 campaign bore Maria Theresa's cypher (the 1769-1780 pattern). Which arms carried standards, their types and size: **not sourced**. | uncertain | B\* | the Musée de l'Armée (the four Austrian flags of 1805 in Saint-Louis des Invalides: Austerlitz or Ulm is disputed) |

### 2.6 Disagreements (between the leads, and with the brief or the records; none resolved)

| question | position 1 | position 2 (and 3) | bears on |
|---|---|---|---|
| Russian line infantry's headgear on 2 December 1805 | the bicorne and the 1802 grenadier caps (Bowden 1997, as reported) | the shako, per the orders of February 1805 (as reported of Cook, of Ulyanov's plates); **or** a mixture | the headgear of the 6 Russian line infantry blocks (and perhaps the Guard's) |
| when the Russian infantry shako came | 1803 (non-combatants) and 13 February 1805 (combatants), in the leads | 1807 (**the brief's own premise**, supported by no lead) | the brief |
| Russian facing colours, 1802-1807 | Viskovatov's table by Inspection | Gingerich: that table an unimplemented proposal | facings, if drawn |
| Russian dragoons' coat in 1805 | light green until 7 November 1807 (Viskovatov) | dark green from 1802 (an extract of Kovalsky) | the Fifth Column's and Bagration's dragoons |
| the Elisavetgrad Hussars | straw-yellow with red facings until 1809 | grey (an extract dating grey to 1803-1805) | the Fifth Column |
| whether Russian hussars had standards | the brief assumes it | from 1797 only cuirassiers and dragoons (a lead) | standards drawn on Russian light cavalry |
| the Russian colour's finial | a crowned eagle (1797) | Paul's cypher (1800) | the finial, if drawn |
| colours taken at Austerlitz | 40 and the Russian Guard's standards (the proclamation); 45 (a letter from Brünn; the data's narrative, `data.js:126`) | 29-30 Russian (a Notre-Dame protocol, as reported); at most 25 (French regimental histories) | `data.js:126` (a data task, not Stage 6) |
| the French corner order | red-blue-red-blue clockwise from the top left (a tertiary page) | blue-red-red-blue (another page of the same site), perhaps the other face | the French cloth's painting |
| the French pole | 2.10 m including the eagle | 2.10 m below the eagle; 1.90-2.50 m (re-enactors) | the sourced ratio |
| French eagles in the field | Berthier's order of 25 September 1806: hussars and chasseurs leave them behind, dragoons take one | an undated claim: hussars, chasseurs, dragoons and light infantry never carried them in battle | standards on French cavalry and light infantry (for 1805 neither applies, unread) |
| where the 4e de ligne's eagle is | the Hermitage (tertiary) | the Life Guard Horse Regiment's church until 1917, later fate unknown | nothing drawn |
| greatcoats on 2 December | worn: "most soldiers wore grey or brown capotes during the battle" (French; tertiary); the Russians "hindered by their thick overcoats" (Bowden, as reported) | removed once battle was joined (*Uniforms of Austerlitz*, as relayed) | **the dominant colour of every block** |
| the Austrian flames | four colours (red, black, yellow, white), all round, 16 cm | 12 cm; on the 1806 pattern three sides, red and black or black, red and white | the Austrian cloth |
| the Leibfahne's image | the Virgin with the Child, on clouds, in a halo (the 1792 description) | an Immaculata with twelve stars (the 1806 pattern) | the Leibfahne, if drawn |
| Austrian infantry turnbacks | in the facing colour (the 1798 regulation, as reported) | white edged with the facing colour (an unattributed lead) | facings, if drawn |
| Kollowrat's "6th battalions" | depot battalions of recruits and convalescents | Mack's elite sixth battalions (grenadiers) | whether bearskins belong in the IV Column |
| IR 29's facings | white | pale blue | facings, if drawn |
| the Austrian chevaulegers | dark green (**the brief's assumption**) | white with poppy-red facings for O'Reilly (two hobby sources); some regiments green, some white in 1805 | Kienmayer's horse |
| the Grenz coat in 1805 (the open question) | brown (the common image) | white in the field under the 1798 rule, brown the home dress until 1808 (the leads); black for the Szeklers' home dress | Kienmayer's infantry |
| the four Austrian flags of 1805 at the Invalides | taken at Austerlitz ("presumably", a tertiary page) | taken in the 1805 campaign (Ulm is possible) | the best physical evidence of an 1805 Austrian flag |
| the Austrian cloth | 161 x 142 cm (the only figure found) | about 175 x 130 cm (**the brief's figure**, unsupported) | the Austrian cloth's proportion |

### 2.7 The standard's ratio (decision 26): nothing sourced

No lead gives a measured staff of 1797-1805 with a soldier's height; so **no sourced ratio exists in this part, and 1.6 stays
provisional** (derived checks, all on unread leads): France: an eagle's top at 2.10, 2.41 or 2.81 m (the reported staff with or
without the 0.31 m eagle) would make the present 1.6 the ratio for a man of 1.31, 1.51 or 1.76 m; Russia: a 4½-arshin staff with its
finial (a lead that concerns a later pattern) would stand 3.44 m, about 2.0 times a man of 1.70 m; Austria: no staff length found. A
sourced ratio also needs the denominator decided (§0.3 item 4): the man to his hat's top (1.635 units on foot) or the kit's top with
the bayonet (1.981), and whether the colour was grounded or carried in a socket (no lead). Question 11.

### 2.8 Not even a lead (said plainly)

French: the cravate; a measured 1804 staff; the bearer's rank in 1805; whether eagles were carried cased or uncased; field use of
eagles by light cavalry, dragoons or artillery in 1805; the Guard's and the Italian Royal Guard's colours; the Tirailleurs du Pô and
corses; museum inventory numbers for any 1804 flag or eagle. Russian: the corners of the 1797 cloth and its devices; where the Maltese
cross stood; which regiments had which pattern; which battalion carried the white colour; the Guard's colours; every cavalry standard
detail; the Chevalier Guard's, the Life Guard Horse's, the Guard hussars' and Cossacks', the uhlans' and the Cossacks' dress; the Guard
infantry's facings; legwear; the artillery's headgear; the headquarters' escort; horse colours (but one unverified hussar lead).
Austrian: legwear; grenadier caps; the shako's date; the Grenz headgear and facings; the hussars, uhlans, artillery headgear, generals'
and staff dress; horse colours; Grenz colours; which cavalry carried standards; pole length; cased or uncased; colours lost at Austerlitz
itself. All three: a soldier's height; any colour or uniform drawn by an eyewitness of 2 December 1805. The brief's note that Otto von Pivka was a
pen name of Digby Smith (the project's "Smith (1998)") was not checked: no source was read.

### 2.9 What to draw where nothing can be sourced: a generic, labelled appearance (recommendation; question 3)

Where a formation's appearance stays unsourced after 6B (or is graded C, disputed), Stage 6 should draw a **generic appearance that
claims nothing, and say so**:

| element | generic appearance | label (legend, sources sheet, dossier) |
|---|---|---|
| coat | the nation's symbol colour, as today (`NATION.fill`, the counter's fill: decision 1's symbology, not a cloth) | "drawn in its nation's symbol colour: not a uniform" |
| headgear | the plain cap drawn today (no peak, plume, crest or plate) | "a generic cap: the headgear is not sourced" |
| facings, lace, plumes, horse furniture | none | - |
| horse | one neutral brown, as today | "horses drawn in one colour" |
| standard | an unpatterned cloth in the nation's symbol colour, at the provisional ratio | "a generic colour: its pattern is not sourced" (for the Russian infantry, the wording of `SOURCE_NOTE`'s open question) |

Until 6B has read the sources, this is what **every** figure should be understood as, and it is almost what is drawn now, with two
differences: today nothing says it is generic, and the three flag patterns claim more than the evidence gives (the French vertical
tricolour, the Russian green colour with a white cross, the Austrian white, gold and black). Making today's drawing honest needs only
labels and three plainer cloths (§6.4); it changes no datum.

## 3. What can be drawn (fact: measured; inference where said)

### 3.1 A figure on screen, in px (fact; `scale-probe.js`, `scale-probe.md`, `scale-sheet.jpg`)

Every figure on foot and every rider whose foot lies in the free rectangle, projected part by part (median / 90th percentile / largest;
not occlusion-tested, so a figure behind a hill counts at the size it would have). A **facing** is a collar, lapel or cuff at 4% of a
man's height (7 cm of 1.75 m), 0.065 units on the kit's man: an inference from the proportion, not a drawn part.

| views (factor) | figures | a man | headgear (height) | coat (width) | a facing | a standard's cloth (width x height) |
|---|---|---|---|---|---|---|
| the Overview vantage: `overview-plan`, `ph8-overview-study`, `ph8-overview-watch` (4x and 10.33x), `plans-overview` | 1,772-2,120 on foot, 242-290 riders | 0.6-1.0 px (at most 2.4) | 0.1-0.16 px | 0.9-1.4 px | 0.02-0.04 px | 3.7-5.8 x 0.3-0.7 px (seen from above, edge on) |
| the Field vantage: `overview-field` (4x, 10.33x) | 1,850-1,861; 121-168 | 10.5-10.6 px (at most 14.0) | 1.7 px (at most 2.3) | 1.9 px | 0.42 px (at most 0.55) | 7.6-8.0 x 5.3 px (at most 13.7 x 7.3) |
| the middle views: `selected-formation`, `watch-selected`, `hybrid-dimmed` | 858-1,009; 73-155 | 14.6-17.3 px (at most 23.3) | 2.4-2.9 px (at most 3.9) | 2.7-4.2 px | 0.58-0.69 px (at most 0.93) | 11.5-13.5 x 7.8-9.2 px (at most 28.6 x 12.5) |
| the close views: `close-sokolnitz` (4x, 10.33x), `pratzen-low` (4x, 10.33x), `eye-zuran` | 48-1,238; 1-76 | 27-38 px (at most 64) | 4.5-6.3 px (at most 10.8) | 4.9-8.5 px | 1.1-1.5 px (at most 2.6) | 18-37 x 14-22 px (at most 74 x 35) |
| the closest orbit: `pratzen-orbit-min` | 799; 210 | 49 px (at most 181) | 8.3 px (at most 31) | 6.5 px (at most 47) | 2.0 px (at most 7.2) | 23 x 31 px (at most 254 x 271) |
| 1x: `pratzen-low-1x`, `eye-zuran-1x`; the paper map | 0 | - | - | - | - | - |

How many figures reach a size (on foot): the headgear at 4 px or more in 742 of 886 figures (`pratzen-low`), 1,035 of 1,238
(`close-sokolnitz`), all 48 (`eye-zuran`), all 799 (`pratzen-orbit-min`), and **none** in the Field vantage, the middle views or the
Overview; a facing at 1 px or more in 620-997 figures of the close views (all 48 at the eye level) and all 799 of the closest orbit, at
2 px or more in 0-120 of the close views and 386 of the closest orbit, at 4 px or more in **51 figures in one view** (`pratzen-orbit-min`), and in no figure of
any other view (`scale-probe.md`, second table).

### 3.2 What is legible, view by view (inference from §3.1; §3.3 measures it as rendered)

| element | where it can be told apart | where it cannot |
|---|---|---|
| **the coat's colour** | everywhere figures are drawn: at 1-2 px a man is a few pixels of the block's mass, and the mass takes the coat's colour (with the hats from above at the Overview) | at 1x and on the paper map (no figures) |
| **the headgear's shape** (a bicorne, a shako, a bearskin, a crested helmet differ by about a quarter of the hat's own size) | where the hat is 4 px or more: the close views, the eye level, the closest orbit | the Field vantage (1.7 px), the middle views (at most 3.9 px), the Overview (0.1 px): there a hat is one or two dark pixels whatever its shape |
| **a facing** (collar, lapels, cuffs) | as a feature, only in the closest orbit (51 figures at 4 px or more); at 1-2 px in the close views it is a **tint on the front of the figure**, not a feature | everywhere else (under 1 px) |
| **the standard's colours** | as colour masses wherever a cloth is drawn at 5 px or more (every view but the Overview's edge-on slivers) | the Overview (0.3-0.7 px tall) |
| **the standard's pattern** (the French lozenge's corners are half the cloth; a central device about a third of it) | the close views, the eye level, the closest orbit (cloth 18-37 px median), the larger cloths of the middle views (up to 28.6 px) | the Field vantage (7.6 px median, at most 13.7) and the Overview |
| **a horse's colour** | as the lower half of a rider's mass in the close views | elsewhere it merges with the rider |

So the visitor's main encounter with Stage 6 is **the colour of masses** (coats, and whatever covers them: greatcoats, cuirasses) in
every view, **the standards** (their colours everywhere, their patterns close up), and **headgear only close up**. Facings and lace are
below the drawn scale in every view but the closest orbit: drawing them per regiment would be detail no visitor can see (question 9).


### 3.3 The prototype, measured against the harness's thresholds (fact; `appearance-probe.js`, `appearance-probe.md`, `appearance-sheet.jpg`)

Five prototype variants against each view as it is (two screenshots each): **P1** the coats only (dark blue for the French line, light
infantry, cuirassiers and the Guard; a dragoon green for the French dragoons, light cavalry and Napoleon's escort; a dark green for the
Russians; white for the Austrians and the Russian Guard cavalry); **P2** the coats with headgear (bicorne, shako, bearskin, a crested or
maned helmet, a busby), facings (collar, lapels, cuffs), cuirasses and the flags repainted (the 1804 lozenge, a cross-and-disc colour, a
yellow colour with an eagle and flames); and P2 without each of those parts. All are measurement values (§0 header), not proposals.

| view (factor) | changed P1 / P2 | solid near-black today / P1 / P2 (limit 0.0005) | mean luminance today / P2 | map text: lowest contrast, below AA | drops today / P2 | confidence marks' share today / P2 | world pass ms today / P2 |
|---|---|---|---|---|---|---|---|
| `overview-plan` (4x) | 0.2% / 0.62% | 0 / 0 / 0 | 53.8 / 53.9 | 8.03, 0 / 8.03, 0 | 4 / 4 | 3.7% / 3.7% | 7.7 / 8.6 |
| `ph8-overview-study` (4x) | 0.16% / 0.62% | 0 / 0 / 0 | 44.4 / 44.4 | 8.27, 0 / 8.27, 0 | 3 / 3 | 3.3% / 3.3% | 8.2 / 11.1 |
| `ph8-overview-watch` (4x) | 0.2% / 0.64% | 0 / 0 / 0 | 44.6 / 44.7 | 8.17, 0 / 8.17, 0 | 3 / 3 | 3.6% / 3.6% | 7.9 / 13.7 |
| `plans-overview` (4x) | 0.05% / 0.25% | 0 / 0 / 0 | 54 / 54 | 8.52, 0 / 8.52, 0 | 11 / 11 | 2.4% / 2.4% | 7.6 / 10 |
| `ph8-overview-watch` (10.33x) | 0.18% / 0.58% | 0 / 0 / 0 | 52.7 / 52.8 | 8.17, 0 / 8.17, 0 | 3 / 3 | 3.5% / 3.5% | 5.3 / 6.4 |
| `overview-field` (4x) | 1.1% / 2.4% | 0 / 0 / 0 | 77.2 / 77.4 | 8.32, 0 / 8.32, 0 | 6 / 6 | 4.3% / 4.3% | 7.8 / 14.6 |
| `overview-field` (10.33x) | 0.94% / 2.1% | 0 / 0 / 0 | 88.1 / 88.3 | 7.95, 0 / 7.95, 0 | 7 / 7 | 4.5% / 4.5% | 7.4 / 11.6 |
| `selected-formation` (4x) | 2% / 3.5% | 0 / 0 / 0 | 64.4 / 64.7 | 7.57, 0 / 7.57, 0 | 4 / 4 | 15% / 15% | 8 / 8.8 |
| `watch-selected` (4x) | 1.6% / 2.7% | 0.0001 / 0.0001 / 0.0001 | 57.4 / 57.5 | 7.59, 0 / 7.59, 0 | 4 / 4 | 15.2% / 15.3% | 6.6 / 10 |
| `hybrid-dimmed` (4x) | 1.1% / 2% | 0.00005 / 0.00005 / 0.00005 | 62 / 62.2 | 6.49, 0 / 6.49, 0 | 8 / 8 | 14.6% / 14.6% | 7.4 / 9.2 |
| `close-sokolnitz` (4x) | 1.3% / 4.9% | 0 / 0 / 0 | 126.5 / 126.7 | 7.67, 0 / 7.67, 0 | 4 / 4 | 9.3% / 9.3% | 7.8 / 9.9 |
| `close-sokolnitz` (10.33x) | 0.96% / 3.2% | 0 / 0 / 0 | 145.5 / 145.5 | 7.67, 0 / 7.67, 0 | 3 / 3 | 9% / 9.1% | 8.9 / 6.9 |
| `pratzen-low` (4x) | 2.8% / 6.3% | 0.0002 / 0.0002 / 0.0002 | 90.8 / 90.9 | 8.26, 0 / 8.26, 0 | 4 / 4 | 10% / 10.1% | 7.8 / 8.3 |
| `pratzen-low` (10.33x) | 1.4% / 2.5% | 0 / 0 / 0 | 110.4 / 110.5 | 8, 0 / 7.94, 0 | 3 / 3 | 5.7% / 5.7% | 9.2 / 7.4 |
| `eye-zuran` (4x) | 0.02% / 0.23% | 0 / 0 / 0 | 117.5 / 117.5 | 7.57, 0 / 7.57, 0 | 5 / 5 | 0.04% / 0.04% | 3.8 / 2.4 |
| `pratzen-orbit-min` (4x) | 5.4% / 19.4% | 0.0003 / 0.0003 / **0.00233** | 76.5 / 77.3 | 11.72, 0 / 11.77, 0 | 1 / 1 | 3.1% / 3.1% | 6.7 / 12.1 |
| `pratzen-low-1x` (1x) | no figures | 0 / - / - | 75.3 / - | 8.49, 0 | 4 / - | - | 1.6 / - |
| `eye-zuran-1x` (1x) | no figures | 0 / - / - | 101.2 / - | 11.36, 0 | 6 / - | - | 1.1 / - |
| `paper-north-up` | no figures | 0 / - / - | 145.8 / - | 5.38, 0 | 12 / - | - | 0.9 / - |
| `paper-close` | no figures | 0 / - / - | 192.2 / - | 5.1, 0 | 1 / - | - | 0.8 / - |

1. **The coats alone (P1) move no threshold in any view**: solid near-black, the map text (its lowest contrast and none below AA), the
   drops and the confidence marks' share (within 0.001) are as today. The colour masses change (0.02-5.4% of the free rectangle).
2. **The full kit (P2) breaks the Stage 0 darkness limit in one view, the closest orbit: 0.00233 against the limit's 0.0005** (0.00228
   in the first two runs: the flags move; today 0.0003, P1 0.0003). **The headgear is the cause**: P2 with today's cylinder in place of
   the prototype's headgear gives 0.0005, at the limit; P2 without the facings 0.00233, unchanged; P2 with today's flags 0.00213. There the
   figures are 49 px (at most 181), and the prototype's headgear is larger than today's cylinder: bicornes and crested helmets in
   decision 84's black (`#2E2B27`), bearskins and busbies in a fur darker still (`#2A2420`); which of the two forms the blocks was not
   separated. The flags' black devices (`#1A1714`, darker than decision 84's) add the rest. Every other view stays as it is. So 6C must
   keep every drawn black (headgear, devices) at or above decision 84's value and measure the closest orbit with each headgear class
   (question 7).
3. **The map layer does not depend on the figures**: drops are unchanged in every view and no map text falls below AA in any variant.
4. **Facings are a tint, as §3.2 inferred**: as rendered they change 0.6-3.8 px per figure at the Overview and in the Field vantage,
   6.6-16 in the middle views, 8.3-25 in the close views and 52 in the closest orbit (with their shadows), at a median contrast of only
   1.0-1.8 against the figure without them. **Headgear** changes 0.07-0.44 px per figure at the Overview, 2.3-2.7 in the Field vantage,
   5.2-12 in the middle views, 9-29 in the close views (2.8 at the eye level, most of whose figures are far) and 102 in the closest orbit
   (median contrast 1.1-1.27). The **flags'** repainting changes 0-12,832 px per view (59,878 in the closest orbit), at a median contrast
   of 1.1-1.5 against today's paintings.
5. **The world pass** (software WebGL): 3.8-9.2 ms today in the views with figures (0.8-1.6 without), 2.4-14.6 ms in P2, which drew the
   facings as a second mesh per coat mesh (twice the draw calls); an implementation would bake them into the kit's merged geometry. The
   same view measured in two runs differs by up to 2.3 ms, so differences below that are noise. Not measured on a GPU.
6. **Repeatability** (fact): the probe ran three times (a container restart cut the first run short; README): four views measured twice
   gave every threshold measure identical and the parts' changed shares within 0.0001.

`appearance-sheet.jpg`: four views as they are and in P2 (`close-sokolnitz`, `pratzen-low`, `eye-zuran`, `pratzen-orbit-min`).

## 4. Identity decoupled from coat colour

### 4.1 What carries side and nation today (fact)

| carrier | what it shows | where and when it is drawn | reads the coat? |
|---|---|---|---|
| the counter (`counterHTML`, `symbols.js:55-71`) | the side's band in a cased frame (decision 1), the nation's fill, the nation tag FR / RU / AT (decision 11); its accessible name says "French", "Allied, Russian" or "Allied, Austrian" (`symbols.js:39`, `:77-81`) | the paper map and "Landscape with counters"; dropped items reachable by hover and keyboard (decision 39) | no |
| the name's side mark (`nameHTML`, `symbols.js:85-89`) | an 8 px mark in the side's colour in a keyline, beside neutral text (decision 9), with the grade's badge | the landscape at 4x and 10.33x, within the name's range (300 units for a division, 170 a brigade, 220 a battery or headquarters; corps and armies at any distance beyond 250) **and only while the eye is more than 34 units from the block** (`app.js:4337-4339`); not in Clean (`textOn`, `app.js:140`) | no |
| the ground mark (5B; `app.js:4318-4333`) | the grade's mark in the side's colour (A crisp, B soft, C diffuse; decisions 85-88) | every formation on the field, at every factor and on the paper map, in Study, Watch **and Clean**; at 4x and 10.33x gone when the visitor turns "Position confidence" off (at 1x the footprint stays, crisp) | no |
| the arrows | the side's colour; the Allied chevron (decision 20) | per phase, not per formation | no |
| the dossier | the nation's name and bar (`app.js:5517-5520`, `:5556-5560`) | on selection | no |
| the standards | the nation's one pattern (§1.4) | every block at 4x and 10.33x | no (but two of the three patterns are unsourced, §0.3 item 2) |
| the legend's nation rows, the first-run key, tour stop 1 | coats named as nations (§0.3 item 3) | the legend wherever figures are drawn; the first run; the tour | **yes** |
| the figures' coats | the nation's fill | every block at 4x and 10.33x | **they are the coat** |

So in the drawing nothing but the coats and three texts ties a coat colour to a nation. The gaps where the coat is today the only
side cue on screen are three, all fact from the code: **Clean** (no names, no counters) when "Position confidence" is off; **close
range** (no name within 34 units of the eye) when it is off; and anywhere it is off and a name is dropped or out of range.

### 4.2 Measured (fact; `appearance-probe.js`, `appearance-probe.md`)

In every landscape view with figures (the two 1x views draw none; the paper map none):

| view | formations whose figures are drawn | with a name or counter displayed | with a ground mark | closest coats of opposite sides, CIEDE2000, today | in P1 |
|---|---|---|---|---|---|
| `overview-plan` (4x) | 28 | 4 | 28 | not keyed | - |
| `ph8-overview-study` (4x) | 27 | 5 | 27 | not keyed | - |
| `ph8-overview-watch` (4x) | 29 | 5 | 29 | not keyed | - |
| `plans-overview` (4x) | 24 | 3 | 24 | not keyed | - |
| `ph8-overview-watch` (10.33x) | 28 | 5 | 28 | not keyed | - |
| `overview-field` (4x) | 18 | 13 | 18 | 21.6 (santon, bag) | 9 (gqg, buxhowden) |
| `overview-field` (10.33x) | 19 | 15 | 19 | not keyed | - |
| `selected-formation` (4x) | 9 | 9 | 9 | 23.3 (rivaud, kamensky) | 14 (drouet, kamensky) |
| `watch-selected` (4x) | 11 | 8 | 11 | 28.2 (walther, kamensky) | 3.6 (walther, milo) |
| `hybrid-dimmed` (4x) | 8 | 5 | 8 | 26.2 (sthilaire, kamensky) | 15.9 (sthilaire, kamensky) |
| `close-sokolnitz` (4x) | 13 | 9 | 13 | 17 (vandamme, prz) | 7.6 (vandamme, prz) |
| `close-sokolnitz` (10.33x) | 10 | 8 | 10 | not keyed | - |
| `pratzen-low` (4x) | 9 | 9 | 9 | 30.8 (sthilaire, kamensky) | 19 (sthilaire, ahq) |
| `pratzen-low` (10.33x) | 7 | 7 | 7 | not keyed | - |
| `eye-zuran` (4x) | 0 | 0 | 0 | not keyed | - |
| `pratzen-orbit-min` (4x) | 11 | 0 | 11 | 26.1 (caffarelli, lich) | 4 (walther, lich) |

1. **Every formation drawn as figures has its ground mark today** (with "Position confidence" on, its default), in every view.
2. **Names and counters cover only part of the field**: at the Overview 3-5 of 24-29 formations (beyond the names' range only corps and
   armies are named); in the Field vantage 13-15 of 18-19; in the middle and close views 5-9 of 7-13; and in **the closest orbit none of
   11** (no name within 34 units of the eye). There, and for most formations at the Overview, the ground mark is the only side cue on the
   formation besides the coat; with "Position confidence" off, the coat is the only one.
3. **Historical coats cannot tell the sides apart, measured**: today the closest pair of formations of opposite sides differs by
   CIEDE2000 17-31 as rendered (the minimum in each view); with the P1 coats by 3.6-19, and the French green coats (Walther's dragoons,
   Kellermann's light cavalry, the escort) against the Russians' dark green by **3.6** (Walther and Miloradovich, `watch-selected`),
   **4.0** (Walther and the Fifth Column, the closest orbit), **4.9** (Kellermann and Miloradovich) and 9.0 (the escort and the Left Wing
   command, the Field vantage); French dark blue against Russian dark green 7.6-19 (the closest such pair in each keyed view). A difference of a few units is hard to see even side by
   side: the opportunity's premise holds as rendered.
4. **A side footprint for every formation** (each ground mark drawn as grade A's crisp footprint whatever its grade, question 12) covers
   1.5-9.1% of the free rectangle in the views with figures (0.04% at the eye level), against 2.4-15.2% for today's graded marks (a C
   zone is larger than the footprint); its pixels differ from the ground at a
   median contrast of 1.1-2.5 (0-27% of them at 3:1): a quiet mark that keeps a side cue under every formation, while the name's mark and
   the counter carry side legibly where they are drawn.
5. At the eye level the probe found 172 figures in the free rectangle but no formation whose position projects inside it, so its rows are
   empty there (the enemy in sight is drawn by `drawnKnow`'s rule, decision 91).

### 4.3 Design (recommendation; questions 2, 12, 13)

1. **Side and nation by symbology only.** The counters (decisions 1, 4, 11, 13), the names' side marks (decision 9), the grade badges, the
   ground marks (decisions 85-88) and the arrows (decision 20) carry side and nation exactly as now; no figure carries them. Nothing in
   symbology changes.
2. **A side cue under every formation drawn as figures, always** (question 12): with "Position confidence" off, the ground mark stays as
   the crisp footprint in the side's colour (grade A's mark for every formation), as the 1x footprint already stays; with it on, the
   grade's mark as now. Measured in §4.2 (its share and its contrast against the ground). Clean and close range are then covered.
3. **The legend.** The three nation rows describe what they colour, the counters' fill ("counters: French / Russian / Austrian"), and show
   only where counters are drawn (the paper map, "Landscape with counters"); where figures are drawn, one row for the figures: "figures:
   dress as sourced (source and grade in the dossier); in their nation's symbol colour where not sourced"; the ground mark's rows (5B)
   and a row for the name's side mark carry the sides.
4. **The first-run key** (proposed wording, from the same table as today): "French formations are marked in blue and the Allies in
   amber: on their names, their counters and the ground beneath them, and on the movement arrows. The high ground in the centre is the
   Pratzen plateau, and it decides the battle." The self-test checks the decided words instead of today's (a decided rule).
5. **Tour stop 1** (a data task in 6B, `TOUR` is guarded; proposed wording): "Ten kilometres of open Moravian farmland. The French army,
   marked in blue, is to the west; to the east are the Russians and the Austrians, marked in amber. Between them runs the Goldbach, a small
   stream in a marshy bottom, and behind it stands the Pratzen plateau, the high ground in the centre of the field." (today's text,
   `analysis.js:351`, with the coat colours replaced by the marks).
6. **The sources sheet**: a section "How the troops are drawn": figures are symbols about 45-70 times life size (decision 14); their dress
   follows the appearance table where sourced (each class's grade), generic where not; the standards' patterns and the ratio (sourced or
   provisional); side and nation are carried by the counters, the names' marks and the ground marks, never by a coat.
7. **The dossier**: a "Dress" line in the full dossier: the formation's classes, each with its source and grade, or "generic: not
   sourced"; the standards' model and grade.
8. **The standards' historical patterns also tell the nations apart** close up (§3.2), a consequence, not a carrier the rule relies on.

## 5. Where appearance data lives (recommendation; question 4)

**The claim and the drawing are different things.** A statement of the form "regiment X wore a coat of the colour its source calls Y in
1805 (source, page; grade)" is a historical claim; "Y is drawn as this sRGB value, lifted where the darkness limit needs it" and "a
bicorne is this low-poly shape" are rendering decisions (decision 84's precedent: "a rendering value, not a uniform change"). CLAUDE.md requires
data, simulation and presentation to stay apart, and every historical value to carry its evidence. Three places were considered:

| option | what it means | for | against |
|---|---|---|---|
| (a) new fields in `FORMATIONS` (`data.js`) | each formation's dress, colours carried and sources in its own record | one place per formation; guarded already | the order of battle grows a second concern; dress is mostly per class (a line regiment of 1802, a cuirassier of 1803), so the same claim and source would be repeated over many formations; a formation of several regiments needs a composition anyway |
| **(b) a new guarded file, `appearance.js` (recommended)** | the historical appearance as data, loaded after `data.js`: **classes** (each a dress: coat, facings class, legwear, headgear, horse furniture, by its source's own colour names, each value with its source and grade); **composition** (each leaf formation's share of each class, by battalion or squadron where sourced, else its dominant class; the regiments named, each with its source); **colours carried** (per class or formation: the model, how many per battalion, who carries none, cased or uncased, the cloth's dimensions and the staff's, each with source and grade); the declarations added to `DATA` in `tools/visual/data-invariance.js` | keeps `data.js` as it is (no `check:data` change to existing declarations); one source and grade per claim, stated once; the census and the self-test can read it; Stage 6's evidence has its own file and its own history | a new guarded file to keep in the build order and the tests' loaders (`tools/stage2/model.js`, `tools/mk-world-mod.js`, `test.js`) |
| (c) presentation only (`app.js`) | a table of colours and shapes in the drawing code | simplest | historical claims as unguarded presentation constants, which is exactly today's fault (§1.6); a claim could change with no evidence and no `check:data` failure |

**The drawing then keeps only rendering values**, in one presentation table in `app.js` (call it `KIT`): for each colour name used by
`appearance.js`, the drawn sRGB value and its basis (a design decision, labelled as such; where the darkness limit needs it, lifted, as
decision 84 did for black); for each headgear class, its low-poly shape; for each colours model, its painted cloth. `css-test.js` then
requires every colour literal in the figure and flag functions to come from `KIT` or `TOKENS` (the Stage 6 exemption of
`css-test.js:136-142` removed, and `formationAtlas` and the unused `GEO` entries deleted), and every `KIT` colour to be named by
`appearance.js`. `NATION` does not change: it stays the counters' and the dossier's nation colour (symbology), not a coat (decision 1's
first half).

**What moving `check:data` means.** 6B adds declarations (`APPEARANCE` and its companions) and lists them under "historical datasets" in
`data-invariance.js`; the reference moves to the 6B build, as the 4D data task moved it; `CHANGELOG.md` lists every added or changed
declaration with what was, what is and why. If 6B also rewords tour stop 1 (`TOUR`, question 13) or `SOURCE_NOTE`'s open questions
(only if the sources settle them; otherwise they stay as written), those declarations are listed too.

## 6. Design, part by part (recommendation)

### 6.0 The checks on the build this part was written against (fact)

All on the unchanged 5G build (md5 `4c12cac6d458b02e3282237f4d1abb92`, 1,528,608 bytes), in this session:
- `npm run build` (inside `check:baseline` and `npm test`): the bundle 1,458,891 bytes, the HTML 1,528,608 bytes.
- `npm run check:baseline`: md5 `4c12cac6…`, 1,528,608 bytes; passes (not moved).
- `npm test`: all 9 suites pass, and the height guard (96 call sites, 0 presentation sites calling `height()`/`hAt()`): `css-test.js`
  0 errors, 9 of 9 behaviour checks; `test.js` 0 errors, 41 of 41 order-of-battle checks; `geo-test.js` 54 passed; `terrain-test.js` OK;
  `audit.js` 0 march-rate and 0 terrain violations; `sim-test.js` 0 disagreements; `redteam.js` 0 findings; `runtime-test.js` 0 errors;
  `binding-test.js` 383 checks, 0 failed ("ALL 9 SUITES PASSED (and the height guard)", exit 0, 4 min 38 s; run first before writing and
  again on the final tree, with the same results).
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`.
- `npm run check:chronology`: 0 errors (69 moves with a timed statement: 65 consistent, 4 early, the unresolved conflicts it names; 20
  explicit times).
- `npm run check:contrast`: 5,186 text elements, 105 distinct text/background pairs, 0 below AA, 0 below 10.5 px ("all text meets WCAG
  AA", exit 0, 5 min 55 s).
- `npm run check:visual` (run once, before the probes, on the same build: its md5 has not changed since): all checks passed (66 min 46 s): 23 views, the self-test 194 of 194, the day's light sweep (0.000% solid
  near-black in every hour), the valley fog's hours, the horizon (within 4.7 and 5.3 of the sky at 4x and 10.33x), the slider, pacing and
  key tests by real key presses; 5 console warnings, each Chromium's Canvas2D `willReadFrequently` notice (the known warning).

### 6.1 6B: the evidence, and the appearance table (a data task)

- **Precondition** (question 1): a session whose network reaches the sources (the hosts of §2.0), or the texts supplied by the owner.
  The registers `docs/stage6-evidence/leads-*.md` are the reading list, each in its stated order (for France: Malibran 1904, Bardin, the
  *Journal militaire*, Regnault 1967, Charrié 1982, the 111e flag's catalogue, Bigarré; for Russia: Viskovatov parts 10, 11, 14-18 in
  Conrad's translation, Gingerich, Zvegintsov, Shevyakov; for Austria: the Mollo plates of about 1798, the *Schematismus* of 1805,
  Teuber and Ottenfeld plates 32-39, Wrede). No reading, no part: 6C and 6D draw only what 6B grades.
- **Files**: `appearance.js` (new, guarded: classes, composition, colours carried, dimensions, each value with source, page or plate,
  grade, label; §5); `build.py` (load order: after `data.js`); `tools/visual/data-invariance.js` (the new declarations under "historical
  datasets"); the node loaders (`tools/stage2/model.js`, `tools/mk-world-mod.js` or `tools/mk-helpers.js` where they load data;
  `test.js`); `CHANGELOG.md`. If decided: `analysis.js` (tour stop 1, question 13); `data.js` only where a source settles an open
  question of `SOURCE_NOTE` (otherwise it stays as written) or where a data task revises the narrative's "45 standards" (§0.3 item 9).
- **Dependencies**: questions 1, 4, 5, 13. None on the drawing.
- **Regression risks**: `check:data` moves (every added or changed declaration listed, with what was, what is and why); the loaders must
  read the new file in node (a missing load fails the suites loudly, not silently); a value without a source, or a grade without a basis,
  would be a data-integrity fault, so the tests reject it.
- **Its report must show**: every claim read, with its source, page or plate and grade; every lead that proved wrong (and which of the
  brief's premises, §0.3 item 8); the disagreements kept (as `CHANGELOG.md` keeps the chronology's); what stays unsourced and will be drawn
  generic (§2.9); `check:data` with its new reference; that the build draws exactly what it drew before (`check:visual` unchanged; the
  build's md5 moves only by the new file).
- **Tests**: `test.js`: every leaf formation resolves to classes whose shares sum to 1; every class value names a source and a grade A, B
  or C and a label; a grade A only with a source dated 1804-1805 or a regulation shown in force on 2 December 1805; every colours entry has
  a model, a count rule and dimensions or "not sourced"; the regiments named in a composition agree with `FORMATIONS`' strengths where the
  data gives them. `runtime-test.js`: a dry run of the table's resolution for all 32 blocks. `check:data`: the new reference.

### 6.2 6C: the figures from the table, and identity (presentation)

- **What**: each block's figures drawn from its composition: coats by class (the drawn value from `KIT`, §5), the headgear's silhouette
  by class (question 8: a handful of low-poly shapes; the plain cap where unsourced), class-level features only where sourced **and**
  legible (§3.2; question 9), gunners in their own figure (no musket or pack), the escorts by class, horses by question 14, and the
  generic, labelled appearance (§2.9) for whatever 6B could not source. Identity changes in the same part, because it is this part that
  makes the coats stop meaning nations (§4): the legend, the first-run key, the sources sheet, the dossier's dress line, the side-cue rule.
- **Files**: `app.js` (the figure kit by class; `KIT`; `formationAtlas`, `pushBox` and the unused `GEO` entries deleted; `paintKey` and
  `COLOUR_KEY`; the sources sheet; the dossier; the self-test), `shell.html` (the legend's rows; the first-run card), `style.css` (the
  legend row, if new), `tools/visual/measure.js` (the float check reads the kit's geometries from the app, not five names: extended, not
  loosened), `css-test.js`, `runtime-test.js`, `CHANGELOG.md`.
- **Dependencies**: 6B; questions 2, 3, 5-9, 12, 14.
- **Regression risks** (measured in §3.3 on prototypes): solid near-black from large dark headgear (the closest orbit is the view at
  risk: 6 solid blocks today, 0.0003; the prototype's headgear took it to 0.00233 against the limit's 0.0005, the coats alone left it
  unchanged, §3.3 item 2); the confidence marks' share (new silhouettes occlude the marks
  differently); the world pass (more vertices per figure); the float and standards' foot checks (new geometries); the self-test's colour
  key (`app.js:7900-7916`) and the legend's contextual rows; `check:contrast` (new text: the dossier's line, the sources sheet, the legend).
- **Its report must show**, per harness view, before and after on the real build (the appearance probe's measures): solid near-black and
  mean luminance, also through the day's light sweep; map text at AA as rendered; drops; the confidence marks' and the smoke's shares;
  the world pass; the cross-side colour difference as rendered (§4.2: expected to fall, which is why identity moves to symbology); for
  every block, its classes and their grades; sheets of the close views.
- **What must hold** (tests): **self-test**: every figure's coat instance colour is `KIT`'s value for its class (times the jitter), or the
  generic nation colour where `appearance.js` says unsourced; every figure's headgear geometry is its class's; no figure reads `NATION`
  except the generic appearance; every formation whose figures are drawn in the free rectangle carries a side cue on screen (its name's
  side mark, its counter's band or its ground mark) in Study, Watch and Clean, unless the visitor has turned every carrier off (the rule
  of question 12); the legend's rows are what is drawn; the dossier's dress line names the source and grade, or "generic"; the first-run
  key's decided words (a decided rule replacing `app.js:7909`'s words, never a weaker check). **Harness**: the Stage 0 darkness limit in
  every view and through the light sweep; map text at AA; drops within `DROP_LIMIT`; the confidence marks within `CONF_SHARE`; the smoke
  within its share; figures on the ground with every new geometry. **`css-test.js`**: every colour literal in the figure functions in
  `KIT` or `TOKENS`, every `KIT` colour named by `appearance.js` (the exemption at `:136-142` removed). **`binding-test.js`** (the dash
  rule, decision 15): unchanged; its scan finds no new dashed or segmented drawer. **`check:contrast`**: the new text states at AA and the
  10.5 px floor. **`runtime-test.js`**: a dry run of the kit by class for the 32 blocks; its figure counts (`:543-549`) kept.

### 6.3 6D: standards and flags (presentation, from the table)

- **What**: who carries a standard and how many (per `appearance.js`: per battalion or squadron as sourced, mapped onto the drawn
  battalions; none where the table says none: batteries, headquarters, light cavalry, as the sources decide); each model's cloth, its
  proportion (the French 1804 cloth about square, the Austrian 161 x 142 cm, the Russian about 142 cm square, if 6B confirms them) and its
  painting from `KIT` (no inscriptions: at most 74 px of cloth in the close views, letters would be 1-3 px, §3.1); the finial where
  sourced; the Russian infantry's generic, labelled cloth while the open question stays open (question 10); the **sourced ratio** in place
  of 1.6, with its denominator stated (question 11); the dip kept (§0.1).
- **Files**: `app.js` (`flagTexture` by model; `placeStandards`; `STD_RATIO`; the sources sheet's sentence, `app.js:5987`; the self-test),
  `CHANGELOG.md`.
- **Dependencies**: 6B; questions 10, 11; independent of 6C except through the legend.
- **Regression risks**: the self-test's ratio check (`app.js:6840`) moves to the sourced value (a decided rule, the same tolerance); the
  harness's standards' foot check (cloth and pole proportions change); texture memory (one texture per model, a handful, not one per
  regiment); a striped cloth is a painted texture, never a line drawer (decision 15; `binding-test.js` stays as it is).
- **Its report must show**: every block's standards (count, model, grade) against the census of today; the ratio's source and value; the
  cloths' px in the harness views; sheets of the close views and the closest orbit.
- **What must hold** (tests): **self-test**: every standard's texture is its formation's model; the count per formation as `appearance.js`
  rules; no standard where the table says none; pole top over the stated denominator within 0.01 of the sourced ratio for every block; the
  dip at 0.95 rad while broken, captured, encircled or repulsed. **Harness**: the standards' foot on the ground; darkness, AA, drops as
  above. **`css-test.js`**: the cloths' colours from `KIT`. **`binding-test.js`**: unchanged.

### 6.4 An honest drawing before 6B (recommendation; question 3)

The register cannot be read in this session, so 6B may wait. Today's drawing can be made honest without any source: say in the legend
and the sources sheet that the figures are drawn in their nation's symbol colour with a generic cap and are not uniforms (§2.9), and
replace the three flag patterns, which claim more than the evidence gives, with plain cloths in the nation's symbol colour, labelled as
generic. That is a small presentation change (the legend, the sources sheet, `flagTexture`, the self-test's key and a new legend check),
measured like 6C; it changes no datum and settles no open question. It could be the first commit of 6C, or a separate small part now.

### 6.5 Order

6B (data; needs access), then 6C (figures and identity), then 6D (standards); 6.4 first if the owner wants the drawing honest before the
reading is done. Each part passes every check on its own and moves `check:baseline` (6B also `check:data`).

## 7. Questions for the owner (numbered; each with a recommendation and its trade-off; the next decision number is 96)

1. **How will 6B reach the sources?** (binds 6B) *Recommendation:* run 6B in a session whose environment allows the hosts of §2.0
   (Custom network access with those domains added; the search cap raised if the environment allows it), or supply scans or excerpts of
   the named works (Malibran, Bardin, Regnault, Charrié, Viskovatov in Conrad's translation, Zvegintsov, the Mollo plates, the 1805
   *Schematismus*, Teuber and Ottenfeld, Wrede, the 111e flag's catalogue). *Trade-off:* until then nothing can be sourced, and 6C and 6D
   wait (only §6.4 can proceed).
2. **End decision 1's "and figure coats"?** (binds 6C, 6D) *Recommendation:* yes: figures follow the sources; nation and side are carried
   only by symbology (counters' bands and fills, the nation tag, the name's side mark, the ground marks, the arrows, the dossier), as
   decision 1's own note already foresees (`docs/VISUAL_SPEC.md:36`). *Trade-off:* the landscape loses its blue, green and white armies
   at a glance; the measured carriers of §4 take that role, and Clean relies on the ground marks.
3. **Make today's drawing honest before 6B?** (binds 6C or a separate small part, §6.4) *Recommendation:* yes: label the figures as
   symbol colours with a generic cap, and replace the three flag patterns with plain labelled cloths in the nation's symbol colour.
   *Trade-off:* the French tricolour goes before the lozenge is sourced, and the field loses the flags' colours for a while; in exchange
   the app stops asserting patterns its own sources note calls open.
4. **Where does appearance data live?** (binds 6B) *Recommendation:* a new guarded file, `appearance.js`, for the claims (classes,
   composition, colours carried, each with source and grade), and a presentation table, `KIT`, for the drawn values and shapes (§5).
   *Trade-off:* one more guarded file in the build and the test loaders; the alternative (fields in `FORMATIONS`) repeats one claim over
   many formations.
5. **At what granularity?** (binds 6B, 6C) *Recommendation:* each drawn battalion or squadron takes a class in proportion to the sourced
   composition of its formation, else the formation's dominant class; mixed-arm formations keep the arm the data gives them (no splitting
   in Stage 6; Bagration's and the First Column's cavalry and guns stay drawn as infantry, a data question). *Trade-off:* a regiment-level
   composition is a real data effort; one class per block is simpler but wrong for mixed divisions (light and line battalions; Kamensky's
   musketeers and grenadiers; Kienmayer's Grenz, hussars and Cossacks).
6. **Greatcoats?** (binds 6B, 6C) *Recommendation:* draw what the read sources show was worn on 2 December, by side and arm; while the
   evidence is disputed (today: two unread leads conflict for the French, one secondary claim for the Russians), draw the regulation coat
   and say in the dossier that greatcoats may have been worn. *Trade-off:* greatcoats would make most of the field grey and brown, the
   largest visual change Stage 6 could make, so it must rest on read evidence, not on a default.
7. **The drawn colour values?** (binds 6C) *Recommendation:* the source names the colour; the drawn sRGB is a design decision recorded in
   `KIT` with its basis; no drawn cloth darker than the figures' black of decision 84 (`#2E2B27`, about 2.7% reflectance), so that dark
   coats en masse stay within the Stage 0 darkness limit (measured §3.3). *Trade-off:* the darkest cloths are drawn a little lighter than
   they were.
8. **Headgear silhouettes?** (binds 6C) *Recommendation:* yes: one low-poly shape per sourced class (bicorne, shako, bearskin, crested
   helmet, grenadier cap, round hat), the generic cap where unsourced or disputed (the Russian line's headgear on the day is disputed,
   §2.6), with the dispute in the dossier. *Trade-off:* legible only in the close views (§3.1); the shapes add vertices (the
   world pass, §3.3 item 5).
9. **Facings and lace?** (binds 6C) *Recommendation:* no regimental facings or lace: below the drawn scale in every view but the closest
   orbit (§3.1), and the facing tables themselves are disputed (§2.6); draw only class-level features that are sourced and large (a
   cuirass, if the French cuirassiers' is sourced). *Trade-off:* no regiment can be told from another by its figures; the dossier says
   what it wore.
10. **The Russian infantry colours, and the other open question?** (binds 6B, 6D) *Recommendation:* keep both of `SOURCE_NOTE`'s open
    questions open until read sources settle them; draw a generic, labelled cloth for the Russian infantry and the generic appearance for
    the Grenz until then (§2.9). *Trade-off:* the Russian standards lose today's green and white, and Kienmayer's infantry its white.
11. **The standard's ratio?** (binds 6D) *Recommendation:* define it as the staff's top (with its finial or eagle) over the man's height to
    his hat's top (1.635 units on foot), from a measured staff of the period and a sourced stature, per nation; if 6B finds none, keep 1.6
    labelled provisional and correct its wording (today it divides by the bayonet's tip, §0.3 item 4). *Trade-off:* with the man as the
    denominator, the same 1.6 would make the pole 2.62 units instead of 3.17, and the cloth's lower edge (3.8 x the scale: 1.91 units)
    would hang below the bayonets' tips (1.98), which §I.1's rule (the cloth's bottom at least 1.05 x 1.98) was written to avoid; a
    sourced ratio may be larger (the unread Russian lead suggests about 2.0).
12. **A side cue for every drawn formation, in every presentation?** (binds 6C) *Recommendation:* yes: with "Position confidence" off, a
    plain crisp footprint in the side's colour stays under each formation (as the 1x footprint already does with the toggle off), so
    side is drawn on the ground in Study, Watch and Clean, and at close range where names are not drawn. *Trade-off:* the toggle then
    switches the grade's encoding, not the ground mark; Clean keeps a mark (measured §4).
13. **Tour stop 1 and the first-run key?** (binds 6B for `TOUR`, a data task; 6C for the first-run card) *Recommendation:* reword both to
    name the symbology, not the coats (wording proposed in §4.3). *Trade-off:* the tour's "the Russians in green and the Austrians in
    white" goes; the self-test's words change with it (a decided rule).
14. **Horses and equipment?** (binds 6B, 6C) *Recommendation:* horses stay one brown unless 6B grades a horse colour A or B (the Guard's
    and trumpeters', for example); gun carriages stay one colour unless each army's is sourced. Both go on 6B's reading list. *Trade-off:*
    less variety, no unsupported claims.
15. **The order?** (binds every part) *Recommendation:* §6.4 now if question 3 is yes, then 6B (when the sources can be read), 6C, 6D.
    *Trade-off:* the drawing changes twice (generic now, sourced later), but it never claims more than its evidence.
