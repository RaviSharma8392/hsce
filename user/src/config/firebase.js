import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig, firebaseReady } from "./firebaseOptions";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { firebaseConfig, firebaseReady };
