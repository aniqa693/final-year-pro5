// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('user-role')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/', 
    '/auth', 
    '/api/signin', 
    '/api/signup', 
    '/api/check-email',
    '/api/signout',
    '/favicon.ico',
    '/api/user/switch-role' // Allow role switch API
  ];
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If no role cookie and trying to access protected route, redirect to auth
  if (!userRole) {
    console.log('No user role found, redirecting to auth');
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Dashboard route protection
  if (pathname.startsWith('/dashboard/')) {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    if (pathSegments.length >= 2) {
      const requestedRole = pathSegments[1];
      
      // Check if requested role exists in configuration
      const validRoles = ['admin', 'creator', 'analyst', 'manager', 'client'];
      if (!validRoles.includes(requestedRole)) {
        console.log(`Invalid role requested: ${requestedRole}`);
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
      }
      
      // Allow admin to access any dashboard when switching roles
      // But ONLY if they're coming from a role switch
      if (userRole === 'admin') {
        // Check if this is a role switch by looking at referer or allowing it
        const isRoleSwitch = request.headers.get('referer')?.includes('/dashboard/admin') || 
                            pathname === `/dashboard/${requestedRole}`;
        
        if (isRoleSwitch) {
          console.log(`Admin switching to ${requestedRole} dashboard`);
          return NextResponse.next();
        }
      }
      
      // STRICT CHECK: For all users, they can ONLY access their own role's dashboard
      // This prevents creator from accessing analyst dashboard even through URL
      if (requestedRole !== userRole) {
        console.log(`Access denied: ${userRole} user trying to access ${requestedRole} dashboard`);
        
        const redirectUrl = new URL(`/dashboard/${userRole}`, request.url);
        redirectUrl.searchParams.set('error', 'unauthorized');
        redirectUrl.searchParams.set('attemptedRole', requestedRole);
        
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/api/:path*',
    '/'
  ],
};       