-- WantDo App - Supabase Schema
-- Run this in the Supabase SQL Editor

-- ============================================================
-- Table: items
-- ============================================================
create table if not exists public.items (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  title          text not null,
  category       text not null,
  status         text not null default '未着手',
  invited_person text,
  deadline       date,
  ticket_status  text,
  url            text,
  memo           text,
  tags           text[] not null default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger items_set_updated_at
  before update on public.items
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.items enable row level security;

-- Users can only see their own items
create policy "Users can select own items"
  on public.items for select
  using (auth.uid() = user_id);

-- Users can only insert items for themselves
create policy "Users can insert own items"
  on public.items for insert
  with check (auth.uid() = user_id);

-- Users can only update their own items
create policy "Users can update own items"
  on public.items for update
  using (auth.uid() = user_id);

-- Users can only delete their own items
create policy "Users can delete own items"
  on public.items for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists items_user_id_idx on public.items(user_id);
create index if not exists items_deadline_idx on public.items(deadline);
create index if not exists items_category_idx on public.items(category);
create index if not exists items_status_idx on public.items(status);
create index if not exists items_tags_idx on public.items using gin(tags);

-- ============================================================
-- Migration: add tags column (run if table already exists)
-- ============================================================
-- alter table public.items add column if not exists tags text[] not null default '{}';
