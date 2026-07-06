"use client";
import React from 'react';

export default function HowItWorks() {
  const steps = [
    { 
      i: "01", 
      icon: "✍️", 
      t: "List Skills", 
      d: "Tell us what you know and what you want to learn.",
      gradient: "from-indigo-500 to-blue-500"
    }, 
    { 
      i: "02", 
      icon: "🤝", 
      t: "Get Matched", 
      d: "Our algorithm finds the perfect peer for you.",
      gradient: "from-purple-500 to-indigo-500"
    }, 
    { 
      i: "03", 
      icon: "⚡", 
      t: "Swap & Grow", 
      d: "Connect via chat and start your session.",
      gradient: "from-pink-500 to-purple-500"
    }
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      <div className="container px-5 mx-auto text-center relative z-10">
        <div className="inline-block mb-4">
          <span className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
            Simple Process
          </span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-24 tracking-tighter">
          How it <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Works</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-slate-100 -z-10"></div>

          {steps.map((step, idx) => (
            <div 
              key={step.i} 
              className="group relative flex flex-col items-center text-center"
            >
              {/* Icon Container */}
              <div className="relative mb-10">
                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                {/* The Box */}
                <div className="w-28 h-28 bg-white border-2 border-slate-50 rounded-[2.5rem] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] flex items-center justify-center text-4xl group-hover:-translate-y-3 group-hover:rotate-3 transition-all duration-500 relative z-10">
                  {step.icon}
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-sm font-black border-4 border-white shadow-lg group-hover:bg-indigo-600 transition-colors">
                    {step.i}
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="px-4">
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {step.t}
                </h3>
                <p className="text-slate-500 text-base font-medium leading-relaxed max-w-[240px] mx-auto">
                  {step.d}
                </p>
              </div>

              {/* Mobile Arrow/Divider */}
              {idx !== steps.length - 1 && (
                <div className="md:hidden my-8 text-slate-200 text-2xl">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom decorative blob */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-50/50 rounded-full blur-[100px] -z-10"></div>
    </section>
  );
}