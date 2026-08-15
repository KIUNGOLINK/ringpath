-- Real per-session duration/objective, replacing the hardcoded "75 min" and
-- fixed objective text that used to show identically on every session.
alter table sessions
  add column if not exists duration_minutes int,
  add column if not exists objective text;
