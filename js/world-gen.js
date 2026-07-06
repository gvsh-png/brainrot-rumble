'use strict';
// Procedural worlds 12–50 (indices 11–49). Each world: unique bright theme, map, layout, 4 grunts + bosses.

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

// 39 unique bright floor palettes — void always matches bg (no black bleed).
const EXT_WORLD_THEMES = [
  { bg:'#ffe8a8', tile1:'#fff4c8', tile2:'#ffd878', tint:'#ff40b0', wall:'#f0c860', debris:0.5 },
  { bg:'#ffd8c0', tile1:'#ffe8d8', tile2:'#ffc0a0', tint:'#e85030', wall:'#e8a888', debris:0.55 },
  { bg:'#c8f8b0', tile1:'#e0ffc8', tile2:'#a8e890', tint:'#40c820', wall:'#88d070', debris:0.45 },
  { bg:'#d0e8ff', tile1:'#e8f4ff', tile2:'#b8d8f8', tint:'#4090ff', wall:'#98c0e8', debris:0.4 },
  { bg:'#b8f0e8', tile1:'#d8faf0', tile2:'#98e0d0', tint:'#20b8a0', wall:'#78c8b8', debris:0.5 },
  { bg:'#ffe0b0', tile1:'#fff0d0', tile2:'#ffd090', tint:'#f0a020', wall:'#e8c070', debris:0.6 },
  { bg:'#e8d0ff', tile1:'#f4e8ff', tile2:'#d8b8f8', tint:'#a040e0', wall:'#c8a0e8', debris:0.45 },
  { bg:'#c8e0f0', tile1:'#e0f0ff', tile2:'#a8d0e8', tint:'#3080c0', wall:'#88b8d8', debris:0.5 },
  { bg:'#d8ffc8', tile1:'#f0ffe0', tile2:'#c0f0a8', tint:'#60d030', wall:'#a0e080', debris:0.45 },
  { bg:'#ffc8e8', tile1:'#ffe8f4', tile2:'#f8a8d0', tint:'#e04090', wall:'#e890c0', debris:0.5 },
  { bg:'#ffe0c8', tile1:'#fff0e0', tile2:'#ffc8a0', tint:'#ff6020', wall:'#f0a878', debris:0.55 },
  { bg:'#c8f0ff', tile1:'#e0f8ff', tile2:'#a8e0f8', tint:'#20a0e8', wall:'#88c8e8', debris:0.4 },
  { bg:'#fff0b8', tile1:'#fff8d8', tile2:'#ffe890', tint:'#ff80c0', wall:'#f0d070', debris:0.5 },
  { bg:'#e0c8ff', tile1:'#f0e0ff', tile2:'#d0a8f8', tint:'#8040e0', wall:'#b890e8', debris:0.45 },
  { bg:'#c8ffd8', tile1:'#e8fff0', tile2:'#a8f0c0', tint:'#30c860', wall:'#88e0a0', debris:0.5 },
  { bg:'#ffd8f0', tile1:'#ffe8f8', tile2:'#f8b8e0', tint:'#e040a0', wall:'#e8a0c8', debris:0.45 },
  { bg:'#d0f8c8', tile1:'#e8ffe0', tile2:'#b8e8a8', tint:'#50b830', wall:'#98d888', debris:0.5 },
  { bg:'#ffe8d0', tile1:'#fff4e8', tile2:'#ffd8b0', tint:'#e88030', wall:'#f0c090', debris:0.55 },
  { bg:'#c8e8ff', tile1:'#e0f4ff', tile2:'#a8d0f8', tint:'#3088e8', wall:'#88b8e0', debris:0.4 },
  { bg:'#f0ffc8', tile1:'#f8ffe0', tile2:'#e0f8a0', tint:'#88d020', wall:'#c0e878', debris:0.5 },
  { bg:'#ffc8d8', tile1:'#ffe0e8', tile2:'#f8a8c0', tint:'#e03060', wall:'#e888a8', debris:0.45 },
  { bg:'#d8f0ff', tile1:'#ecf8ff', tile2:'#b8e0f8', tint:'#40a0f0', wall:'#98c8e8', debris:0.4 },
  { bg:'#fff8c0', tile1:'#ffffe0', tile2:'#fff0a0', tint:'#f0c020', wall:'#f0e080', debris:0.5 },
  { bg:'#e8c8ff', tile1:'#f4e0ff', tile2:'#d8a8f8', tint:'#9040e0', wall:'#c098e8', debris:0.45 },
  { bg:'#c8ffe8', tile1:'#e0fff4', tile2:'#a8f0d0', tint:'#20c890', wall:'#88e0b8', debris:0.5 },
  { bg:'#ffe0e0', tile1:'#fff0f0', tile2:'#ffc8c8', tint:'#e04040', wall:'#f0a0a0', debris:0.45 },
  { bg:'#d0ffe0', tile1:'#e8fff0', tile2:'#b0f8c8', tint:'#30b860', wall:'#90e8a8', debris:0.5 },
  { bg:'#f0e8ff', tile1:'#f8f0ff', tile2:'#e0d0f8', tint:'#7040c0', wall:'#c8b0e8', debris:0.45 },
  { bg:'#fff0c8', tile1:'#fff8e0', tile2:'#ffe8a0', tint:'#e8a030', wall:'#f0d080', debris:0.55 },
  { bg:'#c8f8f0', tile1:'#e0fff8', tile2:'#a8e8d8', tint:'#30b8a0', wall:'#88d8c8', debris:0.5 },
  { bg:'#ffd0e8', tile1:'#ffe8f4', tile2:'#f8b0d0', tint:'#d04080', wall:'#e898b8', debris:0.45 },
  { bg:'#e0ffd0', tile1:'#f0ffe8', tile2:'#c8f8a8', tint:'#70c030', wall:'#a8e088', debris:0.5 },
  { bg:'#d8e8ff', tile1:'#ecf4ff', tile2:'#b8d0f8', tint:'#5080e0', wall:'#98b8e0', debris:0.4 },
  { bg:'#fff8d8', tile1:'#fffff0', tile2:'#fff0b8', tint:'#f0b040', wall:'#f0d898', debris:0.5 },
  { bg:'#e8ffe0', tile1:'#f4fff0', tile2:'#d0f8c0', tint:'#50a830', wall:'#b0e898', debris:0.45 },
  { bg:'#ffe8f0', tile1:'#fff4f8', tile2:'#ffd0e0', tint:'#e05080', wall:'#f0a8c0', debris:0.5 },
  { bg:'#d0f0ff', tile1:'#e8f8ff', tile2:'#b0e0f8', tint:'#2088d8', wall:'#90c8e8', debris:0.4 },
  { bg:'#fff0e0', tile1:'#fff8f0', tile2:'#ffe8c8', tint:'#e87820', wall:'#f0c8a0', debris:0.55 },
  { bg:'#f0d8ff', tile1:'#f8e8ff', tile2:'#e0c0f8', tint:'#a030d0', wall:'#d0a8e8', debris:0.45 },
];

