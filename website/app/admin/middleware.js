import { NextResponse } from 'next/server';

export function middleware(request) {
  // Cookies se token read karna
  const token = request.cookies.get('token')?.value;

  // Agar token nahi hai, toh login page par bhej do
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*'
  ],
};