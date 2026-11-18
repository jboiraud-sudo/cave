// Dessins au trait des régions (viewBox 320 x 180), style gravure d'étiquette.
// Trait : currentColor ; les surfaces « pleines » utilisent var(--card) pour masquer ce qui est derrière.
const f = n => Math.round(n * 10) / 10;
const D = {};

/* ---------- Bourgogne : toits vernissés des Hospices de Beaune ---------- */
{
  const roof = '40,122 72,46 248,46 280,122';
  let lattice = '';
  for (let k = -200; k <= 400; k += 13) {
    lattice += `<line x1="${k}" y1="46" x2="${k + 76}" y2="122"/><line x1="${k}" y1="122" x2="${k + 76}" y2="46"/>`;
  }
  const dormer = (x, y, w, h) => `<path class="pl" d="M${x},${y + h} V${y + 8} L${x + w / 2},${y - 12} L${x + w},${y + 8} V${y + h} Z"/>
    <path d="M${x + 5},${y + h} V${y + 12} Q${x + w / 2},${y + 2} ${x + w - 5},${y + 12} V${y + h}"/>
    <line x1="${x + w / 2}" y1="${y - 12}" x2="${x + w / 2}" y2="${y - 22}"/><circle cx="${x + w / 2}" cy="${y - 24}" r="2"/>`;
  D.bourgogne = `
    <clipPath id="clip-bg-roof"><polygon points="${roof}"/></clipPath>
    <g clip-path="url(#clip-bg-roof)" stroke-width=".8">${lattice}</g>
    <polygon points="${roof}"/>
    ${dormer(88, 84, 26, 30)}${dormer(147, 78, 26, 36)}${dormer(206, 84, 26, 30)}
    <line x1="72" y1="46" x2="72" y2="30"/><circle cx="72" cy="27" r="2.5"/>
    <line x1="248" y1="46" x2="248" y2="30"/><circle cx="248" cy="27" r="2.5"/>
    <path d="M160,46 V14 M154,24 L160,10 L166,24"/>
    <rect x="40" y="122" width="240" height="44"/>
    ${[58, 92, 126, 194, 228, 262].map(x => `<path d="M${x - 7},158 V138 Q${x},130 ${x + 7},138 V158 Z"/>`).join('')}
    <path d="M148,166 V140 Q160,128 172,140 V166"/>
    <line x1="8" y1="166" x2="312" y2="166"/>`;
}

/* ---------- Vallée du Rhône Nord : coteaux en terrasses (Côte-Rôtie) ---------- */
{
  const slope = x => 160 - Math.pow(x / 320, 1.6) * 140; // pente raide vers la droite
  let terr = '', stakes = '';
  for (let row = 0; row < 7; row++) {
    const off = row * 17;
    let d = '';
    for (let x = 40 + row * 6; x < 312; x += 26) {
      const y = slope(x) + off;
      if (y > 164) continue;
      d += `M${f(x)},${f(y)} h22 v4 `;
      stakes += `<path d="M${f(x + 7)},${f(y)} v-8 M${f(x + 15)},${f(y)} v-8 M${f(x + 5)},${f(y - 6)} q6,-3 12,0"/>`;
    }
    terr += `<path d="${d}"/>`;
  }
  D['rhone-nord'] = `
    <path d="M8,162 C80,150 150,120 200,82 S280,22 314,14"/>
    <g stroke-width="1">${terr}</g><g stroke-width=".8">${stakes}</g>
    <path d="M8,170 q12,-4 24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0" stroke-width="1"/>
    <path d="M30,177 q12,-4 24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0" stroke-width=".8"/>`;
}

/* ---------- Vallée du Rhône Sud : ruines du château des Papes (Châteauneuf) ---------- */
{
  let rows = '';
  for (let i = -4; i <= 4; i++) {
    if (i === 0) continue;
    rows += `<path d="M${166 + i * 30},178 Q${166 + i * 18},152 ${166 + i * 9},${134 + Math.abs(i) * 2.2}"/>`;
  }
  D['rhone-sud'] = `
    <path d="M6,170 C60,154 92,130 118,128 H214 C240,130 266,154 314,170"/>
    <g stroke-width=".8">${rows}</g>
    <path class="pl" d="M136,128 V52 L144,46 V38 L152,44 L158,30 L166,40 L172,34 L180,44 V128 Z"/>
    <path d="M150,128 V112 Q158,102 166,112 V128"/>
    <path d="M152,82 V70 Q158,64 164,70 V82 Z"/>
    <path d="M144,96 h8 M168,60 h6 M140,66 h6 M170,104 h7" stroke-width=".8"/>
    <path class="pl" d="M180,128 V94 h8 v-6 h8 v6 h8 v-4 l6,-6 l4,8 h8 V128 Z"/>
    <path class="pl" d="M136,128 V104 h-8 v-6 l-6,4 l-4,-8 l-6,6 V128 Z"/>
    <path d="M110,128 H222" stroke-width="1"/>`;
}

