import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { checkIfWinner } from '@/app/actions/events';
import Link from 'next/link';

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
            instructor: "Tech Lead @ Google",
            duration: "1h 45m",
            thumbnail: "🏗️",
            color: "from-blue-500 to-cyan-500"
        },
        {
            title: "Mastering Next.js 14",
            instructor: "Vercel Core Team",
            duration: "2h 10m",
            thumbnail: "⚡",
            color: "from-purple-500 to-pink-500"
        },
        {
            title: "AI Engineering & LLMs",
            instructor: "OpenAI Researcher",
            duration: "3h 20m",
            thumbnail: "🤖",
            color: "from-green-500 to-emerald-500"
        },
        {
            title: "Zero-Knowledge Proofs",
            instructor: "Web3 Foundation",
            duration: "1h 15m",
            thumbnail: "🔐",
            color: "from-yellow-500 to-orange-500"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans overflow-hidden relative selection:bg-yellow-500 selection:text-gray-900">
            {/* Dark premium background effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-yellow-900/30 to-transparent pointer-events-none"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-yellow-600/10 blur-[120px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
                <Link href="/dashboard" className="text-yellow-400 hover:text-yellow-300 transition font-bold uppercase tracking-widest text-xs mb-10 inline-flex items-center gap-2">
                    <span>←</span> Return to Dashboard
                </Link>

                <div className="mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 font-bold text-xs uppercase tracking-widest border border-yellow-500/30 mb-6 backdrop-blur-md">
                        <span className="animate-pulse">🏆</span> Exclusive Access Granted
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
                        Champion's<br />Learning Hub
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                        Congratulations, {session.name}. Only verified Aarohan winners have access to this premium educational catalog. Level up your skills with advanced technical deep-dives.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course, idx) => (
                        <div key={idx} className="group relative bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-3xl p-6 hover:bg-gray-800 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20 cursor-pointer overflow-hidden">
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${course.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>

                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-3xl mb-6 shadow-lg shadow-black/50 group-hover:scale-110 transition-transform`}>
                                {course.thumbnail}
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
                                {course.title}
                            </h3>

                            <p className="text-gray-400 font-medium text-sm mb-4">
                                by {course.instructor}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <span className="px-3 py-1 rounded-full bg-black/30 text-xs font-bold text-gray-300 border border-gray-700">
                                    {course.duration}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-500 group-hover:text-gray-900 transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-700/50 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm">
                    <div>
                        <h4 className="text-2xl font-bold text-white mb-2">Claim Your Certificate</h4>
                        <p className="text-yellow-200/80">Download your official digital certificate symbolizing your victory at Aarohan 2026.</p>
                    </div>
                    <button className="px-8 py-4 rounded-xl bg-yellow-500 text-gray-900 font-black tracking-wide hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20 shrink-0">
                        Download PDF ↓
                    </button>
                </div>
            </div>
        </div>
    );
}
