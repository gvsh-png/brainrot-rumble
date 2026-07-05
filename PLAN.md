# BRAINROT SWARM — Game Plan

A full design plan to **rebrand and upgrade the existing brainrot game**: keep the
survivor / bullet-hell loop and the **grassy daylight cartoon world**, but give the whole
cast **better, accurate art**, add the full **Italian Brainrot** roster (30 characters),
new **cards + evolutions**, and planned **abilities**.

> Status: **design only** — nothing here is implemented yet. Drops into the existing engine
> (`index.html` + `styles.css` + `js/{core,audio,sprites,input,game}.js`).

> ⚖️ **Legal note:** the Italian Brainrot / AI-Brainrot-Animals characters are **AI-generated**,
> so they lack human authorship and are effectively **public domain** — free to recreate.
> **Do NOT copy specific human creators' assets/models** (e.g. a particular Roblox dev's mesh).
> We recreate each character **from the concept** as our own original vector sprite.

---

## 1. Rebrand & world

- **Working title:** **BRAINROT RUMBLE** (subtitle: *Italian Invasion*). Keeps the brainrot
  identity but signals a fresh, bigger version. (Name is swappable.)
- **World stays the same:** the existing **grass checkerboard field + wooden fence + daylight
  palette**, flat cel-shading, **no glow**. We are *not* changing the map — only what fights on it.
- **Tone:** the meme energy stays (sigma/rizz/Ohio/fanum-tax flavor in the UI & card names),
  just polished.

## 2. Art direction — "better art"
This is the headline upgrade. The current sprites are simple; the rebrand makes each character
**recognizable at a glance**.

- **One detailed vector sprite per character**, pre-rendered to an offscreen canvas (as now),
  but with more shapes, shading planes, and signature props (Nike sneakers, bomber wings,
  cappuccino foam, Saturn rings, etc.).
- 🔎 **Reference-check each character with an image search BEFORE drawing it** — match the
  silhouette, colors, and iconic details people expect, then stylize to our flat cartoon look.
- Consistent rules: dark outline, 1–2 flat shade tones, readable silhouette, idle wobble +
  squash-on-hit + white hit-flash (already supported).
- Bosses get **larger, multi-part sprites** + a name banner.

---

## 3. Enemy roster (24) — tiered, with attack examples
All 24 are drawn from the 30-character cast (the other 6 are bosses, §4).

### Tier I — Fodder *(fast, weak, swarm)*
1. **Spijuniro Golubiro** *(spy pigeon, shades + earpiece)* — fast erratic flyer; swarms. *Attack:* occasional single "recon" bolt.
2. **Quacodillo Bombardiro** *(rubber-duck bomber jet)* — dive-bombs; **drops a small bomb that bursts into 4** (kamikaze).
3. **Chimpanzini Bananini** *(chimp-banana)* — fast straight-line charger; peels off and re-charges.
4. **Penguino Cocosino** *(coconut-shell penguin)* — waddles, then **belly-slide dash** at you.
5. **Flamingulli-gulli-gulli** *(loopy-neck flamingo)* — weaves unpredictably; **neck-whip** melee.

### Tier II — Infantry *(chasers, light ranged)*
6. **Cappuccino Assassino** *(coffee-mug ninja, knife limbs)* — quick; **throws an aimed knife**, dashes through.
7. **Ballerina Cappuccina** *(cappuccino-head ballerina)* — pirouettes; **spin release = radial ring of 6**.
8. **Lirili Larila** *(cactus elephant in slippers)* — slow, tanky; **trunk-sprays a 3-needle spread**.
9. **Brr Brr Patapim** *(proboscis-monkey tree)* — medium; **ground-stomp lobs 2 arcing acorns**.
10. **Svinino Bombondino** *(hard-candy pig)* — bounces; **lobs a candy that shatters into 4 shards**.
11. **Castori Gangsteri** *(fedora mobster beaver)* — keeps distance; **tommy-gun burst (aimed 4-round stream)**.

