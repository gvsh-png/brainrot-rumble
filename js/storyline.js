'use strict';
// Campaign storyline — short kid-friendly beats; big story moments every ~5 worlds.

(function () {
  const ACTS = [
    { start: 0, end: 10, title: 'PART 1 — SWARM ATTACK!', tag: 'Brainrot monsters invade your home!' },
    { start: 11, end: 24, title: 'PART 2 — NEW ZONES', tag: 'The swarm spreads to wild new places.' },
    { start: 25, end: 39, title: 'PART 3 — DEEP HIVE', tag: 'Tougher bands. Weirder bosses.' },
    { start: 40, end: 49, title: 'PART 4 — FINAL FIGHT', tag: 'Stop the hive mind for good!' },
  ];

  // Full story scene (twist + ally) every ~5 worlds — not every single one.
  const STORY_MILESTONES = new Set([0, 4, 9, 14, 19, 24, 29, 34, 39, 44, 49]);

  const QUICK_INTROS = [
    'The swarm is here. Time to fight!',
    'New zone, new monsters. Let\'s go!',
    'Clear the waves and beat the boss!',
    'Stay sharp — they come in big groups!',
    'You can do this. Keep moving!',
  ];

  const QUICK_WINS = [
    'Nice! Zone saved!',
    'Boss down. High five!',
    'The swarm backs off… for now.',
    'You\'re getting stronger!',
    'On to the next place!',
  ];

  const CHAL_INTRO = [
    'CHALLENGER! Survive 15 minutes.',
    'No wave breaks — just you and the swarm.',
    'Bosses show up on a timer. Good luck!',
  ];

  const CHAL_OUTRO = [
    'CHALLENGER BEAT! You\'re awesome!',
    'Fifteen minutes survived. Legend!',
    'That zone fears you now.',
  ];

  // Rare plot surprises — only on milestone worlds (simple, age ~10).
  const MILESTONE_TWISTS = {
    0: 'The grasslands are overrun. You\'re the last hero left!',
    4: 'Surprise! The circus boss tricks you with a fake-out attack!',
    9: 'The dirt boss was just the warm-up. The REAL hive is ahead!',
    14: 'The swarm built a maze to trap you. Don\'t get cornered!',
    19: 'Twist! Friendly bugs were brainwashed — free them by winning!',
    24: 'A whole new biome… and the swarm already moved in.',
    29: 'The hive sends a double boss. Beat both waves!',
    34: 'Time feels weird here. Waves come faster!',
    39: 'The swarm almost stole the map. Take it back!',
    44: 'Whoa — the hive copied your best move!',
    49: 'This is it. Beat the hive mind and save everyone!',
  };

  const MILESTONE_ALLY_LINES = {
    0: 'Gianni steps up. The fight begins!',
    3: 'Il Cecchino joins! Snipes from far away.',
    8: 'Il Professore arrives! Extra XP help.',
    10: 'Il Campione joins! Boss slayer mode.',
    7: 'Swarm Scout radios in — knows the hive routes.',
    9: 'Hive Knight shields the team!',
    11: 'Rot Weaver threads power into your shots.',
    14: 'Void Runner slips past swarm blocks.',
    17: 'Coral Guard tanks the front line.',
    21: 'Storm Caller calls lightning backup.',
    25: 'Ember Sage burns a path forward.',
    29: 'Frost Warden slows the swarm down.',
    34: 'Chrono Mite speeds up your dash!',
    39: 'Omega Pilot flies the dangerous runs.',
    44: 'Swarm Sovereign knows the hive secrets.',
    49: 'Final Vector joins for the last stand!',
  };

  const VIS_EFFECTS = ['spores', 'rain', 'embers', 'sparks', 'void', 'frost', 'toxic', 'static'];

  function actFor(wi) {
    for (const a of ACTS) if (wi >= a.start && wi <= a.end) return a;
    return ACTS[ACTS.length - 1];
  }

  function pick(arr, wi) {
    return arr[(wi * 5 + 2) % arr.length];
  }

  function allyForWorld(wi) {
    if (typeof CHARACTERS === 'undefined') return null;
    const c = CHARACTERS.find(ch => ch.worldUnlock === wi);
    if (!c) return null;
    return { id: c.id, name: c.name };
  }

  function isMilestone(wi) {
    return STORY_MILESTONES.has(wi);
  }

  function isActStart(wi) {
    return ACTS.some(a => a.start === wi);
  }

  function worldStory(wi, world) {
    const act = actFor(wi);
    const name = world && world.name ? world.name : ('WORLD ' + (wi + 1));
    const boss = world && world.bosses && world.bosses.length
      ? world.bosses[world.bosses.length - 1].name
      : 'THE BOSS';
    const ally = allyForWorld(wi);
    const milestone = isMilestone(wi);
    const twist = MILESTONE_TWISTS[wi] || null;
    const allyLine = MILESTONE_ALLY_LINES[wi] || (ally ? ally.name + ' joins the team!' : null);

    let introBeats;
    let outroBeats;

    if (milestone) {
      introBeats = [
        { t0: 0.15, t1: 2.2, y: 0.14, text: isActStart(wi) ? act.title : ('WORLD ' + (wi + 1)), big: true },
      ];
      if (isActStart(wi)) {
        introBeats.push({ t0: 0.4, t1: 2.6, y: 0.24, text: act.tag, dim: true });
      }
      introBeats.push({ t0: 1.2, t1: 3.4, y: 0.38, text: name });
      if (twist) introBeats.push({ t0: 2.0, t1: 4.8, y: 0.52, text: twist });
      if (allyLine) introBeats.push({ t0: 3.0, t1: 5.8, y: 0.66, text: allyLine, ally: true });
      introBeats.push({ t0: 4.0, t1: 6.5, y: 0.82, text: 'Beat ' + boss + ' to clear this zone!', dim: true });
    } else {
      introBeats = [
        { t0: 0.15, t1: 2.0, y: 0.24, text: 'WORLD ' + (wi + 1) + ' — ' + name, big: true },
        { t0: 0.7, t1: 2.8, y: 0.5, text: 'Beat ' + boss + '!' },
      ];
      if (ally && allyLine) {
        introBeats.push({ t0: 1.4, t1: 3.4, y: 0.72, text: allyLine, ally: true });
      } else {
        introBeats.push({ t0: 1.5, t1: 3.5, y: 0.76, text: pick(QUICK_INTROS, wi), dim: true });
      }
    }

    if (milestone) {
      outroBeats = [
        { t0: 0.15, t1: 2.4, y: 0.2, text: name + ' — SAVED!', big: true },
        { t0: 0.9, t1: 3.0, y: 0.42, text: boss + ' is defeated!' },
        { t0: 1.8, t1: 4.2, y: 0.58, text: wi < 49 ? 'But the swarm is already heading to the next zone…' : 'The hive mind is the last fight!' },
        { t0: 2.8, t1: 5.5, y: 0.76, text: wi < 49 ? 'World ' + (wi + 2) + ' needs you next!' : 'Go win it all!', dim: true },
      ];
    } else {
      outroBeats = [
        { t0: 0.15, t1: 2.0, y: 0.32, text: name + ' — cleared!', big: true },
        { t0: 0.7, t1: 2.8, y: 0.62, text: pick(QUICK_WINS, wi) },
        { t0: 1.6, t1: 3.4, y: 0.84, text: wi < 49 ? 'World ' + (wi + 2) + ' next!' : 'Final zone next!', dim: true },
      ];
    }

    const chalIntroBeats = [
      { t0: 0.2, t1: 2.5, y: 0.24, text: 'CHALLENGER — ' + name, big: true },
      { t0: 0.9, t1: 3.2, y: 0.5, text: pick(CHAL_INTRO, wi) },
      { t0: 2.0, t1: 4.5, y: 0.78, text: 'Boss at 5, 10, 15, and 20 min!', dim: true },
    ];

    const chalOutroBeats = [
      { t0: 0.2, t1: 2.5, y: 0.28, text: 'CHALLENGER WIN!', big: true },
      { t0: 0.9, t1: 3.2, y: 0.56, text: pick(CHAL_OUTRO, wi) },
      { t0: 2.0, t1: 4.2, y: 0.82, text: 'Story mode still has more zones!', dim: true },
    ];

    return {
      act,
      milestone,
      vis: VIS_EFFECTS[wi % VIS_EFFECTS.length],
      introBeats,
      outroBeats,
      chalIntroBeats,
      chalOutroBeats,
      allyChar: ally,
      allyReveal: milestone && !!ally,
      heroLine: wi === 0 ? 'You vs the whole swarm. Go!' : null,
    };
  }

  window.getWorldStory = worldStory;
})();
