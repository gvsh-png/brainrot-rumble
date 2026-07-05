'use strict';
// Procedural worlds 12–50 (indices 11–49). Loaded before game.js — no game globals yet.

const EXT_WORLD_NAMES = [
  'NEON DUNES','RUST FACTORY','TOXIC MARSH','MOON CRATER','ABYSS TRENCH','SAND STORM',
  'HAUNTED MIDWAY','STEEL FOUNDRY','BIO LAB','QUANTUM RIFT','MAGMA CORE','FROZEN RUINS',
  'CANDY COLLAPSE','THUNDER PEAK','VOID GARDEN','CLOCKWORK CITY','PLASMA FIELDS','SHADOW CANYON',
  'SOLAR FLARE','MIRROR MAZE','GRAVITY WELL','SPORE JUNGLE','CRYO LAB','METEOR ALLEY',
  'ECHO CAVERNS','STATIC PLAINS','BONE DESERT','GLITCH ZONE','HIVE NEXUS','STORM RING',
  'OBSIDIAN SEA','PRISM TOWER','WARP TUNNEL','CORAL GRAVE','EMBER SPIRE','TOXIC RAIN',
  'STAR FORGE','DREAM FOG','CHAOS SPIRAL','FINAL SWARM',
];

const EXT_FOE_BASE = [
  { spr:'swarmmite', name:'Swarm Mite', hp:6, sp:88, r:15, xp:1, score:12 },
  { spr:'swarmwasp', name:'Swarm Wasp', hp:5, sp:96, r:14, xp:1, score:11, dash:true },
  { spr:'swarmbeetle', name:'Swarm Beetle', hp:8, sp:72, r:17, xp:2, score:16, death:{type:'ring',n:4} },
  { spr:'swarmmoth', name:'Swarm Moth', hp:5, sp:104, r:15, xp:1, score:12 },
  { spr:'golubiro', name:'Golubiro Raider', hp:7, sp:84, r:15, xp:1, score:12 },
  { spr:'bobrito', name:'Bobrito Skirmisher', hp:10, sp:64, r:17, xp:2, score:22, range:320, shoot:{type:'aim',n:2,cd:2.4,spd:170,col:'#caa12f'} },
  { spr:'trulimero', name:'Trulimero Striker', hp:11, sp:64, r:16, xp:2, score:20, range:260, shoot:{type:'ring',n:6,cd:3.0,spd:130,col:'#3fa6a0',move:true} },
  { spr:'glorbo', name:'Glorbo Spitter', hp:12, sp:50, r:19, xp:3, score:30, cast:{kind:'geyser',cd:3.0,range:390,n:5,col:'#5a9e3f'} },
  { spr:'rhino', name:'Rhino Bruiser', hp:26, sp:42, r:23, xp:4, score:46, range:340, shoot:{type:'aim',n:2,cd:2.8,spd:150,col:'#e8b96a'}, aoe:{r:44,dps:18,life:1.4,tele:0.7,col:'#e8a93a',cd:3.4} },
  { spr:'tiger', name:'Tiger Stalker', hp:22, sp:68, r:20, xp:4, score:46, dash:true, range:370, shoot:{type:'aim',n:5,cd:3.0,spd:170,col:'#e54d4d',move:true} },
];

const EXT_BOSS_POOL = [
  { spr:'tralalero', suffix:'TRALALA', hp:520, r:56, pattern:'spiral', phased:true },
  { spr:'crocodilo', suffix:'CROCODILO', hp:640, r:58, pattern:'rings', phased:true, moveKey:'croco2' },
  { spr:'tatasahur', suffix:'BAHUR', hp:580, r:54, pattern:'chaos', phased:true },
  { spr:'hotspot', suffix:'HOTSPOT', hp:700, r:60, pattern:'rings', phased:true },
  { spr:'saturnita', suffix:'SATURNITA', hp:760, r:58, pattern:'chaos', phased:true },
  { spr:'orcalero', suffix:'ORCALA', hp:820, r:58, pattern:'rings', phased:true, moveKey:'croco2' },
  { spr:'gorillo', suffix:'GORILLO', hp:900, r:62, pattern:'chaos', phased:true },
  { spr:'trippi', suffix:'TROPPI', hp:980, r:56, pattern:'spiral', phased:true },
  { spr:'bonecaambalabu', suffix:'STREGONICA', hp:740, r:54, pattern:'chaos', phased:true },
  { spr:'girafassassina', suffix:'ASSASSINA', hp:860, r:60, pattern:'rings', phased:true },
  { spr:'bobritto', suffix:'BANDOLERO', hp:920, r:58, pattern:'chaos', phased:true },
  { spr:'madudung', suffix:'DUNGDUNG', hp:1100, r:62, pattern:'chaos', bars:2, hp2:720, duo:'garamaraman' },
];

