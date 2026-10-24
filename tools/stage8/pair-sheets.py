#!/usr/bin/env python3
"""Stage 8, implementation PRs 8A and 8B (docs/STAGE8_SPEC.md sections 13 and 14): the harness's own captures of two builds side by side.
Each `check:visual` run writes one PNG per case (tools/visual/harness.js); for every case both runs hold, a sheet puts the earlier build's
capture beside the later's, at half size, each captioned with the case and the build. No page; Pillow only.
python3 -I tools/stage8/pair-sheets.py <dir-a> <dir-b> <out-dir> [--cases a,b] [--labels before,after] [--scale 0.5]"""
import sys, os
from PIL import Image, ImageDraw
args = sys.argv[1:]
def opt(f, d=None):
    if f in args:
        i = args.index(f); v = args[i + 1]; del args[i:i + 2]; return v
    return d
cases = opt('--cases'); labels = (opt('--labels') or 'before,after').split(','); scale = float(opt('--scale') or 0.5)
da, db, out = args[0], args[1], args[2]
os.makedirs(out, exist_ok=True)
names = sorted(f[:-4] for f in os.listdir(da) if f.endswith('.png') and os.path.exists(os.path.join(db, f)))
if cases: names = [n for n in names if n in cases.split(',')]
for n in names:
    A = Image.open(os.path.join(da, n + '.png')).convert('RGB'); B = Image.open(os.path.join(db, n + '.png')).convert('RGB')
    w, h = int(A.width * scale), int(A.height * scale)
    A = A.resize((w, h), Image.LANCZOS); B = B.resize((int(B.width * scale), int(B.height * scale)), Image.LANCZOS)
    cap = 22
    S = Image.new('RGB', (w + B.width + 12, max(h, B.height) + cap), (18, 20, 24))
    S.paste(A, (0, cap)); S.paste(B, (w + 12, cap))
    d = ImageDraw.Draw(S)
    d.text((6, 4), n + ' - ' + labels[0], fill=(235, 235, 235)); d.text((w + 18, 4), n + ' - ' + labels[1], fill=(235, 235, 235))
    S.save(os.path.join(out, n + '.jpg'), quality=84)
    print(n)
