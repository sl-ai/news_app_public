#!/bin/bash

echo "🔐 Google Cloud Authentication Setup for Secret Manager"
echo "======================================================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI is not installed."
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "✅ Google Cloud CLI is installed"

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔑 Setting up authentication..."
    gcloud auth login
else
    echo "✅ Already authenticated with Google Cloud"
fi

# Set up Application Default Credentials
echo "🔧 Setting up Application Default Credentials..."
gcloud auth application-default login

echo ""
echo "🎉 Authentication setup complete!"
echo ""
echo "Next steps:"
echo "1. Create secrets in Google Secret Manager:"
echo "   - news-app-prod-config (JSON with Firebase config)"
echo "2. Set GOOGLE_CLOUD_PROJECT environment variable"
echo "3. For production, create a service account and set GOOGLE_APPLICATION_CREDENTIALS"
echo ""
echo "See SECRET_MANAGER_SETUP.md for detailed instructions." 