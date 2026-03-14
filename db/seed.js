import { db } from './index.js';
import { users, events } from './schema.js';

async function main() {
    console.log('Seeding database...');

    try {
        // 1. Insert DBA User
        await db.insert(users).values({
            fullName: 'Aarohan Admin',
            email: 'admin@aarohan.com',
            password: 'adminpassword123',
            role: 'dba',
        }).onConflictDoNothing();
        console.log('Inserted DBA user: admin@aarohan.com (password: adminpassword123)');

        // 2. Insert some Sample Events
        await db.insert(events).values([
            { title: 'Hackathon 2026', description: '24-hour coding challenge', schedule: new Date('2026-04-15T10:00:00Z') },
            { title: 'Robo Wars', description: 'Robot combat competition', schedule: new Date('2026-04-16T14:00:00Z') },
            { title: 'Guest Lecture: ML in Healthcare', description: 'Tech talk by industry experts', schedule: new Date('2026-04-17T11:00:00Z') },
        ]).onConflictDoNothing();
        console.log('Inserted sample events');

    } catch (error) {
        console.error('Error seeding DB:', error);
    } finally {
        process.exit(0);
    }
}

main();
