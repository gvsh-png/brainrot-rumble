'use strict';
// One world-exclusive upgrade per world from W8 onward (index 7+).

(function(){
  const SKILL_TYPES = [
    { id:'swarmfury', name:'Swarm Fury', icon:'coin', rarity:'uncommon', cap:5,
      desc:'+8% damage per nearby enemy (caps high).',
      apply:()=>{ P.swarmFury=(P.swarmFury||0)+1; } },
    { id:'swarmguard', name:'Swarm Guard', icon:'turtle', rarity:'uncommon', cap:5,
      desc:'-5% damage taken.',
      apply:()=>{ P.armor*=0.95; } },
    { id:'swarmhaste', name:'Swarm Haste', icon:'gem', rarity:'uncommon', cap:5,
      desc:'+10% attack speed.',
      apply:()=>{ P.fireRate*=0.90; } },
    { id:'swarmreach', name:'Swarm Reach', icon:'gem', rarity:'rare', cap:4,
      desc:'+15% attack range.',
      apply:()=>{ P.range*=1.15; } },
    { id:'swarmloot', name:'Swarm Loot', icon:'coin', rarity:'rare', cap:4,
      desc:'+12% gold and XP.',
      apply:()=>{ P.goldMul*=1.12; P.xpMul*=1.12; } },
    { id:'swarmnova', name:'Swarm Pulse', icon:'gembig', rarity:'epic', cap:3,
      desc:'Shockwave hits 10% harder.',
      apply:()=>{ P.novaPow=(P.novaPow||1)*1.10; if(!P.nova){ P.nova=true; P.novaCdBase=5; } } },
    { id:'swarmcrit', name:'Swarm Crit', icon:'coin', rarity:'rare', cap:4,
      desc:'+6% crit chance.',
      apply:()=>{ P.crit=Math.min(0.85,P.crit+0.06); } },
  ];

  const WORLD_SKILLS = [];
  const WORLD_SKILL_MIN = {};

  for(let wi=7; wi<50; wi++){
    const tpl = SKILL_TYPES[wi % SKILL_TYPES.length];
    const id = tpl.id + '_w' + (wi+1);
    WORLD_SKILLS.push({
      id,
      name: tpl.name + ' W' + (wi+1),
      icon: tpl.icon,
      rarity: wi >= 40 ? 'legendary' : wi >= 25 ? 'epic' : tpl.rarity,
      cap: tpl.cap,
      minWorld: wi,
      steps: [{ desc: tpl.desc, f: tpl.apply }],
    });
    WORLD_SKILL_MIN[id] = wi;
  }

  window.WORLD_SKILLS = WORLD_SKILLS;
  window.WORLD_SKILL_MIN = WORLD_SKILL_MIN;
})();