### Tier III — Casters *(the bullet-hell core)*
12. **Crocodillo Ananasinno** *(pineapple croc)* — **spits a 3-chunk pineapple spread**.
13. **Blueberrinni Octopussini** *(blueberry octopus)* — **radial ring of 8 blueberries** on a timer.
14. **Graipussi Medussi** *(grapefruit jellyfish)* — drifts; **drops slow descending bullet "curtains"**.
15. **Bombombini Gusini** *(bomber-goose)* — flies overhead; **drops a line of 3 delayed bombs**.
16. **Espressona Signora** *(tall espresso-cup ballerina)* — **continuous spiral of espresso shots**.
17. **Orangutini Ananasini** *(pineapple orangutan)* — **hurls arcing pineapples that burst into a small ring**.

### Tier IV — Heavies *(tanky, telegraphed)*
18. **Rhino Toasterino** *(rhino w/ chrome toaster torso)* — charges, then **"pops toast"**: 2 toast projectiles launch up and fall as AoE markers.
19. **Il Cacto Hipopotamo** *(cactus-needle hippo)* — slow tank; **body-slam shockwave ring + outward needle burst**.
20. **Frigo Camelo** *(camel w/ fridge humps)* — tanky; **opens the fridge = a cold cone that slows you**, then a 5-ice-shard spread.
21. **Torrtuginni Dragonfrutinni** *(dragonfruit-shell turtle)* — very slow tank; **retracts into shell (invulnerable) and spin-charges in a line**.

### Tier V — Elites *(one special rule, rarer)*
22. **Pandaccini Bananini** *(panda w/ banana-peel limbs)* — **drops banana peels that make you slip** (brief control-loss patch).
23. **Tigrrullini Watermellini** *(watermelon-skin tiger)* — **telegraphed pounce-dash along a line + watermelon-seed spit (5-spread)**.
24. **Capybarelli Bananalelli** *(chill capybara w/ back-bananas)* — **support: heals & hastes nearby enemies → priority kill**; lazily lobs bananas.

---

## 4. Bosses (6) — each with a unique gimmick + phases

### B1 · **Tralalero Tralala** — *wave 5* (speed bruiser)
*Three-legged blue shark in Nike sneakers.*
- **Gimmick:** the **fastest** boss — sprints constantly, forcing you to keep moving.
- **Attacks:** telegraphed **charge-dash** across the arena (leaves a sand-spray bullet trail), **shoe-stomp shockwave ring** on stop, spits a **5-fan of bites**.
- **Enrage:** chains **two dashes** back-to-back.

### B2 · **Bombardiro Crocodilo** — *wave 10* (aerial bomber)
*Half-crocodile, half-B-29 bomber.*
- **Gimmick:** alternates **strafing flight** (hard to hit) and **bombing passes**.
- **Attacks:** **carpet-bomb lines** (telegraphed AoE circles), **radial 16-bomb burst** on a pass, summons a **Quacodillo escort**.
- **Enrage:** bombs get denser; calls a **Bombombini Gusini** wingman.

### B3 · **Tung Tung Tung Sahur** — *wave 15* (rhythm titan)
*Ominous wooden mallet / bat creature.*
- **Gimmick:** attacks on a readable **"tung… tung… tung" beat** (the sound telegraphs the timing).
- **Attacks:** overhead **mallet SLAM → expanding shockwave ring**, sweeping **bat-swing arc of bullets**, ground-pound **radial cracks** (line bullets).
- **Enrage:** the **rhythm speeds up**.

### B4 · **La Vaca Saturno Saturnita** — *wave 20* (pure bullet hell)
*Cosmic cow in a space helmet, orbiting Saturn's rings.*
- **Gimmick:** the arena-defining bullet-hell boss — spins **Saturn-ring** patterns.
- **Attacks:** **concentric expanding rings** (weave the gaps), **two counter-rotating spirals**, **homing "milky-way" orbs**, and **gravity pulses** that tug you toward it.
- **Enrage:** adds a **second ring set spinning the opposite way** (weaving curtains).

### B5 · **Gorillo Watermellondrillo** — *wave 25* (heavy bruiser)
*Silverback gorilla fused with a watermelon.*
- **Gimmick:** massive HP; **smashes the arena**.
- **Attacks:** **chest-pound shockwave**, **hurls watermelons that burst into a 12-seed spread**, ground-slam radial, **rolls across as a watermelon** (line hazard).
- **Enrage:** seed-spreads become **seed-spirals**.

