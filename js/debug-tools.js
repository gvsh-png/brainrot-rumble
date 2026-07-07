'use strict';
// Debug-only tools — visible when window.__BR_DEBUG_APK__ is true (debug APK).

(function () {
  function isDebugApk() {
    return window.__BR_DEBUG_APK__ === true;
  }

  function grantBestDebugGear() {
    if (typeof addGearInstance !== 'function' || typeof RAR_ORDER === 'undefined' || typeof GEAR_CATS === 'undefined') return;
    const bestRar = RAR_ORDER[RAR_ORDER.length - 1];
    for (let ci = 0; ci < GEAR_CATS.length; ci++) addGearInstance('dmg_' + bestRar + '_' + ci);
    if (typeof autoEquipBest === 'function') autoEquipBest();
    else if (typeof renderInventory === 'function') renderInventory();
  }

  function grantAllDebugPets() {
    if (typeof PETS === 'undefined' || typeof grantPet !== 'function') return;
    for (const p of PETS) grantPet(p.id);
    if (typeof updatePetBadge === 'function') updatePetBadge();
    if (typeof renderPetsTab === 'function') renderPetsTab();
  }

  function unlockAllFeaturesUI() {
    if (window.Onboarding && typeof Onboarding.applyTabLocks === 'function') {
      Onboarding.applyTabLocks();
    }
    document.querySelectorAll('.feature-locked').forEach((el) => el.classList.remove('feature-locked'));
  }

  function skipBeatWorld1() {
    if (!isDebugApk() || typeof WORLDS === 'undefined') return;
    const prev = typeof unlockedMax === 'number' ? unlockedMax : +(localStorage.getItem('br_unlocked') || 0);
    if (prev < 1) {
      unlockedMax = 1;
      localStorage.setItem('br_unlocked', '1');
    }
    selWorld = Math.min(Math.max(selWorld, 1), unlockedMax);
    gameMode = 'story';
    if (typeof clearSuspendedRun === 'function') clearSuspendedRun();
    if (window.Onboarding && typeof Onboarding.debugReplayWorld1 === 'function') {
      Onboarding.debugReplayWorld1();
    }
    if (typeof quitToMenu === 'function') quitToMenu();
    if (typeof clearWorldEmblemCache === 'function') clearWorldEmblemCache();
    if (typeof refreshWorldSel === 'function') refreshWorldSel();
    if (typeof refreshTopbar === 'function') refreshTopbar();
    if (typeof triggerUnlockReveal === 'function') triggerUnlockReveal();
    if (window.Onboarding && typeof Onboarding.onWorldClear === 'function') {
      Onboarding.onWorldClear(0, 1);
    } else {
      unlockAllFeaturesUI();
    }
    if (window.markDirty) window.markDirty();
    if (typeof sfx !== 'undefined' && sfx.pick) sfx.pick();
    if (typeof bigText === 'function') bigText('DEBUG: WORLD 1 CLEARED', '#ffd24a');
  }

  function unlockAllWorlds() {
    if (!isDebugApk() || typeof WORLDS === 'undefined') return;
    const max = WORLDS.length - 1;
    unlockedMax = max;
    localStorage.setItem('br_unlocked', String(max));
    chalUnlocked = max;
    localStorage.setItem('br_ch_unlocked', String(max));
    selWorld = max;
    grantBestDebugGear();
    grantAllDebugPets();
    if (typeof clearWorldEmblemCache === 'function') clearWorldEmblemCache();
    if (window.markDirty) window.markDirty();
    if (typeof refreshWorldSel === 'function') refreshWorldSel();
    if (typeof refreshTopbar === 'function') refreshTopbar();
    unlockAllFeaturesUI();
    if (typeof renderShop === 'function') renderShop();
    if (typeof sfx !== 'undefined' && sfx.pick) sfx.pick();
    if (typeof bigText === 'function') bigText('DEBUG: ALL WORLDS + BEST GEAR', '#4ad0c0');
  }

  function initDebugTools() {
    const sec = document.getElementById('debug-tools-section');
    const sep = document.getElementById('debug-tools-sep');
    if (!isDebugApk()) {
      if (sec) sec.classList.add('hidden');
      if (sep) sep.classList.add('hidden');
      return;
    }
    if (sec) sec.classList.remove('hidden');
    if (sep) sep.classList.remove('hidden');
    const skipW1 = document.getElementById('sdrop-debug-skip-w1');
    if (skipW1 && !skipW1._wired) {
      skipW1._wired = true;
      skipW1.addEventListener('click', skipBeatWorld1);
    }
    const btn = document.getElementById('sdrop-debug-unlock');
    if (btn && !btn._wired) {
      btn._wired = true;
      btn.addEventListener('click', unlockAllWorlds);
    }
  }

  window.debugUnlockAllWorlds = unlockAllWorlds;
  window.debugSkipBeatWorld1 = skipBeatWorld1;
  window.initDebugTools = initDebugTools;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDebugTools);
  else initDebugTools();
})();
