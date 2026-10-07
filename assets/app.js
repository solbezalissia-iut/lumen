/* Lumen — interactions du site */

// ---------- Les 30 teintes Éclat Nu ----------
const NOMS = ["Porcelaine", "Ivoire", "Lin", "Sable", "Miel", "Caramel", "Noisette", "Cannelle", "Moka", "Ébène"];
const SOUS_TONS = {
  C: { nom: "chaud", h: 30, s: 52 },
  N: { nom: "neutre", h: 25, s: 40 },
  F: { nom: "froid", h: 15, s: 34 },
};
const TEINTES = [];
NOMS.forEach((nom, i) => {
  const l = 88 - i * 7.3;
  ["C", "N", "F"].forEach((st) => {
    const t = SOUS_TONS[st];
    const s = t.s + (i > 3 && i < 8 ? 6 : 0);
    TEINTES.push({
      code: `${(i + 1) * 10}${st}`,
      nom,
      profondeur: i,
      sousTon: st,
      couleur: `hsl(${t.h + i * 0.6} ${s}% ${l}%)`,
    });
  });
});
const trouverTeinte = (code) => TEINTES.find((t) => t.code === code);
const libelle = (t) => `${t.code} ${t.nom}`;
const decrireSousTon = (st) => `Sous-ton ${SOUS_TONS[st].nom}`;

// Teinte sélectionnée, partagée par le hero, le nuancier et le panier
let teinteActuelle = "40C";
function choisirTeinte(code) {
  const t = trouverTeinte(code);
  if (!t) return;
  teinteActuelle = code;
  document.documentElement.style.setProperty("--teinte", t.couleur);
  document.querySelectorAll("[data-teinte-nom]").forEach((el) => (el.textContent = libelle(t)));
  document.querySelectorAll("[data-teinte-ton]").forEach((el) => (el.textContent = decrireSousTon(t.sousTon)));
  document.querySelectorAll("[data-code]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.code === code)));
}

// ---------- Bande de teintes (hero) ----------
const bande = document.querySelector(".bande__teintes");
if (bande) {
  TEINTES.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.style.setProperty("--c", t.couleur);
    b.dataset.code = t.code;
    b.setAttribute("aria-label", `Teinte ${libelle(t)}, ${decrireSousTon(t.sousTon).toLowerCase()}`);
    b.title = libelle(t);
    b.addEventListener("click", () => choisirTeinte(t.code));
    bande.appendChild(b);
  });
}

// ---------- Nuancier ----------
const pastilles = document.querySelector(".pastilles");
if (pastilles) {
  TEINTES.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pastille";
    b.dataset.code = t.code;
    b.dataset.ton = t.sousTon;
    b.style.setProperty("--c", t.couleur);
    b.innerHTML = `<span></span>${t.code}`;
    b.setAttribute("aria-label", `${libelle(t)}, ${decrireSousTon(t.sousTon).toLowerCase()}`);
    b.addEventListener("click", () => choisirTeinte(t.code));
    pastilles.appendChild(b);
  });
  document.querySelectorAll("[data-filtre-ton]").forEach((f) => {
    f.addEventListener("click", () => {
      const ton = f.dataset.filtreTon;
      document.querySelectorAll("[data-filtre-ton]").forEach((x) => x.setAttribute("aria-pressed", String(x === f)));
      pastilles.querySelectorAll(".pastille").forEach((p) => (p.hidden = ton !== "tout" && p.dataset.ton !== ton));
    });
  });
}
if (document.querySelector("[data-teinte-nom]")) choisirTeinte("40C");

