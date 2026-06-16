'use strict';
// ============ PETS: draw, hooks, utilities ============
// Loads after characters.js, before game.js.

// ---- per-pet draw functions ----

function _drawGattino(ctx, size, t) {
  t = t||0;
  // Orange cat body (round ellipse)
  ctx.beginPath();
  ctx.ellipse(0, size*0.12, size*0.28, size*0.22, 0, 0, Math.PI*2);
  ctx.fillStyle='#e88030';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.035);
  ctx.stroke();
  // Tail
  ctx.beginPath();
  ctx.moveTo(size*0.22, size*0.22);
  ctx.bezierCurveTo(size*0.42,size*0.10, size*0.46,-size*0.08, size*0.32,-size*0.12);
  ctx.strokeStyle='#e88030';
  ctx.lineWidth=Math.max(3,size*0.07);
  ctx.stroke();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.030);
  ctx.stroke();
  // Round orange cat face/head
  ctx.beginPath();
  ctx.arc(0, -size*0.12, size*0.24, 0, Math.PI*2);
  ctx.fillStyle='#f09040';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.035);
  ctx.stroke();
  // Triangle ears
  ctx.fillStyle='#e88030';
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.03);
  for(const sx of [-1,1]){
    ctx.beginPath();
    ctx.moveTo(sx*size*0.08, -size*0.30);
    ctx.lineTo(sx*size*0.20, -size*0.12);
    ctx.lineTo(sx*size*(-0.01), -size*0.12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  // Small nose
  ctx.beginPath();
  ctx.arc(0, -size*0.10, size*0.025, 0, Math.PI*2);
  ctx.fillStyle='#e04070';
  ctx.fill();
  // Eyes
  ctx.fillStyle='#2a1c10';
  for(const sx of [-0.085,0.085]){
    ctx.beginPath();
    ctx.arc(size*sx, -size*0.155, size*0.038, 0, Math.PI*2);
    ctx.fill();
  }
  // Whisker lines
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1,size*0.018);
  const whiskers=[[-0.12,-0.09,-0.30,-0.08],[-0.12,-0.10,-0.30,-0.13],
                   [0.12,-0.09,0.30,-0.08],[0.12,-0.10,0.30,-0.13]];
  for(const [x1,y1,x2,y2] of whiskers){
    ctx.beginPath();
    ctx.moveTo(size*x1,size*y1);
    ctx.lineTo(size*x2,size*y2);
    ctx.stroke();
  }
}

function _drawUccellino(ctx, size, t) {
  t = t||0;
  // Small yellow bird body
  ctx.beginPath();
  ctx.ellipse(0, size*0.05, size*0.22, size*0.18, 0, 0, Math.PI*2);
  ctx.fillStyle='#f5d030';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.035);
  ctx.stroke();
  // Round head
  ctx.beginPath();
  ctx.arc(0, -size*0.16, size*0.18, 0, Math.PI*2);
  ctx.fillStyle='#f5d030';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.035);
  ctx.stroke();
  // Beak triangle
  ctx.beginPath();
  ctx.moveTo(size*0.17, -size*0.17);
  ctx.lineTo(size*0.30, -size*0.14);
  ctx.lineTo(size*0.17, -size*0.10);
  ctx.closePath();
  ctx.fillStyle='#e07020';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1,size*0.025);
  ctx.stroke();
  // Eye
  ctx.fillStyle='#2a1c10';
  ctx.beginPath();
  ctx.arc(size*0.07,-size*0.19,size*0.032,0,Math.PI*2);
  ctx.fill();
  // Wing arc (left)
  ctx.beginPath();
  ctx.moveTo(-size*0.10, size*0.02);
  ctx.quadraticCurveTo(-size*0.34,-size*0.06,-size*0.18,-size*0.18);
  ctx.fillStyle='#e8c020';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.03);
  ctx.stroke();
}

function _drawOrbino(ctx, size, t) {
  t = t||0;
  // Glowing teal orb
  ctx.save();
  ctx.shadowColor='#40f0d0';
  ctx.shadowBlur=size*0.18;
  ctx.beginPath();
  ctx.arc(0, 0, size*0.28, 0, Math.PI*2);
  ctx.fillStyle='#30d0c0';
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.03);
  ctx.beginPath();
  ctx.arc(0, 0, size*0.28, 0, Math.PI*2);
  ctx.stroke();
  // Sparkle lines
  const sparkCount=6;
  for(let i=0;i<sparkCount;i++){
    const a=i*Math.PI*2/sparkCount + t*1.5;
    const r1=size*0.30, r2=size*0.38;
    ctx.strokeStyle='#80f0e8';
    ctx.lineWidth=Math.max(1.5,size*0.025);
    ctx.beginPath();
    ctx.moveTo(Math.cos(a)*r1,Math.sin(a)*r1);
    ctx.lineTo(Math.cos(a)*r2,Math.sin(a)*r2);
    ctx.stroke();
  }
  // Inner lighter circle
  ctx.beginPath();
  ctx.arc(-size*0.08,-size*0.09,size*0.10,0,Math.PI*2);
  ctx.fillStyle='rgba(200,255,250,0.5)';
  ctx.fill();
}

