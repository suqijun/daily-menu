# 007 — Align Wishes list row to Fridge list spec

- **Status**: TODO
- **Commit**: f939258
- **Severity**: MEDIUM
- **Category**: Component & layout cohesion (AUDIT §9)
- **Estimated scope**: 1 file (`WishesPage.tsx`)

## Problem

Parallel list tabs use different row density. Switching 冰箱 ↔ 想吃 changes card size and spacing — a cohesion finding that the motion-only P1 audit missed.

**Fridge (exemplar)** — `src/components/FridgePage.tsx:127-135`:

```tsx
<ul className="space-y-1.5">
  <li className="flex items-center gap-2 rounded-xl border px-3 py-2 shadow-sm ...">
    <p className="truncate text-[15px] font-semibold leading-snug">
```

**Wishes (divergent)** — `src/components/WishesPage.tsx:117-124`:

```tsx
<ul className="space-y-2.5">
  <li className="flex items-center justify-between gap-3 rounded-2xl border ... p-3.5 shadow-sm">
    <p className="min-w-0 flex-1 truncate text-base font-semibold">
```

Delete button: Fridge `h-7 text-xs` vs Wishes `h-9 text-sm` (`WishesPage.tsx:126-132`).

## Target

Align Wishes list to Fridge row spec (Fridge is denser and matches utility-list personality):

| Property | Target (from Fridge) |
| --- | --- |
| List gap | `space-y-1.5` |
| Row | `flex items-center gap-2 rounded-xl border px-3 py-2 shadow-sm` |
| Title | `truncate text-[15px] font-semibold leading-snug` |
| Delete | `h-7 shrink-0 rounded-md px-1 text-xs text-red-500/80 active:bg-red-50` |

Keep Wishes-specific border/bg (no urgent state). Use `gap-2` + `items-center` like Fridge.

## Repo conventions

- Exemplar: `FridgePage.tsx:127-184`
- Bar: `~/.cursor/skills/design-standards/COMPONENT.md` — Cross-surface consistency

## Steps

1. In `WishesPage.tsx`, change `ul` to `className="space-y-1.5"`.
2. Update `li` classes to match Fridge row padding/radius/gap (keep `border-[var(--border)] bg-[var(--card)]`).
3. Update dish name `p` to `text-[15px] font-semibold leading-snug` (keep `truncate min-w-0 flex-1`).
4. Shrink delete button to Fridge delete spec (`h-7`, `text-xs`, `rounded-md`, `px-1`).
5. Add `aria-label="删除"` on delete button (Fridge has it at `FridgePage.tsx:181`; Wishes missing at `:129`).
6. Visual check: switch tabs — lists should feel same density.

## Boundaries

- Do not change FridgePage in this plan.
- Do not add list enter/exit animation (high-frequency list).

## Verification

- **Mechanical**: `npm run build`
- **Feel check**: Toggle 冰箱 / 想吃 with sample data — row height and corner radius match.
- **Done when**: Wishes list matches Fridge list spec per table above.
