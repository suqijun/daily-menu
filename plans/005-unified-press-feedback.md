# 005 — Unified press feedback on buttons

- **Status**: TODO
- **Commit**: f939258
- **Severity**: MEDIUM
- **Category**: Physicality / Feedback gaps
- **Estimated scope**: 4–5 files

## Problem

Many buttons use `active:scale-[0.98]` or `active:scale-[0.99]` **without** `transition-transform`, so press feedback snaps:

- `MenuPage.tsx:247,271,278` — scale without transition
- `ConfirmDialog.tsx:34-47` — no active state (fixed in plan 003)
- `FridgePage.tsx:211-217` — sheet cancel/submit no press feedback
- `BottomNav.tsx:28-36` — **no** scale (only `transition-colors`) — acceptable for tens/day; optional subtle scale 0.98 max

Only `FridgePage.tsx:169` correctly combines `transition-colors` + `active:scale`.

motion-standards: press feedback `scale(0.97)`, `transition: transform 160ms ease-out` → use `var(--duration-press)` and `var(--ease-out)`.

## Target

Shared Tailwind pattern for primary/secondary pressable buttons:

```
active:scale-[0.97] transition-transform motion-reduce:transition-none
style={{ transitionDuration: 'var(--duration-press)', transitionTimingFunction: 'var(--ease-out)' }}
```

Or add to `globals.css`:

```css
.pressable {
  transition: transform var(--duration-press) var(--ease-out);
}
.pressable:active {
  transform: scale(0.97);
}
@media (prefers-reduced-motion: reduce) {
  .pressable:active { transform: none; }
}
```

Apply `.pressable` to CTAs across pages (not bottom nav tabs — tens/day, color-only is enough).

## Steps

1. Add `.pressable` utility to `globals.css` (after plan 001).
2. Add `pressable` class to primary CTAs in `MenuPage.tsx` (generate, save, copy buttons).
3. Add to sheet action buttons in Fridge/Wishes (or `BottomSheet` from plan 002).
4. Add to ghost buttons that already use `active:bg-*` where press scale helps (refresh buttons optional — tens/day, skip or use 0.98 very fast).
5. Remove redundant conflicting `active:scale-[0.99]` where `.pressable` applies.

## Boundaries

- Do NOT add press scale to bottom nav tab buttons (tens/day — color transition only).
- Do NOT add hover animations (mobile-first app).

## Verification

- **Feel check**: Press「AI 生成今日菜单」— scale animates over 160ms, not instant snap.
- **Done when**: All occasional-action primary buttons share consistent press transition.
