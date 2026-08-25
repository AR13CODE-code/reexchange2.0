import React from 'react';
import { useApp } from '../context/AppContext';
import { Gift, Heart, Sparkles, PlusCircle, MapPin, UserCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const GiveItForwardView: React.FC = () => {
  const { 
    listings, 
    setConnectModalTarget, 
    setCreateListingOpen, 
    setCreateListingDefaultType 
  } = useApp();

  const giveaways = listings.filter(l => l.exchangeType === 'giveaway' || l.category === 'free');

  return (
    <div className="space-y-10 pb-12">
      
      {/* Header Banner */}
      <div className="bg-stone-900 dark:bg-stone-950 border border-stone-800 rounded-[2.5rem] text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-md">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800/80 border border-stone-700 text-xs font-bold text-rose-300">
            <Heart className="w-3.5 h-3.5 fill-rose-300" />
            <span>Circular Campus Economy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
            Give It Forward 🎁
          </h1>
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-medium">
            "Someone at SRM might need this." Pass on your old textbooks, lab coats, drafters, hostel essentials, and calculators for free.
          </p>

          <div className="pt-2">
            <button
              id="giveaway-share-button"
              onClick={() => {
                setCreateListingDefaultType('offer');
                setCreateListingOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-rose-500 text-white font-black text-sm sm:text-base shadow-md hover:bg-rose-600 active:scale-98 transition-all"
            >
              <Gift className="w-5 h-5 text-white" />
              <span>Share a Free Item</span>
            </button>
          </div>
        </div>

        {/* Subtle geometric backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Giveaway Listings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white font-display">
              Free Items Available Now
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
              100% free gifts from fellow SRM students.
            </p>
          </div>
          <span className="text-xs font-bold px-3.5 py-1 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-full border border-stone-300 dark:border-stone-700">
            {giveaways.length} Free Items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {giveaways.map(item => (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className="bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              {item.imageUrl && (
                <div className="h-44 w-full relative bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-2xs">
                    🎁 100% Free Gift
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium">
                    <span className="font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider">{item.category}</span>
                    <span>{item.createdAt}</span>
                  </div>

                  <h3 className="font-bold text-base text-stone-900 dark:text-white line-clamp-2 leading-snug font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={item.ownerAvatar} alt="" className="w-6 h-6 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700" />
                      <span className="font-semibold text-stone-700 dark:text-stone-300">{item.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-stone-400 font-medium">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{item.campusZone.split('&')[0]}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setConnectModalTarget({ listing: item })}
                    className="w-full py-2.5 rounded-full bg-stone-900 dark:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-600 active:scale-95 transition-all shadow-2xs"
                  >
                    <UserCheck className="w-4 h-4 text-rose-300 dark:text-white" />
                    <span>Claim or Request Pickup</span>
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};


