# QR code Treffel Coffee House « feuilles de trèfle » (bordeaux et beige)
#   python qr/make_qr_art.py            (génère les PNG dans qr/)
#
# Chaque module du code est une petite feuille du trèfle Treffel : trois coins
# arrondis et un coin vif tourné vers le centre, comme les feuilles du logo.
# Les trois yeux du code sont de grandes feuilles. Le trèfle occupe le centre :
# les modules s'écartent en suivant sa silhouette (aucun cadre). La correction
# d'erreur maximale (H) compense les modules retirés.
import os
import numpy as np
import qrcode
from qrcode.constants import ERROR_CORRECT_H
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import pymupdf

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
URL = open(os.path.join(HERE, "URL.txt"), encoding="utf-8").read().strip()

# Palette du brand book Treffel Coffee House
BORDEAUX = (0x47, 0x12, 0x24)   # #471224
CREAM = (0xFF, 0xF9, 0xF2)      # #fff9f2
FOREST = (0x22, 0x37, 0x2C)     # #22372c
GOLD = (0xF3, 0xE8, 0xB8)       # #f3e8b8

MOD = 40          # taille finale d'un module, en px
SS = 3            # suréchantillonnage (bords lisses)
QUIET = 4         # marge de silence, en modules
LEAF_PAD = 0.04   # espace entre feuilles (fraction de module)
ROUND = 0.42      # rayon des coins arrondis (fraction de module)
SHARP = 0.08      # rayon du coin vif
CLOVER_MODS = 9.0 # largeur du trèfle central, en modules
CLEAR = 0.75      # marge autour du trèfle, en modules


