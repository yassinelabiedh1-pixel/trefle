# Transforme les photos annotées des fiches de production Treffel en photos de carte :
# plat détouré (ellipse), flèches/étiquettes retirées (inpainting), cadrage serré 4:3,
# fond de pierre sombre texturé, ombre douce, étalonnage chaud, vignette.
#
#   python -I plates.py <src_dir> <out_dir> <overrides_dir> [--only slug]
#
# Réglages par plat : <overrides_dir>/<slug>.json, tous les champs sont optionnels :
#   ellipse   [cx, cy, ra, rb, angle]   plat, en pixels SOURCE (sinon détection auto)
#   extra     [[cx, cy, ra, rb, angle]] ellipses ajoutées au détourage (pot, coupelle…)
#   shrink    0.985    réduction de l'ellipse (évite un liseré blanc)
#   zoom      0.92     < 1 = le plat déborde du cadre ; 1 = plat entier
#   offset    [dx, dy] décalage du cadrage, pixels SOURCE
#   auto      {"strokes": true, "hough": true, "heads": true, "text": true}
#             active/désactive chaque détection automatique
#   protect_out [[fx0, fy0, fx1, fy1]]  zones (fractions 0..1 de l'image FINALE) que
#             le nettoyage automatique ne doit pas toucher (nourriture abîmée)
#   erase_out   [[fx0, fy0, fx1, fy1]]  zones (fractions de l'image FINALE) à effacer
#             (restes de flèches, pointes, lettres) ; reportées sur la source
#   erase_radius 4     rayon d'inpainting
import sys, os, json
import numpy as np
import cv2

args = [a for a in sys.argv[1:] if not a.startswith("--")]
SRC, OUT, OVR_DIR = args[0], args[1], args[2]
ONLY = None
if "--only" in sys.argv:
    ONLY = sys.argv[sys.argv.index("--only") + 1]
os.makedirs(OUT, exist_ok=True)
DBG = os.path.join(OUT, "debug"); os.makedirs(DBG, exist_ok=True)

DISHES = {
    "production-p1-0.png": "le-breakfast-club",
    "production-p2-0.png": "le-savory-club",
    "production-p3-0.png": "granola-bowl",
    "production-p4-0.png": "salade-classique",
    "production-p5-0.png": "sardines-houmous-mediterranean",
    "production-p6-0.png": "sweet-mediterranean-bowl",
    "production-p7-0.png": "chickpea-salad-bowl",
    "production-p8-0.png": "recovery-bowl",
    "production-p9-0.png": "dragon-eyes-rice",
}
W_OUT, H_OUT = 1200, 900


def load_ovr(slug):
    p = os.path.join(OVR_DIR, slug + ".json")
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {}


def find_plate(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    nonwhite = ((gray < 236) | (hsv[..., 1] > 22)).astype(np.uint8) * 255
    k = max(7, int(min(img.shape[:2]) * 0.018)) | 1
    opened = cv2.morphologyEx(nonwhite, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    closed = cv2.morphologyEx(opened, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k * 3, k * 3)))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(closed)
    i = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    hull = cv2.convexHull(cv2.findNonZero((lab == i).astype(np.uint8)))
    (cx, cy), (a, b), ang = cv2.fitEllipse(hull)
    return [cx, cy, a / 2, b / 2, ang]


def text_mask(gray, hsv):
    dark = ((gray < 120) & (hsv[..., 1] < 60)).astype(np.uint8) * 255
    n, lab, st, _ = cv2.connectedComponentsWithStats(dark, connectivity=8)
    glyph = np.zeros_like(dark)
    for i in range(1, n):
        x, y, w, h, a = st[i]
        if 18 <= a <= 600 and 6 <= h <= 34 and w <= 40:
            glyph[lab == i] = 255
    words = cv2.dilate(glyph, cv2.getStructuringElement(cv2.MORPH_RECT, (13, 3)))
    n2, lab2, st2, _ = cv2.connectedComponentsWithStats(words)
    out = np.zeros_like(dark)
    for i in range(1, n2):
        x, y, w, h, a = st2[i]
        letters = cv2.connectedComponentsWithStats(cv2.bitwise_and(glyph, (lab2 == i).astype(np.uint8) * 255))[0] - 1
        if letters >= 4 and w >= 2.2 * h and h <= 40:
            out[max(0, y - 4):y + h + 4, max(0, x - 4):x + w + 4] = 255
    return out


