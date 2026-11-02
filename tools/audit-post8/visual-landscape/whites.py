#!/usr/bin/env python3
"""Final audit after Stage 8, area visual-landscape: saturated (near-white) pixels in the captures: in named regions where a stream's ribbon was seen
glowing, the count of pixels with every channel >= 245 and the region's maximum; and over each capture above the timebar (the top 88.5%), the share
of such pixels (white uniforms, the HQ marquee and the ice glare count too: a screen, not a stream measure). usage: whites.py <shots-dir> <out.json>"""
import sys, glob, os, json
import numpy as np
from PIL import Image
d, out = sys.argv[1], sys.argv[2]
REG = [('v-low-1630', (1000, 350, 1300, 480), 'the brook toward Augezd, 16:30'), ('inf-east-0900', (1050, 120, 1250, 170), 'the Goldbach by Puntowitz, 09:00'),
       ('sok-castle-1500-close', (450, 220, 560, 320), 'the Goldbach behind the castle, 15:00'), ('ice-mid-1500', (600, 120, 950, 420), 'the Litava channel south of the mere, 15:00 (toward the sun)')]
res = {'regions': [], 'frames': []}
for i, box, what in REG:
    a = np.asarray(Image.open(os.path.join(d, i + '.jpg')).convert('RGB').crop(box)).astype(int)
    res['regions'].append({'shot': i, 'box': box, 'what': what, 'pixels_ge245': int((a.min(axis=2) >= 245).sum()), 'max': int(a.max())})
for f in sorted(glob.glob(os.path.join(d, '*.jpg'))):
    a = np.asarray(Image.open(f).convert('RGB')).astype(int); top = a[:int(a.shape[0] * 0.885)]
    res['frames'].append({'shot': os.path.basename(f)[:-4], 'share_ge245_pct': round(float((top.min(axis=2) >= 245).mean()) * 100, 4)})
res['frames'].sort(key=lambda r: -r['share_ge245_pct'])
json.dump(res, open(out, 'w'), indent=1)
print(json.dumps(res['regions'])); print(res['frames'][:6])