// ---------- Quiz teinte ----------
const QUESTIONS = [
  {
    q: "Comment décrirais-tu ta carnation ?",
    choix: [
      { t: "Très claire", v: { p: 0 }, c: TEINTES[1].couleur },
      { t: "Claire", v: { p: 2 }, c: TEINTES[7].couleur },
      { t: "Médium", v: { p: 4 }, c: TEINTES[13].couleur },
      { t: "Mate", v: { p: 5 }, c: TEINTES[16].couleur },
      { t: "Foncée", v: { p: 7 }, c: TEINTES[22].couleur },
      { t: "Très foncée", v: { p: 9 }, c: TEINTES[28].couleur },
    ],
  },
  {
    q: "Regarde l'intérieur de ton poignet. Tes veines sont plutôt…",
    choix: [
      { t: "Vertes", v: { st: "C" } },
      { t: "Bleues ou violettes", v: { st: "F" } },
      { t: "Entre les deux, difficile à dire", v: { st: "N" } },
    ],
  },
  {
    q: "Au soleil, ta peau…",
    choix: [
      { t: "Bronze facilement", v: { st: "C" } },
      { t: "Rougit vite", v: { st: "F" } },
      { t: "Rougit un peu, puis bronze", v: { st: "N" } },
    ],
  },
  {
    q: "Quels bijoux te mettent le plus en valeur ?",
    choix: [
      { t: "Les bijoux dorés", v: { st: "C" } },
      { t: "Les bijoux argentés", v: { st: "F" } },
      { t: "Les deux me vont", v: { st: "N" } },
    ],
  },
  {
    q: "Quel rendu tu recherches ?",
    choix: [
      { t: "Très naturel, presque invisible", v: { r: "leger" } },
      { t: "Naturel, mais qui unifie bien", v: { r: "moyen" } },
      { t: "Un peu plus couvrant", v: { r: "couvrant" } },
    ],
  },
];
const CONSEILS = {
  leger: "Mélange une goutte d'Éclat Nu à ta crème hydratante : tu obtiens un voile ultra léger.",
  moyen: "Une goutte suffit pour tout le visage. Étire-la du centre vers l'extérieur, du bout des doigts.",
  couvrant: "Applique une première goutte sur tout le visage, puis ajoute une fine couche seulement là où tu en as besoin.",
};

const quiz = document.querySelector("[data-quiz]");
if (quiz) {
  const zone = quiz.querySelector(".quiz__zone");
  const barre = quiz.querySelector(".quiz__progression i");
  let etape = 0;
  let reponses = [];

  const afficherQuestion = () => {
    const Q = QUESTIONS[etape];
    barre.style.width = `${(etape / QUESTIONS.length) * 100}%`;
    zone.innerHTML = `
      <p class="quiz__etape">Question ${etape + 1} sur ${QUESTIONS.length}</p>
      <p class="quiz__question" tabindex="-1">${Q.q}</p>
      <div class="quiz__choix">
        ${Q.choix.map((c, i) => `<button type="button" data-i="${i}">${c.c ? `<i style="--c:${c.c}"></i>` : ""}${c.t}</button>`).join("")}
      </div>
      ${etape > 0 ? `<button type="button" class="quiz__retour">Question précédente</button>` : ""}`;
    zone.querySelectorAll(".quiz__choix button").forEach((b) =>
      b.addEventListener("click", () => {
        reponses[etape] = Q.choix[+b.dataset.i].v;
        etape++;
        etape < QUESTIONS.length ? afficherQuestion() : afficherResultat();
      })
    );
    const retour = zone.querySelector(".quiz__retour");
    if (retour) retour.addEventListener("click", () => { etape--; afficherQuestion(); });
    zone.querySelector(".quiz__question").focus({ preventScroll: true });
  };

  const afficherResultat = () => {
    barre.style.width = "100%";
    const votes = { C: 0, N: 0, F: 0 };
    reponses.forEach((r) => r.st && votes[r.st]++);
    let st = "N";
    if (votes.C > votes.F && votes.C >= votes.N) st = "C";
    else if (votes.F > votes.C && votes.F >= votes.N) st = "F";
    const p = reponses[0].p;
    const t = TEINTES.find((x) => x.profondeur === p && x.sousTon === st);
    const conseil = CONSEILS[reponses[4].r];
    zone.innerHTML = `
      <div class="resultat">
        <div class="resultat__teinte" style="--c:${t.couleur}"></div>
        <div>
          <p class="quiz__etape">Ta teinte recommandée</p>
          <p class="quiz__question" tabindex="-1">${libelle(t)}, sous-ton ${SOUS_TONS[st].nom}</p>
          <p>${conseil} Si la teinte ne te convient pas, le retour est gratuit.</p>
          <p style="margin:0">−15 % sur ta première commande :</p>
          <div class="code-promo"><b>ECLAT15</b><button type="button" data-copier="ECLAT15">Copier</button></div>
          <div class="hero__boutons">
            <a class="btn" href="#produits" data-voir-teinte="${t.code}">Voir ma teinte</a>
            <button type="button" class="btn btn--clair" data-recommencer>Refaire le quiz</button>
          </div>
        </div>
      </div>`;
    zone.querySelector("[data-recommencer]").addEventListener("click", () => { etape = 0; reponses = []; afficherQuestion(); });
    zone.querySelector("[data-voir-teinte]").addEventListener("click", (e) => {
      e.preventDefault();
      choisirTeinte(t.code);
      document.querySelector("#nuancier").scrollIntoView({ behavior: "smooth" });
    });
    activerCopie(zone);
    zone.querySelector(".quiz__question").focus({ preventScroll: true });
  };

  quiz.querySelector("[data-demarrer]").addEventListener("click", afficherQuestion);
}