// 39 unique map footprints (no cycling through 8 shapes).
const EXT_MAP_SHAPES = [
  { w: 2800, h: 2800 }, { w: 4600, h: 1400 }, { w: 1800, h: 4200 }, { w: 3600, h: 3600 },
  { w: 1200, h: 4800 }, { w: 3200, h: 2400 }, { w: 2400, h: 3200 }, { w: 4000, h: 4000 },
  { w: 5000, h: 1600 }, { w: 1600, h: 5000 }, { w: 3400, h: 2600 }, { w: 2600, h: 3400 },
  { w: 2200, h: 4400 }, { w: 4400, h: 2200 }, { w: 3000, h: 3000 }, { w: 3800, h: 2000 },
  { w: 2000, h: 3800 }, { w: 4200, h: 2800 }, { w: 2800, h: 4200 }, { w: 1500, h: 4500 },
  { w: 4500, h: 1500 }, { w: 3300, h: 3300 }, { w: 2700, h: 3900 }, { w: 3900, h: 2700 },
  { w: 2100, h: 4100 }, { w: 4100, h: 2100 }, { w: 3500, h: 2500 }, { w: 2500, h: 3500 },
  { w: 1700, h: 4700 }, { w: 4700, h: 1700 }, { w: 3100, h: 3100 }, { w: 2900, h: 3700 },
  { w: 3700, h: 2900 }, { w: 2300, h: 4300 }, { w: 4300, h: 2300 }, { w: 3600, h: 2800 },
  { w: 2800, h: 3600 }, { w: 1900, h: 4600 }, { w: 4600, h: 1900 },
];

