# World 4 — GELATO GLACIER

Date: 2026-06-14
Status: built (PR)

Fourth bespoke world, replacing the `SUNNY SANDS` placeholder at `WORLDS[3]`. Follows the
Citrus Coast / Foresta Frutosa template: a dedicated roster, original per-phase boss movesets,
new ability cards, and house-style vector sprites. Theme: a **frozen-dessert** world (mint-cream
palette) — distinct from the blue `FROSTBITE` placeholder that still sits at W5.

Per the worlds-expansion rulebook (PLAN.md §11), the cast is built from **real, lesser-known OG
Italian Brainrot** characters (researched via web/image search before drawing) that were not
already used, kept kid-friendly. Two fodder slots are house-created frozen-dessert hybrids in the
same naming style (flagged below) to round the roster to 8.

## World data (`WORLDS[3]`)
- `id:'glacier'`, name `GELATO GLACIER`, **band 2**, 20 waves, map **3000×2800**.
- Mint-cream theme (`tile1 #e2f6ef`, `tint #e0fff5`), no enemy tint (dedicated sprites).

## Enemies — `FOES_W4` (8)
| Tier | spr | Name | Role | Source |
|------|-----|------|------|--------|
| I | gelatogattino | Gelato Gattino | fast fodder chaser | OG canon |
| I | pinguinocaramelino | Pinguino Caramelino | fodder chaser | OG canon |
| I | trulimero | Trulimero Trulicina | fast erratic fodder | OG canon |
| II | americanopenguino | Americano Penguino | dasher | OG canon |
| II | ghiacciolospaziale | Ghiacciolo Spaziale | light shooter (icicle, n:1) | OG canon |
| III | frullifrulla | Frulli Frulla | mobile caster (dash + n:2) | OG canon |
| IV | sorbettoleonino | Sorbetto Leonino | armored heavy: front + cold slow-zone + death ring | house |
| V | granitagabbiano | Granita Gabbiano | elite support (heals nearby) + frost lob | house |

Specials kept few/gentle (band 2): one dasher, one light shooter, one caster, one armored tank,
one support — no bullet-hell (reserved for W7–10).

## Bosses — `BOSSES_W4` (4), original movesets (telegraphed melee/zone, forgiving)
- **W5 · Tiramisubmarini** (coffee sub-train): `TORPEDO_DASH`, `DEPTH_CHARGE`, `STEAM_RING`, `BUBBLE_VOLLEY`.
- **W10 · Frigo Camello** (ice-fridge camel): `FROST_CONE` (slow cone), `ICE_FAN`, `BODY_SLAM` (quake), `ICE_SUMMON`.
- **W15 · Il Mago Tiramisù** (tiramisu frost-wizard): `FROST_BOLTS` (splitting), `HEX_FIELD`, `ARCANE_RING`, `CONJURE`, `ARCANE_SPIRAL`.
- **W20 · Ice Ice Bearlini Polari Orangini** (polar-bear colossus, headliner): `GLACIER_SLAM`, `ORANGE_BURST`, `AVALANCHE_CHARGE` (kb dash), `PERMA_RING`, `FROST_SPIRAL`.

Each boss is `phased:true` with distinct phase-2 / phase-3 move pools (`bossMoves`); moves reuse
the proven primitives (`mAimed`/`mRing`/`mRingGap`/`addZone`/`geyserLine`/storm/dash) with new
themed names + colors (`MOVE_COL`).

## Ability cards (gated `minWorld:3`)
- **Permafrost** (passive, uncommon, ×5): hits chill enemies → 0.55× move speed (`P.chillHit`, sets `e.chillT`).
- **Cold Blooded** (passive, uncommon, ×5): +12%/lvl damage vs chilled/frozen foes.
- **Frost Bloom** (ability → **Eternal Winter**): periodic frost field that slows + damages nearby
  foes; evolve = larger, lasting blizzard that freezes solid.
- **Glacier Heart** (synergy, req `frostbloom`+`permafrost`): frost fields freeze solid, not just slow.

New player state defaults added in `resetPlayer`; effects wired in `damageEnemy` (chill + cold-blood),
enemy update (chill slow + decrement + tint), and the player update loop (Frost Bloom timer).

## Verification
- `node --check` on all JS files (parse clean).
- Headless sprite-build harness (stubbed canvas under Node `vm`): all 146 sprites build, incl. the
  12 new ones, with no runtime errors.
- Visual: rendered all 12 sprites via Edge headless screenshot and confirmed each is recognizable,
  on-theme, and within canvas bounds.
