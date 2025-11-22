# AppDirect India AI Workshop - Event Registration SPA

A production-ready React SPA with Golang backend for event registration and management.

## Features

- **Hero Section** with animated CTAs
- **Sessions & Speakers** grid display
- **Registration Form** with live attendee count
- **Location** with embedded Google Maps
- **Admin Dashboard** with password protection
  - Attendee management
  - Speaker CRUD operations
  - Session CRUD operations
  - Analytics with pie chart

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Recharts
- **Backend**: Go (Gin framework)
- **Database**: Google Cloud Firestore

## Prerequisites

- Node.js 18+ and npm/yarn
- Go 1.21+
- Google Cloud Project with Firestore enabled
- Firebase Service Account JSON file

## Setup

### 1. Clone and Install

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
go mod download
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following:
- `FIRESTORE_PROJECT_ID`: Your GCP project ID
- `FIRESTORE_SUBDOC_ID`: Subcollection identifier
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to service account JSON
- `ADMIN_PASSWORD`: Admin login password
- `CORS_ORIGIN`: Frontend URL (default: http://localhost:5173)

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:8080
```

### 3. Firebase Setup

1. Create a Firebase project in Google Cloud Console
2. Enable Firestore Database
3. Create a service account and download the JSON key
4. Place the JSON file in the project root (or path specified in `GOOGLE_APPLICATION_CREDENTIALS`)

### 4. Run Development Servers

**Backend:**
```bash
cd backend
go run cmd/server/main.go
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Docker

```bash
docker-compose up --build
```

## Project Structure

```
appdirect-ai-workshop-app/
├── frontend/          # React frontend
├── backend/           # Go backend
├── .env.example       # Environment variable template
└── README.md
```

## API Endpoints

- `GET /api/attendees` - List attendees
- `GET /api/attendees/count` - Get count
- `POST /api/attendees` - Register
- `GET /api/speakers` - List speakers
- `POST /api/speakers` - Create speaker (admin)
- `PUT /api/speakers/:id` - Update speaker (admin)
- `DELETE /api/speakers/:id` - Delete speaker (admin)
- `GET /api/sessions` - List sessions
- `POST /api/sessions` - Create session (admin)
- `PUT /api/sessions/:id` - Update session (admin)
- `DELETE /api/sessions/:id` - Delete session (admin)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get statistics (admin)

## Security

- All secrets stored in environment variables
- Admin password hashed with bcrypt
- CORS configured for frontend origin
- Service account JSON excluded from git

