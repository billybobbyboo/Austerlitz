# Final audit of the Austerlitz command map (after Stage 7)

**Status: merged (#48); the owner accepted every recommendation of §6 (decisions 125-141, §6.0); roadmap step 1 begun (`docs/ROADMAP.md`).**
This audit reports, measures and recommends; nothing in it is fixed. It changed no source file,
no data and no build: `npm run check:baseline` passes on the Stage 7D build (`austerlitz-command-map.html`, 1,764,002 bytes, md5
`46773462faa1e1b9f4a4010e450e110a`) at the start and at the end. Written against `main` at `fb2b616` (#47 merged; Stage 7 complete).
Line numbers refer to that commit. The current code is the source of truth, not the documents. The next owner decision is **142**.

Every number here comes from a script run on this build: the project's own checks, and the audit's scripts in `tools/audit/` (not bundled),
whose outputs are in `docs/audit-evidence/` (listed in its README). The code was read in six passes: five by read-only reviewers (history;
data, geography and simulation; software; the tests; the records and the roadmap) and the audit's own; every finding kept here was
re-checked against the code and is cited by file and line; those marked "measured" were also reproduced in the page. Labels:
**FACT** is traced in the code or measured; **INFERENCE** is a judgement, with what would settle it; the historical labels (fact, disputed,
derived, inference, uncertain, interpretation, design decision) are the project's.

## Summary

**The state of the map, in plain words.** Every stage of the original roadmap (`docs/VISUAL_AUDIT.md`) is built and merged: the rendering
faults, the visual language, the readable map and the true paper map, the navigation and the one timeline, the light and the fog, the
evidence layer, the historical appearance and the opening. Of the 26 problems, opportunities and improvements that audit listed, 20 are
resolved, 4 partly and 2 open (§3). The software is careful and heavily tested (nine suites, a 212-check self-test, 30 measured
views, 35 contrast states). The data guard holds: all 121 historical, geographic and model declarations are byte-identical to the reference.

What stands between the map and its own claim to be *historically defensible* is mostly not code. Three hours that the map's own sources
sheet calls unresolved are shown on the day's main path as settled, two of them graded "Fact · Timing A" (**H-1, the one blocker**). The
narrative carries no per-statement source (H-6), and the dossier's "Fact" pill is the position's grade, not the statement's (H-5). The
plateau's derived figure has no "derived" mark on the map, and in one phase none anywhere (H-3). The overclaim scan reads 7% of the prose a
visitor can see (H-8).

The rest is a short list of real bugs and accessibility gaps:
- **"Whose eyes?"** hides enemy formations but not their corps counters (S-1).
- **The dwell toggle** sends the clock back (S-2).
- **Start-up:** if three.js or WebGL fails, the boot line stays with no message (SW-1).
- **Hidden panels** stay in the Tab order (SW-3), and the sources sheet is a modal without a modal's focus (SW-4).
- **Keyboard focus** can land on invisible map items (A-2).
- **Single-key shortcuts** cannot be turned off (A-1), and the timeline's targets are under 24 px (A-3).

Finally, a few tests cannot fail, or do not read what they claim (T-1, T-2, D-1, D-2). On a fresh machine, `check:visual` fails on the
unchanged build because the type comes from the system's fonts (T-0).

**Counts.** 75 findings: **1 blocker, 21 major, 41 minor, 12 polish**.

| dimension | blocker | major | minor | polish |
|---|---|---|---|---|
| 1 historical integrity (§2.1) | 1 | 7 | 9 | 2 |
| 2 data integrity (§2.2) | | 2 | 4 | |
| 3 geographic integrity (§2.3) | | | 1 | 2 |
| 4 simulation integrity (§2.4) | | 2 | 4 | 1 |
| 5 software correctness (§2.5) | | 4 | 8 | 1 |
| 5 the tests (§2.6) | | 3 | 6 | 1 |
| 6 visual, UX, accessibility (§2.7) | | 3 | 2 | 1 |
| 7 performance (§2.8) | | | 2 | 2 |
| 8 polish and records (§2.9) | | | 5 | 2 |

**The blocker and the majors**, one line each:
- **H-1 (blocker).** Dokhturov's descent, Kamensky's turn and Rapp's counter-charge are unresolved in `SOURCE_NOTE` but settled on screen. The Kamensky event reads "Fact · Timing A · about 09:45", while his own A-graded record turns him at 08:45.
- **H-2.** Drouet's reserve division is drawn 0.5 km ahead of the assault at 08:45, the opening's second step, which says "no reserve committed".
- **H-3.** The plateau label carries no "derived" mark. From 12:45 there is no tag anywhere, though `SOURCE_NOTE` promises "always marked derived".
- **H-4.** The first claim a visitor reads is an unlabelled interpretation ("…and it decides the battle"), and roles under a "record" tag call themselves decisive.
- **H-5.** The dossier's Fact/Estimate/Reconstruction pill is the position grade, and it covers act texts, roles and anecdotes.
- **H-6.** The narrative (phase lines, events, tour, themes, Command tab, the 20 explicit times) cites no source per statement.
- **H-7.** Soult's "twenty minutes" appears as plain fact, as DOCUMENTED and as "a memoir anecdote".
- **H-8.** The overclaim scan reads 124 of 1,764 prose strings. Two of its own banned words are live in strings it does not read.
- **D-1.** `check:chronology` judges a hand-typed table, not the live text.
- **D-2.** The grade check skips 30 of 32 formations, and a missing grade is drawn as B.
- **S-1.** Enemy corps counters stay drawn when every formation under them is "unknown".
- **S-2.** Turning the dwell off and on while playing sends the clock back (07:22 → 07:00, measured).
- **SW-1.** If three.js or WebGL fails, the boot line stays forever with no message, and the CDN script has no integrity check.
- **SW-2.** Below 1080 px the rail can stand over the dispatch card.
- **SW-3.** Off-screen panels remain tab stops: 42 in the hidden rail at 1024 px, plus the closed dossier's buttons.
- **SW-4.** The sources sheet is `aria-modal` with no focus handling. Esc ends the tour before closing it, and clears the theme when it does close it.
- **T-0.** `check:visual` fails on the unchanged build here: `narrow-390` measures 46.0% against a 46.8% baseline because the system fonts differ.
- **T-1.** Page errors and console errors never fail a check.
- **T-2.** The meres' "floats" check is a tautology.
- **A-1.** Single-key shortcuts act anywhere with no off switch (WCAG 2.1.4, level A).
- **A-2.** Focus lands on 6 invisible map items in the first view (WCAG 2.4.7).
- **A-3.** The timeline's acts (15 px), phases (16 px), rail (22 px) and event markers (11 px) are under 24 px (WCAG 2.5.8).

**What the checks say** (§4).
- `npm run build`: the committed file is the fresh build.
- `npm test`: all nine suites pass, plus the height guard.
- `check:data`: 121 of 121 identical.
- `check:chronology`: 0 errors.
- `check:contrast`: 5,990 elements, 0 below AA.
- `check:visual`: **one failure**, `narrow-390` (T-0, environmental). The self-test passed 212 of 212.
- `check:baseline`: passes at the start and the end (md5 `46773462…`, 1,764,002 bytes).

**What next** (§6, §7). Questions 125-141 are for the owner. The proposed order:
1. Harden the suite, the fonts first, because every data task leans on it.
2. Make the screen honest about what is disputed and derived (one data task and a presentation part).
3. Fix accessibility and robustness.
4. A sourcing stage for the narrative, modelled on what Stage 6 did for dress.
5. Records and polish throughout.

## Contents
1. [Summary](#summary)
2. [Findings by dimension](#2-findings-by-dimension)
   - 2.1 Historical integrity · 2.2 Data integrity · 2.3 Geographic integrity · 2.4 Simulation integrity · 2.5 Software correctness ·
     2.6 The tests · 2.7 Visual and UX quality, and accessibility · 2.8 Performance · 2.9 Polish and the records · 2.10 Things that should
     not change
3. [Against docs/VISUAL_AUDIT.md](#3-against-docsvisual_auditmd)
4. [What the checks say](#4-what-the-checks-say)
5. [What was not verified, and why](#5-what-was-not-verified-and-why)
6. [Questions for the owner (from 125)](#6-questions-for-the-owner-from-125)
7. [A roadmap: what is next](#7-a-roadmap-what-is-next)

Severity, as used here: **blocker**: a question the project's own records name as open (`SOURCE_NOTE`, `check:chronology`'s named
conflicts) is shown on a primary path as settled, at the strongest grade and without a mark; **major**: a rule of `CLAUDE.md` broken on a primary path (an unlabelled or contradictory claim, a derived figure
without its tag), a behaviour that is wrong on a reachable path, a WCAG 2.2 level A or AA failure, or a check that passes whatever happens
to the property it claims to guard; **minor**: a secondary path, an edge case, a weaker check than claimed, a misleading record;
**polish**: wording, dead code, stale comments.

## 2. Findings by dimension

In `CLAUDE.md`'s priority order; within each, by severity. Each finding: its severity, what is wrong (FACT or INFERENCE), the evidence,
how to reproduce it where that is not plain from the evidence, and a proposed fix with the part of the codebase it would touch. Nothing is
fixed.

### 2.1 Historical integrity

**H-1 · blocker · The three hours the sources sheet calls unresolved are shown as settled; two are graded fact and A.** FACT.
`SOURCE_NOTE` keeps open "when Dokhturov's I Column began its descent (c. 07:30 in the 07:00 timeline, but from 04:00 in the event and on the
map), when Kamensky turned his brigade about (c. 09:45 in the timeline, but in the 08:45 phase in his own record), and when Rapp's
counter-charge went in (c. 11:45 in the timeline, but from 11:15 in the event)" (`data.js:764`). On the primary paths each is one answer, and
two carry the strongest grade:
- *Kamensky.* The event "Kamensky turns his brigade about and drives the French off the crest" stands at 09:45 with `claim:"fact"`, `cf:"A"`
  (`analysis.js:283-285`); its dossier reads "Fact · Timing A · about 09:45" (`app.js:6263-6267`); the phase-4 line reads "c. 09:45 Kamensky
  turns his brigade about" (`data.js:87`). The formation's own record, graded A, has him turn at 08:45 (`data.js:500`, kamensky@3: "…sends word
  to Langeron and turns his brigade about"), which the Now tab lists under "What changed at 08:45" (`app.js:5770-5792`). The marker, the dwell
  and the opening's played stretch name it at 09:45 (`app.js:3744`).
- *Dokhturov.* The event "The Allied columns begin to leave the plateau", 04:00-07:00, includes `dok`, `claim:"fact"`, `cf:"A"`
  (`analysis.js:240-242`); the map moves him from 04:00; the phase-1 line says "c. 07:30 Dokhturov's I Column begins descending" (`data.js:63`).
- *Rapp.* The phase-6 Now tab reads "c. 11:45 Bessieres and Rapp counter-charge" (`data.js:104`) and, in the same panel, "What changed at 11:15:
  Rapp's counter-charge shatters the Chevalier Guard" (`data.js:403`). The event's dossier does mark it ("Interval, not a timestamp", Estimate,
  Timing B).
The arrows "I Column descends" and "Kamensky turns about" carry an "unsettled" note in their data (`app.js:37-38`, `:60-61`) that is shown only
in the sources sheet's arrow list (`app.js:6400-6411`). `check:chronology` allows the conflicts by name (decision 42), which keeps the map's
timing; nothing decided that the screen should grade them fact/A.
*Reproduce:* Play to 08:45 and read the Now tab; play on to 09:45 (the dwell); press the Kamensky marker (its dossier).
*Fix:* a data task (guarded `EVENTS`, `PHASES`): grade the Kamensky and column events "disputed" with both hours (an interval 08:45-09:45 for
Kamensky), mark the three phase lines "(the hour is disputed)", and show the arrows' "unsettled" note where the arrow's label or dossier is
read (`app.js`, presentation). Then settle each from Duffy (1977) and Thiébault (`thiebault3_1894` is already registered, pp. 467-470 cover the
fight; INFERENCE: they likely date the turn) and Weyrother's disposition as printed in Stutterheim (1806) and Mikhailovsky-Danilevsky (1846),
both registered. Question 125.

**H-2 · major · Drouet's reserve division is drawn ahead of the assault at 08:45, the opening's second step.** FACT (computed from the
tracks). `drouet@3` has no time (`data.js:375`), so the engine moves it from 04:00 and it reaches [232,194] at 08:45, about 0.5 km east of
Vandamme, who waits at [221,182] until his dated departure (`data.js:207-209`). Four texts say the opposite: tour stop 6 and the opening's
step 2, "Two divisions, no reserve committed" (`analysis.js:361`); the French plan, "Remain behind the Zuran as the general reserve"
(`analysis.js:209`); the Command tab's order "Bernadotte forward" only at 09:30 (`analysis.js:81`). INFERENCE: Bernadotte crossed the
Goldbach later, behind Vandamme (Duffy 1977 would settle it). *Fix:* a data task: a departure time on `drouet@3`, or an anchor at the reserve
position until the commitment (question 129).

**H-3 · major · The plateau's figure is a derived reading with no "derived" mark on the map, and in phase 7 none anywhere.** FACT.
The label "THE PRATZEN · Allied ≈ N   French ≈ M" (`app.js:4097-4099`) has no tag (decision 119 (b), still open). It is drawn while the
plateau ring shows, phases 0-7 (`app.js:2997`, `:4071-4074`); the tagged reading in the Now tab and the caption only in phases 0-6 and
while the Allied figure is above 0 (`app.js:5589`). From 12:45 the label reads "Allied ≈ 0   French ≈ 37,500" with no "derived" anywhere on
screen; the French figure is never tagged. `SOURCE_NOTE` tells the visitor derived readings are "always marked derived" (`data.js:769`).
At opening step 3 (11:00) the label reads "Allied ≈ 17,050" while the tour's words say "With the plateau gone…" (`analysis.js:363`).
*Fix:* presentation (`plateauText`, `mlCollect`): a "derived" mark on the label (its accessible name too), the same phases as the caption.
Question 126.

**H-4 · major · An interpretation is the first claim a visitor reads, and others are tagged "record".** FACT. The first-run key ends "…the
Pratzen plateau, and it decides the battle" (`app.js:5440`; decision 108's words; recorded as an interpretation in
`docs/STAGE7_SPEC.md` §0.4 item 8, unlabelled on screen). The Pratzen vantage is titled "The ground that decided the battle"
(`shell.html:101`). Formation roles shown under the dossier's "record" tag (`app.js:6090-6091`) include "The decisive centre assault"
(`data.js:165`) and "then decides it" (`data.js:383`). *Fix:* label or reword (the key and the vantage title are presentation; the roles a
data task). Question 127.

**H-5 · major (systemic) · The dossier's Fact/Estimate/Reconstruction pill is the position grade, and it covers everything under it.** FACT.
`claimOf` returns `CLAIM_FROM_CONF[cf]` unless a track entry names a claim (`app.js:5883-5890`; `data.js:21`), so a formation at grade A
shows "Fact" over its act text, its role, the anecdotes in its record (the "deliberate fifteen-minute pause", `data.js:156`) and the open
questions above (kamensky@3, dok). An interpolated position between two A anchors also shows "Fact" (with "this position is interpolated"
below, `app.js:6128`): 825 of 2,605 formation-samples over the day (31.7%; reviewer's node simulation, not re-run). *Fix:* reword the pill as
the position's ("Position documented") now (presentation); per-statement claims are part of the sourcing work (questions 128, 130).

**H-6 · major (systemic) · The narrative carries no per-statement source.** FACT. Phase ledes and timeline lines, themes, the tour, the
plans, the places' facts and stories and the events' `why` carry no citation; the Command tab's DOCUMENTED badge covers motives and states of
mind ("to let more of the enemy get down", `analysis.js:76`; "unaware…", `analysis.js:87`) without a source; the 15 `KNOW_OVERRIDE` entries
and 46 `COMMAND` statements name none (`analysis.js:64-139`); all 20 explicit anchor times are "app narrative, unsourced" (12 graded B, 8 C;
`check:chronology --times`), so the chronology's evidence quotes the app's own texts. Only `appearance.js` is sourced claim by claim. This
is the largest remaining distance between the map and its claim to be "historically defensible". *Fix:* the sourcing stage proposed in §7
(data tasks). Question 130.

**H-7 · major · Soult's "twenty minutes" is graded three ways.** FACT. The Now tab states it as plain fact and direct speech: "Twenty minutes,
Soult answers" (`data.js:72`); the Command tab marks "under twenty minutes" DOCUMENTED (`analysis.js:75`); the event calls it "A memoir
anecdote", claim est (`analysis.js:269`); the Zuran's panel says he "is said to have waited" (`data.js:648`). *Fix:* a data task: one grade
(the event's), attributed, in every place.

**H-8 · major · The overclaim scan reads 7% of the prose a visitor can be shown; two live hits sit outside it.** FACT
(`node tools/audit/scan-gaps.js`, `docs/audit-evidence/scan-gaps.txt`). `redteam.js` §6 reads events' names and `why`, phases' ledes and
titles, themes, tour texts, formations' roles and notes and the plans' intent and cost (`redteam.js:183-188`): 124 of 1,764 prose strings in
the guarded data. Not read: `FEATURES` (113), the phases' timeline lines, the tracks' acts and objectives, `COMMAND` (46), `SOURCE_NOTE`,
`ACTS`, and all of `appearance.js` (1,024); nor any string written in `app.js` or `shell.html` (the first-run key, `LABELS`, the toast, the
dossier templates, the sources sheet's notes, the vantage titles, the legend). Its own banned words occur twice where it does not look:
"some men certainly died" (`FEATURES[15].story`, `data.js:714`) and "Never a source figure; always marked derived" (`SOURCE_NOTE.layers`,
`data.js:769`), which H-3 shows is not true. *Fix:* `redteam.js` (tests): scan every string of the guarded data and the app's visitor
strings, with an allow-list for reviewed phrases.

**H-9 · minor · "The sun of Austerlitz" toast.** FACT for the code: phase 3 carries `flash:"The sun of Austerlitz"` (`data.js:81`), toasted
on entering 08:45 (`app.js:2581`), at tour stop 6 and opening step 2; no label, no scan reads it, and the app's own light note says the sun at
08:45 is the narrative's and cites no source (`app.js:6412-6426`). INFERENCE: the phrase is Napoleon's later invocation (1812); the sun over
the Pratzen rests on memoirs (Ségur, Marbot, Thiébault would settle it). *Fix:* data task: attribute and label, or drop the flash.

**H-10 · minor · An open question drawn as settled: vines.** FACT. `SOURCE_NOTE` keeps open "whether vines stood at Telnitz and at Stare
Vinohrady in 1805" (`data.js:764`). The phase-1 lede says "the vineyard bank" (`data.js:60`; kept deliberately by the owner,
`CHANGELOG.md:4254`); the landscape draws a vineyard cover class at Stare Vinohrady (`world.js:99`, `VINEYARD`, guarded) and the going key
names it "vineyards" (`tokens.js:88`) without a qualifier; only vandamme@3's act marks it (`data.js:210`). Question 135.

**H-11 · minor · `data.js` and `appearance.js` contradict each other inside the same dossier.** FACT. The Dress notes acknowledge each conflict;
the `data.js` string is unmarked: the Austro-Russian cavalry's "brigades of Gladkov and Uvarov" (`data.js:558`) against "No 'Gladkov'
appears in any source read" (`appearance.js:612`); "the Ryazan and Fanagoria regiments" (`data.js:496`) against "Ryazhsk or Ryazan,
unresolved" (`appearance.js:594`); Miloradovich's battalions, Rivaud's and Drouet's division numbers, the Santon's "17e Légère" (the
appearance notes at `appearance.js:525-603`). *Fix:* a data task (the 6B data questions, `CHANGELOG.md` 6B entry).

**H-12 · minor · Other silent internal contradictions.** FACT, each by grep:
- Blasowitz "Fell: About 11:00" (`data.js:700`) against 11:15 in the event, the phase line and the theme (`analysis.js:295`, `data.js:97`,
  `analysis.js:50`).
- Constantine "Committed against Vandamme at around 11:00" (`data.js:589`) against "after 11:00 … not established" (`data.js:103`, `:626`).
- Langeron "the only Allied commander on the left to react" (`data.js:482`) against Kamensky acting on his own judgement (`data.js:497`).
- The Zuran held "from about 06:00" (`data.js:646`, `:56`) against the headquarters "On the Zuran mound" from 04:00 (`data.js:155`).
- "The first shot of the battle" (`analysis.js:250`) against Legrand "skirmishing through the night" (`data.js:224`).
- The terrain study's "Steep enough to hide a division" (`world.js:130`) against "a gentle rise" (`data.js:762`) and "it was the fog that hid"
  (`analysis.js:359`); "Infantry cross it anywhere" (`world.js:132`) against "the only practical crossings" (`data.js:654`).
- Arithmetic: Kienmayer 6,800 against his note's 3,440 + 3,440 = 6,880 (`data.js:451`); the IV Corps 23,600 against its divisions' 20,300;
  the chapel battery "24 guns of the Guard and IV Corps" (`data.js:180`) against Thiébault's all-Guard 24 (`appearance.js:493`) and "the
  number of pieces is not recorded" (`data.js:171`).

**H-13 · minor · The ice: the debunking told as fact.** FACT. The map does not suggest mass drowning (the audit's rule holds). But the ice
event is `claim:"fact"` and its `why` ends "The catastrophe was encirclement, not drowning" (`analysis.js:331-333`); the Satschan mere's story
says "some men certainly died, but the mass drowning is propaganda that Tolstoy later made permanent" (`data.js:714`); the hedge "as usually
given" is missing there. INFERENCE: the drainage count is a lower bound and does not establish the toll. *Fix:* data task: label as
interpretation, keep the hedge.

**H-14 · minor · Unlabelled superlatives, counterfactuals and rounded figures.** FACT: "the single most consequential mistake of the Allied
plan" (`data.js:526`, which also drops the Russian accounts' attribution of the delay to Kutuzov kept in four other places); counterfactuals
at `analysis.js:191`, `:257`, `data.js:628`; "roughly 60,000" (`analysis.js:15`), "about 50,000 by the Allied estimate" (`:153`), "Buxhowden's
40,000" (`:40`, and "forty thousand" at opening step 3, `:363`) against the record's 33,000-40,000 (`data.js:438`). *Fix:* data task.

**H-15 · minor · The opening's played stretch names events without their grade.** FACT. While a stretch plays the bar shows each dwell's
event names (`app.js:3741-3748`): the Kamensky event at 09:45 (H-1), "The Russian Guard takes the eagle of the 4th Line" at 11:00 (an
interval whose hour is not established, `data.js:103`), "Langeron's reinforcements arrive as the crest is lost" (graded C, `analysis.js:287`),
as the timeline caption does. Recorded by 7D (`CHANGELOG.md:97-101`); still unmarked. *Fix:* presentation: the interval note the marker's
accessible name already carries ("an interval: the hour is not fixed", `app.js:5651`) in the caption and the bar.

**H-16 · minor · The eye-level vantage's two neighbours claim sight.** INFERENCE. The vantages "Napoleon's command post: what he could see" and
"The field as the Allied staff saw it" (`shell.html:100`, `:102`) are elevated preset cameras (`app.js:4791-4793`), not the 5E eye or the
knowledge model, and carry no "model reading" label. *Fix:* presentation: retitle.

**H-17 · minor · 131 of the appearance table's 311 quotes rest on one reading of a page image.** FACT (`node tools/stage6/verify-quotes.js`,
re-run: `docs/audit-evidence/quote-check.md`): 107 found whole in the source's text, 32 with OCR differences, 41 checked on page images in 6B,
56 not found in damaged OCR and 75 with no text layer reachable here (6B recorded 134 of 309 resting on the page-image reading; the same script on
the unchanged, guarded `appearance.js` counts 311 today (INFERENCE: the 6B record was written before the table's last edit; R-2). The drawn coats, facings and standards of
classes graded A or B rest on them. *Fix:* a human second reading of the A-graded quotes among the 131 (question 136).

**H-18 · polish (INFERENCE) · Two place stories.** "Napoleon signed the armistice with Francis at the castle here on 6 December"
(`data.js:725`): INFERENCE: it was signed by plenipotentiaries after the 4 December meeting at the mill; the Correspondence (`corr11_1863`,
registered) would settle it. The Santon "Named by French soldiers after a chapel in Egypt" (`data.js:642`): a tradition stated as fact.

**H-19 · polish · Spelling and jargon.** FACT: "St-Hilaire" once (`data.js:76`) against "Saint-Hilaire"; "Thiebault"/"Thiébault",
"Legere"/"Légère", "Olmutz"/"Olmütz", "Bessieres", "Grande Armee" (`app.js:5512`) without accents; "Satschan mere" and "pond". The Dress notes
show internal words to visitors ("data.js", "(col4.mixedNote)", "a data question, not changed here", `appearance.js:545-603`).

**The open questions the records carry, and where each surfaces** (FACT, each from the code; "marked" means marked where it is shown):

| open question | where a visitor meets it | marked there? |
|---|---|---|
| `dok@1`, Dokhturov's descent | the Now tab's phase-1 line "c. 07:30" (`data.js:63`); the map (moves from 04:00); the event "columns begin to leave", Fact, Timing A (`analysis.js:240`); tour stop 4 "From seven o'clock…" (`analysis.js:357`); the arrow "I Column descends" | **no**; only `SOURCE_NOTE` and the sources sheet's arrow list |
| `kamensky@3`, `@4`, Kamensky's turn | the Now tab at 08:45 (`data.js:500`); the phase-4 line "c. 09:45" (`data.js:87`); the event, Fact, Timing A (`analysis.js:283`); the marker, the dwell, the opening's bar; the arrow; the formation's "Fact" pill | **no**; only `SOURCE_NOTE` and the arrow list |
| `guard_cav@6`, Rapp's counter-charge | the Now tab "c. 11:45" and "What changed at 11:15" (`data.js:104`, `:403`); the map, the marker and the dwell at 11:15 | partly: the event's dossier ("Interval", Estimate, Timing B); not the Now tab |
| `sthilaire@3`, `vandamme@3` (derived at the march-rate ceiling) | the climb 08:45-09:15 on the map; tour stop 6 and opening step 2's "At about a quarter to nine Saint-Hilaire and Vandamme climb"; the stretch to step 3 | in the dossier's Timing row (`app.js:6049-6053`) and the sources sheet's derived arrivals (`app.js:6467`); not on the map or in the bar |
| `bag@8` (ceiling) | Bagration's withdrawal 16:30-16:45; the phase-8 line "c. 16:30" | dossier and sources sheet only |
| `c_gren@8`, `kollo@5` (forced near the ceiling) | their moves on the map | the dossier's Timing row only |
| the eagle of the 4th Line's hour | the phase-6 line (`data.js:103`), the event interval, Stare Vinohrady's panel (`data.js:626`) | **yes** there; **no** in Constantine's role (`data.js:589`), the caption and the opening's bar at 11:00 |
| decision 119 (b), the plateau label | the map label in phases 0-7 | **no** (H-3) |
| Russian infantry flags (decision 105) | the standards drawn plain | yes: legend and sources sheet (`app.js:6385-6399`) |
| Grenz brown | the Dress section | yes, shown disputed (`appearance.js:427-428`) |
| vines at Telnitz and Stare Vinohrady | the phase-1 lede, the vineyard cover, the going key | **no** (H-10) |
| the Russian Guard's upper bound | the event bar ending 13:00 | partly: the "Interval" pill |
| Bagration's line at dawn; the Posoritz post house | bag@0's act (`data.js:576`); the place's subtitle (`data.js:748`) | yes (the Posoritz map name has no mark) |
| the true position of Turas | the village on the map; a plan order (`analysis.js:168`) | **no** |
| Kologrivov's command (one source) | the counter and the dossier's header | the dossier's note only (`data.js:605`) |
| the stream gradients; the chapel's sightline | not drawn; the eye-level caption | `SOURCE_NOTE` only; yes (`app.js:3420-3421`) |

### 2.2 Data integrity

The guard holds: `check:data` finds all 121 guarded declarations byte-identical to `archive/stage6b-7fc0f6c3.html` (25 historical, 43
geographic, 35 model, 1 appearance, 17 derived-reading declarations; `docs/audit-evidence/check-data.txt`). Every top-level declaration of
`geo.js`, `data.js`, `analysis.js` and `appearance.js` is in its lists. Every position anchor of every tracked formation declares a grade
(none falls back to the default; FACT, node count over the 32 tracked formations). The leaf rule, `plateauStrength` and `centreSeparation`
iterate leaves only; the plateau reads 38,700 at 04:00 and 23,550 at 08:45, as the records say. `check:chronology`: errors 0.

**D-1 · major · `check:chronology` judges a frozen, hand-written table, not the live text.** FACT. `--check` takes its verdicts from
`REVIEW` (`tools/stage2/chronology.js:107-182`), whose text times are typed numbers; the timed statements it extracts from the live
sources (`ST`, `:66-88`) are not compared (`:276-298`). An anchor without a `REVIEW` row is "undetermined" or "minor", which never fails. Its
header says `--check` fails on "a timing or march-rate finding" of the movement audit (`:8`); it does not run it (`:289`). `FORCED_DATED`
is only printed (`:295`). `CLAUDE.md` says every other derived arrival is at the tactical rate; `--check` accepts any rule but the ceiling
(`:284-287`; `gqg@6 … moveMin` passes). Because `check:data`'s reference moves in a data task, this check is the one left to catch a
retimed sentence: in a data task, "c. 12:00" behind gqg@6 changed to "c. 13:30" passes. *Fix:* `tools/stage2/chronology.js` (tests): match
each live timed statement to a `REVIEW` row and fail on a statement with no row or a row whose time is no longer in the text; assert
`FORCED_DATED` and the arrival rules. Question 131.

**D-2 · major · The grade check skips 30 of the 32 formations; a missing grade is drawn as B without a word.** FACT. `redteam.js:209`
requires a `cf` on a formation's first anchor only when that anchor is not at phase 0 (`k!=="0"`); 30 of the 32 tracked formations have
their first anchor at phase 0 (node count). `stateAt` silently defaults to `cf:"B"` (`app.js:576`). No grade is missing today; a data task
that drops one passes every suite and draws the formation at B. *Fix:* `redteam.js` and `test.js` (tests): require a grade on every
formation's first positioned anchor. Question 131.

**D-3 · minor · The V Corps counts the Santon's 1,600 twice.** FACT. Suchet's 6,000 are "including the detachment on the Santon"
(`data.js:288`); the Santon (1,600, `data.js:300`) is a sibling leaf under `c_v`, not Suchet's child, so the corps' leaves sum to 14,300
against its 12,700 (`data.js:269`). The leaf rule cannot catch overlapping siblings: `sim-test.js` reports "French 69,900 of 73,000" on the
field at once where 68,300 follows from the notes, and the 1,600 men are drawn twice (in Suchet's blocks and the Santon's). No total shown to
a visitor uses the sum. *Fix:* a data task: the Santon as Suchet's child, or Suchet at 4,400 with a note.

**D-4 · minor · A duplicate key and a dead field in the guarded data.** FACT. `heightguns@8` declares `cf:"C"` and then `cf:"B"` in one object
(`data.js:178`, `:180`); the later wins; it is the only duplicate key in the sources. `heightguns@7` carries `moveMin:30` on its first anchor,
where it cannot act (`data.js:175`). `PHASES[].light` (guarded) has had no reader since 4B. *Fix:* data task.

**D-5 · minor · Data that lives outside the guard.** FACT. `SUN_DAY`'s date and clock basis (`app.js:189-216`), `FEATURE_GT` (which decides
each "surveyed X m", `app.js:6173-6175`), the grade definitions shown to visitors (`TIMING_TEXT`, `CONF_TEXT`, `app.js:5843-5853`) and the
historical values typed into `standardNotes` and `troopNotes` (81 cm, 161 × 142 cm, 142 cm, the Leib colour, "French dragoons wore green…",
`app.js:6370-6399`), which duplicate `appearance.js` and match it today. *Fix:* add them to `tools/visual/data-invariance.js`'s lists, and
write the notes from `COLOURS_CARRIED` and `STANDARD_MEASURES`.

**D-6 · minor · Derived readings without the tag.** FACT. The dossier's "Marching / Next move: x km in y min · z km/h" (`app.js:6041-6047`)
is computed from the anchors and the timing rule, under the section's "reconstruction" tag, while the "Ordered route" row beside it is tagged
derived (`app.js:6055-6058`). An aggregate's "Position at" is the mean of its leaves (`posNow`), named as a place ("x km NE of Y") that may
hold no troops. The "plotted strength unchanged" note depends on when the clock was last moved, not on when the reading changed
(`app.js:5582-5590`): jumping to 06:00 shows no note, playing from 04:45 shows it from about 05:45. *Fix:* presentation.

### 2.3 Geographic integrity

Sound (FACT): `GEOREF` is the only scale authority: every distance and bearing goes through it (`kmBetween`, `bearingDeg`, `UNITS_PER_KM`,
`KM_PER_MAP`); the height guard finds no presentation call of `height()`/`hAt()` (97 call sites classified); `toMap`/`toGeo` round-trip
exactly; the paper map's north is within 0.5° of up and its scale bar within 1% (`check:visual`'s paper cases and the self-test); the relief
factors are defined once (`DISPLAY.settings`, `world.js:385`); `geo-test`: 54 passed, 0 failed; villages, features and summits within 20 m
of ground truth.

**G-1 · minor · The landscape's scale bar is true only at the orbit target, and does not say so.** FACT. In perspective the bar measures at
the free rectangle's centre (`app.js:6336-6352`) and is named only "Scale" (`shell.html:260`). `docs/VISUAL_AUDIT.md:133` asked to "say so".
*Fix:* presentation: its accessible name and a title, "at the centre of the view".

**G-2 · polish · The map-to-world factor is typed outside `geo.js`.** FACT. `GEOREF` keeps `MAP_PER_WORLD=2` (`geo.js:37`) unexported;
`W()` types 0.5 (`world.js:35`) and a theme's length types `len*0.5/UNITS_PER_KM` (`app.js:6311`). They agree today. The atmosphere's first
uniforms type 243.1, 63.2 and 238.2 (`app.js:369-370`), overwritten every frame. *Fix:* `KM_PER_MAP` at `app.js:6311` (presentation);
exporting `MAP_PER_WORLD` is a guarded change.

**G-3 · polish (INFERENCE) · Miloradovich at dawn.** `milo@0` is graded A "near Pratzen village" but plotted about 1.6 km from it, on the col
(`data.js:533`). Worth a source check (data task).

The meres stay schematic ellipses (decision 27, until a georeferenced survey); the woods' shapes and the villages' extents are the 2E data
questions; both are recorded, not new.

### 2.4 Simulation integrity

Sound (FACT, traced and simulated in node by a reviewer, the dwell re-checked here): the day runs 04:00-18:00; Play stops at 18:00 and
starts again from 04:00; positions are continuous (no jump over 250 m in a minute); at a phase boundary the anchor and the phase agree; the
clock's state is a function of the clock (trails, draw-on, smoke, the knowledge reading cleared each minute, decision 92); one dwell per
distinct start, none on scrubbing, the rate continuous (decision 75, 89); Follow is suppressed on the paper map, at eye level and in glides
(decision 78); only derived arrows draw on (decision 83); the eye stands 3 m scaled above the drawn ground (decision 91); the opening's four
stops sit on event starts, each stretch's last dwell ends on its stop, the visitor's speed is put back on every way out, and reduced motion
cuts (decision 123).

**S-1 · major · "Whose eyes?" hides the enemy's formations but not their corps' counters.** FACT (code) and measured
(`tools/audit/state-probe.js`, case `eyes-corps`: for the Allied headquarters at 05:00 on the paper map, the Imperial Guard, IV Corps, I Corps and cavalry reserve counters are drawn while every one of their formations reads "unknown"). `updateVisibility` places every aggregate counter without consulting the
reading (`app.js:4588-4592`); leaves are hidden when "unknown" (`app.js:4605-4606`). Where counters show at corps level (the paper map as
entered, "Landscape with counters" at the Overview's distance) an enemy corps whose every formation is unknown is drawn at the mean of their
true positions: for the Allied headquarters the Imperial Guard 04:00-11:10 (though `KNOW_OVERRIDE` makes both Guard formations unknown until
phase 6), the IV Corps 04:00-08:40, the I Corps 04:00-09:20, the cavalry reserve all day (293 ten-minute samples in a reviewer's node
simulation). The 5E self-test iterates leaves only (`app.js:7895-7944`). *Fix:* presentation: an aggregate's drawn reading from its
on-field leaves (hidden if all unknown, placed at the known leaves' mean, "?" if none seen); a corps case in the self-test.

**S-2 · major · Turning "Pause briefly at events" off and on while the clock plays sends the clock back.** FACT (code) and measured
(`state-probe.js`, `dwell-toggle`: from 06:30, the dwell off for 10 s of play (to 07:22, across the 07:00 start), on again: the clock went back to 07:00 and held; the first run, from 05:30, crossed no start and showed nothing). The toggle sets `DWELL.on` and clears `DWELL.st` (`app.js:5286`) but never calls
`dwellReset()`; while off, `dwellAdvance` returns early (`app.js:6542`) and `DWELL.next` stays on a start the clock passes; on again, the
branch "already inside the ease" (`app.js:6546`) eases to that past start: the clock jumps back to it and holds. `tickClock`'s guard does not
see it (`DWELL.expect` equals the clock). *Fix:* `dwellReset()` in the toggle; in `dwellAdvance`, skip a start behind the clock.

**S-3 · minor · A phase's camera leaves the eye level on.** FACT (code) and measured (`eye-phase`: after a real click on the fifth phase, the eye level is still on with Follow on and no vantage pressed). `setPhase` sets
`freeCam=false` and the phase's arc (`applyArc`, `app.js:2534-2558`) never calls `eyeLeave()`; `eyeFollow` then pins the eye to the
headquarters each frame: the eye level stays on with Follow shown on and no vantage pressed. *Fix:* `eyeLeave()` when a phase moves the
camera.

**S-4 · minor · At eye level the dossier and the drawing disagree.** FACT (code). `drawnKnow` turns "seen" into "reported" where the eye has
no line of sight (`app.js:3323-3329`); the dossier's pill uses `knowledgeOf` (`app.js:6013-6015`) and says "In sight". A reviewer's node
count: 477 ten-minute formation-readings over the day are "seen" only by an override. *Fix:* presentation: the pill from `drawnKnow`, with
the reason.

**S-5 · minor · State that depends on the path to the clock.** FACT. A stationary formation's facing is cached per phase (`faceCache`,
cleared on a phase change, `app.js:2575`, `4401-4429`), so it is the facing computed at the first clock visited in the phase: 10
phase-formation cases differ by more than 30° between entering at the start and near the end (Bagration in "The wheel" by 178°; reviewer's
simulation). With D-6's "plotted strength unchanged". *Fix:* facing per clock minute or per leg (presentation).

**S-6 · minor · Reduced motion is read once.** FACT. `RM` is evaluated at load (`app.js:4`); a preference changed while the page is open is
ignored until reload (measured: `rm-live`: reduced motion emulated after load, then Begin and Next: the stretch plays). `style.css` has no `prefers-reduced-motion` rule: the panels' 0.32 s slides, the
toast and the boot fade stay. *Fix:* a `change` listener on the media query; one CSS rule.

**S-7 · polish · Smaller timing seams.** FACT. Changing speed during a dwell's ease keeps the old speed's ease (`d`, `te` fixed on entry,
`app.js:6544-6556`): 4x to ½× mid-ease runs about 10 clock minutes in 0.5 s, then drops. `redrawGround` sets `tween=null` but not the tween
slots (`app.js:1829`), so `followActive()` stays false (`!_tw.cam`, `app.js:6592`) until the next phase: a relief change during a vantage's
glide leaves Follow idle. At 08:45 the knowledge rule and the viewshed step with `PHASES[].mist` while the drawn fog eases over 20 minutes
(`app.js:375-378`, `3193`, `3360`); no formation's reading differs (reviewer's 5-minute sampling 08:40-09:10).

### 2.5 Software correctness

Sound (FACT, traced; the state probe's other cases measured): no listener is added twice; the only timers are the toast's and the boot's;
the clock and path helpers guard their divisions and float comparisons; nothing is stored (no `localStorage`), so nothing fails there; the
page hidden while playing stops the loop and caps the next step at 120 ms; the opening's every way out (Esc, Skip, Finish, a key, a press, the
camera) runs `openingHalt` and puts the visitor's speed back; starting the tour during the opening and the reverse are sound by pointer and
key; the first-run card closes by every way it should. Measured by real clicks and keys (`node tools/audit/state-probe.js`, `docs/audit-evidence/state-probe.json`, `state-probe-rerun.json`): the opening's stretch with "?" over it, then Esc and Esc (the end state: 04:00, ½×, Play focused); a stretch ended by M (in place, the clock stopped, ½× back, the paper map); step 2, the key 3, Esc; the eye level, then the opening (the eye left); the Layers panel and Esc (focus stays on Layers); the day's end (18:00 stops; Play starts again at 04:00); a stretch through a resize to 1024 px, then Skip (the end state); the tour at stop 3, then the opening (it replaces the tour; Skip leaves neither); the key 2 with the card open, then Esc.

**SW-1 · major · If three.js cannot load, or WebGL cannot start, the page stays on its boot line for ever.** FACT (code) and measured
(`node tools/audit/boot-probe.js`: with three.js blocked the page error is "THREE is not defined" and after 20 s the boot line is still there; without WebGL, "Error creating WebGL context.", the same; `docs/audit-evidence/boot-no-three.png`, `boot-no-webgl.png`). The three.js script comes from cdnjs at run time (`shell.html:332`), without an `integrity`
attribute. The bundle's first use of it (`app.js:110`, `new THREE.Vector3`) throws when it is missing, so nothing after it runs; without
WebGL `new THREE.WebGLRenderer` throws inside `init()` (`app.js:507`). In both cases `#boot` ("Surveying the ground between the Goldbach and
the Litava…", full screen) is never removed and nothing says why. There is no `window.onerror` and no `webglcontextlost` handler. The
"self-contained HTML" works only online. *Fix:* `shell.html`, `app.js`: an `integrity` and `crossorigin` attribute on the script; a guard
before the bundle and a try/catch around `init()` that write a plain message into `#boot`; a context-loss notice. Question 133.

**SW-2 · major · Below 1080 px the rail can stand over the dispatch card.** FACT (code) and measured (`narrow-resize`: Study at 1280 x 800 narrowed to 1000 x 800: the rail stays at x 0-272 over the dispatch card at x 16-436; the key 2, then Esc: the same).
`syncDock` moves the dispatch out of the rail when the window narrows but never hides the rail (`app.js:6645-6656`; only start-up adds
`rail-hidden`, `app.js:5354`); `showEverything` removes `rail-hidden` at any width (`app.js:6683-6687`), so Esc after Watch or Clean shows it
too. The narrow rule `.dispatch{left:16px}` (`style.css:521`) puts the card under the 272 px rail (z-index 20 over 18). Narrowing a window or
turning a tablet from 1180 to 820 px does it. *Fix:* `syncDock` adds `rail-hidden` when it undocks; `showEverything` removes it only from
1080 px.

**SW-3 · major (accessibility) · Panels moved off screen stay in the Tab order and the accessibility tree.** FACT (code) and measured
(`drawer-focus`: after a real click on the dossier's ×, focus stays on it, off screen; the next Tab goes to the dossier's "full dossier" button, off screen; the Tab walk, §2.7). The closed dossier and the hidden rail are only translated off screen (`style.css:22`,
`:130`); nothing sets `inert`, `visibility:hidden` or `aria-hidden`; `paintDrawerBody` leaves the last dossier's buttons in place
(`app.js:5857-5860`). Closing a dossier by its ×, "Back", Esc or a click on the ground leaves focus on an off-screen button; Tab then walks
through the invisible dossier (WCAG 2.4.3, 2.4.7, 2.4.11). Below 1080 px in Study the hidden rail's 40 order-of-battle rows are tab stops.
*Fix:* `style.css`: `visibility:hidden` on the closed drawer and the hidden rail after their slide (or `inert`); clear the drawer's body;
focus back to the opener when a panel closes with focus inside.

**SW-4 · major (accessibility) · The sources sheet is a modal without a modal's focus, and Esc does the wrong thing on it.** FACT (code) and
measured (`sources-*`: Esc with the tour at stop 1 ended the tour and left the sheet open; Esc with a theme chosen closed the sheet and cleared the theme; after a click on Sources focus stays on the button, Tab goes on to the tools behind the sheet, and its close button leaves focus on nothing; Space with the sheet open played the clock behind it). `#modal` is `role="dialog" aria-modal="true"` (`shell.html:292`) but `openSources` neither moves focus
into it nor keeps Tab inside, and closing does not return focus (`app.js:6431-6478`, `:5379`); keys act behind it (Space plays the clock).
The Esc row runs its other branches first (`app.js:5047-5056`): with the tour (or the opening) running, Esc ends the tour and leaves the
sheet open; when it does close the sheet it also clears the selection and the chapter. A click on its scrim does nothing (the "?" overlay's
does). *Fix:* treat it as `setHelp` treats the overlay (remember the opener, focus its close, keep Tab inside, close on the scrim, return
focus), and close the topmost sheet first in the Esc row.

**SW-5 · minor · Focus left on elements that disappear.** FACT, each traced: "Leave the tour" and the last stop's "Finish" hide the bar with
focus on it (`exitTour`, `app.js:3626-3633`); "Back" to stop 1 disables the focused button (`app.js:3656`; the opening guards this, the tour
does not); the Layers panel's × hides the panel with focus on the × (`app.js:5358-5364`; Esc leaves focus on "Layers", where it was); the selection chip's ×, the sightline badge's
"Clear"; Watch's switch is moved in the DOM (`syncViewmode`, `app.js:6671-6676`), dropping focus from the pressed button; the card open and
the key 3 or H focus Play (`app.js:5479`) and Clean then hides the timebar; a focused map item that goes off screen gets `display:none`
(`app.js:4243`). Measured: the dossier's × (SW-3); Esc on the Layers panel leaves focus on Layers, where it was (the panel never takes focus). *Fix:* return focus to the opener (as the opening and the "?" overlay do).

**SW-6 · minor · The "?" overlay loses its Esc and its Tab trap after a click on its text.** FACT (code) and measured (`help-click-esc`:
after a click on its heading Esc left it open, focus on the body). Its keys are bound on `#help` (`app.js:5131`) and `onWindowKey` returns while it is open (`app.js:5141`); a click on the
heading moves focus to the body, after which Esc and "?" do nothing and Tab leaves the dialog. *Fix:* `tabindex="-1"` on the sheet, or handle
Esc, "?" and Tab in `onWindowKey`'s help branch.

**SW-7 · minor · Visual effects off and on again leaks the post-processing targets.** FACT (code) and measured (`fx-toggle`: the GPU textures 31, then 37, 43, 49, 55 after each off-on).
`setFXEnabled(true)` calls `initFX()` again (`app.js:2840-2856`), which makes six new render targets and four materials (`app.js:2626-2700`)
and disposes none. *Fix:* reuse the targets when they exist.

**SW-8 · minor · Pointer edge cases.** FACT. The wheel over the map does not close the first-run card (only `pointerdown` does,
`app.js:5321-5322`; measured: `wheel-card`: after a wheel over the map the card is still open and Follow is off). A horizontal swipe or Shift+wheel (deltaY 0) turns Follow off and ends the opening
without zooming (`app.js:5204`, `:4936`). *Fix:* `bindCanvas`.

**SW-9 · minor · The Layers panel stays open in Watch and Clean.** FACT (code) and measured (`layers-watch`: the panel stays open in Watch, its opener hidden, focus on the body). The keys 2, 3,
U and H hide its opener (`.tools`) but not `#layerpop`. *Fix:* close it in `setPresentation`.

**SW-10 · minor · Layout seams.** FACT. At exactly 1080 px JavaScript docks (`innerWidth>=1080`, `app.js:6644`) and the CSS's
`max-width:1080px` (`style.css:518`) also applies: a docked 272 px rail with the narrow layout's legend and tools. The pixel ratio is set once
(`app.js:510`), so a window moved to a screen of another density stays blurred or oversampled. Some responsive rules never apply: the
unconditional `#firstrun` rules (`style.css:600-604`) come after and override the media rules at `:534-535` and `:572-574`; `#layerpop`'s
`top:56px` (`:577-579`) is overridden by a later block. *Fix:* `max-width:1079.98px`; `setPixelRatio` in the resize handler; reorder the rules.

**SW-11 · minor · The opening and the tour keep the "Whose eyes?" reading.** FACT. Neither resets `commandView`, so the opening's words can
play over a map filtered to one headquarters' knowledge, enemy formations removed. INFERENCE: not intended (no decision covers it).
*Fix:* the opening's start sets "everyone" (and restores it after), or says which reading it shows.

**SW-12 · minor · The "Guided tour" button ends the tour during the opening.** FACT (code). Its handler is `if(tourStep>=0) exitTour(); else
startTour();` (`app.js:5299-5301`); during the opening `tourStep>=0`, so a click with no preceding pointer or key event (a screen reader's
default action, `element.click()`) runs `exitTour()` and leaves `OPENING.on` true, a stretch possibly still playing. *Fix:* end the opening
first.

**SW-13 · polish · Dead code and leftovers.** FACT (acorn and grep): never referenced: `shade` (`app.js:698`), `subUnitsFig` (`:931`),
`frameClock` (`:6705`), `grainTexture` (`world.js:1083`), `themeTok` (`tokens.js:107`); `playRAF` (`app.js:2285`) is kept only because
`css-test.js` matches its declaration text; `getElementById("fxstate")` (`app.js:2853`) names no element; the body classes `plan-on` and
`cmd-on` have no CSS; the id `vantages` is unused; the CSS `#firstrun b.fr`, `b.al`, `.key-ar` match nothing; `#firstrun` and `.legend .ar`
are declared twice; `window.__setPop` leaks a global; `flash()` never clears its earlier timer, so a second toast within 3.4 s is cut short
(`app.js:6481-6485`); `loop()` runs `syncFollow`'s `querySelectorAll`, `openingWatch` and `paintDevStats` on every animation frame, idle or
not. Four `console.warn` calls can reach a visitor (`app.js:562-563`, `:2843`, `:2875`, `:6750`).

### 2.6 The tests

The plumbing is mostly sound (FACT): every suite's failure output matches `tools/run-all.sh`'s pattern; the self-test has no try/catch, so a
throw fails `check:visual`; most loops guard against emptiness. These do not:

**T-0 · major · `check:visual` fails on the unchanged 7D build in a fresh machine, because of the fonts installed.** FACT (measured).
On this build, which passed `check:visual` in the 7D session ("STAGE0: all checks passed", `narrow-390` 46.9%), the run here failed once:
"narrow-390: unobstructed map 46.0%, below the baseline 46.8%" (`docs/audit-evidence/check-visual.txt`; every other view at its 7D value,
the self-test 212 of 212). Re-run alone it measures 46.03% again: not load. The cause is the type: the tokens name system font stacks
(`tokens.js:45`: sans `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, sans-serif`; serif `"Iowan Old Style",
"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif`), so the faces drawn are whatever the machine has. Here Chromium draws the
interface in Inter and the card in Liberation Serif (`node tools/audit/font-probe.js`, `docs/audit-evidence/font-probe.json`); at 390 x 844
the timeline wraps to 174 px (the 7B record: 172) and the card stands 2 px higher. With the sans resolved to DejaVu Sans the same page
measures 172 px and 46.89% (passes); with Liberation Sans or FreeSans 174 px and 46.37% (fails). The baseline's margin (0.09 point, decision
62's "never lowered") is smaller than one font's effect (0.86 point). So a required check's verdict depends on the machine, and every next
task starts red here. The same stacks give a visitor different faces by operating system (`docs/VISUAL_AUDIT.md:134`, "serif fallbacks differ
by OS", open). *Fix:* either embed one open sans and one open serif in the file (a few tens of KB as WOFF2 base64; the build then draws the
same everywhere) or pin the harness's fonts (install DejaVu and make the stacks resolve there in the harness only) and record them in
`tools/visual/README.md`. Question 141.

**T-1 · major · A page error or a console error never fails a check.** FACT. `harness.js` records page errors and console errors
(`tools/visual/harness.js:23-25`) but only prints the last page's (`:397-399`); they never reach `report.failures`. `contrast.js` does not
listen. `runtime-test.js` prints "console.warn unique: N" (`:710`), which no pattern in `run-all.sh` fails on. Its one warning today,
"THREE.LineBasicMaterial: 'fog' is not a property of this material", is a false positive of its own stub: in three.js r128 every material has
`fog` (`node_modules/three/src/materials/Material.js:16`), and the stub's allow-list for `LineBasicMaterial` omits it (`runtime-test.js:109`).
A `setTimeout(()=>{throw new Error()},0)` in `init()` would pass every check. *Fix:* `harness.js`: every page's errors into the failures,
with a named allow-list; `run-all.sh`: fail on "console.warn unique: [1-9]"; `runtime-test.js`: the allow-lists from real r128 materials.
Question 131.

**T-2 · major · The meres' "floats" check is a tautology.** FACT. `terrain-test.js:87-88` sets `wl=Math.min(base+…, lo-0.05)` and passes when
`wl<=lo`, which always holds; it re-implements `mereLevel` on the model's `height()` with the radii typed again (`world.js:1177-1181`,
`:1203-1204`). The self-test's ice check samples the same 96 points and does not count the meshes it found (`app.js:7608-7613`). *Fix:* call
the live `mereLevel` and sample the drawn ground densely along the edge; require a mesh count.

D-1 (`check:chronology`) and D-2 (the grade check) are majors of the same kind, under §2.2.

**T-3 · minor · Warnings never fail.** FACT. `test.js:61`, `:205`, `:207`, `:224` and `redteam.js:77`, `:87`, `:105`, `:159`, `:168`, `:172`
only warn. `CLAUDE.md` says (6B) "every source cited and registered"; "cited nowhere" is a warning (`test.js:224`). `redteam.js` carries one
standing warning nobody acknowledges ("cavalry mean rate 0.82 is not above infantry 1.23", explained in `CHANGELOG.md:3470`), so a new one
would go unnoticed. *Fix:* allow-list the known warnings by name and fail on any other.

**T-4 · minor · The self-test's size and the harness's other failures are asserted nowhere outside the run.** FACT. `harness.js:247`
iterates `st.checks` without asserting their count (212 on this build). `check:report` (`tools/visual/check-report.js`) never reads
`r.failures` (the slider keys, the light sweep, the fog views, the horizon, the pacing and every real-key check live only there), does not
require all 30 cases, and makes the self-test optional (`if(r.selfTest)`). *Fix:* assert the count or the names; include the failures, the
cases and the self-test in `check:report`.

**T-5 · minor · Checks that skip without a word.** FACT. About 13 feature gates in `harness.js` (`:123`, `:146`, `:159`, `:169`, `:198`,
`:249`, `:268`, `:290`, `:317`, `:330`, `:352`: `typeof OPENING`, `CONF`, `ROUTES`, `SKEL`, `DWELL`, `KEYS`, `SUN_DAY`, `ATMO`, `SMOKE`, …),
three in `thresholds.js` (`:197`, `:207`, `:213`) and some in `contrast.js` (`:99-116`) skip a check when a name is absent: renaming `DWELL`
drops the dwell's checks silently. Three views have no unobstructed baseline and are skipped by `if(U&&…)` (`eye-zuran`, `eye-zuran-1x`,
`plans-overview`; `thresholds.js:68-81`, `:189`), against "the unobstructed fraction … per view". *Fix:* on the current build, require the
features; add the three baselines.

**T-6 · minor · Checks weaker than their claim.** FACT:
- Follow's "every live event in the free rectangle in at least 80% of its minutes" counts minutes with no live event as passes
  (`app.js:7517-7519`): 205 of 840 minutes have none, so the effective bar is about 73.5% of the minutes that have one.
- The palette check reads only six-digit hex (`css-test.js:146`); `rgba(…)` and `THREE.Color(r,g,b)` literals escape it (`world.js`
  wallTexture, roofTexture; `app.js` buildSunDisc, `ATMO`), so 4E's "colours in their tables" is not enforced.
- The confidence marks' sizes are expected from `confSize` (`app.js:7766`), the function that draws them (`:1451`): decisions 86-88's rule
  is never asserted independently; `geo-test.js:26`, `:37` restate `geo.js:51`, `:46`.
- `runtime-test.js` computes and never asserts: `camBefore` (`:359`), the plan links' density (`:365-372`), "derived reading wording"
  (`:375-378`), `sitSeen` (`:245-250`), a no-op traverse (`:644-647`); "40 rounds of rapid switching OK" prints after an unrelated toggle
  (`:684-686`).
- Events: `sim-test.js:63` and `redteam.js:55` skip unknown formation ids silently; `test.js` never validates `EVENTS`.
- The harness never checks that a case reached its state (`applyCase` returns true always, `app.js:7014-7034`; `harness.js:118` ignores it;
  only the eye and opening cases are verified); `groundSelfCheck` (`measure.js:394`) is recorded, never asserted.
- "Slow drift draws at the ambient rate" cannot be tested: the self-test runs only under `?harness=1`, which turns the drift off
  (`app.js:6711`, `:8866`).
- Vacuous edges: no `routes>0` (`thresholds.js:223-225`); `capDerived===false` lets `null` pass (`:210`); `fw.worst<=0.02` without `fw.n>0`
  (`app.js:8279`); the timeline placement loops pass with no `.step` (`app.js:8410-8415`); the eye level does not require an unknown
  formation (`app.js:7898-7905`).

**T-7 · minor · Wall-clock thresholds.** FACT. The map layer's 8 ms (`thresholds.js:82`, `:185`), the self-test's `msMove<=2` ms
(`app.js:8250`), a 20 s wait for a frame (`harness.js:268`): measured under software WebGL on a shared machine, they can fail under load
without a defect (this audit ran `check:visual` beside five read-only reviewers, at a load of about 4 on 4 cores: none of them failed, the
layer's largest pass 1.7 ms).

**T-8 · minor · CI runs neither `check:visual` nor `check:contrast`.** FACT (`.github/workflows/checks.yml`). The self-test, the contrast
check and the opening's real-key checks run only when someone runs them by hand (its comment says the harness takes "about ten minutes"; the
7D run took 101). Question 132.

**T-9 · polish.** FACT: the relief anchors are checked twice with different margins (`geo-test.js:74-78`, `terrain-test.js:70-80`: 25 m and
20 m); `audit.js:28-43` only prints; `css-test.js` merges `@media` bodies into one (`:51-55`), takes the first `min-height` (`:290`), matches
colour words as substrings (`:195`), carries dead code (`:6`), and two pairs of overlapping checks (`:127`/`:328`, `:330`/`:339`);
`binding-test.js`'s dash patterns (`:88`) miss SVG `stroke-dasharray`; re-implementations instead of live code (`terrain-test.js:96-104`,
`redteam.js:62-66`, the typed 680 × 500 and `*2+340` in `test.js:34`, `:84`, `geo-test.js:15`); `chronology.js:80`, `:82` read `c.t` and
`s.t`, removed in the spine data task; `run-all.sh` writes fixed `/tmp/out_*.txt` paths; the suites run outside `run-all.sh` read stale
generated modules (`_world_mod.js` and others; only `geo-test.js` regenerates).

### 2.7 Visual and UX quality, and accessibility

**What was measured.** `check:visual`'s 30 views (`docs/audit-evidence/harness-sheet.jpg`, `check-visual-cases.txt`): every view but
`narrow-390` meets its Stage 0 thresholds, drop limits and unobstructed baselines (T-0); the map layer's pass 0.3-1.7 ms; map text at AA as
rendered in every view (lowest 4.89 on the paper map, 6.49-12.58 on the landscape); solid near-black at most 0.02% of the map (limit 0.05%); the smoke at most 24.0%
of the free rectangle (its cap 25%); the confidence marks at most 19.2%. `check:contrast`: 5,990 text elements in 35 states, 0 below AA, 0
below 10.5 px. The first screen at five sizes and keyboard-only use (`node tools/audit/a11y-probe.js`, `a11y-probe.json`,
`a11y-sheet.jpg`):

| size | load to the first screen | unobstructed | timeline | the card | focus at load | the card's Tab cycle | page tab stops (after Esc) | of them off screen or invisible |
|---|---|---|---|---|---|---|---|---|
| 1600 x 900 | 17.6 s | 63.4% | 90.5 px | 540 x 192 at (680, 599) | its primary | primary ↔ stay | 53 | 9 |
| 1366 x 768 | 14.5 s | 55.8% | 90.5 px | 540 x 192 | its primary | primary ↔ stay | 53 | 9 |
| 1280 x 720 | 14.5 s | 52.1% | 90.5 px | 540 x 192 | its primary | primary ↔ stay | 53 | 11 |
| 1024 x 768 | 14.1 s | 71.6% | 90.5 px | 540 x 192 | its primary | primary ↔ stay | 91 | 52 |
| 390 x 844 | 11.1 s | 46.0% | 174 px | 358 x 238 | its primary | primary ↔ stay | 81 | 51 |

(load times are software WebGL in headless Chromium, §2.8.) No duplicate id, no focusable element inside `aria-hidden`, every interactive
element named, no horizontal scroll at any size, no console error on any first screen; the page's language and title are set; the live
regions are the phase announcement (polite) and the selection chip (status). The card is a proper modal dialog (7B): focus on its primary,
Tab kept inside, Esc closes it where it stands with focus on Play. What is wrong:

**A-1 · major · Single-key shortcuts act anywhere, and nothing turns them off (WCAG 2.1.4, level A).** FACT. The keys 1, 2, 3, H, U, M, D, C,
T, F, ?, `, the comma and the full stop act from the window whenever a dialog does not have the keys (`app.js:5025-5076`, `onWindowKey`
`:5140-5156`); there is no control to turn them off or remap them, and they are not limited to a focused component. A speech-input user
saying a word, or a stray key, switches the presentation, the ground or the effects. *Fix:* question 134.

**A-2 · major · Keyboard focus lands on map items that are not drawn (WCAG 2.4.7, 2.4.11).** FACT (measured: `node tools/audit/mlfocus-probe.js`,
`mlfocus-probe.json`; `node tools/audit/mlfocus-shot.js`, `mlfocus-telnitz.png`). At the first view after Esc (1600 x 900, 04:00, the
Overview) the map layer's group has 19 tab stops; after each Tab and a drawn frame, 13 are drawn at their place, and 6 (the dropped place
names Stare Vinohrady, Pratzeberg, Zuran mound, Goldbach stream, Telnitz, Sokolnitz) stay at opacity 0 at the layer's origin (0, 0), under the
rail (z-index 20 over the layer's 6): focus is on something no sighted keyboard user can see. The layer brings a focused item forward
(`ML.focus`, `app.js:3999`) only where it can be placed. *Fix:* `mlLayout`: a focused item is always placed (wrapping or with a leader), or
dropped items leave the Tab order (`tabindex=-1`) and stay reachable through the list the group already names.

**A-3 · major · The timeline's targets are below 24 px (WCAG 2.5.8).** FACT (measured at every size). The act buttons are 15 px tall (5),
the phase buttons 16 px (10), the time rail 22 px, the event markers 11.3 x 11.3 px (22) and 14.1 px (3), the sources button in the rail 14 px
tall; they are adjacent, so the spacing exception does not apply. The essential exception may cover the event markers (their place on the
time axis carries the information, as pins on a map) and the next/previous event buttons are an equivalent control for stepping; nothing
covers the acts, the phases and the rail. The map's labels (16-17 px) are covered by the essential exception (a map). *Fix:* `style.css`: the
acts and phases rows at 24 px (the timeline then grows by about 17 px, against the 92 px limit of 3C: a decision), or a 24 px hit area
around each marker and row with the drawn size unchanged.

**Hidden panels in the Tab order; the sources sheet without a dialog's focus** are SW-3 and SW-4 (§2.5, majors), measured here: at
1600 x 900 the closed dossier's two buttons are tab stops (off screen); at 1024 x 768 and 390 x 844, 42 tab stops are in the hidden rail
(its tab, the 40 order-of-battle rows and the sources button), 45 targets lie outside the viewport.

**Reduced motion is partial** (S-6, §2.4): the preference is read once; the panels' 0.32 s slides, the toast's fade and the boot's fade
ignore it (`style.css` has no `prefers-reduced-motion` rule). The 3D motion (glides, stretches, Follow) is honoured. WCAG 2.3.3 (AAA) only;
the project claims reduced-motion support (`docs/VISUAL_AUDIT.md:142`).

**A-4 · minor · The first screen at 390 x 844 (decision 122: recorded, not a layout).** FACT (`narrow-390.png`): the timeline is 174 px tall
(17% of the height) and its act and phase labels are cut to "T…", "S…", "The Dec…"; the caption is cut ("THE DECEPTION · Dis…"); the card
covers most of the map (46.0% unobstructed). Question 137.

**A-5 · minor · Close views read as a toy.** FACT (`pratzen-orbit-min.png`, `close-sokolnitz.png`): at the closest, lowest orbit the frame is
filled by standards (the figures are 45-70 times life size, the standards 1.6 times the figure) and arrow ribbons; at eye level the movement
arrows show through the hills (`eye-zuran.png`; recorded in 5E, `CHANGELOG.md` 5E entry, not fixed). Both were left "for the owner's eye"; they
remain. *Fix:* depth-test the arrows at the eye level (presentation); the scale convention is a decision (Stage 1's decisions 6 and 14).

**A-6 · polish.** FACT: the focus ring is 1 px (`style.css:12`; meets 2.4.7, under 2.4.13's 2 px, AAA); no `main` landmark (the map and the
timeline lie outside any landmark; the rail is a `nav`, the dossier an `aside`); the Now tab's "What changed" heading is an `h4` under an
`h2` (a skipped level); the serif is drawn in Liberation Serif and the sans in Inter on this machine, and in other faces elsewhere (T-0).

**Not verifiable here:** what a screen reader says (NVDA, JAWS, VoiceOver were not available; the names, roles and live regions are read
from the DOM), forced-colours (Windows high contrast) mode, real touch, Firefox and Safari, a GPU.

### 2.8 Performance

**Software WebGL only.** Every number below is SwiftShader in headless Chromium on a 4-core container. It compares views with one another
within one run; it says nothing of a visitor's frame rate on a GPU, which no stage has measured (question 139).

| measure | value | source |
|---|---|---|
| the file | 1,764,002 bytes: textures 666,201 (37.8%; six base64 JPEGs, the three normal maps 368,453), `app.js` 662,852 (37.6%), `appearance.js` 133,336, `world.js` 104,621, `data.js` 70,073, CSS 48,263, the rest under 35 KB each | `node tools/audit/size.js` |
| of which never run by a visitor | the in-app self-test and debug API, 225,445 bytes (12.8%, `app.js:6759`); comments in the scripts, 178,758 bytes (10.1%) | the same |
| load to the first screen | 15.6-16.4 s on a visitor's page, 16.0-17.7 s with `?harness=1` (four loads); 11-18 s across the five sizes | `node tools/audit/perf-probe.js --loads 2`; `a11y-probe.js` |
| JS heap after load | 104-125 MB | `perf-probe.js` |
| draw calls, one whole frame | landscape at 4x: 752-863; at 1x: 160; the eye level: 130-208; the paper map: 105-155 | `perf-probe.js` (20 harness views) |
| triangles | landscape at 4x: 2.51-2.56 million; at 1x: 0.23 million; the paper map: 0.20-0.24 million | the same |
| the map layer's pass | 0.3-1.7 ms in the harness's 30 views (limit 8 ms); 0.4-1.5 ms in the probe | `check:visual`; `perf-probe.js` |
| `updateVisibility` per frame | 0.9-3.1 ms | `perf-probe.js` |
| GPU objects | geometries 205 → 331 and textures 33 → 47 as views add their layers in one page; +6 textures at every Visual effects off-on (SW-7) | `perf-probe.js`; `state-probe.js` |

**P-1 · minor · The figures are about 91% of a landscape frame's triangles.** FACT (measured): the low Pratzen view draws 2,515,917 triangles at
4x and 227,649 at 1x, where formations are footprints, so about 2.29 million are figures and standards. On a GPU this is likely fine on a
desktop and uncertain on an integrated laptop GPU or a phone (INFERENCE; question 139). It is the lever for the open "figure level of detail"
item (question 138).

**P-2 · minor · About a quarter of the file is never run by a visitor.** FACT: the self-test (12.8%) and comments (10.1%); the textures are
37.8%, the normal maps alone 20.9%. Nothing is minified. Served compressed this matters less (INFERENCE: base64 JPEG compresses poorly, the
scripts well); opened from disk it is read whole. Question 140.

**P-3 · polish · Idle work per animation frame.** FACT: `loop()` runs `syncFollow`'s `querySelectorAll`, `openingWatch` and `paintDevStats`
on every frame while it runs (`app.js:6726-6750`); the render itself is on demand. Small, and not measured on a GPU.

**P-4 · polish · The start-up cost of the relief grid** (2E, +0.45 s) and the per-point land-cover classification (2F) are recorded in the
records and were not re-measured here.

### 2.9 Polish and the records

**R-1 · minor · Two READMEs describe the checks wrongly.** FACT. `README.md:13-20`: `check:data` compares "to the Stage 0 reference" (it
compares to `archive/stage6b-7fc0f6c3.html`), `check:visual` runs "11 fixed views" (30), `check:baseline` checks "the verified Stage 0 file"
(the 7D build); `check:contrast`, `check:chronology` and `check:report` are missing; the list of sources to edit leaves out `tokens.js`,
`appearance.js` and `assets.js`. `tools/visual/README.md:22-46` lists the 11 Stage 0 cases, measures that are gone (`labels.pairs` by
sprite, `mist.maxAlphaAtCrossing`; the mist sheets went in 4C), omits `contrast.js`, `compare-gallery.js` and `thresholds.js`, and says "a
case about 25 s" (the full run takes about 100 minutes). *Fix:* rewrite both from `package.json` and `CLAUDE.md`.

**R-2 · minor · Status lines that no longer hold.** FACT. `CHANGELOG.md` still heads merged parts "for review" (7D `:5`, 7C `:105`, 7B
`:230`, Stage 7 Part A `:329`) or "awaits the owner's review" (2B `:3223`, the chronology task `:3377`, 2A §M `:3505`, 2A `:3552`).
`docs/STAGE6_SPEC.md:4` says "6D … written, for review" (merged, #42). `docs/VISUAL_SPEC.md:3-5` says Part B "has not started". `CLAUDE.md:315`
says Stage 7 Part A "is written (#43, for review)" and that the next owner decision is 111; `docs/STAGE7_SPEC.md:7` too. `docs/HANDOFF.md`
says "The next work is Stage 1"; `docs/VISUAL_AUDIT.md:3-7` says "Everything else below stands as the plan" and marks only Stage 0 done.
`docs/STAGE2_SPEC.md:13` says `check:baseline` "now checks exactly that build" (2A's). `CLAUDE.md:239`'s "eight on Stage 0" plus two makes
ten, not nine (seven passed on Stage 0, `CHANGELOG.md:3816`). `CLAUDE.md`'s layout table gives `symbols.js` "event and objective glyphs";
they are in `app.js` (`:3034-3080`). The 6B record's 309 quotes are 311 by the same script today (H-17). *Fix:* one records-only commit.

**R-3 · minor · One thing, several names, on screen.** FACT. The ten themes are "moments" in the Analysis heading and hint
(`shell.html:53`, `app.js:3260`) and "chapter" in the "?" overlay's Esc row and the spine mark's tooltip (`app.js:5047`, `:5761`); the code
and the specifications call them themes and keep "moment" for a phase or event (`analysis.js:7-10`). "Dispatch" survives in the "?" overlay
and the legend's title (`app.js:5057`, `:4333`) beside "Now" and "The phase text" (`shell.html:40`). The sources sheet says "the Command view"
(`app.js:6422`), renamed "Whose eyes?" in 5E. The sources sheet has three names ("Accuracy, sources and confidence grades",
`shell.html:81`; "Accuracy and sources", its accessible name, `:292`; "On accuracy and uncertainty", its heading, `data.js:757`). "Eyes:
Napoleon" beside "Eyes: Allied HQ" (`app.js:3317`) against "Napoleon's headquarters" / "the Allied headquarters" elsewhere. *Fix:* `LABELS`
and the strings named.

**R-4 · minor · Records of the keys out of date.** FACT. The "?" overlay's opening row says any other key ends the opening (`app.js:5033`);
since 7D Space off a button and Play/Pause pause a played stretch instead (`app.js:5317-5324`). The legend's control hint is written by hand
(`app.js:4315-4316`, `shell.html:229`), not from `KEYS`, and says "scroll" and "right-drag or Shift-drag to turn" where `KEYS` says "Wheel"
and "also Shift or Ctrl and drag". `shell.html:319` still carries "Guided tour" as the card's primary button (replaced at load from `LABELS`,
"Begin (two min)", `app.js:4993`; what shows if the bundle fails, SW-1). *Fix:* from `KEYS` and `LABELS`.

**R-5 · minor · "Last recorded at After dark".** FACT. The dossier's "What became of it" writes "Last recorded at " and the phase's clock
string (`app.js:6111`): for the 30 formations whose last record is in phase 9 it reads "Last recorded at After dark"; elsewhere "at 14:30 -
17:00". *Fix:* presentation.

**R-6 · polish · Formats.** FACT. Ranges written three ways ("04:00 - 07:00", `PHASES[].clock`; "08:00 to 09:00", `app.js:2940`; "45–70");
the factor's sign moves ("×4" at `app.js:1871`, `:1875`, `:3419`, `:6192`; "4×" on the buttons; one legend line has both); native tooltips
with a double space between clock and title (`app.js:5625`, `:5652`); the tour's counter "1 OF 9" in capitals and outside `LABELS`
(`app.js:3652`) beside the opening's "Opening, step 1 of 4"; em dashes in a few visitor strings among colons elsewhere; numbers formatted by
the visitor's locale (`toLocaleString()`, nine sites: on a German browser the plateau reads "Allied ≈ 38.700" in an English sentence);
the tour's own words mix "seven o'clock", "a quarter to nine" and "Forty thousand" with "07:15" and "40,000" (a data task, decision 115).

**R-7 · polish · Stale comments.** FACT. `analysis.js:2` "the nine things that decided Austerlitz" (ten themes); `analysis.js:341` "about
twelve minutes" (the nine texts read in 2 min 17 s; `docs/STAGE7_SPEC.md` §0.4 item 4); the `LABELS` comment's "about 50 s: 100 to 121 s"
(`app.js:4989-4991`; 7D measured 44.8 s of stretches and 95.2-115.8 s in all); `world.js:4` "relief exaggeration is GEOREF.EXAG" (the drawn
relief is `DISPLAY.factor` since 2B); `css-test.js:140` names `formationAtlas` (removed in 6C); the mist measure and its threshold survive
the mist sheets (`measure.js:362-398`, `thresholds.js:143`); `cases.js:1` "Stage 0 baseline cases" and a "Staff (paper) map" note;
`contrast.js:3-23`'s header (2D added four states, not six; "Watch draws the view-mode control at 24%" is false since 3C; no 7C or 7D state
listed); the CI comment's "about ten minutes" (`checks.yml:4`). VISUAL_SPEC.md:41 still records the figures as "55-70" times life size (the
sources sheet says 45-70).

### 2.10 Things that should not change (`docs/VISUAL_AUDIT.md:137-144`)

All still hold (FACT): GEOREF the only scale authority (§2.3); the leaf rule (`app.js:612-639`); the claim, grade and layer taxonomy and
"derived" labelling, but for the gaps H-3, H-5 and D-6; the dossier's progressive disclosure (`app.js:5892-5934`); the narrative voice (data
changes since were owner-decided only, decisions 76 and 108); formation modelling (columns, line, skirmishers, limbering, the standards'
dip); continuous clock-driven positions and the march-rate audit (with D-1's caveat on what the chronology check reads); the Command view
(promoted to "Whose eyes?"), Plans, plateau and centre-separation readings; the restrained dark UI with serif prose; reduced-motion support
(with S-6), ARIA states and the keyboard time slider; the single-file, framework-free build on three.js r128 (with SW-1: single-file but
not offline); bare winter trees, frost on north-facing slopes, crop strips.

## 3. Against docs/VISUAL_AUDIT.md

Each problem and opportunity the original audit listed, against the code today (FACT unless marked). "CL" is `CHANGELOG.md`'s line.

| item (`docs/VISUAL_AUDIT.md`) | status | evidence | what remains |
|---|---|---|---|
| P1 rendering faults (`:27-31`) | **resolved** | the grade's black slopes, figure seating, the camera floor, smoke edges and mist sheets: fixed in Stage 0 and held by `thresholds.js:141-145` in every view; the mist sheets gone (4C); default relief 4x (`world.js:385`); `check:visual`'s 30 views pass | none |
| P2 colour (`:33-41`) | **resolved** | `tokens.js`: side hues for symbology, status by icon, claim and layer by shape (`tokens.js:92-104`), the accent ivory off the amber axis; one key table (`COLOUR_KEY`, `app.js:5410`) writes the legend and the card (decision 108); `check:contrast` 0 below AA | tour stop 1's colour words are typed by hand (`analysis.js:351`); they match today |
| P3 the first screen (`:43-47`) | **resolved** | a modal card with one primary action and one way to stay (7B); the Now tab under it (decision 113); the opening of four tour stops with played stretches (7C, 7D) | §2.7's findings on the first screen; no "seen it" (decision 117) |
| P4 labels and counters (`:49-54`) | **resolved** | one DOM/SVG map layer (2D, `#maplayer`), compact counters, priority placement with leaders and drops held per view (`thresholds.js:14-50`); hover and keyboard access to formations | the drops themselves (by design, within limits) |
| P5 the ground (`:56-63`) | **partly** | relief 1x / 4x / 10.33x as a presentation factor (2B); land cover per point in the shader (2F); roads and streams draped (2F) | the meres are still ellipses (`world.js:1193-1204`), schematic until a georeferenced survey (decision 27) |
| P6 five structures, "Map" four things (`:65-70`) | **resolved** | one timeline about 90 px (3C), the spine (`buildSpine`), themes and tour on the day's moments (the spine data task), names from `LABELS` (3E) | R-3's naming residue ("moments", "chapter", "dispatch") |
| P7 orbit only (`:72-76`) | **resolved** | pan, orbit, zoom to the cursor, double-click focus, keys and touch, the view offset, Follow (3D) | touch tested only with synthetic events |
| P8 the staff map (`:78-82`) | **resolved** | a true north-up plan (2E, `MAPCAM`), its own hillshade, flat footprints, roofs and chimneys hidden (`app.js:1800`) | none |
| P9 uncertainty invisible (`:84-86`) | **resolved** | spatial confidence on the ground at every factor and on the paper map, on by default (5B) | none |
| O1 the evidence layer (`:90-94`) | **resolved** | confidence (5B), interval bars (5C), the skeleton (5D), "Whose eyes?" with the eye level (5E), the ordered routes (5F), the day-track (5G) | the skeleton and routes are off by default (decisions 90, 93); S-1, S-4; H-3 |
| O2 light and weather (`:96-102`) | **partly** | the computed sun and continuous light (4B), the valley fog and haze (4C), smoke tied to the naming events, the meres' ice, the horizon (4E) | no soft particles (no depth pre-pass, by recommendation); no ice marks where formations cross (`CHANGELOG.md:1352`) |
| O3 historical appearance (`:104-110`) | **resolved, values open** | `appearance.js` with sources, grades and quotes (6B); figures by class (6C); standards from the table (6D); the 1804 lozenge and the bicorne where sourced | the open questions kept (`data.js:764`); the generic values (`docs/STAGE7_SPEC.md:900-902`); H-17 |
| O4 pacing (`:112-114`) | **resolved** | Play at ½× (decision 74), the dwell, Follow while playing, the draw-on (4D); no losses animated; the drowning myth not suggested | S-2, S-7 |
| O5 arrows from the tracks (`:116-118`) | **resolved** | arrows derived from the executed legs or marked interpretive; `binding-test.js` (383 checks) | two "unsettled" arrows await the sources (H-1) |
| M legend contextual | **resolved** | `paintLegend` (`app.js:4288-4318`) | — |
| M the Now tab | **resolved** | `shell.html:28-50`; decision 113 on the first screen | — |
| M picking within 34 px | **resolved** | picking by footprint (`pickFormation`, `app.js:4366`), hover and cursor | 34 px kept as a fallback for corps counters, glyphs and places |
| M "?" overlay | **resolved** | `KEYS` and the overlay (3E) | R-4; SW-6 |
| M figure level of detail | **open** | figures are drawn wherever the ground is not the paper map and the relief not 1x (`app.js:4616`); no swap to blocks by distance; no record or decision | the whole item; the figures are about 91% of a landscape view's triangles (§2.8); question 138 |
| M one scale convention | **resolved** | stated in the legend (`app.js:1876-1877`) and the sources sheet ("figures and standards about 45–70 times life size, buildings and trees about 10–15 times") | `docs/VISUAL_SPEC.md:41` still says 55-70 |
| M faint text | **resolved** | `--text-muted` #9BA3A9 (`tokens.js:21`); `check:contrast` 5,990 elements, 0 below AA | — |
| M shared tokens | **resolved** | `tokens.js` with `build.py`'s drift check | the developer readout and shadows still literal (`style.css:684-685`, `:516`); T-6's palette gap |
| L previous/next event glyphs; native tooltips | **open** | the glyphs are still ◄│ and │► (`shell.html:242`, `:246`), the reverse of the media convention (⏮ ⏭); native `title` tooltips on the event markers, phases and acts (`app.js:5652`, `:5625`, `:5679`) | both halves |
| L scale bar in perspective | **partly** | exact on the paper map (2E) | on the landscape, G-1 |
| L compass rose and serif | **partly** | the rose's 60% opacity is gone (`style.css:124-127`) | the serif stack is the OS's (`tokens.js:45`: Iowan Old Style, Palatino, Georgia…); the rose's "N" is typed in Georgia (`shell.html:185`); no embedded font |
| L chimneys in paper mode | **resolved** | hidden on the paper map (`app.js:1800`), checked in the self-test | — |
| Stage 7 (the roadmap's last line) | **resolved** | 7B, 7C, 7D merged (#45-#47) | the records' list "What the records still leave open after Stage 7" (`docs/STAGE7_SPEC.md:887-918`) stands; this audit adds to it |

## 4. What the checks say

Every check `CLAUDE.md` names was run on this build, in a fresh container (4 cores, headless Chromium 1194 with SwiftShader; three.js r128
served from `node_modules`, as the harness does offline). Outputs are in `docs/audit-evidence/`.

| check | result | time | output |
|---|---|---|---|
| `npm run check:baseline` (start) | passes: md5 `46773462faa1e1b9f4a4010e450e110a`, 1,764,002 bytes | | |
| `npm run build` | the committed `austerlitz-command-map.html` equals the fresh build (no diff) | | |
| `npm test` | "ALL 9 SUITES PASSED (and the height guard)"; `test.js` 588/588 appearance checks, 41/41 order of battle; `geo-test` 54 passed; `binding-test` 383 checks, 0 failed; `redteam.js` 0 findings, 1 warning (the standing cavalry-rate warning); `runtime-test.js` 0 errors, "console.warn unique: 1" (its stub's false positive, T-1) | 5 min 2 s | `npm-test.txt`, `suite-*.txt` |
| `npm run check:data` | all 121 guarded declarations byte-identical to `archive/stage6b-7fc0f6c3.html` (25 historical, 43 geographic, 35 model, 1 appearance, 17 derived) | | `check-data.txt` |
| `npm run check:chronology` | errors 0: 69 moves with a timed statement, 65 consistent, 4 early (the named conflicts `dok@1`, `guard_cav@6`, `kamensky@3`, `kamensky@4`); derived arrivals at the ceiling flagged by name (`sthilaire@3`, `vandamme@3`, `bag@8`) | | `check-chronology.txt` |
| `npm run check:contrast` | 5,990 text elements, 105 text/background pairs, 0 below AA, 0 below 10.5 px | 6 min 58 s | `check-contrast.txt` |
| `npm run check:visual` | **1 failure**: "narrow-390: unobstructed map 46.0%, below the baseline 46.8%" (T-0: this machine's fonts; reproduced alone at 46.03%; with DejaVu Sans 46.89%). The other 29 views meet every threshold, drop limit and baseline; the self-test 212 of 212; the real-key checks (the slider, the first-run card, the opening on `opening-2`, Space and Enter, Ctrl+C, "?") pass; nine console warnings, all Chromium's Canvas2D readback warning | 72 min 22 s | `check-visual.txt`, `check-visual-report.json`, `check-visual-cases.txt`, `harness-sheet.jpg` |
| `node tools/stage6/verify-quotes.js` (not in the suite; network) | 311 quotes: 107 found whole, 32 with OCR differences, 41 on page images, 56 not found, 75 with no text layer reachable | 3 min 38 s | `quote-check.md` |
| `npm run check:baseline` (end) | passes: md5 `46773462faa1e1b9f4a4010e450e110a`, 1,764,002 bytes (after the last change to the audit's files) | | `check-baseline.txt` |

`check:visual` ran beside the five read-only code reviewers (a load of about 4 on 4 cores) and took 72 minutes, against 101 in the 7D session;
none of its timing thresholds failed. No page probe ran beside it.

## 5. What was not verified, and why

- **A screen reader.** No NVDA, JAWS or VoiceOver here. Names, roles, live regions and focus are read from the DOM and by real key presses in
  Chromium; what a screen reader announces, and in what order, is not known.
- **A GPU.** Every frame cost is software WebGL (SwiftShader). No visitor's frame rate, no integrated-GPU or phone measurement (question 139).
- **Other browsers and systems.** Chromium only; no Firefox, no Safari (WebKit), no Windows or macOS fonts. T-0 shows the fonts change what
  is measured.
- **Touch** on a real device (the harness's touch is synthetic), and Windows' forced-colours (high contrast) mode.
- **The historical claims against the sources.** No library was read for this audit. Where a finding says INFERENCE (H-2, H-9, H-13, H-18,
  G-3) the named source would settle it. The appearance quotes were re-checked by `verify-quotes.js` only (H-17).
- **The reviewers' simulations not re-run here.** The counts S-1's 293 samples, S-4's 477 readings, S-5's 10 cases and H-5's 825 of 2,605 come
  from node simulations by the read-only reviewers (their scripts were in a scratch directory, not committed); each finding's code path was
  re-checked, and S-1, S-2 and S-3 were reproduced in the page.
- **Played stretches in real time.** As in 7D, under software WebGL a stretch takes minutes of real time; the state probe drives the app's
  own `tickClock` in 100 ms steps.
- **A visitor's network.** The CDN's availability and a cold load over a real connection (SW-1 only measures the failure).

## 6. Questions for the owner (from 125)

Each with a recommendation and its trade-off. Nothing is built until they are answered.

### 6.0 Owner decisions 125-141 (the answers)

After #48 was merged the owner wrote: "Merged. Let's start with 1. And we will go with your recommendations on all questions." Each question below
is therefore decided as recommended; the trade-offs stay in the questions as written.

| # | question | decision | where |
|---|---|---|---|
| 125 | the three disputed hours (H-1) | (a) now: the Kamensky and column events graded "disputed" with both hours, the three phase lines marked, the arrows' "unsettled" note shown where the arrow is read, the map's timing kept (decision 42); then (b): settle them from the sources | roadmap step 2 (data task and presentation), then step 4 |
| 126 | the plateau label (H-3; decision 119 (b)) | the label marked "derived" in every view (text and accessible name), shown in phases 0-6 only, as the tagged reading | step 2 (presentation) |
| 127 | the first claim (H-4) | (b): labelled ("…the Pratzen plateau, which this map reads as deciding the battle"); the Pratzen vantage retitled "The Pratzen plateau" | step 2 (presentation; decision 108's wording changes) |
| 128 | the claim pill (H-5) | (a) now: reworded as the position's ("Position: documented / estimated / reconstructed"); (b) per-statement claims within the sourcing stage | step 2, then step 4 |
| 129 | one data task for the screen's contradictions | yes: H-2, H-7, H-11, H-12, H-13, H-14, D-3, D-4 in that order, each change cited and recorded, after the suite is hardened | step 2 |
| 130 | a sourcing stage (H-6) | yes, the next stage after the integrity fixes, with a Part A inventory and a register of readings | step 4 |
| 131 | harden the suite first | yes, before any data task: T-1, T-2, D-1, D-2, H-8, T-4, T-5 (with T-3, T-6) | step 1 |
| 132 | CI | add `check:contrast` and a one-page self-test run to `.github/workflows/checks.yml`; the full `check:visual` stays on demand | step 1 |
| 133 | start-up (SW-1) | (a): three.js stays on cdnjs with `integrity` and `crossorigin`, and a plain failure message | step 3 |
| 134 | single-key shortcuts (A-1) | (a): a "single-key shortcuts" switch in the "?" overlay, on by default, for the session (no storage) | step 3 |
| 135 | vines (H-10) | the vineyard cover labelled "presumed" in the legend and the going key (`VINEYARD` unchanged) | step 2 (presentation) |
| 136 | the appearance quotes read once (H-17) | a human second reading of the A-graded quotes among the 131, recorded in `docs/stage6-evidence/` | step 4 |
| 137 | phones | a phone layout after the accessibility work, as its own stage | after step 3 |
| 138 | figure level of detail | decided after question 139's measurement: built if an ordinary integrated GPU drops frames, else the item retired | after 139 |
| 139 | measure on real hardware | one measured pass on two ordinary machines (an integrated-GPU laptop and a phone) before any performance work | when the owner's machines are available |
| 140 | the self-test in the product | kept in the file (the harness tests the file that ships) | (no change) |
| 141 | the fonts (T-0) | (a): one open sans and one open serif embedded (WOFF2, base64) and named first in the tokens; each harness case's drops and baselines re-measured once (decision 62's method), every change recorded | step 1, first |

125. **The three disputed hours (H-1).** (a) Mark them disputed on screen now: the Kamensky and column events graded "disputed" with both
     hours, the three phase lines marked, the arrows' "unsettled" note shown where the arrow is read; the map keeps its timing (decision 42);
     (b) settle them from the sources first (Duffy 1977, Thiébault, Weyrother's disposition); (c) leave them. *Recommendation:* **(a) now, then
     (b)** as the first item of the sourcing stage. *Trade-off:* (a) is a data task (guarded `EVENTS`, `PHASES`; `check:data`'s reference
     moves) that puts "disputed" on three of the day's best-known moments, including one the opening's bar names; (b) alone leaves the
     screen claiming "Fact · Timing A" until a library reading is done.
126. **The plateau label (H-3; decision 119 (b)).** *Recommendation:* **mark the label "derived" in every view** (its text and accessible
     name), shown in the same phases as the tagged reading (0-6), not in phase 7. *Trade-off:* the label grows by one word on the map, where
     drops are held per view (some views may drop one more item); the alternative, hiding it, removes the only place the key's "Pratzen
     plateau" is named on the first screen.
127. **The first claim (H-4).** The key's "and it decides the battle" is decision 108's wording. (a) keep it; (b) label it, e.g. "…the
     Pratzen plateau, which this map reads as deciding the battle"; (c) drop the clause. *Recommendation:* **(b)**, and retitle the Pratzen
     vantage ("The Pratzen plateau"). *Trade-off:* (b) is less arresting on the first screen; (a) keeps an unlabelled interpretation as the
     first thing read, against `CLAUDE.md`'s labelling rule.
128. **The dossier's claim pill (H-5).** (a) Reword it as the position's ("Position: documented / estimated / reconstructed") now, a
     presentation change; (b) per-statement claims in the data (a large data task). *Recommendation:* **(a) now; (b) within the sourcing
     stage** (question 130). *Trade-off:* (a) leaves the act text and roles without a claim of their own until (b).
129. **One data task for the screen's contradictions.** H-2 (Drouet ahead of the assault), H-7 (Soult's twenty minutes), H-11 and H-12 (the
     silent contradictions), H-13 (the ice told as fact), H-14 (superlatives and rounded figures), D-3 (the Santon counted twice), D-4 (the
     duplicate key). *Recommendation:* **one data task, in that order, each change cited and recorded** as `CLAUDE.md` requires, after the
     suite is hardened (question 131). *Trade-off:* `check:data`'s reference moves; some fixes (Drouet's timing) need a source reading this
     audit could not do.
130. **A sourcing stage (H-6).** Per-statement sources and claims for the phase lines, events, tour, themes, places, the Command tab and the
     explicit anchor times, starting with what the opening shows. *Recommendation:* **yes, as the next stage after the integrity fixes**,
     with a Part A that inventories the statements and reads the sources (the register `appearance.js` built for dress is the model).
     *Trade-off:* it is the largest piece of work left and needs library access (Duffy 1977, Thiébault, Stutterheim 1806,
     Mikhailovsky-Danilevsky 1846 are registered; several are on archive.org); until it is done the map's narrative rests on "the standard
     accounts" as a whole.
131. **Harden the suite first.** T-1 (page errors and warnings fail), T-2 (the meres' check), D-1 (the chronology reads the live text), D-2
     (every first anchor graded), H-8 (the overclaim scan reads every visitor string), T-4 and T-5 (counts and gates). *Recommendation:*
     **yes, before any data task**: these are the guards a data task leans on once `check:data`'s reference moves. *Trade-off:* the stricter
     scans will fail on today's text (H-8's two hits, H-13) until allow-listed or fixed, and the warnings need a named allow-list.
132. **CI.** *Recommendation:* add `check:contrast` (about 7 minutes) and a one-page self-test run (the self-test without the 30 views) to
     `.github/workflows/checks.yml`; keep the full `check:visual` (about 100 minutes) on demand. *Trade-off:* CI runs longer, and software
     WebGL on a CI runner may time differently (T-7).
133. **Start-up (SW-1).** (a) Keep three.js from cdnjs, add `integrity` and `crossorigin`, and a plain failure message; (b) inline three.js
     r128 in the file (fully offline; about 600 KB more). *Recommendation:* **(a)**: the smallest change; `CLAUDE.md` names cdnjs.
     *Trade-off:* (a) still needs the network; (b) changes an agreed part of the build (`CLAUDE.md`: "three.js r128 from cdnjs").
134. **Single-key shortcuts (A-1; WCAG 2.1.4, level A).** (a) A "single-key shortcuts" switch in the "?" overlay, on by default, for the
     session (no storage, decision 117); (b) letters and digits act only while the map or the timeline has focus. *Recommendation:* **(a)**.
     *Trade-off:* (a) keeps today's behaviour and adds one control; (b) changes every visitor's keys (Space and the arrows stay).
135. **Vines (H-10).** The Telnitz "vineyard bank" text was kept deliberately (`CHANGELOG.md:4254`), but the vineyard cover and its going key
     present the open question as settled. *Recommendation:* **label the vineyard cover "presumed" in the legend and the going key**
     (presentation; `VINEYARD` itself unchanged). *Trade-off:* one more qualifier in the legend.
136. **The appearance quotes read once (H-17).** *Recommendation:* **a human second reading of the A-graded quotes among the 131** (the ones
     that settle a drawn colour), recorded in `docs/stage6-evidence/`. *Trade-off:* reading time; until then the drawn coats rest on one
     reading of a page image.
137. **Phones (decision 122 recorded the 390 px screen, not a layout).** *Recommendation:* **a phone layout after the accessibility work**,
     as its own stage (the timeline 172 px tall, the card over most of the map). *Trade-off:* a second layout to test and hold; until then
     phones get a desktop layout squeezed.
138. **Figure level of detail (`docs/VISUAL_AUDIT.md`, a medium item never taken up).** The figures and standards are about 91% of a
     landscape view's triangles (the low Pratzen view: 2,515,917 at 4x against 227,649 at 1x, where formations are footprints; §2.8).
     *Recommendation:* **decide after question 139's measurement**: build it if an ordinary integrated GPU drops frames in the Overview or
     the low views; else retire the item. *Trade-off:* a level-of-detail swap is new geometry and new self-test checks (the figure-seating
     and standards checks run on what is drawn); without it the far figures stay full geometry.
139. **Measure on real hardware.** No frame cost has ever been measured on a GPU (§5). *Recommendation:* **one measured pass on two ordinary
     machines (an integrated-GPU laptop and a phone) before any performance work**, with the developer readout (`` ` ``). *Trade-off:* it needs
     the owner's machines; software WebGL numbers say nothing about a visitor's frame rate.
140. **The self-test in the product.** The in-app self-test and debug API are 225,445 bytes, 12.8% of the file every visitor downloads (§2.8).
     *Recommendation:* **keep it** (the harness tests the very file that ships, which is a trust property) unless the file's size becomes a
     goal. *Trade-off:* about 225 KB (uncompressed) that no visitor runs.

141. **The fonts (T-0).** `check:visual` fails on the unchanged build here because the machine's fonts differ from the 7D session's. (a)
     Embed one open sans and one open serif (WOFF2, base64) in the file and name them first in the tokens; (b) pin the harness's fonts
     (install and force DejaVu in the harness's page only) and record it; (c) widen `narrow-390`'s baseline. *Recommendation:* **(a)**: the
     page then looks the same on every visitor's machine (the audit's open "serif fallbacks differ by OS") and the harness measures what
     ships. *Trade-off:* (a) adds a few tens of KB and changes every view's text a little, so each case's drops and baselines are re-measured
     once (decision 62's method, recorded); (b) is invisible to visitors but leaves them the OS's faces; (c) loosens an assertion, which
     `CLAUDE.md` forbids.

## 7. A roadmap: what is next

Stages 0-7 of `docs/VISUAL_AUDIT.md` are done (§3). What this audit found orders itself by `CLAUDE.md`'s priorities. A proposal, each part
waiting on the questions it names:

1. **Suite hardening** (software and tests only; no data, no build change in behaviour): T-0 first (the fonts, question 141: today
   `check:visual` fails on the unchanged build on a fresh machine), then T-1, T-2, D-1, D-2, H-8, T-3, T-4, T-5, T-6, and CI (questions 131,
   132). It comes first because every later data task moves `check:data`'s reference and leans on these guards.
2. **Integrity on screen** (a data task and a presentation part, decided together): the disputed hours marked (125), the plateau label
   tagged (126), the first claim labelled (127), the claim pill reworded (128), the contradictions fixed (129), the vines labelled (135), H-9,
   H-15, H-16, D-5, D-6. Each data change cited and recorded with what was, what is and why.
3. **Accessibility and robustness** (presentation and software): the shortcuts switch (134), SW-3 and SW-4 (panels and the sources sheet
   as proper dialogs and inert when hidden), SW-5, SW-6, S-6 (reduced motion live and in CSS), §2.7's target sizes and focus findings; the
   start-up failure message (133); S-1 (corps counters under "Whose eyes?"), S-2 (the dwell toggle), S-3, SW-2, SW-7 to SW-12. Then one
   session with a screen reader (NVDA or VoiceOver) to verify what this audit could only read from the DOM.
4. **The sourcing stage** (130): Part A an inventory of every narrative statement and a register of readings, as Stage 6 did for dress;
   then the per-statement claims; the chronology's evidence from the sources instead of the app's own text; the human second reading of
   the appearance quotes (136); the 6B data questions; the meres' outline if a georeferenced survey is found (decision 27).
5. **Records and polish**: R-1 to R-7 (one records-only commit can take R-1, R-2 and R-7 at any time), the VISUAL_AUDIT leftovers (the
   event glyphs and native tooltips, the scale bar's note, the serif), the dead code (SW-13).
6. **Later, each its own decision**: a phone layout (137), measurement on real hardware (139), figure level of detail (138).

