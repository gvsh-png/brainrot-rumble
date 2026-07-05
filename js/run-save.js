'use strict';
// Suspend / resume an in-progress run (localStorage). Cleared on game over or starting fresh.

const RUN_SAVE_KEY = 'br_run_save';
const RUN_SAVE_VER = 1;

function canSuspendRun(){
  if(typeof state === 'undefined' || typeof ST === 'undefined') return false;
  return state === ST.PLAY || state === ST.PAUSE || state === ST.LEVELUP;
}

function _runStateLabel(){
  if(state === ST.PAUSE) return 'pause';
  if(state === ST.LEVELUP) return 'levelup';
  return 'play';
}

function _serRefs(arr, mapper){
  const refs = new Map();
  arr.forEach((o, i) => refs.set(o, i));
  return arr.map((o, i) => mapper(o, i, refs));
}

function _serEnemies(list){
  return _serRefs(list, (e, _i, refs) => {
    const o = Object.assign({}, e);
    delete o.mate;
    delete o.lead;
    if(e.mate) o._mateIdx = refs.get(e.mate);
    if(e.lead) o._leadIdx = refs.get(e.lead);
    return o;
  });
}

function _deserEnemies(raw){
  const enemies = raw.map(e => Object.assign({}, e));
  enemies.forEach((e, i) => {
    const r = raw[i];
    delete e._mateIdx;
    delete e._leadIdx;
    if(r._mateIdx != null) e.mate = enemies[r._mateIdx];
    if(r._leadIdx != null) e.lead = enemies[r._leadIdx];
  });
  return enemies;
}

function _readRunData(){
  try{
    const raw = localStorage.getItem(RUN_SAVE_KEY);
    if(!raw) return null;
    const d = JSON.parse(raw);
    if(!d || d.v !== RUN_SAVE_VER) return null;
    return d;
  }catch(e){ return null; }
}

function hasSuspendedRun(){ return !!_readRunData(); }

function getSuspendedRunMeta(){
  const d = _readRunData();
  if(!d) return null;
  const wName = d.gameMode === 'practice'
    ? 'Practice'
    : ((typeof WORLDS !== 'undefined' && WORLDS[d.worldIdx]) ? WORLDS[d.worldIdx].name : ('World ' + (d.worldIdx + 1)));
  const mode = d.gameMode === 'challenger' ? 'Challenger' : (d.gameMode === 'practice' ? 'Practice' : 'Story');
  const progress = (d.gameMode === 'challenger' || (d.gameMode === 'practice' && d.practiceCfg && d.practiceCfg.timerBased))
    ? (typeof fmtTime === 'function' ? fmtTime(d.chalElapsed || 0) : (d.chalElapsed + 's'))
    : ('Wave ' + (d.wave || 1));
  return {
    world: wName,
    mode,
    progress,
    kills: d.kills || 0,
    lv: (d.P && d.P.lv) || 1,
    coins: d.worldCoins || 0,
  };
}

function clearSuspendedRun(){
  try{ localStorage.removeItem(RUN_SAVE_KEY); }catch(e){}
  if(typeof refreshRunResumeUI === 'function') refreshRunResumeUI();
}

