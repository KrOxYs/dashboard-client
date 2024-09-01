import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('custom-auth-token');

  console.log('Middleware token:', token); // Log token

  if (!token) {
    console.log('Redirecting to login'); // Log redirect
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
