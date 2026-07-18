// src/components/shared/messenger.tsx

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, X, MoreVertical, Flag, MessageSquare, ShieldAlert, 
  Star, Trash2, AlertTriangle, Maximize2, Minimize2, 
  Paperclip, Check, Sparkles
} from 'lucide-react';

export default function Messenger({ state, setters, chatEndRef, actions }: any) {
  const [showSafetyMenu, setShowSafetyMenu] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  
  const [reportReason, setReportReason] = useState("Spam");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [isMaximized, setIsMaximized] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const partner = state.activeChatPartner;
  const hasChats = state.activeChatUsers && state.activeChatUsers.length > 0;

  const livePartner = partner ? (state.allMatches.find((m: any) => m.id === partner.id) || partner) : null;

  const alreadyReviewed = livePartner?.reviews?.some((r: any) => r.id === state.userId);

  useEffect(() => {
    if (!state.showChat) setIsMaximized(false);
  }, [state.showChat]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (livePartner && !alreadyReviewed) {
      actions.submitReview(livePartner.id, reviewRating, reviewComment);
      setShowReviewModal(false);
      setReviewComment("");
      setReviewRating(5);
    }
  };

  const handleReportUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (livePartner) {
      actions.reportUser(livePartner.id, reportReason);
      setShowReportModal(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64File = reader.result;
      
      if (actions.handleSendFile) {
        actions.handleSendFile({
          type: 'file',
          fileName: file.name,
          fileUrl: base64File
        });
      }
    };
    reader.readAsDataURL(file); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setters.setChatInput(e.target.value);
    
    if (actions.handleTyping) {
      actions.handleTyping(true);
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        actions.handleTyping(false);
      }, 1500);
    }
  };

  // Z-INDEX FIX: Upgraded to z-[1010] so it sits above the z-[999] header
  const containerClasses = isMaximized
    ? "fixed inset-4 md:inset-10 z-[1010] max-w-5xl mx-auto rounded-[2rem] md:rounded-[3rem] border-2 border-slate-100"
    : "fixed bottom-0 right-0 md:right-4 z-[1010] w-full md:w-[440px] h-[85vh] md:h-[750px] rounded-t-[2rem] md:rounded-t-[3rem] border-t-4 border-indigo-600 shadow-2xl";

  const visibilityClasses = state.showChat
    ? "translate-x-0 opacity-100 scale-100 pointer-events-auto"
    : isMaximized 
      ? "opacity-0 scale-95 pointer-events-none" 
      : "translate-x-full opacity-0 pointer-events-none";

  // Strict Verification Block: Disables Standard View
  if (!state.hasSkillsConfigured && state.showChat) {
    return (
      <>
        {/* Z-INDEX FIX: Upgraded overlay to z-[1000] */}
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[1000]" onClick={() => setters.setShowChat(false)} />
        <div className={`fixed flex flex-col bg-white shadow-2xl transition-all duration-500 ease-in-out ${containerClasses} ${visibilityClasses} items-center justify-center p-6 md:p-10 text-center`}>
          <button type="button" className="absolute top-4 right-4 md:top-6 md:right-6 cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-red-500 transition-all" onClick={() => setters.setShowChat(false)}>
            <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
          </button>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 text-red-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
            <ShieldAlert className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <h3 className="text-lg md:text-xl font-black text-slate-900 mb-1.5 md:mb-2 uppercase tracking-tight">Verification Required</h3>
          <p className="text-slate-500 font-bold text-[11px] md:text-xs leading-relaxed mb-6 max-w-[250px] md:max-w-xs">
            To unlock direct messaging and access chats, you must configure both a Teachable Skill and a Desired Skill.
          </p>
          <button 
            type="button" 
            onClick={() => { setters.setAddingSkillType('teaching'); setters.setShowDirectory(true); setters.setShowChat(false); }}
            className="bg-indigo-600 text-white px-5 py-3 md:px-6 md:py-3.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md cursor-pointer"
          >
            Verify Skill Profile
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Z-INDEX FIX: Upgraded overlay to z-[1000] */}
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[1000] transition-all duration-500 ${
          state.showChat ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
            setters.setShowChat(false);
            setShowSafetyMenu(false);
        }}
      />

      <div className={`fixed flex flex-col bg-white shadow-2xl transition-all duration-500 ease-in-out ${containerClasses} ${visibilityClasses}`}>
        {/* Header */}
        <div className={`p-4 md:p-6 border-b-2 border-slate-50 flex justify-between items-center bg-white sticky top-0 z-20 ${isMaximized ? 'rounded-t-[2rem] md:rounded-t-[3rem]' : 'rounded-t-[1.8rem] md:rounded-t-[2.7rem]'}`}>
          <div className="flex items-center gap-3 md:gap-4">
            {livePartner ? (
              <>
                <div className="relative">
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl text-white flex items-center justify-center font-black text-lg md:text-xl shadow-md md:shadow-lg overflow-hidden border-2 border-white ${livePartner.rating < 4.0 ? 'bg-red-600' : 'bg-indigo-600'}`}>
                    {livePartner.image ? <img src={livePartner.image} alt="" className="w-full h-full object-cover" /> : <span className="uppercase">{livePartner.avatar || "👤"}</span>}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-3.5 h-3.5 md:w-5 md:h-5 border-[3px] md:border-4 border-white rounded-full ${livePartner.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                </div>
                <div className="text-left">
                  <h3 className="font-black text-slate-900 text-sm md:text-lg leading-tight flex items-center gap-1.5">
                    {livePartner.name}
                    {livePartner.isVerified && (
                      <span className="text-indigo-600 shrink-0" title="Verified Swapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="md:w-4 md:h-4 fill-indigo-50"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2">
                    {state.isPartnerTyping ? (
                      <span className="text-[9px] md:text-[10px] text-indigo-600 font-black uppercase tracking-widest animate-pulse">Typing...</span>
                    ) : (
                      <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${livePartner.status === 'Online' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {livePartner.status || "Offline"}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600"><MessageSquare className="w-5 h-5 md:w-6 md:h-6" /></div>
                <h3 className="font-black text-slate-900 text-xs md:text-sm uppercase tracking-widest">{hasChats ? "Select a Chat" : "No Chats"}</h3>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-3">
            {livePartner && (
              <>
                <div className="relative">
                  <button type="button" onClick={() => setShowSafetyMenu(!showSafetyMenu)} className="cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                    <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  {showSafetyMenu && (
                    <div className="absolute right-0 mt-2 md:mt-3 w-56 md:w-64 bg-white rounded-2xl md:rounded-[2rem] shadow-2xl border-2 border-slate-50 p-2 md:p-3 z-50 text-left">
                      
                      {alreadyReviewed ? (
                        <div className="flex items-center gap-2.5 md:gap-3 w-full text-left px-3 py-3 md:px-4 md:py-4 text-[10px] md:text-[11px] font-black uppercase text-slate-400 bg-slate-50 rounded-xl md:rounded-2xl cursor-not-allowed select-none">
                          <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500 shrink-0" /> Session Already Reviewed
                        </div>
                      ) : (
                        <button type="button" onClick={() => { setShowReviewModal(true); setShowSafetyMenu(false); }} className="flex items-center gap-2.5 md:gap-3 cursor-pointer w-full text-left px-3 py-3 md:px-4 md:py-4 text-[10px] md:text-[11px] font-black uppercase text-indigo-600 hover:bg-indigo-50 rounded-xl md:rounded-2xl">
                          <Star className="w-3.5 h-3.5 md:w-4 md:h-4" /> Rate & Review Session
                        </button>
                      )}

                      <button type="button" onClick={() => { setShowDeleteModal(true); setShowSafetyMenu(false); }} className="flex items-center gap-2.5 md:gap-3 cursor-pointer w-full text-left px-3 py-3 md:px-4 md:py-4 text-[10px] md:text-[11px] font-black uppercase text-slate-600 hover:bg-slate-50 rounded-xl md:rounded-2xl">
                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> Delete Conversation
                      </button>
                      <div className="h-px bg-slate-100 my-1 mx-2"></div>
                      <button type="button" onClick={() => { setShowReportModal(true); setShowSafetyMenu(false); }} className="flex items-center gap-2.5 md:gap-3 cursor-pointer w-full text-left px-3 py-3 md:px-4 md:py-4 text-[10px] md:text-[11px] font-black uppercase text-red-600 hover:bg-red-50 rounded-xl md:rounded-2xl">
                        <Flag className="w-3.5 h-3.5 md:w-4 md:h-4" /> Report & Block User
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  type="button"
                  onClick={() => setIsMaximized(!isMaximized)} 
                  className="hidden md:flex cursor-pointer w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                  title={isMaximized ? "Minimize" : "Maximize"}
                >
                  {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
              </>
            )}

            <button type="button" className="cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-red-500 transition-all" onClick={() => setters.setShowChat(false)}>
              <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-white space-y-6 md:space-y-8 scrollbar-hide">
            {!livePartner ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-indigo-200 mb-4 md:mb-6" />
                  <p className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400">{hasChats ? "Select a partner to continue" : "No active chats yet"}</p>
                </div>
            ) : (
              <>
                {partner.rating < 4.0 ? (
                  <div className="bg-red-50 border-2 border-red-200 rounded-[1.5rem] md:rounded-3xl p-3 md:p-4 flex items-start gap-3 md:gap-4 mb-6 md:mb-8 text-left">
                    <div className="bg-red-500 p-1.5 md:p-2 rounded-lg md:rounded-xl text-white shrink-0"><AlertTriangle className="w-4 h-4 md:w-[18px] md:h-[18px]" /></div>
                    <div>
                      <p className="text-[10px] md:text-[11px] font-black text-red-800 uppercase tracking-wider mb-0.5 md:mb-1">Low Rating Warning</p>
                      <p className="text-[11px] md:text-xs text-red-700 font-bold leading-relaxed">This user has an average rating below 4.0. Please exercise caution before commencing a session.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border-2 border-amber-100 rounded-[1.5rem] md:rounded-3xl p-3 md:p-4 flex items-start gap-3 md:gap-4 mb-6 md:mb-8 text-left">
                    <div className="bg-amber-100 p-1.5 md:p-2 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4 h-4 md:w-[18px] md:h-[18px] text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-[11px] font-black text-amber-800 uppercase tracking-wider mb-0.5 md:mb-1">Safety First</p>
                      <p className="text-[11px] md:text-xs text-amber-700 font-medium leading-relaxed">Always be careful. Never share your password, credit card, or sensitive personal data with others during a swap.</p>
                    </div>
                  </div>
                )}

                {state.messages.length === 0 ? (
                  <div className="py-16 md:py-20 text-center"><p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">No messages yet</p></div>
                ) : (
                  state.messages.map((m: any, i: number) => (
                      <div key={i} className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                          <div className={`p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] max-w-[90%] md:max-w-[80%] text-sm md:text-md font-bold leading-relaxed overflow-x-auto ${m.sender === 'me' ? 'bg-indigo-600 text-white rounded-br-none shadow-md md:shadow-xl' : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200/50'}`}>
                            
                            {m.type === 'file' ? (
                              <div className="flex flex-col gap-1.5 md:gap-2">
                                <span className="text-[10px] md:text-xs opacity-70 border-b border-white/20 pb-1">Attachment</span>
                                <a href={m.fileUrl} download={m.fileName} className="flex items-center gap-1.5 md:gap-2 hover:opacity-70 transition underline break-all">
                                  <Paperclip className="w-4 h-4 md:w-[18px] md:h-[18px] shrink-0" /> {m.fileName}
                                </a>
                              </div>
                            ) : (
                              <span className="whitespace-pre-wrap">{m.text}</span>
                            )}

                          </div>
                          
                          <div className="flex items-center gap-1.5 mt-1.5 md:mt-2 px-2">
                            <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase">{m.timestamp}</span>
                            {m.sender === 'me' && (
                              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider">
                                {m.isRead ? (
                                  <span className="text-emerald-500">✓ Seen</span>
                                ) : (
                                  <span className="text-slate-400">Sent</span>
                                )}
                              </span>
                            )}
                          </div>
                      </div>
                  ))
                )}
                <div ref={chatEndRef} className="h-2 md:h-4" />
              </>
            )}
        </div>

        {/* Input Form */}
        {livePartner && (
          <div className={`p-4 md:p-6 bg-white border-t-2 border-slate-50 ${isMaximized ? 'rounded-b-[2rem] md:rounded-b-[3rem]' : ''}`}>
              <form onSubmit={actions.handleSendMessage} className="relative flex items-center gap-2 md:gap-3 bg-slate-100 p-1.5 md:p-2 rounded-full md:rounded-[2.5rem] focus-within:bg-white border-2 border-transparent focus-within:border-indigo-500 transition-all shadow-inner">
                  
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()} 
                    className="cursor-pointer w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all shrink-0"
                    title="Attach File"
                  >
                    <Paperclip className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                  </button>

                  <input 
                    autoFocus 
                    value={state.chatInput} 
                    onChange={handleInputChange} 
                    className="flex-1 bg-transparent py-3 md:py-4 px-1 md:px-2 outline-none text-sm md:text-md font-bold text-slate-900 w-full min-w-0" 
                    placeholder="Type your message..." 
                  />
                  <button type="submit" disabled={!state.chatInput.trim()} className="cursor-pointer w-10 h-10 md:w-14 md:h-14 bg-indigo-600 text-white rounded-full md:rounded-[1.8rem] flex items-center justify-center shadow-md md:shadow-xl hover:bg-slate-900 transition-all disabled:opacity-30 shrink-0">
                    <Send className="w-4 h-4 md:w-6 md:h-6" strokeWidth={2.5} />
                  </button>
              </form>
          </div>
        )}
      </div>

      {/* MODALS */}
      
      {/* Z-INDEX FIX: Upgraded Modals to z-[1050] to overlay the z-[1010] chat window safely */}
      {showDeleteModal && livePartner && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] w-full max-w-md p-8 md:p-10 shadow-2xl text-left">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 text-red-500 rounded-xl md:rounded-[1.5rem] flex items-center justify-center mb-4 md:mb-6">
              <Trash2 size={24} className="md:w-8 md:h-8" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1.5 md:mb-2">Delete Conversation?</h2>
            <p className="text-xs md:text-sm font-bold text-slate-500 mb-6 md:mb-8 leading-relaxed">
              This will permanently remove <span className="text-slate-800">{livePartner.name}</span> from your active chats and wipe all messages. This cannot be undone.
            </p>
            <div className="flex gap-3 md:gap-4">
              <button type="button" onClick={() => setShowDeleteModal(false)} className="flex-1 bg-slate-100 text-slate-600 font-black py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] uppercase tracking-tight hover:bg-slate-200 transition cursor-pointer flex items-center justify-center">Cancel</button>
              <button type="button" onClick={() => { actions.deleteConversation(livePartner.id); setShowDeleteModal(false); }} className="flex-1 bg-red-500 text-white font-black py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] uppercase tracking-tight hover:bg-red-600 shadow-xl transition cursor-pointer flex items-center justify-center">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal - WITH ADMIN ALERT BANNER */}
      {showReportModal && livePartner && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] w-full max-w-md p-8 md:p-10 shadow-2xl text-left">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 text-red-500 rounded-xl md:rounded-[1.5rem] flex items-center justify-center mb-4 md:mb-6">
              <Flag size={24} className="md:w-8 md:h-8" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1.5 md:mb-2">Report User</h2>
            
            <p className="text-xs md:text-sm font-bold text-slate-500 mb-4 leading-relaxed">
              Are you sure you want to block and report <span className="text-slate-800">{livePartner.name}</span>? They will be removed from your dashboard and will not be notified.
            </p>

            {/* Admin Alert Warning Banner */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl md:rounded-2xl p-3 md:p-4 mb-6 md:mb-8 flex items-start gap-2.5 md:gap-3">
              <ShieldAlert className="text-indigo-600 w-4 h-4 md:w-5 md:h-5 shrink-0 mt-0.5" />
              <p className="text-[10px] md:text-xs text-indigo-800 font-medium leading-relaxed">
                <strong className="font-black uppercase tracking-widest text-indigo-900 block mb-0.5">Moderation Alert</strong>
                Submitting this report will instantly notify the System Administrator. False reports may result in account suspension.
              </p>
            </div>

            <form onSubmit={handleReportUser}>
              <label className="block text-[9px] md:text-[10px] font-black uppercase text-slate-400 mb-2 md:mb-3 tracking-widest">Select Reason</label>
              <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl md:rounded-2xl p-3 md:p-4 text-xs md:text-sm font-bold text-slate-800 outline-none focus:border-red-500 mb-6 md:mb-8 cursor-pointer">
                <option value="Spam">Spam / Fake Account</option>
                <option value="Harassment">Harassment / Rude Behavior</option>
                <option value="No-show">Did Not Show Up For Session</option>
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Other">Other Reasons</option>
              </select>
              <div className="flex gap-3 md:gap-4">
                <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 bg-slate-100 text-slate-600 font-black py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] uppercase tracking-tight hover:bg-slate-200 transition cursor-pointer flex items-center justify-center">Cancel</button>
                <button type="submit" className="flex-1 bg-red-500 text-white font-black py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] uppercase tracking-tight hover:bg-red-600 shadow-xl transition cursor-pointer flex items-center justify-center">Block & Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal - WITH ALWAYS VISIBLE STARS */}
      {showReviewModal && livePartner && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] w-full max-w-md p-8 md:p-10 shadow-2xl text-left max-h-[90vh] overflow-y-auto no-scrollbar">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1.5 md:mb-2">Leave a Review</h2>
            <p className="text-xs md:text-sm font-bold text-slate-500 mb-4 md:mb-6">How was your session with {livePartner.name}?</p>
            
            {/* The Stars are ALWAYS visible so the user can change their mind */}
            <div className="flex gap-1.5 md:gap-2 justify-center mb-6 md:mb-8">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  type="button" 
                  key={star} 
                  onClick={() => setReviewRating(star)} 
                  className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                >
                  <Star size={36} className={`md:w-10 md:h-10 ${star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                </button>
              ))}
            </div>

            {reviewRating >= 4 && state.hoursBalance <= 0 ? (
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl md:rounded-2xl p-4 md:p-5 mb-4 md:mb-6 text-left animate-in fade-in duration-300">
                <h4 className="font-black text-indigo-900 text-[10px] md:text-xs uppercase tracking-widest mb-1.5 md:mb-2 flex items-center gap-1.5 md:gap-2">
                  <Sparkles size={14} className="text-indigo-600 md:w-4 md:h-4" /> Replenish Your Balance
                </h4>
                <p className="text-[11px] md:text-xs text-indigo-700 font-medium leading-relaxed mb-4 md:mb-6">
                  You have <strong>0 Barter Hours</strong>. To leave a high-rated review and pay your mentor, please add a new skill you can teach. Or tap 1-3 stars for free feedback.
                </p>
                <button 
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setters.setActiveTab('hub');
                    setters.setShowDirectory(true);
                    setters.setAddingSkillType('teaching');
                  }} 
                  className="cursor-pointer w-full bg-indigo-600 text-white font-black py-3 md:py-4 rounded-xl text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-indigo-700 shadow-md transition"
                >
                  Add Teachable Skill
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowReviewModal(false)} 
                  className="w-full mt-3 md:mt-4 text-[10px] md:text-xs font-black uppercase text-indigo-400 hover:text-indigo-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="animate-in fade-in duration-300">
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl md:rounded-2xl p-3 md:p-4 text-[10px] md:text-xs text-indigo-700 font-bold mb-4 md:mb-6">
                  💡 {reviewRating < 4 
                    ? "Constructive Feedback: Ratings below 4★ are always free and do not deduct hours." 
                    : `Barter Exchange: Rating 4★ or 5★ transfers 1 Barter Hour from you to ${livePartner.name}.`
                  }
                </div>
                <textarea 
                  required 
                  placeholder="Write your experience here..." 
                  value={reviewComment} 
                  onChange={(e) => setReviewComment(e.target.value)} 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl md:rounded-2xl p-3 md:p-4 text-xs md:text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 min-h-[100px] md:min-h-[120px] mb-4 md:mb-6" 
                />
                <div className="flex gap-3 md:gap-4">
                  <button type="button" onClick={() => setShowReviewModal(false)} className="flex-1 bg-slate-100 text-slate-600 font-black py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] uppercase tracking-tight hover:bg-slate-200 transition cursor-pointer flex items-center justify-center">Cancel</button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-indigo-600 text-white font-black py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] uppercase tracking-tight hover:bg-indigo-700 shadow-md md:shadow-xl transition cursor-pointer flex items-center justify-center"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}