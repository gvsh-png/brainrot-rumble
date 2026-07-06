'use strict';
// Haptic feedback — respects Settings toggle; uses Vibration API (Android / some mobile browsers).

const HAPTIC_KEY = 'br_haptic';
const HAPTIC_PATTERNS = {
  light: 12,
  medium: 22,
  heavy: 55,
  dash: 18,
  hurt: [35, 40, 55],
  level: [15, 30, 20],
  evolve: [25, 45, 70],
  pick: 14,
  jackpot: [12, 20, 35],
  boss: [30, 50, 80],
  win: [20, 40, 60, 30],
};

function _hapticDefaultOn(){
  try{
    const stored = localStorage.getItem(HAPTIC_KEY);
    if(stored === '1') return true;
    if(stored === '0') return false;
  }catch(e){}
  return typeof IS_TOUCH !== 'undefined' && IS_TOUCH;
}

let hapticOn = _hapticDefaultOn();

function haptic(kind){
  if(!hapticOn) return;
  if(typeof navigator === 'undefined' || !navigator.vibrate) return;
  const p = typeof kind === 'string' ? (HAPTIC_PATTERNS[kind] || HAPTIC_PATTERNS.light) : kind;
  try{ navigator.vibrate(p); }catch(e){}
}

function setHapticOn(v){
  hapticOn = !!v;
  try{ localStorage.setItem(HAPTIC_KEY, hapticOn ? '1' : '0'); }catch(e){}
  const btn = document.getElementById('sdrop-haptic');
  if(btn){
    btn.textContent = 'Haptic Feedback: ' + (hapticOn ? 'On' : 'Off');
    btn.classList.toggle('off', !hapticOn);
  }
}
