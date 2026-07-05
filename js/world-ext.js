'use strict';
// Wires 50-world expansion: worlds, skills, chars, pets, cutscenes, scaling.

(function () {
  if (typeof buildExtendedWorlds !== 'function') return;

  // ---- 39 new worlds (indices 11–49) → 50 total ----
  WORLDS.push.apply(WORLDS, buildExtendedWorlds(11, 49));

  const STORY_INTROS = [
    'THE SWARM INVADES THE GRASSLANDS.',
    'CITRUS COAST — BRAINROT HITS THE BEACH.',
    'FORESTA FRUTOSA — THE TREES ARE NOT SAFE.',
    'GELATO GLACIER — COLD BRAINROT APPROACHES.',
    'CIRCO BRAINROTTO — THE SHOW MUST GO WRONG.',
    'AUTUMN WOODS — LEAVES FALL, SWARM RISES.',
    'SWAMP — SOMETHING STIRS IN THE MUD.',
    'SKYLAND — THE SWARM TAKES FLIGHT.',
    'CRYSTAL CAVES — SHARDS AND FANGS.',
    'VOLCANO — THE SWARM BURNS BRIGHT.',
    'DIRT DEPTHS — THE FINAL BAND BEFORE THE HIVE.',
  ];
  const STORY_OUTROS = [
    'GRASSLANDS CLEARED — BUT THE SWARM REGROUPS.',
    'CITRUS COAST SECURED.',
    'FORESTA FRUTOSA PURGED.',
    'GLACIER HELD — FOR NOW.',
    'CIRCO BRAINROTTO CLOSED.',
    'AUTUMN WOODS QUIET AGAIN.',
    'SWAMP DRAINED OF BRAINROT.',
    'SKYLAND RECLAIMED.',
    'CRYSTAL CAVES SHATTERED.',
    'VOLCANO SILENCED.',
    'DIRT DEPTHS CONQUERED — THE HIVE AWAITS.',
  ];
  for (let i = 0; i < Math.min(11, WORLDS.length); i++) {
    if (!WORLDS[i].introLine) WORLDS[i].introLine = STORY_INTROS[i];
    if (!WORLDS[i].outroLine) WORLDS[i].outroLine = STORY_OUTROS[i];
    if (!WORLDS[i].chalIntroLine) WORLDS[i].chalIntroLine = 'CHALLENGER: ' + WORLDS[i].name + ' — 15 MINUTES.';
    if (!WORLDS[i].chalOutroLine) WORLDS[i].chalOutroLine = 'CHALLENGER ' + WORLDS[i].name + ' CONQUERED.';
  }

  // ---- World-exclusive skills W8–W50 ----
  if (typeof WORLD_SKILLS !== 'undefined' && Array.isArray(WORLD_SKILLS)) {
    for (const sk of WORLD_SKILLS) {
      UPGRADES.push(sk);
      CARD_MINWORLD[sk.id] = sk.minWorld;
      sk.minWorld = sk.minWorld;
    }
  }

  // ---- Milestone characters & pets ----
  if (typeof EXT_CHARS !== 'undefined') {
    for (const c of EXT_CHARS) CHARACTERS.push(c);
  }
  if (typeof EXT_PETS !== 'undefined') {
    for (const p of EXT_PETS) PETS.push(p);
    const _origIsPetOwned = isPetOwned;
    window.isPetOwned = function (id) {
      if (_origIsPetOwned(id)) return true;
      const pet = PETS.find(pt => pt.id === id);
      if (pet && pet.worldUnlock != null) {
        return pet.worldUnlock <= +(localStorage.getItem('br_unlocked') || 0);
      }
      return false;
    };
  }

  // ---- Re-clamp progression for 50 worlds ----
  unlockedMax = clamp(Math.floor(+(localStorage.getItem('br_unlocked') || 0)), 0, WORLDS.length - 1);
  selWorld = Math.min(selWorld, unlockedMax);
  if (chalUnlocked >= 0) {
    chalUnlocked = Math.max(0, Math.min(WORLDS.length - 1, +(localStorage.getItem('br_ch_unlocked') || 0)));
  }

  // ---- Extended scaling past world band 9 ----
  window.swarmFuryMul = function () {
    const sf = P.swarmFury || 0;
    if (!sf || !enemies.length) return 1;
    let n = 0;
    for (const e of enemies) {
      if (e.isBoss || e.hp <= 0) continue;
      if (dist2(P.x, P.y, e.x, e.y) < 40000) { n++; if (n >= 8) break; }
    }
    return 1 + Math.min(0.5, sf * 0.08 * n);
  };

  window.extBandMul = function (perBand, capBand) {
    const b = worldBand();
    if (b <= capBand) return 1 + b * perBand;
    return 1 + capBand * perBand + (b - capBand) * perBand * 0.65;
  };

  if (typeof refreshTopbar === 'function') refreshTopbar();
  if (typeof refreshWorldSel === 'function') refreshWorldSel();
  if (typeof initDebugTools === 'function') initDebugTools();
})();
