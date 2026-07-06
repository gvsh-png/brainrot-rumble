'use strict';
// Combat runtime + VFX for world-exclusive skills (W12–50 and polished W6–11 hooks).

(function () {
  function wsk(k) { return (P.wsk && P.wsk[k]) || 0; }
  function wskCd(key, dt) {
    P.wskCd = P.wskCd || {};
    P.wskCd[key] = (P.wskCd[key] || 0) - dt;
    return P.wskCd[key];
  }
  function wskResetCd(key, base) {
    P.wskCd = P.wskCd || {};
    P.wskCd[key] = base;
  }

  function nearestEnemy(rx, ry, range) {
    let best = null, bd = Infinity;
    forEnemiesNear(rx, ry, range, (e) => {
      if (e.iv > 0 || e.lead) return;
      const d = dist2(rx, ry, e.x, e.y);
      if (d < bd) { bd = d; best = e; }
    });
    return best;
  }

  function lashStrike(x, y, tx, ty, col, dmgMul, shakeAmt) {
    const td = P.dmg * dmgMul * (P.abyssalMul || 1);
    burst(tx, ty, col, 12, 280);
    for (let i = 0; i < 5; i++) {
      const t = i / 4;
      spawnPart(x + (tx - x) * t, y + (ty - y) * t, 0, 0, 0.2, 0.2, col, 6, 1);
    }
    const hit = nearestEnemy(tx, ty, 36);
    if (hit) damageEnemy(hit, td, tx, ty, false);
    if (shakeAmt) shake = Math.max(shake, shakeAmt);
  }

  function tickWorldSkillFx(dt) {
    if (!P.wsk) return;

    // W12 Neon Afterimage — ghost snap-shot while moving
    if (wsk('neon') > 0 && P.moving) {
      if (wskCd('neon', dt) <= 0) {
        wskResetCd('neon', Math.max(0.55, 1.1 - wsk('neon') * 0.08));
        const a = P.face;
        burst(P.x, P.y, '#ff60d8', 6, 160);
        spawnPart(P.x, P.y, Math.cos(a) * 180, Math.sin(a) * 180, 0.35, 0.35, '#80f0ff', 8, 1);
        bullets.push({
          x: P.x, y: P.y, vx: Math.cos(a) * 520, vy: Math.sin(a) * 520, r: 5,
          pierce: P.pierce, hit: new Set(), dist: P.range * 0.85, dmgMul: 0.55 + wsk('neon') * 0.08, col: '#ff80e8',
        });
      }
    }

    // W15 Trench Lash — abyssal tendril
    if (wsk('lash') > 0) {
      if (wskCd('lash', dt) <= 0) {
        wskResetCd('lash', Math.max(2.8, 4.6 - wsk('lash') * 0.25));
        const t = nearestEnemy(P.x, P.y, P.range);
        if (t) lashStrike(P.x, P.y, t.x, t.y, '#30c8b0', 1.1 + wsk('lash') * 0.2, 3);
      }
    }

    // W17 Sandcutter — fast movement = damage buff (stored in P.wskSandMul)
    if (wsk('sand') > 0) {
      const fast = P.moving && !P.dashT;
      P.wskSandMul = fast ? 1 + 0.04 * wsk('sand') : 1;
      if (fast && Math.random() < 0.12) spawnPart(P.x + rand(-12, 12), P.y + rand(-6, 6), -P.dvx * 0.02 || rand(-40, 40), rand(-20, 10), 0.3, 0.3, '#e8c878', rand(2, 4));
    } else P.wskSandMul = 1;

    // W21 Phase Shot
    if (wsk('phase') > 0) {
      if (wskCd('phase', dt) <= 0) {
        wskResetCd('phase', Math.max(2.4, 4.2 - wsk('phase') * 0.3));
        const t = nearestEnemy(P.x, P.y, P.range);
        if (t) {
          const a = Math.atan2(t.y - P.y, t.x - P.x);
          burst(P.x, P.y, '#b06ff0', 8, 200);
          bullets.push({
            x: P.x, y: P.y, vx: Math.cos(a) * 700, vy: Math.sin(a) * 700, r: 7,
            pierce: 2 + wsk('phase'), hit: new Set(), dist: P.range * 1.2, dmgMul: 1.1 + wsk('phase') * 0.12, col: '#d8b0ff',
          });
        }
      }
    }

    // W22 Core Vent — magma under random nearby foe
    if (wsk('vent') > 0) {
      if (wskCd('vent', dt) <= 0) {
        wskResetCd('vent', Math.max(3.5, 5.5 - wsk('vent') * 0.35));
        const t = nearestEnemy(P.x, P.y, P.range * 0.9);
        if (t) {
          addZone(t.x, t.y, 42 + wsk('vent') * 6, { tele: 0.06, life: 1.2, dps: 10 + wsk('vent') * 3, col: '#ff5020', friendly: true });
          burst(t.x, t.y, '#ff6a20', 10, 220);
          shake = Math.max(shake, 2);
        }
      }
    }

    // W28 Capacitor Arc
    if (wsk('arc') > 0) {
      if (wskCd('arc', dt) <= 0) {
        wskResetCd('arc', Math.max(2.6, 4.4 - wsk('arc') * 0.28));
        const t = nearestEnemy(P.x, P.y, P.range);
        if (t) {
          damageEnemy(t, P.dmg * (0.9 + wsk('arc') * 0.15) * (P.abyssalMul || 1), P.x, P.y, false);
          burst(t.x, t.y, '#e040ff', 10, 260);
          let second = null, sd = Infinity;
          forEnemiesNear(t.x, t.y, 120, (e) => {
            if (e === t || e.iv > 0 || e.lead) return;
            const d = dist2(t.x, t.y, e.x, e.y);
            if (d < sd) { sd = d; second = e; }
          });
          if (second) {
            damageEnemy(second, P.dmg * 0.55 * (P.abyssalMul || 1), t.x, t.y, false);
            for (let i = 0; i < 4; i++) spawnPart(t.x + (second.x - t.x) * i / 3, t.y + (second.y - t.y) * i / 3, 0, 0, 0.15, 0.15, '#ff80ff', 4, 1);
          }
        }
      }
    }

    // W30 Flare Wave — radial push pulse
    if (wsk('flare') > 0) {
      if (wskCd('flare', dt) <= 0) {
        wskResetCd('flare', Math.max(4, 6 - wsk('flare') * 0.35));
        const R = 95 + wsk('flare') * 12, dmg = P.dmg * (0.65 + wsk('flare') * 0.12) * (P.abyssalMul || 1);
        burst(P.x, P.y, '#ffe080', 18, 340);
        spawnPart(P.x, P.y, 0, 0, 0.35, 0.35, '#ff9030', R, 1, R * 1.4);
        forEnemiesNear(P.x, P.y, R, (e) => {
          if (e.iv > 0 || e.lead) return;
          if (dist2(P.x, P.y, e.x, e.y) < R * R) {
            damageEnemy(e, dmg, P.x, P.y, false);
            const a = Math.atan2(e.y - P.y, e.x - P.x);
            e.x = clamp(e.x + Math.cos(a) * 22, WALL + e.r, WORLD.w - WALL - e.r);
            e.y = clamp(e.y + Math.sin(a) * 22, WALL + e.r, WORLD.h - WALL - e.r);
          }
        });
      }
    }

    // W32 Singularity — gentle pull
    if (wsk('sing') > 0) {
      const R = 100 + wsk('sing') * 14;
      forEnemiesNear(P.x, P.y, R, (e) => {
        if (e.iv > 0 || e.lead || e.isBoss) return;
        const d = Math.sqrt(dist2(P.x, P.y, e.x, e.y)) || 1;
        if (d < R) {
          e.x += (P.x - e.x) / d * 28 * dt;
          e.y += (P.y - e.y) / d * 28 * dt;
        }
      });
      if (Math.random() < 0.08) spawnPart(P.x + rand(-20, 20), P.y + rand(-20, 20), 0, 0, 0.25, 0.25, '#8040c0', 3, 1);
    }

    // W33 Spore Triffid — drifting spore pods
    if (wsk('spore') > 0) {
      if (wskCd('spore', dt) <= 0) {
        wskResetCd('spore', Math.max(3.2, 5 - wsk('spore') * 0.3));
        const a = rand(0, TAU), d = rand(40, 90);
        const sx = P.x + Math.cos(a) * d, sy = P.y + Math.sin(a) * d;
        addZone(sx, sy, 36 + wsk('spore') * 4, { tele: 0.05, life: 1.6, dps: 8 + wsk('spore') * 2, slow: true, col: '#60d030', friendly: true });
        burst(sx, sy, '#80ff60', 6, 140);
      }
    }

    // W41 Eyewall — orbiting lightning nodes
    if (wsk('eyewall') > 0) {
      P.wskEyeA = (P.wskEyeA || 0) + dt * (1.8 + wsk('eyewall') * 0.15);
      const n = 2 + Math.min(2, wsk('eyewall'));
      for (let i = 0; i < n; i++) {
        const a = P.wskEyeA + i * (TAU / n);
        const ox = P.x + Math.cos(a) * (72 + wsk('eyewall') * 6);
        const oy = P.y + Math.sin(a) * (72 + wsk('eyewall') * 6);
        forEnemiesNear(ox, oy, 28, (e) => {
          if (e.iv > 0 || e.lead) return;
          if (dist2(ox, oy, e.x, e.y) < 32 * 32) {
            e.hp -= (6 + wsk('eyewall') * 2) * dt * (P.abyssalMul || 1);
            e.hitT = Math.max(e.hitT, 0.05);
            if (Math.random() < 0.2) spawnPart(e.x, e.y, 0, 0, 0.2, 0.2, '#80c8ff', 4, 1);
          }
        });
      }
    }

    // W46 Cinder Column
    if (wsk('cinder') > 0) {
      if (wskCd('cinder', dt) <= 0) {
        wskResetCd('cinder', Math.max(3.8, 5.8 - wsk('cinder') * 0.3));
        addZone(P.x, P.y, 38 + wsk('cinder') * 5, { tele: 0.04, life: 1.4, dps: 12 + wsk('cinder') * 3, col: '#ff6020', friendly: true });
        for (let i = 0; i < 6; i++) spawnPart(P.x + rand(-8, 8), P.y, 0, -rand(80, 140), 0.4, 0.4, '#ff9040', rand(3, 6));
      }
    }

    // W47 Deluge — drifting acid puddles ahead
    if (wsk('deluge') > 0) {
      if (wskCd('deluge', dt) <= 0) {
        wskResetCd('deluge', Math.max(3.5, 5.2 - wsk('deluge') * 0.28));
        const ax = P.x + Math.cos(P.face) * 55, ay = P.y + Math.sin(P.face) * 55;
        addZone(ax, ay, 40 + wsk('deluge') * 5, { tele: 0.06, life: 1.8, dps: 9 + wsk('deluge') * 2, slow: true, col: '#70e040', friendly: true });
        burst(ax, ay, '#90ff50', 5, 120);
      }
    }

    // W8 Gale Volley (polished tailwind) — handled in fire loop via P.galeVolley

    // W49 Dream mist slow aura
    if (wsk('mist') > 0) {
      const R = 88 + wsk('mist') * 10;
      forEnemiesNear(P.x, P.y, R, (e) => {
        if (e.iv > 0 || e.lead || e.isBoss) return;
        if (dist2(P.x, P.y, e.x, e.y) < R * R) e.chillT = Math.max(e.chillT || 0, 0.2 + wsk('mist') * 0.05);
      });
      if (Math.random() < 0.06) spawnPart(P.x + rand(-30, 30), P.y + rand(-30, 30), rand(-10, 10), rand(-20, -5), 0.5, 0.5, '#c8b0ff', rand(4, 8));
    }

    // Cryostasis regen when still
    if (wsk('cryo') > 0 && !P.moving && P.stillT > 0.4) {
      if (P.hp < P.maxHp) P.hp = Math.min(P.maxHp, P.hp + wsk('cryo') * 0.8 * dt);
    }

    // Symbiote reef still heal
    if (wsk('reef') > 0 && !P.moving && P.stillT > 0.35) {
      if (P.hp < P.maxHp) P.hp = Math.min(P.maxHp, P.hp + wsk('reef') * 1.1 * dt);
      if (Math.random() < 0.1) spawnPart(P.x + rand(-14, 14), P.y + rand(-14, 14), 0, 0, 0.3, 0.3, '#40d8c0', 4, 1);
    }

    tickWskRegistry(dt);
  }

  function tickWskRegistry(dt) {
    const REG = typeof WSK_REGISTRY !== 'undefined' ? WSK_REGISTRY : null;
    if (!REG || !P.wsk) return;
    for (const key in P.wsk) {
      const lv = wsk(key);
      if (!lv) continue;
      const fx = REG[key];
      if (!fx) continue;
      const col = fx.col || '#fff';
      switch (fx.type) {
        case 'aura':
          forEnemiesNear(P.x, P.y, 72 + lv * 6, (e) => {
            if (e.iv > 0 || e.lead) return;
            if (dist2(P.x, P.y, e.x, e.y) < (72 + lv * 6) ** 2) {
              e.hp -= (4 + lv * 1.8) * dt * (P.abyssalMul || 1);
              e.hitT = Math.max(e.hitT, 0.05);
              if (Math.random() < 0.14) spawnPart(e.x, e.y, 0, 0, 0.2, 0.2, col, 3, 1);
            }
          });
          break;
        case 'trail':
          if (P.moving || P.dashT > 0) {
            if (wskCd(key, dt) <= 0) {
              wskResetCd(key, Math.max(0.16, 0.34 - lv * 0.02));
              const slow = col === '#8a5030';
              addZone(P.x, P.y, 34 + lv * 4, { tele: 0.06, life: 0.9 + lv * 0.08, dps: 5 + lv * 2, slow, col, friendly: true });
              if (Math.random() < 0.3) spawnPart(P.x + rand(-8, 8), P.y + rand(-8, 8), 0, 0, 0.25, 0.25, col, 4, 1);
            }
          }
          break;
        case 'bolt':
        case 'lash':
          if (wskCd(key, dt) <= 0) {
            wskResetCd(key, Math.max(2.4, 4.8 - lv * 0.28));
            const t = nearestEnemy(P.x, P.y, P.range);
            if (t) lashStrike(P.x, P.y, t.x, t.y, col, 0.95 + lv * 0.18, fx.type === 'lash' ? 3 : 2);
          }
          break;
        case 'bloom':
        case 'deluge':
          if (wskCd(key, dt) <= 0) {
            wskResetCd(key, Math.max(3.4, 5.4 - lv * 0.3));
            const ax = fx.type === 'deluge' ? P.x + Math.cos(P.face) * 50 : P.x;
            const ay = fx.type === 'deluge' ? P.y + Math.sin(P.face) * 50 : P.y;
            addZone(ax, ay, 40 + lv * 6, { tele: 0.07, life: 1.3 + lv * 0.1, dps: 9 + lv * 2.5, slow: fx.type === 'deluge', col, friendly: true });
            burst(ax, ay, col, 8, 180);
          }
          break;
        case 'orbit': {
          P.wskOrbA = P.wskOrbA || {};
          P.wskOrbA[key] = (P.wskOrbA[key] || 0) + dt * (1.6 + lv * 0.12);
          const n = 1 + Math.min(2, Math.floor(lv / 2));
          for (let i = 0; i < n; i++) {
            const a = P.wskOrbA[key] + i * (TAU / n);
            const ox = P.x + Math.cos(a) * (58 + lv * 5);
            const oy = P.y + Math.sin(a) * (58 + lv * 5);
            forEnemiesNear(ox, oy, 24, (e) => {
              if (e.iv > 0 || e.lead) return;
              if (dist2(ox, oy, e.x, e.y) < 28 * 28) {
                e.hp -= (5 + lv * 1.5) * dt * (P.abyssalMul || 1);
                e.hitT = Math.max(e.hitT, 0.05);
                if (Math.random() < 0.18) spawnPart(e.x, e.y, 0, 0, 0.15, 0.15, col, 3, 1);
              }
            });
          }
          break;
        }
        case 'pull': {
          const R = 88 + lv * 10;
          forEnemiesNear(P.x, P.y, R, (e) => {
            if (e.iv > 0 || e.lead || e.isBoss) return;
            const d = Math.sqrt(dist2(P.x, P.y, e.x, e.y)) || 1;
            if (d < R) { e.x += (P.x - e.x) / d * 22 * dt; e.y += (P.y - e.y) / d * 22 * dt; }
          });
          if (Math.random() < 0.06) spawnPart(P.x + rand(-16, 16), P.y + rand(-16, 16), 0, 0, 0.2, 0.2, col, 2, 1);
          break;
        }
        case 'flare':
          if (wskCd(key, dt) <= 0) {
            wskResetCd(key, Math.max(4.2, 6 - lv * 0.32));
            const R = 88 + lv * 10;
            const dmg = P.dmg * (0.55 + lv * 0.1) * (P.abyssalMul || 1);
            burst(P.x, P.y, col, 14, 300);
            forEnemiesNear(P.x, P.y, R, (e) => {
              if (e.iv > 0 || e.lead) return;
              if (dist2(P.x, P.y, e.x, e.y) < R * R) {
                damageEnemy(e, dmg, P.x, P.y, false);
                const a = Math.atan2(e.y - P.y, e.x - P.x);
                e.x += Math.cos(a) * 16; e.y += Math.sin(a) * 16;
              }
            });
          }
          break;
        case 'still':
          if (!P.moving && (P.stillT || 0) > 0.35 && P.hp < P.maxHp) {
            P.hp = Math.min(P.maxHp, P.hp + lv * 0.9 * dt);
            if (Math.random() < 0.08) spawnPart(P.x + rand(-10, 10), P.y + rand(-10, 10), 0, 0, 0.25, 0.25, col, 3, 1);
          }
          break;
        case 'mist': {
          const R = 80 + lv * 8;
          forEnemiesNear(P.x, P.y, R, (e) => {
            if (e.iv > 0 || e.lead || e.isBoss) return;
            if (dist2(P.x, P.y, e.x, e.y) < R * R) e.chillT = Math.max(e.chillT || 0, 0.18 + lv * 0.04);
          });
          if (Math.random() < 0.05) spawnPart(P.x + rand(-24, 24), P.y + rand(-24, 24), rand(-8, 8), rand(-16, -4), 0.4, 0.4, col, rand(3, 6));
          break;
        }
        default: break;
      }
    }
  }

  function tickWskRegistryOnHit(e, dmg) {
    const REG = typeof WSK_REGISTRY !== 'undefined' ? WSK_REGISTRY : null;
    if (!REG || !P.wsk || e.isBoss || e.lead) return;
    for (const key in P.wsk) {
      const lv = wsk(key);
      if (!lv) continue;
      const fx = REG[key];
      if (!fx) continue;
      if (fx.type === 'hit') {
        e.chillT = Math.max(e.chillT || 0, 0.4 + lv * 0.1);
        if (Math.random() < 0.2) spawnPart(e.x, e.y, 0, 0, 0.2, 0.2, fx.col, 4, 1);
      } else if (fx.type === 'mark') {
        e.wskMark = Math.max(e.wskMark || 0, 2 + lv * 0.5);
      } else if (fx.type === 'echo') {
        P.wskEcho = P.wskEcho || [];
        P.wskEcho.push({ x: e.x, y: e.y, t: 0.32, dmg: dmg * (0.4 + lv * 0.07) });
      } else if (fx.type === 'dodge' && Math.random() < 0.06 + lv * 0.02) {
        P.inv = Math.max(P.inv, 0.1);
        spawnPart(P.x, P.y, rand(-40, 40), rand(-40, 40), 0.15, 0.15, fx.col, 5, 1);
      }
    }
    if (e.wskMark > 0) e.wskMark -= 0.016;
  }

  function tickWskRegistryOnKill(x, y) {
    const REG = typeof WSK_REGISTRY !== 'undefined' ? WSK_REGISTRY : null;
    if (!REG || !P.wsk) return;
    for (const key in P.wsk) {
      const lv = wsk(key);
      if (!lv) continue;
      const fx = REG[key];
      if (!fx) continue;
      if (fx.type === 'killzone' && Math.random() < 0.35 + lv * 0.06) {
        addZone(x, y, 40 + lv * 5, { tele: 0.07, life: 1.1, dps: 8 + lv * 2, col: fx.col, friendly: true });
        burst(x, y, fx.col, 8, 160);
      } else if (fx.type === 'killgold' && Math.random() < 0.16 + lv * 0.04) {
        const bonus = 2 + lv * 2;
        worldCoins += bonus;
        floatText(x, y - 18, '+' + bonus, '#ffd24a', 13);
        burst(x, y, fx.col, 6, 140);
      }
    }
  }

  function tickWskRegistryOnHurt() {
    const REG = typeof WSK_REGISTRY !== 'undefined' ? WSK_REGISTRY : null;
    if (!REG || !P.wsk) return;
    for (const key in P.wsk) {
      const lv = wsk(key);
      if (!lv) continue;
      const fx = REG[key];
      if (!fx || fx.type !== 'hurt') continue;
      const R = 48 + lv * 8;
      const bd = P.dmg * 0.3 * lv * (P.abyssalMul || 1);
      forEnemiesNear(P.x, P.y, R, (e) => {
        if (e.iv > 0 || e.lead || e.isBoss) return;
        if (dist2(P.x, P.y, e.x, e.y) < R * R) { e.hp -= bd; e.hitT = 0.1; }
      });
      burst(P.x, P.y, fx.col, 7, 160);
    }
  }

  function worldSkillOnDashEnd() {
    const REG = typeof WSK_REGISTRY !== 'undefined' ? WSK_REGISTRY : null;
    if (!REG || !P.wsk) return;
    for (const key in P.wsk) {
      const lv = wsk(key);
      if (!lv) continue;
      const fx = REG[key];
      if (!fx || fx.type !== 'dash') continue;
      const R = 55 + lv * 8;
      const qd = P.dmg * (0.8 + lv * 0.2) * (P.abyssalMul || 1);
      forEnemiesNear(P.x, P.y, R, (e) => {
        if (e.iv > 0 || e.lead) return;
        if (dist2(P.x, P.y, e.x, e.y) < R * R) { e.hp -= qd; e.hitT = 0.1; }
      });
      burst(P.x, P.y, fx.col, 10, 200);
      shake = Math.max(shake, 3);
    }
  }

  function worldSkillDmgMul() {
    let mul = (P.wskSandMul || 1) * (P.wskHive && P.wskHiveTgt ? 1 + 0.06 * wsk('hive') : 1);
    return mul;
  }

  function worldSkillOnHit(e, dmg, crit) {
    if (!P.wsk || e.isBoss || e.lead) return;

    if (wsk('rust') > 0 && !e.poison) {
      e.poison = { dur: 1.8 + wsk('rust') * 0.25, dmg: 1.5 + wsk('rust') * 0.8, tickCd: 0.45 };
      spawnPart(e.x, e.y, 0, 0, 0.25, 0.25, '#c87840', 5, 1);
    }

    if (wsk('gloom') > 0) {
      e.chillT = Math.max(e.chillT || 0, 0.35 + wsk('gloom') * 0.08);
      if (Math.random() < 0.15) spawnPart(e.x, e.y, 0, 0, 0.2, 0.2, '#6040a0', 4, 1);
    }

    if (wsk('frost') > 0 && (e.chillT > 0 || e.frz > 0)) {
      const R = 42 + wsk('frost') * 6;
      const sd = P.dmg * (0.35 + wsk('frost') * 0.08) * (P.abyssalMul || 1);
      forEnemiesNear(e.x, e.y, R, (o) => {
        if (o === e || o.iv > 0 || o.lead) return;
        if (dist2(e.x, e.y, o.x, o.y) < R * R) { o.hp -= sd; o.hitT = 0.08; }
      });
      burst(e.x, e.y, '#bfe6ff', 5, 120);
    }

    if (wsk('echo') > 0) {
      P.wskEcho = P.wskEcho || [];
      P.wskEcho.push({ x: e.x, y: e.y, t: 0.35, dmg: dmg * (0.45 + wsk('echo') * 0.08) });
    }

    if (wsk('hive') > 0) {
      if (P.wskHiveTgt === e) P.wskHiveStacks = Math.min(8, (P.wskHiveStacks || 0) + 1);
      else { P.wskHiveTgt = e; P.wskHiveStacks = 1; }
    }

    if ((wsk('leaf') > 0 || P.leafDrift > 0) && e.frz <= 0) {
      const lv = wsk('leaf') || P.leafDrift;
      e.chillT = Math.max(e.chillT || 0, 0.65 + lv * 0.15);
      if (Math.random() < 0.35) spawnPart(e.x + rand(-10, 10), e.y - 8, rand(-20, 20), rand(-40, -10), 0.45, 0.45, '#c87830', rand(3, 5));
    }

    if (crit && wsk('arcCrit') > 0) {
      let chain = null, sd = Infinity;
      forEnemiesNear(e.x, e.y, 100, (o) => {
        if (o === e || o.iv > 0 || o.lead) return;
        const d = dist2(e.x, e.y, o.x, o.y);
        if (d < sd) { sd = d; chain = o; }
      });
      if (chain) {
        damageEnemy(chain, dmg * 0.5, e.x, e.y, false);
        burst(chain.x, chain.y, '#ffe060', 6, 160);
      }
    }

    if (wsk('datamosh') > 0 && Math.random() < 0.08 + wsk('datamosh') * 0.02) {
      P.inv = Math.max(P.inv, 0.12);
      spawnPart(P.x, P.y, rand(-60, 60), rand(-60, 60), 0.2, 0.2, '#80ff80', 6, 1);
    }
    tickWskRegistryOnHit(e, dmg);
    if (e.wskMark > 0) dmg *= 1.12;
  }

  function tickWorldSkillEchoes(dt) {
    if (!P.wskEcho || !P.wskEcho.length) return;
    for (let i = P.wskEcho.length - 1; i >= 0; i--) {
      const ep = P.wskEcho[i];
      ep.t -= dt;
      if (ep.t <= 0) {
        burst(ep.x, ep.y, '#a0d8ff', 6, 140);
        forEnemiesNear(ep.x, ep.y, 36, (o) => {
          if (o.iv > 0 || o.lead) return;
          if (dist2(ep.x, ep.y, o.x, o.y) < 40 * 40) { o.hp -= ep.dmg; o.hitT = 0.1; }
        });
        P.wskEcho.splice(i, 1);
      }
    }
  }

  function worldSkillOnKill(e, x, y) {
    if (!P.wsk) return;

    if (wsk('viral') > 0) {
      const R = 75 + wsk('viral') * 10;
      forEnemiesNear(x, y, R, (o) => {
        if (o.iv > 0 || o.lead || o.isBoss) return;
        if (dist2(x, y, o.x, o.y) < R * R && !o.poison) {
          o.poison = { dur: 2 + wsk('viral') * 0.3, dmg: 2 + wsk('viral'), tickCd: 0.5 };
        }
      });
      burst(x, y, '#40ff60', 10, 200);
    }

    if (wsk('candy') > 0) {
      for (let s = 0; s < 3 + wsk('candy'); s++) {
        const a = rand(0, TAU);
        bullets.push({
          x, y, vx: Math.cos(a) * rand(200, 320), vy: Math.sin(a) * rand(200, 320), r: 4,
          pierce: 1, hit: new Set(), dist: 200, dmgMul: 0.5, homing: 0.6, col: '#ff80c0',
        });
      }
      burst(x, y, '#ffa0d0', 8, 180);
    }

    if (wsk('meteor') > 0 && Math.random() < 0.22 + wsk('meteor') * 0.06) {
      burst(x, y - 40, '#ff8040', 14, 300);
      const R = 55 + wsk('meteor') * 8;
      const md = P.dmg * (1.8 + wsk('meteor') * 0.35) * (P.abyssalMul || 1);
      forEnemiesNear(x, y, R, (o) => {
        if (o.iv > 0 || o.lead) return;
        if (dist2(x, y, o.x, o.y) < R * R) { o.hp -= md; o.hitT = 0.12; }
      });
      shake = Math.max(shake, 6);
      spawnPart(x, y, 0, 0, 0.3, 0.3, '#8a5040', R, 1, R * 2);
    }

    if (wsk('midway') > 0 && Math.random() < 0.18 + wsk('midway') * 0.04) {
      const bonus = 3 + wsk('midway') * 2;
      worldCoins += bonus;
      floatText(x, y - 20, '+' + bonus, '#ffd24a', 14);
      burst(x, y, '#ffd24a', 8, 160);
    }

    if (wsk('chaos') > 0 && Math.random() < 0.2 + wsk('chaos') * 0.08) {
      const R = 80 + wsk('chaos') * 12;
      const qd = P.dmg * (2.2 + wsk('chaos') * 0.5) * (P.abyssalMul || 1);
      forEnemiesNear(x, y, R, (o) => {
        if (o.iv > 0 || o.lead) return;
        if (dist2(x, y, o.x, o.y) < R * R) { o.hp -= qd; o.hitT = 0.1; }
      });
      burst(x, y, '#ff40a0', 16, 320);
      shake = Math.max(shake, 5);
    }

    if (wsk('rift') > 0) {
      for (const g of gems) {
        const d = dist2(P.x, P.y, g.x, g.y);
        if (d > 120 * 120 && d < 420 * 420) {
          g.x += (P.x - g.x) * 0.15;
          g.y += (P.y - g.y) * 0.15;
        }
      }
    }
    tickWskRegistryOnKill(x, y);
  }

  function worldSkillOnHurt() {
    if (wsk('rib') > 0) {
      const R = 50 + wsk('rib') * 8;
      const bd = P.dmg * 0.35 * wsk('rib') * (P.abyssalMul || 1);
      forEnemiesNear(P.x, P.y, R, (e) => {
        if (e.iv > 0 || e.lead || e.isBoss) return;
        if (dist2(P.x, P.y, e.x, e.y) < R * R) { e.hp -= bd; e.hitT = 0.1; }
      });
      burst(P.x, P.y, '#e8e0d0', 8, 180);
    }
    if (wsk('slag') > 0) {
      P.burnAura = Math.max(P.burnAura, 4 + wsk('slag') * 2);
      if (P.wskSlagT == null) P.wskSlagT = 1.5;
    }
    tickWskRegistryOnHurt();
  }

  function tickWorldSkillHurt(dt) {
    if (P.wskSlagT > 0) {
      P.wskSlagT -= dt;
      if (P.wskSlagT <= 0) P.wskSlagT = 0;
    }
  }

  function renderWorldSkillAuras(cx, elapsed) {
    if (!P.wsk) return;
    const drawAura = typeof drawPlayerAura === 'function' ? drawPlayerAura : null;

    if (P.bogAura > 0) {
      const br = P.bogR || 88;
      if (drawAura) drawAura(cx, P.x, P.y, br, '#5a4830', 'bog', elapsed, 0.9);
      else {
        cx.globalAlpha = 0.1 + 0.04 * Math.sin(elapsed * 3);
        cx.fillStyle = '#5a4830';
        cx.beginPath(); cx.arc(P.x, P.y, br, 0, TAU); cx.fill();
      }
    }

    if (wsk('lash') > 0 || wsk('sing') > 0) {
      const col = wsk('sing') > 0 ? '#b06ff0' : '#30b8a0';
      const R = 70 + wsk('sing') * 10;
      if (drawAura) drawAura(cx, P.x, P.y, R, col, 'vortex', elapsed, 0.85);
    }

    if (wsk('eyewall') > 0) {
      const n = 2 + Math.min(2, wsk('eyewall'));
      const R = 72 + wsk('eyewall') * 6;
      if (typeof drawEyewallNodes === 'function') {
        drawEyewallNodes(cx, P.x, P.y, n, R, P.wskEyeA || 0, wsk('eyewall'));
      } else {
        for (let i = 0; i < n; i++) {
          const a = (P.wskEyeA || 0) + i * (TAU / n);
          const ox = P.x + Math.cos(a) * R;
          const oy = P.y + Math.sin(a) * R;
          cx.globalAlpha = 0.7;
          cx.fillStyle = '#80d0ff';
          cx.beginPath(); cx.arc(ox, oy, 5, 0, TAU); cx.fill();
        }
      }
      cx.globalAlpha = 1;
    }

    if (wsk('neon') > 0 && P.moving) {
      if (typeof drawNeonAfterimage === 'function') {
        drawNeonAfterimage(cx, P.x, P.y, P.face, elapsed, 0.9);
      } else {
        cx.globalAlpha = 0.15 + 0.08 * Math.sin(elapsed * 12);
        cx.fillStyle = '#ff60d8';
        cx.beginPath(); cx.arc(P.x - Math.cos(P.face) * 20, P.y - Math.sin(P.face) * 20, 22, 0, TAU); cx.fill();
      }
      cx.globalAlpha = 1;
    }

    if (wsk('mist') > 0) {
      const R = 88 + wsk('mist') * 10;
      if (drawAura) drawAura(cx, P.x, P.y, R, '#c8b0ff', 'mist', elapsed, 0.8);
    }

    const REG = typeof WSK_REGISTRY !== 'undefined' ? WSK_REGISTRY : null;
    if (REG && P.wsk) {
      for (const key in P.wsk) {
        const lv = wsk(key);
        if (!lv) continue;
        const fx = REG[key];
        if (!fx) continue;
        if (fx.type === 'aura' || fx.type === 'pull' || fx.type === 'mist') {
          const R = fx.type === 'pull' ? 88 + lv * 10 : fx.type === 'mist' ? 80 + lv * 8 : 72 + lv * 6;
          const style = typeof auraStyleFromCol === 'function'
            ? auraStyleFromCol(fx.col, fx.type === 'pull' ? 'pull' : fx.type)
            : 'pulse';
          if (drawAura) drawAura(cx, P.x, P.y, R, fx.col, style, elapsed + key.charCodeAt(0) * 0.01, 0.75);
        }
        if (fx.type === 'orbit') {
          const n = 1 + Math.min(2, Math.floor(lv / 2));
          for (let i = 0; i < n; i++) {
            const a = (P.wskOrbA && P.wskOrbA[key] || 0) + i * (TAU / n);
            const ox = P.x + Math.cos(a) * (58 + lv * 5);
            const oy = P.y + Math.sin(a) * (58 + lv * 5);
            if (typeof drawOrbitNode === 'function') drawOrbitNode(cx, ox, oy, fx.col, elapsed, i, lv);
            else {
              cx.globalAlpha = 0.75;
              cx.fillStyle = fx.col;
              cx.beginPath(); cx.arc(ox, oy, 5 + lv * 0.4, 0, TAU); cx.fill();
            }
          }
        }
      }
      cx.globalAlpha = 1;
    }
  }

  window.worldSkillOnDashEnd = worldSkillOnDashEnd;
  window.tickWorldSkillFx = tickWorldSkillFx;
  window.tickWorldSkillEchoes = tickWorldSkillEchoes;
  window.tickWorldSkillHurt = tickWorldSkillHurt;
  window.worldSkillOnHit = worldSkillOnHit;
  window.worldSkillOnKill = worldSkillOnKill;
  window.worldSkillOnHurt = worldSkillOnHurt;
  window.worldSkillDmgMul = worldSkillDmgMul;
  window.renderWorldSkillAuras = renderWorldSkillAuras;
})();