// ---------- Copier le code promo ----------
function activerCopie(racine = document) {
  racine.querySelectorAll("[data-copier]").forEach((b) =>
    b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(b.dataset.copier); } catch (e) { /* presse-papiers indisponible */ }
      b.textContent = "Copié";
      afficherToast(`Code ${b.dataset.copier} copié`);
    })
  );
}
activerCopie();

// ---------- Produits ----------
const FORMES = {
  teint: (c) => `<svg viewBox="0 0 60 100"><rect x="22" y="4" width="16" height="22" rx="7" fill="#fff" stroke="#d6d2cd"/><rect x="18" y="24" width="24" height="12" rx="2" fill="#c8c8c8"/><rect x="8" y="36" width="44" height="60" rx="6" fill="${c}"/></svg>`,
  poudre: (c) => `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="44" ry="20" fill="#d9d4ce"/><ellipse cx="50" cy="56" rx="44" ry="20" fill="${c}"/><ellipse cx="50" cy="56" rx="30" ry="12" fill="#fff" opacity=".25"/></svg>`,
  yeux: (c) => `<svg viewBox="0 0 40 100"><rect x="12" y="4" width="16" height="50" rx="5" fill="${c}"/><rect x="12" y="52" width="16" height="44" rx="5" fill="#3a2922"/></svg>`,
  palette: (c) => `<svg viewBox="0 0 100 80"><rect x="4" y="8" width="92" height="64" rx="8" fill="#3a2922"/>${[0,1,2,3].map((i)=>`<circle cx="${20+i*20}" cy="40" r="8" fill="${c}" opacity="${0.45+i*0.18}"/>`).join("")}</svg>`,
  levres: (c) => `<svg viewBox="0 0 40 100"><path d="M13 30 L13 12 Q20 2 27 10 L27 30 Z" fill="${c}"/><rect x="10" y="30" width="20" height="14" rx="2" fill="#c8c8c8"/><rect x="9" y="44" width="22" height="52" rx="4" fill="#3a2922"/></svg>`,
  sourcils: (c) => `<svg viewBox="0 0 30 100"><rect x="10" y="4" width="10" height="56" rx="4" fill="${c}"/><rect x="10" y="58" width="10" height="38" rx="4" fill="#c8c8c8"/></svg>`,
  eponge: (c) => `<svg viewBox="0 0 80 100"><path d="M40 6 C60 30 72 52 72 66 A32 32 0 0 1 8 66 C8 52 20 30 40 6 Z" fill="${c}"/></svg>`,
  pinceau: (c) => `<svg viewBox="0 0 40 100"><path d="M10 30 Q10 4 20 4 Q30 4 30 30 Z" fill="${c}"/><rect x="12" y="30" width="16" height="16" fill="#c8c8c8"/><rect x="15" y="46" width="10" height="50" rx="4" fill="#3a2922"/></svg>`,
};
const PRODUITS = [
  { nom: "Éclat Nu", type: "Fond de teint, 30 ml", gamme: "teint", prix: 19.9, star: true },
  { nom: "Voile Nu", type: "Correcteur", gamme: "teint", prix: 14.9, forme: "teint", c: "#d8b49a" },
  { nom: "Poudre Lumière", type: "Poudre fixante", gamme: "teint", prix: 16.9, forme: "poudre", c: "#e8d3c0" },
  { nom: "Pétale", type: "Blush", gamme: "teint", prix: 15.9, forme: "poudre", c: "#e2a59a" },
  { nom: "Halo", type: "Enlumineur", gamme: "teint", prix: 17.9, forme: "poudre", c: "#f0dcc4" },
  { nom: "Cils Nus", type: "Mascara", gamme: "yeux", prix: 13.9, forme: "yeux", c: "#c9a083" },
  { nom: "Terre Douce", type: "Palette de fards", gamme: "yeux", prix: 29.9, forme: "palette", c: "#b57e5f" },
  { nom: "Trait Fin", type: "Eye-liner", gamme: "yeux", prix: 12.9, forme: "sourcils", c: "#3a2922" },
  { nom: "Baume Nu", type: "Baume teinté", gamme: "levres", prix: 11.9, forme: "levres", c: "#c98478" },
  { nom: "Velours", type: "Rouge à lèvres", gamme: "levres", prix: 15.9, forme: "levres", c: "#9e4a43" },
  { nom: "Miroir", type: "Gloss", gamme: "levres", prix: 12.9, forme: "levres", c: "#e7b3a8" },
  { nom: "Brow Nu", type: "Gel teinté sourcils", gamme: "sourcils", prix: 11.9, forme: "sourcils", c: "#7a5644" },
  { nom: "Éponge Fondante", type: "Éponge de maquillage", gamme: "accessoires", prix: 7.9, forme: "eponge", c: "#ebc9c0" },
  { nom: "Pinceau Teint", type: "Pinceau", gamme: "accessoires", prix: 14.9, forme: "pinceau", c: "#e8d3c0" },
];

