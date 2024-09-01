import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // Extract the JWT token from the request cookies
  const token = req.cookies.get('custom-auth-token')?.value;

  // If the token is not present, redirect the user to the login page
  if (!token) {
    console.log('Redirecting to login'); // Log the redirect action
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If the token is present, verify the user's role by fetching their profile
  try {
    // Make an HTTP request to the backend to fetch the user's profile using the token
    const profileResponse = await axios.get(
      'http://localhost:3000/auth/profile',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // Determine if the user is trying to access an HR-restricted route
    const isHrRoute = req.nextUrl.pathname.startsWith('/dashboard/user/new');

    // If the route is HR-restricted and the user's role is not 'HR', redirect them
    if (isHrRoute && profileResponse.data.role !== 'HR') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } catch (error) {
    // Log any errors that occur while fetching the profile
    console.error('Failed to fetch profile data:', error);

    // Redirect the user to the login page if there's an error
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If everything is valid, allow the request to proceed to the next middleware or route handler
  return NextResponse.next();
}

// Configuration for the middleware, specifying which routes it should apply to
export const config = {
  matcher: ['/dashboard/:path*'] // Apply middleware to any routes starting with /dashboard
};
