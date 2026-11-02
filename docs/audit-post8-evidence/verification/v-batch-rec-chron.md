# Verification: records #0-#7 and sources-chronology #0-#2 (v-batch-rec-chron)

Build: `austerlitz-command-map.html`, 2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83` (checked). The tree is HEAD `df67fdd`, whose
application files are identical to origin/main `43e3e5b`. No application file, data, threshold, test, archive or build was changed. No browser
was run: every finding could be decided from code, data, records, the page images and the saved text layers.

Scripts: `tools/audit-post8/verification/v-batch-rec-chron/` (`selftest-gzip.js`, `README.txt`). Re-runs: `node tools/audit-post8/records/claims-count.js`,
`node tools/audit/size.js`. Fetches: the Pages root and the map, with curl, on 2 Nov 2026, saved in the scratchpad (not committed).

| finding | verdict | severity / priority | correction |
|---|---|---|---|
| records #0 README's checks wrong, "self-contained" | CONFIRMED | S3 / P2 | "self-contained" is CLAUDE.md:3's own term: the fault is the missing cdnjs qualifier |
| records #1 Pages root is the developer README | WEAKENED | S4 / P3 | optional-improvement: the site exists for decision 217's device runs |
| records #2 merged PRs recorded as drafts | CONFIRMED | S3 / P2 | wider in CHANGELOG (#58, #59, #60, #64 too); ROADMAP:548 does record #74-#76; origin mixed |
| records #3 CLAUDE.md counts and heading | CONFIRMED | S4 / P4 | none |
| records #4 G-3 never taken up | CONFIRMED | S4 / P3 | none |
| records #5 the checklist misstates three items | WEAKENED | S4 / P4 | two of three; Caffarelli's is an overstatement; the 4,033 ms item is stated with its limit |
| records #6 attestations without results | WEAKENED | S3 / P3 | already labelled; the residue is untested (no screen reader on 8H's A-6 tree) |
| records #7 decision 140's premise moved | CONFIRMED | S4 / P4 | compressed: +184,127 bytes, 15.2% of the transfer |
| sources-chronology #0 Buxhowden's letter missing | CONFIRMED | S4 / P3 | none (second-hand and partisan: it weights the side, it does not settle) |
| sources-chronology #1 the climb labelled Fact | CONFIRMED | S3 / P2 | none; a fourth instance of history #5, not a duplicate |
| sources-chronology #2 face-about "no account read gives" | CONFIRMED | S3 / P2 | Schönhals contradicts it alone; Stutterheim is a competing side |

## records #0: CONFIRMED

Method: I read README.md and checked each count against the live files.
- README.md:28 names `archive/step5c-45f8f662.html`, but package.json:9 compares against `archive/stage8k-f10fe585.html`.
- README.md:30 gives "35 interface states" and "the six start-up cases". `docs/audit-post8-evidence/checks/check-contrast.txt`:7 says "states 45 (10 at
  390 x 844 as a phone)" and :16 says "boot cases: 8 of 8 pass". `tools/visual/boot-check.js` EXPECT has 8 keys (no-three, sri, no-webgl, error, slow,
  context-loss, context-depth, context-gait).
- README.md:31 gives "242 checks", but `selftest-manifest.json` has count 317 and 317 names. README.md:32 gives "30 fixed views", but `cases.js` has 39.
- README.md:27 says audit.js's continuity and coverage are "printed only", but audit.js:64 sets `process.exitCode=1` (it has asserted since step 5,
  CHANGELOG.md:1936).
- README's times (about 15 and about 100 minutes) do not match CLAUDE.md's 21-43 and 169-250 minutes on CI. checks.yml:5 says "each about 8-15 minutes"
  for a job whose limit is 60 minutes (checks.yml:47).
- README.md last changed at `15b2dcc` (21 Oct 2026, decision 214). It went stale with PR #60 (the phone cases) and again with Stage 8, so the mixed
  origin is right.
- On line 4: CLAUDE.md:3 calls the product "one self-contained HTML (three.js r128 from cdnjs)", and package.json:4 uses the same phrase. The
  README is missing the qualifier; the word itself is not wrong.

## records #1: WEAKENED (optional-improvement, S4, P3, inherited)

Method: I fetched the root with curl.
- It returns HTTP 200, last-modified 1 Nov 10:57:40 GMT. The body's md5 is `23b523bb...`, identical to `records/pages-root.html`. Its only link is to
  the site itself, and the tree has no `index.html`.
- The map at `/austerlitz-command-map.html` is served correctly: 2,810,630 bytes, md5 `f10fe585`.
- Premise: the Pages site was set up for the device runs, not for visitors. See STEP6_SPEC.md:200-210 and decision 217 (ROADMAP.md:309: "GitHub Pages
  (all public) ... the owner's choice"). No decision or spec makes the root a visitor's entry.
- The facts hold. Adding a link and a visitor paragraph is an improvement, not the fix of a defect.

## records #2: CONFIRMED (scope corrected)

Method: I read the cited lines, ran `git log --merges origin/main`, and grepped every CHANGELOG `**Status` head.
- CHANGELOG.md:5, :18 and :39-40 (#79), :58 (#78) and :86 (#77) say draft or not merged. ROADMAP.md:510 (#73) and :548 (#77) say not merged.
- CLAUDE.md:734 and :738 record #77 and #78 as merged, while CLAUDE.md:744 says "Draft PR #79".
- The merges: `43e3e5b` #79, `c2adefe` #78, `141f890` #77, `b7fb67a` #73.
- Wider than the finding says: four older CHANGELOG heads are also stale. They are :1698 (PR #58, merged `7437dcc`), :1650 (#59, `a107472`), :1574
  (#60, `a8afeec`) and :1339 (#64, `d86835e`). R-2 therefore recurred from #58, before Stage 8.
- Narrower than the finding says: ROADMAP.md:548 records #74's merge into main (`72c7e1b`) and #75/#76 into their stacked branches. It lacks #73, #77,
  #78 and #79.

## records #3: CONFIRMED

Method: I re-ran `claims-count.js` and read the CLAUDE.md lines.
- The script gives 704 statements: 148 with a claim of their own, 75 by class, 481 unchecked, 0 stale entries.
- CLAUDE.md:24 still says "484 after decision 210 (c), 145". CHANGELOG.md:204 records the change to 481 and 148 at 8K.
- CLAUDE.md:497's heading is "(October 2026)", but the text under it runs to 1 November.

## records #4: CONFIRMED

Method: I read the data and the records, and computed the distance with geo.js's KM_PER_MAP of 0.03160.
- data.js:561 places milo@0 at [325,230], grade A, with the act "near Pratzen village". Pratzen is at [276,243] with radius 11 (world.js:143). That
  puts milo@0 **1.60 km** from the village's centre, about 1.25 km from its edge.
- `id-mentions.json` finds 0 mentions of G-3 in the records. ROADMAP.md:16's step 5 takes G-1, not G-3, and STAGE8_SPEC.md:1327-1339 does not list
  it. The act is "unchecked" (inventory.md:456), and no register reads milo's place at dawn.

## records #5: WEAKENED (S4, P4)

Method: I read the checklist lines in STAGE8_SPEC.md and reused v-batch-his's kienmayer.txt, caffarelli.txt and anchor-pairs.txt.
- **Kienmayer holds.** The checklist calls it an "offset from the corrected brook" (5108, 5405). In fact the act says "west of the Goldbach" while the
  anchor stands 0.901 km east of the brook, and 0.941 km east on Stage 0's brook. The checklist understates it.
- **Caffarelli: wrong, but in the opposite direction.** The checklist gives "2.5-2.9 km" (5110). The build draws 2.13 km at 14:30 and 2.64 km at 17:00
  (bag@8/caff@8 2.13, bag@9/caff@9 2.64). The record overstates the separation; it does not understate it.
- **4,033 ms is not misread.** Section 22.3 says the three counters are "hidden for the whole run, 121 frames" (5307-5308). Section 23.4 carries "4,033 ms,
  and anything longer than the benchmark's runs" (5515-5516). Visibility's 12-28 s are new measurements, not evidence of a misstatement.

## records #6: WEAKENED (untested, S3, P3)

Method: I read the cited records and ran `git log -S'<main' shell.html`.
- Both attestations are already labelled where they are counted as done:
  - CLAUDE.md:589: "recorded complete on the owner's word (decision 175; 14 October 2026; no item results were given, so none is recorded), and step 3 is
    done".
  - ROADMAP.md:156-159 and :196 say no item results were given.
  - sr-session.md:3-7 says the same.
- What remains:
  - No screen-reader result exists for any build.
  - 8H's A-6 commit (`a22edd2`, 29 Oct) added the `<main>` landmark (shell.html:384) and changed the heading levels after the attestation of 14 Oct. The
    script's expected column is the step-3 DOM's (sr-session.md:11).
  - second-reading.md:6-7 still says the human second reading "stays open for the owner", although decision 189 recorded it complete.

## records #7: CONFIRMED (P4)

Method: I re-ran `size.js` and measured the compressed share with my own script.
- `size.js`: AUSTERLITZ_DEBUG is 611,113 bytes, 21.7% of the file; comments are 437,848 bytes (15.6%). That is +277,502 bytes since Stage 8 Part A's
  333,611, and decision 140 was put on 225,445 (12.8%).
- `selftest-gzip.js` (gzip -9): the self-test adds 184,127 bytes to the compressed app, **15.2%** of a 1,210,658-byte compressed page. The desktop
  report transferred 1,219,603 bytes.
- Decision 140's reason still stands (the harness tests the file that ships). Its stated cost has grown 2.7 times. Re-putting it is optional, hence P4.

## sources-chronology #0: CONFIRMED

Method: I read both page images by eye and grepped the registers and narrative.js.
- The p. 262 image says what the finding quotes. Langeron is the subject ("Не должно ли приписать в вину графа Ланжерона ... Не нахожу, как бы оправдать
  его ... графа Каменского 1-го ... послав назад").
- p. 261 shows the letter answers Kutuzov's of "сего января от 16". The text layer's heading reads "№ 250 / 1806 г. января 21. — ПИСЬМО Ф. Ф. БУКСГЕВДЕНА
  М. И. КУТУЗОВУ ... Дубно".
- The registers hold no kutuzov1951 reading of pp. 260-262; the pages read are 226, 230, 241-242, 255-258, 265, 266-267 and 269-270.
- In narrative.js:182-186, the "Langeron sent the brigade" side rests on Schönhals p. 161 alone.
- Weight: Buxhowden was with the 1st Column at Telnitz and blames Langeron. The letter is second-hand for the plateau and partisan, so it adds weight to
  that side without settling the dispute.

## sources-chronology #1: CONFIRMED

Method: I read the event, the claim rule, the anchors' notes and the dossier code, then re-read the saved text layers.
- analysis.js:284-286: the soult event is claim "fact", timing grade C, with no dispute field.
- data.js:20, the rule for "disputed": the hour is disputed when "the accounts read disagree with each other or with this map's timing".
- The map's own anchor notes (data.js:192 and :210) give eight (Ségur), half past eight (Thiébault), and about nine (Stutterheim, Schönhals).
- Ségur's text layer, lines 18151-18153: "les divisions Vandamme et Saint-Hilaire ... apparurent soudainement. Il était huit heures." Stutterheim: "Es war
  ungefähr 9 Uhr". Schönhals: "es mochte 9 Uhr Früh sein".
- The dossier (app.js:8296-8302 and 8328-8329) shows the Fact pill, "Timing C", "Interval", and CLAIM.fact's note.
- No owner decision covers the label. Decision 201 (b) covered only the seven events that question 193 lowered (questions.md:240-251), and soult was not
  among them.
- Inherited: the claim has been "fact" since Stage 0 (checked in the archive builds through stage8k).
- It is not a duplicate of history #5: the event differs and its own text names no dispute. It is a fourth instance of the same class.

## sources-chronology #2: CONFIRMED (one nuance)

Method: I read the Schönhals page image by eye, then the register entries and the data.
- The p. 162 image: "Kutusow befahl den österreichischen Brigaden Jurschek und Rottermund, die Höhe zu nehmen."
- Those brigades are the IV Column's Austrian wing (data.js:569-571).
- The project registered this sentence (readings.md:292-302, C1.20). It also registered Stutterheim's "Kollowrath erhielt Befehl" (C2.18, :801-808).
- Yet data.js:80 says "which no account read gives". The why's claim is "interpretation", with the note "No account read has Kutuzov order the 4th Column to
  face about" (narrative.js:42). The wording dates from step 5c; the claim has been "fact" since Stage 0.
- Nuance: Schönhals alone contradicts the statement. Stutterheim pp. 63-64 gives the Emperor's order and an unnamed order to Kollowrath: a competing side
  on who gave the order, not a contradiction of "no account gives Kutuzov's order".
- It is related to history #2 and changes that finding's remedy from "recon" to "disputed" with sides. It is not a duplicate.

## Extra issues

1. Four more CHANGELOG status heads record merged PRs as drafts or "for review": #58 (:1698), #59 (:1650), #60 (:1574) and #64 (:1339). S4; it widens
   records #2.
2. second-reading.md:6-7 says the human second reading "stays open", against decision 189 (ROADMAP.md:196). S4; it is part of records #6's residue.

## Not checked

- Stutterheim pp. 63-64 on the page image (I used the text layer and register C2.18).
- CI durations from CI logs.
- Where the records' 2.5-2.9 km for Caffarelli came from.
- The 1844 Russian edition of Mikhailovsky-Danilevsky, and the modern copyrighted works.
