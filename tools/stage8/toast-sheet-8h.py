#!/usr/bin/env python3
"""Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md section 20.5): the phase's message, 8G's build against 8H's, as a sheet. For four of the
sizes toast-8h.js measures in Study (1600 x 900, 1024 x 768, a phone held across, 844 x 390, and upright, 390 x 844), its capture on 8G's build
beside its capture on 8H's, each scaled to one width, from docs/stage8-evidence/8h/toast/8g/<size>-study.jpg and 8h/<size>-study.jpg (the
message at the place each build gives it). No page; Pillow only.
python3 -I tools/stage8/toast-sheet-8h.py [out.jpg]   (default docs/stage8-evidence/8h/toast/toast-8g-8h.jpg)"""
import sys, os
from PIL import Image, ImageDraw, ImageFont
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
d = os.path.join(root, 'docs', 'stage8-evidence', '8h', 'toast')
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(d, 'toast-8g-8h.jpg')
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 16)
except Exception:
    font = ImageFont.load_default()
rows = []
for size, tw in [('1600x900-study', 800), ('1024x768-study', 800), ('844x390-study', 800), ('390x844-study', 420)]:
    a = Image.open(os.path.join(d, '8g', size + '.jpg'))
    b = Image.open(os.path.join(d, '8h', size + '.jpg'))
    ra = a.resize((tw, round(a.height * tw / a.width)))
    rb = b.resize((tw, round(b.height * tw / b.width)))
    row = Image.new('RGB', (tw * 2 + 12, max(ra.height, rb.height) + 26), (24, 24, 24))
    row.paste(ra, (0, 26))
    row.paste(rb, (tw + 12, 26))
    dr = ImageDraw.Draw(row)
    dr.text((6, 4), size + ': 8G (the message at its own place)', fill=(230, 230, 230), font=font)
    dr.text((tw + 18, 4), size + ': 8H', fill=(230, 230, 230), font=font)
    rows.append(row)
sheet = Image.new('RGB', (max(r.width for r in rows), sum(r.height for r in rows) + 8 * len(rows)), (16, 16, 16))
y = 0
for r in rows:
    sheet.paste(r, (0, y))
    y += r.height + 8
sheet.save(out, quality=86)
print(os.path.relpath(out, root), sheet.size)
