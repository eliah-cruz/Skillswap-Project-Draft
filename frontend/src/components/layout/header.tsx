// src/components/layout/header.tsx

"use client";
import React, { useState } from 'react';
import { LogOut, MessageSquare, Zap, Settings, UserCircle, ArrowRight, Shield } from 'lucide-react';

export default function Header({ state, setters, actions }: any) {
  const safeName = state.userName || "Guest";
  const firstLetter = safeName.charAt(0).toUpperCase();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMessageMenu, setShowMessageMenu] = useState(false);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "skillswapproductions@gmail.com";
  const isAdmin = state.userEmail === ADMIN_EMAIL;

  const handleSelectChat = (user: any) => {
    setShowMessageMenu(false);
    actions.openSpecificChat(user);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${state.showScroll || state.isLoggedIn ? 'bg-white/90 backdrop-blur-xl border-b-2 border-slate-100 py-3 md:py-4 shadow-sm' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="container mx-auto flex px-4 md:px-5 items-center justify-between">
        
        {/* Header Logo */}
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (!state.isLoggedIn) {
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 150);
            } else { 
              setters.setActiveTab(state.isAdmin ? 'admin' : 'hub'); 
              setters.setShowChat(false); 
              setShowMessageMenu(false);
            }
          }} 
          className="flex items-center gap-3 md:gap-4 group cursor-pointer shrink-0"
        >
          <div className="bg-indigo-600 p-2.5 md:p-3 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl shadow-indigo-200 group-hover:rotate-12 transition-transform">
             <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={3} />
          </div>
          <span className="text-xl md:text-2xl tracking-tighter font-black text-slate-900 hidden sm:block">
            Skill<span className="text-indigo-600 italic">Swap</span>
          </span>
        </button>

        <div className="flex items-center gap-3 md:gap-4">
          {!state.isLoggedIn ? (
            <div className="flex items-center gap-4 md:gap-6">
              <button type="button" onClick={(e) => { e.preventDefault(); setters.setIsLoginView(true); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 150); }} className="cursor-pointer hidden md:block relative group text-sm font-black text-slate-600 hover:text-indigo-600 transition-colors">
                Log in
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button type="button" onClick={(e) => { e.preventDefault(); setters.setIsLoginView(false); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 150); }} className="cursor-pointer bg-[#4f46e5] text-white px-5 py-2.5 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl text-[11px] md:text-sm font-black shadow-lg md:shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap">
                Get Started
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 md:gap-4 relative">
              
              {/* Overlay to close menus when clicking outside on mobile */}
              {(showMessageMenu || showProfileMenu) && (
                <div 
                  className="fixed inset-0 w-screen h-screen z-40 bg-transparent"
                  onClick={() => { setShowMessageMenu(false); setShowProfileMenu(false); }}
                />
              )}

              {/* Profile dropdown and chats trigger */}
              <div className="relative z-50">
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => { setShowMessageMenu(!showMessageMenu); setShowProfileMenu(false); }} 
                    className={`relative cursor-pointer p-3 md:p-4 rounded-xl md:rounded-2xl transition-all border-2 ${showMessageMenu || state.showChat ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                  >
                    <MessageSquare className="w-5 h-5 md:w-[22px] md:h-[22px]" strokeWidth={2.5} />
                    {state.unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] md:text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                        {state.unreadCount}
                      </span>
                    )}
                  </button>

                  {showMessageMenu && (
                    <div className="absolute top-14 md:top-16 right-0 w-[300px] sm:w-80 md:w-96 bg-white border-2 border-slate-100 shadow-2xl rounded-2xl md:rounded-[2rem] overflow-hidden flex flex-col z-[999] animate-in slide-in-from-top-2 duration-200">
                      <div className="bg-slate-50 p-4 md:p-5 border-b border-slate-100 flex justify-between items-center shrink-0">
                        <h4 className="font-black text-slate-900 text-xs md:text-sm uppercase tracking-widest">Messages</h4>
                        <span className="text-[10px] md:text-xs font-bold text-indigo-600 bg-indigo-100 px-2.5 md:px-3 py-1 rounded-full">{state.activeChatUsers?.length || 0} Active</span>
                      </div>
                      <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto no-scrollbar">
                        {state.activeChatUsers?.length > 0 ? (
                          state.activeChatUsers.map((user: any) => (
                            <button key={user.id} onClick={() => handleSelectChat(user)} className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 border-b border-slate-50 hover:bg-indigo-50/50 transition-colors text-left group cursor-pointer">
                              <div className="relative shrink-0">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-sm md:text-lg shadow-inner overflow-hidden">{user.image ? <img src={user.image} className="w-full h-full object-cover" alt="" /> : <span className="uppercase">{user.name.substring(0,2)}</span>}</div>
                                <span className={`absolute -bottom-1 -right-1 w-3 h-3 md:w-3.5 md:h-3.5 border-2 border-white rounded-full shadow-sm ${user.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs md:text-sm font-black text-slate-900 truncate">{user.name}</h5>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-500 truncate uppercase tracking-widest mt-0.5 md:mt-1">Teaches: {user.teaching ? user.teaching.split(',')[0] : 'Various Skills'}</p>
                              </div>
                              <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0 md:w-4 md:h-4" />
                            </button>
                          ))
                        ) : (
                          <div className="p-6 md:p-8 text-center flex flex-col items-center justify-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3 md:mb-4"><MessageSquare className="w-5 h-5 md:w-6 md:h-6" /></div>
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">No active chats</p>
                            <p className="text-[9px] md:text-[11px] text-slate-400 font-medium mt-1.5 md:mt-2 leading-relaxed">Match with a peer on the dashboard to start learning!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
                
              <div className="relative z-50">
                <div className="flex items-center gap-2 md:gap-4 bg-slate-50 pl-1.5 pr-3 md:pl-2 md:pr-4 py-1.5 md:py-2 rounded-xl md:rounded-[1.5rem] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => { setShowProfileMenu(!showProfileMenu); setShowMessageMenu(false); }}>
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs md:text-sm shadow-md">{firstLetter}</div>
                    <span className={`absolute -bottom-1 -right-1 w-3 h-3 md:w-3.5 md:h-3.5 border-2 border-white rounded-full shadow-sm ${state.userSettings?.showOnlineStatus !== false ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                  </div>
                  <span className="hidden sm:block text-[9px] md:text-[11px] font-black text-slate-700 uppercase tracking-widest">{safeName}</span>
                </div>

                {showProfileMenu && (
                  <div className="absolute top-14 md:top-16 right-0 w-44 md:w-48 bg-white border-2 border-slate-100 shadow-2xl rounded-2xl md:rounded-[1.5rem] overflow-hidden flex flex-col z-[999] animate-in slide-in-from-top-2 duration-200">
                      <button type="button" onClick={(e) => { e.preventDefault(); setters.setActiveTab('profile'); setShowProfileMenu(false); }} className="cursor-pointer flex items-center gap-2.5 md:gap-3 px-4 md:px-5 py-3 md:py-4 text-left text-[10px] md:text-[11px] uppercase tracking-widest font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><UserCircle size={14} className="md:w-4 md:h-4" /> Profile</button>
                      <button type="button" onClick={(e) => { e.preventDefault(); setters.setActiveTab('settings'); setShowProfileMenu(false); }} className="cursor-pointer flex items-center gap-2.5 md:gap-3 px-4 md:px-5 py-3 md:py-4 text-left text-[10px] md:text-[11px] uppercase tracking-widest font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><Settings size={14} className="md:w-4 md:h-4" /> Settings</button>
                      
                      {/* Secure Admin Option */}
                      {state.isAdmin && (
                        <button type="button" onClick={(e) => { e.preventDefault(); setters.setActiveTab('admin'); setShowProfileMenu(false); }} className="cursor-pointer flex items-center gap-2.5 md:gap-3 px-4 md:px-5 py-3 md:py-4 text-left text-[10px] md:text-[11px] uppercase tracking-widest font-black text-red-600 hover:bg-red-50 transition-colors">
                          <Shield size={14} className="md:w-4 md:h-4" /> Admin Console
                        </button>
                      )}

                      <div className="h-[2px] bg-slate-100"></div>
                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); actions.handleLogout(); }} className="cursor-pointer flex items-center gap-2.5 md:gap-3 px-4 md:px-5 py-3 md:py-4 text-left text-[10px] md:text-[11px] uppercase tracking-widest font-black text-red-500 hover:bg-red-50 transition-colors"><LogOut size={14} className="md:w-4 md:h-4" /> Logout</button>
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