"use client";
import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer({ state, setters }: any) {
  return (
    <footer className="bg-white pt-16 pb-12 border-t-2 border-slate-100 mt-auto relative z-10">
      <div className="container px-5 mx-auto">
        
        {/* Top section: Logo and Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          
          {/* Logo - Fully Active */}
          <div 
            className="flex items-center gap-4 group cursor-pointer"
            onClick={() => {
              if (state.isLoggedIn && setters) {
                // Redirects Admin back to 'admin' home, and standard users to 'hub'
                setters.setActiveTab(state.isAdmin ? 'admin' : 'hub');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-200 group-hover:-rotate-12 transition-transform">
               <Zap size={24} color="white" strokeWidth={3} />
            </div>
            <span className="text-2xl tracking-tighter font-black text-slate-900">Skill<span className="text-indigo-600 italic">Swap</span></span>
          </div>

          {/* Links - Fully Active */}
          <div className="flex items-center gap-8 animate-in fade-in duration-300">
              <Link href="/team" className="relative group text-slate-500 text-xs font-black tracking-widest hover:text-indigo-600 transition-colors">
                Team
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </Link> 
              <Link href="https://github.com/eliah-cruz/Skillswap-Project-Draft" target="_blank" className="relative group text-slate-500 text-xs font-black tracking-widest hover:text-indigo-600 transition-colors">
                GitHub
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-50 text-center md:text-left">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              © {state.year} SkillSwap • Built for the Community
            </span>
            <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">
              All Rights Reserved.
            </span>
        </div>

      </div>

      {/* Floating Scroll to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
        className={`cursor-pointer fixed bottom-8 right-8 z-[150] transition-all duration-500 transform group ${state.showScroll ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}`}
      >
          <span className="absolute inset-0 rounded-full bg-indigo-400 opacity-75 animate-ping"></span>
          <div className="relative bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg shadow-indigo-200 transition-transform active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </div>
      </button>
    </footer>
  );
}