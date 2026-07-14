import type { Ingredient, Wish } from "@/lib/types";
import type { ChatMessage } from "@/lib/ai/client";

export function buildMenuMessages(
  ingredients: Pick<Ingredient, "name" | "quantity" | "urgent">[],
  wishes: Pick<Wish, "dish_name">[],
): ChatMessage[] {
  const ingredientLines =
    ingredients.length === 0
      ? "（无）"
      : ingredients
          .map((item) => {
            const qty = item.quantity?.trim() ? `，数量：${item.quantity}` : "";
            const urgent = item.urgent ? "【尽快吃】" : "";
            return `- ${urgent}${item.name}${qty}`;
          })
          .join("\n");

  const wishLines =
    wishes.length === 0
      ? "（暂无点菜）"
      : wishes.map((w) => `- ${w.dish_name}`).join("\n");

  const system = `你是一位细心的家庭厨艺助手。请根据用户提供的冰箱食材和想吃清单，生成今日菜单。

硬性要求：
1. 必须包含【早餐】【午餐】【晚餐】三节
2. 画像：25 岁女性、食量小、一人份；份量偏小，勿做出大餐
3. 家常菜；每道菜步骤不超过 3 步；中文简明
4. 优先使用标记「尽快吃」的食材
5. 尽量满足「想吃」；食材不够时写「建议补充：xxx」或标注「需购买」
6. 不要编造冰箱里没有的食材，除非明确标注「需购买」
7. 早餐宜轻简；午/晚每餐 1–2 道菜，总量按食量小控制
8. 若食材明显不足，在文末写「建议补充：…」

输出格式严格如下（可微调菜名，但结构不要变）：

🍽 今日菜单（一人份 · 食量小 · 25岁女性）

【早餐】
1. 菜名
   食材：…
   步骤：…
   约 X 分钟

【午餐】
1. …
   …

【晚餐】
1. …
   …

💡 备注：…`;

  const user = `当前冰箱食材：
${ingredientLines}

想吃的菜：
${wishLines}

请生成今日早中晚菜单。`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}
