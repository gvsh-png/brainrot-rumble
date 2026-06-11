# Boss Rework + Card/Ability/Synergy System

Date: 2026-06-11
Status: approved, implementing

## Part 1 — Boss attack-cycle rework

### Problem
Every boss runs two attack layers at once: a per-boss "gimmick" (zones/dash/pull)
AND a continuous bullet `pattern` (spiral/rings/chaos) that never stops. Result:
- **Sahur** (`chaos`) fires a 5-bullet aimed spread every 0.5s + ground-slam every
  1.5s — relentless, no openings.
- **Vaca** has only a gentle pull + dodgeable ring — weak, no phases.

### Solution: telegraphed move cycle
Replace continuous fire with a per-boss state machine in `updateBoss`:

```
recover (no attacks, drift)  ->  wind (telegraph + sfx.warn)  ->  fire (one finite burst)  ->  recover
```

State fields (init in `spawnBoss`): `mst:'recover'`, `mt:<recoverTime>`, `mv:null`.
- recover: ~1.1s (x0.65 enraged) — the missing breathing room.
- wind: ~0.5s — pulsing colored charge-ring drawn around boss + `sfx.warn()`.
- fire: run one move from the boss's pool, then back to recover.

### Move primitives (finite bursts, reuse existing helpers)
- `mRing(e,n,spd,col)` — one ring volley (was `rings` pattern).
- `mAimed(e,n,spread,spd,col)` — one aimed spread (was part of `chaos`).
- `mSpiral(e,dur)` — sustained spiral: during fire, emit 2 bullets every ~0.1s for `dur`.
- `mSlam(e)` — telegraphed ground zone at player (Sahur).
- `mCarpet(e)` — 3 red telegraphed zones (Crocodilo).
- `mDash(e)` — existing dash (keeps its red-line tell).
- `mSeedRing(e)` — zone + seed bullet ring (Gorillo).
- `mPull(e,strength)` — gravity tug (Vaca).

### Per-boss move pools (5 non-Vaca, pacing only — global enrage at 40% shortens recover)
- Tralalero: dash, short spiral, 3-aimed
- Crocodilo: carpet-bomb, 16-ring
- Sahur: slam, 5-aimed, double-slam  (now discrete -> no longer endless)
- Gorillo: seed-ring smash, 5-aimed, 12-ring
- Trippi: spiral, ring, aimed (random pick + color glitch)

### La Vaca Saturno — 3 HP-gated phases
Phase index from hp%: P1 >=66%, P2 >=33%, P3 <33%. On phase up: `bigText('PHASE n')`,
clear enemy bullets, 0.6s boss invuln, shake.
- **P1 Rings of Saturn**: gentle pull, 16-ring.
- **P2 Ring Lash**: + spiral sweep + 5-aimed; stronger pull; rings as inner+outer pair.
- **P3 Saturn Collapse**: dense double-ring (20x2) + sustained pull + spiral, short recovery.

## Part 2 — Card / Ability / Synergy system

### 2.1 Omni-Barrage 360 fix
`game.js` fire block currently does `if(P.radial){ ring } else { aimed }` — ring REPLACES
aimed fire, so vs a lone boss most bullets miss. Change to: ALWAYS fire aimed shots; if
`P.radial`, ALSO fire a ring. Ring bullets carry `dmgMul:0.6` (new per-bullet field used in
the collision damage calc) so crowd-clear stays fair while bosses still take full aimed DPS.

### 2.2 New synergy passives
- **Killer Instinct** (`critdmg`, cap5): +0.5x crit multiplier per level. New `P.critMul`
  (default 3) used in bullet damage. Synergy: Critical Strike (crit chance).
- **Glass Cannon** (`glass`, cap3): +35% damage, -15 max HP per level. Synergy: any sustain
  (Soul Harvest / Aegis / Phoenix).
- **Killing Frenzy** (`frenzy`, cap5): each kill adds a decaying stack; stacks boost fire
  rate + damage (`P.frenzy`, decays over ~2.5s). Synergy: Soul Harvest, crit.

### 2.3 New ultimate abilities (4 levels + evolve)
- **Aegis Bubble** (`aegis`): recharging shield. `P.shield`/`P.shieldMax`/`P.shieldCd`.
  In `hurtPlayer`, a charge blocks a hit instead of taking damage (visual pop). Levels:
  gain charge + faster recharge + more charges. Evolve **Aegis Fortress**: block emits a
  damaging bullet-clearing shockwave + permanent 15% damage reduction.
- **Black Hole** (`blackhole`): periodically spawns a hole (new `holes[]` array) that pulls
  enemies inward and deals DoT. Levels: shorter cd, bigger, more dmg. Evolve **Singularity**:
  also vacuums enemy bullets, stronger.
- **Phoenix** (`phoenix`): revive-on-death. Intercept `if(P.hp<=0)` in `hurtPlayer`: if a
  charge is ready, revive at 50% HP with 2s i-frames + AoE nuke clearing bullets; long
  recharge. Levels: heal more, faster recharge, burn aura. Evolve **Eternal Phoenix**:
  full-HP revive, huge nuke, permanent burn aura, faster recharge.

### 2.4 Explicit synergy: Frostfire
If player has both `freeze` and `nova`, Nova deals bonus damage to frozen enemies (shatter).

## Verification
Load error-free in headless Edge; drive into a boss wave to confirm telegraph cadence and
that abilities tick. Tune densities/timings in a playtest pass.
