import { z } from 'zod';

const environmentSchema = z.object({
  MONGODB_URI: z.string().min(1),
  MONGODB_DB_NAME: z.string().min(1).default('wjdms'),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  ALLOW_PUBLIC_SIGN_UP: z.enum(['true', 'false']).default('false'),
});

const r2Schema = z.object({
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
  R2_PUBLIC_BASE_URL: z.string().url().optional(),
});

export type Environment = z.infer<typeof environmentSchema>;
export type R2Environment = z.infer<typeof r2Schema>;

export function env(): Environment {
  const parsed = environmentSchema.safeParse(process.env);
  if (!parsed.success) throw new Error(`Invalid server environment: ${parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')}`);
  return parsed.data;
}

export function r2Env(): R2Environment {
  const parsed = r2Schema.safeParse(process.env);
  if (!parsed.success) throw new Error(`Invalid R2 environment: ${parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')}`);
  return parsed.data;
}
