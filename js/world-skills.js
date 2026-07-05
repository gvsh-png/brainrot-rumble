'use strict';
// Themed world-exclusive upgrades W12–50 — grounded names tied to each sector biome.

(function () {
  function pulseSteps(col, slow, dps) {
    return [
      { desc: 'periodically bloom a damaging field around you.', f: () => { P.fieldPulse = true; P.fpCdBase = 5.5; P.fpR = 100; P.fpDps = dps || 12; P.fpCol = col; P.fpSlow = !!slow; } },
      { desc: 'field grows & pulses more often.', f: () => { P.fpR = (P.fpR || 100) + 20; P.fpCdBase = Math.max(3.8, P.fpCdBase - 0.5); } },
      { desc: 'field hits harder.', f: () => { P.fpDps = (P.fpDps || 12) + 4; } },
      { desc: 'field lingers longer.', f: () => { P.fpLife = (P.fpLife || 1.4) + 0.35; } },
    ];
  }

  const CARD_DEFS = [
    // W12–W16
    { wi: 11, id: 'neondrift', name: 'Neon Drift', icon: 'gem', rarity: 'uncommon', cap: 5,
      steps: [{ desc: '+10% attack speed under neon skies.', f: () => { P.fireRate *= 0.90; } }] },
    { wi: 12, id: 'rustthorns', name: 'Rust Thorns', icon: 'turtle', rarity: 'uncommon', cap: 5,
      steps: [{ desc: 'rusted spikes — foes that touch you bleed.', f: () => { P.thorns += 7; } }] },
    { wi: 13, id: 'toxicbloom', name: 'Toxic Bloom', icon: 'crocodilo', rarity: 'epic',
      steps: pulseSteps('#40c820', true, 11) },
    { wi: 14, id: 'lunarpull', name: 'Lunar Pull', icon: 'gem', rarity: 'rare', cap: 4,
      steps: [{ desc: '+35% item pickup radius in low gravity.', f: () => { P.magnet *= 1.35; } }] },
    { wi: 15, id: 'abysshunger', name: 'Abyss Hunger', icon: 'gembig', rarity: 'epic', cap: 5,
      steps: [{ desc: '+6% damage per nearby enemy. The trench feeds you.', f: () => { P.abyssal = (P.abyssal || 0) + 1; } }] },
    // W17–W21
    { wi: 16, id: 'duneswarm', name: 'Dune Swarm', icon: 'coin', rarity: 'epic', cap: 5,
      steps: [{ desc: '+6% damage per nearby enemy in the sandstorm.', f: () => { P.abyssal = (P.abyssal || 0) + 1; } }] },
    { wi: 17, id: 'midwayluck', name: 'Midway Luck', icon: 'coin', rarity: 'rare', cap: 4,
      steps: [{ desc: '+8% crit chance — the carnival favors bold shots.', f: () => { P.crit = Math.min(0.85, P.crit + 0.08); } }] },
    { wi: 18, id: 'foundryplate', name: 'Foundry Plate', icon: 'turtle', rarity: 'uncommon', cap: 5,
      steps: [{ desc: '-7% damage taken from molten factory hazards.', f: () => { P.armor *= 0.93; } }] },
    { wi: 19, id: 'bioleech', name: 'Bio Leech', icon: 'heart', rarity: 'epic', cap: 4,
      steps: [{ desc: '+3 HP per kill — the lab specimen feeds on brainrot.', f: () => { P.vamp += 3; } }] },
    { wi: 20, id: 'quantumreach', name: 'Quantum Reach', icon: 'gem', rarity: 'rare', cap: 4,
      steps: [{ desc: '+18% attack range through the rift.', f: () => { P.range *= 1.18; } }] },
    // W22–W26
    { wi: 21, id: 'magmascorch', name: 'Magma Scorch', icon: 'flamingo', rarity: 'uncommon', cap: 5,
      steps: [{ desc: 'magma core heat aura scorches nearby foes.', f: () => { P.burnAura += 6; } }] },
    { wi: 22, id: 'ruinchill', name: 'Ruin Chill', icon: 'gem', rarity: 'uncommon', cap: 5,
      steps: [{ desc: 'frozen ruins — your hits chill enemies.', f: () => { P.chillHit = (P.chillHit || 0) + 1; } }] },
    { wi: 23, id: 'sugarrush', name: 'Sugar Rush', icon: 'gem', rarity: 'uncommon', cap: 5,
      steps: [{ desc: '+12% attack speed from candy collapse adrenaline.', f: () => { P.fireRate *= 0.88; } }] },
    { wi: 24, id: 'peakquake', name: 'Peak Quake', icon: 'rhino', rarity: 'epic', cap: 5,
      steps: [{ desc: 'kills may erupt thunder-quakes (+chance per level).', f: () => { P.aftershock = (P.aftershock || 0) + 1; } }] },
    { wi: 25, id: 'voidthorns', name: 'Void Thorns', icon: 'turtle', rarity: 'uncommon', cap: 5,
      steps: [{ desc: 'void garden vines lash back at touchers.', f: () => { P.thorns += 7; } }] },
    // W27–W31
    { wi: 26, id: 'clocktremor', name: 'Clockwork Tremor', icon: 'crocodilo', rarity: 'rare', cap: 5,
      steps: [{ desc: 'gear-shot impacts send tremors through the floor.', f: () => { P.tremor = (P.tremor || 0) + 1; } }] },
    { wi: 27, id: 'plasmapulse', name: 'Plasma Pulse', icon: 'gembig', rarity: 'epic',
      steps: pulseSteps('#e040ff', false, 13) },
    { wi: 28, id: 'shadowloot', name: 'Shadow Loot', icon: 'coin', rarity: 'rare', cap: 4,
      steps: [{ desc: '+18% gold & XP from shadow canyon salvage.', f: () => { P.goldMul *= 1.18; P.xpMul *= 1.18; } }] },
    { wi: 29, id: 'solarscorch', name: 'Solar Scorch', icon: 'flamingo', rarity: 'uncommon', cap: 5,
      steps: [{ desc: 'solar flare heat aura burns the swarm.', f: () => { P.burnAura += 6; } }] },
    { wi: 30, id: 'mirrorbounce', name: 'Mirror Bounce', icon: 'gembig', rarity: 'rare', cap: 4,
      steps: [{ desc: '+1 ricochet through the mirror maze.', f: () => { P.ricochet += 1; } }] },
    // W32–W36
    { wi: 31, id: 'wellgravity', name: 'Well Gravity', icon: 'octopus', rarity: 'epic', cap: 5,
      steps: [{ desc: '+6% damage per enemy pulled into your gravity well.', f: () => { P.abyssal = (P.abyssal || 0) + 1; } }] },
    { wi: 32, id: 'sporecloud', name: 'Spore Cloud', icon: 'crocodilo', rarity: 'epic',
      steps: pulseSteps('#60d030', true, 10) },
    { wi: 33, id: 'cryotouch', name: 'Cryo Touch', icon: 'gem', rarity: 'uncommon', cap: 5,
      steps: [{ desc: 'cryo lab — hits leave enemies sluggish.', f: () => { P.chillHit = (P.chillHit || 0) + 1; } }] },
    { wi: 34, id: 'meteorquake', name: 'Meteor Quake', icon: 'rhino', rarity: 'epic', cap: 5,
      steps: [{ desc: 'meteor impacts on kill shake the alley.', f: () => { P.aftershock = (P.aftershock || 0) + 1; } }] },
    { wi: 35, id: 'echoreach', name: 'Echo Reach', icon: 'gem', rarity: 'rare', cap: 4,
      steps: [{ desc: '+16% attack range in echoing caverns.', f: () => { P.range *= 1.16; } }] },
    // W37–W41
    { wi: 36, id: 'staticedge', name: 'Static Edge', icon: 'coin', rarity: 'rare', cap: 4,
      steps: [{ desc: '+8% crit on the static plains.', f: () => { P.crit = Math.min(0.85, P.crit + 0.08); } }] },
    { wi: 37, id: 'boneguard', name: 'Bone Guard', icon: 'turtle', rarity: 'uncommon', cap: 5,
      steps: [{ desc: '-8% damage taken behind bone desert armor.', f: () => { P.armor *= 0.92; } }] },
    { wi: 38, id: 'glitchrush', name: 'Glitch Rush', icon: 'gem', rarity: 'uncommon', cap: 5,
      steps: [{ desc: '+11% attack speed — reality stutters in your favor.', f: () => { P.fireRate *= 0.89; } }] },
    { wi: 39, id: 'hivefury', name: 'Hive Fury', icon: 'gembig', rarity: 'epic', cap: 5,
      steps: [{ desc: '+7% damage per nearby swarm drone.', f: () => { P.abyssal = (P.abyssal || 0) + 1; } }] },
    { wi: 40, id: 'stormring', name: 'Storm Ring', icon: 'gembig', rarity: 'epic',
      steps: pulseSteps('#4090ff', false, 14) },
    // W42–W46
    { wi: 41, id: 'obsidianbarbs', name: 'Obsidian Barbs', icon: 'turtle', rarity: 'uncommon', cap: 5,
      steps: [{ desc: 'obsidian sea barbs punish melee attackers.', f: () => { P.thorns += 8; } }] },
    { wi: 42, id: 'prismcut', name: 'Prism Cut', icon: 'coin', rarity: 'rare', cap: 5,
      steps: [{ desc: '+6% crit; tower light refracts through your shots.', f: () => { P.crit = Math.min(0.85, P.crit + 0.06); P.prismCrit = (P.prismCrit || 0) + 1; } }] },
    { wi: 43, id: 'warpmagnet', name: 'Warp Magnet', icon: 'gem', rarity: 'rare', cap: 4,
      steps: [{ desc: '+40% pickup radius through warp tunnels.', f: () => { P.magnet *= 1.4; } }] },
    { wi: 44, id: 'coralleech', name: 'Coral Leech', icon: 'heart', rarity: 'epic', cap: 4,
      steps: [{ desc: '+4 HP per kill from coral grave symbiosis.', f: () => { P.vamp += 4; } }] },
    { wi: 45, id: 'emberspire', name: 'Ember Spire', icon: 'flamingo', rarity: 'uncommon', cap: 5,
      steps: [{ desc: 'ember spire heat scorches close foes.', f: () => { P.burnAura += 7; } }] },
    // W47–W50
    { wi: 46, id: 'acidrain', name: 'Acid Rain', icon: 'crocodilo', rarity: 'epic',
      steps: pulseSteps('#40c820', true, 12) },
    { wi: 47, id: 'forgetremor', name: 'Forge Tremor', icon: 'crocodilo', rarity: 'rare', cap: 5,
      steps: [{ desc: 'star-forged rounds crack the ground on impact.', f: () => { P.tremor = (P.tremor || 0) + 1; } }] },
    { wi: 48, id: 'dreamhoard', name: 'Dream Hoard', icon: 'coin', rarity: 'rare', cap: 4,
      steps: [{ desc: '+20% gold & XP from dream fog treasures.', f: () => { P.goldMul *= 1.2; P.xpMul *= 1.2; } }] },
    { wi: 48, id: 'chaosrupture', name: 'Chaos Rupture', icon: 'rhino', rarity: 'legendary', cap: 5,
      steps: [{ desc: 'kills tear reality — frequent quake eruptions.', f: () => { P.aftershock = (P.aftershock || 0) + 1; } }] },
    { wi: 49, id: 'swarmcrown', name: 'Swarm Crown', icon: 'gembig', rarity: 'legendary',
      steps: [
        { desc: 'the final swarm empowers you near crowds.', f: () => { P.abyssal = (P.abyssal || 0) + 1; } },
        { desc: '+6% damage per nearby enemy (stacking).', f: () => { P.abyssal = (P.abyssal || 0) + 1; } },
        { desc: 'kills erupt devastating quakes.', f: () => { P.aftershock = (P.aftershock || 0) + 1; } },
        { desc: 'crown heat scorches all nearby foes.', f: () => { P.burnAura += 10; } },
      ],
      evo: { name: 'Hive Sovereign', icon: 'gembig',
        desc: 'EVOLVE — massive swarm damage, constant quakes, and a blazing aura.',
        f: () => { P.abyssal = (P.abyssal || 0) + 2; P.aftershock = (P.aftershock || 0) + 2; P.burnAura += 14; } } },
  ];

  const WORLD_SKILLS = [];
  const WORLD_SKILL_MIN = {};

  for (const def of CARD_DEFS) {
    const wi = def.wi;
    const band = Math.floor(wi / 5);
    const rarity = def.evo ? def.rarity : (wi >= 45 ? 'legendary' : wi >= 30 ? 'epic' : def.rarity);
    const card = {
      id: def.id,
      name: def.name,
      icon: def.icon,
      rarity: def.rarity || rarity,
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
