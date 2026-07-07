"use client";
import React from 'react';
import Loader2 from './loader2';
import { AuthState } from '../../types';

interface AuthVerificationProps {
  state: AuthState;
}

export default function AuthVerificationScreen({ state }: AuthVerificationProps) {
  if (!state.isVerifyingAuth) return null;

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-slate-950 p-6 text-center animate-in fade-in duration-500">
      <div className="bg-slate-900/80 backdrop-blur-2xl border-2 border-slate-800 rounded-[3rem] p-12 max-w-md w-full shadow-2xl relative overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>

        <div className="mb-8 flex justify-center">
          <Loader2 scale={1.2} />
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
          {state.authSuccess ? "Session Secured" : "Verifying Credentials"}
        </h3>

        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-6 inline-block mb-8">
          <p className="text-xs font-black uppercase text-indigo-400 tracking-widest animate-pulse">
            {state.authStatusMessage || "Initializing secure link handshake..."}
          </p>
        </div>

        <p className="text-slate-400 text-xs font-medium leading-relaxed">
          {state.authSuccess 
            ? "Your magic credentials have been successfully authenticated! Redirecting to the SkillSwap Hub..." 
            : "Opening secure tunnel to complete sign-in. This will prevent automatic tab closure issues on mobile or right-clicked windows."}
        </p>
      </div>
    </div>
  );
}