### B6 · **Trippi Troppi** — *wave 30, true final* (chaos / glitch)
*Glitched cat-head on a shrimp body.*
- **Gimmick:** **GLITCH** — randomly borrows the *other bosses'* patterns; "datamosh" screen telegraphs; **briefly inverts your controls** (used sparingly + fairly).
- **Attacks:** steals **La Vaca rings**, **Bombardiro bombs**, **Sahur slams** at random; **glitch bullet-walls**; **teleport-blinks**.
- **Enrage:** cycles patterns faster + spawns **mini glitch-clones**.

---

## 5. New engine mechanics needed (for real bullet-hell)
The current engine has chase / aimed-shot / 3 boss patterns. Add:
- **Telegraphs** (warning ring/line before AoE/laser) · **AoE ground zones** (poison/cold/slip/lava, timed)
- **Homing bullets** · **Shockwave rings** · **Shields / invuln states** (turtle, gargoyle-style perch)
- **Splitters & summoners** (escorts, mini-clones) · **Player status** (slow, slip, brief control-invert — sparing)
- **Boss phases / enrage** · **Charge-dash line hazards**

---

## 6. Cards — leveling + evolution (Survivor.io-style, brainrot-flavored)

Cards have **levels**. Re-picking a card **levels it up**. Two classes:

| Class | Levels | Behavior |
|---|---|---|
| **Passive** (stat) | Lv 1 → 5 | stacks the same boost; caps at Lv 5, then leaves the pool |
| **Ability** | Lv 1 → Lv 2 → **EVOLVE** | 1st & 2nd pick strengthen it; the **3rd pick evolves** it |

> Your rule = **"get 3 → evolution."**

### Passive cards (Lv 1–5)
| Card | Per-level effect |
|---|---|
| **Sigma Grindset** | +25% damage |
| **Hyper Rizz** | +18% fire rate |
| **Nike Tech Fleece** | +12% move speed |
| **Grimace Shake** | +25 max HP + heal |
| **Gyatt Magnet** | +40% pickup range |
| **Aimbot (Legal)** | +10% crit |
| **Zoomies** | −20% dash cooldown |

### Ability cards → Evolutions ("3 = evolve")
| Card | Lv 1 | Lv 2 | **Lv 3 = EVOLVE →** | Evolved effect |
|---|---|---|---|---|
| **Fanum Tax** | +1 projectile | +1 projectile | **Full Fanum Tax** | fire a **full ring** of projectiles |
| **Ohio Drill** | pierce +1 | pierce +1 | **Drill to Ohio** | pierce **everything** + faster/bigger shots |
| **Sigma Range** | +25% range | +25% range | **Touch-Grass Sniper** | huge range **+50% damage** |
| **Emotional Support Orb** ✦ | +1 orb | +1 orb | **Sigma Squad** | extra orb that also **deletes enemy bullets** |
| **Skibidi Blast** ✦ | blast every 5s | faster + stronger | **Skibidi Nuke** | huge frequent blast that **wipes nearby bullets** |
| **Edging the Grind** ✦ | heal 1/kill | heal 2/kill | **Vampiric Rizz** | heal a big chunk per kill |
| **Cold as Ohio** ✦ | bullets 15% slower | 15% slower | **Absolute Ohio** | enemies you hit **freeze solid** |

✦ = rare (rarer in the draw). UI: owned card shows **"Lv 2"**; ready-to-evolve shows a gold
**"EVOLVE!"** badge + gold border (reuses the existing rare styling). Evolve gets the highest
draw weight once unlocked; maxed/evolved cards leave the pool.

---

## 7. Planned abilities (brainrot-flavored)
Designed for survivors auto-combat **+** dense bullet hell; several interact with *enemy bullets*.

**Weapons (how your auto-fire works):**
- **Skibidi Bolt** *(default+)* — every 5th shot is a **charged piercing bolt** w/ a trail.
- **Twin Fanum Blades** — fire **2 bolts, front + behind**.
- **Rizz Chain** — hits **arc to 3 nearby enemies**.
- **Boomerang Crocs** — Tralalero's sneaker **flies out and back** (hits twice).
- **Auto-Aim Volley** — a **5-shot spread** when you stand still ~0.5s.

**Actives (cooldown / auto):**
- **Skibidi Blink** — teleport-dash **through bullets** + explosive after-image.
- **Gyatt Dome** — bubble that **deletes enemy bullets** for 2s.
- **Mewing Parry** — dash into fire to **reflect bullets back** as damage.
- **Sigma Black Hole** *(ult)* — **pulls enemies + their bullets** in, then detonates.
- **Ohio Meteor** *(ult)* — delayed AoE telegraph nukes a big circle + leaves lava.
- **Phoenix Rizz** *(ult)* — full heal, **3s invuln + flight**, become a fire trail.

