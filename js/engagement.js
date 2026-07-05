'use strict';
// Retention loops: kill combos, daily bounties, swarm rank, achievements, run debrief.

const COMBO_WINDOW = 1.35;
const COMBO_TIERS = [
  { n: 5,  label: 'MULTI-KILL!',  col: '#9fe0ff', coins: 8 },
  { n: 10, label: 'RAMPAGE!',     col: '#ffe08a', coins: 15 },
  { n: 20, label: 'UNSTOPPABLE!', col: '#ff7a3a', coins: 30 },
  { n: 35, label: 'SWARM GOD!',   col: '#ff5acd', coins: 50 },
];
const RANK_TITLES = ['Hatchling','Swarmling','Hunter','Stinger','Reaper','Apex','Overlord','Legend'];

const BOUNTY_POOL = [
  { id: 'k150',  label: 'Slay 150 foes today',      track: 'kills',   target: 150, reward: { gold: 220 } },
  { id: 'k350',  label: 'Slay 350 foes today',      track: 'kills',   target: 350, reward: { gems: 2 } },
  { id: 'surv5', label: 'Survive 5 min in one run', track: 'survive', target: 300, reward: { gold: 300 } },
  { id: 'w8',    label: 'Reach wave 8 in a run',    track: 'wave',    target: 8,   reward: { gold: 260 } },
  { id: 'w12',   label: 'Reach wave 12 in a run',   track: 'wave',    target: 12,  reward: { gems: 2 } },
  { id: 'boss1', label: 'Defeat a boss today',      track: 'bosses',  target: 1,   reward: { gold: 200 } },
  { id: 'boss3', label: 'Defeat 3 bosses today',    track: 'bosses',  target: 3,   reward: { gems: 3 } },
  { id: 'combo12', label: 'Hit a 12-kill combo',    track: 'combo',   target: 12,  reward: { gold: 240 } },
  { id: 'coins600', label: 'Earn 600 coins today',  track: 'coins',   target: 600, reward: { gems: 2 } },
  { id: 'evo2',  label: 'Evolve 2 skills today',    track: 'evolves', target: 2,   reward: { gold: 280 } },
];

const ACHIEVEMENTS = [
  { id: 'first_run',   name: 'First Blood',      desc: 'Finish your first run.', check: s => s.runs >= 1 },
  { id: 'combo15',     name: 'Multi-Murderer',   desc: 'Reach a 15-kill combo.', check: s => s.bestCombo >= 15 },
  { id: 'combo30',     name: 'Swarm Hurricane',  desc: 'Reach a 30-kill combo.', check: s => s.bestCombo >= 30 },
  { id: 'wave10',      name: 'Wave Rider',       desc: 'Reach wave 10.', check: s => s.bestWave >= 10 },
  { id: 'wave18',      name: 'Deep Diver',       desc: 'Reach wave 18.', check: s => s.bestWave >= 18 },
  { id: 'boss5',       name: 'Boss Bully',       desc: 'Defeat 5 bosses total.', check: s => s.totalBosses >= 5 },
  { id: 'jackpot5',    name: 'High Roller',      desc: 'Land 5 jackpots in one run.', check: s => s.runJackpots >= 5 },
  { id: 'rank3',       name: 'Rising Threat',    desc: 'Reach Swarm Rank 3.', check: s => s.swarmRank >= 3 },
  { id: 'rank6',       name: 'Apex Predator',    desc: 'Reach Swarm Rank 6.', check: s => s.swarmRank >= 6 },
  { id: 'synergy1',    name: 'Synergy Spark',    desc: 'Unlock a synergy skill.', check: s => s.totalSynergies >= 1 },
  { id: 'daily3',      name: 'Bounty Hunter',    desc: 'Complete 3 daily bounties.', check: s => s.bountiesDone >= 3 },
  { id: 'surv10',      name: 'Iron Will',        desc: 'Survive 10 minutes in one run.', check: s => s.bestSurvive >= 600 },
];

