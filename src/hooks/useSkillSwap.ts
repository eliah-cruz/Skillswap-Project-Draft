"use client";
import { useState, useEffect, useMemo } from "react";
import { matches, categories } from "../constants/data";
import { Match, Message, UserProfile, UserSettings, Review } from "../types";

interface SkillSwapState {
  loading: boolean;
  isLoggingOut: boolean;
  isSubmitting: boolean;
  isLoggedIn: boolean;
  isLoginView: boolean;
  showBioStep: boolean;
  userName: string;
  userEmail: string;
  showScroll: boolean;
  showDirectory: boolean;
  addingSkillType: 'teaching' | 'learning';
  showChat: boolean;
  activeTab: string;
  activeChatPartner: Match | null;
  mySkills: string[];
  myNeeds: string[]; 
  onboardingCategory: any;
  onlineOnly: boolean;
  activeCategoryFilter: string;
  searchQuery: string;
  sortBy: string;
  chatInput: string;
  messages: Message[];
  chatHistory: Record<number, Message[]>;
  isPartnerTyping: boolean;
  filteredMatches: Match[];
  activeChatUsers: Match[];
  blockedUsers: number[];
  allMatches: Match[];
  year: number;
  toast: string | null;
  isVerified: boolean;
  activeChatIDs: number[];
  userProfile: UserProfile;
  userSettings: UserSettings;
}

