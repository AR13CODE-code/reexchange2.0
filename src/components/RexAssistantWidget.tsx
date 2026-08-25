import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Loader2, 
  HelpCircle, 
  Compass, 
  BookOpen, 
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const RexAssistantWidget: React.FC = () => {
  const { rexOpen, setRexOpen, askRexAI, setActiveTab } = useApp();
  const [messages, setMessages] = useState<{ sender: 'rex' | 'user'; text: string }[]>([
    {
      sender: 'rex',
      text: "Hey! I'm Rex 🤖, your campus exchange buddy at SRM IST Kattankulathur. Looking for a textbook, drafter, hostel essentials, tutoring help, or want to give something forward?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Who can teach Figma at SRM?",
    "Where can I find DSA or OS notes?",
    "Any free giveaways right now?",
    "How does Skill Swap work?"
  ];

  const handleSend = async (promptText?: string) => {
    const query = promptText || input;
    if (!query.trim() || loading) return;

    const userMsg = query.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const reply = await askRexAI(userMsg);
      setMessages(prev => [...prev, { sender: 'rex', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'rex', text: "Hmm, I couldn't reach the campus database right now. Feel free to explore listings directly!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Rex Trigger Button */}
      <motion.button
        id="rex-assistant-trigger-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setRexOpen(!rexOpen)}
        className="fixed bottom-20 lg:bottom-6 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-stone-900 dark:bg-rose-500 text-white shadow-xl border-2 border-white dark:border-stone-800 group"
        title="Ask Rex Campus AI"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 dark:bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-400 dark:bg-white"></span>
        </span>
        <Bot className="w-5 h-5 text-rose-400 dark:text-white" />
        <span className="font-extrabold text-xs sm:text-sm tracking-wide font-display">
          Ask Rex 🤖
        </span>
      </motion.button>

      {/* Rex Chat Window Popup */}
      <AnimatePresence>
        {rexOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 lg:bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 bg-white dark:bg-stone-900 rounded-[2rem] shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col h-[480px]"
          >
            {/* Rex Header */}
            <div className="bg-stone-900 dark:bg-stone-950 text-white p-4 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                  🤖
                </div>
                <div>
                  <h3 className="font-black text-sm text-white font-display leading-tight">
                    Rex • SRM Campus AI
                  </h3>
                  <p className="text-[11px] text-rose-300">
                    Always online for campus questions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRexOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-[#FDFCF6]/50 dark:bg-stone-950/50">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-rose-500 text-white rounded-br-xs'
                        : 'bg-white dark:bg-stone-800 border border-stone-200/90 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    <p>{m.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-1.5 text-xs text-stone-400 pl-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                  <span>Rex is checking SRM campus records...</span>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="px-3 py-2 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-300 text-stone-600 dark:text-stone-300 font-medium whitespace-nowrap transition-colors border border-stone-200 dark:border-stone-700"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-2.5 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2"
            >
              <input
                type="text"
                id="rex-chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Rex anything about SRM..."
                className="flex-1 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:border-rose-500 outline-hidden text-xs text-stone-800 dark:text-stone-100 bg-stone-50 dark:bg-stone-800"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-stone-900 dark:bg-rose-500 text-white hover:bg-stone-800 dark:hover:bg-rose-600 disabled:opacity-40 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

