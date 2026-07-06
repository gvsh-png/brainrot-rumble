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

  function unlockAllWorlds() {
    if (!isDebugApk() || typeof WORLDS === 'undefined') return;
    const max = WORLDS.length - 1;
    unlockedMax = max;
    localStorage.setItem('br_unlocked', String(max));
    chalUnlocked = max;
    localStorage.setItem('br_ch_unlocked', String(max));
    selWorld = max;
    grantBestDebugGear();
    if (window.markDirty) window.markDirty();
    if (typeof refreshWorldSel === 'function') refreshWorldSel();
    if (typeof refreshTopbar === 'function') refreshTopbar();
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
    const btn = document.getElementById('sdrop-debug-unlock');
    if (btn && !btn._wired) {
      btn._wired = true;
      btn.addEventListener('click', unlockAllWorlds);
    }
  }

  window.debugUnlockAllWorlds = unlockAllWorlds;
  window.initDebugTools = initDebugTools;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDebugTools);
  else initDebugTools();
})();
