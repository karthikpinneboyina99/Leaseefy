import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Use same key as backend
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'super-secret-key-leaseefy-demo'
);

// Paths that require authentication
const protectedPaths = ['/mnda', '/dashboard'];
const authPaths = ['/signin', '/signup'];

export async function proxy(request) {
  const path = request.nextUrl.pathname;
  
  // Check if it's a protected path
  const isProtected = protectedPaths.some((p) => path.startsWith(p));
  const isAuth = authPaths.some((p) => path.startsWith(p));
  
  const token = request.cookies.get('access_token')?.value;

  // Try to verify token if exists
  let isValid = false;
  if (token) {
    try {
      await jwtVerify(token, SECRET_KEY);
      isValid = true;
    } catch (error) {
      isValid = false;
    }
  }

  // Redirect logic
  if (isProtected && !isValid) {
    // Save intended url to redirect back after login? Optional, but nice.
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (isAuth && isValid) {
    // Already logged in, don't show signup/signin
    return NextResponse.redirect(new URL('/mnda', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mnda/:path*', '/dashboard/:path*', '/signin', '/signup'],
};
