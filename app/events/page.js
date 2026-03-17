import { fetchEvents, addEvent } from '@/app/actions/events';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { LayoutDashboard, Plus, Settings, Sparkles, Filter, Search, ArrowLeft, Target, ShieldAlert, Cpu, Globe } from 'lucide-react';
import EventCard from './components/EventCard';
import Navbar from '@/components/Navbar';

export default async function EventsPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    let isStaff = false;
    let isAdmin = false;
    let userRole = null;
    let userId = null;

    if (sessionCookie) {
        const session = JSON.parse(sessionCookie.value);
        isAdmin = session.role === 'dba';
        isStaff = session.role === 'dba' || session.role === 'volunteer';
        userRole = session.role;
        userId = session.userId;
    }

    const eventsList = await fetchEvents(userId);

    const categories = [
        { name: 'Hackathons', count: 12, icon: <Cpu className="w-3 h-3" /> },
        { name: 'Robotics', count: 8, icon: <Target className="w-3 h-3" /> },
        { name: 'Web3 & AI', count: 15, icon: <Globe className="w-3 h-3" /> },
        { name: 'Workshops', count: 10, icon: <Sparkles className="w-3 h-3" /> }
    ];

    return (
        <div className="min-h-screen bg-[#050505] selection:bg-[#00F0FF]/30 selection:text-[#00F0FF] relative">
            <Navbar />
            
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00F0FF]/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
            
            <main className="max-w-7xl mx-auto pt-32 pb-20 px-6 md:px-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20 relative z-10">
                    <div className="space-y-6">
                        <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-[#00F0FF] font-black text-[10px] uppercase tracking-[0.2em] transition-all group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Command Center
                        </Link>
                        <div>
                           <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic uppercase mb-4">
                               MISSION <span className="gradient-text">ARENA</span>
                           </h1>
                           <div className="flex items-center gap-4 text-gray-500 font-bold tracking-widest text-[10px] uppercase">
                              <Target className="w-4 h-4 text-[#00F0FF]" />
                              ACTIVE_TARGETS: {eventsList.length}
                              <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                              SYSTEM_STATUS: NOMINAL
                           </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 text-right">
                        <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></div>
                            <span className="text-[10px] font-black tracking-widest text-white uppercase italic">
                                SECURE_SESSION // {userRole || 'VISITOR'}
                            </span>
                        </div>
                        <p className="text-gray-600 font-medium text-xs max-w-xs leading-relaxed">
                            Scanning sector for authorized competitions and high-stakes technical missions.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                    {/* Tactical Sidebar */}
                    <div className="xl:col-span-3 space-y-8">
                        {/* Categories Box */}
                        <div className="card-glass p-0 border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5 bg-white/5">
                               <h3 className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase flex items-center gap-3">
                                  <Filter className="w-4 h-4" />
                                  SECTOR_REGISTRY
                               </h3>
                            </div>
                            <div className="p-4 space-y-1">
                                {categories.map((cat) => (
                                    <button key={cat.name} className="w-full flex items-center justify-between px-5 py-4 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all text-left group">
                                        <div className="flex items-center gap-4">
                                           <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-gray-600 group-hover:text-[#00F0FF] group-hover:border-[#00F0FF]/30 transition-all">
                                              {cat.icon}
                                           </div>
                                           <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                                        </div>
                                        <span className="text-[10px] font-mono opacity-30">{cat.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Admin Form Box */}
                        {isAdmin && (
                            <div className="card-glass p-0 border-purple-500/20 bg-purple-500/[0.02] overflow-hidden">
                                <div className="p-6 border-b border-purple-500/10 bg-purple-500/5">
                                   <h3 className="text-[10px] font-black tracking-[0.4em] text-purple-400 uppercase flex items-center gap-3">
                                      <Settings className="w-4 h-4" />
                                      ADMIN_OVERRIDE
                                   </h3>
                                </div>
                                <form action={addEvent} className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[9px] font-black tracking-widest text-gray-500 uppercase mb-2">MISSION_ID</label>
                                            <input type="text" name="title" required className="input-underline w-full placeholder:text-gray-800" placeholder="Ex: CYBER-X-2026" />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black tracking-widest text-gray-500 uppercase mb-2">INTEL_BRIEF</label>
                                            <textarea name="description" rows="3" className="input-underline w-full placeholder:text-gray-800" placeholder="Operational details..."></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black tracking-widest text-gray-500 uppercase mb-2">DEPLOY_TIME</label>
                                            <input type="datetime-local" name="schedule" required className="input-underline w-full" />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full h-14 bg-purple-500 text-black font-black flex items-center justify-center gap-3 rounded-2xl hover:bg-purple-400 transition-all shadow-[0_10px_30px_rgba(168,85,247,0.3)] text-xs uppercase tracking-widest">
                                        <Plus className="w-5 h-5" />
                                        INITIALIZE MISSION
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="p-8 rounded-3xl border border-[#00F0FF]/10 bg-[#00F0FF]/5">
                           <ShieldAlert className="w-8 h-8 text-[#00F0FF] mb-4" />
                           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-loose">
                              WARNING: Double registration for concurrent missions may cause signal interference. Check the tactical time-table before enrollment.
                           </p>
                        </div>
                    </div>

                    {/* Mission Grid */}
                    <div className="xl:col-span-9">
                        {eventsList.length === 0 ? (
                            <div className="card-glass p-32 text-center border-dashed border-white/5 relative overflow-hidden">
                                <Search className="w-20 h-20 text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                <div className="relative z-10 space-y-6">
                                   <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center border border-white/5">
                                      <Search className="w-6 h-6 text-gray-700" />
                                   </div>
                                   <h3 className="text-xl font-black text-gray-600 italic tracking-widest uppercase italic">SIGNAL_LOST: NO MISSIONS DETECTED</h3>
                                   <p className="text-gray-700 font-bold uppercase tracking-[0.2em] text-[10px]">Registry is currently offline or empty. Check back later.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {eventsList.map((evt) => (
                                    <EventCard key={evt.id} evt={evt} isAdmin={isAdmin} isStaff={isStaff} userRole={userRole} />
                                ))}
                            </div>
                        )}

                        <div className="mt-20 text-center text-[10px] font-black text-gray-800 uppercase tracking-[0.5em] pointer-events-none">
                            AAROHAN_SYSTEMS_GRID_SECTOR_V7
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
