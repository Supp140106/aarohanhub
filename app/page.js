import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ScrollReveal from '@/components/ScrollReveal';
import SplitText from '@/components/ReactBits/SplitText';
import BlurText from '@/components/ReactBits/BlurText';
import Marquee from '@/components/Marquee';
import FloatingLines from '@/components/ReactBits/FloatingLines';
import { cookies } from 'next/headers';
import PurpleRobot from '@/components/PurpleRobot';
import IntroScreen from '@/components/IntroScreen';
export default async function LandingPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  let session = null;
  if (sessionCookie) {
      try {
          session = JSON.parse(sessionCookie.value);
      } catch (e) {
          session = null;
      }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
      <IntroScreen />
      <Navbar isLoggedIn={!!session} />
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-end pb-20 px-6 md:px-12 pt-40">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <FloatingLines 
            enabledWaves={["top","middle","bottom"]}
            lineCount={5}
            lineDistance={5}
            bendRadius={5}
            bendStrength={-0.5}
            interactive={true}
            parallax={true}
          />
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
            <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter uppercase">
                <div className="overflow-hidden"><SplitText text="WE BUILD" delay={30} className="block" /></div>
                <div className="overflow-hidden text-[#00F0FF]"><SplitText text="TECHNICAL" delay={30} className="block" /></div>
                <div className="overflow-hidden"><SplitText text="FESTIVALS" delay={30} className="block" /></div>
            </h1>
            
            <div className="mt-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <BlurText 
                    className="text-gray-400 font-medium text-xl md:text-3xl max-w-2xl leading-tight tracking-tight"
                    text="NIT Durgapur's premier technical odyssey returns. An experience that turns students into innovators, and ideas into startups."
                    delay={20} 
                />
                
                <Link href={session ? "/dashboard" : "/login"} className="pointer-events-auto group flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full font-bold uppercase tracking-wider hover:scale-105 transition-transform">
                    <span>{session ? "Dashboard" : "Join The Arena"}</span>
                    <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
                </Link>
            </div>
            
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-white/20">
                {[
                { label: "Active Participants", val: "5,000+" },
                { label: "Core Events", val: "15+" },
                { label: "Founded", val: "2003" }
                ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-widest mb-2">{stat.label}</span>
                    <span className="text-4xl font-bold">{stat.val}</span>
                </div>
                ))}
            </div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee 
          items={["AAROHAN 2026", "INNOVATION", "TECHNOLOGY", "HACKATHONS", "ROBOTICS", "CODING"]} 
          speed={40} 
          className="mt-20"
      />

      {/* BENTO GRID PROJECTS/SERVICES */}
      <section className="py-40 px-6 md:px-12 bg-white text-black">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-12 mb-20">
                <ScrollReveal className="flex-1 flex flex-col justify-center">
                    <h2 className="text-[3.5rem] md:text-[5.5rem] lg:text-[6.5rem] font-black tracking-tighter uppercase leading-[0.9]">
                        We design for<br/>
                        <span className="text-[#00F0FF]">results</span> —<br/>
                        pushing<br/>
                        technical<br/>
                        boundaries.
                    </h2>
                </ScrollReveal>
                
                <ScrollReveal delay={0.2} className="flex-1 w-full min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden shadow-2xl relative border border-white/10">
                    <div className="absolute inset-0">
                        <PurpleRobot />
                    </div>
                </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[400px] gap-6">
                {/* Large Card */}
                <ScrollReveal delay={0.1} className="md:col-span-8 rounded-3xl bg-[#050505] text-white p-12 flex flex-col justify-between group overflow-hidden relative cursor-pointer">
                    <div className="absolute inset-0 bg-[#00F0FF]/0 group-hover:bg-[#00F0FF]/10 transition-colors duration-500"></div>
                    <div className="relative z-10">
                        <span className="text-[#00F0FF] uppercase tracking-widest font-bold text-sm mb-4 block">01 / Flagship Events</span>
                        <h3 className="text-5xl font-black tracking-tight uppercase leading-none">Technocracia</h3>
                    </div>
                    <div className="relative z-10 flex justify-between items-end">
                        <p className="max-w-sm text-gray-400 text-lg">Engage in signature hackathons and engineering challenges.</p>
                        <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ArrowUpRight className="w-8 h-8" />
                        </div>
                    </div>
                </ScrollReveal>

                {/* Medium Card */}
                <ScrollReveal delay={0.2} className="md:col-span-4 rounded-3xl bg-gray-100 p-12 flex flex-col justify-between group cursor-pointer hover:bg-gray-200 transition-colors duration-500">
                    <div>
                        <span className="text-black/50 uppercase tracking-widest font-bold text-sm mb-4 block">02 / Network</span>
                        <h3 className="text-4xl font-black tracking-tight uppercase leading-none">Global Nexus</h3>
                    </div>
                    <div>
                        <p className="text-gray-600 text-lg mb-6">Connect with elite tech enthusiasts.</p>
                        <ArrowUpRight className="w-10 h-10 text-black/50 group-hover:text-black transition-colors" />
                    </div>
                </ScrollReveal>

                {/* Medium Card */}
                <ScrollReveal delay={0.3} className="md:col-span-4 rounded-3xl bg-gray-100 p-12 flex flex-col justify-between group cursor-pointer hover:bg-gray-200 transition-colors duration-500">
                    <div>
                        <span className="text-black/50 uppercase tracking-widest font-bold text-sm mb-4 block">03 / Exclusives</span>
                        <h3 className="text-4xl font-black tracking-tight uppercase leading-none">Legacy Vault</h3>
                    </div>
                    <div>
                        <p className="text-gray-600 text-lg mb-6">Classified workshops for champions.</p>
                        <ArrowUpRight className="w-10 h-10 text-black/50 group-hover:text-black transition-colors" />
                    </div>
                </ScrollReveal>

                {/* Large Card */}
                <ScrollReveal delay={0.4} className="md:col-span-8 rounded-3xl bg-[#00F0FF] text-black p-12 flex flex-col justify-between group cursor-pointer overflow-hidden relative">
                    <div className="relative z-10">
                        <span className="text-black/60 uppercase tracking-widest font-bold text-sm mb-4 block">04 / Platform</span>
                        <h3 className="text-5xl font-black tracking-tight uppercase leading-none">Strategic Ops</h3>
                    </div>
                    <div className="relative z-10 flex justify-between items-end">
                        <p className="max-w-sm text-black/80 text-lg font-medium">Real-time arena metrics, dynamic scoreboards, and seamless event coordination systems.</p>
                        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ArrowUpRight className="w-8 h-8" />
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
      </section>

      {/* LET'S TALK / CTA SECTION */}
      <section className="min-h-screen flex flex-col bg-[#050505] relative overflow-hidden text-center justify-center items-center px-6">
          <ScrollReveal>
             <h2 className="text-[15vw] leading-[0.8] font-black tracking-tighter uppercase text-white hover:text-[#00F0FF] transition-colors cursor-pointer">
                 LET'S<br/>TALK
             </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2} className="mt-20">
              <Link href={session ? "/dashboard" : "/register"} className="inline-block px-12 py-6 rounded-full border border-white/20 text-xl font-bold text-white hover:bg-white hover:text-black transition-colors uppercase tracking-widest">
                  {session ? "Dashboard" : "Start Your Journey"}
              </Link>
          </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 md:px-12 bg-[#050505] border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-black tracking-tighter">AAROHAN © 2026</div>
          <div className="flex gap-8 text-gray-400 font-bold uppercase tracking-widest text-sm">
              <Link href="/events" className="hover:text-white transition-colors">Events</Link>
              <Link href="/sponsors" className="hover:text-white transition-colors">Sponsors</Link>
              <Link href="/team" className="hover:text-white transition-colors">Team</Link>
          </div>
      </footer>
    </div>
  );
}
