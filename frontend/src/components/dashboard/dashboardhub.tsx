"use client";
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Star, BookOpen, Search, Globe, Code, Palette, 
  Languages, TrendingUp, Sparkles, ShieldAlert, Unlock, ArrowRight, 
  UserCheck, X, Filter, Heart, MessageCircle, Flame, AlertTriangle, 
  MapPin, Flag, Repeat, GraduationCap, Coins, Briefcase, Utensils, Zap, Lock
} from 'lucide-react';

export default function DashboardHub({ state, setters, actions }: any) {
  const recentPartners = state.activeChatUsers || [];
  
  const blockedList = state.allMatches.filter((m: any) => 
    state.blockedUsers.includes(m.id) || state.reportedUsers.includes(m.id)
  );
  
  const [activeReviewsMember, setActiveReviewsMember] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState<any>(null);
  const [reportReason, setReportReason] = useState("Spam");

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 4; 

  const [reviewPage, setReviewPage] = useState(1);
  const reviewsPerPage = 2;

  const [showHoursTooltip, setShowHoursTooltip] = useState(false); // NEW: Tracks manual tooltip click/tap state

  useEffect(() => {
    setCurrentPage(1);
  }, [state.activeCategoryFilter, state.searchQuery, state.onlineOnly]);

  useEffect(() => {
    if (state.showChat) {
      setShowReportModal(false);
      setReportTarget(null);
    }
  }, [state.showChat]);

  useEffect(() => {
    setReviewPage(1);
  }, [activeReviewsMember]);

  // Fix: Click anywhere on the screen closes the tooltip on touch devices/mobile/TVs
  useEffect(() => {
    const handleGlobalClick = () => {
      setShowHoursTooltip(false);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Development": return <Code size={16} />;
      case "Design": return <Palette size={16} />;
      case "Languages": return <Languages size={16} />;
      case "Marketing": return <TrendingUp size={16} />;
      case "Business": return <Briefcase size={16} />;
      case "Culinary": return <Utensils size={16} />;
      case "Life Skills": return <Heart size={16} />;
      default: return <Globe size={16} />;
    }
  };

  const handleOpenReport = (user: any) => {
    setReportReason("Spam");
    setReportTarget(user);
    setShowReportModal(true);
    setters.setShowChat(false);
  };

  const handleConfirmReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportTarget) {
      actions.reportUser(reportTarget.id, reportReason);
      setShowReportModal(false);
      setReportTarget(null);
    }
  };

  const goToChat = (partner: any) => {
    setShowReportModal(false);
    setReportTarget(null);
    actions.openSpecificChat(partner);
  };

  const totalCards = state.filteredMatches.length;
  const totalPages = Math.ceil(totalCards / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const paginatedMatches = state.filteredMatches.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="container mx-auto px-4 md:px-5 py-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* High-Performance GPU Match & Glow Animation Keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(245, 158, 11, 0.2); border-color: rgba(245, 158, 11, 0.3); }
          50% { box-shadow: 0 0 25px rgba(245, 158, 11, 0.5); border-color: rgba(245, 158, 11, 0.7); }
        }
        @keyframes matchParticles {
          0% { transform: scale(0.95); filter: brightness(1); }
          50% { transform: scale(1.02); filter: brightness(1.05); }
          100% { transform: scale(1); filter: brightness(1); }
        }
        @keyframes newMemberPulse {
          0%, 100% { border-color: #a7f3d0; box-shadow: 0 0 8px rgba(16, 185, 129, 0.1); }
          50% { border-color: #34d399; box-shadow: 0 0 16px rgba(16, 185, 129, 0.3); }
        }
        .animate-glow-amber {
          animation: glowPulse 2s infinite ease-in-out;
          will-change: box-shadow, border-color;
        }
        .animate-match-boost {
          animation: matchParticles 0.8s ease-out forwards;
          will-change: transform, filter;
        }
        .animate-new-pulse {
          animation: newMemberPulse 3s infinite ease-in-out;
          will-change: border-color, box-shadow;
        }
      `}} />

      {/* Top Search & Filter Bar */}
      <div className="sticky top-20 md:top-24 z-20 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 max-w-6xl mx-auto">
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-5 md:left-6 flex items-center pointer-events-none">
              <Search className="text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            </div>
            <input 
              type="text" placeholder="Search names or skills..." value={state.searchQuery}
              onChange={(e) => setters.setSearchQuery(e.target.value)}
              className="w-full bg-white border-4 border-slate-100 hover:border-indigo-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 rounded-[2rem] md:rounded-[2.5rem] py-4 md:py-6 pl-14 md:pl-16 pr-12 md:pr-14 text-base md:text-lg font-bold text-slate-800 shadow-lg transition-all outline-none placeholder:text-slate-300"
            />
            {state.searchQuery && (
              <button type="button" onClick={() => setters.setSearchQuery("")} className="absolute inset-y-0 right-5 md:right-6 flex items-center text-slate-300 hover:text-red-500 cursor-pointer transition-colors">
                <X size={20} />
              </button>
            )}
          </div>

          <div className="bg-white p-2 rounded-[2rem] md:rounded-[2.5rem] border-4 border-slate-100 shadow-lg flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
            <div className="px-3 md:px-4 text-slate-400 hidden sm:block"><Filter size={18} /></div>
            {["Recommended", "Top Rated", "Newest"].map((sort) => (
                <button type="button" key={sort} onClick={() => setters.setSortBy(sort)} className={`whitespace-nowrap px-4 md:px-6 py-2.5 md:py-3 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-tight transition-all cursor-pointer ${state.sortBy === sort ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                    {sort}
                </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-2 md:p-3 rounded-[2rem] md:rounded-[2.5rem] border-2 border-slate-200 flex flex-col xl:flex-row justify-between shadow-xl shadow-indigo-100/40 gap-3 overflow-hidden">
            <div className="flex gap-2 px-2 overflow-x-auto overflow-y-hidden no-scrollbar w-full items-center pb-2 xl:pb-0">
              {["All", "Development", "Design", "Languages", "Marketing", "Business", "Culinary", "Life Skills"].map(cat => (
                <button type="button" key={cat} onClick={() => setters.setActiveCategoryFilter(cat)} className={`whitespace-nowrap shrink-0 group cursor-pointer px-4 md:px-5 py-2.5 md:py-3 rounded-[1.2rem] md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 border-2 ${state.activeCategoryFilter === cat ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105' : 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 hover:shadow-sm'}`}>
                  {getCategoryIcon(cat)} {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between xl:justify-end gap-4 xl:border-l-2 border-slate-100 xl:pl-6 px-4 xl:pr-6 shrink-0 pt-2 xl:pt-0 border-t-2 xl:border-t-0 border-slate-100">
                <div className="flex flex-col items-start xl:items-end">
                    <span className="text-[8px] md:text-[9px] font-black uppercase text-indigo-600 tracking-widest">Availability</span>
                    <span className="text-[10px] md:text-[11px] font-bold text-slate-500">Online Only</span>
                </div>
                <button type="button" onClick={() => setters.setOnlineOnly(!state.onlineOnly)} className={`cursor-pointer w-10 md:w-12 h-5 md:h-6 rounded-full transition-all relative border-2 ${state.onlineOnly ? 'bg-emerald-500 border-emerald-600' : 'bg-slate-300 border-slate-400'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-md transition-all ${state.onlineOnly ? 'left-6 md:left-7' : 'left-0.5'}`} />
                </button>
            </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
        
        {/* MATCHES GRID */}
        <div className="flex-1 min-w-0">
          {!state.hasSkillsConfigured ? (
            <div className="bg-slate-50 rounded-[3rem] md:rounded-[4rem] border-4 border-dashed border-slate-200 p-10 md:p-24 text-center max-w-4xl mx-auto shadow-inner animate-in fade-in duration-300">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 text-indigo-600 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-xl animate-pulse">
                <Sparkles size={28} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 md:mb-3 uppercase tracking-tight">Active Verification Required</h3>
              <p className="text-slate-500 font-bold text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                To unlock discovery, add at least <span className="text-indigo-600">one teachable skill</span> and <span className="text-emerald-600">one desired skill</span> inside the <span className="font-extrabold text-slate-800">"My Skill Profile"</span> sidebar dashboard.
              </p>
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                <button type="button" onClick={() => { setters.setAddingSkillType('teaching'); setters.setShowDirectory(true); }} className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3.5 md:py-3 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-wider hover:bg-slate-900 transition-all cursor-pointer shadow-lg shadow-indigo-100">
                  + Add Teachable Skill
                </button>
                <button type="button" onClick={() => { setters.setAddingSkillType('learning'); setters.setShowDirectory(true); }} className="w-full sm:w-auto bg-emerald-600 text-white px-6 py-3.5 md:py-3 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-wider hover:bg-slate-900 transition-all cursor-pointer shadow-lg shadow-emerald-100">
                  + Add Desired Skill
                </button>
              </div>
            </div>
          ) : paginatedMatches.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                {paginatedMatches.map((m: any) => {
                  const isNewMember = m.reviewCount === 0;
                  const isLowRated = m.rating < 4.0 && m.reviewCount > 0;
                  const isHighRated = m.rating >= 4.5 && m.reviewCount > 0;
                  
                  let cardBorderClass = "border-slate-100";
                  let cardBgClass = "bg-white";
                  let cardGlowEffect = "";

                  if (state.sortBy === "Recommended") {
                    if (m.isMutualMatch) {
                      cardBorderClass = "border-indigo-400";
                      cardBgClass = "bg-gradient-to-br from-white via-indigo-50/5 to-indigo-50/15";
                      cardGlowEffect = "animate-match-boost";
                    } else if (m.isCircularMatch) {
                      cardBorderClass = "border-teal-300";
                      cardBgClass = "bg-gradient-to-br from-white via-teal-50/5 to-teal-50/10";
                      cardGlowEffect = "animate-match-boost";
                    } else if (m.matchScore && m.matchScore > 50) {
                      cardBorderClass = "border-indigo-200";
                    }
                  } else if (state.sortBy === "Top Rated") {
                    if (isHighRated) {
                      cardBorderClass = "border-amber-400";
                      cardBgClass = "bg-gradient-to-br from-white to-amber-50/5";
                      cardGlowEffect = "animate-glow-amber";
                    }
                  } else if (state.sortBy === "Newest") {
                    if (isNewMember) {
                      cardBorderClass = "border-emerald-300";
                      cardBgClass = "bg-gradient-to-br from-white via-emerald-50/5 to-emerald-50/10";
                      cardGlowEffect = "animate-new-pulse";
                    }
                  }

                  if (isLowRated) {
                    cardBorderClass = "border-red-300";
                    cardBgClass = "bg-red-50/5";
                    cardGlowEffect = "";
                  }

                  const safeBio = m.bio 
                    ? (m.bio.split(' ').length > 15 
                        ? `${m.bio.split(' ').slice(0, 15).join(' ')}...` 
                        : m.bio)
                    : `Passionate about sharing my knowledge in ${m.teaching ? m.teaching.split(',')[0] : 'Various Skills'} and learning ${m.needs ? m.needs.split(',')[0] : 'Eager to learn'}.`;
                  
                  return (
                  <div key={m.id} className={`bg-white rounded-[2.5rem] md:rounded-[3rem] border-2 shadow-sm hover:shadow-xl transition-all group flex flex-col overflow-hidden ${cardBorderClass} ${cardBgClass} ${cardGlowEffect}`}>
                    
                    {isLowRated ? (
                      <div className="w-full bg-red-500 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest py-2.5 md:py-3 text-center flex items-center justify-center gap-2 shadow-sm relative z-20">
                        <AlertTriangle size={14} strokeWidth={3} /> Low Rating Warning
                      </div>
                    ) : state.sortBy === "Recommended" && m.isMutualMatch ? (
                      <div className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2.5 md:py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center justify-center gap-2 relative z-20">
                        <Flame size={14} className="fill-white" /> Mutual Match
                      </div>
                    ) : state.sortBy === "Recommended" && m.isCircularMatch ? (
                      <div className="w-full bg-gradient-to-r from-teal-400 to-emerald-500 text-white py-2.5 md:py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center justify-center gap-2 relative z-20">
                        <Repeat size={14} className="text-white" /> Circular Match
                      </div>
                    ) : state.sortBy === "Recommended" && m.matchScore && m.matchScore > 20 ? (
                      <div className="w-full bg-indigo-600 text-white py-2.5 md:py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center justify-center gap-2 relative z-20">
                        <Heart size={14} className="fill-white animate-pulse" /> {Math.min(Math.round(m.matchScore), 99)}% Recommended Match
                      </div>
                    ) : state.sortBy === "Top Rated" && isHighRated ? (
                      <div className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 py-2.5 md:py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center justify-center gap-2 relative z-20">
                        <Star size={14} className="fill-amber-950 text-amber-950 animate-bounce" /> Highly Rated Educator
                      </div>
                    ) : state.sortBy === "Newest" && isNewMember ? (
                      <div className="w-full bg-emerald-500 text-white py-2.5 md:py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center justify-center gap-2 relative z-20">
                        <Sparkles size={14} className="fill-white" /> Fresh Joiner 🌱
                      </div>
                    ) : null}

                    {/* Card Body */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col relative text-left">
                      
                      {/* Desktop Badge */}
                      <div className="hidden sm:block absolute top-6 right-6 md:top-8 md:right-8 bg-indigo-50 text-indigo-700 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm z-20">
                        {m.category}
                      </div>

                      <div className="relative z-10 flex-1">
                        
                        <div className="flex gap-4 md:gap-5 mb-2 sm:pr-24">
                            <div className="relative shrink-0">
                                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] md:rounded-[2rem] flex items-center justify-center font-black text-xl md:text-2xl shadow-inner border-[3px] border-white overflow-hidden ${isLowRated ? 'bg-red-50 text-red-600 shadow-red-100' : isHighRated ? 'bg-amber-50 text-amber-600 shadow-amber-100' : 'bg-slate-100 text-indigo-600 shadow-indigo-100'}`}>
                                    {m.image ? <img src={m.image} className="w-full h-full object-cover" alt="" /> : <span className="uppercase">{m.avatar || m.name.substring(0,2)}</span>}
                                </div>
                            </div>
                            
                            <div className="min-w-0 flex-1 pt-1 text-left">
                                <h4 className="text-base md:text-xl font-black text-slate-900 truncate flex items-center gap-1.5 md:gap-2 mb-1">
                                    {m.name} {m.isVerified && <UserCheck size={16} className="text-indigo-500 shrink-0 md:w-[18px] md:h-[18px]" />}
                                </h4>
                                
                                {/* Mobile Category Badge */}
                                <div className="sm:hidden inline-block bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm mb-1.5">
                                  {m.category}
                                </div>

                                <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
                                    <span className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full shadow-sm border border-white shrink-0 ${m.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                    <p className="text-[11px] md:text-xs font-bold text-slate-500 truncate">{m.status} • {m.title}</p>
                                </div>

                                <div className="flex flex-wrap gap-x-1.5 md:gap-x-2 gap-y-2">
                                    <button 
                                      type="button"
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        if (m.reviewCount > 0) setActiveReviewsMember(m); 
                                      }} 
                                      className={`flex items-center gap-1 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[10px] md:text-[11px] font-black border transition-all ${m.reviewCount === 0 ? 'bg-slate-50 text-slate-500 border-slate-200 cursor-default' : isLowRated ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 cursor-pointer hover:scale-105' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 cursor-pointer hover:scale-105'}`}
                                    >
                                        {m.reviewCount === 0 ? (
                                          <><Sparkles size={10} className="text-emerald-500" /> New</>
                                        ) : (
                                          <>{isLowRated ? <AlertTriangle size={10} className="text-red-500" /> : <Star size={10} className="fill-amber-400 text-amber-400" />} {m.rating} ({m.reviewCount})</>
                                        )}
                                    </button>
                                    
                                    <div className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-wider px-2.5 md:px-3 py-1 md:py-1.5 bg-slate-50 rounded-lg md:rounded-xl border border-slate-200 shadow-sm">
                                      {m.availability}
                                    </div>

                                    {m.experienceLevel && (
                                      <div className="text-[9px] md:text-[10px] font-black uppercase text-indigo-700 tracking-wider px-2.5 md:px-3 py-1 md:py-1.5 bg-indigo-50 rounded-lg md:rounded-xl border border-indigo-100 flex items-center gap-1 shadow-sm">
                                        <GraduationCap size={10} className="text-indigo-500" /> {m.experienceLevel}
                                      </div>
                                    )}

                                    <div className="text-[9px] md:text-[10px] font-black uppercase text-amber-700 tracking-wider px-2.5 md:px-3 py-1 md:py-1.5 bg-amber-50 rounded-lg md:rounded-xl border border-amber-200 flex items-center gap-1 shadow-sm">
                                      <Coins size={10} className="fill-amber-500 text-amber-500" /> {m.hoursBalance ?? 3} HR
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isNewMember && (
                          <div className="mt-3 md:mt-4 mb-3 md:mb-4 bg-emerald-50/50 border border-emerald-100 rounded-[1rem] md:rounded-2xl p-3 md:p-4 flex items-start gap-2.5 md:gap-3">
                            <ShieldAlert className="text-emerald-600 shrink-0 mt-0.5" size={14} />
                            <div>
                              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-wider text-emerald-800">Fresh Member Advisory</p>
                              <p className="text-[10px] md:text-[11px] text-emerald-700 font-medium leading-relaxed mt-0.5">This member joined recently and has no ratings yet. Always conduct sessions safely.</p>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 md:mt-6 mb-4 md:mb-6 px-2 border-l-[3px] border-slate-200">
                          <p className="text-xs md:text-[13px] text-slate-500 italic leading-relaxed line-clamp-3 pl-2.5 md:pl-3">"{safeBio}"</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4">
                            <div className={`flex-1 p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] border text-left relative overflow-hidden transition-colors ${isLowRated ? 'bg-red-50/30 border-red-100' : m.isMutualMatch ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50 border-slate-100 group-hover:bg-indigo-50/30'}`}>
                                <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5 relative z-10 ${isLowRated ? 'text-red-600' : 'text-indigo-600'}`}><BookOpen size={12} /> Will Teach</p>
                                <p className="text-xs md:text-[14px] font-bold text-slate-900 relative z-10 leading-snug">{m.teaching}</p>
                            </div>
                            <div className={`flex-1 p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] border text-left relative overflow-hidden transition-colors ${isLowRated ? 'bg-red-50/30 border-red-100' : m.isMutualMatch ? 'bg-emerald-50/70 border-emerald-300' : 'bg-emerald-50/50 border-emerald-100 group-hover:bg-emerald-100/50'}`}>
                                <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5 relative z-10 ${isLowRated ? 'text-red-600' : 'text-emerald-600'}`}><Sparkles size={12} /> Wants to Learn</p>
                                <p className="text-xs md:text-[14px] font-bold text-emerald-950 relative z-10 leading-snug">{m.needs}</p>
                            </div>
                        </div>

                        {m.isCircularMatch && (
                          <div className="mt-3 md:mt-4 mb-3 md:mb-4 p-3 md:p-4 bg-teal-50/70 border border-teal-200 rounded-xl md:rounded-2xl text-left animate-in slide-in-from-top-2 duration-300 overflow-x-auto no-scrollbar">
                            <p className="text-[9px] md:text-[10px] font-black uppercase text-teal-800 tracking-wider mb-2.5 md:mb-3 flex items-center gap-1.5">
                              <Repeat size={12} className="text-teal-600" /> 3-Way Exchange Loop Detected
                            </p>
                            
                            <div className="flex items-center justify-between text-center gap-1 min-w-[200px]">
                              <div className="flex flex-col items-center">
                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-slate-900 text-white flex items-center justify-center text-[9px] md:text-[10px] font-black">
                                  YOU
                                </div>
                                <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase mt-1">Teaches</span>
                              </div>

                              <ArrowRight size={12} className="text-teal-400" />

                              <div className="flex flex-col items-center">
                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-teal-600 text-white flex items-center justify-center text-[9px] md:text-[10px] font-black uppercase">
                                  {m.name.substring(0, 2)}
                                </div>
                                <span className="text-[7px] md:text-[8px] font-black text-teal-600 uppercase mt-1">{m.name.split(' ')[0]}</span>
                              </div>

                              <ArrowRight size={12} className="text-teal-400" />

                              <div className="flex flex-col items-center">
                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-indigo-100 text-indigo-600 border border-indigo-200 flex items-center justify-center text-sm font-black">
                                  ?
                                </div>
                                <span className="text-[7px] md:text-[8px] font-black text-indigo-500 uppercase mt-1">Peer C</span>
                              </div>

                              <ArrowRight size={12} className="text-teal-400" />

                              <div className="flex flex-col items-center">
                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-slate-900 text-white flex items-center justify-center text-[9px] md:text-[10px] font-black">
                                  YOU
                                </div>
                                <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase mt-1">Learns</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2.5 md:gap-3 mt-auto relative z-10 pt-2">
                        <button type="button" onClick={() => goToChat(m)} className={`flex-1 cursor-pointer text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-1.5 md:gap-2 shadow-xl ${isLowRated ? 'bg-red-600 hover:bg-slate-900' : 'bg-slate-900 hover:bg-indigo-600'}`}>
                            <MessageSquare size={14} className="md:w-4 md:h-4" /> Message
                        </button>
                        
                        <button 
                          type="button"
                          onClick={() => handleOpenReport(m)}
                          className="cursor-pointer bg-red-50 text-red-400 hover:text-white hover:bg-red-500 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all border border-red-100 hover:border-red-500 shadow-sm flex items-center justify-center shrink-0"
                          title="Report User"
                        >
                          <Flag size={16} className="md:w-[18px] md:h-[18px]" />
                        </button>
                      </div>

                    </div>
                  </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 md:mt-12 flex justify-center items-center gap-1.5 md:gap-2 animate-in fade-in duration-500 pb-6 md:pb-8">
                  <button 
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="cursor-pointer px-3 md:px-4 py-2 border-2 border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase text-slate-500 hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      type="button"
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`cursor-pointer w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black border-2 transition-all ${
                        currentPage === pageNum
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105"
                          : "bg-white border-slate-200 text-slate-500 hover:border-indigo-600 hover:text-indigo-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button 
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="cursor-pointer px-3 md:px-4 py-2 border-2 border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase text-slate-500 hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[3rem] md:rounded-[4rem] border-4 border-dashed border-slate-200 p-12 md:p-24 text-center mx-4 md:mx-0">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl text-slate-300"><Search size={28} /></div>
              <p className="text-slate-500 font-black uppercase text-xs md:text-sm tracking-widest">No matching creators found</p>
              <button type="button" onClick={() => { setters.setActiveCategoryFilter("All"); setters.setSearchQuery(""); setters.setSortBy("Recommended"); }} className="mt-5 md:mt-6 bg-indigo-600 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-black text-[10px] md:text-[11px] uppercase tracking-widest cursor-pointer shadow-lg hover:bg-indigo-700 transition-all">Clear Everything</button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 xl:w-96 space-y-6 md:space-y-8">
            {/* Active Chats */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border-2 border-indigo-50 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 md:mb-8 text-left">
                  <h4 className="font-black text-indigo-900 text-[11px] md:text-[12px] uppercase tracking-widest flex items-center gap-1.5 md:gap-2"><MessageSquare size={14} className="text-indigo-600 md:w-4 md:h-4" /> Active Chats</h4>
                  {recentPartners.length > 0 && <span className="bg-indigo-600 text-white text-[9px] md:text-[10px] font-black px-2.5 md:px-3 py-0.5 md:py-1 rounded-full shadow-lg border border-indigo-700">{recentPartners.length}</span>}
                </div>
                <div className="space-y-3 md:space-y-4">
                  {recentPartners.length > 0 ? (
                    recentPartners.slice(0, 5).map((p: any) => {
                        const isSelected = state.activeChatPartner?.id === p.id;
                        const history = state.chatHistory[p.id];
                        const lastMsg = history && history.length > 0 ? history[history.length - 1] : null;
                        const unreadCount = state.unreadCounts?.[p.id] || 0;

                        return (
                          <button type="button" key={p.id} onClick={() => goToChat(p)} className={`w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border transition-all group cursor-pointer relative ${isSelected ? 'bg-indigo-600 border-indigo-700 shadow-xl text-white translate-x-1.5 md:translate-x-2' : 'bg-slate-50 border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-sm'}`}>
                            <div className="relative shrink-0">
                              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[1rem] md:rounded-[1.2rem] flex-shrink-0 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center font-black text-sm md:text-base transition-all ${isSelected ? 'bg-indigo-500 text-white' : unreadCount > 0 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-100 text-indigo-600'}`}>
                                {p.image ? <img src={p.image} className="w-full h-full object-cover" alt="" /> : <span className="uppercase">{p.name.substring(0,2)}</span>}
                              </div>
                              {p.status === 'Online' && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-3.5 md:h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="flex justify-between items-baseline mb-0.5">
                                <p className={`text-xs md:text-[13px] font-black truncate pr-2 ${isSelected ? 'text-white' : unreadCount > 0 ? 'text-indigo-600' : 'text-slate-900'}`}>{p.name}</p>
                                {lastMsg && <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest shrink-0 ${isSelected ? 'text-indigo-200' : unreadCount > 0 ? 'text-indigo-500' : 'text-slate-400'}`}>{lastMsg.timestamp}</span>}
                              </div>
                              <div className="flex items-center gap-1.5 md:gap-2">
                                <p className={`text-[10px] md:text-[11px] truncate ${isSelected ? 'text-indigo-100 font-medium' : unreadCount > 0 ? 'text-indigo-500 font-black' : 'text-slate-500 font-medium'}`}>
                                  {lastMsg ? (lastMsg.type === 'file' ? '📁 File attachment' : (lastMsg.sender === 'me' ? `You: ${lastMsg.text}` : lastMsg.text)) : `Teaches: ${p.teaching.split(',')[0]}`}
                                </p>
                                {unreadCount > 0 && !isSelected && (
                                  <div className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ml-auto shadow-sm animate-pulse">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                    })
                  ) : (
                    <div className="py-10 md:py-12 flex flex-col items-center justify-center text-center bg-white/50 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-indigo-100"><MessageSquare className="text-indigo-200 mb-3 md:mb-4" size={28} /><p className="text-[9px] md:text-[10px] text-indigo-400 font-black uppercase tracking-widest leading-relaxed px-4 md:px-6">No recent chats</p></div>
                  )}
                </div>
            </div>

            {/* My Skill Profile */}
            <div className="bg-slate-900 p-5 xs:p-6 sm:p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/50 text-white relative overflow-hidden border border-slate-800">
                <div className="absolute -right-8 -bottom-8 opacity-5 text-slate-400"><Zap size={120} className="md:w-[150px] md:h-[150px]" /></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8 border-b border-slate-800 pb-4">
                  <h4 className="font-black text-[10px] sm:text-[11px] md:text-[12px] uppercase tracking-widest flex items-center gap-1.5 sm:gap-2">
                    <Sparkles size={14} className="text-amber-400 shrink-0" /> My Skill Profile
                  </h4>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                    {/* My Own Star Rating Badge */}
                    <div className="flex items-center gap-1 bg-slate-800 text-amber-400 px-2.5 py-1.5 sm:py-1 rounded-lg sm:rounded-xl border border-slate-700 shadow-sm cursor-default shrink-0">
                      <Star size={12} className="fill-amber-400 shrink-0" />
                      <span className="text-[9px] font-black tracking-widest">
                        {state.myReviewCount === 0 ? "NEW" : state.myRating.toFixed(1)}
                      </span>
                    </div>

                    {/* Explanatory hours balance box */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); setShowHoursTooltip(!showHoursTooltip); }}
                      className="relative group flex items-center gap-1.5 bg-amber-400/10 text-amber-400 px-2.5 py-1.5 sm:py-1 rounded-lg sm:rounded-xl border border-amber-400/20 cursor-help shrink-0 select-none"
                    >
                      <Coins size={12} className="fill-amber-400 shrink-0" />
                      <span className="text-[9px] md:text-[10px] font-black tracking-widest">{state.hoursBalance} HR</span>
                      
                      <div className={`absolute right-0 bottom-full sm:bottom-auto sm:top-10 mb-2 sm:mb-0 w-56 md:w-64 bg-slate-950 text-white p-3 md:p-4 rounded-xl shadow-xl transition-all duration-200 text-left z-50 text-[9px] md:text-[10px] font-bold leading-relaxed border border-slate-800 ${
                        showHoursTooltip 
                          ? 'opacity-100 pointer-events-auto scale-100' 
                          : 'opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100'
                      }`}>
                        💡 How Your Time-Bank Works:<br />
                        • <b>Earn 1 Hour:</b> Teach a peer! When they leave a 4★ or 5★ review for your session, you get 1 Hour.<br />
                        • <b>Spend 1 Hour:</b> Learn from a mentor! Submitting a 4★ or 5★ review transfers 1 Hour from your balance to theirs.<br />
                        • <b>Constructive Reviews:</b> Reviews between 1★ and 3★ are always <b>FREE</b> and do not deduct any hours.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 md:space-y-6 relative z-10 text-left">
                    <div>
                      <p className="text-[9px] md:text-[10px] uppercase text-slate-400 font-black tracking-widest mb-2.5 md:mb-3 flex items-center gap-1.5 md:gap-2">I Can Teach: <span className="text-[7px] md:text-[8px] bg-slate-800 px-1.5 md:px-2 py-0.5 rounded-full text-slate-500">{state.mySkills.length}/5</span></p>
                      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2.5 md:mb-3">
                          {state.mySkills.length > 0 ? (
                              state.mySkills.map((s: string) => (
                                  <div key={s} className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 rounded-md md:rounded-lg text-[10px] md:text-[11px] font-black uppercase tracking-tight transition-all hover:border-indigo-400/50">{s} <button type="button" onClick={() => actions.removeSkill(s)} className="text-indigo-400 hover:text-indigo-100 cursor-pointer transition-colors">✕</button></div>
                              ))
                          ) : (
                              <p className="text-slate-500 text-[10px] md:text-xs font-bold mb-2 italic">No skills added yet.</p>
                          )}
                      </div>
                      <button type="button" onClick={() => { setters.setAddingSkillType('teaching'); setters.setShowDirectory(true); }} className="cursor-pointer w-full bg-slate-800 text-slate-300 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-all border border-slate-700">+ Add Teachable Skill</button>
                    </div>
                    <div className="pt-4 border-t border-slate-800">
                      <p className="text-[9px] md:text-[10px] uppercase text-slate-400 font-black tracking-widest mb-2.5 md:mb-3 flex items-center gap-1.5 md:gap-2">I Want To Learn: <span className="text-[7px] md:text-[8px] bg-slate-800 px-1.5 md:px-2 py-0.5 rounded-full text-slate-500">{state.myNeeds.length}/5</span></p>
                      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2.5 md:mb-3">
                          {state.myNeeds.length > 0 ? (
                              state.myNeeds.map((s: string) => (
                                  <div key={s} className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 bg-emerald-500/15 text-emerald-300 border border-indigo-500/20 rounded-md md:rounded-lg text-[10px] md:text-[11px] font-black uppercase tracking-tight transition-all hover:border-emerald-400/50">{s} <button type="button" onClick={() => actions.removeNeed(s)} className="text-emerald-400 hover:text-emerald-100 cursor-pointer transition-colors">✕</button></div>
                              ))
                          ) : (
                              <p className="text-slate-500 text-[10px] md:text-xs font-bold mb-2 italic">What do you want to learn?</p>
                          )}
                      </div>
                      <button type="button" onClick={() => { setters.setAddingSkillType('learning'); setters.setShowDirectory(true); }} className="cursor-pointer w-full bg-slate-800 text-slate-300 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-all border border-slate-700">+ Add Desired Skill</button>
                    </div>
                </div>
            </div>

            {/* Blocked & Reported Users Sidebar Card */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border-2 border-indigo-50 shadow-sm text-left">
                <h4 className="font-black text-slate-900 mb-4 md:mb-6 text-[11px] md:text-[12px] uppercase tracking-widest flex items-center gap-1.5 md:gap-2"><ShieldAlert size={14} className="text-red-500 md:w-4 md:h-4" /> Blocked Users</h4>
                <div className="space-y-2.5 md:space-y-3">
                  {blockedList.length > 0 ? (
                    blockedList.map((user: any) => {
                      const isReported = state.reportedUsers.includes(user.id);
                      return (
                        <div key={user.id} className="flex items-center justify-between p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-2.5 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-slate-200 overflow-hidden grayscale opacity-50 flex items-center justify-center font-black text-slate-400 text-xs md:text-sm">{user.image ? <img src={user.image} className="w-full h-full object-cover" alt="" /> : <span>{user.name.substring(0,1)}</span>}</div>
                            <div>
                              <p className="text-[10px] md:text-[11px] font-black text-slate-600">{user.name}</p>
                              {isReported ? (
                                <span className="text-[7px] md:text-[8px] text-red-500 font-extrabold uppercase tracking-widest block mt-0.5">Reported (Pending)</span>
                              ) : (
                                <span className="text-[7px] md:text-[8px] text-slate-400 font-extrabold uppercase tracking-widest block mt-0.5">Blocked by you</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Static Lock Icon - Users CANNOT unblock manually */}
                          <div className="p-1.5 md:p-2 bg-slate-100 text-slate-400 rounded-md md:rounded-lg border border-slate-200" title="Locked: Only Admins can reverse this action">
                            <Lock size={12} className="md:w-3.5 md:h-3.5" />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-[10px] md:text-[11px] text-slate-400 font-bold text-center py-5 md:py-6 border-2 border-dashed border-slate-100 rounded-xl md:rounded-2xl italic">No blocked users</p>
                  )}
                </div>
            </div>
        </aside>
      </div>

      {/* Centered Member Reviews Modal (Resolves scrolling issue) */}
      {activeReviewsMember && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] w-full max-w-xl p-6 md:p-8 shadow-2xl relative max-h-[85vh] md:max-h-[85vh] flex flex-col overflow-hidden text-left">
            
            <div className="flex justify-between items-center pb-4 md:pb-6 border-b border-slate-100 mb-4 md:mb-6 shrink-0">
              <div>
                <span className="text-[9px] md:text-[10px] font-black uppercase text-amber-600 tracking-widest">Educator Rating Portfolio</span>
                <h3 className="text-lg md:text-xl font-black text-slate-900 mt-1">Reviews for {activeReviewsMember.name}</h3>
              </div>
              <button 
                onClick={() => { setActiveReviewsMember(null); setReviewPage(1); }} 
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all border border-slate-100 shadow-sm cursor-pointer"
              >
                <X size={18} strokeWidth={3} className="md:w-5 md:h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 md:space-y-6">
              {(() => {
                const totalReviews = activeReviewsMember.reviews.length;
                const fiveStars = activeReviewsMember.reviews.filter((r: any) => r.rating === 5).length;
                const fourStars = activeReviewsMember.reviews.filter((r: any) => r.rating === 4).length;
                const threeStars = activeReviewsMember.reviews.filter((r: any) => r.rating === 3).length;
                const twoStars = activeReviewsMember.reviews.filter((r: any) => r.rating === 2).length;
                const oneStar = activeReviewsMember.reviews.filter((r: any) => r.rating === 1).length;

                const p5 = totalReviews > 0 ? (fiveStars / totalReviews) * 100 : 0;
                const p4 = totalReviews > 0 ? (fourStars / totalReviews) * 100 : 0;
                const p3 = totalReviews > 0 ? (threeStars / totalReviews) * 100 : 0;
                const p2 = totalReviews > 0 ? (twoStars / totalReviews) * 100 : 0;
                const p1 = totalReviews > 0 ? (oneStar / totalReviews) * 100 : 0;

                const r = 36;
                const circ = 2 * Math.PI * r;
                const s5 = (p5 / 100) * circ;
                const s4 = (p4 / 100) * circ;
                const s3 = (p3 / 100) * circ;
                const s2 = (p2 / 100) * circ;
                const s1 = (p1 / 100) * circ;

                const totalRevPages = Math.ceil(activeReviewsMember.reviews.length / reviewsPerPage);
                const idxLastRev = reviewPage * reviewsPerPage;
                const idxFirstRev = idxLastRev - reviewsPerPage;
                const currentReviews = activeReviewsMember.reviews.slice(idxFirstRev, idxLastRev);

                return (
                  <>
                    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 pb-4 md:pb-6 border-b border-slate-100">
                      <div className="relative flex items-center justify-center shrink-0">
                        <svg className="w-24 h-24 md:w-28 md:h-28 transform -rotate-90">
                          <circle cx="50%" cy="50%" r={r} fill="transparent" stroke="#f1f5f9" strokeWidth="10" />
                          <circle cx="50%" cy="50%" r={r} fill="transparent" stroke="#eab308" strokeWidth="10" 
                            strokeDasharray={`${s5} ${circ - s5}`} strokeDashoffset={0} />
                          <circle cx="50%" cy="50%" r={r} fill="transparent" stroke="#facc15" strokeWidth="10" 
                            strokeDasharray={`${s4} ${circ - s4}`} strokeDashoffset={-s5} />
                          <circle cx="50%" cy="50%" r={r} fill="transparent" stroke="#a3e635" strokeWidth="10" 
                            strokeDasharray={`${s3} ${circ - s3}`} strokeDashoffset={-(s5 + s4)} />
                          <circle cx="50%" cy="50%" r={r} fill="transparent" stroke="#fb923c" strokeWidth="10" 
                            strokeDasharray={`${s2} ${circ - s2}`} strokeDashoffset={-(s5 + s4 + s3)} />
                          <circle cx="50%" cy="50%" r={r} fill="transparent" stroke="#ef4444" strokeWidth="10" 
                            strokeDasharray={`${s1} ${circ - s1}`} strokeDashoffset={-(s5 + s4 + s3 + s2)} />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <p className="text-lg md:text-xl font-black text-slate-900">{activeReviewsMember.rating}</p>
                          <p className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-widest">{activeReviewsMember.reviewCount} total</p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-1 md:space-y-1.5 w-full max-w-[200px] sm:max-w-none mx-auto">
                        {[5, 4, 3, 2, 1].map((star, idx) => {
                          const percent = [p5, p4, p3, p2, p1][idx];
                          const barColor = ["bg-yellow-500", "bg-yellow-400", "bg-lime-400", "bg-orange-400", "bg-red-500"][idx];
                          return (
                            <div key={star} className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-black text-slate-400">
                              <span className="w-3 md:w-3 text-right">{star}★</span>
                              <div className="flex-1 h-1.5 md:h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${barColor} rounded-full`} style={{ width: `${percent}%` }}></div>
                              </div>
                              <span className="w-6 md:w-8 text-right text-[8px] md:text-[9px] font-bold">{Math.round(percent)}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1 md:pt-2">
                      <h5 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 md:gap-2">
                        <MessageCircle size={10} className="md:w-3 md:h-3" /> Recent Feedback
                      </h5>
                      {totalRevPages > 1 && (
                        <span className="text-[8px] md:text-[9px] font-black text-slate-400">Page {reviewPage} of {totalRevPages}</span>
                      )}
                    </div>

                    <div className="space-y-2.5 md:space-y-3">
                      {currentReviews.map((r: any) => (
                        <div key={r.id} className="text-left bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm">
                          <div className="flex items-center justify-between mb-1.5 md:mb-2">
                            <span className="text-[11px] md:text-xs font-bold text-slate-800">{r.reviewer}</span>
                            <span className="text-[9px] md:text-[10px] font-black flex items-center px-1.5 md:px-2 py-0.5 rounded-md border bg-amber-50 text-amber-500 border-amber-100">
                              <Star size={8} className="fill-amber-400 mr-1 md:w-2.5 md:h-2.5" />{r.rating}.0
                            </span>
                          </div>
                          <p className="text-[11px] md:text-xs text-slate-500 italic leading-relaxed">"{r.comment}"</p>
                        </div>
                      ))}
                    </div>

                    {totalRevPages > 1 && (
                      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-slate-100 shrink-0">
                        <button 
                          type="button"
                          disabled={reviewPage === 1}
                          onClick={() => setReviewPage(prev => Math.max(prev - 1, 1))}
                          className="px-2.5 md:px-3 py-1 md:py-1.5 bg-white border border-slate-200 hover:border-slate-300 disabled:opacity-40 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500 transition-all cursor-pointer"
                        >
                          Back
                        </button>
                        <div className="flex gap-1">
                          {Array.from({ length: totalRevPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              type="button"
                              key={pageNum}
                              onClick={() => setReviewPage(pageNum)}
                              className={`w-5 h-5 md:w-6 md:h-6 rounded text-[8px] md:text-[9px] font-black border transition-all ${
                                reviewPage === pageNum
                                  ? "bg-slate-900 border-slate-900 text-white"
                                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>
                        <button 
                          type="button"
                          disabled={reviewPage === totalRevPages}
                          onClick={() => setReviewPage(prev => Math.min(prev + 1, totalRevPages))}
                          className="px-2.5 md:px-3 py-1 md:py-1.5 bg-white border border-slate-200 hover:border-slate-300 disabled:opacity-40 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500 transition-all cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && reportTarget && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] w-full max-w-md p-8 md:p-10 shadow-2xl text-left">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 text-red-500 rounded-xl md:rounded-[1.5rem] flex items-center justify-center mb-4 md:mb-6">
              <Flag size={24} className="md:w-8 md:h-8" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1.5 md:mb-2">Report User</h2>
            
            <p className="text-xs md:text-sm font-bold text-slate-500 mb-4 leading-relaxed">
              Are you sure you want to block and report <span className="text-slate-800">{reportTarget.name}</span>? They will be removed from your dashboard and will not be notified.
            </p>

            {/* Admin Alert Warning Banner */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl md:rounded-2xl p-3 md:p-4 mb-6 md:mb-8 flex items-start gap-2.5 md:gap-3">
              <ShieldAlert className="text-indigo-600 w-4 h-4 md:w-5 md:h-5 shrink-0 mt-0.5" />
              <p className="text-[10px] md:text-xs text-indigo-800 font-medium leading-relaxed">
                <strong className="font-black uppercase tracking-widest text-indigo-900 block mb-0.5">Moderation Alert</strong>
                Submitting this report will instantly notify the System Administrator. False reports may result in account suspension.
              </p>
            </div>

            <form onSubmit={handleConfirmReport}>
              <label className="block text-[9px] md:text-[10px] font-black uppercase text-slate-400 mb-2 md:mb-3 tracking-widest">Select Reason</label>
              <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl md:rounded-2xl p-3 md:p-4 text-xs md:text-sm font-bold text-slate-800 outline-none focus:border-red-500 mb-6 md:mb-8 cursor-pointer">
                <option value="Spam">Spam / Fake Account</option>
                <option value="Harassment">Harassment / Rude Behavior</option>
                <option value="No-show">Did Not Show Up For Session</option>
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Other">Other Reasons</option>
              </select>
              <div className="flex gap-3 md:gap-4">
                <button type="button" onClick={() => { setShowReportModal(false); setReportTarget(null); }} className="flex-1 bg-slate-100 text-slate-600 font-black py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] uppercase tracking-tight hover:bg-slate-200 transition cursor-pointer flex items-center justify-center">Cancel</button>
                <button type="submit" className="flex-1 bg-red-500 text-white font-black py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] uppercase tracking-tight hover:bg-red-600 shadow-xl transition cursor-pointer flex items-center justify-center">Block & Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}