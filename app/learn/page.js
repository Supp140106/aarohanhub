import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { checkIfWinner } from '@/app/actions/events';
import Link from 'next/link';
import { ArrowLeft, Play, Lock, Award, BookOpen, Clock, Star, Download, Sparkles, Terminal, ShieldCheck, ChevronRight, Zap, Cpu } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default async function LearningHubPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
        redirect('/login');
    }

    const session = JSON.parse(sessionCookie.value);
    const isWinner = await checkIfWinner(session.userId);

    // SECURITY: Strictly enforce that only winners can access this page
    if (!isWinner && session.role !== 'dba') {
        redirect('/dashboard');
    }

    const courses = [
        {
            title: "Advanced System Design",
            instructor: "Tech Lead @ High-Scale Corp",
            duration: "1h 45m",
            thumbnail: <Terminal className="w-8 h-8" />,
            color: "from-blue-500 to-cyan-400",
            level: "Tier 1",
            tags: ["Architecture", "Scalability"]
        },
        {
            title: "Mastering Next.js 14 Internals",
            instructor: "Framework Architect",
            duration: "2h 10m",
            thumbnail: <Cpu className="w-8 h-8 pointer-events-none" />, // Assuming Cpu is available or similar
            color: "from-purple-500 to-pink-400",
            level: "Elite",
            tags: ["Frontend", "Performance"]
        },
        {
            title: "AI Engineering & LLM Ops",
            instructor: "Neural Network Specialist",
            duration: "3h 20m",
            thumbnail: <Sparkles className="w-8 h-8" />,
            color: "from-emerald-500 to-teal-400",
            level: "Superior",
            tags: ["AI/ML", "MLOps"]
        },
        {
            title: "Zero-Knowledge Architectures",
            instructor: "Cryptography Research Lead",
            duration: "1h 15m",
            thumbnail: <Lock className="w-8 h-8" />,
            color: "from-orange-500 to-yellow-400",
            level: "Legendary",
            tags: ["Web3", "Security"]
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] selection:bg-yellow-500/30 selection:text-yellow-500 relative overflow-hidden">
            <Navbar />
            
            {/* Ambient Gold Backgrounds */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-600/[0.03] rounded-full blur-[150px] pointer-events-none -z-10"></div>
            <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-yellow-500/[0.02] rounded-full blur-[120px] pointer-events-none -z-10"></div>

            <main className="max-w-7xl mx-auto pt-32 pb-20 px-6 md:px-12 relative z-10">
                <div className="mb-20">
                    <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-yellow-500 font-black text-[10px] uppercase tracking-[0.2em] mb-12 transition-all group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        EXIT_THE_VAULT
                    </Link>

                    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 mb-8 backdrop-blur-xl animate-in fade-in slide-in-from-left-4 duration-1000">
                                <Star className="w-4 h-4 fill-yellow-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">AUTHENTICATED_CHAMPION_PROFILE</span>
                            </div>
                            
                            <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none mb-8 uppercase italic italic">
                                THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-500 to-yellow-800">VAULT</span>
                            </h1>
                            <p className="text-gray-500 font-bold tracking-widest text-lg max-w-2xl leading-relaxed border-l-2 border-yellow-500/30 pl-8 italic">
                                "Knowledge is the ultimate currency of the arena. Your victory has unlocked access to the sector's most classified technical archives."
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-3xl hidden xl:block min-w-[300px]">
                           <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mastery Status</span>
                              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">ELITE_TIER</span>
                           </div>
                           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="w-1/4 h-full bg-yellow-500"></div>
                           </div>
                        </div>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {courses.map((course, idx) => (
                        <div key={idx} className="card-glass p-0 group overflow-hidden border-white/5 hover:border-yellow-500/30 transition-all duration-700 cursor-pointer flex flex-col h-full bg-black/40">
                            {/* Accent Line */}
                            <div className={`h-[2px] bg-gradient-to-r ${course.color} opacity-20 group-hover:opacity-100 transition-opacity duration-500`}></div>
                            
                            <div className="p-10 flex-1 flex flex-col relative">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none">
                                   {course.thumbnail}
                                </div>

                                <div className="flex items-center justify-between mb-8">
                                    <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 group-hover:bg-gradient-to-br ${course.color} group-hover:text-black group-hover:border-transparent transition-all duration-700 shadow-xl`}>
                                        {course.thumbnail || <BookOpen className="w-7 h-7" />}
                                    </div>
                                    <span className="text-[9px] font-black text-yellow-500/40 uppercase tracking-[0.2em]">{course.level}</span>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    {course.tags.map(tag => (
                                        <span key={tag} className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-gray-500 border border-white/5">{tag}</span>
                                    ))}
                                </div>

                                <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter leading-tight italic group-hover:text-yellow-500 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-10 flex items-center gap-2">
                                    <Terminal className="w-3 h-3" />
                                    {course.instructor}
                                </p>

                                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Clock className="w-3 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{course.duration}</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-yellow-500 group-hover:text-black group-hover:border-transparent transition-all duration-500 shadow-lg scale-90 group-hover:scale-100">
                                        <Play className="w-5 h-5 fill-current ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Certificate Section */}
                <div className="mt-32 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-yellow-800 rounded-[32px] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                    <div className="card-glass p-12 md:p-20 border-yellow-500/20 bg-gradient-to-br from-yellow-500/[0.03] to-transparent relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-16 rounded-[32px]">
                        <div className="absolute -right-20 -top-20 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity rotate-12 duration-1000">
                            <Award className="w-96 h-96 text-yellow-500" />
                        </div>
                        
                        <div className="relative z-10 text-center lg:text-left max-w-2xl">
                            <div className="flex flex-col lg:flex-row items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-3xl bg-yellow-500 flex items-center justify-center text-black shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                                    <ShieldCheck className="w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Official Accreditation</h3>
                                    <div className="flex items-center justify-center lg:justify-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></div>
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">VERIFIED_BLOCKCHAIN_CREDENTIAL</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-500 font-bold text-lg leading-relaxed italic max-w-xl">
                                Claim your digital proof of excellence. This certificate is cryptographically signed and permanent evidence of your status as an Aarohan 2026 Champion.
                            </p>
                        </div>
                        
                        <button className="relative group/btn z-10 w-full lg:w-auto">
                            <div className="absolute -inset-1 bg-yellow-400 rounded-2xl blur opacity-20 group-hover/btn:opacity-60 transition duration-500"></div>
                            <div className="relative flex items-center justify-center gap-4 px-12 py-6 bg-yellow-500 text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl leading-none transition-transform active:scale-95 italic">
                                <Download className="w-5 h-5" />
                                GENERATE_CERTIFICATE
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </button>
                    </div>
                </div>

                {/* System Message */}
                <div className="mt-20 text-center text-[10px] font-black text-gray-800 uppercase tracking-[0.6em] pointer-events-none">
                    TERMINAL_VAULT_DECODED_LEVEL_9_NITDGP
                </div>
            </main>
        </div>
    );
}