/* ---------- Bordeaux : façade de château et rangs de vigne au premier plan ---------- */
{
  const win = (x, y) => `<path d="M${x},${y + 14} V${y + 4} Q${x + 5},${y - 1} ${x + 10},${y + 4} V${y + 14} Z"/>`;
  let wins = '';
  [84, 106, 204, 226].forEach(x => { wins += win(x, 88) + win(x, 106); });
  [134, 155, 176].forEach(x => { wins += win(x, 72); });
  [134, 176].forEach(x => { wins += win(x, 94); });
  [53, 257].forEach(x => { wins += win(x, 80) + win(x, 102); });
  let bal = '';
  [[76, 124], [196, 244]].forEach(([a, b]) => { for (let x = a + 4; x < b; x += 5) bal += `M${x},80 V74 `; });
  // Rangs de vigne en perspective : piquets + touffes de feuillage, plus grands au premier plan
  let vines = '';
  for (let i = -7; i <= 7; i++) {
    const x0 = 160 + i * 46, y0 = 182, x1 = 160 + i * 13, y1 = 136;
    vines += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke-width=".7"/>`;
    [0.18, 0.42, 0.68, 0.9].forEach(t => {
      const x = x1 + (x0 - x1) * t, y = y1 + (y0 - y1) * t, sz = 2 + t * 6;
      if (x < 4 || x > 316) return;
      vines += `<path d="M${f(x)},${f(y)} V${f(y - sz * .8)} M${f(x - sz * 1.1)},${f(y - sz * .8)} c0,${f(-sz * .9)} ${f(sz * .6)},${f(-sz * 1.3)} ${f(sz * 1.1)},${f(-sz * 1.1)} c${f(sz * .5)},${f(-sz * .2)} ${f(sz * 1.1)},${f(sz * .2)} ${f(sz * 1.1)},${f(sz * 1.1)}" stroke-width="${f(.6 + t * .6)}"/>`;
    });
  }
  D.bordeaux = `
    <rect class="pl" x="76" y="80" width="48" height="48"/><rect class="pl" x="196" y="80" width="48" height="48"/>
    <path d="M76,74 H124 M196,74 H244"/><path d="${bal}" stroke-width=".8"/>
    <rect class="pl" x="40" y="68" width="36" height="60"/><path class="pl" d="M38,68 L46,50 H70 L78,68 Z"/>
    <rect class="pl" x="244" y="68" width="36" height="60"/><path class="pl" d="M242,68 L250,50 H274 L282,68 Z"/>
    <rect class="pl" x="124" y="62" width="72" height="66"/>
    <path class="pl" d="M118,62 L160,36 L202,62 Z"/><circle cx="160" cy="52" r="5" stroke-width=".9"/>
    ${wins}
    <path d="M152,128 V114 Q160,105 168,114 V128"/>
    <path d="M144,128 V131 H176 V128 M140,131 V134 H180 V131" stroke-width=".9"/>
    <line x1="24" y1="128" x2="296" y2="128"/>
    <path d="M8,134 H312" stroke-width=".7" stroke-dasharray="2 5"/>
    <clipPath id="clip-bx"><rect x="6" y="134" width="308" height="46"/></clipPath><g clip-path="url(#clip-bx)">${vines}</g>`;
}

/* ---------- Beaujolais : le mont Brouilly et sa chapelle ---------- */
{
  let rows = '';
  for (let k = 1; k <= 5; k++) {
    const t = 74 + k * 16;
    rows += `<path d="M${14 + k * 10},178 C${80 + k * 6},172 ${100 + k * 4},${t} 160,${t - 4} C${220 - k * 4},${t} ${240 - k * 6},172 ${306 - k * 10},178" stroke-dasharray="2 4"/>`;
  }
  D.beaujolais = `
    <path d="M4,176 C80,172 96,74 160,68 C224,74 240,172 316,176"/>
    <g stroke-width="1.1">${rows}</g>
    <path class="pl" d="M152,70 V52 H178 V70"/>
    <path class="pl" d="M148,52 L165,40 L182,52 Z"/>
    <path class="pl" d="M142,70 V42 H152 V70 Z"/><path class="pl" d="M140,42 L147,28 L154,42 Z"/>
    <path d="M147,28 V18 M143,22 h8"/>
    <path d="M162,70 V62 Q165,58 168,62 V70" stroke-width=".9"/>`;
}

/* ---------- Générique : grappe de raisin et feuille de vigne ---------- */
{
  const rowsN = [5, 4, 5, 4, 3, 2, 1];
  let grapes = '';
  rowsN.forEach((n, r) => {
    for (let i = 0; i < n; i++) {
      const cx = 192 + (i - (n - 1) / 2) * 17, cy = 54 + r * 15;
      grapes += `<circle class="pl" cx="${f(cx)}" cy="${f(cy)}" r="8.5"/><path d="M${f(cx - 3.5)},${f(cy - 3)} q2,-2.5 5,-2" stroke-width=".8"/>`;
    }
  });
  // Feuille : contour polaire à 5 lobes, petites dents, échancrure au pétiole ; base orientée vers la grappe
  const cx = 104, cy = 82, R = 46, rot = -0.55;
  const pts = [];
  for (let i = 0; i <= 360; i += 3) {
    const t = i * Math.PI / 180;
    const lobes = 0.66 + 0.34 * Math.pow(Math.abs(Math.cos(2.5 * t)), 0.8);
    const teeth = 1 + 0.045 * Math.sin(t * 30);
    const sinus = 1 - 0.55 * Math.exp(-Math.pow((t - Math.PI) / 0.22, 2)); // échancrure du pétiole
    const r = R * lobes * teeth * sinus;
    const a = t - Math.PI / 2 + rot; // t=0 → lobe du haut
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  const base = [cx + R * 0.2 * Math.cos(Math.PI / 2 + rot), cy + R * 0.2 * Math.sin(Math.PI / 2 + rot)];
  const veins = [0, 72, -72, 144, -144].map(dg => {
    const a = dg * Math.PI / 180 - Math.PI / 2 + rot, rr = R * (dg === 0 ? .92 : Math.abs(dg) === 72 ? .85 : .62);
    return `M${f(base[0])},${f(base[1])} L${f(cx + rr * Math.cos(a))},${f(cy + rr * Math.sin(a))}`;
  }).join(' ');
  const leaf = `<path class="pl" d="M${pts.map(p => f(p[0]) + ',' + f(p[1])).join(' L')} Z"/>
    <path d="${veins}" stroke-width=".9"/>
    <path d="M${f(base[0])},${f(base[1])} C${f(base[0] + 30)},${f(base[1] + 4)} 170,40 192,36" stroke-width="1.6"/>`;
  D.generique = `
    <path d="M196,8 C190,22 194,32 192,44" stroke-width="2"/>
    <path d="M196,16 C216,6 236,12 232,26 C229,36 216,34 219,26 C221,21 227,22 226,26" stroke-width="1.1"/>
    ${leaf}
    ${grapes}`;
}

/* ---------- Jura : bouteille de vin jaune (clavelin), contour détouré sur la photo fournie ---------- */
D.jura = `
  <path d="M6,166 C50,148 90,150 128,142 M192,142 C230,150 270,148 314,166" stroke-width="1"/>
  <path d="M6,150 C40,134 70,136 104,130 M216,130 C250,136 280,134 314,150" stroke-width=".8" stroke-dasharray="2 4"/>
  <path class="pl" d="M151.8,10.0 L151.0,11.2 L150.8,12.5 L150.4,13.7 L149.5,14.9 L148.7,16.2 L148.8,17.4 L149.7,18.6 L150.4,19.9 L150.7,21.1 L150.8,22.3 L150.8,23.6 L150.8,24.8 L150.8,26.0 L150.8,27.3 L150.8,28.5 L150.8,29.7 L150.8,31.0 L150.8,32.2 L150.7,33.4 L150.5,34.7 L150.4,35.9 L150.4,37.1 L150.4,38.4 L150.3,39.6 L150.2,40.8 L150.1,42.1 L150.1,43.3 L149.9,44.5 L149.8,45.8 L149.8,47.0 L149.6,48.2 L149.5,49.5 L149.3,50.7 L149.1,51.9 L149.0,53.2 L148.7,54.4 L148.5,55.6 L148.3,56.9 L148.0,58.1 L147.6,59.3 L147.4,60.6 L147.1,61.8 L146.6,63.0 L146.0,64.3 L145.4,65.5 L144.6,66.7 L143.8,68.0 L142.9,69.2 L141.7,70.4 L140.4,71.7 L138.9,72.9 L137.5,74.1 L135.8,75.4 L134.5,76.6 L133.5,77.8 L132.7,79.1 L132.2,80.3 L131.6,81.5 L131.2,82.8 L131.0,84.0 L130.9,85.2 L130.9,86.5 L130.9,87.7 L130.9,88.9 L130.9,90.2 L130.9,91.4 L130.9,92.6 L130.9,93.9 L130.9,95.1 L130.9,96.3 L130.9,97.6 L130.9,98.8 L130.9,100.0 L130.9,101.3 L130.9,102.5 L131.0,103.7 L131.1,105.0 L131.2,106.2 L131.2,107.4 L131.2,108.7 L131.2,109.9 L131.2,111.1 L131.2,112.4 L131.2,113.6 L131.2,114.8 L131.2,116.1 L131.2,117.3 L131.2,118.5 L131.2,119.7 L131.3,121.0 L131.3,122.2 L131.3,123.4 L131.3,124.7 L131.4,125.9 L131.5,127.1 L131.5,128.4 L131.5,129.6 L131.5,130.8 L131.5,132.1 L131.5,133.3 L131.5,134.5 L131.5,135.8 L131.6,137.0 L131.6,138.2 L131.6,139.5 L131.6,140.7 L131.6,141.9 L131.6,143.2 L131.7,144.4 L131.8,145.6 L131.8,146.9 L131.8,148.1 L131.8,149.3 L131.9,150.6 L131.9,151.8 L131.9,153.0 L131.9,154.3 L131.9,155.5 L131.9,156.7 L131.9,158.0 L131.9,159.2 L132.1,160.4 L132.1,161.7 L132.2,162.9 L132.6,164.1 L133.5,165.4 L134.8,166.6 L138.0,167.8 L144.6,169.1 L152.1,170.0 L167.9,170.0 L175.4,169.1 L182.0,167.8 L185.2,166.6 L186.5,165.4 L187.4,164.1 L187.8,162.9 L187.9,161.7 L187.9,160.4 L188.1,159.2 L188.1,158.0 L188.1,156.7 L188.1,155.5 L188.1,154.3 L188.1,153.0 L188.1,151.8 L188.1,150.6 L188.2,149.3 L188.2,148.1 L188.2,146.9 L188.2,145.6 L188.3,144.4 L188.4,143.2 L188.4,141.9 L188.4,140.7 L188.4,139.5 L188.4,138.2 L188.4,137.0 L188.5,135.8 L188.5,134.5 L188.5,133.3 L188.5,132.1 L188.5,130.8 L188.5,129.6 L188.5,128.4 L188.5,127.1 L188.6,125.9 L188.7,124.7 L188.7,123.4 L188.7,122.2 L188.7,121.0 L188.8,119.7 L188.8,118.5 L188.8,117.3 L188.8,116.1 L188.8,114.8 L188.8,113.6 L188.8,112.4 L188.8,111.1 L188.8,109.9 L188.8,108.7 L188.8,107.4 L188.8,106.2 L188.9,105.0 L189.0,103.7 L189.1,102.5 L189.1,101.3 L189.1,100.0 L189.1,98.8 L189.1,97.6 L189.1,96.3 L189.1,95.1 L189.1,93.9 L189.1,92.6 L189.1,91.4 L189.1,90.2 L189.1,88.9 L189.1,87.7 L189.1,86.5 L189.1,85.2 L189.0,84.0 L188.8,82.8 L188.4,81.5 L187.8,80.3 L187.3,79.1 L186.5,77.8 L185.5,76.6 L184.2,75.4 L182.5,74.1 L181.1,72.9 L179.6,71.7 L178.3,70.4 L177.1,69.2 L176.2,68.0 L175.4,66.7 L174.6,65.5 L174.0,64.3 L173.4,63.0 L172.9,61.8 L172.6,60.6 L172.4,59.3 L172.0,58.1 L171.7,56.9 L171.5,55.6 L171.3,54.4 L171.0,53.2 L170.9,51.9 L170.7,50.7 L170.5,49.5 L170.4,48.2 L170.2,47.0 L170.2,45.8 L170.1,44.5 L169.9,43.3 L169.9,42.1 L169.8,40.8 L169.7,39.6 L169.6,38.4 L169.6,37.1 L169.6,35.9 L169.5,34.7 L169.3,33.4 L169.2,32.2 L169.2,31.0 L169.2,29.7 L169.2,28.5 L169.2,27.3 L169.2,26.0 L169.2,24.8 L169.2,23.6 L169.2,22.3 L169.3,21.1 L169.6,19.9 L170.3,18.6 L171.2,17.4 L171.3,16.2 L170.5,14.9 L169.6,13.7 L169.2,12.5 L169.0,11.2 L168.2,10.0 Z"/>
  <path d="M149.6,19 H170.4" stroke-width=".7"/>
  <ellipse class="pl" cx="160" cy="53" rx="11.5" ry="7"/>
  <ellipse cx="160" cy="53" rx="8.8" ry="4.8" stroke-width=".6"/>
  <path d="M155,53 h10" stroke-width=".7"/>
  <rect x="132.5" y="105" width="55" height="57" rx="1"/>
  <rect x="135.5" y="108" width="49" height="51" stroke-width=".6"/>
  <ellipse cx="160" cy="119" rx="5" ry="6" stroke-width=".7"/>
  <path d="M149,131 H171" stroke-width=".6"/>
  <path d="M144,138 H176" stroke-width="1.3"/>
  <path d="M150,144 H170 M146,151 H174 M150,155 H170" stroke-width=".6"/>
  <line x1="8" y1="170" x2="312" y2="170"/>`;

/* ---------- Loire : château Renaissance au bord de l'eau ---------- */
{
  const tower = x => `<rect class="pl" x="${x}" y="72" width="30" height="60"/><path class="pl" d="M${x - 3},72 L${x + 15},30 L${x + 33},72 Z"/>
    <path d="M${x + 15},30 V22"/><path d="M${x + 11},90 h8 v12 h-8 Z M${x + 11},110 h8 v12 h-8 Z" stroke-width=".9"/>`;
  const dormer = x => `<path class="pl" d="M${x},78 V64 L${x + 8},52 L${x + 16},64 V78 Z"/><path d="M${x + 4},76 V66 h8 v10" stroke-width=".8"/>`;
  let wins = ''; [112, 136, 172, 196].forEach(x => { wins += `<path d="M${x},92 h10 v14 h-10 Z M${x},112 h10 v14 h-10 Z M${x + 5},92 v14 M${x + 5},112 v14" stroke-width=".9"/>`; });
  D.loire = `
    <rect x="100" y="80" width="120" height="52"/>
    <path class="pl" d="M98,80 L114,48 H206 L222,80 Z"/>
    <path d="M128,48 V30 h8 v18 M184,48 V26 h8 v22"/>
    <path class="pl" d="M152,48 V36 h16 v12"/><path d="M150,36 L160,22 L170,36 M160,22 V14"/>
    ${dormer(118)}${dormer(152)}${dormer(186)}
    ${tower(70)}${tower(220)}
    ${wins}<path d="M154,132 V116 Q160,108 166,116 V132"/>
    <line x1="8" y1="132" x2="312" y2="132"/>
    <path d="M60,140 h40 M128,140 h64 M220,140 h40 M80,147 h20 M140,147 h40 M230,147 h20" stroke-width=".9"/>
    <path d="M8,158 q14,-4 28,0 t28,0 t28,0 t28,0 t28,0 t28,0 t28,0 t28,0 t28,0 t28,0 t28,0" stroke-width=".9"/>
    <path d="M30,170 q14,-4 28,0 t28,0 t28,0 t28,0 t28,0 t28,0 t28,0 t28,0 t28,0" stroke-width=".8"/>`;
}

/* ---------- Languedoc : le pont du Gard, perspective relevée sur la photo fournie (repère photo 660 × 249) ---------- */
{
  // Toutes les horizontales du pont convergent vers un point de fuite (VP) ; niveaux mesurés à x = 234
  const VP = [1176, 164], X0 = 234;
  const lvl = L => x => VP[1] + (L - VP[1]) * (VP[0] - x) / (VP[0] - X0);
  const top = lvl(43), c1 = lvl(82), c1b = lvl(87), c2 = lvl(158), c2b = lvl(163), base = lvl(236);
  const P = (x, yf) => `${f(x)},${f(yf(x))}`;
  const line = (yf, x1, x2) => `M${P(x1, yf)} L${P(x2, yf)}`;
  const XL = 18, XR = 612;
  // Arche : jambages verticaux, voûte en anse de panier, du niveau haut (clé) au niveau bas
  const arch = (xa, xb, crownF, bottomF, rise = .5) => {
    const w = xb - xa, cy = Math.max(crownF(xa), crownF(xb)) + 2, iy = cy + w * rise;
    return `<path class="pl" d="M${f(xa)},${f(bottomF(xa))} V${f(iy)} C${f(xa)},${f(cy - w * .02)} ${f(xb)},${f(cy - w * .02)} ${f(xb)},${f(iy)} V${f(bottomF(xb))}"/>`;
  };
  // Étage du bas et du milieu : mêmes piles ; travées mesurées sur la photo
  const spans = [[24, 84], [102, 166], [189, 279], [302, 358], [380, 426], [448, 486], [506, 532], [552, 570], [586, 598]];
  let mid = '', low = '';
  spans.forEach(([a, b]) => { mid += arch(a, b, c1b, c2, .42); low += arch(a + 2, b - 2, c2b, base, .5); });
  // Étage du haut : petites arches mesurées, puis prolongées en perspective jusqu'au bout du pont
  const small = [[36, 56], [76, 96], [114, 133], [150, 167], [183, 199], [213, 228], [242, 255], [270, 282], [298, 308], [326, 336], [353, 361], [377, 384]];
  let x = 384, w = 7.2, gap = 17;
  while (x + gap + w < XR - 4) { x += gap; small.push([x, x + w]); x += w; w *= .96; gap *= .96; }
  const sTop = lvl(58), sBot = lvl(72);
  let up = ''; small.forEach(([a, b]) => { up += arch(a, b, sTop, sBot, .38); });
  // Eau et reflets
  // Rivière : lignes d'eau ondulées, par tronçons, plus amples et espacées en se rapprochant
  let water = '';
  [6, 13, 22, 33, 47, 63].forEach((dy, k) => {
    const wl = lvl(236 + dy), wav = 16 + k * 7, amp = .9 + k * .35, seg = wav * (3 + (k % 2)), gap = wav * (1.2 + k * .15);
    for (let x0 = -20 + ((k * 37) % 60); x0 < 680; x0 += seg + gap) {
      let d = '';
      for (let x = x0; x <= x0 + seg; x += 2) d += `${d ? ' L' : 'M'}${f(x)},${f(wl(x) + amp * Math.sin((x - x0) / wav * Math.PI * 2))}`;
      water += d + ' ';
    }
  });
  // Reflets des piles : traits verticaux courts sous chaque pile
  let refl = '';
  for (let k = 0; k < spans.length - 1; k++) {
    const x = (spans[k][1] + spans[k + 1][0]) / 2, y = base(x), h = (spans[k + 1][0] - spans[k][1]) * .9 + 8;
    refl += `M${f(x - 4)},${f(y + 3)} v${f(h)} M${f(x)},${f(y + 5)} v${f(h * .7)} M${f(x + 4)},${f(y + 3)} v${f(h * .85)} `;
  }
  D.languedoc = `<g transform="translate(0 28) scale(.485)">
    <path class="pl" stroke="none" d="M${P(XL, top)} L${P(XR, top)} L${P(XR, base)} L${P(XL, base)} Z"/>
    <path d="${line(sBot, XL, XR)}" stroke-width=".6"/>
    <path d="${line(top, XL, XR)} ${line(c1, XL, XR)} ${line(c1b, XL, XR)} ${line(c2, XL, XR)} ${line(c2b, XL, XR)} M${P(XR, top)} L${P(XR, base)}"/>
    ${up}${mid}${low}
    <clipPath id="clip-gard"><rect x="-20" y="0" width="700" height="312"/></clipPath>
    <g clip-path="url(#clip-gard)"><path d="${refl}" stroke-width=".6" stroke-dasharray="2 3" opacity=".6"/><path d="${water}" stroke-width=".8"/></g>
  </g>`;
}

/* ---------- Savoie : sommets alpins au-dessus d'un coteau de vignes (rangs qui montent la pente) ---------- */
{
  const top = x => 132 - 34 * Math.sin(Math.PI * (x + 40) / 400); // crête arrondie du coteau
  // Cep : piquet + touffe de feuillage arrondie (même style que Bordeaux)
  // Cep : petit tronc tordu + touffe de feuillage en trois lobes (masque ce qui est derrière)
  const cep = (x, y, s, sw) => `<path d="M${f(x)},${f(y)} q${f(s * .25)},${f(-s * .4)} 0,${f(-s * .85)}" stroke-width="${f(sw)}"/>
    <path class="pl" d="M${f(x - s * 1.15)},${f(y - s * .75)} c${f(-s * .15)},${f(-s * .75)} ${f(s * .45)},${f(-s * 1.1)} ${f(s * .85)},${f(-s * .8)} c${f(s * .2)},${f(-s * .65)} ${f(s * 1)},${f(-s * .65)} ${f(s * 1.1)},${f(-s * .05)} c${f(s * .55)},${f(-s * .15)} ${f(s * .85)},${f(s * .4)} ${f(s * .4)},${f(s * .85)} Z" stroke-width="${f(sw)}"/>`;
  let vines = '';
  for (let i = -8; i <= 8; i++) {
    const xb = 160 + i * 34, yb = 184, xt = 160 + i * 21, yt = top(xt) + 4;
    vines += `<line x1="${f(xb)}" y1="${yb}" x2="${f(xt)}" y2="${f(yt)}" stroke-width=".6"/>`;
    // ceps rapprochés : ils se chevauchent et forment la haie du rang, du haut (loin) vers le bas (près)
    for (let t = 0.03; t < 1; t += 0.035 + t * 0.05) {
      const x = xt + (xb - xt) * t, y = yt + (yb - yt) * t;
      if (x < 2 || x > 318 || y > 182) continue;
      vines += cep(x, y, 1.6 + t * 4.4, .45 + t * .65);
    }
  }
  D.savoie = `
    <path d="M6,124 L62,70 L86,92 L140,26 L178,76 L206,54 L262,108 L292,94 L314,100"/>
    <path d="M122,48 L130,56 L138,46 L146,58 L156,48" stroke-width="1.1"/>
    <path d="M52,80 L58,86 L64,78 L72,86 M198,62 L204,68 L210,62 L216,70" stroke-width="1"/>
    <path d="M140,26 L132,70 M140,26 L152,80 M206,54 L200,96 M62,70 L56,104" stroke-width=".7" stroke-dasharray="2 4"/>
    ${(() => { const c = []; for (let x = 0; x <= 320; x += 8) c.push(`${x},${f(top(x))}`); const line = 'M' + c.join(' L');
      return `<path class="pl" stroke="none" d="${line} V184 H0 Z"/><path d="${line}"/>
      <clipPath id="clip-sav"><path d="${'M' + c.map(p => { const [x, y] = p.split(','); return x + ',' + f(+y + 1); }).join(' L')} V184 H0 Z"/></clipPath>`; })()}
    <g clip-path="url(#clip-sav)">${vines}</g>`;
}

/* ---------- Provence : branche d'olivier et cigale ---------- */
{
  const leaf = (x, y, a, len) => `<path class="pl" transform="translate(${x} ${y}) rotate(${a})" d="M0,0 Q${len / 2},-${f(len * .2)} ${len},0 Q${len / 2},${f(len * .2)} 0,0 Z M3,0 H${len - 4}"/>`;
  const leaves = [[60, 132, -60, 30], [70, 128, 40, 28], [98, 120, -70, 32], [112, 116, 30, 30], [140, 106, -55, 30], [150, 103, 45, 28], [176, 92, -60, 28], [188, 87, 35, 26], [210, 78, -40, 24], [226, 72, 10, 22]];
  D.provence = `
    <path d="M24,146 C80,128 140,110 232,70" stroke-width="1.8"/>
    ${leaves.map(l => leaf(...l)).join('')}
    <ellipse class="pl" cx="88" cy="140" rx="6" ry="8" transform="rotate(-20 88 140)"/><ellipse class="pl" cx="130" cy="124" rx="6" ry="8" transform="rotate(-20 130 124)"/><ellipse class="pl" cx="166" cy="110" rx="6" ry="8" transform="rotate(-20 166 110)"/>
    <g transform="translate(262 112) rotate(-28)">
      <path class="pl" d="M-6,-18 C-30,-6 -36,30 -24,52 C-18,40 -12,20 -4,-6 Z"/><path class="pl" d="M6,-18 C30,-6 36,30 24,52 C18,40 12,20 4,-6 Z"/>
      <path d="M-8,-10 C-22,6 -26,26 -24,44 M8,-10 C22,6 26,26 24,44 M-12,0 C-20,10 -22,22 -22,34 M12,0 C20,10 22,22 22,34" stroke-width=".7"/>
      <ellipse class="pl" cx="0" cy="6" rx="8" ry="24"/>
      <path d="M-7,10 h14 M-7,17 h14 M-6,24 h12 M-5,31 h10" stroke-width=".7"/>
      <path class="pl" d="M-10,-22 Q0,-30 10,-22 L8,-14 H-8 Z"/>
      <circle cx="-9" cy="-23" r="3"/><circle cx="9" cy="-23" r="3"/>
    </g>`;
}

/* ---------- Champagne : bouchon de champagne (contour détouré sur la photo fournie) et bulles ---------- */
{
  // Grain du liège : petits points et quelques fissures, répartis de façon stable dans le bouchon
  let grain = '', seed = 11;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let k = 0; k < 90; k++) {
    const x = 60 + rnd() * 155, y = 14 + rnd() * 232;
    const inHead = ((x - 136) / 74) ** 2 + ((y - 58) / 46) ** 2 < 1;
    const inStem = y > 124 && y < 244 && x > 92 + (y - 124) * -0.08 && x < 190 + (y - 124) * 0.2;
    if (inHead || inStem) grain += rnd() < .82 ? `M${f(x)},${f(y)} h.8 ` : `M${f(x)},${f(y)} l${f(4 + rnd() * 6)},${f(rnd() * 2 - 1)} `;
  }
  const bubble = (x, y, r) => `<circle class="pl" cx="${x}" cy="${y}" r="${r}"/>` + (r >= 3 ? `<path d="M${f(x - r * .45)},${f(y - r * .1)} a${f(r * .5)},${f(r * .5)} 0 0 1 ${f(r * .4)},${f(-r * .4)}" stroke-width=".6"/>` : '');
  const bubbles = [[92, 128, 4.5], [104, 104, 3], [86, 84, 5.5], [100, 62, 2.5], [80, 44, 4], [96, 26, 2], [228, 126, 5], [216, 100, 3], [236, 78, 4], [222, 54, 2.5], [240, 34, 3.5], [226, 16, 2], [70, 112, 2], [250, 108, 2]];
  D.champagne = `
    ${bubbles.map(b => bubble(...b)).join('')}
    <path d="M118,156 Q160,162 202,156" stroke-width=".8" stroke-dasharray="2 4"/>
    <g transform="translate(84 12.5) scale(.56)">
      <path class="pl" d="M131.0,8 L113.6,11 L98.6,14 L91.0,17 L85.4,20 L80.4,23 L74.7,26 L70.2,29 L66.0,32 L63.1,35 L61.9,38 L61.0,41 L60.2,44 L60.2,47 L59.5,50 L58.9,53 L58.5,56 L57.5,59 L56.9,62 L56.6,65 L56.2,68 L55.8,71 L55.8,74 L55.8,77 L55.8,80 L56.3,83 L56.7,86 L57.3,89 L58.2,92 L59.2,95 L60.2,98 L61.6,101 L62.8,104 L65.8,107 L69.4,110 L79.4,113 L90.0,116 L91.6,119 L91.2,122 L91.0,125 L90.5,128 L90.3,131 L90.0,134 L89.9,137 L89.7,140 L89.5,143 L89.2,146 L88.8,149 L88.2,152 L87.8,155 L87.3,158 L86.9,161 L86.6,164 L86.2,167 L85.7,170 L85.1,173 L84.5,176 L83.9,179 L83.3,182 L82.8,185 L82.4,188 L82.2,191 L82.0,194 L81.8,197 L81.5,200 L81.3,203 L81.1,206 L81.0,209 L81.0,212 L81.0,215 L81.0,218 L81.2,221 L81.5,224 L81.7,227 L81.9,230 L82.0,233 L82.0,236 L82.2,239 L82.4,242 L82.8,245 L83.0,248 L83.3,250 L212.6,250 L213.6,248 L214.7,245 L216.5,242 L216.9,239 L216.7,236 L216.1,233 L215.5,230 L214.9,227 L214.3,224 L213.8,221 L212.6,218 L211.5,215 L211.0,212 L210.5,209 L210.4,206 L210.2,203 L209.8,200 L209.2,197 L208.7,194 L207.5,191 L206.4,188 L205.3,185 L204.4,182 L203.9,179 L203.7,176 L203.3,173 L202.7,170 L201.8,167 L200.9,164 L199.9,161 L199.1,158 L198.2,155 L197.4,152 L196.6,149 L195.8,146 L195.0,143 L194.3,140 L193.5,137 L192.8,134 L192.2,131 L191.8,128 L191.2,125 L190.8,122 L190.0,119 L189.2,116 L189.0,113 L190.8,110 L195.6,107 L202.6,104 L207.0,101 L208.8,98 L210.8,95 L212.3,92 L213.5,89 L214.4,86 L215.1,83 L215.5,80 L215.8,77 L216.0,74 L216.0,71 L215.9,68 L215.7,65 L215.2,62 L214.7,59 L213.8,56 L213.1,53 L211.9,50 L210.5,47 L209.3,44 L208.4,41 L207.5,38 L206.9,35 L206.4,32 L205.6,29 L204.0,26 L200.5,23 L196.8,20 L189.4,17 L185.0,14 L177.2,11 L167.0,8 Z"/>
      <path d="M80,24 C110,38 172,38 200,22" stroke-width=".9"/>
      <path d="M62,98 C88,124 176,126 206,100" />
      <path d="M90,122 C120,130 168,130 192,120" stroke-width=".8"/>
      <path d="M82,204 C120,214 176,214 211,204" stroke-width=".9"/>
      <path d="${grain}" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>
    </g>`;
}

/* ---------- Alsace : maison à colombages (Petite France) ---------- */
{
  // Fenêtre à volets + croix de Saint-André dessous
  const win = (cx, y) => `<path class="pl" d="M${cx - 7},${y} h14 v13 h-14 Z"/><path d="M${cx},${y} v13 M${cx - 7},${y + 6} h14" stroke-width=".6"/>
    <path d="M${cx - 12},${y} h4 v13 h-4 Z M${cx + 8},${y} h4 v13 h-4 Z" stroke-width=".7"/>
    <path d="M${cx - 10},${y + 15} h20 v7 h-20 Z M${cx - 10},${y + 15} l20,7 M${cx + 10},${y + 15} l-20,7" stroke-width=".7"/>`;
  const floor = (x1, x2, y1, y2) => {
    let d = `<rect class="pl" x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}"/>`;
    d += `<path d="M${x1 + 6},${y1} V${y2} M${x2 - 6},${y1} V${y2} M${x1},${y2 - 3} H${x2} M${x1 + 6},${y2 - 3} L${x1 + 18},${y1} M${x2 - 6},${y2 - 3} L${x2 - 18},${y1} M160,${y1} V${y2}" stroke-width=".8"/>`;
    return d;
  };
  D.alsace = `
    <path class="pl" d="M98,92 L160,10 L222,92 Z"/>
    <path d="M108,90 L160,22 L212,90" stroke-width=".8"/>
    <path d="M124,70 H196 M140,48 H180 M160,22 V90 M124,70 L140,48 M196,70 L180,48 M116,90 L124,70 M204,90 L196,70" stroke-width=".8"/>
    <path class="pl" d="M152,54 h16 v12 h-16 Z"/><path d="M160,54 v12 M148,54 h3 v12 h-3 M169,54 h3 v12 h-3" stroke-width=".6"/>
    <path d="M155,32 h10 v8 h-10 Z" stroke-width=".7"/>
    ${floor(104, 216, 90, 118)}${win(132, 94)}${win(188, 94)}
    ${floor(108, 212, 118, 144)}${win(132, 122)}${win(188, 122)}
    <rect class="pl" x="112" y="144" width="96" height="24"/>
    <path d="M112,152 h20 M140,152 h18 M184,152 h24 M120,160 h18 M188,160 h20 M112,144 v24" stroke-width=".6"/>
    <path d="M164,168 V154 Q172,146 180,154 V168" stroke-width=".9"/>
    <path d="M124,148 h12 v12 h-12 Z" stroke-width=".8"/>
    <line x1="8" y1="168" x2="312" y2="168"/>
    <path d="M30,175 q12,-3 24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0" stroke-width=".7"/>`;
}

