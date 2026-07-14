"use client";

import { useState } from "react";
import { BottomNav, type TabId } from "@/components/BottomNav";
import { ChromeProvider, useChrome } from "@/components/ChromeContext";
import { FridgePage } from "@/components/FridgePage";
import { MenuPage } from "@/components/MenuPage";
import { ToastProvider } from "@/components/Toast";
import { WishesPage } from "@/components/WishesPage";

function ShellInner() {
  const [tab, setTab] = useState<TabId>("fridge");
  const { immersive } = useChrome();

  return (
    <div
      className={`mx-auto flex w-full max-w-lg flex-col overflow-hidden bg-[var(--bg)] ${
        immersive
          ? "h-[var(--app-height,100dvh)]"
          : "h-dvh pt-[var(--safe-top)]"
      }`}
      style={
        immersive
          ? { height: "var(--app-height, 100dvh)" }
          : undefined
      }
    >
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {tab === "fridge" ? <FridgePage /> : null}
        {tab === "wishes" ? <WishesPage /> : null}
        {tab === "menu" ? <MenuPage /> : null}
      </main>
      {!immersive ? <BottomNav active={tab} onChange={setTab} /> : null}
    </div>
  );
}

export function AppShell() {
  return (
    <ToastProvider>
      <ChromeProvider>
        <ShellInner />
      </ChromeProvider>
    </ToastProvider>
  );
}
