'use strict';
// Retention loops: daily bounties, achievements, run debrief. Juice via particles/haptics — no text popups.

const RANK_TITLES = ['Hatchling','Swarmling','Hunter','Stinger','Reaper','Apex','Overlord','Legend'];

const BOUNTY_POOL = [
  { id: 'k150',  label: 'Slay 150 foes today',      track: 'kills',   target: 150, reward: { gold: 220 } },
  { id: 'k350',  label: 'Slay 350 foes today',      track: 'kills',   target: 350, reward: { gems: 2 } },
  { id: 'surv5', label: 'Survive 5 min in one run', track: 'survive', target: 300, reward: { gold: 300 } },
  { id: 'w8',    label: 'Reach wave 8 in a run',    track: 'wave',    target: 8,   reward: { gold: 260 } },
  { id: 'w12',   label: 'Reach wave 12 in a run',   track: 'wave',    target: 12,  reward: { gems: 2 } },
  { id: 'boss1', label: 'Defeat a boss today',      track: 'bosses',  target: 1,   reward: { gold: 200 } },
  { id: 'boss3', label: 'Defeat 3 bosses today',    track: 'bosses',  target: 3,   reward: { gems: 3 } },
  { id: 'k75',   label: 'Slay 75 foes today',       track: 'kills',   target: 75,  reward: { gold: 240 } },
  { id: 'coins600', label: 'Earn 600 coins today',  track: 'coins',   target: 600, reward: { gems: 2 } },
  { id: 'evo2',  label: 'Evolve 2 skills today',    track: 'evolves', target: 2,   reward: { gold: 280 } },
  { id: 'rush3', label: 'Defeat 3 Boss Rush bosses today', track: 'rushbosses', target: 3, reward: { gems: 2 } },
  { id: 'rush8', label: 'Defeat 8 Boss Rush bosses today', track: 'rushbosses', target: 8, reward: { gems: 4 } },
];

const ACHIEVEMENTS = [
  { id: 'first_run',   name: 'First Blood',      desc: 'Finish your first run.', check: s => s.runs >= 1 },
  { id: 'wave10',      name: 'Wave Rider',       desc: 'Reach wave 10.', check: s => s.bestWave >= 10 },
  { id: 'wave18',      name: 'Deep Diver',       desc: 'Reach wave 18.', check: s => s.bestWave >= 18 },
  { id: 'boss5',       name: 'Boss Bully',       desc: 'Defeat 5 bosses total.', check: s => s.totalBosses >= 5 },
  { id: 'jackpot5',    name: 'High Roller',      desc: 'Land 5 jackpots in one run.', check: s => s.runJackpots >= 5 },
  { id: 'rank3',       name: 'Rising Threat',    desc: 'Reach Swarm Rank 3.', check: s => s.swarmRank >= 3 },
  { id: 'rank6',       name: 'Apex Predator',    desc: 'Reach Swarm Rank 6.', check: s => s.swarmRank >= 6 },
  { id: 'synergy1',    name: 'Synergy Spark',    desc: 'Unlock a synergy skill.', check: s => s.totalSynergies >= 1 },
  { id: 'daily3',      name: 'Bounty Hunter',    desc: 'Complete 3 daily bounties.', check: s => s.bountiesDone >= 3 },
  { id: 'surv10',      name: 'Iron Will',        desc: 'Survive 10 minutes in one run.', check: s => s.bestSurvive >= 600 },
  { id: 'rush5',       name: 'Rush Runner',      desc: 'Defeat 5 bosses in one Boss Rush run.', check: s => s.rushRunBosses >= 5 },
  { id: 'rush15',      name: 'Rush Lord',        desc: 'Defeat 15 bosses in one Boss Rush run.', check: s => s.rushRunBosses >= 15 },
  { id: 'rush25',      name: 'Unstoppable',      desc: 'Defeat 25 bosses in one Boss Rush run.', check: s => s.rushRunBosses >= 25 },
  { id: 'rushbest10',  name: 'Rush Record',      desc: 'Set a Boss Rush personal best of 10+ bosses.', check: s => s.rushBest >= 10 },
];

