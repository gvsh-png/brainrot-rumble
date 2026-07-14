'use strict';
// Procedural worlds 12–50 (indices 11–49). Each world: 4 unique grunts + unique wave-5 + final boss.

const EXT_WORLD_NAMES = [
  'NEON DUNES','RUST FACTORY','TOXIC MARSH','MOON CRATER','ABYSS TRENCH','SAND STORM',
  'HAUNTED MIDWAY','STEEL FOUNDRY','BIO LAB','QUANTUM RIFT','MAGMA CORE','FROZEN RUINS',
  'CANDY COLLAPSE','THUNDER PEAK','VOID GARDEN','CLOCKWORK CITY','PLASMA FIELDS','SHADOW CANYON',
  'SOLAR FLARE','MIRROR MAZE','GRAVITY WELL','SPORE JUNGLE','CRYO LAB','METEOR ALLEY',
  'ECHO CAVERNS','STATIC PLAINS','BONE DESERT','GLITCH ZONE','HIVE NEXUS','STORM RING',
  'OBSIDIAN SEA','PRISM TOWER','WARP TUNNEL','CORAL GRAVE','EMBER SPIRE','TOXIC RAIN',
  'STAR FORGE','DREAM FOG','CHAOS SPIRAL','FINAL SWARM',
];

const EXT_MID_SUFFIX = [
  'STALKER','HARBINGER','WARDEN','REAVER','SENTINEL','HUNTER','BRUISER','SKIRMISHER',
  'RAVAGER','MARSHAL','OVERSEER','CAPTAIN','ENFORCER',
];
const EXT_FIN_SUFFIX = [
  'OVERLORD','TITAN','SOVEREIGN','COLOSSUS','NEXUS','OMEGA','HARVESTER','DEVOURER',
  'CATALYST','MONARCH','ABYSS','CROWN','APOCALYPSE',
];

const EXT_MAP_SHAPES = [
  { w: 2800, h: 2800 }, { w: 4600, h: 1400 }, { w: 1800, h: 4200 }, { w: 3600, h: 3600 },
  { w: 1200, h: 4800 }, { w: 3200, h: 2400 }, { w: 2400, h: 3200 }, { w: 4000, h: 4000 },
];

function extHue(i) { return (i * 37) % 360; }
function extHex(h, s, l) {
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const col = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * col).toString(16).padStart(2, '0');
  };
  return '#' + f(0) + f(8) + f(4);
}

function extTheme(i, band) {
  const h = extHue(i);
  const voidC = extHex(h, 38, 62);
  const tile1 = extHex(h, 58, 76);
  const tile2 = extHex(h, 52, 66);
  const bg = extHex(h, 50, 72);
  const tint = extHex((h + 150) % 360, 82, 50);
  const music = band < 15 ? 'world_ext_low' : band < 25 ? 'world_ext_mid' : band < 35 ? 'world_ext_high' : 'world_ext_final';
  return {
    void: voidC, tile1, tile2, tuft: 'rgba(50,90,50,0.22)', wall: extHex(h, 42, 58), post: tile1, postDark: extHex(h, 42, 50),
    bg, tint, music, debris: band > 20 ? 0.65 : 0.45, edgeDark: 0,
  };
}

function scaleStat(base, band, wi, key) {
  const scale = 1 + band * 0.09 + (wi - 11) * 0.02;
  if (key === 'hp') return Math.max(3, Math.round(base * scale));
  if (key === 'score') return Math.round(base * (1 + band * 0.05));
  if (key === 'xp') return Math.max(1, Math.round(base * (1 + band * 0.04)));
  return base;
}