// Photo produit : cherche <nomcolle>.png dans plusieurs dossiers, sinon garde l'icône dessinée
const slug = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
const DOSSIERS_PHOTOS = ["assets/img/", "assets/img/produits/", "assets/produits/", "assets/", "produits/", "img/", ""];
window.essaiPhoto = (img) => {
  const i = Number(img.dataset.essai || 0) + 1;
  if (i < DOSSIERS_PHOTOS.length) {
    img.dataset.essai = i;
    img.src = DOSSIERS_PHOTOS[i] + img.dataset.fichier;
  } else {
    img.remove();
  }
};
const NOMS_GAMMES = { teint: "Teint", yeux: "Yeux", levres: "Lèvres", sourcils: "Sourcils", accessoires: "Accessoires" };
const euros = (n) => n.toFixed(2).replace(".", ",") + " €";

const grille = document.querySelector(".produits");
if (grille) {
  const limite = grille.dataset.limite ? +grille.dataset.limite : PRODUITS.length;
  PRODUITS.slice(0, limite).forEach((p) => {
    const art = document.createElement("article");
    art.className = "produit" + (p.star ? " produit--star" : "");
    art.dataset.gamme = p.gamme;
    const visuel = p.star
      ? `<div class="flacon" role="img" aria-label="Flacon du fond de teint Éclat Nu"><img src="assets/img/flacon.png" alt=""><span class="flacon__liquide"></span><span class="flacon__ombres"></span></div><span class="produit__badge">Best-seller</span>`
      : `<img class="produit__photo" src="${DOSSIERS_PHOTOS[0]}${slug(p.nom)}.png" data-fichier="${slug(p.nom)}.png" alt="${p.nom}, ${p.type.toLowerCase()}" onerror="essaiPhoto(this)">${FORMES[p.forme](p.c)}`;
    art.innerHTML = `
      <div class="produit__visuel">${visuel}</div>
      <h3>${p.nom}</h3>
      <span class="produit__gamme">${p.type}</span>
      <div class="produit__bas"><strong>${euros(p.prix)}</strong><button type="button" class="ajouter">Ajouter</button></div>`;
    art.querySelector(".ajouter").addEventListener("click", (e) => ajouterAuPanier(p, e.currentTarget));
    grille.appendChild(art);
  });
  document.querySelectorAll("[data-gamme]").forEach((f) => {
    if (f.tagName !== "BUTTON") return;
    f.addEventListener("click", () => {
      const g = f.dataset.gamme;
      document.querySelectorAll("button[data-gamme]").forEach((x) => x.setAttribute("aria-pressed", String(x === f)));
      grille.querySelectorAll(".produit").forEach((p) => (p.hidden = g !== "tout" && p.dataset.gamme !== g));
    });
  });
}

