import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { config } from './config';

// Initialize the client with explicit credentials if available
let client: SecretManagerServiceClient;

try {
  // Try to use service account key if available
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    client = new SecretManagerServiceClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
  } else {
    // Use default credentials (Application Default Credentials)
    client = new SecretManagerServiceClient();
  }
} catch (error) {
  console.error('Failed to initialize Secret Manager client:', error);
  throw error;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  newsAPIKey: string;
}

export async function getSecret(secretName: string): Promise<string> {
  try {
    const projectId = config.googleCloudProject;
    if (!projectId) {
      throw new Error('Google Cloud Project ID not configured');
    }
    
    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    const [version] = await client.accessSecretVersion({ name });
    return version.payload?.data?.toString() || '';
  } catch (error) {
    console.error(`Error accessing secret ${secretName}:`, error);
    throw error;
  }
}

export async function getFirebaseConfig(): Promise<FirebaseConfig> {
  // Check if we're in development mode and use environment variables as fallback
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment && config.firebase.apiKey) {
    console.log('Using environment variables for Firebase config (development mode)');
    return config.firebase as FirebaseConfig;
  }

  try {
    const firebaseConfigString = await getSecret('news-app-prod-config');
    const firebaseConfig = JSON.parse(firebaseConfigString);

    return {
      apiKey: firebaseConfig.NEXT_PUBLIC_FIREBASE?.API_KEY || '',
      authDomain: firebaseConfig.NEXT_PUBLIC_FIREBASE?.AUTH_DOMAIN || '',
      projectId: firebaseConfig.NEXT_PUBLIC_FIREBASE?.PROJECT_ID || '',
      storageBucket: firebaseConfig.NEXT_PUBLIC_FIREBASE?.STORAGE_BUCKET || '',
      messagingSenderId: firebaseConfig.NEXT_PUBLIC_FIREBASE?.MESSAGING_SENDER_ID || '',
      appId: firebaseConfig.NEXT_PUBLIC_FIREBASE?.APP_ID || '',
      newsAPIKey: firebaseConfig.NEXT_PUBLIC_NEWS?.API_KEY || ''
    };
  } catch (error) {
    console.error('Failed to fetch secrets from Google Secret Manager:', error);
    
    // Fallback to environment variables if Secret Manager fails
    if (config.firebase.apiKey) {
      console.log('Falling back to environment variables for Firebase config');
      return config.firebase as FirebaseConfig;
    }
    
    throw new Error('Unable to load Firebase configuration from Secret Manager or environment variables');
  }
} 