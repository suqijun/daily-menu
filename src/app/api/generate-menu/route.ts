import { NextResponse } from "next/server";
import { chatCompletions } from "@/lib/ai/client";
import { buildMenuMessages } from "@/lib/ai/prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  ingredients?: Array<{
    name?: string;
    quantity?: string | null;
    urgent?: boolean;
  }>;
  wishes?: Array<{ dish_name?: string }>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const ingredients = (body.ingredients ?? [])
      .filter((i) => typeof i.name === "string" && i.name.trim())
      .map((i) => ({
        name: i.name!.trim(),
        quantity: i.quantity ?? null,
        urgent: Boolean(i.urgent),
      }));

    if (ingredients.length === 0) {
      return NextResponse.json(
        { error: "先添加一些食材吧" },
        { status: 400 },
      );
    }

    const wishes = (body.wishes ?? [])
      .filter((w) => typeof w.dish_name === "string" && w.dish_name.trim())
      .map((w) => ({ dish_name: w.dish_name!.trim() }));

    const messages = buildMenuMessages(ingredients, wishes);
    const content = await chatCompletions(messages);

    return NextResponse.json({ content });
  } catch (e) {
    const message = formatError(e);
    const status = message.includes("缺少环境变量") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}

function formatError(e: unknown): string {
  if (e instanceof Error) {
    if (e.name === "AbortError") {
      return "生成超时，请稍后重试或换更快的模型";
    }
    return e.message || "生成失败，请稍后重试";
  }
  return "生成失败，请稍后重试";
}
