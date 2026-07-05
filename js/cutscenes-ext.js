'use strict';
// Cutscenes before/after every world + challenger — driven by campaign storyline.

const WorldCine = (function () {
  const DUR = { introFull: 14, outroFull: 11, introQuick: 9.5, outroQuick: 8.5, chalIn: 9, chalOut: 8.5 };
  let t = 0, done = null, kind = null, wi = 0, isChal = false;

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

  function drawLetterbox() {
    const bar = Math.round(H * 0.06);
    cx.fillStyle = '#000';
    cx.fillRect(0, 0, W, bar);
    cx.fillRect(0, H - bar, W, bar);
  }

  function backdrop(w) {
    const th = w && w.theme ? w.theme : { bg: '#4a6e32', tile1: '#7ec850', tile2: '#6ab840', void: '#3d5c28' };
    cx.fillStyle = th.void || th.bg;
    cx.fillRect(0, 0, W, H);
    cx.fillStyle = th.tile1;
    const ts = 64;
    for (let gy = 0; gy < H; gy += ts) {
      for (let gx = 0; gx < W; gx += ts) {
        if (((gx / ts + gy / ts) & 1)) cx.fillRect(gx, gy, ts, ts);
      }
    }
    cx.fillStyle = th.tile2;
    for (let gy = 0; gy < H; gy += ts * 2) {
      for (let gx = 0; gx < W; gx += ts * 2) {
        if (!(((gx / ts + gy / ts) & 1))) cx.fillRect(gx + ts * 0.25, gy + ts * 0.25, ts * 0.5, ts * 0.5);
      }
    }
    if (w && w.enemyTint) {
      cx.globalAlpha = 0.12;
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

  function drawVisEffect(effect) {
    const n = 36;
    for (let i = 0; i < n; i++) {
      const px = (i / n) * W + Math.sin(t * 2 + i) * 30;
      const py = (i * 47 + t * 40) % H;
      cx.globalAlpha = 0.15 + 0.1 * Math.sin(t * 3 + i);
      if (effect === 'embers' || effect === 'sparks') {
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

  function drawHero(bob) {
    const e = entranceEase(1.4);
    const hx = W * (0.22 + (1 - e) * -0.18);
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
    const slide = kind === 'outro' || kind === 'chal_out' ? Math.min(1, t / 2.5) * W * 0.4 : 0;
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
    kind = kindIn; wi = worldIndex; done = onDone; t = 0; isChal = !!challenger;
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
    if (k === 'intro') return isMilestoneWorld() ? DUR.introFull : DUR.introQuick;
    if (k === 'outro') return isMilestoneWorld() ? DUR.outroFull : DUR.outroQuick;
    if (k === 'chal_in') return DUR.chalIn;
    return DUR.chalOut;
  }

  function update(dt) {
    t += dt;
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
    backdrop(w);
    camDrift();
    drawVisEffect(st.vis);

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

    drawLetterbox();

    if (t > maxFadeStart()) {
      cx.globalAlpha = Math.min(1, (t - maxFadeStart()) / 1.1);
      cx.fillStyle = '#000';
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
