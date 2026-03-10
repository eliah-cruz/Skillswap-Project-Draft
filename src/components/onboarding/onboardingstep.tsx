"use client";
import React from 'react';
import { categories } from "../../constants/data";

export default function OnboardingStep({ state, setters, actions }: any) {
  
  const currentSkills = state.mySkills || [];

  const toggleSkill = (skill: string) => {
    if (currentSkills.includes(skill)) {
      setters.setMySkills(currentSkills.filter((s: string) => s !== skill));
    } else {
      setters.setMySkills([...currentSkills, skill]);
    }
  };

  const handleFinish = () => {
    // 1. Save data permanently via the Hook action
    if (actions?.saveToPhoneBook) {
        actions.saveToPhoneBook(state.userEmail, state.userName, currentSkills, state.messages);
    }
    
    // 2. Clear onboarding locks
    localStorage.removeItem("skillswap_onboarding_active");
    localStorage.setItem("skillswap_logged_in", "true");

    // 3. Switch View to Dashboard
    setters.setShowBioStep(false);
    setters.setIsLoggedIn(true);
    
    if (actions?.triggerToast) {
        actions.triggerToast("Profile set up complete!");
    }
  };

  return (
    <div className="container px-5 mx-auto flex items-center justify-center min-h-[85vh] py-20 animate-in fade-in duration-700">
      <div className="max-w-4xl w-full">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-4">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
             </span>
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Onboarding Step 1</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Welcome, <span className="text-indigo-600">{state.userName || "User"}</span>!
          </h1>
          <p className="text-slate-500 font-medium">What skills do you want to share with the community today?</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 md:p-12 relative overflow-hidden">
          
          {!state.onboardingCategory ? (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Select a Category</h2>
                <div className="h-px flex-1 bg-slate-100 mx-6"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(cat => (
                  <button 
                    key={cat.title} 
                    onClick={() => setters.setOnboardingCategory(cat)} 
                    className="group cursor-pointer p-6 rounded-[2rem] bg-slate-50 border border-transparent hover:bg-white hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col items-center gap-4 text-center"
                  >
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                    <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-indigo-600 tracking-widest">{cat.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setters.setOnboardingCategory(null)} 
                  className="cursor-pointer h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{state.onboardingCategory.title}</h2>
                  <p className="text-xs font-bold text-slate-400">Pick the skills you are good at</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
                {state.onboardingCategory.skills.map((skill: string) => {
                  const isSelected = currentSkills.includes(skill);
                  return (
                    <button 
                      key={skill} 
                      onClick={() => toggleSkill(skill)} 
                      className={`cursor-pointer p-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30 -translate-y-1' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400">
                  {currentSkills.length} skills selected
                </p>
                <button 
                  onClick={handleFinish} 
                  disabled={currentSkills.length === 0}
                  className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                    currentSkills.length > 0 
                      ? 'bg-slate-900 text-white cursor-pointer hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-95' 
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  Complete Setup →
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Secure Account: {state.userEmail || "Unverified"}
        </p>
      </div>
    </div>
  );
}