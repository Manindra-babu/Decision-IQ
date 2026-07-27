// src/firebase.js
// Firebase App initialisation — uses Vite env variables (VITE_FIREBASE_*)
// Copy .env.example → .env at the project root and fill in your Firebase config values.

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase keys are fully configured
export const isMock = !import.meta.env.VITE_FIREBASE_API_KEY;

let app;
let auth;
let db;
let googleProvider;

if (!isMock) {
  try {
    // Initialise the Firebase app
    app = initializeApp(firebaseConfig);
    // Auth instance
    auth = getAuth(app);
    // Firestore instance — using long polling to bypass AdBlockers or VPN restrictions
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
    // Google provider (pre-configured to always show account picker)
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (error) {
    console.error("Firebase initialization failed, falling back to mock mode:", error);
  }
} else {
  console.warn("Firebase API key missing. Decision IQ is running in LOCAL STORAGE fallback mode.");
  auth = {};
  db = {};
  googleProvider = {};
}

export { auth, db, googleProvider };
export default app;
