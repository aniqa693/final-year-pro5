import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('user-role')?.value;
  const availableRoles = request.cookies.get('available-roles')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/', 
    '/auth', 
    '/api/signin', 
    '/api/signup', 
    '/api/check-email', 
    '/api/user/switch-role',
    '/api/auth', // Better Auth routes
    '/auth/social-callback', // Social auth callback
    '/api/auth/social-success' // Social auth success handler
  ];
  
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // Redirect to home if no role cookie and trying to access protected route
  if (!userRole) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Role-based route protection for dashboard
  if (pathname.startsWith('/dashboard')) {
    const pathRole = pathname.split('/')[2];
    const userAvailableRoles = availableRoles ? JSON.parse(availableRoles) : [userRole];
    
    // Check if user has access to the requested dashboard
    if (!userAvailableRoles.includes(pathRole)) {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};