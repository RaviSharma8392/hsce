import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

/**
 * Submit student complaint / grievance to Firestore
 */
export async function submitGrievance(data) {
  if (!firebaseReady) {
    throw new Error("The grievance form is not configured. Please try again later.");
  }
  const timestamp = new Date();
  const formattedDate = timestamp.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const grievanceId = `GRV-${Date.now().toString().slice(-6)}`;

  const payload = {
    grievanceId,
    name: (data.name || "").trim(),
    rollNo: (data.rollNo || "N/A").trim(),
    phone: (data.phone || "").trim(),
    email: (data.email || "").trim(),
    category: (data.category || "Student Grievance Redressal Committee").trim(),
    subject: (data.subject || "").trim(),
    description: (data.description || "").trim(),
    status: "new", // 'new' | 'under-review' | 'resolved'
    source: "website_grievance_portal",
    createdAtFormatted: formattedDate,
    createdAtMs: timestamp.getTime(),
  };

  const docRef = await addDoc(collection(db, "grievances"), {
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
    grievanceId,
    id: localRecord.id,
    record: localRecord,
  };
}