// ---------- Panier (démo : on voit tout, mais aucun paiement possible) ----------
const CODES_PROMO = { ECLAT15: 0.15 };
const SEUIL_LIVRAISON = 25;
const PRIX_LIVRAISON = 3.9;
let panier = [];
let codeApplique = "";
try {
  const sauve = JSON.parse(localStorage.getItem("lumen-panier") || "null");
  if (sauve) { panier = sauve.panier || []; codeApplique = sauve.code || ""; }
} catch (e) { /* stockage indisponible : le panier reste en mémoire */ }
const sauverPanier = () => {
  try { localStorage.setItem("lumen-panier", JSON.stringify({ panier, code: codeApplique })); } catch (e) { /* rien */ }
};

function ajouterAuPanier(p, bouton) {
  const teinte = p.star ? teinteActuelle : null;
  const id = p.nom + (teinte ? "-" + teinte : "");
  const ligne = panier.find((l) => l.id === id);
  if (ligne) ligne.qte++;
  else panier.push({ id, nom: p.nom, type: p.type, prix: p.prix, teinte, star: !!p.star, c: p.c || "", qte: 1 });
  sauverPanier();
  majPanier();
  if (bouton) {
    const texte = bouton.textContent;
    bouton.dataset.ajoute = "true";
    bouton.textContent = "Ajouté";
    setTimeout(() => { bouton.dataset.ajoute = "false"; bouton.textContent = texte; }, 1400);
  }
  const t = teinte ? trouverTeinte(teinte) : null;
  afficherToast(`${p.nom}${t ? " " + libelle(t) : ""} ajouté au panier`);
}

// Tiroir du panier, ajouté sur toutes les pages
document.body.insertAdjacentHTML("beforeend", `
  <div class="tiroir" hidden>
    <div class="tiroir__fond" data-fermer-panier></div>
    <aside class="tiroir__panneau" role="dialog" aria-modal="true" aria-labelledby="titre-panier">
      <div class="tiroir__tete">
        <h2 id="titre-panier">Ton panier</h2>
        <button type="button" class="tiroir__fermer" data-fermer-panier aria-label="Fermer le panier">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <div class="tiroir__corps"></div>
    </aside>
  </div>`);
const tiroir = document.querySelector(".tiroir");
const corpsPanier = tiroir.querySelector(".tiroir__corps");
let dernierFocus = null;

function ouvrirPanier() {
  dernierFocus = document.activeElement;
  majPanier();
  tiroir.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => tiroir.dataset.ouvert = "true");
  tiroir.querySelector(".tiroir__fermer").focus();
}
function fermerPanier() {
  tiroir.dataset.ouvert = "false";
  document.body.style.overflow = "";
  setTimeout(() => (tiroir.hidden = true), 250);
  if (dernierFocus) dernierFocus.focus();
}
tiroir.querySelectorAll("[data-fermer-panier]").forEach((b) => b.addEventListener("click", fermerPanier));
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !tiroir.hidden) fermerPanier(); });
document.querySelectorAll(".panier").forEach((b) => b.addEventListener("click", ouvrirPanier));

function vignette(l) {
  if (l.star) return `<div class="ligne__photo"><img src="assets/img/flacon.png" alt=""></div>`;
  const f = slug(l.nom) + ".png";
  return `<div class="ligne__photo" style="--c:${l.c}"><img src="${DOSSIERS_PHOTOS[0]}${f}" data-fichier="${f}" alt="" onerror="essaiPhoto(this)"></div>`;
}

