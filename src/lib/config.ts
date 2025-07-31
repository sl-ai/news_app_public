export const config = {
  googleCloudProject: process.env.GOOGLE_CLOUD_PROJECT || process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT || '915375628709',
  // Fallback to environment variables for development
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    newsAPIKey: process.env.NEXT_PUBLIC_NEWS_API_KEY
  }
}; 