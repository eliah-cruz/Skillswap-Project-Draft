"use client";
import React from 'react';
import Loader1 from "../shared/loader1";

export default function LandingHero({ state, setters, actions }: any) {
  
  // Helper to switch between Login and Sign Up
  const handleToggle = (view: boolean) => {
    setters.setIsLoginView(view);
  };

  return (
    <section className="container px-5 mx-auto flex flex-col-reverse lg:flex-row items-center justify-between pb-24 gap-12 relative z-10">
      
      {/* LEFT SIDE: Content & Form */}
      <div className="lg:w-1/2 w-full text-center lg:text-left pt-12">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-50/50 border border-indigo-100 mb-8 animate-in slide-in-from-top-4 duration-1000">
          <span className="text-sm animate-pulse">✨</span>
          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">
              {state.isLoginView ? "Welcome back to the hub" : "Start your journey today"}
          </span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
          {state.isLoginView ? "Log into" : "Teach"} <span className="text-indigo-600">Hub</span>.<br />
          Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Swapping</span>.
        </h1>
        
        {/* THE MAIN CARD */}
        <div className="bg-white/80 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-10 border border-white max-w-[460px] w-full text-left relative overflow-hidden">
          
          <h2 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">
            {state.isLoginView ? "Welcome Back" : "Start Swapping"}
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase mb-8 tracking-widest">
            {state.isLoginView ? "Enter your credentials" : "Secure Passwordless Entry"}
          </p>
          
          <form onSubmit={actions.handleAuth} className="space-y-4">
            {/* FULL NAME: Hidden if state.isLoginView is true */}
            {!state.isLoginView && (
              <div className="relative group animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <input 
                  required 
                  name="fullName" 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full bg-slate-50/50 py-4.5 pl-14 pr-6 rounded-2xl border border-slate-100 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 font-medium text-slate-700 transition-all" 
                />
              </div>
            )}
            
            {/* EMAIL INPUT */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <input 
                  required 
                  name="email" 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-slate-50/50 py-4.5 pl-14 pr-6 rounded-2xl border border-slate-100 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 font-medium text-slate-700 transition-all" 
              />
            </div>
            
            {/* SUBMIT BUTTON */}
            <button type="submit" className="cursor-pointer w-full bg-[#4f46e5] text-white font-black py-4.5 rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all mt-4 text-sm tracking-tight flex items-center justify-center gap-3">
              {state.isSubmitting ? <Loader1 /> : (
                <>
                  <span>{state.isLoginView ? "Log in" : "Get Magic Link"}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </>
              )}
            </button>
          </form>
          
          {/* TOGGLE OPTIONS: Switches between Login and Register */}
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-4">
            <button 
              type="button"
              onClick={() => handleToggle(false)} 
              className={`cursor-pointer flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!state.isLoginView ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              New here?
            </button>
            
            <div className="w-px h-4 bg-slate-200"></div>

            <button 
              type="button"
              onClick={() => handleToggle(true)} 
              className={`cursor-pointer flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${state.isLoginView ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Have account?
            </button>
          </div>

        </div>
      </div>
      
      {/* RIGHT SIDE: VISUAL STACK (Maintained UI) */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-[700px] items-center justify-center scale-90 xl:scale-100">
        
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-200/40 rounded-full blur-[100px] animate-pulse delay-700"></div>
        
        {/* Main Floating Card */}
        <div className="relative z-30 animate-[bounce_7s_ease-in-out_infinite]">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(79,70,229,0.15)] border border-slate-50 w-80 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-2xl shadow-lg">JD</div>
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Lead Developer</p>
                <h3 className="font-bold text-slate-900 text-xl">James Dean</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <span className="text-[9px] font-black text-slate-400 uppercase">Teaches</span>
                <span className="text-xs font-bold text-slate-700">C++</span>
              </div>
              <div className="flex justify-between items-center bg-indigo-50 p-3 rounded-xl">
                <span className="text-[9px] font-black text-indigo-400 uppercase">Wants</span>
                <span className="text-xs font-bold text-indigo-600">Figma</span>
              </div>
            </div>
          </div>
        </div>

        {/* Small Floating Status Card */}
        <div className="absolute top-10 -right-4 z-20 animate-[bounce_5s_ease-in-out_infinite_0.5s]">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white w-60 hover:scale-110 transition-transform cursor-default">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center font-black text-emerald-600 text-xs">SC</div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Available Now</p>
                <p className="text-xs font-black text-slate-800">Sarah • Marketing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Bubble */}
        <div className="absolute bottom-10 -left-12 z-40 animate-[bounce_6s_ease-in-out_infinite_1.5s]">
          <div className="bg-white/95 backdrop-blur-md p-5 rounded-[2rem] shadow-2xl border border-white w-64 hover:rotate-2 transition-all">
            <div className="flex items-center gap-3 mb-3">
               <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Live Chatting</span>
            </div>
            <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
              "Just learned how to build a landing page in exchange for Spanish lessons!"
            </p>
          </div>
        </div>

        {/* Verified Badge */}
        <div className="absolute top-20 -left-8 z-10 animate-[bounce_8s_ease-in-out_infinite_2s]">
          <div className="bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            <span className="text-[10px] font-black uppercase tracking-widest">Verified Hub</span>
          </div>
        </div>

      </div>
    </section>
  );
}