function saveSuspendedRun(){
  if(!canSuspendRun()) return false;
  const bossIdx = boss ? enemies.indexOf(boss) : -1;
  const serEnemies = _serEnemies(enemies);
  const pc = practiceCfg || {};
  const data = {
    v: RUN_SAVE_VER,
    t: Date.now(),
    worldIdx,
    gameMode,
    practiceCfg: {
      infiniteWaves: !!pc.infiniteWaves,
      timerBased: !!pc.timerBased,
      infiniteMap: !!pc.infiniteMap,
      bossIntervalSec: pc.bossIntervalSec || 300,
      foes: pc.foes ? pc.foes.slice() : null,
      bosses: pc.bosses ? pc.bosses.slice() : null,
    },
    P: Object.assign({}, P, { up: Object.assign({}, P.up || {}) }),
    wave, kills, elapsed, worldCoins,
    betweenWaves, waveGapT, spawnTimer, waveEnemiesLeft,
    chaosSchedule: chaosSchedule.slice(),
    chaosWaveIdx, chaosMidTimer,
    chaosSpeedT, chaosBlackoutT, chaosGiantN, chaosGravT,
    chaosShrinkT, chaosDisarmT, chaosBerserkT, chaosBombRainT, chaosBombRainCd, chaosLeechT,
    chalElapsed, chalBossIdx, chalBossActive, chalLuckyT,
    arena: arena ? Object.assign({}, arena) : null,
    bossPending,
    luckyTimer, bossLuckyT,
    timeScale,
    runState: _runStateLabel(),
    enemies: serEnemies,
    bossIdx,
    gems: gems.map(g => Object.assign({}, g)),
    luckies: luckies.map(l => Object.assign({}, l)),
    zones: zones.map(z => Object.assign({}, z)),
    holes: holes.map(h => Object.assign({}, h)),
    turrets: turrets.map(t => Object.assign({}, t)),
    miniTurrets: miniTurrets.map(t => Object.assign({}, t)),
    flameTurrets: flameTurrets.map(t => Object.assign({}, t)),
    placedTurrets: placedTurrets.map(t => Object.assign({}, t)),
    skibidiBullets: skibidiBullets.map(b => Object.assign({}, b)),
    skibidiTimers: skibidiTimers.map(t => Object.assign({}, t)),
  };
  try{
    localStorage.setItem(RUN_SAVE_KEY, JSON.stringify(data));
    if(typeof refreshRunResumeUI === 'function') refreshRunResumeUI();
    return true;
  }catch(e){ return false; }
}

function _applyPracticeCfg(pc){
  if(!pc) return;
  practiceCfg.infiniteWaves = !!pc.infiniteWaves;
  practiceCfg.timerBased = !!pc.timerBased;
  practiceCfg.infiniteMap = !!pc.infiniteMap;
  practiceCfg.bossIntervalSec = pc.bossIntervalSec || 300;
  if(pc.foes) practiceCfg.foes = pc.foes.slice();
  if(pc.bosses) practiceCfg.bosses = pc.bosses.slice();
  practiceCfg._foeSet = new Set(practiceCfg.foes || []);
  practiceCfg._bossSet = new Set(practiceCfg.bosses || []);
  TRAINING_WORLD.foes = practiceCfg.foes || TRAINING_WORLD.foes;
  TRAINING_WORLD.bosses = practiceCfg.bosses || TRAINING_WORLD.bosses;
  TRAINING_WORLD.endless = practiceCfg.infiniteWaves;
}

