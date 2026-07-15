'use strict';
// Milestone pets — unique swarm-themed art + visible QoL hook abilities (not raw stat clones).

(function () {
  function stroke(ctx, size) {
    ctx.strokeStyle = '#2a1c10';
    ctx.lineWidth = Math.max(1.2, size * 0.032);
    ctx.stroke();
  }

  function drawMite(ctx, size, t) {
    const bob = Math.sin(t * 4) * size * 0.03;
    ctx.fillStyle = '#9a7ad8';
    ctx.beginPath();
    ctx.ellipse(0, bob, size * 0.24, size * 0.16, 0, 0, Math.PI * 2);
    ctx.fill(); stroke(ctx, size);
    ctx.fillStyle = '#6a4a9a';
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(sx * size * 0.1, -size * 0.04 + bob, size * 0.05, 0, Math.PI * 2);
      ctx.fill(); stroke(ctx, size);
    }
    ctx.fillStyle = '#fff';
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(sx * size * 0.14, bob, size * 0.028, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawWasp(ctx, size, t) {
    const bob = Math.sin(t * 5) * size * 0.04;
    const wing = Math.sin(t * 8) * 0.15;
    ctx.fillStyle = 'rgba(230,220,255,0.55)';
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(sx * size * 0.16, bob, size * 0.1, size * 0.14, wing * sx, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#f5d030';
    ctx.beginPath();
    ctx.ellipse(0, bob, size * 0.22, size * 0.13, 0, 0, Math.PI * 2);
    ctx.fill(); stroke(ctx, size);
    ctx.fillStyle = '#8a6048';
    ctx.fillRect(-size * 0.12, bob - size * 0.02, size * 0.24, size * 0.035);
  }

  function drawBeetle(ctx, size, t) {
    const bob = Math.sin(t * 3.5) * size * 0.025;
    ctx.fillStyle = '#48b868';
    ctx.beginPath();
    ctx.ellipse(0, size * 0.02 + bob, size * 0.26, size * 0.17, 0, 0, Math.PI * 2);
    ctx.fill(); stroke(ctx, size);
    ctx.fillStyle = '#68d888';
    ctx.beginPath();
    ctx.arc(0, -size * 0.1 + bob, size * 0.11, 0, Math.PI * 2);
    ctx.fill(); stroke(ctx, size);
    ctx.strokeStyle = '#389858';
    ctx.lineWidth = Math.max(2, size * 0.04);
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sx * size * 0.2, bob);
      ctx.lineTo(sx * size * 0.32, -size * 0.08 + bob);
      ctx.stroke();
    }
  }

  function drawMoth(ctx, size, t) {
    const bob = Math.sin(t * 3) * size * 0.03;
    const flap = 0.85 + Math.sin(t * 6) * 0.12;
    ctx.fillStyle = '#e8d8ff';
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(sx * size * 0.15, bob, size * 0.11 * flap, size * 0.16, 0, 0, Math.PI * 2);
      ctx.fill(); stroke(ctx, size);
    }
    ctx.fillStyle = '#9a7ab8';
    ctx.beginPath();
    ctx.ellipse(0, bob, size * 0.07, size * 0.12, 0, 0, Math.PI * 2);
    ctx.fill(); stroke(ctx, size);
  }

  function drawReef(ctx, size, t) {
    const bob = Math.sin(t * 2.5) * size * 0.03;
    ctx.fillStyle = '#00b894';
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i - 2) * 0.35;
      ctx.beginPath();
      ctx.moveTo(0, bob);
      ctx.quadraticCurveTo(Math.cos(a) * size * 0.2, Math.sin(a) * size * 0.2 - size * 0.1, Math.cos(a) * size * 0.14, Math.sin(a) * size * 0.22 + bob);
      ctx.strokeStyle = '#00cec9';
      ctx.lineWidth = Math.max(2, size * 0.035);
      ctx.stroke();
    }
    ctx.fillStyle = '#55efc4';
    ctx.beginPath();
    ctx.arc(0, bob, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawScarab(ctx, size, t) {
    const bob = Math.sin(t * 2) * size * 0.02;
    ctx.fillStyle = '#e17055';
    ctx.beginPath();
    ctx.ellipse(0, bob, size * 0.2, size * 0.14, 0, 0, Math.PI * 2);
    ctx.fill(); stroke(ctx, size);
    ctx.fillStyle = '#d63031';
    ctx.beginPath();
    ctx.arc(0, -size * 0.12 + bob, size * 0.1, 0, Math.PI * 2);
    ctx.fill(); stroke(ctx, size);
    ctx.fillStyle = '#ffeaa7';
    ctx.beginPath();
    ctx.arc(0, -size * 0.12 + bob, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawStorm(ctx, size, t) {
    const bob = Math.sin(t * 6) * size * 0.04;
    ctx.fillStyle = '#74b9ff';
    ctx.beginPath();
    ctx.arc(0, bob, size * 0.14, 0, Math.PI * 2);
    ctx.fill(); stroke(ctx, size);
    ctx.fillStyle = '#ffe878';
    ctx.beginPath();
    ctx.moveTo(-size * 0.04, -size * 0.02 + bob);
    ctx.lineTo(size * 0.02, -size * 0.02 + bob);
    ctx.lineTo(-size * 0.01, size * 0.1 + bob);
    ctx.lineTo(size * 0.05, size * 0.1 + bob);
    ctx.lineTo(-size * 0.02, size * 0.24 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2a1c10';
    ctx.lineWidth = Math.max(1, size * 0.02);
    ctx.stroke();
  }

  function drawEmber(ctx, size, t) {
    const bob = Math.sin(t * 4) * size * 0.03;
    ctx.fillStyle = '#d63031';
    ctx.beginPath();
    ctx.ellipse(0, size * 0.04 + bob, size * 0.18, size * 0.14, 0, 0, Math.PI * 2);
    ctx.fill(); stroke(ctx, size);
    ctx.fillStyle = '#ff7675';
    for (let i = 0; i < 4; i++) {
      const a = t * 3 + i * 1.5;
      ctx.globalAlpha = 0.5 + Math.sin(a) * 0.3;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * size * 0.1, Math.sin(a) * size * 0.08 + bob - size * 0.1, size * 0.035, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawVoid(ctx, size, t) {
    const bob = Math.sin(t * 2) * size * 0.02;
    const pulse = 0.9 + Math.sin(t * 4) * 0.08;
    ctx.fillStyle = '#2d3436';
    ctx.beginPath();
    ctx.arc(0, bob, size * 0.15 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b06ff0';
    ctx.lineWidth = Math.max(1.5, size * 0.03);
    ctx.stroke();
    ctx.fillStyle = '#b06ff0';
    ctx.globalAlpha = 0.45 + Math.sin(t * 5) * 0.2;
    ctx.beginPath();
    ctx.arc(0, bob, size * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawChrono(ctx, size, t) {
    const bob = Math.sin(t * 5) * size * 0.03;
    ctx.strokeStyle = '#fdcb6e';
    ctx.lineWidth = Math.max(2, size * 0.035);
    ctx.beginPath();
    ctx.arc(0, bob, size * 0.15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, bob);
    ctx.lineTo(0, -size * 0.1 + bob);
    ctx.moveTo(0, bob);
    ctx.lineTo(size * 0.08, bob + size * 0.02);
    ctx.stroke();
    ctx.fillStyle = '#e17055';
    ctx.beginPath();
    ctx.arc(0, bob, size * 0.04, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawOmega(ctx, size, t) {
    const bob = Math.sin(t * 3) * size * 0.025;
    ctx.fillStyle = '#e84393';
    ctx.beginPath();
    ctx.ellipse(0, bob, size * 0.12, size * 0.18, 0, 0, Math.PI * 2);
    ctx.fill(); stroke(ctx, size);
    ctx.fillStyle = '#fd79a8';
    ctx.beginPath();
    ctx.arc(0, -size * 0.1 + bob, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-size * 0.025, -size * 0.11 + bob, size * 0.018, 0, Math.PI * 2);
    ctx.arc(size * 0.025, -size * 0.11 + bob, size * 0.018, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCrown(ctx, size, t) {
    const bob = Math.sin(t * 2.5) * size * 0.02;
    ctx.fillStyle = '#fdcb6e';
    for (let i = 0; i < 5; i++) {
      const x = (i - 2) * size * 0.07;
      ctx.beginPath();
      ctx.moveTo(x - size * 0.04, bob + size * 0.06);
      ctx.lineTo(x, bob - size * 0.12);
      ctx.lineTo(x + size * 0.04, bob + size * 0.06);
      ctx.closePath();
      ctx.fill(); stroke(ctx, size);
    }
    ctx.fillStyle = '#e84393';
    ctx.beginPath();
    ctx.ellipse(0, bob + size * 0.08, size * 0.2, size * 0.1, 0, 0, Math.PI * 2);
    ctx.fill(); stroke(ctx, size);
  }

  window.EXT_PETS = [
    { id: 'mite_buddy', name: 'Mite Buddy', desc: 'Drops a heart (+20 HP) at wave start. Every 18 kills: another heart.', rarity: 'uncommon', worldUnlock: 7,
      register() {
        function dropHeart() {
          if (typeof gems === 'undefined' || typeof P === 'undefined' || typeof rand === 'undefined') return;
          const a = rand(0, Math.PI * 2), s = rand(55, 100);
          gems.push({ x: P.x, y: P.y, heart: true, heal: 20, t: 0, vx: Math.cos(a) * s, vy: Math.sin(a) * s });
        }
        let k = 0;
        onHook('waveStart', () => { k = 0; dropHeart(); });
        onHook('onKill', () => { k++; if (k % 18 === 0) dropHeart(); });
      }, draw: drawMite },
    { id: 'wasp_wing', name: 'Wasp Wing', desc: 'After you dash, your shots deal +8% dmg for 3 seconds.', rarity: 'uncommon', worldUnlock: 10,
      register() {
        onHook('onDash', () => { if (typeof P !== 'undefined') P._waspBoost = 3; });
        onHook('petTick', (dt) => {
          if (!P._waspBoost) return;
          P._waspBoost -= dt;
          if (P._waspBoost <= 0) { P._waspBoost = 0; P._waspDmg = 1; }
          else P._waspDmg = 1.08;
        });
      }, draw: drawWasp },
    { id: 'beetle_shell', name: 'Beetle Shell', desc: 'Every 30 kills: blocks the next hit you take (1 charge).', rarity: 'rare', worldUnlock: 13,
      register() {
        let k = 0;
        onHook('onKill', () => {
          k++;
          if (k % 30 === 0 && typeof P !== 'undefined') {
            P.shield = Math.min(3, (P.shield || 0) + 1);
            if (typeof floatText === 'function') floatText(P.x, P.y - 40, 'SHELL!', '#7bed9f', 14);
          }
        });
      }, draw: drawBeetle },
    { id: 'moth_lantern', name: 'Moth Lantern', desc: 'Wave start: pulls pickups toward you for 2.5s.', rarity: 'rare', worldUnlock: 16,
      register() {
        let pullT = 0;
        onHook('waveStart', () => { pullT = 2.5; });
        onHook('petTick', (dt) => {
          if (pullT <= 0 || typeof gems === 'undefined') return;
          pullT -= dt;
          for (const g of gems) g.vac = true;
        });
      }, draw: drawMoth },
    { id: 'reef_familiar', name: 'Reef Familiar', desc: 'Heals 6 HP at wave start. Every 12 kills: +3 HP.', rarity: 'rare', worldUnlock: 19,
      register() {
        onHook('waveStart', () => {
          if (typeof P !== 'undefined') P.hp = Math.min(P.maxHp, P.hp + 6);
        });
        let k = 0;
        onHook('onKill', () => {
          k++;
          if (k % 12 === 0 && typeof P !== 'undefined') {
            P.hp = Math.min(P.maxHp, P.hp + 3);
            if (typeof floatText === 'function') floatText(P.x, P.y - 36, '+3', '#55efc4', 13);
          }
        });
      }, draw: drawReef },
    { id: 'sand_scarab', name: 'Sand Scarab', desc: 'Every 8 kills: drops 2 gold coins.', rarity: 'epic', worldUnlock: 23,
      register() {
        let k = 0;
        onHook('onKill', () => {
          k++;
          if (k % 8 === 0 && typeof gems !== 'undefined' && typeof P !== 'undefined' && typeof rand === 'function') {
            for (let i = 0; i < 2; i++) {
              const a = rand(0, Math.PI * 2), s = rand(50, 95);
              gems.push({ x: P.x, y: P.y, coin: true, t: 0, vx: Math.cos(a) * s, vy: Math.sin(a) * s });
            }
          }
        });
      }, draw: drawScarab },
    { id: 'storm_familiar', name: 'Storm Familiar', desc: 'Every 20 kills: zaps the nearest foe for 70% your damage.', rarity: 'epic', worldUnlock: 27,
      register() {
        let k = 0;
        onHook('onKill', () => {
          k++;
          if (k % 20 !== 0 || typeof P === 'undefined' || typeof enemies === 'undefined') return;
          let near = null, nd = Infinity;
          for (const e of enemies) {
            if (e.iv > 0 || e.under) continue;
            const d = (e.x - P.x) ** 2 + (e.y - P.y) ** 2;
            if (d < nd) { nd = d; near = e; }
          }
          if (near) {
            const dmg = P.dmg * 0.7;
            near.hp -= dmg;
            near.hitT = Math.max(near.hitT || 0, 0.15);
            if (typeof burst === 'function') burst(near.x, near.y, '#74b9ff', 10, 180);
            if (typeof floatText === 'function') floatText(near.x, near.y - near.r - 4, Math.round(dmg), '#74b9ff', 14);
          }
        });
      }, draw: drawStorm },
    { id: 'ember_pup', name: 'Ember Pup', desc: 'Every 5s: breathes fire at the nearest foe (90% dmg).', rarity: 'epic', worldUnlock: 31,
      register() {
        let cd = 5;
        onHook('petTick', (dt) => {
          if (typeof P === 'undefined' || typeof enemies === 'undefined') return;
          cd -= dt;
          if (cd > 0) return;
          cd = 5;
          let near = null, nd = Infinity;
          for (const e of enemies) {
            if (e.iv > 0 || e.under) continue;
            const d = (e.x - P.x) ** 2 + (e.y - P.y) ** 2;
            if (d < nd) { nd = d; near = e; }
          }
          if (!near) return;
          const dmg = P.dmg * 0.9;
          near.hp -= dmg;
          near.fire = true;
          near.hitT = Math.max(near.hitT || 0, 0.12);
          if (typeof burst === 'function') burst(near.x, near.y, '#ff6020', 8, 150);
        });
      }, draw: drawEmber },
    { id: 'void_mote', name: 'Void Mote', desc: 'Fires a 20% dmg shadow shot at your target when you shoot.', rarity: 'epic', worldUnlock: 35,
      register() {
        onHook('playerShoot', (target) => {
          if (typeof P === 'undefined' || !target || target.hp <= 0 || typeof petBullets === 'undefined') return;
          petBullets.push({ x: P.petX, y: P.petY, tx: target.x, ty: target.y, target, dmg: P.dmg * 0.2 });
        });
      }, draw: drawVoid },
    { id: 'chrono_tick', name: 'Chrono Tick', desc: 'Every 18s: +20% fire rate for 4s.', rarity: 'legendary', worldUnlock: 41,
      register() {
        let cd = 18, boost = 0;
        onHook('petTick', (dt) => {
          if (typeof P === 'undefined') return;
          if (boost > 0) {
            boost -= dt;
            if (boost <= 0) { P.fireRate /= 1.2; boost = 0; }
            return;
          }
          cd -= dt;
          if (cd <= 0) {
            cd = 18;
            boost = 4;
            P.fireRate /= 1.2;
            if (typeof floatText === 'function') floatText(P.x, P.y - 44, 'HASTE', '#fdcb6e', 15);
          }
        });
      }, draw: drawChrono },
    { id: 'omega_larva', name: 'Omega Larva', desc: 'Wave end: releases stored XP orbs (1 per 4 kills, max 12).', rarity: 'legendary', worldUnlock: 47,
      register() {
        let stored = 0;
        onHook('waveStart', () => { stored = 0; });
        onHook('onKill', () => { stored++; });
        onHook('waveEnd', () => {
          if (typeof dropOrb === 'undefined' || typeof P === 'undefined') return;
          const n = Math.min(Math.floor(stored / 4), 12);
          for (let i = 0; i < n; i++) dropOrb(P.x + (i % 3 - 1) * 24, P.y, 2);
          if (n > 0 && typeof floatText === 'function') floatText(P.x, P.y - 50, '+' + n + ' XP', '#e84393', 16);
        });
      }, draw: drawOmega },
    { id: 'swarm_crown', name: 'Swarm Crown', desc: 'Dash: small nova (120px) at 35% dmg. 8s cooldown.', rarity: 'legendary', worldUnlock: 49,
      register() {
        let cd = 0;
        onHook('onDash', () => {
          if (cd > 0 || typeof P === 'undefined' || typeof novaBlast !== 'function') return;
          cd = 8;
          novaBlast(P.x, P.y, 120, P.dmg * 0.35);
          if (typeof floatText === 'function') floatText(P.x, P.y - 48, 'ROYAL BURST', '#fdcb6e', 14);
        });
        onHook('petTick', (dt) => { if (cd > 0) cd -= dt; });
      }, draw: drawCrown },
  ];
})();
