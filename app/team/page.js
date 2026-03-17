import Link from 'next/link';
import { ArrowLeft, Users, Shield, Zap, Sparkles, Terminal, Cpu, Target, Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function TeamPage() {
  const teams = [
    {
      name: "COMMAND_CORE",
      color: "from-[#00F0FF] to-[#7000FF]",
      members: [
        { name: "Alex Rivera", role: "Mission Convener", campus: "Sector_NITDGP", bio: "Directing strategic deployment and cross-sector coordination." },
        { name: "Sarah Chen", role: "Technical Architect", campus: "Sector_NITDGP", bio: "Lead system designer for the Aarohan 2026 technical hub." },
        { name: "Marcus Thorne", role: "Operations Command", campus: "Sector_NITDGP", bio: "Overseeing field logistics and tactical execution teams." },
      ]
    },
    {
      name: "TECHNICAL_DIVISION",
      color: "from-[#7000FF] to-pink-500",
      members: [
        { name: "Elena Kovic", role: "Infrastructure Lead", campus: "Sector_NITDGP", bio: "Managing distributed mission nodes and registry systems." },
        { name: "David Wu", role: "Core Developer", campus: "Sector_NITDGP", bio: "Optimizing signal flow and frontend interface performance." },
        { name: "Aria Sterling", role: "Security Ops", campus: "Sector_NITDGP", bio: "Implementing multi-tier authentication and data encryption." },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#00F0FF]/30 selection:text-[#00F0FF] relative overflow-hidden">
      <Navbar />
      
      {/* Ambient backgrounds */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00F0FF]/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#7000FF]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <main className="max-w-7xl mx-auto pt-32 pb-40 px-6 md:px-12 relative z-10">
        <div className="mb-24">
            <Link href="/" className="inline-flex items-center text-gray-500 hover:text-[#00F0FF] font-black text-[10px] uppercase tracking-[0.2em] mb-12 transition-all group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                RETURN_TO_COMMAND
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-gray-500 mb-8 backdrop-blur-xl">
                        <Terminal className="w-4 h-4 text-[#00F0FF]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">PERSONNEL_DIRECTORY_v4.2</span>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-8 uppercase italic italic">
                        THE <br /><span className="gradient-text italic">ARCHITECTS</span>
                    </h1>
                    <p className="text-gray-500 font-bold tracking-widest text-lg leading-relaxed border-l-2 border-[#00F0FF]/30 pl-8 max-w-2xl italic">
                        "The visionary collective responsible for initializing the most sophisticated technical arena in the sector."
                    </p>
                </div>
            </div>
        </div>

        <div className="space-y-40">
          {teams.map((team, i) => (
            <section key={i}>
              <div className="flex items-center gap-8 mb-20 group">
                <h2 className="text-xs font-black text-white uppercase tracking-[0.6em] whitespace-nowrap italic flex items-center gap-4 italic">
                  <div className="w-12 h-[1px] bg-white/10 group-hover:w-24 group-hover:bg-[#00F0FF] transition-all duration-700"></div>
                  {team.name}
                </h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {team.members.map((member, j) => (
                  <div key={j} className="card-glass p-0 group overflow-hidden border-white/5 hover:border-[#00F0FF]/30 transition-all duration-700 bg-black/40 flex flex-col h-full">
                    <div className={`h-[2px] w-0 group-hover:w-full bg-gradient-to-r ${team.color} transition-all duration-700`}></div>
                    
                    <div className="p-10 flex-1 flex flex-col relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/[0.02] rounded-full blur-3xl group-hover:bg-[#00F0FF]/10 transition-all duration-1000"></div>
                        
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-700 group-hover:bg-white group-hover:text-black group-hover:border-transparent transition-all duration-700 shadow-2xl overflow-hidden relative">
                                <Users className="w-10 h-10" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex gap-3">
                                    <Link href="#" className="p-2 rounded-lg bg-white/5 border border-white/5 text-gray-600 hover:text-[#00F0FF] hover:border-[#00F0FF]/30 transition-all"><Github className="w-4 h-4" /></Link>
                                    <Link href="#" className="p-2 rounded-lg bg-white/5 border border-white/5 text-gray-600 hover:text-blue-500 hover:border-blue-500/30 transition-all"><Linkedin className="w-4 h-4" /></Link>
                                </div>
                                <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">ID_AUTH_0{j+1}</span>
                            </div>
                        </div>

                        <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic group-hover:text-[#00F0FF] transition-colors">{member.name}</h3>
                        <p className="text-[10px] font-black text-[#00F0FF] uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                            <Target className="w-3 h-3 text-[#39FF14]" />
                            {member.role}
                        </p>
                        
                        <p className="text-gray-500 font-bold text-sm leading-relaxed uppercase tracking-widest mb-10 border-l border-white/5 pl-6 italic">
                            "{member.bio}"
                        </p>

                        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest font-mono group-hover:text-white transition-colors">LOC__{member.campus}</span>
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-700 group-hover:border-[#00F0FF] group-hover:text-[#00F0FF] transition-all group-hover:rotate-45">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Join CTA */}
        <div className="mt-40 relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-[#7000FF] via-pink-500 to-[#7000FF] rounded-[40px] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
           <div className="card-glass p-16 md:p-24 border-[#7000FF]/20 bg-gradient-to-br from-[#7000FF]/[0.05] via-transparent to-transparent flex flex-col items-center text-center rounded-[40px] relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full grid-bg opacity-[0.05] pointer-events-none"></div>
             
             <div className="w-20 h-20 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center mb-12 shadow-2xl relative z-10">
                <Sparkles className="w-10 h-10 text-[#7000FF] animate-pulse" />
             </div>
             
             <h3 className="text-4xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter italic relative z-10 italic">WANT TO JOIN THE <span className="text-[#7000FF] italic">FLEET?</span></h3>
             <p className="text-gray-500 font-bold text-lg mb-16 max-w-2xl mx-auto leading-relaxed italic relative z-10">
               "We are constantly recruiting elite technical talent to expand the Aarohan ecosystem. If you possess the vision, the arena is yours."
             </p>
             
             <button className="relative group/btn z-10">
                <div className="absolute -inset-1 bg-[#7000FF] rounded-2xl blur opacity-20 group-hover/btn:opacity-60 transition duration-500"></div>
                <div className="relative px-20 py-8 bg-[#7000FF] text-white font-black text-xs uppercase tracking-[0.5em] rounded-2xl leading-none transition-transform active:scale-95 italic">
                    APPLY_FOR_v2.1
                </div>
             </button>
           </div>
        </div>

        {/* System Message */}
        <div className="mt-24 text-center text-[9px] font-black text-gray-800 uppercase tracking-[0.8em] pointer-events-none">
            AAROHAN_CENTRAL_PERSONNEL_GRID_v4.2.0_NITDGP
        </div>
      </main>
    </div>
  );
}
