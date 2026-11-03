-- Run this in the Supabase SQL editor.
create table if not exists public.events (
  id uuid primary key,
  title text not null,
  date date not null,
  time text not null,
  venue text not null,
  description text not null,
  speaker text,
  registration_link text,
  status text not null check (status in ('upcoming', 'past')),
  cover_image text,
  gallery text[] not null default '{}',
  report_link text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.events enable row level security;

create policy "Anyone can read published events"
  on public.events for select
  using (published = true or exists (
    select 1 from public.admin_users where user_id = auth.uid()
  ));

create policy "Authenticated admins can manage events"
  on public.events for all
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do update set public = true;

create policy "Anyone can view event images"
  on storage.objects for select
  using (bucket_id = 'event-images');

create policy "Authenticated admins can upload event images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'event-images'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "Authenticated admins can update event images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'event-images'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  )
  with check (
    bucket_id = 'event-images'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  );
