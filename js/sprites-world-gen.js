'use strict';
// Extended-world sprites (W12–W50): brainrot hybrids in the house style (sh/dot/eyes + OUT).
// Each world: 4 unique grunt brainrots + mid boss + final boss titan.

(function () {
  if (typeof makeSprite !== 'function' || typeof sh !== 'function') return;

  const GRUNT_TYPES = [
    'cappuccino', 'trulimero', 'baraboom', 'bobritto', 'pipikiwi', 'glorbo', 'burbaloni',
    'frula', 'espresso', 'zibra', 'golubiro', 'tralalerito', 'ambalabu', 'dindin',
    'bananini', 'octopus', 'jelly', 'goose', 'lirili', 'swarmwasp',
  ];

  function pal(wi) {
    const h = (wi * 37 + 11) % 360;
    const hue = n => {
      const a = 70 * Math.min(n / 100, 1 - n / 100) / 100;
      const f = k => {
        const x = (k + h / 30) % 12;
        const col = n / 100 - a * Math.max(Math.min(x - 3, 9 - x, 1), -1);
        return Math.round(255 * col).toString(16).padStart(2, '0');
      };
      return '#' + f(0) + f(8) + f(4);
    };
    return {
      main: hue(58), accent: hue(72), dark: hue(38), light: hue(82),
      skin: '#f0c9a0', wood: '#a9763e', metal: '#cdd2d9',
    };
  }

  function pick(wi, slot) {
    return GRUNT_TYPES[(wi * 3 + slot * 7 + 2) % GRUNT_TYPES.length];
  }

  function finIdx(wi) { return (wi * 3 + 7) % 13; }
  function midIdx(wi) { return wi % 13; }

  // ---- grunt brainrots (same visual language as sprites.js) ----

  function drawCappuccino(g, u, c) {
    sh(g, c.main, 3 * u, p => { p.ellipse(0, 4 * u, 16 * u, 20 * u, 0, 0, TAU); });
    sh(g, c.accent, 2.4 * u, p => { p.ellipse(0, -10 * u, 14 * u, 8 * u, 0, 0, TAU); });
    sh(g, '#f5e6d3', 0, p => { p.ellipse(0, -6 * u, 10 * u, 5 * u, 0, 0, TAU); });
    sh(g, '#2b1a10', 2 * u, p => { p.moveTo(-14 * u, -14 * u); p.lineTo(14 * u, -14 * u); p.lineTo(10 * u, -24 * u); p.lineTo(-10 * u, -24 * u); p.closePath(); });
    eyes(g, u, 0, -12 * u, 5 * u, 3 * u);
    sh(g, c.dark, 2 * u, p => { p.rect(-4 * u, 16 * u, 8 * u, 10 * u); });
  }

  function drawTrulimero(g, u, c) {
    sh(g, c.main, 3.2 * u, p => { p.ellipse(0, -2 * u, 20 * u, 12 * u, 0, 0, TAU); });
    sh(g, c.light, 0, p => { p.ellipse(0, 4 * u, 14 * u, 6 * u, 0, 0, TAU); });
    sh(g, c.accent, 2.8 * u, p => { p.roundRect(-6 * u, 10 * u, 5 * u, 14 * u, 2 * u); p.roundRect(1 * u, 10 * u, 5 * u, 14 * u, 2 * u); });
    sh(g, c.main, 2.4 * u, p => { p.moveTo(18 * u, -2 * u); p.lineTo(28 * u, 0); p.lineTo(18 * u, 4 * u); p.closePath(); });
    eyes(g, u, 8 * u, -4 * u, 5 * u, 3 * u);
  }

  function drawBaraboom(g, u, c) {
    sh(g, c.main, 3.4 * u, p => { p.arc(0, 0, 14 * u, 0, TAU); });
    sh(g, c.accent, 0, p => { p.rect(-10 * u, -4 * u, 20 * u, 3 * u); p.rect(-4 * u, -10 * u, 3 * u, 20 * u); });
    sh(g, '#fff', 2 * u, p => { p.roundRect(-4 * u, -16 * u, 8 * u, 10 * u, 2 * u); });
    dot(g, 0, -11 * u, 2 * u, c.dark);
    eyes(g, u, -6 * u, -2 * u, 4 * u, 2.8 * u);
    dot(g, 6 * u, -2 * u, 4 * u, '#ff3b30');
  }

  function drawBobritto(g, u, c) {
    sh(g, c.dark, 2 * u, p => { p.ellipse(0, 24 * u, 10 * u, 5 * u, 0, 0, TAU); });
    sh(g, c.main, 3 * u, p => { p.ellipse(0, 4 * u, 16 * u, 20 * u, 0, 0, TAU); });
    sh(g, c.accent, 3 * u, p => { p.ellipse(0, -14 * u, 12 * u, 12 * u, 0, 0, TAU); });
    sh(g, '#c0392b', 2 * u, p => { p.rect(-12 * u, -20 * u, 24 * u, 7 * u); });
    eyes(g, u, 0, -16 * u, 5 * u, 3 * u);
    sh(g, '#d0d0d0', 1.5 * u, p => { p.rect(12 * u, -2 * u, 3 * u, 12 * u); });
  }

  function drawPipikiwi(g, u, c) {
    sh(g, c.main, 3.2 * u, p => { p.ellipse(0, 2 * u, 18 * u, 16 * u, 0, 0, TAU); });
    sh(g, c.accent, 0, p => { for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; p.moveTo(Math.cos(a) * 10 * u, Math.sin(a) * 8 * u); p.lineTo(Math.cos(a) * 16 * u, Math.sin(a) * 13 * u); } });
    g.strokeStyle = c.dark; g.lineWidth = 1.4 * u; g.stroke();
    sh(g, '#8d6e3c', 2 * u, p => { p.rect(-2 * u, -16 * u, 4 * u, 6 * u); });
    eyes(g, u, 0, -4 * u, 6 * u, 3.5 * u);
  }

  function drawGlorbo(g, u, c) {
    sh(g, c.main, 3.4 * u, p => { p.ellipse(0, 6 * u, 18 * u, 14 * u, 0, 0, TAU); });
    sh(g, c.accent, 3 * u, p => { p.ellipse(0, -12 * u, 16 * u, 13 * u, 0, 0, TAU); });
    sh(g, '#fff', 0, p => { p.ellipse(-5 * u, -14 * u, 4 * u, 7 * u, 0.2, 0, TAU); });
    for (let i = 0; i < 5; i++) {
      sh(g, '#fff', 0.8 * u, p => { p.moveTo((10 + i * 3) * u, 4 * u); p.lineTo((11 + i * 3) * u, 8 * u); p.lineTo((12 + i * 3) * u, 4 * u); p.closePath(); });
    }
    eyes(g, u, 4 * u, -12 * u, 5 * u, 3 * u);
  }

  function drawBurbaloni(g, u, c) {
    sh(g, c.main, 3.2 * u, p => { p.ellipse(0, 2 * u, 20 * u, 20 * u, 0, 0, TAU); });
    sh(g, c.accent, 0, p => { p.ellipse(4 * u, 6 * u, 10 * u, 8 * u, 0, 0, TAU); });
    dot(g, -10 * u, -2 * u, 4 * u, '#f4a7c3'); dot(g, 10 * u, -2 * u, 4 * u, '#f4a7c3');
    eyes(g, u, 0, -4 * u, 7 * u, 3.5 * u);
    g.strokeStyle = OUT; g.lineWidth = 1.5 * u;
    g.beginPath(); g.moveTo(-8 * u, 4 * u); g.quadraticCurveTo(0, 10 * u, 8 * u, 4 * u); g.stroke();
  }

  function drawFrula(g, u, c) {
    sh(g, c.main, 3 * u, p => { p.ellipse(0, 0, 14 * u, 16 * u, 0, 0, TAU); });
    sh(g, c.accent, 0, p => { p.ellipse(-6 * u, -8 * u, 6 * u, 8 * u, -0.3, 0, TAU); p.ellipse(6 * u, 6 * u, 5 * u, 7 * u, 0.2, 0, TAU); });
    sh(g, '#7cb342', 2 * u, p => { p.rect(-2 * u, -18 * u, 4 * u, 6 * u); });
    eyes(g, u, 0, -4 * u, 5 * u, 3 * u);
  }

  function drawEspresso(g, u, c) {
    sh(g, c.dark, 3 * u, p => { p.roundRect(-12 * u, -8 * u, 24 * u, 28 * u, 4 * u); });
    sh(g, c.main, 0, p => { p.ellipse(0, -8 * u, 12 * u, 5 * u, 0, 0, TAU); });
    sh(g, '#f5e6d3', 2 * u, p => { p.ellipse(0, -10 * u, 8 * u, 4 * u, 0, 0, TAU); });
    sh(g, c.accent, 2.4 * u, p => { p.roundRect(-8 * u, 4 * u, 5 * u, 12 * u, 2 * u); p.roundRect(3 * u, 4 * u, 5 * u, 12 * u, 2 * u); });
    eyes(g, u, 0, 2 * u, 5 * u, 3 * u);
  }

  function drawZibra(g, u, c) {
    sh(g, c.light, 3.2 * u, p => { p.ellipse(0, 4 * u, 18 * u, 16 * u, 0, 0, TAU); });
    sh(g, c.dark, 0, p => { p.ellipse(-8 * u, 0, 5 * u, 12 * u, 0.2, 0, TAU); p.ellipse(6 * u, 8 * u, 4 * u, 10 * u, -0.1, 0, TAU); });
    sh(g, c.accent, 3 * u, p => { p.ellipse(0, -14 * u, 11 * u, 10 * u, 0, 0, TAU); });
    sh(g, c.dark, 0, p => { p.rect(-10 * u, -18 * u, 4 * u, 8 * u); p.rect(2 * u, -20 * u, 4 * u, 10 * u); p.rect(8 * u, -16 * u, 3 * u, 7 * u); });
    eyes(g, u, 0, -16 * u, 5 * u, 3 * u);
  }

  function drawGolubiro(g, u, c) {
    sh(g, c.main, 3 * u, p => { p.ellipse(0, 4 * u, 14 * u, 12 * u, 0, 0, TAU); });
    sh(g, c.accent, 3 * u, p => { p.ellipse(0, -10 * u, 10 * u, 9 * u, 0, 0, TAU); });
    sh(g, c.light, 2 * u, p => { p.ellipse(-12 * u, 0, 8 * u, 5 * u, 0.3, 0, TAU); p.ellipse(12 * u, 0, 8 * u, 5 * u, -0.3, 0, TAU); });
    dot(g, 0, -8 * u, 3 * u, '#ff9800');
    eyes(g, u, -4 * u, -12 * u, 3.5 * u, 2.5 * u);
    sh(g, '#5d4037', 1.6 * u, p => { p.ellipse(0, 14 * u, 8 * u, 4 * u, 0, 0, TAU); });
  }

  function drawTralalerito(g, u, c) {
    sh(g, c.main, 3.2 * u, p => { p.ellipse(0, 0, 18 * u, 11 * u, 0, 0, TAU); });
    sh(g, c.light, 0, p => { p.ellipse(0, 5 * u, 12 * u, 5 * u, 0, 0, TAU); });
    sh(g, c.main, 2.4 * u, p => { p.moveTo(-2 * u, -10 * u); p.lineTo(4 * u, -22 * u); p.lineTo(10 * u, -8 * u); p.closePath(); });
    sh(g, c.accent, 2 * u, p => { p.roundRect(-12 * u, 10 * u, 10 * u, 6 * u, 2 * u); p.roundRect(2 * u, 10 * u, 10 * u, 6 * u, 2 * u); });
    eyes(g, u, 8 * u, -2 * u, 4 * u, 2.6 * u);
  }

  function drawAmbalabu(g, u, c) {
    sh(g, c.dark, 3.4 * u, p => { p.ellipse(0, 10 * u, 20 * u, 8 * u, 0, 0, TAU); });
    sh(g, c.main, 3 * u, p => { p.ellipse(0, -4 * u, 14 * u, 14 * u, 0, 0, TAU); });
    sh(g, c.accent, 2.4 * u, p => { p.ellipse(-14 * u, 0, 6 * u, 4 * u, 0.4, 0, TAU); p.ellipse(14 * u, 0, 6 * u, 4 * u, -0.4, 0, TAU); });
    eyes(g, u, 0, -6 * u, 6 * u, 3.5 * u);
    g.strokeStyle = OUT; g.lineWidth = 2 * u; g.beginPath(); g.arc(0, -2 * u, 8 * u, 0.2, Math.PI - 0.2); g.stroke();
  }

  function drawDindin(g, u, c) {
    sh(g, c.wood, 3.4 * u, p => { p.moveTo(-10 * u, 20 * u); p.lineTo(-8 * u, -14 * u); p.lineTo(8 * u, -14 * u); p.lineTo(10 * u, 20 * u); p.closePath(); });
    sh(g, c.accent, 3 * u, p => { p.moveTo(-10 * u, -14 * u); p.lineTo(0, -26 * u); p.lineTo(10 * u, -14 * u); p.closePath(); });
    sh(g, '#caa12f', 2.6 * u, p => { p.moveTo(-7 * u, -2 * u); p.quadraticCurveTo(-8 * u, 10 * u, 0, 12 * u); p.quadraticCurveTo(8 * u, 10 * u, 7 * u, -2 * u); p.closePath(); });
    eyes(g, u, 0, 2 * u, 4 * u, 2.8 * u);
  }

  function drawBananini(g, u, c) {
    sh(g, c.accent, 3 * u, p => { p.moveTo(-8 * u, 8 * u); p.quadraticCurveTo(0, -20 * u, 8 * u, 8 * u); p.closePath(); });
    sh(g, c.main, 3.2 * u, p => { p.ellipse(0, 6 * u, 12 * u, 14 * u, 0, 0, TAU); });
    sh(g, c.dark, 0, p => { p.ellipse(0, 8 * u, 8 * u, 6 * u, 0, 0, TAU); });
    eyes(g, u, 0, 0, 5 * u, 3 * u);
  }

  function drawOctopus(g, u, c) {
    sh(g, c.main, 3.2 * u, p => { p.arc(0, -4 * u, 12 * u, Math.PI, 0); p.lineTo(12 * u, 6 * u); p.arc(0, 6 * u, 12 * u, 0, Math.PI, true); p.fill(); });
    g.strokeStyle = c.accent; g.lineWidth = 2.5 * u;
    for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * 4 * u, 6 * u); g.lineTo(i * 5 * u, 18 * u); g.stroke(); }
    eyes(g, u, -4 * u, -2 * u, 3 * u, 2.5 * u); eyes(g, u, 4 * u, -2 * u, 3 * u, 2.5 * u);
  }

  function drawJelly(g, u, c) {
    sh(g, c.main, 3 * u, p => { p.arc(0, -2 * u, 12 * u, Math.PI, 0); p.lineTo(12 * u, 8 * u); p.arc(0, 8 * u, 12 * u, 0, Math.PI, true); p.fill(); });
    g.strokeStyle = c.accent; g.lineWidth = 2 * u;
    for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * 4 * u, 8 * u); g.quadraticCurveTo(i * 6 * u, 16 * u, i * 4 * u, 22 * u); g.stroke(); }
    dot(g, -4 * u, 0, 2.5 * u, '#fff'); dot(g, 4 * u, 0, 2.5 * u, '#fff');
    dot(g, -4 * u, 0, 1.2 * u, OUT); dot(g, 4 * u, 0, 1.2 * u, OUT);
  }

  function drawGoose(g, u, c) {
    sh(g, c.main, 3.2 * u, p => { p.ellipse(0, 4 * u, 16 * u, 14 * u, 0, 0, TAU); });
    sh(g, c.light, 0, p => { p.ellipse(0, 8 * u, 10 * u, 8 * u, 0, 0, TAU); });
    sh(g, c.accent, 3 * u, p => { p.ellipse(0, -12 * u, 10 * u, 9 * u, 0, 0, TAU); });
    sh(g, '#ff9800', 2 * u, p => { p.moveTo(8 * u, -10 * u); p.lineTo(18 * u, -8 * u); p.lineTo(8 * u, -6 * u); p.closePath(); });
    eyes(g, u, 2 * u, -14 * u, 4 * u, 2.8 * u);
  }

  function drawLirili(g, u, c) {
    sh(g, c.main, 3.4 * u, p => { p.ellipse(0, 8 * u, 14 * u, 18 * u, 0, 0, TAU); });
    sh(g, c.accent, 3 * u, p => { p.ellipse(0, -14 * u, 16 * u, 14 * u, 0, 0, TAU); });
    sh(g, c.dark, 2 * u, p => { p.roundRect(-18 * u, 0, 6 * u, 16 * u, 2 * u); p.roundRect(12 * u, 0, 6 * u, 16 * u, 2 * u); });
    eyes(g, u, -5 * u, -16 * u, 4 * u, 3 * u); eyes(g, u, 5 * u, -16 * u, 4 * u, 3 * u);
  }

  function drawSwarmwasp(g, u, c) {
    sh(g, c.main, 2.8 * u, p => { p.ellipse(0, 0, 12 * u, 8 * u, 0, 0, TAU); });
    sh(g, c.accent, 0, p => { p.fillRect(-10 * u, -2 * u, 20 * u, 4 * u); });
    g.fillStyle = 'rgba(255,255,255,0.55)';
    g.beginPath(); g.ellipse(-8 * u, 0, 7 * u, 10 * u, 0, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(8 * u, 0, 7 * u, 10 * u, 0, 0, TAU); g.fill();
    eyes(g, u, 6 * u, -1 * u, 3 * u, 2.2 * u);
    sh(g, c.dark, 2 * u, p => { p.moveTo(12 * u, 0); p.lineTo(18 * u, -2 * u); p.lineTo(18 * u, 2 * u); p.closePath(); });
  }

  const DRAWERS = {
    cappuccino: drawCappuccino, trulimero: drawTrulimero, baraboom: drawBaraboom, bobritto: drawBobritto,
    pipikiwi: drawPipikiwi, glorbo: drawGlorbo, burbaloni: drawBurbaloni, frula: drawFrula,
    espresso: drawEspresso, zibra: drawZibra, golubiro: drawGolubiro, tralalerito: drawTralalerito,
    ambalabu: drawAmbalabu, dindin: drawDindin, bananini: drawBananini, octopus: drawOctopus,
    jelly: drawJelly, goose: drawGoose, lirili: drawLirili, swarmwasp: drawSwarmwasp,
  };

  function drawGrunt(g, u, type, c, scale) {
    const fn = DRAWERS[type] || drawTralalerito;
    g.save(); g.scale(scale, scale); fn(g, u, c); g.restore();
  }

  function drawMidBoss(g, u, type, c, idx) {
    g.save(); g.scale(1.28, 1.28);
    (DRAWERS[type] || drawTralalerito)(g, u, c);
    g.restore();
    sh(g, '#ffd23a', 3 * u, p => { p.moveTo(-12 * u, -28 * u); p.lineTo(0, -38 * u); p.lineTo(12 * u, -28 * u); p.closePath(); });
    dot(g, 0, -32 * u, 3 * u, c.accent);
    if (idx % 3 === 0) {
      sh(g, c.dark, 2.4 * u, p => { p.moveTo(-16 * u, -20 * u); p.lineTo(-22 * u, -30 * u); p.moveTo(16 * u, -20 * u); p.lineTo(22 * u, -30 * u); });
    }
  }

  // ---- 13 final boss titans (brainrot legends, matching extfin0–12 attacks) ----

  function drawFinHive(g, u, c) {
    sh(g, c.main, 3.6 * u, p => { p.ellipse(0, 8 * u, 26 * u, 22 * u, 0, 0, TAU); });
    sh(g, c.accent, 0, p => { for (let row = 0; row < 3; row++) for (let col = 0; col < 4; col++) p.rect((-18 + col * 10) * u, (-8 + row * 8) * u, 8 * u, 6 * u); });
    sh(g, c.light, 3.4 * u, p => { p.ellipse(0, -18 * u, 18 * u, 16 * u, 0, 0, TAU); });
    g.fillStyle = 'rgba(255,255,255,0.5)'; g.beginPath(); g.ellipse(-16 * u, -10 * u, 10 * u, 14 * u, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(16 * u, -10 * u, 10 * u, 14 * u, 0, 0, TAU); g.fill();
    eyes(g, u, 0, -20 * u, 7 * u, 4 * u);
    sh(g, '#ffd23a', 3 * u, p => { p.moveTo(0, -34 * u); p.lineTo(-8 * u, -24 * u); p.lineTo(8 * u, -24 * u); p.closePath(); });
  }

  function drawFinVoid(g, u, c) {
    sh(g, '#2a1040', 4 * u, p => { p.ellipse(0, 4 * u, 28 * u, 24 * u, 0, 0, TAU); });
    sh(g, c.accent, 0, p => { p.ellipse(0, -8 * u, 22 * u, 20 * u, 0, 0, TAU); });
    dot(g, 0, -8 * u, 10 * u, '#1a0828'); dot(g, 0, -8 * u, 6 * u, c.light);
    dot(g, 0, -8 * u, 2.5 * u, '#fff');
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * TAU - Math.PI / 2;
      sh(g, c.main, 2.4 * u, p => { p.ellipse(Math.cos(a) * 20 * u, Math.sin(a) * 16 * u + 4 * u, 5 * u, 10 * u, a, 0, TAU); });
    }
  }

  function drawFinPlasma(g, u, c) {
    sh(g, '#3a2a26', 4.2 * u, p => { p.ellipse(0, 8 * u, 28 * u, 26 * u, 0, 0, TAU); });
    sh(g, '#e0503f', 0, p => { p.moveTo(-14 * u, 0); p.lineTo(0, 6 * u); p.lineTo(-8 * u, 18 * u); p.closePath(); p.moveTo(8 * u, -4 * u); p.lineTo(20 * u, 6 * u); p.lineTo(10 * u, 20 * u); p.closePath(); });
    sh(g, '#ff9f3a', 0, p => { p.ellipse(-6 * u, 10 * u, 6 * u, 4 * u, 0, 0, TAU); p.ellipse(10 * u, 4 * u, 5 * u, 4 * u, 0, 0, TAU); });
    sh(g, '#caa96a', 3.4 * u, p => { p.moveTo(-24 * u, -16 * u); p.lineTo(-38 * u, -34 * u); p.lineTo(-18 * u, -26 * u); p.closePath(); p.moveTo(24 * u, -16 * u); p.lineTo(38 * u, -34 * u); p.lineTo(18 * u, -26 * u); p.closePath(); });
    dot(g, -9 * u, -6 * u, 5 * u, '#ffe08a'); dot(g, 9 * u, -6 * u, 5 * u, '#ffe08a');
    sh(g, '#ff7a2a', 2.6 * u, p => { p.moveTo(-12 * u, 14 * u); p.lineTo(-6 * u, 20 * u); p.lineTo(0, 14 * u); p.lineTo(6 * u, 20 * u); p.lineTo(12 * u, 14 * u); });
  }

  function drawFinCrystal(g, u, c) {
    sh(g, c.light, 4 * u, p => { p.moveTo(0, -32 * u); p.lineTo(22 * u, 8 * u); p.lineTo(0, 28 * u); p.lineTo(-22 * u, 8 * u); p.closePath(); });
    sh(g, c.accent, 0, p => { p.moveTo(0, -20 * u); p.lineTo(12 * u, 6 * u); p.lineTo(0, 18 * u); p.lineTo(-12 * u, 6 * u); p.closePath(); });
    sh(g, c.main, 2.4 * u, p => { p.moveTo(-28 * u, -8 * u); p.lineTo(-20 * u, 20 * u); p.lineTo(-8 * u, 8 * u); p.closePath(); p.moveTo(28 * u, -8 * u); p.lineTo(20 * u, 20 * u); p.lineTo(8 * u, 8 * u); p.closePath(); });
    dot(g, -6 * u, 0, 4 * u, '#fff'); dot(g, 6 * u, 0, 4 * u, '#fff');
    dot(g, -6 * u, 0, 2 * u, c.dark); dot(g, 6 * u, 0, 2 * u, c.dark);
  }

  function drawFinStorm(g, u, c) {
    sh(g, c.main, 3.8 * u, p => { p.ellipse(0, 4 * u, 30 * u, 18 * u, 0, 0, TAU); });
    sh(g, c.light, 0, p => { p.ellipse(0, 10 * u, 22 * u, 8 * u, 0, 0, TAU); });
    sh(g, c.main, 3 * u, p => { p.moveTo(-4 * u, -14 * u); p.lineTo(4 * u, -32 * u); p.lineTo(12 * u, -14 * u); p.closePath(); });
    sh(g, '#ffd23a', 2.6 * u, p => { p.moveTo(-20 * u, -20 * u); p.lineTo(-12 * u, -8 * u); p.lineTo(-16 * u, 0); p.lineTo(-28 * u, -6 * u); p.closePath(); p.moveTo(16 * u, -16 * u); p.lineTo(28 * u, -10 * u); p.lineTo(22 * u, 2 * u); p.lineTo(12 * u, -4 * u); p.closePath(); });
    eyes(g, u, -12 * u, -2 * u, 6 * u, 4 * u);
    for (const lx of [-10, 8, 22]) { sh(g, '#fff', 2.4 * u, p => { p.roundRect(lx * u, 14 * u, 12 * u, 7 * u, 3 * u); }); sh(g, '#e54d4d', 1.6 * u, p => { p.rect(lx * u, 19 * u, 12 * u, 3 * u); }); }
  }

  function drawFinToxic(g, u, c) {
    sh(g, c.main, 4 * u, p => { p.ellipse(0, 6 * u, 28 * u, 24 * u, 0, 0, TAU); });
    sh(g, c.accent, 0, p => { p.ellipse(6 * u, 10 * u, 14 * u, 12 * u, 0, 0, TAU); });
    dot(g, -12 * u, 0, 6 * u, '#b8f04a'); dot(g, 12 * u, 2 * u, 5 * u, '#b8f04a'); dot(g, 0, 14 * u, 4 * u, '#b8f04a');
    eyes(g, u, 0, -4 * u, 8 * u, 4 * u);
    g.strokeStyle = c.dark; g.lineWidth = 2 * u;
    for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo((-8 + i * 5) * u, 20 * u); g.quadraticCurveTo((-10 + i * 6) * u, 30 * u, (-6 + i * 4) * u, 34 * u); g.stroke(); }
  }

  function drawFinGravity(g, u, c) {
    g.save(); g.rotate(-0.35); sh(g, c.accent, 3.2 * u, p => { p.ellipse(0, 0, 40 * u, 12 * u, 0, 0, TAU); }); g.restore();
    sh(g, '#1f2a33', 3.8 * u, p => { p.ellipse(0, 4 * u, 26 * u, 20 * u, 0, 0, TAU); });
    sh(g, '#eef4f7', 0, p => { p.ellipse(0, 10 * u, 18 * u, 7 * u, 0, 0, Math.PI); });
    sh(g, '#eef4f7', 0, p => { p.ellipse(-14 * u, 2 * u, 7 * u, 5 * u, 0, 0, TAU); });
    sh(g, '#1f2a33', 2.4 * u, p => { p.moveTo(-28 * u, 0); p.lineTo(-42 * u, -12 * u); p.lineTo(-36 * u, 4 * u); p.closePath(); });
    eyes(g, u, 10 * u, -2 * u, 5 * u, 3 * u);
  }

  function drawFinClock(g, u, c) {
    sh(g, c.wood, 4 * u, p => { p.moveTo(-18 * u, 30 * u); p.lineTo(-14 * u, -22 * u); p.lineTo(14 * u, -22 * u); p.lineTo(18 * u, 30 * u); p.closePath(); });
    sh(g, c.accent, 3.2 * u, p => { p.moveTo(-18 * u, -22 * u); p.lineTo(0, -38 * u); p.lineTo(18 * u, -22 * u); p.closePath(); });
    sh(g, '#caa12f', 3.4 * u, p => { p.arc(0, 4 * u, 14 * u, 0, TAU); });
    sh(g, c.dark, 2 * u, p => { p.moveTo(0, 4 * u); p.lineTo(0, -6 * u); p.moveTo(0, 4 * u); p.lineTo(8 * u, 8 * u); });
    dot(g, 0, 4 * u, 2.5 * u, OUT);
    eyes(g, u, 0, -10 * u, 5 * u, 3 * u);
  }

  function drawFinFrost(g, u, c) {
    sh(g, c.light, 4 * u, p => { p.ellipse(0, 8 * u, 26 * u, 22 * u, 0, 0, TAU); });
    sh(g, '#e8faf4', 0, p => { p.ellipse(0, 12 * u, 16 * u, 10 * u, 0, 0, TAU); });
    sh(g, c.main, 3.4 * u, p => { p.ellipse(0, -16 * u, 18 * u, 16 * u, 0, 0, TAU); });
    g.save(); g.rotate(-0.4); sh(g, '#d8fff8', 3 * u, p => { p.ellipse(0, 0, 44 * u, 10 * u, 0, 0, TAU); }); g.restore();
    sh(g, '#96d8d0', 0, p => { p.moveTo(-14 * u, -28 * u); p.lineTo(-20 * u, -38 * u); p.moveTo(14 * u, -28 * u); p.lineTo(20 * u, -38 * u); });
    eyes(g, u, 0, -18 * u, 6 * u, 3.5 * u);
  }

  function drawFinEmber(g, u, c) {
    sh(g, '#7a4a2c', 4 * u, p => { p.moveTo(-26 * u, -10 * u); p.quadraticCurveTo(-32 * u, 28 * u, 0, 32 * u); p.quadraticCurveTo(32 * u, 28 * u, 26 * u, -10 * u); p.closePath(); });
    sh(g, '#8a5a34', 3 * u, p => { p.ellipse(0, -10 * u, 26 * u, 8 * u, 0, 0, TAU); });
    sh(g, '#e0503f', 0, p => { p.ellipse(0, -10 * u, 20 * u, 5 * u, 0, 0, TAU); });
    sh(g, '#ff9f3a', 0, p => { p.ellipse(-6 * u, -12 * u, 6 * u, 3 * u, 0, 0, TAU); });
    g.strokeStyle = '#3a2616'; g.lineWidth = 1.6 * u; g.beginPath(); g.moveTo(-10 * u, 4 * u); g.lineTo(-4 * u, 16 * u); g.lineTo(-12 * u, 22 * u); g.stroke();
    eyes(g, u, 0, 6 * u, 7 * u, 4 * u);
  }

  function drawFinQuantum(g, u, c) {
    sh(g, c.main, 3.4 * u, p => { p.rect(-22 * u, -16 * u, 22 * u, 32 * u); });
    dot(g, -12 * u, -4 * u, 4 * u, '#1b5e20'); dot(g, -16 * u, 8 * u, 3 * u, '#1b5e20');
    sh(g, c.light, 3.4 * u, p => { p.rect(0, -16 * u, 22 * u, 32 * u); });
    g.strokeStyle = OUT; g.lineWidth = 2.5 * u; g.beginPath(); g.moveTo(0, -16 * u); g.lineTo(0, 16 * u); g.stroke();
    dot(g, 12 * u, -8 * u, 4 * u, '#f4f4f4'); dot(g, 12 * u, -8 * u, 1.5 * u, OUT);
    sh(g, c.accent, 2 * u, p => { p.ellipse(0, -24 * u, 16 * u, 5 * u, 0, 0, TAU); p.rect(-6 * u, -36 * u, 12 * u, 14 * u); });
  }

  function drawFinBone(g, u, c) {
    sh(g, c.wood, 4 * u, p => { p.roundRect(-16 * u, -18 * u, 32 * u, 48 * u, 8 * u); });
    sh(g, '#7a5a30', 0, p => { p.ellipse(0, 4 * u, 10 * u, 14 * u, 0, 0, TAU); });
    sh(g, c.accent, 3.4 * u, p => { p.ellipse(0, -26 * u, 15 * u, 14 * u, 0, 0, TAU); });
    sh(g, '#2b2b32', 0, p => { p.rect(-14 * u, -30 * u, 28 * u, 7 * u); });
    eyes(g, u, 0, -24 * u, 6 * u, 3.4 * u);
    sh(g, c.dark, 2.6 * u, p => { p.roundRect(20 * u, -36 * u, 10 * u, 36 * u, 4 * u); p.roundRect(24 * u, -48 * u, 18 * u, 20 * u, 5 * u); });
  }

  function drawFinOmega(g, u, c) {
    sh(g, c.wood, 4.2 * u, p => { p.roundRect(-20 * u, -16 * u, 40 * u, 52 * u, 10 * u); });
    sh(g, c.accent, 3.6 * u, p => { p.ellipse(0, -28 * u, 18 * u, 16 * u, 0, 0, TAU); });
    sh(g, '#ffd23a', 3.2 * u, p => { p.moveTo(-14 * u, -38 * u); p.lineTo(0, -50 * u); p.lineTo(14 * u, -38 * u); p.closePath(); });
    sh(g, c.main, 2.8 * u, p => { p.roundRect(-28 * u, -4 * u, 10 * u, 28 * u, 3 * u); p.roundRect(18 * u, -4 * u, 10 * u, 28 * u, 3 * u); });
    eyes(g, u, 0, -30 * u, 7 * u, 4 * u);
    sh(g, '#caa12f', 3 * u, p => { p.roundRect(22 * u, -40 * u, 10 * u, 44 * u, 4 * u); p.roundRect(26 * u, -52 * u, 20 * u, 24 * u, 5 * u); });
    dot(g, 0, -18 * u, 3 * u, c.light);
  }

  const FINAL_DRAWERS = [
    drawFinHive, drawFinVoid, drawFinPlasma, drawFinCrystal, drawFinStorm, drawFinToxic,
    drawFinGravity, drawFinClock, drawFinFrost, drawFinEmber, drawFinQuantum, drawFinBone, drawFinOmega,
  ];

  for (let wi = 11; wi <= 49; wi++) {
    const c = pal(wi);
    const t0 = pick(wi, 0), t1 = pick(wi, 1), t2 = pick(wi, 2), t3 = pick(wi, 3);
    const mid = pick(wi, 4);
    const fin = finIdx(wi);
    makeSprite('ext_e' + wi + '_b0', 100, (g, u) => drawGrunt(g, u, t0, c, 1));
    makeSprite('ext_e' + wi + '_b1', 98, (g, u) => drawGrunt(g, u, t1, c, 1));
    makeSprite('ext_e' + wi + '_s0', 94, (g, u) => drawGrunt(g, u, t2, c, 0.94));
    makeSprite('ext_e' + wi + '_s1', 92, (g, u) => drawGrunt(g, u, t3, c, 0.9));
    makeSprite('ext_mb' + wi, 120, (g, u) => drawMidBoss(g, u, mid, c, midIdx(wi)));
    makeSprite('ext_fb' + wi, 138, (g, u) => (FINAL_DRAWERS[fin] || drawFinOmega)(g, u, c));
  }
})();
