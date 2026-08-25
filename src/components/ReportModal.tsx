import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flag, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const ReportModal: React.FC = () => {
  const { reportModalTarget, setReportModalTarget } = useApp();
  const [reason, setReason] = useState('Prohibited item or violation');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!reportModalTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReportModalTarget(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-stone-900 rounded-[2.5rem] max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-stone-200 dark:border-stone-800"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <h3 className="font-black text-base text-stone-900 dark:text-white font-display">
              Report Campus Listing
            </h3>
          </div>
          <button
            onClick={() => setReportModalTarget(null)}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="font-bold text-sm text-stone-900 dark:text-white">Thank you for reporting</p>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Our campus trust and safety team has been alerted.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
              Reporting: <strong className="text-stone-900 dark:text-white">"{reportModalTarget.title}"</strong>
            </p>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300 block">Reason for report</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs outline-hidden bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              >
                <option value="Prohibited item or violation">Prohibited item / safety violation</option>
                <option value="Spam or duplicate listing">Spam or duplicate listing</option>
                <option value="Incorrect details or misleading">Incorrect details or misleading</option>
                <option value="Item already claimed / inactive">Item already claimed / inactive</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 dark:text-stone-300 block">Additional details (Optional)</label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Briefly explain what's wrong..."
                className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs outline-hidden resize-none bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportModalTarget(null)}
                className="px-5 py-2.5 rounded-full font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

