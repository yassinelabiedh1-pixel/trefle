# QR code de la carte Treffel : modules arrondis, emblème au centre, carte imprimable.
#   python qr/make_qr.py
import os, sys
import qrcode
from qrcode.constants import ERROR_CORRECT_H
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
from PIL import Image, ImageDraw
import pymupdf

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
URL = open(os.path.join(HERE, "URL.txt"), encoding="utf-8").read().strip()

FOREST = (0x22, 0x37, 0x2C)
CREAM = (0xE5, 0xD8, 0xC5)

def svg_image(name, color_hex, height):
    svg = open(os.path.join(ROOT, "logos", name), encoding="utf-8").read()
    svg = svg.replace('fill="currentColor"', f'fill="{color_hex}"')
    doc = pymupdf.open("svg", svg.encode("utf-8"))
    page = doc[0]
    z = height / page.rect.height
    pix = page.get_pixmap(matrix=pymupdf.Matrix(z * 2, z * 2), alpha=True)
    im = Image.frombytes("RGBA", (pix.width, pix.height), pix.samples)
    return im.resize((max(1, round(im.width / 2)), max(1, round(im.height / 2))), Image.LANCZOS)

def make(ink, ground, suffix):
    ink_hex = "#%02x%02x%02x" % ink
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, box_size=26, border=0)
    qr.add_data(URL)
    qr.make(fit=True)
    code = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(radius_ratio=1),
        color_mask=SolidFillColorMask(back_color=ground, front_color=ink),
    ).convert("RGBA")
    S = code.width

    # 1. le code seul (marge de sécurité incluse)
    m = int(S * 0.08)
    alone = Image.new("RGB", (S + 2 * m, S + 2 * m), ground)
    alone.paste(code, (m, m), code)
    alone.save(os.path.join(HERE, f"treffel-qr{suffix}.png"))

    # 2. la carte imprimable : emblème en haut, code, ligne de court, invitation, marque
    W = S + 2 * int(S * 0.16)
    top, gap, bottom = int(S * 0.34), int(S * 0.10), int(S * 0.30)
    H = top + S + gap + bottom
    card = Image.new("RGB", (W, H), ground)
    d = ImageDraw.Draw(card)
    emblem = svg_image("treffel-emblem-vertical.svg", ink_hex, int(top * 0.58))
    card.paste(emblem, ((W - emblem.width) // 2, int(top * 0.19)), emblem)
    card.paste(code, ((W - S) // 2, top), code)
    y = top + S + gap // 2
    line_col = tuple(int(a * 0.55 + b * 0.45) for a, b in zip(ink, ground))
    d.line([(W // 2 - S // 2, y), (W // 2 + S // 2, y)], fill=line_col, width=max(2, S // 400))
    d.line([(W // 2, y - S // 60), (W // 2, y + S // 60)], fill=line_col, width=max(2, S // 400))
    from PIL import ImageFont
    def font(size):
        for f in ["Teodor-Regular.ttf", "C:/Windows/Fonts/georgiai.ttf", "C:/Windows/Fonts/georgia.ttf"]:
            try:
                return ImageFont.truetype(f, size)
            except OSError:
                continue
        return ImageFont.load_default()
    t1 = "Scannez, la carte est là."
    f1 = font(int(S * 0.065))
    w1 = d.textlength(t1, font=f1)
    d.text(((W - w1) // 2, top + S + gap + int(bottom * 0.08)), t1, font=f1, fill=ink)
    wordmark = svg_image("treffel-wordmark-horizontal.svg", ink_hex, int(S * 0.055))
    card.paste(wordmark, ((W - wordmark.width) // 2, top + S + gap + int(bottom * 0.55)), wordmark)
    card.save(os.path.join(HERE, f"treffel-qr-carte{suffix}.png"))
    return alone

import cv2, numpy as np
det = cv2.QRCodeDetector()
for ink, ground, suffix in [(FOREST, CREAM, ""), (CREAM, FOREST, "-fonce")]:
    im = make(ink, ground, suffix)
    arr = cv2.cvtColor(np.array(im.convert("RGB")), cv2.COLOR_RGB2BGR)
    # test à taille réelle et réduit (comme un scan de téléphone)
    ok = []
    for scale in (1.0, 0.35, 0.18):
        small = cv2.resize(arr, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
        data, _, _ = det.detectAndDecode(small)
        if not data and ground == FOREST:  # les lecteurs attendent un fond clair : on inverse pour le test
            data, _, _ = det.detectAndDecode(255 - small)
        ok.append((scale, data == URL))
    print(f"treffel-qr{suffix}.png  ->", ok)
print("URL:", URL)
