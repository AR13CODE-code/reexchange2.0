import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Ticket, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  PlusCircle, 
  Sparkles, 
  Users, 
  Code, 
  Laptop,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Opportunity } from '../types';

export const OpportunitiesView: React.FC = () => {
  const { opportunities, createOpportunity, currentUser, setConnectModalTarget } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Opportunity['type']>('hackathon');
  const [organizer, setOrganizer] = useState('');
  const [venue, setVenue] = useState('');
  const [deadline, setDeadline] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');

  const filteredOpps = opportunities.filter(opp => {
    if (filterType !== 'all' && opp.type !== filterType) return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !organizer) return;

    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);

    await createOpportunity({
      title,
      type,
      organizer,
      venue: venue || 'SRM Kattankulathur Campus',
      deadline: deadline || 'Open for registration',
      link: link || '#',
      description,
      tags: tags.length > 0 ? tags : ['SRMIST', type]
    });

    setModalOpen(false);
    setTitle('');
    setOrganizer('');
    setDescription('');
    setTagInput('');
  };

  const typeBadges: Record<string, { label: string; color: string }> = {
    hackathon: { label: '⚡ Hackathon', color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900' },
    workshop: { label: '🎓 Workshop', color: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900' },
    project: { label: '🤝 Teammate Finder', color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-900' },
    club: { label: '🏛️ Club Recruitment', color: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-900' },
    internship: { label: '💼 Internship', color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900' },
    competition: { label: '🏆 Competition', color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900' },
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs font-bold mb-2">
            <Ticket className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>SRM Hackathons, Teams & Gigs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white font-display tracking-tight">
            Opportunity Exchange
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 font-medium">
            Find teammates for HackSRM, MILAN, tech workshops, and college initiatives.
          </p>
        </div>

        <button
          id="post-opportunity-button"
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-rose-500 text-white font-bold text-sm shadow-md hover:bg-rose-600 active:scale-98 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post an Opportunity</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Opportunities' },
          { id: 'hackathon', label: '⚡ Hackathons' },
          { id: 'workshop', label: '🎓 Workshops' },
          { id: 'project', label: '🤝 Project Teams' },
          { id: 'club', label: '🏛️ Clubs' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setFilterType(item.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterType === item.id
                ? 'bg-stone-900 dark:bg-rose-500 text-white shadow-2xs'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpps.map(opp => {
          const badge = typeBadges[opp.type] || typeBadges.hackathon;

          return (
            <motion.div
              key={opp.id}
              whileHover={{ y: -3 }}
              className="bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md p-6 space-y-4 flex flex-col justify-between transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${badge.color}`}>
                    {badge.label}
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium">{opp.createdAt}</span>
                </div>

                <div>
                  <h3 className="font-black text-lg text-stone-900 dark:text-white font-display leading-snug">
                    {opp.title}
                  </h3>
                  <p className="text-xs font-bold text-rose-700 dark:text-rose-400 mt-0.5">
                    Organized by: {opp.organizer}
                  </p>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3 font-medium">
                  {opp.description}
                </p>

                <div className="space-y-1.5 pt-2 text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {opp.venue && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{opp.venue}</span>
                    </div>
                  )}
                  {opp.deadline && (
                    <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                      <span>{opp.deadline}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2.5 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <img src={opp.authorAvatar} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700" />
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 truncate max-w-[100px]">{opp.authorName}</span>
                </div>

                <button
                  onClick={() => setConnectModalTarget({ customTitle: `Opportunity: ${opp.title}`, user: { id: opp.authorId, name: opp.authorName, avatarUrl: opp.authorAvatar } })}
                  className="px-4 py-2 rounded-full bg-stone-900 dark:bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 active:scale-95 transition-all shadow-2xs"
                >
                  Join / Connect
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Post Opportunity Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 rounded-[2rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-800"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                <h3 className="font-black text-lg text-stone-900 dark:text-white font-display">
                  Post an SRM Opportunity
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-300">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Opportunity Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HackSRM 2026 - Frontend & AI Developer Search"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-700 focus:border-rose-500 outline-hidden bg-stone-50/50 dark:bg-stone-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Type</label>
                    <select
                      value={type}
                      onChange={e => setType(e.target.value as any)}
                      className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-700 focus:border-rose-500 outline-hidden bg-stone-50/50 dark:bg-stone-800 dark:text-white"
                    >
                      <option value="hackathon">Hackathon</option>
                      <option value="workshop">Workshop</option>
                      <option value="project">Project Teammate</option>
                      <option value="club">Club Recruitment</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Organizer / Club</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SRM Coding Club"
                      value={organizer}
                      onChange={e => setOrganizer(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-700 focus:border-rose-500 outline-hidden bg-stone-50/50 dark:bg-stone-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Campus Venue / Online</label>
                    <input
                      type="text"
                      placeholder="e.g. Tech Park 4th Floor / TP Gmeet"
                      value={venue}
                      onChange={e => setVenue(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-700 outline-hidden bg-stone-50/50 dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Deadline / Date</label>
                    <input
                      type="text"
                      placeholder="e.g. Friday 6:00 PM"
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-700 outline-hidden bg-stone-50/50 dark:bg-stone-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Description & Requirements</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe what roles you need, what the event offers, and how teammates can connect..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-700 outline-hidden resize-none bg-stone-50/50 dark:bg-stone-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="AI, React, Teammates, Hackathon"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-700 outline-hidden bg-stone-50/50 dark:bg-stone-800 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-full font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-rose-500 text-white font-bold shadow-md hover:bg-rose-600"
                  >
                    Publish Opportunity
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

