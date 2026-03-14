'use server';

import { db } from '@/db';
import { logistics, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';

async function verifyVolunteerOrDBA() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) return null;
    const session = JSON.parse(sessionCookie.value);
    if (session.role !== 'dba' && session.role !== 'volunteer') return null;
    return session;
}

export async function getLogistics(userId) {
    try {
        const result = await db.select().from(logistics).where(eq(logistics.userId, userId));
        return { success: true, data: result[0] || null };
    } catch (error) {
        console.error('Error fetching logistics:', error);
        return { success: false, error: 'Failed to fetch logistics information.' };
    }
}

export async function updateLogistics(userId, details) {
    const session = await verifyVolunteerOrDBA();
    if (!session) return { success: false, error: 'Unauthorized' };

    try {
        const existing = await db.select().from(logistics).where(eq(logistics.userId, userId));

        if (existing.length > 0) {
            await db.update(logistics)
                .set({
                    accommodationDetails: details.accommodationDetails,
                    foodCouponProvided: details.foodCouponProvided,
                })
                .where(eq(logistics.userId, userId));
        } else {
            await db.insert(logistics).values({
                userId,
                accommodationDetails: details.accommodationDetails,
                foodCouponProvided: details.foodCouponProvided,
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating logistics:', error);
        return { success: false, error: 'Failed to update logistics information.' };
    }
}
