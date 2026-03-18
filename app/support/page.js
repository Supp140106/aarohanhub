import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SupportBoard from './components/SupportBoard';
import { fetchSupportQueries } from '@/app/actions/support';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SplitText from '@/components/ReactBits/SplitText';
import Shell from '@/components/Shell';

export default async function SupportPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
        redirect('/');
    }
    
    const session = JSON.parse(sessionCookie.value);
    const queries = await fetchSupportQueries();
    
    const isStaff = session.role === 'dba' || session.role === 'volunteer';
    const initials = session.name ? session.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '??';

    return (
        <Shell initials={initials} userName={session.name} userRole={session.role}>
            <div className="h-full flex flex-col items-center overflow-hidden">
                <div className="w-full max-w-5xl px-6 md:px-12 py-8 flex flex-col h-full">
                    <div className="shrink-0">
                        <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors font-bold tracking-widest uppercase text-[9px] flex items-center gap-1.5 mb-6 w-fit inline-flex">
                            <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
                        </Link>

                        <div className="mb-10">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-3 flex gap-3">
                                <SplitText text="SUPPORT" delay={20} className="text-white" />
                                <SplitText text="HUB" delay={20} className="text-[#00F0FF]" />
                            </h1>
                            <p className="text-gray-400 text-base font-medium">
                                {isStaff ? "Review and respond to incoming participant queries." : "Have a question? Ask our Volunteers and DBAs."}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pb-20">
                        <SupportBoard initialQueries={queries} isStaff={isStaff} />
                    </div>
                </div>
            </div>
        </Shell>
    );
}
