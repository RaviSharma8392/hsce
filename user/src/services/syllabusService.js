import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

/**
 * Built-in Core B.Ed. Syllabus Items (Combined 1st & 2nd Year by Academic Year)
 */
export const defaultSyllabusItems = [
  {
    id: "bed_2026_27",
    year: "2026-27",
    session: "2026-27",
    title: "B.Ed. Syllabus (2026-27)",
    hiTitle: "बी.एड. पाठ्यक्रम (2026-27)",
    subtitle: "Combined 1st & 2nd Year Complete Curriculum",
    code: "BED-2026-27",
    credits: "96 Credits (Combined 2 Years)",
    pdfUrl: "https://www.ncte.gov.in/website/PDF/Curriculum_Framework_Two_Year_B.Ed.pdf",
    description: "Official Two-Year Combined B.Ed. Curriculum Framework for Academic Session 2026-27.",
    isPublished: true,
    isCore: true,
  },
  {
    id: "bed_2025_26",
    year: "2025-26",
    session: "2025-26",
    title: "B.Ed. Syllabus (2025-26)",
    hiTitle: "बी.एड. पाठ्यक्रम (2025-26)",
    subtitle: "Combined 1st & 2nd Year Complete Curriculum",
    code: "BED-2025-26",
    credits: "96 Credits (Combined 2 Years)",
    pdfUrl: "https://www.ncte.gov.in/website/PDF/Curriculum_Framework_Two_Year_B.Ed.pdf",
    description: "Official Two-Year Combined B.Ed. Curriculum Framework for Academic Session 2025-26.",
    isPublished: true,
    isCore: true,
  },
  {
    id: "bed_2024_25",
    year: "2024-25",
    session: "2024-25",
    title: "B.Ed. Syllabus (2024-25)",
    hiTitle: "बी.एड. पाठ्यक्रम (2024-25)",
    subtitle: "Combined 1st & 2nd Year Complete Curriculum",
    code: "BED-2024-25",
    credits: "96 Credits (Combined 2 Years)",
    pdfUrl: "https://www.ncte.gov.in/website/PDF/Curriculum_Framework_Two_Year_B.Ed.pdf",
    description: "Official Two-Year Combined B.Ed. Curriculum Framework for Academic Session 2024-25.",
    isPublished: true,
    isCore: true,
  },
  {
    id: "bed_2023_24",
    year: "2023-24",
    session: "2023-24",
    title: "B.Ed. Syllabus (2023-24)",
    hiTitle: "बी.एड. पाठ्यक्रम (2023-24)",
    subtitle: "Combined 1st & 2nd Year Complete Curriculum",
    code: "BED-2023-24",
    credits: "96 Credits (Combined 2 Years)",
    pdfUrl: "https://www.ncte.gov.in/website/PDF/Curriculum_Framework_Two_Year_B.Ed.pdf",
    description: "Official Two-Year Combined B.Ed. Curriculum Framework for Academic Session 2023-24.",
    isPublished: true,
    isCore: true,
  },
  {
    id: "bed_2022_23",
    year: "2022-23",
    session: "2022-23",
    title: "B.Ed. Syllabus (2022-23)",
    hiTitle: "बी.एड. पाठ्यक्रम (2022-23)",
    subtitle: "Combined 1st & 2nd Year Complete Curriculum",
    code: "BED-2022-23",
    credits: "96 Credits (Combined 2 Years)",
    pdfUrl: "https://www.ncte.gov.in/website/PDF/Curriculum_Framework_Two_Year_B.Ed.pdf",
    description: "Official Two-Year Combined B.Ed. Curriculum Framework for Academic Session 2022-23.",
    isPublished: true,
    isCore: true,
  },
];

function mergePublishedSyllabusItems(remoteItems) {
  const map = new Map();

  defaultSyllabusItems.forEach((item) => map.set(item.id, item));

  remoteItems.forEach((item) => {
    const yearLabel = item.year || item.session || "Session";
    map.set(item.id, {
      ...map.get(item.id),
      ...item,
      year: yearLabel,
      title: item.title || `B.Ed. Syllabus (${yearLabel})`,
      pdfUrl: item.pdfUrl || item.url || item.fileUrl || "",
    });
  });

  return Array.from(map.values());
}

function publishedSyllabusQuery() {
  return query(
    collection(db, "syllabus"),
    where("isPublished", "==", true),
    orderBy("createdAt", "desc"),
  );
}

export function subscribeToPublishedSyllabus(callback, onError) {
  if (!firebaseReady) {
    callback(defaultSyllabusItems);
    return () => {};
  }

  return onSnapshot(
    publishedSyllabusQuery(),
    { includeMetadataChanges: true },
    (snapshot) => {
      if (snapshot.metadata.fromCache) {
        callback(defaultSyllabusItems);
        return;
      }

      const remoteItems = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        isBackend: true,
      }));
      callback(mergePublishedSyllabusItems(remoteItems));
    },
    (error) => {
      console.error("Firestore syllabus subscription error:", error);
      onError?.(error);
      callback(defaultSyllabusItems);
    }
  );
}
