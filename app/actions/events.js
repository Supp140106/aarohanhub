'use server';

import { db } from '@/db';
import { events, registrations, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

async function verifyStaff() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) return null;
    const session = JSON.parse(sessionCookie.value);
    if (session.role === 'dba' || session.role === 'volunteer') return session;
    return null;
}

async function verifyAdmin() {
    const session = await verifyStaff();
    return session?.role === 'dba';
}

export async function fetchEvents(userId = null) {
    if (!userId) {
        return await db.select().from(events);
    }

    // Join events with registrations for the specific user
    const results = await db
        .select({
            id: events.id,
            title: events.title,
            description: events.description,
            schedule: events.schedule,
            isRegistered: registrations.id,
        })
        .from(events)
        .leftJoin(
            registrations,
            and(eq(registrations.eventId, events.id), eq(registrations.userId, userId))
        );

    return results.map(r => ({
        ...r,
        isRegistered: !!r.isRegistered
    }));
}

export async function addEvent(formData) {
    if (!(await verifyAdmin())) return { error: "Unauthorized" };

    const title = formData.get('title');
    const description = formData.get('description');
    const schedule = formData.get('schedule');

    if (!title || !schedule) {
        return { error: 'Title and schedule are required' };
    }

    try {
        await db.insert(events).values({
            title,
            description,
            schedule: new Date(schedule)
        });
        revalidatePath('/events');
        return { success: true };
    } catch (e) {
        return { error: 'Failed to add event' };
    }
}

export async function deleteEvent(formData) {
    if (!(await verifyAdmin())) return { error: "Unauthorized" };

    const id = formData.get('id');
    try {
        await db.delete(events).where(eq(events.id, Number(id)));
        revalidatePath('/events');
        return { success: true };
    } catch (e) {
        return { error: 'Failed to delete event' };
    }
}

export async function updateEvent(formData) {
    if (!(await verifyAdmin())) return { error: "Unauthorized" };

    const id = formData.get('id');
    const title = formData.get('title');
    const description = formData.get('description');

    try {
        await db.update(events).set({ title, description }).where(eq(events.id, Number(id)));
        revalidatePath('/events');
        return { success: true };
    } catch (e) {
        return { error: 'Failed to update event' };
    }
}

export async function registerForEvent(formData) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) return { error: "Unauthorized" };

    const session = JSON.parse(sessionCookie.value);

    if (session.role === 'volunteer') {
        return { error: "Volunteers are not allowed to register for events." };
    }

    const eventId = formData.get('eventId');

    if (!eventId) {
        return { error: 'Event ID is required' };
    }

    try {
        // Check if already registered
        const existing = await db.select().from(registrations).where(
            and(eq(registrations.userId, session.userId), eq(registrations.eventId, Number(eventId)))
        );

        if (existing.length > 0) {
            return { error: 'You are already registered for this event!' };
        }

        // Insert registration
        await db.insert(registrations).values({
            userId: session.userId,
            eventId: Number(eventId),
            isVolunteer: session.role === 'volunteer'
        });

        revalidatePath('/events');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to register' };
    }
}

export async function fetchEventRegistrations(eventId) {
    if (!(await verifyStaff())) return [];

    // Join registrations with users
    const results = await db
        .select({
            id: registrations.id,
            fullName: users.fullName,
            email: users.email,
            role: users.role,
            isVolunteer: registrations.isVolunteer,
        })
        .from(registrations)
        .leftJoin(users, eq(registrations.userId, users.id))
        .where(eq(registrations.eventId, Number(eventId)));

    return results;
}
