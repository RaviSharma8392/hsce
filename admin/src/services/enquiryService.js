import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

const ENQUIRY_SOURCES = {
  admission: ["admission_modal", "course_page_enquiry", "website_enquiry_page"],
  chatbot: ["website_chatbot", "chatbot_button_enquiry"],
};

export function isChatbotEnquiry(item) {
  return ENQUIRY_SOURCES.chatbot.includes(item?.source);
}

/**
 * Real-time subscription to student chatbot enquiries
 * Returns unsubscribe function
 */
export function subscribeToEnquiries(
  callback,
  { categories = [] } = {},
) {
  const requestedCategories = [...new Set(categories)];
  const allowedSources = requestedCategories.flatMap(
    (category) => ENQUIRY_SOURCES[category] || [],
  );
  const filterForCategories = (items) =>
    items.filter((item) => allowedSources.includes(item?.source));

  if (allowedSources.length === 0) {
    callback([]);
    return () => {};
  }

  if (!firebaseReady) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, "studentEnquiries"),
    where("source", "in", allowedSources),
    orderBy("createdAt", "desc"),
    limit(150)
  );

  return onSnapshot(
    q,
    { includeMetadataChanges: true },
    (snapshot) => {
      if (snapshot.metadata.fromCache) {
        callback([]);
        return;
      }

      const remoteList = snapshot.docs.map((d) => {
        const data = d.data();
        let dateStr = data.createdAtFormatted;
        if (!dateStr && data.createdAt) {
          const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          dateStr = date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        }
        return {
          id: d.id,
          ...data,
          createdAtFormatted: dateStr || "Recent",
        };
      });

      callback(filterForCategories(remoteList));
    },
    (error) => {
      console.error("Firestore enquiries subscription error:", error);
      callback([]);
    }
  );
}

/**
 * Update enquiry status or staff notes
 */
export async function updateEnquiry(id, updates) {
  if (!firebaseReady || id.startsWith("local_")) {
    throw new Error("This enquiry is not synced to Firestore and cannot be updated.");
  }

  const ref = doc(db, "studentEnquiries", id);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
  return true;
}

/**
 * Delete enquiry from Firestore
 */
export async function deleteEnquiry(id) {
  if (!firebaseReady || id.startsWith("local_")) {
    throw new Error("This enquiry is not synced to Firestore and cannot be deleted.");
  }

  await deleteDoc(doc(db, "studentEnquiries", id));
  return true;
}

// =========================================================================
// STUDENT GRIEVANCES & COMPLAINTS
// =========================================================================
export function subscribeToGrievances(callback) {
  if (!firebaseReady) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, "grievances"),
    orderBy("createdAt", "desc"),
    limit(150)
  );
  return onSnapshot(
    q,
    { includeMetadataChanges: true },
    (snapshot) => {
      callback(
        snapshot.metadata.fromCache
          ? []
          : snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    },
    (error) => {
      console.error("Firestore grievances subscription error:", error);
      callback([]);
    }
  );
}

export async function updateGrievanceStatus(id, status, notes = "") {
  if (!firebaseReady || id.startsWith("local_")) {
    throw new Error("This grievance is not synced to Firestore and cannot be updated.");
  }

  await updateDoc(doc(db, "grievances", id), {
    status,
    adminNotes: notes,
    updatedAt: serverTimestamp(),
  });
  return true;
}

export async function deleteGrievance(id) {
  if (!firebaseReady || id.startsWith("local_")) {
    throw new Error("This grievance is not synced to Firestore and cannot be deleted.");
  }

  await deleteDoc(doc(db, "grievances", id));
  return true;
}

// =========================================================================
// CONTACT FEEDBACK & GUESTBOOK
// =========================================================================
export function subscribeToFeedback(callback) {
  if (!firebaseReady) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, "contactFeedback"),
    orderBy("createdAt", "desc"),
    limit(150)
  );
  return onSnapshot(
    q,
    { includeMetadataChanges: true },
    (snapshot) => {
      callback(
        snapshot.metadata.fromCache
          ? []
          : snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    },
    (error) => {
      console.error("Firestore feedback subscription error:", error);
      callback([]);
    }
  );
}

export async function updateFeedbackStatus(id, status, notes = "") {
  if (!firebaseReady || id.startsWith("local_")) {
    throw new Error("This feedback record is not synced to Firestore and cannot be updated.");
  }

  await updateDoc(doc(db, "contactFeedback", id), {
    status,
    adminNotes: notes,
    updatedAt: serverTimestamp(),
  });
  return true;
}

export async function deleteFeedback(id) {
  if (!firebaseReady || id.startsWith("local_")) {
    throw new Error("This feedback record is not synced to Firestore and cannot be deleted.");
  }

  await deleteDoc(doc(db, "contactFeedback", id));
  return true;
}

