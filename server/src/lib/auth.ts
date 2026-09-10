import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { betterAuth } from 'better-auth';
import { NextRequest } from 'next/server';
import { authDatabase, mongoClient } from './db';
import { env } from './env';

export type Session = { userId: string; email: string; name: string };

/** Database-backed authentication and session management for the API. */
export const auth = betterAuth({
  appName: 'WJDMS',
  database: mongodbAdapter(authDatabase(), { client: mongoClient() }),
  emailAndPassword: { enabled: true, minPasswordLength: 12, disableSignUp: env().ALLOW_PUBLIC_SIGN_UP !== 'true' },
  secret: env().BETTER_AUTH_SECRET,
  baseURL: env().BETTER_AUTH_URL,
  trustedOrigins: [env().CLIENT_ORIGIN],
});

export async function requireSession(request: NextRequest): Promise<Session | null> {
  const result = await auth.api.getSession({ headers: request.headers });
  if (!result) return null;
  return { userId: result.user.id, email: result.user.email, name: result.user.name };
}
