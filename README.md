# Task Manager API

A full-stack task manager: an Express/TypeScript REST API with JWT auth and per-user task CRUD, plus a React frontend that consumes it. Every task is scoped to the authenticated user.

## Tech stack

**Backend**
- Express 5 + TypeScript
- PostgreSQL via Sequelize
- JWT auth (`jsonwebtoken`) + bcrypt password hashing
- Zod request validation
- Jest + supertest for integration tests
- Docker / docker-compose for containerized runs

**Frontend** (`frontend/`)
- React + TypeScript + Vite
- React Router for login/register/dashboard routes
- axios (JWT attached from `localStorage` via an interceptor)

## Prerequisites

- Node.js 20+
- A running PostgreSQL instance (local install, or Docker)

## Environment variables

Create a `.env` file in the project root:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=super_secret_change_me
JWT_EXPIRES_IN=1d
```

## Running locally

1. Start a PostgreSQL instance matching the `.env` credentials. Quickest option, with Docker:
   ```
   docker run --name tm-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=task_manager_db -p 5432:5432 -d postgres
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the dev server (auto-restarts on change):
   ```
   npm run dev
   ```
   On success you should see `Database connection established.`, `Models synchronized.`, and `Server running on http://localhost:3000`.

## Running the frontend

The frontend is a separate app in `frontend/` and expects the API above to already be running on `http://localhost:3000`.

```
cd frontend
npm install
npm run dev
```

Open the printed URL (`http://localhost:5173` by default). It talks to the API at `http://localhost:3000/api`; override this by setting `VITE_API_URL` in a `frontend/.env` file if needed.

## Running with Docker Compose

Runs the API and its own PostgreSQL container together, with data persisted in a named volume:

```
docker compose up --build
```

The app is reachable at `http://localhost:3000`. This uses its own `db` service on the compose network, independent of any local Postgres you may already have running.

## Running tests

Tests run against a real PostgreSQL database (the same one pointed to by `.env`), using Jest + supertest:

```
npm test
```

Each test file cleans up the rows it creates, so the suite is safe to run repeatedly.

## API reference

All request/response bodies are JSON.

### Auth — `/api/auth`

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/register` | `{ email, password }` | `password` min 8 chars. Returns `{ id, email, token }`. 409 if email taken. |
| POST | `/login` | `{ email, password }` | Returns `{ id, email, token }`. 401 on bad credentials. |

### Tasks — `/api/tasks`

All task routes require `Authorization: Bearer <token>` and only ever operate on the caller's own tasks (other users' tasks 404, they don't leak as 403).

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/` | `{ title, description?, status? }` | `status` one of `pending` / `in-progress` / `completed`, defaults to `pending`. |
| GET | `/` | — | Lists the caller's tasks. |
| GET | `/:id` | — | 404 if not found or not owned by caller. |
| PUT | `/:id` | `{ title?, description?, status? }` | At least one field required. |
| DELETE | `/:id` | — | Returns 204. |

## Project structure

```
src/
  config/database.ts       Sequelize connection
  models/                  User, Task (with the one-to-many association)
  controllers/              Route handlers
  routes/                  Express routers
  middleware/              JWT auth guard, zod validation, centralized error handling
  validation/schemas.ts    Zod schemas for request bodies
  app.ts                   Express app (no listen — used directly by tests)
  server.ts                Connects to the DB, syncs models, then starts listening
tests/                     Jest + supertest integration tests
frontend/
  src/api/client.ts        axios instance, attaches JWT from localStorage
  src/context/AuthContext.tsx  Login/register/logout + session persistence
  src/components/          ProtectedRoute, TaskItem
  src/pages/               LoginPage, RegisterPage, DashboardPage
```
