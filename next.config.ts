import type { NextConfig } from "next";

/**
 * 手机通过局域网 IP（如 http://192.168.3.153:3000）打开时，
 * Next.js 16 默认拦截开发资源，页面会卡在「加载中」、按钮点不动。
 * 在下面列出允许的来源主机名（不含 http://）。
 *
 * 如果你电脑的 IP 换了，把新 IP 加进来，然后重启 npm run dev。
 */
const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.3.153",
    "127.0.0.1",
  ],
};

export default nextConfig;
