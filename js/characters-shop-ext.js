'use strict';
// Gem-shop & challenger-exclusive characters — loaded after characters.js.

(function () {
  if (typeof CHARACTERS === 'undefined') return;

  function _drawShopHuman(ctx, size, t, anim, legs, body, arms, skin, extra) {
    t = t || 0; anim = anim || {};
    const by = _charBodyY(anim, size);
    ctx.save(); ctx.translate(0, by);
    _humanBase(ctx, size, legs, body, arms, skin, anim);
    if (extra) extra(ctx, size, t);
    _eyes(ctx, size);
    ctx.restore();
  }

  function _drawVoltex(ctx, size, t, anim) {
    _drawShopHuman(ctx, size, t, anim, '#2a3848', '#3a9ad4', '#5fc8ff', '#f0d8b0', (g, s) => {
      g.fillStyle = 'rgba(120,220,255,' + (0.35 + 0.2 * Math.sin(t * 5)) + ')';
      g.beginPath(); g.arc(s * 0.2, -s * 0.05, s * 0.08, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#7fe7ff'; g.lineWidth = Math.max(1.5, s * 0.03);
      g.beginPath(); g.moveTo(-s * 0.1, s * 0.12); g.lineTo(s * 0.28, -s * 0.18); g.stroke();
    });
  }

  function _drawMimic(ctx, size, t, anim) {
    _drawShopHuman(ctx, size, t, anim, '#4a3058', '#9b6fd0', '#b88ae8', '#e8c8f0', (g, s) => {
      g.fillStyle = '#ff9fd4';
      g.beginPath(); g.arc(s * 0.18, -s * 0.2, s * 0.05, 0, Math.PI * 2); g.fill();
    });
  }

  function _drawGambler(ctx, size, t, anim) {
    _drawShopHuman(ctx, size, t, anim, '#3a2818', '#c47f12', '#e0a92e', '#f5d890', (g, s) => {
      g.fillStyle = '#e0392e';
      for (let i = 0; i < 3; i++) {
        g.beginPath(); g.arc(-s * 0.08 + i * s * 0.08, s * 0.1, s * 0.03, 0, Math.PI * 2); g.fill();
      }
    });
  }

  function _drawBruiser(ctx, size, t, anim) {
    _drawShopHuman(ctx, size, t, anim, '#2a2028', '#5a4048', '#6a5058', '#d8a890', (g, s) => {
      _fillR(g, s, '#4a3838', -s * 0.22, -s * 0.06, s * 0.44, s * 0.32, s * 0.08);
    });
  }

  function _drawArtillery(ctx, size, t, anim) {
    _drawShopHuman(ctx, size, t, anim, '#3a3020', '#6a5030', '#8a6840', '#d4b080', (g, s) => {
      g.fillStyle = '#2a2010';
      g.fillRect(s * 0.12, -s * 0.02, s * 0.38, s * 0.08);
      g.beginPath(); g.arc(s * 0.5, 0, s * 0.06, 0, Math.PI * 2); g.fill();
    });
  }

  function _drawLeech(ctx, size, t, anim) {
    _drawShopHuman(ctx, size, t, anim, '#3a1020', '#8a2040', '#a02850', '#f0c0c8', (g, s) => {
      g.strokeStyle = '#e23b5a'; g.lineWidth = Math.max(1.5, s * 0.028);
      g.beginPath(); g.moveTo(-s * 0.12, s * 0.08); g.quadraticCurveTo(0, s * 0.22, s * 0.12, s * 0.08); g.stroke();
    });
  }

  function _drawEclipse(ctx, size, t, anim) {
    _drawShopHuman(ctx, size, t, anim, '#181028', '#302050', '#483070', '#c8b8e8', (g, s) => {
      g.fillStyle = 'rgba(180,80,255,' + (0.25 + 0.15 * Math.sin(t * 3)) + ')';
      g.beginPath(); g.arc(0, -s * 0.24, s * 0.2, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#120818';
      g.beginPath(); g.arc(s * 0.04, -s * 0.26, s * 0.14, 0, Math.PI * 2); g.fill();
    });
  }

  function _drawTactician(ctx, size, t, anim) {
    _drawShopHuman(ctx, size, t, anim, '#2a3848', '#4a6878', '#6a8898', '#e8d8c0', (g, s) => {
      g.strokeStyle = '#7fe7ff'; g.lineWidth = Math.max(1.2, s * 0.025);
      g.strokeRect(-s * 0.1, -s * 0.42, s * 0.2, s * 0.14);
    });
  }

  function _drawBerserker(ctx, size, t, anim) {
    _drawShopHuman(ctx, size, t, anim, '#4a1818', '#c03030', '#e04848', '#f0c090', (g, s) => {
      g.fillStyle = '#8a1818';
      g.beginPath(); g.moveTo(0, -s * 0.42); g.lineTo(-s * 0.08, -s * 0.28); g.lineTo(s * 0.08, -s * 0.28); g.closePath(); g.fill();
    });
  }

  function _drawPaladin(ctx, size, t, anim) {
    _drawShopHuman(ctx, size, t, anim, '#485868', '#c0d0e0', '#e8f0ff', '#f0e0c0', (g, s) => {
      g.fillStyle = '#9fd0ff';
      g.fillRect(-s * 0.2, -s * 0.04, s * 0.12, s * 0.24);
      g.strokeStyle = '#5a9ad4'; g.lineWidth = Math.max(2, s * 0.035);
      g.beginPath(); g.arc(s * 0.22, 0, s * 0.14, 0, Math.PI * 2); g.stroke();
    });
  }

  function _drawIronclad(ctx, size, t, anim) {
    _drawShopHuman(ctx, size, t, anim, '#3a3a42', '#6a6a78', '#8a8a98', '#c8c8d0', (g, s) => {
      _fillR(g, s, '#5a5a68', -s * 0.2, -s * 0.1, s * 0.4, s * 0.36, s * 0.06);
    });
  }

  function _drawDuelist(ctx, size, t, anim) {
    _drawShopHuman(ctx, size, t, anim, '#282038', '#6a4088', '#8a58a8', '#e0c8f0', (g, s) => {
      g.strokeStyle = '#c8a0ff'; g.lineWidth = Math.max(1.5, s * 0.03);
      g.beginPath(); g.moveTo(s * 0.15, s * 0.02); g.lineTo(s * 0.42, -s * 0.08); g.stroke();
    });
  }

  const NEW_CHARS = [
    // ---- GEM SHOP ----
    {
      id: 'voltex', name: 'Voltex', rarity: 'epic', gemPrice: 35,
      desc: 'Every 5th shot chains lightning to 3 nearby foes.',
      baseStats: { dmg: 14, fireRate: 0.32, crit: 0.06 },
      register() {
        let n = 0;
        onHook('playerShoot', (target) => {
          n++;
          if (n % 5 !== 0 || !target) return;
          let hits = 0;
          forEnemiesNear(target.x, target.y, 200, (o) => {
            if (hits >= 3 || o === target || o.iv > 0 || o.lead) return;
            if (dist2(target.x, target.y, o.x, o.y) > 200 * 200) return;
            damageEnemy(o, P.dmg * 0.65, target.x, target.y, false);
            hits++;
          });
          burst(target.x, target.y, '#7fe7ff', 14, 220);
        });
      },
      draw: _drawVoltex
    },
    {
      id: 'mimic', name: 'Mimic', rarity: 'rare', gemPrice: 45,
      desc: 'With a pet equipped: +25% damage and your pet fires 50% faster.',
      baseStats: { speed: 275 },
      register() {
        if (typeof activePetId !== 'undefined' && activePetId) {
          P.dmg = Math.round(P.dmg * 1.25);
          P.mimicPetRate = 1.5;
          onHook('playerShoot', (target) => {
            if (!target || target.hp <= 0 || typeof petBullets === 'undefined') return;
            petBullets.push({ x: P.petX, y: P.petY, tx: target.x, ty: target.y, target, dmg: P.dmg * 0.125 });
          });
        }
      },
      draw: _drawMimic
    },
    {
      id: 'gambler', name: 'Gambler', rarity: 'epic', gemPrice: 50,
      desc: '+8% crit. Each kill permanently +2% gold this run (max +80%).',
      baseStats: { crit: 0.08 },
      register() {
        P.gamblerGoldStacks = 0;
        onHook('onKill', () => {
          if (P.gamblerGoldStacks >= 40) return;
          P.gamblerGoldStacks++;
          P.goldMul = Math.min(2.8, (P.goldMul || 1) * 1.02);
        });
      },
      draw: _drawGambler
    },
    {
      id: 'bruiser', name: 'Bruiser', rarity: 'rare', gemPrice: 40,
      desc: '+100 HP. Melee aura burns foes for 18% of your damage per second.',
      baseStats: { maxHp: 200, hp: 200, range: 260 },
      register() {
        onHook('petTick', (dt) => {
          forEnemiesNear(P.x, P.y, 72, (e) => {
            if (e.iv > 0 || e.lead) return;
            if (dist2(P.x, P.y, e.x, e.y) > 72 * 72) return;
            damageEnemy(e, P.dmg * 0.18 * dt, P.x, P.y, false);
          });
        });
      },
      draw: _drawBruiser
    },
    {
      id: 'artillery', name: 'Artillery', rarity: 'epic', gemPrice: 65,
      desc: 'Every 3rd volley lobs 2 explosive shells for heavy AOE damage.',
      baseStats: { dmg: 18, fireRate: 0.55, range: 400 },
      register() {
        let vol = 0;
        onHook('playerShoot', (target) => {
          if (!target) return;
          vol++;
          if (vol % 3 !== 0) return;
          const base = Math.atan2(target.y - P.y, target.x - P.x);
          const br = (P.bulletR || 1) * 9;
          for (let i = 0; i < 2; i++) {
            const a = base + (i - 0.5) * 0.35;
            bullets.push({
              x: P.x, y: P.y, vx: Math.cos(a) * 280, vy: Math.sin(a) * 280,
              r: br, pierce: 0, hit: new Set(), dist: 460, dmgMul: 1.15, boom: true, col: '#e07830'
            });
          }
        });
      },
      draw: _drawArtillery
    },
    {
      id: 'leech_lord', name: 'Leech Lord', rarity: 'rare', gemPrice: 38,
      desc: 'Double heal per kill. Constantly drains 0.4 HP/s — stay aggressive!',
      baseStats: { vamp: 4, maxHp: 85, hp: 85 },
      register() {
        P.vamp = (P.vamp || 0) + 4;
        onHook('petTick', (dt) => {
          if (P.hp > 1) P.hp = Math.max(1, P.hp - 0.4 * dt);
        });
      },
      draw: _drawLeech
    },
    {
      id: 'eclipse', name: 'Eclipse', rarity: 'legendary', gemPrice: 175,
      desc: 'Critical hits blast a shockwave. Every 12 kills releases a gravity pulse.',
      baseStats: { crit: 0.12, critMul: 3.5 },
      register() {
        let kills = 0;
        onHook('onKill', (e) => {
          kills++;
          if (kills % 12 !== 0) return;
          const R = 130;
          forEnemiesNear(e.x, e.y, R, (o) => {
            if (o.iv > 0 || o.lead) return;
            damageEnemy(o, P.dmg * 1.4, e.x, e.y, false);
          });
          spawnPart(e.x, e.y, 0, 0, 0.35, 0.35, '#b06ff0', R, 1, R * 2);
        });
      },
      draw: _drawEclipse
    },
    // ---- CHALLENGER UNLOCKS ----
    {
      id: 'tactician', name: 'Tactician', rarity: 'challenger', chalWorldUnlock: 5,
      desc: 'Each wave start: gain a random +12% damage, attack speed, or max HP buff.',
      baseStats: {},
      register() {
        onHook('waveStart', () => {
          const roll = Math.floor(Math.random() * 3);
          if (roll === 0) P.dmg = Math.round(P.dmg * 1.12);
          else if (roll === 1) P.fireRate *= 0.88;
          else { P.maxHp = Math.round(P.maxHp * 1.12); P.hp = Math.min(P.maxHp, P.hp * 1.12); }
        });
      },
      draw: _drawTactician
    },
    {
      id: 'berserker_rage', name: 'Berserker', rarity: 'challenger', chalWorldUnlock: 12,
      desc: 'Below 50% HP: +45% damage and +30% attack speed. High risk, high reward.',
      baseStats: { maxHp: 90, hp: 90 },
      register() {
        let raging = false;
        onHook('petTick', () => {
          const low = P.hp / P.maxHp < 0.5;
          if (low && !raging) { P.dmg = Math.round(P.dmg * 1.45); P.fireRate *= 0.77; raging = true; }
          else if (!low && raging) { P.dmg = Math.round(P.dmg / 1.45); P.fireRate /= 0.77; raging = false; }
        });
      },
      draw: _drawBerserker
    },
    {
      id: 'paladin', name: 'Paladin', rarity: 'challenger', chalWorldUnlock: 20,
      desc: 'Starts each run with a holy shield that blocks one hit, recharges every 35s.',
      baseStats: { armor: 0.92 },
      register() {
        P.shield = Math.max(P.shield || 0, 1);
        P.shieldMax = Math.max(P.shieldMax || 0, 1);
        P.shieldCdBase = 35;
        P.shieldCd = 0;
      },
      draw: _drawPaladin
    },
    {
      id: 'ironclad', name: 'Ironclad', rarity: 'challenger', chalWorldUnlock: 28,
      desc: '+50% damage resist. Thorns return 15% of damage taken to nearby attackers.',
      baseStats: { armor: 0.75, maxHp: 140, hp: 140, speed: 230 },
      register() {
        P.thorns = Math.max(P.thorns || 0, 0.15);
      },
      draw: _drawIronclad
    },
    {
      id: 'duelist', name: 'Duelist', rarity: 'challenger', chalWorldUnlock: 38,
      desc: 'Dash cooldown cut 45%. Dashing leaves a burning trail that damages foes.',
      baseStats: { dashMax: 1.0 },
      register() {
        P.dashMax = Math.max(0.8, (P.dashMax || 1.8) * 0.55);
        onHook('onDash', () => {
          for (let i = 0; i < 6; i++) {
            const a = rand(0, TAU);
            zones.push({
              x: P.x + Math.cos(a) * 20, y: P.y + Math.sin(a) * 20,
              r: 36, dps: P.dmg * 0.35, life: 1.6, col: '#c8a0ff', tele: 0.5
            });
          }
        });
      },
      draw: _drawDuelist
    }
  ];

  for (const c of NEW_CHARS) CHARACTERS.push(c);
})();
