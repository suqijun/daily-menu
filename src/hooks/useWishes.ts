"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Wish } from "@/lib/types";

export function useWishes() {
  const [items, setItems] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: err } = await supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setItems((data ?? []) as Wish[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载想吃失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("wishes-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wishes" },
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
    async (dishName: string) => {
      const supabase = getSupabaseBrowserClient();
      const { error: err } = await supabase.from("wishes").insert({
        dish_name: dishName.trim(),
      });
      if (err) throw err;
      await refresh();
    },
    [refresh],
  );

  const addMany = useCallback(
    async (dishNames: string[]) => {
      const supabase = getSupabaseBrowserClient();
      const payload = dishNames
        .map((name) => ({ dish_name: name.trim() }))
        .filter((r) => r.dish_name);
      if (payload.length === 0) return;
      const { error: err } = await supabase.from("wishes").insert(payload);
      if (err) throw err;
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      const supabase = getSupabaseBrowserClient();
      const { error: err } = await supabase.from("wishes").delete().eq("id", id);
      if (err) throw err;
      await refresh();
    },
    [refresh],
  );

  return { items, loading, error, refresh, add, addMany, remove };
}