function _drawScudetto(ctx, size, t) {
  t = t||0;
  // Turtle shell body (hexagon)
  const r=size*0.28;
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a=i*Math.PI/3-Math.PI/6;
    i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r):ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
  }
  ctx.closePath();
  ctx.fillStyle='#60a850';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(2,size*0.04);
  ctx.stroke();
  // Hex pattern lines inside
  ctx.strokeStyle='#3a7830';
  ctx.lineWidth=Math.max(1,size*0.022);
  const innerR=size*0.18;
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a=i*Math.PI/3-Math.PI/6;
    ctx.moveTo(0,0);
    ctx.lineTo(Math.cos(a)*innerR,Math.sin(a)*innerR);
  }
  ctx.stroke();
  // Center hexagon
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a=i*Math.PI/3-Math.PI/6;
    i===0?ctx.moveTo(Math.cos(a)*innerR,Math.sin(a)*innerR):ctx.lineTo(Math.cos(a)*innerR,Math.sin(a)*innerR);
  }
  ctx.closePath();
  ctx.strokeStyle='#2a5820';
  ctx.lineWidth=Math.max(1,size*0.02);
  ctx.stroke();
}

function _drawCalamita(ctx, size, t) {
  t = t||0;
  // Horseshoe magnet shape
  const sw=size*0.12, sh=size*0.28, cr=size*0.14;
  // Left arm
  ctx.beginPath();
  ctx.rect(-cr-sw/2, -sh, sw, sh);
  ctx.fillStyle='#cc2020';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.03);
  ctx.stroke();
  // Right arm
  ctx.beginPath();
  ctx.rect(cr-sw/2, -sh, sw, sh);
  ctx.fillStyle='#cc2020';
  ctx.fill();
  ctx.stroke();
  // Curved top (arc connecting the two arms)
  ctx.beginPath();
  ctx.arc(0,-sh,cr+sw/2,Math.PI,0,false);
  ctx.arc(0,-sh,cr-sw/2,0,Math.PI,true);
  ctx.closePath();
  ctx.fillStyle='#888888';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.03);
  ctx.stroke();
  // Magnet poles (tips)
  for(const sx of [-1,1]){
    ctx.beginPath();
    ctx.rect(sx*cr-sw/2, 0, sw, size*0.06);
    ctx.fillStyle=sx<0?'#cc2020':'#e8e8e8';
    ctx.fill();
    ctx.stroke();
  }
  // Attraction lines
  ctx.strokeStyle='rgba(80,150,255,0.6)';
  ctx.lineWidth=Math.max(1,size*0.02);
  for(let i=0;i<3;i++){
    const off=i*size*0.08+size*0.08;
    ctx.beginPath();
    ctx.arc(0,-sh,cr+off,0,Math.PI,false);
    ctx.stroke();
  }
}

function _drawDraghetto(ctx, size, t) {
  t = t||0;
  // Tiny dragon round body
  ctx.beginPath();
  ctx.ellipse(0, size*0.08, size*0.26, size*0.22, 0, 0, Math.PI*2);
  ctx.fillStyle='#2a8840';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.035);
  ctx.stroke();
  // Wings
  ctx.fillStyle='#1a6030';
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.03);
  for(const sx of [-1,1]){
    ctx.save();
    ctx.scale(sx,1);
    ctx.beginPath();
    ctx.moveTo(size*0.18, -size*0.05);
    ctx.bezierCurveTo(size*0.42,-size*0.22,size*0.44,-size*0.40,size*0.28,-size*0.36);
    ctx.bezierCurveTo(size*0.14,-size*0.30,size*0.10,-size*0.10,size*0.10,-size*0.05);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  // Round head
  ctx.beginPath();
  ctx.arc(0,-size*0.18,size*0.18,0,Math.PI*2);
  ctx.fillStyle='#3aaa50';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.035);
  ctx.stroke();
  // Eyes
  ctx.fillStyle='#ffd000';
  for(const sx of [-0.07,0.07]){
    ctx.beginPath();
    ctx.arc(size*sx,-size*0.20,size*0.035,0,Math.PI*2);
    ctx.fill();
  }
  ctx.fillStyle='#2a1c10';
  for(const sx of [-0.07,0.07]){
    ctx.beginPath();
    ctx.arc(size*sx,-size*0.20,size*0.018,0,Math.PI*2);
    ctx.fill();
  }
  // Small flame
  const fx=0, fy=size*0.32;
  ctx.save();
  ctx.translate(fx,fy);
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.bezierCurveTo(-size*0.08,-size*0.12, -size*0.04,-size*0.20, 0,-size*0.24);
  ctx.bezierCurveTo(size*0.04,-size*0.20, size*0.08,-size*0.12, 0,0);
  ctx.fillStyle='#ff8020';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1,size*0.022);
  ctx.stroke();
  // Inner flame
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.bezierCurveTo(-size*0.04,-size*0.08, -size*0.02,-size*0.14, 0,-size*0.18);
  ctx.bezierCurveTo(size*0.02,-size*0.14, size*0.04,-size*0.08, 0,0);
  ctx.fillStyle='#ffe060';
  ctx.fill();
  ctx.restore();
}

