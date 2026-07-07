'use strict';
// Extended-world boss moves, gimmicks, and unique attacks (W12–W50).

(function () {
  const MID_ARCH = [
    { gimmick: 'ext_spore', p1: ['EXT_LANCE', 'ring12', 'aimed3'], p2: ['EXT_SPORE_FAN', 'EXT_LANCE', 'ring16'], p3: ['EXT_SPORE_FAN', 'EXT_SHOCK_GRID', 'SPIRAL_LITE'] },
    { gimmick: 'ext_orbit', p1: ['EXT_ORBIT_BURST', 'aimed5', 'ring12'], p2: ['EXT_ORBIT_BURST', 'EXT_BEAM_SWEEP', 'ring16'], p3: ['EXT_ORBIT_BURST', 'EXT_BEAM_SWEEP', 'RING_VOLLEY'] },
    { gimmick: 'ext_quake', p1: ['EXT_PHASE_SLAM', 'QUAKE_LINE', 'aimed3'], p2: ['EXT_PHASE_SLAM', 'QUAKE_CROSS', 'ring12'], p3: ['EXT_PHASE_SLAM', 'QUAKE_RADIAL', 'RING_VOLLEY'] },
    { gimmick: 'ext_pull', p1: ['pull', 'EXT_LANCE', 'ring12'], p2: ['EXT_VORTEX_PULL', 'aimed5', 'ring16'], p3: ['EXT_VORTEX_PULL', 'EXT_COLLAPSE', 'SPIRAL_LITE'] },
    { gimmick: 'ext_blink', p1: ['warp', 'EXT_LANCE', 'aimed3'], p2: ['warp', 'PRISM_SPLIT', 'ring12'], p3: ['warp', 'EXT_SHOCK_GRID', 'RING_VOLLEY'] },
    { gimmick: 'ext_hive', p1: ['EXT_HIVE_SPAWN', 'ring12', 'aimed3'], p2: ['EXT_HIVE_SPAWN', 'EXT_SWARM_BURST', 'ring16'], p3: ['EXT_SWARM_BURST', 'EXT_HIVE_SPAWN', 'SPIRAL_LITE'] },
    { gimmick: 'ext_frost', p1: ['EXT_FROST_FAN', 'ring12', 'aimed3'], p2: ['EXT_FROST_FAN', 'EXT_SHOCK_GRID', 'ring16'], p3: ['EXT_FROST_FAN', 'CRYSTAL_SPIKE', 'RING_VOLLEY'] },
    { gimmick: 'ext_ember', p1: ['EMBER_RAIN', 'EXT_PHASE_SLAM', 'aimed3'], p2: ['LAVA_POOL', 'EXT_BEAM_SWEEP', 'ring12'], p3: ['ERUPTION', 'EXT_PHASE_SLAM', 'RING_VOLLEY'] },
    { gimmick: 'ext_void', p1: ['EXPAND_IMPLODE', 'EXT_LANCE', 'ring12'], p2: ['EXPAND_IMPLODE', 'EXT_VORTEX_PULL', 'ring16'], p3: ['EXT_COLLAPSE', 'EXT_VOID_RAIN', 'SPIRAL_LITE'] },
    { gimmick: 'ext_storm', p1: ['spiral', 'EXT_ORBIT_BURST', 'aimed5'], p2: ['SPIRAL_STORM', 'EXT_BEAM_SWEEP', 'ring16'], p3: ['SPIRAL_STORM', 'EXT_ORBIT_BURST', 'RING_VOLLEY'] },
    { gimmick: 'ext_bone', p1: ['BURROW_SLAM', 'EXT_LANCE', 'ring12'], p2: ['BURROW_DOUBLE', 'EXT_PHASE_SLAM', 'ring16'], p3: ['BURROW_DOUBLE', 'EXT_SWARM_BURST', 'RING_VOLLEY'] },
    { gimmick: 'ext_tether', p1: ['TETHER', 'aimed3', 'ring12'], p2: ['TETHER', 'EXT_BEAM_SWEEP', 'ring16'], p3: ['TETHER', 'EXT_VORTEX_PULL', 'SPIRAL_LITE'] },
    { gimmick: 'ext_ricochet', p1: ['RICOCHET', 'EXT_LANCE', 'aimed3'], p2: ['RICOCHET', 'SWEEP_DUAL', 'ring16'], p3: ['RICOCHET', 'EXT_SHOCK_GRID', 'RING_VOLLEY'] },
  ];

  const FIN_ARCH = [
    { gimmick: 'ext_fin_hive',    p1: ['EXT_HIVE_SPAWN', 'FIN_H0_P1', 'ring16'],       p2: ['EXT_SWARM_BURST', 'FIN_H0_P2', 'aimed5'],       p3: ['FIN_H0_P3', 'EXT_HIVE_SPAWN', 'EXT_LANCE'] },
    { gimmick: 'ext_fin_void',    p1: ['warp', 'FIN_H1_P1', 'ring16'],                 p2: ['EXT_COLLAPSE', 'FIN_H1_P2', 'PRISM_SPLIT'],     p3: ['FIN_H1_P3', 'EXT_VOID_RAIN', 'EXT_LANCE'] },
    { gimmick: 'ext_fin_plasma',  p1: ['LAVA_POOL', 'FIN_H2_P1', 'ring16'],            p2: ['ERUPTION', 'FIN_H2_P2', 'aimed5'],              p3: ['FIN_H2_P3', 'MELTDOWN', 'EXT_PHASE_SLAM'] },
    { gimmick: 'ext_fin_crystal', p1: ['CRYSTAL_SPIKE', 'FIN_H3_P1', 'ring16'],        p2: ['PRISM_SPLIT', 'FIN_H3_P2', 'aimed5'],           p3: ['FIN_H3_P3', 'CRYSTAL_SPIKE', 'EXT_FROST_FAN'] },
    { gimmick: 'ext_fin_storm',   p1: ['spiral', 'FIN_H4_P1', 'ring16'],               p2: ['SPIRAL_STORM', 'FIN_H4_P2', 'aimed5'],           p3: ['FIN_H4_P3', 'EXT_ORBIT_BURST', 'EXT_BEAM_SWEEP'] },
    { gimmick: 'ext_fin_toxic',   p1: ['SPORE_FIELD', 'FIN_H5_P1', 'ring16'],         p2: ['SWAMP_FLOOD', 'FIN_H5_P2', 'aimed5'],           p3: ['FIN_H5_P3', 'SPORE_FIELD', 'EXT_SPORE_FAN'] },
    { gimmick: 'ext_fin_gravity', p1: ['pull', 'FIN_H6_P1', 'ring16'],                 p2: ['EXT_VORTEX_PULL', 'FIN_H6_P2', 'aimed5'],       p3: ['FIN_H6_P3', 'EXT_COLLAPSE', 'DEVOUR'] },
    { gimmick: 'ext_fin_clock',   p1: ['SWEEP', 'FIN_H7_P1', 'ring16'],                p2: ['SWEEP_DUAL', 'FIN_H7_P2', 'aimed5'],             p3: ['FIN_H7_P3', 'RICOCHET', 'QUAKE_CROSS'] },
    { gimmick: 'ext_fin_frost',   p1: ['EXT_FROST_FAN', 'FIN_H8_P1', 'ring16'],        p2: ['CRYSTAL_SPIKE', 'FIN_H8_P2', 'ring2'],          p3: ['FIN_H8_P3', 'EXT_FROST_FAN', 'EXT_SHOCK_GRID'] },
    { gimmick: 'ext_fin_ember',   p1: ['EMBER_RAIN', 'FIN_H9_P1', 'ring16'],           p2: ['ERUPTION', 'FIN_H9_P2', 'aimed5'],              p3: ['FIN_H9_P3', 'MELTDOWN', 'CARPET_RUN'] },
    { gimmick: 'ext_fin_quantum', p1: ['warp', 'FIN_H10_P1', 'ring16'],                p2: ['EXPAND_IMPLODE', 'FIN_H10_P2', 'aimed5'],       p3: ['FIN_H10_P3', 'EXT_VOID_RAIN', 'PRISM_SPLIT'] },
    { gimmick: 'ext_fin_bone',    p1: ['BURROW_SLAM', 'FIN_H11_P1', 'ring16'],         p2: ['BROOD_BURST', 'FIN_H11_P2', 'aimed5'],          p3: ['FIN_H11_P3', 'DEVOUR', 'EXT_SWARM_BURST'] },
    { gimmick: 'ext_fin_omega',   p1: ['TETHER', 'FIN_H12_P1', 'ring16'],               p2: ['EXT_VORTEX_PULL', 'FIN_H12_P2', 'aimed5'],      p3: ['FIN_H12_P3', 'DEVOUR', 'EXT_PHASE_SLAM'] },
  ];

  // unique fake bullet-hell per extended final archetype + phase (flashy, gapped, low dmg)
  const FIN_HELL = [
    { p1: { k: 'echo', n: 14, gap: 0.44, col: '#9a7ad8' }, p2: { k: 'orbit', n: 14, col: '#9a7ad8' }, p3: { k: 'storm_echo', n: 5, echoN: 12, twin: true, col: '#9a7ad8' } },
    { p1: { k: 'gap', n: 16, gap: 0.42 }, p2: { k: 'wall', col: '#6c5ce7' }, p3: { k: 'storm', n: 6, twin: true, col: '#6c5ce7' } },
    { p1: { k: 'gap', n: 14, gap: 0.43, col: '#e0503f' }, p2: { k: 'echo', n: 12, gap: 0.40, col: '#ff7a2a' }, p3: { k: 'storm', n: 5, col: '#e0503f' } },
    { p1: { k: 'echo', n: 14, gap: 0.43, col: '#b08fe0' }, p2: { k: 'wall', col: '#b08fe0' }, p3: { k: 'cross', col: '#b08fe0' } },
    { p1: { k: 'orbit', n: 12, col: '#9fd0ff' }, p2: { k: 'gap', n: 14, gap: 0.40 }, p3: { k: 'storm_wall', n: 5, twin: true, col: '#9fd0ff' } },
    { p1: { k: 'echo', n: 14, gap: 0.44, col: '#7ab955' }, p2: { k: 'grid', n: 4 }, p3: { k: 'storm', n: 5, twin: true, col: '#7ab955' } },
    { p1: { k: 'gap', n: 14, gap: 0.42, col: '#d2a0ff' }, p2: { k: 'echo', n: 14, gap: 0.41, col: '#d2a0ff' }, p3: { k: 'storm', n: 6, twin: true, col: '#d2a0ff' } },
    { p1: { k: 'gap', n: 12, gap: 0.40, col: '#ffd24a' }, p2: { k: 'echo', n: 14, gap: 0.42, col: '#ffd24a' }, p3: { k: 'wall', col: '#ffd24a' } },
    { p1: { k: 'echo', n: 14, gap: 0.44, col: '#9fd0ff' }, p2: { k: 'wall', col: '#bfe6ff' }, p3: { k: 'storm', n: 5, twin: true, col: '#9fd0ff' } },
    { p1: { k: 'orbit', n: 10, col: '#ff7a2a' }, p2: { k: 'echo', n: 12, gap: 0.43, col: '#ff7a2a' }, p3: { k: 'storm', n: 5, col: '#e0503f' } },
    { p1: { k: 'gap', n: 14, gap: 0.42, col: '#7ec8ff' }, p2: { k: 'orbit', n: 12, col: '#c77dff' }, p3: { k: 'storm_echo', n: 5, echoN: 10, twin: true, col: '#6c5ce7' } },
    { p1: { k: 'gap', n: 14, gap: 0.43, col: '#9a7a52' }, p2: { k: 'echo', n: 14, gap: 0.42, col: '#9a7a52' }, p3: { k: 'storm', n: 5, twin: true, col: '#9a7a52' } },
    { p1: { k: 'echo', n: 14, gap: 0.43, col: '#ff5acd' }, p2: { k: 'wall', col: '#ff5acd' }, p3: { k: 'cross', col: '#ff5acd' } },
  ];

  function extHellDmg(e) {
    return typeof bossHellDmg === 'function' ? bossHellDmg(e) : 0.34;
  }

  function runFinHell(e, spec) {
    const col = spec.col || bossCol(e);
    const dm = extHellDmg(e);
    switch (spec.k) {
      case 'echo':
        if (typeof bossHellEcho === 'function') bossHellEcho(e, { dur: 2.1, n: spec.n || 14, spd: 94, col, gap: spec.gap || 0.43, dmg: dm });
        else { e.echo = { t: 2.1, ivT: 0, n: spec.n || 14, spd: 94, col, gap: spec.gap || 0.43, at: rand(0, TAU), dmgMul: dm }; sfx.warn(); }
        return 2.1;
      case 'gap':
        mRingGap(e, spec.n || 14, 100, col, spec.gap || 0.42, null, dm);
        shake = Math.max(shake, 4); return 0.4;
      case 'orbit':
        if (typeof bossHellOrbit === 'function') bossHellOrbit(e, spec.n || 12, col, 0.75, 30);
        return 0.55;
      case 'wall':
        if (arena) {
          const side = pick(['left', 'right', 'top', 'bottom']);
          const gapAt = (side === 'left' || side === 'right') ? P.y + rand(-40, 40) : P.x + rand(-40, 40);
          mWall(side, 110, col, gapAt, 108, 10, dm);
        }
        return 1.0;
      case 'storm':
        if (typeof bossHellStorm === 'function') bossHellStorm(e, { dur: 2.4, n: spec.n || 5, spd: 100, step: 0.31, col, cd: 0.15, twin: !!spec.twin, shake: 4 });
        return 2.4;
      case 'storm_echo':
        if (typeof bossHellStorm === 'function') bossHellStorm(e, { dur: 2.3, n: spec.n || 5, spd: 98, step: 0.32, col, cd: 0.15, twin: !!spec.twin, shake: 4 });
        if (typeof bossHellEcho === 'function') bossHellEcho(e, { dur: 2.0, n: spec.echoN || 12, spd: 92, col, gap: 0.44, dmg: dm, warn: false });
        return 2.3;
      case 'storm_wall':
        if (typeof bossHellStorm === 'function') bossHellStorm(e, { dur: 2.2, n: spec.n || 5, spd: 102, step: 0.30, col, cd: 0.15, twin: !!spec.twin, shake: 4 });
        if (arena) mWall(pick(['left', 'right']), 108, col, P.y, 105, 9, dm);
        return 2.2;
      case 'cross': {
        mRingGap(e, 14, 108, col, 0.38, null, dm);
        mRingGap(e, 12, 78, col, 0.42, null, dm);
        shake = Math.max(shake, 5); return 0.4;
      }
      case 'grid': {
        const n = spec.n || 4;
        if (arena) for (let k = 0; k < n; k++) addZone(rand(arena.x + 50, arena.x + arena.w - 50), rand(arena.y + 50, arena.y + arena.h - 50), 48, { tele: 0.85, life: 0.5, dps: 12, col });
        sfx.warn(); return 0.45;
      }
      default: return 0.3;
    }
  }

  function finHellMove(e, mv) {
    const m = /^FIN_H(\d+)_P(\d+)$/.exec(mv);
    if (!m) return null;
    const arch = parseInt(m[1], 10) % FIN_HELL.length;
    const ph = 'p' + m[2];
    const spec = FIN_HELL[arch][ph];
    if (!spec) return null;
    return runFinHell(e, spec);
  }

  function archPool(arch, vph) {
    if (vph >= 3) return arch.p3.slice();
    if (vph >= 2) return arch.p2.slice();
    return arch.p1.slice();
  }

  function bossCol(e) {
    const w = curWorld();
    return (w && w.enemyTint) || (w && w.theme && w.theme.tint) || '#b06ff0';
  }

  function extBossMoves(e) {
    const mk = e.mk || e.spr || '';
    let arch = null;
    if (mk.startsWith('extmid')) arch = MID_ARCH[parseInt(mk.slice(6), 10) % MID_ARCH.length];
    else if (mk.startsWith('extfin')) arch = FIN_ARCH[parseInt(mk.slice(6), 10) % FIN_ARCH.length];
    if (!arch) return null;
    return archPool(arch, e.vph || 1);
  }

  function extGimmickUpdate(e, dt) {
    if (!e.gimmick || !e.gimmick.startsWith('ext_') || e.scriptPause) return;
    const ph = e.vph || 1;
    const gm = (e.finalPhase || e.partner) ? 1 : 1.35;
    const col = bossCol(e);
    switch (e.gimmick) {
      case 'ext_spore':
      case 'ext_fin_toxic':
        e.gT -= dt;
        if (e.gT <= 0) {
          e.gT = (ph >= 3 ? 1.8 : 2.4) * gm;
          if (arena) addZone(rand(arena.x + 50, arena.x + arena.w - 50), rand(arena.y + 50, arena.y + arena.h - 50), 44, { tele: 0.55, life: ph >= 3 ? 3.2 : 2.4, dps: 9, slow: true, col });
        }
        break;
      case 'ext_orbit':
      case 'ext_fin_storm':
        e.gT -= dt;
        if (e.gT <= 0) {
          e.gT = (ph >= 3 ? 1.0 : 1.4) * gm;
          const n = ph >= 3 ? 4 : 3, off = rand(0, TAU);
          for (let k = 0; k < n; k++) fireEB(e.x, e.y, 0, 0, col, { orbit: { cx: e.x, cy: e.y, ang: off + k * TAU / n, rad: 80, angV: 2.4, radV: 36 } });
        }
        break;
      case 'ext_quake':
      case 'ext_fin_clock':
        e.gT -= dt;
        if (e.gT <= 0) {
          e.gT = (ph >= 3 ? 2.6 : 3.4) * gm;
          const off = rand(0, TAU);
          for (let q = 0; q < (ph >= 3 ? 6 : 4); q++) geyserLine(e.x, e.y, off + q * TAU / (ph >= 3 ? 6 : 4), col, 5, 54);
          shake = Math.max(shake, 6);
        }
        break;
      case 'ext_pull':
      case 'ext_fin_gravity':
        if (dist2(e.x, e.y, P.x, P.y) < 180 * 180) { P.slowT = Math.max(P.slowT, 0.2); }
        e.gT -= dt;
        if (e.gT <= 0) {
          e.gT = (ph >= 3 ? 2.2 : 2.8) * gm;
          mRingGap(e, ph >= 3 ? 14 : 12, 115, col, 0.34, null, extHellDmg(e));
        }
        break;
      case 'ext_blink':
      case 'ext_fin_quantum':
        e.gT -= dt;
        if (e.gT <= 0 && e.mst === 'recover' && !(e.warpT > 0) && !(e.stun > 0)) {
          e.gT = (ph >= 3 ? 2.8 : 3.6) * gm;
          e.warpT = 0.42;
          burst(e.x, e.y, col, 14, 220);
        }
        break;
      case 'ext_hive':
      case 'ext_fin_hive':
        e.gT2 -= dt;
        if (e.gT2 <= 0) {
          e.gT2 = (ph >= 3 ? 4.5 : 6.0) * gm;
          const spr = curFoes[0] ? curFoes[0].spr : 'swarmmite';
          summonAdds(e, spr, 2, ph >= 3 ? 5 : 3);
        }
        break;
      case 'ext_frost':
      case 'ext_fin_frost':
        if (dist2(e.x, e.y, P.x, P.y) < 140 * 140) P.slowT = Math.max(P.slowT, 0.28);
        e.gT -= dt;
        if (e.gT <= 0) {
          e.gT = (ph >= 3 ? 1.6 : 2.2) * gm;
          mRingGap(e, 10, 105, '#9fd0ff', 0.36, null, extHellDmg(e));
        }
        break;
      case 'ext_ember':
      case 'ext_fin_ember':
        e.gT -= dt;
        if (e.gT <= 0) {
          e.gT = (ph >= 3 ? 1.4 : 1.9) * gm;
          addZone(P.x + rand(-90, 90), P.y + rand(-90, 90), 52, { tele: 0.65, life: 1.8, dps: 14, col: '#e0503f' });
        }
        break;
      case 'ext_void':
      case 'ext_fin_void':
        e.gT -= dt;
        if (e.gT <= 0) {
          e.gT = (ph >= 3 ? 2.0 : 2.6) * gm;
          e.pull = 0.8; e.pullStr = ph >= 3 ? 95 : 70;
        }
        break;
      case 'ext_storm':
        e.gT -= dt;
        if (e.gT <= 0) {
          e.gT = (ph >= 3 ? 1.2 : 1.6) * gm;
          mRingGap(e, ph >= 3 ? 14 : 12, 118, col, 0.34, null, extHellDmg(e));
        }
        break;
      case 'ext_bone':
      case 'ext_fin_bone':
        e.gT -= dt;
        if (e.gT <= 0) {
          e.gT = (ph >= 3 ? 2.4 : 3.2) * gm;
          debrisDrop(ph >= 3 ? 4 : 3, col);
        }
        break;
      case 'ext_tether':
      case 'ext_fin_omega':
        e.gT -= dt;
        if (e.gT <= 0 && e.mst === 'recover' && e.tether <= 0) {
          e.gT = (ph >= 3 ? 3.0 : 4.0) * gm;
          e.tether = ph >= 3 ? 1.8 : 1.4;
        }
        break;
      case 'ext_ricochet':
        e.gT -= dt;
        if (e.gT <= 0 && e.mst === 'recover' && !e.wd) {
          e.gT = (ph >= 3 ? 3.2 : 4.2) * gm;
          e.wd = { n: 1, ang: Math.atan2(P.y - e.y, P.x - e.x), spd: 400, tT: 0, life: 1.8 };
          sfx.warn();
        }
        break;
      case 'ext_fin_plasma':
        e.gT -= dt;
        if (e.gT <= 0) {
          e.gT = ph >= 3 ? 2.2 : 3.0;
          for (let k = 0; k < (ph >= 3 ? 3 : 2); k++) addZone(rand(WALL + 80, WORLD.w - WALL - 80), rand(WALL + 80, WORLD.h - WALL - 80), 58, { tele: 0.75, life: 2.0, dps: 15, col: '#e0503f' });
        }
        break;
      case 'ext_fin_crystal':
        e.gT -= dt;
        if (e.gT <= 0) {
          e.gT = ph >= 3 ? 2.4 : 3.2;
          const aY = arena ? arena.y : WALL, aH = arena ? arena.h : WORLD.h - 2 * WALL;
          for (let k = 1; k <= (ph >= 3 ? 4 : 3); k++) addZone(P.x + rand(-40, 40), aY + k * (aH / 5), 46, { tele: 0.45 + k * 0.1, life: 0.65, dps: 17, col: '#b08fe0' });
        }
        break;
    }
  }

  function extExecMove(e) {
    const col = bossCol(e);
    const finR = finHellMove(e, e.mv);
    if (finR != null) return finR;
    switch (e.mv) {
      case 'EXT_LANCE':
        mAimed(e, 5, 0.18, 165, col);
        return 0.22;
      case 'EXT_SPORE_FAN':
        mAimed(e, 7, 0.16, 140, col);
        for (let k = 0; k < 3; k++) addZone(P.x + rand(-120, 120), P.y + rand(-120, 120), 50, { tele: 0.7, life: 2.0, dps: 10, slow: true, col });
        return 0.3;
      case 'EXT_ORBIT_BURST': {
        const n = e.vph >= 3 ? 10 : 8, off = rand(0, TAU);
        for (let k = 0; k < n; k++) fireEB(e.x, e.y, off + k * TAU / n, 135, col);
        muzzleFlash(e.x, e.y, col);
        return 0.28;
      }
      case 'EXT_BEAM_SWEEP':
        e.gsweep = { t: 1.6, ang: Math.atan2(P.y - e.y, P.x - e.x), dir: Math.random() < 0.5 ? 1 : -1, dropT: 0 };
        return 1.6;
      case 'EXT_PHASE_SLAM':
        addZone(P.x, P.y, 78, { tele: 0.55, life: 0.65, dps: 20, col });
        addZone(P.x + rand(-110, 110), P.y + rand(-110, 110), 64, { tele: 0.85, life: 0.6, dps: 18, col });
        shake = Math.max(shake, 8);
        sfx.hit();
        return 0.45;
      case 'EXT_VORTEX_PULL':
        e.pull = 1.1; e.pullStr = 120;
        e.spin = 0.9; e.spinCol = col;
        return 1.0;
      case 'EXT_COLLAPSE':
        mRingGap(e, 14, 118, col, 0.36, null, extHellDmg(e));
        e.pull = 1.1; e.pullStr = 115;
        return 1.0;
      case 'EXT_HIVE_SPAWN':
        if (curFoes[2]) summonAdds(e, curFoes[2].spr, 3, e.vph >= 3 ? 6 : 4);
        else summonAdds(e, 'swarmmite', 3, 4);
        mRingGap(e, 12, 118, col, 0.35, null, extHellDmg(e));
        return 0.4;
      case 'EXT_SWARM_BURST':
        if (curFoes[3]) summonAdds(e, curFoes[3].spr, 4, e.vph >= 3 ? 8 : 5);
        mRingGap(e, 14, 118, col, 0.36, null, extHellDmg(e));
        return 0.35;
      case 'EXT_FROST_FAN':
        mAimed(e, 6, 0.17, 130, '#9fd0ff');
        mRingGap(e, 10, 108, '#bfe6ff', 0.38, null, extHellDmg(e));
        return 0.25;
      case 'EXT_VOID_RAIN':
        debrisDrop(e.vph >= 3 ? 5 : 3, col);
        mRingGap(e, 12, 115, col, 0.36, null, extHellDmg(e));
        return 0.35;
      case 'EXT_SHOCK_GRID': {
        const n = e.vph >= 3 ? 6 : 4;
        if (arena) for (let k = 0; k < n; k++) addZone(rand(arena.x + 40, arena.x + arena.w - 40), rand(arena.y + 40, arena.y + arena.h - 40), 52, { tele: 0.8, life: 0.55, dps: 16, col });
        else for (let k = 0; k < n; k++) addZone(P.x + rand(-160, 160), P.y + rand(-160, 160), 52, { tele: 0.8, life: 0.55, dps: 16, col });
        sfx.warn();
        return 0.45;
      }
      case 'EXT_FINAL_CATACLYSM': {
        const dm = extHellDmg(e);
        mRingGap(e, 14, 108, col, 0.38, null, dm);
        mRingGap(e, 12, 78, col, 0.42, null, dm);
        for (let k = 0; k < 3; k++) addZone(P.x + rand(-120, 120), P.y + rand(-120, 120), 58, { tele: 0.8, life: 0.55, dps: 12, col });
        if (typeof bossHellStorm === 'function') bossHellStorm(e, { dur: 2.0, n: 4, spd: 96, step: 0.33, col, cd: 0.16, twin: true, shake: 6 });
        else { e.storm = 2.0; e.stormN = 4; e.stormSpd = 96; e.stormStep = 0.33; e.stormCol = col; e.stormCd = 0.16; e.stormTwin = true; e.stormDmgMul = dm; sfx.warn(); }
        return 2.0;
      }
    }
    return null;
  }

  // Register gimmick keys for spawnBoss lookup (moveKey → gimmick id)
  if (typeof GIMMICK !== 'undefined') {
    for (let i = 0; i < MID_ARCH.length; i++) GIMMICK['extmid' + i] = MID_ARCH[i].gimmick;
    for (let i = 0; i < FIN_ARCH.length; i++) GIMMICK['extfin' + i] = FIN_ARCH[i].gimmick;
  }

  function extFinFinalScript(e) {
    const mk = e.mk || '';
    const archIdx = parseInt(mk.slice(6), 10) % FIN_ARCH.length;
    const hell = FIN_HELL[archIdx % FIN_HELL.length];
    const col = bossCol(e);
    const DPS = { name: 'STRIKE NOW!', col: '#7ed957', dur: 8.0, iv: false };
    const assault = (name, specKey, vulnMul) => ({
      name,
      col,
      dur: 7.5,
      iv: true,
      vulnMul: vulnMul != null ? vulnMul : undefined,
      hold: 'center',
      enter(ev) { ev.sCd = 0.45; ev.sk = 0; },
      tick(ev, dt) {
        ev.sCd -= dt;
        if (ev.sCd <= 0) {
          ev.sCd = Math.max(1.1, 1.6 - (ev.loop || 0) * 0.12);
          ev.sk++;
          const spec = hell[specKey] || hell.p3 || hell.p2 || hell.p1;
          if (spec) runFinHell(ev, spec);
        }
      },
    });
    return [
      assault('FINAL ASSAULT I', 'p1'),
      DPS,
      assault('FINAL ASSAULT II', 'p2', 0.35),
      DPS,
      assault('FINAL CATACLYSM', 'p3'),
      DPS,
    ];
  }

  window.extBossMoves = extBossMoves;
  window.extExecMove = extExecMove;
  window.extGimmickUpdate = extGimmickUpdate;
  window.extFinFinalScript = extFinFinalScript;
})();
