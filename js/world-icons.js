'use strict';
// Stylized world select icons (Survivor.io-style diorama cards) — no enemy/boss sprites.

(function () {
  const TAU = Math.PI * 2;

  function roundRect(g, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  function lighten(hex, amt) {
    if (!hex || hex[0] !== '#') return hex || '#88c8ff';
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, ((n >> 16) & 255) + Math.round(255 * amt));
    const gr = Math.min(255, ((n >> 8) & 255) + Math.round(255 * amt));
    const b = Math.min(255, (n & 255) + Math.round(255 * amt));
    return '#' + ((1 << 24) + (r << 16) + (gr << 8) + b).toString(16).slice(1);
  }

  function hill(g, x, y, w, h, col) {
    g.fillStyle = col;
    g.beginPath();
    g.moveTo(x - w * 0.1, y);
    g.quadraticCurveTo(x + w * 0.35, y - h, x + w, y);
    g.lineTo(x - w * 0.1, y);
    g.fill();
  }

  function sun(g, x, y, r, col) {
    g.fillStyle = col || '#ffe08a';
    g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const a = i * TAU / 8;
      g.beginPath();
      g.moveTo(x + Math.cos(a) * r * 1.15, y + Math.sin(a) * r * 1.15);
      g.lineTo(x + Math.cos(a) * r * 1.55, y + Math.sin(a) * r * 1.55);
      g.stroke();
    }
  }

  function tree(g, x, y, h, leaf, trunk) {
    g.fillStyle = trunk || '#6a4020';
    g.fillRect(x - h * 0.08, y - h * 0.35, h * 0.16, h * 0.35);
    g.fillStyle = leaf || '#3f9a36';
    g.beginPath();
    g.moveTo(x, y - h);
    g.lineTo(x + h * 0.42, y - h * 0.28);
    g.lineTo(x - h * 0.42, y - h * 0.28);
    g.closePath();
    g.fill();
  }

  function peak(g, x, y, w, h, col, snow) {
    g.fillStyle = col;
    g.beginPath();
    g.moveTo(x, y - h);
    g.lineTo(x + w, y);
    g.lineTo(x - w, y);
    g.closePath();
    g.fill();
    if (snow) {
      g.fillStyle = snow;
      g.beginPath();
      g.moveTo(x, y - h);
      g.lineTo(x + w * 0.35, y - h * 0.55);
      g.lineTo(x - w * 0.35, y - h * 0.55);
      g.closePath();
      g.fill();
    }
  }

  const PAINTERS = {
    grass(g, cx, cy, r, th) {
      hill(g, cx - r * 0.55, cy, r * 1.5, r * 0.55, th.tile2 || '#6ab838');
      hill(g, cx + r * 0.35, cy, r * 1.1, r * 0.42, th.tile1 || '#8ed44e');
      tree(g, cx - r * 0.35, cy, r * 0.95, '#4caf3a', '#5a3a18');
      tree(g, cx + r * 0.42, cy, r * 0.72, '#62c455', '#5a3a18');
      sun(g, cx + r * 0.55, cy - r * 0.95, r * 0.22, th.accent || '#ffe08a');
    },
    citrus(g, cx, cy, r, th) {
      g.fillStyle = '#4aa3df';
      g.fillRect(cx - r * 1.1, cy - r * 0.12, r * 2.2, r * 0.2);
      g.fillStyle = th.tile1 || '#f5e46a';
      g.beginPath();
      g.moveTo(cx - r * 1.1, cy - r * 0.12);
      g.quadraticCurveTo(cx, cy - r * 0.42, cx + r * 1.1, cy - r * 0.12);
      g.fill();
      g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const wx = cx - r * 0.7 + i * r * 0.55;
        g.beginPath(); g.arc(wx, cy - r * 0.08, r * 0.12, 0, Math.PI, true); g.stroke();
      }
      tree(g, cx + r * 0.15, cy - r * 0.1, r * 0.7, '#3f9a36', '#8a5a28');
      g.fillStyle = '#ff9030';
      g.beginPath(); g.arc(cx - r * 0.35, cy - r * 0.22, r * 0.1, 0, TAU); g.fill();
      sun(g, cx + r * 0.62, cy - r * 0.88, r * 0.18, '#fff0a0');
    },
    forest(g, cx, cy, r, th) {
      tree(g, cx - r * 0.55, cy, r * 1.05, '#3f9a36', '#4a3018');
      tree(g, cx, cy, r * 1.2, '#52b848', '#4a3018');
      tree(g, cx + r * 0.5, cy, r * 0.9, '#44a838', '#4a3018');
      g.fillStyle = '#ff6060';
      g.beginPath(); g.arc(cx - r * 0.1, cy - r * 0.55, r * 0.09, 0, TAU); g.fill();
      g.fillStyle = '#ffd24a';
      g.beginPath(); g.arc(cx + r * 0.2, cy - r * 0.42, r * 0.08, 0, TAU); g.fill();
    },
    glacier(g, cx, cy, r, th) {
      peak(g, cx, cy, r * 0.55, r * 0.95, '#8ad8d0', '#eefaf8');
      peak(g, cx - r * 0.45, cy, r * 0.4, r * 0.7, '#6ac8c0', '#e8f8f4');
      peak(g, cx + r * 0.42, cy, r * 0.38, r * 0.62, '#7ad0c8', '#eefaf8');
      g.fillStyle = 'rgba(255,255,255,0.55)';
      for (let i = 0; i < 6; i++) {
        g.beginPath();
        g.arc(cx - r * 0.7 + i * r * 0.28, cy - r * 0.75 - (i % 2) * r * 0.08, 2.5, 0, TAU);
        g.fill();
      }
    },
    circo(g, cx, cy, r, th) {
      g.fillStyle = '#fff';
      g.beginPath(); g.arc(cx, cy - r * 0.35, r * 0.62, Math.PI, 0); g.fill();
      const stripes = ['#e8342b', '#ffd24a', '#4aa3df', '#5fbf52'];
      for (let i = 0; i < 4; i++) {
        g.fillStyle = stripes[i];
        g.beginPath();
        g.moveTo(cx, cy - r * 0.35);
        g.arc(cx, cy - r * 0.35, r * 0.62, Math.PI + i * Math.PI / 4, Math.PI + (i + 1) * Math.PI / 4);
        g.closePath();
        g.fill();
      }
      g.fillStyle = th.accent || '#ffd838';
      g.fillRect(cx - r * 0.55, cy - r * 0.05, r * 1.1, r * 0.12);
      g.fillStyle = '#c82e20';
      g.beginPath(); g.arc(cx, cy - r * 0.35, r * 0.14, 0, TAU); g.fill();
    },
    autumn(g, cx, cy, r, th) {
      hill(g, cx, cy, r * 1.3, r * 0.45, th.tile2 || '#d08028');
      tree(g, cx - r * 0.2, cy, r * 0.95, '#e87820', '#5a3818');
      tree(g, cx + r * 0.45, cy, r * 0.75, '#c86018', '#5a3818');
      const leafC = ['#ff9030', '#ffd24a', '#e85030'];
      for (let i = 0; i < 8; i++) {
        g.fillStyle = leafC[i % 3];
        g.beginPath();
        g.ellipse(cx - r * 0.6 + i * r * 0.17, cy - r * 0.55 - (i % 3) * r * 0.06, r * 0.05, r * 0.08, i * 0.4, 0, TAU);
        g.fill();
      }
    },
    swamp(g, cx, cy, r, th) {
      g.fillStyle = '#3a7828';
      g.fillRect(cx - r * 1.05, cy - r * 0.08, r * 2.1, r * 0.12);
      g.fillStyle = '#5a9838';
      for (let i = 0; i < 4; i++) {
        g.beginPath();
        g.ellipse(cx - r * 0.6 + i * r * 0.38, cy - r * 0.1, r * 0.22, r * 0.08, 0, 0, TAU);
        g.fill();
      }
      g.fillStyle = '#2a5820';
      g.fillRect(cx - r * 0.08, cy - r * 0.55, r * 0.16, r * 0.48);
      g.fillStyle = '#4a9038';
      g.beginPath(); g.arc(cx, cy - r * 0.62, r * 0.28, 0, TAU); g.fill();
      g.fillStyle = 'rgba(120,200,80,0.35)';
      g.beginPath(); g.ellipse(cx + r * 0.35, cy - r * 0.05, r * 0.35, r * 0.06, 0, 0, TAU); g.fill();
    },
    sky(g, cx, cy, r, th) {
      g.fillStyle = 'rgba(255,255,255,0.85)';
      g.beginPath(); g.ellipse(cx - r * 0.4, cy - r * 0.72, r * 0.35, r * 0.14, 0, 0, TAU); g.fill();
      g.beginPath(); g.ellipse(cx + r * 0.25, cy - r * 0.82, r * 0.42, r * 0.16, 0, 0, TAU); g.fill();
      g.fillStyle = th.tile1 || '#c8eeff';
      g.beginPath();
      g.moveTo(cx - r * 0.7, cy);
      g.quadraticCurveTo(cx, cy - r * 0.55, cx + r * 0.7, cy);
      g.lineTo(cx + r * 0.55, cy + r * 0.08);
      g.lineTo(cx - r * 0.55, cy + r * 0.08);
      g.closePath();
      g.fill();
      g.fillStyle = '#5fbf52';
      g.beginPath(); g.arc(cx, cy - r * 0.18, r * 0.12, 0, TAU); g.fill();
      tree(g, cx + r * 0.15, cy - r * 0.05, r * 0.45, '#4caf3a', '#6a5030');
    },
    crystal(g, cx, cy, r, th) {
      const cols = [th.tint || '#b06ff0', '#d8b0ff', '#9040e0'];
      for (let i = 0; i < 3; i++) {
        const ox = (i - 1) * r * 0.38;
        g.fillStyle = cols[i];
        g.beginPath();
        g.moveTo(cx + ox, cy - r * 0.85);
        g.lineTo(cx + ox + r * 0.22, cy);
        g.lineTo(cx + ox - r * 0.22, cy);
        g.closePath();
        g.fill();
        g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 2; g.stroke();
      }
      g.fillStyle = 'rgba(255,255,255,0.2)';
      g.fillRect(cx - r * 0.9, cy - r * 0.05, r * 1.8, r * 0.06);
    },
    volcano(g, cx, cy, r, th) {
      g.fillStyle = '#5a3828';
      g.beginPath();
      g.moveTo(cx, cy - r * 0.9);
      g.lineTo(cx + r * 0.75, cy);
      g.lineTo(cx - r * 0.75, cy);
      g.closePath();
      g.fill();
      g.fillStyle = '#ff6020';
      g.beginPath(); g.arc(cx, cy - r * 0.82, r * 0.16, 0, TAU); g.fill();
      g.fillStyle = '#ffd24a';
      for (let i = 0; i < 5; i++) {
        g.beginPath();
        g.arc(cx - r * 0.08 + (Math.random() - 0.5) * r * 0.1, cy - r * 0.95 - i * r * 0.08, r * 0.05, 0, TAU);
        g.fill();
      }
    },
    dirt(g, cx, cy, r, th) {
      g.fillStyle = '#5a4028';
      g.beginPath(); g.arc(cx, cy - r * 0.25, r * 0.75, Math.PI, 0); g.fill();
      g.fillStyle = '#3a2818';
      for (let i = 0; i < 5; i++) {
        const x = cx - r * 0.55 + i * r * 0.28;
        g.beginPath(); g.moveTo(x, cy - r * 0.55); g.lineTo(x + r * 0.06, cy - r * 0.2); g.lineTo(x - r * 0.06, cy - r * 0.2); g.fill();
      }
      g.fillStyle = th.accent || '#f0a838';
      g.beginPath(); g.arc(cx + r * 0.35, cy - r * 0.35, r * 0.08, 0, TAU); g.fill();
    },
    neon(g, cx, cy, r, th) {
      g.fillStyle = th.tint || '#ff40b0';
      g.fillRect(cx - r * 0.8, cy - r * 0.35, r * 1.6, r * 0.08);
      g.fillRect(cx - r * 0.05, cy - r * 0.75, r * 0.1, r * 0.45);
      g.shadowColor = th.tint || '#ff40b0'; g.shadowBlur = 12;
      g.fillStyle = '#fff';
      g.beginPath(); g.arc(cx, cy - r * 0.55, r * 0.18, 0, TAU); g.fill();
      g.shadowBlur = 0;
      hill(g, cx, cy, r * 1.2, r * 0.35, th.tile2 || '#ffd878');
    },
    factory(g, cx, cy, r, th) {
      g.fillStyle = '#8892a0';
      g.fillRect(cx - r * 0.55, cy - r * 0.55, r * 0.45, r * 0.55);
      g.fillRect(cx + r * 0.05, cy - r * 0.42, r * 0.38, r * 0.42);
      g.fillStyle = '#6a7480';
      g.fillRect(cx - r * 0.42, cy - r * 0.68, r * 0.12, r * 0.2);
      g.fillRect(cx + r * 0.18, cy - r * 0.58, r * 0.1, r * 0.18);
      g.fillStyle = 'rgba(200,200,210,0.5)';
      for (let i = 0; i < 3; i++) {
        g.beginPath(); g.arc(cx - r * 0.36 + i * 0.01, cy - r * 0.78 - i * r * 0.1, r * 0.08, 0, TAU); g.fill();
      }
    },
    toxic(g, cx, cy, r, th) {
      g.fillStyle = th.tint || '#40c820';
      g.beginPath(); g.ellipse(cx, cy - r * 0.08, r * 0.85, r * 0.18, 0, 0, TAU); g.fill();
      g.fillStyle = '#88f060';
      g.beginPath(); g.arc(cx - r * 0.25, cy - r * 0.12, r * 0.14, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(60,120,30,0.5)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(cx + r * 0.1, cy - r * 0.2); g.quadraticCurveTo(cx + r * 0.35, cy - r * 0.55, cx + r * 0.2, cy - r * 0.75); g.stroke();
    },
    moon(g, cx, cy, r, th) {
      g.fillStyle = '#d0d8e8';
      g.beginPath(); g.arc(cx + r * 0.15, cy - r * 0.45, r * 0.42, 0, TAU); g.fill();
      g.fillStyle = 'rgba(180,190,210,0.45)';
      g.beginPath(); g.arc(cx + r * 0.28, cy - r * 0.5, r * 0.1, 0, TAU); g.fill();
      g.beginPath(); g.arc(cx + r * 0.05, cy - r * 0.35, r * 0.07, 0, TAU); g.fill();
      peak(g, cx - r * 0.35, cy, r * 0.35, r * 0.5, '#98a8b8', '#e8ecf4');
    },
    desert(g, cx, cy, r, th) {
      for (let i = 0; i < 3; i++) {
        hill(g, cx - r * 0.4 + i * r * 0.35, cy, r * 0.85, r * (0.28 + i * 0.06), i % 2 ? th.tile1 : th.tile2);
      }
      sun(g, cx + r * 0.55, cy - r * 0.82, r * 0.2, '#ffe08a');
      g.fillStyle = th.tint || '#f0a020';
      g.beginPath();
      g.moveTo(cx - r * 0.15, cy - r * 0.15);
      g.lineTo(cx + r * 0.05, cy - r * 0.42);
      g.lineTo(cx + r * 0.22, cy - r * 0.15);
      g.closePath(); g.fill();
    },
    ice(g, cx, cy, r, th) {
      peak(g, cx, cy, r * 0.5, r * 0.88, '#a8e8f8', '#fff');
      g.fillStyle = 'rgba(200,240,255,0.65)';
      g.fillRect(cx - r * 0.9, cy - r * 0.04, r * 1.8, r * 0.08);
    },
    storm(g, cx, cy, r, th) {
      g.fillStyle = '#607090';
      g.beginPath(); g.ellipse(cx - r * 0.3, cy - r * 0.78, r * 0.45, r * 0.18, 0, 0, TAU); g.fill();
      g.beginPath(); g.ellipse(cx + r * 0.2, cy - r * 0.85, r * 0.5, r * 0.2, 0, 0, TAU); g.fill();
      g.fillStyle = '#ffd24a';
      g.beginPath();
      g.moveTo(cx, cy - r * 0.55);
      g.lineTo(cx + r * 0.12, cy - r * 0.2);
      g.lineTo(cx + r * 0.02, cy - r * 0.2);
      g.lineTo(cx + r * 0.15, cy + r * 0.02);
      g.lineTo(cx - r * 0.08, cy - r * 0.25);
      g.lineTo(cx + r * 0.02, cy - r * 0.25);
      g.closePath();
      g.fill();
    },
    rift(g, cx, cy, r, th) {
      g.strokeStyle = th.tint || '#9040e0';
      g.lineWidth = 4;
      g.beginPath();
      g.ellipse(cx, cy - r * 0.25, r * 0.35, r * 0.65, 0, 0, TAU);
      g.stroke();
      g.fillStyle = 'rgba(180,100,255,0.35)';
      g.beginPath(); g.ellipse(cx, cy - r * 0.25, r * 0.22, r * 0.5, 0, 0, TAU); g.fill();
      for (let i = 0; i < 4; i++) {
        const a = i * TAU / 4;
        g.fillStyle = '#fff';
        g.beginPath(); g.arc(cx + Math.cos(a) * r * 0.5, cy - r * 0.25 + Math.sin(a) * r * 0.35, 3, 0, TAU); g.fill();
      }
    },
    jungle(g, cx, cy, r, th) {
      tree(g, cx - r * 0.4, cy, r * 0.85, th.tint || '#40c820', '#4a3018');
      tree(g, cx + r * 0.25, cy, r * 1.0, '#50b838', '#4a3018');
      g.fillStyle = 'rgba(180,80,220,0.55)';
      for (let i = 0; i < 4; i++) {
        g.beginPath(); g.arc(cx - r * 0.2 + i * r * 0.15, cy - r * 0.35, r * 0.06, 0, TAU); g.fill();
      }
    },
    hive(g, cx, cy, r, th) {
      g.fillStyle = th.tint || '#e8a030';
      g.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = i * TAU / 6 - Math.PI / 2;
        const px = cx + Math.cos(a) * r * 0.42;
        const py = cy - r * 0.35 + Math.sin(a) * r * 0.42;
        i === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
      }
      g.closePath();
      g.fill();
      g.strokeStyle = 'rgba(80,50,10,0.45)'; g.lineWidth = 2; g.stroke();
      g.fillStyle = '#3a2810';
      g.fillRect(cx - r * 0.08, cy - r * 0.05, r * 0.16, r * 0.35);
    },
    final(g, cx, cy, r, th) {
      g.fillStyle = '#2a1840';
      g.beginPath(); g.arc(cx, cy - r * 0.35, r * 0.55, 0, TAU); g.fill();
      g.strokeStyle = th.tint || '#ff3b5c';
      g.lineWidth = 4;
      g.beginPath(); g.arc(cx, cy - r * 0.35, r * 0.62, 0, TAU); g.stroke();
      g.fillStyle = '#ff3b5c';
      g.font = 'bold ' + Math.round(r * 0.35) + 'px sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('!', cx, cy - r * 0.33);
    },
    glitch(g, cx, cy, r, th) {
      g.fillStyle = th.tint || '#40f0c0';
      g.fillRect(cx - r * 0.6, cy - r * 0.45, r * 0.5, r * 0.35);
      g.fillStyle = '#ff40a0';
      g.fillRect(cx - r * 0.05, cy - r * 0.55, r * 0.45, r * 0.4);
      g.fillStyle = '#ffe040';
      g.fillRect(cx + r * 0.2, cy - r * 0.35, r * 0.35, r * 0.3);
    },
    coral(g, cx, cy, r, th) {
      g.fillStyle = th.tint || '#ff6080';
      for (let i = 0; i < 4; i++) {
        const x = cx - r * 0.45 + i * r * 0.28;
        g.beginPath();
        g.moveTo(x, cy);
        g.quadraticCurveTo(x + r * 0.05, cy - r * 0.45, x + r * 0.12, cy - r * 0.15);
        g.quadraticCurveTo(x + r * 0.18, cy - r * 0.5, x + r * 0.22, cy);
        g.fill();
      }
      g.fillStyle = '#4aa3df';
      g.fillRect(cx - r * 0.95, cy - r * 0.06, r * 1.9, r * 0.08);
    },
    dream(g, cx, cy, r, th) {
      g.fillStyle = 'rgba(200,160,255,0.45)';
      g.beginPath(); g.arc(cx, cy - r * 0.35, r * 0.55, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 2;
      g.beginPath(); g.arc(cx, cy - r * 0.35, r * 0.62, 0, TAU); g.stroke();
      for (let i = 0; i < 5; i++) {
        g.fillStyle = '#fff';
        g.beginPath(); g.arc(cx - r * 0.35 + i * r * 0.18, cy - r * 0.55 - (i % 2) * r * 0.12, 2.5, 0, TAU); g.fill();
      }
    },
    chaos(g, cx, cy, r, th) {
      PAINTERS.final(g, cx, cy, r, th);
      g.strokeStyle = th.tint || '#ffd24a';
      g.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        const a = i * TAU / 6;
        g.beginPath();
        g.moveTo(cx, cy - r * 0.35);
        g.lineTo(cx + Math.cos(a) * r * 0.75, cy - r * 0.35 + Math.sin(a) * r * 0.75);
        g.stroke();
      }
    },
    plains(g, cx, cy, r, th) {
      hill(g, cx, cy, r * 1.2, r * 0.3, th.tile2 || th.bg);
      g.strokeStyle = th.tint || '#888';
      g.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        g.beginPath();
        g.moveTo(cx - r * 0.7 + i * r * 0.22, cy - r * 0.05);
        g.lineTo(cx - r * 0.55 + i * r * 0.22, cy - r * 0.35);
        g.stroke();
      }
    },
    cave(g, cx, cy, r, th) {
      g.fillStyle = '#4a3828';
      g.beginPath(); g.arc(cx, cy - r * 0.15, r * 0.7, Math.PI, 0); g.fill();
      g.fillStyle = '#1a1410';
      g.beginPath(); g.arc(cx, cy - r * 0.15, r * 0.38, Math.PI, 0); g.fill();
      g.fillStyle = th.tint || '#ffd24a';
      g.beginPath(); g.arc(cx, cy - r * 0.2, r * 0.08, 0, TAU); g.fill();
    },
    candy(g, cx, cy, r, th) {
      g.fillStyle = '#ff80c0';
      g.beginPath(); g.arc(cx - r * 0.25, cy - r * 0.35, r * 0.22, 0, TAU); g.fill();
      g.fillStyle = '#80e8ff';
      g.beginPath(); g.arc(cx + r * 0.2, cy - r * 0.42, r * 0.18, 0, TAU); g.fill();
      g.fillStyle = '#ffe080';
      g.fillRect(cx - r * 0.5, cy - r * 0.08, r * 1.0, r * 0.1);
    },
    solar(g, cx, cy, r, th) {
      sun(g, cx, cy - r * 0.45, r * 0.38, th.tint || '#ff9030');
      g.strokeStyle = 'rgba(255,200,80,0.45)'; g.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const a = i * TAU / 8;
        g.beginPath();
        g.moveTo(cx + Math.cos(a) * r * 0.45, cy - r * 0.45 + Math.sin(a) * r * 0.45);
        g.lineTo(cx + Math.cos(a) * r * 0.72, cy - r * 0.45 + Math.sin(a) * r * 0.72);
        g.stroke();
      }
    },
    shadow(g, cx, cy, r, th) {
      g.fillStyle = '#2a2038';
      peak(g, cx, cy, r * 0.55, r * 0.75, '#3a3048', '#4a4058');
      g.fillStyle = 'rgba(0,0,0,0.35)';
      g.fillRect(cx - r * 0.9, cy - r * 0.04, r * 1.8, r * 0.1);
    },
    mirror(g, cx, cy, r, th) {
      g.strokeStyle = th.tint || '#80d8ff';
      g.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        g.strokeRect(cx - r * 0.55 + i * r * 0.18, cy - r * 0.65 + i * r * 0.08, r * 0.35, r * 0.55);
      }
    },
    plasma(g, cx, cy, r, th) {
      const gr = g.createRadialGradient(cx, cy - r * 0.35, 0, cx, cy - r * 0.35, r * 0.5);
      gr.addColorStop(0, '#fff');
      gr.addColorStop(0.4, th.tint || '#ff60c0');
      gr.addColorStop(1, 'rgba(255,96,192,0)');
      g.fillStyle = gr;
      g.beginPath(); g.arc(cx, cy - r * 0.35, r * 0.5, 0, TAU); g.fill();
    },
    haunted(g, cx, cy, r, th) {
      g.fillStyle = '#e8e0f0';
      g.beginPath();
      g.arc(cx, cy - r * 0.38, r * 0.32, Math.PI, 0);
      g.lineTo(cx + r * 0.32, cy - r * 0.05);
      g.quadraticCurveTo(cx + r * 0.16, cy + r * 0.05, cx, cy - r * 0.02);
      g.quadraticCurveTo(cx - r * 0.16, cy + r * 0.05, cx - r * 0.32, cy - r * 0.05);
      g.closePath();
      g.fill();
      g.fillStyle = '#302040';
      g.beginPath(); g.arc(cx - r * 0.1, cy - r * 0.38, r * 0.05, 0, TAU); g.fill();
      g.beginPath(); g.arc(cx + r * 0.1, cy - r * 0.38, r * 0.05, 0, TAU); g.fill();
    },
    bio(g, cx, cy, r, th) {
      g.fillStyle = th.tint || '#60d030';
      g.beginPath(); g.ellipse(cx, cy - r * 0.3, r * 0.28, r * 0.42, 0, 0, TAU); g.fill();
      g.strokeStyle = '#408020'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(cx, cy - r * 0.65); g.lineTo(cx, cy - r * 0.05); g.stroke();
      g.beginPath(); g.arc(cx, cy - r * 0.45, r * 0.2, -0.8, 0.8); g.stroke();
    },
    meteor(g, cx, cy, r, th) {
      g.fillStyle = '#6a5a48';
      g.beginPath(); g.arc(cx + r * 0.2, cy - r * 0.55, r * 0.18, 0, TAU); g.fill();
      g.strokeStyle = '#ff8040'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(cx + r * 0.2, cy - r * 0.55); g.lineTo(cx - r * 0.45, cy - r * 0.95); g.stroke();
      hill(g, cx, cy, r * 1.1, r * 0.32, th.tile2 || th.bg);
    },
    obsidian(g, cx, cy, r, th) {
      g.fillStyle = '#1a1828';
      g.beginPath();
      g.moveTo(cx, cy - r * 0.8);
      g.lineTo(cx + r * 0.4, cy - r * 0.2);
      g.lineTo(cx + r * 0.15, cy);
      g.lineTo(cx - r * 0.15, cy);
      g.lineTo(cx - r * 0.4, cy - r * 0.2);
      g.closePath();
      g.fill();
      g.strokeStyle = th.tint || '#6080c0';
      g.lineWidth = 2; g.stroke();
    },
    void(g, cx, cy, r, th) {
      g.fillStyle = '#1a1030';
      g.beginPath(); g.arc(cx, cy - r * 0.35, r * 0.48, 0, TAU); g.fill();
      g.strokeStyle = th.tint || '#b06ff0';
      g.lineWidth = 3; g.stroke();
      for (let i = 0; i < 5; i++) {
        g.fillStyle = th.accent || '#d8b0ff';
        g.beginPath(); g.arc(cx - r * 0.3 + i * r * 0.15, cy - r * 0.55, 3, 0, TAU); g.fill();
      }
    },
    clock(g, cx, cy, r, th) {
      g.fillStyle = '#c8b090';
      g.beginPath(); g.arc(cx, cy - r * 0.35, r * 0.42, 0, TAU); g.fill();
      g.strokeStyle = '#5a4028'; g.lineWidth = 3; g.stroke();
      g.strokeStyle = '#3a2818'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(cx, cy - r * 0.35); g.lineTo(cx, cy - r * 0.58); g.stroke();
      g.beginPath(); g.moveTo(cx, cy - r * 0.35); g.lineTo(cx + r * 0.18, cy - r * 0.28); g.stroke();
    },
    crater(g, cx, cy, r, th) {
      hill(g, cx + r * 0.1, cy, r * 1.1, r * 0.38, th.tile2 || th.bg);
      g.fillStyle = '#5a5048';
      g.beginPath(); g.ellipse(cx - r * 0.15, cy - r * 0.08, r * 0.42, r * 0.14, 0, 0, TAU); g.fill();
      g.fillStyle = '#3a3430';
      g.beginPath(); g.ellipse(cx - r * 0.15, cy - r * 0.08, r * 0.25, r * 0.08, 0, 0, TAU); g.fill();
    },
    abyss(g, cx, cy, r, th) {
      g.fillStyle = '#102838';
      g.fillRect(cx - r * 0.8, cy - r * 0.15, r * 1.6, r * 0.2);
      g.fillStyle = th.tint || '#30b8a0';
      for (let i = 0; i < 3; i++) {
        g.beginPath();
        g.moveTo(cx - r * 0.5 + i * r * 0.35, cy - r * 0.15);
        g.quadraticCurveTo(cx - r * 0.35 + i * r * 0.35, cy - r * 0.55, cx - r * 0.2 + i * r * 0.35, cy - r * 0.15);
        g.fill();
      }
    },
    dunes(g, cx, cy, r, th) {
      PAINTERS.desert(g, cx, cy, r, th);
    },
    marsh(g, cx, cy, r, th) {
      PAINTERS.swamp(g, cx, cy, r, th);
    },
    training(g, cx, cy, r) {
      g.strokeStyle = '#4ad0c0';
      g.lineWidth = 4;
      g.beginPath(); g.arc(cx, cy - r * 0.35, r * 0.45, 0, TAU); g.stroke();
      g.fillStyle = '#4ad0c0';
      g.beginPath(); g.moveTo(cx, cy - r * 0.55); g.lineTo(cx + r * 0.12, cy - r * 0.22); g.lineTo(cx - r * 0.12, cy - r * 0.22); g.closePath(); g.fill();
    },
    bossrush(g, cx, cy, r) {
      g.fillStyle = '#3d2878';
      g.beginPath(); g.arc(cx, cy - r * 0.35, r * 0.5, 0, TAU); g.fill();
      g.strokeStyle = '#b06ff0'; g.lineWidth = 4; g.stroke();
      g.fillStyle = '#ffd24a';
      g.font = 'bold ' + Math.round(r * 0.42) + 'px sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('♛', cx, cy - r * 0.33);
    },
  };

  const BASE_IDS = {
    grass: 'grass', citrus: 'citrus', forest: 'forest', glacier: 'glacier', circo: 'circo',
    autumn: 'autumn', swamp: 'swamp', sky: 'sky', crystal: 'crystal', volcano: 'volcano', dirt: 'dirt',
  };

  function archetype(w, wi) {
    if (wi < 11 && w.id && BASE_IDS[w.id]) return w.id;
    const n = (w.name || '').toUpperCase();
    const keys = [
      ['FINAL SWARM', 'final'], ['CHAOS', 'chaos'], ['HIVE', 'hive'], ['GLITCH', 'glitch'],
      ['NEON', 'neon'], ['RUST', 'factory'], ['FACTORY', 'factory'], ['FOUNDRY', 'factory'],
      ['TOXIC', 'toxic'], ['MOON', 'moon'], ['CRATER', 'crater'], ['ABYSS', 'abyss'],
      ['SAND', 'desert'], ['DESERT', 'desert'], ['BONE', 'desert'], ['HAUNTED', 'haunted'],
      ['BIO', 'bio'], ['QUANTUM', 'rift'], ['RIFT', 'rift'], ['WARP', 'rift'],
      ['MAGMA', 'volcano'], ['EMBER', 'volcano'], ['VOLCANO', 'volcano'],
      ['FROZEN', 'ice'], ['CRYO', 'ice'], ['FROST', 'ice'],
      ['CANDY', 'candy'], ['THUNDER', 'storm'], ['STORM', 'storm'],
      ['VOID', 'void'], ['CLOCK', 'clock'], ['PLASMA', 'plasma'],
      ['SHADOW', 'shadow'], ['SOLAR', 'solar'], ['FLARE', 'solar'],
      ['MIRROR', 'mirror'], ['GRAVITY', 'rift'], ['SPORE', 'jungle'], ['JUNGLE', 'jungle'],
      ['METEOR', 'meteor'], ['ECHO', 'cave'], ['CAVERN', 'cave'],
      ['STATIC', 'plains'], ['PRISM', 'crystal'], ['CRYSTAL', 'crystal'],
      ['CORAL', 'coral'], ['STAR', 'solar'], ['DREAM', 'dream'],
      ['OBSIDIAN', 'obsidian'], ['MARSH', 'marsh'], ['DUNES', 'dunes'],
    ];
    for (const [k, a] of keys) if (n.includes(k)) return a;
    return ['dunes', 'factory', 'marsh', 'storm', 'rift'][(wi - 11) % 5];
  }

  function drawWorldIcon(g, world, worldIndex, sz, opts) {
    opts = opts || {};
    const th = world.theme || {};
    const pad = sz * 0.07;
    const ix = pad; const iy = pad; const iw = sz - pad * 2; const ih = sz - pad * 2;
    const rad = sz * 0.14;

    g.clearRect(0, 0, sz, sz);

    g.save();
    roundRect(g, ix + 4, iy + 6, iw, ih, rad);
    g.fillStyle = 'rgba(0,0,0,0.38)';
    g.fill();
    g.restore();

    g.save();
    roundRect(g, ix, iy, iw, ih, rad);
    g.clip();

    const skyTop = lighten(th.bg || th.tile2 || '#5a88c8', 0.12);
    const skyBot = th.tile1 || th.tile2 || '#b8d8f8';
    const sky = g.createLinearGradient(ix, iy, ix, iy + ih * 0.62);
    sky.addColorStop(0, skyTop);
    sky.addColorStop(1, skyBot);
    g.fillStyle = sky;
    g.fillRect(ix, iy, iw, ih);

    const groundY = iy + ih * 0.58;
    g.fillStyle = th.tile2 || th.bg || '#4a7830';
    g.fillRect(ix, groundY, iw, ih - (groundY - iy));
    g.fillStyle = th.tile1 || th.tile2 || '#6a9838';
    g.fillRect(ix, groundY, iw, ih * 0.07);

    const type = opts.type || archetype(world, worldIndex);
    const painter = PAINTERS[type] || PAINTERS.grass;
    const cx = ix + iw / 2;
    const cy = groundY - ih * 0.02;
    const sceneR = ih * 0.42;
    painter(g, cx, cy, sceneR, th, world, worldIndex);

    if (opts.showNum !== false) {
      const badgeR = sz * 0.1;
      const bx = ix + badgeR + 8; const by = iy + badgeR + 8;
      g.fillStyle = 'rgba(12,16,24,0.82)';
      g.beginPath(); g.arc(bx, by, badgeR, 0, TAU); g.fill();
      g.strokeStyle = th.accent || th.tint || '#ffd24a';
      g.lineWidth = 2.5; g.stroke();
      g.fillStyle = '#fff';
      g.font = '800 ' + Math.round(badgeR * 1.05) + 'px Baloo 2,sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(String(worldIndex + 1), bx, by + 1);
    }

    const gloss = g.createLinearGradient(ix, iy, ix, iy + ih * 0.42);
    gloss.addColorStop(0, 'rgba(255,255,255,0.24)');
    gloss.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gloss;
    g.fillRect(ix, iy, iw, ih * 0.42);

    if (opts.locked) {
      g.fillStyle = 'rgba(8,10,16,0.62)';
      g.fillRect(ix, iy, iw, ih);
      g.fillStyle = '#fff';
      g.font = 'bold ' + Math.round(sz * 0.14) + 'px sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('?', ix + iw / 2, iy + ih / 2);
    }

    g.restore();

    g.strokeStyle = th.accent || th.tint || 'rgba(255,255,255,0.4)';
    g.lineWidth = 3;
    roundRect(g, ix, iy, iw, ih, rad);
    g.stroke();
  }

  window.WORLD_ICON_VER = 'v1';
  window.drawWorldIcon = drawWorldIcon;
  window.worldIconArchetype = archetype;
})();
