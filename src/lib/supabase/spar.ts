import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, SparIntensity, SparMode, Stance } from "./types";

type Client = SupabaseClient<Database>;

export async function setAppMode(supabase: Client, userId: string, mode: "compet" | "spar") {
  const { error } = await supabase.from("profiles").update({ last_app_mode: mode }).eq("id", userId);
  if (error) throw error;
}

export async function getAppMode(supabase: Client, userId: string) {
  const { data } = await supabase.from("profiles").select("last_app_mode").eq("id", userId).maybeSingle();
  return data?.last_app_mode ?? "compet";
}

export type CreateSparSessionInput = {
  hostId: string;
  mode: SparMode;
  title?: string;
  description?: string;
  sessionDate: string;
  startTime: string;
  city: string;
  venueName?: string;
  minWeightKg?: number;
  maxWeightKg?: number;
  requestedStance?: Stance | "ANY";
  level?: string;
  intensity: SparIntensity;
  targetRounds?: number;
  maxParticipants: number;
  campId?: string;
  venuePriceEur?: number;
  paymentLinkUrl?: string;
};

export async function createSparSession(supabase: Client, input: CreateSparSessionInput) {
  const { data, error } = await supabase
    .from("spar_sessions")
    .insert({
      host_id: input.hostId,
      mode: input.mode,
      title: input.title,
      description: input.description,
      session_date: input.sessionDate,
      start_time: input.startTime,
      city: input.city,
      venue_name: input.venueName,
      min_weight_kg: input.minWeightKg,
      max_weight_kg: input.maxWeightKg,
      requested_stance: input.requestedStance,
      level: input.level,
      intensity: input.intensity,
      target_rounds: input.targetRounds,
      max_participants: input.maxParticipants,
      camp_id: input.campId,
      venue_price_eur: input.venuePriceEur,
      payment_link_url: input.paymentLinkUrl,
    })
    .select()
    .single();
  if (error) throw error;

  await supabase.from("spar_participants").insert({
    spar_session_id: data.id,
    user_id: input.hostId,
    role: "HOST",
  });

  return data;
}

export type SparDiscoveryFilters = {
  city?: string;
  mode?: SparMode | "ALL";
  fromDate?: string;
  intensity?: SparIntensity | "ALL";
  stance?: Stance | "ALL";
  weightKg?: number;
};

