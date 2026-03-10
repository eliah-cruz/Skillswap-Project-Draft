"use client";
import { useRef, useEffect } from "react";
import { useSkillSwap } from "../hooks/useSkillSwap";
import { Message } from "../types"; 

import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import LandingHero from "../components/landing/landinghero";
import HowItWorks from "../components/landing/howitworks";
import OnboardingStep from "../components/onboarding/onboardingstep";
import DashboardHub from "../components/dashboard/dashboardhub";
import UserProfile from "../components/dashboard/userprofile"; 
import UserSettings from "../components/dashboard/usersettings"; 
import Loader2 from "../components/shared/loader2";
import Messenger from "../components/shared/messenger";
import Toast from "../components/shared/toast";
import SkillDirectory from "../components/shared/skilldirectory";

export default function Home() {
  const { state, setters, actions } = useSkillSwap();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ 
        top: element.getBoundingClientRect().top + window.scrollY - 100, 
        behavior: "smooth" 
      });
    }
  };

  // Keep chat scrolled to bottom
  useEffect(() => {
    if (state.showChat) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.messages, state.isPartnerTyping, state.showChat]);

  if (state.loading || state.isLoggingOut) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 />
      <p className="mt-6 text-indigo-600 font-black animate-pulse tracking-widest text-[10px] uppercase">
        {state.isLoggingOut ? "Saving..." : "Loading..."}
      </p>
    </div>
  );

  return (
    <main className={`min-h-screen selection:bg-indigo-100 overflow-x-hidden ${state.isLoggedIn ? 'bg-slate-50' : 'bg-white'}`}>
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-200/50 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <Header state={state} setters={setters} actions={actions} scrollTo={scrollTo} />
      <div className="h-28"></div>

      <div className="relative z-10">
        {state.showBioStep ? (
          <OnboardingStep state={state} setters={setters} actions={actions} />
        ) : state.isLoggedIn ? (
          <>
            {state.activeTab === 'hub' && <DashboardHub state={state} setters={setters} actions={actions} />}
            {state.activeTab === 'profile' && <UserProfile state={state} setters={setters} actions={actions} />}
            {state.activeTab === 'settings' && <UserSettings state={state} setters={setters} actions={actions} />}
            {state.activeTab === 'chat' && <DashboardHub state={state} setters={setters} actions={actions} />}
          </>
        ) : (
          <>
            <LandingHero state={state} setters={setters} actions={actions} />
            <HowItWorks />
          </>
        )}
      </div>

      <SkillDirectory state={state} setters={setters} actions={actions} />
      <Toast toast={state.toast} />
      
      {/* Updated to use actions.handleSendMessage directly from hook */}
      <Messenger 
        state={state} 
        setters={setters} 
        actions={actions} 
        chatEndRef={chatEndRef} 
      />
      
      <Footer state={state} />
    </main>
  );
}