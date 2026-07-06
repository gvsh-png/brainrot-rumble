'use strict';
// Extra world skills — 2 per world W12-50, + signature W6-11 (merged in world-skills.js).
(function () {
  window.WSK_REGISTRY = {
  "w12b": {
    "type": "aura",
    "col": "#ff40b0"
  },
  "w12c": {
    "type": "trail",
    "col": "#80f0ff"
  },
  "w13b": {
    "type": "trail",
    "col": "#8a5030"
  },
  "w13c": {
    "type": "bolt",
    "col": "#e85030"
  },
  "w14b": {
    "type": "aura",
    "col": "#40a820"
  },
  "w14c": {
    "type": "still",
    "col": "#60c040"
  },
  "w15b": {
    "type": "pull",
    "col": "#b8d8f8"
  },
  "w15c": {
    "type": "bloom",
    "col": "#4090ff"
  },
  "w16b": {
    "type": "hit",
    "col": "#20b8a0"
  },
  "w16c": {
    "type": "aura",
    "col": "#30e8c8"
  },
  "w17b": {
    "type": "aura",
    "col": "#f0a020"
  },
  "w17c": {
    "type": "dash",
    "col": "#ffe080"
  },
  "w18b": {
    "type": "orbit",
    "col": "#ff80c0"
  },
  "w18c": {
    "type": "killgold",
    "col": "#ffd24a"
  },
  "w19b": {
    "type": "armor",
    "col": "#ffc0a0"
  },
  "w19c": {
    "type": "hurt",
    "col": "#ff6020"
  },
  "w20b": {
    "type": "killzone",
    "col": "#40ff60"
  },
  "w20c": {
    "type": "speed",
    "col": "#80ff80"
  },
  "w21b": {
    "type": "echo",
    "col": "#d8b0ff"
  },
  "w21c": {
    "type": "magnet",
    "col": "#b06ff0"
  },
  "w22b": {
    "type": "aura",
    "col": "#ff5020"
  },
  "w22c": {
    "type": "killzone",
    "col": "#ff6a20"
  },
  "w23b": {
    "type": "hit",
    "col": "#bfe6ff"
  },
  "w23c": {
    "type": "bolt",
    "col": "#c8e8ff"
  },
  "w24b": {
    "type": "armor",
    "col": "#ffa0d0"
  },
  "w24c": {
    "type": "bounce",
    "col": "#ff80c0"
  },
  "w25b": {
    "type": "bloom",
    "col": "#ffe060"
  },
  "w25c": {
    "type": "mark",
    "col": "#fff080"
  },
  "w26b": {
    "type": "trail",
    "col": "#8040c0"
  },
  "w26c": {
    "type": "pull",
    "col": "#b06ff0"
  },
  "w27b": {
    "type": "hit",
    "col": "#c8b090"
  },
  "w27c": {
    "type": "dash",
    "col": "#e8d0a0"
  },
  "w28b": {
    "type": "crit",
    "col": "#e040ff"
  },
  "w28c": {
    "type": "trail",
    "col": "#ff80ff"
  },
  "w29b": {
    "type": "armor",
    "col": "#6040a0"
  },
  "w29c": {
    "type": "econ",
    "col": "#9080c0"
  },
  "w30b": {
    "type": "bloom",
    "col": "#ff9030"
  },
  "w30c": {
    "type": "hit",
    "col": "#ffe080"
  },
  "w31b": {
    "type": "ricochet",
    "col": "#80d8ff"
  },
  "w31c": {
    "type": "crit",
    "col": "#a0e8ff"
  },
  "w32b": {
    "type": "orbit",
    "col": "#8040c0"
  },
  "w32c": {
    "type": "pull",
    "col": "#b06ff0"
  },
  "w33b": {
    "type": "aura",
    "col": "#60d030"
  },
  "w33c": {
    "type": "hit",
    "col": "#40a020"
  },
  "w34b": {
    "type": "still",
    "col": "#bfe6ff"
  },
  "w34c": {
    "type": "bolt",
    "col": "#c8e8ff"
  },
  "w35b": {
    "type": "mark",
    "col": "#c8a080"
  },
  "w35c": {
    "type": "trail",
    "col": "#8a7060"
  },
  "w36b": {
    "type": "echo",
    "col": "#a0d8ff"
  },
  "w36c": {
    "type": "bolt",
    "col": "#80c8ff"
  },
  "w37b": {
    "type": "hurt",
    "col": "#ffe060"
  },
  "w37c": {
    "type": "speed",
    "col": "#fff0a0"
  },
  "w38b": {
    "type": "armor",
    "col": "#e8e0d0"
  },
  "w38c": {
    "type": "killzone",
    "col": "#d8c8b0"
  },
  "w39b": {
    "type": "trail",
    "col": "#80ff80"
  },
  "w39c": {
    "type": "dodge",
    "col": "#a0ffa0"
  },
  "w40b": {
    "type": "armor",
    "col": "#ffd24a"
  },
  "w40c": {
    "type": "mark",
    "col": "#ffe080"
  },
  "w41b": {
    "type": "orbit",
    "col": "#4090ff"
  },
  "w41c": {
    "type": "bolt",
    "col": "#80c8ff"
  },
  "w42b": {
    "type": "flare",
    "col": "#6080c0"
  },
  "w42c": {
    "type": "thorns",
    "col": "#4050a0"
  },
  "w43b": {
    "type": "bolt",
    "col": "#ffd24a"
  },
  "w43c": {
    "type": "prism",
    "col": "#ffe080"
  },
  "w44b": {
    "type": "speed",
    "col": "#d8b0ff"
  },
  "w44c": {
    "type": "magnet",
    "col": "#b06ff0"
  },
  "w45b": {
    "type": "still",
    "col": "#40d8c0"
  },
  "w45c": {
    "type": "pull",
    "col": "#60e8d0"
  },
  "w46b": {
    "type": "trail",
    "col": "#ff6020"
  },
  "w46c": {
    "type": "bloom",
    "col": "#ff9040"
  },
  "w47b": {
    "type": "aura",
    "col": "#70e040"
  },
  "w47c": {
    "type": "deluge",
    "col": "#90ff50"
  },
  "w48b": {
    "type": "hit",
    "col": "#ff8040"
  },
  "w48c": {
    "type": "bolt",
    "col": "#ffc080"
  },
  "w49b": {
    "type": "mist",
    "col": "#c8b0ff"
  },
  "w50b": {
    "type": "armor",
    "col": "#ffd24a"
  },
  "w50c": {
    "type": "lash",
    "col": "#b06ff0"
  },
  "w6d": {
    "type": "bolt",
    "col": "#c87830"
  },
  "w7d": {
    "type": "orbit",
    "col": "#60c040"
  },
  "w8d": {
    "type": "bloom",
    "col": "#c8f0ff"
  },
  "w9d": {
    "type": "aura",
    "col": "#c8e8ff"
  },
  "w10d": {
    "type": "trail",
    "col": "#ff6a20"
  },
  "w11d": {
    "type": "killgold",
    "col": "#caa15a"
  }
};
  window.WSK_EXTRA_DEFS = [
  {
    "wi": 11,
    "id": "neonsign",
    "name": "Sign Flare",
    "key": "w12b",
    "desc": "neon glare washes over nearby foes.",
    "icon": "flamingo",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 11,
    "id": "chrometrail",
    "name": "Chrome Slide",
    "key": "w12c",
    "desc": "skate a glowing trail while moving.",
    "icon": "gembig",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 12,
    "id": "oilslick",
    "name": "Oil Slick",
    "key": "w13b",
    "desc": "factory oil slows anything you cross.",
    "icon": "gembig",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 12,
    "id": "pressdrop",
    "name": "Hydraulic Drop",
    "key": "w13c",
    "desc": "periodic piston strike on nearest foe.",
    "icon": "gembig",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 13,
    "id": "boggas",
    "name": "Marsh Gas",
    "key": "w14b",
    "desc": "marsh fumes choke nearby enemies.",
    "icon": "flamingo",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 13,
    "id": "leechvine",
    "name": "Leechvine",
    "key": "w14c",
    "desc": "standing still lets vines restore HP.",
    "icon": "heart",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 14,
    "id": "lowg",
    "name": "Low-G Drift",
    "key": "w15b",
    "desc": "moon gravity tugs foes toward you.",
    "icon": "octopus",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 14,
    "id": "craterpulse",
    "name": "Crater Bloom",
    "key": "w15c",
    "desc": "lunar shock blooms under your feet.",
    "icon": "crocodilo",
    "rarity": "epic"
  },
  {
    "wi": 15,
    "id": "pressure",
    "name": "Crush Depth",
    "key": "w16b",
    "desc": "hits apply deep-pressure slow.",
    "icon": "gem",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 15,
    "id": "biolume",
    "name": "Biolume",
    "key": "w16c",
    "desc": "bioluminescent haze damages nearby foes.",
    "icon": "flamingo",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 16,
    "id": "dustveil",
    "name": "Dust Veil",
    "key": "w17b",
    "desc": "sand veil scours nearby enemies.",
    "icon": "flamingo",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 16,
    "id": "mirage",
    "name": "Mirage Step",
    "key": "w17c",
    "desc": "dashing kicks up blinding sand bursts.",
    "icon": "tralalero",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 17,
    "id": "carousel",
    "name": "Carousel Spin",
    "key": "w18b",
    "desc": "carnival lights orbit and zap foes.",
    "icon": "gem",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 17,
    "id": "ticketpunch",
    "name": "Ticket Punch",
    "key": "w18c",
    "desc": "kills may spit bonus gold tickets.",
    "icon": "coin",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 18,
    "id": "heatshield",
    "name": "Heat Shield",
    "key": "w19b",
    "desc": "foundry plating reduces damage taken.",
    "icon": "turtle",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 18,
    "id": "sparkspray",
    "name": "Spark Spray",
    "key": "w19c",
    "desc": "getting hit sprays molten sparks.",
    "icon": "rhino",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 19,
    "id": "culture",
    "name": "Petri Burst",
    "key": "w20b",
    "desc": "kills leave a toxic culture dish.",
    "icon": "rhino",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 19,
    "id": "mutagen",
    "name": "Mutagen Rush",
    "key": "w20c",
    "desc": "+attack speed from unstable serum.",
    "icon": "gem",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 20,
    "id": "split",
    "name": "Wave Split",
    "key": "w21b",
    "desc": "hits echo at the impact site.",
    "icon": "gem",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 20,
    "id": "riftpull",
    "name": "Rift Pull",
    "key": "w21c",
    "desc": "wider pickup; loot warps on kills.",
    "icon": "gem",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 21,
    "id": "heatwave",
    "name": "Heat Wave",
    "key": "w22b",
    "desc": "core heat radiates around you.",
    "icon": "flamingo",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 21,
    "id": "slagburst",
    "name": "Slag Burst",
    "key": "w22c",
    "desc": "kills splash molten slag.",
    "icon": "rhino",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 22,
    "id": "hoarfrost",
    "name": "Hoarfrost",
    "key": "w23b",
    "desc": "hits leave hoarfrost slow.",
    "icon": "gem",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 22,
    "id": "icicle",
    "name": "Icicle Rain",
    "key": "w23c",
    "desc": "periodic icicle drop on nearest foe.",
    "icon": "gembig",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 23,
    "id": "sugarcoat",
    "name": "Sugar Coat",
    "key": "w24b",
    "desc": "candy shell absorbs blows.",
    "icon": "turtle",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 23,
    "id": "jellybounce",
    "name": "Jelly Bounce",
    "key": "w24c",
    "desc": "+1 bullet bounce through gumdrop walls.",
    "icon": "gembig",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 24,
    "id": "staticfield",
    "name": "Static Field",
    "key": "w25b",
    "desc": "static blooms crackle around you.",
    "icon": "crocodilo",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 24,
    "id": "stormmark",
    "name": "Storm Mark",
    "key": "w25c",
    "desc": "marked foes take bonus damage.",
    "icon": "coin",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 25,
    "id": "voidpetal",
    "name": "Void Petal",
    "key": "w26b",
    "desc": "void petals drift behind you.",
    "icon": "gembig",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 25,
    "id": "gardenpull",
    "name": "Garden Pull",
    "key": "w26c",
    "desc": "void roots tug enemies inward.",
    "icon": "octopus",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 26,
    "id": "ticktock",
    "name": "Tick Tock",
    "key": "w27b",
    "desc": "hits apply clockwork slow.",
    "icon": "gem",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 26,
    "id": "springcoil",
    "name": "Spring Coil",
    "key": "w27c",
    "desc": "dash end releases gear shock.",
    "icon": "tralalero",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 27,
    "id": "overcharge",
    "name": "Overcharge",
    "key": "w28b",
    "desc": "+crit; plasma edges crackle.",
    "icon": "coin",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 27,
    "id": "fieldline",
    "name": "Field Line",
    "key": "w28c",
    "desc": "plasma trail while moving.",
    "icon": "gembig",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 28,
    "id": "shade",
    "name": "Shade Cloak",
    "key": "w29b",
    "desc": "shadow cloak softens hits.",
    "icon": "turtle",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 28,
    "id": "goldshadow",
    "name": "Shadow Toll",
    "key": "w29c",
    "desc": "+gold & XP from canyon salvage.",
    "icon": "coin",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 29,
    "id": "sunspot",
    "name": "Sunspot",
    "key": "w30b",
    "desc": "sunspots flare under your feet.",
    "icon": "crocodilo",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 29,
    "id": "heatstroke",
    "name": "Heatstroke",
    "key": "w30c",
    "desc": "hits scorch with solar burns.",
    "icon": "gem",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 30,
    "id": "reflection",
    "name": "Reflection",
    "key": "w31b",
    "desc": "+1 ricochet off mirror angles.",
    "icon": "gembig",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 30,
    "id": "glasscut",
    "name": "Glass Cut",
    "key": "w31c",
    "desc": "+crit through refracted light.",
    "icon": "coin",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 31,
    "id": "orbitrock",
    "name": "Orbit Rock",
    "key": "w32b",
    "desc": "rocks orbit and crush foes.",
    "icon": "gem",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 31,
    "id": "wellpull",
    "name": "Well Pull",
    "key": "w32c",
    "desc": "gravity well tugs the swarm.",
    "icon": "octopus",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 32,
    "id": "pollen",
    "name": "Pollen Cloud",
    "key": "w33b",
    "desc": "pollen damages nearby foes.",
    "icon": "flamingo",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 32,
    "id": "rootsnare",
    "name": "Root Snare",
    "key": "w33c",
    "desc": "hits root enemies briefly.",
    "icon": "gem",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 33,
    "id": "cryopod",
    "name": "Cryo Pod",
    "key": "w34b",
    "desc": "standing still cryo-heals you.",
    "icon": "heart",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 33,
    "id": "shatterbolt",
    "name": "Shatter Bolt",
    "key": "w34c",
    "desc": "periodic cryo bolt on nearest foe.",
    "icon": "gembig",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 34,
    "id": "impactmark",
    "name": "Impact Mark",
    "key": "w35b",
    "desc": "marked foes take meteor bonus damage.",
    "icon": "coin",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 34,
    "id": "rubble",
    "name": "Rubble Trail",
    "key": "w35c",
    "desc": "meteor rubble grinds underfoot.",
    "icon": "gembig",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 35,
    "id": "reverb",
    "name": "Reverb",
    "key": "w36b",
    "desc": "hits echo louder in caverns.",
    "icon": "gem",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 35,
    "id": "sonar",
    "name": "Sonar Ping",
    "key": "w36c",
    "desc": "sonar pings reveal & strike foes.",
    "icon": "gembig",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 36,
    "id": "staticcoat",
    "name": "Static Coat",
    "key": "w37b",
    "desc": "getting hit zaps attackers.",
    "icon": "rhino",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 36,
    "id": "plaincharge",
    "name": "Plain Charge",
    "key": "w37c",
    "desc": "+attack speed across static plains.",
    "icon": "gem",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 37,
    "id": "marrow",
    "name": "Marrow Guard",
    "key": "w38b",
    "desc": "bone plating reduces damage.",
    "icon": "turtle",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 37,
    "id": "skullburst",
    "name": "Skull Burst",
    "key": "w38c",
    "desc": "kills erupt bone shrapnel.",
    "icon": "rhino",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 38,
    "id": "pixeltrail",
    "name": "Pixel Trail",
    "key": "w39b",
    "desc": "glitch pixels corrupt the ground.",
    "icon": "gembig",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 38,
    "id": "lagstep",
    "name": "Lag Step",
    "key": "w39c",
    "desc": "reality stutters — brief dodge frames.",
    "icon": "gem",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 39,
    "id": "hiveshield",
    "name": "Hive Shield",
    "key": "w40b",
    "desc": "chitin plating absorbs hits.",
    "icon": "turtle",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 39,
    "id": "stingmark",
    "name": "Sting Mark",
    "key": "w40c",
    "desc": "marked targets take venom bonus.",
    "icon": "coin",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 40,
    "id": "galewall",
    "name": "Gale Wall",
    "key": "w41b",
    "desc": "wind motes orbit and cut foes.",
    "icon": "gem",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 40,
    "id": "rainneedle",
    "name": "Rain Needle",
    "key": "w41c",
    "desc": "periodic rain needle strike.",
    "icon": "gembig",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 41,
    "id": "glasswave",
    "name": "Glass Wave",
    "key": "w42b",
    "desc": "obsidian shockwaves pulse outward.",
    "icon": "flamingo",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 41,
    "id": "barbed",
    "name": "Barbed Current",
    "key": "w42c",
    "desc": "barbed obsidian punishes touch.",
    "icon": "turtle",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 42,
    "id": "lightbeam",
    "name": "Light Beam",
    "key": "w43b",
    "desc": "tower light periodically lances a foe.",
    "icon": "gembig",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 42,
    "id": "spectrum",
    "name": "Spectrum",
    "key": "w43c",
    "desc": "+crit; crits split light shards.",
    "icon": "coin",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 43,
    "id": "tunnelrun",
    "name": "Tunnel Run",
    "key": "w44b",
    "desc": "+attack speed in warp tunnels.",
    "icon": "gem",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 43,
    "id": "warpstep",
    "name": "Warp Step",
    "key": "w44c",
    "desc": "warp hauls distant loot closer.",
    "icon": "gem",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 44,
    "id": "coralwall",
    "name": "Coral Wall",
    "key": "w45b",
    "desc": "standing still, coral heals you.",
    "icon": "heart",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 44,
    "id": "tidepull",
    "name": "Tide Pull",
    "key": "w45c",
    "desc": "undertow tugs enemies toward you.",
    "icon": "octopus",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 45,
    "id": "cinderskate",
    "name": "Cinder Skate",
    "key": "w46b",
    "desc": "cinder trail while moving.",
    "icon": "gembig",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 45,
    "id": "spireburst",
    "name": "Spire Burst",
    "key": "w46c",
    "desc": "ember spire blooms at your feet.",
    "icon": "crocodilo",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 46,
    "id": "acidmist",
    "name": "Acid Mist",
    "key": "w47b",
    "desc": "acid mist corrodes nearby foes.",
    "icon": "flamingo",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 46,
    "id": "downpour",
    "name": "Downpour",
    "key": "w47c",
    "desc": "acid puddles drip ahead of you.",
    "icon": "crocodilo",
    "rarity": "epic"
  },
  {
    "wi": 47,
    "id": "forgebrand",
    "name": "Forge Brand",
    "key": "w48b",
    "desc": "hits brand foes with star-fire.",
    "icon": "gem",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 47,
    "id": "anvildrop",
    "name": "Anvil Drop",
    "key": "w48c",
    "desc": "periodic anvil strike from the forge.",
    "icon": "gembig",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 48,
    "id": "lullaby",
    "name": "Lullaby",
    "key": "w49b",
    "desc": "dream fog slows the swarm.",
    "icon": "gem",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 49,
    "id": "royalguard",
    "name": "Royal Guard",
    "key": "w50b",
    "desc": "crown armor — take less damage.",
    "icon": "turtle",
    "rarity": "uncommon",
    "cap": 5
  },
  {
    "wi": 49,
    "id": "swarmlash",
    "name": "Swarm Lash",
    "key": "w50c",
    "desc": "tendrils lash the nearest foe.",
    "icon": "gembig",
    "rarity": "epic",
    "cap": 5
  },
  {
    "wi": 5,
    "id": "acornshot",
    "name": "Acorn Shot",
    "key": "w6d",
    "desc": "squirrels away — periodic acorn strike.",
    "icon": "gembig",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 6,
    "id": "willowisp",
    "name": "Will-o-Wisp",
    "key": "w7d",
    "desc": "will-o-wisps orbit and poison touchers.",
    "icon": "gem",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 7,
    "id": "cloudbank",
    "name": "Cloud Bank",
    "key": "w8d",
    "desc": "cloud bank blooms with static mist.",
    "icon": "crocodilo",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 8,
    "id": "gemglow",
    "name": "Gem Glow",
    "key": "w9d",
    "desc": "crystal glow shreds nearby foes.",
    "icon": "flamingo",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 9,
    "id": "ashfall",
    "name": "Ashfall",
    "key": "w10d",
    "desc": "volcanic ash trail while moving.",
    "icon": "gembig",
    "rarity": "rare",
    "cap": 4
  },
  {
    "wi": 10,
    "id": "fossil",
    "name": "Fossil Cache",
    "key": "w11d",
    "desc": "kills may unearth buried coin caches.",
    "icon": "coin",
    "rarity": "rare",
    "cap": 4
  }
];
})();
