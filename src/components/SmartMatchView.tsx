import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Search, 
  Send, 
  Loader2, 
  UserCheck, 
  CheckCircle2, 
  MapPin, 
  BookOpen, 
  Brain, 
  Tag, 
  ArrowRight,
  PlusCircle,
  HelpCircle,
  Zap,
  Dumbbell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SmartMatchResult } from '../types';

export const SmartMatchView: React.FC = () => {
  const { 
    runSmartMatch, 
    setConnectModalTarget, 
    setCreateListingOpen, 
    setCreateListingDefaultType 
  } = useApp();

  const [query, setQuery] = useState(
    'I am a second year CSE student preparing for placements. I need a DSA book and someone who can help me understand graphs.'
  );
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SmartMatchResult[] | null>(null);
  const [extractedIntent, setExtractedIntent] = useState<any>(null);
  const [noMatchAdvice, setNoMatchAdvice] = useState<string | null>(null);

  const samplePrompts = [
    {
      label: "🎯 Placement & DSA Prep",
      text: "I am a second year CSE student preparing for placements. I need a DSA book and someone who can help me understand graphs."
    },
    {
      label: "🏸 Badminton Sparring & Racket",
      text: "Looking to borrow a Yonex badminton racket for today's match at SRM Indoor Stadium and find a sparring partner."
    },
    {
      label: "📐 Urgent Exam Calculator",
      text: "Need a Casio FX scientific calculator for tomorrow's calculus semester final exam."
    },
    {
      label: "🎨 Presentation & Figma Design",
      text: "Looking for someone skilled in Figma or Canva to polish my pitch deck in exchange for Python coding help."
    },
    {
      label: "🎁 Hostel Giveaway & Kettle",
      text: "Moving into hostel and looking for free giveaway essentials like an electric kettle or notes."
    }
  ];

  const handleSearch = async (promptText?: string) => {
    const textToSearch = promptText || query;
    if (!textToSearch.trim()) return;

    setLoading(true);
    setResults(null);
    setExtractedIntent(null);
    setNoMatchAdvice(null);

    try {
      const response = await runSmartMatch(textToSearch);
      setResults(response.matches || []);
      setExtractedIntent(response.extractedIntent || null);
      setNoMatchAdvice(response.noMatchAdvice || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-850 text-rose-700 dark:text-rose-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Gemini AI Matchmaker for SRM Kattankulathur</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-display tracking-tight">
          SmartMatch <span className="text-rose-600 dark:text-rose-400">AI</span>
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto font-medium">
          Describe what you're looking for in your own words. Rex and Gemini AI will match you with real campus peers, sports equipment, study materials, and skill swaps.
        </p>
      </div>

      {/* Natural Language Search Input Box */}
      <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-200/80 dark:border-stone-800 shadow-xs p-6 sm:p-8 space-y-5 transition-colors">
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
            <span>What do you need or want to learn?</span>
            <span className="text-stone-400 dark:text-stone-500 font-medium text-[11px]">Speaks natural student language</span>
          </label>
          <div className="relative">
            <textarea
              id="smartmatch-input"
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. I am a 2nd year student needing a DSA book and someone to tutor graph algorithms..."
              className="w-full p-4 text-sm sm:text-base rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900 outline-hidden transition-all resize-none text-stone-800 dark:text-white font-medium"
            />
          </div>
        </div>

        {/* Quick Sample Prompts */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            Try instant SRM scenarios:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(p.text);
                  handleSearch(p.text);
                }}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-stone-50 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-900 dark:hover:text-rose-200 border border-stone-200/70 dark:border-stone-700 transition-all text-stone-700 dark:text-stone-300 active:scale-95"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trigger Button */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
          <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-rose-500" />
            <span>Searches live active campus database</span>
          </div>

          <button
            id="smartmatch-submit-button"
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-200 dark:shadow-none active:scale-98 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning Campus...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Find Matches</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading state animation */}
      {loading && (
        <div className="text-center py-12 space-y-3 bg-white dark:bg-stone-900 rounded-[2.5rem] border border-dashed border-rose-200 dark:border-rose-800 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto animate-bounce">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-800 dark:text-stone-200 font-display">
            Checking what SRM campus has to offer...
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto font-medium">
            Extracting skills, category relevance, and student availability at SRM IST.
          </p>
        </div>
      )}

      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Extracted Intent Summary */}
            {extractedIntent && (
              <div className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-950 dark:text-rose-200">AI Intent Detected:</span>
                  <span className="bg-white dark:bg-stone-800 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800 font-bold text-rose-800 dark:text-rose-300">
                    Category: {extractedIntent.suggestedCategory || 'Academic'}
                  </span>
                  {extractedIntent.urgency === 'high' && (
                    <span className="bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-bold">
                      ⚡ Urgent Need
                    </span>
                  )}
                </div>
                <span className="text-rose-700 dark:text-rose-300 font-medium">
                  {results.length} intelligent {results.length === 1 ? 'match' : 'matches'} discovered
                </span>
              </div>
            )}

            {/* Match Cards */}
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result, idx) => {
                  const listing = result.listing;
                  if (!listing) return null;

                  return (
                    <motion.div
                      key={result.id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all p-6 sm:p-7 space-y-4 relative overflow-hidden"
                    >
                      {/* Top Match Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase ${
                            result.matchType === 'strong'
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          }`}>
                            {result.matchType === 'strong' ? '🎯 Strong Match' : '✨ Compatible Match'}
                          </span>
                          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium hidden sm:inline">
                            {listing.category.toUpperCase()} • {listing.exchangeType === 'giveaway' ? 'Free Giveaway' : listing.exchangeType === 'skill_swap' ? 'Skill Swap' : 'Exchange'}
                          </span>
                        </div>

                        <span className="text-xs text-stone-400 font-medium">
                          {listing.createdAt}
                        </span>
                      </div>

                      {/* Content Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                        
                        {/* Student / Owner info */}
                        <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-4 border border-stone-200/60 dark:border-stone-700 space-y-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={listing.ownerAvatar}
                              alt={listing.ownerName}
                              className="w-11 h-11 rounded-full object-cover ring-2 ring-rose-200 dark:ring-rose-800"
                            />
                            <div>
                              <h4 className="font-extrabold text-sm text-stone-900 dark:text-white leading-tight">
                                {listing.ownerName}
                              </h4>
                              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                                {listing.ownerYear} • {listing.ownerDept.split(' ')[0]}
                              </p>
                            </div>
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1 pt-2 border-t border-stone-200/60 dark:border-stone-700">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span className="truncate">{listing.campusZone}</span>
                          </div>
                        </div>

                        {/* Resource / Offering info */}
                        <div className="md:col-span-2 space-y-3">
                          <div>
                            <h3 className="font-black text-base sm:text-lg text-stone-900 dark:text-white font-display">
                              {listing.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed font-medium">
                              {listing.description}
                            </p>
                          </div>

                          {/* "Why this matches you" signature explanation */}
                          <div className="p-3.5 bg-rose-50/70 dark:bg-rose-950/40 rounded-2xl border border-rose-200/70 dark:border-rose-900 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-rose-950 dark:text-rose-300">
                              <Sparkles className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                              <span>Why this matches you:</span>
                            </div>
                            <p className="text-rose-900 dark:text-rose-200 leading-normal font-medium">
                              "{result.reasonWhy}"
                            </p>
                          </div>

                          {/* Action Connect Button */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex flex-wrap gap-1.5">
                              {listing.tags.slice(0, 3).map((tag, tIdx) => (
                                <span key={tIdx} className="text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2.5 py-0.5 rounded-full">
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            <button
                              id={`smartmatch-connect-${listing.id}`}
                              onClick={() => setConnectModalTarget({ listing })}
                              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-stone-900 dark:bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-2xs"
                            >
                              <UserCheck className="w-4 h-4 text-rose-300 dark:text-white" />
                              <span>Connect</span>
                            </button>
                          </div>

                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* No match empty state with friendly prompt */
              <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-200/80 dark:border-stone-800 p-8 sm:p-12 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white font-display">
                    No perfect match yet 🌱
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto font-medium">
                    {noMatchAdvice || "We couldn't find an exact listing for this in our database right now — but you can post what you need and fellow SRM students will be notified!"}
                  </p>
                </div>
                <button
                  id="smartmatch-post-need-button"
                  onClick={() => {
                    setCreateListingDefaultType('need');
                    setCreateListingOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-200 dark:shadow-none transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post a Need on SRM Campus</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

