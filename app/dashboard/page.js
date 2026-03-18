import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { checkIfWinner } from '@/app/actions/events';
import ScrollReveal from '@/components/ScrollReveal';
import SplitText from '@/components/ReactBits/SplitText';
import Shell from '@/components/Shell';
import { 
    ArrowUpRight, Calendar, Users, Zap, 
    MapPin, Globe, Shield, MessageCircleQuestion, Activity, Cpu
} from 'lucide-react';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
        redirect('/login');
    }

    const session = JSON.parse(sessionCookie.value);
    const isWinner = await checkIfWinner(session.userId);
    const initials = session.name ? session.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '??';

    return (
        <Shell userName={session.name} userRole={session.role} initials={initials}>
            {/* Dashboard Grid - Non-Scrollable, Compressed */}
            <div className="flex-1 px-8 py-6 max-w-7xl mx-auto w-full flex flex-col justify-center overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full max-h-[85vh]">
                    
                    {/* 01. Welcome Card — Compressed */}
                    <ScrollReveal className="md:col-span-12">
                        <div className="relative p-6 md:p-8 rounded-[1.5rem] bg-gradient-to-r from-[#00F0FF]/5 to-transparent border border-white/5 overflow-hidden group">
                            <div className="absolute top-0 right-0 w-1/4 h-full overflow-hidden opacity-10 group-hover:opacity-20 transition-opacity">
                                <Cpu className="w-48 h-48 text-[#00F0FF] absolute -top-10 -right-10" />
                            </div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] text-[8px] font-black uppercase tracking-widest border border-[#00F0FF]/20 mb-3 backdrop-blur-md">
                                    <Activity className="w-2.5 h-2.5" /> Access Authorized
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-[0.9] mb-4">
                                    <SplitText text={`HELLO, ${session.name.toUpperCase()}!`} delay={30} />
                                </h1>
                                <div className="flex flex-wrap gap-3">
                                    <div className="px-4 py-2 rounded-lg bg-white text-black font-black uppercase tracking-widest text-[8px] flex items-center gap-2 hover:bg-[#00F0FF] transition-colors cursor-pointer">
                                        Initialize Registry <Zap className="w-2.5 h-2.5 fill-current" />
                                    </div>
                                    <Link href="/events" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[8px] flex items-center gap-2 hover:bg-white/10 transition-colors">
                                        View Arena <Globe className="w-2.5 h-2.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* 02. Stats Row - Compact */}
                    <div className="md:col-span-12 grid grid-cols-3 gap-4">
                        {[
                            { label: "Network Capacity", val: "98%", icon: <Activity className="w-3.5 h-3.5" />, color: "text-blue-400" },
                            { label: "Active Nodes", val: "1.2k", icon: <Users className="w-3.5 h-3.5" />, color: "text-purple-400" },
                            { label: "Bit-Rate", val: "5.4 Gbps", icon: <Zap className="w-3.5 h-3.5" />, color: "text-[#00F0FF]" },
                        ].map((stat, i) => (
                            <ScrollReveal key={i} delay={0.1 * i}>
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.04] transition-all hover:border-[#00F0FF]/30 group">
                                    <div className={`flex items-center gap-2 mb-1 ${stat.color} opacity-60`}>
                                        {stat.icon}
                                        <span className="text-[7px] font-black uppercase tracking-widest">{stat.label}</span>
                                    </div>
                                    <div className="text-xl font-black">{stat.val}</div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    {/* 03. Primary Actions - Heights Fixed */}
                    <ScrollReveal delay={0.3} className="md:col-span-8">
                        <Link href="/events" className="block h-full min-h-[140px] bg-gradient-to-br from-[#111] to-black border border-white/5 rounded-[1.5rem] p-6 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00F0FF]/15 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-700"></div>
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black group-hover:rotate-6 transition-transform">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <ArrowUpRight className="w-6 h-6 text-white/20 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight mb-1">Events Hub</h2>
                                    <p className="text-gray-500 text-[10px] font-medium leading-tight">Coordinate exclusive hackathons.</p>
                                </div>
                            </div>
                        </Link>
                    </ScrollReveal>

                    <ScrollReveal delay={0.4} className="md:col-span-4">
                        <Link href="/admin/users" className="block h-full min-h-[140px] bg-[#BF00FF]/10 border border-[#BF00FF]/20 rounded-[1.5rem] p-6 group hover:bg-[#BF00FF]/20 transition-all relative overflow-hidden text-left w-full">
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#BF00FF]/20 rounded-full blur-[60px]"></div>
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div>
                                    <Shield className="w-6 h-6 text-[#BF00FF] mb-2" />
                                    <h3 className="text-xl font-black tracking-tight leading-none mb-1">User Matrix</h3>
                                    <p className="text-purple-300 text-[8px] font-black uppercase tracking-widest opacity-60">ADMIN v4.0</p>
                                </div>
                                <div className="mt-4">
                                    <div className="text-[10px] font-black text-white">4.8k Active</div>
                                </div>
                            </div>
                        </Link>
                    </ScrollReveal>

                    {/* 04. Secondary Actions */}
                    <ScrollReveal delay={0.5} className="md:col-span-5">
                        <Link href="/support" className="block h-full min-h-[140px] border border-white/5 rounded-[1.5rem] bg-black/40 backdrop-blur-md p-6 group hover:border-[#00F0FF]/50 transition-all">
                            <div className="flex items-center gap-2 mb-3">
                                <MessageCircleQuestion className="w-4 h-4 text-[#00F0FF]" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Support Hub</span>
                            </div>
                            <h3 className="text-lg font-black mb-1 leading-none">Query Node</h3>
                            <p className="text-gray-500 text-[10px] font-medium leading-tight mb-4">Internal questions & participant help.</p>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#00F0FF]/10 w-fit rounded-md">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping"></div>
                                <span className="text-[8px] font-black text-[#00F0FF] uppercase tracking-widest">3 New Requests</span>
                            </div>
                        </Link>
                    </ScrollReveal>

                    <ScrollReveal delay={0.6} className="md:col-span-7">
                         <Link href="/logistics" className="block h-full min-h-[140px] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[1.5rem] p-6 group hover:bg-emerald-500/20 transition-all relative overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[80px] pointer-events-none"></div>
                            <div className="relative z-10 flex items-center justify-between h-full">
                                <div>
                                    <MapPin className="w-6 h-6 text-emerald-400 mb-2" />
                                    <h3 className="text-2xl font-black tracking-tight mb-1">Logistics Deck</h3>
                                    <p className="text-gray-500 text-[10px] max-w-[200px] font-medium leading-tight">Travel & exclusive winner housing.</p>
                                </div>
                                <div className="w-20 h-20 rounded-2xl border border-emerald-500/20 bg-black/40 flex items-center justify-center p-2 hidden sm:flex">
                                    <div className="w-full h-full rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[10px] font-black uppercase">
                                        Active
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </ScrollReveal>

                </div>
            </div>
        </Shell>
    );
}
