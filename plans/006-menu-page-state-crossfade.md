# 006 — Menu page state crossfade

- **Status**: TODO
- **Commit**: f939258
- **Severity**: MEDIUM
- **Category**: Missed opportunities
- **Estimated scope**: 1 file

## Problem

`MenuPage.tsx:213-284` — four mutually exclusive blocks (loading text, generating spinner, empty CTA, menu editor) swap instantly. The **generating** state (`MenuPage.tsx:217-225`) is **Occasional**; hard cut between empty ↔ spinner ↔ content feels jarring.

## Target

- Wrap each major block in a container with `transition: opacity var(--duration-ui) var(--ease-out)`.
- Use opacity crossfade only (no layout animation on `height`/`width`).
- When switching `generating` → `hasMenu`, fade out spinner panel, fade in editor over 200ms.
- Keep existing `animate-spin` on loader (constant motion → linear is fine).

Optional: single wrapper with `key={state}` and CSS:

```css
.menu-state-enter {
  animation: menuFadeIn var(--duration-ui) var(--ease-out);
}
@keyframes menuFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

Prefer **transitions** on opacity if state can be held in one parent; use `@keyframes` only if mount/unmount per block is kept.

## Steps

1. Define helper `type MenuView = 'loading' | 'generating' | 'empty' | 'editor'` derived from existing booleans.
2. Add `menuFadeIn` keyframes + class in `globals.css` OR opacity transition on wrapper divs.
3. Replace hard conditional blocks at `MenuPage.tsx:213-284` with keyed sections that fade on enter.
4. Do NOT animate the textarea content itself during typing.

## Boundaries

- Do NOT add streaming/typewriter for AI (API is non-streaming; out of scope).
- Do NOT animate on every `content` textarea change.

## Verification

- **Feel check**: Tap generate → spinner fades in; when done → menu editor fades in (no flash of empty state).
- **prefers-reduced-motion**: instant swap.
- **Done when**: State transitions use opacity bridge, not hard cuts.