**Defensive / passive:**
- **Sigma Wisps** — orbs that **each eat one enemy bullet** then recharge.
- **Second Wind** — survive a lethal hit at **1 HP + i-frames + bullet clear** (long cd).
- **Graze Rizz** — **near-misses build a shield meter**.
- **Slow Field** — passive aura that **slows enemy bullets** in range.
- **Executioner** — enemies **under 15% HP die instantly** to your hits.

---

## 8. Pickups & misc reskin
- XP crystals → **Rizz Gems** · big crystal → **Sigma Gem** · coin → **Fanum Coins** · heart → **Grimace Shake** (heal).
- SFX keep the punchy synth; add a **"tung tung tung"** boss drum and meme-y pickup blips.

---

## 9. Suggested build order
1. **Art + roster pass** (headline): **keep the grass map/fence/palette**; draw the 24 enemies +
   6 bosses (reference-searched) and wire them onto the *existing* mechanics (chase/shoot + spiral/rings/chaos).
2. **Card leveling + evolution system** (contained change to `js/game.js` + CSS for badges).
3. **New mechanics:** telegraphs, AoE zones, shields, summoners, charge-dashes.
4. **Elites + bosses B3–B6** using those mechanics; then the planned abilities/ults.

---

## 10. Character → role index (all 30)
| # | Character | Role |
|---|---|---|
| 1 | Tralalero Tralala | **BOSS** (speed) |
| 2 | Bombardiro Crocodilo | **BOSS** (bomber) |
| 3 | Ballerina Cappuccina | T2 infantry |
| 4 | Cappuccino Assassino | T2 infantry |
| 5 | Tung Tung Tung Sahur | **BOSS** (rhythm) |
| 6 | Brr Brr Patapim | T2 infantry |
| 7 | Chimpanzini Bananini | T1 fodder |
| 8 | Bombombini Gusini | T3 caster |
| 9 | Lirili Larila | T2 infantry |
| 10 | Trippi Troppi | **BOSS** (glitch final) |
| 11 | Gorillo Watermellondrillo | **BOSS** (heavy) |
| 12 | Crocodillo Ananasinno | T3 caster |
| 13 | Pandaccini Bananini | T5 elite |
| 14 | Espressona Signora | T3 caster |
| 15 | Svinino Bombondino | T2 infantry |
| 16 | Tigrrullini Watermellini | T5 elite |
| 17 | Penguino Cocosino | T1 fodder |
| 18 | Orangutini Ananasini | T3 caster |
| 19 | Capybarelli Bananalelli | T5 elite (support) |
| 20 | Torrtuginni Dragonfrutinni | T4 heavy |
| 21 | Frigo Camelo | T4 heavy |
| 22 | Rhino Toasterino | T4 heavy |
| 23 | La Vaca Saturno Saturnita | **BOSS** (bullet hell) |
| 24 | Castori Gangsteri | T2 infantry |
| 25 | Blueberrinni Octopussini | T3 caster |
| 26 | Quacodillo Bombardiro | T1 fodder |
| 27 | Il Cacto Hipopotamo | T4 heavy |
| 28 | Graipussi Medussi | T3 caster |
| 29 | Spijuniro Golubiro | T1 fodder |
| 30 | Flamingulli-gulli-gulli | T1 fodder |

---

## 11. WORLDS EXPANSION — character vision & rules *(2026-06-14, the source of truth for new worlds)*

> This is the **reusable rulebook** for populating new worlds. Full system design lives in
> `docs/specs/2026-06-14-worlds-expansion-design.md`; this section is the **character vision**.

### Big picture
- Grow from a few worlds toward a **50–100 world** progression. Difficulty ramps **gradually**
  across worlds (per-world difficulty *bands*), so the hardest content sits at the *end*, not at World 2.
- **Fixed bookends:** **World 1 = Grasslands** (the original 30-character grass roster, unchanged) and
  **World 10 = Dirt Depths** (the original "world 2" dirt roster/theme, moved to the end).
- **Worlds 2–9 are NEW**, each with its own cast, theme/map shape, bosses, and ability cards.
  *(World 2 = **Citrus Coast**, built first as the template.)*

