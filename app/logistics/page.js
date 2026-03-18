import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getLogistics } from '@/app/actions/logistics';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import SplitText from '@/components/ReactBits/SplitText';
import Shell from '@/components/Shell';
import { ArrowLeft, Home, UtensilsCrossed, HelpCircle, CheckCircle, Clock } from 'lucide-react';

export default async function LogisticsPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
        redirect('/login');
    }

    const session = JSON.parse(sessionCookie.value);
    const res = await getLogistics(session.userId);
    const logistics = res.success ? res.data : null;
    const initials = session.name ? session.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '??';

    return (
        <Shell initials={initials} userName={session.name} userRole={session.role}>
            <div className="h-full flex flex-col items-center overflow-hidden">
                <div className="w-full max-w-5xl px-6 md:px-12 py-8 flex flex-col h-full">
                    
                    <div className="shrink-0">
                        <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors font-bold tracking-widest uppercase text-[9px] flex items-center gap-1.5 mb-6 w-fit inline-flex">
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                        </Link>

                        <div className="mb-10">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-3 mt-2">
                                <SplitText text="LOGISTICS HUB" delay={20} />
                            </h1>
                            <p className="text-gray-400 text-base font-medium">Your travel and accommodation details for Aarohan 2026.</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pb-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Accommodation Card */}
                            <ScrollReveal delay={0.1} className="md:col-span-2">
                                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-[#00F0FF]/30 transition-colors">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/10 flex items-center justify-center border border-[#00F0FF]/20 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                                            <Home className="w-6 h-6 text-[#00F0FF]" />
                                        </div>
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Accommodation Module</h3>
                                    </div>
                                    <div className="bg-black/40 border border-white/5 rounded-[2rem] p-8 shadow-inner">
                                        {logistics?.accommodationDetails ? (
                                            <p className="text-white font-medium leading-relaxed whitespace-pre-wrap text-xl md:text-2xl tracking-tight">
                                                {logistics.accommodationDetails}
                                            </p>
                                        ) : (
                                            <div className="flex items-center gap-5 text-gray-500">
                                                <Clock className="w-6 h-6 shrink-0 opacity-50" />
                                                <p className="text-sm font-medium">Your accommodation hasn&apos;t been assigned yet. System update pending.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Food Coupons Card */}
                            <ScrollReveal delay={0.2} className="h-full">
                                <div className={`border rounded-[2.5rem] p-8 h-full transition-all flex flex-col justify-center relative overflow-hidden group ${logistics?.foodCouponProvided ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40' : 'bg-orange-500/5 border-orange-500/20 hover:border-orange-500/40'}`}>
                                    <div className="flex items-center gap-4 mb-8 relative z-10">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg transition-transform group-hover:scale-110 ${logistics?.foodCouponProvided ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-orange-500/20 border-orange-500/30'}`}>
                                            <UtensilsCrossed className={`w-6 h-6 ${logistics?.foodCouponProvided ? 'text-emerald-400' : 'text-orange-400'}`} />
                                        </div>
                                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Ration Clearance</h3>
                                    </div>

                                    <div className="flex items-center gap-6 mb-4 relative z-10">
                                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shrink-0 shadow-2xl ${logistics?.foodCouponProvided ? 'bg-emerald-500/20 shadow-emerald-500/10' : 'bg-orange-500/20 shadow-orange-500/10'}`}>
                                            {logistics?.foodCouponProvided ? '🍕' : '⏳'}
                                        </div>
                                        <div>
                                            <p className={`font-black text-xl tracking-tighter ${logistics?.foodCouponProvided ? 'text-emerald-400' : 'text-orange-400'}`}>
                                                {logistics?.foodCouponProvided ? 'Coupons Active' : 'Pending Issuance'}
                                            </p>
                                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">
                                                {logistics?.foodCouponProvided ? 'Collect at HQ Access Node' : 'Initialize at Registration'}
                                            </p>
                                        </div>
                                    </div>

                                    {logistics?.foodCouponProvided && (
                                        <div className="mt-6 px-5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] w-fit flex items-center gap-2 relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                            <CheckCircle className="w-3.5 h-3.5" /> Ready for Pickup
                                        </div>
                                    )}
                                </div>
                            </ScrollReveal>

                            {/* Help Card */}
                            <ScrollReveal delay={0.3} className="h-full">
                                <div className="bg-blue-500/5 border border-blue-500/20 rounded-[2.5rem] p-8 hover:border-blue-500/40 transition-all flex flex-col justify-center h-full group">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform">
                                            <HelpCircle className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Discrepancy Protocol</h3>
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-xl mb-2 tracking-tight">Signal Support</p>
                                        <p className="text-gray-500 text-sm font-medium leading-relaxed">System anomalies? Contact the Help Center at the primary venue node immediately.</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
