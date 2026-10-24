import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

const LOCAL_STORAGE_KEY = "hsce_contact_feedback";

/**
 * Get feedback stored in localStorage (offline / backup)
 */
export function getLocalFeedback() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Error reading local feedback:", err);
    return [];
  }
}

/**
 * Save feedback to localStorage
 */
function saveLocalFeedback(record) {
  try {
    const list = getLocalFeedback();
    list.unshift(record);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.warn("Error saving local feedback:", err);
  }
}

/**
 * Submit feedback / guestbook query to Firestore and localStorage
 */
export async function submitFeedback(data) {
  if (!firebaseReady) {
    throw new Error("The contact form is not configured. Please try again later.");
  }
  const timestamp = new Date();
  const formattedDate = timestamp.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const feedbackId = `FB-${Date.now().toString().slice(-6)}`;

  const payload = {
    feedbackId,
    name: (data.name || "").trim(),
    phone: (data.phone || "").trim(),
    email: (data.email || "").trim(),
    category: (data.category || "General Feedback").trim(),
    subject: (data.subject || "").trim(),
    message: (data.message || "").trim(),
    status: "new",
    source: "website_contact_guestbook",
    createdAtFormatted: formattedDate,
    createdAtMs: timestamp.getTime(),
  };

  const docRef = await addDoc(collection(db, "contactFeedback"), {
    ...payload,
    createdAt: serverTimestamp(),
  });

  const localRecord = {
    ...payload,
    id: docRef.id,
    createdAt: timestamp.toISOString(),
  };

  saveLocalFeedback(localRecord);

  return {
    success: true,
    feedbackId,
    id: localRecord.id,
    record: localRecord,
  };
}
