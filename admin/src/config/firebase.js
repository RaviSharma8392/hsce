import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyAfUyCebObn_tuI-61QFcKURg7Y17mFF3E",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "hsce-df9b0.firebaseapp.com",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || "hsce-df9b0",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "hsce-df9b0.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    "630001942800",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:630001942800:web:d7dc0790582f769d772595",
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5FP7W6RSNT",
};

const requiredConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
];

export const firebaseReady = requiredConfig.every(
  (value) =>
    value &&
    !value.startsWith("your_") &&
    !value.includes("your-project")
);

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize analytics safely if supported in the current environment
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics optional fallback
  });
}
