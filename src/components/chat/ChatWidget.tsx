'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getChatContacts, getMessages, sendMessage, markAsRead } from '@/app/actions/chat';

type Contact = { id: string; name: string; role: string; email: string; university?: { name: string } | null };
type Message = { id: string; content: string; createdAt: Date; senderId: string; receiverId: string; read: boolean };

export default function ChatWidget({ currentUser }: { currentUser: { id: string, role: string, name: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load contacts
  useEffect(() => {
    getChatContacts().then(setContacts);
  }, []);

  const refreshChat = async (showLoading = true) => {
    if (!selectedContact) return;
    if (showLoading) setIsRefreshing(true);
    try {
      const msgs = await getMessages(selectedContact.id);
      setMessages(prev => {
        const optimistic = prev.filter(m => m.id.startsWith('temp-'));
        // Prevent duplicate bubbles by filtering out optimistic messages that are already in the DB response
        const trulyOptimistic = optimistic.filter(opt => {
          return !msgs.some(dbMsg => dbMsg.senderId === opt.senderId && dbMsg.content === opt.content);
        });
        return [...msgs, ...trulyOptimistic];
      });
      markAsRead(selectedContact.id);
      setUnreadCounts(prev => ({ ...prev, [selectedContact.id]: 0 }));
    } finally {
      if (showLoading) setIsRefreshing(false);
    }
  };

  // Auto-refresh chat every 2 seconds when contact is selected
  useEffect(() => {
    if (selectedContact) {
      setMessages([]); // instantly clear previous messages while loading
      refreshChat(true);

      let isPolling = false;
      const interval = setInterval(async () => {
        if (isPolling) return;
        isPolling = true;
        try {
          await refreshChat(false);
        } finally {
          isPolling = false;
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [selectedContact]);

  // Scroll to bottom only when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages.length, isOpen]);

  // Listen for new messages
  useEffect(() => {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ChatMessage' },
        (payload) => {
          const newMsg = payload.new as Message;
          // Parse date
          newMsg.createdAt = new Date(newMsg.createdAt);

          // If the message involves us
          if (newMsg.receiverId === currentUser.id) {
            // Incoming message
            if (selectedContact?.id === newMsg.senderId && isOpen) {
              // We are looking at this chat, so append and mark read
              setMessages(prev => [...prev, newMsg]);
              markAsRead(newMsg.senderId);
            } else {
              // We are not looking, bump unread count
              setUnreadCounts(prev => ({
                ...prev,
                [newMsg.senderId]: (prev[newMsg.senderId] || 0) + 1
              }));
            }
          } else if (newMsg.senderId === currentUser.id) {
            // Outgoing message (e.g. from another tab)
            if (selectedContact?.id === newMsg.receiverId) {
              setMessages(prev => {
                if (prev.some(m => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser.id, selectedContact, isOpen, supabase]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedContact) return;
    
    const content = inputText.trim();
    setInputText('');
    
    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const tempMsg: Message = {
      id: tempId,
      content,
      createdAt: new Date(),
      senderId: currentUser.id,
      receiverId: selectedContact.id,
      read: false
    };
    
    setMessages(prev => [...prev, tempMsg]);
    
    try {
      const msg = (await sendMessage(selectedContact.id, content)) as unknown as Message;
      setMessages(prev => {
        // If realtime beat us and already inserted the real message
        if (prev.some(m => m.id === msg.id)) {
          return prev.filter(m => m.id !== tempId);
        }
        // Otherwise replace the optimistic message with the real one
        return prev.map(m => m.id === tempId ? msg : m);
      });
    } catch (err) {
      console.error("Failed to send", err);
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  const totalUnread = Object.values(unreadCounts).reduce((a,b) => a+b, 0);

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#554093] rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-105 transition-transform z-50 group"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        {totalUnread > 0 && (
          <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
            {totalUnread}
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-white rounded-3xl shadow-[0_8px_40px_rgba(85,64,147,0.12)] border border-[#554093]/10 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#554093] text-white p-4 flex items-center justify-between shadow-md z-10 shrink-0">
            {selectedContact ? (
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedContact(null)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex items-center gap-2">
                  <div>
                    <h3 className="font-bold text-sm">{selectedContact.name}</h3>
                    <p className="text-[10px] text-white/70 uppercase tracking-widest">{selectedContact.role.replace('_', ' ')}</p>
                  </div>
                  <button 
                    onClick={() => refreshChat(true)} 
                    disabled={isRefreshing}
                    className="ml-2 hover:bg-white/10 p-1.5 rounded-full transition-colors disabled:opacity-50"
                    title="Refresh Chat"
                  >
                    <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-sm">EventHub Comm</h3>
                <p className="text-[10px] text-white/70 uppercase tracking-widest">Internal Team Chat</p>
              </div>
            )}
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {!selectedContact ? (
            /* Contact List */
            <div className="flex-1 min-h-0 overflow-y-auto bg-[#FDFBF7] p-2 space-y-1">
              {contacts.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedContact(c)}
                  className="w-full text-left p-3 rounded-2xl hover:bg-white border border-transparent hover:border-[#554093]/10 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-sm text-[#554093]">{c.name}</div>
                    <div className="text-[11px] text-[#554093]/50 font-medium uppercase">{c.role.replace('_', ' ')}</div>
                  </div>
                  {unreadCounts[c.id] > 0 && (
                    <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCounts[c.id]}
                    </div>
                  )}
                </button>
              ))}
              {contacts.length === 0 && (
                <div className="p-8 text-center text-[#554093]/40 text-sm font-medium">
                  No contacts available.
                </div>
              )}
            </div>
          ) : (
            /* Chat Interface */
            <div className="flex-1 min-h-0 flex flex-col bg-[#FDFBF7]">
              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 flex flex-col custom-scrollbar">
                {messages.map((m, i) => {
                  const isMe = m.senderId === currentUser.id;
                  return (
                    <div key={m.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-[#554093] text-white rounded-br-sm' : 'bg-white border border-[#554093]/10 text-[#554093] rounded-bl-sm'}`}>
                        {m.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#554093]/10 flex gap-2 items-center shrink-0">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-[#FDFBF7] border border-[#554093]/10 rounded-full px-4 py-2 text-sm outline-none focus:border-[#554093]/30 text-[#554093]"
                />
                <button type="submit" disabled={!inputText.trim()} className="bg-[#554093] text-white p-2 rounded-full hover:bg-[#433275] transition-colors disabled:opacity-50">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
