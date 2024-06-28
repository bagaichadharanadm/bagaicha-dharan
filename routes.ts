/**
 * An arrray of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = ['/'];

/**
 * An array of routes that are used for authentication
 * @type {string[]}
 */
export const authRoutes: string[] = ['/auth/login', '/auth/register'];

/**
 * The prefix for API authentication routes in auth js
 * Routes that start with this prefix are used for API authentication purposes
 *
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth';

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/dashboard';

/**
 * The default redirect path when user tries to access a protected resource
 * @type {string}
 */
export const LOGIN_PAGE_URL: string = '/auth/login';
