import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

const LOCAL_STORAGE_KEY = "hsce_student_enquiries";

/**
 * Get enquiries stored in localStorage (backup / fallback)
 */
export function getLocalEnquiries() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Error reading local enquiries:", err);
    return [];
  }
}

/**
 * Save enquiries list to localStorage
 */
export function setLocalEnquiries(list) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.warn("Error writing local enquiries:", err);
  }
}

/**
 * Real-time subscription to student chatbot enquiries
 * Returns unsubscribe function
 */
export function subscribeToEnquiries(callback) {
  // If Firestore is ready, set up real-time listener
  if (firebaseReady) {
    try {
      const q = query(
        collection(db, "studentEnquiries"),
        orderBy("createdAt", "desc"),
        limit(150)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const remoteList = snapshot.docs.map((d) => {
            const data = d.data();
            let dateStr = data.createdAtFormatted;
            if (!dateStr && data.createdAt) {
              const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
              dateStr = date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            }
            return {
              id: d.id,
              ...data,
              createdAtFormatted: dateStr || "Recent",
            };
          });

          // Merge with any local offline enquiries not yet pushed to firestore
          const localList = getLocalEnquiries();
          const mergedMap = new Map();
          remoteList.forEach((item) => mergedMap.set(item.id, item));
          localList.forEach((item) => {
            if (!mergedMap.has(item.id)) {
              mergedMap.set(item.id, item);
            }
          });

          const combined = Array.from(mergedMap.values()).sort(
            (a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0)
          );

          setLocalEnquiries(combined);
          callback(combined);
        },
        (error) => {
          console.warn("Firestore enquiries subscription error, using local fallback:", error);
          callback(getLocalEnquiries());
        }
      );

      return unsubscribe;
    } catch (e) {
      console.warn("Error initializing Firestore enquiries listener:", e);
    }
  }

  // Fallback to localStorage and listen to window storage events
  callback(getLocalEnquiries());
  const handleStorageChange = () => {
    callback(getLocalEnquiries());
  };
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}

/**
 * Update enquiry status or staff notes
 */
export async function updateEnquiry(id, updates) {
  if (firebaseReady && !id.startsWith("local_")) {
    const ref = doc(db, "studentEnquiries", id);
    await updateDoc(ref, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // 2. Always update local storage
  const current = getLocalEnquiries();
  const updatedList = current.map((item) => {
    if (item.id === id) {
      return { ...item, ...updates, updatedAt: new Date().toISOString() };
    }
    return item;
  });
  setLocalEnquiries(updatedList);
  return true;
}

/**
 * Delete enquiry from Firestore & local storage
 */
export async function deleteEnquiry(id) {
  if (firebaseReady && !id.startsWith("local_")) {
    const ref = doc(db, "studentEnquiries", id);
    await deleteDoc(ref);
  }

  // 2. Remove from local storage
  const current = getLocalEnquiries();
  const filtered = current.filter((item) => item.id !== id);
  setLocalEnquiries(filtered);
  return true;
}

// =========================================================================
// STUDENT GRIEVANCES & COMPLAINTS
// =========================================================================
const GRIEVANCE_STORAGE_KEY = "hsce_student_grievances";

export function getLocalGrievances() {
  try {
    const raw = localStorage.getItem(GRIEVANCE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function setLocalGrievances(list) {
  try {
    localStorage.setItem(GRIEVANCE_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {}
}

export function subscribeToGrievances(callback) {
  if (firebaseReady) {
    try {
      const q = query(
        collection(db, "grievances"),
        orderBy("createdAt", "desc"),
        limit(150)
      );
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const remoteList = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          const localList = getLocalGrievances();
          const map = new Map();
          remoteList.forEach((r) => map.set(r.id, r));
          localList.forEach((l) => {
            if (!map.has(l.id)) map.set(l.id, l);
          });
          const combined = Array.from(map.values()).sort(
            (a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0)
          );
          setLocalGrievances(combined);
          callback(combined);
        },
        () => callback(getLocalGrievances())
      );
      return unsubscribe;
    } catch (e) {}
  }
  callback(getLocalGrievances());
  const handleStorage = () => callback(getLocalGrievances());
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

export async function updateGrievanceStatus(id, status, notes = "") {
  if (firebaseReady && !id.startsWith("local_")) {
    const ref = doc(db, "grievances", id);
    await updateDoc(ref, {
      status,
      adminNotes: notes,
      updatedAt: serverTimestamp(),
    });
  }
  const current = getLocalGrievances();
  const updated = current.map((item) =>
    item.id === id ? { ...item, status, adminNotes: notes } : item
  );
  setLocalGrievances(updated);
  return true;
}

export async function deleteGrievance(id) {
  if (firebaseReady && !id.startsWith("local_")) {
    await deleteDoc(doc(db, "grievances", id));
  }
  const current = getLocalGrievances();
  setLocalGrievances(current.filter((i) => i.id !== id));
  return true;
}

// =========================================================================
// CONTACT FEEDBACK & GUESTBOOK
// =========================================================================
const FEEDBACK_STORAGE_KEY = "hsce_contact_feedback";

export function getLocalFeedback() {
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function setLocalFeedback(list) {
  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {}
}

export function subscribeToFeedback(callback) {
  if (firebaseReady) {
    try {
      const q = query(
        collection(db, "contactFeedback"),
        orderBy("createdAt", "desc"),
        limit(150)
      );
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const remoteList = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          const localList = getLocalFeedback();
          const map = new Map();
          remoteList.forEach((r) => map.set(r.id, r));
          localList.forEach((l) => {
            if (!map.has(l.id)) map.set(l.id, l);
          });
          const combined = Array.from(map.values()).sort(
            (a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0)
          );
          setLocalFeedback(combined);
          callback(combined);
        },
        () => callback(getLocalFeedback())
      );
      return unsubscribe;
    } catch (e) {}
  }
  callback(getLocalFeedback());
  const handleStorage = () => callback(getLocalFeedback());
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

export async function updateFeedbackStatus(id, status, notes = "") {
  if (firebaseReady && !id.startsWith("local_")) {
    const ref = doc(db, "contactFeedback", id);
    await updateDoc(ref, {
      status,
      adminNotes: notes,
      updatedAt: serverTimestamp(),
    });
  }
  const current = getLocalFeedback();
  const updated = current.map((item) =>
    item.id === id ? { ...item, status, adminNotes: notes } : item
  );
  setLocalFeedback(updated);
  return true;
}

export async function deleteFeedback(id) {
  if (firebaseReady && !id.startsWith("local_")) {
    await deleteDoc(doc(db, "contactFeedback", id));
  }
  const current = getLocalFeedback();
  setLocalFeedback(current.filter((i) => i.id !== id));
  return true;
}

