import { cookies } from 'next/headers';
import Shell from '@/components/Shell';
import PageSkeleton from '@/components/PageSkeleton';

export default async function Loading() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    let session = {};
    if (sessionCookie?.value) {
        try {
            session = JSON.parse(sessionCookie.value);
        } catch (e) {
            console.error("Failed to parse session", e);
        }
    }
    
    const initials = session.name ? session.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '??';

    return (
        <Shell userName={session.name || 'Loading...'} userRole={session.role || 'System'} initials={initials}>
             <PageSkeleton />
        </Shell>
    );
}
