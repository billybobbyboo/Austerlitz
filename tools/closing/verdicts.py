#!/usr/bin/env python3
"""The closing re-verification pass: each of the 158 findings' verdict on the final roadmap's build (md5 8c0d383e), with its evidence.
Verdicts (docs/ROADMAP_FINAL_AUDIT.md, "Closing"):
  fixed    re-verified on this build: the audit's probe (or the remedy's own measure) no longer shows the defect; "held" names the check that
           fails without the fix (from the work package's negative controls), or "no check" where nothing holds it
  kept     left as it is by an owner decision or as an accepted compromise, re-measured where a measure exists
  carried  open: not done, done in part, or needing the owner's run; it goes forward
Each entry: verdict, evidence (files under docs/closing-evidence/, or a check and its log), held (the check that holds a fix), note.
python3 tools/closing/verdicts.py [--json out.json] [--md out.md]   Reads only."""
import csv, json, sys
sys.path.insert(0, __file__.rsplit("/", 1)[0])
from claimed import C as CLAIMED
V = {}
def v(ids, verdict, evidence, held="", note=""):
    for i in ids.split():
        assert i not in V, i
        assert verdict in ("fixed", "kept", "carried"), verdict
        V[i] = {"verdict": verdict, "evidence": evidence, "held": held, "note": note}
E = "docs/closing-evidence/"
# ---------------------------------------------------------------- history (Claude's history probes, re-run on the isolated copy)
v("CL-HIS-01", "fixed", E+"history/event-claims.txt (face-about: pill recon, why disputed; the audit's flag gone)",
  "test.js (the event's claims, their readings and hashes)", "labelled a reconstruction with five sides, as WP-01 chose")
v("CL-HIS-06", "fixed", E+"history/event-claims.txt (decision, soult, guard-attack, ice: pill disputed with their disputes)", "test.js (claims)")
v("CL-HIS-02", "fixed", E+"history/grades.txt (A carried forward 44 -> 0; graded A 88 -> 37)", "test.js, the grading rule (WP-03's negative controls)")
v("CL-HIS-03", "fixed", E+"history: rg_inf@5's act 'Where it stood is divided ...', grade C", "test.js (claims)")
v("CL-HIS-04", "fixed", E+"history/legrand-through-castle.txt (closest to the castle 720 m at 08:00, moving away; the audit 25 m)",
  "sim-test.js's fight register and the Sokolnitz rule (WP-03 M4)")
v("CL-HIS-05", "fixed", E+"history/motion-vs-status.txt (no Guard, Liechtenstein or Miloradovich leg away from the enemy; the audit 80-85 min each)",
  "sim-test.js rule 285 (a) (legs from an offensive status into a retreat held; 0 minutes moving into a retreat under an offensive status)",
  "nine short cases of 5-20 minutes remain of a formation moving away from its nearest enemy under an offensive status (kollo, legrand, c_gren and "
  "the two retreats toward an enemy as at the audit; caffarelli, suchet, nansouty, vandamme new or shifted); rule 285 (a) tests legs into a "
  "retreat, not these, so no check holds them")
v("CL-HIS-07", "fixed", E+"history/plateau-day.txt (Kamensky holds at [259,316] through 08:45, heading none; the audit turned from 08:10)",
  "check:chronology (WP-03 M2)")
v("CL-HIS-08", "fixed", E+"history: kienmayer@7's act names both, the cavalry west of the brook and the point drawn this map's, grade C",
  "test.js (claims)", "the point is not moved (handed on by WP-03)")
v("CL-HIS-09", "fixed", E+"history/caffarelli-bagration.txt (the objective 'Attack Bagration's left at Krug and Holubitz', where it is drawn)",
  "test.js (claims)")
v("CL-HIS-10", "fixed", E+"history/closest-approach.txt (opposing centres: 13 m only in the recorded fight Saint-Hilaire/Kamensky; the audit 12-37 m in four "
  "pairs); history/legs-water.txt (Litava crossings 5 -> 2, both at Augezd)", "sim-test.js's fight register (MELEE)")
v("CL-HIS-11", "fixed", E+"history/sokolnitz-defence.txt (Legrand within 0.51 km to 10:00, Friant on the village from 10:30; the audit empty 09:00-13:15)",
  "sim-test.js's Sokolnitz rule (WP-03)")
v("CL-HIS-13", "fixed", "runtime-test.js 'the march row ... a drift named Plotted ... never Marching' (npm test, "+E+"checks/npm-test.txt)",
  "runtime-test.js (WP-03 M3)", "the audit's drift-legs.txt reads marchRate().moving, a model value the fix leaves as it is (56 drifts, 63 at the audit)")
v("CL-REC-06", "fixed", E+"history: milo@0 B, its act 'In two lines behind the III Column ...'", "test.js (claims)")
v("CL-HIS-16 CL-HIS-17", "kept", "CHANGELOG (WP-03: kept as they are)", "", "accepted compromises")
# ---------------------------------------------------------------- state (props-helpers, props-bundle, props-bundle2, props-bundle3)
v("CL-SIM-01", "fixed", E+"state/props-bundle2.txt (C1-C3: the card and the dossier repainted 3 times within a leg, at the clock's place; place lists 0 of 240 "
  "differ, the audit 86)", "the self-test 'dossiers (WP-05, CL-SIM-01)'; runtime-test.js")
v("CL-SIM-03", "fixed", E+"state/props-bundle.txt (a theme chosen while playing: playing after false, the clock held at 240; the audit ran on to 250)",
  "runtime-test.js (WP-05)")
v("CL-SIM-04", "fixed", E+"state/props-bundle.txt (B-series fades: 0 outgoing pops, the reached opacity carried; the audit 5)", "runtime-test.js (WP-05)")
v("CL-SIM-06", "fixed", E+"state/props-bundle.txt (0 formation-minutes whose reading depends on the path; the audit 29 and 38)", "runtime-test.js (WP-05)")
v("CL-UX-14", "fixed", "app.js jumpEvent (t+1e-6, forward); runtime-test.js 'the event keys' margin (CL-UX-14)' (npm test)", "runtime-test.js",
  "the audit's props-helpers P4 copies the old rule (t+1.5) and so still prints 20 of 21: it cannot see the fix")
