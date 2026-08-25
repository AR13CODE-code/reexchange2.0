import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Handshake, 
  Sparkles, 
  BookOpen, 
  Laptop, 
  FileText, 
  Brain, 
  Ticket, 
  Gift, 
  HeartHandshake, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Activity,
  Dumbbell,
  Trophy,
  PlusCircle,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingHero: React.FC = () => {
  const { 
    setActiveTab, 
    setCreateListingOpen, 
    setCreateListingDefaultType,
    setSelectedCategory,
    setSelectedLocation,
    listings,
    tournaments,
    impactStats,
    setConnectModalTarget,
    isLoggedIn,
    setLoginModalOpen,
    setAuthModalMode
  } = useApp();

  const exchangeCategories = [
    { id: 'books', label: 'Books & Materials', icon: BookOpen, color: 'from-blue-500/10 to-indigo-500/10 text-indigo-400 border-indigo-500/30' },
    { id: 'electronics', label: 'Electronics & Lab', icon: Laptop, color: 'from-purple-500/10 to-pink-500/10 text-purple-400 border-purple-500/30' },
    { id: 'notes', label: 'Notes & Exam Prep', icon: FileText, color: 'from-amber-500/10 to-orange-500/10 text-amber-400 border-amber-500/30' },
    { id: 'skills', label: 'Skills & Tutoring', icon: Brain, color: 'from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/30' },
    { id: 'sports', label: 'Sports & Gear', icon: Dumbbell, color: 'from-rose-500/10 to-red-500/10 text-rose-400 border-rose-500/30' },
    { id: 'opportunities', label: 'Hackathons & Clubs', icon: Ticket, color: 'from-violet-500/10 to-cyan-500/10 text-violet-400 border-violet-500/30' },
    { id: 'free', label: 'Giveaways / Free', icon: Gift, color: 'from-orange-500/10 to-amber-500/10 text-orange-400 border-orange-500/30' },
  ];

  const popularListings = listings.slice(0, 4);
  const featuredTournaments = tournaments.slice(0, 2);

  const campusHubs = [
    'Tech Park',
    'BEL Lab',
    'University Building',
    'Central Library',
    'N Block Hostel',
    'Java Canteen',
    'Vendhat Square'
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      
      {/* Top Banner Hero with Cinematic Dark Aesthetics & Warm Accents */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-16 px-6 sm:px-10 lg:px-12 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 rounded-[2.5rem] sm:rounded-[3rem] border border-stone-800 shadow-2xl transition-colors">
        
        {/* Ambient Depth Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-7 relative z-10">
          
          {/* Campus Tag Pill */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-300 shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>"Exchange more than things."</span>
            <span className="text-rose-500">•</span>
            <span className="text-stone-300 font-semibold">SRM IST Kattankulathur</span>
          </motion.div>

          {/* Main Title & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-display leading-[1.1]">
              Students helping students <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-300 to-amber-400">
                across SRM Campus
              </span>
            </h1>
            <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Share textbooks, lab equipment, notes, and skills. Participate in sports leagues, find hackathon teammates, and build real connections at SRM KTR.
            </p>
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1"
          >
            <button
              id="hero-need-button"
              onClick={() => {
                if (!isLoggedIn) {
                  setAuthModalMode('register');
                  setLoginModalOpen(true);
                  return;
                }
                setCreateListingDefaultType('need');
                setCreateListingOpen(true);
              }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-stone-800 hover:bg-stone-700 text-white font-bold text-sm sm:text-base border border-stone-700 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-rose-400" />
              <span>I NEED SOMETHING</span>
            </button>

            <button
              id="hero-offer-button"
              onClick={() => {
                if (!isLoggedIn) {
                  setAuthModalMode('register');
                  setLoginModalOpen(true);
                  return;
                }
                setCreateListingDefaultType('offer');
                setCreateListingOpen(true);
              }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-950/60 active:scale-95 transition-all cursor-pointer"
            >
              <Handshake className="w-4 h-4 text-white" />
              <span>I CAN OFFER SOMETHING</span>
            </button>

            <button
              id="hero-tournaments-button"
              onClick={() => setActiveTab('tournaments')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-amber-300 border border-amber-500/30 font-bold text-sm sm:text-base active:scale-95 transition-all cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>CAMPUS TOURNAMENTS</span>
            </button>
          </motion.div>

          {/* AI SmartMatch Natural-Language Search Box */}
          <div 
            onClick={() => setActiveTab('smartmatch')}
            className="mt-6 max-w-2xl mx-auto p-2 sm:p-2.5 bg-stone-950/80 border border-stone-800 rounded-3xl shadow-xl hover:border-rose-500/60 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 pl-3 sm:pl-4 text-left">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm text-stone-300 font-medium truncate max-w-[280px] sm:max-w-md">
                Ask AI: "I need an EG drafter & someone to teach me DSA trees near Tech Park..."
              </span>
            </div>
            <span className="px-4 py-2 rounded-full bg-rose-500 text-white font-bold text-xs shrink-0 group-hover:bg-rose-600 transition-colors shadow-md shadow-rose-950/50">
              SmartMatch ✨
            </span>
          </div>

          {/* Campus Hubs Quick Filter */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-500" />
              SRM Campus Hubs:
            </span>
            {campusHubs.map(hub => (
              <button
                key={hub}
                onClick={() => {
                  setSelectedLocation(hub);
                  setActiveTab('explore');
                }}
                className="px-3 py-1 rounded-full text-[11px] font-semibold bg-stone-800 text-stone-300 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-800 border border-stone-700 transition-colors cursor-pointer"
              >
                {hub}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Featured Tournaments Section if any */}
      {featuredTournaments.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                Active Campus Leagues & Tournaments
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('tournaments')}
              className="text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Leagues</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredTournaments.map(t => (
              <div
                key={t.id}
                onClick={() => setActiveTab('tournaments')}
                className="p-5 rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      {t.sport.toUpperCase()} • {t.teamFormat}
                    </span>
                    <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors mt-2">
                      {t.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-800">
                    {t.prizePool || 'Trophy'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {t.venue}
                  </span>
                  <span className="flex items-center gap-1 text-stone-300 font-bold">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    {t.registeredTeamsCount} / {t.maxTeams} Teams
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* "What can you exchange?" Category Tiles */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              What can you exchange?
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-medium">
              Everything from lab kits and sports equipment to design mentorship on your campus.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs sm:text-sm font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
          >
            <span>See all categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {exchangeCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveTab('explore');
                }}
                className="p-4 sm:p-5 rounded-[2rem] bg-stone-900 border border-stone-800 hover:border-rose-500/50 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col items-center text-center gap-2.5 sm:gap-3 group"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-stone-800 border border-stone-700 text-rose-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-md">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold leading-tight text-stone-200 group-hover:text-white">
                  {cat.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* "Popular around campus" Listings Preview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                Popular around campus
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 font-medium">
              Resources, gear, and skills students are sharing right now at SRM.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs sm:text-sm font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Browse all listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {popularListings.length === 0 ? (
          <div className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-3xl">
              📦
            </div>
            <h3 className="text-lg font-bold text-white">No Listings Yet</h3>
            <p className="text-xs sm:text-sm text-stone-400">
              The marketplace starts clean! Create your real SRM profile and be the first to list a textbook, drafter, calculator, or skill swap.
            </p>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setAuthModalMode('register');
                  setLoginModalOpen(true);
                  return;
                }
                setCreateListingDefaultType('offer');
                setCreateListingOpen(true);
              }}
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-all shadow-md shadow-rose-950/60 cursor-pointer"
            >
              Post First Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {popularListings.map(item => (
              <div
                key={item.id}
                className="bg-stone-900 rounded-[2rem] border border-stone-800 shadow-xl hover:border-stone-700 transition-all flex flex-col overflow-hidden group"
              >
                {item.imageUrl && (
                  <div className="h-40 w-full overflow-hidden relative bg-stone-800">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${
                        item.type === 'offer' 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-stone-900 text-white border border-stone-700'
                      }`}>
                        {item.type === 'offer' ? 'Offering' : 'Seeking'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-900/90 backdrop-blur-md text-white border border-stone-700 shadow-md">
                        {item.exchangeType === 'giveaway' 
                          ? '🎁 Free' 
                          : item.exchangeType === 'sell' 
                          ? `💰 ₹${item.price ?? 0}`
                          : item.exchangeType === 'borrow' 
                          ? `⏱️ ${item.lendDuration || 'Lend'}`
                          : item.exchangeType === 'skill_swap' 
                          ? '🤝 Skill' 
                          : '🔄 Swap'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-2 font-medium">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-stone-800">
                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <div className="flex items-center gap-2 truncate">
                        <img src={item.ownerAvatar} alt="" className="w-6 h-6 rounded-full object-cover ring-1 ring-stone-700" />
                        <span className="font-bold text-stone-200 truncate">{item.ownerName}</span>
                      </div>
                      <span className="shrink-0 font-medium">{item.ownerDept.split(' ')[0]}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-[10px] text-stone-400 font-medium truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{item.campusZone.split('&')[0]}</span>
                      </div>
                      <button
                        onClick={() => setConnectModalTarget({ listing: item })}
                        className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-colors shrink-0 cursor-pointer"
                      >
                        Connect
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How RExchange Works 4-Step Flow */}
      <section className="bg-stone-900 text-white rounded-[2.5rem] sm:rounded-[3rem] border border-stone-800 p-8 sm:p-12 space-y-8 shadow-2xl">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Simple 4-Step Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display">
            How RExchange Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            Designed for SRM students to collaborate without awkward negotiations or transaction fees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { step: '01', title: 'Post What You Need / Have', desc: 'List a resource or tell the community what study material you are seeking.', icon: Search },
            { step: '02', title: 'Smart Matchmaking', desc: 'AI scans SRM student needs, skills, and offerings in real-time.', icon: Sparkles },
            { step: '03', title: 'Connect Safely', desc: 'Chat and coordinate handover locations on campus without spam.', icon: HeartHandshake },
            { step: '04', title: 'Exchange & Win', desc: 'Meet at Java Canteen, Library, or Tech Park to exchange, learn, or play.', icon: Zap },
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="bg-stone-950/70 border border-stone-800 rounded-3xl p-6 space-y-3 relative group hover:border-rose-500/60 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-rose-400 font-display">{s.step}</span>
                  <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-rose-300">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-bold text-sm text-white">{s.title}</h3>
                <p className="text-xs text-stone-400 leading-relaxed font-medium">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Community Impact Statistics */}
      <section className="bg-stone-900 border border-stone-800 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-white font-display flex items-center gap-2">
              <span>Campus Community Impact</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">Live Campus Stats</span>
            </h3>
            <p className="text-xs text-stone-400 font-medium">
              Measuring resources saved, skills exchanged, and connections forged at SRM IST Kattankulathur.
            </p>
          </div>
          <span className="text-[11px] text-stone-500 font-medium">
            *Updated dynamically with each exchange
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="bg-stone-950/60 p-5 rounded-3xl border border-stone-800">
            <p className="text-2xl sm:text-3xl font-black text-rose-400 font-display">
              {impactStats.resourcesShared.toLocaleString()}
            </p>
            <p className="text-xs font-bold text-stone-300 mt-1">Resources Shared</p>
          </div>

          <div className="bg-stone-950/60 p-5 rounded-3xl border border-stone-800">
            <p className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
              {impactStats.skillExchanges.toLocaleString()}
            </p>
            <p className="text-xs font-bold text-stone-300 mt-1">Skill Exchanges</p>
          </div>

          <div className="bg-stone-950/60 p-5 rounded-3xl border border-stone-800">
            <p className="text-2xl sm:text-3xl font-black text-purple-400 font-display">
              {impactStats.studentConnections.toLocaleString()}
            </p>
            <p className="text-xs font-bold text-stone-300 mt-1">Student Connections</p>
          </div>

          <div className="bg-stone-950/60 p-5 rounded-3xl border border-stone-800">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-display">
              ₹{(impactStats.estimatedValueSaved / 1000).toFixed(0)}k+
            </p>
            <p className="text-xs font-bold text-stone-300 mt-1">Estimated Reused Value</p>
          </div>
        </div>
      </section>

    </div>
  );
};
