#!/usr/bin/env python3
"""Stage 8, 8H location research: what the 1825 indication sketch of Sokolnitz shows, measured in its own pixels (no network).

    python3 -I docs/stage8-evidence/8h/geo/period-trace.py [--diag DIR]

Reads the Moravian Land Archive's tiles saved by fetch-places.js (fund D9, MOR246318250, "Gemeinde Sokollnitz ... 1825"):
level 2 of pieces A03D-A05E, level 3 of pieces A03E-A05E, level 4 of the castle and the granary (A04E). Writes
derived/period-pixels.json: two control points (the castle's courtyard and the granary, each also measured on the modern cadastre),
the sketch's "Fasangarten" (the dark wash of section III) as a polygon, and the blue lines (streams) in and below it as polylines,
all in one frame: the level-2 mosaic of the six pieces (x = 651 * (column - D) + x in piece, y = 522 * (row - 3) + y in piece, at the
level-2 scale). compute-places.js georeferences them. Image measurement only; the reading of what they mean is in README.md.
Research tool; not part of the build."""
import json, math, os, sys
from collections import deque
import numpy as np
from PIL import Image, ImageDraw

D = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(D, "raw")
MZ = os.path.join(RAW, "mza", "MOR246318250")
DIAG = sys.argv[sys.argv.index("--diag") + 1] if "--diag" in sys.argv else None
L2W, L2H = 651, 522                      # a piece at level 2 (3 x 3 tiles of 217 x 174)
ROWS, COLS = ["03", "04", "05"], ["D", "E"]


def piece_l2(S):
    im = Image.new("RGB", (L2W, L2H))
    for ai, a in enumerate("ABC"):
        for n in (1, 2, 3):
            im.paste(Image.open(os.path.join(MZ, "little", f"{S}-{a}{n}.jpg")).convert("RGB"), (ai * 217, (n - 1) * 174))
    return im


def mosaic_l2():
    M = Image.new("RGB", (L2W * len(COLS), L2H * len(ROWS)))
    for ri, r in enumerate(ROWS):
        for ci, c in enumerate(COLS):
            M.paste(piece_l2(f"A{r}{c}"), (ci * L2W, ri * L2H))
    return M


def mosaic_l2_of(sk, rows, cols):
    """level-2 mosaic of another sketch's pieces (a missing piece left black)"""
    M = Image.new("RGB", (L2W * len(cols), L2H * len(rows)))
    for ri, r in enumerate(rows):
        for ci, c in enumerate(cols):
            S = f"A{r}{c}"
            if not os.path.exists(os.path.join(RAW, "mza", sk, "little", f"{S}-A1.jpg")): continue
            im = Image.new("RGB", (L2W, L2H))
            for ai, a in enumerate("ABC"):
                for n in (1, 2, 3):
                    im.paste(Image.open(os.path.join(RAW, "mza", sk, "little", f"{S}-{a}{n}.jpg")).convert("RGB"), (ai * 217, (n - 1) * 174))
            M.paste(im, (ci * L2W, ri * L2H))
    return M


def mosaic_l3(col="E"):
    """level 3 of column E (pieces A03E, A04E, A05E): 1302 x 1044 a piece"""
    M = Image.new("RGB", (1302, 1044 * len(ROWS)))
    for ri, r in enumerate(ROWS):
        for Y in range(6):
            for X in range(6):
                n = f"A{r}{col}-{'ABC'[X // 2]}{Y // 2 + 1}-{'AB'[X % 2]}{Y % 2 + 1}"
                M.paste(Image.open(os.path.join(MZ, "Small", n + ".jpg")).convert("RGB"), (X * 217, ri * 1044 + Y * 174))
    return M


def crop_l4(S="A04E", x0=0, y0=3, x1=3, y1=7):
    L = "ABC"
    M = Image.new("RGB", ((x1 - x0 + 1) * 217, (y1 - y0 + 1) * 174))
    for ly in range(y0, y1 + 1):
        for lx in range(x0, x1 + 1):
            n = f"{S}-{L[lx // 4]}{ly // 4 + 1}-{'AB'[(lx // 2) % 2]}{(ly // 2) % 2 + 1}-{'AB'[lx % 2]}{ly % 2 + 1}"
            M.paste(Image.open(os.path.join(MZ, "Normal", n + ".jpg")).convert("RGB"), ((lx - x0) * 217, (ly - y0) * 174))
    return M, (x0 * 217, y0 * 174)


