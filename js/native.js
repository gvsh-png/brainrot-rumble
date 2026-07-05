'use strict';
// Android shell hooks — immersive fullscreen, back button, wake lock. No-op on web.

(function initNativeShell(){
  if(!window.Capacitor || window.Capacitor.getPlatform() !== 'android') return;

  document.documentElement.classList.add('is-native-android');
  document.body.classList.add('is-native-android');

  const cap = window.Capacitor;
  const App = cap.Plugins && cap.Plugins.App;
  const StatusBar = cap.Plugins && cap.Plugins.StatusBar;
  const SplashScreen = cap.Plugins && cap.Plugins.SplashScreen;
  const Keyboard = cap.Plugins && cap.Plugins.Keyboard;

  function hideSplashSoon(){
    if(!SplashScreen || !SplashScreen.hide) return;
    const hide = () => SplashScreen.hide().catch(()=>{});
    if(document.readyState === 'complete') setTimeout(hide, 400);
    else window.addEventListener('load', () => setTimeout(hide, 400), { once:true });
  }

  async function setupImmersive(){
    if(!StatusBar) return;
    try {
      if(StatusBar.setOverlaysWebView) await StatusBar.setOverlaysWebView({ overlay: true });
      if(StatusBar.hide) await StatusBar.hide();
      else if(StatusBar.setBackgroundColor) await StatusBar.setBackgroundColor({ color: '#00000000' });
    } catch(e){}
  }

  if(Keyboard && Keyboard.setResizeMode){
    Keyboard.setResizeMode({ mode: 'none' }).catch(()=>{});
  }

  setupImmersive();
  hideSplashSoon();

  if(App && App.addListener){
    App.addListener('appStateChange', ({ isActive }) => {
      if(isActive) setupImmersive();
    });

    App.addListener('backButton', ({ canGoBack })=>{
      const login = document.getElementById('login');
      const inGame = typeof state !== 'undefined' && state === 'play';
      const paused = document.getElementById('pause') && !document.getElementById('pause').classList.contains('hidden');
      const settings = document.getElementById('settingsdrop') && !document.getElementById('settingsdrop').classList.contains('hidden');

      if(settings){
        document.getElementById('settingsdrop').classList.add('hidden');
        return;
      }
      if(paused){
        const resume = document.getElementById('resumebtn');
        if(resume) resume.click();
        return;
      }
      if(inGame){
        const pauseBtn = document.getElementById('pausebtn');
        if(pauseBtn) pauseBtn.click();
        return;
      }
      if(login && !login.classList.contains('hidden')){
        App.minimizeApp && App.minimizeApp();
        return;
      }
      if(canGoBack) window.history.back();
      else if(App.minimizeApp) App.minimizeApp();
    });
  }

  document.addEventListener('visibilitychange', () => {
    if(document.visibilityState === 'visible') setupImmersive();
  });

  // Keep screen awake during play (Screen Wake Lock API; falls back silently).
  let wakeLock = null;
  async function syncWakeLock(){
    const playing = typeof state !== 'undefined' && state === 'play';
    try {
      if(playing && navigator.wakeLock && !wakeLock){
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => { wakeLock = null; });
      } else if(!playing && wakeLock){
        await wakeLock.release();
        wakeLock = null;
      }
    } catch(e){}
  }

  setInterval(syncWakeLock, 1500);
})();