let comboCount = 0, comboTimer = 0, comboAnnounced = 0;
let runEng = { jackpots: 0, evolves: 0, bosses: 0, synergies: 0, maxCombo: 0 };
let runMilestones = new Set();
let swarmRank = 1, swarmXp = 0;
let engageStats = { runs: 0, bestCombo: 0, bestWave: 0, bestSurvive: 0, totalBosses: 0, totalSynergies: 0, bountiesDone: 0 };
let unlockedAch = new Set();

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
function rankTitle(lv){ return RANK_TITLES[Math.min(lv - 1, RANK_TITLES.length - 1)] || 'Legend'; }

function refreshSwarmRankUI(){
  const badge = $('topLvl');
  const fill = $('topxpfill');
  if(badge) badge.textContent = swarmRank;
  if(fill){
    const need = swarmXpNext(swarmRank);
    fill.style.width = Math.round(Math.min(1, swarmXp / need) * 100) + '%';
  }
}

function grantSwarmXp(n){
  if(!n || gameMode === 'practice') return 0;
  swarmXp += n;
  let gained = n, ups = 0;
  while(swarmXp >= swarmXpNext(swarmRank)){
    swarmXp -= swarmXpNext(swarmRank);
    swarmRank++;
    ups++;
    if(typeof bigText === 'function') bigText('RANK UP! ' + rankTitle(swarmRank), '#b06ff0');
    if(typeof sfx !== 'undefined' && sfx.level) sfx.level();
    if(typeof haptic === 'function') haptic('level');
  }
  saveSwarmRank();
  refreshSwarmRankUI();
  return gained;
}

function resetRunEngagement(){
  comboCount = 0; comboTimer = 0; comboAnnounced = 0;
  runEng = { jackpots: 0, evolves: 0, bosses: 0, synergies: 0, maxCombo: 0 };
  runMilestones = new Set();
  const row = $('comborow'); if(row) row.classList.add('hidden');
}

function _updateComboHUD(){
  const row = $('comborow'), fill = $('combofill'), tag = $('combotag');
  if(!row) return;
  if(comboCount < 2 || typeof state === 'undefined' || state !== ST.PLAY){
    row.classList.add('hidden');
    return;
  }
  row.classList.remove('hidden');
  const tier = COMBO_TIERS[COMBO_TIERS.length - 1];
  let next = COMBO_TIERS[0];
  for(const t of COMBO_TIERS){ if(comboCount >= t.n) next = t; }
  const prevN = COMBO_TIERS.filter(t => t.n <= comboCount).pop();
  const prev = prevN ? prevN.n : 0;
  const nxt = COMBO_TIERS.find(t => t.n > comboCount);
  const denom = nxt ? (nxt.n - prev) : 1;
  const num = nxt ? (comboCount - prev) : 1;
  if(fill) fill.style.width = Math.round(Math.min(1, num / denom) * 100) + '%';
  if(tag) tag.textContent = comboCount + ' COMBO';
}

function tickCombo(dt){
  if(comboTimer > 0){
    comboTimer -= dt;
    if(comboTimer <= 0){ comboCount = 0; comboAnnounced = 0; }
  }
  _updateComboHUD();
}

function engageOnKill(){
  if(gameMode === 'practice') return;
  comboCount++;
  comboTimer = COMBO_WINDOW;
  runEng.maxCombo = Math.max(runEng.maxCombo, comboCount);
  engageStats.bestCombo = Math.max(engageStats.bestCombo, comboCount);
  for(const t of COMBO_TIERS){
    if(comboCount === t.n && comboAnnounced < t.n){
      comboAnnounced = t.n;
      if(typeof bigText === 'function') bigText(t.label, t.col);
      if(typeof shake !== 'undefined') shake = Math.max(shake, 5 + t.n * 0.2);
      if(typeof sfx !== 'undefined' && sfx.coin) sfx.coin();
      if(typeof haptic === 'function') haptic('light');
      if(typeof worldCoins !== 'undefined'){
        worldCoins += t.coins;
        if(typeof gold !== 'undefined'){ gold += t.coins; if(typeof saveGold === 'function') saveGold(); }
        if(typeof setCoinHUD === 'function') setCoinHUD();
        if(typeof floatText === 'function' && typeof P !== 'undefined') floatText(P.x, P.y - 50, '+' + t.coins + ' combo', t.col, 14);
      }
      tickDailyProgress('combo', comboCount, true);
    }
  }
  tickDailyProgress('kills', 1, false);
  _updateComboHUD();
  checkRunMilestones();
}

