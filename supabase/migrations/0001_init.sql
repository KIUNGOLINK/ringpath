-- RingPath core schema: profiles, coaches, boxers, camps, sessions.
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user, holds shared identity fields + role.
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('boxer', 'coach')),
  first_name text not null default '',
  last_name text not null default '',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles: read own" on profiles
  for select using (id = auth.uid());

create policy "profiles: update own" on profiles
  for update using (id = auth.uid());

create policy "profiles: insert own" on profiles
  for insert with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- coaches: one row per coach profile. club_code is what boxers use to join.
-- ---------------------------------------------------------------------------
create table if not exists coaches (
  profile_id uuid primary key references profiles (id) on delete cascade,
  club_name text not null default '',
  club_code text not null unique,
  created_at timestamptz not null default now()
);

alter table coaches enable row level security;

create policy "coaches: read own" on coaches
  for select using (profile_id = auth.uid());

-- Any authenticated user can look up a club by code to join it (non-sensitive info).
create policy "coaches: lookup by code" on coaches
  for select using (auth.uid() is not null);

create policy "coaches: insert own" on coaches
  for insert with check (profile_id = auth.uid());

create policy "coaches: update own" on coaches
  for update using (profile_id = auth.uid());

-- ---------------------------------------------------------------------------
-- boxers: one row per boxer profile, optionally linked to a coach.
-- ---------------------------------------------------------------------------
create table if not exists boxers (
  profile_id uuid primary key references profiles (id) on delete cascade,
  weight_kg numeric,
  stance text check (stance in ('ORTHODOX', 'SOUTHPAW')),
  coach_id uuid references coaches (profile_id) on delete set null,
  created_at timestamptz not null default now()
);

alter table boxers enable row level security;

create policy "boxers: read own" on boxers
  for select using (profile_id = auth.uid());

create policy "boxers: coach reads roster" on boxers
  for select using (coach_id = auth.uid());

create policy "boxers: insert own" on boxers
  for insert with check (profile_id = auth.uid());

create policy "boxers: update own" on boxers
  for update using (profile_id = auth.uid());

-- Let a coach read the profile rows (name) of boxers on their roster.
create policy "profiles: coach reads roster names" on profiles
  for select using (
    exists (
      select 1 from boxers
      where boxers.profile_id = profiles.id
      and boxers.coach_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- camps: one active fight camp per boxer (kept simple: no history table yet).
-- ---------------------------------------------------------------------------
create table if not exists camps (
  id uuid primary key default gen_random_uuid(),
  boxer_id uuid not null references boxers (profile_id) on delete cascade,
  opponent_name text not null default '',
  fight_date date,
  week_current int not null default 1,
  week_total int not null default 8,
  objectives text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table camps enable row level security;

create policy "camps: boxer full access" on camps
  for all using (boxer_id = auth.uid()) with check (boxer_id = auth.uid());

create policy "camps: coach reads roster camps" on camps
  for select using (
    exists (
      select 1 from boxers
      where boxers.profile_id = camps.boxer_id
      and boxers.coach_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- sessions: training sessions within a camp.
-- ---------------------------------------------------------------------------
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  camp_id uuid not null references camps (id) on delete cascade,
  scheduled_for timestamptz not null default now(),
  title text not null,
  subtitle text not null default '',
  session_type text not null default 'Technical'
    check (session_type in ('Technical', 'Pads', 'Sparring', 'Conditioning', 'Roadwork', 'Recovery')),
  completed boolean not null default false,
  energy int check (energy between 1 and 5),
  difficulty int check (difficulty between 1 and 5),
  created_at timestamptz not null default now()
);

alter table sessions enable row level security;

create policy "sessions: boxer full access" on sessions
  for all using (
    exists (select 1 from camps where camps.id = sessions.camp_id and camps.boxer_id = auth.uid())
  ) with check (
    exists (select 1 from camps where camps.id = sessions.camp_id and camps.boxer_id = auth.uid())
  );

create policy "sessions: coach reads roster sessions" on sessions
  for select using (
    exists (
      select 1 from camps
      join boxers on boxers.profile_id = camps.boxer_id
      where camps.id = sessions.camp_id
      and boxers.coach_id = auth.uid()
    )
  );
