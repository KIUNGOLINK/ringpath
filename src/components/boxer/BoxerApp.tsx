"use client";

import { LogoMark } from "@/components/Logo";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { useBoxerApp } from "./useBoxerApp";
import { Onboarding, Login } from "./Onboarding";
import { AppShellContent } from "./AppShell";
import { BottomNav } from "./BottomNav";
import { SessionDetail } from "./SessionDetail";
import { SparringTimer } from "./SparringTimer";
import { VideoReview } from "./VideoReview";
import { AddSheet } from "./AddSheet";
import { CompleteSheet } from "./CompleteSheet";
import { Toast } from "./Toast";

function Loading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <LogoMark size={42} />
    </div>
  );
}

export function BoxerApp() {
  const api = useBoxerApp();
  const { state } = api;

  const contentBg = state.activeTab === "passport" && state.screen === "app" ? "#F5F3EE" : "#070707";
  const lightChrome = state.screen === "onboarding" && state.onboardStep === 0;

  return (
    <PhoneFrame
      dark={!lightChrome}
      contentBg={contentBg}
      overlay={
        <>
          {state.screen === "app" && <BottomNav api={api} />}
          {state.showAddSheet && <AddSheet api={api} />}
          {state.showCompleteSheet && <CompleteSheet api={api} />}
          {state.toast && <Toast text={state.toast} />}
        </>
      }
    >
      {state.screen === "loading" && <Loading />}
      {state.screen === "onboarding" && <Onboarding api={api} />}
      {state.screen === "login" && <Login api={api} />}
      {state.screen === "app" && <AppShellContent api={api} />}
      {state.screen === "sessionDetail" && <SessionDetail api={api} />}
      {state.screen === "sparringTimer" && <SparringTimer api={api} />}
      {state.screen === "videoReview" && <VideoReview api={api} />}
    </PhoneFrame>
  );
}
