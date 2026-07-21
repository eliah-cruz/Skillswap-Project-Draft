"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "../lib/supabase";
import { io, Socket } from "socket.io-client";
import { Match, Message, UserProfile, UserSettings } from "../types";

let socket: Socket | null = null;

export function useSkillSwap() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginView, setIsLoginView] = useState(false);
  const [showBioStep, setShowBioStep] = useState(false);
  
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  
  // Custom auth verification loader states
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(false);
  const [authStatusMessage, setAuthStatusMessage] = useState("");
  const [authSuccess, setAuthSuccess] = useState(false);

  const loadedUserIdRef = useRef<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Database State
  const [mySkills, setMySkills] = useState<string[]>([]);
  const [myNeeds, setMyNeeds] = useState<string[]>([]);
  const [skillDictionary, setSkillDictionary] = useState<Record<string, string>>({}); 
  const [skillCategoryMap, setSkillCategoryMap] = useState<Record<string, string>>({}); 
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [reportedUsers, setReportedUsers] = useState<string[]>([]); 
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [activeChatIDs, setActiveChatIDs] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({});
  const [hoursBalance, setHoursBalance] = useState<number>(3); 
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({}); 
  const [myRating, setMyRating] = useState<number>(5.0);
  const [myReviewCount, setMyReviewCount] = useState<number>(0);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "skillswapproductions@gmail.com";

  // Strict verification: user must configure both teachable and desired skills to proceed
  const hasSkillsConfigured = useMemo(() => {
    return mySkills.length > 0 && myNeeds.length > 0;
  }, [mySkills, myNeeds]);

  const isVerified = useMemo(() => mySkills.length >= 3, [mySkills]);
  const isAdmin = useMemo(() => userEmail === ADMIN_EMAIL, [userEmail, ADMIN_EMAIL]);
  
  // UI State
  const [showScroll, setShowScroll] = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);
  const [addingSkillType, setAddingSkillType] = useState<'teaching' | 'learning'>('teaching');
  const [activeTab, setActiveTab] = useState("hub");
  const [showChat, setShowChat] = useState(false);
  
  // Chat State
  const [activeChatPartner, setActiveChatPartner] = useState<Match | null>(null);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  
  // Filters & Toast
  const [onboardingCategory, setOnboardingCategory] = useState<any>(null);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Recommended");
  const [toast, setToast] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    bio: "", title: "SkillSwapper", location: "Philippines", experienceLevel: "Beginner", availability: "Flexible"
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    emailNotifications: true, showOnlineStatus: true, profileVisibility: 'Public'
  });

  const triggerToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 3000);
  };

  const getSocket = (): Socket | null => {
    if (typeof window === "undefined") return null;
    if (!socket || !socket.connected) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000");
    }
    return socket;
  };

  // Auth Changes subscription
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        setUserId(session.user.id);
        setUserEmail(session.user.email || "");
        
        const s = getSocket();
        if (s) s.emit("register_user", session.user.id);
        
        await loadFullDatabaseState(session.user.id, session.user.email || "", session.user, true);
        loadedUserIdRef.current = session.user.id;
        setLoading(false);
      }
    };
    
    checkSession(); 

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const isSameUser = loadedUserIdRef.current === session.user.id;
        
        if (event === 'SIGNED_IN' && !isSameUser) {
          setIsVerifyingAuth(true);
          setAuthSuccess(false);
          setAuthStatusMessage("Validating authentication credentials...");
          await new Promise(resolve => setTimeout(resolve, 1000));
          setAuthStatusMessage("Securing peer-to-peer workspace session...");
          await new Promise(resolve => setTimeout(resolve, 1000));
          setAuthStatusMessage("Magic Link verified! Setting up dashboard...");
          setAuthSuccess(true);
          await new Promise(resolve => setTimeout(resolve, 1200));
          setIsVerifyingAuth(false);
        }

        setIsLoggedIn(true);
        setUserId(session.user.id);
        setUserEmail(session.user.email || "");
        
        if (!isSameUser) {
          setActiveTab(session.user.email === ADMIN_EMAIL ? "admin" : "hub");
          
          const { data: settings } = await supabase
            .from('user_settings')
            .select('show_online_status')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (!settings || settings.show_online_status !== false) {
            await supabase.from('users').update({ is_online: true }).eq('user_id', session.user.id);
          }
        }
        
        const s = getSocket();
        if (s) {
          s.emit("register_user", session.user.id);
        }
        
        await loadFullDatabaseState(session.user.id, session.user.email || "", session.user, isSameUser);
        loadedUserIdRef.current = session.user.id;
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setUserEmail("");
        loadedUserIdRef.current = null;
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // WebSockets Chat, Message, and Typing status observers
  useEffect(() => {
    const s = getSocket();
    if (!s || !userId) return;

    s.on("connect", async () => {
      if (userId) {
        const { data: unreadMsgs } = await supabase
          .from('messages')
          .select('message_id, sender_id')
          .eq('is_read', false)
          .neq('sender_id', userId);
          
        let totalUnread = 0;
        const counts: Record<string, number> = {};
        if (unreadMsgs) {
          totalUnread = unreadMsgs.length;
          unreadMsgs.forEach(msg => {
            counts[msg.sender_id] = (counts[msg.sender_id] || 0) + 1;
          });
        }
        setUnreadCount(totalUnread);
        setUnreadCounts(counts);
      }
    });

    s.on("receive_message", async (data) => {
      if (data.sender_id === loadedUserIdRef.current) return; 

      const isChatOpenWithThisUser = activeChatPartner?.id === data.sender_id && showChat;

      const newMsg: Message = {
        id: data.message_id || Date.now().toString(),
        sender: "them",
        text: data.content,
        timestamp: new Date(data.timestamp || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isRead: isChatOpenWithThisUser,
        type: data.message_type,
        fileName: data.file_name,
        fileUrl: data.file_url
      };

      if (isChatOpenWithThisUser && currentMatchId) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('message_id', data.message_id);
        s.emit("mark_seen", { match_id: currentMatchId, user_id: loadedUserIdRef.current });
      } else {
        setUnreadCount(prev => prev + 1);
        setUnreadCounts(prev => ({
          ...prev,
          [data.sender_id]: (prev[data.sender_id] || 0) + 1
        }));
      }

      setMessages((prev) => [...prev, newMsg]);

      setChatHistory((prev) => ({
        ...prev,
        [data.sender_id]: [newMsg]
      }));

      setActiveChatIDs(prev => {
        if (!prev.includes(data.sender_id)) {
          return [...prev, data.sender_id];
        }
        return prev;
      });
    });

    s.on("messages_marked_seen", ({ match_id, reader_id }) => {
      if (reader_id !== loadedUserIdRef.current) {
        setMessages((prev) =>
          prev.map((m) => (m.sender === 'me' ? { ...m, isRead: true } : m))
        );
      }
    });

    s.on("partner_typing", (isTyping) => setIsPartnerTyping(isTyping));
    
    s.on("user_status_change", ({ userId: changedUserId, status }) => {
        setAllMatches(prev => prev.map(m => m.id === changedUserId ? { ...m, status } : m));
    });

    return () => {
      s.off("connect");
      s.off("receive_message");
      s.off("messages_marked_seen");
      s.off("partner_typing");
      s.off("user_status_change");
    };
  }, [userId, activeChatPartner, showChat, currentMatchId]);

  // Real-Time profile and dynamic skill synchronization
  useEffect(() => {
    if (!userId) return;

    const globalSyncChannel = supabase
      .channel('realtime-global-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        const updatedUser = payload.new as any;
        if (!updatedUser) return;

        if (updatedUser.user_id === userId) {
          setUserName(updatedUser.username);
          setHoursBalance(updatedUser.hours_balance ?? 3);
          setMyRating(parseFloat(updatedUser.average_rating) || 5.0);
          setMyReviewCount(updatedUser.review_count || 0);
          setUserProfile({
            bio: updatedUser.bio || "",
            title: updatedUser.title || "SkillSwapper",
            location: updatedUser.location || "Philippines",
            experienceLevel: updatedUser.experience_level || "Beginner",
            availability: updatedUser.availability || "Flexible"
          });
        }

        setAllMatches(prev => prev.map(m => {
          if (m.id === updatedUser.user_id) {
            const parsedRating = parseFloat(updatedUser.average_rating as string) || 0;
            return {
              ...m,
              name: updatedUser.username,
              rating: parsedRating === 0 ? 5.0 : parsedRating,
              title: updatedUser.title || "SkillSwapper",
              location: updatedUser.location,
              availability: updatedUser.availability,
              experienceLevel: updatedUser.experience_level,
              bio: updatedUser.bio,
              status: updatedUser.is_online && !updatedUser.is_hidden ? 'Online' : 'Offline',
              hoursBalance: updatedUser.hours_balance ?? 3
            };
          }
          return m;
        }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teachable_skills' }, () => {
        loadFullDatabaseState(userId, userEmail, null, true);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'desired_skills' }, () => {
        loadFullDatabaseState(userId, userEmail, null, true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(globalSyncChannel);
    };
  }, [userId, userEmail]);

  const loadFullDatabaseState = async (uid: string, email: string, authUser?: any, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [
        { data: dbSkills },
        { data: user },
        { data: settings },
        { data: teachable },
        { data: desired },
        { data: blocks },
        { data: userReports },
        { data: unreadMsgs },
        { data: matches },
        { data: otherUsers },
        { data: rawReviews }
      ] = await Promise.all([
        supabase.from('skills').select('*, skill_categories(category_name)'),
        supabase.from('users').select('*').eq('user_id', uid).maybeSingle(),
        supabase.from('user_settings').select('*').eq('user_id', uid).maybeSingle(),
        supabase.from('teachable_skills').select('skills(skill_name)').eq('user_id', uid),
        supabase.from('desired_skills').select('skills(skill_name)').eq('user_id', uid),
        supabase.from('blocks').select('blocked_id').eq('blocker_id', uid),
        supabase.from('reports').select('reported_id').eq('reporter_id', uid).in('status', ['Pending', 'Reviewed']),
        supabase.from('messages').select('message_id, sender_id').eq('is_read', false).neq('sender_id', uid),
        supabase.from('matches').select('*').or(`and(mentor_id.eq.${uid}),and(student_id.eq.${uid})`),
        supabase.from('users').select(`*, teachable_skills(skills(skill_name)), desired_skills(skills(skill_name))`).neq('user_id', uid).neq('email', ADMIN_EMAIL),
        supabase.from('reviews').select('*, users!reviews_reviewer_id_fkey(username)')
      ]);

      const skillMap: Record<string, string> = {};
      const categoryMap: Record<string, string> = {};
      if (dbSkills) {
        dbSkills.forEach(s => {
          skillMap[s.skill_name] = s.skill_id;
          categoryMap[s.skill_name] = (s.skill_categories as any)?.category_name || "Development";
        });
      }
      setSkillDictionary(skillMap);
      setSkillCategoryMap(categoryMap);

      if (!user) {
        const metaName = authUser?.user_metadata?.username || "New User";
        await supabase.from('users').insert([{ 
          user_id: uid, 
          email: email, 
          username: metaName,
          title: "SkillSwapper",
          hours_balance: 3,
          is_online: true
        }]);
        setUserName(metaName);
        setMyRating(5.0);
        setMyReviewCount(0);
        setShowBioStep(false); 
      } else {
        setUserName(user.username);
        setHoursBalance(user.hours_balance ?? 3);
        setMyRating(parseFloat(user.average_rating) || 5.0);
        setMyReviewCount(user.review_count || 0);
        setUserProfile({
          bio: user.bio || "", 
          title: user.title || "SkillSwapper", 
          location: user.location || "Philippines",
          experienceLevel: user.experience_level || "Beginner", 
          availability: user.availability || "Flexible"
        });
        setShowBioStep(false);
      }

      if(settings) {
          setUserSettings({
              emailNotifications: settings.email_notifications,
              showOnlineStatus: settings.show_online_status,
              profileVisibility: settings.profile_visibility
          });
      }

      if (teachable) setMySkills(teachable.map((t: any) => t.skills.skill_name));
      if (desired) setMyNeeds(desired.map((d: any) => d.skills.skill_name));

      const blockedList = blocks ? blocks.map(b => b.blocked_id) : [];
      setBlockedUsers(blockedList);

      const reportedList = userReports ? userReports.map(r => r.reported_id) : [];
      setReportedUsers(reportedList);
      
      let totalUnread = 0;
      const counts: Record<string, number> = {};
      if (unreadMsgs) {
        totalUnread = unreadMsgs.length;
        unreadMsgs.forEach(msg => {
          counts[msg.sender_id] = (counts[msg.sender_id] || 0) + 1;
        });
      }
      setUnreadCount(totalUnread);
      setUnreadCounts(counts);

      if (matches && matches.length > 0) {
          const chatPartnerIds = matches.map(m => m.mentor_id === uid ? m.student_id : m.mentor_id);
          setActiveChatIDs(chatPartnerIds);

          const historyMap: Record<string, Message[]> = {};
          await Promise.all(matches.map(async (match) => {
              const { data: lastMsgs } = await supabase
                  .from('messages')
                  .select('*')
                  .eq('match_id', match.match_id)
                  .order('timestamp', { ascending: false })
                  .limit(1);

              if (lastMsgs && lastMsgs.length > 0) {
                  const m = lastMsgs[0];
                  const partnerId = match.mentor_id === uid ? match.student_id : match.mentor_id;
                  historyMap[partnerId] = [{
                      id: m.message_id,
                      sender: m.sender_id === uid ? "me" : "them",
                      text: m.content,
                      timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      isRead: m.is_read,
                      type: m.message_type,
                      fileUrl: m.file_url,
                      fileName: m.file_name
                  }];
              }
          }));
          setChatHistory(historyMap);
      }

      const dbReviews = (rawReviews || []) as any[];
      
      if (otherUsers) {
        const formattedMatches: Match[] = otherUsers
          .filter(u => u.teachable_skills && u.teachable_skills.length > 0 && u.desired_skills && u.desired_skills.length > 0)
          .map(u => {
            const userReviews = dbReviews
              .filter((r: any) => r.reviewee_id === u.user_id)
              .map((r: any) => ({
                id: r.reviewer_id,
                reviewer: r.users?.username || "Anonymous",
                rating: r.rating,
                comment: r.comment
              }));

            const parsedRating = parseFloat(u.average_rating as string) || 0;

            return {
              id: u.user_id,
              name: u.username,
              teaching: u.teachable_skills?.map((t:any) => t.skills.skill_name).join(', ') || "Various Skills",
              needs: u.desired_skills?.map((d:any) => d.skills.skill_name).join(', ') || "Eager to learn",
              rating: parsedRating === 0 ? 5.0 : parsedRating, 
              reviewCount: userReviews.length,
              reviews: userReviews,
              avatar: u.username.substring(0, 2).toUpperCase(),
              status: u.is_online && !u.is_hidden ? 'Online' : 'Offline',
              category: u.teachable_skills && u.teachable_skills.length > 0 ? (categoryMap[u.teachable_skills[0].skills.skill_name] || "Development") : "Development", 
              title: u.title || "SkillSwapper",
              location: u.location,
              availability: u.availability,
              experienceLevel: u.experience_level,
              bio: u.bio,
              isVerified: u.teachable_skills?.length >= 3,
              hoursBalance: u.hours_balance ?? 3,
              createdAt: u.created_at
            };
          });
        setAllMatches(formattedMatches);
      }
    } catch (err) {
      console.error('Loader Error:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString() || "";
    const name = formData.get("fullName")?.toString() || "User";

    const { data: existingUser } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', email)
      .maybeSingle();

    if (!isLoginView && existingUser) {
      setIsSubmitting(false);
      triggerToast("Email already exists. Redirecting to Log In...");
      setIsLoginView(true);
      return;
    }

    if (isLoginView && !existingUser) {
      setIsSubmitting(false);
      triggerToast("Account not found. Redirecting to Sign Up...");
      setIsLoginView(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ 
        email, 
        options: { 
            emailRedirectTo: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
            data: { username: name }
        }
    });
    
    setIsSubmitting(false);
    if (error) triggerToast(error.message);
    else triggerToast("Magic link sent! Check your inbox.");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    if(userId) await supabase.from('users').update({ is_online: false }).eq('user_id', userId);
    await supabase.auth.signOut();
    window.location.reload(); 
  };

  const addSkill = async (skill: string) => {
    if(!userId) return;
    if (mySkills.length >= 5) {
      triggerToast("You can only add up to 5 teachable skills.");
      return;
    }
    if(mySkills.includes(skill)) return;

    const skillId = skillDictionary[skill];
    if(!skillId) { triggerToast("Skill not found in database."); return; }

    await supabase.from('teachable_skills').insert([{ user_id: userId, skill_id: skillId, skill_level: 'Beginner' }]);
    setMySkills(prev => [...prev, skill]);
    triggerToast(`Added ${skill} to teachable skills!`);
    await loadFullDatabaseState(userId, userEmail, null, true);
  };

  const removeSkill = async (skill: string) => {
    if(!userId) return;
    const skillId = skillDictionary[skill];
    await supabase.from('teachable_skills').delete().match({ user_id: userId, skill_id: skillId });
    setMySkills(prev => prev.filter(s => s !== skill));
    triggerToast(`Removed ${skill}.`);
    await loadFullDatabaseState(userId, userEmail, null, true);
  };

  const addNeed = async (skill: string) => {
    if(!userId) return;
    if (myNeeds.length >= 5) {
      triggerToast("You can only add up to 5 desired skills.");
      return;
    }
    if(myNeeds.includes(skill)) return;

    const skillId = skillDictionary[skill];
    if(!skillId) return;

    await supabase.from('desired_skills').insert([{ user_id: userId, skill_id: skillId, skill_level: 'Beginner' }]);
    setMyNeeds(prev => [...prev, skill]);
    triggerToast(`Added ${skill} to desired skills!`);
    await loadFullDatabaseState(userId, userEmail, null, true);
  };

  const removeNeed = async (skill: string) => {
    if(!userId) return;
    const skillId = skillDictionary[skill];
    await supabase.from('desired_skills').delete().match({ user_id: userId, skill_id: skillId });
    setMyNeeds(prev => prev.filter(s => s !== skill));
    triggerToast(`Removed ${skill}.`);
    await loadFullDatabaseState(userId, userEmail, null, true);
  };

  const saveProfile = async (newData: Partial<UserProfile> & { name?: string }, silent = false) => {
    if (!userId) return;

    if (newData.bio && newData.bio.length > 100) {
      if (!silent) triggerToast("Bio cannot exceed 100 characters.");
      return;
    }
    
    if (newData.title && newData.title.length > 40) {
      if (!silent) triggerToast("Professional title cannot exceed 40 characters.");
      return;
    }

    if (newData.name && newData.name.length > 25) {
      if (!silent) triggerToast("Display name cannot exceed 25 characters.");
      return;
    }

    const merged = { ...userProfile, ...newData };
    const nameToSave = newData.name !== undefined ? newData.name : userName;
    
    setUserProfile({
      bio: merged.bio || "", 
      title: merged.title || "SkillSwapper", 
      location: merged.location || "Philippines",
      experienceLevel: merged.experienceLevel || "Beginner", 
      availability: merged.availability || "Flexible"
    });
    setUserName(nameToSave);

    if (!silent) {
      setActiveTab(isAdmin ? 'admin' : 'hub'); 
      triggerToast("Profile updated successfully!");
    }
    
    await supabase.from('users').update({
        username: nameToSave,
        bio: merged.bio, 
        title: merged.title, 
        location: merged.location,
        experience_level: merged.experienceLevel, 
        availability: merged.availability
    }).eq('user_id', userId);

    await loadFullDatabaseState(userId, userEmail, null, true);
  };

  const saveSettings = async (newData: Partial<UserSettings>) => {
    if (!userId) return;
    const merged = { ...userSettings, ...newData };
    setUserSettings(merged);
    
    setActiveTab(isAdmin ? 'admin' : 'hub'); 
    triggerToast("Settings saved successfully!");

    await supabase.from('user_settings').upsert({
        user_id: userId,
        email_notifications: merged.emailNotifications,
        show_online_status: merged.showOnlineStatus,
        profile_visibility: merged.profileVisibility
    }, { onConflict: 'user_id' });

    await supabase.from('users').update({ is_online: merged.showOnlineStatus }).eq('user_id', userId);
    
    const s = getSocket();
    if (s) s.emit('register_user', userId);

    await loadFullDatabaseState(userId, userEmail, null, true);
  };

  const openSpecificChat = async (partner: Match) => {
    setActiveChatPartner(partner);
    setShowChat(true);
    setActiveTab("chat");

    if (!activeChatIDs.includes(partner.id)) setActiveChatIDs([...activeChatIDs, partner.id]);
    
    let mId: string | null = null;
    const { data: existingMatch } = await supabase.from('matches').select('match_id')
      .or(`and(mentor_id.eq.${userId},student_id.eq.${partner.id}),and(mentor_id.eq.${partner.id},student_id.eq.${userId})`)
      .maybeSingle();
    
    if (existingMatch) {
      mId = existingMatch.match_id;
    } else {
      const fallbackSkill = Object.values(skillDictionary)[0]; 
      const { data: newMatch } = await supabase.from('matches').insert([{ mentor_id: userId, student_id: partner.id, skill_id: fallbackSkill, match_type: 'Direct' }]).select().single();
      mId = newMatch?.match_id;
    }
    
    setCurrentMatchId(mId);

    const previewLastMsg = chatHistory[partner.id]?.[0];
    if (previewLastMsg) {
      setMessages([previewLastMsg]);
    } else {
      setMessages([]);
    }
    
    const s = getSocket();
    if (s && mId) {
      s.emit('join_room', mId);
      await supabase
        .from('messages')
        .update({ is_read: true })
        .match({ match_id: mId, sender_id: partner.id, is_read: false });
      s.emit("mark_seen", { match_id: mId, user_id: loadedUserIdRef.current });
    }

    const { data: msgHistory } = await supabase.from('messages').select('*').eq('match_id', mId).order('timestamp', { ascending: true });
    if (msgHistory) {
        setMessages(msgHistory.map(m => ({
            id: m.message_id,
            sender: m.sender_id === loadedUserIdRef.current ? "me" : "them",
            text: m.content,
            timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isRead: m.is_read, type: m.message_type, fileUrl: m.file_url, fileName: m.file_name
        })));
    }

    if (userId) {
      const { data: unreadMsgs } = await supabase
        .from('messages')
        .select('message_id, sender_id')
        .eq('is_read', false)
        .neq('sender_id', userId);
        
      let totalUnread = 0;
      const counts: Record<string, number> = {};
      if (unreadMsgs) {
        totalUnread = unreadMsgs.length;
        unreadMsgs.forEach(msg => {
          counts[msg.sender_id] = (counts[msg.sender_id] || 0) + 1;
        });
      }
      setUnreadCount(totalUnread);
      setUnreadCounts(counts);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatPartner || !currentMatchId || !userId) return;

    const s = getSocket();
    if (s) {
      s.emit("send_message", {
        match_id: currentMatchId, sender_id: userId, receiver_id: activeChatPartner.id,
        content: chatInput, message_type: 'text'
      });
    }

    const myNewMsg: Message = { id: Date.now().toString(), sender: 'me', text: chatInput, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isRead: false };
    
    setMessages(prev => [...prev, myNewMsg]);
    setChatInput(""); 

    setChatHistory(prev => ({
        ...prev,
        [activeChatPartner.id]: [myNewMsg]
    }));
  };

  const handleSendFile = async (fileData: { type: 'file', fileName: string, fileUrl: string }) => {
    if (!activeChatPartner || !currentMatchId || !userId) return;

    const s = getSocket();
    if (s) {
      s.emit("send_message", {
        match_id: currentMatchId, sender_id: userId, receiver_id: activeChatPartner.id,
        content: "", file_name: fileData.fileName, file_url: fileData.fileUrl, message_type: 'file'
      });
    }

    const myNewMsg: Message = { id: Date.now().toString(), sender: 'me', text: '', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isRead: false, type: 'file', fileName: fileData.fileName, fileUrl: fileData.fileUrl };
    
    setMessages(prev => [...prev, myNewMsg]);

    setChatHistory(prev => ({
        ...prev,
        [activeChatPartner.id]: [myNewMsg]
    }));
  };

  const deleteConversation = async (partnerId: string) => {
    if(!userId) return;
    
    const { error } = await supabase
      .from('matches')
      .delete()
      .or(`and(mentor_id.eq.${userId},student_id.eq.${partnerId}),and(mentor_id.eq.${partnerId},student_id.eq.${userId})`);

    if (error) {
      console.error("Supabase match wipe operation failed:", error.message);
      triggerToast("Failed to delete conversation.");
      return;
    }

    setActiveChatIDs(prev => prev.filter(id => id !== partnerId));
    setChatHistory(prev => {
      const updated = { ...prev };
      delete updated[partnerId];
      return updated;
    });
    setMessages([]); 
    setActiveChatPartner(null); 
    setShowChat(false);
    triggerToast("Conversation and history permanently deleted.");
    
    await loadFullDatabaseState(userId, userEmail, null, true);
  };

  const blockUser = async (partnerId: string) => {
    if(!userId) return;
    await supabase.from('blocks').insert([{ blocker_id: userId, blocked_id: partnerId }]);
    setBlockedUsers(prev => [...prev, partnerId]);
    setShowChat(false); setActiveChatPartner(null);
    triggerToast("User blocked.");
  };

  const unblockUser = async (partnerId: string) => {
    if(!userId) return;
    
    if (reportedUsers.includes(partnerId)) {
      triggerToast("Blocked by Safety: Cannot unblock users pending safety review.");
      return;
    }

    const { error } = await supabase.from('blocks').delete().match({ blocker_id: userId, blocked_id: partnerId });
    if (error) {
      console.error("Unblock database error:", error);
      triggerToast("Failed to unblock user.");
      return;
    }

    setBlockedUsers(prev => prev.filter(id => id !== partnerId));
    triggerToast("User unblocked.");
    await loadFullDatabaseState(userId, userEmail, null, true);
  };

  const reportUser = async (reportedId: string, reason: string = 'Other') => {
    if(!userId) return;
    
    await supabase.from('reports').insert([{ reporter_id: userId, reported_id: reportedId, reason }]);
    await supabase.from('blocks').insert([{ blocker_id: userId, blocked_id: reportedId }]);
    
    setReportedUsers(prev => [...prev, reportedId]);
    if (!blockedUsers.includes(reportedId)) {
      setBlockedUsers(prev => [...prev, reportedId]);
    }

    setShowChat(false); 
    setActiveChatPartner(null);
    
    const s = getSocket();
    if (s) {
      s.emit("report_user", {
        reporter_id: userId,
        reported_id: reportedId,
        reason
      });
    }

    const { data: adminUser } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', ADMIN_EMAIL)
      .maybeSingle();

    if (adminUser) {
      const { data: adminSettings } = await supabase
        .from('user_settings')
        .select('email_notifications')
        .eq('user_id', adminUser.user_id)
        .maybeSingle();

      if (adminSettings?.email_notifications) {
        triggerToast("User reported and blocked. Admin notified via email.");
      } else {
        triggerToast("User reported and blocked securely.");
      }
    } else {
      triggerToast("User reported and blocked.");
    }
    
    await loadFullDatabaseState(userId, userEmail, null, true);
  };

  const resolveReport = async (reportId: string, status: 'Resolved' | 'Dismissed' = 'Resolved', reporterId?: string, reportedId?: string) => {
    const { error } = await supabase
      .from('reports')
      .update({ status })
      .eq('report_id', reportId);

    if (error) {
      console.error("Database update error:", error);
      triggerToast("Error updating report status.");
      return;
    }

    if (status === 'Dismissed' && reporterId && reportedId) {
      await supabase
        .from('blocks')
        .delete()
        .match({ blocker_id: reporterId, blocked_id: reportedId });
    }

    const s = getSocket();
    if (s) {
      s.emit("resolve_report", { report_id: reportId, status });
    }
    
    triggerToast(`Report marked as ${status}.`);
    if (userId) {
      await loadFullDatabaseState(userId, userEmail, null, true);
    }
  };

  const submitReview = async (revieweeId: string, rating: number, comment: string) => {
    if(!userId || !currentMatchId) return;

    if (rating >= 4 && hoursBalance <= 0) {
      triggerToast("Transaction Blocked: Writing a high-rated review requires 1 Barter Hour.");
      return;
    }

    await supabase.from('reviews').insert([{ match_id: currentMatchId, reviewer_id: userId, reviewee_id: revieweeId, rating, comment }]);
    triggerToast(rating < 4 ? "Constructive feedback saved! Your balance remains unchanged." : "Feedback submitted successfully! 1 hour transferred.");
    await loadFullDatabaseState(userId, userEmail, null, true); 
  };

  const handleTyping = (isTyping: boolean) => {
    const s = getSocket();
    if (s && currentMatchId) {
      s.emit("typing", { match_id: currentMatchId, isTyping });
    }
  };

  // HIGHLY ACCURATE MATCHING ENGINE (Fixes Circular Matching Bug)
  const filteredMatches = useMemo(() => {
    let scoredResults = allMatches
      .filter(m => !blockedUsers.includes(m.id) && !reportedUsers.includes(m.id))
      .filter(m => {
        const isSearching = searchQuery.trim() !== "";
        if (isSearching) return true; 
        return m.rating >= 4.0; 
      })
      .map(person => {
        // Prepare my arrays
        const mySkillsLower = mySkills.map(s => s.toLowerCase());
        const myNeedsLower = myNeeds.map(n => n.toLowerCase());

        // Prepare their arrays 
        const getArr = (str: string) => str ? str.split(',').map(s => s.trim().toLowerCase()) : [];
        const personTeach = getArr(person.teaching);
        const personNeeds = getArr(person.needs);

        // Exact mutual checking (My skill inside their needs array)
        const iCanTeachThem = mySkillsLower.some(s => personNeeds.includes(s));
        const theyCanTeachMe = myNeedsLower.some(n => personTeach.includes(n));
        const isMutualMatch = iCanTeachThem && theyCanTeachMe;

        let isCircularMatch = false;
        if (!isMutualMatch && (iCanTeachThem || theyCanTeachMe)) {
            isCircularMatch = allMatches.some(userC => {
                if (userC.id === person.id || blockedUsers.includes(userC.id) || reportedUsers.includes(userC.id)) return false;

                const cTeach = getArr(userC.teaching);
                const cNeeds = getArr(userC.needs);

                // Scenario 1: I teach Person -> Person teaches C -> C teaches Me
                const personCanTeachC = personTeach.some(t => cNeeds.includes(t));
                const cCanTeachMe = myNeedsLower.some(n => cTeach.includes(n));

                if (iCanTeachThem && personCanTeachC && cCanTeachMe) return true;

                // Scenario 2: They teach Me -> C teaches Them -> I teach C
                const iCanTeachC = mySkillsLower.some(s => cNeeds.includes(s));
                const cCanTeachPerson = cTeach.some(t => personNeeds.includes(t));

                if (theyCanTeachMe && cCanTeachPerson && iCanTeachC) return true;

                return false;
            });
        }

        let score = 0;
        if (isMutualMatch) score = 100;
        else if (isCircularMatch) score = 85;
        else if (theyCanTeachMe) score = 70;
        else if (iCanTeachThem) score = 60;
        
        if (score > 0 && person.category === onboardingCategory?.name) score += 5;
        if (score > 0 && person.status === 'Online') score += 5;
        
        return { ...person, matchScore: score, isMutualMatch, isCircularMatch };
      });

    if (searchQuery.trim() === "" && activeCategoryFilter !== "All") {
        scoredResults = scoredResults.filter(m => m.matchScore && m.matchScore > 0);
    } else if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        scoredResults = scoredResults.filter(m => m.name.toLowerCase().includes(query) || m.teaching.toLowerCase().includes(query));
    }

    scoredResults = scoredResults.filter(m => {
      const catMatch = activeCategoryFilter === "All" || m.category === activeCategoryFilter;
      const onlineMatch = !onlineOnly || m.status === 'Online';
      return catMatch && onlineMatch;
    });

    if (sortBy === "Top Rated") {
      scoredResults.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    } else if (sortBy === "Newest") {
      scoredResults.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else {
      scoredResults.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    return scoredResults;
  }, [allMatches, mySkills, myNeeds, onlineOnly, activeCategoryFilter, searchQuery, sortBy, onboardingCategory, blockedUsers, reportedUsers]);

  const activeChatUsers = useMemo(() => {
    return allMatches.filter(m => activeChatIDs.includes(m.id) && !blockedUsers.includes(m.id) && !reportedUsers.includes(m.id));
  }, [activeChatIDs, blockedUsers, reportedUsers, allMatches]);

  const state = { 
    loading, isLoggingOut, isSubmitting, isLoggedIn, isLoginView, showBioStep, userName, userEmail, showScroll, showDirectory, showChat, addingSkillType, activeTab, activeChatPartner, mySkills, myNeeds, onboardingCategory, onlineOnly, activeCategoryFilter, searchQuery, sortBy, chatInput, messages, chatHistory, isPartnerTyping, filteredMatches, activeChatUsers, blockedUsers, reportedUsers, allMatches, year: new Date().getFullYear(), toast, isVerified, activeChatIDs, userProfile, userSettings, hasSkillsConfigured, hoursBalance, unreadCount, unreadCounts, isAdmin, socket: getSocket(),
    isVerifyingAuth, authStatusMessage, authSuccess, myRating, myReviewCount
  };
  const setters = { setLoading, setIsLoggedIn, setIsLoggingOut, setIsLoginView, setShowBioStep, setShowDirectory, setShowChat, setActiveTab, setActiveChatPartner, setMySkills, setMyNeeds, setAddingSkillType, setOnboardingCategory, setOnlineOnly, setActiveCategoryFilter, setSearchQuery, setSortBy, setChatInput, setUserName, setUserEmail, setShowScroll, setIsPartnerTyping, setActiveChatIDs, setUserProfile, setUserSettings, setAllMatches, setHoursBalance, setUnreadCount, setUnreadCounts, setMyRating, setMyReviewCount };
  
  const actions = { 
    handleAuth, 
    handleLogout, 
    triggerToast, 
    openSpecificChat, 
    handleSendMessage, 
    handleSendFile, 
    saveProfile, 
    saveSettings, 
    addSkill, 
    removeSkill, 
    addNeed, 
    removeNeed, 
    blockUser, 
    unblockUser, 
    reportUser, 
    resolveReport,
    submitReview, 
    deleteConversation,
    handleTyping,
    
    saveToPhoneBook: async (arg1: any, arg2?: any, arg3?: any, arg4?: any) => {
      if (!userId) return;
      
      let nameToSave = userName;
      let skillsToSave: string[] = [];
      let desiredSkillsToSave: string[] = [];

      if (typeof arg1 === 'object' && arg1 !== null) {
        nameToSave = arg1.name || userName;
      } 
      else if (typeof arg2 === 'string') {
        nameToSave = arg2;
        if (Array.isArray(arg3)) {
          skillsToSave = arg3;
        }
        if (Array.isArray(arg4)) {
          desiredSkillsToSave = arg4;
        }
      }

      setUserName(nameToSave);
      await supabase.from('users').update({ username: nameToSave }).eq('user_id', userId);

      if (skillsToSave.length > 0) {
        let currentDictionary = skillDictionary;
        if (Object.keys(currentDictionary).length === 0) {
          const { data: dbSkills } = await supabase.from('skills').select('*');
          if (dbSkills) {
            dbSkills.forEach(s => currentDictionary[s.skill_name] = s.skill_id);
            setSkillDictionary(currentDictionary);
          }
        }

        const limitedSkills = skillsToSave.slice(0, 5);

        for (const skill of limitedSkills) {
          const skillId = currentDictionary[skill];
          if (skillId) {
            await supabase.from('teachable_skills').insert([{ 
              user_id: userId, 
              skill_id: skillId, 
              skill_level: 'Beginner' 
            }]);
          }
        }
        
        const firstSelectedSkill = limitedSkills[0];
        const { data: skillCategoryInfo } = await supabase
          .from('skills')
          .select('skill_categories(category_name)')
          .eq('skill_name', firstSelectedSkill)
          .maybeSingle();

        const rawCategory = skillCategoryInfo?.skill_categories;
        const categoryName = Array.isArray(rawCategory)
          ? rawCategory[0]?.category_name
          : (rawCategory as any)?.category_name;

        if (categoryName) {
          await supabase.from('users')
            .update({ title: `${categoryName} Specialist` })
            .eq('user_id', userId);
        }

        await loadFullDatabaseState(userId, userEmail, null, true);
      }
    }
  };

  return { state, setters, actions };
}