def svg_mask(name, size):
    """Silhouette d'un logo (masque L, 255 = forme) à la taille demandée (carré)."""
    svg = open(os.path.join(ROOT, "logos", name), encoding="utf-8").read().replace('fill="currentColor"', 'fill="#000000"')
    page = pymupdf.open("svg", svg.encode("utf-8"))[0]
    z = size / max(page.rect.width, page.rect.height)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(z, z), alpha=True)
    a = Image.frombytes("RGBA", (pix.width, pix.height), pix.samples).split()[-1]
    out = Image.new("L", (size, size), 0)
    out.paste(a, ((size - a.width) // 2, (size - a.height) // 2))
    return out


def svg_rgba(name, color, height):
    hexc = "#%02x%02x%02x" % color
    svg = open(os.path.join(ROOT, "logos", name), encoding="utf-8").read().replace('fill="currentColor"', f'fill="{hexc}"')
    page = pymupdf.open("svg", svg.encode("utf-8"))[0]
    z = height / page.rect.height
    pix = page.get_pixmap(matrix=pymupdf.Matrix(z * 2, z * 2), alpha=True)
    im = Image.frombytes("RGBA", (pix.width, pix.height), pix.samples)
    return im.resize((max(1, round(im.width / 2)), max(1, round(im.height / 2))), Image.LANCZOS)


def leaf(draw, x0, y0, x1, y1, sharp, fill, r_round, r_sharp):
    """Rectangle aux coins arrondis, sauf le coin `sharp` ('tl','tr','bl','br')."""
    draw.rounded_rectangle([x0, y0, x1, y1], radius=r_round, fill=fill)
    w, h = x1 - x0, y1 - y0
    qx0, qy0 = (x0, y0) if sharp[1] == "l" and sharp[0] == "t" else (0, 0)
    # recouvre le quart du coin vif par un rectangle presque carré
    if sharp == "tl":
        box = [x0, y0, x0 + w / 2, y0 + h / 2]
    elif sharp == "tr":
        box = [x1 - w / 2, y0, x1, y0 + h / 2]
    elif sharp == "bl":
        box = [x0, y1 - h / 2, x0 + w / 2, y1]
    else:
        box = [x1 - w / 2, y1 - h / 2, x1, y1]
    draw.rounded_rectangle(box, radius=r_sharp, fill=fill)


def toward_center(r, c, n):
    """Le coin d'un module le plus proche du centre du code."""
    mid = (n - 1) / 2
    v = "t" if r > mid else "b"
    h = "l" if c > mid else "r"
    return v + h


def render(ink, ground, eye_inner, suffix):
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, border=0)
    qr.add_data(URL)
    qr.make(fit=True)
    m = np.array(qr.get_matrix(), dtype=bool)
    n = m.shape[0]
    u = MOD * SS
    size = (n + 2 * QUIET) * u
    img = Image.new("RGB", (size, size), ground)
    dr = ImageDraw.Draw(img)
    off = QUIET * u

    # silhouette du trèfle central, élargie de la marge
    cw = int(CLOVER_MODS * u)
    clover = svg_mask("treffel-clover.svg", cw)
    clear = clover.filter(ImageFilter.MaxFilter(int(CLEAR * u) | 1)) if CLEAR > 0 else clover
    clear_np = np.array(clear) > 40
    c0 = off + (n * u - cw) // 2

    def in_clover(r, c):
        cx = off + c * u + u // 2 - c0
        cy = off + r * u + u // 2 - c0
        if 0 <= cx < cw and 0 <= cy < cw:
            # le module est retiré si une bonne part de sa surface touche la silhouette
            x0, y0 = max(0, cx - u // 2), max(0, cy - u // 2)
            patch = clear_np[y0:cy + u // 2, x0:cx + u // 2]
            return patch.mean() > 0.18
        return False

    eyes = [(0, 0), (0, n - 7), (n - 7, 0)]

    def in_eye(r, c):
        return any(er <= r < er + 7 and ec <= c < ec + 7 for er, ec in eyes)

    removed = 0
    pad = LEAF_PAD * u
    for r in range(n):
        for c in range(n):
            if not m[r, c] or in_eye(r, c):
                continue
            if in_clover(r, c):
                removed += 1
                continue
            x0, y0 = off + c * u + pad, off + r * u + pad
            leaf(dr, x0, y0, x0 + u - 2 * pad, y0 + u - 2 * pad, toward_center(r, c, n), ink, ROUND * u, SHARP * u)

    # yeux : grandes feuilles (anneau 7x7, vide 5x5, cœur 3x3)
    for er, ec in eyes:
        sharp = toward_center(er + 3, ec + 3, n)
        X, Y = off + ec * u, off + er * u
        leaf(dr, X, Y, X + 7 * u, Y + 7 * u, sharp, ink, 0.8 * u, 0.3 * u)
        leaf(dr, X + u, Y + u, X + 6 * u, Y + 6 * u, sharp, ground, 0.55 * u, 0.18 * u)
        leaf(dr, X + 2 * u, Y + 2 * u, X + 5 * u, Y + 5 * u, sharp, eye_inner, 0.3 * u, 0.1 * u)

    # le trèfle, dans l'encre du code
    clover_px = Image.new("RGB", (cw, cw), ink)
    img.paste(clover_px, (c0, c0), clover)

    final = img.resize((size // SS, size // SS), Image.LANCZOS)
    final.save(os.path.join(HERE, f"treffel-qr{suffix}.png"))
    return final, removed, n


def card(code, ink, ground, suffix):
    S = code.width
    # le code porte déjà sa marge de silence (QUIET modules, couleur du fond) :
    # la marque reste AU-DESSUS de cette marge, jamais dedans.
    q = int(S * QUIET / (S / MOD))
    W = int(S * 1.06)
    wm = svg_rgba("treffel-wordmark-horizontal.svg", ink, int(S * 0.075))
    top = int(S * 0.07) + wm.height
    bottom = int(S * 0.24)
    gap = -int(q * 0.45)                       # la ligne de court entre un peu dans la marge
    H = top + S + gap + bottom
    out = Image.new("RGB", (W, H), ground)
    d = ImageDraw.Draw(out)
    out.paste(code, ((W - S) // 2, top))
    out.paste(wm, ((W - wm.width) // 2, int(S * 0.06)), wm)
    line_col = tuple(int(a * 0.55 + b * 0.45) for a, b in zip(ink, ground))
    y = top + S + gap + int(bottom * 0.06)
    lw = max(2, S // 420)
    d.line([(W // 2 - int(S * 0.38), y), (W // 2 + int(S * 0.38), y)], fill=line_col, width=lw)
    d.line([(W // 2, y - S // 70), (W // 2, y + S // 70)], fill=line_col, width=lw)

    def font(paths, size):
        for f in paths:
            try:
                return ImageFont.truetype(f, size)
            except OSError:
                continue
        return ImageFont.load_default()

    t1 = "Scannez, la carte est là."
    f1 = font(["Teodor-Regular.ttf", "C:/Windows/Fonts/georgiai.ttf"], int(S * 0.062))
    d.text(((W - d.textlength(t1, font=f1)) // 2, y + int(bottom * 0.16)), t1, font=f1, fill=ink)
    t2 = "C O F F E E   H O U S E"
    f2 = font(["C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf"], int(S * 0.026))
    d.text(((W - d.textlength(t2, font=f2)) // 2, y + int(bottom * 0.58)), t2, font=f2, fill=line_col)
    out.save(os.path.join(HERE, f"treffel-qr-carte{suffix}.png"))


if __name__ == "__main__":
    for ink, ground, inner, suffix in [(CREAM, BORDEAUX, GOLD, "-bordeaux"), (BORDEAUX, CREAM, FOREST, "-beige")]:
        code, removed, n = render(ink, ground, inner, suffix)
        card(code, ink, ground, suffix)
        print(f"treffel-qr{suffix}.png  {n}x{n} modules, {removed} retirés pour le trèfle ({removed / (n * n):.1%})")
    print("URL:", URL)