### Who the characters are — the IP rules (READ BEFORE PICKING A CAST)
1. **Real, named Italian Brainrots** — NOT invented generic animals. Pick actual meme characters.
2. **OG / original viral brainrots only** — **NOT** "Steal a Brainrot" (Roblox) spinoffs or other
   game-specific inventions (e.g. avoid Dragon Cannelloni, Nuclearo Dinossauro, La Grande Combinasion,
   Capitano Moby, Tartaruga Cisterna — those are game creations, not the OG meme canon).
3. **Lesser-known OG ones that are NOT already in the game** — almost every *iconic* OG (Tralalero,
   Bombardiro, Tung Sahur, La Vaca, Lirili, Patapim, Cappuccino, Ballerina, Boneca, Glorbo, Bobritto,
   Burbaloni, Cocofanto, Girafa, Brri Brri Bicus, Garamaraman…) is **already used** — so dig for the
   deeper-cut OG characters.
4. **Kid-friendly** (younger audience). Skip anything crude/NSFW (e.g. Crocodildo Penisini).
5. **🔎 Research each exact name's real appearance (web/image search) BEFORE drawing it** — match the
   animal×object hybrid, silhouette, colors, and signature details, then stylize to our flat cartoon look.
6. **Recreate from the concept as our own original vector sprite** (`makeSprite`, dark `OUT` outline,
   flat shades, `eyes()` helper). Do **not** copy a specific creator's image/3D model.
7. **⚖️ Monetization risk accepted by the owner.** Named brainrots are not guaranteed copyright-free
   (some creators have asserted rights / trademarks). The owner has chosen to use real named OG
   brainrots for a commercial game **knowingly accepting that risk** — verify per-character / seek
   legal advice before selling merch. (The "public domain" note in the header is the optimistic read.)

### Per-world content quota
- **~8 enemies** + **4 bosses** (boss waves 5 / 10 / 15 / 20; 20 waves per world).
- **Enemies:** simple, readable, **"not too hard"** — mostly chasers with a *few* light specials
  (one dasher, one light shooter, one death-pop, one armored tank). Early worlds especially gentle.
- **Bosses:** drawn from **lesser-known OG** brainrots. **Every boss should feel original — never the
  same attacks.** Each gets its own move set. **Bullet-hell is reserved for late-world bosses (W7–10);**
  W2–6 bosses are telegraphed melee/zone fights.
- **New ability cards each world** — at least a couple, a mix of **basic passives** and **evolve
  abilities** (4 levels → EVOLVE), gated to unlock from that world (`minWorld`). *(W2 added Spiky Peel +
  Ricochet→Chain Reaction.)*

### Difficulty & economy backbone (so items are NEEDED)
- Enemy/boss HP & damage scale by world **band**; coins pay more in later worlds to fund the grind.
- **Rarity-banded gear gate:** Common gear carries you to ~W5, then you need **Uncommon**, then
  **Rare**, then **Epic+** for the final worlds. Prices/stats scale to match.

### Build pattern per new world (repeat for W3–W9)
Pick lesser-known OG cast (8 enemies + 4 bosses) → **research each look** → draw the sprites in house
style → wire `FOES_W#` / `BOSSES_W#` + theme/map into `WORLDS` → give bosses **original move sets** →
add the world's **new cards** → **balance** → verify headlessly → PR.

---

## 12. PLAYER CHARACTERS, PETS & GEM SYSTEM

> Status: **design only** — nothing implemented yet.
> All new files load before `game.js`: `hooks.js → characters.js → pets.js → recruit.js → game.js → shop.js`

---

### 12.1 Gem Currency

Gems are the **dedicated recruitment currency** — completely separate from gold and coins.
Gold and coins are never spent on characters or pets.

**Earn sources:**
- Beat a world for the first time → **+10 gems**
- Beat a boss for the first time → **+2 gems**
- Daily login bonus → **+1 gem**
- Lucky block rare reward (new 4th slot, low chance) → **+3 gems**

**Storage:** mirrors the existing gold pattern exactly.
```js
// br_gems        raw value
// br_gems_sig    FNV-hash integrity check (same _saveHash() function)
function addGems(n)    { gems+=n; saveGems(); updateGemsHUD(); }
function spendGems(n)  { if(gems<n) return false; gems-=n; saveGems(); updateGemsHUD(); return true; }
```

