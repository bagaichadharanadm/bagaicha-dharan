import authConfig from '@/auth.config';
import * as routes from '@/routes';
import NextAuth from 'next-auth';

// Initialize NextAuth with the provided configuration
const { auth } = NextAuth(authConfig);

// Middleware for authentication
export default auth((req) => {
  const { nextUrl, auth } = req;

  // Check if the user is logged in
  const isLoggedIn = !!auth;

  // Check if the current route is an API authentication route
  const isApiAuthRoute = nextUrl.pathname.startsWith(routes.apiAuthPrefix);

  // Check if the current route is an authentication page route
  const isAuthRoute = routes.authRoutes.includes(nextUrl.pathname);

  // Check if the current route is a public route
  const isPublicRoute = routes.publicRoutes.includes(nextUrl.pathname);

  // Do not block access to default Auth JS config route
  if (isApiAuthRoute) {
    return;
  }

  // Do not block access to authentication page routes if the user is not logged in, otherwise redirect
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(routes.DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // Redirect to url if the user is not logged in and trying to access blocked content
  if (!isPublicRoute && !isLoggedIn) {
    return Response.redirect(new URL('/auth/login', nextUrl));
  }

  // Do not block access to public routes. If the user is logged in and accessing the landing page, redirect to the default login redirect URL
  if (isPublicRoute) {
    return;
  }

  // Allow access to other routes
  return;
});

// Configuration settings for the middleware
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
