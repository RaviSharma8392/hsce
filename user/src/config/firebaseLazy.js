import { firebaseConfig } from "./firebaseOptions";

let firestorePromise;

export function getLazyFirestore() {
  if (!firestorePromise) {
    firestorePromise = Promise.all([
      import("firebase/app"),
      import("firebase/firestore"),
    ])
      .then(([firebaseApp, firestore]) => {
        const app = firebaseApp.getApps().length
          ? firebaseApp.getApp()
          : firebaseApp.initializeApp(firebaseConfig);
        return { db: firestore.getFirestore(app), firestore };
      })
      .catch((error) => {
        firestorePromise = undefined;
        throw error;
      });
  }

  return firestorePromise;
}
