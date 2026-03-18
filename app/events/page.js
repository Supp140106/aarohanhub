import { fetchEvents, addEvent } from '@/app/actions/events';
import { cookies } from 'next/headers';
import Link from 'next/link';
import EventCard from './components/EventCard';
import EventDatePicker from './components/EventDatePicker';
import ScrollReveal from '@/components/ScrollReveal';
import SplitText from '@/components/ReactBits/SplitText';
import Shell from '@/components/Shell';
import { ArrowLeft, Calendar, Plus } from 'lucide-react';
import SpotlightCard from '@/components/ReactBits/SpotlightCard';

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
            <div className="flex-1 overflow-hidden flex flex-col h-full bg-[#050505]">
                
                {/* Header Section */}
                <div className="w-full shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors font-black tracking-[0.3em] uppercase text-[9px] flex items-center gap-2 mb-4 w-fit">
                                <ArrowLeft className="w-3 h-3" /> System Return
                            </Link>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-white">
                                <SplitText text="EVENTS ARENA" delay={20} />
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400 bg-white/5 px-5 py-3 rounded-2xl border border-white/10 w-fit backdrop-blur-md">
                            <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_10px_#00F0FF]"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{eventsList.length} Nodes Online</span>
                        </div>
                    </div>
                </div>

                {/* Responsive Content Grid */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 relative">
                    
                    {/* Primary Feed: Events List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-12 py-10 space-y-8 pb-32">
                        <div className="max-w-4xl">
                            {eventsList.length === 0 ? (
                                <ScrollReveal>
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-20 text-center flex flex-col items-center justify-center min-h-[400px]">
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                                            <Calendar className="w-8 h-8 text-gray-600" />
                                        </div>
                                        <h3 className="font-black text-2xl text-white mb-2 tracking-tight">No Active Protocols</h3>
                                        <p className="text-gray-500 text-sm max-w-[240px]">The arena is currently in standby mode. Deploy a new node to begin.</p>
                                    </div>
                                </ScrollReveal>
                            ) : (
                                <div className="space-y-6">
                                    {eventsList.map((evt, idx) => (
                                        <ScrollReveal key={evt.id} delay={idx * 0.05}>
                                            <EventCard evt={evt} isAdmin={isAdmin} isStaff={isStaff} userRole={userRole} />
                                        </ScrollReveal>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Admin Sidebar Section */}
                    {isAdmin && (
                        <div className="w-full lg:w-[420px] xl:w-[480px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 bg-black/60 backdrop-blur-3xl overflow-y-auto custom-scrollbar shadow-[-20px_0_80px_rgba(0,0,0,0.5)] z-20 transition-all duration-500">
                           <SpotlightCard spotlightColor="rgba(168, 85, 247, 0.2)" className="border-none bg-transparent">
                            <div className="p-8 md:p-12 h-full flex flex-col min-h-fit">
                                
                                <div className="flex items-center gap-4 mb-10 shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                        <Plus className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em]">Internal</div>
                                        <h3 className="font-black text-white text-lg tracking-tight">Admin Console</h3>
                                    </div>
                                </div>

                                <div className="mb-12 shrink-0">
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-none mb-3">New Registry</h2>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Initialize Node Parameters</p>
                                </div>

                                <form action={addEvent} className="flex flex-col gap-10">
                                    <div className="space-y-10">
                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Event Identifier</label>
                                            <input type="text" name="title" required className="w-full bg-white/[0.03] border border-white/10 focus:border-purple-500/50 focus:bg-white/[0.05] outline-none transition-all text-white py-5 px-6 rounded-3xl placeholder:text-white/10 text-base font-bold tracking-tight h-16 shadow-inner" placeholder="Assign Global ID..." />
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Core Data Packet</label>
                                            <textarea name="description" rows="5" required className="w-full bg-white/[0.03] border border-white/10 focus:border-purple-500/50 focus:bg-white/[0.05] outline-none transition-all text-white py-5 px-6 rounded-3xl placeholder:text-white/10 text-sm font-medium resize-none leading-relaxed shadow-inner" placeholder="Enter detailed node description and goals..."></textarea>
                                        </div>

                                        <div className="space-y-3">
                                             <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Temporal Alignment</label>
                                             <div className="p-1 rounded-3xl bg-white/[0.02] border border-white/5">
                                                <EventDatePicker />
                                             </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-purple-600 text-white font-black uppercase tracking-[0.4em] text-[11px] py-6 rounded-3xl hover:bg-purple-500 transition-all active:scale-[0.98] shadow-[0_25px_50px_rgba(168,85,247,0.25)] mt-6 mb-12">
                                        Authorize Deployment
                                    </button>
                                </form>
                            </div>
                           </SpotlightCard>
                        </div>
                    )}
                </div>
            </div>
        </Shell>
    );
}
