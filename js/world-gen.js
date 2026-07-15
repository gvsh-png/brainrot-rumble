'use strict';
// Procedural worlds 12–50 (indices 11–49). Each world: unique map, bright theme, 4 grunts + bosses.

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

const LAYOUT_LABELS = {
  open: 'Open arena',
  pillars: 'Pillar halls',
  corridor: 'Twin corridors',
  islands: 'Corner islands',
  cross: 'Cross junction',
  ring: 'Ring fortress',
  lanes: 'Twin lanes',
  clusters: 'Rock clusters',
};

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

function biomeHue(name) {
  const n = (name || '').toUpperCase();
  if (n.includes('NEON') || n.includes('PLASMA') || n.includes('GLITCH')) return 290;
  if (n.includes('RUST') || n.includes('STEEL') || n.includes('FORGE') || n.includes('EMBER')) return 22;
  if (n.includes('TOXIC') || n.includes('SPORE') || n.includes('BIO')) return 95;
  if (n.includes('MOON') || n.includes('CRYO') || n.includes('FROZEN') || n.includes('GELATO')) return 195;
  if (n.includes('SAND') || n.includes('DUNE') || n.includes('BONE')) return 38;
  if (n.includes('CANDY') || n.includes('DREAM') || n.includes('PRISM')) return 320;
  if (n.includes('THUNDER') || n.includes('STORM') || n.includes('STATIC')) return 248;
  if (n.includes('CORAL') || n.includes('ABYSS') || n.includes('SEA')) return 178;
  if (n.includes('CLOCK') || n.includes('MIRROR') || n.includes('WARP')) return 42;
  if (n.includes('HIVE') || n.includes('FINAL') || n.includes('CHAOS')) return 350;
  if (n.includes('HAUNTED') || n.includes('SHADOW') || n.includes('VOID')) return 265;
  if (n.includes('MAGMA') || n.includes('VOLCANO')) return 12;
  if (n.includes('SKY') || n.includes('SOLAR') || n.includes('METEOR')) return 205;
  return 120;
}

function extMapFor(wi) {
  const i = wi - 11;
  const bases = [2400, 2600, 2800, 3000, 3200, 3400, 3600, 3800, 4000, 4200, 4400, 4600];
  const aspects = [1.0, 1.75, 0.58, 1.35, 0.72, 1.95, 0.52, 1.15, 1.45, 0.82, 1.62, 0.65];
  const bw = bases[(i * 3 + 7) % bases.length];
  const asp = aspects[(i * 5 + 2) % aspects.length];
  let w = Math.round(bw * Math.sqrt(asp));
  let h = Math.round(bw / Math.sqrt(asp));
  w = Math.max(1400, Math.min(4800, w));
  h = Math.max(1400, Math.min(5200, h));
  return { w, h };
}

function layoutForWorld(wi, name) {
  const layouts = ['open', 'pillars', 'corridor', 'islands', 'cross', 'ring', 'lanes', 'clusters'];
  let h = wi * 7919;
  for (let c = 0; c < name.length; c++) h = (h + name.charCodeAt(c) * (c + 3)) | 0;
  return layouts[Math.abs(h) % layouts.length];
}

function mapShapeLabel(map) {
  const mw = map.w, mh = map.h;
  if (mw > mh * 1.35) return 'Wide stretch';
  if (mh > mw * 1.35) return 'Vertical shaft';
  if (mw >= 4000 && mh >= 3600) return 'Vast expanse';
  if (mw <= 1800 || mh <= 1800) return 'Tight zone';
  return 'Balanced field';
}

function worldMenuBlurb(map, layout, name) {
  const layoutLabel = LAYOUT_LABELS[layout] || layout;
  const shape = mapShapeLabel(map);
  const short = (name || '').split(' ')[0];
  return layoutLabel + ' · ' + shape + ' · ' + short + ' swarm';
}

function extTheme(wi, band, name) {
  const h = (biomeHue(name) + wi * 11) % 360;
  const h2 = (h + 55) % 360;
  const h3 = (h + 130) % 360;
  const music = band < 15 ? 'world_ext_low' : band < 25 ? 'world_ext_mid' : band < 35 ? 'world_ext_high' : 'world_ext_final';
  const tile1 = extHex(h, 62, 90);
  const tile2 = extHex(h, 58, 84);
  return {
    void: extHex(h, 48, 82),
    tile1,
    tile2,
    tuft: extHex(h2, 55, 72) + '55',
    wall: extHex(h2, 58, 76),
    post: extHex(h2, 62, 80),
    postDark: extHex(h2, 55, 72),
    bg: extHex(h, 52, 92),
    tint: extHex(h3, 78, 58),
    accent: extHex(h2, 70, 74),
    sky: extHex(h, 45, 94),
    music,
    debris: band > 20 ? 0.5 : 0.35,
    edgeDark: 0,
  };
}

function scaleStat(base, band, wi, key) {
  const scale = 1 + band * 0.09 + (wi - 11) * 0.02;
  if (key === 'hp') return Math.max(3, Math.round(base * scale));
  if (key === 'score') return Math.round(base * (1 + band * 0.05));
  if (key === 'xp') return Math.max(1, Math.round(base * (1 + band * 0.04)));
  return base;
}

function buildFoes(wi, band, worldName, theme) {
  const prefix = worldName.split(' ')[0] || 'SWARM';
  const spr = id => 'ext_e' + wi + '_' + id;
  const bulletCol = theme ? theme.tint : extHex(extHue(wi), 70, 58);
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
      range: 300, shoot: { type: 'aim', n: 2, cd: 2.5, spd: 165, col: bulletCol } }),
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
    {
      spr: 'ext_mb' + wi,
      name: midName,
      hp: midHp,
      r: 54,
      pattern: 'chaos',
      phased: true,
      moveKey: 'extmid' + midArch,
    },
    {
      spr: 'ext_e' + wi + '_b0',
      name: short + ' GUARD',
      hp: guardHp,
      r: 50,
      pattern: 'rings',
      phased: true,
      moveKey: 'extmid' + ((midArch + 4) % 13),
    },
    {
      spr: 'ext_e' + wi + '_b1',
      name: short + ' LIEUTENANT',
      hp: eliteHp,
      r: 52,
      pattern: 'spiral',
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
    const map = extMapFor(wi);
    const theme = extTheme(wi, band, name);
    const mapLayout = layoutForWorld(wi, name);
    const foes = buildFoes(wi, band, name, theme);
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
      menuBlurb: worldMenuBlurb(map, mapLayout, name),
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
window.worldMenuBlurbFor = worldMenuBlurb;
window.LAYOUT_LABELS = LAYOUT_LABELS;
window.layoutForWorld = layoutForWorld;
