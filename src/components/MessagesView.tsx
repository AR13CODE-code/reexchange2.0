import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Check, 
  X, 
  Send, 
  ShieldCheck, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ConnectionRequest } from '../types';

export const MessagesView: React.FC = () => {
  const { 
    connections, 
    currentUser, 
    respondConnectionRequest, 
    sendChatMessage,
    activeChatConnection,
    setActiveChatConnection,
    setActiveTab
  } = useApp();

  const [chatInput, setChatInput] = useState('');

  // Selected thread: always derive directly from latest connections state
  const selectedConn = 
    connections.find(c => c.id === activeChatConnection?.id) || 
    connections.find(c => c.status === 'accepted') || 
    connections[0];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedConn) return;

    await sendChatMessage(selectedConn.id, chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-display tracking-tight">
          Campus Connections & Messages
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
          Safe student-to-student requests. Contact handles are shared only once mutually accepted.
        </p>
      </div>

      {connections.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center mx-auto">
            <MessageSquare className="w-7 h-7 text-rose-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-stone-900 dark:text-white font-display">
              No connections yet 🌱
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Browse campus listings or run SmartMatch to find peers and send your first connection request!
            </p>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-stone-900 dark:bg-rose-500 hover:bg-rose-600 text-white shadow-2xs transition-colors"
          >
            Explore Listings
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white dark:bg-stone-900 rounded-[2.2rem] border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden min-h-[550px] transition-colors">
          
          {/* Left Connection List Column */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-stone-800 p-4 space-y-3 bg-stone-50/50 dark:bg-stone-950/40">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 dark:border-stone-800 px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                All Requests ({connections.length})
              </span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {connections.map((conn) => {
                const isIncoming = conn.toUserId === currentUser.id;
                const otherUserName = isIncoming ? conn.fromUserName : conn.toUserName;
                const otherUserAvatar = isIncoming ? conn.fromUserAvatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                const isSelected = selectedConn && selectedConn.id === conn.id;

                return (
                  <div
                    key={conn.id}
                    onClick={() => setActiveChatConnection(conn)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-stone-800 border-rose-400 dark:border-rose-500 shadow-xs ring-1 ring-rose-400'
                        : 'bg-white/90 dark:bg-stone-850 dark:bg-stone-900/90 border-stone-200/70 dark:border-stone-800 hover:bg-white dark:hover:bg-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={otherUserAvatar}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700"
                        />
                        <div>
                          <p className="font-bold text-xs text-stone-900 dark:text-white leading-tight">
                            {otherUserName}
                          </p>
                          <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                            {isIncoming ? `${conn.fromUserDept} • ${conn.fromUserYear}` : 'Outgoing request'}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        conn.status === 'accepted'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : conn.status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                      }`}>
                        {conn.status === 'accepted' ? 'Accepted' : conn.status === 'pending' ? 'Pending' : 'Declined'}
                      </span>
                    </div>

                    {conn.listingTitle && (
                      <p className="text-[11px] font-semibold text-rose-800 dark:text-rose-300 mt-2 truncate bg-rose-50/70 dark:bg-rose-950/50 px-2.5 py-1 rounded-xl">
                        📌 {conn.listingTitle}
                      </p>
                    )}

                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1.5 line-clamp-1 font-medium">
                      {conn.messages.length > 0 ? conn.messages[conn.messages.length - 1].text : conn.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Active Chat / Details Column */}
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-4">
            {selectedConn ? (
              <>
                {/* Header of Active Thread */}
                <div className="space-y-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedConn.toUserId === currentUser.id ? selectedConn.fromUserAvatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-stone-200 dark:ring-stone-700"
                      />
                      <div>
                        <h3 className="font-black text-sm sm:text-base text-stone-900 dark:text-white font-display">
                          {selectedConn.toUserId === currentUser.id ? selectedConn.fromUserName : selectedConn.toUserName}
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                          {selectedConn.listingTitle ? `Regarding: ${selectedConn.listingTitle}` : 'Direct Campus Connection'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-stone-400 font-medium">{selectedConn.createdAt}</span>
                    </div>
                  </div>

                  {/* Accept / Decline Action Bar for Incoming Requests */}
                  {selectedConn.toUserId === currentUser.id && selectedConn.status === 'pending' && (
                    <div className="p-4 bg-stone-50 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-xs text-stone-900 dark:text-white text-left">
                        <p className="font-bold">Accept this student connection request?</p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Your campus handle will be shared for meetup.</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => respondConnectionRequest(selectedConn.id, 'declined')}
                          className="px-4 py-1.5 rounded-full text-xs font-bold text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-600"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => respondConnectionRequest(selectedConn.id, 'accepted')}
                          className="px-5 py-1.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Revealed Contact Information upon Acceptance */}
                  {selectedConn.status === 'accepted' && (
                    <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <span className="font-bold">Verified Campus Handle: </span>
                          <span className="font-mono bg-white dark:bg-stone-800 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-700">
                            {selectedConn.contactInfoIfAccepted || 'student.contact@srmist.edu.in'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-black uppercase tracking-wider">
                        Active Connection
                      </span>
                    </div>
                  )}
                </div>

                {/* Chat Messages Log */}
                <div className="flex-1 space-y-3 max-h-[300px] overflow-y-auto p-2">
                  {/* Initial connection request note */}
                  <div className="bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-700 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Connection Note</span>
                    <p className="text-stone-700 dark:text-stone-200 italic font-medium">"{selectedConn.message}"</p>
                  </div>

                  {selectedConn.messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id || msg.senderName === currentUser.name;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm ${
                          isMe
                            ? 'bg-stone-900 dark:bg-rose-500 text-white rounded-br-xs'
                            : 'bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 rounded-bl-xs'
                        }`}>
                          <p className="font-medium">{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-stone-400 mt-1 px-1 font-medium">{msg.timestamp}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Chat Input form */}
                {selectedConn.status === 'accepted' ? (
                  <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <input
                      type="text"
                      id="chat-message-input"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="Type a message (e.g. Can we meet at Central Library 2nd floor at 4 PM?)..."
                      className="flex-1 p-3.5 rounded-full border border-stone-200 dark:border-stone-700 focus:border-rose-500 outline-hidden text-xs sm:text-sm bg-stone-50/50 dark:bg-stone-800 dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="p-3.5 rounded-full bg-stone-900 dark:bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-40 transition-colors shadow-2xs"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="p-3.5 bg-stone-100 dark:bg-stone-800/70 rounded-2xl text-center text-xs text-stone-500 dark:text-stone-400 font-medium">
                    {selectedConn.status === 'pending' 
                      ? '🔒 Live messaging unlocks as soon as the connection request is accepted.' 
                      : 'This connection request was declined.'}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-stone-400 text-xs">
                Select a connection request to view chat.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};


