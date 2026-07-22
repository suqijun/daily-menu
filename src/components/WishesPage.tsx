"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/Toast";
import { useWishes } from "@/hooks/useWishes";

/** 解析想吃列表：按行拆分，也兼容中英文逗号/分号 */
function parseWishLines(raw: string): string[] {
  return raw
    .split(/\n|；|;|，|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function WishesPage() {
  const { items, loading, error, refresh, addMany, remove } = useWishes();
  const { showToast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const hasItems = items.length > 0;

  async function handleAdd() {
    const names = parseWishLines(bulkText);
    if (names.length === 0) {
      showToast("请填写至少一道想吃的");
      return;
    }
    setSubmitting(true);
    try {
      await addMany(names);
      setBulkText("");
      setSheetOpen(false);
      showToast(names.length > 1 ? `已添加 ${names.length} 道` : "已点菜");
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
            <h1 className="text-xl font-bold tracking-tight">想吃</h1>
            <p className="mt-0.5 text-sm text-[var(--muted)]">
              点点菜，生成菜单时会尽量参考
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
                className="pressable inline-flex h-9 items-center gap-1 rounded-full bg-[var(--primary)] px-3.5 text-sm font-semibold text-white shadow-sm shadow-orange-200"
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
            <p className="text-3xl">🍜</p>
            <p className="mt-3 text-sm">还没有想吃的</p>
            <p className="mt-1 text-sm">点下方按钮可一次点多道</p>
            <button
              type="button"
              onClick={openSheet}
              className="pressable mt-6 h-12 w-full max-w-xs rounded-2xl bg-[var(--primary)] text-base font-semibold text-white shadow-md shadow-orange-200/80"
            >
              + 想吃什么
            </button>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-sm"
              >
                <p className="min-w-0 flex-1 truncate text-[15px] font-semibold leading-snug">
                  {item.dish_name}
                </p>
                <button
                  type="button"
                  onClick={() => setDeleteId(item.id)}
                  className="pressable h-7 shrink-0 rounded-md px-1 text-xs text-red-500/80 active:bg-red-50"
                  aria-label="删除"
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="想吃什么"
        description="支持批量：每行一道，也可用逗号分隔"
        footer={
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="pressable h-11 flex-1 rounded-xl border border-[var(--border)] text-sm font-medium"
            >
              取消
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleAdd()}
              className="pressable h-11 flex-1 rounded-xl bg-[var(--primary)] text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? "添加中…" : "添加"}
            </button>
          </div>
        }
      >
        <textarea
          autoFocus
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          rows={6}
          placeholder={"番茄炒蛋\n想喝热汤\n蒜蓉西兰花"}
          className="mt-3 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-3 text-base leading-relaxed outline-none focus:border-[var(--primary)]"
        />
      </BottomSheet>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="删除这条？"
        message="删除后所有人都看不到。"
        confirmText="删除"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
