'use strict';
// Vector-style VFX for player skill zones and persistent auras (replaces flat dashed circles).

(function () {
  function hexRgb(hex) {
    const h = (hex || '#888').replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16) || 0x888888;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function rgba(hex, a) {
    const c = hexRgb(hex);
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + a + ')';
  }

  function inferZoneVfx(z) {
    if (z.vfx) return z.vfx;
    const c = (z.col || '').toLowerCase();
    if (z.slow && (c.indexOf('bfe') >= 0 || c.indexOf('c8e8') >= 0 || c.indexOf('b8d8') >= 0)) return 'frost';
    if (c.indexOf('ff50') >= 0 || c.indexOf('ff6a') >= 0 || c.indexOf('ff8a') >= 0 || c.indexOf('ff6020') >= 0) return 'ember';
    if (c.indexOf('50c8') >= 0 || c.indexOf('60d0') >= 0 || c.indexOf('70e0') >= 0 || c.indexOf('40a8') >= 0 || c.indexOf('80ff60') >= 0) return 'spore';
    if (c.indexOf('ff40') >= 0 || c.indexOf('ff60') >= 0 || c.indexOf('80f0') >= 0) return 'neon';
    if (c.indexOf('b8d8') >= 0 || c.indexOf('8040') >= 0 || c.indexOf('b06f') >= 0 || c.indexOf('30c8') >= 0) return 'vortex';
    if (c.indexOf('c8b0') >= 0 || c.indexOf('a0b0') >= 0 || c.indexOf('c8e8ff') >= 0 && z.slow) return 'mist';
    if (c.indexOf('8a50') >= 0 || c.indexOf('5a48') >= 0) return 'bog';
    if (c.indexOf('ffe0') >= 0 || c.indexOf('e8c8') >= 0 || c.indexOf('ffd2') >= 0) return 'solar';
    if (c.indexOf('70e0') >= 0 || c.indexOf('90ff50') >= 0) return 'toxic';
    if (c.indexOf('e040') >= 0 || c.indexOf('e8') >= 0) return 'arc';
    return 'bloom';
  }

  function zoneFade(z) {
    return Math.max(0, 1 - (z.t - z.tele) / z.life);
  }

  function drawIceCrystal(cx, x, y, ang, len, col, a) {
    cx.save();
    cx.translate(x, y);
    cx.rotate(ang);
    cx.globalAlpha = a;
    cx.fillStyle = col;
    cx.strokeStyle = rgba('#fff', a * 0.7);
    cx.lineWidth = 1.2;
    cx.beginPath();
    cx.moveTo(0, -len);
    cx.lineTo(len * 0.28, 0);
    cx.lineTo(0, len * 0.35);
    cx.lineTo(-len * 0.28, 0);
    cx.closePath();
    cx.fill();
    cx.stroke();
    cx.restore();
  }

  function drawFrostZone(cx, z, t, k, col) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 5 + (z.seed || 0) * 0.001);
    cx.save();
    cx.globalCompositeOperation = 'lighter';
    const g = cx.createRadialGradient(z.x, z.y, z.r * 0.1, z.x, z.y, z.r);
    g.addColorStop(0, rgba(col, 0));
    g.addColorStop(0.55, rgba(col, 0.08 * k));
    g.addColorStop(0.9, rgba('#e8f8ff', (0.14 + 0.08 * pulse) * k));
    g.addColorStop(1, rgba(col, 0.02 * k));
    cx.fillStyle = g;
    cx.beginPath();
    cx.arc(z.x, z.y, z.r, 0, TAU);
    cx.fill();
    cx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 6; i++) {
      const a = t * 0.7 + i * (TAU / 6);
      const dist = z.r * (0.55 + 0.12 * Math.sin(t * 3 + i));
      drawIceCrystal(cx, z.x + Math.cos(a) * dist, z.y + Math.sin(a) * dist, a + 0.4, 7 + pulse * 3, '#d8f4ff', k * 0.85);
    }
    cx.globalAlpha = 0.35 * k;
    cx.strokeStyle = rgba('#cfeaff', 0.9);
    cx.lineWidth = 1.5;
    cx.beginPath();
    cx.arc(z.x, z.y, z.r * (0.72 + 0.06 * pulse), 0, TAU);
    cx.stroke();
    cx.restore();
  }

  function drawEmberZone(cx, z, t, k, col) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 8);
    cx.save();
    const g = cx.createRadialGradient(z.x, z.y - z.r * 0.2, z.r * 0.05, z.x, z.y, z.r);
    g.addColorStop(0, rgba('#fff4c0', 0.22 * k));
    g.addColorStop(0.45, rgba(col, 0.18 * k));
    g.addColorStop(1, rgba(col, 0));
    cx.fillStyle = g;
    cx.beginPath();
    cx.arc(z.x, z.y, z.r, 0, TAU);
    cx.fill();
    for (let i = 0; i < 8; i++) {
      const a = i * (TAU / 8) + t * 1.2;
      const bx = z.x + Math.cos(a) * z.r * 0.55;
      const by = z.y + Math.sin(a) * z.r * 0.55;
      const fh = 10 + pulse * 6 + (i % 2) * 4;
      cx.globalAlpha = (0.55 + 0.25 * pulse) * k;
      cx.fillStyle = i % 2 ? rgba('#ff9040', 0.9) : rgba(col, 0.95);
      cx.beginPath();
      cx.moveTo(bx, by);
      cx.bezierCurveTo(bx + Math.cos(a - 0.4) * 6, by - fh * 0.5, bx + Math.cos(a) * 3, by - fh, bx + Math.cos(a + 0.4) * 6, by - fh * 0.45);
      cx.closePath();
      cx.fill();
    }
    cx.restore();
  }

  function drawSporeZone(cx, z, t, k, col) {
    const wob = 0.88 + 0.08 * Math.sin(t * 4);
    cx.save();
    cx.globalAlpha = 0.14 * k;
    cx.fillStyle = col;
    cx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const a = i * (TAU / 24);
      const rr = z.r * wob * (1 + 0.06 * Math.sin(a * 5 + t * 3));
      const px = z.x + Math.cos(a) * rr;
      const py = z.y + Math.sin(a) * rr;
      if (i === 0) cx.moveTo(px, py);
      else cx.lineTo(px, py);
    }
    cx.closePath();
    cx.fill();
    for (let i = 0; i < 5; i++) {
      const a = t * 0.5 + i * 1.3 + (z.seed || 0) * 0.01;
      const px = z.x + Math.cos(a) * z.r * 0.4;
      const py = z.y + Math.sin(a) * z.r * 0.4 - (t * 18 + i * 12) % (z.r * 0.9);
      cx.globalAlpha = 0.5 * k;
      cx.fillStyle = rgba('#e8ffe0', 0.9);
      cx.beginPath();
      cx.ellipse(px, py, 3.5, 5, 0, 0, TAU);
      cx.fill();
      cx.globalAlpha = 0.7 * k;
      cx.fillStyle = col;
      cx.beginPath();
      cx.arc(px, py - 4, 4.5, 0, TAU);
      cx.fill();
    }
    cx.restore();
  }

  function drawNeonZone(cx, z, t, k, col) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 10);
    const r = z.r;
    cx.save();
    cx.beginPath();
    cx.arc(z.x, z.y, r, 0, TAU);
    cx.clip();
    cx.globalAlpha = 0.08 * k;
    cx.fillStyle = col;
    cx.beginPath();
    cx.arc(z.x, z.y, r, 0, TAU);
    cx.fill();
    cx.globalAlpha = (0.7 + 0.25 * pulse) * k;
    cx.strokeStyle = col;
    cx.lineWidth = 2.5;
    const inset = r * 0.55;
    const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    for (const [sx, sy] of corners) {
      const cx0 = z.x + sx * inset;
      const cy0 = z.y + sy * inset;
      cx.beginPath();
      cx.moveTo(cx0, cy0 + sy * 14);
      cx.lineTo(cx0, cy0);
      cx.lineTo(cx0 + sx * 14, cy0);
      cx.stroke();
    }
    cx.globalAlpha = 0.25 * k;
    for (let i = -2; i <= 2; i++) {
      const ly = z.y + i * r * 0.22 + Math.sin(t * 12 + i) * 2;
      cx.fillStyle = rgba(col, 0.35 + 0.2 * pulse);
      cx.fillRect(z.x - r * 0.7, ly, r * 1.4, 1.5);
    }
    cx.restore();
  }

  function drawVortexZone(cx, z, t, k, col) {
    cx.save();
    cx.globalAlpha = 0.1 * k;
    cx.fillStyle = col;
    cx.beginPath();
    cx.arc(z.x, z.y, z.r, 0, TAU);
    cx.fill();
    cx.globalAlpha = (0.55 + 0.2 * Math.sin(t * 6)) * k;
    cx.strokeStyle = col;
    cx.lineWidth = 2;
    for (let arm = 0; arm < 3; arm++) {
      cx.beginPath();
      for (let i = 0; i <= 28; i++) {
        const u = i / 28;
        const a = t * 2.2 + arm * (TAU / 3) - u * 4.5;
        const rr = z.r * (0.15 + u * 0.85);
        const px = z.x + Math.cos(a) * rr;
        const py = z.y + Math.sin(a) * rr;
        if (i === 0) cx.moveTo(px, py);
        else cx.lineTo(px, py);
      }
      cx.stroke();
    }
    for (let i = 0; i < 4; i++) {
      const a = t * 3 + i * 1.6;
      const dist = z.r * (0.3 + 0.5 * ((i + t * 0.5) % 1));
      cx.globalAlpha = 0.45 * k;
      cx.fillStyle = rgba('#fff', 0.6);
      cx.beginPath();
      cx.arc(z.x + Math.cos(a) * dist, z.y + Math.sin(a) * dist, 2.5, 0, TAU);
      cx.fill();
    }
    cx.restore();
  }

  function drawMistZone(cx, z, t, k, col) {
    cx.save();
    for (let i = 0; i < 6; i++) {
      const a = t * 0.4 + i * 1.05;
      const px = z.x + Math.cos(a) * z.r * 0.35;
      const py = z.y + Math.sin(a) * z.r * 0.25 - 6;
      cx.globalAlpha = (0.12 + 0.06 * Math.sin(t * 2 + i)) * k;
      cx.fillStyle = col;
      cx.beginPath();
      cx.ellipse(px, py, z.r * 0.38, z.r * 0.22, a * 0.3, 0, TAU);
      cx.fill();
      cx.globalAlpha = 0.35 * k;
      cx.strokeStyle = rgba('#fff', 0.35);
      cx.lineWidth = 1;
      cx.stroke();
    }
    cx.restore();
  }

  function drawBogZone(cx, z, t, k, col) {
    const wob = 0.9 + 0.07 * Math.sin(t * 2.5);
    cx.save();
    cx.globalAlpha = 0.2 * k;
    cx.fillStyle = col;
    cx.beginPath();
    for (let i = 0; i <= 20; i++) {
      const a = i * (TAU / 20);
      const rr = z.r * wob * (1 + 0.1 * Math.sin(a * 3 + t));
      const px = z.x + Math.cos(a) * rr;
      const py = z.y + Math.sin(a) * rr * 0.82;
      if (i === 0) cx.moveTo(px, py);
      else cx.lineTo(px, py);
    }
    cx.closePath();
    cx.fill();
    for (let i = 0; i < 4; i++) {
      const a = t * 0.8 + i * 1.5;
      cx.globalAlpha = 0.35 * k;
      cx.strokeStyle = ['#80ffc0', '#ffc080', '#c080ff', '#80c0ff'][i];
      cx.lineWidth = 2;
      cx.beginPath();
      cx.arc(z.x + Math.cos(a) * z.r * 0.35, z.y + Math.sin(a) * z.r * 0.28, 8 + i * 2, 0.3, 2.8);
      cx.stroke();
    }
    cx.restore();
  }

  function drawSolarZone(cx, z, t, k, col) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 5);
    cx.save();
    cx.globalAlpha = 0.14 * k;
    cx.fillStyle = col;
    cx.beginPath();
    cx.arc(z.x, z.y, z.r * 0.35, 0, TAU);
    cx.fill();
    for (let i = 0; i < 10; i++) {
      const a = i * (TAU / 10) + t * 0.4;
      cx.globalAlpha = (0.35 + 0.2 * pulse) * k;
      cx.fillStyle = rgba(col, 0.85);
      cx.beginPath();
      cx.moveTo(z.x, z.y);
      cx.lineTo(z.x + Math.cos(a - 0.08) * z.r, z.y + Math.sin(a - 0.08) * z.r);
      cx.lineTo(z.x + Math.cos(a + 0.08) * z.r, z.y + Math.sin(a + 0.08) * z.r);
      cx.closePath();
      cx.fill();
    }
    cx.restore();
  }

  function drawToxicZone(cx, z, t, k, col) {
    cx.save();
    cx.globalAlpha = 0.12 * k;
    cx.fillStyle = col;
    cx.beginPath();
    cx.arc(z.x, z.y, z.r, 0, TAU);
    cx.fill();
    for (let i = 0; i < 6; i++) {
      const phase = (t * 1.5 + i * 0.7) % 1;
      const px = z.x + Math.cos(i * 1.2) * z.r * 0.45;
      const py = z.y + z.r * 0.35 - phase * z.r * 0.7;
      cx.globalAlpha = (1 - phase) * 0.65 * k;
      cx.fillStyle = rgba(col, 0.9);
      cx.beginPath();
      cx.arc(px, py, 4 + phase * 3, 0, TAU);
      cx.fill();
    }
    cx.restore();
  }

  function drawArcZone(cx, z, t, k, col) {
    cx.save();
    cx.globalAlpha = 0.1 * k;
    cx.fillStyle = col;
    cx.beginPath();
    cx.arc(z.x, z.y, z.r, 0, TAU);
    cx.fill();
    cx.globalAlpha = 0.75 * k;
    cx.strokeStyle = col;
    cx.lineWidth = 2;
    const n = 12;
    let lx = z.x + z.r;
    let ly = z.y;
    cx.beginPath();
    cx.moveTo(lx, ly);
    for (let i = 1; i <= n; i++) {
      const a = i * (TAU / n) + t * 2;
      const px = z.x + Math.cos(a) * z.r;
      const py = z.y + Math.sin(a) * z.r;
      const mx = (lx + px) / 2 + Math.sin(t * 14 + i) * 8;
      const my = (ly + py) / 2 + Math.cos(t * 14 + i) * 8;
      cx.lineTo(mx, my);
      lx = px;
      ly = py;
    }
    cx.closePath();
    cx.stroke();
    cx.restore();
  }

  function drawBloomZone(cx, z, t, k, col) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 4);
    cx.save();
    cx.globalAlpha = 0.11 * k;
    cx.fillStyle = col;
    cx.beginPath();
    cx.arc(z.x, z.y, z.r, 0, TAU);
    cx.fill();
    for (let i = 0; i < 7; i++) {
      const a = i * (TAU / 7) + t * 0.5;
      cx.globalAlpha = (0.4 + 0.15 * pulse) * k;
      cx.fillStyle = rgba(col, 0.8);
      cx.beginPath();
      cx.ellipse(z.x + Math.cos(a) * z.r * 0.42, z.y + Math.sin(a) * z.r * 0.42, 6, 11, a, 0, TAU);
      cx.fill();
    }
    cx.restore();
  }

  const ZONE_DRAW = {
    frost: drawFrostZone,
    ember: drawEmberZone,
    spore: drawSporeZone,
    neon: drawNeonZone,
    vortex: drawVortexZone,
    mist: drawMistZone,
    bog: drawBogZone,
    solar: drawSolarZone,
    toxic: drawToxicZone,
    arc: drawArcZone,
    bloom: drawBloomZone,
  };

  function drawFriendlyZone(cx, z, elapsed) {
    if (!z.friendly || z.t < z.tele) return;
    const k = zoneFade(z);
    if (k <= 0) return;
    const kind = inferZoneVfx(z);
    const col = z.col || '#bfe6ff';
    const draw = ZONE_DRAW[kind] || drawBloomZone;
    cx.save();
    draw(cx, z, elapsed, k, col);
    cx.restore();
  }

  function auraStyleFromCol(col, kind) {
    const c = (col || '').toLowerCase();
    if (kind === 'pull' || kind === 'vortex') return 'vortex';
    if (kind === 'mist') return 'mist';
    if (c.indexOf('ff40') >= 0 || c.indexOf('ff60') >= 0) return 'neon';
    if (c.indexOf('ff50') >= 0 || c.indexOf('ff6a') >= 0) return 'heat';
    if (c.indexOf('30e8') >= 0 || c.indexOf('40a8') >= 0) return 'bio';
    if (c.indexOf('f0a0') >= 0 || c.indexOf('e8c8') >= 0) return 'dust';
    if (c.indexOf('ffe0') >= 0 || c.indexOf('ffd2') >= 0) return 'gem';
    if (c.indexOf('70e0') >= 0) return 'toxic';
    if (c.indexOf('b8d8') >= 0 || c.indexOf('8040') >= 0) return 'vortex';
    if (c.indexOf('c8b0') >= 0) return 'mist';
    if (c.indexOf('5a48') >= 0) return 'bog';
    return 'pulse';
  }

  function drawGemAura(cx, x, y, R, col, t, k) {
    cx.save();
    cx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) {
      const a = t * 0.6 + i * (TAU / 5);
      const dist = R * 0.65;
      const px = x + Math.cos(a) * dist;
      const py = y + Math.sin(a) * dist;
      const s = 5 + Math.sin(t * 4 + i) * 2;
      cx.globalAlpha = 0.55 * k;
      cx.fillStyle = col;
      cx.beginPath();
      for (let v = 0; v < 6; v++) {
        const va = v * (TAU / 6) + a;
        const vx = px + Math.cos(va) * s;
        const vy = py + Math.sin(va) * s;
        if (v === 0) cx.moveTo(vx, vy);
        else cx.lineTo(vx, vy);
      }
      cx.closePath();
      cx.fill();
    }
    cx.globalCompositeOperation = 'source-over';
    cx.restore();
  }

  function drawHeatAura(cx, x, y, R, col, t, k) {
    for (let i = 0; i < 6; i++) {
      const a = i * (TAU / 6) + t * 1.5;
      cx.globalAlpha = 0.2 * k;
      cx.strokeStyle = rgba(col, 0.7);
      cx.lineWidth = 2;
      cx.beginPath();
      cx.moveTo(x + Math.cos(a) * R * 0.3, y + Math.sin(a) * R * 0.3);
      cx.quadraticCurveTo(x + Math.cos(a + 0.3) * R * 0.9, y + Math.sin(a + 0.3) * R * 0.9, x + Math.cos(a) * R, y + Math.sin(a) * R);
      cx.stroke();
    }
  }

  function drawBioAura(cx, x, y, R, col, t, k) {
    for (let i = 0; i < 8; i++) {
      const a = t * 0.8 + i * 0.9;
      const px = x + Math.cos(a) * R * (0.4 + 0.15 * Math.sin(t * 3 + i));
      const py = y + Math.sin(a) * R * (0.4 + 0.15 * Math.cos(t * 3 + i));
      cx.globalAlpha = (0.35 + 0.2 * Math.sin(t * 5 + i)) * k;
      cx.fillStyle = col;
      cx.beginPath();
      cx.arc(px, py, 3 + (i % 2), 0, TAU);
      cx.fill();
    }
  }

  function drawDustAura(cx, x, y, R, col, t, k) {
    cx.globalAlpha = 0.18 * k;
    for (let i = 0; i < 12; i++) {
      const a = t * 2.5 + i * 0.55;
      const rr = R * (0.5 + (i % 3) * 0.15);
      cx.strokeStyle = rgba(col, 0.5);
      cx.lineWidth = 1.5;
      cx.beginPath();
      cx.arc(x, y, rr, a, a + 0.8);
      cx.stroke();
    }
  }

  function drawPulseAura(cx, x, y, R, col, t, k) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 4);
    cx.save();
    cx.globalCompositeOperation = 'lighter';
    const g = cx.createRadialGradient(x, y, R * 0.15, x, y, R);
    g.addColorStop(0, rgba(col, 0));
    g.addColorStop(0.6, rgba(col, 0.1 * k));
    g.addColorStop(1, rgba(col, 0.02 * k));
    cx.fillStyle = g;
    cx.beginPath();
    cx.arc(x, y, R, 0, TAU);
    cx.fill();
    cx.globalCompositeOperation = 'source-over';
    cx.globalAlpha = (0.45 + 0.25 * pulse) * k;
    cx.strokeStyle = col;
    cx.lineWidth = 2;
    cx.setLineDash([10, 8]);
    cx.lineDashOffset = -t * 48;
    cx.beginPath();
    cx.arc(x, y, R * 0.92, 0, TAU);
    cx.stroke();
    cx.setLineDash([]);
    cx.restore();
  }

  function drawPlayerAura(cx, x, y, R, col, style, t, alpha) {
    const k = alpha != null ? alpha : 1;
    const fakeZ = { x: x, y: y, r: R, col: col, friendly: true, t: 1, tele: 0, life: 1, seed: 42 };
    if (style === 'vortex') drawVortexZone(cx, fakeZ, t, k, col);
    else if (style === 'mist') drawMistZone(cx, fakeZ, t, k, col);
    else if (style === 'neon') drawNeonZone(cx, fakeZ, t, k, col);
    else if (style === 'heat') drawHeatAura(cx, x, y, R, col, t, k);
    else if (style === 'bio') drawBioAura(cx, x, y, R, col, t, k);
    else if (style === 'dust') drawDustAura(cx, x, y, R, col, t, k);
    else if (style === 'gem') drawGemAura(cx, x, y, R, col, t, k);
    else if (style === 'bog') drawBogZone(cx, fakeZ, t, k, col);
    else if (style === 'toxic') drawToxicZone(cx, fakeZ, t, k, col);
    else if (style === 'ember') drawEmberZone(cx, fakeZ, t, k, col);
    else drawPulseAura(cx, x, y, R, col, t, k);
  }

  function drawNeonAfterimage(cx, x, y, face, t, k) {
    cx.save();
    const gx = x - Math.cos(face) * 20;
    const gy = y - Math.sin(face) * 20;
    cx.globalAlpha = 0.35 * k;
    cx.strokeStyle = '#ff60d8';
    cx.lineWidth = 2;
    const w = 18;
    cx.strokeRect(gx - w, gy - w * 0.7, w * 2, w * 1.4);
    cx.globalAlpha = 0.5 * k;
    cx.fillStyle = '#80f0ff';
    for (let i = 0; i < 3; i++) {
      cx.fillRect(gx - w + 4, gy - 4 + i * 6, w * 2 - 8, 2);
    }
    cx.restore();
  }

  function drawOrbitNode(cx, ox, oy, col, t, i, lv) {
    cx.save();
    cx.translate(ox, oy);
    cx.rotate(t * 2 + i);
    cx.globalAlpha = 0.85;
    cx.fillStyle = col;
    cx.beginPath();
    for (let v = 0; v < 4; v++) {
      const a = v * (TAU / 4);
      const s = 5 + lv * 0.4;
      const vx = Math.cos(a) * s;
      const vy = Math.sin(a) * s;
      if (v === 0) cx.moveTo(vx, vy);
      else cx.lineTo(vx, vy);
    }
    cx.closePath();
    cx.fill();
    cx.strokeStyle = rgba('#fff', 0.5);
    cx.lineWidth = 1;
    cx.stroke();
    cx.restore();
  }

  function drawEyewallNodes(cx, x, y, n, R, t, lv) {
    const prev = [];
    for (let i = 0; i < n; i++) {
      const a = t + i * (TAU / n);
      const ox = x + Math.cos(a) * R;
      const oy = y + Math.sin(a) * R;
      prev.push({ ox: ox, oy: oy });
      cx.globalAlpha = 0.9;
      cx.fillStyle = '#80d0ff';
      cx.beginPath();
      cx.moveTo(ox, oy - 7);
      cx.lineTo(ox + 5, oy + 4);
      cx.lineTo(ox - 5, oy + 4);
      cx.closePath();
      cx.fill();
    }
    cx.globalAlpha = 0.4;
    cx.strokeStyle = '#c8f0ff';
    cx.lineWidth = 1.5;
    for (let i = 0; i < prev.length; i++) {
      const a = prev[i];
      const b = prev[(i + 1) % prev.length];
      cx.beginPath();
      cx.moveTo(a.ox, a.oy);
      const mx = (a.ox + b.ox) / 2 + Math.sin(t * 8 + i) * 6;
      const my = (a.oy + b.oy) / 2 + Math.cos(t * 8 + i) * 6;
      cx.quadraticCurveTo(mx, my, b.ox, b.oy);
      cx.stroke();
    }
  }

  window.drawFriendlyZone = drawFriendlyZone;
  window.drawPlayerAura = drawPlayerAura;
  window.drawNeonAfterimage = drawNeonAfterimage;
  window.drawOrbitNode = drawOrbitNode;
  window.drawEyewallNodes = drawEyewallNodes;
  window.auraStyleFromCol = auraStyleFromCol;
  window.inferZoneVfx = inferZoneVfx;
})();
