'use strict';
// Campaign storyline — immersive kid-friendly beats; big twists only on milestone worlds.

(function () {
  const ACTS = [
    { start: 0, end: 10, title: 'PART 1 — SWARM ATTACK!', tag: 'Brainrot monsters invade your home!' },
    { start: 11, end: 24, title: 'PART 2 — NEW ZONES', tag: 'The swarm spreads to wild new places.' },
    { start: 25, end: 39, title: 'PART 3 — DEEP HIVE', tag: 'Tougher bands. Weirder bosses.' },
    { start: 40, end: 49, title: 'PART 4 — FINAL FIGHT', tag: 'Stop the hive mind for good!' },
  ];

  const ARC_SIZE = 5;
  const ARC_COUNT = 10; // Worlds 1–50 in ten five-world chapters.

  // Chapter headers — one per 5-world block.
  const ARC_CHAPTERS = [
    { title: 'PART 1 — SWARM ATTACK!', tag: 'Brainrot monsters invade your home!', endMsg: 'Act 2 begins now!' },
    { title: 'PART 1 — WILD DEPTHS', tag: 'The swarm spreads through nature\'s extremes.', endMsg: 'The hive stirs underground…' },
    { title: 'PART 2 — HIVE DOORSTEP', tag: 'The dirt depths open — new sectors beyond.', endMsg: 'Strange lights blink on the map…' },
    { title: 'PART 2 — OUTER SECTORS', tag: 'Procedural zones pulse with brainrot.', endMsg: 'The rift zones call you deeper.' },
    { title: 'PART 2 — RIFT ZONES', tag: 'Reality bends. The swarm adapts.', endMsg: 'You\'re nearing the hive edge.' },
    { title: 'PART 3 — HIVE EDGE', tag: 'Tougher bands. Weirder bosses.', endMsg: 'The deep hive opens below.' },
    { title: 'PART 3 — DEEP HIVE', tag: 'Walls pulse like they\'re alive.', endMsg: 'Core sectors ahead — stay sharp!' },
    { title: 'PART 3 — CORE SECTORS', tag: 'The swarm fights like it knows you.', endMsg: 'The void ring surrounds the throne.' },
    { title: 'PART 4 — VOID RING', tag: 'Almost there. Don\'t stop now.', endMsg: 'The final push begins!' },
    { title: 'PART 4 — LAST STAND', tag: 'Stop the hive mind for good!', endMsg: 'You did it. The swarm is beaten!' },
  ];

  const CHAPTER_TEASES = [
    null,
    'Ash settles — tunnel mouths open below. The DIRT DEPTHS beckon…',
    'The hive map unlocks — glowing sectors stretch to the horizon!',
    'Rift energy spikes — the outer ring is breached!',
    'Gravity warps — you\'re at the hive\'s front door.',
    'Chittering echoes from miles below. The deep hive awaits.',
    'Organic walls pulse faster. The core is close.',
    'Static fills the air — the void ring surrounds the throne.',
    'Every boss was practice. The hive mind is next.',
    'Victory! But will the swarm stay down…?',
  ];

  // Connected Part 1 storyline — Worlds 1–5 (chunk 0).
  const ACT1_ARC = [
    {
      peace: 'Green hills stretch as far as you can see.',
      invasion: 'Brainrot bugs pour from every bush!',
      chaos: 'Villagers flee — the grasslands are overrun!',
      hero: 'Gianni steps up. The fight for Part 1 begins!',
      outVictory: 'GRASSLANDS — SAVED!',
      outCelebrate: 'Birds sing again over the hills.',
      outTease: 'But Sahur\'s swarm scuttles east toward the coast…',
      outNext: 'WORLD 2 — CITRUS COAST awaits!',
    },
    {
      peace: 'Salt air. Orange trees. A quiet morning on the shore.',
      invasion: 'Sahur\'s swarm hit the CITRUS COAST — slime on every beach!',
      chaos: 'Tourists scatter as bugs crawl out of the tide pools!',
      hero: 'Push them back before they nest in the sand!',
      outVictory: 'CITRUS COAST — SAVED!',
      outCelebrate: 'The tide washes bug goo off the orange groves.',
      outTease: 'Footprints lead inland — the swarm fled to the forest!',
      outNext: 'WORLD 3 — FORESTA FRUTOSA is next!',
    },
    {
      peace: 'Towering fruit trees sway in a warm breeze.',
      invasion: 'The swarm pushed into FORESTA FRUTOSA!',
      chaos: 'Rotten fruit rains down. Bugs hide in every branch!',
      hero: 'Burn a path through the canopy before rot spreads!',
      outVictory: 'FORESTA FRUTOSA — SAVED!',
      outCelebrate: 'Monkeys toss fresh fruit — the woods breathe again.',
      outTease: 'Frost tracks on the northern trail… they fled to the ice!',
      outNext: 'WORLD 4 — GELATO GLACIER lies ahead!',
    },
    {
      peace: 'Crystal ice glitters under a pale arctic sun.',
      invasion: 'Brainrot cracks spread across GELATO GLACIER!',
      chaos: 'Frozen bugs burst from the ice shelf!',
      hero: 'Il Cecchino joins! Snipe them from the ridge!',
      outVictory: 'GELATO GLACIER — SAVED!',
      outCelebrate: 'Penguins slide on clean ice while tourists applaud.',
      outTease: 'Distant spotlights flicker on the horizon… a circus?',
      outNext: 'WORLD 5 — CIRCO BRAINROTTO. Act 1 finale!',
    },
    {
      peace: 'Spotlights warm the big top. Laughter fills the tents.',
      invasion: 'CIRCO BRAINROTTO — the swarm\'s last stand in Part 1!',
      chaos: 'Trap doors snap! Fake-out attacks from every direction!',
      hero: 'Beat IL GRAN PAGLIACCIO and end Act 1!',
      outVictory: 'CIRCO BRAINROTTO — SAVED!',
      outCelebrate: 'The crowd ROARS! Confetti rains as the circus returns to normal.',
      outTease: 'Part 1 is over — but the swarm dug deeper underground…',
      outNext: 'WORLD 6 — AUTUMN WOODS. A whole new chapter!',
    },
  ];

  // Worlds 6–10 (chunk 1) — autumn through volcano.
  const ARC2 = [
    {
      peace: 'Orange leaves drift down. Campfires crackle in quiet woods.',
      invasion: 'The swarm tunneled up from below — AUTUMN WOODS is crawling with bugs!',
      chaos: 'Leaves rot mid-air as brainrot swarms every trail!',
      hero: 'Scout the camps and burn a path through!',
      outVictory: 'AUTUMN WOODS — SAVED!',
      outCelebrate: 'Campers wave flags — no more bugs in the soup!',
      outTease: 'Wet footprints head south… the SWAMP stirs.',
      outNext: 'WORLD 7 — SWAMP lies ahead!',
    },
    {
      peace: 'Fog hangs low over green reeds and still water.',
      invasion: 'Toxic bubbles rise — brainrot owns the SWAMP!',
      chaos: 'Glowing eyes watch from the reeds. Now they charge!',
      hero: 'Drain the rot before it spreads to the rivers!',
      outVictory: 'SWAMP — SAVED!',
      outCelebrate: 'Fireflies blink in relief. The swamp smells normal again.',
      outTease: 'Wings beat overhead — they took to the SKY!',
      outNext: 'WORLD 8 — SKYLAND floats above!',
    },
    {
      peace: 'Cloud islands drift in a calm blue sky.',
      invasion: 'Flying brainrot blocks out the sun over SKYLAND!',
      chaos: 'Swarm scouts dive from every cloud — nowhere to hide!',
      hero: 'Clear the air lanes before they nest on the islands!',
      outVictory: 'SKYLAND — SAVED!',
      outCelebrate: 'Cloud people wave from the islands above. You\'re a hero!',
      outTease: 'A purple glow pulses from caves below the clouds…',
      outNext: 'WORLD 9 — CRYSTAL CAVES awaits!',
    },
    {
      peace: 'Purple crystals hum with a soft, peaceful light.',
      invasion: 'Brainrot creeps up the walls of CRYSTAL CAVES!',
      chaos: 'Shards crack and fall — bugs burst from every fracture!',
      hero: 'Shatter the corruption before the caves collapse!',
      outVictory: 'CRYSTAL CAVES — SAVED!',
      outCelebrate: 'Crystal sprites hum a thank-you song as the caves brighten.',
      outTease: 'Heat rises from a crack in the floor — VOLCANO!',
      outNext: 'WORLD 10 — VOLCANO rumbles below!',
    },
    {
      peace: 'Warm stone radiates heat. The caldera looks quiet…',
      invasion: 'Ash and brainrot rain from VOLCANO — the swarm made it their forge!',
      chaos: 'Lava bugs burst from fissures on every side!',
      hero: 'Cool the caldera and crush their last surface stronghold!',
      outVictory: 'VOLCANO — SILENCED!',
      outCelebrate: 'Lava cools to warm stone. Miners cheer your name!',
      outTease: 'Ash clears — tunnel mouths open below. The DIRT DEPTHS beckon…',
      outNext: 'WORLD 11 — DIRT DEPTHS. Part 2 begins!',
    },
  ];

  const STORY_MILESTONES = new Set([0, 4, 9, 14, 19, 24, 29, 34, 39, 44, 49]);

  function arcChunk(wi) { return Math.floor(wi / ARC_SIZE); }
  function arcSlot(wi) { return wi % ARC_SIZE; }
  function isArcWorld(wi) { return wi >= 0 && wi < ARC_COUNT * ARC_SIZE; }
  function isAct1(wi) { return isArcWorld(wi); } // legacy alias

  function getArcLines(wi, world, boss, allyLine) {
    const chunk = arcChunk(wi);
    const slot = arcSlot(wi);
    if (chunk === 0 && ACT1_ARC[slot]) return ACT1_ARC[slot];
    if (chunk === 1 && ARC2[slot]) return ARC2[slot];
    return generateArcLines(wi, world, boss, allyLine);
  }

  function generateArcLines(wi, world, boss, allyLine) {
    const name = world && world.name ? world.name : ('WORLD ' + (wi + 1));
    const atmo = atmosphereFor(wi, world);
    const invasion = invasionLine(wi, world);
    const victory = victoryFor(wi, world);
    const impact = impactFor(wi, world);
    const slot = arcSlot(wi);
    const chunk = arcChunk(wi);
    const prevW = typeof WORLDS !== 'undefined' && wi > 0 ? WORLDS[wi - 1] : null;
    const nextW = typeof WORLDS !== 'undefined' && wi < 49 ? WORLDS[wi + 1] : null;
    const prevNm = prevW ? prevW.name : ('Zone ' + wi);
    const nextNm = nextW ? nextW.name : ('Zone ' + (wi + 2));
    const twist = MILESTONE_TWISTS[wi];
    const peace = slot === 0 && chunk > 0
      ? 'Pushing on from ' + prevNm + ' — ' + name + ' lies ahead.'
      : (atmo[0] || name + ' feels calm… for now.');
    const chaos = twist || atmo[1] || ('The swarm wreaks havoc across ' + name + '!');
    const hero = allyLine || (slot === 4
      ? 'Chapter finale — beat ' + boss + '!'
      : 'Fight through ' + name + ' and win!');
    const tease = slot === 4 && CHAPTER_TEASES[chunk]
      ? CHAPTER_TEASES[chunk]
      : ('Bug tracks lead toward ' + nextNm + '…');
    return {
      peace,
      invasion,
      chaos,
      hero,
      outVictory: name + ' — SAVED!',
      outCelebrate: impact || victory,
      outTease: tease,
      outNext: wi < 49 ? ('WORLD ' + (wi + 2) + ' — ' + nextNm + '!') : 'THE HIVE MIND. Save everyone!',
    };
  }

  function buildArcIntro(wi, world, name, boss, midBoss, ally, allyLine) {
    const chunk = arcChunk(wi);
    const slot = arcSlot(wi);
    const chapter = ARC_CHAPTERS[chunk] || ARC_CHAPTERS[ARC_CHAPTERS.length - 1];
    const arc = getArcLines(wi, world, boss, allyLine);
    const titleText = slot === 0 ? chapter.title : ('WORLD ' + (wi + 1));
    const subText = slot === 0 ? chapter.tag : chapter.title;
    const beats = [
      { t0: 0.2, t1: 3.2, y: 0.12, text: titleText, big: true, title: true },
      { t0: 0.8, t1: 3.8, y: 0.2, text: subText, dim: true },
      { t0: 1.4, t1: 4.6, y: 0.3, text: name, big: true },
      { t0: 2.0, t1: 5.5, y: 0.4, text: arc.peace, dim: true, scene: 'peace' },
      { t0: 3.6, t1: 7.5, y: 0.5, text: arc.invasion, brainrot: true, scene: 'invasion' },
      { t0: 7.0, t1: 10.8, y: 0.6, text: arc.chaos, scene: 'chaos' },
      { t0: 10.2, t1: 13.8, y: 0.72, text: arc.hero, scene: 'hero' },
    ];
    if (allyLine && ally) beats.push({ t0: 10.8, t1: 14.2, y: 0.8, text: allyLine, ally: true, scene: 'hero' });
    if (midBoss) beats.push({ t0: 11.2, t1: 14.4, y: 0.86, text: 'Watch out for ' + midBoss + ' at wave 5!', dim: true, scene: 'hero' });
    beats.push({ t0: 12.0, t1: 14.8, y: 0.9, text: 'Beat ' + boss + ' to clear this zone!', dim: true, scene: 'hero' });
    return beats;
  }

  function buildArcOutro(wi, world, boss) {
    const chunk = arcChunk(wi);
    const slot = arcSlot(wi);
    const chapter = ARC_CHAPTERS[chunk] || ARC_CHAPTERS[ARC_CHAPTERS.length - 1];
    const arc = getArcLines(wi, world, boss, null);
    const endFade = slot === 4 ? chapter.endMsg : 'The story continues…';
    return [
      { t0: 0.2, t1: 3.2, y: 0.14, text: arc.outVictory, big: true, title: true, scene: 'victory' },
      { t0: 1.0, t1: 4.2, y: 0.28, text: boss + ' is defeated!', scene: 'victory' },
      { t0: 2.4, t1: 5.8, y: 0.42, text: arc.outCelebrate, applause: true, scene: 'celebrate' },
      { t0: 4.0, t1: 7.6, y: 0.56, text: arc.outTease, dim: true, scene: 'tease' },
      { t0: 6.0, t1: 9.8, y: 0.7, text: arc.outNext, scene: 'tease' },
      { t0: 8.8, t1: 12.0, y: 0.84, text: endFade, dim: true, scene: 'fade' },
    ];
  }


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
    circo: ['The tents fold up — show\'s over!'],
    autumn: ['A warm breeze blows the bugs away.'],
    swamp: ['Frogs croak like they own the place again.'],
    sky: ['Clouds part and the sun returns.'],
    crystal: ['Crystals glow a calm soft purple.'],
    volcano: ['The rumbling finally stops.'],
    dirt: ['Dust settles. The tunnels go quiet.'],
  };

  const ZONE_IMPACT = {
    grass: 'Villagers cheer from the hills — the brainrot stain is fading!',
    citrus: 'Beach-goers clap as the orange groves turn green again.',
    forest: 'Monkeys toss fruit in celebration — the forest is yours!',
    glacier: 'Penguins slide on clean ice while tourists applaud.',
    circo: 'The crowd ROARS! Confetti rains as the circus returns to normal.',
    autumn: 'Campers wave flags — no more bugs in the soup!',
    swamp: 'Fireflies blink in relief. The swamp smells normal again.',
    sky: 'Cloud people wave from the islands above. You\'re a hero!',
    crystal: 'Crystal sprites hum a thank-you song as the caves brighten.',
    volcano: 'Lava cools to warm stone. Miners cheer your name!',
    dirt: 'Tunnel workers stamp and cheer — the hive retreat echoes below.',
  };

  const WORLD_VIS = {
    grass: 'spores', citrus: 'rain', forest: 'spores', glacier: 'frost',
    circo: 'confetti', autumn: 'embers', swamp: 'toxic', sky: 'static',
    crystal: 'void', volcano: 'embers', dirt: 'brainrot',
  };

  const EXT_VIS = ['sparks', 'rain', 'brainrot', 'static', 'confetti', 'toxic', 'void', 'frost'];
  const EXT_IMPACT = [
    'Locals peek out and applaud — brainrot goo is washing away!',
    'Billboards flicker back to normal. People cheer from the rooftops!',
    'Farmers hug their crops. The swarm\'s stain is gone!',
    'Kids run through clean streets waving flags at you!',
    'Workers stamp their feet in rhythm — zone secured!',
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

  const EXT_ZONE_HOOKS = [
    ['Strange lights flicker across the zone.', 'The swarm left claw marks on everything.'],
    ['The air tastes like static and metal.', 'Bug tracks lead deeper into danger.'],
    ['You hear clicking from every direction.', 'This place was not built for humans.'],
    ['Walls pulse like they are alive.', 'The hive claimed this sector fast.'],
    ['Gravity feels a little bit wrong here.', 'Swarm scouts already spotted you.'],
  ];

  const VIS_EFFECTS = ['spores', 'rain', 'embers', 'sparks', 'void', 'frost', 'toxic', 'static', 'confetti', 'brainrot', 'applause'];

  function visFor(wi, world) {
    const id = world && world.id ? world.id : '';
    if (WORLD_VIS[id]) return WORLD_VIS[id];
    if (wi >= 11) return EXT_VIS[wi % EXT_VIS.length];
    return VIS_EFFECTS[wi % VIS_EFFECTS.length];
  }

  function impactFor(wi, world) {
    const id = world && world.id ? world.id : '';
    if (ZONE_IMPACT[id]) return ZONE_IMPACT[id];
    return EXT_IMPACT[wi % EXT_IMPACT.length];
  }

  function invasionLine(wi, world) {
    const id = world && world.id ? world.id : '';
    const lines = {
      grass: 'Brainrot bugs pour from the bushes!',
      citrus: 'The coast is slick with bug slime!',
      forest: 'Rotten fruit falls as the swarm takes over!',
      glacier: 'Frozen brainrot cracks spread across the ice!',
      circo: 'The circus tents are infested — spotlights flicker wild!',
      autumn: 'Leaves rot mid-air as bugs swarm the woods!',
      swamp: 'Toxic bubbles rise — the swarm owns this swamp!',
      sky: 'Flying brainrot blocks out the sun!',
      crystal: 'Purple corruption creeps up the crystal walls!',
      volcano: 'Ash and brainrot rain from the caldera!',
      dirt: 'The tunnels echo with hive chittering below!',
    };
    if (lines[id]) return lines[id];
    const nm = world && world.name ? world.name : ('Zone ' + (wi + 1));
    return 'Brainrot corruption spreads through ' + nm + '!';
  }

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
    return nm + ' is safe again — for now.';
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
    const impact = impactFor(wi, world);
    const invasion = invasionLine(wi, world);

    let introBeats;
    let outroBeats;
    const arcWorld = isArcWorld(wi);

    if (arcWorld) {
      introBeats = buildArcIntro(wi, world, name, boss, midBoss, ally, allyLine);
      outroBeats = buildArcOutro(wi, world, boss);
    } else if (milestone) {
      introBeats = [
        { t0: 0.2, t1: 3.0, y: 0.12, text: isActStart(wi) ? act.title : ('WORLD ' + (wi + 1)), big: true, title: true },
      ];
      if (isActStart(wi)) {
        introBeats.push({ t0: 0.8, t1: 4.0, y: 0.22, text: act.tag, dim: true });
      }
      introBeats.push({ t0: 1.8, t1: 5.2, y: 0.36, text: name, big: true });
      introBeats.push({ t0: 3.0, t1: 6.4, y: 0.48, text: atmo[0], dim: true });
      introBeats.push({ t0: 3.8, t1: 7.2, y: 0.54, text: invasion, brainrot: true });
      if (twist) introBeats.push({ t0: 4.2, t1: 8.0, y: 0.58, text: twist });
      if (midBoss) introBeats.push({ t0: 5.8, t1: 9.2, y: 0.68, text: 'Watch out for ' + midBoss + ' at wave 5!', dim: true });
      if (allyLine) introBeats.push({ t0: 7.0, t1: 11.0, y: 0.76, text: allyLine, ally: true });
      introBeats.push({ t0: 9.0, t1: 13.0, y: 0.88, text: 'Beat ' + boss + ' to clear this zone!', dim: true });
    } else {
      introBeats = [
        { t0: 0.2, t1: 2.8, y: 0.14, text: 'WORLD ' + (wi + 1), big: true, title: true },
        { t0: 1.0, t1: 4.0, y: 0.28, text: name, big: true },
        { t0: 2.2, t1: 5.4, y: 0.42, text: atmo[0], dim: true },
        { t0: 2.8, t1: 5.8, y: 0.5, text: invasion, brainrot: true },
        { t0: 3.6, t1: 6.8, y: 0.58, text: atmo[1] },
        { t0: 5.0, t1: 8.0, y: 0.68, text: 'Your mission: beat ' + boss + '!' },
      ];
      if (ally && allyLine) {
        introBeats.push({ t0: 6.4, t1: 9.2, y: 0.78, text: allyLine, ally: true });
      } else {
        introBeats.push({ t0: 6.8, t1: 9.4, y: 0.8, text: pick(QUICK_INTROS, wi), dim: true });
      }
    }

    if (!arcWorld) {
    if (milestone) {
      outroBeats = [
        { t0: 0.2, t1: 3.0, y: 0.16, text: name + ' — SAVED!', big: true, title: true },
        { t0: 1.2, t1: 4.4, y: 0.3, text: boss + ' is defeated!' },
        { t0: 2.2, t1: 5.6, y: 0.44, text: victory },
        { t0: 3.4, t1: 7.0, y: 0.56, text: impact, applause: true },
        { t0: 4.8, t1: 8.2, y: 0.68, text: wi < 49 ? 'But the swarm is already heading to the next zone…' : 'The hive mind is the last fight!', dim: true },
        { t0: 6.2, t1: 10.5, y: 0.8, text: wi < 49 ? 'World ' + (wi + 2) + ' needs you next!' : 'Go win it all!', dim: true },
      ];
    } else {
      outroBeats = [
        { t0: 0.2, t1: 2.8, y: 0.16, text: name + ' — cleared!', big: true, title: true },
        { t0: 1.0, t1: 4.0, y: 0.3, text: boss + ' goes down!' },
        { t0: 2.0, t1: 5.2, y: 0.44, text: victory, dim: true },
        { t0: 3.2, t1: 6.6, y: 0.56, text: impact, applause: true },
        { t0: 4.6, t1: 7.4, y: 0.68, text: pick(QUICK_WINS, wi) },
        { t0: 5.8, t1: 8.6, y: 0.8, text: wi < 49 ? 'World ' + (wi + 2) + ' is waiting…' : 'Final zone next!', dim: true },
      ];
    }
    }

    const chalIntroBeats = [
      { t0: 0.3, t1: 3.0, y: 0.18, text: 'CHALLENGER — ' + name, big: true, title: true },
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

    return {
      act,
      milestone,
      arcWorld,
      act1: arcWorld,
      fullCutscene: arcWorld,
      vis: visFor(wi, world),
      introBeats,
      outroBeats,
      chalIntroBeats,
      chalOutroBeats,
      allyChar: ally,
      allyReveal: !!ally,
      heroLine: wi === 0 ? 'You vs the whole swarm. Go!' : null,
      zoneName: name,
      impactLine: impact,
      invasionLine: invasion,
    };
  }

  window.getWorldStory = worldStory;
  window.isArcWorld = isArcWorld;
  window.isAct1World = isAct1;
})();