const EXT_SHOOT_VARIANTS = [
  { type: 'aim', n: 2, cd: 2.5, spd: 165 },
  { type: 'ring', n: 5, cd: 2.8, spd: 120, move: true },
  { type: 'aim', n: 3, cd: 2.2, spd: 175 },
  { type: 'ring', n: 6, cd: 3.0, spd: 130, move: true },
  { type: 'aim', n: 2, cd: 2.0, spd: 190, arc: true },
  { type: 'ring', n: 4, cd: 2.4, spd: 145 },
  { type: 'aim', n: 4, cd: 2.6, spd: 160, move: true },
  { type: 'ring', n: 7, cd: 3.2, spd: 115 },
];

const EXT_BRAINROT_NAMES = [
  ['CAPPUCCINO ASSASSINO', 'TRULIMERO SELVATICO', 'BOBRITTO FURTIVO', 'BARABOOM'],
  ['GLORBO FRUTTODRILLO', 'BURBALONI LULILOLI', 'FRULA FRUTTINA', 'ESPRESSO SIGILLATO'],
  ['ZIBRA ZUBRA', 'GOLUBIRO SPIA', 'TRALALERITO PICCOLO', 'AMBALABU RANA'],
  ['DIN DIN DIN', 'BANANINI SCIMPANZINI', 'POLPO FRUTTOSO', 'MEDUSA VOLANTE'],
  ['PAPERO BOMBA', 'LIRILI LARILA', 'VESPA DELLO SWARM', 'PIPIKIWI FRUTTOSO'],
  ['COCOFANTO MINI', 'PATAPIM SPEZZATO', 'ANANASINI SELVATICO', 'TATASAHUR JR'],
  ['ORCALERO PICCOLO', 'GORILLO MELONE', 'HOTSPOT MINI', 'SATURNITA LUNA'],
];

const GROUND_PATTERNS = ['checker', 'stripe', 'diamond', 'dots', 'wave'];

function extTheme(i, band) {
  const p = EXT_WORLD_THEMES[i - 11] || EXT_WORLD_THEMES[0];
  const idx = i - 11;
  const music = band < 20 ? 'world_ext_low' : band < 30 ? 'world_ext_mid' : band < 40 ? 'world_ext_high' : 'world_ext_final';
  return {
    void: p.bg,
    tile1: p.tile1,
    tile2: p.tile2,
    tuft: p.tuft || 'rgba(80,120,60,0.18)',
    groundPattern: p.groundPattern || GROUND_PATTERNS[idx % GROUND_PATTERNS.length],
    accent: p.accent || p.tint,
    wall: p.wall,
    post: p.tile1,
    postDark: p.tile2,
    bg: p.bg,
    tint: p.tint,
    music,
    debris: p.debris,
    edgeDark: 0,
  };
}

function scaleStat(base, band, wi, key) {
  const scale = 1 + band * 0.09 + (wi - 11) * 0.02;
  if (key === 'hp') return Math.max(3, Math.round(base * scale));
  if (key === 'score') return Math.round(base * (1 + band * 0.05));
  if (key === 'xp') return Math.max(1, Math.round(base));   // flat across worlds — orb size stays W1-like
  return base;
}

