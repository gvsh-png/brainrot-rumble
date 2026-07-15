'use strict';
// Per-world cinematic visual effects + layout overlays for campaign cutscenes.

(function () {
  function rand(a, b) { return a + Math.random() * (b - a); }

  function drawDots(cx, t, W, H, n, col, spd, sz) {
    for (let i = 0; i < n; i++) {
      const px = (i / n) * W + Math.sin(t * spd + i * 1.7) * 24;
      const py = ((i * 53 + t * spd * 40) % (H + 40)) - 20;
      cx.globalAlpha = 0.12 + 0.12 * Math.sin(t * 2.4 + i);
      cx.fillStyle = col;
      cx.beginPath();
      cx.arc(px, py, sz + (i % 3), 0, TAU);
      cx.fill();
    }
    cx.globalAlpha = 1;
  }

  function drawRain(cx, t, W, H, col, lean) {
    for (let i = 0; i < 48; i++) {
      const px = (i * 37 + t * 120) % W;
      const py = (i * 29 + t * 280) % (H + 30);
      cx.globalAlpha = 0.2;
      cx.strokeStyle = col;
      cx.lineWidth = 2;
      cx.beginPath();
      cx.moveTo(px, py);
      cx.lineTo(px + lean, py + 22);
      cx.stroke();
    }
    cx.globalAlpha = 1;
  }

  const FX = {
    pollen(cx, t, W, H) { drawDots(cx, t, W, H, 40, '#c8f0a0', 1.2, 2.5); },
    spray(cx, t, W, H) { drawRain(cx, t, W, H, '#9fd0ff', -6); },
    fruitfall(cx, t, W, H) {
      for (let i = 0; i < 22; i++) {
        const px = (i * 61 + Math.sin(t + i) * 20) % W;
        const py = (i * 41 + t * 55) % (H + 20);
        cx.globalAlpha = 0.35;
        cx.fillStyle = i % 2 ? '#ff9a3a' : '#7ec850';
        cx.beginPath(); cx.arc(px, py, 4 + (i % 3), 0, TAU); cx.fill();
      }
      cx.globalAlpha = 1;
    },
    snow(cx, t, W, H) { drawDots(cx, t, W, H, 50, '#e8f8ff', 0.7, 2); },
    spotlight(cx, t, W, H) {
      const a = t * 0.9;
      for (let i = 0; i < 3; i++) {
        const ang = a + i * 2.1;
        cx.save();
        cx.translate(W / 2, 0);
        cx.rotate(ang);
        const g = cx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, 'rgba(255,240,120,0.35)');
        g.addColorStop(1, 'rgba(255,240,120,0)');
        cx.fillStyle = g;
        cx.fillRect(-80, 0, 160, H);
        cx.restore();
      }
    },
    leaves(cx, t, W, H) {
      for (let i = 0; i < 28; i++) {
        const px = (i * 47 + t * 35) % W;
        const py = (i * 31 + t * 48) % (H + 16);
        cx.globalAlpha = 0.4;
        cx.fillStyle = '#e07820';
        cx.fillRect(px, py, 8, 4);
      }
      cx.globalAlpha = 1;
    },
    bubbles(cx, t, W, H) {
      for (let i = 0; i < 20; i++) {
        const px = W * 0.2 + (i / 20) * W * 0.6 + Math.sin(t * 2 + i) * 12;
        const py = H - ((t * 40 + i * 40) % (H * 0.7));
        cx.globalAlpha = 0.25;
        cx.strokeStyle = '#7ab955';
        cx.lineWidth = 2;
        cx.beginPath(); cx.arc(px, py, 6 + (i % 4), 0, TAU); cx.stroke();
      }
      cx.globalAlpha = 1;
    },
    clouds(cx, t, W, H) {
      for (let i = 0; i < 6; i++) {
        const px = ((i * 0.18 + t * 0.04) % 1.2) * W - W * 0.1;
        const py = H * (0.12 + i * 0.08);
        cx.globalAlpha = 0.18;
        cx.fillStyle = '#fff';
        cx.beginPath(); cx.arc(px, py, 36, 0, TAU); cx.arc(px + 28, py + 8, 28, 0, TAU); cx.fill();
      }
      cx.globalAlpha = 1;
    },
    crystals(cx, t, W, H) {
      for (let i = 0; i < 30; i++) {
        const px = (i / 30) * W + Math.sin(t * 3 + i) * 18;
        const py = (i * 37 + t * 25) % H;
        cx.globalAlpha = 0.2 + 0.15 * Math.sin(t * 4 + i);
        cx.fillStyle = '#c898f0';
        cx.fillRect(px, py, 3, 8);
      }
      cx.globalAlpha = 1;
    },
    ash(cx, t, W, H) { drawDots(cx, t, W, H, 55, '#aaa', 0.5, 2); },
    dust(cx, t, W, H) { drawDots(cx, t, W, H, 35, '#8a6840', 0.9, 2); },
    neon(cx, t, W, H) {
      for (let i = 0; i < 8; i++) {
        const y = H * (0.2 + i * 0.08) + Math.sin(t * 2 + i) * 6;
        cx.globalAlpha = 0.15 + 0.1 * Math.sin(t * 3 + i);
        cx.strokeStyle = i % 2 ? '#ff6ad5' : '#6af0ff';
        cx.lineWidth = 3;
        cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y + Math.sin(t + i) * 12); cx.stroke();
      }
      cx.globalAlpha = 1;
    },
    oil(cx, t, W, H) { drawRain(cx, t, W, H, '#3a3020', 2); },
    toxic(cx, t, W, H) {
      cx.globalAlpha = 0.08 + 0.04 * Math.sin(t * 2);
      cx.fillStyle = '#7ab955';
      cx.fillRect(0, 0, W, H);
      drawDots(cx, t, W, H, 24, '#a0ff60', 1.5, 3);
      cx.globalAlpha = 1;
    },
    stars(cx, t, W, H) {
      for (let i = 0; i < 40; i++) {
        const px = (i * 97) % W;
        const py = (i * 53) % (H * 0.6);
        cx.globalAlpha = 0.3 + 0.4 * Math.sin(t * 3 + i);
        cx.fillStyle = '#fff';
        cx.fillRect(px, py, 2, 2);
      }
      cx.globalAlpha = 1;
    },
    biolum(cx, t, W, H) { drawDots(cx, t, W, H, 32, '#4af0ff', 1.1, 3); },
    sand(cx, t, W, H) {
      for (let i = 0; i < 60; i++) {
        const px = (i * 23 + t * 200) % (W + 40) - 20;
        const py = H * 0.3 + (i % 7) * 12;
        cx.globalAlpha = 0.25;
        cx.fillStyle = '#d4a860';
        cx.fillRect(px, py, 10, 2);
      }
      cx.globalAlpha = 1;
    },
    mist(cx, t, W, H) {
      cx.globalAlpha = 0.12 + 0.06 * Math.sin(t);
      cx.fillStyle = '#8090a0';
      cx.fillRect(0, H * 0.4, W, H * 0.6);
      cx.globalAlpha = 1;
    },
    sparks(cx, t, W, H) { drawDots(cx, t, W, H, 36, '#ffe08a', 2.2, 2); },
    lab(cx, t, W, H) {
      for (let i = 0; i < 14; i++) {
        const px = W * 0.15 + i * (W * 0.05);
        const py = H * 0.55 + Math.sin(t * 2 + i) * 8;
        cx.globalAlpha = 0.3;
        cx.fillStyle = '#7ab955';
        cx.beginPath(); cx.arc(px, py - ((t * 30 + i * 20) % 60), 5, 0, TAU); cx.fill();
      }
      cx.globalAlpha = 1;
    },
    glitch(cx, t, W, H) {
      if (Math.sin(t * 12) > 0.7) {
        cx.globalAlpha = 0.15;
        cx.fillStyle = '#f0f';
        cx.fillRect(rand(0, W * 0.5), rand(0, H * 0.5), W * 0.5, 4);
        cx.fillStyle = '#0ff';
        cx.fillRect(rand(0, W * 0.5), rand(H * 0.5, H), W * 0.5, 4);
      }
      cx.globalAlpha = 1;
    },
    heat(cx, t, W, H) {
      cx.globalAlpha = 0.06 + 0.04 * Math.sin(t * 4);
      cx.fillStyle = '#ff6020';
      cx.fillRect(0, H * 0.5, W, H * 0.5);
      cx.globalAlpha = 1;
    },
    frost(cx, t, W, H) { drawDots(cx, t, W, H, 44, '#cfeaff', 0.6, 2.5); },
    candy(cx, t, W, H) {
      const cols = ['#ff6ad5', '#ffe08a', '#6af0ff', '#7ab955'];
      for (let i = 0; i < 35; i++) {
        const px = (i * 41 + t * 30) % W;
        const py = (i * 29 + t * 45) % H;
        cx.globalAlpha = 0.35;
        cx.fillStyle = cols[i % 4];
        cx.fillRect(px, py, 5, 5);
      }
      cx.globalAlpha = 1;
    },
    lightning(cx, t, W, H) {
      if (Math.sin(t * 8) > 0.92) {
        cx.globalAlpha = 0.35;
        cx.fillStyle = '#fff';
        cx.fillRect(0, 0, W, H);
      }
      cx.globalAlpha = 1;
    },
    voidpetals(cx, t, W, H) { drawDots(cx, t, W, H, 30, '#b06ff0', 0.8, 3); },
    steam(cx, t, W, H) {
      for (let i = 0; i < 10; i++) {
        const px = W * 0.2 + i * W * 0.06;
        const py = H * 0.65 - ((t * 25 + i * 30) % 80);
        cx.globalAlpha = 0.15;
        cx.fillStyle = '#ddd';
        cx.beginPath(); cx.arc(px, py, 14 + i, 0, TAU); cx.fill();
      }
      cx.globalAlpha = 1;
    },
    plasma(cx, t, W, H) {
      for (let i = 0; i < 5; i++) {
        const x1 = W * (0.2 + i * 0.15);
        const y1 = H * 0.3 + Math.sin(t * 3 + i) * 20;
        const x2 = x1 + 60;
        const y2 = H * 0.7;
        cx.globalAlpha = 0.25;
        cx.strokeStyle = '#c060ff';
        cx.lineWidth = 2;
        cx.beginPath(); cx.moveTo(x1, y1); cx.lineTo(x2, y2); cx.stroke();
      }
      cx.globalAlpha = 1;
    },
    echo(cx, t, W, H) {
      for (let i = 0; i < 4; i++) {
        const r = 40 + i * 50 + (t * 30) % 60;
        cx.globalAlpha = 0.12 - i * 0.02;
        cx.strokeStyle = '#fff';
        cx.lineWidth = 2;
        cx.beginPath(); cx.arc(W / 2, H * 0.55, r, 0, TAU); cx.stroke();
      }
      cx.globalAlpha = 1;
    },
    static(cx, t, W, H) {
      for (let i = 0; i < 120; i++) {
        cx.globalAlpha = 0.15;
        cx.fillStyle = Math.random() > 0.5 ? '#fff' : '#888';
        cx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
      }
      cx.globalAlpha = 1;
    },
    bones(cx, t, W, H) { drawDots(cx, t, W, H, 28, '#ccc', 0.4, 2); },
    pixels(cx, t, W, H) {
      for (let i = 0; i < 20; i++) {
        cx.globalAlpha = 0.3;
        cx.fillStyle = ['#f00', '#0f0', '#00f', '#ff0'][i % 4];
        cx.fillRect((i * 73 + t * 10) % W, (i * 47) % H, 8, 8);
      }
      cx.globalAlpha = 1;
    },
    hivepulse(cx, t, W, H) {
      const p = 0.5 + 0.5 * Math.sin(t * 3);
      const g = cx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W * 0.6);
      g.addColorStop(0, 'rgba(255,80,80,' + (0.15 * p) + ')');
      g.addColorStop(1, 'rgba(255,0,0,0)');
      cx.fillStyle = g;
      cx.fillRect(0, 0, W, H);
    },
    prism(cx, t, W, H) {
      for (let i = 0; i < 6; i++) {
        cx.globalAlpha = 0.12;
        cx.strokeStyle = ['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f'][i];
        cx.lineWidth = 4;
        cx.beginPath(); cx.moveTo(W / 2, H * 0.2); cx.lineTo(W * (0.1 + i * 0.15), H * 0.85); cx.stroke();
      }
      cx.globalAlpha = 1;
    },
    glass(cx, t, W, H) {
      cx.globalAlpha = 0.08;
      cx.fillStyle = '#111';
      cx.fillRect(0, 0, W, H);
      for (let i = 0; i < 8; i++) {
        cx.globalAlpha = 0.15;
        cx.strokeStyle = '#888';
        cx.strokeRect(W * 0.1 + i * 12, H * 0.2, W * 0.08, H * 0.6);
      }
      cx.globalAlpha = 1;
    },
    warp(cx, t, W, H) {
      for (let i = 0; i < 20; i++) {
        const px = W / 2 + Math.sin(t * 4 + i) * W * 0.4;
        cx.globalAlpha = 0.2;
        cx.strokeStyle = '#9fe0ff';
        cx.lineWidth = 2;
        cx.beginPath(); cx.moveTo(px, 0); cx.lineTo(W / 2, H); cx.stroke();
      }
      cx.globalAlpha = 1;
    },
    coral(cx, t, W, H) { drawDots(cx, t, W, H, 24, '#6af0ff', 1.3, 3); },
    embers(cx, t, W, H) {
      for (let i = 0; i < 30; i++) {
        const px = (i * 53) % W;
        const py = H - ((t * 35 + i * 25) % H);
        cx.globalAlpha = 0.35;
        cx.fillStyle = '#ff7a3a';
        cx.beginPath(); cx.arc(px, py, 3, 0, TAU); cx.fill();
      }
      cx.globalAlpha = 1;
    },
    acid(cx, t, W, H) { drawRain(cx, t, W, H, '#7ab955', 4); },
    meteors(cx, t, W, H) {
      for (let i = 0; i < 6; i++) {
        const px = (i * 120 + t * 180) % (W + 80) - 40;
        const py = (i * 60 + t * 90) % (H * 0.5);
        cx.globalAlpha = 0.4;
        cx.strokeStyle = '#ffe878';
        cx.lineWidth = 3;
        cx.beginPath(); cx.moveTo(px, py); cx.lineTo(px - 30, py + 40); cx.stroke();
      }
      cx.globalAlpha = 1;
    },
    dream(cx, t, W, H) {
      cx.globalAlpha = 0.1 + 0.05 * Math.sin(t);
      cx.fillStyle = '#e8e0ff';
      cx.fillRect(0, 0, W, H);
      cx.globalAlpha = 1;
    },
    spiral(cx, t, W, H) {
      cx.save();
      cx.translate(W / 2, H / 2);
      cx.rotate(t * 0.5);
      cx.globalAlpha = 0.15;
      cx.strokeStyle = '#ff6ad5';
      cx.lineWidth = 3;
      cx.beginPath();
      for (let a = 0; a < TAU * 3; a += 0.2) {
        const r = 10 + a * 8;
        cx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      cx.stroke();
      cx.restore();
      cx.globalAlpha = 1;
    },
    stampede(cx, t, W, H) {
      for (let i = 0; i < 16; i++) {
        const px = W * 0.3 + ((t * 80 + i * 40) % (W * 0.7));
        const py = H * 0.7 + (i % 4) * 10;
        cx.globalAlpha = 0.35;
        cx.fillStyle = '#c8f0a0';
        cx.fillRect(px, py, 8, 6);
      }
      cx.globalAlpha = 1;
    },
    mirror(cx, t, W, H) {
      cx.globalAlpha = 0.2;
      cx.fillStyle = '#000';
      cx.fillRect(W / 2, 0, 2, H);
      if (Math.sin(t * 6) > 0) {
        cx.globalAlpha = 0.08;
        cx.fillStyle = '#fff';
        cx.fillRect(W / 2 + 4, 0, W / 2, H);
      }
      cx.globalAlpha = 1;
    },
    gravity(cx, t, W, H) {
      for (let i = 0; i < 24; i++) {
        const ang = (i / 24) * TAU + t * 0.3;
        const r = 80 + (t * 20 + i * 15) % (W * 0.35);
        const px = W / 2 + Math.cos(ang) * r;
        const py = H / 2 + Math.sin(ang) * r;
        cx.globalAlpha = 0.25;
        cx.strokeStyle = '#9fe0ff';
        cx.lineWidth = 2;
        cx.beginPath(); cx.moveTo(px, py); cx.lineTo(W / 2, H / 2); cx.stroke();
      }
      cx.globalAlpha = 1;
    },
    spores(cx, t, W, H) {
      cx.globalAlpha = 0.1;
      cx.fillStyle = '#7ab955';
      cx.fillRect(0, 0, W, H);
      drawDots(cx, t, W, H, 40, '#a0ff60', 0.7, 4);
      cx.globalAlpha = 1;
    },
    cryo(cx, t, W, H) {
      for (let i = 0; i < 10; i++) {
        cx.globalAlpha = 0.2;
        cx.strokeStyle = '#9fd0ff';
        cx.strokeRect(W * 0.1 + i * (W * 0.08), H * 0.25, W * 0.06, H * 0.5);
      }
      frost(cx, t, W, H);
      cx.globalAlpha = 1;
    },
    comet(cx, t, W, H) { meteors(cx, t, W, H); },
    stormring(cx, t, W, H) {
      cx.globalAlpha = 0.2;
      cx.strokeStyle = '#ffe878';
      cx.lineWidth = 4;
      cx.beginPath(); cx.arc(W / 2, H / 2, W * 0.32 + Math.sin(t * 4) * 8, 0, TAU); cx.stroke();
      if (Math.sin(t * 10) > 0.9) {
        cx.globalAlpha = 0.25;
        cx.fillStyle = '#fff';
        cx.fillRect(0, 0, W, H);
      }
      cx.globalAlpha = 1;
    },
    hivemind(cx, t, W, H) {
      static(cx, t, W, H);
      hivepulse(cx, t, W, H);
    },
  };

  const LAYOUT_OVERLAY = {
    establishing(t, localT, cx, W, H) {
      const v = Math.min(1, localT / 0.8) * 0.35;
      cx.fillStyle = 'rgba(0,0,0,' + v + ')';
      cx.fillRect(0, 0, W, H);
    },
    boss_reveal(t, localT, cx, W, H) {
      if (localT < 0.35) {
        cx.globalAlpha = 0.45 * (1 - localT / 0.35);
        cx.fillStyle = '#ff3040';
        cx.fillRect(0, 0, W, H);
        cx.globalAlpha = 1;
      }
      const g = cx.createRadialGradient(W / 2, H * 0.48, 20, W / 2, H * 0.48, W * 0.55);
      g.addColorStop(0, 'rgba(255,80,80,0.25)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = g;
      cx.fillRect(0, 0, W, H);
    },
    ally_join(t, localT, cx, W, H) {
      const g = cx.createRadialGradient(W * 0.62, H * 0.6, 10, W * 0.62, H * 0.6, 120);
      g.addColorStop(0, 'rgba(255,220,80,0.35)');
      g.addColorStop(1, 'rgba(255,220,80,0)');
      cx.fillStyle = g;
      cx.fillRect(0, 0, W, H);
    },
    victory(t, localT, cx, W, H) {
      for (let i = 0; i < 12; i++) {
        const px = W * 0.5 + Math.sin(t * 3 + i) * W * 0.35;
        const py = H * 0.35 + Math.cos(t * 2.5 + i * 0.8) * H * 0.2;
        cx.globalAlpha = 0.35;
        cx.fillStyle = ['#ffe878', '#fff', '#9fe0ff'][i % 3];
        cx.fillRect(px, py, 4, 4);
      }
      cx.globalAlpha = 1;
    },
    relief(t, localT, cx, W, H) {
      cx.globalAlpha = 0.12;
      cx.fillStyle = '#ffe878';
      cx.fillRect(0, 0, W, H);
      cx.globalAlpha = 1;
    },
    tease(t, localT, cx, W, H) {
      cx.globalAlpha = 0.2;
      cx.fillStyle = '#000';
      cx.fillRect(0, 0, W, W * 0.06);
      cx.fillRect(0, H - H * 0.1, W, H * 0.1);
      cx.globalAlpha = 1;
    },
  };

  window.drawCineFx = function (fxId, t, W, H, cx, layout, localT) {
    const fn = FX[fxId] || FX.pollen;
    fn(cx, t, W, H);
    if (layout && LAYOUT_OVERLAY[layout]) LAYOUT_OVERLAY[layout](t, localT, cx, W, H);
  };

  window.getCineFxList = function () {
    return Object.keys(FX);
  };
})();
