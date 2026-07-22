# 009 — Unify `border-stone-200` to design tokens

- **Status**: TODO
- **Commit**: f939258
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens (AUDIT §7) + Component (§9)
- **Estimated scope**: 3 files

## Problem

Sheets and dialog use hardcoded `border-stone-200` while the rest of the app uses `border-[var(--border)]` (orange-tinted theme).

| Location | Current |
| --- | --- |
| `FridgePage.tsx:208,214` | textarea + cancel button `border-stone-200` |
| `WishesPage.tsx:156,162` | same |
| `ConfirmDialog.tsx:37` | cancel button `border-stone-200` |

Menu textarea already correct: `border-[var(--border)]` at `MenuPage.tsx:262`.

Mixed borders make warm-theme surfaces look slightly gray on sheets/dialogs.

## Target

Replace `border-stone-200` with `border-[var(--border)]` in all locations above.

Sheet handle bar `bg-stone-200` (Fridge/Wishes) — optional: leave as neutral chrome or use `bg-[var(--border)]/40`; **out of scope** unless you touch handle in same PR.

## Steps

1. `FridgePage.tsx`: sheet textarea + cancel button borders.
2. `WishesPage.tsx`: same.
3. `ConfirmDialog.tsx:37`: cancel button border.

## Boundaries

- Do not change `bg-stone-900` on Menu save button (intentional primary-dark tier).

## Verification

- Open sheet and confirm dialog — borders match menu textarea orange-tint border.
- `npm run build`.