function buildFoes(wi, band, worldName) {
  const prefix = worldName.split(' ')[0] || 'SWARM';
  const spr = id => 'ext_e' + wi + '_' + id;
  const tint = (EXT_WORLD_THEMES[wi - 11] || EXT_WORLD_THEMES[0]).tint;
  const names = EXT_BRAINROT_NAMES[wi % EXT_BRAINROT_NAMES.length];
  const shootVar = EXT_SHOOT_VARIANTS[wi % EXT_SHOOT_VARIANTS.length];
  const shootVar2 = EXT_SHOOT_VARIANTS[(wi + 3) % EXT_SHOOT_VARIANTS.length];
  const mk = (def) => {
    const o = Object.assign({}, def);
    o.hp = scaleStat(o.hp, band, wi, 'hp');
    o.score = scaleStat(o.score || 10, band, wi, 'score');
    o.xp = scaleStat(o.xp || 1, band, wi, 'xp');
    return o;
  };
  const shootOf = (v) => Object.assign({}, v, { col: tint });
  const templates = [
    mk({ spr: spr('b0'), name: names[0] + ' ' + prefix, hp: 10, sp: 68, r: 17, xp: 2, score: 18 }),
    mk({ spr: spr('b1'), name: names[1] + ' ' + prefix, hp: 7, sp: 76, r: 15, xp: 1, score: 14,
      range: 280 + (wi % 5) * 20, shoot: shootOf(shootVar) }),
    mk({ spr: spr('s0'), name: names[2] + ' ' + prefix, hp: 5, sp: 102, r: 13, xp: 1, score: 11, dash: true }),
    mk({ spr: spr('s1'), name: names[3] + ' ' + prefix, hp: 6, sp: 94, r: 14, xp: 1, score: 13,
      death: { type: (wi % 3 === 0) ? 'split' : 'ring', n: 3 + (wi % 3) } }),
  ];
  if (wi % 5 === 2) {
    templates[0].shell = true;
    templates[0].hp += 4;
  }
  if (wi % 7 === 4) {
    templates[2].range = 300;
    templates[2].shoot = shootOf(shootVar2);
  }
  if (wi % 9 === 6) {
    templates[3].aoe = { r: 40, dps: 8 + (wi % 4), life: 1.4, tele: 0.6, col: tint, cd: 3.0 };
  }
  return templates;
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
  const patterns = ['chaos', 'rings', 'spiral', 'chaos'];
  return [
    {
      spr: 'ext_mb' + wi,
      name: midName,
      hp: midHp,
      r: 54,
      pattern: patterns[wi % 4],
      phased: true,
      moveKey: 'extmid' + midArch,
    },
    {
      spr: 'ext_e' + wi + '_b0',
      name: short + ' GUARD',
      hp: guardHp,
      r: 50,
      pattern: patterns[(wi + 1) % 4],
      phased: true,
      moveKey: 'extmid' + ((midArch + 4) % 13),
    },
    {
      spr: 'ext_e' + wi + '_b1',
      name: short + ' LIEUTENANT',
      hp: eliteHp,
      r: 52,
      pattern: patterns[(wi + 2) % 4],
      phased: true,
      moveKey: 'extmid' + ((midArch + 8) % 13),
    },
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
    const map = Object.assign({}, EXT_MAP_SHAPES[wi - startIdx] || EXT_MAP_SHAPES[0]);
    const theme = extTheme(wi, band);
    const mapLayout = typeof WorldMapLayout !== 'undefined'
      ? WorldMapLayout.pickExtendedLayout(wi)
      : null;
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
      map,
      mapLayout,
      enemyTint: theme.tint,
      hpMul,
      dmgMul,
      introLine: 'THE SWARM GATHERS IN ' + name + '.',
      outroLine: name + ' CLEARED — THE SWARM RECOILS.',
      chalIntroLine: 'CHALLENGER: ' + name + ' — SURVIVE 15 MINUTES.',
      chalOutroLine: 'CHALLENGER ' + name + ' CONQUERED.',
      theme,
      foes,
      bosses,
    });
  }
  return out;
}

window.buildExtendedWorlds = buildExtendedWorlds;