# ---------------- binary morphology and regions (numpy only) ----------------
def box(mask, r):
    """count of set pixels in the (2r+1)^2 box round each pixel"""
    h, w = mask.shape
    k = 2 * r + 1
    c = np.zeros((h + 2 * r + 1, w + 2 * r + 1), np.int64)
    c[1:, 1:] = np.pad(mask.astype(np.int64), r).cumsum(0).cumsum(1)
    return c[k:k + h, k:k + w] - c[0:h, k:k + w] - c[k:k + h, 0:w] + c[0:h, 0:w]


def erode(mask, r): return box(mask, r) == (2 * r + 1) ** 2
def dilate(mask, r): return box(mask, r) > 0


def component(mask, seed):
    h, w = mask.shape
    out = np.zeros_like(mask, dtype=bool)
    if not mask[seed[1], seed[0]]:
        raise ValueError(f"seed {seed} not in mask")
    q = deque([seed]); out[seed[1], seed[0]] = True
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and mask[ny, nx] and not out[ny, nx]:
                out[ny, nx] = True; q.append((nx, ny))
    return out


def fill_holes(mask):
    """the mask with every region of background not reached from the border set"""
    bg = ~mask
    h, w = mask.shape
    reach = np.zeros_like(mask, dtype=bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if bg[y, x] and not reach[y, x]: reach[y, x] = True; q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if bg[y, x] and not reach[y, x]: reach[y, x] = True; q.append((x, y))
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and bg[ny, nx] and not reach[ny, nx]:
                reach[ny, nx] = True; q.append((nx, ny))
    return ~reach


def trace_boundary(mask):
    """Moore-neighbour tracing of the outer boundary of the one region in mask; returns [(x, y)] in order"""
    ys, xs = np.nonzero(mask)
    i = np.lexsort((xs, ys))[0]
    start = (int(xs[i]), int(ys[i]))
    nb = [(1, 0), (1, 1), (0, 1), (-1, 1), (-1, 0), (-1, -1), (0, -1), (1, -1)]
    h, w = mask.shape
    inside = lambda p: 0 <= p[0] < w and 0 <= p[1] < h and mask[p[1], p[0]]
    out, cur, d = [start], start, 6
    for _ in range(10 * mask.sum() + 10):
        for k in range(8):
            dd = (d + 6 + k) % 8          # start from the left of the last move
            p = (cur[0] + nb[dd][0], cur[1] + nb[dd][1])
            if inside(p):
                cur, d = p, dd
                break
        if cur == start and len(out) > 2:
            break
        out.append(cur)
    return out


def simplify(pts, tol):
    """Douglas-Peucker"""
    if len(pts) < 3: return pts
    a, b = np.array(pts[0], float), np.array(pts[-1], float)
    ab = b - a; L = np.hypot(*ab) or 1.0
    d = [abs(ab[0] * (p[1] - a[1]) - ab[1] * (p[0] - a[0])) / L for p in pts[1:-1]]
    i = int(np.argmax(d)) + 1
    if d[i - 1] > tol:
        return simplify(pts[:i + 1], tol)[:-1] + simplify(pts[i:], tol)
    return [pts[0], pts[-1]]


def nearest(mask, x, y):
    """the set pixel of mask nearest (x, y): a seed found, not guessed"""
    ys, xs = np.nonzero(mask)
    i = int(np.argmin((xs - x) ** 2 + (ys - y) ** 2))
    return int(xs[i]), int(ys[i])


def simplify_ring(pts, tol):
    """Douglas-Peucker on a closed ring: split at the point farthest from the first"""
    a = np.array(pts[0], float)
    i = int(np.argmax([np.hypot(*(np.array(p, float) - a)) for p in pts]))
    return simplify(pts[:i + 1], tol)[:-1] + simplify(pts[i:] + [pts[0]], tol)[:-1]


def centroid(mask):
    ys, xs = np.nonzero(mask)
    return float(xs.mean()), float(ys.mean())


# ---------------- the modern control points (RÚIAN, read from the raw response) ----------------
def ll_centroid(ring):
    """area centroid of a ring of [lon, lat] in a local metric frame; returns (lat, lon, area m2)"""
    lat0 = sum(p[1] for p in ring) / len(ring); lon0 = sum(p[0] for p in ring) / len(ring)
    kx = 111320.0 * math.cos(math.radians(lat0)); ky = 111132.0
    P = [((p[0] - lon0) * kx, (p[1] - lat0) * ky) for p in ring]
    A = cx = cy = 0.0
    for i in range(len(P) - 1):
        c = P[i][0] * P[i + 1][1] - P[i + 1][0] * P[i][1]
        A += c / 2; cx += (P[i][0] + P[i + 1][0]) * c / 6; cy += (P[i][1] + P[i + 1][1]) * c / 6
    return lat0 + cy / A / ky, lon0 + cx / A / kx, abs(A)


def main():
    ru = json.load(open(os.path.join(RAW, "ruian", "buildings_4326.json")))
    bld = {f["attributes"]["kod"]: f for f in ru["features"]}
    rings = bld[13158571]["geometry"]["rings"]
    ca = [ll_centroid(r) for r in rings]
    court = min(ca, key=lambda c: c[2])          # the smaller ring: the courtyard
    block = max(ca, key=lambda c: c[2])
    gran = ll_centroid(bld[46430121]["geometry"]["rings"][0])

    # ---- level 4: the castle and the granary on A04E (lx 0-3, ly 3-7) ----
    C4, (ox4, oy4) = crop_l4()
    A = np.asarray(C4).astype(int); r, g, b = A[..., 0], A[..., 1], A[..., 2]
    carmine = (r - g > 60) & (g < 90)
    seed = nearest(carmine, 490, 280)                                    # the quadrangle's carmine nearest its court (read on the tiles)
    ring = component(carmine, seed)
    cas = fill_holes(ring)                                               # the quadrangle, its court filled
    court_px = cas & ~ring                                               # the court: inside, not carmine
    court_px = component(court_px, (int(np.median(np.nonzero(court_px)[1])), int(np.median(np.nonzero(court_px)[0]))))
    pink = (r - g > 28) & (r - b > 38) & ~carmine
    pk = dilate(pink, 1) & ~carmine
    gr = fill_holes(component(pk, nearest(pk, 160, 645)))                # the pink '10' south-west of the castle
    to_l2 = lambda x, y: (L2W + (ox4 + x) / 4.0, L2H + (oy4 + y) / 4.0)   # A04E is column E, row 04
    cx, cy = centroid(court_px); bx, by = centroid(cas); gx, gy = centroid(gr)
    ys, xs = np.nonzero(cas); gys, gxs = np.nonzero(gr)
    castle = {"court_px_l4": [round(cx, 1), round(cy + oy4, 1)], "court_area_px_l4": int(court_px.sum()),
              "block_px_l4": [round(bx, 1), round(by + oy4, 1)], "block_bbox_px_l4": [int(xs.min()), int(ys.min() + oy4), int(xs.max()), int(ys.max() + oy4)],
              "granary_px_l4": [round(gx, 1), round(gy + oy4, 1)], "granary_bbox_px_l4": [int(gxs.min()), int(gys.min() + oy4), int(gxs.max()), int(gys.max() + oy4)]}

    # ---- level 2: the Fasangarten (the dark wash of section III), in pieces A03E and A04E ----
    M2 = mosaic_l2()
    A2 = np.asarray(M2).astype(int)
    mean = A2.mean(axis=2); sat = A2.max(axis=2) - A2.min(axis=2)
    dark = (mean < 110) & (sat < 45)
    reg = np.zeros_like(dark); reg[0:700, L2W:] = True                   # A03E and the north of A04E, down to the castle park's north edge
    m = dark & reg
    m = dilate(erode(m, 3), 3)                                            # opening: drops the roads' bands, lines and script
    m = erode(dilate(m, 8), 8)                                            # closing: bridges the avenue and the tree signs
    fas = fill_holes(component(m, (950 - 0, 420)))                        # seed in the wash east of the avenue
    poly = simplify_ring(trace_boundary(fas), 1.5)
    fx, fy = centroid(fas)

    # ---- level 3: the blue lines (streams) of column E ----
    # the lines are thin and drawn in broken strokes: the blue pixels of each row are grouped into runs, and the runs are linked
    # down the sheet into tracks (a run joins the track whose last run is within 8 level-2 px across and 80 down)
    M3 = mosaic_l3()
    A3 = np.asarray(M3).astype(int); r3, g3, b3 = A3[..., 0], A3[..., 1], A3[..., 2]
    blue = (b3 - r3 > 12) & (b3 >= g3)
    tracks = []
    for y in range(0, blue.shape[0], 2):
        xs = np.nonzero(blue[y])[0]
        runs = []
        for x in xs:
            if runs and x - runs[-1][-1] <= 3: runs[-1].append(x)
            else: runs.append([x])
        for run in runs:
            px = (L2W + float(np.mean(run)) / 2.0, y / 2.0)
            best = None
            for t in tracks:
                lx, ly = t[-1]
                if 0 < px[1] - ly <= 80 and abs(px[0] - lx) <= 8 and (best is None or abs(px[0] - lx) < abs(px[0] - best[-1][0])): best = t
            if best is not None: best.append(px)
            else: tracks.append([px])
    keep = [t for t in tracks if len(t) >= 6 and t[-1][1] - t[0][1] >= 30 and min(p[0] for p in t) < 1295]   # not the scan's right edge
    lines = {}
    for i, t in enumerate(sorted(keep, key=lambda t: (t[0][1], t[0][0]))):
        lines[f"blue_{i}"] = {"type": "line", "px": [[round(x, 2), round(y, 2)] for x, y in simplify(t, 0.75)], "runs": len(t),
                              "north_px": round(t[0][1], 1), "south_px": round(t[-1][1], 1)}

    # ---- level 2: the communal boundary at the top of A03E (the pink band with its red line, Sokolnitz against Kobelnitz) ----
    # per column, the topmost run of at least 3 pink pixels above y 100 (the red script below it on the right is lower down)
    pinkb = (A2[..., 0] - A2[..., 1] > 25) & (A2[..., 0] - A2[..., 2] > 30) & (A2[..., 1] > 95) & (A2.mean(axis=2) > 130)
    bpts = []
    for x in range(905, 1300, 3):
        col = np.nonzero(pinkb[0:100, x])[0]
        runs = []
        for y in col:
            if runs and y - runs[-1][-1] <= 1: runs[-1].append(y)
            else: runs.append([y])
        runs = [r for r in runs if len(r) >= 3]
        if runs: bpts.append((float(x), float(np.mean(runs[0]))))
    ys_ = [p[1] for p in bpts]
    med = [float(np.median(ys_[max(0, i - 3):i + 4])) for i in range(len(ys_))]   # a running median drops single stray runs
    bpts = [(x, y) for (x, _), y in zip(bpts, med)]

    out = {
        "what": "the 1825 indication sketch of Sokolnitz measured in its own pixels (period-trace.py)",
        "source": {"archive": "Moravský zemský archiv, fund D9 Indikační skici, MOR246318250 (title: Gemeinde Sokollnitz, Brünner Kreis, 1825)",
                   "viewer": "https://www.mza.cz/indikacniskici/skica/detail/MOR246318250",
                   "tiles": "https://www.mza.cz/indikacniskici/data/obrazky/MOR246318250/Img/{little,Small,Normal}/...: raw/mza/MOR246318250/"},
        "frame": "level-2 mosaic of pieces A03D A03E / A04D A04E / A05D A05E: x = 651 * (column - D) + x in piece, y = 522 * (row - 3) + y in piece (level 3 = 2 x, level 4 = 4 x)",
        "control": [
            {"name": "castle courtyard centre", "px": [round(v, 2) for v in to_l2(cx, cy)], "lat": court[0], "lon": court[1],
             "modern": "the courtyard ring of RÚIAN building 13158571 (area centroid)", "note": "the court, not the block: the 1825 block's east range is drawn deeper than today's (readings-cadastre.md 2)"},
            {"name": "granary centre", "px": [round(v, 2) for v in to_l2(gx, gy)], "lat": gran[0], "lon": gran[1],
             "modern": "RÚIAN building 46430121 (area centroid)", "note": "8G's fit put the modern granary on the drawn '10'"}],
        "checkpoints": [{"name": "castle block centre (1825 block against today's: the 1825 east range deeper)", "px": [round(v, 2) for v in to_l2(bx, by)], "lat": block[0], "lon": block[1]}],
        "measured": castle,
        "features": {
            "fasangarten_1825": {"type": "polygon", "what": "the sketch's 'Fasangarten' (section III, parcels 366-378): its dark wash with the avenue and the oval inside it",
                                 "px": [[float(x), float(y)] for x, y in poly], "area_px": int(fas.sum()), "centroid_px": [round(fx, 1), round(fy, 1)]},
            **{k: dict(v, what="a blue line (stream or channel) on pieces A03E-A05E, level 3") for k, v in lines.items()},
            "castle_block_1825": {"type": "point", "what": "the 1825 castle block's centre", "px": [round(v, 2) for v in to_l2(bx, by)]},
            "boundary_1825": {"type": "boundary", "what": "the communal boundary drawn at the top of piece A03E (Sokolnitz against Kobelnitz), x 905-1300",
                              "px": [[round(x, 1), round(y, 1)] for x, y in bpts]}}}
    out["kobelnitz1825"] = kobelnitz()
    os.makedirs(os.path.join(D, "derived"), exist_ok=True)
    json.dump(out, open(os.path.join(D, "derived", "period-pixels.json"), "w"), indent=1)
    print(json.dumps({k: out[k] for k in ("control", "checkpoints", "measured")}, indent=1))
    print("fasangarten px", out["features"]["fasangarten_1825"]["area_px"], "vertices", len(poly), "lines", {k: (v["north_px"], v["south_px"], v["runs"], v["px"][0], v["px"][-1]) for k, v in lines.items()})
    if DIAG:
        os.makedirs(DIAG, exist_ok=True)
        V = M2.copy(); dr = ImageDraw.Draw(V)
        dr.line([tuple(p) for p in poly] + [tuple(poly[0])], fill=(255, 140, 0), width=2)
        for k, v in lines.items(): dr.line([tuple(p) for p in v["px"]], fill=(0, 200, 255), width=2)
        for c in out["control"]: x, y = c["px"]; dr.ellipse((x - 4, y - 4, x + 4, y + 4), outline=(255, 0, 0), width=2)
        V.save(os.path.join(DIAG, "trace_l2.jpg"), quality=88)
        W = (A3 * 0.45).astype(np.uint8); W[blue] = [0, 120, 255]
        Image.fromarray(W).save(os.path.join(DIAG, "blue_l3.jpg"), quality=85)
        Q = (A * 0.5).astype(np.uint8); Q[court_px] = [0, 255, 0]; Q[gr] = [255, 255, 0]; Q[cas & ~court_px] = [255, 0, 0]
        Image.fromarray(Q).save(os.path.join(DIAG, "castle_l4.png"))


def kobelnitz():
    """The 1825 sketch of Kobelnitz (MOR102418250), pieces A04C-A06D at level 2: its drawing of the communal boundary with Sokolnitz (the
    pink band), measured in its own mosaic. The two communes' sketches are cut from the same cadastral sheets: Kobelnitz's piece A06C and
    Sokolnitz's piece A03E are the same quarter sheet, each drawing its own side of the boundary (found by placing each sketch on its own:
    their top-left corners fell within 36 m of each other). So a pixel of this mosaic is the Sokolnitz mosaic's pixel (x + 651, y - 1044),
    and compute-places.js georeferences it with the Sokolnitz fit, checking the band against today's boundary."""
    K2 = mosaic_l2_of("MOR102418250", ["04", "05", "06"], ["C", "D"])
    A = np.asarray(K2).astype(int)
    pinkb = (A[..., 0] - A[..., 1] > 25) & (A[..., 0] - A[..., 2] > 30) & (A[..., 1] > 95) & (A.mean(axis=2) > 130)
    band = []
    for x in range(0, A.shape[1], 3):
        col = np.nonzero(pinkb[1000:1200, x])[0] + 1000
        runs = []
        for y in col:
            if runs and y - runs[-1][-1] <= 1: runs[-1].append(y)
            else: runs.append([y])
        runs = [r for r in runs if 3 <= len(r) <= 14]
        if runs: band.append((float(x), float(np.mean(runs[0]))))
    return {"what": "the 1825 sketch of Kobelnitz (MOR102418250): its communal boundary with Sokolnitz, pieces A06C-A06D (level 2)",
            "viewer": "https://www.mza.cz/indikacniskici/skica/detail/MOR102418250",
            "frame": "level-2 mosaic of pieces A04C A04D / A05C A05D / A06C A06D (A04D absent); Sokolnitz frame = (x + 651, y - 1044)",
            "offset_to_sokolnitz_frame": [651, -1044],
            "band_px": [[round(x, 1), round(y, 1)] for x, y in band]}


if __name__ == "__main__":
    main()
