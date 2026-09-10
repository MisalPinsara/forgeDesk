# WJDMS server

Next.js API service for the Workshop Job & Document Management System. It uses MongoDB Atlas for records and Cloudflare R2 for uploaded Word templates and supporting job files.

## Configure

1. Copy `.env.example` to `.env`.
2. Fill in the MongoDB Atlas connection string, a 32+ character `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and the R2 values.
3. Run `npm run dev` from this directory. The API runs at `http://localhost:3000`.
4. Copy `client/.env.example` to `client/.env`. The default Vite proxy sends `/api/*` to this server.

Better Auth creates and manages the `user`, `account`, `session`, and verification collections in MongoDB automatically. The client only exposes sign-in because the SRS does not require self-service registration. To provision the first account, temporarily set `ALLOW_PUBLIC_SIGN_UP="true"`, call `POST /api/auth/sign-up/email`, then change it back to `false` and restart the API.

Never commit `.env` files or storage/database credentials.

## API surface

All business routes except `GET /api/health` require the secure Better Auth session cookie. The client forwards that cookie through the development proxy.

| Area | Routes |
| --- | --- |
| Authentication | Better Auth endpoints under `/api/auth/*` (including sign-in, sign-out, session, and password management) |
| Dashboard and profile | `GET /api/dashboard`, `GET /api/profile` |
| Companies | `GET/POST /api/companies`, `GET/PATCH/DELETE /api/companies/:id`, `GET /api/companies/:id/contacts` |
| Contacts | `GET/POST /api/contacts`, `PATCH/DELETE /api/contacts/:id` |
| Jobs | `GET/POST /api/jobs`, `GET/PATCH/DELETE /api/jobs/:id`, `GET /api/jobs/:id/audit`, `GET /api/jobs/:id/documents` |
| Templates | `GET/POST /api/templates`, `DELETE /api/templates/:id` |
| File storage | `POST /api/uploads` with multipart `file` and `kind` fields |

Template uploads are validated server-side as `.docx` files. File records store only the R2 key/public URL in MongoDB; file bytes are held in R2.
