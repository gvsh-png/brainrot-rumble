# Card Rarity System + More Cards + Unlockable Synergies — PLAN (not implemented)

Date: 2026-06-11
Status: plan only — do NOT implement until approved.

Decisions (from user):
- **5 rarity tiers**: Common / Uncommon / Rare / Epic / Legendary.
- **Appearance-only** rarity: rarity decides which tier a card is in, its draw odds, and its
  color — a card's numbers are fixed (no per-pickup magnitude rolling).
- **Synergies = unlockable synergy cards**: special high-rarity cards that only enter the draw
  pool once you own their prerequisite cards. (No Luck stat, no new hidden auto-combos beyond
  the existing Frostfire.)

---

## 1. Current state (what exists today)

- `UPGRADES` cards have an optional `rare:true` boolean and an optional `evo` block.
- `openLevelUp()` gathers every card with a remaining `nextMove()`, then weighted-draws 3
  distinct with weights: evolve = 6, `rare` = 1, normal = 2.
- CSS: `.card.rare` (gold border) and `.card.evolve` styling.
- So "rarity" today is binary + evolve. We replace the boolean with a 5-tier field.

## 2. Rarity system

### 2.1 Data
Replace `rare:true` with `rarity:'<tier>'` on every card (default `'common'` if omitted).
Tiers and base draw weights (higher = appears more often):

| Tier | weight | border color | glow |
|------|--------|--------------|------|
| common     | 100 | `#cbd2da` (gray)   | none |
| uncommon   | 52  | `#5fbf52` (green)  | faint green |
| rare       | 24  | `#4aa3df` (blue)   | blue |
| epic       | 9   | `#b06ff0` (purple) | purple |
| legendary  | 3   | `#e0a92e` (gold)   | gold pulse |

Weights are tunable constants in one `RARITY = {common:{w:100,col:..}, ...}` table.

### 2.2 Draw algorithm (rewrite the weighting in `openLevelUp`)
1. Build candidates: for each `UPGRADE` that (a) has a remaining `nextMove()` **and**
   (b) passes its `req` gate (see §4), push `{u, m, weight}` where
   `weight = RARITY[u.rarity].w`.
