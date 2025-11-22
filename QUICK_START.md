# Quick Start Guide

## Prerequisites Check

Before running, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ Go 1.21+ installed (`go version`)
- ✅ Firebase service account JSON file
- ✅ Google Cloud Project with Firestore enabled

---

## Step-by-Step Setup & Run

### 1. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

**Backend:**
```bash
cd backend
go mod download
cd ..
```

---

### 2. Setup Environment Variables

**Create Backend .env (in project root):**
```bash
cat > .env << 'EOF'
PORT=8080
FIRESTORE_PROJECT_ID=your-gcp-project-id
FIRESTORE_SUBDOC_ID=workshop
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
ADMIN_PASSWORD=your-secure-password-here
CORS_ORIGIN=http://localhost:5173
EOF
```

**Create Frontend .env:**
```bash
cat > frontend/.env << 'EOF'
VITE_API_URL=http://localhost:8080
EOF
```

**Important:** Replace `your-gcp-project-id` and `your-secure-password-here` with your actual values!

---

### 3. Verify Firebase Service Account

Make sure `service-account.json` is in the project root and matches the path in `.env`.

---

### 4. Run the Project

#### Option A: Run Both Servers Manually (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
go run cmd/server/main.go
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### Option B: Run with Docker

```bash
docker-compose up --build
```

---

### 5. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080/api

---

## Verification Checklist

After starting, verify:

- [ ] Backend server starts without errors (check Terminal 1)
- [ ] Frontend dev server starts (check Terminal 2)
- [ ] Can access http://localhost:5173 in browser
- [ ] Hero section displays correctly
- [ ] Registration form works
- [ ] Admin login works (use password from `.env`)

---

## Common Issues & Solutions

### Backend won't start
- Check `.env` file exists in project root
- Verify `FIRESTORE_PROJECT_ID` is correct
- Ensure `service-account.json` exists and path is correct
- Check Go version: `go version` (needs 1.21+)

### Frontend won't start
- Check `frontend/.env` exists
- Verify Node.js version: `node --version` (needs 18+)
- Try deleting `node_modules` and `package-lock.json`, then `npm install` again

### Can't connect to backend
- Ensure backend is running on port 8080
- Check `VITE_API_URL` in `frontend/.env` matches backend URL
- Verify CORS_ORIGIN in backend `.env` matches frontend URL

### Firestore connection errors
- Verify `FIRESTORE_PROJECT_ID` matches your GCP project
- Check service account JSON has Firestore permissions
- Ensure Firestore is enabled in your GCP project

---

## Development Commands

### Frontend
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
cd backend
go run cmd/server/main.go           # Run server
go build -o server ./cmd/server      # Build binary
```

---

## Project Structure

```
appdirect-ai-workshop-app/
├── .env                    # Backend environment variables (create this)
├── service-account.json    # Firebase credentials (add this)
├── backend/
│   ├── cmd/server/main.go
│   └── internal/...
├── frontend/
│   ├── .env               # Frontend environment variables (create this)
│   └── src/...
└── docker-compose.yml
```

---

## Next Steps After Running

1. **Test Registration:** Fill out the registration form
2. **Test Admin:** Click "Admin Login" in footer, enter password
3. **Add Speakers:** Go to Admin Dashboard → Speakers → Add Speaker
4. **Add Sessions:** Go to Admin Dashboard → Sessions → Add Session
5. **View Analytics:** Go to Admin Dashboard → Analytics

---

## Production Deployment

For production:
1. Update `.env` with production values
2. Update `frontend/.env` with production API URL
3. Build frontend: `cd frontend && npm run build`
4. Build backend: `cd backend && go build -o server ./cmd/server`
5. Or use Docker: `docker-compose up --build`

