import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

/**
 * Submit a Campus Tour Booking to Firestore
 * @param {Object} data
 */
export async function submitTourBooking(data) {
  if (!firebaseReady) {
    throw new Error("The campus tour service is not configured. Please try again later.");
  }
  const timestamp = new Date();
  const formattedDate = timestamp.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const year = timestamp.getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingReference = `HSCE-TR-${year}-${randomSuffix}`;

  const tourPayload = {
    bookingReference,
    // Step 1: Candidate & Guardian
    candidateName: (data.candidateName || "").trim(),
    candidatePhone: (data.candidatePhone || "").trim(),
    candidateEmail: (data.candidateEmail || "").trim(),
    guardianName: (data.guardianName || "").trim(),
    guardianPhone: (data.guardianPhone || data.candidatePhone || "").trim(),
    relationship: data.relationship || "Parent",
    city: (data.city || "").trim(),

    // Step 2: Academic & Graduation Details
    programme: "B.Ed. (Bachelor of Education — 2-Year Regular)",
    graduationStatus: data.graduationStatus || "Passed Graduation",
    graduationDegree: data.graduationDegree || "B.A. / B.Sc. / B.Com.",
    graduationPercentage: (data.graduationPercentage || "").trim(),
    previousCollege: (data.previousCollege || "").trim(),
    pedagogyInterests: Array.isArray(data.pedagogyInterests) ? data.pedagogyInterests : [],

    // Step 3: Tour Schedule & Preferences
    preferredDate: data.preferredDate || "",
    preferredTimeSlot: data.preferredTimeSlot || "Morning (10:00 AM – 12:00 PM)",
    visitorsCount: Number(data.visitorsCount) || 2,
    facilitiesToInspect: Array.isArray(data.facilitiesToInspect) ? data.facilitiesToInspect : [],
    specialNotes: (data.specialNotes || "").trim(),

    // Metadata
    status: "pending", // 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled'
    staffNotes: "",
    source: "website_book_a_tour",
    createdAtFormatted: formattedDate,
    createdAtMs: timestamp.getTime(),
  };

  const docRef = await addDoc(collection(db, "campusTours"), {
    ...tourPayload,
    createdAt: serverTimestamp(),
  });

  const localRecord = {
    ...tourPayload,
    id: docRef.id,
    createdAt: timestamp.toISOString(),
  };

  return {
    success: true,
    bookingReference,
    id: localRecord.id,
    record: localRecord,
  };
}
