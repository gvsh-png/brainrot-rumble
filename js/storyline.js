'use strict';
// Campaign storyline — immersive kid-friendly beats; big twists only on milestone worlds.

(function () {
  const ACTS = [
    { start: 0, end: 10, title: 'PART 1: SWARM ATTACK!', tag: 'Brainrot monsters invade your home!' },
    { start: 11, end: 24, title: 'PART 2: NEW ZONES', tag: 'The swarm spreads to wild new places.' },
    { start: 25, end: 39, title: 'PART 3: DEEP HIVE', tag: 'Tougher bands. Weirder bosses.' },
    { start: 40, end: 49, title: 'PART 4: FINAL FIGHT', tag: 'Stop the hive mind for good!' },
  ];

  // Full story scene (twist + ally) every ~5 worlds — not every single one.
  const STORY_MILESTONES = new Set([0, 4, 9, 14, 19, 24, 29, 34, 39, 44, 49]);

  const QUICK_INTROS = [
    'The swarm is here. Time to fight!',
    'New zone, new monsters. Let\'s go!',
    'Clear the waves and beat the boss!',
    'Stay sharp. They come in big groups!',
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
    'No wave breaks. Just you and the swarm.',
    'Bosses show up on a timer. Good luck!',
  ];

  const CHAL_OUTRO = [
    'CHALLENGER BEAT! You\'re awesome!',
    'Fifteen minutes survived. Legend!',
    'That zone fears you now.',
  ];

  const ZONE_ATMOSPHERE = {
    grass: ['Sunny fields used to be peaceful.', 'Now bugs crawl out from every bush.'],
    citrus: ['Salt air and orange groves.', 'The coast crawls with brainrot bugs.'],
    forest: ['Tall trees block the sun.', 'Something buzzes in the branches above.'],
    glacier: ['Cold wind bites your face.', 'Frozen ground cracks under swarm feet.'],
    circo: ['Bright tents and loud music.', 'The circus turned into a bug trap!'],
    autumn: ['Leaves fall like orange snow.', 'The woods smell like smoke and bugs.'],
    swamp: ['Mud sucks at your boots.', 'Glowing eyes watch from the reeds.'],
    sky: ['Clouds float below your feet.', 'Flying swarms block the sun.'],
    crystal: ['Purple crystals hum with power.', 'The cave echoes with chittering.'],
    volcano: ['Heat rises from cracked stone.', 'Lava bugs burst from the ash.'],
    dirt: ['Deep tunnels go on forever.', 'The hive dug in down here.'],
  };

  const ZONE_VICTORY = {
    grass: ['Birds sing again over the hills.'],
    citrus: ['The tide washes bug goo away.'],
    forest: ['Fruit trees stand tall once more.'],
    glacier: ['Ice sparkles clean and bright.'],
    circo: ['The tents fold up. Show is over!'],
    autumn: ['A warm breeze blows the bugs away.'],
    swamp: ['Frogs croak like they own the place again.'],
    sky: ['Clouds part and the sun returns.'],
    crystal: ['Crystals glow a calm soft purple.'],
    volcano: ['The rumbling finally stops.'],
    dirt: ['Dust settles. The tunnels go quiet.'],
  };

  // Rare plot surprises — only on milestone worlds (simple, age ~10).
  const MILESTONE_TWISTS = {
    0: 'The grasslands are overrun. You\'re the last hero left!',
    4: 'Surprise! The circus boss tricks you with a fake-out attack!',
    9: 'The dirt boss was just the warm-up. The REAL hive is ahead!',
    14: 'The swarm built a maze to trap you. Don\'t get cornered!',
    19: 'Twist! Friendly bugs were brainwashed. Free them by winning!',
    24: 'A whole new biome… and the swarm already moved in.',
    29: 'The hive sends a double boss. Beat both waves!',
    34: 'Time feels weird here. Waves come faster!',
    39: 'The swarm almost stole the map. Take it back!',
    44: 'Whoa! The hive copied your best move!',
    49: 'This is it. Beat the hive mind and save everyone!',
  };

  const MILESTONE_ALLY_LINES = {
    0: 'Gianni steps up. The fight begins!',
    3: 'Il Cecchino joins! Snipes from far away.',
    8: 'Il Professore arrives! Extra XP help.',
    10: 'Il Campione joins! Boss slayer mode.',
    7: 'Swarm Scout radios in. Knows the hive routes.',
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

  const EXT_ZONE_HOOKS = [
    ['Strange lights flicker across the zone.', 'The swarm left claw marks on everything.'],
    ['The air tastes like static and metal.', 'Bug tracks lead deeper into danger.'],
    ['You hear clicking from every direction.', 'This place was not built for humans.'],
    ['Walls pulse like they are alive.', 'The hive claimed this sector fast.'],
    ['Gravity feels a little bit wrong here.', 'Swarm scouts already spotted you.'],
  ];

  const VIS_EFFECTS = ['spores', 'rain', 'embers', 'sparks', 'void', 'frost', 'toxic', 'static'];

  function actFor(wi) {
    for (const a of ACTS) if (wi >= a.start && wi <= a.end) return a;
    return ACTS[ACTS.length - 1];
  }

  function pick(arr, wi) {
    return arr[(wi * 5 + 2) % arr.length];
  }

  function atmosphereFor(wi, world) {
    const id = world && world.id ? world.id : '';
    if (ZONE_ATMOSPHERE[id]) return ZONE_ATMOSPHERE[id];
    const nm = world && world.name ? world.name : ('Zone ' + (wi + 1));
    const hook = EXT_ZONE_HOOKS[wi % EXT_ZONE_HOOKS.length];
    return [nm + ' feels dangerous the moment you arrive.', hook[1]];
  }

  function victoryFor(wi, world) {
    const id = world && world.id ? world.id : '';
    if (ZONE_VICTORY[id]) return ZONE_VICTORY[id][0];
    const nm = world && world.name ? world.name : ('Zone ' + (wi + 1));
    return nm + ' is safe again, for now.';
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
    const midBoss = world && world.bosses && world.bosses.length > 1
      ? world.bosses[0].name
      : null;
    const ally = allyForWorld(wi);
    const milestone = isMilestone(wi);
    const twist = MILESTONE_TWISTS[wi] || null;
    const allyLine = MILESTONE_ALLY_LINES[wi] || (ally ? ally.name + ' joins the team!' : null);
    const atmo = atmosphereFor(wi, world);
    const victory = victoryFor(wi, world);

    if (typeof buildStoryScenes === 'function') {
      const sc = buildStoryScenes(wi, world, { name, boss, midBoss, milestone, twist, allyLine, act });
      return Object.assign({
        act, milestone,
        vis: sc.cineFx || VIS_EFFECTS[wi % VIS_EFFECTS.length],
        cineFx: sc.cineFx || VIS_EFFECTS[wi % VIS_EFFECTS.length],
        allyChar: ally, allyReveal: !!ally,
        heroLine: wi === 0 ? 'You vs the whole swarm. Go!' : null,
        zoneName: name,
        introDur: sc.introDur,
        outroDur: sc.outroDur,
        chalIntroDur: sc.chalIntroDur,
        chalOutroDur: sc.chalOutroDur,
      }, sc);
    }

    const chalIntroBeats = [
      { t0: 0.3, t1: 3.0, y: 0.18, text: 'CHALLENGER: ' + name, big: true, title: true },
      { t0: 1.4, t1: 4.6, y: 0.38, text: atmo[0], dim: true },
      { t0: 3.0, t1: 6.2, y: 0.54, text: pick(CHAL_INTRO, wi) },
      { t0: 5.0, t1: 8.4, y: 0.72, text: 'Boss at 5, 10, 15, and 20 min!', dim: true },
    ];

    const chalOutroBeats = [
      { t0: 0.3, t1: 3.0, y: 0.2, text: 'CHALLENGER WIN!', big: true, title: true },
      { t0: 1.2, t1: 4.4, y: 0.4, text: pick(CHAL_OUTRO, wi) },
      { t0: 3.0, t1: 6.0, y: 0.58, text: victory, dim: true },
      { t0: 5.0, t1: 8.2, y: 0.76, text: 'Story mode still has more zones!', dim: true },
    ];

    let introBeats;
    let outroBeats;

    if (milestone) {
      introBeats = [
        { t0: 0.2, t1: 3.0, y: 0.12, text: isActStart(wi) ? act.title : ('WORLD ' + (wi + 1)), big: true, title: true },
      ];
      if (isActStart(wi)) {
        introBeats.push({ t0: 0.8, t1: 4.0, y: 0.22, text: act.tag, dim: true });
      }
      introBeats.push({ t0: 1.8, t1: 5.2, y: 0.36, text: name, big: true });
      introBeats.push({ t0: 3.0, t1: 6.4, y: 0.48, text: atmo[0], dim: true });
      if (twist) introBeats.push({ t0: 4.2, t1: 8.0, y: 0.58, text: twist });
      if (midBoss) introBeats.push({ t0: 5.8, t1: 9.2, y: 0.68, text: 'Watch out for ' + midBoss + ' at wave 5!', dim: true });
      if (allyLine) introBeats.push({ t0: 7.0, t1: 11.0, y: 0.76, text: allyLine, ally: true });
      introBeats.push({ t0: 9.0, t1: 13.0, y: 0.88, text: 'Beat ' + boss + ' to clear this zone!', dim: true });
    } else {
      introBeats = [
        { t0: 0.2, t1: 2.8, y: 0.14, text: 'WORLD ' + (wi + 1), big: true, title: true },
        { t0: 1.0, t1: 4.0, y: 0.28, text: name, big: true },
        { t0: 2.2, t1: 5.4, y: 0.42, text: atmo[0], dim: true },
        { t0: 3.6, t1: 6.8, y: 0.54, text: atmo[1] },
        { t0: 5.0, t1: 8.0, y: 0.66, text: 'Your mission: beat ' + boss + '!' },
      ];
      if (ally && allyLine) {
        introBeats.push({ t0: 6.4, t1: 9.2, y: 0.78, text: allyLine, ally: true });
      } else {
        introBeats.push({ t0: 6.8, t1: 9.4, y: 0.8, text: pick(QUICK_INTROS, wi), dim: true });
      }
    }

    if (milestone) {
      outroBeats = [
        { t0: 0.2, t1: 3.0, y: 0.16, text: name + ' SAVED!', big: true, title: true },
        { t0: 1.2, t1: 4.4, y: 0.32, text: boss + ' is defeated!' },
        { t0: 2.6, t1: 6.0, y: 0.46, text: victory },
        { t0: 4.2, t1: 7.6, y: 0.58, text: wi < 49 ? 'But the swarm is already heading to the next zone…' : 'The hive mind is the last fight!' },
        { t0: 6.0, t1: 10.5, y: 0.72, text: wi < 49 ? 'World ' + (wi + 2) + ' needs you next!' : 'Go win it all!', dim: true },
      ];
    } else {
      outroBeats = [
        { t0: 0.2, t1: 2.8, y: 0.18, text: name + ' cleared!', big: true, title: true },
        { t0: 1.0, t1: 4.0, y: 0.34, text: boss + ' goes down!' },
        { t0: 2.4, t1: 5.6, y: 0.48, text: victory, dim: true },
        { t0: 4.0, t1: 7.0, y: 0.62, text: pick(QUICK_WINS, wi) },
        { t0: 5.8, t1: 8.6, y: 0.78, text: wi < 49 ? 'World ' + (wi + 2) + ' is waiting…' : 'Final zone next!', dim: true },
      ];
    }

    return {
      act,
      milestone,
      vis: VIS_EFFECTS[wi % VIS_EFFECTS.length],
      introBeats,
      outroBeats,
      chalIntroBeats,
      chalOutroBeats,
      allyChar: ally,
      allyReveal: !!ally,
      heroLine: wi === 0 ? 'You vs the whole swarm. Go!' : null,
      zoneName: name,
      introDur: milestone ? 14 : 9.5,
      outroDur: milestone ? 11 : 8.5,
    };
  }

  window.getWorldStory = worldStory;
})();
