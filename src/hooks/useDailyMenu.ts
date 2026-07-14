"use client";

import { useCallback, useEffect, useState } from "react";
import { todayDateString } from "@/lib/date";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { DailyMenu } from "@/lib/types";

export function useDailyMenu() {
  const [menu, setMenu] = useState<DailyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const today = todayDateString();
      const { data, error: err } = await supabase
        .from("daily_menus")
        .select("*")
        .eq("date", today)
        .maybeSingle();
      if (err) throw err;
      setMenu((data as DailyMenu | null) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载菜单失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("daily-menus-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "daily_menus" },
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

  const save = useCallback(
    async (
      content: string,
      options?: { markGenerated?: boolean },
    ) => {
      const supabase = getSupabaseBrowserClient();
      const today = todayDateString();
      const now = new Date().toISOString();
      const { data, error: err } = await supabase
        .from("daily_menus")
        .upsert(
          {
            date: today,
            content,
            updated_at: now,
            generated_at: options?.markGenerated
              ? now
              : (menu?.generated_at ?? now),
          },
          { onConflict: "date" },
        )
        .select("*")
        .single();
      if (err) throw err;
      setMenu(data as DailyMenu);
      return data as DailyMenu;
    },
    [menu?.generated_at],
  );

  return { menu, loading, error, refresh, save };
}
