"use client";

import { useOverlayMotion } from "@/hooks/useOverlayMotion";

const DIALOG_EXIT_MS = 200;

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "确认",
  cancelText = "取消",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { mounted, visible } = useOverlayMotion(open, DIALOG_EXIT_MS);

  if (!mounted) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
        transition: `background-color var(--duration-ui) var(--ease-out)`,
      }}
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl bg-[var(--card)] p-5 shadow-xl transition-[transform,opacity] motion-reduce:transition-none"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.97)",
          transformOrigin: "center",
          transitionDuration: "var(--duration-ui)",
          transitionTimingFunction: "var(--ease-out)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{message}</p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="pressable h-11 flex-1 rounded-xl border border-[var(--border)] text-sm font-medium"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="pressable h-11 flex-1 rounded-xl bg-[var(--urgent)] text-sm font-semibold text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
