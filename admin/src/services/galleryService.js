import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

/**
 * Subscribe to gallery images in real-time
 */
export function subscribeToGallery(callback) {
  if (!firebaseReady) {
    callback([]);
    return () => {};
  }

  const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    { includeMetadataChanges: true },
    (snapshot) => {
      if (snapshot.metadata.fromCache) {
        callback([]);
        return;
      }

      callback(snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        let dateStr = data.date;
        if (!dateStr && data.createdAt) {
          const d = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          dateStr = d.toISOString().split("T")[0];
        }
        return {
          id: docSnap.id,
          ...data,
          date: dateStr || "",
        };
      }));
    },
    (error) => {
      console.error("Firestore gallery subscription error:", error);
      callback([]);
    }
  );
}

/**
 * Add / Upload a new image to gallery
 * @param {Object} data
 */
export async function addGalleryImage(data, currentUser = null) {
  if (!firebaseReady) {
    throw new Error("The gallery service is not connected to Firestore.");
  }

  const timestamp = new Date();
  const isPub = data.isPublished !== false;
  const status = isPub ? "published" : "draft";
  const authorUid = currentUser?.uid || "staff_user";
  const authorName = currentUser?.displayName || currentUser?.email || data.author || "Staff Operations";

  const payload = {
    title: (data.title || "").trim(),
    category: data.category || "Campus Life",
    date: data.date || timestamp.toISOString().split("T")[0],
    image: data.image || "",
    isPublished: isPub,
    status: status,
    author: authorName,
    authorUid: authorUid,
    authorName: authorName,
    createdAtFormatted: timestamp.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    createdAtMs: timestamp.getTime(),
  };

  const docRef = await addDoc(collection(db, "gallery"), {
    title: payload.title,
    category: payload.category,
    date: payload.date,
    image: payload.image,
    isPublished: payload.isPublished,
    status: payload.status,
    authorUid: payload.authorUid,
    authorName: payload.authorName,
    publishedAt: isPub ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const record = {
    ...payload,
    id: docRef.id,
    createdAt: timestamp.toISOString(),
  };

  return {
    success: true,
    id: record.id,
    record,
    syncedToCloud: true,
  };
}

export async function updateGalleryImage(id, data) {
  if (!firebaseReady || id.startsWith("gallery_local_")) {
    throw new Error("This gallery photo is not synced to Firestore and cannot be updated.");
  }

  const payload = {
    title: (data.title || "").trim(),
    category: (data.category || "Campus Life").trim(),
    date: data.date || new Date().toISOString().slice(0, 10),
    image: (data.image || "").trim(),
    isPublished: data.isPublished !== false,
    status: data.isPublished !== false ? "published" : "draft",
    publishedAt: data.isPublished !== false ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, "gallery", id), payload);
  return { success: true };
}

/**
 * Toggle publish status of a gallery image
 */
export async function toggleGalleryPublish(id, isPublished) {
  if (!firebaseReady || id.startsWith("gallery_local_")) {
    throw new Error("This gallery photo is not synced to Firestore and cannot be updated.");
  }

  await updateDoc(doc(db, "gallery", id), {
    isPublished,
    status: isPublished ? "published" : "draft",
    publishedAt: isPublished ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
  return { success: true };
}

/**
 * Delete a gallery image
 */
export async function deleteGalleryImage(id) {
  if (!firebaseReady || id.startsWith("gallery_local_")) {
    throw new Error("This gallery photo is not synced to Firestore and cannot be deleted.");
  }

  await deleteDoc(doc(db, "gallery", id));
  return { success: true };
}