function _drawStellina(ctx, size, t) {
  t = t||0;
  // 5-point star, gold
  const outerR=size*0.32, innerR=size*0.14;
  const points=5;
  // Glow
  ctx.save();
  ctx.shadowColor='#ffd24a';
  ctx.shadowBlur=size*0.20;
  ctx.beginPath();
  for(let i=0;i<points*2;i++){
    const a=i*Math.PI/points - Math.PI/2;
    const r=i%2===0?outerR:innerR;
    i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r):ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
  }
  ctx.closePath();
  ctx.fillStyle='#f5d060';
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  for(let i=0;i<points*2;i++){
    const a=i*Math.PI/points - Math.PI/2;
    const r=i%2===0?outerR:innerR;
    i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r):ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
  }
  ctx.closePath();
  ctx.fillStyle='#f5d060';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.035);
  ctx.stroke();
  // Inner highlight
  const hiR=size*0.10;
  ctx.beginPath();
  for(let i=0;i<points*2;i++){
    const a=i*Math.PI/points - Math.PI/2;
    const r=i%2===0?hiR:hiR*0.44;
    i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r):ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
  }
  ctx.closePath();
  ctx.fillStyle='rgba(255,255,200,0.6)';
  ctx.fill();
}

function _drawAnimaGemella(ctx, size, t) {
  t = t||0;
  // Ghost-like twin silhouette, translucent blue
  ctx.globalAlpha=0.80;
  // Main ghost
  ctx.beginPath();
  ctx.arc(-size*0.06, -size*0.10, size*0.22, Math.PI, 0, false);
  ctx.lineTo(size*0.16, size*0.22);
  // 3 bottom bumps
  for(let i=0;i<3;i++){
    const bx=size*0.16-i*size*0.10-(size*0.05);
    ctx.quadraticCurveTo(bx, size*0.28+size*0.04*(i%2?1:-1), bx-size*0.10, size*0.22);
  }
  ctx.closePath();
  ctx.fillStyle='#5090d8';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1.5,size*0.03);
  ctx.stroke();
  // Twin (offset right)
  ctx.globalAlpha=0.55;
  ctx.beginPath();
  ctx.arc(size*0.10, -size*0.08, size*0.18, Math.PI, 0, false);
  ctx.lineTo(size*0.28, size*0.20);
  ctx.lineTo(size*0.04, size*0.20);
  ctx.closePath();
  ctx.fillStyle='#88c0ff';
  ctx.fill();
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1,size*0.025);
  ctx.stroke();
  ctx.globalAlpha=1.0;
  // Hollow eyes on main ghost
  ctx.strokeStyle='#2a1c10';
  ctx.lineWidth=Math.max(1,size*0.025);
  for(const sx of [-0.12,0.02]){
    ctx.beginPath();
    ctx.arc(size*sx,-size*0.12,size*0.038,0,Math.PI*2);
    ctx.stroke();
  }
}

