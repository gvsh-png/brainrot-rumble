'use strict';
// Extra swarm enemy sprites for extended worlds (loaded after sprites.js).

(function(){
  if(typeof makeSprite !== 'function') return;

  makeSprite('swarmmite', 90, (g,u)=>{
    sh(g,'#6a4a9a',2*u,(ctx)=>{
      ctx.beginPath(); ctx.ellipse(0,0,18*u,12*u,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#9a7ad8'; ctx.beginPath(); ctx.arc(-8*u,-4*u,4*u,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(8*u,-4*u,4*u,0,Math.PI*2); ctx.fill();
    });
    dot(g,14*u,-2*u,3*u,'#fff');
    dot(g,-14*u,-2*u,3*u,'#fff');
  });

  makeSprite('swarmwasp', 95, (g,u)=>{
    sh(g,'#e8c020',2*u,(ctx)=>{
      ctx.fillStyle='#f5d030'; ctx.beginPath(); ctx.ellipse(0,0,20*u,11*u,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#3a2d22'; ctx.fillRect(-12*u,-2*u,24*u,4*u);
      ctx.fillStyle='#fff8c0'; ctx.beginPath(); ctx.ellipse(16*u,0,8*u,5*u,0,0,Math.PI*2); ctx.fill();
    });
    dot(g,18*u,-1*u,2.5*u,'#3a2d22');
  });

  makeSprite('swarmbeetle', 100, (g,u)=>{
    sh(g,'#2a8a4a',2.2*u,(ctx)=>{
      ctx.beginPath(); ctx.ellipse(0,2*u,22*u,14*u,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#1a5a30'; ctx.beginPath(); ctx.arc(0,-8*u,10*u,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#1a5a30'; ctx.lineWidth=3*u;
      ctx.beginPath(); ctx.moveTo(-18*u,0); ctx.lineTo(-28*u,-10*u); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(18*u,0); ctx.lineTo(28*u,-10*u); ctx.stroke();
    });
  });

  makeSprite('swarmmoth', 88, (g,u)=>{
    sh(g,'#c8b0e8',1.8*u,(ctx)=>{
      ctx.fillStyle='#e8d8ff';
      ctx.beginPath(); ctx.ellipse(-14*u,0,12*u,18*u,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(14*u,0,12*u,18*u,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#9a7ab8'; ctx.beginPath(); ctx.ellipse(0,0,8*u,14*u,0,0,Math.PI*2); ctx.fill();
    });
    dot(g,0,-8*u,2*u,'#3a2d22');
  });
})();
