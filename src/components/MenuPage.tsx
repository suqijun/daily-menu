"use client";

import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useChrome } from "@/components/ChromeContext";
import { useToast } from "@/components/Toast";
import { useDailyMenu } from "@/hooks/useDailyMenu";
import { useIngredients } from "@/hooks/useIngredients";
import { useWishes } from "@/hooks/useWishes";
import { formatDisplayDate } from "@/lib/date";

function useAppHeight() {
  useEffect(() => {
    const sync = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${h}px`);
    };
    sync();
    window.visualViewport?.addEventListener("resize", sync);
    window.visualViewport?.addEventListener("scroll", sync);
    window.addEventListener("resize", sync);
    return () => {
      window.visualViewport?.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);
}

export function MenuPage() {
  const { menu, loading, error, refresh, save } = useDailyMenu();
  const { items: ingredients } = useIngredients();
  const { items: wishes } = useWishes();
  const { showToast } = useToast();
  const { immersive, setImmersive } = useChrome();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);

  useAppHeight();

  useEffect(() => {
    setContent(menu?.content ?? "");
  }, [menu?.content]);

  useEffect(() => {
    return () => setImmersive(false);
  }, [setImmersive]);

  const hasMenu = Boolean(content.trim());
  const isDirty = useMemo(
    () => content.trim() !== (menu?.content ?? "").trim(),
    [content, menu?.content],
  );

  const menuView = useMemo(() => {
    if (generating) return "generating" as const;
    if (loading && !menu) return "loading" as const;
    if (!hasMenu && !loading) return "empty" as const;
    if (hasMenu) return "editor" as const;
    return "loading" as const;
  }, [generating, loading, menu, hasMenu]);

  async function handleSave() {
    if (!content.trim()) {
      showToast("菜单内容不能为空");
      return;
    }
    if (!isDirty) {
      showToast("没有需要保存的修改");
      return;
    }
    setSaving(true);
    try {
      await save(content);
      showToast("菜单已保存");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      showToast("已复制到剪贴板");
    } catch {
      showToast("复制失败，请长按文本手动复制");
    }
  }

  async function runGenerate() {
    if (ingredients.length === 0) {
      showToast("先添加一些食材吧");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/generate-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ingredients.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            urgent: i.urgent,
          })),
          wishes: wishes.map((w) => ({ dish_name: w.dish_name })),
        }),
      });

      const data = (await res.json()) as { content?: string; error?: string };
      if (!res.ok || !data.content) {
        throw new Error(data.error || "生成失败，请稍后重试");
      }

      setContent(data.content);
      await save(data.content, { markGenerated: true });
      showToast("今日菜单已生成");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "生成失败，请稍后重试");
    } finally {
      setGenerating(false);
    }
  }

  function handleFirstGenerate() {
    if (generating) return;
    if (ingredients.length === 0) {
      showToast("先添加一些食材吧");
      return;
    }
    void runGenerate();
  }

  function enterEdit() {
    setImmersive(true);
  }

  function exitEdit() {
    setImmersive(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  // —— 编辑专注模式：只显示编辑框 + 完成 ——
  if (immersive && hasMenu && !generating) {
    return (
      <div
        className="flex h-full min-h-0 flex-col bg-[var(--bg)]"
        style={{ height: "var(--app-height, 100dvh)" }}
      >
        <div
          className="flex shrink-0 items-center justify-between px-4 pb-2"
          style={{ paddingTop: "max(0.75rem, var(--safe-top))" }}
        >
          <span className="text-sm text-[var(--muted)]">编辑菜单</span>
          <button
            type="button"
            onClick={exitEdit}
            className="pressable h-9 rounded-full bg-[var(--primary)] px-4 text-sm font-semibold text-white"
          >
            完成
          </button>
        </div>
        <div className="min-h-0 flex-1 px-3 pb-3">
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            aria-label="今日菜单"
            className="h-full w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 text-sm leading-relaxed outline-none focus:border-[var(--primary)]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 border-b border-[var(--border)]/60 px-4 pb-3.5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight">菜单</h1>
            <p className="mt-0.5 text-sm text-[var(--muted)]">
              {formatDisplayDate()}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => void refresh()}
              className="h-9 rounded-full px-2.5 text-sm text-[var(--muted)] active:bg-black/5"
            >
              刷新
            </button>
            {hasMenu && !generating ? (
              <button
                type="button"
                onClick={() => setConfirmRegen(true)}
                className="h-9 rounded-full px-3 text-sm font-medium text-[var(--primary)] active:bg-orange-50"
              >
                重新生成
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-4 pb-4 pt-1">
        {error ? (
          <p className="shrink-0 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {menuView === "loading" ? (
          <p
            key="loading"
            className="menu-state-enter py-14 text-center text-[var(--muted)]"
          >
            加载中…
          </p>
        ) : null}

        {menuView === "generating" ? (
          <div
            key="generating"
            className="menu-state-enter flex min-h-0 flex-1 flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 text-center"
          >
            <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-orange-200 border-t-[var(--primary)]" />
            <p className="mt-4 text-base font-medium">正在为你搭配菜单…</p>
            <p className="mt-1.5 text-sm text-[var(--muted)]">
              大约需要十几秒，请稍候
            </p>
          </div>
        ) : null}

        {menuView === "empty" ? (
          <div
            key="empty"
            className="menu-state-enter flex min-h-0 flex-1 flex-col items-center justify-center px-2 text-center"
          >
            <p className="text-3xl">🍽</p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              冰箱{" "}
              <span className="font-semibold text-[var(--fg)]">
                {ingredients.length}
              </span>{" "}
              样 · 想吃{" "}
              <span className="font-semibold text-[var(--fg)]">
                {wishes.length}
              </span>{" "}
              道
            </p>
            <p className="mt-1.5 max-w-xs text-sm text-[var(--muted)]">
              根据现有食材，生成适合食量小的一人份早中晚
            </p>
            <button
              type="button"
              onClick={handleFirstGenerate}
              className="pressable mt-6 h-12 w-full max-w-xs rounded-2xl bg-[var(--primary)] text-base font-semibold text-white shadow-md shadow-orange-200/80"
            >
              ✨ AI 生成今日菜单
            </button>
          </div>
        ) : null}

        {menuView === "editor" ? (
          <div key="editor" className="menu-state-enter flex min-h-0 flex-1 flex-col gap-4">
            <div className="min-h-0 flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={enterEdit}
                aria-label="今日菜单"
                className="h-full w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 text-sm leading-relaxed outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={saving || !isDirty}
                onClick={() => void handleSave()}
                className="pressable h-11 rounded-xl bg-stone-900 text-sm font-semibold text-white disabled:opacity-40"
              >
                {saving ? "保存中…" : isDirty ? "保存修改" : "已保存"}
              </button>
              <button
                type="button"
                onClick={() => void handleCopy()}
                className="pressable h-11 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm font-semibold"
              >
                复制菜单
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmRegen}
        title="重新生成？"
        message="当前菜单会被覆盖。需要的话可先点「复制菜单」备份。"
        confirmText="重新生成"
        cancelText="取消"
        onCancel={() => setConfirmRegen(false)}
        onConfirm={() => {
          setConfirmRegen(false);
          void runGenerate();
        }}
      />
    </div>
  );
}
