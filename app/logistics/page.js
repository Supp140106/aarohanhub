import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getLogistics } from '@/app/actions/logistics';
import Link from 'next/link';
import { MapPin, Coffee, HelpCircle, ArrowLeft, Shield, Clock, Utensils, Plane, Car, Home, Info, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default async function LogisticsPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
        redirect('/login');
    }

    const session = JSON.parse(sessionCookie.value);
    const res = await getLogistics(session.userId);
    const logistics = res.success ? res.data : null;

    return (
        <div className="min-h-screen bg-[#050505] selection:bg-[#7000FF]/30 selection:text-[#7000FF] relative overflow-hidden">
            <Navbar />
            
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7000FF]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00F0FF]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

            <main className="max-w-5xl mx-auto pt-32 pb-20 px-6 relative z-10">
                <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-[#00F0FF] font-black text-[10px] uppercase tracking-[0.2em] mb-12 transition-all group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Command Center
                </Link>

                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7000FF] animate-pulse"></div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Operational Support // Sector_9 Logistic_Grid</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase italic border-l-8 border-[#7000FF] pl-8 mb-6">
                        LOGISTICS <span className="gradient-text italic">HUB</span>
                    </h1>
                    <p className="text-gray-500 font-bold tracking-widest text-sm max-w-2xl ml-10">
                        Managing personnel deployment, strategic accommodation, and sustenance clearances across the Aarohan perimeter.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Logistics Data */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Accommodation Card */}
                        <section className="card-glass p-0 border-white/5 overflow-hidden group">
                            <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#7000FF]/10 border border-[#7000FF]/20 flex items-center justify-center text-[#7000FF] group-hover:scale-110 transition-transform">
                                        <Home className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Base Camp Assignment</h3>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">A-TIER HOUSING INTEL</p>
                                    </div>
                                </div>
                                <div className="px-4 py-1.5 rounded-lg bg-black border border-white/10 text-[9px] font-black text-gray-500 uppercase tracking-widest italic group-hover:border-[#7000FF]/30 transition-colors">
                                    AUTH_SECURE
                                </div>
                            </div>

                            <div className="p-10 relative">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                                    <Shield className="w-48 h-48" />
                                </div>
                                
                                {logistics?.accommodationDetails ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest">DEPLOYMENT_SITE</label>
                                                <p className="text-white font-mono text-sm leading-relaxed p-6 rounded-2xl bg-black/40 border border-white/5 italic">
                                                    {logistics.accommodationDetails}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-[#7000FF]" />
                                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Check-in: 09:00 IST</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Govt ID Required</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#7000FF]/10 to-transparent border border-[#7000FF]/10 flex flex-col justify-center items-center text-center">
                                            <MapPin className="w-10 h-10 text-[#7000FF] mb-4 animate-bounce" />
                                            <p className="text-xs text-white font-black uppercase tracking-widest mb-2">Navigate To Site</p>
                                            <button className="text-[9px] font-black text-[#00F0FF] hover:underline uppercase tracking-widest italic">OPEN_MAP_HUD →</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                        <Clock className="w-16 h-16 text-gray-800 mb-6 animate-pulse" />
                                        <h4 className="text-xl font-black text-gray-600 uppercase tracking-widest italic mb-2">PENDING_DEPLOYMENT</h4>
                                        <p className="text-gray-700 font-bold uppercase tracking-[0.2em] text-[10px]">Registry synchronized. Details pending field observer confirmation.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Sustenance Card */}
                        <section className="card-glass p-0 border-white/5 overflow-hidden group">
                           <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center text-[#00F0FF] group-hover:scale-110 transition-transform">
                                        <Utensils className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Sustenance Clearances</h3>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">NUTRITION_TOKEN_STATUS</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-10">
                                <div className={`p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 border transition-all duration-700 relative overflow-hidden ${logistics?.foodCouponProvided ? 'bg-[#39FF14]/5 border-[#39FF14]/20 shadow-[0_0_30px_rgba(57,255,20,0.05)]' : 'bg-white/5 border-white/10'}`}>
                                    <div className="flex items-center gap-8 relative z-10">
                                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 ${logistics?.foodCouponProvided ? 'border-[#39FF14]/40 bg-[#39FF14]/10 text-[#39FF14] animate-pulse' : 'border-white/10 bg-white/5 text-gray-700'}`}>
                                            {logistics?.foodCouponProvided ? <Coffee className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
                                        </div>
                                        <div>
                                            <p className={`text-3xl font-black uppercase tracking-tight italic ${logistics?.foodCouponProvided ? 'text-[#39FF14]' : 'text-gray-500'}`}>
                                                {logistics?.foodCouponProvided ? 'CLEARANCE_GRANTED' : 'IN_QUEUE'}
                                            </p>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">
                                                {logistics?.foodCouponProvided 
                                                    ? 'Tokens authenticated. Collect from Sector_7 mess terminal.' 
                                                    : 'Syncing with mess inventory. Expected availability T-Minus 12:00.'}
                                            </p>
                                        </div>
                                    </div>
                                    {logistics?.foodCouponProvided && (
                                        <div className="relative z-10 px-8 py-3 rounded-full bg-[#39FF14] text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl skew-x-[-10deg]">
                                            COLLECT_NOW
                                        </div>
                                    )}
                                    <div className="absolute inset-0 grid-bg opacity-[0.02] pointer-events-none"></div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Information Sidebar */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Terminal Intel */}
                        <div className="card-glass p-8 space-y-8 bg-black/40 border-[#00F0FF]/10 relative group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                <Info className="w-20 h-20" />
                            </div>
                            
                            <h4 className="text-[10px] font-black text-[#00F0FF] uppercase tracking-[0.5em] italic flex items-center gap-3">
                                <div className="w-4 h-[1px] bg-[#00F0FF]"></div>
                                COMMAND_ADVISORY
                            </h4>
                            
                            <div className="space-y-6">
                                {[
                                    { icon: <Plane className="w-4 h-4" />, label: "RAIL_AIR_SYNC", desc: "Keep physical copies of all travel tickets for reimbursement protocol." },
                                    { icon: <Car className="w-4 h-4" />, label: "LOCAL_GRID", desc: "Shuttle services between NITDGP main gate and base camp every 30 mins." },
                                    { icon: <Shield className="w-4 h-4" />, label: "SECURITY", desc: "Wear your personnel RFID badge at all times within the perimeter." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">{item.label}</p>
                                            <p className="text-[11px] text-gray-600 font-bold leading-tight uppercase">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Support Channel */}
                        <div className="p-8 rounded-3xl bg-gradient-to-t from-[#7000FF]/10 to-[#00F0FF]/5 border border-white/5 text-center">
                            <HelpCircle className="w-12 h-12 text-[#00F0FF] mx-auto mb-6 animate-pulse" />
                            <h4 className="text-lg font-black text-white uppercase tracking-tight italic mb-3">Signal Lost?</h4>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-8 leading-relaxed">
                                If your deployment data is corrupted or deployment site is inaccessible, escalate to the central plaza command deck.
                            </p>
                            <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.3em] hover:bg-white/10 transition-all italic">
                                OPEN_SECURE_CHANNEL
                            </button>
                        </div>

                        {/* System Status Footer */}
                        <div className="mt-10 px-8 py-6 rounded-2xl bg-black/80 border border-white/5 text-center">
                            <span className="text-[9px] font-black text-gray-800 uppercase tracking-[0.4em] pointer-events-none">
                                ENIGMA_LOGISTICS_STREAMS_v7.4
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
