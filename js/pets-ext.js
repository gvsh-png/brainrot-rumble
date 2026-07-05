'use strict';
// Milestone pets unlocked after World 7. Merged into PETS by world-ext.js.

(function () {
  function petDraw(color) {
    return function (ctx, size, t) {
      const bob = Math.sin(t * 4) * size * 0.04;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, bob, size * 0.22, size * 0.17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(size * 0.08, -size * 0.04 + bob, size * 0.035, 0, Math.PI * 2);
      ctx.fill();
    };
  }

  window.EXT_PETS = [
    { id: 'mite_buddy', name: 'Mite Buddy', desc: 'Drops a heart every 15 kills — World 8.', rarity: 'uncommon', worldUnlock: 7,
      register() {
        let k = 0;
        onHook('onKill', () => { k++; if (k % 15 === 0 && typeof gems !== 'undefined' && typeof P !== 'undefined') {
          const a = rand(0, Math.PI * 2), s = rand(60, 110);
          gems.push({ x: P.x, y: P.y, heart: true, heal: 20, t: 0, vx: Math.cos(a) * s, vy: Math.sin(a) * s });
        }});
      }, draw: petDraw('#a8e6cf') },
    { id: 'wasp_wing', name: 'Wasp Wing', desc: '+6% damage while dashing — World 11.', rarity: 'uncommon', worldUnlock: 10,
      register() {
        onHook('onDash', () => { if (typeof P !== 'undefined') P._waspBoost = 4; });
        onHook('petTick', (dt) => {
          if (!P._waspBoost) return;
          P._waspBoost -= dt;
          if (P._waspBoost <= 0) { P._waspBoost = 0; P._waspDmg = 1; }
          else P._waspDmg = 1.06;
        });
      }, draw: petDraw('#ffd93d') },
    { id: 'beetle_shell', name: 'Beetle Shell', desc: '-4% damage taken — World 14.', rarity: 'rare', worldUnlock: 13,
      register() { if (typeof P !== 'undefined') P.armor *= 0.96; }, draw: petDraw('#6c5ce7') },
    { id: 'moth_lantern', name: 'Moth Lantern', desc: '+8% XP magnet range — World 17.', rarity: 'rare', worldUnlock: 16,
      register() { if (typeof P !== 'undefined') P.magnet *= 1.08; }, draw: petDraw('#ffeaa7') },
    { id: 'reef_familiar', name: 'Reef Familiar', desc: 'Heals 8 HP at each wave start — World 20.', rarity: 'rare', worldUnlock: 19,
      register() {
        onHook('waveStart', () => { if (typeof P !== 'undefined') P.hp = Math.min(P.maxHp, P.hp + 8); });
      }, draw: petDraw('#00b894') },
    { id: 'sand_scarab', name: 'Sand Scarab', desc: '+10% gold from kills — World 24.', rarity: 'epic', worldUnlock: 23,
      register() { if (typeof P !== 'undefined') P.goldMul *= 1.10; }, draw: petDraw('#e17055') },
    { id: 'storm_familiar', name: 'Storm Familiar', desc: 'Every 25 kills: mini shockwave — World 28.', rarity: 'epic', worldUnlock: 27,
      register() {
        let k = 0;
        onHook('onKill', () => {
          k++;
          if (k % 25 === 0 && typeof novaBlast === 'function' && typeof P !== 'undefined') {
            novaBlast(P.x, P.y, 70, P.dmg * 0.65);
          }
        });
      }, draw: petDraw('#0984e3') },
    { id: 'ember_pup', name: 'Ember Pup', desc: '+5% crit chance — World 32.', rarity: 'epic', worldUnlock: 31,
      register() { if (typeof P !== 'undefined') P.crit = Math.min(0.75, P.crit + 0.05); }, draw: petDraw('#d63031') },
    { id: 'void_mote', name: 'Void Mote', desc: '+12% attack range — World 36.', rarity: 'epic', worldUnlock: 35,
      register() { if (typeof P !== 'undefined') P.range *= 1.12; }, draw: petDraw('#2d3436') },
    { id: 'chrono_tick', name: 'Chrono Tick', desc: '-8% dash cooldown — World 42.', rarity: 'legendary', worldUnlock: 41,
      register() { if (typeof P !== 'undefined') P.dashMax *= 0.92; }, draw: petDraw('#fdcb6e') },
    { id: 'omega_larva', name: 'Omega Larva', desc: '+10% XP gain — World 48.', rarity: 'legendary', worldUnlock: 47,
      register() { if (typeof P !== 'undefined') P.xpMul *= 1.10; }, draw: petDraw('#e84393') },
    { id: 'swarm_crown', name: 'Swarm Crown', desc: 'Balanced royal buff — World 50.', rarity: 'legendary', worldUnlock: 49,
      register() {
        if (typeof P !== 'undefined') { P.dmg *= 1.08; P.maxHp += 15; P.hp = Math.min(P.maxHp, P.hp + 15); }
      }, draw: petDraw('#fd79a8') },
  ];
})();
