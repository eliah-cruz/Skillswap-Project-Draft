"use client";
import React, { useState } from 'react';
import { 
  Send, X, MoreVertical, Slash, Flag, MessageSquare, ShieldAlert, Trash2, UserX
} from 'lucide-react';

export default function Messenger({ state, setters, chatEndRef, actions }: any) {
  const [showSafetyMenu, setShowSafetyMenu] = useState(false);
  const partner = state.activeChatPartner;
  const hasChats = state.activeChatUsers && state.activeChatUsers.length > 0;

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-[0_0_60px_rgba(0,0,0,0.15)] z-[200] flex flex-col transition-all duration-500 ease-in-out transform border-l border-slate-100 ${
        state.showChat ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b-2 border-slate-50 flex justify-between items-center bg-white sticky top-0 z-20">
        <div className="flex items-center gap-4">
           {partner ? (
             <>
               <div className="relative">
                 <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg overflow-hidden border-2 border-white">
                   {partner.image ? (
                     <img src={partner.image} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-2xl">{partner.avatar || "👤"}</span>
                   )}
                 </div>
                 <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-4 border-white rounded-full ${partner.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
               </div>
               <div className="text-left">
                 <h3 className="font-black text-slate-900 text-lg leading-tight">{partner.name}</h3>
                 <div className="flex items-center gap-2">
                   {state.isPartnerTyping ? (
                     <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest animate-pulse">Typing...</span>
                   ) : (
                     <span className={`text-[10px] font-black uppercase tracking-widest ${partner.status === 'Online' ? 'text-emerald-600' : 'text-slate-400'}`}>
                       {partner.status || "Offline"}
                     </span>
                   )}
                 </div>
               </div>
             </>
           ) : (
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                 <MessageSquare size={24} />
               </div>
               <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">
                 {hasChats ? "Select a Chat" : "No Chats"}
               </h3>
             </div>
           )}
        </div>
        
        <div className="flex items-center gap-3">
          {partner && (
            <div className="relative">
              <button onClick={() => setShowSafetyMenu(!showSafetyMenu)} className="cursor-pointer w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                <MoreVertical size={20} />
              </button>
              {showSafetyMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border-2 border-slate-50 p-3 z-50">
                  <button onClick={() => { actions.clearChat(partner.id); setShowSafetyMenu(false); }} className="flex items-center gap-3 cursor-pointer w-full text-left px-4 py-4 text-[11px] font-black uppercase text-slate-600 hover:bg-slate-50 rounded-2xl">
                    <Trash2 size={16} /> Clear Chat History
                  </button>

                  {/* NEW: Delete Conversation Button */}
                  <button onClick={() => { actions.deleteConversation(partner.id); setShowSafetyMenu(false); }} className="flex items-center gap-3 cursor-pointer w-full text-left px-4 py-4 text-[11px] font-black uppercase text-slate-600 hover:bg-slate-50 rounded-2xl">
                    <UserX size={16} /> Delete Conversation
                  </button>
                  
                  <div className="h-px bg-slate-100 my-1 mx-2"></div>
                  
                  <button onClick={() => { actions.blockUser(partner.id); setShowSafetyMenu(false); }} className="flex items-center gap-3 cursor-pointer w-full text-left px-4 py-4 text-[11px] font-black uppercase text-orange-600 hover:bg-orange-50 rounded-2xl">
                    <Slash size={16} /> Block User
                  </button>
                  <button onClick={() => { actions.reportUser(partner.id); setShowSafetyMenu(false); }} className="flex items-center gap-3 cursor-pointer w-full text-left px-4 py-4 text-[11px] font-black uppercase text-red-600 hover:bg-red-50 rounded-2xl">
                    <Flag size={16} /> Report & Block
                  </button>
                </div>
              )}
            </div>
          )}
          <button className="cursor-pointer w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-red-500 transition-all" onClick={() => setters.setShowChat(false)}>
            <X size={24} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-6 overflow-y-auto bg-white space-y-8 scrollbar-hide">
          {!partner ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <MessageSquare size={40} className="text-indigo-200 mb-6" />
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">
                  {hasChats ? "Select a partner to continue" : "No active chats yet"}
                </p>
              </div>
          ) : (
            <>
              <div className="bg-amber-50 border-2 border-amber-100 rounded-3xl p-4 flex items-start gap-4 mb-8">
                <div className="bg-amber-500 p-2 rounded-xl text-white">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-amber-800 uppercase tracking-wider mb-1">Safety First</p>
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    Always be careful. Never share your password or credit card info with others during a swap.
                  </p>
                </div>
              </div>

              {state.messages.length === 0 ? (
                <div className="py-20 text-center">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">No messages yet</p>
                </div>
              ) : (
                state.messages.map((m: any, i: number) => (
                    <div key={i} className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        <div className={`p-5 rounded-[2rem] max-w-[90%] text-md font-bold leading-relaxed ${
                          m.sender === 'me' ? 'bg-indigo-600 text-white rounded-br-none shadow-xl' : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200/50'
                        }`}>
                          {m.text}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 mt-2 uppercase px-2">{m.timestamp}</span>
                    </div>
                ))
              )}
              <div ref={chatEndRef} className="h-4" />
            </>
          )}
      </div>

      {/* Input Form */}
      {partner && (
        <div className="p-8 bg-white border-t-2 border-slate-50">
            <form onSubmit={actions.handleSendMessage} className="relative flex items-center gap-4 bg-slate-100 p-2 rounded-[2.5rem] focus-within:bg-white border-2 border-transparent focus-within:border-indigo-500 transition-all shadow-inner">
                <input 
                  autoFocus 
                  value={state.chatInput} 
                  onChange={e => setters.setChatInput(e.target.value)} 
                  className="flex-1 bg-transparent py-4 px-6 outline-none text-md font-bold text-slate-900" 
                  placeholder={`Write to ${partner.name}...`} 
                />
                <button type="submit" disabled={!state.chatInput.trim()} className="cursor-pointer w-14 h-14 bg-indigo-600 text-white rounded-[1.8rem] flex items-center justify-center shadow-xl hover:bg-slate-900 transition-all disabled:opacity-30">
                  <Send size={24} strokeWidth={2.5} />
                </button>
            </form>
        </div>
      )}
    </div>
  );
}