-- Real win/loss record on boxers, replacing the hardcoded "16-3" placeholder
-- that was never backed by real data.
alter table boxers
  add column if not exists wins int not null default 0,
  add column if not exists losses int not null default 0;
