#!/usr/bin/env python3
"""Final audit (docs/FINAL_AUDIT.md, dimension 6): a contact sheet of the harness's 30 views as `npm run check:visual` drew them on this
build (tools/visual/out/*.png), each scaled into a cell with its name, in cases.js's order. No page; Pillow only.
python3 tools/audit/sheet.py [outdir-of-the-harness] [out.jpg] [columns]"""
import sys, os, re
from PIL import Image, ImageDraw
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, 'tools', 'visual', 'out')
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(root, 'docs', 'audit-evidence', 'harness-sheet.jpg')
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 5
order = re.findall(r'name:"([^"]+)"', open(os.path.join(root, 'tools', 'visual', 'cases.js'), encoding='utf-8').read())
names = [n for n in order if os.path.exists(os.path.join(src, n + '.png'))]
cw, ch, cap = 400, 225, 18
rows = (len(names) + cols - 1) // cols
sheet = Image.new('RGB', (cols * cw, rows * (ch + cap)), (16, 20, 24))
d = ImageDraw.Draw(sheet)
for k, n in enumerate(names):
    im = Image.open(os.path.join(src, n + '.png')).convert('RGB')
    s = min(cw / im.width, ch / im.height)
    im = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)
    x, y = (k % cols) * cw, (k // cols) * (ch + cap)
    sheet.paste(im, (x + (cw - im.width) // 2, y + cap))
    d.text((x + 4, y + 3), n, fill=(232, 226, 211))
sheet.save(out, quality=86)
print(out, len(names), 'views')
