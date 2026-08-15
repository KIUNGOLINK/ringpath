-- Spar module: sparring partner matchmaking, layered on top of the existing
-- profiles/boxers tables. Reuses identity, no second auth/profile system.

alter table profiles
  add column if not exists last_app_mode text not null default 'compet'
    check (last_app_mode in ('compet', 'spar'));

-- ---------------------------------------------------------------------------
-- spar_sessions: a sparring session someone is hosting/proposing.
-- ---------------------------------------------------------------------------
create table if not exists spar_sessions (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references profiles (id) on delete cascade,
  mode text not null check (mode in ('OPEN_ROUNDS', 'CAMP_SPAR')),
  status text not null default 'OPEN'
    check (status in ('OPEN', 'FULL', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
  title text,
  description text,
  session_date date not null,
  start_time time not null,
  duration_minutes int,
  city text not null,
  venue_name text,
  min_weight_kg numeric,
  max_weight_kg numeric,
  requested_stance text check (requested_stance in ('ORTHODOX', 'SOUTHPAW', 'ANY')),
  level text,
  intensity text not null default 'MODERATE'
    check (intensity in ('TECHNICAL', 'MODERATE', 'COMPETITION_PREP')),
  target_rounds int,
  max_participants int not null default 2,
  camp_id uuid references camps (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table spar_sessions enable row level security;

create policy "spar_sessions: read open or own" on spar_sessions
  for select using (
    status in ('OPEN', 'FULL', 'CONFIRMED')
    or host_id = auth.uid()
    or exists (
      select 1 from spar_participants
      where spar_participants.spar_session_id = spar_sessions.id
      and spar_participants.user_id = auth.uid()
    )
  );

create policy "spar_sessions: host insert" on spar_sessions
  for insert with check (host_id = auth.uid());

create policy "spar_sessions: host update" on spar_sessions
  for update using (host_id = auth.uid());

create policy "spar_sessions: host delete" on spar_sessions
  for delete using (host_id = auth.uid());

-- ---------------------------------------------------------------------------
-- spar_join_requests: a request from a boxer to join someone's session.
-- ---------------------------------------------------------------------------
create table if not exists spar_join_requests (
  id uuid primary key default gen_random_uuid(),
  spar_session_id uuid not null references spar_sessions (id) on delete cascade,
  requester_id uuid not null references profiles (id) on delete cascade,
  message text,
  status text not null default 'PENDING'
    check (status in ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (spar_session_id, requester_id)
);

alter table spar_join_requests enable row level security;

create policy "spar_join_requests: requester or host read" on spar_join_requests
  for select using (
    requester_id = auth.uid()
    or exists (select 1 from spar_sessions where spar_sessions.id = spar_session_id and spar_sessions.host_id = auth.uid())
  );

create policy "spar_join_requests: requester insert" on spar_join_requests
  for insert with check (
    requester_id = auth.uid()
    and not exists (select 1 from spar_sessions where spar_sessions.id = spar_session_id and spar_sessions.host_id = auth.uid())
  );

create policy "spar_join_requests: requester cancels own" on spar_join_requests
  for update using (requester_id = auth.uid());

create policy "spar_join_requests: host accepts/declines" on spar_join_requests
  for update using (
    exists (select 1 from spar_sessions where spar_sessions.id = spar_session_id and spar_sessions.host_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- spar_participants: confirmed members of a session (host included).
-- ---------------------------------------------------------------------------
create table if not exists spar_participants (
  id uuid primary key default gen_random_uuid(),
  spar_session_id uuid not null references spar_sessions (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  role text not null default 'PARTICIPANT' check (role in ('HOST', 'PARTICIPANT')),
  joined_at timestamptz not null default now(),
  unique (spar_session_id, user_id)
);

alter table spar_participants enable row level security;

-- Anyone who can see the session (open/full/confirmed, or its host) can see
-- who's in it — matches the session detail screen showing participants.
create policy "spar_participants: viewers of the session read" on spar_participants
  for select using (
    exists (
      select 1 from spar_sessions
      where spar_sessions.id = spar_session_id
      and (spar_sessions.status in ('OPEN', 'FULL', 'CONFIRMED') or spar_sessions.host_id = auth.uid())
    )
  );

create policy "spar_participants: host manages" on spar_participants
  for insert with check (
    exists (select 1 from spar_sessions where spar_sessions.id = spar_session_id and spar_sessions.host_id = auth.uid())
  );

create policy "spar_participants: self leave" on spar_participants
  for delete using (
    user_id = auth.uid()
    or exists (select 1 from spar_sessions where spar_sessions.id = spar_session_id and spar_sessions.host_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- spar_feedback: reliability feedback after a session, never a skill rating.
-- ---------------------------------------------------------------------------
create table if not exists spar_feedback (
  id uuid primary key default gen_random_uuid(),
  spar_session_id uuid not null references spar_sessions (id) on delete cascade,
  author_id uuid not null references profiles (id) on delete cascade,
  target_id uuid not null references profiles (id) on delete cascade,
  would_spar_again boolean not null,
  respectful boolean,
  controlled_intensity boolean,
  on_time boolean,
  matched_description boolean,
  safe_partner boolean,
  good_communication boolean,
  private_comment text,
  created_at timestamptz not null default now(),
  unique (spar_session_id, author_id, target_id),
  check (author_id <> target_id)
);

alter table spar_feedback enable row level security;

create policy "spar_feedback: participants insert about co-participants" on spar_feedback
  for insert with check (
    author_id = auth.uid()
    and exists (select 1 from spar_participants where spar_session_id = spar_feedback.spar_session_id and user_id = auth.uid())
    and exists (select 1 from spar_participants where spar_session_id = spar_feedback.spar_session_id and user_id = target_id)
  );

create policy "spar_feedback: author or target read" on spar_feedback
  for select using (author_id = auth.uid() or target_id = auth.uid());

-- ---------------------------------------------------------------------------
-- spar_reports: safety reports. No update/delete policy — reports are
-- append-only from the app's perspective; review happens via the Supabase
-- dashboard for V1 (no admin UI yet).
-- ---------------------------------------------------------------------------
create table if not exists spar_reports (
  id uuid primary key default gen_random_uuid(),
  spar_session_id uuid references spar_sessions (id) on delete set null,
  reporter_id uuid not null references profiles (id) on delete cascade,
  reported_id uuid references profiles (id) on delete cascade,
  reason text not null,
  details text,
  created_at timestamptz not null default now()
);

alter table spar_reports enable row level security;

create policy "spar_reports: reporter insert" on spar_reports
  for insert with check (reporter_id = auth.uid());

create policy "spar_reports: reporter reads own" on spar_reports
  for select using (reporter_id = auth.uid());
