#!/usr/bin/env python3
"""Final audit after Stage 8: the consolidated register (docs/audit-post8-evidence/register.json).

Audit tooling only. Each entry is one audit finding with a stable identifier CL-<GROUP>-NN; 'from' names the area finding it rests on
(area, 0-based index into docs/audit-post8-evidence/<area>/result.json), 'also' the area findings merged into it as the same issue
(same subsystem, same failure scenario: docs/FINAL_AUDIT_POST_STAGE8.md H.3), 'override' the auditor's corrections after the adversarial
verification (docs/audit-post8-evidence/verification/*.json), 'verify' the verdict, 'note' the auditor's note. 'set_aside' lists area
findings that are not findings (a confirmation that a decision is implemented as decided), reported in section C instead.
Run: python3 tools/audit-post8/register.py   (then python3 tools/audit-post8/report.py)
"""
import json, os, glob
from collections import defaultdict

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
EV = os.path.join(ROOT, "docs", "audit-post8-evidence")

GROUPS = {
    "CL-HIS": "history: the reconstruction against its own sources and readings",
    "CL-SRC": "sources: forces, timings and places traced to what the sources print",
    "CL-GEO": "geography: relief, water, settlements and landmarks",
    "CL-SIM": "simulation, state and the readings",
    "CL-UX": "interaction, accessibility and first use",
    "CL-MAP": "the map layer, labels, map furniture and the paper map",
    "CL-VIS": "the rendered picture",
    "CL-TEST": "tests, benchmarks and CI",
    "CL-PERF": "performance and the device evidence",
    "CL-ROB": "robustness, security, dependencies and maintainability",
    "CL-REC": "the records and documentation",
}

