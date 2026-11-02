# Visibility of formation counters and names over long playback (final audit after Stage 8)

Area "visibility" of the final audit after Stage 8. Build `austerlitz-command-map.html`, 2,810,630 bytes, md5 `f10fe585c46aea576f436ed51ac46f83`
(the audited build; every run's record names the md5 it measured). Browser: Chromium 141.0.7390.37 headless shell (CI's pin), SwiftShader
(software WebGL). No application source, data, threshold, test, archive or build was changed; the scripts are under
`tools/audit-post8/visibility/`, the evidence here.

This area was begun by an earlier agent that a usage limit interrupted before it wrote this README or `result.json`. Its scripts and its 17
driver runs were kept and reused unchanged (their records carry their own timestamps, 01:12-02:06 UTC); this session (05:37-06:35 UTC) repaired
the real-time script, completed the runs that were missing, extended the analysis and wrote the record. What each session did is listed under
"Provenance" below.

## The question

The carried item (`docs/STAGE8_SPEC.md` sections 22.3, 23.2 "What it does not show", 23.4; `tools/visual/thresholds.js:251-269`): decision 267
(a) accepted the motion benchmark's totals, but "Play's longest hidden formation in the Landscape-with-counters view at 09:00, 4,033 ms
(Nansouty's Cuirassiers', Walther's Dragoons' and Miloradovich's counters, dropped at rest there ...), and the counters' visibility over longer
playback than the benchmark's 90 frames, stay on the final audit checklist". Asked here: over longer, meaningful playback, how visible are the
formation counters and names; are the highest-priority items always drawn; which formations are starved and for how long; does the 90-frame
benchmark represent longer playback; is real time consistent with the driver; what does a visitor following the battle lose.

## Verdict

- **The benchmark's 4,033 ms is the length of its own window, not the length of the gap.** The benchmark measures 121 frames (1 at rest, 90
  playing, 30 at rest; 28 formations x 121 = its 3,388 formation-frames). Nansouty, Walther and Miloradovich were hidden in all 121, so 4,033 ms
  is the most it can report. Over three hours of the same Play the gaps are 3 to 7 times longer: Miloradovich's counter hidden 27,667 ms in a
  row (09:15-10:55, 99.8 clock minutes), the Russian Guard cavalry's 17,667 ms (54.8 min), Walther's 15,333 ms (56.7 min), the French Guard
  cavalry's 13,233 ms, d'Hautpoul's 12,667 ms, Kellermann's 12,333 ms. Cut into the benchmark's own 90-frame windows, the long
  Landscape-with-counters runs have a formation hidden for the whole window in 6 of 14 (12:00-15:00) to 14 of 17 (08:30-11:30) and 17 of 17
  (Follow off): the benchmark's worst case is that view's normal state.
- **The problem is confined to "Landscape with counters" (and that view on a phone).** In the default Landscape (names) over 09:00-12:00,
  89.4% of the formation-frames in view are drawn (a fresh layout in the same frames: 99.9%); no formation is under 50%; the longest gap is
  1,667 ms (8.3 clock minutes). The paper map: 93.2%, longest 667 ms. The phone in its default Landscape: 79.6%, longest 2,333 ms. Landscape
  with counters at 1600 x 900: 64-77% drawn in every long run (a fresh layout 73-89%), and the same five to eight formations under 50%: the four
  divisions of Murat's Cavalry Reserve (d'Hautpoul 9.8%, Walther 16.2%, Kellermann 36.6%, Nansouty 46.5% over 08:30-11:30), both Guard
  cavalries (Russian 15.8%, French 16.5%) and Miloradovich (17.5%); the Russian and French Guard infantry at times. The same view on a phone
  (390 x 844): 51.7%, and Liechtenstein's Fifth Column (cavalry) never drawn in any frame it is in view from 09:00 to 12:00 (its longest gap
  25,067 ms, 90 clock minutes).
- **The highest-priority items are always drawn; the formations the events name are not.** Every live event's label, and the selected
  formation in the selection run, was drawn in every frame (0 protected-hidden frames in all 21 driver runs). The army headquarters' counters are
  drawn 83-98% with gaps of at most 0.7 s. But a live event does not raise the formations it names (`analysis.js` `EVENTS[].forms`): during
  "Rapp's counter-charge breaks the Chevalier Guard" the French Guard cavalry's counter is drawn in 0.0% (08:30-11:30 run), 10.8% (12:00-15:00)
  and 4.2% (whole day at 4x) of the event's frames, the Russian Guard cavalry's in 1.5%, 16.0% and 4.2%; during "Kutuzov orders the 4th Column
  to face about" Miloradovich's counter is drawn in 0.0-40.0% of the event's frames across the runs (a fresh layout in the same frames: 33-84%
  in five runs, 0% in two). In the default Landscape the same names are drawn 60-91% during those events.
