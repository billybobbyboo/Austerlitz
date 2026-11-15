#!/usr/bin/env python3
"""UI/UX roadmap step 1: before-and-after pairs from tools/ux-step1/shots.js's captures, one JPEG per layout (docs/ux-step1/).
   python3 tools/ux-step1/sheet.py <shotsdir> <outdir>"""
import sys, os
from PIL import Image, ImageDraw
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
names = sorted({f.split("-",1)[1] for f in os.listdir(src) if f.startswith("before-")})
for n in names:
    a, b = Image.open(os.path.join(src, "before-"+n)).convert("RGB"), Image.open(os.path.join(src, "after-"+n)).convert("RGB")
    w = max(a.width, b.width); scale = min(1.0, 900/w)
    a = a.resize((int(a.width*scale), int(a.height*scale))); b = b.resize((int(b.width*scale), int(b.height*scale)))
    vertical = a.width > a.height
    W = max(a.width, b.width) if vertical else a.width + b.width + 12
    H = a.height + b.height + 40 if vertical else max(a.height, b.height) + 20
    im = Image.new("RGB", (W, H), (255, 255, 255)); d = ImageDraw.Draw(im)
    if vertical:
        d.text((4, 2), "before (main, 98e15bc)", fill=(0,0,0)); im.paste(a, (0, 14))
        d.text((4, a.height+22), "after (this branch)", fill=(0,0,0)); im.paste(b, (0, a.height+34))
    else:
        d.text((4, 2), "before (main, 98e15bc)", fill=(0,0,0)); im.paste(a, (0, 16))
        d.text((a.width+16, 2), "after (this branch)", fill=(0,0,0)); im.paste(b, (a.width+12, 16))
    im.save(os.path.join(out, n.replace(".png", ".jpg")), quality=82)
    print(n)
