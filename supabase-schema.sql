-- ============================================================
-- ԻՄ ԹԻՎՄԵԿ — Supabase schema
-- Paste this whole file into:
--   Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  created_at timestamptz not null default now()
);

-- Per-class notebook color + class PIN + optional custom name (safe to re-run)
alter table public.classes add column if not exists color text not null default '';
alter table public.classes add column if not exists pin text not null default '';
alter table public.classes add column if not exists custom_name text not null default '';

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  title text not null,
  description text not null default '',
  link text not null default '',
  photos jsonb not null default '[]'::jsonb,
  videos jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_projects_class on public.projects(class_id);

create table if not exists public.section_items (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  title text not null,
  body text not null default '',
  photo text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_section_items_section on public.section_items(section);

-- ------------------------------------------------------------
-- Row Level Security: the PIN lives in the app UI, so anon users
-- get full access through the API. Anyone with the link can read
-- and write — tighten this later with Supabase Auth if needed.
-- Note: policies are dropped-and-recreated so this file is safe
-- to re-run (Postgres has no CREATE POLICY IF NOT EXISTS).
-- ------------------------------------------------------------
alter table public.classes enable row level security;
alter table public.projects enable row level security;

-- classes
drop policy if exists "classes: public read"   on public.classes;
drop policy if exists "classes: public insert" on public.classes;
drop policy if exists "classes: public update" on public.classes;
drop policy if exists "classes: public delete" on public.classes;
create policy "classes: public read"   on public.classes for select using (true);
create policy "classes: public insert" on public.classes for insert with check (true);
create policy "classes: public update" on public.classes for update using (true) with check (true);
create policy "classes: public delete" on public.classes for delete using (true);

-- projects
drop policy if exists "projects: public read"   on public.projects;
drop policy if exists "projects: public insert" on public.projects;
drop policy if exists "projects: public update" on public.projects;
drop policy if exists "projects: public delete" on public.projects;
create policy "projects: public read"   on public.projects for select using (true);
create policy "projects: public insert" on public.projects for insert with check (true);
create policy "projects: public update" on public.projects for update using (true) with check (true);
create policy "projects: public delete" on public.projects for delete using (true);

-- section_items
drop policy if exists "section_items: public read"   on public.section_items;
drop policy if exists "section_items: public insert" on public.section_items;
drop policy if exists "section_items: public update" on public.section_items;
drop policy if exists "section_items: public delete" on public.section_items;
create policy "section_items: public read"   on public.section_items for select using (true);
create policy "section_items: public insert" on public.section_items for insert with check (true);
create policy "section_items: public update" on public.section_items for update using (true) with check (true);
create policy "section_items: public delete" on public.section_items for delete using (true);

-- ------------------------------------------------------------
-- Storage bucket for uploaded project photos (public read)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('project-media', 'project-media', true)
on conflict (id) do nothing;

drop policy if exists "media: public read"   on storage.objects;
drop policy if exists "media: public insert" on storage.objects;
drop policy if exists "media: public delete" on storage.objects;
create policy "media: public read"   on storage.objects for select using (bucket_id = 'project-media');
create policy "media: public insert" on storage.objects for insert with check (bucket_id = 'project-media');
create policy "media: public delete" on storage.objects for delete using (bucket_id = 'project-media');
