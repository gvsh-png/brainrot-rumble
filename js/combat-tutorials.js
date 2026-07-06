'use strict';
// In-run combat tutorials — reuses #guide-overlay during ST.PLAY / ST.LEVELUP.

(function () {
  const LS_KEY = 'br_combat_guide';
  let done = new Set();
  let active = null;
  let queue = [];
  let runStarted = false;
  let elevatedEl = null;

  function load() {
    try {
      done = new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]'));
    } catch (e) {
      done = new Set();
    }
  }
  function save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify([...done]));
      if (window.markDirty) window.markDirty();
    } catch (e) {}
  }
  function mark(id) {
    if (!id) return;
    done.add(id);
    save();
  }
  function has(id) {
    return done.has(id);
  }

  function overlay() {
    return typeof $ === 'function' ? $('guide-overlay') : document.getElementById('guide-overlay');
  }

  function clearElevated() {
    if (elevatedEl) {
      elevatedEl.classList.remove('guide-target-elevated', 'combat-guide-elevated');
      elevatedEl = null;
    }
  }

  function resetCardStyles(card) {
    if (!card) return;
    card.style.left = '';
    card.style.top = '';
    card.style.bottom = '';
    card.style.width = '';
    card.style.transform = '';
  }

  function hide() {
    const ov = overlay();
    if (!ov) return;
    ov.classList.add('hidden');
    ov.classList.remove('active', 'guide-passthrough', 'guide-block-mode', 'guide-tab-target', 'guide-has-target', 'combat-guide');
    const card = ov.querySelector('.guide-card');
    resetCardStyles(card);
    clearElevated();
    active = null;
    window.removeEventListener('resize', reposition);
  }

  function layoutBottomCard(card) {
    if (!card) return;
    resetCardStyles(card);
    card.style.left = '50%';
    card.style.top = 'auto';
    card.style.bottom = 'max(18px, env(safe-area-inset-bottom))';
    card.style.transform = 'translateX(-50%)';
    card.style.width = 'min(340px, calc(100vw - 24px))';
  }

  function reposition() {
    if (!active || active.layout !== 'target' || !active._sel) return;
    const el = document.querySelector(active._sel);
    const ov = overlay();
    if (!el || !ov) return;
    const ring = ov.querySelector('.guide-ring');
    const card = ov.querySelector('.guide-card');
    const finger = ov.querySelector('.guide-finger');
    if (!ring || !card) return;
    resetCardStyles(card);
    const r = el.getBoundingClientRect();
    const pad = Math.max(8, Math.min(14, window.innerWidth * 0.02));
    ring.style.display = '';
    ring.style.left = (r.left - pad) + 'px';
    ring.style.top = (r.top - pad) + 'px';
    ring.style.width = (r.width + pad * 2) + 'px';
    ring.style.height = (r.height + pad * 2) + 'px';
    const cardW = Math.min(card.offsetWidth || 300, window.innerWidth - 24);
    const cardH = card.offsetHeight || 120;
    const margin = Math.max(10, Math.min(16, window.innerWidth * 0.03));
    let cardLeft = Math.max(margin, Math.min(window.innerWidth - cardW - margin, r.left + r.width / 2 - cardW / 2));
    let cardTop = r.top - cardH - margin;
    if (cardTop < margin) cardTop = Math.min(window.innerHeight - cardH - margin, r.bottom + margin);
    card.style.left = cardLeft + 'px';
    card.style.top = cardTop + 'px';
    card.style.width = cardW + 'px';
    if (finger && !finger.classList.contains('hidden')) {
      const above = cardTop < r.top;
      finger.style.left = (r.left + r.width / 2 - 14) + 'px';
      finger.style.top = (above ? r.top - 28 : r.bottom - 6) + 'px';
      finger.style.transform = above ? 'rotate(180deg)' : '';
    }
  }

  function bindTapTarget(el, finish) {
    if (!el) return;
    const handler = (e) => {
      e.stopPropagation();
      cleanup();
      finish();
    };
    const cleanup = () => {
      el.removeEventListener('pointerdown', handler, true);
      el.removeEventListener('touchstart', handler, true);
      el.removeEventListener('mousedown', handler, true);
      el.removeEventListener('click', handler, true);
    };
    el.addEventListener('pointerdown', handler, true);
    el.addEventListener('touchstart', handler, true);
    el.addEventListener('mousedown', handler, true);
    el.addEventListener('click', handler, true);
    return cleanup;
  }

  function show(step) {
    if (!step || has(step.id)) return false;
    if (step.req && !step.req()) return false;
    const el = step.sel ? document.querySelector(step.sel) : null;
    if (step.sel && !el) return false;
    const ov = overlay();
    if (!ov) return false;

    active = step;
    active._sel = step.sel;
    ov.classList.remove('hidden');
    ov.classList.add('active', 'combat-guide');
    ov.classList.toggle('guide-passthrough', !!step.tap || !!step.passthrough);
    ov.classList.toggle('guide-block-mode', !!step.block && !step.passthrough);
    ov.classList.toggle('guide-has-target', !!(step.sel || step.elevate));

    const title = ov.querySelector('.guide-title');
    const text = ov.querySelector('.guide-text');
    const btn = ov.querySelector('.guide-next');
    const finger = ov.querySelector('.guide-finger');
    const ring = ov.querySelector('.guide-ring');
    if (title) title.textContent = step.title || '';
    if (text) text.textContent = step.text || '';
    if (btn) {
      btn.textContent = step.btn || (step.tap ? 'Tap highlighted' : 'Got it');
      btn.classList.toggle('hidden', !!step.tap);
    }
    if (finger) finger.classList.toggle('hidden', !step.tap);
    if (ring) ring.style.display = step.layout === 'target' ? '' : 'none';

    clearElevated();
    const elevateSel = step.elevate || (step.tap && step.sel ? step.sel : null);
    if (elevateSel) {
      const target = document.querySelector(elevateSel);
      if (target) {
        target.classList.add('guide-target-elevated', 'combat-guide-elevated');
        elevatedEl = target;
      }
    }

    let tapCleanup = null;
    function finish() {
      if (tapCleanup) tapCleanup();
      mark(step.id);
      hide();
      setTimeout(drain, 80);
    }

    if (btn) btn.onclick = (e) => { e.stopPropagation(); finish(); };
    if (step.tap && el) tapCleanup = bindTapTarget(el, finish);
    if (step.dismissOnCard && typeof document !== 'undefined') {
      const cards = document.querySelectorAll('#cards .card');
      cards.forEach((card) => {
        const onPick = () => { finish(); };
        card.addEventListener('click', onPick, { once: true });
      });
    }
    ov.onclick = (e) => {
      if (!step.tap && (e.target === ov || e.target.classList.contains('guide-dim'))) finish();
    };

    const card = ov.querySelector('.guide-card');
    if (step.layout === 'target') {
      reposition();
      window.addEventListener('resize', reposition);
    } else {
      layoutBottomCard(card);
    }
    return true;
  }

  const STEPS = {
    combat_move: {
      id: 'combat_move',
      layout: 'bottom',
      block: true,
      title: 'Move to dodge',
      text: 'Drag anywhere to move. You auto-fire at the nearest enemy — positioning is everything.',
      btn: 'Got it',
      req: () => typeof gameMode !== 'undefined' && gameMode !== 'practice',
    },
    combat_dash: {
      id: 'combat_dash',
      layout: 'target',
      sel: '#dashbtn',
      title: 'Dash!',
      text: 'Tap DASH (or Space on desktop) for a short burst of invulnerability. Use it to escape tight spots.',
      tap: true,
      req: () => typeof gameMode !== 'undefined' && gameMode !== 'practice',
    },
    combat_levelup: {
      id: 'combat_levelup',
      layout: 'bottom',
      block: true,
      passthrough: true,
      title: 'Level up',
      text: 'Pick one of three skill cards. Stack upgrades and evolve abilities by taking the same skill again.',
      btn: 'Got it',
      dismissOnCard: true,
      req: () => typeof gameMode !== 'undefined' && gameMode !== 'practice' && !(typeof rushIsActive === 'function' && rushIsActive()),
    },
    combat_lucky: {
      id: 'combat_lucky',
      layout: 'bottom',
      block: true,
      title: 'Lucky blocks',
      text: 'Gold ? blocks spawn on the field. Shoot them open for hearts, magnets, coins, or XP bursts.',
      btn: 'Nice',
      req: () => typeof rushIsActive === 'function' && !rushIsActive(),
    },
    combat_rush_hearts: {
      id: 'combat_rush_hearts',
      layout: 'bottom',
      block: true,
      title: 'Boss Rush sustain',
      text: 'No lucky blocks here — defeated bosses scatter heal hearts. Grab them between fights!',
      btn: 'Understood',
      req: () => typeof rushIsActive === 'function' && rushIsActive(),
    },
    combat_boss: {
      id: 'combat_boss',
      layout: 'bottom',
      block: true,
      title: 'Boss incoming',
      text: 'Watch the arena edge and telegraphed attacks. Big patterns often have wide safe gaps — dodge, don\'t tank.',
      btn: 'Bring it on',
    },
  };

  function drain() {
    if (active) return;
    while (queue.length) {
      const id = queue.shift();
      const step = STEPS[id];
      if (!step || has(id)) continue;
      if (show(step)) return;
    }
  }

  function queueStep(id) {
    if (has(id) || queue.includes(id)) return;
    queue.push(id);
    drain();
  }

  function finishStep(id) {
    if (!active || active.id !== id) return;
    mark(id);
    hide();
    setTimeout(drain, 80);
  }

  function onRunStart() {
    if (runStarted) return;
    runStarted = true;
    setTimeout(() => {
      if (typeof rushIsActive === 'function' && rushIsActive()) queueStep('combat_rush_hearts');
      else queueStep('combat_move');
    }, 1200);
  }

  function onDamaged() {
    queueStep('combat_dash');
  }

  function onLevelUp() {
    queueStep('combat_levelup');
  }

  function onLuckySpawn() {
    queueStep('combat_lucky');
  }

  function onBossIncoming() {
    queueStep('combat_boss');
  }

  function resetRun() {
    runStarted = false;
    queue.length = 0;
    if (active) hide();
  }

  load();

  window.CombatTutorials = {
    onRunStart,
    onDamaged,
    onLevelUp,
    onLuckySpawn,
    onBossIncoming,
    resetRun,
    finishStep,
    has,
    mark,
  };
})();
