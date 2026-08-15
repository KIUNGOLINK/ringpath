import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Stance } from "./types";

type Client = SupabaseClient<Database>;

export function generateClubCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function signUpBoxer(
  supabase: Client,
  params: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    weightKg: number | null;
    stance: Stance;
    clubCode: string;
  }
) {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
  });
  if (error) throw error;
  // Supabase always returns a `user`, even when email confirmation is pending —
  // `session` is what's actually null in that case. Without a session there's no
  // JWT yet, so any insert below would fail RLS with a 401.
  const userId = data.user?.id;
  if (!userId || !data.session) return { needsEmailConfirmation: true };

  let coachId: string | null = null;
  if (params.clubCode.trim()) {
    const { data: coach } = await supabase
      .from("coaches")
      .select("profile_id")
      .eq("club_code", params.clubCode.trim().toUpperCase())
      .maybeSingle();
    coachId = coach?.profile_id ?? null;
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    role: "boxer",
    first_name: params.firstName,
    last_name: params.lastName,
  });
  if (profileError) throw profileError;

  const { error: boxerError } = await supabase.from("boxers").insert({
    profile_id: userId,
    weight_kg: params.weightKg,
    stance: params.stance,
    coach_id: coachId,
  });
  if (boxerError) throw boxerError;

  const { data: camp, error: campError } = await supabase
    .from("camps")
    .insert({
      boxer_id: userId,
      opponent_name: "TBD",
      week_current: 1,
      week_total: 8,
      objectives: ["Set your camp objectives with your coach."],
    })
    .select()
    .single();
  if (campError) throw campError;

  await supabase.from("sessions").insert([
    {
      camp_id: camp.id,
      title: "Welcome session",
      subtitle: "Getting started · 30 min",
      session_type: "Technical",
      completed: false,
    },
  ]);

  return { needsEmailConfirmation: false };
}

export async function signUpCoach(
  supabase: Client,
  params: { email: string; password: string; firstName: string; lastName: string; clubName: string }
) {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
  });
  if (error) throw error;
  const userId = data.user?.id;
  if (!userId || !data.session) return { needsEmailConfirmation: true, clubCode: null };

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    role: "coach",
    first_name: params.firstName,
    last_name: params.lastName,
  });
  if (profileError) throw profileError;

  const clubCode = generateClubCode();
  const { error: coachError } = await supabase.from("coaches").insert({
    profile_id: userId,
    club_name: params.clubName,
    club_code: clubCode,
  });
  if (coachError) throw coachError;

  return { needsEmailConfirmation: false, clubCode };
}

export async function getBoxerBundle(supabase: Client, userId: string) {
  const { data: profile } = await supabase.from("profiles").select().eq("id", userId).single();
  const { data: boxer } = await supabase.from("boxers").select().eq("profile_id", userId).single();
  const { data: camp } = await supabase
    .from("camps")
    .select()
    .eq("boxer_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data: sessions } = camp
    ? await supabase
        .from("sessions")
        .select()
        .eq("camp_id", camp.id)
        .order("scheduled_for", { ascending: true })
    : { data: [] };

  let coachName: string | null = null;
  if (boxer?.coach_id) {
    const { data: coachProfile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", boxer.coach_id)
      .maybeSingle();
    if (coachProfile) coachName = `${coachProfile.first_name} ${coachProfile.last_name}`.trim();
  }

  return { profile, boxer, camp, sessions: sessions ?? [], coachName };
}

export async function getCoachRoster(supabase: Client, coachId: string) {
  const { data: boxers } = await supabase
    .from("boxers")
    .select("profile_id, weight_kg, stance")
    .eq("coach_id", coachId);
  if (!boxers || boxers.length === 0) return [];

  const ids = boxers.map((b) => b.profile_id);
  const [{ data: profiles }, { data: camps }] = await Promise.all([
    supabase.from("profiles").select().in("id", ids),
    supabase.from("camps").select().in("boxer_id", ids),
  ]);

  return boxers.map((b) => {
    const profile = profiles?.find((p) => p.id === b.profile_id);
    const camp = camps?.find((c) => c.boxer_id === b.profile_id);
    return {
      profileId: b.profile_id,
      name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : "Unnamed boxer",
      weightKg: b.weight_kg,
      stance: b.stance,
      camp: camp
        ? {
            opponentName: camp.opponent_name,
            fightDate: camp.fight_date,
            weekCurrent: camp.week_current,
            weekTotal: camp.week_total,
          }
        : null,
    };
  });
}

export async function getCoachInfo(supabase: Client, coachId: string) {
  const [{ data: profile }, { data: coach }] = await Promise.all([
    supabase.from("profiles").select().eq("id", coachId).single(),
    supabase.from("coaches").select().eq("profile_id", coachId).single(),
  ]);
  return { profile, coach };
}

export async function completeSession(
  supabase: Client,
  sessionId: string,
  energy: number,
  difficulty: number
) {
  const { error } = await supabase
    .from("sessions")
    .update({ completed: true, energy, difficulty })
    .eq("id", sessionId);
  if (error) throw error;
}
