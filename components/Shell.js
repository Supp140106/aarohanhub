import Sidebar from './Sidebar';
import TechGrid from '@/app/dashboard/components/TechGrid';
import DashboardStyles from '@/app/dashboard/components/DashboardStyles';
import Chatbot from '@/app/dashboard/components/Chatbot';

export default function Shell({ children, userName, userRole, initials }) {
    return (
        <div className="h-screen overflow-hidden bg-[#000] text-white font-sans flex relative">
            <DashboardStyles />
            
            {/* Immersive Background */}
            <TechGrid />
            
            {/* Global Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10 overflow-hidden h-full">
                
                {/* Standardized Global Header */}
                <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full border border-[#00F0FF]/30 bg-gradient-to-br from-[#00F0FF]/20 to-transparent flex items-center justify-center text-[10px] font-black uppercase tracking-widest overflow-hidden">
                            {initials || '??'}
                        </div>
                        <div>
                            <div className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">Node Cluster: Alpha</div>
                            <div className="text-xs font-bold text-white/80">{userName || 'User'}</div>
                        </div>
                    </div>

                    <div className="flex-1 max-w-xs ml-auto">
                        {/* Status readout or space */}
                    </div>

                    <div className="flex items-center gap-3">
                        {userRole && (
                            <span className="px-2 py-0.5 rounded-sm bg-[#00F0FF]/5 border border-[#00F0FF]/20 text-[#00F0FF] text-[8px] font-black uppercase tracking-widest leading-none">
                                Role: {userRole}
                            </span>
                        )}
                        <span className="px-2 py-0.5 rounded-sm bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-[8px] font-black uppercase tracking-widest leading-none">
                            System Status: Stable
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-hidden h-full">
                    {children}
                </div>

                <Chatbot userName={userName} userRole={userRole} />
            </main>
        </div>
    );
}
