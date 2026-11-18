// Insère les dessins des régions dans l'app (entre les marqueurs REGIONS:START / REGIONS:END de index.html)
const fs = require('fs');
const D = require('./dessins.js');
const APP = __dirname + '/../../index.html';
const symbols = Object.entries(D).map(([k, v]) => `  <symbol id="r-${k}" viewBox="0 0 320 180">${v.replace(/\s*\n\s*/g, ' ').trim()}</symbol>`).join('\n');
let html = fs.readFileSync(APP, 'utf8');
html = html.replace(/<!-- REGIONS:START -->[\s\S]*?<!-- REGIONS:END -->/, `<!-- REGIONS:START -->\n${symbols}\n  <!-- REGIONS:END -->`);
fs.writeFileSync(APP, html);
console.log('ok', Object.keys(D).length, 'visuels');
