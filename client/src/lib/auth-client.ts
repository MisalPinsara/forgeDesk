import { createAuthClient } from 'better-auth/react';

/**
 * In development the Vite proxy keeps authentication cookies on the client
 * origin. In production, set VITE_AUTH_BASE_URL when the API has a separate
 * public origin.
 */
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL || window.location.origin,
  fetchOptions: { credentials: 'include' },
});