/* ---------- Péloponnèse (Grèce) : temple antique ---------- */
{
  const n = 6, w = 16, gap = 10, span = n * w + (n - 1) * gap, x0 = 160 - span / 2; // colonnes centrées sur l'axe du temple
  let cols = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + i * (w + gap);
    cols += `<path class="pl" d="M${x},74 h${w} V148 h-${w} Z"/><path d="M${x - 3},70 h${w + 6} v4 h-${w + 6} Z M${x + 5},78 V146 M${x + 11},78 V146" stroke-width=".8"/>`;
  }
  let tri = ''; for (let x = 86; x <= 230; x += 12) tri += `M${x},58 v10 M${x + 4},58 v10 `;
  D.grece = `
    <path class="pl" d="M76,46 L160,16 L244,46 Z"/>
    <path d="M98,42 L160,22 L222,42" stroke-width=".7"/>
    <rect class="pl" x="78" y="46" width="164" height="12"/>
    <rect class="pl" x="80" y="58" width="160" height="12"/>
    <path d="${tri}" stroke-width=".8"/>
    ${cols}
    <path d="M78,148 H242 M72,155 H248 M66,162 H254"/>
    <path d="M8,166 H312"/>
    <path d="M20,166 C30,150 44,146 52,150 M268,166 C276,152 292,148 300,152" stroke-width=".8"/>`;
}

module.exports = D;
