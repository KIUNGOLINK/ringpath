"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { completeSession, getBoxerBundle, signUpBoxer } from "@/lib/supabase/queries";
import { translateAuthError } from "@/lib/authErrors";
import { BoxerState, INITIAL_STATE, INITIAL_TIMER, Stance, Tab, CampTab, Session } from "./types";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function useBoxerApp() {
  const [state, setState] = useState<BoxerState>(INITIAL_STATE);
  const supabase = createClient();
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadBundle = useCallback(
    async (userId: string) => {
      const { profile, boxer, camp, sessions, coachName } = await getBoxerBundle(supabase, userId);
      setState((s) => ({
        ...s,
        screen: "app",
        userId,
        firstName: profile?.first_name ?? "",
        lastName: profile?.last_name ?? "",
        weight: boxer?.weight_kg != null ? String(boxer.weight_kg) : s.weight,
        stance: (boxer?.stance as Stance) ?? s.stance,
        coachName,
        wins: boxer?.wins ?? 0,
        losses: boxer?.losses ?? 0,
        camp: camp
          ? {
              id: camp.id,
              opponentName: camp.opponent_name,
              fightDate: camp.fight_date,
              weekCurrent: camp.week_current,
              weekTotal: camp.week_total,
              objectives: camp.objectives,
            }
          : null,
        sessions: sessions.map(
          (sess): Session => ({
            id: sess.id,
            time: formatTime(sess.scheduled_for),
            title: sess.title,
            sub: sess.subtitle,
            completed: sess.completed,
            sessionType: sess.session_type,
            durationMinutes: sess.duration_minutes,
            objective: sess.objective,
          })
        ),
      }));
    },
    [supabase]
  );

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session?.user) {
        loadBundle(data.session.user.id);
      } else {
        setState((s) => ({ ...s, screen: "onboarding" }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [supabase, loadBundle]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!state.timer.running) return;
    const id = setInterval(() => {
      setState((s) => {
        const t = s.timer;
        if (t.seconds > 1) {
          return { ...s, timer: { ...t, seconds: t.seconds - 1 } };
        }
        if (!t.isRest) {
          if (t.round >= t.totalRounds) {
            return { ...s, timer: { ...t, running: false, seconds: 0 } };
          }
          return { ...s, timer: { ...t, isRest: true, seconds: t.restSeconds } };
        }
        return { ...s, timer: { ...t, isRest: false, round: t.round + 1, seconds: t.workSeconds } };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state.timer.running]);

  const toast = useCallback((text: string) => {
    setState((s) => ({ ...s, toast: text }));
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setState((s) => ({ ...s, toast: null })), 2500);
  }, []);

  // ---- onboarding draft fields ----
  const goToStep = useCallback((step: 0 | 1 | 2 | 3) => setState((s) => ({ ...s, onboardStep: step })), []);
  const setFirstName = useCallback((v: string) => setState((s) => ({ ...s, firstName: v })), []);
  const setLastName = useCallback((v: string) => setState((s) => ({ ...s, lastName: v })), []);
  const setWeight = useCallback((v: string) => setState((s) => ({ ...s, weight: v })), []);
  const setStance = useCallback((v: Stance) => setState((s) => ({ ...s, stance: v })), []);
  const setClubCode = useCallback((v: string) => setState((s) => ({ ...s, clubCode: v })), []);
  const setEmail = useCallback((v: string) => setState((s) => ({ ...s, email: v })), []);
  const setPassword = useCallback((v: string) => setState((s) => ({ ...s, password: v })), []);
  const goToLogin = useCallback(() => setState((s) => ({ ...s, screen: "login", authError: null })), []);
  const goToOnboarding = useCallback(
    () => setState((s) => ({ ...s, screen: "onboarding", onboardStep: 0, authError: null })),
    []
  );

  const enterApp = useCallback(async () => {
    setState((s) => ({ ...s, authSubmitting: true, authError: null }));
    try {
      const { needsEmailConfirmation } = await signUpBoxer(supabase, {
        email: state.email,
        password: state.password,
        firstName: state.firstName,
        lastName: state.lastName,
        weightKg: state.weight ? Number(state.weight) : null,
        stance: state.stance,
        clubCode: state.clubCode,
      });
      if (needsEmailConfirmation) {
        setState((s) => ({
          ...s,
          authSubmitting: false,
          authError: "Vérifie ton email pour confirmer ton compte, puis connecte-toi.",
          screen: "login",
        }));
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) await loadBundle(data.session.user.id);
      setState((s) => ({ ...s, authSubmitting: false }));
    } catch (err) {
      setState((s) => ({
        ...s,
        authSubmitting: false,
        authError: err instanceof Error ? translateAuthError(err.message) : "Une erreur est survenue. Réessaie.",
      }));
    }
  }, [supabase, state.email, state.password, state.firstName, state.lastName, state.weight, state.stance, state.clubCode, loadBundle]);

  const login = useCallback(async () => {
    setState((s) => ({ ...s, authSubmitting: true, authError: null }));
    const { data, error } = await supabase.auth.signInWithPassword({
      email: state.email,
      password: state.password,
    });
    if (error) {
      setState((s) => ({ ...s, authSubmitting: false, authError: translateAuthError(error.message) }));
      return;
    }
    if (data.session?.user) await loadBundle(data.session.user.id);
    setState((s) => ({ ...s, authSubmitting: false }));
  }, [supabase, state.email, state.password, loadBundle]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ ...INITIAL_STATE, screen: "onboarding" });
  }, [supabase]);

  // ---- tabs ----
  const setActiveTab = useCallback((tab: Tab) => setState((s) => ({ ...s, activeTab: tab })), []);
  const setCampTab = useCallback((tab: CampTab) => setState((s) => ({ ...s, campTab: tab })), []);

  // ---- session detail ----
  const openSession = useCallback(
    (id: string) =>
      setState((s) => {
        const session = s.sessions.find((sess) => sess.id === id);
        if (!session || session.completed) return s;
        return { ...s, screen: "sessionDetail", activeSessionId: id, sessionPhase: "detail" };
      }),
    []
  );
  const closeSession = useCallback(() => setState((s) => ({ ...s, screen: "app" })), []);
  const startOrComplete = useCallback(
    () =>
      setState((s) =>
        s.sessionPhase === "detail"
          ? { ...s, sessionPhase: "during" }
          : { ...s, showCompleteSheet: true }
      ),
    []
  );
  const setEnergy = useCallback((n: number) => setState((s) => ({ ...s, energy: n })), []);
  const setDifficulty = useCallback((n: number) => setState((s) => ({ ...s, difficulty: n })), []);
  const finishSession = useCallback(async () => {
    const sessionId = state.activeSessionId;
    const { energy, difficulty } = state;
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((sess) =>
        sess.id === s.activeSessionId ? { ...sess, completed: true } : sess
      ),
      showCompleteSheet: false,
      screen: "app",
      energy: 0,
      difficulty: 0,
    }));
    toast("Séance ajoutée à ton parcours.");
    if (sessionId) {
      try {
        await completeSession(supabase, sessionId, energy, difficulty);
      } catch {
        toast("Enregistré localement — synchronisation impossible pour l'instant.");
      }
    }
  }, [supabase, state.activeSessionId, state.energy, state.difficulty, toast]);

  // ---- add sheet ----
  const openAddSheet = useCallback(() => setState((s) => ({ ...s, showAddSheet: true })), []);
  const closeAddSheet = useCallback(() => setState((s) => ({ ...s, showAddSheet: false })), []);
  const openSparringFromSheet = useCallback(
    () => setState((s) => ({ ...s, showAddSheet: false, screen: "sparringTimer" })),
    []
  );

  // ---- video review ----
  const openVideoReview = useCallback(
    () => setState((s) => ({ ...s, screen: "videoReview", activeMarker: 0 })),
    []
  );
  const closeVideoReview = useCallback(() => setState((s) => ({ ...s, screen: "app" })), []);
  const setActiveMarker = useCallback((i: number) => setState((s) => ({ ...s, activeMarker: i })), []);

  // ---- sparring timer ----
  const openSparringTimer = useCallback(() => setState((s) => ({ ...s, screen: "sparringTimer" })), []);
  const closeSparringTimer = useCallback(
    () => setState((s) => ({ ...s, screen: "app", timer: { ...INITIAL_TIMER } })),
    []
  );
  const toggleTimer = useCallback(() => {
    setState((s) => {
      const t = s.timer;
      if (t.running) return { ...s, timer: { ...t, running: false } };
      if (t.seconds > 0 || t.round < t.totalRounds) return { ...s, timer: { ...t, running: true } };
      return s;
    });
  }, []);
  const resetTimer = useCallback(() => setState((s) => ({ ...s, timer: { ...INITIAL_TIMER } })), []);

  return {
    state,
    toast,
    goToStep,
    setFirstName,
    setLastName,
    setWeight,
    setStance,
    setClubCode,
    setEmail,
    setPassword,
    goToLogin,
    goToOnboarding,
    enterApp,
    login,
    logout,
    setActiveTab,
    setCampTab,
    openSession,
    closeSession,
    startOrComplete,
    setEnergy,
    setDifficulty,
    finishSession,
    openAddSheet,
    closeAddSheet,
    openSparringFromSheet,
    openVideoReview,
    closeVideoReview,
    setActiveMarker,
    openSparringTimer,
    closeSparringTimer,
    toggleTimer,
    resetTimer,
  };
}

export type BoxerAppApi = ReturnType<typeof useBoxerApp>;