- **Dropped at rest: mostly crowding, partly the kept places.** After Play stops, 0 to 10 formations stay hidden in Landscape with counters
  (7 after the 08:30-11:30 run, 0 after 12:00-15:00); a fresh view at the same clock and eye hides most of the same ones (Nansouty, Walther and Miloradovich after the benchmark's run among them:
  that view has no room for them at 09:14), and 0 to 3 per run are hidden only because the layout at rest keeps the places it held in motion
  (decision 240 (a)'s "at rest the kept places first"; until the next discontinuity). None in the Landscape, the paper map or the phone's
  Landscape.
- **Real time agrees with the driver: frame for frame at matched pacing, in totals and in who is starved at a real, jittered pace.** With the
  WebGL draw, on a visitor's page with Play and Pause by real clicks, the app's own loop ran 46 frames 15-35 s apart on this loaded machine (it
  reached 09:17 in its 20-minute cap); the driver at 1,000 ms frames over the same clock gives the identical result: 873 of 1,288
  formation-frames drawn in both, all 46 frames identical in every formation's code (0 of 1,288 cells differ) and every event, place and
  objective drawn or not alike (0 of 2,300). Without the draw (frames a median 157 ms apart on this machine) the app drew 65.8% of the
  formation-frames from 09:00 to 10:00; the driver at the same median pacing 67.0%, at 30 frames a second 64.4%; the same formations starved in
  all three (Walther, d'Hautpoul, the Russian Guard cavalry, Miloradovich, the French Guard cavalry under 25%), but individual formations differ
  by up to about 30 points (Saint-Hilaire 51.6% real, 80.7% driver): with jittered frame times the passes fall elsewhere and the layout, which
  remembers, takes another path, so the benchmark's per-formation counts are not predictions of a session. At 60 frames a second (a 60 Hz
  display) the three-hour run gives 67.1% against 67.6% at 30, and the same 27,667 ms gap: the benchmark's 30 frames a second is representative
  of a device.

## What was examined, and how

**The instrument** (`tools/audit-post8/visibility/vis-lib.js`, injected after `tools/visual/motion.js`'s driver). The deterministic motion driver
runs the app's own loop one frame at a time on its own clock (`motion.js` `inPage`: `performance.now` answers the driver's time; Play, Follow,
the dwell, the stabiliser's 333 ms passes and fades all read it), with the WebGL draw skipped (the layout reads nothing it draws). A run is set
up exactly as `motion.js` `RUN`'s Play run (seek to the start, Follow on unless said, the speed, eight frames at rest, then Play), played until the
clock reaches its end, then 30 frames at rest and one fresh view (`mlReset`, the same clock and eye). After every frame each item the map layer
collected is coded: drawn; hidden by the layout (held by the stabiliser or dropped; with or without room for the full search in that frame's own
final boxes, tried and undone); behind the drawn ground; off the screen or under a panel; not in the layer. In every frame the layout a fresh
view would give (`mlLayout`'s "build": the protected items, then the rest in priority order from an empty list, tried and undone) is computed
too: the counterfactual that separates crowding from the stabiliser. A formation's record is its counter where the layer collects one, else its
name (`motion.js` tracking's definition). Times are on the driver's clock (33.3 ms a frame unless said); clock minutes are the battle's.

**Validation.** The three Play runs of the benchmark replicated give exactly `thresholds.js` `MOTION.VIS` (`tools/visual/thresholds.js:307-309`):
hybrid-play 2,033 of 3,388 formation-frames drawn, longest 4,033 ms; land-play 2,667 of 3,146, 667 ms; paper-play 1,581 of 1,694, 667 ms. The
room counts reproduce section 22.3's (Nansouty's full search had room in 50 of the 121 frames).

**The runs** (`tools/audit-post8/visibility/runs.js`; views from `tools/visual/motion.js` `VIEWS`: the Field vantage at 1600 x 900 in Study,
`hybrid` = Landscape with counters, `land` = Landscape, `paper` = the paper map framed, `phone` = 390 x 844 in Landscape with counters):
the three benchmark replications; Landscape with counters from 08:30 to 11:30 and from 12:00 to 15:00 at ½x, the whole day (04:00-18:00) at 4x,
08:30-11:30 at 60 frames a second, with Follow off, in Watch, under each headquarters' reading (09:00-12:00), with Nansouty selected (09:00-10:00),
09:00-10:00 at 30 frames a second, at 157 ms frames and at 1,000 ms frames; the Landscape from 09:00 to 12:00 at ½x, in Watch, and the whole day
at 4x; the paper map 09:00-12:00; the phone in Landscape with counters and in its default Landscape, 09:00-12:00. Two real-time runs
(`realtime.js`): a visitor's page (no `?harness=1`, transitions kept), the first-run card closed by a real Escape, the Landscape-with-counters
view applied at 09:00, Follow on, ½x, Play and Pause by real mouse clicks, every layout pass the app made observed; once with the WebGL draw
stubbed (the app's loop then runs at this machine's CPU pace) and once drawn.

**Commands** (from the repository root; the browser runs open their own pages on a copy-free read of the build):

```
node tools/audit-post8/visibility/long-play.js --runs bench-hybrid,bench-land,bench-paper,hybrid-0830,hybrid-1200,hybrid-4x-day,land-0900,land-4x-day,paper-0900,phone-0900,hybrid-fr-0900,hybrid-al-0900,hybrid-fixed-0830,hybrid-watch-0830,land-watch-0900,hybrid-sel-0900,hybrid-0900-slow   # first session
node tools/audit-post8/visibility/long-play.js --runs hybrid-0900-1h,hybrid-0900-157      # this session
node tools/audit-post8/visibility/long-play.js --runs phone-land-0900                     # this session
node tools/audit-post8/visibility/long-play.js --runs hybrid-0830-60                      # this session
node tools/audit-post8/visibility/realtime.js --nogl --to 600                             # this session
node tools/audit-post8/visibility/realtime.js --to 600                                    # this session (WebGL drawn)
node tools/audit-post8/visibility/stills.js --run <run> --frames <n> --plain              # stills (first session: hybrid-0830 f450)
node tools/audit-post8/visibility/analyse.js        # tables.json, tables.md
node tools/audit-post8/visibility/readme-tables.js  # the tables below, items.json
node tools/audit-post8/visibility/keynums.js        # the per-run key numbers, printed
```

## Results

### 1. The benchmark against longer playback

Table D below: each long run cut into windows of 90 play frames, each judged as the benchmark judges its run. In Landscape with counters a
formation is hidden for a whole window in 14 of 17 windows (08:30-11:30), 6 of 14 (12:00-15:00), 8 of 20 (whole day at 4x), 17 of 17 with Follow
off, 12 and 11 of 16 under the two readings; in the Landscape, the paper map and the phone's Landscape in none. The benchmark's own share (57.1%
of the play frames) lies at the low end of the long runs' windows (55.2-74.6%, median 68.4%, in the 08:30 run): its start, a seek to 09:00, is
one of the worst moments, so for the share it is pessimistic but in range. For the longest hidden interval it is blind beyond its window: 4,033 ms
is every frame it measures. No other check fills the gap: the self-test's day-long Play at ½x (the 4D pacing check, `app.js:10045-10048`)
samples one layout pass every ten clock minutes and counts the items dropped (at most 19), not how long any formation stays hidden. (At 60
frames a second a 90-frame window is 1.5 s, so that run's 33 of 34 is not comparable; its totals are.)

### 2. Long playback by presentation (table A)

Landscape with counters, 1600 x 900, Study, Follow on, ½x: 67.6% of formation-frames drawn from 08:30 to 11:30 (fresh layout 77.2%), 72.6% from
12:00 to 15:00 (84.5%), 65.3% over the whole day at 4x (81.1%); Watch 70.5%; Follow off 72.2%; under the French reading 69.0%, the Allied 76.5%.
The Landscape: 89.4% (09:00-12:00), 83.1% (whole day at 4x), Watch 89.3%; fresh 99.9%. The paper map: 93.2% (fresh 100%). The phone: Landscape
with counters 51.7% (fresh 60.1%), the Landscape 79.6% (fresh 98.6%).

Of the formation-frames hidden by the layout, those in which the full search had room in that very frame (the stabiliser's re-admission delay,
not crowding): Landscape with counters 26-56% (39.9% in the 08:30 run), the Landscape 98-99%, the paper map 100%, the phone's Landscape 93.2%,
the phone with counters 19.1%. So in the Landscape and the paper map every hidden name is the stabiliser's (`app.js:5481`: an item not drawn
comes back only after room at two successive 333 ms passes), in short episodes (Landscape 09:00-12:00: 4,087 hidden formation-frames in 230
episodes, a mean of 0.59 s, about one blink every 5.7 s per name); in Landscape with counters roughly half is crowding that a fresh layout also
suffers and half the stabiliser.

### 3. Who is starved, and for how long (table B; per run and per formation in `tables.md`, `items.json`)

The same formations in every Landscape-with-counters run: d'Hautpoul's Cuirassiers (9.8% / 26.7% / 15.7% in the 08:30, 12:00 and 4x-day runs),
the Russian Guard cavalry (15.8% / 24.3% / 20.0%), Walther's Dragoons (16.2% / 59.4% / 36.1%), the French Guard cavalry (16.5% / 48.0% / 32.5%),
Miloradovich's Russians (17.5% / 76.6% / 45.6%), Kellermann's Light Cavalry (36.6% / 35.6% / 43.5%), Nansouty's Cuirassiers (46.5% / 60.7% /
36.0%), the Russian Guard infantry (75.1% / 42.5% / 47.6%). The first six's longest gaps: 12-28 s on the driver's clock (40-100 clock minutes at ½x, up to 120 at 4x);
Nansouty's are shorter (2.3-3.7 s) but many. The time strips in `tables.md` show d'Hautpoul's counter in view and never drawn in most five-minute bins from 08:30 to 11:25, Miloradovich's from 09:15 to
10:55, the Russian Guard cavalry's from 08:45 to 09:40 and 12:05 to 12:55. A fresh layout would starve d'Hautpoul, the Guard cavalries and Walther
nearly as much (3.8%, 20.8%, 10.4%, 26.1% in the 08:30 run): crowding on the French left (the Santon, Murat's divisions, the Imperial
Headquarters, Lannes) and on the Stare Vinohrady heights, decided by the priority rule. Miloradovich (fresh 47.9%), Kellermann (42.1%) and,
during events, Rivaud and Caffarelli (fresh 100% at Blasowitz) lose mainly to the stabiliser. With Follow off the starvation persists
(d'Hautpoul 6.9%, a 21,967 ms gap): Play itself is a motion source (`app.js:5342`), so with a still camera the layout stays in its "hold"
strategy for the whole of Play (`app.js:5383-5386`, `5474`). Selecting a formation draws it in every frame (Nansouty 100% against 38.7%
unselected, 09:00-10:00) and costs others their room (Saint-Hilaire 80.6% to 51.1%, Vandamme 62.0% to 34.4%; decision 39's protected items).

### 4. Priority: the highest-priority items (table F)

Protected items hidden: 0 frames in every run. Live events: drawn in every frame they are live (100% in all 21 runs). Army and corps counters:
81.8-96.4% in the long Landscape-with-counters runs at 1600 x 900 (the headquarters 83-98%, gaps at most 0.7 s; the Allied headquarters' longest
8.0 clock minutes at 4x), 93.6% on the paper map, 53.9% on the phone with counters (the Cavalry Reserve 13.1%, the Russian Imperial Guard 21.4%,
Liechtenstein 0.0%). Objectives' labels (the lowest priority, 10): 71-82% in motion in the long 1600 x 900 runs (the phone with counters 59.3%)
against 77-100% in a fresh layout. Places (8-8.5): 9-39%, and more in motion than fresh (14.1% against 9.5% in the 08:30 run): the stabiliser keeps place names that a fresh layout would drop while it hides formations a fresh
layout would draw (in 948 of the 1,510 play frames of that run with a formation so starved a place name so kept was drawn: co-occurrence, not
the same boxes).

### 5. The formations the live events name (table C)

Over the play frames each live event's label is drawn, the share of its named formations' frames in view drawn: Landscape with counters 59.0%
(08:30), 66.2% (12:00), 53.8% (whole day); the Landscape 80.2% and 75.2%; the paper map 96.7% (its corps counters stand for the divisions the
events name, which it does not collect at that framing; only the corps and armies named are counted there); the phone with counters 40.2%. The
worst: the Guard cavalry clash (above), the Russian Guard infantry during "The French take Blasowitz from the Russian Guard" (24.0%, 0.0% at 4x),
Miloradovich at the 4th Column's face-about, the Imperial Headquarters during "Napoleon moves forward to Stare Vinohrady" (77.7%; fresh 100%).
For the Guard cavalries the fresh layout also fails (0.0-16.0%): no reordering of the stabiliser would show them; only their priority would.

### 6. At rest, before and after Play

Before Play (a seek's fresh layout) and after it (30 frames at rest, the "persist" strategy), with a fresh view at the end (`restSum` in
`tables.json`): Landscape with counters hides 0-10 formations at rest after Play; a fresh view hides 1-8, most of them the same. Hidden at rest
only because of the kept places (drawn by the fresh view): the benchmark's run Vandamme, Kellermann and the Russian Guard infantry; 08:30-11:30
Drouet; the French reading Kellermann, Walther and Rivaud; Follow off Saint-Hilaire and Rivaud; the Allied reading Vandamme; 0-1 in the others.
The layout keeps this state until the next discontinuity (`app.js:5474`, `5485-5489`: `MLS.fromMotion` stays set until a fresh view).

### 7. Real time against the driver (table E)

With the draw (`runs/realtime.json`): a visitor's page at 1600 x 900, the first-run card closed by a real Escape, Play and Pause by real mouse
clicks at the button's centre, every layout pass the app made observed. Other audit areas' browsers shared the machine (load average 21-34 on
4 cores), so its frames came 14,955/26,727/35,114 ms apart (p10/median/p90) and Play reached only 09:17.6 in the script's 1,200 s cap: 46 frames,
each a re-placement pass with Play's frame capped at 120 ms (`app.js:9129`). The driver at 1,000 ms frames (`hybrid-0900-slow`, the same per-frame
logic: every frame a pass, the same cap) over 09:00-09:17.6: 873 of 1,288 formation-frames drawn, as in real time; every formation's drawn count
and longest gap the same (Kellermann 1 of 46, Miloradovich 3, Walther 4, the Russian Guard cavalry 4 with a 40-frame gap, d'Hautpoul 10, ...);
the 46 frames, paired in order (the clock is the same in each pair), identical in every formation's code, and every item drawn or not alike (0
differences in 2,300 item-frames). The same clock range at 30 frames a second gives 60.3%: pacing changes the counts (with every frame a pass,
an item comes back sooner in clock terms), which is why the benchmark fixes its pacing.

The real-time run without the draw (`runs/realtime-nogl.json`) had its frames 89/157/234 ms apart (p10/median/p90) on this
machine, so the app's Play advanced up to 120 ms of play a frame (the loop caps a frame's time at 120 ms, `app.js:9129`); 60 re-placement passes. Paired
by clock (the k-th frame at a clock value with the other's k-th), frame-for-frame codes differ (46 paired frames, 1 identical in every
formation): with jittered real frame times the passes fall at different frames, and the layout, which remembers, follows a different path; the
totals and the starved set agree.

## Tables

Generated by `tools/audit-post8/visibility/readme-tables.js` from `tables.json` (no number copied by hand). Play frames only unless said; "a fresh layout" is the layout a fresh view would give in the same frames; per run and per formation, every count the brief asks for (frames in view, drawn, share, longest hidden in ms and clock minutes, episodes, at rest before and after) is in `items.json` and `tables.md`.

### A. The runs (play frames)

| run | presentation / mode, viewport | reading, Follow, speed | clock | formation-frames drawn / in view | a fresh layout's share | formations under 50% | longest hidden by the layout | named formations drawn during their live events | hidden at rest after Play (of them drawn by a fresh view) |
|---|---|---|---|---|---|---|---|---|---|
| bench-hybrid | study / hybrid, 1600x900 | none, on, 0.5x | 09:00-09:14 | 1440 / 2520 (57.1%) | 76.9% | nansouty 0.0%, walther 0.0%, milo 0.0%, dhautpoul 8.9%, guard_cav 16.7%, kellermann 21.1%, rg_cav 21.1%, sthilaire 27.8% | nansouty 3,000 ms = 14.69 min from 09:00 | 232 / 497 (46.7%) | 9 (vandamme, kellermann, rg_inf) |
| bench-land | study / terrain, 1600x900 | none, on, 0.5x | 09:00-09:14 | 1861 / 2340 (79.5%) | 99.7% | vandamme 36.7%, sthilaire 37.8%, kellermann 44.4%, guard_cav 44.4% | sthilaire 667 ms = 3.33 min from 09:05 | 242 / 450 (53.8%) | 0 (0) |
| bench-paper | study / staff, 1600x900 | none, on, 0.5x | 09:00-09:14 | 1147 / 1260 (91.0%) | 100.0% | none | constantine 667 ms = 3.33 min from 09:10 | 31 / 47 (66.0%) | 0 (0) |
| hybrid-0830 | study / hybrid, 1600x900 | none, on, 0.5x | 08:30-11:30 | 29061 / 43005 (67.6%) | 77.2% | dhautpoul 9.8%, rg_cav 15.8%, walther 16.2%, guard_cav 16.5%, milo 17.5%, kellermann 36.6%, nansouty 46.5% | milo 27,667 ms = 99.83 min from 09:15 | 3727 / 6322 (59.0%) | 7 (drouet) |
| hybrid-0830-60 | study / hybrid, 1600x900 | none, on, 0.5x (16.667 ms frames) | 08:30-11:30 | 57723 / 86013 (67.1%) | 77.2% | dhautpoul 12.4%, guard_cav 16.7%, rg_cav 16.8%, milo 18.1%, walther 18.8%, kellermann 36.0%, guard_inf 37.9%, nansouty 46.1% | milo 27,667 ms = 99.92 min from 09:15 | 7368 / 12628 (58.3%) | 6 (0) |
| hybrid-1200 | study / hybrid, 1600x900 | none, on, 0.5x | 12:00-15:00 | 22974 / 31626 (72.6%) | 84.5% | rg_cav 24.3%, dhautpoul 26.7%, kellermann 35.6%, rg_inf 42.5%, guard_cav 48.0% | dhautpoul 15,300 ms = 60 min from 12:00 | 5641 / 8525 (66.2%) | 0 (0) |
| hybrid-4x-day | study / hybrid, 1600x900 | none, on, 4x | 04:01-18:00 | 27966 / 42841 (65.3%) | 81.1% | dhautpoul 15.7%, rg_cav 20.0%, guard_cav 32.5%, nansouty 36.0%, walther 36.1%, kellermann 43.5%, milo 45.6%, rg_inf 47.6% | dhautpoul 13,000 ms = 84.16 min from 08:25 | 4543 / 8445 (53.8%) | 3 (0) |
| hybrid-fixed-0830 | study / hybrid, 1600x900 | none, off, 0.5x | 08:30-11:30 | 31519 / 43680 (72.2%) | 77.2% | dhautpoul 6.9%, rg_cav 16.7%, kellermann 23.3%, milo 29.9%, nansouty 33.2%, walther 37.4%, vandamme 46.2% | dhautpoul 21,967 ms = 69.83 min from 08:30 | 3771 / 6322 (59.6%) | 10 (sthilaire, rivaud) |
| hybrid-watch-0830 | watch / hybrid, 1600x900 | none, on, 0.5x | 08:30-11:30 | 30736 / 43589 (70.5%) | 78.6% | dhautpoul 10.6%, milo 15.6%, rg_cav 25.4%, walther 26.5%, guard_cav 38.5%, kellermann 46.5%, nansouty 48.5% | rg_cav 17,667 ms = 54.83 min from 08:45 | 3952 / 6322 (62.5%) | 6 (0) |
| hybrid-fr-0900 | study / hybrid, 1600x900 | fr, on, 0.5x | 09:00-12:00 | 24116 / 34948 (69.0%) | 78.9% | milo 0.0%, dhautpoul 8.1%, kellermann 23.1%, walther 26.7%, guard_cav 28.5%, rg_cav 43.1%, guard_inf 44.0% | milo 15,967 ms = 49.83 min from 09:00 | 3686 / 5895 (62.5%) | 7 (kellermann, walther, rivaud) |
| hybrid-al-0900 | study / hybrid, 1600x900 | al, on, 0.5x | 09:00-12:00 | 20341 / 26573 (76.5%) | 88.7% | guard_cav 2.6%, milo 29.2%, rg_cav 30.1% | milo 24,633 ms = 90 min from 09:00 | 3464 / 6249 (55.4%) | 5 (vandamme) |
| hybrid-sel-0900 | study / hybrid, 1600x900 | none, selected nansouty, on, 0.5x | 09:00-10:00 | 9649 / 15120 (63.8%) | 72.9% | milo 3.9%, walther 7.6%, rg_cav 10.2%, dhautpoul 13.1%, guard_cav 17.4%, kellermann 20.2%, guard_inf 23.0%, vandamme 34.4% | milo 14,867 ms = 45.07 min from 09:14 | 1085 / 1950 (55.6%) | 6 (suchet, guard_inf, milo) |
| land-0900 | study / terrain, 1600x900 | none, on, 0.5x | 09:00-12:00 | 34330 / 38417 (89.4%) | 99.9% | none | rg_cav 1,667 ms = 8.33 min from 11:46 | 5209 / 6493 (80.2%) | 0 (0) |
| land-4x-day | study / terrain, 1600x900 | none, on, 4x | 04:01-18:00 | 35087 / 42248 (83.1%) | 99.9% | none | milo 2,533 ms = 101.33 min from 04:37 | 6377 / 8480 (75.2%) | 0 (0) |
| land-watch-0900 | watch / terrain, 1600x900 | none, on, 0.5x | 09:00-12:00 | 34918 / 39107 (89.3%) | 99.9% | none | rg_cav 1,667 ms = 8.33 min from 11:46 | 5229 / 6501 (80.4%) | 0 (0) |
| paper-0900 | study / staff, 1600x900 | none, on, 0.5x | 09:00-12:00 | 19669 / 21112 (93.2%) | 100.0% | none | c_iv 667 ms = 1.5 min from 09:30 | 1042 / 1078 (96.7%) | 0 (0) |
| phone-0900 | study / hybrid, 390x844 | none, on, 0.5x | 09:00-12:00 | 7046 / 13635 (51.7%) | 60.1% | lich 0.0%, c_cav 13.1%, c_gren 15.5%, constantine 21.4%, c_v 30.5%, c_gd 33.2% | lich 25,067 ms = 90 min from 09:00 | 380 / 945 (40.2%) | 6 (c_gd) |
| phone-land-0900 | study / terrain, 390x844 | none, on, 0.5x | 09:00-12:00 | 3689 / 4637 (79.6%) | 98.6% | none | lich 2,333 ms = 10.17 min from 09:35 | 245 / 350 (70.0%) | 0 (0) |
| hybrid-0900-1h | study / hybrid, 1600x900 | none, on, 0.5x | 09:00-10:00 | 9743 / 15120 (64.4%) | 73.9% | milo 0.0%, rg_cav 9.1%, walther 9.3%, dhautpoul 10.7%, guard_cav 13.0%, kellermann 22.0%, guard_inf 37.4%, nansouty 38.7% | milo 18,000 ms = 60 min from 09:00 | 1335 / 1950 (68.5%) | 7 (guard_inf) |
| hybrid-0900-157 | study / hybrid, 1600x900 | none, on, 0.5x (157 ms frames) | 09:00-10:00 | 2816 / 4200 (67.0%) | 74.0% | walther 11.3%, dhautpoul 14.0%, rg_cav 14.7%, milo 20.0%, guard_cav 22.0%, nansouty 40.7%, vandamme 43.3% | milo 16,485 ms = 33 min from 09:14 | 343 / 537 (63.9%) | 6 (vandamme) |
| hybrid-0900-slow | study / hybrid, 1600x900 | none, on, 0.5x (1000 ms frames) | 09:00-10:00 | 2901 / 4200 (69.1%) | 74.0% | milo 2.0%, rg_cav 2.7%, walther 4.0%, dhautpoul 10.7%, kellermann 12.7%, guard_inf 17.3%, guard_cav 23.3% | rg_cav 144,000 ms = 56.4 min from 09:04 | 380 / 537 (70.8%) | 7 (guard_inf) |

### B. Each formation in the long runs: share drawn while in view / longest hidden by the layout (ms on the driver's clock = clock minutes)

| formation | hybrid-0830 | hybrid-1200 | hybrid-4x-day | land-0900 | land-4x-day | paper-0900 | phone-0900 | phone-land-0900 |
|---|---|---|---|---|---|---|---|---|
| lich (Fifth Column (cavalry)) | 84.9% / 667 = 3.33 | 87.3% / 667 = 0.24 | 72.0% / 2,200 = 81.93 | 89.1% / 667 = 1.5 | 98.1% / 467 = 0 | 90.8% / 667 = 3.33 | 0.0% / 25,067 = 90 | 70.4% / 2,333 = 10.17 |
| dhautpoul (d'Hautpoul's Cuirassiers) | 9.8% / 12,667 = 46.83 | 26.7% / 15,300 = 60 | 15.7% / 13,000 = 84.16 | 87.9% / 667 = 0 | 70.2% / 667 = 0 | - | - | - |
| c_cav (Cavalry Reserve) | - | - | 68.9% / 667 = 26.67 | - | - | 91.9% / 667 = 3.33 | 13.1% / 7,233 = 24.67 | - |
| c_gren (Grenadier Division) | 80.3% / 2,667 = 8.5 | 81.6% / 2,667 = 13.33 | 72.3% / 667 = 0 | 94.8% / 667 = 3.33 | 89.4% / 667 = 10.84 | 87.3% / 667 = 3.33 | 15.5% / 13,733 = 47.33 | - |
| rg_cav (Guard Cavalry) | 15.8% / 17,667 = 54.83 | 24.3% / 14,333 = 56.83 | 20.0% / 11,000 = 119.51 | 72.3% / 1,667 = 8.33 | 74.2% / 667 = 0 | - | - | - |
| walther (Walther's Dragoons) | 16.2% / 15,333 = 56.67 | 59.4% / 1,667 = 8.33 | 36.1% / 7,333 = 45 | 86.7% / 667 = 2.93 | 64.7% / 667 = 0 | - | - | - |
| guard_cav (Guard Cavalry) | 16.5% / 13,233 = 48.17 | 48.0% / 12,600 = 43 | 32.5% / 12,467 = 119.79 | 88.4% / 667 = 3.33 | 83.5% / 667 = 3.01 | - | - | - |
| milo (Miloradovich's Russians) | 17.5% / 27,667 = 99.83 | 76.6% / 3,667 = 17.93 | 45.6% / 3,333 = 30 | 91.4% / 667 = 0 | 70.4% / 2,533 = 101.33 | - | - | - |
| constantine (Russian Imperial Guard) | - | - | 77.2% / 667 = 25.66 | - | - | 89.6% / 667 = 3.33 | 21.4% / 13,667 = 50.17 | - |
| c_v (V Corps) | - | - | 56.9% / 667 = 3.01 | - | - | 97.3% / 667 = 1.83 | 30.5% / 1,667 = 8.33 | - |
| c_gd (Imperial Guard) | - | - | 89.2% / 600 = 0 | - | - | 91.3% / 667 = 3.33 | 33.2% / 3,667 = 16.83 | - |
| kellermann (Kellermann's Light Cavalry) | 36.6% / 12,333 = 39.83 | 35.6% / 4,667 = 13.33 | 43.5% / 9,667 = 100.07 | 86.4% / 667 = 3.33 | 83.0% / 667 = 0 | - | - | - |
| nansouty (Nansouty's Cuirassiers) | 46.5% / 3,133 = 7.5 | 60.7% / 2,300 = 11.5 | 36.0% / 3,667 = 29.84 | 75.3% / 667 = 3.33 | 70.2% / 667 = 0 | - | - | - |
| rg_inf (Guard Infantry) | 75.1% / 5,033 = 15.4 | 42.5% / 13,333 = 50.17 | 47.6% / 7,333 = 59.25 | 82.7% / 667 = 0 | 84.5% / 667 = 0 | - | - | - |
| guard_inf (Guard Infantry) | 64.8% / 3,667 = 18.33 | 64.0% / 5,633 = 28.17 | 55.4% / 4,000 = 28.1 | 86.4% / 667 = 3.33 | 90.6% / 667 = 15.33 | - | - | - |
| c_i (I Corps) | - | - | 89.2% / 600 = 0 | - | - | 94.7% / 667 = 3.33 | 59.0% / 4,600 = 14.39 | - |
| rivaud (Rivaud's Division) | 73.3% / 2,000 = 0.64 | 61.2% / 4,667 = 13.33 | 64.8% / 2,000 = 24.46 | 90.8% / 667 = 1.83 | 81.6% / 667 = 0 | - | - | - |
| bourcier (Bourcier's Dragoons) | 81.4% / 667 = 0 | 72.1% / 3,000 = 15 | 62.7% / 2,500 = 32 | 92.6% / 667 = 3.33 | 80.7% / 667 = 0 | - | - | - |
| col4 (Fourth Column) | - | - | 80.8% / 600 = 0 | - | - | 93.0% / 667 = 1.83 | 63.2% / 5,333 = 16.67 | - |
| vandamme (Vandamme's Division) | 65.7% / 2,000 = 5.17 | 81.0% / 667 = 3.33 | 64.7% / 667 = 1.23 | 87.9% / 667 = 1.83 | 81.7% / 667 = 26.67 | - | - | - |
| kienmayer (Kienmayer's Advance Guard) | 88.1% / 1,300 = 6.5 | 64.8% / 6,500 = 22.5 | 82.4% / 800 = 6.69 | 95.7% / 667 = 0 | 76.6% / 667 = 26.67 | - | - | - |
| suchet (Suchet's Division) | 72.8% / 667 = 3.33 | 81.7% / 667 = 3.33 | 67.1% / 667 = 26.67 | 94.0% / 667 = 3.33 | 86.9% / 667 = 0 | - | - | - |
| friant (Friant's Division) | 84.7% / 667 = 2.93 | 91.5% / 667 = 3.33 | 69.3% / 667 = 0 | 93.5% / 667 = 3.1 | 83.5% / 667 = 0.71 | - | - | - |
| sthilaire (Saint-Hilaire's Division) | 75.7% / 667 = 3.33 | 72.1% / 1,967 = 9.83 | 69.6% / 667 = 8.1 | 82.0% / 667 = 3.33 | 79.3% / 667 = 0 | - | - | - |
| gqg (Imperial Headquarters) | 97.8% / 400 = 0 | 91.3% / 567 = 2.83 | 88.4% / 667 = 0.71 | - | 89.2% / 600 = 0 | 97.3% / 533 = 2.67 | 79.3% / 633 = 0 | 74.0% / 667 = 1.83 |
| legrand (Legrand's Division) | 88.5% / 667 = 0.24 | 75.6% / 667 = 3.33 | 75.4% / 667 = 22.44 | 95.5% / 667 = 0 | 85.7% / 667 = 26.67 | - | - | - |
| c_iii (III Corps (detachment)) | - | - | 81.7% / 367 = 3.01 | - | - | 91.0% / 667 = 1.83 | 76.2% / 4,433 = 12.17 | - |
| lang (Second Column) | 91.5% / 667 = 0 | 88.6% / 667 = 3.33 | 76.7% / 667 = 14.67 | 98.7% / 667 = 0 | 86.7% / 667 = 0 | - | - | - |
| buxhowden (Left Wing Command) | - | - | 89.2% / 600 = 0 | - | 89.2% / 600 = 0 | 98.7% / 667 = 3.33 | 76.8% / 1,833 = 1.01 | 82.0% / 667 = 3.33 |
| drouet (Drouet d'Erlon's Division) | 76.9% / 667 = 1.5 | 97.5% / 567 = 2.6 | 79.2% / 667 = 0.54 | 84.2% / 667 = 3.33 | 85.8% / 667 = 0 | - | - | - |
| kollo (Kollowrat's Austrians) | 83.3% / 667 = 0.4 | 77.3% / 667 = 3.33 | 83.4% / 667 = 1.01 | 91.2% / 667 = 1.5 | 94.4% / 667 = 0 | - | - | - |
| c_iv (IV Corps) | - | - | 80.8% / 600 = 0 | - | - | 89.7% / 667 = 1.5 | 79.6% / 867 = 4.33 | - |
| caffarelli (Caffarelli's Division) | 82.9% / 667 = 3.33 | 82.5% / 667 = 3.33 | 80.6% / 667 = 10.33 | 88.1% / 667 = 0 | 84.0% / 667 = 0 | - | - | - |
| dok (First Column) | 97.5% / 633 = 0 | 86.8% / 667 = 3.33 | 81.1% / 667 = 0 | 98.7% / 600 = 3 | 88.0% / 667 = 0 | - | - | - |
| ahq (Allied Headquarters) | 97.0% / 633 = 3.17 | 94.3% / 667 = 3.33 | 83.2% / 667 = 7.99 | - | 89.2% / 600 = 0 | 95.2% / 533 = 2.67 | 91.4% / 1,200 = 6 | 88.8% / 667 = 3.33 |
| bag (Advance Guard of the Right) | 86.4% / 667 = 3.33 | 86.0% / 633 = 3.17 | 84.5% / 667 = 0 | 93.0% / 667 = 3.1 | 96.1% / 667 = 0 | 96.4% / 667 = 3.33 | 36.5% / 1,100 = 5.5 | 45.1% / 667 = 3.33 |
| prz (Third Column) | 92.8% / 667 = 3.1 | 93.4% / 667 = 1.83 | 96.9% / 667 = 1.23 | 98.9% / 533 = 2.67 | 86.0% / 667 = 0 | - | - | - |

### C. Formations named by a live event, while the event's label is drawn (share drawn while in view; the longest hidden stretch inside the event's frames)

| event (EVENTS[].forms) | hybrid-0830 | hybrid-1200 | hybrid-4x-day | land-0900 | land-4x-day |
|---|---|---|---|---|---|
| davout | friant 76.9% | - | friant 53.8% | friant 76.7% | friant 74.8% |
| telnitz-retaken | friant 93.3% | - | friant 67.1% | friant 93.3% | friant 52.6% |
| decision | gqg 95.3%; sthilaire 63.1%; vandamme 62.3% | - | gqg 93.3%; sthilaire 60.0%; vandamme 80.7% | - | sthilaire 80.7%; vandamme 93.3% |
| soult | sthilaire 69.2%; vandamme 64.9% | - | sthilaire 47.1%; vandamme 68.6% | sthilaire 67.4%; vandamme 72.0% | sthilaire 73.8%; vandamme 74.8% |
| pratzen-village | sthilaire 74.1% | - | sthilaire 53.9% | sthilaire 38.4% | sthilaire 86.8% |
| face-about | ahq 85.5%; milo 10.9% (max 4.6 s); kollo 83.4% | - | ahq 64.0%; milo 40.0%; kollo 64.0% | milo 91.2%; kollo 100.0% | milo 60.0%; kollo 100.0% |
| kamensky | sthilaire 74.5%; lang 93.2% | - | sthilaire 51.4%; lang 84.7% | sthilaire 81.3%; lang 100.0% | sthilaire 65.3%; lang 100.0% |
| kursk | lang 100.0% | - | lang 80.3% | lang 100.0% | lang 100.0% |
| pratzeberg | sthilaire 60.6%; legrand 76.2% | - | sthilaire 46.1%; legrand 100.0% | sthilaire 73.1%; legrand 100.0% | sthilaire 77.6%; legrand 100.0% |
| blasowitz | caffarelli 70.8%; rivaud 47.9% (max 2.0 s); rg_inf 24.0% (max 4.9 s) | - | caffarelli 51.4%; rivaud 13.9% (max 1.6 s); rg_inf 0.0% (max 2.4 s) | caffarelli 81.3%; rivaud 81.3%; rg_inf 56.8% | caffarelli 79.2%; rivaud 72.2%; rg_inf 51.4% |
| guard-attack | rg_inf 34.6% (max 5.0 s); rg_cav 3.7% (max 4.6 s); vandamme 54.8% (max 1.0 s) | rg_inf 23.5% (max 13.3 s); rg_cav 12.2% (max 14.3 s); vandamme 76.6% | rg_inf 8.3% (max 7.3 s); rg_cav 4.4% (max 10.9 s); vandamme 51.0% | rg_inf 80.5%; rg_cav 62.5% (max 1.7 s); vandamme 82.5% | rg_inf 76.7%; rg_cav 63.2%; vandamme 72.8% |
| guard-broken | guard_cav 0.0% (max 6.6 s); drouet 59.9%; rg_cav 1.5% (max 4.6 s) | guard_cav 10.8% (max 12.6 s); drouet 97.6%; rg_cav 16.0% (max 14.3 s) | guard_cav 4.2% (max 12.2 s); drouet 79.6%; rg_cav 4.2% (max 11.0 s) | guard_cav 91.0%; drouet 80.0%; rg_cav 61.8% (max 1.7 s) | guard_cav 68.7%; drouet 78.9%; rg_cav 63.7% |
| hq-forward | - | gqg 77.7% | gqg 78.4% | - | - |
| buxhowden-blind | - | dok 87.0%; lang 86.8% | dok 84.9%; lang 83.9% | dok 92.1%; lang 100.0% | dok 88.2%; lang 100.0% |
| davout-resumes | - | friant 96.9%; bourcier 81.3% | friant 48.1%; bourcier 100.0% | - | friant 83.1%; bourcier 100.0% |
| wheel | - | sthilaire 79.6%; vandamme 90.2%; c_gren 89.2% (max 2.2 s); guard_inf 81.2% | sthilaire 74.0%; vandamme 63.0%; c_gren 61.9%; guard_inf 45.9% | - | sthilaire 44.8%; vandamme 68.5%; c_gren 85.6%; guard_inf 89.0% |
| sokolnitz-falls | - | prz 100.0%; friant 100.0%; sthilaire 81.8% | prz 100.0%; friant 73.7%; sthilaire 64.5% | - | prz 100.0%; friant 100.0%; sthilaire 68.4% |
| augezd | - | vandamme 85.4% | vandamme 39.0% | - | vandamme 70.1% |
| ice | - | dok 70.9%; kienmayer 100.0% | dok 71.1%; kienmayer 73.7% | - | dok 52.6%; kienmayer 51.3% |
| columns-move | - | - | kienmayer 87.6%; dok 71.3%; lang 62.4%; prz 82.6% | - | kienmayer 44.8%; dok 80.7%; lang 100.0%; prz 61.9% |
| counter-march | - | - | lich 56.8% (max 2.2 s); milo 23.2% (max 1.9 s); kollo 87.1% | - | lich 96.1%; milo 53.7% (max 2.5 s); kollo 85.0% |
| telnitz | - | - | kienmayer 84.9%; legrand 68.5% | - | kienmayer 26.3%; legrand 81.6% |
| raigern | - | - | - | - | friant 81.6%; bourcier 81.6% |
| sokolnitz | - | - | lang 53.9%; prz 100.0%; legrand 68.4% | - | lang 100.0%; prz 78.9%; legrand 28.9% |

### D. The 90-frame benchmark against the long runs' own 90-frame windows (each window judged as the benchmark judges its run)

| run | windows | share drawn: min / median / max | windows with a formation hidden for the whole window |
|---|---|---|---|
| hybrid-0830 | 17 | 55.2% / 68.4% / 74.6% | 14 |
| hybrid-0830-60 | 34 | 50.3% / 68.9% / 76.0% | 33 |
| hybrid-1200 | 14 | 57.7% / 79.0% / 85.9% | 6 |
| hybrid-4x-day | 20 | 51.5% / 66.7% / 83.6% | 8 |
| land-0900 | 16 | 74.6% / 91.2% / 97.9% | 0 |
| land-4x-day | 20 | 63.2% / 84.0% / 93.2% | 0 |
| paper-0900 | 16 | 84.7% / 93.5% / 100.0% | 0 |
| phone-0900 | 16 | 26.9% / 51.2% / 75.1% | 16 |
| phone-land-0900 | 16 | 61.1% / 78.7% / 100.0% | 0 |
| hybrid-fr-0900 | 16 | 56.9% / 70.7% / 82.4% | 12 |
| hybrid-al-0900 | 16 | 59.6% / 78.2% / 90.7% | 11 |
| hybrid-fixed-0830 | 17 | 62.1% / 73.3% / 77.5% | 17 |
| hybrid-watch-0830 | 17 | 54.7% / 70.6% / 80.5% | 14 |
| land-watch-0900 | 16 | 73.1% / 91.8% / 96.7% | 0 |
| hybrid-sel-0900 | 6 | 57.6% / 65.6% / 68.8% | 6 |
| hybrid-0900-1h | 6 | 57.1% / 65.3% / 70.1% | 6 |
| bench-hybrid (the benchmark itself, 121 frames: 1 at rest, 90 playing, 30 at rest) | 1 | 57.1% (play), 60.0% (all 121) | longest 4,033 ms |
| bench-land (the benchmark itself, 121 frames: 1 at rest, 90 playing, 30 at rest) | 1 | 79.5% (play), 84.8% (all 121) | longest 667 ms |
| bench-paper (the benchmark itself, 121 frames: 1 at rest, 90 playing, 30 at rest) | 1 | 91.0% (play), 93.3% (all 121) | longest 667 ms |

### E. Real time against the driver (Landscape with counters, 1/2x, Follow on; each comparison over the clock range both records cover)

| comparison | clock | real: frames, interval p10/median/p90, passes | driver: frames, passes | formation-frames drawn: real | driver | longest hidden (frames) real / driver | frames paired by clock / identical in every formation |
|---|---|---|---|---|---|---|---|
| gl (hybrid-0900-slow (driver, frames 1,000 ms apart)) | 09:00-09:17 | 46, 14955/26727/35114 ms, 46 | 46, 46 | 873/1288 (67.8%) | 873/1288 (67.8%) | 45 / 45 | 46 / 46 |
| nogl (hybrid-0900-1h (driver, 30 frames a second)) | 09:00-10:00 | 157, 89/157/234 ms, 60 | 537, 54 | 2894/4396 (65.8%) | 9684/15036 (64.4%) | 151 / 537 | 54 / 0 |
| glVs30 (hybrid-0900-1h (driver, 30 frames a second)) | 09:00-09:17 | 46, 14955/26727/35114 ms, 46 | 162, 16 | 873/1288 (67.8%) | 2733/4536 (60.3%) | 45 / 162 | 20 / 0 |
| noglMatched (hybrid-0900-157 (driver, frames 157 ms apart: the no-draw real-time run's median)) | 09:00-10:00 | 157, 89/157/234 ms, 60 | 150, 50 | 2894/4396 (65.8%) | 2816/4200 (67.0%) | 151 / 105 | 46 / 1 |
| driverSlowVs30 (hybrid-0900-1h (driver, 30 frames a second); 'real' here is the driver at 1,000 ms frames) | 09:00-10:00 | 150, -, 150 | 537, 54 | 2901/4200 (69.1%) | 9684/15036 (64.4%) | 144 / 537 | 62 / 1 |

### F. Events, the army and corps counters, objectives and places (play frames)

| run | protected items hidden (frames) | events | army + corps counters | objectives (fresh layout) | places (fresh layout) |
|---|---|---|---|---|---|
| bench-hybrid | 0 | 313/313 (100.0%) | 310/360 (86.1%) | 88.9% (94.4%) | 18.2% (15.6%) |
| bench-land | 0 | 313/313 (100.0%) | 163/180 (90.6%) | 93.9% (100.0%) | 16.6% (24.0%) |
| bench-paper | 0 | 313/313 (100.0%) | 1057/1170 (90.3%) | 72.2% (100.0%) | 4.1% (2.9%) |
| hybrid-0830 | 0 | 3114/3114 (100.0%) | 5568/6075 (91.7%) | 75.1% (95.5%) | 14.1% (9.5%) |
| hybrid-0830-60 | 0 | 6220/6220 (100.0%) | 11119/12150 (91.5%) | 75.7% (95.6%) | 13.0% (9.5%) |
| hybrid-1200 | 0 | 3233/3233 (100.0%) | 3445/3809 (90.4%) | 71.4% (77.3%) | 25.8% (22.4%) |
| hybrid-4x-day | 0 | 3659/3659 (100.0%) | 6108/7468 (81.8%) | 75.4% (91.2%) | 17.6% (15.4%) |
| hybrid-fixed-0830 | 0 | 3114/3114 (100.0%) | 6017/6240 (96.4%) | 79.9% (92.2%) | 38.0% (27.4%) |
| hybrid-watch-0830 | 0 | 3114/3114 (100.0%) | 5792/6240 (92.8%) | 76.3% (96.1%) | 15.5% (10.7%) |
| hybrid-fr-0900 | 0 | 3043/3043 (100.0%) | 4491/4880 (92.0%) | 78.3% (94.4%) | 29.8% (22.3%) |
| hybrid-al-0900 | 0 | 3043/3043 (100.0%) | 4467/4880 (91.5%) | 81.2% (89.3%) | 24.0% (17.6%) |
| hybrid-sel-0900 | 0 | 1136/1136 (100.0%) | 2071/2160 (95.9%) | 76.5% (89.6%) | 8.7% (7.8%) |
| land-0900 | 0 | 3043/3043 (100.0%) | 2589/2848 (90.9%) | 81.5% (93.6%) | 33.2% (28.9%) |
| land-4x-day | 0 | 3659/3659 (100.0%) | 3078/3209 (95.9%) | 75.8% (99.9%) | 33.9% (31.2%) |
| land-watch-0900 | 0 | 3043/3043 (100.0%) | 2789/3016 (92.5%) | 80.3% (93.8%) | 38.8% (33.6%) |
| paper-0900 | 0 | 3043/3043 (100.0%) | 18352/19604 (93.6%) | 82.0% (100.0%) | 11.9% (4.9%) |
| phone-0900 | 0 | 2965/2965 (100.0%) | 6926/12859 (53.9%) | 59.3% (80.3%) | 9.3% (8.7%) |
| phone-land-0900 | 0 | 2965/2965 (100.0%) | 3689/4637 (79.6%) | 75.0% (100.0%) | 13.6% (9.3%) |
| hybrid-0900-1h | 0 | 1136/1136 (100.0%) | 2022/2160 (93.6%) | 88.6% (96.4%) | 11.2% (8.7%) |
| hybrid-0900-157 | 0 | 313/313 (100.0%) | 543/600 (90.5%) | 86.2% (96.3%) | 10.0% (8.6%) |
| hybrid-0900-slow | 0 | 313/313 (100.0%) | 584/600 (97.3%) | 93.6% (96.3%) | 11.6% (8.3%) |

### 8. The stills

`stills/sheet.jpg` (made by `sheet.py` from the stills below): each still is a frame of a long run drawn by the app with WebGL while Play runs
(the layout in motion), with the audit's annotation, named on each image (a dashed magenta ring and the id at every formation whose counter the
layout hides in that frame); a `-plain` twin of each has no annotation.
- `stills/hybrid-0830-f450.jpg` (first session): 09:15, Landscape with counters, frame 450 of the 08:30 run. Seven counters hidden: Kellermann,
  Nansouty, d'Hautpoul, Walther and the French Guard cavalry around the Imperial Headquarters, Miloradovich and the Russian Guard cavalry by the
  Pratzen; the live event "Kutuzov orders the 4th Column to face about", which names Miloradovich, is drawn; place names (Stare Vinohrady,
  Pratzen Heights, Austerlitz, Pratzeberg) are drawn. The hidden list is `runs/raw-hybrid-0830.json`'s frame 450 exactly (its record file was
  never written: the first session's stills run stopped before the end).
- `stills/hybrid-1200-f265.jpg` (this session): 12:34, frame 265 of the 12:00 run. Ten counters hidden (the Imperial Headquarters,
  Kellermann, d'Hautpoul, Rivaud, the French Guard infantry and cavalry, the Grenadier Division, Miloradovich, the Russian Guard infantry and
  cavalry), every one under or beside the three protected event labels stacked over Stare Vinohrady ("Napoleon moves forward to Stare
  Vinohrady", "Rapp's counter-charge breaks the Chevalier Guard", "The Russian Guard takes the eagle of the 4th Line"), all three of which name
  hidden formations (the Imperial Headquarters, both Guard cavalries, the Russian Guard infantry); place and arrow labels nearby are drawn. The
  hidden list is the long run's frame 265 exactly. Its WebGL canvas came out black: on this loaded machine (load 21-34) the drawn frame did
  not reach the capture, as with the first session's frames 815 and 1170 (`stills.js` reported no lost context and 846 draw calls); the map
  layer, which is DOM, is as the app laid it out, and it is what the still documents.
- `stills/phone-0900-f1196.jpg` (this session): the phone at 390 x 844 in Landscape with counters, 11:19, frame 1196 of the phone run: six
  corps counters hidden (the Cavalry Reserve, the Imperial Guard, the Fourth Column, the Russian Imperial Guard, the Grenadier Division,
  Liechtenstein's Fifth Column) under the event labels and the plateau's reading; five drawn. The hidden list is the run's frame 1196 exactly.

### 9. Why (the code)

- **The priority rule** (inherited: an echelon ordering is in the Stage 0 build, `archive/stage0-c09c4b23.html`; the counters' `3 + rank` with
  its strength term in the map layer by the spine build, `archive/spine-6b2cccd4.html`): rank = echelon x 0.1 - strength / 10^7 (`app.js:4988`,
  `5114`, `5126`; names `7 + rank`, `5137`); smaller numbers are placed first. Within the division echelon the larger formation wins, so the
  cavalry divisions (830-2,900 men) rank below every infantry division (3,000-13,490), and Miloradovich's 4,800 below all but three of them.
  Live events' labels are protected (`keep:true`, pri 4-4.5, `app.js:5144`) and placed before every counter (`app.js:5476`), on the ground
  where their formations fight; nothing raises the formations an event names. Places are 8-8.5 (`5163`), the plateau's reading 5 (`5151`),
  arrows' labels 6 and objectives 10 (`5157`).
- **The stabiliser** (new in Stage 8, implementation PR 8C, decision 240 (a)): while a motion source lasts the layout is "moving" (`app.js:5342`,
  `5383-5386`); Play is one, with or without Follow, so the whole of Play runs the "hold" strategy (`5474`, `5477-5482`): an item drawn keeps its
  place or one hugging its anchor, else it is held hidden; an item not drawn is tried only at the re-placement passes (every 333 ms) and comes back
  only after room at two successive passes (`MLS.EVERY` 333, `PASSES` 2, `5339`, `5481`), its room taken meanwhile by higher-priority held items
  coming back first (section 22.3's cycle). At rest after motion the "persist" strategy keeps every held place first (`5485-5489`) until a fresh
  view. In the Landscape and on the paper map this is the whole of the hiding (98-100% of hidden frames had room); in Landscape with counters
  about half (26-56%), the rest the crowding a fresh layout also meets.

### 10. What a visitor following the battle loses

In the default Landscape and on the paper map, little: every formation's name or counter is on the screen most of the time it is in view
(Landscape 83-89%, paper map 93%), the gaps are short (mean 0.6 s, at most 2.5 s), and the names blink rather than vanish (about one blink every
six seconds per name at ½x, the trade decision 240 (a) made against jumps). In Landscape with counters, a good deal: following the morning at ½x
(08:30-11:30, 52 s of playback), the four divisions of Murat's Cavalry Reserve, both Guard cavalries and Miloradovich are unlabelled most of the
time; Miloradovich's counter disappears at 09:15, the minute of the event naming him ("Kutuzov orders the 4th Column to face about", whose
label is drawn from 09:07), and does not come back for 28 s of playback (until 10:55); during the Guard cavalry clash (11:00-13:15), the
two formations the event labels name have no counter for nearly all of it. Their figures and outlines stay drawn, and each hidden counter is
reachable by pointing at its formation or from the keyboard (decision 39), but the visitor is not told which unlabelled blocks are which, and a counter that vanishes as its formation's event
begins reads as the formation leaving. On a phone the view with counters is worse (51.7% drawn; Liechtenstein's cavalry never labelled from
09:00 to 12:00); the phone's default Landscape is fine (79.6%, gaps at most 2.3 s).

## Findings

| # | finding | severity, priority | category, origin | status |
|---|---|---|---|---|
| V-1 | Landscape with counters: during Play the same five to eight formations' counters are hidden for most of their time in view, up to 28 s (100 clock minutes) at a stretch; the benchmark's 4,033 ms is its window | S2, P2 | confirmed-defect; new-regression (the stabiliser's half; the crowding half inherited) | confirmed |
| V-2 | The formations a live event names are hidden while their event's label is drawn (the Guard cavalry clash 0-16%; Miloradovich at the face-about 0-40%); the priority rule ignores live events | S2, P2 | confirmed-defect; inherited (worsened by 8C where a fresh layout would draw them) | confirmed |
| V-3 | No check can see long gaps: the motion benchmark's longest-hidden measure saturates at its 121-frame window (its one Play run per presentation starts from a seek at 09:00), and the self-test's day-long Play (`app.js:10045-10048`) only counts the items dropped in one pass every ten clock minutes (at most 19) | S3, P2 | confirmed-defect (test coverage); new-regression (Stage 8's benchmark) | confirmed |
| V-4 | The phone in Landscape with counters: 51.7% drawn, Liechtenstein's Fifth Column never drawn 09:00-12:00, corps counters 47.5% | S3, P3 | confirmed-defect; new-regression / inherited (as V-1) | confirmed |
| V-5 | At rest after Play the kept places leave 0-3 formations hidden that a fresh view would draw, until the next discontinuity | S3, P3 | accepted-compromise (decision 240 (a)) | confirmed |
| V-6 | The Landscape's names blink during Play: 10.6% of in-view frames hidden (a fresh layout 0.1%), in 0.6 s episodes about every 6 s per name | S4, P4 | accepted-compromise (decisions 240 (a), 267 (a)) | confirmed |

Remedies (each needs measuring on the motion block, and an owner decision where it changes decision 240 (a)'s order or a `MOTION.VIS`
baseline): V-1 and V-2, raise the formations a live event names (`EVENTS[].forms`, and their parents where the layer collects the parent) to the
family's priority (`pri` 1) or protect them while the event is live, and let a held item that a fresh layout would place ahead of a kept place
take it at a pass (section 22.3's "kept first while moving" measured a variant: it met the ceilings but failed seven runs' visibility baselines);
V-3, add a long Play run (08:30-11:30 at ½x on the driver, without the draw: about 1-3 minutes) to the motion block with per-formation floors on the
share drawn and ceilings on the longest gap, judged in clock minutes; V-4 as V-1, or fewer counters at the phone's framing; V-5, a fresh layout
once the view has rested for a few passes; V-6 none required.

## What was not checked

- Device timings: every run is on software WebGL or on the driver; the real-time runs' frame pacing is this machine's (median 157 ms without the
  draw; with it, as recorded), not a device's. The 60-frames-a-second driver run stands in for a 60 Hz display.
- The hover run (`runs.js` `hybrid-hover-0900`: a still pointer on Miloradovich while it plays) was not run; whether a visitor can keep a moving
  formation's counter by pointing at it during Play is unmeasured (decision 39's reach by hover is the self-test's, at rest).
- The keyboard's reach to hidden counters during Play, and what a screen reader announces, were not examined here.
- The low Pratzen view, the eye level, the Overview and the opening's played stretches were not run long; nor 1x or 2x speed, nor 10.33x or 1x
  relief, nor the 1280 x 720 or 1024-wide layouts.
- Whether the event-named formations would be drawn if raised (V-2's remedy) was not prototyped; the cost to other items is unknown.
- Geometric overlap of the kept place names with the starved formations' candidate places (section 4's co-occurrence) was not computed.
- The stills show single frames; no clip was recorded.

## Provenance

- First session (an earlier agent, 01:09-02:07 UTC, interrupted by a usage limit): wrote `vis-lib.js`, `long-play.js`, `runs.js`, `analyse.js`,
  `keynums.js`, `realtime.js` and `stills.js`; ran the 17 driver runs (the three benchmark replications validated in a separate directory first,
  identical); made the still at frame 450; its stills at frames 815 and 1170 had a black canvas (the WebGL context lost on this shared machine) and
  were removed (commit `2f3cd78`); its real-time run with the draw played to 10:00 but failed at the Pause click (Playwright's 30 s actionability
  wait under software WebGL), so no record of it was saved.
- This session: `realtime.js`'s Play and Pause made real mouse clicks at the button's centre (the same input without the actionability wait);
  the real-time runs without and with the draw; three driver runs added (`hybrid-0900-157`, the matched pacing; `hybrid-0830-60`; `phone-land-0900`)
  and `hybrid-0900-1h` run; `analyse.js` extended (the formations live events name; the 90-frame windows of every long run; the hidden frames with
  room; the rest summary; the matched-pacing comparison); `readme-tables.js`, `sheet.py`; the stills at 12:34 (`hybrid-1200`, frame 265) and on the phone at 11:19 (`phone-0900`, frame 1196), and the contact sheet; this README and `result.json`.
  The machine was shared with other audit areas' browsers (load averages 16-34 on 4 cores during this session): it does not change the driver's
  counts (its clock is its own), only the real-time runs' pacing, which is recorded.

## Evidence index

- `runs/raw-<run>.json`: every item's per-frame code string, the fresh layout's string, each frame's clock, Play, dwell, pass, motion, counts and
  eye, the run's options, the build's md5 and the browser (`long-play.js`); `runs/sum-<run>.json`: the per-run summary (`vis-lib.js summarise`).
- `runs/realtime-nogl.json`, `runs/realtime.json`: the real-time runs (every layout pass the app made; the page's state before and after; the
  console).
- `tables.json`, `tables.md` (`analyse.js`): every run, per formation and per other item, the priority checks, the time strips, the windows, the
  events' formations, the rest summary, the real-time comparisons, the across-runs table.
- `items.json` (`readme-tables.js`): per run, per formation and per other item, the counts the brief asks for, and the events' formations.
- `stills/`: the stills, their `-plain` twins, `hybrid-1200-stills.json` and `phone-0900-stills.json` (each still's hidden formations with their
  anchors, the clock, the draw calls), and `sheet.jpg`.
- `result.json`: this area's structured result.

## Carried status

- "Counters hidden during playback (4,033 ms; dropped at rest)": **confirmed, and understated by the benchmark.** Open. The 4,033 ms is the
  benchmark's whole window; over longer playback Walther's and Miloradovich's counters, and four more (d'Hautpoul, both Guard cavalries,
  Kellermann), are hidden 12-28 s at a stretch in Landscape with counters; Nansouty's gaps are shorter (2.3-3.7 s) but he is drawn in only
  36-61% of his frames in view.
  Dropped at rest: Nansouty, Walther and Miloradovich are dropped by crowding at 09:14 in that view (a fresh view drops them too); the kept places
  add 0-3 formations per run at rest (V-5).
- "Visibility over longer playback": **measured; acceptable in the default Landscape and on the paper map, not in Landscape with counters**
  (V-1, V-2, V-4), and outside what the benchmark can see (V-3).
