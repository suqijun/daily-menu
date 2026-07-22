"use client";

import { useEffect, useState } from "react";

/** Mount/unmount overlay with enter/exit timing; state updates run in rAF/timeouts only. */
export function useOverlayMotion(open: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      let exitTimer: number | undefined;
      const frame = requestAnimationFrame(() => {
        setMounted(true);
        requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(frame);
        if (exitTimer !== undefined) window.clearTimeout(exitTimer);
      };
    }

    let exitTimer: number | undefined;
    const frame = requestAnimationFrame(() => {
      setVisible(false);
      exitTimer = window.setTimeout(() => setMounted(false), exitMs);
    });

    return () => {
      cancelAnimationFrame(frame);
      if (exitTimer !== undefined) window.clearTimeout(exitTimer);
    };
  }, [open, exitMs]);

  return { mounted, visible };
}
