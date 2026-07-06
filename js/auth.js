'use strict';
// ============ ACCOUNTS: Google Play Games cloud save (Android) or local guest ============
// Progression saves to Google Play Games on the Android app. "Continue as Guest" keeps
// everything in localStorage only. Device-only settings (music/SFX mute) stay local.
//
// ANDROID SETUP (one-time, see docs/ANDROID_PUBLISH.md):
//   1. Create app in Google Play Console + enable Play Games Services
//   2. Enable Saved Games (Snapshots) in Play Console
//   3. Link OAuth client (package name + SHA-1) to Play Games
//   4. Build signed APK/AAB: npm run android:release

const EMPTY_PROFILE = () => ({ gold:0, unlocked:0, chalUnlocked:0, owned:[], equipped:{}, seen:[], gems:0, chars:[], pets:[], petPity:0, activeChar:'gianni', activePet:null });

let authMode = null;          // 'guest' | 'play'
let playPlayer = null;        // Google Play Games player (account mode)
let loadedPlayId = null;
let saveTimer = null;

function playAvailable(){
  return typeof PlayBridge !== 'undefined' && PlayBridge.isAvailable && PlayBridge.isAvailable();
}

function _dailyBountyKey(){
  const d = new Date();
  return 'br_daily_' + d.getUTCFullYear() + String(d.getUTCMonth() + 1).padStart(2, '0') + String(d.getUTCDate()).padStart(2, '0');
}

