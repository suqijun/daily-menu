"use client";

type TabId = "fridge" | "wishes" | "menu";

const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: "fridge", label: "冰箱", icon: "🧊" },
  { id: "wishes", label: "想吃", icon: "❤️" },
  { id: "menu", label: "菜单", icon: "🍽" },
];

type BottomNavProps = {
  active: TabId;
  onChange: (tab: TabId) => void;
};

export type { TabId };

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="shrink-0 border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <div className="mx-auto flex h-14 max-w-lg">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors ${
                isActive
                  ? "font-semibold text-[var(--primary)]"
                  : "text-[var(--muted)]"
              }`}
            >
              <span className="text-lg leading-none" aria-hidden>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
