/**
 * AI 服务客户端（仅服务端使用）。
 * 严格从环境变量读取，换服务商时只改 .env / Vercel 配置，不动业务代码。
 *
 * 调用路径：POST {AI_BASE_URL}/chat/completions
 */

export type AiConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
  timeoutMs: number;
  temperature: number;
};

export function getAiConfig(): AiConfig {
  const apiKey = process.env.AI_API_KEY?.trim();
  const baseUrl = process.env.AI_BASE_URL?.trim()?.replace(/\/$/, "");
  const model = process.env.AI_MODEL?.trim();
  const timeoutMs = Number(process.env.AI_TIMEOUT_MS ?? 45000);
  const temperature = Number(process.env.AI_TEMPERATURE ?? 0.7);

  if (!apiKey) {
    throw new Error("缺少环境变量 AI_API_KEY");
  }
  if (!baseUrl) {
    throw new Error("缺少环境变量 AI_BASE_URL");
  }
  if (!/^https?:\/\//i.test(baseUrl)) {
    throw new Error("AI_BASE_URL 必须以 http:// 或 https:// 开头");
  }
  if (!model) {
    throw new Error("缺少环境变量 AI_MODEL");
  }

  return {
    apiKey,
    baseUrl,
    model,
    timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : 45000,
    temperature: Number.isFinite(temperature) ? temperature : 0.7,
  };
}

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * OpenAI 兼容 Chat Completions。第 3 步接菜单生成时会用到。
 */
export async function chatCompletions(
  messages: ChatMessage[],
): Promise<string> {
  const config = getAiConfig();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: config.temperature,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`AI 请求失败 (${res.status}): ${text.slice(0, 300)}`);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("AI 返回为空，请稍后重试");
    }
    return content;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("生成超时，请稍后重试或加大 AI_TIMEOUT_MS");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
