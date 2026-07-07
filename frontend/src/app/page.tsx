"use client";
import { useRef, useEffect, useState } from "react";
import { useSkillSwap } from "../hooks/useSkillSwap";

import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import LandingHero from "../components/landing/landinghero";
import HowItWorks from "../components/landing/howitworks";
import DashboardHub from "../components/dashboard/dashboardhub";
import UserProfile from "../components/dashboard/userprofile"; 
import UserSettings from "../components/dashboard/usersettings"; 
import Loader2 from "../components/shared/loader2";
import Messenger from "../components/shared/messenger";
import Toast from "../components/shared/toast";
import SkillDirectory from "../components/shared/skilldirectory";
import AdminPanel from "../components/dashboard/adminpanel";
import { ShieldCheck, Sparkles } from "lucide-react";
import AuthVerificationScreen from "../components/shared/authverificationscreen";

export default function Home() {
  const { state, setters, actions } = useSkillSwap();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isCallbackTab, setIsCallbackTab] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Security Cleanup for Legacy Mock Storage Artifacts
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("skillswap_users_list");
    }
  }, []);

  // Detect Redirect Callback Tab
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const query = window.location.search;
      
      if (hash.includes("access_token") || query.includes("code=")) {
        setIsCallbackTab(true);
      }
    }
  }, []);

  // Countdown timer and auto-close logic
  useEffect(() => {
    if (isCallbackTab && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isCallbackTab && countdown === 0) {
      try {
        window.close();
      } catch (err) {
        console.log("Programmatic window close restricted by browser sandbox.");
      }
    }
  }, [isCallbackTab, countdown]);

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

  if (isCallbackTab) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 animate-in fade-in duration-500">
        <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
            <ShieldCheck size={36} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Verified Successfully!</h2>
          <p className="text-slate-500 font-bold text-sm leading-relaxed mb-6">
            Authentication complete. Your session is active.
          </p>

          <div className="flex flex-col gap-4 items-center">
            <button 
              onClick={() => {
                window.location.href = window.location.origin;
              }}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-900 transition-all cursor-pointer shadow-lg shadow-indigo-200 w-full"
            >
              Enter SkillSwap Hub
            </button>

            <div className="px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg tracking-widest inline-flex items-center gap-1.5">
              <Sparkles size={12} className="animate-pulse" /> 
              {countdown > 0 ? `Auto-closing tab in ${countdown}s...` : "Feel free to close this tab"}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {state.isLoggedIn ? (
          <>
            {state.activeTab === 'hub' && <DashboardHub state={state} setters={setters} actions={actions} />}
            {state.activeTab === 'profile' && <UserProfile state={state} setters={setters} actions={actions} />}
            {state.activeTab === 'settings' && <UserSettings state={state} setters={setters} actions={actions} />}
            {state.activeTab === 'chat' && <DashboardHub state={state} setters={setters} actions={actions} />}
            
            {/* Secure Route Guard */}
            {state.activeTab === 'admin' && state.isAdmin && <AdminPanel state={state} setters={setters} actions={actions} />}
          </>
        ) : (
          <>
            <LandingHero state={state} setters={setters} actions={actions} />
            <HowItWorks />
          </>
        )}
      </div>

      <SkillDirectory state={state} setters={setters} actions={actions} />
      <AuthVerificationScreen state={state} />
      <Toast toast={state.toast} />
      
      <Messenger 
        state={state} 
        setters={setters} 
        actions={actions} 
        chatEndRef={chatEndRef} 
      />
      
      {/* Footer hidden after user log in or sign in */}
      {!state.isLoggedIn && <Footer state={state} setters={setters} />}

      {/* Global Scroll up button (renders in both landing and dashboard hub views) */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
        className={`cursor-pointer fixed bottom-8 right-8 z-[150] transition-all duration-500 transform group ${state.showScroll ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}`}
      >
          <span className="absolute inset-0 rounded-full bg-indigo-400 opacity-75 animate-ping"></span>
          <div className="relative bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg shadow-indigo-200 transition-transform active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </div>
      </button>
    </main>
  );
}