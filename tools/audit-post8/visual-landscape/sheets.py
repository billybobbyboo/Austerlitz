#!/usr/bin/env python3
"""Final audit after Stage 8, area visual-landscape: contact sheets of the captures (PIL), each tile captioned from its JSON
(id, clock, display factor, presentation, eye and target). usage: python3 sheets.py <shots-dir> <out-dir> [vantage-tile-width=480] [tile-width=800] [per-sheet=6]
Writes one sheet per group of shots (and the vantage matrix as one sheet per vantage, its clocks in a row)."""
import json, os, sys, glob
from PIL import Image, ImageDraw, ImageFont
src, out = sys.argv[1], sys.argv[2]
VTW = int(sys.argv[3]) if len(sys.argv) > 3 else 480
TW = int(sys.argv[4]) if len(sys.argv) > 4 else 800
PER = int(sys.argv[5]) if len(sys.argv) > 5 else 6
os.makedirs(out, exist_ok=True)
recs = []
for j in sorted(glob.glob(os.path.join(src, '*.json'))):
    try:
        r = json.load(open(j))
    except Exception:
        continue
    if os.path.exists(j[:-5] + '.jpg'):
        recs.append(r)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
    fontB = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
except Exception:
    font = fontB = ImageFont.load_default()
PRES = {'watch': 'Watch', 'study': 'Study', 'map': 'Clean'}
def cap(r):
    b = r['readBack']
    return '%s  %s  %sx  %s  eye(%s) tgt(%s)' % (r['id'], b['clock'], round(b['factor'], 2), PRES.get(b['presentation'], b['presentation']),
        ','.join('%g' % round(v) for v in b['eye']), ','.join('%g' % round(v) for v in b['target']))
def sheet(rs, cols, tw, title, fn):
    if not rs:
        return
    rows = (len(rs) + cols - 1) // cols
    ims = [Image.open(os.path.join(src, r['id'] + '.jpg')) for r in rs]
    th = int(tw * ims[0].height / ims[0].width)
    capH, top = 22, 30
    S = Image.new('RGB', (cols * tw, top + rows * (th + capH)), (16, 20, 24))
    d = ImageDraw.Draw(S)
    d.text((8, 5), title, fill=(232, 226, 211), font=fontB)
    for k, (r, im) in enumerate(zip(rs, ims)):
        c, rr = k % cols, k // cols
        x, y = c * tw, top + rr * (th + capH)
        S.paste(im.resize((tw, th), Image.LANCZOS), (x, y + capH))
        d.text((x + 4, y + 3), cap(r), fill=(232, 226, 211), font=font)
    S.save(os.path.join(out, fn), quality=82)
    print('sheet', fn, len(rs))
groups = {}
for r in recs:
    groups.setdefault(r.get('group') or 'misc', []).append(r)
order = ['0600', '0800', '0900', '1000', '1200', '1400', '1500', '1630']
if 'vantage' in groups:
    for v in ['field', 'zuran', 'plateau', 'allied', 'plan', 'low']:
        rs = [r for r in groups['vantage'] if r['id'].startswith('v-%s-' % v)]
        rs.sort(key=lambda r: order.index(r['id'].split('-')[-1]))
        sheet(rs, 4, VTW, 'Vantage %s through the day (1600 x 900, Watch, 4x; the harness page)' % v, 'sheet-vantage-%s.jpg' % v)
for g, rs in groups.items():
    if g == 'vantage':
        continue
    rs.sort(key=lambda r: r['id'])
    for i in range(0, len(rs), PER):
        part = rs[i:i + PER]
        sheet(part, 2, TW, '%s (%d-%d of %d)' % (g, i + 1, i + len(part), len(rs)), 'sheet-%s-%d.jpg' % (g, i // PER + 1))
