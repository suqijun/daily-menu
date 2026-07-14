-- =============================================
-- 每日菜单 MVP — Supabase 建表脚本
-- 用法：打开 Supabase → SQL Editor → New query → 粘贴全部 → Run
-- =============================================

-- 1) 冰箱食材
create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quantity text,
  urgent boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2) 想吃的菜
create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  dish_name text not null,
  created_at timestamptz not null default now()
);

-- 3) 每日菜单（每天一条）
create table if not exists public.daily_menus (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  content text not null,
  generated_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 索引：列表按时间倒序
create index if not exists ingredients_created_at_idx
  on public.ingredients (created_at desc);

create index if not exists wishes_created_at_idx
  on public.wishes (created_at desc);

-- MVP：允许匿名公开读写（知道链接的人都能改，仅适合私人链接）
alter table public.ingredients enable row level security;
alter table public.wishes enable row level security;
alter table public.daily_menus enable row level security;

-- 先清掉同名策略（方便重复执行本脚本）
drop policy if exists "ingredients_anon_all" on public.ingredients;
drop policy if exists "wishes_anon_all" on public.wishes;
drop policy if exists "daily_menus_anon_all" on public.daily_menus;

create policy "ingredients_anon_all"
  on public.ingredients
  for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "wishes_anon_all"
  on public.wishes
  for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "daily_menus_anon_all"
  on public.daily_menus
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- 开启 Realtime（可选但推荐：手机间近实时同步）
-- 若报错「already member」，可忽略
do $$
begin
  begin
    alter publication supabase_realtime add table public.ingredients;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.wishes;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.daily_menus;
  exception when duplicate_object then null;
  end;
end $$;
