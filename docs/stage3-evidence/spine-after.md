# The day's structures today (tools/stage3/spine.js)

Counts: phases 10, phaseLines 32, acts 5, events 25, chapters 10, tour 9.

| phase | act | window | label / title | EVENTS starting in it | running into it | its timeline lines | chapters | tour stops |
|---|---|---|---|---|---|---|---|---|
| 0 | deception | 04:00-07:00 | Deployment / Dispositions in the dark | columns-move 04:00-07:00; counter-march 04:15-08:00; raigern 04:00-04:45 | - | c. 01:00; c. 04:00; c. 06:00 | plan 04:00; deception 04:00 | 1 04:00; 2 04:00; 3 04:00 |
| 1 | advance | 07:00-08:00 | Telnitz / The Allied left opens the battle | telnitz 07:00; davout 07:45-08:15 | counter-march | c. 07:00; c. 07:30; c. 08:00 | weakness 07:00; commitment 07:00 | 4 07:25 |
| 2 | advance | 08:00-08:45 | Sokolnitz / Sokolnitz, the castle and the pheasantry | sokolnitz 08:00; telnitz-retaken 08:30; decision 08:25-08:45 | davout | c. 08:00; c. 08:30; c. 08:30 | - | 5 08:00 |
| 3 | strike | 08:45-09:30 | The Pratzen / Soult storms the heights | soult 08:45-09:15; pratzen-village 09:00; face-about 09:15 | - | c. 08:45; c. 09:00; c. 09:15 | pratzen 08:45 | 6 08:45 |
| 4 | strike | 09:30-10:30 | Pratzeberg / The crisis on the Pratzeberg | kamensky 09:45 | - | c. 09:30; c. 09:45; c. 10:15; c. 10:30 | - | - |
| 5 | divided | 10:30-11:15 | Olmutz road / The northern battle decided | kursk 10:30; pratzeberg 11:00; guard-attack 11:00-13:00 | - | c. 10:40; c. 11:00; c. 11:15 | cut 11:00; north 10:30 | 7 11:00 |
| 6 | divided | 11:15-12:45 | The Guard / The Russian Guard at Stare Vinohrady | blasowitz 11:15; guard-broken 11:15-13:15; hq-forward 12:00-12:40; buxhowden-blind 11:40-12:40; davout-resumes 12:30 | guard-attack | after 11:00; c. 11:45; c. 12:00; c. 12:00; c. 12:30 | guard 11:15 | - |
| 7 | collapse | 12:45-14:30 | The wheel / The centre turns south | wheel 13:00-14:00; sokolnitz-falls 14:00 | guard-attack, guard-broken | c. 13:00-14:00; c. 14:00 | wheel 13:00 | - |
| 8 | collapse | 14:30-17:00 | The ponds / Augezd, the ponds and the ice | augezd 14:30; ice 15:00; end 16:30 | - | c. 14:30; c. 15:00; c. 16:30 | collapse 14:30 | 8 14:30 |
| 9 | collapse | 17:00-18:00 | Reckoning / The reckoning | - | - | 2 Dec; 26 Dec; 6 Aug 1806 | - | 9 17:00 |

## Where they disagree or do not line up

**tour-cam-own**

