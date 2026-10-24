import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

const LOCAL_STORAGE_KEY = "hsce_campus_tours";

/**
 * Get tours stored in localStorage (backup / offline sync)
 */
export function getLocalTours() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Error reading local campus tours:", err);
    return [];
  }
}

/**
 * Save tours list to localStorage
 */
export function setLocalTours(list) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.warn("Error writing local campus tours:", err);
  }
}

/**
 * Real-time subscription to Campus Tour Bookings
 * Returns unsubscribe function
 */
export function subscribeToTours(callback) {
  if (firebaseReady) {
    try {
      const q = query(
        collection(db, "campusTours"),
        orderBy("createdAt", "desc")
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

          // Merge with any local offline bookings
          const localList = getLocalTours();
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

          setLocalTours(combined);
          callback(combined);
        },
        (error) => {
          console.warn("Firestore tours subscription error, using local fallback:", error);
          callback(getLocalTours());
        }
      );

      return unsubscribe;
    } catch (e) {
      console.warn("Firestore error setting up tours listener:", e);
      callback(getLocalTours());
      return () => {};
    }
  }

  // Fallback to localStorage listener
  callback(getLocalTours());
  const handleStorage = () => callback(getLocalTours());
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

/**
 * Update Tour Status & Staff Notes
 * @param {string} id
 * @param {string} status - 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled'
 * @param {string} [staffNotes]
 */
export async function updateTourStatus(id, status, staffNotes = null) {
  const updates = { status };
  if (staffNotes !== null) {
    updates.staffNotes = staffNotes;
  }

  // 1. If remote Firestore doc exists
  if (firebaseReady && !id.startsWith("tour_local_")) {
    const ref = doc(db, "campusTours", id);
    await updateDoc(ref, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // 2. Always update local storage
  const list = getLocalTours();
  const idx = list.findIndex((item) => item.id === id);
  if (idx !== -1) {
    list[idx] = {
      ...list[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setLocalTours(list);
  }

  return { success: true };
}

/**
 * Delete a tour record
 */
export async function deleteTour(id) {
  if (firebaseReady && !id.startsWith("tour_local_")) {
    const ref = doc(db, "campusTours", id);
    await deleteDoc(ref);
  }

  const list = getLocalTours().filter((item) => item.id !== id);
  setLocalTours(list);
  return { success: true };
}
