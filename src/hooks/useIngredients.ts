"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Ingredient } from "@/lib/types";

export function useIngredients() {
  const [items, setItems] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** 正在乐观更新的 id → 目标 urgent，避免轮询把旧值盖回来 */
  const pendingUrgent = useRef(new Map<string, boolean>());

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const query = supabase
        .from("ingredients")
        .select("*")
        .order("created_at", { ascending: false });
      const { data, error: err } = await Promise.race([
        query,
        new Promise<never>((_, reject) =>
          window.setTimeout(
            () => reject(new Error("加载超时，请检查网络后点刷新")),
            12000,
          ),
        ),
      ]);
      if (err) throw err;
      const pending = pendingUrgent.current;
      setItems(
        ((data ?? []) as Ingredient[]).map((item) =>
          pending.has(item.id)
            ? { ...item, urgent: pending.get(item.id)! }
            : item,
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载食材失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("ingredients-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ingredients" },
        () => {
          void refresh();
        },
      )
      .subscribe();

    const poll = window.setInterval(() => void refresh(), 5000);
    return () => {
      void supabase.removeChannel(channel);
      window.clearInterval(poll);
    };
  }, [refresh]);

  const add = useCallback(
    async (name: string, quantity?: string) => {
      const supabase = getSupabaseBrowserClient();
      const { error: err } = await supabase.from("ingredients").insert({
        name: name.trim(),
        quantity: quantity?.trim() || null,
        urgent: false,
      });
      if (err) throw err;
      await refresh();
    },
    [refresh],
  );

  const addMany = useCallback(
    async (rows: Array<{ name: string; quantity?: string }>) => {
      const supabase = getSupabaseBrowserClient();
      const payload = rows
        .map((r) => ({
          name: r.name.trim(),
          quantity: r.quantity?.trim() || null,
          urgent: false,
        }))
        .filter((r) => r.name);
      if (payload.length === 0) return;
      const { error: err } = await supabase.from("ingredients").insert(payload);
      if (err) throw err;
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      const supabase = getSupabaseBrowserClient();
      const { error: err } = await supabase
        .from("ingredients")
        .delete()
        .eq("id", id);
      if (err) throw err;
      await refresh();
    },
    [refresh],
  );

  const toggleUrgent = useCallback(async (id: string, urgent: boolean) => {
    let previous: boolean | undefined;

    pendingUrgent.current.set(id, urgent);
    setItems((curr) =>
      curr.map((item) => {
        if (item.id !== id) return item;
        previous = item.urgent;
        return { ...item, urgent };
      }),
    );

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: err } = await supabase
        .from("ingredients")
        .update({ urgent })
        .eq("id", id);
      if (err) throw err;
    } catch (e) {
      pendingUrgent.current.delete(id);
      if (previous !== undefined) {
        setItems((curr) =>
          curr.map((item) =>
            item.id === id ? { ...item, urgent: previous! } : item,
          ),
        );
      }
      throw e;
    } finally {
      // 稍后再清，避免刚写完就被轮询的旧快照盖住
      window.setTimeout(() => {
        if (pendingUrgent.current.get(id) === urgent) {
          pendingUrgent.current.delete(id);
        }
      }, 1500);
    }
  }, []);

  return { items, loading, error, refresh, add, addMany, remove, toggleUrgent };
}
