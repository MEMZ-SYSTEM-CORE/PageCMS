const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src/content/music');
const output = path.join(__dirname, '..', 'public/music-data.js');

let tracks = [];
if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const content = fs.readFileSync(path.join(dir, f), 'utf-8');
    const m = content.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const fm = m[1];
    const title = (fm.match(/title:\s*(.+)/)?.[1] || '').replace(/^['"]|['"]$/g, '').trim();
    const artist = (fm.match(/artist:\s*(.+)/)?.[1] || '').replace(/^['"]|['"]$/g, '').trim();
    const file = (fm.match(/file:\s*(.+)/)?.[1] || '').replace(/^['"]|['"]$/g, '').trim();
    const cover = (fm.match(/cover:\s*(.+)/)?.[1] || '').replace(/^['"]|['"]$/g, '').trim();
    if (file && title) tracks.push({ title, artist, file, cover });
  }
}

const js = 'window.__MUSIC_TRACKS = ' + JSON.stringify(tracks) + ';';
fs.writeFileSync(output, js, 'utf-8');
console.log('[music] Generated public/music-data.js with ' + tracks.length + ' tracks');
