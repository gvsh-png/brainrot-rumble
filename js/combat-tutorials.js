'use strict';
// In-run combat tutorials — reuses #guide-overlay during ST.PLAY / ST.LEVELUP.

(function () {
  const LS_KEY = 'br_combat_guide';
  let done = new Set();
  let active = null;
  let queue = [];
  let runStarted = false;

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

  function hide() {
    const ov = overlay();
    if (!ov) return;
    ov.classList.add('hidden');
    ov.classList.remove('active', 'guide-passthrough', 'guide-block-mode', 'guide-tab-target', 'guide-has-target', 'combat-guide');
    active = null;
    window.removeEventListener('resize', reposition);
  }

  function reposition() {
    if (!active || !active._sel) return;
    const el = document.querySelector(active._sel);
    const ov = overlay();
    if (!el || !ov) return;
    const ring = ov.querySelector('.guide-ring');
    const card = ov.querySelector('.guide-card');
    const finger = ov.querySelector('.guide-finger');
    if (!ring || !card) return;
    const r = el.getBoundingClientRect();
    const pad = Math.max(8, Math.min(14, window.innerWidth * 0.02));
    ring.style.left = (r.left - pad) + 'px';
    ring.style.top = (r.top - pad) + 'px';
    ring.style.width = (r.width + pad * 2) + 'px';
    ring.style.height = (r.height + pad * 2) + 'px';
    const cardW = Math.min(card.offsetWidth || 300, window.innerWidth - 24);
    const cardH = card.offsetHeight || 120;
    const margin = Math.max(10, Math.min(16, window.innerWidth * 0.03));
    let cardLeft = Math.max(margin, Math.min(window.innerWidth - cardW - margin, r.left + r.width / 2 - cardW / 2));
    let cardTop = r.bottom + margin;
    if (cardTop + cardH > window.innerHeight - margin) cardTop = Math.max(margin, r.top - cardH - margin);
    card.style.left = cardLeft + 'px';
    card.style.top = cardTop + 'px';
    card.style.width = cardW + 'px';
    if (finger && !finger.classList.contains('hidden')) {
      finger.style.left = (r.left + r.width / 2 - 14) + 'px';
      finger.style.top = (r.bottom - 6) + 'px';
      finger.style.transform = '';
    }
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
    ov.classList.toggle('guide-passthrough', !!step.tap);
    ov.classList.toggle('guide-block-mode', !step.tap);

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
    if (ring) ring.style.display = step.sel ? '' : 'none';

    function finish() {
      mark(step.id);
      hide();
      setTimeout(drain, 80);
    }

    if (btn) btn.onclick = (e) => { e.stopPropagation(); finish(); };
    if (step.tap && el) {
      const onTap = (e) => {
        e.stopPropagation();
        el.removeEventListener('click', onTap, true);
        finish();
      };
      el.addEventListener('click', onTap, true);
    }
    ov.onclick = (e) => {
      if (!step.tap && (e.target === ov || e.target.classList.contains('guide-dim'))) finish();
    };

    if (step.sel) {
      reposition();
      window.addEventListener('resize', reposition);
    } else if (ring) {
      ring.style.display = 'none';
      const card = ov.querySelector('.guide-card');
      if (card) {
        card.style.left = '50%';
        card.style.top = 'auto';
        card.style.bottom = 'max(18px, env(safe-area-inset-bottom))';
        card.style.transform = 'translateX(-50%)';
        card.style.width = 'min(340px, calc(100vw - 24px))';
      }
    }
    return true;
  }

  const STEPS = {
    combat_move: {
      id: 'combat_move',
      title: 'Move to dodge',
      text: 'Drag anywhere to move. You auto-fire at the nearest enemy — positioning is everything.',
      btn: 'Got it',
      req: () => typeof gameMode !== 'undefined' && gameMode !== 'practice',
    },
    combat_dash: {
      id: 'combat_dash',
      sel: '#dashbtn',
      title: 'Dash!',
      text: 'Tap DASH (or Space on desktop) for a short burst of invulnerability. Use it to escape tight spots.',
      tap: true,
      req: () => typeof gameMode !== 'undefined' && gameMode !== 'practice',
    },
    combat_levelup: {
      id: 'combat_levelup',
      sel: '#levelup .cards',
      title: 'Level up',
      text: 'Pick one of three skill cards. Stack upgrades and evolve abilities by taking the same skill again.',
      btn: 'Choose a card',
      req: () => typeof gameMode !== 'undefined' && gameMode !== 'practice' && !(typeof rushIsActive === 'function' && rushIsActive()),
    },
    combat_lucky: {
      id: 'combat_lucky',
      title: 'Lucky blocks',
      text: 'Gold ? blocks spawn on the field. Shoot them open for hearts, magnets, coins, or XP bursts.',
      btn: 'Nice',
      req: () => typeof rushIsActive === 'function' && !rushIsActive(),
    },
    combat_rush_hearts: {
      id: 'combat_rush_hearts',
      title: 'Boss Rush sustain',
      text: 'No lucky blocks here — defeated bosses scatter heal hearts. Grab them between fights!',
      btn: 'Understood',
      req: () => typeof rushIsActive === 'function' && rushIsActive(),
    },
    combat_boss: {
      id: 'combat_boss',
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
    has,
    mark,
  };
})();
