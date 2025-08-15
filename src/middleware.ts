// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// // Define protected admin routes
// const protectedRoutes = [
//   '/admin',
//   '/admin/dashboard',
//   '/admin/add-property',
//   '/admin/edit-property'
// ]

// // Define public routes that don't need authentication
// const publicRoutes = [
//   '/',
//   '/signin',
//   '/signup',
//   '/properties',
//   '/blogs',
//   '/contactus',
//   '/documentation'
// ]

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   // Check if the current path is a protected admin route
//   const isProtectedRoute = protectedRoutes.some(route => 
//     pathname.startsWith(route)
//   )

//   // Check if the current path is a public route
//   const isPublicRoute = publicRoutes.some(route => 
//     pathname.startsWith(route)
//   )

//   // Get the session token from cookies - this will be set during login
//   const sessionToken = request.cookies.get('sessionId')?.value

//   console.log('Middleware - Pathname:', pathname);
//   console.log('Middleware - Session token:', sessionToken);
//   console.log('Middleware - Is protected route:', isProtectedRoute);

//   // If it's a protected route and no session token exists, redirect to signin
//   if (isProtectedRoute && !sessionToken) {
//     console.log('Middleware - Redirecting to signin due to no session token');
//     const signinUrl = new URL('/signin', request.url)
//     signinUrl.searchParams.set('redirect', pathname)
//     return NextResponse.redirect(signinUrl)
//   }

//   // If user is authenticated and trying to access signin/signup, redirect to dashboard
//   if (sessionToken && (pathname === '/signin' || pathname === '/signup')) {
//     console.log('Middleware - Redirecting authenticated user to dashboard');
//     return NextResponse.redirect(new URL('/admin/dashboard', request.url))
//   }

//   // Continue with the request for all other cases
//   return NextResponse.next()
// }

// // Configure which routes to run middleware on
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
// }
