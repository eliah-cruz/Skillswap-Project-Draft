"use client";
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, Plus, Check, Sparkles, LayoutGrid, ArrowRight, Search } from 'lucide-react';
import { categories } from "../../constants/data";

export default function SkillDirectory({ state, setters, actions }: any) {
  const [skillSearch, setSkillSearch] = useState("");
  
  // Fix: Prevent dashboard background from scrolling when the Skill Directory is active on all devices
  useEffect(() => {
    if (state.showDirectory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [state.showDirectory]);

  if (!state.showDirectory) return null;
  
  const isLearning = state.addingSkillType === 'learning';
  const activeList = isLearning ? state.myNeeds : state.mySkills;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] w-full max-w-3xl overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.5)] border-[3px] md:border-4 border-white flex flex-col h-[90vh] md:max-h-[85vh] relative">
        
        {/* Step Header */}
        <div className="p-5 md:p-8 lg:p-10 pb-4 md:pb-5 border-b-2 border-slate-50 flex justify-between items-start md:items-center bg-white shrink-0 relative z-10 gap-4">
          <div className="flex items-center gap-3 md:gap-5">
            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-white shadow-md md:shadow-xl shrink-0 ${isLearning ? 'bg-emerald-500 shadow-emerald-200' : 'bg-indigo-600 shadow-indigo-200'}`}>
              <LayoutGrid className="w-5 h-5 md:w-7 md:h-7" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-slate-900 uppercase tracking-[0.1em] md:tracking-[0.2em] text-xs md:text-sm">
                {isLearning ? "Choose desired skills" : "What can you teach?"} <span className="text-slate-400 text-[9px] md:text-xs font-extrabold">(Max 5)</span>
              </h3>
              <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1">
                <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                <p className="text-[9px] md:text-[11px] text-slate-500 font-black uppercase tracking-tight">{activeList?.length || 0}/5 Skills Collected</p>
              </div>
            </div>
          </div>

          <button onClick={() => { setters.setShowDirectory(false); setters.setOnboardingCategory(null); }} className="cursor-pointer w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all border border-slate-100 shadow-sm active:scale-90 shrink-0">
            <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
          </button>
        </div>

        {/* Guided Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 px-5 md:px-8 lg:px-10 pt-3 md:pt-4 gap-4 md:gap-6 overflow-x-auto no-scrollbar shrink-0">
          <button 
            onClick={() => { setters.setAddingSkillType('teaching'); setters.setOnboardingCategory(null); }}
            className={`pb-3 md:pb-4 text-[10px] md:text-xs font-black uppercase tracking-wider transition-all border-b-4 whitespace-nowrap ${!isLearning ? 'border-indigo-600 text-indigo-600 font-black' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Step 1: Teachable Skills ({state.mySkills.length}/5)
          </button>
          <button 
            onClick={() => { setters.setAddingSkillType('learning'); setters.setOnboardingCategory(null); }}
            className={`pb-3 md:pb-4 text-[10px] md:text-xs font-black uppercase tracking-wider transition-all border-b-4 whitespace-nowrap ${isLearning ? 'border-emerald-500 text-emerald-500 font-black' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Step 2: Desired Skills ({state.myNeeds.length}/5)
          </button>
        </div>

        {/* Main Selection Area */}
        <div className="overflow-y-auto pb-8 md:pb-12 bg-white flex-1 no-scrollbar">
          <div className="px-5 md:px-8 lg:px-10 pt-6 md:pt-10">
            {!state.onboardingCategory ? (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
                  <div className="h-[2px] bg-slate-100 flex-1"></div>
                  <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-400 shrink-0 text-center">Select a Department</h4>
                  <div className="h-[2px] bg-slate-100 flex-1"></div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6">
                  {categories.map(cat => (
                    <button key={cat.title} onClick={() => { setters.setOnboardingCategory(cat); setSkillSearch(""); }} className={`cursor-pointer p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-50 border-2 border-transparent hover:bg-white hover:shadow-2xl transition-all text-left group relative flex flex-col md:block ${isLearning ? 'hover:border-emerald-500 hover:shadow-emerald-100' : 'hover:border-indigo-500 hover:shadow-indigo-100'}`}>
                      <div className={`w-12 h-12 md:w-16 md:h-16 bg-white rounded-[1rem] md:rounded-2xl flex items-center justify-center text-2xl md:text-4xl mb-4 md:mb-6 shadow-sm border border-slate-100 group-hover:scale-110 group-hover:text-white transition-all duration-300 ${isLearning ? 'group-hover:bg-emerald-500' : 'group-hover:bg-indigo-600'}`}>
                        {cat.icon}
                      </div>
                      <span className="text-[11px] md:text-sm font-black uppercase text-slate-900 tracking-wider block mb-1">{cat.title}</span>
                      <p className={`text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 md:gap-2 transition-colors ${isLearning ? 'group-hover:text-emerald-600' : 'group-hover:text-indigo-600'}`}>
                        Explore <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={3} />
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-right-8 duration-400">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
                  <button onClick={() => setters.setOnboardingCategory(null)} className={`cursor-pointer group text-[9px] md:text-[11px] font-black uppercase tracking-widest flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all shadow-sm shrink-0 ${isLearning ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white' : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white'}`}>
                    <ChevronLeft className="w-4 h-4 md:w-[18px] md:h-[18px] group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
                    Categories
                  </button>
                  
                  <div className="relative w-full sm:w-64 shrink-0">
                    <Search className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 md:w-4 md:h-4" />
                    <input 
                      type="text" placeholder="Find skill..." value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)}
                      className={`w-full bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl py-2.5 md:py-3 pl-9 md:pl-10 pr-4 text-[10px] md:text-xs font-bold text-slate-700 outline-none focus:bg-white transition-all ${isLearning ? 'focus:border-emerald-500' : 'focus:border-indigo-500'}`}
                    />
                  </div>
                </div>

                <div className={`mb-6 md:mb-10 pl-4 md:pl-6 border-l-4 text-left ${isLearning ? 'border-emerald-500' : 'border-indigo-600'}`}>
                  <h2 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">{state.onboardingCategory.title}</h2>
                  <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mt-1 md:mt-2">Tap to {isLearning ? "add to your wishlist" : "add to your repertoire"}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {state.onboardingCategory.skills
                    .filter((s: string) => s.toLowerCase().includes(skillSearch.toLowerCase()))
                    .map((skill: string) => {
                    const isSelected = activeList?.includes(skill);
                    
                    return (
                      <button 
                        key={skill} 
                        onClick={() => {
                          if(isLearning) {
                              isSelected ? actions.removeNeed(skill) : actions.addNeed(skill);
                          } else {
                              isSelected ? actions.removeSkill(skill) : actions.addSkill(skill);
                          }
                        }} 
                        className={`group cursor-pointer p-4 md:p-6 rounded-[1.2rem] md:rounded-[2rem] border-2 transition-all flex items-center justify-between text-left relative overflow-hidden ${isSelected ? (isLearning ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md md:shadow-lg shadow-emerald-100' : 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-md md:shadow-lg shadow-indigo-100') : 'bg-white border-slate-100 text-slate-900 hover:border-slate-900 hover:shadow-xl'}`}
                      >
                        <span className="font-black text-[11px] md:text-[13px] uppercase tracking-tight relative z-10 pr-4">{skill}</span>
                        <div className={`shrink-0 w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center transition-all relative z-10 border-2 ${isSelected ? (isLearning ? 'bg-emerald-500 border-emerald-500 text-white rotate-0' : 'bg-indigo-600 border-indigo-600 text-white rotate-0') : 'bg-slate-50 border-slate-100 text-slate-300 group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white'}`}>
                          {isSelected ? <Check className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" strokeWidth={3} /> : <Plus className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Guided Next Step Button Footer */}
        <div className="px-5 md:px-8 lg:px-10 py-4 md:py-6 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-between items-center shrink-0 gap-3 md:gap-4">
          <p className="text-[9px] md:text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-wider text-center sm:text-left">
            {isLearning ? `Step 2 Selected: ${state.myNeeds.length}/5` : `Step 1 Selected: ${state.mySkills.length}/5`}
          </p>
          {isLearning ? (
            <button 
              onClick={() => setters.setShowDirectory(false)}
              className="w-full sm:w-auto bg-emerald-600 text-white px-5 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center sm:justify-start gap-2 shadow-lg shadow-emerald-100 cursor-pointer"
            >
              Complete & Verify <Check className="w-4 h-4 md:w-4 md:h-4" strokeWidth={3} />
            </button>
          ) : (
            <button 
              onClick={() => {
                setters.setAddingSkillType('learning');
                setters.setOnboardingCategory(null);
              }}
              className="w-full sm:w-auto bg-indigo-600 text-white px-5 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center sm:justify-start gap-2 shadow-lg shadow-indigo-100 cursor-pointer"
            >
              Next: Desired Skills <ArrowRight className="w-4 h-4 md:w-4 md:h-4" strokeWidth={3} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}