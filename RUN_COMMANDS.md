# Commands to Run the Project

## ✅ Issues Fixed
1. **Backend**: Fixed `go.mod` - removed invalid `google.golang.org/api/option` version
2. **Frontend**: Installed all npm dependencies

---

## 🚀 Quick Start Commands

### Step 1: Install Dependencies (Already Done ✅)

**Backend:**
```powershell
cd backend
go mod tidy
```

**Frontend:**
```powershell
cd frontend
npm install
```

---

### Step 2: Setup Environment Variables

**Create Backend `.env` (in project root):**
```powershell
# In project root directory
@"
PORT=8080
FIRESTORE_PROJECT_ID=your-gcp-project-id
FIRESTORE_SUBDOC_ID=workshop
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
ADMIN_PASSWORD=your-secure-password-here
CORS_ORIGIN=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding utf8
```

**Create Frontend `.env`:**
```powershell
# In frontend directory
cd frontend
@"
VITE_API_URL=http://localhost:8080
"@ | Out-File -FilePath .env -Encoding utf8
cd ..
```

**⚠️ Important:** Replace `your-gcp-project-id` and `your-secure-password-here` with your actual values!

---

### Step 3: Run the Servers

#### Option A: Run in Separate PowerShell Windows (Recommended)

**PowerShell Window 1 - Backend:**
```powershell
cd backend
go run cmd/server/main.go
```

**PowerShell Window 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

#### Option B: Run with Docker
```powershell
docker-compose up --build
```

---

## 📍 Access URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080/api

---

## ✅ Verification

After starting both servers:

1. ✅ Open http://localhost:5173 in browser
2. ✅ You should see the Hero section with "AppDirect India AI Workshop"
3. ✅ Test the registration form
4. ✅ Click "Admin Login" in footer to test admin access

---

## 🔧 Troubleshooting

### Backend won't start
- ✅ Check `.env` file exists in project root
- ✅ Verify `FIRESTORE_PROJECT_ID` is correct
- ✅ Ensure `service-account.json` exists
- ✅ Check Go version: `go version` (needs 1.21+)

### Frontend won't start
- ✅ Check `frontend/.env` exists
- ✅ Verify Node.js version: `node --version` (needs 18+)
- ✅ If vite not found, run: `cd frontend; npm install`

### Connection Issues
- ✅ Ensure backend is running on port 8080
- ✅ Check `VITE_API_URL` in `frontend/.env` matches backend URL
- ✅ Verify `CORS_ORIGIN` in backend `.env` matches frontend URL

---

## 📝 Notes

- Both servers must be running simultaneously
- Backend must start before frontend can connect
- Environment variables are required for both services
- Service account JSON file must be in project root

