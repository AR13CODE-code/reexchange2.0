import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Listing, Opportunity, ConnectionRequest, NotificationItem, ImpactStats, UserProfile, SkillSwapPair, SmartMatchResult, Tournament, TournamentRegistration } from '../types';
import { INITIAL_IMPACT_STATS } from '../data/seedData';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Theme state
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // Authentication helpers
  login: (loginId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  
  // Data
  listings: Listing[];
  tournaments: Tournament[];
  opportunities: Opportunity[];
  connections: ConnectionRequest[];
  notifications: NotificationItem[];
  savedListingIds: string[];
  impactStats: ImpactStats;
  skillSwapPairs: SkillSwapPair[];
  
  // Modals & Drawers
  createListingOpen: boolean;
  setCreateListingOpen: (open: boolean) => void;
  createListingDefaultType: 'offer' | 'need';
  setCreateListingDefaultType: (type: 'offer' | 'need') => void;
  
  // Tournaments Modals
  hostTournamentOpen: boolean;
  setHostTournamentOpen: (open: boolean) => void;
  registerTournamentTarget: Tournament | null;
  setRegisterTournamentTarget: (tourney: Tournament | null) => void;
  tournamentDetailsTarget: Tournament | null;
  setTournamentDetailsTarget: (tourney: Tournament | null) => void;

  connectModalTarget: { listing?: Listing; user?: Partial<UserProfile>; customTitle?: string } | null;
  setConnectModalTarget: (target: { listing?: Listing; user?: Partial<UserProfile>; customTitle?: string } | null) => void;
  
  activeChatConnection: ConnectionRequest | null;
  setActiveChatConnection: (conn: ConnectionRequest | null) => void;
  
  reportModalTarget: { listingId?: string; title: string } | null;
  setReportModalTarget: (target: { listingId?: string; title: string } | null) => void;
  
  rexOpen: boolean;
  setRexOpen: (open: boolean) => void;
  
  // Operations
  fetchListings: () => Promise<void>;
  fetchTournaments: () => Promise<void>;
  createListing: (listingData: Partial<Listing>) => Promise<Listing | null>;
  deleteListing: (id: string) => Promise<boolean>;
  toggleSaveListing: (id: string) => Promise<void>;
  createTournament: (tourneyData: Partial<Tournament>) => Promise<Tournament | null>;
  registerForTournament: (tourneyId: string, regData: Partial<TournamentRegistration>) => Promise<{ success: boolean; error?: string }>;
  deleteTournament: (id: string) => Promise<boolean>;
  createOpportunity: (oppData: Partial<Opportunity>) => Promise<Opportunity | null>;
  sendConnectionRequest: (toUserId: string, toUserName: string, message: string, listingId?: string, listingTitle?: string) => Promise<boolean>;
  respondConnectionRequest: (id: string, status: 'accepted' | 'declined', contactInfo?: string) => Promise<boolean>;
  sendChatMessage: (connectionId: string, text: string) => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
  runSmartMatch: (prompt: string) => Promise<{ matches: SmartMatchResult[]; extractedIntent?: any; noMatchAdvice?: string }>;
  enhanceListingWithAI: (rawInput: string, type: 'offer' | 'need', category?: string) => Promise<any>;
  askRexAI: (message: string) => Promise<string>;
  
  // Filter state for explore
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedExchangeType: string;
  setSelectedExchangeType: (et: string) => void;
  selectedListingType: string;
  setSelectedListingType: (lt: string) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme management with localStorage persistence and default to dark
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('rexchange_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'dark'; // Default to dark cinematic aesthetic
    } catch {
      return 'dark';
    }
  });

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('rexchange_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error("Failed to save theme preference:", e);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Real user state - starts null/empty unless already registered & saved in localStorage
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('rexchange_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch {}
    return null;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem('rexchange_is_logged_in');
      return savedAuth === 'true';
    } catch {
      return false;
    }
  });

  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');
  const [activeTab, setActiveTab] = useState<string>('home');

  const [listings, setListings] = useState<Listing[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [connections, setConnections] = useState<ConnectionRequest[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);
  const [impactStats, setImpactStats] = useState<ImpactStats>(INITIAL_IMPACT_STATS);
  const [skillSwapPairs, setSkillSwapPairs] = useState<SkillSwapPair[]>([]);

  // Modals
  const [createListingOpen, setCreateListingOpen] = useState(false);
  const [createListingDefaultType, setCreateListingDefaultType] = useState<'offer' | 'need'>('offer');
  
  // Tournaments Modals
  const [hostTournamentOpen, setHostTournamentOpen] = useState(false);
  const [registerTournamentTarget, setRegisterTournamentTarget] = useState<Tournament | null>(null);
  const [tournamentDetailsTarget, setTournamentDetailsTarget] = useState<Tournament | null>(null);

  const [connectModalTarget, setConnectModalTarget] = useState<{ listing?: Listing; user?: Partial<UserProfile>; customTitle?: string } | null>(null);
  const [activeChatConnection, setActiveChatConnection] = useState<ConnectionRequest | null>(null);
  const [reportModalTarget, setReportModalTarget] = useState<{ listingId?: string; title: string } | null>(null);
  const [rexOpen, setRexOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExchangeType, setSelectedExchangeType] = useState('all');
  const [selectedListingType, setSelectedListingType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/listings');
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    }
  };

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/tournaments');
      if (res.ok) {
        const data = await res.json();
        setTournaments(data);
      }
    } catch (err) {
      console.error("Failed to fetch tournaments:", err);
    }
  };

  const fetchOpportunities = async () => {
    try {
      const res = await fetch('/api/opportunities');
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data);
      }
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await fetch('/api/connections');
      if (res.ok) {
        const data = await res.json();
        setConnections(data);
      }
    } catch (err) {
      console.error("Failed to fetch connections:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setImpactStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchSkillSwaps = async () => {
    try {
      const res = await fetch('/api/skill-swaps');
      if (res.ok) {
        const data = await res.json();
        setSkillSwapPairs(data);
      }
    } catch (err) {
      console.error("Failed to fetch skill swaps:", err);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchTournaments();
    fetchOpportunities();
    fetchConnections();
    fetchNotifications();
    fetchStats();
    fetchSkillSwaps();
  }, []);

  // Sync user state with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rexchange_user', JSON.stringify(currentUser));
      localStorage.setItem('rexchange_is_logged_in', 'true');
    } else {
      localStorage.removeItem('rexchange_user');
      localStorage.setItem('rexchange_is_logged_in', 'false');
    }
  }, [currentUser, isLoggedIn]);

  // Real Auth Operations
  const login = async (loginId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setLoginModalOpen(false);
        await fetchConnections();
        await fetchNotifications();
        try {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        } catch (_) {}
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (err) {
      return { success: false, error: "Network error during login." };
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setLoginModalOpen(false);
        await fetchConnections();
        await fetchNotifications();
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (_) {}
        return { success: true };
      } else {
        return { success: false, error: data.error || "Registration failed" };
      }
    } catch (err) {
      return { success: false, error: "Network error during registration." };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveChatConnection(null);
    setLoginModalOpen(false);
    setActiveTab('home');
    localStorage.removeItem('rexchange_user');
    localStorage.setItem('rexchange_is_logged_in', 'false');
  };

  // Operations
  const createListing = async (listingData: Partial<Listing>): Promise<Listing | null> => {
    if (!currentUser) {
      setAuthModalMode('register');
      setLoginModalOpen(true);
      return null;
    }

    try {
      const payload: Partial<Listing> = {
        ...listingData,
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        ownerRegNo: currentUser.regNo,
        ownerAvatar: currentUser.avatarUrl,
        ownerDept: currentUser.department,
        ownerYear: currentUser.year,
        ownerCollege: currentUser.college || 'SRM IST Kattankulathur',
        campusZone: listingData.campusZone || currentUser.campusZone || 'Tech Park',
      };

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newListing: Listing = await res.json();
        setListings(prev => [newListing, ...prev]);
        setImpactStats(prev => ({ ...prev, resourcesShared: prev.resourcesShared + 1 }));
        setCurrentUser(prev => prev ? ({
          ...prev,
          stats: {
            ...prev.stats,
            resourcesShared: prev.stats.resourcesShared + 1
          }
        }) : null);

        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (_) {}

        return newListing;
      }
    } catch (err) {
      console.error("Create listing failed:", err);
    }
    return null;
  };

  const deleteListing = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setListings(prev => prev.filter(l => l.id !== id));
        return true;
      }
    } catch (err) {
      console.error("Delete listing failed:", err);
    }
    return false;
  };

  const toggleSaveListing = async (id: string) => {
    const isSaved = savedListingIds.includes(id);
    const newSaved = isSaved ? savedListingIds.filter(itemId => itemId !== id) : [...savedListingIds, id];
    setSavedListingIds(newSaved);

    try {
      await fetch(`/api/listings/${id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: !isSaved })
      });
      setListings(prev =>
        prev.map(l => l.id === id ? { ...l, savesCount: Math.max(0, l.savesCount + (!isSaved ? 1 : -1)) } : l)
      );
    } catch (err) {
      console.error("Save listing toggle error:", err);
    }
  };

  // Tournament Operations
  const createTournament = async (tourneyData: Partial<Tournament>): Promise<Tournament | null> => {
    if (!currentUser) {
      setAuthModalMode('register');
      setLoginModalOpen(true);
      return null;
    }

    try {
      const payload: Partial<Tournament> = {
        ...tourneyData,
        organizerId: currentUser.id,
        organizerName: currentUser.name,
        organizerContact: currentUser.email || `${currentUser.name} (SRMIST)`
      };

      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newTourney: Tournament = await res.json();
        setTournaments(prev => [newTourney, ...prev]);
        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        } catch (_) {}
        return newTourney;
      }
    } catch (err) {
      console.error("Create tournament error:", err);
    }
    return null;
  };

  const registerForTournament = async (tourneyId: string, regData: Partial<TournamentRegistration>): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      setAuthModalMode('register');
      setLoginModalOpen(true);
      return { success: false, error: "Please log in or register to participate in tournaments." };
    }

    try {
      const payload = {
        ...regData,
        captainId: currentUser.id,
        captainName: regData.captainName || currentUser.name,
        captainEmail: regData.captainEmail || currentUser.email,
        captainRegNo: regData.captainRegNo || currentUser.regNo || '',
      };

      const res = await fetch(`/api/tournaments/${tourneyId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTournaments(prev => prev.map(t => t.id === tourneyId ? data.tournament : t));
        await fetchNotifications();
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        } catch (_) {}
        return { success: true };
      } else {
        return { success: false, error: data.error || "Failed to register team." };
      }
    } catch (err) {
      return { success: false, error: "Network error during tournament registration." };
    }
  };

  const deleteTournament = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/tournaments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTournaments(prev => prev.filter(t => t.id !== id));
        return true;
      }
    } catch (err) {
      console.error("Delete tournament error:", err);
    }
    return false;
  };

  const createOpportunity = async (oppData: Partial<Opportunity>): Promise<Opportunity | null> => {
    if (!currentUser) {
      setAuthModalMode('register');
      setLoginModalOpen(true);
      return null;
    }

    try {
      const payload: Partial<Opportunity> = {
        ...oppData,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatarUrl
      };
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newOpp = await res.json();
        setOpportunities(prev => [newOpp, ...prev]);
        return newOpp;
      }
    } catch (err) {
      console.error("Create opportunity error:", err);
    }
    return null;
  };

  const sendConnectionRequest = async (toUserId: string, toUserName: string, message: string, listingId?: string, listingTitle?: string): Promise<boolean> => {
    if (!currentUser) {
      setAuthModalMode('register');
      setLoginModalOpen(true);
      return false;
    }

    try {
      const payload = {
        fromUserId: currentUser.id,
        fromUserName: currentUser.name,
        fromUserAvatar: currentUser.avatarUrl,
        fromUserDept: currentUser.department,
        fromUserYear: currentUser.year,
        toUserId,
        toUserName,
        listingId,
        listingTitle,
        message
      };

      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newConn: ConnectionRequest = await res.json();
        setConnections(prev => [newConn, ...prev]);
        setImpactStats(prev => ({ ...prev, studentConnections: prev.studentConnections + 1 }));
        
        try {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.7 }
          });
        } catch (_) {}

        return true;
      }
    } catch (err) {
      console.error("Send connection failed:", err);
    }
    return false;
  };

  const respondConnectionRequest = async (id: string, status: 'accepted' | 'declined', contactInfo?: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/connections/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, contactInfo: contactInfo || currentUser?.contactHandle })
      });

      if (res.ok) {
        const updated = await res.json();
        setConnections(prev => prev.map(c => c.id === id ? updated : c));
        setActiveChatConnection(prev => prev?.id === id ? updated : prev);
        if (status === 'accepted') {
          setImpactStats(prev => ({ ...prev, skillExchanges: prev.skillExchanges + 1 }));
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch (_) {}
        }
        
        try {
          const notifRes = await fetch('/api/notifications');
          if (notifRes.ok) {
            const notifs = await notifRes.json();
            setNotifications(notifs);
          }
        } catch (_) {}

        return true;
      }
      return false;
    } catch (err) {
      console.error("Respond connection failed:", err);
      return false;
    }
  };

  const sendChatMessage = async (connectionId: string, text: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/connections/${connectionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          senderName: currentUser.name,
          text
        })
      });

      if (res.ok) {
        const msg = await res.json();
        setConnections(prev =>
          prev.map(c => c.id === connectionId ? { ...c, messages: [...c.messages, msg] } : c)
        );
        if (activeChatConnection && activeChatConnection.id === connectionId) {
          setActiveChatConnection(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : null);
        }
      }
    } catch (err) {
      console.error("Send chat message failed:", err);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-read', { method: 'PUT' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Mark notifications error:", err);
    }
  };

  const runSmartMatch = async (prompt: string) => {
    try {
      const res = await fetch('/api/ai/smart-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userProfile: currentUser })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error("SmartMatch API error:", err);
    }
    return { matches: [], noMatchAdvice: "Could not connect to matchmaking service right now." };
  };

  const enhanceListingWithAI = async (rawInput: string, type: 'offer' | 'need', category?: string) => {
    try {
      const res = await fetch('/api/ai/enhance-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawInput, type, category })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error("AI Enhance error:", err);
    }
    return null;
  };

  const askRexAI = async (message: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai/rex-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (res.ok) {
        const data = await res.json();
        return data.reply;
      }
    } catch (err) {
      console.error("Rex AI chat error:", err);
    }
    return "Hey! I'm Rex, your SRM exchange buddy. Ask me about study materials, calculators, hostel exchanges, or sports tournaments!";
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoggedIn,
        setIsLoggedIn,
        loginModalOpen,
        setLoginModalOpen,
        authModalMode,
        setAuthModalMode,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        setTheme,
        login,
        register,
        logout,
        listings,
        tournaments,
        opportunities,
        connections,
        notifications,
        savedListingIds,
        impactStats,
        skillSwapPairs,
        createListingOpen,
        setCreateListingOpen,
        createListingDefaultType,
        setCreateListingDefaultType,
        hostTournamentOpen,
        setHostTournamentOpen,
        registerTournamentTarget,
        setRegisterTournamentTarget,
        tournamentDetailsTarget,
        setTournamentDetailsTarget,
        connectModalTarget,
        setConnectModalTarget,
        activeChatConnection,
        setActiveChatConnection,
        reportModalTarget,
        setReportModalTarget,
        rexOpen,
        setRexOpen,
        fetchListings,
        fetchTournaments,
        createListing,
        deleteListing,
        toggleSaveListing,
        createTournament,
        registerForTournament,
        deleteTournament,
        createOpportunity,
        sendConnectionRequest,
        respondConnectionRequest,
        sendChatMessage,
        markNotificationsAsRead,
        runSmartMatch,
        enhanceListingWithAI,
        askRexAI,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedExchangeType,
        setSelectedExchangeType,
        selectedListingType,
        setSelectedListingType,
        selectedLocation,
        setSelectedLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
