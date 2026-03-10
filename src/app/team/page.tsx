"use client";

import Link from 'next/link';
import { useState, useEffect } from "react";
import { useSkillSwap } from "@/hooks/useSkillSwap";
import Footer from "@/components/layout/footer";

// --- TEAM DATA ---
const teamMembers = [
  { 
    id: 1,
    name: "Qarlo Banguilan", 
    role: "Lead Full Stack Dev", 
    bio: "Sleep Mode",
    avatar: "QB", 
    color: "bg-indigo-600",
    socials: { github: "#", linkedin: "#" },
    tech: ["Next.js", "TypeScript", "Node.js"]
  },
  { 
    id: 2,
    name: "Eliah Cruz", 
    role: "UI/UX", 
    bio: "100% UI and UX",
    avatar: "EC", 
    color: "bg-purple-600",
    socials: { github: "https://github.com/eliah-cruz", linkedin: "https://www.linkedin.com/in/eliah-d-cruz-520970297/" },
    tech: ["Next.js", "Tailwind", "Node.js", "TypeScript"]
  },
  { 
    id: 3,
    name: "Rafael Torres", 
    role: "DevOps & Backend", 
    bio: "Grammarly",
    avatar: "RT", 
    color: "bg-emerald-500",
    socials: { github: "#", linkedin: "#" },
    tech: ["Docker", "PostgreSQL", "AWS"]
  },
];

const techStack = [
  { name: "Next.js 14", icon: "⚡" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "TypeScript", icon: "📘" },
  { name: "React", icon: "⚛️" },
];

export default function Members() {
  const { state, setters, actions } = useSkillSwap();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden font-sans flex flex-col">
      
      {/* Background Decor (Consistent with Home) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-200/50 rounded-full blur-[120px] mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/50 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
            </div>
            <span className="text-lg tracking-tight font-black text-slate-900">Skill<span className="text-indigo-600">Swap</span> <span className="text-slate-400 font-medium">/ Team</span></span>
          </Link>

          <Link 
            href="/" 
            className="cursor-pointer bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40 active:translate-y-0"
          >
            Back
          </Link>
        </div>
      </header>

      {/* Adding flex-grow so the footer naturally pushes to the bottom even on large screens */}
      <div className="pt-32 pb-20 container mx-auto px-6 relative z-10 flex-grow">
        
        {/* HERO SECTION */}
        <div className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4">
             <span className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
               Behind the Code
             </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-[1.1]">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Builders</span>.
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            🚀 SkillSwap - Peer-to-Peer Learning Platform - SoftEng 1 & 2_Project.
          </p>
        </div>

        {/* TEAM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {teamMembers.map((member, idx) => (
            <div 
              key={member.id} 
              className={`group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Decorative gradient top */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>

              {/* Avatar */}
              <div className="relative mb-6">
                <div className={`w-24 h-24 rounded-3xl ${member.color} flex items-center justify-center text-white text-3xl font-black shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                  {member.avatar}
                </div>
                <div className="absolute -bottom-3 px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-md border border-slate-100">
                  {member.role}
                </div>
              </div>

              {/* Info */}
              <h3 className="text-2xl font-black text-slate-900 mb-3">{member.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                {member.bio}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {member.tech.map(t => (
                  <span key={t} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-500 uppercase">
                    {t}
                  </span>
                ))}
              </div>

              {/* Socials */}
              <div className="mt-auto flex gap-4 w-full justify-center pt-6 border-t border-slate-50">
                {Object.entries(member.socials).map(([platform, link]) => (
                  <Link href={link} key={platform} className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-300">
                    {platform === 'github' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>}
                    {platform === 'linkedin' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>}
                    {platform === 'website' && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PROJECT STACK SECTION */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-10 tracking-tight">Built with modern tech</h2>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
               {techStack.map((tech) => (
                 <div key={tech.name} className="flex flex-col items-center gap-3 group">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-2xl shadow-xl group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-300">
                      {tech.icon}
                    </div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">{tech.name}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

      </div>

      {/* NEW INSERT: Calling the global Footer */}
      <Footer state={state} />

    </main>
  );
}