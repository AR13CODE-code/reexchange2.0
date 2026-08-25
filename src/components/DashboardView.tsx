import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Search, 
  Handshake, 
  Gift, 
  ArrowLeftRight, 
  MapPin, 
  BookOpen, 
  Brain, 
  TrendingUp, 
  ArrowRight,
  UserCheck,
  Zap,
  Bookmark,
  BookmarkCheck,
  Dumbbell
} from 'lucide-react';
import { motion } from 'motion/react';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    setActiveTab, 
    setCreateListingOpen, 
    setCreateListingDefaultType,
    listings,
    setConnectModalTarget,
    savedListingIds,
    toggleSaveListing
  } = useApp();

  const [nlQuery, setNlQuery] = useState('');

  const firstName = currentUser.name.split(' ')[0];

  // Recommendations based on user branch / skills
  const recommendedListings = listings.filter(l => 
    l.ownerId !== currentUser.id && (
      l.tags.some(t => currentUser.interests.includes(t) || currentUser.skillsNeeded.some(s => s.toLowerCase().includes(t.toLowerCase()))) ||
      l.category === 'academic' ||
      l.category === 'books' ||
      l.category === 'sports'
    )
  ).slice(0, 3);

  // Nearby on campus (matching SRM hubs)
  const nearbyListings = listings.filter(l => 
    l.ownerId !== currentUser.id && 
    (l.campusZone.toLowerCase().includes('library') || l.campusZone.toLowerCase().includes('tech') || l.campusZone.toLowerCase().includes('java') || l.campusZone.toLowerCase().includes('stadium'))
  ).slice(0, 3);

  const getExchangeBadge = (item: any) => {
    switch (item.exchangeType) {
      case 'giveaway':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">🎁 Free Giveaway</span>;
      case 'paid':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">₹{item.price || 0} Buy</span>;
      case 'borrow':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">⏳ Borrow</span>;
      case 'skill_swap':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">🤝 Skill Swap</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">🔄 Item Swap</span>;
    }
  };

  return (
    <div className="space-y-10 pb-12">
      
      {/* Personalized Welcome Header */}
      <section className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 shadow-xs relative overflow-hidden transition-colors">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200/70 dark:border-rose-850 text-xs font-bold text-rose-700 dark:text-rose-300">
            <span>✨ SRM Kattankulathur Campus Hub Active</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">👋</span>
            <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-stone-900 dark:text-white">
              Hey, {firstName}!
            </h1>
          </div>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-medium">
            What can we help you find, borrow, trade, or exchange on campus today?
          </p>

          {/* Large Natural-Language Search Box */}
          <div className="pt-2">
            <div className="p-2 sm:p-2.5 bg-stone-50 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 rounded-3xl shadow-lg shadow-rose-950/5 dark:shadow-none flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-400 to-orange-400 flex items-center justify-center text-white shrink-0 ml-1">
                <Sparkles className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="dashboard-nl-search"
                value={nlQuery}
                onChange={e => setNlQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && nlQuery.trim()) {
                    setActiveTab('smartmatch');
                  }
                }}
                placeholder="Try: I need a DSA book and someone who can help me with graphs..."
                className="w-full text-xs sm:text-sm text-stone-800 dark:text-white outline-hidden bg-transparent placeholder:text-stone-400 dark:placeholder:text-stone-500 font-medium px-2"
              />
              <button
                onClick={() => setActiveTab('smartmatch')}
                className="px-5 py-2.5 rounded-full bg-stone-900 dark:bg-rose-500 text-white font-bold text-xs sm:text-sm shrink-0 hover:bg-rose-600 dark:hover:bg-rose-600 transition-colors shadow-2xs"
              >
                SmartMatch ✨
              </button>
            </div>
          </div>
        </div>

        {/* Decorative subtle geometric background accent */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-rose-100/60 to-orange-100/40 dark:from-rose-950/20 dark:to-orange-950/10 rounded-full blur-3xl" />
      </section>

      {/* Main Geometric Action Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* I NEED */}
        <div
          onClick={() => {
            setCreateListingDefaultType('need');
            setCreateListingOpen(true);
          }}
          className="p-6 rounded-[2.2rem] bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 shadow-xs hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer space-y-3 group text-left"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white font-display">
              🔍 I NEED
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1 leading-snug">
              Looking for a textbook, exam calculator, notes, or turf gear.
            </p>
          </div>
        </div>

        {/* I CAN OFFER */}
        <div
          onClick={() => {
            setCreateListingDefaultType('offer');
            setCreateListingOpen(true);
          }}
          className="p-6 rounded-[2.2rem] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 shadow-xs hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all cursor-pointer space-y-3 group text-left"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white font-display">
              🤝 I CAN OFFER
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1 leading-snug">
              Share books, rent sports gear, or teach a skill to campus peers.
            </p>
          </div>
        </div>

        {/* SMART MATCHES */}
        <div
          onClick={() => setActiveTab('smartmatch')}
          className="p-6 rounded-[2.2rem] bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 shadow-xs hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800 transition-all cursor-pointer space-y-3 group text-left"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white font-display">
              ✨ SMART MATCHES
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1 leading-snug">
              AI finds compatible students matching your courses and gear needs.
            </p>
          </div>
        </div>

        {/* GIVE IT FORWARD */}
        <div
          onClick={() => setActiveTab('giveaway')}
          className="p-6 rounded-[2.2rem] bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 shadow-xs hover:shadow-md hover:border-rose-200 dark:hover:border-rose-800 transition-all cursor-pointer space-y-3 group text-left"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white font-display">
              🎁 GIVE IT FORWARD
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1 leading-snug">
              100% free gifts, hostel supplies, and exam revision guides.
            </p>
          </div>
        </div>

      </section>

      {/* Recommended for you */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white font-display">
              Recommended for you
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Because you're in {currentUser.department.split('&')[0]} ({currentUser.year})
            </p>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:underline"
          >
            Explore all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendedListings.map(item => {
            const isSaved = savedListingIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200/80 dark:border-stone-800 p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    {getExchangeBadge(item)}
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400 dark:text-stone-500 text-[11px] font-medium">{item.createdAt}</span>
                      <button
                        onClick={() => toggleSaveListing(item.id)}
                        className={`p-1 rounded-full transition-colors ${
                          isSaved ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/60' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                        }`}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-2 leading-snug font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 font-medium">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={item.ownerAvatar} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700" />
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{item.ownerName}</span>
                  </div>
                  <button
                    onClick={() => setConnectModalTarget({ listing: item })}
                    className="px-4 py-2 rounded-full bg-stone-900 dark:bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors shadow-2xs"
                  >
                    Connect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Nearby on campus */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white font-display">
              Nearby around SRM Kattankulathur
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Pickups happening around Central Library, Java Canteen, Tech Park & Indoor Stadium
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {nearbyListings.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200/80 dark:border-stone-800 p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate max-w-[140px]">{item.campusZone.split('&')[0]}</span>
                  </div>
                  {getExchangeBadge(item)}
                </div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-2 leading-snug font-display">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 font-medium">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">{item.ownerName}</span>
                <button
                  onClick={() => setConnectModalTarget({ listing: item })}
                  className="px-4 py-2 rounded-full bg-stone-900 dark:bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors shadow-2xs"
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