function buildFoes(wi, band, worldName) {
  const prefix = worldName.split(' ')[0] || 'SWARM';
  const spr = id => 'ext_e' + wi + '_' + id;
  const mk = (def) => {
    const o = Object.assign({}, def);
    o.hp = scaleStat(o.hp, band, wi, 'hp');
    o.score = scaleStat(o.score || 10, band, wi, 'score');
    o.xp = scaleStat(o.xp || 1, band, wi, 'xp');
    return o;
  };
  return [
    mk({ spr: spr('b0'), name: prefix + ' Bruiser', hp: 10, sp: 68, r: 17, xp: 2, score: 18 }),
    mk({ spr: spr('b1'), name: prefix + ' Spitter', hp: 7, sp: 76, r: 15, xp: 1, score: 14,
      range: 300, shoot: { type: 'aim', n: 2, cd: 2.5, spd: 165, col: extHex(extHue(wi), 70, 55) } }),
    mk({ spr: spr('s0'), name: prefix + ' Skitter', hp: 5, sp: 102, r: 13, xp: 1, score: 11, dash: true }),
    mk({ spr: spr('s1'), name: prefix + ' Swarmling', hp: 6, sp: 94, r: 14, xp: 1, score: 13,
      death: { type: 'ring', n: 4 } }),
  ];
}

function buildBosses(wi, band, worldName) {
  const midArch = wi % 13;
  const finArch = (wi * 3 + 7) % 13;
  const hpScale = 1 + band * 0.35 + (wi - 11) * 0.04;
  const short = worldName.split(' ')[0];
  const midName = 'SWARM ' + short + ' ' + EXT_MID_SUFFIX[midArch];
  const finName = 'SWARM ' + short + ' ' + EXT_FIN_SUFFIX[finArch];
  const midHp = Math.round((220 + band * 28 + (wi - 11) * 8) * hpScale);
  const finHp = Math.round((520 + band * 42 + (wi - 11) * 14) * hpScale);
  const guardHp = Math.round(midHp * 0.82);
  const eliteHp = Math.round(midHp * 0.95);

  return [
    // Wave 5 — unique mid boss with phased attacks
    {
      spr: 'ext_mb' + wi,
      name: midName,
      hp: midHp,
      r: 54,
      pattern: 'chaos',
      phased: true,
      moveKey: 'extmid' + midArch,
    },
    // Wave 10 — elite guard using world's bruiser sprite
    {
      spr: 'ext_e' + wi + '_b0',
      name: short + ' GUARD',
      hp: guardHp,
      r: 50,
      pattern: 'rings',
      phased: true,
      moveKey: 'extmid' + ((midArch + 4) % 13),
    },
    // Wave 15 — ranger lieutenant
    {
      spr: 'ext_e' + wi + '_b1',
      name: short + ' LIEUTENANT',
      hp: eliteHp,
      r: 52,
      pattern: 'spiral',
      phased: true,
      moveKey: 'extmid' + ((midArch + 8) % 13),
    },
    // Wave 20 — unique final boss, 3 phases + signature attacks
    {
      spr: 'ext_fb' + wi,
      name: finName,
      hp: finHp,
      r: 60,
      pattern: 'chaos',
      phased: true,
      final: true,
      moveKey: 'extfin' + finArch,
    },
  ];
}

function buildExtendedWorlds(startIdx, endIdx) {
  const out = [];
  for (let wi = startIdx; wi <= endIdx; wi++) {
    const band = wi;
    const name = EXT_WORLD_NAMES[wi - startIdx] || ('SWARM SECTOR ' + (wi + 1));
    const map = EXT_MAP_SHAPES[wi % EXT_MAP_SHAPES.length];
    const theme = extTheme(wi, band);
    const mapLayout = typeof WorldMapLayout !== 'undefined' ? WorldMapLayout.pickLayout({ id: 'ext_' + wi }, wi) : null;
    const foes = buildFoes(wi, band, name);
    const bosses = buildBosses(wi, band, name);
    const hpMul = 1 + Math.max(0, band - 9) * 0.12;
    const dmgMul = 1 + Math.max(0, band - 9) * 0.08;
    out.push({
      id: 'ext_' + wi,
      name,
      band,
      waveTarget: 20,
      endless: false,
      map: Object.assign({}, map),
      mapLayout,
      enemyTint: theme.tint,
      hpMul,
      dmgMul,
      introLine: 'THE SWARM GATHERS IN ' + name + '.',
      outroLine: name + ' CLEARED. THE SWARM RECOILS.',
      chalIntroLine: 'CHALLENGER: ' + name + '. SURVIVE 15 MINUTES.',
      chalOutroLine: 'CHALLENGER ' + name + ' CONQUERED.',
      theme,
      foes,
      bosses,
    });
  }
  return out;
}

window.buildExtendedWorlds = buildExtendedWorlds;
