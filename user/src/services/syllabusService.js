import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

const LOCAL_STORAGE_KEY = "hsce_syllabus_items";

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

/**
 * Get locally stored syllabus items
 */
export function getLocalSyllabusItems() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Error reading local syllabus items:", err);
    return [];
  }
}

/**
 * Fetch all syllabus items (combining Firestore + localStorage + core seed)
 */
export async function fetchAllSyllabusItems() {
  let remoteItems = [];

  if (firebaseReady) {
    try {
      try {
        const q = query(collection(db, "syllabus"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        remoteItems = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          isBackend: true,
        }));
      } catch {
        const snapshot = await getDocs(collection(db, "syllabus"));
        remoteItems = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          isBackend: true,
        }));
      }
    } catch (err) {
      console.warn("Firestore syllabus fetch error:", err);
    }
  }

  // Also read locally uploaded syllabus items
  const localItems = getLocalSyllabusItems();

  const map = new Map();

  // Add default core items
  defaultSyllabusItems.forEach((item) => map.set(item.id, item));

  // Override / append with backend items
  remoteItems.forEach((item) => {
    if (item.isPublished === false) {
      map.delete(item.id);
      return;
    }

    const yearLabel = item.year || item.session || "Session";
    map.set(item.id, {
      ...map.get(item.id),
      ...item,
      year: yearLabel,
      title: item.title || `B.Ed. Syllabus (${yearLabel})`,
      pdfUrl: item.pdfUrl || item.url || item.fileUrl || "",
    });
  });

  // Append local offline items
  localItems.forEach((item) => {
    if (item.isPublished === false) {
      map.delete(item.id);
      return;
    }

    if (map.has(item.id)) return;

    const yearLabel = item.year || item.session || "Session";
    map.set(item.id, {
      ...item,
      year: yearLabel,
      title: item.title || `B.Ed. Syllabus (${yearLabel})`,
      pdfUrl: item.pdfUrl || item.url || item.fileUrl || "",
    });
  });

  return Array.from(map.values());
}