// ============ PETS ARRAY ============
const PETS = [
  {
    id: 'gattino',
    name: 'Gattino',
    desc: 'Drops a 25 HP heart at wave start.',
    rarity: 'common',
    register() {
      onHook('waveStart', () => {
        if(typeof dropHeart==='function' && typeof P!=='undefined') dropHeart(P.x, P.y, 25);
      });
    },
    draw(ctx, size, t) { _drawGattino(ctx, size, t); }
  },
  {
    id: 'uccellino',
    name: 'Uccellino',
    desc: 'Every 5 waves: XP orb cluster at wave start.',
    rarity: 'common',
    register() {
      onHook('waveStart', () => {
        const wv = typeof wave!=='undefined' ? wave : 0;
        if(wv>0 && wv%5===0){
          if(typeof dropOrb==='function' && typeof P!=='undefined'){
            dropOrb(P.x, P.y, 2);
            dropOrb(P.x+20, P.y, 2);
            dropOrb(P.x-20, P.y, 2);
          }
        }
      });
    },
    draw(ctx, size, t) { _drawUccellino(ctx, size, t); }
  },
  {
    id: 'orbino',
    name: 'Orbino',
    desc: 'Converts 15% of wave XP into a bonus burst at wave end.',
    rarity: 'rare',
    register() {
      onHook('waveStart', () => { if(typeof P!=='undefined') P.petWaveXP=0; });
      onHook('onXpGain', (amount) => { if(typeof P!=='undefined') P.petWaveXP=(P.petWaveXP||0)+amount; });
      onHook('waveEnd', () => {
        if(typeof P==='undefined') return;
        const bonus = Math.floor((P.petWaveXP||0)*0.15);
        if(bonus>0 && typeof P.xp!=='undefined'){ P.xp+=bonus; }
      });
    },
    draw(ctx, size, t) { _drawOrbino(ctx, size, t); }
  },
  {
    id: 'scudetto',
    name: 'Scudetto',
    desc: 'Orbits player, blocks 1 projectile every 8s.',
    rarity: 'rare',
    register() {
      onHook('waveStart', () => { if(typeof P!=='undefined') P.petShieldCd=0; });
    },
    draw(ctx, size, t) { _drawScudetto(ctx, size, t); }
  },
  {
    id: 'calamita',
    name: 'Calamita',
    desc: 'Magnet pull for first 4s of each wave.',
    rarity: 'rare',
    register() {
      onHook('waveStart', () => { if(typeof P!=='undefined') P.magnetT=4; });
    },
    draw(ctx, size, t) { _drawCalamita(ctx, size, t); }
  },
  {
    id: 'draghetto',
    name: 'Draghetto',
    desc: 'Attacks nearest enemy every 3s for 15% player dmg.',
    rarity: 'epic',
    register() {
      if(typeof P!=='undefined') P.petDragonCd=3;
      onHook('petTick', (dt) => {
        if(typeof P==='undefined') return;
        P.petDragonCd=(P.petDragonCd||3)-dt;
        if(P.petDragonCd<=0){
          P.petDragonCd=3;
          if(typeof enemies!=='undefined' && enemies.length){
            let nearest=null, nd=Infinity;
            for(const e of enemies){
              const dx=e.x-P.x, dy=e.y-P.y;
              const d=dx*dx+dy*dy;
              if(d<nd){ nd=d; nearest=e; }
            }
            if(nearest){
              nearest.hp-=P.dmg*0.15;
              if(nearest.hp<=0 && typeof killEnemy==='function') killEnemy(nearest);
            }
          }
        }
      });
    },
    draw(ctx, size, t) { _drawDraghetto(ctx, size, t); }
  },
  {
    id: 'stellina',
    name: 'Stellina',
    desc: 'Once per run: when HP→0, spawn emergency lucky block. Adds XP-burst as 4th lucky reward.',
    rarity: 'epic',
    register() {
      let used=false;
      onHook('onHpZero', () => {
        if(used) return false; // returning false signals "don't consume HP=0"
        used=true;
        if(typeof spawnLucky==='function') spawnLucky();
        return true; // consumed
      });
    },
    draw(ctx, size, t) { _drawStellina(ctx, size, t); }
  },
  {
    id: 'anima_gemella',
    name: 'Anima Gemella',
    desc: 'After dash: pet dashes through nearest 3 enemies dealing 40% dmg.',
    rarity: 'legendary',
    register() {
      onHook('onDash', () => {
        if(typeof P==='undefined'||typeof enemies==='undefined') return;
        // find 3 nearest enemies within 300px
        const sorted = enemies
          .map(e=>({ e, d:(e.x-P.x)**2+(e.y-P.y)**2 }))
          .filter(o=>o.d<=300*300)
          .sort((a,b)=>a.d-b.d)
          .slice(0,3);
        for(const { e } of sorted){
          e.hp-=P.dmg*0.40;
          if(e.hp<=0 && typeof killEnemy==='function') killEnemy(e);
        }
      });
    },
    draw(ctx, size, t) { _drawAnimaGemella(ctx, size, t); }
  }
];

// ============ PET UTILITIES ============

function isPetOwned(id) {
  return JSON.parse(localStorage.getItem('br_owned_pets')||'[]').includes(id);
}

function grantPet(id) {
  const owned = JSON.parse(localStorage.getItem('br_owned_pets')||'[]');
  if(!owned.includes(id)){
    owned.push(id);
    localStorage.setItem('br_owned_pets', JSON.stringify(owned));
    if(window.markDirty) window.markDirty();
  }
}

function petThumbURL(petId, size) {
  size = size||80;
  const pet = PETS.find(p=>p.id===petId);
  if(!pet||!pet.draw) return '';
  const c = document.createElement('canvas');
  c.width=size; c.height=size;
  const g = c.getContext('2d');
  g.save();
  g.translate(size/2, size/2);
  pet.draw(g, size, 0);
  g.restore();
  return c.toDataURL();
}
