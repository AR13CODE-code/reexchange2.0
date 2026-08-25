import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Search, Trophy, Sparkles, MessageSquare, Plus, ArrowLeftRight } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    connections, 
    setCreateListingOpen, 
    setCreateListingDefaultType,
    currentUser,
    isLoggedIn,
    setLoginModalOpen,
    setAuthModalMode
  } = useApp();

  const pendingConnections = connections.filter(c => c.toUserId === currentUser?.id && c.status === 'pending').length;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 px-2 py-2 shadow-2xl transition-colors">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home */}
        <button
          id="mobile-nav-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-colors ${
            activeTab === 'home' ? 'text-rose-400 font-bold' : 'text-stone-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Explore */}
        <button
          id="mobile-nav-explore"
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-colors ${
            activeTab === 'explore' ? 'text-rose-400 font-bold' : 'text-stone-400'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </button>

        {/* Tournaments */}
        <button
          id="mobile-nav-tournaments"
          onClick={() => setActiveTab('tournaments')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-colors ${
            activeTab === 'tournaments' ? 'text-rose-400 font-bold' : 'text-stone-400'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px]">Leagues</span>
        </button>

        {/* Floating Center Share Button */}
        <button
          id="mobile-nav-post"
          onClick={() => {
            if (!isLoggedIn) {
              setAuthModalMode('register');
              setLoginModalOpen(true);
              return;
            }
            setCreateListingDefaultType('offer');
            setCreateListingOpen(true);
          }}
          className="-mt-5 w-11 h-11 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-lg shadow-rose-950/70 flex items-center justify-center active:scale-95 transition-all"
          title="Share something"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* SmartMatch */}
        <button
          id="mobile-nav-smartmatch"
          onClick={() => setActiveTab('smartmatch')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-colors ${
            activeTab === 'smartmatch' ? 'text-rose-400 font-bold' : 'text-stone-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px]">AI Match</span>
        </button>

        {/* Messages / Connections */}
        <button
          id="mobile-nav-messages"
          onClick={() => {
            if (!isLoggedIn) {
              setAuthModalMode('login');
              setLoginModalOpen(true);
              return;
            }
            setActiveTab('messages');
          }}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-colors ${
            activeTab === 'messages' ? 'text-rose-400 font-bold' : 'text-stone-400'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Chat</span>
          {pendingConnections > 0 && (
            <span className="absolute top-0.5 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-stone-900"></span>
          )}
        </button>

      </div>
    </div>
  );
};
