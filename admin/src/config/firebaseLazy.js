import { firebaseConfig } from "./firebaseOptions";

let appPromise;
let authPromise;
let firestorePromise;

function getApp() {
  if (!appPromise) {
    appPromise = import("firebase/app")
      .then((firebaseApp) =>
        firebaseApp.getApps().length
          ? firebaseApp.getApp()
          : firebaseApp.initializeApp(firebaseConfig),
      )
      .catch((error) => {
        appPromise = undefined;
        throw error;
      });
  }
  return appPromise;
}

export function getLazyAuth() {
  if (!authPromise) {
    authPromise = Promise.all([getApp(), import("firebase/auth")])
      .then(([app, authSdk]) => ({
        auth: authSdk.getAuth(app),
        authSdk,
      }))
      .catch((error) => {
        authPromise = undefined;
        throw error;
      });
  }
  return authPromise;
}

export function getLazyFirestore() {
  if (!firestorePromise) {
    firestorePromise = Promise.all([getApp(), import("firebase/firestore")])
      .then(([app, firestore]) => ({
        db: firestore.getFirestore(app),
        firestore,
      }))
      .catch((error) => {
        firestorePromise = undefined;
        throw error;
      });
  }
  return firestorePromise;
}
