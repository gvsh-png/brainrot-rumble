'use strict';
// Per-world unique story lines and cinematic profiles (no recycled quick pools).
(function () {
  const LINES = [
    /* W1  GRASSLANDS */       { in1:'Sunny hills used to be picnic country.', in2:'Now every bush spits out brainrot bugs.', threat:'TRIPPI TROPPI nests in the tallest tree.', win:'Birds sing again. The hills breathe.', next:'The swarm flees toward the coast.' },
    /* W2  CITRUS COAST */     { in1:'Orange groves rot on the beach.', in2:'Salt spray cannot wash the goo away.', threat:'TRACOTUCOTULU stomps the pier to splinters.', win:'Waves clean the sand. Citrus smells sweet.', next:'They regroup in the fruit forest.' },
    /* W3  FORESTA FRUTOSA */  { in1:'Giant fruit hangs like lanterns.', in2:'Something chews the trunks from inside.', threat:'COCOFANTO MASTODONTE shakes the whole grove.', win:'The canopy opens. Light returns.', next:'Cold air blows from the glacier.' },
    /* W4  GELATO GLACIER */   { in1:'Your breath fogs. Footsteps crack ice.', in2:'Frozen bugs skitter under the snow.', threat:'ICE ICE BEARLINI slides in on a glacier.', win:'The frost glitters clean again.', next:'A circus tent glows on the horizon.' },
    /* W5  CIRCO BRAINROTTO */ { in1:'Spotlights spin. The crowd screams.', in2:'The acrobats are all bugs now.', threat:'IL GRAN PAGLIACCIO fakes a bow, then attacks!', win:'The tent falls silent. Show is over.', next:'Autumn leaves hide their retreat.' },
    /* W6  AUTUMN WOODS */     { in1:'Orange leaves mask the ground.', in2:'Smoke-smell and chittering mix in the air.', threat:'BOBRITTO FOGLIAME ambushes from leaf piles.', win:'A warm wind clears the trails.', next:'Mud sucks at boots in the swamp.' },
    /* W7  SWAMP */            { in1:'Bubbles pop in black water.', in2:'Glowing eyes blink between the reeds.', threat:'MADUDUNGDUNG lurks under the boardwalk.', win:'Frogs croak victory. The muck stills.', next:'The swarm takes to the sky.' },
    /* W8  SKYLAND */          { in1:'Clouds are solid enough to walk on.', in2:'Wasp wings buzz like propellers.', threat:'Flying elites dive from three suns.', win:'The sky clears. You can see forever.', next:'Crystal caves pulse below.' },
    /* W9  CRYSTAL CAVES */    { in1:'Purple shards hum when you pass.', in2:'Echoes multiply every footstep.', threat:'Shard guardians crackle with static.', win:'The cave sings a soft low note.', next:'Heat rolls up from the volcano.' },
    /* W10 VOLCANO */          { in1:'Ash falls like gray snow.', in2:'Lava bugs burst from cracked stone.', threat:'MADUDUNGDUNG was only the surface guard.', win:'The mountain stops rumbling.', next:'The real hive digs deeper.' },
    /* W11 DIRT DEPTHS */      { in1:'Tunnels twist without a map.', in2:'The walls sweat hive slime.', threat:'The final band boss blocks the shaft.', win:'Dust settles. Tunnels go quiet.', next:'Neon dunes shimmer beyond the exit.' },
    /* W12 NEON DUNES */       { in1:'Sand glows pink under twin moons.', in2:'Bug tracks zigzag like neon signs.', threat:'NEON OVERLORD rises from a dune.', win:'The desert dims to a calm violet.', next:'Rust factories belch smoke ahead.' },
    /* W13 RUST FACTORY */     { in1:'Conveyor belts never stop moving.', in2:'Oil rain slicks every walkway.', threat:'RUST TITAN crushes the catwalk.', win:'Machines power down one by one.', next:'Toxic marsh gas rolls in.' },
    /* W14 TOXIC MARSH */      { in1:'Green fog burns your eyes.', in2:'Bubbles pop with sickly spores.', threat:'TOXIC SOVEREIGN spews acid geysers.', win:'The air clears enough to breathe.', next:'Crater rim looms on the horizon.' },
    /* W15 MOON CRATER */      { in1:'Low gravity. High danger.', in2:'The swarm built a maze of boulders.', threat:'MOON COLOSSUS guards the center.', win:'Stars look close enough to touch.', next:'The trench drops into darkness.' },
    /* W16 ABYSS TRENCH */     { in1:'Pressure squeezes your ears.', in2:'Bioluminescent bugs drift upward.', threat:'ABYSS NEXUS waits in the deep.', win:'Water stills. Light fades gently.', next:'Sandstorms howl on the surface.' },
    /* W17 SAND STORM */       { in1:'Wind screams. Visibility: zero.', in2:'Bugs ride the gale like missiles.', threat:'STORM HARVESTER spins inside the vortex.', win:'The wind drops to a whisper.', next:'A broken carnival appears.' },
    /* W18 HAUNTED MIDWAY */   { in1:'Ferris wheel creaks with no riders.', in2:'Ticket booths ooze green slime.', threat:'MIDWAY MONARCH haunts the ring toss.', win:'The rides stop groaning.', next:'Foundry fires light the sky.' },
    /* W19 STEEL FOUNDRY */    { in1:'Molten metal rivers cross the floor.', in2:'Sparks and mandibles everywhere.', threat:'STEEL DEVOURER melts the bridge.', win:'Metal cools. Forges go dark.', next:'Bio-lab sirens wail.' },
    /* W20 BIO LAB */          { in1:'Glass tubes bubble with green goo.', in2:'Friendly bugs twitch behind glass. Brainwashed!', threat:'BIO OMEGA breaks containment.', win:'Cages open. Bugs blink awake, free.', next:'Reality wobbles at the rift.' },
    /* W21 QUANTUM RIFT */     { in1:'The floor repeats in every direction.', in2:'You see yourself fighting yourself.', threat:'RIFT CATALYST splits the arena.', win:'The mirror-world folds shut.', next:'Magma core pulses beneath.' },
    /* W22 MAGMA CORE */       { in1:'The ground is literally lava.', in2:'Heat waves distort the boss silhouette.', threat:'MAGMA CROWN sits on a lava throne.', win:'Rock crusts over. Heat fades.', next:'Frozen ruins glitter ahead.' },
    /* W23 FROZEN RUINS */     { in1:'Ancient statues wear ice beards.', in2:'Your dash leaves frost trails.', threat:'FROZEN ABYSS blocks the gate.', win:'Ice cracks. Ruins stand proud.', next:'Candy structures crumble nearby.' },
    /* W24 CANDY COLLAPSE */   { in1:'Everything is sticky and bright.', in2:'Gumdrop bugs bounce off walls.', threat:'CANDY MONARCH oozes from a lollipop.', win:'Sweet air settles. Sticky but safe.', next:'Thunder peaks crackle above.' },
    /* W25 THUNDER PEAK */     { in1:'Lightning writes on the clouds.', in2:'New biome. The swarm already settled in.', threat:'THUNDER APocalypse roars on the peak.', win:'Thunder rolls away. Silence is golden.', next:'A void garden floats below.' },
    /* W26 VOID GARDEN */      { in1:'Plants grow with no soil.', in2:'Petals are sharp as razors.', threat:'VOID HARVESTER prunes intruders.', win:'Flowers close. The garden rests.', next:'Clockwork gears tick louder.' },
    /* W27 CLOCKWORK CITY */   { in1:'Brass gears turn the sky.', in2:'Steam hisses from every grate.', threat:'CLOCK MONARCH rewinds your progress.', win:'Tick-tock slows. Gears stop.', next:'Plasma fields buzz next.' },
    /* W28 PLASMA FIELDS */    { in1:'Air tastes like a battery.', in2:'Purple arcs jump between bugs.', threat:'PLASMA SOVEREIGN overloads the grid.', win:'Static discharges. Fields dim.', next:'Shadow canyon swallows light.' },
    /* W29 SHADOW CANYON */    { in1:'Every shout comes back twice.', in2:'The hive sends TWO boss signals!', threat:'Twin ECHO OVERLORDS answer the call.', win:'Echoes fade. One voice remains: yours.', next:'Static plains ahead.' },
    /* W30 SOLAR FLARE */      { in1:'TV snow covers the ground.', in2:'Your HUD glitches for a second.', threat:'STATIC TITAN walks through the noise.', win:'Picture clears. Signal strong.', next:'Bone desert crunches underfoot.' },
    /* W31 MIRROR MAZE */      { in1:'Ribcages arch like doorways.', in2:'Sand is ground shell and claw.', threat:'BONE NEXUS rattles a warning.', win:'Skulls rest. Wind moans softly.', next:'The glitch zone warps ahead.' },
    /* W32 GRAVITY WELL */     { in1:'Colors swap. Physics hiccups.', in2:'Enemies teleport one tile sideways.', threat:'GLITCH CROWN corrupts the arena.', win:'Pixels settle. World renders clean.', next:'Hive nexus throbs in the distance.' },
    /* W33 SPORE JUNGLE */    { in1:'Walls breathe. Floor is warm.', in2:'You hear a heartbeat. Not yours.', threat:'NEXUS OMEGA guards the chamber.', win:'The heartbeat slows. Room cools.', next:'Storm ring circles the sector.' },
    /* W34 CRYO LAB */         { in1:'Time skips. Waves arrive early.', in2:'Clock hands spin on the walls.', threat:'PRISM MONARCH bends minutes.', win:'Time snaps back to normal.', next:'Obsidian sea reflects the sky.' },
    /* W35 METEOR ALLEY */     { in1:'Black glass mirrors your face.', in2:'Waves of obsidian shard-bugs.', threat:'OBSIDIAN ABYSS rises from the deep.', win:'Glass sea calms. Reflection smiles.', next:'Warp tunnel twists ahead.' },
    /* W36 ECHO CAVERNS */     { in1:'Gravity flips every thirty seconds.', in2:'The swarm almost stole your map!', threat:'WARP DEVOURER bends the path.', win:'Map secured. Route locked in.', next:'Coral graveyard below.' },
    /* W37 STATIC PLAINS */    { in1:'Dead reef towers like bones.', in2:'Fish-bugs swim through the air.', threat:'CORAL CATALYST animates the dead.', win:'Reef settles. Currents gentle.', next:'Ember spire burns on the horizon.' },
    /* W38 BONE DESERT */      { in1:'A tower of fire pierces clouds.', in2:'Ash moths circle the peak.', threat:'EMBER MONARCH ignites the spire.', win:'Embers fade. Tower stands dark.', next:'Toxic rain falls without clouds.' },
    /* W39 GLITCH ZONE */      { in1:'Acid drops sizzle on your armor.', in2:'Umbrellas are useless here.', threat:'RAIN SOVEREIGN commands the storm.', win:'Clouds break. Sun, finally.', next:'Star forge roars in orbit.' },
    /* W40 HIVE NEXUS */       { in1:'Meteors hammer the anvil-platform.', in2:'The hive forges living weapons.', threat:'STAR OVERLORD hammers the final blade.', win:'Forge cools. Stars applaud silently.', next:'Dream fog rolls in thick.' },
    /* W41 STORM RING */       { in1:'You cannot tell sleep from awake.', in2:'Nightmare bugs wear friendly faces.', threat:'DREAM HARVESTER steals hope.', win:'Fog lifts. Morning feels real.', next:'Chaos spiral spins everything.' },
    /* W42 OBSIDIAN SEA */     { in1:'The ground spirals toward a pit.', in2:'Rules change every wave.', threat:'CHAOS OMEGA spins the arena.', win:'Spiral stops. Ground level again.', next:'The hive copied your best move!' },
    /* W43 PRISM TOWER */      { in1:'Every bug type you have ever seen.', in2:'They fight as one army now.', threat:'FINAL VECTOR leads the charge.', win:'The army scatters. The mind remains.', next:'One last sector. One last boss.' },
    /* W44 WARP TUNNEL */      { in1:'Your own dash trail attacks you.', in2:'The hive studied your replays.', threat:'MIRROR MONARCH copies your build.', win:'Original wins. Copy fades.', next:'Gravity well ahead.' },
    /* W45 CORAL GRAVE */      { in1:'Everything pulls toward the center.', in2:'Bullets curve like boomerangs.', threat:'GRAVITY CROWN collapses space.', win:'Orbit stabilizes. You float free.', next:'Spore jungle chokes the path.' },
    /* W46 EMBER SPIRE */      { in1:'Mushrooms tall as houses.', in2:'Spores paint the air green.', threat:'SPORE TITAN releases a cloud.', win:'Spores settle. Jungle breathes.', next:'Cryo lab freezes the exit.' },
    /* W47 TOXIC RAIN */       { in1:'Specimens float in ice tubes.', in2:'Alarms flash: CONTAINMENT FAIL.', threat:'CRYO DEVOURER thaws early.', win:'Lab seals. Frost returns.', next:'Meteor alley. Dodge or die.' },
    /* W48 STAR FORGE */       { in1:'Rocks fall every five seconds.', in2:'No cover. Only speed.', threat:'METEOR MONARCH rides a comet.', win:'Skies clear. Alley safe.', next:'The finale is close.' },
    /* W49 DREAM FOG */        { in1:'A ring of storms surrounds the core.', in2:'Lightning connects every tower.', threat:'STORM APocalypse guards the gate.', win:'Storms part. Core exposed.', next:'The hive mind awaits.' },
    /* W50 CHAOS SPIRAL */     { in1:'All roads led here.', in2:'The hive mind speaks in static.', threat:'THE HIVE MIND. Beat it and save everyone!', win:'Silence. Then cheering. You did it.', next:'The swarm is gone. Peace?' },
  ];

  // One unique particle/overlay style per world (matches LINES index).
  const CINE_FX = [
    'pollen', 'spray', 'fruitfall', 'snow', 'spotlight', 'leaves', 'bubbles', 'clouds', 'crystals', 'ash', 'dust',
    'neon', 'oil', 'toxic', 'stars', 'biolum', 'sand', 'mist', 'sparks', 'lab', 'glitch', 'heat', 'frost', 'candy', 'lightning',
    'voidpetals', 'steam', 'plasma', 'echo', 'static', 'bones', 'pixels', 'hivepulse', 'prism', 'glass', 'warp', 'coral', 'embers', 'acid', 'meteors',
    'dream', 'spiral', 'stampede', 'mirror', 'gravity', 'spores', 'cryo', 'comet', 'stormring', 'hivemind',
  ];

  function beat(text, y, opts) {
    return Object.assign({ text, y }, opts || {});
  }

  function buildIntroScenes(wi, world, opts) {
    const L = LINES[wi] || LINES[0];
    const act = opts.act;
    const name = opts.name;
    const boss = opts.boss;
    const mid = opts.midBoss;
    const milestone = opts.milestone;
    const twist = opts.twist;
    const allyLine = opts.allyLine;
    const introLine = (world && world.introLine) || ('WORLD ' + (wi + 1));
    const scenes = [];

    if (milestone) {
      scenes.push({
        layout: 'establishing', dur: 3.2,
        beats: [
          beat(isActStart(wi, act) ? act.title : ('WORLD ' + (wi + 1)), 0.14, { big: true, title: true }),
          beat(introLine, 0.28, { big: true }),
          beat(name, 0.42, { dim: true }),
        ],
      });
      scenes.push({
        layout: 'atmosphere', dur: 3.4,
        beats: [
          beat(L.in1, 0.22, { dim: true }),
          beat(L.in2, 0.42),
          beat(twist || L.threat, 0.62, { big: true }),
        ],
      });
      scenes.push({
        layout: 'boss_reveal', dur: 3.6,
        beats: [
          beat(L.threat, 0.18, { big: true }),
          beat(mid ? ('Wave 5: ' + mid + ' strikes first!') : 'The final boss approaches.', 0.38, { dim: true }),
          beat('Target: ' + boss, 0.58, { big: true, title: true }),
        ],
      });
      scenes.push({
        layout: allyLine ? 'ally_join' : 'versus', dur: 3.2,
        beats: [
          beat(allyLine || 'Move fast. Shoot faster.', 0.24, { ally: !!allyLine, big: !!allyLine }),
          beat('Beat ' + boss + ' to clear this zone!', 0.52, { dim: true }),
          beat(wi === 0 ? 'You vs the whole swarm. Go!' : 'Good luck, hero!', 0.72),
        ],
      });
    } else {
      scenes.push({
        layout: 'establishing', dur: 2.8,
        beats: [
          beat('WORLD ' + (wi + 1), 0.16, { big: true, title: true }),
          beat(introLine, 0.32, { big: true }),
        ],
      });
      scenes.push({
        layout: 'atmosphere', dur: 3.0,
        beats: [
          beat(name, 0.2, { big: true }),
          beat(L.in1, 0.38, { dim: true }),
          beat(L.in2, 0.56),
        ],
      });
      scenes.push({
        layout: 'versus', dur: 3.2,
        beats: [
          beat(L.threat, 0.22),
          beat(allyLine || ('Mission: defeat ' + boss + '!'), 0.48, { ally: !!allyLine, big: !!allyLine }),
          beat(mid ? ('Watch for ' + mid + ' at wave 5.') : 'Survive every wave!', 0.68, { dim: true }),
        ],
      });
    }
    return scenes;
  }

  function buildOutroScenes(wi, world, opts) {
    const L = LINES[wi] || LINES[0];
    const name = opts.name;
    const boss = opts.boss;
    const milestone = opts.milestone;
    const outroLine = (world && world.outroLine) || (name + ' secured.');
    const scenes = [];

    if (milestone) {
      scenes.push({
        layout: 'victory', dur: 3.0,
        beats: [
          beat(name + ' SAVED!', 0.18, { big: true, title: true }),
          beat(boss + ' falls!', 0.38, { big: true }),
          beat(outroLine, 0.58, { dim: true }),
        ],
      });
      scenes.push({
        layout: 'relief', dur: 3.2,
        beats: [
          beat(L.win, 0.28),
          beat('The swarm retreats.', 0.48, { dim: true }),
          beat(L.next, 0.66, { big: true }),
        ],
      });
      scenes.push({
        layout: 'tease', dur: 2.8,
        beats: [
          beat(wi < 49 ? ('World ' + (wi + 2) + ' needs you next!') : 'THE HIVE IS BROKEN!', 0.32, { big: true, title: true }),
          beat(wi < 49 ? L.next : 'You saved everyone. Hero!', 0.58),
        ],
      });
    } else {
      scenes.push({
        layout: 'victory', dur: 2.8,
        beats: [
          beat(name + ' cleared!', 0.2, { big: true, title: true }),
          beat(boss + ' goes down!', 0.42),
          beat(L.win, 0.62, { dim: true }),
        ],
      });
      scenes.push({
        layout: 'tease', dur: 2.6,
        beats: [
          beat(L.next, 0.32),
          beat(wi < 49 ? ('World ' + (wi + 2) + ' awaits.') : 'Final push!', 0.58, { dim: true }),
        ],
      });
    }
    return scenes;
  }

  function buildChalScenes(wi, world, opts) {
    const L = LINES[wi] || LINES[0];
    const name = opts.name || (world && world.name) || ('WORLD ' + (wi + 1));
    const boss = opts.boss || 'THE BOSS';
    return {
      introScenes: [
        { layout: 'establishing', dur: 2.6, beats: [
          beat('CHALLENGER MODE', 0.14, { big: true, title: true }),
          beat(name, 0.32, { big: true }),
        ]},
        { layout: 'atmosphere', dur: 2.8, beats: [
          beat(L.in1, 0.22, { dim: true }),
          beat('Survive 15 minutes. No wave breaks.', 0.48),
          beat('Bosses at 5, 10, 15, and 20 min!', 0.68, { dim: true }),
        ]},
        { layout: 'versus', dur: 2.8, beats: [
          beat(L.threat, 0.24),
          beat('Target: ' + boss, 0.5, { big: true }),
          beat('Good luck, challenger!', 0.72, { dim: true }),
        ]},
      ],
      outroScenes: [
        { layout: 'victory', dur: 2.8, beats: [
          beat('CHALLENGER WIN!', 0.18, { big: true, title: true }),
          beat(name + ' conquered!', 0.4, { big: true }),
          beat(L.win, 0.62, { dim: true }),
        ]},
        { layout: 'tease', dur: 2.4, beats: [
          beat('Fifteen minutes survived. Legend!', 0.32),
          beat('Story mode still has more zones!', 0.58, { dim: true }),
        ]},
      ],
    };
  }

  const PROLOGUE_SCENES = [
    { layout: 'establishing', dur: 3.5, beats: [
      beat('THE WORLD WAS AT PEACE.', 0.2, { big: true, title: true }),
      beat('Sunny hills. Picnics. Normal life.', 0.45, { dim: true }),
    ]},
    { layout: 'atmosphere', dur: 4.0, beats: [
      beat('TING TING TING BAHUR\'S ARMY INVADED.', 0.2, { big: true }),
      beat('Pigeons. Chimps. Penguins. Flamingos. Ducks.', 0.45, { dim: true }),
      beat('Villagers run for their lives.', 0.65),
    ]},
    { layout: 'boss_reveal', dur: 3.0, beats: [
      beat('BRAINROT IS SPREADING FAST.', 0.25, { big: true, title: true }),
      beat('The swarm covers the grasslands.', 0.55, { dim: true }),
    ]},
    { layout: 'ally_join', dur: 3.5, beats: [
      beat('ONE HERO RISES TO STOP THEM.', 0.22, { big: true }),
      beat('Gianni steps up. The fight begins!', 0.48, { ally: true, big: true }),
      beat('MISSION START', 0.72, { big: true, title: true }),
    ]},
  ];

  const W1_OUTRO_SCENES = [
    { layout: 'establishing', dur: 3.0, beats: [
      beat('BACK IN THE GRASSLANDS.', 0.2, { big: true, title: true }),
      beat('Trippi Troppi is defeated.', 0.48, { dim: true }),
    ]},
    { layout: 'atmosphere', dur: 3.5, beats: [
      beat('TING TING TING BAHUR DID NOT STAY DOWN.', 0.22, { big: true }),
      beat('He calls upon his fallen army.', 0.52, { dim: true }),
    ]},
    { layout: 'boss_reveal', dur: 3.5, beats: [
      beat('Pigeons rise. Chimps rise. All of them.', 0.24, { dim: true }),
      beat('They vow to grow stronger.', 0.52, { big: true }),
    ]},
    { layout: 'tease', dur: 2.8, beats: [
      beat('WORLD 2 AWAITS.', 0.32, { big: true, title: true }),
      beat('The swarm flees toward the coast.', 0.58, { dim: true }),
    ]},
  ];

  function isActStart(wi, act) {
    return act && act.start === wi;
  }

  function sceneDuration(scenes) {
    let d = 0;
    for (const s of scenes) d += s.dur;
    return d;
  }

  function beatsFromScenes(scenes) {
    const beats = [];
    let t = 0;
    for (const sc of scenes) {
      for (const b of sc.beats) {
        beats.push(Object.assign({}, b, { t0: t + 0.15, t1: t + sc.dur - 0.15, sceneLayout: sc.layout }));
      }
      t += sc.dur;
    }
    return beats;
  }

  window.getCineFx = function (wi) {
    return CINE_FX[wi] || CINE_FX[0];
  };

  window.getPrologueScenes = function () { return PROLOGUE_SCENES; };
  window.getW1OutroScenes = function () { return W1_OUTRO_SCENES; };

  window.buildStoryScenes = function (wi, world, opts) {
    const introScenes = buildIntroScenes(wi, world, opts);
    const outroScenes = buildOutroScenes(wi, world, opts);
    const chal = buildChalScenes(wi, world, opts);
    return {
      introScenes,
      outroScenes,
      chalIntroScenes: chal.introScenes,
      chalOutroScenes: chal.outroScenes,
      introBeats: beatsFromScenes(introScenes),
      outroBeats: beatsFromScenes(outroScenes),
      chalIntroBeats: beatsFromScenes(chal.introScenes),
      chalOutroBeats: beatsFromScenes(chal.outroScenes),
      introDur: sceneDuration(introScenes),
      outroDur: sceneDuration(outroScenes),
      chalIntroDur: sceneDuration(chal.introScenes),
      chalOutroDur: sceneDuration(chal.outroScenes),
      cineFx: getCineFx(wi),
    };
  };
})();