# (id, from-area, index, [also (area, index)], note)
MAP = [
    # history
    ("CL-HIS-01", "history", 2, [("sources-chronology", 2)], "Merged: the history area found the pill contradicting the event's own text; the chronology area found which side the sources support (the order is given by Schonhals p. 162 and Stutterheim pp. 63-64, which the project has read)."),
    ("CL-HIS-02", "history", 4, [], ""),
    ("CL-HIS-03", "history", 3, [], ""),
    ("CL-HIS-04", "history", 1, [], ""),
    ("CL-HIS-05", "history", 0, [], "Related, not the same issue: CL-VIS-03 (the facing rule on slow drifts)."),
    ("CL-HIS-06", "history", 5, [("sources-chronology", 1)], "Merged: one labelling rule, three events found by the history area and a fourth, the Pratzen climb, by the chronology area."),
    ("CL-HIS-07", "history", 6, [], ""),
    ("CL-HIS-08", "history", 7, [], ""),
    ("CL-HIS-09", "history", 8, [], ""),
    ("CL-HIS-10", "history", 9, [], "CL-HIS-04 is its one new instance; CL-TEST-04 is the missing check."),
    ("CL-HIS-11", "history", 10, [], ""),
    ("CL-HIS-12", "history", 11, [], ""),
    ("CL-HIS-13", "history", 12, [], ""),
    ("CL-HIS-14", "history", 13, [], "Overlaps CL-GEO-07 (Krug's place) and CL-SRC-03 (Kologrivov's command); this entry is the qualification a visitor is not shown."),
    ("CL-HIS-15", "history", 14, [], ""),
    ("CL-HIS-16", "history", 16, [], ""),
    ("CL-HIS-17", "history", 17, [], ""),
    # sources (forces)
    ("CL-SRC-01", "sources-oob", 0, [], ""),
    ("CL-SRC-02", "sources-oob", 1, [], ""),
    ("CL-SRC-03", "sources-oob", 4, [], ""),
    ("CL-SRC-04", "sources-oob", 5, [], ""),
    ("CL-SRC-05", "sources-oob", 2, [], ""),
    ("CL-SRC-06", "sources-oob", 3, [], ""),
    ("CL-SRC-07", "sources-oob", 6, [], ""),
    ("CL-SRC-08", "sources-oob", 7, [], ""),
    ("CL-SRC-09", "sources-chronology", 0, [], ""),
    # geography
    ("CL-GEO-01", "geography", 0, [], ""),
    ("CL-GEO-02", "geography", 5, [], ""),
    ("CL-GEO-03", "geography", 2, [], ""),
    ("CL-GEO-04", "geography", 1, [], ""),
    ("CL-GEO-05", "geography", 3, [], ""),
    ("CL-GEO-06", "geography", 4, [], ""),
    ("CL-GEO-07", "geography", 6, [], ""),
    ("CL-GEO-08", "geography", 7, [], ""),
    ("CL-GEO-09", "geography", 8, [], ""),
    ("CL-GEO-10", "geography", 9, [], ""),
    # simulation, state, readings
    ("CL-SIM-01", "state", 0, [], ""),
    ("CL-SIM-02", "visual-maps", 3, [], "The same family as CL-SIM-05 (decision 251 (a)'s reach): drawn overlays here, a card's text there."),
    ("CL-SIM-03", "state", 1, [], ""),
    ("CL-SIM-04", "state", 2, [("interaction", 3)], "Merged: the interrupted fade (state) and the Movement layer off (interaction) are two scenarios of one opacity rule in applyOverlayOpacity."),
    ("CL-SIM-05", "interaction", 4, [], ""),
    ("CL-SIM-06", "state", 4, [], ""),
    ("CL-SIM-07", "state", 3, [], ""),
    ("CL-SIM-08", "interaction", 5, [], ""),
    # interaction, accessibility, first use
    ("CL-UX-01", "a11y", 0, [], ""),
    ("CL-UX-02", "interaction", 0, [], ""),
    ("CL-UX-03", "visual-maps", 0, [("a11y", 3), ("interaction", 2)], "Merged: one hit-area rule, measured on a phone by two areas and at the playhead on a desktop by a third."),
    ("CL-UX-04", "interaction", 1, [], ""),
    ("CL-UX-05", "a11y", 2, [], ""),
    ("CL-UX-06", "a11y", 4, [], ""),
    ("CL-UX-07", "visual-maps", 6, [], ""),
    ("CL-UX-08", "a11y", 1, [], ""),
    ("CL-UX-09", "a11y", 5, [], ""),
    ("CL-UX-10", "a11y", 6, [], ""),
    ("CL-UX-11", "a11y", 7, [], ""),
    ("CL-UX-12", "a11y", 8, [], ""),
    ("CL-UX-13", "state", 6, [], ""),
    ("CL-UX-14", "state", 5, [], ""),
    ("CL-UX-15", "a11y", 9, [], ""),
    ("CL-UX-16", "a11y", 10, [], ""),
    ("CL-UX-17", "a11y", 11, [], ""),
    ("CL-UX-18", "a11y", 12, [], "Overlaps CL-MAP-06 on the phone caption's orphan separators."),
    ("CL-UX-19", "interaction", 6, [], ""),
    ("CL-UX-20", "interaction", 7, [], ""),
    # map layer, labels, furniture, paper map
    ("CL-MAP-01", "visibility", 0, [], ""),
    ("CL-MAP-02", "visibility", 1, [], ""),
    ("CL-MAP-03", "visual-maps", 1, [], ""),
    ("CL-MAP-04", "visual-maps", 2, [], ""),
    ("CL-MAP-05", "visual-maps", 4, [], ""),
    ("CL-MAP-06", "visual-maps", 5, [], ""),
    ("CL-MAP-07", "visibility", 3, [], ""),
    ("CL-MAP-08", "visual-maps", 7, [], ""),
    ("CL-MAP-09", "visual-maps", 8, [], ""),
    ("CL-MAP-10", "visual-maps", 9, [], ""),
    ("CL-MAP-11", "visual-maps", 10, [], ""),
    ("CL-MAP-12", "visual-maps", 11, [], ""),
    ("CL-MAP-13", "visual-maps", 12, [], ""),
    ("CL-MAP-14", "visibility", 4, [], ""),
    ("CL-MAP-15", "visual-maps", 13, [], ""),
    ("CL-MAP-16", "visual-maps", 14, [], ""),
    ("CL-MAP-17", "visibility", 5, [], ""),
    ("CL-MAP-18", "visual-maps", 15, [], ""),
    ("CL-MAP-19", "visual-maps", 16, [], ""),
    ("CL-MAP-20", "visual-maps", 17, [], ""),
    # rendered picture
    ("CL-VIS-01", "visual-landscape", 0, [], ""),
    ("CL-VIS-02", "visual-landscape", 1, [], ""),
    ("CL-VIS-03", "visual-landscape", 2, [], "Related, not the same issue: CL-HIS-05 (legs whose direction contradicts the status)."),
    ("CL-VIS-04", "visual-landscape", 3, [], "CL-HIS-04 is the one between opposing formations that Stage 8 introduced."),
    ("CL-VIS-05", "visual-landscape", 4, [], ""),
    ("CL-VIS-06", "visual-landscape", 6, [], ""),
    ("CL-VIS-07", "visual-landscape", 5, [], ""),
    ("CL-VIS-08", "visual-landscape", 7, [], ""),
    ("CL-VIS-09", "state", 7, [], ""),
    # tests, benchmarks, CI
    ("CL-TEST-01", "tests", 0, [], ""),
    ("CL-TEST-02", "visibility", 2, [], "Related, not the same issue: CL-TEST-14 (what the motion ceilings mean)."),
    ("CL-TEST-03", "tests", 1, [], ""),
    ("CL-TEST-04", "history", 15, [], ""),
    ("CL-TEST-05", "tests", 2, [], ""),
    ("CL-TEST-06", "tests", 3, [], ""),
    ("CL-TEST-07", "tests", 4, [], ""),
    ("CL-TEST-08", "tests", 5, [("robustness", 5)], "Merged: the robustness area found the hook and its mirror equal today; the finding is that nothing holds them so."),
    ("CL-TEST-09", "tests", 7, [], ""),
    ("CL-TEST-10", "tests", 8, [], ""),
    ("CL-TEST-11", "tests", 10, [], ""),
    ("CL-TEST-12", "tests", 11, [], ""),
    ("CL-TEST-13", "tests", 12, [], ""),
    ("CL-TEST-14", "tests", 13, [], ""),
    ("CL-TEST-15", "tests", 6, [], ""),
    ("CL-TEST-16", "tests", 9, [], ""),
    ("CL-TEST-17", "tests", 14, [], ""),
    ("CL-TEST-18", "tests", 15, [], ""),
    ("CL-TEST-19", "tests", 16, [], ""),
    ("CL-TEST-20", "tests", 17, [], ""),
    # records
    ("CL-REC-01", "records", 1, [], "Related, not the same surface: CL-UX-11 (the app's own first screen)."),
    ("CL-REC-02", "records", 0, [], ""),
    ("CL-REC-03", "records", 2, [], ""),
    ("CL-REC-04", "records", 5, [], ""),
    ("CL-REC-05", "records", 6, [], ""),
    ("CL-REC-06", "records", 4, [], ""),
    ("CL-REC-08", "records", 3, [], ""),
    # robustness, security, dependencies, maintainability
    ("CL-ROB-01", "robustness", 0, [], ""),
    ("CL-ROB-02", "robustness", 1, [], ""),
    ("CL-ROB-03", "robustness", 2, [], ""),
    ("CL-ROB-04", "robustness", 3, [], ""),
    ("CL-ROB-05", "robustness", 4, [], ""),
    ("CL-ROB-06", "robustness", 7, [], ""),
    ("CL-ROB-07", "robustness", 6, [], ""),
    ("CL-ROB-08", "robustness", 8, [], ""),
    ("CL-ROB-09", "records", 7, [("robustness", 9)], "Merged: the records area read decision 140's premise, the robustness area the payload; one issue, the self-test shipped in the product."),
    ("CL-ROB-10", "robustness", 10, [], ""),
    ("CL-ROB-11", "robustness", 11, [], ""),
    ("CL-ROB-12", "robustness", 12, [], ""),
    # performance and the device evidence
    ("CL-PERF-01", "perf", 1, [], ""),
    ("CL-PERF-02", "perf", 5, [], ""),
    ("CL-PERF-03", "perf", 0, [], ""),
    ("CL-PERF-04", "perf", 2, [], ""),
    ("CL-PERF-05", "perf", 3, [], ""),
    ("CL-PERF-06", "perf", 4, [], ""),
    ("CL-PERF-07", "perf", 8, [], ""),
    ("CL-PERF-08", "perf", 6, [], ""),
    ("CL-PERF-09", "perf", 7, [], ""),
    ("CL-PERF-10", "perf", 9, [], ""),
    ("CL-PERF-11", "perf", 10, [], ""),
    ("CL-PERF-12", "perf-attribution", 0, [], "Refines CL-PERF-04: the excess reproduces on one fixed browser, so the unrecorded Chrome update does not explain it."),
    ("CL-PERF-13", "perf-attribution", 1, [], ""),
    ("CL-PERF-14", "perf-attribution", 2, [], ""),
]
SET_ASIDE = [("geography", 10), ("sources-oob", 8)]

