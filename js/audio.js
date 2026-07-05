'use strict';
// ============ AUDIO (tiny synth, no assets) ============
let AC = null;
let muted = localStorage.getItem('br_muted')==='1';        // music mute
let sfxMuted = localStorage.getItem('br_sfxmuted')==='1';  // sound-effects mute (independent of music)
function initAudio(){ if(!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(AC && AC.state==='suspended') AC.resume(); }
function beep(freq, dur, type='square', vol=0.05, slide=0){
  if(!AC || sfxMuted) return;
  try{
    const o=AC.createOscillator(), g=AC.createGain();
    o.type=type; o.frequency.value=freq;
    if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(40,freq+slide), AC.currentTime+dur);
    g.gain.value=vol; g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime+dur);
    o.connect(g); g.connect(AC.destination);
    o.start(); o.stop(AC.currentTime+dur);
  }catch(e){}
}
function noiseBurst(dur, vol, hp){
  if(!AC || sfxMuted) return;
  try{
    const n=Math.max(1,Math.floor(AC.sampleRate*dur)), b=AC.createBuffer(1,n,AC.sampleRate), d=b.getChannelData(0);
    for(let i=0;i<n;i++) d[i]=Math.random()*2-1;
    const s=AC.createBufferSource(); s.buffer=b;
    const f=AC.createBiquadFilter(); f.type=hp?'highpass':'bandpass'; f.frequency.value=hp?6000:1900;
    const g=AC.createGain(), t=AC.currentTime;
    g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    s.connect(f); f.connect(g); g.connect(AC.destination);
    s.start(t); s.stop(t+dur+0.02);
  }catch(e){}
}
const sfx = {
  shoot: ()=>beep(700,0.05,'square',0.018,-260),
  hit:   ()=>beep(200,0.06,'square',0.04,-80),
  gem:   (n=0)=>beep(880+n*60,0.07,'sine',0.05,260),
  coin:  ()=>{ beep(1046,0.06,'square',0.05); setTimeout(()=>beep(1568,0.08,'square',0.05),60); },
  hurt:  ()=>beep(120,0.18,'sawtooth',0.09,-50),
  dash:  ()=>beep(420,0.12,'sine',0.05,260),
  level: ()=>{ beep(523,0.1,'triangle',0.06); setTimeout(()=>beep(659,0.1,'triangle',0.06),90); setTimeout(()=>beep(784,0.16,'triangle',0.06),180); },
  boss:  ()=>{ beep(90,0.4,'sawtooth',0.1,-30); setTimeout(()=>beep(70,0.45,'sawtooth',0.1,-25),250); },
  die:   ()=>beep(330,0.5,'sawtooth',0.09,-260),
  wave:  ()=>{ beep(523,0.08,'square',0.045); setTimeout(()=>beep(784,0.12,'square',0.045),80); },
  pick:  ()=>{ beep(660,0.05,'square',0.045); setTimeout(()=>beep(988,0.08,'square',0.045),55); },
  evolve:()=>{ [523,659,880,1175].forEach((f,i)=>setTimeout(()=>beep(f,0.13,'square',0.05),i*85)); },
  warn:  ()=>{ beep(150,0.3,'sawtooth',0.08,-18); setTimeout(()=>beep(150,0.3,'sawtooth',0.08,-18),320); },
  win:   ()=>{ [392,523,659,784].forEach((f,i)=>setTimeout(()=>beep(f,0.14,'triangle',0.06),i*70)); },
  cheer: ()=>{ [523,659,784,988,1175].forEach((f,i)=>setTimeout(()=>beep(f,0.11,'triangle',0.05),i*48)); },
  drumroll: ()=>{   // gacha suspense build-up: steady taps speeding up, ending in a cymbal crash
    const n=16;
    for(let i=0;i<n;i++){
      const t = i<8 ? i*70 : 560+(i-8)*45;
      const vol = 0.03+i*0.0022;
      setTimeout(()=>noiseBurst(0.045,vol,false), t);
    }
    setTimeout(()=>{ noiseBurst(0.35,0.1,true); beep(1568,0.3,'triangle',0.05,500); }, 560+8*45+60);
  },
  reveal: ()=>{ [880,1318].forEach((f,i)=>setTimeout(()=>beep(f,0.16,'sine',0.06,i?0:160),i*90)); }
};

