'use strict';
// Ambient menu motion: sparkles, idle character/pet on the Battle stage, resize handling.
let _menuT = 0;

function initMenuSparkles(){
  const el = $('menusparkles');
  if(!el || el.childElementCount) return;
  for(let i = 0; i < 22; i++){
    const s = document.createElement('span');
    s.className = 'msp';
    s.style.setProperty('--x', (8 + Math.random() * 84) + '%');
    s.style.setProperty('--y', (6 + Math.random() * 88) + '%');
    s.style.setProperty('--d', (3.5 + Math.random() * 5.5) + 's');
    s.style.setProperty('--delay', (-Math.random() * 10) + 's');
    s.style.setProperty('--sz', (2 + Math.random() * 3.5) + 'px');
    el.appendChild(s);
  }
}

function resizeMenuStage(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  for(const id of ['menuchar', 'menupet']){
    const c = $(id);
    if(!c) continue;
    const r = c.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if(c.width !== w || c.height !== h){
      c.width = w;
      c.height = h;
      const g = c.getContext('2d');
      if(g) g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }
}

function syncMenuPetVisible(){
  const pc = $('menupet');
  if(!pc) return;
  const show = !!(typeof activePetId !== 'undefined' && activePetId && typeof PETS !== 'undefined' && PETS.some(p => p.id === activePetId));
  pc.classList.toggle('hidden', !show);
}

function drawMenuStage(){
  if(typeof state !== 'undefined' && state !== ST.MENU) return;
  const menu = $('menu');
  if(!menu || menu.classList.contains('hidden') || menu.getAttribute('data-tab') !== 'battle') return;

  const cnv = $('menuchar');
  if(!cnv) return;
  resizeMenuStage();
  syncMenuPetVisible();

  const g = cnv.getContext('2d');
  const w = cnv.clientWidth;
  const h = cnv.clientHeight;
  g.clearRect(0, 0, w, h);

  if(typeof CHARACTERS !== 'undefined' && typeof activeCharId !== 'undefined'){
    const char = CHARACTERS.find(c => c.id === activeCharId);
    if(char && char.draw){
      g.save();
      g.translate(w / 2, h * 0.9);
      g.translate(0, Math.sin(_menuT * 2.4) * h * 0.014);
      const phase = (_menuT * 0.5) % 1;
      char.draw(g, Math.min(w, h) * 0.92, _menuT, {
        walkPhase: phase, moving: true, walkAmt: 0.38, faceX: 1,
        firePulse: 0, hitPulse: 0, t: _menuT,
      });
      g.restore();
    }
  }

  const pc = $('menupet');
  if(pc && !pc.classList.contains('hidden') && typeof activePetId !== 'undefined' && typeof PETS !== 'undefined'){
    const pet = PETS.find(p => p.id === activePetId);
    const pg = pc.getContext('2d');
    const pw = pc.clientWidth;
    const ph = pc.clientHeight;
    pg.clearRect(0, 0, pw, ph);
    if(pet && pet.draw){
      pg.save();
      pg.translate(pw / 2, ph * 0.82);
      pg.translate(0, Math.sin(_menuT * 3.1 + 1.2) * ph * 0.025);
      pet.draw(pg, Math.min(pw, ph) * 0.88, _menuT);
      pg.restore();
    }
  }
}

function menuFxUpdate(dt){
  _menuT += dt;
  drawMenuStage();
}

function initMenuFx(){
  initMenuSparkles();
  window.addEventListener('resize', () => { resizeMenuStage(); drawMenuStage(); });
  resizeMenuStage();
  drawMenuStage();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initMenuFx);
} else {
  initMenuFx();
}
