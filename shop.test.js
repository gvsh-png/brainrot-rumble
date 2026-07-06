const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function makeStorage(seed = {}) {
  const store = new Map(Object.entries(seed));
  return {
    getItem(key) { return store.has(key) ? store.get(key) : null; },
    setItem(key, value) { store.set(key, String(value)); },
    removeItem(key) { store.delete(key); },
    dump() { return Object.fromEntries(store.entries()); },
  };
}

function loadShop(seed = {}) {
  const localStorage = makeStorage(seed);
  const nodes = new Map();
  function makeNode() {
    return {
      innerHTML: '',
      textContent: '',
      style: {},
      dataset: {},
      className: '',
      classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
      addEventListener() {},
      removeEventListener() {},
      querySelectorAll() { return []; },
      querySelector() { return null; },
      setAttribute() {},
      getAttribute() { return ''; },
      appendChild() {},
      clientWidth: 400,
      onclick: null,
    };
  }
  const document = {
    createElement(tag) {
      if (tag === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext() { return { drawImage() {}, clearRect() {}, save() {}, restore() {}, translate() {} }; },
          toDataURL() { return 'data:'; },
        };
      }
      return makeNode();
    },
    querySelectorAll() { return []; },
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, makeNode());
      return nodes.get(id);
    },
  };
  const sandbox = {
    console,
    Math,
    Date,
    JSON,
    setTimeout(fn) { fn(); return 1; },
    clearTimeout() {},
    requestAnimationFrame(fn) { fn(); return 1; },
    localStorage,
    document,
    location: { hash: '' },
    window: {},
    WORLDS: { length: 50 },
    SP: new Proxy({}, { get: () => ({ toDataURL() { return 'data:'; }, width: 8, height: 8 }) }),
    SPW: {},
    sfx: { coin() {}, pick() {}, evolve() {} },
    gold: 0,
    saveGold() {},
    $: (id) => document.getElementById(id),
    tintedSprite() { return { toDataURL() { return 'data:'; } }; },
    drawSprite() {},
    compositeCharCanvasURL() { return 'data:'; },
    setStageEmblem() {},
    renderShopCharSection() { return ''; },
    renderPetRecruitSection() { return ''; },
    initRecruitUI() {},
    renderPetSection() {},
    renderCharacterTab() {},
    activeCharId: 'gianni',
    activePetId: null,
    PETS: [],
    CHARACTERS: [],
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  const source = fs.readFileSync('./js/shop.js', 'utf8');
  vm.runInContext(source, sandbox, { filename: 'shop.js' });
  return { sandbox, localStorage };
}

test('instance helpers exist and legacy owned ids migrate to instance records', () => {
  const { sandbox, localStorage } = loadShop({
    br_gear_reset_v4: '1',
    br_items_owned: JSON.stringify(['dmg_common_0', 'hp_rare_2']),
    br_gear_equipped: JSON.stringify({ helmet: 'dmg_common_0' }),
    br_gear_seen: JSON.stringify(['dmg_common_0']),
  });

  assert.equal(typeof sandbox.addGearInstance, 'function');
  assert.equal(typeof sandbox.removeGearInstance, 'function');
  assert.equal(typeof sandbox.fuseGearInstances, 'function');
  assert.equal(typeof sandbox.ownedGearList, 'function');

  const owned = sandbox.ownedGearList();
  assert.equal(owned.length, 2);
  assert.deepEqual(owned.map(x => x.itemId).sort(), ['dmg_common_0', 'hp_rare_2']);
  assert.equal(typeof owned[0].uid, 'string');
  const equip = JSON.parse(localStorage.getItem('br_gear_equipped'));
  assert.equal(equip.helmet, owned.find(x => x.itemId === 'dmg_common_0').uid);
});

test('a cloud restore with higher uids does not collide with newly minted uids', () => {
  const { sandbox } = loadShop({
    br_gear_reset_v4: '1',
    br_gear_uid_seq: '1',
    br_items_owned: JSON.stringify([{ uid: 'g9', itemId: 'dmg_common_0' }]),
  });

  const fresh = sandbox.addGearInstance('hp_rare_2');
  assert.notEqual(fresh.uid, 'g9');
  const owned = sandbox.ownedGearList();
  const uids = owned.map(x => x.uid);
  assert.equal(new Set(uids).size, uids.length);
});

