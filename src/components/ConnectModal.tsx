import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, ShieldCheck, UserCheck, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export const ConnectModal: React.FC = () => {
  const { 
    connectModalTarget, 
    setConnectModalTarget, 
    sendConnectionRequest,
    currentUser,
    setActiveTab 
  } = useApp();

  const [message, setMessage] = useState(
    "Hey! I saw your post on RExchange and think this matches what I'm looking for. Would love to connect and arrange a meetup!"
  );
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!connectModalTarget) return null;

  const targetName = connectModalTarget.listing?.ownerName || connectModalTarget.user?.name || 'Fellow Student';
  const targetId = connectModalTarget.listing?.ownerId || connectModalTarget.user?.id || 'target_user';
  const itemTitle = connectModalTarget.listing?.title || connectModalTarget.customTitle || 'Campus Exchange';
  const listingId = connectModalTarget.listing?.id;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const success = await sendConnectionRequest(
      targetId,
      targetName,
      message,
      listingId,
      itemTitle
    );

    setSending(false);
    if (success) {
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setConnectModalTarget(null);
        setActiveTab('messages');
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-stone-900 rounded-[2.5rem] max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-stone-200 dark:border-stone-800 transition-colors"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-rose-500" />
            <h3 className="font-black text-base sm:text-lg text-stone-900 dark:text-white font-display">
              Connect with {targetName.split(' ')[0]}
            </h3>
          </div>
          <button
            onClick={() => setConnectModalTarget(null)}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-black text-base text-stone-900 dark:text-white font-display">
              Connection Request Sent! 🎉
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Opening your messages thread now...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4 text-xs sm:text-sm">
            
            {/* Target Item Reference Box */}
            <div className="p-3.5 bg-rose-50/70 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900">
              <p className="text-[10px] font-black text-rose-900 dark:text-rose-300 uppercase tracking-wider">Regarding:</p>
              <p className="font-bold text-stone-900 dark:text-white text-xs sm:text-sm mt-0.5">{itemTitle}</p>
            </div>

            {/* Note Field */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-stone-700 dark:text-stone-300 block">
                Introduce yourself & your exchange proposal:
              </label>
              <textarea
                rows={4}
                required
                id="connect-message-input"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write a friendly note..."
                className="w-full p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 focus:border-rose-500 outline-hidden text-xs sm:text-sm text-stone-800 dark:text-stone-100 resize-none bg-stone-50/50 dark:bg-stone-800"
              />
            </div>

            {/* Privacy Protection Callout */}
            <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 flex items-start gap-2.5 text-xs text-stone-600 dark:text-stone-400 font-medium">
              <Lock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-900 dark:text-white">Privacy First: </span>
                <span>Personal phone numbers & Discord handles remain private until {targetName.split(' ')[0]} accepts your request.</span>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConnectModalTarget(null)}
                className="px-5 py-2.5 rounded-full font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="confirm-send-connection-button"
                disabled={sending || !message.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-900 dark:bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm shadow-2xs active:scale-95 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4 text-rose-300 dark:text-white" />
                <span>{sending ? 'Sending...' : 'Send Request'}</span>
              </button>
            </div>

          </form>
        )}

      </motion.div>
    </div>
  );
};
