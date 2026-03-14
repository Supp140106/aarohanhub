'use server';

import { db } from '@/db';
import { users, registrations } from '@/db/schema';
import { eq, ne } from 'drizzle-orm';
import { cookies } from 'next/headers';

async function verifyAdmin() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) return false;
    const session = JSON.parse(sessionCookie.value);
    return session.role === 'dba';
}

export async function fetchAllUsers() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) return [];
    const session = JSON.parse(sessionCookie.value);
    if (session.role !== 'dba' && session.role !== 'volunteer') return [];

    // Fetch all users except maybe the one calling it, or just everyone
    return await db.select().from(users).where(ne(users.role, 'dba'));
}

export async function deleteUser(userId) {
    if (!(await verifyAdmin())) return { error: 'Unauthorized' };

    try {
        // Delete dependent records first (e.g., in the 'registrations' table)
        await db.delete(registrations).where(eq(registrations.userId, userId));  // Correct column name here
        
        // Then delete the user
        await db.delete(users).where(eq(users.id, userId));

        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to delete user' };
    }
}