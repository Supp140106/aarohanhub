import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050B1B] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse delay-700"></div>

            <div className="relative z-10 text-center">
                <div className="mb-8 relative inline-block">
                    <span className="text-[180px] md:text-[240px] font-black pointer-events-none leading-none select-none bg-gradient-to-b from-white to-white/10 bg-clip-text text-transparent opacity-20">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 flex items-center justify-center rotate-12 animate-bounce">
                            <span className="text-4xl">🚀</span>
                        </div>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                    Lost in Space?
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto mb-12 font-medium">
                    The page you're looking for has drifted beyond our orbit. Let's get you back to base.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/dashboard"
                        className="px-10 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-all shadow-2xl shadow-white/10 uppercase tracking-widest text-sm"
                    >
                        Back to Dashboard
                    </Link>
                    <Link
                        href="/"
                        className="px-10 py-4 bg-white/5 text-white border border-white/10 backdrop-blur-sm font-black rounded-full hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
                    >
                        Home Page
                    </Link>
                </div>
            </div>

            {/* Floating stars effect */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
}
