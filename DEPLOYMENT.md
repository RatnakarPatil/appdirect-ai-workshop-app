# Deployment Guide

## Google Cloud Run Deployment

This application is configured to deploy to Google Cloud Run without requiring a Firebase service account file. It uses Application Default Credentials (ADC) which are automatically provided by Cloud Run.

### Prerequisites

1. Google Cloud Project with:
   - Cloud Run API enabled
   - Firestore API enabled
   - Cloud Build API enabled (for CI/CD)

2. Service Account with Firestore permissions:
   - Cloud Run service uses the default compute service account
   - Ensure it has "Cloud Datastore User" role

### Deployment Steps

#### Option 1: Using Cloud Build (Recommended)

1. **Set up secrets in Secret Manager:**
   ```bash
   echo -n "your-admin-password" | gcloud secrets create admin-password --data-file=-
   ```

2. **Grant Cloud Run access to the secret:**
   ```bash
   gcloud secrets add-iam-policy-binding admin-password \
     --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"
   ```

3. **Submit build:**
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

#### Option 2: Manual Deployment

1. **Build the Docker image:**
   ```bash
   docker build -t gcr.io/PROJECT_ID/appdirect-workshop:latest .
   ```

2. **Push to Container Registry:**
   ```bash
   docker push gcr.io/PROJECT_ID/appdirect-workshop:latest
   ```

3. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy appdirect-workshop \
     --image gcr.io/PROJECT_ID/appdirect-workshop:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 8080 \
     --set-env-vars "PORT=8080,FIRESTORE_PROJECT_ID=PROJECT_ID,FIRESTORE_SUBDOC_ID=workshop" \
     --set-secrets "ADMIN_PASSWORD=admin-password:latest"
   ```

### Environment Variables

The following environment variables are set automatically or via Cloud Run:

- `PORT`: Set to 8080 (default)
- `FIRESTORE_PROJECT_ID`: Your GCP project ID
- `FIRESTORE_SUBDOC_ID`: Subcollection identifier (default: workshop)
- `ADMIN_PASSWORD`: Stored in Secret Manager
- `CORS_ORIGIN`: Set to `*` for Cloud Run (or specific domain)

### Service Account Configuration

Cloud Run automatically uses the default compute service account. To use a custom service account:

```bash
gcloud run services update appdirect-workshop \
  --service-account=SERVICE_ACCOUNT_EMAIL \
  --region=us-central1
```

Ensure the service account has:
- `roles/datastore.user` (for Firestore access)

### Testing the Deployment

After deployment, test the endpoints:

```bash
# Get the service URL
SERVICE_URL=$(gcloud run services describe appdirect-workshop --region=us-central1 --format='value(status.url)')

# Test health endpoint
curl $SERVICE_URL/api/attendees/count

# Test frontend
curl $SERVICE_URL
```

### Troubleshooting

1. **Firestore connection errors:**
   - Verify service account has Firestore permissions
   - Check FIRESTORE_PROJECT_ID is correct
   - Ensure Firestore is enabled in the project

2. **Authentication errors:**
   - Verify secret is accessible by Cloud Run service account
   - Check secret name matches in deployment command

3. **CORS errors:**
   - Update CORS_ORIGIN environment variable
   - Ensure frontend domain is allowed

