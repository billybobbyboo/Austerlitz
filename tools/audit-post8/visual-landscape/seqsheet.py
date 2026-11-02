#!/usr/bin/env python3
"""Final audit after Stage 8, area visual-landscape: a contact sheet of a recorded frame sequence (sequence.js output), each tile captioned
with its frame index, the clock, the tween flag, the eye and the culled-block count. usage: python3 seqsheet.py <seq-dir> <name> <out.jpg> [first] [last] [cols] [tile-w]"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont
d, name, out = sys.argv[1], sys.argv[2], sys.argv[3]
first = int(sys.argv[4]) if len(sys.argv) > 4 else 0
last = int(sys.argv[5]) if len(sys.argv) > 5 else 10**9
cols = int(sys.argv[6]) if len(sys.argv) > 6 else 3
tw = int(sys.argv[7]) if len(sys.argv) > 7 else 533
rec = json.load(open(os.path.join(d, name + '.json')))
fr = [f for f in rec['frames'] if first <= f['i'] <= last]
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
except Exception:
    font = ImageFont.load_default()
ims = [Image.open(os.path.join(d, name, 'f%05d.jpg' % f['i'])) for f in fr]
th = int(tw * ims[0].height / ims[0].width); capH = 18
rows = (len(fr) + cols - 1) // cols
S = Image.new('RGB', (cols * tw, rows * (th + capH)), (16, 20, 24)); D = ImageDraw.Draw(S)
for k, (f, im) in enumerate(zip(fr, ims)):
    x, y = (k % cols) * tw, (k // cols) * (th + capH)
    S.paste(im.resize((tw, th), Image.LANCZOS), (x, y + capH))
    D.text((x + 3, y + 2), 'f%d %s tween=%s eye(%s) culled=%s calls=%s' % (f['i'], f['clock'], f['tween'], ','.join('%g' % round(v) for v in f['eye']),
        (f.get('cull') or {}).get('culled'), f.get('calls')), fill=(232, 226, 211), font=font)
S.save(out, quality=84); print(out, len(fr))
