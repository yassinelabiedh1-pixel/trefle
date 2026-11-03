@echo off
rem Met la carte en ligne : Cloudflare (adresse du QR code) + copie de secours sur GitHub
cd /d "%~dp0"
git add -A
git commit -m "Mise a jour de la carte"
git push origin main
echo.
echo === Cloudflare Pages : https://treffel.pages.dev ===
call wrangler pages deploy site --project-name treffel --branch main --commit-dirty=true
echo.
echo === Copie de secours GitHub Pages ===
git push origin --delete gh-pages >nul 2>&1
git subtree push --prefix site origin gh-pages
echo.
echo Carte publiee : https://treffel.pages.dev
pause
