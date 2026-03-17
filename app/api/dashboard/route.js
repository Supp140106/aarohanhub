import { NextResponse } from 'next/server';
import { db } from '@/db';
import { events, registrations, users } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');

        if (!sessionCookie) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const session = JSON.parse(sessionCookie.value);

        const allEvents = await db.select().from(events);
        const totalEvents = allEvents.length;

        // Count user's own registrations
        const userRegs = await db.select().from(registrations).where(eq(registrations.userId, session.userId));
        const registeredEvents = userRegs.length;

        // Count all participants (unique users)
        const participantCount = await db.select({ count: count() }).from(users);
        const participants = Number(participantCount[0]?.count || 0);

        // Recent events (first 5)
        const recent = allEvents.slice(0, 5).map(e => ({
            id: e.id,
            name: e.title,
            date: e.schedule ? new Date(e.schedule).toISOString().split('T')[0] : 'TBA',
            status: userRegs.find(r => r.eventId === e.id) ? 'registered' : 'open',
        }));

        return NextResponse.json({
            success: true,
            stats: {
                totalEvents,
                registeredEvents,
                participants,
                upcomingEvents: totalEvents,
            },
            recentEvents: recent,
        });
    } catch (error) {
        console.error('Dashboard API error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
