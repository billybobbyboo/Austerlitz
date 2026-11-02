# Final audit after Stage 8: area "history" (internal consistency of the dataset and of what the map shows)

Build audited: `austerlitz-command-map.html`, md5 `f10fe585c46aea576f436ed51ac46f83` (origin/main `43e3e5b`). This area checks the
historical dataset and its presentation for **internal** consistency and labelling only; tracing claims to external sources is two other
agents' work (candidates for them are listed at the end). Nothing in the application, data, tests or build was changed.

## What was examined

- `data.js` (PHASES, FORMATIONS with every track entry and grade, FEATURES, SOURCE_NOTE), `analysis.js` (ANALYSIS, COMMAND, KNOW_OVERRIDE,
  PLANS, ACTS, EVENTS, TOUR), `narrative.js` (CLAIM_WORDS, CLAIM_BY_CLASS, STATEMENT_CLAIMS), the parts of `appearance.js` the dossier
  quotes, `world.js`'s water (GOLDBACH_M, BROOKS_M, LITAVA_M), roads and VILLAGES.
- `app.js`'s presentation: the leaf rule (`ownStrengthAt`, `sideOnFieldAt`, `aggStrength`, app.js:713-756), `plateauStrength`,
  `plateauText`, `paintSituation` (app.js:7349-7380), `centreSeparation`, the card and dossier (`compactCard`, `dossierFormation`,
  `posRow`, `marchRow`, `derivedTag`, app.js:7790-8070), `dossierEvent` (app.js:8285-8335), `evNote`/`evTag`/`evMapText`
  (app.js:3886-3893), `claimTag`/`stmtClaim` (app.js:8109-8118), `paintCommand` and `SRC_LABEL` (app.js:4235-4258), `paintChanges`,
  `waitingFor`, `faceClock`/`enemyFacing` (app.js:5740-5775), the poser's facing rule (app.js:6001-6003), `buildOOB` (app.js:7266-7300),
  `OVERLAYS` (app.js, generated `_ov.js`), POS_CLAIM, CONF_TEXT, TIMING_TEXT, CONF_INTERP, PLATEAU_LAST.
- `tools/stage2/chronology.js` (its rules, NAMES, CONFLICTS), `audit.js`, `sim-test.js`; the prior audit (`docs/FINAL_AUDIT.md` 2.1-2.4),
  `docs/ROADMAP.md`, the step-4 questions, the step-5 questions, `docs/stage8-evidence/8k/register.md`, the 8J records, CHANGELOG entries.

## How

Node scripts in an isolated copy of the repository (`history-iso`, built from the audit's template; `tools/mk-world-mod.js` and
`tools/mk-helpers.js` run there only). Each script loads the world module, the five data files and the generated helpers into one global
scope exactly as `sim-test.js` does (`tools/audit-post8/history/load.js`), and where a needed function is not among the generated helpers it
is extracted from the live `app.js` by declaration name (`facing.js`: `faceClock`, `posAtT`, `enemyFacing`). Archived builds were read for
history (`archive/stage0-*`, `step2-*`, `step4-*`, `stage8h-*`, `stage8j-*`).

Commands (run from `tools/audit-post8/history/`, with `ISO` pointing at the isolated copy; outputs in this directory):