test('selling one duplicate removes only one copy and pays 40 percent refund', () => {
  const { sandbox } = loadShop({ br_gear_reset_v4: '1' });
  sandbox.gold = 0;
  const a = sandbox.addGearInstance('dmg_common_0');
  sandbox.addGearInstance('dmg_common_0');
  sandbox.sellGearInstance(a.uid);

  assert.equal(sandbox.gold, 8);
  const owned = sandbox.ownedGearList();
  assert.equal(owned.length, 1);
  assert.equal(owned[0].itemId, 'dmg_common_0');
});

test('daily shop stock scales across all 50 worlds', () => {
  const { sandbox } = loadShop({ br_gear_reset_v4: '1' });
  assert.equal(sandbox.primaryShopRarity(0), 'common');
  assert.equal(sandbox.primaryShopRarity(49), 'omniscient');

  const w3 = sandbox.dailyShop(null, 3);
  assert.ok(w3.length >= 6);
  for (const id of w3) {
    const rar = id.split('_')[1];
    assert.ok(['cplus', 'cpp', 'uncommon'].includes(rar), 'world 4 shop should be cpp tier ±1');
  }

  const late = sandbox.dailyShop(null, 48);
  for (const id of late) {
    const rar = id.split('_')[1];
    assert.ok(['eternal', 'eternplus', 'omniscient'].includes(rar), 'world 49 shop should be endgame tier ±1');
  }
});

test('six crate tiers including premium platinum diamond vault', () => {
  const { sandbox } = loadShop({ br_gear_reset_v4: '1' });
  assert.equal(typeof sandbox.cratePrice, 'function');
  assert.ok(sandbox.cratePrice('platinum') > sandbox.cratePrice('gold'));
  assert.ok(sandbox.cratePrice('vault') > sandbox.cratePrice('diamond'));
  assert.equal(sandbox.cratePrice('vault'), 95000);
});

test('crate drops respect world tier like daily shop', () => {
  const { sandbox } = loadShop({ br_gear_reset_v4: '1' });
  assert.equal(typeof sandbox.crateOddsForWorld, 'function');
  const w2Gold = sandbox.crateOddsForWorld('gold', 1);
  let w2Peak = 0, w2PeakRar = 'common';
  for (const r of Object.keys(w2Gold)) {
    if (w2Gold[r] > w2Peak) { w2Peak = w2Gold[r]; w2PeakRar = r; }
  }
  assert.ok(['common', 'cplus', 'cpp', 'uncommon'].includes(w2PeakRar),
    'world 2 gold crate should peak near common+ tier, got ' + w2PeakRar);
  assert.equal(w2Gold.rare || 0, 0, 'world 2 crates should not roll rare');
  assert.equal(w2Gold.legendary || 0, 0, 'world 2 crates should not roll legendary');

  const late = sandbox.crateOddsForWorld('gold', 48);
  let latePeak = 0, latePeakRar = 'common';
  for (const r of Object.keys(late)) {
    if (late[r] > latePeak) { latePeak = late[r]; latePeakRar = r; }
  }
  assert.ok(['eternal', 'eternplus', 'omniscient'].includes(latePeakRar),
    'late-world gold crate should peak near endgame tier');
});

