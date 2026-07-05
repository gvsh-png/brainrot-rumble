'use strict';
// Milestone characters — vivid color palettes (no muddy dark tones) + roguelike gimmicks.

(function () {
  function themedChar(skin, body, legs, arms, extra) {
    return function (ctx, size, t, anim) {
      t = t || 0;
      anim = anim || {};
      const by = _charBodyY(anim, size);
      ctx.save();
      ctx.translate(0, by);
      _humanBase(ctx, size, legs, body, arms || skin, skin, anim);
      _eyes(ctx, size);
      if (extra) extra(ctx, size, t, anim);
      ctx.restore();
    };
  }

  window.EXT_CHARS = [
    {
      id: 'swarm_scout', name: 'Swarm Scout',
      desc: 'Fast striker. After dashing, your next 3 shots fire a bonus side bullet (40% dmg).',
      rarity: 'world', worldUnlock: 7,
      baseStats: { maxHp: 98, dmg: 10, speed: 278, fireRate: 0.28 },
      register() {
        let bonus = 0;
        onHook('onDash', () => { bonus = 3; });
        onHook('playerShoot', (target) => {
          if (!bonus || !target || typeof bullets === 'undefined' || typeof P === 'undefined') return;
          bonus--;
          const a = Math.atan2(target.y - P.y, target.x - P.x);
          for (const off of [-0.35, 0.35]) {
            const ang = a + off;
            bullets.push({ x: P.x, y: P.y, vx: Math.cos(ang) * 420, vy: Math.sin(ang) * 420, r: 5, pierce: 0, hit: new Set(), dist: P.range || 330, dmgMul: 0.4 });
          }
        });
      },
      draw: themedChar('#f0c9a0', '#58b4ff', '#2a78d8', '#f0c9a0', (ctx, size) => {
        _fillR(ctx, size, '#7ec8e3', -size * 0.2, -size * 0.34, size * 0.4, size * 0.08, size * 0.02);
      }),
    },
    {
      id: 'hive_knight', name: 'Hive Knight',
      desc: 'Tank. Standing still for 1s grants 1 shield charge (max 1, refreshes every 25s).',
      rarity: 'world', worldUnlock: 9,
      baseStats: { maxHp: 115, dmg: 10, speed: 248, armor: 0.94 },
      register() {
        let stillT = 0, cd = 0;
        onHook('petTick', (dt) => {
          if (typeof P === 'undefined') return;
          const moved = P.moving;
          stillT = moved ? 0 : stillT + dt;
          if (cd > 0) cd -= dt;
          if (stillT >= 1 && cd <= 0 && (P.shield || 0) < 1) {
            P.shield = 1;
            cd = 25;
            if (typeof floatText === 'function') floatText(P.x, P.y - 42, 'GUARD', '#ffd24a', 14);
          }
        });
      },
      draw: themedChar('#f0c090', '#ffd24a', '#e8a020', '#f0c090', (ctx, size) => {
        _fillR(ctx, size, '#ffe878', -size * 0.22, -size * 0.06, size * 0.44, size * 0.22, size * 0.06);
      }),
    },
    {
      id: 'rot_weaver', name: 'Rot Weaver',
      desc: 'Chaos weaver. 12% chance per shot to fire 2 extra chaos bolts (50% dmg).',
      rarity: 'world', worldUnlock: 11,
      baseStats: { maxHp: 104, dmg: 11, speed: 258 },
      register() {
        onHook('playerShoot', (target) => {
          if (!target || typeof bullets === 'undefined' || typeof P === 'undefined' || Math.random() > 0.12) return;
          const a = Math.atan2(target.y - P.y, target.x - P.x);
          for (let i = 0; i < 2; i++) {
            const ang = a + rand(-0.5, 0.5);
            bullets.push({ x: P.x, y: P.y, vx: Math.cos(ang) * 380, vy: Math.sin(ang) * 380, r: 5, pierce: 0, hit: new Set(), dist: P.range || 330, dmgMul: 0.5 });
          }
        });
      },
      draw: themedChar('#f0c0d8', '#e056fd', '#9b30ff', '#f0b0e8', (ctx, size, t) => {
        ctx.strokeStyle = '#ff80ff';
        ctx.lineWidth = Math.max(1.5, size * 0.025);
        for (let i = 0; i < 3; i++) {
          const a = t * 2 + i * 2.1;
          ctx.beginPath();
          ctx.moveTo(0, -size * 0.1);
          ctx.lineTo(Math.cos(a) * size * 0.2, Math.sin(a) * size * 0.15 - size * 0.1);
          ctx.stroke();
        }
      }),
    },
    {
      id: 'void_runner', name: 'Void Runner',
      desc: 'Slip runner. Dash gives 0.5s where enemies lose track of you (reduced pull/aggro).',
      rarity: 'world', worldUnlock: 14,
      baseStats: { maxHp: 100, dmg: 10.5, speed: 288 },
      register() {
        onHook('onDash', () => { if (typeof P !== 'undefined') { P.stealthAggro = true; P._voidSlip = 0.5; } });
        onHook('petTick', (dt) => {
          if (!P._voidSlip) return;
          P._voidSlip -= dt;
          if (P._voidSlip <= 0) { P._voidSlip = 0; P.stealthAggro = false; }
        });
      },
      draw: themedChar('#f0d8ff', '#00e5ff', '#00b8d4', '#80f0ff', (ctx, size, t) => {
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = Math.max(2, size * 0.028);
        for (let i = 0; i < 3; i++) {
          const a = t * 4 + i * 2;
          ctx.beginPath();
          ctx.moveTo(-size * 0.2, size * 0.05);
          ctx.lineTo(-size * 0.32 - Math.cos(a) * size * 0.04, size * 0.05 + Math.sin(a) * size * 0.03);
          ctx.stroke();
        }
      }),
    },
    {
      id: 'coral_guard', name: 'Coral Guard',
      desc: 'Reef tank. Heals 2 HP every 8 kills. Cannot take Splinter Shot.',
      rarity: 'world', worldUnlock: 17,
      baseStats: { maxHp: 120, dmg: 9.5, speed: 242, armor: 0.96 },
      register() {
        let k = 0;
        if (typeof P !== 'undefined') P.bannedCards = (P.bannedCards || []).concat(['multi']);
        onHook('onKill', () => {
          k++;
          if (k % 8 === 0 && typeof P !== 'undefined') {
            P.hp = Math.min(P.maxHp, P.hp + 2);
            if (typeof floatText === 'function') floatText(P.x, P.y - 38, '+2', '#00e676', 13);
          }
        });
      },
      draw: themedChar('#f0c0a0', '#00e676', '#00c853', '#f0c0a0', (ctx, size) => {
        _fillE(ctx, size, '#69f0ae', size * 0.18, size * 0.02, size * 0.08, size * 0.14);
        _fillE(ctx, size, '#69f0ae', -size * 0.18, size * 0.02, size * 0.08, size * 0.14);
      }),
    },
    {
      id: 'storm_caller', name: 'Storm Caller',
      desc: 'Lightning tempo. Every 10 kills: chain-zap 2 nearby foes for 55% dmg each.',
      rarity: 'world', worldUnlock: 21,
      baseStats: { maxHp: 102, dmg: 11, speed: 262, range: 350 },
      register() {
        let k = 0;
        onHook('onKill', (e) => {
          k++;
          if (k % 10 !== 0 || typeof enemies === 'undefined' || typeof P === 'undefined') return;
          let hits = 0;
          for (const o of enemies) {
            if (o === e || o.iv > 0 || o.under) continue;
            if ((o.x - P.x) ** 2 + (o.y - P.y) ** 2 > 280 * 280) continue;
            o.hp -= P.dmg * 0.55;
            o.hitT = Math.max(o.hitT || 0, 0.12);
            if (typeof burst === 'function') burst(o.x, o.y, '#448aff', 6, 120);
            if (++hits >= 2) break;
          }
        });
      },
      draw: themedChar('#f0e8a0', '#448aff', '#2962ff', '#f0e8a0', (ctx, size) => {
        ctx.fillStyle = '#ffea00';
        ctx.beginPath();
        ctx.moveTo(size * 0.12, -size * 0.28);
        ctx.lineTo(size * 0.18, -size * 0.12);
        ctx.lineTo(size * 0.14, -size * 0.12);
        ctx.lineTo(size * 0.2, size * 0.02);
        ctx.lineTo(size * 0.08, -size * 0.08);
        ctx.lineTo(size * 0.12, -size * 0.08);
        ctx.closePath();
        ctx.fill();
      }),
    },
    {
      id: 'ember_sage', name: 'Ember Sage',
      desc: 'Burn sage. Your hits apply burn (3 dmg over 2s). Burn does not stack on bosses.',
      rarity: 'world', worldUnlock: 25,
      baseStats: { maxHp: 106, dmg: 11, speed: 252 },
      register() {
        if (typeof P !== 'undefined') P.burnHit = true;
      },
      draw: themedChar('#f0c090', '#ff6e40', '#ff3d00', '#ffc080', (ctx, size, t) => {
        ctx.fillStyle = '#ffab40';
        ctx.beginPath();
        ctx.arc(0, -size * 0.32, size * 0.09, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff6d00';
        ctx.beginPath();
        ctx.arc(0, -size * 0.34, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
      }),
    },
    {
      id: 'frost_warden', name: 'Frost Warden',
      desc: 'Chill warden. Hits chill enemies (+0.8s slow). Starts with +1 chill stack from Permafrost.',
      rarity: 'world', worldUnlock: 29,
      baseStats: { maxHp: 112, dmg: 10.5, speed: 244, bslow: 0.94 },
      register() {
        if (typeof P !== 'undefined') P.chillHit = (P.chillHit || 0) + 1;
      },
      draw: themedChar('#e8f8ff', '#40c4ff', '#00b0ff', '#e8f8ff', (ctx, size) => {
        _fillE(ctx, size, '#b3e5fc', 0, -size * 0.34, size * 0.22, size * 0.07);
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(0, -size * 0.36, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
      }),
    },
    {
      id: 'chrono_mite', name: 'Chrono Mite',
      desc: 'Time skipper. Every 14s: rewind dash cooldown and gain +15% speed for 3s.',
      rarity: 'world', worldUnlock: 34,
      baseStats: { maxHp: 100, dmg: 10.5, speed: 290, fireRate: 0.27 },
      register() {
        let cd = 14, boost = 0;
        onHook('petTick', (dt) => {
          if (typeof P === 'undefined') return;
          if (boost > 0) {
            boost -= dt;
            if (boost <= 0) { P.speed /= 1.15; boost = 0; }
            return;
          }
          cd -= dt;
          if (cd <= 0) {
            cd = 14;
            P.dashCd = 0;
            boost = 3;
            P.speed *= 1.15;
            if (typeof floatText === 'function') floatText(P.x, P.y - 44, 'SKIP!', '#ffca28', 15);
          }
        });
      },
      draw: themedChar('#fff0b0', '#ffca28', '#ff8f00', '#fff0b0', (ctx, size) => {
        ctx.strokeStyle = '#ff6f00';
        ctx.lineWidth = Math.max(2, size * 0.03);
        ctx.beginPath();
        ctx.arc(0, -size * 0.3, size * 0.1, 0, Math.PI * 2);
        ctx.stroke();
      }),
    },
    {
      id: 'omega_pilot', name: 'Omega Pilot',
      desc: 'Ace pilot. Every other shot fires a homing tracer (30% dmg, short range).',
      rarity: 'world', worldUnlock: 39,
      baseStats: { maxHp: 108, dmg: 11.5, speed: 272, range: 360 },
      register() {
        let alt = false;
        onHook('playerShoot', (target) => {
          alt = !alt;
          if (!alt || !target || typeof bullets === 'undefined' || typeof P === 'undefined') return;
          const a = Math.atan2(target.y - P.y, target.x - P.x);
          bullets.push({ x: P.x, y: P.y, vx: Math.cos(a) * 380, vy: Math.sin(a) * 380, r: 5, pierce: 0, hit: new Set(), dist: (P.range || 330) * 0.75, dmgMul: 0.3, homing: 3 });
        });
      },
      draw: themedChar('#f0c0a0', '#ff5252', '#d32f2f', '#f0c0a0', (ctx, size) => {
        _fillR(ctx, size, '#ffffff', -size * 0.14, -size * 0.38, size * 0.28, size * 0.08, size * 0.02);
        ctx.fillStyle = '#448aff';
        ctx.fillRect(-size * 0.06, -size * 0.36, size * 0.05, size * 0.04);
        ctx.fillRect(size * 0.02, -size * 0.36, size * 0.05, size * 0.04);
      }),
    },
    {
      id: 'swarm_sovereign', name: 'Swarm Sovereign',
      desc: 'Hive ruler. Boss waves: start with +10% dmg for the wave. Each boss kill: +1 permanent dmg.',
      rarity: 'world', worldUnlock: 44,
      baseStats: { maxHp: 118, dmg: 11, speed: 258 },
      register() {
        onHook('waveStart', () => {
          if (typeof wave === 'undefined' || typeof P === 'undefined') return;
          if (wave % 5 === 0) {
            P._sovBoost = P.dmg * 0.1;
            P.dmg += P._sovBoost;
          }
        });
        onHook('waveEnd', () => {
          if (P._sovBoost) { P.dmg -= P._sovBoost; P._sovBoost = 0; }
        });
        onHook('onKill', (e) => {
          if (e && e.isBoss && typeof P !== 'undefined') {
            P.dmg += 1;
            if (typeof floatText === 'function') floatText(P.x, P.y - 50, '+1 DMG', '#ea80fc', 14);
          }
        });
      },
      draw: themedChar('#f0e0c0', '#ab47bc', '#8e24aa', '#f0e0c0', (ctx, size) => {
        ctx.fillStyle = '#ffea00';
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath();
          ctx.moveTo(i * size * 0.06, -size * 0.34);
          ctx.lineTo(i * size * 0.06 + size * 0.03, -size * 0.44);
          ctx.lineTo(i * size * 0.06 - size * 0.03, -size * 0.44);
          ctx.fill();
        }
      }),
    },
    {
      id: 'final_vector', name: 'Final Vector',
      desc: 'Last stand. Below 40% HP: +18% dmg and +12% speed until healed above half.',
      rarity: 'world', worldUnlock: 49,
      baseStats: { maxHp: 112, dmg: 11.5, speed: 284 },
      register() {
        let active = false;
        onHook('petTick', () => {
          if (typeof P === 'undefined') return;
          const low = P.hp / P.maxHp < 0.4;
          if (low && !active) {
            active = true;
            P.dmg *= 1.18;
            P.speed *= 1.12;
            if (typeof floatText === 'function') floatText(P.x, P.y - 48, 'LAST STAND', '#ff4081', 16);
          } else if (!low && active) {
            active = false;
            P.dmg /= 1.18;
            P.speed /= 1.12;
          }
        });
      },
      draw: themedChar('#ffe0c0', '#ffffff', '#ff4081', '#ffe0c0', (ctx, size) => {
        _fillR(ctx, size, '#ff4081', -size * 0.18, -size * 0.04, size * 0.36, size * 0.24, size * 0.06);
        ctx.strokeStyle = '#ff4081';
        ctx.lineWidth = Math.max(2, size * 0.03);
        ctx.beginPath();
        ctx.moveTo(-size * 0.1, -size * 0.06);
        ctx.lineTo(size * 0.1, size * 0.1);
        ctx.moveTo(size * 0.1, -size * 0.06);
        ctx.lineTo(-size * 0.1, size * 0.1);
        ctx.stroke();
      }),
    },
  ];
})();
