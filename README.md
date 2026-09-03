# Treffel Padel Club — La carte

Site de la carte du club : `site/`. Publié automatiquement sur GitHub Pages à chaque
mise à jour de la branche `main`.

## Mettre la carte à jour

1. Modifier `site/js/menu-data.js` (noms, descriptions, prix) ou déposer des photos dans
   `site/images/produits/` (noms de fichiers : `site/images/LISEZ-MOI.txt`).
2. Enregistrer, puis :

```bash
git add -A
git commit -m "Mise à jour de la carte"
git push
```

Le site est en ligne environ une minute plus tard. Le QR code ne change jamais.

## Netlify (optionnel)

Sur app.netlify.com : « Add new site » → « Import an existing project » → choisir ce dépôt
GitHub. Base directory : `site`. Build command : vide. Publish directory : `site`.
