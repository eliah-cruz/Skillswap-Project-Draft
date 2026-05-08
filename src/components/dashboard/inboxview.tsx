"use client";
import React, { useEffect, useRef } from 'react';
import { Search, MessageSquare, Send, Star, AlertTriangle, Info, Repeat, Flame, UserX, Flag } from 'lucide-react';

export default function InboxView({ state, setters, actions }: any) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const partner = state.activeChatPartner;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages]);

  const handleSelect = (user: any) => {
    actions.openSpecificChat(user);
  };

  return (
    <section className="container mx-auto px-5 py-6 h-[85vh] flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* LEFT: Chat List (Sidebar) */}
      <div className="w-full md:w-80 lg:w-96 bg-white rounded-[3rem] border-2 border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
            <MessageSquare className="text-indigo-600" /> Inbox
          </h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" placeholder="Search messages..." 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
          {state.activeChatUsers.map((user: any) => {
            const isSelected = partner?.id === user.id;
            const history = state.chatHistory[user.id];
            const lastMsg = history?.[history.length - 1];
            return (
              <button 
                key={user.id} onClick={() => handleSelect(user)}
                className={`w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all cursor-pointer ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}
              >
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black border-2 border-white overflow-hidden ${isSelected ? 'bg-indigo-500' : 'bg-indigo-50 text-indigo-600'}`}>
                    {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : user.avatar}
                  </div>
                  {user.status === 'Online' && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-black truncate pr-2">{user.name}</p>
                    {lastMsg && <span className={`text-[9px] font-black ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>{lastMsg.timestamp}</span>}
                  </div>
                  <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500 font-medium'}`}>
                    {lastMsg ? (lastMsg.sender === 'me' ? `You: ${lastMsg.text}` : lastMsg.text) : `Teaches ${user.teaching.split(',')[0]}`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Active Chat Window */}
      <div className="flex-1 bg-white rounded-[3rem] border-2 border-slate-100 shadow-sm flex flex-col overflow-hidden relative">
        {!partner ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
              <MessageSquare size={48} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Your Messages</h3>
            <p className="text-slate-400 text-sm font-bold mt-2">Select a conversation from the left to start swapping skills.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b-2 border-slate-50 flex justify-between items-center bg-white z-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md overflow-hidden">
                    {partner.image ? <img src={partner.image} className="w-full h-full object-cover" /> : partner.avatar}
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-slate-900 text-lg">{partner.name}</h3>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${partner.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{partner.status} • {partner.title}</span>
                    </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-2">
                  <div className="hidden lg:flex flex-col items-end mr-4">
                    <div className="flex items-center gap-2">
                       {partner.isMutualMatch && <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-[9px] font-black uppercase flex items-center gap-1"><Flame size={10}/> Mutual</span>}
                       {partner.isCircularMatch && <span className="bg-teal-50 text-teal-600 px-2 py-1 rounded-md text-[9px] font-black uppercase flex items-center gap-1"><Repeat size={10}/> Circular</span>}
                    </div>
                  </div>
                  <button onClick={() => actions.triggerToast("Showing user details...")} className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all cursor-pointer"><Info size={20}/></button>
               </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-slate-50/30">
               {partner.rating < 4.0 && (
                  <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-4 flex items-center gap-4 mb-4">
                    <AlertTriangle className="text-red-500 shrink-0" size={20} />
                    <p className="text-[11px] font-bold text-red-700">Safety Warning: This user has a rating below 4.0. Please be cautious.</p>
                  </div>
               )}

               {state.messages.map((m: any, i: number) => (
                 <div key={i} className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-[1.8rem] max-w-[70%] text-sm font-bold ${m.sender === 'me' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border-2 border-slate-100 text-slate-800 rounded-bl-none'}`}>
                      {m.text}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 mt-2 uppercase px-1">{m.timestamp}</span>
                 </div>
               ))}
               <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t-2 border-slate-50">
               <form onSubmit={actions.handleSendMessage} className="flex items-center gap-4 bg-slate-100 p-2 rounded-[2rem] focus-within:bg-white border-2 border-transparent focus-within:border-indigo-500 transition-all shadow-inner">
                  <input 
                    value={state.chatInput} onChange={e => setters.setChatInput(e.target.value)}
                    className="flex-1 bg-transparent py-3 px-6 outline-none text-sm font-bold text-slate-900" 
                    placeholder={`Message ${partner.name}...`} 
                  />
                  <button disabled={!state.chatInput.trim()} className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-slate-900 transition-all disabled:opacity-30 cursor-pointer">
                    <Send size={20} />
                  </button>
               </form>
            </div>
          </>
        )}
      </div>
    </section>
  );
}