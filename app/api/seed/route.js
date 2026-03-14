import { db } from '@/db';
import { users, events } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
    console.log('Seeding database from API...');

    try {
        // 1. Insert DBA User
        await db.insert(users).values({
            fullName: 'Aarohan Admin',
            email: 'admin@aarohan.com',
            password: 'adminpassword123',
            role: 'dba',
        }).onConflictDoNothing();

        // 2. Insert some Sample Events
        await db.insert(events).values([
            { title: 'Hackathon 2026', description: '24-hour coding challenge', schedule: new Date('2026-04-15T10:00:00Z') },
            { title: 'Robo Wars', description: 'Robot combat competition', schedule: new Date('2026-04-16T14:00:00Z') },
            { title: 'Guest Lecture: ML in Healthcare', description: 'Tech talk by industry experts', schedule: new Date('2026-04-17T11:00:00Z') },
        ]).onConflictDoNothing();

        return NextResponse.json({ message: 'Database seeded successfully with DBA user (admin@aarohan.com / adminpassword123) and sample events.' });
    } catch (error) {
        console.error('Error seeding DB:', error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
