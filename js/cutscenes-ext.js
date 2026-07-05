'use strict';
// Cutscenes before/after every world + challenger — driven by campaign storyline.

const WorldCine = (function () {
  const DUR = { act1In: 15, act1Out: 12.5, introFull: 14, outroFull: 11, introQuick: 9.5, outroQuick: 8.5, chalIn: 9, chalOut: 8.5 };
  let t = 0, done = null, kind = null, wi = 0, isChal = false, cheerPlayed = false;

  function seenKey(k) { return 'br_cine_' + k; }
  function markSeen(k) { try { localStorage.setItem(seenKey(k), '1'); } catch (e) {} }
  function wasSeen(k) { try { return !!localStorage.getItem(seenKey(k)); } catch (e) { return false; } }

  function storyFor(w) {
    if (typeof getWorldStory === 'function' && w) return getWorldStory(wi, w);
    return { introBeats: [], outroBeats: [], chalIntroBeats: [], chalOutroBeats: [], vis: 'sparks', heroLine: '' };
  }

  function captionBeat(b) {
    caption(b.text, b.t0, b.t1, H * b.y, b);
  }

  function caption(str, t0, t1, y, opts) {
    const a = t < t0 || t > t1 ? 0 : Math.min(1, (t - t0) / 0.4, (t1 - t) / 0.4);
    if (a <= 0) return;
    const big = opts && opts.big;
    const dim = opts && opts.dim;
    const title = opts && opts.title;
    let fs = Math.round(Math.min(W, H) * (title ? 0.052 : big ? 0.046 : 0.036));
    cx.textAlign = 'center';
    cx.font = '900 ' + fs + 'px sans-serif';
    const maxW = W * 0.9;
    if (cx.measureText(str).width > maxW) {
      fs = Math.max(11, Math.floor(fs * maxW / cx.measureText(str).width));
      cx.font = '900 ' + fs + 'px sans-serif';
    }
    const pop = title ? Math.min(1, (t - t0) / 0.5) : 1;
    cx.save();
    if (title) {
      cx.translate(W / 2, y);
      cx.scale(0.88 + pop * 0.12, 0.88 + pop * 0.12);
      cx.translate(-W / 2, -y);
      const barW = Math.min(W * 0.6, cx.measureText(str).width + 48);
      cx.globalAlpha = a * 0.4;
      cx.fillStyle = '#000';
      cx.fillRect(W / 2 - barW / 2, y - fs * 0.8, barW, fs * 1.2);
    }
    cx.globalAlpha = a * (dim ? 0.85 : 1);
    cx.lineWidth = title ? 7 : big ? 6 : 4;
    cx.strokeStyle = '#000';
    cx.strokeText(str, W / 2, y);
    cx.fillStyle = title ? '#ffe878' : dim ? '#d8e8ff' : '#fff';
    cx.fillText(str, W / 2, y);
    cx.globalAlpha = 1;
    cx.restore();
  }

  function worldData(i) { return (typeof WORLDS !== 'undefined' && WORLDS[i]) ? WORLDS[i] : null; }

  function camDrift() {
    const dx = Math.sin(t * 0.35) * 12;
    const dy = Math.cos(t * 0.28) * 8;
    const sc = 1 + Math.sin(t * 0.2) * 0.02;
    cx.translate(W / 2 + dx, H / 2 + dy);
    cx.scale(sc, sc);
    cx.translate(-W / 2, -H / 2);
  }

  function isArcCine() {
    if (isChal) return false;
    if (typeof isArcWorld === 'function') return isArcWorld(wi);
    return wi >= 0 && wi < 50;
  }

  function scenePhase() {
    if (!isArcCine()) return 'default';
    const outro = kind === 'outro';
    if (outro) {
      if (t < 3.2) return 'victory';
      if (t < 7) return 'celebrate';
      if (t < 10.5) return 'tease';
      return 'fade';
    }
    if (t < 3.5) return 'peace';
    if (t < 8) return 'invasion';
    if (t < 11.5) return 'chaos';
    return 'hero';
  }

  function sceneEase(maxT) {
    const e = typeof easeOut === 'function' ? easeOut : function (x) { return 1 - (1 - x) * (1 - x); };
    return e(Math.min(1, t / maxT));
  }

  function applySceneShake() {
    const ph = scenePhase();
    if (ph !== 'chaos' || !isArcCine()) return;
    const ramp = Math.min(1, Math.max(0, (t - 7) / 2.5));
    const amt = ramp * 9;
    if (amt > 0 && typeof rand === 'function') {
      cx.translate(rand(-amt, amt), rand(-amt, amt));
    }
  }

  const PEACE_NPCS = [
    { x: 0.22, y: 0.68, p: 0 }, { x: 0.38, y: 0.74, p: 1.2 }, { x: 0.55, y: 0.66, p: 2.1 },
    { x: 0.68, y: 0.72, p: 0.6 }, { x: 0.44, y: 0.58, p: 3.0 },
  ];

  function drawPeacefulNPCs(flee) {
    const fleeT = flee ? Math.max(0, t - 7) : 0;
    for (const h of PEACE_NPCS) {
      const wob = Math.sin((t + h.p) * 1.5) * 8;
      const fx = fleeT > 0 ? -fleeT * fleeT * 220 : 0;
      const hx = h.x * W + wob + fx;
      const hy = h.y * H;
      cx.fillStyle = '#e0c39a';
      cx.beginPath(); cx.arc(hx, hy, 7, 0, TAU); cx.fill();
      cx.fillStyle = '#3a2d22';
      cx.beginPath(); cx.arc(hx, hy - 9, 5, 0, TAU); cx.fill();
    }
  }

  function drawZoneDecor(w) {
    const id = w && w.id ? w.id : 'grass';
    const th = w && w.theme ? w.theme : {};
    cx.save();
    if (id === 'citrus') {
      cx.fillStyle = th.accent || '#fff0a0';
      for (let i = 0; i < 5; i++) {
        const tx = W * (0.12 + i * 0.18);
        cx.beginPath(); cx.arc(tx, H * 0.42, 22, 0, TAU); cx.fill();
        cx.fillStyle = '#5a9a30';
        cx.fillRect(tx - 4, H * 0.42, 8, H * 0.22);
        cx.fillStyle = th.accent || '#fff0a0';
      }
    } else if (id === 'forest') {
      cx.fillStyle = '#3d6a28';
      for (let i = 0; i < 6; i++) {
        const tx = W * (0.08 + i * 0.16);
        cx.beginPath();
        cx.moveTo(tx, H * 0.38); cx.lineTo(tx - 28, H * 0.68); cx.lineTo(tx + 28, H * 0.68);
        cx.closePath(); cx.fill();
      }
    } else if (id === 'glacier') {
      cx.fillStyle = 'rgba(200,235,255,0.55)';
      for (let i = 0; i < 4; i++) {
        const bx = W * (0.15 + i * 0.22);
        cx.beginPath();
        cx.moveTo(bx, H * 0.55); cx.lineTo(bx - 50, H * 0.72); cx.lineTo(bx + 50, H * 0.72);
        cx.closePath(); cx.fill();
      }
    } else if (id === 'circo') {
      cx.fillStyle = '#e8463c';
      cx.fillRect(W * 0.2, H * 0.28, W * 0.6, 14);
      cx.fillStyle = '#ffd838';
      for (let i = 0; i < 8; i++) cx.fillRect(W * 0.2 + i * (W * 0.075), H * 0.28 + (i % 2) * 14, W * 0.037, 14);
      cx.strokeStyle = '#fff'; cx.lineWidth = 3;
      cx.beginPath(); cx.moveTo(W * 0.5, H * 0.28); cx.lineTo(W * 0.5, H * 0.62); cx.stroke();
    } else if (id === 'autumn') {
      cx.fillStyle = '#c87828';
      for (let i = 0; i < 7; i++) {
        const tx = W * (0.1 + i * 0.13);
        cx.beginPath(); cx.arc(tx, H * 0.4, 16, 0, TAU); cx.fill();
        cx.fillStyle = i % 2 ? '#e89030' : '#a05818';
        cx.fillRect(tx - 3, H * 0.4, 6, H * 0.2);
        cx.fillStyle = '#c87828';
      }
    } else if (id === 'swamp') {
      cx.fillStyle = 'rgba(60,120,40,0.45)';
      for (let i = 0; i < 5; i++) {
        cx.beginPath(); cx.ellipse(W * (0.15 + i * 0.17), H * 0.62, 55, 18, 0, 0, TAU); cx.fill();
      }
    } else if (id === 'sky') {
      cx.fillStyle = 'rgba(255,255,255,0.35)';
      for (let i = 0; i < 4; i++) {
        const cxp = W * (0.2 + i * 0.2);
        const cyp = H * (0.35 + (i % 2) * 0.12);
        cx.beginPath(); cx.ellipse(cxp, cyp, 48, 22, 0, 0, TAU); cx.fill();
      }
    } else if (id === 'crystal') {
      cx.fillStyle = 'rgba(180,120,255,0.5)';
      for (let i = 0; i < 6; i++) {
        const bx = W * (0.12 + i * 0.15);
        cx.beginPath();
        cx.moveTo(bx, H * 0.32); cx.lineTo(bx - 14, H * 0.62); cx.lineTo(bx + 14, H * 0.62);
        cx.closePath(); cx.fill();
      }
    } else if (id === 'volcano') {
      cx.fillStyle = '#e85030';
      cx.beginPath();
      cx.moveTo(W * 0.5, H * 0.3); cx.lineTo(W * 0.32, H * 0.68); cx.lineTo(W * 0.68, H * 0.68);
      cx.closePath(); cx.fill();
      cx.fillStyle = 'rgba(255,180,60,0.35)';
      cx.beginPath(); cx.ellipse(W * 0.5, H * 0.58, 40, 14, 0, 0, TAU); cx.fill();
    } else if (id === 'dirt') {
      cx.fillStyle = 'rgba(100,70,30,0.45)';
      for (let i = 0; i < 4; i++) {
        cx.fillRect(W * (0.15 + i * 0.2), H * 0.35, 28, H * 0.35);
        cx.beginPath(); cx.arc(W * (0.15 + i * 0.2) + 14, H * 0.35, 18, Math.PI, 0); cx.fill();
      }
    } else if (wi >= 11) {
      cx.fillStyle = th.accent || th.tint || '#b06ff0';
      for (let i = 0; i < 7; i++) {
        const tx = W * (0.08 + i * 0.13);
        const hgt = 50 + (i % 4) * 22;
        cx.fillRect(tx, H * 0.68 - hgt, 16, hgt);
        cx.beginPath(); cx.moveTo(tx - 8, H * 0.68 - hgt); cx.lineTo(tx + 8, H * 0.68 - hgt - 20); cx.lineTo(tx + 24, H * 0.68 - hgt); cx.fill();
      }
    } else {
      cx.fillStyle = 'rgba(90,150,50,0.35)';
      for (let i = 0; i < 8; i++) {
        cx.beginPath(); cx.arc(W * (0.1 + i * 0.11), H * 0.48, 10 + (i % 3) * 4, 0, TAU); cx.fill();
      }
    }
    cx.restore();
  }

  function drawInvasionMarch(w) {
    if (typeof SP === 'undefined') return;
    const foes = w && w.foes && w.foes.length ? w.foes : [];
    const sprs = foes.length ? foes.map(f => f.spr) : ['swarmmite', 'swarmwasp', 'swarmbeetle'];
    const e = sceneEase(2.8);
    const boss = w && w.bosses && w.bosses.length ? w.bosses[w.bosses.length - 1] : null;
    const bossX = W * 1.12 - e * (W * 0.58);
    const bossY = H * 0.54;
    for (let i = 0; i < 8; i++) {
      const lag = 0.4 + i * 0.16;
      const eFn = typeof easeOut === 'function' ? easeOut : function (x) { return 1 - (1 - x) * (1 - x); };
      const e2 = eFn(Math.min(1, Math.max(0, (t - lag) / 2.5)));
      const ax = W * 1.2 - e2 * (W * 0.55) + Math.sin(i * 1.5) * 24;
      const ay = bossY + 60 + (i % 3) * 22 - 22;
      const s = sprs[i % sprs.length];
      if (SP[s]) drawSprite(s, ax, ay, 44, Math.sin(t * 3 + i) * 0.1, 0, 0, i % 2 === 0, w ? w.enemyTint : null);
    }
    if (boss && SP[boss.spr]) {
      drawSprite(boss.spr, bossX, bossY, 105 + Math.sin(t * 2) * 6, Math.sin(t * 2.5) * 0.04, 0, 0, false, null);
    }
  }

  function drawChaosFlash() {
    if (t < 7 || t > 11.5) return;
    const ramp = Math.min(1, Math.max(0, (t - 7) / 1.5));
    cx.globalAlpha = (0.12 + 0.08 * Math.sin(t * 14)) * ramp;
    cx.fillStyle = wi === 4 ? '#ff6040' : '#ff2828';
    cx.fillRect(0, 0, W, H);
    cx.globalAlpha = 1;
  }

  function drawSwarmRetreat(w) {
    if (typeof SP === 'undefined') return;
    const foes = w && w.foes && w.foes.length ? w.foes : [];
    const sprs = foes.length ? foes.map(f => f.spr) : ['swarmmite', 'swarmwasp'];
    const e = sceneEase(2.2);
    const slide = e * W * 0.65;
    for (let i = 0; i < 8; i++) {
      const s = sprs[i % sprs.length];
      if (!SP[s]) continue;
      const ex = W * (0.35 + (i / 7) * 0.4) + slide;
      const ey = H * 0.7 + (i % 3) * 14;
      drawSprite(s, ex, ey, 40, Math.PI, 0, 0, true, w ? w.enemyTint : null);
    }
  }

  function renderAct1Intro(w, st) {
    const ph = scenePhase();
    backdrop(w);
    camDrift();
    drawZoneDecor(w);

    if (ph === 'peace') {
      drawPeacefulNPCs(false);
      drawVisEffect(st.vis);
    } else if (ph === 'invasion') {
      drawPeacefulNPCs(true);
      drawBrainrotOverlay(w);
      drawInvasionMarch(w);
      drawVisEffect(st.vis);
      drawHero(Math.sin(t * 2) * 2, 0.18);
    } else if (ph === 'chaos') {
      applySceneShake();
      drawBrainrotOverlay(w);
      drawChaosFlash();
      drawSwarmArmy(w);
      drawBossSilhouette(w, 12);
      drawVisEffect('brainrot');
    } else {
      const heroBob = Math.sin(t * 2.5) * 4;
      const heroRise = sceneEase(1.2);
      drawSwarmArmy(w);
      drawBossSilhouette(w, 10);
      drawHero(heroBob, 0.22 + (1 - heroRise) * -0.08);
      if (st.allyChar) drawAlly(st, Math.sin(t * 2.8) * 3);
      if (wi === 0 && t > 11.2) {
        cx.globalAlpha = 0.45 * heroRise * (0.6 + 0.4 * Math.sin(t * 5));
        cx.strokeStyle = '#9fe0ff'; cx.lineWidth = 4;
        cx.beginPath(); cx.arc(W * 0.22, H * 0.62 + heroBob, 56, 0, TAU); cx.stroke();
        cx.globalAlpha = 1;
      }
    }
    renderBeats(st.introBeats);
  }

  function renderAct1Outro(w, st) {
    const ph = scenePhase();
    backdrop(w);
    camDrift();

    if (ph === 'victory') {
      drawBossSilhouette(w, 4);
      const fall = Math.min(1, t / 2.5);
      cx.globalAlpha = 0.5 * fall;
      cx.fillStyle = w.enemyTint || '#ff5a70';
      cx.beginPath(); cx.ellipse(W * 0.5, H * 0.68, 80, 24, 0, 0, TAU); cx.fill();
      cx.globalAlpha = 1;
      drawHero(Math.sin(t * 2) * 2, 0.24);
    } else if (ph === 'celebrate') {
      drawHero(Math.sin(t * 2) * 3, 0.24);
      if (st.allyChar) drawAlly(st, Math.sin(t * 2.5) * 2);
      drawVisEffect(st.vis);
      drawVisEffect('applause');
      drawVisEffect('confetti');
    } else if (ph === 'tease') {
      drawSwarmRetreat(w);
      drawHero(Math.sin(t * 1.8) * 2, 0.26);
      drawVisEffect('applause');
    } else {
      drawHero(Math.sin(t * 1.5) * 2, 0.28);
    }
    renderBeats(st.outroBeats);
  }

  function drawEdgeVignette(w) {
    const th = w && w.theme ? w.theme : { void: '#1a2838' };
    const c = th.void || th.bg || '#1a2838';
    const g = cx.createLinearGradient(0, 0, 0, H * 0.14);
    g.addColorStop(0, c + '55');
    g.addColorStop(1, c + '00');
    cx.fillStyle = g;
    cx.fillRect(0, 0, W, H * 0.14);
    const g2 = cx.createLinearGradient(0, H, 0, H * 0.86);
    g2.addColorStop(0, c + '55');
    g2.addColorStop(1, c + '00');
    cx.fillStyle = g2;
    cx.fillRect(0, H * 0.86, W, H * 0.14);
  }

  function backdrop(w) {
    const th = w && w.theme ? w.theme : { bg: '#4a6e32', tile1: '#7ec850', tile2: '#6ab840', void: '#3d5c28' };
    const pat = th.groundPattern || 'checker';
    const phase = (wi * 17 + 31) | 0;
    cx.fillStyle = th.void || th.bg;
    cx.fillRect(0, 0, W, H);
    const ts = 64;
    for (let gy = 0; gy < H; gy += ts) {
      for (let gx = 0; gx < W; gx += ts) {
        const tx = (gx / ts) | 0, ty = (gy / ts) | 0;
        let alt = false;
        if (pat === 'stripe') alt = ((tx + phase) % 3) !== 1;
        else if (pat === 'diamond') alt = ((tx + ty) % 3 + (tx * ty) % 2) % 2 === 0;
        else if (pat === 'dots') alt = ((tx * 7 + ty * 13 + phase) % 5) < 2;
        else if (pat === 'wave') alt = Math.sin(tx * 0.45 + ty * 0.3 + phase * 0.1) > 0;
        else alt = ((tx + ty) & 1) === 0;
        cx.fillStyle = alt ? th.tile1 : th.tile2;
        cx.fillRect(gx, gy, ts, ts);
      }
    }
    if (th.accent) {
      cx.globalAlpha = 0.2;
      cx.fillStyle = th.accent;
      for (let i = 0; i < 24; i++) {
        const ax = (i * 173 + phase * 11) % W;
        const ay = (i * 97 + phase * 7) % H;
        cx.beginPath(); cx.arc(ax, ay, 8 + (i % 4), 0, TAU); cx.fill();
      }
      cx.globalAlpha = 1;
    }
    if (w && w.enemyTint) {
      cx.globalAlpha = kind === 'intro' || kind === 'chal_in' ? 0.18 : 0.08;
      cx.fillStyle = w.enemyTint;
      cx.fillRect(0, 0, W, H);
      cx.globalAlpha = 1;
    }
    const g = cx.createRadialGradient(W / 2, H * 0.55, W * 0.1, W / 2, H * 0.55, W * 0.7);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.18)');
    cx.fillStyle = g;
    cx.fillRect(0, 0, W, H);
  }

  function drawBrainrotOverlay(w) {
    if (kind !== 'intro' && kind !== 'chal_in') return;
    const tint = w && w.enemyTint ? w.enemyTint : '#e04090';
    cx.globalAlpha = 0.12 + 0.06 * Math.sin(t * 3.5);
    cx.fillStyle = tint;
    cx.fillRect(0, 0, W, H);
    cx.globalAlpha = 1;
    for (let i = 0; i < 14; i++) {
      const bx = (i * 137 + t * 60) % W;
      const by = H * 0.15 + ((i * 83 + t * 35) % (H * 0.55));
      cx.globalAlpha = 0.25 + 0.15 * Math.sin(t * 4 + i);
      cx.fillStyle = tint;
      cx.beginPath();
      cx.ellipse(bx, by, 28 + (i % 5) * 8, 18 + (i % 3) * 6, t * 0.3 + i, 0, TAU);
      cx.fill();
      cx.globalAlpha = 1;
    }
  }

  function drawApplauseCrowd() {
    if (kind !== 'outro' && kind !== 'chal_out') return;
    const e = Math.min(1, Math.max(0, (t - 2.4) / 1.2));
    if (e <= 0) return;
    const baseY = H * 0.86;
    for (let i = 0; i < 14; i++) {
      const px = W * (0.06 + (i / 13) * 0.88);
      const wave = Math.sin(t * 6 + i * 0.8) * 6 * e;
      const bodyH = 34 + (i % 3) * 6;
      cx.globalAlpha = 0.55 + 0.35 * e;
      cx.fillStyle = i % 2 ? '#f0d890' : '#e8c0a0';
      cx.fillRect(px - 10, baseY - bodyH + wave, 20, bodyH);
      cx.fillStyle = '#f5e0c8';
      cx.beginPath(); cx.arc(px, baseY - bodyH - 10 + wave, 11, 0, TAU); cx.fill();
      cx.strokeStyle = '#3a2d22'; cx.lineWidth = 2;
      const armY = baseY - bodyH + 8 + wave;
      for (const sx of [-1, 1]) {
        cx.beginPath();
        cx.moveTo(px + sx * 8, armY);
        cx.lineTo(px + sx * 18, armY - 16 - Math.abs(Math.sin(t * 8 + i)) * 10);
        cx.stroke();
      }
      cx.globalAlpha = 1;
    }
    cx.globalAlpha = 0.35 * e;
    cx.font = '900 ' + Math.round(H * 0.04) + 'px sans-serif';
    cx.fillStyle = '#ffe878';
    cx.textAlign = 'center';
    for (let i = 0; i < 8; i++) {
      const cxp = W * (0.1 + i * 0.11);
      const cyp = H * 0.12 + Math.sin(t * 5 + i) * 12;
      cx.fillText(i % 2 ? '★' : '♥', cxp, cyp);
    }
    cx.globalAlpha = 1;
  }

  function drawVisEffect(effect) {
    if (effect === 'applause') { drawApplauseCrowd(); return; }
    const n = effect === 'brainrot' || effect === 'confetti' ? 48 : 36;
    for (let i = 0; i < n; i++) {
      const px = (i / n) * W + Math.sin(t * 2 + i) * 30;
      const py = (i * 47 + t * 40) % H;
      cx.globalAlpha = 0.15 + 0.1 * Math.sin(t * 3 + i);
      if (effect === 'confetti') {
        const cols = ['#ff4080', '#ffe040', '#40c8ff', '#80ff60', '#ff8040'];
        cx.fillStyle = cols[i % cols.length];
        cx.save(); cx.translate(px, py); cx.rotate(t * 2 + i);
        cx.fillRect(-4, -2, 8, 4); cx.restore();
      } else if (effect === 'brainrot') {
        cx.fillStyle = i % 2 ? '#e040a0' : '#80ff40';
        cx.beginPath(); cx.arc(px, py, 3 + (i % 4), 0, TAU); cx.fill();
        cx.globalAlpha = 0.2;
        cx.strokeStyle = '#ff60c0'; cx.lineWidth = 1.5;
        cx.beginPath(); cx.moveTo(px, py); cx.lineTo(px + Math.sin(t * 5 + i) * 20, py + 14); cx.stroke();
      } else if (effect === 'embers' || effect === 'sparks') {
        cx.fillStyle = effect === 'embers' ? '#ff7a3a' : '#ffe08a';
        cx.beginPath(); cx.arc(px, py, 2 + (i % 3), 0, TAU); cx.fill();
      } else if (effect === 'rain' || effect === 'toxic') {
        cx.strokeStyle = effect === 'rain' ? '#9fd0ff' : '#7ab955';
        cx.lineWidth = 2;
        cx.beginPath(); cx.moveTo(px, py); cx.lineTo(px - 8, py + 22); cx.stroke();
      } else if (effect === 'frost') {
        cx.fillStyle = '#cfeaff';
        cx.fillRect(px, py, 3, 3);
      } else if (effect === 'void') {
        cx.fillStyle = '#b06ff0';
        cx.beginPath(); cx.arc(px, py, 3, 0, TAU); cx.fill();
      } else if (effect === 'static') {
        cx.fillStyle = i % 2 ? '#e8f0ff' : '#a8c0ff';
        cx.fillRect(px, py, 2 + (i % 3), 2);
      } else {
        cx.fillStyle = '#c8f0a0';
        cx.beginPath(); cx.arc(px, py, 2.5, 0, TAU); cx.fill();
      }
      cx.globalAlpha = 1;
    }
  }

  function entranceEase(maxT) {
    return Math.min(1, t / maxT);
  }

  function drawAlly(st, bob) {
    if (!st.allyChar || typeof drawCharacter !== 'function') return;
    const e = entranceEase(1.8);
    const ax = W * (0.62 + (1 - e) * 0.2);
    const ay = H * 0.6 + bob;
    cx.strokeStyle = 'rgba(255,220,80,0.7)';
    cx.lineWidth = 3;
    cx.beginPath(); cx.arc(ax, ay, 48, 0, TAU); cx.stroke();
    drawCharacter(st.allyChar.id, ax, ay, 86, Math.sin(t * 2.2) * 0.04, true);
    for (const b of st.introBeats || []) {
      if (b.ally && t >= b.t0 && t <= b.t1) {
        caption(b.text, b.t0, b.t1, H * 0.9, { big: true });
        break;
      }
    }
  }

  function drawHero(bob, xNorm) {
    const e = entranceEase(1.4);
    const baseX = xNorm != null ? xNorm : 0.22;
    const hx = W * (baseX + (1 - e) * -0.18);
    const hy = H * 0.62 + bob;
    if (typeof drawCharacter === 'function') {
      drawCharacter(typeof activeCharId !== 'undefined' ? activeCharId : 'gianni', hx, hy, 95, Math.sin(t * 2) * 0.04, false);
    } else if (typeof SP !== 'undefined' && SP.player) {
      drawSprite('player', hx, hy, 95, 0, 0, 0, false, null);
    }
    cx.strokeStyle = 'rgba(255,255,255,0.55)';
    cx.lineWidth = 3;
    cx.beginPath(); cx.arc(hx, hy, 52, 0, TAU); cx.stroke();
  }

  function drawSwarmArmy(w) {
    if (typeof SP === 'undefined') return;
    const foes = w && w.foes && w.foes.length ? w.foes : [];
    const sprs = foes.length
      ? foes.map(f => f.spr)
      : ['swarmmite', 'swarmwasp', 'swarmbeetle', 'swarmmoth'];
    const march = entranceEase(2.2);
    const slide = kind === 'outro' || kind === 'chal_out' ? Math.min(1, t / 2.5) * W * 0.55 : 0;
    for (let i = 0; i < 10; i++) {
      const s = sprs[i % sprs.length];
      if (!SP[s]) continue;
      const ex = W * (0.48 + march * 0.35) + (i / 9) * W * 0.32 + Math.sin(t * 2.2 + i * 1.3) * 18 + slide;
      const ey = H * 0.68 + (i % 3) * 16 + Math.sin(t * 3 + i) * 6;
      cx.strokeStyle = 'rgba(0,0,0,0.5)';
      cx.lineWidth = 3;
      cx.beginPath(); cx.arc(ex, ey, 24, 0, TAU); cx.stroke();
      drawSprite(s, ex, ey, 46, Math.sin(t * 3 + i) * 0.08, 0, 0, i % 2 === 0, w ? w.enemyTint : null);
    }
  }

  function drawBossSilhouette(w, bob) {
    if (!w || !w.bosses || !w.bosses.length || typeof SP === 'undefined') return;
    const b = kind === 'intro' || kind === 'chal_in' ? w.bosses[w.bosses.length - 1] : w.bosses[0];
    if (!b || !SP[b.spr]) return;
    const rise = entranceEase(2.8);
    const bx = W * 0.5, by = H * (0.52 + (1 - rise) * 0.12) + Math.sin(t * 2.5) * bob;
    const pulse = 1 + Math.sin(t * 4) * 0.04;
    cx.globalAlpha = 0.35 * rise;
    cx.fillStyle = w.enemyTint || '#ff5a70';
    cx.beginPath(); cx.arc(bx, by, 70 * pulse, 0, TAU); cx.fill();
    cx.globalAlpha = 1;
    cx.strokeStyle = '#fff';
    cx.lineWidth = 4;
    cx.beginPath(); cx.arc(bx, by, 58 * pulse, 0, TAU); cx.stroke();
    drawSprite(b.spr, bx, by, 115 * pulse * rise, 0, 0, 0, false, null);
    const bossCapEnd = durFor(kind) - 0.5;
    if (t > 1.4 && t < bossCapEnd) {
      caption(b.name, 1.4, bossCapEnd, H * 0.32, { dim: true });
    }
  }

  function start(kindIn, worldIndex, onDone, challenger) {
    kind = kindIn; wi = worldIndex; done = onDone; t = 0; isChal = !!challenger; cheerPlayed = false;
    state = kindIn === 'outro' || kindIn === 'chal_out' ? ST.OUTRO : ST.INTRO;
    $('menu') && $('menu').classList.add('hidden');
    $('introskip') && $('introskip').classList.remove('hidden');
    if (typeof playMusic === 'function') {
      const w = worldData(wi);
      playMusic(w && w.theme ? w.theme.music : 'boss0');
    }
    shake = 0;
  }

  function finish() {
    $('introskip') && $('introskip').classList.add('hidden');
    const k = kind, w = wi;
    if (k === 'intro') markSeen('in_' + w);
    else if (k === 'outro') markSeen('out_' + w);
    else if (k === 'chal_in') markSeen('chal_in_' + w);
    else if (k === 'chal_out') markSeen('chal_out_' + w);
    kind = null;
    const cb = done; done = null;
    if (cb) cb();
  }

  function isMilestoneWorld() {
    const st = storyFor(worldData(wi));
    return !!(st && st.milestone);
  }

  function durFor(k) {
    if (isArcCine()) {
      if (k === 'intro') return DUR.act1In;
      if (k === 'outro') return DUR.act1Out;
    }
    if (k === 'intro') return isMilestoneWorld() ? DUR.introFull : DUR.introQuick;
    if (k === 'outro') return isMilestoneWorld() ? DUR.outroFull : DUR.outroQuick;
    if (k === 'chal_in') return DUR.chalIn;
    return DUR.chalOut;
  }

  function update(dt) {
    t += dt;
    if ((kind === 'outro' || kind === 'chal_out') && t > 3.0 && !cheerPlayed) {
      cheerPlayed = true;
      if (typeof sfx !== 'undefined' && sfx.cheer) sfx.cheer();
    }
    if (t >= durFor(kind)) finish();
  }

  function renderBeats(beats) {
    for (const b of beats) {
      if (b.ally) continue;
      caption(b.text, b.t0, b.t1, H * b.y, b);
    }
  }

  function render() {
    const w = worldData(wi);
    const st = storyFor(w);
    cx.save();

    if (isArcCine() && kind === 'intro') {
      renderAct1Intro(w, st);
    } else if (isArcCine() && kind === 'outro') {
      renderAct1Outro(w, st);
    } else {
      backdrop(w);
      camDrift();
      if (kind === 'intro' || kind === 'chal_in') drawBrainrotOverlay(w);
      drawVisEffect(st.vis);
      if (kind === 'outro' || kind === 'chal_out') drawVisEffect('applause');

      if (kind === 'intro' || kind === 'chal_in') {
        drawSwarmArmy(w);
        drawBossSilhouette(w, 10);
        drawHero(Math.sin(t * 2.5) * 4);
        if (st.allyChar) drawAlly(st, Math.sin(t * 2.8) * 3);
        if (st.heroLine && t > 0.8 && t < 4.5) caption(st.heroLine, 0.8, 4.2, H * 0.9, { dim: true });
        renderBeats(isChal ? st.chalIntroBeats : st.introBeats);
      } else {
        drawBossSilhouette(w, 6);
        drawSwarmArmy(w);
        drawHero(Math.sin(t * 2) * 3);
        if (st.allyChar) drawAlly(st, Math.sin(t * 2) * 2);
        renderBeats(isChal ? st.chalOutroBeats : st.outroBeats);
      }
    }

    drawEdgeVignette(w);

    if (t > maxFadeStart()) {
      const th = w && w.theme ? w.theme : { void: '#1a2838' };
      cx.globalAlpha = Math.min(1, (t - maxFadeStart()) / 1.1);
      cx.fillStyle = th.void || th.bg || '#1a2838';
      cx.fillRect(0, 0, W, H);
    }
    cx.restore();
  }

  function maxFadeStart() {
    const d = durFor(kind);
    return Math.max(4, d - 1.4);
  }

  function beforeStart(worldIndex, mode, onReady) {
    if (mode === 'practice') { onReady(); return; }
    if (mode === 'challenger') {
      if (wasSeen('chal_in_' + worldIndex)) { onReady(); return; }
      start('chal_in', worldIndex, onReady, true);
      return;
    }
    if (mode !== 'story') { onReady(); return; }
    if (worldIndex === 0 && !localStorage.getItem('br_seen_intro')) {
      if (typeof startIntro === 'function') startIntro(onReady);
      else onReady();
      return;
    }
    if (wasSeen('in_' + worldIndex)) { onReady(); return; }
    start('intro', worldIndex, onReady, false);
  }

  function afterClear(clearData, onDone) {
    if (!clearData || clearData.isPractice) { onDone(); return; }
    const w = clearData.worldNum - 1;
    if (clearData.isChallenger) {
      if (wasSeen('chal_out_' + w)) { onDone(); return; }
      start('chal_out', w, onDone, true);
      return;
    }
    if (clearData.isW1 && !localStorage.getItem('br_seen_w1outro')) {
      localStorage.setItem('br_seen_w1outro', '1');
      if (typeof startW1Outro === 'function') { startW1Outro(onDone); return; }
    }
    if (wasSeen('out_' + w)) { onDone(); return; }
    start('outro', w, onDone, false);
  }

  function skip() { finish(); }
  function isActive() { return kind != null; }

  return { beforeStart, afterClear, update, render, skip, isActive };
})();

window.WorldCine = WorldCine;
