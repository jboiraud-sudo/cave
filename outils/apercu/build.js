// Génère l'aperçu (artifact) à partir de l'app publiée : même code, faux serveur sur une copie des données.
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, '../../index.html');
const snap = JSON.parse(fs.readFileSync(path.join(__dirname, 'snapshot.json'), 'utf8'));
let src = fs.readFileSync(SRC, 'utf8');
// Quelques dégustations d'exemple, seulement dans l'aperçu, pour voir le classement de l'onglet Bues
const EX = ' (exemple de l\u2019aperçu)';
const EXEMPLES = [
  ['2026-10-18', 'Rouge', 'Vallée du Rhône Nord', 'Domaine Cuilleron', 'Côte-Rôtie', 'Madinière', '2017', 17, 'À point', 'Oui', 'Superbe, tout en finesse' + EX],
  ['2026-09-27', 'Blanc', 'Bourgogne', 'Domaine André Bonhomme', 'Viré-Clessé', 'Les Prêtres de Quintaine', '2022', 13.5, 'Trop jeune', 'Non', 'Encore fermé, à attendre' + EX],
  ['2026-08-15', 'Rouge', 'Bordeaux', 'Château Sociando-Mallet', 'Haut-Médoc', '', '2014', 15, 'À point', 'Oui', 'Belle maturité' + EX],
  ['2026-07-02', 'Rouge', 'Vallée du Rhône Sud', 'Domaine des Tours', 'Vin de Pays de Vaucluse', 'Merlot-Syrah', '2012', 17.5, 'À point', 'Oui', 'Toujours impressionnant' + EX],
  ['2026-05-21', 'Rouge', 'Péloponnèse (Grèce)', 'Cavino', 'Nemea', 'Réserve', '2019', 12, 'Sur le déclin', 'Non', 'Un peu fatigué' + EX],
  ['2026-06-10', 'Blanc', 'Loire', 'La Taille aux Loups', 'Vin de France', 'Bretonnière', '2024', '', '', '', 'Bu à l\u2019apéritif' + EX]
];
const pick = (re) => { const m = src.match(re); if (!m) throw new Error('motif introuvable : ' + re); return m[1]; };
let style = pick(/<style>([\s\S]*?)<\/style>/);
let body = pick(/<body>([\s\S]*?)<\/body>/);
// L'aperçu embarque la bibliothèque de recadrage (l'app, elle, la charge depuis vendor/ quand on en a besoin)
const cropJs = fs.readFileSync(path.join(__dirname, '../../vendor/cropper.min.js'), 'utf8');
const fontLinks = (src.match(/<link rel="(?:preconnect|stylesheet)" href="https:\/\/fonts\.[^>]*>/g) || []).join('\n');

// Thème : respecter le choix clair/sombre du viewer
const dark = style.match(/@media \(prefers-color-scheme:dark\)\{:root\{([\s\S]*?)\}\}/);
if (!dark) throw new Error('bloc sombre introuvable');
style = style.replace(dark[0],
  `@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){${dark[1]};color-scheme:dark}}\n:root[data-theme="dark"]{${dark[1]};color-scheme:dark}`);

// Cadre « téléphone » sur grand écran
style += `
body{max-width:430px;margin:0 auto;min-height:100vh;box-shadow:0 0 0 1px var(--line)}
nav{left:50%;right:auto;transform:translateX(-50%);width:100%;max-width:430px}
.sheet-panel{max-width:430px}
#settings{display:none}
.preview-bar{display:flex;gap:10px;align-items:center;justify-content:space-between;background:var(--accent-soft);color:var(--ink);font-size:13px;padding:8px max(16px, env(safe-area-inset-right, 0px)) 8px max(16px, env(safe-area-inset-left, 0px))}
.pv-btns{display:flex;gap:6px;flex:none;flex-wrap:wrap;justify-content:flex-end}
.preview-bar{flex-wrap:wrap}
.preview-bar button.on{background:var(--accent);color:#fff}
.preview-bar button{flex:none;border:1px solid var(--accent);background:none;color:var(--accent);border-radius:8px;padding:4px 10px;font:inherit;font-size:13px}
`;

body = body.replace('</header>', `</header>
<div class="preview-bar"><span><b>Aperçu</b> · ta cave au ${snap.date}. Ici, rien n'est enregistré dans ta feuille.</span><span class="pv-btns"><button id="preview-net" type="button" aria-pressed="false">Couper le réseau</button><button id="preview-reset" type="button">Réinitialiser</button></span></div>`);

body = body.replace("let CFG = store.get('cave-cfg');", "let CFG = { url: 'apercu', key: 'apercu' };");
body = body.replace(/async function call\(cfg, action, args\) \{[\s\S]*?\n\}\nconst run =/, `
const SNAP = ${JSON.stringify({ inv: snap.inv, bues: snap.bues.concat(EXEMPLES) })};
let DB = JSON.parse(JSON.stringify(SNAP));
const S_ = x => x == null ? '' : String(x).trim();
const K_ = r => [r[0], r[1], r[2], r[4], r[5], r[6], r[7]].map(S_).join('|');
const vals_ = o => [S_(Number(o.zone)), S_(o.cote), S_(o.couleur), S_(o.region), S_(o.domaine), S_(o.appellation), S_(o.cuvee), S_(o.millesime), Math.max(0, Math.round(Number(o.nb) || 0))];
function validate_(o, allowZero) {
  if (!o || !S_(o.domaine)) throw new Error('Le domaine est obligatoire.');
  const z = Number(o.zone); if (!(z >= 1 && z <= 5)) throw new Error('La zone doit être entre 1 et 5.');
  if (!['Avant', 'Arrière'].includes(S_(o.cote))) throw new Error('Le côté doit être Avant ou Arrière.');
  if (!(Number(o.nb) >= (allowZero ? 0 : 1))) throw new Error('Nombre de bouteilles invalide.');
}
function find_(row, key) {
  const i = row - 2; if (DB.inv[i] && K_(DB.inv[i]) === key) return i;
  const j = DB.inv.findIndex(r => K_(r) === key); if (j >= 0) return j;
  throw new Error('Ce vin a été modifié ailleurs. Actualise et réessaie.');
}
const API = {
  getData() {
    return {
      bottles: DB.inv.map((r, i) => ({ row: i + 2, zone: S_(r[0]), cote: S_(r[1]), couleur: S_(r[2]), region: S_(r[3]), domaine: S_(r[4]), appellation: S_(r[5]), cuvee: S_(r[6]), millesime: S_(r[7]), nb: Number(r[8]) || 0 })),
      drunk: DB.bues.map(r => ({ date: r[0], couleur: r[1], region: r[2], domaine: r[3], appellation: r[4], cuvee: r[5], millesime: S_(r[6]), note: r[7], stade: r[8], racheter: r[9], commentaire: r[10] }))
    };
  },
  addBottle(o) {
    validate_(o); const v = vals_(o), k = K_(v);
    const i = DB.inv.findIndex(r => K_(r) === k);
    if (i >= 0) { DB.inv[i][8] = (Number(DB.inv[i][8]) || 0) + v[8]; return API.getData(); }
    let after = -1; DB.inv.forEach((r, j) => { if (S_(r[0]) === v[0] && S_(r[1]) === v[1]) after = j; });
    if (after >= 0) DB.inv.splice(after + 1, 0, v); else DB.inv.push(v);
    return API.getData();
  },
  updateBottle(row, key, o) {
    validate_(o, true); const i = find_(row, key), v = vals_(o);
    if (v[8] <= 0) DB.inv.splice(i, 1); else DB.inv[i] = v;
    return API.getData();
  },
  // Questions sur toute la cave, simulées : de vraies bouteilles de la cave, choisies grossièrement selon la question
  askCave(question, history) {
    if (!question) throw new Error('Question manquante.');
    if (/erreur/i.test(question)) throw new Error("Le service d'IA est très sollicité en ce moment.");
    const q = question.toLowerCase(), vins = API.getData().bottles;
    const pick = (f, sort, n) => { const vus = {}; return vins.filter(f).sort(sort).filter(v => { const k = v.domaine + v.appellation + v.cuvee + v.millesime; if (vus[k]) return false; return (vus[k] = true); }).slice(0, n); };
    const vieux = (a, b) => (Number(a.millesime) || 9999) - (Number(b.millesime) || 9999);
    const rouge = v => v.couleur === 'Rouge', blanc = v => v.couleur === 'Blanc';
    let choix, texte;
    if (/agneau|gigot|boeuf|bœuf|viande|côte|gibier|canard/.test(q)) {
      choix = pick(v => rouge(v) && /Rhône Nord|Bordeaux|Provence/.test(v.region) && Number(v.millesime) <= 2019, (a, b) => (/Nord/.test(b.region) - /Nord/.test(a.region)) || vieux(a, b), 3);
      texte = 'Réponse simulée pour l’aperçu. Avec un gigot d’agneau, vise un rouge **épicé et assez mûr** :\\n- une **Syrah du Rhône nord** à point, pour ses notes de poivre et d’olive ;\\n- ou un **Bordeaux** avec un peu d’âge, plus classique.\\nÉvite les vins trop jeunes et tanniques.';
    } else if (/poisson|huître|fruits de mer|crustacé|saint-jacques|fromage de chèvre/.test(q)) {
      choix = pick(v => blanc(v) && !/Sauternes|Tokaj/.test(v.appellation), vieux, 3);
      texte = 'Réponse simulée pour l’aperçu. Pour ce plat, un **blanc sec et vif** fera merveille. Dans ta cave, j’ouvrirais l’un de ceux-ci :';
    } else if (/priorit|urgent|apogée|décliner/.test(q)) {
      choix = pick(v => Number(v.millesime) && Number(v.millesime) <= 2016, vieux, 4);
      texte = 'Réponse simulée pour l’aperçu. Tes vins les plus anciens sont ceux à surveiller : la plupart sont **à leur apogée** et gagneraient à être ouverts dans les mois qui viennent.';
    } else if (/portrait|manque|équilibr/.test(q)) {
      choix = [];
      texte = 'Réponse simulée pour l’aperçu. Ta cave est très **rhodanienne et bourguignonne**, avec une belle place pour les rouges de garde. Les blancs de Loire et les **effervescents** y sont peu présents : un ou deux Champagnes et un Chenin de garde l’équilibreraient.';
    } else {
      choix = pick(rouge, () => Math.random() - .5, 2);
      texte = 'Réponse simulée pour l’aperçu à ta question : « ' + question + ' ». Dans l’app, la vraie réponse s’affichera ici, avec les bouteilles de ta cave qui conviennent.';
    }
    const raisons = ['À point, et parfait pour l’occasion.', 'Une belle alternative, un peu plus jeune.', 'Pour changer de style.', 'À ouvrir sans trop attendre.'];
    return { texte, vins: choix.map((v, i) => ({ couleur: v.couleur, region: v.region, domaine: v.domaine, appellation: v.appellation, cuvee: v.cuvee, millesime: v.millesime, pourquoi: raisons[i] })), modele: 'simulation' };
  },
  // Questions simulées (l'aperçu n'interroge pas l'IA)
  askWine(w, question, kind) {
    if (!w || !question) throw new Error('Question manquante.');
    if (/erreur/i.test(question)) throw new Error("Le service d'IA est très sollicité en ce moment. Réessaie dans un instant.");
    const vin = w.domaine + (w.cuvee ? ' « ' + w.cuvee + ' »' : '') + (w.millesime ? ' ' + w.millesime : '');
    const T = {
      accord: 'Réponse simulée pour l’aperçu. Pour ' + vin + ', quelques pistes :\\n- **Viandes rôties** ou gibier à plume\\n- **Fromages affinés** à pâte pressée\\n- Un plat mijoté aux champignons\\nÉvite les plats très épicés ou sucrés, qui écraseraient le vin.',
      garde: 'Réponse simulée pour l’aperçu. ' + vin + ' se boit idéalement **entre 3 et 10 ans** après le millésime. Il peut s’ouvrir dès maintenant ; un passage en carafe d’une heure l’aidera. Sers-le vers **16 °C**.',
      achat: 'Réponse simulée pour l’aperçu. On trouve ' + vin + ' chez plusieurs cavistes en ligne, autour de **25 à 35 €** la bouteille. Les millésimes récents sont les plus faciles à trouver.',
      libre: 'Réponse simulée pour l’aperçu à ta question : « ' + question + ' ». Dans l’app, la vraie réponse s’affichera ici.'
    };
    return { texte: T[kind] || T.libre, sources: kind === 'achat' ? [{ titre: 'Exemple de caviste en ligne (simulation)', url: 'https://example.com' }] : [], modele: 'simulation', recherche: kind === 'achat' };
  },
  // Lecture d'étiquette simulée (l'aperçu n'appelle pas Gemini)
  readLabel(img) {
    if (!img || !img.data) throw new Error('Photo manquante.');
    // une lecture sur deux échoue, pour pouvoir essayer « Réessayer » dans l'aperçu
    API._n = (API._n || 0) + 1;
    if (API._n % 2) throw new Error('Gemini est très sollicité en ce moment (simulation de l\u2019aperçu). Réessaie dans un instant.');
    return { domaine: 'Domaine Cuilleron', appellation: 'Condrieu', cuvee: 'Les Chaillets', millesime: '2022', couleur: 'Blanc', region: 'Vallée du Rhône Nord' };
  },
  updateTasting(m, t) {
    if (!m || !t) throw new Error('Dégustation manquante.');
    let f = -1;
    for (let i = DB.bues.length - 1; i >= 0; i--) {
      const r = DB.bues[i];
      if (r[0] !== m.date || r[3] !== m.domaine || r[4] !== m.appellation || r[5] !== m.cuvee || S_(r[6]) !== S_(m.millesime)) continue;
      if (f < 0) f = i;
      if (S_(r[7]) === S_(m.note) && S_(r[10]) === S_(m.commentaire)) { f = i; break; }
    }
    if (f < 0) throw new Error('Dégustation introuvable : elle a peut-être été modifiée ailleurs. Actualise et réessaie.');
    const r = DB.bues[f];
    r[0] = t.date || r[0]; r[7] = t.note === '' || t.note == null ? '' : Math.max(0, Math.min(20, Number(String(t.note).replace(',', '.'))));
    r[8] = S_(t.stade); r[9] = S_(t.racheter); r[10] = S_(t.commentaire);
    return API.getData();
  },
  undoDrink(t) {
    for (let i = DB.bues.length - 1; i >= 0; i--) {
      const r = DB.bues[i];
      if (r[0] === t.date && r[3] === t.domaine && r[4] === t.appellation && r[5] === t.cuvee && S_(r[6]) === S_(t.millesime)) { DB.bues.splice(i, 1); return API.getData(); }
    }
    throw new Error('Dégustation introuvable : elle a peut-être déjà été supprimée.');
  },
  drinkBottle(row, key, t) {
    t = t || {}; const i = find_(row, key), v = DB.inv[i];
    if (Number(v[8]) > 1) v[8] = Number(v[8]) - 1; else DB.inv.splice(i, 1);
    const note = t.note === '' || t.note == null ? '' : Math.max(0, Math.min(20, Number(String(t.note).replace(',', '.'))));
    DB.bues.push([t.date || today(), v[2], v[3], v[4], v[5], v[6], v[7], note, S_(t.stade), S_(t.racheter), S_(t.commentaire)]);
    return API.getData();
  }
};
window.__offline = false;
async function call(cfg, action, args) {
  await new Promise(r => setTimeout(r, (action === 'readLabel' || action === 'askWine' || action === 'askCave') && args[0] ? 1600 : 200));
  if (window.__offline) throw Object.assign(new Error('Pas de connexion au script (réseau ou adresse incorrecte).'), { net: true });
  return JSON.parse(JSON.stringify(API[action](...args)));
}
store.get = () => null; store.set = () => {};
const run =`);
body = body.replace("if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});\n", '');
body = body.replace('\nload();', `
$('#preview-net').onclick = e => {
  window.__offline = !window.__offline;
  e.currentTarget.textContent = window.__offline ? 'Rétablir le réseau' : 'Couper le réseau';
  e.currentTarget.setAttribute('aria-pressed', String(window.__offline));
  e.currentTarget.classList.toggle('on', window.__offline);
  toast(window.__offline ? 'Réseau coupé (simulation)' : 'Réseau rétabli');
  if (!window.__offline) window.dispatchEvent(new Event('online'));
};
$('#preview-reset').onclick = () => { DB = JSON.parse(JSON.stringify(SNAP)); QUEUE = []; saveQueue(); setData(API.getData()); closeSheet(); renderAdd(); toast('Aperçu réinitialisé'); };
load();`);
body = body.replace('\n<script>\n', '\n<script>' + cropJs + '</script>\n<script>\n');
if (!body.includes('const API') || body.includes('serviceWorker') || !body.includes('preview-reset').valueOf()) throw new Error('remplacement raté');

fs.writeFileSync(path.join(__dirname, 'ma-cave-apercu.html'),
  `<title>Ma cave à vin</title>\n${fontLinks}\n<style>${style}</style>\n${body}`);
console.log('ok');
