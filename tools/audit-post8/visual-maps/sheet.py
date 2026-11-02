#!/usr/bin/env python3
"""Final audit after Stage 8, area visual-maps: a contact sheet from saved captures (JPEG + JSON pairs), captioned from each JSON.
python3 -I tools/audit-post8/visual-maps/sheet.py <out.jpg> <tile width> <cols> <title> <a.jpg> [b.jpg ...]   Measurement code only."""
import sys, json, os
from PIL import Image, ImageDraw, ImageFont
out, tw, cols, title, files = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4], sys.argv[5:]
F = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
f14, f18 = ImageFont.truetype(F, 14), ImageFont.truetype(F, 18)
ims = [Image.open(p).convert("RGB") for p in files]
th = max(int(tw * im.height / im.width) for im in ims)
cap, top = 22, 30
rows = (len(ims) + cols - 1) // cols
sh = Image.new("RGB", (cols * tw, top + rows * (th + cap)), (16, 20, 24))
d = ImageDraw.Draw(sh)
d.text((8, 6), title, font=f18, fill=(232, 226, 211))
for k, (p, im) in enumerate(zip(files, ims)):
    c, r = k % cols, k // cols
    ox, oy = c * tw, top + r * (th + cap)
    t = im.resize((tw, int(tw * im.height / im.width)), Image.LANCZOS)
    sh.paste(t, (ox, oy + cap))
    j = os.path.splitext(p)[0] + ".json"
    label = os.path.basename(os.path.splitext(p)[0])
    if os.path.exists(j):
        try:
            J = json.load(open(j))
            st = J.get("state") or {}
            ck = st.get("clock")
            if ck is not None:
                label += "  %02d:%02d %s/%s" % (ck // 60, ck % 60, st.get("presentation"), st.get("mode"))
            L = J.get("layer") or {}
            if "dropped" in L:
                label += "  drop %s" % L["dropped"]
        except Exception:
            pass
    d.text((ox + 6, oy + 3), label, font=f14, fill=(232, 226, 211))
sh.save(out, quality=82)
print(out, sh.size)
