# Environment Variables Setup Guide

## Overview

This project requires **TWO separate .env files**:
1. **Root `.env`** - For backend (Go server)
2. **`frontend/.env`** - For frontend (React/Vite)

## Why Separate Files?

- **Backend**: Uses `godotenv` which reads from root `.env`
- **Frontend**: Vite requires environment variables to be in `frontend/.env` and must have `VITE_` prefix

---

## 1. Backend Environment Variables (Root `.env`)

Create a `.env` file in the **project root**:

```env
# Server Configuration
PORT=8080

# Firestore Configuration
FIRESTORE_PROJECT_ID=your-gcp-project-id
FIRESTORE_SUBDOC_ID=workshop
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json

# Admin Authentication
ADMIN_PASSWORD=your-secure-password-here

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Variable Descriptions:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Backend server port (default: 8080) | `8080` |
| `FIRESTORE_PROJECT_ID` | **Yes** | Your Google Cloud Project ID | `my-project-12345` |
| `FIRESTORE_SUBDOC_ID` | **Yes** | Firestore subcollection identifier | `workshop` |
| `GOOGLE_APPLICATION_CREDENTIALS` | **Yes** | Path to Firebase service account JSON | `./service-account.json` |
| `ADMIN_PASSWORD` | **Yes** | Password for admin login | `MySecurePassword123!` |
| `CORS_ORIGIN` | No | Frontend URL for CORS (default: http://localhost:5173) | `http://localhost:5173` |

---

## 2. Frontend Environment Variables (`frontend/.env`)

Create a `.env` file in the **`frontend/` directory**:

```env
VITE_API_URL=http://localhost:8080
```

### Variable Descriptions:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | No | Backend API URL (default: http://localhost:8080) | `http://localhost:8080` |

**Important**: 
- Vite only exposes variables prefixed with `VITE_` to the client
- The base URL should NOT include `/api` - it's added automatically in the code

---

## Setup Instructions

### Step 1: Create Backend .env File

```bash
# In project root
cat > .env << EOF
PORT=8080
FIRESTORE_PROJECT_ID=your-gcp-project-id
FIRESTORE_SUBDOC_ID=workshop
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
ADMIN_PASSWORD=your-secure-password-here
CORS_ORIGIN=http://localhost:5173
EOF
```

### Step 2: Create Frontend .env File

```bash
# In frontend directory
cd frontend
cat > .env << EOF
VITE_API_URL=http://localhost:8080
EOF
cd ..
```

### Step 3: Add Firebase Service Account

1. Download your Firebase service account JSON file
2. Place it in the project root as `service-account.json`
3. Make sure the path matches `GOOGLE_APPLICATION_CREDENTIALS` in `.env`

---

## Production Environment Variables

For production, update the values:

### Backend `.env` (Production):
```env
PORT=8080
FIRESTORE_PROJECT_ID=your-production-project-id
FIRESTORE_SUBDOC_ID=workshop
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
ADMIN_PASSWORD=your-strong-production-password
CORS_ORIGIN=https://yourdomain.com
```

### Frontend `frontend/.env` (Production):
```env
VITE_API_URL=https://api.yourdomain.com
```

**Note**: For production, you may want to:
- Use environment variables from your hosting platform (Vercel, Netlify, etc.)
- Use secrets management (AWS Secrets Manager, Google Secret Manager, etc.)
- Never commit `.env` files to git (already in `.gitignore`)

---

## Docker Environment Variables

When using Docker Compose, variables are read from the root `.env` file automatically. The `docker-compose.yml` file references them:

```yaml
environment:
  - PORT=${PORT}
  - FIRESTORE_PROJECT_ID=${FIRESTORE_PROJECT_ID}
  # ... etc
```

For frontend in Docker, the `VITE_API_URL` is set at build time, so you may need to rebuild the image if it changes.

---

## Quick Setup Checklist

- [ ] Create root `.env` file with backend variables
- [ ] Create `frontend/.env` file with `VITE_API_URL`
- [ ] Download Firebase service account JSON
- [ ] Place service account JSON in project root
- [ ] Update `FIRESTORE_PROJECT_ID` with your GCP project ID
- [ ] Set a secure `ADMIN_PASSWORD`
- [ ] Verify `GOOGLE_APPLICATION_CREDENTIALS` path is correct
- [ ] Update `CORS_ORIGIN` if frontend runs on different port/domain

---

## Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` in `frontend/.env`
- Ensure backend is running on the port specified
- Verify CORS_ORIGIN matches your frontend URL

### Backend can't connect to Firestore
- Verify `FIRESTORE_PROJECT_ID` is correct
- Check `GOOGLE_APPLICATION_CREDENTIALS` path exists
- Ensure service account JSON has proper permissions

### Admin login not working
- Check `ADMIN_PASSWORD` is set correctly
- Verify the password matches what you're entering