- TOUR[1] (stop 2, "The Allied plan"): camera is its own (no phase's), clock 04:00 in phase 0
- TOUR[2] (stop 3, "The French deception"): camera is its own (no phase's), clock 04:00 in phase 0

**tour-clock**

- TOUR[3] (stop 4, "The Allied advance"): stop clock 07:25 (phase 1) but its chapter "commitment" sets 07:00 (phase 1)

**tour-text-time**

- TOUR[3] (stop 4, "The Allied advance"): text says 04:00 (phase 0); shown at 07:25 (phase 1)
- TOUR[6] (stop 7, "The army divided"): text says noon (phase 6); shown at 11:00 (phase 5)

**tour-cam-phase**

- TOUR[4] (stop 5, "Why the Pratzen matters"): camera is phase 3's (The Pratzen), clock 08:00 is in phase 2 (Sokolnitz)
- TOUR[6] (stop 7, "The army divided"): camera is phase 4's (Pratzeberg), clock 11:00 is in phase 5 (Olmutz road)

**chapter-cam-own**

- ANALYSIS "plan" ("The Allied plan"): camera is its own, clock 04:00 in phase 0
- ANALYSIS "deception" ("The French deception"): camera is its own, clock 04:00 in phase 0
- ANALYSIS "weakness" ("The apparent weakness on the right"): camera is its own, clock 07:00 in phase 1

**chapter-text-time**

- ANALYSIS "commitment" ("The commitment of the Allied left"): text says 09:00 (phase 3); set at 07:00 (phase 1)
- ANALYSIS "pratzen" ("The attack on the Pratzen"): text says 11:00 (phase 5); set at 08:45 (phase 3)
- ANALYSIS "cut" ("The cutting of the Allied army"): text says noon (phase 6); set at 11:00 (phase 5)
- ANALYSIS "north" ("Lannes, Murat and Bagration"): text says 11:15 (phase 6); set at 10:30 (phase 5)

**chapter-cam-phase**

- ANALYSIS "cut" ("The cutting of the Allied army"): camera is phase 4's (Pratzeberg), clock 11:00 is in phase 5 (Olmutz road)

**event-crosses-act**

- EVENTS "counter-march": 04:15-08:00: phases 0-1, acts deception / advance
- EVENTS "guard-attack": 11:00-13:00: phases 5-7, acts divided / collapse
- EVENTS "guard-broken": 11:15-13:15: phases 6-7, acts divided / collapse

**event-crosses-phase**

- EVENTS "davout": 07:45-08:15: phases 1-2

**phase-line-outside**

- PHASES[0] timeline: c. 01:00 is outside 04:00-07:00: "Weyrother reads the dispositions at Allied headquarters, Krzenowitz. K..."
- PHASES[6] timeline: after 11:00 is outside 11:15-12:45: "The Russian Guard attacks Vandamme; the 4th Line loses its eagle. The ..."

**phase-lede-outside**

- PHASES[3] lede: states 11:00, outside 08:45-09:30

**event-vs-line**

- counter-march: event 04:15-08:00, phase 0 "c. 04:00" at 04:00 (15 min apart; shared: Liechtenstein)

## EVENTS and phase timeline lines (heuristic match: a shared proper name, times within 30 min)

| event | its time | line | line time | apart (min) | shared names |
|---|---|---|---|---:|---|
| counter-march | 04:15-08:00 | phase 0 "c. 04:00" | 04:00 | 15 | Liechtenstein |
| telnitz | 07:00 | phase 1 "c. 07:00" | 07:00 | 0 | Kienmayer, Telnitz |
| davout | 07:45-08:15 | phase 1 "c. 08:00" | 08:00 | 0 | Friant, Goldbach, Telnitz |
| sokolnitz | 08:00 | phase 2 "c. 08:00" | 08:00 | 0 | Langeron, Przybyszewski, Sokolnitz |
| telnitz-retaken | 08:30 | phase 2 "c. 08:30" | 08:30 | 0 | Friant, Telnitz |
| decision | 08:25-08:45 | phase 2 "c. 08:30" | 08:30 | 0 | Napoleon, Soult |
| pratzen-village | 09:00 | phase 3 "c. 09:00" | 09:00 | 0 | Thiebault, Pratzen, Pratzeberg |
| face-about | 09:15 | phase 3 "c. 09:15" | 09:15 | 0 | Kutuzov |
| kamensky | 09:45 | phase 4 "c. 09:45" | 09:45 | 0 | Kamensky |
| kursk | 10:30 | phase 4 "c. 10:30" | 10:30 | 0 | Langeron |
| pratzeberg | 11:00 | phase 5 "c. 11:00" | 11:00 | 0 | Pratzeberg |
| blasowitz | 11:15 | phase 5 "c. 11:15" | 11:15 | 0 | Blasowitz, Bagration, Rausnitz |
| guard-attack | 11:00-13:00 | phase 6 "after 11:00" | 11:00 | 0 | Line |
| guard-broken | 11:15-13:15 | phase 6 "c. 11:45" | 11:45 | 0 | Rapp, Chevalier, Prince, Repnin |
| hq-forward | 12:00-12:40 | phase 6 "c. 12:00" | 12:00 | 0 | Napoleon, Stare, Vinohrady |
| buxhowden-blind | 11:40-12:40 | phase 6 "c. 12:00" | 12:00 | 0 | Buxhowden |
| davout-resumes | 12:30 | phase 6 "c. 12:30" | 12:30 | 0 | Davout, Langeron, Sokolnitz |
| sokolnitz-falls | 14:00 | phase 7 "c. 14:00" | 14:00 | 0 | Sokolnitz, Przybyszewski |
| augezd | 14:30 | phase 8 "c. 14:30" | 14:30 | 0 | Vandamme, Augezd |
| ice | 15:00 | phase 8 "c. 15:00" | 15:00 | 0 | Satschan |
| end | 16:30 | phase 8 "c. 16:30" | 16:30 | 0 | Organised, Bagration, Rausnitz, Austerlitz |

EVENTS with no timeline line: columns-move, raigern, soult, wheel.

Timeline lines with no EVENT:

- phase 0 "c. 01:00" Weyrother reads the dispositions at Allied headquarters, Krz
- phase 0 "c. 06:00" Napoleon takes post on the Zuran mound with Berthier and the
- phase 1 "c. 07:30" Dokhturov's I Column begins descending toward the Goldbach.
- phase 3 "c. 08:45" Soult's divisions advance. The mist lifts off the heights.
- phase 4 "c. 09:30" Lannes advances along the highway. Bagration counter-attacks
- phase 4 "c. 10:15" Jurczek's Austrians attack the Pratzeberg; French and Austri
- phase 5 "c. 10:40" The cavalry collision west of Blasowitz. Kellermann falls ba
- phase 7 "c. 13:00-14:00" Soult and Davout launch the converging assault on the Allied
- phase 9 "2 Dec" Allied army effectively destroyed as a field force; Russia b
- phase 9 "26 Dec" Treaty of Pressburg: Austria cedes Venetia, Istria, Dalmatia
- phase 9 "6 Aug 1806" Francis II abdicates as Holy Roman Emperor.
