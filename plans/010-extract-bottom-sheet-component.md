# 010 — Extract shared BottomSheet component

- **Status**: TODO
- **Commit**: f939258
- **Severity**: MEDIUM
- **Category**: Component & layout cohesion (AUDIT §9)
- **Estimated scope**: 3 files (new component + 2 pages)

## Problem

Fridge and Wishes duplicate ~40 lines of identical sheet markup. Any class drift (already identical today) will recur on every edit.

- `FridgePage.tsx:191-228`
- `WishesPage.tsx:139-176`

Diff is only: title, description, placeholder, handlers. Structure/classes are the same.

## Target

Create `src/components/BottomSheet.tsx`:

```tsx
type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode; // textarea slot
  footer: React.ReactNode;   // cancel + submit row
};
```

Move shared shell:

- Overlay `fixed inset-0 z-50 flex items-end bg-black/40`
- Panel `rounded-t-3xl bg-[var(--card)] px-5 pt-5 shadow-2xl` + safe-bottom padding
- Handle bar `h-1 w-10 rounded-full bg-stone-200`

Fridge/Wishes pass textarea + footer buttons as children or props.

**Do not add enter/exit motion in this plan** — that's `002-bottom-sheet-motion.md` on top of this component.

## Steps

1. Create `BottomSheet.tsx` with props above.
2. Refactor `FridgePage` sheet block to use `<BottomSheet>`.
3. Refactor `WishesPage` sheet block similarly.
4. Ensure `onClose` wired to backdrop click (optional UX — add if missing).

## Boundaries

- No animation changes (plan 002).
- Keep `border-stone-200` or apply 009 separately — if 009 lands first, use tokens in new component.

## Verification

- Add flow works on both tabs; cancel closes sheet.
- Visual parity with pre-refactor screenshots.
