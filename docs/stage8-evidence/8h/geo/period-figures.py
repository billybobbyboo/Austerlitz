#!/usr/bin/env python3
"""Stage 8, 8H location research: the period maps with today's and the map's features drawn on them (no network).

    python3 -I docs/stage8-evidence/8h/geo/period-figures.py        (after period-trace.py and compute-places.js)

Reads raw/ (the CENIA tiles of the Second and Third Military Surveys, EPSG:5514; the Moravian Land Archive's sketch tiles), places.json
(every overlay: EPSG:5514 metres for the surveys' tiles, the 1825 mosaic's pixels for the sketches) and derived/period-pixels.json.
Writes fig/*.jpg and derived/period-figures.json (what the 1825 Kobelnitz sketch shows under today's woodland north of the communal
boundary, by colour class). Colours: red = what the map draws now (world.js, geo.js); blue = today's position (RÚIAN, OSM); orange =
the 1825 trace (period-trace.py); green = today's woodland outline; magenta = today's cadastral boundary. Research tool; not part of the build."""
import json, math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

D = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(D, "raw")
FIG = os.path.join(D, "fig")
os.makedirs(FIG, exist_ok=True)
P = json.load(open(os.path.join(D, "places.json")))
PP = json.load(open(os.path.join(D, "derived", "period-pixels.json")))
F = P["figures"]
RED, BLUE, ORANGE, GREEN, MAG, BLACK = (220, 20, 20), (0, 90, 255), (255, 130, 0), (0, 170, 60), (220, 0, 220), (0, 0, 0)
try:
    FONT = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
except OSError:
    FONT = ImageFont.load_default()


def label(dr, xy, text, fill=BLACK):
    x, y = xy
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            dr.text((x + dx, y + dy), text, fill=(255, 255, 255), font=FONT)
    dr.text((x, y), text, fill=fill, font=FONT)


def dashed(dr, pts, fill, width=2, on=10, off=7):
    for a, b in zip(pts[:-1], pts[1:]):
        L = math.hypot(b[0] - a[0], b[1] - a[1])
        if L == 0: continue
        t = 0.0
        while t < L:
            t1 = min(L, t + on)
            dr.line([(a[0] + (b[0] - a[0]) * t / L, a[1] + (b[1] - a[1]) * t / L), (a[0] + (b[0] - a[0]) * t1 / L, a[1] + (b[1] - a[1]) * t1 / L)], fill=fill, width=width)
            t = t1 + off


def cross(dr, p, fill, r=7, w=3):
    dr.line([(p[0] - r, p[1] - r), (p[0] + r, p[1] + r)], fill=fill, width=w); dr.line([(p[0] - r, p[1] + r), (p[0] + r, p[1] - r)], fill=fill, width=w)


def dot(dr, p, fill, r=5):
    dr.ellipse((p[0] - r, p[1] - r, p[0] + r, p[1] + r), outline=fill, width=3)


# ---------------- the CENIA surveys: a mosaic of the saved tiles, EPSG:5514 to its pixels ----------------
X0, Y0 = -925000.0, -920000.0
SD = {6: 57150.0, 7: 28575.0, 8: 14287.5, 9: 7143.75}


