"use client";
import React from 'react';
import { 
  X, 
  ChevronLeft, 
  Plus, 
  Check, 
  Sparkles, 
  LayoutGrid, 
  Search,
  ArrowRight
} from 'lucide-react';
import { categories } from "../../constants/data";

export default function SkillDirectory({ state, setters, actions }: any) {
  if (!state.showDirectory) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      
      <div className="bg-white rounded-[4rem] w-full max-w-2xl overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.5)] border-4 border-white flex flex-col max-h-[85vh] relative">
        
        {/* --- HEADER --- */}
        <div className="p-10 border-b-2 border-slate-50 flex justify-between items-center bg-white shrink-0 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <LayoutGrid size={28} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-sm">Skill Directory</h3>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles size={14} className="text-amber-500 fill-amber-500" />
                <p className="text-[11px] text-slate-500 font-black uppercase tracking-tight">
                  {state.mySkills?.length || 0} Skills Collected
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { setters.setShowDirectory(false); setters.setOnboardingCategory(null); }} 
            className="cursor-pointer w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all border border-slate-100 shadow-sm active:scale-90"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="overflow-y-auto pb-12 bg-white">
          
          <div className="px-10 pt-10">
            {!state.onboardingCategory ? (
              /* --- VIEW 1: CATEGORY SELECTION --- */
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-[2px] bg-slate-100 flex-1"></div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 shrink-0">Select a Department</h4>
                  <div className="h-[2px] bg-slate-100 flex-1"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {categories.map(cat => (
                    <button 
                      key={cat.title} 
                      onClick={() => setters.setOnboardingCategory(cat)} 
                      className="cursor-pointer p-8 rounded-[3rem] bg-slate-50 border-2 border-transparent hover:border-indigo-500 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all text-left group relative"
                    >
                      {/* Icon Container - Matching the Squircle UI */}
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm border border-slate-100 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        {cat.icon}
                      </div>
                      
                      <span className="text-sm font-black uppercase text-slate-900 tracking-wider block mb-1">{cat.title}</span>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                        Explore <ArrowRight size={12} strokeWidth={3} />
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* --- VIEW 2: SKILL LIST --- */
              <div className="animate-in slide-in-from-right-8 duration-400">
                <button 
                  onClick={() => setters.setOnboardingCategory(null)} 
                  className="cursor-pointer group text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-8 flex items-center gap-3 bg-indigo-50 px-6 py-4 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all w-fit shadow-sm"
                >
                  <ChevronLeft size={18} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                  Back to Categories
                </button>

                <div className="mb-10 pl-6 border-l-4 border-indigo-600 text-left">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{state.onboardingCategory.title}</h2>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mt-2">Select the skills you want to showcase</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {state.onboardingCategory.skills.map((skill: string) => {
                    const isSelected = state.mySkills?.includes(skill);
                    
                    return (
                      <button 
                        key={skill} 
                        onClick={() => actions.addSkill(skill)} 
                        className={`group cursor-pointer p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between text-left relative overflow-hidden ${
                          isSelected 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-lg shadow-emerald-100' 
                            : 'bg-white border-slate-100 text-slate-900 hover:border-slate-900 hover:shadow-xl'
                        }`}
                      >
                        <span className="font-black text-[13px] uppercase tracking-tight relative z-10">{skill}</span>
                        
                        <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all relative z-10 border-2 ${
                          isSelected 
                            ? 'bg-emerald-500 border-emerald-500 text-white rotate-0' 
                            : 'bg-slate-50 border-slate-100 text-slate-300 group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white'
                        }`}>
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