function engageOnJackpot(){
  runEng.jackpots++;
}

function engageOnBossKill(){
  if(gameMode === 'practice') return;
  runEng.bosses++;
  engageStats.totalBosses++;
  tickDailyProgress('bosses', 1, false);
}

function engageOnEvolve(){
  if(gameMode === 'practice') return;
  runEng.evolves++;
  tickDailyProgress('evolves', 1, false);
}

function engageSynergyUnlock(name){
  if(gameMode === 'practice') return;
  runEng.synergies++;
  engageStats.totalSynergies++;
  if(typeof bigText === 'function') bigText('SYNERGY!', '#c8a0ff');
  if(typeof sfx !== 'undefined' && sfx.evolve) sfx.evolve();
  if(typeof haptic === 'function') haptic('evolve');
  showSynergyBanner(name);
}

function showSynergyBanner(name){
  const el = $('synergy-banner');
  if(!el) return;
  el.textContent = 'SYNERGY — ' + (name || 'UNLOCKED');
  el.classList.remove('hidden');
  el.classList.add('synergy-pop');
  setTimeout(() => { el.classList.add('hidden'); el.classList.remove('synergy-pop'); }, 2200);
}

function checkRunMilestones(){
  if(typeof kills === 'undefined' || typeof elapsed === 'undefined') return;
  const marks = [
    { k: 'k50',  test: () => kills >= 50,  text: '50 KILLS!', col: '#9fe0ff' },
    { k: 'k100', test: () => kills >= 100, text: '100 KILLS!', col: '#ffe08a' },
    { k: 'k250', test: () => kills >= 250, text: '250 KILLS!', col: '#ff9f3a' },
    { k: 't3',   test: () => elapsed >= 180, text: '3:00 SURVIVED!', col: '#4ad0c0' },
    { k: 't5',   test: () => elapsed >= 300, text: '5:00 SURVIVED!', col: '#4aa3df' },
    { k: 't8',   test: () => elapsed >= 480, text: '8:00 SURVIVED!', col: '#b06ff0' },
  ];
  for(const m of marks){
    if(runMilestones.has(m.k) || !m.test()) continue;
    runMilestones.add(m.k);
    if(typeof bigText === 'function') bigText(m.text, m.col);
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
  if(typeof bigText === 'function' && typeof P !== 'undefined') bigText('BOUNTY DONE!', '#f5c542');
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
      '<div class="db-label">' + def.label + '</div>' +
      '<div class="db-bar"><div class="db-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="db-meta"><span>' + Math.min(prog, def.target) + '/' + def.target + '</span><span class="db-reward">' + rew + '</span></div>' +
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

function toastAchievement(a){
  const el = $('ach-toast');
  if(!el) return;
  el.innerHTML = '<div class="ach-toast-title">🏆 ' + a.name + '</div><div class="ach-toast-desc">' + a.desc + '</div>';
  el.classList.remove('hidden');
  el.classList.add('ach-pop');
  setTimeout(() => { el.classList.add('hidden'); el.classList.remove('ach-pop'); }, 2800);
}

function checkAchievements(ctx){
  ctx = Object.assign({
    runs: engageStats.runs,
    bestCombo: Math.max(engageStats.bestCombo, runEng.maxCombo),
    bestWave: engageStats.bestWave,
    bestSurvive: engageStats.bestSurvive,
    totalBosses: engageStats.totalBosses,
    totalSynergies: engageStats.totalSynergies,
    bountiesDone: engageStats.bountiesDone,
    swarmRank,
    runJackpots: runEng.jackpots,
  }, ctx || {});
  for(const a of ACHIEVEMENTS){
    if(unlockedAch.has(a.id)) continue;
    if(!a.check(ctx)) continue;
    unlockedAch.add(a.id);
    saveAchievements();
    toastAchievement(a);
  }
}

function engageTick(dt){
  tickCombo(dt);
  if(gameMode === 'practice' || typeof state === 'undefined' || state !== ST.PLAY) return;
  const surv = timerMode() ? (typeof chalElapsed !== 'undefined' ? chalElapsed : elapsed) : elapsed;
  engageStats.bestSurvive = Math.max(engageStats.bestSurvive, surv);
  if(surv >= 300) tickDailyProgress('survive', surv, true);
  if(typeof wave !== 'undefined') tickDailyProgress('wave', wave, true);
}

function finishRunEngagement(reason){
  if(gameMode === 'practice') return { xp: 0, lines: [] };
  engageStats.runs++;
  const surv = timerMode() ? chalElapsed : elapsed;
  engageStats.bestSurvive = Math.max(engageStats.bestSurvive, surv);
  engageStats.bestWave = Math.max(engageStats.bestWave, wave);
  engageStats.bestCombo = Math.max(engageStats.bestCombo, runEng.maxCombo);

  tickDailyProgress('coins', worldCoins, false);

  const bests = JSON.parse(localStorage.getItem('br_run_bests') || '{}');
  const modeKey = gameMode + '_w' + worldIdx;
  const prev = bests[modeKey] || { kills: 0, wave: 0, survive: 0, combo: 0 };
  const curWave = timerMode() ? Math.floor(surv / 60) : wave;
  const lines = [];
  if(kills > prev.kills){ prev.kills = kills; lines.push('Kills — new best!'); }
  if(curWave > prev.wave){ prev.wave = curWave; lines.push(timerMode() ? 'Time — new best!' : 'Wave — new best!'); }
  if(surv > prev.survive){ prev.survive = surv; }
  if(runEng.maxCombo > prev.combo){ prev.combo = runEng.maxCombo; lines.push('Combo — new best!'); }
  bests[modeKey] = prev;
  try{ localStorage.setItem('br_run_bests', JSON.stringify(bests)); }catch(e){}

  const xp = Math.floor(kills * 2 + surv * 1.5 + wave * 6 + runEng.maxCombo * 3 + runEng.bosses * 25);
  const gained = grantSwarmXp(xp);

  saveEngageStats();
  checkAchievements({ runJackpots: runEng.jackpots });

  return {
    xp: gained,
    lines,
    stats: [
      'Best combo: ' + runEng.maxCombo,
      runEng.jackpots ? ('Jackpots: ' + runEng.jackpots) : null,
      runEng.evolves ? ('Evolves: ' + runEng.evolves) : null,
      runEng.bosses ? ('Bosses: ' + runEng.bosses) : null,
    ].filter(Boolean),
  };
}

function showRunDebrief(reason){
  const debrief = finishRunEngagement(reason);
  const extra = $('go-extra');
  const rank = $('go-rank');
  if(extra){
    const parts = debrief.lines.concat(debrief.stats);
    extra.innerHTML = parts.length ? parts.map(s => '<div class="go-line">' + s + '</div>').join('') : '';
    extra.classList.toggle('hidden', !parts.length);
  }
  if(rank){
    if(debrief.xp > 0){
      rank.textContent = '+' + debrief.xp + ' Swarm XP · Rank ' + swarmRank + ' ' + rankTitle(swarmRank);
      rank.classList.remove('hidden');
    } else rank.classList.add('hidden');
  }
  refreshDailyBountiesUI();
  refreshSwarmRankUI();
}

loadEngagement();
refreshSwarmRankUI();
