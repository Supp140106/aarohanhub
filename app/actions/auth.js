'use server';

import { db } from '@/db';
import { users, verificationTokens } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { transporter } from '@/db/mailer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function registerUser(formData) {
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const role = formData.get('role'); // "student" or "external" or "volunteer"
    const password = formData.get('password');

    if (!fullName || !email || !role || !password) {
        return { error: 'All fields are required.' };
    }

    // Check if user already exists
    const existingUsers = await db.select().from(users).where(eq(users.email, email));
    if (existingUsers.length > 0) {
        return { error: 'An account with this email already exists.' };
    }

    // Generate 6-digit OTP
    const token = generateOTP();
    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save token to database
    await db.insert(verificationTokens).values({
        email,
        token,
        expiresAt,
    });

    // Send via Nodemailer
    try {
        await transporter.sendMail({
            from: 'suppritdas@gmail.com',
            to: email,
            subject: 'Verify your Registration - Aarohan',
            text: `Your OTP to complete registration is: ${token}. It is valid for 10 minutes.`,
            html: `<h3>Aarohan Registration OTP</h3><p>Your one-time password to complete registration is: <strong>${token}</strong>. It is valid for 10 minutes.</p>`
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return { error: 'Failed to send OTP' };
    }

    return { success: true };
}

// Removed sendOTP and verifyOTP as login is now Password-only and Registration handles its own OTP.

export async function verifyRegistrationOTP(formData) {
    const email = formData.get('email');
    const token = formData.get('token');
    const fullName = formData.get('fullName');
    const role = formData.get('role');
    const password = formData.get('password');

    if (!email || !token || !fullName || !role || !password) {
        return { error: 'All fields are required for verification' };
    }

    // Find the token
    const records = await db
        .select()
        .from(verificationTokens)
        .where(and(eq(verificationTokens.email, email), eq(verificationTokens.token, token)))
        .orderBy(verificationTokens.expiresAt, 'desc');

    if (records.length === 0) {
        return { error: 'Invalid OTP' };
    }

    const record = records[0];

    if (new Date() > record.expiresAt) {
        return { error: 'OTP has expired' };
    }

    // Insert user into database
    let insertedUsers;
    try {
        insertedUsers = await db.insert(users).values({
            fullName,
            email,
            password,
            role,
        }).returning();
    } catch (e) {
        return { error: 'Failed to create user account' };
    }

    const user = insertedUsers[0];

    // Set HTTP-only cookie
    const sessionData = { userId: user.id, email: user.email, role: user.role , name : user.fullName };
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Clean up used token
    await db.delete(verificationTokens).where(eq(verificationTokens.email, email));

    // Determine redirection
    if (user.role === 'dba') {
        redirect('/dashboard');
    } else if (user.role === 'organizer') {
        redirect('/dashboard/organizer');
    } else {
        redirect('/dashboard');
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/login');
}

export async function loginWithPassword(formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    // Find user by email and password
    const existingUsers = await db.select().from(users).where(
        and(eq(users.email, email), eq(users.password, password))
    );

    if (existingUsers.length === 0) {
        return { error: 'Invalid email or password' };
    }

    const user = existingUsers[0];

    // Set HTTP-only cookie
    const sessionData = { userId: user.id, email: user.email, role: user.role ,name : user.fullName};
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Determine redirection
    if (user.role === 'dba') {
        redirect('/dashboard');
    } else if (user.role === 'organizer') {
        redirect('/dashboard/organizer');
    } else {
        redirect('/dashboard');
    }
}

export async function getSessionData() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (sessionCookie) {
        try {
            return JSON.parse(sessionCookie.value);
        } catch (e) {
            return null;
        }
    }
    return null;
}
