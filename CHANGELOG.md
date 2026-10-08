# Austerlitz Command Map — Changelog

## 2026-10 · Roadmap step 2: integrity on screen (decisions 125 (a), 126, 127 (b), 128 (a), 129, 135; owner decisions 142-161)

**Status: for review (#50). The build changed: `austerlitz-command-map.html` 1,927,272 bytes, md5 `f7e1c622fd5d9846a7a12dbab904b467`
(was the step-1 build, 1,883,794 bytes, md5 `7a86548c5e394853571f28f9e1640a74`).** `check:baseline` moves to this build. `check:data`'s
reference moves to it too, archived as `archive/step2-f7e1c622.html`: step 2 is a data task, and every guarded declaration it changed is
listed below with was, is and why (12 changed against the 6B reference: `CLAIM`, `PHASES`, `FORMATIONS`, `FEATURES`, `SOURCE_NOTE`,
`ANALYSIS`, `COMMAND`, `PLANS`, `EVENTS`, `TOUR`, `COMPOSITION`; `TERRAIN_LINES`; against the new reference all 128 identical). The
next owner decision is 162. The plan is the step's implementation plan (six cluster designs and twelve reviews combined, with a
completeness critic; not committed); the commits, in order: C1 `8e53d90` (review
fixes `8e8ff0c`), C2 `fe32f9c` (`712ee03`), C3 `cd74a81` (`a5139c6`), C4 `db78d7e`, C5 `6fb3a81`, C6 `9df7b11`, C7 `46c1c92`, C8
`0698201`, C9 `dce7211` (`edfe878`), C10 `f2285da` (`b2a5529`), C11 `fc63ab7`, C12 `1c8dfab`, C13 `7663788`, C14 `78745d4`, C14a
`8feaa14` (the owner's answers), C15 `0d2e9a2`, C16 `76851e6`, C17 `6f88053`, C18 `c09a407`, C19 `21d6c52`, C20 `2a7b812`, C21 `2b775c1`,
C22 `57f5f89`, C23 `e439a04`, the review fixes of C14a-C18 `4fb58c9`, C24 `94662a0`, C25 `16e4f43`, C26 `a8aa34a`, the review fixes of
C19-C23 `574f372`, C27 `83a7e45`, the review fixes of C24-C26 `25cc972`, and C28 (the records and references, this entry). The commits
were reviewed in segments; each review's issues are fixed in its "review fixes" commit or recorded here, and the commits' own notes give
each run.

**Owner decisions (142-161).** The plan put twenty questions to the owner (142-159 from the plan, 160 and 161 from its completeness critic,
items 8 and 10), each default implemented meanwhile in a commit that could be reverted on its own. On 8 October 2026 the owner wrote:
"Lets go with your recommendations for all." Each is decided as recommended; `docs/ROADMAP.md` (step 2) records them as a table (number,
question, decision, where). Where the recommendation differed from the default already committed, C14a applied it: 153 (Ryazhsk settled),
155 (the division numbers marked), 157 (I Corps' two readings marked), 158 (Blasowitz's attackers marked), and 145 (the arrows' shorter
mark); 146 landed with C27.

**Data changed (guarded declarations: was, is, why), by finding.** Basis letters as in the plan: S a source read and registered
(`docs/step2-evidence/readings.md`, by section), R a repository record, M a marking that asserts less.
- **125 (a), H-1: the three disputed hours (C3, C5, C6).**
  - `CLAIM`: was fact, est, recon; is + `disputed` ("Disputed"; note: "The event is attested, but this reconstruction's own texts give
    different hours for it, or for part of it: both are shown, and the map keeps its earlier timing until they are checked against the
    published accounts."). Why: 125 (a); its basis `SOURCE_NOTE` body[5]. The label is a marking class, its wording a design decision.
  - `EVENTS` columns-move and kamensky: was claim fact, Timing A; is claim disputed, `cf` B, and a `dispute` naming both hours and who
    gives each ("from 04:00 in this event and on the map, but at about 07:30 in the Telnitz phase's text"; "at about 09:45 in this event
    and in the Pratzeberg phase's text, but in the 08:45 phase in his brigade's record on this map, whose timing the map keeps"), each
    ending "This reconstruction has not yet settled it from the published accounts." `t` unchanged (decision 42; question 142). B because
    Timing A is "dated in a cited source", which neither hour is (question 143).
  - `EVENTS` kamensky.why: was "The one piece of Allied initiative on the plateau, taken by a brigade commander on his own judgement."; is
    "Allied initiative on the plateau, but whose is disputed: Mikhailovsky-Danilevsky, citing Langeron's report, has Kamensky see the French
    climbing, warn Langeron and turn his brigade against them; Kutuzov's official report has Kutuzov re-form two regiments he found cut off
    on the height and order Kamensky to occupy the ridge." face-about.why: was "... is the first to see what has happened."; is "... sees
    what has happened." Why: each exclusivity took the event's side of the disputed hour, and the app's own kursk event has Langeron send
    troops up toward Kamensky (the critic's item 2); who turned the brigade is disputed (S: register §3.4, §5.6, §6.5, §13 F13).
  - `PHASES`: the c. 07:30, c. 09:45 and c. 11:45 lines each carry the other side ("The hour is disputed: the event of the columns leaving
    the plateau, and the map, have the descent from 04:00."; "The hour of the turn is disputed: his brigade's record on this map puts it in
    the 08:45 phase."; "The hour is disputed: the event of Rapp's counter-charge has it from 11:15.").
  - `FORMATIONS` dok@1, kamensky@3, guard_cav@6 acts: each names the other hour (question 144). The phase-4 lede and tour stop 4 are
    unchanged: tour stop 4 dates the arrival in the villages, matching the telnitz event at 07:00, so it takes neither side (the critic's
    item 4; the reason beside its cite in `chronology.js`).
- **H-2: Drouet's departure (C7).** `FORMATIONS` drouet@3: was undated, creeping from 04:00 to stand 0.5 km ahead of Vandamme at 08:45;
  is held at its dawn position, departing at 08:45 (`tm.dep` 525, grade C, "app narrative, unsourced"), arriving 09:26 (derived, tactical
  rate), with a note: Stutterheim (pp. 55-56: I Corps crosses at Girzikowitz with Soult's attack, toward the heights by Blasowitz; the
  route drawn, toward Stare Vinohrady, is this reconstruction's), Mikhailovsky-Danilevsky's crossing the evening before (1846, p. 229)
  and the 30th Bulletin (p. 451) kept; "the accounts are not reconciled here". S: register §2.3, §5.3, §1.5.
- **H-7: Soult's "twenty minutes", one grade (C8).** `PHASES[2]`'s c. 08:30 line, `EVENTS` decision.why, `COMMAND.fr[2]` (two rows),
  `FEATURES` zuran.story, `FORMATIONS` gqg@3's act, `SOURCE_NOTE.refs` (+1): was graded three ways (plain fact in the Now tab, DOCUMENTED
  in the Command tab, "a memoir anecdote" in the event, "is said" at the Zuran), with a motive ("to let more of the enemy get down into the
  valley") and a "deliberate fifteen-minute pause" no record gives; is the event's one grade (est, B), attributed to Thiebault with his
  words ("twenty minutes at most"; the signal once an aide reported the heights abandoned, "a little prematurely", Thiebault adds), the
  c. 08:30 hour the map's (Thiebault sets the exchange at daybreak). S: Thiebault t. III pp. 456-458 (§4.2).
- **H-11: data.js against appearance.js (C9, its review fixes, C14a).**
  - `FORMATIONS.lich.staff`: was "... the Russian brigades of Gladkov and Uvarov (Duffy 1977; Smith 1998)"; is Shepelev's under Essen and
    Penitsky's under Uvarov (Schönhals 1873, p. 178), Uvarov's three regiments sent to Bagration's left the evening before in
    Mikhailovsky-Danilevsky (disputed), and "a brigade of Gladkov" cited from Duffy and Smith "not checked against them: no Gladkov appears
    in any source read, so that name is unconfirmed".
  - `FORMATIONS.kamensky.strengthNote`: was "the Ryazan and Fanagoria regiments, about 2,000 each, ..."; is "the Fanagoria Grenadier and
    Ryazhsk Musketeer regiments, as Mikhailovsky-Danilevsky names them (1844, pp. 167, 179, 187-189, 198, 205, p. 187 citing Langeron's
    report to Kutuzov; its French translation of 1846 the same), who places the Ryazan regiment in Tolstoy's corps sent to Swedish
    Pomerania (1844, p. 257). The other reading, kept: Ryazan in the Materialien of 1806 (...) and as cited here from Duffy." with the
    brigade's make-up disputed (Mikhailovsky-Danilevsky forms it of the two regiments; Stutterheim and Thiébault have them reinforce it).
    Question 153 (yes, after a second reading of the 1844 page images, register §6.8). `mikhailovsky1844` was already registered in
    `APPEARANCE_SOURCES` (6B); `COMPOSITION.kamensky`'s note now cites it ("the Russian original puts the Ryazan regiment in Tolstoy's
    corps", the review of C14a-C18).
  - `FORMATIONS.kamensky.role`: was "The one piece of Allied initiative on the plateau. Turned about on its own commander's judgement."; is
    "Allied initiative on the plateau, but whose is disputed: turned about on its own commander's judgement in Mikhailovsky-Danilevsky,
    citing Langeron's report; ordered onto the ridge by Kutuzov in Kutuzov's official report." (F13; as `EVENTS` kamensky.why).
  - `FORMATIONS.col4` mixedNote and strengthNote, `milo.strengthNote`: Miloradovich's Russian battalions twelve (Stutterheim 1806;
    Schönhals 1873, 6,965 men including two pioneer companies and two squadrons of Austrian dragoons) against fourteen (WarHistory); the
    range [4800,7000] unchanged.
  - `FORMATIONS` rivaud and drouet desig: was "1re Div., I Corps" / "2e Div., I Corps"; is "1re or 2e" / "2e or 1re", each with a note
    naming the returns of 26 October (p. 762) and 28 October (pp. 716-717), "neither of 2 December" (S: §7.2, §7.5).
  - `FORMATIONS.santon.strengthNote`: + Stutterheim's 27th, which the Materialien keep in their translation but give as the 17th light
    infantry in an editor's note (Zusatz 6, pp. 100-101), listed in Suchet's division on 28 October (Alombert and Colin p. 732). The
    Santon's desig and `FEATURES` facts stay "17e" unmarked: the order of 1 December (no. 9534, p. 441) and the 30th Bulletin (p. 449) name
    the 17e légère for the Santon (the critic's item 11, reason restated in C9's review fixes).
  - `FORMATIONS.suchet.desig`: was "2e Div., V Corps"; C14a "2e or 3e Div., V Corps" with a note; the review of C14a-C18 "3e or 2e Div., V
    Corps", the sourced reading first: both returns read give the 3rd (pp. 732, 756), and the 2nd on 26 October is Gazan's (p. 755, read
    in the review of C24-C26); "or 2e" is the map's former reading, kept without a source (question 155: no date claimed for 2 December).
    `caffarelli` desig "1re Div., III Corps, with V Corps" with a note (28 October, pp. 723-724; p. 69, Caffarelli in the wounded Bisson's
    place, §7.6); `c_gren.strengthNote`: "No artillery is listed for the division in the orders of battle of 2 December checked; the
    situation of V Corps of 26 October 1805 lists horse and foot artillery with the grenadier division (Alombert and Colin, t. IV, p. 755)".
  - `FORMATIONS.c_i`: a new note with both readings, the map's general reserve and the centre in the 30th Bulletin (p. 449), Stutterheim
    (p. 41), Mikhailovsky-Danilevsky (pp. 238-239) and Marbot (t. I p. 260); Thiebault counts the 2nd division of I Corps among the troops
    that took no part (pp. 466, 504). Question 157; role and plan column step 4.
  - `FEATURES.blasowitz.facts` "Contested by": was "Lannes' corps against Bagration and Liechtenstein"; is the Russian Guard the
    defenders in all three accounts read, the attackers disputed (Lannes's V Corps, Thiebault p. 462; Bernadotte's I Corps, Stutterheim
    p. 68; both, Mikhailovsky-Danilevsky p. 255), Liechtenstein's arrival disputed (Stutterheim p. 56; Mikhailovsky-Danilevsky p. 257).
    Question 158; the event's forms step 4.
  - `COMPOSITION` rivaud, drouet, kamensky, milo, lich notes: no longer "a data question, not changed here"; each names its return or
    source and page. No grade, value, share or quote changed (appearance 588/588).
- **H-12: the other silent contradictions (C10, its review fixes).**
  - `FEATURES.blasowitz.facts` Fell: was "About 11:00"; is "About 11:00-11:15; the hour is not established".
  - `FORMATIONS.constantine.role`: was "... at around 11:00."; is "... after 11:00; the hour is not established."
  - `FORMATIONS.lang.role`: was "Langeron was the only Allied commander on the left to react to the loss of the plateau."; is "Warned by
    Kamensky in Mikhailovsky-Danilevsky's account (citing Langeron's report), Langeron rode back and sent reinforcements up the slope
    toward him; which regiment, and what it lost, are not established."
  - The Zuran: `PHASES[0]`'s "c. 06:00 / Napoleon takes post on the Zuran mound ..." is "before dawn / Napoleon is on the Zuran mound
    with Berthier; his marshals have been ordered to join him for the morning's orders. The map places him there from 04:00; the hour he
    took post is not established." (the critic's item 8, question 160); `FEATURES.zuran.facts` "from about 06:00" -> "on the morning of the
    battle; the hour they took post is not established"; gqg@0's act without "the corps commanders". S: no. 9535 p. 443, the 30th Bulletin
    p. 450, Mikhailovsky-Danilevsky 1844 p. 177. gqg@0's grade A kept (question 160: step 4).
  - `EVENTS.telnitz.why`: was "The first shot of the battle, ..."; is "The battle opens here, on the Allied left, after a night of outpost
    contact along the Goldbach: ..." (against Legrand's night skirmishing, R).
  - `TERRAIN_LINES` (world.js) Western escarpment: was "Steep enough to hide a division at the foot of it."; is "At true scale the plateau is
    a gentle rise, about 115 m from the Goldbach to the Pratzeberg over some 2.5 km; on the morning of the battle it was the fog in the
    valley at its foot that hid his divisions." (SOURCE_NOTE's words); Goldbach bottom and `FEATURES.goldbach.why[1]` brought into
    agreement (an obstacle to guns and formed cavalry, which cross at the villages).
  - `FORMATIONS.kienmayer.strengthNote` (+ the two halves sum to 6,880, not the 6,800 used, not settled) and `c_iv.strengthNote` (+ the
    three plotted divisions sum to 20,300, derived; the difference not stated): strengths unchanged.
  - The chapel battery (`heightguns` track[8].act, strengthNote, `FEATURES.chapel.facts[0]`): was "A battery of 24 guns of the Guard and IV
    Corps, placed by the chapel"; is three accounts each in its place: 24 guns by the chapel (the Újezd local history), 24 pieces of the
    Guard that broke the ice (Thiebault p. 466, not placed), twenty guns against a corps backed against a lake (the 30th Bulletin pp.
    451-452, not placed); the lead-in "For the guns turned on the Allied left at the meres at the end the accounts differ" (C10's review:
    the Bulletin does not mention ice).
- **H-13: the ice (C11).** `FEATURES.satschan.story`, `EVENTS.ice.why`, `ANALYSIS` collapse: was "some men certainly died", "The most
  famous thing that did not happen at Austerlitz", "propaganda that Tolstoy later made permanent", "The catastrophe was encirclement, not
  drowning"; is the debunking labelled ("This map reads the Bulletin's figure as propaganda and the catastrophe as encirclement rather than
  drowning: an interpretation"), "some men died there", the drained count "as usually given" and, by inference, a lower bound, and Marbot's
  and Thiebault's thousands drowned as the other side (question 150). Tolstoy has "some forty men" (Book Three ch. XVIII), so the
  attribution to him is removed. `SOURCE_NOTE.refs` + the two memoirs. S: §8.3, §4.8, §9.1.
- **H-14: superlatives, counterfactuals, rounded figures (C12).** `FORMATIONS.col4.note`: "— the single most consequential mistake of the
  Allied plan" -> "; Russian accounts put the delay chiefly on Kutuzov's reluctance to leave the heights" (R). `FEATURES.vinohrady.why[1]`,
  `PLANS.fr.cost`, `EVENTS.davout.why`: each counterfactual prefixed "In this map's interpretation, a counterfactual:". `ANALYSIS` plan:
  "roughly 60,000 men" -> "those four columns"; `PLANS.al.assumed[0]`: "about 50,000 by the Allied estimate" removed (question 151; no
  record gives either). `ANALYSIS` weakness and cut, `TOUR[6].x`: "nearly 40,000", "Buxhowden's 40,000", "Buxhowden's forty thousand" ->
  the record's "roughly 33,000 to 40,000", and on tour stop 7 (the opening's step 3) "Buxhowden's columns".
- **D-3: the Santon under Suchet (C13).** `FORMATIONS.c_v.children`, `suchet` (strengthNote, children), `santon.parent`: was the Santon a
  sibling of Suchet, so V Corps' formations summed to 14,300 against its 12,700 and the 1,600 were drawn twice; is the Santon Suchet's
  child, the sums match (6,700 + 6,000), Suchet draws its own battalions only (4 of 5). Strengths and counters unchanged; sim-test's French
  most on the field at once 69,900 -> 68,300 of 73,000.
- **D-4: the duplicate key, the dead field, the light keys (C14).** heightguns track[8]: cf "C" then "B" in one object, the later winning;
  is B only (nothing drawn changes; C's evidence recorded for question 154). heightguns track[7]: a moveMin on a first anchor, never read,
  removed. `PHASES[0..9].light`: unread since 4B, removed.
- **H-4's roles (C15, question 147: record-only).** c_iv "The decisive centre assault." -> "The centre assault."; c_gd "..., then decides
  it." -> "...; then its cavalry charges the Russian Guard and its infantry is committed onto the plateau."; c_cav "decides the cavalry
  battle in the north" -> "fights the cavalry battle in the north".
- **H-19, taken early (C16, question 156).** Six `COMPOSITION` Dress notes no longer name the project's files or ids (sthilaire, legrand,
  friant, caffarelli, suchet, bourcier; wording only).
- **126 and 128 (a) in `SOURCE_NOTE.layers` (C17, C18).** layers[2][1]: "...; always marked derived." -> "...; the holding on the heights
  and the centre-separation test are marked derived wherever they are shown." (backed by the new self-test check, below); layers[0][1]
  "Marked as fact in the dossiers." -> "Marked as fact in an event's dossier."; layers[1][1] "... marked estimate or reconstruction." ->
  "...; a formation's dossier names the grade as its position's: documented, estimated or reconstructed."
- **H-9: the sun of Austerlitz (C22, the review fixes of C19-C23).** `PHASES[3].flash`: "The sun of Austerlitz" -> "The sun of Austerlitz,
  as memoirs call it" (question 149). `SOURCE_NOTE.refs` + "'The sun of Austerlitz' is a phrase the memoirs use: Thiebault puts it in
  quotation marks for the rising sun, which in his telling greets the attack on Telnitz and Sokolnitz and then lights the climb onto the
  Pratzen (vol. III, 1894, p. 461); Marbot has it appear in all its brilliance as the centre climbs toward Pratzen, and calls it the sun
  Napoleon so liked to recall (vol. I, p. 260, the 27th edition); neither gives that climb a clock hour." (§4.4, §8.2).
- **The open questions (C28; the critic's item 7).** `SOURCE_NOTE.body[5]`: the list of open questions gains, without clock times,
  after "Kologrivov's command, which rests on one source;": "when Blasowitz fell; when Napoleon took post on the Zuran; when Bernadotte's
  corps, Drouet's division with it, crossed the Goldbach; how many guns stood by the chapel of St Anthony, and whose; how many men drowned
  in the meres; the numbers of Suchet's and Caffarelli's divisions on the day (the October returns give Suchet's the 3rd of V Corps,
  Gazan's the 2nd, and Caffarelli's the 1st of III Corps); the brigade of Gladkov cited from Duffy and Smith, which no source read names;
  whether Uvarov's regiments were with Liechtenstein's column or had gone to Bagration the evening before; the numbers of Rivaud's and
  Drouet's divisions in I Corps, which the October returns give differently;", and after the Smith sentence: "Kamensky's musketeer
  regiment is named here as Mikhailovsky-Danilevsky names it, Ryazhsk; the Materialien of 1806 and Duffy give Ryazan, which is kept as the
  other reading." Why: step 2 put these open questions on screen, and this sentence is the visitor's index of them (the critic's item 7;
  each from the records above: H-12's hours, the chapel battery, H-13, H-11 and questions 153 and 155). No clock time, so
  `check:chronology` gains no statement (108 timed statements, as before). Decision 105's tested phrases kept (`test.js` 588/588).

**The sources read (the register).** `docs/step2-evidence/readings.md` (new, C2; revised with every review): every passage step 2's
sourced texts rest on, read on 8 October 2026 from the scans (archive.org page images and text layers; Mikhailovsky-Danilevsky 1844
through archive.org's IIIF service; Stutterheim's French original on Gallica's images; Tolstoy from Project Gutenberg), each with the quote
as printed, a translation, the locator and image, a grade, a label, what it settles and what it does not, and "not yet second-read
(H-17)" (but §6.8, the second reading for question 153). Sources: the Correspondance t. XI (nos. 9534, 9535, the 30th Bulletin),
Stutterheim 1806 (German, and the French original), the Materialien 1806, Thiébault t. III, Mikhailovsky-Danilevsky 1844 and 1846,
Alombert and Colin t. IV (the returns of 26 and 28 October; p. 69), Marbot t. I (27th edition), War and Peace (Maude). Searched and not
found: "soleil d'Austerlitz" in two Ségur volumes; an Allied estimate of the French strength; "Гладков". Not readable: Duffy 1977, Smith
1998. Corrected in the reviews: Thiébault's Guard "qui n'eurent pas un coup de fusil à tirer" is on p. 464, not p. 463 (§4.7, §13 F14;
image n475, read in the review of C24-C26; the commit message of `4fb58c9` and its notes said "pp. 463, 466"); §7.4 records p. 755's
"2e division aux ordres du général Gazan"; Marbot's Blasiowitz sentence spans pp. 259-260 (§8.4), his sun sentence stands on p. 260.

**Presentation changes** (not guarded; `app.js` unless named)
- **125 (a), C3, C4, C14a.** The event dossier shows a disputed event's pill, "(the hour is disputed)" after its clock and a section "When it
  happened: disputed" with its `dispute`; the columns-move dossier no longer adds "The hour is not fixed in the sources, so this is shown as
  an interval rather than a timestamp." under it, although its dispute covers only Dokhturov's I Column of the four columns (its
  "Interval, not a timestamp" pill and `CLAIM.disputed`'s "or for part of it" stay; recorded from the review of C4). The two "unsettled"
  arrows ("I Column descends", phase 1; "Kamensky turns about", phase 4) carry "(disputed)" (`LABELS.arrow.unsettled`; "(hour disputed)"
  in C4, shortened under question 145 so that Augezd is drawn again at 07:00). The claim icon `split` (Disputed; tokens.js, symbols.js,
  style.css).
- **H-7, C8.** A third Command-tab source tag, ANECDOTE (`SRC_LABEL`, `TOKENS.sym.source.anec` "half", `.src.anec`; question 148).
- **D-3, C13.** The order-of-battle list shows the Santon detachment at the third level, under Suchet's Division, with its strength but
  without its commander (`buildOOB`'s sub2 rows print no commander; Claparède stays in its dossier). Recorded from the review of C13.
- **126, C17.** The plateau label "THE PRATZEN  ·  derived: Allied ≈ N   French ≈ M", accessible name "The Pratzen plateau, a derived
  reading: ..." (an image, no keyboard stop), drawn in phases 0-6; one constant, `PLATEAU_LAST`, governs the label, its outline (a design
  decision beyond 126: the outline leaves with its reading), the Now tab and the caption.
- **128 (a), C18.** A formation's pill reads `POS_CLAIM` ("Position: documented / estimated / reconstructed") in the card and the dossier;
  `CLAIM`'s note is kept only where a track entry names its own claim (heightguns@8-9). The event dossier keeps `CLAIM`'s words.
- **127 (b), C19, C27.** The Pratzen vantage's title (`shell.html`) "The ground that decided the battle" -> "The Pratzen plateau"; the first-run key's sentence
  (`paintKey` and `shell.html` `#fr-key`): "The high ground in the centre is the Pratzen plateau, and it decides the battle." -> "... the
  Pratzen plateau, which this map reads as deciding the battle." (decision 108's words labelled).
- **H-16, C20.** The Zuran and Allied vantages' titles (`shell.html`): "Napoleon's command post: what he could see" -> "Towards the plateau from near the Zuran
  mound, Napoleon's first command post: a preset view, not what he saw"; "The field as the Allied staff saw it" -> "Towards the plateau from
  the east, the Allied side: a preset view, not what the Allied staff saw".
- **135, C21.** The going key's "vineyards (presumed)" (`TOKENS.sym.going`) and a legend row (`shell.html`) "vineyard at Stare Vinohrady: presumed (whether vines stood there
  in 1805 is not established)"; `VINEYARD` and the classes unchanged.
- **H-9, C22, the review fixes of C19-C23.** `lightNotes` attributes the fog and the sun on the climb to the two memoirs and gives
  Thiebault's hours as his (day only at eight, p. 456; the aide at half past eight, p. 504); the hours drawn stay the narrative's.
- **H-15, C23, the review fixes of C19-C23.** One helper (`evNote`) gives an event's note wherever it is named outside its dossier: "the
  hour is disputed" (columns-move, kamensky), "an interval, not a timestamp" (the 10 other windows), "a reconstruction" (kursk): its
  marker's name and title, its map label's accessible name, the Now tab's strip, the opening's bar, a formation's dossier links and the
  selection chip; the one-line caption carries it as a tag before the name, followed by a space, where its ellipsis cannot cut it. A
  departure from H-15's fix sentence ("an interval: the hour is not fixed"), recorded: decision 44 makes soult and counter-march fact-A
  processes; the eagle's and the Russian Guard's "not established" stays in the phase line, at Stare Vinohrady and in the dossier.
- **D-5 (b), C24, the review fixes of C24-C26.** The sources sheet's notes read the table: the measures, the Austrian count and model (with
  its source, without its trailing period claim), the statures' dates, the cloths drawn (a borrowed cloth named) and the grades are read
  from `APPEARANCE_GRADE`, `DRESS` (`kitDress`), `COLOURS_CARRIED`, `STANDARD_MEASURES`, `KIT.carry` and `SUN_DAY`; the painted patterns'
  description, which describes the drawing (`KIT.paint`, a design simplification), stays typed and is checked against the table's model
  and pattern texts (C24's note line "Is: read from" overclaimed for those words). The cloths' "width by height" (C24) is now "the first
  figure along the fly and the second along the staff, as drawn (Dolleczek's ratios do not say which side is the staff's)"; the cloths
  drawn in the generic proportion (`KIT.std.aspect`, a design value) are named ("where neither a cloth size nor a painting is read (the
  Royal Guard of the Kingdom of Italy and the Russian Guard infantry), one generic proportion, a design value").
- **D-6, C25, C26, the review fixes of C24-C26.** The march row tagged derived ("the plotted leg's length over its time window"); an
  aggregate's place "Midpoint", tagged derived, with the number of formations averaged ("Midpoint", not "Centre", a tactical word in the
  narrative); no tag on an aggregate's card when none of its formations is on the field. The plateau's "plotted strength unchanged"
  follows the plotted holding alone (`plateauDay`, `plateauFlatFor`), not where the clock came from.

**Tests** (no assertion loosened; each new rule shown failing by mutation in the commit's notes)
- `test.js`: the guard's reach (C1: every top-level declaration of the four data files and app.js's data declarations in check:data's
  lists); `EV_FIELDS` + `dispute`, a disputed claim without two clock times fails, a dispute on another claim fails, a disputed track
  entry fails (C3), a disputed hour graded A fails (C5); the Command tab's kinds doc, inf or anec, an anec row saying "memoir anecdote" and
  a row saying it carrying anec (C8); a parent without its own troops whose formations exceed its strength fails, the pin `santon.parent`
  (C13: order of battle 42/42); a key declared twice in one object literal of the data files, a moveMin on a first anchor (C14); a Dress
  note naming `data.js`, "the data", "not changed here" or a formation id fails (C16).
- `redteam.js` 6a: `SUPERLATIVE` (with `ATTRIBUTED`) and `COUNTERFACTUAL`, with canaries (C12); every entry added since step 1 names the
  pattern and step that found it (`found`, `KIND_PATTERN`, `PATTERN_STEP`), else it is one step 1 left (`LANG_STEP1`) (C12, a relaxation of
  step 1's "can only shrink", recorded and made checkable); `LANG_STEP1` can only shrink (one entry), an entry without `found` only for a
  BANNED, CAUSAL or VERDICT hit, and each `found` tag at most the hits its pattern found the day it was added (`FOUND_MAX`; the review of
  C12, in the fixes of C24-C26); `DONE_STEPS` (C28; the critic's item 3): an entry whose `until` begins with a done step fails.
  `LANG_ALLOW` 9 -> 8 (C11) -> 16 (C12) -> 13 (C15) -> 12 (C17) -> 11 (C19) -> 9 (C27): seven superlatives until step 4 and two
  permanent, each naming its kind ("a statement of method", "attributed words"); `LANG_STEP1` 8 -> 1. `KNOWN_WARN`: "cavalry mean rate 0.82
  is not above infantry 1.26" (was 1.23; C7).
- `tools/stage2/chronology.js`: the extractor reads `dispute`; `ALLOW_TIMED` 12 -> 15 (C3 +5 for the other sides, C10 -3 for H-12's and
  +1 for the phase-0 line's 04:00); `REVIEW` 74 -> 75 rows (drouet@3), `REVIEW_CITES` 172 -> 181; `EXCLUDED_PATHS` 5 -> 4 classes (the light
  keys gone, C14); four rows' `data.js:78` (the Soult-advance line until C3 inserted a line above it) corrected to `data.js:79`, and
  sthilaire@3's pair to `data.js:79; data.js:80` (a reference correction from the review of C7; no check reads these locators).
- `runtime-test.js`: the disputed hours and the arrows' mark (C4); the plateau label at seven clocks (C17); every formation's pill
  `POS_CLAIM`'s for its claim, none `CLAIM`'s (C18); the event notes and the caption (C23); the notes from the table, 10 table changes
  followed, the generic cloths named and the painted item's 8 typed words in the table (C24, the fixes of C24-C26); the derived tags at
  every half hour and an aggregate off the field untagged (C25, the fixes); the plateau note from the clock alone (C26).
- `css-test.js`: the disputed pill's rule (C3); no measure, grade definition or minutes typed in the notes (C24); the place and march rows
  built by `posRow` and `marchRow`, `paintSituation` keeping no clock (C25, C26); both copies of the first-run key labelled (C27).
- The self-test: 217 -> 221 checks (the manifest regenerated in each commit that added one); the four names added: C17 "derived readings
  (decision 126): at 1x, 4x and 10.33x, on the landscape, the paper map and with counters, the plateau label is drawn in phases 0-6 with
  "derived" in its words and its name (an image, no keyboard stop), and from phase 7 neither it nor its outline; the Now tab's and the
  caption's readings carry their tag wherever drawn" (the check behind `SOURCE_NOTE.layers[2][1]`); C23 "events: a disputed hour, an
  interval or a reconstruction named with its note by its marker and a formation's dossier, and tagged in the caption inside its box; a
  disputed event's dossier its pill and both hours; an unsettled arrow's label its mark (decision 125, H-1, H-15)"; C25 "derived readings
  tagged: every formation's march row (Marching, Next move) and every aggregate's midpoint (the mean of its formations on the field, their
  number named) carry the derived tag, in the full dossier and the card; no aggregate named as a position (docs/FINAL_AUDIT.md D-6)"; C26
  "derived readings: the plateau's “plotted strength unchanged” follows the plotted holding alone (unchanged for 60 minutes or more before
  the clock), the same after a jump from 04:00, a jump from 18:00 or played (docs/FINAL_AUDIT.md D-6)". None removed or renamed. Also: the
  legend check's vine row (C21); the first-run key check pins the whole labelled sentence and forbids the unlabelled verdict (C27); the
  event-note check allows for the caption's ellipsis and reads the selection chip (the fixes of C19-C23); the derived-tag check fails an
  absent midpoint tagged (the fixes of C24-C26).
- `tools/visual/data-invariance.js`: a sixth group, "data in app.js (roadmap step 2, D-5)" (C1: `SUN_DAY`, `FEATURE_GT`, `TIMING_TEXT`,
  `CONF_TEXT`, `CONF_INTERP`); C28 adds `POS_CLAIM` (the position grades as a visitor is told them, the class of `CONF_TEXT`; the critic's
  item 6) and `SRC_LABEL` (the Command tab's source grades, ANECDOTE among them, the same class), after the reference moved, so both are
  compared against this build from now on; `test.js`'s guard names them too.

**Thresholds: one re-measure (decision 146).** `UNOBSTRUCTED["narrow-390"]`: was [0.46, 0.507], is [0.438, 0.507]. Measured .4388 at
390 x 844 and .5079 at 1280 x 720 in two identical `--only` runs of build `b6da3d47` (C27), by decision 62's rules as `remeasure.js
--bounds keep` applies them, by hand (the tool refuses `--only` runs): the case's value rounded down to 0.1 point, the 1280 x 720 value met
and kept. Why: decision 127 (b)'s words make the first-run key one line taller at 390 px (question 146, the owner's answer (a)). Its drop
limit 7 is kept (4 measured: n:ahq, t:vinohrady, t:santon, t:zuran). `first-run` and `first-run-laptop` met their limits unchanged; no
opening case moved (decision 121); no other limit changed in step 2.

**Records and references (C28).** The final build archived as `archive/step2-f7e1c622.html`; `package.json`'s `check:data` compares
against it (was `archive/stage6b-7fc0f6c3.html`) and `check:baseline` takes its md5 and size (was `7a86548c…`, 1,883,794 bytes). The size,
+43,478 bytes (+2.3%). `CLAUDE.md`: the layout table (the archive, `docs/step2-evidence/`, the app.js additions), the guard's seven
declarations in `app.js`, the `LANG_ALLOW` sentences (9 entries: seven superlatives until step 4, two permanent with their kinds;
`LANG_STEP1`, `DONE_STEPS`), 6C's "decided words, decision 108, labelled under decision 127 (b)", the `check:data` and `check:baseline`
sentences, decision 146's re-measure, the current state. `README.md`: the `check:data` reference. `docs/ROADMAP.md`: step 2 "in review
(#50)", the owner decisions 142-161 as a table, and "What step 2 handed on" (with the critic's items 4 and 12). `docs/VISUAL_SPEC.md`
§10.4: the claim icon `split` (Disputed), the position pill, and the source tag ANECDOTE (`half`). The open minors of the first segment's
review (C4, C7, C12, C13, C14) are fixed in `25cc972` or recorded above.

**Verified** (4 cores, headless Chromium 141.0.7390.37 with SwiftShader, Playwright 1.56.0)
- Per commit, as each commit's notes give it: T on every commit; K on every data commit; D failing by design from C3, its list of changed
  declarations as the plan gave it; C and S where the commit changed text or a check; targeted `--only` harness runs after the commits
  that could move map text or a panel (C4, C7, C12, C14a, C17, C18, C22, C23, C25, C26, C27), each case's drops, dropped ids and
  unobstructed shares compared with the data-task full run.
- The data-task full `check:visual` (the lead's, on the C14 build `6c051bc8…`): 30 of 30 cases pass, "STAGE0: all checks passed", the
  self-test 217 of 217; against step 1 only `hybrid-dimmed` dropped 8 instead of 7 (t:girzikowitz, Drouet's new place; limit 13).
- **On the final tree** (build `f7e1c622…`, 1,927,272 bytes)
  - `npm test`: "ALL 9 SUITES PASSED (and the height guard)". Height guard 97 sites, 0 presentation calls of `height()`/`hAt()`;
    `css-test` CSS ERRORS 0, behaviour 9/9; `test.js` ERRORS 0, warnings 0, appearance 588/588, order of battle 42/42, events validated 25,
    "guard: the 24 declarations of the four data files and app.js's 7 data declarations are in check:data's lists (128 names)"; `geo-test`
    59 passed, 0 failed; `terrain-test` the meres OK at 1x, 4x and 10.33x (smallest margin 0.0225, as in step 1), the canary 8 of 12;
    `audit` 0 march-rate and 0 terrain violations; `sim-test` ERRORS 0, 25 events 0 disagreements, worst telnitz 0.82 km, most on the field
    at once Allied 83,120 of 85,400, French 68,300 of 73,000; `redteam` findings 0, warnings 1 (1 acknowledged), the overclaim scan 7,465
    strings judged (1,902 prose; not judged: 618 the sources' own words, 2,106 developer, 924 in code positions), 9 allowed (`LANG_ALLOW`, 9
    entries), 0 notes, retired claims 37 phrases, 0 found; `runtime-test` console.warn unique 0, errors 0; `binding-test` 386 checks, 0
    failed.
  - `npm run check:data`: "All 128 DATA declarations are byte-identical to the original build" (against `archive/step2-f7e1c622.html`;
    against the 6B reference before the move, "DATA CHANGED: 12", the list above).
  - `npm run check:chronology`: errors 0; 70 moves with a timed statement, 66 consistent, 4 early (the named conflicts dok@1, guard_cav@6,
    kamensky@3, kamensky@4), 0 late; explicit times 21; 108 timed statements (68 read, 38 excluded by class: 26 tm, 9 phase clocks, 1
    tolWhy, 2 comments), 93 cited by 74 of 75 `REVIEW` rows (181 cites), 15 allowed; the movement audit 0 findings.
  - `npm run check:contrast`: 6,260 text elements, 114 pairs, 0 below AA, 0 below 10.5 px, 0 font failures (369 characters in 8 computed
    fonts); 35 of 35 states reached; 1 console message, allowed (`eye-leave-floor`).
  - `npm run check:selftest`: 221 of 221, named as the manifest names them; "STAGE0: all checks passed (the self-test only)".
  - `npm run check:baseline`: passes at `f7e1c622…`, 1,927,272 bytes.
- <<VF: the lead's final check:visual>>

**Uncertain, or not verified**
- Historical: every reading is one reader's, "not yet second-read (H-17)" (but §6.8); Duffy 1977 and Smith 1998 could not be read, so the
  figures cited from them are cited, not checked. The three disputed hours are marked, not settled (125 (b)). Suchet's division number on
  2 December is open ("3e or 2e": the 2nd has no source read, and on 26 October it is Gazan's); Gladkov is unconfirmed; Uvarov's
  regiments disputed; the Kursk regiment's part (F5) and who turned Kamensky's brigade (F13) disputed; `COMMAND.al[4]` still says "on his
  own judgement" under DOCUMENTED. Thiébault's Guard "had not one shot to fire" and "took no part" (pp. 464, 466) stand against the map's
  guard_inf@6 "Committed onto the plateau" and c_gd's role (F14). The chapel battery's guns and place and the drowning toll stay
  three-sided. `COLOURS_CARRIED.at_inf.model` is labelled "fact" while its 1805 use is an inference in the 6B reading (the sources sheet now
  prints it without the period claim).
- Implementation: the plateau label reads "Allied ≈ 0", marked derived, from 12:27 to 12:44 (the decided phase rule). heightguns@8-9 read
  "Position: reconstructed" beside "Position B" (the entry's own claim; question 154), where `SOURCE_NOTE.layers[1][1]`'s "a formation's
  dossier names the grade as its position's" does not hold. An interpolated position between two A anchors reads "Position: documented"
  (H-5 counts 31.7% of formation-samples; 128 (b)). guard-broken's caption tag is "interval" beside the phase line's "The hour is
  disputed" (question 161); blasowitz carries no note beside `FEATURES`' "not established". The event's drawn map label keeps its words
  without its note (its accessible name carries it). The aggregate's untagged absent reading is tried by stubbing `posNow` (no aggregate is
  off the field at a half hour in the data). `REVIEW`'s other file:line locators written before C3 may point one or more lines off
  (records; no check reads them). Not done: a screen reader on the new names and marks, a GPU, Firefox or Safari.

**Handed on.** `docs/ROADMAP.md`, "What step 2 hands on", lists what each later step inherits (step 3: the caption's clipped reading,
question 159; the screen reader on the label and the marks; the drawn map label's note. Step 4: the disputed hours and the other hours,
Drouet and I Corps, the Guard's part (Thiébault pp. 464, 466), the Zuran and gqg@0's grade (160), the strengths, the chapel battery and
heightguns@8 (154), the ice, the seven superlatives, H-11's open numbers and names, the claims per statement and H-5's interpolated
positions (128 (b)), Blasowitz (158, with Marbot pp. 259-260), guard-broken (161), Turas, Posoritz, Kologrivov and the ceiling-derived
climbs. Step 5: H-19's spelling, H-18, the labels' cost to `pickFormation`, `buildOOB`'s commander, `REVIEW`'s locators).

## 2026-10 · Roadmap step 1: suite hardening, the fonts embedded first (decisions 131, 132, 141)

**Status: for review (#49). The build changed: `austerlitz-command-map.html` 1,883,794 bytes, md5 `7a86548c5e394853571f28f9e1640a74` (was
the Stage 7D build, 1,764,002 bytes, md5 `46773462faa1e1b9f4a4010e450e110a`).** `check:baseline` moves to this build. `check:data`'s
reference is not moved: no guarded declaration changed (all 121 identical). The first commit (`086ccec`) records the audit (#48) as merged,
decisions 125-141 (`docs/FINAL_AUDIT.md` §6.0) and the new `docs/ROADMAP.md`. The next owner decision is 142. The size, +119,792 bytes
(+6.8%): commit 1 +104,872 (`fonts.css`, 96,643 bytes, among them), commit 7 +1,586, commit 8 +12,211, the diff review's fixes +1,123.
"Commit k" below is "Step 1 (k/12)" in `git log` and its tree: 1 `7cba677`, 2 `8ef2e69`, 3 `804b50c`, 4 `d544333`, 5 `ac9ae88`, 6
`3e11d9b`, 7 `9310fc0`, 8 `65ce0d1`, 9 `4e670e6`, 10 `9e56e1d` (the re-measure), 11 `fd6e537` (CI); the diff review `7971634` and the
manifest `6f8ec58`; the records `8dcf368` and 12.

**Owner decisions (§6.0).** After #48 the owner wrote: "Merged. Let's start with 1. And we will go with your recommendations on all
questions." Decisions 125-141 are each as their question recommended; this step takes 141 (the fonts, first), 131 (T-1, T-2, D-1, D-2, H-8,
T-4, T-5, with T-3 and T-6, before any data task) and 132 (CI). Choices made within decision 141, stated for the owner: the sans is Inter
4.001, renamed "Austerlitz Sans" (SIL Open Font License 1.1), with one glyph, U+2502 (the timeline's event buttons), from DejaVu Sans 2.37
(Bitstream Vera and Arev licences) as a second face of the family; the serif is TeX Gyre Pagella 2.501, renamed "Austerlitz Serif" (GUST
Font License, an instance of the LPPL 1.3c or later); each renamed as its licence asks. The re-measure takes `--bounds keep`: a limit
changes only where the fonts moved the measure past it, rather than every limit set to its count by decision 62's method, which would leave
no slack for step 2's longer plateau label (decision 126's trade-off).

**What changed, by finding** (no assertion loosened: the six limits the one re-measure moved are decision 141's, below, and the one
allowance the diff review found too wide, `binding-test.js`'s day-track, is narrowed back; the one assertion removed, `terrain-test.js`'s
`wl<=lo`, could not fail and is replaced by a stronger check; each commit was reviewed for that)
- **T-0, the type (commit 1).** `fonts.css` (new; generated by `tools/fonts/build-fonts.py` from seven sources pinned by sha256 in
  `tools/fonts/sources.json`, byte-reproducible; `--check` rebuilds and compares): three `@font-face` as WOFF2 data URLs with the three
  licences and each face's changes. Inter instanced to weights 400-700; subset to 462, 1 and 349 code points; hinting removed. Vertical
  metrics overridden to DejaVu Sans's and Liberation Serif's, so line boxes stay where the harness measured them; no `size-adjust` (the 10.5
  px floor stays truthful). `tokens.js` names the faces first; `build.py` puts `fonts.css` at a `/*FONTS*/` marker inside the stylesheet and
  fails if a type token does not name an embedded face first; the compass rose loses `font-family="Georgia,serif"`. `app.js`: the boot
  screen lifts once the faces have loaded or after 3 s (`fontsReady`, `relayoutAfterFonts`); two self-test checks (212 -> 214). Checked by
  `css-test.js` (the faces against `tools/fonts/manifest.json`'s hashes, names and licences, every glyph a visitor can be shown covered, no
  `font-family` outside the tokens), `runtime-test.js` (the loader's dry runs), `check:contrast` (which faces drew every character, asked
  over the Chrome DevTools Protocol once per computed font; per element it took 25 min 57 s) and `tools/fonts/accept-probe.js` (three views
  under this machine's fonts and under a DejaVu-only fontconfig must measure the same).
- **T-1, warnings and page errors fail (commits 3, 8, 9).** `runtime-test.js` builds the real three r128 material behind each stub, so
  r128's own `setValues` warns on a bad key (the hand lists and their false `fog` warning are gone; ShaderMaterial checked for the first
  time); a warning, an error, a failing photo atlas check or an unhandled rejection sets the exit code. `tools/run-all.sh` fails on
  "console.warn unique: [1-9]" and keeps its outputs in a private temporary directory, named on a failure (T-9 (f)). The harness and
  `check:contrast` judge every page's console warnings and errors, page errors, crashes and failed requests against `thresholds.js`
  `CONSOLE_ALLOW` (one entry, below). The self-test (`texData`) and the harness (`readCanvas`) read app canvases through their own: the 7
  Canvas2D warnings are gone.
- **T-2, the meres (commits 7, 8).** `terrain-test.js` runs on real r128 with the live ground (`groundGeometry()`), `buildWater` and
  `mereLevel` at 1x, 4x and 10.33x: for each of 12 surfaces, the drawn 48-vertex edge, the exact lowest drawn ground along each chord and
  2,000 samples; one disc and one ring per mere; a canary (lifted 0.05 more, at least one must float). The check it replaces (`wl<=lo`)
  could not fail. The self-test's ice check uses the same rule on the drawn meshes. `height-sites.js`: 97 sites, as before.
- **T-3, warnings (commit 2).** `KNOWN_WARN` in `test.js`, `redteam.js`, `sim-test.js`: a warning fails unless acknowledged by its exact
  text with a reason and a record; a stale or reasonless entry fails. One entry: "movement: cavalry mean rate 0.82 is not above infantry
  1.23" (redteam). "Source k is cited nowhere" (`test.js`) is an error.
- **T-4, the report judged again (commit 9).** Every failure is decided by `thresholds.js` `judgeReport` from numbers kept in the report
  (`report.live`); `check-report.js`, rewritten, applies it again without rendering: every case, the live blocks, the console, and the
  self-test by name against `tools/visual/selftest-manifest.json` (new: 214 names from a passing run of commit 9's build, 217 after the
  diff review; regenerated and recorded whenever a check is added, removed or renamed).
- **T-5, no silent skip (commit 9).** `REQUIRED_FEATURES` (21 names), read from the page, replace the `typeof` gates: a missing feature is
  listed and fails a `--test` run (`--legacy` keeps the gates for archived builds); each `check:contrast` state must be reached. Baselines
  for the three views without one: `eye-zuran`, `eye-zuran-1x` [0.897, 0.872], `plans-overview` [0.703, 0.628] (the 7D report's values
  rounded down to 0.1 point; provisional until the re-measure).
- **T-6, checks as strong as their claim (commits 2-4, 7-9).**
  - `test.js` validates `EVENTS` (25; `EV_NO_FORMS` names `end`); `redteam.js` and `sim-test.js` fail on an unknown formation id; redteam
    checks an aggregate through its tracked formations; sim-test's candidates stay the named tracked formations.
  - `runtime-test.js` asserts what it computed: the 40 rounds, the caption and strip at 121 minutes, the event-jump camera at 21 starts, the
    plan links (8 far, 10 near), the derived wording, the villages, the events toggle.
  - `geo-test.js`: five checks independent of `geo.js`'s formulas (54 -> 59 passed): bearings on the sphere, 614 pairs of the 26 survey
    points, worst 0.152 degrees; a step along `NORTH`; `NORTH` from the audited positions alone, mean -0.031 and worst 0.353 degrees; the
    scale pair by pair, 63.048-63.235 m per world unit against `M_PER_WORLD` 63.198; the exaggeration, 10.3238x against `EXAG` 10.3264x
    (-0.025%).
  - `css-test.js`: one `@media`-aware parse (a rule that must hold read in the base rules, one that must be absent in every context; the
    first-run buttons' heights in every layout); colour words as whole words; the palette rule reads every spelling (rgb/rgba, #rgb, #rgba,
    #rrggbbaa, hsl, `THREE.Color`, `setRGB`, `setHSL`) and `symbols.js`. `binding-test.js` reads SVG `stroke-dasharray` in every form, in
    the stylesheet and `shell.html` (383 -> 386 checks; `dayTrackEl` allowed with its own assertion).
  - The self-test (commit 8; names unchanged): Follow's 80% over the minutes with a live event, the whole day required; the confidence marks
    measured from their geometry against decisions 86-88 written in the test, not `confSize`, the masks texel by texel; the eye level
    requires an unknown formation and, but at 1x, enemy figures; no figures at 1x asserted; the timeline's counts; the derived readings from
    the data (`PLATEAU_04_RECORDED` 38,700); the drift measured under `?harness=1`.
  - The harness (commit 9): each case's state held to its spec before and after its measures (`expectState`; the camera within 0.01); the
    ground reader's self-check at 1e-4; in Watch the caption's derived reading must show and the ordered routes must draw.
  - The suites regenerate the modules they read (`tools/fresh.js`); `runtime-test.js` refuses a stale `bundle.js` (T-9 (g));
    `terrain-test.js`'s Pratzeberg margin is geo-test's 25 m (T-9 (a)).
- **D-1, `check:chronology` reads the live text (commit 6).** An acorn inventory of every timed string and comment in `data.js` and
  `analysis.js` ("noon" read as 12:00); every live timed statement cited by a `REVIEW` row (`REVIEW_CITES`: 172 cites in 74 rows, 136 from
  REVIEW's evidence, 36 added) or allowed with a reason (`ALLOW_TIMED`: 12, three of them H-12's, for question 129), never both; a cite that
  no longer resolves to one live statement at its time fails (a retimed sentence, a moved or renamed source). New rules: D1 (a derived
  arrival tactical, at the ceiling only for `CEILING_FLAGGED`, at its own moveMin only for `MOVEMIN_DERIVED`: gqg@6), F1 (`FORCED_DATED`
  asserted), F2 (every leg at 80% of the ceiling or more named in `NEAR_CEILING`), M1 (the movement audit). REVIEW's prz@8 text time
  14:00-14:30 -> 14:00 (14:30 is the phase start, which no text gives: a tightening).
- **D-2, every first anchor graded (commit 2).** `test.js` and `redteam.js`, each with its own code, require a grade on every tracked
  formation's first positioned anchor, phase 0 included (redteam checked 2 of the 32; `stateAt` draws a missing grade as B).
- **H-8, the overclaim scan reads every visitor string (commit 5).** `tools/lang-scan.js` (new) collects every string a visitor can be
  shown: the guarded declarations, the presentation code of every file `build.py` joins, `tokens.js`, `shell.html`'s text and visitor
  attributes (code positions, self-test and console text, and `appearance.js`'s quoted words are not judged). `redteam.js` section 6a
  applies section 6's patterns and a VERDICT pattern to them; section 6 is byte-identical. `LANG_ALLOW` names 9 hits, each with its reason
  and the question that removes it (129: the c_iv, c_gd and c_cav roles, the Satschan story's "certainly"; 126: `SOURCE_NOTE`'s "always
  marked derived"; 127 (b): the first-run key in `app.js` and `shell.html`, the Pratzen vantage's title; permanent: "decisive" in the Allied
  plan's stated assumptions, attributed); a stale entry fails. c_cav's role ("decides the cavalry battle in the north") was not named by the
  audit.
- **CI, decision 132 (commit 11).** `.github/workflows/checks.yml`: a browser job beside the checks job runs `check:contrast` and
  `check:selftest` (a matrix of two; the self-test's report uploaded); the full `check:visual` only on demand ("Run workflow",
  "visual"). The Playwright install is bounded to 10 minutes a try, at most three (`4fb85a9`): once it stalled 45 minutes on the runner's
  package mirror, before any test ran. New scripts: `check:selftest` (the self-test, the slider, Play and the 3E keys by real key
  presses on one fresh 1366 x 768 page) and `check:remeasure`.

**Product changes the stricter checks required** (presentation, not data: none of these declarations is guarded; `check:data` 121 identical)
- `mlHoverAt` (`app.js`, commit 1). The wider serif drops more names at 4x (6 in one self-test state, was 2): d'Hautpoul became reachable
  only from the keyboard (Drouet's placed name covers its footprint) and two dropped names took turns under the pointer. A dropped
  formation's footprint under the pointer now wins over another item's box, and a hover so reached holds while the pointer stays on it
  (`mlDroppedNow`, `mlAnchorWithin`, `ML.hoverDrop`). The self-test's assertion is unchanged.
- `groundGeometry()` (`world.js`, commit 7): `buildWorld`'s ground lines moved out unchanged; every buffer (403,200 vertices) and all 16
  `FACE` fields byte-identical before and after, proved in node.
- The palette (commit 7): the 11 colour literals the wider rule found in 5 declarations moved, text unchanged, into `LAND_COL` (`wallTex`,
  `roofCourse`), `LIGHT_RIG` (`atmo0`, `sunDisc`) and `KIT.weave`; 2,642 recorded canvas calls and the uniform's colour identical.
- `AMBIENT_TEST` (`app.js`, commit 8): a measurement switch the app never sets, like `CONF.none`, on only for the self-test's drift check.
  The self-test's own stricter code (+12,211 bytes) ships in the file (decision 140).

**The diff review (`7971634`, `6f8ec58`).** The whole step-1 diff was reviewed through five lenses (a loosened assertion, data and
history, bugs, the licences, the records), each finding challenged by two independent skeptics: 29 findings, 15 survived, all taken.
- A click selects what the hover shows (`pickAt`, `app.js`; presentation). Commit 1's hover rule lets a dropped formation's footprint win
  over another item's box; a click there still selected the label over it, so the highlighted formation was not the one selected. A
  dropped formation reached by hovering its position (`ML.hoverDrop`) is now selected while the pointer stays there. A new self-test check,
  "map layer: a click selects the formation the hover shows, also a dropped one reached by hovering its position" (at 1x, 4x and
  10.33x: 214 -> 217 checks; the manifest regenerated from a passing run). The same self-test on a build without the rule fails it at
  4x and 10.33x (Milhaud's dropped name hovered, a click picked the Soult event; his dropped counter hovered in Watch, a click picked
  Saint-Hilaire): the mismatch was live in the step-1 build, not only possible.
- `binding-test.js`: the day-track's allowance had exempted `dayTrackEl` from every dash pattern, the six it failed on before step 1
  among them; it is allowed the SVG attribute in markup only (a `dashRuns(` call, a `setLineDash` and a `.strokeDasharray=` planted in it
  each fail; each passed before this fix).
- `check-report.js`: a recorded Watch-dwell failure is a note (a limit changed since) only while the dwell's raw numbers meet every
  condition but its drop limit; the pattern alone had waved through a darkness, AA or caption failure.
- Records: `CLAUDE.md` (8 of `LANG_ALLOW`'s 9 entries go with step 2, the ninth is permanent; `check:chronology`'s five classes excluded
  by path, `EXCLUDED_PATHS`; the ordered routes required in every reading view, not only in Watch); `README.md` (the excluded classes);
  `tools/visual/README.md` (how `check:contrast` asks for fonts; which cases are reached by real clicks; the orbit case's synthetic
  events); `docs/ROADMAP.md` (`size.js` misses all of `fonts.css`, not 10 bytes; every italic is synthesized, the INFERRED tags too);
  `tools/stage2/chronology.js` (entries two to four of `ALLOW_TIMED` are H-12's, not the first four); `redteam.js` `KNOWN_WARN`'s
  locator (§M.12 and §M.13, not §M.10); `tools/fonts/sources.json` (the Pagella URLs are CTAN's moving mirror; the sha256 is the pin).

**Thresholds: the one re-measure (decision 141; commit 10).** `tools/visual/remeasure.js` (commit 9) takes two full `--test` runs of one
build on one platform and stops if they differ, if anything but a re-measured limit fails, or if a baseline would fall below its Stage 2C
value. Under `--bounds keep` a drop limit changes only where the measure exceeds it, a baseline or a px-per-km floor only where the measure
falls below it; every loosening and every change to an opening case (decision 121) is listed and refused without `--accept-loosening 141`.
No full `check:visual` had run on the step-1 build before these two (the notes record `--only` runs). Run 1 (16:48-18:30 UTC) and run 2
(18:30-20:11 UTC) of the `1aa3ada1…` build each failed on the same 9 items, every one a font-dependent limit, and on nothing else: the
self-test 214 of 214, 0 console messages, 0 skipped, every case's state as its spec; the two runs identical in every measure re-measured.
`remeasure.js --bounds keep --accept-loosening 141` proposed six changes, all loosening, each under decision 141's one re-measure:

| constant | was | is | measured (both runs) | why |
|---|---|---|---|---|
| `UNOBSTRUCTED["first-run"]` | [0.634, 0.520] | [0.626, 0.507] | 62.63% / 50.79% | the serif's wider title and key make the first-run card 215 px tall (192 before); the 7B build's baseline, rounded down to 0.1 point; the 2C floor 0.5442 / 0.4391 holds |
| `UNOBSTRUCTED["first-run-laptop"]` | [0.558, 0.520] | [0.546, 0.507] | 54.69% / 50.79% | the same card at 1366 x 768; the 2C floor 0.4831 / 0.4391 holds |
| `UNOBSTRUCTED["narrow-390"]` | [0.468, 0.520] | [0.460, 0.507] | 46.03% / 50.79% | the same card at 390 x 844, and the timeline 174 px (recorded, decision 122) |
| `DROP_LIMIT["narrow-390"]` | 6 | 7 | 7 | a tight count (decision 62): one more name dropped at 390 px (o:IV Column → Kobelnitz, o:V Column counter-marches north, n:lich, t:pratzen, t:vinohrady, t:santon, t:zuran) |
| `DROP_LIMIT["eye-zuran"]` | 5 | 6 | 6 | a tight count: the six village names at the eye (t:goldbach, t:telnitz, t:sokolnitz, t:satschan, t:kobelnitz, t:puntowitz) |
| `DROP_LIMIT["plans-overview"]` | 11 | 12 | 12 | a tight count: the Plans overlay at the Overview (pl:The concealed centre, n:ahq and ten place names) |

Every other limit is met and kept: the 27 other drop limits (measured 1-12 against limits 2-27; nine at their limit: the six opening
cases, `selected-formation`, `narrow-1024`, `eye-zuran-1x`), the other unobstructed baselines (the 3B/3C convention would raise 24 of them,
two in each of 12 cases, by 0.1-1.2 points; under `keep` the tool lists them and applies none) and `PAPER_MIN_PXKM` (28 and 21;
measured 28.5 and 21.6 px per true km, as on the 3C build). Decision 121's opening limits are unchanged: each opening case drops what its
limit allows and measures its 7C share or more (the convention's 11 raises there are refused, "never raised"). The three T-5 baselines
(`eye-zuran`, `eye-zuran-1x` [0.897, 0.872], `plans-overview` [0.703, 0.628]) are met as they stand (89.78% / 87.22%, 70.45% / 63.01%)
and are no longer provisional. Reported, not re-measured: `TIMELINE_MAX` 92 (the tallest held view 92 px), `CONF_SHARE` land 0.20 and paper
0.16 (the largest measured 0.1921 and 0.1513), `SMOKE_SHARE` 0.25 (0.24), `LAYER_MS` 8 (the slowest pass 3.4 ms). `check-report.js` on
both runs with the new limits: "all checks pass for this report", the 9 recorded failures shown as notes under a limit changed since.

**Record corrections**
- `CLAUDE.md`'s `check:chronology` sentence said a derived arrival is "at the march-rate ceiling only for the legs it names
  (`CEILING_FLAGGED`), every other at the tactical rate". That was inaccurate: gqg@6 arrives at the headquarters' own moveMin, as
  `docs/STAGE2_SPEC.md` §M.13 decided (:1340, :1393, "headquarters: no tactical rate"). The sentence now names it (`MOVEMIN_DERIVED`) and
  says it was inaccurate; the check, which accepted any non-ceiling rule, now fails any but these three. No data changed.
- `tools/stage2/chronology.js`'s header claimed a movement audit it did not run (it runs now) and "±5 min" for a tolerance of 15.
- `README.md`'s checks table (R-1) named the Stage 0 reference for `check:data` and `check:baseline` and 11 views for `check:visual`, and
  left out `check:chronology`, `check:contrast`, `check:report` and three source files; it and `tools/visual/README.md` (R-1) are rewritten.
- `check:contrast`'s "eyes-dossier" state had read the dossier collapsed since Stage 5E (it expanded before selecting, which collapses it):
  it now reads 189 more text elements and 7 more pairs, all at AA; the earlier entries' counts are of the collapsed dossier.
- The `FOLLOW` comment gave 4D's 92-93%, a count over every minute; the self-test now counts the minutes with a live event, a departure from
  `docs/STAGE4_SPEC.md` §D.4's "80% of the day's minutes", recorded in `CLAUDE.md`. `docs/FINAL_AUDIT.md`'s "console.warn unique: 1" stays
  as the audit's record (the stub's false positive; 0 now).

**Verified** (4 cores, headless Chromium 141.0.7390.37 with SwiftShader, Playwright 1.56.0)
- `npm run build`: the committed HTML is the fresh build; `npm run check:baseline` passes at `1aa3ada1…`, 1,882,671 bytes (commits 8, 9).
- `npm test` (commit 9): "ALL 9 SUITES PASSED (and the height guard)" (7 min 20 s). Height guard 97 sites, 0 presentation calls of
  `height()`/`hAt()`; `css-test` CSS ERRORS 0, behaviour 9/9, palette 0 literals outside the tables (211 read; 28 white and 5 alpha-mask
  black exempt); `test.js` ERRORS 0, warnings 0, appearance 588/588, order of battle 41/41, events validated 25; `geo-test` 59 passed, 0
  failed; `terrain-test` the Pratzeberg 28.0 m above, 12 mere lines OK (smallest margin 0.0225, Satschan's shore ice at 10.33x), the canary
  8 of 12; `audit` 0 march-rate and 0 terrain violations; `sim-test` ERRORS 0, 25 events 0 disagreements, worst telnitz 0.82 km; `redteam`
  findings 0, warnings 1 (1 acknowledged), the overclaim scan 7,372 strings judged (1,862 prose; not judged: 618 the sources' own words,
  1,944 developer, 916 in code positions), 9 allowed (`LANG_ALLOW`, 9 entries), 0 notes, retired claims 37 phrases, 0 found; `runtime-test`
  console.warn unique 0, errors 0; `binding-test` 386 checks, 0 failed. On commit 1: `css-test` "embedded type: 3 faces, 200 distinct glyphs
  a visitor can be shown, 0 errors".
- `npm run check:data` (every commit; commit 9): "All 121 DATA declarations are byte-identical".
- `npm run check:chronology` (commit 6; errors 0 again on 7 and 9): errors 0; 69 moves with a timed statement, 65 consistent, 4 early (the
  named conflicts dok@1, guard_cav@6, kamensky@3, kamensky@4), 0 late; explicit times 20; timed statements 99 (61 strings read, 38 excluded
  by class: 25 tm, 9 phase clocks, 1 phase light keys, 1 tolWhy, 2 comments); cited 87 by 73 of 74 `REVIEW` rows (172 cites), allow-listed
  12; gqg@6 at its moveMin (named), sthilaire@3, vandamme@3 and bag@8 at the ceiling (flagged); forced dated legs c_gren@8, kollo@5; at 80%
  of the ceiling or more 7, each named (sthilaire@3 99.3%, vandamme@3 99.1%, guard_inf@6 80.4%, c_gren@8 98.7%, kollo@5 97.3%, bag@8 93.8%,
  bag@9 82.5%); the movement audit 0 findings (3.43 s; 0.67 s before).
- `npm run check:contrast` (commit 9): 6,174 text elements, 112 pairs, 0 below AA, 0 below 10.5 px, 0 font failures (369 characters in 8
  computed fonts); 35 of 35 states reached; 1 console message, allowed (`eye-leave-floor`) (7 min 19 s). On commit 1: 5,985 elements, 105
  pairs, 0 below AA, 0 font failures (12 min 03 s).
- `npm run check:selftest` (commit 9): 214 of 214, named as the manifest names them; the slider, Play and the 3E keys by real key presses; 0
  console messages, 0 skipped, 0 features missing (12 min 55 s); `check-report.js` on its report passes. On the 7D audit's report it finds
  47 failures (another build, no recorded states, features or live blocks, 212 checks against 214, 9 Canvas2D warnings, `narrow-390`).
- The harness `--test --only first-run-laptop` (commit 8; 28 min 21 s): the self-test 214 of 214, no console message; Follow 90.4%, 89.8%
  and 88.8% of the 635 minutes with a live event (1x, 4x, 10.33x); the ice at least 0.0284, 0.0271 and 0.0225 below the drawn ground,
  `terrain-test`'s margins; confidence 620 samples (A 312, B 227, C 81); the plateau 38,700 live, from the data and as recorded. Its 2
  failures are the case's unobstructed baselines, for the re-measure.
- Every case's state (commit 9; the harness's own page set-up, not `check:visual`): 30 of 30 meet `expectState`, 0 console messages, the
  ground reader's self-check 0-3e-6.
- `tools/fonts/accept-probe.js` (commit 1): the same numbers under this machine's fonts and a DejaVu-only fontconfig (`narrow-390` 174 px
  and 46.03%, `first-run` 62.63%, `opening-1-laptop` 51.83% unobstructed); the faces loaded within 7-13 ms of `init`'s end, none late.
  `build-fonts.py --check`: a fresh build matches, from a warm and from an empty cache.

**On the final tree** (build `7a86548c…`, 1,883,794 bytes; the same machine)
- `npm test`: "ALL 9 SUITES PASSED (and the height guard)" (7 min 33 s); every number as on commit 9 but the overclaim scan's 7,373 strings
  judged (1,953 developer: the new check's own words); `binding-test` 386 checks, 0 failed (its day-track check now narrowed).
- `npm run check:data`: "All 121 DATA declarations are byte-identical"; `npm run check:chronology`: errors 0 (as on commit 6: 69 moves, 65
  consistent, 4 early by name, 0 late; 99 timed statements, 87 cited by 73 of 74 rows, 12 allowed; the movement audit 0 findings);
  `npm run check:baseline`: passes at `7a86548c…`, 1,883,794 bytes.
- `npm run check:contrast`: 6,174 text elements, 112 pairs, 0 below AA, 0 below 10.5 px, 0 font failures (369 characters in 8 computed
  fonts); 35 of 35 states reached; 1 console message, allowed (`eye-leave-floor`) (7 min 36 s).
- `npm run check:selftest` before the manifest was regenerated: 217 checks, every one passing; its only failures the manifest's own (the
  three new names), from which `check-report.js --write-manifest` wrote it (12 min 22 s).
- `npm run check:visual`, a third full run, on this build (20:55-22:32 UTC, 97 min): "STAGE0: all checks passed"; the self-test 217 of
  217; 0 console messages, 0 skipped; every one of the 30 cases' drops and unobstructed shares identical to run 2's (the click rule moves
  no layout). `check-report.js` on its report: "all checks pass for this report".
- GitHub, on `4fb85a9` (both runs, push and pull request): checks, `browser (contrast)` (8-9 min) and `browser (selftest)` (14 min,
  217 checks) all passed. On `6f8ec58` one contrast job stalled in the Playwright install and was cancelled (above); its sibling passed.

**Mutation tests** (scratch copies, never the repository; "before" is the commit's parent)
- D-2 and the events: the grade deleted from each of the 32 first anchors in turn: 32 caught by `test.js`, 32 by `redteam.js` (before: 0 and
  2). An unknown formation id in an event: caught by all three suites (before: none); 16 malformed events, an unacknowledged warning and an
  uncited source, each caught.
- `runtime-test.js`: 11 faults (invalid material keys on a MeshBasicMaterial and a ShaderMaterial, the caption, the plan links, the jump's
  centring, the derived tag, the chimneys, the events toggle, the phase, the atlas, an unhandled rejection), each caught; the old suite
  passed the 5 run against it.
- Commit 4: 26 faults (`@media` rules breaking a held rule, a colour word inside a word, SVG dashes written five ways, `NORTH` mirrored or
  turned 0.3 degrees, `EXAG` 2% off, a second scale, bearings 1 degree off, stale modules, a stale bundle), each caught; before: 2.
- H-8: 23 mutations as designed; `LANG_ALLOW` emptied gives exactly its 9 findings; the old scan caught 1 of the 17 expected findings.
- D-1: 10 faults in memory, 10 in the text and 12 wrong table edits, each failing; the old check failed none of the 10 in memory and 1 of
  the 10 in the text.
- T-2: `mereLevel` 0.05 higher: 8 surfaces "FLOATS" (before: both meres OK); the self-test's ice code fails on it, on a missing ring and on
  a ring listed as water. The palette: 11 literals planted, 10 flagged, `#FFF` exempt as designed.
- The self-test's rules (in node): four mask faults, a C mark at half size, the plateau +100 men, the tour's figure 30,000, an army's
  strength "0": each fails. The type: 11 `css-test` mutations and 4 loader faults, each caught; `check:contrast` on a build with the rose's
  N in Georgia and the serif missing U+0065: exactly those 2 failures. The judge: 21 faults in a synthetic report, each its own failure.

**Uncertain, or not verified**
- Historical: nothing changes. No guarded declaration and no sentence a visitor reads changed; the faces they are drawn in did. The scans
  now see historical-text problems (H-3, H-4, H-12, H-13, c_cav's role) and allow them by name until step 2; none is fixed here.
- The type: Safari is believed to ignore the metric overrides (inference; the harness is Chromium only); no italic face, so every italic
  is synthesized (the dossier's Dress labels, the INFERRED source tags); `relayoutAfterFonts` ran only in the dry run (no measured page
  had a late face). The licences were read by us, not a lawyer; an OFL serif (Gentium Book Plus) was the alternative to Pagella.
- A new finding, not in the audit: leaving the eye level clamps the eye before its own formations are shown again; the render guard corrects
  it before the frame and warns. `CONSOLE_ALLOW` names it (`eye-leave-floor`: that message, in two `check:contrast` states, at most once)
  until the fix in step 3.
- The hover: `pickFormation` runs on every pointer move, its frame cost not measured (the review measured `mlHoverAt` at 0.6-0.8 ms a call
  under SwiftShader). Where a dropped formation's footprint lies under another item's box, the hover and a click now both take the
  dropped formation (the diff review): a visitor pointing at the placed label there gets the formation drawn under the pointer instead.
- What the checks still miss: a reword that keeps a cited reference and its time (`check:chronology`); a phrase built across statements or
  split by inline markup or `&shy;` (the overclaim scan); `runtime-test.js`'s caption sweep never meets a dwell. The 36 added cites are
  judgements (inference).
- Software WebGL on a CI runner (T-7): on GitHub's runners the self-test and `check:contrast` passed on every head they ran on (7-14 min;
  here 12-13 min and 7-12 min); its timing limits there are not otherwise studied. Not done: a screen reader, a GPU, Firefox or Safari.

**Handed on.** `docs/ROADMAP.md`, "What step 1 handed on", lists what each later step inherits: for step 2, the allow-list entries each fix
removes in its own commit (`LANG_ALLOW`, `ALLOW_TIMED`, `REVIEW_CITES`, `KNOWN_WARN`, `PLATEAU_04_RECORDED`); for step 3, the eye-level
warning, the hover's cost and the S-1 check; for step 5, the T-9 items not taken and the polish found here.

## 2026-10 · Final audit (docs/FINAL_AUDIT.md); no change to the build

**Status: for review. No source file, no data and no build changed:** `austerlitz-command-map.html` is the Stage 7D build, 1,764,002 bytes,
md5 `46773462faa1e1b9f4a4010e450e110a`; `npm run check:baseline` passes at the start and at the end; `check:data`'s reference is not moved.
The first commit records 7D (#47) as merged: Stage 7 is complete. The next owner decision is 125.

**What was written.**
- `docs/FINAL_AUDIT.md`. A one-page summary. Then the findings by dimension in `CLAUDE.md`'s priority order: historical, data, geographic
  and simulation integrity, software correctness, the tests, visual and UX quality with accessibility, performance, polish and the records.
  Then the comparison with `docs/VISUAL_AUDIT.md`, item by item; what was not verified and why; owner questions 125-141, each with a
  recommendation and its trade-off; and a proposed roadmap.
- `tools/audit/` (not bundled), the audit's scripts:
  - `size.js`, `scan-gaps.js`, `sheet.py`: no page.
  - `a11y-probe.js`, `perf-probe.js`, `state-probe.js`, `boot-probe.js`, `font-probe.js`, `mlfocus-probe.js`, `mlfocus-shot.js`: page probes, opened as the harness opens the page (`tools/stage7/lib.js`).
- `docs/audit-evidence/`: their outputs and every check's output, with a README.
- The code was read in six passes. Five were read-only reviewers; every finding kept was re-checked against the code, and those marked
  "measured" were reproduced in the page.

**Found (75 findings: 1 blocker, 21 major, 41 minor, 12 polish; each with evidence, reproduction and a proposed fix; none fixed).**
- **The blocker (H-1).** `SOURCE_NOTE` keeps three hours unresolved: Dokhturov's descent, Kamensky's turn and Rapp's counter-charge. On the
  day's main path they are shown as settled. The Kamensky event reads "Fact · Timing A · about 09:45", while his own A-graded record turns
  him at 08:45.
- **Majors, history.**
  - Drouet's reserve is drawn ahead of the assault at 08:45 (H-2).
  - The plateau label has no "derived" mark, and in phase 7 there is none anywhere (H-3, decision 119 (b)).
  - The first claim a visitor reads is an unlabelled interpretation (H-4).
  - The claim pill is the position's grade (H-5).
  - The narrative has no per-statement sources (H-6).
  - Soult's "twenty minutes" is graded three ways (H-7).
  - The overclaim scan reads 124 of 1,764 prose strings, and two of its own banned words are live outside it (H-8).
- **Majors, data and simulation.**
  - `check:chronology` judges a hand-typed table (D-1).
  - The grade check skips 30 of 32 formations (D-2).
  - "Whose eyes?" leaves enemy corps counters drawn (S-1).
  - Turning the dwell off and on while playing sends the clock back: 07:22 to 07:00, measured (S-2).
- **Majors, software.**
  - No message when three.js or WebGL fails, and no integrity attribute on the CDN script (SW-1).
  - Below 1080 px the rail can stand over the dispatch card (SW-2).
  - Off-screen panels stay in the Tab order: 42 tab stops in the hidden rail at 1024 px (SW-3).
  - The sources sheet is a modal without a modal's focus, and Esc ends the tour first (SW-4).
- **Majors, the tests.**
  - `check:visual` fails on the unchanged build on this machine: `narrow-390` measures 46.0% against its 46.8% baseline. The system fonts
    draw the timeline 2 px taller (Inter here; DejaVu Sans gives 46.89%) (T-0).
  - Page errors never fail a check (T-1).
  - The meres' check is a tautology (T-2).
- **Majors, accessibility.**
  - Single-key shortcuts with no off switch (A-1, WCAG 2.1.4).
  - Focus lands on 6 invisible map items in the first view (A-2, 2.4.7).
  - The timeline's targets are 11-22 px (A-3, 2.5.8).
- **Against `docs/VISUAL_AUDIT.md`:** of 26 items, 20 are resolved, 4 partly (the meres' outlines, the soft particles and ice marks, the
  scale bar's note, the serif) and 2 open (figure level of detail; the event glyphs and native tooltips). Every "should not change" item
  still holds, with the gaps named.

**Checks on this build (fresh container: 4 cores, headless Chromium with SwiftShader).**
- `npm run build`: the committed HTML equals the fresh build. `npm run check:baseline`: passes, at the start and at the end (md5
  `46773462…`, 1,764,002 bytes).
- `npm test`: "ALL 9 SUITES PASSED (and the height guard)" (5 min 2 s). `test.js` 588/588 appearance and 41/41 order-of-battle checks;
  `geo-test` 54 passed; `binding-test` 383 checks, 0 failed; `redteam.js` 0 findings, 1 standing warning; `runtime-test.js` 0 errors,
  "console.warn unique: 1" (its stub's false positive, T-1).
- `npm run check:data`: all 121 guarded declarations byte-identical to `archive/stage6b-7fc0f6c3.html`.
- `npm run check:chronology`: errors 0. There are 69 moves with a timed statement: 65 are consistent, and the four named conflicts are
  allowed.
- `npm run check:contrast`: 5,990 text elements, 105 pairs, 0 below AA, 0 below 10.5 px (6 min 58 s).
- `npm run check:visual`: **"STAGE0 FAILURES: 1"** (72 min 22 s). The failure is "narrow-390: unobstructed map 46.0%, below the baseline
  46.8%", and it reproduces alone at 46.03% (T-0).
  - The other 29 views meet every threshold, drop limit and baseline. The self-test passed 212 of 212, and so did every real-key check.
  - Nine console warnings, all Chromium's Canvas2D readback warning.
  - The 7D session passed the same build at 46.9%; the difference is the fonts installed on the machine, not the build.
- `node tools/stage6/verify-quotes.js` (network, not in the suite): 311 quotes. 107 were found whole, 32 with OCR differences, 41 on page
  images, 56 not found and 75 with no text layer.

**Not done, or open.**
- Nothing is fixed, by the brief. The findings wait on the owner's answers to questions 125-141.
- Not verified: a screen reader; a GPU (every frame cost is software WebGL); Firefox and Safari; real touch; forced colours; the historical
  claims against a library (the findings marked INFERENCE name the source that would settle them).
- Historical: nothing changes. The audit lists where each open question the records carry surfaces on screen, and whether it is marked
  there (`docs/FINAL_AUDIT.md` §2.1).

## 2026-10 · Stage 7D: the clock played between the opening's steps (docs/STAGE7_SPEC.md §3.5, §4.3-§4.5, §6; owner decisions 123, 124)

**Status: for review. Presentation only: no data declaration changes (`check:data` passes against `archive/stage6b-7fc0f6c3.html`).
`austerlitz-command-map.html`: 1,764,002 bytes, md5 `46773462faa1e1b9f4a4010e450e110a` (was 1,748,568 bytes, md5 `bebcfff6…`, Stage 7C).**
`check:baseline` moves to this build. The first commit records 7B (#45) and 7C (#46) as merged, and the owner's decisions 123 and 124.

**The decisions (§0.6).** After #46 the owner wrote: "Merged. Proceed with 7D and your recommendations." Decision 123 supersedes decision
116's "none in Stage 7": the clock plays between the opening's steps at **4x, the opening's own speed** (question 116's recommendation if
played stretches were wanted, a design value); the visitor's Play stays at the speed it had, ½× by default (decision 74). Decision 124: focus
on Next when the opening begins, as 7C built it (§4.1 had recommended Skip).

**Before building (fact).** `main` (`50db83c`, #46 merged) matched `check:baseline` (the 7C build, md5 `bebcfff6…`). The "before" of each step is
7C's `docs/stage7-evidence/7c-opening-probe.json`; Part A's played prototype (`opening-probe.json`, `played`; §3.5) is the "before" of the
stretches; `tools/stage7/opening-7d-probe.js` measured the "after" (`7d-opening-probe.json`, `7d-opening-sheet.jpg`).

**What changed** (`app.js`)
- **Next on a step but the last plays the clock** from that stop's clock to the next stop's at `OPENING.SPEED` (4x), as Play plays it: Follow
  (decision 78), the dwell at each event start (decision 75), the derived arrows drawn on (decision 83); the relief control as while Play plays
  (decision 56: disabled where a relief change is slow). The stop's theme is cleared while it plays. **When the clock reaches the next stop's clock that stop is
  applied as in 7C** (its theme, and its camera by the tour's 1.6 s glide from Follow's view), so every step's frame is still the stop's own and
  7C's limits hold. Stops 6, 7 and 8 are event starts (08:45, 11:00, 14:30), so each stretch dwells to a stop at its step.
- **While it plays**: the bar is headed "Opening, step k of n: the clock plays" (or "paused"), shows the next stop's title and, in its text,
  first "The day plays on to this step. Pause or Space stops it; Next goes straight there.", then the names of the events each dwell stops
  for (`EVENTS[].n`, the words the timeline caption shows, joined as it joins them; no other sentence). The Play/Pause button, and Space when
  no button has focus, pause and resume it (WCAG 2.2.2); **Next goes straight to the step**; Back returns to the stop it started from; Skip,
  Esc and every other way end the opening as in 7C, the clock stopped and the visitor's speed put back. A press on Play/Pause, and Space or
  Enter on it, no longer end the opening while it plays.
- **Announcements** (§4.3): one polite message as a stretch starts ("The clock plays on to step 2 of 4, 08:45. Pause stops it; Next goes
  straight there.") and one at the step, as in 7C; the phase announcements it crosses are folded (none is said while it plays).
- **Reduced motion** (§4.4): no stretch; Next is 7C's cut.
- **The card's primary reads "Begin (two min)"**, its title naming the played clock: the four stops' 168 words read in 42.4-63.0 s, the
  stretches take 44.8 s at 4x with 19 dwells, and five glides 8.0 s: 95.2, 103.2 and 115.8 s at 238, 200 and 160 words a minute. At 390 px
  "Begin (two minutes)" wraps inside its button (155 px beside "Explore on my own", 150, in a 308 px row) and would make the card 12 px
  taller, as 7C's first wording did; "Begin (two min)" is 128 px.

**Choices the plan did not settle (stated):** the step after a stretch is the tour stop's frame (Part A's prototype held Follow's view
instead); Next while it plays goes straight to the step rather than pausing (Space on a focused button presses it, the 3E rule; the
Play/Pause button and Space off a button pause); the bar's text names the dwell's events (the plan's "the dwell's caption in the bar").

**The stretches as built** (`tools/stage7/opening-7d-probe.js`: each begun by a real click on Next, run by the app's own tick in 50 ms steps;
a frame paused mid-stretch by the Play/Pause button's own toggle; Stage 0's thresholds on every frame)
| stretch (clock) | size | length at 4x (dwells) | lowest clearance / lifts | target speed, largest | drops, most (at) | phase announcements | mid-stretch frame: unobstructed / drops / map text, lowest / smoke / confidence / draw calls | arrival glide, lowest | the step after it: unobstructed / drops |
|---|---|---|---|---|---|---|---|---|---|
| to step 2 (04:00 to 08:45) | 1600 x 900 | 18.1 s (7) | 86.14 / 0 | 150 px/s | 11 (08:30) | 0 | 65.7% / 9 / 8.24 / 0.0% / 3.0% / 787 (paused at 06:31) | 46.19 | 64.0% / 7 |
| to step 3 (08:45 to 11:00) | 1600 x 900 | 11.2 s (5) | 47.42 / 0 | 150 px/s | 9 (09:20) | 0 | 65.7% / 8 / 8.63 / 9.6% / 5.6% / 837 (paused at 10:00) | 38.72 | 64.0% / 3 |
| to step 4 (11:00 to 14:30) | 1600 x 900 | 15.5 s (7) | 34.25 / 0 | 150 px/s | 14 (11:20) | 0 | 65.7% / 7 / 8.57 / 6.7% / 5.0% / 846 (paused at 13:00) | 94.49 | 64.0% / 4 |
| to step 2 (04:00 to 08:45) | 1280 x 720 | 18.2 s (7) | 86.17 / 0 | 150 px/s | 14 (08:40) | 0 | 55.6% / 11 / 12.06 / 0.0% / 4.7% / 787 (paused at 06:31) | 46.19 | 52.9% / 7 |
| to step 3 (08:45 to 11:00) | 1280 x 720 | 11.2 s (5) | 44.81 / 0 | 150 px/s | 10 (09:00) | 0 | 55.6% / 9 / 8.20 / 12.0% / 7.7% / 838 (paused at 10:05) | 38.72 | 52.9% / 3 |
| to step 4 (11:00 to 14:30) | 1280 x 720 | 15.4 s (7) | 34.17 / 0 | 150 px/s | 16 (11:20) | 0 | 55.6% / 9 / 8.62 / 8.3% / 5.2% / 846 (paused at 13:00) | 94.49 | 52.9% / 3 |

- Every mid-stretch frame and every step meets the Stage 0 thresholds the harness applies (darkness, map text at AA as rendered, smoke under
  25%, confidence marks under 20%). The steps after a stretch are 7C's frames: 64.0% / 52.9% unobstructed, drops 7, 3, 4 and 7, 3, 3.
- Part A's prototype (§3.5) took 18.2 s, 13.0 s and 19.1 s at 4x with the dwell at each stretch's end held whole; here each stretch ends as its
  last dwell begins (the step is applied there): 18.1, 11.2 and 15.5 s.
- **By real clicks and keys** (1600 x 900): Next plays at 4x toward step 2 (focus stays on Next); Space off a button pauses it (the clock still
  for 2 s, the heading "paused") and resumes it; the Play/Pause button likewise; Next while it plays goes straight to step 2 (08:45, ½× back);
  Back while it plays returns to step 2; Esc while it plays ends at 04:00, the Overview, Play focused, ½× back.
- **Reduced motion**: each Next a cut to its step, at its frame within 5 ms, nothing played.
- Under software WebGL a stretch takes many minutes of real time (one frame can take seconds); the harness therefore reaches each step by
  Next and Next again (straight there), and the stretches are measured by the app's own tick (the self-test, the probe, `runtime-test.js`).

**Tests** (none loosened; new or stricter)
- **Self-test** (212 checks, was 208): new, the played stretches (Next plays at 4x with the theme cleared; the bar's heading and title; its
  text its own words or one dwell's joined event names; one message as it starts and one at the step, no phase announcement besides; Pause by
  the toggle and Space off a button, the clock still while paused; Next, Back, Skip and a key while it plays; the visitor's speed back after
  every way); new at 1x, 4x and 10.33x, the stretches sampled (never under the floor, the target within 150 px/s, drops every ten clock minutes
  at most 19, each ending at its stop after a glide above the floor with no lift: 467 steps, drops at most 12). Stricter: the 7C opening check
  now runs each stretch to its arrival before it checks the step.
- **Harness**: the opening cases reach each step by Next and Next again (the frames, limits and baselines are 7C's); on `opening-2`, by real
  key presses, Enter on Next plays at 4x toward step 2, Space off a button pauses (the clock still for 1.5 s, the heading "paused") and resumes
  it, Enter again goes straight to step 2 with ½× back.
- **`runtime-test.js`**: the stretches run to their arrival (8,410 ticks of 100 ms), every way out while one plays (the clock stopped, ½×
  back, in place where it stood), Next and Back while it plays, reduced motion's cuts.
- **`css-test.js`**: `OPENING.SPEED` 4 (decision 123); Play still at ½× (decision 74); the Play/Pause button's pause while it plays; the
  folded announcements; the new words (no figure, clock, name or quotation).
- **`check:contrast`**: new state "opening-playing" (the bar while it plays, paused).

**Checks on this build**
- `npm run build`: fresh; the committed HTML is the build. `npm run check:baseline`: passes on this build (md5 `46773462…`, 1,764,002 bytes),
  moved from the 7C build.
- `npm test`: "ALL 9 SUITES PASSED (and the height guard)" (6 min 55 s); `binding-test`: 383 checks, 0 failed (no arrow drawer changed).
- `npm run check:data`: all 121 data declarations byte-identical (the reference not moved). `npm run check:chronology`: errors 0 (69 moves
  with a timed statement, 65 consistent, the four named conflicts allowed).
- `npm run check:contrast`: 5,975 text elements (was 5,747: the new state), 105 pairs, 0 below AA, 0 below 10.5 px (9 min 16 s).
- `npm run check:visual`: "STAGE0: all checks passed" (101 min 10 s): 30 views, the self-test 212 of 212; every opening case at its 7C
  values (63.2%, 64.0%, 64.0%, 64.0% and 70.4% unobstructed, drops 8, 7, 3, 4 and 7; 51.7% and 10 at 1280 x 720), `first-run` 63.4%,
  `narrow-390` 46.9%; on `opening-2` by real keys, Enter played at 4x toward step 2, Space paused it (the clock still, "paused") and resumed it,
  and ½× was back after Enter went straight to step 2.
- GitHub's checks on the pushed head: green.

**Not done, or open**
- The harness has no case mid-stretch: under software WebGL a played frame's clock depends on wall time; the probe's paused frames stand in.
- No screen reader was used; no GPU (the 4x stretches' real-time length on a visitor's machine is the simulated 44.8 s only where frames keep
  up: the tick caps each frame at 120 ms).
- Historical: nothing changes, and no new sentence is shown: the stretches put the dwell's event names in the bar as the timeline caption shows
  them. Among them, as Part A §3.5 recorded: 09:45 "Kamensky turns his brigade about and drives the French off the crest" (the unresolved
  `kamensky@3`, `kamensky@4`) and the interval "The Russian Guard takes the eagle of the 4th Line", whose hour is not established (`data.js`;
  decision 64): shown without their `why`, as in Play; the ice (15:00) is not reached. Stop 6's words still sit on the ceiling-flagged legs
  (`sthilaire@3`, `vandamme@3`).

## 2026-10 · Stage 7C: the opening, stills from the tour (docs/STAGE7_SPEC.md §3.4, §4, §5, §6; owner decisions 111, 112, 114-116, 118, 121)

**Status: for review. Presentation only: no data declaration changes (`check:data` passes against `archive/stage6b-7fc0f6c3.html`).
`austerlitz-command-map.html`: 1,748,568 bytes, md5 `bebcfff6ce5e85f9b13f9b5c3709d20e` (was 1,729,495 bytes, md5 `82337dd4…`, Stage 7B).**
`check:baseline` moves to this build. Built on the 7B branch: 7B (#44) was merged into the Part A branch, not `main`, and #45 brings its four
commits to `main`; until #45 is merged this part's pull request shows them too.

**Before building (fact).** The 7B branch (`f76cab9`) matched `check:baseline` (the 7B build, md5 `82337dd4…`). The "before" of each step is
Part A's `docs/stage7-evidence/opening-probe.json` (the same tour stops, applied by the tour's own `applyTour` in the probe's page); the
"after" is `tools/stage7/opening-7c-probe.js` on the built opening, driven by real clicks (`7c-opening-probe.json`, `7c-opening-sheet.jpg`).

**What changed** (`app.js`, `shell.html`, `style.css`)
- **`OPENING`, four tour stops by index** (decisions 114, 115): stops 1, 6, 7 and 8 (`OPENING.stops=[0,5,6,7]`). Each step is the tour's own
  `applyTour` for that stop (its clock, theme, camera, Follow on, the dispatch hidden), shown in the tour's bar with the stop's own title
  and text. A short path through the tour, not a second mechanism: the frames equal Part A's prototype of the same stops (below). The
  nine-stop tour is unchanged and stays in the tools.
- **Begun by the visitor** (decision 112): the first-run card's primary action now reads "Begin (a minute)" and begins it; a tools
  button, "Begin the opening", begins it again on a later visit (hidden while the card is open, whose primary action it is: at 390 px it
  would wrap the tools' row, 94 to 127 px). The length is a design value: the four stops' 168 words read in 42.4, 50.4 and 63.0 s at 238,
  200 and 160 words a minute, with five glides of 1.6 s (four steps and the end): 50.4, 58.4 and 71.0 s. The first wording, "Begin (about a
  minute)", wrapped inside its button at 390 x 844 and made the card 12.5 px taller: `narrow-390` fell to 45.6% unobstructed, below its
  46.8% baseline, and failed `check:visual`; the shorter words keep the card at 238 px there, as in 7B.
- **The bar**: headed "Opening, step k of n", with Back, Next ("Finish" on the last step) and Skip; its words in `LABELS.opening`
  (no clock, figure, name or quotation; `css-test.js`); a `role="region"` named by its count and the stop's title (the tour's bar too). No
  step advances by itself (§4.5); no clock is played between steps (decision 116); under reduced motion each glide is a cut.
- **How it ends** (decision 118; §4.1): Finish, Skip and Esc land on the end state: 04:00, Study on the Now tab, the Overview with Follow
  on, Play focused as the single next action, and the live message "The opening has ended. Play runs the day from 04:00." Any other key
  (which then does its own action; not Tab, Shift, "?" or \`), a press anywhere outside the bar and the "?" overlay, and the camera taken by
  a pan, orbit or zoom end it where it is: the clock and the camera kept, the stop's theme and plan cleared as leaving the tour clears them,
  focus moved only off the hidden bar (to Play after a key), and "The opening has ended here." "?" opens the overlay over the opening; Esc
  then closes the overlay, not the opening. `tourStep` is -1 after every end.
- **Keys and the live region** (§4.3, §4.6): the bar's ← and → step it (a row of `KEYS`, scope "bar", in the "?" overlay); Enter and Space
  press its focused button; Esc's row names the opening in its order. Each step says one polite message ("Step 2 of 4: The French strike,
  08:45."); the phase announcement a step causes is folded into it.

**One recommendation not followed, and why (stated for the owner).** §4.1 recommended the Skip button focused when the opening starts.
Built: focus on **Next**. Decision 112 made the opening something the visitor starts by pressing the card's primary action; with Skip
focused, the next Enter (the natural "go on") ends the opening the visitor has just asked for, and 7B already put focus on the tour's Next for
the same press. Skip is the next Tab stop and Esc skips from anywhere, from the first frame. Reversing it is one word in two places
(`focusId("tour-next")` in `closeFirst` and the tools' handler). Smaller choices the plan did not settle: a press outside the bar ends it
in place wherever it lands (Play, the tabs, the tools), not only on the map; the in-place ends clear the stop's theme as leaving the tour
does; the spine mark on the timeline names the tour stop during the opening.

**Per step, the opening as built** (`tools/stage7/opening-7c-probe.js`, fresh pages, real clicks; the harness's limits and baselines, set on
this build, decision 121)
| step (tour stop, clock) | size | unobstructed (case baseline) | drops (case limit) | map text, lowest ratio | solid black | smoke | confidence marks | draw calls / world pass | the bar (px) | glide, lowest clearance |
|---|---|---|---|---|---|---|---|---|---|---|
| step 1 (1, 04:00) | 1600 x 900 | 63.2% (63.2%) | 8 (8) | 8.50 | 0.000% | 0.0% | 3.5% | 753 / 20.4 ms | 187 tall, whole | 135.28, 0 lifts |
| step 2 (6, 08:45) | 1600 x 900 | 64.0% (63.9%) | 7 (7) | 7.48 | 0.000% | 2.6% | 4.4% | 736 / 15.2 ms | 164 tall, whole | 46.19, 0 lifts |
| step 3 (7, 11:00) | 1600 x 900 | 64.0% (63.9%) | 3 (3) | 8.48 | 0.000% | 3.9% | 3.5% | 713 / 50.9 ms | 164 tall, whole | 38.72, 0 lifts |
| step 4 (8, 14:30) | 1600 x 900 | 64.0% (63.9%) | 4 (4) | 8.27 | 0.000% | 4.1% | 6.4% | 763 / 43.9 ms | 164 tall, whole | 38.72, 0 lifts |
| after Finish (04:00, the Overview) | 1600 x 900 | 70.4% (70.3%) | 7 (7) | 8.28 | 0.000% | 0.0% | 2.8% | 756 / 17.9 ms | closed | 94.49, 0 lifts |
| step 1 (1, 04:00) | 1280 x 720 | 51.7% (51.6%) | 10 (10) | 8.50 | 0.000% | 0.0% | 4.5% | 755 / 30.9 ms | 187 tall, whole | 135.28, 0 lifts |
| step 2 (6, 08:45) | 1280 x 720 | 52.9% | 7 | 7.48 | 0.000% | 0.6% | 4.6% | 736 / 32.4 ms | 164 tall, whole | 46.19, 0 lifts |
| step 3 (7, 11:00) | 1280 x 720 | 52.9% | 3 | 13.33 | 0.000% | 1.2% | 4.5% | 720 / 40.1 ms | 164 tall, whole | 38.72, 0 lifts |
| step 4 (8, 14:30) | 1280 x 720 | 52.9% | 3 | 12.16 | 0.000% | 3.5% | 6.1% | 764 / 54.6 ms | 164 tall, whole | 38.72, 0 lifts |
| after Finish (04:00, the Overview) | 1280 x 720 | 62.9% | 10 | 8.50 | 0.000% | 0.0% | 2.4% | 756 / 17.2 ms | closed | 94.49, 0 lifts |

At 1280 x 720 the rows without a case of their own are held by the 1600 x 900 cases' second measure (the page resized, as for every case):
52.9% at steps 2-4 and 62.8% at the end. "Map text, lowest ratio" is the lowest contrast of any map text as rendered (AA needs 4.5).

- **Equal to Part A's prototype**: at both sizes every step's unobstructed share, drops and bar box are those of the same tour stop in
  `opening-probe.json` (1600 x 900: 63.2%, 64.0%, 64.0%, 64.0%; drops 8, 7, 3, 4; the bar 187 px tall at step 1, 164 after), and the draw
  calls identical (753, 736, 713, 763). World passes (15-55 ms) are software WebGL, comparable only within a run: step 4's was 114 ms in an earlier run of
  the same probe and 63 ms in Part A. In that earlier run one frame after a state change took 13 s (SwiftShader compiling), and a real click
  waited past Playwright's 30 s default; the presses' handlers take 10-28 ms, and the probe now waits as the harness does (180 s).
- **Glides**: 51 samples each, lowest clearance 38.72 units (into steps 3 and 4), no floor lift; the self-test samples every glide of the
  opening, both ways and to the end, at 1x, 4x and 10.33x (lowest 38.21, no lift).
- **The bar's text is whole** at every step and both sizes (nothing scrolled); every string shown is the stop's `TOUR` title and text or a
  `LABELS.opening` entry.
- **The ways out** (1600 x 900, real clicks and keys): Skip and Esc from each of the four steps land on 04:00, Study, the Now tab, the
  Overview with Follow on, focus on Play, the end message. A drag on the map at step 2 ends it in place
  (08:45 kept, Follow off, focus on the body); the key M at step 2 ends it in place and switches to the paper map (08:45 kept, focus on Play).
- **Reduced motion**: each step's camera at its frame within 5 ms of the press, nothing playing; Skip to the Overview within 5 ms, focus on
  Play.
- Phase 3's toast ("The sun of Austerlitz", `data.js`) shows at step 2, as at tour stop 6 (data; unchanged; checked on a page with its
  transitions on).

**Tests** (none loosened; new or stricter)
- **Self-test** (208 checks, was 204): new, the opening from the reopened card: each step its tour stop's clock, theme and camera
  (`stopClock`, `presetFrame(stopCam)`), Follow on, nothing playing; every string shown a `TOUR` field or a `LABELS` entry; one live message
  per step and no phase announcement besides; the bar's arrows reach the "opening" row (a dry run) and step it; Finish, Skip and Esc from every
  step to the end state; a drag on the map, a zoom and the key 1 end it where it is; "?" over it and Esc closing only the overlay; under
  reduced motion each step at its frame within 5 ms. New at 1x, 4x and 10.33x: the opening's glides (step to step both ways, every step to the
  Overview) above the floor. Stricter: the first-run check's primary action now begins the opening with focus on its Next.
- **Harness**: six new fresh cases, each reached by real clicks: `opening-1` to `opening-4` and `opening-end` at 1600 x 900, `opening-1-laptop`
  at 1280 x 720; Stage 0 thresholds; the confidence, skeleton and routes measures taken there as in every reading view (the first-run views
  stay exempt); each case's clicks must reach its step (or, after Finish, the end state). Their drop limits and unobstructed baselines are what
  this build measures there (decision 121; decision 62's method), never raised, never lowered: drops 8, 7, 3, 4 and 7 at 1600 x 900 and 10 for
  step 1 at 1280 x 720; unobstructed .632/.516, .639/.529 (steps 2-4), .703/.628 (the end, Study's own baselines) and .516/.516. By real key presses on the
  `opening-2` page: Esc from step 2 to the end state; the tools' button and Enter on the focused Next to step 2; Tab to Skip and Space to the
  end state.
- **`runtime-test.js`**: new, the opening forward, back (not past step 1), finished, and ended by each of five ways from every step (the end
  state or the clock kept, `tourStep` -1), then the tour; the first-run dry run's primary now begins the opening.
- **`css-test.js`**: new, the opening's eleven words in `LABELS` with no figure, clock time, quotation mark or name of a formation, commander
  or place; the card's primary words likewise; `OPENING.stops` the tour's 1, 6, 7, 8; the card's primary begins it; the bar a region named by
  its count and title, with its Skip; the bar's Next from the tokens; the tools' button standing down under the card; the arrows a row of
  `KEYS`; Esc's skip; the folded announcement.
- **`check:contrast`**: new states "opening" (the bar at step 2) and "opening-end".

**Checks on this build**
- `npm run build`: fresh; the committed HTML is the build. `npm run check:baseline`: passes on this build (md5 `bebcfff6…`, 1,748,568 bytes),
  moved from the 7B build.
- `npm test`: "ALL 9 SUITES PASSED (and the height guard)" (6 min 48 s); `binding-test`: 383 checks, 0 failed (no arrow drawer changed).
- `npm run check:data`: all 121 data declarations byte-identical (the reference not moved). `npm run check:chronology`: errors 0 (69 moves
  with a timed statement, 65 consistent, the four named conflicts allowed).
- `npm run check:contrast`: 5,747 text elements (was 5,253: the two new states), 105 pairs, 0 below AA, 0 below 10.5 px (9 min 41 s).
- `npm run check:visual`: "STAGE0: all checks passed" (102 min 50 s): 30 views, the self-test 208 of 208; `first-run` 63.4% / 52.1%,
  `first-run-laptop` 55.8% / 52.1%, `narrow-390` 46.9% / 52.1% unobstructed, all at or above their 7B baselines. Nine console warnings,
  the known Canvas2D readback warning among them. The first run on the "about a minute" wording failed one check (`narrow-390` 45.6%,
  above); the run reported is the one on this build.

**Not done, or open**
- §4.1's Skip focus (above): built as focus on Next; the owner may reverse it.
- The rail's note while the bar shows ("During the guided tour, its text is in the tour bar", `shell.html`) does not name the opening; true
  of it (the opening is a path through the tour), left unchanged.
- 7D (played stretches) is not built (decision 116). Decision 119 (b), a "derived" mark on the plateau label in every view, stays open. The
  URL fragment of decision 117 is not built.
- No screen reader was used: the region, the live messages and the focus are measured from the DOM and by real key presses in Chromium.
- At 390 x 844 the opening was not measured as a harness case (decision 122 records the first screen only); Part A measured tour stop 1
  there (the bar 227 px tall).
- Historical: nothing changes. The opening shows only `TOUR`'s tested text. Stop 6's words ("At about a quarter to nine Saint-Hilaire and
  Vandamme climb") sit on the legs `check:chronology` flags at the march-rate ceiling (`sthilaire@3`, `vandamme@3`; Part A §0.4 item 9):
  shown, unchanged, still open.

## 2026-10 · Stage 7B: the first screen (docs/STAGE7_SPEC.md §4, §5, §6; owner decisions 111-113, 117-120, 122)

**Status: for review. Presentation only: no data declaration changes (`check:data` passes against `archive/stage6b-7fc0f6c3.html`).
`austerlitz-command-map.html`: 1,729,495 bytes, md5 `82337dd43a45c7ee6e502605b667549d` (was 1,720,613 bytes, md5 `3dd7ca41…`, Stage 6D).**
`check:baseline` moves to this build. Built on the Part A branch (#43, not yet merged); its first commit records the owner's decisions 111-122
in the specification (§0.5: every recommendation of §7 accepted).

**Before building (fact).** The Part A branch (`ac14bfd`) matched `check:baseline` (the 6D build, md5 `3dd7ca41…`); Part A's
`docs/stage7-evidence/firstrun-probe.json` is the "before" of every table below, and `tools/stage7/firstrun-probe.js` measured the "after"
the same way (`7b-firstrun-probe.json`).

**What changed** (`shell.html`, `style.css`, `app.js`)
- **The card has one primary action and one way to stay** (decisions 111, 120): "Guided tour", drawn as a pressed button is, and "Explore on
  my own". The primary starts the guided tour (the nine stops, the tour's own words) until 7C's opening takes the button; 7C keeps the tour
  in the tools (sequencing, §0.5, not a new decision). "Watch the battle" is off the card (Watch is key 2 and the presentation switch, Play is
  Space and the Play button). The hint is off the card: the "?" overlay's "Pointer and touch" rows and the legend's control line already carry
  the same controls. The words are in `LABELS.firstRun` (3E's label table). The key (decision 108's words) is unchanged.
- **A modal dialog** (§4.2): `aria-modal="true"`, `aria-describedby` its key; focus on the primary action when it opens; Tab and Shift+Tab
  kept inside it (as the "?" overlay keeps them); Tab from outside it goes back in.
- **Closed where it stands** (§0.4 item 3, resolved): Esc, "Explore on my own", any other key (which then does its own action) and a press
  outside close the card with the camera, the clock and the Overview kept. Before, the Explore button called `setPhase(0)` and glided from the
  Overview (491 units) to phase 0's view (321). Focus after: Play, the single next action (decision 118's rule), after Esc, the stay button or
  a key; the tour's Next after the primary; released (not left on the hidden card) after a press outside.
- **Two keys behave as a dialog's**: with focus on the primary, Space and Enter press it (before 7B nothing was focused at load, so Space
  played the clock), and ← → do nothing (before, they closed the card and stepped the clock ten minutes; the Stage 3 rule that the arrows on a
  focused button leave the clock now applies to the card's buttons).
- **The Now tab under the card** (decision 113; §0.4 items 1 and 10, resolved): the rail shows the Now tab, not the order of battle, while
  the card is open; from 1080 px the dispatch shows there beside the card, with the plateau reading's "derived" tag on screen (decision 119
  (a)). Below 1080 px the dispatch is a card the first-run card would stand over (decision 58), and it stays hidden while the card is open
  (`body.firstrun-on:not(.docked) .dispatch`). `syncDock` no longer holds the Now tab back while the card is open. The legend stays hidden
  under the card, as before.
- No storage (decision 117): the card returns on every load; the URL fragment the recommendation left optional is not built.
- A comment corrected: "GUIDED TOUR — nine stops" (`app.js`; §0.4 item 4).

**Per first screen, before (6D) and after** (`tools/stage7/firstrun-probe.js`; `docs/stage7-evidence/firstrun-probe.json`,
`7b-firstrun-probe.json`, `7b-firstrun-sheet.jpg`)
| size | the card (x, y, w x h) | unobstructed | drops (limit) | map text, lowest | focus at load | the rail's tab |
|---|---|---|---|---|---|---|
| 1600 x 900 | 680, 550, 540 x 241 → 680, 599, 540 x 192 | 61.5% → 63.4% | 5 → 5 (12) | 8.64 → 8.64 | the body → the primary | Order of battle → Now |
| 1366 x 768 | 563, 418 → 563, 467; 241 → 192 tall | 53.2% → 55.8% | 4 → 5 (16) | 8.64 → 8.64 | the body → the primary | Order of battle → Now |
| 1280 x 720 | 520, 370 → 520, 419; 241 → 192 tall | 49.0% → 52.1% | 4 → 6 (16) | 11.98 → 11.98 | the body → the primary | Order of battle → Now |
| 1024 x 768 | 242, 418 → 242, 467; 241 → 192 tall | 67.9% → 71.4% | 4 → 5 (16, stated) | 8.65 → 8.65 | the body → the primary | (rail hidden) |
| 390 x 844 | 16, 335, 358 x 319 → 16, 416, 358 x 238 | 38.3% → 46.9% | 2 → 6 (no limit before 7B) | 12.36 → 8.04 | the body → the primary | (rail hidden) |

- **Drops** rise by one or two below 1600 x 900 (1366: the Pratzeberg; 1280: the Pratzeberg and the Goldbach; 1024: the Pratzeberg; 390: the
  Allied headquarters, the Fifth Column, Pratzen and Stare Vinohrady, where Santon and Zuran were dropped before): places and names the
  taller card covered, which the layer counts as under a panel, neither placed nor dropped, now compete for room (the effect 3C recorded for
  its smaller timebar). Within every limit. At 390 x 844 the plateau reading is now drawn ("THE PRATZEN · Allied ≈ 38,700"; Part A: the plateau
  was not named there at all).
- **The ways out** (each on a fresh page at 1600 x 900 by a real click or key press): the primary starts the tour (focus on its Next); the stay
  button, Esc and the key 2 close the card in place (the camera at the Overview, 491.4 units), focus on Play; a click on the map closes it in
  place, focus released; "?" opens the overlay over the closed card (focus on its close button); Space presses the focused primary; → and Tab
  leave the card open (Tab cycles its two buttons); a reload brings the card back, nothing stored.
- Under reduced motion and on a visitor's page (no `?harness=1`) every measure is the 1600 x 900 one.

**Tests** (none loosened; new or stricter)
- **Self-test** (204 checks, was 203), new: the first-run card reopened at 04:00 in Study: its dialog attributes; focus on the primary; Tab,
  Tab, Shift+Tab inside it; docked, the Now tab, the dispatch shown in the rail and not under the card, a "derived" tag on screen; Esc, the
  stay button and a press outside close it with the camera and the clock unmoved, focus on Play after Esc and the button and on no hidden
  element after the press; the primary starts tour stop 1 with focus on its Next; the state restored after.
- **Harness**: the Stage 0 check "first-run card stacked on the dispatch card" is an overlap test of the two boxes (`measure.js` gives them),
  its reason in `thresholds.js`: written when the dispatch floated, it now fails when the card stands over the dispatch, which below 1080 px
  (the card centred over the dispatch card's place, overlapping by 214 x 192 px at 1024 x 768) it still does, as before; with the boxes
  missing it fails as before. Stricter: Study shows the Now tab also while the card is open (the first-run views were exempt). New: by real key
  presses on the fresh `first-run` page, focus on the primary at load, three Tabs and a Shift+Tab inside the card, Esc closing it in place with
  focus on Play. New case `narrow-390` (decision 122): the first screen at 390 x 844, its timeline's height recorded, not held to 92 px
  (`TIMELINE_RECORDED`); its drop limit and unobstructed baselines are what this build measures there (decision 62's method), never raised.
  `first-run` and `first-run-laptop` are kept as they were; their unobstructed baselines are raised to this build's, rounded down to 0.1
  point (the 3B/3C method), so no later part can give back the smaller card's gain.
- **`runtime-test.js`**: new, a dry run of each way out (the tour; in place; a press outside): the card closes, the primary starts the tour,
  the in-place ways leave the camera and the clock.
- **`css-test.js`**: new, the card a modal dialog described by its key; its two buttons, the primary and the stay, with their words from
  `LABELS`; no hint and no "Watch the battle"; its buttons at least 24 px high (WCAG 2.2, 2.5.8); the docked dispatch not hidden under it, the
  undocked one hidden.
- **`check:contrast`**: unchanged states; its first state now reads the Now tab and the dispatch under the card (5,253 elements, was 5,354:
  the order of battle's rows are no longer read in it).

**Checks on this build**
- `npm run build`: fresh; the committed HTML is the build. `npm run check:baseline`: moved to this build; passes.
- `npm test`: "ALL 9 SUITES PASSED (and the height guard)" (runtime-test: "first run: opened and closed by each way out ... OK"; css-test's
  first-run checks pass).
- `npm run check:data`: all 121 data declarations byte-identical (not moved). `npm run check:chronology`: errors 0.
- `npm run check:contrast`: 5,253 text elements, 105 pairs, 0 below AA, 0 below 10.5 px (8 min 41 s).
- `npm run check:visual`: "STAGE0: all checks passed", 24 views, the self-test 204 of 204, run twice: first without limits for
  `narrow-390` (68 min 43 s), which set them and the raised first-run baselines from its report (`check:report` then passed on that report),
  then again with the committed thresholds (70 min 1 s). `first-run`: 63.4% / 52.1% unobstructed, 5 drops, the real-key test (focus on the
  primary; Tab, Tab, Tab, Shift+Tab: the stay button, the primary, the stay button, the primary; Esc: closed, the camera unmoved, focus on
  Play); `first-run-laptop`: 55.8% / 52.1%, 5 drops; `narrow-390`: 46.9% / 52.1%, 6 drops, its timeline 172 px (recorded). Nine console
  warnings; the six printed are the known Canvas2D readback warning, as on 6D.

**Not done, or open**
- 7C, the opening (decisions 114-116, 118, 121): the primary's action, the bar, its keys and live messages, its harness cases. Until then the
  primary starts the nine-stop tour.
- Decision 119 (b), a "derived" mark on the plateau label itself in every view, stays open (Part A §6).
- The URL fragment of decision 117 is not built.
- No screen reader was used: the dialog's behaviour is measured from the DOM and by real key presses in Chromium.
- At 390 x 844 the timeline still wraps to 172 px (recorded, decision 122).
- Historical: nothing. The card's key is decision 108's words; the opening's text is 7C's, from `TOUR` by index.

## 2026-10 · Stage 7 Part A: first run and opening sequence, the specification (docs/STAGE7_SPEC.md); no change to the build

**Status: for review. No source file, no data and no build changed:** `austerlitz-command-map.html` is the Stage 6D build, 1,720,613 bytes,
md5 `3dd7ca41f73d0e5ffcfe5fa64adc5f51` (`check:baseline` passes); `check:data` passes against `archive/stage6b-7fc0f6c3.html` (not moved).
The first commit records Stage 6D as merged (#42): Stage 6 is complete. The next owner decision is 111.

**What was written.**
- `docs/STAGE7_SPEC.md`: the decisions that bind Stage 7 and the records' statements about it, quoted (§0); today's first screen, read
  from the code and measured at five sizes, under reduced motion and on a visitor's page, with every way out of the card, the ways into
  the day counted and every test that touches the first run (§1); the text an opening could use, with file, line, reading time and the
  suites that read it, and a definition of "tested" (§2); four openings prototyped with the app's own machinery and measured (§3);
  accessibility and control (§4); the first screen after the opening or the card (§5); a design in parts 7B-7D with their tests, and what
  the records leave open after Stage 7 (§6); twelve questions, 111-122 (§7).
- `tools/stage7/` (not bundled): `text-inventory.js`, `firstrun-probe.js`, `opening-probe.js`, `lib.js`. `docs/stage7-evidence/`: their
  outputs and a README.

**Found (fact; each stated in §0.4 or §1, none resolved).**
- **Decision 55 does not hold on the first screen**: while the card is open the rail shows the Order of battle (`app.js:5274`), which 3B
  kept so that the Stage 0 check could stay; and **the check no longer describes what it tests**: from 1080 px it fails on the Now tab's
  dispatch in the rail, which cannot lie under the card (measured: with the dispatch shown it fails, the boxes 380 px apart).
- **"Explore" is two things**: the record (`CHANGELOG.md:3568`) says a click or key outside the card is an Explore that does not move the
  camera; the Explore button itself calls `setPhase(0)` and glides from the Overview (491 units) to phase 0's view (321).
- **The card is a dialog without a dialog's focus**: no `aria-modal`, no `aria-describedby`, focus never moved into it; eight Tabs from a fresh page
  reach the presentation switch and the rail's rows, never the card; after any way out but "?" focus is on the body.
- **Every load is a first run**: nothing is stored anywhere in the sources; the card returns on reload.
- **A derived figure with no "derived" tag on screen**: the first screen names the plateau only by its derived reading ("THE PRATZEN ·
  Allied ≈ 38,700"); the place names Pratzen, Pratzeberg and Stare Vinohrady are dropped at the Overview's distance, card or no card; while
  the card is open every "derived" tag is hidden (`style.css:611`, `:317`), against the audit's "should not change" item.
- **The card stands over the battle's south**: decision 61 frames the battle without it, so it covers Kienmayer, Dokhturov, Telnitz,
  Sokolnitz, Augezd and the meres at 1600 x 900, eight formations and nine places at 1280 x 720.
- **Tour stop 4 drops 14 map items at 1600 x 900 (20 at 1280 x 720)**, above the first-run limits; no harness case holds a tour stop's frame.
- **The records' counts**: `app.js:3615` still says the tour has eight stops (Stage 3 Part A found it); `analysis.js:341`'s "about twelve
  minutes" is not measured (the nine texts read in 2 min 17 s at 200 words a minute).
- **The key's last clause** ("and it decides the battle") is an interpretation no overclaim scan reads.
- At 390 x 844 the timeline wraps to 172 px and the plateau is not named on the map; no harness case is narrower than 1024 px.

**Measured (the openings; design values for the measurement).** All nine tour stops meet every Stage 0 threshold but stop 4's drops; every
glide between them stays at least 38.7 units above the drawn ground with no floor lift; stills through stops 1, 6, 7 take 42.9 s at 200 words a
minute (1, 6, 7, 8: 56.8 s); the clock played from 04:00 to 11:00 under Follow with the dwell takes 106.3 s at ½× (31.2 s at 4x); the end
states meet the 3C baselines (Study 70.4% / 62.9%, Watch 89.8% / 87.2%). Details: `docs/STAGE7_SPEC.md` §1, §3, §5.

**Checks on this build (unchanged).**
- `npm run build`: fresh; the committed HTML is the build, unchanged. `npm run check:baseline`: passes (md5 `3dd7ca41…`, 1,720,613 bytes),
  at the start and after the last commit.
- `npm test`: "ALL 9 SUITES PASSED (and the height guard)" (3 min 55 s; tour stop 4's figures 39,000 and 19,000 against the live 38,700 and
  19,300, stop 5's 73% and 3% against 73.4% and 2.1%: agree).
- `npm run check:data`: all 121 data declarations byte-identical (the reference not moved). `npm run check:chronology`: errors 0 (69 moves
  with a timed statement, 65 consistent, the four named conflicts allowed).
- `npm run check:contrast`: 5,354 text elements, 105 pairs, 0 below AA, 0 below 10.5 px (7 min 19 s).
- `npm run check:visual`: "STAGE0: all checks passed" (46 min 26 s): 23 views, the self-test 203 of 203; the first-run views as measured
  in §1 (61.5% and 53.2% unobstructed, 5 and 4 drops). Nine console warnings; the six printed are the known Canvas2D readback warning.
  A first run was stopped by the session's 30-minute background limit after the probes, running beside it, had slowed it; the run reported
  is the second, alone.

**Not done, or open.**
- Nothing is implemented; the prototypes' durations, speeds and reading rates are design values for the measurement.
- Frame costs are software WebGL only; no GPU, no device, no screen reader was used (the ARIA findings are read from the DOM).
- Historical: nothing changes. The opening proposed shows only `TOUR`'s tested text; the disputes under two of its moments (§0.4 item 9) stay
  open.

## 2026-10 · Stage 6D: the standards from the appearance table (docs/STAGE6_SPEC.md §6.3; owner decisions 98, 105, 106)

**Status: merged (#42) at `b1cb13f`; with it Stage 6 is complete. Presentation only: no data declaration changes (`check:data` passes against `archive/stage6b-7fc0f6c3.html`).
`austerlitz-command-map.html`: 1,720,613 bytes, md5 `3dd7ca41f73d0e5ffcfe5fa64adc5f51` (was 1,698,904 bytes, md5 `07c61c82…`, Stage 6C).**
`check:baseline` moves to this build. With it come 6C's last four commits, which #41 was merged without (see the 6C entry). With 6D, Stage 6
is complete.

**What changed (presentation; the rules derived from `appearance.js`, the design decisions labelled).**
- Who carries a standard and how many (`kitStdRule`): each class's colours entry, per drawn battalion or squadron (a drawn unit stands for
  several real ones; the count is the table's per unit): one French eagle per battalion and squadron, two Russian colours per battalion, one
  Russian standard per dragoon or cuirassier squadron, one Austrian standard per two squadrons, one Grenz colour per battalion. None where the
  table shows none or gives none (the batteries, the headquarters and their escorts, Oudinot's grenadiers réunis, the Wiener Jäger, the Russian
  jägers, hussars, uhlans and Cossacks, the Mamelukes); none where it is disputed whether they were carried in the field (Kellermann's
  hussars: by regulation sent to headquarters, Morvan saying they were not); none where how many is not established (the Russian Guard
  cavalry; a note has the Chevalier Guard's left in the town of Austerlitz). The Austrian infantry's count is disputed (one per battalion by
  the decision of 20 June 1805, Wrede; two until 1808, Dolleczek): one per battalion is drawn, the smallest either side gives (`KIT.carry`,
  a design decision). 148 standards on the field (6C: 56, every block one to three of its nation's). A detachment's battalions take their
  standards with them.
- The cloths (`flagTexture`): painted where a claim graded A or B gives the pattern: the French 1804 model ("a white central lozenge, the four
  corner triangles alternately red and blue", Regnault, B) for the line, the Guard and the heavy cavalry, whose models name it; the Austrian
  ordinary colour (imperial yellow, the black double eagle, Dolleczek, B) for the line, the Grenz and the cavalry. Design decisions: which corner
  colour lies at the staff's top is not sourced, drawn blue; the eagle simplified to one silhouette; no number, wreath or inscription; the
  Austrian flame border and the white Leib colour (one per regiment) not drawn. Every other cloth is plain in the nation's symbol colour: the
  Russian infantry's pattern is `SOURCE_NOTE`'s open question (decision 105), the Russian cavalry's (C) and the Guard's (disputed) not settled,
  the Italian Royal Guard's not found. Counted: 57 lozenges, 16 ordinary colours, 74 plain Russian cloths, 1 plain French.
- The height (decision 106; `kitStdShape`): the staff's top, with its finial, over the man to his hat's top (`MAN_FOOT`, 1.635 units).
  Russian standards on foot: a 3.20 m staff and a 0.244 m spearhead over a recruit of 1.60 m (A), drawn 3.270 + 0.249 units, ratio 2.1525
  with the spearhead (2.000 for the Guard, whose entry reads no finial); the spearhead's socket overlap is not stated, so it is drawn on the
  staff's end, the upper bound. Austrian standards on foot: 2.85 m over 1.65 m, drawn 2.824 units, ratio 1.7273; the finial's size not read,
  none drawn. Both divide by a minimum stature (an inference: the drawn staff is if anything long). France (no staff read) and every mounted
  standard (no cavalry staff read): the provisional 1.6 over the figure's top, finial included, as since 2B, its wording corrected in the
  sources sheet (the figure's top is the bayonet's tip, about 1.94 times the man; mounted, the rider's hat).
- The cloth's size: where staff and cloth are both measured (Russian and Austrian infantry), at its measure against the staff: the Russian 1.451
  units square, its lower edge at 1.82 (above the hats, below the bayonets' tips); the Austrian 1.595 x 1.407, its lower edge at 1.42, among the
  ranks: the trade-off decision 106 accepted (question 11: the cloth below the bayonets' tips, which the 2B rule had avoided). Elsewhere the
  cloth's drop of 2B (0.853 units, a design value) in its sourced proportion (the French 81 cm square, also for the Guard's and the cavalry's
  eagles from the line model; the Austrian cavalry's 71 x 63; the Russian dragoons' and cuirassiers'), else the generic 2.4 : 1.4.
- The finials: where the entry reads one with its size: the Russian infantry's spearhead (from `STANDARD_MEASURES`), the French infantry's and
  heavy cavalry's eagle ("the gilt eagle, 20 cm high", in proportion to the 81 cm cloth): 119 finials, gilt, a four-sided point (design).
- The dip is kept (0.95 rad while broken, captured, encircled or repulsed).
- The legend's standards row ("painted where the pattern is sourced (French eagles, Austrian colours), else plain in the nation's symbol
  colour"); the sources sheet's "How the standards are drawn" (counted from the table and the blocks) and its corrected ratio line; the
  dossier's "Standards drawn" per class: how many and by what rule, the painting, the height rule, or "none" and why.

**Tests.**
- The self-test (203 checks, was 200): the standards' counts as the table rules, derived in the check; the paintings, sampled on the canvases;
  the cloths' proportions, their measure against the staff, the finials on the staffs' tops, the dip's 0.95 rad from the matrices and through a
  real "broken" status (Kamensky, phase 6); the legend's rows. The ratio check of 2B ("pole top / figure height is the provisional ratio 1.6 for
  every block") is replaced by decision 106's rule at the same tolerance (0.01) at 1x, 4x and 10.33x: the sourced ratio for the Russian and
  Austrian standards on foot, the provisional 1.6 for the rest (a decided rule, not a weaker check). The first commit of 6C's plain-cloth check
  is replaced by the painting check.
- `css-test.js`: a painting only where the model is a claim graded A or B and the painting's source entry gives the pattern at A or B; every
  `KIT.flag` colour a word of the claim it draws; a lower bound only on a disputed count.
- `runtime-test.js`: a dry run of the standards (148, none on headquarters or batteries, a detachment's taken with its battalions).
- The harness's standards' foot check is unchanged (one pole mesh per block, the pole geometry as before).

**Measured against the 6C build** (`tools/stage6/compare-6d.js`; `docs/stage6-evidence/compare-6d.md`, `compare-6d-sheet.jpg`)
- Solid near-black, mean luminance, map text, drops and the smoke: within the thresholds in all 20 views, as on 6C. Solid near-black unchanged
  in every view; mean luminance within 0.3, except the closest orbit (75.2 to 73.8); the lowest map text contrast unchanged or higher
  (`pratzen-low-10x` 7.68 to 7.94, the closest orbit 11.73 to 12.58), none below AA; drops identical; the smoke's shares identical.
- The standards' cloths in view: 2.5-4.7 times as many (the Overview 55 to 142, `close-sokolnitz` 22 to 70, `pratzen-low` 22 to 62, the eye
  level 3 to 14). Their size on screen: the median width about as before (the Field vantage 6.3 to 5.8 px, the close views 24-37 to 21-35),
  taller (heights 5.3 to 7.3 px in the Field vantage, 16.2-22.3 to 24.6-33.7 in the close views): the square French and Russian cloths in place
  of the 2.4 : 1.4 ones. In the closest orbit a Russian colour stands in front of the eye (1,281 x 1,341 px, the largest), covering much of the
  view's right side and halving the confidence marks' share there (0.0325 to 0.0171): the harness's thresholds hold, and the camera's floor
  keeps the eye out of the ground, not out of a standard. A consequence of the sourced counts (two colours per Russian battalion) and heights,
  stated, not designed away.
- The confidence marks' share otherwise within 0.011 (fewer marks seen behind the cloths); what changes on screen 0.03-4.4% of the free
  rectangle (44% in the closest orbit); nothing in the 1x and paper-map views.
- The world pass (software WebGL, median of 15 frames): 0.8-13.5 ms (6C 0.8-9.9), noisy as before; draw calls +21 to +24 in every view with
  standards (+3 at the eye level) (one cloth mesh per painting, the finials' mesh).
- Every block's standards on both builds, per class with its rule, painting, height and cloth: `compare-6d.md`; the sheet: the close views and
  the closest orbit, before and after.

**Checks on this build**
- `npm run build`: fresh; the committed HTML is the build.
- `npm test`: "ALL 9 SUITES PASSED (and the height guard)" (the css-test kit rule with the standards, the runtime dry run among them).
- `npm run check:visual`: "STAGE0: all checks passed" (52 min 4 s): 23 views, the self-test 203 of 203; solid near-black within the limit in
  every view (at most 4 blocks, `pratzen-low`, as on 6C); the day's light sweep 0.000% in 18 samples, 0.007-0.014% in 6 (6C: 17 and 7); the
  standards' foot on the ground in every view; the five known Canvas2D readback warnings.
- `npm run check:contrast`: 5,354 text elements, 105 pairs, 0 below AA, 0 below 10.5 px (5 min 51 s).
- `npm run check:data`: all 121 data declarations byte-identical (not moved). `npm run check:chronology`: errors 0.
- `npm run check:baseline`: passes on the moved baseline.

**Not done, or open**
- The pattern of the Russian infantry's colours (decision 105); the Russian cavalry's and Guard's patterns; the Austrian flame border and Leib
  colours; which French corner colour lies at the staff's top; the French and cavalry staffs (the provisional 1.6 stays there).
- The Russian Guard cavalry's standards: the count is not established, so none are drawn.
- Historical: the narrative's "45 standards" (Napoleon's claim) and the 6B data questions stay open.

## 2026-10 · Stage 6C: the figures by class from the appearance table, and identity by symbology (docs/STAGE6_SPEC.md §6.2, §6.4; owner decisions 97-104, 107-110)

**Status: merged (#41) at `42fa1ba`; its last four commits (`CONF.none`, the final baseline, the resumable comparison and its results) come
with 6D (#42). Presentation only: no data declaration changes (`check:data` passes against `archive/stage6b-7fc0f6c3.html`).
`austerlitz-command-map.html`: 1,698,904 bytes, md5 `07c61c8212917907cf68d1c35a8b941b` (was 1,661,910 bytes, md5 `7fc0f6c3…`, Stage 6B).**
`check:baseline` moves to this build.

**In order.** First §6.4's honest drawing (decision 110 makes it 6C's first commit), then the figures by class and identity together, as
§6.2 asks ("Identity changes in the same part, because it is this part that makes the coats stop meaning nations"), then the measurements.

**What changed: the standards (§6.4; decision 98).** Each standard is a plain cloth in its nation's symbol colour (`NATION`'s fill, the
counters' colour), with the faint lines of the old cloth, one texture per nation (`flagTexture`). It replaces three patterns no read source
gave: the French vertical tricolour (the 1804 lozenge was carried in 1805, §6.6), the Russian "green colour with a white cross" (the pattern of
the Russian infantry's colours is `SOURCE_NOTE`'s open question, decision 105) and the Austrian white, gold border and black disc. Who carries
a standard, how many and the 1.6 ratio are unchanged: 6D's.

**What changed: the figures by class (decisions 99-104, 109).**
- `KIT` (`app.js`), the drawn appearance, every value a design decision (decision 102), never a claim: one drawn colour per colour class of
  `APPEARANCE_VOCAB` (dark blue `#2C3B67`, blue `#3E5C9F`, sky blue `#82A5C8`, dark green `#2F4A37`, green `#3D6B3E`, light green `#6F9A5C`,
  white `#E3DED0`, red `#A4362D`, brown `#6B4B34`, grey `#8B8880`, straw `#CDB567`, turquoise `#3F9D97`, black `#2E2B27`, buff `#C8AE7D`):
  a mid value of the colour the class names, no dye measured, none darker than decision 84's black; the materials (skin, the figures' black,
  wood, metal, leather, the generic legwear's one neutral `#BDB8AC`, all as before); one low-poly shape per headgear class settled at A or B
  (bicorne worn crosswise, shako with its peak, bearskin, metal helmet with crest and mane, crested helmet, czapka, fur cap, turban), drawn in
  the figures' black, the metal helmet in metal: a headgear's colour is not classed by the table, so it is not drawn (the dossier gives the
  source's words, e.g. the Hessen-Homburg hussars' "Hellblaue Csako"); the cuirass for the French cuirassiers (metal) and the Austrian
  cuirassiers (black, "schwarz lackirte Kürasse"); horses one brown, black only for the Guard horse grenadiers (B, uncertain; decision 109);
  guns, limbers, tents and poles one colour for every army, as before.
- Each block's drawn units take classes from `appearanceOf` (decision 100): its battalions or squadrons by the largest-remainder rule on its
  composition's shares within the mount group, in the composition's order; the headquarters' escorts and Kienmayer's row of riders one rider
  at a time; the gun crews their class. A value is drawn where a claim graded A or B settles it in a class `KIT` draws; otherwise generic
  (decisions 98, 103, 105): the coat in the nation's symbol colour, legwear in the one neutral, the plain cap drawn before Stage 6. Of the
  table's 49 classes, 37 have their coat drawn, 28 their legwear and 34 their headgear.
- Gunners in their own figure (no musket or pack). Design decisions, not claims: the two mounted officers of each infantry formation generic
  (no class describes them); the skirmish screen in the formation's largest foot class; a class's battalions side by side in the
  composition's order (where a regiment stood within its division is not drawn as a claim).
- Classes too small for one drawn unit are listed in the dossier, not drawn: Legrand's one generic battalion (of 11), the 5e chasseurs in
  Kellermann's three drawn squadrons (4 regiments), Przybyszewski's jäger battalion (1 of 16, 7 drawn), the Russian cuirassiers of the Fifth
  Column (500 of 5,600 men, 6 squadrons drawn), and Kienmayer's Merveldt uhlans and other cavalry detachment (0.25 and 0.5 of 32.75
  squadrons, 8 riders drawn).
- The Fifth Column's Austrian share is now its composition's: one of its six drawn squadrons in the Austrian cuirassiers' dress (16.7%;
  composition 19.6% by men), where 6B drew 18.3% of its riders in the Austrian symbol colour from `f.mix` (`data.js`, unchanged and still
  guarded; the drawing no longer reads it).
- Removed: `formationAtlas` and `pushBox` (dead since the figure kit) and the seven shared geometries no mesh drew (`GEO.shako`, `bear`,
  `musket`, `sabre`, `body`, `horse`, `rider`; §1.1).
- What is drawn, from the table (fact: counted on the build at 09:30 by the self-test): 3,266 figures in 106 class sets, 33 of them generic;
  headgear by figures: shako 1,174, bicorne 980, the plain cap 884, bearskin 74, metal helmet 70, crested helmet 52, fur cap 12, czapka 10,
  turban 10.

**What changed: identity by symbology (decisions 97, 107, 108; §4.3).**
- The legend: the nation rows read "counters: French / Russian / Austrian" and show only where counters are drawn; where figures are drawn,
  "figures: dress as sourced (source and grade in the dossier), else the nation's symbol colour and a plain cap" and "standards: plain cloths
  in the nation's symbol colour, patterns not yet drawn"; where the landscape draws names, "beside a name: its side, French or Allied" with
  the two side swatches; the footprint rows also under decision 107's footprint.
- The first-run key (decision 108; §4.3 item 4's words): "French formations are marked in blue and the Allies in amber: on their names, their
  counters and the ground beneath them, and on the movement arrows. The high ground in the centre is the Pratzen plateau, and it decides the
  battle." Was: "Blue is the French army. The Allies are green for Russia and white for Austria, and their movement arrows are drawn in amber."
- A side cue always (decision 107): with Position confidence off, the crisp footprint in the side's colour (grade A's mark, whatever the
  grade) stays under every formation drawn as figures, in Study, Watch and Clean; with it on, the grade's mark as before.
- The sources sheet: "How the troops are drawn" (counted from the table and `KIT`) and "The appearance table's sources" (its 62 works).
- The full dossier's "Dress": each class of the composition with how many units it has and how many are drawn, its coat, legwear, headgear,
  cuirass, greatcoat (decision 101: "may have been worn" where the sources do not settle it), facings (decision 104: described, not drawn),
  horses and colours carried, each as the source gives it with its grade, label and source, and how it is drawn ("drawn generic" where it is);
  attached troops of another arm listed, not drawn; the composition's note.

**Tests.**
- The self-test (200 checks, was 194): figures (every figure as its class's claims say, derived in the check from `appearance.js` and `KIT`:
  the coat's instance colour `KIT`'s value times the jitter, or the nation's symbol colour where unsettled, never a nation's colour for a
  sourced coat; legwear, headgear, cuirass, horse and the gunner's figure in the fixed geometry; every settled headgear class has a shape);
  the composition rule (each class within one unit of its share); the side cue (Study, Watch, Clean, Position confidence on and off, from the
  Pratzen vantage and close on the Pratzeberg); the legend's rows; the dossier's Dress; the standards' plain cloths. The first-run check's
  words are the decided ones (decision 108), replacing "Blue is the French army", "green for Russia", "white for Austria": a decided rule, and
  it now also checks the side swatches and that the nation rows say they colour the counters.
- `css-test.js`: every `KIT` cloth colour a colour class of `appearance.js`, every settled coat, legwear, headgear and horse class drawn, the
  cuirasses exactly where recorded, nothing below decision 84's black; Stage 4E's exemption of `formationAtlas`, `figKit`, `makeBlock` and
  `flagTexture` from the palette rule ended (their colours are `KIT`'s or `NATION`'s).
- `runtime-test.js`: a dry run of the kit by class for the 32 blocks (106 class sets, 132 battalions and squadrons each a class of their
  composition). Its Stage 5B assertion "spatial confidence switched off, still drawn" is replaced by decision 107's rule (owner decision; the
  spec's question 12: "the toggle then switches the grade's encoding, not the ground mark"): switched off, no graded mark is drawn, and every
  formation drawn as figures has the side footprint and nothing else does.
- The float checks (`tools/visual/measure.js` and the self-test's `figureError`) read every kit geometry from the app (`kitGeos`), not five
  names; `tools/stage2/height-sites.js` classifies the new self-test site (`kitDayChecks`, test).
- The harness's position-confidence share (Stage 5B): its frame "without the marks" set Position confidence off, which since decision 107
  still draws the side footprint, so the measured share fell (the marks were compared with footprints) and the limit `CONF_SHARE` would have
  bounded less than it says. That frame now also sets `CONF.none`, a measurement switch the app never sets, which draws no mark but the 1x
  footprint: the share is measured as on 6B (found by the comparison below; the first comparison run, with the old frame, gave shares about
  half of 6B's in every view, e.g. `overview-field` 0.0431 against 0.025).

**Measured against the 6B build** (`tools/stage6/compare-6c.js`; `docs/stage6-evidence/compare-6c.md`, `compare-6c-sheet.jpg`)
- Solid near-black, mean luminance, map text, drops and the smoke: as on 6B in all 20 views. Solid near-black 0 in 16 views, `pratzen-low`
  0.0002 as before, `pratzen-orbit-min` 0.00015 (6B 0.0003); mean luminance within 1.3 (the closest orbit 76.5 to 75.2); the lowest map text
  contrast within 0.32 (`pratzen-low-10x` 8.0 to 7.68), none below AA; drops identical in every view; the smoke's shares identical.
- The confidence marks' share, against the view with no mark at all: as on 6B within 0.002 in every view (`overview-field` 0.0431 / 0.0433,
  `selected-formation` 0.1503 / 0.1509), except at the eye level (`eye-zuran` 0.0004 / 0.06): on 6B the observer's own side's marks were
  drawn in both frames (Position confidence off left them, decision 91), so the old measure missed them; `CONF.none` removes them too, so the
  share now counts every mark. Decision 107's side footprint, Position confidence off: 0.0155-0.0914 of the free rectangle (0.06 at the eye).
- What changes on screen: 0.13-5.9% of the free rectangle in the views with figures, 20.5% in the closest orbit (coats, headgear and the
  cloths); nothing in the 1x and paper-map views.
- The world pass (software WebGL; the median of 15 frames): 0.9-12.6 ms (6B 0.8-9.7); the median over the views with figures 8.9 ms against
  7.0. Draw calls 728-839 against 566-677 (+162 in every view with figures: each class is its own mesh set); triangles +1.2% (`overview-plan`
  2,546,679 against 2,515,371). Not measured on a GPU. A performance cost of the class meshes, accepted here (priority 7) and stated; merging
  a block's classes into fewer draws is possible later.
- Coats as rendered, the closest formations of opposite sides (CIEDE2000; decision 97 expects the fall): `overview-field` 21.7 to 16.2,
  `close-sokolnitz` 17.0 to 9.9, `pratzen-low` 30.9 to 23.1, `selected-formation` 24.1 to 16.9, `watch-selected` 28.2 to 3.6 (Walther's green
  dragoons against the Allied headquarters' escort, drawn generic in the Russian symbol green), `hybrid-dimmed` 26.2 to 18.6, the closest orbit
  26.1 to 5.7 (Walther against the Fifth Column). Side is carried by the symbology, as the self-test's side-cue check holds.
- Every block's classes as drawn, with their grades: `compare-6c.md`. The sheet shows the close views before and after.

**Checks on this build**
- `npm run build`: fresh; the committed HTML is the build.
- `npm test`: "ALL 9 SUITES PASSED (and the height guard)": `css-test.js` 0 errors (the kit and palette rules among them); `test.js` the
  appearance checks 588/588, 0 errors; `geo-test.js` 54 passed; `terrain-test.js` OK; `audit.js` 0 and 0; `sim-test.js` 0 disagreements;
  `redteam.js` 0 findings; `runtime-test.js` 0 errors; `binding-test.js` 383 checks, 0 failed (no new dashed drawer); the height guard 97 call
  sites, 0 presentation calls.
- `npm run check:visual`: "STAGE0: all checks passed" (58 min 12 s, on the final build; 58 min 53 s on the build before `CONF.none`): 23 views, the self-test 200 of 200; solid near-black in every view within
  the limit (at most 4 blocks, `pratzen-low`); the day's light sweep identical to 6B's (0.000% in 17 samples, 0.007-0.014% in 7, as on 6B);
  the valley fog's hours, the dwell, the horizon and the key tests as on 6B; the five known Canvas2D readback warnings.
- `npm run check:contrast`: 5,349 text elements (5,186 on 6B: the dossier's Dress and the legend's rows), 105 distinct pairs, 0 below AA, 0
  below 10.5 px (6 min 57 s).
- `npm run check:data`: "All 121 DATA declarations are byte-identical" to `archive/stage6b-7fc0f6c3.html` (not moved).
- `npm run check:chronology`: errors 0 (69 timed moves: 65 consistent, 4 early, the named unresolved conflicts; 20 explicit times).
- `npm run check:baseline`: passes on the moved baseline.
- The first commit alone: `npm test` passed and the self-test run alone passed 195 of 195; the full harness was run on the final build only.

**Not done, or open**
- 6D: who carries a standard and how many, each model's cloth, the sourced ratio (Russia, Austria) and France's provisional 1.6.
- Headgear colours are not drawn (the table classes the shape, not the colour); facings and lace are not drawn (decision 104).
- What the table leaves generic is drawn generic: among others the French line infantry's legwear, Oudinot's grenadiers réunis, the Italian
  Royal Guard, the Russian grenadiers' and jägers' headgear, the Austrian line's helmet and legwear, the Grenz (decision 105), the Guard
  chasseurs à cheval's headgear.
- The drawn colours are design values: no dye or surviving cloth was measured. The cross-side colour difference falls by design (decision 97);
  side rests on the symbology.
- Historical: the 6B data questions stay open (Drouet and Rivaud's numbers, the IV Column's battalions, "Gladkov", the Empress's cuirassiers,
  Ryazhsk or Ryazan, the grenadier division's artillery, "45 standards").

## 2026-10 · Stage 6B: the historical appearance read and tabled (docs/STAGE6_SPEC.md §6.1, §6.6; owner decisions 96-110)

**Status: merged (#40). A data task: `appearance.js` (new, guarded) and tour stop 1; nothing drawn changes. `austerlitz-command-map.html`:
1,661,910 bytes, md5 `7fc0f6c3023133aeb73d5b65479bc8a8` (was 1,528,608 bytes, md5 `4c12cac6…`, Stage 5G).** `check:baseline` moves to
this build; `check:data` moves to its copy, `archive/stage6b-7fc0f6c3.html` (from `archive/stage4d-9b13adbf.html`).

**Decisions (owner, 5 October 2026).** The owner opened the session's network (decision 96) and accepted every recommendation of
`docs/STAGE6_SPEC.md` §7, recorded as decisions 96-110 (§0.4). Asked for 6B first, so §6.4's honest drawing becomes the first commit of
6C, as §6.4 allows (decision 110).

**What changed (data; every declaration listed).**
- Added, under "historical datasets" in `tools/visual/data-invariance.js`: `APPEARANCE_GRADE` (the Stage 6 grades A, B, C),
  `APPEARANCE_VOCAB` (the colour and headgear classes a value may take, "generic" among them), `APPEARANCE_SOURCES` (62 works read),
  `DRESS` (49 dress classes: France 21, Russia 18, Austria 10), `COMPOSITION` (the 32 leaf formations' regiments and battalions or
  squadrons; four by their dominant class: `gqg`, `ahq`, `buxhowden`, `heightguns`), `COLOURS_CARRIED` (24 entries), `STANDARD_MEASURES`
  (the staff and the stature per nation, decision 106); and, under a new group "historical appearance model (Stage 6B)", `appearanceOf`
  (a formation's classes and their shares within its foot and mounted groups). Was: nothing; is: the table; why: decisions 99-101, 105, 106.
- Changed: `TOUR` (stop 1, `analysis.js`), decision 108. Was "The blue army to the west is French; to the east are the Russians in green
  and the Austrians in white, whose arrows and outlines are drawn in amber." Is "The French army, marked in blue, is to the west; to the
  east are the Russians and the Austrians, marked in amber." Why: the coats will follow the sources (decision 97); the side is carried by
  the marks.
- Unchanged: every other data declaration (`data.js` untouched; `SOURCE_NOTE`'s two open questions stay, decision 105).
- `build.py` loads `appearance.js` after `data.js`; `test.js` and `tools/stage2/model.js` load it too.

**What was read (fact).** Seven reading passes read the works of the Part A registers and more: the French returns and orders of 1805
(Alombert and Colin t. IV; the *Correspondance* t. IX-XVI), the regulations in force (Berriat 1812; the generals' regulation of an XII),
Bardin, Fieffé, Perrot, Martinet's plates, Regnault, Hollander, Morvan; the Russian code of laws (PSZ t. 27, 28, 44/2) and Viskovatov
(parts 9-18); the Austrian army list for 1805, Teuber, Dolleczek, Wrede, Vaníček; the allied orders of battle (Schönhals 1873,
Mikhailovsky-Danilevsky 1844 and 1846, Stutterheim 1806, the *Materialien* of 1806); and participants (Thiébault, Barrès, Coignet, Savary,
Lejeune, Marbot). Their registers, with every quotation and locator: `docs/stage6-evidence/readings-*.md`. Nothing from an encyclopedia,
a search summary or a GitHub-held copy.

**Found (fact; grades in the table; §6.6)**
- **The French line infantry wore the hat on the day** ("les chapeaux au bout des baïonnettes", 30th Bulletin of 3 December, A); the
  shako only from the renewal of 1807 (decree of 25 February 1806). The light infantry wore the shako (B).
- **French greatcoats are disputed for the day** (none received in Vandamme's division on 30 October; "plus qu'il ne m'en faut" on
  18 November; still to be made on 14 December, all A); the Guard marched in full dress (B). The coat is drawn (decision 101).
- **Russian infantry**: dark green with white trousers; the musketeers in black cloth caps since 1803, replaced by the 1805 pattern as the
  old ones wore out (PSZ no. 21,621, A); not the bicorne, not a shako of 1807. The grenadiers' cap on the day is not established.
- **Russian jägers and dragoons in light green until 1807; Russian cuirassiers without cuirasses** (abolished 1801), in the black crested
  helmet of 1803.
- **Austrian line infantry in white with the 1805 army list's facings** (A); the helmet disputed; the Grenz coat disputed (white by
  regulation, white and brown seen): the open question stays.
- **Colours**: the French 1804 lozenge, 81 cm, one eagle per battalion (B; the 4e's 1st battalion eagle lost, A); the Russian infantry two
  colours per battalion (1802) of Paul I's issues, 142 cm square, pattern still open; Russian jägers and hussars none; the Austrian 1769
  pattern, 161 x 142 cm, one or two per battalion disputed; no source shows colours with batteries or headquarters.
- **The ratio's measures**: Russia, staff 3.20 m (spearhead 0.24 m) over a recruit minimum of 1.60 m (A); Austria, about 2.85 m over
  1.65 m (B); France, no measured staff: 1.6 stays provisional.
- **One horse colour at B** (the Guard horse grenadiers' black, Coignet, uncertain); French carriages olive with black ironwork (B), the
  others not found: one colour stays (decision 109).
- **Leads**: right, the French 1804 lozenge, the Russian cap orders of 1803 and 1805, light-green Russian dragoons and jägers, the Austrian
  161 x 142 cm cloth, the Russian cuirassiers without cuirasses; not settled, O'Reilly's chevaulegers in white, Russian hussars without
  standards, the French light cavalry's eagles; not found, "Gladkov".
- **Data questions, not changed**: Drouet's and Rivaud's division numbers reversed in the 28 October return; the IV Column's Russian
  battalions 12 (Schönhals) against `data.js`'s fourteen; the Empress's cuirassiers with Bagration or the Fifth Column; Ryazhsk or Ryazan;
  the grenadier division's artillery on 26 October; the narrative's "45 standards" (Napoleon's claim of 5 December).

**Files.** New: `appearance.js`, `archive/stage6b-7fc0f6c3.html`, `tools/stage6/verify-quotes.js`, `tools/stage6/quote-check-images.json`,
`docs/stage6-evidence/quote-check.md` and the seven `readings-*.md`. Changed: `analysis.js` (tour stop 1), `build.py`, `test.js`,
`runtime-test.js`, `redteam.js`, `tools/run-all.sh`, `tools/stage2/model.js`, `tools/visual/data-invariance.js`, `package.json`
(`check:data`, `check:baseline`), `docs/STAGE6_SPEC.md` (§0.4, §6.6), `docs/stage6-evidence/README.md`, `CLAUDE.md`, this file and the
build.

**Tests (added).** `test.js`: the appearance checks (588): every leaf formation resolves to classes whose shares sum to 1 in each mount
group, one unit per group; every value a claim with source, locator, grade, label and quote, a disputed value keeping each side, or
generic (colours also "none shown"); grade A only with a source or document dated 1804-1805, or a regulation shown in force; a disputed
headgear or colour drawn generic; every colours entry with a model, a count rule and a cloth; the standard's measures in metres or
provisional with a reason; every source cited, every source a note names registered; SOURCE_NOTE's two questions kept while the table
does not settle them. `runtime-test.js`: the table's dry run for all 32 blocks. `redteam.js`: the retired claims also checked in
`appearance.js` (6 sources). `tools/stage6/verify-quotes.js` (not bundled): every quote searched for in its source's text; 309 quotes:
103 found whole, 31 with OCR differences, 41 checked on the page images in this part (`quote-check-images.json`: the Schönhals order of
battle, the PSZ cap orders, four Viskovatov pages), 56 not found in damaged OCR and 78 with no text layer reachable here, all recorded as
read on the page images by the reading pass (`docs/stage6-evidence/quote-check.md`).

**Checks on this build**
- `npm run build`: fresh; the committed `austerlitz-command-map.html` is the build (1,661,910 bytes, md5 `7fc0f6c3023133aeb73d5b65479bc8a8`).
- `npm test`: "ALL 9 SUITES PASSED (and the height guard)" (4 min 43 s): `css-test.js` 0 errors, 9/9; `test.js` the appearance checks
  588/588, 0 errors, 0 warnings, the order of battle 41/41; `geo-test.js` 54 passed; `terrain-test.js` OK; `audit.js` 0 march-rate and 0
  terrain violations; `sim-test.js` 0 disagreements; `redteam.js` 0 findings, 37 retired phrases across 6 sources none found (its one
  warning, the cavalry's mean rate, is the unchanged tracks'); `runtime-test.js` 0 errors, the appearance dry run "32 blocks resolve to
  72 dress parts (4 by their dominant class)" (its one console warning, three.js's "'fog' is not a property" of a line material, is the
  unchanged `app.js`'s); `binding-test.js` 383 checks, 0 failed; the height guard 96 call sites, 0 presentation
  calls. The first run failed `runtime-test.js` ("kienmayer: appearance shares sum to 2": its check summed the foot and the mounted shares
  together); the check now sums each mount group, as `test.js` does, and the run above is on the committed tree.
- `npm run check:baseline`: passes on the moved baseline (md5 `7fc0f6c3…`, 1,661,910 bytes).
- `npm run check:data`: "All 121 DATA declarations are byte-identical" to `archive/stage6b-7fc0f6c3.html`; against the old reference
  (`archive/stage4d-9b13adbf.html`) the data that differ are exactly `TOUR` (changed) and the eight added declarations above.
- `npm run check:chronology`: errors 0 (69 timed moves: 65 consistent, 4 early, the named unresolved conflicts; 20 explicit times).
- `npm run check:contrast`: 5,186 text elements, 105 distinct pairs, 0 below AA, 0 below 10.5 px (6 min 1 s).
- `npm run check:visual`: "STAGE0: all checks passed" (51 min 29 s): 23 views, drops within every limit, the self-test 194 of 194; the
  day's light, the valley fog, the dwell and the horizon as on 5G; the two known Canvas2D readback warnings (five lines).
- `node tools/stage6/verify-quotes.js --md docs/stage6-evidence/quote-check.md` (network; not in the suite): 309 quotes, as above.

**Not done, or open**
- Nothing is drawn differently: the figures, flags and legend wait for 6C and 6D (and §6.4's honest drawing, the first commit of 6C).
- Not reachable online: Malibran, Lienhart and Humbert, Fallou, Charrié, the Otto manuscript, Zvegintsov; Regnault read only to p. 42
  (Gallica refused part of the day); HathiTrust refused throughout.
- 134 quotes rest on the reading pass's page-image reading, not on a second check.
- Historical: the open questions stay open (the Russian infantry colours, the Grenz coat); the disputes are kept, not resolved.

## 2026-10 · Stage 6 Part A: historical appearance, the specification (docs/STAGE6_SPEC.md)

**Status: merged (#39); the owner then accepted every recommendation of §7 (decisions 96-110). No source file changed;
`austerlitz-command-map.html` was unchanged: 1,528,608 bytes, md5 `4c12cac6d458b02e3282237f4d1abb92` (Stage 5G).** `check:baseline` does not move; `check:data` does not move.
- Recorded with this part: Stage 5G merged (#38), here (its entry's status), in `CLAUDE.md` and in `docs/STAGE5_SPEC.md`; Stage 5 is
  complete.

**Before writing (fact).** `main` (f54fffa, 5G merged as #38) matched `check:baseline` (md5 `4c12cac6…`, 1,528,608 bytes).

**What this part is.** `docs/STAGE6_SPEC.md` specifies the roadmap's Stage 6 line ("Uniforms, headgear, flags, each with a source and a
grade") and opportunity 3 ("identity decoupled from coat colour"): the decisions and records that bind it, quoted with file and line, and
where they disagree (§0); what is drawn today, read from the code and the running page (§1); the evidence, as a register of leads (§2);
what can be drawn, measured in the harness views (§3); identity without the coat, measured (§4); where appearance data should live (§5);
a design for 6B-6D with tests (§6); and fifteen questions for the owner (§7). Scripts in `tools/stage6/` (not bundled); evidence in
`docs/stage6-evidence/` (its README lists every file, its section and its script).

**The limit (fact).** No external source could be read in this session. The network policy refuses every host that holds the sources
(HTTP 403 on CONNECT: Wikipedia, Gallica, archive.org, HathiTrust, Google Books, the Musée de l'Armée, the HGM, the Hermitage, the
Napoleon Series and others; only package registries answer); the search tool's shared cap (200) was spent, and its summaries are
machine-written, not a source (decision 42's rule); a few texts reached through copies held in other GitHub repositories are excluded
(this session may read only its own repository). So §2 is a register of leads, every external item labelled uncertain with the grade it
would carry if its source confirms it; nothing is graded A or B as verified, nothing is acted on, and both open questions of
`SOURCE_NOTE` stay open (decision 42: "where a source cannot be read (network policy), that is said, the conflict is left unresolved with
today's behaviour, and listed").

**Found (fact; each stated in §0.3, none resolved)**
- **Decision 1 and opportunity 3 cannot both hold**: decision 1 keeps nation colours "as counter fills and figure coats"; opportunity 3
  (and decision 1's own note) says coats cannot carry nationality once uniforms are accurate. Question 2.
- **The drawing answers both open questions of `SOURCE_NOTE`**: every Russian standard is "a green colour with a white cross" and
  Kienmayer's Grenz are drawn in the Austrian white, unlabelled, while `SOURCE_NOTE` keeps both questions "unresolved rather than guessed".
- **The colour key names coats as nations**: the first-run card, the legend's nation rows and tour stop 1 (`TOUR`, guarded) say the armies
  are blue, green and white; the self-test pins the words.
- **The standard's ratio divides by the bayonet's tip** (1.981 units), not the man (1.635 to the hat's top): the drawn pole is 1.94
  man-heights; a sourced ratio must state its denominator.
- **One hat, one horse, three flags**: every man and rider wears the same black cylinder (the kit's "shako"), the same legwear, rides the
  same brown horse; no facings, cuirasses, crests or plumes anywhere; gunners in the infantry kit with musket and pack; every leaf
  formation carries 1-3 standards of its nation's one pattern, batteries and headquarters included (56 standards on 32 blocks).
- **Mixed formations wear one coat**: Kienmayer's attached (Russian) Cossacks in the Austrian white.
- **Leads contradict the brief's premises** (unverified): Russian shako orders of February 1805, not 1807; Russian dragoons and jägers in
  light green until 1807; Austrian O'Reilly chevaulegers in white; the Austrian cloth 161 x 142 cm, not 175 x 130; Russian hussars without
  standards from 1797. The leads agree with the audit on the French 1804 lozenge (the vertical tricolour from 1812) and on the Austrian
  flag (the drawn pattern matches none).
- **What the drawn scale allows** (measured, `scale-probe.js`): a man is 0.6-1.0 px at the Overview, 10.5 px in the Field vantage,
  15-17 px in the middle views, 27-38 px in the close views and 49 px (at most 181) in the closest orbit; his headgear reaches 4 px only in
  the close views; a facing (4% of a man) reaches 1 px only in the close views and 4 px in 51 figures of one view; a standard's cloth is
  4-6 px at the Overview (edge on), 7.6 px in the Field vantage, 18-37 px close.
- **What a historical drawing does to the views** (measured, `appearance-probe.js`, prototype values only): prototype historical coats
  alone move no Stage 0 threshold in any view (solid near-black, map text at AA, drops, the confidence marks' share within 0.001); coats
  with headgear, facings, cuirasses and repainted flags break the darkness limit in one view, **the closest orbit (solid near-black
  0.00228-0.00233 against 0.0005; today 0.0003)**, every other view as today. The headgear is the cause (with today's cylinder in its
  place, 0.0005, at the limit), so 6C must keep every drawn black at or above decision 84's and measure the closest orbit per headgear
  class (question 7). Facings change 0.6-3.8 px per figure at the Overview and in the Field vantage, at a median contrast of 1.2-1.3: a
  tint, not a feature.
- **Coats cannot carry side** (measured as rendered): the closest coats of opposite sides differ today by CIEDE2000 17-31 in the keyed
  views; with prototype historical coats by 3.6-19, French green against Russian dark green by 3.6-4.9. Every formation drawn as figures
  has its ground mark today; names and counters cover 3-5 of 24-29 formations at the Overview and none of 11 in the closest orbit.

**Data tasks it would need (not done; §6.1):** 6B, the appearance table (`appearance.js`, guarded) once the sources can be read; tour stop
1's wording (`TOUR`); the narrative's "45 standards" (`data.js:126`) against the disputed counts; the leads' order-of-battle additions
(Her Majesty's Life Cuirassiers with Bagration; the Fifth Column's Russian regiments; "Gladkov" unconfirmed).

**Checks on this build (unchanged by this part)**
All run in this session on the unchanged 5G build (md5 `4c12cac6…`, 1,528,608 bytes):
- `npm run build`: the bundle 1,458,891 bytes, the HTML 1,528,608 bytes.
- `npm test`: "ALL 9 SUITES PASSED (and the height guard)": `css-test.js` 0 errors, 9/9; `test.js` 0 errors, 41/41; `geo-test.js` 54
  passed; `terrain-test.js` OK; `audit.js` 0 march-rate and 0 terrain violations; `sim-test.js` 0 disagreements; `redteam.js` 0 findings;
  `runtime-test.js` 0 errors; `binding-test.js` 383 checks, 0 failed; the height guard 96 call sites (before writing and on the final tree).
- `npm run check:baseline`: passes (md5 `4c12cac6d458b02e3282237f4d1abb92`, 1,528,608 bytes; not moved).
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html` (not moved).
- `npm run check:chronology`: errors 0 (69 timed moves: 65 consistent, 4 early, the named unresolved conflicts; 20 explicit times).
- `npm run check:contrast`: 5,186 text elements, 0 below AA, 0 below 10.5 px.
- `npm run check:visual`: all checks passed (66 min 46 s; 23 views, the self-test 194 of 194; run once on this build, before the probes).

**Not done, or open**
- Nothing is implemented. Every prototype colour, shape and pattern the probe drew is a measurement value, not a proposal.
- No external source was read; 6B needs a session that reaches them (question 1).
- Frame times are software WebGL on the harness machine (comparable only with one another); no GPU measurement.
- Historical: nothing changes. The open questions stay open; the leads that contradict the brief's premises are recorded, not adopted.

## 2026-10 · Stage 5G: the day-track inset (docs/STAGE5_SPEC.md §F, §I; owner decision 95)

**Status: merged (#38); with it Stage 5 is complete. `austerlitz-command-map.html`: 1,528,608 bytes, md5
`4c12cac6d458b02e3282237f4d1abb92`** (was 1,510,672 bytes, md5 `4c7bb9e4…`, Stage 5F). With it, every part of Stage 5 is built (5B-5G).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`; the reference does not move. The inset reads
  `anchorList`, `legPath`, `stateAt`, `PLANS` and the geography; it changes none. Presentation only.
- Recorded with this part: Stage 5F merged (#37); the owner's answer to question 10, decision 95 (`docs/STAGE5_SPEC.md` §0.4). Questions
  11 and 12 were not put: no part needed them (the order was followed as recommended).

**Before building (fact).** `main` (af73330, 5F merged as #37) matched `check:baseline` (md5 `4c7bb9e4…`, 1,510,672 bytes).

**What changed** (`app.js`, `style.css`)
- **"Its day"**, a section of the full dossier after "Where", tagged derived: a small north-up map (SVG, 240 x 160 units, drawn at the
  dossier's width: 255 px docked, 315 px as the card) of the formation's day at one fitted scale, never more than the inset's width per km,
  with a scale bar in km from `GEOREF` and a north arrow. Under it, the paper map's ground drawn small from the same geography (woods,
  villages, the meres, the Goldbach, the Litava, the brooks), in the paper map's tokens; no hillshade.
- **What it draws**: the anchors as the skeleton's marks by grade (A filled, B a ring, C a small ring; a tick toward north for an explicit
  time); the legs through every via, thin and solid (decision 15: executed, not planned), the leg in progress in the side's colour; the
  position at the clock as a dot; the formation's ordered route, where a `PLANS` column names it, dashed (decision 95; 21 of the 32 leaf
  formations). Two consecutive anchors closer than 8 px are one mark naming both clocks; nothing is enlarged out of scale.
- **Interaction**: the anchors are one keyboard stop in time order (a roving group, as the timeline's markers), each named by its clock and
  grade; a click or Enter sets the clock to its arrival, the selection kept.
- **Aggregates** (corps, columns, armies) show their formations' days together, each line named on hover; no aggregate track is drawn.
- **Labelled**: "The formation's plotted day: anchors graded A/B/C as in the data; the lines between them are this reconstruction's
  interpolation, not a recorded route."

**Decisions taken while building it** (`docs/STAGE5_SPEC.md` §I, "5G, as delivered")
- **The side's deep colours** (4.70 and 4.13 against the paper ground; the base colours reach only 2.77 and 2.56) and the paper ink (9.06).
- **A fixed viewBox**, so the inset's px are a fixed fraction of the screen's at both widths and the 8 px rule holds at each.
- **In the full dossier only**, not the compact card: the harness's selected-formation and paper-drawer views (the card) are unchanged.
- **The focus ring drawn in the SVG** in the token ink (a first draft hard-coded a colour in the stylesheet; the inset's CSS now carries none).
- **The inset's text takes its colour from the SVG's `color`** (`fill="currentColor"`, the SVG's colour the paper ink): with only a `fill`, the
  text's CSS colour stayed the dossier's light text, and the first full run's `check:contrast` measured "3 km" at 1.37 against the inset's
  ground (what is drawn was the ink; what assistive styling and the check read was not). `report-5g.js` measured the build before this fix
  (md5 `276dc048…`), which differs only in that attribute.

**Measured** (`tools/stage5/report-5g.js`; `docs/stage5-evidence/5g-report.md`, `5g-sheet.jpg`)
- **32 formations**: 15.4-212 px per km (the Santon, one anchor, at 1 km across), scale bars 0.25-5 km; 180 anchors in 173 marks; the shortest
  leg drawn 4.2 px (Kollowrath), 4.3 (Saint-Hilaire), 4.5 (Friant), 6.7 (Vandamme), every other at least 9.6 px; IV Corps 27 anchors in 20
  marks over its 4 formations.
- **The dossier**: Saint-Hilaire's full dossier, which already scrolled, grows from 1,724 to 2,080 px docked (1600 x 900 and 1280 x 720) and
  from 1,474 to 1,854 px as the card (1024 x 768).

**Tests** (none loosened; new)
- **Self-test** (194 checks, was 191; 3 new): every leaf formation's inset holds its anchors in order with their grades, its legs through every via and the dot
  at its position; north 0.000 degrees from up; the bar within 0.000% of the scale, also against two anchors' true distance; every mark
  inside the frame; IV Corps its 4 formations; the anchors a keyboard group named by clock and grade, a click setting the clock to 09:15
  with Saint-Hilaire still selected, the arrow key moving on; the legs solid and the 2 ordered routes dashed; the marks at 3:1 and the text
  at AA on the paper ground.
- **`check:contrast`**: a new state (32), the dossier with its inset, docked.
- **`css-test.js`**: new, the inset's colours are the tokens', only the ordered route is dashed, its stylesheet carries no colour.
  **`runtime-test.js`**: new, a dry run of the model for all 32 formations.

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard (`binding-test.js` 383 checks, 0 failed).
- `npm run check:baseline`: moved to this build (md5 `4c12cac6…`, 1,528,608 bytes); passes.
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:contrast`: 5,186 text elements in 32 states (4,990 in 31 on 5F; the existing expanded-dossier state now holds the inset too),
  0 below AA, 0 below 10.5 px. The first run failed one text, the inset's "3 km" (above); the run reported here is on the committed build.
- `npm run check:visual`: all checks passed: 23 views (selected-formation and paper-drawer unchanged: they show the compact card); the day's
  light, the valley fog's hours, the horizon, the key tests; the self-test 194 of 194; the two known Canvas2D warnings.

**Not done, or open**
- `check:contrast` reads the inset docked only (its tool has one viewport); the card shares its colours and the self-test holds them.
- The inset's "N" can sit over a line near the top corner (Friant's); the marks are never hidden by it.
- With 5G, Stage 5's parts B-G are all built. Open for after Stage 5: the Plans tab's drops from a moved camera (decision 94); the data tasks
  of §G.3 (question 11).

## 2026-10 · Stage 5F: the ordered routes, and the Plans tab's harness case (docs/STAGE5_SPEC.md §E, §I; owner decisions 93, 94)

**Status: merged (#37). `austerlitz-command-map.html`: 1,510,672 bytes, md5 `4c7bb9e436086a824972f5183b838e58`**
(was 1,492,181 bytes, md5 `b50a087c…`, Stage 5E).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`; the reference does not move. `PLANS` and
  `OVERLAYS` are read, not changed; the Plans tab is unchanged. Presentation only.
- Recorded with this part: Stage 5E merged (#36); the owner's answers to questions 9 and 13, decisions 93 and 94 (`docs/STAGE5_SPEC.md` §0.4).

**Before building (fact).** `main` (c9062c1, 5E merged as #36) matched `check:baseline` (md5 `b50a087c…`, 1,492,181 bytes).

**What changed** (`app.js`, `shell.html`)
- **"Ordered routes"**, a layer, off by default (decision 93; not called ghosts, since decision 83's faint whole arrow is one): each plan
  column's route (`PLANS[side].cols[].route`) as a ribbon about 100 m wide, in the side's colour at 30%, **dashed** (decision 15: planned;
  `dashRuns`, 4-unit dashes at a duty of 0.6), no head, label, staging or objective; depth-tested, so the figures stand on it; nothing dimmed.
- **Which routes**: with a formation selected, the columns naming its family; else every column while a formation it names is on the field
  before its last anchor; in phase 0, while the movement arrows are drawn, not the four columns (the 1st to 4th) whose axis arrows `OVERLAYS`
  already draws, found by distance (each axis arrow's points lie 25-46 m on average from its column's route), so no route is drawn twice.
- **Each dash clipped to the drawn ground's own triangles**: every point of it 0.3 units above the ground, none under it, at every factor
  and on the paper map.
- **Where plan and execution part** (§E.3 item 3), in the formation's dossier while the layer is on, derived: "4th Column: at most 4.8 km
  from it", the largest distance of the executed track from the column's route, every 10 minutes over the day.
- **The legend** (the legend's own dash sample: "ordered routes (dashed): the columns' lines of march in the two plans, as the plans set
  them out; not what was marched") and **the sources sheet** (a sentence written by the app; `SOURCE_NOTE` unchanged).
- **The Plans tab's harness case** (decision 94): `plans-overview`, both plans at the Overview vantage, Study, 09:30.

**Decisions taken while building it** (`docs/STAGE5_SPEC.md` §I, "5F, as delivered")
- **Clipped, not vertex-draped**: the Part A prototype draped its ribbon at vertices, which 5B found cuts under the ground at 10.33x.
- **The phase-0 rule only while the arrows are drawn**: with the movement arrows off, nothing else draws those four routes.
- **The dossier's distance only with the layer on**, as 5D's plotted positions.
- **Not drawn at the eye level** (they would stand above a 1x eye) nor in Clean.
- **The self-test starts without the Plans overlay** and restores it after: the Plans case is the last on its page, and the overlay dims
  every formation.
- **The Plans case keeps the rail on its Now tab** (the overlay stays when the visitor leaves the Plans tab): with the Plans tab shown, the
  3B rule that Study shows the Now tab (decision 55) failed the case in the first full run; the rule is kept, the case changed.
- `report-5f.js` measured the build before that change (md5 `1ff58879…`), which differs only in how the harness's case opens the Plans
  overlay (`applyCase`); what the views draw is the same.

**Measured** (`tools/stage5/report-5f.js`; `docs/stage5-evidence/5f-report.md`, `5f-sheet.jpg`; 23 views, off and on)
- **Drops** unchanged in every view; **map text** 0 below AA, the lowest contrast at most 0.10 lower (overview-field 8.32 to 8.22); **their
  share** of the free rectangle 0.1-4.4% (Part A's prototype: 0.2-7.1%); **the world pass** (software, 14 views at 4x and 10.33x) on average
  5.73 ms off and 5.64 ms on.
- **Where plan and execution part** (derived), reproducing the census of §E.1: Miloradovich 4.80 km, Kollowrath 5.12, Liechtenstein 5.51,
  Friant 6.46 (against the bait's route, which follows Legrand's stretch of the Goldbach), Vandamme 5.04 (the second axis); Legrand 0.45,
  Przybyszewski 0.66. Why a column left its route is the narrative's, not this measure's.
- **The Plans tab at the Overview** drops 11 map items (ten place names and the Allied headquarters' name), as Part A's probe found there for
  both plans; that is its limit.

**Tests** (none loosened; new)
- **Self-test** (191 checks, was 185; 6 new): at 1x, 4x and 10.33x every dash's triangles sampled every 0.5 units (31,362 points over 3,934 triangles), 0
  under the drawn ground, every point within 1e-5 of the lift; once: each route on its column's `PLANS` route (every point within half the
  ribbon's width), dashed at its duty (0.600 of each route's length), depth-tested in the transparent pass, at 30%, nothing dimmed; the scope
  phase by phase against an independent computation (10, 14, ..., 13, 0 routes), Saint-Hilaire's two columns, the four axis columns and the
  rule with the arrows off; the dossier's derived distance, the legend's row, the paper map (14 routes), none in Clean.
- **Harness**: new, in every view but the eye level the routes on: the map layer's items and drops as without them, text at AA;
  `plans-overview` with its limit (11).
- **`binding-test.js`**: `routeBuild` is the one new dashed drawer, allowed because it dashes only a plan column's route (checked).
- **`css-test.js`**: new, off by default, named "Ordered routes", the side's token colour, the legend's dash sample. **`runtime-test.js`**:
  new, a dry run (14 columns at 09:30, 10 at 04:10, 2 for Saint-Hilaire, none left when off).
- **Height guard**: two new call sites classified (`routeDrapePoly` presentation, `routeChecks` test).

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard (`binding-test.js` 383 checks, 0 failed).
- `npm run check:baseline`: moved to this build (md5 `4c7bb9e4…`, 1,510,672 bytes); passes.
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:contrast`: 4,990 text elements in 31 states (4,985 on 5E), 0 below AA, 0 below 10.5 px.
- `npm run check:visual`: all checks passed: 23 views (`plans-overview` 11 drops at its limit of 11, 0 map texts below AA); in the 19 views
  that measure it the routes on left the map layer's items and drops as they were, text at AA, at most 4.8% of the free rectangle; the day's
  light, the valley fog's hours, the horizon, the key tests; the self-test 191 of 191; the two known Canvas2D warnings. The first full run
  failed one check, the Plans case with the Plans tab shown (decision 55, above); the run reported here is on the committed build.

**Not done, or open**
- The Plans tab still drops up to 11 more map items than without it when opened from a moved camera (§0.3 item 14): the fix is a task
  after Stage 5 (decision 94).
- On the framed paper map the routes are faint (0.1% of the free rectangle at 28 px per km): by design, a faint mark; for the owner's eye.

## 2026-10 · Stage 5E: "Whose eyes?" and the eye-level vantage (docs/STAGE5_SPEC.md §D, §I; owner decisions 91, 92)

**Status: merged (#36). `austerlitz-command-map.html`: 1,492,181 bytes, md5 `b50a087c046a6dd124a66badb068f30d`**
(was 1,466,861 bytes, md5 `c5c47192…`, Stage 5D).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`; the reference does not move. The knowledge rule
  (`knowledgeOf`, `hasLOS`, `computeViewshed`), `KNOW_OVERRIDE`, `COMMAND` and the eye heights are unchanged; so is `SOURCE_NOTE` (its sentence
  on the model readings is a data task, §G.3). Presentation and interface only.
- Recorded with this part: Stage 5D merged (#35); the owner's answers to questions 5 and 8, decisions 91 and 92 (`docs/STAGE5_SPEC.md` §0.4).

**Before building (fact).** `main` (2f8ea25, 5D merged as #35) matched `check:baseline` (md5 `c5c47192…`, 1,466,861 bytes).

**What changed** (`app.js`, `world.js`, `shell.html`, `style.css`)
- **One control, "Whose eyes?"** (decision 91): Everyone, Napoleon's headquarters, the Allied headquarters, in the Command tab (in place of
  Omniscient / French / Allied) and as a button in the timeline's control row ("Eyes: everyone / Napoleon / Allied HQ", cycling). Labelled
  everywhere a model reading (the derived tag): "A model reading: line of sight over this model's ground from the headquarters' plotted
  position, the valley fog's rule, and authored limits on what each side knew. Not a record of what was seen." The Command tab's heading
  and its "broken outline" sentence, which described an encoding that no longer exists, are rewritten.
- **The reading at the clock** (decision 92): the guarded `knowledgeOf` caches by the phase; its cache is now cleared at each new minute of
  the clock from outside it (`knowAtClock`), so what is drawn is the rule at the clock. 115 of 2,636 readings over the day change (65 French,
  50 Allied), always to the rule as written.
- **Reported only, everywhere**: drawn as the C zone of 5B without figures (reported, not seen); its name and counter keep the "?".
- **The headquarters' viewshed**: the existing sightline tint from the chosen headquarters' plotted position at the clock, recomputed when it
  moves (by more than a world unit, at most every 0.5 s while playing). Inside it, the ground under the valley fog's top by the rule's own
  test (model height below -0.8, the 238.2 m the fog is drawn at) is tinted as fogged while the phase's mist exceeds 0.5: in sight, but in
  the fog. A place's sightlines (its dossier) are left alone while shown.
- **The dossier's reason**: "Not known (no line of sight)", "Not known (authored limit)", "Reported only (valley fog)", "Reported only
  (authored limit)".
- **The eye-level vantage** ("Eye level", among the vantages once a headquarters is chosen; also "Stand at the headquarters" in the Command
  tab): the eye at the headquarters' plotted position at the clock, 3 m above the drawn ground with the metre scaled by the display factor
  (so the drawn line of sight is the model's), looking toward the phase's authored target, moving with the headquarters as the clock runs.
  The one camera path below the floor (decision 91): it holds its own height; the near plane drops from 1 to 0.05 units; any orbit, pan,
  zoom, glide or preset leaves it for the ordinary camera at its floor (Follow off). A caption over the view: the model-reading sentence,
  "Relief drawn ×k; figures are symbols many times life size", and at the chapel of St Anthony the correction pass's recorded mismatch.

**Decisions taken while building it** (`docs/STAGE5_SPEC.md` §I, "5E, as delivered")
- **`knowledgeOf` untouched**: the guard forbids changing it; clearing its cache per minute gives decision 92 without a data change.
- **At the eye, the true-scale rule** (decision 34's precedent), found on the first renders: trees and houses are not drawn (at the chapel of
  St Anthony the eye stood inside Augezd's houses); the observer's own side is drawn as its ground marks, not figures (Soult's standards
  stood across the view from the Zuran), and not at all within 500 m (a design value); the enemy in sight keeps its figures; a known enemy
  the eye has no line of sight to is drawn as reported. The confidence marks lie 0.02 units up with a depth offset; the skeleton is not drawn.
  These are design choices for the owner's eye.
- **The self-test starts from the omniscient view** and restores the reading after (the harness ran it after the eye-level cases with
  Napoleon's headquarters still chosen, and the camera and confidence checks failed on that state).

**Measured** (`tools/stage5/report-5e.js`; `docs/stage5-evidence/5e-report.md`, `5e-sheet.jpg`)
- **The reading**: every 10 minutes over the day, 1,074 French and 1,562 Allied enemy readings; the phase's cache differs from the rule at
  the clock in 65 and 50 (mostly "unknown" and "seen" exchanged as the line of sight opens or closes within a phase).
- **Reported only**: Napoleon's headquarters at 05:00, 3 formations (`prz`, `rg_inf`, `rg_cav`), at 08:00 3 and at 10:00 2; the Allied
  at 08:00 1 and at 10:00 2: every one drawn as a zone without figures, and every name and counter drawn marked "?" in the landscape and with
  counters (before 5B, §D.2: 0 of 3 names at 05:00); on the framed paper map they are folded into their corps' counters (0 drawn).
- **The viewshed** at each headquarters' anchor: from the Zuran 39.3% of the modelled ground in sight, 21.6% of it fogged at 04:00; from
  Krzenowitz 6.5% and 61.6%; from the chapel of St Anthony 6.7%; 0 cells against the rule's threshold anywhere; 3.6-21.5 ms each (software).
- **The eye level** (Napoleon's headquarters at 08:30, 10:00, 13:00, the Allied at 08:00, 10:00, at 1x, 4x, 10.33x): the eye within 1e-4 of
  3 m scaled; 0 "not known" drawn; 0 enemy figures the model hides from the headquarters; 0 map texts below AA; solid near-black 0; drops
  0-6; the world pass 0.8-4.3 ms (software).

**Tests** (none loosened; new or changed to the decided rule)
- **Self-test** (185 checks, was 178; 7 new): at 1x, 4x and 10.33x the eye-level vantage (the eye at the headquarters and its height, nothing not known
  drawn, no enemy figures the model hides, the caption, an orbit back to the floor with 0 violations); once: the reading at the clock (2,636
  readings, 0 differ from the rule afresh; the phase's cache would have drawn 115), reported only as zones and marked, the one fog threshold,
  the dossier's reason, the control. Changed: the self-test begins from the omniscient view, leaving the eye, and restores the reading.
- **Harness**: two new views, `eye-zuran` (4x) and `eye-zuran-1x`, Napoleon's headquarters at 08:30. In them the camera-floor threshold is
  replaced by the eye's own (on, within 1e-4 of 3 m scaled, at the headquarters: the decided exception); their drop limits are what this
  build drops there (5 and 6, place names on the horizon), never raised; no skeleton measure there (not drawn at the eye).
- **`check:contrast`**: three new states (31): the dossier's reason, the eye-level caption, the paper map with a headquarters' reading.
- **`css-test.js`**: new, one "Whose eyes?" control, labelled a model reading, no "broken outline", the eye's vantage hidden until a
  headquarters is chosen. **`runtime-test.js`**: new, a dry run of the reading at the clock (899 readings, each the rule's), the reasons
  and the control.
- **Height guard**: eight new call sites classified (`eyesViewshed` model: the rule's threshold on the model's height; `eyePlace`,
  `eyeEnter`, `camFloor`, `clampCamera` presentation; `eyesChecks`, `eyesDayChecks` test).

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard (`runtime-test.js` and `css-test.js` with their 5E checks).
- `npm run check:baseline`: moved to this build (md5 `b50a087c…`, 1,492,181 bytes); passes.
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:contrast`: 4,985 text elements in 31 states (4,465 in 28 on 5D), 0 below AA, 0 below 10.5 px.
- `npm run check:visual`: all checks passed: 22 views (the two eye-level views: the eye at 0.18988 and 0.04747 units, exactly 3 m scaled, at
  the headquarters; drops 5 and 6, at their limits; 0 map texts below AA; solid near-black 0); the skeleton's measure in the 18 other
  non-first-run views as on 5D; the day's light, the valley fog's hours, the horizon, the key tests; the self-test 185 of 185; the two known
  Canvas2D warnings.

**Not done, or open**
- The movement arrows are drawn over everything (depth test off since 2C), so at eye level they show through the hills the eye cannot see
  past.
- At the chapel of St Anthony at 15:00 an Allied formation stands beside the post in the model, and its figures fill the eye's view: the
  data's geometry, not a drawing fault; left as it is.
- At 4x and 10.33x the eye's picture shows the relief exaggerated (the caption says so); the line of sight is the model's at every factor.
- The `SOURCE_NOTE` sentence on the model readings (§G.3) is a data task, not done here.

## 2026-10 · Stage 5D: the evidence skeleton (docs/STAGE5_SPEC.md §B, §I; owner decision 90)

**Status: merged (#35). `austerlitz-command-map.html`: 1,466,861 bytes, md5 `c5c47192ec1fbd589af1ce4bbae207f2`**
(was 1,441,684 bytes, md5 `96b401b3…`, Stage 5C).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`; the reference does not move. No anchor,
  leg, via, time, grade or `OVERLAYS` change: the skeleton draws `anchorList` and `legPath` as they resolve. Presentation only.
- Recorded with this part: Stage 5C merged (#34); the owner's answer to question 7, decision 90 (`docs/STAGE5_SPEC.md` §0.4): the
  selected formation's family, else the legs meeting the current phase, with a "whole day" choice.

**Before building (fact).** `main` (108adaa, 5C merged as #34) matched `check:baseline` (md5 `96b401b3…`, 1,441,684 bytes).

**What changed** (`app.js`, `shell.html`, `style.css`)
- **"Evidence skeleton"**, a layer, off by default, with "Skeleton: whole day" (off): each formation's plotted positions (the anchors
  the clock moves between, `anchorList`) and the legs it interpolates between them (`legPath`, through every via). Scope (decision 90):
  the selected formation's family (its whole day); nothing selected, the legs whose window meets the current phase and their anchors;
  "whole day", every formation's 180 anchors and 148 legs, whatever is selected.
- **Anchors by shape, never hue or dash** (decisions 4, 15): A a filled disc, B a ring, C a small open ring, by the grade at the anchor's
  phase (`stateAt`); a tick toward true north on an anchor with an explicit time (`tm`; 20 of them). About 9 px across at their distance,
  faded near the eye as the glyphs are, each a patch of the drawn ground's own cells (5B's patch, now `groundPatch`, shared).
- **Legs** as thin solid lines in the annotation colour (the paper map's own there), split wherever they cross an edge of the drawn
  ground's triangles, so every piece lies 0.4 units above the ground and never under it.
- **Ground drawing, not a map-layer item**: it adds no counter, name or drop. Its words: on hover, the anchor's formation, clock and grade;
  with the layer on, the full dossier's "Plotted positions" (each anchor's clock and grade, "timed" for an explicit time).
- **The legend**: a row per grade drawn and one for the line ("interpolated between plotted positions: not a recorded route · a tick: an
  explicit time"). **The sources sheet**: a sentence on the skeleton (written by the app; `SOURCE_NOTE` unchanged). Not drawn in Clean.

**Decisions taken while building it** (`docs/STAGE5_SPEC.md` §I, "5D, as delivered")
- **The legs split on the ground's triangles**, not sampled every 0.5 units as the Part A probe drew them: between two samples a piece can
  pass under the ground where it bends (5B found this for the marks).
- **"Whole day" overrides the selection** (its label says every formation).
- **No accessible name per anchor on the map**: that would make each a map-layer item (up to 180; §B.3 item 3); the dossier's list and the
  hover carry the text.

**Measured** (`tools/stage5/report-5d.js`; `docs/stage5-evidence/5d-report.md`, `5d-sheet.jpg`; 23 views, each off as it opens, on in
scope, on for the whole day)
- **Drops and items** unchanged in every view and both scopes; **map text** 0 below AA, the lowest contrast unchanged in every view.
- **Its share of the free rectangle** 0.1-1.2% in scope, 0.5-3.9% for the whole day (Part A's probe: up to 1.2% and 3.6%).
- **Anchors and legs in the free rectangle**: in scope, e.g. 76 of 77 and 48 of 48 (overview-field, phase 4), 5 of 9 and 6 of 8
  (Saint-Hilaire's family); for the whole day 15-180 of 180 anchors.
- **The world pass** (software WebGL, 14 views at 4x and 10.33x): on average 5.85 ms off, 5.51 in scope, 6.14 for the whole day, at most
  9.0 ms; not measured on a GPU.

**Tests** (none loosened; new)
- **Self-test** (178 checks, was 166; 12 new): at 1x, 4x and 10.33x every leg's pieces sampled every 0.5 units (14,796 points over 5,328 pieces), 0 under the
  drawn ground and every point within 1e-5 of the lift; every anchor mark's triangles (119,280 points), 0 under; the scope phase by phase
  against an independent computation, a corps's family and the whole day; every mark a plotted anchor at its position with its `stateAt`
  grade and mask, every leg on `legPath` through its anchors and vias; the shapes (alpha at the centre and on the ring) and one undashed
  line; about 9 px on screen (8.50-9.52); the same map-layer items and drops on and off; the hover's words; the legend's row; the paper
  map's colour; none in Clean.
- **Harness**: new, in every view the skeleton on for the whole day: the map layer's items and drops as without it, its text at AA.
- **`css-test.js`**: new, its functions draw no dash, its colour is the annotation token, it and its whole day are off by default.
- **`runtime-test.js`**: new, a dry run (off by default; at 09:50 the phase's 48 legs and 77 anchors, each with its grade's mask; the
  whole day's 148 legs; nothing left when off).
- **Height guard**: six new call sites classified (`groundPatch`, `skelDrape`, `skelPlaceMarks`, `skelNear` presentation; `skelChecks`,
  `skelDayChecks` test). **`binding-test.js`**: unchanged; its dash scan finds no dashed or segmented drawing in the skeleton.
- Two mistakes in my own new test code, fixed before this build: the scope check's helper read a phase filter as "the whole day", and
  the dash probe named a dashed material (the binding test's dash scan, rightly, flagged the self-test for it).

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard (`binding-test.js` 381 checks, 0 failed; `runtime-test.js` and `css-test.js` with
  their skeleton checks).
- `npm run check:baseline`: moved to this build (md5 `c5c47192…`, 1,466,861 bytes); passes.
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:contrast`: 4,465 text elements in 28 states (4,456 on 5C), 0 below AA, 0 below 10.5 px.
- `npm run check:visual`: all checks passed: 20 views; in the 18 that are not first-run cards the skeleton on for the whole day (180
  anchors, 148 legs) left the map layer's items and drops as they were, 0 map texts below AA, its share of the free rectangle 0.9-4.7%
  (narrow-1024 the most); the day's light, the valley fog's hours, the horizon, the key tests; the self-test 178 of 178; the two known
  Canvas2D warnings.

**Not done, or open**
- The skeleton's look (the line's 1 px width, its opacity, the marks' 9 px) is for the owner's eye; the lines reach 3:1 against the ground
  in only part of their pixels (Part A §B.2): the hover and the dossier carry the reading.
- The 1024 x 768 self-test failures recorded under 5C remain (outside the harness; not caused by 5C or 5D).

## 2026-10 · Stage 5C: interval events as bars on the timeline, one event clock (docs/STAGE5_SPEC.md §C, §I; owner decision 89)

**Status: merged (#34). `austerlitz-command-map.html`: 1,441,684 bytes, md5 `96b401b321927f465c97194c113d6969`**
(was 1,433,308 bytes, md5 `a8db7a17…`, Stage 5B).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`; the reference does not move. No event, time,
  window, grade or any other data change: the windows are read through `evWindow`, as before. Presentation only.
- Recorded with this part: Stage 5B merged (#33); the owner's answer to question 6, decision 89 (`docs/STAGE5_SPEC.md` §0.4): an
  interval's marker at its start, one event clock.

**Before building (fact).** `main` (5d06c40, 5B merged as #33) matched `check:baseline` (md5 `a8db7a17…`, 1,433,308 bytes).
`tools/stage5/report-5c.js` measured it as the "before" (`AUSTERLITZ_HTML`, the same build).

**What changed** (`app.js`, `style.css`)
- **One event clock, the start** (decision 89; `evClock`): an event's marker stands at its start, and its click or Enter, the
  previous/next event keys (`eventTimes`), the dossier's "Go to this moment" and the map layer's event names give the start, as the
  themes, the tour (`momentOf`) and the dwell (decision 75) already did. Before, an interval's marker, its click, the event keys and the
  dossier took the midpoint: the counter-march's marker stood at 06:07 while its theme moment and its dwell were at 04:15.
- **Each interval a bar** on the timeline (`buildTimeline`, `EV_BAR`): 2 px tall in the event row, under the diamonds, from its start
  to its end, in its side's colour, in up to four lanes packed in start order (a lane free 5 minutes after its last bar ends). No new
  row: the timebar's height does not change. Instants stay diamonds alone. The bar lights with its marker (`.on`, `.dw`) and with a
  theme's moments (`.inth`); it is hidden from assistive technology, and the marker's name carries the window ("04:15 to 08:00, ...
  (an interval: the hour is not fixed)"), as does the map layer's event name.

**Measured, before and after** (`tools/stage5/report-5c.js`; `docs/stage5-evidence/5c-report.md`, `5c-sheet.jpg`)
- **The timebar** 90.5 px in Study and 92.0 in Watch at 1600 x 900, 1280 x 720 and 1024 x 768, before and after (Stage 3C: at most 92).
- **The bars**: 11 for the 11 intervals, 4 lanes, in a band 9.5 px deep ending 3 px above the hour numerals; the shortest 37.4, 29.8 and
  23.7 px; every edge within 0.03 px of its window; 0 over a numeral, 0 overlapping in a lane; the lowest contrast against the timebar
  4.86 (dark theme; the self-test reads 4.34 at the lowest in the paper map's), at least 3:1.
- **The markers**: every one at its event's start within 0 px at every size (before: up to 210.5 px away, the counter-march, at 1600 px
  wide; 167.7 at 1280, 133.4 at 1024). The next-event key from 04:00 stops at 22 minutes (21 starts and the day's end; three pairs of
  events share a start), where it stopped at 24 midpoints.

**Tests** (none loosened; new, or changed to the decided rule)
- **Self-test**, new: each interval a bar and none for an instant, its edges within 1 px of `tlPc` of its window, at most four lanes,
  none overlapping in a lane, none over an hour numeral, the timebar's height unchanged; the bars at 3:1 or more against the timebar in the
  dark and the paper themes (non-text contrast: §C.4 proposed it for `check:contrast`, which reads text only, so it is here); one event
  clock (every marker at its start within 1 px, among the event keys' stops, its `momentOf` and its dwell at the start; an interval's
  dossier "Go to this moment" at its start). Changed, decision 89: the marker-name check accepts an interval's window ("hh:mm to hh:mm,
  ..."); before, it required one clock.
- **Harness**: the marker Enter by real key presses compares the clock with the marker's own minute (now the start; before, the midpoint).
- **`runtime-test.js`**: the forward event jumps assumed every event's minute distinct (at least 23 hops); now they must stop exactly
  once at every distinct start after 04:00 and then at the end (22 hops): exact, where it was a lower bound.

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard (`binding-test.js` 381 checks, 0 failed; `runtime-test.js`: the event jumps reach
  both ends in 22 hops).
- `npm run check:baseline`: moved to this build (md5 `96b401b3…`, 1,441,684 bytes); passes.
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:contrast`: 4,456 text elements in 28 states (as on 5B), 0 below AA, 0 below 10.5 px.
- `npm run check:visual`: all checks passed: 20 views, the day's light, the valley fog's hours, the horizon, the key tests (the event
  marker's Enter on the counter-march: the clock to 04:15, its start); the self-test 166 of 166 (163 on 5B: the three above); the two
  known Canvas2D warnings.

**Not done, or open**
- The bars do not soften by the event's grade (§C.3 item 5; the grade is the dossier's) and phases get no bar.
- Run at 1024 x 768 outside the harness, the self-test fails five checks on this build and identically on the 5B build (the paper map's
  scale bar reads 0 px at that width; d'Hautpoul's dropped counter not reached by hover): not caused by 5C and not in any harness view
  (the harness runs the self-test at 1600 x 900); recorded, not fixed here.

## 2026-10 · Stage 5B: spatial confidence (docs/STAGE5_SPEC.md §A, §I; owner decisions 85-88)

**Status: merged (#33). `austerlitz-command-map.html`: 1,433,308 bytes, md5 `a8db7a17df01acaed029d5d4010252ff`**
(was 1,416,737 bytes, md5 `e1fac9ea…`, Stage 4E).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`; the reference does not move. No data,
  geography, chronology, order of battle, track, grade, event or `OVERLAYS` change; the grades are read through `confAt`, not changed.
  Presentation only.
- Recorded with this part: Stage 5 Part A merged (#32); the owner's answers to questions 1-4, decisions 85-88 (`docs/STAGE5_SPEC.md`
  §0.4): on by default with a toggle; C's zone of the formation's own frontage; A as its crisp footprint; between anchors the weaker grade.

**Before building (fact).** `main` (9b969e1, Part A merged as #32) matched `check:baseline` (md5 `e1fac9ea…`, 1,416,737 bytes).
`tools/stage5/report-5b.js` measured it as the "before" (`AUSTERLITZ_HTML`, the same build).

**What changed** (`app.js`, `symbols.js`, `shell.html`, `style.css`)
- **Each formation's position grade drawn on the ground** (`CONF`, `confPlace`): the grade as the app computes it (`confAt`: between
  two anchors, the weaker one's; decision 88), from the footprint primitive (decision 34): A its crisp footprint (frontage W0 x sw by
  depth D0 x sd, ground scale; decision 87), B a soft frontage (the frontage doubled, its outer halves feathered, the depth crisp), C a
  diffuse zone of radius its own frontage, falling from the centre (decision 86). The side's colour; no dash, no new hue (decisions 1,
  4, 15). Opacities 0.62, 0.55, 0.45; dimmed formations at 0.45 of them. The sizes are design values, said so in the legend and the
  sources sheet ("drawn sizes, not measured errors").
- **Everywhere, on by default** (decision 85): under the figures at 4x and 10.33x, in place of the 1x footprint at true scale (A at the
  footprint's own 0.85 opacity; with the toggle off the 1x footprint is drawn crisp, as before), and under the counters on the paper map,
  where B's frontage and C's zone are capped at a quarter of the free rectangle's shorter side, never below the footprint. A "Position
  confidence" toggle in the layers panel.
- **Each mark is a patch of the drawn ground's own cells** (the same diagonal as `groundY`), every node 0.25 units above the ground,
  shaped by the grade's mask: it never cuts under the ground at any factor (a plane draped at its vertices did, at 10.33x).
- **A text carrier in the landscape** (§A.4 item 4): each formation's name carries its grade's badge (B, C, or "?" when reported only),
  as the counter does (decision 4); the legend's badge row shows wherever names or counters are drawn.
- **The legend**: one row per grade drawn on screen (the data's own definitions, a swatch of its shape in the text colour) and the
  sentence on the sizes. **The sources sheet**: a sentence on how the grade is drawn (written by the app; `SOURCE_NOTE` unchanged).

**Decisions taken while building it** (`docs/STAGE5_SPEC.md` §I, "5B, as delivered")
- **The drape as a decal**: one vertex per world unit still cut under the ground at 10.33x (the self-test: 46 of 110,313 points, 0.375
  units under, on the Zuran); the ground-cell patch lies exactly at its lift (0 of 319,740 points under at each factor).
- **The paper map's cap keeps the footprint**: capping the whole mark at close zoom drew a B or C formation smaller than its footprint.
- **The name's badge at the name's size** (12.5 px): drawn at the counter badge's 10.5 px, `check:visual` held it to the 12 px floor of a
  name (decision 16: what is needed to follow the battle), and 13 views failed; on a name the badge is read with the name.
- **The marks cover more than the prototype measured** (Part A §A.3): as rendered 3.3-15.2% of the free rectangle in the 4x views
  (prototype 1.8-10.7%), 19.2% in the low Pratzen view at 1x, 0.9-15.1% on the paper map. Inference, not verified: the prototype's coarse
  planes sank under the ground between their vertices. The harness's cap is set from this build (20% landscape, 16% paper map).

**Per view, before and after** (`tools/stage5/report-5b.js`; `docs/stage5-evidence/5b-report.md`, `5b-sheet-before.jpg`, `5b-sheet.jpg`)
- **Drops** within `DROP_LIMIT` in every view: watch-selected 3 to 4 (limit 8), pratzen-low 5 to 4, every other unchanged.
- **Map text** 0 below AA in every view; the lowest contrast in a view at most 3.68 lower (pratzen-low 11.94 to 8.26).
- **Solid near-black** unchanged (at most 0.020%); **mean luminance** within 3.8; **the world pass** (software WebGL, the 14 views at 4x and
  10.33x) 4.4-10.2 ms against 4.4-6.8 ms before, on average 5.9 against 5.2 ms: up to 32 more transparent meshes; not measured on a GPU.
- **The marks' share** of the free rectangle: 3.3-15.2% (4x), 2.2-21.2% (1x), 3.5-9.0% (10.33x), 0.9-15.1% (paper map).

**Tests** (none loosened; new or stricter)
- **Self-test** (163 checks, was 157), new: at each factor, every mark sampled every 0.5 units across its triangles, none under the drawn
  ground, its nodes at their lift; once, at 20 clocks, every formation on the field drawn at its `confAt` grade, at its size, in its
  side's colour, with its grade's mask; in the landscape every drawn name with its grade's badge; on the paper map, close on Sokolnitz,
  B and C held between the footprint and the cap. Changed, a decided rule (§A.4 item 4): the legend's badge row expected wherever names
  or counters are drawn (was: counters only), and the grade rows checked against what is drawn.
- **Harness**: new, in every view the marks' share of the free rectangle as rendered (`measure.js` `confShare`, the view drawn once more
  without them) at most `CONF_SHARE` (20% landscape, 16% paper map).
- **`css-test.js`**: new, the marks' functions draw no dash, their colour is the side's token, the toggle on by default.
- **`runtime-test.js`**: new, a dry run (every formation on the field at 09:50 with its grade's mark; none drawn when switched off); its
  three.js stand-in's attributes gain `setXYZ`.
- **Height guard**: four new call sites classified (`confPlace` presentation; `confDrape`, `confChecks`, `confDayChecks` test); the
  2B footprint's `placeFootprint`, now unused and removed with `makeFootprint`, unclassified.

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard (`binding-test.js` 381 checks, 0 failed).
- `npm run check:baseline`: moved to this build (md5 `a8db7a17…`, 1,433,308 bytes); passes.
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:contrast`: 4,456 text elements in 28 states (4,250 on 4E: the names' badges and the legend's grade rows), 0 below AA,
  0 below 10.5 px.
- `npm run check:visual`: all checks passed: 20 views (the marks' share of the free rectangle in 18 of them, at most 19.2%, pratzen-low-1x,
  against 20%; on the paper map at most 15.1%, paper-close, against 16%), the day's light, the valley fog's hours, the horizon, the key
  tests; the self-test 163 of 163; the two known Canvas2D warnings. A first run at 10.5 px badges failed 13 views on the names' 12 px
  floor (recorded above); the run reported here is on the committed build.

**Not done, or open**
- The marks' look (their opacities, the zone's falloff, how the near zones dominate the low views) is for the owner's eye.
- The marks are not drawn for aggregates (each leaf carries its own); "reported only" is drawn at its grade, not as a C zone (§D.5, 5E).
- Frame cost not measured on a GPU (software WebGL only); the redrape while the clock plays is not timed separately.
- Historical: nothing. The grades are the data's; their drawn sizes are design values, stated as such.

## 2026-10 · Stage 5 Part A: evidence made visible, the specification (docs/STAGE5_SPEC.md)

**Status: merged (#32). No source file changed; `austerlitz-command-map.html` is unchanged: 1,416,737 bytes, md5
`e1fac9ea08a4c2b2eaefe5b78529c843` (Stage 4E).** `check:baseline` does not move.
- Recorded with this part: Stage 4E merged (#31), here, in `CLAUDE.md` and in `docs/STAGE4_SPEC.md`; Stage 4 is complete.

**Before writing (fact).** `main` (407cda0, Stage 4E merged as #31) matched `check:baseline` (md5 `e1fac9ea…`, 1,416,737 bytes).

**What this part is.** `docs/STAGE5_SPEC.md` specifies the roadmap's Stage 5 line ("evidence made visible": spatial confidence, the
evidence skeleton, interval events on the timeline, "Whose eyes?" with eye-level views from the command posts, plan ghosts,
day-tracks) and what the records add to it (problem 9's interim ring, Stage 2's eye-level dependency, Stage 4's fog as a reading):
for each, what exists today with file and line, measurements by probes on the built page at 1x, 4x and 10.33x, a recommendation, and
what must hold; a test plan (§H), a pull-request plan for 5B-5G (§I) and thirteen questions for the owner (§J). Probes in
`tools/stage5/` (not bundled); evidence in `docs/stage5-evidence/` (its README lists every file, its section and its script).

**Found (fact; each stated in §0.3, none resolved here)**
- The interim ground ring by grade (problem 9) was never built; the landscape still shows no grade (names carry no badge).
- "Whose eyes?" does not need true-scale relief for its reading: over the drawn ground with the eye's metre scaled, line of sight
  agrees with the model's for 75 of 75 headquarters-formation pairs at 1x, 4x and 10.33x. The picture does need it; and at every
  factor the drawing (the 1x footprint's 16 m lift, the miniature figures) shows 17-23 of 55 formation-readings the model hides.
- The Command view is not labelled a model reading (`shell.html:58`); its text still describes the broken outline decision 4 removed
  (`app.js:2741`); "reported only" is never marked in the landscape.
- The Command view's reading is cached per phase (`app.js:2647-2649`): 65 of 1,074 French and 50 of 1,562 Allied drawn readings are not
  the rule's at the clock.
- `KNOW_OVERRIDE`'s 15 "documented limits" and `COMMAND`'s 46 statements name no source; the overrides decide 29% and 51% of the two
  headquarters' readings.
- A duplicate key: `heightguns` phase 8 carries `cf:"C"` and `cf:"B"` (`data.js:178`, `:180`); the app computes B.
- No timing is graded A; all 20 explicit timings are "app narrative, unsourced". A grade gives no distance: any zone size is a design
  value. 67.5% of the day's formation-samples are interpolated.
- An event's clock is its midpoint for the marker and keys, its start for themes, the tour and the dwell.
- The timeline has 0-1.5 px under Stage 3C's 92 px: interval bars fit only inside the existing marker band (4 lanes, measured).
- The phase-0 axis arrows lie on the plan routes (within 130 m): plan ghosts would draw them twice.
- The Plans tab, with the camera kept, exceeds the view's drop limit in 9 of 19 landscape views; no harness case opens it.

**Data tasks it would need (not done; §G.3):** the `heightguns` grade (`data.js:178`, `:180`); bases for `KNOW_OVERRIDE` and
`COMMAND`; a `SOURCE_NOTE` sentence on the model readings; a sourced positional error per anchor only if the owner wants zone sizes to
be evidence.

**Checks on this build (unchanged by this part)**
- `npm test`: all 9 suites pass, and the height guard (`binding-test.js` 381 checks, 0 failed).
- `npm run check:baseline`: md5 `e1fac9ea…`, 1,416,737 bytes; passes (not moved).
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:contrast`: 4,250 text elements in 28 states, 0 below AA, 0 below 10.5 px.
- `npm run check:visual`: all checks passed (20 views, the day's light, the valley fog's hours, the horizon, the key tests; the self-test
  157 of 157; the two known Canvas2D warnings). A first run, beside the probes, was stopped at the background job's one-hour limit
  during the self-test; the reported run ran alone.

**Not done, or open**
- Nothing is implemented. Every radius, falloff and opacity the probes tried is a design value for the measurement.
- Frame times are software WebGL on the harness machine (comparable only with one another); no GPU measurement.
- Historical: nothing changes. Stage 5 draws the grades, anchors, timings, plans and knowledge the data already holds.

## 2026-10 · Stage 4E: smoke, ice, the horizon and the palette tables (docs/STAGE4_SPEC.md §E, §F, §G, §I; owner decisions 77, 79, 80, 84)

**Status: merged (#31); with it Stage 4 is complete. `austerlitz-command-map.html`: 1,416,737 bytes, md5 `e1fac9ea08a4c2b2eaefe5b78529c843`**
(was 1,402,090 bytes, md5 `9b13adbf…`, Stage 4D). With it, every part of Stage 4 is built (4B-4E).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`; the reference does not move. No data,
  geography, chronology, order of battle, track, event or `OVERLAYS` change; `EVENTS[].forms` and the phase statuses are read, not
  changed. Presentation only.
- The first commit records Stage 4D as merged (#30).

**Before building (fact).** `main` (4fba007, Stage 4D merged as #30) matched `check:baseline` (md5 `9b13adbf…`, 1,402,090 bytes).
`tools/stage4/report-4e.js` measured it as the "before" (`AUSTERLITZ_HTML`, the same build).

**What changed** (`app.js`, `world.js`, `tokens.js`)
- **Smoke** (decision 77; `SMOKE`, `smokeAmount`, `smokePlace`): who smokes is the phase status, as before (a fighting status). How much
  follows the clock: full inside the window of any event that names the formation or a parent (`EVENTS[].forms`, through `evWeight`'s
  own lead and tail, so it eases), a residue of a quarter otherwise. Each formation's smoke is three smaller puffs along its front
  (the block's own frontage), each standing with its lower edge above the drawn ground across its width and fading toward that edge
  (the texture). On screen the smoke covers at most a quarter of the free rectangle: past it the puffs largest on screen are shrunk
  to one common size (bisection on the puffs as placed); none is culled. Dust is unchanged. No depth pre-pass (§E.2).
- **Ice** (§F.1): the meres smoother (roughness 0.58 to 0.32, the environment's weight 0.12 to 0.42), so they take the computed sun's
  sheen and the sky, and a lighter shore-ice rim (the outer 14% of each mere, under its own edge). Outlines schematic (decision 27);
  no cracks, holes, snow or figures in the water. On the paper map the meres are as before (the rim is the landscape's).
- **The horizon** (decision 80): the sky dome's horizon colour is the fog colour itself, and the dome is centred on the eye, so the sky
  meets the haze at the eye's horizon however high it stands. No ring of distant relief.
- **The palette tables** (decision 79): the paper map's ground (the eight cover classes), contours and marsh lines in
  `TOKENS.sym.paperMap` (`ground`, `contour`, `marsh`); the landscape's colours in named tables in the code that draws them: the light
  (`LIGHT`, and `LIGHT_RIG` for the lights' fixed colours, the first sky, background and fog and the environment's ground), the sprites
  (`SPRITE_COL`: smoke, dust, the trodden ground), the ground (`COVER_COL`), the land (`LAND_COL`: roads, walls and roofs, chimneys and
  spires, trees, conifers and scrub, contours and marsh, the dome's first texture) and the water (`WATER_COL`). Every value unchanged
  from the literal it replaces. The figures', coats' and flags' colours stay where they are (Stage 6), with one exception:
- **The figures' black** (owner decision 84): their hats and black kit drawn at #2E2B27, about 2.7% reflectance (was #1B1917, about
  1%, darker than black cloth). Still black; no hue, garment or headgear changes; not a uniform claim. Stage 6 sets the figures'
  colours from sources.

**Decisions taken while building it** (`docs/STAGE4_SPEC.md` §I, "4E, as delivered")
- **No palette rebalancing** (§G.2 "only what the new light needs, measured"): the Field vantage's median luminance at 4x is 61-71 at
  10:00-16:00 (`4c-after.json`), inside its range before Stage 4 (41-85, `4b-before.json`); the valley fog's hours (08:00-09:05) are
  brighter by design (4C). The hues are unchanged.
- **The horizon already held** on the 4D build (the gap under it within 4.4 and 5.4 of the sky above, at 4x and 10.33x); 4E makes it
  hold by construction. A first attempt put the fog's linear colour into the sky's sRGB texture and drew a dark band (55-75); the
  conversion is in place.
- **The cap measured as placed**: a first estimate from the puffs' provisional heights let the low Pratzen view at 10.33x reach 25.06%.
- **The shore ice is the landscape's**, hidden on the paper map, and is kept out of `world.water` (the paper map's water check).
- **The figures' black, asked of the owner (decision 84).** The old single smoke sprite stood over the formations nearest the eye; the
  puffs and the cap uncovered them, and at the closest orbit (`pratzen-orbit-min`) the figures' black made 73 solid near-black blocks
  (0.361%, the limit 0.05%; the 4D build 5, under its smoke; 4E's puffs without the cap 28). More light barely helped (sky fill +0.16
  and fill +0.12: 61 blocks). Options put to the owner: lift the black (chosen), keep the old smoke (no cap), or defer to Stage 6.
  At #2E2B27: 7 blocks (0.035%).
- **The pad under each formation tints toward its own colour.** Its texture was a black mask, so its material colour (`SPRITE_COL.pad`,
  a dark earth) had no effect and it darkened the ground toward black; uncovered by the thinner smoke, the low Pratzen view at 14:00
  (the day's light at 4x) made 16 solid near-black blocks in the harness (36 in the probe; the 4D build 3). With a white mask the pad
  tints toward its colour: 3 blocks at 14:00, 3 at 10:00, 1 at 16:00; the view's mean luminance unchanged (82.0 to 82.2).
- **Not done:** the ice "matte where the formations cross" (§F.1); no depth pre-pass (true soft particles), as §E.2 recommended.

**Per view, before and after** (`tools/stage4/report-4e.js`; `docs/stage4-evidence/4e-report.md`, `4e-sheet-before.jpg`, `4e-sheet.jpg`)
- **The smoke's share** of the free rectangle: the Sokolnitz close view 53.3% to 24.0% (53.6% and 52.0% at 1x and 10.33x, to 24.0%),
  the low Pratzen view 41.4% to 24.0% (42.3% at 1x; 27.4% at 10.33x, to 24.0%); every other view under 9%, about as before (the Field
  vantage 8.7% to 8.5%). Sprites: three puffs where one sprite stood.
- **Solid near-black** at most 0.020% in every view (before at most 0.030%; the figures' black, decision 84); **map text** 0 below AA, the lowest contrast 6.49 (unchanged), each view
  at most 0.07 lower than before (overview-field at 1x, 8.34 to 8.27; pratzen-low at 10.33x 7.87 to 8.00, higher); **drops** unchanged in every view.
- **The ground's mean luminance** within 2.6 of before in every view (the smoke thinner: pratzen-low at 1x 74.1 to 71.5).
- **The horizon** in the low Pratzen view: 32 columns with a 35 px gap at 4x and 10.33x, within 4.4 and 5.4 of the sky (before: the same).

**Tests** (none loosened; new or stricter)
- **Self-test** (157 checks, was 150), new: at each factor, the meres and the shore ice under the lowest drawn ground on their own edge,
  and every smoke puff's lower edge above the drawn ground across its width (two views: the Pratzen vantage at 09:50, Sokolnitz at
  08:20); once, at 20 clocks, a formation smokes only with a fighting status and at full only inside a naming event's window.
- **Harness**: new, in every landscape view the smoke's share of the free rectangle at most 25% (`measure.js` `smokeShare`, read from
  the scene, not from the app's cap); in the low Pratzen view at 1x, 4x and 10.33x the gap under the horizon within 10 (of 255) of the
  sky above it, the map text hidden.
- **`css-test.js`**: new, every colour literal in `world.js` in its tables, in `app.js` in the light's and the sprites' tables or in
  Stage 6's figure functions; the paper map's ground read from the tokens.
- **Test setup**: `tools/mk-world-mod.js`, `test.js` and `terrain-test.js` load `tokens.js` before `world.js`, as the build does;
  `runtime-test.js`'s three.js stand-in has `RingGeometry` and `Color.convertLinearToSRGB`.
- **Height guard**: one new call site classified (the self-test's checks: test).

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard.
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage4d-9b13adbf.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:visual`: all checks passed, 20 views (the smoke at most 24.0% of the free rectangle in every landscape view; the
  closest orbit, `pratzen-orbit-min`, 6 solid blocks), the day's light (the largest solid near-black 0.014%), the valley fog's hours,
  the horizon (the gap under it within 4.7 and 5.3 of the sky at 4x and 10.33x), the self-test 157 of 157; Play by Space at ½×, the
  Watch dwell, the slider and the 3E keys by real key presses. The two Canvas2D `willReadFrequently` warnings are the known ones.
- `npm run check:contrast`: 4,250 text elements in 28 states, 0 below AA, 0 below 10.5 px (4,244 on 4D; the six more were not
  traced to a state: 4E adds no interface text).
- `npm run check:baseline`: moved to this build; passes.

**Not done, or open**
- The smoke's look (a quarter's residue where no live event names a fighting formation; three puffs; the cap in close views) and the
  ice's sheen are for the owner's eye.
- The frame cost of the extra puffs is not measured on a GPU (software WebGL only).
- Historical: nothing. Who smokes is the record's phase status; how much follows the events' own windows; the ice is the data's
  "frozen" mere, its outline schematic.

## 2026-10 · Stage 4D: pacing (docs/STAGE4_SPEC.md §D, §H, §I; owner decisions 74-76, 78, 83)

**Status: merged (#30). `austerlitz-command-map.html`: 1,402,090 bytes, md5 `9b13adbf7c481e36585fae9eb8ac1be1`**
(was 1,376,800 bytes, md5 `622634ef…`, Stage 4C).
- `check:baseline` moves to this build.
- **A one-word data change (decision 76).** `check:data` against the old reference (`archive/spine-6b2cccd4.html`): exactly one data
  declaration changed, `SOURCE_NOTE`. In decision 56's sentence (the slow frame and the relief control) "1.2 minutes at normal speed
  (4.8 at four times speed)" becomes "1.2 minutes at 1× (4.8 at four times speed)": with Play starting at ½×, "normal speed" no
  longer names 1×. What was: "at normal speed"; what is: "at 1×"; why: the default speed changed (decision 74); the figure is
  unchanged and still true of 1× (a frame step is capped at 120 ms; 10 clock minutes a second). No historical claim changes. The
  reference moves to this build, `archive/stage4d-9b13adbf.html`; against it all 113 data declarations are identical.
- No geography, chronology, order of battle, track or `OVERLAYS` change; `legWindow`, `legPath` and the arrows' anchors are read,
  not changed (`binding-test.js`: every derived arrow's ends are its anchors exactly).
- The first commit records Stage 4C as merged (#29).

**Before building (fact).** `main` (71ffd88, Stage 4C merged as #29) matched `check:baseline` (md5 `622634ef…`, 1,376,800 bytes).
`tools/stage4/report-4d.js` measured it as the "before" (`AUSTERLITZ_HTML`, the same build).

**What changed** (`app.js`, `shell.html`, `style.css`, `data.js`)
- **Play starts at ½×** (decision 74): `speed` 0.5 and its button pressed; the buttons keep their meaning (½×, 1×, 2×, 4×).
- **A dwell at each event start** (decision 75; `DWELL`, `dwellAdvance`): while the clock plays it eases to a stop at each of the
  distinct event start minutes, holds 1.5 s with the event's marker lit and its name (or both names, where two events start
  together) in the caption, and eases back. Each ease covers a quarter second's travel at speed in half a second, so the clock's rate
  is continuous; where two starts are closer than that, half the gap. A dwell adds 1.5 s plus its eases (2.0 s where they are whole).
  The start the clock stands on when Play is pressed does not dwell (04:00 from the day's start: 21 dwells). Scrubbing, the keys, the
  phase and act buttons, the tour and the themes stop the clock and never dwell; the dwell stays under reduced motion (it is time,
  not motion). The day plays in 3 min 30 s at ½× (2 min 48 s before), 2 min 6 s at 1×, 83.5 s at 2×, 61.3 s at 4×. A toggle, "Pause
  briefly at events", on by default, in a new "Playing" section of the layers panel.
- **Follow while the clock plays** (decision 78; `FOLLOW`, `followStep`): with Follow on and the clock playing, the eye's target
  eases toward the weighted centre of the live events, its distance toward 2.4 x their spread + 130 units (230-300), its direction
  toward the phase's authored view; time constant 1.5 s; the target's move across the screen held to 150 px/s by slowing; every
  step through the floor. While playing the phase boundary's glide is not used; when the clock stops the view stays; a phase or act
  button, a vantage, a theme or a tour stop glides to its view as before; any pan, orbit, zoom or double-click turns Follow off
  (decision 47, unchanged). Under reduced motion the eye moves only at each event start, at once. Not on the paper map.
- **Derived arrows draw on with the clock** (decision 83, "ghost and progress"; `DRAWON`, `drawOnArrows`): each of the 17 arrows
  derived from an executed leg is always drawn whole and faint (0.4 of its opacity), its head at the destination and its label as
  before; over it the part the formation has marched is drawn at full strength from the start to the formation, without a head.
  Once the leg is complete the arrow is drawn at full strength, exactly as before 4D. The 19 interpretive arrows, lines, boundaries
  and halt bars keep the phase change's fade. Under reduced motion every arrow is whole. Derived arrows are kept to their path:
  points every 2 units along each segment, so the curve no longer bulges off the formation's route between its points.
- The layers panel's Follow title, the caption's and the marker's dwell styles (`style.css`, from the existing tokens).

**Decisions taken while building it** (`docs/STAGE4_SPEC.md` §I, "4D, as delivered"; §0.4)
- **The draw-on, asked of the owner (decision 83).** §D.3 item 4 ("not drawn before the leg starts, the head at the tip") would
  have left 12 of the 17 derived arrows undrawn at every phase start, since their legs run from the phase's first minute to its last,
  and whole only as their phase's overlay is replaced; and a head at the tip lies under the moving formation's own counter, against
  Stage 2D's rule that nothing is drawn over a head (the self-test found labels over moving heads on the paper map). The owner chose
  "ghost and progress" over "only while playing", "as specified" and "leave it out".
- **Follow's distance 230-300 units**, not §D.2's candidate 86-274: over the day the candidate's distances (about 140-200, where every
  brigade is labelled) made the map layer drop 19-20 items (the self-test's limit 19; the harness's run at 4x 20). Tried: 86-274
  (19 at 4x), 110-274 (19), 86-160 (21 at 10.33x), 200-274 (18), 230-300 (11-12), 255-320 (11-12). The action is framed wider than
  most phase views (92-212 units in phases 1-8); a zoom turns Follow off.
- **The arrows kept to their path** (points every 2 units): the drawn end could not meet the formation within 0.5 units while the
  curve bulged up to 1.4 units off the path (Vandamme, phase 3); now at most 0.13 (the report: 0.09). The arrows' ends and labels are
  where they were; their shapes follow the modelled route more closely between its points.
- **The dwell adds 2.0 s, not §D.3's 2.5 s** (the ease is counted once each way); 04:00 does not dwell.
- **§D.4's harness case** is a check in the key tests (Play by a real key press; the low Pratzen case in Watch held in the dwell at
  09:00), not a new case (no new unobstructed baseline).
- **The self-test's layer check counts only the heads drawn** (`o.visible`), as the harness's own measure (`measure.js`,
  `effVisible`) always has; before 4D every head was drawn. No threshold changed.

**Per the report** (`tools/stage4/report-4d.js`; `docs/stage4-evidence/4d-report.md`, `4d-before.json`, `4d-after.json`): Study at
1600 x 900, the default factor, Follow on, the day played in 50 ms steps.
- Every live event in the free rectangle: 71.1% of the day's minutes at ½× before 4D (the phase glide), 92.7% with 4D; at 1× 73.1% and
  92.4% (Part A's §D.2 measured 71.1% and 73.1% for the glide).
- The ground's speed across the screen: the glide's 95th percentile 146-288 px/s and its largest 853; with 4D 54-72 and at most 150.
- The map layer's drops every 10 minutes: at most 16 (½×) and 19 (1×) before, 11 with 4D; the mean 5.9 before, 6.8 with 4D.
- The floor: no clamp in any run; the lowest clearance 36.6 before, 57 with 4D.
- The draw-on: the marched part's end at most 0.09 units from the formation over 20 clocks of each derived arrow.
- The harness views (at their clocks): in 9 a derived arrow shows its marched part over the faint whole arrow, in 6 (at a phase's
  first minute) only the faint whole arrows; none is at full strength. The map layer's drops are the same as before 4D in every view.

**Tests** (none loosened; new or stricter)
- **Self-test** (150 checks, was 141), new: at each factor, the day at ½× under Follow (never under the floor; every live event
  in the free rectangle in at least 80% of its minutes; the target's screen speed within 150 px/s; drops never above 19) and the
  draw-on (20 clocks inside each derived arrow's legs: the marched part's end within 0.5 units of the formation, no head on it, the
  whole arrow drawn faint, at full strength after); once, the dwell's dry run at ½×, 1×, 2× and 4× in its computed length within 1 s
  with one dwell at each event start after 04:00, no dwell when the clock is moved while playing or by the time keys, and reduced
  motion (the dwell kept, the camera moved only at event starts, every arrow whole).
- **Harness**: new, Play by a real key press runs at ½× with its button pressed; the low Pratzen case in Watch held in the dwell at
  09:00 within the darkness limit, map text at AA, drops within its limit, its marker lit and its name in the caption.
- **`binding-test.js`**: new, only an arrow derived from an executed leg (`a.leg`) draws on; no line, boundary, halt bar, objective
  or plan does.
- **`runtime-test.js`**: new, the dwell's dry run at four speeds (its length, one dwell at each start, the clock monotone and never
  faster than its speed).
- **`css-test.js`**: new, the default speed and its pressed button, the dwell's toggle on, no phase glide while playing.
- **Height guard**: four new call sites classified (Follow's target and the drawn-on shaft's end: presentation; the self-test's day
  under Follow: test).

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard.
- `npm run check:data`: against the old reference exactly one data declaration changed (`SOURCE_NOTE`, above); against the new
  reference (`archive/stage4d-9b13adbf.html`) all 113 identical.
- `npm run check:chronology`: 0 errors.
- `npm run check:visual`: all checks passed, 20 views, the day's light (the largest solid near-black 0.014%), the valley fog's hours,
  the self-test 150 of 150 (the day under Follow: every live event in the free rectangle in 91.6-92.7% of minutes, drops at most 13,
  the screen speed at most 150 px/s; the draw-on within 0.086 units; the day at ½× in 210.0 s with 21 dwells); Play by Space at ½×
  (its button pressed); the low Pratzen case in Watch held in the dwell at 09:00 ("Thiebault's brigade clears Pratzen village"):
  0.000% solid, 0 below AA, drops 3 (limit 13), its marker lit; the slider and the 3E keys by real key presses. The two Canvas2D
  `willReadFrequently` warnings are the known ones.
- `npm run check:contrast`: 4,244 text elements in 28 states, 0 below AA, 0 below 10.5 px (as on 4C).
- `npm run check:baseline`: moved to this build; passes.

**Not done, or open**
- The draw-on's look (the faint whole arrow at 0.4) and Follow's wider framing (230-300 units) are for the owner's eye.
- The frame cost of Follow and the draw-on is not measured on a GPU (software WebGL only).
- The dwell holds the same 1.5 s at every speed; at 4× the eases between close starts are short (an eighth of a second at 08:25-08:30).
- Historical: nothing. The pacing is presentation; the event starts are the data's own times, read, not changed.

## 2026-10 · Stage 4C: the atmosphere (docs/STAGE4_SPEC.md §B, §C, §H, §I; owner decisions 72, 73, 80, 81)

**Status: merged (#29). `austerlitz-command-map.html`: 1,376,800 bytes, md5 `622634ef37c67e5ae9e9a921228ab0c7`**
(was 1,367,134 bytes, md5 `3d6d2295…`, Stage 4B).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/spine-6b2cccd4.html`; the reference does not move. No data,
  track, text of the record or `OVERLAYS` change. Presentation only. `PHASES[].mist` (guarded) is read, not changed; the knowledge
  rule (`knowledgeOf`), line of sight and the viewshed are untouched.
- The first commit of this branch's records notes Stage 4B as merged (#28).

**Before building (fact).** `main` (b6051da, Stage 4B merged as #28) matched `check:baseline` (md5 `3d6d2295…`, 1,367,134 bytes);
`tools/stage4/report-4b.js` measured that build as the "before" of the table below.

**What changed** (`app.js`, `world.js`, `shell.html`)
- **One atmosphere in the fog chunks** (`ATMO`; §B.3, §C.5): three.js's `fog_*` shader chunks are replaced before any material
  compiles, so every fogged material (ground, figures, trees, houses, sprites, lines) draws the same haze and valley fog from shared
  uniforms (`applyAtmo`, each frame). Both are computed in the true geometry: the ray's vertical divided by the display factor,
  heights in metres through `GEOREF.DATUM_M` and `GEOREF.M_PER_WORLD` (no scale of its own). `atmoAt` is the same formula in script,
  for the self-test and the measurements.
- **The haze** (decision 81): exponential in height (scale height 400 m above the valley floor's 200 m), counted only beyond the
  orbit target's distance from the eye, so the subject is never hazed and what lies behind it recedes. It replaces `THREE.Fog`'s
  linear near and far and Stage 3D's recession (`fogShift`, removed). Its one parameter, an equivalent visibility, is in the light
  table (`LIGHT_VIS`, 40-120 km, design values: a depth cue, not the day's air); the sources sheet says the day's visibility is not
  recorded. The sky dome's horizon is already drawn in the fog colour, so haze and sky meet (decision 80; nothing added).
- **The valley fog** (decisions 72, 73): a layer whose top is the Command view's own: `knowledgeOf` treats a formation as
  "uncertain" while the phase's mist exceeds 0.5 and it stands below model height -0.8, so the top is drawn at
  `GEOREF.elevM(-0.8)`, 238.2 m (derived), and the self-test holds the two together. Its amount is `PHASES[].mist`, eased over the
  first 20 minutes of each phase so nothing steps; as the amount falls below 0.9 the top sinks by up to 20 m (the heights clear
  before the valley, as the phases' texts have Soult climb out of the fog). It is counted from the eye, with an exponential edge of
  6 m above the top, and drawn at most 55% opaque, so the figures in it stay visible; its colour is the light table's mist colour.
  The evening values of `PHASES[].mist` (0.22, 0.30; no text mentions them) are drawn as a thin haze and labelled modelled.
- **The mist sheets are gone** (§C.5): `buildMist` keeps an empty, hidden `world.mist` group (so nothing that names it breaks);
  the sheets, their drift and their phase fades are removed, with the haze sheet.
- **Labels**: the legend's valley-fog row, shown only while the fog is drawn ("valley fog: the narrative's; depth (238 m) and
  lifting modelled; drawn see-through"); two sentences in the sources sheet's "How the light is drawn" (`lightNotes`, a
  presentation note, not `SOURCE_NOTE`): the fog is the narrative's, its top the Command view's height, its depth and lifting
  modelled, the evening mist modelled; the haze a depth cue, the day's visibility not recorded.
- The paper map draws neither haze nor fog (as before: its `staff` preset's fog amounted to none).

**Decisions taken while building it** (measured; `docs/STAGE4_SPEC.md` §I, "4C, as delivered")
- **The day fill is 0.52** (4B: 0.36). The mist sheets had faintly lifted the low Pratzen view's dark foreground conifers; without
  them that view showed 10 solid near-black blocks, at the 0.05% limit. At 0.52 the worst view is 0.030% (6 blocks); the sky fill
  lift barely helped.
- **The haze's visibilities are five times the physical ones** Part A tried (§B.2: 8-25 km). At those the ground's mean luminance
  rose 17-29 above 4B in four views, against §B.4's ±15; at ×4 the fitted Overview and selected-formation were still 8 and 15 up.
- **The fog's edge is 6 m** (15 m first): softer, a point 20 m over the top kept too much fog for §C.6's check.
- **§C.6's harness views are a loop, not new cases** (`FOG_VIEWS` in `thresholds.js`, after the day's light): the Field vantage at
  08:00 and the low Pratzen view at 08:30 at 4x, with the darkness limit, AA as rendered, the case's drop limit, formations drawn
  under the fog and the fog at most its cap. New cases would have needed new unobstructed baselines.
- **§B.4's ±15 luminance is a measured design target, not a check**: it holds in every landscape view outside the fog's hours
  (08:00 to 09:05, when the lifting's ease ends) within 13.3 (selected-formation), and through the day at 4x within 15.2 (the low
  Pratzen view at 16:00, 0.2 over); in the fog's hours the ground is 18-60 brighter (the Sokolnitz close view at 08:20 and 10.33x
  the most), where the white fog is the change. A permanent check would have
  to exempt exactly those views; recorded here instead.
- **§C.6's top check reads a slanting ray** (1 in 10, from 300 m above the top) rather than a vertical one, and "not fogged" 20 m
  over the top as at most a quarter of the cap: a vertical ray from above measures only the edge's own depth.

**Per view, before and after** (`tools/stage4/report-4b.js`; `docs/stage4-evidence/4c-report.md`, `4c-sheet-before.jpg`, `4c-sheet.jpg`)
- **Solid near-black** at most 0.030% in every landscape view at 1x, 4x and 10.33x, through the day at 4x and in the fog's hours
  (4B: at most 0.035%).
- **Map text**: 0 below AA everywhere; the lowest contrast 6.49 (hybrid-dimmed, unchanged); in each view at most 0.91 lower than
  on 4B (the low Pratzen view at 08:30, 8.41 to 7.50, over the white fog).
- **Drops** unchanged in every view.
- **The ground's mean luminance**: outside the fog's hours from 6.7 lower (overview-field at 1x) to 13.3 higher
  (selected-formation), and through the day at 4x at most 15.2 higher; in the fog's hours (08:00-09:05) 18-60 higher (the fog).
- **The atmosphere** (the page's own `atmoAt` over the free rectangle's ground): the haze at the orbit target 0 in every view; the
  mean haze 0.014-0.205; at 08:00-08:30 the valley fog 0.31-0.54 (cap 0.55), its top 238.2 m.

**Tests** (none loosened; new or stricter)
- **Self-test** (141 checks, was 135), new: at each factor, the fog's top at 238.2 m at 08:00, 08:30 and 08:44 (1 m under it at
  the cap, 20 m over it at most a quarter of it), and the haze 0 at the orbit target from every vantage (the focus uniform equal to
  the eye's distance to it) with the fitted Overview's mean haze at most 0.25 at 4x and 0.45 at 1x and 10.33x; once, the Command
  view's "uncertain" equal to the enemy formations in line of sight under the drawn top in phases 0-2 from both headquarters, the
  fog's amount continuous (no one-minute change over 0.06; the largest 0.055), whole while the mist exceeds 0.5 and the phase's
  own value once eased, and neither haze nor fog on the paper map, `fogShift` gone. The mist-sheet edge check goes with the sheets.
- **Harness**: new, the valley fog's hours (`FOG_VIEWS`), as above.
- **`css-test.js`**: new, no `fogShift`, no mist sheets, the fog chunks and `applyAtmo` present, the fog's top and the knowledge
  rule both -0.8, the legend's fog row.
- **`runtime-test.js`**: the mist test reads the valley fog's colour (darker before dawn than at midday) and asserts the mist
  sheets are not drawn.
- **Height guard**: the self-test's two new call sites classified (test).

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard.
- `npm run check:data`: all 113 data declarations byte-identical to `archive/spine-6b2cccd4.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:visual`: all checks passed, 20 views, the day's light (24 renders, the largest solid near-black 0.014%), the
  valley fog's hours (the Field vantage at 08:00 and the low Pratzen view at 08:30: 0.000% solid, 0 below AA, drops 10 and 3 within
  11 and 13, 15 formations drawn under the fog in each, the fog at most its cap 0.55), the self-test 141 of 141; the slider and
  the 3E keys by real key presses. The two Canvas2D `willReadFrequently` warnings are the known ones.
- `npm run check:contrast`: 4,244 text elements in 28 states, 0 below AA, 0 below 10.5 px (4,227 on 4B; the 17 more include the
  legend's new row).
- `npm run check:baseline`: moved to this build; passes.

**Not done, or open**
- The frame cost of the chunks is not measured on a GPU; software WebGL's frame times are not usable for it (Part A, §B.2).
- The fog at 55% whitens the villages and woods in the valley strongly at 08:00-08:30 (`4c-sheet.jpg`, the Sokolnitz close view);
  for the owner's eye (decision 72).
- The haze's visibilities and the fill are design values tuned on the harness views; the Stage 0 darkness limit and AA held at
  each step.
- Historical: the fog's presence and its lifting at about 08:45 are the narrative's (the phases' texts); its depth (238 m, the
  Command view's threshold) and the manner of its lifting are modelled; the evening mist is modelled; the day's visibility is not
  recorded. Nothing here is a source.

## 2026-10 · Stage 4B: the light (docs/STAGE4_SPEC.md §A, §H, §I; owner decisions 68-71)

**Status: merged (#28). `austerlitz-command-map.html`: 1,367,134 bytes, md5 `3d6d2295bf8fbbedc60153513a3ff3e8`**
(was 1,348,542 bytes, md5 `6b2cccd4…`, the spine data task).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/spine-6b2cccd4.html`; the reference does not move. No data,
  track, text of the record or `OVERLAYS` change. Presentation only. `PHASES[].light` (guarded) is no longer read on the
  landscape: the light follows the clock; the declaration is unchanged.
- The first commit records Part A as merged (#27) and the owner's answers to §J as decisions 68-82 (`docs/STAGE4_SPEC.md` §0.4).

**Before building (fact).** `main` (5c8778a, Part A merged as #27) matched `check:baseline` (md5 `6b2cccd4…`, 1,348,542 bytes).
`tools/stage4/report-4b.js` measured it (`AUSTERLITZ_HTML=archive/spine-6b2cccd4.html`, the same build) as the "before" of the table below.

**What changed** (`app.js`, `world.js`)
- **The sun is computed** (`SUN_DAY`; decision 69): Meeus's low-accuracy solar coordinates, NOAA's equation of time and Bennett's
  refraction for the field's centre (from `GEOREF.toGeo`) on 2 December 1805, the clock read as local apparent time. Derived
  from astronomy, not a record of the day; the sources sheet says so ("How the light is drawn", `lightNotes`, a presentation note,
  not `SOURCE_NOTE`). Sunrise 07:45, sunset 16:15, at most 19.0 degrees.
- **The light's altitude is corrected to the display factor** (decision 68): tan(alt_k) = k tan(alt), so the drawn ground's lit
  side and cast shadows are the true ground's under the true sun at every factor; at 1x it is the true sun. The disc stands at the
  true altitude and is drawn only while the sun's upper limb is above the horizon.
- **One light table** (`LIGHT_BY_ALT`): every value a preset carried (intensity and colour, sky fill, fog, background, sky, mist
  colour, disc, grade) is a function of the sun's true altitude, morning and afternoon, its rows today's presets placed where each
  one's phase has the sun; interpolated from the clock. The phase change (`startPhaseTransition`) no longer moves the light; it
  fades the overlays, the mist's amount and the camera. Scrubbing gives the light of that minute. The environment map is re-made
  only when the sky's colours move by a 32nd.
- **Night and twilight** (decision 71): below -6 degrees the light is the design night light (the predawn preset's direction, not
  a moon); through civil twilight it turns to the sun.
- **No shadow toe** (decision 70): the composite no longer lifts the shadows. In its place the fill light stands opposite the
  sun's azimuth (it was fixed at azimuth 51), at 0.36 by day (0.16 at night), and the sky fill is 0.08 higher by day; both in the
  light table. The FX and non-FX paths draw shade alike.
- **No baked hillshade on the landscape**: the ground shader colours every landscape point as the flat ground (0.994); the apron
  likewise. The paper map keeps its own cartographic hillshade, the going layer its shade, the frost stays.
- **The shadow box follows the view**: fitted each frame to the ground under the free rectangle (within 1.4 x the eye's distance of
  the target, 120-700 units), 240-1,600 units square, its centre snapped to whole texels; the depth bias kept at its pre-4B size in
  world units.
- The paper map is unchanged: its `staff` light, no shadows, the fill where it stood.

**Decisions taken while building it** (measured; `docs/STAGE4_SPEC.md` §I, "4B, as delivered")
- The fill at Part A's 0.28 alone left two views at 4x over the darkness limit (selected-formation 0.076%, the low Pratzen view at
  11:00 0.079%): the figures' and houses' cast shadows. 0.36 with the sky fill +0.08 brings the worst to 0.035%.
- A shadow box fitted to a close view (112 units) drew the figures' own shadows as solid blocks; its least size is 240, the fixed
  box's before 4B.
- One coefficient of the solar formula is written `1.9993e-2`: `geo-test.js` searches the sources for the retired map scale's
  digits and took `0.019993` for it. The test is unchanged.

**Per view, before and after** (`tools/stage4/report-4b.js`; `docs/stage4-evidence/4b-report.md`, `4b-sheet-before.jpg`, `4b-sheet.jpg`)
- **Solid near-black** at most 0.035% in every landscape view, at 1x, 4x and 10.33x, and through the day at 4x (08:00-16:00 hourly,
  the Field vantage and the low Pratzen view); before 4B, with the toe, at most 0.006%; Part A measured up to 1.85% for the presets
  without the toe.
- **Map text**: 0 below AA everywhere; the lowest contrast 6.49 (hybrid-dimmed, unchanged); in each view at most 0.45 lower than
  before (overview-field at 10.33x, 8.49 to 8.04), the ground behind the plates lighter.
- **Drops** unchanged in every view; the layer's pass at most 1.4 ms.
- **The ground's mean luminance** from 4 lower (at 1x, where the drawn sun is the true one, lower than the presets') to 15 higher
  (at 10.33x, where the drawn sun is steepest) than before.
- The drawn sun at 4x: 39-45 degrees in the 09:30-10:00 views (11.6-14.1 true), 54 at noon (19.0 true).

**Tests** (none loosened; new or stricter)
- **Self-test** (135 checks, was 126), new: at each factor, the drawn light against the computed sun at 40 clocks (azimuth and
  corrected altitude within 0.1 degree; the shadow-casting light the same), and the shadow box covering the ground under the free
  rectangle from every vantage; once, the disc drawn exactly while the sun is up (07:45-16:10 in 5-minute steps), the light
  continuous in the clock (no step at a phase boundary larger than the largest one-minute change elsewhere), the toe and the
  landscape hillshade absent.
- **Harness** (`harness.js`, `thresholds.js`): new, the day's light without the toe: the Field vantage and the low Pratzen view at
  4x every hour 08:00-16:00 and three views at 1x and 10.33x, each within the Stage 0 darkness limit (24 renders).
- **`css-test.js`**: new, no shadow toe in `initFX`, no baked hillshade on the landscape, the computed sun and the light table
  present, no `LIGHT[...light]` read.
- **`runtime-test.js`**: new, the light table's two branches rise to the day's highest sun, every row names a preset, the light
  finite and from above at every minute; the stub's shadow camera and map size given the r128 members the light now uses
  (`updateProjectionMatrix`, `x`, `y`).
- **Height guard**: the self-test's new `groundY` call site classified (test).

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard.
- `npm run check:data`: all 113 data declarations byte-identical to `archive/spine-6b2cccd4.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:visual`: all checks passed, 20 views, the day's light (24 renders, the largest solid near-black 0.028%), the
  self-test 135 of 135; the slider and the 3E keys by real key presses.
- `npm run check:contrast`: 4,227 text elements in 28 states, 0 below AA, 0 below 10.5 px (4,223 on the spine build; the four
  more were not traced to a state).
- `npm run check:baseline`: moved to this build; passes.

**Not done, or open**
- The fog (linear, with Stage 3D's `fogShift`) and the mist sheets are unchanged: 4C.
- The environment map's regeneration cost under a moving clock and the shadow box's cost are not measured on a GPU (software
  WebGL only).
- The largest one-minute change of the light in the day is the disc's fade as the sun's upper limb crosses the horizon (0.22 of
  its opacity a minute at 16:12-16:15, 0.11 at 07:47-07:48; at any phase boundary the largest change is 0.02). By design (the
  disc is drawn only while the limb is up); for the owner's eye.
- Historical: the clock's basis (apparent or mean time) is a reading, not a finding (decision 69); the weather is the narrative's.

## 2026-10 · Stage 4 Part A: time and atmosphere, the specification (docs/STAGE4_SPEC.md)

**Status: merged (#27). No source file changes. `austerlitz-command-map.html` is unchanged: 1,348,542 bytes, md5
`6b2cccd44138e95e6082c82b8b2d2f8a`; `check:baseline` does not move.**
- A specification, its probes and their evidence: `docs/STAGE4_SPEC.md`; `tools/stage4/` (`ephem.js`, `sun.js`, `light-probe.js`,
  `dark-probe.js`, `fog-probe.js`, `pace-probe.js`, `extras-probe.js`; not bundled); `docs/stage4-evidence/` (with a README).
- Nothing implemented; no data, geography, chronology, order of battle or `OVERLAYS` changed (`check:data`: all 113 declarations
  identical to `archive/spine-6b2cccd4.html`). The probes inject measurement code into the running page only.
- The first commit records the spine data task as merged (#26) in `CLAUDE.md`, this file and `docs/STAGE3_SPEC.md`.

**Before (fact).** `main` (18e014b, the spine data task merged as #26): `check:baseline` passed (md5 `6b2cccd4…`, 1,348,542 bytes);
`npm test` all nine suites and the height guard; `check:data` all 113 identical; `check:chronology` 0 errors; `check:visual` all
checks, 20 views, the self-test 126 of 126; `check:contrast` 4,223 text elements in 28 states, 0 below AA, 0 below 10.5 px.

**Scope** (§0.2): the roadmap's Stage 4 line (the computed sun and continuous light replacing Stage 0's shadow toe and narrowed
landscape hillshade; the valley fog; smoke; ice; the horizon; pacing), Stage 3D's fog recession (`fogShift`), Stage 3's deferred
continuous follow, and what the records assign that the roadmap's line does not name: the terrain palette and appendix A's 3D colour
literals (`docs/VISUAL_SPEC.md`; decision 28), and opportunity 4's arrows that draw on with the clock.

**What the evidence says** (each a section of the specification; derived and measured, with the numbers there)
- **The sun** (derived, astronomy, not a record): at 49.14 N 16.76 E on 2 December 1805 it rises at 07:45 and sets at 16:15 local
  apparent time (07:34 and 16:05 mean time), south at 12:00 at 19.0 degrees. The presets show a disc before sunrise (phase 1) and
  after sunset (phases 8 and 9), a midday sun 30.4 degrees up, an afternoon sun 30 degrees too far west.
- **The display factor contradicts a true-altitude sun** (§0.3 item 3): at 08:00 the computed sun leaves 5.5% of the modelled ground
  in cast shadow at 1x, 27.2% at 4x, 59.2% at 10.33x. A sun whose vertical is scaled by the factor gives the true ground's lit side
  and shadows at every factor exactly (derived).
- **The toe still matters at 4x** (against 2B's expectation): without it four of nine landscape views at 4x exceed the Stage 0
  darkness limit (0.16-0.44% against 0.05%), two at 10.33x (up to 1.85%). Under the corrected sun three remain, mostly conifer
  crowns in shade; a fill light opposite the sun brings the worst to 4 blocks (0.02%). The baked hillshade makes no measurable
  difference under the corrected sun.
- **The fog today** does almost nothing in the harness views (a mean of at most 6% over the ground) except at the fitted Overview,
  which `fogShift` keeps clear (0.05 at the target; 0.49 without it). A haze computed in the true geometry and counted beyond the
  focus keeps every subject clear and the Overview near today's look, with no shift.
- **The model already has a fog**: the Command view's knowledge rule treats ground below 238.2 m as fogged while the phase's `mist`
  exceeds 0.5 (to 08:45). The app's texts on the fog cite no source ("app narrative, unsourced"). Drawn at that top the valley fog
  holds both of Soult's assault divisions (213 and 226 m) and leaves the Zuran and the plateau's columns above it; at 85% opacity it
  whites out the figures, at 55% they show.
- **Pacing**: the day plays in 84 s at 1x; the phase change's 2.6 s glide takes 58% of each 45-minute phase, and 12 of the 22
  events after phase 0 start inside it. A continuous follow keeps every live event in the free rectangle in 83-88% of the day's
  minutes (today 71-73%), with no floor clamp and no more drops than today's rule (largest 19).
- **Smoke** is tied to the phase status, not to engagement: only 28% of the day's smoking formation-samples are named by a live
  event; in the close and low views smoke covers 41-53% of the free rectangle. A depth pre-pass for soft particles costs about half
  the world pass in software WebGL.
- **Ice** exists already (the meres are an ice material; outlines schematic, decision 27); **the horizon** shows only in the low
  views, the apron's edge 60-78 km out and mostly fogged; a ring of real distant relief would be a data task.

**Recommendations** (§A.5, §B.3, §C.5, §D.3, §E.2, §F, §G.2) and **15 questions for the owner** (§J), each with its trade-off; the
pull-request plan 4B (light), 4C (atmosphere and valley fog), 4D (pacing), 4E (smoke, ice, horizon, palette tables) (§I) and the
test plan (§H).

**Uncertain, kept separate**
- Historical: the fog's depth and when the valley cleared are in no text of the app; its lifting at 08:45 is the app's narrative,
  unsourced; the clock basis of the sources' hours is not established (apparent and mean time differ by 10.4 minutes); the moon on
  the night is not computed (about 10 days old by the mean month, derived).
- Implementation: the frame costs are software WebGL on one machine (the fog candidates' frame cost was within ±5% of today's, the noise of the measure, and the absolute times were not usable, §B.2); the environment map's regeneration under a
  continuous light is not measured; touch and GPUs are not tried; the haze's and the fog's parameters are design values from one
  probe each, not tuned.

**Checks on this commit** (run on this tree, the build unchanged from the spine data task's; the only edit after they started is one table of `docs/STAGE4_SPEC.md`, §H.1)
- `npm test`: all 9 suites pass, and the height guard.
- `npm run check:data`: all 113 data declarations byte-identical to `archive/spine-6b2cccd4.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:visual`: all checks passed, 20 views, the self-test 126 of 126; the slider and the 3E keys by real key presses.
- `npm run check:contrast`: 4,223 text elements in 28 states, 0 below AA, 0 below 10.5 px.
- `npm run check:baseline`: passes (md5 `6b2cccd4…`, 1,348,542 bytes); it does not move.

## 2026-10 · The spine data task: themes and tour on the day's moments (docs/STAGE3_SPEC.md §C.2, §C.3; owner decisions 52, 56, 59, 64-67); two Stage 3 leftovers

**Status: merged (#26). `austerlitz-command-map.html`: 1,348,542 bytes, md5 `6b2cccd44138e95e6082c82b8b2d2f8a`**
(was 1,342,333 bytes, md5 `eb18a8ea…`, Stage 3E).
- **A data task.** Four guarded declarations change, and no others: `ANALYSIS`, `TOUR`, `PHASES` (one timeline line moved) and
  `SOURCE_NOTE` (one sentence). `check:data`'s reference moves to this build: `archive/spine-6b2cccd4.html` (identical to the
  committed build) replaces `archive/stage2c-68ac7721.html` as the reference. The Stage 2C build stays in `archive/`: the drop
  limits are derived on it (`tools/stage2/dom-layer.js`, `paper-limits.js`, `tools/stage3/offset-limits.js`).
- `check:baseline` moves to this build.
- **No new source is used or claimed.** Every clock below is one the data already carried (an event's or a phase's); the evidence
  for each change is the app's own text, as §C.3 lists it. No coordinate, strength, movement, track or `OVERLAYS` entry changes.

**Before building (fact).** `main` (a130948, 3E merged as #25) matched `check:baseline` (md5 `eb18a8ea…`, 1,342,333 bytes) and
`check:data` (all 113 declarations identical to `archive/stage2c-68ac7721.html`).

**The data model** (§C.2; decision 59: themes and tour only)
- A chapter is a **theme**: it names the **moments** it concerns (`moments`: `"ph:<phase>"` or `"ev:<event id>"`) and the
  **principal moment** it opens on (`at`). Its clock (`t`) is retired: it is the principal moment's (a phase's start, an event's
  start). Its camera (`cam`) is kept only where no phase's view shows its subject (plan, deception, weakness, cut); otherwise it is
  the camera of the phase its moment falls in, which in every such case is the camera the chapter already carried.
- A tour **stop** names one moment (`at`) and, as before, a theme, plan or feature; it takes the moment's clock and its theme's
  camera, or the moment's phase's. Exceptions, each from the stop's own text: stop 4 keeps its own clock; stops 2 and 5 keep
  their own cameras.

**Every change: was → is, and why**

| entry | was | is | evidence (the app's own texts) and why |
|---|---|---|---|
| `ANALYSIS` plan | 04:10, own camera | phase 0 (04:00); own camera kept | "Weyrother's dispositions…": the start of the day; no phase's view is the plan's overview |
| `ANALYSIS` deception | 04:10, own camera | phase 0 (04:00); own camera kept | "abandoned the Pratzen plateau on 1 December" |
| `ANALYSIS` weakness | 07:00, own camera | `telnitz` (07:00); moments `raigern`, `davout`, `telnitz`; own camera kept | "Legrand's single division held roughly five kilometres… reached Raigern only on the night of 1 December" |
| `ANALYSIS` commitment | 07:10, phase 1's camera | phase 1 (07:00); moments `telnitz`, `sokolnitz`, `telnitz-retaken` | "Between 07:00 and 09:00…" |
| `ANALYSIS` pratzen | 08:47, phase 3's camera | `soult` (08:45); moments `decision`, `soult`, `pratzen-village`, `face-about`, `kamensky`, `pratzeberg` | "At about 08:45… until about 11:00" |
| `ANALYSIS` cut | 10:00 (phase 4), phase 4's camera | `pratzeberg` (11:00, phase 5); moments `pratzeberg`, `buxhowden-blind`; own camera kept (phase 4's view of the plateau) | decision 52: "With the plateau taken…" and the event `pratzeberg` 11:00; decision 67: phase 5's view looks north at Bagration |
| `ANALYSIS` north | 10:40, phase 5's camera | phase 5 (10:30); moment `blasowitz` | "Blasowitz fell about 11:15"; phase 5 is the northern battle |
| `ANALYSIS` guard | 11:20, phase 6's camera | phase 6 (11:15); moments `guard-attack`, `guard-broken`, `hq-forward` | decision 64: the attack's hour "is not established" (phase 6's own line), so the theme opens on the phase, not on a minute |
| `ANALYSIS` wheel | 12:50, phase 7's camera | `wheel` (13:00); moments `davout-resumes`, `wheel`, `sokolnitz-falls` | "Between about 13:00 and 14:00…"; the event `wheel` 13:00-14:00 |
| `ANALYSIS` collapse | 14:40, phase 8's camera | `augezd` (14:30); moments `augezd`, `ice`, `end` | "the neck of dry ground at Augezd… the frozen water" |
| `TOUR` 1 "The battlefield" | 04:10, own camera (phase 0's) | phase 0 (04:00), phase 0's camera | the same view |
| `TOUR` 2 "The Allied plan" | 04:10, own camera | phase 0 (04:00), own camera kept | the plan overlay's overview |
| `TOUR` 3 "The French deception" | 04:10, own camera (the theme's) | phase 0 (04:00), the theme's camera | the same view |
| `TOUR` 4 "The Allied advance" | 07:25 | phase 1, **own clock 07:25 kept**, the theme's camera (the same) | its text quotes the plateau reading "about 19,000 by 07:15", which `sim-test.js` checks |
| `TOUR` 5 "Why the Pratzen matters" | 08:20 (phase 2), phase 3's camera | phase 2 (08:00), own camera kept | "the fog that hid Soult's divisions forming at the foot of the slope" (before 08:45); decision 67: phase 2's view looks at Sokolnitz |
| `TOUR` 6 "The French strike" | 08:50 | `soult` (08:45), the theme's camera (the same) | "At about a quarter to nine…" |
| `TOUR` 7 "The army divided" | 11:20 (phase 6), phase 4's camera | `pratzeberg` (11:00), following its theme (decision 52); the theme's camera (the same) | "With the plateau gone…" |
| `TOUR` 8 "The collapse" | 14:40 | `augezd` (14:30), the theme's camera (the same) | its theme |
| `TOUR` 9 "What it cost" | 16:40 (phase 8), phase 9's camera | phase 9 (17:00), phase 9's camera | decision 65: "The reckoning"; its text is the losses |
| `PHASES` phase 7 → phase 6 | "c. 12:30 Davout regroups and attacks…" in phase 7 (12:45-14:30) | in phase 6 (11:15-12:45), after the two c. 12:00 lines | decision 66: its own label; the event `davout-resumes` (12:30) is in phase 6 |
| `PHASES` phase 6 | "after 11:00 The Russian Guard attacks Vandamme…" in phase 6 | **unchanged**, by decision 66 | its hour "is not established" (its own words); the Guard is phase 6's subject; the event `guard-attack` runs 11:00-13:00, mostly in phase 6 |
| `SOURCE_NOTE` | the relief paragraph | adds: "The relief setting cannot be changed while the battle plays, because redrawing the ground can take longer than a frame; the ground switch (Landscape, Paper map, Landscape with counters) can, and a slow frame while it redraws advances the battle clock by at most 1.2 minutes at normal speed (4.8 at four times speed)." | decision 56 (G.1): the frame step is capped at 120 ms and the clock runs 10 minutes a second at 1x (fact, `app.js` `loop` and `tickClock`) |

Comments: `analysis.js`'s tour heading said "eight stops"; it says nine (Part A found it, §0.2).

**What the page does with it** (`app.js`, `style.css`)
- `momentOf`, `chapterClock`, `chapterCam`, `stopClock`, `stopCam` resolve the moments; `setChapter`, `applyTour`, the Analysis
  list's clocks, the spine index and the spine mark read them.
- Choosing a theme marks its other moments on the timeline: its events' markers (a light ring) and its phases' ticks (a line
  under the label), cleared when the theme is left (§C.2).
- Not done (decision 59): the one-wording-per-moment change to the 23 phase lines that duplicate an event; new events for the nine
  lines without one.

**The two Stage 3 leftovers**
- ← and → on a focused button, link or tab no longer step the clock (they still do from the map, the page, or nothing focused; the
  time rail and the roving groups keep their own arrow keys). The key table's line says so.
- Decision 56's sentence is in the sources sheet (`SOURCE_NOTE`, above).

**What the change does to the clocks the page sets** (derived): every theme and stop opens at its moment's start. Eight of the
ten themes move by 2-10 minutes, "weakness" not at all, and "cut" by an hour (decision 52); eight of the nine stops move by 5-20
minutes, stop 4 not at all. Two stops change phase: 7 (phase 6 → 5) and 9 (phase 8 → 9); one theme, "cut" (phase 4 → 5). `tools/stage3/spine.js` on the new data
(`docs/stage3-evidence/spine-after.md`) reports only the recorded exceptions: stop 4's own clock, stops 2 and 5's own cameras, the
theme cut's own camera, the four themes whose text spans more than their phase (a theme is a span), and the kept "after 11:00".

**Tests** (none loosened; new or stricter)
- `test.js`: the chapter clock check now resolves the principal moment (the clock range still checked); new: every moment a theme
  names is a phase or an event, no theme keeps its own clock, every stop's moment resolves on the clock and names a known theme,
  and only stop 4 keeps its own clock.
- Self-test (126 checks, was 125), new: every theme and stop resolves; theme "cut" opens at 11:00 and marks exactly
  `pratzeberg` and `buxhowden-blind`; theme "guard" opens at 11:15; the marks clear; stop 7 follows its theme (decision 52); one
  stop keeps its own clock. The key-table dry run now also presses → and Shift+← on a focused button (no row reached).
- Harness, by real key presses: → and Shift+← on the focused Play button leave the clock where it was.
- `sim-test.js` (stop 4's quoted reading) and `terrain-test.js` (stop 5's viewshed figures) pass unchanged.

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard.
- `npm run check:data`: against the old reference (`archive/stage2c-68ac7721.html`) exactly four data declarations changed:
  `PHASES`, `SOURCE_NOTE`, `ANALYSIS`, `TOUR`; against the new reference (`archive/spine-6b2cccd4.html`) all 113 identical.
- `npm run check:chronology`: 0 errors (the clocks it checks are the movements', which do not change).
- `npm run check:visual`: all checks passed, 20 views, the self-test 126 of 126; by real key presses, → and Shift+← on the
  focused Play button left the clock at 10:00.
- `npm run check:contrast`: 4,223 text elements in 28 states, 0 below AA, 0 below 10.5 px (4,226 on the 3E build; the three
  fewer elements were not traced to a state; derived, not measured: the tour and chapter states now open at other clocks).
- `npm run check:baseline`: moved to this build; passes.

**Not done, or open**
- The phase lines that duplicate an event (23) keep their own wording (decision 59: later, if at all); the nine lines without an
  event stay notes.
- `ANALYSIS`'s other moments are marked on the timeline only; the dispatch does not yet list a theme's moments.
- The movement-timing conflicts that `check:chronology` names (dok@1, guard_cav@6, kamensky@3, kamensky@4) and §M.9's three
  disagreeing texts are not spine structure and are untouched.

## 2026-10 · Stage 3E: names, the "?" overlay, the key table; event glyphs and objective markers capped (docs/STAGE3_SPEC.md §E, §F, §G.3, §H, §I; owner decisions 50, 51, 57)

**Status: merged (#25). `austerlitz-command-map.html`: 1,342,333 bytes, md5 `eb18a8eaf4e37a3061aa0a9227b4dd14`**
(was 1,319,262 bytes, md5 `732e04c0…`, Stage 3D).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`; the reference does not move. No
  data, track, text of the record or `OVERLAYS` change. Presentation only.

**Before building (fact).** `main` (ed71075, 3D merged as #24) matched `check:baseline` (md5 `732e04c0…`, 1,319,262 bytes). The
harness was run on that build with this part's measurement code, as the "before" of the per-view table.

**What changed** (`app.js`, `shell.html`, `style.css`)
- **Names** (§E.2; decision 50), labels only, from one table (`LABELS`) that the buttons, their titles and accessible names,
  the layers panel and the overlay read; `shell.html` carries the same words. The identifiers (`study`, `watch`, `map`;
  `terrain`, `staff`, `hybrid`) are unchanged.

  | where | was | is |
  |---|---|---|
  | the third presentation | Map ("Clean battlefield (3)") | Clean ("The battlefield alone: no panels (key 3)"); the switch's padding narrowed so it keeps its 176 px |
  | the first two presentations' titles | "Everything: panels, dossiers, sources (1)", "Battlefield and timeline only (2)" | the same words, "(key 1)", "(key 2)" |
  | the ground's buttons | Terrain / Staff map / Hybrid | Landscape / Paper map / Landscape with counters |
  | the ground group's accessible name | "Map mode" | "Ground" |
  | the layers button, panel heading, panel's accessible name | "Map…", "Map", "Map settings" | "Layers…", "Layers", "Layers and ground" |
  | the layers panel's section | "What the map shows" | "What is drawn" |
  | the legend's key line | "1 study 2 watch 3 map only · M map mode · D text · F FX on · space play · Esc back" | "? all keys and controls" |
  | the self-test's detail strings | "staff map" | "the paper map's preset" |
  | `css-test.js` messages | "map mode must hide …" | "Clean (the presentation map) must hide …" |

- **One key table** (`KEYS`, §F.2): every key and pointer control, with its scope, group, keys and words. The window's key
  handler and the map layer's run the rows of their scope (`keyRow`); the rail, the roving groups, the tablist, the map layer's
  items and the pointer keep their own handlers and have rows, so the overlay lists them. H and U are kept and listed (decision 51).
- **The "?" overlay** (§F.2): "?" or the "?" button in the timeline's control row (Study and Watch) opens a
  modal dialog written from the table, in seven groups (Time; View and ground; Layers and panels; The map, when it has focus;
  The timeline; Pointer and touch; Developer). Focus moves to its close button and Tab keeps it inside; Esc or "?" closes it and
  focus returns to where it was; while it is open no other key acts.
- **Key fixes** (§F.2): keys with Ctrl, Meta or Alt do nothing (before, Ctrl+C toggled the contours); Space and Enter on a
  focused button, link or tab press it, as the platform does, and do not toggle play (before, Space on the "Guided tour" button
  started playback). The rail's double step, its keys and the tablist were fixed in 3C and 3B.
- **Event glyphs and objective markers** (§G.3; decision 57): drawn at most 192 px on screen and faded out within 4-12 units of
  the eye; the map layer's obstacle discs shrink and fade with them; the arrow heads' box test is unchanged. Every harness view
  but pratzen-orbit-min drew them at 189 px or less (close-sokolnitz's event glyph, 40 units from the eye), so only views closer
  than those change. The paper map draws them as before.

**Per view, before (Stage 3D) and after** (`tools/stage3/report-3b.js --part 3E`; `docs/stage3-evidence/3e-report.md`, `3e-sheet.jpg`)
- **pratzen-orbit-min draws map text again**: 0 → 6 items placed, 7 → 1 dropped (lowest contrast 11.46:1). Before, the live event
  glyph 1.8 units from the eye was drawn 6,100 px wide and the map layer's discs covered the whole screen (§G.3).
- Every other view is unchanged: unobstructed fraction, drops, placements and lowest contrast identical at both viewports.
- Found while checking: "Clean" is 8 px wider than "Map", which widened the switch and put first-run at 1280 x 720 at 48.99%,
  under its 49.0% baseline; the padding was narrowed rather than the baseline lowered. A "?" button in the tools group (§F.2)
  lowered every Study view by 0.1 point for the same reason; there is one "?" button, in the timeline's control row.

**Tests** (none loosened; new or stricter)
- **Self-test** (125 checks, was 121), new: a dry run of the key table (66 key presses reach their rows; unbound keys, keys
  with Ctrl, Meta or Alt, and Space on a focused button reach none; no key claimed by two rows); the overlay lists all 29 rows in
  its groups, is modal, keeps focus by Tab and returns it when Esc or "?" closes it; the names from the label table; event
  glyphs and objective markers at most 192 px and faded near the eye, and drawn as before from the Field vantage.
- **Harness, by real key presses**: Space and Enter on a focused speed button set the speed and do not play; Ctrl+C leaves the
  contours as they are; "?" on the focused tour button opens the overlay, Tab cycles its close button and list, Esc closes it and
  focus returns to the tour button.
- **`css-test.js`**: a static check of the names over `shell.html` and the label table (no presentation labelled "Map", no ground
  "Staff map", "Terrain" or "Hybrid"; the identifiers unchanged); three messages reworded ("map mode" → "Clean").
- **`check:contrast`: 28 states** (two new: the overlay over the landscape and over the paper map).

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard.
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:visual`: all checks passed, 20 views, the self-test 125 of 125, the slider and the 3E keys by real key presses.
- `npm run check:contrast`: 4,226 text elements in 28 states, 0 below AA, 0 below 10.5 px.
- `npm run check:baseline`: moved to this build; passes.

**Not done, or open**
- Decision 56 (the mode switch kept enabled during playback): no code; the difference from the relief control is not yet stated
  in the sources sheet (§0.3 left it to the owner).
- The ← and → keys on a focused button still step the clock (§G.6 measured it); §F.2 did not list it among the fixes.
- Stage 3 is complete with this part; the spine data task (decisions 52, 59) is not started.

## 2026-10 · Stage 3D: the camera (docs/STAGE3_SPEC.md §A.3, §B.4, §H, §I; owner decisions 47, 48, 61-63)

**Status: merged (#24). `austerlitz-command-map.html`: 1,319,262 bytes, md5 `732e04c0f12f939984fec3d452e48de0`**
(was 1,281,813 bytes, md5 `6ae3f8a7…`, Stage 3C).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`; the reference does not move. No
  data, track, text of the record or `OVERLAYS` change. Presentation only: the battle's extent the Overview fits is derived
  from the data at start.
- Three owner decisions were taken while building it (61-63, `docs/STAGE3_SPEC.md` §0.3), on evidence Part A did not have.

**Before building (fact).** `main` (e432d17, 3C merged as #23) matched `check:baseline` (md5 `6ae3f8a7…`, 1,281,813 bytes). The
harness was run on that build with this part's measurement code, as the "before" of every table below.

**What changed** (`app.js`, `shell.html`, `style.css`)
- **The landscape's controls** (§A.3; decision 48), in `LANDCAM` and `bindCanvas`:
  - left-drag pans: the grabbed ground point stays under the pointer (the eye and target move in its horizontal plane; the
    pointer's ray is held at least 3° below the horizontal; the target stays on the modelled ground; when the drag ends the
    target is moved along its own view ray onto the drawn ground, so nothing on screen moves);
  - right-drag, or Shift or Ctrl + left-drag, orbits about the target, as every drag did before; the context menu is suppressed
    on the canvas only;
  - the wheel zooms toward the cursor: the eye and target scaled about the ground point under it, the distance kept in 24-620
    units; a step the floor would cut is shortened to stop at the floor, so the point stays under the cursor;
  - a double-click glides the ground point under it to the free rectangle's centre, at the current distance or 86 units;
  - one finger pans, two pinch and twist (`touch-action:none` on the canvas);
  - the map layer takes keyboard focus on the landscape too: the arrows pan 12% of the shorter side, Shift and the arrows turn
    15° and tilt 5°, + and - zoom about the centre; the clock is not stepped.
  - The paper map's controls are unchanged (Stage 2E).
- **The focus in the unobstructed area** (§A.3): `camera.setViewOffset` puts the orbit target at the centre of the free
  rectangle (`MAPCAM.freeRect`'s rule, without the first-run card: decision 61). The offset follows the panels each drawn
  frame, eased over their slide; a resize sets it at once. Picking, hover, the map layer and the scale bar project through the
  camera, so they are unchanged.
- **The Overview** (§B.4; decision 61): on the landscape it fits the day's battle (every formation's position at the start,
  middle and end of every phase, every event and every place; x -161 to 83.5, z -122 to 125) into the free rectangle; every
  other preset is re-framed in height only, as before, and lands at the free centre. The eye stands 536 units out in Study
  and 425 in Watch at 1600 x 900 (the authored preset 278), 491 on the first-run screen.
- **The fog recedes** with the eye beyond the authored Overview's distance from the target (274 units): the fitted Overview
  and a wide zoom were drawn in fog (the fog's near and far are distances from the eye, chosen for the authored views). Every
  view within that distance is drawn as before. A matter of the light, which Stage 4 replaces.
- **Corps and army names** are drawn at any distance once the view shows corps (beyond 250 units; decision 63); before, every
  formation name stopped at 300 units, and the fitted Overview named none.
- **Follow** (§A.3; decision 47): a toggle in the timeline's control row after the transport buttons (`aria-pressed`), showing
  `!freeCam`. A pan, orbit, zoom, double-click, the map layer's keys and every centring (the dossier, the order of battle, the
  events) turn it off; a vantage, chapter, tour stop, phase or act turns it on; pressing it on glides to the current phase's
  view. A vantage's button is released when the eye leaves it.
- **One tween chain** (§A.3): the loop's `tween` runs two slots, the phase change's light and overlay fade, and the camera move.
  A phase change replaces the camera move only when it moves the camera itself (Follow on); before, it dropped a glide in
  flight. The relief control still stops both, as before.
- **Words**: the first-run hint and the legend's control line follow the new controls (§E.3 put them with the controls); the map
  layer's accessible name on the landscape gains its keys.

**Per view, before (Stage 3C) and after** (`tools/stage3/report-3b.js --part 3D`; `docs/stage3-evidence/3d-report.md`, `3d-sheet.jpg`,
`3d-overview.jpg`)
| | before (3C) | after (3D) |
|---|---|---|
| the phase-8 Overview, Study / Watch: arrow heads more than a quarter hidden | 4 of 10 / 4 of 10 | 0 of 12 / 0 of 12 |
| every landscape view: the orbit target from the free rectangle's centre | (not centred) | 0 px, and 0 px after the resize to 1280 x 720 |
| the Overview's eye distance, Study / Watch / first run | 278 / 278 / 278 | 536 / 425 / 491 |
| unobstructed fraction | | unchanged in every view (the panels did not change) |

- **Drops**, all within their limits: fewer in eight views (first-run 9 → 5, overview-plan 6 → 4, close-sokolnitz 6 → 4,
  pratzen-orbit-min 18 → 7, watch-selected 4 → 3, ph8-overview-study 6 → 3, ph8-overview-watch 5 → 3, first-run-laptop 5 → 4), more
  in two (selected-formation 2 → 4, narrow-1024 5 → 6; decision 62 below), the same in the rest. The Overview views place fewer
  items (ph8-overview-study 35 → 22): at their distance the level of detail draws corps and armies, not divisions.
- Overlaps 0, nothing over a panel or a head, map text at its floor and AA as rendered (lowest 4.89:1, staff-paper, as before),
  pass times 0.4-1.9 ms.
- pratzen-orbit-min still reaches the orbit minimum through the right button: the "intended depth" 4.31 units below the ground
  (4.314 before), the same target and bearing, the eye's clearance 4.235 (4.234).
- **The controls** (self-test, at 1x, 4x and 10.33x from the five vantages): a pan within 0.001 px of the pointer during and
  after (50 steps a factor, none lifted by the floor); the wheel within 0.012 px over 60 steps (2 shortened by the floor at
  10.33x); a double-click 0.000 px from the free centre; a right-drag orbits in 5 of 5; never below the floor; a pan move
  0.007-0.012 ms (budget 2 ms).

**Decisions taken while building it** (§0.3, 61-63; each asked, with the numbers):
- **61, the Overview's framing.** §B.4 proposed fitting the whole modelled ground, as the paper map does. On the landscape that
  put the eye 533-712 units out, and 996-1,228 on the first-run screen (the card leaves a short free strip), where the fog drew
  the field grey and the first-run view at 1280 x 720 dropped 11 of 27 items (5 before). The owner chose the day's battle, the
  card not counted, the fog receding (`3d-overview.jpg`: four framings).
- **62, two drop limits.** The offset brings ground the panels covered into view, and one more place name there finds no room
  beside its marker: selected-formation 4 against 3 (Augezd beside the legend, Kobelnitz under "Goldbach stream"), narrow-1024 6
  against 5 (Sokolnitz). Reproduced on the 3C build in the same framing (`tools/stage3/offset-limits.js --prev`), its map layer
  drops the same items, 4 and 6: the framing adds them, not the code. Stage 2E's method gives 10 (matched panels; 7 native) and 23
  there. The owner chose 4 and 6 (`docs/stage3-evidence/offset-limits.json`).
- **63, formation names on the Overview.** Names stopped at 300 units; the fitted Overview named none. Corps and army names are
  now drawn at any distance once the view shows corps; the Overview in the self-test names 5 (gqg, ahq, buxhowden, lich, bag).

**Tests** (none loosened; new or stricter)
- **Harness** (`harness.js`, `measure.js`, `thresholds.js`): pratzen-orbit-min drives the orbit with the right button (decision 48)
  and aims its wheel at the orbit target's place on screen (the wheel now zooms toward the cursor; aimed at the target it zooms
  about it, as before); new, every landscape view: the orbit target within 1 px of the free rectangle's centre, and again after
  the resize to 1280 x 720; new, the phase-8 Overview views: no arrow head more than a quarter hidden.
- **Drop limits**: selected-formation 3 → 4 and narrow-1024 5 → 6 (decision 62, the measured reason above); every other limit
  unchanged.
- **Self-test** (121 checks, was 110), new: at each factor, the landscape controls through real pointer and wheel events from every
  vantage, and the keys and touch; once, the offset after eight panel changes, picking and the ground through the offset, Follow
  after 14 camera paths (decision 47), every vantage's target at the free centre and the Overview's battle inside the free
  rectangle, naming its corps and armies, and one tween chain. The existing camera checks are unchanged and pass at each factor.
  The ground's round trip is checked on the modelled ground: beyond it, toward the horizon, the coarse apron has a step at its
  edge where a grazing ray's crossing is not a point of the ground (3.3 px at 700 units, with or without the offset; §A.2's
  2.2 px grazing ray).
- **Height guard**: the new `groundY` call sites classified (the camera's as presentation, the self-test's as test).

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard (0 presentation sites calling `height()`/`hAt()`).
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:visual`: all checks passed, 20 views, the self-test 121 of 121.
- `npm run check:contrast`: 3,880 text elements in 26 states, 0 below AA, 0 below 10.5 px (3,927 on the 3C build: the states drawn
  on the Overview read 14-18 fewer map texts at its distance, most others one more, the Follow button).
- `npm run check:baseline`: moved to this build; passes.

**Not done, or open**
- Touch is tested by synthetic pointer events only; no device was used.
- The phase-8 heads are clear because the Overview is fitted; the other presets are not re-framed into the free rectangle
  beyond their target's centring (§H asks only that their target lands inside it, which it does at the centre).
- The fog's recession is a stopgap for the fitted Overview; Stage 4's light replaces it.
- The rest of Stage 3 (3E: names, the "?" overlay and the key table) and the spine data task are not started.

## 2026-10 · Stage 3C: one timeline, and the spine index (docs/STAGE3_SPEC.md §C.2, §D, §H, §I; owner decisions 50, 53, 60)

**Status: merged (#23). `austerlitz-command-map.html`: 1,281,813 bytes, md5 `6ae3f8a76dc6fecc8bcd87eb3b1b6dfc`**
(was 1,265,532 bytes, md5 `543a9bf0…`, Stage 3B).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`; the reference does not move. No
  data, track, text of the record or `OVERLAYS` change. Presentation only: the spine index is built from the data as it is.

**Before building (fact).** `main` (f4eb8bb, 3B merged as #22) matched `check:baseline` (md5 `543a9bf0…`, 1,265,532 bytes). The
harness was run on that build with this part's measurement code (the two new views included), as the "before" of every table below.

**What changed** (`shell.html`, `style.css`, `app.js`)
- **One timeline of 90.5 px** (decision 53; 92 px in Watch, where the presentation switch sits in it), was 170.1 px at 1600 x 900
  and 139.1 at 1366 x 768 and 1280 x 720. One proportional time axis, 04:00-18:00 (`tlPc`), carries, top to bottom:
  - the act bands (15 px) and the phase ticks (16 px), each at its share of the axis; their labels at 12.5 px, ellipsised when
    their share is too narrow, **except the current phase's, which is always whole** (it widens over its neighbours on a scrim);
  - the rail (22 px), with the hour ticks, the even hours' numerals under its line (clear of every event marker), the playhead,
    and the spine mark;
  - the event markers on the rail's line, each at its event's window, a group of their own (not children of the slider).
  The control row above it (34 px) holds the transport, the clock, a one-line caption, Watch's presentation switch, the speeds
  and the scale bar. The situation row and its close button are gone.
- **The caption** (`#tb-cap`) reads act · phase title · the live event. The derived readings (the Allied strength on the heights,
  phases 0-6, and the centre separation) stand in the caption in Watch, where there is no Now tab, and are hidden there in Study,
  where they lead the Now tab.
- **The situation moves to the top of the Now tab** (`#situation`, the dispatch's first child): its derived readings, the live
  event and why it matters. Below 1080 px it is at the top of the dispatch card.
- **Watch's presentation switch stands in the timeline's control row at full opacity** (decision 60; was a floating control at 24%,
  1.27-2.66:1 over the map), moved there by `syncViewmode` on entering Watch and back to its own place (`#viewmode-home`) on leaving.
- **Keyboard and screen reader** (§D.3):
  - the rail is a `slider`: ← → 10 minutes, Shift 60, Home and End the day's ends, PageUp and PageDown the phase starts; its
    `aria-valuenow` and `aria-valuetext` ("10:10, Pratzeberg, The Pratzen Strike") stay current, by key, pointer or play;
  - the acts, the phases and the event markers are each one tab stop (a roving `tabindex`), the arrow keys moving within them;
    each event marker is a button named by its clock and title ("06:07, The counter-march"), and Enter or a click selects it
    and moves the clock to it;
  - Play is a toggle button (`aria-pressed`).
- **The spine index** (decision 50, §C.2): `SPINE` (acts > phases > events, with the chapters and tour stops in each phase), built
  from the data at start. The chosen chapter's or tour stop's place is marked on the axis (`#spinemark`).

**Per view, before (Stage 3B) and after** (`tools/stage3/report-3b.js`; `docs/stage3-evidence/3c-report.md`, `3c-sheet.jpg`)

| views | unobstructed, 1600 x 900 (or the case's) | at 1280 x 720 |
|---|---|---|
| Study: overview-field, selected-formation, the paper views, ph8-overview-study | 63.1% → 70.4% | 57.8% → 62.9% |
| Watch: overview-plan, close-sokolnitz, the Pratzen views, ph8-overview-watch | 80.5% → 89.8% | 77.1-79.9% → 87.2% |
| watch-selected, hybrid-dimmed | 78.4%, 78.7% → 88.0%, 88.2% | 73.2%, 74.3% → 83.3%, 84.7% |
| first-run, first-run-laptop | 54.4%, 48.3% → 61.5%, 53.2% | 43.9% → 49.0% |
| paper-laptop (1280 x 720), narrow-1024 (1024 x 768) | 57.8% → 62.9%; 48.4% → 53.5% | |

- Every §H claim for 3C is met within 0.1 point: the probe's level 4 (the Study views 70.4 / 62.9%), the Watch views above its
  87.5-89.3 / 82.7-86.5%, first-run 61.5 / 49.0% against 61.6 / 49.3% (within the 1 point §H allows without comment).
- **The paper map as entered:** 25.4 → 28.5 px per true km at 1600 x 900, 19.8 → 21.6 at 1280 x 720 (§H: 28 and 21).
- **Drops** within every limit. Against 3B they rise in six views (first-run 7 → 9, overview-plan and close-sokolnitz 5 → 6,
  watch-selected 2 → 4, hybrid-dimmed 7 → 8, ph8-overview-study 3 → 6, ph8-overview-watch 2 → 5) and fall in two (paper-drawer
  2 → 1, paper-laptop 12 → 11), while more items are placed in every view but five, which are unchanged (ph8-overview-study 30 →
  35, ph8-overview-watch 31 → 36). Derived: anchors that the 170 px timebar covered are now in the pass; the layer counts an anchor
  under a panel apart (`underPanel`), neither placed nor dropped, so a smaller timebar can add drops as well as placements. Overlaps 0, nothing over a panel or a head, map text at its floor and AA as
  rendered (lowest 4.89:1, staff-paper; was 5.07), pass times 0.5-2.3 ms.

**Tests** (none loosened; new or stricter)
- **Unobstructed baselines raised** (`thresholds.js`) to this build's values rounded down to 0.1 point, never below the 3B values
  they replace (kept in the file's comment).
- **The paper map's floors raised** from 25 and 19 to 28 and 21 px per true km (§H).
- **Two new harness views**, the phase-8 Overview at 1600 x 900 in Study (`ph8-overview-study`) and in Watch
  (`ph8-overview-watch`), as `dock-probe.js` defines them, with every threshold of the other views. Their unobstructed baselines
  are this build's values (§H); their drop limits (7 and 7) are what the Stage 2C canvas pass hides there, the method of the other
  views' limits (`tools/stage2/dom-layer.js` on `archive/stage2c-68ac7721.html`, which gives overview-field's 11 again).
- **New harness checks**, every view: the timeline at most 92 px; in Watch the switch in the control row at full opacity and the
  caption's derived reading shown; at 1280 x 720 (overview-field, overview-plan) no phase's label cut while it is current, for
  every phase. After the self-test, by real key presses: the slider from 10:00 (→ 10:10, Shift+→ 11:10, ← 11:00, PageUp 10:30,
  PageUp 09:30, PageDown 10:30, Home 04:00, End 18:00), `aria-valuenow` after each and `aria-valuetext`; an event marker reached
  by the arrow keys and chosen by Enter (its clock and selection).
- **Self-test** (110 checks, was 103), new: the timeline's height, the act bands and phase ticks at their share of the axis and
  their labels at 12 px or more; the hour numerals clear of the event markers and of one another, inside the timebar; the current phase's label whole in every phase; the slider's keys, one step each, and its value
  exposed; the acts, phases and events each one keyboard stop, events named by clock and title, Play pressed while playing; Watch's
  switch in the control row at full opacity, and back in Study; the spine index (25 events, 10 chapters, 9 tour stops in 10 phases)
  and the chapter's mark on the axis.
- **`check:contrast`: 26 states** (two new: Watch on the paper map and on the landscape, the switch in the timeline and the
  caption's derived readings). On the 3B build these two states fail on the switch's buttons (1.50-2.02:1, four elements). This
  build reads 3,927 elements, 0 below AA; the 3B build reads 4,216 in the same 26 states, 5-17 more in each: its timebar printed
  each phase's times above its name and had the situation row, where the phase ticks now carry the name only (the axis, its
  numerals and the slider's value give the time).

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard (61 sites, 0 presentation sites calling `height()`/`hAt()`).
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:visual`: all checks passed, 20 views, the self-test 110 of 110; the slider and an event marker by real key presses.
- `npm run check:contrast`: 3,927 text elements in 26 states, 0 below AA, 0 below 10.5 px.
- `npm run check:baseline`: moved to this build; passes.

**Not done, or open**
- The theme and tour marks show only the place of the chosen chapter or stop; marking a chapter's moment against the events, or
  its misfits (§C.1), needs the spine data task, which the owner has not asked for.
- At 1366 and 1280 px wide the labels "The Pratzen" and "Olmutz road" are shortened while their phase is not current (whole when it is).
- The rest of Stage 3 (3D the camera, 3E names and help) and the spine data task are not started.

## 2026-09 · Stage 3B: docked panels (docs/STAGE3_SPEC.md §B, §H, §I; owner decisions 49, 54, 55, 58)

**Status: merged (#22). `austerlitz-command-map.html`: 1,265,532 bytes, md5 `543a9bf056978ef6e8b2d55f02190637`**
(was 1,253,655 bytes, md5 `ee4390a2…`, Stage 2F).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`; the reference does not move. No
  data, track, text of the record or `OVERLAYS` change. Presentation only.
- The first work on the branch records Part A as merged (#21) and the owner's answers to §J as decisions 47-60
  (`docs/STAGE3_SPEC.md` §0.3: every recommendation accepted).

**Before building (fact).** `main` (e9c4fbe) matched `check:baseline` (md5 `ee4390a2…`, 1,253,655 bytes). The harness was run on
that build with this part's measurement code (the new view included), as the "before" of every table below.

**What changed** (`shell.html`, `style.css`, `app.js`)
- **The dispatch is the rail's first tab, "Now"** (decisions 54, 55), from 1080 px wide (`syncDock`, `body.docked`). The
  section itself moves into the tab's pane; its type is the card's (the title at `t-h2` in the narrower column), and the
  timeline lines and "what changed" are no longer cut on short screens, since the rail scrolls. Study opens on it.
  - While the first-run card is open the rail shows the Order of battle and the dispatch stays hidden, as before: the first
    run is Stage 7's, and the Stage 0 check "first-run card stacked on the dispatch card" is untouched. Closing the card opens
    the Now tab unless the visitor chose a tab meanwhile.
  - D hides and shows the Now text, as it did the card; the pane then says how to show it (and that the tour's text is in the
    tour bar while the tour hides it, as before).
- **Below 1080 px the dispatch stays a card** (decision 58), where it stood before (`#dispatch-home`); the Now tab is hidden
  there. A resize across 1080 px moves it; widening into the docked layout in Study also shows the rail (before, a rail hidden
  at start-up below 1080 px stayed hidden after any resize).
- **The dossier opens in the rail's column** (decision 54; the rail stays 300 px, the 340 px it allowed was not tried): over the
  tabs' content, down to the timebar, headed "‹ Back to" the tab it covers. The tools and the legend no longer slide left, and
  the dossier no longer covers the timebar's speeds and scale bar. Below 1080 px it is the drawer on the right, as before.
- **The legend opens closed to its "Key" head** (decision 49); the visitor's choice then holds while the page is open.
- **The paper map is framed where it is drawn largest** (§B.4): `MAPCAM.freeRect(ext)` picks, among the free rectangles, the
  one in which the field's north-up outline (436 x 404 world units) is drawn largest, the larger area breaking a tie; the
  largest-area rule stays for centring a point. At 1366 x 768 (the self-test's page): 21.6 px per km in 696 x 552 px, where
  the largest free rectangle (928 x 504) gives 19.8.
- **The rail's tabs are a tablist**: `role="tab"`/`tabpanel`, a roving `tabindex`, ← → Home End between the tabs shown; the keys
  stop at the tabs, so the clock does not step (before, any arrow key stepped it).
- **One polite live region** (`#live-phase`) announces each phase change ("09:30 - 10:30. The Pratzen Strike: The crisis on the
  Pratzeberg."), whichever tab is shown. The dispatch is no longer a live region: in a hidden tab it would not be read, and it
  used to read the whole lede at every phase.

**Per view, before (Stage 2F) and after** (`tools/stage3/report-3b.js`; `docs/stage3-evidence/3b-report.md`, `3b-sheet.jpg`)

| views | unobstructed, 1600 x 900 (or the case's) | at 1280 x 720 |
|---|---|---|
| Study, landscape (overview-field) | 38.6% → 63.1% | 25.0% → 57.8% |
| a formation selected (selected-formation) | 19.6% → 63.1% | 12.5% → 57.8% |
| the paper map (staff-paper, paper-north-up, paper-close) | 35.7-36.5% → 63.1% | 21.5-22.2% → 57.8% |
| the paper map with the dossier (paper-drawer) | 17.5% → 63.1% | 12.5% → 57.8% |
| the paper map at 1280 x 720 (paper-laptop) | 21.5% → 57.8% | |
| Watch, the first run, narrow-1024 at 1024 x 768 | unchanged | unchanged (narrow-1024 at 1280 x 720 is docked: 43.9% → 57.8%) |

- **The paper map as entered:** 17.1 → 25.4 px per true km at 1600 x 900, 5.5 → 19.8 at 1280 x 720. At 1600 x 900 the free
  rectangle's height is set by the 170 px timebar; the probe's 28.5 needs 3C.
- Drops within every limit (selected-formation 2 of 3, as before: G.4 re-measured, the limit unchanged); paper-laptop 18 → 12,
  paper-drawer 4 → 2, overview-field 5 → 6 (an item that was under the dispatch now counts). Overlaps 0, nothing over a panel or
  a head, text at its floor and AA as rendered (lowest 5.04:1), pass times 0.6-1.7 ms.
- Every claim of `docs/STAGE3_SPEC.md` §H for 3B is met (the Now tab's level of the probe: overview-field 56.3 / 47.2%, the paper
  views 54.2 / 43.7%): the legend closed by default adds the rest.

**Tests** (none loosened; new or stricter)
- **Unobstructed baselines raised** (`thresholds.js`) to this build's values, rounded down to 0.1 point, never below the Stage 2C
  values they replace (kept in the file's comment): the Study and paper views to 63.1 / 57.8%, paper-laptop to 57.8%.
- **New harness checks** (every view, on a build with the Now tab): docked exactly from 1080 px; in Study the dispatch in the
  rail's Now tab from 1080 px and a card below; Study shows the Now tab; the legend closed unless opened; the legend never over
  the rail, the dossier or the timebar (stricter than "never over the dispatch", which stays); the paper map as entered at least
  25 px per km (paper-north-up) and 19 (paper-laptop).
- **New harness view `narrow-1024`** (1024 x 768, Study, the Field vantage): the undocked layout. Its limits are the Stage 2F
  build's own (drops 5, unobstructed 48.45 / 43.89%): 3B leaves it as it was, and it does.
- **Self-test** (103 checks, was 98), new: the docked layout by width; the tablist and its keys, the clock unmoved; one
  announcement per phase change while another tab is shown, the dispatch no longer a live region; the dossier in the rail's
  column down to the timebar, the tools and the legend unmoved; the paper map framed in the rectangle where the field is drawn
  largest, never smaller than in the largest one.
- **`check:contrast`: 24 states** (two new: Study as it opens, and the Now tab on the paper map). The legend is opened explicitly
  for the states that read its rows before (it opens closed now). 4,052 text elements, 0 below AA, 0 below 10.5 px. Fewer
  elements than before (4,750 on the Stage 2F build with these 24 states) because the order of battle, no longer the default tab,
  is not read again in six states; it is read in the first-run state as before.

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard (61 sites, 0 presentation sites calling `height()`/`hAt()`).
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:visual`: all checks passed, 18 views, the self-test 103 of 103.
- `npm run check:contrast`: 4,052 text elements in 24 states, 0 below AA, 0 below 10.5 px.
- `npm run check:baseline`: moved to this build.

**Not done, or open**
- The 340 px rail (decision 54 allowed trying it) was not tried.
- The situation row stays in the timebar until 3C, which moves its readings to the top of the Now tab.
- Below 1080 px the layout is as before (decision 58), including its known rail behaviour on narrowing (the rail is not hidden
  again when the window narrows).
- The rest of Stage 3 (3C the timeline, 3D the camera, 3E names and help) and the spine data task are not started.

## 2026-09 · Stage 3 Part A: navigation and structure specified (docs/STAGE3_SPEC.md); no change to the build

**Status: reviewed and merged (#21); the owner accepted every recommendation (decisions 47-60). `austerlitz-command-map.html` unchanged by it: 1,253,655 bytes,
md5 `ee4390a2585f3df170fba82eb1994112`** (confirmed on `main` at `0f2b17e` before the work, with #19 and #20 merged, and by
`check:baseline` after it).

**What changed**
- `docs/STAGE3_SPEC.md`: the decisions that bind Stage 3 and eleven places where the evidence contradicts the roadmap, an
  earlier record or the brief (§0); camera controls on the landscape (§A); docked panels (§B); one time spine (§C); one
  timeline of about 90 px (§D); mode names (§E); a "?" help overlay (§F); the open items carried from Stage 2 (§G); the
  test plan (§H); the pull-request plan for 3B-3E and a separate data task (§I); 14 questions for the owner (§J).
- `tools/stage3/` (not bundled): `spine.js` (the day's structures against one another), `dock-probe.js` (the docked
  layout tried in five levels on every harness view), `nav-probe.js` (map-style navigation, `setViewOffset`, the open
  items, key presses), `report-3a.js` (the tables). Probes are injected into the running page for measurement only.
- `docs/stage3-evidence/`: `spine.md`/`.json`, `dock-probe.json`, `dock-report.md`, `dock-probe.jpg`, `nav-probe.json`,
  `orbit-min.jpg`, and a README.
- `CLAUDE.md`: the layout table names `STAGE3_SPEC.md`, `stage3-evidence/` and `tools/stage3/`; the current state says
  Part A is written.
- No source file, no data, no test and no threshold changed.

**Key measurements (fact)**
- **The unobstructed fraction** (the Stage 2 §H measure), today → the docked probe with all four changes (the Now tab, one
  91.6 px timeline, the legend closed, the dossier in the rail), at 1600 x 900 / 1280 x 720: the Study landscape
  (overview-field) 38.6 / 25.0% → 70.4 / 62.9%; a formation selected 19.6 / 12.5% → 70.4 / 62.9%; the paper map 36.5 / 21.5%
  → 70.4 / 62.9%; Watch 80.5 / 79.9% → 89.3 / 86.5%; first run 54.4 / 43.9% → 61.6 / 49.3% (the timeline only). Every view
  rises; the Now tab alone gives +17.7 points (1600 x 900) and +22.2 (1280 x 720) in Study. Per view and level:
  `docs/stage3-evidence/dock-report.md`.
- **The paper map as entered, Study**: 17.1 → 28.5 px per true km at 1600 x 900, 9.9 → 23.5 at 1366 x 768, 5.5 → 21.6 at
  1280 x 720 (framed to fit the field; `MAPCAM`'s largest-area rule gives 24.2 / 19.5 / 17.6 once the legend closes).
- **The timebar**: 170.1 px (four rows) → 91.6 px (two) at 1600 x 900; 139.1 → 91.6 at 1366 x 768 and 1280 x 720.
- **Landscape navigation** (probe, 1x, 4x, 10.33x, four views): zoom about the cursor's ground point keeps it under the
  cursor exactly except where the floor lifts the eye (1 step in 60, 89 px); a pan in the grabbed point's plane with the
  target re-anchored on its own view ray keeps the point under the pointer to 0 px during and after, where re-seating the
  target on the ground jumps 3-288 px; the floor held everywhere; `setViewOffset` leaves `groundAt` and `worldPerPx` unchanged
  (round trip 0.001-0.006 px).
- **The time spine**: 10 phases, 5 acts, 25 events, 32 phase timeline lines, 10 chapters, 9 tour stops (`spine.md`).
- **Watch's presentation control** at 24% opacity: 1.27-2.66:1 rendered over the map (below AA in every Watch view).

**Findings that contradict the roadmap or an earlier record** (§0.2; stated, not worked around)
- The guided tour has 9 stops, not 8 (the roadmap, two code comments and the brief say 8).
- The timebar is 170 px at 1600 x 900, not about 145; 139 px at 1366 x 768, where the act row is hidden.
- "Map" names three controls under four labels, plus a generic sense; the paper style's label is "Staff map". "Both", the
  roadmap's name for the hybrid style, is already the Plans tab's label and misdescribes the style.
- **pratzen-orbit-min draws no map text because a live event glyph (1.8 units from the eye, an obstacle disc about 2,370 px
  in radius) and an objective marker are drawn around the eye**, not because of the arrow heads' boxes as recorded in 2D and
  2E (the heads' boxes cover 12.3% of the screen; with every head and marker removed the obstacles still cover all of it).
- The time spine: the chapter "cut" is set at 10:00 while its text begins "With the plateau taken" (11:00 by the event
  `pratzeberg`), and its tour stop sets 11:20; three tour stops borrow another phase's camera; the act and phase rows of the
  timebar are equal-width while the rail above them is proportional to time.
- `MAPCAM` frames the paper map in the largest-area free rectangle; with the legend closed that rectangle is wide and short
  and the (about square) field is drawn 15-19% smaller than in the rectangle that fits it.
- In the phase-8 Overview two Allied arrows' heads lie wholly under the timebar even at 91.6 px and with the view offset: a
  framing matter of the fixed Overview preset (the recommendation: fit the modelled ground into the free rectangle).
- Keys: the time rail steps 25 min (its ±15 plus the window's ±10), exposes no `aria-valuenow`, and Space on a focused
  button toggles playback instead of pressing the button (measured by real key presses).

**Open (questions §J, recorded, not decided)**: what turns Follow off; left-drag pans; the legend closed by default; the
names; the H and U keys; the "cut" chapter's clock; the time axis; the dossier in the rail and the rail's width; the Now
tab as default; the mode switch during playback; pratzen-orbit-min's remedy; the layout below 1080 px; the spine data task;
the Watch presentation control.

**Tests (all on the unchanged build)**
- `npm run build`: md5 `ee4390a2585f3df170fba82eb1994112`, 1,253,655 bytes, identical to `main`.
- `npm test`: all 9 suites pass; the height guard (61 sites, 0 presentation sites calling `height()`/`hAt()`).
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:baseline`: passes.
- Not run: `check:visual` and `check:contrast` (the build is byte-identical to the 2F build, whose results stand).

**Not verified**
- Touch and two-finger gestures (no device in the harness); the probes' timings (another probe ran on the same machine).
- The probe's layout is a measurement, not the 3B-3C design: its type sizes, the hour numerals it leaves out and its
  narrow-width behaviour are for those parts to settle and measure.

## 2026-09 · Stage 2F: the ground surface (docs/STAGE2_SPEC.md §B.4, §I.2, §J, §K; decisions 27, 28, 30, 31)

**Status: done; merged (#19). Stage 2 has no further part; Stage 3 has not started. `austerlitz-command-map.html`: 1,253,655 bytes, md5
`ee4390a2585f3df170fba82eb1994112`** (was 1,226,091 bytes, md5 `c5883f79…`, Stage 2E).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`; the reference does not move.
  No track, `OVERLAYS`, strength, order-of-battle or geography change; `coverClass`, `buildCover`, `covAt`, the cover rasters,
  `WOODS`, `VILLAGES`, `MARSH` and the meres untouched. Presentation only.
- The first commit records 2E as merged (#18) in `CLAUDE.md`, this file and `docs/STAGE2_SPEC.md`.

**Before building (fact).**
- `main` (1a7d1a9) matched `check:baseline`: md5 `c5883f79cc1481b2dc4863d089b4e363`, 1,226,091 bytes.
- **How land cover was drawn in 2E**, read from the code:
  - `buildFaceFacts` classified each 81 m triangle of the ground mesh once. Its class is `coverClass` at the triangle's
    centroid, on the local relief there, taken as the mean of its three vertices' model heights less the regional level.
    That class was stored per face (`FACE.cover`), with a field pattern (`FACE.tint`, `FACE.crop`) and an occlusion
    (`FACE.ao`), also per face.
  - `makePalette` gave every triangle one colour for the natural ground and one for the paper map (`COVER_COL`), times the
    elevation tint (from the face's mean height), the field tint and the occlusion. Only the hillshade and the frost varied
    across a triangle, from its vertex normals.
  - The `cover` attribute (one atlas cell per face) chose the atlas pattern in `atlasShader`. `makeGoingPalette` coloured
    each triangle by its going class. `applyGround` wrote the chosen palette, with a viewshed darkened per face.
  - On the paper map (2E), the woods' tint and marks and the village footprints were drawn over that ground, traced from
    the cover fields (`covWood` > 0.5, `covVill` > 0.55).
- **What is guarded** (`tools/visual/data-invariance.js`): `coverClass`, `buildCover`, `covAt`, the six cover rasters and
  their grid, `localHeight`, `regionalLevel`, `height`, the analysis grid, and the data (`WOODS`, `MARSH`, `VILLAGES`,
  `VINEYARD`, `ROADS`, the streams). The drawing (`buildFaceFacts`, `makePalette`, `atlasShader`, `applyGround`, `ribbon`,
  `buildWoods`, `buildPaperSymbols`) is presentation. 2F changes only the drawing.
- **The cover boundary error, measured.** §J defines it: along each cover polygon's edge, how far from the edge the drawn
  cover changes (`tools/stage2/cover-2f.js`).
  - The cover polygon of a class is where the model's classifier, at the point itself, gives that class:
    `coverClass(x, z, localHeight(x, z))`, as `terrain-test.js` samples it.
  - Measured on a grid of 0.125 world units (7.9 m) over the whole modelled ground. For each class: the largest distance
    from a point where the drawing and the model disagree about that class to the model's edge of it, less half a step.
  - The 2E drawings as their code defines them (each triangle in its centroid's class; on the paper map, the footprints
    and the wood symbology over it). Resolution ±4 m:

  | class | area | 2E landscape | 2E paper map | 2F, rendered (landscape at 1x, 4x, 10.33x; paper map) |
  |---|---:|---:|---:|---:|
  | field | 372.8 km² | 113.5 m | 113.5 m | 3.9 m |
  | meadow | 25.9 km² | 155.8 m | 155.8 m | 7.2 m |
  | marsh | 7.5 km² | 75.0 m | 355.4 m | 3.9 m |
  | water | 10.2 km² | 51.9 m | 222.3 m | 3.9 m |
  | wood | 8.3 km² | 53.6 m | 293.5 m | 3.9 m |
  | village | 9.0 km² | 53.0 m | 809.9 m | 3.9 m (the ground); see the footprints below |
  | vineyard | 0.9 km² | 53.0 m | 53.0 m | 3.9 m |
  | track | 11.1 km² | 53.0 m | 53.0 m | 3.9 m |

  - On the 2E landscape the error is about one triangle: its diagonal is 115 m, less half a step. Meadow and field go
    further because on a flat valley floor the triangle's mean relief and the point's relief fall on opposite sides of
    the -1.2 threshold.
  - On the 2E paper map, marsh, water, wood and village are worse still. The symbology was drawn over classes the model
    gives priority: the 2E wood tint covered 0.78 km² that is village (0.37), marsh (0.32) or water (0.09); the village
    footprints cover 3.25 km² that is water (1.95) or marsh (1.31).
- **The meres (§I.2), re-read.** No georeferenced outline of the Satschan, Menitz or Kobelnitz ponds has been adopted since
  the note: no entry in this file adopts one, and the data carries none. The meres stay as they are (decision 27).

**The land cover drawn per point** (decision 28; `world.js`, "the land cover as drawn" and "the ground shader")
- The ground shader classifies every drawn point by `coverClass`'s own rule: the same tests, in the same order, on the same
  rasters (`gClass`).
  - The six rasters are uploaded unchanged (float textures) and interpolated exactly as `covAt` interpolates them (`gBil`).
  - The ponds' ellipses are `coverClass`'s own. The self-test checks the shader against `coverClass`, so a drift fails.
- **The local relief** is `COVER_ML`: the model's `localHeight` on a grid of 0.25 world units (16 m), interpolated
  bicubically (Catmull-Rom).
  - It matters only at `coverClass`'s three thresholds (-2.6, 0.4, -1.2). On a flat valley floor a small error there moves
    the edge far. Measured (`cover-2f.js --alternatives`, and the render):
    - the relief interpolated from the 81 m vertices puts meadow 234 m out and field 56 m;
    - bilinear on a 0.5 grid, 44 m and 12 m;
    - bilinear on the 0.25 grid, 24.5 m, for one 55 m island of field where the relief peaks 0.0017 units (about 1 cm)
      above the meadow threshold;
    - bicubic on the 0.25 grid, 7.2 m.
  - The grid is built coarse to fine. `localHeight` is evaluated exactly every 1.0 unit. Each node of the 0.5 lattice and
    then of the 0.25 lattice is interpolated from the coarser one, and evaluated exactly where that value lies within 0.5
    (then 0.2) of a threshold. That is 632,442 exact evaluations instead of 1,809,801. Checked against the exact grid:
    every node lies on the same side of every threshold as `localHeight`. With 0.3 and 0.1 (tried on the grid without its border), three nodes do not.
  - Four nodes to a texel, 7.3 MB.
- `drawnCover(x, z)` is the same rule on the CPU, for what is placed by class.
- **Coloured per point, as the palette coloured each triangle** (`makePalette` before 2F): the class's colour in `COVER_COL`,
  the elevation tint, the field pattern, the damp and trodden ground, the hollows' occlusion, the frost and the hillshade.
  - The per-face values became per point. The elevation, the curvature and the field pattern's frame are interpolated from
    the vertices (`groundVertexFacts`). The strips' tint and crop come from a table (`fieldStrip`, the old per-face formula,
    now one function).
  - The baulks and headlands are drawn per point, averaged where finer than a pixel.
  - The vertices carry only the light (hillshade and frost exposure), which follows the drawn slope. `makePalette` now
    returns that.
- **Palette colours unchanged** (Stage 4): `COVER_COL`, the elevation tint, the crop tints, the frost colour and the
  hillshade ranges are the same numbers.
- The atlas is sampled with the gradients of the continuous texture coordinate (WebGL2's `textureGrad`), so neither a class
  edge nor a tile's wrap draws a seam from the atlas's smallest mip.
- **The going layer is unchanged**: per triangle, its classes from `FACE.cover` and the model slope (decision 32). The
  self-test's checksum is the same at 1x, 4x and 10.33x, and the same as the 2E build's (1124006188).
- The viewshed is darkened per point on the natural ground and the paper map, from the nearest node of the analysis grid,
  as `sampleVS` reads it; on the going layer per triangle, as before.
- The apron (the ground beyond the field) has its own material now, in the per-triangle mode, its colours unchanged.

**The paper map after the change** (question L1)
- The triangle edges are gone (`2f-sawtooth.jpg`): the damp bands, the tracks, the field strips, the elevation tint and the
  occlusion change per point.
- **Woods on the paper map are traced from the drawn wood class** (`drawnCover` is wood), with each crossing found by
  bisection (about 0.1 m). They were traced from the wood field. So the paper wood, the ground under it and the landscape's
  trees are one extent: the cover field (unrotated, to about 0.89 of the radii, as the owner decided) less what a village,
  water or marsh takes from it. 12 outlines (2E: 10): a village or marsh cuts two woods in two.
- **Village footprints are unchanged**: the model's cover disc (owner decision on 2E). See the conflict below.

**Trees and scrub inside the wood's cover** (owner decision on 2E; `buildWoods`)
- A wood's trees are placed where `drawnCover` is wood, the same number per wood (`WOODS.n`). They used to fill the ellipse
  turned by `WOODS.rot`, to its radii.
- Its edge scrub is placed inside the cover's outer band (0.72 to 0.89 of the radii), where it is wood. It used to form a
  ring just outside the turned ellipse (1.02 to 1.24).
- Self-test: 1,010 trees and 354 edge scrub, every one where the drawn cover is wood, and every one where the model's own
  class (`coverClass` on `localHeight`) is wood. 354 of the 355 scrub were placed; one wood's band is mostly village, and
  the placement gives up after 40 tries each.
- **Not woods, and kept:** 184 trees round the villages (orchards and gardens) and 202 bank scrub along the Goldbach and the
  Litava. They are not part of a wood, stand on field, meadow or marsh, and the paper map does not draw them. I read the
  decision as about the woods' trees and scrub. Say if these should go.

**Roads and streams draped** (decision 28; `ribbon`, `drape`)
- Every vertex stands at its lift above `groundY`, the ground mesh itself. The vertices are 0.5 world units apart along the
  line and across it; they were 3 along, and only the two edges across. When the ground is redrawn (a factor, the paper
  map), every vertex is draped again.
- Measured (`tools/stage2/drape-2f.js`):

  | | 2E: worst vertex off its lift | 2E: edge midpoints under the ground | 2F: worst vertex | 2F: midpoints under |
  |---|---:|---:|---:|---:|
  | 1x | 0.044 | 0 of 6,468 | 0 | 0 of 223,302 |
  | 4x | 0.176 | 3 (to 0.114 deep) | 0 | 0 |
  | 10.33x | 0.454 | 62 (to 0.548 deep) | 0 | 0 |
  | paper map | 0 | 0 | 0 | 0 |

  At 1 unit apart, 30 midpoints still dipped under the ground at 10.33x (to 0.124). At 0.5, none.
- 43,932 vertices in 44 meshes (2E: 2,244).

**The meres** (decision 27; §I.2): no outline changes. The legend now carries a row "meres: pond outlines schematic", in
every view (the meres are drawn in every view). The self-test checks the row.

**Tests** (none loosened; new or stricter)
- Self-test, at 1x, 4x and 10.33x and on the paper map (`AUSTERLITZ_DEBUG.cover`):
  - **Cover boundaries (new, §J).** The ground is rendered straight down, one pixel per 0.125 units (7.9 m) over the whole
    field, with the shader's own class output. It is compared per pixel with `coverClass` on `localHeight`. Every class's
    drawn edge must lie within 20 m of the model's.
    - Measured: meadow 7.2 m, every other class 3.9 m. 948 of 7,142,400 pixels disagree, all within a pixel or so of an
      edge.
    - On the paper map, its ground alone, and with its woods and footprints (the footprints measured against the cover
      disc they are, by the owner's decision): the same numbers, 1,026 pixels.
  - **The drawn classes are one set** at every setting and on the paper map (new): the same class-render checksum.
  - **Woods (new):** every tree and scrub of a wood where the drawn cover is wood.
  - **Roads and streams (new, §J; stricter than §J asks):**
    - every vertex at its lift above `groundY` (to 0.05; worst 4.8e-7 on relief, 9.5e-9 flat);
    - and no edge midpoint under the ground (§J asks only for the vertices).
  - **The paper map identical at every setting:** now also compares the cover render.
- Unchanged checks still pass: the going classes identical at every factor; the paper map identical at every setting.
- `runtime-test.js`: its three.js stub takes `DataTexture`, `Vector4` and three constants, and its fake shader carries
  `uniforms`, as three.js passes them (test harness only).
  - **One assertion replaced, not loosened.** It looked for the atlas sampled as `texture2D(map,tuv)`; the atlas is now
    sampled through `gAtlas(map,tuv)`.
  - The new assertion also requires the per-point classifier (`gClass`) and its rasters' uniforms, so it is stricter.
- The height guard: 54 → 61 call sites, each new one classified.
  - model: `buildCoverMl` (`localHeight`, the cover's own relief);
  - presentation: `drape` (`groundY`);
  - test: the self-test's `coverTruth`, `roadDrape` (two), `woodPlacement`.

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard (61 sites, 0 presentation sites calling `height()`/`hAt()`, none
  unclassified).
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:visual`: all checks passed, 17 views, the self-test 98 of 98 (81 in 2E) in 182 s.
  - Per view (`docs/stage2-evidence/2f-report.md`, both builds on the same harness): overlaps 0 in all 17; drops within every limit (paper-laptop
    17 → 18 of 21, the legend's new row taking room; every other view as in 2E); pass times 0.6-2.8 ms; no text below its
    floor or AA (lowest 4.68:1, as 2E); the unobstructed fraction 0.3-0.7 points lower in the Study views (the meres' row),
    every view above its 2C baseline; the legend never over the dispatch. The ground's colour: mean luminance within 0.6 of
    2E's in every view but paper-laptop (102.7 → 100.3), the near-black fraction unchanged in every view.
- `npm run check:contrast`: 4,364 text elements in 22 states (2E: 4,348; the meres' row), 0 below AA, 0 below 10.5 px.
- `npm run check:baseline`: moved to this build.

**Performance** (`tools/stage2/perf-2f.js`; the harness machine, headless Chromium, software WebGL; both builds in turn)
- **Start-up, the cover drawing's own work:** 110-158 ms (2E: the two palettes and their upload) → 571-592 ms.
  - `buildCoverMl` 461-509 ms; the textures 21-24; the vertex facts 36-47; the palettes, now light only, 19-26.
  - **An increase of about 0.45 s**, almost all the 632,442 `localHeight` evaluations of the relief grid.
  - The whole page, navigation to ready: 20.5-22.3 s (2E) and 22.0-28.3 s (2F) over two sessions of three and two runs,
    too noisy on this machine to state the difference more closely than the component timing.
- **A display-factor change:** 75-232 ms (2E) → 85-169 ms (2F), twelve changes each. The palette is now only light, and the
  ribbons are re-draped. The control stays disabled during playback, as before.
- **A switch into the paper map:** 123-249 ms (2E) → 106-195 ms. **Back to the landscape:** 81-118 → 90-187 ms, from
  re-draping 43,932 ribbon vertices. 2E recorded 70-157 ms for both.
- **A drawn frame**, software rendering, read back (median of seven after three to warm up):
  - overview-field 3,445 → 4,340 ms (+26%); paper-north-up 1,166 → 1,415 ms (+21%). That is the per-point classification
    in SwiftShader.
  - A GPU does this pixel work in parallel; the harness machine is the worst case.
  - The ground's textures add about 8.4 MB of GPU memory (the relief grid 7.3 MB, the rasters 0.8 MB, the viewshed 0.3 MB,
    the field table).

**Decisions 27, 28, 30 and 31: nothing proved unworkable.** Two contradictions and one reading, stated:
1. **Village footprints (owner decision) against §J's paper-map boundary test.**
   - The footprint is the model's cover disc (`covVill` > 0.55). 3.25 km² of its 12.29 km² is classed water (1.94) or
     marsh (1.31) by `coverClass`, which gives water and marsh priority.
   - Measured against the class polygon, the paper map's village edge would be 810 m out.
   - The paper-map test therefore takes the footprint as the paper map's village polygon, as decided. The ground under it,
     and the landscape, draw the classes. Both are measured and both pass.
   - Which extent the paper map should show is the village-extent data question the owner recorded; it is open.
2. **"Cover polygons" (decision 28) for meadow, marsh and the stream water are not polygons in the data.** They are contours
   of the local relief (`coverClass`'s thresholds), so drawing them within 20 m needed the fine relief grid above.
3. **Trees round villages and stream scrub** are kept, as above.

**Not done, or open**
- **Recorded as open (owner, on 2E):**
  - **Woods:** whether `WOODS`' shapes and rotations should change (the cover ignores `WOODS.rot` and ends at about 0.89 of
    the radii) is a data-task question. Not changed.
  - **Villages:** sourcing their extents is a data-task question. Not changed. The land cover and the footprints stay the
    cover disc; the houses stay as they are (symbols at 10-15x life).
- **Meres:** schematic until a georeferenced outline is adopted (§I.2 lists what that needs).
- The start-up cost of the relief grid (+0.45 s). It could be computed after the first frame, or in a worker, drawing the
  first frames from the coarse grid: a design choice for the owner, not made here.
- The per-point classification makes a software-rendered frame 21-26% slower.
- Still open from 2D and 2E, unchanged:
  - pratzen-orbit-min draws no map text (head boxes against triangles; it also costs one drop in three paper views);
  - the Watch `#viewmode` at 24% opacity;
  - selected-formation's drop limit of 3;
  - the paper map's framing inside the unobstructed area (small in Study);
  - the mode switch not disabled during playback.
- The going thresholds (decision 32) and the other data questions are unchanged and still open.

## 2026-09 · Stage 2E: the true north-up paper map (docs/STAGE2_SPEC.md §F, §G, §H, §J, §K; decisions 18, 19, 25, 29, 31, 39)

**Status: done; merged (#18). 2F has not started. `austerlitz-command-map.html`: 1,226,091 bytes, md5
`c5883f79cc1481b2dc4863d089b4e363`** (was 1,189,512 bytes, md5 `2dc0c26d…`, Stage 2D).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`; the reference does not move.
  No track, `OVERLAYS`, strength, order-of-battle or geography change. Presentation only.
- The first commit records 2D as merged (#17) in `CLAUDE.md`, this file and `docs/STAGE2_SPEC.md`.

**Before building (fact).**
- `main` (19abc15) matched `check:baseline`: md5 `2dc0c26d969ec037cb838929d259320f`, 1,189,512 bytes.
- **What still assumed a perspective camera after 2D**, read from the code. 2D had removed `labelRect`, `fitLabel` and the
  sprite sizing, the three places §G.2 and the §K 2E row named. What was left:
  - `pxPerWorld` (camera `fov`, distance): only the scale bar used it;
  - the map layer's pass and its symbol obstacles (`mlLayout`, `mlObstacles`): `tan(fov/2)` for the world-to-pixel size;
  - occlusion (`mlOccluded`) and the ground under the pointer (`groundAt`): rays from the eye as a point;
  - the level of detail read the eye's distance: corps beyond 250, brigades within 165, place names within 210, full
    counters within 70, the plan links within 190;
  - every camera path moved the one perspective camera: orbit, glides, presets, the first view, the ground floor, the
    factor change, the resize handler.
  So the §K risk had shrunk from label sizing to one projection helper, a distance for the level of detail, two eye rays and
  the camera paths. Each is handled below.
- **`tools/stage2/paper-map.js` re-run on the 2D build** (1600 x 900; §G.1 was measured on the Stage 1B build):

  | | §G.1 (Stage 1B) | re-run on 2D |
  |---|---|---|
  | today, north on screen | 18.4° off up | 17.8° off up |
  | today, px per true km at the Pratzeberg / Sokolnitz / the Santon / Satschan | 79.6 / 79.0 / 75.5 / 78.7 (5.2%) | 78.0 / 78.8 / 74.6 / 79.4 (6.0%) |
  | today, the frame on screen / in the probe's free area | 51.6% / 35.9% | 51.9% / 36.4% |
  | probe (4°), north | 0.2° | 0.1° |
  | probe, px per km | 28.6 / 28.6 / 28.7 / 28.6 (0.3%) | 28.6 at all four (0.0%) |
  | probe, frame | 99.9% / 99.9% | 99.9% / 99.9% |
  | probe close on Sokolnitz | 102.4 / 102.0 / 102.4 / 101.5 (0.9%), north 1.0° | 102.3 / 102.1 / 102.4 / 101.9 (0.5%), north 0.4° |

  The close probe is better on 2D because the 4x default relief has less parallax than the 10.33x of Stage 1B.
  The probe cannot run on the 2E build: it sets the perspective camera's field of view, and the paper map no longer uses
  that camera.

**The paper map** (decisions 19 and 25, §G.2; `app.js` "the paper map's camera: MAPCAM", `world.js`)
- **An orthographic plan**, straight down, with `GEOREF.NORTH` up (the frame is rotated `GEOREF.ROT_DEG`, 17.42°).
  - `camera` is now the camera drawn and projected through. `landCam` is the landscape's perspective eye and `paperCam` the
    plan. Every path that moves the landscape's eye moves `landCam`, so the landscape view survives a visit to the paper map.
  - Phase changes do not move the plan: the whole field is on it.
- **The ground is drawn flat** (§G.2: "factor 0 in the 2B helper"). `DISPLAY.flat` makes the drawn scale 0, and the 2B
  redraw (`rescaleWorld`, factored into `redrawGround`) re-seats everything on the flat sheet. `DISPLAY.factor`, the
  setting, is kept for the landscape: a changed setting is recorded while the paper map is shown, and drawn on return.
  - The relief control is not offered on the paper map. Its row says why: "The paper map is drawn flat, with its own
    hillshade (×6); the setting applies to the landscape".
  - **A switch into the paper map takes 111-157 ms, and back 70-92 ms** (1x, 4x, 10.33x, three times each, on the harness
    machine; `tools/stage2/paper-2e.js`). The landscape's palette is kept per drawn scale, so a return is not recomputed.
- **Its own cartographic hillshade** (decision 19): `PAPER_HILLSHADE`, 6 relative to true scale. It is computed once, from
  the model's normals, and does not change with the setting.
  - Chosen on the renders at ×2, ×4, ×6 and ×10.33 (`2e-hillshade.jpg`). At ×6 the western escarpment and the Goldbach
    valley read, and the round knobs of the relief model (the Santon, the Pratzeberg summit) are no stronger than at ×10.33.
  - A design value, not a scale. The legend states it.
- **Hidden** on the paper map: figures, standards, houses (the roofless crates 2D still drew), roofs, chimneys, spires, 3D
  trees and scrub, smoke, dust, mist, the sky dome.
- **Drawn**, besides the hillshade, contours, water, roads, draped arrows, event glyphs and counters:
  - **flat village footprints** and **woods as map symbology** (a tint, tree marks that keep one size on screen, an outline);
  - both are traced from the model's own land cover: the level of the cover field `buildCover` builds from `VILLAGES` and
    `WOODS`, at `coverClass`'s thresholds (village 0.55, wood 0.5), on a grid four times finer than the cover raster;
  - 20 village footprints and 10 woods; colours in `TOKENS.sym.paperMap` (new).
- **Controls** (`MAPCAM`, written for reuse in Stage 3: it knows only its camera, the viewport, the panels and a scheduler):
  - a drag pans, the ground under the pointer staying under it; the wheel zooms toward the cursor;
  - keys: on the paper map the map layer itself takes focus (Tab, after the interface), and then the arrows pan and + and -
    zoom. Elsewhere the arrows keep stepping the clock, as before;
  - no orbit, no tilt;
  - every camera move the app asks for (a vantage, a tour stop, a chapter, an event, centring on a formation) becomes a move
    of the plan: its target at the centre of the free rectangle, at the zoom the landscape eye would show at that distance.
    The Overview vantage frames the whole field.
- **Framing** (§G.2, §J): entering the paper map frames the whole modelled ground (360 x 310 world units) in the largest
  rectangle of the screen that no panel covers, 10 px clear. Once the plan is moved by hand, it stays where it was left. A
  resize frames the field again if the plan is showing the framed field.
- **One projection helper** (§F, §G.2): `worldPerPx(point)` gives the ground length one screen pixel spans at a point, for
  either camera. The scale bar, the level of detail, the layer's sizes and the symbol clearances read it; no code reads a
  field of view. For the level of detail the plan's zoom is read as the landscape distance that shows the ground at that
  scale (`distAtWpp`). `GEOREF` stays the only scale authority: `worldPerPx` is the projection, not a second scale.
- Occlusion is off on the plan (nothing lies behind flat ground seen from straight above). The ground under the pointer is
  the plan point.

**The map layer and the legend on the paper map** (decision 29)
- Every counter and map text still goes through the 2D layer.
- **Paper-map labels may go farther** (new; paper map only): every label may use the far rings (to 380 px) and the
  last-resort rows that 2D gave only to what is never dropped. The framed plan is small and dense, and its free room lies
  around the sheet. Measured, on the paper views: paper-north-up 18 → 11 drops, paper-close 2 → 1, paper-drawer 7 → 4,
  paper-laptop 24 → 17. The landscape and hybrid views are unchanged (the per-view table: identical numbers).
- **What is never dropped now wraps, as a last resort** (new; all views, only where it would otherwise not be drawn). Found
  by the self-test at 1366 x 768 with a dossier open: the paper map's only free strip (236 px, between the dispatch and the
  drawer) is narrower than the selection's full counter (308 px) and a live event's name (355 px). Such an item is laid out
  again with its words wrapped, narrower each time, until it fits. In every view before 2E everything fitted whole, so
  nothing there changes.
- **Hover reaches a dropped formation's own position first** (new): its anchor, within 6 px of the pointer, wins over
  another item's box drawn over it. Found by the self-test: a dropped corps counter (III Corps) on the framed paper map at
  1366 x 768 had its anchor under a neighbour's counter, so it was reachable only from the keyboard.
- **The legend, contextual:** two rows while the paper map is shown, "wood (its extent in the model)" and "village (its extent
  in the model)", in the colours they are drawn in. Its scale line reads "paper map: the ground drawn flat, in plan; hillshade
  exaggerated ×6 (1× is true scale)". Its symbol line reads "villages and woods at their extent in the model; counters and
  names at symbol scale", because the paper map draws no figure, building or tree. Its controls line reads "drag to pan …".
  It is never over the dispatch (unchanged rule, tested).

**New harness cases** (§J, 2E; `tools/visual/cases.js`)
- paper-north-up: 1600 x 900, Study, 09:30, entered.
- paper-close: Sokolnitz, 08:20, the zoom of the landscape's close view.
- paper-drawer: Saint-Hilaire selected, dossier open, the zoom the app centres a formation at.
- paper-laptop: 1280 x 720, entered.
- A build before 2E frames paper-north-up and paper-laptop by their `cam` (its Overview), so the harness measures both builds.

**Their drop limits and baselines** (decision 39; `tools/stage2/paper-limits.js`; `docs/stage2-evidence/paper-limits.json`).
The 2C build has no plan camera. Each view is reproduced there with the app's own camera straight down and north up, at the
2E view's centre and scale: 1.082, 23.19, 15.64 and 0.348 px per world unit, matched to 0.001. The 2C level of detail sees
the same distance. What the 2C canvas pass hides there:

| view | 2C, its own panels | 2C, panels at the 2E rectangles: **the limit** | 2E drops |
|---|---:|---:|---:|
| paper-north-up | 19 | **20** | 11 |
| paper-close | 3 | **2** | 1 |
| paper-drawer | 3 | **5** | 4 |
| paper-laptop | 0 | **21** | 17 |

- **A method choice, for the owner.** 2D measured every other limit with the 2C build's own panels. For these four views the
  matched count is used. The 2C legend (the Stage 1B legend, 587 px) covers ground the 2E legend (296 px) leaves free, and the
  2C pass counts an item under a panel as neither shown nor hidden. At 1280 x 720 that legend covers the whole framed field,
  so the native count is 0 by construction. The matched counts are the same items against the same obstacles (the 2E
  build's unobstructed fractions are reproduced exactly: 36.81%, 36.07%, 17.82%, 22.18%). With the native counts,
  paper-drawer (4 > 3) and paper-laptop (17 > 0) would fail.
- A finding about the probe: a narrow field of view (4°, as `paper-map.js`) puts the eye 10-40 times farther, and the 2C level
  of detail, which reads the eye's distance, then changes the item set.
- The unobstructed baselines are the 2C build's own, as 2D's are: 30.28 / 15.11%, 30.28 / 16.26%, 14.77 / 6.97%, 15.11 /
  15.11%.

**Per view, before (2D build) and after** (`tools/stage2/report-2e.js`; `docs/stage2-evidence/2e-report.md`, both harness
runs on the same cases). The paper map, §J (2E):

| view | camera | north | px per true km at 4 places | spread | scale bar error | field on screen / in the unobstructed area | 3D drawn | missing |
|---|---|---|---|---|---|---|---|---|
| staff-paper | perspective → orthographic | -17.80° → 0.00° | 78.0-79.4 → 77.6-77.8 | 6.06% → 0.20% | 0.88% → 0.40% | 51.9 / 22.7% → 44.9 / 18.8% | houses → none | footprints, woods → none |
| paper-north-up | perspective → orthographic | -17.80° → 0.00° | 74.6-79.4 → 17.1 | 6.06% → 0.20% | 0.88% → 0.50% | 51.9 / 22.7% → **100 / 100%** | houses → none | footprints, woods → none |
| paper-close | perspective → orthographic | -101.87° → 0.00° | 102.9-252.3 → 366.5-367.3 | 59.24% → 0.20% | 104% → 0.32% | 16.5 / 9.5% → 2.3 / 0.7% | houses → none | footprints, woods → none |
| paper-drawer | perspective → orthographic | -81.73° → 0.00° | 165.7-499.8 → 247.2-247.7 | 66.85% → 0.20% | 27.8% → 0.24% | 13.1 / 3.6% → 5.1 / 0.8% | houses → none | footprints, woods → none |
| paper-laptop | perspective → orthographic | -17.80° → 0.00° | 59.7-63.5 → 5.5 | 6.06% → 0.20% | 1.04% → 0.21% | 51.9 / 13.8% → **100 / 100%** | houses → none | footprints, woods → none |

- The remaining 0.20% is not the camera. The four places are measured in true kilometres east-west (cos of each place's
  latitude); the map is `GEOREF`'s plane. The spread is the cos(latitude) change across the field.
- The close views' "field on screen" is small by design: they are close views.

The map layer, every view (§J, 2D; the full table in `2e-report.md`):
- **The 12 landscape and hybrid views are unchanged**: the same drops, leaders, nodes, text sizes and contrast as the 2D
  build; pass times 0.5-1.0 ms.
- Overlaps 0, nothing over a panel or a head, text below floor 0 and below AA 0 in all 17 views.
- The paper views: staff-paper 6 → 4 drops (13); paper-north-up 11 (20); paper-close 1 (2); paper-drawer 4 (5); paper-laptop
  17 (21). Pass times 0.6-3.0 ms (budget 8). Lowest text contrast 4.68:1 (paper-drawer).
- **The unobstructed fraction on the paper views fell against 2D**, not below the 2C baselines: staff-paper 38.3 → 36.8% at
  1600 x 900 (baseline 30.3%) and 24.5 → 22.2% at 1280 x 720 (15.1%). The legend's two paper rows make it taller.

**Tests** (none loosened; all new)
- Harness (`thresholds.js`), every paper-map view: north within 0.5° of up; px per true km at four places equal to 1%; the
  scale bar correct to 1%; no figure, roof, chimney, house or 3D tree drawn; hillshade, contours, village footprints, water,
  woods, draped arrows and counters drawn. paper-north-up and paper-laptop: every one of the 1,184 sample points of the
  modelled ground on screen and clear of every panel. Plus every 2D threshold, with the new views' limits and baselines above.
  `measure.js` reads the paper map's geometry from the page as drawn (`paperMap`).
- Self-test, at 1x, 4x and 10.33x (7 checks each), plus one across the settings:
  - the ground flat and hillshaded at its own factor, the setting kept;
  - north up; one scale and the scale bar;
  - the field framed clear of the panels;
  - drawn and hidden;
  - the controls through the handlers a visitor drives: a 139 px drag leaves the ground point 0.000 px from the pointer;
    three wheel steps leave the ground under the cursor 0.277 px from it; the right arrow pans 108 px with the clock
    unchanged; north still up and the landscape eye unmoved;
  - leaving the paper map redraws the relief;
  - the paper map identical at every setting: the same hillshade checksum, the same draped overlays, the same scale.
  Two paper states join the layer checks (the paper map entered, and Saint-Hilaire selected on it), and so does a tour stop
  on the paper map; the legend's wood and village rows are checked. The self-test now starts on the landscape.
- `check:contrast`: 22 states (2 added: the paper map as entered, and close on Sokolnitz in Study; Watch's view-mode control at
  24% is the open 2D item, so the close state is in Study, as 2D's hybrid state is).
- `runtime-test.js`: its three.js stub takes the real `ShapeUtils` and its DOM stub `removeAttribute` (test harness only).
- The height guard: 51 → 54 call sites, each new one classified. The apron's elevation tint on the flat paper map reads the
  model height (model: a colour, as `buildFaceFacts`' tint); the self-test's paper checks (test). The 2D entry above says 54
  for the 2D build; the guard counts 51 on it.

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard (54 sites, 0 presentation sites calling `height()`/`hAt()`, none
  unclassified).
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:visual`: all checks passed, 17 views, the self-test 81 of 81 (11 min 17 s on the harness machine).
- `npm run check:contrast`: 4,348 text elements in 22 states, 0 below AA, 0 below 10.5 px.
- `npm run check:baseline`: moved to this build.

**Question L1: the triangle land-cover edges** (not fixed in 2E; 2F fixes them; `2e-sawtooth.jpg`)
- On the paper map they are plainer than on the landscape: flat, unlit and seen from straight above, each 81 m triangle of
  the cover classes reads as a saw-toothed patch. The worst are:
  - the damp low ground (class 1) and marsh along the Goldbach and the Litava, a pale blue-grey stair-stepped band either
    side of the stream;
  - the elevation tint and the hillshade, which are smooth across a triangle but faceted between neighbours at close zoom.
- Woods and villages have a clean outline and tint drawn from the model (decision 31), but the cover colours under them still
  poke out in steps along their edges.

**Findings, and where 2E departs from §G.2**
- **The framed field is small in Study** (decision 25 with §H). The rail, the dispatch and the open legend leave a free
  rectangle of 472 x 648 px at 1600 x 900 (17.1 px per km; the field is 436 px across its north-up bounding box). At 1366 x
  768 it is 272 x 504 px (9.9 px per km), and at 1280 x 720 152 x 552 px (5.5 px per km). With a dossier open at 1600 x 900 it is 128 px wide. That is what "the battlefield
  frame inside the unobstructed area" gives while two-thirds of the screen is interface (§H); Stage 3's docked dispatch is
  the remedy §H names. §G.2 lists "the rail, the dispatch and the timebar"; §H's definition, which §J's test uses, also
  counts the legend. I followed §H. Without the legend, the rectangle at 1600 x 900 would be about 820 px wide.
- **Village footprints are much larger than the drawn houses.** A footprint is the model's village cover (radius 2.6 +
  0.46 × houses world units: about 480 m for Pratzen, 540 m for Sokolnitz). The landscape's houses stand in a smaller cluster
  along the lane (radius 2.4 + 0.42 × houses, along the lane). The footprint shows the ground the model classes as village,
  and the going layer reads that class. Both extents are schematic; neither is a sourced plan. Not changed: `buildCover` is
  guarded model code.
- **Woods: the model's cover and its trees disagree slightly.** The cover field ignores each wood's rotation (`WOODS.rot`,
  up to 0.4 rad) and ends at about 0.89 of its radii. The landscape's trees fill the rotated ellipse to its radii. The paper
  map draws the cover. This is pre-existing and guarded; it is for 2F or a data task.
- **Hidden** adds houses to §G.2's list. §G.2 notes that today's staff map draws them as roofless crates.
- Keys: §G.2 asks for keyboard pan and zoom, but the arrows already step the clock, so they pan only while the map layer has
  focus.
- The paper map's symbol line in the legend replaces §F.2's "always the two named symbol scales". The paper map draws no
  figure, building or tree, and decision 29 asks for one row per encoding on screen.

**Decisions 18, 19, 25 and 29: nothing proved unworkable.** Decision 19 holds exactly: the paper map is identical at 1x, 4x and
10.33x. Decision 25 holds: north 0.00°, one scale to 0.2%, framing complete. Its framing with the Study layout gives a small
map, as above. Decision 29 holds with two additions stated above: the wrap and the paper-map rows. Decision 39: see the limits
method above.

**The head-obstacle question (open from 2D) does affect the paper map.** Arrow heads, event glyphs and markers as obstacles
cost one drop each in staff-paper (Goldbach), paper-close (Sokolnitz) and paper-drawer (Pratzeberg), and none in
paper-north-up and paper-laptop (`paper-2e.json`, a diagnostic run without them). Seen from straight above, a head is a
large flat triangle, and its bounding box is larger still.

**Not done, or open**
- The method of the four new limits (matched panels), above.
- The paper-map rings and rows, and the last-resort wrap, are design choices made on the harness views.
- A switch into and out of the paper map takes 70-157 ms. Unlike the relief control (disabled during playback above 100 ms),
  it is not disabled during playback: a visitor switching view pays it once. Say if it should be.
- `PAPER_HILLSHADE` (6) is a design value chosen on renders.
- Still open from 2D, unchanged: pratzen-orbit-min draws no map text; the Watch view-mode control at 24%; selected-formation's
  drop limit of 3; "a place whose marker cannot fit on screen is off screen".

## 2026-09 · Stage 2D: one DOM/SVG layer for map text, and the contextual legend (docs/STAGE2_SPEC.md §E, §F, §H, §J, §K; decisions 24, 29, 38, 39)

**Status: done; merged (#17). 2E has not started. `austerlitz-command-map.html`: 1,189,512 bytes, md5
`2dc0c26d969ec037cb838929d259320f`** (was 1,166,868 bytes, md5 `68ac7721…`, Stage 2C).
- `check:baseline` moves to this build.
- `check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`; the reference does not move.
  No track, `OVERLAYS`, strength, order-of-battle or geography change. Presentation only.
- Delivered in two pull requests: #16 (merged work in progress: the layer with the Stage 0 canvas path still behind
  `?labels=canvas`), then this one: the parity screenshots from that build, the canvas path retired, the checks.

**Before building: the drop limits, re-measured** (decision 39; `tools/stage2/dom-layer.js`, "canvas today", on
`archive/stage2c-68ac7721.html`). What the Stage 0 canvas pass hides, per harness view. §F.3's counts were taken on the
Stage 1B build, before the chronology task, 2B's third declutter ring and 2C's arrow changes. The re-measured counts are
the limits (`tools/visual/thresholds.js`, `DROP_LIMIT`).

| view | §F.3 (Stage 1B) | re-measured on 2C: the limit |
|---|---:|---:|
| first-run | 12 | 12 |
| first-run-laptop | 14 | 16 |
| overview-field | 10 | 11 |
| overview-plan | 10 | 12 |
| close-sokolnitz | 9 | 18 |
| staff-paper | 9 | 13 |
| pratzen-low | 7 | 13 |
| pratzen-orbit-min | 21 | 27 |
| selected-formation | 5 | 3 |
| watch-selected | 11 | 8 |
| hybrid-dimmed | 10 | 13 |
| pratzen-low-1x | — | 12 |
| pratzen-low-10x | — | 8 |

The two views 2B added have no §F.3 count. selected-formation is **3**: the canvas pass hides 3 there with the dossier at
rest. A first count of 5 was taken with the dossier frozen mid-slide (the harness finding below), and the limit was corrected
to the at-rest count, which is stricter. A finding about the probe: its item list was read after the canvas pass had
already hidden what it hides, so §F.3's "dropped" counted drops among what the canvas had kept (and the anchors under
panels). The layer's drops are counted over the whole level-of-detail set, like the canvas pass's hidden count.

`tools/stage2/map-text.js`, re-run on the 2C build (the section E method on the sprites): **562 in-scene text runs,
130 below their floor, 83 below AA** in the 13 views (§E: 495, 149 and 83 in 11 views on the Stage 1B build).

**A finding about the harness, fixed in the tools (no threshold involved).** In headless Chromium a CSS transition does not
advance while the page draws nothing, and render on demand draws nothing once a view has settled. So every harness view
reached from a Watch view was measured with the panels frozen at the start of their 0.32 s slide: in selected-formation the
dossier drawer stood at x 1598-1974 on a 1600 px screen, its `on` class set (`document.getAnimations()`: 13 transitions
"running" at 17 ms, unchanged 1.5 s later). The harness (`harness.js`) and the Stage 2 page helper (`page.js`) now turn CSS
transitions off, as `check:contrast` already did, so each view stands where its panels come to rest; `settle` then waits
450 ms for the time bar's ResizeObserver and draws once more. The app itself now draws frames while an interface panel
slides (`transitionrun`/`transitionend`), so the layer follows a moving panel in real use.

**A second harness finding, fixed in the tools.** For the same reason, a `resize` event is delivered only with a rendered
frame. After the harness measured a view at 1280 x 720 and restored the viewport, the page still had the old size, and
the self-test, run later on that page, measured a 1280 x 720 canvas in a 1366 x 768 window. The harness now tells the page
of its new size (it dispatches the pending `resize`) before it draws. The app's resize handler is unchanged.

**The unobstructed baselines** (§H; `thresholds.js`, `UNOBSTRUCTED`) were measured by this harness on the 2C build, at rest.
They equal `map-text.js`'s values in every view but one: selected-formation at 1280 x 720 is **6.97%** at rest, where
`map-text.js` reported 15.1% with the drawer frozen almost wholly off screen. The baseline is the at-rest value. Stated
because it is the one number the 2D build is compared against that moved: the 2D build has 12.5% there.

**Also found on the 2C build: the legend lay over the dispatch** in selected-formation at 1600 x 900, by 51,124 px²
(the 587 px Stage 1B legend, shifted left of the open dossier). The harness now fails on any overlap of the two; the 2D
legend never overlaps it (below).

**The layer** (`app.js`, "THE MAP LAYER"; `symbols.js`; `style.css`; `shell.html`)
- **One DOM layer**, `#maplayer`, over the WebGL canvas and under every panel (z-index), holds every counter and all
  in-scene map text:
  - formation counters (paper map and hybrid) and names (landscape);
  - event labels and the plateau reading;
  - movement, line, boundary, halt and objective labels;
  - plan labels (staging areas, columns, objectives);
  - place names (each with its marker) and terrain-study labels.
  Symbols stay in the scene: arrows and ribbons with their heads, event glyphs, objective and plan markers.
- **One pass per drawn frame** (`renderFrame` calls `mlLayout`): render on demand is unchanged, a skipped frame lays out
  nothing (self-test). An item's content is rebuilt only when its key changes; positions every drawn frame.
- **Priority** (§F.1): the selection; the formation under the pointer or keyboard focus; the highlighted family; counters
  by echelon, larger first; live events; the plateau reading; movement and plan labels; formation names; place names,
  major first; terrain-study labels; objective names. What is never dropped (decision 39: the selection, the formation
  hovered or focused, the highlighted family, the labels of live events) is placed first.
- **Placement:** at the anchor (the counter's frame 6 px above its point), then the eight places around it, then rings of
  28-148 px (on to 380 px for what is never dropped) with a leader line to the anchor. A place name sits only beside its
  marker. A counter at its anchor keeps a short stem to its ground point.
- **Obstacles:** the interface panels, every item already placed, the arrow heads (the casing's head mesh as drawn now, every
  vertex projected: a change of display factor re-drapes a head in place), event glyphs, objective and plan markers, 2 px
  apart. An item that finds no room is dropped and counted.
- **Not drawn, and counted apart:** an anchor off screen, under a panel, or behind the drawn ground. A place whose 10 px
  marker cannot be drawn inside the screen (its anchor within 7 px of an edge) counts as off screen, not dropped: a
  definition, stated because it decides selected-formation (Litava and Křenovice sit at the top edge there).
- **Occlusion** (§F.3 asked for a method cheaper than its rays): the segment from the eye to the anchor is marched over
  the drawn ground (`groundY`), every 0.35 units from where it first comes below the highest drawn ground, the last 1.2
  units left out. What is never dropped is not occluded. Measured against §F.3's rays on the same anchors
  (`tools/stage2/occlusion-2d.js`; `docs/stage2-evidence/occlusion-2d.json`): **7,563 of 7,563 anchors agree** in 7 views (44 occluded at 10.33x by both, none at 1x or 4x); the march takes 0.1-17 ms
  per view (0.0001-0.016 ms an anchor), the rays about 8.4 s (7.7 ms an anchor).
  - A finding: at the 4x default no anchor in the harness views is behind the ground; occlusion matters at 10.33x.
  - The first version's tolerance (0.05 units) missed 4 grazing contacts at 10.33x (the segment 0.03-0.05 units below the
    ground); it is 0.005 now.
- **Found while finishing** (each by the self-test at 1366 x 768, on the harness's own page):
  - a never-dropped label longer than the gap between two panels (Telnitz retaken, 291 px in a 298 px gap) found no ring
    position; what is never dropped is now tried, as a last resort, flush against each obstacle's sides on rows 8 px apart;
  - item sizes measured before the web fonts arrived were kept; every item is measured again when fonts finish loading;
  - a head's screen box is projected from its mesh as drawn, with its parents' matrices brought up to date first.
- **Tab order:** the layer comes last in the page, so Tab reaches the interface first, then the map objects in priority
  order.

**Counters** (decision 38; `symbols.js`, `counterHTML`)
- **Compact by default:**
  - the 40 x 28 px cased frame (keyline, side band, keyline, nation fill) with the arm glyph as SVG;
  - the nation tag (10.5 px) and the echelon mark above (10.5 px);
  - the B / C / ? badge on its plate;
  - the status icon without its text, and the short name at 12.5 px.
- **Full** for the selection, the highlighted family, hover, keyboard focus, and closer than 70 world units (about
  4.4 km; `ML_FULL_DIST`, chosen on the harness views: in hybrid-dimmed only the family is full): adds the status words
  with their icon, the strength and the commander (12.5 px).
- **Plates:** counter text, badges and nation tags sit on opaque plates (the counter plate, the badge plate, the nation
  fill): 5.4-16.7:1 by value. Every other map text sits on `TOKENS.sym.plate` (new): 0.88 dark, 0.95 paper, chosen so the
  dimmest map ink stays at AA over black and white ground (road ink 5.8:1, water ink on paper 4.6:1).
- **Dimmed counters** (decision 13): fill, band and glyph at 34%; text and badge at full opacity one step down
  (`counter-sub`, 400); the nation tag is text at full opacity, `counter-sub` 400 on the neutral plate, 6.49:1.
- **Accessible names:** "Saint-Hilaire's Division, French, division, about 6,600, heavily engaged, position grade A"
  (name, side, echelon, strength, status, grade; "reported only" where it is).

**Drops, hover and the keyboard** (decision 39)
- A dropped item stays in the layer, invisible and focusable. Tab reaches it; focus draws it (never dropped while focused).
- Hovering a formation's position draws it: the pointer is tested against the layer's boxes, then the formations'
  footprints, then within 20 px of a counter's anchor (a corps counter has no footprint).
- **Picking by footprint:** a click selects the item whose drawn box it is in; else the formation whose footprint (the
  2B primitive, frontage W0 x sw by depth D0 x sd at its yaw, or the drawn block where larger, with one unit to spare)
  contains the ground under the pointer (the view ray marched over `groundY`, then bisected); else a corps counter, an event
  glyph or a place within 34 px, as before.

**The legend** (decision 29, §F.2; `shell.html`, `app.js` `paintLegend` and `mlLegendFit`)
- **Contextual:** one row per encoding on screen, from the tables that draw it:
  - the nation fills where counters or figures are drawn; the two footprint colours at true scale;
  - each side's movement row where that side has an arrow; the halt and the boundary where one is drawn;
  - the plan staging outline while a plan is on; the analysis dashes while the terrain study is on; the going classes
    (with their provisional true-degree thresholds) while the going layer is on;
  - the badge row where counters are drawn; the contour interval with the contours;
  - always: the display factor relative to true scale, and the two named symbol scales.
- **Compact:** at most 296 px wide, rows wrapped: 296 x 324 px in overview-field against 587 x 379 px before.
- **Collapsible:** its head ("Key", with the north rose) opens and closes it.
- **Never over the dispatch:** where the open legend would overlap it (a narrow window with the dossier open) it stays
  closed, and its head says why. At 1280 x 720 with a dossier open it is closed.
- **Not adopted from §F.2:** "collapsed to a Key button by default in Watch". A Key button in Watch would be a new panel in
  the Watch views, whose unobstructed fraction §J forbids to fall. The legend stays hidden in Watch, as before.

**The guided tour: a bug found and fixed** (present on 2C and since the first build). At each stop, `flyTo` replaced
the phase change's transition, so the overlay fade stopped at 0: the stop's arrows were drawn at opacity 0 and the previous
phase's stayed drawn (`ovFadeIn` 0, `ovFadeOut` 1, measured 9 s after the stop on 2C and the phase-1 build). `glide` now
runs a transition already under way beneath the camera move; after the fix the stop's arrows stand at 0.95 within 3 s. The
self-test's tour state found it. (The WIP pull request #16 said this fix was not applied; it was, in that commit.)

**Retired** (after the parity screenshots, on this branch)
- The Stage 0 canvas pass: `declutter` with its second and third rings, `labelRect`, `panelCovers`, `LABEL_STATS`,
  `window.__fitLabel`.
- Every text sprite (counters, names, place glyphs, overlay, objective, event, plateau, plan and terrain-study labels),
  the counter stems, and `drawSymbol`, `makePlainLabel`, `makeFeatureGlyph`, `refreshSymbol`, `refreshGlyphTextures`,
  `refreshAnalysisLabels`; the `?labels=canvas` switch.
- `thresholds.js`: there was no residual left to remove (the Walther / Nansouty pair went in the chronology data task);
  its note now says the layer replaced the fallback.

**Per view, before (the canvas pass on the 2C build) and after (the layer)** (`tools/stage2/report-2d.js`;
`docs/stage2-evidence/2d-layer.md`)

| view | overlaps | dropped (limit) | leaders | pass ms | DOM nodes | text below floor | text below AA (lowest) | unobstructed 1600 x 900 or case | 1280 x 720 | legend over dispatch |
|---|---|---|---|---|---|---|---|---|---|---|
| first-run | 0 → 0 | 12 hidden → 7 (12) | 0 moved → 9 | 0.2 → 1.3 | 0 → 86 | 26/37 → 0/30 | 1 (4.44) → 0 (8.71) | 54.4% → 54.4% | 43.9% → 43.9% | 0 → 0 px |
| overview-field | 0 → 0 | 11 hidden → 5 (11) | 0 moved → 8 | 0.2 → 1.1 | 0 → 70 | 27/36 → 0/22 | 4 (3.75) → 0 (8.71) | 30.3% → 39.0% | 15.1% → 25.7% | 0 → 0 px |
| overview-plan | 0 → 0 | 12 hidden → 5 (12) | 0 moved → 7 | 0.1 → 0.8 | 0 → 88 | 22/33 → 0/34 | 9 (3.37) → 0 (8.76) | 80.5% → 80.5% | 79.9% → 79.9% | 0 → 0 px |
| close-sokolnitz | 0 → 0 | 18 hidden → 5 (18) | 0 moved → 3 | 0.1 → 1 | 0 → 58 | 1/23 → 0/25 | 6 (3.40) → 0 (7.94) | 80.5% → 80.5% | 79.9% → 79.9% | 0 → 0 px |
| staff-paper | 0 → 0 | 13 hidden → 6 (13) | 7 moved → 11 | 0.5 → 1.7 | 0 → 193 | 2/100 → 0/37 | 23 (1.08) → 0 (5.08) | 30.3% → 38.3% | 15.1% → 24.5% | 0 → 0 px |
| pratzen-low | 0 → 0 | 13 hidden → 5 (13) | 0 moved → 5 | 0.1 → 0.9 | 0 → 58 | 2/16 → 0/21 | 3 (3.82) → 0 (12.23) | 80.5% → 80.5% | 77.1% → 77.1% | 0 → 0 px |
| pratzen-orbit-min | 0 → 0 | 27 hidden → 18 (27) | 0 moved → 0 | 0.1 → 0.7 | 0 → 28 | 5/18 → 0/0 | 4 (3.36) → 0 (null) | 80.5% → 80.5% | 77.1% → 77.1% | 0 → 0 px |
| selected-formation | 0 → 0 | 3 hidden → 2 (3) | 0 moved → 4 | 0.1 → 0.9 | 0 → 34 | 5/35 → 0/10 | 0 (5.00) → 0 (11.49) | 14.8% → 20.0% | 7.0% → 12.5% | 51124 → 0 px |
| watch-selected | 0 → 0 | 8 hidden → 2 (8) | 0 moved → 6 | 0.2 → 0.8 | 0 → 69 | 3/27 → 0/27 | 1 (3.96) → 0 (12.35) | 78.4% → 78.4% | 73.2% → 73.2% | 0 → 0 px |
| hybrid-dimmed | 0 → 0 | 13 hidden → 7 (13) | 11 moved → 18 | 0.8 → 2.4 | 0 → 374 | 12/166 → 0/73 | 27 (1.20) → 0 (6.49) | 78.7% → 78.7% | 74.3% → 74.3% | 0 → 0 px |
| pratzen-low-1x | 0 → 0 | 12 hidden → 4 (12) | 0 moved → 5 | 0.1 → 0.7 | 0 → 60 | 0/19 → 0/23 | 2 (2.69) → 0 (8.71) | 80.5% → 80.5% | 77.1% → 77.1% | 0 → 0 px |
| pratzen-low-10x | 0 → 0 | 8 hidden → 3 (8) | 0 moved → 3 | 0.1 → 1 | 0 → 44 | 2/19 → 0/18 | 3 (2.96) → 0 (7.84) | 80.5% → 80.5% | 77.1% → 77.1% | 0 → 0 px |
| first-run-laptop | 0 → 0 | 16 hidden → 5 (16) | 0 moved → 10 | 0.3 → 1.4 | 0 → 86 | 23/33 → 0/29 | 0 (4.86) → 0 (8.71) | 48.3% → 48.3% | 43.9% → 43.9% | 0 → 0 px |

"hidden" is what the canvas pass hid, "moved" what its rings displaced; the layer's leaders are the items placed away
from their anchor. Text is counted as runs on the canvas and as elements in the layer. Contrast is §E's 10th percentile
as rendered, lowest per view. The layer's DOM nodes are the displayed items only.

**Parity screenshots** (`tools/stage2/parity-2d.js --sheets`, on the first commit's build): `2d-parity-1.jpg`,
`2d-parity-2.jpg` (each harness view, the canvas path left, the layer right) and `2d-legend.jpg` (the legend in its states).

**Tests**
- Harness, per view (`thresholds.js`): map-layer overlaps 0 (the old label-overlap check stays); nothing over a panel or
  an arrow head; drops within `DROP_LIMIT`; nothing never-dropped missing; pass under 8 ms (`LAYER_MS`); every map
  text at its floor (10.5 px for the echelon mark, nation tag, badge and small text, 12 px otherwise) and at AA as
  rendered; the unobstructed fraction at the case's viewport and at 1280 x 720 not below the 2C baseline; the legend
  never over the dispatch. All new; none replaces a weaker one except the unobstructed baselines, now measured at rest.
- Self-test, at 1x, 4x and 10.33x in 7 states (the first-run card and a tour stop among them): overlaps 0 and nothing over
  a panel or head; the never-dropped drawn; every formation focusable with its accessible name, Enter selects; every
  dropped formation reachable by keyboard focus and by hovering its footprint; layout only in a drawn frame; the legend
  never over the dispatch, its rows what the view draws, and the factor and symbol scales stated.
- `check:contrast`: 20 states (4 added: the legend with the layers on, at 1x, closed; hybrid-dimmed); map text is also
  composited over black and white ground.
- `runtime-test.js`: a map-layer section (items collected once, content keyed, focus, names); the label-layer check now
  covers the symbols left in the scene and the selected formation's counter in the layer.

**Checks on this build**
- `npm test`: all 9 suites pass, and the height guard (54 sites; `mlOccluded` and `groundAt` classified presentation, on
  `groundY`).
- `npm run check:data`: all 113 data declarations byte-identical to `archive/stage2c-68ac7721.html`.
- `npm run check:chronology`: 0 errors.
- `npm run check:visual`: all checks passed, 13 views, the self-test 59 of 59.
- `npm run check:contrast`: 4,035 text elements in 20 states, 0 below AA, 0 below 10.5 px.
- `npm run check:baseline`: moved to this build.

**Not done, or open**
- **pratzen-orbit-min draws no map text** (18 dropped, limit 27; the canvas drew 18 labels there, over the arrows). At the
  orbit minimum three arrow heads fill most of the view, and labels keep clear of each head's bounding box. Testing
  against the head's triangles would place labels there, but would make the self-test's "nothing over an arrow head"
  (a box test) weaker. Left for the owner: decision 39's limit is met, the view's text is not.
- The Watch-mode `#viewmode` control is drawn at 24% opacity (pre-existing; outside 2D). `check:contrast` measures it
  in Study.
- `ML_FULL_DIST` (70 units) and the rings are design values chosen on the harness views, not measured optima.
- §H's numbers are the input to Stage 3 (docking the dispatch), as decision 39 says.

## 2026-09 · Stage 2C: movement arrows (docs/STAGE2_SPEC.md §C, §D, §J, §K; decisions 20-23, 33, 37, 46)

**Status: done; merged (#15). 2D has not started. `austerlitz-command-map.html`: 1,166,868 bytes, md5
`68ac77219de339186b7b96aae2266a4f`** (was 1,149,340 bytes, md5 `0c485151…`, Stage 2B; 1,153,477 bytes, md5 `f6324c90…`, after the
precondition commit, the entry below).
- `check:baseline` moves to this build.
- `check:data`'s reference moves to it: `archive/stage2c-68ac7721.html` replaces `archive/chronology-12d34eed.html`.
- Against the old reference exactly three guarded declarations changed:
  - `OVERLAYS` (below);
  - `anchorList` (the precondition);
  - `TACTICAL_RATE,BATTLE_ORDER`, added and now guarded.
- The other 110 are byte-identical. No track, strength, order of battle or geography changed.

**The rule** (decisions 33 and 46): the arrow shown during phase ph depicts the leg the model executes during ph. Every
`OVERLAYS` arrow is now one of two things:
- **derived**: `leg:[id, from, to]`, a leg or run of consecutive legs executed in the phase. It has no points of its own:
  `arrowPts()` takes them from the track, so its ends are the anchors exactly and it moves with the model;
- **interpretive**: `interp:"<kind>: <why>"`, where the kind is one of route, objective, group, unmodelled, halt or
  unsettled.

The sources sheet has a new section, "How the arrows are drawn", which gives the rule, the counts and the hand-authored
arrows.

**The binding table after 2C** (`node tools/stage2/arrow-binding.js`; `docs/stage2-evidence/arrow-binding.md`; the pre-2C
table is kept as `arrow-binding-before-2c.md`). The 36 arrows are 17 derived and 19 interpretive: 4 routes, 3 objectives,
5 groups, 4 unmodelled, 1 halt and 2 unsettled. On the executed-leg reading: **17 derivable** (was 4) and 5 mismatch, all
marked (3 objective, 2 unsettled). The other 24 overlay items (lines, boundaries, objective markers) stay interpretive.

**How decision 37 was applied, and an interpretation it needed.** Decision 37 gives three outcomes: a wrong track changes;
an arrow that points at a place or objective becomes interpretive; an arrow that cannot be settled stays hand-authored.
- **No track was wrong on the evidence available.** Every mismatch agrees with the app's dated statements
  (`check:chronology`), and the sources that would test the doubtful hours are unread (§M.9). So **no track changed**.
- Most arrows fitted none of the three outcomes: the model was right, and the arrow had been drawn a phase late or off its
  leg. Following decision 33 ("the arrows follow the corrected model"), such an arrow is **generated from the leg the model
  executes in its phase**:
  - where that leg is the movement the arrow depicted, the arrow **moves to the phase the leg runs in** (3 arrows);
  - otherwise it depicts the executed leg under the same label, where the formation's act in that phase still describes
    it (10 arrows).
- This is my reading of decisions 33, 37 and 46 together, not a fourth outcome the owner stated. It is listed below as open.

**Every `OVERLAYS` change** (map units; 1 unit = 31.6 m; "evidence" is the app's own text or track, basis "app narrative,
unsourced", as in the chronology data task):

| phase | arrow | was | is | evidence | why |
|---|---|---|---|---|---|
| 0 | V Column counter-marches north | hand-drawn [296,243]→[312,178] (the whole counter-march to the phase-3 anchor) | derived, lich 0→2, [296,243]→[319,214] (04:00-08:00); end 1,159 m shorter | lich@2 act "Crossing the front of the 4th Column", status countermarch; the phase-0 timeline "c. 04:00 … must counter-march north" | the leg executed in phase 0 |
| 1 | Kienmayer | [291,367]→[226,406], the approach from Augezd (leg 0→1, 04:00-07:00) | derived, 1→2, [236,398]→[222,402] (07:00-08:00) | phase-1 lede and timeline "c. 07:00 Kienmayer's advance guard attacks Telnitz"; kienmayer@1 act "Attacks Telnitz" | the attack on Telnitz is what the model runs in phase 1; the approach ran in phase 0 |
| 1 | Friant's approach march | [106,428]→[195,409], starting 2 km behind where the model has him at 07:00 | derived, friant 1→2, [167,410]→[198,402] (07:00-08:30) | timeline "c. 08:00 Friant's leading brigade comes up to the Goldbach near Telnitz"; friant@1 act "Marching from Raigern toward Telnitz" | the last stretch of the march is the leg in phase 1. The same leg carries "Friant retakes Telnitz" in phase 2, because it runs 07:00-08:30 |
| 1 | I Column descends | hand-drawn | **unchanged, marked unsettled** | the timeline "c. 07:30 Dokhturov's I Column begins descending" against the event and track from 04:00: the unresolved conflict `dok@1` | cannot be settled until Duffy (1977) is read; listed by name in `binding-test.js` |
| 2 | II Column → Sokolnitz | hand-drawn attack | **unchanged, marked objective** | phase-2 timeline "c. 08:00 Langeron attacks Sokolnitz"; the model has the column at the village from 08:00, and its phase-2 leg runs back up the slope (10:30) | it points at the objective of an assault the model does not represent as a movement |
| 2 | III Column → castle | hand-drawn attack | **unchanged, marked objective** | the same timeline entry; prz@2 act "Storms the walled castle grounds" | as above |
| 2 | Liechtenstein crosses the front | [296,243]→[320,204] (leg 0→2, run 04:00-08:00) | derived, lich 2→3, [319,214]→[317,191] (08:00-08:45) | during phase 2 the dossier's act is lich@2 "Crossing the front of the 4th Column and holding it up" | the leg executed in phase 2 under the act the app shows then |
| 2 | IV Column halted | `axis` arrow [325,230]→[301,237] | **kind `halt`**: a solid bar across the line of march at [301,237], no head, length the frontage of the column's widest formation (a design rule), `of:"col4"` | phase-2 lede "the 4th Column … is still standing still"; the Kobelnitz feature "which never reached it" (§C.3) | decision 23: a halt is not intended movement |
| 2 | Friant retakes Telnitz | hand-drawn, within 130 m | derived, friant 1→2 (07:00-08:30) | friant@2 tm at 08:30 "Friant's leading troops retake Telnitz" | was derivable; now generated |
| 3 | Saint-Hilaire; Vandamme | hand-drawn, within 45 m and 100 m | derived, 2→3 each (08:45-09:15, 08:45-09:14) | the dated climbs (§M.8) | were derivable; now generated |
| 4 | Kamensky turns about | hand-drawn | **unchanged, marked unsettled** | the timeline "c. 09:45 Kamensky turns his brigade about" against his own record and track in phase 3: the unresolved conflicts `kamensky@3`, `kamensky@4` | cannot be settled until Duffy and Thiebault are read; listed by name |
| 5 → 4 | Caffarelli | phase 5, [240,115]→[294,122] | **phase 4**, derived, caffarelli 0→5 (09:30-10:30) | phase-4 timeline "c. 09:30 Lannes advances along the highway"; phase-4 lede "In the same hour … Lannes begins his advance"; caffarelli@5 tm dep 09:30 | the leg runs wholly in phase 4, and the app's text puts it there |
| 5 → 4 | Suchet | phase 5, [227,95]→[245,77] | **phase 4**, derived, suchet 0→5 (09:30-10:30) | as above; suchet@5 tm dep 09:30 | as above |
| 5 → 4 | Bagration | phase 5, [292,52]→[262,68] (the start 858 m along his leg) | **phase 4**, derived, bag 0→5, [319,49]→[262,68] (09:30-10:30) | phase-4 timeline "Bagration counter-attacks" c. 09:30; bag@5 tm dep 09:30 | as above; in phase 5 he holds and runs no leg |
| 5 | Nansouty's cuirassiers | [221,138]→[275,147], the move up from reserve (an undated creeping leg, 04:00-10:30) | derived, nansouty 5→6, [277,146]→[307,142] (10:30-11:15) | phase-5 lede "Murat answers with Nansouty's … cuirassiers"; the model drives east as Liechtenstein is repulsed (lich@6) | the counter-charge's movement in phase 5; the move up spans five phases and cannot be one phase's arrow (decision 45 keeps it undated) |
| 6 | Drouet forms line | [179,177]→[285,204], the whole advance from reserve (legs 0→3→6, 04:00-11:15) | derived, drouet 6→7, [290,206]→[313,217] (11:15-12:45) | during phase 6 the dossier's act is drouet@6 "Forms line across the plateau and helps break the Russian Guard attack" | the leg executed in phase 6 |
| 7 | Saint-Hilaire wheels south | start 761 m off the phase-6 anchor | derived, sthilaire 6→7 (13:00-14:00) | sthilaire@7 tm "Wheels south off the heights" | the start is now the anchor |
| 7 | Vandamme wheels south | [294,224]→[272,342], from the middle of the wheel | derived, run vandamme 6→7→8, [296,206]→[270,347] (13:00-14:30) | vandamme@7 "Turns south with Saint-Hilaire"; vandamme@8 "Seizes the ground commanding the causeway" | both legs run in phase 7 (the wheel now 13:00-13:24, the precondition) |
| 7 | Przybyszewski's breakout | [227,338]→[215,291], ending 684 m beyond the model's column, toward Kobelnitz | derived, prz 7→8, [227,338]→[227,309] (14:10-14:30) | prz@8 act "Attempts to break out north toward Kobelnitz; the column disintegrates" | the arrow now stops where the model has the column break; its objective stays in the act |
| 8 | I Column to the defile | hand-drawn | **unchanged, marked objective** | the column's centre stops 899 m short of the defile, and part of it crosses the ice (dok@8, dok@9) | it points at the place, the Augezd defile |
| 8 | Vandamme takes the height | hand-drawn, within 261 m | derived, vandamme 8→9 | - | was derivable; now generated |
| 8 | Bagration withdraws on Rausnitz | [304,46]→[354,20] | derived, run bag 7→8→9, [304,46]→[366,14] (16:30-17:00) | bag@8 "Withdraws on Rausnitz in good order" | both legs run in phase 8 |
| all | the other arrows | no marker | the marker only: 4 `route` (the axis arrows of phase 0), 5 `group`, 4 `unmodelled`; points unchanged | - | decision 22: every arrow carries a verdict |

**Still open (not changed here)**
- **The two unsettled arrows**, *I Column descends* and *Kamensky turns about*. They wait on the same passages of Duffy
  (1977) and Thiebault as their conflicts.
- **The flagged derived arrivals and conflicts** of the precondition: `sthilaire@3`, `vandamme@3`, `bag@8`; `c_gren@8` and
  `kollo@5`; `dok@1`, `guard_cav@6`, `kamensky@3`, `kamensky@4`.
- **My reading of decision 37** (above): moving three arrows to phase 4, and re-deriving ten on the leg executed in their
  phase. The owner may prefer some of them marked interpretive instead; each is one line of `OVERLAYS`.
- **Phase 5 now has no Lannes arrows.** Its lede ("Blasowitz falls") keeps its objective marker. No arrow was added to show
  Caffarelli's and Suchet's phase-5 legs; adding arrows was not in scope.

**Presentation** (`app.js`, `style.css`, `shell.html`; not guarded)
- **Draped drawing** (`drapedRibbon`, from `planRibbon`'s ribbon and head): arrows, front lines (and their ticks),
  boundaries and the halt bar are flat ribbons.
  - The centre line is a smooth curve in the ground plane, sampled every unit or so along and across.
  - Every vertex stands at its lift above `groundY()`, the drawn ground, at the current factor. Overlays are rebuilt on a
    factor change, as in 2B.
  - They are drawn over woods and buildings, as the plan ribbons are. The tubes were cut up by them.
- **Heads** (decision 20):
  - every Allied arrow has the notched chevron, its notch 0.38 of the head's length inside the head; French arrows have
    the plain triangle;
  - heads are drawn above shafts; the tip stands on the last point, so a derived arrow's tip is its anchor;
  - plan ribbons keep their own heads;
  - the legend's movement swatches show both heads.
  - **A finding about §D:** the probe drew its "chevron" with `planRibbon`, whose fourth point lies behind the base. That is
    a kite, not a notch. The notched shape was therefore rendered and measured anew (below).
- **The rest:**
  - Boundaries (decision 21): one solid thin ribbon in the annotation colour; legend line "boundary between commands".
  - The halt (decision 23, §C.3): legend line "halt: a column stopped short of its objective".
  - The plan staging outline stays dashed and has a legend line, shown while a plan is on ("dashed outline: a plan's staging
    area").
  - Dashes come from one helper, `dashRuns`, used only by the `axis` arrows (9 dashes, as before) and the staging outlines
    (16 dashes, the same geometry as before).
  - The leftover `computeLineDistances` call on the movement trail is removed.

**Tests**
- **New suite `binding-test.js`** (in `tools/run-all.sh`; `npm test` now reports 9 suites): 374 checks, 0 failed. It checks
  every arrow against the tracks:
  - each arrow has exactly one verdict;
  - each derived arrow is generated by `arrowPts`, its ends equal to its anchors exactly (`===`), every leg of it executed
    in its phase, its label naming its formation, and derivable on the executed reading;
  - each interpretive arrow has a known kind with a reason, consistent with what it shows: a route is an axis arrow and
    vice versa, a group names several formations, an objective or unsettled arrow names one tracked formation and is
    *not* derivable (else it must be derived);
  - no axis arrow describes a halt;
  - the unsettled arrows are listed by name, each with its entry here; any other mismatch fails.
- **Dash test (static, in `binding-test.js`):** dashed or segmented drawing (`LineDashedMaterial`,
  `computeLineDistances`, `setLineDash`, `dashRuns`, the terrain style's `dash`) appears only in `dashRuns`, `buildArrow`
  (axis only), `planStaging`, `buildPlanLinks`, `updatePlanLinks` and `world.js` `buildAnalysis` (valley and dead ground
  only). `buildBoundary`, `buildLine`, `buildHalt` and `updateTrail` are solid. Dashed CSS appears only in the legend's two
  dash samples.
- **Self-test, stricter:** 41 checks (was 35), with two new checks at each of 1x, 4x and 10.33x:
  - every overlay arrow, line, tick, boundary and halt vertex over all ten phases stands at its lift above `groundY`: 14,911
    vertices in 282 meshes, worst 0.0000 (threshold 0.05);
  - 35 heads: all 20 Allied heads are chevrons with the notch at 0.38, all 15 French heads plain.
- **Harness:** thresholds unchanged. All 13 cases pass with **0 label overlaps**, the overlay labels included (the four
  harness views at 09:30-10:00 now show the phase-4 arrows).
- **Height guard:** the new `groundY` call sites are classified: `drapeTri`, `drapedRibbon`, `buildArrow`, `buildHalt`,
  `buildLine` and `buildBoundary` as presentation, the self-test's `overlayDrape` as test. There are now 48 sites (15 model,
  23 presentation, 10 test), with 0 presentation sites on `height()`/`hAt()`.
- **`runtime-test.js`:** its THREE stub's simplified `CatmullRomCurve3` (no `getLength`) is replaced by three's own r128
  `CatmullRomCurve3` and `LineCurve3`. No assertion changed. Before the fix, the suite failed with "curve.getLength is not a
  function".

**Renders** (`node tools/stage2/arrows-2c.js --sheets docs/stage2-evidence`):
- `2c-heads.jpg`: landscape and paper, Overview and close, each in greyscale.
  - Overview, phase 4: Allied heads 36.8-37.0 px wide with a 11.9-12.5 px notch; French 35.0-37.2 px.
  - Close views: Allied heads 76-84 px with a 26-29 px notch.
  - The notched and plain heads are distinct in every greyscale tile where the head is on screen.
  - In the phase-8 Overview the Allied heads lie under the timebar: the framing matter §D already recorded (§H, Stage 3).
- `2c-drape.jpg`: the same low view at 1x, 4x and 10.33x.
- Per-head sizes: `arrows-2c.json`.

**Checks on this build**
- `npm test`: ALL 9 SUITES PASSED, and the height guard. `redteam.js`: 0 findings, 1 warning (the march-rate one, kept).
- `npm run check:chronology`: 0 errors. 65 consistent, 4 early (the named conflicts), 0 late. The derived arrivals are as in
  the entry below.
- `npm run check:data`: all 113 data declarations identical to the new reference.
- `npm run check:visual`: STAGE0 all checks passed; 13 cases, 0 overlaps; self-test 41 of 41.
- `npm run check:contrast`: 3,194 text elements, 0 below AA, 0 below 10.5 px, the new legend lines included.
- `npm run check:baseline`: passes on this build.

## 2026-09 · Stage 2C precondition: derived arrivals at a tactical rate (docs/STAGE2_SPEC.md §M.13, decided: "(b) where it fits, otherwise (c), flagged")

**Status: a model change, committed on its own before the arrow work of 2C. `austerlitz-command-map.html` after this commit:
1,153,477 bytes, md5 `f6324c9081cd2e36e550b69ad6a0e6ee`** (was 1,149,340, md5 `0c485151…`, the Stage 2B build). `check:baseline`
and `check:data`'s reference move with 2C (entry above), not here.

**What was, what is, why.**
- **Was:** a derived arrival, i.e. a dated departure with no dated arrival, was taken at the arm's march-rate ceiling
  (`SPEED_CEIL`). That turned an upper bound into a pace, 93-99% of the ceiling (§M.13).
- **Is:** `anchorList` (`app.js`; guarded) takes such an arrival at a **tactical rate** when the formation is in battle order during
  the leg: infantry and Guard 3.0 km/h, cavalry 6.0, mixed 4.0 (`TACTICAL_RATE`).
  - Battle order means its status at the anchor's phase is attacking, advancing, counterattack, engaged, charging, holding,
    supporting, withdrawing or repulsed (`BATTLE_ORDER`).
  - Artillery and headquarters have no tactical rate; their ceilings are unchanged.
  - The tactical rate is used only where the leg still fits before its next anchor: no later than the latest arrival that
    keeps the next leg within its ceiling, and no later than the next leg's dated departure or the formation's departure from
    the field.
  - Otherwise the arrival stays at the ceiling and is **flagged** (`arrFlag`). The flagged legs are named in
    `tools/stage2/chronology.js` (`CEILING_FLAGGED`), and `check:chronology` now fails on any other derived arrival at the
    ceiling, or on a named one that leaves it.
- **Why:** the owner's decision on §M.13. 2C derives arrows from these tracks (decision 33), and a 15-minute wheel was an
  artefact of the rule, not of any statement.
- **The rates are design values, unsourced.** They are labelled so:
  - in the code (`TACTICAL_RATE`);
  - in the dossier's timing row ("arrival derived: tactical rate, a design value", or "the march-rate ceiling; flagged: …");
  - on the sources sheet, in a new section "Arrivals the map derives" that lists every derived arrival with its rule.
  They are not historical rates and are never presented as such.

**Outcome, leg by leg** (`node tools/stage2/derived-legs.js`; it reproduces the §M.13 simulation exactly):

| leg | was | is | rule |
|---|---|---|---|
| vandamme@7, the wheel | 13:00-13:15 (4.76 km/h) | 13:00-13:24 (2.97 km/h) | tactical |
| rivaud@3, follows Soult | 08:45-09:09 (4.92 km/h) | 08:45-09:25 (2.96 km/h) | tactical |
| bag@6, falls back | 11:15-11:25 (4.68 km/h) | 11:15-11:31 (2.93 km/h) | tactical |
| sthilaire@3, the climb | 08:45-09:15 | unchanged | ceiling, flagged: the tactical rate (09:35) does not fit before `sthilaire@4` (latest 09:22) |
| vandamme@3, the climb | 08:45-09:14 | unchanged | ceiling, flagged: the tactical rate (09:33) does not fit before `vandamme@4` (latest 09:20) |
| bag@8, withdraws on Rausnitz | 16:30-16:45 | unchanged | ceiling, flagged: its status is *retreating*, not a battle-order status, so the rate does not apply; it would not fit either (16:54 against the latest 16:48) |
| gqg@6, Napoleon forward | 12:00-12:40 | unchanged | its `moveMin` (headquarters) |

The next legs start later with them: `vandamme@8` 13:24-14:30 (was 13:15), `rivaud@6` 09:25-11:15 (was 09:09), `bag@7`
11:31-12:45 (was 11:25).

**Still open, not touched:**
- The two climbs (`sthilaire@3`, `vandamme@3`) and Bagration's withdrawal (`bag@8`) are a dating question: the climbs are tied
  to the unresolved Kamensky passage (Duffy 1977; Thiebault's memoirs), the withdrawal to nightfall. They wait on the sources.
- The dated legs forced near the ceiling, `c_gren@8` and `kollo@5`.
- The four unresolved conflicts: `dok@1`, `guard_cav@6`, `kamensky@3`, `kamensky@4`.

**Every value that moves, re-derived** (`tools/stage2/chronology-sim.js`, the suites, the harness):
- Unchanged:
  - centre separation, first reported 09:03;
  - the plateau series, 04:00 38,700 / 0 to 16:00 0 / 18,500;
  - tour stop 4, 38,700 and 19,300;
  - the Command view's knowledge counts at every phase midpoint, both sides;
  - event agreement: 0 disagreements, worst 0.82 km (telnitz); `pratzen-village` 1.21 km;
  - the march-rate audit: 0 legs over a ceiling; the fastest leg per arm is also unchanged (inf 4.97 km/h, the flagged climbs);
  - the chronology audit: 65 consistent, 4 early (the named conflicts), 0 late.
- Positions: only Vandamme moves (13:01-14:29, up to 446 m), Rivaud (08:46-11:14, up to 729 m) and Bagration (11:16-12:44, up
  to 291 m).
- At the harness clocks only Rivaud moves: 158 m at 09:30, 135 m at 09:45, 128 m at 09:50 and 113 m at 10:00. The harness still
  passes, with 0 overlaps in all 13 cases.
- `redteam.js` mean march rates: infantry **1.28 → 1.23** km/h, cavalry 0.82 km/h. Its warning (the cavalry mean is not above
  the infantry's) **still fires**. It is kept as a warning, not silenced.

**Checks on this commit's build**
- `npm test`: all 8 suites and the height guard passed.
- `npm run check:chronology`: 0 errors. The derived arrivals are as tabled, and only the named conflicts are early.
- `npm run check:visual`: STAGE0 all checks passed; the self-test passed 35 of 35.
- `npm run check:contrast`: 3,157 text elements, 0 below AA, 0 below 10.5 px.
- `npm run check:data`: as intended, `anchorList` changed and `TACTICAL_RATE,BATTLE_ORDER` were added (both now in the
  guarded model list); the other 111 data declarations are identical.

## 2026-09 · Stage 2B: display height, exaggeration, standards (docs/STAGE2_SPEC.md §A, §B, §I.1, §J, §K; decisions 19, 26, 32, 34, 35, 36)

**Status: done; awaits the owner's review. 2C has not started. `austerlitz-command-map.html`: 1,149,340 bytes, md5
`0c48515152e57c29963b79c4a99d78c9`** (was 1,122,358 bytes, md5 `12d34eed…`). `check:baseline` moves to this build. `check:data`: all 112 data
declarations identical to the #12/#13 build (only rendering declarations change); its reference is unchanged.

**What changed (presentation only; the model, `GEOREF.EXAG` and every model-unit value are unchanged)**
- **One display height** (`world.js`): `DISPLAY.factor` (1, 4 by default, or `GEOREF.EXAG` = 10.33, the drawing before
  2B), `displayScale()` = factor / `GEOREF.EXAG`, `displayY(h)`, `displayHeight(x, z)`. Not a second scale: metres and
  kilometres still come only from `GEOREF`.
  - All **52 presentation sites** that read `height()` now read the display height.
  - The guard is `tools/stage2/height-sites.js --check`, now run by `tools/run-all.sh`: **52 → 0** presentation sites
    on `height()`/`hAt()`. 39 sites in all: 15 model, 15 presentation, 9 test; an unclassified site fails.
- **The ground** is built on the model surface, exactly as before, and then drawn at the factor (`scaleGround`):
  - Land cover, the elevation tint and the going classes are read from the model surface, so they are identical at every
    factor. The going classes are also identical to Stage 1B.
  - The drawn normals, baked shade and frost follow the display factor.
- **A factor change** (`setDisplayFactor`, `rescaleWorld`) re-seats everything built once:
  - Rebuilt from the display height: the ground, apron, meres (same rule on display heights), contours (the lattice is
    model data; only its drawn height changes) and mist sheets with their fade. The haze scales.
  - Keeping their height above the ground: the instanced houses, roofs, chimneys, spires, trees and scrub, the stream
    ribbons, marsh ticks and terrain-study lines, plus the labels, glyphs and plateau ring.
  - Rebuilt from scratch: overlays and plans.
  - The camera keeps its height above the ground.
  - A change takes **186-421 ms** on the harness machine (two runs of nine changes, `tools/stage2/renders-2b.js`). That
    is over 100 ms, so **the control is disabled during playback**; its tooltip says why.
- **Camera presets** (the 29 in the data, `VANTAGE`, the staff view, the harness cases) are unchanged and **re-framed at
  use** (`reframe`): each point keeps its height above its own ground. Applied in `flyTo`, `startPhaseTransition`, the
  first view and `placeCamera`.
- **True scale (decision 34):**
  - At 1x no figure, standard, building, tree or scrub is drawn.
  - Every formation is drawn as its **footprint**: frontage W0 x sw by depth D0 x sd, draped on the drawn ground in its
    side's colour.
  - The footprint is one primitive (`makeFootprint`, `placeFootprint`), meant for reuse by Stage 5.
- **Standards (decisions 26 and 36):** at the provisional pole-to-figure ratio **1.6** (the mounted figure for cavalry).
  The pole, its thickness, the cloth and the offsets are scaled together. It is labelled provisional, a design rule
  and not a sourced ratio, in the code and on the sources sheet.
- **Going (decision 32):** classified from the model slope. Thresholds are 9 and 17 degrees on the model's scale, i.e.
  **0.88 and 1.70 true degrees**. The legend shows each slope class with its true-degree threshold and "provisional";
  the sources sheet states they are unsourced design values.
- **Every statement of the exaggeration reads the display factor (decision 35):**
  - `geoText`'s `{EXAG}` (the sources sheet; `SOURCE_NOTE` itself is unchanged), and the place dossier's relief caption.
  - A new legend line gives the factor relative to true scale and the two named symbol scales: figures and standards
    about 45-70x life, buildings and trees about 10-15x.
  - The sources sheet gains a short section on how the ground and the symbols are drawn.
- **The control:** "Relief" in the layers panel, buttons 1x (true) / 4x / 10.33x.

**Changes needed to keep Stage 0 thresholds at the 4x default (presentation, none loosened)**
- **The camera floor clears the men** (`formationTop` in `camGround`). Inside a drawn formation's footprint, the floor
  is the top of its figures. At 4x the harness case `pratzen-orbit-min` reached a body of infantry at Pratzen village
  and put the eye among the men, failing the near-black threshold (0.82% against 0.05%). With the new floor it passes
  (clearance 4.2 units, 0 solid black).
- **A third declutter ring** of thirteen positions, tried only by a counter that still has no place. At 4x the
  hybrid-dimmed view left Caffarelli and Walther overlapping at the screen edge; with the third ring the view has 0
  overlaps. Like the second ring (#12), this is a stopgap in the Stage 0 canvas pass that 2D replaces.
- **The harness's orbit case** (`tools/visual/harness.js`) now chooses its target and bearing on the **drawn** ground
  (`displayHeight`; the model height on earlier builds). Before, it placed them on the model height, which is the drawn
  ground only at 10.33x. `measure.js` compares the mesh with the display height for the same reason.

**Tests**
- **Height guard (new, in `npm test`):** 0 presentation sites on `height()`/`hAt()`, 0 unclassified.
- **Self-test, stricter:** 35 checks, up from 13.
  - Run at **each of 1x, 4x and 10.33x**, with every threshold as before: ground (groundY equals the display height at
    the vertices), every fixed and computed view, every glide, the lowest orbit, the render-time guard, figures on the
    ground, mist, derived readings unchanged.
  - New:
    - relief: the drawn Pratzeberg-Sokolnitz relief is s times the model's, to 0.01 (1.853 / 7.413 / 19.138 units);
    - going classes identical at every factor;
    - standards: pole / figure = 1.6 for all 56 standards, deviation 0.0000;
    - the legend line;
    - no stale exaggeration in the sources sheet, place dossier or legend;
    - true scale: at 1x, 31 formations have 31 footprints, 0 figure blocks and 0 landscape layers.
- **Harness:** the 11 cases at the 4x default with re-framed cameras, plus the new `pratzen-low-1x` and
  `pratzen-low-10x`, with the same thresholds. `pratzen-low-10x` reproduces the Stage 1B `pratzen-low` metrics (black
  0.0251, 1 solid block, luminance 105).
- `npm test`: ALL 8 SUITES PASSED, and the height guard.
- `npm run check:data`: all 112 data declarations byte-identical (reference `archive/chronology-12d34eed.html`).
- `npm run check:chronology`: 0 errors.
- `npm run check:visual`: STAGE0 all checks passed; 13 cases, 0 overlaps in every one; self-test 35 of 35 PASS.
- `npm run check:contrast`: 3,148 text elements, 0 below AA, 0 below 10.5 px (the relief control and legend lines included).
- `npm run check:baseline`: passes on this build.
- Playback lock, probed in the page: the three relief buttons are enabled when paused, disabled while playing (tooltip
  "Pause to change the relief (a change takes about 215 ms)"), enabled again on pause.

**Renders:** `docs/stage2-evidence/2b-field.jpg`, `2b-zuran.jpg`, `2b-pratzen.jpg`, `2b-allied.jpg`,
`2b-overview.jpg`, `2b-pratzen-low.jpg`: 1x, 4x, 10.33x each. Per-render measures (seating, clearance, the drawn relief
and its screen height) are in `exag-2b.json`.

**Not done, or open**
- **The paper map (2E):** not changed. It works at every setting and draws the ground at the display factor. Decision
  19's own cartographic hillshade factor for the paper map is 2E's.
- **The sources text at 1x** reads "Terrain relief is exaggerated about 1 times". `SOURCE_NOTE` is guarded data and
  decision 35 keeps it unchanged, so the wording can only change in a data task. The new section of the sources sheet
  states true scale plainly.
- **The figures check at 1x is vacuous** (no figures are drawn). The true-scale check covers that setting.
- **The camera-floor and declutter additions are behaviour** the spec did not ask for. They are recorded here because
  they were needed to keep the thresholds.

## 2026-09 · Chronology data task, follow-up on #12 (owner): derived arrivals, creeping moves, settling sources, the counter ring

**Status: report and documentation; one text change in the data (the Sources panel, as asked). `austerlitz-command-map.html`:
1,122,358 bytes, md5 `12d34eede25938877b5b007f9ea3af89`** (was 1,121,991, md5 `e76222b3…`, the build of the entry below).
`check:baseline` and `check:data`'s reference move to it (`archive/chronology-12d34eed.html` replaces
`archive/chronology-e76222b3.html`; both belong to #12, which is not yet merged).

**1. Arrivals derived from the march-rate ceiling: open, to be decided before 2C** (`docs/STAGE2_SPEC.md` §M.13;
`tools/stage2/derived-legs.js`, `docs/stage2-evidence/derived-legs.md`).
- The legs:
  - Seven legs have a derived arrival: six at 93-99% of the ceiling, plus Napoleon's move at 60% of its ceiling (from its `moveMin`).
  - Four dated legs also run at 80% of the ceiling or more (`c_gren@8`, `kollo@5`, `bag@9`, and `guard_inf@6`, which is unchanged from Stage 1B).
  - Each leg is tabled with its speed, share of the ceiling, status, ground, and the slack its next anchor leaves.
- A correction to the premise: the Augezd height by 14:30 does not force Vandamme's 15-minute wheel. It leaves him until
  13:50, and the ceiling rule chose the speed.
- Genuinely constrained: the two climbs (by the undated phase-4 anchors at 09:30), Bagration's withdrawal (by nightfall),
  and `c_gren@8` and `kollo@5` (a dated time followed by a default phase start). In each case the constraint is an undated
  default.
- Options simulated:
  - (a) a share of the ceiling: unworkable below about 80% without re-timing undated anchors;
  - (b) a tactical rate for formed bodies (design values, unsourced): the climbs do not fit, and `pratzen-village` fails;
  - (c) as now, flagged.
- Recommended: (b) where the leg still fits, else (c) flagged by name. The climbs are to be dated from the same passage that
  settles Kamensky's turn.
- No track changed. The `redteam.js` warning (infantry mean rate above cavalry's) stays a warning.

**2. Undated creeping moves show "interpolated" (decision 45): confirmed, no change.** Checked in the built page:
- Formations: Kellermann, Nansouty, d'Hautpoul, the Allied headquarters, the Russian Guard cavalry.
- Three clocks each, inside their creeping legs.
- The marker shows in both the compact card and the full dossier.

**3. What would settle the three conflicts** (Sources panel open questions, `SOURCE_NOTE`, and §M.9; only works the
project already cites; no page numbers):
- Dokhturov's descent: Duffy (1977), on the Allied left columns coming down toward Telnitz.
- Kamensky's turn: Duffy (1977), with Thiebault's memoirs (on which the map's Pratzeberg narrative draws), on Kamensky's
  counter-attack.
- Rapp's counter-charge: Duffy (1977), on the Guard cavalry fight at Stare Vinohrady.
- Smith (1998) is cited for strengths; whether it dates these moves is stated as not known.
- Guarded declaration changed: `SOURCE_NOTE` only (one sentence added).

**4. The counter-placement change is a presentation change made inside a data task.** The wider ring of ten positions in
`declutter` (entry below) was added because the data change moved Caffarelli's counter into the cavalry reserve's at the
hybrid-dimmed view's clock. `check:visual` then failed with four overlaps. The alternative was to add those pairs to the
known residuals, which would have loosened a threshold, so the presentation was fixed instead. As a side effect it retired
the Stage 0 Walther / Nansouty allowance. It is a stopgap in the Stage 0 canvas pass: **2D replaces it** with the single
DOM/SVG layer (decision 24).

**Tests** (on this build)
- `npm test`: ALL 8 SUITES PASSED (`redteam.js`: 0 findings, 1 warning, the march-rate one, kept).
- `npm run check:data`: all 112 DATA declarations identical to the new reference; against the entry below's build, only `SOURCE_NOTE`
  changed; against Stage 0, the same 7 declarations as below.
- `npm run check:chronology`: 65 consistent, 4 early (the named conflicts), 0 late; 0 errors.
- `npm run check:visual`: STAGE0: all checks passed; 0 overlaps in all 11 views; `selfTest` 13 of 13 PASS.
- `npm run check:contrast`: 3,103 text elements, 0 below AA, 0 below 10.5 px.
- `npm run check:baseline`: passes (md5 `12d34eede25938877b5b007f9ea3af89`, 1,122,358 bytes).

## 2026-09 · Chronology data task (owner decisions 40-46; docs/STAGE2_SPEC.md §M.7-§M.12): explicit anchor times

**Status: done; awaits the owner's review. 2B has not started. `austerlitz-command-map.html`: 1,121,991 bytes, md5
`e76222b31b3671020c7643b9e6ea1925`** (was 1,107,799 bytes, md5 `5bf48b75…`). `check:baseline` and `check:data` move to this
build (below).

**What this is, and what it is not.** It makes the model agree with the app's own dated statements. Every time written here
has basis "app narrative, unsourced": the statements it follows cite no source (§M.6). The result is **internal
consistency, not verified history**. Implementation choices (the rule for a derived arrival, the audit's tolerance, the
presentation of a waiting move) are kept apart from historical claims below.

**What changed**
- **Engine** (`app.js`; guarded): the phase-start rule is documented above `anchorList` and at `FORMATIONS` (`data.js`), and
  stays the default. A track entry may carry `tm` with `at` (arrival, possibly after the phase opens) and/or `dep`
  (departure), plus evidence, grade and basis. `anchorList` resolves each anchor's window (`w`, `arr`); `legWindow` returns
  it; `legAt` passes an anchor when it is reached, not when its phase opens. A range is honoured at its far end, never a
  midpoint. A departure at or after the phase start without an arrival is reached after `moveMin` or at the arm's
  march-rate ceiling, whichever is later (**derived**, flagged `arrDerived`, and said so in the dossier). `auditMovement`
  validates every explicit time (departure before arrival; no overlap with the neighbouring legs; inside the day; none on a
  first or removal entry). Without `tm` the engine reproduces the Stage 1B timing exactly (checked before any time was
  written: every reading of `chronology-sim.js` identical).
- **Data** (`data.js`, `analysis.js`; guarded): explicit times on 20 anchors (table below); events `soult` and `hq-forward`
  re-dated as intervals; `pratzen-village`'s tolerance reason corrected; the Sources panel's open questions list the three
  unresolved conflicts.
- **Presentation** (`app.js`, not guarded): `waitingFor`, `textPhase`, `liveStatus`, `timingNow`, `TIMING_TEXT`, `drawerKey`.
  While a dated move has not begun inside its phase, the counter, block pose, smoke, selection chip and dossier show the
  previous anchor's act and status, plus "From hh:mm: <act>"; the dispatch's "What changed" list prefixes such acts with the
  time; the dossier repaints when a selected formation's move begins or ends inside a phase; a "Timing A/B/C" pill, and in the
  full dossier the window, the basis, the quoted evidence and the grade's meaning. The counter declutter (`declutter`,
  Stage 0's fallback) tries a wider ring of ten positions after its twenty; only a counter that found no place before can use
  them. This was needed because Caffarelli's dated advance puts his counter among the cavalry reserve at 10:00, and
  `check:visual`'s hybrid-dimmed view then failed with four overlaps (Caffarelli, d'Hautpoul, Walther, Drouet). With the
  ring, the view has no overlap at all, the Stage 0 Walther / Nansouty residual included.
- **Thresholds, tightened**: `tools/visual/thresholds.js` no longer allows the Walther / Nansouty overlap (fixed; the
  file's own rule is to remove an entry when fixed). `check:visual` now allows no residual.
- **Tools**: `tools/stage2/chronology.js` now computes its verdicts. REVIEW records what each statement dates (start,
  arrival, during, span), and `--times` / `--check` are new; `npm run check:chronology` is the regression, also run in CI.
  `arrow-binding.js` scores a third reading, the leg the model executes during the phase. New
  `delayed-moves.js` probes the interface. `model.js` loads `KM_PER_MAP` and `SPEED_CEIL`. `redteam.js` has a new
  section: five invalid timings must each be rejected, and a valid delayed move must hold, then move.
- **Docs**: `docs/STAGE2_SPEC.md`: decisions 40-46 (§0, §M.7), what was done (§M.8-§M.12), §C.1 re-run on the new tracks
  with the 2C rule, the earlier tables kept as §C.4 (dated). Evidence regenerated: `chronology.md`, `arrow-binding.md`;
  new: `arrow-binding-before-chronology.md`, `delayed-moves.md`, two screenshots.
- **Baselines**: `check:baseline` checks this build; `check:data` compares against `archive/chronology-e76222b3.html` (this
  build, frozen), because the data changed on purpose. Its report against the Stage 0 reference is recorded below.

**Guarded declarations changed** (`check:data` against `archive/stage0-c09c4b23.html`; exactly these 7):
- `FORMATIONS`: `tm` on 20 anchors (below). No position, strength, route, status, act or order-of-battle entry changed.
- `EVENTS`: `soult` t 525 → [525, 555]; `hq-forward` t 720 → [720, 760]; `pratzen-village` tolWhy text only (time and 1.5 km
  tolerance unchanged).
- `SOURCE_NOTE`: one sentence added to the open questions, on the three unresolved conflicts.
- `anchorList`, `legWindow`, `legAt`, `auditMovement`: the engine extension and its validation (above).
Unchanged: `OVERLAYS` (2C's), `PHASES`, `FEATURES`, `ANALYSIS`, `TOUR`, `ACTS`, `COMMAND`, `PLANS`, all geography and every
derived-reading function.

**The anchors** (was = Stage 1B window; evidence file:line and full reasoning in §M.8; grade B = the app's "c." hour,
C = inferred; basis for all: app narrative, unsourced):

| anchor | was | is | time written | grade |
|---|---|---|---|---|
| gqg@6 Napoleon to Stare Vinohrady | 10:35-11:15 | 12:00-12:40 | dep 12:00 (arrival from its 40-min march) | B |
| sthilaire@3, vandamme@3 the climb | 08:00-08:45 | 08:45-09:15, 08:45-09:14 | dep 08:45 (arrival derived) | B |
| rivaud@3 follows Soult | 04:00-08:45 | 08:45-09:09 | dep 08:45 (arrival derived) | C |
| sthilaire@7, guard_inf@7, c_gren@7 the wheel | 11:15-12:45 | 13:00-14:00 | dep 13:00, at 14:00 | B |
| vandamme@7 the wheel | 11:15-12:45 | 13:00-13:15 | dep 13:00 (arrival derived; 14:00 would break the ceiling to Augezd by 14:30) | B |
| legrand@7 "as the trap closes" | 09:30-12:45 | 13:00-14:00 | dep 13:00, at 14:00 | C |
| legrand@8 retakes Telnitz for good | 12:45-14:30 | 14:00-15:00 | at 15:00 | C |
| friant@2 retakes Telnitz, falls back | 07:00-08:00 | 07:00-08:30 | at 08:30 | C |
| kollo@4 Jurczek attacks the summit | 08:45-09:30 | 08:45-10:15 | at 10:15 | B |
| lang@4 Langeron's reinforcements | 08:00-09:30 | 08:00-10:30 | at 10:30 | C |
| bag@6 begins falling back | 10:30-11:15 | 11:15-11:25 | dep 11:15 (arrival derived) | B |
| bag@8 withdraws on Rausnitz | 12:45-14:30 | 16:30-16:45 | dep 16:30 (arrival derived) | C |
| kienmayer@8, dok@8 over the neck under fire | 12:45-14:30 | 14:30-15:00 | dep 14:30, at 15:00 | C |
| caffarelli@5, suchet@5 Lannes advances; bag@5 counter-attacks | 04:00-10:30 | 09:30-10:30 | dep 09:30 | B |

Not given a time: `friant@1` (re-reviewed: §M matched its statement to the wrong anchor; the statement dates the arrival at the
Goldbach, `friant@2`; the waypoint's own move is undated); and the four anchors of the unresolved conflicts.

**The three conflicts (decision 42): not settled.** Duffy (1977) and Smith (1998) are not in the repository, and this
environment's network policy blocked every host tried (archive.org: HTTP 403 from the proxy; Google Books, HathiTrust, Open
Library, Gallica, Wikipedia: no connection). No web summary or AI output was used. Dokhturov's descent (`dok@1`), Kamensky's
turn (`kamensky@3`, and `kamensky@4`, dated by the same timeline entry) and Rapp's counter-charge (`guard_cav@6`) keep
today's timing, are listed in the Sources panel's open questions, and are the only early moves the regression allows, by name.

**Creeping moves (decision 45).** Given a departure: Caffarelli, Suchet, Bagration (c. 09:30), Rivaud (after 08:45).
**Undated, unchanged:** Kellermann, Nansouty, d'Hautpoul (phase 5), the Allied headquarters (phase 3), the Russian Guard
cavalry (phase 6).

**Derived values that moved** (old → new; re-derived, no threshold loosened; details §M.12):
- centre separation first reported 08:26 → **09:03** (last 14:14 → 14:52);
- plateau at 08:45, Allied / French 23,550 / 13,300 (cut) → 23,550 / **0** (not cut); at 14:00, 0 / 18,500 → 0 / **30,900**;
  every other mark, the 04:00 figure (38,700) and tour stop 4's figures (38,700, 19,300 first at 07:07) unchanged;
- event agreement: still 0 disagreements, worst 0.82 km; `soult` 0.44 → 0.20 km, `pratzen-village` 1.14 → 1.21 km (1.5
  allowed, unchanged), `hq-forward` 0.32 → 0.00 km;
- fastest leg by arm: infantry 3.41 → 4.97 km/h, hq 7.15 → 7.62, mixed 1.11 → 3.87 (ceilings 5, 12, 8: no leg over);
- `redteam.js` mean march rates, infantry / cavalry 0.77 / 0.82 → 1.28 / 0.82; its **warning** "cavalry mean rate is not
  above infantry" now fires (a warning, not a finding: the dated moves are faster, the undated cavalry moves still creep);
- Command view counts (seen / uncertain / unknown): French eyes, phases 5-8, 2/2/9, 4/0/9, 9/0/4, 7/0/6 → 4/2/7, 6/0/7,
  7/0/6, 8/0/5; Allied eyes, phases 2-3, 3/1/14, 5/1/12 → 4/1/13, 6/1/11;
- harness clocks 08:20-10:00: 6 to 8 formations moved, up to 1,656 m (Rivaud, 08:20);
- chronology audit: 22 early (70 with a timed statement) → **4 early** (69; the unresolved conflicts), 0 late;
- arrows derivable on the leg executed in their phase: 1 → 4.

**Expected values that changed** (each a recorded consequence of this data change): `check:baseline` md5 and size;
`check:data`'s reference build; `tools/visual/thresholds.js` KNOWN emptied (tighter). No suite's assertion was edited;
`sim-test.js`'s event rule (1 km, 2 km cap) and `selfTest`'s 38,700 are unchanged.

**Text.** Searched narrative, tour, analysis, dispatch, command and dossier text for derived times or figures: tour stop
4's "by 07:15" still holds; tour stop 8 and the chapter "The destruction of the Allied left" (both at 14:40) now fall inside
the separation interval (before, the reading had stopped at 14:14); nothing needed correcting, nothing is flagged.

**Tests** (on this build)
- `npm run build`: 1,121,991 bytes, md5 `e76222b31b3671020c7643b9e6ea1925`.
- `npm test`: ALL 8 SUITES PASSED (`redteam.js`: 0 findings, 1 warning, the march-rate one above; `sim-test.js`: 0 errors, 0
  disagreements).
- `npm run check:data` against the Stage 0 reference: 7 DATA declarations changed, exactly those listed; against the new
  reference: all identical.
- `npm run check:chronology`: 69 moves with a timed statement, 65 consistent, 4 early (the named conflicts), 0 late; 20
  explicit times, every evidence quote found; 0 errors.
- `npm run check:visual`: STAGE0: all checks passed; 11 views, 0 overlapping labels or counters in every view (no residual
  allowed); `selfTest` 13 of 13 PASS, "derived readings unchanged" included (38,700 at 04:00; movement audit 0 findings).
- `npm run check:contrast`: 3,103 text elements, 70 pairs, 0 below AA, 0 below 10.5 px.
- `npm run check:baseline`: passes on this build.
- `tools/stage2/delayed-moves.js`: eight states, before and after (`docs/stage2-evidence/delayed-moves.md`).

**Not verified:** the literature behind every time written (all "app narrative, unsourced"); the three conflicts (sources
unreadable here); the derived arrivals (a model rule, not evidence); the undated creeping moves.

## 2026-09 · Stage 2A continued: owner decisions 31-39 and the chronology audit (docs/STAGE2_SPEC.md §M); no change to the build

**Status: §M awaits the owner's review; 2B has not started. `austerlitz-command-map.html` unchanged: 1,107,799 bytes, md5
`5bf48b75373fe0cf9fc8a32cbeae918c`.**

**What changed**
- `docs/STAGE2_SPEC.md`: the owner's answers to §L recorded as decisions 31-39 (§0, §L), and the specification updated
  where they apply (§B, §C, §F, §I, §J, §K); §C lists what each mismatched arrow's endpoints correspond to (decision 37);
  new §M, the chronology audit.
- `tools/stage2/chronology.js` (every anchor against the app's timed statements, with the hand-reviewed verdicts) and
  `chronology-sim.js` (the derived readings under each timing remedy); `model.js` exports more data; evidence
  `docs/stage2-evidence/chronology.md`.

**The audit (§M), in brief.** 148 moves; 70 have a timed statement about the move in the app's own data: 48 consistent,
**22 early** (median 45 min, up to 120), **0 late**; 9 more creep from 04:00. Mixed, not systematic: moves that prepare a
phase's opening action agree with the engine's phase-start rule; moves that are the phase's action (climbs, charges, the
wheel, retreats under fire) are early. The rule was used deliberately in the correction pass and some event markers were
fitted to it. Remedies simulated; recommendation (c): keep the rule as a documented default, add explicit anchor times
from the app's own statements in a separate data task before 2C. Both of the owner's cases confirmed; the item at t 680
is the analysis chapter "guard", not an event (the event `guard-broken` starts at 11:15).

**Corrections recorded**
- Decision 25: the rotation export is `GEOREF.ROT_DEG`; the decision's wording `GEOREF.ROT` is superseded.
- The Second Military Survey covered Moravia in 1836-1840 (accepted).
- The Satschan draining dates disagree between sources: austerlitz.org's Žatčany page gives 8-12 December 1805; the
  estate report as quoted elsewhere gives 8-16 December. Both recorded with their sources; neither adopted until the
  report itself is read.
- The finds disagreement (18 guns and 180 horses in the quoted report; 38 guns and about 130 horses in the app's data and
  English summaries) stays open.

**Open data tasks (recorded, not done)**
- The going layer's slope thresholds (0.88 and 1.70 true degrees): source them, or rename the classes descriptively
  (decision 32). Until then they are provisional and unsourced design values.
- The chronology (§M.5): explicit anchor times from the app's timed statements; the three disagreeing texts; re-dating the
  events fitted to the early timing; the suite values re-derived. Before 2C.
- The Satschan draining dates and finds.

**Tests**
- `npm run build`: md5 `5bf48b75373fe0cf9fc8a32cbeae918c`, 1,107,799 bytes (unchanged).
- `npm run check:baseline`: passes.
- `npm test`: ALL 8 SUITES PASSED.
- `npm run check:data`: all 112 DATA declarations byte-identical.
- `chronology-sim.js` check: its variant engine reproduces today's positions exactly (0.000000 map units).

**Not verified:** the literature behind the app's timed statements (§M.6 lists the source questions); the draining dates
(the pages could not be opened from this environment); the remedies are simulated, not implemented.

## 2026-09 · Stage 2A: map readability specified (docs/STAGE2_SPEC.md); no change to the build

**Status: specification for the owner's review. `austerlitz-command-map.html` unchanged: 1,107,799 bytes, md5
`5bf48b75373fe0cf9fc8a32cbeae918c`** (confirmed on `main` before the work, and by `check:baseline` after it).

**What changed**
- `docs/STAGE2_SPEC.md`: owner decisions 18-30 and their verdicts; sections A-L (height inventory and display-height
  design, exaggeration evidence and the 1x options, arrow binding, dashes, "IV Column halted", the Allied arrowhead,
  map text measured, the DOM/SVG layer, the north-up paper map, the unobstructed-map baseline, the provisional
  standard ratio, the meres research note, test plan, pull-request plan, open questions).
- `docs/stage2-evidence/`: the renders and tables the specification cites.
- `tools/stage2/`: the scripts that produced every number (not bundled). Probes are injected into the running page
  for measurement only; no source file is changed by them.
- **`check:baseline` re-baselined** (`package.json`): it passed only on the Stage 0 build (`c09c4b23…`) and has failed
  since Stage 1B by design. It now passes only on the Stage 1B build: md5 `5bf48b75373fe0cf9fc8a32cbeae918c` **and**
  1,107,799 bytes, so it proves this task did not change the build. `CLAUDE.md` updated to match.
- `.gitignore`: `tools/stage2/out/`.

**Findings that the owner's decisions did not anticipate** (details and questions in the specification)
- The going layer's slope classes are computed on the drawn 10.33x slope: "hard for guns" above 9 degrees drawn is 0.88
  degrees true, "severe slope" above 17 is 1.70 (§B.4, question L2). Not changed.
- 29 camera presets live in guarded data (`PHASES`, `ANALYSIS`, `TOUR`) in 10.33x world units; 2B must re-frame at use.
- `OVERLAYS` arrows depict the leg that *arrives* at the phase's anchor (10 of the 11 derivable arrows), not the leg
  *across* the phase that decision 22 names (§C.1, question L3).
- The plan staging-area outline is a dashed drawing missing from `VISUAL_SPEC.md` §10.5 (a plan, so allowed).
- The Satschan pond finds in the app's data (38 guns, about 130 horses, two men) disagree with a local estate report
  as quoted (18 guns, 180 horses, two men; drained 8-16 December 1805). Kept as a disagreement; not changed.
**Tests (all run on the unchanged build)**
- `npm run build`: md5 `5bf48b75373fe0cf9fc8a32cbeae918c`, 1,107,799 bytes, identical to `main`.
- `npm run check:baseline` (re-baselined): passes; a copy with one byte added fails (exit 1).
- `npm test`: ALL 8 SUITES PASSED.
- `npm run check:data`: all 112 DATA declarations byte-identical (against the Stage 0 reference, as before).
- `npm run check:visual`: STAGE0: all checks passed; `selfTest()` 13/13 PASS; the only counter overlap is the named
  hybrid-dimmed Walther / Nansouty residual.
- `npm run check:contrast`: 3,101 text elements, 0 below AA, 0 below 10.5 px.
- The measurement scripts in `tools/stage2/` ran to completion; their outputs are in `docs/stage2-evidence/`.

**Not verified or not done:** browsers other than headless Chromium 141 with software WebGL (the pass times of the
DOM probe and the factor-change times are for that renderer, not a user's GPU); the meres sources could not be opened
from this environment (the network policy blocked them), so every figure in §I.2 is as quoted in search results and
must be read from the source before use; arrowhead legibility was judged by eye on crops, with measured sizes, not by a
numeric test; the map-text contrast method can under-read where a run's 2 px margin takes in a neighbouring mark; the
probes approximate what 2B-2F would build (for example the 1x footprints use the block's own frontage and depth, the
paper-map probe is near-orthographic, not orthographic). Historical uncertainty (the pond finds and dates, the pond
areas) is recorded in §I.2 as disagreement between sources, separate from these implementation limits.

## 2026-09 · Stage 1B: the visual language implemented (docs/VISUAL_SPEC.md)

**Status: done; all checks pass except `check:baseline`, which fails by design (the build changed).**
`austerlitz-command-map.html`: 1,107,799 bytes, md5 `5bf48b75373fe0cf9fc8a32cbeae918c` (was 1,097,610, `c09c4b23…`).

**What changed** (the specification's §12 plan; values and departures in its new §14):
- **One source of colour and type:** `tokens.js` (`TOKENS`, strict JSON between markers) holds every interface and
  symbology colour for the landscape and paper themes, the seven type steps and the font stacks. `build.py` loads
  it second in the bundle; `python3 build.py --tokens` writes its copy into `style.css`, and the normal build stops
  if that copy has drifted. Nation colours stay only in `NATION` (unchanged); the four unused CSS nation/panel
  properties are gone.
- **Stylesheet:** every colour is a token (the developer overlay's text excepted); the 52 paper-map override rules
  are replaced by the paper token set, so the whole interface turns light on the paper map (owner decision 8); the
  interface accent is warm ivory, paired with a bar, underline or weight; 20 font sizes became the seven steps with
  floors of 10.5 px (tertiary), 12.5 px (battle information) and 14 px (dossier and dispatch body); text is no
  longer faded with opacity.
- **Counters (`symbols.js`):** a cased frame in the side colour (blue / amber) between dark keylines; the nation's
  fill and a nation tag (`NATION.tag` in `NATION.ink`); no dashes; plated B / C / "?" badges; neutral status plates
  with icons; dimmed counters dim only fill, frame, glyph and tag, with text one step down; a selection ring
  outside the frame; frame 110 x 78 units, names, strengths and status at 27 units (at least 12 px on screen).
- **Map and interface (`app.js`, `world.js`, `shell.html`):** `SIDE_COL` from the side tokens; every event, decisions
  included, in its side colour (dossier bar: side, not the Russian fill); annotation colour for overlay, objective,
  plan, plateau and event text, with paper variants; formation names neutral with a side mark; solid movement
  trail, selection ring, plateau ring and retreat arrows (only intended routes and plan links stay dashed);
  terrain-analysis colours from one table with paper variants, recoloured on the paper map; ridge, escarpment,
  "hard for guns" and vineyards off the amber axis; status, claim, layer and source tags as neutral plates with
  icons; the legend's going rows written from the table the going layer draws, the dash entry replaced by the badge
  row, the terrain-notation dash shown only with the terrain-study layer; place labels at least 10.5 px.
- **New check:** `npm run check:contrast` (`tools/visual/contrast.js`).

**Tests (all run on the final build):**
- `npm run build`: 1,107,799 bytes; the token block matches `tokens.js`. Drift check proven on a scratch copy: an
  edited token without `--tokens` stops the build (exit 1).
- `npm test`: ALL 8 SUITES PASSED (css-test 0 errors, 9/9; test.js 0 errors, 41/41; geo-test 54/0; terrain all OK;
  audit 0 and 0 violations; sim-test 0 errors; redteam 0 findings; runtime-test 0 errors).
- `npm run check:data`: all 112 DATA declarations byte-identical; 34 rendering and interface declarations changed,
  11 added, `TONE` removed.
- `npm run check:visual`: STAGE0: all checks passed; `AUSTERLITZ_DEBUG.selfTest()` 13/13 PASS, including the
  first-run key against the legend and the drawing colours. Counter overlaps: only the allowed hybrid-dimmed
  Walther / Nansouty pair. An earlier counter layout (frame 150 x 86, all counter text at 27 units) failed this
  threshold (7 pairs hybrid-dimmed, 1 paper map) and was re-fitted, not the threshold.
- `npm run check:contrast`: 3,101 text elements, 0 below WCAG AA, 0 below 10.5 px (the Stage 0 build: 67 below AA,
  447 below 10.5 px).
- `npm run check:baseline`: fails by design (new md5).
- No suite or self-test assertion was changed: none checked a colour the specification changed.
- Screenshots before and after: `docs/stage1-review/`.

**Not verified or not done:** browsers other than headless Chromium 141 with software WebGL (the CSS uses
`rgba(var(--x-rgb),a)`, supported in all current browsers); canvas text contrast is computed from the drawing code
(specification §6.3), not measured in pixels; the highlighted family's dominance in the hybrid-dimmed view was judged
by eye, with no numeric metric; event glyphs keep their landscape (light) side colours on the paper map, since they
are built once; the view-mode switch still fades to 24% in watch and map modes (a behaviour, left); the legend's empty
area and its overlap with the dispatch on the paper map were there before (layout, Stage 2 and 3).

**Note added 26 September 2026 (Stage 2A review):** the contrast results above measure page text; for the canvas text (counters
and map labels) this entry relied on values computed from the drawing code (`docs/VISUAL_SPEC.md` §6.3), as its "Not verified"
line says. The measurement in `docs/STAGE2_SPEC.md` §E does not confirm it for counters on the paper
map (grey text on the translucent paper halo, 2.9-4.5:1 over darker hillshade) or for dimmed counters' nation tags (about
1.7:1, drawn at 34% opacity, which also does not meet owner decision 13). The entry is left as written.

## 2026-09 · Stage 1A: owner decisions recorded in the specification; no code change

`docs/VISUAL_SPEC.md` records the owner's answers to its ten open questions as owner decisions 8-17 (§1.1)
and updates the sections they affect: the whole interface turns light on the paper map through a second token
set; formation names are neutral text with a side-coloured mark beside them in the landscape view; evidence
and source tags are neutral with icons; counters carry `NATION.tag`; dashes mean "planned or intended" only;
two named symbol scales (figure, landscape), with trees grouped with settlements; type floors of 10.5 px
(tertiary), 12 px (battle information) and 13 px (body text); ridge, escarpment and "hard for guns" leave the
amber axis in Stage 1.

Checked for the decisions (fact): the chevron head on plan ribbons is set by side (`app.js:2309`), not by plan,
so it is a side cue; `retreat` movement arrows are drawn dashed although they are not intended movement, and
become solid in Part B (`axis`, the Allied columns' intended routes, stays dashed); "hard for guns" is only a
palette value in `makeGoingPalette` and a legend key, so it changes in Stage 1, not Stage 4; the going legend
lacks the vineyard class; the tree kit measures 3.4 (broadleaf) and 4.7 (conifer) world units median, 214 and
295 m, about 10-15 times life like the buildings; counter strengths and designations reach only 9.5-11.8 px on
screen, below the new 12 px floor. A scratch prototype (not committed) of full-opacity text on dimmed counters,
rendered through the hybrid-dimmed harness case, made the text legible but weakened the highlighted family's
dominance, so the rule is full opacity one step down in tone and weight, with neutral status plates.

No code, data, test or build change: `austerlitz-command-map.html` unchanged, 1,097,610 bytes, md5
`c09c4b23d9e245ff9d693960cf9496b9`. Still open: exact replacement colours (chosen in Part B against the tests in
the specification), the Allied arrowhead (Stage 2), the kind of the "IV Column halted" arrow (a data question),
and the counter re-fit for the 12 px floor.

## 2026-09 · Stage 1A: specification drafted; no code change

`docs/VISUAL_SPEC.md`: the visual language specification (Stage 1, Part A), written against `e9190e1` with the
owner's seven decisions as fixed input. It holds the colour and type inventory with file and line (533 colour
literals, 168 distinct interface and symbol colours), the encoding table, proposed colour tokens with one
source of truth for CSS and JavaScript, measured text contrast, a colour-vision check, the type scale and label
hierarchy, the symbol-scale convention, the confidence encoding, the Part B plan with its expected effect on
every check, and ten open questions.

**Measured, not estimated:** 192 text/background pairs read from the built page in Chromium across 17
interface states, composited over dark and bright map backdrops; 72 fail WCAG AA (4.5:1). Findings that
bear on the decisions: a single side-coloured counter frame cannot reach 3:1 against its own fill and every
ground, so decision 1 needs a cased frame (a side band between dark keylines); the confidence badge that
decision 4 makes the only encoding has no plate today (1.15:1 on bright ground); amber also carries
non-Allied meanings (terrain-analysis ridge and escarpment, the "hard for guns" going class, the height
label, objectives, the movement trail, decision events), which decision 2 moves off it except for the going
classes (terrain palette, Stage 4); the paper map is half themed. `NATION` does not need to change. Blue and
amber stay distinct under protanopia, deuteranopia and tritanopia but are identical in greyscale, so side
also needs a non-hue cue.

No code, data, test or build change: `austerlitz-command-map.html` unchanged, 1,097,610 bytes, md5
`c09c4b23d9e245ff9d693960cf9496b9`. Uncertain: the real-world sizes used to state the symbol-scale factors
are rough general values, not historical data; standard and flag dimensions are to be sourced in Stage 6.

## 2026-09 · CI checks the committed build; set-up tasks closed (no change to the build)

`.github/workflows/checks.yml` now runs `git diff --exit-code --stat austerlitz-command-map.html` after `npm run
build`: the committed product must be exactly what the sources build, so a source change committed without its
rebuilt HTML fails CI. Checked on a scratch clone: exit 0 on this tree; exit 1 after a one-character edit to
`style.css` and a rebuild. `docs/HANDOFF.md` is now the record of the four completed set-up tasks; `README.md` and
the finishing note in `CLAUDE.md` follow. `austerlitz-command-map.html` unchanged: 1,097,610 bytes, md5
`c09c4b23d9e245ff9d693960cf9496b9`.

## 2026-09 · Automated checks on every push (CI only; no change to the build)

**Status: added (`docs/HANDOFF.md`, task 4).** `.github/workflows/checks.yml` runs on every push and pull request, on
`ubuntu-latest` with Node 22: `npm install`, `npm run build`, `npm test` (fails if any suite fails, since task 3) and
`npm run check:data`. Implementation choices: `npm install` rather than `npm ci`, because the repository has no lockfile;
Playwright's browser download is skipped, and `npm run check:visual` is not run in CI (it needs Chromium and about ten
minutes of software rendering; it stays a local check); read-only repository permissions; a 45-minute job limit.

**Verified locally** on a fresh clone of this branch with the same steps: all four exit 0 (`ALL 8 SUITES PASSED`; 112
DATA declarations byte-identical). The first run on GitHub is the push of this change; its result is reported in the
pull request. `austerlitz-command-map.html` unchanged: 1,097,610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`.

## 2026-09 · The test runner fails loudly (test tooling only; no change to the build)

**Status: done (`docs/HANDOFF.md`, task 3).** `tools/run-all.sh` printed each suite's summary but always exited 0, so
`npm test` passed whatever the suites found. Two suites never set an exit code at all: `audit.js` (it reports only
`MARCH RATE VIOLATIONS (N)` and `TERRAIN VIOLATIONS (N)`) and `runtime-test.js` (`errors: N` and `  E ` lines). The
runner now marks a suite failed if it exits non-zero (which covers a crash and the 600 s timeout) or its output shows an
error summary: a non-zero `ERRORS`, `CSS ERRORS`, `errors`, `findings`, `VIOLATIONS`, `failed` or `disagreements`
count, or a failed-check line (`  ! `, `  E `, `  FAIL `, `  ✗ `, `BROKEN`, `FLOATS`, `DISAGREE`, `<-- outside`). It
prints `!!! <suite> FAILED` after that suite, and at the end either `ALL 8 SUITES PASSED` (exit 0) or `REGRESSION
FAILED: <suites>` (exit 1). The per-suite summary it prints is unchanged, and no suite was changed. **Design decision:**
warnings (`warnings: N`, `console.warn unique: N`) do not fail the run; the suites themselves keep them apart from
errors.

**Verified:** on this tree `npm test` prints `ALL 8 SUITES PASSED` and exits 0, and none of the failure patterns
matches anything in the eight suites' full output (no false alarms). On a scratch copy broken three ways (the infantry
march-rate ceiling lowered to 1 km/h, a throw added to `syncSelChip`, the French gun total set to 140), the new runner
exits 1 and names `test.js`, `audit.js`, `sim-test.js` and `runtime-test.js`; `audit.js` and `runtime-test.js` exited
0 and were caught by their summaries (25 march-rate violations; 2 errors). The original runner, on the same copy,
exited 0. `npm run check:baseline`: md5 `c09c4b23d9e245ff9d693960cf9496b9`. `npm run check:data`: 112 DATA
declarations byte-identical. `docs/SUITE_RECOVERY.md` and the checks note in `CLAUDE.md` updated.
`austerlitz-command-map.html` unchanged: 1,097,610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`.

## 2026-09 · `runtime-test.js` brought up to Stage 0 (test harness only; no change to the build)

**Status: done (`docs/HANDOFF.md`, task 2).** `runtime-test.js` reported 2 errors on Stage 0 (`mesh.getMatrixAt is
not a function`; `_cR.setFromMatrixColumn is not a function`). The first was thrown inside `init`, so on Stage 0 none of
its drive checks had run. Cause: its stand-in three.js had token maths, while Stage 0 seats figures through world
matrices and places labels through the camera's projection. Changes, all in `runtime-test.js`:
- The maths is the real `three@0.128.0` (the existing devDependency): `Vector2`, `Vector3`, `Matrix3`, `Matrix4`,
  `Quaternion`, `Euler`, `Spherical`. Beyond the handoff's list, and needed for the same reason: the stand-in
  `Object3D` extends the real one (its token quaternion and empty `matrix` could not carry a world transform), and the
  cameras are the real `PerspectiveCamera` and `OrthographicCamera`. Rendering stays stubbed (renderer, render
  targets, textures, materials, geometries, `Color`).
- `InstancedMesh` stores per-instance matrices as r128 does (`instanceMatrix.array`, `setMatrixAt`, `getMatrixAt`,
  `count`).
- The `document` stand-in gained element `querySelector` (Stage 0's selection chip) and `getComputedStyle` (inline
  style or defaults; no stylesheet is loaded), which Stage 0's label placement asks for.
- The re-seating check's reset set `rec.seatPos=null`, which Stage 0's `settleBlock` no longer reads (it keeps the
  state in `rec.seated`); the reset now clears both. Its assertion is unchanged.

No assertion was removed or loosened (no changed line in the diff contains `throw`, `Error`, `errs`, `warns` or
`console`). **Verified:** on Stage 0, `runtime-test.js` reports 0 errors, 0 warnings, and its output is byte-identical
to the unmodified test's output on the correction-pass build (36 drive checks plus the photo atlas, same numbers:
40 formations, 281 clock steps, 24 event hops, 12,688 apron faces, 294 men in 5 draws, 57 parent/child moments). The
modified test's output on the correction-pass build is byte-identical to the unmodified test's. `npm test`: all eight
suites pass (runtime 0 errors). `npm run check:baseline`: md5 `c09c4b23d9e245ff9d693960cf9496b9`. `npm run
check:data`: 112 DATA declarations byte-identical. `docs/SUITE_RECOVERY.md` and the checks note in `CLAUDE.md`
updated. Not re-run: `npm run check:visual` (no application code changed). `austerlitz-command-map.html`
unchanged: 1,097,610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`.

## 2026-09 · Recovered tree put in place; `dist/` retired (no change to the build)

The upload of the recovered tree (commit `03b7118`) came through the GitHub web interface and was flattened again:
all 60 files landed at the repository root. The layout the new `CLAUDE.md` and `docs/SUITE_RECOVERY.md` describe is
restored, each file placed by its own path references:
- **Removed as byte-identical duplicates** of files already in place (checked with `cmp`): `README (1).md`,
  `README (2).md`, `STAGE0_VERIFICATION.md`, `VISUAL_AUDIT.md`, the eight `tools/visual/` scripts, the four
  `tools/stage0/` files, `split-from-html.py`, both `archive/` builds, and `download` (= `.gitattributes`).
- **Replaced by the uploaded version:** `docs/SUITE_RECOVERY.md` (now the recovery record), and `.gitignore`
  (uploaded as `download (3)`; adds `bundle.js` and the generated `_*.js` test modules).
- **Moved:** `HANDOFF.md` to `docs/`; `run-all.sh`, `mk-helpers.js`, `mk-world-mod.js` (they take `..` as the root)
  and the twelve history tools (`geo-migrate.js`, `geo-anchor.js`, `warp.js`, `warp-proto.js`, `geo-proto.js`,
  `geo-dump.js`, `relief-fit.js`, `stale-compare.js`, `inventory.js`, `leg-check.js`, `patch-app.py`,
  `patch-history.py`; they `require('../geo.js')`) to `tools/`. The suites and `style.css` stay at the top level.
- **`docs/HANDOFF.md` task 1:** `dist/` deleted; it was byte-identical to the top-level
  `austerlitz-command-map.html`. Nothing else refers to it: the remaining mentions are earlier entries of this
  changelog, `docs/HANDOFF.md` itself, and `apply-stage0.py`'s generic list of folders to skip.
- The entry "Repository structure restored", dropped by the upload, is restored below.

No source, data, suite or tool content changed. **Verified:** `npm run check:baseline`: md5
`c09c4b23d9e245ff9d693960cf9496b9` (`build.py` prints "bytes: 1097392", which is its count of characters; the file
is 1,097,610 bytes). `npm run check:data`: all 112 DATA declarations byte-identical. `npm test`: build OK; seven
suites pass with the recorded results (CSS 0 errors, 9/9; test.js 0 errors, 41/41; geo-test 54/0; terrain all OK;
audit 0 and 0 violations; sim-test 25 events, 0 disagreements; redteam 37 claims, 0 found, 0 findings);
`runtime-test.js` reports the 2 known errors (`mesh.getMatrixAt is not a function`,
`_cR.setFromMatrixColumn is not a function`), as `docs/SUITE_RECOVERY.md` records. The runner exits 0 regardless
(`docs/HANDOFF.md`, task 3). Not re-run here: `npm run check:visual`. `austerlitz-command-map.html`: 1,097,610
bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`.

## 2026-09 · Source tree and regression suite recovered; source synchronised with Stage 0

**Status: done; both builds reproduced byte for byte.** The correction-pass source tree, its eight suites, the
runner and every tool were recovered from the account data export by replaying the first project chat's tool calls
(method and proof: `docs/SUITE_RECOVERY.md`). The recovered tree rebuilds the correction-pass file exactly (md5
`672aff9f...`), and the original suite reproduces every recorded result on it. With the 73 Stage 0 edits applied, the
original `build.py` rebuilds the Stage 0 file exactly: 1,097,610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`.

**Implementation source of truth: this recovered tree** (`style.css`, the scripts, the suites at the top level,
`tools/run-all.sh`), built by `build.py`. It supersedes the interim tree split from the HTML and its `dist/` folder.

**On Stage 0, seven suites pass unchanged** with the correction-pass results. `runtime-test.js` reports 2 errors:
its stand-in three.js lacks maths that Stage 0's seating and labels use; the application is unaffected (verified in a
real browser by the Stage 0 harness and self-test). Fix: `docs/HANDOFF.md`, task 2.

**Changed in recovered files:** `tools/run-all.sh` finds the repository root itself (was a sandbox path); `build.py`
writes LF on every platform (output unchanged); `runtime-test.js` gains the `location` and `renderer.info` stand-ins
Stage 0 needs. `assets.js` was taken from the verified build, because its source photographs were downloaded in that
chat; the byte-identical rebuild proves it exact.

## 2026-09 · Suite recovery, round 1 (no change to the build)

Recovered from the first project chat and validated: `tools/mk-helpers.js` (verbatim) and
`tools/mk-world-mod.js` (creation plus its one recorded edit). Both run cleanly on the correction-pass
and Stage 0 builds; the world module reproduces the verified elevations. Generated test modules are
ignored by git. The eight suites are still to be recovered (`docs/SUITE_RECOVERY.md`). The build is
unchanged (md5 `c09c4b23…`).

## 2026-09 · Repository structure restored (no change to the build)

*(Restored: this entry was dropped when the recovered tree was uploaded. The layout it describes held until the recovered tree replaced `dist/`; see the entry above.)*

The first upload through the GitHub web interface flattened the tree: every file landed at the
repository root, `.gitignore` and `.gitattributes` arrived as `download` and `download (3)`, and the two
sub-READMEs as `README (1).md` and `README (2).md`. `check:data` and `check:visual` could not run
(`Cannot find module tools/visual/data-invariance.js`). The layout is restored with 23 pure renames
(`git mv`, every one 100% similar, 0 lines changed), each placed by its own header and by the paths
that `package.json`, `CLAUDE.md`, `README.md` and the documents already cite:
- `tools/visual/`: `data-invariance.js`, `harness.js`, `measure.js`, `thresholds.js`, `cases.js`,
  `check-report.js`, `compare-gallery.js`, `darkness-study.js`, and `README.md` (was `README (1).md`,
  "Visual regression harness (Stage 0)").
- `tools/stage0/`: `apply-stage0.py`, `extract-edits.py`, `stage0-edits.json`, `stage0.patch`, and
  `README.md` (was `README (2).md`, "Stage 0 source patch", which names these four files).
- `tools/split-from-html.py` (its docstring gives that path).
- `archive/`: `stage0-c09c4b23.html` (md5 `c09c4b23…`), `correction-pass-672aff9f.html` (md5 `672aff9f…`).
- `docs/`: `VISUAL_AUDIT.md`, `STAGE0_VERIFICATION.md`, `SUITE_RECOVERY.md`.
- `dist/austerlitz-command-map.html` (was at the root; md5 `c09c4b23…`).
- `.gitignore` (was `download`: `node_modules/`, `tools/visual/out/`, `*.pre-stage0`, `__pycache__/`) and
  `.gitattributes` (was `download (3)`: `* text=auto eol=lf` and the binary types). Every tracked file
  was already LF, so `.gitattributes` renormalises nothing.

No source, data, HTML, test or script content changed. **Verified after the move:** `npm run
check:baseline`: 1,097,610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`, matches. `npm run check:data`:
all 112 DATA declarations byte-identical (and, as an extra check, also between
`archive/correction-pass-672aff9f.html` and `archive/stage0-c09c4b23.html`). `npm run check:visual`
(Playwright 1.56.0, its bundled Chromium 141): 11 cases and the self-test, "STAGE0: all checks passed";
the only overlap is the allowed hybrid-dimmed counter pair; two Canvas2D `willReadFrequently`
performance warnings in the console. **Not run:** the correction-pass suite (`tools/run-all.sh`), which
is not in the repository (`docs/SUITE_RECOVERY.md`). `dist/austerlitz-command-map.html` unchanged:
1,097,610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`.

## 2026-09 · Repository set-up (no change to the build)

The source tree went into the GitHub repository with `CLAUDE.md` (the project rules for Claude Code),
`package.json` (`npm run build`, `check:data`, `check:visual`, `check:baseline`), `docs/`
(`VISUAL_AUDIT.md`, the Stage 0 verification report, the suite-recovery plan) and `archive/` (the
correction-pass build, md5 `672aff9f…`, and the Stage 0 build, md5 `c09c4b23…`, kept as frozen
references). `dist/austerlitz-command-map.html` is unchanged: 1,097,610 bytes, md5
`c09c4b23d9e245ff9d693960cf9496b9`. The correction-pass regression suite is still to be recovered
(`docs/SUITE_RECOVERY.md`).

## 2026-09 · Source tree re-established from the Stage 0 build

**Status: done; the rebuild is byte-identical.** The editable source tree now exists outside any chat
sandbox: `shell.html`, `assets.js`, `geo.js`, `data.js`, `analysis.js`, `world.js`, `symbols.js`,
`app.js` and `build.py`. `python3 build.py` produces `dist/austerlitz-command-map.html`, 1,097,610 bytes,
md5 `c09c4b23d9e245ff9d693960cf9496b9`, byte-identical to the verified Stage 0 build (checked with `cmp`
and md5). **Implementation source of truth: this tree**, built by `build.py`; the HTML is its output.

**How it was made.** The correction pass's tree (`/home/claude/aus2`) existed only in the first project
chat's temporary sandbox. Only its built HTML and this changelog were ever downloaded, so no later chat
had it. The tree was re-created from the Stage 0 HTML by `tools/split-from-html.py`, which cuts the
bundle at each original file's header banner, in the load order recorded in the first chat's
`build.py` (assets, geo, data, analysis, world, symbols, app, placed in `shell.html`). No code was
rewritten: the files are slices of the verified build, each parses on its own, `geo.js` still loads under
Node, and the rebuild reproduces the build exactly. The new `build.py` reads and writes bytes and turns
CRLF back into LF, so a Windows checkout builds the same file.

**Not recovered.** The correction-pass regression suite (`css-test.js`, `test.js`, `geo-test.js`,
`terrain-test.js`, `audit.js`, `sim-test.js`, `redteam.js`, `runtime-test.js`, `tools/run-all.sh`), its
helper generators (`tools/mk-helpers.js`, `tools/mk-world-mod.js`) and the one-off migration tools
(`tools/warp.js`, `geo-migrate.js`, `geo-anchor.js`, `relief-fit.js`, `stale-compare.js`) were in the same
sandbox and are not in this tree. Their recorded results (the correction-pass entry below) stand for that
build, and the data they checked is byte-identical today (Stage 0's data-invariance proof), but they
cannot be re-run until recovered from the first chat's transcript or rebuilt. Stage 0's harness,
self-test and data-invariance check (`tools/visual/`) are in the tree. `tools/stage0/` is kept as a record;
its edits are already in these files.

## 2026-09 · Stage 0: visual and UX baseline, and trust

**Status: complete for Stage 0, verified in the delivering chat to the extent listed under Tests.
The correction-pass suite (`tools/run-all.sh`) has not been run on this build.** Published file:
`austerlitz-command-map.html` (1,097,610 bytes, md5 `c09c4b23d9e245ff9d693960cf9496b9`), produced from the
verified correction-pass build (md5 `672aff9f0d1b1673d079903185d39351`) by the 73 edits in
`tools/stage0/stage0-edits.json`. (Byte count corrected: this entry first gave 1,094,070, a figure measured on
an intermediate build before the last fixes; the file is authoritative.)

**Source (updated after Stage 0).** Stage 0 was made on the built HTML because the correction pass's
source tree no longer existed. The source tree has since been re-created from this build and rebuilds
it byte for byte; see "Source tree re-established from the Stage 0 build" above. `tools/stage0/` keeps the
record of the 73 edits, which are already in the tree.

Scope: rendering and interface only. No historical, geographic, chronological, order-of-battle or
model data changed (see Data).

### Rendering
- **Figures stand on the drawn ground.** Each man keeps the world x,z his place in the block gives him,
  is set on the terrain mesh's own triangles there (`groundY`), and is mapped back through the inverse of
  the block's world matrix: exact under any block scale (highlight dimming, hybrid mode), tilt or
  deployment. Before, the correction was written into the block's frame unscaled and untilted and only
  refreshed when the block moved 1.5 units or turned; on the Pratzeberg men stood up to 16 units off the
  ground (roughly 100 m on the 10.3x vertical scale). A first fixed-point version diverged where the
  exaggerated relief is steeper than 45 degrees; the delivered method needs no iteration.
- **Men and horses stand upright**; guns, limbers and tents keep the slope. Standards are seated and
  upright too. Skirmishers, gun crews, teams, guns, limbers and tents, which were never seated, now are.
- **Re-seating is driven by change**: position, tilt, yaw, block scale or deployment, and nothing else.
- **Camera floor.** The eye stays 1.8 units above the highest drawn ground within 1.6 units (1.2 more on
  the coarse apron). Orbit, zoom, glides, presets and the first view all pass through `clampCamera()`;
  a guard before each frame counts any path that does not.
- **Colour grade:** contrast is applied in perceptual space with a curve pinned at black and white (it
  was applied about 0.5 in linear light, which sent everything below 0.02-0.04 linear to pure black),
  plus a shadow toe. **Temporary presentation fix; see below.**
- **Landscape palette:** the baked north-west hillshade narrowed from 0.46-1.20 to 0.70-1.12.
  **Temporary; see below.** The paper map keeps its full cartographic hillshade, unchanged.
- **Smoke and dust** textures fade to zero at every edge (puffs inset, soft round window); before, puffs
  cut off by the canvas edge gave each sprite a straight translucent side (the "floating fog" cards).
  Sprites are lifted clear of the drawn ground across their width.
- **Mist sheets** carry a per-vertex fade to zero where the ground rises to meet them, eroded by one
  cell so no cell the ground passes through has any alpha; drift is bounded and time-based. The valley
  fog itself is Stage 4.
- **Render on demand.** A frame is drawn for a tween, playback, input, an unfinished easing or an explicit
  request; slow drift alone draws at an ambient rate (about 11 frames a second); nothing moving draws
  nothing. Easings are time-based, so they keep their wall-clock speed at any frame rate.

### Interface
- **First run:** the card stands alone near the foot of the map over the Overview view at 04:00, with
  three ways in: Guided tour, Watch the battle, Explore. Dispatch and legend are held back until one is
  chosen; any click or key outside the card counts as Explore without moving the camera.
- **One colour key** (`COLOUR_KEY`) writes both the legend swatches and the first-run sentence from the
  colours that draw the counters, figures and arrows. The contradiction "Amber is the Russian and Austrian
  army" is gone; the legend gains French and Allied movement rows. The wider encoding problems are Stage 1.
- **Selection chip:** whenever something is selected but the dossier is not on screen (Watch, the clean
  Map view) a small bar says what is selected and why the rest is dimmed, and offers the dossier or a way
  out. Before, a selection in Watch dimmed the field with no visible explanation.
- **Dossier heights in metres** through `GEOREF.elevM`; place dossiers also quote the surveyed height
  from `GEOREF.GT` / `ELEV_SRC` where the place is surveyed; terrain-study dossiers give a metre range.
  "units above the valley floor" (wrong in units and in datum) is gone.
- **Label placement (interim):** counters, event labels and the plateau reading are now placed, in
  priority order; a displaced counter keeps its stem on its true position; a counter may shrink to 80%
  then 64% before it stays where it is; a label wholly under an interface panel takes no space. The
  shrink fallback is kept as evidence for the Stage 2 counter layer, not as a design.
- **Development readout** (the `` ` `` key, or `?stats`): frames drawn and skipped, CPU time per stage,
  world-pass draw calls and triangles, post and label passes, seating, label placement, camera clearance,
  GPU memory objects.
- **Runtime checks:** `AUSTERLITZ_DEBUG.selfTest()` (13 checks, from the console or the harness); the
  render-time camera guard; with the readout on, a periodic seating check. `?harness=1` gives deterministic
  frames (no drift, fixed grain) for the harness.

### Temporary lighting correction (replace in the lighting pass, Stage 4)
- **Problem it solves.** With the contrast clip removed, slopes in cast shadow (the Pratzeberg's west face
  under the morning sun) were still close to black: the filmic tone curve's toe has a slope of about 0.2
  near zero, and those slopes carried very little light because the baked hillshade and the real-time sun
  darkened them from opposite sides. They read as black silhouettes with men apparently floating on them.
- **Why now.** That silhouette was the main trust-breaking fault in the audit and it cannot wait for the
  lighting pass; both changes are small, sit in the existing grade and palette, and leave mid-tones,
  highlights, pure black and the paper map as they were.
- **What replaces it.** A lighting balance in which shade receives sky light at a physical proportion of
  the sun (ambient roughly two to three stops below the sun, not five), a single light direction instead of
  a baked hillshade fighting a real-time sun, and a clock-driven sun from the 2 December ephemeris. When that
  exists, remove the shadow toe (`vec3 tt=...` in the composite) and restore or retire the baked term.

### Data: unchanged, and how that is known
`tools/visual/data-invariance.js` parses both builds (acorn) and compares every top-level declaration.
All 112 data declarations are byte-identical: historical datasets (18, 770,653 bytes), geography and relief
model (43), movement, strength and confidence model (34), derived readings, sight and knowledge (17).
31 rendering and interface functions changed, 44 declarations were added, none were removed; the original
CSS rules are kept verbatim with additions appended. At runtime the self-test re-derives 38,700 Allied on
the plateau at 04:00, both totals within 85,400 and 73,000 at 57 moments, and 0 movement-audit findings.

### Before and after (visual harness, the same 11 cases, software WebGL, 1600x900 unless stated)
| Case | Largest figure error (units) | Standards | Solid black 8x8 blocks | Near-black pixels | Overlapping labels/counters | Eye above ground | Selection shown |
|---|---|---|---|---|---|---|---|
| first-run | 5.0241 → 0.0002 | 9.49 → 0.00 | 0 → 0 | 0.48% → 0.00% | 0 → 0 | 136.39 → 275.20 | - |
| first-run-laptop | 5.0241 → 0.0002 | 9.49 → 0.00 | 0 → 0 | 0.52% → 0.00% | 0 → 0 | 136.39 → 275.20 | - |
| overview-field | 15.9459 → 0.0003 | 7.35 → 0.00 | 41 → 0 | 1.70% → 0.26% | 0 → 0 | 95.37 → 95.37 | - |
| overview-plan | 13.9212 → 0.0003 | 8.21 → 0.00 | 0 → 0 | 0.00% → 0.33% | 1 → 0 | 275.20 → 275.20 | - |
| close-sokolnitz | 3.7157 → 0.0002 | 5.75 → 0.00 | 958 → 0 | 12.82% → 0.04% | 1 → 0 | 23.48 → 23.48 | - |
| staff-paper | 0.0000 → 0.0000 | 0.00 → 0.00 | 0 → 0 | 0.00% → 0.00% | 13 → 0 | 275.20 → 275.20 | - |
| pratzen-low | 5.7624 → 0.0002 | 6.96 → 0.00 | 3141 → 1 | 24.07% → 2.50% | 0 → 0 | 21.79 → 21.79 | - |
| pratzen-orbit-min | 5.3318 → 0.0003 | 7.63 → 0.00 | 2807 → 0 | 19.44% → 0.01% | 1 → 0 | -12.28 → 1.81 | - |
| selected-formation | 15.7315 → 0.0002 | 7.77 → 0.00 | 3034 → 0 | 84.61% → 0.67% | 0 → 0 | 68.81 → 68.81 | dossier → dossier |
| watch-selected | 5.4960 → 0.0002 | 7.75 → 0.00 | 13465 → 1 | 83.92% → 2.56% | 0 → 0 | 65.84 → 65.84 | nowhere → chip |
| hybrid-dimmed | 6.4471 → 0.0001 | 4.61 → 0.00 | 9218 → 0 | 65.86% → 1.45% | 30 → 1 | 57.45 → 57.45 | nowhere → chip |

In every case: smoke and dust texture edge alpha 71/35 → 0/0 (of 255); mist alpha where the ground crosses a sheet 0.447 → at most 0.007.
Figures and standards: distance from the drawn ground, world units (about 6 m of vertical scale each). Near-black: pixels whose brightest channel is below 16/255, outside the interface panels; it includes legitimately black details, so the black-slope test is the solid-block column. Eye above ground: world units.

**Orbit into the hill (`pratzen-orbit-min`).** Centred on place pratzenv, zoomed fully in, dragged to the lowest pitch and turned toward the rising ground, the orbit asks for an eye 12.28 units below the drawn ground. The original build puts it there: 12.28 units below the ground, the black silhouette with men apparently floating above it. The Stage 0 floor holds it 1.81 units above.

### The low Pratzen view, step by step (`tools/visual/darkness-study.js`)
| Build | Near-black pixels | Solid black 8x8 blocks | Mean luminance |
|---|---|---|---|
| A original build | 13.63% | 1028 | 57.1 |
| B original grade+palette, Stage 0 seating | 21.96% | 2875 | 91.2 |
| C + contrast in perceptual space (clamped) | 7.02% | 579 | 101 |
| D + narrower landscape hillshade  (the 7.4% state) | 7.44% | 627 | 101 |
| E + pinned contrast and shadow toe  (final) | 2.50% | 1 | 103.1 |
| E final, no labels | 2.48% | 1 | 103.3 |
| E final, no formations | 1.86% | 0 | 100.8 |
| E final, no woods | 2.50% | 1 | 103.1 |
| E final, none of these | 1.79% | 0 | 100.8 |

**What the 7.4% was.** Row D, the intermediate build in which it was first measured, reproduces it (7.44%). It is the share of map pixels in this view whose brightest channel is below 16/255. It was a real defect: the Pratzeberg west face, in the hill's own shadow, sat on the filmic curve's toe at a few code values and read as black (627 solid black blocks in D). The pinned contrast and shadow toe (D to E) removed it.

**What remains in the final build (2.50%)**, found by hiding each family and re-rendering the same frame: formations 0.64 points (shakos, the dark pads under blocks; the one solid block is here), labels 0.02, woods 0.00, and 1.79 points of scattered dark ground texels and the vignetted lower edge, with no solid region. Expected detail, not a clipped slope, which is why the black-slope test counts solid 8x8 regions.

**Two findings recorded, not acted on.** (1) Narrowing the landscape hillshade (C to D) did not help this view (7.02% to 7.44%); the pinned contrast and shadow toe did the work. The palette change is kept as accepted, but its benefit is not demonstrated and it should be re-assessed in the lighting pass. (2) The original build's result depends on what came before: 13.63% on a fresh page (row A) but 24.07% after the preceding cases in one page (the before/after table). The Stage 0 build gives the same figure both ways (2.50% and 2.50%). The cause in the original build was not investigated further. Row B is darker than A because the Stage 0 mist fade no longer veils the slopes the original grade clips.

### Tests
Run in the delivering chat, on the delivered build:
- **In-app self-test** (`AUSTERLITZ_DEBUG.selfTest()`, via the harness): 13 of 13 pass.
  - pass: ground: groundY() returns the drawn terrain at its vertices
  - pass: camera: every fixed and computed view is above the ground
  - pass: camera: glides between tour stops, phases, chapters and vantages stay above the ground
  - pass: camera: orbiting at the lowest pitch and closest zoom never enters the ground
  - pass: camera: no path placed the eye below the floor before a frame
  - pass: figures: every visible man, horse and standard stands on the drawn ground
  - pass: first run: the colour key agrees with the legend, and the legend with what is drawn
  - pass: dossiers: elevations are metres through GEOREF, never model units
  - pass: watch mode: a selection is always shown, and clearing it clears the dimming
  - pass: sprites: smoke and dust fade to nothing at every edge
  - pass: mist: no sheet shows where the ground rises through it
  - pass: derived readings unchanged: the plateau at 04:00, both army totals, the movement audit
  - pass: render on demand: a view at rest draws nothing; slow drift alone draws at the ambient rate
- **Visual thresholds** (`tools/visual/check-report.js`) on the 11 cases of the delivered build: all pass, with the one named known residual below
- The same thresholds on the original build: 11 of 11 cases fail (the faults Stage 0 fixes).
- **Data invariance** (`tools/visual/data-invariance.js`): 112 of 112 data declarations byte-identical
- **Edit list** (`tools/stage0/apply-stage0.py --html`): the 73 edits applied to the original build reproduce the delivered build byte for byte (md5 match).
- **Tree port, simulated:** the applier placed all 73 edits in a simulated split tree and the reassembled result matched the delivered md5. Not run against the real tree.
- **Darkness study** (`tools/visual/darkness-study.js`): the table above.

Not run: `sh tools/run-all.sh` and its eight suites (`css-test.js`, `test.js`, `geo-test.js`,
`terrain-test.js`, `audit.js`, `sim-test.js`, `redteam.js`, `runtime-test.js`). The source tree and
tools were not available. The data declarations they exercise are byte-identical, so `geo-test`,
`terrain-test`, `audit`, `sim-test` and `redteam` are expected to pass unchanged; `runtime-test` and
`css-test` exercise the interface and may need updating for the first-run card (new button ids
`fr-watch`; `fr-close` now means Explore), the legend swatches filled by script, and the new elements
`#selchip` and `#devstats`.

### Known residuals
- **hybrid-dimmed:** Walther's and Nansouty's counters (Cavalry Reserve, both dimmed) overlap at the left
  screen edge. The Stage 0 fallback finds no free place; the app reports it (`unresolved` in the label
  statistics) and the harness records it as a named known residual, so any other overlap still fails.
  Evidence for the Stage 2 counter layer.
- **Near-black detail:** shakos, conifers, text halos and poles stay near-black by design; the
  black-slope test counts solid 8x8 regions, not these.
- **Harness speed:** about 45 s per page load and 25 s per case on one CPU with software rendering.

### Deferred (Stage 1 onward)
- Stage 1: the encoding spec (status and claim colours that reuse the side hues; dashed and dotted
  counter frames that mean something else in APP-6; the legend's "approximate position" dash, which only
  counters show).
- Stage 2: the DOM/SVG counter and label layer (replacing the interim placement and its shrink fallback);
  vertical exaggeration as a presentation parameter; land cover without triangle sawtooth; mere outlines
  from a sourced survey; ground-draped arrows derived from the tracks; a true north-up paper map.
- Stage 3: pan and map-style camera controls, one time spine and timeline, mode names, docked panels.
- Stage 4: lighting (replacing the temporary correction above), valley fog, soft-particle smoke, horizon.
- Stage 6: uniforms, headgear and flags, research first. Observations from the audit, not acted on and
  still to be verified: French colours drawn as vertical tricolours (the 1804 pattern is the usual
  reconstruction for 1805); every figure in a shako (French line infantry of 1805 are usually shown in the
  bicorne); the Austrian flag design matches no pattern identified.


## 2026-09 · Correction pass: geographic ground truth, data-model integrity, verified history

**Status: complete and verified.** Published file: `austerlitz-command-map.html`
(1,047,490 bytes, md5 `672aff9f0d1b1673d079903185d39351`), built from this tree by `build.py`.
Every item below is present in the current implementation and covered by the regression
(`sh tools/run-all.sh`). Nothing in this entry is aspirational.

### Final verification

| Suite | Result |
|---|---|
| `css-test.js` | 0 CSS errors, 9/9 behaviour checks |
| `test.js` | 0 errors, 0 warnings, order of battle 41/41 |
| `geo-test.js` (new) | 54 passed, 0 failed |
| `terrain-test.js` | all 13 elevation anchors, ordering, downstream fall, pond edges, land-cover guard, tour stop 5 |
| `audit.js` | 0 march-rate violations, 0 terrain violations |
| `sim-test.js` | 0 errors, 0 warnings; 25 events, 0 disagreements at 1.0 km true; tour stop 4 agrees |
| `redteam.js` | 0 findings, 0 warnings; 37 retired claims, none present |
| `runtime-test.js` | 36 checks OK, 0 errors, 0 warnings; parent/child rendering assertion passes |

Stale-coordinate comparison against the pre-correction tree (`tools/stale-compare.js`):
699 coordinates before, 705 after. 598 moved exactly as the migration warp prescribes, and
92 were re-anchored under 19 documented rules. None is stale and none is unexplained.
9 were removed and 15 added; all are intentional.

### Geography and scale

- **`geo.js` (`GEOREF`): the single geographic reference.** Everything that needs a distance, bearing or height reads from it.
  - **Ground truth:** village centres from the Czech municipality register; summits from PeakVisor DEM data, with official heights where they differ.
  - **Transform:** the legacy map frame is kept as a fitted similarity transform — 31.647 map units per km (0.03160 km per unit), rotated 17.42° from true north. It reproduces the audited positions to within 17 m and inverts exactly.
  - **Old constants retired:** `KM_PER_MAP` 0.01916, `UNITS_PER_KM` 26.1, `0.019`, `0.0191`.
  - **Everything derived from it:**
    - the scale bar, march rates, event tolerances and the location descriptor (true bearings, not map axes);
    - the contour label and the exaggeration statement in the sources (derived: 10.3×, not "roughly fivefold").
- **Migration.** Every coordinate in the data was moved through one rubber-sheet warp, exact at the 19 surveyed places (`tools/warp.js`, `tools/geo-migrate.js`).
  - Where the legacy map was topologically wrong, features were re-anchored by stated rules (`tools/geo-anchor.js`).
  - Pratzen village had been drawn east of the line joining the two summits.
  - The Olmütz highway had run due east through Holubitz.
- **Places.** Every surveyed village now lies within 20 m of ground truth. Hostieradek was added. The Pratzeberg now lies 1.47 km south of Pratzen village.
  - **Off-map places:** Raigern, Rausnitz and Kowalowitz lie beyond the frame; they are no longer drawn inside it, and are shown as edge markers.
  - **Chapel of St Anthony:** added at the northern edge of Augezd (position derived, about 0.6 km north of the village).
  - **Posoritz post house:** added on the highway north of Holubitz (position approximate, about ±1 km).
- **Roads.**
  - **Olmütz highway:** passes the Santon's southern foot (276 m from the summit) and runs through the post house, leaving the frame north-east toward Rausnitz. Holubitz now lies 1.7 km south of it.
  - **Vienna road:** runs west of the frame and is no longer drawn inside it.
  - **Raigern–Telnitz:** a local road via Otmarov.
  - **Pratzen–Austerlitz and Krzenowitz roads:** re-anchored on their end villages.
- **Water.**
  - **Litava:** rerouted from ground truth: the southern edge of Slavkov, past Hostěrádky, through Újezd and Žatčany.
  - **Rakovec:** added through Křenovice. Křenovice lies on the Rakovec, not the Litava.
  - **Goldbach:** now meets the Litava.
- **Compass.** The rose shows true north for the current camera view. It had been fixed at "up".

### Terrain

- **Relief fitted to sourced elevations** (`tools/relief-fit.js`):

  | Place | Model | Sourced |
  |---|---|---|
  | Pratzeberg | 324 m | 324 m |
  | Staré Vinohrady | 294 m | 294 m |
  | Santon | 296 m | 296 m |
  | Žuráň | 290 m | 286–293 m |
  | Tvarožná | 258 m | 257 m |
  | Kobelnitz | 210 m | 211 m |
  | Sokolnitz | 207 m | 207 m |
  | Telnitz | 196 m | 195 m |
  | Pratzen village | 245 m | 245 m |
  | col south of Staré Vinohrady | 272 m | ≈273 m (DEM) |
  | Augezd | 190 m | 195 m |
  | Křenovice | 216 m | 203–216 m |
  | Austerlitz | 227 m | 200–237 m (range only) |

- **Plateau shape.** The legacy plateau put Pratzen village above Staré Vinohrady. The plateau is now a crest arc (Staré Vinohrady → col → Pratzeberg) with the village in its hollow.
- **Goldbach.** Now falls downstream, 210 → 207 → 196 m.
- **Height model.** Height is local relief plus a regional fall. The regional fall is the northward rise and the middle-Litava lowland along the Litava and the Rakovec.
- **Threshold consumers.** The floor, the land-cover thresholds and the reeds still read local relief, as calibrated. The ground tint is expressed in metres.
- **Land-cover classifier.** Now a single shared function (`coverClass`), used by the terrain build and by the tests.
- **Ponds.**
  - Each shoreline is held level.
  - Each water level is derived from the pond's own edge, so no edge of the water can hang above the ground.
- **Contours.** They cover the terrain's real range on the legacy lattice.
- **Eye heights.** Line of sight and the viewshed use real eye heights (3 m observer, 2.5 m formed troops). The old world-unit values amounted to 10–13 m.

### Data model and simulation integrity

- **The leaf rule (`ownStrengthAt`).** A formation's own troops exclude subordinates already on the field, and command-only formations carry none. Every battlefield total uses it.
  - Allied men on the field never exceed 83,120 of 85,400; French never exceed 69,900 of 73,000. The naive sum had been 127,370.
- **Parent formations.**
  - Buxhöwden's Left Wing is a command post, no longer a 40,000-man block.
  - Langeron's block drops Kamensky's battalions once Kamensky detaches.
  - The runtime harness asserts both across 57 moments of the battle.
- **Plateau statistic.** A polygon traced over the real plateau replaces the old ellipse, which took in Blasowitz and Krzenowitz. The statistic reads 38,700 at 04:00; it had read 107,820, more than the entire Allied army.
- **Confidence.** An interpolated position is graded no better than its weaker anchor and labelled "interpolated".
- **Event agreement.** Tested in true distance: 1.0 km by default, as closest approach across each event's window.
  - Three events carry written, capped exceptions: Pratzen village 1.14 km, Blasowitz 1.16 km, the ice 1.33 km.
  - "Organised resistance ends" names no plotted formation.
- **Movement.** The audit is clean.
  - Kollowrat's 5.01 km/h leg was not justified by the evidence. Its 11:15 anchor contradicted its own text; the worst leg is now 2.4 km/h.
  - Four Allied anchors that the warp had pulled into French-held Pratzen village were re-placed by their own texts: the Allied HQ at 09:30, Kamensky at 11:15, and Kollowrat in phases 4 and 5.
  - Inferred routes and timings are marked in the data:
    - Legrand along the west-bank road through Sokolnitz;
    - Przybyszewski holding at Sokolnitz until surrounded;
    - Kamensky retiring east, graded C.
  - Bourcier's route follows his own stated action.

### Order of battle (Duffy 1977 and Smith 1998, unless a range names others)

- **Army totals:** the 139 guns are now the army total (`gqg.army`), not the HQ's. The Allied army total is recorded as about 85,400 men and 278 guns.
- **4th Column:** 13,900, within a sourced range of 12,000–23,900. Miloradovich 4,800–7,000, where he had been an unsourced 10,000.
- **Kollowrat:** FZM, per the Deutsche Biographie (Feldzeugmeister from October 1800).
- **Russian Guard cavalry:** Lt.-Gen. Kologrivov (single source).
- **The Santon:** Claparède, with the 17e Légère and 18 guns, drawn as infantry with an attached battery.
- **Telnitz:** held by Schobert's 3e de Ligne with the Tirailleurs du Pô. Legrand's brigades are Merle, Féry and Levasseur.
- **5th Column:** mixed and mostly Russian, drawn with about 20% Austrian riders.
- **Kamensky:** 4,000–4,500.
- **Cavalry Reserve:** 36 guns, with Nansouty at about 1,600. The grenadier division's unsourced 10 guns are removed.

### Chronology and historical prose

- **Davout and Friant:** at Raigern overnight on 1 December; Friant's leading brigade reaches the Goldbach about 08:00. The march is about 113 km in 40–46 hours (sources vary).
- **Allied HQ:** at Krzenowitz at 04:00. The Tsar reaches the 4th Column about 08:45 (Russian Biographical Dictionary, 1903).
- **Napoleon's command posts:** Žuráň, then Staré Vinohrady (no chapel there), then the chapel of St Anthony above Augezd.
- **Intervals, graded B:** the Russian Guard attack from after 11:00, and the wheel at 13:00–14:00. Blasowitz and Soult's "twenty minutes" are graded B.
- **The eagle:** taken by the Russian Guard cavalry (traditionally the Life Guard Horse Regiment).
- **Kursk:** the "1,600 of 2,000" figure is removed; the event is graded C.
- **Removed or corrected:**
  - "already cut in two" and "within the hour";
  - "perhaps five thousand" at the ponds;
  - Przybyszewski "reduced to the ranks";
  - the "fourth assumption" miscount;
  - "the amber army".
- **Attributions:**
  - Buxhöwden's drunkenness is attributed to Langeron.
  - The Kutuzov dispute is attributed.
  - The 4th Column's delay is given both causes.
- **Naming:** "Francis II (Francis I of Austria)" is used consistently.
- **Visibility claims.** Every "can see" claim is either rewritten or labelled as a model reading; fog is kept as the documented cause of concealment.
- **Tour stops 4 and 5.** Both now quote labelled, derived figures, bound by tests to the live computation.
- **Sources panel.** Now names the order-of-battle sources and derives the exaggeration. It lists the open questions below.

### Testing

- **New suite and scripts:** `geo-test.js`; `tools/run-all.sh` (full regression); `tools/stale-compare.js`.
- **Helpers regenerated from live code.** The test helpers are now regenerated from `app.js` on every run (`tools/mk-helpers.js`), and the world module from `world.js` (`tools/mk-world-mod.js`). The old hand-copied helpers had drifted, so `test.js` had been exercising a stale `posOf`.
- **Test fixes.** `test.js` no longer counts a parent formation with its own children, and it now pins the corrected order of battle.
- **New guards:**
  - retired claims can't return;
  - totals never exceed the armies;
  - no hard-coded legacy scale constant;
  - pond edges;
  - land cover;
  - the downstream fall;
  - the tour figures.
- **Defects found and fixed during the pass:**
  - a name collision (`GEO`) that would have broken the app on load;
  - a planar tilt that made the Litava run uphill;
  - land-cover thresholds reading regional rather than local relief, which put "meadow" at 41% of the field;
  - pond water floating up to 20 m above the ground;
  - a pond hold that dragged Telnitz down;
  - two tint inputs lost in the classifier refactor.

### Open questions (documented in the Sources panel; deliberately not resolved)

1. The pattern of Russian infantry flags.
2. Whether Grenz infantry wore brown in 1805.
3. Whether vines stood at Telnitz and at Staré Vinohrady in 1805; the Telnitz "vineyard bank" text is kept.
4. The upper bound of the Russian Guard's attack.
5. Bagration's exact line at dawn; he is re-plotted on the corrected road, graded B.
6. The exact position of the Posoritz post house (±1 km).
7. The true position of Turas; it keeps its warped legacy place.
8. Kologrivov's command, which rests on one source.
9. The stream beds are not downhill at every point (reverse gradients of up to about 10 m within a reach).
10. **Chapel sightline.** From the chapel of St Anthony the model shows little of the Satschan pond: 0% of the pond bed, and 7% of the ice surface at the model's water level. A source records Napoleon watching the end from there. This is left as a documented model/source mismatch: the chapel's position is approximate and the relief stylised, and the battlefield was not reshaped to fit.

### Deliberately not changed in this pass

Uniform, headgear and flag rendering; the Kobelnitz pond, whose outline is unverified; and any
visual redesign. Those belong to the next phase.
