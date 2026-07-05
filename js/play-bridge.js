'use strict';
// Thin wrapper around Google Play Games (Android Capacitor plugin).
// On web this is a no-op — saves stay local.

const PlayBridge = (function(){
  // Must match the plugin's default snapshot slot name (see capacitor-google-game-services).
  const SAVE_SNAPSHOT = 'snapshotTemp';

  function isAndroidApp(){
    try {
      return !!(window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() === 'android');
    } catch(e){ return false; }
  }

  function plugin(){
    return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.GoogleGameServices;
  }

  async function signIn(){
    const p = plugin();
    if(!p) return { isAuthenticated:false };
    try { return await p.signIn(); }
    catch(e){ console.warn('Play Games signIn failed', e); return { isAuthenticated:false }; }
  }

  async function isAuthenticated(){
    const p = plugin();
    if(!p) return { isAuthenticated:false };
    try { return await p.isAuthenticated(); }
    catch(e){ return { isAuthenticated:false }; }
  }

  async function getPlayer(){
    const p = plugin();
    if(!p) return null;
    try {
      const r = await p.getCurrentPlayer();
      if(!r || !r.player) return null;
      return Object.assign({}, r.player, { playerId: r.player.displayName || 'play' });
    } catch(e){ return null; }
  }

  async function saveCloud(data){
    const p = plugin();
    if(!p) return false;
    try {
      await p.saveGame({ title:SAVE_SNAPSHOT, data:JSON.stringify(data) });
      return true;
    } catch(e){
      console.warn('Play Games cloud save failed', e);
      return false;
    }
  }

  async function loadCloud(){
    const p = plugin();
    if(!p) return null;
    try {
      const r = await p.loadGame({ saveName:SAVE_SNAPSHOT });
      if(!r || !r.data) return null;
      const parsed = JSON.parse(r.data);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch(e){
      console.warn('Play Games cloud load failed', e);
      return null;
    }
  }

  return {
    isAndroidApp,
    isAvailable: isAndroidApp,
    signIn,
    isAuthenticated,
    getPlayer,
    saveCloud,
    loadCloud,
  };
})();

window.PlayBridge = PlayBridge;
