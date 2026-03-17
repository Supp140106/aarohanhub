import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { registrations, users as usersTable, events as eventsTable } from '@/db/schema';
import { eq, count, desc } from 'drizzle-orm';
import { logout } from '@/app/actions/auth';
import { fetchAllUsers } from '@/app/actions/admin';
import { checkIfWinner } from '@/app/actions/events';
import { 
  Users, Calendar, LogOut, LayoutDashboard, 
  MapPin, Award, BookOpen, MessageSquare,
  Sparkles, TrendingUp, Shield, User, ChevronRight,
  Activity, Zap, Clock
} from 'lucide-react';
import UserList from './components/UserList';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    redirect('/login');
  }

  const session = JSON.parse(sessionCookie.value);
  const users = (session.role === 'dba' || session.role === 'volunteer') ? await fetchAllUsers() : [];
  const isWinner = await checkIfWinner(session.userId);

  // Fetch real stats
  const [userRegs] = await db.select({ count: count() }).from(registrations).where(eq(registrations.userId, session.userId));
  const [totalParticipants] = await db.select({ count: count() }).from(usersTable);
  const upcomingMissions = await db.select().from(eventsTable).limit(3).orderBy(desc(eventsTable.id));
  
  const stats = [
    { label: 'Registrations', value: userRegs?.count || '0', icon: <Calendar className="w-5 h-5 text-[#00F0FF]" /> },
    { label: 'Achievements', value: isWinner ? '1' : '0', icon: <Award className="w-5 h-5 text-[#7000FF]" /> },
    { label: 'Global Rank', value: '#128', icon: <TrendingUp className="w-5 h-5 text-[#39FF14]" /> },
    { label: 'Participants', value: totalParticipants?.count || '0', icon: <Users className="w-5 h-5 text-orange-400" /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex selection:bg-[#00F0FF]/30 selection:text-[#00F0FF]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 hidden xl:flex flex-col p-8 fixed h-full bg-black/40 backdrop-blur-3xl z-50">
        <div className="mb-12 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#7000FF] flex items-center justify-center p-0.5 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <div className="w-full h-full bg-black rounded-[9px] flex items-center justify-center font-black text-[#00F0FF] text-lg italic">A</div>
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">GRID</span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#00F0FF]/10 text-[#00F0FF] font-black text-[10px] uppercase tracking-[0.2em] border border-[#00F0FF]/20 transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Command
          </Link>
          <Link href="/events" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all font-black text-[10px] uppercase tracking-[0.2em]">
            <Zap className="w-5 h-5" />
            Missions
          </Link>
          <Link href="/logistics" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all font-black text-[10px] uppercase tracking-[0.2em]">
            <MapPin className="w-5 h-5" />
            Supply
          </Link>
          <Link href="/profile" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all font-black text-[10px] uppercase tracking-[0.2em]">
            <User className="w-5 h-5" />
            Personnel
          </Link>
          {isWinner && (
            <Link href="/learn" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-yellow-500 hover:bg-yellow-500/10 transition-all font-black text-[10px] uppercase tracking-[0.2em] border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
              <BookOpen className="w-5 h-5" />
              Vault
            </Link>
          )}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <Link href="/profile" className="flex items-center gap-4 p-4 mb-6 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-[#00F0FF] group-hover:scale-105 transition-transform shadow-xl">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate uppercase tracking-widest">{session.name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mt-0.5">{session.role}</p>
            </div>
          </Link>
          <form action={logout}>
            <button type="submit" className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-[0.2em] group">
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Sever Link
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 xl:ml-64 p-8 md:p-12 xl:p-16 relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00F0FF]/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
        
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></div>
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Systems Online // Authorized Access</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-none tracking-tighter uppercase italic">
              WELCOME, <span className="gradient-text">{session.name}</span>
            </h1>
            <p className="text-gray-500 font-bold tracking-[0.1em] text-sm md:text-base border-l-2 border-[#00F0FF]/30 pl-4">
              Your identity has been authenticated. Command Center v2.0.26 active.
            </p>
          </div>
          
          <div className="flex gap-4">
             <div className="card-glass py-4 px-8 border-white/5 flex flex-col items-center justify-center min-w-[120px]">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Session</span>
                <span className="text-sm font-black text-[#00F0FF]">D-04-A</span>
             </div>
             <div className="card-glass py-4 px-8 border-white/5 flex flex-col items-center justify-center min-w-[120px]">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Gateway</span>
                <span className="text-sm font-black text-white">AP-SOUTH</span>
             </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="card-glass p-8 group hover:border-[#00F0FF]/20 transition-all relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                 {React.cloneElement(stat.icon, { className: 'w-24 h-24' })}
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="p-4 w-fit rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform group-hover:bg-white/10">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase mb-2">{stat.label}</p>
                  <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Core Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-12">
            {/* Mission Deck */}
            <div className="card-glass p-0 border-white/5 overflow-hidden">
               <div className="p-8 border-b border-white/5 bg-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Activity className="w-5 h-5 text-[#00F0FF]" />
                     <h3 className="text-lg font-black text-white tracking-widest uppercase italic">The Mission Deck</h3>
                  </div>
                  <Link href="/events" className="text-[9px] font-black text-[#00F0FF] uppercase tracking-[0.3em] hover:opacity-80 transition-opacity flex items-center gap-2">
                     All Missions <ChevronRight className="w-3 h-3" />
                  </Link>
               </div>
               <div className="divide-y divide-white/5">
                  {upcomingMissions.length === 0 ? (
                    <div className="p-12 text-center text-gray-600 font-bold uppercase tracking-widest italic text-xs">No active missions found.</div>
                  ) : (
                    upcomingMissions.map((m) => (
                      <div key={m.id} className="p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                         <div className="flex items-center gap-6">
                            <div className="w-2 h-12 bg-[#00F0FF] rounded-full opacity-20 group-hover:opacity-100 transition-opacity"></div>
                            <div>
                               <h4 className="text-white font-black uppercase tracking-tight text-lg mb-1">{m.title}</h4>
                               <div className="flex items-center gap-4">
                                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                     <Clock className="w-3 h-3" />
                                     {m.schedule ? new Date(m.schedule).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBA'}
                                  </p>
                                  <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                                  <p className="text-[10px] text-[#00F0FF]/60 font-black uppercase tracking-widest">Active Status</p>
                               </div>
                            </div>
                         </div>
                         <Link href="/events" className="p-4 rounded-xl bg-white/5 border border-white/5 text-gray-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 hover:text-white">
                            <ChevronRight className="w-5 h-5" />
                         </Link>
                      </div>
                    ))
                  )}
               </div>
            </div>

            {/* Admin Section */}
            {(session.role === 'dba' || session.role === 'volunteer') && (
              <div id="user-management" className="animate-in">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-white tracking-widest uppercase flex items-center gap-4 italic">
                    <div className="w-8 h-1 bg-gradient-to-r from-[#7000FF] to-transparent"></div>
                    Registry Terminal
                  </h3>
                </div>
                <UserList initialUsers={users} currentUserRole={session.role} />
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-10">
            {/* AI Assistant Insight */}
            <div className="card-glass p-8 bg-gradient-to-br from-[#00F0FF]/10 via-transparent to-transparent border-[#00F0FF]/20 relative group overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-24 h-24 text-[#00F0FF]" />
              </div>
              <div className="mb-8 w-14 h-14 rounded-2xl bg-[#00F0FF]/10 flex items-center justify-center border border-[#00F0FF]/20 shadow-inner">
                <MessageSquare className="w-7 h-7 text-[#00F0FF]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3 tracking-widest uppercase italic italic">Neural Link</h3>
              <p className="text-sm text-gray-500 font-bold mb-8 leading-relaxed tracking-tight">
                Llama 3.3 powered intelligence core. Operational for site navigation, event specifics, and logistical intel.
              </p>
              <div className="p-6 rounded-2xl bg-black/60 border border-white/5 text-[10px] font-black text-[#00F0FF] uppercase tracking-[0.2em] flex items-center justify-between">
                <span>Signal Status: Strong</span>
                <div className="flex gap-1">
                   <div className="w-1 h-3 bg-[#39FF14] rounded-full"></div>
                   <div className="w-1 h-3 bg-[#39FF14] rounded-full"></div>
                   <div className="w-1 h-3 bg-[#39FF14] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Achievement Status */}
            <div className={`card-glass p-8 border-dashed ${isWinner ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-white/10'}`}>
              <div className="flex items-center gap-4 mb-8">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isWinner ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500' : 'bg-white/5 border-white/10 text-gray-700'}`}>
                    <Award className="w-6 h-6" />
                 </div>
                 <h3 className={`text-lg font-black tracking-widest uppercase ${isWinner ? 'text-yellow-500' : 'text-gray-500'}`}>Status: {isWinner ? 'CHAMPION' : 'RECRUIT'}</h3>
              </div>
              
              <p className="text-xs text-gray-500 font-bold leading-relaxed mb-6 uppercase tracking-wider">
                {isWinner 
                  ? "CONFIRMED_IDENTITY: You have achieved Victor status. The Learning Hub protocols have been decrypted for your access."
                  : "IDENT_VERIFICATION: Complete mission objectives across the arena to unlock elite tier status and classified educational assets."}
              </p>
              
              {isWinner && (
                <Link href="/learn" className="flex items-center justify-center gap-3 w-full py-4 bg-yellow-500 text-black font-black rounded-xl text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(234,179,8,0.2)]">
                   Enter Vault <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* System Log Footer */}
            <div className="p-8 border border-white/5 rounded-3xl bg-white/[0.02]">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Server Uptime</span>
                  <span className="text-[9px] font-black text-[#39FF14] uppercase tracking-widest">99.9%</span>
               </div>
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[99%] h-full bg-[#39FF14]"></div>
               </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
