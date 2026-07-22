# 003 — Confirm dialog enter/exit

- **Status**: TODO
- **Commit**: f939258
- **Severity**: HIGH
- **Category**: Missed opportunities / Physicality
- **Estimated scope**: 1 file

## Problem

`src/components/ConfirmDialog.tsx:22` — `if (!open) return null` prevents exit animation.

Dialog used for delete confirmations (`FridgePage.tsx:231`, `MenuPage.tsx:287`). Frequency: **Occasional**. Modal is **centered on sm** — `transform-origin: center` is correct (motion-standards exempt).

Buttons at `ConfirmDialog.tsx:34-47` have no press feedback.

## Target

- Remove early return; use `open` + `visible` state with exit delay `var(--duration-ui)` (200ms).
- Backdrop: opacity transition `var(--duration-ui)` `var(--ease-out)`.
- Panel: `opacity: 0; transform: scale(0.97)` → `opacity: 1; transform: scale(1)` — **never scale(0)**.
- `transform-origin: center` on panel.
- Cancel/confirm buttons: `active:scale-[0.97]` + `transition: transform var(--duration-press) var(--ease-out)`.

## Repo conventions to follow

- Dialog layout: `fixed inset-0`, `items-end sm:items-center`, `max-w-sm rounded-2xl` — keep `ConfirmDialog.tsx:25-29`.
- Plan **001** tokens required.

## Steps

1. Refactor `ConfirmDialog.tsx`:
   - Add `useEffect` syncing `visible` from `open` (on open: visible true; on close: visible false then unmount after 200ms if using conditional render, or keep in DOM with `pointer-events-none` when closed).
   - Simpler approach: always render when `open || visible`, backdrop/panel styles driven by `visible`.
2. Apply backdrop opacity transition on outer `div` line 25.
3. Apply panel opacity + scale on inner `motion` div line 26-29.
4. Add press classes to both buttons lines 34-47.
5. Add `onClick` on backdrop (outer div) to call `onCancel` — optional UX improvement.

## Boundaries

- Do NOT change dialog copy or confirm/cancel API.
- Do NOT add focus trap changes beyond current behavior.

## Verification

- **Mechanical**: Trigger delete on fridge item → dialog fades/scales in; cancel → animates out.
- **Feel check**: Panel scales from 0.97 not 0; backdrop and panel sync within 200ms.
- **Done when**: ConfirmDialog enter/exit smooth; buttons have press scale.
