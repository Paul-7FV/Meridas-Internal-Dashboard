# Paul — Portfolio

Portfolio créatif, 100 % statique (HTML / CSS / JS), hébergé gratuitement sur **GitHub Pages**.

**Au programme :** shader WebGL qui tourbillonne sous le curseur (clic = nouvelle palette), titre « cinétique » dont la graisse réagit à la souris, préloader, smooth scroll, marquee qui suit la vitesse du scroll, galerie de projets horizontale avec visuels génératifs animés, cartes empilées, playground de particules, curseur custom et boutons magnétiques.

## Mettre en ligne (gratuit)

1. Fusionner cette branche dans `main`.
2. Sur GitHub : **Settings → Pages → Build and deployment**
   - Source : `Deploy from a branch`
   - Branch : `main` / `/ (root)` → **Save**
3. Après 1 à 2 minutes, le site est en ligne sur `https://paul-7fv.github.io/<nom-du-repo>/`.

> Astuce : renomme le repo en `paul-7fv.github.io` pour avoir l'adresse courte `https://paul-7fv.github.io`.

## Personnaliser

| Quoi | Où |
| --- | --- |
| E-mail + projets (nom, texte, tags, couleurs, lien, visuel) | objet `CONFIG` en haut de `assets/js/main.js` |
| Textes (hero, manifeste, expertises, contact) | `index.html` |
| Couleurs & typos | variables `:root` dans `assets/css/style.css` |
| Palettes du fond animé | tableau `palettes` dans `assets/js/shader.js` |
| Liens réseaux sociaux | footer dans `index.html` |

Visuels génératifs disponibles pour `art` : `bars`, `rings`, `grid`, `waves`, `blobs`.

## Tester en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Stack

HTML/CSS/JS vanilla · WebGL natif · [GSAP](https://gsap.com) + ScrollTrigger · [Lenis](https://lenis.darkroom.engineering) (librairies embarquées dans `assets/vendor/`, aucune dépendance externe hormis Google Fonts). Respecte `prefers-reduced-motion`.