| script | output | what it checks |
|---|---|---|
| `overview.js` | `formations-overview.txt` | the hierarchy, strengths, commanders, anchors and grades of all 40 formations |
| `strengths.js` | `strengths.txt` | aggregate vs children; the leaf rule's totals over the day; the army totals; the plateau reading against tour stop 4; counters drawn at once for a parent and its child |
| `refs.js` | `refs.txt` | every parent/child pair; every id named by EVENTS, ANALYSIS, PLANS, KNOW_OVERRIDE, TOUR; every moment |
| `event-claims.js` | `event-claims.txt` | each event's pill claim against its statements' claims |
| `command-claims.js` | `command-claims.txt` | each Command row's DOCUMENTED / THIS MAP'S READING / ANECDOTE label against its statement's claim |
| `claim-text-scan.js` | `claim-text-scan.txt` | claims by statement class (704 statements, 484 unchecked); "fact" claims against their own words (none: no statement is claimed fact) |
| `phase-lines.js` | `phase-lines.txt` | timeline lines against their phases, events against the lines of their phase |
| `grades.js` | `grades.txt` | every anchor's grade, declared or carried forward; the 44 A grades carried forward |
| `legs-water.js` | `legs-water.txt` | every leg against the Goldbach, the brooks and the Litava; every anchor's side of the Goldbach against its act |
| `proximity.js`, `closest.js` | `proximity.txt`, `closest-approach.txt` | opposing formations' centres within 350 m / their closest approach (1-minute samples) |
| `facing.js` | `facing.txt` | S-5's facing of halted formations against the opponents their acts name |
| `motion-vs-status.js` | `motion-vs-status.txt` | moving formations with an offensive status moving away from the enemy (they face their heading), and the reverse |
| `drift.js` | `drift-legs.txt` | legs over 90 min under 1 km/h, with the status shown and the dossier's "Marching" row |
| `centre-sep.js` | `centre-sep.txt` | when the derived centre separation is reported, and by which French formation |
| `caffarelli.js` | `caffarelli-bagration.txt` | Caffarelli against Bagration and the highway from 11:15 |
| `conflicts.js` | `named-conflicts.txt` | the four named conflicts: drawn leg, act, claims, event, phase lines |
| `names.js` | `name-variants.txt` | proper-name spellings within edit distance 1 across all visitor strings |
| `probes.js <name>` | `plateau-day.txt`, `guard-attack-motion.txt`, `legrand-through-castle.txt`, `blasowitz-guard.txt`, `sokolnitz-defence.txt`, `litava-anchors.txt` | the probes behind the findings below |
| (isolated copy) `node sim-test.js`, `node audit.js` | `sim-test-iso.txt`, `audit-js-iso.txt` | the suites' own readings on this build: 0 errors |

## What was found (details, severity and remedies in the structured result)

Sound, verified:
- **No double counting in any total.** The leaf rule holds (app.js:730-756): the Santon is now Suchet's child (prior D-3 fixed), Kamensky
  Langeron's; `sideOnFieldAt` peaks at 68,300 French (of the 73,000 army figure) and 79,560 Allied (of 85,400), never above either; the
  plateau reads 38,700 at 04:00 and 19,300 from 07:21, matching tour stop 4's "about 39,000 ... about 19,000 by 07:25". Every
  aggregate's declared strength minus its children's is explained in its note except Buxhowden's (40,000 vs 39,230: inside "33,000-40,000").
  Arithmetic in the notes checks (Kienmayer 3,400 + 2,940; the Guard's rows 4,430 and 2,900; Sokolov's IV Corps 24,690; III Corps' odds).
- References: 0 errors (every parent, child, event, theme, plan, override and tour reference resolves).
- Prior fixes still hold: H-1's Kamensky/columns/Rapp events now "disputed" with both hours; H-2 (Drouet holds until 08:45); H-3 (the
  plateau label says derived); H-4, H-12, H-13, H-14 (texts), H-18; D-3 and D-4; S-5 (facing a function of the clock).
- The 8K re-plots carry the register's grades (suchet@0 B, @5-@8 C, @9 B; bag@0 B, @5 B, @6-@7 C, @8 B, @9 C); 8J's III Column at the castle B.
- Facing of halted formations: no fighting formation faces away from an opponent its act names (end-of-day cases only).

Problems (the structured result has each with evidence):
1. The Russian Guard, Liechtenstein's and Miloradovich's columns are drawn moving **away** from the enemy for 40-85 minutes while their
   status reads "Counter-attacking"/"Charging" (the default leg timing starts the next leg on arrival; a moving block faces its heading).
2. **New in 8J:** Legrand's division marker walks through the Sokolnitz castle and the III Column holding it (37 m at 08:51; 25 m from the
   castle at 08:45) while its act says it fights for Sokolnitz: 8J moved the III Column onto Legrand's unchanged interpolated leg.
3. The face-about event shows the pill "Fact" and "Attested in the standard accounts of the battle" beside its own why claimed "This map's
   reading" (no account read has Kutuzov give that order).
4. The Russian Guard's plotted approach (Krzenowitz at dawn, graded A; A carried to 10:30) contradicts the project's own A-graded readings
   (the disposition: behind Blasowitz and Kruh at daybreak; Stutterheim: onto the heights by Blasowitz and Krug, Blasowitz occupied by its
   jägers); at the event "The French take Blasowitz from the Russian Guard" no Allied formation stands within 1.4 km of the village; the plan
   and the plan theme say "behind Krzenowitz".
