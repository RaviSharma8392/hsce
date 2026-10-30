import { useEffect, useState } from "react";
import { firebaseReady } from "../config/firebaseOptions";

// In-memory cache + sessionStorage cache to minimize Firestore read costs
const recordsCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache TTL

function getCachedRecords(cacheKey) {
  // 1. Check in-memory cache
  const memoryHit = recordsCache.get(cacheKey);
  if (memoryHit && Date.now() - memoryHit.timestamp < CACHE_TTL_MS) {
    return memoryHit.data;
  }

  // 2. Check sessionStorage
  try {
    const raw = sessionStorage.getItem(`hsce_cache_${cacheKey}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        recordsCache.set(cacheKey, { data: parsed.data, timestamp: parsed.timestamp });
        return parsed.data;
      }
    }
  } catch {
    // sessionStorage not available or restricted
  }
  return null;
}

function setCachedRecords(cacheKey, data) {
  const timestamp = Date.now();
  recordsCache.set(cacheKey, { data, timestamp });
  try {
    sessionStorage.setItem(
      `hsce_cache_${cacheKey}`,
      JSON.stringify({ data, timestamp })
    );
  } catch {
    // Ignore quota errors
  }
}

export function invalidatePublishedRecords(collectionName) {
  if (!collectionName) {
    recordsCache.clear();
    try {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("hsce_cache_")) sessionStorage.removeItem(key);
      });
    } catch {}
    return;
  }
  for (const key of recordsCache.keys()) {
    if (key.startsWith(collectionName)) recordsCache.delete(key);
  }
  try {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith(`hsce_cache_${collectionName}`)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch {}
}

export async function fetchPublishedRecords(
  collectionName,
  { limitCount = 20, orderByField, orderDirection = "desc" } = {},
) {
  if (!firebaseReady) return [];

  const cacheKey = `${collectionName}_${limitCount}_${orderByField || ""}_${orderDirection}`;
  const cached = getCachedRecords(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const { getLazyFirestore } = await import("../config/firebaseLazy");
    const { db, firestore } = await getLazyFirestore();
    const constraints = [firestore.where("isPublished", "==", true)];
    if (orderByField) {
      constraints.push(firestore.orderBy(orderByField, orderDirection));
    }
    if (limitCount != null) {
      constraints.push(firestore.limit(limitCount));
    }
    const snapshot = await firestore.getDocs(
      firestore.query(
        firestore.collection(db, collectionName),
        ...constraints,
      ),
    );
    const results = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
    if (results.length > 0) {
      setCachedRecords(cacheKey, results);
    }
    return results;
  } catch (error) {
    console.warn(`Could not fetch published records from ${collectionName}:`, error);
    return [];
  }
}

export async function fetchPublishedRecordByField(
  collectionName,
  fieldName,
  fieldValue,
) {
  if (!firebaseReady || !fieldValue) return null;

  const cacheKey = `${collectionName}_field_${fieldName}_${fieldValue}`;
  const cached = getCachedRecords(cacheKey);
  if (cached) return cached;

  try {
    const { getLazyFirestore } = await import("../config/firebaseLazy");
    const { db, firestore } = await getLazyFirestore();
    const snapshot = await firestore.getDocs(
      firestore.query(
        firestore.collection(db, collectionName),
        firestore.where("isPublished", "==", true),
        firestore.where(fieldName, "==", fieldValue),
        firestore.limit(1),
      ),
    );
    const result = snapshot.empty
      ? null
      : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    if (result) {
      setCachedRecords(cacheKey, result);
    }
    return result;
  } catch (error) {
    console.warn(`Could not fetch published ${collectionName} record:`, error);
    return null;
  }
}

export async function fetchPublishedRecordById(collectionName, recordId) {
  if (!firebaseReady || !recordId) return null;

  const cacheKey = `${collectionName}_id_${recordId}`;
  const cached = getCachedRecords(cacheKey);
  if (cached) return cached;

  try {
    const { getLazyFirestore } = await import("../config/firebaseLazy");
    const { db, firestore } = await getLazyFirestore();
    const snapshot = await firestore.getDoc(
      firestore.doc(db, collectionName, recordId),
    );
    const data = snapshot.data();
    const result =
      snapshot.exists() && data?.isPublished === true
        ? { id: snapshot.id, ...data }
        : null;
    if (result) {
      setCachedRecords(cacheKey, result);
    }
    return result;
  } catch (error) {
    console.warn(`Could not fetch published ${collectionName} record ${recordId}:`, error);
    return null;
  }
}

/**
 * Loads published records once with caching. Returning visitors or internal page
 * transitions serve immediately from memory/session cache, saving Firestore read costs.
 */
export function usePublishedRecords(collectionName, fallback = [], options = {}) {
  const limitCount = options.limitCount ?? 20;
  const orderByField = options.orderByField;
  const orderDirection = options.orderDirection ?? "desc";
  const cacheKey = `${collectionName}_${limitCount}_${orderByField || ""}_${orderDirection}`;

  const [records, setRecords] = useState(() => {
    const cached = getCachedRecords(cacheKey);
    return cached && cached.length > 0 ? cached : fallback;
  });

  useEffect(() => {
    if (!firebaseReady || !collectionName) {
      setRecords(fallback);
      return undefined;
    }

    let active = true;

    // If already populated from cache, no need to trigger extra network read unless force-revalidating
    const cached = getCachedRecords(cacheKey);
    if (cached && cached.length > 0) {
      setRecords(cached);
      return undefined;
    }

    fetchPublishedRecords(collectionName, {
      limitCount,
      orderByField,
      orderDirection,
    })
      .then((loadedRecords) => {
        if (active) {
          setRecords(loadedRecords.length > 0 ? loadedRecords : fallback);
        }
      })
      .catch((error) => {
        console.warn(
          `Could not load published records from ${collectionName}:`,
          error,
        );
        if (active) setRecords(fallback);
      });

    return () => {
      active = false;
    };
  }, [collectionName, limitCount, orderByField, orderDirection, cacheKey]);

  return records;
}

export function displayDate(value) {
  if (!value) return "";
  const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN");
}