def survey(svc, level, E0, N0, E1, N1):
    res = SD[level] * 0.00028; size = 512 * res
    c0, c1 = int((E0 - X0) // size), int((E1 - X0) // size)
    r0, r1 = int((Y0 - N1) // size), int((Y0 - N0) // size)
    M = Image.new("RGB", ((c1 - c0 + 1) * 512, (r1 - r0 + 1) * 512), (255, 0, 255))
    have = 0
    for r in range(r0, r1 + 1):
        for c in range(c0, c1 + 1):
            p = os.path.join(RAW, "cenia", svc, f"{level}_{r}_{c}.img")
            if not os.path.exists(p): continue
            im = Image.open(p).convert("RGBA")
            bg = Image.new("RGBA", im.size, (255, 0, 255, 255)); bg.alpha_composite(im)
            M.paste(bg.convert("RGB"), ((c - c0) * 512, (r - r0) * 512)); have += 1
    ox, oy = X0 + c0 * size, Y0 - r0 * size
    to_px = lambda e, n: ((e - ox) / res, (oy - n) / res)
    # crop to the asked box
    a, b = to_px(E0, N1), to_px(E1, N0)
    box = (int(a[0]), int(a[1]), int(b[0]), int(b[1]))
    M = M.crop(box)
    return M, (lambda e, n: (to_px(e, n)[0] - box[0], to_px(e, n)[1] - box[1])), res, have


def scalebar(dr, W, H, res, metres, scale=1.0):
    px = metres / res * scale
    dr.rectangle((20, H - 40, 20 + px, H - 32), fill=BLACK)
    label(dr, (20, H - 60), f"{metres} m")
    label(dr, (W - 60, 15), "N ↑")


def overlay_survey(name, svc, level, box_ll, items, title, upscale=2):
    from_ll = None
    lat0, lon0, lat1, lon1 = box_ll
    import importlib.util
    E0, N0, E1, N1 = box_en(lat0, lon0, lat1, lon1)
    M, to_px, res, have = survey(svc, level, E0, N0, E1, N1)
    M = M.resize((M.size[0] * upscale, M.size[1] * upscale), Image.LANCZOS)
    tp = lambda en: tuple(v * upscale for v in to_px(en[0], en[1]))
    dr = ImageDraw.Draw(M)
    for it in items:
        kind, pts, col = it[0], it[1], it[2]
        if kind == "line": dr.line([tp(p) for p in pts], fill=col, width=3)
        elif kind == "dash": dashed(dr, [tp(p) for p in pts], col, 3)
        elif kind == "poly": dr.line([tp(p) for p in pts] + [tp(pts[0])], fill=col, width=3)
        elif kind == "cross": cross(dr, tp(pts), col)
        elif kind == "dot": dot(dr, tp(pts), col)
        if len(it) > 3 and it[3]:
            q = tp(pts if kind in ("cross", "dot") else pts[len(pts) // 2])
            label(dr, (q[0] + 8, q[1] + 4), it[3], col)
    label(dr, (15, 10), title)
    scalebar(dr, M.size[0], M.size[1], res, 500, upscale)
    M.save(os.path.join(FIG, name), quality=82)
    return {"file": "fig/" + name, "tiles": have, "metres_per_px": round(res / upscale, 2)}


def box_en(lat0, lon0, lat1, lon1):
    # the corners in EPSG:5514 through places.json's own conversions: the landmarks give a few; a local linear fit is enough for a crop
    L = P["landmarks"]
    pts = [(x["primary"]["lat"], x["primary"]["lon"], *F["landmarks"][x["id"]]) for x in L]
    A = np.array([[1, p[0], p[1]] for p in pts]); e = np.array([p[2] for p in pts]); n = np.array([p[3] for p in pts])
    ce = np.linalg.lstsq(A, e, rcond=None)[0]; cn = np.linalg.lstsq(A, n, rcond=None)[0]
    cs = [(la, lo) for la in (lat0, lat1) for lo in (lon0, lon1)]
    E = [ce @ [1, la, lo] for la, lo in cs]; N = [cn @ [1, la, lo] for la, lo in cs]
    return min(E), min(N), max(E), max(N)


out = {"figures": []}
LM = F["landmarks"]
road = [("line", s, BLUE) for s in F["real_road"]]
road[0] = road[0] + ("II/430 today (OSM)",)

# 1. the Second Survey's coverage over the field (level 6), with the missing sheet
cov_items = [("dash", F["drawn_highway"], RED, "highway as drawn"), ("cross", LM["posthouse"], BLUE, "post house"), ("dot", LM["sokolnice_castle"], BLUE, "Sokolnice castle"),
             ("dot", LM["santon_chapel"], BLUE, "Santon"), ("dot", LM["slavkov_chateau"], BLUE, "Slavkov château")]
if all(os.path.exists(os.path.join(RAW, "cenia", "II_vojenske_mapovani", f"6_{r}_{c}.img")) for r in (29, 30, 31) for c in (40, 41, 42)):
    out["figures"].append(dict(overlay_survey("ii_survey_coverage.jpg", "II_vojenske_mapovani", 6, (49.08, 16.64, 49.22, 16.92), road + cov_items,
                                              "Second Military Survey (CENIA WMTS, level 6): the sheet over the west of the field is missing (magenta)", 1),
                               what="coverage"))
else:   # the level-6 tiles are not kept in the repository (raw/manifest.json); the figure made from them is kept as it was
    out["figures"].append({"file": "fig/ii_survey_coverage.jpg", "what": "coverage", "note": "not redrawn: its level-6 tiles are not kept (fetch-places.js --only cenia refetches them)"})
# 2. the post house and the road on the Second Survey (level 7)
ph_items = [("dash", F["drawn_highway"], RED, "highway as drawn"), ("cross", F["gt_posthouse"], RED, "GT.posthouse"), ("dot", LM["posthouse"], BLUE, "Stará pošta (RÚIAN)"),
            ("dot", LM["holubice_gotthard"], BLUE, "Holubice chapel"), ("dot", LM["kovalovice_108"], BLUE, "")]
out["figures"].append(dict(overlay_survey("ii_survey_posthouse.jpg", "II_vojenske_mapovani", 7, (49.172, 16.783, 49.198, 16.848), road + ph_items,
                                          "Second Military Survey 1836-52 (CENIA, level 7): Holubitz to the post house", 2), what="posthouse"))
# 2b. the post house close (level 9, 2 m a pixel)
ph9 = [("dash", F["drawn_highway"], RED, "highway as drawn"), ("dot", LM["posthouse"], BLUE, "Stará pošta č.p. 109 (RÚIAN)"), ("dot", LM["kovalovice_108"], BLUE, "č.p. 108")]
out["figures"].append(dict(overlay_survey("ii_survey_posthouse_close.jpg", "II_vojenske_mapovani", 9, (49.1815, 16.8170, 49.1885, 16.8345), road + ph9,
                                          "Second Military Survey 1836-52 (CENIA, level 9): the Posoritzer Post", 1), what="posthouse-close"))
# 3. Slavkov on the Second Survey
sl_items = [("poly", F["garden"], BLUE, "garden today (OSM)"), ("poly", F["drawn_wood1"], RED, "'Austerlitz park' as drawn"),
            ("dot", LM["slavkov_chateau"], BLUE, "château"), ("dot", LM["slavkov_church"], BLUE, "church")]
out["figures"].append(dict(overlay_survey("ii_survey_slavkov.jpg", "II_vojenske_mapovani", 7, (49.143, 16.855, 49.162, 16.895), sl_items,
                                          "Second Military Survey 1836-52 (CENIA, level 7): Austerlitz", 2), what="slavkov"))
sl9 = [("poly", F["garden"], BLUE, "garden today (OSM)"), ("dot", LM["slavkov_chateau"], BLUE, "château"), ("dot", LM["slavkov_church"], BLUE, "church")]
out["figures"].append(dict(overlay_survey("ii_survey_slavkov_close.jpg", "II_vojenske_mapovani", 9, (49.1515, 16.8625, 49.1570, 16.8795), sl9,
                                          "Second Military Survey 1836-52 (CENIA, level 9): the château and its garden", 1), what="slavkov-close"))
# 4. the road on the Third Survey (1:75,000 special map; the edition CENIA serves carries Czech names), through the Second Survey's gap
iii_items = [("dash", F["drawn_highway"], RED, "highway as drawn"), ("dot", LM["santon_chapel"], BLUE, "Santon"), ("dot", LM["tvarozna_church"], BLUE, "Tvarožná church"),
             ("dot", LM["posthouse"], BLUE, "Stará pošta"), ("cross", F["gt_posthouse"], RED, "GT.posthouse")]
out["figures"].append(dict(overlay_survey("iii_survey_highway.jpg", "III_vojenske_mapovani", 7, (49.172, 16.735, 49.200, 16.850), road + iii_items,
                                          "Third Military Survey special map 1:75,000 (CENIA, level 7): the Santon to the post house", 2), what="highway"))
# 5. Sokolnice on the Third Survey
so_items = [("poly", F["pheasantry"], GREEN, "woodland today"), ("poly", F["drawn_wood0"], RED, "pheasantry as drawn"), ("dash", F["drawn_goldbach"], RED, "Goldbach as drawn"),
            ("cross", F["drawn_castle"], RED, "castle as drawn"), ("dot", LM["sokolnice_castle"], BLUE, "castle")] + [("line", s, BLUE) for s in F["real_stream"]]
out["figures"].append(dict(overlay_survey("iii_survey_sokolnice.jpg", "III_vojenske_mapovani", 8, (49.104, 16.704, 49.136, 16.746), so_items,
                                          "Third Military Survey special map 1:75,000 (CENIA, level 8): Sokolnitz", 1), what="sokolnice-iii"))

# 6. the 1825 sketches of Sokolnitz (and Kobelnitz north of the boundary), in the Sokolnitz mosaic's pixels
MZ = os.path.join(RAW, "mza")


def piece(sk, S):
    if not os.path.exists(os.path.join(MZ, sk, "little", f"{S}-A1.jpg")): return None
    im = Image.new("RGB", (651, 522))
    for ai, a in enumerate("ABC"):
        for n in (1, 2, 3):
            im.paste(Image.open(os.path.join(MZ, sk, "little", f"{S}-{a}{n}.jpg")).convert("RGB"), (ai * 217, (n - 1) * 174))
    return im


fp = P["checks"]["period1825"]["figure_px"]
TOP = 522                      # one row of Kobelnitz above the Sokolnitz mosaic's row 03
C = Image.new("RGB", (1302, 1566 + TOP), (235, 228, 210))
for ri, r in enumerate(["03", "04", "05"]):
    for ci, c in enumerate(["D", "E"]):
        C.paste(piece("MOR246318250", f"A{r}{c}"), (ci * 651, TOP + ri * 522))
k05 = piece("MOR102418250", "A05C"); k06 = piece("MOR102418250", "A06C")
C.paste(k05, (651, 0))                                         # Kobelnitz A05C: the quarter sheet north of Sokolnitz A03E
terr = Image.new("L", (1302, 1566 + TOP), 0)
ImageDraw.Draw(terr).polygon([(p[0], p[1] + TOP) for p in fp["territory_today"]], fill=1)
tm = np.asarray(terr).astype(bool)
Cn = np.asarray(C).copy(); K6 = np.asarray(k06)
sub = Cn[TOP:TOP + 522, 651:1302]; outside = ~tm[TOP:TOP + 522, 651:1302]
sub[outside] = K6[outside]                                      # north of today's boundary: Kobelnitz's drawing of the same quarter sheet
Cn[TOP:TOP + 522, 651:1302] = sub
C = Image.fromarray(Cn)
dr = ImageDraw.Draw(C)
sh = lambda pts: [(p[0], p[1] + TOP) for p in pts]
dashed(dr, sh(fp["territory_today"]), MAG, 2, 6, 6)
dr.line(sh(fp["woodland_today"]), fill=GREEN, width=3)
for s in fp["riicka_today"]: dr.line(sh(s), fill=BLUE, width=2)
dashed(dr, sh(fp["drawn_goldbach"]), RED, 3)
dr.line(sh(fp["drawn_wood"]), fill=RED, width=3)
fas = PP["features"]["fasangarten_1825"]["px"]
dr.line(sh(fas) + sh(fas[:1]), fill=ORANGE, width=2)
cross(dr, sh([fp["drawn_castle"]])[0], RED); dot(dr, sh([fp["castle_today"]])[0], BLUE); dot(dr, sh([fp["village_point"]])[0], RED, 4)
label(dr, (sh([fp["drawn_castle"]])[0][0] + 10, sh([fp["drawn_castle"]])[0][1]), "castle as drawn", RED)
label(dr, (sh([fp["village_point"]])[0][0] - 150, sh([fp["village_point"]])[0][1] - 20), "Sokolnitz point", RED)
label(dr, (700, TOP - 470), "Kobelnitz 1825 (A05C; A06C north of the boundary)")
label(dr, (15, TOP + 10), "Sokolnitz 1825 (MZA D9 MOR246318250, level 2)")
label(dr, (1000, TOP + 330), "1825 'Fasangarten'", ORANGE)
label(dr, (1040, TOP - 300), "woodland today", GREEN)
label(dr, (600, 1566 + TOP - 30), "'pheasantry' as drawn continues south (red)", RED)
s_px = P["checks"]["period1825"]["fitC"]["px_per_m"]
dr.rectangle((20, 1566 + TOP - 70, 20 + 200 * s_px, 1566 + TOP - 62), fill=BLACK); label(dr, (20, 1566 + TOP - 92), "200 m")
C.save(os.path.join(FIG, "sokolnitz_1825_overlay.jpg"), quality=80)
out["figures"].append({"file": "fig/sokolnitz_1825_overlay.jpg", "what": "sokolnitz-1825", "metres_per_px": round(1 / s_px, 2)})

# the 1826 sketches read without a georeference: Austerlitz's town enlargement (previews) and Bosenitz's highway (level 2)
def previews(sk, rows, cols, scale):
    M = Image.new("RGB", (217 * len(cols), 174 * len(rows)), (235, 228, 210))
    for ri, r in enumerate(rows):
        for ci, c in enumerate(cols):
            pth = os.path.join(MZ, sk, "Preview", f"A{r}{c}.jpg")
            if os.path.exists(pth): M.paste(Image.open(pth).convert("RGB"), (ci * 217, ri * 174))
    return M.resize((M.size[0] * scale, M.size[1] * scale), Image.LANCZOS)
S1 = previews("MOR243418260", ["11", "12"], "ABCD", 2); d1 = ImageDraw.Draw(S1)
label(d1, (10, 8), "Austerlitz 1826 (MZA D9 MOR243418260, pieces A11A-A12D, level 1): the château, its garden to the west, the church on the square")
S1.save(os.path.join(FIG, "austerlitz_1826_town.jpg"), quality=82)
out["figures"].append({"file": "fig/austerlitz_1826_town.jpg", "what": "austerlitz-1826", "note": "not georeferenced; read for the garden's side of the château"})
B2 = Image.new("RGB", (651 * 4, 522), (235, 228, 210))
for ci, c in enumerate("BCDE"):
    pc = piece("MOR273018260", f"A07{c}")
    if pc: B2.paste(pc, (ci * 651, 0))
B2 = B2.crop((400, 180, 2604, 522)); d2 = ImageDraw.Draw(B2)
label(d2, (10, 8), "Bosenitz 1826 (MZA D9 MOR273018260, pieces A07B-A07E, level 2): the highway as a chaussée (pale carmine) between rows of trees")
B2.save(os.path.join(FIG, "bosenitz_1826_highway.jpg"), quality=82)
out["figures"].append({"file": "fig/bosenitz_1826_highway.jpg", "what": "bosenitz-1826", "note": "not georeferenced (an attempt by its boundary failed: README)"})

# what Kobelnitz's sketch shows under today's woodland north of today's boundary (colour classes of the level-2 pixels)
wood = Image.new("L", C.size, 0); ImageDraw.Draw(wood).polygon(sh(fp["woodland_today"]), fill=1)
wm = np.asarray(wood).astype(bool) & ~tm
A = np.asarray(Image.fromarray(np.asarray(C)))  # (overlays only on lines: sample the unpainted composite instead)
base = np.asarray(Image.fromarray(Cn)).astype(int)
ys, xs = np.nonzero(wm)
cls = {"green wash": 0, "dark grey wash (as the Sokolnitz Fasangarten)": 0, "unwashed paper": 0, "other": 0}
for y, x in zip(ys[::3], xs[::3]):
    r, g, b = base[y, x]; m = (r + g + b) / 3; sat = max(r, g, b) - min(r, g, b)
    if g - r > 8: cls["green wash"] += 1
    elif m < 115 and sat < 45: cls["dark grey wash (as the Sokolnitz Fasangarten)"] += 1
    elif m > 140 and r >= g >= b and r - b > 30: cls["unwashed paper"] += 1
    else: cls["other"] += 1
n = max(1, sum(cls.values()))
out["kobelnitz_under_todays_woodland"] = {"what": "the 1825 Kobelnitz sketch's level-2 pixels inside today's woodland outline (OSM relation 7163945) and outside today's Sokolnice territory, by colour",
                                          "samples": n, "shares": {k: round(v / n, 3) for k, v in cls.items()},
                                          "share_of_todays_woodland_north_of_boundary": P["checks"]["sokolnice"]["pheasantry"]["by_territory"]}
json.dump(out, open(os.path.join(D, "derived", "period-figures.json"), "w"), indent=1)
print(json.dumps(out, indent=1))
