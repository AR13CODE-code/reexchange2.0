import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Search, 
  ArrowLeftRight, 
  Compass, 
  MessageSquare, 
  Bell, 
  PlusCircle, 
  User, 
  Gift, 
  Briefcase,
  Trophy,
  Sun,
  Moon,
  LogOut,
  LogIn,
  UserPlus,
  MapPin,
  Flame
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    notifications, 
    connections, 
    setCreateListingOpen, 
    setCreateListingDefaultType,
    currentUser,
    isLoggedIn,
    setLoginModalOpen,
    setAuthModalMode,
    logout,
    theme,
    toggleTheme,
    markNotificationsAsRead
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const pendingConnections = connections.filter(c => c.toUserId === currentUser?.id && c.status === 'pending').length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy, badge: 'LEAGUE' },
    { id: 'smartmatch', label: 'SmartMatch', icon: Sparkles, badge: 'AI' },
    { id: 'skillswap', label: 'Skill Swap', icon: ArrowLeftRight },
    { id: 'giveaway', label: 'Giveaways', icon: Gift },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-800 shadow-lg shadow-black/20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo-button"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-rose-950/60 group-hover:scale-105 transition-transform">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white font-display">
                  REXCHANGE
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  SRM KTR
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-stone-400 hidden sm:flex font-medium">
                <MapPin className="w-3 h-3 text-rose-500" />
                <span>Exchange more than things</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-800/80 p-1.5 rounded-full border border-stone-700/80 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-950/50'
                      : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[8px] uppercase font-black tracking-wider px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-950 leading-tight font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-button"
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl border border-stone-700 bg-stone-800/90 text-stone-200 hover:bg-stone-700 hover:text-white transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-300" />
              )}
            </button>

            {/* Quick Share / Post Button */}
            <button
              id="header-share-button"
              onClick={() => {
                if (!isLoggedIn) {
                  setAuthModalMode('register');
                  setLoginModalOpen(true);
                  return;
                }
                setCreateListingDefaultType('offer');
                setCreateListingOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-md shadow-rose-950/60 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">List Item / Skill</span>
              <span className="sm:hidden">Post</span>
            </button>

            {/* Messages / Requests Tab */}
            <button
              id="header-messages-button"
              onClick={() => {
                if (!isLoggedIn) {
                  setAuthModalMode('login');
                  setLoginModalOpen(true);
                  return;
                }
                setActiveTab('messages');
              }}
              className={`relative p-2.5 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-950/50'
                  : 'bg-stone-800/90 border-stone-700 text-stone-200 hover:bg-stone-700'
              }`}
              title="Connections & Messages"
            >
              <MessageSquare className="w-4 h-4" />
              {pendingConnections > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {pendingConnections}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                id="header-notifications-button"
                onClick={() => {
                  if (!isLoggedIn) {
                    setAuthModalMode('login');
                    setLoginModalOpen(true);
                    return;
                  }
                  setNotifDropdownOpen(!notifDropdownOpen);
                  if (!notifDropdownOpen && unreadNotifs > 0) {
                    markNotificationsAsRead();
                  }
                }}
                className={`relative p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  notifDropdownOpen
                    ? 'bg-stone-700 border-stone-600 text-white'
                    : 'bg-stone-800/90 border-stone-700 text-stone-200 hover:bg-stone-700'
                }`}
                title="Campus Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div 
                  id="notifications-dropdown-menu"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-stone-900 rounded-3xl shadow-2xl border border-stone-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-2">
                    <span className="font-bold text-sm text-white">Campus Alerts & Updates</span>
                    <span className="text-xs text-stone-400">{notifications.length} recent</span>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-stone-500 text-center py-4">No notifications yet.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setNotifDropdownOpen(false);
                            if (n.linkTab) setActiveTab(n.linkTab);
                          }}
                          className={`p-3 rounded-2xl cursor-pointer transition-colors text-left ${
                            n.read 
                              ? 'bg-stone-800/50 hover:bg-stone-800 text-stone-300' 
                              : 'bg-rose-950/40 border border-rose-900 text-white hover:bg-rose-900/40'
                          }`}
                        >
                          <p className="font-semibold text-xs text-white">{n.title}</p>
                          <p className="text-xs text-stone-400 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-stone-500 mt-1 block font-mono">{n.createdAt}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Sign In Triggers */}
            {!isLoggedIn || !currentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  id="header-login-trigger"
                  onClick={() => {
                    setAuthModalMode('login');
                    setLoginModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-xs bg-stone-800 border border-stone-700 text-white hover:bg-stone-700 transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign In</span>
                </button>
                <button
                  id="header-register-trigger"
                  onClick={() => {
                    setAuthModalMode('register');
                    setLoginModalOpen(true);
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-md shadow-rose-950/50 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            ) : (
              /* Logged In User Profile Trigger */
              <div className="relative">
                <button
                  id="header-user-profile-button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-stone-700 bg-stone-800 hover:bg-stone-700/80 transition-all cursor-pointer"
                  title="View Profile & Dashboard"
                >
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-rose-500"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-white leading-tight truncate max-w-[90px]">
                      {currentUser.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-amber-400 font-mono leading-tight">
                      {currentUser.regNo || currentUser.department.split(' ')[0]}
                    </p>
                  </div>
                </button>

                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <div 
                    id="user-profile-dropdown-menu"
                    className="absolute right-0 mt-2 w-72 bg-stone-900 rounded-3xl shadow-2xl border border-stone-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="pb-3 border-b border-stone-800 mb-3">
                      <div className="flex items-center gap-2.5">
                        <img src={currentUser.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500" />
                        <div className="overflow-hidden">
                          <p className="font-bold text-xs text-white truncate">{currentUser.name}</p>
                          <p className="text-[11px] text-amber-400 font-mono truncate">{currentUser.regNo || 'SRMIST'}</p>
                          <p className="text-[10px] text-stone-400 truncate">{currentUser.department} • {currentUser.year}</p>
                          <p className="text-[10px] text-rose-400 font-medium truncate mt-0.5">📍 {currentUser.campusZone}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setActiveTab('profile');
                          }}
                          className="py-2 px-3 rounded-xl text-xs font-bold bg-stone-800 text-stone-200 hover:bg-stone-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5" />
                          Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="py-2 px-3 rounded-xl text-xs font-bold bg-rose-950/50 text-rose-300 hover:bg-rose-900/50 border border-rose-900/60 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Logout
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-400 px-1">
                      <p className="font-semibold text-stone-300">SRM Student Account Active</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Kattankulathur Campus Network</p>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