5. 44 of 88 A grades are carried forward from an earlier anchor (Caffarelli's pursuit, the cavalry's, the Allied retreats), against the
   rule 8K applied to Suchet's neighbouring anchors (C where no reading places the formation then).
6. Three events whose own texts say the hour is disputed carry "Estimate"/"Fact" (decision, guard-attack; ice via its phase line).
7. Kamensky's named conflict: the map draws his brigade turning back from 08:00 (before the French climb at 08:45), not "in the 08:45 phase"
   as SOURCE_NOTE, the event and the arrow say; the derived plateau reading rises 19,300 to 23,550 at 08:29 with no French on the plateau.
8. Kienmayer at 12:45 "Holding west of the Goldbach" 0.9 km **east** of the drawn brook, since Stage 0 (8J's record calls it a corrected-brook offset).
9. Caffarelli's objective "Push Bagration off the highway" shown 12:45-17:00 while 1.5-2.2 km south of the highway and 1.6-2.6 km from
   Bagration, moving away, graded A carried; the records' "2.5-2.9 km" measures 2.1-2.6 km here.
10. Bourcier's dragoons pass through Kienmayer (26 m) and Dokhturov (12 m) on the Telnitz-Augezd track; Miloradovich's 14:30 anchor stands
    19 m from the Litava's line, its legs crossing the river twice with no road; the movement audit tests neither interpenetration nor rivers.
11. Sokolnitz village has no formation of either side within 0.79 km from 09:00 to 13:15 although the texts have it taken and retaken and
    "Defended by Legrand, then Friant" (Friant is never drawn there); Langeron "storming" it from 0.98 km away across the brook (graded A).
12. The Command tab prints DOCUMENTED on 31 of its 35 DOCUMENTED rows that the claims register calls "Not yet checked"; the Allied phase-5 row "knew ... Blasowitz had
    fallen" is shown from 10:30, before the 11:15 fall; a "Could see" row holds a historiographical dispute.
13. Smaller items: the dossier's "Marching" beside "In reserve"/"Concealed" on 63 drift legs (decision 45 accepts the drift, not the label);
    "Arm: Guard infantry" on both Guard corps; Langeron's counter 11,700 beside Kamensky's 4,250 (no note says "including"); Buxhowden's
    "≈ 40,000" without its range on card and counter; Krug and Bellowitz drawn as settled villages though open questions; Kologrivov's
    command shown unqualified and "unchecked"; the Chevalier Guard counted from 04:00 though the data has it come up late; "Crosses the
    Goldbach" in phase 2 for two divisions still west of the drawn stream; ahq@4's order to Kamensky two phases before he retires;
    G-3 (Miloradovich A "near Pratzen village" 1.6 km from it) still open; unaccented "a Pied", "Imperiale", "Reserve", "emigre",
    "Frederic"; the guard_inf commander field holds a composition; data.js's header comment gives the frame as ~13 x ~10 km (it is 21.5 x 15.8 km).

Accepted compromises noted (owner decisions): the four named conflicts (decision 42, the tracks keep the map's timing); the Russian Guard
corps kept at 10,500 above its drawn 7,330 (decision 213 (b)); Bagration drawn toward Rausnitz at nightfall (decision 180 (c), "not now");
creeping undated moves (decision 45); kollo's forced 10:15-10:30 leg (decision 181 (a)); the vineyard bank (decision 135); the accents
decided for six names only (decision 209 (a)).

## What could not be checked, and why

- Whether the historical claims are true against the sources: out of this area (two other agents); the register's quotations were read
  here only where an internal contradiction needed them (C6.21, C6.c6).
- Anything drawn: no browser in this phase. The visible consequences above (headings, overlaps, labels) are computed from the model and the
  presentation code, not seen; the browser phase notes list how to see each.
- The exact drawn width of the Litava ribbon and the blocks' frontages at the overlaps (only centres were compared).
- The opening's camera at 08:45 (whether Legrand's walk-through is in its view).

## Candidates for the source-tracing agents

The Russian Guard's place 07:00-11:00 (C6.21, C6.c6 against rg_inf@0/@5, rg_cav@0); the inherited-A anchors listed in `grades.txt`;
Caffarelli's afternoon route; Kologrivov; Krug's place (8K register §1.1's "Kruch"); Legrand's route after 08:00 (Levasseur's brigade only?);
who held Sokolnitz village 09:00-13:00; the Chevalier Guard's arrival; milo@0 (G-3).
