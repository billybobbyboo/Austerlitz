#!/usr/bin/env python3
"""Final audit after Stage 8, area visual-maps: a clip's per-frame log (clips.js <clip>.json) as item timelines.
For every formation counter (c:) or name (n:) seen in the clip: one character per captured frame (# drawn, . dropped, h held by the
stabiliser, - not in the layer this frame: off screen, under a panel, behind the ground or out of the layer), its pops (drawn <-> not drawn while
in the layer in both frames) and its longest stretch in the layer but not drawn, in captured frames and in ms of the visitor's time.
python3 -I tools/audit-post8/visual-maps/clip-report.py <clip.json> [out.md]   Measurement code only."""
import sys, json
J = json.load(open(sys.argv[1]))
F = J["frames"]
every = 1   # since the clip logs the layer at every driver frame (30 fps); the captured frames carry "captured"
ms_per = every * 1000 / 30
keys = sorted({x.split("=")[0] for f in F for x in f["items"]})
rows = []
for k in keys:
    s = []
    for f in F:
        st = dict(x.split("=", 1) for x in f["items"]).get(k)
        if st is None: s.append("-")
        elif st.endswith("*"): s.append("h")
        elif st == "on": s.append("#")
        elif st == "dropped": s.append(".")
        else: s.append("-")
    line = "".join(s)
    pops = sum(1 for a, b in zip(line, line[1:]) if a != "-" and b != "-" and ((a == "#") != (b == "#")))
    best = cur = 0
    for c in line:
        cur = cur + 1 if c in ".h" else 0
        best = max(best, cur)
    drawn = line.count("#"); inl = sum(1 for c in line if c != "-")
    rows.append((k, line, pops, best, drawn, inl))
out = ["# %s: item timelines (%d driver frames logged at 30 fps, %.0f ms each; %d captured)" % (J["clip"], len(F), ms_per, sum(1 for f in F if "captured" in f)), "",
       J.get("note", ""), "", "Legend: # drawn, . dropped, h held, - not in the layer (off screen, under a panel, behind the ground, out of the layer).", "",
       "| item | drawn / in layer | pops | longest hidden (frames, ms) |", "|---|---|---|---|"]
for k, line, pops, best, drawn, inl in sorted(rows, key=lambda r: -r[3]):
    out.append("| `%s` | %d / %d | %d | %d, %.0f |" % (k, drawn, inl, pops, best, best * ms_per))
out += ["", "```"] + ["%-14s %s" % (k[:14], line) for k, line, *_ in sorted(rows, key=lambda r: r[0])] + ["```", ""]
clocks = [f["clock"] for f in F]
out.append("Clock from %.1f to %.1f minutes after midnight; on-counts per frame: %s" % (clocks[0], clocks[-1], ",".join(str(f["on"]) for f in F)))
txt = "\n".join(out)
if len(sys.argv) > 2: open(sys.argv[2], "w").write(txt)
print(txt[:6000])
