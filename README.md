# 每日菜单（MVP）

手机优先的共享网页：一起记冰箱、一起点菜，一键 AI 生成「早 + 中 + 晚」菜单。

> **项目位置：** `/Users/mac/Documents/daily-menu`  
> （笔记库文件夹名含特殊字符，会导致 npm 安装失败，所以代码放在这个干净路径里。）

---

## 现在做到哪一步？

| 步骤 | 内容 | 状态 |
|------|------|------|
| **1** | 项目骨架 + 数据库建表 + 环境变量 | ✅ 已完成 |
| **2** | 三页界面（冰箱 / 想吃 / 菜单）+ 读写同步 | ✅ 已完成 |
| **3** | 服务端接 AI 生成菜单 | ✅ 已完成 |
| **4** | 推到 GitHub + Vercel 上线 | ⏳ 按下面做 |

---

## 第 4 步：推上 GitHub，再用 Vercel 发布

### 现状说明（很重要）

代码在你电脑的：`/Users/mac/Documents/daily-menu`  
但如果 GitHub 仓库是空的（或只有说明文件），Vercel 就会部署失败。  
**必须先把本地代码推到那个 GitHub 仓库，再让 Vercel 重新部署。**

`.env.local` 里有真实密钥，**永远不要**提交到 GitHub。

---

### 4.1 把代码推到 GitHub（二选一）

#### 方法 A：让 Cursor 帮你提交并推送（推荐）

回复我这两样：

1. 你的 GitHub 仓库地址（例如 `https://github.com/你的用户名/仓库名`）  
2. 一句话：「帮我提交并推送到这个仓库」

我会帮你：提交代码（不含密钥）→ 推到 GitHub → 你再去 Vercel 点重新部署。

#### 方法 B：自己在终端操作

1. 打开终端，进入项目：
   ```bash
   cd /Users/mac/Documents/daily-menu
   ```
2. 若还没绑定远程仓库（把地址换成你的）：
   ```bash
   git remote add origin https://github.com/你的用户名/仓库名.git
   ```
   若提示 remote 已存在，改用：
   ```bash
   git remote set-url origin https://github.com/你的用户名/仓库名.git
   ```
3. 提交并推送：
   ```bash
   git add .
   git status
   # 确认列表里没有 .env.local
   git commit -m "feat: 每日菜单 MVP 可部署版本"
   git push -u origin main
   ```
4. 打开 GitHub 网页，刷新仓库，应能看到 `src/`、`package.json`、`README.md` 等文件。

---

### 4.2 在 Vercel 填环境变量（复制粘贴 Token）

