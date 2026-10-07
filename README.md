# Lumen · Site de la marque

Site vitrine de **Lumen**, marque de maquillage naturel et inclusif (projet étudiant BUT TC, marque et produits fictifs), qui met en avant le fond de teint **Éclat Nu**.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : Éclat Nu, nuancier des 30 teintes, quiz teinte, application, toute la gamme, aperçu du blog |
| `blog.html` | Page blog : article à la une et prochains articles |
| `article-eclat-nu.html` | Article « Fond de teint Éclat Nu : un teint naturel en 2 minutes… » |
| `assets/style.css` | Styles |
| `assets/app.js` | Interactions (teintes, quiz, filtres, panier de démonstration, test du poignet) |
| `assets/img/` | Images : flacon (`flacon.png`), reflets du liquide (`flacon-ombres.png`), visuels tirés de la pub |

## Mettre le site en ligne avec GitHub Pages

1. Crée un nouveau dépôt sur GitHub (par exemple `lumen`), en **public**.
2. Clique sur **Add file → Upload files** et glisse **tout le contenu** du dossier (les 3 fichiers `.html`, le dossier `assets` et ce `README.md`). Valide avec **Commit changes**.
3. Va dans **Settings → Pages**. Dans « Branch », choisis `main` et le dossier `/ (root)`, puis **Save**.
4. Attends 1 à 2 minutes : ton site est en ligne à l'adresse `https://ton-pseudo.github.io/lumen/`.

## À personnaliser

- **Logo** : dépose ton fichier `logo.png` dans `assets/img/`. Il s'affiche automatiquement en haut de toutes les pages et comme icône d'onglet. Pour le pied de page (fond foncé), ajoute une version claire nommée `logo-blanc.png`. Tant qu'un fichier manque, le nom « Lumen » s'affiche à sa place.
  - Format conseillé : PNG à fond transparent, environ 400 × 100 px pour un logo horizontal.
- **Flacon** : le liquide prend automatiquement la couleur de la teinte choisie dans le nuancier ou la bande de teintes. Si tu changes `flacon.png`, demande à refaire les calques de couleur.

- **Photos des produits** : crée le dossier `assets/img/produits/` et dépose une image par produit, en `.png` (fond transparent) ou `.jpg`, avec exactement ces noms :
  `voile-nu`, `poudre-lumiere`, `petale`, `halo`, `cils-nus`, `terre-douce`, `trait-fin`, `baume-nu`, `velours`, `miroir`, `brow-nu`, `eponge-fondante`, `pinceau-teint`
  (par exemple `assets/img/produits/velours.png`). Tant qu'une photo manque, l'icône dessinée s'affiche à sa place. Format conseillé : carré, 800 × 800 px.
- Liens réseaux sociaux (TikTok, Instagram, YouTube) : dans le pied de page de chaque page HTML, remplace `href="#"` par tes vrais liens.
- Produits et prix : liste `PRODUITS` dans `assets/app.js`.
- Noms des teintes : liste `NOMS` dans `assets/app.js`.
