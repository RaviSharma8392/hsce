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

/**
 * Subscribe to syllabus items in real time
 */
export function subscribeToSyllabus(callback, onError) {
  if (!firebaseReady) {
    onError?.(new Error("The syllabus service is not connected to Firestore."));
    return () => {};
  }

  const q = query(collection(db, "syllabus"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    { includeMetadataChanges: true },
    (snapshot) => {
      callback(
        snapshot.metadata.fromCache
          ? []
          : snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }))
      );
    },
    (error) => {
      console.error("Firestore syllabus subscription error:", error);
      onError?.(error);
    }
  );
}

/**
 * Add / Upload a new syllabus item
 */
export async function addSyllabusItem(data, currentUser = null) {
  if (!firebaseReady) {
    throw new Error("The syllabus service is not connected to Firestore.");
  }

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

  const firestoreDocId = `bed_${yearKey}`;
  await setDoc(doc(db, "syllabus", firestoreDocId), {
    ...payload,
    publishedAt: isPub ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return {
    success: true,
    id: firestoreDocId,
    record: { ...payload, id: firestoreDocId, createdAt: timestamp.toISOString() },
  };
}

export async function updateSyllabusItem(id, data) {
  if (!id) throw new Error("A syllabus record ID is required.");
  if (!firebaseReady || id.startsWith("syll_local_")) {
    throw new Error("This syllabus record is not synced to Firestore and cannot be updated.");
  }

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

  await updateDoc(doc(db, "syllabus", id), {
    ...payload,
    updatedAt: serverTimestamp(),
    publishedAt: isPublished ? serverTimestamp() : null,
  });

  return { success: true };
}

/**
 * Toggle publish status of a syllabus item
 */
export async function toggleSyllabusPublish(id, isPublished) {
  if (!firebaseReady || id.startsWith("syll_local_")) {
    throw new Error("This syllabus record is not synced to Firestore and cannot be updated.");
  }

  await updateDoc(doc(db, "syllabus", id), {
    isPublished,
    status: isPublished ? "published" : "draft",
    publishedAt: isPublished ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });

  return { success: true };
}

/**
 * Delete a syllabus item
 */
export async function deleteSyllabusItem(id) {
  if (!firebaseReady || id.startsWith("syll_local_")) {
    throw new Error("This syllabus record is not synced to Firestore and cannot be deleted.");
  }

  await deleteDoc(doc(db, "syllabus", id));
  return { success: true };
}
