import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
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
        const userRows = await db.select().from(users).where(eq(users.id, session.userId));

        if (userRows.length === 0) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const user = userRows[0];
        return NextResponse.json({
            success: true,
            profile: {
                name: user.fullName,
                email: user.email,
                phone: user.phone || '',
                college: user.college || '',
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Profile GET error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');

        if (!sessionCookie) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const session = JSON.parse(sessionCookie.value);
        const { name, phone, college } = await request.json();

        const updateData = {};
        if (name) updateData.fullName = name;
        if (phone !== undefined) updateData.phone = phone;
        if (college !== undefined) updateData.college = college;

        if (Object.keys(updateData).length > 0) {
            await db.update(users).set(updateData).where(eq(users.id, session.userId));
        }

        return NextResponse.json({ success: true, message: 'Profile updated' });
    } catch (error) {
        console.error('Profile PUT error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
