#!/usr/bin/env python3
"""Stage 8 Part A (docs/STAGE8_SPEC.md): how much of a frame a prototype changes, counted on the kept captures. For each pair (the build's
capture and a prototype's in the same view, docs/stage8-evidence/<folder>/<view>-base.jpg and <view>-<id>.jpg), the pixels whose grey level
differs by more than 40 of 255 (well above the JPEG's own noise: two captures of the same frame differ in a few dozen pixels by more than 8),
their share of the frame and their bounding box. No page; Pillow and NumPy only.
python3 -I tools/stage8/pixdiff.py [out.json]   (default docs/stage8-evidence/pixdiff.json)"""
import sys, os, json
from PIL import Image, ImageChops
import numpy as np
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ev = os.path.join(root, 'docs', 'stage8-evidence')
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ev, 'pixdiff.json')
PAIRS = [('figures', v, p) for v, p in [('inf-front', 'f-kit'), ('inf-front', 'f-facings'), ('cav-front', 'f-kit'), ('bat-front', 'f-kit'), ('bat-march', 'f-kit')]] + \
        [('figures-close', v, 'f-kit') for v in ['inf-close', 'cav-close', 'bat-deployed', 'bat-limbered']] + \
        [('arrows', v, p) for v in ['pratzen-low', 'inf-mid', 'close-sokolnitz'] for p in ['a-cap', 'a-soft', 'a-calm']] + \
        [('water', v, 'w-ice') for v in ['ice-mid', 'ice-high', 'ph8-overview-watch']] + [('water', 'stream-low', p) for p in ['w-stream', 'w-streamice']] + \
        [('buildings', v, p) for v in ['village-telnitz', 'village-pratzen', 'village-sokolnitz', 'overview-field', 'bat-chapel', 'woods-pheasantry'] for p in ['b-village', 'b-landmarks']]
res = {'threshold': 40, 'pairs': {}}
for f, v, p in PAIRS:
    a, b = os.path.join(ev, f, v + '-base.jpg'), os.path.join(ev, f, v + '-' + p + '.jpg')
    if not (os.path.exists(a) and os.path.exists(b)):
        print(f, v, p, 'missing'); continue
    d = np.array(ImageChops.difference(Image.open(a).convert('L'), Image.open(b).convert('L')))
    m = d > 40; n = int(m.sum()); ys, xs = np.nonzero(m)
    bb = [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())] if n else None
    res['pairs'][f + '/' + v + '/' + p] = {'pixels': n, 'share': round(n / d.size, 5), 'bbox': bb}
    print('%-14s %-20s %-12s %8d px %6.2f%%  bbox %s' % (f, v, p, n, 100 * n / d.size, bb))
with open(out, 'w') as fh: json.dump(res, fh, indent=1)
print(len(res['pairs']), 'pairs ->', os.path.relpath(out, root))