function calculer() {
  const sousTotal = panier.reduce((s, l) => s + l.prix * l.qte, 0);
  const taux = CODES_PROMO[codeApplique] || 0;
  const reduction = Math.round(sousTotal * taux * 100) / 100;
  const livraison = sousTotal === 0 || sousTotal - reduction >= SEUIL_LIVRAISON ? 0 : PRIX_LIVRAISON;
  return { sousTotal, reduction, livraison, total: sousTotal - reduction + livraison };
}

function majPanier() {
  const nb = panier.reduce((s, l) => s + l.qte, 0);
  document.querySelectorAll(".panier__nb").forEach((el) => {
    el.textContent = nb;
    el.dataset.vide = String(nb === 0);
  });
  document.querySelectorAll(".panier").forEach((b) => b.setAttribute("aria-label", `Panier, ${nb} article${nb > 1 ? "s" : ""}`));
  if (!corpsPanier) return;

  if (!panier.length) {
    corpsPanier.innerHTML = `
      <div class="panier-vide">
        <p>Ton panier est vide.</p>
        <a class="btn" href="index.html#produits" data-fermer-lien>Découvrir les produits</a>
      </div>`;
    corpsPanier.querySelector("[data-fermer-lien]").addEventListener("click", fermerPanier);
    return;
  }

  const { sousTotal, reduction, livraison, total } = calculer();
  const resteLivraison = SEUIL_LIVRAISON - (sousTotal - reduction);
  corpsPanier.innerHTML = `
    <ul class="lignes">
      ${panier.map((l, i) => {
        const t = l.teinte ? trouverTeinte(l.teinte) : null;
        return `<li class="ligne">
          ${vignette(l)}
          <div class="ligne__infos">
            <b>${l.nom}</b>
            <span>${l.type}${t ? `, teinte <i class="ligne__teinte" style="--c:${t.couleur}"></i>${libelle(t)}` : ""}</span>
            <div class="quantite" role="group" aria-label="Quantité de ${l.nom}">
              <button type="button" data-moins="${i}" aria-label="Retirer un ${l.nom}">−</button>
              <output aria-live="polite">${l.qte}</output>
              <button type="button" data-plus="${i}" aria-label="Ajouter un ${l.nom}">+</button>
            </div>
          </div>
          <div class="ligne__droite">
            <b>${euros(l.prix * l.qte)}</b>
            <button type="button" class="ligne__retirer" data-retirer="${i}">Retirer</button>
          </div>
        </li>`;
      }).join("")}
    </ul>
    <div class="recap">
      <p class="livraison-info">${resteLivraison > 0 ? `Plus que <b>${euros(resteLivraison)}</b> pour la livraison offerte.` : "Livraison offerte."}</p>
      <form class="promo" novalidate>
        <label for="code-promo">Code promo</label>
        <div><input id="code-promo" name="code" autocomplete="off" placeholder="ECLAT15" value="${codeApplique}"><button type="submit" class="btn btn--clair">Appliquer</button></div>
        <p class="promo__message" aria-live="polite">${codeApplique ? `Code ${codeApplique} appliqué : −${Math.round(CODES_PROMO[codeApplique] * 100)} %` : ""}</p>
      </form>
      <dl>
        <div><dt>Sous-total</dt><dd>${euros(sousTotal)}</dd></div>
        ${reduction ? `<div><dt>Réduction ${codeApplique}</dt><dd>−${euros(reduction)}</dd></div>` : ""}
        <div><dt>Livraison</dt><dd>${livraison ? euros(livraison) : "Offerte"}</dd></div>
        <div class="recap__total"><dt>Total</dt><dd>${euros(total)}</dd></div>
      </dl>
      <button type="button" class="btn recap__commander" data-commander>Commander</button>
      <p class="recap__note">Site de démonstration (projet étudiant) : aucun paiement n'est possible.</p>
    </div>`;

  corpsPanier.querySelectorAll("[data-plus]").forEach((b) => b.addEventListener("click", () => { panier[+b.dataset.plus].qte++; sauverPanier(); majPanier(); }));
  corpsPanier.querySelectorAll("[data-moins]").forEach((b) => b.addEventListener("click", () => {
    const l = panier[+b.dataset.moins];
    l.qte--;
    if (l.qte <= 0) panier.splice(+b.dataset.moins, 1);
    sauverPanier(); majPanier();
  }));
  corpsPanier.querySelectorAll("[data-retirer]").forEach((b) => b.addEventListener("click", () => {
    const l = panier.splice(+b.dataset.retirer, 1)[0];
    sauverPanier(); majPanier();
    afficherToast(`${l.nom} retiré du panier`);
  }));
  const form = corpsPanier.querySelector(".promo");
  const champ = form.querySelector("input");
  const message = form.querySelector(".promo__message");
  champ.addEventListener("input", () => { message.textContent = ""; message.dataset.erreur = "false"; });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = champ.value.trim().toUpperCase();
    if (!code) { message.textContent = "Saisis un code promo."; message.dataset.erreur = "true"; return; }
    if (!CODES_PROMO[code]) { message.textContent = `Le code ${code} n'existe pas. Essaie ECLAT15.`; message.dataset.erreur = "true"; return; }
    codeApplique = code; sauverPanier(); majPanier();
    corpsPanier.querySelector("#code-promo").focus();
  });
  corpsPanier.querySelector("[data-commander]").addEventListener("click", () => {
    corpsPanier.innerHTML = `
      <div class="panier-vide">
        <h3>Commande non passée</h3>
        <p>Lumen est une marque fictive créée pour un projet étudiant : ce site est une démonstration et aucun paiement n'est possible.</p>
        <p>Total de ta sélection : <b>${euros(total)}</b></p>
        <button type="button" class="btn btn--clair" data-retour>Revenir au panier</button>
      </div>`;
    corpsPanier.querySelector("[data-retour]").addEventListener("click", majPanier);
  });
}

