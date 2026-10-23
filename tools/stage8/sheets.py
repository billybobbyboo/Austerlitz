#!/usr/bin/env python3
"""Stage 8 Part A (docs/STAGE8_SPEC.md): the comparison sheets. Each sheet puts the build and its prototypes in one camera view side by side,
from the captures the probes wrote (docs/stage8-evidence/<folder>/<view>-<variant>.jpg), each tile captioned with its file. No page; Pillow only.
python3 -I tools/stage8/sheets.py [outdir]   (default docs/stage8-evidence/sheets)"""
import sys, os
from PIL import Image, ImageDraw
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ev = os.path.join(root, 'docs', 'stage8-evidence')
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ev, 'sheets')
# name: (folder, view, variants, columns)
SHEETS = {
    'ground-overview-field': ('ground', 'overview-field', ['base', 'g-none', 'g-marker', 'g-outline', 'g-selonly', 'g-confline'], 2),
    'ground-pratzen-low': ('ground', 'pratzen-low', ['base', 'g-none', 'g-marker', 'g-outline', 'g-selonly', 'g-confline'], 2),
    'ground-inf-mid': ('ground', 'inf-mid', ['base', 'g-none', 'g-outline', 'g-confline'], 2),
    'ground-selected-formation': ('ground', 'selected-formation', ['base', 'g-none', 'g-outline', 'g-selonly'], 2),
    'ground-overview-plan': ('ground', 'overview-plan', ['base', 'g-none', 'g-outline', 'g-confline'], 2),
    'figures-inf-front': ('figures', 'inf-front', ['base', 'f-kit', 'f-facings'], 1),
    'figures-bat-front': ('figures', 'bat-front', ['base', 'f-kit'], 1),
    'figures-bat-march': ('figures', 'bat-march', ['base', 'f-kit'], 1),
    'figures-close-inf': ('figures-close', 'inf-close', ['base', 'f-kit'], 1),
    'figures-close-cav': ('figures-close', 'cav-close', ['base', 'f-kit'], 1),
    'figures-close-bat-deployed': ('figures-close', 'bat-deployed', ['base', 'f-kit'], 1),
    'figures-close-bat-limbered': ('figures-close', 'bat-limbered', ['base', 'f-kit'], 1),
    'water-ice-mid': ('water', 'ice-mid', ['base', 'w-ice'], 1),
    'water-ice-high': ('water', 'ice-high', ['base', 'w-ice'], 1),
    'water-stream-low': ('water', 'stream-low', ['base', 'w-stream', 'w-streamice'], 1),
    'buildings-village-pratzen': ('buildings', 'village-pratzen', ['base', 'b-village', 'b-landmarks'], 1),
    'buildings-village-sokolnitz': ('buildings', 'village-sokolnitz', ['base', 'b-village', 'b-landmarks'], 1),
    'buildings-bat-chapel': ('buildings', 'bat-chapel', ['base', 'b-landmarks'], 1),
    'arrows-pratzen-low': ('arrows', 'pratzen-low', ['base', 'a-cap', 'a-soft', 'a-calm'], 2),
    'arrows-inf-mid': ('arrows', 'inf-mid', ['base', 'a-cap', 'a-soft', 'a-calm'], 2),
    'arrows-close-sokolnitz': ('arrows', 'close-sokolnitz', ['base', 'a-cap', 'a-soft', 'a-calm'], 2),
}
os.makedirs(out, exist_ok=True)
made = 0
for name, (folder, view, variants, cols) in SHEETS.items():
    files = [os.path.join(ev, folder, view + '-' + v + '.jpg') for v in variants]
    files = [f for f in files if os.path.exists(f)]
    if len(files) < 2:
        continue
    tw, th, cap = (800, 450, 20) if cols > 1 else (1200, 675, 22)
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * tw, rows * (th + cap)), (16, 20, 24))
    d = ImageDraw.Draw(sheet)
    for k, f in enumerate(files):
        im = Image.open(f).convert('RGB').resize((tw, th), Image.LANCZOS)
        x, y = (k % cols) * tw, (k // cols) * (th + cap)
        sheet.paste(im, (x, y + cap))
        d.text((x + 6, y + 4), folder + '/' + os.path.basename(f), fill=(232, 226, 211))
    sheet.save(os.path.join(out, name + '.jpg'), quality=82)
    made += 1
    print(name, len(files), 'tiles')
print(made, 'sheets in', out)