const EXT_MAP_SHAPES = [
  {w:2800,h:2800},{w:4600,h:1400},{w:1800,h:4200},{w:3600,h:3600},{w:1200,h:4800},
  {w:3200,h:2400},{w:2400,h:3200},{w:4000,h:4000},
];

function extHue(i){ return (i * 37) % 360; }
function extHex(h, s, l){
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h/30) % 12;
    const col = l/100 - a * Math.max(Math.min(k-3, 9-k, 1), -1);
    return Math.round(255 * col).toString(16).padStart(2,'0');
  };
  return '#'+f(0)+f(8)+f(4);
}

function extTheme(i, band){
  const h = extHue(i);
  const voidC = extHex(h, 55, 22);
  const tile1 = extHex(h, 60, 52);
  const tile2 = extHex(h, 58, 46);
  const bg = extHex(h, 50, 44);
  const tint = extHex((h+40)%360, 70, 58);
  const music = band < 15 ? 'world_ext_low' : band < 25 ? 'world_ext_mid' : band < 35 ? 'world_ext_high' : 'world_ext_final';
  return { void:voidC, tile1, tile2, tuft:'rgba(0,0,0,0.28)', wall:voidC, post:tile1, postDark:voidC,
    bg, tint, music, debris: band > 20 ? 0.75 : 0.5 };
}

function cloneFoe(def, band, wi){
  const o = JSON.parse(JSON.stringify(def));
  const scale = 1 + band * 0.09 + (wi - 11) * 0.02;
  o.hp = Math.max(3, Math.round(o.hp * scale));
  o.score = Math.round((o.score||10) * (1 + band * 0.05));
  o.xp = Math.max(1, Math.round((o.xp||1) * (1 + band * 0.04)));
  return o;
}

function buildFoes(wi, band){
  const list = [];
  for(let i=0;i<8;i++){
    const base = EXT_FOE_BASE[i % EXT_FOE_BASE.length];
    list.push(cloneFoe(base, band, wi));
  }
  return list;
}

function buildBosses(wi, band){
  const bosses = [];
  for(let slot=0;slot<4;slot++){
    const tpl = EXT_BOSS_POOL[(wi + slot * 3) % EXT_BOSS_POOL.length];
    const hpScale = 1 + band * 0.35 + (wi - 11) * 0.04;
    const name = 'SWARM ' + tpl.suffix + (slot===3 ? ' PRIME' : '');
    const b = {
      spr: tpl.spr,
      name,
      hp: Math.round(tpl.hp * hpScale),
      r: tpl.r,
      pattern: tpl.pattern || 'chaos',
      phased: true,
    };
    if(tpl.moveKey) b.moveKey = tpl.moveKey;
    if(tpl.bars) { b.bars = tpl.bars; b.hp2 = Math.round(tpl.hp2 * hpScale); }
    if(tpl.duo) b.duo = tpl.duo;
    if(slot===3) b.final = true;
    bosses.push(b);
  }
  return bosses;
}

function buildExtendedWorlds(startIdx, endIdx){
  const out = [];
  for(let wi = startIdx; wi <= endIdx; wi++){
    const band = wi;   // band tracks world index for scaling past W11
    const name = EXT_WORLD_NAMES[wi - startIdx] || ('SWARM SECTOR '+(wi+1));
    const map = EXT_MAP_SHAPES[wi % EXT_MAP_SHAPES.length];
    const theme = extTheme(wi, band);
    const foes = buildFoes(wi, band);
    const bosses = buildBosses(wi, band);
    const hpMul = 1 + Math.max(0, band - 9) * 0.12;
    const dmgMul = 1 + Math.max(0, band - 9) * 0.08;
    out.push({
      id: 'ext_'+wi,
      name,
      band,
      waveTarget: 20,
      endless: false,
      map: Object.assign({}, map),
      enemyTint: theme.tint,
      hpMul,
      dmgMul,
      introLine: 'THE SWARM GATHERS IN '+name+'.',
      outroLine: name+' CLEARED — THE SWARM RECOILS.',
      chalIntroLine: 'CHALLENGER: '+name+' — SURVIVE 15 MINUTES.',
      chalOutroLine: 'CHALLENGER '+name+' CONQUERED.',
      theme,
      foes,
      bosses,
    });
  }
  return out;
}

window.buildExtendedWorlds = buildExtendedWorlds;