# the auditor's resolution of the verification: tools/audit-post8/resolution.py
import sys as _sys
_sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from resolution import OVERRIDE, VERDICT, NOTES, WP
WP_OF = {i: w for w, ids in WP.items() for i in ids}
# the auditor's own checks (read or reproduced personally, independently of the areas and the verifiers): id -> text
AUDITOR = {
    "CL-HIS-01": "The auditor read analysis.js:292-294: the event 'face-about' carries claim:\"fact\" while its own why says 'That he ordered the column to face about is this map's reading': confirmed.",
    "CL-HIS-02": "The auditor traced the grade inheritance: an anchor without cf takes the previous anchor's grade (data.js tracks; stateAt), shown as 'Position documented in the sources' (app.js:7731 CONF_TEXT.A); 44 of 88 A grades are so carried: confirmed.",
    "CL-HIS-04": "The auditor reproduced the distance: Legrand's interpolated position at 08:50 is about 39 m from the III Column's re-plotted place (data.js:227-228; LANDMARK_SITES.castle, world.js:162): confirmed.",
    "CL-SIM-01": "The auditor read app.js:3498 and 7720-7728: within a phase the dossier is repainted only when drawerKey changes, and the key holds each leaf's text phase, moving or standing, and hidden state, not its place or the clock: confirmed by reading.",
    "CL-SIM-03": "The auditor read app.js:4193-4207: setChapter sets the clock and flies the camera but never calls stopPlay: confirmed by reading.",
    "CL-UX-02": "The auditor read app.js:6309-6322 and 6479-6530: the glide runs in the tween's 'cam' slot to its end; a pan, zoom or key move calls free() (freeCam=true) but never clears _tw.cam, so the next frames apply the glide's arc again: confirmed by reading.",
    "CL-MAP-04": "The auditor read shell.html:206-215 and style.css: the only rose is inside the legend's toggle button; style.css hides .legend below 430 px tall and .legend .rose below 700 px tall: confirmed in part by reading (the width and Watch/Clean conditions left to the verifiers).",
}
# entries added for the areas finished later (records, sources-chronology, robustness, perf-attribution): appended by EXTRA
EXTRA = []


