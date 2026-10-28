#!/usr/bin/env python3
"""Stage 8, implementation PR 8F (docs/STAGE8_SPEC.md section 18.4): the woods' sheets. For each view woods-8f.js measured, 8E's woods (its
"8e" tag), the three prototypes put into 8E's scene (t-open, t-airy, t-lace) and 8F's woods as built (its "8f" tag), side by side, each tile
captioned with its file, from docs/stage8-evidence/8f/woods/<view>-<variant>.jpg. No page; Pillow only.
python3 -I tools/stage8/sheets-8f.py [outdir]   (default docs/stage8-evidence/8f/sheets)"""
import sys, os
from PIL import Image, ImageDraw
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ev = os.path.join(root, 'docs', 'stage8-evidence', '8f')
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ev, 'sheets')
VIEWS = ['woods-pheasantry', 'ice-sun', 'pratzen-low', 'close-sokolnitz', 'overview-field', 'ph8-overview-watch']
VARIANTS = ['8e', 't-open', 't-airy', 't-lace', '8f']
TW, TH, CAP = 800, 450, 24
os.makedirs(out, exist_ok=True)
for v in VIEWS:
    tiles = [(var, os.path.join(ev, 'woods', '%s-%s.jpg' % (v, var))) for var in VARIANTS]
    tiles = [t for t in tiles if os.path.exists(t[1])]
    if not tiles:
        continue
    cols = 2
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * TW, rows * (TH + CAP)), (24, 24, 24))
    d = ImageDraw.Draw(sheet)
    for i, (var, f) in enumerate(tiles):
        im = Image.open(f).convert('RGB').resize((TW, TH))
        x, y = (i % cols) * TW, (i // cols) * (TH + CAP)
        sheet.paste(im, (x, y + CAP))
        d.text((x + 6, y + 5), '%s: %s' % (var, os.path.relpath(f, root)), fill=(235, 235, 235))
    p = os.path.join(out, '%s-woods.jpg' % v)
    sheet.save(p, quality=84)
    print(os.path.relpath(p, root))
