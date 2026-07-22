# 002 — Bottom sheet enter/exit (Fridge + Wishes)

- **Status**: TODO
- **Commit**: f939258
- **Severity**: HIGH
- **Category**: Missed opportunities / Physicality
- **Estimated scope**: 2 files (or 1 shared component + 2 call sites)

## Problem

Bottom sheets mount/unmount instantly with no spatial story:

- `src/components/FridgePage.tsx:191-229` — `{sheetOpen ? <motionless overlay+panel> : null}`
- `src/components/WishesPage.tsx:139-177` — identical pattern

Users see a hard cut when adding fridge items or wishes. Frequency: **Occasional** (eligible per motion-standards).

## Target

- Backdrop: `opacity` 0 → 1 over `var(--duration-sheet)` with `var(--ease-out)`.
- Panel: `translateY(100%)` → `translateY(0)` with `var(--ease-drawer)` over `var(--duration-sheet)`.
- Never `scale(0)`; panel slides from bottom edge (percentage translate).
- Use CSS **transitions** (interruptible), not keyframes.
- Keep panel mounted during exit (~`var(--duration-sheet)`) before unmounting.

Pattern (panel inner):

```tsx
className="... transition-[transform,opacity] motion-reduce:transition-none"
style={{
  transform: visible ? "translateY(0)" : "translateY(100%)",
  transitionDuration: "var(--duration-sheet)",
  transitionTimingFunction: "var(--ease-drawer)",
}}
```

Backdrop:

```tsx
style={{
  opacity: visible ? 1 : 0,
  transition: `opacity var(--duration-ui) var(--ease-out)`,
}}
```

Use local state: `sheetOpen` (logical) + `sheetVisible` (animated). On open: set both true. On close: set `sheetVisible` false, `setTimeout` unmount after 320ms.

## Repo conventions to follow

- Sheet markup: rounded-t-3xl, handle bar, safe-area padding — keep structure from `FridgePage.tsx:193-196`.
- Requires plan **001** tokens in `globals.css`.

## Steps

1. **Optional but recommended:** Extract `BottomSheet` component in `src/components/BottomSheet.tsx` with props `open`, `onClose`, `title`, `children` — copy structure from FridgePage sheet.
2. In sheet component: implement `sheetVisible` + delayed unmount pattern above.
3. Replace inline sheet in `FridgePage.tsx:191-229` with `<BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="添加食材">...</BottomSheet>`.
4. Replace inline sheet in `WishesPage.tsx:139-177` similarly.
5. Add `onClick` on backdrop to call `onClose` (if not already).
6. Sheet buttons (`取消`/`添加`): add `active:scale-[0.97] transition-transform` with `duration: var(--duration-press)` and `timingFunction: var(--ease-out)`.

## Boundaries

- Do NOT add drag-to-dismiss or springs in v1 (no motion library).
- Do NOT animate tab switches or list items in this plan.

## Verification

- **Mechanical**: `npm run build`; open fridge → 添加 → sheet slides up; cancel slides down.
- **Feel check**: DevTools Animations 10% — panel moves from bottom, backdrop fades; no pop-from-center.
- **prefers-reduced-motion**: sheet appears instantly (0ms tokens from plan 001).
- **Done when**: Both Fridge and Wishes sheets share smooth enter/exit.
