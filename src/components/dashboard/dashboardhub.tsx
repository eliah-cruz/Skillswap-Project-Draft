"use client";
import React, { useState } from 'react';
import { MessageSquare, Star, BookOpen, Zap, Search, Globe, Code, Palette, Languages, TrendingUp, Sparkles, ShieldAlert, Unlock, ArrowRight, UserCheck, X, Filter, Heart, MessageCircle, Flame } from 'lucide-react';

export default function DashboardHub({ state, setters, actions }: any) {
  const recentPartners = state.activeChatUsers || [];
  const blockedList = state.allMatches.filter((m: any) => state.blockedUsers.includes(m.id));
  const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Development": return <Code size={16} />;
      case "Design": return <Palette size={16} />;
      case "Languages": return <Languages size={16} />;
      case "Marketing": return <TrendingUp size={16} />;
      default: return <Globe size={16} />;
    }
  };

  const goToChat = (partner: any) => actions.openSpecificChat(partner);

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
              type="text" placeholder="Search names or skills..." value={state.searchQuery}
              onChange={(e) => setters.setSearchQuery(e.target.value)}
              className="w-full bg-white border-4 border-slate-100 hover:border-indigo-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 rounded-[2.5rem] py-6 pl-16 pr-14 text-lg font-bold text-slate-800 shadow-xl transition-all outline-none placeholder:text-slate-300"
            />
            {state.searchQuery && (
              <button onClick={() => setters.setSearchQuery("")} className="absolute inset-y-0 right-6 flex items-center text-slate-300 hover:text-red-500 cursor-pointer transition-colors">
                <X size={24} />
              </button>
            )}
          </div>

          <div className="bg-white p-2 rounded-[2.5rem] border-4 border-slate-100 shadow-xl flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
            <div className="px-4 text-slate-400"><Filter size={18} /></div>
            {["Recommended", "Top Rated", "Newest"].map((sort) => (
                <button key={sort} onClick={() => setters.setSortBy(sort)} className={`whitespace-nowrap px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-tight transition-all cursor-pointer ${state.sortBy === sort ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                    {sort}
                </button>
            ))}
          </div>
        </div>

        {/* UI FIX: Modified container layout for horizontal scrolling categories and anchored toggle */}
        <div className="bg-white p-3 rounded-[2.5rem] border-2 border-slate-200 flex flex-col xl:flex-row justify-between shadow-2xl shadow-indigo-100/40 gap-3">
            
            {/* Scrollable Categories Area */}
            <div className="flex gap-2 px-2 overflow-x-auto no-scrollbar w-full pb-2 xl:pb-0 items-center">
              {["All", "Development", "Design", "Languages", "Marketing", "Business", "Culinary", "Life Skills"].map(cat => (
                <button key={cat} onClick={() => setters.setActiveCategoryFilter(cat)} className={`whitespace-nowrap shrink-0 group cursor-pointer px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 border-2 ${state.activeCategoryFilter === cat ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 hover:shadow-md'}`}>
                  {getCategoryIcon(cat)} {cat}
                </button>
              ))}
            </div>
            
            {/* Anchored Availability Toggle */}
            <div className="flex items-center justify-between xl:justify-end gap-4 xl:border-l-2 border-slate-100 xl:pl-6 px-4 xl:pr-6 shrink-0 pt-2 xl:pt-0 border-t-2 xl:border-t-0 border-slate-100">
                <div className="flex flex-col items-start xl:items-end">
                    <span className="text-[9px] font-black uppercase text-indigo-600 tracking-widest">Availability</span>
                    <span className="text-[11px] font-bold text-slate-500">Online Only</span>
                </div>
                <button onClick={() => setters.setOnlineOnly(!state.onlineOnly)} className={`cursor-pointer w-12 h-6 rounded-full transition-all relative border-2 ${state.onlineOnly ? 'bg-emerald-500 border-emerald-600' : 'bg-slate-300 border-slate-400'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all ${state.onlineOnly ? 'left-6' : 'left-0.5'}`} />
                </button>
            </div>

        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          {state.filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {state.filteredMatches.map((m: any) => (
                <div key={m.id} className={`bg-white p-8 rounded-[3rem] border-2 shadow-sm hover:shadow-2xl transition-all group relative flex flex-col ${m.isMutualMatch ? 'border-indigo-300 shadow-indigo-100/50' : 'border-slate-100 hover:border-indigo-200'}`}>
                  
                  {/* Mutual Match Badge */}
                  {m.isMutualMatch ? (
                    <div className="absolute -top-3 left-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 border-2 border-white animate-in slide-in-from-top-2 duration-500">
                      <Flame size={12} className="fill-white" /> Mutual Match
                    </div>
                  ) : m.matchScore && m.matchScore > 20 && state.sortBy === "Recommended" ? (
                    <div className="absolute -top-3 left-8 bg-amber-400 text-amber-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 border-2 border-white">
                      <Heart size={12} className="fill-amber-950" /> {Math.min(Math.round(m.matchScore), 99)}% Match
                    </div>
                  ) : null}

                  <div className="absolute top-6 right-6 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                    {m.category}
                  </div>

                  <div className="relative z-10 flex-1 cursor-pointer" onClick={() => goToChat(m)}>
                    <div className="flex gap-6 mb-6 mt-2">
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 rounded-[2rem] bg-slate-100 text-indigo-600 flex items-center justify-center font-black text-2xl shadow-inner border-[3px] border-white overflow-hidden shadow-indigo-100">
                                {m.image ? <img src={m.image} className="w-full h-full object-cover" alt="" /> : <span className="uppercase">{m.avatar || m.name.substring(0,2)}</span>}
                            </div>
                            <span className={`absolute bottom-0 right-0 w-5 h-5 border-[3px] border-white rounded-full shadow-sm ${m.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        </div>
                        
                        <div className="min-w-0 flex-1 pt-1 text-left">
                            <h4 className="text-xl font-black text-slate-900 truncate flex items-center gap-2 mb-1">
                                {m.name} {m.rating > 4.8 && <UserCheck size={18} className="text-indigo-500" />}
                            </h4>
                            <p className="text-xs font-bold text-slate-500 mb-2">{m.title}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <button onClick={(e) => { e.stopPropagation(); setExpandedReviewId(expandedReviewId === m.id ? null : m.id); }} className="cursor-pointer flex items-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors text-[10px] font-black border border-amber-200">
                                    <Star size={10} className="fill-amber-400 mr-1" /> {m.rating} ({m.reviewCount} Reviews)
                                </button>
                                <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest px-2 py-1 bg-slate-50 rounded-md border border-slate-100">
                                    {m.availability}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className={`p-4 rounded-[1.5rem] border text-left relative overflow-hidden transition-colors ${m.isMutualMatch ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50 border-slate-200 group-hover:bg-indigo-50/30'}`}>
                            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-2 relative z-10"><BookOpen size={12} /> Will Teach You</p>
                            <p className="text-sm font-bold text-slate-800 relative z-10">{m.teaching}</p>
                        </div>
                        <div className={`p-4 rounded-[1.5rem] border text-left relative overflow-hidden transition-colors ${m.isMutualMatch ? 'bg-emerald-50/70 border-emerald-300' : 'bg-emerald-50 border-emerald-200 group-hover:bg-emerald-100/50'}`}>
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-2 relative z-10"><Sparkles size={12} /> Wants to Learn</p>
                            <p className="text-sm font-bold text-emerald-900 relative z-10">{m.needs}</p>
                        </div>
                    </div>
                  </div>

                  {/* Rating Graph & Reviews Expansion */}
                  {expandedReviewId === m.id && (
                    <div className="mb-6 p-5 bg-slate-50 rounded-[2rem] border border-slate-200 animate-in slide-in-from-top-2 duration-300 shadow-inner">
                      
                      {/* Graph Section */}
                      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-200">
                        <div className="text-center shrink-0">
                          <p className="text-4xl font-black text-slate-900">{m.rating}</p>
                          <div className="flex items-center justify-center gap-0.5 mt-1">
                            {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= Math.round(m.rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />)}
                          </div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{m.reviewCount} Ratings</p>
                        </div>
                        
                        <div className="flex-1 space-y-1.5">
                          {[5, 4, 3, 2, 1].map(star => {
                            // Faking distribution visually based on average rating
                            const width = star === 5 ? (m.rating >= 4.5 ? '85%' : '40%') :
                                          star === 4 ? (m.rating >= 4.0 && m.rating < 4.8 ? '50%' : '15%') :
                                          star === 3 ? (m.rating < 4.5 ? '20%' : '0%') : '0%';
                            return (
                              <div key={star} className="flex items-center gap-2 text-[9px] font-black text-slate-400">
                                <span>{star}</span>
                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-400 rounded-full" style={{ width }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Comments Section */}
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                        <MessageCircle size={12} /> Recent Feedback
                      </h5>
                      <div className="space-y-3">
                        {m.reviews.slice(0, 2).map((r: any) => (
                          <div key={r.id} className="text-left bg-white p-4 rounded-[1.2rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-slate-800">{r.reviewer}</span>
                              <span className="text-[10px] font-black text-amber-500 flex items-center bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100"><Star size={10} className="fill-amber-400 mr-1" />{r.rating}.0</span>
                            </div>
                            <p className="text-xs text-slate-500 italic leading-relaxed">"{r.comment}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 mt-auto relative z-10">
                    <button onClick={() => goToChat(m)} className="flex-1 cursor-pointer bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl">
                        <MessageSquare size={16} /> Message
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
              <button onClick={() => { setters.setActiveCategoryFilter("All"); setters.setSearchQuery(""); setters.setSortBy("Recommended"); }} className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest cursor-pointer shadow-lg hover:bg-indigo-700 transition-all">Clear Everything</button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-96 space-y-8">
            <div className="bg-white p-8 rounded-[3rem] border-2 border-indigo-50 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="font-black text-indigo-900 text-[12px] uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={16} className="text-indigo-600" /> Active Chats
                  </h4>
                  {recentPartners.length > 0 && <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border border-indigo-700">{recentPartners.length}</span>}
                </div>

                <div className="space-y-4">
                  {recentPartners.length > 0 ? (
                    recentPartners.slice(0, 5).map((p: any) => {
                        const isSelected = state.activeChatPartner?.id === p.id;
                        return (
                          <button key={p.id} onClick={() => goToChat(p)} className={`w-full flex items-center gap-4 p-4 rounded-[2.2rem] border-2 transition-all group cursor-pointer relative ${isSelected ? 'bg-indigo-600 border-indigo-700 shadow-xl text-white translate-x-2' : 'bg-white border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/30 shadow-sm'}`}>
                            <div className="relative shrink-0">
                              <div className={`w-14 h-14 rounded-2xl flex-shrink-0 overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center font-black ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-indigo-600'}`}>
                                {p.image ? <img src={p.image} className="w-full h-full object-cover" alt="" /> : <span className="uppercase">{p.name.substring(0,2)}</span>}
                              </div>
                              {p.status === 'Online' && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <p className={`text-[14px] font-black truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>{p.name}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <p className={`text-[9px] font-black truncate uppercase tracking-tighter ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>{p.teaching.substring(0, 15)}...</p>
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

            {/* EYE-FRIENDLY SKILL PROFILE CARD */}
            <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 text-white relative overflow-hidden border border-slate-800">
                <div className="absolute -right-8 -bottom-8 opacity-5 text-slate-400"><Zap size={150} /></div>
                <h4 className="font-black text-[12px] uppercase tracking-widest flex items-center gap-2 mb-8"><Sparkles size={16} className="text-amber-400" /> My Skill Profile</h4>
                
                <div className="space-y-6 relative z-10 text-left">
                    {/* Teachable List */}
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-3">I Can Teach:</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                          {state.mySkills.length > 0 ? (
                              state.mySkills.map((s: string) => (
                                  <div key={s} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 rounded-lg text-[11px] font-black uppercase tracking-tight transition-all hover:border-indigo-400/50">
                                      {s} <button onClick={() => actions.removeSkill(s)} className="text-indigo-400 hover:text-indigo-100 cursor-pointer transition-colors">✕</button>
                                  </div>
                              ))
                          ) : (
                              <p className="text-slate-500 text-xs font-bold mb-2 italic">No skills added yet.</p>
                          )}
                      </div>
                      <button onClick={() => { setters.setAddingSkillType('teaching'); setters.setShowDirectory(true); }} className="cursor-pointer w-full bg-slate-800 text-slate-300 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-all border border-slate-700">+ Add Teachable Skill</button>
                    </div>

                    {/* Desired List */}
                    <div className="pt-4 border-t border-slate-800">
                      <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-3">I Want To Learn:</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                          {state.myNeeds.length > 0 ? (
                              state.myNeeds.map((s: string) => (
                                  <div key={s} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 rounded-lg text-[11px] font-black uppercase tracking-tight transition-all hover:border-emerald-400/50">
                                      {s} <button onClick={() => actions.removeNeed(s)} className="text-emerald-400 hover:text-emerald-100 cursor-pointer transition-colors">✕</button>
                                  </div>
                              ))
                          ) : (
                              <p className="text-slate-500 text-xs font-bold mb-2 italic">What do you want to learn?</p>
                          )}
                      </div>
                      <button onClick={() => { setters.setAddingSkillType('learning'); setters.setShowDirectory(true); }} className="cursor-pointer w-full bg-slate-800 text-slate-300 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-all border border-slate-700">+ Add Desired Skill</button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-200 shadow-sm text-left">
                <h4 className="font-black text-slate-900 mb-6 text-[12px] uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={16} className="text-red-500" /> Blocked Users</h4>
                <div className="space-y-3">
                  {blockedList.length > 0 ? (
                    blockedList.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden grayscale opacity-50 flex items-center justify-center font-black text-slate-400">
                            {user.image ? <img src={user.image} className="w-full h-full object-cover" alt="" /> : <span>{user.name.substring(0,1)}</span>}
                          </div>
                          <p className="text-[11px] font-black text-slate-600">{user.name}</p>
                        </div>
                        <button onClick={() => actions.unblockUser(user.id)} className="cursor-pointer p-2 hover:bg-indigo-600 hover:text-white rounded-lg text-indigo-600 transition-all border border-indigo-100 bg-white"><Unlock size={14} /></button>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-400 font-bold text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl italic">No blocked users</p>
                  )}
                </div>
            </div>
        </aside>
      </div>
    </section>
  );
}