打开 [vercel.com](https://vercel.com) → 点进你的项目 → **Settings** → **Environment Variables**

逐条 **Add**，名称和值与本地 `.env.local` 一致：

| 名称 | 从哪里复制 | 备注 |
|------|------------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 本地 `.env.local` 或 Supabase → Settings → API | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 同上 anon key | |
| `AI_API_KEY` | 本地 `.env.local` | 不要加 `NEXT_PUBLIC_` |
| `AI_BASE_URL` | 本地 `.env.local` | 一般带 `/v1` |
| `AI_MODEL` | 本地 `.env.local` | |
| `AI_TIMEOUT_MS`（可选） | `45000` | 可跳过 |
| `AI_TEMPERATURE`（可选） | `0.7` | 可跳过 |

每一项尽量勾选 **Production**、**Preview**、**Development**，保存。

> 改完环境变量后必须重新部署，否则线上还是旧配置。

---

### 4.3 重新部署

1. Vercel 项目 → **Deployments**
2. 若刚 push 过代码，通常会自动出现一次新部署；等待变成 **Ready**
3. 若没有自动部署：点最新一条右边 **⋯** → **Redeploy** → 确认
4. 部署成功后，点 **Visit** / 项目域名（形如 `https://xxx.vercel.app`）

---

### 4.4 手机验收

用手机打开 Vercel 给你的 `https://….vercel.app` 链接：

- [ ] 三个 Tab 能切换  
- [ ] 能添加食材 / 想吃  
- [ ] 能 AI 生成早中晚菜单  
- [ ] 生成后可编辑、保存、复制  
- [ ] 另一台手机打开同一链接能看到数据  

这个链接以后就可以收藏，或「添加到主屏幕」。

---

### 换 AI / 换密钥（上线之后）

1. Vercel → Settings → Environment Variables → 改 `AI_API_KEY` / `AI_BASE_URL` / `AI_MODEL`
2. Deployments → Redeploy  
不需要改代码。

---

## 第 3 步：试 AI 生成（一般不用再复制 Token）

前提：`.env.local` 里 `AI_API_KEY`、`AI_BASE_URL`、`AI_MODEL` 已填好（第 1 步做过）。

1. 确保 `npm run dev` 在跑（改过代码一般会自动刷新；不行就 Ctrl+C 再 `npm run dev`）
2. 打开 **菜单** Tab
3. 冰箱里至少有几样食材（想吃可有可无）
4. 点 **✨ AI 生成今日菜单**，等十几秒
5. 检查是否有【早餐】【午餐】【晚餐】；可改文字 → 保存 → 复制

若失败：页面会提示原因。常见是 Key / Base URL / 模型名写错，对照《每日菜单-AI服务配置.md》改 `.env.local` 后重启。

试通后回复「第 3 步完成」，我写第 4 步 Vercel 上线说明。

---

## 第 2 步：怎么试用三页（不需要再复制 Token）

1. 确保终端里 `npm run dev` 还在跑（不要关）
2. 手机或电脑浏览器打开：http://localhost:3000  
   （同一 WiFi 下手机可用终端里显示的 Network 地址，如 `http://192.168.x.x:3000`）
3. 试这些操作：
   - **冰箱**：添加食材 → 点「尽快吃」→ 删除（会问确认）
   - **想吃**：添加菜名 → 删除
   - **菜单**：可手写/编辑 → 保存 → 复制（AI 一键生成在第 3 步接通）
4. 用两台手机开同一链接：一台添加，另一台约几秒内应看到更新

### 手机打不开 / 一直「加载中」？

Next.js 开发模式默认只信任电脑本机。手机用 `192.168.x.x:3000` 打开时，需要：

1. 打开 `next.config.ts`，确认 `allowedDevOrigins` 里有你电脑当前的局域网 IP（和终端 Network 一行一致）
2. **关掉终端里正在跑的服务**（Ctrl + C），再执行一次 `npm run dev`
3. 手机浏览器强制刷新后再试

试完没问题，回复「第 2 步完成」，我开始接 AI。

---

## 第 1 步：你需要复制粘贴哪些 Token

你一共要准备 **5 个值**：

| 名称 | 从哪里拿 | 粘贴到哪里 |
|------|----------|------------|
| Supabase **Project URL** | Supabase → Settings → API | `.env.local` 的 `NEXT_PUBLIC_SUPABASE_URL` |
| Supabase **anon public** 密钥 | 同上页面 | `.env.local` 的 `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **AI_API_KEY** | 你买的 AI 服务商后台 | `.env.local` 的 `AI_API_KEY` |
| **AI_BASE_URL** | 服务商文档（通常带 `/v1`） | `.env.local` 的 `AI_BASE_URL` |
| **AI_MODEL** | 服务商后台的模型名 | `.env.local` 的 `AI_MODEL` |

> AI 密钥**不会**出现在网页前端，只在服务器里用。

---

## A. 创建 Supabase 并建表（约 5 分钟）

1. 打开 [https://supabase.com](https://supabase.com)，注册/登录。
2. 点 **New project**，起个名字（如 `daily-menu`），设一个数据库密码（自己记好），选离你近的地区，点创建。
3. 等项目变成绿色 Ready（通常 1～2 分钟）。
4. 左侧点 **SQL Editor** → **New query**。
5. 用电脑打开本项目的文件：`supabase/schema.sql`，**全选复制**。
6. 粘贴到 SQL Editor 里，点 **Run**（运行）。
7. 下方显示成功即可。然后再点左侧 **Table Editor**，应能看到三张表：
   - `ingredients`（食材）
   - `wishes`（想吃）
   - `daily_menus`（每日菜单）

### 复制 Supabase 的两个 Token

1. 左侧底部点 **Project Settings**（齿轮）→ **API**。
2. 找到 **Project URL**，复制，稍后粘贴。
3. 找到 **Project API keys** 里的 **anon public**，复制，稍后粘贴。  
   （不要用 `service_role`，那个权限太大，MVP 不需要。）

---

## B. 准备 AI 的三个值

向你的 AI 服务商后台拿到：

1. **API Key**（像密码）
2. **Base URL**（接口地址，多数以 `/v1` 结尾，以对方文档为准）
3. **Model**（模型名，如 `gpt-4o-mini`、`deepseek-chat`）

接口需要兼容 OpenAI 的 Chat Completions 格式。详细说明见需求文档《每日菜单-AI服务配置.md》。

---

## C. 填写本地环境变量

1. 用访达打开文件夹：`/Users/mac/Documents/daily-menu`
2. 把 `.env.example` **复制一份**，改名为 `.env.local`  
   （终端也可：`cp .env.example .env.local`）
3. 用文本编辑器打开 `.env.local`，把占位符换成真实值，例如：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...（很长一串）

AI_API_KEY=sk-你的密钥
AI_BASE_URL=https://api.example.com/v1
AI_MODEL=gpt-4o-mini
```

4. 保存。**不要**把 `.env.local` 发到微信/群里，也**不要**提交到 Git。

---

## D. 启动并自检

在终端执行：

```bash
cd /Users/mac/Documents/daily-menu
npm run dev
```

然后用浏览器打开：

- 首页： [http://localhost:3000](http://localhost:3000)
- 自检： [http://localhost:3000/api/health](http://localhost:3000/api/health)

若 `checks` 里五项都是 `true`，第 1 步就完成了。告诉我「第 1 步完成」，我就开始做第 2 步（三页界面）。

---

## 项目结构（第 1 步已有）

```
daily-menu/
├── .env.example              ← 环境变量模板（无真实密钥）
├── README.md                 ← 本说明
├── supabase/
│   └── schema.sql            ← 复制到 Supabase 运行
├── src/
│   ├── app/
│   │   ├── page.tsx          ← 临时首页（第 2 步会换成三 Tab）
│   │   └── api/health/       ← 检查环境变量是否填齐
│   └── lib/
│       ├── types.ts
│       ├── supabase/client.ts
│       └── ai/client.ts      ← 只读 AI 环境变量，第 3 步接生成
└── package.json
```

---

## 换 AI 服务商时怎么做？

只改 `.env.local`（或以后 Vercel 后台）里的这三行，**不用改代码**：

- `AI_API_KEY`
- `AI_BASE_URL`
- `AI_MODEL`

改完后重启 `npm run dev`（已部署则要 Redeploy）。

---

## 还没做的事（后续步骤）

- 第 2 步：底部 Tab「冰箱 / 想吃 / 菜单」+ 增删改查 + 实时同步
- 第 3 步：服务端调用 AI 生成早中晚，可编辑保存复制
- 第 4 步：Vercel 部署（把同样 5 个环境变量贴到 Vercel）
