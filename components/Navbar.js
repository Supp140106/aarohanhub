'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Rocket, Terminal, Shield, Home, Target, Zap, Activity } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Missions', path: '/events', icon: <Target className="w-3 h-3" /> },
    { name: 'Sponsors', path: '/sponsors', icon: <Zap className="w-3 h-3" /> },
    { name: 'Architects', path: '/team', icon: <Shield className="w-3 h-3" /> },
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
      scrolled 
      ? 'py-4 backdrop-blur-3xl bg-black/60 border-b border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
      : 'py-10 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-4"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00F0FF] to-[#7000FF] flex items-center justify-center p-0.5 shadow-[0_0_30px_rgba(0,240,255,0.2)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                   <Rocket className="w-6 h-6 text-[#00F0FF]" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#39FF14] rounded-full border-2 border-black animate-pulse shadow-[0_0_10px_#39FF14]"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white tracking-tighter leading-none italic group-hover:text-[#00F0FF] transition-colors">AAROHAN</span>
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-1 h-3 bg-[#00F0FF] rounded-full opacity-50"></div>
                 <span className="text-[9px] font-black tracking-[0.4em] text-gray-500 uppercase">SYS_GRID_v4.2</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-12">
            <div className="flex items-center gap-2 px-1 py-1 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-3xl">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 overflow-hidden group/item ${
                      isActive(item.path)
                        ? 'text-[#00F0FF] bg-white/5 shadow-inner'
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    <div className={`${isActive(item.path) ? 'text-[#00F0FF]' : 'text-gray-700 group-hover/item:text-[#00F0FF]'} transition-colors`}>
                        {item.icon}
                    </div>
                    {item.name}
                    {isActive(item.path) && (
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00F0FF] animate-in slide-in-from-left-full"></div>
                    )}
                  </Link>
                ))}
            </div>

            <div className="h-8 w-[1px] bg-white/5"></div>

            <Link
              href="/login"
              className="relative group overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF] to-[#7000FF] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative px-8 py-4 bg-white/5 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl border border-white/10 flex items-center gap-3 hover:border-[#00F0FF]/40 transition-all active:scale-95 italic">
                <Terminal className="w-4 h-4 text-[#00F0FF]" />
                Establish Link
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all shadow-xl active:scale-90"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-8 p-10 rounded-[40px] bg-black/90 border border-white/10 backdrop-blur-3xl animate-in slide-in-from-top-8 duration-700 shadow-[0_40px_100px_rgba(0,0,0,1)]">
            <div className="flex flex-col gap-6">
                <div className="p-4 border-b border-white/5 mb-2">
                   <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.5em] mb-4">Tactical_Navigation</p>
                </div>
                
                <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-6 py-6 px-8 rounded-3xl text-sm font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group"
                >
                    <Home className="w-5 h-5 group-hover:text-[#00F0FF]" />
                    Command Center
                </Link>
                
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-6 py-6 px-8 rounded-3xl text-sm font-black uppercase tracking-[0.3em] transition-all group ${
                      isActive(item.path)
                        ? 'text-[#00F0FF] bg-[#00F0FF]/5 border border-[#00F0FF]/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="group-hover:scale-110 transition-transform">{item.icon}</div>
                    {item.name}
                  </Link>
                ))}
                
                <div className="pt-8 mt-4 border-t border-white/5">
                   <Link
                     href="/login"
                     onClick={() => setMobileMenuOpen(false)}
                     className="w-full bg-gradient-to-r from-[#00F0FF] to-[#7000FF] text-black font-black py-6 rounded-3xl text-center text-xs uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(0,240,255,0.2)] transition-all active:scale-95 flex items-center justify-center gap-4 italic"
                   >
                     <Terminal className="w-5 h-5" />
                     Establish Link
                   </Link>
                </div>
            </div>
            
            <div className="mt-12 text-center">
               <span className="text-[9px] font-black text-gray-800 uppercase tracking-[0.6em]">AAROHAN_SYSTEMS_GRID_MOBILE</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
