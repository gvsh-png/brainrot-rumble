'use strict';
// Procedural sprites: 4 grunts + mid boss + final boss per extended world (W12–W50).
// Bright, vivid palettes only — no dark/black body colors. Shape accents vary per world.

(function () {
  if (typeof makeSprite !== 'function') return;

  function hsl(h, s, l) {
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const col = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * col).toString(16).padStart(2, '0');
    };
    return '#' + f(0) + f(8) + f(4);
  }

  function worldHue(wi) {
    return (wi * 47 + wi * wi * 13 + 19) % 360;
  }

  function drawBruiser(g, u, body, accent, decor) {
    sh(g, body, 2.2 * u, ctx => {
      if (decor % 3 === 0) {
        ctx.beginPath(); ctx.ellipse(0, 2 * u, 16 * u, 14 * u, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(0, -12 * u, 11 * u, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillRect(-14 * u, -6 * u, 28 * u, 22 * u);
        ctx.beginPath(); ctx.arc(0, -14 * u, 12 * u, 0, Math.PI * 2); ctx.fill();
      }
    });
    if (decor % 2 === 0) {
      g.fillStyle = accent;
      g.fillRect(-12 * u, -2 * u, 24 * u, 4 * u);
    }
    dot(g, -5 * u, -16 * u, 2.5 * u, accent);
    dot(g, 5 * u, -16 * u, 2.5 * u, accent);
  }

  function drawRanger(g, u, body, accent, decor) {
    sh(g, body, 2 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, 0, 16 * u, 13 * u, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = accent;
      if (decor % 3 === 1) ctx.fillRect(8 * u, -8 * u, 20 * u, 5 * u);
      else ctx.fillRect(10 * u, -3 * u, 18 * u, 5 * u);
    });
    if (decor % 2 === 1) {
      g.strokeStyle = accent; g.lineWidth = 2 * u;
      g.beginPath(); g.moveTo(-14 * u, 8 * u); g.lineTo(-22 * u, 16 * u); g.stroke();
    }
    dot(g, 24 * u, -1 * u, 2 * u, '#fff');
  }

  function drawSwarm(g, u, body, wing, eyeCol, decor) {
    sh(g, body, 1.8 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, 0, 14 * u, 9 * u, 0, 0, Math.PI * 2); ctx.fill();
    });
    g.fillStyle = wing;
    const wingTilt = decor % 4 === 0 ? 0.25 : 0;
    g.beginPath(); g.ellipse(-10 * u, 0, 8 * u, 11 * u, wingTilt, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(10 * u, 0, 8 * u, 11 * u, -wingTilt, 0, Math.PI * 2); g.fill();
    dot(g, 8 * u, -1 * u, 2 * u, eyeCol);
    if (decor % 3 === 2) dot(g, -6 * u, 2 * u, 1.8 * u, eyeCol);
  }

  function drawSwarmling(g, u, body, spike, decor) {
    sh(g, body, 1.6 * u, ctx => {
      const spikes = decor % 2 === 0 ? 6 : 8;
      ctx.beginPath(); ctx.arc(0, 0, 11 * u, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < spikes; i++) {
        const a = i * Math.PI * 2 / spikes;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 8 * u, Math.sin(a) * 8 * u);
        ctx.lineTo(Math.cos(a) * (16 + (decor % 3)) * u, Math.sin(a) * (16 + (decor % 3)) * u);
        ctx.strokeStyle = spike; ctx.lineWidth = 2.5 * u; ctx.stroke();
      }
    });
    dot(g, 0, -2 * u, 2 * u, '#fff');
  }

  function drawMidBoss(g, u, body, crest, horns, decor) {
    sh(g, body, 2.6 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, 4 * u, 24 * u, 20 * u, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -12 * u, 16 * u, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = crest;
      if (decor % 3 === 0) {
        ctx.beginPath(); ctx.moveTo(0, -28 * u); ctx.lineTo(-10 * u, -14 * u); ctx.lineTo(10 * u, -14 * u); ctx.fill();
      } else if (decor % 3 === 1) {
        ctx.beginPath(); ctx.moveTo(-8 * u, -26 * u); ctx.lineTo(0, -34 * u); ctx.lineTo(8 * u, -26 * u); ctx.fill();
      } else {
        ctx.fillRect(-14 * u, -24 * u, 28 * u, 8 * u);
      }
    });
    g.strokeStyle = horns; g.lineWidth = 3 * u;
    const hornLen = 10 + (decor % 4) * 2;
    g.beginPath(); g.moveTo(-12 * u, -18 * u); g.lineTo(-20 * u, -hornLen * u - 18 * u); g.stroke();
    g.beginPath(); g.moveTo(12 * u, -18 * u); g.lineTo(20 * u, -hornLen * u - 18 * u); g.stroke();
    if (decor % 2 === 0) {
      g.fillStyle = crest;
      g.beginPath(); g.arc(0, -10 * u, 5 * u, 0, Math.PI * 2); g.fill();
    }
  }

  function drawFinalBoss(g, u, body, ring, core, decor) {
    sh(g, body, 3 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, 6 * u, 30 * u, 24 * u, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -14 * u, 20 * u, 0, Math.PI * 2); ctx.fill();
    });
    g.strokeStyle = ring; g.lineWidth = 4 * u;
    g.beginPath(); g.ellipse(0, -4 * u, 34 * u, 12 * u, 0, 0, Math.PI * 2); g.stroke();
    if (decor % 3 === 1) {
      g.beginPath(); g.ellipse(0, 8 * u, 26 * u, 8 * u, 0, 0, Math.PI * 2); g.stroke();
    }
    g.fillStyle = core;
    g.beginPath(); g.arc(0, -14 * u, 7 * u, 0, Math.PI * 2); g.fill();
    const orbs = decor % 2 === 0 ? 4 : 6;
    for (let i = 0; i < orbs; i++) {
      const a = i * Math.PI * 2 / orbs + 0.4;
      dot(g, Math.cos(a) * 28 * u, Math.sin(a) * 10 * u - 4 * u, 4 * u, ring);
    }
  }

  const drawFns = [drawBruiser, drawRanger, drawSwarm, drawSwarmling];
  const slotIds = ['b0', 'b1', 's0', 's1'];

  for (let wi = 11; wi <= 49; wi++) {
    const h = worldHue(wi);
    const body = hsl(h, 62, 68);
    const accent = hsl((h + 50) % 360, 75, 72);
    const wing = hsl((h + 20) % 360, 65, 82);
    const spike = hsl((h + 90) % 360, 70, 70);
    const crest = hsl((h + 30) % 360, 78, 78);
    const horns = hsl((h + 10) % 360, 65, 62);
    const ring = hsl((h + 60) % 360, 82, 72);
    const eyeCol = hsl((h + 140) % 360, 80, 55);
    const decor = wi % 6;
    const perm = (wi * 5 + 3) % 4;

    for (let s = 0; s < 4; s++) {
      const fn = drawFns[(s + perm) % 4];
      const id = slotIds[s];
      const args = fn === drawBruiser ? [body, accent, decor]
        : fn === drawRanger ? [body, accent, decor]
        : fn === drawSwarm ? [body, wing, eyeCol, decor]
        : [body, spike, decor];
      makeSprite('ext_e' + wi + '_' + id, 88 + s * 2, (g, u) => fn(g, u, ...args));
    }
    makeSprite('ext_mb' + wi, 108, (g, u) => drawMidBoss(g, u, body, crest, horns, decor));
    makeSprite('ext_fb' + wi, 118, (g, u) => drawFinalBoss(g, u, body, ring, '#ffffff', decor));
  }
})();
