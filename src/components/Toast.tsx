"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const TOAST_EXIT_MS = 200;

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
    }
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
    }

    setMessage(msg);
    requestAnimationFrame(() => setVisible(true));

    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      exitTimerRef.current = window.setTimeout(() => {
        setMessage(null);
      }, TOAST_EXIT_MS);
    }, 2200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message !== null ? (
        <div
          role="status"
          className="pointer-events-none fixed inset-x-0 bottom-[calc(3.5rem+var(--safe-bottom)+0.75rem)] z-50 flex justify-center px-4"
        >
          <div
            className="rounded-full bg-stone-900/90 px-4 py-2 text-sm text-white shadow-lg motion-reduce:transition-none"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transition: `opacity var(--duration-ui) var(--ease-out), transform var(--duration-ui) var(--ease-out)`,
            }}
          >
            {message}
          </div>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
