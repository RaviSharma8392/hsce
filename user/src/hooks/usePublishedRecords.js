import { useEffect, useRef, useState } from "react";
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
    if (limitCount != null) {
      constraints.push(firestore.limit(limitCount));
    }

    const snapshot = await firestore.getDocsFromServer(
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
    const snapshot = await firestore.getDocsFromServer(
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
    const snapshot = await firestore.getDocFromServer(
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

export function usePublishedRecords(collectionName, fallback = [], options = {}) {
  const limitCount = options.limitCount ?? 20;
  const orderByField = options.orderByField;
  const orderDirection = options.orderDirection ?? "desc";
  const subscriptionKey = JSON.stringify([
    collectionName,
    limitCount,
    orderByField,
    orderDirection,
  ]);
  const fallbackRef = useRef(fallback);
  useEffect(() => {
    fallbackRef.current = fallback;
  }, [fallback]);
  const [subscriptionResult, setSubscriptionResult] = useState(null);
  const records =
    subscriptionResult?.key === subscriptionKey
      ? subscriptionResult.records
      : fallback;

  useEffect(() => {
    if (!firebaseReady || !collectionName) return undefined;

    let active = true;
    let unsubscribe;

    const subscribe = async () => {
      try {
        const { getLazyFirestore } = await import("../config/firebaseLazy");
        const { db, firestore } = await getLazyFirestore();
        if (!active) return;

        const constraints = [firestore.where("isPublished", "==", true)];
        if (orderByField) {
          constraints.push(firestore.orderBy(orderByField, orderDirection));
        }
        if (limitCount != null) {
          constraints.push(firestore.limit(limitCount));
        }
        const recordsQuery = firestore.query(
          firestore.collection(db, collectionName),
          ...constraints,
        );
        const stop = firestore.onSnapshot(
          recordsQuery,
          { includeMetadataChanges: true },
          (snapshot) => {
            if (!active) return;
            if (snapshot.metadata.fromCache) {
              setSubscriptionResult({
                key: subscriptionKey,
                records: fallbackRef.current,
              });
              return;
            }

            const loadedRecords = snapshot.docs.map((item) => ({
              id: item.id,
              ...item.data(),
            }));
            setSubscriptionResult({
              key: subscriptionKey,
              records:
                loadedRecords.length > 0 ? loadedRecords : fallbackRef.current,
            });
          },
          (error) => {
            console.warn(
              `Could not subscribe to published records from ${collectionName}:`,
              error,
            );
            if (active) {
              setSubscriptionResult({
                key: subscriptionKey,
                records: fallbackRef.current,
              });
            }
          },
        );

        if (active) unsubscribe = stop;
        else stop();
      } catch (error) {
        console.error(
          `Could not subscribe to published records from ${collectionName}:`,
          error,
        );
        if (active) {
          setSubscriptionResult({
            key: subscriptionKey,
            records: fallbackRef.current,
          });
        }
      }
    };

    subscribe();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [collectionName, limitCount, orderByField, orderDirection, subscriptionKey]);

  return records;
}

export function displayDate(value) {
  if (!value) return "";
  const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN");
}
