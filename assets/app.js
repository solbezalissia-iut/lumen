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

// Teinte sélectionnée, partagée par le hero et le nuancier
function choisirTeinte(code) {
  const t = trouverTeinte(code);
  if (!t) return;
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
      ? `<img src="assets/img/flacon.png" alt="Flacon du fond de teint Éclat Nu"><span class="produit__badge">Best-seller</span>`
      : FORMES[p.forme](p.c);
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

// ---------- Panier (démo, sans paiement) ----------
let nbPanier = 0;
function ajouterAuPanier(p, bouton) {
  nbPanier++;
  document.querySelectorAll(".panier__nb").forEach((el) => {
    el.textContent = nbPanier;
    el.dataset.vide = "false";
  });
  if (bouton) {
    bouton.dataset.ajoute = "true";
    bouton.textContent = "Ajouté";
  }
  afficherToast(`${p.nom} ajouté au panier`);
}
document.querySelectorAll("[data-ajouter-star]").forEach((b) =>
  b.addEventListener("click", () => ajouterAuPanier(PRODUITS[0], null))
);
document.querySelectorAll(".panier").forEach((b) =>
  b.addEventListener("click", () =>
    afficherToast(nbPanier ? `${nbPanier} article${nbPanier > 1 ? "s" : ""} dans ton panier` : "Ton panier est vide : découvre nos produits")
  )
);

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
