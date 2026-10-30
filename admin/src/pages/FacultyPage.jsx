import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  UsersRound,
  Search,
  Mail,
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  X,
  Upload,
  User,
  ChevronLeft,
  ChevronRight,
  Check,
  RefreshCw,
  Database,
} from "lucide-react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";
import {
  optimizeCloudinaryImageUrl,
  compressImageFile,
  uploadToCloudinary,
} from "../services/cloudinary";

/* ============================================================== */
/* OFFICIAL SEED TEMPLATES (Used ONLY when user clicks 'Seed')    */
/* (NO static data hardcoded into the displayed list!)           */
/* ============================================================== */
const OFFICIAL_HSCE_SEED_TEMPLATES = [
  {
    id: "fac_savita_rathee",
    name: "Dr. Savita Rathee",
    designation: "Principal",
    staffType: "Teaching Staff",
    department: "Education",
    subject: "Educational Leadership & Teacher Education",
    qualifications: "M.A., M.Ed., Ph.D. in Education",
    email: "hsce.kanjhawala@gmail.com",
    image: "/assets/people/principal-savita-rathee.png",
    imageUrl: "/assets/people/principal-savita-rathee.png",
    isPublished: true,
  },
  {
    id: "fac_rk_sharma",
    name: "Dr. R. K. Sharma",
    designation: "Senior Faculty Coordinator & Professor",
    staffType: "Teaching Staff",
    department: "Education",
    subject: "Pedagogy of Science, Curriculum & Instruction",
    qualifications: "M.Sc., M.Ed., Ph.D.",
    email: "rksharma.hsce@gmail.com",
    imageUrl: "",
    isPublished: true,
  },
  {
    id: "fac_meenakshi_malik",
    name: "Mrs. Meenakshi Malik",
    designation: "Assistant Professor",
    staffType: "Teaching Staff",
    department: "Education",
    subject: "Pedagogy of Social Sciences, Educational Psychology",
    qualifications: "M.A., M.Ed., NET",
    email: "meenakshi.hsce@gmail.com",
    imageUrl: "",
    isPublished: true,
  },
  {
    id: "fac_suman_sharma",
    name: "Mrs. Suman Sharma",
    designation: "Associate Professor",
    staffType: "Teaching Staff",
    department: "Education",
    subject: "Pedagogy of Language, Educational Philosophy",
    qualifications: "M.A. (English), M.Ed., NET",
    email: "sumansharma.hsce@gmail.com",
    imageUrl: "",
    isPublished: true,
  },
  {
    id: "fac_kavita_rani",
    name: "Mrs. Kavita Rani",
    designation: "Assistant Professor",
    staffType: "Teaching Staff",
    department: "Education",
    subject: "Pedagogy of Mathematics, ICT in Education",
    qualifications: "M.Sc. (Maths), M.Ed., NET",
    email: "kavitarani.hsce@gmail.com",
    imageUrl: "",
    isPublished: true,
  },
  {
    id: "fac_sunita_devi",
    name: "Mrs. Sunita Devi",
    designation: "Assistant Professor",
    staffType: "Teaching Staff",
    department: "Education",
    subject: "Assessment for Learning, Gender and Society",
    qualifications: "M.A., M.Ed., NET",
    email: "sunitadevi.hsce@gmail.com",
    imageUrl: "",
    isPublished: true,
  },
  {
    id: "fac_rekha_vats",
    name: "Mrs. Rekha Vats",
    designation: "Assistant Professor",
    staffType: "Teaching Staff",
    department: "Education",
    subject: "Creating an Inclusive School, Environmental Education",
    qualifications: "M.A., M.Ed.",
    email: "rekhavats.hsce@gmail.com",
    imageUrl: "",
    isPublished: true,
  },
  {
    id: "fac_anil_kumar",
    name: "Mr. Anil Kumar",
    designation: "Administrative Officer",
    staffType: "Non-Teaching Staff",
    department: "Administration",
    subject: "Campus Administration & Student Records",
    qualifications: "M.Com., MBA",
    email: "admin.hsce@gmail.com",
    imageUrl: "",
    isPublished: true,
  },
  {
    id: "fac_virender_singh",
    name: "Mr. Virender Singh",
    designation: "Nodal Discipline & Accounts Officer",
    staffType: "Non-Teaching Staff",
    department: "Administration",
    subject: "Accounts, Statutory Filings & Discipline",
    qualifications: "B.Com., SAS",
    email: "",
    imageUrl: "",
    isPublished: true,
  },
  {
    id: "fac_sunita_sharma",
    name: "Mrs. Sunita Sharma",
    designation: "Office Executive",
    staffType: "Non-Teaching Staff",
    department: "Administration",
    subject: "",
    qualifications: "",
    email: "",
    imageUrl: "",
    isPublished: true,
  },
  {
    id: "fac_ram_kishan",
    name: "Mr. Ram Kishan",
    designation: "Head Librarian & Resource In-charge",
    staffType: "Non-Teaching Staff",
    department: "Administration",
    subject: "",
    qualifications: "",
    email: "",
    imageUrl: "",
    isPublished: true,
  },
  {
    id: "fac_mukesh_kumar",
    name: "Mr. Mukesh Kumar",
    designation: "ICT Lab Technician",
    staffType: "Non-Teaching Staff",
    department: "Administration",
    subject: "",
    qualifications: "",
    email: "",
    imageUrl: "",
    isPublished: true,
  },
  {
    id: "fac_sandeep_dabas",
    name: "Mr. Sandeep Dabas",
    designation: "Facility & Maintenance Supervisor",
    staffType: "Non-Teaching Staff",
    department: "Administration",
    subject: "",
    qualifications: "",
    email: "",
    imageUrl: "",
    isPublished: true,
  },
  {
    id: "fac_surender_singh",
    name: "Mr. Surender Singh",
    designation: "Campus Security Officer",
    staffType: "Non-Teaching Staff",
    department: "Administration",
    subject: "",
    qualifications: "",
    email: "",
    imageUrl: "",
    isPublished: true,
  },
  {
    id: "fac_dharamvir",
    name: "Mr. Dharamvir",
    designation: "Office Attendant",
    staffType: "Non-Teaching Staff",
    department: "Administration",
    subject: "",
    qualifications: "",
    email: "",
    imageUrl: "",
    isPublished: true,
  },
];