test('gear tier helpers soften enemies when loadout matches world', () => {
  const slots = ['cape','helmet','chest','gloves','belt','pants','ring','shoes'];
  const commonEquip = {};
  const ownedCommon = slots.map((cat, i) => {
    const uid = 'g_c'+i;
    commonEquip[cat] = uid;
    return { uid, itemId: 'dmg_common_0' };
  });
  const { sandbox } = loadShop({
    br_gear_reset_v4: '1',
    br_items_owned: JSON.stringify(ownedCommon),
    br_gear_equipped: JSON.stringify(commonEquip),
  });
  assert.equal(typeof sandbox.gearWorldDmgMul, 'function');
  assert.equal(typeof sandbox.gearEnemyHpMul, 'function');
  const underHp = sandbox.gearEnemyHpMul(20);
  const underDmg = sandbox.gearWorldDmgMul(20);

  const omniEquip = {};
  const ownedOmni = slots.map((cat, i) => {
    const uid = 'g_o'+i;
    omniEquip[cat] = uid;
    return { uid, itemId: 'dmg_omniscient_0' };
  });
  const geared = loadShop({
    br_gear_reset_v4: '1',
    br_items_owned: JSON.stringify(ownedOmni),
    br_gear_equipped: JSON.stringify(omniEquip),
  }).sandbox;
  const gearedHp = geared.gearEnemyHpMul(20);
  const gearedDmg = geared.gearWorldDmgMul(20);

  assert.ok(gearedHp < underHp, 'on-tier omniscient gear should soften enemies vs common');
  assert.ok(gearedDmg > underDmg, 'higher-tier loadout should boost damage multiplier');
  assert.ok(gearedDmg > 2, 'on-tier endgame gear should feel like a big spike');
});

test('gear dmg/hp stay flat; regen/vamp use % from world 11', () => {
  const { sandbox } = loadShop({ br_gear_reset_v4: '1' });
  const w1 = sandbox.itemBonus('dmg_common_0', 0);
  const w11 = sandbox.itemBonus('dmg_common_0', 10);
  const omniW1 = sandbox.itemBonus('dmg_omniscient_0', 0);
  const omniW11 = sandbox.itemBonus('dmg_omniscient_0', 10);
  assert.ok(w1 > 1);
  assert.equal(w1, w11, 'world index must not change flat dmg gear');
  assert.equal(omniW1, omniW11, 'high-tier dmg gear stays flat in late worlds');
  assert.ok(!sandbox.itemBonusShort('dmg_omniscient_0', 10).includes('%'));
  assert.ok(sandbox.gearStatUsesPercent('regen', 9) === false);
  assert.ok(sandbox.gearStatUsesPercent('regen', 10) === true);
  assert.ok(sandbox.gearStatUsesPercent('vamp', 10) === true);
  assert.ok(!sandbox.gearStatUsesPercent('dmg', 10));
  const regenFlat = sandbox.itemBonus('regen_common_0', 0);
  const regenPct = sandbox.itemBonus('regen_omniscient_0', 10);
  assert.ok(regenFlat >= 1);
  assert.ok(regenPct > 0 && regenPct < 1);
  assert.ok(sandbox.itemBonusShort('regen_omniscient_0', 10).includes('%'));
  assert.equal(typeof sandbox.gearBossHpMul, 'function');
  const slots = ['cape','helmet','chest','gloves','belt','pants','ring','shoes'];
  const omniEquip = {};
  const ownedOmni = slots.map((cat, i) => ({ uid: 'g_p'+i, itemId: 'dmg_omniscient_0' }));
  slots.forEach((cat, i) => { omniEquip[cat] = ownedOmni[i].uid; });
  const geared = loadShop({
    br_gear_reset_v4: '1',
    br_items_owned: JSON.stringify(ownedOmni),
    br_gear_equipped: JSON.stringify(omniEquip),
  }).sandbox;
  assert.ok(geared.gearBossHpMul(10) <= geared.gearEnemyHpMul(10));
  assert.ok(geared.gearBossHpMul(10) < 0.25);
});

test('catalog includes new stat types and eight gear slots', () => {
  const { sandbox } = loadShop({ br_gear_reset_v4: '1' });
  const a = sandbox.addGearInstance('rate_epic_0');
  const b = sandbox.addGearInstance('vamp_omniscient_3');
  assert.equal(a.itemId, 'rate_epic_0');
  assert.equal(b.itemId, 'vamp_omniscient_3');
  assert.equal(sandbox.itemCat('dmg_common_0'), 'cape');
  assert.equal(sandbox.itemStat('magnet_void_1'), 'magnet');
});
