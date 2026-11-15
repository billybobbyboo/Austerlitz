#!/usr/bin/env python3
"""UI/UX roadmap step 2: matched captures side by side (the base build left, this build right), from tools/ux-step2/probe.js --shots.
   Each pair is one frame of the same scripted Play on the two builds: the same clock, camera rule, viewport, presentation and renderer.
   python3 tools/ux-step2/sheet.py <probe out dir> <dest dir>      writes JPEGs; nothing else"""
import sys, os, glob, re
from PIL import Image, ImageDraw, ImageFont
src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
def font(sz):
    for p in ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/dejavu/DejaVuSans.ttf"):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()
F = font(20)
pairs = {}
for f in sorted(glob.glob(os.path.join(src, "*.png"))):
    b = os.path.basename(f)
    if b.endswith("-nolabels.png"): continue
    m = re.match(r"(base|step2)-(.+)-f(\d+)-(\d{4})\.png$", b)
    if not m: continue
    pairs.setdefault((m.group(2), m.group(4)), {})[m.group(1)] = f
want = set(sys.argv[3:])   # optional: tags "run:clock" to keep
for (run, clock), d in sorted(pairs.items()):
    if "base" not in d or "step2" not in d: continue
    if want and (run + ":" + clock) not in want: continue
    a, b = Image.open(d["base"]).convert("RGB"), Image.open(d["step2"]).convert("RGB")
    W, H = a.size; narrow = W < 700; pad = 58 if narrow else 34; gap = 12
    out = Image.new("RGB", (W * 2 + gap, H + pad), (246, 241, 229))
    out.paste(a, (0, pad)); out.paste(b, (W + gap, pad))
    dr = ImageDraw.Draw(out)
    t = clock[:2] + ":" + clock[2:]
    if narrow:   # a phone's frame: the caption on two lines
        dr.text((8, 5), "Step 1 build (base)", fill=(20, 18, 12), font=F); dr.text((8, 30), run.replace("-study", ", Study").replace("-watch", ", Watch").split("-0")[0].split("-1")[0] + "  ·  " + t, fill=(20, 18, 12), font=F)
        dr.text((W + gap + 8, 5), "Step 2 build", fill=(20, 18, 12), font=F); dr.text((W + gap + 8, 30), "the same frame", fill=(20, 18, 12), font=F)
    else:
        dr.text((8, 6), "Step 1 build (base)  ·  " + run + "  ·  " + t, fill=(20, 18, 12), font=F)
        dr.text((W + gap + 8, 6), "Step 2 build  ·  the same frame", fill=(20, 18, 12), font=F)
    if W > 1000: out = out.resize((out.width * 3 // 4, out.height * 3 // 4), Image.LANCZOS)
    name = os.path.join(dst, run + "-" + clock + ".jpg")
    out.save(name, quality=82)
    print(name, out.size)
