"use client";
import React, { useState } from 'react';
import { LogOut, MessageSquare, Zap, Settings, UserCircle, ArrowRight } from 'lucide-react';

export default function Header({ state, setters, actions, scrollTo }: any) {
  const safeName = state.userName || "Guest";
  const firstLetter = safeName.charAt(0).toUpperCase();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMessageMenu, setShowMessageMenu] = useState(false);

  const handleSelectChat = (user: any) => {
    setShowMessageMenu(false);
    actions.openSpecificChat(user);
  };

  return (
    // Z-INDEX FIX: Header is z-[100] so modals (z-200+) will blur over it
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${state.showScroll || state.isLoggedIn ? 'bg-white/90 backdrop-blur-xl border-b-2 border-slate-100 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto flex px-5 items-center justify-between">
        
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (!state.isLoggedIn) {
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 150);
            } else { 
              setters.setActiveTab('hub'); 
              setters.setShowChat(false); 
              setShowMessageMenu(false);
            }
          }} 
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-200 group-hover:rotate-12 transition-transform">
             <Zap size={24} color="white" strokeWidth={3} />
          </div>
          <span className="text-2xl tracking-tighter font-black text-slate-900">Skill<span className="text-indigo-600 italic">Swap</span></span>
        </button>

        <div className="flex items-center gap-4">
          {!state.isLoggedIn ? (
            <div className="flex items-center gap-6">
              <button type="button" onClick={(e) => { e.preventDefault(); setters.setIsLoginView(true); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 150); }} className="cursor-pointer hidden md:block relative group text-sm font-black text-slate-600 hover:text-indigo-600 transition-colors">
                Log in
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button type="button" onClick={(e) => { e.preventDefault(); setters.setIsLoginView(false); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 150); }} className="cursor-pointer bg-[#4f46e5] text-white px-8 py-3.5 rounded-2xl text-sm font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                Get Started
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 relative">
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => { setShowMessageMenu(!showMessageMenu); setShowProfileMenu(false); }} 
                  className={`relative cursor-pointer p-4 rounded-2xl transition-all border-2 ${showMessageMenu || state.showChat ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                >
                  <MessageSquare size={22} strokeWidth={2.5} />
                  {state.activeChatUsers?.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">{state.activeChatUsers.length}</span>}
                </button>

                {showMessageMenu && (
                  <div className="absolute top-16 right-0 w-80 sm:w-96 bg-white border-2 border-slate-100 shadow-2xl rounded-[2rem] overflow-hidden flex flex-col z-[150] animate-in slide-in-from-top-2 duration-200">
                    <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center">
                      <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Messages</h4>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">{state.activeChatUsers?.length || 0} Active</span>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                      {state.activeChatUsers?.length > 0 ? (
                        state.activeChatUsers.map((user: any) => (
                          <button key={user.id} onClick={() => handleSelectChat(user)} className="w-full flex items-center gap-4 p-4 border-b border-slate-50 hover:bg-indigo-50/50 transition-colors text-left group cursor-pointer">
                            <div className="relative shrink-0">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg shadow-inner overflow-hidden">{user.image ? <img src={user.image} className="w-full h-full object-cover" alt="" /> : <span className="uppercase">{user.name.substring(0,2)}</span>}</div>
                              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full shadow-sm ${user.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-black text-slate-900 truncate">{user.name}</h5>
                              <p className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-widest mt-0.5">Teaches: {user.teaching.split(',')[0]}</p>
                            </div>
                            <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                          </button>
                        ))
                      ) : (
                        <div className="p-8 text-center flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4"><MessageSquare size={24} /></div>
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">No active chats</p>
                          <p className="text-[11px] text-slate-400 font-medium mt-2 leading-relaxed">Match with a peer on the dashboard to start learning!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <div className="flex items-center gap-4 bg-slate-50 pl-2 pr-4 py-2 rounded-[1.5rem] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => { setShowProfileMenu(!showProfileMenu); setShowMessageMenu(false); }}>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">{firstLetter}</div>
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full shadow-sm ${state.userSettings?.showOnlineStatus !== false ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                  </div>
                  <span className="hidden sm:block text-[11px] font-black text-slate-700 uppercase tracking-widest">{safeName}</span>
                </div>

                {showProfileMenu && (
                  <div className="absolute top-16 right-0 w-48 bg-white border-2 border-slate-100 shadow-2xl rounded-[1.5rem] overflow-hidden flex flex-col z-[150] animate-in slide-in-from-top-2 duration-200">
                     <button type="button" onClick={(e) => { e.preventDefault(); setters.setActiveTab('profile'); setShowProfileMenu(false); }} className="cursor-pointer flex items-center gap-3 px-5 py-4 text-left text-[11px] uppercase tracking-widest font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><UserCircle size={16} /> Profile</button>
                     <button type="button" onClick={(e) => { e.preventDefault(); setters.setActiveTab('settings'); setShowProfileMenu(false); }} className="cursor-pointer flex items-center gap-3 px-5 py-4 text-left text-[11px] uppercase tracking-widest font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><Settings size={16} /> Settings</button>
                     <div className="h-[2px] bg-slate-50 w-full"></div>
                     <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); actions.handleLogout(); }} className="cursor-pointer flex items-center gap-3 px-5 py-4 text-left text-[11px] uppercase tracking-widest font-black text-red-500 hover:bg-red-50 transition-colors"><LogOut size={16} /> Logout</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}