# Stage 7 Part A: the text inventory

`node tools/stage7/text-inventory.js` (no page). Reading times at 160, 200, 238 words a minute: design values, not findings.

## Who reads what

- `guard`: check:data (tools/visual/data-invariance.js): the declaration byte-identical to archive/stage6b-7fc0f6c3.html
- `redteam`: redteam.js section 6: overclaim scan (no certainty words; causal language warned) and section 6b: the 37 retired phrases absent
- `chron`: check:chronology (tools/stage2/chronology.js): its clock times read as timed statements and audited against the engine
- `testMoment`: test.js: the moment resolves to a phase or an event, the clock on the day, the chapter exists, only stop 4 keeps its own clock
- `spine`: the self-test's spine checks (app.js): every theme and stop resolves to its moments; stop 7 follows its theme
- `runtime`: runtime-test.js: every stop applied forward and back, and the tour finished
- `sim4`: sim-test.js 2b: stop 4's two figures (about 39,000 and about 19,000) recomputed from the plateau reading, within 600
- `terr5`: terrain-test.js: stop 5's two shares (about 73 per cent, under 3 per cent) recomputed from the viewshed
- `fr108`: the self-test's first-run check (app.js, decision 108): four phrases pinned, the swatches the drawing colours, no coat named as a nation's
- `test105`: test.js (decision 105): SOURCE_NOTE's open questions kept while the appearance table does not settle them
- `sim3`: sim-test.js 3: the acts cover every phase, contiguously and in order (the act's phases, not its line)

## Every row

| kind | id | file:line | words | s at 200 | times | figures | read by |
|---|---|---|---|---|---|---|---|
| tour stop | 1 The battlefield | analysis.js:351 | 56 | 16.8 | - | Ten | guard, redteam, chron, testMoment, spine, runtime |
| tour stop | 2 The Allied plan | analysis.js:353 | 46 | 13.8 | - | four; five | guard, redteam, chron, testMoment, spine, runtime |
| tour stop | 3 The French deception | analysis.js:355 | 37 | 11.1 | - | five | guard, redteam, chron, testMoment, spine, runtime |
| tour stop | 4 The Allied advance | analysis.js:357 | 62 | 18.6 | seven o'clock; 04:00; 07:15 | 39,000; 19,000; seven | guard, redteam, chron, testMoment, spine, runtime, sim4 |
| tour stop | 5 Why the Pratzen matters | analysis.js:359 | 72 | 21.6 | - | 73; 3 | guard, redteam, chron, testMoment, spine, runtime, terr5 |
| tour stop | 6 The French strike | analysis.js:361 | 34 | 10.2 | a quarter to nine | nine; Two | guard, redteam, chron, testMoment, spine, runtime |
| tour stop | 7 The army divided | analysis.js:363 | 37 | 11.1 | about noon | two; forty; thousand | guard, redteam, chron, testMoment, spine, runtime |
| tour stop | 8 The collapse | analysis.js:365 | 41 | 12.3 | - | ninety | guard, redteam, chron, testMoment, spine, runtime |
| tour stop | 9 What it cost | analysis.js:367 | 70 | 21 | - | fifteen; sixteen; thousand; twelve; thousand; hundred; eighty; nine; thousand; two | guard, redteam, chron, testMoment, spine, runtime |
| theme | plan The Allied plan | analysis.js:15 | 62 | 18.6 | - | 60,000; four; five; two | guard, redteam, chron, testMoment, spine |
| theme | deception The French deception | analysis.js:20 | 60 | 18 | - | - | guard, redteam, chron, testMoment, spine |
| theme | weakness The apparent weakness on the right | analysis.js:25 | 69 | 20.7 | - | 4,300; 40,000; five | guard, redteam, chron, testMoment, spine |
| theme | commitment The commitment of the Allied left | analysis.js:30 | 57 | 17.1 | 07:00; 09:00 | three; four | guard, redteam, chron, testMoment, spine |
| theme | pratzen The attack on the Pratzen | analysis.js:35 | 89 | 26.7 | 08:45; 11:00 | two; two | guard, redteam, chron, testMoment, spine |
| theme | cut The cutting of the Allied army | analysis.js:40 | 63 | 18.9 | about noon | 40,000; two | guard, redteam, chron, testMoment, spine |
| theme | guard The Russian Guard counterattack | analysis.js:45 | 64 | 19.2 | - | two | guard, redteam, chron, testMoment, spine |
| theme | north Lannes, Murat and Bagration | analysis.js:50 | 64 | 19.2 | 11:15 | - | guard, redteam, chron, testMoment, spine |
| theme | wheel The French wheel | analysis.js:55 | 53 | 15.9 | 13:00; 14:00 | ninety | guard, redteam, chron, testMoment, spine |
| theme | collapse The destruction of the Allied left | analysis.js:60 | 69 | 20.7 | - | two; twenty; thousand; thirty; eight; hundred; thirty; two | guard, redteam, chron, testMoment, spine |
| phase lede | 0 Dispositions in the dark | data.js:52 | 66 | 19.8 | - | four; five; two | guard, redteam, chron |
| phase timeline line | 0 c. 01:00 | data.js:54 | 11 | 3.3 | - | - | guard, chron |
| phase timeline line | 0 c. 04:00 | data.js:55 | 24 | 7.2 | - | - | guard, chron |
| phase timeline line | 0 c. 06:00 | data.js:56 | 13 | 3.9 | - | - | guard, chron |
| phase lede | 1 The Allied left opens the battle | data.js:60 | 45 | 13.5 | - | - | guard, redteam, chron |
| phase timeline line | 1 c. 07:00 | data.js:62 | 15 | 4.5 | - | - | guard, chron |
| phase timeline line | 1 c. 07:30 | data.js:63 | 8 | 2.4 | - | - | guard, chron |
| phase timeline line | 1 c. 08:00 | data.js:64 | 27 | 8.1 | - | 113 | guard, chron |
| phase lede | 2 Sokolnitz, the castle and the pheasantry | data.js:68 | 63 | 18.9 | - | - | guard, redteam, chron |
| phase timeline line | 2 c. 08:00 | data.js:70 | 10 | 3 | - | - | guard, chron |
| phase timeline line | 2 c. 08:30 | data.js:71 | 11 | 3.3 | - | - | guard, chron |
| phase timeline line | 2 c. 08:30 | data.js:72 | 23 | 6.9 | - | Twenty | guard, chron |
| phase lede | 3 Soult storms the heights | data.js:76 | 68 | 20.4 | 11:00 | - | guard, redteam, chron |
| phase timeline line | 3 c. 08:45 | data.js:78 | 9 | 2.7 | - | - | guard, chron |
| phase timeline line | 3 c. 09:00 | data.js:79 | 13 | 3.9 | - | - | guard, chron |
| phase timeline line | 3 c. 09:15 | data.js:80 | 15 | 4.5 | - | - | guard, chron |
| phase lede | 4 The crisis on the Pratzeberg | data.js:84 | 58 | 17.4 | - | - | guard, redteam, chron |
| phase timeline line | 4 c. 09:30 | data.js:86 | 14 | 4.2 | - | two | guard, chron |
| phase timeline line | 4 c. 09:45 | data.js:87 | 13 | 3.9 | - | - | guard, chron |
| phase timeline line | 4 c. 10:15 | data.js:88 | 13 | 3.9 | - | - | guard, chron |
| phase timeline line | 4 c. 10:30 | data.js:89 | 23 | 6.9 | - | - | guard, chron |
| phase lede | 5 The northern battle decided | data.js:93 | 58 | 17.4 | - | - | guard, redteam, chron |
| phase timeline line | 5 c. 10:40 | data.js:95 | 14 | 4.2 | - | - | guard, chron |
| phase timeline line | 5 c. 11:00 | data.js:96 | 7 | 2.1 | - | - | guard, chron |
| phase timeline line | 5 c. 11:15 | data.js:97 | 11 | 3.3 | - | - | guard, chron |
| phase lede | 6 The Russian Guard at Stare Vinohrady | data.js:101 | 71 | 21.3 | - | two | guard, redteam, chron |
| phase timeline line | 6 after 11:00 | data.js:103 | 16 | 4.8 | - | - | guard, chron |
| phase timeline line | 6 c. 11:45 | data.js:104 | 12 | 3.6 | - | - | guard, chron |
| phase timeline line | 6 c. 12:00 | data.js:105 | 9 | 2.7 | - | - | guard, chron |
| phase timeline line | 6 c. 12:00 | data.js:106 | 13 | 3.9 | - | - | guard, chron |
| phase timeline line | 6 c. 12:30 | data.js:107 | 10 | 3 | - | - | guard, chron |
| phase lede | 7 The centre turns south | data.js:111 | 58 | 17.4 | - | ninety; three | guard, redteam, chron |
| phase timeline line | 7 c. 13:00-14:00 | data.js:113 | 11 | 3.3 | - | - | guard, chron |
| phase timeline line | 7 c. 14:00 | data.js:114 | 10 | 3 | - | - | guard, chron |
| phase lede | 8 Augezd, the ponds and the ice | data.js:118 | 75 | 22.5 | - | twenty; thousand; thirty; eight; hundred; thirty; two | guard, redteam, chron |
| phase timeline line | 8 c. 14:30 | data.js:120 | 11 | 3.3 | - | - | guard, chron |
| phase timeline line | 8 c. 15:00 | data.js:121 | 10 | 3 | - | - | guard, chron |
| phase timeline line | 8 c. 16:30 | data.js:122 | 11 | 3.3 | - | - | guard, chron |
| phase lede | 9 The reckoning | data.js:126 | 65 | 19.5 | - | 15,000; 16,000; 12,000; 180; 1,300; 7,000; 600; 1806 | guard, redteam, chron |
| phase timeline line | 9 2 Dec | data.js:128 | 12 | 3.6 | - | - | guard, chron |
| phase timeline line | 9 26 Dec | data.js:129 | 11 | 3.3 | - | - | guard, chron |
| phase timeline line | 9 6 Aug 1806 | data.js:130 | 7 | 2.1 | - | - | guard, chron |
| act line | deception The Deception | analysis.js:222 | 17 | 5.1 | - | - | guard, sim3 |
| act line | advance The Allied Advance | analysis.js:224 | 17 | 5.1 | - | Four | guard, sim3 |
| act line | strike The Pratzen Strike | analysis.js:226 | 20 | 6 | - | - | guard, sim3 |
| act line | divided The Army Divided | analysis.js:228 | 21 | 6.3 | - | two | guard, sim3 |
| act line | collapse The Collapse | analysis.js:230 | 17 | 5.1 | - | - | guard, sim3 |
| event why | columns-move The Allied columns begin to leave the plateau | analysis.js:242 | 16 | 4.8 | - | - | guard, redteam, chron |
| event why | counter-march Liechtenstein counter-marches across the 4th Column | analysis.js:246 | 39 | 11.7 | - | two | guard, redteam, chron |
| event why | telnitz Kienmayer attacks Telnitz | analysis.js:250 | 14 | 4.2 | - | - | guard, redteam, chron |
| event why | raigern Friant's division at Raigern since the night | analysis.js:254 | 31 | 9.3 | - | 113 | guard, redteam, chron |
| event why | davout Friant's leading brigade reaches the Goldbach | analysis.js:257 | 14 | 4.2 | 08:00 | - | guard, redteam, chron |
| event why | sokolnitz Langeron and Przybyszewski attack Sokolnitz | analysis.js:261 | 21 | 6.3 | - | two | guard, redteam, chron |
| event why | telnitz-retaken Friant retakes Telnitz, then withdraws behind the stream | analysis.js:265 | 20 | 6 | - | - | guard, redteam, chron |
| event why | decision Napoleon releases Soult against the heights | analysis.js:269 | 39 | 11.7 | - | twenty | guard, redteam, chron |
| event why | soult Saint-Hilaire and Vandamme climb the slope | analysis.js:273 | 21 | 6.3 | - | Two | guard, redteam, chron |
| event why | pratzen-village Thiebault's brigade clears Pratzen village | analysis.js:277 | 17 | 5.1 | - | - | guard, redteam, chron |
| event why | face-about Kutuzov orders the 4th Column to face about | analysis.js:281 | 15 | 4.5 | - | - | guard, redteam, chron |
| event why | kamensky Kamensky turns his brigade about and drives the French off the crest | analysis.js:285 | 18 | 5.4 | - | - | guard, redteam, chron |
| event why | kursk Langeron's reinforcements arrive as the crest is lost | analysis.js:289 | 30 | 9 | - | two | guard, redteam, chron |
| event why | pratzeberg The Pratzeberg is firmly in French hands | analysis.js:293 | 28 | 8.4 | - | - | guard, redteam, chron |
| event why | blasowitz Blasowitz falls and Bagration is levered off the army | analysis.js:297 | 15 | 4.5 | - | - | guard, redteam, chron |
| event why | guard-attack The Russian Guard takes the eagle of the 4th Line | analysis.js:301 | 12 | 3.6 | - | - | guard, redteam, chron |
| event why | guard-broken Rapp's counter-charge breaks the Chevalier Guard | analysis.js:305 | 15 | 4.5 | - | - | guard, redteam, chron |
| event why | hq-forward Napoleon moves forward to Stare Vinohrady | analysis.js:309 | 40 | 12 | - | - | guard, redteam, chron |
| event why | buxhowden-blind Buxhowden does not yet know the centre is gone | analysis.js:313 | 20 | 6 | about noon | Three | guard, redteam, chron |
| event why | davout-resumes Davout resumes the offensive | analysis.js:317 | 14 | 4.2 | - | - | guard, redteam, chron |
| event why | wheel The French centre turns south | analysis.js:321 | 12 | 3.6 | - | Ninety; three | guard, redteam, chron |
| event why | sokolnitz-falls Sokolnitz falls; Przybyszewski's column is surrounded | analysis.js:325 | 14 | 4.2 | - | - | guard, redteam, chron |
| event why | augezd Vandamme takes the height above the Augezd defile | analysis.js:329 | 14 | 4.2 | - | - | guard, redteam, chron |
| event why | ice French artillery fires on the ice of the Satschan mere | analysis.js:60 | 29 | 8.7 | - | twenty; thousand; thirty; eight; hundred; thirty; two | guard, redteam, chron |
| event why | end Organised resistance ends | analysis.js:337 | 19 | 5.7 | - | - | guard, redteam, chron |
| SOURCE_NOTE body | 1 | data.js:759 | 51 | 15.3 | - | - | guard |
| SOURCE_NOTE body | 2 | data.js:760 | 43 | 12.9 | - | - | guard |
| SOURCE_NOTE body | 3 | data.js:761 | 47 | 14.1 | - | 7,750; 14,200 | guard |
| SOURCE_NOTE body | 4 | data.js:762 | 104 | 31.2 | - | 115; 2.5; 1.2; 4.8; four | guard |
| SOURCE_NOTE body | 5 | data.js:763 | 53 | 15.9 | - | - | guard |
| SOURCE_NOTE body | 6 | data.js:764 | 279 | 83.7 | 07:30; 07:00; 04:00; 09:45; 08:45; 11:45; 11:15 | 1805; 1805; 1977; 1998; three; three; Two | guard, test105 |
| SOURCE_NOTE body | 7 | data.js:765 | 112 | 33.6 | - | Two | guard |
| first-run key | the card's key | app.js:5261 | 41 | 12.3 | - | - | fr108 |
| first-run hint | the card's hint | shell.html:313 | 26 | 7.8 | - | - |  |

## The tour's subsets

| stops | words | s at 160 | s at 200 | s at 238 |
|---|---|---|---|---|
| all nine | 455 | 170.6 | 136.5 | 114.7 |
| 1, 6, 7 | 127 | 47.6 | 38.1 | 32 |
| 1, 6, 7, 8 | 168 | 63 | 50.4 | 42.4 |
| 1, 4, 6, 7, 8 | 230 | 86.3 | 69 | 58 |
| 1, 3, 6, 7 | 164 | 61.5 | 49.2 | 41.3 |

Retired phrases found in any row: 0; overclaim words: 
