"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, X, MoreVertical, Flag, MessageSquare, ShieldAlert, 
  Star, Trash2, AlertTriangle, Maximize2, Minimize2, 
  Paperclip 
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

  useEffect(() => {
    if (!state.showChat) setIsMaximized(false);
  }, [state.showChat]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (livePartner) {
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

  const containerClasses = isMaximized
    ? "fixed inset-4 md:inset-10 z-[200] max-w-5xl mx-auto rounded-[3rem] border-2 border-slate-100"
    : "fixed bottom-0 right-0 md:right-4 z-[200] w-full md:w-[440px] h-[90vh] md:h-[750px] rounded-t-[3rem] border-t-4 border-indigo-600 shadow-2xl";

  const visibilityClasses = state.showChat
    ? "translate-x-0 opacity-100 scale-100 pointer-events-auto"
    : isMaximized 
      ? "opacity-0 scale-95 pointer-events-none" 
      : "translate-x-full opacity-0 pointer-events-none";

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[150] transition-all duration-500 ${
          state.showChat ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
            setters.setShowChat(false);
            setShowSafetyMenu(false);
        }}
      />

      <div className={`fixed flex flex-col bg-white shadow-2xl transition-all duration-500 ease-in-out ${containerClasses} ${visibilityClasses}`}>
        {/* Header */}
        <div className={`p-6 border-b-2 border-slate-50 flex justify-between items-center bg-white sticky top-0 z-20 ${isMaximized ? 'rounded-t-[3rem]' : 'rounded-t-[2.7rem]'}`}>
          <div className="flex items-center gap-4">
            {livePartner ? (
              <>
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center font-black text-xl shadow-lg overflow-hidden border-2 border-white ${livePartner.rating < 4.0 ? 'bg-red-600' : 'bg-indigo-600'}`}>
                    {livePartner.image ? <img src={livePartner.image} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl">{livePartner.avatar || "👤"}</span>}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-4 border-white rounded-full ${livePartner.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                </div>
                <div className="text-left">
                  <h3 className="font-black text-slate-900 text-lg leading-tight flex items-center gap-1.5">
                    {livePartner.name}
                    {livePartner.isVerified && (
                      <span className="text-indigo-600 shrink-0" title="Verified Swapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="fill-indigo-50"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2">
                    {state.isPartnerTyping ? (
                      <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest animate-pulse">Typing...</span>
                    ) : (
                      <span className={`text-[10px] font-black uppercase tracking-widest ${livePartner.status === 'Online' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {livePartner.status || "Offline"}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600"><MessageSquare size={24} /></div>
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">{hasChats ? "Select a Chat" : "No Chats"}</h3>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            {livePartner && (
              <>
                <div className="relative">
                  <button type="button" onClick={() => setShowSafetyMenu(!showSafetyMenu)} className="cursor-pointer w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                    <MoreVertical size={20} />
                  </button>
                  {showSafetyMenu && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border-2 border-slate-50 p-3 z-50">
                      <button type="button" onClick={() => { setShowReviewModal(true); setShowSafetyMenu(false); }} className="flex items-center gap-3 cursor-pointer w-full text-left px-4 py-4 text-[11px] font-black uppercase text-indigo-600 hover:bg-indigo-50 rounded-2xl">
                        <Star size={16} /> Rate & Review Session
                      </button>
                      <button type="button" onClick={() => { setShowDeleteModal(true); setShowSafetyMenu(false); }} className="flex items-center gap-3 cursor-pointer w-full text-left px-4 py-4 text-[11px] font-black uppercase text-slate-600 hover:bg-slate-50 rounded-2xl">
                        <Trash2 size={16} /> Delete Conversation
                      </button>
                      <div className="h-px bg-slate-100 my-1 mx-2"></div>
                      <button type="button" onClick={() => { setShowReportModal(true); setShowSafetyMenu(false); }} className="flex items-center gap-3 cursor-pointer w-full text-left px-4 py-4 text-[11px] font-black uppercase text-red-600 hover:bg-red-50 rounded-2xl">
                        <Flag size={16} /> Report & Block User
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

            <button type="button" className="cursor-pointer w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-red-500 transition-all" onClick={() => setters.setShowChat(false)}>
              <X size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto bg-white space-y-8 scrollbar-hide">
            {!livePartner ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <MessageSquare size={40} className="text-indigo-200 mb-6" />
                  <p className="text-sm font-black uppercase tracking-widest text-slate-400">{hasChats ? "Select a partner to continue" : "No active chats yet"}</p>
                </div>
            ) : (
              <>
                {partner.rating < 4.0 ? (
                  <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-4 flex items-start gap-4 mb-8">
                    <div className="bg-red-500 p-2 rounded-xl text-white"><AlertTriangle size={18} /></div>
                    <div>
                      <p className="text-[11px] font-black text-red-800 uppercase tracking-wider mb-1">Low Rating Warning</p>
                      <p className="text-xs text-red-700 font-bold leading-relaxed">This user has an average rating below 4.0. Please exercise caution before commencing a session.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border-2 border-amber-100 rounded-3xl p-4 flex items-start gap-4 mb-8">
                    <div className="bg-amber-100 p-2 rounded-xl flex items-center justify-center shrink-0">
                      <ShieldAlert size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-amber-800 uppercase tracking-wider mb-1">Safety First</p>
                      <p className="text-xs text-amber-700 font-medium leading-relaxed">Always be careful. Never share your password, credit card, or sensitive personal data with others during a swap.</p>
                    </div>
                  </div>
                )}

                {state.messages.length === 0 ? (
                  <div className="py-20 text-center"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">No messages yet</p></div>
                ) : (
                  state.messages.map((m: any, i: number) => (
                      <div key={i} className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                          <div className={`p-5 rounded-[2rem] max-w-[90%] md:max-w-[80%] text-md font-bold leading-relaxed overflow-x-auto ${m.sender === 'me' ? 'bg-indigo-600 text-white rounded-br-none shadow-xl' : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200/50'}`}>
                            
                            {m.type === 'file' ? (
                              <div className="flex flex-col gap-2">
                                <span className="text-xs opacity-70 border-b border-white/20 pb-1">Attachment</span>
                                <a href={m.fileUrl} download={m.fileName} className="flex items-center gap-2 hover:opacity-70 transition underline">
                                  <Paperclip size={18} /> {m.fileName}
                                </a>
                              </div>
                            ) : (
                              <span className="whitespace-pre-wrap">{m.text}</span>
                            )}

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
        {livePartner && (
          <div className={`p-6 bg-white border-t-2 border-slate-50 ${isMaximized ? 'rounded-b-[3rem]' : ''}`}>
              <form onSubmit={actions.handleSendMessage} className="relative flex items-center gap-3 bg-slate-100 p-2 rounded-[2.5rem] focus-within:bg-white border-2 border-transparent focus-within:border-indigo-500 transition-all shadow-inner">
                  
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()} 
                    className="cursor-pointer w-12 h-12 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                    title="Attach File"
                  >
                    <Paperclip size={22} />
                  </button>

                  <input 
                    autoFocus 
                    value={state.chatInput} 
                    onChange={handleInputChange} 
                    className="flex-1 bg-transparent py-4 px-2 outline-none text-md font-bold text-slate-900" 
                    placeholder="Type your message..." 
                  />
                  <button type="submit" disabled={!state.chatInput.trim()} className="cursor-pointer w-14 h-14 bg-indigo-600 text-white rounded-[1.8rem] flex items-center justify-center shadow-xl hover:bg-slate-900 transition-all disabled:opacity-30 shrink-0">
                    <Send size={24} strokeWidth={2.5} />
                  </button>
              </form>
          </div>
        )}
      </div>

      {showDeleteModal && livePartner && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-[1.5rem] flex items-center justify-center mb-6">
              <Trash2 size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Delete Conversation?</h2>
            <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed">
              This will permanently remove <span className="text-slate-800">{livePartner.name}</span> from your active chats and wipe all messages. This cannot be undone.
            </p>
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowDeleteModal(false)} className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl text-[11px] uppercase tracking-tight hover:bg-slate-200 transition cursor-pointer flex items-center justify-center">Cancel</button>
              <button type="button" onClick={() => { actions.deleteConversation(livePartner.id); setShowDeleteModal(false); }} className="flex-1 bg-red-500 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-tight hover:bg-red-600 shadow-xl transition cursor-pointer flex items-center justify-center">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && livePartner && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-[1.5rem] flex items-center justify-center mb-6">
              <Flag size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Report User</h2>
            <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed">
              Are you sure you want to block and report <span className="text-slate-800">{livePartner.name}</span>? They will not be notified.
            </p>
            <form onSubmit={handleReportUser}>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Select Reason</label>
              <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 outline-none focus:border-red-500 mb-8 cursor-pointer">
                <option value="Spam">Spam / Fake Account</option>
                <option value="Harassment">Harassment / Rude Behavior</option>
                <option value="No-show">Did Not Show Up For Session</option>
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Other">Other Reasons</option>
              </select>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl text-[11px] uppercase tracking-tight hover:bg-slate-200 transition cursor-pointer flex items-center justify-center">Cancel</button>
                <button type="submit" className="flex-1 bg-red-500 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-tight hover:bg-red-600 shadow-xl transition cursor-pointer flex items-center justify-center">Block & Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReviewModal && livePartner && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Leave a Review</h2>
            <p className="text-sm font-bold text-slate-500 mb-8">How was your session with {livePartner.name}?</p>
            <form onSubmit={handleSubmitReview}>
              <div className="flex gap-2 justify-center mb-8">
                {[1, 2, 3, 4, 5].map(star => (
                  <button type="button" key={star} onClick={() => setReviewRating(star)} className="cursor-pointer">
                    <Star size={40} className={star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                  </button>
                ))}
              </div>
              <textarea required placeholder="Write your experience here..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 min-h-[120px] mb-6" />
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowReviewModal(false)} className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl text-[11px] uppercase tracking-tight hover:bg-slate-200 transition cursor-pointer flex items-center justify-center">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-tight hover:bg-indigo-700 shadow-xl transition cursor-pointer flex items-center justify-center">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}