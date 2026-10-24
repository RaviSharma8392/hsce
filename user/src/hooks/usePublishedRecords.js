import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

export async function fetchPublishedRecords(
  collectionName,
  { limitCount = 20, orderByField, orderDirection = "desc" } = {},
) {
  if (!firebaseReady) return [];

  const constraints = [where("isPublished", "==", true)];
  if (orderByField) constraints.push(orderBy(orderByField, orderDirection));
  constraints.push(limit(limitCount));

  try {
    const snapshot = await getDocs(
      query(collection(db, collectionName), ...constraints),
    );
    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  } catch {
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
    const snapshot = await getDocs(
      query(
        collection(db, collectionName),
        where("isPublished", "==", true),
        where(fieldName, "==", fieldValue),
        limit(1),
      ),
    );
    return snapshot.empty
      ? null
      : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch {
    return null;
  }
}

export async function fetchPublishedRecordById(collectionName, recordId) {
  if (!firebaseReady || !recordId) return null;

  try {
    const snapshot = await getDoc(doc(db, collectionName, recordId));
    const data = snapshot.data();
    return snapshot.exists() && data?.isPublished === true
      ? { id: snapshot.id, ...data }
      : null;
  } catch {
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

    const constraints = [where("isPublished", "==", true)];
    if (orderByField) {
      constraints.push(orderBy(orderByField, orderDirection));
    }
    constraints.push(limit(limitCount));

    const q = query(collection(db, collectionName), ...constraints);

    // Set up real-time listener: updates automatically on changes,
    // avoids showing old content, and eliminates window focus/visibility reload triggers
    const unsubscribe = onSnapshot(
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

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [collectionName, limitCount, orderByField, orderDirection]);

  return records;
}

export function displayDate(value) {
  if (!value) return "";
  const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN");
}
