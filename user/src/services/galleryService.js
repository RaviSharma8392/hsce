import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

const LOCAL_STORAGE_KEY = "hsce_gallery_images";

/**
 * Get locally saved gallery images (offline / fallback sync)
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
 * Fetch gallery images from backend (Firestore collection 'gallery' + localStorage cache)
 * @param {Object} options
 * @param {number} [options.limitCount=30]
 */
export async function fetchBackendGalleryImages({ limitCount = 30 } = {}) {
  let backendImages = [];
  let backendFetchFailed = false;

  if (firebaseReady) {
    try {
      let snapshot;
      try {
        const q = query(
          collection(db, "gallery"),
          where("isPublished", "==", true),
          orderBy("createdAt", "desc"),
          limit(limitCount)
        );
        snapshot = await getDocs(q);
      } catch (orderErr) {
        // Fallback in case of index issues
        console.warn("Ordered gallery query failed, attempting plain collection fetch:", orderErr);
        snapshot = await getDocs(
          query(
            collection(db, "gallery"),
            where("isPublished", "==", true),
            limit(limitCount),
          ),
        );
      }

      backendImages = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        let dateStr = data.date;
        if (!dateStr && data.createdAt) {
          const d = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          dateStr = d.toISOString().split("T")[0];
        }
        return {
          id: docSnap.id,
          title: data.title || "Campus Activity",
          category: data.category || "Campus Life",
          date: dateStr || "2026",
          image: data.image || data.imageUrl || "",
          caption: data.caption || data.description || "",
          isPublished: data.isPublished !== false,
          isBackend: true,
          createdAtMs: data.createdAtMs || (data.createdAt?.toDate ? data.createdAt.toDate().getTime() : 0),
        };
      });
    } catch (err) {
      console.warn("Firestore gallery fetch error, using local storage cache:", err);
      backendFetchFailed = true;
    }
  }

  if (firebaseReady && !backendFetchFailed) {
    return backendImages.filter((image) => image.image && image.isPublished);
  }

  const localList = getLocalGalleryImages().map((item) => ({
    ...item,
    isBackend: true,
  }));

  const mergedMap = new Map();
  backendImages.forEach((img) => {
    if (img.image && img.isPublished) mergedMap.set(img.id, img);
  });
  localList.forEach((img) => {
    if (img.image && img.isPublished && !mergedMap.has(img.id)) {
      mergedMap.set(img.id, img);
    }
  });

  return Array.from(mergedMap.values());
}
