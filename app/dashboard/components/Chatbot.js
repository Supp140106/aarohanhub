"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Send, Sparkles, Terminal, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot({ userName, userRole }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            role: 'assistant', 
            content: `Greetings, ${userName}. I am the Aarohan UI Intelligence node. I can assist you with events, user queries, registrations, and logistics based on your **${userRole}** access parameters. How may I be of service?`
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading, scrollToBottom]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    async function handleSend(e) {
        e?.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMessage = { role: 'user', content: trimmed };
        const history = [...messages, userMessage];
        
        setMessages(history);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: trimmed,
                    history: messages.slice(1).map(m => ({ role: m.role, content: m.content })),
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                toast.error(errorData.error || 'Chatbot error.');
                setMessages([...history, { role: 'assistant', content: `Error: ${errorData.error || 'Connection terminated.'}` }]);
                setLoading(false);
                return;
            }

            // Create placeholder for streaming response
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
            
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedText += chunk;
                
                setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1].content = accumulatedText;
                    return newMsgs;
                });
            }
        } catch {
            toast.error('Network error. Please try again.');
            setMessages(prev => {
               // if it failed midway
               if(prev[prev.length-1].role === 'assistant' && prev[prev.length-1].content === '') {
                 const newMsgs = [...prev];
                 newMsgs[newMsgs.length-1].content = 'Error: Network instability detected. Please check your connection.';
                 return newMsgs;
               }
               return [...prev, { role: 'assistant', content: 'Error: Network instability detected. Please check your connection.' }];
            });
        }

        setLoading(false);
    }

    return (
        <>
            {/* Minimalist Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all border duration-300 ${isOpen
                    ? 'bg-[#1a1a1a] text-gray-400 border-[#333] hover:text-white'
                    : 'bg-[#0f0f0f] text-gray-200 border-[#333] hover:border-gray-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                    }`}
            >
                {isOpen ? (
                    <X className="w-5 h-5" />
                ) : (
                    <Sparkles className="w-5 h-5" />
                )}
            </button>

            {/* Anthropic/Claude Style Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed bottom-24 right-6 z-50 w-[420px] max-h-[600px] h-[80vh] bg-[#0f0f0f] rounded-2xl shadow-2xl shadow-black/80 border border-[#222] flex flex-col font-sans overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#222] bg-[#141414]">
                            <div className="w-8 h-8 rounded-lg bg-[#1e1e1e] border border-[#333] flex items-center justify-center text-gray-300 shadow-inner">
                                <Cpu className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-200 text-sm">Aarohan AI</h3>
                                <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                                    auth_level: {userRole}
                                </p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 bg-[#0a0a0a]">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    {msg.role === 'assistant' && (
                                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span className="text-[11px] font-medium tracking-wide uppercase">Assistant</span>
                                        </div>
                                    )}
                                    {msg.role === 'user' && (
                                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                                            <span className="text-[11px] font-medium tracking-wide uppercase">You</span>
                                            <Terminal className="w-3.5 h-3.5" />
                                        </div>
                                    )}
                                    
                                    <div className={`max-w-[88%] text-[14.5px] leading-[1.6] ${msg.role === 'user'
                                        ? 'bg-[#1e1e1e] text-gray-200 px-4 py-2.5 rounded-2xl rounded-tr-sm border border-[#333]'
                                        : 'text-gray-300 px-1'
                                        }`}>
                                        
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-4 last:mb-0 leading-relaxed" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="font-semibold text-lg mb-2 mt-4 text-gray-200" {...props} />,
                                                table: ({ node, ...props }) => (
                                                    <div className="overflow-x-auto my-4 border border-[#333] rounded-lg">
                                                        <table className="min-w-full divide-y divide-[#333]" {...props} />
                                                    </div>
                                                ),
                                                thead: ({ node, ...props }) => <thead className="bg-[#1a1a1a] text-xs font-semibold text-gray-400 uppercase tracking-wider" {...props} />,
                                                th: ({ node, ...props }) => <th className="px-4 py-3 text-left" {...props} />,
                                                td: ({ node, ...props }) => <td className="px-4 py-3 border-t border-[#333] text-sm text-gray-300" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                                                code: ({ node, inline, ...props }) => 
                                                    inline 
                                                    ? <code className="bg-[#222] border border-[#333] px-1.5 py-0.5 rounded font-mono text-[13px] text-gray-200" {...props} />
                                                    : <code className="block bg-[#111] border border-[#222] p-3 rounded-lg font-mono text-[13px] text-gray-300 overflow-x-auto my-3" {...props} />
                                                ,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2 mb-2 text-gray-500">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-medium tracking-wide uppercase">Assistant processing</span>
                                    </div>
                                    <div className="px-1 py-2 flex items-center gap-1.5">
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-1" />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[#141414] border-t border-[#222]">
                            <form onSubmit={handleSend} className="relative flex items-center bg-[#1e1e1e] border border-[#333] rounded-xl focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500/20 transition-all shadow-inner">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Message Aarohan AI..."
                                    disabled={loading}
                                    className="flex-1 bg-transparent px-4 py-3.5 text-[14px] text-gray-200 placeholder-gray-500 outline-none disabled:opacity-50"
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="absolute right-2 p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                            <div className="text-center mt-3 text-[10px] text-gray-600 font-medium">
                                AI can make mistakes. Verify important information.
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
