export const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyAfUyCebObn_tuI-61QFcKURg7Y17mFF3E",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "hsce-df9b0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hsce-df9b0",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "hsce-df9b0.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "630001942800",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:630001942800:web:d7dc0790582f769d772595",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5FP7W6RSNT",
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
    !value.includes("your-project"),
);
