import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchAllUsers } from '@/app/actions/admin';
import Link from 'next/link';
import UserList from '@/app/dashboard/components/UserList';
import ScrollReveal from '@/components/ScrollReveal';
import SplitText from '@/components/ReactBits/SplitText';
import Shell from '@/components/Shell';
import { ArrowLeft, Shield } from 'lucide-react';

export default async function AdminUsersPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    // Route Safety: Redirect if not logged in
    if (!sessionCookie) {
        redirect('/login');
    }

    const session = JSON.parse(sessionCookie.value);

    // Route Safety: Only dba and volunteer roles can access this page
    if (session.role !== 'dba' && session.role !== 'volunteer') {
        redirect('/dashboard');
    }

    const users = await fetchAllUsers();
    const initials = session.name ? session.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '??';

    return (
        <Shell initials={initials} userName={session.name} userRole={session.role}>
            <div className="h-full flex flex-col items-center overflow-hidden">
                <div className="w-full max-w-7xl px-6 md:px-12 py-8 flex flex-col h-full">
                    
                    <div className="shrink-0">
                        <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors font-bold tracking-widest uppercase text-[9px] flex items-center gap-1.5 mb-6 w-fit inline-flex">
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                        </Link>

                        <div className="mb-10">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-3 flex gap-4">
                                <SplitText text="USER" delay={20} className="text-[#00F0FF]" />
                                <SplitText text="MANAGEMENT" delay={20} />
                            </h1>
                            <p className="text-gray-400 text-base font-medium max-w-2xl">View and manage all festival participants, volunteers, and staff with full system clearance.</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pb-20">
                        <UserList initialUsers={users} currentUserRole={session.role} />
                    </div>
                </div>
            </div>
        </Shell>
    );
}
