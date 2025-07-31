import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { config } from './config';

let app: any = null;
let auth: any = null;
let db: any = null;

async function getFirebaseConfigFromAPI() {
  try {
    const response = await fetch('/api/config/firebase');
    if (!response.ok) {
      throw new Error('Failed to fetch Firebase config from API');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Firebase config from API:', error);
    throw error;
  }
}

async function getFirebaseConfig() {
  // Check if we're in development mode and use environment variables as fallback
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment && config.firebase.apiKey) {
    console.log('Using environment variables for Firebase config (development mode)');
    return config.firebase;
  }

  try {
    // Try to fetch from API (which uses Secret Manager on server side)
    return await getFirebaseConfigFromAPI();
  } catch (error) {
    console.error('Failed to fetch Firebase config from API:', error);
    
    // Fallback to environment variables if API fails
    if (config.firebase.apiKey) {
      console.log('Falling back to environment variables for Firebase config');
      return config.firebase;
    }
    
    throw new Error('Unable to load Firebase configuration from API or environment variables');
  }
}

export async function initializeFirebase() {
  if (!app) {
    const firebaseConfig = await getFirebaseConfig();
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { app, auth, db };
}

export async function getAuthInstance() {
  if (!auth) {
    await initializeFirebase();
  }
  return auth;
}

export async function getDbInstance() {
  if (!db) {
    await initializeFirebase();
  }
  return db;
} 