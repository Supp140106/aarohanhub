import { NextResponse } from 'next/server';
import { db } from '@/db';
import { registrations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(request, { params }) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');

        if (!sessionCookie) {
            return NextResponse.json({ success: false, message: 'Please login to register for events' }, { status: 401 });
        }

        const session = JSON.parse(sessionCookie.value);
        const { eventId } = await params;

        if (session.role === 'volunteer') {
            return NextResponse.json({ success: false, message: 'Volunteers cannot register for events' }, { status: 403 });
        }

        // Check if already registered
        const existing = await db.select().from(registrations).where(
            and(eq(registrations.userId, session.userId), eq(registrations.eventId, Number(eventId)))
        );

        if (existing.length > 0) {
            return NextResponse.json({ success: false, message: 'You are already registered for this event' }, { status: 409 });
        }

        await db.insert(registrations).values({
            userId: session.userId,
            eventId: Number(eventId),
            isVolunteer: false,
        });

        return NextResponse.json({ success: true, message: 'Successfully registered!' });
    } catch (error) {
        console.error('Event registration API error:', error);
        return NextResponse.json({ success: false, message: 'Registration failed' }, { status: 500 });
    }
}
