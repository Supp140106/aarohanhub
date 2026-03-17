import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { transporter } from '@/db/mailer';

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
    try {
        const { name, email, password, role } = await request.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }

        const existingUsers = await db.select().from(users).where(eq(users.email, email));
        if (existingUsers.length > 0) {
            return NextResponse.json({ success: false, message: 'An account with this email already exists' }, { status: 409 });
        }

        const token = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await db.insert(verificationTokens).values({ email, token, expiresAt });

        try {
            await transporter.sendMail({
                from: 'suppritdas@gmail.com',
                to: email,
                subject: 'Verify your Registration - Aarohan 2026',
                html: `<h2>Aarohan 2026 Registration OTP</h2><p>Your one-time password is: <strong style="font-size:24px;letter-spacing:4px;">${token}</strong></p><p>Valid for 10 minutes.</p>`
            });
        } catch (mailErr) {
            console.error('Mail error:', mailErr);
            return NextResponse.json({ success: false, message: 'Failed to send OTP email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Register API error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
