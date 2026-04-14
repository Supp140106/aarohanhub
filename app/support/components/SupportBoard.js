'use client';

import { useState } from 'react';
import { submitQuery, answerQuery } from '@/app/actions/support';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { MessageSquarePlus, Send, MessageCircleQuestion, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function SupportBoard({ initialQueries, isStaff, userName, userRole }) {
    const [queries, setQueries] = useState(initialQueries);
    const [newQuestion, setNewQuestion] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    // For staff answering
    const [answers, setAnswers] = useState({});
    const [answeringIds, setAnsweringIds] = useState(new Set());

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!newQuestion.trim()) return;

        setSubmitting(true);
        const questionText = newQuestion.trim();
        const formData = new FormData();
        formData.append('question', questionText);
        
        // Optimistic add
        const tempId = Date.now();
        const optimisticQuery = {
            id: tempId,
            question: questionText,
            answer: null,
            createdAt: new Date().toISOString(),
            authorName: userName,
            authorRole: userRole,
            isOptimistic: true
        };
        
        setQueries(prev => [optimisticQuery, ...prev]);
        setNewQuestion('');
        
        try {
            const res = await submitQuery(formData);
            if (res?.error) {
                toast.error(res.error);
                setQueries(prev => prev.filter(q => q.id !== tempId));
                setNewQuestion(questionText);
            } else {
                toast.success("Question submitted successfully!");
                // We could replace the tempId with the real one if we got it back, 
                // but since we're using revalidatePath, the next data load will sync.
                // For now, we'll just keep it until the next page load or fetch.
            }
        } catch (e) {
            toast.error("Network error.");
            setQueries(prev => prev.filter(q => q.id !== tempId));
            setNewQuestion(questionText);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAnswerSubmit = async (queryId) => {
        const answerText = answers[queryId];
        if (!answerText?.trim()) return;

        setAnsweringIds(prev => new Set(prev).add(queryId));
        
        const oldAnswer = queries.find(q => q.id === queryId)?.answer;
        
        // Optimistic answer
        setQueries(prev => prev.map(q => 
            q.id === queryId ? { ...q, answer: answerText.trim() } : q
        ));

        const formData = new FormData();
        formData.append('queryId', queryId);
        formData.append('answer', answerText);
        
        try {
            const res = await answerQuery(formData);
            if (res?.error) {
                toast.error(res.error);
                // Rollback
                setQueries(prev => prev.map(q => 
                    q.id === queryId ? { ...q, answer: oldAnswer } : q
                ));
            } else {
                toast.success("Answer posted successfully!");
            }
        } catch (e) {
            toast.error("Network error.");
            setQueries(prev => prev.map(q => 
                q.id === queryId ? { ...q, answer: oldAnswer } : q
            ));
        } finally {
            setAnsweringIds(prev => {
                const next = new Set(prev);
                next.delete(queryId);
                return next;
            });
        }
    };

    return (
        <div className="flex flex-col gap-12 w-full">
            
            {/* Ask Question Form (For Participants) */}
            {!isStaff && (
                <ScrollReveal>
                    <div className="bg-transparent border border-[#00F0FF]/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,240,255,0.05)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/10 flex items-center justify-center">
                                <MessageSquarePlus className="w-6 h-6 text-[#00F0FF]" />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-widest">Ask a Question</h2>
                        </div>
                        
                        <form onSubmit={handleAskQuestion} className="flex flex-col gap-4 relative z-10">
                            <textarea
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                placeholder="What do you need help with? Be specific."
                                rows={3}
                                required
                                className="w-full bg-[#111]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-white placeholder:text-gray-600 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]/50 outline-none transition-all resize-none font-medium text-lg leading-relaxed"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-[#00F0FF] text-black font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-white transition-colors flex items-center gap-3 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                                    {submitting ? 'Submitting...' : 'Submit Query'} <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </ScrollReveal>
            )}

            {/* Queries Feed */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <MessageCircleQuestion className="w-5 h-5 text-gray-400" />
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                        {isStaff ? "All Incoming Queries" : "Community & Incoming Queries"}
                    </h3>
                </div>

                {queries.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.01]">
                        <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest">No queries found.</p>
                    </div>
                ) : (
                    queries.map((q, idx) => (
                        <ScrollReveal key={q.id} delay={idx * 0.05}>
                            <div className={`p-6 md:p-8 rounded-3xl border transition-all ${q.answer ? 'bg-white/[0.02] border-white/5' : 'bg-[#111] border-yellow-500/20'}`}>
                                
                                {/* Question Section */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                        <span className="text-gray-500 font-bold">{q.authorName?.[0] || '?'}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-4 mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-white font-bold">{q.authorName || 'Anonymous'}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-2 py-1 rounded-md">{q.authorRole}</span>
                                            </div>
                                            <span className="text-xs text-gray-600 font-mono hidden md:block">
                                                {format(new Date(q.createdAt), 'PPp')}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-lg leading-relaxed font-medium mb-6">
                                            {q.question}
                                        </p>
                                    </div>
                                </div>

                                {/* Answer Section */}
                                {q.answer ? (
                                    <div className="ml-0 md:ml-14 bg-[#00F0FF]/5 border border-[#00F0FF]/20 rounded-2xl p-6 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[#00F0FF]"></div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-6 h-6 rounded-full bg-[#00F0FF]/20 flex items-center justify-center">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-[#00F0FF]">Official Answer</span>
                                        </div>
                                        <p className="text-white font-bold leading-loose whitespace-pre-wrap">{q.answer}</p>
                                    </div>
                                ) : (
                                    <div className="ml-0 md:ml-14">
                                        {isStaff ? (
                                            <div className="flex gap-3">
                                                <textarea
                                                    value={answers[q.id] || ''}
                                                    onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                                                    placeholder="Write an official response..."
                                                    rows={2}
                                                    className="flex-1 bg-black/50 border border-yellow-500/20 rounded-xl p-4 text-white text-sm focus:border-yellow-500 outline-none resize-none"
                                                />
                                                <button
                                                    onClick={() => handleAnswerSubmit(q.id)}
                                                    disabled={answeringIds.has(q.id)}
                                                    className="bg-yellow-500/10 text-yellow-500 flex items-center gap-2 hover:bg-yellow-500 hover:text-black font-bold uppercase tracking-widest text-xs px-6 rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
                                                >
                                                    {answeringIds.has(q.id) && <Loader2 className="w-3 h-3 animate-spin shrink-0" />}
                                                    {answeringIds.has(q.id) ? 'Posting...' : 'Post Reply'}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                                                <AlertCircle className="w-3.5 h-3.5" /> Pending Response
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </ScrollReveal>
                    ))
                )}
            </div>
        </div>
    );
}
