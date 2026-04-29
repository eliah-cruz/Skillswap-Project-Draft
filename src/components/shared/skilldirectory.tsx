"use client";
import React, { useState } from 'react';
import { X, ChevronLeft, Plus, Check, Sparkles, LayoutGrid, ArrowRight, Search } from 'lucide-react';
import { categories } from "../../constants/data";

export default function SkillDirectory({ state, setters, actions }: any) {
  const [skillSearch, setSkillSearch] = useState("");
  
  if (!state.showDirectory) return null;
  
  const isLearning = state.addingSkillType === 'learning';
  const activeList = isLearning ? state.myNeeds : state.mySkills;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[4rem] w-full max-w-2xl overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.5)] border-4 border-white flex flex-col max-h-[85vh] relative">
        
        {/* --- HEADER --- */}
        <div className="p-10 border-b-2 border-slate-50 flex justify-between items-center bg-white shrink-0 relative z-10">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl ${isLearning ? 'bg-emerald-500 shadow-emerald-200' : 'bg-indigo-600 shadow-indigo-200'}`}>
              <LayoutGrid size={28} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-sm">
                {isLearning ? "What do you want to learn?" : "What can you teach?"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles size={14} className="text-amber-500 fill-amber-500" />
                <p className="text-[11px] text-slate-500 font-black uppercase tracking-tight">{activeList?.length || 0} Skills Collected</p>
              </div>
            </div>
          </div>

          <button onClick={() => { setters.setShowDirectory(false); setters.setOnboardingCategory(null); }} className="cursor-pointer w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all border border-slate-100 shadow-sm active:scale-90">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="overflow-y-auto pb-12 bg-white">
          <div className="px-10 pt-10">
            {!state.onboardingCategory ? (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-[2px] bg-slate-100 flex-1"></div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 shrink-0">Select a Department</h4>
                  <div className="h-[2px] bg-slate-100 flex-1"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {categories.map(cat => (
                    <button key={cat.title} onClick={() => { setters.setOnboardingCategory(cat); setSkillSearch(""); }} className={`cursor-pointer p-8 rounded-[3rem] bg-slate-50 border-2 border-transparent hover:bg-white hover:shadow-2xl transition-all text-left group relative ${isLearning ? 'hover:border-emerald-500 hover:shadow-emerald-100' : 'hover:border-indigo-500 hover:shadow-indigo-100'}`}>
                      <div className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm border border-slate-100 group-hover:scale-110 group-hover:text-white transition-all duration-300 ${isLearning ? 'group-hover:bg-emerald-500' : 'group-hover:bg-indigo-600'}`}>
                        {cat.icon}
                      </div>
                      <span className="text-sm font-black uppercase text-slate-900 tracking-wider block mb-1">{cat.title}</span>
                      <p className={`text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 transition-colors ${isLearning ? 'group-hover:text-emerald-600' : 'group-hover:text-indigo-600'}`}>
                        Explore <ArrowRight size={12} strokeWidth={3} />
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-right-8 duration-400">
                <div className="flex items-center justify-between mb-8">
                  <button onClick={() => setters.setOnboardingCategory(null)} className={`cursor-pointer group text-[11px] font-black uppercase tracking-widest flex items-center gap-3 px-6 py-4 rounded-2xl transition-all shadow-sm ${isLearning ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white' : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white'}`}>
                    <ChevronLeft size={18} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                    Categories
                  </button>
                  
                  {/* Skill Search Bar */}
                  <div className="relative w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" placeholder="Find skill..." value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)}
                      className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-slate-700 outline-none focus:bg-white transition-all ${isLearning ? 'focus:border-emerald-500' : 'focus:border-indigo-500'}`}
                    />
                  </div>
                </div>

                <div className={`mb-10 pl-6 border-l-4 text-left ${isLearning ? 'border-emerald-500' : 'border-indigo-600'}`}>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{state.onboardingCategory.title}</h2>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mt-2">Tap to {isLearning ? "add to your wishlist" : "add to your repertoire"}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
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
                        className={`group cursor-pointer p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between text-left relative overflow-hidden ${isSelected ? (isLearning ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-lg shadow-emerald-100' : 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-lg shadow-indigo-100') : 'bg-white border-slate-100 text-slate-900 hover:border-slate-900 hover:shadow-xl'}`}
                      >
                        <span className="font-black text-[13px] uppercase tracking-tight relative z-10">{skill}</span>
                        <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all relative z-10 border-2 ${isSelected ? (isLearning ? 'bg-emerald-500 border-emerald-500 text-white rotate-0' : 'bg-indigo-600 border-indigo-600 text-white rotate-0') : 'bg-slate-50 border-slate-100 text-slate-300 group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white'}`}>
                          {isSelected ? <Check size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}