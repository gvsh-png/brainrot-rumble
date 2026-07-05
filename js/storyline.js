'use strict';
// Campaign storyline — per-world beats for cutscenes (W1–W50).

(function () {
  const ACTS = [
    { start: 0, end: 10, title: 'ACT I — THE INVASION', tag: 'The swarm awakens on your homeworld.' },
    { start: 11, end: 24, title: 'ACT II — THE HIVE SPREADS', tag: 'Brainrot colonizes stranger biomes.' },
    { start: 25, end: 39, title: 'ACT III — SECTOR SIEGE', tag: 'Every band fights back alone.' },
    { start: 40, end: 49, title: 'ACT IV — FINAL SWARM', tag: 'The hive mind reveals itself.' },
  ];

  const INTRO_HOOKS = [
    'Scouts report movement on the horizon.',
    'The ground trembles — they are already here.',
    'Radio silence. Then the chittering starts.',
    'A new breed claws out of the fog.',
    'Survivors whisper: the swarm evolved again.',
    'Your map marks this zone RED for a reason.',
    'The air tastes wrong. Brainrot is near.',
    'They remember you. They want revenge.',
  ];

  const OUTRO_HOOKS = [
    'The swarm retreats… but their eggs remain.',
    'You bought time. The hive did not die.',
    'Sensors detect another wave forming.',
    'Victory is loud. Silence is worse.',
    'The next sector already knows your name.',
    'You carve a path — the hive seals it behind you.',
    'One queen falls. A thousand mites cheer.',
    'The story continues deeper in the hive.',
  ];

  const CHAL_INTRO = [
    'CHALLENGER MODE — NO WAVES. ONLY TIME.',
    'FIFTEEN MINUTES. INFINITE SWARM.',
    'SURVIVE THE TIMER. HUNT THE BOSSES.',
  ];

  const CHAL_OUTRO = [
    'CHALLENGER CLEARED — THE SECTOR FEAR YOU.',
    'TIME BEAT. THE SWARM BOWS… FOR NOW.',
    'LEGEND STATUS: THIS BAND IS YOURS.',
  ];

  const VIS_EFFECTS = ['spores', 'rain', 'embers', 'sparks', 'void', 'frost', 'toxic', 'static'];

  function actFor(wi) {
    for (const a of ACTS) if (wi >= a.start && wi <= a.end) return a;
    return ACTS[ACTS.length - 1];
  }

  function pick(arr, wi, salt) {
    return arr[(wi * 7 + salt) % arr.length];
  }

  function worldStory(wi, world) {
    const act = actFor(wi);
    const name = world && world.name ? world.name : ('WORLD ' + (wi + 1));
    const boss = world && world.bosses && world.bosses.length
      ? world.bosses[world.bosses.length - 1].name
      : 'THE HIVE LORD';
    const mid = world && world.bosses && world.bosses[0]
      ? world.bosses[0].name
      : 'SWARM CAPTAIN';

    const introBeats = [
      { t0: 0.2, t1: 2.8, y: 0.14, text: act.title, big: true },
      { t0: 0.5, t1: 3.2, y: 0.22, text: act.tag, dim: true },
      { t0: 2.6, t1: 6.2, y: 0.38, text: 'WORLD ' + (wi + 1) + ' — ' + name },
      { t0: 4.0, t1: 8.0, y: 0.52, text: pick(INTRO_HOOKS, wi, 1) },
      { t0: 6.0, t1: 10.5, y: 0.64, text: mid + ' leads the first wave.' },
      { t0: 8.0, t1: 12.5, y: 0.76, text: 'Defeat ' + boss + ' to break this band.' },
      { t0: 10.5, t1: 13.5, y: 0.88, text: 'Clear all waves. Do not let the swarm nest.', dim: true },
    ];

    const outroBeats = [
      { t0: 0.2, t1: 3.0, y: 0.16, text: name + ' — CLEARED', big: true },
      { t0: 1.0, t1: 4.5, y: 0.30, text: pick(OUTRO_HOOKS, wi, 2) },
      { t0: 3.0, t1: 6.5, y: 0.44, text: boss + ' falls. The band scatters.' },
      { t0: 5.0, t1: 8.5, y: 0.58, text: wi < 49 ? 'World ' + (wi + 2) + ' pulses on your scanner.' : 'Only the FINAL SWARM remains.' },
      { t0: 7.0, t1: 10.5, y: 0.72, text: wi < 49 ? 'The hive routes reinforcements ahead.' : 'End the hive mind. End the war.' },
      { t0: 9.0, t1: 11.8, y: 0.86, text: 'You are the swarm\'s nightmare now.', dim: true },
    ];

    const chalIntroBeats = [
      { t0: 0.3, t1: 3.0, y: 0.20, text: 'CHALLENGER — ' + name, big: true },
      { t0: 1.2, t1: 4.5, y: 0.36, text: pick(CHAL_INTRO, wi, 3) },
      { t0: 3.0, t1: 6.5, y: 0.52, text: 'Boss milestones at 5 / 10 / 15 / 20 min.' },
      { t0: 5.0, t1: 7.5, y: 0.68, text: mid + ' hunts you from minute one.' },
      { t0: 6.2, t1: 7.8, y: 0.82, text: 'No mercy. No waves. Only the swarm.', dim: true },
    ];

    const chalOutroBeats = [
      { t0: 0.3, t1: 3.2, y: 0.22, text: 'CHALLENGER — ' + name, big: true },
      { t0: 1.5, t1: 4.8, y: 0.38, text: pick(CHAL_OUTRO, wi, 4) },
      { t0: 3.5, t1: 7.0, y: 0.54, text: 'Fifteen minutes survived. Every boss crushed.' },
      { t0: 5.5, t1: 8.5, y: 0.70, text: 'The hive marks you DANGEROUS.' },
      { t0: 7.0, t1: 8.8, y: 0.84, text: 'Story bands still await beyond the timer.', dim: true },
    ];

    return {
      act,
      vis: VIS_EFFECTS[wi % VIS_EFFECTS.length],
      introBeats,
      outroBeats,
      chalIntroBeats,
      chalOutroBeats,
      heroLine: wi === 0 ? 'A lone survivor stands against the first wave.' : 'You return. The swarm remembers.',
    };
  }

  window.getWorldStory = worldStory;
})();