2. **Evolve priority preserved**: if the move is an evolve (`m.evolve`), multiply its weight
   by 8 so evolutions reliably surface when ready (matches today's behavior).
3. Weighted-draw 3 distinct candidates using those weights (same splice-by-weight loop as now).
4. Render each card with its tier class + a small rarity label/badge.

### 2.3 Visuals (styles.css)
- Add `.card.r-common / .r-uncommon / .r-rare / .r-epic / .r-legendary` (border + bg tint + box-shadow per the table).
- Add a small uppercase rarity tag in the card header (reuse the `.lvtag` slot styling).
- Keep the existing `.evolve` / `evobadge` treatment layered on top (an evolve card shows both its tier color and the EVOLVE badge).
- Remove the now-unused `.card.rare` rules (or alias to `.r-rare`).

### 2.4 Tier assignments for existing cards
- **Common**: Brute Force (`dmg`), Adrenaline Rush (`rate`), Fleet Footed (`speed`), Vitality Essence (`hp`), Magnetic Pulse (`magnet`).
- **Uncommon**: Critical Strike (`crit`), Quick Reflexes (`dashcd`), Focal Lens (`range`), Killer Instinct (`critdmg`).
- **Rare**: Splinter Shot (`multi`), Piercing Rounds (`pierce`), Killing Frenzy (`frenzy`), Stasis Field (`slow`).
- **Epic**: Orbiting Barrier (`orbit`), Pulse Wave (`nova`), Soul Harvest (`vamp`), Glass Cannon (`glass`), Aegis Bubble (`aegis`).
- **Legendary**: Black Hole (`blackhole`), Phoenix Heart (`phoenix`), + all synergy cards (§4).

## 3. New simple cards (fill Common / Uncommon so early draws feel varied)

Each is a one-line passive added to `UPGRADES`; the listed `P.*` fields are new and need init
in `resetPlayer()` plus a one-spot hook where noted.

| Card | Tier | Cap | Effect | Hook |
|------|------|-----|--------|------|
| **Iron Skin** | common | 5 | -7% damage taken / level (`P.armor`, mult) | `hurtPlayer`: `dmg *= P.armor` |
| **Regeneration** | common | 5 | +1 HP/sec / level (`P.regen`) | `update`: `P.hp=min(maxHp,hp+P.regen*dt)` |
| **Heavy Rounds** | common | 5 | +15% bullet size & +8% projectile speed (`P.bulletR`,`P.bulletSpd`) | fire block uses `br*P.bulletR`, `spd*P.bulletSpd` |
| **Thick Skin** | common | 5 | +15 max HP (no heal) (`P.maxHp`) | apply fn only |
| **Treasure Hunter** | uncommon | 5 | +20% gold & +12% XP (`P.goldMul`,`P.xpMul`) | coin pickup ×goldMul; `gainXp` ×xpMul |
| **Steady Hands** | uncommon | 5 | -15% bullet spread & +6% damage (`P.spread`,`P.dmg`) | fire block uses `P.spread` |

Rationale: these are cheap, always-useful Common picks that thin out the high-power pool early,
and Treasure Hunter / Steady Hands give Uncommon-tier choices. None introduce new entities.

## 4. Unlockable synergy cards

### 4.1 The gate system
- Add an optional `req:[ 'id', ... ]` (and optional `reqLvl:n`, default 1) to a card.
- A card with `req` is **excluded from candidates** until the player owns every required id at
  `P.up[id] >= reqLvl`.
- Synergy cards are Epic/Legendary rarity, so they stay rare even after unlocking.
- Render a distinct **"SYNERGY"** badge (like `evobadge` but cyan) so they read as special.
- These are single-purpose cards (cap 1 or a short cap), not evolve chains.

### 4.2 The synergy cards (each fuses two builds)

| Card | Tier | Requires | Effect (new flag) |
|------|------|----------|-------------------|
| **Frostfire Core** | epic | `slow` + `nova` | Nova vs frozen foes jumps to +120% (from the built-in +60%) and frozen foes that die shatter into 4 shard bullets. (`P.frostfire`) |
| **Event Horizon** | legendary | `blackhole` + `nova` | Black holes detonate with a Nova-style blast when they expire. (`P.holeNova`) |
| **Blood Crit** | epic | `vamp` + `crit` | Critical hits also heal you for +2 HP. (`P.critHeal`) |
| **Glass Phoenix** | legendary | `glass` + `phoenix` | Future Glass Cannon picks no longer cost max HP, and a Phoenix revive restores to full. (`P.glassSafe`, bumps `phoenixHeal`) |
| **Orbital Storm** | epic | `orbit` + (`multi` OR `radial`) | Orbiting barriers periodically fire a bullet outward each. (`P.orbShoot`) |
| **Overdrive** | epic | `rate` + `frenzy` | Frenzy stack cap +50%, and each stack also grants +0.4% crit chance. (`P.overdrive`) |
| **Aegis Nova** | epic | `aegis` + `nova` | Blocking a hit with the shield also triggers your Nova. (`P.aegisNova`) |

Each effect is a small, isolated hook in an existing system (nova loop, crit branch, shield
block in `hurtPlayer`, orbs loop, frenzy math). All are appearance-only re: rarity.

## 5. Files touched (when implemented later)
- `js/game.js`:
  - `UPGRADES` — add `rarity` to all cards, add 6 simple cards (§3), add 7 synergy cards (§4).
  - `resetPlayer()` — new `P.*` fields (armor, regen, bulletR, bulletSpd, goldMul, xpMul, spread,
    frostfire, holeNova, critHeal, glassSafe, orbShoot, overdrive, aegisNova).
  - `openLevelUp()` — rarity-weighted draw + `req` gating + evolve priority + rarity render.
  - small hooks: `hurtPlayer` (armor, aegisNova), `update` (regen), fire block (bulletR/Spd/spread),
    coin pickup (goldMul), `gainXp` (xpMul), nova loop (frostfire/holeNova), crit branch (critHeal),
    orbs loop (orbShoot), frenzy math (overdrive).
  - `RARITY` constant table.
- `styles.css`: per-tier card classes + SYNERGY badge.

## 6. Out of scope (explicitly NOT in this plan)
- No per-pickup magnitude rolling (user chose appearance-only).
- No Luck stat / draw-odds modifier card.
- No new hidden auto-combos beyond existing Frostfire (which Frostfire Core now formalizes).
- No reroll/banish UI.

## 7. Verification (when implemented)
Reuse the throwaway `__test_harness.html` approach: grant cards to satisfy each synergy's `req`,
confirm the synergy card becomes drawable, and run `update()` frames to confirm no throws across
all new hooks. Then a playtest pass for draw-rate feel.
