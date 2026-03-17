import Link from 'next/link';
import { Rocket, Home, LayoutDashboard, Terminal, ShieldAlert } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-[#00F0FF]/30 selection:text-[#00F0FF]">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7000FF]/5 rounded-full blur-[128px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[128px] animate-pulse delay-700 pointer-events-none"></div>

            <div className="relative z-10 text-center">
                <div className="mb-12 relative inline-block">
                    <span className="text-[180px] md:text-[240px] font-black pointer-events-none leading-none select-none bg-gradient-to-b from-white to-white/5 bg-clip-text text-transparent opacity-10">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 flex items-center justify-center rotate-12 animate-bounce shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <ShieldAlert className="w-12 h-12 text-[#00F0FF]" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 mb-8">
                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-2">
                       <Terminal className="w-3 h-3" />
                       <span className="text-[9px] font-black uppercase tracking-[0.2em]">CRITICAL_ERROR: SECTOR_NOT_FOUND</span>
                   </div>
                   <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none italic">
                       LOST IN the <br /> <span className="gradient-text">GRID</span>
                   </h1>
                </div>

                <p className="text-gray-500 text-sm md:text-base max-w-sm mx-auto mb-12 font-medium tracking-wide leading-relaxed">
                    The intelligence you are seeking has been purged or moved to a restricted sector. Return to command immediately.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link
                        href="/dashboard"
                        className="group relative"
                    >
                        <div className="absolute -inset-1 bg-[#00F0FF] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative flex items-center gap-3 px-10 py-5 bg-[#00F0FF] text-black font-black rounded-2xl transition-all uppercase tracking-widest text-xs">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </div>
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-10 py-5 bg-white/5 text-white border border-white/10 backdrop-blur-xl font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                    >
                        <Home className="w-4 h-4 text-gray-400" />
                        Surface
                    </Link>
                </div>
            </div>

            {/* Particle stars effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-[1px] h-[1px] bg-white rounded-full animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    ></div>
                ))}
            </div>
            
            <div className="absolute bottom-12 text-[10px] font-black text-gray-800 uppercase tracking-[0.5em] pointer-events-none">
                AAROHAN_SYSTEMS_v2.0.26
            </div>
        </div>
    );
}
