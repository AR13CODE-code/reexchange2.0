import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  Bookmark, 
  BookmarkCheck, 
  MapPin, 
  UserCheck, 
  PlusCircle, 
  Tag, 
  Sparkles, 
  Flag,
  Trash2,
  BookOpen,
  Laptop,
  FileText,
  Brain,
  Gift,
  Home,
  Palette,
  Ticket,
  Dumbbell
} from 'lucide-react';
import { motion } from 'motion/react';
import { ItemCategory, Listing, SRM_CAMPUS_LOCATIONS } from '../types';

export const ExploreView: React.FC = () => {
  const { 
    listings, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    selectedListingType, 
    setSelectedListingType,
    selectedExchangeType,
    setSelectedExchangeType,
    savedListingIds,
    toggleSaveListing,
    setConnectModalTarget,
    setCreateListingOpen,
    setCreateListingDefaultType,
    setReportModalTarget,
    currentUser,
    deleteListing
  } = useApp();

  const [selectedZone, setSelectedZone] = useState('all');

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Items', icon: Sparkles },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'electronics', label: 'Electronics', icon: Laptop },
    { id: 'sports', label: 'Sports & Turf', icon: Dumbbell },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'skills', label: 'Skills & Tutoring', icon: Brain },
    { id: 'opportunities', label: 'Hackathons & Clubs', icon: Ticket },
    { id: 'hostel', label: 'Hostel & Living', icon: Home },
    { id: 'free', label: 'Free Giveaway', icon: Gift },
  ];

  const campusZones = [
    'all',
    'Java Canteen',
    'Tech Park',
    'University Building',
    'Central Library',
    'Sports Complex',
    'Hostel',
    'Potheri Gate'
  ];

  // Filtering
  const filteredListings = listings.filter(item => {
    if (selectedListingType !== 'all' && item.type !== selectedListingType) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedExchangeType !== 'all' && item.exchangeType !== selectedExchangeType) return false;
    if (selectedZone !== 'all' && !item.campusZone.toLowerCase().includes(selectedZone.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
      const matchOwner = item.ownerName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTags && !matchOwner) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-200/80 dark:border-stone-800 shadow-xs p-6 sm:p-8 space-y-5 transition-colors">
        <div className="flex flex-col md:flex-row gap-3.5 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:max-w-xl">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="explore-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SRM campus (e.g. calculator, badminton racket, Java notes, Figma tutoring)"
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900 outline-hidden text-sm sm:text-base text-stone-800 dark:text-stone-100 font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Listing Type Toggle */}
          <div className="flex items-center gap-1.5 p-1.5 bg-stone-100/80 dark:bg-stone-800/80 rounded-full w-full md:w-auto justify-center border border-stone-200/60 dark:border-stone-700">
            {[
              { id: 'all', label: 'Everything' },
              { id: 'offer', label: '🤝 Offers' },
              { id: 'need', label: '🔍 Needs' },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedListingType(type.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedListingType === type.id
                    ? 'bg-stone-900 dark:bg-rose-500 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

        </div>

        {/* Category Horizontal Scroll Chips */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200 dark:shadow-rose-950/50'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200/70 dark:border-stone-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-stone-500 dark:text-stone-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Zone & Exchange Type Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
          {/* Exchange Type Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="font-bold text-stone-400 dark:text-stone-500 shrink-0">Model:</span>
            {[
              { id: 'all', label: 'All Modes' },
              { id: 'giveaway', label: '🎁 Free' },
              { id: 'sell', label: '💰 Sell (₹)' },
              { id: 'borrow', label: '⏱️ Lend' },
              { id: 'swap', label: '🔄 Swap' },
              { id: 'skill_swap', label: '🤝 Skill' },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedExchangeType(type.id)}
                className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors shrink-0 ${
                  selectedExchangeType === type.id
                    ? 'bg-rose-500 text-white shadow-2xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-stone-400 dark:text-stone-500">SRM Hub:</span>
            {campusZones.map(zone => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-3 py-1 rounded-full font-bold transition-colors ${
                  selectedZone === zone
                    ? 'bg-stone-900 dark:bg-rose-500 text-white shadow-2xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {zone === 'all' ? 'All SRM Hubs' : zone}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredListings.map(item => {
            const isSaved = savedListingIds.includes(item.id);
            const isOwner = item.ownerId === currentUser.id;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Optional Image */}
                {item.imageUrl ? (
                  <div className="h-44 w-full overflow-hidden relative bg-stone-100 dark:bg-stone-800">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs ${
                        item.type === 'offer' ? 'bg-emerald-600 text-white' : 'bg-stone-900 text-white'
                      }`}>
                        {item.type === 'offer' ? 'Offering' : 'Seeking'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => toggleSaveListing(item.id)}
                        className="p-2 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-700 dark:text-stone-200 hover:text-rose-500 shadow-xs active:scale-95 transition-all"
                        title={isSaved ? "Saved" : "Save item"}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-rose-500 fill-rose-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 dark:bg-stone-900/95 backdrop-blur-md text-stone-900 dark:text-white shadow-2xs">
                        {item.exchangeType === 'giveaway' 
                          ? '🎁 Free Gift' 
                          : item.exchangeType === 'sell' 
                          ? `💰 ₹${item.price ?? 0}${item.priceNegotiable ? ' (Neg.)' : ''}`
                          : item.exchangeType === 'borrow'
                          ? `⏱️ ${item.lendDuration || 'Lend'}`
                          : item.exchangeType === 'skill_swap' 
                          ? '🤝 Skill Swap' 
                          : '🔄 Exchange'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/60 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.type === 'offer' ? 'bg-emerald-600 text-white' : 'bg-stone-900 text-white'
                      }`}>
                        {item.type === 'offer' ? 'Offering' : 'Seeking'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200">
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
                    <button
                      onClick={() => toggleSaveListing(item.id)}
                      className="p-1.5 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-rose-500 border border-stone-200 dark:border-stone-700"
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4 text-rose-500 fill-rose-500" /> : <Bookmark className="w-4 h-4 text-stone-500" />}
                    </button>
                  </div>
                )}

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium">
                      <span className="font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900">{item.category}</span>
                      <span>{item.createdAt}</span>
                    </div>

                    <h3 className="font-black text-sm text-stone-900 dark:text-white line-clamp-2 leading-snug font-display">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed font-medium">
                      {item.description}
                    </p>

                    {item.lookingFor && (
                      <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 text-[11px] text-stone-700 dark:text-stone-300 font-medium">
                        <span className="font-bold text-stone-900 dark:text-white">Exchange / Price: </span>
                        <span>{item.lookingFor}</span>
                      </div>
                    )}

                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Owner info & Connect Trigger */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={item.ownerAvatar} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700" />
                        <div>
                          <p className="text-xs font-bold text-stone-800 dark:text-stone-200 leading-tight">{item.ownerName}</p>
                          <p className="text-[10px] text-stone-400 font-medium">{item.ownerDept.split(' ')[0]} • {item.ownerYear}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-stone-500 dark:text-stone-400 font-medium flex items-center gap-0.5 justify-end">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span className="truncate max-w-[80px]">{item.campusZone.split('&')[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isOwner ? (
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to remove your listing?")) {
                              deleteListing(item.id);
                            }
                          }}
                          className="w-full py-2 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete My Listing</span>
                        </button>
                      ) : (
                        <>
                          <button
                            id={`explore-connect-${item.id}`}
                            onClick={() => setConnectModalTarget({ listing: item })}
                            className="flex-1 py-2.5 rounded-full bg-stone-900 dark:bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-2xs"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-rose-300 dark:text-white" />
                            <span>Connect</span>
                          </button>
                          
                          <button
                            onClick={() => setReportModalTarget({ listingId: item.id, title: item.title })}
                            className="p-2.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            title="Report item"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-200/80 dark:border-stone-800 p-8 sm:p-14 text-center space-y-4 max-w-lg mx-auto shadow-xs transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl">
            👀
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-stone-900 dark:text-white font-display">
              Your campus is quiet... for now 👀
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium leading-relaxed">
              We couldn't find items matching your current filters. Be the pioneer to share or request something in this category at SRM!
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedListingType('all');
                setSelectedExchangeType('all');
                setSearchQuery('');
                setSelectedZone('all');
              }}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
            >
              Reset Filters
            </button>
            <button
              onClick={() => {
                setCreateListingDefaultType('offer');
                setCreateListingOpen(true);
              }}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-200 dark:shadow-none"
            >
              Share Something
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

