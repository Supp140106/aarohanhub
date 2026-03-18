'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { 
    Calendar, Globe, LogOut, 
    MessageCircleQuestion, MapPin, Activity
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { icon: <Globe className="w-5 h-5" />, label: "Dashboard", href: "/dashboard" },
        { icon: <Calendar className="w-5 h-5" />, label: "Events", href: "/events" },
        { icon: <MessageCircleQuestion className="w-5 h-5" />, label: "Support", href: "/support" },
        { icon: <MapPin className="w-5 h-5" />, label: "Travel", href: "/logistics" },
    ];

    return (
        <aside className="hidden lg:flex w-20 flex-col items-center py-6 border-r border-white/5 bg-black/40 backdrop-blur-3xl z-20 shrink-0">
            <Link href="/" className="mb-10 group">
                <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center group-hover:bg-[#00F0FF]/30 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                    <Activity className="w-5 h-5 text-[#00F0FF]" />
                </div>
            </Link>
            
            <div className="flex flex-col gap-8 flex-1">
                {menuItems.map((item, idx) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={idx} 
                            href={item.href} 
                            title={item.label} 
                            className={`transition-all hover:scale-110 ${isActive ? 'text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'text-gray-500 hover:text-[#00F0FF]'}`}
                        >
                            {item.icon}
                        </Link>
                    );
                })}
            </div>

            <form action={logout}>
                <button type="submit" className="text-gray-600 hover:text-red-500 transition-colors p-2">
                    <LogOut className="w-5 h-5" />
                </button>
            </form>
        </aside>
    );
}