// ---- profile <-> the live localStorage working keys ----
function currentBlob(){
  const dailyKey = _dailyBountyKey();
  let dailyData = null;
  try{
    const raw = localStorage.getItem(dailyKey);
    if(raw) dailyData = JSON.parse(raw);
  }catch(e){}
  return {
    gold:       +(localStorage.getItem('br_gold')||0),
    unlocked:   +(localStorage.getItem('br_unlocked')||0),
    chalUnlocked: +(localStorage.getItem('br_ch_unlocked')||0),
    owned:      JSON.parse(localStorage.getItem('br_items_owned')||'[]'),
    equipped:   JSON.parse(localStorage.getItem('br_gear_equipped')||'{}'),
    seen:       JSON.parse(localStorage.getItem('br_gear_seen')||'[]'),
    gems:       +(localStorage.getItem('br_gems')||0),
    chars:      JSON.parse(localStorage.getItem('br_owned_chars')||'[]'),
    pets:       JSON.parse(localStorage.getItem('br_owned_pets')||'[]'),
    petPity:    +(localStorage.getItem('br_pet_pity')||0),
    activeChar: localStorage.getItem('br_active_char')||'gianni',
    activePet:  localStorage.getItem('br_active_pet')||null,
    swarmRank:  JSON.parse(localStorage.getItem('br_swarm_rank')||'{}'),
    engageStats: JSON.parse(localStorage.getItem('br_engage_stats')||'{}'),
    achievements: JSON.parse(localStorage.getItem('br_achievements')||'[]'),
    rushBest:   +(localStorage.getItem('br_rush_best')||0),
    rushReviveToken: +(localStorage.getItem('br_rush_revive_token')||0),
    rushBandage: +(localStorage.getItem('br_rush_bandage')||0),
    runBests:   JSON.parse(localStorage.getItem('br_run_bests')||'{}'),
    dailyBounty: dailyData ? { key: dailyKey, data: dailyData } : null,
    onboardVer: localStorage.getItem('br_onboard_ver'),
    guideDone:  JSON.parse(localStorage.getItem('br_guide_done')||'[]'),
    featAnim:   JSON.parse(localStorage.getItem('br_feat_anim')||'[]'),
    combatGuide: JSON.parse(localStorage.getItem('br_combat_guide')||'[]'),
    charSeen:   JSON.parse(localStorage.getItem('br_char_seen')||'[]'),
    petSeen:    JSON.parse(localStorage.getItem('br_pet_seen')||'[]'),
  };
}
function applyProfile(b){
  b = b || EMPTY_PROFILE();
  const restoredGold = Math.max(0, Math.floor(b.gold!=null? b.gold : 0));
  localStorage.setItem('br_gold', restoredGold);
  if(typeof _saveHash==='function') localStorage.setItem('br_gold_sig', _saveHash(restoredGold));
  localStorage.setItem('br_unlocked',      b.unlocked!=null? b.unlocked : 0);
  localStorage.setItem('br_ch_unlocked',   b.chalUnlocked!=null? b.chalUnlocked : 0);
  localStorage.setItem('br_items_owned',   JSON.stringify(b.owned||[]));
  localStorage.setItem('br_gear_equipped', JSON.stringify(b.equipped||{}));
  localStorage.setItem('br_gear_seen',     JSON.stringify(b.seen||[]));
  const restoredGems = Math.max(0, Math.floor(b.gems!=null? b.gems : 0));
  localStorage.setItem('br_gems', restoredGems);
  if(typeof _gemHash==='function') localStorage.setItem('br_gems_sig', _gemHash(restoredGems));
  if(typeof gemBalance!=='undefined') gemBalance = restoredGems;
  localStorage.setItem('br_owned_chars', JSON.stringify(b.chars||[]));
  localStorage.setItem('br_owned_pets', JSON.stringify(b.pets||[]));
  localStorage.setItem('br_pet_pity', b.petPity!=null? b.petPity : 0);
  const ac = b.activeChar||'gianni';
  localStorage.setItem('br_active_char', ac);
  if(typeof activeCharId!=='undefined') activeCharId = ac;
  if(b.activePet){ localStorage.setItem('br_active_pet', b.activePet); if(typeof activePetId!=='undefined') activePetId=b.activePet; }
  else { localStorage.removeItem('br_active_pet'); if(typeof activePetId!=='undefined') activePetId=null; }
  if(b.swarmRank && typeof b.swarmRank === 'object') localStorage.setItem('br_swarm_rank', JSON.stringify(b.swarmRank));
  if(b.engageStats && typeof b.engageStats === 'object') localStorage.setItem('br_engage_stats', JSON.stringify(b.engageStats));
  if(Array.isArray(b.achievements)) localStorage.setItem('br_achievements', JSON.stringify(b.achievements));
  if(b.rushBest != null) localStorage.setItem('br_rush_best', String(Math.max(0, Math.floor(b.rushBest))));
  if(b.rushReviveToken != null) localStorage.setItem('br_rush_revive_token', String(Math.max(0, Math.floor(b.rushReviveToken))));
  if(b.rushBandage != null) localStorage.setItem('br_rush_bandage', String(Math.max(0, Math.floor(b.rushBandage))));
  if(b.runBests && typeof b.runBests === 'object') localStorage.setItem('br_run_bests', JSON.stringify(b.runBests));
  if(b.dailyBounty && b.dailyBounty.key && b.dailyBounty.data) localStorage.setItem(b.dailyBounty.key, JSON.stringify(b.dailyBounty.data));
  if(b.onboardVer) localStorage.setItem('br_onboard_ver', b.onboardVer);
  if(Array.isArray(b.guideDone)) localStorage.setItem('br_guide_done', JSON.stringify(b.guideDone));
  if(Array.isArray(b.featAnim)) localStorage.setItem('br_feat_anim', JSON.stringify(b.featAnim));
  if(Array.isArray(b.combatGuide)) localStorage.setItem('br_combat_guide', JSON.stringify(b.combatGuide));
  if(Array.isArray(b.charSeen)) localStorage.setItem('br_char_seen', JSON.stringify(b.charSeen));
  if(Array.isArray(b.petSeen)) localStorage.setItem('br_pet_seen', JSON.stringify(b.petSeen));
  rehydrate();
}
function rehydrate(){
  try{
    gold = +(localStorage.getItem('br_gold')||0);
    unlockedMax = +(localStorage.getItem('br_unlocked')||0);
    if(typeof selWorld!=='undefined' && selWorld>unlockedMax) selWorld=unlockedMax;
    if(typeof chalUnlocked!=='undefined'){
      const maxChal = typeof WORLDS!=='undefined' ? WORLDS.length - 1 : 49;
      chalUnlocked = unlockedMax >= 3
        ? Math.max(0, Math.min(maxChal, +(localStorage.getItem('br_ch_unlocked')||0)))
        : -1;
    }
    const ownedRaw = JSON.parse(localStorage.getItem('br_items_owned')||'[]');
    if(typeof normalizeOwned==='function'){
      const ownedNorm = normalizeOwned(ownedRaw);
      gearOwned = ownedNorm.list;
      if(ownedNorm.dirty) localStorage.setItem('br_items_owned', JSON.stringify(gearOwned));
      if(typeof syncGearUidSeq==='function') syncGearUidSeq();
      const equipRaw = JSON.parse(localStorage.getItem('br_gear_equipped')||'{}');
      if(typeof normalizeEquip==='function'){
        const equipNorm = normalizeEquip(equipRaw, gearOwned);
        gearEquip = equipNorm.map;
        if(equipNorm.dirty) localStorage.setItem('br_gear_equipped', JSON.stringify(gearEquip));
      } else {
        gearEquip = Object.assign({helmet:null,chest:null,pants:null,shoes:null}, equipRaw);
      }
      const seenRaw = JSON.parse(localStorage.getItem('br_gear_seen')||'[]');
      if(typeof normalizeSeen==='function'){
        const seenNorm = normalizeSeen(seenRaw, gearOwned);
        gearSeen = new Set(seenNorm.list);
        if(seenNorm.dirty) localStorage.setItem('br_gear_seen', JSON.stringify([...gearSeen]));
      } else {
        gearSeen = new Set(seenRaw);
      }
    } else {
      gearOwned = ownedRaw;
      gearEquip = Object.assign({helmet:null,chest:null,pants:null,shoes:null}, JSON.parse(localStorage.getItem('br_gear_equipped')||'{}'));
      gearSeen  = new Set(JSON.parse(localStorage.getItem('br_gear_seen')||'[]'));
    }
  }catch(e){ console.warn('rehydrate failed',e); }
  if(typeof loadEngagement === 'function') loadEngagement();
  if(typeof refreshDailyBountiesUI === 'function') refreshDailyBountiesUI();
  if(typeof refreshTopbar==='function')    refreshTopbar();
  if(typeof refreshWorldSel==='function')  refreshWorldSel();
  if(typeof refreshMenuChar==='function')  refreshMenuChar();
  if(typeof renderShop==='function')       renderShop();
  if(typeof renderInventory==='function')  renderInventory();
  if(typeof renderPetsTab==='function')    renderPetsTab();
  if(typeof renderCharacterTab==='function') renderCharacterTab();
  if(typeof updateInvBadge==='function')   updateInvBadge();
  if(typeof updateCharBadge==='function')  updateCharBadge();
  if(typeof updatePetBadge==='function')   updatePetBadge();
  if(typeof refreshGemsUI==='function')    refreshGemsUI();
  const gt=$('goldtxt'); if(gt) gt.textContent = typeof fmtNum==='function' ? fmtNum(typeof gold!=='undefined'?gold:0) : (typeof gold!=='undefined'?gold:0);
}

