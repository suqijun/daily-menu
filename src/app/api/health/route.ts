import { NextResponse } from "next/server";

/**
 * 第 1 步自检：确认环境变量是否已配置（不返回密钥内容）。
 * 打开 http://localhost:3000/api/health 查看。
 */
export async function GET() {
  const supabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const aiKey = Boolean(process.env.AI_API_KEY);
  const aiBase = Boolean(process.env.AI_BASE_URL);
  const aiModel = Boolean(process.env.AI_MODEL);

  const ready =
    supabaseUrl && supabaseAnon && aiKey && aiBase && aiModel;

  return NextResponse.json({
    ok: ready,
    step: 1,
    message: ready
      ? "环境变量已齐全，可以进入第 2 步做三页界面"
      : "还有变量没填，请对照 README 检查 .env.local",
    checks: {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnon,
      AI_API_KEY: aiKey,
      AI_BASE_URL: aiBase,
      AI_MODEL: aiModel,
    },
  });
}
