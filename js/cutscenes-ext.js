'use strict';
// Cutscenes before/after every world + challenger, with per-world FX and scene layouts.

const WorldCine = (function () {
  const DUR = { introFull: 14, outroFull: 11, introQuick: 9.5, outroQuick: 8.5, chalIn: 9, chalOut: 8.5 };
  let t = 0, done = null, kind = null, wi = 0, isChal = false, lastSceneIdx = -1;
  let specialScenes = null;

  function scenesFor(st) {
    if (specialScenes) return specialScenes;
    if (isChal) {
      if (kind === 'chal_in') return st.chalIntroScenes || [];
      if (kind === 'chal_out') return st.chalOutroScenes || [];
      return [];
    }
    if (kind === 'intro') return st.introScenes || [];
    if (kind === 'outro') return st.outroScenes || [];
    return [];
  }

  function sceneAt(st) {
    const scenes = scenesFor(st);
    if (!scenes.length) return { scene: null, localT: t, idx: 0, scenes };
    let acc = 0;
    for (let i = 0; i < scenes.length; i++) {
      if (t < acc + scenes[i].dur) return { scene: scenes[i], localT: t - acc, idx: i, scenes };
      acc += scenes[i].dur;
    }
    const last = scenes[scenes.length - 1];
    return { scene: last, localT: last.dur, idx: scenes.length - 1, scenes };
  }

  function sceneTransition(idx, localT, layout) {
    if (idx <= 0 || localT > 0.28) return;
    const a = 1 - localT / 0.28;
    if (layout === 'boss_reveal') {
      cx.fillStyle = '#ff3040';
      cx.globalAlpha = 0.5 * a;
      cx.fillRect(0, 0, W, H);
    } else if (layout === 'establishing') {
      cx.fillStyle = '#000';
      cx.globalAlpha = 0.65 * a;
      cx.fillRect(0, 0, W, H);
    } else if (layout === 'victory') {
      cx.fillStyle = '#ffe878';
      cx.globalAlpha = 0.35 * a;
      cx.fillRect(0, 0, W, H);
    } else {
      cx.fillStyle = '#fff';
      cx.globalAlpha = 0.45 * a;
      cx.fillRect(0, 0, W, H);
    }
    cx.globalAlpha = 1;
  }

  function seenKey(k) { return 'br_cine_' + k; }
  function markSeen(k) { try { localStorage.setItem(seenKey(k), '1'); } catch (e) {} }
  function wasSeen(k) { try { return !!localStorage.getItem(seenKey(k)); } catch (e) { return false; } }

  function storyFor(w) {
    if (typeof getWorldStory === 'function' && w) return getWorldStory(wi, w);
    return { introBeats: [], outroBeats: [], chalIntroBeats: [], chalOutroBeats: [], vis: 'sparks', cineFx: 'pollen', heroLine: '' };
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

  function layoutCam(layout, localT) {
    const e = Math.min(1, localT / 1.2);
    let dx = 0, dy = 0, sc = 1;
    switch (layout) {
      case 'establishing':
        sc = 1.08 - e * 0.06;
        dy = (1 - e) * 16;
        break;
      case 'boss_reveal':
        sc = 0.95 + e * 0.08;
        dx = Math.sin(t * 8) * (localT < 0.5 ? 6 : 2);
        break;
      case 'versus':
        dx = Math.sin(t * 0.35) * 10;
        break;
      case 'victory':
        sc = 1 + Math.sin(t * 2) * 0.015;
        dy = -Math.sin(t * 1.5) * 4;
        break;
      case 'relief':
        sc = 1.02;
        break;
      case 'tease':
        dx = Math.sin(t * 0.5) * 14;
        break;
      default:
        dx = Math.sin(t * 0.35) * 12;
        dy = Math.cos(t * 0.28) * 8;
        sc = 1 + Math.sin(t * 0.2) * 0.02;
    }
    cx.translate(W / 2 + dx, H / 2 + dy);
    cx.scale(sc, sc);
    cx.translate(-W / 2, -H / 2);
  }

  function drawLetterbox(layout) {
    const bar = layout === 'establishing' || layout === 'boss_reveal'
      ? Math.round(H * 0.08) : Math.round(H * 0.06);
    cx.fillStyle = '#000';
    cx.fillRect(0, 0, W, bar);
    cx.fillRect(0, H - bar, W, bar);
  }

  function backdrop(w, layout) {
    const th = w && w.theme ? w.theme : { bg: '#4a6e32', tile1: '#7ec850', tile2: '#6ab840', void: '#3d5c28' };
    if (kind === 'prologue') {
      cx.fillStyle = '#6fae3d';
      cx.fillRect(0, 0, W, H);
      cx.fillStyle = '#86c64a';
      const ts = 64;
      for (let gy = 0; gy < H; gy += ts) {
        for (let gx = 0; gx < W; gx += ts) {
          if (((gx / ts + gy / ts) & 1)) cx.fillRect(gx, gy, ts, ts);
        }
      }
      return;
    }
    if (kind === 'w1_outro') {
      cx.fillStyle = '#3d5c22';
      cx.fillRect(0, 0, W, H);
      cx.fillStyle = '#456827';
      const ts = 64;
      for (let gy = 0; gy < H; gy += ts) {
        for (let gx = 0; gx < W; gx += ts) {
          if (((gx / ts + gy / ts) & 1)) cx.fillRect(gx, gy, ts, ts);
        }
      }
      return;
    }
    cx.fillStyle = th.void || th.bg;
    cx.fillRect(0, 0, W, H);
    cx.fillStyle = th.tile1;
    const ts = 64;
    for (let gy = 0; gy < H; gy += ts) {
      for (let gx = 0; gx < W; gx += ts) {
        if (((gx / ts + gy / ts) & 1)) cx.fillRect(gx, gy, ts, ts);
      }
    }
    if (layout !== 'establishing') {
      cx.fillStyle = th.tile2;
      for (let gy = 0; gy < H; gy += ts * 2) {
        for (let gx = 0; gx < W; gx += ts * 2) {
          if (!(((gx / ts + gy / ts) & 1))) cx.fillRect(gx + ts * 0.25, gy + ts * 0.25, ts * 0.5, ts * 0.5);
        }
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

  function entranceEase(maxT) {
    return Math.min(1, t / maxT);
  }

  function easeOut(v) { return 1 - (1 - v) * (1 - v); }

  function drawPrologueArmy() {
    if (typeof SP === 'undefined') return;
    const e = easeOut(Math.min(1, Math.max(0, (t - 2.5) / 5.5)));
    const bossX = W * 1.15 - e * (W * 0.65);
    const bossY = H * 0.56;
    const army = ['pigeon', 'chimp', 'penguin', 'flamingo', 'duck', 'pigeon'];
    for (let i = 0; i < army.length; i++) {
      const lag = 0.5 + i * 0.18;
      const e2 = easeOut(Math.min(1, Math.max(0, (t - 2.5 - lag * 0.4) / 5.5)));
      const ax = W * 1.25 - e2 * (W * 0.6) + Math.sin(i * 1.7) * 30;
      const ay = bossY + 70 + (i % 3) * 26 - 26;
      if (SP[army[i]]) drawSprite(army[i], ax, ay, 46, Math.sin(t * 4 + i) * 0.15, 0, 0, false, null);
    }
    if (t > 2.5 && SP.sahur) drawSprite('sahur', bossX, bossY, 130, Math.sin(t * 3) * 0.05, 0, 0, false, null);
    if (t > 9 && t < 11.5) {
      cx.globalAlpha = 0.16 + 0.1 * Math.sin(t * 16);
      cx.fillStyle = '#ff2020';
      cx.fillRect(0, 0, W, H);
      cx.globalAlpha = 1;
    }
  }

  function drawW1OutroArmy() {
    if (typeof SP === 'undefined') return;
    const groundY = H * 0.62;
    const exitE = easeOut(Math.min(1, Math.max(0, (t - 9.2) / 2.0)));
    const sE = easeOut(Math.min(1, Math.max(0, (t - 3.0) / 2.0)));
    const sX = W * 0.5 + exitE * W * 0.55;
    const sY = groundY - sE * 26;
    if (t < 6) {
      cx.globalAlpha = 0.35 * (0.6 + 0.4 * Math.sin(t * 4)) * (1 - sE * 0.5);
      cx.fillStyle = '#9fe0ff';
      cx.beginPath(); cx.ellipse(W * 0.5, groundY + 6, 70 + sE * 20, 22, 0, 0, TAU); cx.fill();
      cx.globalAlpha = 1;
    }
    if (SP.sahur) drawSprite('sahur', sX, sY, 120, (1 - sE) * (Math.PI / 2), 0, 0, false, null);
    const friends = [
      { spr: 'pigeon', x: -0.22, rise: 5.0 },
      { spr: 'chimp', x: -0.11, rise: 5.55 },
      { spr: 'penguin', x: 0.11, rise: 6.1 },
      { spr: 'flamingo', x: 0.22, rise: 6.65 },
      { spr: 'duck', x: 0, rise: 7.2 },
    ];
    for (const f of friends) {
      const e = easeOut(Math.min(1, Math.max(0, (t - f.rise) / 0.8)));
      const rot = (1 - e) * (Math.PI / 2);
      const fx = W * 0.5 + f.x * W + exitE * W * 0.44;
      const fy = groundY + 34 - e * 18;
      if (SP[f.spr]) drawSprite(f.spr, fx, fy, 50, rot, 0, 0, false, null);
    }
    if (t > 8.6) {
      const p = Math.min(1, (t - 8.6) / 1.0);
      cx.globalAlpha = 0.5 * p * (0.6 + 0.4 * Math.sin(t * 10)) * (1 - exitE * 0.6);
      cx.fillStyle = '#cfeeff';
      cx.beginPath(); cx.arc(W * 0.5 + exitE * W * 0.55, groundY - 10, 140 * p, 0, TAU); cx.fill();
      cx.globalAlpha = 1;
    }
  }

  function drawAlly(st, bob, force) {
    if (!st.allyChar || typeof drawCharacter !== 'function') return;
    if (!force && kind === 'prologue') {
      if (t < 11.5) return;
    }
    const e = entranceEase(1.8);
    const ax = W * (0.62 + (1 - e) * 0.2);
    const ay = H * 0.6 + bob;
    cx.strokeStyle = 'rgba(255,220,80,0.7)';
    cx.lineWidth = 3;
    cx.beginPath(); cx.arc(ax, ay, 48, 0, TAU); cx.stroke();
    const allyId = kind === 'prologue' ? 'gianni' : st.allyChar.id;
    drawCharacter(allyId, ax, ay, 86, Math.sin(t * 2.2) * 0.04, true);
  }

  function drawHero(bob, opts) {
    opts = opts || {};
    const e = entranceEase(opts.delay || 1.4);
    const hx = W * ((opts.x || 0.22) + (1 - e) * (opts.fromX || -0.18));
    const hy = H * (opts.y || 0.62) + bob;
    if (typeof drawCharacter === 'function') {
      drawCharacter(typeof activeCharId !== 'undefined' ? activeCharId : 'gianni', hx, hy, opts.size || 95, Math.sin(t * 2) * 0.04, false);
    }
    cx.strokeStyle = 'rgba(255,255,255,0.55)';
    cx.lineWidth = 3;
    cx.beginPath(); cx.arc(hx, hy, opts.ring || 52, 0, TAU); cx.stroke();
    if (kind === 'prologue' && t > 11.5) {
      cx.globalAlpha = 0.5 * Math.min(1, (t - 11.5) / 0.6) * (0.6 + 0.4 * Math.sin(t * 5));
      cx.strokeStyle = '#9fe0ff';
      cx.lineWidth = 4;
      cx.beginPath(); cx.arc(hx, hy, 60, 0, TAU); cx.stroke();
      cx.globalAlpha = 1;
    }
  }

  function drawSwarmArmy(w, layout) {
    if (layout === 'establishing' || layout === 'relief') return;
    if (typeof SP === 'undefined') return;
    const foes = w && w.foes && w.foes.length ? w.foes : [];
    const sprs = foes.length
      ? foes.map(f => f.spr)
      : ['swarmmite', 'swarmwasp', 'swarmbeetle', 'swarmmoth'];
    const march = entranceEase(2.2);
    const retreat = (kind === 'outro' || kind === 'chal_out') && (layout === 'tease' || layout === 'victory');
    const slide = retreat ? Math.min(1, t / 2.5) * W * 0.5 : 0;
    const count = layout === 'atmosphere' ? 12 : 10;
    for (let i = 0; i < count; i++) {
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

  function drawBossSilhouette(w, bob, big, layout) {
    if (layout === 'relief') return;
    if (!w || !w.bosses || !w.bosses.length || typeof SP === 'undefined') return;
    const b = kind === 'intro' || kind === 'chal_in' || kind === 'prologue'
      ? w.bosses[w.bosses.length - 1] : w.bosses[0];
    if (kind === 'prologue' && t < 2.5) return;
    if (kind === 'w1_outro' && t < 3) return;
    if (!b || !SP[b.spr]) {
      if (kind === 'prologue' && SP.sahur) {
        const e = easeOut(Math.min(1, Math.max(0, (t - 2.5) / 4)));
        drawSprite('sahur', W * 0.5, H * 0.48, 120 * e, 0, 0, 0, false, null);
      }
      return;
    }
    const rise = entranceEase(big ? 1.6 : 2.8);
    const bx = W * 0.5;
    const by = H * (big ? 0.44 : 0.52) + (1 - rise) * H * 0.1 + Math.sin(t * 2.5) * bob;
    const pulse = 1 + Math.sin(t * 4) * 0.05;
    const scale = big ? 1.3 : 1;
    cx.globalAlpha = 0.35 * rise;
    cx.fillStyle = w.enemyTint || '#ff5a70';
    cx.beginPath(); cx.arc(bx, by, 70 * pulse * scale, 0, TAU); cx.fill();
    cx.globalAlpha = 1;
    cx.strokeStyle = big ? '#ffe878' : '#fff';
    cx.lineWidth = big ? 5 : 4;
    cx.beginPath(); cx.arc(bx, by, 58 * pulse * scale, 0, TAU); cx.stroke();
    drawSprite(b.spr, bx, by, 115 * pulse * rise * scale, 0, 0, 0, false, null);
  }

  function start(kindIn, worldIndex, onDone, challenger, scenesOverride) {
    kind = kindIn; wi = worldIndex; done = onDone; t = 0; isChal = !!challenger; lastSceneIdx = -1;
    specialScenes = scenesOverride || null;
    state = kindIn === 'outro' || kindIn === 'chal_out' || kindIn === 'w1_outro' ? ST.OUTRO : ST.INTRO;
    $('menu') && $('menu').classList.add('hidden');
    $('introskip') && $('introskip').classList.remove('hidden');
    if (typeof playMusic === 'function') {
      const w = worldData(wi);
      playMusic(w && w.theme ? w.theme.music : 'boss0');
    }
    shake = kindIn === 'boss_reveal' ? 0 : 0;
  }

  function finish() {
    $('introskip') && $('introskip').classList.add('hidden');
    const k = kind, w = wi;
    if (k === 'intro') markSeen('in_' + w);
    else if (k === 'outro') markSeen('out_' + w);
    else if (k === 'chal_in') markSeen('chal_in_' + w);
    else if (k === 'chal_out') markSeen('chal_out_' + w);
    else if (k === 'prologue') { try { localStorage.setItem('br_seen_intro', '1'); } catch (e) {} }
    else if (k === 'w1_outro') { try { localStorage.setItem('br_seen_w1outro', '1'); } catch (e) {} }
    kind = null;
    specialScenes = null;
    const cb = done; done = null;
    if (cb) cb();
  }

  function isMilestoneWorld() {
    const st = storyFor(worldData(wi));
    return !!(st && st.milestone);
  }

  function durFor(k) {
    if (k === 'prologue' && typeof getPrologueScenes === 'function') {
      return getPrologueScenes().reduce((s, sc) => s + sc.dur, 0);
    }
    if (k === 'w1_outro' && typeof getW1OutroScenes === 'function') {
      return getW1OutroScenes().reduce((s, sc) => s + sc.dur, 0);
    }
    const st = storyFor(worldData(wi));
    if (k === 'intro' && st.introDur) return st.introDur;
    if (k === 'outro' && st.outroDur) return st.outroDur;
    if (k === 'chal_in' && st.chalIntroDur) return st.chalIntroDur;
    if (k === 'chal_out' && st.chalOutroDur) return st.chalOutroDur;
    if (k === 'intro') return isMilestoneWorld() ? DUR.introFull : DUR.introQuick;
    if (k === 'outro') return isMilestoneWorld() ? DUR.outroFull : DUR.outroQuick;
    if (k === 'chal_in') return DUR.chalIn;
    return DUR.chalOut;
  }

  function update(dt) {
    t += dt;
    const { scene, localT } = sceneAt(storyFor(worldData(wi)));
    if (scene && scene.layout === 'boss_reveal' && localT < 0.4) shake = Math.max(shake, 4);
    if (t >= durFor(kind)) finish();
  }

  function renderSceneBeats(scene, sceneStart) {
    if (!scene || !scene.beats) return;
    for (const b of scene.beats) {
      if (b.ally) continue;
      caption(b.text, sceneStart + 0.12, sceneStart + scene.dur - 0.12, H * b.y, b);
    }
    for (const b of scene.beats) {
      if (!b.ally) continue;
      const t0 = sceneStart + 0.12;
      const t1 = sceneStart + scene.dur - 0.12;
      if (t >= t0 && t <= t1) caption(b.text, t0, t1, H * 0.9, { big: true });
    }
  }

  function renderSceneLayout(layout, w, st, localT, sceneStart, scene) {
    const bob = Math.sin(t * 2.5) * 4;
    switch (layout) {
      case 'establishing':
        break;
      case 'atmosphere':
        if (kind === 'prologue') drawPrologueArmy();
        else if (kind === 'w1_outro') drawW1OutroArmy();
        else drawSwarmArmy(w, layout);
        break;
      case 'boss_reveal':
        if (kind === 'prologue') drawPrologueArmy();
        else if (kind === 'w1_outro') drawW1OutroArmy();
        else drawBossSilhouette(w, 12, true, layout);
        break;
      case 'ally_join':
        drawHero(bob);
        drawAlly(st, Math.sin(t * 2.8) * 3, kind === 'prologue');
        if (kind !== 'prologue') drawSwarmArmy(w, layout);
        break;
      case 'versus':
        drawHero(bob);
        drawSwarmArmy(w, layout);
        drawBossSilhouette(w, 8, false, layout);
        break;
      case 'victory':
        drawHero(Math.sin(t * 2) * 3, { x: 0.5, fromX: 0, size: 100, ring: 58 });
        if (kind === 'outro' || kind === 'chal_out') drawSwarmArmy(w, layout);
        break;
      case 'relief':
        drawHero(Math.sin(t * 1.8) * 2, { x: 0.38, size: 88 });
        break;
      case 'tease':
        if (kind === 'w1_outro') drawW1OutroArmy();
        else drawSwarmArmy(w, layout);
        break;
      default:
        drawSwarmArmy(w, layout);
        drawHero(bob);
    }
    renderSceneBeats(scene, sceneStart);
  }

  function render() {
    const w = worldData(wi);
    const st = storyFor(w);
    const { scene, localT, idx, scenes } = sceneAt(st);
    let sceneStart = 0;
    for (let i = 0; i < idx; i++) sceneStart += scenes[i].dur;

    cx.save();
    backdrop(w, scene ? scene.layout : null);
    cx.save();
    if (scene) layoutCam(scene.layout, localT);

    const fxId = st.cineFx || st.vis || 'pollen';
    if (typeof drawCineFx === 'function') drawCineFx(fxId, t, W, H, cx, scene ? scene.layout : null, localT);

    if (scene && scenes.length) {
      if (idx !== lastSceneIdx) lastSceneIdx = idx;
      sceneTransition(idx, localT, scene.layout);
      renderSceneLayout(scene.layout, w, st, localT, sceneStart, scene);
    }

    cx.restore();
    drawLetterbox(scene ? scene.layout : null);

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
      const scenes = typeof getPrologueScenes === 'function' ? getPrologueScenes() : null;
      start('prologue', 0, onReady, false, scenes);
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
      const scenes = typeof getW1OutroScenes === 'function' ? getW1OutroScenes() : null;
      start('w1_outro', 0, onDone, false, scenes);
      return;
    }
    if (wasSeen('out_' + w)) { onDone(); return; }
    start('outro', w, onDone, false);
  }

  function skip() { finish(); }
  function isActive() { return kind != null; }

  return { beforeStart, afterClear, update, render, skip, isActive };
})();

window.WorldCine = WorldCine;
