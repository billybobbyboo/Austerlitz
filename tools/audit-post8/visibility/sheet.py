#!/usr/bin/env python3
"""Final audit after Stage 8, area "visibility": a contact sheet of stills (stills.js), each scaled to one height with its caption under it.
   python3 -I tools/audit-post8/visibility/sheet.py OUT.jpg HEIGHT "img1|caption 1" "img2|caption 2" ...
   Rows of at most two images, a white caption bar under each. Measurement record only: the images are the app's frames as stills.js drew them
   (the magenta rings are the audit's annotation, named on each image)."""
import sys
from PIL import Image, ImageDraw, ImageFont

def main():
    out, h = sys.argv[1], int(sys.argv[2])
    items = []
    for a in sys.argv[3:]:
        path, cap = a.split("|", 1)
        im = Image.open(path).convert("RGB")
        w = round(im.width * h / im.height)
        items.append((im.resize((w, h), Image.LANCZOS), cap))
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
    except OSError:
        font = ImageFont.load_default()
    pad, lh = 8, 19
    d0 = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    def wrap(cap, width):
        words, lines, cur = cap.split(), [], ""
        for wd in words:
            t = (cur + " " + wd).strip()
            if d0.textlength(t, font=font) > width - 8 and cur:
                lines.append(cur); cur = wd
            else:
                cur = t
        lines.append(cur)
        return lines
    rows = [items[i:i + 2] for i in range(0, len(items), 2)]
    caps = [[wrap(cap, im.width) for im, cap in r] for r in rows]
    cap_hs = [max(len(c) for c in cr) * lh + 8 for cr in caps]
    width = max(sum(im.width for im, _ in r) + pad * (len(r) + 1) for r in rows)
    height = sum(h + ch + pad for ch in cap_hs) + pad
    sheet = Image.new("RGB", (width, height), (255, 255, 255))
    d = ImageDraw.Draw(sheet)
    y = pad
    for r, cr, ch in zip(rows, caps, cap_hs):
        x = pad
        for (im, _), lines in zip(r, cr):
            sheet.paste(im, (x, y))
            for k, ln in enumerate(lines):
                d.text((x + 4, y + h + 4 + lh * k), ln, fill=(0, 0, 0), font=font)
            x += im.width + pad
        y += h + ch + pad
    sheet.save(out, quality=84)
    print(out, sheet.size)

if __name__ == "__main__":
    main()