---

### 12.2 Player Characters

One character is **active per run**, selected from the Character Shop before starting.
`P.charId` is saved in localStorage and loaded into `resetPlayer()`.

#### World-Progression Characters *(earned by beating worlds — never purchasable)*

| Character | Passive | Unlock |
|---|---|---|
| **Gianni** | None — baseline stats | Start |
| **Fortunato** | `LUCKY_CAP` 2 → 4 per wave; 30% chance lucky block pop also drops a bonus upgrade card | Beat World 3 |
| **Il Professore** | XP orb pickup radius ×2; starts each wave with 20% of level XP filled; draws 4 cards at level-up instead of 3 | Beat World 7 |
| **Fantasma** | Dash replaced with **Phase Shift** (see §12.2.1) | Beat World 9 |
| **Il Campione** | 12% chance each enemy drops a mini lucky block on death; each boss killed permanently adds +2 base damage (persists in localStorage across runs) | Beat World 10 |

#### Gacha Shop Characters *(purchasable from rotating Character Shop — see §12.4)*

| Character | Rarity | Passive |
|---|---|---|
| **Bombardella** | Rare | +40% base dmg, −35 max HP (65 HP); every 10 kills in a wave grants +1 temp projectile for that wave |
| **Sorella Veloce** | Rare | +35% move speed; dash has 2 charges (recharge 30% slower); killing within 0.5s of a dash gives +15% dmg for 3s (stacks ×3) |
| **Zio Schermo** | Epic | Starts each wave with a shield that absorbs 1 hit; shield recharges 8s after breaking; 15% permanent armor |
| **Doppione** | Epic | Every upgrade card picked creates a ghost copy at 40% value (doesn't count toward card level caps) |
| **La Strega** | Legendary | 10% of enemy projectiles convert to XP orbs mid-flight; curse aura — enemies within 80px deal 20% less damage |

#### 12.2.1 Fantasma — Phase Shift

Replaces the dash entirely:
- Player turns semi-transparent (40% opacity) and becomes **invincible for 0.8 seconds**
- **Time slows to 30% speed** for the duration
- Player **cannot move** during the shift — purely defensive
- Same cooldown slot as dash (`P.dashMax`)

**Implementation — two changes to `game.js`:**

1. Add `let timeScale = 1.0;` at top of file.
2. In `loop()`, compute `rawDt` first (hitstop handled on rawDt), decrement phase shift timer on rawDt, then multiply: `const dt = rawDt * timeScale;` before calling `update(dt)`.
3. In `tryDash()`, branch at the top:
```js
if(P.charId === 'fantasma'){
  P.dashCd = P.dashMax;
  P.phaseShifting = true; P.phaseShiftT = 0.8; P.inv = 0.8;
  timeScale = 0.3; sfx.dash(); return;
}
```
4. In `render()`, set `cx.globalAlpha = 0.35` before `drawCharacter()` when `P.phaseShifting`, restore after.

---

### 12.3 Character Visual System

Each character has a **custom vector look** drawn with canvas primitives. Same proportions and bounding box as the default player (`P.r * 2.6` ≈ 47px). Shadow, HP bar, blink, and shield rings are unchanged — only the character body changes.

**One change in `game.js`:**
```js
// Replace:
drawSprite('player', P.x, P.y, P.r*2.6, bob, 0, 0, flip);
// With:
drawCharacter(P.charId, P.x, P.y, P.r*2.6, bob, flip);
```

**Dispatcher in `characters.js`:**
```js
function drawCharacter(charId, x, y, size, bob, flip){
  const char = CHARACTERS.find(c=>c.id===charId);
  if(!char?.draw){ drawSprite('player',x,y,size,bob,0,0,flip); return; }
  cx.save();
  cx.translate(x,y); if(flip) cx.scale(-1,1); cx.rotate(bob);
  char.draw(cx, size);   // draws at local origin (0,0), facing right
  cx.restore();
}
```

Each character config object has a `draw(cx, size)` method using canvas paths. The same function is reused to render **80×80 thumbnails** in the Character Shop (drawn onto an offscreen canvas).

#### Visual Designs *(flat cel-shaded, dark outline, 1–2 shade tones — matching existing art style)*

| Character | Visual Description |
|---|---|
| **Gianni** | Existing `SP['player']` sprite — no draw() method, falls back to drawSprite |
| **Fortunato** | Gold skin, tiny top hat with `?` on it, star sparkle floating at side (pulsing via `elapsed`), green waistcoat body |
| **Bombardella** | Red-tinted skin, 3 spike triangles for hair, angry brow lines, rough polygon body (torn shirt silhouette) |
| **Sorella Veloce** | Cyan skin, slightly oval head (wide), hair swept back, 2–3 horizontal speed-line streaks trailing behind, narrow lean body |
| **Zio Schermo** | Gunmetal grey, bulky — head sits lower with less neck gap, wider squat body, honeycomb hex pattern stroked on back, thick dark visor across eyes |
| **Doppione** | Split vertically: left half white, right half black; eyes point outward from center line; two-tone body |
| **La Strega** | Purple skin, tall pointed witch hat with star, bezier-arc cape wings from shoulders, thin horizontal cat-slit pupils |
| **Il Professore** | Beige skin, flat mortarboard cap with tassel, two small stroked circles for glasses, tie on body, small pulsing XP orb floating top-right (animated via `elapsed`) |
| **Fantasma** | Pale blue, 85% opacity baseline; bottom fades into 3 animated sine-wave ghost tails (using `elapsed`); hollow stroked eyes, no fill |
| **Il Campione** | Gold skin, 3-point crown on head with gem, laurel wreath arc behind head, medal circle with star on chest |

---

### 12.4 Character Shop *(new tab, separate from existing daily gear shop)*

A **rotating direct-purchase** shop — no gacha pulls. Players see exactly what's available and buy directly with gems.

| Slot | Count | Rarity | Resets | Cost |
|---|---|---|---|---|
| Daily slots | 3 | Common / Rare | Midnight UTC | 20 / 50 gems |
| Weekly slot | 1 | Legendary | Monday midnight UTC | 150 gems |

**Rotation is deterministic and seeded by date** — all players see the same characters on the same day:
```js
function dailySeed(){ const d=new Date(); return d.getUTCFullYear()*10000+(d.getUTCMonth()+1)*100+d.getUTCDate(); }
function weeklySeed(){ /* ISO week number × year */ }
```

- **Daily pool:** all non-legendary gacha characters (Common + Rare). World-locked characters show as grayed-out with unlock requirement until condition is met.
- **Weekly pool:** all Legendary gacha characters only — same world-gate rule.
- Already-owned characters show a checkmark and no buy button. Their slot is replaced by the next in the seeded sequence so 3 slots always show something purchasable.
- World-progression characters (Fortunato, Il Professore, Fantasma, Il Campione) **never appear** in the shop — earned only by beating worlds.

**Shop tab UI layout:**
```
[ Character Shop ]
  ┌──────────────────────────────────────┐
  │  WEEKLY  ★  [Legendary Name]  150💎  │  ← resets in X days
  ├──────────────────────────────────────┤
  │  DAILY                               │
  │  [Common Name]   20💎                │
  │  [Rare Name]     50💎                │
  │  [Rare Name]     50💎   🔒 World 5  │
  │                        resets in Xh  │
  └──────────────────────────────────────┘
```

---

### 12.5 Pets

One pet equipped at a time (`P.petId`). Effects are registered as hooks (see §12.7) — no scattered if-checks in game logic.

**All pets obtained via Pet Recruit gacha (§12.6).**

| Pet | Rarity | Trigger | Effect |
|---|---|---|---|
| **Gattino** *(Heart Cat)* | Common | `waveStart` | Drops a 25 HP heart pickup near player |
| **Uccellino** *(Spark Bird)* | Common | `waveStart` every 5 waves | Drops a small XP orb cluster near player |
| **Orbino** *(XP Sprite)* | Rare | `waveEnd` | Converts 15% of XP gained that wave into a bonus XP burst |
| **Scudetto** *(Shield Turtle)* | Rare | Continuous | Orbits player, blocks 1 projectile every 8s |
| **Calamita** *(Magnet Cat)* | Rare | `waveStart` | Activates magnet pull for first 4 seconds of wave |
| **Draghetto** *(Mini Dragon)* | Epic | `petTick` (every 3s) | Attacks nearest enemy for 15% of player's current base damage |
| **Stellina** *(Lucky Star)* | Epic | `onHpZero` (once per run) | Spawns 1 emergency lucky block mid-wave when HP drops to 0 (saves player); also adds a 4th lucky block reward: XP burst worth half a level |
| **Anima Gemella** *(Soul Twin)* | Legendary | `onDash` | After player dashes, pet dashes through nearest 3 enemies dealing 40% of base damage |

**Pet Recruit rarity weights:**

| Rarity | Weight | Pity guarantee |
|---|---|---|
| Common | 55% | — |
| Rare | 35% | Guaranteed Rare if 10 pulls without one |
| Epic | 9% | — |
| Legendary | 1% | Guaranteed Legendary at pull 50 |

**Duplicate:** +3 gems refund.

---

### 12.6 Pet Recruit *(gacha — separate from Character Shop)*

- **Cost:** 5 gems per pull
- Pool: all pets, filtered by rarity weights above
- Pity counters saved in localStorage as `br_pet_pity`
- Owned pets still appear in pulls but give gem refund on duplicate

```js
function recruitPet(){
  return doPull(PETS, PET_WEIGHTS, 'br_pet_pity', 10, 50, 5);
}
```

Generic `doPull()` handles weight sampling, pity checks, ownership grant, and duplicate refund. Adding new pets to the pool requires only adding to the `PETS` config array.

---

### 12.7 Hook System *(the scalability foundation)*

A tiny event bus in `hooks.js` (~20 lines). Every character passive and pet effect registers as a listener — no scattered `if(P.charId==='x')` checks in core game logic.

```js
const HOOKS = {};
function onHook(name, fn)     { (HOOKS[name]=HOOKS[name]||[]).push(fn); }
function fireHook(name,...args){ (HOOKS[name]||[]).forEach(fn=>fn(...args)); }
function clearHooks()          { Object.keys(HOOKS).forEach(k=>delete HOOKS[k]); }
```

**Hook points fired in `game.js`:**

| Hook | Where fired | Notes |
|---|---|---|
| `waveStart` | `startWave()` | — |
| `waveEnd` | wave-cleared detection | — |
| `onKill` | enemy death handler | passes `enemy` object |
| `onDash` | `tryDash()` | — |
| `onLevelUp` | `gainXp()` level-up branch | — |
| `onLuckyPop` | `popLucky()` | passes `block` |
| `getLuckyCap` | `startWave()` before `spawnLuckyBatch` | **reducer**: `Math.max(2, ...fireHook('getLuckyCap'))` |
| `onHpZero` | damage handler, before death | — |
| `petTick` | every `update(dt)` frame | passes `dt` |

**Game start / reset flow:**
```
_doStartGame()
  → resetPlayer()           existing
  → applyCharBase(P.charId) applies character stat overrides to P
  → clearHooks()            wipes leftover listeners
  → registerActiveChar()    character binds its hooks
  → registerActivePet()     pet binds its hooks
```

**Scalability rules:**
- Add a new character → add one object to `CHARACTERS` array in `characters.js`. Zero changes to `game.js`.
- Add a new pet → add one object to `PETS` array in `pets.js`. Zero changes to `game.js`.
- Add a new effect type → add one `fireHook()` call at the relevant point in `game.js`; any future character/pet can listen to it.
- Rotate shop → automatic; pool is a filtered view of the config array seeded by date.

---

### 12.8 New Files Summary

| File | Purpose |
|---|---|
| `js/hooks.js` | `onHook`, `fireHook`, `clearHooks` — ~20 lines |
| `js/characters.js` | `CHARACTERS` config array, `applyCharBase()`, `registerActiveChar()`, `drawCharacter()`, all `draw()` methods |
| `js/pets.js` | `PETS` config array, `registerActivePet()` |
| `js/recruit.js` | Gem currency, `recruitPet()`, `doPull()`, Character Shop rotation logic, ownership tracking, pity counters, shop UI |

**Existing file changes:**
- `game.js` — add `timeScale`, modify `loop()`, modify `tryDash()` (Fantasma branch), add `fireHook()` calls at hook points, replace `drawSprite('player',...)` with `drawCharacter()`, add `applyCharBase()` + `clearHooks()` + `registerActiveChar/Pet()` calls in start sequence, add `P.charId`/`P.petId`/`P.phaseShifting`/`P.phaseShiftT` to `resetPlayer()`
- `shop.js` — add Character Shop tab and Pet Recruit tab to shop UI
- `index.html` — add `<script>` tags for the 4 new files in correct load order
