#!/usr/bin/env python3
"""The final audits' Stage 6, WP-10 (CL-VIS-05): pixels at 250 or more in every channel in each capture of tools/final-stage6/streams.js,
and those the streams add (each variant against the view with the streams hidden). python3 -I whites.py <outdir> [--json out.json]"""
import sys, os, json
from PIL import Image
import numpy as np
d = sys.argv[1]; res = {}
for f in sorted(os.listdir(d)):
    if not f.endswith(".png"):
        continue
    a = np.asarray(Image.open(os.path.join(d, f)).convert("RGB")).astype(int)
    view, var = f[:-4].split("--")
    res.setdefault(view, {})[var] = int((a.min(axis=2) >= 250).sum())
for v, r in res.items():
    base = r.get("no-streams", 0)
    print(v, " ".join(f"{k} {n} (+{n-base})" for k, n in r.items()))
if "--json" in sys.argv:
    json.dump(res, open(sys.argv[sys.argv.index("--json") + 1], "w"), indent=1)
