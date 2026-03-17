import { NextResponse } from 'next/server';
import { db } from '@/db';
import { events, registrations, users } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');
        const session = sessionCookie ? JSON.parse(sessionCookie.value) : null;
        const userId = session?.userId || null;

        let eventsList;

        if (userId) {
            const results = await db
                .select({
                    id: events.id,
                    title: events.title,
                    description: events.description,
                    schedule: events.schedule,
                    isRegistered: registrations.id,
                    winnerId: events.winnerId,
                    winnerName: users.fullName,
                })
                .from(events)
                .leftJoin(users, eq(events.winnerId, users.id))
                .leftJoin(registrations, and(eq(registrations.eventId, events.id), eq(registrations.userId, userId)));

            eventsList = results.map(r => ({
                id: r.id,
                name: r.title,
                description: r.description,
                date: r.schedule ? new Date(r.schedule).toISOString().split('T')[0] : 'TBA',
                time: r.schedule ? new Date(r.schedule).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) : 'TBA',
                venue: 'NIT Durgapur',
                isRegistered: !!r.isRegistered,
                category: 'general',
                participants: 0,
                maxParticipants: 500,
                prize: '₹TBA',
            }));
        } else {
            const results = await db.select().from(events);
            eventsList = results.map(r => ({
                id: r.id,
                name: r.title,
                description: r.description,
                date: r.schedule ? new Date(r.schedule).toISOString().split('T')[0] : 'TBA',
                time: r.schedule ? new Date(r.schedule).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) : 'TBA',
                venue: 'NIT Durgapur',
                isRegistered: false,
                category: 'general',
                participants: 0,
                maxParticipants: 500,
                prize: '₹TBA',
            }));
        }

        return NextResponse.json({ success: true, events: eventsList });
    } catch (error) {
        console.error('Events API error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch events' }, { status: 500 });
    }
}
