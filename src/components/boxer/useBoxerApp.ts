"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { completeSession, getBoxerBundle, joinClub, signUpBoxer, updateBoxerPhoto } from "@/lib/supabase/queries";
import { getAppMode, setAppMode } from "@/lib/supabase/spar";
import { translateAuthError } from "@/lib/authErrors";
import { playBell, playWarning } from "@/lib/timerSounds";
import { BoxerState, INITIAL_STATE, INITIAL_TIMER, Stance, Tab, CampTab, Session, TimerState } from "./types";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function useBoxerApp() {
  const [state, setState] = useState<BoxerState>(INITIAL_STATE);
  const supabase = createClient();
  const router = useRouter();
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
        photoUrl: boxer?.photo_url ?? null,
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
            scheduledFor: sess.scheduled_for,
            energy: sess.energy,
            difficulty: sess.difficulty,
          })
        ),
      }));
    },
    [supabase]
  );

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return;
      if (data.session?.user) {
        const mode = await getAppMode(supabase, data.session.user.id);
        if (cancelled) return;
        if (mode === "spar") {
          router.replace("/app/spar");
          return;
        }
        loadBundle(data.session.user.id);
      } else {
        setState((s) => ({ ...s, screen: "onboarding" }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [supabase, router, loadBundle]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const timerRef = useRef<TimerState>(state.timer);
  useEffect(() => {
    timerRef.current = state.timer;
  }, [state.timer]);

  useEffect(() => {
    if (!state.timer.running) return;
    const id = setInterval(() => {
      const t = timerRef.current;
      let next: TimerState;
      if (t.seconds > 1) {
        next = { ...t, seconds: t.seconds - 1 };
        if (next.seconds === 10) playWarning();
      } else if (!t.isRest) {
        next = t.round >= t.totalRounds ? { ...t, running: false, seconds: 0 } : { ...t, isRest: true, seconds: t.restSeconds };
        playBell();
      } else {
        next = { ...t, isRest: false, round: t.round + 1, seconds: t.workSeconds };
        playBell();
      }
      timerRef.current = next;
      setState((s) => ({ ...s, timer: next }));
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
      if (data.session?.user) {
        if (state.sparIntent) {
          await setAppMode(supabase, data.session.user.id, "spar");
          router.push("/app/spar");
          return;
        }
        await loadBundle(data.session.user.id);
      }
      setState((s) => ({ ...s, authSubmitting: false }));
    } catch (err) {
      setState((s) => ({
        ...s,
        authSubmitting: false,
        authError: err instanceof Error ? translateAuthError(err.message) : "Une erreur est survenue. Réessaie.",
      }));
    }
  }, [supabase, router, state.email, state.password, state.firstName, state.lastName, state.weight, state.stance, state.clubCode, state.sparIntent, loadBundle]);

  const setSparIntent = useCallback((intent: boolean) => setState((s) => ({ ...s, sparIntent: intent })), []);

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
    if (data.session?.user) {
      const mode = await getAppMode(supabase, data.session.user.id);
      if (mode === "spar") {
        router.push("/app/spar");
        return;
      }
      await loadBundle(data.session.user.id);
    }
    setState((s) => ({ ...s, authSubmitting: false }));
  }, [supabase, router, state.email, state.password, loadBundle]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ ...INITIAL_STATE, screen: "onboarding" });
  }, [supabase]);

  const reloadBundle = useCallback(async () => {
    if (!state.userId) return;
    await loadBundle(state.userId);
  }, [state.userId, loadBundle]);

  const uploadPhoto = useCallback(
    async (file: File) => {
      if (!state.userId) return;
      const path = `${state.userId}/photo.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { contentType: file.type || "image/jpeg", upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;
      await updateBoxerPhoto(supabase, state.userId, url);
      await loadBundle(state.userId);
    },
    [supabase, state.userId, loadBundle]
  );

  const joinClubWithCode = useCallback(
    async (code: string) => {
      if (!state.userId) return;
      await joinClub(supabase, state.userId, code);
      await loadBundle(state.userId);
    },
    [supabase, state.userId, loadBundle]
  );

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
    const t = state.timer;
    if (t.running) {
      setState((s) => ({ ...s, timer: { ...s.timer, running: false } }));
      return;
    }
    if (t.seconds > 0 || t.round < t.totalRounds) {
      playBell();
      setState((s) => ({ ...s, timer: { ...s.timer, running: true } }));
    }
  }, [state.timer]);
  const resetTimer = useCallback(() => setState((s) => ({ ...s, timer: { ...INITIAL_TIMER } })), []);
  const setTimerRounds = useCallback(
    (n: number) => setState((s) => ({ ...s, timer: { ...s.timer, totalRounds: n } })),
    []
  );
  const setTimerWork = useCallback(
    (seconds: number) =>
      setState((s) => {
        const t = s.timer;
        const syncDisplay = !t.isRest && t.seconds === t.workSeconds;
        return { ...s, timer: { ...t, workSeconds: seconds, seconds: syncDisplay ? seconds : t.seconds } };
      }),
    []
  );
  const setTimerRest = useCallback(
    (seconds: number) => setState((s) => ({ ...s, timer: { ...s.timer, restSeconds: seconds } })),
    []
  );

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
    joinClubWithCode,
    setSparIntent,
    uploadPhoto,
    reloadBundle,
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
    setTimerRounds,
    setTimerWork,
    setTimerRest,
  };
}

export type BoxerAppApi = ReturnType<typeof useBoxerApp>;
