import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  BookOpen, 
  Brain, 
  MapPin, 
  Edit3, 
  Trash2, 
  Bookmark, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Award,
  ArrowRight,
  Trophy,
  LogIn,
  UserPlus,
  Users,
  Phone
} from 'lucide-react';
import { motion } from 'motion/react';
import { Listing, SRM_CAMPUS_LOCATIONS } from '../types';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    isLoggedIn,
    setLoginModalOpen,
    setAuthModalMode,
    listings, 
    tournaments,
    savedListingIds, 
    deleteListing, 
    setCreateListingOpen, 
    setCreateListingDefaultType,
    setActiveTab,
    setConnectModalTarget
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [profileTab, setProfileTab] = useState<'my_listings' | 'my_tournaments' | 'saved'>('my_listings');

  // Form State for editing
  const [name, setName] = useState(currentUser?.name || '');
  const [regNo, setRegNo] = useState(currentUser?.regNo || '');
  const [mobileNumber, setMobileNumber] = useState(currentUser?.mobileNumber || '');
  const [department, setDepartment] = useState(currentUser?.department || 'Computer Science & Engineering');
  const [year, setYear] = useState(currentUser?.year || '2nd Year');
  const [campusZone, setCampusZone] = useState(currentUser?.campusZone || SRM_CAMPUS_LOCATIONS[0]);
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [contactHandle, setContactHandle] = useState(currentUser?.contactHandle || '');
  const [skillsOfferedInput, setSkillsOfferedInput] = useState(currentUser?.skillsOffered?.join(', ') || '');
  const [skillsNeededInput, setSkillsNeededInput] = useState(currentUser?.skillsNeeded?.join(', ') || '');

  if (!currentUser || !isLoggedIn) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto text-3xl">
          👤
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white font-display">Student Profile & Dashboard</h2>
          <p className="text-sm text-stone-400">
            Sign in or register your real SRM student account to manage your listings, view squad tournament registrations, and check messages.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setAuthModalMode('register');
              setLoginModalOpen(true);
            }}
            className="w-full sm:w-auto px-7 py-3 rounded-full font-bold text-xs bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-lg shadow-rose-950/60 cursor-pointer"
          >
            Create SRM Account
          </button>
          <button
            onClick={() => {
              setAuthModalMode('login');
              setLoginModalOpen(true);
            }}
            className="w-full sm:w-auto px-7 py-3 rounded-full font-bold text-xs bg-stone-800 border border-stone-700 hover:bg-stone-700 text-stone-200 cursor-pointer"
          >
            Sign In with Credentials
          </button>
        </div>
      </div>
    );
  }

  const myListings = listings.filter(l => l.ownerId === currentUser.id);
  const savedListings = listings.filter(l => savedListingIds.includes(l.id));
  
  // Tournaments user is captaining or registered in
  const myRegisteredTournaments = tournaments.filter(t => 
    t.organizerId === currentUser.id ||
    t.registrations?.some(r => r.captainId === currentUser.id || r.captainRegNo === currentUser.regNo)
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(prev => prev ? ({
      ...prev,
      name,
      regNo: regNo.toUpperCase(),
      mobileNumber,
      department,
      year: year as any,
      campusZone,
      bio,
      contactHandle,
      skillsOffered: skillsOfferedInput.split(',').map(s => s.trim()).filter(Boolean),
      skillsNeeded: skillsNeededInput.split(',').map(s => s.trim()).filter(Boolean),
    }) : null);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Profile Top Banner Card */}
      <div className="bg-stone-900 rounded-[2.5rem] border border-stone-800 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden transition-colors">
        
        {/* Banner Top Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-rose-500/40 shadow-xl"
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs" title="Verified SRM Student">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                  {currentUser.name}
                </h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {currentUser.regNo || currentUser.year}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 font-medium">
                {currentUser.department} • {currentUser.year}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs text-stone-400 font-medium">
                {currentUser.campusZone && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{currentUser.campusZone}</span>
                  </span>
                )}
                {currentUser.mobileNumber && (
                  <span className="flex items-center gap-1 text-emerald-400 font-mono">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{currentUser.mobileNumber}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            id="edit-profile-toggle-button"
            onClick={() => {
              setName(currentUser.name);
              setRegNo(currentUser.regNo || '');
              setMobileNumber(currentUser.mobileNumber || '');
              setDepartment(currentUser.department);
              setYear(currentUser.year);
              setCampusZone(currentUser.campusZone || SRM_CAMPUS_LOCATIONS[0]);
              setBio(currentUser.bio || '');
              setContactHandle(currentUser.contactHandle || '');
              setSkillsOfferedInput(currentUser.skillsOffered?.join(', ') || '');
              setSkillsNeededInput(currentUser.skillsNeeded?.join(', ') || '');
              setIsEditing(!isEditing);
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-stone-700 bg-stone-800 hover:bg-stone-700 text-xs sm:text-sm font-bold text-stone-200 transition-colors shrink-0 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Bio */}
        {currentUser.bio && !isEditing && (
          <p className="text-xs sm:text-sm text-stone-300 bg-stone-950/60 p-4 rounded-2xl border border-stone-800 italic leading-relaxed font-medium">
            "{currentUser.bio}"
          </p>
        )}

        {/* Skills Offered & Skills Needed Chips */}
        {!isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-800 text-xs">
            <div className="space-y-2">
              <span className="font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Brain className="w-3.5 h-3.5 text-emerald-400" />
                <span>Skills Offered:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.skillsOffered && currentUser.skillsOffered.length > 0 ? (
                  currentUser.skillsOffered.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-emerald-950/50 text-emerald-300 border border-emerald-800 font-bold text-xs">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-stone-500 text-xs italic">None listed yet</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-black text-rose-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Needs / Wants to Learn:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.skillsNeeded && currentUser.skillsNeeded.length > 0 ? (
                  currentUser.skillsNeeded.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-rose-950/50 text-rose-300 border border-rose-800 font-bold text-xs">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-stone-500 text-xs italic">None listed yet</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reputation Activity Metrics */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-stone-800 text-center">
          <div className="bg-stone-950/60 p-3.5 rounded-2xl border border-stone-800">
            <p className="text-lg sm:text-2xl font-black text-rose-400 font-display">
              {currentUser.stats?.resourcesShared || 0}
            </p>
            <p className="text-[11px] font-bold text-stone-400">Shared Resources</p>
          </div>
          <div className="bg-stone-950/60 p-3.5 rounded-2xl border border-stone-800">
            <p className="text-lg sm:text-2xl font-black text-emerald-400 font-display">
              {currentUser.stats?.skillExchanges || 0}
            </p>
            <p className="text-[11px] font-bold text-stone-400">Skill Exchanges</p>
          </div>
          <div className="bg-stone-950/60 p-3.5 rounded-2xl border border-stone-800">
            <p className="text-lg sm:text-2xl font-black text-amber-400 font-display">
              {myRegisteredTournaments.length}
            </p>
            <p className="text-[11px] font-bold text-stone-400">Tournaments</p>
          </div>
        </div>

        {/* Inline Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-4 border-t border-stone-800 space-y-4 text-xs sm:text-sm">
            <h3 className="font-black text-white font-display">Update SRM Student Profile</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-stone-700 outline-none bg-stone-800 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-stone-300 block mb-1">SRM Registration Number</label>
                <input
                  type="text"
                  required
                  value={regNo}
                  onChange={e => setRegNo(e.target.value.toUpperCase())}
                  className="w-full p-3 rounded-2xl border border-stone-700 outline-none bg-stone-800 text-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-stone-300 block mb-1">Mobile / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 rounded-2xl border border-stone-700 outline-none bg-stone-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-300 block mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-stone-700 outline-none bg-stone-800 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-stone-300 block mb-1">Year</label>
                <select
                  value={year}
                  onChange={e => setYear(e.target.value as any)}
                  className="w-full p-3 rounded-2xl border border-stone-700 outline-none bg-stone-800 text-white"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgrad">Postgraduate / M.Tech</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-300 block mb-1">Campus Hub Zone</label>
              <select
                value={campusZone}
                onChange={e => setCampusZone(e.target.value)}
                className="w-full p-3 rounded-2xl border border-stone-700 outline-none bg-stone-800 text-white"
              >
                {SRM_CAMPUS_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-300 block mb-1">Skills You Can Offer (comma separated)</label>
              <input
                type="text"
                value={skillsOfferedInput}
                onChange={e => setSkillsOfferedInput(e.target.value)}
                placeholder="Python, UI/UX, Badminton, Math Tutoring"
                className="w-full p-3 rounded-2xl border border-stone-700 outline-none bg-stone-800 text-white"
              />
            </div>

            <div>
              <label className="font-bold text-stone-300 block mb-1">Skills You Want to Learn (comma separated)</label>
              <input
                type="text"
                value={skillsNeededInput}
                onChange={e => setSkillsNeededInput(e.target.value)}
                placeholder="Machine Learning, DSA Prep, Guitar"
                className="w-full p-3 rounded-2xl border border-stone-700 outline-none bg-stone-800 text-white"
              />
            </div>

            <div>
              <label className="font-bold text-stone-300 block mb-1">Contact Handle (Shared only upon accepted connection)</label>
              <input
                type="text"
                value={contactHandle}
                onChange={e => setContactHandle(e.target.value)}
                placeholder="your.email@srmist.edu.in or discord#1234"
                className="w-full p-3 rounded-2xl border border-stone-700 outline-none bg-stone-800 text-white"
              />
            </div>

            <div>
              <label className="font-bold text-stone-300 block mb-1">Bio</label>
              <textarea
                rows={2}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full p-3 rounded-2xl border border-stone-700 outline-none resize-none bg-stone-800 text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-stone-400 hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Tabs: My Listings vs Tournaments vs Saved */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setProfileTab('my_listings')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              profileTab === 'my_listings'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-950/50'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            My Listings ({myListings.length})
          </button>
          <button
            onClick={() => setProfileTab('my_tournaments')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              profileTab === 'my_tournaments'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-950/50'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            My Tournaments ({myRegisteredTournaments.length})
          </button>
          <button
            onClick={() => setProfileTab('saved')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
              profileTab === 'saved'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-950/50'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            Saved Items ({savedListings.length})
          </button>
        </div>

        {/* Tab Content: My Listings */}
        {profileTab === 'my_listings' && (
          <div className="space-y-4">
            {myListings.length === 0 ? (
              <div className="bg-stone-900 rounded-[2rem] border border-stone-800 p-8 text-center space-y-3 shadow-xl">
                <p className="text-xs sm:text-sm text-stone-400 font-medium">You haven't posted any items or requests yet.</p>
                <button
                  onClick={() => {
                    setCreateListingDefaultType('offer');
                    setCreateListingOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-rose-500 text-white shadow-md hover:bg-rose-600 cursor-pointer"
                >
                  Post your first item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myListings.map(item => (
                  <div
                    key={item.id}
                    className="bg-stone-900 rounded-[2rem] border border-stone-800 p-5 shadow-xl space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {item.type === 'offer' ? 'Offering' : 'Seeking'}
                        </span>
                        <span className="text-[11px] text-stone-400 font-medium">{item.createdAt}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white leading-snug font-display">{item.title}</h4>
                      <p className="text-xs text-stone-400 line-clamp-2 font-medium">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-400">
                        {item.exchangeType === 'giveaway' ? '🎁 Free' : item.exchangeType === 'sell' ? `₹${item.price}` : '🔄 Exchange'}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm("Delete this listing?")) {
                            deleteListing(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: My Tournaments */}
        {profileTab === 'my_tournaments' && (
          <div className="space-y-4">
            {myRegisteredTournaments.length === 0 ? (
              <div className="bg-stone-900 rounded-[2rem] border border-stone-800 p-8 text-center space-y-3 shadow-xl">
                <p className="text-xs sm:text-sm text-stone-400 font-medium">You haven't registered for any sports tournaments or hosted one yet.</p>
                <button
                  onClick={() => setActiveTab('tournaments')}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-md cursor-pointer"
                >
                  Explore Campus Tournaments
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myRegisteredTournaments.map(tourney => (
                  <div
                    key={tourney.id}
                    className="bg-stone-900 rounded-[2rem] border border-stone-800 p-5 shadow-xl space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                          {tourney.sport} • {tourney.teamFormat}
                        </span>
                        <span className="text-[11px] text-stone-400">{tourney.startDate}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white leading-snug">{tourney.title}</h4>
                      <p className="text-xs text-stone-400">{tourney.venue}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">
                        {tourney.prizePool || 'Active Bracket'}
                      </span>
                      <button
                        onClick={() => setActiveTab('tournaments')}
                        className="px-3.5 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-colors"
                      >
                        View League
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Saved Items */}
        {profileTab === 'saved' && (
          <div className="space-y-4">
            {savedListings.length === 0 ? (
              <div className="bg-stone-900 rounded-[2rem] border border-stone-800 p-8 text-center space-y-3 shadow-xl">
                <p className="text-xs sm:text-sm text-stone-400 font-medium">No saved items yet. Browse Explore and click bookmark icons!</p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
                >
                  Browse Explore
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedListings.map(item => (
                  <div
                    key={item.id}
                    className="bg-stone-900 rounded-[2rem] border border-stone-800 p-5 shadow-xl space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">{item.category}</span>
                        <span className="text-[11px] text-stone-400 font-medium">{item.ownerName}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white leading-snug font-display">{item.title}</h4>
                      <p className="text-xs text-stone-400 line-clamp-2 font-medium">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-400">
                        {item.exchangeType === 'giveaway' ? '🎁 Free' : item.exchangeType === 'sell' ? `₹${item.price}` : '🔄 Exchange'}
                      </span>
                      <button
                        onClick={() => setConnectModalTarget({ listing: item })}
                        className="px-4 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
