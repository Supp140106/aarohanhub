import { NextResponse } from 'next/server';

// Routes that require the user to be logged OUT (auth pages)
const authRoutes = ['/login', '/register'];

// Routes that require the user to be logged IN (protected pages)
const protectedRoutes = ['/dashboard', '/logistics', '/learn'];

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get('session');

    // If user IS signed in and tries to visit login/register → redirect to dashboard
    if (authRoutes.some(route => pathname.startsWith(route)) && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user is NOT signed in and tries to visit protected routes → redirect to login
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/register', '/dashboard/:path*', '/events/:path*', '/logistics/:path*', '/learn/:path*'],
};
