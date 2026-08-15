-- Spar cost-splitting: the host attaches their own external payment link
-- (Lydia, PayPal.me, a Stripe Payment Link they created themselves, etc.).
-- RingPath only computes each participant's share and links out to it —
-- it never processes or verifies the payment itself. Confirmation that a
-- participant paid is host-attested (a manual toggle), not automated,
-- since there's no real payment webhook backing it. Real payment
-- verification is a V1.5 Stripe Connect integration, not this.

alter table spar_sessions
  add column if not exists venue_price_eur numeric,
  add column if not exists payment_link_url text;

alter table spar_participants
  add column if not exists payment_confirmed boolean not null default false;

-- No UPDATE policy existed on spar_participants yet — needed so the host
-- can toggle payment_confirmed for people on their own session.
create policy "spar_participants: host toggles payment" on spar_participants
  for update using (
    exists (select 1 from spar_sessions where spar_sessions.id = spar_session_id and spar_sessions.host_id = auth.uid())
  );