function continueSuspendedRun(){
  const d = _readRunData();
  if(!d) return false;

  loadWorld(d.worldIdx);
  gameMode = d.gameMode;
  if(d.gameMode === 'practice') _applyPracticeCfg(d.practiceCfg);
  if(infiniteMapMode()){ WORLD.w = 999999; WORLD.h = 999999; }

  Object.assign(P, d.P);
  if(d.P && d.P.up) P.up = Object.assign({}, d.P.up);

  wave = d.wave; kills = d.kills; elapsed = d.elapsed; worldCoins = d.worldCoins;
  betweenWaves = d.betweenWaves; waveGapT = d.waveGapT; spawnTimer = d.spawnTimer; waveEnemiesLeft = d.waveEnemiesLeft;
  chaosSchedule = (d.chaosSchedule || []).slice();
  chaosWaveIdx = d.chaosWaveIdx; chaosMidTimer = d.chaosMidTimer;
  chaosSpeedT = d.chaosSpeedT; chaosBlackoutT = d.chaosBlackoutT; chaosGiantN = d.chaosGiantN; chaosGravT = d.chaosGravT;
  chaosShrinkT = d.chaosShrinkT; chaosDisarmT = d.chaosDisarmT; chaosBerserkT = d.chaosBerserkT;
  chaosBombRainT = d.chaosBombRainT; chaosBombRainCd = d.chaosBombRainCd; chaosLeechT = d.chaosLeechT;
  chalElapsed = d.chalElapsed; chalBossIdx = d.chalBossIdx; chalBossActive = d.chalBossActive; chalLuckyT = d.chalLuckyT;
  arena = d.arena ? Object.assign({}, d.arena) : null;
  bossPending = d.bossPending;
  luckyTimer = d.luckyTimer; bossLuckyT = d.bossLuckyT;
  timeScale = d.timeScale || 1;

  enemies = _deserEnemies(d.enemies || []);
  boss = (d.bossIdx != null && d.bossIdx >= 0) ? enemies[d.bossIdx] : null;
  bullets = [];
  ebullets = [];
  petBullets = [];
  gems = (d.gems || []).map(g => Object.assign({}, g));
  luckies = (d.luckies || []).map(l => Object.assign({}, l));
  texts = [];
  zones = (d.zones || []).map(z => Object.assign({}, z));
  holes = (d.holes || []).map(h => Object.assign({}, h));
  turrets = (d.turrets || []).map(t => Object.assign({}, t));
  miniTurrets = (d.miniTurrets || []).map(t => Object.assign({}, t));
  flameTurrets = (d.flameTurrets || []).map(t => Object.assign({}, t));
  placedTurrets = (d.placedTurrets || []).map(t => Object.assign({}, t));
  skibidiBullets = (d.skibidiBullets || []).map(b => Object.assign({}, b));
  skibidiTimers = (d.skibidiTimers || []).map(t => Object.assign({}, t));
  clearParts();

  if(typeof clearHooks === 'function') clearHooks();
  if(typeof registerActiveChar === 'function') registerActiveChar();
  if(typeof registerActivePet === 'function') registerActivePet();

  initAudio();
  shake = 0; hitstop = 0; hitFlash = 0;

  $('gameover').classList.add('hidden');
  $('levelup').classList.add('hidden');
  $('pause').classList.add('hidden');
  $('menu').classList.add('hidden');
  $('hud').classList.remove('hidden');
  $('zoomctl').classList.remove('hidden');
  $('dashbtn').textContent = P.engineerPlace ? 'Place turret.' : 'DASH';
  if(typeof IS_TOUCH !== 'undefined' && IS_TOUCH) $('dashbtn').classList.remove('hidden');
  else $('dashbtn').classList.add('hidden');

  const ci = $('coincount');
  if(ci){ const img = ci.querySelector('img'); if(img && !img.getAttribute('src') && typeof SP !== 'undefined') img.src = SP['coin'].toDataURL(); }

  refreshHUD();
  if(boss){
    $('bossname').textContent = boss.name;
    $('bossbar').classList.remove('hidden');
    $('bossfill2').classList.toggle('hidden', boss.bars !== 2);
  } else {
    $('bossbar').classList.add('hidden');
  }

  if(boss) playMusic(boss.finalPhase ? ('final_' + boss.spr) : ('boss' + (((Math.floor(wave / 5) - 1) % 3 + 3) % 3)));
  else playMusic(curTheme.music);

  computeCamera();

  if(d.runState === 'pause'){
    state = ST.PAUSE;
    $('pause').classList.remove('hidden');
  } else if(d.runState === 'levelup'){
    openLevelUp();
  } else {
    state = ST.PLAY;
  }

  selWorld = worldIdx;
  resetZoom();
  if(typeof refreshRunResumeUI === 'function') refreshRunResumeUI();
  return true;
}

let _runSaveAccum = 0;
function tickRunAutosave(dt){
  if(!canSuspendRun()){ _runSaveAccum = 0; return; }
  _runSaveAccum += dt;
  if(_runSaveAccum >= 5){ _runSaveAccum = 0; saveSuspendedRun(); }
}

function _persistRunOnExit(){
  if(canSuspendRun()) saveSuspendedRun();
}

window.addEventListener('pagehide', _persistRunOnExit);
document.addEventListener('visibilitychange', ()=>{
  if(document.hidden) _persistRunOnExit();
});

(function initRunResume(){
  if(typeof refreshRunResumeUI === 'function') refreshRunResumeUI();
})();
