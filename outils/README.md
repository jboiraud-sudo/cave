# Outils de travail de l'app « Ma cave »

Ces fichiers ne sont pas utilisés par l'app en ligne : ils servent à la faire évoluer.
Aucune donnée personnelle ici (la copie de la cave et le script Apps Script sont dans le Google Drive du propriétaire).

## Dessins des régions (`visuels/`)
- `dessins.js` : les 14 dessins au trait (13 régions + générique), en SVG, repère 320 × 180.
- `integrer.js` : insère les dessins dans `index.html`, entre les marqueurs `REGIONS:START` / `REGIONS:END`.

```bash
node outils/visuels/integrer.js
```

La correspondance région → dessin est dans `index.html` (constante `REGIONS`) ; toute région inconnue prend le dessin générique.

## Aperçu (`apercu/`)
`build.js` fabrique une version de démonstration de l'app (`ma-cave-apercu.html`) : même code, mais un faux serveur
travaille sur une copie de la cave (`snapshot.json`, à placer à côté du script, non versionnée). Rien n'est écrit dans la feuille.

```bash
node outils/apercu/build.js
```
