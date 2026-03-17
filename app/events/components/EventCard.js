'use client';

import { useState } from 'react';
import { deleteEvent, registerForEvent, fetchEventRegistrations, setEventWinner } from '@/app/actions/events';
import { toast } from 'sonner';
import { Calendar, Trash2, CheckCircle, Users, Trophy, AlertCircle, Clock, ChevronDown, ChevronUp, Zap, Target, ShieldAlert, X } from 'lucide-react';

export default function EventCard({ evt, isAdmin, isStaff, userRole }) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showRegistrations, setShowRegistrations] = useState(false);
    const [registrations, setRegistrations] = useState([]);
    const [loadingRegs, setLoadingRegs] = useState(false);
    const [settingWinner, setSettingWinner] = useState(false);

    async function handleRegister() {
        setLoading(true);
        const formData = new FormData();
        formData.append('eventId', evt.id);

        const res = await registerForEvent(formData);

        if (res?.error) {
            toast.error(res.error);
        } else {
            toast.success('LINK_ESTABLISHED: Mission secure.');
            setShowConfirm(false);
            evt.isRegistered = true;
        }
        setLoading(false);
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
            toast.success('CHAMPION_AUTHENTICATED: Victory logged.');
        }
        setSettingWinner(false);
    }

    const formattedDate = evt.schedule ? new Date(evt.schedule).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    }) : 'TBA';

    return (
        <div className={`group relative card-glass p-0 flex flex-col h-full border-white/5 hover:border-[#00F0FF]/30 transition-all duration-700 overflow-hidden ${evt.winner ? 'shadow-[0_0_50px_rgba(234,179,8,0.15)] border-yellow-500/30' : 'shadow-2xl'}`}>
            {/* Background Accent Grid */}
            <div className="absolute inset-0 grid-bg opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none"></div>

            {/* Header Badge */}
            {evt.winner ? (
                <div className="bg-yellow-500 text-black text-[9px] font-black uppercase tracking-[0.4em] py-3 px-6 flex items-center justify-center gap-3 italic">
                    <Trophy className="w-4 h-4 fill-current" />
                    BATTLE_CONCLUDED: CHAMPION_IDENTIFIED
                </div>
            ) : (
                <div className="bg-[#00F0FF]/5 text-[#00F0FF] text-[9px] font-black uppercase tracking-[0.4em] py-3 px-6 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse"></div>
                       MISSION_ACTIVE
                    </div>
                    <span>ID: #{evt.id}</span>
                </div>
            )}

            <div className="p-10 flex-1 flex flex-col relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                       <h2 className="text-3xl font-black text-white tracking-tighter group-hover:text-[#00F0FF] transition-colors leading-none mb-2 uppercase italic">{evt.title}</h2>
                       <div className="flex items-center gap-3 text-[10px] font-bold text-gray-600 tracking-widest uppercase">
                          <Target className="w-3 h-3" /> sector_7a
                          <span className="w-1 h-1 rounded-full bg-gray-800"></span>
                          class_high_risk
                       </div>
                    </div>
                    
                    {isAdmin && (
                        <div className="flex items-center gap-2">
                            {showDeleteConfirm ? (
                                <div className="flex gap-2 animate-in slide-in-from-right-2">
                                    <form action={deleteEvent}>
                                        <input type="hidden" name="id" value={evt.id} />
                                        <button type="submit" className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-all shadow-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                    <button 
                                      onClick={() => setShowDeleteConfirm(false)}
                                      className="bg-white/10 text-white p-3 rounded-xl hover:bg-white/20 transition-all"
                                    >
                                       <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="text-gray-600 hover:text-red-500 p-3 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <p className="text-gray-400 font-medium mb-10 leading-relaxed border-l-2 border-white/10 pl-6 italic">
                   "{evt.description || 'No additional mission intelligence provided.'}"
                </p>

                {evt.winner && (
                    <div className="mb-10 p-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 flex items-center gap-6 animate-in slide-in-from-bottom-4">
                        <div className="w-14 h-14 rounded-2xl bg-yellow-500 flex items-center justify-center text-black shadow-[0_0_30px_rgba(234,179,8,0.3)] shrink-0">
                            <Trophy className="w-7 h-7 fill-current" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-yellow-500/60 uppercase tracking-[0.3em] mb-1">Confirmed Victor</p>
                            <p className="text-xl font-black text-white truncate">{evt.winner.name}</p>
                        </div>
                    </div>
                )}

                <div className="mt-auto space-y-8">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black tracking-widest uppercase italic">
                            <Clock className="w-4 h-4 text-[#00F0FF]" />
                            {formattedDate}
                        </div>
                        {evt.isRegistered && (
                            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/20 text-[#39FF14] text-[10px] font-black tracking-widest uppercase italic shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                                <CheckCircle className="w-4 h-4" />
                                LINK_ESTABLISHED
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        {isStaff && (
                            <button
                                onClick={handleViewRegistrations}
                                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black h-16 rounded-2xl transition-all text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 italic"
                            >
                                <Users className="w-4 h-4" />
                                {showRegistrations ? "CLOSE_INTEL" : "VIEW_INTEL"}
                                {showRegistrations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        )}
                        {!isStaff && (
                            <div className="w-full">
                                {evt.winner ? (
                                    <div className="w-full text-center p-5 border border-white/5 rounded-2xl text-gray-700 font-bold text-[10px] uppercase tracking-[0.5em] italic">
                                        OPERATION_ARCHIVED
                                    </div>
                                ) : evt.isRegistered ? (
                                    <div className="w-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 font-black h-16 rounded-2xl text-[10px] tracking-[0.3em] uppercase text-center flex items-center justify-center gap-3 cursor-default italic">
                                        <CheckCircle className="w-5 h-5" />
                                        MISSION_SECURED
                                    </div>
                                ) : showConfirm ? (
                                    <div className="flex gap-3 animate-in fade-in zoom-in-95 w-full">
                                        <button
                                            onClick={handleRegister}
                                            disabled={loading}
                                            className="flex-1 bg-[#00F0FF] text-black font-black h-16 rounded-2xl transition-all text-[10px] tracking-[0.3em] uppercase hover:bg-[#00DDEB] shadow-[0_10px_30px_rgba(0,240,255,0.3)] italic"
                                        >
                                            {loading ? "INITIALIZING..." : "CONFIRM_ENROLLMENT"}
                                        </button>
                                        <button
                                            onClick={() => setShowConfirm(false)}
                                            className="w-16 bg-white/5 text-gray-500 font-black h-16 rounded-2xl hover:bg-white/10 hover:text-white transition-all border border-white/5 flex items-center justify-center"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowConfirm(true)}
                                        disabled={userRole === 'volunteer'}
                                        className="w-full bg-[#00F0FF] text-black font-black h-16 rounded-2xl text-[11px] tracking-[0.3em] uppercase disabled:opacity-30 disabled:grayscale transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_40px_rgba(0,240,255,0.2)] flex items-center justify-center gap-3 italic"
                                    >
                                        <Zap className="w-5 h-5 fill-current" />
                                        ENLIST_IN_MISSION
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Admin/Staff Expandable Intel Section */}
            {isStaff && showRegistrations && (
                <div className="px-10 pb-10 animate-in slide-in-from-top-4 border-t border-white/5 pt-10 bg-black/60 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                       <Users className="w-32 h-32" />
                    </div>
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] italic flex items-center gap-2">
                           <div className="w-8 h-[1px] bg-gray-800"></div>
                           Personnel_Log ({registrations.length})
                        </h4>
                    </div>
                    {loadingRegs ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="w-8 h-8 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Compiling Intel...</span>
                        </div>
                    ) : registrations.length === 0 ? (
                        <div className="flex flex-col items-center py-12 text-gray-700 gap-4 border border-dashed border-white/5 rounded-2xl">
                            <ShieldAlert className="w-10 h-10 opacity-20" />
                            <p className="text-[10px] font-black italic tracking-widest uppercase">ZERO_REGISTRATIONS_DETECTION</p>
                        </div>
                    ) : (
                        <ul className="space-y-4 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                            {registrations.map(reg => (
                                <li key={reg.id} className="group/item flex items-center justify-between bg-white/[0.03] p-5 rounded-2xl border border-white/5 hover:border-[#00F0FF]/30 hover:bg-[#00F0FF]/5 transition-all">
                                    <div className="min-w-0 pr-4">
                                        <p className="font-black text-white text-sm truncate uppercase tracking-tight">{reg.fullName}</p>
                                        <p className="text-[9px] text-gray-500 font-mono tracking-tighter truncate mt-1 italic">{reg.email}</p>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        {isAdmin && !evt.winner && (
                                            <button
                                                onClick={() => handleSetWinner(reg.id)}
                                                disabled={settingWinner}
                                                className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black w-10 h-10 rounded-xl transition-all flex items-center justify-center border border-yellow-500/20 group-hover/item:scale-110 shadow-lg"
                                                title="Authenticate Victory"
                                            >
                                                <Trophy className="w-5 h-5" />
                                            </button>
                                        )}
                                        {isAdmin && evt.winner?.id === reg.id && (
                                            <div className="text-yellow-500 bg-yellow-500/10 w-10 h-10 rounded-xl flex items-center justify-center border border-yellow-500/20">
                                                <Trophy className="w-5 h-5 fill-current" />
                                            </div>
                                        )}
                                        <div className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] shadow-sm ${reg.role === 'student' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                                            {reg.role}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
