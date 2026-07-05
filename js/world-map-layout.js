'use strict';
// Per-world map obstacles (rocks/pillars) — layout variation beyond floor palette.

(function () {
  const SPAWN_PAD = 150;   // keep this radius at map center obstacle-free
  const ARENA_PAD = 100;   // clearance inside boss arena — obstacles removed in this zone
  const LAYOUT_CYCLE = [
    'open', 'pillars', 'islands', 'ring', 'lanes', 'clusters',
    'zigzag', 'corners', 'split', 'diagonal', 'arc', 'spine',
    'pavilion', 'meander',
  ];

  // One unique layout per extended world — no center-blocking layouts.
  const EXT_LAYOUTS = [
    'pillars', 'lanes', 'islands', 'ring', 'clusters', 'zigzag', 'corners', 'arc',
    'pavilion', 'split', 'meander', 'diagonal', 'spine', 'pillars', 'lanes',
    'islands', 'ring', 'clusters', 'zigzag', 'corners', 'arc', 'pavilion',
    'split', 'meander', 'diagonal', 'spine', 'pillars', 'lanes', 'islands',
    'ring', 'clusters', 'zigzag', 'corners', 'arc', 'pavilion', 'split',
    'meander', 'diagonal', 'spine',
  ];

  function pickExtendedLayout(wi) {
    return EXT_LAYOUTS[wi - 11] || LAYOUT_CYCLE[(wi * 5 + 3) % LAYOUT_CYCLE.length];
  }

  function pickLayout(world, wi) {
    if (world && world.mapLayout) return world.mapLayout;
    const id = world && world.id ? world.id : '';
    const byId = {
      grass: 'open', citrus: 'clusters', forest: 'clusters', glacier: 'islands',
      circo: 'ring', autumn: 'clusters', swamp: 'meander', sky: 'pillars',
      crystal: 'islands', volcano: 'ring', dirt: 'pavilion',
    };
    if (byId[id]) return byId[id];
    return LAYOUT_CYCLE[(wi || 0) % LAYOUT_CYCLE.length];
  }

  function mkObs(x, y, w, h, col) {
    return { x, y, w, h, col: col || '#c8a868' };
  }

  function buildLayout(kind, W, H, wallCol) {
    const pad = 120;
    const cx = W * 0.5, cy = H * 0.5;
    const col = wallCol || '#c8a868';
    const obs = [];
    if (kind === 'open') return obs;

    if (kind === 'pillars') {
      const pw = Math.max(90, W * 0.07), ph = Math.max(140, H * 0.22);
      obs.push(mkObs(W * 0.22 - pw / 2, cy - ph / 2, pw, ph, col));
      obs.push(mkObs(W * 0.78 - pw / 2, cy - ph / 2, pw, ph, col));
      if (W > H * 1.2) obs.push(mkObs(cx - pw / 2, H * 0.18, pw, ph * 0.85, col));
    } else if (kind === 'corridor') {
      const thick = Math.max(80, Math.min(W, H) * 0.08);
      obs.push(mkObs(pad, pad, thick, H - pad * 2, col));
      obs.push(mkObs(W - pad - thick, pad, thick, H - pad * 2, col));
    } else if (kind === 'islands') {
      const s = Math.max(120, Math.min(W, H) * 0.14);
      obs.push(mkObs(pad, pad, s, s, col));
      obs.push(mkObs(W - pad - s, pad, s, s, col));
      obs.push(mkObs(pad, H - pad - s, s, s, col));
      obs.push(mkObs(W - pad - s, H - pad - s, s, s, col));
    } else if (kind === 'cross') {
      const tw = Math.max(100, W * 0.1), th = Math.max(100, H * 0.1);
      const gap = Math.max(SPAWN_PAD * 1.4, Math.min(W, H) * 0.14);
      obs.push(mkObs(cx - tw / 2, pad, tw, cy - gap / 2 - pad, col));
      obs.push(mkObs(cx - tw / 2, cy + gap / 2, tw, H - pad - cy - gap / 2, col));
      obs.push(mkObs(pad, cy - th / 2, cx - gap / 2 - pad, th, col));
      obs.push(mkObs(cx + gap / 2, cy - th / 2, W - pad - cx - gap / 2, th, col));
    } else if (kind === 'ring') {
      const bw = Math.max(70, W * 0.09), bh = Math.max(70, H * 0.09);
      const spots = [
        [0.5, 0.22], [0.78, 0.38], [0.72, 0.72], [0.28, 0.72], [0.22, 0.38],
      ];
      for (const [fx, fy] of spots) {
        obs.push(mkObs(W * fx - bw / 2, H * fy - bh / 2, bw, bh, col));
      }
    } else if (kind === 'lanes') {
      const bh = Math.max(70, H * 0.1);
      obs.push(mkObs(pad, H * 0.28 - bh / 2, W - pad * 2, bh, col));
      obs.push(mkObs(pad, H * 0.72 - bh / 2, W - pad * 2, bh, col));
    } else if (kind === 'clusters') {
      const r = Math.max(55, Math.min(W, H) * 0.06);
      const pts = [[0.18, 0.22], [0.82, 0.2], [0.78, 0.78], [0.2, 0.8], [0.5, 0.12]];
      for (const [fx, fy] of pts) {
        obs.push(mkObs(W * fx - r, H * fy - r, r * 2, r * 2, col));
      }
    } else if (kind === 'zigzag') {
      const bw = Math.max(80, W * 0.08), bh = Math.max(80, H * 0.08);
      obs.push(mkObs(W * 0.2 - bw / 2, H * 0.25, bw, bh, col));
      obs.push(mkObs(W * 0.5 - bw / 2, H * 0.45, bw, bh, col));
      obs.push(mkObs(W * 0.8 - bw / 2, H * 0.65, bw, bh, col));
    } else if (kind === 'pavilion') {
      const s = Math.max(100, Math.min(W, H) * 0.11);
      const ring = Math.max(180, Math.min(W, H) * 0.22);
      const pts = [[1, 0], [0.71, 0.71], [0, 1], [-0.71, 0.71], [-1, 0], [-0.71, -0.71], [0, -1], [0.71, -0.71]];
      for (const [dx, dy] of pts) {
        obs.push(mkObs(cx + dx * ring - s / 2, cy + dy * ring - s / 2, s, s, col));
      }
    } else if (kind === 'corners') {
      const s = Math.max(100, Math.min(W, H) * 0.12);
      obs.push(mkObs(pad, pad, s, s * 1.4, col));
      obs.push(mkObs(W - pad - s, pad, s, s * 1.4, col));
      obs.push(mkObs(pad, H - pad - s * 1.4, s, s * 1.4, col));
      obs.push(mkObs(W - pad - s, H - pad - s * 1.4, s, s * 1.4, col));
    } else if (kind === 'split') {
      const tw = Math.max(90, W * 0.1);
      obs.push(mkObs(cx - tw / 2, pad, tw, H * 0.36 - pad, col));
      obs.push(mkObs(cx - tw / 2, H * 0.64, tw, H - pad - H * 0.64, col));
    } else if (kind === 'maze') {
      const bw = Math.max(70, W * 0.07), bh = Math.max(70, H * 0.07);
      obs.push(mkObs(W * 0.35, pad, bw, H - pad * 2, col));
      obs.push(mkObs(W * 0.65, H * 0.3, bw, H * 0.7 - pad, col));
      obs.push(mkObs(pad, H * 0.45, W * 0.35 - pad, bh, col));
    } else if (kind === 'diagonal') {
      const bw = Math.max(80, W * 0.09), bh = Math.max(120, H * 0.18);
      obs.push(mkObs(W * 0.15, H * 0.2, bw, bh, col));
      obs.push(mkObs(W * 0.45, H * 0.42, bw, bh, col));
      obs.push(mkObs(W * 0.75, H * 0.64, bw, bh, col));
    } else if (kind === 'arc') {
      const bw = Math.max(70, W * 0.08), bh = Math.max(70, H * 0.08);
      const spots = [[0.35, 0.3], [0.5, 0.2], [0.65, 0.3], [0.72, 0.5], [0.65, 0.7], [0.5, 0.78], [0.35, 0.7], [0.28, 0.5]];
      for (const [fx, fy] of spots) {
        obs.push(mkObs(W * fx - bw / 2, H * fy - bh / 2, bw, bh, col));
      }
    } else if (kind === 'spine') {
      const tw = Math.max(100, W * 0.12);
      obs.push(mkObs(cx - tw / 2, H * 0.2, tw, H * 0.12, col));
      obs.push(mkObs(cx - tw / 2, H * 0.44, tw, H * 0.12, col));
      obs.push(mkObs(cx - tw / 2, H * 0.68, tw, H * 0.12, col));
    } else if (kind === 'meander') {
      const bw = Math.max(80, W * 0.09), bh = Math.max(80, H * 0.09);
      obs.push(mkObs(W * 0.12, H * 0.18, bw, bh, col));
      obs.push(mkObs(W * 0.72, H * 0.32, bw, bh, col));
      obs.push(mkObs(W * 0.18, H * 0.62, bw, bh, col));
      obs.push(mkObs(W * 0.68, H * 0.78, bw, bh, col));
    }
    return obs;
  }

  function rectHitsObs(ax, ay, aw, ah, obs) {
    for (const o of obs) {
      if (o.x + o.w > ax && o.x < ax + aw && o.y + o.h > ay && o.y < ay + ah) return true;
    }
    return false;
  }

  function arenaObstacleScore(ax, ay, aw, ah, obs, pad) {
    const m = pad || ARENA_PAD;
    const ix = ax + m, iy = ay + m, iw = aw - m * 2, ih = ah - m * 2;
    if (iw <= 0 || ih <= 0) return 9999;
    let score = 0;
    for (const o of obs) {
      if (o.x + o.w > ix && o.x < ix + iw && o.y + o.h > iy && o.y < iy + ih) {
        const ox = Math.max(0, Math.min(o.x + o.w, ix + iw) - Math.max(o.x, ix));
        const oy = Math.max(0, Math.min(o.y + o.h, iy + ih) - Math.max(o.y, iy));
        score += ox * oy;
      }
    }
    return score;
  }

  /** Best boss-arena top-left: prefer near player, minimize obstacle overlap inside. */
  function findSafeArena(W, H, aw, ah, obs, border, prefX, prefY) {
    const pad = border || 120;
    const maxX = W - pad - aw;
    const maxY = H - pad - ah;
    if (maxX < pad || maxY < pad) return { x: pad, y: pad };
    const tries = [];
    const add = (x, y) => {
      const ax = Math.max(pad, Math.min(x, maxX));
      const ay = Math.max(pad, Math.min(y, maxY));
      tries.push({ x: ax, y: ay });
    };
    add(prefX - aw / 2, prefY - ah / 2);
    add(W * 0.5 - aw / 2, H * 0.5 - ah / 2);
    const stepX = Math.max(100, aw * 0.22);
    const stepY = Math.max(100, ah * 0.22);
    for (let y = pad; y <= maxY; y += stepY) {
      for (let x = pad; x <= maxX; x += stepX) add(x, y);
    }
    let best = tries[0], bestScore = Infinity;
    for (const t of tries) {
      const overlap = arenaObstacleScore(t.x, t.y, aw, ah, obs, ARENA_PAD);
      const cx = t.x + aw / 2, cy = t.y + ah / 2;
      const dist = (cx - prefX) * (cx - prefX) + (cy - prefY) * (cy - prefY);
      const score = overlap * 4 + dist * 0.002;
      if (score < bestScore) { bestScore = score; best = t; }
    }
    return best;
  }

  /** Remove obstacles overlapping the arena fight zone (whole obstacle dropped if it intrudes). */
  function stripObsInArena(obs, ax, ay, aw, ah, pad) {
    const m = pad || ARENA_PAD;
    const ix = ax + m, iy = ay + m, iw = aw - m * 2, ih = ah - m * 2;
    if (iw <= 0 || ih <= 0) return obs;
    return obs.filter(o => !(o.x + o.w > ix && o.x < ix + iw && o.y + o.h > iy && o.y < iy + ih));
  }

  function ensureSpawnClear(obs, W, H, margin) {
    const cx = W * 0.5, cy = H * 0.5;
    const m = margin || SPAWN_PAD;
    return obs.filter(o => !circleHitsObs(cx, cy, m, [o]));
  }

  function getObstacles(world, wi, W, H) {
    const wallCol = world && world.theme && world.theme.wall;
    const obs = buildLayout(pickLayout(world, wi), W || 2200, H || 2200, wallCol);
    return ensureSpawnClear(obs, W || 2200, H || 2200, SPAWN_PAD);
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

  function findSafeSpawn(W, H, r, obs, border) {
    const pad = border || 120;
    const margin = r + 28;
    const cx = W * 0.5, cy = H * 0.5;
    if (isCircleFree(cx, cy, margin, obs)) return { x: cx, y: cy };
    for (let ring = 1; ring <= 28; ring++) {
      const dist = ring * 56;
      const pts = 6 + ring * 2;
      for (let i = 0; i < pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        const x = cx + Math.cos(a) * dist;
        const y = cy + Math.sin(a) * dist;
        if (x < pad + margin || y < pad + margin || x > W - pad - margin || y > H - pad - margin) continue;
        if (isCircleFree(x, y, margin, obs)) return { x, y };
      }
    }
    return { x: cx, y: cy };
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
      const rad = Math.min(o.w, o.h) * 0.12;
      g.beginPath();
      if (g.roundRect) {
        g.roundRect(o.x, o.y, o.w, o.h, rad);
      } else {
        g.rect(o.x, o.y, o.w, o.h);
      }
      g.fill();
      g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.08)';
      g.fillRect(o.x + 4, o.y + 4, o.w * 0.35, o.h * 0.2);
    }
  }

  window.WorldMapLayout = {
    getObstacles, resolveCircle, drawObstacles, pickLayout, pickExtendedLayout,
    isCircleFree, circleHitsObs, findSafeSpawn, ensureSpawnClear,
    findSafeArena, stripObsInArena, arenaObstacleScore,
  };
})();
