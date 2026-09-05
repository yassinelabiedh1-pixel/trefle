# Outil de construction (à relancer après un changement des logos ou de la carte) :
#   python build.py
# - injecte les logos vectoriels (../logos/*.svg) dans index.html sous forme de <symbol>
# - génère css/pattern.css : trèfle en filigrane (deux couleurs) et grand trèfle du héro
# - écrit images/LISEZ-MOI.txt : la liste des noms de photos attendus
import re, os, json, unicodedata, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LOGOS = os.path.join(ROOT, "logos")

def load(name):
    s = open(os.path.join(LOGOS, name), encoding="utf-8").read()
    vb = re.search(r'viewBox="([^"]+)"', s).group(1)
    body = s[s.index(">", s.index("<svg")) + 1:s.rindex("</svg>")]
    body = re.sub(r"<defs>.*?</defs>", "", body, flags=re.S)
    body = re.sub(r'\s*clip-path="[^"]*"', "", body)
    body = re.sub(r"\s+", " ", body).strip()
    return vb, body

symbols = {
    "emblem": "treffel-emblem-vertical.svg",
    "clover": "treffel-clover.svg",
    "wordmark": "treffel-wordmark-horizontal.svg",
}
sym_html = []
paths = {}
for sid, fn in symbols.items():
    vb, body = load(fn)
    paths[sid] = (vb, body)
    sym_html.append(f'<symbol id="{sid}" viewBox="{vb}">{body}</symbol>')

# index.html
idx_path = os.path.join(HERE, "index.html")
idx = open(idx_path, encoding="utf-8").read()
idx = re.sub(r"<!--SYMBOLS-->.*?(?=\s*</defs>)", "<!--SYMBOLS-->\n      " + "\n      ".join(sym_html), idx, flags=re.S)
open(idx_path, "w", encoding="utf-8").write(idx)

# motif trèfle -> data URI
def clover_uri(color):
    vb, body = paths["clover"]
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="{color}">{body}</svg>'
    return "url(\"data:image/svg+xml," + urllib.parse.quote(svg, safe="") + "\")"

def tile_uri(color):
    # une tuile 96x96 avec un petit trèfle centré (motif de fond)
    vb, body = paths["clover"]
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">'
           f'<svg x="57" y="57" width="14" height="14" viewBox="{vb}" fill="{color}">{body}</svg></svg>')
    return "url(\"data:image/svg+xml," + urllib.parse.quote(svg, safe="") + "\")"

css = (
    "/* généré par build.py : ne pas modifier à la main */\n"
    ":root {\n"
    f"  --pattern-cream: {tile_uri('rgba(255,255,255,0.10)')};\n"
    f"  --pattern-forest: {tile_uri('rgba(34,55,44,0.09)')};\n"
    "}\n"
    f"html[data-theme=\"forest\"] {{ --pattern-hero: {clover_uri('#ffffff')}; }}\n"
    f"html[data-theme=\"cream\"] {{ --pattern-hero: {clover_uri('#22372c')}; }}\n"
)
os.makedirs(os.path.join(HERE, "css"), exist_ok=True)
open(os.path.join(HERE, "css", "pattern.css"), "w", encoding="utf-8").write(css)

# liste des photos attendues
def slugify(s):
    s = s.lower().replace("œ", "oe").replace("æ", "ae")
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

import subprocess
js = ("const fs=require('fs');const src=fs.readFileSync(process.argv[1],'utf8');"
      "const MENU=new Function(src+';return MENU;')();"
      "const out=[];for(const c of MENU){const its=c.groups?c.groups.flatMap(g=>g.items):c.items;for(const it of its)out.push(it.name.fr);}"
      "console.log(JSON.stringify(out));")
names = json.loads(subprocess.check_output(["node", "-e", js, os.path.join(HERE, "js", "menu-data.js")]).decode("utf-8"))
os.makedirs(os.path.join(HERE, "images", "produits"), exist_ok=True)
lines = [
    "PHOTOS DES PRODUITS — Treffel Padel Club",
    "",
    "Déposez chaque photo dans images/produits/ avec exactement ce nom",
    "(format .webp de préférence, sinon .jpg / .jpeg / .png).",
    "Format conseillé : 4:3 ou carré, 900 px de large minimum.",
    "",
    "VIDÉO : même nom en .mp4 (muette, courte, moins de 5 Mo) = elle joue en",
    "boucle à la place de la photo. Ex. espresso.mp4 à côté de espresso.webp.",
    "",
]
for n in names:
    lines.append(f"{slugify(n)}.webp    ←  {n}")
open(os.path.join(HERE, "images", "LISEZ-MOI.txt"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
print(f"ok: {len(sym_html)} logos injectés, pattern.css écrit, {len(names)} photos attendues")