export async function listSparSessions(supabase: Client, filters: SparDiscoveryFilters = {}) {
  let query = supabase
    .from("spar_sessions")
    .select()
    .in("status", ["OPEN", "FULL"])
    .order("session_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (filters.city) query = query.ilike("city", `%${filters.city}%`);
  if (filters.mode && filters.mode !== "ALL") query = query.eq("mode", filters.mode);
  if (filters.fromDate) query = query.gte("session_date", filters.fromDate);
  if (filters.intensity && filters.intensity !== "ALL") query = query.eq("intensity", filters.intensity);
  if (filters.stance && filters.stance !== "ALL") query = query.or(`requested_stance.eq.${filters.stance},requested_stance.eq.ANY,requested_stance.is.null`);
  if (filters.weightKg != null) {
    query = query
      .or(`min_weight_kg.is.null,min_weight_kg.lte.${filters.weightKg}`)
      .or(`max_weight_kg.is.null,max_weight_kg.gte.${filters.weightKg}`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return await attachHostNames(supabase, data ?? []);
}

export async function listMySparSessions(supabase: Client, userId: string) {
  const { data: participating } = await supabase
    .from("spar_participants")
    .select("spar_session_id")
    .eq("user_id", userId);
  const ids = (participating ?? []).map((p) => p.spar_session_id);
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("spar_sessions")
    .select()
    .in("id", ids)
    .order("session_date", { ascending: true });
  if (error) throw error;
  return await attachHostNames(supabase, data ?? []);
}

async function attachHostNames<T extends { host_id: string }>(supabase: Client, sessions: T[]) {
  if (sessions.length === 0) return [] as (T & { hostName: string })[];
  const hostIds = [...new Set(sessions.map((s) => s.host_id))];
  const { data: profiles } = await supabase.from("profiles").select("id, first_name, last_name").in("id", hostIds);
  return sessions.map((s) => {
    const profile = profiles?.find((p) => p.id === s.host_id);
    return { ...s, hostName: profile ? `${profile.first_name} ${profile.last_name}`.trim() : "" };
  });
}

export async function getSparSession(supabase: Client, id: string) {
  const { data: session, error } = await supabase.from("spar_sessions").select().eq("id", id).single();
  if (error) throw error;

  const [{ data: participants }, { data: hostProfile }, { data: hostBoxer }] = await Promise.all([
    supabase.from("spar_participants").select().eq("spar_session_id", id),
    supabase.from("profiles").select("id, first_name, last_name").eq("id", session.host_id).maybeSingle(),
    supabase.from("boxers").select().eq("profile_id", session.host_id).maybeSingle(),
  ]);

  const participantIds = (participants ?? []).map((p) => p.user_id);
  const { data: participantProfiles } = participantIds.length
    ? await supabase.from("profiles").select("id, first_name, last_name").in("id", participantIds)
    : { data: [] };

  return {
    session,
    hostName: hostProfile ? `${hostProfile.first_name} ${hostProfile.last_name}`.trim() : "",
    hostBoxer,
    participants: (participants ?? []).map((p) => {
      const profile = participantProfiles?.find((pr) => pr.id === p.user_id);
      return { ...p, name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : "" };
    }),
  };
}

export async function getMyRequestForSession(supabase: Client, sparSessionId: string, userId: string) {
  const { data } = await supabase
    .from("spar_join_requests")
    .select()
    .eq("spar_session_id", sparSessionId)
    .eq("requester_id", userId)
    .maybeSingle();
  return data;
}

export async function requestToJoin(supabase: Client, sparSessionId: string, requesterId: string, message?: string) {
  const { error } = await supabase
    .from("spar_join_requests")
    .insert({ spar_session_id: sparSessionId, requester_id: requesterId, message });
  if (error) throw error;
}

export async function listJoinRequestsForHost(supabase: Client, hostId: string) {
  const { data: hostSessions } = await supabase.from("spar_sessions").select("id").eq("host_id", hostId);
  const sessionIds = (hostSessions ?? []).map((s) => s.id);
  if (sessionIds.length === 0) return [];
  const { data: requests, error } = await supabase
    .from("spar_join_requests")
    .select()
    .in("spar_session_id", sessionIds)
    .eq("status", "PENDING")
    .order("created_at", { ascending: true });
  if (error) throw error;

  const requesterIds = [...new Set((requests ?? []).map((r) => r.requester_id))];
  const { data: profiles } = requesterIds.length
    ? await supabase.from("profiles").select("id, first_name, last_name").in("id", requesterIds)
    : { data: [] };
  const { data: boxers } = requesterIds.length
    ? await supabase.from("boxers").select().in("profile_id", requesterIds)
    : { data: [] };
  const { data: sessions } = await supabase.from("spar_sessions").select().in("id", sessionIds);

  return (requests ?? []).map((r) => {
    const profile = profiles?.find((p) => p.id === r.requester_id);
    const boxer = boxers?.find((b) => b.profile_id === r.requester_id);
    const session = sessions?.find((s) => s.id === r.spar_session_id);
    return {
      ...r,
      requesterName: profile ? `${profile.first_name} ${profile.last_name}`.trim() : "",
      requesterBoxer: boxer,
      session,
    };
  });
}

export async function listMyJoinRequests(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("spar_join_requests")
    .select()
    .eq("requester_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const sessionIds = [...new Set((data ?? []).map((r) => r.spar_session_id))];
  const { data: sessions } = sessionIds.length
    ? await supabase.from("spar_sessions").select().in("id", sessionIds)
    : { data: [] };
  return (data ?? []).map((r) => ({ ...r, session: sessions?.find((s) => s.id === r.spar_session_id) }));
}

export async function acceptJoinRequest(supabase: Client, requestId: string, sparSessionId: string, requesterId: string) {
  const { error: acceptError } = await supabase
    .from("spar_join_requests")
    .update({ status: "ACCEPTED" })
    .eq("id", requestId);
  if (acceptError) throw acceptError;

  const { error: addError } = await supabase
    .from("spar_participants")
    .insert({ spar_session_id: sparSessionId, user_id: requesterId, role: "PARTICIPANT" });
  if (addError) throw addError;

  const { count } = await supabase
    .from("spar_participants")
    .select("id", { count: "exact", head: true })
    .eq("spar_session_id", sparSessionId);
  const { data: session } = await supabase.from("spar_sessions").select("max_participants").eq("id", sparSessionId).single();
  if (session && count !== null && count >= session.max_participants) {
    await supabase.from("spar_sessions").update({ status: "FULL" }).eq("id", sparSessionId);
  }
}

export async function declineJoinRequest(supabase: Client, requestId: string) {
  const { error } = await supabase.from("spar_join_requests").update({ status: "DECLINED" }).eq("id", requestId);
  if (error) throw error;
}

// Host-attested only — there's no real payment webhook behind this, so it
// is never treated as verified proof of payment, just a manual note the
// host can toggle after checking their own payment app.
export async function setParticipantPaymentConfirmed(supabase: Client, participantId: string, confirmed: boolean) {
  const { error } = await supabase.from("spar_participants").update({ payment_confirmed: confirmed }).eq("id", participantId);
  if (error) throw error;
}

export async function cancelSparSession(supabase: Client, id: string) {
  const { error } = await supabase.from("spar_sessions").update({ status: "CANCELLED" }).eq("id", id);
  if (error) throw error;
}

// A session is "past" once its date has gone by — that's when feedback opens
// up, without needing a separate host action to mark it COMPLETED.
export async function listSparHistory(supabase: Client, userId: string) {
  const { data: participating } = await supabase
    .from("spar_participants")
    .select("spar_session_id")
    .eq("user_id", userId);
  const ids = (participating ?? []).map((p) => p.spar_session_id);
  if (ids.length === 0) return [];
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("spar_sessions")
    .select()
    .in("id", ids)
    .lt("session_date", today)
    .order("session_date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getFeedbackGivenForSession(supabase: Client, sparSessionId: string, authorId: string) {
  const { data } = await supabase
    .from("spar_feedback")
    .select("target_id")
    .eq("spar_session_id", sparSessionId)
    .eq("author_id", authorId);
  return (data ?? []).map((f) => f.target_id);
}

export type SparFeedbackInput = {
  sparSessionId: string;
  authorId: string;
  targetId: string;
  wouldSparAgain: boolean;
  respectful?: boolean;
  controlledIntensity?: boolean;
  onTime?: boolean;
  matchedDescription?: boolean;
  safePartner?: boolean;
  goodCommunication?: boolean;
  privateComment?: string;
};

export async function submitSparFeedback(supabase: Client, input: SparFeedbackInput) {
  const { error } = await supabase.from("spar_feedback").insert({
    spar_session_id: input.sparSessionId,
    author_id: input.authorId,
    target_id: input.targetId,
    would_spar_again: input.wouldSparAgain,
    respectful: input.respectful,
    controlled_intensity: input.controlledIntensity,
    on_time: input.onTime,
    matched_description: input.matchedDescription,
    safe_partner: input.safePartner,
    good_communication: input.goodCommunication,
    private_comment: input.privateComment,
  });
  if (error) throw error;
}

export async function submitSparReport(
  supabase: Client,
  input: { sparSessionId?: string; reporterId: string; reportedId?: string; reason: string; details?: string }
) {
  const { error } = await supabase.from("spar_reports").insert({
    spar_session_id: input.sparSessionId,
    reporter_id: input.reporterId,
    reported_id: input.reportedId,
    reason: input.reason,
    details: input.details,
  });
  if (error) throw error;
}
