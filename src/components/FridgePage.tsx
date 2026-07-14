"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/Toast";
import { useIngredients } from "@/hooks/useIngredients";

/** 解析批量食材：每行一项；支持「名称」或「名称 数量」 */
function parseIngredientLines(raw: string): Array<{ name: string; quantity?: string }> {
  const lines = raw
    .split(/\n|；|;|，|,/)
    .map((s) => s.trim())
    .filter(Boolean);

  return lines.map((line) => {
    // 「番茄 2个」「牛奶 500g」「鸡蛋」
    const m = line.match(/^(.+?)\s+(\S+)$/);
    if (m && /[\d半一二两三四五六七八九十]/.test(m[2])) {
      return { name: m[1].trim(), quantity: m[2].trim() };
    }
    return { name: line };
  });
}

export function FridgePage() {
  const { items, loading, error, refresh, addMany, remove, toggleUrgent } =
    useIngredients();
  const { showToast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const hasItems = items.length > 0;

  async function handleAdd() {
    const parsed = parseIngredientLines(bulkText);
    if (parsed.length === 0) {
      showToast("请填写至少一种食材");
      return;
    }
    setSubmitting(true);
    try {
      await addMany(parsed);
      setBulkText("");
      setSheetOpen(false);
      showToast(parsed.length > 1 ? `已添加 ${parsed.length} 样食材` : "已添加食材");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "添加失败");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      showToast("已删除");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "删除失败");
    } finally {
      setDeleteId(null);
    }
  }

  function openSheet() {
    setBulkText("");
    setSheetOpen(true);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 border-b border-[var(--border)]/60 px-4 pb-3.5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight">冰箱</h1>
            <p className="mt-0.5 text-sm text-[var(--muted)]">
              所有人共享 · 点「尽快吃」高亮提醒
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
            {hasItems ? (
              <button
                type="button"
                onClick={openSheet}
                className="inline-flex h-9 items-center gap-1 rounded-full bg-[var(--primary)] px-3.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 active:scale-[0.98]"
              >
                <span className="text-base leading-none">+</span>
                添加
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-3.5">
        {loading && items.length === 0 ? (
          <p className="py-14 text-center text-[var(--muted)]">加载中…</p>
        ) : null}
        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {!loading && items.length === 0 ? (
          <div className="flex h-full min-h-[50vh] flex-col items-center justify-center px-2 text-center text-[var(--muted)]">
            <p className="text-3xl">🥕</p>
            <p className="mt-3 text-sm">还没有食材</p>
            <p className="mt-1 text-sm">点下方按钮一次可加多样</p>
            <button
              type="button"
              onClick={openSheet}
              className="mt-6 h-12 w-full max-w-xs rounded-2xl bg-[var(--primary)] text-base font-semibold text-white shadow-md shadow-orange-200/80 active:scale-[0.99]"
            >
              + 添加食材
            </button>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {items.map((item) => (
              <li
                key={item.id}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 shadow-sm ${
                  item.urgent
                    ? "border-[var(--urgent)] bg-gradient-to-r from-orange-100 to-orange-50 shadow-[inset_4px_0_0_0_var(--urgent)]"
                    : "border-[var(--border)] bg-[var(--card)]"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-[15px] font-semibold leading-snug ${
                      item.urgent ? "text-[var(--urgent)]" : ""
                    }`}
                  >
                    {item.urgent ? (
                      <span className="mr-1" aria-hidden>
                        ⚠
                      </span>
                    ) : null}
                    {item.name}
                    {item.quantity ? (
                      <span
                        className={`ml-1.5 text-xs font-normal ${
                          item.urgent ? "text-orange-700/70" : "text-[var(--muted)]"
                        }`}
                      >
                        {item.quantity}
                      </span>
                    ) : null}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    void toggleUrgent(item.id, !item.urgent).catch((e) =>
                      showToast(
                        e instanceof Error ? e.message : "更新失败",
                      ),
                    )
                  }
                  className={`h-7 shrink-0 rounded-full px-2.5 text-xs font-semibold transition-colors active:scale-[0.98] ${
                    item.urgent
                      ? "bg-[var(--urgent)] text-white ring-2 ring-orange-300"
                      : "border border-[var(--border)] bg-white text-[var(--muted)]"
                  }`}
                >
                  {item.urgent ? "尽快吃" : "尽快吃"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(item.id)}
                  className="h-7 shrink-0 rounded-md px-1 text-xs text-red-500/80 active:bg-red-50"
                  aria-label="删除"
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {sheetOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40">
          <div
            className="mx-auto w-full max-w-lg rounded-t-3xl bg-[var(--card)] px-5 pt-5 shadow-2xl"
            style={{ paddingBottom: "calc(1.25rem + var(--safe-bottom))" }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-stone-200" />
            <h2 className="text-base font-semibold">添加食材</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              支持批量：每行一个。也可写成「番茄 2个」
            </p>
            <textarea
              autoFocus
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={6}
              placeholder={"番茄 2个\n鸡蛋 6个\n西兰花\n牛奶 1盒"}
              className="mt-3 w-full resize-none rounded-2xl border border-stone-200 bg-[var(--bg)] p-3 text-base leading-relaxed outline-none focus:border-[var(--primary)]"
            />
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="h-11 flex-1 rounded-xl border border-stone-200 text-sm font-medium"
              >
                取消
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => void handleAdd()}
                className="h-11 flex-1 rounded-xl bg-[var(--primary)] text-sm font-semibold text-white disabled:opacity-60"
              >
                {submitting ? "添加中…" : "添加"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="删除食材？"
        message="删除后所有人都看不到这条记录。"
        confirmText="删除"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