document.querySelectorAll("[data-ajouter-star]").forEach((b) =>
  b.addEventListener("click", () => ajouterAuPanier(PRODUITS[0], null))
);
majPanier();

// ---------- Toast ----------
let minuteur;
function afficherToast(texte) {
  const t = document.querySelector(".toast");
  if (!t) return;
  t.textContent = texte;
  t.dataset.visible = "true";
  clearTimeout(minuteur);
  minuteur = setTimeout(() => (t.dataset.visible = "false"), 2400);
}

// ---------- Menu mobile ----------
const burger = document.querySelector(".burger");
if (burger) {
  const liens = document.querySelector(".nav__liens");
  burger.addEventListener("click", () => {
    const ouvert = liens.dataset.ouvert === "true";
    liens.dataset.ouvert = String(!ouvert);
    burger.setAttribute("aria-expanded", String(!ouvert));
  });
  liens.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    liens.dataset.ouvert = "false";
    burger.setAttribute("aria-expanded", "false");
  }));
}

// ---------- Article : barre de lecture ----------
const barreLecture = document.querySelector(".progression-lecture");
if (barreLecture) {
  const maj = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    barreLecture.style.width = `${max > 0 ? (h.scrollTop / max) * 100 : 0}%`;
  };
  document.addEventListener("scroll", maj, { passive: true });
  maj();
}

// ---------- Article : test du poignet ----------
const test = document.querySelector("[data-test-poignet]");
if (test) {
  const res = test.querySelector(".test-poignet__resultat");
  test.querySelectorAll("button[data-st]").forEach((b) =>
    b.addEventListener("click", () => {
      test.querySelectorAll("button[data-st]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      const st = b.dataset.st;
      const exemples = TEINTES.filter((t) => t.sousTon === st && [1, 4, 7].includes(t.profondeur));
      res.innerHTML = `<div>${exemples.map((t) => `<i style="--c:${t.couleur}" title="${libelle(t)}"></i>`).join("")}</div>
        <span>Tu as un <b>sous-ton ${SOUS_TONS[st].nom}</b> : regarde les teintes finissant par <b>${st}</b>.</span>`;
    })
  );
}
