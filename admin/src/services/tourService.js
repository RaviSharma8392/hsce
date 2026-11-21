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

/**
 * Real-time subscription to Campus Tour Bookings
 * Returns unsubscribe function
 */
export function subscribeToTours(callback) {
  if (!firebaseReady) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, "campusTours"),
    orderBy("createdAt", "desc"),
    limit(150)
  );
  return onSnapshot(
    q,
    { includeMetadataChanges: true },
    (snapshot) => {
      if (snapshot.metadata.fromCache) {
        callback([]);
        return;
      }

      callback(snapshot.docs.map((d) => {
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
      }));
    },
    (error) => {
      console.error("Firestore tours subscription error:", error);
      callback([]);
    }
  );
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

  if (!firebaseReady || id.startsWith("tour_local_")) {
    throw new Error("This tour is not synced to Firestore and cannot be updated.");
  }

  await updateDoc(doc(db, "campusTours", id), {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  return { success: true };
}

/**
 * Delete a tour record
 */
export async function deleteTour(id) {
  if (!firebaseReady || id.startsWith("tour_local_")) {
    throw new Error("This tour is not synced to Firestore and cannot be deleted.");
  }

  await deleteDoc(doc(db, "campusTours", id));
  return { success: true };
}
