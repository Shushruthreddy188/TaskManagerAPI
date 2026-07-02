# Task Manager API

A full-stack task management application built with a TypeScript-first stack. The project includes an Express REST API with JWT authentication, PostgreSQL persistence through Sequelize, and a React frontend that allows users to register, log in, and manage their own tasks securely.

Each task is scoped to the authenticated user, ensuring users can only create, view, update, and delete their own tasks.

---

## ✨ Features

### Authentication

- User Registration
- User Login
- JWT-based Authentication
- Secure Password Hashing with bcrypt
- Protected API Routes
- Persistent User Sessions

### Task Management

- Create Tasks
- View All Tasks
- View Individual Tasks
- Update Tasks
- Delete Tasks
- Per-user Task Ownership

### Validation & Security

- Request validation with Zod
- Password hashing using bcrypt
- JWT Authorization Middleware
- Ownership verification for all task operations
- Centralized error handling

### Frontend

- Login & Registration pages
- Protected Dashboard
- Task CRUD Interface
- Automatic JWT attachment using Axios Interceptors
- Session persistence using localStorage

### Backend

- RESTful API
- PostgreSQL Database
- Sequelize ORM
- Docker Support
- Integration Tests with Jest & Supertest

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express 5
- TypeScript
- PostgreSQL
- Sequelize ORM
- JWT
- bcrypt
- Zod
- Jest
- supertest
- Docker
- Docker Compose

## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Context API

---

# 🏗 Architecture

```text
                User
                  │
                  ▼
      React + TypeScript Frontend
                  │
          Axios HTTP Requests
                  │
                  ▼
      Express + TypeScript REST API
                  │
        JWT Authentication Middleware
                  │
       Controllers + Business Logic
                  │
           Sequelize ORM Models
                  │
                  ▼
             PostgreSQL Database
```

The frontend communicates exclusively with the Express REST API. All authentication, validation, authorization, and database operations are handled by the backend.

---

# 📂 Project Structure

```text
TaskManagerAPI
│
├── src
│   ├── config
│   │   └── database.ts
│   │
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   └── task.controller.ts
│   │
│   ├── middleware
│   │   ├── auth.middleware.ts
│   │   ├── validate.ts
│   │   └── error.middleware.ts
│   │
│   ├── models
│   │   ├── User.ts
│   │   └── Task.ts
│   │
│   ├── routes
│   │   ├── auth.routes.ts
│   │   └── task.routes.ts
│   │
│   ├── validation
│   │   └── schemas.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   └── pages
│   │
│   └── vite.config.ts
│
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

# 🔐 Authentication Endpoints

Base URL

```
/api/auth
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /register | Register a new user |
| POST | /login | Login user and receive JWT |

### Register

```http
POST /api/auth/register
```

Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response

```json
{
  "id": 1,
  "email": "user@example.com",
  "token": "<jwt-token>"
}
```

---

### Login

```http
POST /api/auth/login
```

Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

# ✅ Task Endpoints

Base URL

```
/api/tasks
```

All routes require

```
Authorization: Bearer <JWT_TOKEN>
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | / | Create Task |
| GET | / | Get All Tasks |
| GET | /:id | Get Single Task |
| PUT | /:id | Update Task |
| DELETE | /:id | Delete Task |

Example Request

```json
{
  "title": "Practice TypeScript",
  "description": "Understand Express Backend",
  "status": "pending"
}
```

Supported Status Values

```
pending
in-progress
completed
```

---

# 🚀 Running Locally

## Prerequisites

- Node.js 20+
- PostgreSQL
- npm
- Docker (optional)

### Clone Repository

```bash
git clone https://github.com/Shushruthreddy188/TaskManagerAPI.git

cd TaskManagerAPI
```

---

### Create Environment File

Create `.env`

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=super_secret_change_me
JWT_EXPIRES_IN=1d
```

---

### Start PostgreSQL using Docker

```bash
docker run \
--name tm-postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=task_manager_db \
-p 5432:5432 \
-d postgres
```

---

### Install Dependencies

```bash
npm install
```

---

### Run Backend

```bash
npm run dev
```

Backend

```
http://localhost:3000
```

---

# 💻 Running Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend

```
http://localhost:5173
```

By default it connects to

```
http://localhost:3000/api
```

Override using

```
frontend/.env
```

```env
VITE_API_URL=http://localhost:3000/api
```

---

# 🐳 Running with Docker Compose

```bash
docker compose up --build
```

Backend

```
http://localhost:3000
```

The application runs alongside its own PostgreSQL container with persistent storage.

---

# 🧪 Running Tests

```bash
npm test
```

The project uses

- Jest
- supertest

to perform integration testing against a PostgreSQL database.

---

# 🎯 What This Project Demonstrates

This project showcases experience with:

- Full-stack application development
- REST API design
- Express & TypeScript
- React + TypeScript
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Secure password hashing
- Authorization middleware
- Request validation
- Database relationships
- Docker containerization
- Integration testing
- Client-server communication using Axios

---

# 🔮 Future Improvements

- Task Priority
- Due Dates
- Search
- Pagination
- Sorting
- Task Categories
- Refresh Tokens
- CI/CD using GitHub Actions
- Cloud Deployment (AWS / Render / Railway)
- Email Verification
- Password Reset
- Dark Mode
- Responsive UI Improvements

---

## 👨‍💻 Author

**Shushruth Kumar Reddy Mandadi**

GitHub: https://github.com/Shushruthreddy188
