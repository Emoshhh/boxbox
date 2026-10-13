-- Box Box veritabanı şeması
-- Supabase > SQL Editor > New query içine yapıştırıp Run'a bas.

create extension if not exists citext;

-- Kullanıcı adları
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username citext not null unique check (username ~ '^[A-Za-z0-9._]{3,20}$'),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profiles okunur" on public.profiles;
create policy "profiles okunur" on public.profiles for select using (true);
drop policy if exists "kendi profilini ekler" on public.profiles;
create policy "kendi profilini ekler" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "kendi profilini gunceller" on public.profiles;
create policy "kendi profilini gunceller" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Biten gridler. Bir grid bir kez kaydedilir, sonradan değiştirilemez.
create table if not exists public.results (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  mode text not null check (mode in ('all','mod')),
  diff smallint not null check (diff between 1 and 3),
  score smallint not null check (score between 0 and 9),
  cells smallint[] not null check (array_length(cells,1) = 9),
  guesses_left smallint not null default 0,
  live boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (user_id, day, mode, diff)
);
alter table public.results enable row level security;
-- Herkes sadece kendi sonuçlarını (ve cevaplarını) görür. Sıralama aşağıdaki görünümden okunur.
drop policy if exists "kendi sonuclarini okur" on public.results;
create policy "kendi sonuclarini okur" on public.results for select using (auth.uid() = user_id);
drop policy if exists "kendi sonucunu ekler" on public.results;
create policy "kendi sonucunu ekler" on public.results for insert with check (auth.uid() = user_id);

-- "live": grid kendi gününde (İstanbul saatine göre) bitirildiyse true. Seri sadece bunları sayar.
-- Değeri sunucu belirler, tarayıcının gönderdiği değer dikkate alınmaz.
create or replace function public.results_set_live() returns trigger
language plpgsql as $$
declare today date := (now() at time zone 'Europe/Istanbul')::date;
begin
  if new.day > today or new.day < date '2026-10-01' then
    raise exception 'gecersiz gun';
  end if;
  new.live := (new.day = today);
  new.created_at := now();
  return new;
end $$;
drop trigger if exists results_live on public.results;
create trigger results_live before insert on public.results
for each row execute function public.results_set_live();

-- Sıralama: sadece toplu sayılar, cevaplar yok.
create or replace view public.leaderboard as
with d as (
  select distinct user_id, day from public.results where live
), g as (
  select user_id, day, day - (row_number() over (partition by user_id order by day))::int as grp from d
), runs as (
  select user_id, max(day) as e, count(*) as len from g group by user_id, grp
), agg as (
  select user_id,
         max(len)::int as best,
         coalesce(max(len) filter (where e >= (now() at time zone 'Europe/Istanbul')::date - 1), 0)::int as streak
  from runs group by user_id
), tot as (
  select user_id,
         count(*)::int as played,
         count(*) filter (where score = 9)::int as perfect,
         coalesce(sum(score) filter (where live and day = (now() at time zone 'Europe/Istanbul')::date), 0)::int as today_score,
         count(*) filter (where live and day = (now() at time zone 'Europe/Istanbul')::date)::int as today_n
  from public.results group by user_id
)
select p.id, p.username::text as username,
       coalesce(a.streak,0) as streak, coalesce(a.best,0) as best,
       coalesce(t.played,0) as played, coalesce(t.perfect,0) as perfect,
       coalesce(t.today_score,0) as today_score, coalesce(t.today_n,0) as today_n
from public.profiles p
left join agg a on a.user_id = p.id
left join tot t on t.user_id = p.id;

grant select on public.leaderboard to anon, authenticated;
