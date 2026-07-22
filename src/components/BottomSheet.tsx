"use client";

import { type ReactNode } from "react";
import { useOverlayMotion } from "@/hooks/useOverlayMotion";

const SHEET_EXIT_MS = 320;

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: BottomSheetProps) {
  const { mounted, visible } = useOverlayMotion(open, SHEET_EXIT_MS);

  if (!mounted) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-end"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
        transition: `background-color var(--duration-ui) var(--ease-out)`,
      }}
      onClick={onClose}
    >
      <div
        className="mx-auto w-full max-w-lg rounded-t-3xl bg-[var(--card)] px-5 pt-5 shadow-2xl transition-[transform] motion-reduce:transition-none"
        style={{
          paddingBottom: "calc(1.25rem + var(--safe-bottom))",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transitionDuration: "var(--duration-sheet)",
          transitionTimingFunction: "var(--ease-drawer)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-stone-200" />
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
        {children}
        {footer}
      </div>
    </div>
  );
}
