# Project Management System

A web application for teams to manage projects and tasks. Users can sign up with an email/password or via OAuth (Google/GitHub), create workspaces, form teams, run projects with task assignments, and search across their work.

<img width="1351" height="900" alt="Screenshot 2026-08-18 193038" src="https://github.com/user-attachments/assets/7b5792ee-5f86-4f15-805e-fe5c5731b3b2" />

## Key Features

- **Authentication** — Email/password registration, login, logout, and an auth-check endpoint using HTTP-only cookies. Optional OAuth login with Google and GitHub (Passport).
- **Workspaces** — A default workspace is created automatically when a user registers and the user is linked to it.
- **Projects, Tasks & Teams** — Projects contain tasks with status, priority, tags, due dates, and task assignments. Tasks support comments and attachments. Teams group users and link to projects.
- **Invites & Membership** — Invite flows for teammates and project members.
- **Search** — Unified search across tasks, projects, and users.
- **Protected UI** — A guard component restricts dashboard routes to authenticated users.
- **State & UI** — Redux Toolkit + RTK Query for data fetching with redux-persist; Tailwind CSS + Material UI dashboard.

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | Next.js 16 (App Router), React 18, TypeScript, Tailwind CSS, Material UI, Redux Toolkit + RTK Query, redux-persist |
| Backend    | Node.js, Express 5, TypeScript, Prisma 6, PostgreSQL, Passport.js (Google/GitHub OAuth), bcrypt, jsonwebtoken |
| Database   | PostgreSQL (managed via Prisma ORM) |
| Auth       | JWT in an HTTP-only cookie (`token`) + bcrypt |

## Architecture & Project Structure

The client is a single-page Next.js app and the server is a REST API that talks to PostgreSQL through Prisma. The client calls the API with credentials (`include`) so the HTTP-only auth cookie is sent automatically.

```
Project Management/
├── client/                          # Next.js frontend
│   ├── app/                         # Routes: auth/(login, register), dashboard/*, (dashboard)
│   ├── components/                  # ProtectedRoute.tsx
│   ├── context/AuthContext.tsx      # Cookie-based auth + /auth/me
│   ├── lib/api.ts                   # axios instance (NEXT_PUBLIC_API_BASE_URL, credentials)
│   ├── state/api.ts                 # RTK-Query client (base URL is the backend origin)
│   └── ...
└── server/                          # Express + Prisma backend (port 8000)
    ├── src/
    │   ├── index.ts                 # Express app; mounts /auth, /projects, /tasks, /search, /users, /teams
    │   ├── controllers/             # auth, project, task, team, user, invite, search controllers
    │   ├── routes/                  # Express routers
    │   ├── middleware/authMiddleware.ts
    │   ├── utils/{cookies,jwt}.ts
    │   └── config/passport.ts       # Google & GitHub OAuth strategies
    ├── prisma/
    │   ├── schema.prisma            # User, Workspace, Team, Project, Task, Invite, etc.
    │   └── migrations/              # 14 migrations (full schema)
    └── package.json
```

## Prerequisites

- Node.js (v18+)
- npm
- PostgreSQL

## Setup & Installation

### 1. Clone and install dependencies

```bash
git clone <repo-url> Project-Management
cd Project-Management
# Server
cd server && npm install
cd ..
# Client
cd client && npm install && cd ..
```

### 2. Configure environment variables

**Server** — copy `.env.example` to `.env`:

```bash
cd server
cp .env.example .env
```

`.env.example` defines the following variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign JWT auth tokens |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth credentials |
| `PORT` | Backend port (default `8000`) |
| `FRONTEND_URL` | Frontend origin (used for CORS/redirects) |
| `BASE_URL` | Backend origin (used for OAuth callback URLs) |
| `EMAIL_USER` / `EMAIL_PASS` | Email credentials (if used) |
| `NODE_ENV` | `development` / `production` |

**Client** — create `client/.env.local`:

```bash
# Local development (point to your running backend):
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

> The client reads `NEXT_PUBLIC_API_BASE_URL` to call the backend (`/auth/register`, `/auth/login`, etc.). For local development set it to `http://localhost:8000`.

### 3. Prepare the database

```bash
cd server
npx prisma generate     # generate the Prisma client
npx prisma db push      # create/migrate the schema to your database
# or, alternatively:
# npx prisma migrate dev --name init
```

### 4. Run the application

**Backend** (terminal 1):

```bash
cd server
npm run dev
# → http://localhost:8000
```

**Frontend** (terminal 2):

```bash
cd client
npm run dev
# → http://localhost:3000
```

Then open `http://localhost:3000/auth/register` to create your first account.

### 5. (Optional) Seed the database

```bash
cd server
npm run seed      # or: ts-node prisma/seed.ts
```

## Screenshots / Demo

<!-- Add screenshot: Register page -->

<!-- Add screenshot: Login page -->

<!-- Add screenshot: Dashboard -->

<!-- Add screenshot: Project / Task view -->

## Future Improvements

- **Unify the API client** — the auth pages use raw `fetch` while `AuthContext` uses the `axios` instance in `lib/api.ts`. Consolidate around a single client and read the base URL from `NEXT_PUBLIC_API_BASE_URL` everywhere (the RTK-Query `baseUrl` in `state/api.ts` is currently hardcoded to a deployed origin).
- **CI/CD & tests** — add a pipeline (`prisma generate` + `tsc` + lint) and test coverage for the auth controllers.

## Notes

- All auth state is stored in an HTTP-only cookie, so credentials must be sent (`include`) on every cross-origin request.
- OAuth callback URLs are built from `BASE_URL`, so set `BASE_URL` to your deployed backend origin (e.g. `https://project-backend-m0qv.onrender.com`) when running behind a real domain.