let runEng = { jackpots: 0, evolves: 0, bosses: 0, synergies: 0 };
let runMilestones = new Set();
let swarmRank = 1, swarmXp = 0;
let engageStats = { runs: 0, bestWave: 0, bestSurvive: 0, totalBosses: 0, totalSynergies: 0, bountiesDone: 0 };
let unlockedAch = new Set();
let _killJuiceN = 0;

function getRushBest(){ return Math.max(0, +(localStorage.getItem('br_rush_best') || 0)); }
function setRushBest(n){
  const next = Math.max(0, Math.floor(n || 0));
  const prev = getRushBest();
  if(next <= prev) return false;
  try{ localStorage.setItem('br_rush_best', String(next)); }catch(e){}
  return true;
}
function swarmRankTitle(lv){ return RANK_TITLES[Math.max(0, Math.min(RANK_TITLES.length - 1, (lv || 1) - 1))]; }

function _dailyKey(){
  const d = new Date();
  return 'br_daily_' + d.getUTCFullYear() + String(d.getUTCMonth() + 1).padStart(2, '0') + String(d.getUTCDate()).padStart(2, '0');
}
function _hashStr(s){
  let h = 2166136261;
  for(let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function _mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function loadEngagement(){
  try{
    const r = JSON.parse(localStorage.getItem('br_swarm_rank') || '{}');
    swarmRank = Math.max(1, +(r.rank || 1));
    swarmXp = Math.max(0, +(r.xp || 0));
    const s = JSON.parse(localStorage.getItem('br_engage_stats') || '{}');
    engageStats = Object.assign(engageStats, s);
    unlockedAch = new Set(JSON.parse(localStorage.getItem('br_achievements') || '[]'));
  }catch(e){}
}
function saveSwarmRank(){
  try{ localStorage.setItem('br_swarm_rank', JSON.stringify({ rank: swarmRank, xp: swarmXp })); }catch(e){}
  if(window.markDirty) window.markDirty();
  if(typeof refreshTopbar === 'function') refreshTopbar();
}
function saveEngageStats(){
  try{ localStorage.setItem('br_engage_stats', JSON.stringify(engageStats)); }catch(e){}
  if(window.markDirty) window.markDirty();
}
function saveAchievements(){
  try{ localStorage.setItem('br_achievements', JSON.stringify([...unlockedAch])); }catch(e){}
  if(window.markDirty) window.markDirty();
}

function swarmXpNext(lv){ return Math.floor(70 + lv * 40 + lv * lv * 6); }

function _engageJuice(col, power){
  power = power || 1;
  const inPlay = typeof state !== 'undefined' && state === ST.PLAY && typeof P !== 'undefined';
  if(inPlay){
    const x = P.x, y = P.y;
    if(typeof burst === 'function') burst(x, y, col || '#ffe08a', 6 + power * 8, 240 + power * 100);
    if(typeof spawnPart === 'function') spawnPart(x, y, 0, 0, 0.32, 0.32, col || '#ffe08a', 16 + power * 14, 1, 360);
    if(typeof shake !== 'undefined') shake = Math.max(shake, 2 + power * 2.5);
    if(typeof hitFlash !== 'undefined') hitFlash = Math.max(hitFlash, 0.04 + power * 0.02);
  }
  if(typeof haptic === 'function') haptic(power >= 3 ? 'win' : power >= 2 ? 'level' : 'light');
}

function uiPulse(el, cls){
  if(!el) return;
  cls = cls || 'juice-pulse';
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

function _menuResourcePulse(){
  uiPulse(document.querySelector('.respill'));
}

function showAchToast(title, desc){
  let el = typeof $ === 'function' ? $('ach-toast') : document.getElementById('ach-toast');
  if(!el && typeof document !== 'undefined'){
    el = document.createElement('div');
    el.id = 'ach-toast';
    document.body.appendChild(el);
  }
  if(!el) return;
  el.innerHTML = '<div class="ach-toast-title">' + title + '</div><div class="ach-toast-desc">' + desc + '</div>';
  el.classList.remove('hidden', 'ach-pop');
  void el.offsetWidth;
  el.classList.add('ach-pop');
  clearTimeout(el._achT);
  el._achT = setTimeout(()=>{ el.classList.add('hidden'); }, 3200);
}

function grantSwarmXp(n){
  if(!n || gameMode === 'practice') return 0;
  swarmXp += n;
  let gained = n;
  while(swarmXp >= swarmXpNext(swarmRank)){
    swarmXp -= swarmXpNext(swarmRank);
    swarmRank++;
    _engageJuice('#b06ff0', 3);
    if(typeof sfx !== 'undefined' && sfx.level) sfx.level();
  }
  saveSwarmRank();
  return gained;
}

function resetRunEngagement(){
  runEng = { jackpots: 0, evolves: 0, bosses: 0, synergies: 0 };
  runMilestones = new Set();
  _killJuiceN = 0;
}

function engageOnKill(){
  if(gameMode === 'practice') return;
  tickDailyProgress('kills', 1, false);
  checkRunMilestones();
  _killJuiceN++;
  if(_killJuiceN % 20 === 0) _engageJuice('#9fe0ff', 1);
}

function engageOnJackpot(){
  runEng.jackpots++;
  _engageJuice('#f5c542', 2);
  if(typeof sfx !== 'undefined' && sfx.coin) sfx.coin();
}

function engageOnBossKill(){
  if(gameMode === 'practice') return;
  runEng.bosses++;
  engageStats.totalBosses++;
  tickDailyProgress('bosses', 1, false);
  if(typeof rushIsActive === 'function' && rushIsActive()) tickDailyProgress('rushbosses', 1, false);
  _engageJuice('#4aa3df', 2);
}

function engageOnEvolve(){
  if(gameMode === 'practice') return;
  runEng.evolves++;
  tickDailyProgress('evolves', 1, false);
  _engageJuice('#c8a0ff', 2);
}

function engageSynergyUnlock(name){
  if(gameMode === 'practice') return;
  runEng.synergies++;
  engageStats.totalSynergies++;
  _engageJuice('#c8a0ff', 3);
  if(typeof sfx !== 'undefined' && sfx.evolve) sfx.evolve();
}

function checkRunMilestones(){
  if(typeof kills === 'undefined' || typeof elapsed === 'undefined') return;
  const marks = [
    { k: 'k50',  test: () => kills >= 50,  col: '#9fe0ff', power: 2 },
    { k: 'k100', test: () => kills >= 100, col: '#ffe08a', power: 2 },
    { k: 'k250', test: () => kills >= 250, col: '#ff9f3a', power: 3 },
    { k: 't3',   test: () => elapsed >= 180, col: '#4ad0c0', power: 2 },
    { k: 't5',   test: () => elapsed >= 300, col: '#4aa3df', power: 2 },
    { k: 't8',   test: () => elapsed >= 480, col: '#b06ff0', power: 3 },
  ];
  for(const m of marks){
    if(runMilestones.has(m.k) || !m.test()) continue;
    runMilestones.add(m.k);
    _engageJuice(m.col, m.power);
    if(typeof sfx !== 'undefined' && sfx.level) sfx.level();
  }
}

function tickDailyProgress(track, amount, absolute){
  if(gameMode === 'practice') return;
  const day = getDailyState();
  let dirty = false;
  for(const id of day.ids){
    const def = BOUNTY_POOL.find(b => b.id === id);
    if(!def || def.track !== track || day.claimed.includes(id)) continue;
    const before = day.progress[id] || 0;
    if(absolute) day.progress[id] = Math.max(before, amount);
    else day.progress[id] = before + amount;
    if(day.progress[id] !== before) dirty = true;
    tryClaimBounty(day, id, def);
  }
  if(dirty) saveDailyState(day);
  refreshDailyBountiesUI();
}

function getDailyState(){
  const key = _dailyKey();
  try{
    const raw = JSON.parse(localStorage.getItem(key) || 'null');
    if(raw && raw.ids) return raw;
  }catch(e){}
  const rng = _mulberry32(_hashStr(key));
  const pool = BOUNTY_POOL.slice();
  const ids = [];
  while(ids.length < 3 && pool.length){
    const i = Math.floor(rng() * pool.length);
    ids.push(pool.splice(i, 1)[0].id);
  }
  return { ids, progress: {}, claimed: [] };
}
function saveDailyState(day){ try{ localStorage.setItem(_dailyKey(), JSON.stringify(day)); }catch(e){} }

function tryClaimBounty(day, id, def){
  if(day.claimed.includes(id)) return;
  if((day.progress[id] || 0) < def.target) return;
  day.claimed.push(id);
  engageStats.bountiesDone++;
  if(def.reward.gold && typeof gold !== 'undefined'){
    gold += def.reward.gold;
    if(typeof saveGold === 'function') saveGold();
    if(typeof refreshTopbar === 'function') refreshTopbar();
  }
  if(def.reward.gems && typeof addGems === 'function') addGems(def.reward.gems);
  _engageJuice('#f5c542', 2);
  _menuResourcePulse();
  if(typeof sfx !== 'undefined' && sfx.win) sfx.win();
}

function refreshDailyBountiesUI(){
  const wrap = $('daily-bounties'), list = $('daily-bounty-list');
  if(!wrap || !list) return;
  const day = getDailyState();
  if(!day.ids.length){ wrap.classList.add('hidden'); return; }
  wrap.classList.remove('hidden');
  let claimable = 0;
  list.innerHTML = day.ids.map(id => {
    const def = BOUNTY_POOL.find(b => b.id === id);
    if(!def) return '';
    const prog = day.progress[id] || 0;
    const done = day.claimed.includes(id);
    const pct = Math.min(100, Math.round(prog / def.target * 100));
    const rew = def.reward.gems ? ('+' + def.reward.gems + ' ◆') : ('+' + def.reward.gold + ' gold');
    if(!done && prog >= def.target) claimable++;
    return '<div class="db-row' + (done ? ' done' : '') + '">' +
      '<div class="db-label">' + def.label + ' <span class="db-prog">' + Math.min(prog, def.target) + '/' + def.target + '</span></div>' +
      '<div class="db-bar"><div class="db-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="db-reward">' + rew + '</div>' +
      '</div>';
  }).join('');
  const badge = $('bountybadge');
  if(badge){
    const open = day.ids.some(id => {
      const def = BOUNTY_POOL.find(b => b.id === id);
      return def && !day.claimed.includes(id) && (day.progress[id] || 0) < def.target;
    });
    badge.classList.toggle('hidden', !open);
    badge.textContent = claimable > 0 ? '!' : '•';
  }
}

function checkAchievements(ctx){
  ctx = Object.assign({
    runs: engageStats.runs,
    bestWave: engageStats.bestWave,
    bestSurvive: engageStats.bestSurvive,
    totalBosses: engageStats.totalBosses,
    totalSynergies: engageStats.totalSynergies,
    bountiesDone: engageStats.bountiesDone,
    swarmRank,
    rushBest: getRushBest(),
    rushRunBosses: 0,
    runJackpots: runEng.jackpots,
  }, ctx || {});
  for(const a of ACHIEVEMENTS){
    if(unlockedAch.has(a.id)) continue;
    if(!a.check(ctx)) continue;
    unlockedAch.add(a.id);
    saveAchievements();
    showAchToast(a.name, a.desc);
    _engageJuice('#f5c542', 2);
    if(typeof sfx !== 'undefined' && sfx.win) sfx.win();
  }
}

function engageTick(dt){
  if(gameMode === 'practice' || typeof state === 'undefined' || state !== ST.PLAY) return;
  const surv = timerMode() ? (typeof chalElapsed !== 'undefined' ? chalElapsed : elapsed) : elapsed;
  engageStats.bestSurvive = Math.max(engageStats.bestSurvive, surv);
  if(surv >= 300) tickDailyProgress('survive', surv, true);
  if(typeof wave !== 'undefined' && !(typeof rushIsActive === 'function' && rushIsActive())) tickDailyProgress('wave', wave, true);
}

function _buildDebriefLines(modeKey, prev, cur, flags){
  const lines = [];
  if(flags.kills) lines.push('New kill record — ' + cur.kills);
  if(flags.wave) lines.push('New depth record — ' + cur.wave);
  if(flags.survive) lines.push('New survive record — ' + (typeof fmtTime === 'function' ? fmtTime(cur.survive) : cur.survive + 's'));
  if(flags.bosses) lines.push('New Boss Rush best — ' + cur.bosses + ' bosses');
  return lines;
}

function finishRunEngagement(reason){
  if(gameMode === 'practice') return { xp: 0, lines: [], stats: [] };
  engageStats.runs++;
  const surv = timerMode() ? chalElapsed : elapsed;
  engageStats.bestSurvive = Math.max(engageStats.bestSurvive, surv);
  engageStats.bestWave = Math.max(engageStats.bestWave, wave);

  tickDailyProgress('coins', worldCoins, false);

  const bests = JSON.parse(localStorage.getItem('br_run_bests') || '{}');
  const rushRun = typeof rushIsActive === 'function' && rushIsActive();
  const modeKey = rushRun ? 'bossrush' : (gameMode + '_w' + worldIdx);
  const prev = bests[modeKey] || { kills: 0, wave: 0, survive: 0, bosses: 0 };
  const cur = {
    kills,
    wave: rushRun ? (typeof rushBossesBeaten !== 'undefined' ? rushBossesBeaten : 0)
      : (timerMode() ? Math.floor(surv / 60) : wave),
    survive: surv,
    bosses: rushRun ? (typeof rushBossesBeaten !== 'undefined' ? rushBossesBeaten : 0) : (prev.bosses || 0),
  };
  const flags = { kills: false, wave: false, survive: false, bosses: false };
  if(kills > (prev.kills || 0)){ prev.kills = kills; flags.kills = true; }
  if(cur.wave > (prev.wave || 0)){ prev.wave = cur.wave; flags.wave = true; }
  if(surv > (prev.survive || 0)){ prev.survive = surv; flags.survive = true; }
  if(rushRun && cur.bosses > (prev.bosses || 0)){
    prev.bosses = cur.bosses;
    flags.bosses = true;
    setRushBest(cur.bosses);
  }
  bests[modeKey] = prev;
  try{ localStorage.setItem('br_run_bests', JSON.stringify(bests)); }catch(e){}

  const xpBase = rushRun
    ? (cur.bosses * 14 + surv * 1.2)
    : (kills * 2 + surv * 1.5 + wave * 6 + runEng.bosses * 25);
  const xp = Math.floor(xpBase);
  const gained = grantSwarmXp(xp);

  saveEngageStats();
  checkAchievements({
    runJackpots: runEng.jackpots,
    rushRunBosses: rushRun ? cur.bosses : 0,
    rushBest: getRushBest(),
  });

  const lines = _buildDebriefLines(modeKey, prev, cur, flags);
  const stats = rushRun
    ? [{ label: 'Boss Rush best', value: getRushBest() + ' bosses' }]
    : [];
  return { xp: gained, lines, stats, newBest: flags };
}

function showRunDebrief(reason){
  const result = finishRunEngagement(reason);
  refreshDailyBountiesUI();
  return result;
}

loadEngagement();
