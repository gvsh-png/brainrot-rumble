'use strict';
// Per-world map obstacles (rocks/pillars) — layout variation beyond floor palette.

(function () {
  const LAYOUT_CYCLE = [
    'open', 'pillars', 'corridor', 'islands', 'cross', 'ring', 'lanes', 'clusters',
    'zigzag', 'center', 'corners', 'split', 'maze', 'diagonal', 'arc', 'spine',
  ];

  // One unique layout per extended world index (11–49).
  const EXT_LAYOUTS = [
    'pillars', 'lanes', 'corridor', 'islands', 'cross', 'ring', 'clusters', 'zigzag',
    'center', 'corners', 'split', 'maze', 'diagonal', 'arc', 'spine', 'pillars',
    'lanes', 'islands', 'cross', 'ring', 'clusters', 'zigzag', 'center', 'corners',
    'split', 'maze', 'diagonal', 'arc', 'spine', 'pillars', 'lanes', 'corridor',
    'islands', 'cross', 'ring', 'clusters', 'zigzag', 'center', 'corners',
  ];

  function pickExtendedLayout(wi) {
    return EXT_LAYOUTS[wi - 11] || LAYOUT_CYCLE[(wi * 5 + 3) % LAYOUT_CYCLE.length];
  }

  function pickLayout(world, wi) {
    if (world && world.mapLayout) return world.mapLayout;
    const id = world && world.id ? world.id : '';
    const byId = {
      grass: 'open', citrus: 'lanes', forest: 'clusters', glacier: 'islands',
      circo: 'ring', autumn: 'clusters', swamp: 'lanes', sky: 'pillars',
      crystal: 'corridor', volcano: 'cross', dirt: 'pillars',
    };
    if (byId[id]) return byId[id];
    return LAYOUT_CYCLE[(wi || 0) % LAYOUT_CYCLE.length];
  }

  function mkObs(x, y, w, h, col) {
    return { x, y, w, h, col: col || '#c8a868' };
  }

  function buildLayout(kind, W, H) {
    const pad = 120;
    const cx = W * 0.5, cy = H * 0.5;
    const obs = [];
    if (kind === 'open') return obs;

    if (kind === 'pillars') {
      const pw = Math.max(90, W * 0.07), ph = Math.max(140, H * 0.22);
      obs.push(mkObs(W * 0.22 - pw / 2, cy - ph / 2, pw, ph, '#a8c8e8'));
      obs.push(mkObs(W * 0.78 - pw / 2, cy - ph / 2, pw, ph, '#a8c8e8'));
      if (W > H * 1.2) obs.push(mkObs(cx - pw / 2, H * 0.18, pw, ph * 0.85, '#98b8d8'));
    } else if (kind === 'corridor') {
      const thick = Math.max(80, Math.min(W, H) * 0.08);
      obs.push(mkObs(pad, pad, thick, H - pad * 2, '#c8a0f0'));
      obs.push(mkObs(W - pad - thick, pad, thick, H - pad * 2, '#c8a0f0'));
    } else if (kind === 'islands') {
      const s = Math.max(120, Math.min(W, H) * 0.14);
      obs.push(mkObs(pad, pad, s, s, '#e8c878'));
      obs.push(mkObs(W - pad - s, pad, s, s, '#e8c878'));
      obs.push(mkObs(pad, H - pad - s, s, s, '#e8c878'));
      obs.push(mkObs(W - pad - s, H - pad - s, s, s, '#e8c878'));
    } else if (kind === 'cross') {
      const tw = Math.max(100, W * 0.12), th = Math.max(100, H * 0.12);
      obs.push(mkObs(cx - tw / 2, pad, tw, cy - pad - th * 0.5, '#ff9878'));
      obs.push(mkObs(cx - tw / 2, cy + th * 0.5, tw, H - pad - cy - th * 0.5, '#ff9878'));
      obs.push(mkObs(pad, cy - th / 2, cx - pad - tw * 0.5, th, '#ff9878'));
      obs.push(mkObs(cx + tw * 0.5, cy - th / 2, W - pad - cx - tw * 0.5, th, '#ff9878'));
    } else if (kind === 'ring') {
      const bw = Math.max(70, W * 0.09), bh = Math.max(70, H * 0.09);
      const spots = [
        [0.5, 0.22], [0.78, 0.38], [0.72, 0.72], [0.28, 0.72], [0.22, 0.38],
      ];
      for (const [fx, fy] of spots) {
        obs.push(mkObs(W * fx - bw / 2, H * fy - bh / 2, bw, bh, '#f0d060'));
      }
    } else if (kind === 'lanes') {
      const bh = Math.max(70, H * 0.1);
      obs.push(mkObs(pad, H * 0.32 - bh / 2, W - pad * 2, bh, '#98d868'));
      obs.push(mkObs(pad, H * 0.68 - bh / 2, W - pad * 2, bh, '#98d868'));
    } else if (kind === 'clusters') {
      const r = Math.max(55, Math.min(W, H) * 0.06);
      const pts = [[0.3, 0.35], [0.65, 0.28], [0.55, 0.62], [0.25, 0.7], [0.75, 0.55]];
      for (const [fx, fy] of pts) {
        obs.push(mkObs(W * fx - r, H * fy - r, r * 2, r * 2, '#a8d848'));
      }
    } else if (kind === 'zigzag') {
      const bw = Math.max(80, W * 0.08), bh = Math.max(80, H * 0.08);
      obs.push(mkObs(W * 0.2 - bw / 2, H * 0.25, bw, bh, '#f0a878'));
      obs.push(mkObs(W * 0.5 - bw / 2, H * 0.45, bw, bh, '#f0a878'));
      obs.push(mkObs(W * 0.8 - bw / 2, H * 0.65, bw, bh, '#f0a878'));
    } else if (kind === 'center') {
      const s = Math.max(140, Math.min(W, H) * 0.16);
      obs.push(mkObs(cx - s / 2, cy - s / 2, s, s, '#c8a0f0'));
      obs.push(mkObs(cx - s * 0.3, cy - s * 0.8, s * 0.6, s * 0.5, '#d8b0ff'));
    } else if (kind === 'corners') {
      const s = Math.max(100, Math.min(W, H) * 0.12);
      obs.push(mkObs(pad, pad, s, s * 1.4, '#98d868'));
      obs.push(mkObs(W - pad - s, pad, s, s * 1.4, '#98d868'));
      obs.push(mkObs(pad, H - pad - s * 1.4, s, s * 1.4, '#98d868'));
      obs.push(mkObs(W - pad - s, H - pad - s * 1.4, s, s * 1.4, '#98d868'));
    } else if (kind === 'split') {
      const tw = Math.max(90, W * 0.1);
      obs.push(mkObs(cx - tw / 2, pad, tw, H * 0.38 - pad, '#ff9878'));
      obs.push(mkObs(cx - tw / 2, H * 0.62, tw, H - pad - H * 0.62, '#ff9878'));
    } else if (kind === 'maze') {
      const bw = Math.max(70, W * 0.07), bh = Math.max(70, H * 0.07);
      obs.push(mkObs(W * 0.35, pad, bw, H - pad * 2, '#a8c8e8'));
      obs.push(mkObs(W * 0.65, H * 0.3, bw, H * 0.7 - pad, '#a8c8e8'));
      obs.push(mkObs(pad, H * 0.45, W * 0.35 - pad, bh, '#a8c8e8'));
    } else if (kind === 'diagonal') {
      const bw = Math.max(80, W * 0.09), bh = Math.max(120, H * 0.18);
      obs.push(mkObs(W * 0.15, H * 0.2, bw, bh, '#e8c878'));
      obs.push(mkObs(W * 0.45, H * 0.42, bw, bh, '#e8c878'));
      obs.push(mkObs(W * 0.75, H * 0.64, bw, bh, '#e8c878'));
    } else if (kind === 'arc') {
      const bw = Math.max(70, W * 0.08), bh = Math.max(70, H * 0.08);
      const spots = [[0.35, 0.3], [0.5, 0.2], [0.65, 0.3], [0.72, 0.5], [0.65, 0.7], [0.5, 0.78], [0.35, 0.7], [0.28, 0.5]];
      for (const [fx, fy] of spots) {
        obs.push(mkObs(W * fx - bw / 2, H * fy - bh / 2, bw, bh, '#f0d060'));
      }
    } else if (kind === 'spine') {
      const tw = Math.max(100, W * 0.12);
      obs.push(mkObs(cx - tw / 2, H * 0.2, tw, H * 0.12, '#98d868'));
      obs.push(mkObs(cx - tw / 2, H * 0.44, tw, H * 0.12, '#98d868'));
      obs.push(mkObs(cx - tw / 2, H * 0.68, tw, H * 0.12, '#98d868'));
    }
    return obs;
  }

  function getObstacles(world, wi, W, H) {
    return buildLayout(pickLayout(world, wi), W || 2200, H || 2200);
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

  function isCircleFree(x, y, r, obs) {
    return !circleHitsObs(x, y, r, obs);
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
      const col = o.col || (theme && theme.wall) || '#5a4a38';
      g.fillStyle = col;
      g.strokeStyle = 'rgba(0,0,0,0.35)';
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
      g.fillStyle = 'rgba(255,255,255,0.08)';
      g.fillRect(o.x + 4, o.y + 4, o.w * 0.35, o.h * 0.2);
    }
  }

  window.WorldMapLayout = { getObstacles, resolveCircle, drawObstacles, pickLayout, pickExtendedLayout, isCircleFree, circleHitsObs };
})();
