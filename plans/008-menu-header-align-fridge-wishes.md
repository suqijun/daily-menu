# 008 — Align Menu page header with Fridge/Wishes

- **Status**: TODO
- **Commit**: f939258
- **Severity**: LOW
- **Category**: Component & layout cohesion (AUDIT §9)
- **Estimated scope**: 1 file (`MenuPage.tsx`)

## Problem

Fridge and Wishes share the same header chrome; Menu does not.

| Page | Header classes |
| --- | --- |
| Fridge / Wishes | `shrink-0 border-b border-[var(--border)]/60 px-4 pb-3.5 pt-4` |
| Menu | `shrink-0 px-4 pb-3 pt-4` — **no bottom border**, `pb-3` not `pb-3.5` |

`MenuPage.tsx:177` — switching to 菜单 tab loses the subtle header divider; content feels less anchored.

## Target

```tsx
<header className="shrink-0 border-b border-[var(--border)]/60 px-4 pb-3.5 pt-4">
```

Match Fridge `FridgePage.tsx:74` exactly.

## Steps

1. Update `MenuPage.tsx` line 177 header `className` as above.

## Boundaries

- Do not change Menu-specific subtitle or actions.

## Verification

- Toggle 冰箱 / 想吃 / 菜单 — header bottom border and padding feel identical on all three tabs.
