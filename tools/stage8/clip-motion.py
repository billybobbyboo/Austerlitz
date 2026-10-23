#!/usr/bin/env python3
"""Stage 8 Part A (docs/STAGE8_SPEC.md sections 3-5): what moves in the kept recordings, counted on the committed clips themselves. Each
clips/<clip>.mp4 is its variants stacked one above the other (record.js, the build above where it is one); for every frame, each variant's
part against its own first frame (what changed since the clip began: in a clip whose camera and clock stand, motion other than theirs) and
the variants against each other (what the prototype changes in the same frame), as pixels whose largest channel differs by more than 8 and
by more than 40 of 255 (the encoder's own noise: a still part changes in a pixel or two by more than 8). The variants' caption boxes, top
left, are left out of both counts. Where a clip's camera stands while its clock plays (paper-play), also each frame against the one before
in each variant, over the map's area alone (the rail and the timebar, whose text changes with the clock in both variants alike, left out):
where the layer reshuffles. And, for the frames named in STILLS, a still of the variants at those frames side by side
(clips/<clip>-f<a>-f<b>.jpg), for readers who cannot play the clip. No page; ffmpeg, NumPy and Pillow only.
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
MAP = {'paper-play': (300, 0, 1280, 620)}   # the map's area (x0, y0, x1, y1) at 1280 x 720 in Study: right of the rail, above the timebar
STILLS = {'paper-play': (4, 5)}   # 09:02 and 09:02:30: the first of the build's reshuffles in that clip
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
    if name in MAP:
        x0, y0, x1, y1 = MAP[name]
        def step(P, k):
            d = np.abs(P[k][y0:y1, x0:x1] - P[k - 1][y0:y1, x0:x1]).max(axis=2); return [int((d > 8).sum()), int((d > 40).sum())]
        R['mapArea'] = MAP[name]
        R['step'] = {VAR[name][i]: [None] + [step(parts[i], k) for k in range(1, F.shape[0])] for i in range(n)}
        for v in VAR[name]:
            st = [c[1] for c in R['step'][v][1:]]
            print('  %-16s frame to frame over the map (>40): total %d, largest %d, frames over 30,000: %s' % (v, sum(st), max(st), [k for k, c in enumerate(st, 1) if c > 30000]))
    if name in STILLS:
        from PIL import Image, ImageDraw
        a, b = STILLS[name]; x0, y0, x1, y1 = MAP.get(name, (0, 0, w, ph)); tw, th = x1 - x0, y1 - y0
        im = Image.new('RGB', (2 * tw, n * th), 'white'); dr = ImageDraw.Draw(im)
        for i in range(n):
            for j, k in enumerate((a, b)):
                im.paste(Image.fromarray(parts[i][k][y0:y1, x0:x1].astype(np.uint8)), (j * tw, i * th))
                dr.rectangle([j * tw, i * th, j * tw + 300, i * th + 22], fill=(0, 0, 0)); dr.text((j * tw + 6, i * th + 5), '%s, frame %d' % (VAR[name][i], k), fill=(255, 255, 255))
        sp = os.path.join(clips, '%s-f%d-f%d.jpg' % (name, a, b)); im.save(sp, quality=86); R['still'] = os.path.relpath(sp, root)
    s = {v: max(c[0] for c in R['sinceFirst'][v]) for v in VAR[name]}
    print('%-14s %3d frames %dx%d  most changed since the first frame (>8): %s  between the variants (>40) %d-%d' % (name, R['frames'], w, ph,
        ', '.join('%s %d' % (v, s[v]) for v in VAR[name]), min(c[1] for c in R['between']), max(c[1] for c in R['between'])))
with open(out, 'w') as fh: json.dump(res, fh, indent=1)
print(len(res['clips']), 'clips ->', os.path.relpath(out, root))