def load_verdicts():
    """every verifier verdict by (area, index): list of (label, lens, verdict, method, evidence, corrected, notes)"""
    out = defaultdict(list)
    for f in sorted(glob.glob(os.path.join(EV, "verification", "*.json"))):
        try:
            d = json.load(open(f, encoding="utf-8"))
        except Exception:
            continue
        lab = d.get("label") or os.path.basename(f)[:-5]
        lens = "repro" if "repro" in lab else "premise" if "premise" in lab else "batch"
        for v in d.get("verdicts", []):
            try:
                key = (v["area"], int(v["index"]))
            except Exception:
                continue
            out[key].append(dict(label=lab, lens=lens, verdict=v.get("verdict"), method=v.get("method", ""), evidence=v.get("evidence", ""),
                                 corrected=v.get("corrected") or {}, notes=v.get("notes", ""), duplicate_of=v.get("duplicate_of", "")))
    return out


RANK = {"REFUTED": 0, "WEAKENED": 1, "DUPLICATE": 2, "PLAUSIBLE": 3, "CONFIRMED": 4}


def combine(vs):
    """the register's verification line: every lens's verdict; the summary verdict is the most adverse one (REFUTED and WEAKENED are
    then resolved by the auditor in VERDICT/OVERRIDE, never silently)"""
    if not vs:
        return {}
    worst = min(vs, key=lambda v: RANK.get(v["verdict"], 9))
    parts = ["%s (%s)" % (v["verdict"], v["lens"]) for v in vs]
    return {"verdict": worst["verdict"], "lenses": parts, "detail": vs}


def main():
    V = load_verdicts()
    entries = []
    for cid, a, i, also, note in MAP + EXTRA:
        e = {"id": cid, "from": [[a, i]], "also": [list(x) for x in also], "note": " ".join(x for x in (note, AUDITOR.get(cid, ""), NOTES.get(cid, "")) if x)}
        vs = list(V.get((a, i), []))
        for x in also:
            vs += V.get(tuple(x), [])
        c = combine(vs)
        if cid in VERDICT:
            c = dict(c, **VERDICT[cid])
        if c:
            lens_txt = "; ".join(c.get("lenses", []))
            e["verify"] = {"verdict": c.get("verdict"), "note": (c.get("note") or "") + ((" [lenses: " + lens_txt + "]") if lens_txt else "")}
        if cid in OVERRIDE:
            e["override"] = dict(OVERRIDE[cid])
        e.setdefault("override", {})["work_package"] = WP_OF.get(cid, "")
        entries.append(e)
    ids = [e["id"] for e in entries]
    miss = [i for i in ids if i not in WP_OF]
    extra = [i for i in WP_OF if i not in ids]
    dup = [i for w, l in WP.items() for i in l if sum(i in l2 for l2 in WP.values()) > 1]
    if miss or extra or dup:
        print("WP problems: missing", miss, "unknown", extra, "in two packages", sorted(set(dup)))
    assert len(ids) == len(set(ids)), "duplicate ids"
    reg = {"groups": GROUPS, "findings": entries, "set_aside": [list(x) for x in SET_ASIDE]}
    json.dump(reg, open(os.path.join(EV, "register.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    n = defaultdict(int)
    for e in entries:
        n[(e.get("verify") or {}).get("verdict", "unverified")] += 1
    print("register.json: %d entries; verification %s" % (len(entries), dict(n)))


if __name__ == "__main__":
    main()
