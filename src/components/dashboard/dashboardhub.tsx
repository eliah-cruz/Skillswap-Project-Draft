"use client";
import React from 'react';
import { 
  MessageSquare, Star, BookOpen, Zap, Search, Globe,
  Code, Palette, Languages, TrendingUp, Sparkles,
  ShieldAlert, Unlock, AlertTriangle, ArrowRight, UserCheck, X,
  Filter, Heart
} from 'lucide-react';

export default function DashboardHub({ state, setters, actions }: any) {
  const recentPartners = state.activeChatUsers || [];
  
  const blockedList = state.allMatches.filter((m: any) => 
    state.blockedUsers.includes(m.id)
  );

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Development": return <Code size={16} />;
      case "Design": return <Palette size={16} />;
      case "Languages": return <Languages size={16} />;
      case "Marketing": return <TrendingUp size={16} />;
      default: return <Globe size={16} />;
    }
  };

  const goToChat = (partner: any) => {
    actions.openSpecificChat(partner);
  };

  return (
    <section className="container mx-auto px-5 py-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Search & Filters */}
      <div className="sticky top-24 z-20 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 max-w-6xl mx-auto">
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={24} />
            </div>
            <input 
              type="text"
              placeholder="Search names or skills..."
              value={state.searchQuery}
              onChange={(e) => setters.setSearchQuery(e.target.value)}
              className="w-full bg-white border-4 border-slate-100 hover:border-indigo-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 rounded-[2.5rem] py-6 pl-16 pr-14 text-lg font-bold text-slate-800 shadow-xl transition-all outline-none placeholder:text-slate-300"
            />
            {state.searchQuery && (
              <button 
                onClick={() => setters.setSearchQuery("")}
                className="absolute inset-y-0 right-6 flex items-center text-slate-300 hover:text-red-500 cursor-pointer transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>

          <div className="bg-white p-2 rounded-[2.5rem] border-4 border-slate-100 shadow-xl flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
            <div className="px-4 text-slate-400">
                <Filter size={18} />
            </div>
            {["Recommended", "Top Rated", "Newest"].map((sort) => (
                <button
                    key={sort}
                    onClick={() => setters.setSortBy(sort)}
                    className={`whitespace-nowrap px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-tight transition-all cursor-pointer ${
                        state.sortBy === sort 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    {sort}
                </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-[2.5rem] border-2 border-slate-200 flex flex-wrap items-center justify-between shadow-2xl shadow-indigo-100/40 gap-4">
            <div className="flex flex-wrap gap-3 px-2">
              {["All", "Development", "Design", "Languages", "Marketing"].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setters.setActiveCategoryFilter(cat)} 
                  className={`group cursor-pointer px-6 py-3 rounded-2xl text-[12px] font-black uppercase tracking-wider transition-all flex items-center gap-2 border-2 ${
                    state.activeCategoryFilter === cat 
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-200 scale-105' 
                    : 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 hover:shadow-md'
                  }`}
                >
                  {getCategoryIcon(cat)}
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4 pr-6 border-l-2 border-slate-100 pl-6">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Availability</span>
                    <span className="text-[11px] font-bold text-slate-500">Online Only</span>
                </div>
                <button 
                    onClick={() => setters.setOnlineOnly(!state.onlineOnly)}
                    className={`cursor-pointer w-14 h-7 rounded-full transition-all relative border-2 ${state.onlineOnly ? 'bg-emerald-500 border-emerald-600' : 'bg-slate-300 border-slate-400'}`}
                >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${state.onlineOnly ? 'left-7' : 'left-0.5'}`} />
                </button>
            </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          {state.filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {state.filteredMatches.map((m: any) => (
                <div 
                  key={m.id} 
                  onClick={() => goToChat(m)}
                  className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-300 transition-all group relative flex flex-col cursor-pointer"
                >
                  
                  {/* Match Percentage Badge */}
                  {state.sortBy === "Recommended" && m.matchScore > 20 && (
                    <div className="absolute -top-3 left-8 bg-amber-400 text-amber-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 border-2 border-white">
                      <Heart size={12} className="fill-amber-950" />
                      {Math.min(Math.round(m.matchScore), 99)}% Match
                    </div>
                  )}

                  <div className="absolute top-6 right-6 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                    {m.category}
                  </div>

                  <div className="relative z-10 flex-1">
                    <div className="flex gap-6 mb-6">
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 rounded-[2rem] bg-slate-100 text-indigo-600 flex items-center justify-center font-black text-2xl shadow-inner border-[3px] border-white overflow-hidden shadow-indigo-100">
                                {m.image ? <img src={m.image} className="w-full h-full object-cover" alt="" /> : <span className="uppercase">{m.avatar || m.name.substring(0,2)}</span>}
                            </div>
                            <span className={`absolute bottom-0 right-0 w-5 h-5 border-[3px] border-white rounded-full shadow-sm ${m.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        </div>
                        
                        <div className="min-w-0 flex-1 pt-1 text-left">
                            <h4 className="text-xl font-black text-slate-900 truncate flex items-center gap-2 mb-1">
                                {m.name}
                                {m.rating > 4.8 && <UserCheck size={18} className="text-indigo-500" />}
                            </h4>
                            <p className="text-xs font-bold text-slate-500 mb-2">{m.title}</p>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-black border border-amber-100">
                                    <Star size={10} className="fill-amber-400 mr-1" /> {m.rating}
                                </div>
                                <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest px-2 py-1 bg-slate-50 rounded-md border border-slate-100">
                                    {m.availability}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-8">
                        <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-200 text-left relative overflow-hidden hover:bg-white transition-colors">
                            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-2 relative z-10">
                                <BookOpen size={12} /> Will Teach You
                            </p>
                            <p className="text-sm font-bold text-slate-800 relative z-10">{m.teaching}</p>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-[1.5rem] border border-emerald-200 text-left relative overflow-hidden hover:bg-white transition-colors">
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-2 relative z-10">
                                <Sparkles size={12} /> Wants to Learn
                            </p>
                            <p className="text-sm font-bold text-emerald-900 relative z-10">{m.needs}</p>
                        </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          goToChat(m);
                        }} 
                        className="flex-1 cursor-pointer bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
                    >
                        <MessageSquare size={16} />
                        Message
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.reportUser(m.id);
                      }}
                      className="cursor-pointer group/report bg-red-50 text-red-500 hover:text-white hover:bg-red-500 p-4 rounded-2xl transition-all border border-red-100 shadow-sm"
                      title="Report User"
                    >
                      <AlertTriangle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 p-24 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-slate-300">
                <Search size={32} />
              </div>
              <p className="text-slate-500 font-black uppercase text-sm tracking-widest">No matching creators found</p>
              <p className="text-slate-400 text-xs font-bold mt-2">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => {
                  setters.setActiveCategoryFilter("All");
                  setters.setSearchQuery("");
                  setters.setSortBy("Recommended");
                }} 
                className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest cursor-pointer shadow-lg hover:bg-indigo-700 transition-all border-2 border-indigo-800"
              >
                Clear Everything
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-96 space-y-8">
            <div className="bg-white p-8 rounded-[3rem] border-2 border-indigo-50 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="font-black text-indigo-900 text-[12px] uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={16} className="text-indigo-600" />
                    Active Chats
                  </h4>
                  {recentPartners.length > 0 && (
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border border-indigo-700">
                        {recentPartners.length}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {recentPartners.length > 0 ? (
                    recentPartners.slice(0, 5).map((p: any) => {
                        const isSelected = state.activeChatPartner?.id === p.id;
                        return (
                          <button 
                            key={p.id}
                            onClick={() => goToChat(p)}
                            className={`w-full flex items-center gap-4 p-4 rounded-[2.2rem] border-2 transition-all group cursor-pointer relative ${
                              isSelected 
                              ? 'bg-indigo-600 border-indigo-700 shadow-xl text-white translate-x-2' 
                              : 'bg-white border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/30 shadow-sm'
                            }`}
                          >
                            <div className="relative shrink-0">
                              <div className={`w-14 h-14 rounded-2xl flex-shrink-0 overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center font-black ${
                                isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-indigo-600'
                              }`}>
                                {p.image ? <img src={p.image} className="w-full h-full object-cover" alt="" /> : <span className="uppercase">{p.name.substring(0,2)}</span>}
                              </div>
                              {p.status === 'Online' && (
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
                              )}
                            </div>

                            <div className="flex-1 text-left min-w-0">
                              <p className={`text-[14px] font-black truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                  {p.name}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <p className={`text-[9px] font-black truncate uppercase tracking-tighter ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                                    {p.teaching.substring(0, 15)}...
                                </p>
                                <span className={`text-[7px] font-black px-1 py-0.5 rounded bg-white/20 border ${isSelected ? 'border-white/20' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                    SWAP
                                </span>
                              </div>
                            </div>
                            <ArrowRight size={16} className={`${isSelected ? 'text-white' : 'text-slate-300 opacity-0 group-hover:opacity-100'} transition-all`} />
                          </button>
                        );
                    })
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center bg-white/50 rounded-[2rem] border-2 border-dashed border-indigo-100">
                      <MessageSquare className="text-indigo-200 mb-4" size={32} />
                      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest leading-relaxed px-6">Start a conversation</p>
                    </div>
                  )}
                </div>
            </div>

            <div className="bg-indigo-900 p-8 rounded-[3rem] shadow-2xl shadow-indigo-200 text-white relative overflow-hidden border-2 border-indigo-950">
                <div className="absolute -right-8 -bottom-8 opacity-10">
                    <Zap size={150} />
                </div>
                <h4 className="font-black text-[12px] uppercase tracking-widest flex items-center gap-2 mb-8">
                    <Sparkles size={16} className="text-amber-400" />
                    My Skill Profile
                </h4>
                
                <div className="space-y-6 relative z-10 text-left">
                    <div className="flex flex-wrap gap-2">
                        {state.mySkills.length > 0 ? (
                            state.mySkills.map((s: string) => (
                                <div key={s} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all">
                                    {s}
                                    <button onClick={() => actions.removeSkill(s)} className="cursor-pointer text-white/40 hover:text-red-400">✕</button>
                                </div>
                            ))
                        ) : (
                            <p className="text-indigo-200 text-xs font-bold py-4">Add skills to get verified!</p>
                        )}
                    </div>

                    <button 
                        onClick={() => setters.setShowDirectory(true)} 
                        className="cursor-pointer w-full bg-white text-indigo-900 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:scale-[1.02] transition-all shadow-lg active:scale-95 border-2 border-indigo-100"
                    >
                        + Add New Skills
                    </button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-200 shadow-sm text-left">
                <h4 className="font-black text-slate-900 mb-6 text-[12px] uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert size={16} className="text-red-500" />
                    Blocked Users
                </h4>
                
                <div className="space-y-3">
                  {blockedList.length > 0 ? (
                    blockedList.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-red-50/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden grayscale opacity-50 flex items-center justify-center font-black text-slate-400">
                            {user.image ? <img src={user.image} className="w-full h-full object-cover" alt="" /> : <span>{user.name.substring(0,1)}</span>}
                          </div>
                          <p className="text-[11px] font-black text-slate-600">{user.name}</p>
                        </div>
                        <button 
                          onClick={() => actions.unblockUser(user.id)}
                          className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-lg text-indigo-600 transition-all border border-indigo-100 bg-white shadow-sm"
                        >
                          <Unlock size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-400 font-bold text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl italic">
                      No blocked users
                    </p>
                  )}
                </div>
            </div>

        </aside>
      </div>
    </section>
  );
}