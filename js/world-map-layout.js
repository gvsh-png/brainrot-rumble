'use strict';
// Per-world map obstacles with theme-colored blocks (no dark/black defaults).

(function () {
  const LAYOUT_CYCLE = ['open', 'pillars', 'corridor', 'islands', 'cross', 'ring', 'lanes', 'clusters'];

  function pickLayout(world, wi) {
    if (world && world.mapLayout) return world.mapLayout;
    const id = world && world.id ? world.id : '';
    const byId = {
      grass: 'open', citrus: 'lanes', forest: 'clusters', glacier: 'islands',
      circo: 'ring', autumn: 'clusters', swamp: 'lanes', sky: 'pillars',
      crystal: 'corridor', volcano: 'cross', dirt: 'pillars',
    };
    if (byId[id]) return byId[id];
    if (id.startsWith('ext_') && world && world.name && typeof layoutForWorld === 'function') {
      return layoutForWorld(parseInt(id.slice(4), 10), world.name);
    }
    return LAYOUT_CYCLE[((wi || 0) * 17 + 11) % LAYOUT_CYCLE.length];
  }

  function themeCol(theme, slot, fallback) {
    if (!theme) return fallback;
    if (slot === 'accent') return theme.accent || theme.wall || fallback;
    if (slot === 'wall') return theme.wall || theme.accent || fallback;
    return theme.accent || fallback;
  }

  function mkObs(x, y, w, h, col) {
    return { x, y, w, h, col: col || '#e8c878' };
  }

  function buildLayout(kind, W, H, theme) {
    const pad = 120;
    const cx = W * 0.5, cy = H * 0.5;
    const obs = [];
    const c1 = themeCol(theme, 'accent', '#a8d848');
    const c2 = themeCol(theme, 'wall', '#f0c878');
    if (kind === 'open') return obs;

    if (kind === 'pillars') {
      const pw = Math.max(90, W * 0.07), ph = Math.max(140, H * 0.22);
      obs.push(mkObs(W * 0.22 - pw / 2, cy - ph / 2, pw, ph, c1));
      obs.push(mkObs(W * 0.78 - pw / 2, cy - ph / 2, pw, ph, c1));
      if (W > H * 1.2) obs.push(mkObs(cx - pw / 2, H * 0.18, pw, ph * 0.85, c2));
    } else if (kind === 'corridor') {
      const thick = Math.max(80, Math.min(W, H) * 0.08);
      obs.push(mkObs(pad, pad, thick, H - pad * 2, c1));
      obs.push(mkObs(W - pad - thick, pad, thick, H - pad * 2, c2));
    } else if (kind === 'islands') {
      const s = Math.max(120, Math.min(W, H) * 0.14);
      obs.push(mkObs(pad, pad, s, s, c1));
      obs.push(mkObs(W - pad - s, pad, s, s, c2));
      obs.push(mkObs(pad, H - pad - s, s, s, c1));
      obs.push(mkObs(W - pad - s, H - pad - s, s, s, c2));
    } else if (kind === 'cross') {
      const tw = Math.max(100, W * 0.12), th = Math.max(100, H * 0.12);
      obs.push(mkObs(cx - tw / 2, pad, tw, cy - pad - th * 0.5, c1));
      obs.push(mkObs(cx - tw / 2, cy + th * 0.5, tw, H - pad - cy - th * 0.5, c2));
      obs.push(mkObs(pad, cy - th / 2, cx - pad - tw * 0.5, th, c1));
      obs.push(mkObs(cx + tw * 0.5, cy - th / 2, W - pad - cx - tw * 0.5, th, c2));
    } else if (kind === 'ring') {
      const bw = Math.max(70, W * 0.09), bh = Math.max(70, H * 0.09);
      const spots = [
        [0.5, 0.22], [0.78, 0.38], [0.72, 0.72], [0.28, 0.72], [0.22, 0.38],
      ];
      for (let i = 0; i < spots.length; i++) {
        const [fx, fy] = spots[i];
        obs.push(mkObs(W * fx - bw / 2, H * fy - bh / 2, bw, bh, i % 2 ? c2 : c1));
      }
    } else if (kind === 'lanes') {
      const bh = Math.max(70, H * 0.1);
      obs.push(mkObs(pad, H * 0.32 - bh / 2, W - pad * 2, bh, c1));
      obs.push(mkObs(pad, H * 0.68 - bh / 2, W - pad * 2, bh, c2));
    } else if (kind === 'clusters') {
      const r = Math.max(55, Math.min(W, H) * 0.06);
      const pts = [[0.3, 0.35], [0.65, 0.28], [0.55, 0.62], [0.25, 0.7], [0.75, 0.55]];
      for (let i = 0; i < pts.length; i++) {
        const [fx, fy] = pts[i];
        obs.push(mkObs(W * fx - r, H * fy - r, r * 2, r * 2, i % 2 ? c2 : c1));
      }
    }
    return obs;
  }

  function getObstacles(world, wi, W, H) {
    return buildLayout(pickLayout(world, wi), W || 2200, H || 2200, world && world.theme);
  }

  function circleHitsObs(x, y, r, obs) {
    for (const o of obs) {
      const nx = Math.max(o.x, Math.min(x, o.x + o.w));
      const ny = Math.max(o.y, Math.min(y, o.y + o.h));
      const dx = x - nx, dy = y - ny;
      if (dx * dx + dy * dy < r * r) return o;
    }
    return null;
  }

  function pushOutCircle(x, y, r, o) {
    const nx = Math.max(o.x, Math.min(x, o.x + o.w));
    const ny = Math.max(o.y, Math.min(y, o.y + o.h));
    let dx = x - nx, dy = y - ny;
    const d2 = dx * dx + dy * dy;
    if (d2 < 0.01) { dx = 1; dy = 0; }
    const d = Math.sqrt(d2) || 1;
    const push = r - d + 1;
    return { x: x + (dx / d) * push, y: y + (dy / d) * push };
  }

  function resolveCircle(x, y, r, obs) {
    let ox = x, oy = y;
    for (let i = 0; i < 6; i++) {
      const hit = circleHitsObs(ox, oy, r, obs);
      if (!hit) break;
      const p = pushOutCircle(ox, oy, r, hit);
      ox = p.x; oy = p.y;
    }
    return { x: ox, y: oy };
  }

  function drawObstacles(g, obs, theme) {
    for (const o of obs) {
      const col = o.col || themeCol(theme, 'wall', '#e8c878');
      g.fillStyle = col;
      g.strokeStyle = themeCol(theme, 'accent', '#fff8e0') + '99';
      g.lineWidth = 3;
      const r = Math.min(o.w, o.h) * 0.12;
      g.beginPath();
      if (g.roundRect) {
        g.roundRect(o.x, o.y, o.w, o.h, r);
      } else {
        g.rect(o.x, o.y, o.w, o.h);
      }
      g.fill();
      g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.22)';
      g.fillRect(o.x + 4, o.y + 4, o.w * 0.35, o.h * 0.2);
    }
  }

  window.WorldMapLayout = { getObstacles, resolveCircle, drawObstacles, pickLayout };
})();
