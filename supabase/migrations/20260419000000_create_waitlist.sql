create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  created_at timestamptz not null default now(),
  constraint waitlist_email_key unique (email)
);

alter table public.waitlist enable row level security;

-- Anyone (including unauthenticated visitors) can sign up
create policy "anon can insert waitlist"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

-- Allow reading count publicly (used to display social proof)
create policy "anon can select waitlist"
  on public.waitlist for select
  to anon, authenticated
  using (true);
