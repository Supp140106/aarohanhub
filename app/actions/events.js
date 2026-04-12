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
    try {
        const query = db
            .select({
                id: events.id,
                title: events.title,
                description: events.description,
                schedule: events.schedule,
                isRegistered: registrations.id,
                winnerId: events.winnerId,
                winnerName: users.fullName,
                winnerEmail: users.email,
            })
            .from(events)
            .leftJoin(users, eq(events.winnerId, users.id));

        if (userId) {
            query.leftJoin(
                registrations,
                and(eq(registrations.eventId, events.id), eq(registrations.userId, userId))
            );
        } else {
            query.leftJoin(registrations, eq(registrations.id, -1)); // Dummy join to keep select schema consistent
        }

        const results = await query;

        return results.map(r => ({
            id: r.id,
            title: r.title,
            description: r.description,
            schedule: r.schedule,
            isRegistered: !!r.isRegistered,
            winner: r.winnerId ? {
                id: r.winnerId,
                name: r.winnerName,
                email: r.winnerEmail
            } : null
        }));
    } catch (e) {
        // Fallback: winnerId or join might fail if schema is upgrading
        try {
            const fallbackQuery = db
                .select({
                    id: events.id,
                    title: events.title,
                    description: events.description,
                    schedule: events.schedule,
                    isRegistered: registrations.id,
                })
                .from(events);

            if (userId) {
                fallbackQuery.leftJoin(
                    registrations,
                    and(eq(registrations.eventId, events.id), eq(registrations.userId, userId))
                );
            } else {
                fallbackQuery.leftJoin(registrations, eq(registrations.id, -1));
            }

            const results = await fallbackQuery;

            return results.map(r => ({
                id: r.id,
                title: r.title,
                description: r.description,
                schedule: r.schedule,
                isRegistered: !!r.isRegistered,
                winner: null
            }));
        } catch {
            return [];
        }
    }
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

    const id = Number(formData.get('id'));
    
    if (!id) return { error: 'Invalid Event ID' };

    try {
        // Step 1: Delete all registrations associated with this event to avoid Postgres Foreign Key Constraint Violation
        await db.delete(registrations).where(eq(registrations.eventId, id));
        
        // Step 2: Delete the actual event
        await db.delete(events).where(eq(events.id, id));
        
        revalidatePath('/events');
        return { success: true };
    } catch (e) {
        console.error("Event Deletion Error:", e);
        return { error: 'Failed to delete event. Please check server logs.' };
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
        // Fetch event status
        const eventDataList = await db.select().from(events).where(eq(events.id, Number(eventId)));
        if (eventDataList.length === 0) return { error: 'Event not found' };
        
        const eventData = eventDataList[0];
        
        // CHECK 1: If winner is already declared
        if (eventData.winnerId) {
            return { error: 'Registration is closed because a winner has already been declared.' };
        }
        
        // CHECK 2: If event time has already passed
        if (eventData.schedule && new Date() > new Date(eventData.schedule)) {
            return { error: 'Registration is closed because the event has already started or finished.' };
        }

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
            userId: registrations.userId,
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

export async function setEventWinner(formData) {
    if (!(await verifyAdmin())) return { error: "Unauthorized" };

    const eventId = formData.get('eventId');
    const winnerId = formData.get('winnerId');

    if (!eventId || !winnerId) {
        return { error: 'Event ID and Winner ID are required' };
    }

    try {
        await db.update(events).set({ winnerId: Number(winnerId) }).where(eq(events.id, Number(eventId)));
        revalidatePath('/events');
        return { success: true };
    } catch (e) {
        return { error: 'Failed to set event winner' };
    }
}

export async function checkIfWinner(userId) {
    if (!userId) return false;

    try {
        const winningEvents = await db.select({ id: events.id }).from(events).where(eq(events.winnerId, userId));
        return winningEvents.length > 0;
    } catch {
        // Column may not exist in the live database yet — fail gracefully
        return false;
    }
}
