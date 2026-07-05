'use strict';
// Cutscenes before/after every world + special challenger intros/outros.

const WorldCine = (function(){
  const DUR = { intro:9, outro:10, chalIn:8, chalOut:9 };
  let t=0, done=null, kind=null, wi=0, isChal=false;

  function seenKey(k){ return 'br_cine_'+k; }
  function markSeen(k){ try{ localStorage.setItem(seenKey(k),'1'); }catch(e){} }
  function wasSeen(k){ try{ return !!localStorage.getItem(seenKey(k)); }catch(e){ return false; } }

  function caption(str,t0,t1,y){
    if(typeof introCaption==='function'){ introCaption(str,t,t0,t1,y); return; }
    const a = t<t0||t>t1 ? 0 : Math.min(1,(t-t0)/0.4,(t1-t)/0.4);
    if(a<=0) return;
    cx.textAlign='center'; cx.font='900 '+Math.round(Math.min(W,H)*0.042)+'px sans-serif';
    cx.globalAlpha=a; cx.lineWidth=5; cx.strokeStyle='#000'; cx.strokeText(str,W/2,y);
    cx.fillStyle='#fff'; cx.fillText(str,W/2,y); cx.globalAlpha=1;
  }

  function worldData(i){ return (typeof WORLDS!=='undefined' && WORLDS[i]) ? WORLDS[i] : null; }

  function backdrop(w){
    const th = w && w.theme ? w.theme : { bg:'#3a5a22', tile1:'#6aae3a', tile2:'#5a9e32' };
    cx.fillStyle=th.bg; cx.fillRect(0,0,W,H);
    cx.fillStyle=th.tile1;
    for(let gy=0; gy<H; gy+=56) for(let gx=0; gx<W; gx+=56) if(((gx/56+gy/56)&1)) cx.fillRect(gx,gy,56,56);
    if(w && w.enemyTint){
      cx.globalAlpha=0.18; cx.fillStyle=w.enemyTint; cx.fillRect(0,0,W,H); cx.globalAlpha=1;
    }
  }

  function drawBossSilhouette(w, bob){
    if(!w || !w.bosses || !w.bosses.length || typeof SP==='undefined') return;
    const b = w.bosses[w.bosses.length-1];
    if(b && SP[b.spr]) drawSprite(b.spr, W*0.5, H*0.55+Math.sin(t*3)*bob, 110, 0, 0, 0, false, null);
  }

  function drawSwarmArmy(w){
    if(typeof SP==='undefined') return;
    const sprs = ['swarmmite','swarmwasp','swarmbeetle','swarmmoth','pigeon','chimp'];
    for(let i=0;i<6;i++){
      const s = sprs[i%sprs.length];
      if(!SP[s]) continue;
      const ex = W*0.2 + (i/5)*W*0.6 + Math.sin(t*2+i)*20;
      const ey = H*0.72 + (i%2)*18;
      drawSprite(s, ex, ey, 42, Math.sin(t*3+i)*0.1, 0, 0, false, null);
    }
  }

  function start(kindIn, worldIndex, onDone, challenger){
    kind=kindIn; wi=worldIndex; done=onDone; t=0; isChal=!!challenger;
    state= kindIn==='outro'||kindIn==='chal_out' ? ST.OUTRO : ST.INTRO;
    $('menu') && $('menu').classList.add('hidden');
    $('introskip') && $('introskip').classList.remove('hidden');
    if(typeof playMusic==='function'){
      const w=worldData(wi);
      playMusic(w && w.theme ? w.theme.music : 'boss0');
    }
    shake=0;
  }

  function finish(){
    $('introskip') && $('introskip').classList.add('hidden');
    const k=kind, w=wi, ch=isChal;
    if(k==='intro') markSeen('in_'+w);
    else if(k==='outro') markSeen('out_'+w);
    else if(k==='chal_in') markSeen('chal_in_'+w);
    else if(k==='chal_out') markSeen('chal_out_'+w);
    kind=null;
    const cb=done; done=null;
    if(cb) cb();
  }

  function update(dt){
    t+=dt;
    const max = kind==='intro' ? DUR.intro : kind==='outro' ? DUR.outro : kind==='chal_in' ? DUR.chalIn : DUR.chalOut;
    if(t>=max) finish();
  }

  function render(){
    const w = worldData(wi);
    cx.save();
    backdrop(w);

    if(kind==='intro' || kind==='chal_in'){
      drawSwarmArmy(w);
      drawBossSilhouette(w, 8);
      const line = isChal
        ? (w && w.chalIntroLine) || ('CHALLENGER: '+(w?w.name:'WORLD')+' — 15 MINUTES.')
        : (w && w.introLine) || ('ENTERING '+(w?w.name:'WORLD')+'.');
      caption(line, 0.4, 4.5, H*0.2);
      caption(isChal ? 'NO MERCY. NO WAVES. ONLY THE SWARM.' : 'CLEAR ALL WAVES. SURVIVE THE SWARM.', 4.8, 8.2, H*0.82);
    } else {
      drawBossSilhouette(w, 14);
      const line = isChal
        ? (w && w.chalOutroLine) || ('CHALLENGER '+(w?w.name:'WORLD')+' COMPLETE!')
        : (w && w.outroLine) || ((w?w.name:'WORLD')+' CLEARED!');
      caption(line, 0.3, 4.0, H*0.22);
      caption('THE SWARM FALLS BACK... FOR NOW.', 4.2, 8.0, H*0.78);
      if(wi < 49) caption('WORLD '+(wi+2)+' AWAITS.', 7.5, 9.5, H*0.5);
    }

    if(t>maxFadeStart()){ cx.globalAlpha=Math.min(1,(t-maxFadeStart())/0.8); cx.fillStyle='#000'; cx.fillRect(0,0,W,H); }
    cx.restore();
  }

  function maxFadeStart(){
    if(kind==='intro') return 8.0;
    if(kind==='outro') return 9.0;
    if(kind==='chal_in') return 7.0;
    return 8.0;
  }

  function beforeStart(worldIndex, mode, onReady){
    if(mode==='practice'){ onReady(); return; }
    if(mode==='challenger'){
      if(wasSeen('chal_in_'+worldIndex)){ onReady(); return; }
      start('chal_in', worldIndex, onReady, true);
      return;
    }
    if(mode!=='story'){ onReady(); return; }
    if(worldIndex===0 && !localStorage.getItem('br_seen_intro')){
      if(typeof startIntro==='function') startIntro(onReady);
      else onReady();
      return;
    }
    if(wasSeen('in_'+worldIndex)){ onReady(); return; }
    start('intro', worldIndex, onReady, false);
  }

  function afterClear(clearData, onDone){
    if(!clearData || clearData.isPractice){ onDone(); return; }
    const w = clearData.worldNum - 1;
    if(clearData.isChallenger){
      if(wasSeen('chal_out_'+w)){ onDone(); return; }
      start('chal_out', w, onDone, true);
      return;
    }
    if(clearData.isW1 && !localStorage.getItem('br_seen_w1outro')){
      localStorage.setItem('br_seen_w1outro','1');
      if(typeof startW1Outro==='function'){ startW1Outro(onDone); return; }
    }
    if(wasSeen('out_'+w)){ onDone(); return; }
    start('outro', w, onDone, false);
  }

  function skip(){ finish(); }

  function isActive(){ return kind!=null; }

  return {
    beforeStart, afterClear, update, render, skip, isActive,
  };
})();

window.WorldCine = WorldCine;
