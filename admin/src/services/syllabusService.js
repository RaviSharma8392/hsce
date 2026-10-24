import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

const LOCAL_STORAGE_KEY = "hsce_syllabus_items";

/**
 * Get syllabus items from localStorage
 */
export function getLocalSyllabusItems() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Error reading local syllabus items:", err);
    return [];
  }
}

/**
 * Save syllabus items to localStorage
 */
export function setLocalSyllabusItems(list) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.warn("Error saving local syllabus items:", err);
  }
}

/**
 * Subscribe to syllabus items in real time
 */
export function subscribeToSyllabus(callback) {
  if (firebaseReady) {
    try {
      const q = query(collection(db, "syllabus"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const remoteList = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));

          // Merge with local list
          const localList = getLocalSyllabusItems();
          const mergedMap = new Map();
          remoteList.forEach((item) => mergedMap.set(item.id, item));
          localList.forEach((item) => {
            if (!mergedMap.has(item.id)) mergedMap.set(item.id, item);
          });

          const combined = Array.from(mergedMap.values());
          setLocalSyllabusItems(combined);
          callback(combined);
        },
        (error) => {
          console.warn("Firestore syllabus subscription error, fallback local:", error);
          callback(getLocalSyllabusItems());
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn("Firestore syllabus listener error:", e);
      callback(getLocalSyllabusItems());
      return () => {};
    }
  }

  callback(getLocalSyllabusItems());
  const handleStorage = () => callback(getLocalSyllabusItems());
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

/**
 * Add / Upload a new syllabus item
 */
export async function addSyllabusItem(data, currentUser = null) {
  const timestamp = new Date();
  const isPub = data.isPublished !== false;
  const year = String(data.year || "2026-27").trim();
  const yearKey = year
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const authorName =
    currentUser?.displayName || currentUser?.email || data.author || "Academic Office";
  const authorUid = currentUser?.uid || "staff_admin";

  const payload = {
    title: `B.Ed. Syllabus (${year})`,
    year,
    session: year,
    publicationDate: data.publicationDate || timestamp.toISOString().slice(0, 10),
    pdfUrl: data.pdfUrl || data.url || "",
    isPublished: isPub,
    status: isPub ? "published" : "draft",
    author: authorName,
    authorUid: authorUid,
    createdAtFormatted: timestamp.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    createdAtMs: timestamp.getTime(),
  };

  let firestoreDocId = `syll_local_${yearKey}`;

  if (firebaseReady) {
    firestoreDocId = `bed_${yearKey}`;
    await setDoc(doc(db, "syllabus", firestoreDocId), {
      ...payload,
      publishedAt: isPub ? serverTimestamp() : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  const localRecord = {
    ...payload,
    id: firestoreDocId || `syll_local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: timestamp.toISOString(),
  };

  const list = getLocalSyllabusItems();
  list.unshift(localRecord);
  setLocalSyllabusItems(list);

  return { success: true, id: localRecord.id, record: localRecord };
}

export async function updateSyllabusItem(id, data) {
  if (!id) throw new Error("A syllabus record ID is required.");

  const year = String(data.year || "").trim();
  const pdfUrl = String(data.pdfUrl || "").trim();
  const isPublished = data.isPublished !== false;
  const timestamp = new Date();
  const payload = {
    title: `B.Ed. Syllabus (${year})`,
    year,
    session: year,
    publicationDate: data.publicationDate,
    pdfUrl,
    isPublished,
    status: isPublished ? "published" : "draft",
    updatedAt: timestamp.toISOString(),
  };

  if (firebaseReady && !id.startsWith("syll_local_")) {
    await updateDoc(doc(db, "syllabus", id), {
      ...payload,
      updatedAt: serverTimestamp(),
      publishedAt: isPublished ? serverTimestamp() : null,
    });
  }

  const list = getLocalSyllabusItems();
  const index = list.findIndex((item) => item.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...payload };
    setLocalSyllabusItems(list);
  }

  return { success: true };
}

/**
 * Toggle publish status of a syllabus item
 */
export async function toggleSyllabusPublish(id, isPublished) {
  if (firebaseReady && !id.startsWith("syll_local_")) {
    const ref = doc(db, "syllabus", id);
    await updateDoc(ref, {
      isPublished,
      status: isPublished ? "published" : "draft",
      publishedAt: isPublished ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    });
  }

  const list = getLocalSyllabusItems();
  const idx = list.findIndex((item) => item.id === id);
  if (idx !== -1) {
    list[idx] = {
      ...list[idx],
      isPublished,
      status: isPublished ? "published" : "draft",
    };
    setLocalSyllabusItems(list);
  }

  return { success: true };
}

/**
 * Delete a syllabus item
 */
export async function deleteSyllabusItem(id) {
  if (firebaseReady && !id.startsWith("syll_local_")) {
    const ref = doc(db, "syllabus", id);
    await deleteDoc(ref);
  }

  const list = getLocalSyllabusItems().filter((item) => item.id !== id);
  setLocalSyllabusItems(list);
  return { success: true };
}
