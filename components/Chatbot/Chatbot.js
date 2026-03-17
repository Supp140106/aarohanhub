'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, Send, X, MessageSquare, Sparkles, Shield, User } from 'lucide-react';

export default function Chatbot({ userName, userRole }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Greetings **${userName}**. Mission Control assistant online. I have analyzed your **${userRole}** clearance level. How can I assist with your Aarohan 2026 operations today?` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    async function handleSend(e) {
        e?.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMessage = { role: 'user', content: trimmed };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: trimmed,
                    history: newMessages.slice(1).map(m => ({ role: m.role, content: m.content })),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Chatbot error.');
                setMessages([...newMessages, { role: 'assistant', content: `⚠️ **ERROR:** ${data.error || 'Connection failure.'}` }]);
            } else {
                setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
            }
        } catch (err) {
            toast.error('Network error. Pulse lost.');
            setMessages([...newMessages, { role: 'assistant', content: '⚠️ **CRITICAL:** Network synchronization failed.' }]);
        }

        setLoading(false);
    }

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all transform hover:scale-110 active:scale-95 group ${isOpen
                    ? 'bg-white/10 text-white backdrop-blur-xl border border-white/20'
                    : 'bg-gradient-to-br from-[#00F0FF] to-[#7000FF] text-black shadow-[#00F0FF]/20'
                    }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <div className="relative">
                      <MessageSquare className="w-6 h-6" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#39FF14] rounded-full border-2 border-black animate-pulse"></div>
                    </div>
                )}
                
                {!isOpen && (
                  <div className="absolute right-20 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black tracking-widest text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Launch AI Link
                  </div>
                )}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-28 right-6 z-50 w-[400px] max-h-[600px] card-glass flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 slide-in-from-right-4 duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10">
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#00F0FF]/10 to-[#7000FF]/10 backdrop-blur-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-[#00F0FF] shadow-inner">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-base tracking-tight uppercase">MISSION_ASSIST_v4</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse"></div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                            {userRole} CLEARANCE • ENIGMA CORE
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Sparkles className="w-4 h-4 text-[#7000FF] animate-bounce" />
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[300px] max-h-[400px] custom-scrollbar bg-black/20">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                                <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'border-[#7000FF]/30 bg-[#7000FF]/10 text-[#7000FF]' : 'border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF]'}`}>
                                        {msg.role === 'user' ? <User className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                                    </div>
                                    <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed font-medium ${msg.role === 'user'
                                        ? 'bg-white/5 text-white border border-white/10 rounded-tr-sm shadow-sm'
                                        : 'bg-[#00F0FF]/5 text-gray-300 border border-[#00F0FF]/10 rounded-tl-sm'
                                        }`}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="font-black text-white text-[10px] uppercase tracking-widest mb-2 mt-4 first:mt-0 border-b border-white/5 pb-1" {...props} />,
                                                table: ({ node, ...props }) => (
                                                    <div className="overflow-x-auto my-4 rounded-xl border border-white/5">
                                                        <table className="min-w-full divide-y divide-white/5 bg-black/40" {...props} />
                                                    </div>
                                                ),
                                                thead: ({ node, ...props }) => <thead className="bg-white/5 text-[9px] uppercase font-black text-gray-500 tracking-widest" {...props} />,
                                                th: ({ node, ...props }) => <th className="px-3 py-2 text-left" {...props} />,
                                                td: ({ node, ...props }) => <td className="px-3 py-2 border-t border-white/5 text-[10px] text-gray-400 font-mono" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-black text-[#00F0FF]" {...props} />,
                                                code: ({ node, ...props }) => <code className="bg-white/5 px-1.5 py-0.5 rounded font-mono text-[10px] text-[#7000FF]" {...props} />,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start animate-in">
                                <div className="flex gap-3">
                                  <div className="mt-1 w-6 h-6 rounded-lg border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center">
                                      <Shield className="w-3 h-3" />
                                  </div>
                                  <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl rounded-tl-sm">
                                      <div className="flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                          <div className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                          <div className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                      </div>
                                  </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-6 bg-black/40 border-t border-white/10">
                        <form onSubmit={handleSend} className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Transmit query..."
                                disabled={loading}
                                className="w-full pl-6 pr-14 py-4 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00F0FF]/50 focus:border-[#00F0FF]/50 transition-all disabled:opacity-50 font-mono"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="absolute right-2 top-2 w-10 h-10 bg-[#00F0FF] text-black rounded-lg flex items-center justify-center hover:bg-[#00C2CC] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                        <div className="mt-3 flex items-center justify-center gap-4">
                          <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">SECURE_CONNECTION_ENCRYPTED</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