/* SIMPLIFIED INITIAL FORM - ONLY THE EXACT FIELDS SHOWN IN TABLES */
const INITIAL_FORM = {
  name: "",
  staffType: "Teaching Staff", // "Teaching Staff" or "Non-Teaching Staff"
  designation: "",
  subject: "",
  qualifications: "",
  email: "",
  imageUrl: "",
  isPublished: true,
};

const ITEMS_PER_PAGE = 5;

export default function FacultyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") || "all";

  // 100% PURE DYNAMIC DATA FROM FIRESTORE (NO STATIC HARDCODING IN LIST)
  const [firestoreFaculty, setFirestoreFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(
    tabParam === "teaching" || tabParam === "admin" ? tabParam : "all"
  );
  const [notification, setNotification] = useState("");

  // Pagination states for teaching and admin sections (5 members per page)
  const [teachingPage, setTeachingPage] = useState(1);
  const [adminPage, setAdminPage] = useState(1);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formImageFile, setFormImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Sync tab with URL
  useEffect(() => {
    if (tabParam !== activeTab) {
      if (tabParam === "teaching" || tabParam === "admin" || tabParam === "all") {
        setActiveTab(tabParam);
      }
    }
  }, [tabParam, activeTab]);

  // Reset pagination when active tab or search query changes
  useEffect(() => {
    setTeachingPage(1);
    setAdminPage(1);
  }, [activeTab, searchQuery]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  // Real-time Firestore Subscription (Pure Dynamic Data)
  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, "faculty"),
      (snapshot) => {
        const remote = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setFirestoreFaculty(remote);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore faculty subscription error:", err);
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // ALL FACULTY IS 100% PURE DYNAMIC DATA FROM FIRESTORE
  const allFaculty = firestoreFaculty;

  // Teaching Staff List (Dynamic)
  const teachingStaff = useMemo(() => {
    return allFaculty.filter((f) => {
      const type = (f.staffType || "").toLowerCase();
      const isExplicitNonTeaching =
        type.includes("non") ||
        (f.department || "").toLowerCase().includes("administration");
      if (isExplicitNonTeaching) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return [
          f.name,
          f.designation,
          f.subject,
          f.qualifications || f.qualification,
          f.email,
        ].some((val) => val && String(val).toLowerCase().includes(q));
      }
      return true;
    });
  }, [allFaculty, searchQuery]);

  // Administration Staff List (Dynamic)
  const adminStaff = useMemo(() => {
    return allFaculty.filter((f) => {
      const type = (f.staffType || "").toLowerCase();
      const dept = (f.department || "").toLowerCase();
      const isAdmin =
        type.includes("non") ||
        dept.includes("administration") ||
        dept.includes("accounts");
      if (!isAdmin) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return [
          f.name,
          f.designation,
          f.subject,
          f.qualifications || f.qualification,
          f.email,
        ].some((val) => val && String(val).toLowerCase().includes(q));
      }
      return true;
    });
  }, [allFaculty, searchQuery]);

  // Paginated Slices (5 members per page)
  const totalTeachingPages = Math.max(1, Math.ceil(teachingStaff.length / ITEMS_PER_PAGE));
  const paginatedTeaching = useMemo(() => {
    const start = (teachingPage - 1) * ITEMS_PER_PAGE;
    return teachingStaff.slice(start, start + ITEMS_PER_PAGE);
  }, [teachingStaff, teachingPage]);

  const totalAdminPages = Math.max(1, Math.ceil(adminStaff.length / ITEMS_PER_PAGE));
  const paginatedAdmin = useMemo(() => {
    const start = (adminPage - 1) * ITEMS_PER_PAGE;
    return adminStaff.slice(start, start + ITEMS_PER_PAGE);
  }, [adminStaff, adminPage]);

  // Statistics Counts
  const stats = useMemo(() => {
    const total = allFaculty.length;
    const teaching = allFaculty.filter(
      (f) =>
        !(f.staffType || "").toLowerCase().includes("non") &&
        !(f.department || "").toLowerCase().includes("administration")
    ).length;
    const admin = allFaculty.filter(
      (f) =>
        (f.staffType || "").toLowerCase().includes("non") ||
        (f.department || "").toLowerCase().includes("administration")
    ).length;
    const published = allFaculty.filter((f) => f.isPublished !== false).length;
    return { total, teaching, admin, published };
  }, [allFaculty]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      ...INITIAL_FORM,
      staffType: activeTab === "admin" ? "Non-Teaching Staff" : "Teaching Staff",
    });
    setFormImageFile(null);
    setImagePreview("");
    setFormError("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (member) => {
    setEditingMember(member);
    const isNon =
      (member.staffType || "").toLowerCase().includes("non") ||
      (member.department || "").toLowerCase().includes("administration");

    setFormData({
      name: member.name || "",
      staffType: isNon ? "Non-Teaching Staff" : "Teaching Staff",
      designation: member.designation || member.post || "",
      subject: member.subject || "",
      qualifications: member.qualifications || member.qualification || "",
      email: member.email || "",
      imageUrl: member.imageUrl || member.image || "",
      isPublished: member.isPublished !== false,
    });
    setFormImageFile(null);
    setImagePreview(member.imageUrl || member.image || "");
    setFormError("");
    setIsModalOpen(true);
  };

  // One-click Seed into Firestore (Populates Firestore with real dynamic docs)
  const handleSeedDatabase = async () => {
    if (
      !window.confirm(
        "Import the official 15 HSCE Faculty & Staff profiles into Firestore? Each profile will become a real dynamic database record you can edit and delete."
      )
    ) {
      return;
    }

    setSeeding(true);
    try {
      if (firebaseReady) {
        for (const template of OFFICIAL_HSCE_SEED_TEMPLATES) {
          const docId = template.id;
          await setDoc(
            doc(db, "faculty", docId),
            {
              id: docId,
              name: template.name,
              staffType: template.staffType,
              designation: template.designation,
              department: template.department,
              subject: template.subject || "",
              qualifications: template.qualifications || "",
              qualification: template.qualifications || "",
              email: template.email || "",
              imageUrl: template.imageUrl || "",
              image: template.imageUrl || "",
              isPublished: true,
              status: "published",
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
        showToast("Successfully imported 15 official dynamic records into Firestore.");
      }
    } catch (err) {
      console.error("Seeding error:", err);
      showToast("Error importing official faculty records.");
    } finally {
      setSeeding(false);
    }
  };

  // Instant Optimistic Toggle Publish / Draft
  const handleTogglePublish = async (member) => {
    const newPublished = member.isPublished === false ? true : false;
    const docId = member.id;

    // Optimistic UI Update
    setFirestoreFaculty((prev) =>
      prev.map((f) =>
        f.id === docId ? { ...f, isPublished: newPublished } : f
      )
    );

    showToast(
      newPublished
        ? `Published "${member.name}" on live website.`
        : `Marked "${member.name}" as Draft.`
    );

    try {
      if (firebaseReady) {
        await setDoc(
          doc(db, "faculty", docId),
          {
            ...member,
            isPublished: newPublished,
            status: newPublished ? "published" : "draft",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (e) {
      console.error("Publish toggle error:", e);
      showToast("Error updating publish status.");
    }
  };

  // Instant Optimistic Delete
  const handleDelete = async (member) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${member.name}" from the database?`
      )
    ) {
      return;
    }

    // Optimistic UI Update
    setFirestoreFaculty((prev) => prev.filter((f) => f.id !== member.id));
    showToast(`Deleted "${member.name}" from database.`);

    try {
      if (firebaseReady) {
        await deleteDoc(doc(db, "faculty", member.id));
      }
    } catch (e) {
      console.error("Delete error:", e);
      showToast("Error deleting faculty record.");
    }
  };

  // Submit Simplified Form (Add or Edit) - Minimal Payload
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Staff member name is required.");
      return;
    }
    if (!formData.designation.trim()) {
      setFormError("Designation / Post is required.");
      return;
    }

    setSaving(true);

    try {
      let finalImageUrl = formData.imageUrl;

      // Upload image if file selected - ONLY for Teaching Staff
      const isTeaching = formData.staffType === "Teaching Staff";
      if (isTeaching && formImageFile) {
        try {
          const compressed = await compressImageFile(formImageFile, 800, 0.85);
          const uploadRes = await uploadToCloudinary(formImageFile, {
            folder: "hsce/faculty",
          });
          finalImageUrl = uploadRes?.secure_url || compressed || finalImageUrl;
        } catch (uploadErr) {
          console.warn("Upload fallback to dataUrl:", uploadErr);
          const dataUrl = await compressImageFile(formImageFile, 800, 0.85);
          finalImageUrl = dataUrl || finalImageUrl;
        }
      } else if (!isTeaching) {
        finalImageUrl = "";
      }

      const docId = editingMember
        ? editingMember.id
        : `fac_${Date.now()}`;

      // Simplified clean payload - ONLY the fields shown in tables
      const updatedRecord = {
        id: docId,
        name: formData.name.trim(),
        staffType: formData.staffType,
        designation: formData.designation.trim(),
        department: isTeaching ? "Education" : "Administration",
        subject: formData.subject.trim(),
        qualifications: formData.qualifications.trim(),
        qualification: formData.qualifications.trim(),
        email: formData.email.trim(),
        imageUrl: finalImageUrl || "",
        image: finalImageUrl || "",
        isPublished: formData.isPublished,
        status: formData.isPublished ? "published" : "draft",
        updatedAt: serverTimestamp(),
      };

      // Optimistic Instant UI Update
      setFirestoreFaculty((prev) => {
        const filtered = prev.filter((f) => f.id !== docId);
        return [updatedRecord, ...filtered];
      });

      setIsModalOpen(false);
      showToast(
        editingMember
          ? `Updated profile for "${updatedRecord.name}".`
          : `Added "${updatedRecord.name}" to database.`
      );

      // Async Firestore Save
      if (firebaseReady) {
        await setDoc(doc(db, "faculty", docId), updatedRecord, { merge: true });
      }
    } catch (err) {
      console.error("Save faculty error:", err);
      setFormError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const listToExport =
      activeTab === "teaching"
        ? teachingStaff
        : activeTab === "admin"
        ? adminStaff
        : allFaculty;

    const headers = [
      "ID",
      "Name",
      "Staff Type",
      "Designation",
      "Subject",
      "Qualifications",
      "Email",
      "Status",
    ];

    const rows = listToExport.map((f) => [
      f.id,
      `"${(f.name || "").replace(/"/g, '""')}"`,
      `"${(f.staffType || "").replace(/"/g, '""')}"`,
      `"${(f.designation || "").replace(/"/g, '""')}"`,
      `"${(f.subject || "").replace(/"/g, '""')}"`,
      `"${(f.qualifications || f.qualification || "").replace(/"/g, '""')}"`,
      `"${(f.email || "").replace(/"/g, '""')}"`,
      f.isPublished !== false ? "Published" : "Draft",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `HSCE_Faculty_Staff_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded faculty CSV export.");
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header (Consistent Admin Design) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200 bg-white p-4 sm:p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <UsersRound className="text-[#363991]" size={26} />
              <span>Faculty &amp; Staff Directory</span>
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-[#363991] border border-indigo-100">
              Session 2026-27
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time dynamic faculty and staff records synchronized with public website.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {allFaculty.length === 0 && !loading && (
            <button
              type="button"
              disabled={seeding}
              onClick={handleSeedDatabase}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 text-xs font-bold text-[#363991] transition cursor-pointer"
            >
              <Database size={15} />
              <span>{seeding ? "Importing..." : "Seed Database"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer"
          >
            <FileSpreadsheet size={15} className="text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#363991] hover:bg-[#2A3178] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards (Compact on Mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div
          onClick={() => handleTabChange("all")}
          className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs cursor-pointer hover:border-indigo-300 transition"
        >
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Staff
          </div>
          <div className="text-xl sm:text-3xl font-black text-slate-900 mt-0.5 sm:mt-1">
            {stats.total}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Total in database</div>
        </div>

        <div
          onClick={() => handleTabChange("teaching")}
          className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs cursor-pointer hover:border-indigo-300 transition"
        >
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Teaching Faculty
          </div>
          <div className="text-xl sm:text-3xl font-black text-blue-700 mt-0.5 sm:mt-1">
            {stats.teaching}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Education &amp; Pedagogy</div>
        </div>

        <div
          onClick={() => handleTabChange("admin")}
          className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs cursor-pointer hover:border-indigo-300 transition"
        >
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Administration
          </div>
          <div className="text-xl sm:text-3xl font-black text-purple-700 mt-0.5 sm:mt-1">
            {stats.admin}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Support Staff</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Live on Website
          </div>
          <div className="text-xl sm:text-3xl font-black text-emerald-600 mt-0.5 sm:mt-1">
            {stats.published}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Published status</div>
        </div>
      </div>

      {/* Search & Tabs Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, post, subject, qualifications, or email..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-[#363991] focus:ring-1 focus:ring-[#363991]"
          />
        </div>

        {/* 3 Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer whitespace-nowrap ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Faculty &amp; Staff ({stats.total})
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("teaching")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer whitespace-nowrap ${
              activeTab === "teaching"
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Teaching Faculty ({stats.teaching})
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("admin")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer whitespace-nowrap ${
              activeTab === "admin"
                ? "bg-white text-purple-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Administration ({stats.admin})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="h-8 w-8 rounded-full border-3 border-indigo-100 border-t-[#363991] animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-600">
            Loading dynamic faculty records from Firestore...
          </p>
        </div>
      ) : allFaculty.length === 0 ? (
        /* Empty Database State */
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 text-center px-4">
          <div className="p-3 bg-indigo-50 text-[#363991] rounded-xl mb-3">
            <UsersRound size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No dynamic faculty records in database yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1 mb-5">
            This admin panel shows 100% dynamic Firestore records. You can create a new staff profile or import the 15 official college faculty profiles directly into Firestore.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={seeding}
              onClick={handleSeedDatabase}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#363991] hover:bg-[#2A3178] px-4 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer"
            >
              <Database size={15} />
              <span>{seeding ? "Importing to Firestore..." : "Import Official College Faculty (15 Profiles)"}</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Staff Manually</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ============================================================== */}
          {/* TEACHING FACULTY SECTION (Exact Design from Image 1)           */}
          {/* ============================================================== */}
          {(activeTab === "all" || activeTab === "teaching") && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
              {/* Heading with Solid Blue Underline */}
              <div className="px-5 pt-4 pb-2.5 bg-white border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Education (Teacher Training)
                  </h2>
                  <div className="mt-1 h-0.5 w-12 bg-[#363991] rounded-full" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {teachingStaff.length} Faculty Members
                </span>
              </div>

              {teachingStaff.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No teaching faculty members found in database.
                </div>
              ) : (
                <>
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs font-sans min-w-[700px]">
                      <thead>
                        <tr className="bg-[#1F242C] text-white">
                          <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#333a44] w-[18%]">
                            Photo
                          </th>
                          <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#333a44] w-[34%]">
                            Name and Post
                          </th>
                          <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#333a44] w-[34%]">
                            Occupation
                          </th>
                          <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider text-right w-[14%]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {paginatedTeaching.map((member, idx) => {
                          const photoUrl = member.imageUrl || member.image || "";
                          const qual = member.qualifications || member.qualification || "";
                          return (
                            <tr
                              key={member.id}
                              className={`transition-colors hover:bg-indigo-50/25 ${
                                idx % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"
                              }`}
                            >
                              {/* Photo */}
                              <td className="py-3 px-4 align-top border-r border-slate-200/80">
                                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded border border-slate-200 bg-white p-1 overflow-hidden shadow-2xs">
                                  {photoUrl ? (
                                    <img
                                      src={optimizeCloudinaryImageUrl(photoUrl, 300)}
                                      alt={member.name}
                                      className="w-full h-full object-cover object-top"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                                      <User size={22} />
                                      <span className="text-[9px] font-bold mt-1 tracking-wider text-slate-500">
                                        HSCE
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Name and Post */}
                              <td className="py-3 px-4 align-top border-r border-slate-200/80">
                                <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                                  {member.name}
                                </h4>
                                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                                  {member.designation}
                                </p>
                                {member.subject && (
                                  <p className="text-xs text-slate-500 mt-1 font-normal">
                                    <span className="font-semibold text-slate-700">Subject: </span>
                                    {member.subject}
                                  </p>
                                )}
                                {/* Published Status Toggle */}
                                <div className="mt-2">
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePublish(member)}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer transition ${
                                      member.isPublished !== false
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        member.isPublished !== false
                                          ? "bg-emerald-500"
                                          : "bg-slate-400"
                                      }`}
                                    />
                                    <span>{member.isPublished !== false ? "Published" : "Draft"}</span>
                                  </button>
                                </div>
                              </td>

                              {/* Occupation */}
                              <td className="py-3 px-4 align-top border-r border-slate-200/80 space-y-1 text-xs text-slate-700">
                                <p className="font-semibold text-slate-800 leading-tight">
                                  {member.designation},<br />
                                  <span className="font-normal text-slate-500">
                                    Haryana Shakti College of Education,<br />
                                    Kanjhawala, Delhi
                                  </span>
                                </p>
                                {qual && (
                                  <p className="flex items-center gap-1.5 text-slate-700 pt-0.5 font-medium">
                                    <GraduationCap size={13} className="text-[#363991] shrink-0" />
                                    <span>{qual}</span>
                                  </p>
                                )}
                                {member.email && (
                                  <p className="flex items-center gap-1.5 text-slate-700">
                                    <Mail size={12} className="text-[#363991] shrink-0" />
                                    <a
                                      href={`mailto:${member.email}`}
                                      className="text-blue-700 hover:underline break-all"
                                    >
                                      {member.email}
                                    </a>
                                  </p>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-3 align-top text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEdit(member)}
                                    className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-indigo-50 hover:text-[#363991] hover:border-indigo-200 transition cursor-pointer"
                                    title="Edit Staff Member"
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(member)}
                                    className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
                                    title="Delete Staff Member"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE APP CARDS VIEW (Visible only on mobile screens < lg) */}
                  <div className="block lg:hidden p-3 space-y-3 bg-slate-50/70">
                    {paginatedTeaching.map((member) => {
                      const photoUrl = member.imageUrl || member.image || "";
                      const qual = member.qualifications || member.qualification || "";
                      return (
                        <div
                          key={member.id}
                          className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3 transition active:scale-[0.99]"
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="w-16 h-20 rounded-xl border border-slate-200 bg-slate-50 p-0.5 overflow-hidden shrink-0 shadow-2xs">
                              {photoUrl ? (
                                <img
                                  src={optimizeCloudinaryImageUrl(photoUrl, 300)}
                                  alt={member.name}
                                  className="w-full h-full object-cover object-top rounded-lg"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 rounded-lg">
                                  <User size={22} />
                                  <span className="text-[9px] font-black mt-1 tracking-wider text-slate-500">HSCE</span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1.5">
                                <h4 className="font-bold text-sm text-slate-900 leading-snug">
                                  {member.name}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => handleTogglePublish(member)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 transition cursor-pointer ${
                                    member.isPublished !== false
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                      : "bg-slate-100 text-slate-600 border-slate-200"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      member.isPublished !== false ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                                    }`}
                                  />
                                  <span>{member.isPublished !== false ? "Published" : "Draft"}</span>
                                </button>
                              </div>
                              <p className="text-xs font-bold text-[#363991] mt-0.5">
                                {member.designation}
                              </p>
                              {member.subject && (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                  <span className="font-semibold text-slate-700">Subject: </span>
                                  {member.subject}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="pt-2.5 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                            {qual && (
                              <p className="flex items-center gap-2 text-slate-800 font-medium">
                                <GraduationCap size={14} className="text-[#363991] shrink-0" />
                                <span className="truncate">{qual}</span>
                              </p>
                            )}
                            {member.email && (
                              <p className="flex items-center gap-2 text-slate-700">
                                <Mail size={13} className="text-[#363991] shrink-0" />
                                <a href={`mailto:${member.email}`} className="text-blue-700 font-medium hover:underline truncate">
                                  {member.email}
                                </a>
                              </p>
                            )}
                          </div>

                          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(member)}
                              className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition"
                            >
                              Tap status to {member.isPublished !== false ? "draft" : "publish"}
                            </button>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(member)}
                                className="inline-flex min-h-[36px] items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition cursor-pointer"
                              >
                                <Pencil size={13} />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(member)}
                                className="inline-flex min-h-[36px] items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Teaching Faculty Pagination (5 members per page) */}
                  {teachingStaff.length > ITEMS_PER_PAGE && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
                      <div className="font-medium">
                        Showing <span className="font-bold text-slate-900">{(teachingPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
                        <span className="font-bold text-slate-900">{Math.min(teachingPage * ITEMS_PER_PAGE, teachingStaff.length)}</span> of{" "}
                        <span className="font-bold text-slate-900">{teachingStaff.length}</span> teaching faculty
                        <span className="ml-1.5 px-2 py-0.5 rounded-full bg-blue-100 text-[#2E3A8C] font-bold text-[10px]">
                          5 per page
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={teachingPage <= 1}
                          onClick={() => setTeachingPage((p) => Math.max(1, p - 1))}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        >
                          <ChevronLeft size={13} />
                          <span>Previous</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalTeachingPages }, (_, i) => i + 1).map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setTeachingPage(num)}
                              className={`h-7 min-w-[28px] px-1 text-xs font-bold rounded-md transition cursor-pointer ${
                                teachingPage === num
                                  ? "bg-[#363991] text-white shadow-xs"
                                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          disabled={teachingPage >= totalTeachingPages}
                          onClick={() => setTeachingPage((p) => Math.min(totalTeachingPages, p + 1))}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        >
                          <span>Next</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* ADMINISTRATION SECTION (Exact Design from Image 2)             */}
          {/* ============================================================== */}
          {(activeTab === "all" || activeTab === "admin") && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
              {/* Soft Lavender Header Bar (Image 2) */}
              <div className="bg-[#E4E7F5] px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Administration
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/90 text-slate-700 border border-slate-300">
                  {adminStaff.length} Staff Members
                </span>
              </div>

              {adminStaff.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No administrative staff members found in database.
                </div>
              ) : (
                <>
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs font-sans min-w-[700px]">
                      <thead>
                        <tr className="bg-[#1F242C] text-white">
                          <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#333a44] w-[32%]">
                            Name
                          </th>
                          <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#333a44] w-[34%]">
                            Designation
                          </th>
                          <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#333a44] w-[20%]">
                            Department &amp; Qualifications
                          </th>
                          <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider text-right w-[14%]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {paginatedAdmin.map((staff, idx) => {
                          const qual = staff.qualifications || staff.qualification || "";
                          return (
                            <tr
                              key={staff.id}
                              className={`transition-colors hover:bg-purple-50/25 ${
                                idx % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"
                              }`}
                            >
                              {/* Name */}
                              <td className="py-3 px-4 align-top border-r border-slate-200/80">
                                <span className="font-bold text-slate-900 block text-sm">
                                  {staff.name}
                                </span>
                                {staff.email ? (
                                  <a
                                    href={`mailto:${staff.email}`}
                                    className="text-xs text-blue-700 hover:underline block mt-0.5"
                                  >
                                    {staff.email}
                                  </a>
                                ) : (
                                  <span className="text-xs text-slate-400 italic block mt-0.5">
                                    No email listed
                                  </span>
                                )}
                                {/* Published status */}
                                <div className="mt-2">
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePublish(staff)}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer transition ${
                                      staff.isPublished !== false
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        staff.isPublished !== false
                                          ? "bg-emerald-500"
                                          : "bg-slate-400"
                                      }`}
                                    />
                                    <span>{staff.isPublished !== false ? "Published" : "Draft"}</span>
                                  </button>
                                </div>
                              </td>

                              {/* Designation */}
                              <td className="py-3 px-4 align-top border-r border-slate-200/80">
                                <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                                  {staff.designation}
                                </span>
                                {staff.subject && (
                                  <span className="block text-xs font-normal text-slate-500 mt-0.5">
                                    {staff.subject}
                                  </span>
                                )}
                              </td>

                              {/* Department & Qualifications */}
                              <td className="py-3 px-4 align-top border-r border-slate-200/80 text-xs">
                                {qual ? (
                                  <span className="font-medium text-slate-800 flex items-center gap-1.5">
                                    <GraduationCap size={13} className="text-[#363991] shrink-0" />
                                    <span>{qual}</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic">Staff</span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-3 align-top text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEdit(staff)}
                                    className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-indigo-50 hover:text-[#363991] hover:border-indigo-200 transition cursor-pointer"
                                    title="Edit Staff Member"
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(staff)}
                                    className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
                                    title="Delete Staff Member"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE APP CARDS VIEW (Visible only on mobile screens < lg) */}
                  <div className="block lg:hidden p-3 space-y-3 bg-slate-50/70">
                    {paginatedAdmin.map((staff) => {
                      const qual = staff.qualifications || staff.qualification || "";
                      return (
                        <div
                          key={staff.id}
                          className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3 transition active:scale-[0.99]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-slate-900 leading-snug">
                                {staff.name}
                              </h4>
                              <p className="text-xs font-bold text-purple-700 mt-0.5">
                                {staff.designation}
                              </p>
                              {staff.subject && (
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                  {staff.subject}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(staff)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 transition cursor-pointer ${
                                staff.isPublished !== false
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  staff.isPublished !== false ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                                }`}
                              />
                              <span>{staff.isPublished !== false ? "Published" : "Draft"}</span>
                            </button>
                          </div>

                          <div className="pt-2.5 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                            {qual && (
                              <p className="flex items-center gap-2 text-slate-800 font-medium">
                                <GraduationCap size={14} className="text-[#363991] shrink-0" />
                                <span className="truncate">{qual}</span>
                              </p>
                            )}
                            {staff.email && (
                              <p className="flex items-center gap-2 text-slate-700">
                                <Mail size={13} className="text-[#363991] shrink-0" />
                                <a href={`mailto:${staff.email}`} className="text-blue-700 font-medium hover:underline truncate">
                                  {staff.email}
                                </a>
                              </p>
                            )}
                          </div>

                          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(staff)}
                              className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition"
                            >
                              Tap status to {staff.isPublished !== false ? "draft" : "publish"}
                            </button>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(staff)}
                                className="inline-flex min-h-[36px] items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition cursor-pointer"
                              >
                                <Pencil size={13} />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(staff)}
                                className="inline-flex min-h-[36px] items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Administration Pagination (5 members per page) */}
                  {adminStaff.length > ITEMS_PER_PAGE && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
                      <div className="font-medium">
                        Showing <span className="font-bold text-slate-900">{(adminPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
                        <span className="font-bold text-slate-900">{Math.min(adminPage * ITEMS_PER_PAGE, adminStaff.length)}</span> of{" "}
                        <span className="font-bold text-slate-900">{adminStaff.length}</span> administrative staff
                        <span className="ml-1.5 px-2 py-0.5 rounded-full bg-purple-100 text-[#363991] font-bold text-[10px]">
                          5 per page
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={adminPage <= 1}
                          onClick={() => setAdminPage((p) => Math.max(1, p - 1))}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        >
                          <ChevronLeft size={13} />
                          <span>Previous</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalAdminPages }, (_, i) => i + 1).map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setAdminPage(num)}
                              className={`h-7 min-w-[28px] px-1 text-xs font-bold rounded-md transition cursor-pointer ${
                                adminPage === num
                                  ? "bg-[#363991] text-white shadow-xs"
                                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          disabled={adminPage >= totalAdminPages}
                          onClick={() => setAdminPage((p) => Math.min(totalAdminPages, p + 1))}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        >
                          <span>Next</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* ADD / EDIT MODAL - FULLSCREEN ON MOBILE (PWA APP FEEL)         */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-stretch justify-stretch p-0 bg-white sm:bg-slate-900/60 sm:backdrop-blur-sm sm:items-center sm:justify-center sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] sm:h-auto sm:max-w-xl sm:max-h-[90vh] bg-white rounded-none sm:rounded-2xl border-0 sm:border border-slate-200 shadow-none sm:shadow-2xl overflow-hidden flex flex-col animate-in fade-in sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:py-4 border-b border-slate-100 bg-white sm:bg-slate-50/90 shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="sm:hidden p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  aria-label="Back"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#363991] border border-indigo-100 hidden sm:flex items-center justify-center shrink-0">
                  <UsersRound size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {editingMember ? "Edit Staff Member" : "Add Staff Member"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editingMember ? "Update faculty details and directory info" : "Enter staff details to add to college directory"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitForm} className="overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 flex-1 -webkit-overflow-scrolling-touch">
              {formError && (
                <div className="flex items-center gap-2 p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Staff Type Segmented Control */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Classification / Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        staffType: "Teaching Staff",
                      }))
                    }
                    className={`py-2 text-xs font-bold rounded-md transition cursor-pointer text-center ${
                      formData.staffType === "Teaching Staff"
                        ? "bg-white text-blue-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Teaching Faculty (Education)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        staffType: "Non-Teaching Staff",
                        imageUrl: "",
                      }));
                      setFormImageFile(null);
                      setImagePreview("");
                    }}
                    className={`py-2 text-xs font-bold rounded-md transition cursor-pointer text-center ${
                      formData.staffType === "Non-Teaching Staff"
                        ? "bg-white text-purple-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Administrative / Non-Teaching
                  </button>
                </div>
              </div>

              {/* 2. Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Dr. Savita Rathee or Mr. Anil Kumar"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-[#363991] focus:ring-1 focus:ring-[#363991]"
                />
              </div>

              {/* 3. Designation / Post */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Designation / Post <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      designation: e.target.value,
                    }))
                  }
                  placeholder="e.g. Principal, Associate Professor, Administrative Officer"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-[#363991] focus:ring-1 focus:ring-[#363991]"
                />
              </div>

              {/* 4. Subject / Specialization */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject / Specialization
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  placeholder="e.g. Pedagogy of Science or Campus Administration & Student Records"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-[#363991] focus:ring-1 focus:ring-[#363991]"
                />
              </div>

              {/* 5. Qualifications */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Qualifications (Degrees &amp; Certifications)
                </label>
                <input
                  type="text"
                  value={formData.qualifications}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      qualifications: e.target.value,
                    }))
                  }
                  placeholder="e.g. M.A., M.Ed., Ph.D. or M.Com., MBA"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-[#363991] focus:ring-1 focus:ring-[#363991]"
                />
              </div>

              {/* 6. Official Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="e.g. hsce.kanjhawala@gmail.com"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-[#363991] focus:ring-1 focus:ring-[#363991]"
                />
              </div>

              {/* 7. Photo Upload / URL - ONLY FOR TEACHING STAFF (Hidden for Non-Teaching Staff) */}
              {formData.staffType === "Teaching Staff" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Photo (Image URL or File Upload)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-16 rounded-md border border-slate-300 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={22} className="text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            imageUrl: e.target.value,
                          }));
                          setImagePreview(e.target.value);
                        }}
                        placeholder="Paste image URL (optional)"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-[#363991]"
                      />
                      <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#363991] hover:underline cursor-pointer">
                        <Upload size={12} />
                        <span>Upload image file</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormImageFile(file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. Publish Status Toggle */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Publish immediately
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Make visible on the public website faculty page
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPublished: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-[#363991] cursor-pointer"
                />
              </div>

              {/* Modal Actions */}
              <div className="shrink-0 p-4 sm:px-6 sm:py-4 bg-white sm:bg-slate-50/90 border-t border-slate-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sm:shadow-none flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 rounded-xl border border-slate-200 sm:border-transparent hover:bg-slate-100 transition cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 sm:py-2 text-xs sm:text-sm font-bold text-white bg-[#363991] hover:bg-[#2A3178] rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer text-center"
                >
                  {saving ? (
                    <>
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>{editingMember ? "Save Changes" : "Create Staff Record"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
