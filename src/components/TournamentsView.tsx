import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tournament, TournamentSport, SRM_CAMPUS_LOCATIONS } from '../types';
import { 
  Trophy, 
  Users, 
  Calendar, 
  MapPin, 
  Plus, 
  Search, 
  Shield, 
  CheckCircle, 
  Clock, 
  Coins, 
  Sparkles, 
  Award,
  ChevronRight,
  Flame,
  Gamepad2,
  Dumbbell,
  Swords,
  X,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SPORT_CONFIG: Record<TournamentSport, { label: string; icon: string; color: string; bg: string }> = {
  football: { label: 'Football', icon: '⚽', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  cricket: { label: 'Cricket', icon: '🏏', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  badminton: { label: 'Badminton', icon: '🏸', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' },
  basketball: { label: 'Basketball', icon: '🏀', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  esports: { label: 'Esports / Gaming', icon: '🎮', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  volleyball: { label: 'Volleyball', icon: '🏐', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  chess: { label: 'Chess', icon: '♟️', color: 'text-stone-300', bg: 'bg-stone-500/10 border-stone-500/30' },
  table_tennis: { label: 'Table Tennis', icon: '🏓', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
  athletics: { label: 'Athletics & Track', icon: '🏃', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/30' },
  other: { label: 'Campus Sports', icon: '🏆', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
};

export const TournamentsView: React.FC = () => {
  const { 
    tournaments, 
    currentUser, 
    isLoggedIn,
    setLoginModalOpen,
    setAuthModalMode,
    createTournament,
    registerForTournament,
    deleteTournament
  } = useApp();

  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals inside Tournaments view
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [registerModalTarget, setRegisterModalTarget] = useState<Tournament | null>(null);
  const [detailsModalTarget, setDetailsModalTarget] = useState<Tournament | null>(null);

  // Host Tournament Form State
  const [hostTitle, setHostTitle] = useState('');
  const [hostSport, setHostSport] = useState<TournamentSport>('football');
  const [hostVenue, setHostVenue] = useState('Vendhat Square Sports Complex');
  const [hostStartDate, setHostStartDate] = useState('');
  const [hostDeadline, setHostDeadline] = useState('');
  const [hostFormat, setHostFormat] = useState<any>('5v5 Squad');
  const [hostMaxTeams, setHostMaxTeams] = useState(16);
  const [hostPrizePool, setHostPrizePool] = useState('₹10,000 + Trophy');
  const [hostEntryFee, setHostEntryFee] = useState('Free / SRM Students');
  const [hostRules, setHostRules] = useState('Valid SRM Student ID required\nKnockout tournament rules apply\nReferees decision is final');
  const [hostDescription, setHostDescription] = useState('');
  const [hostSubmitting, setHostSubmitting] = useState(false);
  const [hostError, setHostError] = useState('');

  // Team Registration Form State
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState(currentUser?.name || '');
  const [captainRegNo, setCaptainRegNo] = useState(currentUser?.regNo || '');
  const [captainPhone, setCaptainPhone] = useState('');
  const [captainEmail, setCaptainEmail] = useState(currentUser?.email || '');
  const [memberList, setMemberList] = useState<{ name: string; regNo: string }[]>([
    { name: '', regNo: '' }
  ]);
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regError, setRegError] = useState('');

  // Filter tournaments
  const filteredTournaments = tournaments.filter(t => {
    if (selectedSport !== 'all' && t.sport !== selectedSport) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.venue.toLowerCase().includes(q) ||
        t.organizerName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenHostModal = () => {
    if (!isLoggedIn) {
      setAuthModalMode('register');
      setLoginModalOpen(true);
      return;
    }
    setHostModalOpen(true);
  };

  const handleOpenRegisterModal = (tourney: Tournament) => {
    if (!isLoggedIn) {
      setAuthModalMode('register');
      setLoginModalOpen(true);
      return;
    }
    setCaptainName(currentUser?.name || '');
    setCaptainRegNo(currentUser?.regNo || '');
    setCaptainEmail(currentUser?.email || '');
    setTeamName('');
    setCaptainPhone('');
    setMemberList([{ name: '', regNo: '' }]);
    setRegError('');
    setRegisterModalTarget(tourney);
  };

  const handleHostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHostError('');
    if (!hostTitle.trim() || !hostStartDate) {
      setHostError('Tournament Title and Start Date are required.');
      return;
    }

    setHostSubmitting(true);
    const result = await createTournament({
      title: hostTitle.trim(),
      sport: hostSport,
      venue: hostVenue,
      startDate: hostStartDate,
      registrationDeadline: hostDeadline || hostStartDate,
      teamFormat: hostFormat,
      maxTeams: Number(hostMaxTeams),
      prizePool: hostPrizePool,
      entryFee: hostEntryFee,
      rules: hostRules.split('\n').map(r => r.trim()).filter(Boolean),
      description: hostDescription.trim() || `Official ${SPORT_CONFIG[hostSport].label} tournament for SRMIST students.`,
    });
    setHostSubmitting(false);

    if (result) {
      setHostModalOpen(false);
      setHostTitle('');
      setHostDescription('');
    } else {
      setHostError('Failed to create tournament.');
    }
  };

  const handleAddMember = () => {
    if (memberList.length < 15) {
      setMemberList([...memberList, { name: '', regNo: '' }]);
    }
  };

  const handleRemoveMember = (idx: number) => {
    setMemberList(memberList.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx: number, field: 'name' | 'regNo', val: string) => {
    const updated = [...memberList];
    updated[idx][field] = val;
    setMemberList(updated);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerModalTarget) return;
    setRegError('');

    if (!teamName.trim() || !captainName.trim() || !captainRegNo.trim()) {
      setRegError('Team Name, Captain Name, and College Registration Number are required.');
      return;
    }

    setRegSubmitting(true);
    const filteredMembers = memberList.filter(m => m.name.trim() && m.regNo.trim());
    const res = await registerForTournament(registerModalTarget.id, {
      teamName: teamName.trim(),
      captainName: captainName.trim(),
      captainRegNo: captainRegNo.trim().toUpperCase(),
      captainPhone: captainPhone.trim(),
      captainEmail: captainEmail.trim(),
      members: filteredMembers
    });
    setRegSubmitting(false);

    if (res.success) {
      setRegisterModalTarget(null);
    } else {
      setRegError(res.error || 'Failed to register team.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-black border border-stone-800 p-6 sm:p-10 shadow-2xl">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Trophy className="w-3.5 h-3.5" />
              <span>Campus Sports & Tournaments</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              SRM Campus <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-rose-500 bg-clip-text text-transparent">Tournaments & Leagues</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-stone-400 leading-relaxed">
              Register your department or hostel squad for football, cricket, badminton, basketball, and esports cups. Or host your own inter-hostel championship at SRM Kattankulathur!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={handleOpenHostModal}
              className="px-6 py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/60 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Host a Tournament</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sports Filter Bar & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tournaments by name, venue, organizer..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-900/90 dark:bg-stone-900 border border-stone-800 text-white text-xs sm:text-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          <div className="text-xs text-stone-400 font-medium">
            Showing <span className="font-bold text-white">{filteredTournaments.length}</span> Active Tournaments
          </div>
        </div>

        {/* Sport Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedSport('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedSport === 'all'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-950/50'
                : 'bg-stone-900/80 text-stone-300 border border-stone-800 hover:border-stone-700 hover:text-white'
            }`}
          >
            <span>⚡</span>
            <span>All Sports</span>
          </button>

          {Object.entries(SPORT_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedSport(key)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedSport === key
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-950/50'
                  : 'bg-stone-900/80 text-stone-300 border border-stone-800 hover:border-stone-700 hover:text-white'
              }`}
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tournaments Grid or Empty State */}
      {filteredTournaments.length === 0 ? (
        <div className="rounded-3xl border border-stone-800 bg-stone-950/50 p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-3xl">
            🏆
          </div>
          <h3 className="text-lg font-bold text-white">No Tournaments Listed Yet</h3>
          <p className="text-xs sm:text-sm text-stone-400">
            Be the first organizer or sports captain to list a campus tournament, league, or friendly match for SRM students!
          </p>
          <button
            onClick={handleOpenHostModal}
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-all shadow-md shadow-rose-950/50 cursor-pointer"
          >
            Host the First Tournament
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tourney) => {
            const sportCfg = SPORT_CONFIG[tourney.sport] || SPORT_CONFIG.other;
            const pctFilled = Math.min(100, Math.round((tourney.registeredTeamsCount / (tourney.maxTeams || 1)) * 100));
            const isFull = tourney.registeredTeamsCount >= tourney.maxTeams;

            return (
              <motion.div
                key={tourney.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-stone-700 transition-all p-5 flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${sportCfg.bg} ${sportCfg.color}`}>
                      <span>{sportCfg.icon}</span>
                      <span>{sportCfg.label}</span>
                    </span>

                    <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                      {tourney.teamFormat}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                    {tourney.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {tourney.description}
                  </p>

                  {/* Metadata Pills */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-stone-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{tourney.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-300">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{tourney.startDate}</span>
                    </div>
                    {tourney.prizePool && (
                      <div className="flex items-center gap-2 text-stone-300">
                        <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-emerald-400">{tourney.prizePool}</span>
                      </div>
                    )}
                  </div>

                  {/* Live Capacity Meter */}
                  <div className="mt-5 p-3 rounded-2xl bg-stone-950/60 border border-stone-800/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-stone-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span>Registered Teams</span>
                      </span>
                      <span className={`font-mono font-bold ${isFull ? 'text-rose-400' : 'text-stone-200'}`}>
                        {tourney.registeredTeamsCount} / {tourney.maxTeams} {isFull && '(FULL)'}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull 
                            ? 'bg-rose-500' 
                            : pctFilled > 70 
                              ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                              : 'bg-gradient-to-r from-emerald-500 to-amber-500'
                        }`}
                        style={{ width: `${pctFilled}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-4 border-t border-stone-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setDetailsModalTarget(tourney)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-300 hover:text-white bg-stone-800/60 hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Rules & Teams
                  </button>

                  <button
                    onClick={() => handleOpenRegisterModal(tourney)}
                    disabled={isFull}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                      isFull
                        ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                        : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-950/50 active:scale-95'
                    }`}
                  >
                    <span>{isFull ? 'Slot Full' : 'Register Squad'}</span>
                    {!isFull && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* HOST TOURNAMENT MODAL */}
      <AnimatePresence>
        {hostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-stone-900 text-stone-100 rounded-3xl shadow-2xl border border-stone-800 overflow-hidden my-8"
            >
              <div className="flex items-center justify-between p-5 border-b border-stone-800 bg-stone-950/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center text-lg">
                    🏆
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Host Campus Tournament</h3>
                    <p className="text-xs text-stone-400">Organize a sports or esports event at SRMIST</p>
                  </div>
                </div>
                <button
                  onClick={() => setHostModalOpen(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleHostSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
                {hostError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{hostError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">Tournament Title *</label>
                  <input
                    type="text"
                    value={hostTitle}
                    onChange={(e) => setHostTitle(e.target.value)}
                    placeholder="e.g. SRM Inter-Hostel Football Cup 2026"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">Sport / Game *</label>
                    <select
                      value={hostSport}
                      onChange={(e) => setHostSport(e.target.value as TournamentSport)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                    >
                      {Object.entries(SPORT_CONFIG).map(([k, cfg]) => (
                        <option key={k} value={k}>{cfg.icon} {cfg.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">Format</label>
                    <select
                      value={hostFormat}
                      onChange={(e) => setHostFormat(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                    >
                      <option value="Solo (1v1)">Solo (1v1)</option>
                      <option value="Doubles (2v2)">Doubles (2v2)</option>
                      <option value="3v3 Squad">3v3 Squad</option>
                      <option value="5v5 Squad">5v5 Squad</option>
                      <option value="7v7 Team">7v7 Team</option>
                      <option value="11v11 Squad">11v11 Squad</option>
                      <option value="Custom Team">Custom Team</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">Campus Venue *</label>
                    <select
                      value={hostVenue}
                      onChange={(e) => setHostVenue(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                    >
                      <option value="Vendhat Square Sports Complex">Vendhat Square Sports Complex</option>
                      <option value="SRM Indoor Stadium">SRM Indoor Stadium</option>
                      <option value="Main Football Turf Ground">Main Football Turf Ground</option>
                      <option value="Tech Park Badminton Quad">Tech Park Badminton Quad</option>
                      <option value="University Building Grounds">University Building Grounds</option>
                      <option value="N Block Hostel Court">N Block Hostel Court</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">Max Teams Capacity</label>
                    <input
                      type="number"
                      min={2}
                      max={64}
                      value={hostMaxTeams}
                      onChange={(e) => setHostMaxTeams(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">Tournament Date *</label>
                    <input
                      type="text"
                      value={hostStartDate}
                      onChange={(e) => setHostStartDate(e.target.value)}
                      placeholder="e.g. This Saturday 4:30 PM"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">Prize Pool / Trophy</label>
                    <input
                      type="text"
                      value={hostPrizePool}
                      onChange={(e) => setHostPrizePool(e.target.value)}
                      placeholder="e.g. ₹10,000 + Medals"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">Rules & Requirements (one per line)</label>
                  <textarea
                    rows={3}
                    value={hostRules}
                    onChange={(e) => setHostRules(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60 resize-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">Description / Notes</label>
                  <textarea
                    rows={2}
                    value={hostDescription}
                    onChange={(e) => setHostDescription(e.target.value)}
                    placeholder="Provide details about kit, refreshments, team size..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={hostSubmitting}
                  className="w-full py-3.5 rounded-full font-bold text-xs sm:text-sm bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/60 cursor-pointer"
                >
                  {hostSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trophy className="w-4 h-4" />
                      <span>Publish Tournament to Campus</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REGISTER TEAM MODAL */}
      <AnimatePresence>
        {registerModalTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-stone-900 text-stone-100 rounded-3xl shadow-2xl border border-stone-800 overflow-hidden my-8"
            >
              <div className="flex items-center justify-between p-5 border-b border-stone-800 bg-stone-950/60">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <span>Squad Registration</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {SPORT_CONFIG[registerModalTarget.sport]?.label}
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400 truncate max-w-sm">
                    {registerModalTarget.title} • {registerModalTarget.venue}
                  </p>
                </div>
                <button
                  onClick={() => setRegisterModalTarget(null)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
                {regError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">Team / Squad Name *</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Red Dragons FC / CSE Cyber Strikers"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">Captain Name *</label>
                    <input
                      type="text"
                      value={captainName}
                      onChange={(e) => setCaptainName(e.target.value)}
                      placeholder="Captain Full Name"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">Captain SRM Reg No *</label>
                    <input
                      type="text"
                      value={captainRegNo}
                      onChange={(e) => setCaptainRegNo(e.target.value.toUpperCase())}
                      placeholder="RA2311003010xxx"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white font-mono text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60 uppercase"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={captainPhone}
                      onChange={(e) => setCaptainPhone(e.target.value)}
                      placeholder="+91 98401 xxxxx"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">Captain Email</label>
                    <input
                      type="email"
                      value={captainEmail}
                      onChange={(e) => setCaptainEmail(e.target.value)}
                      placeholder="student@srmist.edu.in"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                    />
                  </div>
                </div>

                {/* Additional squad members roster */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-stone-300">Squad Members Roster</label>
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Player</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {memberList.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                          placeholder={`Player #${idx + 2} Name`}
                          className="flex-1 px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <input
                          type="text"
                          value={member.regNo}
                          onChange={(e) => handleMemberChange(idx, 'regNo', e.target.value.toUpperCase())}
                          placeholder="Reg Number"
                          className="w-36 px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono text-xs placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-rose-500 uppercase"
                        />
                        {memberList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(idx)}
                            className="p-2 text-stone-500 hover:text-rose-400"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={regSubmitting}
                  className="w-full py-3.5 rounded-full font-bold text-xs sm:text-sm bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/60 cursor-pointer mt-2"
                >
                  {regSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Squad Registration</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOURNAMENT DETAILS MODAL */}
      <AnimatePresence>
        {detailsModalTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-stone-900 text-stone-100 rounded-3xl shadow-2xl border border-stone-800 overflow-hidden my-8"
            >
              <div className="p-6 border-b border-stone-800 bg-stone-950/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                      {SPORT_CONFIG[detailsModalTarget.sport]?.label}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      {detailsModalTarget.teamFormat}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-white">{detailsModalTarget.title}</h3>
                </div>
                <button
                  onClick={() => setDetailsModalTarget(null)}
                  className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
                {/* Details highlights */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80 text-xs">
                  <div>
                    <span className="text-stone-500 block">Venue</span>
                    <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {detailsModalTarget.venue}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Schedule</span>
                    <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {detailsModalTarget.startDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Prize Pool</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      {detailsModalTarget.prizePool || 'Trophies'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Organizer</span>
                    <span className="font-bold text-stone-200 mt-0.5 block truncate">
                      {detailsModalTarget.organizerName}
                    </span>
                  </div>
                </div>

                {/* Rules */}
                <div>
                  <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">Tournament Rules</h4>
                  <ul className="space-y-1.5">
                    {detailsModalTarget.rules.map((rule, i) => (
                      <li key={i} className="text-xs text-stone-300 flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Registered Teams List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                      Registered Teams ({detailsModalTarget.registeredTeamsCount} / {detailsModalTarget.maxTeams})
                    </h4>
                  </div>

                  {(!detailsModalTarget.registrations || detailsModalTarget.registrations.length === 0) ? (
                    <div className="p-4 rounded-2xl bg-stone-950/40 border border-stone-800/60 text-center text-xs text-stone-500">
                      No teams registered yet. Be the first team on the bracket!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {detailsModalTarget.registrations.map((reg, idx) => (
                        <div key={reg.id || idx} className="p-3 rounded-2xl bg-stone-950/60 border border-stone-800/80 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white block">{reg.teamName}</span>
                            <span className="text-[11px] text-stone-400">
                              Captain: {reg.captainName} ({reg.captainRegNo})
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Confirmed
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-stone-800 bg-stone-950/60 flex justify-end">
                <button
                  onClick={() => {
                    const tourney = detailsModalTarget;
                    setDetailsModalTarget(null);
                    handleOpenRegisterModal(tourney);
                  }}
                  disabled={detailsModalTarget.registeredTeamsCount >= detailsModalTarget.maxTeams}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-all disabled:opacity-50 cursor-pointer shadow-md"
                >
                  Register For This Tournament
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
