import Link from 'next/link';
import { ArrowLeft, Zap, Sparkles, Shield, Rocket, Globe, BarChart, ChevronRight, Target, Cpu, Terminal, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function SponsorsPage() {
  const tiers = [
    {
      name: "TITAN_SPONSORS",
      color: "from-[#00F0FF] to-[#7000FF]",
      accent: "#00F0FF",
      sponsors: [
        { name: "Apex Dynamics", industry: "AI & Robotics", website: "#", logo: <Cpu className="w-12 h-12" /> },
        { name: "Zenith Labs", industry: "Quantum Computing", website: "#", logo: <Zap className="w-12 h-12" /> },
      ]
    },
    {
      name: "ORBITAL_PARTNERS",
      color: "from-[#7000FF] to-transparent",
      accent: "#7000FF",
      sponsors: [
        { name: "Nova Systems", industry: "Security", website: "#", logo: <Shield className="w-8 h-8" /> },
        { name: "Streamline", industry: "Logistics", website: "#", logo: <Rocket className="w-8 h-8" /> },
        { name: "CloudGate", industry: "Infrastructure", website: "#", logo: <Globe className="w-8 h-8" /> },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#00F0FF]/30 selection:text-[#00F0FF] relative overflow-hidden">
      <Navbar />
      
      {/* Ambient backgrounds */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00F0FF]/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#7000FF]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <main className="max-w-7xl mx-auto pt-32 pb-20 px-6 md:px-12 relative z-10">
        <div className="mb-24">
            <Link href="/" className="inline-flex items-center text-gray-500 hover:text-[#00F0FF] font-black text-[10px] uppercase tracking-[0.2em] mb-12 transition-all group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                RETURN_TO_COMMAND
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[#00F0FF] mb-8">
                        <Terminal className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">PARTNER_ECOSYSTEM_v2026</span>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-8 uppercase italic italic">
                        SYSTEM <br /><span className="gradient-text italic">PARTNERS</span>
                    </h1>
                    <p className="text-gray-500 font-bold tracking-widest text-lg leading-relaxed border-l-2 border-white/10 pl-8 max-w-2xl italic">
                        "Powering the next decade of technical convergence. Our partners provide the infrastructure for innovation to excel."
                    </p>
                </div>
            </div>
        </div>

        <div className="space-y-40">
          {tiers.map((tier, i) => (
            <section key={i}>
              <div className="flex items-center gap-8 mb-20 group">
                <h2 className="text-xs font-black text-white uppercase tracking-[0.6em] whitespace-nowrap italic italic flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-white/10 group-hover:w-24 group-hover:bg-[#00F0FF] transition-all duration-700"></div>
                  {tier.name}
                </h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {tier.sponsors.map((sponsor, j) => (
                  <div key={j} className="card-glass p-0 group overflow-hidden border-white/5 hover:border-[#00F0FF]/30 transition-all duration-700 flex flex-col items-center bg-black/40">
                    <div className="p-16 flex flex-col items-center text-center relative w-full">
                        <div className="absolute inset-0 grid-bg opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none"></div>
                        
                        <div className={`w-32 h-32 rounded-[32px] bg-white/[0.03] border border-white/10 flex items-center justify-center mb-10 group-hover:bg-gradient-to-br ${tier.color} group-hover:border-transparent group-hover:text-black transition-all duration-700 shadow-2xl scale-95 group-hover:scale-105 group-hover:rotate-6 text-gray-500`}>
                            {sponsor.logo}
                        </div>
                        
                        <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter group-hover:text-[#00F0FF] transition-colors italic">{sponsor.name}</h3>
                        <div className="flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-10">
                            <Target className="w-3 h-3" />
                            {sponsor.industry}
                        </div>
                        
                        <button className="text-[10px] font-black text-[#00F0FF] uppercase tracking-[0.3em] hover:tracking-[0.5em] transition-all flex items-center gap-2 group/btn">
                           VISIT_TERMINAL <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Partner CTA */}
        <div className="mt-40 relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-[#00F0FF] via-[#7000FF] to-[#00F0FF] rounded-[40px] blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-500"></div>
           <div className="card-glass p-16 md:p-24 border-[#00F0FF]/20 bg-gradient-to-br from-[#00F0FF]/[0.03] via-transparent to-[#7000FF]/[0.03] flex flex-col items-center text-center rounded-[40px] relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full grid-bg opacity-[0.05] pointer-events-none"></div>
             
             <div className="w-20 h-20 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center mb-12 shadow-2xl relative z-10">
                <BarChart className="w-10 h-10 text-[#00F0FF] animate-pulse" />
             </div>
             
             <h3 className="text-4xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter italic relative z-10 italic">ELEVATE YOUR <span className="gradient-text italic">BRAND</span></h3>
             <p className="text-gray-500 font-bold text-lg mb-16 max-w-2xl mx-auto leading-relaxed italic relative z-10">
               "Partner with Aarohan 2026 and interface with over 5,000+ top technical operatives across the country. Gain direct visibility in the innovation sector's most active node."
             </p>
             
             <div className="flex flex-col sm:flex-row gap-8 relative z-10 w-full sm:w-auto">
                <button className="btn-primary px-16 py-6 tracking-[0.3em] font-black text-xs uppercase italic active:scale-95 transition-all">RECRUITMENT_BROCHURE</button>
                <button className="px-16 py-6 border border-white/10 bg-white/5 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.4em] hover:bg-white/10 transition-all italic active:scale-95">CONTACT_COMMAND</button>
             </div>
           </div>
        </div>

        {/* Footer System Message */}
        <div className="mt-24 text-center text-[9px] font-black text-gray-800 uppercase tracking-[0.8em] pointer-events-none">
            AAROHAN_ECOSYSTEM_PARTNER_DIRECTORY_v4.2
        </div>
      </main>
    </div>
  );
}
