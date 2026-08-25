import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SRM_CAMPUS_LOCATIONS } from '../types';
import { 
  X, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  Mail, 
  IdCard,
  Phone,
  Building2,
  GraduationCap,
  MapPin,
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LoginModal: React.FC = () => {
  const { 
    loginModalOpen, 
    setLoginModalOpen, 
    authModalMode,
    setAuthModalMode,
    login, 
    register 
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regNo, setRegNo] = useState(''); // e.g. RA2311003010123
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState(''); // Indian 10-digit mobile / WhatsApp number
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regYear, setRegYear] = useState<'1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Postgrad'>('2nd Year');
  const [regZone, setRegZone] = useState('Tech Park');
  const [regSkillsOffered, setRegSkillsOffered] = useState('');
  const [regSkillsNeeded, setRegSkillsNeeded] = useState('');

  if (!loginModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!loginId.trim() || !loginPassword) {
      setErrorMessage('Please enter your College Registration Number, Email, or Mobile Number, and Password.');
      return;
    }
    setLoading(true);
    const result = await login(loginId.trim(), loginPassword);
    setLoading(false);
    if (!result.success) {
      setErrorMessage(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }

    if (!regNo.trim()) {
      setErrorMessage('College Registration Number is required (e.g. RA2311003010123).');
      return;
    }

    if (!regEmail.trim()) {
      setErrorMessage('Email address is required.');
      return;
    }

    const cleanPhone = regMobile.replace(/\D/g, '');
    if (!regMobile.trim() || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for verified campus exchanges.');
      return;
    }

    if (!regPassword) {
      setErrorMessage('Password is required.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-check.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: regName.trim(),
      regNo: regNo.trim().toUpperCase(),
      email: regEmail.trim(),
      mobileNumber: regMobile.trim(),
      password: regPassword,
      confirmPassword: regConfirmPassword,
      department: regDept,
      year: regYear,
      campusZone: regZone,
      skillsOffered: regSkillsOffered.split(',').map(s => s.trim()).filter(Boolean),
      skillsNeeded: regSkillsNeeded.split(',').map(s => s.trim()).filter(Boolean),
    });
    setLoading(false);
    if (!result.success) {
      setErrorMessage(result.error || 'Registration failed.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-stone-900 text-stone-100 rounded-3xl shadow-2xl border border-stone-800 overflow-hidden my-8"
        >
          {/* Top banner accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 to-rose-600" />

          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-stone-800 bg-stone-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-rose-950/50">
                R
              </div>
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <span>{authModalMode === 'register' ? 'Register Account' : 'Student Sign In'}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    SRM KTR
                  </span>
                </h3>
                <p className="text-xs text-stone-400">
                  SRM Institute of Science and Technology • Kattankulathur
                </p>
              </div>
            </div>
            <button
              onClick={() => setLoginModalOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-stone-800 bg-stone-950/40">
            <button
              onClick={() => { setAuthModalMode('register'); setErrorMessage(''); }}
              className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                authModalMode === 'register'
                  ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                  : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/30'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
            <button
              onClick={() => { setAuthModalMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                authModalMode === 'login'
                  ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                  : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/30'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </div>

          <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {authModalMode === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5 flex items-center justify-between">
                    <span>Email, Reg Number, or Mobile Number</span>
                    <span className="text-[10px] text-stone-500 font-normal">e.g. RA2311003010123</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="Email, Reg No, or Mobile No"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-800/80 border border-stone-700 text-white text-xs sm:text-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60 focus:border-rose-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-800/80 border border-stone-700 text-white text-xs sm:text-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60 focus:border-rose-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 mt-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to RExchange</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <p className="text-xs text-stone-400">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthModalMode('register'); setErrorMessage(''); }}
                      className="text-rose-400 hover:underline font-bold"
                    >
                      Create your SRM profile
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800/80 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5 flex items-center justify-between">
                      <span>College Reg No. *</span>
                      <span className="text-[10px] text-amber-400 font-mono">Unique</span>
                    </label>
                    <div className="relative">
                      <IdCard className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                        placeholder="e.g. RA2311003010123"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-stone-800/80 border border-stone-700 text-white font-mono text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60 uppercase"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5 flex items-center justify-between">
                      <span>Email Address *</span>
                      <span className="text-[10px] text-stone-500 font-normal">SRM or personal email</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. student@srmist.edu.in"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-stone-800/80 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5 flex items-center justify-between">
                      <span>Mobile / WhatsApp *</span>
                      <span className="text-[10px] text-emerald-400 font-mono">10 Digits</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center gap-1 pointer-events-none text-stone-400 text-xs font-bold font-mono">
                        <Phone className="w-3.5 h-3.5 text-stone-500" />
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        value={regMobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setRegMobile(val);
                        }}
                        placeholder="9876543210"
                        className="w-full pl-16 pr-3.5 py-2.5 rounded-2xl bg-stone-800/80 border border-stone-700 text-white font-mono text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5">
                      Password *
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-stone-800/80 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-type password"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-stone-800/80 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5">
                      Department
                    </label>
                    <select
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Electrical & Electronics">Electrical & Electronics</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="Aerospace Engineering">Aerospace Engineering</option>
                      <option value="Management & Commerce">Management & Commerce</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5">
                      Academic Year
                    </label>
                    <select
                      value={regYear}
                      onChange={(e) => setRegYear(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/60"
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
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Primary Campus Hub / Hostel
                  </label>
                  <select
                    value={regZone}
                    onChange={(e) => setRegZone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                  >
                    {SRM_CAMPUS_LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5">
                      Skills / Things You Can Offer
                    </label>
                    <input
                      type="text"
                      value={regSkillsOffered}
                      onChange={(e) => setRegSkillsOffered(e.target.value)}
                      placeholder="e.g. Python, UI Design, Cricket Gear"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800/80 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1.5">
                      Skills / Items You Need
                    </label>
                    <input
                      type="text"
                      value={regSkillsNeeded}
                      onChange={(e) => setRegSkillsNeeded(e.target.value)}
                      placeholder="e.g. DSA Help, Calculator, Notes"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-800/80 border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 mt-4 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Real SRM Student Account</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <p className="text-xs text-stone-400">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthModalMode('login'); setErrorMessage(''); }}
                      className="text-rose-400 hover:underline font-bold"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
