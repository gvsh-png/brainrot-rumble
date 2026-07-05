'use strict';
// Procedural sprites: 4 grunts + mid boss + final boss per extended world (W12–W50).

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

  function drawBruiser(g, u, body, accent) {
    sh(g, body, 2.2 * u, ctx => {
      ctx.fillRect(-14 * u, -6 * u, 28 * u, 22 * u);
      ctx.beginPath(); ctx.arc(0, -14 * u, 12 * u, 0, Math.PI * 2); ctx.fill();
    });
    dot(g, -5 * u, -16 * u, 2.5 * u, accent);
    dot(g, 5 * u, -16 * u, 2.5 * u, accent);
  }

  function drawRanger(g, u, body, accent) {
    sh(g, body, 2 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, 0, 16 * u, 13 * u, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = accent;
      ctx.fillRect(10 * u, -3 * u, 18 * u, 5 * u);
    });
    dot(g, 24 * u, -1 * u, 2 * u, '#fff');
  }

  function drawSwarm(g, u, body, wing) {
    sh(g, body, 1.8 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, 0, 14 * u, 9 * u, 0, 0, Math.PI * 2); ctx.fill();
    });
    g.fillStyle = wing;
    g.beginPath(); g.ellipse(-10 * u, 0, 8 * u, 11 * u, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(10 * u, 0, 8 * u, 11 * u, 0, 0, Math.PI * 2); g.fill();
    dot(g, 8 * u, -1 * u, 2 * u, '#222');
  }

  function drawSwarmling(g, u, body, spike) {
    sh(g, body, 1.6 * u, ctx => {
      ctx.beginPath(); ctx.arc(0, 0, 11 * u, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 8 * u, Math.sin(a) * 8 * u);
        ctx.lineTo(Math.cos(a) * 16 * u, Math.sin(a) * 16 * u);
        ctx.strokeStyle = spike; ctx.lineWidth = 2.5 * u; ctx.stroke();
      }
    });
    dot(g, 0, -2 * u, 2 * u, '#fff');
  }

  function drawMidBoss(g, u, body, crest, horns) {
    sh(g, body, 2.6 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, 4 * u, 24 * u, 20 * u, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -12 * u, 16 * u, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = crest;
      ctx.beginPath(); ctx.moveTo(0, -28 * u); ctx.lineTo(-10 * u, -14 * u); ctx.lineTo(10 * u, -14 * u); ctx.fill();
    });
    g.strokeStyle = horns; g.lineWidth = 3 * u;
    g.beginPath(); g.moveTo(-12 * u, -18 * u); g.lineTo(-20 * u, -30 * u); g.stroke();
    g.beginPath(); g.moveTo(12 * u, -18 * u); g.lineTo(20 * u, -30 * u); g.stroke();
  }

  function drawFinalBoss(g, u, body, ring, core) {
    sh(g, body, 3 * u, ctx => {
      ctx.beginPath(); ctx.ellipse(0, 6 * u, 30 * u, 24 * u, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -14 * u, 20 * u, 0, Math.PI * 2); ctx.fill();
    });
    g.strokeStyle = ring; g.lineWidth = 4 * u;
    g.beginPath(); g.ellipse(0, -4 * u, 34 * u, 12 * u, 0, 0, Math.PI * 2); g.stroke();
    g.fillStyle = core;
    g.beginPath(); g.arc(0, -14 * u, 7 * u, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2 + 0.4;
      dot(g, Math.cos(a) * 28 * u, Math.sin(a) * 10 * u - 4 * u, 4 * u, ring);
    }
  }

  for (let wi = 11; wi <= 49; wi++) {
    const h = (wi * 37) % 360;
    const body = hsl(h, 58, 48);
    const accent = hsl((h + 50) % 360, 70, 58);
    const wing = hsl((h + 20) % 360, 55, 72);
    const spike = hsl((h + 90) % 360, 60, 40);
    const crest = hsl((h + 30) % 360, 75, 62);
    const horns = hsl((h + 10) % 360, 50, 30);
    const ring = hsl((h + 60) % 360, 80, 65);
    const core = '#ffffff';

    makeSprite('ext_e' + wi + '_b0', 94, (g, u) => drawBruiser(g, u, body, accent));
    makeSprite('ext_e' + wi + '_b1', 92, (g, u) => drawRanger(g, u, body, accent));
    makeSprite('ext_e' + wi + '_s0', 88, (g, u) => drawSwarm(g, u, body, wing));
    makeSprite('ext_e' + wi + '_s1', 86, (g, u) => drawSwarmling(g, u, body, spike));
    makeSprite('ext_mb' + wi, 108, (g, u) => drawMidBoss(g, u, body, crest, horns));
    makeSprite('ext_fb' + wi, 118, (g, u) => drawFinalBoss(g, u, body, ring, core));
  }
})();
