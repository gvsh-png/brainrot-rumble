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
  };
}

function makeNode() {
  return {
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    style: {},
    dataset: {},
    textContent: '',
    innerHTML: '',
    disabled: false,
    src: '',
    lastElementChild: { textContent: '' },
    querySelector() { return makeNode(); },
    querySelectorAll() { return []; },
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    getAttribute() { return ''; },
    appendChild() {},
    clientWidth: 400,
    toDataURL() { return 'data:'; },
  };
}

function loadGame() {
  const counts = {};
  const inc = name => { counts[name] = (counts[name] || 0) + 1; };
  function makeContext() {
    const ctx = {};
    for (const name of [
      'save', 'restore', 'translate', 'scale', 'rotate', 'beginPath', 'closePath',
      'fill', 'stroke', 'fillRect', 'strokeRect', 'clearRect', 'drawImage',
      'arc', 'ellipse', 'rect', 'roundRect', 'moveTo', 'lineTo',
      'quadraticCurveTo', 'bezierCurveTo', 'setTransform', 'setLineDash',
      'strokeText', 'fillText', 'clip',
    ]) ctx[name] = () => inc(name);
    ctx.createRadialGradient = () => ({ addColorStop() {} });
    ctx.measureText = () => ({ width: 10 });
    return ctx;
  }

  const nodes = new Map();
  const document = {
    body: { style: {}, classList: { add() {}, remove() {}, toggle() {} } },
    querySelector() { return null; },
    createElement(tag) {
      if (tag === 'canvas' || tag === 'img') {
        return Object.assign(makeNode(), {
          width: 0,
          height: 0,
          getContext() { return makeContext(); },
          toDataURL() { return 'data:'; },
        });
      }
      return makeNode();
    },
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, makeNode());
      return nodes.get(id);
    },
    querySelectorAll() { return []; },
    addEventListener() {},
    removeEventListener() {},
  };
  nodes.set('game', {
    width: 0,
    height: 0,
    style: {},
    getContext() { return makeContext(); },
    addEventListener() {},
  });

  const sandbox = {
    console,
    Math,
    Date,
    JSON,
    Map,
    Set,
    Array,
    Object,
    Number,
    String,
    Boolean,
    Infinity,
    NaN,
    localStorage: makeStorage({ br_unlocked: '9', br_ch_unlocked: '9' }),
    document,
    window: null,
    location: { protocol: 'file:', hostname: '' },
    navigator: {},
    setTimeout(fn) { fn(); return 1; },
    clearTimeout() {},
    setInterval() { return 1; },
    clearInterval() {},
    requestAnimationFrame() {},
    AudioContext: function AudioContext() {},
    webkitAudioContext: function webkitAudioContext() {},
  };
  sandbox.window = sandbox;
  Object.assign(sandbox.window, {
    addEventListener() {},
    removeEventListener() {},
    matchMedia() { return { matches: false }; },
    devicePixelRatio: 1,
    innerWidth: 1280,
    innerHeight: 720,
    markDirty() {},
  });
  vm.createContext(sandbox);
  for (const file of [
    'js/hooks.js',
    'js/characters.js',
    'js/pets.js',
    'js/recruit.js',
    'js/core.js',
    'js/audio.js',
    'js/sprites.js',
    'js/input.js',
    'js/game.js',
  ]) vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });

  return { sandbox, counts };
}

test('challenger ground rendering reuses a cached tile layer', () => {
  const { sandbox, counts } = loadGame();
  vm.runInContext("gameMode='challenger'; _doStartGame(9);", sandbox);
  const before = counts.fillRect || 0;

  for (let i = 0; i < 120; i++) {
    vm.runInContext('update(1/60); render();', sandbox);
  }

  const fillRectsPerFrame = ((counts.fillRect || 0) - before) / 120;
  assert.ok(fillRectsPerFrame < 80, `expected <80 fillRect/frame, got ${fillRectsPerFrame}`);
});
