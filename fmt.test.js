const test = require('node:test');
const assert = require('node:assert/strict');

// Keep in sync with js/game.js fmtNum helpers
function _fmtCompactUnit(val, suffix){
  const abs = Math.abs(val);
  let out;
  if(abs >= 100) out = String(Math.round(val));
  else { out = String(Math.round(val * 10) / 10).replace(/\.0$/, ''); }
  return out + suffix;
}
function fmtNum(n){
  n = Math.round(+n || 0);
  if(!isFinite(n)) return '0';
  const sign = n < 0 ? '-' : '';
  const v = Math.abs(n);
  if(v >= 1e9) return sign + _fmtCompactUnit(v / 1e9, 'B');
  if(v >= 1e6) return sign + _fmtCompactUnit(v / 1e6, 'M');
  if(v >= 1000) return sign + _fmtCompactUnit(v / 1000, 'k');
  return String(n);
}

test('fmtNum compacts from 1k with one decimal when needed', () => {
  assert.equal(fmtNum(0), '0');
  assert.equal(fmtNum(999), '999');
  assert.equal(fmtNum(1000), '1k');
  assert.equal(fmtNum(1300), '1.3k');
  assert.equal(fmtNum(10500), '10.5k');
  assert.equal(fmtNum(10000), '10k');
  assert.equal(fmtNum(139000), '139k');
  assert.equal(fmtNum(1500000), '1.5M');
  assert.equal(fmtNum(-2500), '-2.5k');
});
