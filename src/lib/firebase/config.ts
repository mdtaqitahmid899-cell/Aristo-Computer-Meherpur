import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDKGL3D4gKkYepALyk7NRsMiPh1gxNk2z0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "aristo-computer-meherpur.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "aristo-computer-meherpur",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "aristo-computer-meherpur.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "471673883102",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:471673883102:web:c08ad467d96e7a7bdef54f",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XNZPBVPLGJ",
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.apiKey !== "your_api_key_here" &&
      firebaseConfig.projectId &&
      firebaseConfig.projectId !== "your_project_id"
  );
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);

    // Initialize Analytics only in client browser environment
    if (typeof window !== "undefined") {
      isSupported()
        .then((supported) => {
          if (supported && app) {
            analytics = getAnalytics(app);
          }
        })
        .catch(() => {
          // Analytics not supported in this environment
        });
    }
  } catch (error) {
    console.warn("Firebase initialization warning:", error);
  }
}

export { app, db, storage, auth, analytics, firebaseConfig };
