"use client";
import { useState, useEffect, useMemo } from "react";
import { matches } from "../constants/data";
import { Match, Message, UserProfile, UserSettings } from "../types";

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

  const [userProfile, setUserProfile] = useState<UserProfile>({
    bio: "",
    title: "",
    location: "Philippines", 
    experienceLevel: "Intermediate",
    availability: "Flexible"
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    emailNotifications: true,
    showOnlineStatus: true,
    profileVisibility: 'public'
  });

  const apiStubs = {
    updateProfileData: async (data: Partial<UserProfile>) => {
      console.log("Saving Profile to DB:", data);
      return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
    },
    updateSettingsData: async (data: Partial<UserSettings>) => {
      console.log("Saving Settings to DB:", data);
      return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
    },
    sendMessageToSocket: async (receiverId: number, messageText: string) => {
      console.log(`Sending to WebSocket -> Receiver: ${receiverId}, Msg: ${messageText}`);
    }
  };

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
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
        setIsSubmitting(false);
        triggerToast("Email already exists. Please log in.");
        setIsLoginView(true);
        return;
      }

      if (isLoginView && !userExists) {
        setIsSubmitting(false);
        triggerToast("Account not found. Please sign up first.");
        setIsLoginView(false); 
        return;
      }

      setUserEmail(emailFromForm);
      localStorage.setItem("skillswap_logged_in", "true");
      localStorage.setItem("skillswap_active_email", emailFromForm);

      if (!isLoginView) {
        setUserName(nameFromForm || "User");
        saveToPhoneBook({ email: emailFromForm, name: nameFromForm || "User" });
      } else {
        loadUserData(emailFromForm);
      }

      setIsLoggedIn(true);
      setIsSubmitting(false);
      triggerToast("Welcome to SkillSwap!");
    }, 800);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("skillswap_logged_in");
      localStorage.removeItem("skillswap_active_email");
      setUserName("User");
      setMySkills([]);
      setMyNeeds([]); 
      setChatHistory({});
      setActiveChatIDs([]);
      setBlockedUsers([]);
      setIsLoggedIn(false);
      setActiveTab("hub");
      setIsLoggingOut(false);
      triggerToast("Logged out.");
    }, 600);
  };

  const openRecentChats = () => {
    if (activeChatIDs.length === 0) {
      triggerToast("No recent chats yet. Start swapping!");
      setShowDirectory(true); 
      return;
    }
    setActiveTab("chat"); 
    setShowChat(true); 
  };

  const openSpecificChat = (partner: Match) => {
    setActiveChatPartner(partner);
    setShowChat(true);
    setActiveTab("chat");
    
    if (!activeChatIDs.includes(partner.id)) {
      const newList = [...activeChatIDs, partner.id];
      setActiveChatIDs(newList);
      saveToPhoneBook({ chatList: newList });
    }
    
    setMessages(chatHistory[partner.id] || []);
  };

  const saveMessages = (newMsgs: Message[]) => {
    if (!activeChatPartner) return;
    const partnerId = activeChatPartner.id;
    const updatedHistory = { ...chatHistory, [partnerId]: newMsgs };
    setChatHistory(updatedHistory);
    setMessages(newMsgs);
    saveToPhoneBook({ chatHistory: updatedHistory });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !activeChatPartner) return;
    
    const partnerId = activeChatPartner.id;
    const msgText = chatInput;
    
    const myNewMsg: Message = { 
      id: Date.now(),
      sender: 'me', 
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    const updatedList = [...messages, myNewMsg];
    saveMessages(updatedList);
    setChatInput(""); 
    
    await apiStubs.sendMessageToSocket(partnerId, msgText);

    setIsPartnerTyping(true);
    setTimeout(() => {
      const partnerReply: Message = { 
        id: Date.now() + 1,
        sender: 'them', 
        text: `That sounds like a plan! I'm usually free on weekends.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const finalChat = [...updatedList, partnerReply];
      saveMessages(finalChat);
      setIsPartnerTyping(false);
    }, 2000);
  };

  useEffect(() => {
    const activeEmail = localStorage.getItem("skillswap_active_email");
    const savedLogin = localStorage.getItem("skillswap_logged_in");

    if (activeEmail) {
      setUserEmail(activeEmail);
      loadUserData(activeEmail);
    }
    if (savedLogin === "true") setIsLoggedIn(true);

    const handleScroll = () => setShowScroll(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const blockUser = (partnerId: number) => {
    if (blockedUsers.includes(partnerId)) return;
    const updated = [...blockedUsers, partnerId];
    setBlockedUsers(updated);
    saveToPhoneBook({ blocked: updated }); 
    setShowChat(false); 
    setActiveChatPartner(null); 
    triggerToast("User blocked.");
  };

  const unblockUser = (id: number) => {
    const updated = blockedUsers.filter(userId => userId !== id);
    setBlockedUsers(updated);
    saveToPhoneBook({ blocked: updated }); 
    triggerToast("User unblocked!");
  };

  const addSkill = (skill: string) => {
    const alreadyHasIt = mySkills.some(s => s.toLowerCase() === skill.toLowerCase());
    if (alreadyHasIt) {
      triggerToast(`${skill} is already added!`);
      return;
    }
    const updated = [...mySkills, skill];
    setMySkills(updated);
    setIsVerified(updated.length >= 3);
    saveToPhoneBook({ skills: updated });
    triggerToast(`Added ${skill}!`);
  };

  const removeSkill = (skill: string) => {
    const updated = mySkills.filter(s => s !== skill);
    setMySkills(updated);
    setIsVerified(updated.length >= 3);
    saveToPhoneBook({ skills: updated });
    triggerToast(`Removed ${skill}.`);
  };

  const activeChatUsers = useMemo(() => {
    return matches.filter(m => activeChatIDs.includes(m.id) && !blockedUsers.includes(m.id));
  }, [activeChatIDs, blockedUsers]);

  // --- START MATCHMAKING LOGIC ---
  const filteredMatches = useMemo(() => {
    const activeNeeds = myNeeds.filter(n => n !== "None" && n !== "");

    let scoredResults = matches
      .filter(m => !blockedUsers.includes(m.id)) // Hide blocked
      .map(person => {
        let score = 0;

        // 1. Check if I can teach them what they want (The Give)
        const iCanTeachThem = mySkills.some(s => s.toLowerCase() === person.needs.toLowerCase());
        if (iCanTeachThem) score += 50;

        // 2. Check if they teach what I want (The Take)
        const theyCanTeachMe = activeNeeds.some(n => n.toLowerCase() === person.teaching.toLowerCase());
        if (theyCanTeachMe) score += 50;

        // 3. Category match (Common Interests)
        if (person.category === onboardingCategory?.name) score += 20;

        // 4. Activity Boost
        if (person.status === 'Online') score += 10;
        
        // 5. Rating Boost
        score += (person.rating * 2);

        return { ...person, matchScore: score };
      });

    // Apply Search Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      scoredResults = scoredResults.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.teaching.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query)
      );
    }

    // Apply Category/Status Sidebar Filters
    scoredResults = scoredResults.filter(m => {
      const catMatch = activeCategoryFilter === "All" || m.category === activeCategoryFilter;
      const onlineMatch = onlineOnly ? m.status === 'Online' : true;
      return catMatch && onlineMatch;
    });

    // Apply Sorting
    if (sortBy === "Recommended") {
      scoredResults.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === "Top Rated") {
      scoredResults.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Newest") {
      scoredResults.sort((a, b) => b.id - a.id);
    }

    return scoredResults;
  }, [mySkills, myNeeds, onlineOnly, activeCategoryFilter, blockedUsers, searchQuery, sortBy, onboardingCategory]);
  // --- END MATCHMAKING LOGIC ---

  const state: SkillSwapState = { 
    loading, isLoggingOut, isSubmitting, isLoggedIn, isLoginView, 
    showBioStep, userName, userEmail, showScroll, showDirectory, showChat, 
    activeTab, activeChatPartner, mySkills, myNeeds, onboardingCategory, onlineOnly, 
    activeCategoryFilter, searchQuery, sortBy, chatInput, messages, isPartnerTyping, 
    filteredMatches, activeChatUsers, blockedUsers, 
    allMatches: matches, year: 2026, toast, isVerified, activeChatIDs,
    userProfile, userSettings 
  };

  const setters = { 
    setLoading, setIsLoggedIn, setIsLoggingOut, setIsLoginView, 
    setShowBioStep, setShowDirectory, setShowChat, setActiveTab, 
    setActiveChatPartner, setMySkills, setMyNeeds, setOnboardingCategory, setOnlineOnly, 
    setActiveCategoryFilter, setSearchQuery, setSortBy, setChatInput, setMessages: saveMessages, 
    setUserName, setUserEmail, setShowScroll, setIsPartnerTyping, setActiveChatIDs,
    setUserProfile, setUserSettings 
  };

  const actions = { 
    handleAuth, handleLogout, triggerToast, addSkill, 
    removeSkill, saveToPhoneBook, blockUser, unblockUser, 
    openRecentChats, openSpecificChat, handleSendMessage,
    clearChat: (partnerId: number) => {
        const confirmed = window.confirm("Clear all messages with this person? This cannot be undone.");
        if (confirmed) {
            const updatedHistory = { ...chatHistory };
            delete updatedHistory[partnerId];
            setChatHistory(updatedHistory);
            setMessages([]);
            saveToPhoneBook({ chatHistory: updatedHistory });
            triggerToast("Chat cleared.");
        }
    },
    deleteConversation: (partnerId: number) => {
      const confirmed = window.confirm("Delete conversation? This removes them from your chat list and wipes messages.");
      if (confirmed) {
        const updatedHistory = { ...chatHistory };
        delete updatedHistory[partnerId];
        const updatedIDs = activeChatIDs.filter(id => id !== partnerId);
        setChatHistory(updatedHistory);
        setActiveChatIDs(updatedIDs);
        setMessages([]);
        setActiveChatPartner(null);
        setShowChat(false);
        saveToPhoneBook({ chatHistory: updatedHistory, chatList: updatedIDs });
        triggerToast("Conversation deleted.");
      }
    },
    saveNeeds: (newNeeds: string[]) => {
      setters.setMyNeeds(newNeeds);
      saveToPhoneBook({ needs: newNeeds });
    },
    reportUser: (id: number) => { 
      const confirmed = window.confirm("Are you sure you want to report and block this user?");
      if (confirmed) {
        actions.blockUser(id); 
        triggerToast("User reported and blocked."); 
      }
    },
    saveProfile: async (newData: Partial<UserProfile>) => {
      const merged = { ...userProfile, ...newData };
      setters.setUserProfile(merged);
      saveToPhoneBook({ profile: merged });
      await apiStubs.updateProfileData(merged);
      triggerToast("Profile updated successfully!");
    },
    saveSettings: async (newData: Partial<UserSettings>) => {
      const merged = { ...userSettings, ...newData };
      setters.setUserSettings(merged);
      saveToPhoneBook({ settings: merged });
      await apiStubs.updateSettingsData(merged);
      triggerToast("Settings saved successfully!");
    }
  };

  return { state, setters, actions };
}