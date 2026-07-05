'use strict';
// Procedural sprites: 4 grunts + mid boss + final boss per extended world (W12–W50).
// Each world picks from 20 distinct creature archetypes (not just hue-shifted copies).

(function () {
  if (typeof makeSprite !== 'function') return;

  const ARCHETYPES = [
    'beetle', 'wasp', 'jelly', 'golem', 'crab', 'mushroom', 'crystal', 'robot',
    'fish', 'bat', 'snail', 'flame', 'ice', 'cactus', 'ghost', 'gear',
    'star', 'vine', 'meteor', 'skull',
  ];

  function hsl(h, s, l) {
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const col = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * col).toString(16).padStart(2, '0');
    };
    return '#' + f(0) + f(8) + f(4);
  }

  function pal(wi) {
    const h = (wi * 37 + 11) % 360;
    return {
      body: hsl(h, 62, 58),
      accent: hsl((h + 48) % 360, 78, 62),
      wing: hsl((h + 22) % 360, 58, 74),
      spike: hsl((h + 95) % 360, 68, 52),
      crest: hsl((h + 30) % 360, 80, 66),
      ring: hsl((h + 60) % 360, 82, 68),
      eye: '#1a2030',
    };
  }

  function arch(wi, slot) {
    const idx = (wi * 3 + slot * 7 + 2) % ARCHETYPES.length;
    return ARCHETYPES[idx];
  }

  function drawBeetle(g, u, c) {
    sh(g, c.body, 2.2 * u, ctx => {
      ctx.fillRect(-14 * u, -4 * u, 28 * u, 18 * u);
      ctx.beginPath(); ctx.arc(0, -12 * u, 11 * u, 0, Math.PI * 2); ctx.fill();
    });
    g.strokeStyle = c.spike; g.lineWidth = 2.5 * u;
    g.beginPath(); g.moveTo(-8 * u, -20 * u); g.lineTo(-4 * u, -14 * u); g.stroke();
    g.beginPath(); g.moveTo(8 * u, -20 * u); g.lineTo(4 * u, -14 * u); g.stroke();
    dot(g, -5 * u, -14 * u, 2.5 * u, c.accent);
    dot(g, 5 * u, -14 * u, 2.5 * u, c.accent);
  }

  function drawWasp(g, u, c) {
    sh(g, c.body, 1.8 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, 0, 14 * u, 9 * u, 0, 0, Math.PI * 2); ctx.fill();
    });
    g.fillStyle = c.wing;
    g.beginPath(); g.ellipse(-10 * u, 0, 8 * u, 11 * u, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(10 * u, 0, 8 * u, 11 * u, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = c.accent;
    g.fillRect(-10 * u, -2 * u, 20 * u, 4 * u);
    dot(g, 10 * u, -1 * u, 2 * u, c.eye);
  }

  function drawJelly(g, u, c) {
    sh(g, c.body, 2 * u, ctx => {
      ctx.beginPath(); ctx.arc(0, -4 * u, 12 * u, Math.PI, 0); ctx.lineTo(12 * u, 6 * u); ctx.arc(0, 6 * u, 12 * u, 0, Math.PI, true); ctx.fill();
    });
    g.strokeStyle = c.accent; g.lineWidth = 2 * u;
    for (let i = -2; i <= 2; i++) {
      g.beginPath(); g.moveTo(i * 4 * u, 6 * u); g.lineTo(i * 5 * u, 16 * u); g.stroke();
    }
    dot(g, -4 * u, -2 * u, 2 * u, c.accent);
    dot(g, 4 * u, -2 * u, 2 * u, c.accent);
  }

  function drawGolem(g, u, c) {
    sh(g, c.body, 2.4 * u, ctx => {
      ctx.fillRect(-16 * u, -8 * u, 32 * u, 24 * u);
      ctx.fillRect(-12 * u, -18 * u, 24 * u, 12 * u);
    });
    g.fillStyle = c.accent;
    g.fillRect(-4 * u, -14 * u, 8 * u, 4 * u);
    dot(g, -6 * u, -10 * u, 2.5 * u, c.eye);
    dot(g, 6 * u, -10 * u, 2.5 * u, c.eye);
  }

  function drawCrab(g, u, c) {
    sh(g, c.body, 2 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, 2 * u, 16 * u, 12 * u, 0, 0, Math.PI * 2); ctx.fill();
    });
    g.strokeStyle = c.spike; g.lineWidth = 3 * u;
    g.beginPath(); g.moveTo(-14 * u, 0); g.lineTo(-24 * u, -8 * u); g.stroke();
    g.beginPath(); g.moveTo(14 * u, 0); g.lineTo(24 * u, -8 * u); g.stroke();
    dot(g, -5 * u, 0, 2 * u, c.eye);
    dot(g, 5 * u, 0, 2 * u, c.eye);
  }

  function drawMushroom(g, u, c) {
    sh(g, c.accent, 2 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, -6 * u, 16 * u, 12 * u, 0, 0, Math.PI * 2); ctx.fill();
    });
    sh(g, c.body, 1.6 * u, ctx => {
      ctx.fillRect(-5 * u, -2 * u, 10 * u, 18 * u);
    });
    dot(g, -6 * u, -8 * u, 2 * u, '#fff');
    dot(g, 4 * u, -10 * u, 1.5 * u, '#fff');
  }

  function drawCrystal(g, u, c) {
    sh(g, c.body, 2.2 * u, ctx => {
      ctx.beginPath();
      ctx.moveTo(0, -18 * u); ctx.lineTo(12 * u, 4 * u); ctx.lineTo(0, 14 * u); ctx.lineTo(-12 * u, 4 * u);
      ctx.closePath(); ctx.fill();
    });
    g.strokeStyle = c.accent; g.lineWidth = 2 * u;
    g.beginPath(); g.moveTo(0, -18 * u); g.lineTo(0, 14 * u); g.stroke();
    dot(g, 0, -4 * u, 3 * u, c.accent);
  }

  function drawRobot(g, u, c) {
    sh(g, c.body, 2.2 * u, ctx => {
      ctx.fillRect(-12 * u, -10 * u, 24 * u, 20 * u);
      ctx.fillRect(-8 * u, -18 * u, 16 * u, 10 * u);
    });
    g.fillStyle = c.accent;
    g.fillRect(-6 * u, -14 * u, 12 * u, 5 * u);
    g.strokeStyle = c.spike; g.lineWidth = 2 * u;
    g.beginPath(); g.moveTo(-4 * u, -18 * u); g.lineTo(-4 * u, -24 * u); g.stroke();
    g.beginPath(); g.moveTo(4 * u, -18 * u); g.lineTo(4 * u, -24 * u); g.stroke();
    dot(g, -4 * u, -12 * u, 2 * u, c.eye);
    dot(g, 4 * u, -12 * u, 2 * u, c.eye);
  }

  function drawFish(g, u, c) {
    sh(g, c.body, 2 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, 0, 16 * u, 10 * u, 0, 0, Math.PI * 2); ctx.fill();
    });
    g.fillStyle = c.wing;
    g.beginPath(); g.moveTo(-16 * u, 0); g.lineTo(-24 * u, -10 * u); g.lineTo(-24 * u, 10 * u); g.closePath(); g.fill();
    dot(g, 8 * u, -2 * u, 2.5 * u, c.eye);
    g.fillStyle = c.accent;
    g.fillRect(10 * u, -1 * u, 6 * u, 2 * u);
  }

  function drawBat(g, u, c) {
    sh(g, c.body, 1.8 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, 2 * u, 8 * u, 10 * u, 0, 0, Math.PI * 2); ctx.fill();
    });
    g.fillStyle = c.wing;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(-18 * u, -12 * u); g.lineTo(-8 * u, 4 * u); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(0, 0); g.lineTo(18 * u, -12 * u); g.lineTo(8 * u, 4 * u); g.closePath(); g.fill();
    dot(g, 0, 0, 2 * u, c.eye);
  }

  function drawSnail(g, u, c) {
    sh(g, c.accent, 2 * u, ctx => {
      ctx.beginPath(); ctx.arc(-2 * u, -4 * u, 12 * u, 0, Math.PI * 2); ctx.fill();
    });
    sh(g, c.body, 1.6 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(6 * u, 6 * u, 10 * u, 7 * u, 0, 0, Math.PI * 2); ctx.fill();
    });
    dot(g, 10 * u, 4 * u, 2 * u, c.eye);
    g.strokeStyle = c.spike; g.lineWidth = 1.5 * u;
    for (let i = 0; i < 3; i++) {
      g.beginPath(); g.moveTo((-6 + i * 4) * u, -10 * u); g.lineTo((-4 + i * 4) * u, -16 * u); g.stroke();
    }
  }

  function drawFlame(g, u, c) {
    sh(g, c.accent, 2 * u, ctx => {
      ctx.beginPath();
      ctx.moveTo(0, -16 * u); ctx.quadraticCurveTo(12 * u, 0, 0, 14 * u); ctx.quadraticCurveTo(-12 * u, 0, 0, -16 * u);
      ctx.fill();
    });
    sh(g, c.body, 1.6 * u, ctx => {
      ctx.beginPath();
      ctx.moveTo(0, -10 * u); ctx.quadraticCurveTo(6 * u, 2 * u, 0, 8 * u); ctx.quadraticCurveTo(-6 * u, 2 * u, 0, -10 * u);
      ctx.fill();
    });
    dot(g, 0, -2 * u, 3 * u, '#fff8d0');
  }

  function drawIce(g, u, c) {
    sh(g, c.body, 2 * u, ctx => {
      ctx.beginPath(); ctx.arc(0, 0, 12 * u, 0, Math.PI * 2); ctx.fill();
    });
    g.strokeStyle = c.accent; g.lineWidth = 2.5 * u;
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      g.beginPath(); g.moveTo(Math.cos(a) * 6 * u, Math.sin(a) * 6 * u); g.lineTo(Math.cos(a) * 16 * u, Math.sin(a) * 16 * u); g.stroke();
    }
    dot(g, 0, 0, 3 * u, '#e8f8ff');
  }

  function drawCactus(g, u, c) {
    sh(g, c.body, 2.2 * u, ctx => {
      ctx.fillRect(-6 * u, -14 * u, 12 * u, 28 * u);
      ctx.fillRect(-14 * u, -4 * u, 8 * u, 6 * u);
      ctx.fillRect(6 * u, 2 * u, 8 * u, 6 * u);
    });
    g.strokeStyle = c.spike; g.lineWidth = 1.5 * u;
    for (let i = 0; i < 5; i++) {
      g.beginPath(); g.moveTo(-4 * u, (-10 + i * 5) * u); g.lineTo(-8 * u, (-8 + i * 5) * u); g.stroke();
      g.beginPath(); g.moveTo(4 * u, (-8 + i * 5) * u); g.lineTo(8 * u, (-6 + i * 5) * u); g.stroke();
    }
  }

  function drawGhost(g, u, c) {
    sh(g, c.body, 2 * u, ctx => {
      ctx.beginPath(); ctx.arc(0, -4 * u, 12 * u, Math.PI, 0); ctx.lineTo(12 * u, 10 * u);
      for (let i = 3; i >= 0; i--) {
        ctx.lineTo((i * 6 - 6) * u, (6 + (i % 2) * 4) * u);
      }
      ctx.closePath(); ctx.fill();
    });
    dot(g, -5 * u, -4 * u, 3 * u, '#fff');
    dot(g, 5 * u, -4 * u, 3 * u, '#fff');
    dot(g, -5 * u, -4 * u, 1.5 * u, c.eye);
    dot(g, 5 * u, -4 * u, 1.5 * u, c.eye);
  }

  function drawGear(g, u, c) {
    sh(g, c.body, 2.4 * u, ctx => {
      ctx.beginPath(); ctx.arc(0, 0, 10 * u, 0, Math.PI * 2); ctx.fill();
    });
    g.strokeStyle = c.accent; g.lineWidth = 4 * u;
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      g.beginPath(); g.moveTo(Math.cos(a) * 10 * u, Math.sin(a) * 10 * u); g.lineTo(Math.cos(a) * 16 * u, Math.sin(a) * 16 * u); g.stroke();
    }
    dot(g, 0, 0, 4 * u, c.accent);
  }

  function drawStar(g, u, c) {
    sh(g, c.body, 2 * u, ctx => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 2 / 5 - Math.PI / 2;
        const a2 = a + Math.PI / 5;
        if (i === 0) ctx.moveTo(Math.cos(a) * 14 * u, Math.sin(a) * 14 * u);
        else ctx.lineTo(Math.cos(a) * 14 * u, Math.sin(a) * 14 * u);
        ctx.lineTo(Math.cos(a2) * 6 * u, Math.sin(a2) * 6 * u);
      }
      ctx.closePath(); ctx.fill();
    });
    dot(g, 0, 0, 3 * u, c.accent);
  }

  function drawVine(g, u, c) {
    sh(g, c.body, 2 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, 4 * u, 10 * u, 14 * u, 0, 0, Math.PI * 2); ctx.fill();
    });
    g.strokeStyle = c.accent; g.lineWidth = 3 * u;
    g.beginPath(); g.moveTo(-6 * u, -8 * u); g.quadraticCurveTo(-16 * u, -16 * u, -12 * u, -22 * u); g.stroke();
    g.beginPath(); g.moveTo(6 * u, -6 * u); g.quadraticCurveTo(16 * u, -14 * u, 12 * u, -20 * u); g.stroke();
    g.fillStyle = c.wing;
    g.beginPath(); g.ellipse(-12 * u, -22 * u, 6 * u, 4 * u, -0.4, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(12 * u, -20 * u, 6 * u, 4 * u, 0.4, 0, Math.PI * 2); g.fill();
  }

  function drawMeteor(g, u, c) {
    sh(g, c.body, 2.2 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, 0, 14 * u, 12 * u, 0.3, 0, Math.PI * 2); ctx.fill();
    });
    g.fillStyle = c.accent;
    g.beginPath(); g.arc(-4 * u, -2 * u, 3 * u, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(5 * u, 3 * u, 2 * u, 0, Math.PI * 2); g.fill();
    g.strokeStyle = c.spike; g.lineWidth = 2 * u;
    g.beginPath(); g.moveTo(10 * u, -6 * u); g.lineTo(18 * u, -12 * u); g.stroke();
    g.beginPath(); g.moveTo(12 * u, 2 * u); g.lineTo(20 * u, 4 * u); g.stroke();
  }

  function drawSkull(g, u, c) {
    sh(g, c.body, 2.2 * u, ctx => {
      ctx.beginPath(); ctx.arc(0, -4 * u, 12 * u, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(-10 * u, 4 * u, 20 * u, 10 * u);
    });
    dot(g, -5 * u, -4 * u, 3.5 * u, '#fff');
    dot(g, 5 * u, -4 * u, 3.5 * u, '#fff');
    dot(g, -5 * u, -4 * u, 2 * u, c.eye);
    dot(g, 5 * u, -4 * u, 2 * u, c.eye);
    g.strokeStyle = c.spike; g.lineWidth = 2 * u;
    g.beginPath(); g.moveTo(-8 * u, -16 * u); g.lineTo(-6 * u, -10 * u); g.stroke();
    g.beginPath(); g.moveTo(8 * u, -16 * u); g.lineTo(6 * u, -10 * u); g.stroke();
  }

  const DRAWERS = {
    beetle: drawBeetle, wasp: drawWasp, jelly: drawJelly, golem: drawGolem, crab: drawCrab,
    mushroom: drawMushroom, crystal: drawCrystal, robot: drawRobot, fish: drawFish, bat: drawBat,
    snail: drawSnail, flame: drawFlame, ice: drawIce, cactus: drawCactus, ghost: drawGhost,
    gear: drawGear, star: drawStar, vine: drawVine, meteor: drawMeteor, skull: drawSkull,
  };

  function drawArchetype(g, u, name, c, scale) {
    const fn = DRAWERS[name] || drawBeetle;
    g.save(); g.scale(scale, scale); fn(g, u, c); g.restore();
  }

  function drawMidBoss(g, u, c, archName) {
    drawArchetype(g, u, archName, c, 1.35);
    g.strokeStyle = c.crest; g.lineWidth = 3 * u;
    g.beginPath(); g.moveTo(-14 * u, -22 * u); g.lineTo(0, -32 * u); g.lineTo(14 * u, -22 * u); g.stroke();
  }

  function drawFinalBoss(g, u, c, archName) {
    drawArchetype(g, u, archName, c, 1.55);
    g.strokeStyle = c.ring; g.lineWidth = 4 * u;
    g.beginPath(); g.ellipse(0, -4 * u, 30 * u, 12 * u, 0, 0, Math.PI * 2); g.stroke();
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2 + 0.4;
      dot(g, Math.cos(a) * 26 * u, Math.sin(a) * 10 * u - 4 * u, 4 * u, c.ring);
    }
  }

  for (let wi = 11; wi <= 49; wi++) {
    const c = pal(wi);
    const a0 = arch(wi, 0), a1 = arch(wi, 1), a2 = arch(wi, 2), a3 = arch(wi, 3);
    const midArch = arch(wi, 4), finArch = arch(wi, 5);
    makeSprite('ext_e' + wi + '_b0', 94, (g, u) => drawArchetype(g, u, a0, c, 1));
    makeSprite('ext_e' + wi + '_b1', 92, (g, u) => drawArchetype(g, u, a1, c, 1));
    makeSprite('ext_e' + wi + '_s0', 88, (g, u) => drawArchetype(g, u, a2, c, 0.92));
    makeSprite('ext_e' + wi + '_s1', 86, (g, u) => drawArchetype(g, u, a3, c, 0.88));
    makeSprite('ext_mb' + wi, 108, (g, u) => drawMidBoss(g, u, c, midArch));
    makeSprite('ext_fb' + wi, 118, (g, u) => drawFinalBoss(g, u, c, finArch));
  }
})();
