#!/usr/bin/env python3
"""Stage 8 Part A (docs/STAGE8_SPEC.md sections 3-5): what moves in the kept recordings, counted on the committed clips themselves. Each
clips/<clip>.mp4 is its variants stacked one above the other (record.js, the build above where it is one); for every frame, each variant's
part against its own first frame (what changed since the clip began: in a clip whose camera and clock stand, motion other than theirs) and
the variants against each other (what the prototype changes in the same frame), as pixels whose largest channel differs by more than 8 and
by more than 40 of 255 (the encoder's own noise: a still part changes in a pixel or two by more than 8). The variants' caption boxes, top
left, are left out of both counts. No page; ffmpeg, NumPy only.
python3 -I tools/stage8/clip-motion.py [out.json]   (default docs/stage8-evidence/clip-motion.json)"""
import sys, os, re, json, subprocess
import numpy as np
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
clips = os.path.join(root, 'docs', 'stage8-evidence', 'clips')
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, 'docs', 'stage8-evidence', 'clip-motion.json')
# each clip's variants, in their stacked order, read from record.js's own table so the two cannot drift
src = open(os.path.join(root, 'tools', 'stage8', 'record.js'), encoding='utf-8').read()
VAR = {m.group(1): [v.strip().strip('"') for v in m.group(2).split(',')] for m in re.finditer(r'^\s*"([\w-]+)":\s*\{.*?variants:\[(.*?)\]', src, re.S | re.M)}
CAP = (60, 480)   # rows and columns of the caption box left out
def frames(path):
    w, h = map(int, subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', path]).decode().strip().split(','))
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'])
    return w, h, np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3).astype(np.int16)
def count(a, b):
    d = np.abs(a - b).max(axis=2); d[:CAP[0], :CAP[1]] = 0
    return [int((d > 8).sum()), int((d > 40).sum())]
res = {'thresholds': [8, 40], 'caption_left_out': CAP, 'clips': {}}
for name in sorted(VAR):
    p = os.path.join(clips, name + '.mp4')
    if not os.path.exists(p) or len(VAR[name]) < 2: continue
    w, h, F = frames(p); n = len(VAR[name]); ph = h // n
    parts = [F[:, i * ph:(i + 1) * ph] for i in range(n)]
    R = res['clips'][name] = {'variants': VAR[name], 'frames': int(F.shape[0]), 'size': [w, ph],
        'sinceFirst': {VAR[name][i]: [count(parts[i][k], parts[i][0]) for k in range(F.shape[0])] for i in range(n)},
        'between': [count(parts[0][k], parts[n - 1][k]) for k in range(F.shape[0])]}
    s = {v: max(c[0] for c in R['sinceFirst'][v]) for v in VAR[name]}
    print('%-14s %3d frames %dx%d  most changed since the first frame (>8): %s  between the variants (>40) %d-%d' % (name, R['frames'], w, ph,
        ', '.join('%s %d' % (v, s[v]) for v in VAR[name]), min(c[1] for c in R['between']), max(c[1] for c in R['between'])))
with open(out, 'w') as fh: json.dump(res, fh, indent=1)
print(len(res['clips']), 'clips ->', os.path.relpath(out, root))
