#!/usr/bin/env python3
"""UI/UX roadmap step 3: matched captures side by side (the Step 2 build left, the step 3 build right), from tools/ux-step2/probe.js --shots
   (files named step2-<run>-f<frame>-<hhmm>.png and step3-<run>-f<frame>-<hhmm>.png) or tools/ux-step3/rotate.js (step2-rotate-<n>-<stage>.png
   and step3-rotate-<n>-<stage>.png). Each pair is the same clock, start, viewport, presentation and renderer; the camera is each build's own
   Follow (that is the comparison).
   python3 tools/ux-step3/sheet.py <shots dir> <dest dir> [run:hhmm ...]      writes JPEGs; nothing else"""
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
    m = re.match(r"(step2|step3)-(.+)-f(\d+)-(\d{4})\.png$", b) or re.match(r"(step2|step3)-(rotate)-(\d)-(\w+)\.png$", b)
    if not m: continue
    pairs.setdefault((m.group(2), m.group(4) if m.group(2) != "rotate" else m.group(3) + "-" + m.group(4)), {})[m.group(1)] = f
want = set(sys.argv[3:])
for (run, clock), d in sorted(pairs.items()):
    if "step2" not in d or "step3" not in d: continue
    if want and (run + ":" + clock) not in want: continue
    a, b = Image.open(d["step2"]).convert("RGB"), Image.open(d["step3"]).convert("RGB")
    if a.size != b.size: continue
    W, H = a.size; narrow = W < 700; pad = 58 if narrow else 34; gap = 12
    out = Image.new("RGB", (W * 2 + gap, H + pad), (246, 241, 229))
    out.paste(a, (0, pad)); out.paste(b, (W + gap, pad))
    dr = ImageDraw.Draw(out)
    t = (clock[:2] + ":" + clock[2:]) if re.match(r"^\d{4}$", clock) else clock
    if narrow:
        dr.text((8, 5), "Step 2 build (base)", fill=(20, 18, 12), font=F); dr.text((8, 30), run + "  ·  " + t, fill=(20, 18, 12), font=F)
        dr.text((W + gap + 8, 5), "Step 3 build", fill=(20, 18, 12), font=F); dr.text((W + gap + 8, 30), "the same clock", fill=(20, 18, 12), font=F)
    else:
        dr.text((8, 6), "Step 2 build (base)  ·  " + run + "  ·  " + t, fill=(20, 18, 12), font=F)
        dr.text((W + gap + 8, 6), "Step 3 build  ·  the same clock", fill=(20, 18, 12), font=F)
    if W > 1000: out = out.resize((out.width * 3 // 4, out.height * 3 // 4), Image.LANCZOS)
    name = os.path.join(dst, run + "-" + clock + ".jpg")
    out.save(name, quality=82)
    print(name, out.size)
