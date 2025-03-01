import { NextRequest, NextResponse } from 'next/server';

// Define protected routes
const protectedRoutes = ['/']; // Only the home route is protected

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the current route is a protected route
  const isProtectedPath = protectedRoutes.some(route => pathname.startsWith(route));

  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // Debugging: Log the current path and token status
  console.log('Path:', pathname);
  console.log('Token exists:', !!token);

  // If the route is protected and there's no token, redirect to /auth/login
  if (isProtectedPath && !token) {
    console.log('Redirecting unauthenticated user to /auth/login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|auth/login).*)', // Match all routes except these
  ],
};