def stroke_mask(img, plate_mask, auto):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    bh = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
    cand = ((bh > 30) & (hsv[..., 1] < 80) & (gray < 170)).astype(np.uint8) * 255
    keep = np.zeros_like(cand)
    if auto.get("strokes", True):
        n, lab, stats, _ = cv2.connectedComponentsWithStats(cand, connectivity=8)
        for i in range(1, n):
            x, y, w, h, area = stats[i]
            span = float(np.hypot(w, h))
            thick = area / max(span, 1.0)
            if (span >= 30 and thick <= 5.0) or (span >= 20 and thick <= 3.6):
                keep[lab == i] = 255
    if auto.get("hough", True):
        lines = cv2.HoughLinesP(cand, 1, np.pi / 180, threshold=22, minLineLength=26, maxLineGap=7)
        if lines is not None:
            for x1, y1, x2, y2 in lines.reshape(-1, 4):
                seg = np.zeros_like(cand)
                cv2.line(seg, (int(x1), int(y1)), (int(x2), int(y2)), 255, 3)
                on = (cv2.bitwise_and(seg, cand) > 0).sum() / max((seg > 0).sum(), 1)
                if on > 0.42:
                    cv2.line(keep, (int(x1), int(y1)), (int(x2), int(y2)), 255, 5)
    if auto.get("text", True):
        keep = cv2.bitwise_or(keep, text_mask(gray, hsv))
    keep = cv2.dilate(keep, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    if auto.get("heads", True):
        heads = ((gray < 120) & (hsv[..., 1] < 70)).astype(np.uint8) * 255
        near = cv2.dilate(keep, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
        n2, lab2, st2, _ = cv2.connectedComponentsWithStats(heads)
        for i in range(1, n2):
            x, y, w, h, a = st2[i]
            if 12 <= a <= 420 and max(w, h) <= 34 and (near[lab2 == i] > 0).any():
                keep[lab2 == i] = 255
        keep = cv2.dilate(keep, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    return cv2.bitwise_and(keep, plate_mask)


def stone_backdrop(w, h, seed):
    rng = np.random.default_rng(seed)
    base = np.array([34, 39, 42], np.float32)
    noise = rng.normal(0, 1, (h // 4 + 1, w // 4 + 1)).astype(np.float32)
    noise = cv2.resize(cv2.GaussianBlur(noise, (0, 0), 3), (w, h))
    fine = rng.normal(0, 1, (h, w)).astype(np.float32)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    light = 1.0 + 0.22 * np.exp(-(((xx - w * 0.25) / (w * 0.7)) ** 2 + ((yy - h * 0.15) / (h * 0.7)) ** 2))
    bg = base[None, None, :] * light[..., None] + noise[..., None] * 5 + fine[..., None] * 2.2
    return np.clip(bg, 0, 255)


def grade(img):
    f = img.astype(np.float32) / 255.0
    f = np.clip((f - 0.5) * 1.06 + 0.5, 0, 1)
    f[..., 2] *= 1.035; f[..., 0] *= 0.975
    f = np.clip(f, 0, 1)
    hsv = cv2.cvtColor((f * 255).round().astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[..., 1] = np.clip(hsv[..., 1] * 1.08, 0, 255)
    return cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)


def process(fn, slug):
    img = cv2.imread(os.path.join(SRC, fn))
    o = load_ovr(slug)
    cx, cy, ra, rb, ang = o.get("ellipse") or find_plate(img)
    shrink = o.get("shrink", 0.985)
    H, W = img.shape[:2]
    pm = np.zeros((H, W), np.uint8)
    cv2.ellipse(pm, ((cx, cy), (ra * 2 * shrink, rb * 2 * shrink), ang), 255, -1)
    for (ex, ey, ea, eb, eang) in o.get("extra", []):
        cv2.ellipse(pm, ((ex, ey), (ea * 2, eb * 2), eang), 255, -1)

    # cadrage 4:3 (calculé d'abord : les zones *_out y sont exprimées)
    zoom = o.get("zoom", 0.92)
    major, minor = max(ra, rb) * 2, min(ra, rb) * 2
    crop_w = max(major, minor * 4 / 3) * zoom
    crop_h = crop_w * 3 / 4
    dx, dy = o.get("offset", [0, 0])
    x0, y0 = cx - crop_w / 2 + dx, cy - crop_h / 2 + dy

    def out_to_src(box):
        fx0, fy0, fx1, fy1 = box
        return (int(round(x0 + fx0 * crop_w)), int(round(y0 + fy0 * crop_h)),
                int(round(x0 + fx1 * crop_w)), int(round(y0 + fy1 * crop_h)))

    sm = stroke_mask(img, pm, o.get("auto", {}))
    for box in o.get("protect_out", []):
        a, b, c, d = out_to_src(box)
        sm[max(0, b):max(0, d), max(0, a):max(0, c)] = 0
    for box in o.get("erase_out", []):
        a, b, c, d = out_to_src(box)
        sm[max(0, b):max(0, d), max(0, a):max(0, c)] = 255
    clean = cv2.inpaint(img, sm, o.get("erase_radius", 4), cv2.INPAINT_TELEA)

    M = np.array([[W_OUT / crop_w, 0, -x0 * W_OUT / crop_w], [0, H_OUT / crop_h, -y0 * H_OUT / crop_h]], np.float32)
    plate = cv2.warpAffine(clean, M, (W_OUT, H_OUT), flags=cv2.INTER_LANCZOS4, borderValue=(255, 255, 255))
    # détourage tracé directement en résolution finale (x4 puis réduit) : bord lisse, sans escalier
    SS = 4
    sc = W_OUT / crop_w
    big = np.zeros((H_OUT * SS, W_OUT * SS), np.uint8)
    ells = [(cx, cy, ra * shrink, rb * shrink, ang)] + [tuple(e) for e in o.get("extra", [])]
    for (ex, ey, ea, eb, eang) in ells:
        c = ((ex - x0) * sc * SS, (ey - y0) * sc * SS)
        cv2.ellipse(big, (c, (ea * 2 * sc * SS, eb * 2 * sc * SS), eang), 255, -1, cv2.LINE_AA)
    mask = cv2.resize(big, (W_OUT, H_OUT), interpolation=cv2.INTER_AREA)
    mask = cv2.GaussianBlur(mask, (0, 0), 0.7).astype(np.float32) / 255.0

    bg = stone_backdrop(W_OUT, H_OUT, sum(map(ord, slug)))
    shadow = cv2.warpAffine(pm, M, (W_OUT, H_OUT)).astype(np.float32) / 255.0
    shadow = np.roll(np.roll(shadow, int(H_OUT * 0.025), 0), int(W_OUT * 0.015), 1)
    shadow = cv2.GaussianBlur(shadow, (0, 0), W_OUT * 0.022)
    bg *= (1 - 0.55 * shadow)[..., None]

    comp = plate.astype(np.float32) * mask[..., None] + bg * (1 - mask[..., None])
    comp = grade(np.clip(comp, 0, 255).astype(np.uint8)).astype(np.float32)
    yy, xx = np.mgrid[0:H_OUT, 0:W_OUT].astype(np.float32)
    vig = 1 - 0.28 * (((xx - W_OUT / 2) / (W_OUT * 0.62)) ** 2 + ((yy - H_OUT / 2) / (H_OUT * 0.62)) ** 2)
    comp = np.clip(comp * np.clip(vig, 0.55, 1)[..., None], 0, 255).astype(np.uint8)
    blur = cv2.GaussianBlur(comp, (0, 0), 1.0)
    comp = cv2.addWeighted(comp, 1.35, blur, -0.35, 0)
    cv2.imwrite(os.path.join(OUT, slug + ".png"), comp)

    # debug : la zone nettoyée (magenta) vue dans le cadrage final, avec une grille 10 %
    dbg = cv2.warpAffine(img, M, (W_OUT, H_OUT), flags=cv2.INTER_LINEAR, borderValue=(255, 255, 255))
    smo = cv2.warpAffine(sm, M, (W_OUT, H_OUT))
    dbg[smo > 0] = (255, 0, 255)
    for k in range(1, 10):
        cv2.line(dbg, (int(W_OUT * k / 10), 0), (int(W_OUT * k / 10), H_OUT), (0, 200, 255), 1)
        cv2.line(dbg, (0, int(H_OUT * k / 10)), (W_OUT, int(H_OUT * k / 10)), (0, 200, 255), 1)
        cv2.putText(dbg, f"{k/10:.1f}", (int(W_OUT * k / 10) + 3, 16), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 120, 255), 1)
        cv2.putText(dbg, f"{k/10:.1f}", (3, int(H_OUT * k / 10) - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 120, 255), 1)
    cv2.imwrite(os.path.join(DBG, slug + "-debug.png"), dbg)
    # grille aussi sur une copie du rendu final, pour repérer les restes
    grid = comp.copy()
    for k in range(1, 10):
        cv2.line(grid, (int(W_OUT * k / 10), 0), (int(W_OUT * k / 10), H_OUT), (0, 200, 255), 1)
        cv2.line(grid, (0, int(H_OUT * k / 10)), (W_OUT, int(H_OUT * k / 10)), (0, 200, 255), 1)
        cv2.putText(grid, f"{k/10:.1f}", (int(W_OUT * k / 10) + 3, 16), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 220, 255), 1)
        cv2.putText(grid, f"{k/10:.1f}", (3, int(H_OUT * k / 10) - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 220, 255), 1)
    cv2.imwrite(os.path.join(DBG, slug + "-grid.png"), grid)
    return {"slug": slug, "ellipse": [round(float(v), 1) for v in (cx, cy, ra, rb, ang)],
            "masked_px": int((sm > 0).sum())}


for fn, slug in DISHES.items():
    if ONLY and slug != ONLY:
        continue
    print(json.dumps(process(fn, slug)))
