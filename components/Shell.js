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
            <Sidebar userName={userName} userRole={userRole} initials={initials} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10 overflow-hidden h-full">
                {/* Page Content */}
                <div className="flex-1 overflow-hidden h-full">
                    {children}
                </div>

                <Chatbot userName={userName} userRole={userRole} />
            </main>
        </div>
    );
}
