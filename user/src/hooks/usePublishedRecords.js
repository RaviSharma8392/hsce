import { useEffect, useState } from "react";
import { firebaseReady } from "../config/firebaseOptions";

export async function fetchPublishedRecords(
  collectionName,
  { limitCount = 20, orderByField, orderDirection = "desc" } = {},
) {
  if (!firebaseReady) return [];

  try {
    const { getLazyFirestore } = await import("../config/firebaseLazy");
    const { db, firestore } = await getLazyFirestore();
    const constraints = [firestore.where("isPublished", "==", true)];
    if (orderByField) {
      constraints.push(firestore.orderBy(orderByField, orderDirection));
    }
    constraints.push(firestore.limit(limitCount));
    const snapshot = await firestore.getDocs(
      firestore.query(
        firestore.collection(db, collectionName),
        ...constraints,
      ),
    );
    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
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
    return snapshot.empty
      ? null
      : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (error) {
    console.warn(`Could not fetch published ${collectionName} record:`, error);
    return null;
  }
}

export async function fetchPublishedRecordById(collectionName, recordId) {
  if (!firebaseReady || !recordId) return null;

  try {
    const { getLazyFirestore } = await import("../config/firebaseLazy");
    const { db, firestore } = await getLazyFirestore();
    const snapshot = await firestore.getDoc(
      firestore.doc(db, collectionName, recordId),
    );
    const data = snapshot.data();
    return snapshot.exists() && data?.isPublished === true
      ? { id: snapshot.id, ...data }
      : null;
  } catch (error) {
    console.warn(`Could not fetch published ${collectionName} record ${recordId}:`, error);
    return null;
  }
}

export function invalidatePublishedRecords() {
  // Maintained for backward compatibility; snapshots are always live
}

/**
 * Real-time reactive hook for published records.
 * Uses onSnapshot so changes made in the admin portal reflect immediately
 * without showing stale cached data and without disruptive window auto-refreshes.
 */
export function usePublishedRecords(collectionName, fallback = [], options = {}) {
  const limitCount = options.limitCount ?? 20;
  const orderByField = options.orderByField;
  const orderDirection = options.orderDirection ?? "desc";
  const [records, setRecords] = useState(fallback);

  useEffect(() => {
    if (!firebaseReady || !collectionName) {
      setRecords(fallback);
      return undefined;
    }

    let active = true;
    let unsubscribe;

    const subscribe = async () => {
      const { getLazyFirestore } = await import("../config/firebaseLazy");
      const { db, firestore } = await getLazyFirestore();
      if (!active) return;

      const constraints = [firestore.where("isPublished", "==", true)];
      if (orderByField) {
        constraints.push(firestore.orderBy(orderByField, orderDirection));
      }
      constraints.push(firestore.limit(limitCount));
      const q = firestore.query(
        firestore.collection(db, collectionName),
        ...constraints,
      );

      unsubscribe = firestore.onSnapshot(
        q,
        (snapshot) => {
          const liveRecords = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }));
          setRecords(liveRecords.length > 0 ? liveRecords : fallback);
        },
        (error) => {
          console.warn(`Firestore listener on ${collectionName}:`, error);
          setRecords(fallback);
        },
      );
    };

    subscribe().catch((error) => {
      console.warn(
        `Could not initialize Firestore listener on ${collectionName}:`,
        error,
      );
      if (active) setRecords(fallback);
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [collectionName, limitCount, orderByField, orderDirection]);

  return records;
}

export function displayDate(value) {
  if (!value) return "";
  const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN");
}
