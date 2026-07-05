'use strict';
// ============ CANVAS SETUP & SHARED HELPERS ============
const cv = document.getElementById('game');
// alpha:false -- the canvas is always fully repainted (void fill covers the whole viewport every
// frame), so the browser can skip alpha-compositing this layer entirely. Costs nothing visually,
// helps most on software-rendered canvases (common on Linux when GPU accel isn't available).
const cx = cv.getContext('2d', { alpha:false, desynchronized:true });
cx.imageSmoothingEnabled = true;
if(cx.imageSmoothingQuality) cx.imageSmoothingQuality = 'high';
let W=0, H=0, DPR=1;

// ============ GRAPHICS / PERFORMANCE SETTINGS ============
//   dpr      = backing-resolution cap (min of device DPR and this value). Higher = sharper on
//              retina phones; cost scales ~DPR^2.
//   frameMin = min ms between rendered frames (fps cap). 0 = uncapped.
//   particles= multiplier on the particle hard-cap (0 = off, 0.5 = low, 1 = full).
//   shake    = master toggle for camera shake (separate from death-shake).
const GFX = { dpr:2.0, frameMin:0, particles:1, shake:true };
const GFX_MIGRATE_VER = 2;
function deviceDpr(){ return window.devicePixelRatio || 1; }
function isTouchDevice(){
  return !!(window.matchMedia && window.matchMedia('(pointer:coarse)').matches);
}
function recommendGfxDpr(){
  const dd = deviceDpr();
  // Mobile screens are often 2.5–3x; old 0.85 cap rendered blurry upscaled buffers.
  if(isTouchDevice()) return Math.min(Math.max(dd, 2), 2.5);
  return Math.min(Math.max(dd, 1.5), 2);
}
function saveGfx(){
  try{ localStorage.setItem('br_gfx', JSON.stringify(GFX)); localStorage.setItem('br_gfx_ver', String(GFX_MIGRATE_VER)); }catch(e){}
}
(function loadGfx(){
  const raw = (()=>{ try{ return localStorage.getItem('br_gfx'); }catch(e){ return null; } })();
  const ver = +((()=>{ try{ return localStorage.getItem('br_gfx_ver'); }catch(e){ return 0; } })()) || 0;
  if(raw===null){
    GFX.dpr = recommendGfxDpr();
    if(isTouchDevice()) GFX.particles = 0.75;
    saveGfx();
    return;
  }
  try{
    const s = JSON.parse(raw) || {};
    if(typeof s.dpr==='number')       GFX.dpr = s.dpr;
    if(typeof s.frameMin==='number')  GFX.frameMin = s.frameMin;
    if(typeof s.particles==='number') GFX.particles = s.particles;
    if(typeof s.shake==='boolean')    GFX.shake = s.shake;
    if(s.frameMin===14.5){ GFX.frameMin = 0; saveGfx(); }
    // One-time upgrade: old mobile perf defaults (0.85 dpr) looked soft/blurry on retina screens.
    if(ver < GFX_MIGRATE_VER || GFX.dpr < 1.5){
      GFX.dpr = recommendGfxDpr();
      saveGfx();
    }
  }catch(e){}
})();

function viewportSize(){
  const vv = window.visualViewport;
  if(vv) return { w: Math.round(vv.width), h: Math.round(vv.height) };
  return { w: window.innerWidth, h: window.innerHeight };
}
function resize(){
  DPR = Math.min(deviceDpr(), GFX.dpr);
  const vp = viewportSize();
  W = vp.w; H = vp.h;
  cv.width = Math.max(1, Math.round(W * DPR));
  cv.height = Math.max(1, Math.round(H * DPR));
  cv.style.width = W+'px'; cv.style.height = H+'px';
  cx.setTransform(DPR,0,0,DPR,0,0);
}
window.addEventListener('resize', resize);
if(window.visualViewport){
  window.visualViewport.addEventListener('resize', resize);
  window.visualViewport.addEventListener('scroll', resize);
}
resize();

const $ = id => document.getElementById(id);
const rand = (a,b) => a + Math.random()*(b-a);
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const dist2 = (ax,ay,bx,by) => { const dx=ax-bx, dy=ay-by; return dx*dx+dy*dy; };
const clamp = (v,a,b) => v<a?a:(v>b?b:v);
const TAU = Math.PI*2;

// ============ WORLD & CAMERA ============
const WORLD = { w:2600, h:2600 };
const WALL = 46;                 // fence thickness
const camera = { x:0, y:0 };
// camera zoom: <1 = zoomed out (see more), >1 = zoomed in
let zoom = 1;
const ZMIN = 0.85, ZMAX = 2.2;   // max zoom-out (0.85 = a small step out) / max zoom-in
function setZoom(z){ zoom = clamp(z, ZMIN, ZMAX); }
function zoomBy(d){ setZoom(+(zoom + d).toFixed(3)); }
function computeCamera(){
  // always keep the player dead-centre — follow them at every zoom level, never lock to world edges/centre
  const vw = W/zoom, vh = H/zoom;
  camera.x = P.x - vw/2;
  camera.y = P.y - vh/2;
}

// ============ GLOBAL GAME-STATE FLAG ============
const ST = { MENU:0, PLAY:1, LEVELUP:2, OVER:3, PAUSE:4, CUTSCENE:5, INTRO:6, OUTRO:7 };
let state = ST.MENU;
