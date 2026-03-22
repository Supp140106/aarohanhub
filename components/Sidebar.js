'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { 
    Calendar, Globe, LogOut, 
    MessageCircleQuestion, MapPin, Activity, Menu
} from 'lucide-react';

export default function Sidebar({ userName, userRole, initials }) {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false);

    const menuItems = [
        { icon: <Globe className="w-5 h-5" />, label: "Dashboard", href: "/dashboard" },
        { icon: <Calendar className="w-5 h-5" />, label: "Events", href: "/events" },
        { icon: <MessageCircleQuestion className="w-5 h-5" />, label: "Support", href: "/support" },
        { icon: <MapPin className="w-5 h-5" />, label: "Travel", href: "/logistics" },
    ];

    return (
        <motion.aside 
            animate={{ width: isExpanded ? 260 : 80 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="hidden lg:flex flex-col h-full border-r border-white/5 bg-black/40 backdrop-blur-3xl z-40 shrink-0 overflow-hidden"
        >
            <div className="p-4 flex flex-col h-full">
                {/* Top Section: Toggle & Logo */}
                <div className={`flex items-center gap-4 mb-10 ${isExpanded ? 'px-2' : 'justify-center'}`}>
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    
                    {isExpanded && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 overflow-hidden"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-[#00F0FF]" />
                            </div>
                            <span className="text-xs font-black text-white uppercase tracking-[0.2em] whitespace-nowrap">AAROHAN</span>
                        </motion.div>
                    )}
                </div>

                {!isExpanded && (
                    <div className="flex justify-center mb-10">
                        <Link href="/" className="group">
                            <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center group-hover:bg-[#00F0FF]/30 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                                <Activity className="w-5 h-5 text-[#00F0FF]" />
                            </div>
                        </Link>
                    </div>
                )}
                
                {/* Menu Items */}
                <div className="flex flex-col gap-2 flex-1">
                    {menuItems.map((item, idx) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={idx} 
                                href={item.href} 
                                className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${isActive ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <div className={`shrink-0 ${isActive ? 'shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'group-hover:scale-110 transition-transform'}`}>
                                    {item.icon}
                                </div>
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.span 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="text-sm font-bold tracking-tight whitespace-nowrap overflow-hidden"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom Section: User & Logout */}
                <div className="pt-6 mt-6 border-t border-white/5 flex flex-col gap-4">
                    <div className={`flex items-center gap-3 ${isExpanded ? 'px-2' : 'justify-center'}`}>
                        <div className="w-10 h-10 rounded-full border border-[#00F0FF]/30 bg-gradient-to-br from-[#00F0FF]/20 to-transparent flex items-center justify-center text-[10px] font-black uppercase tracking-widest shrink-0">
                            {initials || '??'}
                        </div>
                        {isExpanded && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col overflow-hidden"
                            >
                                <span className="text-xs font-bold text-white/90 whitespace-nowrap">{userName || 'User'}</span>
                                <span className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest truncate">{userRole || 'Guest'}</span>
                            </motion.div>
                        )}
                    </div>

                    <form action={logout}>
                        <button 
                            type="submit" 
                            className={`flex items-center gap-4 w-full p-3 rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-500/5 transition-all group`}
                        >
                            <div className="shrink-0 group-hover:scale-110 transition-transform">
                                <LogOut className="w-5 h-5" />
                            </div>
                            {isExpanded && (
                                <motion.span 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm font-bold"
                                >
                                    Log out
                                </motion.span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </motion.aside>
    );
}
