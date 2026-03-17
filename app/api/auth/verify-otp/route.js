import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, verificationTokens } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { email, otp, name, password, role } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({ success: false, message: 'Email and OTP are required' }, { status: 400 });
        }

        const records = await db
            .select()
            .from(verificationTokens)
            .where(and(eq(verificationTokens.email, email), eq(verificationTokens.token, otp)));

        if (records.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }

        const record = records[0];
        if (new Date() > record.expiresAt) {
            return NextResponse.json({ success: false, message: 'OTP has expired' }, { status: 400 });
        }

        // Check if user already exists (edge case: double verification)
        const existing = await db.select().from(users).where(eq(users.email, email));
        if (existing.length > 0) {
            // User already created, allow login
            await db.delete(verificationTokens).where(eq(verificationTokens.email, email));
            return NextResponse.json({ success: true, message: 'Already registered. Please login.' });
        }

        // Create the user
        if (!name || !password || !role) {
            return NextResponse.json({ success: false, message: 'Registration data missing. Please restart registration.' }, { status: 400 });
        }

        const insertedUsers = await db.insert(users).values({
            fullName: name,
            email,
            password,
            role,
        }).returning();

        // Clean up token
        await db.delete(verificationTokens).where(eq(verificationTokens.email, email));

        return NextResponse.json({ success: true, message: 'Registration complete! Please login.' });
    } catch (error) {
        console.error('OTP verify error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
