# Smart Leads Dashboard

A production-level full-stack MERN application for managing leads with advanced filtering, pagination, JWT authentication, and a responsive modern dashboard UI.

## Features

- **Authentication**: JWT-based, bcrypt hashed passwords, Role-based access (Admin / Sales User)
- **Leads Management**: CRUD operations with fields for name, email, status, source.
- **Advanced Filtering**: Filter by status, source, search by name/email, and sort by latest/oldest.
- **Pagination**: Backend paginated results (10 per page).
- **Modern UI**: React, TailwindCSS, dark mode support, glassmorphism design, loading states.
- **Extra**: Debounced search, CSV export.

## Tech Stack

- **Frontend**: React.js, TypeScript, Vite, TailwindCSS, React Router, Axios, React Hook Form, Lucide React, Date-fns.
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, bcrypt.

## Setup Instructions

### Local Setup

1. **Clone the repository** (if applicable).
2. **Setup Backend**:
   - `cd backend`
   - `npm install`
   - Create `.env` from `.env.example`
   - `npm run dev`
3. **Setup Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

### Docker Setup

Run the entire application (MongoDB, Backend, Frontend) with Docker Compose:

```bash
docker-compose up --build -d
```
The frontend will run on port `80` and backend on `5000`.

## API Documentation

### Authentication
- `POST /api/auth/register`: Register a new user
  - Body: `{ name, email, password, role? }`
- `POST /api/auth/login`: Login user
  - Body: `{ email, password }`
- `GET /api/auth/profile`: Get logged in user profile
  - Headers: `Authorization: Bearer <token>`

### Leads
Requires `Authorization: Bearer <token>`
- `POST /api/leads`: Create a lead
  - Body: `{ name, email, status, source }`
- `GET /api/leads`: Get leads with pagination/filters
  - Query Params: `page`, `limit`, `search`, `status`, `source`, `sort`
- `GET /api/leads/:id`: Get a specific lead
- `PUT /api/leads/:id`: Update a lead
- `DELETE /api/leads/:id`: Delete a lead

## MongoDB Schema Sample

### User Schema
```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$10$hashedpassword...",
  "role": "Admin",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Lead Schema
```json
{
  "_id": "ObjectId",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "status": "New",
  "source": "Website",
  "createdBy": "ObjectId (User)",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```