const _ric = window.requestIdleCallback ? (fn)=>window.requestIdleCallback(fn,{timeout:2000}) : (fn)=>setTimeout(fn,0);
function markDirty(){ if(saveTimer) return; saveTimer=setTimeout(()=>{ saveTimer=null; _ric(saveProfile); }, 1500); }
window.markDirty = markDirty;
function flushSave(){ if(saveTimer){ clearTimeout(saveTimer); saveTimer=null; saveProfile(); } }
window.addEventListener('beforeunload', flushSave);
window.addEventListener('pagehide', flushSave);

function playCacheKey(id){ return 'br_save_play_'+id; }

function saveProfile(){
  const blob = currentBlob();
  if(authMode==='guest'){ localStorage.setItem('br_save_guest', JSON.stringify(blob)); return; }
  if(authMode==='play' && playPlayer && PlayBridge){
    const cacheKey = playCacheKey(playPlayer.playerId || 'default');
    localStorage.setItem(cacheKey, JSON.stringify(blob));
    PlayBridge.saveCloud(blob);
  }
}

function enterGuest(){
  authMode='guest'; playPlayer=null; loadedPlayId=null;
  let blob=null;
  try{ const g=localStorage.getItem('br_save_guest'); if(g) blob=JSON.parse(g); }catch(e){}
  if(!blob) blob=currentBlob();
  applyProfile(blob);
  localStorage.setItem('br_save_guest', JSON.stringify(currentBlob()));
  hideLogin(); updateAcctUI();
}

async function enterPlayAccount(player){
  const pid = player && (player.playerId || player.displayName || 'play');
  if(authMode==='play' && loadedPlayId===pid){ hideLogin(); updateAcctUI(); return; }
  authMode='play'; playPlayer=player; loadedPlayId=pid;
  let blob=null;
  try{
    blob = await PlayBridge.loadCloud();
  }catch(e){}
  if(!blob){
    const c=localStorage.getItem(playCacheKey(pid));
    if(c){ try{ blob=JSON.parse(c); }catch(_){} }
  }
  if(!blob) blob = EMPTY_PROFILE();
  applyProfile(blob);
  saveProfile();
  hideLogin(); updateAcctUI();
}

