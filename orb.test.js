const test = require('node:test');
const assert = require('node:assert/strict');

// Keep in sync with js/game.js swarm XP helpers
function normalizeSwarmXp(xp){
  const x = Math.round(+xp || 1);
  return x <= 1 ? 1 : 2;
}
function swarmOrbTier(xp){ return normalizeSwarmXp(xp) <= 1 ? 1 : 2; }

test('swarm XP stays W1-sized — never large gold or lucky tiers', () => {
  assert.equal(normalizeSwarmXp(1), 1);
  assert.equal(normalizeSwarmXp(5), 2);
  assert.equal(normalizeSwarmXp(12), 2);
  assert.equal(swarmOrbTier(1), 1);
  assert.equal(swarmOrbTier(3), 2);
  assert.equal(swarmOrbTier(10), 2);
  assert.ok(swarmOrbTier(99) <= 2);
});
