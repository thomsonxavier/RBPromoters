// import { NextRequest, NextResponse } from 'next/server';

// // Function to extract session ID from cookies
// function getSessionIdFromCookies(cookies: string): string | null {
//   const cookieArray = cookies.split(';');
//   for (const cookie of cookieArray) {
//     const [name, value] = cookie.trim().split('=');
//     if (name === 'sessionId' && value) {
//       return value;
//     }
//   }
//   return null;
// }

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
  
//   // Check if the request is for admin pages
//   if (pathname.startsWith('/admin')) {
//     // Get session ID from cookies
//     const sessionId = getSessionIdFromCookies(request.headers.get('cookie') || '');
    
//     if (!sessionId) {
//       // No session found, redirect to login with redirect parameter
//       const loginUrl = new URL('/signin', request.url);
//       loginUrl.searchParams.set('redirect', encodeURIComponent(request.url));
//       return NextResponse.redirect(loginUrl);
//     }
    
//     // Session cookie exists, allow access
//     // Client-side will handle the actual Appwrite authentication check
//     return NextResponse.next();
//   }
  
//   // For non-admin routes, allow access
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public folder
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
//   ],
// };



import { NextRequest, NextResponse } from "next/server";

 export default function middleware(request: NextRequest) {

  return NextResponse.next();
 }