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

const LOCAL_STORAGE_KEY = "hsce_gallery_images";

/**
 * Get gallery images from localStorage
 */
export function getLocalGalleryImages() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Error reading local gallery images:", err);
    return [];
  }
}

/**
 * Save gallery images to localStorage
 */
export function setLocalGalleryImages(list) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.warn("Error saving local gallery images:", err);
  }
}

/**
 * Subscribe to gallery images in real-time
 */
export function subscribeToGallery(callback) {
  if (firebaseReady) {
    try {
      const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const remoteList = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            let dateStr = data.date;
            if (!dateStr && data.createdAt) {
              const d = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
              dateStr = d.toISOString().split("T")[0];
            }
            return {
              id: docSnap.id,
              ...data,
              date: dateStr || "2026",
            };
          });

          // Merge with local records
          const localList = getLocalGalleryImages();
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

          setLocalGalleryImages(combined);
          callback(combined);
        },
        (error) => {
          console.warn("Firestore gallery subscription error, falling back to local storage:", error);
          callback(getLocalGalleryImages());
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn("Firestore gallery listener setup error:", e);
      callback(getLocalGalleryImages());
      return () => {};
    }
  }

  // Fallback to localStorage
  callback(getLocalGalleryImages());
  const handleStorage = () => callback(getLocalGalleryImages());
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

/**
 * Add / Upload a new image to gallery
 * @param {Object} data
 */
export async function addGalleryImage(data, currentUser = null) {
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

  let firestoreDocId = null;

  if (firebaseReady) {
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
      firestoreDocId = docRef.id;
  }

  const localRecord = {
    ...payload,
    id: firestoreDocId || `gallery_local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: timestamp.toISOString(),
  };

  const list = getLocalGalleryImages();
  list.unshift(localRecord);
  setLocalGalleryImages(list);

  return { success: true, id: localRecord.id, record: localRecord };
}

export async function updateGalleryImage(id, data) {
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

  if (firebaseReady && !id.startsWith("gallery_local_")) {
    await updateDoc(doc(db, "gallery", id), payload);
  }

  const list = getLocalGalleryImages();
  const index = list.findIndex((item) => item.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...payload };
    setLocalGalleryImages(list);
  }
  return { success: true };
}

/**
 * Toggle publish status of a gallery image
 */
export async function toggleGalleryPublish(id, isPublished) {
  if (firebaseReady && !id.startsWith("gallery_local_")) {
    const ref = doc(db, "gallery", id);
    await updateDoc(ref, {
      isPublished,
      status: isPublished ? "published" : "draft",
      publishedAt: isPublished ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    });
  }

  const list = getLocalGalleryImages();
  const idx = list.findIndex((item) => item.id === id);
  if (idx !== -1) {
    list[idx] = {
      ...list[idx],
      isPublished,
      status: isPublished ? "published" : "draft",
    };
    setLocalGalleryImages(list);
  }

  return { success: true };
}

/**
 * Delete a gallery image
 */
export async function deleteGalleryImage(id) {
  if (firebaseReady && !id.startsWith("gallery_local_")) {
    const ref = doc(db, "gallery", id);
    await deleteDoc(ref);
  }

  const list = getLocalGalleryImages().filter((item) => item.id !== id);
  setLocalGalleryImages(list);
  return { success: true };
}
