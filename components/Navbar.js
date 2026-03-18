'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Activity, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center group-hover:bg-[#00F0FF]/20 transition-all">
                        <Activity className="w-4 h-4 text-[#00F0FF]" />
                    </div>
                    <span className="text-sm font-black text-white uppercase tracking-[0.3em] italic">AAROHAN</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    {[
                        { label: 'Events', href: '/events' },
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Support', href: '/support' },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] hover:text-[#00F0FF] transition-all hover:tracking-[0.5em]"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/register"
                        className="px-8 py-2.5 bg-[#00F0FF]/10 border border-[#00F0FF]/20 rounded-xl text-[10px] font-black text-[#00F0FF] uppercase tracking-[0.4em] hover:bg-[#00F0FF]/20 transition-all"
                    >
                        Register
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden text-white/60 hover:text-white transition-colors"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 px-6 py-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    {[
                        { label: 'Events', href: '/events' },
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Support', href: '/support' },
                        { label: 'Register', href: '/register' },
                        { label: 'Login', href: '/login' },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block text-sm font-black text-gray-400 uppercase tracking-[0.3em] hover:text-[#00F0FF] transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
