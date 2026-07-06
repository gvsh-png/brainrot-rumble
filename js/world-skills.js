'use strict';
// Themed world-exclusive upgrades W12–50 — each skill has a distinct mechanic + VFX (see world-skill-fx.js).

(function () {
  function wskAdd(key, n) {
    P.wsk = P.wsk || {};
    P.wsk[key] = (P.wsk[key] || 0) + (n || 1);
  }

  const CARD_DEFS = [
    // W12–W16
    { wi: 11, id: 'neondrift', name: 'Neon Afterimage', icon: 'gembig', rarity: 'uncommon', cap: 5,
      steps: [{ desc: 'while moving, neon ghosts fire snap-shots behind you.', f: () => wskAdd('neon') }] },
    { wi: 12, id: 'rustthorns', name: 'Corrosion Spikes', icon: 'turtle', rarity: 'uncommon', cap: 5,
      steps: [
        { desc: 'contact spikes shred armor.', f: () => { P.thorns += 6; } },
        { desc: 'hits corrode — poison bleed.', f: () => wskAdd('rust') },
      ] },
    { wi: 13, id: 'toxicbloom', name: 'Miasma Pod', icon: 'crocodilo', rarity: 'epic',
      steps: [
        { desc: 'spawn drifting toxic pods that choke the swarm.', f: () => { P.fieldPulse = true; P.fpCdBase = 5.2; P.fpR = 95; P.fpDps = 11; P.fpCol = '#50c830'; P.fpSlow = true; P.fpVfx = 'spore'; } },
        { desc: 'pods spread wider & bloom faster.', f: () => { P.fpR = (P.fpR || 95) + 18; P.fpCdBase = Math.max(3.6, P.fpCdBase - 0.5); } },
        { desc: 'miasma burns hotter.', f: () => { P.fpDps = (P.fpDps || 11) + 4; wskAdd('spore'); } },
        { desc: 'lingering toxic fog.', f: () => { P.fpLife = (P.fpLife || 1.4) + 0.4; } },
      ] },
    { wi: 14, id: 'lunarpull', name: 'Low-Grav Lure', icon: 'gem', rarity: 'rare', cap: 4,
      steps: [
        { desc: 'low gravity — wider pickup radius.', f: () => { P.magnet *= 1.32; } },
        { desc: 'distant loot warps toward you on kills.', f: () => wskAdd('rift') },
      ] },
    { wi: 15, id: 'abysshunger', name: 'Trench Lash', icon: 'gembig', rarity: 'epic', cap: 5,
      steps: [
        { desc: 'abyssal tendrils lash the nearest foe.', f: () => wskAdd('lash') },
        { desc: 'tendrils strike faster & harder.', f: () => { wskAdd('lash'); P.abyssal = (P.abyssal || 0) + 1; } },
      ] },
    // W17–W21
    { wi: 16, id: 'duneswarm', name: 'Sandcutter', icon: 'coin', rarity: 'epic', cap: 5,
      steps: [
        { desc: 'sprint through dunes — +damage while moving.', f: () => wskAdd('sand') },
        { desc: 'sandstorm cuts deeper at speed.', f: () => wskAdd('sand') },
      ] },
    { wi: 17, id: 'midwayluck', name: 'Midway Jackpot', icon: 'coin', rarity: 'rare', cap: 4,
      steps: [
        { desc: '+7% crit — carnival lights favor bold shots.', f: () => { P.crit = Math.min(0.85, P.crit + 0.07); } },
        { desc: 'kills may spit bonus gold.', f: () => wskAdd('midway') },
      ] },
    { wi: 18, id: 'foundryplate', name: 'Slagplate', icon: 'turtle', rarity: 'uncommon', cap: 5,
      steps: [
        { desc: 'foundry slag plating — take less damage.', f: () => { P.armor *= 0.92; } },
        { desc: 'melee attackers get scorched on hit.', f: () => wskAdd('slag') },
      ] },
    { wi: 19, id: 'bioleech', name: 'Viral Sample', icon: 'crocodilo', rarity: 'epic', cap: 4,
      steps: [
        { desc: 'kills infect nearby brainrot with toxin.', f: () => wskAdd('viral') },
        { desc: 'infection spreads farther.', f: () => wskAdd('viral') },
      ] },
    { wi: 20, id: 'quantumreach', name: 'Phase Shot', icon: 'gembig', rarity: 'rare', cap: 4,
      steps: [
        { desc: 'rift periodically fires a piercing phase bolt.', f: () => wskAdd('phase') },
        { desc: 'phase bolts pierce more & hit harder.', f: () => wskAdd('phase') },
      ] },
    // W22–W26
    { wi: 21, id: 'magmascorch', name: 'Core Vent', icon: 'flamingo', rarity: 'uncommon', cap: 5,
      steps: [
        { desc: 'magma vents erupt under nearby foes.', f: () => wskAdd('vent') },
        { desc: 'vents erupt more often.', f: () => wskAdd('vent') },
      ] },
    { wi: 22, id: 'ruinchill', name: 'Permafrost Shatter', icon: 'gem', rarity: 'uncommon', cap: 5,
      steps: [
        { desc: 'chilled hits trigger frost shrapnel.', f: () => { P.chillHit = (P.chillHit || 0) + 1; wskAdd('frost'); } },
        { desc: 'shrapnel bursts wider.', f: () => wskAdd('frost') },
      ] },
    { wi: 23, id: 'sugarrush', name: 'Gumdrop Barrage', icon: 'gem', rarity: 'uncommon', cap: 5,
      steps: [
        { desc: '+10% attack speed; kills launch homing gumdrops.', f: () => { P.fireRate *= 0.90; wskAdd('candy'); } },
        { desc: 'more gumdrops per kill.', f: () => wskAdd('candy') },
      ] },
    { wi: 24, id: 'peakquake', name: 'Thunder Quake', icon: 'rhino', rarity: 'epic', cap: 5,
      steps: [
        { desc: 'kills call lightning quakes through the peak.', f: () => { P.aftershock = (P.aftershock || 0) + 1; P.wskQuakeCol = '#ffe060'; } },
        { desc: 'quakes strike more often.', f: () => { P.aftershock = (P.aftershock || 0) + 1; } },
      ] },
    { wi: 25, id: 'voidthorns', name: 'Thorned Void', icon: 'turtle', rarity: 'uncommon', cap: 5,
      steps: [
        { desc: 'void vines lash back + tug foes inward.', f: () => { P.thorns += 6; wskAdd('sing'); } },
        { desc: 'gravity tug strengthens.', f: () => wskAdd('sing') },
      ] },
    // W27–W31
    { wi: 26, id: 'clocktremor', name: 'Gearstrike', icon: 'crocodilo', rarity: 'rare', cap: 5,
      steps: [
        { desc: 'clockwork rounds crack the floor on impact.', f: () => { P.tremor = (P.tremor || 0) + 1; } },
        { desc: 'tremors ripple harder.', f: () => { P.tremor = (P.tremor || 0) + 1; } },
      ] },
    { wi: 27, id: 'plasmapulse', name: 'Capacitor Arc', icon: 'gembig', rarity: 'epic',
      steps: [
        { desc: 'stored plasma arcs to the nearest foe.', f: () => wskAdd('arc') },
        { desc: 'arcs chain to a second target.', f: () => wskAdd('arc') },
        { desc: 'capacitor recharges faster.', f: () => wskAdd('arc') },
        { desc: 'overcharge — bigger bursts.', f: () => wskAdd('arc') },
      ] },
    { wi: 28, id: 'shadowloot', name: 'Gloom Tax', icon: 'coin', rarity: 'rare', cap: 4,
      steps: [
        { desc: '+16% gold & XP; hits sap enemy speed.', f: () => { P.goldMul *= 1.16; P.xpMul *= 1.16; wskAdd('gloom'); } },
        { desc: 'shadow sap lingers longer.', f: () => wskAdd('gloom') },
      ] },
    { wi: 29, id: 'solarscorch', name: 'Flare Wave', icon: 'flamingo', rarity: 'uncommon', cap: 5,
      steps: [
        { desc: 'solar flares pulse outward, knocking foes back.', f: () => wskAdd('flare') },
        { desc: 'flares surge more often.', f: () => wskAdd('flare') },
      ] },
    { wi: 30, id: 'mirrorbounce', name: 'Kaleidoscope', icon: 'gembig', rarity: 'rare', cap: 4,
      steps: [
        { desc: '+1 ricochet; mirrored split on bounce.', f: () => { P.ricochet += 1; P.bounce = (P.bounce || 0) + 1; } },
        { desc: 'extra bounce angle.', f: () => { P.bounce = (P.bounce || 0) + 1; } },
      ] },
    // W32–W36
    { wi: 31, id: 'wellgravity', name: 'Singularity', icon: 'octopus', rarity: 'epic', cap: 5,
      steps: [
        { desc: 'gravity well tugs the swarm inward.', f: () => { wskAdd('sing'); P.abyssal = (P.abyssal || 0) + 1; } },
        { desc: 'well pulls harder; +damage near crowds.', f: () => { wskAdd('sing'); P.abyssal = (P.abyssal || 0) + 1; } },
      ] },
    { wi: 32, id: 'sporecloud', name: 'Spore Triffid', icon: 'crocodilo', rarity: 'epic',
      steps: [
        { desc: 'release drifting spore pods around you.', f: () => wskAdd('spore') },
        { desc: 'more pods, faster growth.', f: () => wskAdd('spore') },
        { desc: 'spores choke & damage longer.', f: () => wskAdd('spore') },
        { desc: 'triffid overgrowth.', f: () => wskAdd('spore') },
      ] },
    { wi: 33, id: 'cryotouch', name: 'Cryostasis', icon: 'gem', rarity: 'uncommon', cap: 5,
      steps: [
        { desc: 'hits chill; standing still cryo-heals.', f: () => { P.chillHit = (P.chillHit || 0) + 1; wskAdd('cryo'); } },
        { desc: 'cryo-heal strengthens.', f: () => wskAdd('cryo') },
      ] },
    { wi: 34, id: 'meteorquake', name: 'Falling Star', icon: 'rhino', rarity: 'epic', cap: 5,
      steps: [
        { desc: 'kills may call a meteor strike.', f: () => wskAdd('meteor') },
        { desc: 'meteors hit more often & harder.', f: () => wskAdd('meteor') },
      ] },
    { wi: 35, id: 'echoreach', name: 'Echo Round', icon: 'gem', rarity: 'rare', cap: 4,
      steps: [
        { desc: 'hits echo damage at the impact site.', f: () => wskAdd('echo') },
        { desc: 'echoes hit harder.', f: () => wskAdd('echo') },
      ] },
    // W37–W41
    { wi: 36, id: 'staticedge', name: 'Arc Lightning', icon: 'coin', rarity: 'rare', cap: 4,
      steps: [
        { desc: '+7% crit; crits arc to a nearby foe.', f: () => { P.crit = Math.min(0.85, P.crit + 0.07); wskAdd('arcCrit'); } },
        { desc: 'arcs jump farther.', f: () => wskAdd('arcCrit') },
      ] },
    { wi: 37, id: 'boneguard', name: 'Ribcage', icon: 'turtle', rarity: 'uncommon', cap: 5,
      steps: [
        { desc: 'bone armor — take less damage.', f: () => { P.armor *= 0.91; } },
        { desc: 'getting hit erupts bone spikes.', f: () => wskAdd('rib') },
      ] },
    { wi: 38, id: 'glitchrush', name: 'Datamosh', icon: 'gem', rarity: 'uncommon', cap: 5,
      steps: [
        { desc: '+10% attack speed; glitch-dodge under fire.', f: () => { P.fireRate *= 0.90; wskAdd('datamosh'); } },
        { desc: 'datamosh procs more often.', f: () => wskAdd('datamosh') },
      ] },
    { wi: 39, id: 'hivefury', name: 'Stinger Swarm', icon: 'gembig', rarity: 'epic', cap: 5,
      steps: [
        { desc: 'stack venom on the same foe — +damage per stack.', f: () => wskAdd('hive') },
        { desc: 'stings cap higher.', f: () => wskAdd('hive') },
      ] },
    { wi: 40, id: 'stormring', name: 'Eyewall', icon: 'gembig', rarity: 'epic',
      steps: [
        { desc: 'orbiting storm nodes zap nearby foes.', f: () => wskAdd('eyewall') },
        { desc: 'extra node orbits you.', f: () => wskAdd('eyewall') },
        { desc: 'nodes spin faster.', f: () => wskAdd('eyewall') },
        { desc: 'eyewall overcharge.', f: () => wskAdd('eyewall') },
      ] },
    // W42–W46
    { wi: 41, id: 'obsidianbarbs', name: 'Obsidian Mirror', icon: 'turtle', rarity: 'uncommon', cap: 5,
      steps: [
        { desc: 'obsidian barbs punish touch.', f: () => { P.thorns += 8; } },
        { desc: 'barbs leave bleeding shards.', f: () => wskAdd('rust') },
      ] },
    { wi: 42, id: 'prismcut', name: 'Spectrum Cut', icon: 'coin', rarity: 'rare', cap: 5,
      steps: [
        { desc: '+6% crit; crits split rainbow shards.', f: () => { P.crit = Math.min(0.85, P.crit + 0.06); P.prismCrit = (P.prismCrit || 0) + 1; } },
        { desc: 'more shards per crit.', f: () => { P.prismCrit = (P.prismCrit || 0) + 1; } },
      ] },
    { wi: 43, id: 'warpmagnet', name: 'Warp Haul', icon: 'gem', rarity: 'rare', cap: 4,
      steps: [
        { desc: '+38% pickup radius.', f: () => { P.magnet *= 1.38; } },
        { desc: 'kills warp distant loot toward you.', f: () => wskAdd('rift') },
      ] },
    { wi: 44, id: 'coralleech', name: 'Symbiote Reef', icon: 'heart', rarity: 'epic', cap: 4,
      steps: [
        { desc: '+3 HP per kill.', f: () => { if (typeof bumpVamp === 'function') bumpVamp(3, 0.015); else P.vamp += 3; } },
        { desc: 'standing still, coral symbiote heals you.', f: () => wskAdd('reef') },
      ] },
    { wi: 45, id: 'emberspire', name: 'Cinder Column', icon: 'flamingo', rarity: 'uncommon', cap: 5,
      steps: [
        { desc: 'cinder columns erupt at your feet.', f: () => wskAdd('cinder') },
        { desc: 'columns burn hotter.', f: () => wskAdd('cinder') },
      ] },
    // W47–W50
    { wi: 46, id: 'acidrain', name: 'Deluge', icon: 'crocodilo', rarity: 'epic',
      steps: [
        { desc: 'acid puddles drip ahead of your path.', f: () => wskAdd('deluge') },
        { desc: 'deluge flows faster.', f: () => wskAdd('deluge') },
        { desc: 'puddles widen.', f: () => wskAdd('deluge') },
        { desc: 'toxic downpour.', f: () => wskAdd('deluge') },
      ] },
    { wi: 47, id: 'forgetremor', name: 'Starhammer', icon: 'crocodilo', rarity: 'rare', cap: 5,
      steps: [
        { desc: 'star-forged impacts quake the ground.', f: () => { P.tremor = (P.tremor || 0) + 1; } },
        { desc: 'hammers fall harder.', f: () => { P.tremor = (P.tremor || 0) + 1; } },
      ] },
    { wi: 48, id: 'dreamhoard', name: 'Reverie Cache', icon: 'coin', rarity: 'rare', cap: 4,
      steps: [
        { desc: '+18% gold & XP; dream mist slows foes.', f: () => { P.goldMul *= 1.18; P.xpMul *= 1.18; wskAdd('mist'); } },
        { desc: 'mist thickens.', f: () => wskAdd('mist') },
      ] },
    { wi: 48, id: 'chaosrupture', name: 'Reality Tear', icon: 'rhino', rarity: 'legendary', cap: 5,
      steps: [
        { desc: 'kills may tear reality — chaos quakes.', f: () => wskAdd('chaos') },
        { desc: 'tears open more often.', f: () => wskAdd('chaos') },
      ] },
    { wi: 49, id: 'swarmcrown', name: 'Swarm Crown', icon: 'gembig', rarity: 'legendary',
      steps: [
        { desc: 'crown lashes the nearest foe.', f: () => wskAdd('lash') },
        { desc: 'stinger venom stacks on focus targets.', f: () => wskAdd('hive') },
        { desc: 'kills erupt reality quakes.', f: () => wskAdd('chaos') },
        { desc: 'flare waves pulse from the crown.', f: () => wskAdd('flare') },
      ],
      evo: { name: 'Hive Sovereign', icon: 'gembig',
        desc: 'EVOLVE — lash, venom, quakes, and flares at full power.',
        f: () => { wskAdd('lash', 2); wskAdd('hive', 2); wskAdd('chaos', 2); wskAdd('flare', 2); P.abyssal = (P.abyssal || 0) + 2; } } },
  ];

  const WORLD_SKILLS = [];
  const WORLD_SKILL_MIN = {};

  for (const def of CARD_DEFS) {
    const wi = def.wi;
    const card = {
      id: def.id,
      name: def.name,
      icon: def.icon,
      rarity: def.rarity,
      minWorld: wi,
      steps: def.steps,
    };
    if (def.cap) card.cap = def.cap;
    if (def.evo) card.evo = def.evo;
    if (wi >= 40 && !def.cap && !def.evo) card.rarity = wi >= 48 ? 'legendary' : 'epic';
    WORLD_SKILLS.push(card);
    WORLD_SKILL_MIN[def.id] = wi;
  }

  window.WORLD_SKILLS = WORLD_SKILLS;
  window.WORLD_SKILL_MIN = WORLD_SKILL_MIN;
})();
