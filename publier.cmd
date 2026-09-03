@echo off
rem Met la carte en ligne : enregistre les changements et publie le dossier site/
cd /d "%~dp0"
git add -A
git commit -m "Mise a jour de la carte" 
git push origin main
git push origin --delete gh-pages >nul 2>&1
git subtree push --prefix site origin gh-pages
echo.
echo Carte publiee. En ligne dans une minute : https://yassinelabiedh1-pixel.github.io/treffel-menu/
pause
