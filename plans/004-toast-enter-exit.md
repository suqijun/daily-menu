# 004 — Toast enter/exit

- **Status**: TODO
- **Commit**: f939258
- **Severity**: MEDIUM
- **Category**: Missed opportunities
- **Estimated scope**: 1 file

## Problem

`src/components/Toast.tsx:31-40` — toast mounts/unmounts instantly when `message` is set/cleared after 2200ms. Frequency: **Occasional** (feedback after save/copy). Missing spatial consistency (should enter/exit from bottom near nav).

## Target

- Enter: `opacity: 0; transform: translateY(8px)` → settled, `var(--duration-ui)` `var(--ease-out)`.
- Exit: reverse before unmount; delay unmount by `var(--duration-ui)` after clearing message.
- Animate `transform` and `opacity` only.
- `pointer-events-none` unchanged.

Implementation sketch in `ToastProvider`:

```tsx
const [message, setMessage] = useState<string | null>(null);
const [visible, setVisible] = useState(false);

const showToast = useCallback((msg: string) => {
  setMessage(msg);
  setVisible(true);
  window.clearTimeout(hideTimerRef.current);
  hideTimerRef.current = window.setTimeout(() => {
    setVisible(false);
    window.setTimeout(() => setMessage(null), 200); // match --duration-ui
  }, 2200);
}, []);
```

Inner pill styles:

```tsx
style={{
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(8px)",
  transition: `opacity var(--duration-ui) var(--ease-out), transform var(--duration-ui) var(--ease-out)`,
}}
```

## Repo conventions to follow

- Position: `bottom-[calc(3.5rem+var(--safe-bottom)+0.75rem)]` — keep `Toast.tsx:34`.
- Plan **001** tokens.

## Steps

1. Add `visible` state + `useRef` for timeout id in `Toast.tsx`.
2. Update `showToast` to toggle `visible` with exit delay before `setMessage(null)`.
3. Render when `message !== null` (not only truthy message during exit).
4. Apply transition styles on inner rounded pill `Toast.tsx:36`.

## Boundaries

- Do NOT stack multiple toasts.
- Do NOT change 2200ms display duration.

## Verification

- **Feel check**: Copy menu → toast slides up gently, fades out after 2.2s.
- **prefers-reduced-motion**: instant show/hide.
- **Done when**: Toast has enter and exit transition.
