# QR code Treffel Coffee House, style simple : modules arrondis reliés, yeux carrés.
#   python qr/make_qr_simple.py
# Couleurs du brand book : bordeaux #471224 / crème #fff9f2.
# Sorties : qr/treffel-qr-simple-{bordeaux,beige}.png (code seul)
#           qr/treffel-qr-carte-simple-{bordeaux,beige}.png (carte avec le logo)
import os, sys
import qrcode
from qrcode.constants import ERROR_CORRECT_H
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import make_qr_art as art          # même carte (logo + COFFEE HOUSE + ligne + invitation)

URL = open(os.path.join(HERE, "URL.txt"), encoding="utf-8").read().strip()


def code(ink, ground):
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, box_size=art.MOD, border=art.QUIET)
    qr.add_data(URL)
    qr.make(fit=True)
    return qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(radius_ratio=1),
        color_mask=SolidFillColorMask(back_color=ground, front_color=ink),
    ).convert("RGB")


if __name__ == "__main__":
    for ink, ground, name in [(art.CREAM, art.BORDEAUX, "bordeaux"), (art.BORDEAUX, art.CREAM, "beige")]:
        im = code(ink, ground)
        im.save(os.path.join(HERE, f"treffel-qr-simple-{name}.png"))
        art.card(im, ink, ground, f"-simple-{name}")
        print(f"treffel-qr-simple-{name}.png  {im.width}px")
    print("URL:", URL)
