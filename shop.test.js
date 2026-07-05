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
    br_gear_reset_v3: '1',
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
    br_gear_reset_v3: '1',
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
  const { sandbox } = loadShop({ br_gear_reset_v3: '1' });
  sandbox.gold = 0;
  const a = sandbox.addGearInstance('dmg_common_0');
  sandbox.addGearInstance('dmg_common_0');
  sandbox.sellGearInstance(a.uid);

  assert.equal(sandbox.gold, 10);
  const owned = sandbox.ownedGearList();
  assert.equal(owned.length, 1);
  assert.equal(owned[0].itemId, 'dmg_common_0');
});

test('daily shop stock matches selected world tier', () => {
  const { sandbox } = loadShop({ br_gear_reset_v3: '1' });
  assert.equal(sandbox.primaryShopRarity(0), 'common');
  assert.equal(sandbox.primaryShopRarity(1), 'cplus');
  assert.equal(sandbox.primaryShopRarity(11), 'mythic');
  assert.equal(sandbox.primaryShopRarity(40), 'mythic');

  const w3 = sandbox.dailyShop(6, 3);
  assert.equal(w3.length, 6);
  for (const id of w3) {
    const rar = id.split('_')[1];
    assert.ok(['cpp', 'uncommon', 'uplus'].includes(rar), 'world 4 shop should be uncommon tier ±1');
  }
});
