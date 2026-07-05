'use strict';
// Milestone characters unlocked after World 7 (W8+). Merged into CHARACTERS by world-ext.js.

(function () {
  function charDraw(color) {
    return function (ctx, size, t) {
      const bob = Math.sin(t * 3) * size * 0.02;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, -size * 0.12 + bob, size * 0.26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-size * 0.17, size * 0.04 + bob, size * 0.34, size * 0.3);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath();
      ctx.arc(-size * 0.06, -size * 0.14 + bob, size * 0.04, 0, Math.PI * 2);
      ctx.fill();
    };
  }

  window.EXT_CHARS = [
    { id: 'swarm_scout', name: 'Swarm Scout', desc: 'Fast recon striker — unlocks at World 8.', rarity: 'world', worldUnlock: 7,
      baseStats: { maxHp: 102, dmg: 10.4, speed: 281 }, register() {}, draw: charDraw('#7ec8e3') },
    { id: 'hive_knight', name: 'Hive Knight', desc: 'Armored frontline — World 10.', rarity: 'world', worldUnlock: 9,
      baseStats: { maxHp: 112, dmg: 10.6, speed: 255 }, register() {}, draw: charDraw('#c9a227') },
    { id: 'rot_weaver', name: 'Rot Weaver', desc: 'Threads chaos into every shot — World 12.', rarity: 'world', worldUnlock: 11,
      baseStats: { maxHp: 106, dmg: 11, speed: 260 }, register() {}, draw: charDraw('#9b59b6') },
    { id: 'void_runner', name: 'Void Runner', desc: 'Slips between swarm bands — World 15.', rarity: 'world', worldUnlock: 14,
      baseStats: { maxHp: 100, dmg: 11.2, speed: 286 }, register() {}, draw: charDraw('#6c5ce7') },
    { id: 'coral_guard', name: 'Coral Guard', desc: 'Reef tank with steady fire — World 18.', rarity: 'world', worldUnlock: 17,
      baseStats: { maxHp: 118, dmg: 9.8, speed: 244 }, register() {}, draw: charDraw('#00cec9') },
    { id: 'storm_caller', name: 'Storm Caller', desc: 'Lightning tempo and range — World 22.', rarity: 'world', worldUnlock: 21,
      baseStats: { maxHp: 104, dmg: 11.4, speed: 265, range: 360 }, register() {}, draw: charDraw('#74b9ff') },
    { id: 'ember_sage', name: 'Ember Sage', desc: 'Burns the swarm back — World 26.', rarity: 'world', worldUnlock: 25,
      baseStats: { maxHp: 108, dmg: 11.6, speed: 250 }, register() {}, draw: charDraw('#e17055') },
    { id: 'frost_warden', name: 'Frost Warden', desc: 'Slows the tide with chill shots — World 30.', rarity: 'world', worldUnlock: 29,
      baseStats: { maxHp: 114, dmg: 10.8, speed: 239, bslow: 0.92 }, register() {}, draw: charDraw('#a29bfe') },
    { id: 'chrono_mite', name: 'Chrono Mite', desc: 'Time-skipping striker — World 35.', rarity: 'world', worldUnlock: 34,
      baseStats: { maxHp: 102, dmg: 11, speed: 296, fireRate: 0.24 }, register() {}, draw: charDraw('#fdcb6e') },
    { id: 'omega_pilot', name: 'Omega Pilot', desc: 'Endgame ace — World 40.', rarity: 'world', worldUnlock: 39,
      baseStats: { maxHp: 110, dmg: 11.8, speed: 276 }, register() {}, draw: charDraw('#ff7675') },
    { id: 'swarm_sovereign', name: 'Swarm Sovereign', desc: 'Rules the hive — World 45.', rarity: 'world', worldUnlock: 44,
      baseStats: { maxHp: 120, dmg: 12, speed: 260 }, register() {}, draw: charDraw('#dfe6e9') },
    { id: 'final_vector', name: 'Final Vector', desc: 'Last stand hero — World 50.', rarity: 'world', worldUnlock: 49,
      baseStats: { maxHp: 115, dmg: 12.2, speed: 291 }, register() {}, draw: charDraw('#ffffff') },
  ];
})();
