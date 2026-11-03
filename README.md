# Treffel Coffee House — La carte

Site de la carte du club : `site/`.

- **Adresse officielle (QR code)** : https://treffel.pages.dev — Cloudflare Pages, projet `treffel`, bande passante illimitée.
- **Copie de secours** : https://yassinelabiedh1-pixel.github.io/trefle/ — GitHub Pages, branche `gh-pages`.

## Mettre la carte à jour

1. Modifier `site/js/menu-data.js` (noms, descriptions, prix) ou déposer des photos dans
   `site/images/produits/` (noms de fichiers : `site/images/LISEZ-MOI.txt`).
2. Enregistrer, puis double-cliquer sur `publier.cmd` (ou demander à Claude de publier).

Le site est en ligne environ une minute plus tard. Le QR code (dossier `qr/`) ne change jamais.

## Cloudflare

Publication avec Wrangler (`npm install -g wrangler`, puis `wrangler login` une fois) :

```bash
wrangler pages deploy site --project-name treffel --branch main
```

`publier.cmd` fait tout : sauvegarde Git, Cloudflare, puis la copie GitHub.
