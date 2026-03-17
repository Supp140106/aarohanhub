import { NextResponse } from 'next/server';
import { db } from '@/db';
import { logistics, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');

        if (!sessionCookie) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const session = JSON.parse(sessionCookie.value);
        const rows = await db.select().from(logistics).where(eq(logistics.userId, session.userId));

        if (rows.length === 0) {
            return NextResponse.json({
                success: true,
                logistics: { accommodation: null, foodCoupons: [] },
            });
        }

        const l = rows[0];
        return NextResponse.json({
            success: true,
            logistics: {
                accommodation: l.accommodationDetails
                    ? {
                          hostel: l.accommodationDetails,
                          roomNumber: 'TBA',
                          checkIn: '2026-02-13',
                          checkOut: '2026-02-17',
                          status: 'confirmed',
                      }
                    : null,
                foodCoupons: l.foodCouponProvided
                    ? [
                          { id: 1, type: 'Breakfast', date: '2026-02-14', venue: 'Dining Hall 1', status: 'unused' },
                          { id: 2, type: 'Lunch', date: '2026-02-14', venue: 'Dining Hall 2', status: 'unused' },
                          { id: 3, type: 'Dinner', date: '2026-02-14', venue: 'Dining Hall 1', status: 'unused' },
                          { id: 4, type: 'Breakfast', date: '2026-02-15', venue: 'Dining Hall 1', status: 'unused' },
                          { id: 5, type: 'Lunch', date: '2026-02-15', venue: 'Dining Hall 2', status: 'unused' },
                          { id: 6, type: 'Dinner', date: '2026-02-15', venue: 'Dining Hall 1', status: 'unused' },
                      ]
                    : [],
            },
        });
    } catch (error) {
        console.error('Logistics API error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
