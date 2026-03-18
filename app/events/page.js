import { fetchEvents, addEvent } from '@/app/actions/events';
import { cookies } from 'next/headers';
import Link from 'next/link';
import EventCard from './components/EventCard';
import EventDatePicker from './components/EventDatePicker';
import ScrollReveal from '@/components/ScrollReveal';
import SplitText from '@/components/ReactBits/SplitText';
import Shell from '@/components/Shell';
import { ArrowLeft, Calendar, Plus } from 'lucide-react';

export default async function EventsPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    let isStaff = false;
    let isAdmin = false;
    let userRole = null;
    let userId = null;
    let userName = 'User';
    let initials = '??';

    if (sessionCookie) {
        const session = JSON.parse(sessionCookie.value);
        isAdmin = session.role === 'dba';
        isStaff = session.role === 'dba' || session.role === 'volunteer';
        userRole = session.role;
        userId = session.userId;
        userName = session.name || 'User';
        initials = session.name ? session.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '??';
    }

    const eventsList = await fetchEvents(userId);

    return (
        <Shell initials={initials} userName={userName} userRole={userRole}>
            <div className="flex-1 overflow-hidden flex flex-col px-6 md:px-12 py-5 h-full">
                
                {/* Header - Compact */}
                <div className="max-w-7xl mx-auto w-full shrink-0 mb-6">
                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors font-bold tracking-widest uppercase text-[9px] flex items-center gap-2 mb-2 w-fit">
                                <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                                <SplitText text="EVENTS ARENA" delay={20} />
                            </h1>
                        </div>
                        <div className="flex items-center gap-3 text-gray-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                            <Calendar className="w-4 h-4 text-[#00F0FF]" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{eventsList.length} Nodes</span>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-hidden max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                        
                        {/* Left Side: Events List (Internal Scroll) */}
                        <div className="lg:col-span-7 overflow-y-auto custom-scrollbar pr-6 space-y-4 pb-32">
                            {eventsList.length === 0 ? (
                                <ScrollReveal>
                                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-16 text-center flex flex-col items-center justify-center min-h-[300px]">
                                        <span className="text-6xl mb-6">📭</span>
                                        <p className="font-bold text-xl text-white mb-2">No events found.</p>
                                    </div>
                                </ScrollReveal>
                            ) : (
                                eventsList.map((evt, idx) => (
                                    <ScrollReveal key={evt.id} delay={idx * 0.05}>
                                        <EventCard evt={evt} isAdmin={isAdmin} isStaff={isStaff} userRole={userRole} />
                                    </ScrollReveal>
                                ))
                            )}
                        </div>

                        {/* Right Side: Admin Form */}
                        {isAdmin && (
                            <div className="lg:col-span-5 border-l border-white/5 pl-8 h-full flex flex-col overflow-hidden pb-4">
                                <ScrollReveal delay={0.2} className="h-full">
                                    <div className="bg-white/[0.03] border border-purple-500/20 rounded-[2rem] p-8 h-full flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden">
                                        
                                        <div className="flex items-center gap-3 mb-6 shrink-0">
                                            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                                                <Plus className="w-4 h-4 text-purple-400" />
                                            </div>
                                            <h3 className="font-black text-[9px] uppercase tracking-[0.3em] text-purple-400">Admin Control</h3>
                                        </div>

                                        <div className="flex-1 flex flex-col min-h-0">
                                            <h4 className="font-black text-white text-3xl tracking-tighter leading-none mb-8 shrink-0">New Registry</h4>
                                            
                                            <form action={addEvent} className="flex-1 flex flex-col justify-between min-h-0">
                                                <div className="space-y-6">
                                                    <div className="space-y-1.5">
                                                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Identifier</label>
                                                        <input type="text" name="title" required className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-400 outline-none transition-all text-white py-3 px-4 rounded-xl placeholder:text-white/5 text-sm font-bold tracking-tight shadow-inner" placeholder="Event Name..." />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Metadata</label>
                                                        <textarea name="description" rows="3" required className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-400 outline-none transition-all text-white py-3 px-4 rounded-xl placeholder:text-white/5 text-xs font-medium resize-none leading-relaxed shadow-inner" placeholder="Details..."></textarea>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                         <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Temporal Sync</label>
                                                         <EventDatePicker />
                                                    </div>
                                                </div>
                                                
                                                <button type="submit" className="w-full bg-purple-600 text-white font-black uppercase tracking-[0.3em] text-[10px] py-4 rounded-xl hover:bg-purple-500 transition-all hover:scale-[1.02] shadow-[0_15px_30px_rgba(168,85,247,0.2)] shrink-0 mt-4">
                                                    Deploy Node
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </Shell>
    );
}
