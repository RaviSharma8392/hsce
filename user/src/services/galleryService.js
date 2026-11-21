import {
  collection,
  onSnapshot,
  query,
  limit,
  where,
} from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

function mapGallerySnapshot(snapshot) {
  return snapshot.docs
    .map((docSnap) => {
      const data = docSnap.data();
      let dateStr = data.date;
      if (!dateStr && data.createdAt) {
        const d = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        dateStr = d.toISOString().split("T")[0];
      }
      return {
        id: docSnap.id,
        title: data.title || "",
        category: data.category || "Gallery",
        date: dateStr || "",
        image: data.image || data.imageUrl || "",
        caption: data.caption || data.description || "",
        isPublished: data.isPublished === true,
        isBackend: true,
        createdAtMs: data.createdAt?.toDate
          ? data.createdAt.toDate().getTime()
          : data.createdAtMs || 0,
      };
    })
    .sort((left, right) => right.createdAtMs - left.createdAtMs);
}

export function subscribeToPublishedGallery(
  callback,
  onError,
  { limitCount = 30 } = {},
) {
  if (!firebaseReady) {
    callback([]);
    return () => {};
  }

  const galleryQuery = query(
    collection(db, "gallery"),
    where("isPublished", "==", true),
    limit(limitCount),
  );
  return onSnapshot(
    galleryQuery,
    { includeMetadataChanges: true },
    (snapshot) => {
      if (snapshot.metadata.fromCache) return;
      callback(mapGallerySnapshot(snapshot));
    },
    (error) => {
      console.error("Could not subscribe to published gallery images:", error);
      onError?.(error);
    }
  );
}
