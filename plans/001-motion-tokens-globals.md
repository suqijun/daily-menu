# 001 — Add motion tokens to globals.css

- **Status**: TODO
- **Commit**: f939258
- **Severity**: HIGH
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file, ~15 lines

## Problem

`src/app/globals.css:3-14` defines color/spacing tokens only. All motion uses Tailwind defaults (weak easing, inconsistent durations). `active:scale-*` on buttons snaps instantly because there is no `--ease-out` or press duration token.

## Target

Add to `:root` in `src/app/globals.css`:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
--duration-press: 160ms;
--duration-ui: 200ms;
--duration-sheet: 320ms;
```

Add utility classes after `body { ... }`:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-press: 0ms;
    --duration-ui: 0ms;
    --duration-sheet: 0ms;
  }
}
```

## Repo conventions to follow

- Tokens live in `:root` alongside `--primary`, `--safe-bottom`, etc.
- Tailwind v4 `@theme inline` block at `globals.css:16-20` — optional: expose `--ease-out` to Tailwind later; plans 002–006 use CSS variables directly in `style` or arbitrary classes.

## Steps

1. Open `src/app/globals.css`.
2. After line 13 (`--safe-bottom`), insert the six motion variables above.
3. After the `body { ... }` block (after line 42), add the `prefers-reduced-motion` block.

## Boundaries

- Do NOT add Framer Motion or other dependencies.
- Do NOT change component files in this plan.

## Verification

- **Mechanical**: `npm run build` succeeds.
- **Feel check**: In DevTools → Rendering → `prefers-reduced-motion: reduce`, confirm `--duration-*` resolve to 0ms in computed styles on `:root`.
- **Done when**: `:root` exposes all six motion tokens and reduced-motion override exists.
