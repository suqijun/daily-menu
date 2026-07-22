# Animation improvement plans — daily-menu

Commit baseline: `f939258`

| # | Plan | Severity | Status | Depends on |
|---|------|----------|--------|------------|
| 001 | Motion tokens in globals | HIGH | DONE | — |
| 002 | Bottom sheet enter/exit | HIGH | DONE | 001 |
| 003 | Confirm dialog enter/exit | HIGH | DONE | 001 |
| 004 | Toast enter/exit | MEDIUM | DONE | 001 |
| 005 | Unified press feedback | MEDIUM | DONE | 001 |
| 006 | Menu page state crossfade | MEDIUM | DONE | 001 |
| 007 | Align Wishes list to Fridge row spec | MEDIUM | DONE | — |
| 008 | Menu header border/padding align | LOW | DONE | — |
| 009 | Unify border-stone-200 → --border | MEDIUM | DONE | — |
| 010 | Extract BottomSheet component | MEDIUM | DONE | — |

**Recommended order:** 001 → **010** → 002 & 003 (parallel) → **007** & **008** & **009** (parallel) → 004 → 005 → 006

**Execute:** `improve-animations execute plans/NNN-*.md` or hand any plan to an agent.
