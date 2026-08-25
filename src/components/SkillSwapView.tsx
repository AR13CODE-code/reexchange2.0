import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeftRight, 
  Sparkles, 
  Brain, 
  PlusCircle, 
  UserCheck, 
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

export const SkillSwapView: React.FC = () => {
  const { 
    skillSwapPairs, 
    setConnectModalTarget, 
    setCreateListingOpen, 
    setCreateListingDefaultType,
    currentUser,
    listings,
    isLoggedIn,
    setLoginModalOpen,
    setAuthModalMode
  } = useApp();

  // Filter skills offered across active campus listings
  const skillListings = listings.filter(l => l.category === 'skills' || l.exchangeType === 'skill_swap');

  return (
    <div className="space-y-12 pb-12">
      
      {/* Header */}
      <div className="text-center space-y-3 pt-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold">
          <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
          <span>Exchange Knowledge, Tutoring & Sparring • No Money Required</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
          SRM Skill Swap <span className="text-emerald-400">🤝</span>
        </h1>
        <p className="text-sm sm:text-base text-stone-300 font-medium">
          Trade what you're good at for what you want to learn. DSA, Badminton technique, CAD design, Python, Guitar, or Exam Prep — SRM students helping students.
        </p>
      </div>

      {/* Featured AI Mutual Synergy Matches */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              ✨ Potential Skill Swaps Discovered
            </h2>
          </div>
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
            className="text-xs sm:text-sm font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-950/60 border border-emerald-800 transition-colors shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post your Skill Swap</span>
          </button>
        </div>

        {/* Mutual Swap Grid */}
        {skillSwapPairs.length === 0 ? (
          <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-3xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
              🤝
            </div>
            <h3 className="text-lg font-bold text-white">No Skill Swaps Listed Yet</h3>
            <p className="text-xs sm:text-sm text-stone-400">
              Be the first SRM student to offer your skill! For example, offer Python or UI design in exchange for DSA tutoring or sports sparring.
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
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md cursor-pointer"
            >
              Offer a Skill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {skillSwapPairs.map((pair) => (
              <motion.div
                key={pair.id}
                whileHover={{ y: -3 }}
                className="bg-stone-900 rounded-[2.2rem] border border-stone-800 shadow-xl p-7 space-y-5 relative overflow-hidden transition-colors"
              >
                {/* Category & Synergy Score Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                    {pair.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-stone-200 bg-stone-800 px-3 py-1 rounded-full border border-stone-700">
                    <Zap className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    {pair.matchScore}% Synergy Match
                  </span>
                </div>

                {/* Student A ↔ Student B Dual Visual Exchange */}
                <div className="bg-stone-950/70 rounded-2xl p-5 border border-stone-800">
                  <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center text-center sm:text-left">
                    
                    {/* Student A */}
                    <div className="sm:col-span-3 space-y-2">
                      <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                        <img src={pair.userA.avatar} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-stone-700" />
                        <div>
                          <p className="font-bold text-xs text-white leading-tight">{pair.userA.name}</p>
                          <p className="text-[10px] text-stone-400 font-medium">{pair.userA.year} • {pair.userA.dept}</p>
                        </div>
                      </div>
                      <div className="bg-stone-900 p-3 rounded-2xl border border-stone-800 text-xs space-y-1.5">
                        <p className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">Offers:</p>
                        <p className="font-bold text-stone-200 text-xs">{pair.userA.offers}</p>
                        <p className="text-[11px] font-black text-rose-400 uppercase tracking-wider pt-1.5 border-t border-stone-800">Needs:</p>
                        <p className="text-stone-400 text-xs font-medium">{pair.userA.needs}</p>
                      </div>
                    </div>

                    {/* Center Swap Arrow */}
                    <div className="sm:col-span-1 flex flex-col items-center justify-center py-2">
                      <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                        <ArrowLeftRight className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Student B */}
                    <div className="sm:col-span-3 space-y-2">
                      <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                        <img src={pair.userB.avatar} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-stone-700" />
                        <div>
                          <p className="font-bold text-xs text-white leading-tight">{pair.userB.name}</p>
                          <p className="text-[10px] text-stone-400 font-medium">{pair.userB.year} • {pair.userB.dept}</p>
                        </div>
                      </div>
                      <div className="bg-stone-900 p-3 rounded-2xl border border-stone-800 text-xs space-y-1.5">
                        <p className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">Offers:</p>
                        <p className="font-bold text-stone-200 text-xs">{pair.userB.offers}</p>
                        <p className="text-[11px] font-black text-rose-400 uppercase tracking-wider pt-1.5 border-t border-stone-800">Needs:</p>
                        <p className="text-stone-400 text-xs font-medium">{pair.userB.needs}</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* AI Synergy Reasoning */}
                <div className="p-3.5 bg-rose-950/40 rounded-2xl border border-rose-900 text-xs space-y-1">
                  <p className="font-bold text-rose-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    <span>Why you can help each other:</span>
                  </p>
                  <p className="text-rose-200 leading-relaxed font-medium">
                    "{pair.reason}"
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    id={`skillswap-connect-${pair.id}`}
                    onClick={() => {
                      const otherUser = currentUser && pair.userA.id === currentUser.id ? pair.userB : pair.userA;
                      setConnectModalTarget({ 
                        customTitle: `Skill Swap: ${pair.userA.offers} ↔ ${pair.userB.offers}`,
                        user: {
                          id: otherUser.id,
                          name: otherUser.name,
                          avatarUrl: otherUser.avatar,
                          department: otherUser.dept
                        }
                      });
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-white" />
                    <span>Send Connection Request</span>
                  </button>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Individual Skill Offers from Active Campus Listings */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              All Skills & Tutoring Offered on SRM Campus
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-medium">
              Directly connect with peers offering tutoring, coding, UI design, badminton sparring, and lab help.
            </p>
          </div>
        </div>

        {skillListings.length === 0 ? (
          <div className="p-6 rounded-2xl border border-stone-800 bg-stone-900/40 text-stone-400 text-center text-xs">
            No individual skill postings yet. Post your skill offering to appear here!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skillListings.map(item => (
              <div
                key={item.id}
                className="bg-stone-900 rounded-[2rem] border border-stone-800 p-6 space-y-4 shadow-xl hover:border-stone-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                      🧠 Skill Offering
                    </span>
                    <span className="text-[11px] text-stone-400 font-medium">{item.createdAt}</span>
                  </div>

                  <h3 className="font-bold text-sm text-white leading-snug font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed line-clamp-3 font-medium">
                    {item.description}
                  </p>

                  {item.lookingFor && (
                    <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs">
                      <span className="font-bold text-white">Looking for in return: </span>
                      <span className="text-stone-300 font-medium">{item.lookingFor}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={item.ownerAvatar} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-700" />
                    <div>
                      <p className="text-xs font-bold text-stone-200 leading-tight">{item.ownerName}</p>
                      <p className="text-[10px] text-stone-400 font-medium">{item.ownerDept.split(' ')[0]}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setConnectModalTarget({ listing: item })}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white active:scale-95 transition-colors shadow-md cursor-pointer"
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
