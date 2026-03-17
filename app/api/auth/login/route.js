import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
        }

        const existingUsers = await db.select().from(users).where(
            and(eq(users.email, email), eq(users.password, password))
        );

        if (existingUsers.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
        }

        const user = existingUsers[0];
        const sessionData = { userId: user.id, email: user.email, role: user.role, name: user.fullName };

        const cookieStore = await cookies();
        cookieStore.set('session', JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json({ success: true, role: user.role, name: user.fullName });
    } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
