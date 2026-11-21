import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

/**
 * Submit a student chatbot enquiry to Firestore
 * @param {Object} data
 * @param {string} data.name - Student Name
 * @param {string} data.phone - Phone / WhatsApp Number
 * @param {string} [data.email] - Email
 * @param {string} [data.course] - Course of interest (B.Ed., D.El.Ed., etc.)
 * @param {string} [data.city] - Location / City
 * @param {string} [data.query] - Message or enquiry question
 * @param {string} [data.source] - "website_chatbot"
 */
export async function submitStudentEnquiry(data) {
  if (!firebaseReady) {
    throw new Error("The enquiry service is not configured. Please try again later.");
  }
  const timestamp = new Date();
  const formattedDate = timestamp.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const enquiryPayload = {
    name: (data.name || "").trim(),
    phone: (data.phone || "").trim(),
    email: (data.email || "").trim(),
    course: (data.course || "B.Ed. (2-Year Regular)").trim(),
    city: (data.city || "").trim(),
    query: (data.query || "Chatbot Enquiry & Callback Request").trim(),
    source: data.source || "website_chatbot",
    ...(typeof data.contactConsent === "boolean"
      ? { contactConsent: data.contactConsent }
      : {}),
    status: "new", // 'new' | 'contacted' | 'in-progress' | 'enrolled' | 'closed'
    staffNotes: "",
    createdAtFormatted: formattedDate,
    createdAtMs: timestamp.getTime(),
  };

  const docRef = await addDoc(collection(db, "studentEnquiries"), {
    ...enquiryPayload,
    createdAt: serverTimestamp(),
  });

  const localRecord = {
    ...enquiryPayload,
    id: docRef.id,
    createdAt: timestamp.toISOString(),
  };

  return {
    success: true,
    id: localRecord.id,
    record: localRecord,
  };
}

export const submitEnquiry = submitStudentEnquiry;

