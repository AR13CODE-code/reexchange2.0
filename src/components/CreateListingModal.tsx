import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Sparkles, 
  Loader2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  BookOpen, 
  Laptop, 
  FileText, 
  Brain, 
  Gift, 
  Home, 
  Tag, 
  MapPin,
  HelpCircle,
  Eye,
  CheckCircle2,
  Dumbbell,
  Ticket,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ItemCategory, ExchangeType, ListingType, SRM_CAMPUS_LOCATIONS } from '../types';

export const CreateListingModal: React.FC = () => {
  const { 
    createListingOpen, 
    setCreateListingOpen, 
    createListingDefaultType,
    createListing, 
    enhanceListingWithAI,
    currentUser 
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [listingType, setListingType] = useState<ListingType>(createListingDefaultType);
  const [category, setCategory] = useState<ItemCategory>('books');
  const [title, setTitle] = useState('');
  const [rawNotes, setRawNotes] = useState('');
  const [description, setDescription] = useState('');
  const [exchangeType, setExchangeType] = useState<ExchangeType>('swap');
  const [price, setPrice] = useState<number | ''>('');
  const [priceNegotiable, setPriceNegotiable] = useState<boolean>(true);
  const [lendDuration, setLendDuration] = useState<string>('For 1 Semester');
  const [lookingFor, setLookingFor] = useState('');
  const [offeringSkill, setOfferingSkill] = useState('');
  const [seekingSkill, setSeekingSkill] = useState('');
  const [condition, setCondition] = useState<'Brand New' | 'Like New' | 'Gently Used' | 'Well Loved' | 'Digital / Notes'>('Like New');
  const [campusZone, setCampusZone] = useState(currentUser?.campusZone || SRM_CAMPUS_LOCATIONS[0]);
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!createListingOpen) return null;

  const handleAiEnhance = async () => {
    if (!rawNotes.trim() && !title.trim()) return;
    setAiEnhancing(true);

    try {
      const enhanced = await enhanceListingWithAI(
        rawNotes.trim() || title.trim(),
        listingType,
        category
      );

      if (enhanced) {
        if (enhanced.title) setTitle(enhanced.title);
        if (enhanced.description) setDescription(enhanced.description);
        if (enhanced.category) setCategory(enhanced.category);
        if (enhanced.exchangeType) setExchangeType(enhanced.exchangeType);
        if (enhanced.tags && Array.isArray(enhanced.tags)) {
          setTagsInput(enhanced.tags.join(', '));
        }
        if (enhanced.suggestedLookingFor) {
          setLookingFor(enhanced.suggestedLookingFor);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiEnhancing(false);
    }
  };

  const handlePublish = async () => {
    if (!title || !description) return;
    setSubmitting(true);

    const tags = tagsInput.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);

    let finalLookingFor = lookingFor;
    if (exchangeType === 'skill_swap') {
      finalLookingFor = seekingSkill ? `Teach: ${offeringSkill || title} ↔ Learn: ${seekingSkill}` : 'Skill swap';
    } else if (exchangeType === 'giveaway') {
      finalLookingFor = 'Free campus giveaway';
    } else if (exchangeType === 'sell') {
      finalLookingFor = `₹${price || 0}`;
    }

    await createListing({
      type: listingType,
      title,
      description,
      category,
      exchangeType,
      price: exchangeType === 'sell' && typeof price === 'number' ? price : undefined,
      priceNegotiable: exchangeType === 'sell' ? priceNegotiable : undefined,
      lendDuration: exchangeType === 'borrow' ? lendDuration : undefined,
      lookingFor: finalLookingFor || 'Open to campus exchange',
      condition,
      campusZone,
      tags: tags.length > 0 ? tags : ['SRMKTR', category],
      imageUrl: imageUrl || (
        category === 'books' ? 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=600&auto=format&fit=crop&q=80' :
        category === 'sports' ? 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=600&auto=format&fit=crop&q=80' :
        category === 'electronics' ? 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80' :
        undefined
      )
    });

    setSubmitting(false);
    setCreateListingOpen(false);
    // Reset wizard
    setStep(1);
    setTitle('');
    setRawNotes('');
    setDescription('');
    setTagsInput('');
    setImageUrl('');
    setPrice('');
    setOfferingSkill('');
    setSeekingSkill('');
  };

  const categoryOptions = [
    { id: 'books', label: 'Books & Guides', icon: BookOpen, desc: 'Textbooks, placement guides, novels' },
    { id: 'electronics', label: 'Electronics & Lab', icon: Laptop, desc: 'Calculators, Arduino, adaptors, tools' },
    { id: 'notes', label: 'Notes & Materials', icon: FileText, desc: 'Handwritten sheets, question banks' },
    { id: 'skills', label: 'Skills & Tutoring', icon: Brain, desc: 'DSA, UI/UX, Python, CAD, music' },
    { id: 'sports', label: 'Sports & Turf Gear', icon: Dumbbell, desc: 'Badminton, Cricket, Football, Gym' },
    { id: 'opportunities', label: 'Hackathons & Clubs', icon: Ticket, desc: 'Project teams, club events' },
    { id: 'free', label: 'Free Giveaway', icon: Gift, desc: 'Hostel items, stationery, supplies' },
    { id: 'hostel', label: 'Hostel Essentials', icon: Home, desc: 'Kettles, mattress, lamps, mirrors' },
  ];

  const presetPhotos = [
    { label: 'DSA Textbook', url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=600&auto=format&fit=crop&q=80' },
    { label: 'Casio Calculator', url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80' },
    { label: 'Badminton Racket', url: 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=600&auto=format&fit=crop&q=80' },
    { label: 'Arduino Uno Kit', url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80' },
    { label: 'Lab Coat & Specs', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-stone-900 rounded-[2.5rem] max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] flex flex-col justify-between border border-stone-200 dark:border-stone-800 transition-colors"
      >
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300">
                Step {step} of 5
              </span>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white font-display">
                {step === 1 && "What are you sharing today?"}
                {step === 2 && "Tell us about it"}
                {step === 3 && "What do you want in return?"}
                {step === 4 && "Where on campus can you meet?"}
                {step === 5 && "Preview your campus listing"}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setCreateListingOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Content */}
        <div className="flex-1 overflow-y-auto pr-1 py-1 space-y-4">
          
          {/* STEP 1: What are you sharing / requesting? */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setListingType('offer')}
                  className={`p-4 rounded-[2rem] border-2 text-left transition-all ${
                    listingType === 'offer'
                      ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 shadow-xs ring-1 ring-rose-500'
                      : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <p className="font-black text-sm sm:text-base">🤝 I CAN OFFER</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">I have a resource, book, gear, skill, or giveaway to share.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setListingType('need')}
                  className={`p-4 rounded-[2rem] border-2 text-left transition-all ${
                    listingType === 'need'
                      ? 'border-stone-900 dark:border-rose-400 bg-stone-100 dark:bg-stone-800 text-stone-950 dark:text-white shadow-xs ring-1 ring-stone-900 dark:ring-rose-400'
                      : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <p className="font-black text-sm sm:text-base">🔍 I NEED SOMETHING</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">I am looking for a textbook, turf partner, tutoring, or item.</p>
                </button>
              </div>

              {/* Category Grid */}
              <div className="space-y-2">
                <label className="font-black text-xs text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                  Select Category:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {categoryOptions.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as ItemCategory)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                          isSelected
                            ? 'border-stone-900 dark:border-rose-500 bg-stone-900 dark:bg-rose-500 text-white shadow-xs'
                            : 'border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/60 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-400 dark:text-white' : 'text-stone-600 dark:text-stone-400'}`} />
                        <div>
                          <p className="font-bold text-xs leading-tight">{cat.label}</p>
                          <p className={`text-[10px] mt-0.5 line-clamp-1 font-medium ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                            {cat.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Details + AI Polish */}
          {step === 2 && (
            <div className="space-y-4">
              {/* AI Auto-Enhance Helper Box */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/80 rounded-[2rem] border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 dark:text-white">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <span>AI Listing Assistant (Gemini)</span>
                  </div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Rough notes → Polished listing</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    id="raw-notes-input"
                    value={rawNotes}
                    onChange={e => setRawNotes(e.target.value)}
                    placeholder="e.g. yonex racket 2 weeks old or need casio 991ex for tomorrow math"
                    className="flex-1 p-3 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-800 dark:text-stone-200 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAiEnhance}
                    disabled={aiEnhancing || !rawNotes.trim()}
                    className="px-4 py-2 rounded-full bg-stone-900 dark:bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 disabled:opacity-50 transition-colors shadow-2xs"
                  >
                    {aiEnhancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-rose-400 dark:text-white" />}
                    <span>Enhance ✨</span>
                  </button>
                </div>
              </div>

              {/* Title Field */}
              <div className="space-y-1">
                <label className="font-bold text-xs text-stone-700 dark:text-stone-300">Listing Title *</label>
                <input
                  type="text"
                  required
                  id="listing-title-input"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Yonex Voltric Badminton Racket (Strung @ 24lbs)"
                  className="w-full p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 focus:border-rose-500 outline-hidden text-sm font-medium text-stone-800 dark:text-white bg-stone-50/50 dark:bg-stone-800/50"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-1">
                <label className="font-bold text-xs text-stone-700 dark:text-stone-300">Description & Context *</label>
                <textarea
                  rows={3}
                  required
                  id="listing-desc-input"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Explain why someone will find it useful, condition, racket weight or course specs..."
                  className="w-full p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 focus:border-rose-500 outline-hidden text-xs sm:text-sm text-stone-800 dark:text-white resize-none bg-stone-50/50 dark:bg-stone-800/50"
                />
              </div>

              {/* Condition & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-xs text-stone-700 dark:text-stone-300">Condition</label>
                  <select
                    value={condition}
                    onChange={e => setCondition(e.target.value as any)}
                    className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-800 dark:text-white outline-hidden bg-stone-50/50 dark:bg-stone-800/50"
                  >
                    <option value="Like New">Like New (Pristine)</option>
                    <option value="Brand New">Brand New</option>
                    <option value="Gently Used">Gently Used</option>
                    <option value="Well Loved">Well Loved</option>
                    <option value="Digital / Notes">Digital / Notes / Skill</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-xs text-stone-700 dark:text-stone-300">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="Badminton, Sports, SRM Hostel, Java"
                    className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-white outline-hidden bg-stone-50/50 dark:bg-stone-800/50"
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: What do you want in return? */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="font-black text-xs text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                  Exchange Mode:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {[
                    { id: 'giveaway', label: '🎁 Free Giveaway', desc: '100% free for fellow SRM students' },
                    { id: 'sell', label: '💰 Student Price (₹)', desc: 'Sell for fair student price' },
                    { id: 'borrow', label: '⏱️ Temporary Lend', desc: 'Lend for match / exam / semester' },
                    { id: 'swap', label: '🔄 Item Exchange', desc: 'Trade for another book or equipment' },
                    { id: 'skill_swap', label: '🤝 Skill Swap', desc: 'Trade knowledge / sports sparring' },
                    { id: 'collab', label: '💡 Collaboration', desc: 'Study group or project help' },
                  ].map(mode => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setExchangeType(mode.id as ExchangeType)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        exchangeType === mode.id
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 ring-1 ring-rose-500 shadow-xs'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/50 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <p className="font-bold text-xs sm:text-sm">{mode.label}</p>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium mt-0.5">{mode.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Field: Price for Sell */}
              {exchangeType === 'sell' && (
                <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-xs text-amber-900 dark:text-amber-200 block">Student Price (in INR ₹) *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-500 text-sm">₹</span>
                      <input
                        type="number"
                        min="0"
                        required
                        id="listing-price-input"
                        value={price}
                        onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 250"
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm font-bold text-stone-800 dark:text-white outline-hidden focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-semibold text-amber-950 dark:text-amber-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={priceNegotiable}
                      onChange={e => setPriceNegotiable(e.target.checked)}
                      className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>Open to student negotiation (e.g. over chai at Java)</span>
                  </label>
                </div>
              )}

              {/* Conditional Field: Duration for Borrow */}
              {exchangeType === 'borrow' && (
                <div className="space-y-1">
                  <label className="font-bold text-xs text-stone-700 dark:text-stone-300 block">Lending / Borrowing Duration</label>
                  <input
                    type="text"
                    value={lendDuration}
                    onChange={e => setLendDuration(e.target.value)}
                    placeholder="e.g. 3 Days (Weekend Tournament), 24 Hours, For Semester"
                    className="w-full p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-800 dark:text-white outline-hidden bg-stone-50/50 dark:bg-stone-800/50"
                  />
                </div>
              )}

              {/* Conditional Fields for Skill Swap */}
              {exchangeType === 'skill_swap' ? (
                <div className="space-y-3 p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                      Skill / Knowledge You Will Share:
                    </label>
                    <input
                      type="text"
                      value={offeringSkill}
                      onChange={e => setOfferingSkill(e.target.value)}
                      placeholder="e.g. Badminton smash technique & footwork"
                      className="w-full p-3 rounded-xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-800 text-xs text-stone-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                      Skill / Subject You Wish to Learn:
                    </label>
                    <input
                      type="text"
                      value={seekingSkill}
                      onChange={e => setSeekingSkill(e.target.value)}
                      placeholder="e.g. DSA graph algorithms or Web Development"
                      className="w-full p-3 rounded-xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-800 text-xs text-stone-900 dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="font-bold text-xs text-stone-700 dark:text-stone-300">
                    {exchangeType === 'sell' 
                      ? 'Notes on payment / pickup (Optional)' 
                      : 'What are you looking for in exchange? (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={lookingFor}
                    onChange={e => setLookingFor(e.target.value)}
                    placeholder={
                      exchangeType === 'sell' 
                        ? 'e.g. Cash / GPay at Java Canteen or BEL Lab' 
                        : exchangeType === 'giveaway'
                        ? 'Free to any 1st/2nd year SRM student'
                        : 'e.g. Basketball / System Design book / Figma UI tutoring'
                    }
                    className="w-full p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-800 dark:text-white outline-hidden bg-stone-50/50 dark:bg-stone-800/50"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Campus Location & Image */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-xs text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>SRM Kattankulathur Campus Hub / Meetup Point</span>
                </label>
                <select
                  value={campusZone}
                  onChange={e => setCampusZone(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-800 dark:text-white outline-hidden bg-stone-50/50 dark:bg-stone-800/50"
                >
                  {SRM_CAMPUS_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Photo selection with preset buttons */}
              <div className="space-y-2">
                <label className="font-bold text-xs text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                  <span>Photo (Pick preset or enter image URL)</span>
                </label>
                
                <div className="flex flex-wrap gap-2">
                  {presetPhotos.map(p => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setImageUrl(p.url)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        imageUrl === p.url 
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-white outline-hidden bg-stone-50/50 dark:bg-stone-800/50"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Live Interactive Preview */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-300 font-medium">
                <Eye className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>Here is how your listing will appear to everyone on SRM campus:</span>
              </div>

              {/* Preview Card */}
              <div className="bg-white dark:bg-stone-900 rounded-[2.2rem] border-2 border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4 max-w-md mx-auto">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    listingType === 'offer' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                  }`}>
                    {listingType === 'offer' ? 'Offering' : 'Seeking'}
                  </span>
                  
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                    {exchangeType === 'giveaway' 
                      ? '🎁 Free Gift' 
                      : exchangeType === 'sell' 
                      ? `💰 ₹${price || 0}${priceNegotiable ? ' (Neg.)' : ''}` 
                      : exchangeType === 'borrow'
                      ? `⏱️ ${lendDuration || 'Lend'}`
                      : exchangeType === 'skill_swap' 
                      ? '🤝 Skill Swap' 
                      : '🔄 Exchange'}
                  </span>
                </div>

                {imageUrl && (
                  <div className="h-32 w-full rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <h3 className="font-black text-base text-stone-900 dark:text-white font-display">
                    {title || "Untitled Listing"}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed font-medium">
                    {description || "No description provided."}
                  </p>
                </div>

                {(lookingFor || exchangeType === 'sell' || exchangeType === 'skill_swap') && (
                  <div className="p-2.5 bg-stone-50 dark:bg-stone-800/80 rounded-xl text-xs text-stone-700 dark:text-stone-300 font-medium">
                    <span className="font-bold text-stone-900 dark:text-white">Exchange / Mode: </span>
                    <span>
                      {exchangeType === 'skill_swap' 
                        ? (seekingSkill ? `Teach: ${offeringSkill || title} ↔ Learn: ${seekingSkill}` : 'Skill swap')
                        : (lookingFor || (exchangeType === 'sell' ? `₹${price || 0}` : 'Open to exchange'))}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=srm'} alt="" className="w-6 h-6 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700" />
                    <div>
                      <p className="font-bold text-stone-800 dark:text-stone-200 leading-tight">{currentUser?.name || 'Anonymous SRM Student'}</p>
                      <p className="text-[10px] text-stone-400 font-medium">{currentUser?.department?.split(' ')[0] || 'SRM'}</p>
                    </div>
                  </div>
                  <div className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{campusZone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              id="wizard-next-button"
              onClick={() => {
                if (step === 2 && (!title.trim() || !description.trim())) {
                  alert("Please enter a title and description (or use AI Enhance).");
                  return;
                }
                setStep(step + 1);
              }}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-stone-900 dark:bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold shadow-2xs transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              id="wizard-publish-button"
              onClick={handlePublish}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold shadow-2xs transition-colors active:scale-98"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Share with SRM Campus</span>
            </button>
          )}
        </div>

      </motion.div>
    </div>
  );
};

