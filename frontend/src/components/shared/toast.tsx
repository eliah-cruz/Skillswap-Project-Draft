"use client";
import React from 'react';

export default function Toast({ toast }: { toast: string | null }) {
  if (!toast) return null;

  return (
    /* The outer container is now 'pointer-events-none' so the 'invisible' space 
       around the toast doesn't block your clicks on the screen */
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[999] pointer-events-none flex justify-center">
      
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-6 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 border border-white/10 w-fit animate-in slide-in-from-bottom-5 fade-in">
        
        {/* The Blue Dot */}
        <div className="flex-shrink-0 w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
        
        {/* YOUR ORIGINAL TEXT STYLE - Fixed Spacing */}
        <span className="text-[10px] font-black uppercase tracking-widest leading-none block">
          {toast}
        </span>
        
      </div>
    </div>
  );
}