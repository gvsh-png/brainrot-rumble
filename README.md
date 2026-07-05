# BRAINROT SURVIVORS — Italian Brainrot Bullet Hell

A mobile-first web game. Vanilla JS + Canvas 2D. Ships as a **web game** and a **Google Play Android app** (Capacitor).

## Play

- **Web:** open `index.html` or host statically (Vercel, GitHub Pages, etc.). Progress is saved on-device (guest).
- **Android:** see [docs/ANDROID_PUBLISH.md](docs/ANDROID_PUBLISH.md) for building and publishing to Google Play with **Google Play Games** cloud saves.

```bash
npm install
npm test
npm run cap:sync      # after web changes
npm run android:open  # Android Studio
```

## How it works

- **Drag anywhere** to move (floating joystick). WASD/arrows work on desktop.
- **Auto-fire** at the nearest enemy. Your job is to position and dodge.
- **DASH** button (mobile) or Space/Shift (desktop) — a short i-frame burst to escape.
- Kills drop **crystals** → fill the XP bar → **pick 1 of 3 upgrades** (roguelike).
- Coins add score; rare hearts heal. Chain kills for a **combo score multiplier**.
- Waves get harder forever. Every 5th wave is a **boss** (spiral / ring / chaos patterns).

## The map

A real bordered arena (~2600×2600) surrounded by a wooden fence. The **camera follows you**
as you roam the field — walk to the edges, kite enemies around the world, watch the minimap
in the bottom-left to read the swarm.

## The bestiary (hand-drawn vector sprites)

Skibidi Toilet · Cappuccino Assassino · Bombardiro Crocodilo · Tralalero Tralala ·
Brr Brr Patapim · Lirili Larila.
Bosses: SKIBIDI TITAN, TRALALERO BOSS, BOMBARDIRO.

## Feel

Hit-stop on impact, squash & stretch, white hit-flash, floating damage numbers, screen
shake, knockback, particle bursts, dash afterimages, and a shockwave upgrade — tuned for
satisfying game feel.

## Tech

Vanilla JS + Canvas 2D. All characters and pickups are **code-drawn vector sprites**
pre-rendered to offscreen canvases (no emoji, no external image files). Web Audio synth
sound effects (no audio assets). Clean flat cel-shaded daylight art — no glow/bloom.
`localStorage` progression; **Google Play Games Saved Games** on Android. Haptic feedback on hit where supported.

## Android / Google Play

- **Capacitor 5** wraps the web game as a native Android app (`android/`)
- **Google Play Games** sign-in + cloud saves (replaces Supabase)
- Portrait-locked, immersive status bar, hardware back button handling
- Publishing guide: [docs/ANDROID_PUBLISH.md](docs/ANDROID_PUBLISH.md)

## Project structure

Web assets live at the repo root; `npm run prepare:www` copies them into `www/` for Capacitor.

```
index.html      markup + script/style links
styles.css      all styling
js/core.js      canvas setup, shared helpers, world/camera/zoom, game-state flag
js/audio.js     Web Audio synth + sound effects
js/sprites.js   sprite factory + every character/pickup sprite
js/input.js     joystick, dash, zoom, drag/right-click guards
js/game.js      entities, upgrades, update/render loop, minimap, init
```