async function doPlayLogin(){
  if(!playAvailable()){ loginMsg("Google Play sign-in is only available in the Android app."); return; }
  authMode=null;
  loginMsg('Signing in…');
  const btn=$('btn-play'); if(btn) btn.disabled=true;
  try{
    const auth = await PlayBridge.signIn();
    if(!auth || !auth.isAuthenticated){ loginMsg('Sign-in cancelled or failed. Try again or play as guest.'); return; }
    const player = await PlayBridge.getPlayer();
    if(!player){ loginMsg('Signed in but could not load player profile.'); return; }
    await enterPlayAccount(player);
  } finally {
    if(btn) btn.disabled=false;
  }
}

function doSignOut(){
  if(authMode==='play'){
    try{ localStorage.setItem('br_save_guest', JSON.stringify(currentBlob())); }catch(e){}
    flushSave();
  }
  authMode=null; playPlayer=null; loadedPlayId=null;
  showLogin(); updateAcctUI();
}

function showLogin(){ const o=$('login'); if(o) o.classList.remove('hidden'); }
function hideLogin(){
  const o=$('login'); if(o) o.classList.add('hidden');
  if(typeof refreshRunResumeUI === 'function') refreshRunResumeUI();
  if(typeof refreshDailyBountiesUI === 'function') refreshDailyBountiesUI();
}
function loginMsg(t){ const m=$('loginmsg'); if(m){ m.textContent=t; m.classList.remove('hidden'); } }
function updateAcctUI(){
  const un=$('sdrop-username'), si=$('sdrop-acct'); if(!un) return;
  if(authMode==='play' && playPlayer){
    const nm = playPlayer.displayName || 'Play Games';
    un.textContent = String(nm).split(' ')[0];
    if(si){ si.textContent='Sign Out'; si.dataset.action='signout'; si.style.background='#d9694a'; si.style.boxShadow='0 4px 0 #a0412c'; }
  } else {
    un.textContent = 'Guest';
    if(si){ si.textContent='Sign In'; si.dataset.action='signin'; si.style.background=''; si.style.boxShadow=''; }
  }
}

function configureLoginUI(){
  const playBtn = $('btn-play');
  const sub = document.querySelector('.loginsub');
  const note = document.querySelector('.loginnote');
  if(playAvailable()){
    if(sub) sub.textContent = 'Sign in with Google Play to sync gold, worlds, gear, gems, pets, achievements, and Boss Rush progress across Android devices.';
    if(note) note.textContent = 'Guest progress stays on this device only. Continue-run saves and audio settings stay local.';
    if(playBtn) playBtn.classList.remove('hidden');
  } else {
    if(sub) sub.textContent = 'Play in your browser — progress is saved on this device.';
    if(note) note.textContent = 'Install the Android app from Google Play for cloud saves with Google Play Games.';
    if(playBtn) playBtn.classList.add('hidden');
  }
}

async function tryAutoPlaySignIn(){
  if(!playAvailable()) return false;
  try{
    const auth = await PlayBridge.isAuthenticated();
    if(!auth || !auth.isAuthenticated) return false;
    const player = await PlayBridge.getPlayer();
    if(!player) return false;
    await enterPlayAccount(player);
    return true;
  }catch(e){ return false; }
}

(function initAuth(){
  if(localStorage.getItem('br_save_guest')==null){
    try{ localStorage.setItem('br_save_guest', JSON.stringify(currentBlob())); }catch(e){}
  }

  configureLoginUI();

  const playBtn=$('btn-play'); if(playBtn) playBtn.addEventListener('click', doPlayLogin);
  const gu=$('btn-guest'); if(gu) gu.addEventListener('click', enterGuest);
  const si=$('sdrop-acct'); if(si) si.addEventListener('click', ()=>{
    $('settingsdrop').classList.add('hidden');
    if(si.dataset.action==='signout'){ if(confirm('Sign out of Google Play Games?')) doSignOut(); }
    else { showLogin(); }
  });

  (async ()=>{
    const signedIn = await tryAutoPlaySignIn();
    if(!signedIn){
      if(!playAvailable()) enterGuest();
      else showLogin();
    }
    updateAcctUI();
  })();
})();
