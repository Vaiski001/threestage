import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define protected routes patterns
const PROTECTED_ROUTES = [
  '/app/dashboard',
  '/app/customer/',
  '/app/company/',
];

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/auth/callback',
  '/forms',
  '/documentation',
  '/features',
  '/pricing',
  '/about',
  '/contact',
  '/api/',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes without authentication
  if (
    PUBLIC_ROUTES.some(route => pathname.startsWith(route)) ||
    pathname.includes('_next') ||
    pathname.includes('favicon.ico') ||
    pathname.includes('.svg') ||
    pathname.includes('.png') ||
    pathname.includes('.jpg')
  ) {
    return NextResponse.next();
  }
  
  // Check if this is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Get the session cookie
    const sessionCookie = request.cookies.get('threestage-auth');
    
    // If no session cookie, redirect to login
    if (!sessionCookie?.value) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
    
    try {
      // Parse the session
      const session = JSON.parse(sessionCookie.value);
      
      // Check if session is valid (not expired)
      if (!session || new Date(session.expires_at * 1000) < new Date()) {
        // Session expired, redirect to login
        const url = new URL('/login', request.url);
        url.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(url);
      }
      
      // Check role-based access
      const userRole = session.user?.user_metadata?.role || 'customer';
      
      // Customer routes
      if (pathname.startsWith('/app/customer/') && userRole !== 'customer') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      // Company routes
      if (pathname.startsWith('/app/company/') && userRole !== 'company') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
    } catch (error) {
      console.error('Auth middleware error:', error);
      const url = new URL('/login', request.url);
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 