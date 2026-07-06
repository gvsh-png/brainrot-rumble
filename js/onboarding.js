'use strict';
// Progressive tutorial: locked tabs, spotlight guides, unlock animations.

(function () {
  const ONBOARD_VER = '1';
  const LS_ANIM = 'br_feat_anim';
  const LS_GUIDE = 'br_guide_done';

  const FEATURE_GATES = {
    shop: 1,
    character: 1,
    daily_bounties: 1,
    gamemode: 1,
    pets: 2,
    inventory: 2,
    pet_recruit: 2,
  };

  const TAB_FEATURE = {
    shop: 'shop',
    pets: 'pets',
    character: 'character',
    inventory: 'inventory',
  };

  const UNLOCK_LABELS = {
    shop: 'SHOP UNLOCKED',
    character: 'CHARACTERS',
    pets: 'PETS',
    inventory: 'EQUIPMENT',
    pet_recruit: 'PET RECRUIT',
    daily_bounties: 'DAILY BOUNTIES',
    gamemode: 'GAME MODES',
  };

  let animSeen = new Set();
  let guideDone = new Set();
  let guideActive = false;
  let guideQueue = [];
  let resizeObs = null;

  function storyProgress() {
    if (typeof unlockedMax === 'number') return unlockedMax;
    return +(localStorage.getItem('br_unlocked') || 0);
  }

  function loadFlags() {
    try {
      animSeen = new Set(JSON.parse(localStorage.getItem(LS_ANIM) || '[]'));
    } catch (e) {
      animSeen = new Set();
    }
    try {
      guideDone = new Set(JSON.parse(localStorage.getItem(LS_GUIDE) || '[]'));
    } catch (e) {
      guideDone = new Set();
    }
  }

  function saveAnim() {
    try {
      localStorage.setItem(LS_ANIM, JSON.stringify([...animSeen]));
    } catch (e) {}
  }

  function saveGuide() {
    try {
      localStorage.setItem(LS_GUIDE, JSON.stringify([...guideDone]));
    } catch (e) {}
  }

  function migrateVeterans() {
    if (localStorage.getItem('br_onboard_ver') === ONBOARD_VER) return;
    const u = storyProgress();
    const anim = [];
    const guides = ['first_play'];
    if (u >= 1) {
      anim.push('shop', 'character', 'daily_bounties', 'gamemode');
      guides.push('shop_unlock', 'visit_shop', 'shop_intro', 'bounties', 'gamemode_intro');
    }
    if (u >= 2) {
      anim.push('pets', 'inventory', 'pet_recruit');
      guides.push('pets_unlock', 'equipment_unlock', 'pet_recruit');
    }
    for (const id of anim) animSeen.add(id);
    for (const id of guides) guideDone.add(id);
    saveAnim();
    saveGuide();
    localStorage.setItem('br_onboard_ver', ONBOARD_VER);
  }

  function isFeatureUnlocked(feature) {
    const need = FEATURE_GATES[feature];
    if (need == null) return true;
    return storyProgress() >= need;
  }

  function isTabUnlocked(tab) {
    const feat = TAB_FEATURE[tab];
    if (!feat) return true;
    return isFeatureUnlocked(feat);
  }

  function tabLockHint(tab) {
    const feat = TAB_FEATURE[tab];
    const need = feat ? FEATURE_GATES[feat] : 0;
    if (!need || isFeatureUnlocked(feat)) return '';
    return 'Beat World ' + need;
  }

  function petRecruitUnlocked() {
    return isFeatureUnlocked('pet_recruit');
  }

  function markGuide(id) {
    if (!id) return;
    guideDone.add(id);
    saveGuide();
  }

  function hasGuide(id) {
    return guideDone.has(id);
  }

  function featuresNewlyUnlocked(prev, next) {
    const out = [];
    for (const [feat, need] of Object.entries(FEATURE_GATES)) {
      if (prev < need && next >= need && !animSeen.has(feat)) out.push(feat);
    }
    return out;
  }

  function applyTabLocks() {
    document.querySelectorAll('#tabbar .tabbtn').forEach((btn) => {
      const tab = btn.dataset.tab;
      const locked = tab && !isTabUnlocked(tab);
      btn.classList.toggle('tabbtn-locked', !!locked);
      btn.setAttribute('aria-disabled', locked ? 'true' : 'false');
      let hint = btn.querySelector('.tablockhint');
      if (locked) {
        if (!hint) {
          hint = document.createElement('span');
          hint.className = 'tablockhint';
          btn.appendChild(hint);
        }
        hint.textContent = tabLockHint(tab);
      } else if (hint) {
        hint.remove();
      }
    });

    const bounties = typeof $ === 'function' ? $('daily-bounties') : null;
    if (bounties) {
      bounties.classList.toggle('feature-locked', !isFeatureUnlocked('daily_bounties'));
    }
    const gmBtn = typeof $ === 'function' ? $('gamemodebtn') : null;
    if (gmBtn) {
      gmBtn.classList.toggle('feature-locked', !isFeatureUnlocked('gamemode'));
    }
  }

  function playTabUnlockAnim(feature) {
    const tabMap = { shop: 'shop', pets: 'pets', character: 'character', inventory: 'inventory' };
    const tab = tabMap[feature];
    if (!tab) return;
    const btn = document.querySelector('#tabbar .tabbtn[data-tab="' + tab + '"]');
    if (!btn) return;
    btn.classList.remove('tabbtn-locked');
    btn.classList.add('tab-unlocking');
    const hint = btn.querySelector('.tablockhint');
    if (hint) hint.remove();
    setTimeout(() => btn.classList.remove('tab-unlocking'), 900);
    if (typeof sfx !== 'undefined' && sfx.evolve) sfx.evolve();
  }

  function playFeatureUnlocks(list) {
    if (!list || !list.length) return;
    let i = 0;
    function next() {
      if (i >= list.length) {
        applyTabLocks();
        queueGuidesAfterUnlock(list);
        return;
      }
      const feat = list[i++];
      animSeen.add(feat);
      saveAnim();
      const label = UNLOCK_LABELS[feat] || feat.toUpperCase();
      if (typeof bigText === 'function') bigText(label, '#9fe0ff');
      if (TAB_FEATURE[feat] || feat === 'pets' || feat === 'inventory') {
        setTimeout(() => playTabUnlockAnim(feat), 180);
      }
      if (feat === 'daily_bounties') {
        const el = typeof $ === 'function' ? $('daily-bounties') : null;
        if (el) {
          el.classList.remove('feature-locked');
          el.classList.add('feature-unlocking');
          setTimeout(() => el.classList.remove('feature-unlocking'), 900);
        }
      }
      if (feat === 'gamemode') {
        const el = typeof $ === 'function' ? $('gamemodebtn') : null;
        if (el) {
          el.classList.remove('feature-locked');
          el.classList.add('feature-unlocking');
          setTimeout(() => el.classList.remove('feature-unlocking'), 900);
        }
      }
      setTimeout(next, 720);
    }
    next();
  }

  function queueGuidesAfterUnlock(features) {
    if (features.includes('shop')) guideQueue.push('shop_unlock');
    if (features.includes('pets')) guideQueue.push('pets_unlock');
    if (features.includes('inventory')) guideQueue.push('equipment_unlock');
    if (features.includes('pet_recruit')) guideQueue.push('pet_recruit');
    if (features.includes('daily_bounties')) guideQueue.push('bounties');
    if (features.includes('gamemode')) guideQueue.push('gamemode_intro');
    drainGuideQueue();
  }

  function getOverlay() {
    return typeof $ === 'function' ? $('guide-overlay') : document.getElementById('guide-overlay');
  }

  function hideGuide() {
    const ov = getOverlay();
    if (!ov) return;
    ov.classList.add('hidden');
    ov.classList.remove('active');
    guideActive = false;
    if (resizeObs) {
      resizeObs.disconnect();
      resizeObs = null;
    }
    window.removeEventListener('resize', repositionGuide);
    window.removeEventListener('scroll', repositionGuide, true);
  }

  function repositionGuide() {
    if (!guideActive || !guideActive._sel) return;
    const el = document.querySelector(guideActive._sel);
    const ov = getOverlay();
    if (!el || !ov) return;
    const ring = ov.querySelector('.guide-ring');
    const card = ov.querySelector('.guide-card');
    const finger = ov.querySelector('.guide-finger');
    if (!ring || !card) return;
    const r = el.getBoundingClientRect();
    const pad = 10;
    ring.style.left = (r.left - pad) + 'px';
    ring.style.top = (r.top - pad) + 'px';
    ring.style.width = (r.width + pad * 2) + 'px';
    ring.style.height = (r.height + pad * 2) + 'px';
    const cardW = card.offsetWidth || 280;
    let cardLeft = Math.max(12, Math.min(window.innerWidth - cardW - 12, r.left + r.width / 2 - cardW / 2));
    let cardTop = r.bottom + 16;
    if (cardTop + card.offsetHeight > window.innerHeight - 12) cardTop = r.top - card.offsetHeight - 16;
    if (cardTop < 12) cardTop = 12;
    card.style.left = cardLeft + 'px';
    card.style.top = cardTop + 'px';
    if (finger) {
      finger.style.left = (r.left + r.width / 2 - 14) + 'px';
      finger.style.top = (r.bottom - 6) + 'px';
    }
    guideActive._target = el;
  }

  function showGuide(step) {
    if (!step || hasGuide(step.id)) return false;
    const el = document.querySelector(step.sel);
    const ov = getOverlay();
    if (!el || !ov) return false;

    if (step.tab && typeof showTab === 'function' && isTabUnlocked(step.tab)) {
      showTab(step.tab);
    }

    guideActive = step;
    guideActive._sel = step.sel;
    ov.classList.remove('hidden');
    void ov.offsetWidth;
    ov.classList.add('active');

    const title = ov.querySelector('.guide-title');
    const text = ov.querySelector('.guide-text');
    const btn = ov.querySelector('.guide-next');
    const finger = ov.querySelector('.guide-finger');
    if (title) title.textContent = step.title || '';
    if (text) text.textContent = step.text || '';
    if (btn) {
      btn.textContent = step.btn || (step.tap ? 'Tap highlighted' : 'Got it');
      btn.classList.toggle('hidden', !!step.tap);
    }
    if (finger) finger.classList.toggle('hidden', !step.tap);

    repositionGuide();
    window.addEventListener('resize', repositionGuide);
    window.addEventListener('scroll', repositionGuide, true);
    if (typeof ResizeObserver !== 'undefined') {
      resizeObs = new ResizeObserver(repositionGuide);
      resizeObs.observe(el);
    }

    function finish() {
      markGuide(step.id);
      hideGuide();
      if (step.onDone) step.onDone();
      setTimeout(drainGuideQueue, 280);
    }

    if (btn) {
      btn.onclick = (e) => {
        e.stopPropagation();
        finish();
      };
    }

    if (step.tap) {
      const onTap = () => {
        el.removeEventListener('click', onTap, true);
        finish();
      };
      el.addEventListener('click', onTap, true);
    }

    ov.onclick = (e) => {
      if (e.target === ov || e.target.classList.contains('guide-dim')) {
        if (!step.tap) finish();
      }
    };

    return true;
  }

  const GUIDE_DEFS = {
    first_play: {
      id: 'first_play',
      sel: '#startbtn',
      tab: 'battle',
      title: 'Your first run',
      text: 'Tap PLAY to enter World 1. Survive the waves and defeat the final boss!',
      tap: true,
      req: () => storyProgress() < 1,
    },
    shop_unlock: {
      id: 'shop_unlock',
      sel: '#tabbar .tabbtn[data-tab="shop"]',
      tab: 'battle',
      title: 'Shop unlocked!',
      text: 'Fresh gear and cases await. Open the Shop before your next run.',
      tap: true,
      req: () => isFeatureUnlocked('shop'),
    },
    shop_intro: {
      id: 'shop_intro',
      sel: '#shopgrid .banner',
      tab: 'shop',
      title: 'Daily Shop',
      text: 'Deals rotate every day. Snag discounted gear matched to your world.',
      btn: 'Nice',
      req: () => isFeatureUnlocked('shop'),
    },
    bounties: {
      id: 'bounties',
      sel: '#daily-bounties',
      tab: 'battle',
      title: 'Daily Bounties',
      text: 'Complete tasks for bonus gold and gems. Resets at UTC midnight.',
      btn: 'Got it',
      req: () => isFeatureUnlocked('daily_bounties'),
    },
    gamemode_intro: {
      id: 'gamemode_intro',
      sel: '#gamemodebtn',
      tab: 'battle',
      title: 'Game Modes',
      text: 'Training, Challenger, and Boss Rush unlock as you progress through Story.',
      btn: 'Understood',
      req: () => isFeatureUnlocked('gamemode'),
    },
    pets_unlock: {
      id: 'pets_unlock',
      sel: '#tabbar .tabbtn[data-tab="pets"]',
      tab: 'battle',
      title: 'Pets unlocked!',
      text: 'Companions fight at your side. Check the Pets tab!',
      tap: true,
      req: () => isFeatureUnlocked('pets'),
    },
    equipment_unlock: {
      id: 'equipment_unlock',
      sel: '#tabbar .tabbtn[data-tab="inventory"]',
      tab: 'battle',
      title: 'Equipment unlocked!',
      text: 'Equip the gear you find. Tap Equipment to manage your loadout.',
      tap: true,
      req: () => isFeatureUnlocked('inventory'),
    },
    pet_recruit: {
      id: 'pet_recruit',
      sel: '#petpullbtn, .petrecruit-locked',
      tab: 'shop',
      title: 'Recruit a pet',
      text: 'Spend gems in the Shop to recruit a random pet companion.',
      btn: 'Got it',
      req: () => isFeatureUnlocked('pet_recruit'),
    },
  };

  function drainGuideQueue() {
    if (guideActive) return;
    while (guideQueue.length) {
      const id = guideQueue.shift();
      const def = GUIDE_DEFS[id];
      if (!def || hasGuide(id)) continue;
      if (def.req && !def.req()) continue;
      if (showGuide(def)) return;
    }
    maybeFirstPlayGuide();
  }

  function maybeFirstPlayGuide() {
    if (guideActive || hasGuide('first_play')) return;
    const def = GUIDE_DEFS.first_play;
    if (!def.req()) return;
    showGuide(def);
  }

  function onTabBlocked(tab) {
    const hint = tabLockHint(tab);
    if (typeof bigText === 'function' && hint) bigText(hint.toUpperCase(), '#b0b8c8');
    const btn = document.querySelector('#tabbar .tabbtn[data-tab="' + tab + '"]');
    if (btn && typeof uiPulse === 'function') uiPulse(btn, 'tab-deny');
    if (typeof sfx !== 'undefined' && sfx.pick) sfx.pick();
  }

  function onMenuEnter() {
    applyTabLocks();
    setTimeout(drainGuideQueue, 400);
  }

  function onWorldClear(prevUnlocked, nextUnlocked) {
    const fresh = featuresNewlyUnlocked(prevUnlocked, nextUnlocked);
    if (fresh.length) {
      setTimeout(() => playFeatureUnlocks(fresh), 600);
    } else {
      onMenuEnter();
    }
  }

  function onShopOpened() {
    if (!hasGuide('shop_intro') && isFeatureUnlocked('shop')) {
      guideQueue.push('shop_intro');
      setTimeout(drainGuideQueue, 350);
    }
    if (!hasGuide('pet_recruit') && isFeatureUnlocked('pet_recruit')) {
      guideQueue.push('pet_recruit');
      setTimeout(drainGuideQueue, 500);
    }
  }

  function init() {
    loadFlags();
    migrateVeterans();
    applyTabLocks();
    setTimeout(maybeFirstPlayGuide, 800);
  }

  window.isFeatureUnlocked = isFeatureUnlocked;
  window.isTabUnlocked = isTabUnlocked;
  window.petRecruitUnlocked = petRecruitUnlocked;
  window.Onboarding = {
    init,
    onMenuEnter,
    onWorldClear,
    onShopOpened,
    onTabBlocked,
    applyTabLocks,
    markGuide,
    hasGuide,
    drainGuideQueue,
    tabLockHint,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }
})();
