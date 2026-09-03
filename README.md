# Treffel Padel Club — La carte

Site de la carte du club : `site/`. Publié sur GitHub Pages (branche `gh-pages`) :
https://yassinelabiedh1-pixel.github.io/trefle/

## Mettre la carte à jour

1. Modifier `site/js/menu-data.js` (noms, descriptions, prix) ou déposer des photos dans
   `site/images/produits/` (noms de fichiers : `site/images/LISEZ-MOI.txt`).
2. Enregistrer, puis double-cliquer sur `publier.cmd` (ou demander à Claude de publier).

Le site est en ligne environ une minute plus tard. Le QR code (dossier `qr/`) ne change jamais.

## Netlify (optionnel)

Sur app.netlify.com : « Add new site » → « Import an existing project » → choisir ce dépôt
GitHub. Base directory : `site`. Build command : vide. Publish directory : `site`.
