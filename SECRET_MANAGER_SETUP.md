# Google Secret Manager Setup

This project now uses Google Secret Manager to securely store Firebase configuration instead of environment variables. The Secret Manager integration runs server-side only to prevent client-side module resolution issues.

## Architecture

- **Server-side**: Google Secret Manager integration runs in API routes
- **Client-side**: Firebase configuration is fetched via API calls
- **Development**: Automatic fallback to environment variables
- **Production**: Secure secret management via Google Cloud

## Prerequisites

1. Google Cloud Project with Secret Manager API enabled
2. Google Cloud CLI installed and authenticated
3. Appropriate IAM permissions for Secret Manager

## Quick Setup

Run the authentication setup script:

```bash
chmod +x setup-auth.sh
./setup-auth.sh
```

## Setup Instructions

### 1. Enable Secret Manager API

```bash
gcloud services enable secretmanager.googleapis.com
```

### 2. Create the Firebase Configuration Secret

Create a single secret containing all Firebase configuration as JSON:

```bash
# Create the secret with Firebase config
cat > firebase-config.json << 'EOF'
{
  "NEXT_PUBLIC_FIREBASE": {
    "API_KEY": "your-firebase-api-key",
    "AUTH_DOMAIN": "your-project.firebaseapp.com",
    "PROJECT_ID": "your-project-id",
    "STORAGE_BUCKET": "your-project.appspot.com",
    "MESSAGING_SENDER_ID": "123456789",
    "APP_ID": "1:123456789:web:abcdef"
  },
  "NEXT_PUBLIC_NEWS": {
    "API_KEY": "your-news-api-key"
  }
}
EOF

# Create the secret
gcloud secrets create news-app-prod-config --data-file=firebase-config.json

# Clean up the temporary file
rm firebase-config.json
```

### 3. Set Environment Variables

Add the following environment variables to your deployment:

```bash
# Required
GOOGLE_CLOUD_PROJECT=your-project-id

# Authentication (choose one)
# Option 1: Service Account Key (production)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json

# Option 2: Application Default Credentials (development)
# Run: gcloud auth application-default login
```

### 4. Configure Authentication

#### For Development (Application Default Credentials):

```bash
# Login to Google Cloud
gcloud auth login

# Set up Application Default Credentials
gcloud auth application-default login
```

#### For Production (Service Account):

```bash
# Create service account
gcloud iam service-accounts create secret-manager-sa \
  --display-name="Secret Manager Service Account"

# Grant Secret Manager access
gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:secret-manager-sa@your-project-id.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Download key file
gcloud iam service-accounts keys create key.json \
  --iam-account=secret-manager-sa@your-project-id.iam.gserviceaccount.com

# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/key.json
```

### 5. Development Fallback

The application will automatically fall back to environment variables in development mode (`NODE_ENV=development`) if Secret Manager is not available or fails.

## How It Works

1. **Client-side**: Firebase initialization calls `/api/config/firebase`
2. **Server-side**: API route fetches secrets from Google Secret Manager
3. **Response**: Firebase configuration is returned to the client
4. **Fallback**: Environment variables are used in development mode

## Environment Variables (Development Fallback)

For development, you can still use these environment variables as fallback:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_NEWS_API_KEY=your-news-api-key
GOOGLE_CLOUD_PROJECT=your-project-id
```

## Security Benefits

- Secrets are encrypted at rest
- Access is controlled via IAM
- Audit logging for secret access
- No secrets in code or environment variables
- Automatic rotation capabilities
- Server-side only secret access (no client-side exposure)

## Troubleshooting

### 1. **Permission Denied**
Ensure your service account has `secretmanager.secretAccessor` role:
```bash
gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:your-service-account@your-project-id.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 2. **Project Not Found**
Verify `GOOGLE_CLOUD_PROJECT` is set correctly:
```bash
echo $GOOGLE_CLOUD_PROJECT
```

### 3. **Secret Not Found**
Ensure the secret is created in Secret Manager:
```bash
gcloud secrets list
```

### 4. **Authentication Issues**

#### Check Application Default Credentials:
```bash
gcloud auth application-default print-access-token
```

#### Check Service Account Key:
```bash
# Verify the key file exists and is readable
ls -la $GOOGLE_APPLICATION_CREDENTIALS

# Test the credentials
gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
```

#### Common Authentication Errors:

**"Could not load the default credentials"**
- Solution: Run `gcloud auth application-default login` for development
- Or set `GOOGLE_APPLICATION_CREDENTIALS` to a valid service account key file

**"Permission denied"**
- Solution: Ensure the service account has the `secretmanager.secretAccessor` role

**"Project not found"**
- Solution: Verify the project ID is correct and the service account has access to it

### 5. **Module Resolution Error**
Ensure you're using the server-side Secret Manager utilities

### 6. **Development Mode Issues**
If Secret Manager fails in development, the app will automatically fall back to environment variables. Check that your environment variables are properly set. 