// ============ MUSIC (procedural: drums + bass over a long chord bed, melody generated live) ============
function mtof(m){ return 440*Math.pow(2,(m-69)/12); }
function mNote(m, dur, type, vol, opts){
  if(!AC || muted || m==null) return;
  opts = opts || {};
  try{
    const o=AC.createOscillator(), g=AC.createGain(), t=AC.currentTime;
    const f=AC.createBiquadFilter();
    f.type='lowpass';
    f.frequency.value = opts.bright ? 5200 : (type==='sawtooth' ? 2800 : 3800);
    f.Q.value = 0.7;
    o.type=type; o.frequency.value=mtof(m);
    const peak = vol * (opts.pad ? 0.55 : 1);
    g.gain.setValueAtTime(0.0001,t);
    g.gain.linearRampToValueAtTime(peak, t + 0.018);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f); f.connect(g); g.connect(AC.destination);
    o.start(t); o.stop(t + dur + 0.04);
  }catch(e){}
}
function mChord(root, dur, type, vol){
  mNote(root, dur, type, vol * 0.34, { pad:true });
  const third = root + 4, fifth = root + 7;
  mNote(third, dur, type, vol * 0.28, { pad:true });
  mNote(fifth, dur, type, vol * 0.26, { pad:true });
}
function pickMelodyDeg(scale, step){
  const chord = [0, 2, 4];
  if(step % 8 === 0) return chord[(step / 8 | 0) % chord.length];
  if(Math.random() < 0.72) return chord[Math.floor(Math.random() * chord.length)];
  return scale[Math.floor(Math.random() * scale.length)];
}
function mKick(){ if(!AC||muted) return; try{ const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;
  o.type='sine'; o.frequency.setValueAtTime(120,t); o.frequency.exponentialRampToValueAtTime(48,t+0.1);
  g.gain.setValueAtTime(0.11,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.14); o.connect(g);g.connect(AC.destination); o.start(t);o.stop(t+0.16);}catch(e){} }
function mNoise(dur,vol,hp){ if(!AC||muted) return; try{ const n=Math.max(1,Math.floor(AC.sampleRate*dur)), b=AC.createBuffer(1,n,AC.sampleRate), d=b.getChannelData(0);
  for(let i=0;i<n;i++) d[i]=Math.random()*2-1; const s=AC.createBufferSource(); s.buffer=b;
  const f=AC.createBiquadFilter(); f.type=hp?'highpass':'bandpass'; f.frequency.value=hp?6500:1600;
  const g=AC.createGain(),t=AC.currentTime; g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  s.connect(f);f.connect(g);g.connect(AC.destination); s.start(t);s.stop(t+dur+0.02);}catch(e){} }