export function useSkillSwap() {
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isLoginView, setIsLoginView] = useState(false); 
  const [showBioStep, setShowBioStep] = useState(false);
  
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState(""); 
  const [mySkills, setMySkills] = useState<string[]>([]); 
  const [myNeeds, setMyNeeds] = useState<string[]>([]); 
  const [isVerified, setIsVerified] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<number[]>([]); 
  
  const [showScroll, setShowScroll] = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);
  const [addingSkillType, setAddingSkillType] = useState<'teaching' | 'learning'>('teaching');
  
  const [activeTab, setActiveTab] = useState("hub"); 
  const [showChat, setShowChat] = useState(false);
  const [activeChatPartner, setActiveChatPartner] = useState<Match | null>(null); 
  
  const [chatHistory, setChatHistory] = useState<Record<number, Message[]>>({});
  const [activeChatIDs, setActiveChatIDs] = useState<number[]>([]); 
  const [messages, setMessages] = useState<Message[]>([]); 
  const [chatInput, setChatInput] = useState("");
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  
  const [onboardingCategory, setOnboardingCategory] = useState<any>(null);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [sortBy, setSortBy] = useState("Recommended");
  const [toast, setToast] = useState<string | null>(null);
  
  const [allMatches, setAllMatches] = useState<Match[]>(matches);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    bio: "", title: "", location: "Philippines", experienceLevel: "Beginner", availability: "Flexible"
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    emailNotifications: true, showOnlineStatus: true, profileVisibility: 'public'
  });

  const apiStubs = {
    updateProfileData: async (data: Partial<UserProfile>) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 500)),
    updateSettingsData: async (data: Partial<UserSettings>) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 500)),
    sendMessageToSocket: async (receiverId: number, messageText: string) => console.log(`Sending to WebSocket -> Receiver: ${receiverId}`)
  };

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const syncLocalUsersToMatches = (currentEmail: string) => {
    const phoneBook = JSON.parse(localStorage.getItem("skillswap_users_list") || "{}");
    const customReviews = JSON.parse(localStorage.getItem("skillswap_global_reviews") || "{}");
    const localGeneratedMatches: Match[] = [];
    
    let idCounter = 1000; 
    
    for (const email in phoneBook) {
      if (email === currentEmail) continue; 
      
      const u = phoneBook[email];
      const isVisibleOnline = u.isCurrentlyLoggedIn !== false && u.settings?.showOnlineStatus !== false;
      
      let derivedCategory = "Development"; 
      if (u.skills && u.skills.length > 0) {
        const firstSkill = u.skills[0];
        const matchedCat = categories.find(c => c.skills.includes(firstSkill));
        if (matchedCat) derivedCategory = matchedCat.title;
      }
      
      localGeneratedMatches.push({
        id: idCounter++,
        name: u.name || "New User",
        teaching: u.skills && u.skills.length > 0 ? u.skills.join(", ") : "Exploring",
        needs: u.needs && u.needs.length > 0 ? u.needs.join(", ") : "Discovering",
        rating: 5.0, 
        reviewCount: 0,
        reviews: [],
        avatar: u.name ? u.name.substring(0, 2).toUpperCase() : "U",
        status: isVisibleOnline ? 'Online' : 'Offline', 
        category: derivedCategory, 
        title: u.profile?.title || "New Member",
        availability: u.profile?.availability || "Flexible",
        location: u.profile?.location || "Earth", 
        experienceLevel: u.profile?.experienceLevel || "Beginner",
        bio: u.profile?.bio || ""
      });
    }

    let combined = [...matches, ...localGeneratedMatches];

    combined = combined.map(m => {
      if (customReviews[m.id]) {
        const revs = customReviews[m.id];
        const avg = revs.length > 0 ? revs.reduce((sum: number, r: Review) => sum + r.rating, 0) / revs.length : 5.0;
        return {
          ...m,
          reviews: revs,
          reviewCount: revs.length,
          rating: Number(avg.toFixed(1))
        };
      }
      return m;
    });

    setAllMatches(combined);
  };

  const saveToPhoneBook = (updates: any) => {
    const currentEmail = updates.email || userEmail || localStorage.getItem("skillswap_active_email");
    if (!currentEmail) return;

    const phoneBook = JSON.parse(localStorage.getItem("skillswap_users_list") || "{}");
    const existingData = phoneBook[currentEmail] || {};
    
    const updatedData = { 
        ...existingData, 
        name: updates.name || existingData.name || userName,
        skills: updates.skills || existingData.skills || mySkills,
        needs: updates.needs || existingData.needs || myNeeds, 
        chatHistory: updates.chatHistory || existingData.chatHistory || chatHistory,
        chatList: updates.chatList || existingData.chatList || activeChatIDs, 
        blocked: updates.blocked !== undefined ? updates.blocked : (existingData.blocked || blockedUsers),
        profile: updates.profile || existingData.profile || userProfile, 
        settings: updates.settings || existingData.settings || userSettings, 
        ...updates 
    };

    phoneBook[currentEmail] = updatedData;
    localStorage.setItem("skillswap_users_list", JSON.stringify(phoneBook));
    if (updates.name && updates.name !== "User") setUserName(updates.name);

    syncLocalUsersToMatches(currentEmail);
  };

  const loadUserData = (email: string) => {
    const phoneBook = JSON.parse(localStorage.getItem("skillswap_users_list") || "{}");
    const userData = phoneBook[email];
    if (userData) {
      setUserName(userData.name || "User");
      setMySkills(userData.skills || []);
      setMyNeeds(userData.needs || []); 
      setChatHistory(userData.chatHistory || {}); 
      setActiveChatIDs(userData.chatList || []); 
      setIsVerified((userData.skills?.length || 0) >= 3);
      setBlockedUsers(userData.blocked || []);
      if(userData.profile) setUserProfile(userData.profile); 
      if(userData.settings) setUserSettings(userData.settings); 
      return true;
    }
    return false;
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const nameFromForm = formData.get("fullName")?.toString();
    const emailFromForm = formData.get("email")?.toString() || "demo@user.com";
    const phoneBook = JSON.parse(localStorage.getItem("skillswap_users_list") || "{}");
    const userExists = !!phoneBook[emailFromForm];

    setTimeout(() => {
      if (!isLoginView && userExists) {
        setIsSubmitting(false); triggerToast("Email already exists. Please log in."); setIsLoginView(true); return;
      }
      if (isLoginView && !userExists) {
        setIsSubmitting(false); triggerToast("Account not found. Please sign up first."); setIsLoginView(false); return;
      }
      setUserEmail(emailFromForm);
      localStorage.setItem("skillswap_logged_in", "true");
      localStorage.setItem("skillswap_active_email", emailFromForm);

      if (!isLoginView) {
        setUserName(nameFromForm || "User");
        saveToPhoneBook({ 
            email: emailFromForm, 
            name: nameFromForm || "User", 
            isCurrentlyLoggedIn: true,
            profile: { bio: "", title: "Student", location: "Philippines", experienceLevel: "Beginner", availability: "Flexible" }
        });
      } else {
        loadUserData(emailFromForm);
        const pb = JSON.parse(localStorage.getItem("skillswap_users_list") || "{}");
        if(pb[emailFromForm]) {
            pb[emailFromForm].isCurrentlyLoggedIn = true;
            localStorage.setItem("skillswap_users_list", JSON.stringify(pb));
        }
      }
      
      syncLocalUsersToMatches(emailFromForm);
      setIsLoggedIn(true); setIsSubmitting(false); triggerToast("Welcome to SkillSwap!");
    }, 800);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const activeEmail = localStorage.getItem("skillswap_active_email");
    if (activeEmail) {
      const phoneBook = JSON.parse(localStorage.getItem("skillswap_users_list") || "{}");
      if (phoneBook[activeEmail]) {
        phoneBook[activeEmail].isCurrentlyLoggedIn = false;
        localStorage.setItem("skillswap_users_list", JSON.stringify(phoneBook));
      }
    }

    setTimeout(() => {
      localStorage.removeItem("skillswap_logged_in"); 
      localStorage.removeItem("skillswap_active_email");
      setUserName("User"); setMySkills([]); setMyNeeds([]); setChatHistory({}); setActiveChatIDs([]); setBlockedUsers([]);
      setSearchQuery(""); setActiveCategoryFilter("All"); setSortBy("Recommended"); setOnlineOnly(false);
      setShowChat(false); setActiveChatPartner(null); setOnboardingCategory(null);
      setIsLoggedIn(false); setActiveTab("hub"); setIsLoggingOut(false); triggerToast("Logged out.");
    }, 600);
  };

  const openRecentChats = () => {
    if (activeChatIDs.length === 0) { triggerToast("No recent chats yet. Start swapping!"); setShowDirectory(true); return; }
    setActiveTab("chat"); setShowChat(true); 
  };

  // FEATURE: Mark as Read perfectly integrated here!
  const openSpecificChat = (partner: Match) => {
    setActiveChatPartner(partner); setShowChat(true); setActiveTab("chat");
    
    let newList = [...activeChatIDs];
    if (!activeChatIDs.includes(partner.id)) {
      newList.push(partner.id);
      setActiveChatIDs(newList); 
    }
    
    const history = chatHistory[partner.id] || [];
    let updated = false;
    
    // Scan messages, if they are from 'them' and not read, mark them read.
    const readHistory = history.map(msg => {
      if (msg.sender === 'them' && !msg.isRead) {
        updated = true;
        return { ...msg, isRead: true };
      }
      return msg;
    });

    if (updated) {
      const newHistoryObj = { ...chatHistory, [partner.id]: readHistory };
      setChatHistory(newHistoryObj);
      setMessages(readHistory);
      saveToPhoneBook({ chatHistory: newHistoryObj, chatList: newList });
    } else {
      setMessages(history);
      saveToPhoneBook({ chatList: newList });
    }
  };

  const saveMessages = (newMsgs: Message[]) => {
    if (!activeChatPartner) return;
    const partnerId = activeChatPartner.id;
    const updatedHistory = { ...chatHistory, [partnerId]: newMsgs };
    setChatHistory(updatedHistory); setMessages(newMsgs); saveToPhoneBook({ chatHistory: updatedHistory });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !activeChatPartner) return;
    
    const myNewMsg: Message = { id: Date.now(), sender: 'me', text: chatInput, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isRead: true };
    const updatedList = [...messages, myNewMsg];
    saveMessages(updatedList); setChatInput(""); 
    
    await apiStubs.sendMessageToSocket(activeChatPartner.id, chatInput);
    setIsPartnerTyping(true);
    setTimeout(() => {
      // Mock partner reply. By default it is false (unread), so it triggers notifications.
      const partnerReply: Message = { id: Date.now() + 1, sender: 'them', text: `That sounds like a plan!`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isRead: false };
      saveMessages([...updatedList, partnerReply]); setIsPartnerTyping(false);
    }, 2000);
  };

  useEffect(() => {
    const activeEmail = localStorage.getItem("skillswap_active_email");
    const savedLogin = localStorage.getItem("skillswap_logged_in");
    
    if (activeEmail) { setUserEmail(activeEmail); loadUserData(activeEmail); syncLocalUsersToMatches(activeEmail); } 
    else { syncLocalUsersToMatches(""); }

    if (savedLogin === "true") setIsLoggedIn(true);
    const handleScroll = () => setShowScroll(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => { clearTimeout(timer); window.removeEventListener('scroll', handleScroll); };
  }, []);

  const blockUser = (partnerId: number) => {
    if (blockedUsers.includes(partnerId)) return;
    const updated = [...blockedUsers, partnerId];
    setBlockedUsers(updated); saveToPhoneBook({ blocked: updated }); setShowChat(false); setActiveChatPartner(null);
  };

  const unblockUser = (id: number) => {
    const updated = blockedUsers.filter(userId => userId !== id);
    setBlockedUsers(updated); saveToPhoneBook({ blocked: updated }); triggerToast("User unblocked!");
  };

  const addSkill = (skill: string) => {
    if (mySkills.length >= 5) { triggerToast("You can only add up to 5 teachable skills."); return; }
    if (mySkills.some(s => s.toLowerCase() === skill.toLowerCase())) { triggerToast(`${skill} is already added!`); return; }
    const updated = [...mySkills, skill];
    setMySkills(updated); setIsVerified(updated.length >= 3); saveToPhoneBook({ skills: updated }); triggerToast(`Added ${skill}!`);
  };

  const removeSkill = (skill: string) => {
    const updated = mySkills.filter(s => s !== skill);
    setMySkills(updated); setIsVerified(updated.length >= 3); saveToPhoneBook({ skills: updated }); triggerToast(`Removed ${skill}.`);
  };

  const addNeed = (skill: string) => {
    if (myNeeds.length >= 5) { triggerToast("You can only add up to 5 desired skills."); return; }
    if (myNeeds.some(s => s.toLowerCase() === skill.toLowerCase())) { triggerToast(`${skill} is already in your wishlist!`); return; }
    const updated = [...myNeeds, skill];
    setMyNeeds(updated); saveToPhoneBook({ needs: updated }); triggerToast(`Added ${skill} to wishlist!`);
  };

  const removeNeed = (skill: string) => {
    const updated = myNeeds.filter(s => s !== skill);
    setMyNeeds(updated); saveToPhoneBook({ needs: updated }); triggerToast(`Removed ${skill}.`);
  };

  const activeChatUsers = useMemo(() => {
    return allMatches.filter(m => activeChatIDs.includes(m.id) && !blockedUsers.includes(m.id));
  }, [activeChatIDs, blockedUsers, allMatches]);

  const filteredMatches = useMemo(() => {
    const activeNeeds = myNeeds.filter(n => n !== "None" && n !== "");
    
    let scoredResults = allMatches
      .filter(m => !blockedUsers.includes(m.id))
      .map(person => {
        let score = 0;
        const iCanTeachThem = mySkills.some(s => person.needs.toLowerCase().includes(s.toLowerCase()));
        const theyCanTeachMe = activeNeeds.some(n => person.teaching.toLowerCase().includes(n.toLowerCase()));
        const isMutualMatch = iCanTeachThem && theyCanTeachMe;

        let isCircularMatch = false;
        if (!isMutualMatch && (iCanTeachThem || theyCanTeachMe)) {
          isCircularMatch = allMatches.some(userC => {
            if (userC.id === person.id || blockedUsers.includes(userC.id)) return false;
            const personCanTeachC = userC.needs.toLowerCase().includes(person.teaching.toLowerCase());
            const cCanTeachMe = activeNeeds.some(n => userC.teaching.toLowerCase().includes(n.toLowerCase()));
            if (iCanTeachThem && personCanTeachC && cCanTeachMe) return true;
            const iCanTeachC = mySkills.some(s => userC.needs.toLowerCase().includes(s.toLowerCase()));
            const cCanTeachPerson = person.needs.toLowerCase().includes(userC.teaching.toLowerCase());
            if (theyCanTeachMe && cCanTeachPerson && iCanTeachC) return true;
            return false;
          });
        }

        if (isMutualMatch) score += 100;
        else if (isCircularMatch) score += 75; 
        else {
          if (iCanTeachThem) score += 50;
          if (theyCanTeachMe) score += 50;
        }

        if (person.category === onboardingCategory?.name) score += 20;
        if (person.status === 'Online') score += 10;
        score += (person.rating * 2);
        
        return { ...person, matchScore: score, isMutualMatch, isCircularMatch };
      });

    if (searchQuery.trim() === "") {
        scoredResults = scoredResults.filter(m => m.rating >= 4.0);
    } else {
        const query = searchQuery.toLowerCase();
        scoredResults = scoredResults.filter(m => m.name.toLowerCase().includes(query) || m.teaching.toLowerCase().includes(query) || m.category.toLowerCase().includes(query));
    }
    
    scoredResults = scoredResults.filter(m => {
      const catMatch = activeCategoryFilter === "All" || m.category === activeCategoryFilter;
      const onlineMatch = onlineOnly ? m.status === 'Online' : true;
      return catMatch && onlineMatch;
    });

    if (sortBy === "Recommended") {
      scoredResults.sort((a, b) => {
        if (a.isMutualMatch && !b.isMutualMatch) return -1;
        if (!a.isMutualMatch && b.isMutualMatch) return 1;
        if (a.isCircularMatch && !b.isCircularMatch) return -1;
        if (!a.isCircularMatch && b.isCircularMatch) return 1;
        return (b.matchScore || 0) - (a.matchScore || 0);
      });
    }
    else if (sortBy === "Top Rated") scoredResults.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "Newest") scoredResults.sort((a, b) => b.id - a.id);

    return scoredResults;
  }, [mySkills, myNeeds, onlineOnly, activeCategoryFilter, blockedUsers, searchQuery, sortBy, onboardingCategory, allMatches]);

  const state: SkillSwapState = { 
    loading, isLoggingOut, isSubmitting, isLoggedIn, isLoginView, showBioStep, userName, userEmail, showScroll, showDirectory, showChat, 
    addingSkillType, activeTab, activeChatPartner, mySkills, myNeeds, onboardingCategory, onlineOnly, activeCategoryFilter, searchQuery, sortBy, chatInput, messages, chatHistory, isPartnerTyping, 
    filteredMatches, activeChatUsers, blockedUsers, allMatches, year: 2026, toast, isVerified, activeChatIDs, userProfile, userSettings 
  };

  const setters = { 
    setLoading, setIsLoggedIn, setIsLoggingOut, setIsLoginView, setShowBioStep, setShowDirectory, setShowChat, setActiveTab, 
    setActiveChatPartner, setMySkills, setMyNeeds, setAddingSkillType, setOnboardingCategory, setOnlineOnly, setActiveCategoryFilter, setSearchQuery, setSortBy, setChatInput, setMessages: saveMessages, 
    setUserName, setUserEmail, setShowScroll, setIsPartnerTyping, setActiveChatIDs, setUserProfile, setUserSettings, setAllMatches
  };

  const actions = { 
    handleAuth, handleLogout, triggerToast, addSkill, removeSkill, addNeed, removeNeed, saveToPhoneBook, blockUser, unblockUser, openRecentChats, openSpecificChat, handleSendMessage,
    
    deleteConversation: (partnerId: number) => {
        const updatedHistory = { ...chatHistory };
        delete updatedHistory[partnerId];
        const updatedIDs = activeChatIDs.filter(id => id !== partnerId);
        setChatHistory(updatedHistory); setActiveChatIDs(updatedIDs); setMessages([]); setActiveChatPartner(null); setShowChat(false);
        saveToPhoneBook({ chatHistory: updatedHistory, chatList: updatedIDs }); triggerToast("Conversation deleted.");
    },
    saveNeeds: (newNeeds: string[]) => { setters.setMyNeeds(newNeeds); saveToPhoneBook({ needs: newNeeds }); },
    reportUser: (id: number) => { 
      actions.blockUser(id); 
      triggerToast("User reported and blocked successfully."); 
    },
    submitReview: (partnerId: number, rating: number, comment: string) => {
      const allCustomReviews = JSON.parse(localStorage.getItem('skillswap_global_reviews') || '{}');
      let currentReviews = allCustomReviews[partnerId];
      if (!currentReviews) {
         const existingUser = allMatches.find(m => m.id === partnerId);
         currentReviews = existingUser ? existingUser.reviews : [];
      }

      const newReview: Review = { id: Date.now().toString(), reviewer: userName, rating, comment };
      const updatedReviews = [newReview, ...currentReviews];
      
      allCustomReviews[partnerId] = updatedReviews;
      localStorage.setItem('skillswap_global_reviews', JSON.stringify(allCustomReviews));

      const newAvg = updatedReviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / updatedReviews.length;
      const finalRating = Number(newAvg.toFixed(1));

      let newlyUpdatedPartner: Match | null = null;
      
      setAllMatches(prev => prev.map(m => {
        if (m.id === partnerId) {
          const updatedMatch = { ...m, reviews: updatedReviews, reviewCount: updatedReviews.length, rating: finalRating };
          newlyUpdatedPartner = updatedMatch;
          return updatedMatch;
        }
        return m;
      }));

      if (activeChatPartner && activeChatPartner.id === partnerId && newlyUpdatedPartner) {
        setters.setActiveChatPartner(newlyUpdatedPartner);
      }

      triggerToast("Feedback submitted successfully!");
    },
    saveProfile: async (newData: Partial<UserProfile>) => {
      const merged = { ...userProfile, ...newData };
      setters.setUserProfile(merged); saveToPhoneBook({ profile: merged }); await apiStubs.updateProfileData(merged); triggerToast("Profile updated successfully!");
    },
    saveSettings: async (newData: Partial<UserSettings>) => {
      const merged = { ...userSettings, ...newData };
      setters.setUserSettings(merged); saveToPhoneBook({ settings: merged }); await apiStubs.updateSettingsData(merged); triggerToast("Settings saved successfully!");
    }
  };

  return { state, setters, actions };
}