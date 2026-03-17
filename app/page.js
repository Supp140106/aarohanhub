import Link from 'next/link';
import { Rocket, Shield, ShieldCheck, Zap, Target, ArrowRight, Terminal, Globe, Cpu, Users, Award, ChevronRight, Activity, Sparkles, Box } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SplineScene from '@/components/SplineScene';
import ParticleBackground from '@/components/ParticleBackground';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#00F0FF]/30 selection:text-[#00F0FF] relative overflow-hidden">
      <Navbar />
      
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-black/50 to-[#050505]"></div>
        
        {/* Ambient Lights */}
        <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-[#00F0FF]/10 rounded-full blur-[180px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-[#7000FF]/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 relative z-10 animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="flex items-center gap-4 mb-10 px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-3xl w-fit">
                    <Activity className="w-4 h-4 text-[#39FF14] animate-pulse" />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.5em]">System_Status: Operational_Node_v4.2</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl xl:text-[120px] font-black text-white leading-[0.85] tracking-tighter mb-10 uppercase italic">
                    AAROHAN <br />
                    <span className="gradient-text italic inline-block pr-8">2026</span>
                </h1>
                
                <p className="text-gray-500 font-bold text-lg md:text-xl tracking-widest leading-relaxed border-l-4 border-[#00F0FF] pl-10 max-w-2xl mb-16 italic">
                    "NIT Durgapur's premier technical odyssey returns. Initialize your journey through the most formidable coding, robotics, and engineering arena in the nation."
                </p>

                <div className="flex flex-col sm:flex-row gap-8">
                    <Link
                      href="/events"
                      className="group relative"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#00F0FF] to-[#7000FF] rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
                        <div className="relative px-16 py-6 bg-[#00F0FF] text-black font-black text-xs uppercase tracking-[0.4em] rounded-2xl flex items-center justify-center gap-4 group-hover:bg-white transition-all italic active:scale-95">
                            ENTER_THE_ARENA
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </Link>
                    
                    <Link
                      href="/login"
                      className="px-16 py-6 bg-white/[0.03] border border-white/10 text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl backdrop-blur-3xl hover:bg-white/5 transition-all italic flex items-center justify-center gap-4 active:scale-95"
                    >
                        <Terminal className="w-5 h-5 text-gray-500" />
                        OP_LOG_IN
                    </Link>
                </div>
                
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12">
                     {[
                        { label: "Active_Operatives", val: "5K+" },
                        { label: "Mission_Sectors", val: "15+" },
                        { label: "Prize_Inventory", val: "500K" },
                        { label: "Global_Nodes", val: "20+" }
                     ].map((stat, i) => (
                        <div key={i} className="flex flex-col border-l border-white/5 pl-6 group">
                            <span className="text-3xl font-black text-white group-hover:text-[#00F0FF] transition-colors tracking-tighter italic">{stat.val}</span>
                            <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest mt-2 group-hover:translate-x-1 transition-transform">{stat.label}</span>
                        </div>
                     ))}
                </div>
            </div>

            {/* Visualizer Side (Visible on LG+) */}
            <div className="hidden lg:flex lg:col-span-5 relative h-[600px] flex items-center justify-center transition-all duration-1000 group">
                <div className="absolute inset-0 bg-gradient-Radial from-[#00F0FF]/10 to-transparent rounded-full blur-[100px] group-hover:blur-[50px] transition-all"></div>
                <SplineScene className="w-full h-full scale-100 lg:scale-125 xl:scale-150" />
                
                {/* Tactical Overlays */}
                <div className="absolute top-0 right-0 p-8 card-glass border-white/5 bg-black/40 backdrop-blur-3xl animate-in slide-in-from-right-12 duration-1000">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping"></div>
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">SYNC_READY</span>
                    </div>
                    <div className="w-48 h-[2px] bg-white/5 mb-4">
                        <div className="w-1/3 h-full bg-[#00F0FF]"></div>
                    </div>
                    <p className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">Lat: 23.5489 N // Long: 87.2926 E</p>
                </div>
            </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 group">
            <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] group-hover:text-white transition-colors">Descend</span>
            <div className="w-[1px] h-12 bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-[#00F0FF] animate-bounce"></div>
            </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="relative py-40 px-6 md:px-12 bg-black/40">
        <div className="max-w-7xl mx-auto">
            <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
                <div className="max-w-3xl">
                    <h2 className="text-xs font-black text-[#7000FF] uppercase tracking-[0.6em] mb-8 flex items-center gap-4 italic italic">
                        <div className="w-12 h-1 bg-[#7000FF]/20"></div>
                        Core_Infrastructure
                    </h2>
                    <h3 className="text-5xl md:text-8xl font-black text-white tracking-tighter italic uppercase leading-none">
                        BEYOND THE <br /><span className="gradient-text italic inline-block pr-8">PERIMETER</span>
                    </h3>
                </div>
                <p className="text-gray-500 font-bold max-w-sm italic border-l-2 border-white/5 pl-8">
                    "Expanding the boundaries of digital competition through integrated technical ecosystems."
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative">
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                    <ParticleBackground />
                </div>
                
                {[
                    { 
                        icon: <Cpu className="w-8 h-8" />, 
                        title: "Technocracia", 
                        desc: "Engage in NIT Durgapur's signature hackathons and core engineering challenges across diverse sectors.",
                        color: "from-blue-500 to-cyan-400" 
                    },
                    { 
                        icon: <Globe className="w-8 h-8" />, 
                        title: "National_Nexus", 
                        desc: "Connect with thousands of elite tech enthusiasts from premier institutes across the country.",
                        color: "from-purple-500 to-pink-400" 
                    },
                    { 
                        icon: <ShieldCheck className="w-8 h-8" />, 
                        title: "Legacy_Vault", 
                        desc: "Unlock classified workshops and elite post-fest opportunities exclusive to Aarohan champions.",
                        color: "from-emerald-500 to-teal-400" 
                    },
                    { 
                        icon: <Zap className="w-8 h-8" />, 
                        title: "Innovation_Flow", 
                        desc: "Transform your visionary ideas into prototypes using industrial-grade resources and mentorship.",
                        color: "from-orange-500 to-yellow-400" 
                    },
                    { 
                        icon: <Target className="w-8 h-8" />, 
                        title: "Strategic_Ops", 
                        desc: "Real-time arena metrics, dynamic scoreboards, and seamless event coordination systems.",
                        color: "from-red-500 to-rose-400" 
                    },
                    { 
                        icon: <Activity className="w-8 h-8" />, 
                        title: "Cultural_Sync", 
                        desc: "A unique fusion of high-octane technical events with vibrant festival vibes and nights.",
                        color: "from-indigo-500 to-blue-400" 
                    }
                ].map((feature, i) => (
                    <div key={i} className="card-glass p-0 border-white/5 group hover:border-white/10 transition-all duration-700 bg-black/60 relative z-10 overflow-hidden h-full">
                        <div className={`h-[2px] w-0 group-hover:w-full bg-gradient-to-r ${feature.color} transition-all duration-700 mb-8`}></div>
                        <div className="p-12 h-full flex flex-col">
                            <div className="w-16 h-16 rounded-[22px] bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-500 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-700 mb-10 shadow-2xl">
                                {feature.icon}
                            </div>
                            <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic group-hover:text-[#00F0FF] transition-colors">{feature.title}</h4>
                            <p className="text-gray-500 font-bold text-sm leading-relaxed uppercase tracking-widest">{feature.desc}</p>
                            
                            <div className="mt-12 pt-8 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-between">
                                <span className="text-[10px] font-black text-[#00F0FF] uppercase tracking-[0.3em]">Query_Intel</span>
                                <ChevronRight className="w-5 h-5 text-[#00F0FF]" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 px-6 md:px-12">
        <div className="absolute inset-0 bg-gradient-to-t from-[#7000FF]/10 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto rounded-[50px] bg-white/[0.02] border border-white/5 p-20 md:p-32 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 rotate-12 pointer-events-none">
                <Rocket className="w-96 h-96 text-[#00F0FF]" />
            </div>
            
            <div className="relative z-10 text-center max-w-4xl mx-auto">
                <h2 className="text-xs font-black text-[#39FF14] uppercase tracking-[0.8em] mb-12 italic">System_Establish_Sequence</h2>
                <h3 className="text-6xl md:text-[120px] font-black text-white tracking-tighter italic uppercase leading-none mb-16">
                    AAROHAN <br /><span className="gradient-text italic inline-block pr-8">IS CALLING</span>
                </h3>
                <p className="text-gray-500 font-bold text-xl md:text-2xl italic mb-20 max-w-2xl mx-auto">
                    "The journey of a thousand code-lines begins with a single registration. Secure your slot for NIT Durgapur's technical finale."
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-10">
                    <Link href="/register" className="btn-primary px-20 py-8 text-sm tracking-[0.4em] italic shadow-[0_30px_60px_rgba(0,240,255,0.3)] active:scale-95">INITIALIZE_ID</Link>
                    <Link href="/events" className="px-16 py-8 border border-white/10 bg-white/5 rounded-2xl text-[11px] font-black text-white uppercase tracking-[0.5em] hover:bg-white/10 transition-all italic active:scale-95 flex items-center justify-center gap-4">VIEW_MISSIONS</Link>
                </div>
            </div>
        </div>
      </section>

      {/* Footer System Message */}
      <footer className="py-32 px-6 md:px-12 border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none"></div>
        <div className="flex flex-col items-center gap-12 relative z-10">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-[12px] font-black text-gray-400 uppercase tracking-[0.4em]">
                <Link href="/events" className="hover:text-[#00F0FF] transition-all hover:tracking-[0.6em]">MISSIONS</Link>
                <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10"></div>
                <Link href="/sponsors" className="hover:text-[#00F0FF] transition-all hover:tracking-[0.6em]">GRID_PARTNERS</Link>
                <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10"></div>
                <Link href="/team" className="hover:text-[#00F0FF] transition-all hover:tracking-[0.6em]">ARCHITECTS</Link>
            </div>
            <div className="flex flex-col items-center gap-4">
                <p className="text-[12px] font-black text-gray-500 uppercase tracking-[0.5em]">
                    AAROHAN_2026_NITDGP_CENTRAL_HUB_SYSTEMS_v4.3.0
                </p>
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/30 to-transparent"></div>
            </div>
        </div>
      </footer>
    </div>
  );
}