// prog = chord roots in MIDI, one per bar; scale = melody note offsets from the root
const TRACKS = {
  menu:  { bpm:96,  density:0.22, drums:false, lt:'triangle', bt:'sine',     lv:0.048, bv:0.050, scale:[0,2,4,7,9],
           prog:[57,57,62,62, 60,60,55,55, 53,53,57,57, 55,55,52,52] },
  game:  { bpm:128, density:0.30, drums:true,  lt:'triangle', bt:'triangle', lv:0.040, bv:0.046, scale:[0,3,5,7,10],
           prog:[57,57,53,53, 55,55,52,52, 57,57,60,60, 55,55,52,52,   50,50,53,53, 55,55,57,57, 53,53,52,52, 55,55,55,55] },
  // DIRT DEPTHS: slow + heavy underground march, dark minor scale, gritty bass-forward low end
  dirt:  { bpm:112, density:0.26, drums:true,  lt:'triangle', bt:'triangle', lv:0.042, bv:0.056, scale:[0,3,5,7,8,10],
           prog:[45,45,45,45, 43,43,41,41, 40,40,40,40, 41,41,43,43,   45,45,48,48, 41,41,43,43, 45,45,43,43, 41,40,40,40] },
  boss0: { bpm:144, density:0.38, drums:true,  lt:'square',   bt:'triangle', lv:0.038, bv:0.046, scale:[0,1,3,5,7,8,10],
           prog:[45,45,41,41, 43,43,40,40, 45,45,48,48, 43,41,40,40] },
  boss1: { bpm:152, density:0.42, drums:true,  lt:'triangle', bt:'square',   lv:0.036, bv:0.044, scale:[0,2,3,5,7,8,10],
           prog:[50,50,48,48, 46,46,45,45, 50,53,48,46, 45,43,45,45] },
  boss2: { bpm:120, density:0.34, drums:true,  lt:'triangle', bt:'triangle', lv:0.040, bv:0.050, scale:[0,3,5,6,7,10],
           prog:[45,45,45,45, 41,41,43,43, 44,44,40,40, 45,43,41,40] },
  // ---- World ambience themes (one per world) ----
  world_grass:   { bpm:124, density:0.28, drums:true,  lt:'triangle', bt:'triangle', lv:0.038, bv:0.044, scale:[0,2,4,7,9],
                    prog:[57,57,55,55, 57,57,60,60, 55,55,53,53, 55,55,57,57,  60,60,57,57, 55,55,53,53, 55,55,52,52, 53,53,55,55] },
  world_citrus:  { bpm:132, density:0.30, drums:true,  lt:'triangle', bt:'triangle', lv:0.038, bv:0.044, scale:[0,2,4,7,9],
                    prog:[60,60,57,57, 55,55,57,57, 60,60,62,62, 57,57,55,55,  60,60,62,62, 60,60,57,57, 55,55,57,57, 60,60,55,55] },
  world_forest:  { bpm:114, density:0.26, drums:true,  lt:'triangle', bt:'triangle', lv:0.040, bv:0.048, scale:[0,2,3,5,7,10],
                    prog:[53,53,55,55, 57,57,53,53, 52,52,53,53, 55,55,52,52,  55,55,53,53, 52,52,50,50, 52,52,53,53, 55,55,53,53] },
  world_glacier: { bpm:108, density:0.22, drums:false, lt:'triangle', bt:'sine',     lv:0.044, bv:0.044, scale:[0,2,3,7,9],
                    prog:[48,48,50,50, 48,48,45,45, 43,43,45,45, 48,48,48,48,  50,50,48,48, 45,45,43,43, 45,45,48,48, 43,43,45,45] },
  world_circo:   { bpm:144, density:0.36, drums:true,  lt:'triangle', bt:'square',   lv:0.036, bv:0.044, scale:[0,2,4,5,7,9,11],
                    prog:[52,52,55,55, 57,57,52,52, 55,55,57,57, 60,60,55,55,  57,57,55,55, 52,52,55,55, 57,60,55,57, 52,52,55,55] },
  world_autumn:  { bpm:104, density:0.24, drums:false, lt:'triangle', bt:'triangle', lv:0.042, bv:0.048, scale:[0,2,3,5,7,8,10],
                    prog:[53,53,52,52, 50,50,48,48, 50,50,52,52, 53,53,50,50,  52,52,50,50, 48,48,50,50, 52,52,53,53, 50,50,52,52] },
  world_swamp:   { bpm:96,  density:0.24, drums:true,  lt:'triangle', bt:'triangle', lv:0.038, bv:0.052, scale:[0,1,3,5,6,8,10],
                    prog:[45,45,45,45, 43,43,41,41, 43,43,45,45, 41,41,40,40,  43,43,45,45, 41,41,40,40, 41,41,43,43, 45,45,43,43] },
  world_sky:     { bpm:136, density:0.32, drums:true,  lt:'triangle', bt:'sine',     lv:0.040, bv:0.044, scale:[0,2,4,7,9],
                    prog:[60,60,57,57, 60,60,62,62, 57,57,55,55, 57,57,60,60,  62,62,60,60, 57,57,55,55, 57,57,60,60, 55,55,57,57] },
  world_crystal: { bpm:106, density:0.28, drums:true,  lt:'triangle', bt:'triangle', lv:0.038, bv:0.050, scale:[0,3,5,6,7,10],
                    prog:[45,45,45,45, 43,43,43,43, 41,41,40,40, 43,43,41,40,  45,45,43,43, 41,41,40,40, 43,43,45,45, 40,40,41,41] },
  world_volcano: { bpm:122, density:0.34, drums:true,  lt:'triangle', bt:'triangle', lv:0.038, bv:0.052, scale:[0,1,3,5,7,8,10],
                    prog:[45,45,41,41, 43,43,40,40, 45,45,43,43, 41,41,40,40,  43,43,45,45, 40,40,41,41, 43,43,40,40, 45,45,41,41] },
  world_dirt:    { bpm:108, density:0.26, drums:true,  lt:'triangle', bt:'triangle', lv:0.040, bv:0.056, scale:[0,3,5,7,8,10],
                    prog:[40,40,40,40, 38,38,36,36, 33,33,33,33, 36,36,38,38,  40,40,38,38, 36,36,33,33, 36,36,38,38, 40,40,40,40] },
  // Extended worlds W12–W50 (procedural bands)
  world_ext_low:  { bpm:118, density:0.28, drums:true,  lt:'triangle', bt:'triangle', lv:0.038, bv:0.046, scale:[0,2,4,7,9],
                    prog:[52,52,55,55, 57,57,52,52, 50,50,52,52, 55,55,57,57,  55,55,52,52, 50,50,48,48, 52,52,55,55, 57,57,55,55] },
  world_ext_mid:  { bpm:126, density:0.32, drums:true,  lt:'triangle', bt:'square',   lv:0.036, bv:0.048, scale:[0,1,3,5,7,8,10],
                    prog:[45,45,43,43, 41,41,40,40, 43,43,45,45, 48,48,43,43,  45,45,41,41, 40,40,43,43, 45,45,48,48, 43,41,40,40] },
  world_ext_high: { bpm:134, density:0.36, drums:true,  lt:'triangle', bt:'triangle', lv:0.036, bv:0.050, scale:[0,1,4,5,7,8,11],
                    prog:[48,48,50,50, 52,52,48,48, 45,45,43,43, 48,48,50,50,  52,52,55,55, 50,50,48,48, 45,45,43,43, 48,48,45,45] },
  world_ext_final:{ bpm:148, density:0.40, drums:true,  lt:'triangle', bt:'triangle', lv:0.034, bv:0.052, scale:[0,1,3,5,6,8,10],
                    prog:[40,40,38,38, 36,36,33,33, 36,36,38,38, 40,40,43,43,  45,45,43,43, 40,40,38,38, 36,36,33,33, 40,40,40,40] },
  // ---- Final-boss themes (one per world) ----
  // W1: Ting Ting Ting Bahur — war-drum chaos, phrygian aggression
  final_sahur:          { bpm:164, density:0.44, drums:true, lt:'square',   bt:'triangle', lv:0.042, bv:0.050, scale:[0,1,3,5,7,8,10],
                           prog:[45,45,41,41, 43,43,48,48, 45,45,43,43, 41,41,40,40,  43,43,45,45, 48,48,43,43, 41,41,40,40, 41,40,40,40] },
  // W2: Tracotucotulu — tropical sprint, major pentatonic, bright madness
  final_tracotucotulu:  { bpm:168, density:0.42, drums:true, lt:'triangle', bt:'square',   lv:0.038, bv:0.046, scale:[0,2,4,7,9],
                           prog:[55,55,57,57, 60,60,55,55, 53,53,55,55, 57,57,52,52,  55,57,60,60, 57,55,53,53, 55,55,52,52, 53,53,55,55] },
  // W3: Cocofanto Mastodonte — slow forest stomp, dorian, bass-forward
  final_cocofantoboss:  { bpm:100, density:0.28, drums:true, lt:'triangle', bt:'triangle', lv:0.044, bv:0.058, scale:[0,3,5,7,8,10],
                           prog:[33,33,33,33, 31,31,29,29, 28,28,28,28, 29,29,31,31,  33,33,36,36, 31,31,29,29, 28,28,29,29, 28,28,28,28] },
  // W4: Ice Ice Bearlini — icy urgency, minor with 9th, ethereal triangle
  final_icebearlini:    { bpm:138, density:0.34, drums:true, lt:'triangle', bt:'sine',     lv:0.042, bv:0.046, scale:[0,2,3,7,9],
                           prog:[45,45,48,48, 43,43,41,41, 45,45,43,43, 40,40,41,41,  43,43,45,45, 48,48,43,43, 41,41,40,40, 41,41,43,43] },
  // W5: Il Gran Pagliaccio — deranged circus, harmonic minor, frantic sawtooth
  final_granpagliaccio: { bpm:156, density:0.46, drums:true, lt:'triangle', bt:'square',   lv:0.036, bv:0.044, scale:[0,1,4,5,7,8,11],
                           prog:[52,52,55,55, 57,57,48,48, 50,50,52,52, 55,55,52,48,  52,52,53,53, 55,55,50,50, 48,48,52,52, 53,52,50,48] },
  // W6: Bobritto Fogliame — autumn storm, locrian dark, brooding march
  final_bobritto:       { bpm:116, density:0.32, drums:true, lt:'triangle', bt:'triangle', lv:0.042, bv:0.054, scale:[0,3,5,6,7,10],
                           prog:[45,45,45,45, 43,43,43,43, 41,41,40,40, 41,41,43,43,  45,45,48,48, 43,43,41,41, 40,40,40,40, 41,40,40,40] },
  // W7-10: Madudungdung — ultimate swamp crusher, diminished sludge, lowest register
  final_madudung:       { bpm:88,  density:0.24, drums:true, lt:'triangle', bt:'triangle', lv:0.046, bv:0.060, scale:[0,1,3,5,6,8,10],
                           prog:[33,33,31,31, 29,29,28,28, 33,33,33,33, 28,28,29,31,  33,33,33,33, 31,31,29,29, 28,28,28,28, 29,28,28,28] },
};
let musicTimer=null, musicName=null, musicStep=0;
function playMusic(name){
  if(musicName===name) return;
  stopMusic();
  const t=TRACKS[name]; if(!AC||!t) return;
  musicName=name; musicStep=0;
  const stepMs=60000/t.bpm/4, sd=stepMs/1000;   // 16th-note steps, 16 per bar
  musicTimer=setInterval(()=>{
    const sib=musicStep%16, bar=Math.floor(musicStep/16), root=t.prog[bar%t.prog.length];
    if(t.drums){
      if(sib%8===0) mKick();
      if(sib===4||sib===12) mNoise(0.12,0.038,false);
      if(sib%2===0) mNoise(0.02,0.01,true);
    }
    if(sib===0) mChord(root, sd*3.6, 'sine', t.bv*0.55);
    if(sib%4===0) mNote(root-12, sd*3.2, t.bt, t.bv);
    else if(sib===10) mNote(root-5, sd*1.2, t.bt, t.bv*0.72);
    else if(sib===6 && bar%2===1) mNote(root-7, sd*1.1, t.bt, t.bv*0.65);
    const melodySlot = sib===2||sib===6||sib===10||sib===14;
    if(melodySlot && Math.random()<t.density){
      const deg = pickMelodyDeg(t.scale, sib);
      const oct = 12*(sib===10||sib===14 ? 2 : 1);
      mNote(root+deg+oct, sd*0.95, t.lt, t.lv*(0.85+Math.random()*0.2), { bright: t.lt==='square' });
    }
    musicStep++;
  }, stepMs);
}
function stopMusic(){ if(musicTimer){ clearInterval(musicTimer); musicTimer=null; } musicName=null; }
