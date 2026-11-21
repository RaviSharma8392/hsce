import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

/**
 * Submit feedback / guestbook query to Firestore
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
    websiteAddress: (data.websiteAddress || "").trim(),
    profession: (data.profession || "").trim(),
    howKnowSite: (data.howKnowSite || "").trim(),
    siteRating: (data.siteRating || "Excellent").trim(),
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

  return {
    success: true,
    feedbackId,
    id: localRecord.id,
    record: localRecord,
  };
}
