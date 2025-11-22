# Cloud Run Environment Variables

## Required Environment Variables

Add these environment variables in the Cloud Run service configuration:

### 1. PORT
- **Value**: `8080`
- **Description**: Port on which the backend server runs
- **Required**: Yes (Cloud Run sets this automatically, but good to specify)

### 2. FIRESTORE_PROJECT_ID
- **Value**: Your Google Cloud Project ID (e.g., `my-project-12345`)
- **Description**: The GCP project ID where Firestore is enabled
- **Required**: Yes
- **Example**: `india-tech-meetup-2025`

### 3. FIRESTORE_SUBDOC_ID
- **Value**: Subcollection identifier (e.g., `workshop`)
- **Description**: Identifier for the Firestore subcollection
- **Required**: Yes
- **Default**: `workshop` (if not set)
- **Example**: `ratnakar.patil` or `workshop`

### 4. ADMIN_PASSWORD
- **Value**: Your secure admin password
- **Description**: Password for admin login
- **Required**: Yes
- **Security**: ⚠️ **Store in Secret Manager** (recommended) or use environment variable
- **Example**: `MySecurePassword123!`

### 5. CORS_ORIGIN
- **Value**: Your frontend domain or `*` for all origins
- **Description**: Allowed CORS origin for API requests
- **Required**: No (defaults to `*` if not set)
- **Options**:
  - `*` - Allow all origins (for single container deployment)
  - `https://yourdomain.com` - Specific domain
  - `https://yourdomain.com,https://www.yourdomain.com` - Multiple domains

## Optional Environment Variables

### GOOGLE_APPLICATION_CREDENTIALS
- **Value**: Leave **EMPTY** or **DO NOT SET**
- **Description**: For Cloud Run, this should NOT be set. The application uses Application Default Credentials (ADC) automatically.
- **Note**: Only set this for local development with a service account file

## Cloud Run Configuration

### Option 1: Using gcloud CLI

```bash
gcloud run services update appdirect-workshop \
  --region=us-central1 \
  --set-env-vars="PORT=8080,FIRESTORE_PROJECT_ID=your-project-id,FIRESTORE_SUBDOC_ID=workshop,CORS_ORIGIN=*" \
  --set-secrets="ADMIN_PASSWORD=admin-password:latest"
```

### Option 2: Using Cloud Console

1. Go to Cloud Run → Your Service → Edit & Deploy New Revision
2. Navigate to **Variables & Secrets** tab
3. Add environment variables:

| Variable | Value |
|----------|-------|
| `PORT` | `8080` |
| `FIRESTORE_PROJECT_ID` | `your-project-id` |
| `FIRESTORE_SUBDOC_ID` | `workshop` |
| `CORS_ORIGIN` | `*` |

4. For `ADMIN_PASSWORD`, click **Reference a Secret**:
   - Secret: `admin-password`
   - Version: `latest`

### Option 3: Using cloudbuild.yaml (Automated)

The `cloudbuild.yaml` file already includes these:

```yaml
--set-env-vars
'PORT=8080,FIRESTORE_PROJECT_ID=$PROJECT_ID,FIRESTORE_SUBDOC_ID=workshop'
--set-secrets
'ADMIN_PASSWORD=admin-password:latest'
```

## Secret Manager Setup (Recommended for ADMIN_PASSWORD)

### Create Secret:
```bash
echo -n "your-secure-password" | gcloud secrets create admin-password --data-file=-
```

### Grant Access:
```bash
PROJECT_NUMBER=$(gcloud projects describe PROJECT_ID --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding admin-password \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Complete Example

### Environment Variables (Cloud Run Console):
```
PORT=8080
FIRESTORE_PROJECT_ID=india-tech-meetup-2025
FIRESTORE_SUBDOC_ID=workshop
CORS_ORIGIN=*
```

### Secrets (Cloud Run Console):
```
ADMIN_PASSWORD → Reference Secret: admin-password (latest)
```

## Verification

After deployment, verify environment variables:

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe appdirect-workshop \
  --region=us-central1 \
  --format='value(status.url)')

# Test API
curl $SERVICE_URL/api/attendees/count

# Test frontend
curl $SERVICE_URL
```

## Important Notes

1. **DO NOT** set `GOOGLE_APPLICATION_CREDENTIALS` in Cloud Run
   - Cloud Run automatically provides Application Default Credentials
   - The service account attached to Cloud Run will be used

2. **Service Account Permissions:**
   - Ensure Cloud Run service account has `roles/datastore.user` role
   - This allows Firestore access without a service account file

3. **CORS_ORIGIN:**
   - Use `*` if frontend and backend are in the same container (this setup)
   - Use specific domain if frontend is hosted separately

4. **ADMIN_PASSWORD:**
   - **Never** commit passwords to code
   - Use Secret Manager for production
   - Can use environment variable for testing only

## Troubleshooting

### Firestore Connection Errors
- Verify `FIRESTORE_PROJECT_ID` matches your GCP project
- Check service account has Firestore permissions
- Ensure Firestore API is enabled

### Authentication Errors
- Verify secret exists and is accessible
- Check service account has Secret Manager access

### CORS Errors
- Update `CORS_ORIGIN` to match your frontend domain
- Use `*` for development/testing

