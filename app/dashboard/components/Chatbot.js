'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Chatbot({ userName, userRole }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Hey ${userName}! 👋 I'm the **Aarohan Assistant**. Ask me anything about events, users, registrations, or logistics. I'll answer based on your access level as a **${userRole}**.` }
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
                setMessages([...newMessages, { role: 'assistant', content: `⚠️ ${data.error || 'Something went wrong.'}` }]);
            } else {
                setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
            }
        } catch (err) {
            toast.error('Network error. Please try again.');
            setMessages([...newMessages, { role: 'assistant', content: '⚠️ Network error. Please check your connection.' }]);
        }

        setLoading(false);
    }

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 ${isOpen
                    ? 'bg-gray-800 text-white rotate-0'
                    : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-purple-300/50'
                    }`}
            >
                {isOpen ? (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-28 right-6 z-50 w-[400px] max-h-[560px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-5 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -m-6"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <span className="text-lg">🤖</span>
                                </div>
                                <div>
                                    <h3 className="font-black text-lg leading-tight">Aarohan Assistant</h3>
                                    <p className="text-[11px] font-medium text-white/70 uppercase tracking-wider">
                                        {userRole} access • AI Powered
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[280px] max-h-[360px] bg-gray-50/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-purple-600 text-white rounded-br-md text-right'
                                    : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-md'
                                    }`}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="font-bold text-base mb-2 border-b pb-1" {...props} />,
                                            table: ({ node, ...props }) => (
                                                <div className="overflow-x-auto my-3">
                                                    <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden" {...props} />
                                                </div>
                                            ),
                                            thead: ({ node, ...props }) => <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500" {...props} />,
                                            th: ({ node, ...props }) => <th className="px-3 py-2 text-left" {...props} />,
                                            td: ({ node, ...props }) => <td className="px-3 py-2 border-t text-[12px]" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-black text-purple-700" {...props} />,
                                            code: ({ node, ...props }) => <code className="bg-gray-100 px-1 rounded font-mono text-xs text-pink-600" {...props} />,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 shadow-sm px-5 py-3 rounded-2xl rounded-bl-md">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about events, users..."
                                disabled={loading}
                                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:opacity-50 placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="w-11 h-11 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
