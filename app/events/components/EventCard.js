'use client';

import { useState } from 'react';
import { deleteEvent, registerForEvent, fetchEventRegistrations, setEventWinner } from '@/app/actions/events';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar, Trophy, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import ConfirmModal from '@/app/dashboard/components/ConfirmModal';

export default function EventCard({ evt, isAdmin, isStaff, userRole }) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isOptimisticRegistered, setIsOptimisticRegistered] = useState(evt.isRegistered);

    async function handleRegister() {
        // Optimistic Update
        setIsOptimisticRegistered(true);
        setLoading(true);
        setMessage('');
        
        const formData = new FormData();
        formData.append('eventId', evt.id);
        
        try {
            const res = await registerForEvent(formData);
            if (res?.error) {
                setMessage(res.error);
                setIsOptimisticRegistered(false); // Rollback
            } else {
                setMessage('Successfully Registered!');
                setShowConfirm(false);
            }
        } catch (e) {
            setMessage('Network error. Please try again.');
            setIsOptimisticRegistered(false); // Rollback
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteConfirmed() {
        setLoading(true);
        const formData = new FormData();
        formData.append('id', evt.id);
        const res = await deleteEvent(formData);
        if (res?.error) {
            toast.error(res.error);
        } else {
            toast.success('Event successfully deleted.');
        }
        setLoading(false);
        setShowDeleteConfirm(false);
    }

    async function handleViewRegistrations() {
        if (!showRegistrations && registrations.length === 0) {
            setLoadingRegs(true);
            const data = await fetchEventRegistrations(evt.id);
            setRegistrations(data);
            setLoadingRegs(false);
        }
        setShowRegistrations(!showRegistrations);
    }

    async function handleSetWinner(userId) {
        setSettingWinner(true);
        const formData = new FormData();
        formData.append('eventId', evt.id);
        formData.append('winnerId', userId);
        const res = await setEventWinner(formData);
        if (res?.error) {
            toast.error(res.error);
        } else {
            toast.success('Winner successfully selected! 🎉');
        }
        setSettingWinner(false);
    }

    return (
        <div className={`bg-white/[0.03] rounded-3xl border overflow-hidden transition-all hover:border-white/20 group ${evt.winner ? 'border-yellow-500/40' : 'border-white/10'}`}>

            {/* Winner Badge */}
            {evt.winner && (
                <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-6 py-2 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-yellow-400">Winner Declared</span>
                </div>
            )}

            <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-black text-white tracking-tight">{evt.title}</h2>
                    {isAdmin && (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all shrink-0"
                            title="Delete Event"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <p className="text-gray-400 mb-6 leading-relaxed">{evt.description}</p>

                {/* Winner Display */}
                {evt.winner && (
                    <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center text-2xl">👑</div>
                        <div>
                            <h4 className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-1">Winner</h4>
                            <p className="text-lg font-black text-white">{evt.winner.name}</p>
                            <p className="text-xs text-gray-500">{evt.winner.email}</p>
                        </div>
                    </div>
                )}

                {/* Message */}
                {message && (
                    <div className={`mb-4 p-4 rounded-xl text-sm font-bold ${message.includes('Success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {message}
                    </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {evt.schedule ? format(new Date(evt.schedule), 'PPp') : 'TBA'}
                    </span>

                    {isStaff ? (
                        <button
                            onClick={handleViewRegistrations}
                            className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 font-bold py-2 px-5 rounded-full transition text-xs uppercase tracking-widest flex items-center gap-2"
                        >
                            {showRegistrations ? <><ChevronUp className="w-4 h-4" /> Hide</> : <><ChevronDown className="w-4 h-4" /> Registrations</>}
                        </button>
                    ) : (
                        <div>
                            {isOptimisticRegistered ? (
                                <span className="bg-emerald-500/10 text-emerald-400 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                                    ✅ Registered
                                </span>
                            ) : (!showConfirm && userRole !== 'volunteer') ? (
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    className="bg-[#00F0FF] text-black font-black py-2.5 px-6 rounded-full transition hover:bg-white text-xs uppercase tracking-widest"
                                >
                                    Register Now
                                </button>
                            ) : userRole === 'volunteer' ? (
                                <span className="text-xs text-gray-500 italic font-bold uppercase tracking-widest">Staff Account</span>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 font-bold">Sure?</span>
                                    <button
                                        onClick={handleRegister}
                                        disabled={loading}
                                        className="bg-emerald-500 text-black font-black py-2 px-4 rounded-full text-xs uppercase tracking-widest hover:bg-emerald-400 disabled:opacity-50"
                                    >
                                        {loading ? '...' : 'Confirm'}
                                    </button>
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="bg-white/10 text-gray-400 font-bold py-2 px-4 rounded-full text-xs hover:bg-white/20"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Staff Registrations Panel */}
            {isStaff && showRegistrations && (
                <div className="border-t border-white/10 bg-white/[0.02] p-6">
                    <h4 className="font-black text-white mb-4 text-sm uppercase tracking-widest">Registered Users ({registrations.length})</h4>
                    {loadingRegs ? (
                        <p className="text-sm text-gray-500">Loading...</p>
                    ) : registrations.length === 0 ? (
                        <p className="text-sm text-gray-500">No one has registered for this event yet.</p>
                    ) : (
                        <ul className="space-y-2 max-h-60 overflow-y-auto">
                            {registrations.map(reg => (
                                <li key={reg.id} className="flex justify-between items-center bg-white/[0.03] border border-white/10 p-4 rounded-xl">
                                    <div>
                                        <p className="font-bold text-white">{reg.fullName}</p>
                                        <p className="text-gray-500 text-xs">{reg.email}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest ${reg.role === 'student' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                                            {reg.role}
                                        </span>
                                        {reg.isVolunteer && <span className="text-xs text-emerald-400 font-bold">Volunteer</span>}
                                        {isAdmin && !evt.winner && (
                                            <button
                                                onClick={() => handleSetWinner(reg.id)}
                                                disabled={settingWinner}
                                                className="bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition disabled:opacity-50"
                                            >
                                                👑 Set Winner
                                            </button>
                                        )}
                                        {isAdmin && evt.winner?.id === reg.id && (
                                            <span className="text-yellow-400 font-black text-xs uppercase tracking-widest">🏆 Winner</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete Event?"
                message={`Are you sure you want to permanently delete "${evt.title}"? All existing registrations for this event will be lost.`}
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setShowDeleteConfirm(false)}
                confirmText={loading ? "Deleting..." : "Yes, Delete Event"}
                variant="danger"
            />
        </div>
    );
}
